/* eslint-env node, es6 */
'use strict';
const fs    = require('fs');
const path  = require('path');

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        target: null,
    };

    if (0 < argv.length) {
        settings.all = false;
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('target' === key) {
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
                const pkg = require(path.join(__dirname, '../package.json'));
                return pkg.moduleList;
            }
        })();

        const proc = () => {
            const target = targets.shift();
            if (!target) {
                resolve();
                return;
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
