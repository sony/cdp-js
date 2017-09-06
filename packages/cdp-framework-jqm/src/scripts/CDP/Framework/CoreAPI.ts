/// <reference path="../../@types/jquery.mobile.d.ts" />
/* tslint:disable:max-line-length forin no-bitwise */

namespace CDP {

    import Promise = CDP.Promise;

    /**
     * @en The function returned Promise waits until `cordova` is ready. <br>
     *     [Note] emulate when PC enviroment.
     *
     * @ja `cordova` が有効になるまで待機 <br>
     *     PC 環境ではエミュレートされる。
     */
    export function waitForDeviceReady(): Promise<void> {
        return new Promise<void>((resolve) => {
            if (!CDP.Framework.Platform.Mobile) {
                setTimeout(() => {
                    resolve();
                }, 100);
            } else {
                if (null == global.cordova || null == global.cordova.exec) {
                    $(document).one("deviceready", () => {
                        resolve();
                    });
                } else {
                    resolve();
                }
            }
        });
    }

    let _defaultBackButtonHandler: (event?: JQuery.Event) => void = null;

    /**
     * @en Setup H/W Back key handler.
     * @ja H/W Back key ハンドラの設定関数
     *
     * @param
     * - `en` handler function.
     * - `ja` handler 指定.
     * @returns
     * - `en` old handler function.
     * - `ja` 以前の handler.
     */
    export function setBackButtonHandler(handler: (event?: JQuery.Event) => void): (event?: JQuery.Event) => void {
        const oldHandler = _defaultBackButtonHandler;
        _defaultBackButtonHandler = handler;
        return oldHandler;
    }

    // back key handler implement.
    (() => {
        waitForDeviceReady()
            .then(() => {
                $(document).on("backbutton", (event: JQuery.Event) => {
                    if (_defaultBackButtonHandler) {
                        _defaultBackButtonHandler(event);
                    }
                });
            });
    })();


    //___________________________________________________________________________________________________________________//


    export namespace Framework {

        /**
         * @en Any parameter types interface
         * @ja 任意のパラメータ型定義
         */
        export interface PlainSettings<T = any> {
            [key: string]: T;
        }

        /**
         * @ja Setting parameters for jQuery
         * @ja jQuery に設定可能なオプション
         */
        export interface JQuerySettings extends PlainSettings {
            /**
             * @en default $.ajax settings
             * @ja $.ajax の既定設定
             */
            ajaxSetup?: JQuery.AjaxSettings;
        }

        /**
         * @en Applicable options for [[CDP.Framework]]
         * @ja [[CDP.Framework]] に設定可能なオプション
         */
        export interface FrameworkOptions {
            jquery?: JQuerySettings;
            jquerymobile?: PlainSettings;
            i18n?: CDP.I18NSettings;
            applyJQueryConfig?: () => void;
            applyJQueryMobileConfig?: () => void;
            applyPatch?: boolean;
            anchorVclick?: boolean;
            firstPageTransition?: boolean;
        }

        interface OrientationListenerHolder {
            [key: string]: IOrientationChangedListener;
        }

        const TAG = "[CDP.Framework] ";

        let _dfInitialize: JQueryDeferred<void> = $.Deferred<void>();

