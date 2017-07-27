/* tslint:disable:no-bitwise no-unused-expression */
/* jshint -W030 */  // for "Expected an assignment or function call and instead saw an expression"

namespace CDP.UI {

    import _Config  = CDP.UI.ListViewGlobalConfig;
    import _Utils   = CDP.UI._ListViewUtils;

    const TAG = "[CDP.UI.ScrollManager] ";

    /**
     * @class ScrollManager
     * @brief メモリ管理を行うスクロール処理のコアロジック実装クラス
     *        本クラスは IListView インターフェイスを持ち DOM にアクセスするが、Backbone.View を継承しない
     */
    export class ScrollManager implements IListViewFramework, IScrollable, IBackupRestore {

        private _$root: JQuery = null;                                              //!< Scroll 対象のルートオブジェクト
        private _$map: JQuery = null;                                               //!< Scroll Map element を格納
        private _mapHeight: number = 0;                                             //!< Scroll Map の高さを格納 (_$map の状態に依存させない)
        private _scroller: IScroller = null;                                        //!< Scroll に使用する IScroller インスタンス
        private _settings: ListViewOptions = null;                                  //!< ScrollManager オプションを格納
        private _active = true;                                                     //!< UI 表示中は true に指定
        private _scrollEventHandler: (event: JQuery.Event) => void = null;          //!< Scroll Event Handler
        private _scrollStopEventHandler: (event: JQuery.Event) => void = null;      //!< Scroll Stop Event Handler
        private _baseHeight: number = 0;                                            //!< 高さの基準値
        private _lines: LineProfile[] = [];                                         //!< 管理下にある LineProfile 配列
        private _pages: PageProfile[] = [];                                         //!< 管理下にある PageProfile 配列
        //! 最新の表示領域情報を格納 (Scroll 中の更新処理に使用)
        private _lastActivePageContext = {
            index: 0,
            from: 0,
            to: 0,
            pos: 0,    // scroll position
        };
        protected _backup = {};    //!< データの backup 領域. key と _lines を格納。派生クラスで拡張可能。

        /**
         * constructor
         *
         * @param _$root  {JQuery} [in] 管理対象のルートエレメント
         * @param options {ListViewOptions} [in] オプション
         */
        constructor(options?: ListViewOptions) {
            // ListViewOptions 既定値
            const defOptions: ListViewOptions = {
                scrollerFactory: ScrollerNative.getFactory(),
                enableHiddenPage: false,
                enableTransformOffset: false,
                scrollMapRefreshInterval: 200,
                scrollRefreshDistance: 200,
                pagePrepareCount: 3,
                pagePreloadCount: 1,
                enableAnimation: true,
                animationDuration: 0,
                baseDepth: "auto",
                itemTagName: "li",
                removeItemWithTransition: true,
                useDummyInactiveScrollMap: false,
            };

            // 設定格納
            this._settings = $.extend({}, defOptions, options);

            // スクロールイベント
            this._scrollEventHandler = (event: JQuery.Event): void => {
                this.onScroll(this._scroller.getPos());
            };
            // スクロール停止イベント
            this._scrollStopEventHandler = (event: JQuery.Event): void => {
                this.onScrollStop(this._scroller.getPos());
            };
        }

        ///////////////////////////////////////////////////////////////////////
        // public method

        //! 内部オブジェクトの初期化
        public initialize($root: JQuery, height: number): boolean {
            // 既に構築されていた場合は破棄
            if (this._$root) {
                this.destroy();
            }

            this._$root = $root;
            this._$map = $root.hasClass(_Config.SCROLL_MAP_CLASS) ? $root : $root.find(_Config.SCROLL_MAP_SELECTOR);
            // _$map が無い場合は初期化しない
            if (this._$map.length <= 0) {
                this._$root = null;
                return false;
            }

            this._scroller = this.createScroller();
            this.setBaseHeight(height);
            this.setScrollerCondition();

            return true;
        }

        //! 内部オブジェクトの破棄
        public destroy(): void {
            if (this._scroller) {
                this.resetScrollerCondition();
                this._scroller.destroy();
                this._scroller = null;
            }
            this.release();
            this._$map = null;
            this._$root = null;
        }

        //! ページの基準値を取得
        public setBaseHeight(height: number): void {
            this._baseHeight = height;
            if (this._baseHeight <= 0) {
                console.warn(TAG + "invalid base height: " + this._baseHeight);
            }
            if (this._scroller) {
                this._scroller.update();
            }
        }

