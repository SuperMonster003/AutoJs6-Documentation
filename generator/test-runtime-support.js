#!/usr/bin/env node
'use strict';

// Self-test of runtime-support.js on a synthetic matrix: node generator/test-runtime-support.js

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const runtimeSupport = require('./runtime-support.js');

const bridged = (module, member, extra) => Object.assign({ status: 'bridged', module, member, async: true, via: 'same-name' }, extra);
const gated = (namespace, member, capability, extra) => Object.assign({ status: 'capability-gated', namespace, member, capability, async: true, via: 'same-name' }, extra);
const pending = { status: 'pending' };
const legacy = { status: 'not-portable', reason: 'sync-only', equivalent: 'await x()', rule: 'sync' };

function row(id, module, member, cells, extra) {
    return Object.assign({
        id, kind: 'export', module, member, ownerModule: module || 'demo', aliases: [], rhino: 'native',
        node_main: cells[0], node_worker: cells[1], bun: cells[2],
    }, extra);
}

function matrix(kind) {
    return {
        schema: 'autojs6-runtime-matrix-v1',
        dataSource: { kind: kind || 'ksp' },
        rows: [
            row('capture', '', 'capture', [bridged('autojs6:demo', 'capture', { via: 'owner-module' }), bridged('autojs6:demo', 'capture', { via: 'owner-module' }), gated('demo', 'capture', 'screen.capture', { via: 'owner-module' })], { aliases: ['demo.capture'] }),
            row('demo.capture', 'demo', 'capture', [bridged('autojs6:demo', 'capture'), bridged('autojs6:demo', 'capture'), gated('demo', 'capture', 'screen.capture')], { aliases: ['capture'] }),
            row('demo.read', 'demo', 'read', [bridged('autojs6:demo', 'read'), bridged('autojs6:demo', 'read'), gated('demo', 'read', 'demo.process')]),
            row('demo.size', 'demo', 'size', [bridged('autojs6:demo', 'size'), bridged('autojs6:demo', 'size'), gated('demo', 'size', 'demo.process')]),
            row('demo.sleep', 'demo', 'sleep', [bridged('autojs6:compat', 'demo.sleep', { via: 'compat' }), { status: 'not-portable', reason: 'runtime-native', equivalent: 'a | b', rule: 'r' }, { status: 'denied', reason: 'sync-only' }]),
            row('demo.later', 'demo', 'later', [pending, pending, gated('demo', 'later')]),
            row('other.x', 'other', 'x', [pending, pending, pending]),
            row('legacy.a', 'legacy', 'a', [legacy, legacy, pending]),
            row('legacy.b', 'legacy', 'b', [legacy, legacy, pending]),
            row('Thing#member', null, 'member', [pending, pending, pending], { kind: 'returned-member', ownerModule: null, object: 'Thing', page: 'demo' }),
        ],
    };
}

function test(name, body) {
    body();
    console.log(`ok - ${name}`);
}

test('rows of a root: placement module, owner of global members, no returned members', () => {
    const block = runtimeSupport.renderBlock(matrix(), ['demo']);
    assert.strictEqual(block.rows, 6);
    assert.ok(!block.text.includes('Thing#member') && !block.text.includes('other.x'));
    assert.ok(block.text.includes('| 入口 | `demo`, 全局 1 项 | `autojs6:demo`, `autojs6:compat` (经 compat) | `autojs6:demo` | `host.demo` |'));
    assert.ok(block.text.includes('| 状态 | 已支持 6 项 | 已支持 5 项, 待补 1 项 | 已支持 4 项, 不适用 1 项, 待补 1 项 | 需授权 5 项, 不提供 1 项 |'));
    assert.ok(block.text.includes('| 授权 | - | - | - | `demo.process` 2 项, `screen.capture` 2 项, 能力待定 1 项 |'));
});

test('differences: other capability, compat, exclusions with equivalents, pending; placements merged', () => {
    const block = runtimeSupport.renderBlock(matrix(), ['demo']);
    const lines = block.text.split('\n').filter(line => line.startsWith('| `'));
    assert.strictEqual(block.differences, 3);
    assert.deepStrictEqual(lines.map(line => line.split(' | ')[0]), ['| `demo.capture`, `capture`', '| `demo.sleep`', '| `demo.later`']);
    assert.ok(lines[0].endsWith('<span title="capability-gated">需授权</span> `screen.capture` |'));
    assert.ok(lines[1].includes('<span title="bridged">已支持</span>, 经 compat: `demo.sleep` (`autojs6:compat`)'));
    assert.ok(lines[1].includes('<span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `a \\| b`'));
    assert.ok(lines[1].includes('<span title="denied: sync-only">不提供</span> (依赖同步阻塞) |'));
    assert.ok(lines[2].includes('需授权</span> (能力待定) |'));
    assert.ok(!block.text.includes('`demo.read`'), 'rows in the column majority state are not listed');
});

