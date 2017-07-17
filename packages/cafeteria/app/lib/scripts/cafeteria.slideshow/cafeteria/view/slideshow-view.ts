import {
    IPromise,
    Promise,
    Router,
} from "cdp/framework";
import { toZeroPadding  } from "cdp/tools";
import {
    toUrl,
    JST,
    getTemplate,
    PageView,
    ShowEventData,
    HideEventData,
    registerPage,
    alert,
    Toast,
} from "cdp/ui";
import { DeviceConsole } from "cdp.deviceconsole";
import { SmoothScroll } from "cdp.ui.smoothscroll";
import { SlideShow } from "cdp.slideshow";
import {
    ImageData,
    ImageDataProvider,
    AssetsImageDataProvider,
} from "../model/_entry-slideshow";

const TAG = "[cafeteria.slideshow.view.SlideShowView] ";

/**
 * @class SlideShowView
 * @brief SlideShowView page class.
 */
class SlideShowView extends PageView {

    ///////////////////////////////////////////////////////////////////////
    // data members

    private _isReady: boolean = false;
    private _dataProvider: ImageDataProvider = null;
    private _lastDataProvierType: string = null;
    private _slideshowEngine: SlideShow.Player = null;
    private _thumbnailList: SmoothScroll = null;
    private _thumbnailDataContainer: SlideShow.InfinityContainer = null;
    private _uiVisible: boolean = false;            // for touch event management.
    private _inControlEvent: boolean = false;       // for touch event management.
    private _handleTouchOnScreen: boolean = false;  // for touch event management.
    private _mouseInControlArea: boolean = false;   // for avoid auto hide
    private _lastMouseMoveX: number = 0;            // cache mouse coordinate because IE9 notifies mousemove periodic.
    private _lastMouseMoveY: number = 0;
    private _lastMouseMoveTime: Date = null;
    private _mouseMoveTimeoutId: number = 0;
    private _resizeTimeoutId: number = 0;
    private _template: JST = null;

    private _modelId: string = null;

    private static ANIMATION_INTERVAL = 250;
    private static AUTO_HIDE_INTERVAL = 3000;

    private static EVENT_TOUCH_START = "touchstart MSPointerDown";
    private static EVENT_TOUCH_END = "touchend MSPointerUp";
    private static ENABLE_SCREEN_SWIPE = true;

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * constructor
     *
     */
    constructor() {
        super("/templates/advanced-sample/slideshow.html",
            "page-slideshow",
            {
                route: "advanced/slideshow"
            }
        );
        this._template = this.getJST("#slideshow-thumbnail-list-element-template", "/templates/views-sample/view-templates.html");
    }

