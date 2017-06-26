(function (global) {
    // static configuration: requirejs
    require.config({
        baseUrl: '../../',
        paths: {
            'boot': '//cdnjs.cloudflare.com/ajax/libs/jasmine/2.4.1/boot',
            'testem': '../../../testem',
            'jquery': 'external/jquery/scripts/jquery',
            'jqueryI18next': 'external/i18next/scripts/jquery-i18next',
            'i18next': 'external/i18next/scripts/i18next',
            'i18nextXHRBackend': 'external/i18next/scripts/i18nextXHRBackend',
            'i18nextLocalStorageCache': 'external/i18next/scripts/i18nextLocalStorageCache',
            'i18nextSprintfPostProcessor': 'external/i18next/scripts/i18nextSprintfPostProcessor',
            'i18nextBrowserLanguageDetector': 'external/i18next/scripts/i18nextBrowserLanguageDetector',
            'cdp.core': 'external/cdp/scripts/cdp.core',
            'cdp.lazyload': 'external/cdp/scripts/cdp.lazyload',
            'cdp.promise': 'external/cdp/scripts/cdp.promise',
        },
    });

    setupTestem = function () {
        try {
            Testem.afterTests(
              function (config, data, callback) {
                  var coverage = JSON.stringify(window.__coverage__);
                  if (null != coverage) {
                      var xhr = new XMLHttpRequest();
                      xhr.onreadystatechange = function () {
                          if (xhr.readyState === 4) {
                              callback();
                          }
                      };
                      xhr.open('POST', '/coverage', true);
                      xhr.send(coverage);
                  } else {
                      callback();
                  }
              });
        } catch (error) {
            console.log(error);
        }
    },

    setupJasmine = function (callback) {
        require(['boot'], function () {
            require(['testem', 'cdp.lazyload'], function () {
                setupTestem();
                callback(onload);
            });
        });
    };

    // start
    setupJasmine(function (execute) {
        require(window.specFiles, function () {
            execute();
        });
    });
})(this);
