/* tslint:disable:max-line-length no-unused-variable */

import * as $ from "jquery";
import CSS from "../tools/css";
import {
    TransitionSettings,
    TransitionTarget,
    TransitionProperty,
} from "./interfaces";
import TimerAnimationInfo from "./timer-animation";

const TAG = "[CDP.SlideShow.Transition] ";

/**
 * @class Transition
 * @brief Slide Show transition logic utility class
 */
export default class Transition {
    private static s_imageOffset = 50;

    ///////////////////////////////////////////////////////////////////////
    // public static methods

    // get image offset value
    public static get imageOffset(): number {
        return Transition.s_imageOffset;
    }

    /**
     * Slide effect transition.
     *
     * @private
     * @param viewport {Object}  [in] viewport element where the image will be shown.
     * @param newElem  {Object}  [in] dom element that will be animated.
     * @param config   {Object}  [in] config options.
     * @param start    {Boolean} [in] true: first image / false: not first
     * @return {Object} TransitionSettings object.
     */
    public static slideIn(viewport: JQuery, newElem: JQuery, config: any, start: boolean): TransitionSettings {
        // initialize configs
        const direction = config && config.direction ? config.direction : "left";
        const duration = config && config.duration ? config.duration : 500;
        const offset = config && config.offset ? config.offset : Transition.s_imageOffset;
        const focusDuration = config && config.focusDuration ? config.focusDuration : 1500;

        // for first frame switch zoom-in
        if (!!start) {
            config.fadeDuration = duration / 2;
            return Transition.kenBurn(viewport, newElem, config, start);
        }

        // init screen
        const oldElem = Transition.initViewport(viewport, newElem);

        // old target
        const oldElementNewOffset: number = ((direction === "left") ? -1 : 1) * (offset + $(oldElem).width());
        const currX = CSS.getCssMatrixValue($(oldElem), "translateX");
        const currY = CSS.getCssMatrixValue($(oldElem), "translateY");
        const currScale = CSS.getCssMatrixValue($(oldElem), "scaleX");
        const oldTransitionTarget: TransitionTarget = {
            $element: $(oldElem),
            transform: Transition.createTransformProperty(currScale, currX, currY, currScale, oldElementNewOffset, currY),
        };

        // new target
        const newElementNewOffset: number = ((direction === "left") ? 1 : -1) * (offset + $(oldElem).width());
        const newTransitionTarget: TransitionTarget = {
            $element: $(newElem),
            transform: Transition.createTransformProperty(1.0, newElementNewOffset, 0, 1.0, 0, 0),
        };

        // transition setting.
        const transitionSettings: TransitionSettings = {
            viewport: viewport,
            oldTarget: oldTransitionTarget,
            newTarget: newTransitionTarget,
            transformDuration: duration,
            transformTimingFunction: "ease-out",
            focusDuration: focusDuration,
        };

        return transitionSettings;
    }

    /**
     * Crossfade effect transition.
     *
     * @private
     * @param {Object} viewport element where the image will be shown.
     * @param {Object} dom element that will be animated.
     * @param {Function} callback.
     * @param {Object} config options.
     * @return {Object} TransitionSettings object.
     */
    public static fadeIn(viewport: JQuery, newElem: JQuery, config: any, start: boolean): TransitionSettings {
        // config settings
        const duration = config && config.duration ? config.duration : 1000;
        const focusDuration = config && config.focusDuration ? config.focusDuration : 1500;

        // init screen
        const oldElem = Transition.initViewport(viewport, newElem);

        // old target
        let oldTransitionTarget: TransitionTarget = null;
        if (!start) {
            oldTransitionTarget = {
                $element: $(oldElem),
                fade: Transition.createFadeProperty(1.0, 0.0),
                transform: Transition.createHardwareAcceleratorProperty(oldElem),
            };
        }

        // new target
        const newTransitionTarget: TransitionTarget = {
            $element: $(newElem),
            fade: Transition.createFadeProperty(0.0, 1.0),
            transform: Transition.createHardwareAcceleratorProperty(),
        };

        // transition setting.
        const transitionSettings: TransitionSettings = {
            viewport: viewport,
            oldTarget: oldTransitionTarget,
            newTarget: newTransitionTarget,
            fadeDuration: duration,
            fadeTimingFunction: "ease-in-out",
            focusDuration: focusDuration,
        };

        return transitionSettings;
    }

