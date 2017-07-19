/* tslint:disable:no-string-literal max-line-length */

import * as $ from "jquery";
import CSS from "../tools/css";
import {
    PropertyAccesser,
} from "../tools/cursor-array";
import {
    InfinityContainer,
} from "../tools/infinity-container";
import {
    Touch,
    touchEvent,
} from "../tools/touch";
import {
    TransitionSettings,
} from "./interfaces";
import Transition from "./transition";

const TAG = "[CDP.SlideShow.Player] ";

// re-export
export { PropertyAccesser, InfinityContainer, CSS };

/**
 * @class _Config
 * @brief config parameters for development.
 */
module _Config {
    export const ENABLE_TOUCH_LOG = false;    // for touch event trace.
    export const EXEC_STEP_DELAY_TIME = 100;    // step up/down timeout
}

//___________________________________________________________________________________________________________________//

///////////////////////////////////////////////////////////////////////
// closure methods

// event logger for touch event
function touchEventLog(msg: string): void {
    if (_Config.ENABLE_TOUCH_LOG) {
        console.log(TAG + msg);
    }
}

//___________________________________________________________________________________________________________________//

/**
 * @class Player
 * @brief Slide Show core logic.
 */
export class Player {
    private static DATA_IMG_LOAD_SUCCEEDED = "data-image-load-succeeded";
    private static DATA_IMG_LOAD_FAILED = "data-image-load-faild";

    private static _defaultOptions = {
        // SlideShow settings.
        preloadCount: 4,                                                        //< {Number} number of images to preload.
        enableTouch: true,                                                        //< {Boolean} true: enable screen touch event handing. / false: no reaction.
        showFirstImageImmediately: true,                                        //< {Boolean}  first image showing when initialize finished.
        setSpinnerCallback: null,                                                //< {Function} callback when need to show spinner div. (viewport: JQuery, element: HTMLElement).
        stateChangedCallback: function (event: string, info: any) { /*noop*/ },    //< {Function} callback when slideshow state changed.
        // event: "state:playback-image-changed", info: content index.
        //        "state:play-state-changed", info: play state.
        //        "error:max-error-count", info: undefined.

        // InfinityContainer settings.
        propAccesser: null,
        globalContainerMax: null,
        localContainerMax: null,
        setupContainer: null,
        repeat: false,
        firstContainerStart: 0,
        firstContainerEnd: null,    // always override.
        firstContainerPosition: 0,
        allowedErrorMax: 100,        //< maximum error count. add 2014/02/17
    };

    private _settings: any = null;

    private _imgContainer: InfinityContainer = null;
    private _preloadImages: any = null;
    private _preloadCanceler: any = null;
    private _$viewport: JQuery = null;
    private _transitionList: any[] = [];
    private _trIndx: number;

    private _isPlaying: boolean = false;
    private _isTransitioning: boolean = false;
    private _isDragStarted: boolean = false;
    private _isPinching: boolean = false;
    private _snapDuration: number;
    private _currentScale: number;
    private _currentTranslateX: number;
    private _currentTranslateY: number;

    private _errorCount: number = 0;    //< error counter. add 2014/02/17

    // used on sidepeek mode only
    private _rightImage: HTMLElement = null;
    private _leftImage: HTMLElement = null;

    private _promise: JQueryDeferred<any> = null;
    private _resizeHandler: (event: JQuery.Event) => any = null;


    /**
     * Initialize
     *
     * @param  {Object} image data
     * @param  {Array} transition list
     * @param  {Object} viewport element
     * @param  {Object} setting option
     * @return {Object} jQueryPromise object.
     */
    init(imageData: any[], transitionList: any[], viewport: JQuery, options?: any): JQueryPromise<any> {
        const df = $.Deferred();

        // setup settings
        this._settings = $.extend({}, Player._defaultOptions, options);

        this._imgContainer = new InfinityContainer();

        this._trIndx = 0;
        this._errorCount = 0;
        this._snapDuration = 200;
        this._isPlaying = false;
        this._isTransitioning = false;
        this._isDragStarted = false;
        this._rightImage = null;
        this._leftImage = null;
        this._isPinching = false;
        this._currentTranslateX = 0;
        this._currentTranslateY = 0;
        this._currentScale = 1;
        this._transitionList = transitionList;
        this._$viewport = viewport;
        this._preloadImages = {};
        this._preloadCanceler = {};

        this._resizeHandler = this.resizeImages.bind(this);
        // resize event bind.
        $(window).on("resize", this._resizeHandler);

        this._imgContainer.init(imageData, options)
            .then(() => {

                // touch有効なときのみ、targetを指定する必要あり。
                // 中でpreventDefaultをcallしているため。
                if (this._settings.enableTouch) {
                    Touch.setTarget(this._$viewport);
                }
                this.subscribeToEvents();
                return this.initPreloadedImages();
            })
            .then(() => {
                if (this._settings.showFirstImageImmediately) {
                    return this.showCurrentImage();
                }
            })
            .then(() => {
                df.resolve();
            })
            .fail(() => {
                console.error(TAG + "Player.init(), failed.");
                df.resolve();
            });

        return this.managePromise(df);
    }

    /**
     * Terminate SlideShow object.
     *
     */
    terminate(): void {
        if (this._isPlaying) {
            this.notifyStateChanged("state:play-state-changed", this._isPlaying);
        }

        Touch.removeTarget(this._$viewport); // [NOTE]: 以下のoffでevent handlerをunbindしているので不要かも
        (this._$viewport).off();

        this.cleanViewPort(this._$viewport);
        this._$viewport.children().remove();

        for (const key in this._preloadImages) {
            if ("outerleft" !== key && "outerright" !== key) {
                this.deletePreloadedImage(<any>key);
            }
        }

        $(window).off("resize", this._resizeHandler);

        this._isPlaying = false;
        this._isTransitioning = false;
        this._isDragStarted = false;
        this._rightImage = null;
        this._leftImage = null;
        this._isPinching = false;
        this._preloadImages = {};
        this._preloadCanceler = {};
        this._imgContainer = null;
        this._transitionList = [];
        this._$viewport = null;
    }

    /**
     * Validate this SlideShow object.
     *
     * @return {Boolean} true: valid / false: invalid.
     */
    valid(): boolean {
        if (!this._imgContainer) {
            return false;
        }
        return this._imgContainer.valid();
    }

    /**
     * Check async loading method.
     *
     * @return {Boolean} true: now loading / false: idle.
     */
    isLoading(): boolean {
        if (!this.valid()) {
            return false;
        }
        return this._imgContainer.isInAsyncProc();
    }