    /**
     * 初期化
     */
    initSlideShow(): void {
        this.initDataProvider()
            .then(() => {
                if (!this._dataProvider.valid()) {
                    this.showError("system has no image.");
                    return $.Deferred().reject();
                }
                this.initControls();
                this.bindEventHandler();
                this.initDataObjects()
                    .then(() => {
                        this._isReady = true;
                        this._slideshowEngine.play();
                    }, () => {
                        this.showError("error. failed initDataObjects.");
                    });
            })
            .fail(() => {
                alert($.t("TODO:"), {
                    title: "TODO",
                })
                    .on("popupafterclose", (event: JQuery.Event) => {
                        Router.back();
                    });
            });
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    // JST の取得
    private getJST(key: string, src: string): JST {
        return getTemplate(key, toUrl(src));
    }

    /**
     * DataProvider の初期化
     *
     * @private
     * @return {Object} jQueryPromise オブジェクト
     */
    private initDataProvider(): IPromise<any> {
        return new Promise((resolve, reject) => {
            const type = "assets";
            if (this._dataProvider) {
                if (this._lastDataProvierType === type) {
                    return resolve();
                } else {
                    this._dataProvider.cancelAll(true);
                }
            }

            this._lastDataProvierType = type;

            // TODO:
            // "assets" を使用する場合には、"sample/image/" 以下に、"org" と "thumb" を配置すること。
            //                this._dataProvider = Model.Factory.getImageDataProvider({ newInstance: true, type: "assets" });
            //                this._dataProvider = Model.Factory.getImageDataProvider({ newInstance: true });
            this._dataProvider = new AssetsImageDataProvider();
            this._dataProvider.load()
                .done(() => {
                    if (!this._dataProvider.valid()) {
                        this.showError("system has no image.");
                        reject();
                    } else {
                        resolve();
                    }
                })
                .fail(() => {
                    this.showError("ImageDataProvider.load() failed.");
                    reject();
                });

        });
    }

    /**
     * コントロールの初期化
     *
     * @private
     */
    private initControls(): void {
        $("#info-footer").css("display", "block").css("top", $("#page-slideshow").height());
        $("#menu").css("display", "block");
        if (SlideShow.CSS.is3dSupported) {
            $("#area-prev").css("display", "block").addClass("hide-navigation");
            $("#area-next").css("display", "block").addClass("hide-navigation");
            $("#close").addClass("hide-navigation");
        } else {
            $("#area-prev").css("display", "block").css("opacity", 0.0);
            $("#area-next").css("display", "block").css("opacity", 0.0);
            $("#close").css("opacity", 0.0);
        }
        $("#toggle-fullscreen").css("display", "none");    // full screen.
        this._uiVisible = false;
    }

    /**
     * コントロールの更新
     *
     * @private
     */
    private refreshControls(): void {
        if (this._thumbnailList) {
            if (this._thumbnailList.canPagePrevious()) {
                $("#thumb-prev").stop().animate({ opacity: 1.0 }, SlideShowView.ANIMATION_INTERVAL).css("visibility", "visible");
            } else {
                $("#thumb-prev").stop().animate({ opacity: 0.0 }, SlideShowView.ANIMATION_INTERVAL).css("visibility", "hidden");
            }

            if (this._thumbnailList.canPageNext()) {
                $("#thumb-next").stop().animate({ opacity: 1.0 }, SlideShowView.ANIMATION_INTERVAL).css("visibility", "visible");
            } else {
                $("#thumb-next").stop().animate({ opacity: 0.0 }, SlideShowView.ANIMATION_INTERVAL).css("visibility", "hidden");
            }

            if (this._slideshowEngine.isPlaying()) {
                $("#play-control").addClass("to-stop");
            } else {
                $("#play-control").removeClass("to-stop");
            }

            this.updateInformation();
        }
    }

    /**
     * テキスト情報の更新
     *
     * @private
     */
    private updateInformation(): void {
        const item = this._slideshowEngine.getCurrentImageData();
        if (null != item) {
            $("#info-date-time").text(this.buildDateTimeText(item));
            $("#info-title").text(this.buildAdditionalInfoText(item));
        } else {
            $("#info-date-time").text("");
            $("#info-title").text("");
        }
    }

    /**
     * 日時テキスト構築
     *
     * @private
     * @param item {Model.Image} [in] Image オブジェクト
     * @return {String} 日時フォーマット文字列
     */
    private buildDateTimeText(item: ImageData): string {
        return item.get("dateTime").toDateString();
    }

    /**
     * 付加情報テキスト構築
     *
     * @private
     * @param item {Model.Image} [in] Image オブジェクト
     * @return {String} 付加情報文字列
     */
    private buildAdditionalInfoText(item: ImageData): string {
        const position = this._slideshowEngine.getCurrentImageIndex() + 1 + "/" + this._slideshowEngine.getImageDataCount();
        const title = item.get("title");
        return position + " " + title;
    }

    /**
     * イベントバインド
     *
     * @private
     */
    private bindEventHandler(): void {
        $(window).resize(() => {
            clearTimeout(this._resizeTimeoutId);
            this._resizeTimeoutId = setTimeout(() => {
                this.initControls();
                this.refreshControls();
            }, 200);
        });
        this.bindAnimationHandler();
        this.bindControlHandler();
    }

    /**
     * アニメーションバインド
     *
     * @private
     */
    private bindAnimationHandler(): void {
        const $mainArticle = $("#page-slideshow");
        const $footer = $("#info-footer");

        // hover handler
        $mainArticle
            .hover(() => {
                this.debugLog("#screen event: [hover][show]");
                setTimeout(() => {
                    this.debugLog("#screen event: [hover][show][posted]");
                    if (this._handleTouchOnScreen) {
                        this.debugLog("#screen event: [hover][show][posted][ignored]");
                        return;
                    }
                    this.animateNavigation(true);
                    this.animateFooter(true);
                }, 0);
            }, () => {
                this.debugLog("#screen event: [hover][hide]");
                setTimeout(() => {
                    this.debugLog("#screen event: [hover][hide][posted]");
                    if (this._handleTouchOnScreen) {
                        this.debugLog("#screen event: [hover][show][posted][ignored]");
                        return;
                    }
                    this.animateNavigation(false);
                    this.animateFooter(false);
                }, 0);
            });

        // touch handler
        $mainArticle.on(SlideShowView.EVENT_TOUCH_END, () => {
            let message = "#screen event: [touchend]";
            this._handleTouchOnScreen = true;
            if (this._inControlEvent) {
                message += "[inControlEvent: ignored]";
                this._inControlEvent = false;
            } else {
                if (!SlideShowView.ENABLE_SCREEN_SWIPE) {
                    message += this._uiVisible ? "[hide]" : "[show]";
                    this.animateNavigation(!this._uiVisible);
                    this.animateFooter(!this._uiVisible);
                }
            }
            this.debugLog(message);
        });

        // double tap handler: SlideShow.Touch は preventDefault() が干渉するため自前。
        if (SlideShowView.ENABLE_SCREEN_SWIPE) {
            $mainArticle.data("doubletap", false).on(SlideShowView.EVENT_TOUCH_START, () => {
                if ($mainArticle.data("doubletap")) {
                    //ダブルタップ時の命令
                    let message = "#screen event: [doubletap]";
                    message += this._uiVisible ? "[hide]" : "[show]";
                    this.animateNavigation(!this._uiVisible);
                    this.animateFooter(!this._uiVisible);
                    this.debugLog(message);
                    $mainArticle.data("doubletap", false);
                } else {
                    $mainArticle.data("doubletap", true);
                }
                setTimeout(() => {
                    $mainArticle.data("doubletap", false);
                }, 500);
            });
        }

        // for debug.
        $mainArticle.on("click", () => {
            this.debugLog("#screen event: [click][no-op]");
        });

        // mousemove handler for auto hide
        $mainArticle.on("mousemove", (event) => {
            if (this._lastMouseMoveX === event.pageX && this._lastMouseMoveY === event.pageY) {
                return;
            }

            this._lastMouseMoveX = event.pageX;
            this._lastMouseMoveY = event.pageY;
            this._lastMouseMoveTime = new Date();

            const footerOffset = parseInt($footer.css("top"), 10);
            const screenHeight = $mainArticle.height();

            if (screenHeight <= footerOffset) {
                this.debugLog("#screen event: [mousemove][show]");
                this.animateNavigation(true);
                this.animateFooter(true);
                this.setMousePointerVisible(true);
            }

            clearTimeout(this._mouseMoveTimeoutId);
            this._mouseMoveTimeoutId = setTimeout(() => {
                if (this._handleTouchOnScreen) {
                    this.debugLog("#screen event: [mousemove][handleTouchOnScreen: ignored]");
                    this._handleTouchOnScreen = false;
                    return;
                }

                const now = new Date();
                const elapse = now.getTime() - this._lastMouseMoveTime.getTime();
                if (this._uiVisible && !this._mouseInControlArea && SlideShowView.AUTO_HIDE_INTERVAL <= elapse) {
                    this.debugLog("#screen event: [mousemove][hide(timeout)]");
                    this.animateNavigation(false);
                    this.animateFooter(false);
                    this.setMousePointerVisible(false);
                }
            }, SlideShowView.AUTO_HIDE_INTERVAL);
        });
    }

    /**
     * アニメーション: ナビゲーション
     *
     * @private
     * @param show {Boolean} [in] true: slideup / false: slidedown
     */
    private animateNavigation(show: boolean): void {
        if (show === this._uiVisible || !this._isReady) {
            return;
        }

        if (SlideShow.CSS.is3dSupported) {
            if (show) {
                $("#area-prev").addClass("show-navigation");
                $("#area-next").addClass("show-navigation");
                $("#close").addClass("show-navigation");
            } else {
                $("#area-prev").removeClass("show-navigation");
                $("#area-next").removeClass("show-navigation");
                $("#close").removeClass("show-navigation");
            }
        } else {
            this.animateNavigationTimer(show);
        }
    }

    // [旧実装] アニメーション: ナビゲーション
    private animateNavigationTimer(show: boolean): void {
        const target = show ? 1.0 : 0.0;
        const visibility = show ? "visible" : "hidden";
        $("#area-prev").stop().animate({ opacity: target }, SlideShowView.ANIMATION_INTERVAL).css("visibility", visibility);
        $("#area-next").stop().animate({ opacity: target }, SlideShowView.ANIMATION_INTERVAL).css("visibility", visibility);
        $("#close").stop().animate({ opacity: target }, SlideShowView.ANIMATION_INTERVAL).css("visibility", visibility);
    }

    /**
     * アニメーション: フッター
     *
     * @private
     * @param show {Boolean} [in] true: slideup / false: slidedown
     */
    private animateFooter(show: boolean): void {
        if (show === this._uiVisible || !this._isReady || !this._thumbnailList) {
            return;
        }

        if (show) {
            this.syncContentToThumbnailList();
        }

        if (SlideShow.CSS.is3dSupported) {
            if (show) {
                $("#info-footer").addClass("show-info-footer");
                this._uiVisible = true;
            } else {
                $("#info-footer").removeClass("show-info-footer");
                this._uiVisible = false;
            }
        } else {
            this.animateFooterTimer(show);
        }
    }

    // [旧実装] アニメーション: フッター
    private animateFooterTimer(show: boolean): void {
        const $mainArticle = $("#page-slideshow");
        const $footer = $("#info-footer");

        // animation step function
        const step = (now, fx) => {
            if ("slide" === fx.prop) {
                const screenHeight = $mainArticle.height();
                let footerOffset = 0;
                if (fx.end.show) {
                    footerOffset = screenHeight - this.getFooterHeight() * fx.pos;
                    if (footerOffset < screenHeight - this.getFooterHeight()) {
                        footerOffset = screenHeight - this.getFooterHeight();
                    }
                } else {
                    footerOffset = (screenHeight - this.getFooterHeight()) + this.getFooterHeight() * fx.pos;
                    if (screenHeight < footerOffset) {
                        footerOffset = screenHeight;
                    }
                }
                $(fx.elem).css("top", footerOffset + "px");
            }
        };

        // animation complete function
        const complete = () => {
            const footerOffset = parseInt($footer.css("top"), 10);
            const screenHeight = $mainArticle.height();
            this._uiVisible = footerOffset < screenHeight;
        };

        // start animation
        $footer.stop().animate({ slide: { show: show } }, {
            duration: SlideShowView.ANIMATION_INTERVAL,
            easing: "linear",
            step: step,
            complete: complete
        });
    }

    /**
     * マウスポインタの表示/非表示
     *
     * @private
     * @param {Boolean} true: show / false: hide
     */
    private setMousePointerVisible(show: boolean): void {
        const target = show ? "auto" : "none";
        $("#slideshow-screen").css("cursor", target);
    }

    /**
     * コントローライベントバインド
     *
     * @private
     */
    private bindControlHandler(): void {
        $("#area-prev")
            .on("click", () => {
                this.debugLog("#area-prev event: [click]");
                this._slideshowEngine.stepDown();
            })
            .on(SlideShowView.EVENT_TOUCH_START, () => {
                this.debugLog("#area-prev event: [touchstart]");
                this._inControlEvent = true;
            })
            .hover(() => {
                this.debugLog("#area-prev event: [hover][in]");
                this._mouseInControlArea = true;
            }, () => {
                this.debugLog("#area-prev event: [hover][out]");
                this._mouseInControlArea = false;
            });

        $("#area-next")
            .on("click", () => {
                this.debugLog("#area-next event: [click]");
                this._slideshowEngine.stepUp();
            })
            .on(SlideShowView.EVENT_TOUCH_START, () => {
                this.debugLog("#area-next event: [touchstart]");
                this._inControlEvent = true;
            })
            .hover(() => {
                this.debugLog("#area-next event: [hover][in]");
                this._mouseInControlArea = true;
            }, () => {
                this.debugLog("#area-next event: [hover][out]");
                this._mouseInControlArea = false;
            });

        $("#close")
            .on("click", () => {
                this.debugLog("#close event: [click]");
                Router.back();
            })
            .on(SlideShowView.EVENT_TOUCH_START, () => {
                this.debugLog("#close event: [touchstart]");
                this._inControlEvent = true;
            })
            .hover(() => {
                this.debugLog("#close event: [hover][in]");
                this._mouseInControlArea = true;
            }, () => {
                this.debugLog("#close event: [hover][out]");
                this._mouseInControlArea = false;
            });

        $("#info-footer")
            .hover(() => {
                this.debugLog("#info-footer event: [hover][in]");
                this._mouseInControlArea = true;
            }, () => {
                this.debugLog("#info-footer event: [hover][out]");
                this._mouseInControlArea = false;
            });

        $("#play-control")
            .on("click", () => {
                this.debugLog("#play-control event: [click]");
                if (this._slideshowEngine.isPlaying()) {
                    this._slideshowEngine.pause();
                } else {
                    this._slideshowEngine.play();
                    this._mouseInControlArea = false;
                    this._inControlEvent = false;
                    this._handleTouchOnScreen = false;
                }
            })
            .on(SlideShowView.EVENT_TOUCH_START, () => {
                this.debugLog("#play-control event: [touchstart]");
                this._inControlEvent = true;
            });

        $("#thumb-prev")
            .on("click", () => {
                this.debugLog("#thumb-prev event: [click]");
                this._thumbnailList.pagePrevious();
            })
            .on(SlideShowView.EVENT_TOUCH_START, () => {
                this.debugLog("#thumb-prev event: [touchstart]");
                this._inControlEvent = true;
            });

        $("#thumb-next")
            .on("click", () => {
                this.debugLog("#thumb-next event: [click]");
                this._thumbnailList.pageNext();
            })
            .on(SlideShowView.EVENT_TOUCH_START, () => {
                this.debugLog("#thumb-next event: [touchstart]");
                this._inControlEvent = true;
            });
    }

    /**
     * 初期化: データオブジェクト
     *
     * @private
     */
    private initDataObjects(): IPromise<any> {
        return new Promise((resolve, reject) => {
            this.initSlideShowEngine()
                .done(() => {
                    this.prepareThumbnailDataContainer()
                        .done(() => {
                            this.createThumbnailList();
                        })
                        .fail(() => {
                            this.showError("error. prepareThumbnailDataContainer(), failed.");
                            reject();
                        });
                    resolve();
                })
                .fail(() => {
                    this.showError("error. initSlideShowCtrl(), failed.");
                    reject();
                });
        });
    }

    /**
     * 初期化: スライドショーエンジン
     *
     * @private
     * @return {jQueryPromise} argument: result data.
     */
    private initSlideShowEngine(): IPromise<any> {
        return new Promise((resolve, reject) => {
            this._dataProvider.findData("image", this._modelId)
                .done((data, index, unitIndex) => {
                    this.createSlideShowEngine(data, index, unitIndex)
                        .done(() => {
                            resolve();
                        })
                        .fail(() => {
                            reject();
                        });
                })
                .fail(() => {
                    reject();
                });
        });
    }

    /**
     * スライドショーエンジン構築
     *
     * @private
     * @param  {Object} first data.
     * @param  {Number} first index.
     * @param  {Number} first unit index .
     * @return {Object} jQueryPromise.
     */
    private createSlideShowEngine(dataInit: any, index: number, unitIndex: number): JQueryPromise<any> {
        const setupContainerCallback = (start, end, callback) => {
            this._dataProvider.queryData("image", start)
                .done((data) => {
                    callback(data.items, this._dataProvider.getImageUrl);
                })
                .fail(() => {
                    this.showError("error. dataProvider.query. position:" + start);
                });
        };

        const stateChangedCallback = (status, info) => {
            if ("state:playback-image-changed" === status) {
                if (this._thumbnailList) {
                    this._thumbnailList.setFocus(info);
                    this.updateInformation();
                }
            } else if ("state:play-state-changed" === status) {
                this.refreshControls();
            }
        };

        const setSpinnerCallback = (viewport, element) => {
            const spinnerDiv = document.createElement("div");
            const loading = new Image();
            loading.src = toUrl("/stylesheets/images/slideshow/loading_white_l_size.gif");
            $(loading).addClass("center-spinner");

            const spinnerProps = {
                width: $(viewport).width(),
                height: $(viewport).height(),
            };

            $(spinnerDiv).css(spinnerProps);
            $(spinnerDiv).append(loading);
            $(element).append(spinnerDiv);
        };

        const transitionList = [
            {
                type: "slidein",
                config: {},
            },
            {
                type: "fadein",
                config: {
                    duration: 5000,
                    focusDuration: 1000,
                },
            },
            {
                type: "fixed-fadein-zoomout-inscribed",
                config: {
                    scale: 1.25,
                    transformDuration: 5000,
                    fadeDuration: 2500,
                    focusDuration: 0,
                },
            },
            {
                type: "kenburn",
                config: {
                    focusDuration: 0,
                    type: "slideleft",
                },
            },
            {
                type: "custom-effect",
                config: {
                    oldEndScale: 1.0,
                },
            },
            {
                type: "kenburn",
                config: {
                    focusDuration: 500,
                    type: "slideright",
                },
            },
            {
                type: "slidein",
                config: {},
            },
            {
                type: "fadein",
                config: {},
            },
            {
                type: "kenburn",
                config: {
                    focusDuration: 0,
                    type: "zoomout",
                },
            },
            {
                type: "kenburn",
                config: {
                    focusDuration: 0,
                    type: "slideleft",
                },
            },
            {
                type: "kenburn",
                config: {
                    focusDuration: 0,
                    type: "zoomin",
                },
            },
            {
                type: "kenburn",
                config: {
                    focusDuration: 500,
                    type: "slideright",
                }
            },
        ];

        this._slideshowEngine = new SlideShow.Player();
        return this._slideshowEngine.init(dataInit.items, transitionList, $("#slideshow-screen"), {
            showFirstImageImmediately: false,
            propAccesser: this._dataProvider.getImageUrl,
            setupContainer: setupContainerCallback,
            stateChangedCallback: stateChangedCallback,
            setSpinnerCallback: setSpinnerCallback,
            globalContainerMax: dataInit.total,
            firstContainerStart: unitIndex,
            firstContainerPosition: index,
            repeat: true,
            enableTouch: true,
        });
    }

    /**
     * サムネイル用データコンテナの準備
     * 旧実装
     *
     * @private
     */
    private prepareThumbnailDataContainer(): IPromise<any> {
        return new Promise((resolve, reject) => {
            const setupContainerCallback = (start, end, callback) => {
                this._dataProvider.queryData("thumbnail", start)
                    .done((data) => {
                        callback(data.items, this._dataProvider.getThumbnailUrl);
                    })
                    .fail(() => {
                        this.showError("error. dataProvider.queryData. position:" + start);
                    });
            };

            this._dataProvider.findData("thumbnail", this._modelId)
                .done((data, index, unitIndex) => {
                    this._thumbnailDataContainer = new SlideShow.InfinityContainer;
                    this._thumbnailDataContainer.init(data.items, {
                        propAccesser: this._dataProvider.getThumbnailUrl,
                        setupContainer: setupContainerCallback,
                        globalContainerMax: data.total,
                        firstContainerStart: unitIndex,
                        firstContainerPosition: index,
                    });
                    resolve();
                })
                .fail(() => {
                    reject();
                });

        });
    }

    /* tslint:disable:no-unused-variable */

    /**
     * サムネイル用データコンテナの準備
     * 旧実装
     *
     * @private
     */
    private prepareThumbnailDataContainer_old(): void {
        // deep copy from SlideShowEngine.
        this._thumbnailDataContainer = this._slideshowEngine.getImageDataContainer().clone();

        const setupContainerCallback = (start, end, callback) => {
            this._dataProvider.queryData("thumbnail", start)
                .done((data) => {
                    callback(data.items, this._dataProvider.getThumbnailUrl);
                })
                .fail(() => {
                    this.showError("error. dataProvider.queryData. position:" + start);
                });
        };

        // override function.
        this._thumbnailDataContainer.setRepeat(false);
        this._thumbnailDataContainer.updateSetupContainer(setupContainerCallback, this._dataProvider.getThumbnailUrl);
    }

    /* tslint:enable:no-unused-variable */

    /**
     * サムネイルリスト構築
     *
     * @private
     */
    private createThumbnailList(): void {
        this._thumbnailList = new SmoothScroll();

        this._thumbnailList.init("thumb-container", this._thumbnailDataContainer.size(), {
            elementClass: "thumbnail",
            focusClass: "focus",
            preloadCount: 2,
            onClickElement: (index, $element) => {
                this.debugLog(".thumbnail event: [click]");
                this._thumbnailList.setFocus(index);
                this._slideshowEngine.setCurrentImageIndex(index);
            },
            onTouchStartElement: (index, $element) => {
                this.debugLog(".thumbnail event: [touchstart]");
                this._inControlEvent = true;
            },
            onSetElement: (index, $element) => {
                this._thumbnailDataContainer.seek(index).promise
                    .done(() => {
                        const url = this._thumbnailDataContainer.get();
                        if (null != url) {
                            $element.append(this._template({
                                url: url,
                                id: toZeroPadding(index + 1, 3),
                            }));
                            this._thumbnailList.setElementStatus(index, true);
                        } else {
                            this._thumbnailList.setElementStatus(index, false);
                            console.error(TAG + "url access fail.");
                        }
                    })
                    .fail(() => {
                        this.showError("error. data access failed.");
                    });
            },
            onScrollEnd: (scrollTop, scrollLeft) => {
                this.refreshControls();
            },
        });

        this.syncContentToThumbnailList();
    }

    /**
     * プレビューコンテンツをサムネイルリストへ同期
     *
     * @private
     */
    private syncContentToThumbnailList(): void {
        if (this._thumbnailList) {
            const index = this._slideshowEngine.getCurrentImageIndex();
            this._thumbnailList.setFocus(index);
            this._thumbnailList.ensureVisible(index);
        }
    }

    /**
     * フッターの高さ取得 (レスポンシブ対応)
     *
     * @private
     * @return {Number} footer height pixcel.
     */
    private getFooterHeight(): number {
        const width = $(window).width();
        if (1280 <= width) {
            return 210;
        } else if (640 <= width) {
            return 170;
        } else {
            return 144;
        }
    }

    /**
     * エラー表示
     *
     * @private
     * @param msg {String} [in] 表示文字列
     */
    private showError(msg: string): void {
        console.error(TAG + msg);
        Toast.show(msg);
    }

    /**
     * デバッグ情報表示
     *
     * @private
     * @param msg {String} [in] 表示文字列
     */
    private debugLog(msg: string): void {
        if (DeviceConsole.visible()) {
            console.log(TAG + msg);
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // override methods

    onPageShow(e: JQuery.Event, ui?: ShowEventData): void {
        super.onPageShow(e, ui);
        this.initSlideShow();
    }

    onPageBeforeHide(e: JQuery.Event, ui?: HideEventData): void {
        super.onPageBeforeHide(e, ui);
        if (this._slideshowEngine) {
            this._slideshowEngine.stop();
            this._slideshowEngine = null;
        }

        this._thumbnailList = null;
        this._thumbnailDataContainer = null;

        // event の一括 off
        $("#page-slideshow").children().each((index, element) => {
            $(element).off();
        });

        if (this._dataProvider) {
            this._dataProvider.cancelAll(false);
        }
        this._isReady = false;
    }
}

registerPage(SlideShowView);
