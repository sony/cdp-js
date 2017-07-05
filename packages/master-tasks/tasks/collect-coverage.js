/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs-extra');
const config    = require('../project.config');

//const SRC_DIR = path.join(__dirname, '..', config.dir.src, config.dir.script);
//const COVERAGE_PATH = path.join(__dirname, '..', config.dir.doc, 'reports/coverage', 'coverage.json');

//const coverage = require(COVERAGE_PATH);

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        all: true,
        exec: false,
        collect: false,
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if (name === key) {
                    settings.all = false;
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

function exec(options) {
    if (!(options.all || options.exec)) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        // TODO
        resolve();
    });
}

function collect(options) {
    if (!(options.all || options.collect)) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        let rebuild = {};

        const COVERAGE_FILE = path.join(config.dir.doc, 'reports/coverage', 'coverage.json');
        const COVERAGE_PATH = path.join(__dirname, '..', COVERAGE_FILE);
        fs.ensureDirSync(path.join(__dirname, '..', config.dir.doc, 'reports/coverage'));

        config.include_modules.forEach((target) => {
            const coverage = require(path.join(__dirname, '../..', target, COVERAGE_FILE));
            for (let file in coverage) {
                if (coverage.hasOwnProperty(file)) {
                    rebuild[file] = coverage[file];
                }
            }
        });

        fs.writeFileSync(COVERAGE_PATH, JSON.stringify(rebuild, null, 4));
        resolve();
    });
}

function run(options) {
    return new Promise((resolve, reject) => {
        exec(options)
            .then(() => {
                return collect(options);
            })
            .catch((reason) => {
                reject(reason);
            });
    });
}

function main() {
    run(queryOptions())
    .catch((reason) => {
        console.error(reason);
        process.exit(1);
    });
}

main();
