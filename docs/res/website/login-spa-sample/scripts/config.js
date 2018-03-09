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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYXBwL3NjcmlwdHMvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQVUsTUFBTSxDQThKZjtBQTlKRCxXQUFVLE1BQU07SUFFWixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztJQUV6QyxpR0FBaUc7SUFFakc7O09BRUc7SUFDVSxZQUFLLEdBQUcsQ0FBQztRQUNsQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUNyQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRUwsaUdBQWlHO0lBRWpHOztPQUVHO0lBQ0gsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDO1FBQ2hCLElBQU0sTUFBTSxHQUFHLFVBQUMsSUFBWTtZQUN4QixNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUN4QixDQUFDLENBQUM7UUFDRixJQUFNLE9BQU8sR0FBRyxVQUFDLElBQVksRUFBRSxJQUFhO1lBQ3hDLE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsSUFBSSxHQUFHLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzRSxDQUFDLENBQUM7UUFDRixJQUFNLElBQUksR0FBRyxVQUFDLElBQVk7WUFDdEIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDekMsQ0FBQyxDQUFDO1FBQ0YsSUFBTSxRQUFRLEdBQUcsVUFBQyxJQUFZO1lBQzFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDN0MsQ0FBQyxDQUFDO1FBQ0YsSUFBTSxlQUFlLEdBQUcsVUFDcEIsT0FBd0MsRUFDeEMsS0FBK0IsRUFDL0IsSUFBWSxFQUFFLElBQWE7WUFDM0Is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RTtZQUNMLE9BQU8sRUFBRTtnQkFDTCxPQUFPO2dCQUNQLE9BQU87YUFDVjtZQUNELFdBQVcsRUFBRSxPQUFPO1lBQ3BCLEVBQUUsRUFBRSxVQUFVO1lBQ2QsU0FBUyxFQUFFLFVBQVU7WUFDckIsT0FBTyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxpQ0FBaUM7YUFDOUM7WUFDRCxTQUFTLEVBQUU7Z0JBQ1AsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQztnQkFDOUIsTUFBTSxFQUFFLEtBQUs7YUFDaEI7WUFDRCxLQUFLLEVBQUU7Z0JBQ0gsTUFBTSxFQUFFLEtBQUs7YUFDaEI7U0FDSjtLQUNKLENBQUM7QUFDTixDQUFDLEVBOUpTLE1BQU0sS0FBTixNQUFNLFFBOEpmIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIENvbmZpZyB7XHJcblxyXG4gICAgY29uc3QgZ2xvYmFsID0gRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIGJ1aWxkIGNvbmZpZ1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgREVCVUcgPSAoKCk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgIHJldHVybiAhIShcIiUlIGJ1aWxkX3NldHRpbmcgJSVcIik7XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlcXVpcmVqc1xyXG4gICAgICovXHJcbiAgICBnbG9iYWwucmVxdWlyZWpzID0gKCgpID0+IHtcclxuICAgICAgICBjb25zdCBfaW5kZXggPSAocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIi4uL1wiICsgcGF0aDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGNvbnN0IF9tb2R1bGUgPSAobmFtZTogc3RyaW5nLCBmaWxlPzogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIF9pbmRleChcImV4dGVybmFsL1wiKSArIG5hbWUgKyBcIi9zY3JpcHRzL1wiICsgKGZpbGUgPyBmaWxlIDogbmFtZSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCBfbGliID0gKG5hbWU6IHN0cmluZyk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBfaW5kZXgoXCJsaWIvc2NyaXB0cy9cIikgKyBuYW1lO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgX3BvcnRpbmcgPSAobmFtZTogc3RyaW5nKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIF9pbmRleChcInBvcnRpbmcvc2NyaXB0cy9cIikgKyBuYW1lO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgX2Fzc2lnbl9wYWNrYWdlID0gKFxyXG4gICAgICAgICAgICBfY29uZmlnOiB7IHBhdGhzOiB7fTsgcGFja2FnZXM/OiB7fVtdOyB9LFxyXG4gICAgICAgICAgICBfcGF0aDogKG5hbWU6IHN0cmluZykgPT4gc3RyaW5nLFxyXG4gICAgICAgICAgICBuYW1lOiBzdHJpbmcsIG1haW4/OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICAgICAgICBfY29uZmlnLnBhY2thZ2VzID0gX2NvbmZpZy5wYWNrYWdlcyB8fCBbXTtcclxuICAgICAgICAgICAgICAgIF9jb25maWcucGFja2FnZXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjogX3BhdGgobmFtZSksXHJcbiAgICAgICAgICAgICAgICAgICAgbWFpbjogbWFpbixcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgX2NvbmZpZy5wYXRoc1tuYW1lXSA9IF9wYXRoKG5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2Jhc2VVcmwgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgd2ViUm9vdCA9IC8oLitcXC8pW14vXSojW14vXSsvLmV4ZWMobG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgICAgIGlmICghd2ViUm9vdCkge1xyXG4gICAgICAgICAgICAgICAgd2ViUm9vdCA9IC8oLitcXC8pLy5leGVjKGxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB3ZWJSb290WzFdICsgXCJzY3JpcHRzL1wiO1xyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlcXVpcmUuY29uZmlnXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgY29uZmlnID0ge1xyXG4gICAgICAgICAgICBiYXNlVXJsOiBfYmFzZVVybCxcclxuICAgICAgICAgICAgdXJsQXJnczogXCJidXN0PVwiICsgRGF0ZS5ub3coKSxcclxuXHJcbiAgICAgICAgICAgIC8vID4+PkVYVEVSTkFMX01PRFVMRVM+Pj4gZXh0ZXJuYWwgbW9kdWxlIGVudHJ5XHJcbiAgICAgICAgICAgIHBhdGhzOiB7XHJcbiAgICAgICAgICAgICAgICAvLyBleHRlcm5hbCBtb2R1bGVzXHJcbiAgICAgICAgICAgICAgICBcImpxdWVyeVwiOiBfbW9kdWxlKFwianF1ZXJ5XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJ1bmRlcnNjb3JlXCI6IF9tb2R1bGUoXCJ1bmRlcnNjb3JlXCIpLFxyXG4gICAgICAgICAgICAgICAgXCJiYWNrYm9uZVwiOiBfbW9kdWxlKFwiYmFja2JvbmVcIiksXHJcbiAgICAgICAgICAgICAgICBcImhvZ2FuXCI6IF9tb2R1bGUoXCJob2dhblwiKSxcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjb3JlIGZyYW1ld29ya3NcclxuICAgICAgICAgICAgICAgIFwiY2RwXCI6IF9tb2R1bGUoXCJjZHBcIiksXHJcbiAgICAgICAgICAgICAgICBcImNvcmRvdmFcIjogX2luZGV4KFwiY29yZG92YVwiKSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gPDw8RVhURVJOQUxfTU9EVUxFUzw8PFxyXG5cclxuICAgICAgICAgICAgc2hpbToge1xyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgcGFja2FnZXM6IFtcclxuICAgICAgICAgICAgICAgIC8vIERPIE5PVCBzZXR1cCBtYW51YWxseS5cclxuICAgICAgICAgICAgICAgIC8vIHVzZSBhc3NpZ25fbGliKCkvYXNzaW5nX3BvcnRpbmcoKVxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbiAgICAgICAgLy8gaW50ZXJuYWwgbGlicmFyeSBkZWNsYXJldGlvbjpcclxuICAgICAgICBjb25zdCBhc3NpZ25fbGliICAgICAgICA9IF9hc3NpZ25fcGFja2FnZS5iaW5kKG51bGwsIGNvbmZpZywgX2xpYik7XHJcbiAgICAgICAgY29uc3QgYXNzaWduX3BvcnRpbmcgICAgPSBfYXNzaWduX3BhY2thZ2UuYmluZChudWxsLCBjb25maWcsIF9wb3J0aW5nKTtcclxuXHJcbiAgICAgICAgLy8gPj4+TElCX0RFUEVOREVOQ0lFUz4+PiBwYWNrYWdlIGFzc2lnblxyXG4gICAgICAgIC8vIDw8PExJQl9ERVBFTkRFTkNJRVM8PDxcclxuXHJcbiAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby11bnVzZWQtdmFyaWFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXHJcblxyXG4gICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRdWVyeSBzZXR0aW5nc1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QganF1ZXJ5ID0ge1xyXG4gICAgICAgIGFqYXhTZXR1cDogeyBjYWNoZTogZmFsc2UgfSxcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBqUXVlcnkgTW9iaWxlIHNldHRpbmdzXHJcbiAgICAgKiBodHRwOi8vYXBpLmpxdWVyeW1vYmlsZS5jb20vZ2xvYmFsLWNvbmZpZy9cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGpxdWVyeW1vYmlsZSA9IHtcclxuICAgICAgICBhbGxvd0Nyb3NzRG9tYWluUGFnZXM6IHRydWUsXHJcbiAgICAgICAgZGVmYXVsdFBhZ2VUcmFuc2l0aW9uOiBcIm5vbmVcIixcclxuICAgICAgICBoYXNoTGlzdGVuaW5nRW5hYmxlZDogZmFsc2UsXHJcbiAgICAgICAgcHVzaFN0YXRlRW5hYmxlZDogZmFsc2UsXHJcbiAgICB9O1xyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIGxvY2FsaXplIHJlc291cmNlIHNldHRpbmdzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBpMThuOiBDRFAuSTE4TlNldHRpbmdzID0ge1xyXG4gICAgICAgIGZhbGxiYWNrUmVzb3VyY2VzOiB7XHJcbiAgICAgICAgICAgIGVuOiB7XHJcbiAgICAgICAgICAgICAgICBtZXNzYWdlczogXCIvcmVzL2xvY2FsZXMvbWVzc2FnZXMuZW4tVVMuanNvblwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBqYToge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZXM6IFwiL3Jlcy9sb2NhbGVzL21lc3NhZ2VzLmphLUpQLmpzb25cIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIGF2YWlsYWJsZSBvcHRpb25zXHJcbiAgICAgICAgLy8gaHR0cDovL2kxOG5leHQuY29tL2RvY3Mvb3B0aW9ucy8jaW5pdC1vcHRpb25zXHJcbiAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICBwcmVsb2FkOiBbXHJcbiAgICAgICAgICAgICAgICBcImVuLVVTXCIsXHJcbiAgICAgICAgICAgICAgICBcImphLUpQXCIsXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIGZhbGxiYWNrTG5nOiBcImVuLVVTXCIsXHJcbiAgICAgICAgICAgIG5zOiBcIm1lc3NhZ2VzXCIsXHJcbiAgICAgICAgICAgIGRlZmF1bHROUzogXCJtZXNzYWdlc1wiLFxyXG4gICAgICAgICAgICBiYWNrZW5kOiB7XHJcbiAgICAgICAgICAgICAgICBsb2FkUGF0aDogXCJyZXMvbG9jYWxlcy97e25zfX0ue3tsbmd9fS5qc29uXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRldGVjdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgb3JkZXI6IFtcImNvb2tpZVwiLCBcIm5hdmlnYXRvclwiXSxcclxuICAgICAgICAgICAgICAgIGNhY2hlczogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNhY2hlOiB7XHJcbiAgICAgICAgICAgICAgICBlbmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG59XHJcbiJdfQ==