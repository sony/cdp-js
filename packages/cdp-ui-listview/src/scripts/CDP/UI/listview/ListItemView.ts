namespace CDP.UI {

    const TAG = "[CDP.UI.ListItemView] ";

    /**
     * @interface ListItemViewOptions
     * @brief ListItemView のオプション
     */
    export interface ListItemViewOptions<TModel extends Backbone.Model> extends Backbone.ViewOptions<TModel> {
        owner: BaseListView;
        $el?: JQuery;
        lineProfile: LineProfile;
    }

    /**
     * @class ListItemView
     * @brief ListView が扱う ListItem コンテナクラス
     */
    export class ListItemView<TModel extends Backbone.Model> extends Backbone.View<TModel> implements IListItemView, IComposableView {

        private _owner: BaseListView = null;
        private _lineProfile: LineProfile = null;

        /**
         * constructor
         */
        constructor(options: ListItemViewOptions<TModel>) {
            super(options);
            this._owner = options.owner;
            if (options.$el) {
                let delegates = (<any>this).events ? true : false;
                this.setElement(options.$el, delegates);
            }
            this._lineProfile = options.lineProfile;
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: ListItemView

        //! 描画: framework から呼び出されるため、オーバーライド必須
        render(): ListItemView<TModel> {
            console.warn(TAG + "need override 'render()' method.");
            return this;
        }

        //! 自身の Line インデックスを取得
        getIndex(): number {
            return this._lineProfile.index;
        }

        //! 自身に指定された高さを取得
        getSpecifiedHeight(): number {
            return this._lineProfile.height;
        }

        //! child node が存在するか判定
        hasChildNode(): boolean {
            if (!this.$el) {
                return false;
            } else {
                return 0 < this.$el.children().length;
            }
        }

        /**
         * 高さを更新
         *
         * @param newHeight {Number}              [in] 新しい高さ
         * @param options   {UpdateHeightOptions} [in] line の高さ更新時に影響するすべての LineProfile の再計算を行う場合は { reflectAll: true }
         * @return {ListItemView} インスタンス
         */
        updateHeight(newHeight: number, options?: UpdateHeightOptions): ListItemView<TModel> {
            if (this.$el) {
                if (this.getSpecifiedHeight() !== newHeight) {
                    this._lineProfile.updateHeight(newHeight, options);
                    this.$el.height(newHeight);
                }
            }
            return this;
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IComposableView

        /**
         * すでに定義された Backbone.View を基底クラスに設定し、extend を実行する。
         *
         * @param derives         {Backbone.View|Backbone.View[]} [in] 合成元の View クラス
         * @param properties      {Object}                        [in] prototype プロパティ
         * @param classProperties {Object}                        [in] static プロパティ
         * @return {Backbone.View|Backbone.View[]} 新規に生成された View のコンストラクタ
         */
        static compose(derives: ViewConstructor | ViewConstructor[], properties: any, classProperties?: any): ViewConstructor {
            let composed: any = composeViews(ListItemView, derives);
            return composed.extend(properties, classProperties);
        }

        ///////////////////////////////////////////////////////////////////////
        // Override: Backbone.View

        //! 開放
        remove(): ListItemView<TModel> {
            // xperia AX Jelly Bean (4.1.2)にて、メモリーリークを軽減させる効果
            this.$el.find("figure").css("background-image", "none");
            // this.$el は再利用するため破棄しない
            this.$el.children().remove();
            this.$el.off();
            this.$el = null;
            this.stopListening();
            this._lineProfile = null;
            return this;
        }

        ///////////////////////////////////////////////////////////////////////
        // short cut methods

        //! Owner 取得
        get owner(): BaseListView {
            return this._owner;
        }
    }
}
