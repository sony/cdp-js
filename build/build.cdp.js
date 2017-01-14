/*
 * cpd-promise module tasks
 *
 */

module.exports = function (grunt) {

    var fs = require('fs');

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
                    {// d.ts
                        expand: true,
                        cwd: '<%= modules %>/include',
                        src: ['cdp*.d.ts', '!cdp.d.ts'],
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
                    comments: true,
                },
                files: [
                    {
//                        '<%= tmpdir %>/': [
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
                    preserveLicenseComments: true,
                    baseUrl: '<%= tmpdir %>',
                    name: 'cdp',
                    include: [
                        'cdp.core',
                        'cdp.promise',
                        'cdp.i18n',
                        'cdp.framework.jqm',
                        'cdp.tools',
                        'cdp.ui.listview',
                        'cdp.ui.jqm',
                    ],
                    paths: {
                        'jquery': 'empty:',
                        'underscore': 'empty:',
                        'backbone': 'empty:',
                    },
                    out: '<%= tmpdir %>/cdp.js',
                    optimize: 'none',
                    onBuildWrite: function (name, path, contents) {
                        if ('cdp' === name) {
                            var shim = fs.readFileSync('build/res/shim.define.tpl').toString();
                            contents = shim + contents;
                        }
                        return contents.replace('define([', 'define("' + name + '", [');
                    }
                },
            },
        },
        // webpack
        webpack: {
            deploy: {
                entry: {
                    index: './<%= tmpdir %>/cdp.js',
                },
                output: {
                    path: './<%= tmpdir %>',
                    filename: 'cdp.js',
                    library: 'CDP',
                    libraryTarget: 'umd',
                },
                externals: {
                    'jquery': true,
                    'backbone': true,
                    'underscore': true,
                },
                resolve: {
                    root: './<%= tmpdir %>',
                },
            },
        },
        // remove comment
        uglify: {
            comment: {
                options: {
                    preserveComments: false,
                    compress: false,
                    mangle: false,
                    beautify: true, // avoid issue #696 https://github.com/mishoo/UglifyJS2/issues/696
                },
                files: [
                    {
                        '<%= tmpdir %>/cdp.js': '<%= tmpdir %>/cdp.js',
                    },
                ],
            },
        },
        // typedoc
        typedoc: {
            options: {
                ignoreCompilerErrors: '<%= modules %>/include/',
            },
        },
    });

    //______________________________________________________________________________________________________________//

    grunt.loadNpmTasks('grunt-contrib-requirejs');
//    grunt.loadNpmTasks('grunt-webpack');

    //______________________________________________________________________________________________________________//

    grunt.registerTask('deploy', [
        '_pkg_proc_parse_cmdline',
        'copy:deploy_prepare',
        'ts:deploy',
        'requirejs:deploy',
//        'webpack:deploy',
        '_pkg_proc_inter_revise',
        'uglify:comment',
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
