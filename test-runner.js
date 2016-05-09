command('jshint Gruntfile.js build/tasks src/scripts -c tests/jshint/jshintrc.json', true);
command('testem -f tests/jasmine/testem.json', false);

function command(commandString, shouldEnd) {
    var commandArguments = commandString.trim().split(' ');
    var cmd = commandArguments.shift() + ((process.platform === 'win32') ? '.cmd' : '');
    var child = require('child_process').spawn(cmd, commandArguments);
    child.stdout.pipe(process.stdout, { end: shouldEnd });
    child.stderr.pipe(process.stderr, { end: shouldEnd });
    process.stdin.pipe(child.stdin);
}
