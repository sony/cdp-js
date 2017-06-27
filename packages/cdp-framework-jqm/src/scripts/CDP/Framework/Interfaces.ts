/// <reference types="backbone" />

namespace CDP.Framework {

    // Backbone short cut
    export type  Model                              = Backbone.Model;
    export const Model                              = Backbone.Model;
    export type  Collection<TModel extends Model>   = Backbone.Collection<TModel>;
    export const Collection                         = Backbone.Collection;
    export type  View<TModel extends Model = Model> = Backbone.View<TModel>;
    export const View                               = Backbone.View;
    export type  Events                             = Backbone.Events;
    export const Events                             = Backbone.Events;

    /**
     * \~english
     * @type  PageTransitionDirection
     * @brief direction definitions.
     *
     * \~japanese
     * @type  PageTransitionDirection
     * @brief 遷移方向の定義.
     */
    export type PageTransitionDirection = "back" | "forward" | "same" | "unknown";

    /**
     * \~english
     * @interface ShowEventData
     * @brief     Argument of onShow/onBeforeShow method.
     *
     * \~japanese
     * @interface ShowEventData
     * @brief     onShow/onBeforeShow で渡される引数
     */
    export interface ShowEventData {
        /**
         * \~english
         * A jQuery collection object that contains the source page DOM element.
         *
         * \~japanese
         * 遷移前の画面情報を格納
         */
        prevPage: JQuery;

        /**
         * \~english
         * A jQuery collection object that contains the destination page DOM element.
         *
         * \~japanese
         * 遷移後の画面情報を格納
         */
        toPage: JQuery;

        /**
         * \~english
         * page transition direction.
         *
         * \~japanese
         * 遷移方向を格納
         */
        direction: PageTransitionDirection;
    }

    /**
     * \~english
     * @interface HideEventData
     * @brief     Argument of onHide/onBeforeHide method.
     *
     * \~japanese
     * @interface HideEventData
     * @brief     onHide/onBeforeHide で渡される引数
     */
    export interface HideEventData {
        /**
         * \~english
         * A jQuery collection object that contains the page DOM element to which we just transitioned.
         *
         * \~japanese
         * トランジション完了した画面情報を格納
         */
        nextPage: JQuery;

        /**
         * \~english
         * A jQuery collection object that contains the destination page DOM element.
         *
         * \~japanese
         * 遷移後の画面情報を格納
         */
        toPage: JQuery;

        /**
         * \~english
         * A jQuery collection object that contains the from page DOM element.
         *
         * \~japanese
         * 遷移前の画面情報を格納
         */
        prevPage: JQuery;

        /**
         * \~english
         * page transition direction.
         *
         * \~japanese
         * 遷移方向を格納
         */
        direction: PageTransitionDirection;
    }

    /**
     * \~english
     * @interface Intent
     * @brief     Delegate interface of additional data for Page class.
     *            Client can define extend type from it.
     *
     * \~japanese
     * @interface Intent
     * @brief     任意の情報を格納するインターフェイス
     *            Page に渡されるデータ。拡張して使用可能
     */
    export interface Intent {
        /**
         * \~english
         * any parameter.
         * params["queryParams"] is used by framework for query parameters.
         *
         * \~japanese
         * 任意のパラメータ
         * params["queryParams"] には、query parameter がフレームワークにより格納される。
         */
        params?: object;
        //! any
        [key: string]: any;
    }

    /**
     * \~english
     * @interface PageStack
     * @brief Arguments interface of Router.registerPageStack() method.
     *
     * \~japanese
     * @interface PageStack
     * @brief Router.registerPageStack() に指定するインターフェイス
     */
    export interface PageStack {
        /**
         * \~english
         * route string, it can be regular expression.
         *
         * \~japanese
         * ルーティング文字列 / 正規表現
         */
        route: string;

        /**
         * \~english
         * page title string.
         *
         * \~japanese
         * ページタイトル文字列
         */
        title?: string;

        /**
         * \~english
         * page transition string.
         *
         * \~japanese
         * 遷移トランジション文字列
         */
        transition?: string;
    }

    /**
     * \~english
     * @interface SubFlowParam
     * @brief interface of Router's Sub Flow paramenters.
     *
     * \~japanese
     * @interface SubFlowParam
     * @brief Router の Sub Flow に指定するパラメータインターフェイス
     */
    export interface SubFlowParam {
        /**
         * \~english
         * set sub flow operation [begin | end].
         * When "begin" is set and then "end" is called, it can return to the URL specified as "base" with treating browser history.
         *
         * \~japanese
         * Sub Flow 処理を指定 [begin | end]
         * "begin" が指定され、次に "end" を呼ぶとき、"base" に指定した url までブラウザ履歴をたどる。
         */
        operation: "begin" | "end";

        /**
         * \~english
         * Page URL/Hash used as the reference point of Sub Flow is specified.
         * When Sub Flow operation == "end" is specified, URL specified as navigate is disregarded.
         * If not set, this parameter is assigned the page called Router.navigate() with subFlow property.
         *
         * \~japanese
         * Sub Flow の基点となるページ URL/Hash を指定。
         * Sub Flow operation == "end" が指定される場合は、navigate に指定される URL は無視される。
         * 指定がない場合は Router.navigate() 時に subFlow を指定の呼び出し元がアサインされる。
         */
        destBase?: string;

