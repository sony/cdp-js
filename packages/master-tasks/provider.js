/* eslint-env node, es6 */
'use strict';
const fs    = require('fs');
const path  = require('path');

function queryOptions() {
    const argv = process.argv.slice(2);

    let settings = {
        link: false,
    };

    if (0 < argv.length) {
        Object.keys(settings).forEach((key) => {
            argv.forEach((arg) => {
                const option = arg.replace(/^--/, '');
                const name = option.split('=')[0];
                if (name === key) {
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
            fs.writeFileSync(dst, fs.readFileSync(src).toString(), 'utf8');
        } else {
            console.error('task not found: ' + task);
            process.exit(1);
        }
    });
}

// call from this package. need admin if running on Windows
function setupByLink() {
    const srcTaskDir = path.join(__dirname, 'tasks');

    // detect target package
    const targets = [];
    const PACKAGES_DIR = path.join(__dirname, '..');
    fs.readdirSync(PACKAGES_DIR)
    .forEach((filePath) => {
        const absPath = path.join(PACKAGES_DIR, filePath);
        if (fs.statSync(absPath).isDirectory()) {
            if (/^cdp-/.test(filePath)) {
                // chekc project.config.js
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

function main() {
    const options = queryOptions();

    if (options.link) {
        setupByLink();
    } else {
        setupByCopy();
    }
}

main();
