namespace CDP.UI {

    const TAG = "[CDP.UI.GroupProfile] ";

    /**
     * @class GroupProfile
     * @brief ラインをグループ管理するプロファイルクラス
     *        本クラスでは直接 DOM を操作してはいけない
     */
    export class GroupProfile {
        private _parent: GroupProfile = null;       //!< 親 GroupProfile インスタンス
        private _children: GroupProfile[] = [];     //!< 子 GroupProfile インスタンス
        private _expanded: boolean = false;         //!< 開閉情報
        private _status: string = "unregistered";   //!< _owner への登録状態 [ unregistered | registered ]
        private _mapLines = {};                     //!< 自身が管轄する LineProfile を key とともに格納
        private static LAYOUT_KEY_DEFAULT = "-layout-default";

        /**
         * constructor
         *
         * @param _id    {String}             [in] GroupProfile の ID
         * @param _owner {ExpandableListView} [in] 管理者である ExpandableListView インスタンス
         */
        constructor(private _id: string, private _owner: BaseExpandableListView) {
        }

        ///////////////////////////////////////////////////////////////////////
        // public method

        /**
         * 本 GroupProfile が管理する List を作成して登録
         *
         * @param height      {Number}   [in] ラインの高さ
         * @param initializer {Function} [in] ListItemView 派生クラスのコンストラクタ
         * @param info        {Object}   [in] initializer に渡されるオプション引数
         * @param layoutKey   {String}   [in] layout 毎に使用する識別子 (オプショナル)
         * @return {GroupProfile} 本インスタンス
         */
        public addItem(
            height: number,
            initializer: new (options?: any) => BaseListItemView,
            info: any,
            layoutKey?: string
        ): GroupProfile {
            let line: LineProfile;
            let options = $.extend({}, { groupProfile: this }, info);

            if (null == layoutKey) {
                layoutKey = GroupProfile.LAYOUT_KEY_DEFAULT;
            }
            if (null == this._mapLines[layoutKey]) {
                this._mapLines[layoutKey] = [];
            }

            line = new LineProfile(this._owner.core, Math.floor(height), initializer, options);

            // _owner の管理下にあるときは速やかに追加
            if (("registered" === this._status) &&
                (null == this._owner.layoutKey || layoutKey === this._owner.layoutKey)) {
                this._owner._addLine(line, this.getLastLineIndex() + 1);
                this._owner.update();
            }
            this._mapLines[layoutKey].push(line);
            return this;
        }

        /**
         * 子 Group を追加
         *
         * @param target {GroupProfile|GroupProfile[]} [in] GroupProfile インスタンス
         * @return {GroupProfile} 本インスタンス
         */
        public addChildren(target: GroupProfile): GroupProfile;
        public addChildren(target: GroupProfile[]): GroupProfile;
        public addChildren(target: any): GroupProfile {
            let children: GroupProfile[] = (target instanceof Array) ? target : [target];
            children.forEach((child) => {
                child.setParent(this);
            });
            this._children = this._children.concat(children);
            return this;
        }

        /**
         * 親 GroupProfile を取得
         *
         * @return {GroupProfile} GroupProfile 親 インスタンス
         */
        public getParent(): GroupProfile {
            return this._parent;
        }

        /**
         * 子 GroupProfile を取得
         *
         * @return {GroupProfile[]} GroupProfile 子 インスタンス配列
         */
        public getChildren(): GroupProfile[] {
            return this._children;
        }

        /**
         * 子 Group を持っているか判定
         * layoutKey が指定されれば、layout の状態まで判定
         *
         * @param layoutKey {String} [in] layout 毎に使用する識別子 (オプショナル)
         * @return {Boolean} true: 有, false: 無
         */
        public hasChildren(layoutKey?: string): boolean {
            if (this._children.length <= 0) {
                return false;
            } else if (null != layoutKey) {
                return this._children[0].hasLayoutKeyOf(layoutKey);
            } else {
                return true;
            }
        }

        /**
         * layout の状態を判定
         *
         * @param layoutKey {String} [in] layout 毎に使用する識別子
         * @return {Boolean} true: 有, false: 無
         */
        public hasLayoutKeyOf(layoutKey: string): boolean {
            if (null == layoutKey) {
                layoutKey = GroupProfile.LAYOUT_KEY_DEFAULT;
            }
            return (null != this._mapLines[layoutKey]);
        }

        /**
         * グループ展開
         */
        public expand(): void {
            let lines: LineProfile[] = [];
            if (this._lines.length < 0) {
                console.warn(TAG + "this group has no lines.");
            } else if (!this.hasChildren()) {
                console.warn(TAG + "this group has no children.");
            } else if (!this.isExpanded()) {
                lines = this.queryOperationTarget("registered");
                this._expanded = true;
                if (0 < lines.length) {
                    this._owner.statusScope("expanding", () => {
                        // 自身を更新
                        this._lines.forEach((line: LineProfile) => {
                            line.refresh();
                        });
                        // 配下を更新
                        this._owner._addLine(lines, this.getLastLineIndex() + 1);
                        this._owner.update();
                    });
                }
            }
        }