    /**
     * Wait load condition.
     *
     * @return {Object} jQueryPromise object.
     */
    waitLoadComplete(): JQueryPromise<any> {
        if (!this.valid()) {
            return $.Deferred().resolve();
        }
        return this._imgContainer.waitAsyncProc();
    }

    /**
     * Returns viewport element.
     *
     * @return {Object} jQuery object.
     */
    getViewport(): JQuery {
        return this._$viewport;
    }

    /**
     * Returns current image index.
     *
     * @return {Number} index.
     */
    getCurrentImageIndex(): number {
        if (!this.valid()) {
            return 0;
        }
        return this._imgContainer.getIndex();
    }

    /**
     * Set current image index.
     *
     * @param  {Number} index.
     * @return {Object} jQueryPromise object.
     */
    setCurrentImageIndex(index: number): JQueryPromise<any> {
        if (!this.valid()) {
            return $.Deferred().reject();
        }

        const df = $.Deferred();

        this._isPlaying = false;
        this.notifyStateChanged("state:play-state-changed", this._isPlaying);

        this.cleanViewPort(this._$viewport);

        this._imgContainer.seek(index).promise
            .then(() => {
                this.cleanViewPort(this._$viewport);
                return this.initPreloadedImages();
            })
            .then(() => {
                return this.showCurrentImage();
            })
            .then(() => {
                this.notifyStateChanged("state:playback-image-changed", this._imgContainer.getIndex());
                df.resolve();
            })
            .fail(() => {
                console.error(TAG + "setCurrentImageIndex() failed.");
                df.reject();
            });

        return this.managePromise(df);
    }

    /**
     * Returns current image array element.
     *
     * @return {Object} current data.
     */
    getCurrentImageData(): any {
        if (!this.valid()) {
            return 0;
        }
        const cursor = this._imgContainer.getCurrentCursorArray();
        return cursor.getData();
    }

    /**
     * Remove current image array element.
     *
     * @return {Object} jQueryPromise object.
     */
    removeCurrentImage(): JQueryPromise<any> {
        const df = $.Deferred();

        if (!this.valid()) {
            return df.reject();
        } else if (this._isPlaying) {
            console.error(TAG + "cannot call removeCurrentImage() when playing.");
            return df.reject();
        }

        if (!this._imgContainer.remove()) {
            console.error(TAG + "this._imgContainer.remove() failed.");
            return df.reject();
        } else if (this._imgContainer.size() <= 0) {
            df.resolve();
        } else {
            this._imgContainer.waitAsyncProc()
                .then(() => {
                    this.cleanViewPort(this._$viewport);
                    return this.initPreloadedImages();
                })
                .then(() => {
                    return this.showCurrentImage();
                })
                .then(() => {
                    this.notifyStateChanged("state:playback-image-changed", this._imgContainer.getIndex());
                    df.resolve();
                })
                .fail(() => {
                    console.error(TAG + "removeCurrentImage() failed.");
                    df.reject();
                });
        }

        return this.managePromise(df);
    }

    /**
     * Returns image data array length.
     *
     * @return {Number} data size.
     */
    getImageDataCount(): number {
        if (!this.valid()) {
            return 0;
        }
        return this._imgContainer.size();
    }

    /**
     * Returns image data raw container object.
     * advanced method.
     *
     * @return {Object} InfinityContainer object.
     */
    getImageDataContainer(): InfinityContainer {
        if (!this.valid()) {
            return null;
        }
        return this._imgContainer;
    }

    /**
     * Returns if slideshow is playing or not.
     *
     * @return {Boolean} true: playing / false: stopped.
     */
    isPlaying(): boolean {
        return this._isPlaying;
    }

    /**
     * Pause slideshow and shows next image.
     *
     * @param {Object} current element.
     * @param {Function} callback.
     * @param {Number} duration.
     */
    stepUp(currentElement?: JQuery, callbackStep?: () => void, durationOverride?: number): void {
        this.waitAsyncProc()
            .always(() => {
                if (this._isPlaying) {
                    this.pause();
                }

                const duration = (typeof durationOverride === "number") ? durationOverride : this._snapDuration;
                const currElem = currentElement || $(this._$viewport).children(":first");

                this.setSideImages(Transition.imageOffset);
                setTimeout(() => {
                    CSS.moveImage(0, 0, 1, 1, this._rightImage, duration, () => {
                        // clear references
                        CSS.clearTransformsTransitions(currElem);
                        CSS.clearTransformsTransitions(this._leftImage);
                        $(currElem).remove();
                        $(this._leftImage).remove();
                        this._leftImage = null;
                        this._rightImage = null;

                        // move next
                        this.moveNext()
                            .then(() => {
                                if (typeof callbackStep === "function") {
                                    callbackStep();
                                }
                                this.notifyStateChanged("state:playback-image-changed", this._imgContainer.getIndex());
                            }, () => {
                                console.error(TAG + "moveNext() failed in stepUp()");
                            });
                    });

                    const leftOffset = ($(this._$viewport).width() + Transition.imageOffset) * (-1);
                    CSS.moveImage(leftOffset, 0, 1, 1, currElem, duration);
                }, this._isTransitioning ? 0 : _Config.EXEC_STEP_DELAY_TIME);
            });
    }

    /**
     * Pause slideshow and shows previous image.
     *
     * @param {Object} current element
     * @param {Function} callback
     * @param {Number} duration
     */
    stepDown(currentElement?: JQuery, callbackStep?: () => void, durationOverride?: number): void {
        this.waitAsyncProc()
            .always(() => {
                if (this._isPlaying) {
                    this.pause();
                }

                const duration = (typeof durationOverride === "number") ? durationOverride : this._snapDuration;
                const currElem = currentElement || $(this._$viewport).children(":first");

                this.setSideImages(Transition.imageOffset);
                setTimeout(() => {
                    CSS.moveImage(0, 0, 1, 1, this._leftImage, duration, () => {
                        // clear references
                        CSS.clearTransformsTransitions(currElem);
                        CSS.clearTransformsTransitions(this._rightImage);
                        $(currElem).remove();
                        $(this._rightImage).remove();
                        this._leftImage = null;
                        this._rightImage = null;

                        // move previous
                        this.movePrevious()
                            .then(() => {
                                if (typeof callbackStep === "function") {
                                    callbackStep();
                                }
                                this.notifyStateChanged("state:playback-image-changed", this._imgContainer.getIndex());
                            }, () => {
                                console.error(TAG + "movePrevious() failed in stepDown()");
                            });
                    });

                    const rightOffset = $(this._$viewport).width() + Transition.imageOffset;
                    CSS.moveImage(rightOffset, 0, 1, 1, currElem, duration);
                }, this._isTransitioning ? 0 : _Config.EXEC_STEP_DELAY_TIME);
            });
    }

