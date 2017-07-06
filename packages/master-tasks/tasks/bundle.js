/* eslint-env node, es6 */
/* eslint-disable no-regex-spaces */
'use strict';
const fs        = require('fs');
const path      = require('path');
const banner    = require('./banner');
const config    = require('../project.config');

const DST_PATH = path.join(__dirname, '..', config.dir.pkg);

const SOURCE_MAP_NAMESPACE = (() => {
    if (config.main.namespace) {
        return config.main.namespace + ':///';
    } else {
        return config.pkg.name + ':///';
    }
})();

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        target: 'embed',    // "embed" | "amd" | "pure-js" | "css"
        banner: true,
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('target' === name) {
                    settings.target = option.split('=')[1] || 'embed';
                } else if ('no-banner' === name) {
                    settings.banner = false;
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

///////////////////////////////////////////////////////////////////////
// for pure javascript project

function bundlePureJS() {
    const SRC_PATH = path.join(__dirname, '..', config.dir.src, config.dir.script);

    // source
    const src = fs.readFileSync(path.join(SRC_PATH, config.main.basename + '.js')).toString();
    const bundleSrc = '\ufeff' + banner('.js', config.main.basename) + src
            .replace(/^\ufeff/gm, '')
            .replace(/\r\n/gm, '\n')
    ;
    fs.writeFileSync(path.join(DST_PATH, config.main.basename + '.js'), bundleSrc);

    // d.ts
    const dts = fs.readFileSync(path.join(SRC_PATH, config.main.bundle_d_ts)).toString();
    const bundleDTS = '\ufeff' + banner('.d.ts', config.main.basename) + dts
            .replace(/^\ufeff/gm, '')
            .replace(/\r\n/gm, '\n')
    ;
    if (!fs.existsSync(path.join(DST_PATH, config.dir.types))) {
        fs.mkdirSync(path.join(DST_PATH, config.dir.types));
    }
    fs.writeFileSync(path.join(DST_PATH, config.dir.types, config.main.bundle_d_ts), bundleDTS);
}

///////////////////////////////////////////////////////////////////////
// for classical module structure

function bundleEmbedJS(options) {
    const srcmap = require('./srcmap');
    const BUILT_PATH = path.join(__dirname, '..', config.dir.built);

    // commpact entry file
    const wrap = fs.readFileSync(
        path.join(BUILT_PATH, config.main.basename + '-entry.js')
    ).toString()
        .replace(/^\ufeff/gm, '')
        .replace(/\r\n/gm, '\n')
        .replace(/\/\/<<[\s\S]*?\/\/>>/, '__LIRBRARY_CODE__')
        .replace(/\/\*[\s\S]*?\*\//gm, '')
        .replace(/\/\/[\s\S]*?\n/gm, '')
        .replace(/ {4}/gm, '')
        .replace(/\n/gm, ' ')
        .replace('__LIRBRARY_CODE__', '\n' + '__LIRBRARY_CODE__' + '\n')
        .replace(/^ /gm, '')
        .replace(/ $/gm, '')
        .split('\n');

    const imple = fs.readFileSync(
        path.join(BUILT_PATH, config.main.basename + '-all.js')
    ).toString()
        .replace(/^\ufeff/gm, '')
        .replace(/\r\n/gm, '\n')
    ;

    const node = srcmap.getNodeFromCode(imple);

    node.prepend(wrap[0] + '\n');
    if (options.banner) {
        node.prepend(banner('.js', config.main.basename));
    }
    node.add('\n' + wrap[2] + '\n');

    const bundleSrc = '\ufeff' + srcmap.getCodeFromNode(node, (srcPath) => {
        const regex_src = new RegExp(`${config.dir.src}\\/${config.dir.script}\\/`);
        return srcPath
            .replace(/\.\.\//g, '')
            .replace(regex_src, SOURCE_MAP_NAMESPACE)
        ;
    });
    fs.writeFileSync(path.join(BUILT_PATH, config.main.basename + '.js'), bundleSrc);
    fs.writeFileSync(path.join(DST_PATH, config.main.basename + '.js'), bundleSrc);
}

///////////////////////////////////////////////////////////////////////
// for cdp module

// bunner
function generateBannerNode() {
    const _ = require('lodash');
    const srcmap = require('./srcmap');

    const dependencies = (() => {
        var modules = [];
        config.include_modules.forEach(function (target) {
            const pkgPath = path.join(__dirname, '../..', target, 'package.json');
            const pkg = require(pkgPath);
            modules.push({
                name: pkg.name,
                version: pkg.version,
            });
        });

        const include = fs.readFileSync(path.join(__dirname, '..', 'BANNER-INCLUDES')).toString();
        return _.template(include)({ modules: modules });
    })();

    const bannerText = banner('', null)
        .replace(' */', dependencies)
        .replace(/\ufeff/gm, '')
    ;

    return srcmap.getNodeFromCode(bannerText);
}

// bundle entry
function bundleAMD() {
    if (null == config.include_modules) {
        return;
    }

    const rjs    = require('requirejs');
    const srcmap = require('./srcmap');
    const BUILT_PATH = path.join(__dirname, '..', config.dir.built);

    const sourceNodes = [];

    const setSourceNode = (name, path, code) => {
        // ensure module name
        code = code
            .replace('define([', `define("${name}", [`)
            .replace(`define('${name}'`, `define("${name}"`)
            .replace(`define("${config.main.basename}",`, 'define(')
            .replace('define( [', 'define([')
        ;

        // create sourceNode from code.
        const node = srcmap.getNodeFromCode(code);

        // add shim chunk if special case.
        if (config.main.basename === name) {
            const shim = `// amd define function shim
(function (root) {
    if (!(typeof define === "function" && define.amd)) {
        root.define = function () { /* noop */ };
    }
})(this);
`;
            node.prepend(shim + '\n');
        }

        // cache node
        sourceNodes.push(node);
        return node.toString();
    };

    const options = {
        preserveLicenseComments: true,
        baseUrl: config.dir.built,
        name: config.main.basename,
        include: (() => {
            const modules = [];
            config.include_modules.forEach(function (target) {
                modules.push(target.replace(/-/g, '.'));
            });
            return modules;
        })(),
        paths: {
            'jquery': 'empty:',
            'underscore': 'empty:',
            'backbone': 'empty:',
        },
        out: `${config.dir.built}/${config.main.basename}-all.js`,
        optimize: 'none',
        onBuildWrite: function (name, path, contents) {
            return setSourceNode(name, path, contents);
        }
    };

    // rename: {basename}-all.js -> {basename}.js
    fs.writeFileSync(
        path.join(BUILT_PATH, `${config.main.basename}.js`),
        fs.readFileSync(path.join(BUILT_PATH, `${config.main.basename}-all.js`)).toString()
    );

    // copy modules
    const srcPath = path.join(__dirname, '..', config.dir.external, 'cdp', config.dir.script);
    fs.readdirSync(srcPath)
    .forEach((file) => {
        const src = path.join(srcPath, file);
        if (fs.statSync(src).isFile()) {
            const dst = path.join(BUILT_PATH, file);
            fs.writeFileSync(dst, fs.readFileSync(src).toString());
        }
    });

    // bundle
    rjs.optimize(
        options,
        () => {
            const node = generateBannerNode();
            sourceNodes.forEach((srcnode) => {
                node.add(srcnode);
            });

            const script = srcmap.getCodeFromNode(node, (source) => {
                return source
                    .replace(`../${config.dir.src}/${config.dir.script}`, `${config.main.namespace}:///exports:/`)
                    .replace('webpack:/webpack', 'webpack:///webpack')
                    .replace('webpack:/external', 'webpack:///external')
                ;
            });
            fs.writeFileSync(
                path.join(BUILT_PATH, `${config.main.basename}.js`),
                script
            );
            fs.writeFileSync(
                path.join(DST_PATH, `${config.main.basename}.js`),
                script
            );
        }
    );
}

///////////////////////////////////////////////////////////////////////
// for d.ts

function bundleDTS() {
    const DST_PATH = path.join(__dirname, '..', config.dir.pkg);
    const TYPE_DEF_FILE = path.join(DST_PATH, config.dir.types, config.main.bundle_d_ts);
    const SRC_DEF_FILE = path.join(__dirname, '..', config.dir.built, config.main.basename + '-all.d.ts');

    let src = '\ufeff' + banner('.d.ts', config.main.basename) + fs.readFileSync(SRC_DEF_FILE).toString()
            .replace(/^\ufeff/gm, '')
            .replace(/\r\n/gm, '\n')
    ;

    const refPathInfo = [];
    const refPathDefs = src.match(/<reference path="[\s\S]*?"/g);

    if (null != refPathDefs) {
        refPathDefs.forEach((refpath) => {
            const filePath = refpath.match(/("|')[\s\S]*?("|')/)[0].replace(/("|')/g, '');
            const fileName = path.basename(filePath);
            refPathInfo.push({
                refpath: refpath,
                path: filePath,
                file: fileName,
            });
        });
        refPathInfo.forEach((target) => {
            src = src.replace(target.refpath, '<reference path="' + target.file + '"');
        });
        // remove '_dev.dependencies.d.ts' reference.
        src = src.replace(/\/\/\/ <reference path="_dev.dependencies.d.ts"[\s\S]*?\n/g, '');
    }

    if (!fs.existsSync(path.join(DST_PATH, config.dir.types))) {
        fs.mkdirSync(path.join(DST_PATH, config.dir.types));
    }
    fs.writeFileSync(TYPE_DEF_FILE, src);
}

function copyExtraDTS() {
    // copy d.ts
    const SRC_TYPES_DIR = path.join(__dirname, '..', `${config.dir.src}/${config.dir.script}`, config.dir.types);
    const DST_TYPES_DIR = path.join(__dirname, '..', config.dir.pkg, config.dir.types);

    if (!fs.existsSync(DST_TYPES_DIR)) {
        fs.mkdirSync(DST_TYPES_DIR);
    }

    fs.readdirSync(SRC_TYPES_DIR)
    .forEach((filePath) => {
        const src = path.join(SRC_TYPES_DIR, filePath);
        const dst = path.join(DST_TYPES_DIR, filePath);
        if (fs.statSync(src).isFile()) {
            fs.writeFileSync(dst, fs.readFileSync(src).toString());
        }
    });
}

///////////////////////////////////////////////////////////////////////
// for post processed css

function bundleCSS() {
    const glob      = require('glob');
    const srcmap    = require('./srcmap');
    const BUILT_PATH = path.join(__dirname, '..', config.dir.built);

    glob.sync('**/*.css', {
        cwd: BUILT_PATH
    }).forEach((file) => {
        const src = fs.readFileSync(path.join(BUILT_PATH, file)).toString()
            .replace(/^\ufeff/gm, '')
            .replace(/\r\n/gm, '\n')
        ;
        const node = srcmap.getNodeFromCode(src);
        node.prepend(banner('.css', path.basename(file, '.css')));
        const bundleSrc = '\ufeff' + srcmap.getCodeFromNode(node, (srcPath) => {
            const regex_src = new RegExp(`${config.dir.src}\\/${config.dir.stylesheet}\\/`);
            return srcPath
                .replace(/\.\.\//g, '')
                .replace(regex_src, SOURCE_MAP_NAMESPACE)
            ;
        }, { multiline: true });
        fs.writeFileSync(path.join(BUILT_PATH, file), bundleSrc);
        fs.writeFileSync(path.join(DST_PATH, file), bundleSrc);
    });
}

function main() {
    const options = queryOptions();

    switch (options.target) {
        case 'embed':
            bundleEmbedJS(options);
            bundleDTS();
            copyExtraDTS();
            break;
        case 'amd':
            bundleAMD();
            bundleDTS();
            copyExtraDTS();
            break;
        case 'pure-js':
            bundlePureJS();
            break;
        case 'css':
            bundleCSS();
            break;
        default:
            break;
    }
}

main();
