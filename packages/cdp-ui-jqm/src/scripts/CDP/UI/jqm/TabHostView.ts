// for non flipsnap user.
interface IFlipsnap {
    [x: string]: any;
}
interface FlipsnapOptions {
}

namespace CDP.UI {

    import Model                        = Framework.Model;
    import IOrientationChangedListener  = Framework.IOrientationChangedListener;
    import Orientation                  = Framework.Orientation;

    const TAG = "[CDP.UI.TabHostView] ";

    namespace _Config {
        export const TABVIEW_CLASS = "ui-tabview";
        export const TABVIEW_SELECTOR = "." + TABVIEW_CLASS;
        export const TABHOST_CLASS = "ui-tabhost";
        export const TABHOST_SELECTOR = "." + TABHOST_CLASS;
        export const TABHOST_REFRESH_COEFF = 1.0;       // flipsnap 切り替え時に duration に対して更新を行う係数
        export const TABHOST_REFRESH_INTERVAL = 200;    // flipsnap の更新に使用する間隔 [msec]
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @interface ITabView
     * @brief TabHostView にアタッチ可能な View インターフェイス
     */
    export interface ITabView extends IListView, IOrientationChangedListener {
        host: TabHostView;      // host にアクセス
        $el: JQuery;            // 管理 DOM にアクセス
        needRebuild?: boolean;  // rebuild 状態にアクセス

        ///////////////////////////////////////////////////////////////////////
        // public methods: Framework

        /**
         * 状態に応じたスクロール位置の保存/復元
         * Browser の Native Scroll 時にコールされる
         */
        treatScrollPosition(): void;

        ///////////////////////////////////////////////////////////////////////
        // public methods: Event

        /**
         * Scroller の初期化時にコールされる
         */
        onInitialize(host: TabHostView, $root: JQuery): void;

        /**
         * Scroller の破棄時にコールされる
         */
        onDestroy(): void;

        /**
         * visibility 属性が変更されたときにコールされる
         * active ページとその両端のページが対象
         *
         * @param visible [in] true: 表示 / false: 非表示
         */
        onVisibilityChanged(visible: boolean): void;

        /**
         * ページが表示完了したときにコールされる
         */
        onTabSelected(): void;

        /**
         * ページが非表示に切り替わったときにコールされる
         */
        onTabReleased(): void;

        /**
         * ドラッグ中にコールされる
         *
         * @param position [in] 現在の tab index
         * @param offset   [in] 移動量
         */
        onTabScrolling(position: number, offset: number): void;
    }

    /**
     * @interface TabViewConstructionOptions
     * @brief TabView のオプション
     */
    export interface TabViewConstructionOptions<TModel extends Model = Model> extends ListViewConstructOptions<TModel> {
        host: TabHostView;          // host を指定
        delayRegister?: boolean;    // 遅延登録を行う場合は true
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @interface TabViewContext
     * @brief ITabView を初期化するための情報を格納
     */
    export interface TabViewContext<TModel extends Model = Model> {
        ctor?: new (options?: TabViewConstructionOptions<TModel>) => ITabView;  // ITabView のコンストラクタ
        options?: TabViewConstructionOptions<TModel>;                           // 構築時の基底オプション
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @interface TabHostViewConstructOptions
     * @brief TabHostView の初期化情報を格納するインターフェイスクラス
     */
    export interface TabHostViewConstructOptions<TModel extends Model = Model> extends PageContainerViewOptions<TModel>, FlipsnapOptions {
        inactiveVisibleTabDistance?: number;                            // 非選択時の visible タブ数 ex) 1: 両サイド
        enableNativeScroll?: boolean;                                   // ブラウザの最外枠 の Native スクロールを有効にする場合は true
        tabContexts?: TabViewContext[];                                 // TabViewContext の配列
        enableBounce?: boolean;                                         // 終端で bounce する場合には true
        initialWidth?: number;                                          // width の初期値
        initialHeight?: number;                                         // height の初期値
        scrollHandler?: (event: JQuery.Event) => void;                  // 垂直方向のスクロールハンドラ
        scrollStopHandler?: (event: JQuery.Event) => void;              // 垂直方向のスクロールストップハンドラ
        tabMoveHandler?: (delta: number) => void;                       // 水平方向のスクロールハンドラ
        tabStopHandler?: (newIndex: number, moved: boolean) => void;    // 水平方向のスクロールストップハンドラ
    }

    //___________________________________________________________________________________________________________________//

    // Owner イベントフック
    interface HostHookEvents {
        onOrientationChanged?: (newOrientation: Orientation) => void;
        onPageShow?: (event: JQuery.Event, data?: Framework.ShowEventData) => void;
    }