    /**
     * Plays slideshow, loops through images and transitions
     */
    play(): void {
        this.waitAsyncProc()
            .always(() => {
                if (this._isPlaying) {
                    return;
                }
                this._isPlaying = true;
                this.notifyStateChanged("state:play-state-changed", this._isPlaying);

                const transitionCall = (viewport, newElem, start?: boolean) => {
                    if (!this._isPlaying) {
                        return;
                    }
                    // call image callback as soon as it shows in the viewport
                    this.notifyStateChanged("state:playback-image-changed", this._imgContainer.getIndex());

                    // for first frame clean up.
                    if (!!start) {
                        this.cleanViewPort(viewport);
                    }

                    let settings = null;
                    switch (this._transitionList[this._trIndx].type) {
                        case "slidein":
                            settings = Transition.slideIn(viewport, newElem, this._transitionList[this._trIndx].config, start);
                            break;
                        case "fadein":
                            settings = Transition.fadeIn(viewport, newElem, this._transitionList[this._trIndx].config, start);
                            break;
                        case "kenburn":
                            settings = Transition.kenBurn(viewport, newElem, this._transitionList[this._trIndx].config, start);
                            break;
                        case "fixed-fadein-zoomout-inscribed":
                            settings = Transition.fixedFadeInZoomOutInscribed(viewport, newElem, this._transitionList[this._trIndx].config, start);
                            break;
                        case "fixed-fadein-zoomout-circumscribed":
                            settings = Transition.fixedFadeInZoomOutCircumscribed(viewport, newElem, this._transitionList[this._trIndx].config, start);
                            break;
                        case "custom-effect":
                            settings = Transition.customEffect(viewport, newElem, this._transitionList[this._trIndx].config, start);
                            break;
                        default:
                            console.warn(TAG + "unknown transition type: " + this._transitionList[this._trIndx].type);
                            settings = Transition.fadeIn(viewport, newElem, this._transitionList[this._trIndx].config, start);
                            break;
                    }

                    // for each callbacks, will need to adjust indeces and
                    // preload object first (moveNextTransition, moveNext) before
                    // calling transitionCall
                    this.transition(settings, () => {
                        if (!this._isPlaying) {
                            return;
                        } else if (this._imgContainer.isLast()) {
                            console.log(TAG + "reached last content.");
                            this.pause();
                            return;
                        }
                        this.moveNextTransition();
                        this.moveNext()
                            .then(() => {
                                this.waitForCurrentImageReady()
                                    .always(() => {
                                        transitionCall(viewport, $(this._preloadImages[this._imgContainer.getIndex()]).clone()[0]);
                                    });
                            }, () => {
                                console.error(TAG + "moveNext() failed in transitionCall() callback.");
                            });
                    });
                };

                // play from current image.
                this.waitForCurrentImageReady()
                    .always(() => {
                        transitionCall(this._$viewport, $(this._preloadImages[this._imgContainer.getIndex()]).clone()[0], true);
                    });
            });
    }

    /**
     * Stops transitions and resets the indeces.
     */
    stop(): JQueryPromise<any> {
        const df = $.Deferred();
        if (!this._isPlaying) {
            return df.resolve();
        }
        this._isPlaying = false;
        this.notifyStateChanged("state:play-state-changed", this._isPlaying);
        this._trIndx = 0;

        this._imgContainer.first().promise
            .then(() => {
                this.cleanViewPort(this._$viewport);
                return this.initPreloadedImages();
            })
            .then(() => {
                return this.showCurrentImage();
            })
            .then(() => {
                this.notifyStateChanged("state:playback-image-changed", this._imgContainer.getIndex());
                df.resolve();
            })
            .fail(() => {
                console.error(TAG + "stop() failed.");
                df.reject();
            });

        return this.managePromise(df);
    }

    /**
     * Stops transitions but do not reset indeces.
     */
    pause(): void {
        if (!this._isPlaying) {
            return;
        }
        this._isPlaying = false;
        this.notifyStateChanged("state:play-state-changed", this._isPlaying);

        this.cleanViewPort(this._$viewport);
        const firstChild = $(this._$viewport).children(":first");
        if (firstChild) {
            CSS.clearTransformsTransitions(firstChild);
        }
    }

    /**
     * Stops then play slideshow from beginning.
     */
    restart(): void {
        this.stop()
            .then(() => {
                this.play();
            }, () => {
                console.error(TAG + "stop() failed.");
            });
    }

    /**
     * Set touch event enable setting.
     *
     * @param {Boolean} true: enable / false: disable.
     */
    enableTouchEvent(enable: boolean): void {
        this._settings.enableTouch = enable;

        if (enable) {
            Touch.setTarget(this._$viewport);
        } else {
            Touch.removeTarget(this._$viewport);
        }
    }

    /**
     * Check async condition method.
     *
     * @return {Boolean} true: now async proccess / false: idle.
     */
    isInAsyncProc(): boolean {
        if (!this._promise || "pending" !== this._promise.state()) {
            return false;
        } else {
            return true;
        }
    }

    /**
     * Wait async condition.
     *
     * @return {Object} jQueryPromise object.
     */
    waitAsyncProc(): JQueryPromise<any> {
        const df = $.Deferred();

        const check = () => {
            if (this.isInAsyncProc()) {
                this._promise
                    .always(() => {
                        setTimeout(check);
                    });
            } else {
                df.resolve();
            }
        };
        setTimeout(check);

        return df.promise();
    }

    /**
     * Manage for JQueryPromise<any> life cicle.
     *
     * @private
     * @return {Object} jQueryPromise object.
     */
    private managePromise(df: JQueryDeferred<any>): JQueryPromise<any> {
        const setup = () => {
            this._promise = df;
            this._promise
                .always(() => {
                    this._promise = null;
                });
        };

        if (this.isInAsyncProc()) {
            this.waitAsyncProc()
                .always(() => {
                    setup();
                });
        } else {
            setup();
        }

        return df.promise();
    }

    /**
     * Notify state change callback.
     *
     * @private
     */
    private notifyStateChanged(state: string, info?: any): void {
        if (typeof this._settings.stateChangedCallback === "function") {
            this._settings.stateChangedCallback(state, info);
        }
    }