    /**
     * Kenburn effect transition.
     *
     * @private
     * @param {Object} viewport element where the image will be shown.
     * @param {Object} dom element that will be animated.
     * @param {Object} config options.
     * @param {Boolean} true: start content.
     * @return {Object} TransitionSettings object.
     */
    public static kenBurn(viewport: JQuery, newElem: JQuery, config: any, start: boolean): TransitionSettings {
        // config settings
        const type = config && config.type ? config.type : "zoomin";
        const scale = config && config.scale ? config.scale : 1.5;
        const offsetX = config && config.offsetX ? config.offsetX : 50;
        const offsetY = config && config.offsetY ? config.offsetY : 50;
        const duration = config && config.duration ? config.duration : 4000;
        const focusDuration = config && config.focusDuration ? config.focusDuration : 500;
        const transformDuration = config && config.transformDuration ? config.transformDuration : duration;
        const fadeDuration = config && config.fadeDuration ? config.fadeDuration : 2000;

        // init screen
        const oldElem = Transition.initViewport(viewport, newElem);

        // old target
        let oldTransitionTarget: TransitionTarget = null;
        if (!start && 0 !== fadeDuration) {
            oldTransitionTarget = {
                $element: $(oldElem),
                fade: Transition.createFadeProperty(1.0, 0.0),
                transform: Transition.createHardwareAcceleratorProperty(oldElem),
            };
        }

        // new transition properties
        let newFadeProp = null, newTrasformProp = null;
        if (0 !== fadeDuration) {
            newFadeProp = Transition.createFadeProperty(0.3, 1.0);
        }

        switch (type) {
            case "zoomout":
                newTrasformProp = Transition.createTransformProperty(scale, 0, 0, 1.0, 0, 0);
                break;
            case "zoomin":
                newTrasformProp = Transition.createTransformProperty(1.0, 0, 0, scale, 0, 0);
                break;
            case "slideright":
                newTrasformProp = Transition.createTransformProperty(scale, -offsetX, offsetY, scale, offsetX, 0);
                break;
            case "slideleft":
                newTrasformProp = Transition.createTransformProperty(scale, offsetX, offsetY, scale, -offsetX, 0);
                break;
            default:
                break;
        }

        // new target
        const newTransitionTarget: TransitionTarget = {
            $element: $(newElem),
            fade: newFadeProp,
            transform: newTrasformProp,
        };

        // transition setting.
        const transitionSettings: TransitionSettings = {
            viewport: viewport,
            oldTarget: oldTransitionTarget,
            newTarget: newTransitionTarget,
            fadeDuration: fadeDuration,
            transformDuration: transformDuration,
            focusDuration: focusDuration,
        };

        return transitionSettings;
    }

    /**
     * Fade in and zooom out with fixed screen size transition (inscribed).
     *
     * @private
     * @param {Object} viewport element where the image will be shown.
     * @param {Object} dom element that will be animated.
     * @param {Object} config options.
     * @param {Boolean} true: start content.
     * @return {Object} TransitionSettings object.
     */
    public static fixedFadeInZoomOutInscribed(viewport: JQuery, newElem: JQuery, config: any, start: boolean): TransitionSettings {
        return Transition.fixedFadeInZoomOutCommon(viewport, newElem, config, start,
            (viewW: number, viewH: number, imgW: number, imgH: number): number => {
                let fixedScale = 1.0;
                if (0 !== imgW && 0 !== imgH) {
                    if (imgH <= imgW) {
                        fixedScale = viewW / imgW;
                    } else {
                        fixedScale = viewH / imgH;
                    }
                } else {
                    console.error(TAG + "invalid image size.");
                }
                return fixedScale;
            });
    }