    /**
     * @class TabHostView
     * @brief タブ切り替え機能を持つ View クラス
     */
    export class TabHostView<TModel extends Model = Model> extends PageContainerView<TModel> implements IOrientationChangedListener {

        private _tabs: ITabView[] = [];                                         // ITabView を格納

        private _activeTabIndex: number = 0;                                    // active tab
        private _flipsnap: IFlipsnap = null;                                    // flipsnap オブジェクト
        private _flipEndEventHandler: (event: JQuery.Event) => void = null;     // "fstouchend"
        private _flipMoveEventHandler: (event: JQuery.Event) => void = null;    // "fstouchmove"
        private _flipDeltaCache: number = 0;                                    // "flip 距離のキャッシュ"
        private _refreshTimerId: number = null;                                 // refresh() 反映確認用
        private _$contentsHolder: JQuery = null;                                // contents holder
        private _settings: TabHostViewConstructOptions<TModel>;                 // TabHostView 設定値

        private _hostEventHooks: HostHookEvents = {};

        /**
         * constructor
         *
         * @param options [in] オプション
         */
        constructor(options: TabHostViewConstructOptions<TModel>) {
            super(options);

            // check runtime condition
            if (null == global.Flipsnap) {
                console.error(TAG + "flipsnap module doesn't load.");
                return;
            }

            this._settings = $.extend({
                tabContexts: [],
                tabMoveHandler: (delta: number): void => { /* noop */ },
                tabStopHandler: (newIndex: number, moved: boolean): void => { /* noop */ }
            }, options);

            // setup event handlers
            this._flipEndEventHandler = (event: JQuery.Event) => {
                const fsEvent: any = event.originalEvent;
                this._flipDeltaCache = 0;
                this.onTabChanged(fsEvent.newPoint, fsEvent.moved);
            };

            this._flipMoveEventHandler = (event: JQuery.Event) => {
                const fsEvent: any = event.originalEvent;
                this._flipDeltaCache += fsEvent.delta;

                // bounce のガード
                if (!this._settings.enableBounce && (
                    (-1 === fsEvent.direction && 0 === this._activeTabIndex && 0 < this._flipDeltaCache) ||
                    (1 === fsEvent.direction && this._activeTabIndex === this._tabs.length - 1 && this._flipDeltaCache < 0)
                )) {
                    event.preventDefault();
                    this._flipsnap.moveToPoint(fsEvent.newPoint);
                } else {
                    this.onTabMoving(fsEvent.delta);
                    this._tabs.forEach((tabview: ITabView) => {
                        tabview.onTabScrolling(this._activeTabIndex, fsEvent.delta);
                    });
                    this.preprocess(this._activeTabIndex);
                }
            };

            if (this._settings.scrollHandler) {
                this.setScrollHandler(this._settings.scrollHandler, true);
            }
            if (this._settings.scrollStopHandler) {
                this.setScrollStopHandler(this._settings.scrollStopHandler, true);
            }

            // host event hook
            this._hostEventHooks.onOrientationChanged = this.owner.onOrientationChanged.bind(this.owner);
            this.owner.onOrientationChanged = this.onOrientationChanged.bind(this);
            this._hostEventHooks.onPageShow = this.owner.onPageShow.bind(this.owner);
            this.owner.onPageShow = this.onPageShow.bind(this);

            // setup tabs
            const initialWidth  = this._settings.initialWidth || this.$el.width();
            const initialHeight = this._settings.initialHeight || this.$el.height();

            const tabContexts = this._settings.tabContexts.slice();
            if (0 < tabContexts.length) {
                tabContexts.forEach((context) => {
                    /* tslint:disable:no-unused-expression */
                    new context.ctor($.extend({}, context.options, { host: this, delayRegister: false }));
                    /* tslint:enable:no-unused-expression */
                });
            } else {
                // ITabView インスタンス化要求
                this.onTabViewSetupRequest(initialHeight);
            }

            // ITabView に $tabHost をアサインする
            // NOTE: 現在は DOM の順序は固定
            this._tabs.forEach((tabview: ITabView, index) => {
                tabview.onInitialize(this, $(this.$el[index]));
            });

            this._$contentsHolder = this.$el.parent();

            // Flipsnap
            this.setFlipsnapCondition($.extend({}, {
                distance: initialWidth,
            }, this._settings));
            this.setActiveTab(this._activeTabIndex, 0, true);
        }

