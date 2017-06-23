(function (root, factory) { if (typeof define === "function" && define.amd) { define(["jquery", "cdp.core", "cdp.promise"], function ($, CDP) { return factory($, CDP); }); } else { factory(root.jQuery || root.$, root.CDP || (root.CDP = {})); } }(this, function ($, CDP) {

/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var Promise = CDP.Promise;
    var TAG = "[CDP.i18n] ";
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
    function initializeI18N(settings) {
        return new Promise(function (resolve) {
            var i18nSettings = settings || {};
            var i18nOptions = (function (resources) {
                if (resources) {
                    for (var lng in resources) {
                        if (resources.hasOwnProperty(lng)) {
                            for (var ns in resources[lng]) {
                                if (resources[lng].hasOwnProperty(ns)) {
                                    resources[lng][ns] = getLocaleFallbackResource(resources[lng][ns]);
                                }
                            }
                        }
                    }
                    i18nSettings.options.resources = resources;
                    return i18nSettings.options;
                }
                else {
                    return i18nSettings.options;
                }
            })(i18nSettings.fallbackResources);
            require(["jqueryI18next"], function ($18Next) {
                require([
                    "i18next",
                    "i18nextXHRBackend",
                    "i18nextLocalStorageCache",
                    "i18nextSprintfPostProcessor",
                    "i18nextBrowserLanguageDetector",
                ], function (i18next, Backend, Cache, PostProcessor, LanguageDetector) {
                    i18next
                        .use(Backend)
                        .use(Cache)
                        .use(PostProcessor)
                        .use(LanguageDetector)
                        .init(i18nOptions, function (error, t) {
                        $18Next.init(i18next, $, {
                            tName: "t",
                            i18nName: "i18n",
                            handleName: "localize",
                            selectorAttr: "data-i18n",
                            targetAttr: "i18n-target",
                            optionsAttr: "i18n-options",
                            useOptionsAttr: false,
                            parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
                        });
                        // i18next 3.4.1: resources が指定されると preload が読み込まれないため、再読み込み処理を行う.
                        if (i18next.options.resources && i18next.options.preload) {
                            // options からプロパティを一旦削除.
                            var _preload_1 = i18next.options.preload;
                            var _resources_1 = i18next.options.resources;
                            delete i18next.options.resources;
                            delete i18next.options.preload;
                            i18next.loadLanguages(_preload_1, function () {
                                // options を元に戻す
                                i18next.options.resources = _resources_1;
                                i18next.options.preload = _preload_1;
                                CDP.i18n = i18next;
                                resolve();
                            });
                        }
                        else {
                            CDP.i18n = i18next;
                            resolve();
                        }
                    });
                });
            });
        });
    }
    CDP.initializeI18N = initializeI18N;
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
    function getLocaleFallbackResource(path) {
        var json;
        $.ajax({
            url: toUrl(path),
            method: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                json = data;
            },
            error: function (xhr, status) {
                console.log(TAG + "ajax request failed. status: " + status);
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
    function toUrl(path) {
        if (!path && "/" !== path[0]) {
            console.error(TAG + "invalid path. path: " + path);
        }
        else {
            return CDP.webRoot + path.slice(1);
        }
    }
})(CDP || (CDP = {}));

return CDP; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LEdBQUcsR0FBRywrQkFBK0IsR0FBRyxNQUFNLENBQUMsQ0FBQztZQUNoRSxDQUFDO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNILGVBQWUsSUFBWTtRQUN2QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUN2RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQyxFQWhLUyxHQUFHLEtBQUgsR0FBRyxRQWdLWiIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9AdHlwZXMvaTE4bmV4dC5kLnRzXCIgLz5cclxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcbm5hbWVzcGFjZSBDRFAge1xyXG5cclxuICAgIGltcG9ydCBQcm9taXNlID0gQ0RQLlByb21pc2U7XHJcbiAgICBpbXBvcnQgSTE4bmV4dCA9IGkxOG5leHQuaTE4bjtcclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIEkxOE4ge1xyXG4gICAgICAgIGV4cG9ydCB0eXBlIEkxOG4gPSBJMThuZXh0LkkxOG47XHJcbiAgICAgICAgZXhwb3J0IHR5cGUgT3B0aW9ucyA9IEkxOG5leHQuT3B0aW9ucztcclxuICAgICAgICBleHBvcnQgdHlwZSBUcmFuc2xhdGlvbk9wdGlvbnMgPSBJMThuZXh0LlRyYW5zbGF0aW9uT3B0aW9ucztcclxuICAgICAgICBleHBvcnQgdHlwZSBUcmFuc2xhdGlvbkZ1bmN0aW9uID0gSTE4bmV4dC5UcmFuc2xhdGlvbkZ1bmN0aW9uO1xyXG4gICAgICAgIGV4cG9ydCB0eXBlIEludGVycG9sYXRpb25PcHRpb25zID0gSTE4bmV4dC5JbnRlcnBvbGF0aW9uT3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBUQUc6IHN0cmluZyA9IFwiW0NEUC5pMThuXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIGkxOG5leHQg44G444Gu44OA44Kk44Os44Kv44OI44Ki44Kv44K744K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgaTE4bjogSTE4Ti5JMThuO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJMThOU2V0dGluZ3NcclxuICAgICAqIEBicmllZiDjg63jg7zjgqvjg6njgqTjgrroqK3lrprnlKjjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJMThOU2V0dGluZ3Mge1xyXG4gICAgICAgIGZhbGxiYWNrUmVzb3VyY2VzPzogeyBbbG5nOiBzdHJpbmddOiB7IFtuczogc3RyaW5nXTogc3RyaW5nIH0gfTtcclxuICAgICAgICBwcmVsb2FkPzogc3RyaW5nW107XHJcbiAgICAgICAgb3B0aW9ucz86IEkxOE4uT3B0aW9ucztcclxuICAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBpbml0aWFsaXplIGkxOG5leHQuXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIGkxOG5leHQg44Gu5Yid5pyf5YyWXHJcbiAgICAgKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEByZXR1cm5zIElQcm9taXNlQmFzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVJMThOKHNldHRpbmdzPzogSTE4TlNldHRpbmdzKTogSVByb21pc2VCYXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpMThuU2V0dGluZ3M6IEkxOE5TZXR0aW5ncyA9IHNldHRpbmdzIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaTE4bk9wdGlvbnM6IEkxOE4uT3B0aW9ucyA9ICgocmVzb3VyY2VzOiB7IFtsbmc6IHN0cmluZ106IHsgW25zOiBzdHJpbmddOiBzdHJpbmcgfSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbG5nIGluIHJlc291cmNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VzLmhhc093blByb3BlcnR5KGxuZykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG5zIGluIHJlc291cmNlc1tsbmddKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlc1tsbmddLmhhc093blByb3BlcnR5KG5zKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZXNbbG5nXVtuc10gPSBnZXRMb2NhbGVGYWxsYmFja1Jlc291cmNlKHJlc291cmNlc1tsbmddW25zXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGkxOG5TZXR0aW5ncy5vcHRpb25zLnJlc291cmNlcyA9IDxhbnk+cmVzb3VyY2VzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpMThuU2V0dGluZ3Mub3B0aW9ucztcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGkxOG5TZXR0aW5ncy5vcHRpb25zO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KShpMThuU2V0dGluZ3MuZmFsbGJhY2tSZXNvdXJjZXMpO1xyXG5cclxuICAgICAgICAgICAgcmVxdWlyZShbXCJqcXVlcnlJMThuZXh0XCJdLCAoJDE4TmV4dDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlKFtcclxuICAgICAgICAgICAgICAgICAgICBcImkxOG5leHRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImkxOG5leHRYSFJCYWNrZW5kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpMThuZXh0TG9jYWxTdG9yYWdlQ2FjaGVcIixcclxuICAgICAgICAgICAgICAgICAgICBcImkxOG5leHRTcHJpbnRmUG9zdFByb2Nlc3NvclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaTE4bmV4dEJyb3dzZXJMYW5ndWFnZURldGVjdG9yXCIsXHJcbiAgICAgICAgICAgICAgICBdLCAoaTE4bmV4dDogSTE4Ti5JMThuXHJcbiAgICAgICAgICAgICAgICAgICAgLCBCYWNrZW5kOiBhbnlcclxuICAgICAgICAgICAgICAgICAgICAsIENhY2hlOiBhbnlcclxuICAgICAgICAgICAgICAgICAgICAsIFBvc3RQcm9jZXNzb3I6IGFueVxyXG4gICAgICAgICAgICAgICAgICAgICwgTGFuZ3VhZ2VEZXRlY3RvcjogYW55XHJcbiAgICAgICAgICAgICAgICApID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaTE4bmV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVzZShCYWNrZW5kKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVzZShDYWNoZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51c2UoUG9zdFByb2Nlc3NvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51c2UoTGFuZ3VhZ2VEZXRlY3RvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5pbml0KGkxOG5PcHRpb25zLCAoZXJyb3I6IGFueSwgdDogSTE4Ti5UcmFuc2xhdGlvbkZ1bmN0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJDE4TmV4dC5pbml0KGkxOG5leHQsICQsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdE5hbWU6IFwidFwiLCAgICAgICAgICAgICAgICAgICAgICAgICAvLyAtLT4gYXBwZW5kcyAkLnQgPSBpMThuZXh0LnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaTE4bk5hbWU6IFwiaTE4blwiLCAgICAgICAgICAgICAgICAgICAvLyAtLT4gYXBwZW5kcyAkLmkxOG4gPSBpMThuZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZU5hbWU6IFwibG9jYWxpemVcIiwgICAgICAgICAgICAgLy8gLS0+IGFwcGVuZHMgJChzZWxlY3RvcikubG9jYWxpemUob3B0cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yQXR0cjogXCJkYXRhLWkxOG5cIiwgICAgICAgICAgLy8gc2VsZWN0b3IgZm9yIHRyYW5zbGF0aW5nIGVsZW1lbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEF0dHI6IFwiaTE4bi10YXJnZXRcIiwgICAgICAgICAgLy8gZGF0YS0oKSBhdHRyaWJ1dGUgdG8gZ3JhYiB0YXJnZXQgZWxlbWVudCB0byB0cmFuc2xhdGUgKGlmIGRpZmZyZW50IHRoZW4gaXRzZWxmKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zQXR0cjogXCJpMThuLW9wdGlvbnNcIiwgICAgICAgIC8vIGRhdGEtKCkgYXR0cmlidXRlIHRoYXQgY29udGFpbnMgb3B0aW9ucywgd2lsbCBsb2FkL3NldCBpZiB1c2VPcHRpb25zQXR0ciA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlT3B0aW9uc0F0dHI6IGZhbHNlLCAgICAgICAgICAgICAgLy8gbm8gdXNlIG9wdGlvbnNBdHRyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlRGVmYXVsdFZhbHVlRnJvbUNvbnRlbnQ6IHRydWUgIC8vIHBhcnNlcyBkZWZhdWx0IHZhbHVlcyBmcm9tIGNvbnRlbnQgZWxlLnZhbCBvciBlbGUudGV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGkxOG5leHQgMy40LjE6IHJlc291cmNlcyDjgYzmjIflrprjgZXjgozjgovjgaggcHJlbG9hZCDjgYzoqq3jgb/ovrzjgb7jgozjgarjgYTjgZ/jgoHjgIHlho3oqq3jgb/ovrzjgb/lh6bnkIbjgpLooYzjgYYuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkxOG5leHQub3B0aW9ucy5yZXNvdXJjZXMgJiYgaTE4bmV4dC5vcHRpb25zLnByZWxvYWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3B0aW9ucyDjgYvjgonjg5fjg63jg5Hjg4bjgqPjgpLkuIDml6bliYrpmaQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9wcmVsb2FkICAgPSBpMThuZXh0Lm9wdGlvbnMucHJlbG9hZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX3Jlc291cmNlcyA9IGkxOG5leHQub3B0aW9ucy5yZXNvdXJjZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBpMThuZXh0Lm9wdGlvbnMucmVzb3VyY2VzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgaTE4bmV4dC5vcHRpb25zLnByZWxvYWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkxOG5leHQubG9hZExhbmd1YWdlcyhfcHJlbG9hZCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3B0aW9ucyDjgpLlhYPjgavmiLvjgZlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkxOG5leHQub3B0aW9ucy5yZXNvdXJjZXMgPSBfcmVzb3VyY2VzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaTE4bmV4dC5vcHRpb25zLnByZWxvYWQgPSBfcHJlbG9hZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENEUC5pMThuID0gaTE4bmV4dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0RQLmkxOG4gPSBpMThuZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogZ2V0IHN0cmluZyByZXNvdXJjZSBmb3IgZmFsbGJhY2suXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIEZhbGxiYWNrIOeUqOODreODvOOCq+ODqeOCpOOCuuODquOCveODvOOCueOBruWPluW+l1xyXG4gICAgICpcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcmV0dXJucyBmYWxiYWtjIOODquOCveODvOOCueOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRMb2NhbGVGYWxsYmFja1Jlc291cmNlKHBhdGg6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgbGV0IGpzb246IEpTT047XHJcbiAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgdXJsOiB0b1VybChwYXRoKSxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGE6IEpTT04pID0+IHtcclxuICAgICAgICAgICAgICAgIGpzb24gPSBkYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogKHhocjogSlF1ZXJ5WEhSLCBzdGF0dXM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coVEFHICsgXCJhamF4IHJlcXVlc3QgZmFpbGVkLiBzdGF0dXM6IFwiICsgc3RhdHVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBqc29uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogQ29udmVydCBwYXRoIHRvIFVSTC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGF0aCBbaW5dIHBhdGggc3RyaW5nXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIHBhdGgg44KSIFVSTCDjgavlpInmj5tcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGF0aCBbaW5dIOODkeOCueOCkuaMh+WumuOAglxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB0b1VybChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghcGF0aCAmJiBcIi9cIiAhPT0gcGF0aFswXSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiaW52YWxpZCBwYXRoLiBwYXRoOiBcIiArIHBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDRFAud2ViUm9vdCArIHBhdGguc2xpY2UoMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBqcXVlcnktaTE4bmV4dCBleHRlbnNpb25zXHJcblxyXG5pbnRlcmZhY2UgSlF1ZXJ5U3RhdGljIHtcclxuICAgIGkxOG46IENEUC5JMThOLkkxOG47XHJcbiAgICB0OiAoa2V5OiBzdHJpbmcsIG9wdGlvbnM/OiBDRFAuSTE4Ti5PcHRpb25zKSA9PiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBKUXVlcnkge1xyXG4gICAgbG9jYWxpemU6IChvcHRpb25zPzogQ0RQLkkxOE4uVHJhbnNsYXRpb25PcHRpb25zKSA9PiB2b2lkO1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBjZHAuaTE4biBkZWNsYXJhdGlvblxyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCJjZHAuaTE4blwiIHtcclxuICAgIGV4cG9ydCA9IENEUDtcclxufVxyXG4iXX0=