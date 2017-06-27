namespace CDP.UI {

    const TAG = "[CDP.UI.PageProfile] ";

    /**
     * @class PageProfile
     * @brief 1 ページに関するプロファイルクラス
     *        framework が使用する
     *        本クラスでは直接 DOM を操作してはいけない
     */
    export class PageProfile {
        private _index: number = 0;             //!< page index
        private _offset: number = 0;            //!< page の Top からのオフセット
        private _height: number = 0;            //!< page の高さ
        private _lines: LineProfile[] = [];     //!< page 内で管理される LineProfile
        private _status: string = "inactive";   //!< page の状態 [ inactive | hidden | active ]

        ///////////////////////////////////////////////////////////////////////
        // public methods

        //! 有効化
        public activate(): void {
            if ("active" !== this._status) {
                this._lines.forEach((line: LineProfile) => {
                    line.activate();
                });
            }
            this._status = "active";
        }

        //! 無可視化
        public hide(): void {
            if ("hidden" !== this._status) {
                this._lines.forEach((line: LineProfile) => {
                    line.hide();
                });
            }
            this._status = "hidden";
        }

        //! 無効化
        public inactivate(): void {
            if ("inactive" !== this._status) {
                this._lines.forEach((line: LineProfile) => {
                    line.inactivate();
                });
            }
            this._status = "inactive";
        }

        //! LineProfile を設定
        public push(line: LineProfile): void {
            this._lines.push(line);
            this._height += line.height;
        }

        //! 配下の LineProfile すべてが有効でない場合、Page ステータスを無効にする
        public normalize(): void {
            let enableAll = _.every(this._lines, (line: LineProfile) => {
                return line.isActive();
            });
            if (!enableAll) {
                this._status = "inactive";
            }
        }

        //! LineProfile を取得
        public getLineProfile(index: number): LineProfile {
            if (0 <= index && index < this._lines.length) {
                return this._lines[index];
            } else {
                return null;
            }
        }

        //! 最初の LineProfile を取得
        public getLineProfileFirst(): LineProfile {
            return this.getLineProfile(0);
        }

        //! 最後の LineProfile を取得
        public getLineProfileLast(): LineProfile {
            return this.getLineProfile(this._lines.length - 1);
        }

        ///////////////////////////////////////////////////////////////////////
        // getter/setter methods

        //! getter: page index
        public get index(): number {
            return this._index;
        }

        //! setter: page index
        public set index(index: number) {
            this._index = index;
        }

        //! getter: page offset
        public get offset(): number {
            return this._offset;
        }

        //! setter: page offset
        public set offset(offset: number) {
            this._offset = offset;
        }

        //! getter: 実際にページに割り当てられている高さ
        public get height(): number {
            return this._height;
        }

        //! getter: 状態取得
        public get status(): string {
            return this._status;
        }
    }
}
