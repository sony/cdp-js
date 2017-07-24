'use strict';

const path  = require('path');
const pkg   = require('./package.json');

const target = {
    type: 'monorepo-root',
    es: 'es2015',
    module: 'none',
    env: 'node',
};

const dir = {
    pkg: 'dist',
    doc: 'docs',
    task: 'tasks',
};

const distribution_target = 'cdp-mobile';

const include_modules = [
    'cdp-lazyload',
    'cdp-core',
    'cdp-promise',
    'cdp-i18n',
    'cdp-framework-jqm',
    'cdp-tools',
    'cdp-ui-listview',
    'cdp-ui-jqm',
    'cdp-nativebridge',
    'cdp-mobile',
];

// project configuration
module.exports = {
    target: target,
    pkg: pkg,
    dir: dir,
    distribution_target: distribution_target,
    include_modules: include_modules,
};
