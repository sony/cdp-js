/* eslint-env node, es6 */
'use strict';
const fs        = require('fs-extra');
const path      = require('path');
const glob      = require('glob');
const del       = require('del');
const config    = require('../project.config');

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        operation: 'rearrange', // 'rearrange' | 'platforms' | 'sdk'
        target: null,
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('operation' === name) {
                    settings.operation = option.split('=')[1] || 'rearrange';
                } else if ('target' === name) {
                    settings.target = option.split('=')[1];
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

function rearrange() {
    const SCRIPT_PATH       = path.join(__dirname, '..', `${config.dir.src}/${config.dir.external}/cdp/${config.dir.script}`);
    const STYLESHEET_PATH   = path.join(__dirname, '..', `${config.dir.src}/${config.dir.external}/cdp/${config.dir.stylesheet}`);
    const D_TS_PATH         = path.join(__dirname, '..', `${config.dir.src}/${config.dir.external}/${config.dir.types}/@cdp/mobile`);
    const SDK_PATH          = path.join(__dirname, '../../cdp-mobile/dist');

    // scripts
    del.sync(['**/*'], { cwd: SCRIPT_PATH });
    glob.sync('**/*.js', {
        cwd: SDK_PATH,
        nodir: true,
    }).forEach((file) => {
        const src = path.join(SDK_PATH, file);
        const dst = path.join(SCRIPT_PATH, file);
        console.log('  update...   ' + file);
        fs.copySync(src, dst);
        const src_map = src + '.map';
        if (fs.existsSync(src_map)) {
            const dst_map = dst + '.map';
            console.log('  update...   ' + file + '.map');
            fs.copySync(src_map, dst_map);
        }
    });

    // stylesheets
    del.sync(['**/*'], { cwd: STYLESHEET_PATH });
    glob.sync('**/*.css', {
        cwd: SDK_PATH,
        nodir: true,
    }).forEach((file) => {
        const src = path.join(SDK_PATH, file);
        const dst = path.join(STYLESHEET_PATH, file);
        console.log('  update...   ' + file);
        fs.copySync(src, dst);
        const src_map = src + '.map';
        if (fs.existsSync(src_map)) {
            const dst_map = dst + '.map';
            console.log('  update...   ' + file + '.map');
            fs.copySync(src_map, dst_map);
        }
    });

    // d.ts
    del.sync(['**/*'], { cwd: D_TS_PATH });
    fs.copySync(path.join(SDK_PATH, config.dir.types), D_TS_PATH);
}

function platformsSetup() {
    const PLATFORMS_ROOT = path.join(__dirname, '..', 'platforms');

    const platforms= [];
    fs.readdirSync(PLATFORMS_ROOT)
        .forEach((find) => {
            const findPath = path.join(PLATFORMS_ROOT, find);
            if (fs.statSync(findPath).isDirectory()) {
                platforms.push(find);
            }
        });

    // copy node_modules
    platforms.forEach((platform) => {
        const src = path.join(__dirname, '..', `node_modules/cordova-${platform}/node_modules`);
        const dst = path.join(__dirname, '..', `platforms/${platform}/cordova/node_modules`);
        if (fs.existsSync(src)) {
            fs.copySync(src, dst);
        }
    });
}

function sdkUpdate(options) {
    return new Promise((resolve, reject) => {
        buildPackage(options)
        .then(() => {
            return rebuildMobile();
        })
        .then(() => {
            rearrange();
            resolve();
        })
        .catch((reason) => {
            reject(reason);
        });
    });
}

function buildPackage(options) {
    return new Promise((resolve, reject) => {
        const command = require('./command');
        const cwdBackup = process.cwd();

        let targets = (() => {
            if (options.target) {
                return options.target.split(',');
            } else {
                return [];
            }
        })();

        const proc = () => {
            const target = targets.shift();
            if (!target) {
                return resolve();
            }

            process.chdir(`../${target}`);
            command.exec('npm', 'run build')
                .then(() => {
                    process.chdir(cwdBackup);
                    setTimeout(proc);
                })
                .catch((reason) => {
                    reject(reason);
                });

        };
        setTimeout(proc);
    });
}

function rebuildMobile() {
    return new Promise((resolve, reject) => {
        const command = require('./command');
        const cwdBackup = process.cwd();

        process.chdir('../cdp-mobile');
        command.exec('npm', 'run rebuild')
            .then(() => {
                process.chdir(cwdBackup);
                resolve();
            })
            .catch((reason) => {
                reject(reason);
            });
    });
}

function main() {
    const options = queryOptions();
    switch (options.operation) {
        case 'rearrange':
            rearrange();
            break;
        case 'platforms':
            platformsSetup();
            break;
        case 'sdk':
            sdkUpdate(options)
                .catch((reason) => {
                    console.error(reason);
                    process.exit(1);
                });
            break;
        default:
            break;
    }
}

main();
