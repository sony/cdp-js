namespace CDP.UI {

    /**
     * @interface DomExtensionOptions
     * @breif DomExtension に渡すオプションインターフェイス
     */
    export interface DomExtensionOptions {
        [key: string]: any;
    }

    /**
     * @type DomExtension
     * @brief DOM 拡張関数
     */
    export type DomExtension = ($target: JQuery, DomExtensionOptions?: Object) => JQuery;

    //__________________________________________________________________________________________________________//

    /**
     * @class ExtensionManager
     * @brief 拡張機能を管理するユーティリティクラス
     */
    export class ExtensionManager {

        private static s_domExtensions: DomExtension[] = [];

        /**
         * DOM 拡張関数の登録
         *
         * @param {DomExtension} func [in] DOM 拡張関数
         */
        public static registerDomExtension(func: DomExtension): void {
            this.s_domExtensions.push(func);
        }

        /**
         * DOM 拡張を適用
         *
         * @param {jQuery} $ui       [in] 拡張対象の DOM
         * @param {Object} [options] [in] オプション
         */
        public static applyDomExtension($ui: JQuery, options?: DomExtensionOptions): void {
            this.s_domExtensions.forEach((func: DomExtension) => {
                func($ui, options);
            });
        }
    }
}
