namespace CDP.UI {

    import Model = CDP.Framework.Model;

    const TAG = "[CDP.UI.TabView] ";
    const SUPPRESS_WARNING_INITIAL_HEIGHT = 1;

    /**
     * @class TabView
     * @brief TabHostView にアタッチ可能な View クラス
     */
    export class TabView<TModel extends Model = Model> extends ListView<TModel> implements ITabView {

        private _host: TabHostView = null;
        private _needRebuild: boolean = false;  // ページ表示時に rebuild() をコールするための内部変数
        private _tabIndex: number;              // 自身の Tab Index

        /**
         * constructor
         *
         */
        constructor(options: TabViewConstructionOptions<TModel>) {
            super($.extend({}, { initialHeight: SUPPRESS_WARNING_INITIAL_HEIGHT }, options));
            this._host = options.host;
            if (!options.delayRegister) {
                this._host.registerTabView(this);
            }
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IViewPager properties.

        // BaseTabPageView にアクセス
        public get host(): TabHostView {
            return this._host;
        }

        // rebuild 状態へアクセス
        public get needRebuild(): boolean {
            return this._needRebuild;
        }

        // rebuild 状態を設定
        public set needRebuild(rebuild: boolean) {
            this._needRebuild = rebuild;
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IViewPager Framework.

        // 状態に応じたスクロール位置の保存/復元
        treatScrollPosition(): void {
            this.core.treatScrollPosition();
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IViewPager Events.

        // Scroller の初期化時にコールされる
        onInitialize(host: TabHostView, $root: JQuery): void {
            this._host = host;
            this.core.initialize($root, host.getBaseHeight());
            Backbone.View.prototype.setElement.call(this, $root, true);
        }

        // Scroller の破棄時にコールされる
        onDestroy(): void {
            this.remove();
            this._host = null;
        }

        // visibility 属性が変更されたときにコールされる
        onVisibilityChanged(visible: boolean): void {
            // override
        }

        // ページが表示完了したときにコールされる
        onTabSelected(): void {
            this.core.setActiveState(true);
        }

        // ページが非表示に切り替わったときにコールされる
        onTabReleased(): void {
            this.core.setActiveState(false);
        }

        // ドラッグ中にコールされる
        onTabScrolling(position: number, offset: number): void {
            // override
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IOrientationChangedListener events.

        // Orientation の変更を受信
        onOrientationChanged(newOrientation: Framework.Orientation): void {
            // override
        }

        ///////////////////////////////////////////////////////////////////////
        // Override: IListView

        // core framework access
        get core(): ScrollManager {
            return (<any>this)._scrollMgr;
        }

        ///////////////////////////////////////////////////////////////////////
        // protected methods

        // 自身の Tab Index を取得
        protected get tabIndex(): number {
            if (null == this._tabIndex) {
                this._tabIndex = this._host.getTabIndexOf(this);
            }
            return this._tabIndex;
        }

        // 自身が active か判定
        protected isActive(): boolean {
            return this.tabIndex === this._host.getActiveTabIndex();
        }
    }
}
