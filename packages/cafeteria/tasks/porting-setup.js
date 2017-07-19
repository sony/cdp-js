/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs-extra');
const del       = require('del');
const glob      = require('glob');
const command   = require('./command');
const config    = require('../project.config');

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        porting: 'build',   // porting task: 'build' | 'arrange' | 'rebase' | 'clean'
        platform: 'all',
        release: false,
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('platform' === name) {
                    settings.platform = option.split('=')[1] || 'all';
                } else if ('porting' === name) {
                    settings.porting = option.split('=')[1] || 'build';
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

///////////////////////////////////////////////////////////////////////
// build:

function detectPorting(target) {
    const PORTING_DEV_DIR = path.join(config.dir.src, config.dir.porting);
    const PLATFORMS_ROOT = path.join(__dirname, '..', 'platforms');

    const valid_targets = [];

    // valid porting
    if (!fs.existsSync(PORTING_DEV_DIR)) {
        return valid_targets;
    }

    const temp_targets = [];

    if (null == target || 'all' === target) {
        temp_targets.push('dev');
        fs.readdirSync(PLATFORMS_ROOT)
        .forEach((find) => {
            const findPath = path.join(PLATFORMS_ROOT, find);
            if (fs.statSync(findPath).isDirectory()) {
                temp_targets.push(find);
            }
        });
    } else {
        const _targets = target.split(',');
        _targets.forEach((_tgt) => {
            temp_targets.push(_tgt);
        });
    }

    temp_targets.forEach((candidate) => {
        if ('dev' === candidate) {
            valid_targets.push('dev');
        } else {
            if (fs.existsSync(path.join('platforms', candidate, config.dir.porting))) {
                valid_targets.push(candidate);
            }
        }
    });

    return valid_targets;
}

function cleanPkgPorting() {
    const pkgDir = path.join(__dirname, '..', config.dir.pkg);
    glob.sync(config.dir.porting + '*', {
        cwd: pkgDir,
        nodir: false,
    }).forEach((find) => {
        const findPath = path.join(pkgDir, find);
        if (fs.statSync(findPath).isDirectory()) {
            fs.removeSync(findPath);
        }
    });
    return Promise.resolve();
}

function compileTS(platforms, release) {
    // npm run compile:ts -- --pkg=release --porting=android,ios
    return command.exec('npm', [
        'run',
        'compile:ts',
        '--',
        '--pkg=' + (release ? 'release' : 'debug'),
        '--porting=' + platforms.join(','),
    ]);
}

function compileSCSS(platforms) {
    // npm run compile:scss -- --pkg --porting=android,ios
    return command.exec('npm', [
        'run',
        'compile:scss',
        '--',
        '--pkg',
        '--porting=' + platforms.join(','),
    ]);
}

function compile(platforms, release) {
    return Promise.all([
        compileTS(platforms, release),
        compileSCSS(platforms),
    ]);
}

function copy(platforms) {
    platforms.forEach((platform) => {
        const srcDir = (() => {
            if ('dev' === platform) {
                return path.join(__dirname, '..', config.dir.src, config.dir.porting);
            } else {
                return path.join(__dirname, '..', 'platforms', platform, config.dir.porting);
            }
        })();

        const dstDir = (() => {
            let pkgPortingDir = path.join(__dirname, '..', config.dir.pkg, config.dir.porting);
            if ('dev' !== platform) {
                pkgPortingDir += ('_' + platform);
            }
            return pkgPortingDir;
        })();

        // templates
        glob.sync(config.dir.template + '/**/*', {
            cwd: srcDir,
            nodir: true,
        })
        .forEach((file) => {
            const src = path.join(srcDir, file);
            const dst = path.join(dstDir, file);
            fs.copySync(src, dst);
        });

        // stylesheets resource
        glob.sync(config.dir.stylesheet + '/**/*', {
            cwd: srcDir,
            nodir: true,
            ignore: [
                '**/*.css',
                '**/*.scss',
            ],
        })
        .forEach((file) => {
            const src = path.join(srcDir, file);
            const dst = path.join(dstDir, file);
            fs.copySync(src, dst);
        });
    });

    return Promise.resolve();
}

function runBuild(options) {
    const platforms = detectPorting(options.platform);
    if (platforms.length <= 0) {
        return Promise.resolve();
    } else {
        return new Promise((resolve, reject) => {
            cleanPkgPorting()
                .then(() => {
                    return compile(platforms, options.release);
                })
                .then(() => {
                    return copy(platforms);
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

///////////////////////////////////////////////////////////////////////
// arrange:

function runArrange(options) {
    const platforms = detectPorting(options.platform);
    if (platforms.length <= 0) {
        return;
    } else {
        platforms.forEach((platform) => {
            if ('dev' !== platform) {
                const srcDir = path.join(__dirname, '..', config.dir.pkg, config.dir.porting + '_' + platform);
                const dstDir = path.join(__dirname, '../platforms', platform, 'platform_www', config.dir.porting);
                if (fs.existsSync(srcDir)) {
                    fs.moveSync(srcDir, dstDir, { overwrite: true });
                }
            }
        });
    }
}

///////////////////////////////////////////////////////////////////////
// rebase:

function runRebase(options) {
    const platforms = detectPorting(options.platform);
    if (platforms.length <= 0) {
        return Promise.resolve();
    } else {
        const target = platforms[0];
        options.platform = target;
        runBuild(options)
        .then(() => {
            if ('dev' !== target) {
                const srcDir = path.join(__dirname, '..', config.dir.pkg, config.dir.porting + '_' + target);
                const dstDir = path.join(__dirname, '..', config.dir.pkg, config.dir.porting);
                if (fs.existsSync(srcDir)) {
                    fs.moveSync(srcDir, dstDir);
                }
            }
        })
        .catch((reason) => {
            console.error(reason);
            process.exit(1);
        });
    }
}

///////////////////////////////////////////////////////////////////////
// clean:

function runClean(options) {
    const platforms = detectPorting(options.platform);
    if (platforms.length <= 0) {
        return Promise.resolve();
    } else {
        platforms.forEach((platform) => {
            if ('dev' === platform) {
                // app/porting
                const dev_porting_dir = path.join(__dirname, '..', config.dir.src, config.dir.porting);
                Object.keys(config.built_cleanee).forEach((key) => {
                    del.sync(config.built_cleanee[key], { cwd: dev_porting_dir });
                });
            } else {
                // platforms/<platform>/porting
                const platform_porting_dir = path.join(__dirname, '../platforms', platform, config.dir.porting);
                Object.keys(config.built_cleanee).forEach((key) => {
                    del.sync(config.built_cleanee[key], { cwd: platform_porting_dir });
                });
                // platforms/<platform>/platform_www/porting
                const platform_www_porting_dir = path.join(__dirname, '../platforms', platform, 'platform_www', config.dir.porting);
                del.sync(platform_www_porting_dir);
            }
        });
    }
}

///////////////////////////////////////////////////////////////////////
// entry:

function main() {
    const options = queryOptions();
    switch (options.porting) {
        case 'build':
            runBuild(options)
            .catch((reason) => {
                console.error(reason);
                process.exit(1);
            });
            break;
        case 'arrange':
            runArrange(options);
            break;
        case 'rebase':
            runRebase(options);
            break;
        case 'clean':
            runClean(options);
            break;
    }
}

main();
