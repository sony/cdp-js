/* eslint-env node, es6 */
'use strict';
const fs        = require('fs');
const path      = require('path');
const config    = require('../project.config');

const BANNER_FILE       = config.banner.fileName;
const D_TS_DESCRIPTION  = config.banner.d_ts_desc;  // @VERSION replaced this string.

function buildDate() {
    return new Date().toISOString();
}

function banner(extension, name, version) {
    let pkg = require(path.join(__dirname, '..', 'package.json'));
    let bannerPath = path.join(__dirname, '..', BANNER_FILE);
    name = name || pkg.name;
    version = version || pkg.version;
    if (fs.existsSync(bannerPath)) {
        let banner = fs.readFileSync(bannerPath).toString()
            .replace('@MODULE_NAME', name + extension)
            .replace('@VERSION', ('.d.ts' !== extension) ? version : D_TS_DESCRIPTION)
            .replace('@DATE', buildDate())
            .replace(/ $/gm, '')
            .replace(/\r\n/gm, '\n')    // normalize line feed
        ;
        return banner;
    } else {
        return '/*!\n * ' + name + extension + '\n * ' + buildDate() + '\n */\n';
    }
}

module.exports = banner;
