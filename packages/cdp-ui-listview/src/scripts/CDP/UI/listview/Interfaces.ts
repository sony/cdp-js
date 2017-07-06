/// <reference types="jquery" />
/// <reference types="backbone" />

namespace CDP.UI {

    /**
     * @interface ListViewOptions
     * @brief ListView の初期化情報を格納するインターフェイスクラス
     */
    export interface ListViewOptions {
        //! 使用する IScroller を変更する場合に指定  [default: ScrollerNative.getFactory()]
        scrollerFactory?: (element: any, options: ListViewOptions) => IScroller;
        enableHiddenPage?: boolean;         //!< pleload 対象を visibility: "hidden" にする場合は true.                [default: false]
        enableTransformOffset?: boolean;    //!< list item の offset を transform で設定する (あまりよくない)          [default: false]
        scrollMapRefreshInterval?: number;  //!< scroll map 領域の更新確認間隔. iscroll 等、非 DOM 操作時に使用        [default: 200]
        scrollRefreshDistance?: number;     //!< ListView 更新処理を行う scroll 移動量 (アルゴリズム見直しも視野)      [default: 200]
        pagePrepareCount?: number;          //!< 表示領域外で完全な状態で追加される page 数 (前方・後方合わせて 2倍)   [default: 3]
        pagePreloadCount?: number;          //!< 表示領域外で hidden 状態で追加される page 数 (前方・後方合わせて 2倍) [default: 1]
        enableAnimation?: boolean;          //!< アニメーションを有効にする場合は true.                                [default: true]
        animationDuration?: number;         //!< アニメーションの費やす時間 (msec)                                     [default: 0]
        baseDepth?: string;                 //!< 基準とする z-index. "collapse" 時のアニメーション時に使用             [default: auto]
        itemTagName?: string;               //!< ListItemView が使用するタグ名                                         [default: div]
        removeItemWithTransition?: boolean; //!< removeItem() 時に必要に応じて自動で transition をかける場合は true    [default: true]
        //! 非アクティブな scroll map に対して Dummy を使用する場合は true. (flipsnap 切り替え時等. 効果はあまりなし)  [default: false]
        useDummyInactiveScrollMap?: boolean;
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @interface IListViewFramework
     * @brief ListView Framework が使用するインターフェイス定義
     */
    export interface IListViewFramework {
        /**
         * Scroll Map の高さを取得
         *
         * @return {Number} 現在の高さ [px]
         */
        getScrollMapHeight(): number;

        /**
         * Scroll Map の高さを更新
         *
         * @param delte {Number} [in] 変化量を指定
         */
        updateScrollMapHeight(delta: number): void;

        /**
         * 内部 Profile の更新
         *
         * @param from {Number} [in] 更新開始インデックスを指定
         */
        updateProfiles(from: number): void;

        /**
         * Scroll Map Element を取得
         *
         * @return {jQuery} scroll map element
         */
        getScrollMapElement(): JQuery;

        /**
         * リサイクル可能な Element を取得
         *
         * @return {jQuery} recycle elements
         */
        findRecycleElements(): JQuery;

        /**
         * ListViewOptions を取得
         * すべてのプロパティアクセスを保証する。
         *
         * @return {ListViewOptions} option オブジェクト
         */
        getListViewOptions(): ListViewOptions;
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @interface IScroller
     * @brief Scroller インターフェイス
     */
    export interface IScroller {
        /**
         * Scroller の型情報を取得
         */
        getType(): string;

        /**
         * position 取得
         *
         * @return {Number} : position
         */
        getPos(): number;

        /**
         * position の最大値を取得
         *
         * @return {Number} : position
         */
        getPosMax(): number;

        /**
         * イベント登録
         *
         * @param type {String}   [in] event 名
         * @param func {Function} [in] event handler
         * @return {Number} : position
         */
        on(type: string, func: (event: JQuery.Event) => void): void;

