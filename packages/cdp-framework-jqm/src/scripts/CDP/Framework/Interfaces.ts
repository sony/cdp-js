/// <reference types="backbone" />

namespace CDP.Framework {

    // Backbone short cut
    export type  Model                                      = Backbone.Model;
    export const Model                                      = Backbone.Model;
    export type  Collection<TModel extends Model>           = Backbone.Collection<TModel>;
    export const Collection                                 = Backbone.Collection;
    export type  View<TModel extends Model = Model>         = Backbone.View<TModel>;
    export const View                                       = Backbone.View;
    export type  Events                                     = Backbone.Events;
    export const Events                                     = Backbone.Events;
    export type ModelSetOptions                             = Backbone.ModelSetOptions;
    export type ModelFetchOptions                           = Backbone.ModelFetchOptions;
    export type ModelSaveOptions                            = Backbone.ModelSaveOptions;
    export type ModelDestroyOptions                         = Backbone.ModelDestroyOptions;
    export type ViewOptions<TModel extends Model = Model>   = Backbone.ViewOptions<TModel>;

    /**
     * @en direction definitions.
     * @ja 遷移方向の定義.
     */
    export type PageTransitionDirection = "back" | "forward" | "same" | "unknown";

    /**
     * @en Argument of onShow/onBeforeShow method.
     * @ja onShow/onBeforeShow で渡される引数
     */
    export interface ShowEventData {
        /**
         * @en A jQuery collection object that contains the source page DOM element.
         * @ja 遷移前の画面情報を格納
         */
        prevPage: JQuery;

        /**
         * @en A jQuery collection object that contains the destination page DOM element.
         * @ja 遷移後の画面情報を格納
         */
        toPage: JQuery;

        /**
         * @en page transition direction.
         * @ja 遷移方向を格納
         */
        direction: PageTransitionDirection;
    }

    /**
     * @en Argument of onHide/onBeforeHide method.
     * @ja onHide/onBeforeHide で渡される引数
     */
    export interface HideEventData {
        /**
         * @en A jQuery collection object that contains the page DOM element to which we just transitioned.
         * @ja トランジション完了した画面情報を格納
         */
        nextPage: JQuery;

        /**
         * @en A jQuery collection object that contains the destination page DOM element.
         * @ja 遷移後の画面情報を格納
         */
        toPage: JQuery;

        /**
         * @en A jQuery collection object that contains the from page DOM element.
         * @ja 遷移前の画面情報を格納
         */
        prevPage: JQuery;

        /**
         * @en page transition direction.
         * @ja 遷移方向を格納
         */
        direction: PageTransitionDirection;
    }

    /**
     * @en Delegate interface of additional data for Page class. <br>
     *     Client can define extend type from it.
     *
     * @ja 任意の情報を格納するインターフェイス <br>
     *     Page に渡されるデータ。拡張して使用可能
     */
    export interface Intent {
        /**
         * @en any parameter. <br>
         *     params["queryParams"] is used by framework for query parameters.
         *
         * @ja 任意のパラメータ <br>
         *     params["queryParams"] には、query parameter がフレームワークにより格納される。
         */
        params?: object;
        /**
         * any parameters
         */
        [key: string]: any;
    }

    /**
     * @en Arguments interface of Router.registerPageStack() method.
     * @ja Router.registerPageStack() に指定するインターフェイス
     */
    export interface PageStack {
        /**
         * @en route string, it can be regular expression.
         * @ja ルーティング文字列 / 正規表現
         */
        route: string;

        /**
         * @en page title string.
         * @ja ページタイトル文字列
         */
        title?: string;

        /**
         * @en page transition string.
         * @ja 遷移トランジション文字列
         */
        transition?: string;
    }

    /**
     * @en interface of Router's Sub Flow paramenters.
     * @ja Router の Sub Flow に指定するパラメータインターフェイス
     */
    export interface SubFlowParam {
        /**
         * @en set sub flow operation [begin | end]. <br>
         *     When "begin" is set and then "end" is called, it can return to the URL specified as "base" with treating browser history.
         *
         * @ja Sub Flow 処理を指定 [begin | end] <br>
         *     "begin" が指定され、次に "end" を呼ぶとき、"base" に指定した url までブラウザ履歴をたどる。
         */
        operation: "begin" | "end";

