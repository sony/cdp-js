namespace CDP.UI {

    import _Utils = CDP.UI._ListViewUtils;

    const TAG = "[CDP.UI.ScrollerNative] ";

    /**
     * @class ScrollerNative
     * @brief Browser Native の Scroller クラス
     */
    export class ScrollerNative implements IScroller {
        private _$body: JQuery = null;
        private _$target: JQuery = null;
        private _listviewOptions: ListViewOptions = null;

        //! constructor
        constructor(options: ListViewOptions) {
            this._$target = $(document);
            this._$body = $("body");
            this._listviewOptions = options;
        }

        //! Scroller の型を取得
        getType(): string {
            return ScrollerNative.TYPE;
        }

        //! position 取得
        getPos(): number {
            return this._$target.scrollTop();
        }

        //! position の最大値を取得
        getPosMax(): number {
            return _Utils.max(this._$target.height() - window.innerHeight, 0);
        }

        //! イベント登録
        on(type: string, func: (event: JQuery.Event) => void): void {
            switch (type) {
                case "scroll":
                    this._$target.on("scroll", func);
                    break;
                case "scrollstop":
                    $(window).on("scrollstop", func);
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
                    $(window).off("scrollstop", func);
                    break;
                default:
                    console.warn(TAG + "unsupported type: " + type);
                    break;
            }
        }

        //! スクロール位置を指定
        scrollTo(pos: number, animate?: boolean, time?: number): void {
            if (!this._listviewOptions.enableAnimation || !animate) {
                this._$body.scrollTop(pos);
            } else {
                if (null == time) {
                    time = this._listviewOptions.animationDuration;
                }
                this._$body.animate({
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
            this._$target = null;
        }

        //! タイプ定義
        public static get TYPE(): string {
            return "native-scroll";
        }

        //! factory 取得
        public static getFactory(): (element: any, options: ListViewOptions) => IScroller {
            const factory = (element: any, options: ListViewOptions): IScroller => {
                return new ScrollerNative(options);
            };
            // set type signature.
            (<any>factory).type = ScrollerNative.TYPE;
            return factory;
        }
    }
}
