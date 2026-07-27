'use strict';

const fs = require('fs');
const path = require('path');
const preprocess = require('./preprocess.js');
const toJSON = require('./json.js');

function callbackResult(run) {
    return new Promise((resolve, reject) => {
        run((error, result) => error ? reject(error) : resolve(result));
    });
}

function preprocessInput(inputFile, input) {
    return callbackResult(callback => preprocess(inputFile, input, callback));
}

function renderJSON(input, inputFile) {
    return callbackResult(callback => toJSON(input, inputFile, callback));
}

async function preprocessEntry(entry) {
    const preprocessed = await preprocessFile(entry.input);
    const json = await renderJSON(preprocessed, entry.input);
    await fs.promises.writeFile(
        entry.jsonOutput,
        JSON.stringify(json, null, 2),
    );
    return { entry, preprocessed };
}

async function preprocessFile(inputFile) {
    const input = await fs.promises.readFile(inputFile, 'utf8');
    return preprocessInput(inputFile, input);
}

async function main() {
    const manifestArgument = process.argv[2];
    if (!manifestArgument) {
        throw new Error('Usage: node batch-generate.js <manifest.json>');
    }
    const manifestPath = path.resolve(manifestArgument);
    const configuration = JSON.parse(
        await fs.promises.readFile(manifestPath, 'utf8'),
    );
    if (
        typeof configuration.template !== 'string' ||
        typeof configuration.version !== 'string' ||
        !Array.isArray(configuration.entries) ||
        !Array.isArray(configuration.linkMapInputs) ||
        !configuration.linkMapInputs.every(input => typeof input === 'string')
    ) {
        throw new Error(`Invalid generator manifest: ${manifestPath}`);
    }
    const preprocessedEntries = [];
    for (const entry of configuration.entries) {
        preprocessedEntries.push(await preprocessEntry(entry));
    }

    // html.js customizes marked's global renderer. Load it only after every
    // JSON document has been rendered so the batch output stays byte-identical
    // to the two independent legacy CLI invocations.
    const toHTML = require('./html.js');
    const preprocessedByInput = new Map(
        preprocessedEntries.map(result => [
            path.resolve(result.entry.input),
            result.preprocessed,
        ]),
    );
    const linkMapEntries = [];
    const seenLinkMapInputs = new Set();
    for (const inputFile of configuration.linkMapInputs) {
        const resolvedInput = path.resolve(inputFile);
        if (seenLinkMapInputs.has(resolvedInput)) {
            continue;
        }
        seenLinkMapInputs.add(resolvedInput);
        const preprocessed = preprocessedByInput.has(resolvedInput)
            ? preprocessedByInput.get(resolvedInput)
            : await preprocessFile(inputFile);
        linkMapEntries.push({
            input: preprocessed,
            filename: inputFile,
        });
    }
    const linkMaps = toHTML.buildLinkMaps(
        linkMapEntries,
    );
    function renderHTML(options) {
        return callbackResult(callback => toHTML(options, callback));
    }
    for (const { entry, preprocessed } of preprocessedEntries) {
        const html = await renderHTML({
            input: preprocessed,
            filename: entry.input,
            template: configuration.template,
            nodeVersion: configuration.version,
            analytics: null,
            linkMaps,
        });
        await fs.promises.writeFile(
            entry.htmlOutput,
            html,
        );
    }
}

main().catch(error => {
    console.error(error && error.stack ? error.stack : error);
    process.exitCode = 1;
});
