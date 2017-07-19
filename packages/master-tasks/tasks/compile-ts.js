/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs-extra');
const command   = require('./command');
const template  = require('./tsconfig-templates');
const config    = require('../project.config');

const CONFIG_TS_PATH        = path.join(__dirname, '..', config.dir.src, config.dir.script, 'config.ts');
const LIB_ROOT_PATH         = path.join(__dirname, '..', config.dir.src, config.dir.lib, config.dir.script);
const PORTING_ROOT_PATH     = path.join(__dirname, '..', config.dir.src, config.dir.porting, config.dir.script);
const LIB_D_TS_OUT_PATH     = path.join(__dirname, '..', config.dir.pkg, config.dir.lib, config.dir.script);
const BUILD_D_TS_OUT_PATH   = path.join(__dirname, '..', config.dir.temp, config.dir.types);

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        all: true,
        app: false,
        lib: false,
        porting: null,  // dev  | <cordova platform,cordova platform>
        pkg: null,      // null (dev) | debug | release for package out
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                if (option.split('=')[0] === key) {
                    if ('pkg' === key) {
                        settings[key] = option.split('=')[1] || 'debug';
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

function setupConfig(id, param) {
    const filePath = path.join(__dirname, '..', id + '.json');
    const tsconfig = template.tsconfig(id, param);
    fs.writeFileSync(filePath, tsconfig);
    return filePath;
}

function validStructure(targetRootPath) {
    if (fs.existsSync(targetRootPath)) {
        const finds = fs.readdirSync(targetRootPath);
        for (let i = 0, n = finds.length; i < n; i++) {
            const filePath = path.join(targetRootPath, finds[i]);
            if (fs.statSync(filePath).isDirectory() && config.dir.types !== finds[i]) {
                return true;
            }
        }
    }
    return false;
}

function detectPorting(target) {
    const PLATFORMS_ROOT = path.join(__dirname, '..', 'platforms');

    const valid_targets = [];

    // valid porting
    if (!validStructure(PORTING_ROOT_PATH)) {
        return valid_targets;
    }

    if (null == target || 'all' === target) {
        valid_targets.push('dev');
        fs.readdirSync(PLATFORMS_ROOT)
        .forEach((find) => {
            const findPath = path.join(PLATFORMS_ROOT, find);
            if (fs.statSync(findPath).isDirectory()) {
                valid_targets.push(find);
            }
        });
    } else {
        const _targets = target.split(',');
        _targets.forEach((_tgt) => {
            valid_targets.push(_tgt);
        });
    }

    return valid_targets;
}

function resolveBuildDependencies(target) {
    const dependencies = [];

    // read "config.ts"
    const config_ts = fs.readFileSync(CONFIG_TS_PATH).toString();

    // ">>>LIB_DEPENDENCIES>>>" *** " // <<<LIB_DEPENDENCIES<<<
    const code = config_ts.match(/\/\/ >>>LIB_DEPENDENCIES[\s\S]*?\/\/ <<<LIB_DEPENDENCIES<<</);
    if (code) {
        const regexp_depends = new RegExp('assign_' + target + '\\([\\s\\S]*?\\)', 'gm');
        const regexp_module = new RegExp('assign_' + target + '\\(([.a-zA-Z0-9_-]+)+');
        const depends = code[0].match(regexp_depends);
        if (depends) {
            depends.forEach((info) => {
                dependencies.push(info.replace(/\b|"|'/g, '').match(regexp_module)[1]);
            });
        }
    }

    console.log('build dependencies: ' + JSON.stringify(dependencies, null, 4));

    return dependencies;
}

///////////////////////////////////////////////////////////////////////
// dev:

function compileDev() {
    return command.exec('tsc', '-p ./tsconfig.json');
}

///////////////////////////////////////////////////////////////////////
// debug:

function compileDebugAppLib(options) {
    if (!(options.all || options.app)) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        const filePath = setupConfig('tsconfig.debug.app-lib');
        command.exec('tsc', '-p ./tsconfig.debug.app-lib.json')
        .then(() => {
            fs.removeSync(filePath);
            resolve();
        })
        .catch((reason) => {
            reject(reason);
        });
    });
}

function compileDebugPorting(options) {
    if (!(options.all || options.porting)) {
        return Promise.resolve();
    }

    let targets = detectPorting(options.porting);
    if (targets.length <= 0) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const proc = (() => {
            const target = targets.shift();
            if (!target) {
                resolve();
                return;
            }

            const id = ('dev' === target) ? '' : '_' + target;
            const rootDir = (() => {
                if ('dev' === target) {
                    return config.dir.src + '/' + config.dir.porting + '/' + config.dir.script;
                } else {
                    return 'platforms' + '/' + target + '/' + config.dir.porting + '/' + config.dir.script;
                }
            })();

            const filePath = setupConfig('tsconfig.debug.porting', {
                id: id,
                rootDir: rootDir,
            });
            command.exec('tsc', '-p ./tsconfig.debug.porting.json')
            .then(() => {
                fs.removeSync(filePath);
                setTimeout(proc);
            })
            .catch((reason) => {
                reject(reason);
            });
        });
        setTimeout(proc);
    });
}