    /**
     * Initialize preloaded images array base on preloaded count value.
     *
     * @private
     */
    private initPreloadedImages(): JQueryPromise<any> {
        const df = $.Deferred();
        const rhsDf = $.Deferred();
        const lhsDf = $.Deferred();
        let lhsCount = 0;
        let rhsCount = 0;

        const initialStartIndex = this._imgContainer.getIndex();
        let nextRightIndex = initialStartIndex;
        let nextLeftIndex = initialStartIndex;

        // right side loading
        const rightSideLoad = (): JQueryPromise<any> => {
            if (this._settings.preloadCount <= rhsCount) {
                this._imgContainer.waitAsyncProc()
                    .then(() => {
                        rhsDf.resolve();
                    }, () => {
                        console.error(TAG + "preload right side, wait async proc failed.");
                        rhsDf.reject();
                    });
            } else {
                rhsCount++;
                nextRightIndex++;
                if (this._imgContainer.size() <= nextRightIndex) {
                    nextRightIndex = 0;
                }
                const result = this._imgContainer.seek(nextRightIndex);
                if (!result.succeeded) {
                    console.error(TAG + "preload right side failed.");
                    rhsDf.reject();
                }
                result.promise
                    .then(() => {
                        return this.prepareImageDiv(nextRightIndex);
                    })
                    .then((div) => {
                        this._preloadImages[nextRightIndex] = div;
                        this._preloadImages["outerright"] = nextRightIndex;
                        setTimeout(rightSideLoad, 0);
                    })
                    .fail(() => {
                        console.error(TAG + "preload right side failed.");
                        rhsDf.reject();
                    });
            }
            return rhsDf.promise();
        };

        // left side loading.
        const leftSideLoad = (): JQueryPromise<any> => {
            if (this._settings.preloadCount <= lhsCount) {
                this._imgContainer.waitAsyncProc()
                    .then(() => {
                        lhsDf.resolve();
                    }, () => {
                        console.error(TAG + "preload left side, wait async proc failed.");
                        lhsDf.reject();
                    });
            } else {
                lhsCount++;
                nextLeftIndex--;
                if (nextLeftIndex < 0) {
                    nextLeftIndex = this._imgContainer.size() - 1;
                }
                const result = this._imgContainer.seek(nextLeftIndex);
                if (!result.succeeded) {
                    console.error(TAG + "preload left side failed.");
                    lhsDf.reject();
                }
                result.promise
                    .then(() => {
                        return this.prepareImageDiv(nextLeftIndex);
                    })
                    .then((div) => {
                        this._preloadImages[nextLeftIndex] = div;
                        this._preloadImages["outerleft"] = nextLeftIndex;
                        setTimeout(leftSideLoad, 0);
                    })
                    .fail(() => {
                        console.error(TAG + "preload left side failed.");
                        lhsDf.reject();
                    });
            }
            return lhsDf.promise();
        };

        // clean memory.
        for (const key in this._preloadImages) {
            if ("outerleft" !== key && "outerright" !== key) {
                this.deletePreloadedImage(<any>key);
            }
        }
        this._preloadImages = {};

        this.prepareImageDiv(initialStartIndex)
            .then((div: HTMLElement) => {
                this._preloadImages[initialStartIndex] = div;
            })
            .then(() => {
                return rightSideLoad();
            })
            .then(() => {
                return leftSideLoad();
            })
            .then(() => {
                return this._imgContainer.seek(initialStartIndex).promise;
            })
            .then(() => {
                df.resolve();
            })
            .fail(() => {
                console.error(TAG + "failed preload images.");
                df.reject();
            });

        return df.promise();
    }

    /**
     * Delete preloaded image.
     *
     * @private
     * @param index {Number} [in] index as key.
     */
    private deletePreloadedImage(index: number): void {
        if (this._preloadImages[index]) {
            $(this._preloadImages[index]).remove();
            delete this._preloadImages[index];
        }
        if (this._preloadCanceler[index]) {
            const promise: CDP.IPromise<any> = this._preloadCanceler[index];
            promise.abort();
            delete this._preloadCanceler[index];
        }
    }

    /**
     * Shows current image in the view port.
     *
     * @private
     * @return {Object} jQueryPromise object.
     */
    private showCurrentImage(): JQueryPromise<any> {
        const df = $.Deferred();
        const settings = Transition.fadeIn(this._$viewport, this._preloadImages[this._imgContainer.getIndex()], { duration: 50, focusDuration: 50 }, true);
        this.transition(settings, () => {
            df.resolve();
        });
        return df.promise();
    }

    /**
     * Cleans the viewport, removes the left and right images,
     * and make sure there"s only 1 image in the viewport.
     *
     * @private
     * @param {Object} viewport element.
     */
    private cleanViewPort(viewport: JQuery): void {
        // reset div"s css and
        // make sure there"s only 1 image in the viewport
        if (this._rightImage) {
            CSS.clearTransformsTransitions(this._rightImage);
            $(this._rightImage).css({
                opacity: "",
                position: "absolute",
                top: "0px",
                bottom: "0px",
                left: "0px",
                right: "0px"
            }).remove();
            this._rightImage = null;
        }
        if (this._leftImage) {
            CSS.clearTransformsTransitions(this._leftImage);
            $(this._leftImage).css({
                opacity: "",
                position: "absolute",
                top: "0px",
                bottom: "0px",
                left: "0px",
                right: "0px"
            }).remove();
            this._leftImage = null;
        }
        $(viewport).children().css({
            opacity: "",
            position: "absolute",
            top: "0px",
            bottom: "0px",
            left: "0px",
            right: "0px"
        });
        const children = $(viewport).children();
        if (children.length < 2) {
            return;
        }
        for (let i = 0; i < (children.length - 1); i++) {
            $(children[i]).remove();
        }
    }

    /**
     * Reposition the element by adjusting it"s x/y translate values so it snaps on the edge.
     *
     * @private
     * @param {Object} element.
     * @param {String} values can be "x", "y", or "xy".
     */
    private reposition(element: JQuery, axis: string): void {
        const currY = CSS.getCssMatrixValue(element, "translateY");
        const currX = CSS.getCssMatrixValue(element, "translateX");
        const scale = typeof this._currentScale === "number" ? this._currentScale : 1;
        const offsetXBeforeShow = (($(element).find("img").width() * scale) - ($(this._$viewport).width())) / 2;
        const offsetYBeforeShow = (($(element).find("img").height() * scale) - ($(this._$viewport).height())) / 2;
        const paddingY = currY > 0 ? offsetYBeforeShow : offsetYBeforeShow * (-1);
        let paddingX = offsetXBeforeShow > 0 ? offsetXBeforeShow : 0;
        let newX = 0;
        let newY = 0;
        paddingX = currX < 0 ? paddingX * (-1) : paddingX;

        switch (axis) {
            case "x":
                newX = paddingX;
                newY = currY;
                break;
            case "y":
                newX = currX;
                newY = ($(element).find("img").height() * scale) > ($(this._$viewport).height()) ? paddingY : 0;
                break;
            case "xy":
                newX = paddingX;
                newY = ($(element).find("img").height() * scale) > ($(this._$viewport).height()) ? paddingY : 0;
                break;
        }

        CSS.moveImage(newX, newY, scale, scale, element, this._snapDuration, () => {
            this.cleanViewPort(this._$viewport);
            this._isTransitioning = false;
        });
    }

