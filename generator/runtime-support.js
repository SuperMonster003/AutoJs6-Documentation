#!/usr/bin/env node
'use strict';

// Writes the "runtime support" tables at the top of the module pages (AutoJs6
// api-coverage roadmap D13 / P0.5) from the host's runtime coverage matrix
// (build/reports/api-coverage/runtime-matrix.json, schema autojs6-runtime-matrix-v1).
//
// A page opts in with a marker block; only the text between the markers is generated:
//
//   <!-- runtime-support:begin images -->
//   ...
//   <!-- runtime-support:end -->
//
// The words after "begin" are the module roots the block shows: an explicit export
// belongs to the root of its placement module, or of its owner module for a member of
// the global object (`captureScreen` -> images), "global" for the rest. This is the
// same root the host documentation gate (tools/api-coverage/check.py) searches pages by.
// Members of a module's Java prototype (`files.isFile`, roadmap Q18) count as its exports.
//
// Members of returned objects (`<Object>#<member>` rows, roadmap Q20) belong to the
// object's first documentation page (the row's `page`). A type page names the object
// with a trailing "#" (`<!-- runtime-support:begin ImageWrapper# -->`) and shows its
// members like a module; a module page lists the objects documented on it in a
// "返回对象" table, one line each.
//
// Usage:
//   node generator/runtime-support.js                  rewrite every block
//   node generator/runtime-support.js --check          exit 1 when a block differs
//   node generator/runtime-support.js --insert image:images
//                                                      add a block after the H1 title
//   options: --matrix <runtime-matrix.json> | --host <AutoJs6 checkout>, --api <dir>,
//            --json (machine summary on stdout), --require-all (fail on module roots without a
//            block and on returned objects no block shows)
//
// Comments in the block never contain "=": json.js reads `<!-- key=value -->` as page metadata.

const fs = require('fs');
const path = require('path');

