namespace CDP.NativeBridge {

    import IPromise     = CDP.IPromise;
    import IPromiseBase = CDP.IPromiseBase;

    const TAG: string = "[CDP.NativeBridge.Gate] ";

    // Result code

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
            Utils.waitForPluginReady()
                .then(() => {
                    this._bridge = new Plugin.NativeBridge(feature, options);
                })
                .catch(() => {
                    throw Error(TAG + "'cordova-plugin-cdp-nativebridge' required.");
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
            const promise = Utils.makePromise(df);

            Utils.waitForPluginReady()
                .then(() => {
                    const taskId = this._bridge.exec(
                        (result: IResult) => {
                            if (SUCCESS_PROGRESS === result.code) {
                                df.notify(result);
                            } else {
                                df.resolve(result);
                            }
                        },
                        (error: IResult) => {
                            df.reject(error);
                        },
                        method, args, options
                    );

                    // set internal properties.
                    (<any>promise)._bridge = this._bridge;
                    (<any>promise)._taskId = taskId;
                })
                .catch(() => {
                    df.reject(this.makeFatal());
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
            Utils.waitForPluginReady()
                .then(() => {
                    this._bridge.cancel(null, options,
                        (result) => {
                            df.resolve(result);
                        },
                        (error) => {
                            df.reject(error);
                        }
                    );
                })
                .catch(() => {
                    df.reject(this.makeFatal());
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
            Utils.waitForPluginReady()
                .then(() => {
                    this._bridge.dispose(options,
                        (result) => {
                            df.resolve(result);
                        },
                        (error) => {
                            df.reject(error);
                        }
                    );
                })
                .catch(() => {
                    df.reject(this.makeFatal());
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

        ///////////////////////////////////////////////////////////////////////
        // private methods

        //! Make fatal error object.
        private makeFatal(): IResult {
            const msg = TAG + "fatal error. 'cordova-plugin-cdp-nativebridge' is not available.";
            console.error(msg);
            return {
                code: null,
                name: TAG + "ERROR_FATAL",
                message: msg,
            };
        }
    }
}