    /**
     * Fade in and zooom out with fixed screen size transition (circumscribed).
     *
     * @private
     * @param {Object} viewport element where the image will be shown.
     * @param {Object} dom element that will be animated.
     * @param {Object} config options.
     * @param {Boolean} true: start content.
     * @return {Object} TransitionSettings object.
     */
    public static fixedFadeInZoomOutCircumscribed(viewport: JQuery, newElem: JQuery, config: any, start: boolean): TransitionSettings {
        return Transition.fixedFadeInZoomOutCommon(viewport, newElem, config, start,
            (viewW: number, viewH: number, imgW: number, imgH: number): number => {
                let fixedScale = 1.0;
                if (0 !== imgW && 0 !== imgH) {
                    if (imgH <= imgW) {
                        fixedScale = viewH / imgH;
                    } else {
                        fixedScale = viewW / imgW;
                    }
                } else {
                    console.error(TAG + "invalid image size.");
                }
                return fixedScale;
            });
    }

    /**
     * Fade in and zooom out with fixed screen size transition (inscribed).
     *
     * @private
     * @param {Object} viewport element where the image will be shown.
     * @param {Object} dom element that will be animated.
     * @param {Object} config options.
     * @param {Boolean} true: start content.
     * @return {Object} TransitionSettings object.
     */
    private static fixedFadeInZoomOutCommon(viewport: JQuery, newElem: JQuery, config: any, start: boolean,
        compare: (viewW: number, viewH: number, imgW: number, imgH: number) => number): TransitionSettings {
        // config settings
        const scale = config && config.scale ? config.scale : 1.25;
        const duration = config && config.duration ? config.duration : 5000;
        const focusDuration = config && config.focusDuration ? config.focusDuration : 0;
        const transformDuration = config && config.transformDuration ? config.transformDuration : duration;
        const fadeDuration = config && config.fadeDuration ? config.fadeDuration : 2500;

        // init screen
        const oldElem = Transition.initViewport(viewport, newElem);

        // old target
        let oldTransitionTarget: TransitionTarget = null;
        if (!start) {
            oldTransitionTarget = {
                $element: $(oldElem),
                fade: Transition.createFadeProperty(1.0, 0.0),
                transform: Transition.createHardwareAcceleratorProperty(oldElem),
            };
        }

        // calcurate new element transform property
        const viewportWidth = $(viewport).width();
        const viewportHeight = $(viewport).height();
        const imgWidth = $(newElem).find("img").first().width();
        const imgHeight = $(newElem).find("img").first().height();
        const fixedScale = compare(viewportWidth, viewportHeight, imgWidth, imgHeight);

        // new target
        const newTransitionTarget: TransitionTarget = {
            $element: $(newElem),
            fade: Transition.createFadeProperty(0.3, 1.0),
            transform: Transition.createTransformProperty(fixedScale * scale, 0, 0, fixedScale, 0, 0),
        };

        // transition setting.
        const transitionSettings: TransitionSettings = {
            viewport: viewport,
            oldTarget: oldTransitionTarget,
            newTarget: newTransitionTarget,
            fadeDuration: fadeDuration,
            transformDuration: transformDuration,
            focusDuration: focusDuration,
        };

        return transitionSettings;
    }

