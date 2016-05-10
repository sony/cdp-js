/*
 * cpd-promise module tasks
 *
 */

module.exports = function (grunt) {

    grunt.extendConfig({
        // override
        pkg_deploy_module_name: 'cdp',
        pkg_deploy_workdir_src: '<%= tmpdir %>',
        _pkg_proc_revise_cwd: '<%= tmpdir %>',
        _pkg_proc_versioning_src: '<%= tmpdir %>',
        _pkg_proc_versioning_dst: '<%= tmpdir %>',
        _pkg_proc_versioning_targets: ['cdp.js'],

        // copy
        copy: {
            // working copy
            deploy_prepare: {
                files: [
                    {// cdp modules
                        expand: true,
                        cwd: '<%= modules %>/cdp/<%= scripts %>',
                        src: ['*.js', '!*[0-9].[0-9].[0-9]*.js'],
                        dest: '<%= tmpdir %>',
                    },
                ],
            },
            // deploy.
            deploy: {
                files: [
                    {// js, map
                        expand: true,
                        cwd: '<%= tmpdir %>',
                        src: ['cdp.js', 'cdp-*.js', 'cdp-*.map'],
                        dest: '<%= pkgdir %>',
                    },
                    {// d.ts
                        expand: true,
                        cwd: '<%= tmpdir %>',
                        src: ['cdp.d.ts'],
                        dest: '<%= pkgdir %>/include',
                    },
                    {// for dev
                        expand: true,
                        cwd: '<%= tmpdir %>',
                        src: ['cdp.d.ts'],
                        dest: '<%= modules %>/include',
                    },
                ],
            },
        },
        // typescript
        ts: {
            deploy: {
                options: {
                    module: '<%= ts_module %>',
                    rootDir: '<%= orgsrc %>',
                    declaration: true,
                },
                files: [
                    {
                        '<%= tmpdir %>/cdp.js': [
                            '<%= modules %>/include/*.d.ts',
                            '<%= orgsrc %>/**/*.ts',
                        ],
                    },
                ],
            },
        },
        // rjs
        requirejs: {
            deploy: {
                options: {
                    baseUrl: '<%= tmpdir %>',
                    include: [
                        'cdp.core',
                        'cdp.promise',
                        'cdp.framework.jqm',
                        'cdp.tools',
                        'cdp.ui.listview',
                        'cdp.ui.jqm',
                        'cdp',
                    ],
                    paths: {
                        'jquery': 'empty:',
                        'jquery.mobile': 'empty:',
                        'underscore': 'empty:',
                        'backbone': 'empty:',
                        'i18next': 'empty:',
                        'i18nextXHRBackend': 'empty:',
                        'i18nextLocalStorageCache': 'empty:',
                        'i18nextSprintfPostProcessor': 'empty:',
                        'i18nextBrowserLanguageDetector': 'empty:',
                        'jqueryI18next': 'empty:',
                    },
                    out: '<%= tmpdir %>/cdp.js',
                    optimize: 'none',
                },
            },
        },
    });

    //______________________________________________________________________________________________________________//

    grunt.loadNpmTasks('grunt-contrib-requirejs');

    //______________________________________________________________________________________________________________//

    grunt.registerTask('deploy', [
        '_pkg_proc_parse_cmdline',
        'copy:deploy_prepare',
        'ts:deploy',
        'requirejs:deploy',
        '_pkg_proc_inter_revise',
        '_pkg_proc_versioning',
        'uglify:pkg_deploy',
        '_pkg_proc_final_revise',
        '_pkg_proc_add_bom',
        'copy:deploy',
        'clean:tmpdir',
    ]);

    grunt.registerTask('ci',        ['ci_doc', 'ci_tests']);
    grunt.registerTask('lint',      ['ci_tests_lint']);

    grunt.registerTask('doc',       ['ci_doc']);

    grunt.registerTask('build',     ['ci_tests_setup', 'ts:default']);
    grunt.registerTask('watch',     ['ts_set_watch', 'build']);

    grunt.registerTask('default',   ['deploy']);
};
