// for non iscroll user. cdp.ui.listview.d.ts internal definition.
interface IScrollOptions {
    [x: string]: any;
    probeType?: number; // [calm :1 < 2 < 3: aggressive]
}

namespace CDP.UI {

    import _Config  = CDP.UI.ListViewGlobalConfig;
    import _Utils   = CDP.UI._ListViewUtils;

    const TAG = "[CDP.UI.ScrollerIScroll] ";

    interface IScrollEx extends IScroll {
        on: (type: string, fn: (event: any) => void) => void;
        off: (type: string, fn: (event: any) => void) => void;
        wrapper: HTMLElement;
        scroller: HTMLElement;
        scrollerWidth: number;
        scrollerHeight: number;
        maxScrollX: number;
        maxScrollY: number;
        getComputedPosition(): any;
    }

    /**
     * @class ScrollerIScroll
     * @brief iScroll を使用した Scroller クラス
     */
    export class ScrollerIScroll implements IScroller {
        private _$owner: JQuery = null;
        private _iscroll: IScrollEx = null;
        private _refreshTimerId: number = null;
        private _$wrapper: JQuery = null;
        private _$scroller: JQuery = null;
        private _listviewOptions: ListViewOptions = null;

        //! constructor
        constructor($owner: JQuery, element: string, iscrollOptions: IScrollOptions, listviewOptions: ListViewOptions);
        constructor($owner: JQuery, element: HTMLElement, iscrollOptions: IScrollOptions, listviewOptions: ListViewOptions);
        constructor($owner: JQuery, element: any, iscrollOptions: IScrollOptions, listviewOptions: ListViewOptions) {
            if (null != global.IScroll) {
                this._$owner = $owner;
                this._iscroll = <IScrollEx>new IScroll(element, iscrollOptions);
                this._$wrapper = $(this._iscroll.wrapper);
                this._$scroller = $(this._iscroll.scroller);
                this._listviewOptions = listviewOptions;
            } else {
                console.error(TAG + "iscroll module doesn't load.");
            }
        }

        //! Scroller の型を取得
        getType(): string {
            return ScrollerIScroll.TYPE;
        }

        //! position 取得
        getPos(): number {
            let pos = this._iscroll.getComputedPosition().y;
            if (_.isNaN(pos)) {
                pos = 0;
            } else {
                pos = -pos;
            }
            return pos;
        }

        //! position の最大値を取得
        getPosMax(): number {
            return _Utils.max(-this._iscroll.maxScrollY, 0);
        }

        //! イベント登録
        on(type: string, func: (event: JQuery.Event) => void): void {
            switch (type) {
                case "scroll":
                    this._iscroll.on("scroll", func);
                    break;
                case "scrollstop":
                    this._iscroll.on("scrollEnd", func);
                    break;
                default:
                    console.warn(TAG + "unsupported type: " + type);
                    break;
            }
        }

        //! イベント登録解除
        off(type: string, func: (event: JQuery.Event) => void): void {
            switch (type) {
                case "scroll":
                    this._iscroll.off("scroll", func);
                    break;
                case "scrollstop":
                    this._iscroll.on("scrollEnd", func);
                    break;
                default:
                    console.warn(TAG + "unsupported type: " + type);
                    break;
            }
        }

        //! スクロール位置を指定
        scrollTo(pos: number, animate?: boolean, time?: number): void {
            time = 0;
            if (this._listviewOptions.enableAnimation && animate) {
                time = time || this._listviewOptions.animationDuration;
            }
            this._iscroll.scrollTo(0, -pos, time);
        }

        //! Scroller の状態更新
        update(): void {
            if (this._$owner) {
                // update wrapper
                (() => {
                    const ownerHeight = this._$owner.height();
                    if (ownerHeight !== this._$wrapper.height()) {
                        this._$wrapper.height(ownerHeight);
                    }
                })();

                if (null != this._refreshTimerId) {
                    clearTimeout(this._refreshTimerId);
                }

                const proc = () => {
                    if (this._$scroller && this._$scroller.height() !== this._iscroll.scrollerHeight) {
                        this._iscroll.refresh();
                        this._refreshTimerId = setTimeout(proc, this._listviewOptions.scrollMapRefreshInterval);
                    } else {
                        this._refreshTimerId = null;
                    }
                };

                this._iscroll.refresh();
                this._refreshTimerId = setTimeout(proc, this._listviewOptions.scrollMapRefreshInterval);
            }
        }

        //! Scroller の破棄
        destroy(): void {
            this._$scroller = null;
            this._$wrapper = null;
            this._iscroll.destroy();
            this._$owner = null;
        }

        //! タイプ定義
        public static get TYPE(): string {
            return "iscroll";
        }

        //! factory 取得
        public static getFactory(options?: IScrollOptions): (element: any, options: ListViewOptions) => IScroller {
            const defaultOpt = {
                scrollX: false,
                bounce: false,
                tap: true,
                click: true,
                mouseWheel: true,
                scrollbars: true,
                interactiveScrollbars: true,
                shrinkScrollbars: "scale",
                fadeScrollbars: true,
                preventDefault: false,
                disablePointer: true,
                disableMouse: false,
                disableTouch: false,
                probeType: 2,
//               eventPassthrough: true,
            };

            const iscrollOptions = $.extend({}, defaultOpt, options);

            const factory = (element: any, listviewOptions: ListViewOptions): IScroller => {
                const $owner = $(element);
                const $map = $owner.find(_Config.SCROLL_MAP_SELECTOR);
                const $wrapper = $("<div class='" + _Config.WRAPPER_CLASS + "'></div>")
                    .css({
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                    });
                $map.wrap($wrapper);
                return new ScrollerIScroll($owner, _Config.WRAPPER_SELECTOR, iscrollOptions, listviewOptions);
            };
            // set type signature.
            (<any>factory).type = ScrollerIScroll.TYPE;

            return factory;
        }
    }
}
