/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs-extra');
const del       = require('del');
const config    = require('../project.config');

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        target: null,
        distOnly: false,
        command: 'update',
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('target' === name) {
                    settings.target = option.split('=')[1] || '';
                } else if ('command' === name) {
                    settings.command = option.split('=')[1] || 'update';
                } else if ('no-build' === name) {
                    settings.distOnly = true;
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

function updateModules(options) {
    if (options.distOnly) {
        return Promise.resolve();
    }
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
                return resolve(options);
            }

            process.chdir(`./packages/${target}`);
            command.exec('npm', `run ${options.command}`)
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

function updateDistribution(options) {
    if ('update' !== options.command) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        const dir = path.join(__dirname, '..');
        const pkg = require(path.join(dir, 'package.json'));
        const srcDir = path.join(__dirname, `../packages/${config.distribution_target}`);
        const srcPackage = require(path.join(srcDir, 'package.json'));

        // clean "dist"
        del.sync(['**/*'], { cwd: path.join(dir, 'dist') });

        // copy "dist"
        fs.copySync(path.join(srcDir, 'dist'), path.join(dir, 'dist'));

        // update package info
        pkg.name        = srcPackage.name;
        pkg.description = srcPackage.description;
        pkg.version     = srcPackage.version;
        pkg.main        = srcPackage.main;
        pkg.types       = srcPackage.types;
        pkg.author      = srcPackage.author;
        pkg.license     = srcPackage.license;
        pkg.keywords    = srcPackage.keywords;
        fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2));

        resolve();
    });
}

function main() {
    return new Promise((resolve) => {
        updateModules(queryOptions())
            .then((options) => {
                return updateDistribution(options);
            })
            .then((options) => {
                resolve();
            })
            .catch((reason) => {
                console.error(reason);
                process.exit(1);
            });
    });
}

main();
