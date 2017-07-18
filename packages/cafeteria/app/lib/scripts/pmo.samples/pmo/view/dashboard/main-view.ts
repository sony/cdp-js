/* tslint:disable:no-bitwise */

import * as _ from "underscore";
import {
    IPromiseBase,
    toUrl,
    Orientation,
    getOrientation,
    registerPage,
    ShowEventData,
    HideEventData,
    Dialog,
    Toast,
} from "cdp/ui";
import { min, max } from "cdp/tools";
import { SlideShow } from "cdp.slideshow";
import { ItemGenerator } from "cafeteria.images";
import { Format } from "../../utils/_entry";
import {
    API,
    ContentProvider,
    MediaProvider,
    Settings,
    Factory,
} from "../../model/_entry";
import { AppPageView } from "../base-frame/app-page-view";
import AdView from "./ad-view";

const TAG = "[pmo.view.dashboard.MainView] ";

namespace Constant {
    export const REFRESH_INTERVAL = 100;
    export const ANIMATION_INTERVAL = 500;
    export const RECALL_INFO_AREA_HEIGHT = 44;
    export const RECALL_INFO_AREA_MARGIN = 14;
    export const CONTENT_MARGIN = 6;
    export const AD_ASPECT_X = 360;
    export const AD_ASPECT_Y = 84;
    export const DARK_RATE = 0.4;
    export let   TEST_COUNTER = 0;
}

/**
 * @class Main
 * @brief Dashboard 構成クラス
 *        PMO のルートページとなるため、 "data-dom-cache" 指定してあり、DOM 上から破棄されない
 */
class MainView extends AppPageView {

    private _$slideShowArea: JQuery = null;
    private _$mask: JQuery = null;
    private _$adArea: JQuery = null;
    private _$ad: JQuery = null;
    private _$adShadow: JQuery = null;
    private _$contentsArea: JQuery = null;

    private _scrollMax: number = null;
    private _adView: AdView = null;

    private _contentProvider: ContentProvider.IDashboardProvider = null;
    private _recallData: API.Recall.RecallInfo = null;

    private _slideshow: SlideShow.Player = null;

    private _prmsTopContents: JQueryDeferred<any> = null;
    private _prmsRecallPlayback: JQueryDeferred<any> = null;
    private _prmsFirstContentsShown: IPromiseBase<any> = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/advanced-sample/pmo-dashboard.html",
            "page-pmo-dashboard",
            {
                route: "pmo/dashboard", top: false
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageView

    // Orientation の変更検知
    onOrientationChanged(newOrientation: Orientation): void {
        this.updateLayout();
        this.runPreview();
    }

    // Account 情報の変更検知
    onAccountInfoChanged(settings: Settings): void {
        if (this._contentProvider) {
            this._contentProvider.clear();
            this._contentProvider = null;
        }
        this._recallData = null;
    }

    // jQM event: "pagecreate" (旧:"pageinit") に対応
    onPageInit(event: JQuery.Event): void {
        super.onPageInit(event);
        // Dialog resource の設定
        Dialog.setDefaultOptions({
            src: toUrl("/templates/common/dialogs.html"),
            labelPositive: $.t("app.common.ok"),
            labelNegative: $.t("app.common.cancel"),
        });
    }

    // jQM event: "pagebeforecreate" に対応
    onPageBeforeCreate(event: JQuery.Event): void {
        super.onPageBeforeCreate(event);

        // 広告領域の移動量算出関数 (CSS transform3d. scrollTop/top property を操作するより良好)
        const makeAdDeltaProp = (ratio: number): any => {
            const transform = {};
            const delta = -(this._$adArea.height() / 2) * ratio;
            for (let i = 0; i < SlideShow.CSS.cssPrefixes.length; i++) {
                transform[SlideShow.CSS.cssPrefixes[i] + "transform"] = "translate3d(0px," + delta + "px,0px)";
            }
            return transform;
        };

        // HTML 読み込み完了後に初期化
        this._$slideShowArea = this.$page.find("#dashboard-slideshow-area");
        this._$mask = this.$page.find("#dashboard-mask");
        this._$adArea = this.$page.find("#dashboard-ad-area");
        this._$contentsArea = this.$page.find("#dashboard-contents-area");
        this._$ad = this._$adArea.find("#dashboard-ad");
        this._$adShadow = this._$adArea.find(".area-shadow");

        // ad view
        this._adView = new AdView({
            owner: this,
            el: this._$ad[0],
        });

        // パララックス処理 [NOTE]: ICS では $page の scroll イベントが安定しない。(iscroll が候補)
        // http://tjvantoll.com/2012/08/19/onscroll-event-issues-on-mobile-browsers/
        this.$page
            .scroll(() => {
                const ratio = this.$page.scrollTop() / this._scrollMax;
                if (_.isNumber(ratio)) {
                    // scroll
                    this._$ad.css(makeAdDeltaProp(ratio));
                    // opacity
                    this._$adShadow.css("opacity", min((1 - ratio), 0.5));
                    // ad view callback
                    this._adView.trigger("scrolled", max((ratio * 100), 50));
                }
            });
    }

    // jQM event: "pagebeforeshow" に対応
    onPageBeforeShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageBeforeShow(event, data);
        this.$page.find(".fullscreen").css("display", "block");
        this.updateLayout();
    }

