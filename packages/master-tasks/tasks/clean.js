/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs');
const del       = require('del');
const glob      = require('glob');
const config    = require('../project.config');

const TEMP_DIR      = path.join(__dirname, '..', config.dir.temp);
const COVERAGE_DIR  = path.join(__dirname, '..', config.dir.doc, 'reports', 'coverage');
const TYPEDOC_DIR   = path.join(__dirname, '..', config.dir.doc, 'typedoc');
const TEST_UNIT_DIR = path.join(__dirname, '..', config.dir.test, 'unit');
const BUILT_DIR     = path.join(__dirname, '..', config.dir.built);
const PKG_DIR       = path.join(__dirname, '..', config.dir.pkg);

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        all: true,
        temp: false,
        coverage: false,
        typedoc: false,
        test: false,
        built: false,
        pkg: false,
        target: null,   // any file/dir available
    };

    if (0 < argv.length) {
        settings.all = false;
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                if (option.split('=')[0] === key) {
                    if ('target' === key) {
                        settings[key] = option.split('=')[1];
                    } else {
                        settings[key] = true;
                    }
                }
            });
        });
    }

    return settings;
}

function cleanEmptyDir(target) {
    const list = glob.sync('**', {
        cwd: target,
        nodir: false,
    });
    for (let i = list.length - 1; i >= 0; i--) {
        const filePath = path.join(target, list[i]);
        if (fs.statSync(filePath).isDirectory()) {
            if (0 === fs.readdirSync(filePath).length) {
                del.sync(filePath);
            }
        }
    }
}

function main() {
    const options = queryOptions();

    if (options.all || options.temp) {
        del.sync(TEMP_DIR);
    }
    if (options.all || options.coverage) {
        del.sync(COVERAGE_DIR);
    }
    if (options.all || options.typedoc) {
        del.sync(TYPEDOC_DIR);
    }
    if (options.all || options.test) {
        del.sync(config.built_cleanee.ts, { cwd: TEST_UNIT_DIR });
    }
    if (options.all || options.built) {
        Object.keys(config.built_cleanee).forEach((key) => {
            if ('roots' !== key) {
                del.sync(config.built_cleanee[key], { cwd: BUILT_DIR });
                if (config.built_cleanee.roots) {
                    config.built_cleanee.roots.forEach((additional) => {
                        del.sync(config.built_cleanee[key], {
                            cwd: path.join(__dirname, '..', additional),
                        });
                    });
                }
            }
        });
        cleanEmptyDir(BUILT_DIR);
    }
    if (options.all || options.pkg) {
        del.sync(['**/*'], { cwd: PKG_DIR });
    }
    if (options.target) {
        del.sync(options.target);
    }
}

main();