        /**
         * @en Page URL/Hash used as the reference point of Sub Flow is specified. <br>
         *     When Sub Flow operation == "end" is specified, URL specified as navigate is disregarded. <br>
         *     If not set, this parameter is assigned the page called Router.navigate() with subFlow property.
         *
         * @ja Sub Flow の基点となるページ URL/Hash を指定。 <br>
         *     Sub Flow operation == "end" が指定される場合は、navigate に指定される URL は無視される。 <br>
         *     指定がない場合は Router.navigate() 時に subFlow を指定の呼び出し元がアサインされる。
         */
        destBase?: string;

        /**
         * @en PageStack from "destBase" which changes page at the time of the end of Sub Flow is specified. <br>
         *     When this parameter is no set, it changes page to "destBase".
         *
         * @ja Sub Flow 終了時に遷移する "destBase" からの PageStack を指定。指定がない場合は、"destBase" に遷移する。
         */
        destStacks?: PageStack[];
    }

    /**
     * @en Options interface of Router.start() method.
     * @ja Router.start() に指定するオプションインターフェイス
     */
    export interface RouterOptions extends Backbone.HistoryOptions {
        /**
         * @en If construct registered page instance, this param set true. default: true.
         * @ja 登録済みページを構築する場合 true. default: true
         */
        pageConstruct?: boolean;
    }

    /**
     * @en Options interface of Router.navigate() method.
     * @ja Router.navigate() に指定するオプションインターフェイス
     */
    export interface NavigateOptions extends Backbone.NavigateOptions {
        /**
         * @en overwrite: trigger default value is true.
         * @ja trigger の既定値は true として扱う
         */
        trigger?: boolean;

        /**
         * @en SubFlowParam is specified when performing Sub Flow processing.
         * @ja Sub Flow 処理を行う場合、SubFlowParam を指定
         */
        subFlow?: SubFlowParam;

        /**
         * @en set back operation destination.
         * @ja [戻る] 時に遷移するページ URL を指定
         */
        backDestination?: string;

        /**
         * @en no hash change flag in navigate operation.
         * @ja Navigate 時に Hash 変更しないフラグ
         */
        noHashChange?: boolean;

        /**
         * @en additional info interface.
         * @ja 付加情報インターフェイス
         */
        intent?: Intent;
    }

    /**
     * @en Handle orientation changed notify interface.
     * @ja Orientation の変更検知を受信するインターフェイス
     */
    export interface IOrientationChangedListener {
        /**
         * @en Received orientation code when that is changed.
         * @ja Orientation の変更を受信
         *
         * @param newOrientation
         * - `en` new orientation code.
         * - `ja` 変更後の orientation code
         */
        onOrientationChanged(newOrientation: Orientation): void;
    }

    /**
     * @en Handle H/W back button event notify interface.
     * @ja H/W Back button の event を受信するインターフェイス
     */
    export interface IBackButtonEventListener {
        /**
         * @en Received H/W Back Button event
         * @ja H/W Back Button ハンドラ
         *
         * @param event
         *  - `en` event object
         *  - `ja` イベントオブジェクト
         * @returns
         *  - `en` true: continue default operation / false: stop default operation
         *  - `ja` true: 既定の処理を行わない / false: 既定の処理を行う
         */
        onHardwareBackButton(event?: JQuery.Event): boolean;
    }

    /**
     * @en Framework generic command callback interface.
     * @ja 汎用コマンドコールバックインターフェイス
     */
    export interface ICommandListener {
        /**
         * @en Received generic command
         * @ja 汎用コマンドを受信
         *
         * @param  event
         *  - `en` event object
         *  - `ja` イベントオブジェクト
         * @param  kind
         *  - `en` command kind identifier
         *  - `ja` コマンド種別識別子
         * @returns
         *  - `en` true: continue default operation / false: stop default operation
         *  - `ja` true: 既定の処理を行わない / false: 既定の処理を行う
         */
        onCommand(event?: JQuery.Event, kind?: string): boolean;
    }

    /**
     * @en Interface class for storing registration info, using by Router.register() method.
     * @ja Router.register() で指定する登録情報を格納するインターフェイスクラス
     */
    export interface PageConstructOptions {
        /**
         * @en route identifier
         * @ja route 識別子
         */
        route?: string;

        /**
         * @en callback on changing route.
         * @ja route 変更時に呼び出されるコールバック
         */
        callback?: (...args: any[]) => boolean;

        /**
         * @en set "true" if application's top view.
         * @ja アプリケーションの top 画面である場合 true を指定
         */
        top?: boolean;