        /**
         * イベント登録解除
         *
         * @param type {String}   [in] event 名
         * @param func {Function} [in] event handler
         * @return {Number} : position
         */
        off(type: string, func: (event: JQuery.Event) => void): void;

        /**
         * スクロール位置を指定
         *
         * @param pos     {Number}  [in] スクロール位置 (0 - posMax)
         * @param animate {Boolean} [in] アニメーションの有無
         * @param time    {Number}  [in] アニメーションに費やす時間 [msec]
         */
        scrollTo(pos: number, animate?: boolean, time?: number): void;

        /**
         * Scroller の状態更新
         */
        update(): void;

        /**
         * Scroller の破棄
         */
        destroy(): void;
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @interface IScrollable
     * @brief Scroll インターフェイス
     */
    export interface IScrollable {
        /**
         * スクロールイベントハンドラ設定/解除
         *
         * @param handler {Function} [in] ハンドラ関数
         * @param on      {Boolean}  [in] true: 設定 / false: 解除
         */
        setScrollHandler(handler: (event: JQuery.Event) => void, on: boolean): void;

        /**
         * スクロール終了イベントハンドラ設定/解除
         *
         * @param handler {Function} [in] ハンドラ関数
         * @param on      {Boolean}  [in] true: 設定 / false: 解除
         */
        setScrollStopHandler(handler: (event: JQuery.Event) => void, on: boolean): void;

        /**
         * スクロール位置を取得
         *
         * @return {Number} : position
         */
        getScrollPos(): number;

        /**
         * スクロール位置の最大値を取得
         *
         * @return {Number} : position
         */
        getScrollPosMax(): number;

        /**
         * スクロール位置を指定
         *
         * @param pos     {Number}  [in] スクロール位置 (0 - posMax)
         * @param animate {Boolean} [in] アニメーションの有無
         * @param time    {Number}  [in] アニメーションに費やす時間 [msec]
         */
        scrollTo(pos: number, animate?: boolean, time?: number): void;

        /**
         * 指定された ListItemView の表示を保証
         *
         * @param index   {Number}               [in] ListItemView のインデックス
         * @param options {EnsureVisibleOptions} [in] オプション
         */
        ensureVisible(index: number, options?: EnsureVisibleOptions): void;
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @interface IBackupRestore
     * @brief Backup/Restore のインターフェイス
     */
    export interface IBackupRestore {
        /**
         * 内部データをバックアップ
         *
         * @param key {String} [in] バックアップキーを指定
         * @return {Boolean} true: 成功 / false: 失敗
         */
        backup(key: string): boolean;

        /**
         * 内部データをリストア
         *
         * @param key     {String}  [in] バックアップキーを指定
         * @param rebuild {Boolean} [in] rebuild を実行する場合は true を指定
         * @return {Boolean} true: 成功 / false: 失敗
         */
        restore(key: string, rebuild: boolean): boolean;

        /**
         * バックアップデータの有無
         *
         * @param key {String} [in] バックアップキーを指定
         * @return {Boolean} true: 有 / false: 無
         */
        hasBackup(key: string): boolean;

        /**
         * バックアップデータの破棄
         *
         * @param key {String} [in] バックアップキーを指定
         * @return {Boolean} true: 成功 / false: 失敗
         */
        clearBackup(key?: string): boolean;

        /**
         * バックアップデータにアクセス
         *
         * @return {any} バックアップデータオブジェクト
         */
        backupData: any;
    }

    //___________________________________________________________________________________________________________________//

    export type ViewConstructor = new (options?: Backbone.ViewOptions<Backbone.Model>) => Backbone.View<Backbone.Model>;

    /**
     * @interface IComposableView
     * @brief IComposableViewStatic のプロキシインターフェイス (experimental)
     */
    export interface IComposableView {
    }