        /**
         * @en Initialization function of Framework.
         * @ja Framework の初期化関数
         */
        export function initialize(options?: FrameworkOptions): IPromiseBase<void> {
            if ("pending" !== _dfInitialize.state()) {
                return <any>_dfInitialize.promise();
            }

            // CDP 環境の初期化
            // 現状は、console オブジェクトの保証と jQuery の WinRT 対応。
            CDP.initialize({
                success: () => {
                    const config = getConfig(options);

                    // Framework 用の Patch 適用 (Framework 初期化前)
                    if (config.applyPatch) {
                        Framework.Patch.applyBeforeInit();
                    }

                    // config の反映: jquery
                    config.applyJQueryConfig();

                    // jQuery Mobile の初期化
                    $(document).on("mobileinit", (): void => {
                        // config の反映: jquery mobile
                        config.applyJQueryMobileConfig();

                        // cdp.i18n の初期化
                        CDP.initializeI18N(config.i18n)
                            .always((info) => {
                                // i18next の初期化時のエラーは無視する. info が array の場合、エラー情報が格納されている.
                                $(document)
                                    .one("pagebeforechange", (event: JQuery.Event, data: any) => {
                                        (<ChangePageOptions>data.options).showLoadMsg = false;
                                    })
                                    .on("pagebeforecreate", (event: JQuery.Event) => {
                                        // i18nextライブラリによるhtml fragmentの翻訳処理
                                        (<any>$(event.target)).localize();
                                    })
                                ;

                                // Router の初期化
                                if (Router._initialize({
                                    anchorVclick: config.anchorVclick,
                                    firstPageTransition: config.firstPageTransition,
                                })) {
                                    // Framework 用の Patch 適用 (Framework 初期化後)
                                    if (config.applyPatch) {
                                        Framework.Patch.applyAfterInit();
                                    }
                                    _dfInitialize.resolve();
                                } else {
                                    _dfInitialize.reject(makeErrorInfo(
                                        RESULT_CODE.ERROR_CDP_FRAMEWORK_ROUTER_INITIALIZE_FAILED,
                                        TAG,
                                        "error. CDP.Framework.Router.initialize() failed."
                                    ));
                                    _dfInitialize = $.Deferred<void>();
                                }
                            });
                    });

                    { // jQuery Mobile のロード
                        // jquery 3+
                        const jqueryMajor = ~~$.fn.jquery.split(".")[0];
                        if (3 <= jqueryMajor) {
                            if (4 <= jqueryMajor) {
                                console.warn(TAG + "jquery-migrate for 3.0.0+ in use.");
                            }
                            require(["jquery-migrate"], () => {
                                require(["jquery.mobile"]);
                            });
                        } else {
                            require(["jquery.mobile"]);
                        }
                    }
                },
                fail: (error: ErrorInfo) => {
                    _dfInitialize.reject(makeErrorInfo(
                        RESULT_CODE.ERROR_CDP_FRAMEWORK_INITIALIZE_FAILED,
                        TAG,
                        "error. CDP.initialize() failed.",
                        error
                    ));
                    _dfInitialize = $.Deferred<void>();
                },
            });

            return <any>_dfInitialize.promise();
        }

        /**
         * @en Check for initialization status.
         * @ja 初期化済みか判定
         *
         * @returns
         * - `en` true: initialized / false: uninitialized
         * - `ja` true: 初期化済み / false: 未初期化
         */
        export function isInitialized(): boolean {
            return "resolved" === _dfInitialize.state();
        }

        /**
         * @en Wait for initialization status.
         * @ja 初期化待ち
         */
        export function waitForInitialize(): IPromiseBase<void> {
            return <any>_dfInitialize.promise();
        }

        const _orientationListenerHolder: OrientationListenerHolder = {};

        /**
         * @en Register IOrientationChangedListener to framework.
         * @ja IOrientationChangedListener を Framework に登録
         *
         * @param key
         *  - `en` ID key
         *  - `ja` クライアントで管理可能な ID
         * @param listener
         *  - `en` IOrientationChangedListener instance
         *  - `ja` IOrientationChangedListener インスタンス
         */
        export function registerOrientationChangedListener(key: string, listener: IOrientationChangedListener): void {
            _orientationListenerHolder[key] = listener;
        }

        /**
         * @en Unregister IOrientationChangedListener from framework.
         * @ja IOrientationChangedListener を Framework から登録解除
         *
         * @param key
         *  - `en` ID key by using register
         *  - `ja` 登録時に使用した ID
         */
        export function unregisterOrientationChangedListener(key: string): void {
            delete _orientationListenerHolder[key];
        }

        let _activePage: IPage = null;

        /**
         * @en Setup event handlers when after router initialized.
         * @ja イベントハンドラの設定. Router 初期化後に Framework がコールする.
         *
         * @internal
         */
        export function _setupEventHandlers(): void {
            (() => {
                const oldBackButtonHandler = CDP.setBackButtonHandler(null);
                const baseBackButtonHandler = (event?: JQuery.Event): void => {
                    if (_activePage && _activePage.onHardwareBackButton(event)) {
                        // クライアント側でハンドリング済みと指定された場合、既定の処理を行わない
                        return;
                    } else {
                        oldBackButtonHandler(event);
                    }
                };
                CDP.setBackButtonHandler(baseBackButtonHandler);
            })();
            (() => {
                const oldRouteChangeHandler = CDP.Framework.setBeforeRouteChangeHandler(null);
                const baseRouteChangeHandler = (): IPromiseBase<any> => {
                    if (_activePage) {
                        return _activePage.onBeforeRouteChange();
                    } else {
                        return oldRouteChangeHandler();
                    }
                };
                CDP.Framework.setBeforeRouteChangeHandler(baseRouteChangeHandler);
            })();
        }

