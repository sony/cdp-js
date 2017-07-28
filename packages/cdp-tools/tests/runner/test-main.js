(function (global) {
    // static configuration: requirejs
    require.config({
        baseUrl: '../../',
        paths: {
            'boot': '//cdnjs.cloudflare.com/ajax/libs/jasmine/2.4.1/boot',
            'testem': '../../../testem',
            'jquery': 'external/jquery/scripts/jquery',
            'hogan': 'external/hogan/scripts/hogan',
            'cdp.lazyload': 'external/cdp/scripts/cdp.lazyload',
            'cdp.core': 'external/cdp/scripts/cdp.core',
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
            require(['testem', 'cdp.lazyload', 'hogan'], function () {
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