    /**
     * @interface IComposableViewStatic
     * @brief View compose インターフェイス
     */
    export interface IComposableViewStatic {
        new (): IComposableView;
        /**
         * すでに定義された Backbone.View を基底クラスに設定し、extend を実行する。
         *
         * @param derives         {Backbone.View|Backbone.View[]} [in] 合成元の View クラス
         * @param properties      {Object}                        [in] prototype プロパティ
         * @param classProperties {Object}                        [in] static プロパティ
         * @return {Backbone.View|Backbone.View[]} 新規に生成された View のコンストラクタ
         */
        compose(derives: ViewConstructor | ViewConstructor[], properties: any, classProperties?: any): ViewConstructor;
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @interface UpdateHeightOptions
     * @brief IListItemView.updateHeight() に渡せるオプション
     */
    export interface UpdateHeightOptions {
        reflectAll?: boolean;    //!< line の高さ更新時に影響するすべての LineProfile の再計算を行う場合は true
    }

    /**
     * @interface IListItemView
     * @brief     ListView の 1行分を構成する Child View インターフェイス
     */
    export interface IListItemView {
        //! 自身の Line インデックスを取得
        getIndex(): number;
        //! 自身に指定された高さを取得
        getSpecifiedHeight(): number;
        //! child node が存在するか判定
        hasChildNode(): boolean;

        /**
         * 高さを更新
         *
         * @param newHeight {Number}              [in] 新しい高さ
         * @param options   {UpdateHeightOptions} [in] line の高さ更新時に影響するすべての LineProfile の再計算を行う場合は { reflectAll: true }
         * @return {IListItemView} インスタンス
         */
        updateHeight(newHeight: number, options?: UpdateHeightOptions): IListItemView;
    }

    /**
     * @interface BaseListItemView
     * @brief     IListItemView の alias
     */
    export interface BaseListItemView extends IListItemView, Backbone.View<Backbone.Model> { }

    /**
     * @interface EnsureVisibleOptions
     * @brief IListView.ensureVisible() に渡せるオプション
     */
    export interface EnsureVisibleOptions {
        partialOK?: boolean;    //!< 部分的表示を許可する場合 true, default: true.
        setTop?: boolean;       //!< 強制的にスクロール領域の上部に移動する場合 true, default: false.
        animate?: boolean;      //!< アニメーションする場合 true. default: ListViewOptions.enableAnimation の設定と同期
        time?: number;          //!< アニメーションに費やす時間 [msec]
        callback?: () => void;  //!< アニメーション終了のタイミングでコールされる. (疑似的)
    }

    /**
     * @interface IListView
     * @brief ListView のインターフェイス
     */
    export interface IListView extends IScrollable, IBackupRestore {

        ///////////////////////////////////////////////////////////////////////
        // Profile 管理

        /**
         * 初期化済みか判定
         *
         * @return {Boolean} true: 初期化済み / false: 未初期化
         */
        isInitialized(): boolean;

        /**
         * Item 登録
         * プロパティを指定して、ListItem を管理
         *
         * @param height      {Number}   [in] ラインの高さ
         * @param initializer {Function} [in] ListItemView 派生クラスのコンストラクタ
         * @param info        {Object}   [in] initializer に渡されるオプション引数
         * @param insertTo    {Number}   [in] ラインの挿入位置をインデックスで指定
         */
        addItem(height: number, initializer: new (options?: any) => BaseListItemView, info: any, insertTo?: number): void;

        /**
         * 指定した Item を削除
         *
         * @param index {Number|Number[]} [in] 解除開始のインデックスを指定. 配列版は reverse index を指定するほうが効率的
         * @param size  {Number}          [in] 解除するラインの総数. 既定: 1
         * @param delay {Number}          [in] 実際に要素を削除する delay time 既定: 0 (即時削除)
         */
        removeItem(index: number, size?: number, delay?: number): void;
        removeItem(index: number[], delay?: number): void;

        /**
         * 指定した Item に設定した情報を取得
         *
         * @param target {Number|JQuery.Event} [in] 識別子. [index | event object]
         * @return {Object} _addLine() に指定した info オブジェクト
         */
        getItemInfo(target: number): any;
        getItemInfo(target: JQuery.Event): any;

