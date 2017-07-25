/* eslint-env node, es6 */
'use strict';
const command   = require('./command');
const config    = require('../project.config');

const BUILD_HOOK_AFTER_SETUP = (() => {
    if (config.build_settings && config.build_settings.hook_scripts) {
        return config.build_settings.hook_scripts.after_setup;
    }
    return null;
})();

const BUILD_HOOK_AFTER_OPTIMIZE = (() => {
    if (config.build_settings && config.build_settings.hook_scripts) {
        return config.build_settings.hook_scripts.after_optimize;
    }
    return null;
})();

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        release: false,
        post: true,
        options: argv.join(' '),  // original options
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('no-post' === name) {
                    settings.post = false;
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

function portingSetup(options) {
    const args = options.options ? ' -- ' + options.options : '';
    return command.exec('npm', 'run build:porting' + args);
}

function portingArrange(options) {
    // npm run build:porting -- --porting=arrange --platform=android,ios
    const args = ' -- --porting=arrange' + (options.options ? ' ' + options.options : '');
    return command.exec('npm', 'run build:porting' + args);
}

function stringReplace(options) {
    const args = options.options ? ' -- ' + options.options : '';
    return command.exec('npm', 'run build:config' + args);
}

function runHookTasks(options, entries) {
    if (null == entries) {
        return Promise.resolve();
    } else {
        let hooks = [];
        Object.keys(entries)
        .forEach((key) => {
            hooks.push({
                scripts: key,
                arg: entries[key],
            });
        });
        return new Promise((resolve, reject) => {
            const proc = () => {
                const hook = hooks.shift();
                if (null == hook) {
                    resolve();
                    return;
                }
                const args = (hook.arg && options.options) ? ' -- ' + options.options : '';
                command.exec('npm', 'run ' + hook.scripts + args)
                .then(() => {
                    setTimeout(proc);
                })
                .catch((reason) => {
                    reject(reason);
                });
            };
            setTimeout(proc);
        });
    }
}

function postProcess(options) {
    if (!options.post || !options.release) {
        return Promise.resolve();
    } else {
        const args = options.options ? ' -- ' + options.options : '';
        return new Promise((resolve, reject) => {
            command.exec('npm', 'run bundle' + args)
            .then(() => {
                return command.exec('npm', 'run minify' + args);
            })
            .then(() => {
                resolve();
            })
            .catch((reason) => {
                reject(reason);
            });
        });
    }
}

function cleanTemp() {
    return command.exec('npm', 'run clean:temp');
}

function run(options) {
    return new Promise((resolve, reject) => {
        portingSetup(options)
            .then(() => {
                return stringReplace(options);
            })
            .then(() => {
                return runHookTasks(options, BUILD_HOOK_AFTER_SETUP);
            })
            .then(() => {
                return postProcess(options);
            })
            .then(() => {
                return runHookTasks(options, BUILD_HOOK_AFTER_OPTIMIZE);
            })
            .then(() => {
                return portingArrange(options);
            })
            .then(() => {
                return cleanTemp();
            })
            .then(() => {
                resolve();
            })
            .catch((reason) => {
                reject(reason);
            });
    });
}

function main() {
    run(queryOptions());
}

main();