    // jQM event: "pagecontainershow" (旧:"pageshow") に対応
    onPageShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageShow(event, data);
        if (null == this._recallData) {
            this.load();
        }
        this.runPreview();
    }

    // jQM event: "pagebeforehide" に対応
    onPageBeforeHide(event: JQuery.Event, data?: HideEventData): void {
        super.onPageBeforeHide(event, data);
        this.$page.find(".fullscreen").css("display", "none");
    }

    // jQM event: "pagecontainerhide" (旧:"pagehide") に対応
    onPageHide(event: JQuery.Event, data?: HideEventData): void {
        super.onPageHide(event, data);
        this.initCondition();
    }

    // jQM event: "pageremove" に対応
    onPageRemove(event: JQuery.Event): void {
        super.onPageRemove(event);
        this._recallData = null;
    }

    // .command-button.refresh のコールバック
    onCommandRefresh(event?: JQuery.Event): void {
        super.onCommandRefresh(event);
        if (this._contentProvider) {
            this._contentProvider.clear();
        }
        this.updateLayout();
        this.load();
        this.runPreview();
    }

    // .command-button.add のコールバック
    onCommandAdd(event?: JQuery.Event): void {
        const dialog = new Dialog("#common-dialog-list", {
            title: $.t("page-example-advanced.pmo.common.upload"),
            list: [
                {
                    id: "dlg-btn-from-local",
                    label: $.t("advanced.pmo.action.selectFromDevice"),
                },
                {
                    id: "dlg-btn-take-photo",
                    label: $.t("advanced.pmo.action.uploadTakePhoto"),
                },
            ],
            dismissible: false,    // dialog 外をタプして閉じる設定
        });

        dialog.show()
            .on("vclick", "#dlg-btn-from-local", (ev: JQuery.Event) => {
                ev.preventDefault();
                this.navigate("#localgallery");
            })
            .on("vclick", "#dlg-btn-take-photo", (ev: JQuery.Event) => {
                // 実装カメラとつなげる場合ここで対応
            });
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    // 初期化
    private initCondition(): void {
        this.$page.removeClass("enable-scroll");

        this._$adArea
            .removeClass("fade-setting")
            .removeClass("fade-in")
            .off()
            .css("visibility", "hidden");

        this._$contentsArea.children()
            .removeClass("fade-setting")
            .removeClass("fade-in")
            .off();

        this._$contentsArea
            .css("visibility", "hidden")
            .find("#dashboard-recall-info")
            .find("p")
            .text("");

        // スライドショー停止
        this.stopSlideShow();
        // 最初のコンテンツの表示保証 (Xperia Z2 ちらつき対策)
        this._prmsFirstContentsShown = $.Deferred();
    }

    // プレビュー開始
    private runPreview(): void {
        // initCondition() で hidden にされる。きれいに見せるため post して開始
        setTimeout(() => {
            this.$page.scrollTop(this._scrollMax);
            this.showContents();
            this.startSlideShow();
        }, Constant.REFRESH_INTERVAL);
    }

    // データ取得
    private load(): void {
        this._prmsTopContents = $.Deferred();
        this._prmsRecallPlayback = $.Deferred();

        // Dashboard から Model.Factory の初期化
        Factory.initialize()
            .then(() => {
                if (!this._contentProvider) {
                    this._contentProvider = <ContentProvider.IDashboardProvider>Factory.getContentProvider("dashboard");
                }

                // データの破棄
                this._contentProvider.cancel();
                this._recallData = null;
                this.stopSlideShow();

                // Top Contents の取得
                this._contentProvider.queryTopContents()
                    .then((data: ContentProvider.TopContent[]) => {
                        const darkness = _.filter(data, (content: ContentProvider.TopContent) => {
                            return content.hasContents;
                        }).length > 0;

                        this._$contentsArea.children().find("div").css("opacity", 0);
                        this._$contentsArea.find(".dashboard-content").each((index: number, element: Element) => {
                            const $element = $(element);
                            if (!data[index].hasContents) {
                                $element.addClass("default");
                                if (darkness) {
                                    $element.find("div").css("opacity", Constant.DARK_RATE);
                                }
                            } else {
                                $element.removeClass("default");
                            }
                            $element.find("figure.fade-in")
                                .css("background-image", "url(" + data[index].url + ")");
                        });
                        this._prmsTopContents.resolve();
                    })
                    .fail((error) => {
                        this.errorLog("Dashboard DataProvider.queryTopContents(), failed.", error);
                        this._prmsTopContents.reject();
                    });

                // recall playback データの取得
                this._contentProvider.queryRecallPlaybackData()
                    .then((data: API.Recall.RecallInfo) => {
                        this._recallData = data;
                        this._prmsRecallPlayback.resolve();
                    })
                    .fail((error) => {
                        this.errorLog("Dashboard DataProvider.query(), failed.", error);
                        this._prmsRecallPlayback.reject();
                    });
        });
    }

    // レイアウトの更新
    private updateLayout(): void {
        this.initCondition();
        switch (getOrientation()) {
            case Orientation.PORTRAIT:
                this.updateLayoutPortrait();
                break;
            case Orientation.LANDSCAPE:
                this.updateLayoutLandscape();
                break;
            default:
                console.warn(TAG + "unknown orientaion. code: " + getOrientation());
                break;
        }
    }

    // 共通の updateLayout() ヘルパー関数
    private updateLayoutCommon(basicParam: number, baseContentsOffset: number): number {
        const $contents = this._$contentsArea.find(".dashboard-content"),
            itemWidth = ~~((basicParam - Constant.CONTENT_MARGIN * 4) / 3),
            itemWidthLarge = itemWidth * 2 + Constant.CONTENT_MARGIN,
            adWidth = itemWidthLarge + itemWidth + Constant.CONTENT_MARGIN,
            adHeight = ~~(adWidth * Constant.AD_ASPECT_Y / Constant.AD_ASPECT_X); // 360:84 固定

        // スクロールの基準となる最少ページ幅を設定
        this.$page.css("min-height", $(window).height() - this.$header.height());

        // スライドショー
        this._$slideShowArea.width(basicParam).height(basicParam); // 正方形
        // 広告
        this._$adArea.width(adWidth).height(adHeight).removeClass("fade-in").find("#dashboard-ad").height(adHeight);
        // コンテンツ領域幅
        this._$contentsArea.width(basicParam)
            .find(".event-delegater").width(basicParam).height(adHeight);

        // 各コンテンツ配置
        $contents.width(itemWidth).height(itemWidth).removeClass("fade-in");
        $($contents[0]).css({
            width: itemWidthLarge,
            top: baseContentsOffset,
            left: Constant.CONTENT_MARGIN,
        });
        $($contents[1]).css({
            top: baseContentsOffset,
            left: Constant.CONTENT_MARGIN * 2 + itemWidthLarge,
        });
        $($contents[2]).css({
            top: baseContentsOffset + Constant.CONTENT_MARGIN + itemWidth,
            left: Constant.CONTENT_MARGIN,
        });
        $($contents[3]).css({
            top: baseContentsOffset + Constant.CONTENT_MARGIN + itemWidth,
            left: Constant.CONTENT_MARGIN * 2 + itemWidth,
        });
        $($contents[4]).css({
            top: baseContentsOffset + Constant.CONTENT_MARGIN + itemWidth,
            left: Constant.CONTENT_MARGIN + (Constant.CONTENT_MARGIN + itemWidth) * 2,
        });

        return itemWidth;
    }

    // Portrait 時のヘルパー関数
    private updateLayoutPortrait(): void {
        const basicParam = $(window).width(),
            baseContentsOffset = Constant.RECALL_INFO_AREA_HEIGHT + Constant.RECALL_INFO_AREA_MARGIN;
        const itemWidth = this.updateLayoutCommon(basicParam, baseContentsOffset);
        const areaAvail = baseContentsOffset + (itemWidth * 2) + (Constant.CONTENT_MARGIN * 2);
        const areaHeight = areaAvail + this._$adArea.height();
        const areaOffset = $(window).height() - areaAvail;

        // mask
        this._$mask.css({ "top": basicParam, "left": 0 });
        // コンテンツ領域配置
        this._$contentsArea.height(areaHeight).css("top", areaOffset);
        // shadow
        this._$contentsArea.find(".area-shadow").height(areaAvail).css("visibility", "visible");
        // スクロール量
        this._scrollMax = this._$adArea.height();
    }

    // Landscape 時のヘルパー関数
    private updateLayoutLandscape(): void {
        const basicParam = $(window).height();
        const itemWidth = this.updateLayoutCommon(basicParam, 0);
        const areaAvail = (itemWidth * 2) + (Constant.CONTENT_MARGIN * 2);
        const areaHeight = areaAvail + this._$adArea.height();
        const areaOffset = basicParam - areaAvail - this._$adArea.height() / 2;
        const adRev = basicParam - (itemWidth * 3) - (Constant.CONTENT_MARGIN * 4);

        // mask
        this._$mask.css({ "top": 0, "left": basicParam });
        // コンテンツ領域配置
        this._$contentsArea.height(areaHeight).css("top", areaOffset);
        // shadow
        this._$contentsArea.find(".area-shadow").css("visibility", "hidden");
        // スクロール量
        this._scrollMax = ~~(this._$adArea.height() / 2);

        // 広告エリアの補正
        if (0 < adRev) {
            this._$adArea.css("right", adRev);
        }
    }

    // コンテンツの表示
    private showContents(): void {
        this._prmsTopContents
            .done(() => {
                const $contents = this._$contentsArea.find(".dashboard-content");

                let index = 0;
                const contentLength = $contents.length;

                // transitionend を採用する方が、setTimer() で繰り返すよりもアニメーションが安定
                const transitionEndHandler = (event: JQuery.Event) => {
                    const $target = $(event.target);

                    // "opacity" をカウント対象とする
                    if ((<any>event.originalEvent).propertyName !== "opacity") {
                        return;
                    }

                    if ($target.hasClass("dashboard-content")) {
                        if (0 === index) {
                            (<JQueryDeferred<any>>this._prmsFirstContentsShown).resolve();
                        }
                        index++;
                        if (index < contentLength) {
                            setTimeout(() => {
                                $($contents[index]).addClass("fade-in");
                            }, 0);
                        } else {
                            setTimeout(() => {
                                this._$adArea.addClass("fade-in");
                            }, 0);
                        }
                    } else if ($target.attr("id") === "dashboard-ad-area") {
                        $contents.off();
                        this._$adArea.off();
                        setTimeout(() => {
                            this.$page.animate({ scrollTop: 0 }, {
                                duration: Constant.ANIMATION_INTERVAL,
                                easing: "linear",
                            });
                        }, 0);
                    }
                };

                this._$adArea.css("visibility", "visible");
                this._$contentsArea.css("visibility", "visible");

                // transiton 設定
                this._$adArea.addClass("fade-setting");
                $contents.addClass("fade-setting");

                $contents.on(SlideShow.CSS.transitionEnd, transitionEndHandler);
                this._$adArea.on(SlideShow.CSS.transitionEnd, transitionEndHandler);

                this.$page.addClass("enable-scroll");

                // アニメーション開始
                $contents.first().addClass("fade-in");
            });
    }

    /**
     * Recall Playback 情報テキストの更新
     *
     * @param type {String} [description | date] のいずれか
     * @param text {String} 情報テキスト
     */
    private updateRecallPlaybackText(type: string, text: string): void {
        const $target = $("#dashboard-recall-info").find("." + type).children();
        $target.each((index: number, element: Element) => {
            if ($(element).hasClass("fade-in")) {
                $(element).removeClass("fade-in");
            } else {
                $(element).text(text).addClass("fade-in");
            }
        });
    }

    /**
     * コンテンツ画像の更新
     *
     * @param type {String} [calendar | album | postcard | spb | friend] のいずれか
     * @param src  {String} url src に指定できるもの
     */
    private updateContentImage(type: string, src: string): void {
        const $target = this._$contentsArea.find("nav[data-type='" + type + "']").find("figure");
        $target.each((index: number, element: Element) => {
            const $element = $(element),
                $parent = $element.parent();

            if ($element.hasClass("fade-in")) {
                $parent.removeClass("default");
                $element.removeClass("fade-in");
            } else {
                $parent.find("div").css("opacity", 0);    // 明るく戻す
                $element
                    .css("background-image", "url(" + src + ")")
                    .addClass("fade-in");
            }
        });
        // デフォルト画像は暗くする
        this._$contentsArea.find(".default").find("div").each((index, element) => {
            $(element).css("opacity", Constant.DARK_RATE);
        });
    }

    // スライドショーの再生
    private startSlideShow(): void {
        $.when(this._prmsRecallPlayback, this._prmsFirstContentsShown)
            .done(() => {
                const $screen = this._$slideShowArea.find("#dashboard-slideshow-screen");
                const onStateChanged = (event: string, info: any) => {
                    if (null == this._recallData) {
                        return;
                    }
                    switch (event) {
                        case "state:play-state-changed":
                            if (!!info) {
                                this.updateRecallPlaybackText("description", this._recallData.recall_type_description);
                                $screen.addClass("fade-in").css("pointer-events", "all");
                            }
                            break;
                        case "state:playback-image-changed":
                            const item = <API.ItemInfo>this._recallData.items[info];
                            this.updateRecallPlaybackText("date", Format.date2string(item.recorded_date));
                            break;
                        default:
                            break;
                    }

                };

                const propAccesser = Factory.getMediaProvider().makePropertyAccesser((element: any): MediaProvider.Key => {
                    return {
                        key: (<API.ItemInfo>element).item_id,
                        info: {
                            item: (<API.ItemInfo>element),
                            size: "1024",
//                          size: MediaProvider.getRequestSizeForImage(base),
//                          orientation: MediaProvider.getExifOrientation(<API.ItemInfo>element),
                        },
                    };
                });

                const transitionList = [
                    {
                        type: "fixed-fadein-zoomout-circumscribed",
                        config: {
                            scale: 1.3,
                            transformDuration: 4000,
                            fadeDuration: 2500,
                            focusDuration: 3000,
                        },
                    }
                ];

                const procStart = () => {
                    // screen サイズが確定してから再生
                    if (0 < $screen.width() && 0 < $screen.height()) {
                        this._slideshow = new SlideShow.Player();
                        this._slideshow.init(this._recallData.items, transitionList, $screen, {
                            preloadCount: 2,
                            showFirstImageImmediately: false,
                            propAccesser: propAccesser,
                            stateChangedCallback: onStateChanged,
                            globalContainerMax: this._recallData.items.length,
                            repeat: true,
                            enableTouch: false,
                        })
                            .then(() => {
                                this._slideshow.play();
                            })
                            .fail((error) => {
                                this.errorLog("SlideShow.Player.init(), failed.", error);
                            });
                    } else {
                        setTimeout(procStart, Constant.REFRESH_INTERVAL);
                    }
                };

                setTimeout(procStart, 0);
            });
    }

    // スライドショーの停止
    private stopSlideShow(): void {
        if (this._slideshow) {
            this._slideshow.terminate();
            this._slideshow = null;
        }
        this._$slideShowArea.find("#dashboard-slideshow-screen")
            .removeClass("fade-in")
            .css("pointer-events", "none");
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    // Event mapping
    events(): any {
        return {
            "vclick #dashboard-slideshow-screen": this.onRecallPlayback,
            "vclick #dashboard-contents-area>.event-delegater": this.onAdAreaEvent,
            "vclick #dashboard-contents-area>nav": this.onNavigate,
            "vclick .overflow>li.navigate": this.onNavigate,
            "vclick .overflow>li.external": this.onExternal,
            "vclick .overflow>li.test": this.onTest,
        };
    }

    ///////////////////////////////////////////////////////////////////////
    // Command Event Handler

    // 広告領域のイベント
    private onAdAreaEvent(event: JQuery.Event): void {
        event.preventDefault();
        // adView へデリゲート
        this._adView.trigger("clicked");
    }

    // RecallPlayback イベントハンドラ
    private onRecallPlayback(event: JQuery.Event): void {
        event.preventDefault();
        Toast.show("ページ遷移: Recall Playback");
        return;
    }

    // 内部ページリンクイベントハンドラ
    private onNavigate(event: JQuery.Event): void {
        const url = $(event.currentTarget).attr("data-command");
        event.preventDefault();
        //                    this.navigate(url);
        Toast.show("ページ遷移:" + url);
    }

    // 外部ページリンクイベントハンドラ
    private onExternal(event: JQuery.Event): void {
        const url = $(event.currentTarget).attr("data-command");
        event.preventDefault();
        Toast.show("外部リンク: " + url);
    }

    ///////////////////////////////////////////////////////////////////////
    // Test Event Handler

    // テストイベントハンドラ
    private onTest(event: JQuery.Event): void {
        const command = $(event.currentTarget).attr("data-command");
        event.preventDefault();
        switch (command) {
            case "update-image":
                (() => {
                    const odd = Constant.TEST_COUNTER % 4;
                    let target = "calendar";
                    switch (odd) {
                        case 0:
                            target = "calendar";
                            break;
                        case 1:
                            target = "album";
                            break;
                        case 2:
                            target = "postcard";
                            break;
                        case 3:
                            target = "friend";
                            break;
                        default:
                            break;
                    }
                    this.updateContentImage(target, ItemGenerator.create().thumbnail[0].location);
                    Constant.TEST_COUNTER++;
                })();
                break;
            case "dialog":
                this.onTestDialog_DialogList();
                break;
            default:
                break;
        }
    }

    // リストダイアログのテスト
    private onTestDialog_DialogList(): void {
        const $window = $(window);
        // リストダイアログインスタンスの作成
        const dialog = new Dialog("#common-dialog-list", {
            title: "[W:" + $window.width() + "px, H:" + $window.height() + "px]",
            list: [
                {
                    id: "dlg-btn-show-toast",
                    label: "Toast の表示",
                },
                {
                    id: "dlg-btn-show-dlg-message",
                    label: "メッセージダイアログの表示",
                },
                {
                    id: "dlg-btn-show-dlg-message-custom",
                    label: "メッセージダイアログの表示(カスタム)",
                },
            ],
        });

        let nextOperation;

        // 表示とイベントハンドリング
        dialog.show()
            .on("vclick", "#dlg-btn-show-toast", (event: JQuery.Event) => {
                Toast.show("Toast");
            })
            .on("vclick", "#dlg-btn-show-dlg-message", (event: JQuery.Event) => {
                nextOperation = "SHOW_DLG_MESSAGE";
            })
            .on("vclick", "#dlg-btn-show-dlg-message-custom", (event: JQuery.Event) => {
                nextOperation = "SHOW_DLG_MESSAGE_CUSTOM";
            })
            .on("vclick", "#dlg-btn-negative", (event: JQuery.Event) => {
                Toast.show("onCancel");
            })
            .on("popupafterclose", (event: JQuery.Event) => {
                /*
                 * あまり無いシチュエーションだが、
                 * ダイアログプロセス内から、再びダイアログを表示することは禁止。
                 * (Dialog.ts の制限事項. $page の overflow 抑止管理がおかしくなるため。)
                 *
                 * 回避方法として
                 * "popupafterclose" はダイアログが閉じられたときに必ず呼ばれる。
                 * この中で setTimeout() をコールし、post する。
                 */
                setTimeout(() => {
                    switch (nextOperation) {
                        case "SHOW_DLG_MESSAGE":
                            this.onTestDialog_DialogMessage();
                            break;
                        case "SHOW_DLG_MESSAGE_CUSTOM":
                            this.onTestDialog_DialogMessageCustom();
                            break;
                        default:
                            break;
                    }
                }, 0);
            });
    }

    // メッセージダイアログのテスト
    private onTestDialog_DialogMessage(): void {
        // メッセージダイアログインスタンスの作成
        const dialog = new Dialog("#common-dialog-message", {
            title: "メッセージダイアログテスト",
            message: "Simple is best.",
        });

        // 表示とイベントハンドリング
        dialog.show()
            .on("vclick", "#dlg-btn-positive", (event: JQuery.Event) => {
                Toast.show("onOK");
            })
            .on("vclick", "#dlg-btn-negative", (event: JQuery.Event) => {
                Toast.show("onCancel");
            });
    }

    // メッセージダイアログ(タイトルなし)のテスト
    private onTestDialog_DialogMessageCustom(): void {
        // メッセージダイアログインスタンスの作成
        const dialog = new Dialog("#common-dialog-message");

        // 表示とイベントハンドリング. インスタンス作成後にも、オプションは指定可能
        dialog.show({
//          title: "",    // タイトルを設定しない場合、自動でヘッダは削除.
            message: "長いメッセージは自動で改行\nほげほげほげほげほげほげほげほげほげほげほげほげ。そーれ、ほげほげ。",
            labelPositive: "いい感じ",        // Positive ラベル指定
            idPositive: "custom-positive",    // Positve ID 指定
            labelNegative: "やな感じ",        // Negative ラベル指定
            idNegative: "custom-negative",    // Negative ID 指定
            transition: "flip",               // transition 指定
        })
            .on("vclick", "#custom-positive", (event: JQuery.Event) => {
                Toast.show("onPositive");
            })
            .on("vclick", "#custom-negative", (event: JQuery.Event) => {
                Toast.show("onNegative");
            });
    }
}

registerPage(MainView);