    /**
     * Custom effect transition.
     *
     * @private
     * @param {Object} viewport element where the image will be shown.
     * @param {Object} dom element that will be animated.
     * @param {Object} config options.
     * @param {Boolean} true: start content.
     * @return {Object} TransitionSettings object.
     */
    public static customEffect(viewport: JQuery, newElem: JQuery, config: any, start: boolean): TransitionSettings {
        // config settings
        let oldEndScale = config && config.oldEndScale ? config.oldEndScale : null;              // null: mean keep old value.
        let oldEndOffsetX = config && config.oldEndOffsetX ? config.oldEndOffsetX : null;        // null: mean keep old value.
        let oldEndOffsetY = config && config.oldEndOffsetY ? config.oldEndOffsetY : null;        // null: mean keep old value.

        let newStartScale = config && config.newStartScale ? config.newStartScale : -1.0;        // -1: mean use fixed scale.
        const newStartOffsetX = config && config.newStartOffsetY ? config.newStartOffsetY : 0;
        const newStartOffsetY = config && config.newStartOffsetY ? config.newStartOffsetY : 0;
        const newStartOpacity = config && config.newEndOpacity ? config.newEndOpacity : 0.3;

        let newEndScale = config && config.newEndScale ? config.newEndScale : -1.25;            // -1: mean use fixed scale.
        const newEndOffsetX = config && config.newEndOffsetX ? config.newEndOffsetX : 0;
        const newEndOpacity = config && config.newEndOpacity ? config.newEndOpacity : 1.0;
        let fixedScale = 1.0;

        const duration = config && config.duration ? config.duration : 4000;
        const focusDuration = config && config.focusDuration ? config.focusDuration : 0;
        const transformDuration = config && config.transformDuration ? config.transformDuration : duration;
        const transformTimingFunction = config && config.transformTimingFunction ? config.fadeTimingFunction : "ease-out";
        const fadeDuration = config && config.fadeDuration ? config.fadeDuration : Math.floor(transformDuration / 2);
        const fadeTimingFunction = config && config.fadeTimingFunction ? config.fadeTimingFunction : "linear";

        // calcurate image fixed screen scale, if needed.
        if (newStartScale < 0 || newEndScale < 0) {
            const viewportWidth = $(viewport).width();
            const viewportHeight = $(viewport).height();
            const imgWidth = $(newElem).find("img").first().width();
            const imgHeight = $(newElem).find("img").first().height();

            if (0 !== imgWidth && 0 !== imgHeight) {
                if (viewportHeight <= viewportWidth) {
                    fixedScale = viewportWidth / imgWidth;
                } else {
                    fixedScale = viewportHeight / imgHeight;
                }
            } else {
                console.error(TAG + "invalid image size.");
            }

            newStartScale = Math.abs(newStartScale);
            newEndScale = Math.abs(newEndScale);
        }

        // init screen
        const oldElem = Transition.initViewport(viewport, newElem);

        // old target
        let oldTransitionTarget: TransitionTarget = null;
        if (!start) {
            const currOpacity = parseInt($(oldElem).css("opacity"), 10);
            const currX = CSS.getCssMatrixValue($(oldElem), "translateX");
            const currY = CSS.getCssMatrixValue($(oldElem), "translateY");
            const currScale = CSS.getCssMatrixValue($(oldElem), "scaleX");
            if (null == oldEndScale) {
                oldEndScale = currScale;
            }
            if (null == oldEndOffsetX) {
                oldEndOffsetX = currX;
            }
            if (null == oldEndOffsetY) {
                oldEndOffsetY = currY;
            }
            oldTransitionTarget = {
                $element: $(oldElem),
                fade: Transition.createFadeProperty(currOpacity, oldEndScale),
                transform: Transition.createTransformProperty(currScale, currX, currY, oldEndScale, oldEndOffsetX, oldEndOffsetY),
            };
        }

        // new target
        const newTransitionTarget: TransitionTarget = {
            $element: $(newElem),
            fade: Transition.createFadeProperty(newStartOpacity, newEndOpacity),
            transform: Transition.createTransformProperty(fixedScale * newStartScale, newStartOffsetX, newStartOffsetY,
                fixedScale * newEndScale, newEndOffsetX, newStartOffsetY),
        };

        // transition setting.
        const transitionSettings: TransitionSettings = {
            viewport: viewport,
            oldTarget: oldTransitionTarget,
            newTarget: newTransitionTarget,
            transformDuration: transformDuration,
            transformTimingFunction: transformTimingFunction,
            fadeDuration: fadeDuration,
            fadeTimingFunction: fadeTimingFunction,
            focusDuration: focusDuration,
        };

        return transitionSettings;
    }