        //! active 状態設定
        public setActiveState(active: boolean): void {
            this._active = active;
            this.treatScrollPosition();
        }

        //! active 状態判定
        public isActive(): boolean {
            return this._active;
        }

        //! scroller の種類を取得
        public getScrollerType(): string {
            return (<any>this._settings.scrollerFactory).type;
        }

        /**
         * 状態に応じたスクロール位置の保存/復元
         * cdp.ui.fs.js: PageTabListView が実験的に使用
         * TODO: ※iscroll は未対応
         */
        public treatScrollPosition(): void {
            let i: number;
            const transform = {};

            const updateOffset = ($target: JQuery, offset?: number): JQuery => {
                offset = offset || (this._scroller.getPos() - this._lastActivePageContext.pos);
                if (_Utils.getCssMatrixValue($target, "translateY") !== offset) {
                    for (i = 0; i < _Utils.cssPrefixes.length; i++) {
                        transform[_Utils.cssPrefixes[i] + "transform"] = "translate3d(0px," + offset + "px,0px)";
                    }
                    $target.css(transform);
                    return $target;
                }
            };

            const clearOffset = ($target: JQuery): JQuery => {
                for (i = 0; i < _Utils.cssPrefixes.length; i++) {
                    transform[_Utils.cssPrefixes[i] + "transform"] = "";
                }
                $target.css(transform);
                return $target;
            };

            if (this._active) {
                // 以下のスコープの処理に対して画面更新を1回にできないため、JB, ICS ではちらつきが発生する。Kitkat 以降は良好。
                (() => {
                    if (this._scroller) {
                        this._scroller.scrollTo(this._lastActivePageContext.pos, false, 0);
                    }
                    clearOffset(this._$map).css("display", "block");
                })();
                if (this._settings.useDummyInactiveScrollMap) {
                    this.prepareInactiveMap().remove();
                }
            } else {
                if (this._settings.useDummyInactiveScrollMap) {
                    updateOffset(this.prepareInactiveMap());
                } else {
                    updateOffset(this._$map);
                }
            }
        }

