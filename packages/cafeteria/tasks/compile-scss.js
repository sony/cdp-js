/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs');
const glob      = require('glob');
const command   = require('./command');
const config    = require('../project.config');

const STYLE_SHEET_DIR   = (config.dir.stylesheet ? config.dir.stylesheet : '');
const APP_SRC_DIR       = path.join(config.dir.src, STYLE_SHEET_DIR);
const LIB_SRC_DIR       = path.join(config.dir.src, config.dir.lib, STYLE_SHEET_DIR);
const PORTING_SRC_DIR   = path.join(config.dir.porting, STYLE_SHEET_DIR);

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        all: true,
        app: false,
        lib: false,
        porting: null,  // dev | <cordova platform,cordova platform>
        pkg: false,     // for package out
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                if (option.split('=')[0] === key) {
                    if ('pkg' === key) {
                        settings[key] = true;
                    } else if ('porting' === key) {
                        settings.all = false;
                        settings[key] = option.split('=')[1] || 'all';
                    } else {
                        settings.all = false;
                        settings[key] = true;
                    }
                }
            });
        });
    }

    return settings;
}

function isExistsSCSS(srcDir) {
    if (!fs.existsSync(srcDir)) {
        return false;
    }
    const list = glob.sync('**/*.scss', {
        cwd: srcDir,
        nodir: true,
    });
    return (0 < list.length) ? true : false;
}

function compile(srcDir, dstDir) {
    return new Promise((resolve, reject) => {
        // node-sass --output-style expanded --source-map-embed --source-map-contents -o app/stylesheets app/stylesheets
        command.exec('node-sass', [
            '--output-style',
            'expanded',
            '--source-map-embed',
            '--source-map-contents',
            '-o',
            dstDir,
            srcDir,
        ])
            .then(() => {
                resolve();
            })
            .catch((reason) => {
                reject(reason);
            });
    });
}

function autoPrefix(targetDir) {
    return new Promise((resolve, reject) => {
        // postcss app/stylesheets/**/*.css --use autoprefixer --autoprefixer.browsers 'last 2 versions' -d app/stylesheets/
        command.exec('postcss', [
            targetDir + '/**/*.css',
            '--use',
            'autoprefixer',
            '-d',
            targetDir,
        ])
            .then(() => {
                resolve();
            })
            .catch((reason) => {
                reject(reason);
            });
    });
}

function run(srcDir, dstDir) {
    return new Promise((resolve, reject) => {
        if (!isExistsSCSS(srcDir)) {
            resolve();
            return;
        } else {
            compile(srcDir, dstDir)
            .then(() => {
                return autoPrefix(dstDir);
            })
            .catch((reason) => {
                reject(reason);
            });
        }
    });
}

function runByPortingTarget(target, dstDir) {
    const PORTING_DEV_DIR = path.join(config.dir.src, PORTING_SRC_DIR);
    const PLATFORMS_ROOT  = path.join(__dirname, '..', 'platforms');

    // valid porting
    if (!fs.existsSync(PORTING_DEV_DIR)) {
        return Promise.resolve();
    }

    let platforms = [];
    if (null == target || 'all' === target) {
        platforms.push({
            id: '',
            dir: PORTING_DEV_DIR,
        });
        fs.readdirSync(PLATFORMS_ROOT)
        .forEach((find) => {
            const findPath = path.join(PLATFORMS_ROOT, find);
            if (fs.statSync(findPath).isDirectory()) {
                platforms.push({
                    id: '_' + find,
                    dir: path.join('platforms', find, PORTING_SRC_DIR),
                });
            }
        });
    } else {
        const _targets = target.split(',');
        _targets.forEach((_tgt) => {
            if ('dev' === _tgt) {
                platforms.push({
                    id: '',
                    dir: PORTING_DEV_DIR,
                });
            } else {
                platforms.push({
                    id: '_' + _tgt,
                    dir: path.join('platforms', _tgt, PORTING_SRC_DIR)
                });
            }
        });
    }

    // run
    let promises = [];
    platforms.forEach((platform) => {
        const out = dstDir ? path.join((dstDir + platform.id), STYLE_SHEET_DIR) : (platform.dir);
        promises.push(run(platform.dir, out));
    });

    return Promise.all(promises);
}

function main() {
    const options = queryOptions();

    let promises = [];
    if (options.all || options.app) {
        const dstDir = options.pkg ? path.join(config.dir.pkg, STYLE_SHEET_DIR) : APP_SRC_DIR;
        promises.push(run(APP_SRC_DIR, dstDir));
    }
    if (options.all || options.lib) {
        const dstDir = options.pkg ? path.join(config.dir.pkg, config.dir.lib, STYLE_SHEET_DIR) : LIB_SRC_DIR;
        promises.push(run(LIB_SRC_DIR, dstDir));
    }
    if (options.all || options.porting) {
        const dstDir = options.pkg ? path.join(config.dir.pkg, config.dir.porting) : null;
        promises.push(runByPortingTarget(options.porting, dstDir));
    }
    Promise.all(promises)
    .catch((reason) => {
        console.error(reason);
        process.exit(1);
    });
}

main();
