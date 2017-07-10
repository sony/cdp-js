(function (global) {
    // static configuration: CDP
    var CDP_config = {
        jquery: {
        },
        jquerymobile: {
        },
        i18n: {
        },
    };
    global.Config = global.Config || {};
    Config.jquery        = CDP_config.jquery;
    Config.jquerymobile  = CDP_config.jquerymobile;
    Config.i18n          = CDP_config.i18n;

    var merge = function (staticCofig, dynamicConfig) {
        for (entry in dynamicConfig.paths) {
            staticCofig.paths[entry] = dynamicConfig.paths[entry];
        }
        staticCofig.packages = dynamicConfig.packages;
        return staticCofig;
    };

    // static configuration: requirejs
    require.config(merge({
        baseUrl: '../../',
        paths: {
            'boot': '//cdnjs.cloudflare.com/ajax/libs/jasmine/2.4.1/boot',
            'testem': '../../../testem',
        },
    }, Config.requirejs));

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
            require(['cdp', 'testem'], function (CDP) {
                setupTestem();
                CDP.initialize()
                .done(function () {
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
