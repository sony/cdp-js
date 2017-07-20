import {
    Router,
    NavigateOptions,
    Page,
    PageConstructOptions,
    ShowEventData,
    HideEventData,
    Orientation,
} from "cdp/framework";
import { Toast } from "cdp/ui";
import { Settings } from "../../model/_entry";
import CommandView from "./command-view";
import CommandViewAdaptor from "./command-view-adaptor";
import ActionBar from "./action-bar";

const TAG = "[pmo.view.base-frame.AppPageBase] ";

/**
 * @interface IAppPageBase
 * @brief PMO 共通 Page が備える I/F.
 */
export interface IAppPageBase {
    /**
     * UI Theme を取得
     */
    getUITheme(): string;

    /**
     * アクティブモードの設定
     * 通常モードと選択モードのトグル設定
     *
     * @param mode {String} [in] モードの文字列
     */
    setActiveMode(mode: string): void;

    /**
     * アクティブモードの取得
     *
     * @return {String} モードの文字列
     */
    getActiveMode(): string;

    /**
     * アクティブな command set オブジェクトを取得
     *
     * @return {jQuery} command set jquery object
     */
    getActiveCommandSet(): JQuery;

    /**
     * タイトル設定
     *
     * @param title {String} [in] タイトル文字列
     */
    setTitle(title: string): void;

    /**
     * ページ遷移
     * PMO 既定の transition を行う
     *
     * @param url     {String}  [in] 遷移 URL を指定 (相対パス/絶対パス/フラグメント)
     * @param options {Object}  [in] Backbone.Router.navigate() に渡されるオプション (任意)
     */
    navigate(url: string, options?: NavigateOptions): void;

    /**
     * エラー出力
     * fail(error) の共通処理
     *
     * @param message {String} [in] エラーメッセージ
     * @param error   {Object} [in] fail() に渡されたデータ
     */
    errorLog(message: string, error: any): void;

    ///////////////////////////////////////////////////////////////////////
    // Command Event Handler

    // Account 情報の変更検知
    onAccountInfoChanged(settings: Settings): void;

    // .command-icon.withindicator のコールバック
    onCommandBack(event?: JQuery.Event): boolean;

    // .command-icon.done のコールバック
    onCommandDone(event?: JQuery.Event): void;

    // .command-button.add のコールバック
    onCommandAdd(event?: JQuery.Event): void;

    // .command-button.delete のコールバック
    onCommandDelete(event?: JQuery.Event): void;

    // .command-button.edit のコールバック
    onCommandEdit(event?: JQuery.Event): void;

    // .command-button.notification のコールバック
    onCommandNotification(event?: JQuery.Event): void;

    // .command-button.photo のコールバック
    onCommandPhoto(event?: JQuery.Event): void;

    // .command-button.play のコールバック
    onCommandPlay(event?: JQuery.Event): void;

    // .command-button.refresh のコールバック
    onCommandRefresh(event?: JQuery.Event): void;

    // .command-button.share のコールバック
    onCommandShare(event?: JQuery.Event): void;

    // .command-button.overflow のコールバック
    onCommandOverflow(event?: JQuery.Event): boolean;

    // overflow menu 表示
    showOverflowMenu($overflow: JQuery, options: PopupOptions): void;

    // active mode に対応した overflow menu の取得
    getActiveOverflowMenu(): JQuery;

    // popup オプションの作成
    makePopupOptions($overflow: JQuery): PopupOptions;
}


//___________________________________________________________________________________________________________________//


// UI Theme 定義
export namespace UITheme {
    export const ACTION_BAR = "actionbar";                    //< for Android
    export const NAVIGATION_BAR = "navigationbar:toolbar";    //< for iOS
}

/**
 * @class AppPageBase
 * @brief CommandView を持つページの基底クラス
 *        CDP.Framework.Page
 */
export class AppPageBase extends Page implements IAppPageBase {

    private _setting: Settings = null;
    private _commandView: CommandView = null;

    /**
     * constructor
     *
     * @param _url    {String}               [in] ページ URL
     * @param _id     {String}               [in] ページ ID
     * @param options {PageConstructOptions} [in] オプション
     */
    constructor(url: string, id: string, options?: PageConstructOptions) {
        super(url, id, options);
    }

    ///////////////////////////////////////////////////////////////////////
    // 共通操作

    /**
     * UI Theme を取得
     */
    getUITheme(): string {
        if ("ios" !== JSON.parse(localStorage.getItem("ui-theme"))) {
//      if (Framework.Platform.Android) {
            return UITheme.ACTION_BAR;
        } else {
            return UITheme.NAVIGATION_BAR;
        }
    }

    /**
     * アクティブモードの設定
     * 通常モードと選択モードのトグル設定
     *
     * @param mode {String} [in] モードの文字列
     */
    setActiveMode(mode: string): void {
        if (this._commandView) {
            this._commandView.setActiveMode(mode);
        }
    }