        /**
         * @en The instance of Page event listener instance.
         * @ja Page イベントを受信するリスナーインスタンス <br>
         *     機能拡張時に指定する
         */
        owner?: IPage;

        /**
         * @en intent instance is communicated next page when "intent" isn't designated specifically in navigation.
         * @ja 明示的に intent が指定されない場合においても intent を破棄しない場合は true を指定
         */
        keepIntent?: boolean;
    }

    /**
     * @en Interface of Page class.
     * @ja ページクラスのインターフェイスクラス
     */
    export interface IPage extends IOrientationChangedListener, IBackButtonEventListener, ICommandListener {
        /**
         * @en Return true if page is active.
         * @ja ページがアクティブである時 true
         */
        active: boolean;

        /**
         * @en Stored target page url.
         * @ja 対象のページ URL を格納
         */
        url: string;

        /**
         * @en Stored target page ID.
         * @ja 対象のページ ID を格納
         */
        id: string;

        /**
         * @en jQuery object of page.
         * @ja ページの jQuery オブジェクト
         */
        $page: JQuery;

        /**
         * @en jQuery object of page's header.
         * @ja ページヘッダの jQuery オブジェクト
         */
        $header: JQuery;

        /**
         * @en jQuery object of page's footer.
         * @ja ページフッタの jQuery オブジェクト
         */
        $footer: JQuery;

        /**
         * @en intent parameter passing between pages.
         * @ja ページ間で受け渡される intent オブジェクト
         */
        intent: Intent;

        /**
         * @en Received Router "before route change" event.
         * @ja Router "before route change" ハンドラ <br>
         *     ページ遷移直前に非同期処理を行うことが可能
         *
         * @returns
         *  - `en` promise object
         *  - `ja` Promise オブジェクト
         */
        onBeforeRouteChange(): IPromiseBase<any>;

        /**
         * @en It's called only when before the first OnPageInit().
         * @ja 最初の OnPageInit() のときにのみコールされる
         */
        onInitialize(event: JQuery.Event): void;

        /**
         * @en Event handler of jQM event: "pagebeforecreate".
         * @ja jQM event: "pagebeforecreate" に対応
         */
        onPageBeforeCreate(event: JQuery.Event): void;

        /**
         * @en Event handler of jQM event: "pagecreate" (previous version defined "pageinit").
         * @ja jQM event: "pagecreate" (旧:"pageinit") に対応
         */
        onPageInit(event: JQuery.Event): void;

        /**
         * @en Event handler of jQM event: "pagebeforeshow"
         * @ja jQM event: "pagebeforeshow" に対応
         *
         * @param event
         *  - `en` event object
         *  - `ja` イベントオブジェクト
         * @param data
         *  - `en` additional information
         *  - `ja` 付加情報
         */
        onPageBeforeShow(event: JQuery.Event, data?: ShowEventData): void;

        /**
         * @en Event handler of jQM event: "pagecontainershow" (previous version defined "pageshow").
         * @ja jQM event: "pagecontainershow" (旧:"pageshow") に対応
         *
         * @param event
         *  - `en` event object
         *  - `ja` イベントオブジェクト
         * @param data
         *  - `en` additional information
         *  - `ja` 付加情報
         */
        onPageShow(event: JQuery.Event, data?: ShowEventData): void;

        /**
         * @en Event handler of jQM event: "pagebeforehide".
         * @ja jQM event: "pagebeforehide" に対応
         *
         * @param event
         *  - `en` event object
         *  - `ja` イベントオブジェクト
         * @param data
         *  - `en` additional information
         *  - `ja` 付加情報
         */
        onPageBeforeHide(event: JQuery.Event, data?: HideEventData): void;

        /**
         * @en Event handler of jQM event: "pagecontainerhide" (previous version defined "pagehide").
         * @ja jQM event: "pagecontainerhide" (旧:"pagehide") に対応
         *
         * @param event
         *  - `en` event object
         *  - `ja` イベントオブジェクト
         * @param data
         *  - `en` additional information
         *  - `ja` 付加情報
         */
        onPageHide(event: JQuery.Event, data?: HideEventData): void;

        /**
         * @en Event handler of jQM event: "pageremove".
         * @ja jQM event: "pageremove" に対応
         */
        onPageRemove(event: JQuery.Event): void;
    }
}

declare module "cdp.framework.jqm" {
    const Framework: typeof CDP.Framework;
    export = Framework;
}