test('member aliases name the module they go through', () => {
    const alias = { via: 'member-alias' };
    const data = matrix();
    data.rows.push(
        row('tool.tap', 'tool', 'tap', [bridged('accessibility', 'tap'), bridged('accessibility', 'tap'), gated('accessibility', 'tap', 'a11y.control')]),
        row('tool.clickAny', 'tool', 'clickAny', [bridged('autojs6:flow', 'clickAny', alias), bridged('autojs6:flow', 'clickAny', alias), gated('flow', 'clickAny', 'flow.control', alias)]),
    );
    const lines = runtimeSupport.renderBlock(data, ['tool']).text.split('\n').filter(line => line.startsWith('| `tool.clickAny`'));
    assert.strictEqual(lines.length, 1);
    assert.ok(lines[0].includes('<span title="bridged">已支持</span>, 经 flow: `clickAny` (`autojs6:flow`)'), lines[0]);
    assert.ok(lines[0].includes('<span title="capability-gated">需授权</span> `flow.control`, 经 flow: `host.flow.clickAny`'), lines[0]);
});

test('a column whose cells all read the same is described above only', () => {
    const pendingOnly = runtimeSupport.renderBlock(matrix(), ['other']);
    assert.strictEqual(pendingOnly.differences, 0);
    assert.ok(pendingOnly.text.includes('| 状态 | 已支持 1 项 | 待补 1 项 | 待补 1 项 | 待补 1 项 |'));
    assert.ok(pendingOnly.text.includes('没有差异项'));
    const excluded = runtimeSupport.renderBlock(matrix(), ['legacy']);
    assert.strictEqual(excluded.differences, 0);
    assert.ok(excluded.text.includes('| 状态 | 已支持 2 项 | 不适用 2 项 (依赖同步阻塞), 等价写法: `await x()` | 不适用 2 项 (依赖同步阻塞), 等价写法: `await x()` | 待补 2 项 |'));
    const mixed = runtimeSupport.renderBlock(matrix(), ['other', 'legacy']);
    assert.strictEqual(mixed.differences, 3, 'not uniform once the roots are shown together');
});

test('prototype members count as exports of their module', () => {
    const data = matrix();
    data.rows.push(row('other.y', 'other', 'y', [pending, pending, pending], { kind: 'prototype-member', registration: '@ScriptPrototype' }));
    const block = runtimeSupport.renderBlock(data, ['other']);
    assert.strictEqual(block.rows, 2);
    assert.ok(block.text.includes('| 状态 | 已支持 2 项 | 待补 2 项 | 待补 2 项 | 待补 2 项 |'));
});

test('an internal export does not keep a column from reading as one cell', () => {
    const excluded = { status: 'not-portable', reason: 'rhino-only', equivalent: 'engines.execScript', rule: 'demo-rule' };
    const internal = { status: 'not-portable', reason: 'rhino-only', rule: 'internal-exports' };
    const data = matrix();
    data.rows = [
        row('solo.__id', 'solo', '__id', [internal, internal, internal]),
        row('solo.begin', 'solo', 'begin', [excluded, excluded, excluded]),
        row('solo.end', 'solo', 'end', [excluded, excluded, excluded]),
    ];
    const block = runtimeSupport.renderBlock(data, ['solo'], 'solo');
    assert.strictEqual(block.rows, 3);
    assert.strictEqual(block.differences, 0, block.text);
    assert.ok(block.text.includes('不适用 3 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript`'), block.text);
});

