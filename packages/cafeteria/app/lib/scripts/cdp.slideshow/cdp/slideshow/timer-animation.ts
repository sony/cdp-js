/* tslint:disable:max-line-length */

import * as $ from "jquery";
import CSS from "../tools/css";
import {
    TimerAnimationParam,
    TransitionTarget,
} from "./interfaces";

const TAG = "[CDP.SlideShow.TimerAnimation] ";

/**
 * @class TimerAnimationInfo
 * @brief Slide Show internal class.
 */
export default class TimerAnimationInfo {
    //! constructor
    constructor(private _enableFade: boolean,
        private _opacity: TimerAnimationParam,
        private _enableTransform: boolean,
        private _scaleX: TimerAnimationParam,
        private _scaleY: TimerAnimationParam,
        private _translateX: TimerAnimationParam,
        private _translateY: TimerAnimationParam,
        private _cssPrefixes: any) {
    }

    //! accesser : fade
    getFadeProperty(rev: number): any {
        if (!this._enableFade) {
            return -1;    // for ignore mark.
        }

        let opacity = this._opacity.start + rev * this._opacity.distance;
        if (this._opacity.start < this._opacity.end) {
            if (this._opacity.end < opacity) {
                opacity = this._opacity.end;
            }
        } else {
            if (this._opacity.end > opacity) {
                opacity = this._opacity.end;
            }
        }
        return opacity;
    }

    //! accesser : transform
    getTransformProperty(rev: number): any {
        if (!this._enableTransform) {
            return false;
        }

        let scaleRevX = this._scaleX.start + rev * this._scaleX.distance;
        if (this._scaleX.start < this._scaleX.end) {
            if (this._scaleX.end < scaleRevX) {
                scaleRevX = this._scaleX.end;
            }
        } else {
            if (this._scaleX.end > scaleRevX) {
                scaleRevX = this._scaleX.end;
            }
        }

        let scaleRevY = this._scaleY.start + rev * this._scaleY.distance;
        if (this._scaleY.start < this._scaleY.end) {
            if (this._scaleY.end < scaleRevY) {
                scaleRevY = this._scaleY.end;
            }
        } else {
            if (this._scaleY.end > scaleRevY) {
                scaleRevY = this._scaleY.end;
            }
        }

        let translateRevX = this._translateX.start + Math.floor(rev * this._translateX.distance);
        if (this._translateX.start < this._translateX.end) {
            if (this._translateX.end < translateRevX) {
                translateRevX = this._translateX.end;
            }
        } else {
            if (this._translateX.end > translateRevX) {
                translateRevX = this._translateX.end;
            }
        }

        let translateRevY = this._translateY.start + Math.floor(rev * this._translateY.distance);
        if (this._translateY.start < this._translateY.end) {
            if (this._translateY.end < translateRevY) {
                translateRevY = this._translateY.end;
            }
        } else {
            if (this._translateY.end > translateRevY) {
                translateRevY = this._translateY.end;
            }
        }

        const transformsProperties = "scale(" + scaleRevX + "," + scaleRevY + ") " + "translate(" + translateRevX + "px," + translateRevY + "px)";
        const transform = {};
        for (let i = 0; i < this._cssPrefixes.length; i++) {
            transform[this._cssPrefixes[i] + "transform"] = transformsProperties;
        }

        return transform;
    }

    /**
     * Start timer animation.
     *
     * @private
     * @param  {Object} TransitionTarget object.
     * @param  {Number} fade duration.
     * @param  {Number} transform duration.
     */
    static start(target: TransitionTarget, fadeDuration: number, trasformDuration: number): JQueryPromise<any> {
        const df = $.Deferred();

        if (null == fadeDuration) {
            fadeDuration = 0;
        }
        if (null == trasformDuration) {
            trasformDuration = 0;
        }

        const duration = (fadeDuration <= trasformDuration) ? trasformDuration : fadeDuration;

        if (!target || !target.$element || duration <= 0) {
            return df.resolve();
        }

        const param = TimerAnimationInfo.createTimerAnimationInfo(target, fadeDuration, trasformDuration);
        if (!param) {
            return df.resolve();
        }

        const complete = () => {
            df.resolve();
        };

        const step = (now, fx) => {
            if ("transform" === fx.prop) {
                const transform = fx.end.info.getTransformProperty(fx.pos);
                if (transform) {
                    $(fx.elem).css(transform);
                }
            }
            if ("fade" === fx.prop) {
                const fade = fx.end.info.getFadeProperty(fx.pos);
                if (0 <= fade) {
                    $(fx.elem).css("opacity", fade);
                }
            }
        };

        target.$element.animate(param, {
            duration: duration,
            easing: "linear",
            complete: complete,
            step: step,
        });

        return df.promise();
    }