        /**
         * 破棄のヘルパー関数
         * メンバーの破棄のタイミングを変える場合、本メソッドをコールする
         */
        public destroy(): void {
            if (this._settings.scrollHandler) {
                this.setScrollHandler(this._settings.scrollHandler, false);
            }
            if (this._settings.scrollStopHandler) {
                this.setScrollStopHandler(this._settings.scrollStopHandler, false);
            }
            this.resetFlipsnapCondition();
            this._tabs.forEach((tabview: ITabView) => {
                tabview.onDestroy();
            });
            this._tabs = [];
            this._$contentsHolder = null;
        }

        ///////////////////////////////////////////////////////////////////////
        // public methods:

        /**
         * TabView を登録
         * Framework が使用
         *
         * @param tabview [in] ITabView のインスタンス
         */
        public registerTabView(tabview: ITabView): void {
            if (null == this.getTabIndexOf(tabview)) {
                this._tabs.push(tabview);
            } else {
                console.warn(TAG + "tab instance already registered.");
            }
        }

        /**
         * TabView の Tab index を取得
         * Framework が使用
         *
         * @param tabview [in] ITabView のインスタンス
         * @return 指定インスタンスのインデックス
         */
        public getTabIndexOf(tabview: ITabView): number {
            for (let i = 0, n = this._tabs.length; i < n; i++) {
                if (tabview === this._tabs[i]) {
                    return i;
                }
            }
            return null;
        }

        // ページの基準値を取得
        public getBaseHeight(): number {
            return this.$el.height();
        }

        /**
         * タブの数を取得
         *
         * @return {Number} タブ数
         */
        public getTabCount(): number {
            return this._tabs.length;
        }

        // アクティブなタブ Index を取得
        public getActiveTabIndex(): number {
            return this._activeTabIndex;
        }

        // swipe 移動量を取得 (swipe 中に delta の加算値を返却)
        public getSwipeDelta(): number {
            return this._flipDeltaCache;
        }

        // アクティブ Tab を設定
        public setActiveTab(index: number, transitionDuration?: number, initial?: boolean): boolean {
            if (this.validTab(index) && (initial || (this._activeTabIndex !== index))) {
                // 遷移前に scroll 位置の view を更新
                this.preprocess(index);

                const lastActiveTabIndex = this._activeTabIndex;
                this._activeTabIndex = index;
                this._flipsnap.moveToPoint(this._activeTabIndex, transitionDuration);

                {// 遷移後に listview の状態を変更
                    const changeTab = () => {
                        this.postprocess(lastActiveTabIndex);
                        this.onTabChanged(this._activeTabIndex, false);
                    };

                    transitionDuration = transitionDuration || parseInt(this._flipsnap.transitionDuration, 10);
                    if (0 === transitionDuration) {
                        changeTab();
                    } else {
                        setTimeout(() => {
                            changeTab();
                        }, transitionDuration * _Config.TABHOST_REFRESH_COEFF);
                    }
                }
                return true;
            } else {
                return false;
            }
        }

        ///////////////////////////////////////////////////////////////////////
        // protected methods:

        // flip 終了時にコールされる
        protected onTabChanged(newIndex: number, moved: boolean): void {
            if (moved) {
                this.setActiveTab(newIndex);
            }
            this._settings.tabStopHandler(newIndex, moved);
        }

        // flip 中にコールされる
        protected onTabMoving(delta: number): void {
            this._settings.tabMoveHandler(delta);
        }

        // タブポジションの初期化
        protected resetTabPosition(): void {
            this._tabs.forEach((tabview: ITabView) => {
                tabview.scrollTo(0, false, 0);
                tabview.refresh();
            });
            this.setActiveTab(0, 0, true);
        }

        // ITabView 設定リクエスト時にコールされる
        protected onTabViewSetupRequest(initialHeight: number): void {
            // override
        }

        ///////////////////////////////////////////////////////////////////////
        // Host event hooks:

        // Orientation の変更検知
        onOrientationChanged(newOrientation: Orientation): void {
            this._hostEventHooks.onOrientationChanged(newOrientation);

            this._tabs.forEach((tabview: ITabView) => {
                tabview.onOrientationChanged(newOrientation);
            });

            if (null != this._refreshTimerId) {
                clearTimeout(this._refreshTimerId);
            }

            if (this._flipsnap && 0 < this._tabs.length) {
                (() => {
                    const proc = () => {
                        // リトライ
                        if (this._flipsnap && this._flipsnap._maxPoint !== (this._tabs.length - 1)) {
                            this._flipsnap.refresh();
                            this._refreshTimerId = setTimeout(proc, _Config.TABHOST_REFRESH_INTERVAL);
                        } else {
                            this._refreshTimerId = null;
                        }
                    };
                    this._flipsnap.refresh();
                    this._refreshTimerId = setTimeout(proc, _Config.TABHOST_REFRESH_INTERVAL);
                })();
            }
        }