test('returned objects: their own block on a type page, one line each on the module page', () => {
    const java = { status: 'not-portable', reason: 'java-prototype', rule: 'java-prototype-objects' };
    const data = matrix();
    data.rows.push(
        row('Thing#other', null, 'other', [bridged('autojs6:demo', 'other'), pending, pending], { kind: 'returned-member', ownerModule: null, object: 'Thing', page: 'demo' }),
        row('Mat#release', null, 'release', [java, java, java], { kind: 'returned-member', ownerModule: null, object: 'Mat', page: 'demo' }),
        row('Mat#convertTo', null, 'convertTo', [java, java, java], { kind: 'returned-member', ownerModule: null, object: 'Mat', page: 'demo' }),
        row('Card#flip', null, 'flip', [pending, pending, pending], { kind: 'returned-member', ownerModule: null, object: 'Card', page: 'cardType' }),
    );
    const own = runtimeSupport.renderBlock(data, ['Card#'], 'cardType');
    assert.strictEqual(own.rows, 1);
    assert.strictEqual(own.objectRows, 0);
    assert.ok(own.text.includes('| 入口 | `Card` 对象 | - | - | - |'), own.text);
    assert.ok(!own.text.includes('返回对象'));
    const modulePage = runtimeSupport.renderBlock(data, ['demo'], 'demo');
    assert.strictEqual(modulePage.rows, 6, 'the objects do not join the upper table');
    assert.strictEqual(modulePage.objects, 2);
    assert.strictEqual(modulePage.objectRows, 4);
    const lines = modulePage.text.split('\n').filter(line => line.startsWith('| `Mat`') || line.startsWith('| `Thing`'));
    assert.deepStrictEqual(lines, [
        '| `Mat` (2 项) | 已支持 2 项 | 不适用 2 项 (需要 Java 对象) | 不适用 2 项 (需要 Java 对象) | 不适用 2 项 (需要 Java 对象) |',
        '| `Thing` (2 项) | 已支持 2 项 | 已支持 1 项, 待补 1 项 | 待补 2 项 | 待补 2 项 |',
    ]);
    assert.ok(!runtimeSupport.renderBlock(data, ['demo', 'Thing#'], 'demo').text.includes('| `Thing` ('), 'an object with its own root is not listed again');
    assert.ok(!runtimeSupport.renderBlock(data, ['demo'], 'other').text.includes('返回对象'));
    const known = new Set(['demo', 'Card#']);
    const card = '# Card\n\n<!-- runtime-support:begin Card# -->\n<!-- runtime-support:end -->\n';
    assert.strictEqual(runtimeSupport.updatePage(card, data, known, 'cardType').status, 'stale');
    assert.strictEqual(runtimeSupport.updatePage(card.replace('Card#', 'Cards#'), data, known, 'cardType').status, 'problem');
});

test('block comments never carry json.js page metadata', () => {
    const block = runtimeSupport.renderBlock(matrix(), ['demo', 'other']);
    (block.text.match(/<!--[\s\S]*?-->/g) || []).forEach(comment => assert.ok(!comment.includes('='), comment));
    assert.ok(/^[\x20-\x7e一-鿿\n]*$/.test(block.text.replace(/<[^>]*>/g, '')), 'ASCII punctuation only');
});

test('insert after the title and its metadata comments, then update and compare', () => {
    const known = new Set(['demo', 'other']);
    const page = '# Demo\n\n<!-- type=module -->\n\nIntro.\n';
    const inserted = runtimeSupport.insertBlock(page, ['demo']);
    assert.strictEqual(inserted, '# Demo\n\n<!-- type=module -->\n\n<!-- runtime-support:begin demo -->\n<!-- runtime-support:end -->\n\nIntro.\n');
    const stale = runtimeSupport.updatePage(inserted, matrix(), known);
    assert.strictEqual(stale.status, 'stale');
    assert.strictEqual(runtimeSupport.updatePage(stale.text, matrix(), known).status, 'current');
    assert.strictEqual(runtimeSupport.updatePage(stale.text.replace(/\n/g, '\r\n'), matrix(), known).status, 'current');
    assert.ok(stale.text.endsWith('<!-- runtime-support:end -->\n\nIntro.\n'));
    assert.strictEqual(runtimeSupport.insertBlock('# Demo\nIntro.\n', ['demo']), '# Demo\n\n<!-- runtime-support:begin demo -->\n<!-- runtime-support:end -->\n\nIntro.\n');
    assert.strictEqual(runtimeSupport.updatePage(stale.text, matrix('kotlin'), known).status, 'skipped');
    assert.strictEqual(runtimeSupport.updatePage(stale.text.replace('已支持 6 项', '已支持 7 项'), matrix(), known).status, 'stale');
});

