/* eslint-env node, es6 */
'use strict';
const fs    = require('fs');
const path  = require('path');

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        mode: 'copy',   // "copy" | "link" | "make"
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if ('mode' == name) {
                    settings.mode = option.split('=')[1] || 'copy';
                } else if (name === key) {
                    settings[key] = true;
                }
            });
        });
    }

    return settings;
}

// call from packages
function setupByCopy() {
    let task_dir;
    let required_tasks;

    try {
        const config = require(path.join(process.cwd(), 'project.config'));
        required_tasks = config.required_tasks;
        if (!required_tasks) {
            throw Error('no task required.');
        }
        task_dir = config.dir.task;
        if (!task_dir) {
            throw Error('task directory not defined.');
        }
    } catch (error) {
        console.warn(error);
        process.exit(0);
    }

    const dstTaskDir = path.join(process.cwd(), task_dir);
    if (!fs.existsSync(dstTaskDir)) {
        // create tasks dir
        fs.mkdirSync(dstTaskDir);
    }

    required_tasks.forEach((task) => {
        const src = path.join(__dirname, 'tasks', task);
        const dst = path.join(dstTaskDir, task);
        if (fs.existsSync(src)) {
            if (fs.existsSync(dst)) {
                fs.unlinkSync(dst);
            }
            fs.writeFileSync(dst, fs.readFileSync(src).toString());
        } else {
            console.error('task not found: ' + task);
            process.exit(1);
        }
    });
}

// [obsolete] call from this package. need admin if running on Windows, but symlink doesn't resolve __dirname.
function setupByLink() {
    console.warn("symlink doesn't resolve __dirname.");

    const srcTaskDir = path.join(__dirname, 'tasks');

    // detect target package
    const targets = [];
    const PACKAGES_DIR = path.join(__dirname, '..');
    fs.readdirSync(PACKAGES_DIR)
    .forEach((filePath) => {
        const absPath = path.join(PACKAGES_DIR, filePath);
        if (fs.statSync(absPath).isDirectory()) {
            if (/^cdp-/.test(filePath)) {
                // check project.config.js
                try {
                    const config = require(path.join(absPath, 'project.config'));
                    if (config.required_tasks) {
                        targets.push({
                            path: absPath,
                            required_tasks: config.required_tasks,
                            task_dir: config.dir.task,
                        });
                    }
                } catch (error) {
                    return; // next
                }
            }
        }
    });

    // link
    targets.forEach((target) => {
        const dstTaskDir = path.join(target.path, target.task_dir);
        if (!fs.existsSync(dstTaskDir)) {
            // create tasks dir
            fs.mkdirSync(dstTaskDir);
        }

        target.required_tasks.forEach((task) => {
            const src = path.join(srcTaskDir, task);
            const dst = path.join(dstTaskDir, task);
            if (!fs.existsSync(src)) {
                console.error('task not found: ' + task);
                process.exit(1);
            }
            if (fs.existsSync(dst)) {
                fs.unlinkSync(dst);
            }
            fs.symlinkSync(src, dst, 'file');
        });
    });
}

// make link.bat for setup hard link. (Windows only)
function makeLinkFile() {
    const srcTaskDir = path.join(__dirname, 'tasks');

    // detect target package
    const targets = [];
    const PACKAGES_DIR = path.join(__dirname, '..');
    fs.readdirSync(PACKAGES_DIR)
    .forEach((filePath) => {
        const absPath = path.join(PACKAGES_DIR, filePath);
        if (fs.statSync(absPath).isDirectory()) {
            if (!/^master-task/.test(filePath)) {
                // check project.config.js
                try {
                    const config = require(path.join(absPath, 'project.config'));
                    if (config.required_tasks) {
                        targets.push({
                            path: absPath,
                            required_tasks: config.required_tasks,
                            task_dir: config.dir.task,
                        });
                    }
                } catch (error) {
                    return; // next
                }
            }
        }
    });

    // link
    const link_bat = ['@echo off', '', ':: make hard link', ''];
    targets.forEach((target) => {
        const dstTaskDir = path.join(target.path, target.task_dir);
        if (!fs.existsSync(dstTaskDir)) {
            // create tasks dir
            fs.mkdirSync(dstTaskDir);
        }

        target.required_tasks.forEach((task) => {
            const src = path.join(srcTaskDir, task);
            const dst = path.join(dstTaskDir, task);
            if (!fs.existsSync(src)) {
                console.error('task not found: ' + task);
                process.exit(1);
            }
            if (fs.existsSync(dst)) {
                fs.unlinkSync(dst);
            }
            link_bat.push(`MKLINK /H "${dst}" "${src}"`);
        });
    });

    // write link.bat
    fs.writeFileSync('link.bat', link_bat.join('\r\n'));
}

function main() {
    const options = queryOptions();

    switch (options.mode) {
        case "copy":
            setupByCopy();
            break;
        case "link":
            setupByLink();
            break;
        case "make":
            makeLinkFile();
            break;
        default:
            break;
    }
}

main();
