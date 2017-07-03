/* tslint:disable:max-line-length */

namespace CDP.UI {

    import Framework = CDP.Framework;

    const TAG: string = "[CDP.UI.BasePage] ";

    /**
     * @interface BasePageOptions
     * @brief BasePage に指定するオプションインターフェイス
     */
    export interface BasePageOptions<TModel extends Framework.Model = Framework.Model> extends Framework.PageConstructOptions, BaseHeaderViewOptions<TModel> {
        baseHeader?: new (owner: Framework.IPage, options?: BaseHeaderViewOptions<TModel>) => BaseHeaderView<TModel>;   //!< Header 機能を提供する基底インスタンス
        backCommandHandler?: string;                //!< "戻る" コマンドハンドラメソッド名.                             default: onPageBack
        domExtensionOptions?: DomExtensionOptions;  //!< DOM拡張に渡すオプション. null|undefined を指定すると拡張しない default: {}
    }

    //__________________________________________________________________________________________________________//

    /**
     * @class BasePage
     * @brief Header を備える Page クラス
     */
    export class BasePage<TModel extends Framework.Model = Framework.Model> extends Framework.Page {

        private _baseHeader: BaseHeaderView<TModel>;    //!< ヘッダクラス

        /**
         * constructor
         *
         * @param {String}          url       [in] ページ URL
         * @param {String}          id        [in] ページ ID
         * @param {BasePageOptions} [options] [in] オプション
         */
        constructor(url: string, id: string, private _options?: BasePageOptions<TModel>) {
            super(url, id, _options = $.extend({
                baseHeader: BaseHeaderView,
                backCommandHandler: "onPageBack",
                backCommandKind: "pageback",
                domExtensionOptions: {},
            }, _options));
        }

        ///////////////////////////////////////////////////////////////////////
        // Override: Framework Page

        /**
         * jQM event: "pagebeforecreate" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         */
        onPageBeforeCreate(event: JQuery.Event): void {
            if (this._options.baseHeader) {
                this._baseHeader = new this._options.baseHeader(this, this._options);
                this._baseHeader.create();
            }
            super.onPageBeforeCreate(event);
        }

        /**
         * jQM event: "pagecreate" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         */
        onPageInit(event: JQuery.Event): void {
            if (null != this._options.domExtensionOptions) {
                ExtensionManager.applyDomExtension(this.$page, this._options.domExtensionOptions);
            }
            super.onPageInit(event);
        }

        /**
         * jQM event: "pagebeforeshow" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         * @param data  {ShowEventData}     [in] 付加情報
         */
        onPageBeforeShow(event: JQuery.Event, data?: Framework.ShowEventData): void {
            if (this._baseHeader) {
                this._baseHeader.activate();
            }
            super.onPageBeforeShow(event, data);
        }

        /**
         * jQM event: "pagebeforehide" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         * @param data  {HideEventData}     [in] 付加情報
         */
        onPageBeforeHide(event: JQuery.Event, data?: Framework.HideEventData): void {
            if (this._baseHeader) {
                this._baseHeader.inactivate();
            }
            super.onPageBeforeHide(event, data);
        }

        /**
         * jQM event: "pageremove" に対応
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         */
        onPageRemove(event: JQuery.Event): void {
            if (this._baseHeader) {
                this._baseHeader.release();
                this._baseHeader = null;
            }
            super.onPageRemove(event);
        }

        /**
         * H/W Back Button ハンドラ
         *
         * @param  event {JQuery.Event} [in] event object
         * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
         */
        onHardwareBackButton(event?: JQuery.Event): boolean {
            let retval = super.onHardwareBackButton(event);
            if (!retval) {
                retval = this.onCommand(event, this._options.backCommandKind);
            }
            return retval;
        }

        ///////////////////////////////////////////////////////////////////////
        // Override: Custom Event

        /**
         * "戻る" event 発行時にコールされる
         *
         * @param event {JQuery.Event} [in] イベントオブジェクト
         * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
         */
        onCommand(event: JQuery.Event, kind: string): boolean {
            if (this._options.backCommandKind === kind) {
                if (this._owner && this._owner[this._options.backCommandHandler]) {
                    return this._owner[this._options.backCommandHandler](event);
                }
            }
            return false;
        }
    }
}