    /**
     * Resize current image and preload caches.
     * window resize handler.
     *
     * @private
     */
    private resizeImages(): void {
        const _resizeImage = (imageDiv: JQuery): void => {
            const $img = $(imageDiv).find("img").first();
            if ($img.attr(Player.DATA_IMG_LOAD_SUCCEEDED)) {
                this.centerImage(<HTMLImageElement>$img[0], this._$viewport);
            }
        };

        const currentImage = this._$viewport.children(":first");
        _resizeImage(currentImage);

        for (const key in this._preloadImages) {
            if ("outerleft" !== key && "outerright" !== key) {
                _resizeImage(this._preloadImages[key]);
            }
        }
    }

    /**
     * Apply css attributes to an image element so it is centered.
     *
     * @private
     * @param {Object} image element.
     * @param {Object} viewport element where the image will be shown.
     */
    private centerImage(img: HTMLImageElement, viewport: JQuery): void {
        // resize the image"s dimensions so it"s not greater than the viewport"s
        // then center the image within the element

        const viewHeight = $(viewport).height();
        const viewWidth = $(viewport).width();
        const origHeight = img.height;
        const origWidth = img.width;
        let newHeight = img.height;
        let newWidth = img.width;
        let shrinkPercentage = 1.0;

        // if the actual image is smaller than viewer port,
        // scale it then adjust
        if (newHeight < viewHeight && newWidth < viewWidth) {
            newWidth = Math.floor((viewHeight / newHeight) * newWidth);
            newHeight = viewHeight;
        }

        // adjust the image
        if (newHeight > viewHeight) {
            shrinkPercentage = (origHeight - viewHeight) / origHeight;
            newHeight = viewHeight;
            newWidth = Math.floor(origWidth - (origWidth * shrinkPercentage));
        }
        if (newWidth > viewWidth) {
            shrinkPercentage = (origWidth - viewWidth) / origWidth;
            newHeight = Math.floor(origHeight - (origHeight * shrinkPercentage));
            newWidth = viewWidth;
        }

        // reset css in case of resize like
        // change on dimensions and aspect ratios
        $(img).css({
            top: "",
            left: "",
            bottom: "",
            right: "",
            "margin-left": "",
            "margin-top": ""
        });

        // center the image
        const isFitHeight = (newHeight === viewHeight);
        const sideA = isFitHeight ? "top" : "left";
        const sideB = isFitHeight ? "bottom" : "right";
        const sideOffset = isFitHeight ? "left" : "top";
        const sideMargin = isFitHeight ? "margin-left" : "margin-top";
        const sideMarginValue = isFitHeight ? "-" + newWidth / 2 + "px" : "-" + newHeight / 2 + "px";

        const imgCssProperties = {
            position: "absolute",
            height: newHeight + "px",
            width: newWidth + "px"
        };
        imgCssProperties[sideA] = "0px";
        imgCssProperties[sideB] = "0px";
        imgCssProperties[sideOffset] = "50%";
        imgCssProperties[sideMargin] = sideMarginValue;
        $(img).css(imgCssProperties);
    }

    /**
     * Apply spinner or loading message to an element.
     *
     * @private
     * @param {Object} viewport element where the image will be shown.
     * @param {Object} element.
     */
    private setSpinner(viewport: JQuery, element: HTMLElement): void {
        const spinnerDiv = document.createElement("div");
        const loading = document.createElement("p");

        $(loading).text("Loading...");
        const loadingProps = {
            "font-size": "large",
            color: "gray",
            position: "absolute",
            left: "50%",
            top: "50%",
            padding: "0px",
            "margin-left": "-40px",
            "margin-top": "-20px"
        };
        $(loading).css(loadingProps);

        const spinnerProps = {
            width: $(viewport).width(),
            height: $(viewport).height()
        };
        $(spinnerDiv).css(spinnerProps);
        $(spinnerDiv).append(loading);
        $(element).append(spinnerDiv);
    }

    /**
     * Prepare Image Div from _imgContainer.
     * this method wraps for _imgContainer's async or sync accessor
     *
     * @private
     * @param index {Number} [in] image index.
     * @return {jQueryPromise} done(div: HTMLElement).
     */
    private prepareImageDiv(index: number): JQueryPromise<any> {
        const df = $.Deferred();
        let imageDiv: HTMLElement;
        if (!this._imgContainer || !this._imgContainer.valid()) {
            console.error(TAG + "_imgContainer, not ready.");
            return df.reject();
        }

        if (!this._imgContainer.hasAsyncAccesser()) {
            // case of sync asccessor
            df.resolve(this.getImageDiv(this._$viewport, this._imgContainer.get(index)));
        } else {
            // case of async asccessor
            imageDiv = document.createElement("div");

            $(imageDiv).css("background-color", "black");
            if (typeof this._settings.setSpinnerCallback === "function") {
                this._settings.setSpinnerCallback(this._$viewport, imageDiv);
            } else {
                this.setSpinner(this._$viewport, imageDiv);
            }

            // spinner 作成時点で返却
            df.resolve(imageDiv);

            // promise 返却を優先するため post する
            setTimeout(() => {
                const promise = this._imgContainer.get(index);
                this._preloadCanceler[index] = promise;

                promise
                    .then((url, info) => {
                        if (this._preloadImages[index]) {
                            this.getImageDiv(this._$viewport, url, imageDiv);
                        }
                        imageDiv = null;
                    })
                    .fail(() => {
                        console.error(TAG + "_imgContainer.get(), failed.");
                        this._errorCount++;
                        imageDiv = null;
                    });
            }, 0);
        }

        return df.promise();
    }

