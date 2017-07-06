namespace CDP.UI {

    import Promise      = CDP.Promise;
    import Framework    = CDP.Framework;

    const TAG = "[CDP.UI.Dialog] ";

    /**
     * H/W Back Key Hook 関数
     */
    export type DialogBackKeyHandler = (event?: JQuery.Event) => void;

    /**
     * @interface DialogOptions
     *            ダイアログオプションインターフェイス
     */
    export interface DialogOptions extends PopupOptions {
        src?: string;                   //!< {String} template ファイルのパス                                 default: undefined
        title?: string;                 //!< {String} ダイアログタイトル                                      default: undefined
        message?: string;               //!< {String} メインメッセージ                                        default: undefined
        idPositive?: string;            //!< {String} Positive ボタンのID                                     default: "dlg-btn-positive"
        idNegative?: string;            //!< {String} Nagative ボタンのID                                     default: "dlg-btn-negative"
        event?: string;                 //!< {String} Dialog クラスが管理するイベント                         default: "vclick"
        defaultAutoClose?: boolean;     //!< {Boolean} data-auto-close が指定されていない場合の既定値         default: false
        forceOverwriteAfterClose?: boolean; //!< {Boolean} afterclose オプションを強制上書きするための設定    default: false
        labelPositive?: string;         //!< {String} Positive ボタンラベル                                   default: "OK"
        labelNegative?: string;         //!< {String} Negative ボタンラベル                                   default: "Cancel"
        backKey?: "close" | "deny" | DialogBackKeyHandler;  //!< H/W backKey の振る舞い                       default: "close"
        scrollEvent?: "deny" | "allow" | "adjust";   //!< {String} scrollの抑止方式  (※ adjust は試験的)     default: "deny"
        domExtensionOptions?: DomExtensionOptions;   //!< DOM拡張オプション. null|undefined で拡張しない      default: {}
        [x: string]: any;               //!< any dialog template parameters.
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @class Dialog
     * @brief 汎用ダイアログクラス
     *        jQM の popup widget によって実装
     */
    export class Dialog {

        private _template: Tools.JST = null;
        private _settings: DialogOptions = null;
        private _$dialog: JQuery = null;

        private static s_activeDialog: Dialog = null;
        private static s_oldBackKeyHandler: (event?: JQuery.Event) => void = null;
        private static s_defaultOptions: DialogOptions = null;

        /**
         * constructor
         *
         * @param id      {String}        [in] ダイアログ DOM ID を指定 ex) #dialog-hoge
         * @param options {DialogOptions} [in] オプション
         */
        constructor(id: string, options?: DialogOptions) {
            // Dialog 共通設定の初期化
            Dialog.initCommonCondition();
            // 設定を更新
            this._settings = $.extend({}, Dialog.s_defaultOptions, options);
            // ダイアログテンプレートを作成
            this._template = Tools.Template.getJST(id, this._settings.src);
        }

        ///////////////////////////////////////////////////////////////////////
        // public methods

        /**
         * 表示
         * 表示をして始めて DOM が有効になる。
         *
         * @param options {DialogOptions} [in] オプション (src は無視される)
         * @return ダイアログの jQuery オブジェクト
         */
        public show(options?: DialogOptions): JQuery {
            const $document = $(document);
            const $body = $("body");
            const $page = (<any>$body).pagecontainer("getActivePage");

            const ofcHidden = {
                "overflow":     "hidden",
                "overflow-x":   "hidden",
                "overflow-y":   "hidden",
            };
            const ofcBody = { // body overflow context
                "overflow":     $body.css("overflow"),
                "overflow-x":   $body.css("overflow-x"),
                "overflow-y":   $body.css("overflow-y"),
            };
            const parentScrollPos = $body.scrollTop();
            const ofcPage = { // page overflow context
                "overflow":     $page.css("overflow"),
                "overflow-x":   $page.css("overflow-x"),
                "overflow-y":   $page.css("overflow-y"),
            };

            const scrollEvent = "scroll touchmove mousemove MSPointerMove";

            const scrollHander = (event: JQuery.Event) => {
                if ("deny" === this._settings.scrollEvent) {
                    event.preventDefault();
                } else if ("adjust" === this._settings.scrollEvent) {
                    $body.scrollTop(parentScrollPos);
                }
            };

            // option が指定されていた場合更新
            if (null != options) {
                this._settings = $.extend({}, this._settings, options);
            }

            // afterclose 処理は Dialog の破棄処理を実装するため基本的に設定禁止 (強制上書きモードを設定使用可)
            if (this._settings.afterclose && !this._settings.forceOverwriteAfterClose) {
                console.warn(TAG + "cannot accept 'afterclose' option. please instead using 'popupafterclose' event.");
                delete this._settings.afterclose;
            }

            // title の有無
            (<any>this._settings)._titleState = this._settings.title ? "ui-has-title" : "ui-no-title";

            /*
             * template から jQuery オブジェクトを作成し、
             * <body> 直下に追加.
             * $page では Backbone event を受けられないことに注意
             */
            this._$dialog = $(this._template(this._settings));
            this._$dialog.localize();
            $body.append(this._$dialog);

            // theme を解決
            this.resolveTheme();

            this._$dialog
                .on("popupcreate", (event: JQuery.Event) => {
                    // スクロールを抑止
                    if ("allow" !== this._settings.scrollEvent) {
                        $document.on(scrollEvent, scrollHander);
                    }
                    $body.css(ofcHidden);
                    $page.css(ofcHidden);
                    Dialog.register(this);
                })
                .enhanceWithin();

            // DOM 拡張
            if (null != this._settings.domExtensionOptions) {
                ExtensionManager.applyDomExtension(this._$dialog, this._settings.domExtensionOptions);
            }

            this.onBeforeShow()
                .done(() => {
                    // 表示
                    this._$dialog
                        .popup($.extend({}, {
                            positionTo: "window",
                            afterclose: (event: JQuery.Event, ui: any) => {
                                // スクロール状態を戻す
                                $page.css(ofcPage);
                                $body.css(ofcBody);
                                if ("allow" !== this._settings.scrollEvent) {
                                    $document.off(scrollEvent, scrollHander);
                                }
                                Dialog.register(null);
                                this._$dialog.remove();
                                this._$dialog = null;
                            },
                        }, this._settings))
                        .popup("open").on(this._settings.event, (event: JQuery.Event) => {
                            // "data-auto-close='false'" が指定されている要素は dialog を閉じない
                            let autoClose = $(event.target).attr("data-auto-close");
                            if (null == autoClose) {
                                autoClose = this._settings.defaultAutoClose ? "true" : "false";
                            }
                            if ("false" === autoClose) {
                                return;
                            }
                            this.close();
                            event.preventDefault();
                        });

                })
                .fail((error) => {
                    console.error(TAG + "Dialog.show() failed.");
                    if (this._$dialog) {
                        this._$dialog.trigger("error", error);
                    }
                });

            return this._$dialog;
        }

        /**
         * 終了
         * 基本的には自動で閉じるが、
         * 表示中のダイアログをクライアント側から閉じるメソッド
         */
        public close(): void {
            if (this._$dialog) {
                this._$dialog.popup("close");
            }
        }

        //! ダイアログ element を取得
        public get $el(): JQuery {
            return this._$dialog;
        }

        ///////////////////////////////////////////////////////////////////////
        // protected methods: Override

        /**
         * ダイアログ表示の直前
         * DOM を操作できるタイミングで呼び出される.
         *
         * @return {IPromiseBase} promise オブジェクト
         */
        protected onBeforeShow(): IPromiseBase<void> {
            return Promise.resolve<void>();
        }

        /**
         * ダイアログの使用する Theme を解決
         * 不要な場合はオーバーライドすることも可能
         */
        protected resolveTheme(): void {
            const queryTheme = (): string => {
                return $(".ui-page-active").jqmData("theme");
            };

            let candidateTheme: string;

            if (!this._settings.theme) {
                const domTheme = this._$dialog.jqmData("theme");
                if (!domTheme) {
                    this._settings.theme = candidateTheme = queryTheme();
                }

            }
            if (!this._settings.overlayTheme) {
                const domOverlayTheme = this._$dialog.jqmData("overlay-theme");
                if (!domOverlayTheme) {
                    this._settings.overlayTheme = candidateTheme || queryTheme();
                }
            }

            // transition の更新
            this._settings.transition = Theme.queryDialogTransition(this._settings.transition);
        }

        ///////////////////////////////////////////////////////////////////////
        // public static methods

        /**
         * Dialog の既定オプションを更新
         * すぺての Dialog が使用する共通設定
         *
         * @param options {DialogOptions} [in] ダイアログオプション
         */
        public static setDefaultOptions(options: DialogOptions): void {
            // Dialog 共通設定の初期化
            Dialog.initCommonCondition();
            $.extend(true, Dialog.s_defaultOptions, options);
        }

        ///////////////////////////////////////////////////////////////////////
        // private methods

        //! 現在 active なダイアログとして登録する
        private static register(dialog: Dialog): void {
            if (null != dialog && null != Dialog.s_activeDialog) {
                console.warn(TAG + "new dialog proc is called in the past dialog's one. use setTimeout() for post process.");
            }
            Dialog.s_activeDialog = dialog;
        }

        /**
         * Dialog 共通設定の初期化
         */
        private static initCommonCondition(): void {
            // Framework の初期化後に処理する必要がある
            if (!Framework.isInitialized()) {
                console.warn(TAG + "initCommonCondition() should be called after Framework.initialized.");
                return;
            }

            if (null == Dialog.s_oldBackKeyHandler) {
                // Back Button Handler
                Dialog.s_oldBackKeyHandler = CDP.setBackButtonHandler(null);
                CDP.setBackButtonHandler(Dialog.customBackKeyHandler);

                // 既定オプション
                Dialog.s_defaultOptions = {
                    idPositive:             "dlg-btn-positive",
                    idNegative:             "dlg-btn-negative",
                    event:                  Framework.getDefaultClickEvent(),
                    dismissible:            false,
                    defaultAutoClose:       false,
                    transition:             "platform-default",
                    labelPositive:          "OK",
                    labelNegative:          "Cancel",
                    backKey:                "close",
                    scrollEvent:            "deny",
                    domExtensionOptions:    {},
                };
            }
        }

        /**
         * H/W Back Button Handler
         */
        private static customBackKeyHandler(event?: JQuery.Event): void {
            if (null != Dialog.s_activeDialog) {
                if ("close" === Dialog.s_activeDialog._settings.backKey) {
                    Dialog.s_activeDialog.close();
                } else if ("function" === typeof Dialog.s_activeDialog._settings.backKey) {
                    (<DialogBackKeyHandler>Dialog.s_activeDialog._settings.backKey)(event);
                }
                return; // Dialog が active な場合、常に既定のハンドラには渡さない
            }
            Dialog.s_oldBackKeyHandler(event);
        }
    }
}