        //! inactive 用 Map の生成
        private prepareInactiveMap(): JQuery {
            const $parent = this._$map.parent();
            let $inactiveMap = $parent.find(_Config.INACTIVE_CLASS_SELECTOR);
            if ($inactiveMap.length <= 0) {
                const currentPageIndex = this.getPageIndex();
                const $listItemViews = this._$map.clone().children().filter((index: number, element: HTMLElement) => {
                    const pageIndex = ~~$(element).attr(_Config.DATA_PAGE_INDEX);
                    if (currentPageIndex - 1 <= pageIndex || pageIndex <= currentPageIndex + 1) {
                        return true;
                    } else {
                        return false;
                    }
                });
                $inactiveMap = $("<section class='" + _Config.SCROLL_MAP_CLASS + " " + _Config.INACTIVE_CLASS + "'></section>")
                    .append($listItemViews)
                    .height(this._mapHeight);
                $parent.append($inactiveMap);
                this._$map.css("display", "none");
            }
            return $inactiveMap;
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IListView プロファイル管理

        //! 初期化済みか判定
        isInitialized(): boolean {
            return !!this._$root;
        }

        //! プロパティを指定して、LineProfile を管理
        addItem(
            height: number,
            initializer: new (options?: any) => BaseListItemView,
            info: any,
            insertTo?: number
        ): void {
            this._addLine(new LineProfile(this, Math.floor(height), initializer, info), insertTo);
        }

        //! プロパティを指定して、LineProfile を管理. 登録 framework が使用する
        public _addLine(_line: any, insertTo?: number): void {
            const lines: LineProfile[] = (_line instanceof Array) ? <LineProfile[]>_line : [_line];
            let i: number, n: number;
            let deltaHeight = 0;
            let addTail = false;

            if (null == insertTo) {
                insertTo = this._lines.length;
            }

            if (insertTo === this._lines.length) {
                addTail = true;
            }

            // scroll map の更新
            for (i = 0, n = lines.length; i < n; i++) {
                deltaHeight += lines[i].height;
            }
            this.updateScrollMapHeight(deltaHeight);

            // 挿入
            for (i = lines.length - 1; i >= 0; i--) {
                this._lines.splice(insertTo, 0, lines[i]);
            }

            // page 設定の解除
            if (!addTail) {
                if (0 === insertTo) {
                    this.clearPage();
                } else if (null != this._lines[insertTo - 1].pageIndex) {
                    this.clearPage(this._lines[insertTo - 1].pageIndex);
                }
            }

            // offset の再計算
            this.updateProfiles(insertTo);
        }

        //! 指定した Item を削除
        removeItem(index: number, size?: number, delay?: number): void;
        removeItem(index: number[], delay?: number): void;
        removeItem(index: any, arg2?: number, arg3?: number): void {
            if (index instanceof Array) {
                this._removeLines(index, arg2);
            } else {
                this._removeLine(index, arg2, arg3);
            }
        }

        //! 指定した LineProfile を削除: 連続 index 版
        public _removeLine(index: number, size?: number, delay?: number): void {
            if (null == size) {
                size = 1;
            }
            if (index < 0 || this._lines.length < index + size) {
                console.error(TAG + "logic error. removeItem(), invalid index: " + index);
                return;
            }

            delay = (null != delay) ? delay : 0;

            const removed: LineProfile[] = [];
            let delta = 0;
            let mapTransition = false;

            // 削除候補と変化量の算出
            (() => {
                let line: LineProfile;
                for (let i = 0; i < size; i++) {
                    line = this._lines[index + i];
                    delta += line.height;
                    // 削除要素の z-index の初期化
                    line.resetDepth();
                    removed.push(line);
                }
                // 自動設定・削除遅延時間が設定されかつ、スクロールポジションに変更がある場合は transition 設定
                if (this._settings.removeItemWithTransition && (0 < delay)) {
                    const current = this.getScrollPos();
                    const posMax = this.getScrollPosMax() - delta;
                    mapTransition = (posMax < current);
                }
            })();

            // 更新
            (() => {
                // transition 設定
                if (mapTransition) {
                    this.setupScrollMapTransition(this._$map, delay);
                }
                // page 設定の解除
                if (null != this._lines[index].pageIndex) {
                    this.clearPage(this._lines[index].pageIndex);
                }
                // スクロール領域の更新
                this.updateScrollMapHeight(-delta);
                // 配列から削除
                this._lines.splice(index, size);
                // offset の再計算
                this.updateProfiles(index);
                // 遅延削除
                setTimeout(() => {
                    removed.forEach((line) => {
                        line.inactivate();
                    });
                }, delay);
            })();
        }

        //! 指定した LineProfile を削除: random access 版
        public _removeLines(indexes: number[], delay?: number): void {
            delay = (null != delay) ? delay : 0;

            for (let i = 0, n = indexes.length; i < n; i++) {
                if (i < 0 || this._lines.length < i) {
                    console.error(TAG + "logic error. removeItem(), invalid index: " + i);
                    return;
                }
            }

            const removed: LineProfile[] = [];
            let delta = 0;
            let mapTransition = false;

            // 削除候補と変化量の算出
            (() => {
                let line: LineProfile;
                indexes.forEach((index: number) => {
                    line = this._lines[index];
                    delta += line.height;
                    // 削除要素の z-index の初期化
                    line.resetDepth();
                    removed.push(line);
                });
                // 自動設定・削除遅延時間が設定されかつ、スクロールポジションに変更がある場合は transition 設定
                if (this._settings.removeItemWithTransition && (0 < delay)) {
                    const current = this.getScrollPos();
                    const posMax = this.getScrollPosMax() - delta;
                    mapTransition = (posMax < current);
                }
            })();

            // 更新
            (() => {
                // transition 設定
                if (mapTransition) {
                    this.setupScrollMapTransition(this._$map, delay);
                }
                indexes.forEach((index: number) => {
                    // page 設定の解除
                    if (null != this._lines[index].pageIndex) {
                        this.clearPage(this._lines[index].pageIndex);
                    }
                    // 配列から削除
                    this._lines.splice(index, 1);
                    // offset の再計算
                    this.updateProfiles(index);
                });
                // スクロール領域の更新
                this.updateScrollMapHeight(-delta);
                // 遅延削除
                setTimeout(() => {
                    removed.forEach((line) => {
                        line.inactivate();
                    });
                }, delay);
            })();
        }

        //! scroll map のトランジション設定
        private setupScrollMapTransition($map: JQuery, delay: number): void {
            const transitionEndHandler = (event: JQuery.Event) => {
                $map.off(_Utils.transitionEnd);
                _Utils.clearTransitions($map);
            };
            this._$map.on(_Utils.transitionEnd, transitionEndHandler);
            _Utils.setTransformsTransitions($map, "height", delay, "ease");
        }

        //! 指定した Item に設定した情報を取得
        getItemInfo(target: number): any;
        getItemInfo(target: JQuery.Event): any;
        getItemInfo(target: any): any {
            let index: number;

            const parser = ($target: JQuery): number => {
                if ($target.hasClass(_Config.LISTITEM_BASE_CLASS)) {
                    return ~~$target.attr(_Config.DATA_CONTAINER_INDEX);
                } else if ($target.hasClass(_Config.SCROLL_MAP_CLASS) || $target.length <= 0) {
                    console.warn(TAG + "cannot ditect line from event object.");
                    return null;
                } else {
                    return parser($target.parent());
                }
            };

            if (target instanceof $.Event) {
                index = parser($(target.currentTarget));
            } else if (typeof target === "number") {
                index = target;
            }

            if (null == index) {
                console.error(TAG + "logic error. unsupported arg type. type: " + typeof target);
                return null;
            } else if (index < 0 || this._lines.length <= index) {
                console.error(TAG + "logic error. invalid range. index: " + index);
                return null;
            }

            return this._lines[index].info;
        }

        //! アクティブページを更新
        refresh(): void {
            const targets: any = {};
            const searchCount = this._settings.pagePrepareCount + this._settings.pagePreloadCount;
            const currentPageIndex = this.getPageIndex();
            const highPriorityIndex: number[] = [];

            const oldExsistPage = _.filter(this._pages, (page: PageProfile) => {
                return "inactive" !== page.status;
            });

            const changeState = (index: number): void => {
                if (index === currentPageIndex) {
                    targets[index] = "activate";
                    highPriorityIndex.push(index);
                } else if (_Utils.abs(currentPageIndex - index) <= this._settings.pagePrepareCount) {
                    targets[index] = "activate";
                } else {
                    if (this._settings.enableHiddenPage) {
                        targets[index] = "hide";
                    } else {
                        targets[index] = "activate";
                    }
                }
                // current page の 前後は high priority にする
                if (currentPageIndex + 1 === index || currentPageIndex - 1 === index) {
                    highPriorityIndex.push(index);
                }
            };

            // 対象無し
            if (this._lines.length <= 0) {
                return;
            }

            (() => {
                let i = 0;
                let pageIndex = 0;
                let overflowPrev = 0, overflowNext = 0;
                const beginIndex = currentPageIndex - searchCount;
                const endIndex = currentPageIndex + searchCount;
                for (pageIndex = beginIndex; pageIndex <= endIndex; pageIndex++) {
                    if (pageIndex < 0) {
                        overflowPrev++;
                        continue;
                    }
                    if (this._pages.length <= pageIndex) {
                        overflowNext++;
                        continue;
                    }
                    changeState(pageIndex);
                }

                if (0 < overflowPrev) {
                    for (i = 0, pageIndex = currentPageIndex + searchCount + 1; i < overflowPrev; i++ , pageIndex++) {
                        if (this._pages.length <= pageIndex) {
                            break;
                        }
                        changeState(pageIndex);
                    }
                }

                if (0 < overflowNext) {
                    for (i = 0, pageIndex = currentPageIndex - searchCount - 1; i < overflowNext; i++ , pageIndex--) {
                        if (pageIndex < 0) {
                            break;
                        }
                        changeState(pageIndex);
                    }
                }
            })();

            // 不要になった page の inactivate
            oldExsistPage.forEach((page: PageProfile) => {
                const index = page.index;
                if (null == targets[index]) {
                    page.inactivate();
                }
            });

            // 優先 page の activate
            highPriorityIndex
                .sort((lhs: number, rhs: number) => {
                    if (lhs < rhs) {
                        return -1;
                    } else if (lhs > rhs) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                .forEach((index: number) => {
                    setTimeout(() => {
                        if (this.isInitialized()) {
                            this._pages[index] && this._pages[index].activate();
                        }
                    }, 0);
                });

            // そのほかの page の 状態変更
            _.each(targets, (action: string, key: string) => {
                setTimeout(() => {
                    if (this.isInitialized()) {
                        const index = ~~key;
                        switch (action) {
                            case "activate":
                                this._pages[index] && this._pages[index].activate();
                                break;
                            case "hide":
                                this._pages[index] && this._pages[index].hide();
                                break;
                            case "inactivate":
                                console.warn(TAG + "unexpected operation: inactivate");
                                break;
                            default:
                                console.warn(TAG + "unknown operation: " + targets[key]);
                                break;
                        }
                    }
                }, 0);
            });

            // 更新後に使用しなかった DOM を削除
            this.findRecycleElements().remove();

            this._lastActivePageContext.from = this._pages[currentPageIndex].getLineProfileFirst() ?
                this._pages[currentPageIndex].getLineProfileFirst().index : 0;
            this._lastActivePageContext.to = this._pages[currentPageIndex].getLineProfileLast() ?
                this._pages[currentPageIndex].getLineProfileLast().index : 0;
            this._lastActivePageContext.index = currentPageIndex;
        }

        //! 未アサインページを構築
        update(): void {
            const index = this._pages.length;
            this.assignPage(index);
            this.refresh();
        }

        //! ページアサインを再構成
        rebuild(): void {
            this.clearPage();
            this.assignPage();
            this.refresh();
        }

        //! 管轄データを破棄
        release(): void {
            this._lines.forEach((line: LineProfile) => {
                line.inactivate();
            });
            this._pages = [];
            this._lines = [];
            if (this._$map) {
                this._mapHeight = 0;
                this._$map.height(0);
            }
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IListView Backup / Restore

        //! 内部データをバックアップ
        backup(key: string): boolean {
            if (null == this._backup[key]) {
                this._backup[key] = {
                    lines: this._lines,
                };
            }
            return true;
        }

        //! 内部データをリストア
        restore(key: string, rebuild: boolean = true): boolean {
            if (null == this._backup[key]) {
                return false;
            }
            if (0 < this._lines.length) {
                this.release();
            }

            this._addLine(this._backup[key].lines);

            if (rebuild) {
                this.rebuild();
            }

            return true;
        }

        //! バックアップデータの有無
        hasBackup(key: string): boolean {
            if (null != this._backup[key]) {
                return true;
            } else {
                return false;
            }
        }

        //! バックアップデータの破棄
        clearBackup(key?: string): boolean {
            if (null == key) {
                this._backup = {};
                return true;
            } else if (null != this._backup[key]) {
                delete this._backup[key];
                return true;
            } else {
                return false;
            }
        }

        //! バックアップデータにアクセス
        get backupData(): any {
            return this._backup;
        }

        ///////////////////////////////////////////////////////////////////////
        // Implements: IListView Scroll

        //! スクロールイベントハンドラ設定/解除
        setScrollHandler(handler: (event: JQuery.Event) => void, on: boolean): void {
            if (this._scroller) {
                if (on) {
                    this._scroller.on("scroll", handler);
                } else {
                    this._scroller.off("scroll", handler);
                }
            }
        }

        //! スクロール終了イベントハンドラ設定/解除
        setScrollStopHandler(handler: (event: JQuery.Event) => void, on: boolean): void {
            if (this._scroller) {
                if (on) {
                    this._scroller.on("scrollstop", handler);
                } else {
                    this._scroller.off("scrollstop", handler);
                }
            }
        }

        //! スクロール位置を取得
        getScrollPos(): number {
            return this._scroller ? this._scroller.getPos() : 0;
        }

        //! スクロール位置の最大値を取得
        getScrollPosMax(): number {
            return this._scroller ? this._scroller.getPosMax() : 0;
        }

        //! スクロール位置を指定
        scrollTo(pos: number, animate?: boolean, time?: number): void {
            if (this._scroller) {
                if (pos < 0) {
                    console.warn(TAG + "invalid position, too small. [pos: " + pos + "]");
                    pos = 0;
                } else if (this._scroller.getPosMax() < pos) {
                    console.warn(TAG + "invalid position, too big. [pos: " + pos + "]");
                    pos = this._scroller.getPosMax();
                }
                // pos のみ先駆けて更新
                this._lastActivePageContext.pos = pos;
                if (pos !== this._scroller.getPos()) {
                    this._scroller.scrollTo(pos, animate, time);
                }
            }
        }

        //! 指定された ListItemView の表示を保証
        ensureVisible(index: number, options?: EnsureVisibleOptions): void {
            if (index < 0 || this._lines.length <= index) {
                console.warn(TAG + "ensureVisible(), invalid index, noop. [index: " + index + "]");
                return;
            } else if (!this._scroller) {
                console.warn(TAG + "scroller is not ready.");
                return;
            }

            (() => {
                const target = this._lines[index];

                const defaultOptions: EnsureVisibleOptions = {
                    partialOK: true,
                    setTop: false,
                    animate: this._settings.enableAnimation,
                    time: this._settings.animationDuration,
                    callback: (): void => { /* noop */ },
                };
                const operation: EnsureVisibleOptions = $.extend({}, defaultOptions, options);

                const currentScope = {
                    from: this._scroller.getPos(),
                    to: this._scroller.getPos() + this._baseHeight,
                };
                const targetScope = {
                    from: target.offset,
                    to: target.offset + target.height,
                };

                const isInScope = (): boolean => {
                    if (operation.partialOK) {
                        if (targetScope.from <= currentScope.from) {
                            if (currentScope.from <= targetScope.to) {
                                return true;
                            } else {
                                return false;
                            }
                        } else {
                            if (targetScope.from <= currentScope.to) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    } else {
                        if (currentScope.from <= targetScope.from && targetScope.to <= currentScope.to) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                };

                const detectPosition = (): number => {
                    if (targetScope.from < currentScope.from) {
                        return targetScope.from;
                    } else if (currentScope.from < targetScope.from) {
                        return target.offset - target.height; // bottom 合わせは情報不足により不可
                    } else {
                        console.warn(TAG + "logic error.");
                        return 0;
                    }
                };

                let pos: number;

                if (operation.setTop) {
                    pos = targetScope.from;
                } else if (isInScope()) {
                    // noop.
                    operation.callback();
                    return;
                } else {
                    pos = detectPosition();
                }

                // 補正
                if (pos < 0) {
                    pos = 0;
                } else if (this._scroller.getPosMax() < pos) {
                    pos = this._scroller.getPosMax();
                }

                setTimeout(operation.callback, operation.time);
                this.scrollTo(pos, operation.animate, operation.time);
            })();
        }

        ///////////////////////////////////////////////////////////////////////
        // implements: IListViewFramework:

        //! Scroll Map の高さを取得
        getScrollMapHeight(): number {
            return this._$map ? this._mapHeight : 0;
        }

        //! Scroll Map の高さを更新. framework が使用する.
        updateScrollMapHeight(delta: number): void {
            if (this._$map) {
                this._mapHeight += delta;
                // for fail safe.
                if (this._mapHeight < 0) {
                    this._mapHeight = 0;
                }
                this._$map.height(this._mapHeight);
            }
        }

        //! 内部 Profile の更新. framework が使用する.
        updateProfiles(from: number): void {
            let i: number, n: number;
            let last: LineProfile;
            for (i = from, n = this._lines.length; i < n; i++) {
                if (0 < i) {
                    last = this._lines[i - 1];
                    this._lines[i].index = last.index + 1;
                    this._lines[i].offset = last.offset + last.height;
                } else {
                    this._lines[i].index = 0;
                    this._lines[i].offset = 0;
                }
            }
        }

        //! Scroll Map Element を取得. framework が使用する.
        getScrollMapElement(): JQuery {
            return this._$map || $("");
        }

        //! リサイクル可能な Element を取得. framework が使用する.
        findRecycleElements(): JQuery {
            return this._$map ? this._$map.find(_Config.RECYCLE_CLASS_SELECTOR) : $("");
        }

        //! ListViewOptions を取得. framework が使用する.
        getListViewOptions(): ListViewOptions {
            return this._settings;
        }

        ///////////////////////////////////////////////////////////////////////
        // private method:

        //! Scroller 用環境設定
        private setScrollerCondition(): void {
            this._scroller.on("scroll", this._scrollEventHandler);
            this._scroller.on("scrollstop", this._scrollStopEventHandler);
        }

        //! Scroller 用環境破棄
        private resetScrollerCondition(): void {
            this._scroller.off("scrollstop", this._scrollStopEventHandler);
            this._scroller.off("scroll", this._scrollEventHandler);
        }

        //! 既定の Scroller オブジェクトの作成
        private createScroller(): IScroller {
            return this._settings.scrollerFactory(this._$root[0], this._settings);
        }

        //! 現在の Page Index を取得
        private getPageIndex(): number {
            let i: number, n: number;
            let page: PageProfile;
            let candidate: number;

            const scrollPos = this._scroller ? this._scroller.getPos() : 0;
            const scrollPosMax = this._scroller ? this._scroller.getPosMax() : 0;
            const scrollMapSize = (() => {
                const lastPage = this.getLastPage();
                if (null != lastPage) {
                    return lastPage.offset + lastPage.height;
                } else {
                    return this._baseHeight;
                }
            })();

            const pos = (() => {
                if (0 === scrollPosMax || scrollPosMax <= this._baseHeight) {
                    return 0;
                } else {
                    return scrollPos * scrollMapSize / scrollPosMax;
                }
            })();

            const validRange = (_page: PageProfile): boolean => {
                if (null == _page) {
                    return false;
                } else if (_page.offset <= pos && pos <= _page.offset + _page.height) {
                    return true;
                } else {
                    return false;
                }
            };

            if (this._baseHeight <= 0) {
                console.error(TAG + "invalid base height: " + this._baseHeight);
                return 0;
            }

            candidate = Math.floor(pos / this._baseHeight);
            if (this._pages.length <= candidate) {
                candidate = this._pages.length - 1;
            }

            page = this._pages[candidate];
            if (validRange(page)) {
                return page.index;
            } else if (pos < page.offset) {
                for (i = candidate - 1; i >= 0; i--) {
                    page = this._pages[i];
                    if (validRange(page)) {
                        return page.index;
                    }
                }
                console.warn(TAG + "unknown page index.");
                return 0;
            } else {
                for (i = candidate + 1, n = this._pages.length; i < n; i++) {
                    page = this._pages[i];
                    if (validRange(page)) {
                        return page.index;
                    }
                }
                console.warn(TAG + "unknown page index.");
                return this._pages.length - 1;
            }
        }

        /**
         * スクロールイベント
         *
         * @param pos {Number} [in] スクロールポジション
         */
        private onScroll(pos: number): void {
            if (this._active && 0 < this._pages.length) {
                const currentPageIndex = this.getPageIndex();
                // TODO: 調整
                if (_Utils.abs(pos - this._lastActivePageContext.pos) < this._settings.scrollRefreshDistance) {
                    if (this._lastActivePageContext.index !== currentPageIndex) {
                        this.refresh();
                    }
                }
                this._lastActivePageContext.pos = pos;
            }
        }

        /**
         * スクロール停止イベント
         *
         * @param pos {Number} [in] スクロールポジション
         */
        private onScrollStop(pos: number): void {
            if (this._active && 0 < this._pages.length) {
                const currentPageIndex = this.getPageIndex();
                if (this._lastActivePageContext.index !== currentPageIndex) {
                    this.refresh();
                }
                this._lastActivePageContext.pos = pos;
            }
        }

        //! 最後のページを取得
        private getLastPage(): PageProfile {
            if (0 < this._pages.length) {
                return this._pages[this._pages.length - 1];
            } else {
                return null;
            }
        }

        /**
         * ページ区分のアサイン
         *
         * @param from {Number} [in] page index を指定
         */
        private assignPage(from?: number): void {
            let i: number, n: number;
            if (null == from) {
                from = 0;
            } else {
                this.clearPage(from);
            }

            (() => {
                let lineIndex = 0;
                let lastPage = this.getLastPage();
                let lastLine: LineProfile;
                let tempPage: PageProfile;
                if (null == lastPage) {
                    lastPage = new PageProfile();
                    this._pages.push(lastPage);
                } else {
                    lastLine = lastPage.getLineProfileLast();
                    if (null != lastLine) {
                        lineIndex = lastLine.index + 1;
                    }
                }

                const asignee = this._lines.slice(lineIndex);
                for (i = 0, n = asignee.length; i < n; i++) {
                    if (this._baseHeight <= lastPage.height) {
                        lastPage.normalize();
                        tempPage = lastPage;
                        tempPage = new PageProfile();
                        tempPage.index = lastPage.index + 1;
                        tempPage.offset = lastPage.offset + lastPage.height;
                        lastPage = tempPage;
                        this._pages.push(lastPage);
                    }
                    asignee[i].pageIndex = lastPage.index;
                    lastPage.push(asignee[i]);
                }
                lastPage.normalize();
            })();

            if (this._scroller) {
                this._scroller.update();
            }
        }

        /**
         * ページ区分の解除
         *
         * @param from {Number} [in] page index を指定
         */
        private clearPage(from?: number): void {
            if (null == from) {
                from = 0;
            }
            this._pages = this._pages.slice(0, from);
        }
    }
}