    /**
     * Put an image within a div as soon as it loads, centers it
     * then returns the div containing the image.
     *
     * @private
     * @param {Object} viewport element where the image will be shown.
     * @param {String} image source url.
     * @param {Object} image div if prepare from caller.
     * @return {Object} div containing the image.
     */
    private getImageDiv(viewport: JQuery, imgUrl: string, imageDiv?: HTMLElement): HTMLElement {
        if (null == imgUrl) {
            console.error(TAG + "imgUrl is null.");
            imgUrl = "pmo.slideshow.unreached";
        }

        if (!imageDiv) {
            imageDiv = document.createElement("div");
            $(imageDiv).css("background-color", "black");
            if (typeof this._settings.setSpinnerCallback === "function") {
                this._settings.setSpinnerCallback(viewport, imageDiv);
            } else {
                this.setSpinner(viewport, imageDiv);
            }
        }

        ((imgDiv: HTMLElement) => {
            let img = new Image();
            const _self = this;

            // wait for image to load before animating
            $(img)
                .on("load", function () {
                    _self.centerImage(this, viewport);
                    // remove the spinner and show the image
                    const $img = $(this);
                    $img.parent().children("div").remove();
                    $img
                        .css("display", "inline")
                        .attr(Player.DATA_IMG_LOAD_SUCCEEDED, "true");
                })
                .on("error", function () {
                    console.error(TAG + "image load failed.");
                    const thisImage = this;
                    // add faild mark.
                    $(thisImage).attr(Player.DATA_IMG_LOAD_FAILED, "true");
                    _self._errorCount++;    // add 2014/02/17
                })
                .css("display", "none");

            $(imgDiv).append(img);

            // load the image
            img.src = imgUrl;
            if (img.complete) {
                console.log(TAG + "image ready. [img.complete === true]");
                (<any>$(img)).load();
            }
            img = null;    // avoid circular reference.
        })(imageDiv);

        return imageDiv;
    }

    /**
     * Wait for current preload image load complete.
     *
     * @private
     * @return {Object} jQueryPromise.
     */
    private waitForCurrentImageReady(): JQueryPromise<any> {
        const df = $.Deferred();

        const proc = () => {
            setTimeout(() => {
                const imageDiv = this._preloadImages[this._imgContainer.getIndex()];
                if ($(imageDiv).find("img").first().attr(Player.DATA_IMG_LOAD_SUCCEEDED)) {
                    df.resolve();
                    return;
                } else if ($(imageDiv).find("img").first().attr(Player.DATA_IMG_LOAD_FAILED)) {
                    // add 2014/02/17
                    // special implement to just avoid eternal waiting in this case.
                    if (this._settings.allowedErrorMax < this._errorCount) {
                        console.log(TAG + "reached error maximum count.");
                        this.stop()
                            .always(() => {
                                this._errorCount = 0;
                                this.notifyStateChanged("error:max-error-count");
                            });
                        df.reject();
                        return;
                    }

                    // if failed, try to show next image immediately.
                    this.moveNext()
                        .always(() => {
                            proc();
                        });
                } else {
                    proc();
                }
            }, 100);
        };
        proc();

        return df.promise();
    }

    /* tslint:disable:no-unused-variable */

    /**
     * Moves image index and transition index forward.
     *
     * @private
     */
    private moveIndecesForward(): void {
        this._trIndx++;
        if (this._trIndx === this._transitionList.length) {
            this._trIndx = 0;
        }
        this._imgContainer.next();
    }

    /* tslint:enable:no-unused-variable */

    /**
     * Moves transition index forward.
     *
     * @private
     */
    private moveNextTransition(): void {
        this._trIndx++;
        if (this._trIndx === this._transitionList.length) {
            this._trIndx = 0;
        }
    }

    /**
     * Move next container.
     *
     * @private
     */
    private moveNext(): JQueryPromise<any> {
        const df = $.Deferred();

        // adjust indeces
        const result = this._imgContainer.next();
        if (!result.succeeded) {
            console.error(TAG + "_imgContainer.next(), failed.");
            return df.reject();
        }

        result.promise
            .then(() => {
                return this.movePreloadToRight();
            })
            .then(() => {
                df.resolve();
            })
            .fail(() => {
                console.error(TAG + "movePrevious(), failed.");
                df.reject();
            });

        return df.promise();
    }

    /**
     * Moves preloadedImages index to the right.
     *
     * @private
     */
    private movePreloadToRight(): JQueryPromise<any> {
        const df = $.Deferred();
        let nextRightIndex = this._preloadImages["outerright"] + 1;
        if (this._imgContainer.size() <= nextRightIndex) {
            nextRightIndex = 0;
        }

        /*
         * make sure the image is not preloaded already or
         * it actuall exists in the image array before adding it
         * need to do this to prevent unneccessary adding/removal espcially
         * when the preload count supplied is greater than images count
         */
        if (!(this._preloadImages[nextRightIndex])) {
            this.prepareImageDiv(nextRightIndex)
                .then((div: HTMLElement) => {
                    this._preloadImages[nextRightIndex] = div;
                    // set the new outer right index
                    this._preloadImages["outerright"] = nextRightIndex;

                    const outerLeftIndex = this._preloadImages["outerleft"];
                    let newOuterLeftIndex = outerLeftIndex + 1;
                    if (this._imgContainer.size() <= newOuterLeftIndex) {
                        newOuterLeftIndex = 0;
                    }
                    // adjust the outer left index tracker
                    this.deletePreloadedImage(outerLeftIndex);
                    this._preloadImages["outerleft"] = newOuterLeftIndex;
                    df.resolve();
                }, () => {
                    console.error(TAG + "prepareImageDiv(), failed.");
                    df.reject();
                });
        } else {
            df.resolve();
        }

        return df.promise();
    }

    /**
     * Move previous container.
     *
     * @private
     */
    private movePrevious(): JQueryPromise<any> {
        const df = $.Deferred();

        // adjust indeces
        const result = this._imgContainer.previous();
        if (!result.succeeded) {
            console.error(TAG + "_imgContainer.previous(), failed.");
            return df.reject();
        }

        result.promise
            .then(() => {
                return this.movePreloadToLeft();
            })
            .then(() => {
                df.resolve();
            })
            .fail(() => {
                console.error(TAG + "movePrevious(), failed.");
                df.reject();
            });

        return df.promise();
    }

