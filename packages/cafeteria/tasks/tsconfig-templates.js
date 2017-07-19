/* eslint-env node, es6 */
'use strict';

const _      = require('lodash');
const config = require('../project.config');

const app           = config.dir.src;
const www           = config.dir.pkg;
const external      = config.dir.external;
const res           = config.dir.res;
const lib           = config.dir.lib;
const porting       = config.dir.porting;
const scripts       = config.dir.script;
const stylesheets   = config.dir.stylesheet;
const templates     = config.dir.template;
const types         = config.dir.types;
const tests         = config.dir.test;
const tasks         = config.dir.task;
const docs          = config.dir.doc;
const temp          = config.dir.temp;

const tsconfig_templates = {
    'tsconfig.debug.app-lib': {
        'extends': './tsconfig',
        'compilerOptions': {
            'outDir': `./${www}`,
            'rootDir': `./${app}`,
        },
        'exclude': [
            `${app}/${external}`,
            `${app}/${res}`,
            `${app}/${porting}`,
            `${app}/${stylesheets}`,
            `${app}/${templates}`,
            `platforms`,
            `${docs}`,
            `${tasks}`,
            `${tests}`,
            `${www}`,
            `${temp}`,
            `node_modules`,
            `bin`,
            `obj`
        ],
    },

    'tsconfig.debug.porting': {
        'extends': './tsconfig.base',
        'compilerOptions': {
            'outDir': `./${www}/${porting}<%= id %>/${scripts}`,
            'rootDir': '<%= rootDir %>',
        },
        'include': [
            '<%= rootDir %>',
            `${app}/${porting}/${scripts}/${types}`,
        ],
        'exclude': [
            `!${app}/${porting}`,
            `!platforms/*/${porting}`,
            `${app}/${external}`,
            `${app}/${res}`,
            `${app}/${stylesheets}`,
            `${app}/${templates}`,
            `${docs}`,
            `${tasks}`,
            `${tests}`,
            `${www}`,
            `${temp}`,
            `node_modules`,
            `bin`,
            `obj`
        ],
    },

    'tsconfig.release.bootstrap': {
        'extends': './tsconfig.base',
        'compilerOptions': {
            'outDir': `./${www}`,
            'rootDir': `./${app}`,
        },
        'include': [
            `${app}/${scripts}/config.ts`,
            `${app}/${scripts}/index.ts`,
        ],
        'exclude': [
            `${app}/${lib}`,
            `${app}/${external}`,
            `${app}/${res}`,
            `${app}/${porting}`,
            `${app}/${stylesheets}`,
            `${app}/${templates}`,
            `platforms`,
            `${docs}`,
            `${tasks}`,
            `${tests}`,
            `${www}`,
            `node_modules`,
            `bin`,
            `obj`
        ],
    },

    'tsconfig.release.app': {
        'extends': './tsconfig.base',
        'compilerOptions': {
            'outFile': `./${www}/${scripts}/app.js`,
        },
        'include': [
            `${app}/${scripts}/**/*.ts`,
            `./${temp}/${types}`,
        ],
        'exclude': [
            `${app}/${scripts}/config.ts`,
            `${app}/${scripts}/index.ts`,
            `${app}/${lib}`,
            `${app}/${external}`,
            `${app}/${res}`,
            `${app}/${porting}`,
            `${app}/${stylesheets}`,
            `${app}/${templates}`,
            `platforms`,
            `${docs}`,
            `${tasks}`,
            `${tests}`,
            `${www}`,
            `node_modules`,
            `bin`,
            `obj`
        ],
    },

    'tsconfig.release.lib': {
        'extends': './tsconfig.base',
        'compilerOptions': {
            'outFile': `./${www}/${lib}/${scripts}/<%= param %>.js`,
            'declaration': true,
        },
        'include': [
            `${app}/${lib}/${scripts}/<%= param %>/**/*.ts`,
            `./${temp}/${types}`,
        ],
        'exclude': [
            `${app}/${scripts}`,
            `${app}/${external}`,
            `${app}/${res}`,
            `${app}/${porting}`,
            `${app}/${stylesheets}`,
            `${app}/${templates}`,
            `platforms`,
            `${docs}`,
            `${tasks}`,
            `${tests}`,
            `${www}`,
            `node_modules`,
            `bin`,
            `obj`
        ],
    },
    'tsconfig.release.porting': {
        'extends': './tsconfig.base',
        'compilerOptions': {
            'outFile': `./${www}/${porting}<%= id %>/${scripts}/<%= moduleName %>.js`,
        },
        'include': [
            `<%= rootDir %>/${scripts}/<%= moduleName %>/**/*.ts`,
            `${app}/${porting}/${scripts}/${types}`,
        ],
        'exclude': [
            `!${app}/${porting}`,
            `!platforms/*/${porting}`,
            `${app}/${external}`,
            `${app}/${res}`,
            `${app}/${stylesheets}`,
            `${app}/${templates}`,
            `${docs}`,
            `${tasks}`,
            `${tests}`,
            `${www}`,
            `node_modules`,
            `bin`,
            `obj`
        ],
    },
};

function tsconfig(id, param) {
    if (!tsconfig_templates[id]) {
        throw Error('cannto find tsconfig: ' + id);
    }
    let templateParam;
    if ('string' === typeof param) {
        templateParam = {
            param: param
        };
    } else {
        templateParam = param;
    }
    return _.template(
        JSON.stringify(tsconfig_templates[id], null, 4)
        )(templateParam);
}

module.exports = {
    tsconfig: tsconfig,
};
