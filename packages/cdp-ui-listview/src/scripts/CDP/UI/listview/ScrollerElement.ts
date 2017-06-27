namespace CDP.UI {

    import _Utils = CDP.UI._ListViewUtils;

    const TAG = "[CDP.UI.ScrollerElement] ";

    /**
     * @class ScrollerElement
     * @brief HTMLElement の Scroller クラス
     */
    export class ScrollerElement implements IScroller {
        private _$target: JQuery = null;
        private _$scrollMap: JQuery = null;
        private _listviewOptions: ListViewOptions = null;

        //! constructor
        constructor(element: string, options: ListViewOptions);
        constructor(element: HTMLElement, options: ListViewOptions);
        constructor(element: any, options: ListViewOptions) {
            this._$target = $(element);
            this._listviewOptions = options;
        }

        //! Scroller の型を取得
        getType(): string {
            return ScrollerElement.TYPE;
        }

        //! position 取得
        getPos(): number {
            return this._$target.scrollTop();
        }

        //! position の最大値を取得
        getPosMax(): number {
            if (null == this._$scrollMap) {
                this._$scrollMap = this._$target.children().first();
            }
            return _Utils.max(this._$scrollMap.height() - this._$target.height(), 0);
        }

        //! イベント登録
        on(type: string, func: (event: JQuery.Event) => void): void {
            switch (type) {
                case "scroll":
                    this._$target.on("scroll", func);
                    break;
                case "scrollstop":
                    this._$target.on("scrollstop", func);
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
                    this._$target.off("scroll", func);
                    break;
                case "scrollstop":
                    this._$target.off("scrollstop", func);
                    break;
                default:
                    console.warn(TAG + "unsupported type: " + type);
                    break;
            }
        }

        //! スクロール位置を指定
        scrollTo(pos: number, animate?: boolean, time?: number): void {
            if (!this._listviewOptions.enableAnimation || !animate) {
                this._$target.scrollTop(pos);
            } else {
                if (null == time) {
                    time = this._listviewOptions.animationDuration;
                }
                this._$target.animate({
                    scrollTop: pos
                }, time);
            }
        }

        //! Scroller の状態更新
        update(): void {
            // noop.
        }

        //! Scroller の破棄
        destroy(): void {
            this._$scrollMap = null;
            if (this._$target) {
                this._$target.off();
                this._$target = null;
            }
        }

        //! タイプ定義
        public static get TYPE(): string {
            return "element-overflow";
        }

        //! factory 取得
        public static getFactory(): (element: any, options: ListViewOptions) => IScroller {
            const factory = (element: any, options: ListViewOptions): IScroller => {
                return new ScrollerElement(element, options);
            };
            // set type signature.
            (<any>factory).type = ScrollerElement.TYPE;
            return factory;
        }
    }
}