        // jQM event: "pagecontainershow" (旧:"pageshow") に対応
        onPageShow(event: JQuery.Event, data?: Framework.ShowEventData): void {
            this._hostEventHooks.onPageShow(event, data);
            this.rebuild();
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: ScrollManager Profile 管理

        // ページアサインを再構成
        rebuild(): void {
            this._tabs.forEach((tabview: ITabView) => {
                if (tabview.needRebuild) {
                    tabview.rebuild();
                    tabview.needRebuild = false;
                }
            });
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: ScrollManager Scroll

        // スクロールイベントハンドラ設定/解除
        setScrollHandler(handler: (event: JQuery.Event) => void, on: boolean): void {
            if (this._activeTabView) {
                this._activeTabView.setScrollHandler(handler, on);
            }
        }

        // スクロール終了イベントハンドラ設定/解除
        setScrollStopHandler(handler: (event: JQuery.Event) => void, on: boolean): void {
            if (this._activeTabView) {
                this._activeTabView.setScrollStopHandler(handler, on);
            }
        }

        // スクロール位置を取得
        getScrollPos(): number {
            if (this._activeTabView) {
                return this._activeTabView.getScrollPos();
            } else {
                return 0;
            }
        }

        // スクロール位置の最大値を取得
        getScrollPosMax(): number {
            if (this._activeTabView) {
                return this._activeTabView.getScrollPosMax();
            } else {
                return 0;
            }
        }

        // スクロール位置を指定
        scrollTo(pos: number, animate?: boolean, time?: number): void {
            if (this._activeTabView) {
                this._activeTabView.scrollTo(pos, animate, time);
            }
        }

        ///////////////////////////////////////////////////////////////////////
        // private methods:

        // flipsnap 環境設定
        private setFlipsnapCondition(options: FlipsnapOptions): void {
            this._flipsnap = global.Flipsnap(_Config.TABHOST_SELECTOR, options);
            $(this._flipsnap.element).on("fstouchend", _.bind(this._flipEndEventHandler, this));
            $(this._flipsnap.element).on("fstouchmove", _.bind(this._flipMoveEventHandler, this));
        }

        // flipsnap 環境破棄
        private resetFlipsnapCondition(): void {
            if (this._flipsnap) {
                $(this._flipsnap.element).off("fstouchmove", _.bind(this._flipMoveEventHandler, this));
                $(this._flipsnap.element).off("fstouchend", _.bind(this._flipEndEventHandler, this));
                this._flipsnap.destroy();
                this._flipsnap = null;
            }
            this._flipDeltaCache = 0;
        }

        // Tab 切り替えの前処理
        private preprocess(toIndex: number): void {
            this._tabs.forEach((tabview: ITabView, index) => {
                if (index !== this._activeTabIndex) {
                    tabview.treatScrollPosition();
                }
                // 移動範囲を可視化 NOTE: loop 対応時に条件見直し
                if ((this._activeTabIndex < toIndex && (this._activeTabIndex < index && index <= toIndex)) ||
                    (toIndex < this._activeTabIndex && (toIndex <= index && index < this._activeTabIndex))
                ) {
                    tabview.$el.css("visibility", "visible");
                }
            });
        }

        // Tab 切り替えの後処理
        private postprocess(lastActiveTabIndex: number): void {
            this._tabs.forEach((tabview: ITabView, index) => {
                if (null != this._settings.inactiveVisibleTabDistance) {
                    // NOTE: loop 対応時に条件対応
                    const distance = this._settings.inactiveVisibleTabDistance;
                    if (this._activeTabIndex - distance <= index && index <= this._activeTabIndex + distance) {
                        tabview.$el.css("visibility", "visible");
                        tabview.onVisibilityChanged(true);
                    } else {
                        tabview.$el.css("visibility", "hidden");
                        tabview.onVisibilityChanged(false);
                    }
                }
                if (index === this._activeTabIndex) {
                    tabview.onTabSelected();
                } else if (index === lastActiveTabIndex) {
                    tabview.onTabReleased();
                }
            });
        }

        // Tab Index を検証
        private validTab(index: number): boolean {
            if (0 === this._tabs.length) {
                return false;
            } else if (0 <= index && index < this._tabs.length) {
                return true;
            } else {
                console.error(TAG + "invalid tab index. index: " + index);
                return false;
            }
        }

        // アクティブなタブ ScrollManager を取得
        private get _activeTabView(): ITabView {
            return this._tabs[this._activeTabIndex];
        }
    }
}
