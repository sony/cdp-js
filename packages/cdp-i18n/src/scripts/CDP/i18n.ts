/// <reference path="../@types/i18next.d.ts" />
/* tslint:disable:max-line-length */
namespace CDP {

    import Promise = CDP.Promise;
    import I18next = i18next.i18n;

    export namespace I18N {
        export type I18n = I18next.I18n;
        export type Options = I18next.Options;
        export type TranslationOptions = I18next.TranslationOptions;
        export type TranslationFunction = I18next.TranslationFunction;
        export type InterpolationOptions = I18next.InterpolationOptions;
    }

    const TAG = "[CDP.i18n] ";

    /**
     * i18next へのダイレクトアクセス
     */
    export let i18n: I18N.I18n;

    /**
     * @interface I18NSettings
     * @brief ローカライズ設定用オプション
     */
    export interface I18NSettings {
        fallbackResources?: { [lng: string]: { [ns: string]: string } };
        preload?: string[];
        options?: I18N.Options;
     }

    /**
     * \~english
     * initialize i18next.
     *
     * \~japanese
     * i18next の初期化
     *
     * @private
     * @returns IPromiseBase オブジェクト
     */
    export function initializeI18N(settings?: I18NSettings): IPromiseBase<any> {
        return new Promise((resolve) => {
            const i18nSettings: I18NSettings = settings || {};

            const i18nOptions: I18N.Options = ((resources: { [lng: string]: { [ns: string]: string } }) => {
                if (resources) {
                    for (const lng in resources) {
                        if (resources.hasOwnProperty(lng)) {
                            for (const ns in resources[lng]) {
                                if (resources[lng].hasOwnProperty(ns)) {
                                    resources[lng][ns] = getLocaleFallbackResource(resources[lng][ns]);
                                }
                            }
                        }
                    }
                    i18nSettings.options.resources = <any>resources;
                    return i18nSettings.options;
                } else {
                    return i18nSettings.options;
                }
            })(i18nSettings.fallbackResources);

            require(["jqueryI18next"], ($18Next: any) => {
                require([
                    "i18next",
                    "i18nextXHRBackend",
                    "i18nextLocalStorageCache",
                    "i18nextSprintfPostProcessor",
                    "i18nextBrowserLanguageDetector",
                ], (i18next: I18N.I18n
                    , Backend: any
                    , Cache: any
                    , PostProcessor: any
                    , LanguageDetector: any
                ) => {
                        i18next
                            .use(Backend)
                            .use(Cache)
                            .use(PostProcessor)
                            .use(LanguageDetector)
                            .init(i18nOptions, (error: any, t: I18N.TranslationFunction) => {
                                $18Next.init(i18next, $, {
                                    tName: "t",                         // --> appends $.t = i18next.t
                                    i18nName: "i18n",                   // --> appends $.i18n = i18next
                                    handleName: "localize",             // --> appends $(selector).localize(opts);
                                    selectorAttr: "data-i18n",          // selector for translating elements
                                    targetAttr: "i18n-target",          // data-() attribute to grab target element to translate (if diffrent then itself)
                                    optionsAttr: "i18n-options",        // data-() attribute that contains options, will load/set if useOptionsAttr = true
                                    useOptionsAttr: false,              // no use optionsAttr
                                    parseDefaultValueFromContent: true  // parses default values from content ele.val or ele.text
                                });
                                // i18next 3.4.1: resources が指定されると preload が読み込まれないため、再読み込み処理を行う.
                                if (i18next.options.resources && i18next.options.preload) {
                                    // options からプロパティを一旦削除.
                                    const _preload   = i18next.options.preload;
                                    const _resources = i18next.options.resources;
                                    delete i18next.options.resources;
                                    delete i18next.options.preload;
                                    i18next.loadLanguages(_preload, function () {
                                        // options を元に戻す
                                        i18next.options.resources = _resources;
                                        i18next.options.preload = _preload;
                                        CDP.i18n = i18next;
                                        resolve();
                                    });
                                } else {
                                    CDP.i18n = i18next;
                                    resolve();
                                }
                            });
                    });
            });
        });
    }

    /**
     * \~english
     * get string resource for fallback.
     *
     * \~japanese
     * Fallback 用ローカライズリソースの取得
     *
     * @private
     * @returns falbakc リソースオブジェクト
     */
    function getLocaleFallbackResource(path: string): any {
        let json: JSON;
        $.ajax({
            url: toUrl(path),
            method: "GET",
            async: false,
            dataType: "json",
            success: (data: JSON) => {
                json = data;
            },
            error: (xhr: JQueryXHR, status: string) => {
                console.error(TAG + "ajax request failed. status: " + status);
            }
        });
        return json;
    }

    /**
     * \~english
     * Convert path to URL.
     *
     * @param path [in] path string
     *
     * \~japanese
     * path を URL に変換
     *
     * @param path [in] パスを指定。
     */
    function toUrl(path: string): string {
        if (!path && "/" !== path[0]) {
            console.error(TAG + "invalid path. path: " + path);
        } else {
            return CDP.webRoot + path.slice(1);
        }
    }
}

///////////////////////////////////////////////////////////////////////
// jquery-i18next extensions

interface JQueryStatic {
    i18n: CDP.I18N.I18n;
    t: (key: string, options?: CDP.I18N.Options) => string;
}

interface JQuery {
    localize: (options?: CDP.I18N.TranslationOptions) => JQuery;
}

///////////////////////////////////////////////////////////////////////
// cdp.i18n declaration

declare module "cdp.i18n" {
    export = CDP;
}