    /**
     * Moves preloadedImages index to the left.
     *
     * @private
     */
    private movePreloadToLeft(): JQueryPromise<any> {
        const df = $.Deferred();
        let nextLeftIndex = this._preloadImages["outerleft"] - 1;
        if (nextLeftIndex < 0) {
            nextLeftIndex = this._imgContainer.size() - 1;
        }

        /*
         * make sure the image is not preloaded already or
         * it actuall exists in the image array before adding it
         * need to do this to prevent unneccessary adding/removal espcially
         * when the preload count supplied is greater than images count
         */
        if (!(this._preloadImages[nextLeftIndex])) {
            this.prepareImageDiv(nextLeftIndex)
                .then((div: HTMLElement) => {
                    this._preloadImages[nextLeftIndex] = div;
                    // set the new outer left index
                    this._preloadImages["outerleft"] = nextLeftIndex;

                    const outerRightIndex = this._preloadImages["outerright"];
                    let newOuterRightIndex = outerRightIndex - 1;
                    if (newOuterRightIndex < 0) {
                        newOuterRightIndex = this._imgContainer.size() - 1;
                    }
                    // adjust the outer right index tracker
                    this.deletePreloadedImage(outerRightIndex);
                    this._preloadImages["outerright"] = newOuterRightIndex;
                    df.resolve();
                }, () => {
                    console.error(TAG + "prepareImageDiv(), failed.");
                    df.reject();
                });
        } else {
            df.resolve();
        }

        return df.promise();
    }

    /**
     * Returns the next image element stored in the preloaded array.
     *
     * @private
     * @return {Object} div element containing the image.
     */
    private getNext(): HTMLElement {
        let nextIndex = this._imgContainer.getIndex() + 1;
        if (this._imgContainer.size() <= nextIndex) {
            if (this._imgContainer.isRepeatable()) {
                nextIndex = 0;
            } else {
                return null;
            }
        }
        const nextImage = this._preloadImages[nextIndex];
        CSS.clearTransformsTransitions(nextImage);
        $(nextImage).css({
            position: "absolute",
            top: "0px",
            bottom: "0px",
            left: "0px",
            right: "0px"
        });
        return nextImage;
    }

    /**
     * Returns the previous image element stored in the preloaded array.
     *
     * @private
     * @return {Object} div element containing the image.
     */
    private getPrevious(): HTMLElement {
        let previousIndex = this._imgContainer.getIndex() - 1;
        if (previousIndex < 0) {
            if (this._imgContainer.isRepeatable()) {
                previousIndex = this._imgContainer.size() - 1;
            } else {
                return null;
            }
        }
        const previousImage = this._preloadImages[previousIndex];
        CSS.clearTransformsTransitions(previousImage);
        $(previousImage).css({
            position: "absolute",
            top: "0px",
            bottom: "0px",
            left: "0px",
            right: "0px"
        });
        return previousImage;
    }

    /**
     * Sets the images on both sides when trying to drag the center image.
     *
     * @private
     */
    private setSideImages(offset: number): void {
        if (!this._rightImage) {
            const rightOffset = $(this._$viewport).width() + offset;
            this._rightImage = this.getNext();
            CSS.moveImage(rightOffset, 0, 1, 1, this._rightImage, 0);
            $(this._$viewport).append(this._rightImage);
        }
        if (!this._leftImage) {
            const leftOffset = ($(this._$viewport).width() + offset) * (-1);
            this._leftImage = this.getPrevious();
            CSS.moveImage(leftOffset, 0, 1, 1, this._leftImage, 0);
            $(this._$viewport).append(this._leftImage);
        }
    }

    /**
     * Start transition.
     * transtion entry function.
     *
     * @private
     * @param {Object} TransitionSettings object.
     * @param {Function} function callback.
     */
    private transition(settings: TransitionSettings, callback: () => void): void {
        // start transition
        Transition.startEffect(settings)
            .always(() => {
                this.cleanViewPort(settings.viewport);
                settings.newTarget.$element.off(CSS.transitionEnd);
                setTimeout(() => {
                    callback();
                }, settings.focusDuration);
            });
    }