        /**
         * \~english
         * PageStack from "destBase" which changes page at the time of the end of Sub Flow is specified.
         * When this parameter is no set, it changes page to "destBase".
         *
         * \~japanese
         * Sub Flow 終了時に遷移する "destBase" からの PageStack を指定。指定がない場合は、"destBase" に遷移する。
         */
        destStacks?: PageStack[];
    }

    /**
     * \~english
     * @interface RouterOptions
     * @brief Options interface of Router.start() method.
     *
     * \~japanese
     * @interface RouterOptions
     * @brief Router.start() に指定するオプションインターフェイス
     */
    export interface RouterOptions extends Backbone.HistoryOptions {
        pageConstruct?: boolean;    // 登録済みページを構築する場合 true. default: true
    }

    /**
     * \~english
     * @interface NavigateOptions
     * @brief Options interface of Router.navigate() method.
     *
     * \~japanese
     * @interface NavigateOptions
     * @brief Router.navigate() に指定するオプションインターフェイス
     */
    export interface NavigateOptions extends Backbone.NavigateOptions {
        /**
         * \~english
         * overwrite: trigger default value is true.
         *
         * \~japanese
         * trigger の既定値は true として扱う
         */
        trigger?: boolean;

        /**
         * \~english
         * SubFlowParam is specified when performing Sub Flow processing.
         *
         * \~japanese
         * Sub Flow 処理を行う場合、SubFlowParam を指定
         */
        subFlow?: SubFlowParam;

        /**
         * \~english
         * set back operation destination.
         *
         * \~japanese
         * [戻る] 時に遷移するページ URL を指定
         */
        backDestination?: string;

        /**
         * \~english
         * no hash change flag in navigate operation.
         *
         * \~japanese
         * Navigate 時に Hash 変更しないフラグ
         */
        noHashChange?: boolean;

        /**
         * \~english
         * additional info interface.
         *
         * \~japanese
         * 付加情報インターフェイス
         */
        intent?: Intent;
    }

    /**
     * \~english
     * @interface IOrientationChangedListener
     * @brief Handle orientation changed notify interface.
     *
     * \~japanese
     * @interface IOrientationChangedListener
     * @brief Orientation の変更検知を受信するインターフェイス
     */
    export interface IOrientationChangedListener {
        /**
         * \~english
         * Received orientation code when that is changed.
         *
         * @param newOrientation {Orientation} [in] new orientation code.
         *
         * \~japanese
         * Orientation の変更を受信
         *
         * @param newOrientation {Orientation} [in] new orientation code.
         */
        onOrientationChanged(newOrientation: Orientation): void;
    }

    /**
     * \~english
     * @interface IBackButtonEventListener
     * @brief Handle H/W back button event notify interface.
     *
     * \~japanese
     * @interface IBackButtonEventListener
     * @brief H/W Back button の event を受信するインターフェイス
     */
    export interface IBackButtonEventListener {
        /**
         * \~english
         * Received H/W Back Button event
         *
         * @param  event {JQuery.Event} [in] event object
         * @return {Boolean} true: continue default operation / false: stop default operation
         *
         * \~japanese
         * H/W Back Button ハンドラ
         *
         * @param  event {JQuery.Event} [in] event object
         * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
         */
        onHardwareBackButton(event?: JQuery.Event): boolean;
    }

    /**
     * \~english
     * @interface ICommandListener
     * @brief Framework generic command callback interface.
     *
     * \~japanese
     * @interface ICommandListener
     * @brief 汎用コマンドコールバックインターフェイス
     */
    export interface ICommandListener {
        /**
         * \~english
         * Received generic command
         *
         * @param  event {JQuery.Event} [in] event object
         * @param  event {kind}              [in] command kind string
         * @return {Boolean} true: continue default operation / false: stop default operation
         *
         * \~japanese
         * 汎用コマンドを受信
         *
         * @param  event {JQuery.Event} [in] event object
         * @param  event {kind}              [in] command kind string
         * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
         */
        onCommand(event?: JQuery.Event, kind?: string): boolean;
    }

    /**
     * \~english
     * @interface PageConstructOptions
     * @brief Interface class for storing registration info, using by Router.register() method.
     *
     * \~japanese
     * @interface PageConstructOptions
     * @brief Router.register() で指定する登録情報を格納するインターフェイスクラス
     */
    export interface PageConstructOptions {
        /**
         * \~english
         * route identifier
         *
         * \~japanese
         * route 識別子
         */
        route?: string;

        /**
         * \~english
         * callback on changing route.
         *
         * \~japanese
         * route 変更時に呼び出されるコールバック
         */
        callback?: (...args: any[]) => boolean;

        /**
         * \~english
         * set "true" if application's top view.
         *
         * \~japanese
         * アプリケーションの top 画面である場合 true を指定
         */
        top?: boolean;

