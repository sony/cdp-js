namespace CDP.UI {

    import _Config = CDP.UI.ListViewGlobalConfig;
    import _ToolCSS = CDP.UI._ListViewUtils;

    const TAG = "[CDP.UI.LineProfile] ";

    /**
     * @class LineProfile
     * @brief 1 ラインに関するプロファイルクラス
     *        framework が使用する
     */
    export class LineProfile {
        private _index: number = null;              //!< global index
        private _pageIndex: number = null;          //!< 所属する page index
        private _offset: number = null;             //!< global offset
        private _$base: JQuery = null;              //!< 土台となる DOM インスタンスを格納
        private _instance: BaseListItemView = null; //!< ListItemView インスタンスを格納

        /**
         * constructor
         *
         * @param _owner       {IListViewFramework} [in] 管理者である IListViewFramework インスタンス
         * @param _height      {Number}             [in] 初期の高さ
         * @param _initializer {Function}           [in] ListItemView 派生クラスのコンストラクタ
         * @param _info        {Object}             [in] ListItemView コンストラクタに渡されるオプション
         */
        constructor(
            private _owner: IListViewFramework,
            private _height: number,
            private _initializer: new (options?: any) => BaseListItemView,
            private _info: any) {
        }

        ///////////////////////////////////////////////////////////////////////
        // public methods

        //! 有効化
        public activate(): void {
            if (null == this._instance) {
                let options;
                this._$base = this.prepareBaseElement();
                options = $.extend({}, {
                    el: this._$base,
                    owner: this._owner,
                    lineProfile: this,
                }, this._info);
                this._instance = new this._initializer(options);
                if ("none" === this._$base.css("display")) {
                    this._$base.css("display", "block");
                }
            }
            this.updatePageIndex(this._$base);
            if ("visible" !== this._$base.css("visibility")) {
                this._$base.css("visibility", "visible");
            }
        }

        //! 不可視化
        public hide(): void {
            if (null == this._instance) {
                this.activate();
            }
            if ("hidden" !== this._$base.css("visibility")) {
                this._$base.css("visibility", "hidden");
            }
        }

        //! 無効化
        public inactivate(): void {
            if (null != this._instance) {
                // xperia AX Jelly Bean (4.1.2)にて、 hidden element の削除でメモリーリークするため可視化する。
                if ("visible" !== this._$base.css("visibility")) {
                    this._$base.css("visibility", "visible");
                }
                this._instance.remove();
                this._instance = null;
                this._$base.addClass(_Config.RECYCLE_CLASS);
                this._$base.css("display", "none");
                this._$base = null;
            }
        }

        //! 更新
        public refresh(): void {
            if (null != this._instance) {
                this._instance.render();
            }
        }

        //! 有効無効判定
        public isActive(): boolean {
            return null != this._instance;
        }

        //! 高さ情報の更新. ListItemView からコールされる。
        public updateHeight(newHeight: number, options?: UpdateHeightOptions): void {
            const delta = newHeight - this._height;
            this._height = newHeight;
            this._owner.updateScrollMapHeight(delta);
            if (null != options && options.reflectAll) {
                this._owner.updateProfiles(this._index);
            }
        }

        //! z-index のリセット. ScrollManager.removeItem() からコールされる。
        public resetDepth(): void {
            if (null != this._instance) {
                this._$base.css("z-index", this._owner.getListViewOptions().baseDepth);
            }
        }

        ///////////////////////////////////////////////////////////////////////
        // getter/setter methods

        //! getter: ラインの高さ
        public get height(): number {
            return this._height;
        }

        //! getter: global index
        public get index(): number {
            return this._index;
        }

        //! setter: global index
        public set index(index: number) {
            this._index = index;
            if (null != this._$base) {
                this.updateIndex(this._$base);
            }
        }

        //! getter: 所属ページ index
        public get pageIndex(): number {
            return this._pageIndex;
        }

        //! setter: 所属ページ index
        public set pageIndex(index: number) {
            this._pageIndex = index;
            if (null != this._$base) {
                this.updatePageIndex(this._$base);
            }
        }

        //! getter: line offset
        public get offset(): number {
            return this._offset;
        }

        //! setter: line offset
        public set offset(offset: number) {
            this._offset = offset;
            if (null != this._$base) {
                this.updateOffset(this._$base);
            }
        }

        //! getter: info
        public get info(): any {
            return this._info;
        }

        ///////////////////////////////////////////////////////////////////////
        // private methods

        //! Base jQuery オブジェクトの生成
        private prepareBaseElement(): JQuery {
            let $base: JQuery;
            const $map = this._owner.getScrollMapElement();
            const $recycle = this._owner.findRecycleElements().first();
            const itemTagName = this._owner.getListViewOptions().itemTagName;

            if (null != this._$base) {
                console.warn(TAG + "this._$base is not null.");
                return this._$base;
            }

            if (0 < $recycle.length) {
                $base = $recycle;
                $base.removeAttr("z-index");
                $base.removeClass(_Config.RECYCLE_CLASS);
            } else {
                $base = $("<" + itemTagName + " class='" + _Config.LISTITEM_BASE_CLASS + "'></" + itemTagName + ">");
                $base.css("display", "none");
                $map.append($base);
            }

            // 高さの更新
            if ($base.height() !== this._height) {
                $base.height(this._height);
            }

            // index の設定
            this.updateIndex($base);
            // offset の更新
            this.updateOffset($base);

            return $base;
        }

        //! global index の更新
        private updateIndex($base: JQuery): void {
            if ($base.attr(_Config.DATA_CONTAINER_INDEX) !== this._index.toString()) {
                $base.attr(_Config.DATA_CONTAINER_INDEX, this._index.toString());
            }
        }

        //! page index の更新
        private updatePageIndex($base: JQuery): void {
            if ($base.attr(_Config.DATA_PAGE_INDEX) !== this._pageIndex.toString()) {
                $base.attr(_Config.DATA_PAGE_INDEX, this._pageIndex.toString());
            }
        }

        //! offset の更新
        private updateOffset($base: JQuery): void {
            const transform = {};
            if (this._owner.getListViewOptions().enableTransformOffset) {
                if (_ToolCSS.getCssMatrixValue($base, "translateY") !== this._offset) {
                    for (let i = 0; i < _ToolCSS.cssPrefixes.length; i++) {
                        transform[_ToolCSS.cssPrefixes[i] + "transform"] = "translate3d(0px," + this._offset + "px,0px)";
                    }
                    $base.css(transform);
                }
            } else {
                if (parseInt($base.css("top"), 10) !== this._offset) {
                    $base.css("top", this._offset + "px");
                }
            }
        }
    }
}