    /**
     * Create timer animation information object.
     *
     * @private
     * @param  {Object} TransitionTarget object.
     * @param  {Number} fade duration.
     * @param  {Number} transform duration.
     * @return {Object} TimerAnimationInfo object.
     */
    private static createTimerAnimationInfo(target: TransitionTarget, fadeDuration: number, transformDuration: number): any {
        let scaleStartX = 1.0;
        let scaleStartY = 1.0;
        let translateStartX = 0;
        let translateStartY = 0;
        let opacityStart = 1.0;

        let scaleEndX = 1.0;
        let scaleEndY = 1.0;
        let translateEndX = 0;
        let translateEndY = 0;
        let opacityEnd = 1.0;

        let scaleDistanceX = 0.0;
        let scaleDistanceY = 0.0;
        let translateDistanceX = 0.0;
        let translateDistanceY = 0.0;
        let opacityDistance = 0.0;

        let fadeVelocity = 1.0;
        let transformVelocity = 1.0;
        if (0 < fadeDuration && 0 < transformDuration && fadeDuration !== transformDuration) {
            if (fadeDuration < transformDuration) {
                fadeVelocity = transformDuration / fadeDuration;
            } else {
                transformVelocity = fadeDuration / transformDuration;
            }
        }

        if (!!target.transform) {
            const start = (!!target.transform.start && !!target.transform.start.transform) ? target.transform.start.transform : "";
            const end = (!!target.transform.end && !!target.transform.end.transform) ? target.transform.end.transform : "";

            const scaleStartInfo = start.match(/scale\(..*,..*\)/);
            if (!!scaleStartInfo && scaleStartInfo[0]) {
                scaleStartX = 1 * scaleStartInfo[0].substring(scaleStartInfo[0].indexOf("(") + 1, scaleStartInfo[0].indexOf(","));
                scaleStartY = 1 * scaleStartInfo[0].substring(scaleStartInfo[0].indexOf(",") + 1, scaleStartInfo[0].indexOf(")"));
            }

            const scaleEndInfo = end.match(/scale\(..*,..*\)/);
            if (!!scaleEndInfo && scaleEndInfo[0]) {
                scaleEndX = 1 * scaleEndInfo[0].substring(scaleEndInfo[0].indexOf("(") + 1, scaleEndInfo[0].indexOf(","));
                scaleEndY = 1 * scaleEndInfo[0].substring(scaleEndInfo[0].indexOf(",") + 1, scaleEndInfo[0].indexOf(")"));
            }

            if ((null != scaleStartX) && (null != scaleEndX)) {
                scaleDistanceX = (scaleEndX - scaleStartX) * transformVelocity;
            }

            if ((null != scaleStartY) && (null != scaleEndY)) {
                scaleDistanceY = (scaleEndY - scaleStartY) * transformVelocity;
            }

            let translateWork = null;
            const translateStart = start.match(/translate\(..*,..*\)/);
            if (!!translateStart && translateStart[0]) {
                translateWork = translateStart[0].replace(/px/g, "");
                translateStartX = 1 * translateWork.substring(translateWork.indexOf("(") + 1, translateWork.indexOf(","));
                translateStartY = 1 * translateWork.substring(translateWork.indexOf(",") + 1, translateWork.indexOf(")"));
            }

            const translateEnd = end.match(/translate\(..*,..*\)/);
            if (!!translateEnd && translateEnd[0]) {
                translateWork = translateEnd[0].replace(/px/g, "");
                translateEndX = 1 * translateWork.substring(translateWork.indexOf("(") + 1, translateWork.indexOf(","));
                translateEndY = 1 * translateWork.substring(translateWork.indexOf(",") + 1, translateWork.indexOf(")"));
            }

            if ((null != translateStartX) && (null != translateEndX)) {
                translateDistanceX = (translateEndX - translateStartX) * transformVelocity;
            }

            if ((null != translateStartY) && (null != translateEndY)) {
                translateDistanceY = (translateEndY - translateStartY) * transformVelocity;
            }
        }

        if (!!target.fade) {
            if (!!target.fade.start) {
                opacityStart = 1 * target.fade.start.opacity;
            }
            if (!!target.fade.end) {
                opacityEnd = 1 * target.fade.end.opacity;
                opacityDistance = (opacityEnd - opacityStart) * fadeVelocity;
            }
        }

        const info = new TimerAnimationInfo(
            !!target.fade,
            { start: opacityStart, end: opacityEnd, distance: opacityDistance },
            !!target.transform,
            { start: scaleStartX, end: scaleEndX, distance: scaleDistanceX },
            { start: scaleStartY, end: scaleEndY, distance: scaleDistanceY },
            { start: translateStartX, end: translateEndX, distance: translateDistanceX },
            { start: translateStartY, end: translateEndY, distance: translateDistanceY },
            CSS.cssPrefixes
        );

        return {
            fade: { info: info },
            transform: { info: info },
        };
    }
}
