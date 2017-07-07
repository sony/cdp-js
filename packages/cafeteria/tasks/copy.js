/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs-extra');
const glob      = require('glob');
const config    = require('../project.config');

const SRC_DIR = path.join(__dirname, '..', config.dir.src);
const PKG_DIR = path.join(__dirname, '..', config.dir.pkg);
const DEV_RESOURCES = (() => {
    if (config.build_settings && config.build_settings.copy_src) {
        return config.build_settings.copy_src.dev_resource || [];
    }
    return [];
})();

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        task: 'build',
        release: false,
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('task' === name) {
                    settings.task = option.split('=')[1] || 'build';
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

function copyFoundation() {
    // templates
    glob.sync(config.dir.template + '/**/*', {
        cwd: SRC_DIR,
        nodir: true,
    })
    .forEach((file) => {
        const src = path.join(SRC_DIR, file);
        const dst = path.join(PKG_DIR, file);
        fs.copySync(src, dst);
    });

    // index.html
    fs.copySync(path.join(SRC_DIR, 'index.html'), path.join(PKG_DIR, 'index.html'));
}

function copyResource(release) {
    let ignore_resource = [];
    if (release) {
        DEV_RESOURCES.forEach((dir) => {
            ignore_resource.push(config.dir.res + '/' + dir + '/**/*');
        });
    }

    glob.sync(config.dir.res + '/**/*', {
        cwd: SRC_DIR,
        nodir: true,
        ignore: ignore_resource,
    })
    .forEach((file) => {
        const src = path.join(SRC_DIR, file);
        const dst = path.join(PKG_DIR, file);
        fs.copySync(src, dst);
    });
}

function copyStyleSheetResource() {
    // app
    glob.sync(config.dir.stylesheet + '/**/*', {
        cwd: SRC_DIR,
        nodir: true,
        ignore: [
            '**/*.css',
            '**/*.scss',
        ],
    })
    .forEach((file) => {
        const src = path.join(SRC_DIR, file);
        const dst = path.join(PKG_DIR, file);
        fs.copySync(src, dst);
    });

    // lib
    glob.sync(config.dir.lib + '/' + config.dir.stylesheet + '/**/*', {
        cwd: SRC_DIR,
        nodir: true,
        ignore: [
            '**/*.css',
            '**/*.scss',
        ],
    })
    .forEach((file) => {
        const src = path.join(SRC_DIR, file);
        const dst = path.join(PKG_DIR, file);
        fs.copySync(src, dst);
    });
}

function copyExternalModules(release) {
    const version_or_min_suffix_regex = /(-[0-9]+\.[0-9]+\.[A-Za-z0-9_-]+)?(\.min)?(\.[a-zA-Z]+$)/;
    const hasVersionString = (src) => {
        const match = src.match(version_or_min_suffix_regex);
        return (match[1] !== undefined);
    };

    // no versioning files
    glob.sync(config.dir.external + '/**/*', {
        cwd: SRC_DIR,
        nodir: true,
        ignore: [
            config.dir.external + '/' + config.dir.types + '/**/*',
            '**/*.min.*',
        ],
    })
    .forEach((file) => {
        if (!hasVersionString(file)) {
            const src = path.join(SRC_DIR, file);
            const dst = path.join(PKG_DIR, file);
            fs.copySync(src, dst);
        }
    });

    // versioned debug files
    glob.sync(config.dir.external + '/**/*', {
        cwd: SRC_DIR,
        nodir: true,
        ignore: [
            config.dir.external + '/' + config.dir.types + '/**/*',
            '**/*.min.*',
        ],
    })
    .forEach((file) => {
        if (hasVersionString(file)) {
            const src = path.join(SRC_DIR, file);
            const dst = path.join(PKG_DIR, file).replace(version_or_min_suffix_regex, '$3');
            fs.copySync(src, dst);
        }
    });

    // versioned 
    if (release) {
        glob.sync(config.dir.external + '/**/*.min.*', {
            cwd: SRC_DIR,
            nodir: true,
            ignore: [
                config.dir.external + '/' + config.dir.types + '/**/*',
            ],
        })
        .forEach((file) => {
            if (hasVersionString(file)) {
                const src = path.join(SRC_DIR, file);
                const dst = path.join(PKG_DIR, file).replace(version_or_min_suffix_regex, '$3');
                fs.copySync(src, dst);
            }
        });
    }
}

function copyLibModuleTypes() {
    const tempDir = path.join(__dirname, '..', config.dir.temp);
    glob.sync(config.dir.types + '/**/*', {
        cwd: tempDir,
        nodir: true,
    })
    .forEach((file) => {
        const src = path.join(tempDir, file);
        const dst = path.join(PKG_DIR, config.dir.lib, config.dir.script, file);
        fs.copySync(src, dst);
    });
}

function main() {
    const options = queryOptions();

    switch (options.task) {
        case 'build':
            copyFoundation();
            copyResource(options.release);
            copyStyleSheetResource();
            copyExternalModules(options.release);
            break;
        case 'lib-types': // for internal lib module package
            copyLibModuleTypes();
            break;
        default:
            break;
    }
}

main();
