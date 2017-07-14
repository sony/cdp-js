/* tslint:disable:max-line-length */

import * as $ from "jquery";
import "sylvester";

const TAG = "[CDP.Tools.CSS] ";
const global = Function("return this")();

/**
 * @class CSS
 * @brief JavaScript で CSS を操作するときに使用するユーティリティクラス
 */
export default class CSS {
    private static _is3dSupported: boolean = undefined;
    private static _isTransitionSupported: boolean = undefined;

    ///////////////////////////////////////////////////////////////////////
    // public static methods

    static get is3dSupported(): boolean {
        if (null == CSS._is3dSupported) {
            CSS._is3dSupported = CSS.has3d();
        }
        return CSS._is3dSupported;
    }

    static get isTransitionSupported(): boolean {
        if (null == CSS._isTransitionSupported) {
            CSS._isTransitionSupported = CSS.supportsTransitions();
        }
        return CSS._isTransitionSupported;
    }

    /**
     * "transitionend" のイベント名配列を返す
     *
     * @return {Array} transitionend イベント名
     */
    static get transitionEnd(): string {
        return "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";
    }

    /**
     * css の vender 拡張 prefix を返す
     *
     * @return {Array} prefix
     */
    static get cssPrefixes(): string[] {
        return ["-webkit-", "-moz-", "-ms-", "-o-", ""];
    }

    static get cssHideBackFace(): any {
        return {
            "-webkit-backface-visibility": "hidden",
            "-moz-backface-visibility": "hidden",
            "-ms-backface-visibility": "hidden",
            "-o-backface-visibility": "hidden",
            "backface-visibility": "hidden"
        };
    }

    /**
     * Build css property string for scale and translate.
     *
     * @param  {Number} scale: scaling value, by using same value for x y coordinate.
     * @param  {Number} traslateX: x translate value, unit is pixel.
     * @param  {Number} traslateY: y translate value, unit is pixel.
     * @return {String} ex): "scale3d(1.5,1.5,1.0) translate3d(10px,20px,0px)"
     */
    static buildCssTransformString(scale: number, traslateX: number, translateY: number): string {
        return CSS.buildCssScaleString(scale) + " " + CSS.buildCssTranslateString(traslateX, translateY);
    }

    /**
     * Build css property string for scale.
     *
     * @param  {Number} scale: scaling value, by using same value for x y coordinate.
     * @return {String} ex): "scale3d(1.5,1.5,1.0)"
     */
    static buildCssScaleString(scale: number): string {
        if (CSS.is3dSupported) {
            return "scale3d(" + scale + "," + scale + ",1.0)";
        } else {
            return "scale(" + scale + "," + scale + ")";
        }
    }

    /**
     * Build css property string for translate.
     *
     * @param  {Number} traslateX: x translate value, unit is pixel.
     * @param  {Number} traslateY: y translate value, unit is pixel.
     * @return {String} ex): "translate3d(10px,20px,0px)"
     */
    static buildCssTranslateString(traslateX: number, translateY: number): string {
        if (CSS.is3dSupported) {
            return "translate3d(" + traslateX + "px," + translateY + "px,0px)";
        } else {
            return "translate(" + traslateX + "px," + translateY + "px)";
        }
    }

