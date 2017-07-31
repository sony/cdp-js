/* tslint:disable:max-line-length */

namespace CDP.UI {
    import Framework = CDP.Framework;

    const TAG = "[CDP.UI.PageContainerView] ";

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
            // set event listener
            this.listenTo(this._owner, PAGEVIEW_EVENTS.ORIENTATION_CHANGED, this.onOrientationChanged.bind(this));
            this.listenTo(this._owner, PAGEVIEW_EVENTS.INITIALZSE, this.onInitialize.bind(this));
            this.listenTo(this._owner, PAGEVIEW_EVENTS.PAGE_BEFORE_CREATE, this.onPageBeforeCreate.bind(this));
            this.listenTo(this._owner, PAGEVIEW_EVENTS.PAGE_INIT, this.onPageInit.bind(this));
            this.listenTo(this._owner, PAGEVIEW_EVENTS.PAGE_BEFORE_SHOW, this.onPageBeforeShow.bind(this));
            this.listenTo(this._owner, PAGEVIEW_EVENTS.PAGE_SHOW, this.onPageShow.bind(this));
            this.listenTo(this._owner, PAGEVIEW_EVENTS.PAGE_BEFORE_HIDE, this.onPageBeforeHide.bind(this));
            this.listenTo(this._owner, PAGEVIEW_EVENTS.PAGE_HIDE, this.onPageHide.bind(this));
            this.listenTo(this._owner, PAGEVIEW_EVENTS.PAGE_REMOVE, this.onPageRemove.bind(this));
        }

        ///////////////////////////////////////////////////////////////////////
        // short cut methods

        //! Owner 取得
        get owner(): PageView {
            return this._owner;
        }

        ///////////////////////////////////////////////////////////////////////
        // Handle PageView events

        /**
         * Orientation の変更を受信
         *
         * @param newOrientation {Orientation} [in] new orientation code.
         */
        onOrientationChanged(newOrientation: Framework.Orientation): void {
            // Override
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
            // Override
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
            this.stopListening();
        }
    }
}
