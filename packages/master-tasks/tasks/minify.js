/* eslint-env node, es6 */
'use strict';
const path      = require('path');
const fs        = require('fs-extra');
const glob      = require('glob');
const srcmap    = require('./srcmap');
const config    = require('../project.config');

const PKG_DIR   = path.join(__dirname, '..', config.dir.pkg);

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        all: true,
        minify: true,
        rename: false,
        map: null,          // for map file generate.
        external: null,     // for map copy from external.
        js: false,
        css: false,
        html: false,
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('no-minify' === name) {
                    settings.minify = false;
                } else if ('rename' === name) {
                    settings.rename = option.split('=')[1] || true;
                } else if ('map' === name) {
                    settings.map = option.split('=')[1] || PKG_DIR;
                } else if ('external' === name) {
                    settings.external = (null != option.split('=')[1]) ? option.split('=')[1] : true;
                } else if (name === key) {
                    settings.all = false;
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

function minifyJS(options) {
    const uglifyjs = require('uglify-js');
    glob.sync('**/*.js', {
        cwd: PKG_DIR,
        nodir: true,
        ignore: [
            '**/*.min.js',
            config.dir.external + '/**/*',
            config.dir.res + '/**/*',
            config.dir.stylesheet + '/**/*',
            config.dir.template + '/**/*',
        ],
    }).forEach((file) => {
        console.log('  minify... ' + file);
        const outFile = options.rename ? path.basename(file, '.js') + '.min.js' : file;
        const srcPath = path.join(PKG_DIR, file);
        const dstPath = path.join(PKG_DIR, outFile);
        const mapPath = options.map ? path.join(options.map, outFile + '.map') : null;
        const src = fs.readFileSync(srcPath).toString();

        const _map = options.map ? {
            content: 'inline',
            url: path.basename(outFile) + '.map',
        } : null;

        const result = uglifyjs.minify(src, {
            sourceMap: _map,
            output: {
                comments: /^!\n/,
            },
        });

        fs.outputFileSync(dstPath, result.code);
        if (options.map) {
            fs.outputFileSync(mapPath, result.map);
        }
    });
}

function minifyCSS(options) {
    const cleancss = require('clean-css');
    glob.sync('**/*.css', {
        cwd: PKG_DIR,
        nodir: true,
        ignore: [
            '**/*.min.css',
            config.dir.external + '/**/*',
            config.dir.res + '/**/*',
            config.dir.script + '/**/*',
            config.dir.template + '/**/*',
        ],
    }).forEach((file) => {
        console.log('  minify... ' + file);
        const outFile = options.rename ? path.basename(file, '.css') + '.min.css' : file;
        const srcPath = path.join(PKG_DIR, file);
        const dstPath = path.join(PKG_DIR, outFile);
        const mapPath = options.map ? path.join(options.map, outFile + '.map') : null;
        const css = srcmap.separateScriptAndMapFromScriptFile(srcPath, true);

        const result = new cleancss({
            format: {
                breaks: {
                    afterComment: true,
                },
            },
            sourceMap: options.map || false,
            sourceMapInlineSources: options.map || false,
        }).minify(css.script, css.map);

        if (options.map) {
            result.styles += '\n/*# sourceMappingURL=' + path.basename(outFile) + '.map */';
        }

        result.styles = result.styles.replace(/\r\n/gm, '\n');

        fs.outputFileSync(dstPath, result.styles);
        if (options.map) {
            fs.outputFileSync(mapPath, result.sourceMap);
        }
    });
}

function minifyHTML() {
    const htmlmin = require('html-minifier');
    glob.sync('**/*.html', {
        cwd: PKG_DIR,
        nodir: true,
        ignore: [
            config.dir.external + '/**/*',
            config.dir.res + '/**/*',
            config.dir.script + '/**/*',
            config.dir.stylesheet + '/**/*',
        ],
    }).forEach((file) => {
        console.log('  minify... ' + file);
        const srcPath = path.join(PKG_DIR, file);
        const src = fs.readFileSync(srcPath).toString();
        const result = htmlmin.minify(src, {
            removeComments: true,
            collapseWhitespace: true,
        });
        fs.outputFileSync(srcPath, result);
    });
}

function copyExternalModueMap() {
    const SRC_DIR = path.join(__dirname, '..', config.dir.src);
    glob.sync(config.dir.external + '/**/*.map', {
        cwd: SRC_DIR,
        nodir: true,
    })
    .forEach((file) => {
        const src = path.join(SRC_DIR, file);
        const dst = path.join(PKG_DIR, file);
        fs.copySync(src, dst);
    });
}

function main() {
    const options = queryOptions();
    if (!options.minify) {
        return;
    }

    if (options.all || options.js) {
        minifyJS(options);
    }
    if (options.all || options.css) {
        minifyCSS(options);
    }
    if (options.all || options.html) {
        minifyHTML();
    }
    if (options.map && (options.external || (null == options.external))) {
        copyExternalModueMap();
    }
}

main();
