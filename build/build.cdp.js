/*
 * cpd-promise module tasks
 *
 */

module.exports = function (grunt) {

    var fs = require('fs');
    var path = require('path');
    var _ = grunt.libs._;
    var sourceNodes = [];

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
                    {// css
                        expand: true,
                        cwd: '<%= modules %>/cdp/<%= stylesheets %>',
                        src: ['*.css'],
                        dest: '<%= pkgdir %>',
                        rename: function (dest, src) {
                            var version_suffix_regex = /([0-9]+\.[0-9]+\.[A-Za-z0-9_\-]+)/;
                            return dest + '/' + src
                                .replace('cdp.ui.jqm', 'cdp')
                                .replace(version_suffix_regex, grunt.config.get("pkg").version);
                        }
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
        // clean
        clean: {
            deploy: {
                files: [
                    {// work files.
                        expand: true,
                        cwd: '<%= tmpdir %>',
                        src: ['**/*-all.js', '**/*.map'],
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
                    /*
                    include: [
                        'cdp.core',
                        'cdp.promise',
                        'cdp.i18n',
                        'cdp.framework.jqm',
                        'cdp.tools',
                        'cdp.ui.listview',
                        'cdp.ui.jqm',
                        :
                    ],
                    */
                    include: (function () {
                        var pkg = path.join(process.cwd(), 'package.json');
                        var targets = require(pkg).includeLibraries.slice();
                        var modules = [];
                        targets.forEach(function (target) {
                            modules.push(target.replace(/-/g, '.'));
                        });
                        return modules;
                    })(),
                    paths: {
                        'jquery': 'empty:',
                        'underscore': 'empty:',
                        'backbone': 'empty:',
                    },
                    out: '<%= tmpdir %>/cdp-all.js',
                    optimize: 'none',
                    onBuildWrite: function (name, path, contents) {
                        return setSourceNode(name, path, contents);
                    }
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

    //______________________________________________________________________________________________________________//

    // set SouceNode onBuildWrite()
    function setSourceNode(name, path, code) {
        // ensure module name
        code = code.replace('define([', 'define("' + name + '", [');

        // create sourceNode from code.
        var node = grunt.cdp.getSourceNodeFromCode(code);

        // add shim chunk if special case.
        if ('cdp' === name) {
            var shim = fs.readFileSync('build/res/shim.define.tpl')
                .toString()
                .replace(/\r\n/gm, '\n')
                .replace(/\ufeff/gm, '')
            ;
            node.prepend(shim + '\n');
        }

        // cache node
        sourceNodes.push(node);

        return node.toString();
    }

    // generate bunner node
    function generateBannerNode() {
        var dependencies = (function () {
            var targets = grunt.config.get('pkg').includeLibraries.slice();

            var modules = [];
            targets.forEach(function (target) {
                var json = grunt.file.readJSON(path.join(process.cwd(), 'node_modules', target, 'package.json'));
                modules.push({
                    name: json.name.replace(/-/g, '.') + '.js',
                    version: json.version,
                });
            });

            var include = grunt.file.read(path.join(process.cwd(), 'BANNER-INCLUDES')).toString();
            return _.template(include)({ modules: modules });
        })();

        var banner = '\ufeff' + grunt.cdp.getBannerString(
                grunt.config.get('pkg').name.replace(/-/g, '.'),
                grunt.config.get('pkg').version
            )
            .replace(' */', dependencies)
            .replace(/\ufeff/gm, '')
        ;
        return grunt.cdp.getSourceNodeFromCode(banner);
    }

    //______________________________________________________________________________________________________________//

    // build from source node
    grunt.registerTask('build_srcnode', 'build from source node', function () {
        var output = path.join(grunt.config.get('tmpdir'), grunt.config.get('pkg').name.replace(/-/g, '.'));

        var node = generateBannerNode();
        sourceNodes.forEach(function (srcnode) {
            node.add(srcnode);
        });

        var script = grunt.cdp.getScriptFromSourceNode(node, function (source) {
            return source
                .replace('../src/', 'cdp:///exports:/')
                .replace('webpack:/webpack', 'webpack:///webpack')
                .replace('webpack:/external', 'webpack:///external')
            ;
        });
        fs.writeFileSync(output, script, 'utf8');

        // disable automatic banner setup
        grunt.cdp.setUntergetExtVersioningBanner('.js');
    });

    grunt.registerTask('deploy', [
        'clean:dstdir',
        'clean:pkg_deploy',
        '_pkg_proc_parse_cmdline',
        'copy:deploy_prepare',
        'ts:deploy',
        'requirejs:deploy',
        'build_srcnode',
        'clean:deploy',
        '_pkg_proc_inter_revise',
//        'uglify:comment',
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
