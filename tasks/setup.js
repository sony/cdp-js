/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const config    = require('../project.config');

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        target: null,
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('target' === name) {
                    settings.target = option.split('=')[1] || null;
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

function setup(options) {
    return new Promise((resolve, reject) => {
        const command = require('./command');
        const cwdBackup = process.cwd();

        let targets = (() => {
            if (options.target) {
                return options.target.split(',');
            } else {
                return config.include_modules;
            }
        })();

        const proc = () => {
            const target = targets.shift();
            if (!target) {
                return resolve();
            }

            process.chdir(`./packages/${target}`);
            command.exec('npm', 'run setup')
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

function main() {
    setup(queryOptions())
        .catch((reason) => {
            console.error(reason);
            process.exit(1);
        });
}

main();
