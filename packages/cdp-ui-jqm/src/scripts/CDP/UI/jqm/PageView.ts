/* tslint:disable:max-line-length */

namespace CDP.UI {
    import Promise      = CDP.Promise;
    import Framework    = CDP.Framework;

    const TAG = "[CDP.UI.PageView] ";

    /**
     * @interface PageViewConstructOptions
     * @brief Router への登録情報と Backbone.View への初期化情報を格納するインターフェイスクラス
     */
    export interface PageViewConstructOptions<TModel extends Framework.Model = Framework.Model> extends BasePageOptions<TModel> {
        basePage?: new (url: string, id: string, options?: Framework.PageConstructOptions) => Framework.Page;    //!< Page 機能を提供する基底インスタンス
    }

    /* tslint:disable:no-use-before-declare */
    /**
     * @interface PageContainerViewOptions
     * @brief PageContainer のオプション
     */
    export interface PageContainerViewOptions<TModel extends Framework.Model = Framework.Model> extends Framework.ViewOptions<TModel> {
        owner: PageView;
        $el?: JQuery;
    }

    /**
     * @class PageContainerView
     * @brief PageView と連携可能な コンテナビュークラス
     */
    export class PageContainerView<TModel extends Framework.Model = Framework.Model> extends Framework.View<TModel> {

        private _owner: PageView = null;

        /**
         * constructor
         */
        constructor(options: PageContainerViewOptions<TModel>) {
            super(options);
            this._owner = options.owner;
            if (options.$el) {
                const delegates = (<any>this).events ? true : false;
                this.setElement(options.$el, delegates);
            }
        }

        ///////////////////////////////////////////////////////////////////////
        // short cut methods

        //! Owner 取得
        get owner(): PageView {
            return this._owner;
        }
    }
    /* tslint:enable:no-use-before-declare */

    //___________________________________________________________________________________________________________________//

    /**
     * @class PageView
     * @brief CDP.Framework.Page と Backbone.View の両方の機能を提供するページの基底クラス
     */
    export class PageView<TModel extends Framework.Model = Framework.Model> extends Framework.View<TModel> implements Framework.IPage, IStatusManager {

        protected _pageOptions: PageViewConstructOptions<TModel> = null;
        protected _basePage: Framework.Page = null;
        private _statusMgr: StatusManager = null;

        /**
         * constructor
         *
         * @param url     {String}                   [in] ページ URL
         * @param id      {String}                   [in] ページ ID
         * @param options {PageViewConstructOptions} [in] オプション
         */
        constructor(url: string, id: string, options?: PageViewConstructOptions<TModel>) {
            super(options);

            // PageView 設定
            this._pageOptions = $.extend({}, { owner: this }, options);
            this._basePage = this._pageOptions.basePage ? new this._pageOptions.basePage(url, id, this._pageOptions) : new BasePage(url, id, this._pageOptions);

            // StatusManager
            this._statusMgr = new StatusManager();
            // Backbone.View 用の初期化
            const delegates = (<any>this).events ? true : false;
            this.setElement(this.$page, delegates);
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IStatusManager 状態管理

        /**
         * 状態変数の参照カウントのインクリメント
         *
         * @param status {String} [in] 状態識別子
         */
        statusAddRef(status: string): number {
            return this._statusMgr.statusAddRef(status);
        }

        /**
         * 状態変数の参照カウントのデクリメント
         *
         * @param status {String} [in] 状態識別子
         */
        statusRelease(status: string): number {
            return this._statusMgr.statusRelease(status);
        }

        /**
         * 処理スコープ毎に状態変数を設定
         *
         * @param status   {String}   [in] 状態識別子
         * @param callback {Function} [in] 処理コールバック
         */
        statusScope(status: string, callback: () => void | Promise<any>): void {
            this._statusMgr.statusScope(status, callback);
        }

        /**
         * 指定した状態中であるか確認
         *
         * @param status {String}   [in] 状態識別子
         * @return {Boolean} true: 状態内 / false: 状態外
         */
        isStatusIn(status: string): boolean {
            return this._statusMgr.isStatusIn(status);
        }

        ///////////////////////////////////////////////////////////////////////
        // IPage stub stuff.

        get active(): boolean                   { return this._basePage.active;                     }
        get url(): string                       { return this._basePage.url;                        }
        get id(): string                        { return this._basePage ? this._basePage.id : null; }
        get $page(): JQuery                     { return this._basePage.$page;                      }
        get $header(): JQuery                   { return this._basePage.$header;                    }
        get $footer(): JQuery                   { return this._basePage.$footer;                    }
        get intent(): Framework.Intent          { return this._basePage.intent;                     }
        set intent(newIntent: Framework.Intent) { this._basePage.intent = newIntent;                }

        /**
         * Orientation の変更を受信
         *
         * @param newOrientation {Orientation} [in] new orientation code.
         */
        onOrientationChanged(newOrientation: Framework.Orientation): void {
            // Override
        }

        /**
         * H/W Back Button ハンドラ
         *
         * @param  event {JQuery.Event} [in] event object
         * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
         */
        onHardwareBackButton(event?: JQuery.Event): boolean {
            return false;
        }

        /**
         * Router "before route change" ハンドラ
         * ページ遷移直前に非同期処理を行うことが可能
         *
         * @return {IPromiseBase} Promise オブジェクト
         */
        onBeforeRouteChange(): IPromiseBase<any> {
            return Promise.resolve();
        }

        /**
         * 汎用コマンドを受信
         *
         * @param  event {JQuery.Event} [in] event object
         * @param  event {kind}              [in] command kind string
         * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
         */
        onCommand(event?: JQuery.Event, kind?: string): boolean {
            return false;
        }

        /**
         * 最初の OnPageInit() のときにのみコールされる
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         */
        onInitialize(event: JQuery.Event): void {
            // Override
        }

        /**
         * jQM event: "pagebeforecreate" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         */
        onPageBeforeCreate(event: JQuery.Event): void {
            this.setElement(this.$page, true);
        }

        /**
         * jQM event: "pagecreate" (旧:"pageinit") に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         */
        onPageInit(event: JQuery.Event): void {
            // Override
        }

        /**
         * jQM event: "pagebeforeshow" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         * @param data  {ShowEventData}     [in] 付加情報
         */
        onPageBeforeShow(event: JQuery.Event, data?: Framework.ShowEventData): void {
            // Override
        }

        /**
         * jQM event: "pagecontainershow" (旧:"pageshow") に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         * @param data  {ShowEventData}     [in] 付加情報
         */
        onPageShow(event: JQuery.Event, data?: Framework.ShowEventData): void {
            // Override
        }

        /**
         * jQM event: "pagebeforehide" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         * @param data  {HideEventData}     [in] 付加情報
         */
        onPageBeforeHide(event: JQuery.Event, data?: Framework.HideEventData): void {
            // Override
        }

        /**
         * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         * @param data  {HideEventData}     [in] 付加情報
         */
        onPageHide(event: JQuery.Event, data?: Framework.HideEventData): void {
            // Override
        }

        /**
         * jQM event: "pageremove" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         */
        onPageRemove(event: JQuery.Event): void {
            this.remove();
            this.el  = null;
            this.$el = null;
        }
    }
}
