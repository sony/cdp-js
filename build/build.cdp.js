/*
 * cpd-promise module tasks
 *
 */

module.exports = function (grunt) {

    grunt.extendConfig({
        // noop.
    });

    //__________________________________________________________________________________________________________________________________________________________________________________________//

    grunt.registerTask('deploy',    ['pkg_deploy']);

    grunt.registerTask('ci',        ['ci_doc', 'ci_tests']);
    grunt.registerTask('lint',      ['ci_tests_lint']);

    grunt.registerTask('doc',       ['ci_doc']);

    grunt.registerTask('build',     ['ci_tests_setup', 'ts:build']);
    grunt.registerTask('watch',     ['ts_set_watch', 'build']);

    grunt.registerTask('default',   ['deploy']);
};
