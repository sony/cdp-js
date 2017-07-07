/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs-extra');
const del       = require('del');
const config    = require('../project.config');

const ROOT_DIR                  = path.join(__dirname, '..');
const DESTRIBUTION_TARGET_DIR   = path.join(__dirname, `../packages/${config.distribution_target}`);

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        operation: 'distribution', // 'distribution' | 'reports'
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('operation' === name) {
                    settings.operation = option.split('=')[1] || 'distribution';
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

function distribution() {
    const pkg = require(path.join(ROOT_DIR, 'package.json'));
    const srcPackage = require(path.join(DESTRIBUTION_TARGET_DIR, 'package.json'));

    // clean "dist"
    del.sync(['**/*'], { cwd: path.join(ROOT_DIR, config.dir.pkg) });
    // copy "dist"
    fs.copySync(path.join(DESTRIBUTION_TARGET_DIR, config.dir.pkg), path.join(ROOT_DIR, config.dir.pkg));

    // update package info
    pkg.name        = srcPackage.name;
    pkg.description = srcPackage.description;
    pkg.version     = srcPackage.version;
    pkg.main        = srcPackage.main;
    pkg.types       = srcPackage.types;
    pkg.author      = srcPackage.author;
    pkg.license     = srcPackage.license;
    pkg.keywords    = srcPackage.keywords;
    fs.writeFileSync(path.join(ROOT_DIR, 'package.json'), JSON.stringify(pkg, null, 2));
}

function reports() {
    // clean "dist"
    del.sync(path.join(ROOT_DIR, `${config.dir.doc}/reports`));
    // copy "dist"
    fs.copySync(path.join(DESTRIBUTION_TARGET_DIR, `${config.dir.doc}/reports`), path.join(ROOT_DIR, `${config.dir.doc}/reports`));
}

function main() {
    switch (queryOptions().operation) {
        case 'distribution':
            distribution();
            break;
        case 'reports':
            reports();
            break;
        default:
            break;
    }
}

main();