    /**
     * アクティブモードの取得
     *
     * @return {String} モードの文字列
     */
    getActiveMode(): string {
        if (this._commandView) {
            return this._commandView.getActiveMode();
        } else {
            return null;
        }
    }

    /**
     * アクティブな command set オブジェクトを取得
     *
     * @return {jQuery} command set jquery object
     */
    getActiveCommandSet(): JQuery {
        if (this._commandView) {
            return this._commandView.getActiveCommandSet();
        } else {
            return null;
        }
    }

    /**
     * タイトル設定
     *
     * @param title {String} [in] タイトル文字列
     */
    setTitle(title: string): void {
        if (this._commandView) {
            this._commandView.setTitle(title);
        }
    }

    /**
     * ページ遷移
     * PMO 既定の transition を行う
     *
     * @param url     {String}  [in] 遷移 URL を指定 (相対パス/絶対パス/フラグメント)
     * @param options {Object}  [in] Backbone.Router.navigate() に渡されるオプション (任意)
     */
    navigate(url: string, options?: NavigateOptions): void {
        url = Router.isInSubFlow() ? url + "/subflow" : url;
        Router.navigate(url, "fade", false, options);
    }

    /**
     * エラー出力
     * fail(error) の共通処理
     *
     * @param message {String} [in] エラーメッセージ
     * @param error   {Object} [in] fail() に渡されたデータ
     */
    errorLog(message: string, error: any): void {
        if (null != error && null != error.message) {
            console.log(error.message);
        } else {
            console.error(message);
            Toast.show(message);
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    // command view の準備 と 不要な DOM の破棄
    private prepareCondition(): CommandView {
        const $commandView = this.$page.find(".commandview");
        const $actionbar = $commandView.find(".actionbar");
        const $navigationbar = $commandView.find(".navigationbar");
        const $toolbar = $commandView.find(".toolbar");

        if (UITheme.ACTION_BAR === this.getUITheme()) {
            if (0 < $actionbar.length) {
                $navigationbar.remove();
                $toolbar.remove();
                return new ActionBar(this, { el: $commandView.first() });
            } else {
                return new CommandViewAdaptor(this, { el: $commandView });
            }
        } else {
            if (0 < $navigationbar.length) {
                $actionbar.remove();
                return new CommandViewAdaptor(this, { el: $commandView });
            } else {
                return new ActionBar(this, { el: $commandView.first() });
            }
        }
    }

    // Notification の表示/非表示
    private showNotification(show: boolean): void {
        if (this._commandView) {
            this._commandView.showNotification(show);
        }
    }

    /* tslint:disable:no-unused-variable */

    // Loading の表示/非表示
    private setLoadingState(loading: boolean): void {
        // noop
    }

    /* tslint:enable:no-unused-variable */

    // option access
    getOwner(): IAppPageBase {
        return (<any>this._owner);
    }

    ///////////////////////////////////////////////////////////////////////
    // test methods

    // Notification 表示中か?
    private isVisibleNotification(): boolean {
        if (this._commandView) {
            return this._commandView.isVisibleNotification();
        } else {
            return false;
        }
    }

    // ロード表示中か?
    private isVisibleLoading(): boolean {
        if (this._commandView) {
            return this._commandView.isVisibleLoading();
        } else {
            return false;
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // Command Event Handler

    // Account 情報の変更検知
    onAccountInfoChanged(settings: Settings): void {
        this.getOwner().onAccountInfoChanged(settings);
    }

    // .command-icon.withindicator のコールバック
    onCommandBack(event?: JQuery.Event): boolean {
        if (!this.getOwner().onCommandBack(event)) {
            Router.back();
        }
        return true;
    }

    // .command-icon.done のコールバック
    onCommandDone(event?: JQuery.Event): void {
        this.getOwner().onCommandDone(event);
    }

    // .command-button.add のコールバック
    onCommandAdd(event?: JQuery.Event): void {
        if (this.isVisibleNotification()) {
            this.showNotification(false);
        } else {
            this.showNotification(true);
        }
        this.getOwner().onCommandAdd(event);
    }

    // .command-button.delete のコールバック
    onCommandDelete(event?: JQuery.Event): void {
        this.getOwner().onCommandDelete(event);
    }

    // .command-button.edit のコールバック
    onCommandEdit(event?: JQuery.Event): void {
        this.getOwner().onCommandEdit(event);
    }

    // .command-button.notification のコールバック
    onCommandNotification(event?: JQuery.Event): void {
        this.getOwner().onCommandNotification(event);
    }

    // .command-button.photo のコールバック
    onCommandPhoto(event?: JQuery.Event): void {
        this.getOwner().onCommandPhoto(event);
    }

    // .command-button.play のコールバック
    onCommandPlay(event?: JQuery.Event): void {
        this.getOwner().onCommandPlay(event);
    }

    // .command-button.refresh のコールバック
    onCommandRefresh(event?: JQuery.Event): void {
        if (this._commandView && !this.isVisibleLoading()) {
            this._commandView.setLoadingState(true);
            setTimeout(() => {
                this._commandView.setLoadingState(false);
            }, 2000);
        }
        this.getOwner().onCommandRefresh(event);
    }

    // .command-button.share のコールバック
    onCommandShare(event?: JQuery.Event): void {
        this.getOwner().onCommandShare(event);
    }

    // .command-button.overflow のコールバック
    onCommandOverflow(event?: JQuery.Event): boolean {
        if (!this.getOwner().onCommandOverflow(event)) {
            const $overflow = this.getActiveOverflowMenu();
            if ($overflow && 1 === $overflow.length) {
                this.showOverflowMenu($overflow, this.makePopupOptions($overflow));
            }
        }
        return true;
    }

    // overflow menu 表示
    showOverflowMenu($overflow: JQuery, options: PopupOptions): void {
        $overflow
            .popup(options)
            .popup("open").on("vclick", () => {
                $overflow.popup("close");
            })
            ;

        /*
         * [WORKARROUND]
         * android Kitkat で overflow menu が透明になる現象の回避コード。
         * 一度 z-index を auto にしないと正しくレンダリングされない。
         * オーバーレイ用の "ui-popup-screen" の z-index は 1099 なので、
         * 元に戻す必要がある。
         */
        (() => {
            const REFLECT_WAIT_TIME = 100;    // ※0, 1 では動作しなかった
            $overflow.parent().css("z-index", "auto");
            setTimeout(() => {
                $overflow.parent().css("z-index", "1100");
            }, REFLECT_WAIT_TIME);
        })();
    }

    // active mode に対応した overflow menu の取得
    getActiveOverflowMenu(): JQuery {
        const $overflow = this.$page.find("menu.overflow");

        if (1 === $overflow.length) {
            return $overflow;
        } else if ($overflow.length <= 0) {
            return null;
        } else {
            // 複数ある場合フィルタ
            return $overflow.filter((index: number, element: HTMLElement) => {
                // mode でフィルタ
                return $(element).data("mode") === this.getActiveMode();
            });
        }
    }

    // popup オプションの作成
    makePopupOptions($overflow: JQuery): PopupOptions {
        const $bar = this.$header.find(".active");
        const offset = $bar.height() + parseInt($bar.css("border-bottom-width"), 10);
        const tolerance = offset + ",0"; // ex) "50,0" / "20,30,0,0". css format.
        const options: PopupOptions = {
            x: $(window).width() - ($overflow.width()),
            y: offset,
            positionTo: "origin",
            tolerance: tolerance,
        };
        return options;
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Framework.Page stub stuff.

    // Orientation の変更検知
    onOrientationChanged(newOrientation: Orientation): void {
        super.onOrientationChanged(newOrientation);
        if (this._commandView) {
            this._commandView.onOrientationChanged();
        }
    }

    // 汎用コマンドのコールバック
    onCommand(event?: JQuery.Event, kind?: string): boolean {
        return super.onCommand(event, kind);
    }

    /**
     * 最初の OnPageInit() のときにのみコールされる
     *
     * @param event {JQuery.Event} [in] イベントオブジェクト
     */
    onInitialize(event: JQuery.Event): void {
        super.onInitialize(event);
        this._setting = Settings.getInstance();
        /*
         * Backbone.View.listenTo() は remove() 時に stopListening() されてしまう。
         * this._setting はシングルトンかつ Application の life cycle と同期するので Backbone.Model.on() を使用する。
         */
        this._setting.on("change:account.userId account.condition", this.onAccountInfoChanged.bind(this));
    }

    /**
     * jQM event: "pagebeforecreate" に対応
     *
     * @param event {JQuery.Event} [in] イベントオブジェクト
     */
    onPageBeforeCreate(event: JQuery.Event): void {
        super.onPageBeforeCreate(event);
        this._commandView = this.prepareCondition();
    }

    /**
     * jQM event: "pagebeforeshow" に対応
     *
     * @param event {JQuery.Event} [in] イベントオブジェクト
     * @param data  {ShowEventData}     [in] 付加情報
     */
    onPageBeforeShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageBeforeShow(event, data);
        this._commandView.activate();
        this._commandView.setTitleMaxWidth();
    }

    /**
     * jQM event: "pagebeforehide" に対応
     *
     * @param event {JQuery.Event} [in] イベントオブジェクト
     * @param data  {HideEventData}     [in] 付加情報
     */
    onPageBeforeHide(event: JQuery.Event, data?: HideEventData): void {
        this._commandView.inactivate();
        super.onPageBeforeHide(event, data);
    }

    /**
     * jQM event: "pageremove" に対応
     *
     * @param event {JQuery.Event} [in] イベントオブジェクト
     */
    onPageRemove(event: JQuery.Event): void {
        this._commandView.remove();
        this._commandView = null;
        super.onPageRemove(event);
    }
}
