/*
 * grunt build config
 *
 */

module.exports = function (grunt) {

    grunt.extendConfig({
        // config variable entries: root
        orgsrc: 'src',
        tmpdir: 'temp',
        pkgdir: 'dist',

        // config variable entries: directory
        libraries:      'src',          // internal-lib modules default directory
        modules:        'external',     // 3rd module directory
        resources:      'res',          // resource directory
        templates:      'templates',    // html directory
        scripts:        'scripts',      // js/ts/(coffee) directory
        stylesheets:    'stylesheets',  // css/sass/(less) directory

        // config variable typedoc targets
        ci_doc_ts_targets: ['src/**/*.ts'],

        // ts build settings.
        ts_module: 'amd',
//        ts_module: 'commonjs',
//        ts_module: 'umd',
    });
};
