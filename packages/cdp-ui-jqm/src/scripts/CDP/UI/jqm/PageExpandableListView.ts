namespace CDP.UI {

    import Model = CDP.Framework.Model;

    const TAG = "[CDP.UI.PageExpandableListView] ";

    /**
     * @class PageExpandableListView
     * @brief 開閉リストビュー機能を持つ PageView クラス
     */
    export class PageExpandableListView<TModel extends Model = Model> extends PageListView<TModel> implements IExpandableListView {

        private _expandManager: ExpandManager = null;

        /**
         * constructor
         *
         * @param url     {String}                       [in] page template に使用する URL
         * @param id      {String}                       [in] page に振られた ID
         * @param options {PageListViewConstructOptions} [in] オプション
         */
        constructor(url: string, id: string, options?: PageListViewConstructOptions<TModel>) {
            super(url, id, options);
            this._expandManager = new ExpandManager(this);
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IExpandableListView

        //! 新規 GroupProfile を作成
        newGroup(id?: string): GroupProfile {
            return this._expandManager.newGroup(id);
        }

        //! 登録済み Group を取得
        getGroup(id: string): GroupProfile {
            return this._expandManager.getGroup(id);
        }

        //! 第1階層の Group 登録
        registerTopGroup(topGroup: GroupProfile): void {
            this._expandManager.registerTopGroup(topGroup);
        }

        //! 第1階層の Group を取得
        getTopGroups(): GroupProfile[] {
            return this._expandManager.getTopGroups();
        }

        //! すべてのグループを展開 (1階層)
        expandAll(): void {
            this._expandManager.expandAll();
        }

        //! すべてのグループを収束 (1階層)
        collapseAll(delay?: number): void {
            this._expandManager.collapseAll(delay);
        }

        //! 展開中か判定
        isExpanding(): boolean {
            return this._expandManager.isExpanding();
        }

        //! 収束中か判定
        isCollapsing(): boolean {
            return this._expandManager.isCollapsing();
        }

        //! 開閉中か判定
        isSwitching(): boolean {
            return this._expandManager.isSwitching();
        }

        //! layout key を取得
        get layoutKey(): string {
            return this._expandManager.layoutKey;
        }

        //! layout key を設定
        set layoutKey(key: string) {
            this._expandManager.layoutKey = key;
        }

        ///////////////////////////////////////////////////////////////////////
        // Override: PageListView

        //! データを破棄
        release(): void {
            super.release();
            this._expandManager.release();
        }

        //! 内部データをバックアップ
        backup(key: string): boolean {
            return this._expandManager.backup(key);
        }

        //! 内部データをリストア
        restore(key: string, rebuild: boolean = true): boolean {
            return this._expandManager.restore(key, rebuild);
        }
    }
}
