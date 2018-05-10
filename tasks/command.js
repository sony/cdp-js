/* eslint-env node, es6 */
'use strict';
const path  = require('path');
const spawn = require('child_process').spawn;

function exec(command, args, options) {
    if (!(args instanceof Array)) {
        if (args) {
            args = args.trim().split(' ');
        } else {
            args = [];
        }
    }

    // trim quotation
    args = args.map((arg) => {
        return arg
            .replace(/^'+|'+$/g, '')
            .replace(/^"+|"+$/g, '');
    });

    return new Promise((resolve, reject) => {
        const opt = Object.assign({}, {
            stdio: 'inherit',
            stdout: (data) => { /* noop */ },
            stderr: (data) => { /* noop */ },
        }, options);

        const ext = path.extname(command);
        let resolveCmd;
        if ('npm' === command) {
            resolveCmd = 'npm' + (process.platform === 'win32' ? '.cmd' : '');
        } else if (ext) {
            resolveCmd = command;
        } else {
            resolveCmd =
                path.join(__dirname, '..', 'node_modules/.bin', command) +
                (process.platform === 'win32' ? '.cmd' : '');
        }

        const child = spawn(resolveCmd, args, opt)
            .on('error', (msg) => {
                reject(msg);
            })
            .on('close', (code) => {
                if (0 !== code) {
                    reject('error occered. code: ' + code);
                } else {
                    resolve(code);
                }
            });

        if ('pipe' === opt.stdio) {
            child.stdout.on('data', (data) => {
                opt.stdout(data.toString());
            });
            child.stderr.on('data', (data) => {
                opt.stderr(data.toString());
            });
        }
    });
}

module.exports = {
    exec: exec,
};