        /**
         * \~english
         * The instance of Page event listener instance.
         *
         * \~japanese
         * Page イベントを受信するリスナーインスタンス
         * 機能拡張時に指定する
         */
        owner?: IPage;

        /**
         * \~english
         * intent instance is communicated next page when "intent" isn't designated specifically in navigation.
         *
         * \~japanese
         * 明示的に intent が指定されない場合においても
         * intent を破棄しない場合は true を指定
         */
        keepIntent?: boolean;
    }

    /**
     * \~english
     * @interface IPage
     * @brief Interface of Page class.
     *
     * \~japanese
     * @interface IPage
     * @brief ページクラスのインターフェイスクラス
     */
    export interface IPage extends IOrientationChangedListener, IBackButtonEventListener, ICommandListener {
        /**
         * \~english
         * Return true if page is active.
         *
         * \~japanese
         * ページがアクティブである時 true
         */
        active: boolean;

        /**
         * \~english
         * Stored target page url.
         *
         * \~japanese
         * 対象のページ URL を格納
         */
        url: string;

        /**
         * \~english
         * Stored target page ID.
         *
         * \~japanese
         * 対象のページ ID を格納
         */
        id: string;

        /**
         * \~english
         * jQuery object of page.
         *
         * \~japanese
         * ページの jQuery オブジェクト
         */
        $page: JQuery;

        /**
         * \~english
         * jQuery object of page's header.
         *
         * \~japanese
         * ページヘッダの jQuery オブジェクト
         */
        $header: JQuery;

        /**
         * \~english
         * jQuery object of page's footer.
         *
         * \~japanese
         * ページフッタの jQuery オブジェクト
         */
        $footer: JQuery;

        /**
         * \~english
         * intent parameter passing between pages.
         *
         * \~japanese
         * ページ間で受け渡される intent オブジェクト
         */
        intent: Intent;

        /**
         * \~english
         * Received Router "before route change" event.
         *
         * @return {IPromiseBase} jQueryPromise Object
         *
         * \~japanese
         * Router "before route change" ハンドラ
         * ページ遷移直前に非同期処理を行うことが可能
         *
         * @return {IPromiseBase} Promise オブジェクト
         */
        onBeforeRouteChange(): IPromiseBase<any>;

        /**
         * \~english
         * It's called only when before the first OnPageInit().
         *
         * @param event {JQuery.Event} [in] event object
         *
         * \~japanese
         * 最初の OnPageInit() のときにのみコールされる
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         */
        onInitialize(event: JQuery.Event): void;

        /**
         * \~english
         * Event handler of jQM event: "pagebeforecreate".
         *
         * @param event {JQuery.Event} [in] event object
         *
         * \~japanese
         * jQM event: "pagebeforecreate" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         */
        onPageBeforeCreate(event: JQuery.Event): void;

        /**
         * \~english
         * Event handler of jQM event: "pagecreate" (previous version defined "pageinit").
         *
         * @param event {JQuery.Event} [in] event object
         *
         * \~japanese
         * jQM event: "pagecreate" (旧:"pageinit") に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         */
        onPageInit(event: JQuery.Event): void;

        /**
         * \~english
         * Event handler of jQM event: "pagebeforeshow"
         *
         * @param event {JQuery.Event} [in] event object
         * @param data  {ShowEventData}     [in] additional info
         *
         * \~japanese
         * jQM event: "pagebeforeshow" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         * @param data  {ShowEventData}     [in] 付加情報
         */
        onPageBeforeShow(event: JQuery.Event, data?: ShowEventData): void;

        /**
         * \~english
         * Event handler of jQM event: "pagecontainershow" (previous version defined "pageshow").
         *
         * @param event {JQuery.Event} [in] event object
         * @param data  {ShowEventData}     [in] additional info
         *
         * \~japanese
         * jQM event: "pagecontainershow" (旧:"pageshow") に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         * @param data  {ShowEventData}     [in] 付加情報
         */
        onPageShow(event: JQuery.Event, data?: ShowEventData): void;

        /**
         * \~english
         * Event handler of jQM event: "pagebeforehide".
         *
         * @param event {JQuery.Event} [in] event object
         * @param data  {HideEventData}     [in] additional info
         *
         * \~japanese
         * jQM event: "pagebeforehide" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         * @param data  {HideEventData}     [in] 付加情報
         */
        onPageBeforeHide(event: JQuery.Event, data?: HideEventData): void;

        /**
         * \~english
         * Event handler of jQM event: "pagecontainerhide" (previous version defined "pagehide").
         *
         * @param event {JQuery.Event} [in] event object
         * @param data  {HideEventData}     [in] additional info
         *
         * \~japanese
         * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         * @param data  {HideEventData}     [in] 付加情報
         */
        onPageHide(event: JQuery.Event, data?: HideEventData): void;

        /**
         * \~english
         * Event handler of jQM event: "pageremove".
         *
         * @param event {JQuery.Event} [in] event object
         *
         * \~japanese
         * jQM event: "pageremove" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         */
        onPageRemove(event: JQuery.Event): void;
    }
}

declare module "cdp.framework.jqm" {
    export = CDP.Framework;
}