        let _lastOrientation: Orientation = null;

        /**
         * @en Setup active IPage instance.
         * @ja active Page の設定. Framework がコールする.
         *
         * @internal
         */
        export function _setActivePage(page: IPage): void {
            _activePage = page;
            if (_activePage) {
                _lastOrientation = getOrientation();
            }
        }

        /**
         * @en Reterns framework default click event string.
         * @ja Framework が既定に使用するクリックイベント文字列を取得
         *
         * @returns "vclick" / "click"
         */
        export function getDefaultClickEvent(): string {
            return Patch.s_vclickEvent;
        }

        let _pageConstructors: (new () => IPage)[] = [];
        let _pageInstances: IPage[] = [];

        /**
         * @en Register Concrete IPage class. <br>
         *     If constructor needs arguments, use bind() function.
         * @ja Page の登録 <br>
         *     constructor を指定する. 引数がある場合は、bind を行うこと
         *
         * @param ctor
         *  - `en` Concrete IPage class constructor
         *  - `ja` コンストラクタを指定
         */
        export function registerPage(ctor: new () => IPage): void {
            _pageConstructors.push(ctor);
        }

        /**
         * @en Page instances are generated from the reserved constructor.
         * @ja 予約されたコンストラクタからPage インスタンスを生成
         */
        export function constructPages(): void {
            _pageConstructors.forEach((ctor: any) => {
                _pageInstances.push(new ctor());
            });
            _pageConstructors = [];
        }

        /**
         * @en Release Page instance reference
         * @ja Page インスタンスの参照を破棄
         */
        export function disposePages(): void {
            _pageInstances = [];
        }

        /**
         * @en Get Config object.
         * @ja Config object の取得
         *
         * @internal
         */
        function getConfig(options: FrameworkOptions): FrameworkOptions {
            const defConfig = {
                // for fail safe, default settings.
                jquery: {
                    ajaxSetup: { cache: false },
                    migrateMute: true,
                },

                jquerymobile: {
                    allowCrossDomainPages: true,
                    defaultPageTransition: "platform-default",
                    defaultDialogTransition: "platform-default",
                    hashListeningEnabled: false,
                    pushStateEnabled: false,
                    // @see jquery.mobile.js LINE 6394
                    transitionHandler: {
                        defaultHandler: "simultaneous",
                        sequential: ["fade", "flip", "flow"],
                        simultaneous: [],
                    },
                },

                i18n: {
                    fallbackResources: {},
                    options: {},
                },

                applyPatch: true,
                anchorVclick: true,
                firstPageTransition: false,

                applyJQueryConfig: function () {
                    Object.keys(this.jquery).forEach((key) => {
                        if ("ajaxSetup" === key) {
                            $.ajaxSetup(this.jquery.ajaxSetup);
                        } else {
                            $[key] = this.jquery[key];
                        }
                    });
                },

                applyJQueryMobileConfig: function () {
                    $.mobile.loader.prototype.options.text = undefined;
                    Object.keys(this.jquerymobile).forEach((key) => {
                        if ("transitionHandler" === key) {
                            const $mobile: any = $.mobile;
                            // default handler
                            $mobile.defaultTransitionHandler
                                = $mobile.transitionHandlers[this.jquerymobile.transitionHandler.defaultHandler];
                            // simultaneous handler
                            this.jquerymobile.transitionHandler.simultaneous.forEach((transition) => {
                                $mobile.transitionHandlers[transition] = $mobile.transitionHandlers.simultaneous;
                            });
                            // sequential handler
                            this.jquerymobile.transitionHandler.sequential.forEach((transition) => {
                                $mobile.transitionHandlers[transition] = $mobile.transitionHandlers.sequential;
                            });
                        } else {
                            $.mobile[key] = this.jquerymobile[key];
                        }
                    });
                },
            };

            return $.extend(true, {}, defConfig, CDP.Config, options);
        }

        ///////////////////////////////////////////////////////////////////////
        // closure methods

        // resize handler
        $(window).on("resize", (event: JQuery.Event): void => {
            const newOrientation = getOrientation();
            if (_lastOrientation !== newOrientation) {
                for (const key in _orientationListenerHolder) {
                    _orientationListenerHolder[key].onOrientationChanged(newOrientation);
                }
                if (_activePage) {
                    _activePage.onOrientationChanged(newOrientation);
                }
                _lastOrientation = newOrientation;
            }
        });
    }
}
