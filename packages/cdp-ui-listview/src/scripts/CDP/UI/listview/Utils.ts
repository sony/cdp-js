namespace CDP.UI {

    // cdp.ui.listview は cdp.core に依存しないため、独自にglobal を提供する
    /*jshint evil:true */
    export const global = (<any>CDP).global || Function("return this")();
    /*jshint evil:false */

    /**
     * Backbone.View の新規合成
     *
     * @param base    {Backbone.View}                 [in] prototype chain 最下位の View クラス
     * @param derives {Backbone.View|Backbone.View[]} [in] 派生されるの View クラス
     * @return {Backbone.View|Backbone.View[]} 新規に生成された View のコンストラクタ
     */
    export function composeViews(base: ViewConstructor, derives: ViewConstructor | ViewConstructor[]): ViewConstructor {
        let _composed = base;
        const _derives = <ViewConstructor[]>(derives instanceof Array ? derives : [derives]);
        _derives.forEach((derive) => {
            const seed = {};
            _.extendOwn(seed, derive.prototype);
            delete seed.constructor;
            _composed = (<any>_composed).extend(seed);
        });
        return _composed;
    }

    /**
     * Backbone.View の合成
     * prototype chain を作る合成
     *
     * @param derived {Backbone.View}                 [in] prototype chain 最上位の View クラス
     * @param bases   {Backbone.View|Backbone.View[]} [in] 合成元のView クラス
     */
    export function deriveViews(derived: ViewConstructor, bases: ViewConstructor | ViewConstructor[]): void {
        let _composed: ViewConstructor;
        const _bases = <ViewConstructor[]>(bases instanceof Array ? bases : [bases]);
        if (2 <= _bases.length) {
            _composed = composeViews(_bases[0], _bases.slice(1));
        } else {
            _composed = _bases[0];
        }
        derived = composeViews(_composed, derived);
    }

    /**
     * Backbone.View の合成
     * prototype chain を作らない合成
     *
     * @param derived {Backbone.View}                 [in] 元となる View クラス
     * @param bases   {Backbone.View|Backbone.View[]} [in] 合成元のView クラス
     */
    export function mixinViews(derived: ViewConstructor, bases: ViewConstructor | ViewConstructor[]): void {
        const _bases = <ViewConstructor[]>(bases instanceof Array ? bases : [bases]);
        _bases.forEach((base) => {
            Object.getOwnPropertyNames(base.prototype).forEach(name => {
                derived.prototype[name] = base.prototype[name];
            });
        });
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @class _ListViewUtils
     * @brief 内部で使用する便利関数
     *        Tools からの最低限の流用
     */
    export module _ListViewUtils {

        /**
         * css の vender 拡張 prefix を返す
         *
         * @return {Array} prefix
         */
        export const cssPrefixes = ["-webkit-", "-moz-", "-ms-", "-o-", ""];

        /**
         * css の matrix の値を取得.
         *
         * @param element {jQuery} [in] 対象の jQuery オブジェクト
         * @param type    {String} [in] matrix type string [translateX | translateY | scaleX | scaleY]
         * @return {Number} value
         */
        export const getCssMatrixValue = (element: JQuery, type: string): number => {
            let transX = 0;
            let transY = 0;
            let scaleX = 0;
            let scaleY = 0;
            for (let i = 0; i < cssPrefixes.length; i++) {
                let matrix = $(element).css(cssPrefixes[i] + "transform");
                if (matrix) {
                    const is3dMatrix = matrix.indexOf("3d") !== -1 ? true : false;
                    matrix = matrix.replace("matrix3d", "").replace("matrix", "").replace(/[^\d.,-]/g, "");
                    const arr = matrix.split(",");
                    transX = Number(arr[is3dMatrix ? 12 : 4]);
                    transY = Number(arr[is3dMatrix ? 13 : 5]);
                    scaleX = Number(arr[0]);
                    scaleY = Number(arr[is3dMatrix ? 5 : 3]);
                    break;
                }
            }
            switch (type) {
                case "translateX":
                    return isNaN(transX) ? 0 : transX;
                case "translateY":
                    return isNaN(transY) ? 0 : transY;
                case "scaleX":
                    return isNaN(scaleX) ? 1 : scaleX;
                case "scaleY":
                    return isNaN(scaleY) ? 1 : scaleY;
                default:
                    return 0;
            }
        };

        /**
         * "transitionend" のイベント名配列を返す
         *
         * @return {Array} transitionend イベント名
         */
        export const transitionEnd = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";

        /**
         * transition 設定
         *
         * @private
         * @param {Object} element
         */
        export const setTransformsTransitions = (element: JQuery, prop: string, msec: number, timingFunction: string): void => {
            const $element = $(element);
            const transitions = {};
            const second = (msec / 1000) + "s";
            const animation = " " + second + " " + timingFunction;
            const transform = ", transform" + animation;

            for (let i = 0; i < cssPrefixes.length; i++) {
                transitions[cssPrefixes[i] + "transition"] = prop + animation + transform;
            }

            $element.css(transitions);
        };


        /**
         * transition 設定の削除
         *
         * @private
         * @param {Object} element
         */
        export const clearTransitions = (element: JQuery): void => {
            const $element = $(element);

            $element.off(transitionEnd);
            const transitions = {};
            for (let i = 0; i < cssPrefixes.length; i++) {
                transitions[cssPrefixes[i] + "transition"] = "";
            }

            $element.css(transitions);
        };

        /**
         * Math.abs よりも高速な abs
         */
        export const abs = (x: number): number => {
            return x >= 0 ? x : -x;
        };

        /**
         * Math.max よりも高速な max
         */
        export const max = (lhs: number, rhs: number): number => {
            return lhs >= rhs ? lhs : rhs;
        };
    }
}
