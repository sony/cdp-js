/* eslint-env node, es6 */
'use strict';
const fs        = require('fs');
const path      = require('path');
const command   = require('./command');

const CORDOVA_COMMANDS = (() => {
    const cmdIndex = process.env.CORDOVA_CMDLINE.lastIndexOf('cordova');
    return process.env.CORDOVA_CMDLINE.slice(cmdIndex + 'cordova '.length);
})();

function validCommand(supports) {
    if (!(supports instanceof Array)) {
        return false;
    }
    for (let i = 0, n = supports.length; i < n; i++) {
        const regexp = new RegExp(supports[i], 'ig');
        if (regexp.test(CORDOVA_COMMANDS)) {
            return true;
        }
    }
    return false;
}

function queryOptions() {
    let settings = {
        hook: true,
        release: false,
        original: '',
    };

    const options = CORDOVA_COMMANDS.match(/--[\S]+\b/ig);
    if (options) {
        Object.keys(settings).forEach((key) => {
            options.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('no-hook' === name) {
                    settings.hook = false;
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
        settings.original = options.join(' ');
    }

    return settings;
}

function queryPlatforms() {
    const platforms = [];

    const validateList = (() => {
        const supports = [];
        const PLATFORMS_ROOT = path.join(__dirname, '..', 'platforms');

        fs.readdirSync(PLATFORMS_ROOT)
        .forEach((find) => {
            const findPath = path.join(PLATFORMS_ROOT, find);
            if (fs.statSync(findPath).isDirectory()) {
                supports.push({
                    platform: find,
                    regexp: new RegExp(find, 'ig'),
                });
            }
        });

        return supports;
    })();

    validateList.forEach((checker) => {
        if (checker.regexp.test(CORDOVA_COMMANDS)) {
            platforms.push(checker.platform);
        }
    });

    // if platforms is empty yet, try to build for all detected targets.
    if (platforms.length <= 0) {
        validateList.forEach((checker) => {
            platforms.push(checker.platform);
        });
    }

    return platforms;
}

function onCommand(supports) {
    if (!validCommand(supports)) {
        return;
    }

    const options = queryOptions();
    if (!options.hook) {
        return;
    }

    // run npm scripts
    command.exec('npm', [
        'run',
        'build:' + (options.release ? 'release' : 'debug'),
        '-s',   // slilent
        '--',
        '--platform=' + queryPlatforms().join(','),
        options.original,
    ])
    .catch((reason) => {
        console.error(Error);
        process.exit(1);
    });
}

module.exports = onCommand;
