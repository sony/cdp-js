namespace CDP.UI {

    import Config       = CDP.Config;
    import Framework    = CDP.Framework;

    const TAG = "[CDP.UI.Theme] ";

    /**
     * @interface PlatformTransition
     * @brief プラットフォームごとの Transition を格納
     */
    export interface PlatformTransition {
        [platform: string]: string;     // ex) ios: "slide"
        fallback: string;               // fallback transition prop
    }

    /**
     * @interface TransitionMap
     * @brief トランジションマップ
     */
    export interface TransitionMap {
        [transitionName: string]: PlatformTransition;
    }

    /**
     * @interface ThemeInitOptions
     * @brief トランジションマップ
     */
    export interface ThemeInitOptions {
        platform?: string;                  // platform を指定. default:"auto"
        reserveScrollbarRegion?: boolean;   // PC デバッグ環境ではスクロールバーを表示. default: "true"
    }

    //__________________________________________________________________________________________________________//

    /**
     * @class Theme
     * @brief UI Theme 設定を行うユーティリティクラス
     */
    export class Theme {

        private static s_platforms: string[] = ["ios", "android"];
        private static s_pageTransitionMap: TransitionMap = {
            "platform-default": {
                ios: "slide",
                android: "floatup",
                fallback: "slide",
            },
            "platform-alternative": {
                ios: "slideup",
                android: "floatup",
                fallback: "slideup",
            },
        };
        private static s_dialogTransitionMap: TransitionMap = {
            "platform-default": {
                ios: "popzoom",
                android: "crosszoom",
                fallback: "none",
            },
        };

        ///////////////////////////////////////////////////////////////////////
        // public static methods:

        /**
         * Theme の初期化
         *
         * @param options オプション指定
         * @returns true: 成功 / false: 失敗
         */
        public static initialize(options?: ThemeInitOptions): string {
            const opt = $.extend({}, {
                platform: "auto",
                reserveScrollbarRegion: true,
            }, options);

            if ("auto" === opt.platform) {
                return Theme.detectUIPlatform(opt.reserveScrollbarRegion);
            } else {
                if (Theme.setCurrentUIPlatform(opt.platform)) {
                    return opt.platform;
                } else {
                    console.warn(TAG + "setCurrentUIPlatform(), failed. platform: " + opt.platform);
                }
            }
        }

        /**
         * 現在指定されている UI Platform を取得
         *
         * @return {String} ex) "ios"
         */
        public static getCurrentUIPlatform(): string {
            const $htms = $("html");
            for (let i = 0, n = Theme.s_platforms.length; i < n; i++) {
                if ($htms.hasClass("ui-platform-" + Theme.s_platforms[i])) {
                    return Theme.s_platforms[i];
                }
            }
            return null;
        }

        /**
         * UI Platform を設定
         *
         * @return {String} true: 成功 / false: 失敗
         */
        public static setCurrentUIPlatform(platform: string): boolean {
            if (null == platform || Theme.s_platforms.indexOf(platform) >= 0) {
                const $htms = $("html");
                Theme.s_platforms.forEach((target) => {
                    $htms.removeClass("ui-platform-" + target);
                });
                if (platform) {
                    $htms.addClass("ui-platform-" + platform);
                }
                return true;
            } else {
                return false;
            }
        }

        /**
         * 現在の Platform を判定し最適な platform を自動決定
         *
         * @param reserveScrollbarRegion PC デバッグ環境ではスクロールバーを表示. default: true
         * @returns ex) "ios"
         */
        public static detectUIPlatform(reserveScrollbarRegion: boolean = true): string {
            let platform = "";
            // platform の設定
            if (Framework.Platform.iOS) {
                $("html").addClass("ui-platform-ios");
                platform = "ios";
            } else {
                $("html").addClass("ui-platform-android");
                platform = "android";
            }
            // PC デバッグ環境ではスクロールバーを表示
            if (Config.DEBUG && reserveScrollbarRegion && !Framework.Platform.Mobile) {
                $("body").css("overflow-y", "scroll");
            }
            return platform;
        }

        /**
         * platform を配列で登録
         * 上書きされる
         *
         * @param {String[]} platforms [in] OS ex): ["ios", "android"]
         */
        public static registerUIPlatforms(platforms: string[]): void {
            if (platforms) {
                Theme.s_platforms = platforms;
            }
        }

        /**
         * page transition を登録
         * 上書きされる
         *
         * @param {TransitionMap} map [in] TransitionMap を指定
         */
        public static registerPageTransitionMap(map: TransitionMap): void {
            if (map) {
                Theme.s_pageTransitionMap = map;
            }
        }

        /**
         * dialog transition を登録
         * 上書きされる
         *
         * @param {TransitionMap} map [in] TransitionMap を指定
         */
        public static registerDialogTransitionMap(map: TransitionMap): void {
            if (map) {
                Theme.s_dialogTransitionMap = map;
            }
        }

        /**
         * page transition を取得
         * TransitionMap にアサインされているものであれば変換
         *
         * @return {String[]} "slide"
         */
        public static queryPageTransition(original: string): string {
            const convert = Theme.s_pageTransitionMap[original];
            if (convert) {
                return convert[Theme.getCurrentUIPlatform()] || convert.fallback;
            } else {
                return original;
            }
        }

        /**
         * dialog transition を取得
         * TransitionMap にアサインされているものであれば変換
         *
         * @return {String[]} "slide"
         */
        public static queryDialogTransition(original: string): string {
            const convert = Theme.s_dialogTransitionMap[original];
            if (convert) {
                return convert[Theme.getCurrentUIPlatform()] || convert.fallback;
            } else {
                return original;
            }
        }
    }

    //__________________________________________________________________________________________________________//

    // jquey.mobile.changePage() の Hook.
    function applyCustomChangePage() {
        const jqmChangePage: (to: any, options?: ChangePageOptions) => void = $.mobile.changePage.bind($.mobile);

        function customChangePage(to: any, options?: ChangePageOptions): void {
            if (_.isString(to)) {
                if (options && options.transition) {
                    options.transition = Theme.queryPageTransition(options.transition);
                }
            }
            jqmChangePage(to, options);
        }

        $.mobile.changePage = customChangePage;
    }

    // framework 初期化後に適用
    Framework.waitForInitialize()
        .done(() => {
            applyCustomChangePage();
        });
}
