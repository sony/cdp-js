namespace CDP.UI {

    const TAG = "[CDP.UI.ListView] ";

    /**
     * @interface ListViewConstructOptions
     * @brief ListView への初期化情報を格納するインターフェイスクラス
     */
    export interface ListViewConstructOptions<TModel extends Backbone.Model> extends ListViewOptions, Backbone.ViewOptions<TModel> {
        $el?: JQuery;
        initialHeight?: number;    //!< 高さの初期値
    }

    /**
     * @class ListView
     * @brief メモリ管理機能を提供する仮想リストビュークラス
     */
    export class ListView<TModel extends Backbone.Model> extends Backbone.View<TModel> implements IListView, IComposableView {

        private _scrollMgr: ScrollManager = null;    //!< scroll コアロジック

        /**
         * constructor
         *
         * @param options {ListViewConstructOptions} [in] オプション
         */
        constructor(options?: ListViewConstructOptions<TModel>) {
            super(options);
            let opt = options || {};
            this._scrollMgr = new ScrollManager(options);
            if (opt.$el) {
                let delegates = (<any>this).events ? true : false;
                this.setElement(opt.$el, delegates);
            } else {
                let height = opt.initialHeight || this.$el.height();
                this._scrollMgr.initialize(this.$el, height);
            }
        }

        ///////////////////////////////////////////////////////////////////////
        // Override: Backbone.View

        //! 対象 element の設定
        setElement(element: HTMLElement, delegate?: boolean): Backbone.View<TModel>;
        setElement(element: JQuery, delegate?: boolean): Backbone.View<TModel>;
        setElement(element: any, delegate?: boolean): Backbone.View<TModel> {
            if (this._scrollMgr) {
                let $el = $(element);
                this._scrollMgr.destroy();
                this._scrollMgr.initialize($el, $el.height());
            }
            return super.setElement(element, delegate);
        }

        //! 破棄
        remove(): Backbone.View<TModel> {
            this._scrollMgr.destroy();
            return super.remove();
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IListView Profile 管理

        //! 初期化済みか判定
        isInitialized(): boolean {
            return this._scrollMgr.isInitialized();
        }

        //! プロパティを指定して、LineProfile を管理
        addItem(
            height: number,
            initializer: new (options?: any) => BaseListItemView,
            info: any,
            insertTo?: number
        ): void {
            this._addLine(new LineProfile(this._scrollMgr, Math.floor(height), initializer, info), insertTo);
        }

        //! 指定した Item を削除
        removeItem(index: number, size?: number, delay?: number): void;
        removeItem(index: number[], delay?: number): void;
        removeItem(index: any, arg2?: number, arg3?: number): void {
            this._scrollMgr.removeItem(index, arg2, arg3);
        }

        //! 指定した Item に設定した情報を取得
        getItemInfo(target: number): any;
        getItemInfo(target: JQuery.Event): any;
        getItemInfo(target: any): any {
            return this._scrollMgr.getItemInfo(target);
        }

        //! アクティブページを更新
        refresh(): void {
            this._scrollMgr.refresh();
        }

        //! 未アサインページを構築
        update(): void {
            this._scrollMgr.update();
        }

        //! ページアサインを再構成
        rebuild(): void {
            this._scrollMgr.rebuild();
        }

        //! 管轄データを破棄
        release(): void {
            this._scrollMgr.release();
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IListView Profile Backup / Restore

        //! 内部データをバックアップ
        backup(key: string): boolean {
            return this._scrollMgr.backup(key);
        }

        //! 内部データをリストア
        restore(key: string, rebuild: boolean = true): boolean {
            return this._scrollMgr.restore(key, rebuild);
        }

        //! バックアップデータの有無
        hasBackup(key: string): boolean {
            return this._scrollMgr.hasBackup(key);
        }

        //! バックアップデータの破棄
        clearBackup(key?: string): boolean {
            return this._scrollMgr.clearBackup(key);
        }

        //! バックアップデータにアクセス
        get backupData(): any {
            return this._scrollMgr ? this._scrollMgr.backupData : null;
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IListView Scroll

        //! スクロールイベントハンドラ設定/解除
        setScrollHandler(handler: (event: JQuery.Event) => void, on: boolean): void {
            this._scrollMgr.setScrollHandler(handler, on);
        }

        //! スクロール終了イベントハンドラ設定/解除
        setScrollStopHandler(handler: (event: JQuery.Event) => void, on: boolean): void {
            this._scrollMgr.setScrollStopHandler(handler, on);
        }

        //! スクロール位置を取得
        getScrollPos(): number {
            return this._scrollMgr.getScrollPos();
        }

        //! スクロール位置の最大値を取得
        getScrollPosMax(): number {
            return this._scrollMgr.getScrollPosMax();
        }

        //! スクロール位置を指定
        scrollTo(pos: number, animate?: boolean, time?: number): void {
            this._scrollMgr.scrollTo(pos, animate, time);
        }

        //! 指定された ListItemView の表示を保証
        ensureVisible(index: number, options?: EnsureVisibleOptions): void {
            this._scrollMgr.ensureVisible(index, options);
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IListView Properties

        //! core framework access
        get core(): IListViewFramework {
            return this._scrollMgr;
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IListView Internal I/F

        //! 登録 framework が使用する
        _addLine(_line: any, insertTo?: number): void {
            this._scrollMgr._addLine(_line, insertTo);
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
            let composed: any = composeViews(ListView, derives);
            return composed.extend(properties, classProperties);
        }
    }
}
