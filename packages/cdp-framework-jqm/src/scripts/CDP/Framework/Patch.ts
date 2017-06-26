/// <reference path="../../../../external/include/jquery.d.ts" />
/// <reference path="../../../../external/include/underscore.d.ts" />
/// <reference path="Platform.ts" />

/* tslint:disable:typedef */

namespace CDP.Framework {

    /**
     * vclick patch
     */
    let _vclickPatch = (): void => {
        let jquery_on = $.fn.on,
            jquery_off = $.fn.off;

        let custom_on = function (types, selector, data, fn, /*INTERNAL*/ one) {
            if (typeof types === "string") {
                types = types.replace(/vclick/g, "click");
            }
            return (<any>_.bind(jquery_on, this))(types, selector, data, fn, one);
        };

        let custom_off = function (types, selector, fn) {
            if (typeof types === "string") {
                types = types.replace(/vclick/g, "click");
            }
            return (<any>_.bind(jquery_off, this))(types, selector, fn);
        };

        // replace functions.
        $.fn.on = custom_on;
        $.fn.off = custom_off;
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
         * Apply patch.
         *
         * \~japanese
         * パッチの適用
         */
        public static apply(): void {
            if (!Patch.isSupportedVclick()) {
                _vclickPatch();
                Patch.s_vclickEvent = "click";
            }
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