const SCHEMA = 'autojs6-runtime-matrix-v1';
const BEGIN = /^<!-- runtime-support:begin((?: [\w$.]+#?)*) -->$/;
const END = '<!-- runtime-support:end -->';
const MARKER = /<!-- runtime-support:/;
const SOURCE_NOTE = /^<!-- 本段由 generator\/runtime-support\.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 (\S+) -->$/;
const COLUMNS = ['node_main', 'node_worker', 'bun'];
const COMPAT = 'autojs6:compat';
const HEADERS = { node_main: 'Node.js 主线程', node_worker: 'Node.js Worker', bun: 'Bun' };
const SUPPORTED = ['bridged', 'local-shim', 'capability-gated'];
const STATUS_ORDER = ['bridged', 'local-shim', 'capability-gated', 'not-portable', 'denied', 'pending'];
const STATUS_WORDS = {
    'bridged': '已支持',
    'local-shim': '已支持 (本地实现)',
    'capability-gated': '需授权',
    'not-portable': '不适用',
    'denied': '不提供',
    'pending': '待补',
};
const REASON_WORDS = {
    'security': '安全限制',
    'sync-only': '依赖同步阻塞',
    'java-prototype': '需要 Java 对象',
    'runtime-native': '运行时自带等价功能',
    'runtime-builtin': '运行时内置模块限制',
    'rhino-only': '仅限 Rhino 引擎',
    'ui-thread': '需要 Rhino UI 线程',
    'obsoleted': '宿主已废弃',
};

function rowRoot(row) {
    return (row.module || row.ownerModule || 'global').split('.')[0];
}

function exportRows(matrix) {
    return matrix.rows.filter(row => row.kind === 'export' || row.kind === 'prototype-member');
}

function objectRows(matrix) {
    return matrix.rows.filter(row => row.kind === 'returned-member');
}

// Rows a block shows: the exports of its module roots and the members of its `<Object>#` roots.
function blockRows(matrix, roots) {
    const objects = roots.filter(root => root.endsWith('#'));
    return exportRows(matrix).filter(row => roots.includes(rowRoot(row)))
        .concat(objectRows(matrix).filter(row => objects.includes(row.object + '#')));
}

// Returned objects documented on a module page and not shown by a root of its own: [[object, rows]].
function pageObjects(matrix, roots, page) {
    const objects = new Map();
    if (!page || !roots.some(root => !root.endsWith('#'))) return [];
    objectRows(matrix).filter(row => row.page === page && !roots.includes(row.object + '#')).forEach(row => {
        if (!objects.has(row.object)) objects.set(row.object, []);
        objects.get(row.object).push(row);
    });
    return [...objects].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}

function code(text) {
    // Pipes would split the table cell; no matrix name or equivalent contains a backtick.
    return '`' + String(text).replace(/\|/g, '\\|') + '`';
}

function word(status, title) {
    return `<span title="${title || status}">${STATUS_WORDS[status]}</span>`;
}

// Entry module (Node) or client namespace (Bun) of a cell, null for a Bun client member.
function entryOf(column, cell) {
    return column === 'bun' ? cell.namespace || null : cell.module || null;
}

function entryText(column, cell) {
    if (column === 'bun') {
        return code(['host', cell.namespace, cell.member].filter(Boolean).join('.'));
    }
    return `${code(cell.member)} (${code(cell.module)})`;
}

// Rows found through the opt-in Rhino compatibility facade (roadmap Q15), whether by member path or as a global module.
function isCompat(cell) {
    return cell.via === 'compat' || cell.module === COMPAT;
}

// Rows that runtime-policy.json memberAliases map to a member of another module (roadmap Q28: the
// automator Toolkit helpers through flow) name that module like the compat facade.
function aliasText(column, cell) {
    if (cell.via !== 'member-alias') return '';
    const entry = entryOf(column, cell);
    return `, 经 ${entry ? entry.replace(/^autojs6:/, '') : 'host'}`;
}

function cellKey(column, cell) {
    return JSON.stringify([cell.status, entryOf(column, cell), cell.capability || null, isCompat(cell)]);
}

// An internal export (rule internal-exports, roadmap Q13) is no script API, so it does not keep a column from reading as one cell.
function isInternal(cell) {
    return cell.rule === 'internal-exports';
}

function counted(values) {
    const counts = new Map();
    values.forEach(value => counts.set(value, (counts.get(value) || 0) + 1));
    return [...counts].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}

function signature(row, column) {
    const cell = row[column];
    return JSON.stringify([cellKey(column, cell), cell.reason || null, cell.equivalent || null, cell.member === undefined || cell.member === row.member]);
}

// A column whose cells all read the same (all pending, say) is described by the upper table
// alone (roadmap Q21). Otherwise the state most supported cells share is the column default;
// cells that differ from it, and every cell without an entry, make their row a "difference".
function columnDefault(rows, column) {
    const keys = rows.map(row => row[column]).filter(cell => SUPPORTED.includes(cell.status)).map(cell => cellKey(column, cell));
    const key = keys.length ? counted(keys)[0][0] : null;
    return { key, entry: key && JSON.parse(key)[1], uniform: new Set(rows.filter(row => !isInternal(row[column])).map(row => signature(row, column))).size <= 1 };
}

function differs(row, column, defaults) {
    const cell = row[column];
    const columnState = defaults[column];
    if (columnState.uniform) return false;
    if (!SUPPORTED.includes(cell.status)) return true;
    return cellKey(column, cell) !== columnState.key || (cell.member !== undefined && cell.member !== row.member);
}

function exclusionText(cell) {
    const text = `(${REASON_WORDS[cell.reason] || cell.reason})`;
    return cell.equivalent ? `${text}, 等价写法: ${code(cell.equivalent)}` : text;
}

function cellText(row, column, defaults) {
    const cell = row[column];
    const status = cell.status;
    if (status === 'not-portable' || status === 'denied') return `${word(status, `${status}: ${cell.reason}`)} ${exclusionText(cell)}`;
    if (status === 'pending') return word(status);
    let text = word(status);
    if (status === 'capability-gated') text += cell.capability ? ' ' + code(cell.capability) : ' (能力待定)';
    if (isCompat(cell)) text += ', 经 compat';
    text += aliasText(column, cell);
    if (entryOf(column, cell) !== defaults[column].entry || cell.member !== row.member) text += ': ' + entryText(column, cell);
    return text;
}

function countsText(rows, column, defaults) {
    const counts = counted(rows.map(row => column === 'rhino' ? row.rhino : row[column].status));
    const text = STATUS_ORDER.concat(['native'])
        .map(status => counts.find(([value]) => value === status))
        .filter(Boolean)
        .map(([status, count]) => `${status === 'native' ? '已支持' : STATUS_WORDS[status]} ${count} 项`)
        .join(', ');
    const first = rows.length && column !== 'rhino' ? (rows.find(row => !isInternal(row[column])) || rows[0])[column] : null;
    const excluded = first && defaults[column].uniform && (first.status === 'not-portable' || first.status === 'denied');
    return excluded ? `${text} ${exclusionText(first)}` : text;
}

function rhinoEntry(rows) {
    const modules = counted(rows.filter(row => row.module).map(row => row.module)).map(([name]) => name).sort();
    const objects = counted(rows.filter(row => row.object).map(row => row.object)).map(([name]) => name).sort();
    const globals = rows.filter(row => !row.module && !row.object).length;
    const parts = modules.map(code).concat(objects.map(name => `${code(name)} 对象`));
    if (globals) parts.push(`全局 ${globals} 项`);
    return parts.join(', ');
}

// One line per object: like the 状态 row of the upper table, so a column of Java object members
// that are all "不适用 (需要 Java 对象)" reads as one cell (roadmap Q20 / Q21).
function objectLines(objects) {
    return objects.map(([object, rows]) => {
        const defaults = {};
        COLUMNS.forEach(column => { defaults[column] = columnDefault(rows, column); });
        const cells = ['rhino'].concat(COLUMNS).map(column => countsText(rows, column, defaults));
        return `| ${code(object)} (${rows.length} 项) | ${cells.join(' | ')} |`;
    });
}

function runtimeEntry(rows, column) {
    const cells = rows.map(row => row[column]).filter(cell => SUPPORTED.includes(cell.status));
    if (!cells.length) return '-';
    if (column === 'bun') {
        return counted(cells.map(cell => cell.namespace ? 'host.' + cell.namespace : 'host')).map(([name]) => code(name)).join(', ');
    }
    const names = counted(cells.map(cell => cell.module)).map(([name]) => name);
    const globals = counted(cells.filter(cell => cell.explicitGlobal).map(cell => cell.explicitGlobal)).map(([name]) => name);
    return names.concat(globals).map(name => code(name) + (name === COMPAT ? ' (经 compat)' : '')).join(', ');
}

function capabilityText(rows) {
    const capabilities = rows.map(row => row.bun).filter(cell => cell.status === 'capability-gated').map(cell => cell.capability || '');
    return counted(capabilities)
        .map(([name, count]) => `${name ? code(name) : '能力待定'} ${count} 项`)
        .join(', ');
}

// Placements of one function (`images.captureScreen`, `captureScreen`) share a line when their cells read the same.
function differenceLines(rows, defaults) {
    const lines = [];
    const byId = new Map();
    rows.filter(row => COLUMNS.some(column => differs(row, column, defaults))).forEach(row => {
        const cells = COLUMNS.map(column => cellText(row, column, defaults));
        const key = cells.join('\n');
        let line = (row.aliases || []).map(alias => byId.get(alias)).find(other => other && other.key === key);
        if (line) {
            line.ids.push(row.id);
        } else {
            line = { ids: [row.id], key, cells };
            lines.push(line);
        }
        byId.set(row.id, line);
    });
    return lines.map(line => {
        const ids = line.ids.slice().sort((a, b) => (b.includes('.') - a.includes('.')) || (a < b ? -1 : a > b ? 1 : 0));
        return `| ${ids.map(code).join(', ')} | ${line.cells.join(' | ')} |`;
    });
}

function renderBlock(matrix, roots, page) {
    const rows = blockRows(matrix, roots);
    const kind = (matrix.dataSource && matrix.dataSource.kind) || 'kotlin';
    const defaults = {};
    COLUMNS.forEach(column => { defaults[column] = columnDefault(rows, column); });
    const out = [
        `<!-- runtime-support:begin ${roots.join(' ')} -->`,
        `<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ${kind} -->`,
        '',
        '| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |',
        '| --- | --- | --- | --- | --- |',
        `| 入口 | ${rhinoEntry(rows)} | ${COLUMNS.map(column => runtimeEntry(rows, column)).join(' | ')} |`,
        `| 状态 | ${countsText(rows, 'rhino', defaults)} | ${COLUMNS.map(column => countsText(rows, column, defaults)).join(' | ')} |`,
    ];
    const capabilities = capabilityText(rows);
    if (capabilities) out.push(`| 授权 | - | - | - | ${capabilities} |`);
    out.push('');
    const lines = differenceLines(rows, defaults);
    if (lines.length) {
        out.push(`差异项 (${lines.length} 项): 下表列出入口, 状态或授权与同列多数 API 不同的 API, 未列出的 API 与同列多数一致.`);
        out.push('', '| API | Node.js 主线程 | Node.js Worker | Bun |', '| --- | --- | --- | --- |');
        out.push(...lines, '');
    } else {
        out.push('各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.', '');
    }
    const objects = pageObjects(matrix, roots, page);
    if (objects.length) {
        out.push(`返回对象 (${objects.length} 个): 本页说明的对象的成员状态, 每个对象一行.`);
        out.push('', '| 返回对象 | Rhino | Node.js 主线程 | Node.js Worker | Bun |', '| --- | --- | --- | --- | --- |');
        out.push(...objectLines(objects), '');
    }
    out.push('Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).', '', END);
    const objectRowCount = objects.reduce((sum, [, members]) => sum + members.length, 0);
    return { text: out.join('\n'), rows: rows.length, differences: lines.length, objects: objects.length, objectRows: objectRowCount };
}

// Marker blocks of a page: [{ start, end, roots, lines }] by line index, or a problem.
function findBlocks(lines) {
    const blocks = [];
    let open = null;
    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        if (!MARKER.test(line)) continue;
        const begin = line.match(BEGIN);
        if (begin) {
            if (open) return { problem: `line ${index + 1}: nested runtime-support:begin` };
            open = { start: index, roots: begin[1].trim().split(/\s+/).filter(Boolean) };
            if (!open.roots.length) return { problem: `line ${index + 1}: runtime-support:begin names no module` };
        } else if (line === END) {
            if (!open) return { problem: `line ${index + 1}: runtime-support:end without begin` };
            open.end = index;
            blocks.push(open);
            open = null;
        } else {
            return { problem: `line ${index + 1}: malformed runtime-support marker` };
        }
    }
    if (open) return { problem: `line ${open.start + 1}: runtime-support:begin without end` };
    if (blocks.length > 1) return { problem: `line ${blocks[1].start + 1}: more than one runtime-support block` };
    return { blocks };
}

function insertBlock(text, roots) {
    const lines = text.split('\n');
    let index = lines.findIndex(line => /^# /.test(line));
    if (index < 0) throw new Error('no H1 title to insert the runtime-support block after');
    // Keep page metadata comments (`<!-- type=misc -->`) next to the title.
    let next = index + 1;
    while (next < lines.length && (lines[next] === '' || /^<!--[^=]*=[^-]*-->$/.test(lines[next]))) next++;
    while (next > index + 1 && lines[next - 1] === '') next--;
    const block = ['', `<!-- runtime-support:begin ${roots.join(' ')} -->`, END];
    if (lines[next] !== '') block.push('');
    lines.splice(next, 0, ...block);
    return lines.join('\n');
}

// Returns { text, status: 'current' | 'stale' | 'skipped' | 'none', ... } for one page (`page`: its name, as `image`).
function updatePage(text, matrix, knownRoots, page) {
    const lf = text.replace(/\r\n/g, '\n');
    const lines = lf.split('\n');
    const found = findBlocks(lines);
    if (found.problem) return { status: 'problem', problem: found.problem };
    if (!found.blocks.length) return { status: 'none' };
    const block = found.blocks[0];
    const unknown = block.roots.filter(root => !knownRoots.has(root));
    if (unknown.length) return { status: 'problem', problem: `unknown module root: ${unknown.join(', ')}`, roots: block.roots };
    const rendered = renderBlock(matrix, block.roots, page);
    const actual = lines.slice(block.start, block.end + 1).join('\n');
    const updated = lines.slice(0, block.start).concat(rendered.text.split('\n'), lines.slice(block.end + 1)).join('\n');
    const result = { roots: block.roots, rows: rendered.rows, differences: rendered.differences, objectRows: rendered.objectRows, text: updated, line: block.start + 1 };
    if (actual === rendered.text) return Object.assign(result, { status: 'current' });
    const note = lines[block.start + 1] && lines[block.start + 1].match(SOURCE_NOTE);
    const kind = (matrix.dataSource && matrix.dataSource.kind) || 'kotlin';
    // Like MATRIX.md: a block generated from the other export source (ksp / kotlin) is not compared.
    return Object.assign(result, { status: note && note[1] !== kind ? 'skipped' : 'stale', blockSource: note ? note[1] : null });
}

function readJson(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function defaultHost(generatorDir) {
    const config = path.join(generatorDir, 'local-config.json');
    if (fs.existsSync(config)) {
        const project = readJson(config).autoJs6Project;
        if (project) return project;
    }
    return path.resolve(generatorDir, '..', '..', 'AutoJs6');
}

function parseArgs(argv) {
    const args = { insert: [], check: false, json: false, requireAll: false };
    for (let index = 0; index < argv.length; index++) {
        const name = argv[index];
        const value = () => {
            if (index + 1 >= argv.length) throw new Error(`${name} needs a value`);
            return argv[++index];
        };
        if (name === '--check') args.check = true;
        else if (name === '--json') args.json = true;
        else if (name === '--require-all') args.requireAll = true;
        else if (name === '--matrix') args.matrix = value();
        else if (name === '--host') args.host = value();
        else if (name === '--api') args.api = value();
        else if (name === '--insert') {
            const [page, roots] = value().split(':');
            if (!page || !roots) throw new Error('--insert takes <page>:<module>[,<module>...]');
            args.insert.push({ page, roots: roots.split(',') });
        } else throw new Error(`unknown argument: ${name}`);
    }
    if (args.check && args.insert.length) throw new Error('--check and --insert are mutually exclusive');
    return args;
}

function run(args) {
    const generatorDir = __dirname;
    const api = path.resolve(args.api || path.join(generatorDir, '..', 'api'));
    const matrixPath = path.resolve(args.matrix || path.join(args.host || defaultHost(generatorDir), 'build', 'reports', 'api-coverage', 'runtime-matrix.json'));
    const matrix = readJson(matrixPath);
    if (matrix.schema !== SCHEMA) throw new Error(`${matrixPath}: schema ${matrix.schema}, expected ${SCHEMA}`);
    const moduleRoots = new Set(exportRows(matrix).map(rowRoot));
    const knownRoots = new Set([...moduleRoots, ...objectRows(matrix).map(row => row.object + '#')]);
    const summary = { matrix: matrixPath, dataSource: (matrix.dataSource && matrix.dataSource.kind) || 'kotlin', mode: args.check ? 'check' : 'write', pages: [], problems: [], uncovered: [], uncoveredObjects: [] };
    const covered = new Set();
    // Pages whose block names a module root: their "返回对象" table shows the objects documented first on them.
    const modulePages = new Set();
    const inserts = new Map(args.insert.map(item => [item.page, item.roots]));
    inserts.forEach((_, page) => {
        if (!fs.existsSync(path.join(api, page + '.md'))) summary.problems.push(`api/${page}.md: no such page for --insert`);
    });
    fs.readdirSync(api).filter(name => name.endsWith('.md')).sort().forEach(name => {
        const page = name.slice(0, -3);
        const file = path.join(api, name);
        let text = fs.readFileSync(file, 'utf8');
        const found = findBlocks(text.replace(/\r\n/g, '\n').split('\n'));
        const inserted = inserts.has(page) && found.blocks && !found.blocks.length;
        if (inserted) text = insertBlock(text.replace(/\r\n/g, '\n'), inserts.get(page));
        const result = updatePage(text, matrix, knownRoots, page);
        if (result.status === 'none') return;
        (result.roots || []).forEach(root => covered.add(root));
        if ((result.roots || []).some(root => !root.endsWith('#'))) modulePages.add(page);
        const entry = { page: `api/${name}`, status: result.status, roots: result.roots, rows: result.rows, differences: result.differences, objectRows: result.objectRows, line: result.line };
        if (result.status === 'problem') {
            summary.problems.push(`api/${name}: ${result.problem}`);
        } else if (!args.check && result.status !== 'current') {
            fs.writeFileSync(file, result.text, 'utf8');
            entry.status = inserted ? 'inserted' : 'written';
        } else if (args.check && result.status === 'stale') {
            summary.problems.push(`api/${name}: runtime-support block differs from the matrix (run node generator/runtime-support.js)`);
        }
        summary.pages.push(entry);
    });
    summary.uncovered = [...moduleRoots].filter(root => !covered.has(root)).sort();
    const objectPages = new Map(objectRows(matrix).map(row => [row.object + '#', row.page]));
    summary.uncoveredObjects = [...objectPages].filter(([root, page]) => !covered.has(root) && !modulePages.has(page)).map(([root]) => root).sort();
    if (args.requireAll && summary.uncovered.length) {
        summary.problems.push(`module roots without a runtime-support block: ${summary.uncovered.join(', ')}`);
    }
    if (args.requireAll && summary.uncoveredObjects.length) {
        summary.problems.push(`returned objects shown by no runtime-support block (a root of their own, or the module block of their page): ${summary.uncoveredObjects.join(', ')}`);
    }
    return summary;
}

function main() {
    let args;
    let summary;
    try {
        args = parseArgs(process.argv.slice(2));
        summary = run(args);
    } catch (error) {
        console.error(`runtime-support: ${error.message}`);
        return 2;
    }
    if (args.json) {
        console.log(JSON.stringify(summary, null, 2));
    } else {
        summary.pages.forEach(page => console.log(`${page.page}: ${page.status} (${(page.roots || []).join(' ')}, rows ${page.rows}, differences ${page.differences})`));
        summary.problems.forEach(problem => console.error(`runtime-support: ${problem}`));
        console.log(`runtime-support ${summary.mode}: pages=${summary.pages.length}, problems=${summary.problems.length}, uncovered roots=${summary.uncovered.length}, uncovered objects=${summary.uncoveredObjects.length}`);
    }
    return summary.problems.length ? 1 : 0;
}

module.exports = { renderBlock, updatePage, insertBlock, findBlocks, rowRoot, run };

if (require.main === module) {
    process.exitCode = main();
}
