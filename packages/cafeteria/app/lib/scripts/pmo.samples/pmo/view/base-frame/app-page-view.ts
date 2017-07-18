import {
    IPromiseBase,
    Promise,
    NavigateOptions,
} from "cdp/framework";
import {
    PageView,
    PageViewConstructOptions,
    PageContainerView,
    PageContainerViewOptions,
    ShowEventData,
} from "cdp/ui";
import { Settings } from "../../model/_entry";
import { IAppPageBase, AppPageBase } from "./app-page-base";

const TAG = "[pmo.view.base-frame.AppPageView] ";

/**
 * @interface AppPageViewConstructOptions
 * @brief Router への登録情報と Backbone.View への初期化情報を格納するインターフェイスクラス
 */
export interface AppPageViewConstructOptions extends PageViewConstructOptions {
    showNativeScrollBar?: boolean;    // native のスクロールバーを表示する場合 true.
}

/**
 * @class AppPageContainerView
 * @brief PageView と連携可能な コンテナビュークラス
 */
export class AppPageContainerView extends PageContainerView {

    /**
     * constructor
     */
    constructor(options: PageContainerViewOptions) {
        super(options);
    }

    ///////////////////////////////////////////////////////////////////////
    // short cut methods

    // Owner 取得
    getAppPage(): IAppPageBase {
        return (<any>this.owner);
    }

    // アクティブモードの取得
    getActiveMode(): string {
        return this.getAppPage().getActiveMode();
    }

    // ページ遷移
    navigate(url: string, options?: NavigateOptions): void {
        return this.getAppPage().navigate(url, options);
    }

    // エラー出力
    errorLog(message: string, error: any): void {
        this.getAppPage().errorLog(message, error);
    }
}

//___________________________________________________________________________________________________________________//

/**
 * @class AppPageView
 * @brief CommandView を持つページの基底クラス
 *        CDP.Framework.Page と Backbone.View の両方の機能を提供する
 */
export class AppPageView extends PageView implements IAppPageBase {

    /**
     * constructor
     *
     * @param _url    {String}                   [in] ページ URL
     * @param _id     {String}                   [in] ページ ID
     * @param options {PageViewConstructOptions} [in] オプション
     */
    constructor(url: string, id: string, options?: AppPageViewConstructOptions) {
        /*
         * basePage に Application 共通の Page クラスを指定
         * PageView, PageListView で処理を共通化する。
         *
         * TypeScript では C++ の template とは異なるため、以下は記述不可.
         *
         *    class Hoge<Traits> {
         *       extends Traits // error. クラスからのみ派生できます
         *    }
         *
         *    class AppContext;
         *    class ExHoge<AppContext> {
         *      :
         *    }
         */
        super(url, id, $.extend({}, { basePage: AppPageBase, }, options));
    }

    // option access
    private get pageOptions(): AppPageViewConstructOptions {
        return this._pageOptions;
    }

    // option access
    private get basePage(): IAppPageBase {
        return (<any>this._basePage);
    }

    ///////////////////////////////////////////////////////////////////////
    // 共通操作

    // UI Theme を取得
    getUITheme(): string {
        return this.basePage.getUITheme();
    }

    // アクティブモードの設定
    setActiveMode(mode: string): void {
        this.basePage.setActiveMode(mode);
    }

    // アクティブモードの取得
    getActiveMode(): string {
        return this.basePage.getActiveMode();
    }

    // アクティブな command set オブジェクトを取得
    getActiveCommandSet(): JQuery {
        return this.basePage.getActiveCommandSet();
    }

    // タイトル設定
    setTitle(title: string): void {
        this.basePage.setTitle(title);
    }

    // ページ遷移
    navigate(url: string, options?: NavigateOptions): void {
        this.basePage.navigate(url, options);
    }

    // エラー出力
    errorLog(message: string, error: any): void {
        this.basePage.errorLog(message, error);
    }

    ///////////////////////////////////////////////////////////////////////
    // Generic Event Handler

    /**
     * ページ遷移直前イベント処理
     *
     * @return {jQueryPromise} 非同期オブジェクト
     */
    onBeforeRouteChange(): IPromiseBase<any> {
        return new Promise((resolve) => {
            if (this.active && this.pageOptions.showNativeScrollBar) {
                // Naive Scrollbar を隠す
//              NativeTools.WebViewInfo.hideScrollBar(NativeTools.WebViewInfo.ScrollBarType.VERTICAL)
//              .always(() => {
                    resolve();
//              });
            } else {
                resolve();
            }
        });
    }

    // Account 情報の変更検知
    onAccountInfoChanged(settings: Settings): void {
        console.log(TAG + "onAccountChanged(" + settings.get("account.userId") + ")");
    }

    ///////////////////////////////////////////////////////////////////////
    // Command Event Handler

    // .command-icon.withindicator のコールバック
    onCommandBack(event?: JQuery.Event): boolean {
        return false;
    }

    // .command-icon.done のコールバック
    onCommandDone(event?: JQuery.Event): void {
        console.log(TAG + "onCommandDone");
    }

    // .command-button.add のコールバック
    onCommandAdd(event?: JQuery.Event): void {
        console.log(TAG + "onCommandAdd");
    }

    // .command-button.delete のコールバック
    onCommandDelete(event?: JQuery.Event): void {
        console.log(TAG + "onCommandDelete");
    }

    // .command-button.edit のコールバック
    onCommandEdit(event?: JQuery.Event): void {
        console.log(TAG + "onCommandEdit");
    }

    // .command-button.notification のコールバック
    onCommandNotification(event?: JQuery.Event): void {
        console.log(TAG + "onCommandNotification");
    }

    // .command-button.photo のコールバック
    onCommandPhoto(event?: JQuery.Event): void {
        console.log(TAG + "onCommandPhoto");
    }

    // .command-button.play のコールバック
    onCommandPlay(event?: JQuery.Event): void {
        console.log(TAG + "onCommandPlay");
    }

    // .command-button.refresh のコールバック
    onCommandRefresh(event?: JQuery.Event): void {
        console.log(TAG + "onCommandRefresh");
    }

    // .command-button.share のコールバック
    onCommandShare(event?: JQuery.Event): void {
        console.log(TAG + "onCommandShare");
    }

    // .command-button.overflow のコールバック
    onCommandOverflow(event?: JQuery.Event): boolean {
        return false;
    }

    // overflow menu 表示
    showOverflowMenu($overflow: JQuery, options: PopupOptions): void {
        this.basePage.showOverflowMenu($overflow, options);
    }

    // active mode に対応した overflow menu の取得
    getActiveOverflowMenu(): JQuery {
        return this.basePage.getActiveOverflowMenu();
    }

    // popup オプションの作成
    makePopupOptions($overflow: JQuery): PopupOptions {
        return this.basePage.makePopupOptions($overflow);
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageBase stub stuff.

    // 汎用コマンドのコールバック
    onCommand(event?: JQuery.Event, kind?: string): boolean {
        console.log(TAG + "onCommand(" + kind + ")");
        return super.onCommand(event, kind);
    }

    /**
     * jQM event: "pagecontainershow" (旧:"pageshow") に対応
     *
     * @param event {JQuery.Event} [in] イベントオブジェクト
     * @param data  {ShowEventData}     [in] 付加情報
     */
    onPageShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageShow(event, data);
        // Naive Scrollbar を表示
        if (this.pageOptions.showNativeScrollBar) {
//          NativeTools.WebViewInfo.showScrollBar(NativeTools.WebViewInfo.ScrollBarType.VERTICAL);
        }
    }
}
