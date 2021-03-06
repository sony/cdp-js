(function (global) {
    // static configuration: requirejs
    require.config({
        baseUrl: '../../',
        paths: {
            'boot': '//cdnjs.cloudflare.com/ajax/libs/jasmine/2.4.1/boot',
            'testem': '../../../testem',
            'backbone': 'external/backbone/scripts/backbone',
            'jquery': 'external/jquery/scripts/jquery',
            'underscore': 'external/underscore/scripts/underscore',
            'hogan': 'external/hogan/scripts/hogan',
            'iscroll': 'external/iscroll/scripts/iscroll-probe',
            'cdp.lazyload': 'external/cdp/scripts/cdp.lazyload',
            'cdp.core': 'external/cdp/scripts/cdp.core',
            'cdp.promise': 'external/cdp/scripts/cdp.promise',
            'cdp.i18n': 'external/cdp/scripts/cdp.i18n',
            'cdp.framework.jqm': 'external/cdp/scripts/cdp.framework.jqm',
            'cdp.tools': 'external/cdp/scripts/cdp.tools',
            'cdp.ui.listview': 'external/cdp/scripts/cdp.ui.listview',
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
            require(['iscroll', 'hogan', 'testem', 'cdp.lazyload', 'cdp.framework.jqm'], function (_iscroll) {
                window.IScroll = _iscroll;
                setupTestem();
                CDP.Framework.initialize()
                .then(function () {
                    callback(onload);
                });
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