test('malformed markers and unknown roots are problems', () => {
    const known = new Set(['demo']);
    const cases = {
        '<!-- runtime-support:begin demo -->\n': 'without end',
        '<!-- runtime-support:end -->\n': 'without begin',
        '<!-- runtime-support:begin -->\n<!-- runtime-support:end -->\n': 'names no module',
        '<!-- runtime-support:begin demo -->\n<!-- runtime-support:begin demo -->\n': 'nested',
        '<!-- runtime-support:begin demo-->\n': 'malformed',
        '<!-- runtime-support:begin demo -->\n<!-- runtime-support:end -->\n<!-- runtime-support:begin demo -->\n<!-- runtime-support:end -->\n': 'more than one',
        '<!-- runtime-support:begin nothing -->\n<!-- runtime-support:end -->\n': 'unknown module root',
    };
    Object.entries(cases).forEach(([text, problem]) => {
        const result = runtimeSupport.updatePage('# Demo\n\n' + text, matrix(), known);
        assert.strictEqual(result.status, 'problem', text);
        assert.ok(result.problem.includes(problem), result.problem);
    });
    assert.strictEqual(runtimeSupport.updatePage('# Demo\n', matrix(), known).status, 'none');
});

test('command: --insert writes, --check passes, edits and --require-all fail', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'runtime-support-'));
    try {
        const api = path.join(root, 'api');
        fs.mkdirSync(api);
        fs.writeFileSync(path.join(api, 'demo.md'), '# Demo\n\nIntro.\n');
        fs.writeFileSync(path.join(api, 'plain.md'), '# Plain\n');
        const matrixPath = path.join(root, 'runtime-matrix.json');
        fs.writeFileSync(matrixPath, JSON.stringify(matrix()));
        const base = { matrix: matrixPath, api, check: false, json: true, requireAll: false, insert: [] };
        const written = runtimeSupport.run(Object.assign({}, base, { insert: [{ page: 'demo', roots: ['demo'] }] }));
        assert.deepStrictEqual(written.pages.map(page => [page.page, page.status]), [['api/demo.md', 'inserted']]);
        assert.deepStrictEqual(written.problems, []);
        assert.deepStrictEqual(runtimeSupport.run(Object.assign({}, base, { check: true })).problems, []);
        assert.deepStrictEqual(runtimeSupport.run(Object.assign({}, base, { check: true })).uncovered, ['legacy', 'other']);
        assert.deepStrictEqual(runtimeSupport.run(Object.assign({}, base, { check: true })).uncoveredObjects, [], 'Thing is in the demo page table');
        assert.strictEqual(runtimeSupport.run(Object.assign({}, base, { check: true, requireAll: true })).problems.length, 1);
        const file = path.join(api, 'demo.md');
        fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('待补 1 项', '待补 2 项'));
        assert.strictEqual(runtimeSupport.run(Object.assign({}, base, { check: true })).problems.length, 1);
        assert.strictEqual(runtimeSupport.run(base).pages[0].status, 'written');
        assert.deepStrictEqual(runtimeSupport.run(Object.assign({}, base, { check: true })).problems, []);
        assert.strictEqual(fs.readFileSync(path.join(api, 'plain.md'), 'utf8'), '# Plain\n');
        // An object documented first on a type page needs a root of its own there.
        const data = matrix();
        data.rows.push(row('Card#flip', null, 'flip', [pending, pending, pending], { kind: 'returned-member', ownerModule: null, object: 'Card', page: 'cardType' }));
        fs.writeFileSync(matrixPath, JSON.stringify(data));
        fs.writeFileSync(path.join(api, 'cardType.md'), '# Card\n');
        runtimeSupport.run(base);
        const missing = runtimeSupport.run(Object.assign({}, base, { check: true, requireAll: true }));
        assert.deepStrictEqual(missing.uncoveredObjects, ['Card#']);
        assert.ok(missing.problems.some(problem => problem.startsWith('returned objects shown by no runtime-support block') && problem.endsWith(': Card#')), missing.problems.join('\n'));
        runtimeSupport.run(Object.assign({}, base, { insert: [{ page: 'cardType', roots: ['Card#'] }] }));
        assert.deepStrictEqual(runtimeSupport.run(Object.assign({}, base, { check: true })).uncoveredObjects, []);
    } finally {
        fs.rmSync(root, { recursive: true, force: true });
    }
});
