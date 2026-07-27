// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

const common = require('./common.js');
const fs = require('fs');
const marked = require('marked');
const path = require('path');
const preprocess = require('./preprocess.js');
const typeParser = require('./type-parser.js');

let options = {};
let linkFilenameStack = [];

// @Overwrite by SuperMonster003 on Jul 27, 2022.
marked.Renderer.prototype.link = function (href, title, text) {
    if (this.options.sanitize) {
        try {
            var prot = decodeURIComponent(unescape(href))
                .replace(/[^\w:]/g, '')
                .toLowerCase();
        } catch (e) {
            return text;
        }
        if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
            return text;
        }
    }

    var baseUrls = {};
    var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

    function resolveUrl(base, href) {
        if (!baseUrls[' ' + base]) {
            // we can ignore everything in base after the last slash of its path component,
            // but we might need to add _that_
            // https://tools.ietf.org/html/rfc3986#section-3
            if (/^[^:]+:\/*[^/]*$/.test(base)) {
                baseUrls[' ' + base] = base + '/';
            } else {
                baseUrls[' ' + base] = base.replace(/[^/]*$/, '');
            }
        }
        base = baseUrls[' ' + base];

        if (href.slice(0, 2) === '//') {
            return base.replace(/:[\s\S]*/, ':') + href;
        }
        if (href.charAt(0) === '/') {
            return base.replace(/(:\/*[^/]*)[\s\S]*/, '$1') + href;
        }
        return base + href;
    }

    if (this.options.baseUrl && !originIndependentUrl.test(href)) {
        href = resolveUrl(this.options.baseUrl, href);
    }

    ( /* @IIFE */ function appendHTMLExt() {
        if (!href.endsWith('/') && !href.match(/^https?:\/\//) && !href.match(/\?\w+=\w+/) && !/\.html#/.test(href)) {
            href = href.trim().replace(/^(.+?)(\.html)?(#.+)?$/, '$1.html$3');
        }
    })();

    if (href.startsWith('#')) {

        // #m-select
        // #uiobjectactionstype_m_select

        const activeFilename = linkFilenameStack[0] || options.filename;
        const fileName = path.basename(activeFilename, '.md');
        href = '#' + resolveHeadingId(
            fileName,
            href.replace(/^#|\.html$/g, ''),
            options.linkMaps,
        );
    } else if (
        !/^[a-z][a-z0-9+.-]*:/i.test(href) &&
        !href.startsWith('//') &&
        href.includes('.html#')
    ) {

        // uiObjectActionsType.html#m-select
        // uiObjectActionsType.html#uiobjectactionstype_m_select

        const separatorIndex = href.indexOf('.html#');
        const fileName = href.slice(0, separatorIndex);
        const anchor = href.slice(separatorIndex + '.html#'.length);
        const targetName = path.basename(fileName);
        href = fileName + '.html#' + resolveHeadingId(
            targetName,
            anchor,
            options.linkMaps,
        );
    }
    var out = '<a href="' + href + '"';
    if (title) {
        out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
};

const originalHtmlRenderer = marked.Renderer.prototype.html;
marked.Renderer.prototype.html = function (html) {
    const startInclude = html.match(/^\s*<!-- \[start-include:(.+)\] -->\s*$/);
    if (startInclude) {
        linkFilenameStack.unshift(startInclude[1]);
    } else if (/^\s*<!-- \[end-include:(.+)\] -->\s*$/.test(html)) {
        linkFilenameStack.shift();
    }
    return originalHtmlRenderer.call(this, html);
};

module.exports = toHTML;
module.exports.buildLinkMaps = buildLinkMaps;

const STABILITY_TEXT_REG_EXP = /(.*:)\s*(\d)([\s\S]*)/;

// customized heading without id attribute
const renderer = new marked.Renderer();
renderer.heading = function (text, level) {
    return '<h' + level + '>' + text + '</h' + level + '>\n';
};
marked.setOptions({ renderer });

// TODO(chrisdickinson): never stop vomitting / fix this.
const gtocPath = path.resolve(path.join(
    __dirname,
    '..',
    'api',
    'toc.md',
));
var gtocLoading = null;
var gtocData = null;

/**
 * opts: input, filename, template, nodeVersion.
 */
function toHTML(opts, cb) {
    options = opts;
    const template = opts.template;
    const nodeVersion = opts.nodeVersion || process.version;

    if (gtocData) {
        return onGtocLoaded();
    }

    if (gtocLoading === null) {
        gtocLoading = [ onGtocLoaded ];
        return loadGtoc(function (err, data) {
            if (err) throw err;
            gtocData = data;
            gtocLoading.forEach(function (xs) {
                xs();
            });
        });
    }

    if (gtocLoading) {
        return gtocLoading.push(onGtocLoaded);
    }

    function onGtocLoaded() {
        const lexed = marked.lexer(opts.input);
        fs.readFile(template, 'utf8', function (er, template) {
            if (er) return cb(er);
            render({
                lexed: lexed,
                filename: opts.filename,
                template: template,
                nodeVersion: nodeVersion,
                analytics: opts.analytics,
            }, cb);
        });
    }
}

function loadGtoc(cb) {
    fs.readFile(gtocPath, 'utf8', function (err, data) {
        if (err) return cb(err);

        preprocess(gtocPath, data, function (err, data) {
            if (err) return cb(err);

            data = (typeof marked.marked === 'function' ? marked.marked : marked)(data).replace(/<a href="(.*?)"/gm, function (a, m) {
                return '<a class="nav-' + toID(m) + '" href="' + m + '"';
            });
            return cb(null, data);
        });
    });
}

function toID(filename) {
    return filename
        .replace('.html', '')
        .replace(/[^\w-]/g, '-')
        .replace(/-+/g, '-');
}

/**
 * opts: lexed, filename, template, nodeVersion.
 */
function render(opts, cb) {
    var lexed = opts.lexed;
    var filename = opts.filename;
    var template = opts.template;
    const nodeVersion = opts.nodeVersion || process.version;

    // get the section
    const section = getSection(lexed);

    filename = path.basename(filename, '.md');
    linkFilenameStack = [];
    resetHeadingIds();

    parseText(lexed);
    lexed = parseLists(lexed);

    // generate the table of contents.
    // this mutates the lexed contents in-place.
    buildToc(lexed, filename, function (er, toc) {
        if (er) return cb(er);

        const id = toID(path.basename(filename));

        template = template.replace(/__ID__/g, id);
        template = template.replace(/__FILENAME__/g, filename);
        template = template.replace(/__SECTION__/g, section || 'Index');
        template = template.replace(/__VERSION__/g, nodeVersion);
        template = template.replace(/__TOC__/g, toc);
        template = template.replace(
            /__GTOC__/g,
            gtocData.replace('class="nav-' + id, 'class="nav-' + id + ' active'),
        );

        if (opts.analytics) {
            template = template.replace(
                '<!-- __TRACKING__ -->',
                analyticsScript(opts.analytics),
            );
        }

        // content has to be the last thing we do with
        // the lexed tokens, because it's destructive.
        const content = marked.parser(lexed);
        // A replacement function keeps `$&`, `$'`, and similar text in
        // generated examples literal instead of interpreting it as a
        // String.replace substitution token.
        template = template.replace(/__CONTENT__/g, () => content);

        cb(null, template);
    });
}

function analyticsScript(analytics) {
    return `
    <script src="assets/dnt_helper.js"></script>
    <script>
      if (!_dntEnabled()) {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;
        i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},
        i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];
        a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,
        'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', '${analytics}', 'auto');
        ga('send', 'pageview');
      }
    </script>
  `;
}

// replace placeholders in text tokens
function replaceInText(text) {
    return linkJsTypeDocs(linkManPages(text));
}

// handle general body-text replacements
// for example, link man page references to the actual page
function parseText(lexed) {
    lexed.forEach(function (tok) {
        if (tok.type === 'table') {
            if (tok.cells) {
                tok.cells.forEach((row, x) => {
                    row.forEach((_, y) => {
                        if (tok.cells[x] && tok.cells[x][y]) {
                            tok.cells[x][y] = replaceInText(tok.cells[x][y]);
                        }
                    });
                });
            }

            if (tok.header) {
                tok.header.forEach((_, i) => {
                    if (tok.header[i]) {
                        tok.header[i] = replaceInText(tok.header[i]);
                    }
                });
            }
        } else if (tok.text && tok.type !== 'code') {
            tok.text = replaceInText(tok.text);
        }
    });
}

// just update the list item text in-place.
// lists that come right after a heading are what we're after.
function parseLists(input) {
    var state = null;
    const savedState = [];
    var depth = 0;
    const output = [];
    let headingIndex = -1;
    let heading = null;

    output.links = input.links;
    input.forEach(function (tok, index) {
        if (tok.type === 'blockquote_start') {
            savedState.push(state);
            state = 'MAYBE_STABILITY_BQ';
            return;
        }
        if (tok.type === 'blockquote_end' && state === 'MAYBE_STABILITY_BQ') {
            state = savedState.pop();
            return;
        }
        if ((tok.type === 'paragraph' && state === 'MAYBE_STABILITY_BQ') ||
            tok.type === 'code') {
            if (tok.text.match(/Stability:.*/g)) {
                const stabilityMatch = tok.text.match(STABILITY_TEXT_REG_EXP);
                const stability = Number(stabilityMatch[2]);
                const isStabilityIndex =
                    index - 2 === headingIndex || // general
                    index - 3 === headingIndex;   // with api_metadata block

                if (heading && isStabilityIndex) {
                    heading.stability = stability;
                    headingIndex = -1;
                    heading = null;
                }
                tok.text = parseAPIHeader(tok.text).replace(/\n/g, ' ');
                output.push({ type: 'html', text: tok.text });
                return;
            } else if (state === 'MAYBE_STABILITY_BQ') {
                output.push({ type: 'blockquote_start' });
                state = savedState.pop();
            }
        }
        if (state === null ||
            (state === 'AFTERHEADING' && tok.type === 'heading')) {
            if (tok.type === 'heading') {
                headingIndex = index;
                heading = tok;
                state = 'AFTERHEADING';
            }
            output.push(tok);
            return;
        }
        if (state === 'AFTERHEADING') {
            if (tok.type === 'list_start') {
                state = 'LIST';
                if (depth === 0) {
                    output.push({ type: 'html', text: '<div class="signature">' });
                }
                depth++;
                output.push(tok);
                return;
            }
            if (tok.type === 'html' && common.isYAMLBlock(tok.text)) {
                tok.text = parseYAML(tok.text);
            }
            state = null;
            output.push(tok);
            return;
        }
        if (state === 'LIST') {
            if (tok.type === 'list_start') {
                depth++;
                output.push(tok);
                return;
            }
            if (tok.type === 'list_end') {
                depth--;
                output.push(tok);
                if (depth === 0) {
                    state = null;
                    output.push({ type: 'html', text: '</div>' });
                }
                return;
            }
        }
        output.push(tok);
    });

    return output;
}

function parseYAML(text) {
    const meta = common.extractAndParseYAML(text);
    const html = [ '<div class="api_metadata">' ];

    const added = { description: '' };
    const deprecated = { description: '' };

    if (meta.added) {
        added.version = meta.added.join(', ');
        added.description = `<span>Added in: ${added.version}</span>`;
    }

    if (meta.deprecated) {
        deprecated.version = meta.deprecated.join(', ');
        deprecated.description =
            `<span>Deprecated since: ${deprecated.version}</span>`;
    }

    if (meta.changes.length > 0) {
        let changes = meta.changes.slice();
        if (added.description) changes.push(added);
        if (deprecated.description) changes.push(deprecated);

        changes = changes.sort((a, b) => versionSort(a.version, b.version));

        html.push('<details class="changelog"><summary>History</summary>');
        html.push('<table>');
        html.push('<tr><th>Version</th><th>Changes</th></tr>');

        changes.forEach((change) => {
            html.push(`<tr><td>${change.version}</td>`);
            html.push(`<td>${(typeof marked.marked === 'function' ? marked.marked : marked)(change.description)}</td></tr>`);
        });

        html.push('</table>');
        html.push('</details>');
    } else {
        html.push(`${added.description}${deprecated.description}`);
    }

    html.push('</div>');
    return html.join('\n');
}

// Syscalls which appear in the docs, but which only exist in BSD / OSX
const BSD_ONLY_SYSCALLS = new Set([ 'lchmod' ]);

// Handle references to man pages, eg "open(2)" or "lchmod(2)"
// Returns modified text, with such refs replace with HTML links, for example
// '<a href="http://man7.org/linux/man-pages/man2/open.2.html">open(2)</a>'
function linkManPages(text) {
    if (typeof text === 'object') {
        text = text.text;
    }

    return text.replace(
        / ([a-z.]+)\((\d)([a-z]?)\)/gm,
        (match, name, number, optionalCharacter) => {
            // name consists of lowercase letters, number is a single digit
            const displayAs = `${name}(${number}${optionalCharacter})`;
            if (BSD_ONLY_SYSCALLS.has(name)) {
                return ` <a href="https://www.freebsd.org/cgi/man.cgi?query=${name}` +
                    `&sektion=${number}">${displayAs}</a>`;
            } else {
                return ` <a href="http://man7.org/linux/man-pages/man${number}` +
                    `/${name}.${number}${optionalCharacter}.html">${displayAs}</a>`;
            }
        });
}

function linkJsTypeDocs(text) {
    const parts = text.split('`');
    var i;
    var typeMatches;

    // Handle types, for example the source Markdown might say
    // "This argument should be a {Number} or {String}"
    for (i = 0; i < parts.length; i += 2) {
        typeMatches = parts[i].match(/\{([^}]+)\}/g);
        if (typeMatches) {
            typeMatches.forEach(function (typeMatch) {
                parts[i] = parts[i].replace(typeMatch, typeParser.toLink(typeMatch));
            });
        }
    }

    //XXX maybe put more stuff here?
    return parts.join('`');
}

function parseAPIHeader(text) {
    const classNames = 'api_stability api_stability_$2';
    const docsUrl = 'documentation.html#documentation_stability_index';

    text = text.replace(
        STABILITY_TEXT_REG_EXP,
        `<div class="${classNames}"><a href="${docsUrl}">$1 $2</a>$3</div>`,
    );
    return text;
}

// section is just the first heading
function getSection(lexed) {
    for (var i = 0, l = lexed.length; i < l; i++) {
        var tok = lexed[i];
        if (tok.type === 'heading') return tok.text;
    }
    return '';
}


function buildToc(lexed, filename, cb) {
    var toc = [];
    var depth = 0;

    const startIncludeRefRE = /^\s*<!-- \[start-include:(.+)\] -->\s*$/;
    const endIncludeRefRE = /^\s*<!-- \[end-include:(.+)\] -->\s*$/;
    const realFilenames = [ filename ];

    lexed.forEach(function (tok) {
        // Keep track of the current filename along @include directives.
        if (tok.type === 'html') {
            let match;
            if ((match = tok.text.match(startIncludeRefRE)) !== null)
                realFilenames.unshift(match[1]);
            else if (tok.text.match(endIncludeRefRE))
                realFilenames.shift();
        }

        if (tok.type !== 'heading') return;

        // @Comment by SuperMonster003 on Mar 1, 2023.
        // if (tok.depth - depth > 1) {
        //     return cb(new Error('Inappropriate heading level\n' +
        //         JSON.stringify(tok)));
        // }

        depth = tok.depth;
        const realFilename = path.basename(realFilenames[0], '.md');
        const id = getId(realFilename + '_' + tok.text.trim());
        toc.push(new Array((depth - 1) * 2 + 1).join(' ') +
            '* <span class="stability_' + tok.stability + '">' +
            '<a href="#' + id + '">' + tok.text + '</a></span>');
        tok.text += '<span><a class="mark" href="#' + id + '" ' +
            'id="' + id + '">#</a></span>';
    });

    toc = marked.parse(toc.join('\n'));
    cb(null, toc);
}

const idCounters = {};
const usedIds = new Set();

function resetHeadingIds() {
    Object.keys(idCounters).forEach(function (key) {
        delete idCounters[key];
    });
    usedIds.clear();
}

function normalizeGeneratedId(text) {
    text = text.toLowerCase();
    text = text.replace(/[^a-z0-9]+/g, '_');
    text = text.replace(/^_+|_+$/, '');
    text = text.replace(/^([^a-z])/, '_$1');
    return text;
}

function allocateHeadingId(text, counters, ids) {
    const base = normalizeGeneratedId(text);
    let counter = counters[base] || 0;
    let candidate = counter ? base + '_' + counter : base;
    while (ids.has(candidate)) {
        counter += 1;
        candidate = base + '_' + counter;
    }
    counters[base] = counter + 1;
    ids.add(candidate);
    return candidate;
}

function getId(text) {
    return allocateHeadingId(text, idCounters, usedIds);
}

function decodeFragment(fragment) {
    try {
        return decodeURIComponent(fragment);
    } catch (_) {
        return fragment;
    }
}

function cleanHeadingText(text) {
    return String(text)
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/<[^>]*>/g, ' ')
        .replace(/\\([\\`*{}\[\]()#+\-.!_>])/g, '$1')
        .trim();
}

function anchorKey(value) {
    return cleanHeadingText(decodeFragment(String(value)))
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, '');
}

function stripMemberLabel(text) {
    return text.replace(
        /^\s*\[(?:@|[A-Za-z]+[+!#=]?)\]\s*/,
        '',
    );
}

function withoutCallSignature(text) {
    return text.replace(/\s*\([\s\S]*$/, '').trim();
}

function stripScopePrefix(text, filename) {
    const escapedFilename = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(
        new RegExp('^' + escapedFilename + '[.#\\s]+', 'i'),
        '',
    );
}

function stripLastQualifier(text) {
    const signatureIndex = text.indexOf('(');
    const memberPart = signatureIndex < 0
        ? text
        : text.slice(0, signatureIndex);
    const qualifierIndex = Math.max(
        memberPart.lastIndexOf('.'),
        memberPart.lastIndexOf('#'),
    );
    return qualifierIndex < 0
        ? text
        : text.slice(qualifierIndex + 1);
}

function ensureLinkMap(linkMaps, filename) {
    const key = path.basename(filename, '.md').toLowerCase();
    if (!linkMaps[key]) {
        linkMaps[key] = {
            exact: Object.create(null),
            aliases: Object.create(null),
        };
    }
    return linkMaps[key];
}

function addHeadingAliases(linkMap, filename, headingText, id) {
    linkMap.exact[id.toLowerCase()] = id;

    const cleanText = cleanHeadingText(headingText);
    const labelMatch = cleanText.match(
        /^\s*\[(@|[A-Za-z]+[+!#=]?)\]\s*/,
    );
    const label = labelMatch ? labelMatch[1] : '';
    const withoutLabel = stripMemberLabel(cleanText);
    const variants = new Set([
        cleanText,
        withoutLabel,
        stripScopePrefix(withoutLabel, filename),
        stripLastQualifier(withoutLabel),
        id,
        id.replace(
            new RegExp(
                '^' + filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '_',
                'i',
            ),
            '',
        ),
    ]);

    Array.from(variants).forEach(function (variant) {
        variants.add(withoutCallSignature(variant));
        if (label) {
            variants.add(label + ' ' + variant);
            variants.add(label + ' ' + withoutCallSignature(variant));
        }
    });

    variants.forEach(function (variant) {
        const key = anchorKey(variant);
        if (key && !Object.prototype.hasOwnProperty.call(linkMap.aliases, key)) {
            linkMap.aliases[key] = id;
        }
    });
}

function buildLinkMaps(entries) {
    const linkMaps = Object.create(null);
    const startIncludeRefRE =
        /^\s*<!-- \[start-include:(.+)\] -->\s*$/;
    const endIncludeRefRE =
        /^\s*<!-- \[end-include:(.+)\] -->\s*$/;

    entries.forEach(function (entry) {
        const documentFilename = path.basename(entry.filename, '.md');
        const realFilenames = [ documentFilename ];
        const counters = Object.create(null);
        const ids = new Set();
        const lexed = marked.lexer(entry.input);
        parseText(lexed);

        lexed.forEach(function (tok) {
            if (tok.type === 'html') {
                const startMatch = tok.text.match(startIncludeRefRE);
                if (startMatch) {
                    realFilenames.unshift(startMatch[1]);
                } else if (tok.text.match(endIncludeRefRE)) {
                    realFilenames.shift();
                }
            }
            if (tok.type !== 'heading') return;

            const realFilename = path.basename(realFilenames[0], '.md');
            const id = allocateHeadingId(
                realFilename + '_' + tok.text.trim(),
                counters,
                ids,
            );
            addHeadingAliases(
                ensureLinkMap(linkMaps, realFilename),
                realFilename,
                tok.text,
                id,
            );
        });
    });

    return linkMaps;
}

function resolveHeadingId(filename, fragment, linkMaps) {
    const targetFilename = path.basename(filename, '.md');
    const decodedFragment = decodeFragment(fragment).replace(/^#/, '');
    const linkMap = linkMaps && linkMaps[targetFilename.toLowerCase()];

    if (linkMap) {
        const exact = linkMap.exact[decodedFragment.toLowerCase()];
        if (exact) return exact;

        const candidates = [ decodedFragment ];
        const escapedFilename =
            targetFilename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const withoutFilename = decodedFragment.replace(
            new RegExp('^' + escapedFilename + '[_-]+', 'i'),
            '',
        );
        if (withoutFilename !== decodedFragment) {
            candidates.push(withoutFilename);
        }

        for (const candidate of candidates) {
            const resolved = linkMap.aliases[anchorKey(candidate)];
            if (resolved) return resolved;
        }
    }

    return normalizeGeneratedId(
        targetFilename + '_' + decodedFragment,
    );
}

const numberRe = /^(\d*)/;

function versionSort(a, b) {
    a = a.trim();
    b = b.trim();
    let i = 0;  // common prefix length
    while (i < a.length && i < b.length && a[i] === b[i]) i++;
    a = a.substr(i);
    b = b.substr(i);
    return +b.match(numberRe)[1] - +a.match(numberRe)[1];
}
