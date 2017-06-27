/* tslint:disable:no-bitwise */

namespace CDP.UI {

    const TAG = "[CDP.UI.ExpandManager] ";

    /**
     * @class ExpandManager
     * @brief 開閉状態管理クラス
     */
    export class ExpandManager implements IExpandManager {

        private _owner: BaseExpandableListView = null;
        private _mapGroups: Object = {};                //!< {id, GroupProfile} の map
        private _aryTopGroups: GroupProfile[] = [];     //!< 第1階層 GroupProfile を格納
        private _layoutKey: string = null;

        /**
         * constructor
         *
         * @param owner {BaseExpandableListView} [in] 親View のインスタンス
         */
        constructor(owner: BaseExpandableListView) {
            this._owner = owner;
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IExpandManager

        /**
         * 新規 GroupProfile を作成
         * 登録済みの場合はそのオブジェクトを返却
         *
         * @parma id {String} [in] 新規に作成する Group ID を指定. 指定しない場合は自動割り振り
         * @return {GroupProfile} GroupProfile インスタンス
         */
        newGroup(id?: string): GroupProfile {
            let group: GroupProfile;
            if (null == id) {
                id = "group-id:" + ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
            }
            if (null != this._mapGroups[id]) {
                return this._mapGroups[id];
            }
            group = new GroupProfile(id, this._owner);
            this._mapGroups[id] = group;
            return group;
        }

        /**
         * 登録済み Group を取得
         *
         * @parma id {String} [in] 取得する Group ID を指定
         * @return {GroupProfile} GroupProfile インスタンス / null
         */
        getGroup(id: string): GroupProfile {
            if (null == this._mapGroups[id]) {
                console.warn(TAG + "group id: " + id + " is not registered.");
                return null;
            }
            return this._mapGroups[id];
        }

        /**
         * 第1階層の Group 登録
         *
         * @param topGroup {GroupProfile} [in] 構築済み GroupProfile インスタンス
         */
        registerTopGroup(topGroup: GroupProfile): void {
            let lastGroup: GroupProfile;
            let insertTo: number;

            // すでに登録済みの場合は restore して layout キーごとに復元する。
            if ("registered" === topGroup.status) {
                // TODO: orientation changed 時の layout キー変更対応だが、キーに変更が無いときは不具合となる。
                // この API に実装が必要かも含めて見直しが必要
                topGroup.restore();
                return;
            }

            lastGroup = (0 < this._aryTopGroups.length) ? this._aryTopGroups[this._aryTopGroups.length - 1] : null;
            insertTo = (null != lastGroup) ? lastGroup.getLastLineIndex(true) + 1 : 0;
            if (_.isNaN(insertTo)) {
                console.error(TAG + "logic error, 'insertTo' is NaN.");
                return;
            }

            this._aryTopGroups.push(topGroup);
            topGroup.register(insertTo);
        }

        /**
         * 第1階層の Group を取得
         * コピー配列が返されるため、クライアントはキャッシュ不可
         *
         * @return {GroupProfile[]} GroupProfile 配列
         */
        getTopGroups(): GroupProfile[] {
            return this._aryTopGroups.slice(0);
        }

        //! すべてのグループを展開 (1階層)
        expandAll(): void {
            this._aryTopGroups.forEach((group: GroupProfile) => {
                if (group.hasChildren()) {
                    group.expand();
                }
            });
        }

        //! すべてのグループを収束 (1階層)
        collapseAll(delay?: number): void {
            this._aryTopGroups.forEach((group: GroupProfile) => {
                if (group.hasChildren()) {
                    group.collapse(delay);
                }
            });
        }

        //! 展開中か判定
        isExpanding(): boolean {
            return this._owner.isStatusIn("expanding");
        }

        //! 収束中か判定
        isCollapsing(): boolean {
            return this._owner.isStatusIn("collapsing");
        }

        //! 開閉中か判定
        isSwitching(): boolean {
            return this.isExpanding() || this.isCollapsing();
        }

        //! 状態変数の参照カウントのインクリメント
        statusAddRef(status: string): number {
            return this._owner.statusAddRef(status);
        }

        //! 状態変数の参照カウントのデクリメント
        statusRelease(status: string): number {
            return this._owner.statusRelease(status);
        }

        //! 処理スコープ毎に状態変数を設定
        statusScope(status: string, callback: () => void): void {
            this._owner.statusScope(status, callback);
        }

        //! 指定した状態中であるか確認
        isStatusIn(status: string): boolean {
            return this._owner.isStatusIn(status);
        }

        //! layout key を取得
        get layoutKey(): string {
            return this._layoutKey;
        }

        //! layout key を設定
        set layoutKey(key: string) {
            this._layoutKey = key;
        }

        //! データを破棄
        release(): void {
            this._mapGroups = {};
            this._aryTopGroups = [];
        }

        ///////////////////////////////////////////////////////////////////////
        // Implementes: IBackupRestore

        /**
         * 内部データをバックアップ
         *
         * @param key {String} [in] バックアップキーを指定
         * @return {Boolean} true: 成功 / false: 失敗
         */
        backup(key: string): boolean {
            let _backup = this.backupData;
            if (null == _backup[key]) {
                _backup[key] = {
                    map: this._mapGroups,
                    tops: this._aryTopGroups,
                };
            }
            return true;
        }

        /**
         * 内部データをリストア
         *
         * @param key     {String}  [in] バックアップキーを指定
         * @param rebuild {Boolean} [in] rebuild を実行する場合は true を指定
         * @return {Boolean} true: 成功 / false: 失敗
         */
        restore(key: string, rebuild: boolean = true): boolean {
            let _backup = this.backupData;

            if (null == _backup[key]) {
                return false;
            }
            if (0 < this._aryTopGroups.length) {
                this.release();
            }

            this._mapGroups = _backup[key].map;
            this._aryTopGroups = _backup[key].tops;

            // layout 情報の確認
            if (this._aryTopGroups.length <= 0 || !this._aryTopGroups[0].hasLayoutKeyOf(this.layoutKey)) {
                return false;
            }

            // 展開しているものを登録
            this._aryTopGroups.forEach((group: GroupProfile) => {
                group.restore();
            });

            // 再構築の予約
            if (rebuild) {
                this._owner.rebuild();
            }

            return true;
        }

        //! バックアップデータの有無
        hasBackup(key: string): boolean {
            return this._owner.hasBackup(key);
        }

        //! バックアップデータの破棄
        clearBackup(key?: string): boolean {
            return this._owner.clearBackup(key);
        }

        //! バックアップデータにアクセス
        get backupData(): any {
            return this._owner.backupData;
        }
    }
}
