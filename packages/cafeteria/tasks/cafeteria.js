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
        operation: 'rearrange', // 'rearrange' | 'platforms'
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('operation' === name) {
                    settings.operation = option.split('=')[1] || 'rearrange';
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

function main() {
    switch (queryOptions().operation) {
        case 'rearrange':
            rearrange();
            break;
        case 'platforms':
            platformsSetup();
            break;
        default:
            break;
    }
}

main();
