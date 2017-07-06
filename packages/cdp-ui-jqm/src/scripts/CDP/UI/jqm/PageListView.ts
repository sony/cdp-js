/* tslint:disable:max-line-length */

namespace CDP.UI {

    import Model = CDP.Framework.Model;

    const TAG = "[CDP.UI.PageListView] ";

    /**
     * @interface PageListViewConstructOptions
     * @brief PageListView への初期化情報を格納するインターフェイスクラス
     */
    export interface PageListViewConstructOptions<TModel extends Model = Model> extends ListViewOptions, PageViewConstructOptions<TModel> {
        autoDestoryElement?: boolean;        //!< ページ遷移前に List Element を破棄する場合は true を指定
    }

    /**
     * @class PageListView
     * @brief 仮想リストビュー機能を持つ PageView クラス
     */
    export class PageListView<TModel extends Model = Model> extends PageView<TModel> implements IListView {

        private _scrollMgr: ScrollManager = null;    //!< scroll コアロジック
        private _needRebuild: boolean = false;       //!< ページ表示時に rebuild() をコールするための内部変数

        /**
         * constructor
         *
         * @param url     {String}                       [in] page template に使用する URL
         * @param id      {String}                       [in] page に振られた ID
         * @param options {PageListViewConstructOptions} [in] オプション
         */
        constructor(url: string, id: string, options?: PageListViewConstructOptions<TModel>) {
            super(url, id, $.extend({}, {
                autoDestoryElement: false,
            }, options));
            this._scrollMgr = new ScrollManager(options);
        }

        //! rebuild() のスケジューリング
        public reserveRebuild(): void {
            this._needRebuild = true;
        }

        ///////////////////////////////////////////////////////////////////////
        // Override: PageView

        //! Orientation の変更検知
        onOrientationChanged(newOrientation: Framework.Orientation): void {
            this._scrollMgr.setBaseHeight(this.getPageBaseHeight());
        }

        //! ページ遷移直前イベント処理
        onBeforeRouteChange(): IPromiseBase<any> {
            if ((<PageListViewConstructOptions<TModel>>this._pageOptions).autoDestoryElement) {
                this._scrollMgr.destroy();
            }
            return super.onBeforeRouteChange();
        }

        //! jQM event: "pagebeforeshow" に対応
        onPageBeforeShow(event: JQuery.Event, data?: Framework.ShowEventData): void {
            super.onPageBeforeShow(event, data);
            this._scrollMgr.initialize(this.$page, this.getPageBaseHeight());
        }

        //! jQM event: "pagecontainershow" (旧:"pageshow") に対応
        onPageShow(event: JQuery.Event, data?: Framework.ShowEventData): void {
            super.onPageShow(event, data);
            this._scrollMgr.setBaseHeight(this.getPageBaseHeight());
            if (this._needRebuild) {
                this.rebuild();
                this._needRebuild = false;
            }
        }

        //! jQM event: "pageremove" に対応
        onPageRemove(event: JQuery.Event): void {
            super.onPageRemove(event);
            this.release();
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IListView Profile 管理

        //! 初期化済みか判定
        isInitialized(): boolean {
            return this._scrollMgr.isInitialized();
        }

        //! プロパティを指定して、ListItem を管理
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
            const retval = this._scrollMgr.restore(key, rebuild);
            if (retval && !rebuild) {
                this.reserveRebuild();
            }
            return retval;
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
            return this._scrollMgr.backupData;
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
        // private method:

        //! ページの基準値を取得
        private getPageBaseHeight(): number {
            return $(window).height() - parseInt(this.$page.css("padding-top"), 10);
        }
    }
}
