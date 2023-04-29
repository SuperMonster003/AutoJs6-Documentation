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

const processIncludes = require('./preprocess.js');
const fs = require('fs');

// parse the args.
// Don't use nopt or whatever for this.  It's simple enough.

const path = require('path');

let format = 'html';
let template = path.join('..', 'template.html');
let inputFile = path.join('..', 'api', 'all.md');
let nodeVersion = null;
let analytics = null;
let out = path.join('..', 'docs', 'all.html');

process.argv.slice(2).forEach(function (arg) {
    if (!arg.startsWith('--')) {
        inputFile = arg;
    } else if (arg.startsWith('--format=')) {
        format = arg.replace(/^--format=/, '');
    } else if (arg.startsWith('--template=')) {
        template = arg.replace(/^--template=/, '');
    } else if (arg.startsWith('--node-version=')) {
        nodeVersion = arg.replace(/^--node-version=/, '');
    } else if (arg.startsWith('--analytics=')) {
        analytics = arg.replace(/^--analytics=/, '');
    } else if (arg.startsWith('--out=')) {
        out = arg.replace(/^--out=/, '');
    }
});

nodeVersion = nodeVersion || process.version;

if (!inputFile) {
    throw new Error('No input file specified');
}
console.info('Input file = %s', inputFile);

fs.readFile(inputFile, 'utf8', function (er, input) {
    if (er) throw er;
    // process the input for @include lines
    processIncludes(inputFile, input, processIncludesCallback);
});

function processIncludesCallback(er, input) {
    if (er) throw er;
    switch (format) {
        case 'json':
            require('./json.js')(input, inputFile, function (er, obj) {
                if (er) throw er;
                let message = JSON.stringify(obj, null, 2);
                if (out) {
                    fs.writeFileSync(out, message);
                } else {
                    console.log(message);
                }
            });
            break;
        case 'html':
            let o = { input, filename: inputFile, template, nodeVersion, analytics };
            require('./html.js')(o, function (er, html) {
                    if (er) throw er;
                    if (out) {

                        // FIXME by SuperMonster003 on Mar 2, 2023.
                        //  ! A better idea is needed.
                        if (html.match('__CONTENT__')) {
                            html = html
                                .replace(/__CONTENT__#39;/g, `$$'`)
                                .replace(/__CONTENT__quot/g, `$$"`);
                        }

                        fs.writeFileSync(out, html);
                    } else {
                        console.log(html);
                    }
                },
            );
            break;
        default:
            throw new Error(`Invalid format: ${format}`);
    }
}