    /**
     * Subscribe to touch and mouse events.
     * [Note] replace newer touch.js logic in 2014/04/25.
     *        We should call preventDefault() if needed, in any event callbacks.
     *
     * @private
     */
    private subscribeToEvents(): void {
        this._$viewport.on(touchEvent("doubletap"), () => {
            if (!this._settings.enableTouch || this._isPlaying || this._isPinching || this._isTransitioning) {
                return;
            }
            touchEventLog("Touch handled: [doubletap]");
            const element = $(this._$viewport).children(":first");
            const currScale = CSS.getCssMatrixValue(element, "scaleX");
            if (currScale !== 1) {
                this._isTransitioning = true;
                CSS.moveImage(0, 0, 1, 1, element, this._snapDuration, () => {
                    this._currentScale = 1;
                    this._isTransitioning = false;
                });
            } else {
                const transX = CSS.getCssMatrixValue(element, "translateX");
                const transY = CSS.getCssMatrixValue(element, "translateY");
                const defaultZoomScale = 3; // [NOTE]: 画像サイズに合わせて拡大する必要がある。倍率ではない。
                this._isTransitioning = true;
                CSS.moveImage(transX, transY, defaultZoomScale, defaultZoomScale, element, this._snapDuration, () => {
                    this._currentScale = CSS.getCssMatrixValue(element, "scaleX");
                    this._isTransitioning = false;
                });
            }
        });

        this._$viewport.on(touchEvent("pinchstart"), () => {
            if (!this._settings.enableTouch || this._isPlaying) {
                return;
            }
            touchEventLog("Touch handled: [pinchstart]");
            this._isPinching = true;
            const element = $(this._$viewport).children(":first");
            this._currentScale = CSS.getCssMatrixValue(element, "scaleX");
        });

        this._$viewport.on(touchEvent("pinchout"), (event, dragDistance) => {
            this._isDragStarted = false;
            const scaleFactor = (dragDistance / 100);
            const scaleVal = this._currentScale + scaleFactor;
            if (!this._settings.enableTouch || this._isTransitioning || !this._isPinching) {
                return;
            }
            touchEventLog("Touch handled: [pinchout]");
            if (this._isPlaying) {
                this.pause();
            }
            this.cleanViewPort(this._$viewport);

            const element = $(this._$viewport).children(":first");
            const offsetX = CSS.getCssMatrixValue(element, "translateX");
            const offsetY = CSS.getCssMatrixValue(element, "translateY");
            CSS.moveImage(offsetX, offsetY, scaleVal, scaleVal, element, 0);
        });

        this._$viewport.on(touchEvent("pinchin"), (event, dragDistance) => {
            this._isDragStarted = false;
            const minScale = 0.7;
            const scaleFactor = (dragDistance / 100);
            const scaleVal = this._currentScale - scaleFactor;
            if (!this._settings.enableTouch || this._isTransitioning || !this._isPinching || scaleVal < minScale) {
                return;
            }
            touchEventLog("Touch handled: [pinchin]");
            if (this._isPlaying) {
                this.pause();
            }
            this.cleanViewPort(this._$viewport);

            const element = $(this._$viewport).children(":first");
            const offsetX = CSS.getCssMatrixValue(element, "translateX");
            const offsetY = CSS.getCssMatrixValue(element, "translateY");
            CSS.moveImage(offsetX, offsetY, scaleVal, scaleVal, element, 0);
        });

        this._$viewport.on(touchEvent("pinchend"), () => {
            if (!this._settings.enableTouch || this._isPlaying) {
                return;
            }
            touchEventLog("Touch handled: [pinchend]");
            const element = $(this._$viewport).children(":first");
            this._currentScale = CSS.getCssMatrixValue(element, "scaleX");
            this._isPinching = false;
        });

        this._$viewport.on(touchEvent("dragstart"), () => {
            if (!this._settings.enableTouch || this._isTransitioning || this._isDragStarted || this._isPinching) {
                return;
            }
            if (this._isPlaying) {
                // change.
                //                        this.pause();
                return;
            }
            touchEventLog("Touch handled: [dragstart]");
            const element = $(this._$viewport).children(":first");
            this._currentTranslateX = CSS.getCssMatrixValue(element, "translateX");
            this._currentTranslateY = CSS.getCssMatrixValue(element, "translateY");
            this.cleanViewPort(this._$viewport);
            this.setSideImages(Transition.imageOffset);
            this._isDragStarted = true;
        });

        this._$viewport.on(touchEvent("drag"), (event, touchX, touchY, deltaX, deltaY) => {
            if (!this._settings.enableTouch || this._isTransitioning || !this._isDragStarted || this._isPinching) {
                return;
            }
            touchEventLog("Touch handled: [drag]");
            const element = $(this._$viewport).children(":first");
            const scale = typeof this._currentScale === "number" ? this._currentScale : 1;
            const newMoveX = deltaX + this._currentTranslateX;
            let newMoveY = scale !== 1 ? deltaY : 0;
            newMoveY = newMoveY + this._currentTranslateY;

            CSS.moveImage(newMoveX, newMoveY, scale, scale, element, 0);

            const offsetXBeforeShow = (($(element).find("img").width() * scale) - ($(this._$viewport).width())) / 2;
            const currentOffsetX = Math.abs(CSS.getCssMatrixValue(element, "translateX"));

            if (currentOffsetX >= offsetXBeforeShow) {
                const padding = offsetXBeforeShow > 0 ? offsetXBeforeShow : 0;
                const rightOffset = $(this._$viewport).width() + deltaX + Transition.imageOffset + this._currentTranslateX + padding;
                const leftOffset = (($(this._$viewport).width() + Transition.imageOffset + padding) * (-1)) + deltaX + this._currentTranslateX;

                CSS.moveImage(rightOffset, 0, 1, 1, this._rightImage, 0);
                CSS.moveImage(leftOffset, 0, 1, 1, this._leftImage, 0);
            }
        });

        this._$viewport.on(touchEvent("swipe"), (event, swipeValue, newOffsetX) => {
            if (!this._settings.enableTouch || this._isTransitioning || this._isPinching) {
                return;
            }
            touchEventLog("Touch handled: [swipe]");
            this._isTransitioning = true;
            if (this._isPlaying) {
                this.pause();
            }
            const element = $(this._$viewport).children(":first");

            const swipeOffset = $(this._$viewport).width() / 3;
            const sidePeekElem = swipeValue === "swipeleft" ? this._rightImage : this._leftImage;
            const sideMoveValue = CSS.isTransitionSupported ? CSS.getCssMatrixValue(sidePeekElem, "translateX") : parseInt($(sidePeekElem).css("left"), 10);
            const sidePeekWidth = $(this._$viewport).width() - Math.abs(sideMoveValue);
            const scale = typeof this._currentScale === "number" ? this._currentScale : 1;
            const offsetYBeforeShow = (($(element).find("img").height() * scale) - ($(this._$viewport).height())) / 2;
            const currY = CSS.getCssMatrixValue(element, "translateY");

            if (sidePeekElem && ((sidePeekWidth > swipeOffset && scale !== 1) || scale === 1)) {
                if (swipeValue === "swipeleft") {
                    this.stepUp(element, () => {
                        this._isTransitioning = false;
                        this._currentScale = 1;
                    });
                } else if (swipeValue === "swiperight") {
                    this.stepDown(element, () => {
                        this._isTransitioning = false;
                        this._currentScale = 1;
                    });
                } else {
                    this._isTransitioning = false;
                }
            } else if (Math.abs(sidePeekWidth) !== Transition.imageOffset && scale === 1) {

                if (Math.abs(currY) >= offsetYBeforeShow) {
                    this.reposition(element, "xy");
                } else {
                    this.reposition(element, "x");
                }
            } else {
                this._isTransitioning = false;
            }
        });

        this._$viewport.on(touchEvent("dragend"), (event, endX, endY, newOffsetX, newOffsetY) => {
            if (!this._settings.enableTouch || !this._isDragStarted || this._isPinching) {
                return;
            }
            touchEventLog("Touch handled: [dragend]");
            // animation callback cleanup did not happen, so clean it here
            if (newOffsetX === 0 && this._currentTranslateX === 0) {
                this.cleanViewPort(this._$viewport);
            }
            this._isDragStarted = false;
            const element = $(this._$viewport).children(":first");
            this._currentTranslateX = CSS.getCssMatrixValue(element, "translateX");
            this._currentTranslateY = CSS.getCssMatrixValue(element, "translateY");
        });

        //$(window).on("keydown", (event) => {
        //    if (!this._settings.enableTouch || this._isTransitioning || this._isDragStarted || this._isPinching) {
        //        return;
        //    }
        //    if (this._isPlaying) {
        //        this.pause();
        //    }
        //    const element = $(this._$viewport).children(":first");
        //    // bind for left/right arrow press
        //    if (event.keyCode === 37) {
        //        this._isTransitioning = true;
        //        this.stepDown(element, () => {
        //            this._isTransitioning = false;
        //            this._currentScale = 1;
        //        });
        //    } else if (event.keyCode === 39) {
        //        this._isTransitioning = true;
        //        this.stepUp(element, () => {
        //            this._isTransitioning = false;
        //            this._currentScale = 1;
        //        });
        //    }
        //});
    }
}