        /**
         * グループ収束
         *
         * @param delay {Number} [in] 要素削除に費やす遅延時間. 既定: animationDuration 値
         */
        public collapse(delay?: number): void {
            let lines: LineProfile[] = [];
            if (!this.hasChildren()) {
                console.warn(TAG + "this group has no children.");
            } else if (this.isExpanded()) {
                lines = this.queryOperationTarget("unregistered");
                this._expanded = false;
                if (0 < lines.length) {
                    delay = (null != delay) ? delay : this._owner.core.getListViewOptions().animationDuration;
                    this._owner.statusScope("collapsing", () => {
                        // 自身を更新
                        this._lines.forEach((line: LineProfile) => {
                            line.refresh();
                        });
                        // 配下を更新
                        this._owner.removeItem(lines[0].index, lines.length, delay);
                        this._owner.update();
                    });
                }
            }
        }

        /**
         * 自身をリストの可視領域に表示
         *
         * @param options {EnsureVisibleOptions} [in] オプション
         */
        ensureVisible(options?: EnsureVisibleOptions): void {
            if (0 < this._lines.length) {
                this._owner.ensureVisible(this._lines[0].index, options);
            } else if (null != options.callback) {
                options.callback();
            }
        }

        /**
         * 開閉のトグル
         *
         * @param delay {Number} [in] collapse の要素削除に費やす遅延時間. 既定: animationDuration 値
         */
        public toggle(delay?: number): void {
            if (this._expanded) {
                this.collapse(delay);
            } else {
                this.expand();
            }
        }

        /**
         * 展開状態を判定
         *
         * @return {Boolean} true: 展開, false:収束
         */
        public isExpanded(): boolean {
            return this._expanded;
        }

        /**
         * list view へ登録
         * Top Group のみ登録可能
         *
         * @param insertTo {Number} 挿入位置を index で指定
         * @return {GroupProfile} 本インスタンス
         */
        public register(insertTo: number): GroupProfile {
            if (this._parent) {
                console.error(TAG + "logic error: 'register' method is acceptable only top group.");
            } else {
                this._owner._addLine(this.preprocess("registered"), insertTo);
            }
            return this;
        }

        /**
         * list view へ復元
         * Top Group のみ登録可能
         *
         * @return {GroupProfile} 本インスタンス
         */
        public restore(): GroupProfile {
            let lines: LineProfile[] = [];
            if (this._parent) {
                console.error(TAG + "logic error: 'restore' method is acceptable only top group.");
            } else if (this._lines) {
                if (this._expanded) {
                    lines = this._lines.concat(this.queryOperationTarget("active"));
                } else {
                    lines = this._lines;
                }
                this._owner._addLine(lines);
            }
            return this;
        }

        /**
         * 配下の最後の line index を取得
         *
         * @param withActiveChildren {Boolean} [in] 登録済みの子 GroupProfile を含めて検索する場合は true を指定
         * @return {Number} index. エラーの場合は null.
         */
        public getLastLineIndex(withActiveChildren: boolean = false): number {
            let lines: LineProfile[] = (() => {
                let lines: LineProfile[];
                if (withActiveChildren) {
                    lines = this.queryOperationTarget("active");
                }
                if (null == lines || lines.length <= 0) {
                    lines = this._lines;
                }
                return lines;
            })();

            if (lines.length <= 0) {
                console.error(TAG + "logic error: this group is stil not registered.");
                return null;
            } else {
                return lines[lines.length - 1].index;
            }
        }

        /**
         * ID を取得
         *
         * @return {String} 割り振られた ID
         */
        get id(): string {
            return this._id;
        }

        /**
         * ステータスを取得
         *
         * @return {String} ステータス文字列
         */
        get status(): string {
            return this._status;
        }

        ///////////////////////////////////////////////////////////////////////
        // private method

        /* tslint:disable:no-unused-variable */

        /**
         * 親 Group 指定
         *
         * @param parent {GroupProfile} [in] 親 GroupProfile インスタンス
         */
        private setParent(parent: GroupProfile): void {
            this._parent = parent;
        }

        /* tslint:enable:no-unused-variable */

        /**
         * register / unregister の前処理
         *
         * @param newStatus {String} [in] 新ステータス文字列
         * @return {LineProfile[]} 更新すべき LineProfile の配列
         */
        private preprocess(newStatus: string): LineProfile[] {
            let lines: LineProfile[] = [];
            if (newStatus !== this._status && null != this._lines) {
                lines = this._lines;
            }
            this._status = newStatus;
            return lines;
        }

        /**
         * 操作対象の LineProfile 配列を取得
         *
         * @param newStatus {String} [in] 新ステータス文字列
         * @return {LineProfile[]} 操作対象の LineProfile の配列
         */
        private queryOperationTarget(operation: string): LineProfile[] {
            let findTargets = (group: GroupProfile): LineProfile[] => {
                let lines: LineProfile[] = [];
                group._children.forEach((group: GroupProfile) => {
                    switch (operation) {
                        case "registered":
                            lines = lines.concat(group.preprocess(operation));
                            break;
                        case "unregistered":
                            lines = lines.concat(group.preprocess(operation));
                            break;
                        case "active":
                            if (null != group._lines) {
                                lines = lines.concat(group._lines);
                            }
                            break;
                        default:
                            console.warn(TAG + "unknown operation: " + operation);
                            return;
                    }
                    if (group.isExpanded()) {
                        lines = lines.concat(findTargets(group));
                    }
                });
                return lines;
            };
            return findTargets(this);
        }

        /**
         * 自身の管理するアクティブな LineProfie を取得
         *
         * @return {LineProfile[]} LineProfie 配列
         */
        private get _lines(): LineProfile[] {
            let key = this._owner.layoutKey;
            if (null != key) {
                return this._mapLines[key];
            } else {
                return this._mapLines[GroupProfile.LAYOUT_KEY_DEFAULT];
            }
        }
    }
}
