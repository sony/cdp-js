namespace CDP.UI {

    const TAG = "[CDP.UI.GroupListItemView] ";

    /**
     * @interface GroupListItemViewOptions
     * @brief GroupListItemView のオプション
     */
    export interface GroupListItemViewOptions<TModel extends Backbone.Model = Backbone.Model> extends ListItemViewOptions<TModel> {
        groupProfile?: GroupProfile;    //!< GroupProfile インスタンス
    }

    /**
     * @class GroupListItemView
     * @brief ExpandableListView が扱う ListItem コンテナクラス
     */
    export class GroupListItemView<TModel extends Backbone.Model = Backbone.Model> extends ListItemView<TModel> {

        private _groupProfile: GroupProfile = null;    //!< 管轄の GroupProfile

        /**
         * constructor
         *
         * @param options {GroupLineViewOptions} [in] オプション
         */
        constructor(options: GroupListItemViewOptions<TModel>) {
            super(options);
            this._groupProfile = options.groupProfile;
        }

        ///////////////////////////////////////////////////////////////////////
        // protected methods

        /**
         * 展開状態を判定
         *
         * @return {Boolean} true: 展開, false:収束
         */
        protected isExpanded(): boolean {
            return this._groupProfile.isExpanded();
        }

        //! 展開中か判定
        protected isExpanding(): boolean {
            return (<BaseExpandableListView>this.owner).isExpanding();
        }

        //! 収束中か判定
        protected isCollapsing(): boolean {
            return (<BaseExpandableListView>this.owner).isCollapsing();
        }

        //! 開閉中か判定
        protected isSwitching(): boolean {
            return (<BaseExpandableListView>this.owner).isSwitching();
        }

        //! 子 Group を持っているか判定
        protected hasChildren(layoutKey?: string): boolean {
            return this._groupProfile.hasChildren(layoutKey);
        }
    }
}
