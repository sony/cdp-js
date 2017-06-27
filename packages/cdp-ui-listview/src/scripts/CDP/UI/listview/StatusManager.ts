namespace CDP.UI {

    const TAG = "[CDP.UI.StatusManager] ";

    /**
     * @class StatusManager
     * @brief UI 用状態管理クラス
     *        StatusManager のインスタンスごとに任意の状態管理ができる
     *
     */
    export class StatusManager implements IStatusManager {

        private _status: any = {};    //!< statusScope() に使用される状態管理オブジェクト

        ///////////////////////////////////////////////////////////////////////
        // Implements: IStatusManager

        //! 状態変数の参照カウントのインクリメント
        public statusAddRef(status: string): number {
            if (!this._status[status]) {
                this._status[status] = 1;
            } else {
                this._status[status]++;
            }
            return this._status[status];
        }

        //! 状態変数の参照カウントのデクリメント
        public statusRelease(status: string): number {
            let retval: number;
            if (!this._status[status]) {
                retval = 0;
            } else {
                this._status[status]--;
                retval = this._status[status];
                if (0 === retval) {
                    delete this._status[status];
                }
            }
            return retval;
        }

        //! 処理スコープ毎に状態変数を設定
        public statusScope(status: string, callback: () => void | Promise<any>): void {
            this.statusAddRef(status);
            const promise = callback();
            if (!promise) {
                this.statusRelease(status);
            } else {
                promise.then(
                    () => {
                        this.statusRelease(status);
                    },
                    () => {
                        this.statusRelease(status);
                    }
                );
            }
        }

        //! 指定した状態中であるか確認
        public isStatusIn(status: string): boolean {
            return !!this._status[status];
        }
    }
}
