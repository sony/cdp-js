/* tslint:disable:max-line-length */

namespace Config {

    const global = Function("return this")();

    //_____________________________________________________________________________________________//

    // project.config.build_settings.string_replace エントリに従い文字列置換される

    /**
     * ビルド設定判定
     *
     * リリース版では '%% build_setting %%' を '' (空文字列) に置換することにより
     *   !!("") (== false)
     * の設定が反映される
     */
    export const DEBUG = ((): boolean => {
        return !!("%% build_setting %%");    //! リリース時には false が返る
    })();

    /**
     * 開発モードの例
     */
    export const DEV_FUNCTIONS_ENABLED = ((): boolean => {
        return !!("%% dev_functions_enabled %%");
    })();

    /**
     * 接続先サーバー切り替えの例
     */
    export const TARGET_SERVER = ((): string => {
        return "%% target_server %%";
    })();

    /**
     * 任意の置換
     */
    export const RUNTIME_CONTEXT = ((): string => {
        return "%% runtime_context %%";
    })();

    //_____________________________________________________________________________________________//

    /**
     * requirejs
     */
    global.requirejs = (() => {
        const _index = (path: string) => { return "../" + path; };
        const _module = (name: string, file?: string): string => { return _index("external/") + name + "/scripts/" + (file ? file : name); };
        const _lib = (name: string): string => { return _index("lib/scripts/") + name; };
        const _porting = (name: string): string => { return _index("porting/scripts/") + name; };
        const _assign_package = (
            _config: { paths: {}; packages?: {}[]; },
            _path: (name: string) => string,
            name: string, main?: string) => {
            if (DEBUG) {
                _config.packages = _config.packages || [];
                _config.packages.push({
                    name: name,
                    location: _path(name),
                    main: main,
                });
            } else {
                _config.paths[name] = _path(name);
            }
        };

        const _baseUrl = (() => {
            let webRoot = /(.+\/)[^/]*#[^/]+/.exec(location.href);
            if (!webRoot) {
                webRoot = /(.+\/)/.exec(location.href);
            }
            return webRoot[1] + "scripts/";
        })();

        //////////////////////////////////////////////////////////////////////////

        /**
         * require.config
         */
        const config = {
            baseUrl: _baseUrl,
//            urlArgs: "bust=" + Date.now(),

            // >>>EXTERNAL_MODULES>>> external module entry
            paths: {
                // external modules
                "jquery": _module("jquery"),
                "underscore": _module("underscore"),
                "backbone": _module("backbone"),
                "hogan": _module("hogan"),
                "flipsnap": _module("flipsnap"),
                "hammerjs": _module("hammerjs", "hammer"),
                "jquery-hammerjs": _module("hammerjs", "jquery.hammer"),
                "iscroll": _module("iscroll", "iscroll-probe"),

                // core frameworks
                "cdp": _module("cdp"),
                "cordova": _index("cordova"),
            },
            // <<<EXTERNAL_MODULES<<<

            shim: {
            },

            packages: [
                // DO NOT setup manually.
                // use assign_lib()/assing_porting()
            ],
        };

        /* tslint:disable:no-unused-variable no-unused-vars */
        /* eslint-disable no-unused-vars */
        // internal library declaretion:
        const assign_lib        = _assign_package.bind(null, config, _lib);
        const assign_porting    = _assign_package.bind(null, config, _porting);

        // >>>LIB_DEPENDENCIES>>> package assign
        assign_lib("cdp.device.console");
        assign_lib("cdp.ui.smoothscroll");
        assign_lib("cafeteria.image.data");
        // <<<LIB_DEPENDENCIES<<<

        /* tslint:enable:no-unused-variable no-unused-vars */
        /* eslint-enable no-unused-vars */

        return config;
    })();

    //_____________________________________________________________________________________________//

    /**
     * jQuery settings
     */
    export const jquery = {
        ajaxSetup: { cache: false },
    };

    /**
     * jQuery Mobile settings
     * http://api.jquerymobile.com/global-config/
     */
    export const jquerymobile = {
        allowCrossDomainPages: true,
        defaultPageTransition: "platform-default",
        hashListeningEnabled: false,
        pushStateEnabled: false,
    };

    //_____________________________________________________________________________________________//

    /**
     * localize resource settings
     */
    export const i18n: CDP.I18NSettings = {
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
}
