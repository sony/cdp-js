namespace CDP.NativeBridge {

    import IPromise     = CDP.IPromise;
    import IPromiseBase = CDP.IPromiseBase;

    const TAG: string = "[CDP.NativeBridge.Gate] ";

    // Plugin raw Result code

    export let SUCCESS_OK: number;              Utils.defineResultCode("SUCCESS_OK");
    export let SUCCESS_PROGRESS: number;        Utils.defineResultCode("SUCCESS_PROGRESS");
    export let ERROR_FAIL: number;              Utils.defineResultCode("ERROR_FAIL");
    export let ERROR_CANCEL: number;            Utils.defineResultCode("ERROR_CANCEL");
    export let ERROR_INVALID_ARG: number;       Utils.defineResultCode("ERROR_INVALID_ARG");
    export let ERROR_NOT_IMPLEMENT: number;     Utils.defineResultCode("ERROR_NOT_IMPLEMENT");
    export let ERROR_NOT_SUPPORT: number;       Utils.defineResultCode("ERROR_NOT_SUPPORT");
    export let ERROR_INVALID_OPERATION: number; Utils.defineResultCode("ERROR_INVALID_OPERATION");
    export let ERROR_CLASS_NOT_FOUND: number;   Utils.defineResultCode("ERROR_CLASS_NOT_FOUND");
    export let ERROR_METHOD_NOT_FOUND: number;  Utils.defineResultCode("ERROR_METHOD_NOT_FOUND");


    function convertErrorInfo(result: IResult | CDP.Plugin.NativeBridge.IResult): ErrorInfo {
        let resultCode: number;
        switch (result.code) {
            case ERROR_CANCEL:
                break;
            case ERROR_INVALID_ARG:
                resultCode = RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_INVALID_ARG;
                break;
            case ERROR_NOT_IMPLEMENT:
                resultCode = RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_NOT_IMPLEMENT;
                break;
            case ERROR_NOT_SUPPORT:
                resultCode = RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_NOT_SUPPORT;
                break;
            case ERROR_INVALID_OPERATION:
                resultCode = RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_INVALID_OPERATION;
                break;
            case ERROR_CLASS_NOT_FOUND:
                resultCode = RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_CLASS_NOT_FOUND;
                break;
            case ERROR_METHOD_NOT_FOUND:
                resultCode = RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_METHOD_NOT_FOUND;
                break;
            case ERROR_FAIL:
            default:
                resultCode = RESULT_CODE.FAILED;
                break;
        }
        if (ERROR_CANCEL === result.code) {
            return makeCanceledErrorInfo(TAG, <IResult>result);
        } else {
            return makeErrorInfo(resultCode, TAG, null, <IResult>result);
        }
    }

    //___________________________________________________________________________________________________________________//

    /**
     * \~english
     * @class Gate
     * @brief The base class for NativeBridge communication.
     *        You can derive any Gate class from this class.
     *
     * \~japanese
     * @class Gate
     * @brief NativeBridge と通信するベースクラス
     *        このクラスから任意の Gate クラスを派生して実装可能
     */
    export class Gate {

        private _bridge: Plugin.NativeBridge;
        private _options: ConstructOptions;

        /* tslint:disable:no-unused-variable */
        // For pure javascript extend helper.
        private static extend = Utils.extend;
        /* tslint:enable:no-unused-variable */

        /**
         * \~english
         * constructor
         *
         * @param feature [in] feature information.
         * @param options [in] construction options.
         *
         * \~japanese
         * constructor
         *
         * @param feature [in] 初期化情報を指定
         * @param options [in] オプションを指定
         */
        constructor(feature: Feature, options?: ConstructOptions) {
            this._options = $.extend({
                useRawPluginResult: false,
            }, options);
            Utils.waitForPluginReady()
                .done(() => {
                    this._bridge = new Plugin.NativeBridge(feature, options);
                })
                .catch((reason) => {
                    throw Error(reason);
                });
        }

        ///////////////////////////////////////////////////////////////////////
        // override methods

        /**
         * \~english
         * Execute task.
         * the function calls the Native class method from correspondent method name.
         *
         * @param method  [in] method name of Native class
         * @param args    [in] set arguments by array type.
         * @param options [in] set exec options.
         * @returns Promise object.
         *
         * \~japanese
         * タスクの実行
         * 指定した method 名に対応する Native Class の method を呼び出す。
         *
         * @param method  [in] Native Class のメソッド名を指定
         * @param args    [in] 引数を配列で指定
         * @param options [in] 実行オプションを指定
         * @returns Promise オブジェクト
         */
        public exec(method: string, args?: any[], options?: ExecOptions): IPromise<any> {
            const df = $.Deferred();
            const opt = $.extend({}, this._options, options);
            const promise = Utils.makePromise(df, opt.useRawPluginResult);

            Utils.waitForPluginReady()
                .done(() => {
                    const taskId = this._bridge.exec(
                        (result: IResult) => {
                            if (SUCCESS_PROGRESS === result.code) {
                                if (!opt.useRawPluginResult && null != result.params) {
                                    df.notify(...[...result.params, result]);
                                } else {
                                    df.notify(result);
                                }
                            } else {
                                if (!opt.useRawPluginResult && null != result.params) {
                                    df.resolve(...[...result.params, result]);
                                } else {
                                    df.resolve(result);
                                }
                            }
                        },
                        (error: IResult) => {
                            if (opt.useRawPluginResult) {
                                df.reject(error);
                            } else {
                                df.reject(convertErrorInfo(error));
                            }
                        },
                        method, args, options
                    );

                    // set internal properties.
                    (<any>promise)._bridge = this._bridge;
                    (<any>promise)._taskId = taskId;
                })
                .catch((reason) => {
                    df.reject(reason);
                });

            return promise;
        }

        /**
         * \~english
         * Cancel all tasks.
         *
         * @param options [in] set execute options.
         * @returns Promise object.
         *
         * \~japanese
         * すべてのタスクのキャンセル
         *
         * @param options [in] 実行オプションを指定
         * @returns Promise オブジェクト
         */
        public cancel(options?: ExecOptions): IPromiseBase<IResult> {
            const df = $.Deferred();
            const opt = $.extend({}, this._options, options);

            Utils.waitForPluginReady()
                .done(() => {
                    this._bridge.cancel(null, opt,
                        (result) => {
                            df.resolve(result);
                        },
                        (error) => {
                            if (opt.useRawPluginResult) {
                                df.reject(error);
                            } else {
                                df.reject(convertErrorInfo(error));
                            }
                        }
                    );
                })
                .catch((reason) => {
                    df.reject(reason);
                });
            return df.promise();
        }

        /**
         * \~english
         * Destruction for the instance.
         * release Native class reference. after that, exec() becomes invalid.
         *
         * @param options [in] set execute options.
         * @returns Promise object.
         *
         * \~japanese
         * インスタンスの破棄
         * Native の参照を解除する。以降、exec は無効となる。
         *
         * @param options [in] 実行オプションを指定
         * @returns Promise オブジェクト
         */
        public dispose(options?: ExecOptions): IPromiseBase<IResult> {
            const df = $.Deferred();
            const opt = $.extend({}, this._options, options);

            Utils.waitForPluginReady()
                .done(() => {
                    this._bridge.dispose(opt,
                        (result) => {
                            df.resolve(result);
                        },
                        (error) => {
                            if (opt.useRawPluginResult) {
                                df.reject(error);
                            } else {
                                df.reject(convertErrorInfo(error));
                            }
                        }
                    );
                })
                .catch((reason) => {
                    df.reject(reason);
                });
            return df.promise();
        }

        ///////////////////////////////////////////////////////////////////////
        // protected methods

        /**
         * \~english
         * Access to Plugin.NativeBridge object.
         * If you want to use low level exec(), you can use this accessor.
         *
         * @returns Plugin.NativeBridge instance.
         *
         * \~japanese
         * Plugin.NativeBridge オブジェクトへのアクセス
         * 低レベル exec() を使用したい場合に利用可能
         *
         * @returns Plugin.NativeBridge インスタンス.
         */
        protected get bridge(): Plugin.NativeBridge {
            return this._bridge;
        }
    }
}
