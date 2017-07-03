namespace CDP.UI {

    import Config       = CDP.Config;
    import Framework    = CDP.Framework;

    /**
     * @interface TransitionMap
     * @brief トランジションマップ
     */
    export interface PlatformTransition {
        [platform: string]: string;     //!< ex) ios: "slide"
        fallback: string;               //!< fallback transition prop
    }

    /**
     * @interface TransitionMap
     * @brief トランジションマップ
     */
    export interface TransitionMap {
        [transitionName: string]: PlatformTransition;
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
         * 現在指定されている UI Platform を取得
         *
         * @return {String} ex) "ios"
         */
        public static getCurrentUIPlatform(): string {
            const $htms = $("html");
            for (let i = 0, n = this.s_platforms.length; i < n; i++) {
                if ($htms.hasClass("ui-platform-" + this.s_platforms[i])) {
                    return this.s_platforms[i];
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
            if (null == platform || this.s_platforms.indexOf(platform) >= 0) {
                const $htms = $("html");
                this.s_platforms.forEach((target) => {
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
         * @return {String} ex) "ios"
         */
        public static detectUIPlatform(): void {
            // platform の設定
            if (Framework.Platform.iOS) {
                $("html").addClass("ui-platform-ios");
            } else {
                $("html").addClass("ui-platform-android");
            }
            // PC デバッグ環境ではスクロールバーを表示
            if (Config.DEBUG && !Framework.Platform.Mobile) {
                $("body").css("overflow-y", "scroll");
            }
        }

        /**
         * platform を配列で設定
         * 上書きされる
         *
         * @param {String[]} platforms [in] OS ex): ["ios", "android"]
         */
        public static setUIPlatforms(platforms: string[]): void {
            if (platforms) {
                this.s_platforms = platforms;
            }
        }

        /**
         * page transition を設定
         * 上書きされる
         *
         * @param {TransitionMap} map [in] TransitionMap を指定
         */
        public static setPageTransitionMap(map: TransitionMap): void {
            if (map) {
                this.s_pageTransitionMap = map;
            }
        }

        /**
         * dialog transition を設定
         * 上書きされる
         *
         * @param {TransitionMap} map [in] TransitionMap を指定
         */
        public static setDialogTransitionMap(map: TransitionMap): void {
            if (map) {
                this.s_dialogTransitionMap = map;
            }
        }

        /**
         * page transition を取得
         * TransitionMap にアサインされているものであれば変換
         *
         * @return {String[]} "slide"
         */
        public static queryPageTransition(original: string): string {
            const convert = this.s_pageTransitionMap[original];
            if (convert) {
                return convert[this.getCurrentUIPlatform()] || convert.fallback;
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
            const convert = this.s_dialogTransitionMap[original];
            if (convert) {
                return convert[this.getCurrentUIPlatform()] || convert.fallback;
            } else {
                return original;
            }
        }
    }

    //__________________________________________________________________________________________________________//

    // jquey.mobile.changePage() の Hook.
    function applyCustomChangePage() {
        const jqmChangePage: (to: any, options?: ChangePageOptions) => void = _.bind($.mobile.changePage, $.mobile);

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
