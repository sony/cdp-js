/* tslint:disable:typedef no-bitwise */

namespace CDP.Framework {

    /**
     * vclick patch
     */
    const _vclickPatch = (): void => {
        const jquery_on = $.fn.on,
            jquery_off = $.fn.off;

        const custom_on = function (types, selector, data, fn, /*INTERNAL*/ one) {
            if (typeof types === "string") {
                types = types.replace(/vclick/g, "click");
            }
            return (<any>_.bind(jquery_on, this))(types, selector, data, fn, one);
        };

        const custom_off = function (types, selector, fn) {
            if (typeof types === "string") {
                types = types.replace(/vclick/g, "click");
            }
            return (<any>_.bind(jquery_off, this))(types, selector, fn);
        };

        // replace functions.
        (<any>$.fn).on = custom_on;
        (<any>$.fn).off = custom_off;
    };

    /**
     * $.mobile.widget.popup patch
     */
    const _mobilePopupPatch = (): void => {
        const jqueryMajor = ~~$.fn.jquery.split(".")[0];
        const jqmVersion = $.mobile.version.split(".");
        const jqmMajor = ~~jqmVersion[0];
        const jqmMiner = ~~jqmVersion[1];

        if (3 <= jqueryMajor && jqmMajor < 2 && jqmMiner < 5) {
            // patch code from jqm 1.5
            // https://github.com/jquery/jquery-mobile/commit/d34c86ae14d4ea603357be5e326de1fb8c31dbf9
            const _safeCreatePrerequisites = function (screenPrerequisite: any, containerPrerequisite: any, whenDone: any): void {
                let prerequisites;
                const self: any = this;

                prerequisites = {
                    screen: $.Deferred(),
                    container: $.Deferred()
                };

                prerequisites.screen.done(function () {
                    if (prerequisites === self._prerequisites) {
                        screenPrerequisite();
                    }
                });

                prerequisites.container.done(function () {
                    if (prerequisites === self._prerequisites) {
                        containerPrerequisite();
                    }
                });

                $.when(prerequisites.screen, prerequisites.container).done(function () {
                    if (prerequisites === self._prerequisites) {
                        self._prerequisites = null;
                        whenDone();
                    }
                });

                self._prerequisites = prerequisites;
            };

            const $mobile: any = $.mobile;
            if ($mobile.widgets && $mobile.widgets.popup) {
                $mobile.widgets.popup.prototype._createPrerequisites = _safeCreatePrerequisites;
            }
        }
    };

    //___________________________________________________________________________________________________________________//

    /**
     * @class Patch
     * @brief patch class for jqm framework.
     *       [review] vclick のパッチを当てることがわかるとよい
     */
    export class Patch {

        static s_vclickEvent = "vclick";

        ///////////////////////////////////////////////////////////////////////
        // public static methods

        /**
         * \~english
         * Apply patch before initialize.
         *
         * \~japanese
         * 初期化前のパッチの適用
         */
        public static applyBeforeInit(): void {
            if (!Patch.isSupportedVclick()) {
                _vclickPatch();
                Patch.s_vclickEvent = "click";
            }
        }

        /**
         * \~english
         * Apply patch after initialize.
         *
         * \~japanese
         * 初期化後のパッチの適用
         */
        public static applyAfterInit(): void {
            _mobilePopupPatch();
        }

        /**
         * \~english
         * if "vclick" event is unsupported, returns false. ex: Android 4.4 (Kitkat)
         *
         * \~japanese
         * "vclick" event が非サポートである platform (KitKat) は false を返す。
         * jQM の version up により、解決される場合は無効かする。
         */
        public static isSupportedVclick(): boolean {
            // for Android 4.4+ (Kitkat ～)
            if (Platform.Android && !Platform.ltAd4_4) {
                return false;
            }
            return true;
        }
    }
}
