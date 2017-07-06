/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs');
const config    = require('../project.config');

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        operation: 'normalize', // 'normalize' | 'prepare'
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('operation' === name) {
                    settings.operation = option.split('=')[1] || 'normalize';
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

function prepare() {
    // ensure directory
    const tempDir = path.join(__dirname, '..', `${config.dir.temp}`);
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    // copy from source
    const src = path.join(__dirname, '..', `${config.dir.src}/${config.dir.script}/${config.main.basename}.js`);
    const dst = path.join(tempDir, `${config.main.basename}.js`);
    fs.writeFileSync(dst, fs.readFileSync(src).toString());
}

function normalize() {
    const SRC_DIR = path.join(__dirname, '..', config.dir.src, config.dir.script);
    const COVERAGE_PATH = path.join(__dirname, '..', config.dir.doc, 'reports/coverage', 'coverage.json');
    const coverage = require(COVERAGE_PATH);

    console.log('remap coverage info...');

    let rebuild = {};
    for (let file in coverage) {
        if (coverage.hasOwnProperty(file)) {
            console.log('  processing... : ' + file);
            const absPath = path.join(SRC_DIR, file);
            rebuild[absPath] = coverage[file];
            rebuild[absPath].path = absPath;
        }
    }

    fs.writeFileSync(
        COVERAGE_PATH,
        JSON.stringify(rebuild, null, 4)
    );
}

function main() {
    switch (queryOptions().operation) {
        case 'normalize':
            normalize();
            break;
        case 'prepare':
            prepare();
            break;
        default:
            break;
    }
}

main();
