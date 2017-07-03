namespace CDP.UI {

    import Router       = CDP.Framework.Router;
    import IPage        = CDP.Framework.IPage;
    import Model        = CDP.Framework.Model;
    import View         = CDP.Framework.View;
    import ViewOptions  = CDP.Framework.ViewOptions;
    import Template     = CDP.Tools.Template;
    import JST          = CDP.Tools.JST;

    const TAG: string = "[CDP.UI.BaseHeaderView] ";

    /**
     * @interface BaseHeaderViewOptions
     * @brief BaseHeaderView に指定するオプションインターフェイス
     */
    export interface BaseHeaderViewOptions<TModel extends Model = Model> extends ViewOptions<TModel> {
        baseTemplate?: JST;             //!< 固定ヘッダ用 JavaScript テンプレート.
        backCommandSelector?: string;   //!< "戻る"コマンドセレクタ. default: "command-back"
        backCommandKind?: string;       //!< "戻る"コマンド種別 (onCommand 第2引数). default: "pageback"
    }

    //__________________________________________________________________________________________________________//

    /**
     * @class BaseHeaderView
     * @brief 共通ヘッダを操作するクラス
     */
    export class BaseHeaderView<TModel extends Model = Model> extends View<TModel> {

        private static s_$headerBase: JQuery;   //!< ページ外に配置される共通ヘッダのベース部品用 jQuery オブジェクト
        private static s_refCount = 0;          //!< 参照カウント
        private _template: JST;
        private _hasBackIndicator: boolean;

        /**
         * constructor
         *
         * @param {IPage} _owner [in] オーナーページインスタンス
         */
        constructor(private _owner: IPage, private _options?: BaseHeaderViewOptions<TModel>) {
            super(_options = $.extend({
                el: _owner.$page.find("[data-role='header']"),
                backCommandSelector: ".command-back",
                backCommandKind: "pageback",
            }, _options));

            // template 設定
            if (_options.baseTemplate) {
                this._template = _options.baseTemplate;
            } else {
                this._template = Template.getJST(`
                    <script type='text/template'>
                        <header class='ui-header-base ui-body-{{theme}}'>
                            <div class='ui-fixed-back-indicator'></div>
                        </header>
                    </script>
                `);
            }

            // Backbone.View 用の初期化
            this.setElement(this.$el, true);
        }

        ///////////////////////////////////////////////////////////////////////
        // public methods

        /**
         * 初期化
         */
        public create(): JQuery {
            return this.createHeaderBase();
        }

        /**
         * 有効化
         */
        public activate(): JQuery {
            return this.showIndicator();
        }

        /**
         * 無効化
         */
        public inactivate(): JQuery {
            return this.hideIndicator();
        }

        /**
         * 破棄
         */
        public release(): JQuery {
            return this.releaseHeaderBase();
        }

        ///////////////////////////////////////////////////////////////////////
        // private methods

        //! 共通ヘッダのベースを準備
        private createHeaderBase(): JQuery {
            // 固定ヘッダのときに有効化
            if ("fixed" === this._owner.$header.jqmData("position")) {
                if (null == BaseHeaderView.s_$headerBase) {
                    BaseHeaderView.s_$headerBase = $(this._template({
                        theme: this._owner.$page.jqmData("theme"),
                    }));
                }
                BaseHeaderView.s_refCount++;
                BaseHeaderView.s_$headerBase.appendTo($(document.body));
            }
            // Back Indicator を持っているか判定
            if (0 < this.$el.find(".ui-back-indicator").length) {
                this._hasBackIndicator = true;
            }
            return BaseHeaderView.s_$headerBase;
        }

        //! indicator の表示
        private showIndicator(): JQuery {
            // Back Indicator を持っていない場合表示しない
            if (null != BaseHeaderView.s_$headerBase && this._hasBackIndicator) {
                BaseHeaderView.s_$headerBase.find(".ui-fixed-back-indicator").addClass("show");
            }
            return BaseHeaderView.s_$headerBase;
        }

        //! indicator の非表示
        private hideIndicator(): JQuery {
            if (null != BaseHeaderView.s_$headerBase) {
                BaseHeaderView.s_$headerBase.find(".ui-fixed-back-indicator").removeClass("show");
            }
            return BaseHeaderView.s_$headerBase;
        }

        //! 共通ヘッダのベースを破棄
        private releaseHeaderBase(): JQuery {
            if (null != BaseHeaderView.s_$headerBase) {
                BaseHeaderView.s_refCount--;
                if (0 === BaseHeaderView.s_refCount) {
                    BaseHeaderView.s_$headerBase.remove();
                    BaseHeaderView.s_$headerBase = null;
                }
            }
            return BaseHeaderView.s_$headerBase;
        }

        ///////////////////////////////////////////////////////////////////////
        // Override: Backbone.View

        //! events binding
        events(): any {
            const eventMap = {};
            if (this._options) {
                eventMap["vclick " + this._options.backCommandSelector] = this.onCommandBack;
            }
            return eventMap;
        }

        //! back のハンドラ
        private onCommandBack(event: JQuery.Event): void {
            event.preventDefault();
            let handled = false;
            if (this._owner) {
                handled = this._owner.onCommand(event, this._options.backCommandKind);
            }
            if (!handled) {
                Router.back();
            }
        }
    }
}