    /**
     * Start animation common API.
     * If browser doesn"t support css transition, fall back to use jQuery animation.
     *
     * @private
     * @param  {Object} TransitionSettings object.
     * @return jQueryPromise object.
     */
    public static startEffect(settings: TransitionSettings): JQueryPromise<any> {
        if (CSS.isTransitionSupported) {
            return Transition.startEffectByCssTransition(settings);
        } else {
            return Transition.startEffectByTimerAnimation(settings);
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // private static methods

    /**
     * Initialize view port for transition.
     *
     * @private
     * @param  {Object} viewport element where the image will be shown.
     * @param  {Object} dom element that will be animated.
     * @param  {Function} function callback.
     * @param  {Object} config options.
     * @return {Object} old element jQuery object.
     */
    private static initViewport(viewport: JQuery, newElem: JQuery): JQuery {
        // init element
        const oldElem = $(viewport).children(":first");

        $(oldElem).css(CSS.cssHideBackFace);
        $(newElem).css(CSS.cssHideBackFace);
        CSS.clearTransitions(oldElem);
        CSS.clearTransitions(newElem);


        const cssProperties = {
            position: "absolute",
            top: "0px",
            left: "0px",
            right: "0px",
            bottom: "0px",
            visibility: "hidden",
        };
        $(newElem).css(cssProperties);
        $(viewport).append(newElem);

        return oldElem;
    }

    /**
     * Create fade transition property object.
     *
     * @private
     * @param  {Number} start opacity value.
     * @param  {Number} end opacity value.
     * @return {Object} TransitionProperty object.
     */
    private static createFadeProperty(opacityStart: number, opacityEnd: number): TransitionProperty {
        const fadeProp: TransitionProperty = {
            start: { opacity: (opacityStart).toString(10) },
            end: { opacity: (opacityEnd).toString(10) },
        };
        return fadeProp;
    }

    /**
     * Create transform transition property object.
     *
     * @private
     * @param  {Number} start scale value.
     * @param  {Number} start translate x value.
     * @param  {Number} start translate y value.
     * @param  {Number} end scale value.
     * @param  {Number} end translate x value.
     * @param  {Number} end translate y value.
     * @return {Object} TransitionProperty object.
     */
    private static createTransformProperty(scaleStart: number, traslateXStart: number, translateYStart: number,
        scaleEnd: number, traslateXEnd: number, translateYEnd: number): TransitionProperty {
        const transformStart = {};
        const transformEnd = {};
        let transformsPropertiesStart = "";
        let transformsPropertiesEnd = "";

        transformsPropertiesStart = CSS.buildCssTransformString(scaleStart, traslateXStart, translateYStart);
        transformsPropertiesEnd = CSS.buildCssTransformString(scaleEnd, traslateXEnd, translateYEnd);

        for (let i = 0; i < CSS.cssPrefixes.length; i++) {
            transformStart[CSS.cssPrefixes[i] + "transform"] = transformsPropertiesStart;
            transformEnd[CSS.cssPrefixes[i] + "transform"] = transformsPropertiesEnd;
        }

        const transformProp: TransitionProperty = {
            start: transformStart,
            end: transformEnd,
        };

        return transformProp;
    }

    /**
     * Create property object for Hardware Accelerator.
     *
     * @private
     * @param {Object} dom element that will be animated.
     * @return TransitionProperty object.
     */
    private static createHardwareAcceleratorProperty(element?: JQuery): TransitionProperty {
        if (null == element) {
            return Transition.createTransformProperty(1.0, 0, 0, 1.0, 0, 0);
        } else {
            const currX = CSS.getCssMatrixValue($(element), "translateX");
            const currY = CSS.getCssMatrixValue($(element), "translateY");
            const currScale = CSS.getCssMatrixValue($(element), "scaleX");
            return Transition.createTransformProperty(currScale, currX, currY, currScale, currX, currY);
        }
    }

    /**
     * startEffect() helper API.
     * implemented by css transtion property.
     *
     * @private
     * @param  {Object} TransitionSettings object.
     * @return jQueryPromise object.
     */
    private static startEffectByCssTransition(settings: TransitionSettings): JQueryPromise<any> {
        const df = $.Deferred();

        let countTransitionEndFired = 0;
        const enableFade = (0 < settings.fadeDuration);
        const enableTransform = (0 < settings.transformDuration);

        if (enableFade) {
            countTransitionEndFired++;
        }
        if (enableTransform) {
            countTransitionEndFired++;
        }
        if (0 === countTransitionEndFired) {
            console.error(TAG + "no transtion setting.");
            return df.reject();
        }

        Transition.setTransitionProperty(settings.oldTarget, "start");
        Transition.setTransitionProperty(settings.newTarget, "start");

        let eventReceived = 0;
        const transitionEndHandler = (event: any) => {
            eventReceived++;
            if (countTransitionEndFired <= eventReceived) {
                df.resolve();
            }
        };

        setTimeout(() => {
            Transition.setTransitionProperty(settings.oldTarget, "end");
            Transition.setTransitionProperty(settings.newTarget, "end").on(CSS.transitionEnd, transitionEndHandler);

            const elemTransitions = {};
            for (let i = 0; i < CSS.cssPrefixes.length; i++) {
                const secondsFadeDuration = (settings.fadeDuration / 1000) + "s";
                const secondsTransformDuration = (settings.transformDuration / 1000) + "s";
                elemTransitions[CSS.cssPrefixes[i] + "transition"] = "";
                if (enableFade) {
                    const fadePropertyString = "opacity" + " " + secondsFadeDuration +
                        ((settings.fadeTimingFunction) ? (" " + settings.fadeTimingFunction) : " linear");
                    elemTransitions[CSS.cssPrefixes[i] + "transition"] += fadePropertyString;
                }
                if (enableTransform) {
                    if (elemTransitions[CSS.cssPrefixes[i] + "transition"] !== "") {
                        elemTransitions[CSS.cssPrefixes[i] + "transition"] += ",";
                    }
                    const transformPropertyString = CSS.cssPrefixes[i] + "transform" + " " + secondsTransformDuration +
                        ((settings.transformTimingFunction) ? (" " + settings.transformTimingFunction) : " linear");
                    elemTransitions[CSS.cssPrefixes[i] + "transition"] += transformPropertyString;
                }
            }
            if (!!settings.oldTarget && !!settings.oldTarget.$element) {
                settings.oldTarget.$element.css(elemTransitions);
            }
            if (!!settings.newTarget && !!settings.newTarget.$element) {
                settings.newTarget.$element.css(elemTransitions).css("visibility", "visible");
            }
        }, 100);

        return df.promise();
    }

    /**
     * startEffect() helper API.
     * implemented by jQuery animation.
     *
     * @private
     * @param  {Object} TransitionSettings object.
     * @return jQueryPromise object.
     */
    private static startEffectByTimerAnimation(settings: TransitionSettings): JQueryPromise<any> {
        const df = $.Deferred();

        Transition.setTransitionProperty(settings.oldTarget, "start");
        Transition.setTransitionProperty(settings.newTarget, "start");

        const prmsOld = TimerAnimationInfo.start(settings.oldTarget, settings.fadeDuration, settings.transformDuration);
        const prmsNew = TimerAnimationInfo.start(settings.newTarget, settings.fadeDuration, settings.transformDuration);

        $.when(prmsOld, prmsNew)
            .done(() => {
                df.resolve();
            })
            .fail(() => {
                console.error(TAG + "failed timer animation.");
                df.reject();
            });

        return df.promise();
    }

    /**
     * Set css properties to target.
     *
     * @private
     * @param  {Object} TransitionTarget object.
     * @param  {String} point of transtion identifier. {"start"/"end"}
     * @return {Object} Target jQuery object.
     */
    private static setTransitionProperty(target: TransitionTarget, point: string): JQuery {
        if (!target || !target.$element) {
            return null;
        }
        switch (point) {
            case "start":
                if (target.fade && target.fade.start) {
                    target.$element.css(target.fade.start);
                }
                if (target.transform && target.transform.start) {
                    target.$element.css(target.transform.start);
                }
                break;
            case "end":
                if (target.fade && target.fade.end) {
                    target.$element.css(target.fade.end);
                }
                if (target.transform && target.transform.end) {
                    target.$element.css(target.transform.end);
                }
                break;
            default:
                console.error(TAG + "no support point identifier. : " + point);
                return null;
        }
        return target.$element;
    }
}