    /**
     * Gets matrix value.
     *
     * @private
     * @param {String} matrix index
     * @return {Number} value
     */
    static getCssMatrixValue(element: HTMLElement, type: string): number;
    static getCssMatrixValue(element: JQuery, type: string): number;
    static getCssMatrixValue(element: any, type: string): number {
        let transX = 0;
        let transY = 0;
        let scaleX = 0;
        let scaleY = 0;
        for (let i = 0; i < CSS.cssPrefixes.length; i++) {
            let matrix = $(element).css(CSS.cssPrefixes[i] + "transform");
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
    }

    /**
     * Clears the transformations, transitions, or animations.
     *
     * @private
     * @param {Object} element
     */
    static clearTransformsTransitions(element: HTMLElement): void;
    static clearTransformsTransitions(element: JQuery): void;
    static clearTransformsTransitions(element: any): void {
        const $element = $(element);
        if (!CSS.isTransitionSupported) {
            $element.stop(true, true);
        }

        $element.off(CSS.transitionEnd);
        const transforms = {};
        const transitions = {};
        for (let i = 0; i < CSS.cssPrefixes.length; i++) {
            transforms[CSS.cssPrefixes[i] + "transform"] = "";
            transitions[CSS.cssPrefixes[i] + "transition"] = "";
        }

        $element.css(transforms).css(transitions);
    }

    /**
     * css transition property を削除する
     *
     * @param element {JQuery} [in] 対象の jQuery オブジェクト
     */
    static clearTransitions(element: HTMLElement): void;
    static clearTransitions(element: JQuery): void;
    static clearTransitions(element: any): void {
        const $element = $(element);
        if (!CSS.isTransitionSupported) {
            $element.stop(true, true);
        }

        $element.off(CSS.transitionEnd);
        const transitions = {};
        for (let i = 0; i < CSS.cssPrefixes.length; i++) {
            transitions[CSS.cssPrefixes[i] + "transition"] = "";
        }
        $element.css(transitions);
    }

    /**
     * css fade transition property を付与する
     *
     * @param element {JQuery} [in] 対象の jQuery オブジェクト
     * @param msec    {Number} [in] フェードの時間
     * @param element {String} [in] フェードのタイミング関数 { https://developer.mozilla.org/ja/docs/Web/CSS/timing-function }
     */
    static setFadeProperty(element: HTMLElement, msec: number, timingFunction: string): void;
    static setFadeProperty(element: JQuery, msec: number, timingFunction: string): void;
    static setFadeProperty(element: any, msec: number, timingFunction: string): void {
        const transitions = {},
            second = (msec / 1000) + "s",
            animation = " " + second + " " + timingFunction;
        for (let i = 0; i < CSS.cssPrefixes.length; i++) {
            transitions[CSS.cssPrefixes[i] + "transition"] =
                "opacity" + animation +
                "," +
                CSS.cssPrefixes[i] + "transform" + animation;
        }
        $(element).css(transitions);
    }

    /**
     * Moves the element using css translate or translate3d.
     *
     * @param {Number} horizontal offset.
     * @param {Number} vertical offset.
     * @param {Number} scale x.
     * @param {Number} scale y.
     * @param {Object} element to move.
     * @param {Number} duration in milliseconds.
     * @param {Function} callback after the animation.
     */
    static moveImage(offsetX: number, offsetY: number, scaleX: number, scaleY: number, element: HTMLElement, duration: number, callback?: Function): void;
    static moveImage(offsetX: number, offsetY: number, scaleX: number, scaleY: number, element: JQuery, duration: number, callback?: Function): void;
    static moveImage(offsetX: number, offsetY: number, scaleX: number, scaleY: number, element: any, duration: number, callback?: Function): void {
        // sylevster が無い場合の fall back
        if (null != $M) {
            CSS.transformElement(element, {
                duration: duration,
                callback: callback,
                scale: scaleX, // TODO: まずは、scaleXとscaleYは同じ値が指定される前提
                offsetX: offsetX,
                offsetY: offsetY,
            });
        } else {
            CSS.moveImageNoTranslate(offsetX, offsetY, element, duration, callback);
        }
    }

    /**
     * Moves the element without using css translate.
     *
     * @param {Number} horizontal offset.
     * @param {Number} vertical offset.
     * @param {Object} element to move.
     * @param {Number} duration in milliseconds.
     * @param {Function} callback after the animation.
     */
    static moveImageNoTranslate(offsetX: number, offsetY: number, element: HTMLElement, duration: number, callback?: Function): void;
    static moveImageNoTranslate(offsetX: number, offsetY: number, element: JQuery, duration: number, callback?: Function): void;
    static moveImageNoTranslate(offsetX: number, offsetY: number, element: any, duration: number, callback?: Function): void {
        $(element).animate({
            left: offsetX + "px",
            top: offsetY + "px",
            bottom: offsetY * (-1) + "px",
            right: offsetX * (-1) + "px"
        }, duration, () => {
            if (typeof callback === "function") {
                callback();
            }
        });
    }

    /**
     * Detects if the browser supports 3d tranforms.
     *
     * @private
     * @return {Boolean} true: has / false: doesn"t.
     */
    private static has3d(): boolean {
        if (null != global.Modernizr && null != global.Modernizr.csstransforms3d) {
            return global.Modernizr.csstransforms3d;
        } else {
            const el = document.createElement("p");
            let has3d: any = true;
            const transforms = {
                "webkitTransform": "-webkit-transform",
                "OTransform": "-o-transform",
                "msTransform": "-ms-transform",
                "MozTransform": "-moz-transform",
                "transform": "transform"
            };

            // Add it to the body to get the computed style.
            document.body.insertBefore(el, null);

            for (const t in transforms) {
                if (null != el.style[t]) {
                    el.style[t] = "translate3d(1px,1px,1px)";
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }

            document.body.removeChild(el);

            return ((null != has3d) && has3d.length > 0 && has3d !== "none");
        }
    }

    /**
     * Returns true if the browser supports css transitions
     * currently, this only returns false for IE9 and below.
     *
     * @private
     * @return {Boolean} true: supported / false: not supported.
     */
    private static supportsTransitions(): boolean {
        if (null != global.Modernizr && null != global.Modernizr.csstransitions) {
            return global.Modernizr.csstransitions;
        } else {
            const ieTransVer = 10;
            let rv = ieTransVer;
            const ua = navigator.userAgent;
            const re = new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");
            if (re.exec(ua) !== null) {
                rv = parseFloat(RegExp.$1);
            }
            // assumes IE10 version that supports transition
            if (rv < ieTransVer) {
                return false;
            }
            return true;
        }
    }

    /**
     * Apply transforms values to an element
     * @param {Object} jquery element
     * @param {Object} configuration options
     * @private
     */
    private static transformElement(element: HTMLElement, config: any): void;
    private static transformElement(element: JQuery, config: any): void;
    private static transformElement(element: any, config: any): void {
        const duration = (typeof config.duration === "number") ? config.duration : 0;
        const callback = (typeof config.callback === "function") ? config.callback : null;
        let transformValue = "";
        config.timing = config.timing || "ease-in";

        // Bug in sylvester: If scale is 0 it won't animate
        config.scale = (typeof config.scale !== "undefined") ? config.scale : 1;
        config.scale = config.scale || 0.001;

        if (config.transformValue) {
            transformValue = config.transformValue;
        } else if (CSS.is3dSupported) {
            transformValue = CSS.transformElement3D(config);
        } else {
            transformValue = CSS.transformElement2D(config);
        }

        const secondsDuration = (duration / 1000) + "s";
        const transformProperties = {};
        const elemTransitions = {};

        for (let i = 0; i < CSS.cssPrefixes.length; i++) {
            transformProperties[CSS.cssPrefixes[i] + "transform"] = transformValue;

            elemTransitions[CSS.cssPrefixes[i] + "transition"] = "all " + secondsDuration + " " + config.timing;

            if (config.delay) {
                transformProperties[CSS.cssPrefixes[i] + "transition-delay"] = (config.delay / 1000) + "s";
            }
        }

        const $element = $(element);

        $element
            .css(elemTransitions)
            .css(transformProperties);

        if (typeof config.opacity !== "undefined") {
            $element.css("opacity", config.opacity);
        }

        setTimeout(function () {
            if (callback !== null) {
                callback();
            }
        }, duration || 0);
    }



    /**
     * function to use if 3d transformations are not supported. Fall back to 2D support.
     *
     * @param {Object} configurations and overrides
     * @return null
     */
    private static transformElement2D(config: any): string {
        const s = config.scale;
        const scaleMatrix = $M([
            [s, 0, 0],
            [0, s, 0],
            [0, 0, 1]
        ]);

        // Create translation matrix
        const tx = config.offsetX || 0;
        const ty = config.offsetY || 0;
        const translateMatrix = $M([
            [1, 0, tx],
            [0, 1, ty],
            [0, 0, 1]
        ]);

        // Create rotation Z matrix
        const z1 = (typeof config.rotateZ !== "undefined") ? Math.cos(config.rotateZ) : 1;
        const z2 = (typeof config.rotateZ !== "undefined") ? Math.sin(-config.rotateZ) : 0;
        const z3 = (typeof config.rotateZ !== "undefined") ? Math.sin(config.rotateZ) : 0;
        const z4 = (typeof config.rotateZ !== "undefined") ? Math.cos(config.rotateZ) : 1;
        const rotateZMatrix = $M([
            [z1, z2, 0],
            [z3, z4, 0],
            [0, 0, 1]
        ]);

        const fm = translateMatrix
            .x(scaleMatrix)
            .x(rotateZMatrix);

        return "matrix(" +
            fm.e(1, 1).toFixed(10) + "," + fm.e(2, 1).toFixed(10) + "," +
            fm.e(1, 2).toFixed(10) + "," + fm.e(2, 2).toFixed(10) + "," +
            fm.e(1, 3).toFixed(10) + "," + fm.e(2, 3).toFixed(10) +
            ")";
    }

    /**
     * function to use if 3d transformations are supported
     *
     * @param {Object} configurations and overrides
     * @return null
     */
    private static transformElement3D(config: any) {
        // Create scale matrix
        const s = config.scale;
        const scaleMatrix = $M([
            [s, 0, 0, 0],
            [0, s, 0, 0],
            [0, 0, s, 0],
            [0, 0, 0, 1]
        ]);

        // Create translation matrix
        const tx = config.offsetX || 0;
        const ty = config.offsetY || 0;
        const tz = config.offsetZ || 0;
        const translateMatrix = $M([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [tx, ty, tz, 1]
        ]);

        // Create rotation X matrix
        const x1 = (typeof config.rotateX !== "undefined") ? Math.cos(config.rotateX) : 1;
        const x2 = (typeof config.rotateX !== "undefined") ? Math.sin(-config.rotateX) : 0;
        const x3 = (typeof config.rotateX !== "undefined") ? Math.sin(config.rotateX) : 0;
        const x4 = (typeof config.rotateX !== "undefined") ? Math.cos(config.rotateX) : 1;
        const rotateXMatrix = $M([
            [1, 0, 0, 0],
            [0, x1, x2, 0],
            [0, x3, x4, 0],
            [0, 0, 0, 1]
        ]);

        // Create rotation Y matrix
        const y1 = (typeof config.rotateY !== "undefined") ? Math.cos(config.rotateY) : 1;
        const y2 = (typeof config.rotateY !== "undefined") ? Math.sin(config.rotateY) : 0;
        const y3 = (typeof config.rotateY !== "undefined") ? Math.sin(-config.rotateY) : 0;
        const y4 = (typeof config.rotateY !== "undefined") ? Math.cos(config.rotateY) : 1;
        const rotateYMatrix = $M([
            [y1, 0, y2, 0],
            [0, 1, 0, 0],
            [y3, 0, y4, 0],
            [0, 0, 0, 1]
        ]);

        // Create rotation Z matrix
        const z1 = (typeof config.rotateZ !== "undefined") ? Math.cos(config.rotateZ) : 1;
        const z2 = (typeof config.rotateZ !== "undefined") ? Math.sin(-config.rotateZ) : 0;
        const z3 = (typeof config.rotateZ !== "undefined") ? Math.sin(config.rotateZ) : 0;
        const z4 = (typeof config.rotateZ !== "undefined") ? Math.cos(config.rotateZ) : 1;
        const rotateZMatrix = $M([
            [z1, z2, 0, 0],
            [z3, z4, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);

        const fm = rotateXMatrix
            .x(rotateYMatrix)
            .x(rotateZMatrix)
            .x(scaleMatrix)
            .x(translateMatrix);

        return "matrix3d(" +
            fm.e(1, 1).toFixed(10) + "," + fm.e(1, 2).toFixed(10) + "," + fm.e(1, 3).toFixed(10) + "," + fm.e(1, 4).toFixed(10) + "," +
            fm.e(2, 1).toFixed(10) + "," + fm.e(2, 2).toFixed(10) + "," + fm.e(2, 3).toFixed(10) + "," + fm.e(2, 4).toFixed(10) + "," +
            fm.e(3, 1).toFixed(10) + "," + fm.e(3, 2).toFixed(10) + "," + fm.e(3, 3).toFixed(10) + "," + fm.e(3, 4).toFixed(10) + "," +
            fm.e(4, 1).toFixed(10) + "," + fm.e(4, 2).toFixed(10) + "," + fm.e(4, 3).toFixed(10) + "," + fm.e(4, 4).toFixed(10) +
            ")";
    }

}
