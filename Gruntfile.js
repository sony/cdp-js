/*
 * CDP grunt build script root.
 */
module.exports = function (grunt) {

    // load cdp tasks.
    grunt.loadNpmTasks('grunt-cdp-tasks');

    // Project configuration.
    var config = grunt.extendConfig({
        pkg: grunt.file.readJSON('package.json'),
    });

    // load project build task(s)
    grunt.loadTasks('build');

    // initialize config
    grunt.initConfig(config);
};
