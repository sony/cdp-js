/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs-extra');
const glob      = require('glob');
const command   = require('./command');
const config    = require('../project.config');

const app       = config.dir.src;
const lib       = config.dir.lib;
const porting   = config.dir.porting;
const scripts   = config.dir.script;
const temp      = config.dir.temp;

const TEMP_DIR      = `${temp}/instrument`;
const TEMP_DIR_PATH = path.join(__dirname, '..', TEMP_DIR);

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        all: true,
        app: false,
        lib: false,
        porting: null,  // dev  | <cordova platform,cordova platform>
    };

    if (0 < argv.length) {
        settings.all = false;
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                if (option.split('=')[0] === key) {
                    if ('porting' === key) {
                        settings[key] = option.split('=')[1] || 'dev';
                    } else {
                        settings[key] = true;
                    }
                }
            });
        });
    }

    return settings;
}

function prepare(target, cwd) {
    glob.sync(target + '/**/*.js', {
        cwd: cwd,
        nodir: true,
    })
    .forEach((file) => {
        const src = path.join(cwd, file);
        const dst = path.join(TEMP_DIR_PATH, file);
        fs.copySync(src, dst);
    });
}

function instrument() {
    if (!fs.existsSync(TEMP_DIR_PATH)) {
        return Promise.resolve();
    }
    // nyc instrument ./built ./built --source-map=false
    return command.exec('nyc', `instrument ${TEMP_DIR} ${TEMP_DIR} --source-map=false`);
}

function rebase() {
    glob.sync('**/*.js', {
        cwd: TEMP_DIR_PATH,
        nodir: true,
    })
    .forEach((file) => {
        const src = path.join(TEMP_DIR_PATH, file);
        const dst = path.join(__dirname, '..', app, file);
        fs.copySync(src, dst);
    });
}

function main() {
    const options = queryOptions();

    fs.removeSync(TEMP_DIR);

    if (options.all || options.app) {
        prepare(scripts, path.join(__dirname, '..', app));
    }
    if (options.all || options.lib) {
        prepare(`${lib}/${scripts}`, path.join(__dirname, '..', app));
    }
    if (options.all || options.porting) {
        let cwd;
        if (null === options.porting || 'dev' === options.porting) {
            cwd = path.join(__dirname, '..', app);
        } else {
            cwd = path.join(__dirname, '..', 'platforms', 'options.porting');
        }
        prepare(`${porting}/${scripts}`, cwd);
    }

    instrument()
        .then(() => {
            rebase();
        })
        .catch((reason) => {
            console.error(reason);
            process.exit(1);
        });
}

main();
