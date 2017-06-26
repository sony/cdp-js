/// <reference path="../../@types/jquery.mobile.d.ts" />
/// <reference path="Patch.ts" />
/// <reference path="Orientation.ts" />
/// <reference path="Router.ts" />

/* tslint:disable:max-line-length forin no-bitwise */

namespace CDP {

    import Promise = CDP.Promise;

    /**
     * \~english
     * The function returned Promise waits until PhoneGap is ready.
     * [Note] emulate when PC enviroment.
     *
     * \~japanese
     * PhoneGap が有効になるまで待機
     * PC 環境ではエミュレートされる。
     */
    export function waitForDeviceReady(): Promise<void> {
        return new Promise((resolve) => {
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

    let _defaultBackButtonHandler: (event?: JQueryEventObject) => void = null;

    /**
     * \~english
     * Setup H/W Back key handler.
     *
     * @param  {Function} handler function.
     * @return {Function} old handler function.
     *
     * \~japanese
     *
     * @param  {Function} handler 指定.
     * @return {Function} 以前の handler.
     */
    export function setBackButtonHandler(handler: (event?: JQueryEventObject) => void): (event?: JQueryEventObject) => void {
        const oldHandler = _defaultBackButtonHandler;
        _defaultBackButtonHandler = handler;
        return oldHandler;
    }

    // back key handler implement.
    (() => {
        waitForDeviceReady()
            .then(() => {
                $(document).on("backbutton", (event: JQueryEventObject) => {
                    if (_defaultBackButtonHandler) {
                        _defaultBackButtonHandler(event);
                    }
                });
            });
    })();


    //___________________________________________________________________________________________________________________//


    export namespace Framework {

        /**
         * @interface FrameworkOptions
         * @brief Framework に設定可能なオプション
         */
        export interface FrameworkOptions {
            jquery?: () => void;
            jquerymobile?: () => void;
            i18n?: CDP.I18NSettings;
            applyPatch?: boolean;
            anchorVclick?: boolean;
        }

        interface OrientationListenerHolder {
            [key: string]: IOrientationChangedListener;
        }

        const TAG = "[CDP.Framework] ";

        let _dfInitialize: JQueryDeferred<void> = $.Deferred<void>();
        let _activePage: IPage = null;
        let _lastOrientation: Orientation = null;
        const _orientationListenerHolder: OrientationListenerHolder = {};

        /**
         * \~english
         * Initialization function of Framework.
         *
         * \~japanese
         * Framework の初期化関数
         *
         * @param options {FrameworkOptions} [in] options object.
         */
        export function initialize(options?: FrameworkOptions): IPromiseBase<void> {
            if ("pending" !== _dfInitialize.state()) {
                return <any>_dfInitialize.promise();
            }

            const config = getConfig(options);

            // CDP 環境の初期化
            // 現状は、console オブジェクトの保証と jQuery の WinRT 対応。
            CDP.initialize({
                success: () => {
                    // Framework 用の Patch 適用
                    if (config.applyPatch) {
                        Framework.Patch.apply();
                    }

                    // jQuery の共通設定
                    config.jquery();

                    // jQuery Mobile の初期化
                    $(document).on("mobileinit", (): void => {
                        // config の反映
                        config.jquerymobile();

                        // cdp.i18n の初期化
                        CDP.initializeI18N(config.i18n)
                            .always((info) => {
                                // i18next の初期化時のエラーは無視する. info が array の場合、エラー情報が格納されている.
                                $(document)
                                    .one("pagebeforechange", (event: JQueryEventObject, data: any) => {
                                        (<ChangePageOptions>data.options).showLoadMsg = false;
                                    })
                                    .on("pagebeforecreate", (event: JQueryEventObject) => {
                                        // i18nextライブラリによるhtml fragmentの翻訳処理
                                        (<any>$(event.target)).localize();
                                    })
                                ;

                                // Router の初期化
                                if (Router.initialize({ anchorVclick: config.anchorVclick, })) {
                                    _dfInitialize.resolve();
                                } else {
                                    console.error(TAG + "error. CDP.Framework.Router.initialize() failed.");
                                    _dfInitialize.reject();
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
                fail: (error) => {
                    console.error(TAG + "error. CDP.initialize() failed.");
                    _dfInitialize.reject();
                    _dfInitialize = $.Deferred<void>();
                },
            });

            return <any>_dfInitialize.promise();
        }

        /**
         * \~english
         * Check for initialization status.
         *
         * @return {Boolean} true: initialized / false: uninitialized
         *
         * \~japanese
         * 初期化済みか判定
         *
         * @return {Boolean} true: 初期化済み / false: 未初期化
         */
        export function isInitialized(): boolean {
            return "resolved" === _dfInitialize.state();
        }

        /**
         * \~english
         * Wait for initialization status.
         *
         * @return {IPromiseBase<void>}
         *
         * \~japanese
         * 初期化待ち
         *
         * @return {IPromiseBase<void>}
         */
        export function waitForInitialize(): IPromiseBase<void> {
            return <any>_dfInitialize.promise();
        }

        /**
         * \~english
         * Register IOrientationChangedListener to framework.
         *
         * @param key      {String}                      [in] ID key
         * @param listener {IOrientationChangedListener} [in] IOrientationChangedListener instance
         *
         * \~japanese
         * IOrientationChangedListener を Framework に登録
         *
         * @param key      {String}                      [in] ID key
         * @param listener {IOrientationChangedListener} [in] IOrientationChangedListener instance
         */
        export function registerOrientationChangedListener(key: string, listener: IOrientationChangedListener): void {
            _orientationListenerHolder[key] = listener;
        }

        /**
         * \~english
         * Unregister IOrientationChangedListener from framework.
         *
         * @param key {String} [in] ID key
         *
         * \~japanese
         * IOrientationChangedListener を Framework から登録解除
         *
         * @param key {String} [in] ID key
         */
        export function unregisterOrientationChangedListener(key: string): void {
            delete _orientationListenerHolder[key];
        }

        /**
         * \~english
         * Setup event handlers when after router initialized.
         *
         * @private
         *
         * \~japanese
         * イベントハンドラの設定. Router 初期化後に Framework がコールする.
         *
         * @private
         */
        export function setupEventHandlers(): void {
            (() => {
                const oldBackButtonHandler = CDP.setBackButtonHandler(null);
                const baseBackButtonHandler = (event?: JQueryEventObject): void => {
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

        /**
         * \~english
         * Setup active IPage instance.
         *
         * @private
         * @param page {IPage} [in] IPage instance.
         *
         * \~japanese
         * active Page の設定. Framework がコールする.
         *
         * @private
         * @param page {IPage} [in] IPage instance.
         */
        export function setActivePage(page: IPage): void {
            _activePage = page;
            if (_activePage) {
                _lastOrientation = getOrientation();
            }
        }

        /**
         * \~english
         * Reterns framework default click event string.
         *
         * @private
         *
         * \~japanese
         * Framework が既定に使用するクリックイベント文字列を取得
         *
         * @private
         * @return {String} "vclick" / "click"
         */
        export function getDefaultClickEvent(): string {
            return Patch.s_vclickEvent;
        }

        /**
         * \~english
         * Get Config object.
         *
         * @private
         * @return {FrameworkOptions} Config object.
         *
         * \~japanese
         * Config object の取得
         *
         * @private
         * @return {FrameworkOptions} Config object.
         */
        function getConfig(options: FrameworkOptions): FrameworkOptions {
            const defConfig = {
                // for fail safe, default settings.
                jquery: (): void => {
                    $.support.cors = true;
                    $.ajaxSetup({ cache: false });
                    $.migrateMute = true;
                },

                jquerymobile: (): void => {
                    $.mobile.allowCrossDomainPages = true;
                    $.mobile.defaultPageTransition = "none";
                    $.mobile.hashListeningEnabled = false;
                    $.mobile.pushStateEnabled = false;
                },

                i18n: {
                },

                applyPatch: true,
                anchorVclick: true,
            };

            return $.extend({}, defConfig, CDP.Config, options);
        }

        ///////////////////////////////////////////////////////////////////////
        // closure methods

        // resize handler
        $(window).on("resize", (event: JQueryEventObject): void => {
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
