var Config;
(function (Config) {
    var global = Function("return this")();
    //_____________________________________________________________________________________________//
    /**
     * build config
     */
    Config.DEBUG = (function () {
        return !!("%% build_setting %%");
    })();
    //_____________________________________________________________________________________________//
    /**
     * requirejs
     */
    global.requirejs = (function () {
        var _index = function (path) {
            return "../" + path;
        };
        var _module = function (name, file) {
            return _index("external/") + name + "/scripts/" + (file ? file : name);
        };
        var _lib = function (name) {
            return _index("lib/scripts/") + name;
        };
        var _porting = function (name) {
            return _index("porting/scripts/") + name;
        };
        var _assign_package = function (_config, _path, name, main) {
            if (Config.DEBUG) {
                _config.packages = _config.packages || [];
                _config.packages.push({
                    name: name,
                    location: _path(name),
                    main: main,
                });
            }
            else {
                _config.paths[name] = _path(name);
            }
        };
        var _baseUrl = (function () {
            var webRoot = /(.+\/)[^/]*#[^/]+/.exec(location.href);
            if (!webRoot) {
                webRoot = /(.+\/)/.exec(location.href);
            }
            return webRoot[1] + "scripts/";
        })();
        //////////////////////////////////////////////////////////////////////////
        /**
         * require.config
         */
        var config = {
            baseUrl: _baseUrl,
            urlArgs: "bust=" + Date.now(),
            // >>>EXTERNAL_MODULES>>> external module entry
            paths: {
                // external modules
                "jquery": _module("jquery"),
                "underscore": _module("underscore"),
                "backbone": _module("backbone"),
                "hogan": _module("hogan"),
                "hammerjs": _module("hammerjs", "hammer"),
                "jquery-hammerjs": _module("hammerjs", "jquery.hammer"),
                "highlight": _module("highlight"),
                // core frameworks
                "cdp": _module("cdp"),
                "cordova": _index("cordova"),
            },
            // <<<EXTERNAL_MODULES<<<
            shim: {},
            packages: [],
        };
        /* tslint:disable:no-unused-variable no-unused-vars */
        /* eslint-disable no-unused-vars */
        // internal library declaretion:
        var assign_lib = _assign_package.bind(null, config, _lib);
        var assign_porting = _assign_package.bind(null, config, _porting);
        // >>>LIB_DEPENDENCIES>>> package assign
        // <<<LIB_DEPENDENCIES<<<
        /* tslint:enable:no-unused-variable no-unused-vars */
        /* eslint-enable no-unused-vars */
        return config;
    })();
    //_____________________________________________________________________________________________//
    /**
     * jQuery settings
     */
    Config.jquery = {
        ajaxSetup: { cache: false },
    };
    /**
     * jQuery Mobile settings
     * http://api.jquerymobile.com/global-config/
     */
    Config.jquerymobile = {
        allowCrossDomainPages: true,
        defaultPageTransition: "none",
        hashListeningEnabled: false,
        pushStateEnabled: false,
    };
    //_____________________________________________________________________________________________//
    /**
     * localize resource settings
     */
    Config.i18n = {
        fallbackResources: {
            en: {
                messages: "/res/locales/messages.en-US.json",
            },
            ja: {
                messages: "/res/locales/messages.ja-JP.json",
            },
        },
        // available options
        // http://i18next.com/docs/options/#init-options
        options: {
            preload: [
                "en-US",
                "ja-JP",
            ],
            fallbackLng: "en-US",
            ns: "messages",
            defaultNS: "messages",
            backend: {
                loadPath: "res/locales/{{ns}}.{{lng}}.json",
            },
            detection: {
                order: ["cookie", "navigator"],
                caches: false,
            },
            cache: {
                enable: false,
            },
        },
    };
})(Config || (Config = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYXBwL3NjcmlwdHMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsTUFBTSxDQWlLZjtBQWpLRCxXQUFVLE1BQU07SUFFWixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztJQUV6QyxpR0FBaUc7SUFFakc7O09BRUc7SUFDVSxZQUFLLEdBQUcsQ0FBQztRQUNsQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRUwsaUdBQWlHO0lBRWpHOztPQUVHO0lBQ0gsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDO1FBQ2hCLElBQU0sTUFBTSxHQUFHLFVBQUMsSUFBWTtZQUN4QixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUN4QixDQUFDLENBQUM7UUFDRixJQUFNLE9BQU8sR0FBRyxVQUFDLElBQVksRUFBRSxJQUFhO1lBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxHQUFHLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUM7UUFDRixJQUFNLElBQUksR0FBRyxVQUFDLElBQVk7WUFDdEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDekMsQ0FBQyxDQUFDO1FBQ0YsSUFBTSxRQUFRLEdBQUcsVUFBQyxJQUFZO1lBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDN0MsQ0FBQyxDQUFDO1FBQ0YsSUFBTSxlQUFlLEdBQUcsVUFDcEIsT0FBd0MsRUFDeEMsS0FBK0IsRUFDL0IsSUFBWSxFQUFFLElBQWE7WUFDM0Is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O1lBQ2YsRUFBRSxFQUFFO2dCQUNBLFFBQVEsRUFBRSxrQ0FBa0M7YUFDL0M7WUFDRCxFQUFFLEVBQUU7Z0JBQ0EsUUFBUSxFQUFFLGtDQUFrQzthQUMvQztTQUNKO1FBQ0Qsb0JBQW9CO1FBQ3BCLGdEQUFnRDtRQUNoRCxPQUFPLEVBQUU7WUFDTCxPQUFPLEVBQUU7Z0JBQ0wsT0FBTztnQkFDUCxPQUFPO2FBQ1Y7WUFDRCxXQUFXLEVBQUUsT0FBTztZQUNwQixFQUFFLEVBQUUsVUFBVTtZQUNkLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLE9BQU8sRUFBRTtnQkFDTCxRQUFRLEVBQUUsaUNBQWlDO2FBQzlDO1lBQ0QsU0FBUyxFQUFFO2dCQUNQLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUM7Z0JBQzlCLE1BQU0sRUFBRSxLQUFLO2FBQ2hCO1lBQ0QsS0FBSyxFQUFFO2dCQUNILE1BQU0sRUFBRSxLQUFLO2FBQ2hCO1NBQ0o7S0FDSixDQUFDO0FBQ04sQ0FBQyxFQWpLUyxNQUFNLEtBQU4sTUFBTSxRQWlLZiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBDb25maWcge1xyXG5cclxuICAgIGNvbnN0IGdsb2JhbCA9IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBidWlsZCBjb25maWdcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IERFQlVHID0gKCgpOiBib29sZWFuID0+IHtcclxuICAgICAgICByZXR1cm4gISEoXCIlJSBidWlsZF9zZXR0aW5nICUlXCIpO1xyXG4gICAgfSkoKTtcclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiByZXF1aXJlanNcclxuICAgICAqL1xyXG4gICAgZ2xvYmFsLnJlcXVpcmVqcyA9ICgoKSA9PiB7XHJcbiAgICAgICAgY29uc3QgX2luZGV4ID0gKHBhdGg6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gXCIuLi9cIiArIHBhdGg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBfbW9kdWxlID0gKG5hbWU6IHN0cmluZywgZmlsZT86IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBfaW5kZXgoXCJleHRlcm5hbC9cIikgKyBuYW1lICsgXCIvc2NyaXB0cy9cIiArIChmaWxlID8gZmlsZSA6IG5hbWUpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgX2xpYiA9IChuYW1lOiBzdHJpbmcpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gX2luZGV4KFwibGliL3NjcmlwdHMvXCIpICsgbmFtZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IF9wb3J0aW5nID0gKG5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBfaW5kZXgoXCJwb3J0aW5nL3NjcmlwdHMvXCIpICsgbmFtZTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IF9hc3NpZ25fcGFja2FnZSA9IChcclxuICAgICAgICAgICAgX2NvbmZpZzogeyBwYXRoczoge307IHBhY2thZ2VzPzoge31bXTsgfSxcclxuICAgICAgICAgICAgX3BhdGg6IChuYW1lOiBzdHJpbmcpID0+IHN0cmluZyxcclxuICAgICAgICAgICAgbmFtZTogc3RyaW5nLCBtYWluPzogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChERUJVRykge1xyXG4gICAgICAgICAgICAgICAgX2NvbmZpZy5wYWNrYWdlcyA9IF9jb25maWcucGFja2FnZXMgfHwgW107XHJcbiAgICAgICAgICAgICAgICBfY29uZmlnLnBhY2thZ2VzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IF9wYXRoKG5hbWUpLFxyXG4gICAgICAgICAgICAgICAgICAgIG1haW46IG1haW4sXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIF9jb25maWcucGF0aHNbbmFtZV0gPSBfcGF0aChuYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IF9iYXNlVXJsID0gKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHdlYlJvb3QgPSAvKC4rXFwvKVteL10qI1teL10rLy5leGVjKGxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICBpZiAoIXdlYlJvb3QpIHtcclxuICAgICAgICAgICAgICAgIHdlYlJvb3QgPSAvKC4rXFwvKS8uZXhlYyhsb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gd2ViUm9vdFsxXSArIFwic2NyaXB0cy9cIjtcclxuICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZXF1aXJlLmNvbmZpZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgICAgICAgICAgYmFzZVVybDogX2Jhc2VVcmwsXHJcbiAgICAgICAgICAgIHVybEFyZ3M6IFwiYnVzdD1cIiArIERhdGUubm93KCksXHJcblxyXG4gICAgICAgICAgICAvLyA+Pj5FWFRFUk5BTF9NT0RVTEVTPj4+IGV4dGVybmFsIG1vZHVsZSBlbnRyeVxyXG4gICAgICAgICAgICBwYXRoczoge1xyXG4gICAgICAgICAgICAgICAgLy8gZXh0ZXJuYWwgbW9kdWxlc1xyXG4gICAgICAgICAgICAgICAgXCJqcXVlcnlcIjogX21vZHVsZShcImpxdWVyeVwiKSxcclxuICAgICAgICAgICAgICAgIFwidW5kZXJzY29yZVwiOiBfbW9kdWxlKFwidW5kZXJzY29yZVwiKSxcclxuICAgICAgICAgICAgICAgIFwiYmFja2JvbmVcIjogX21vZHVsZShcImJhY2tib25lXCIpLFxyXG4gICAgICAgICAgICAgICAgXCJob2dhblwiOiBfbW9kdWxlKFwiaG9nYW5cIiksXHJcbiAgICAgICAgICAgICAgICBcImhhbW1lcmpzXCI6IF9tb2R1bGUoXCJoYW1tZXJqc1wiLCBcImhhbW1lclwiKSxcclxuICAgICAgICAgICAgICAgIFwianF1ZXJ5LWhhbW1lcmpzXCI6IF9tb2R1bGUoXCJoYW1tZXJqc1wiLCBcImpxdWVyeS5oYW1tZXJcIiksXHJcbiAgICAgICAgICAgICAgICBcImhpZ2hsaWdodFwiOiBfbW9kdWxlKFwiaGlnaGxpZ2h0XCIpLFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvcmUgZnJhbWV3b3Jrc1xyXG4gICAgICAgICAgICAgICAgXCJjZHBcIjogX21vZHVsZShcImNkcFwiKSxcclxuICAgICAgICAgICAgICAgIFwiY29yZG92YVwiOiBfaW5kZXgoXCJjb3Jkb3ZhXCIpLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAvLyA8PDxFWFRFUk5BTF9NT0RVTEVTPDw8XHJcblxyXG4gICAgICAgICAgICBzaGltOiB7XHJcbiAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICBwYWNrYWdlczogW1xyXG4gICAgICAgICAgICAgICAgLy8gRE8gTk9UIHNldHVwIG1hbnVhbGx5LlxyXG4gICAgICAgICAgICAgICAgLy8gdXNlIGFzc2lnbl9saWIoKS9hc3NpbmdfcG9ydGluZygpXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLXZhcmlhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuICAgICAgICAvLyBpbnRlcm5hbCBsaWJyYXJ5IGRlY2xhcmV0aW9uOlxyXG4gICAgICAgIGNvbnN0IGFzc2lnbl9saWIgICAgICAgID0gX2Fzc2lnbl9wYWNrYWdlLmJpbmQobnVsbCwgY29uZmlnLCBfbGliKTtcclxuICAgICAgICBjb25zdCBhc3NpZ25fcG9ydGluZyAgICA9IF9hc3NpZ25fcGFja2FnZS5iaW5kKG51bGwsIGNvbmZpZywgX3BvcnRpbmcpO1xyXG5cclxuICAgICAgICAvLyA+Pj5MSUJfREVQRU5ERU5DSUVTPj4+IHBhY2thZ2UgYXNzaWduXHJcbiAgICAgICAgLy8gPDw8TElCX0RFUEVOREVOQ0lFUzw8PFxyXG5cclxuICAgICAgICAvKiB0c2xpbnQ6ZW5hYmxlOm5vLXVudXNlZC12YXJpYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbmZpZztcclxuICAgIH0pKCk7XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogalF1ZXJ5IHNldHRpbmdzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBqcXVlcnkgPSB7XHJcbiAgICAgICAgYWpheFNldHVwOiB7IGNhY2hlOiBmYWxzZSB9LFxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRdWVyeSBNb2JpbGUgc2V0dGluZ3NcclxuICAgICAqIGh0dHA6Ly9hcGkuanF1ZXJ5bW9iaWxlLmNvbS9nbG9iYWwtY29uZmlnL1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QganF1ZXJ5bW9iaWxlID0ge1xyXG4gICAgICAgIGFsbG93Q3Jvc3NEb21haW5QYWdlczogdHJ1ZSxcclxuICAgICAgICBkZWZhdWx0UGFnZVRyYW5zaXRpb246IFwibm9uZVwiLFxyXG4gICAgICAgIGhhc2hMaXN0ZW5pbmdFbmFibGVkOiBmYWxzZSxcclxuICAgICAgICBwdXNoU3RhdGVFbmFibGVkOiBmYWxzZSxcclxuICAgIH07XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogbG9jYWxpemUgcmVzb3VyY2Ugc2V0dGluZ3NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGkxOG46IENEUC5JMThOU2V0dGluZ3MgPSB7XHJcbiAgICAgICAgZmFsbGJhY2tSZXNvdXJjZXM6IHtcclxuICAgICAgICAgICAgZW46IHtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2VzOiBcIi9yZXMvbG9jYWxlcy9tZXNzYWdlcy5lbi1VUy5qc29uXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGphOiB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlczogXCIvcmVzL2xvY2FsZXMvbWVzc2FnZXMuamEtSlAuanNvblwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gYXZhaWxhYmxlIG9wdGlvbnNcclxuICAgICAgICAvLyBodHRwOi8vaTE4bmV4dC5jb20vZG9jcy9vcHRpb25zLyNpbml0LW9wdGlvbnNcclxuICAgICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgICAgIHByZWxvYWQ6IFtcclxuICAgICAgICAgICAgICAgIFwiZW4tVVNcIixcclxuICAgICAgICAgICAgICAgIFwiamEtSlBcIixcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgZmFsbGJhY2tMbmc6IFwiZW4tVVNcIixcclxuICAgICAgICAgICAgbnM6IFwibWVzc2FnZXNcIixcclxuICAgICAgICAgICAgZGVmYXVsdE5TOiBcIm1lc3NhZ2VzXCIsXHJcbiAgICAgICAgICAgIGJhY2tlbmQ6IHtcclxuICAgICAgICAgICAgICAgIGxvYWRQYXRoOiBcInJlcy9sb2NhbGVzL3t7bnN9fS57e2xuZ319Lmpzb25cIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGV0ZWN0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBvcmRlcjogW1wiY29va2llXCIsIFwibmF2aWdhdG9yXCJdLFxyXG4gICAgICAgICAgICAgICAgY2FjaGVzOiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2FjaGU6IHtcclxuICAgICAgICAgICAgICAgIGVuYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcbn1cclxuIl19