        //! アクティブページを更新
        refresh(): void;
        //! 未アサインページを構築
        update(): void;
        //! ページアサインを再構成
        rebuild(): void;
        //! 管轄データを破棄
        release(): void;

        ///////////////////////////////////////////////////////////////////////
        // Properties:

        //! core framework access
        core: IListViewFramework;
    }

    /**
     * @interface IListView
     * @brief ListView のインターフェイス
     */
    export interface IListView {
        //! 登録 framework が使用する
        _addLine?(_line: LineProfile, insertTo?: number): void;
        _addLine?(_line: LineProfile[], insertTo?: number): void;
    }

    /**
     * @interface BaseListView
     * @brief     IListView の alias
     */
    export interface BaseListView extends IListView, Backbone.View<Backbone.Model> { }

    //___________________________________________________________________________________________________________________//

    /**
     * @interface IStatusManager
     * @brief 状態管理インターフェイス
     */
    export interface IStatusManager {
        /**
         * 状態変数の参照カウントのインクリメント
         *
         * @param status {String} [in] 状態識別子
         */
        statusAddRef(status: string): number;

        /**
         * 状態変数の参照カウントのデクリメント
         *
         * @param status {String} [in] 状態識別子
         */
        statusRelease(status: string): number;

        /**
         * 処理スコープ毎に状態変数を設定
         *
         * @param status   {String}   [in] 状態識別子
         * @param callback {Function} [in] 処理コールバック
         */
        statusScope(status: string, callback: () => void): void;

        /**
         * 指定した状態中であるか確認
         *
         * @param status {String}   [in] 状態識別子
         * @return {Boolean} true: 状態内 / false: 状態外
         */
        isStatusIn(status: string): boolean;
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @interface IExpandManager
     * @brief 開閉管理インターフェイス
     */
    export interface IExpandManager extends IBackupRestore, IStatusManager {
        layoutKey: string;    // layout key (portrate/landscapeごとに layout情報にアクセス)

        /**
         * 新規 GroupProfile を作成
         * 登録済みの場合はそのオブジェクトを返却
         *
         * @parma id {String} [in] 新規に作成する Group ID を指定. 指定しない場合は自動割り振り
         * @return {GroupProfile} GroupProfile インスタンス
         */
        newGroup(id?: string): GroupProfile;

        /**
         * 登録済み Group を取得
         *
         * @parma id {String} [in] 取得する Group ID を指定
         * @return {GroupProfile} GroupProfile インスタンス / null
         */
        getGroup(id: string): GroupProfile;

        /**
         * 第1階層の Group 登録
         *
         * @param topGroup {GroupProfile} [in] 構築済み GroupProfile インスタンス
         */
        registerTopGroup(topGroup: GroupProfile): void;

        /**
         * 第1階層の Group を取得
         * コピー配列が返されるため、クライアントはキャッシュ不可
         *
         * @return {GroupProfile[]} GroupProfile 配列
         */
        getTopGroups(): GroupProfile[];

        //! すべてのグループを展開 (1階層)
        expandAll(): void;

        //! すべてのグループを収束 (1階層)
        collapseAll(delay?: number): void;

        //! 展開中か判定
        isExpanding(): boolean;

        //! 収束中か判定
        isCollapsing(): boolean;

        //! 開閉中か判定
        isSwitching(): boolean;
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @interface ExpandableListView
     * @brief 開閉リストビューインターフェイス
     */
    export interface IExpandableListView extends IListView, IExpandManager { }

    /**
     * @interface BaseExpandableListView
     * @brief     IExpandableListView の alias
     */
    export interface BaseExpandableListView extends IExpandableListView, Backbone.View<Backbone.Model> { }
}

declare module "cdp.ui.listview" {
    const UI: typeof CDP.UI;
    export = UI;
}
