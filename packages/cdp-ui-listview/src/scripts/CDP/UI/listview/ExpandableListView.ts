namespace CDP.UI {

    const TAG = "[CDP.UI.ExpandableListView] ";

    /**
     * @class ExpandableListView
     * @brief 開閉機能を備えた仮想リストビュークラス
     */
    export class ExpandableListView<TModel extends Backbone.Model> extends ListView<TModel> implements IExpandableListView {

        private _statusMgr: StatusManager = null;
        private _expandManager: ExpandManager = null;

        /**
         * constructor
         *
         * @param options {ListViewConstructOptions} [in] オプション
         */
        constructor(options?: ListViewConstructOptions<TModel>) {
            super(options);
            this._statusMgr = new StatusManager();
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

        //! 状態変数の参照カウントのインクリメント
        statusAddRef(status: string): number {
            return this._statusMgr.statusAddRef(status);
        }

        //! 状態変数の参照カウントのデクリメント
        statusRelease(status: string): number {
            return this._statusMgr.statusRelease(status);
        }

        //! 処理スコープ毎に状態変数を設定
        statusScope(status: string, callback: () => void): void {
            this._statusMgr.statusScope(status, callback);
        }

        //! 指定した状態中であるか確認
        isStatusIn(status: string): boolean {
            return this._statusMgr.isStatusIn(status);
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
        // Override: ListView

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
