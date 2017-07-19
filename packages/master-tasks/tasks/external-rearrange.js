/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs-extra');
const glob      = require('glob');
const config    = require('../project.config');

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        minify: true,
        map: true,
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('no-minify' === name) {
                    settings.minify = false;
                } else if ('no-map' === name) {
                    settings.map = false;
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

///////////////////////////////////////////////////////////////////////
// setup extenal info:

function createBasenameList(files) {
    const basenames = {};
    files.forEach(function (file) {
        const basename = file.replace(/(-[0-9]+.[0-9]+.[A-Za-z0-9_-]+)?([.-]min)?(.amd|.commonjs|.mustache)?(\.[a-zA-Z]+$)/, '');
        basenames[basename] = true;
    });
    return Object.keys(basenames);
}

function resolveModuleInfo(target) {
    const moduleDir = path.join(path.join(__dirname, '..', 'node_modules'), target);
    if (!fs.existsSync(moduleDir)) {
        return null;
    }

    const pkgInfo = require(path.join(moduleDir, 'package.json'));
    const adjuster = (() => {
        if (config.external_rearrange && config.external_rearrange.module_adjuster) {
            return config.external_rearrange.module_adjuster;
        }
        return {};
    })();

    let info = Object.assign({
        version: pkgInfo.version,
        vender: target,
        type: 'js',
        rename: null,
        cwd: null,
        dev: null,
        prod: null,
        ignore: {
            dev: null,
            prod: null,
        },
        files: [],
    }, adjuster[target] || {});

    // cwd
    if (null == info.cwd) {
        if (null != pkgInfo.main) {
            info.cwd = path.dirname(path.join(moduleDir, pkgInfo.main));
        } else {
            info.cwd = moduleDir;
        }
    } else {
        info.cwd = path.join(moduleDir, info.cwd);
    }

    // dev
    if (null == info.dev) {
        if (null != pkgInfo.main) {
            info.dev = path.basename(pkgInfo.main);
        } else if (fs.existsSync(path.join(moduleDir, 'index.js'))) {
            info.dev = 'index.js';
        } else if (fs.existsSync(path.join(moduleDir, target + '.js'))) {
            info.dev = target + '.js';
        } else {
            return null;
        }
    }

    // rename
    if ('index.js' === info.dev) {
        info.rename = target;
    } else if (0 < info.dev.indexOf('.min.js')) {
        info.rename = target;
        info.prod = info.dev;
    }

    // prod
    if (null == info.prod) {
        const trySuffix = [
            ".min.js",
            "-min.js",
        ];
        for (let i = 0, n = trySuffix.length; i < n; i++) {
            const candidate = path.basename(info.dev, '.js') + trySuffix[i];
            if (fs.existsSync(path.join(info.cwd, candidate))) {
                info.prod = candidate;
            }
        }
    }

    // parse: dev
    glob.sync(info.dev, {
        cwd: info.cwd,
        ignore: info.ignore.dev,
        nodir: true,
    }).forEach((file) => {
        info.files.push(file);
    });

    // parse: prod
    if (info.prod) {
        glob.sync(info.prod, {
            cwd: info.cwd,
            ignore: info.ignore.prod,
            nodir: true,
        }).forEach((file) => {
            info.files.push(file);
        });
    }

    // set basenames
    info.basenames = createBasenameList(info.files);

    return info;
}

///////////////////////////////////////////////////////////////////////
// rearrange:

function deleteOldFiles(info, dir) {
    info.basenames.forEach((basename) => {
        const cwd = (() => {
            if (config.external_rearrange && config.external_rearrange.root) {
                return path.join(__dirname, '..', config.external_rearrange.root, info.vender, dir);
            }
            return path.join(__dirname, '..', config.dir.src, config.dir.external, info.vender, dir);
        })();
        const target = info.rename ? info.rename : basename;
        glob.sync(target + '*', {
            cwd: cwd,
            nodir: true,
        }).forEach((file) => {
            const regexp = new RegExp(target + '(-[0-9]+.[0-9]+.[A-Za-z0-9_-]+)?([.-]min)?(.[a-zA-Z]+$)');
            if (regexp.exec(file)) {
                fs.unlinkSync(path.join(cwd, file));
                console.log('  removed: ' + file);
            }
        });
    });
}

function resolveDevSourceFile(basename, info, ext) {
    let srcFile = info.files[info.files.indexOf(basename + ext)];
    if (!srcFile) {
        srcFile = info.files[info.files.indexOf(basename + '-' + info.version + ext)];
    }
    if (!srcFile) {
        srcFile = info.files[info.files.indexOf(info.dev.replace('*', info.version))];
    }
    return srcFile;
}

function resolveProdSourceFile(basename, info, ext) {
    let srcFile = info.files[info.files.indexOf(basename + '-' + info.version + '.min' + ext)];
    if (!srcFile && info.prod) {
        srcFile = info.files[info.files.indexOf(info.prod)];
        if (!srcFile) {
            srcFile = info.files[info.files.indexOf(info.prod.replace('*', info.version))];
        }
        if (!srcFile) {
            const regexp = new RegExp(basename + '(-[0-9]+.[0-9]+.[A-Za-z0-9_-]+)?([.-]min.[a-zA-Z]+$)');
            for (let i = 0, n = info.files.length; i < n; i++) {
                if (regexp.test(info.files[i])) {
                    srcFile = info.files[i];
                    break;
                }
            }
        }
    }
    return srcFile;
}

function rearrangeCore(extension, info, minifyFunc, options) {
    let typeDir;
    switch (extension) {
        case '.js':
            typeDir = config.dir.script;
            break;
        case '.css':
            typeDir = config.dir.stylesheet;
            break;
        default:
            console.error('unsupported extension: ' + extension);
            return;
    }

    deleteOldFiles(info, typeDir);

    const SRC_DIR = info.cwd;
    const DST_DIR = (() => {
        if (config.external_rearrange && config.external_rearrange.root) {
            return path.join(__dirname, '..', config.external_rearrange.root, info.vender, typeDir);
        }
        return path.join(__dirname, '..', config.dir.src, config.dir.external, info.vender, typeDir);
    })();
    info.basenames.forEach((basename) => {
        const srcFile = resolveDevSourceFile(basename, info, extension);
        if (srcFile) {
            const dstBaseName = info.rename || basename;
            let fileName;
            let src;
            let dst;

            // deveropment: non-version
            fileName = dstBaseName + extension;
            src = path.join(SRC_DIR, srcFile);
            dst = path.join(DST_DIR, fileName);
            fs.copySync(src, dst);
            console.log('  update...   ' + fileName);

            // deveropment: with version
            fileName = dstBaseName + '-' + info.version + extension;
            dst = path.join(DST_DIR, fileName);
            fs.copySync(src, dst);
            console.log('  update...   ' + fileName);

            // production: with version
            fileName = dstBaseName + '-' + info.version + '.min' + extension;
            dst = path.join(DST_DIR, fileName);
            const srcProdFile = resolveProdSourceFile(basename, info, extension);
            if (srcProdFile) {
                const srcProdFilePath = path.join(SRC_DIR, srcProdFile);
                fs.copySync(srcProdFilePath, dst);
                console.log('  update...   ' + fileName);
                // production: map file
                let mapFilePath = srcProdFilePath + '.map';
                if (!fs.existsSync(mapFilePath)) {
                    const regexp = new RegExp(extension, 'i');
                    mapFilePath = srcProdFilePath.replace(regexp, '.map');
                }
                if (fs.existsSync(mapFilePath)) {
                    fs.copySync(mapFilePath, path.join(DST_DIR, path.basename(mapFilePath)));
                }
            } else if (options.minify) {
                const srcText = fs.readFileSync(src).toString();
                const result = minifyFunc(srcText, dstBaseName);
                fs.outputFileSync(path.join(DST_DIR, fileName), result.code);
                if (options.map) {
                    fs.outputFileSync(path.join(DST_DIR, dstBaseName + '.min' + extension + '.map'), result.map);
                }
                console.log('  generate... ' + fileName);
            }
        }
    });
}

function rearrangeJS(info, options) {
    rearrangeCore('.js', info, (srcText, baseName) => {
        const _mapOption = {
            includeSources: true,
            url: baseName + '.min.js.map',
        };

        const uglifyjs = require('uglify-js');
        const result = uglifyjs.minify(srcText, {
            sourceMap: options.map ? _mapOption : undefined,
            output: {
                comments: /^!\n/,
            },
        });

        if (options.map) {
            // assign sources.
            const map = JSON.parse(result.map);
            map.sources[0] = config.dir.external + ':///' + info.vender + '/' + baseName + '.js';
            result.map = JSON.stringify(map);
        }

        return result;
    }, options);
}

function rearrangeCSS(info, options) {
    rearrangeCore('.css', info, (srcText, baseName) => {
        const cleancss = require('clean-css');
        const result = new cleancss({
            format: {
                breaks: {
                    afterComment: true,
                },
            },
            sourceMap: options.map,
        }).minify(srcText);

        if (options.map) {
            result.styles += '\n/*# sourceMappingURL=' + baseName + '.min.css.map */';
        }

        return {
            code: result.styles,
            map: result.sourceMap,
        };
    }, options);
}

function rearrange(target, options) {
    const info = resolveModuleInfo(target);
    if (null == info) {
        console.warn('unresolve module: ' + target);
        return;
    }

    switch (info.type) {
        case 'js':
            rearrangeJS(info, options);
            break;
        case 'css':
            rearrangeCSS(info, options);
            break;
        case 'both':
            rearrangeJS(info, options);
            rearrangeCSS(info, options);
            break;
    }
}

function main() {
    const options = queryOptions();

    const ignore = config.external_rearrange ? config.external_rearrange.ignore_modules : [];
    Object.keys(config.pkg.dependencies).forEach((external) => {
        for (let i = 0, n = ignore.length; i < n; i++) {
            const regexp = new RegExp(ignore[i]);
            if (regexp.test(external)) {
                return;
            }
        }
        rearrange(external, options);
    });
    if (config.external_rearrange && config.external_rearrange.specified_modules) {
        config.external_rearrange.specified_modules.forEach((external) => {
            rearrange(external, options);
        });
    }
}

main();