///////////////////////////////////////////////////////////////////////
// release:

function compileReleaseAppBootstrap(options) {
    if (!(options.all || options.app)) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        const filePath = setupConfig('tsconfig.release.bootstrap');
        console.log('  app module compiling... ' + 'config.ts');
        console.log('  app module compiling... ' + 'index.ts');
        command.exec('tsc', '-p ./tsconfig.release.bootstrap.json')
        .then(() => {
            fs.removeSync(filePath);
            resolve();
        })
        .catch((reason) => {
            reject(reason);
        });
    });
}

function compileReleaseApp(options) {
    if (!(options.all || options.app)) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        const filePath = setupConfig('tsconfig.release.app');
        console.log('  app module compiling... ' + 'app.ts');
        command.exec('tsc', '-p ./tsconfig.release.app.json')
        .then(() => {
            fs.removeSync(filePath);
            resolve();
        })
        .catch((reason) => {
            reject(reason);
        });
    });
}

function compileReleaseLib(options) {
    if (!(options.all || options.lib)) {
        return Promise.resolve();
    } else if (!validStructure(LIB_ROOT_PATH)) {
        return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
        let modules = resolveBuildDependencies('lib');

        const proc = (() => {
            const target = modules.shift();
            if (!target) {
                resolve();
                return;
            }

            const moduleFileName = target + '.ts';
            const typeFileName = target + '.d.ts';
            console.log('  library module compiling... ' + moduleFileName);
            const filePath = setupConfig('tsconfig.release.lib', target);
            command.exec('tsc', '-p ./tsconfig.release.lib.json')
            .then(() => {
                fs.removeSync(filePath);
                // move d.ts file
                const src_d_ts = path.join(LIB_D_TS_OUT_PATH, typeFileName);
                const dst_d_ts = path.join(BUILD_D_TS_OUT_PATH, typeFileName);
                fs.moveSync(src_d_ts, dst_d_ts, { overwrite: true });
                setTimeout(proc);
            })
            .catch((reason) => {
                reject(reason);
            });
        });
        setTimeout(proc);
    });
}

function compileReleasePorting(options) {
    if (!(options.all || options.porting)) {
        return Promise.resolve();
    }

    let targets = detectPorting(options.porting);
    if (targets.length <= 0) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const proc = (() => {
            const target = targets.shift();
            if (!target) {
                resolve();
                return;
            }

            let modules = resolveBuildDependencies('porting');

            const id = ('dev' === target) ? '' : '_' + target;
            const rootDir = (() => {
                if ('dev' === target) {
                    return config.dir.src + '/' + config.dir.porting;
                } else {
                    return 'platforms' + '/' + target + '/' + config.dir.porting;
                }
            })();

            const proc_compile = (() => {
                const module_tgt = modules.shift();
                if (!module_tgt) {
                    setTimeout(proc);
                    return;
                }

                const moduleFileName = module_tgt + '.ts';
                console.log('  porting module compiling... ' + moduleFileName);
                const filePath = setupConfig('tsconfig.release.porting', {
                    id: id,
                    moduleName: module_tgt,
                    rootDir: rootDir,
                });
                command.exec('tsc', '-p ./tsconfig.release.porting.json')
                .then(() => {
                    fs.removeSync(filePath);
                    setTimeout(proc_compile);
                })
                .catch((reason) => {
                    reject(reason);
                });
            });
            setTimeout(proc_compile);
        });
        setTimeout(proc);
    });
}

///////////////////////////////////////////////////////////////////////
// entries:

function runDev() {
    return compileDev();
}

function runDebug(options) {
    // app-lib -> porting
    return new Promise((resolve, reject) => {
        compileDebugAppLib(options)
        .then(() => {
            return compileDebugPorting(options);
        })
        .then(() => {
            resolve();
        })
        .catch((reason) => {
            reject(reason);
        });
    });
}

function runRelease(options) {
    // lib -> app -> porting
    return new Promise((resolve, reject) => {
        compileReleaseLib(options)
        .then(() => {
            return compileReleaseAppBootstrap(options);
        })
        .then(() => {
            return compileReleaseApp(options);
        })
        .then(() => {
            return compileReleasePorting(options);
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
    const options = queryOptions();

    let promise;
    switch (options.pkg) {
        case 'debug':
            promise = runDebug(options);
            break;
        case 'release':
            promise = runRelease(options);
            break;
        default:
            promise = runDev();
            break;
    }

    promise.catch((reason) => {
        console.error(reason);
        process.exit(1);
    });
}

main();
