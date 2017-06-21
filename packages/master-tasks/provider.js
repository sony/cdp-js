/* eslint-env node, es6 */
'use strict';
const fs    = require('fs');
const path  = require('path');

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
        // overwrite
        fs.writeFileSync(dst, fs.readFileSync(src).toString(), 'utf8');
    } else {
        console.error('task not found: ' + task);
        process.exit(1);
    }
});
