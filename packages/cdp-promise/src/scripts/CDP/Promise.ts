namespace CDP {

    const TAG: string = "[CDP.Promise] ";

    /**
     * @interface IPromiseBase
     * @brief Native Promise オブジェクトの拡張インターフェイス定義
     *        キャンセルさせたくないが always() など jQuery method を提供したい場合に使用する.
     *        Native オブジェクトの拡張実装は無いため、global には定義しない.
     */
    export interface IPromiseBase<T> extends Promise<T> {
        ///////////////////////////////////////////////////////////////////////
        // Promise extends:

        then: <TResult1, TResult2 = never>(
            onfulfilled?: (
                (value?: TResult1, ...values: any[]) => TResult1 | PromiseLike<TResult1> | void
            ) | undefined | null,
            onrejected?: (
                (reason?: any, ...values: any[]) => TResult2 | PromiseLike<TResult2> | void
            ) | undefined | null
        ) => IPromiseBase<TResult1 | TResult2>;

        ///////////////////////////////////////////////////////////////////////
        // JQueryPromise stuff:

        state: () => string;
        always: (
            alwaysCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[],
            ...alwaysCallbacksN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>
        ) => IPromiseBase<T>;
        done: (
            doneCallback1?: JQueryPromiseCallback<T> | JQueryPromiseCallback<T>[],
            ...doneCallbackN: Array<JQueryPromiseCallback<T> | JQueryPromiseCallback<T>[]>
        ) => IPromiseBase<T>;
        fail: (
            failCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[],
            ...failCallbacksN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>
        ) => IPromiseBase<T>;
        progress: (
            progressCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[],
            ...progressCallbackN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>
        ) => IPromiseBase<T>;
    }

    /**
     * @interface IPromise
     * @brief キャンセル可能な Promise オブジェクトのインターフェイス定義
     */
    export interface IPromise<T> extends IPromiseBase<T> {
        //! キャンセル処理
        abort(info?: any): void;
        //! 依存する promise.
        dependency?: IPromise<any>;
        //! abort 時に自身も reject
        callReject?: boolean;
        //! 依存する promise を設定
        dependOn<U>(promise: IPromise<U> | JQueryXHR): IPromise<U>;

        ///////////////////////////////////////////////////////////////////////
        // Promise extends:

        then: <TResult1, TResult2 = never>(
            onfulfilled?: (
                (value?: TResult1, ...values: any[]) => TResult1 | PromiseLike<TResult1> | void
            ) | undefined | null,
            onrejected?: (
                (reason?: any, ...values: any[]) => TResult2 | PromiseLike<TResult2> | void
            ) | undefined | null
        ) => IPromise<TResult1 | TResult2>;

        ///////////////////////////////////////////////////////////////////////
        // JQueryPromise stuff:

        state: () => string;
        always: (
            alwaysCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[],
            ...alwaysCallbacksN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>
        ) => IPromise<T>;
        done: (
            doneCallback1?: JQueryPromiseCallback<T> | JQueryPromiseCallback<T>[],
            ...doneCallbackN: Array<JQueryPromiseCallback<T> | JQueryPromiseCallback<T>[]>
        ) => IPromise<T>;
        fail: (
            failCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[],
            ...failCallbacksN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>
        ) => IPromise<T>;
        progress: (
            progressCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[],
            ...progressCallbackN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>
        ) => IPromise<T>;
    }

    //___________________________________________________________________________________________________________________//

    /**
     * makePromise に指定可能な cancel callback の alias.
     */
    export type cancelCallback = (detail?: any) => void;

    /**
     * @interface MakePromiseOptions
     * @brief     makePromise に渡せるオプション
     */
    export interface MakePromiseOptions {
        dependency?: IPromise<any>;         //!< 依存する promise を設定
        callReject?: boolean;               //!< abort 時に自身も reject
        cancelCallback?: cancelCallback;    //!< キャンセル時に呼ばれる関数
        [key: string]: any;                 //!< 拡張パラメータ
    }

    /**
     * Cancel 可能オブジェクトの作成
     *
     * @param df       [in] jQueryDeferred instance を指定
     * @param options? [in] jQueryPromise を拡張するオブジェクト or キャンセル時に呼び出される関数を指定
     * @returns {Object} Cancelable property
     */
    function makeCancelable<T>(
        df: JQueryDeferred<T>,
        options?: MakePromiseOptions | cancelCallback
    ): { df: JQueryDeferred<T>, target: object; abort: (info?: any) => void; dependOn: (promise: any) => JQueryPromise<any> } {
        let extendOptions: MakePromiseOptions;
        let cancel: cancelCallback;

        if ("function" === typeof options) {
            cancel = <cancelCallback>options;
        } else {
            extendOptions = options;
            if (extendOptions && extendOptions.cancelCallback) {
                cancel = extendOptions.cancelCallback;
            } else {
                cancel = () => { /* noop */ };
            }
        }

        const _abort = function (info?: any): void {
            const detail = info ? info : { message: "abort" };
            cancel(detail);
            if (null != this.dependency) {
                if (this.dependency.abort) {
                    this.dependency.abort(detail);
                } else {
                    console.error(TAG + "[call] dependency object doesn't have 'abort()' method.");
                }
                if (this.callReject && "pending" === this.state()) {
                    df.reject(detail);
                }
            } else if ("pending" === this.state()) {
                df.reject(detail);
            }
        };

        const _dependOn = function (promise: any): JQueryPromise<any> {
            if (promise.abort) {
                this.dependency = promise;
                promise
                    .always(() => {
                        this.dependency = null;
                    });
            } else {
                console.error(TAG + "[set] dependency object doesn't have 'abort()' method.");
            }
            return promise;
        };

        const _target = $.extend({}, {
            dependency: null,
            callReject: false,
        }, extendOptions);

        return {
            df: df,
            target: _target,
            abort: _abort,
            dependOn: _dependOn,
        };
    }

    /**
     * Promise オブジェクトの作成
     * jQueryDeferred オブジェクトから、Tools.Promise オブジェクトを作成する
     *
     * @param df       [in] jQueryDeferred instance を指定
     * @param options? [in] jQueryPromise を拡張するオブジェクト or キャンセル時に呼び出される関数を指定
     * @returns IPromise オブジェクト
     */
    export function makePromise<T>(df: JQueryDeferred<T>, options?: MakePromiseOptions | cancelCallback): IPromise<T> {
        const cancelable = makeCancelable(df, options);
        const promise = <IPromise<T>><any>df.promise(cancelable.target);
        if (null == promise.abort) {
            promise.abort = cancelable.abort.bind(promise);
        }
        if (null == promise.dependOn) {
            promise.dependOn = cancelable.dependOn.bind(promise);
        }
        return promise;
    }

    //___________________________________________________________________________________________________________________//

    /**
     * Promise オブジェクトの終了を待つ
     * $.when() は失敗するとすぐに制御を返すのに対し、失敗も含めて待つ Promise オブジェクトを返却
     *
     * @param deferreds [in] Promise オブジェクト(可変引数, 配列)
     * @returns Promise オブジェクト
     */
    export function wait<T>(...deferreds: Promise<T>[]): IPromiseBase<T>;
    export function wait<T>(...deferreds: JQueryGenericPromise<T>[]): IPromiseBase<T>;
    export function wait<T>(...deferreds: T[]): IPromiseBase<T>;
    export function wait<T>(...deferreds: any[]): IPromiseBase<T> {

        // 投入法が可変引数だった場合は配列に修正する
        const _deferreds: JQueryPromise<T>[] = [].concat.apply([], deferreds);

        // 実際の作業
        const df = $.Deferred();
        const results = [];
        let initialized = false;

        const isFinished = (): boolean => {
            if (!initialized) {
                return false;
            } else {
                return !results.some((element: any) => {
                    return "pending" === element.status;
                });
            }
        };

        _deferreds.forEach((deferred, index) => {
            results.push({
                status: "pending",
                args: null,
            });
            deferred
                .then((...args: any[]) => {
                    results[index].status = "resolved";
                    results[index].args = args;
                }, (...args: any[]) => {
                    results[index].status = "rejected";
                    results[index].args = args;
                })
                .always(() => {
                    if (isFinished()) {
                        df.resolve(results);
                    }
                });
        });

        initialized = true;
        if (isFinished()) {
            df.resolve(results);
        }

        return <any>df.promise();
    }

    /**
     * Promise オブジェクトの最初の完了を待つ
     *
     * @param deferreds [in] Promise オブジェクト(可変引数, 配列)
     * @returns Promise オブジェクト
     */
    export function race<T>(...deferreds: Promise<T>[]): IPromiseBase<T>;
    export function race<T>(...deferreds: JQueryGenericPromise<T>[]): IPromiseBase<T>;
    export function race<T>(...deferreds: T[]): IPromiseBase<T>;
    export function race<T>(...deferreds: any[]): IPromiseBase<T> {
        const df = $.Deferred();

        const _deferreds: JQueryPromise<T>[] = [].concat.apply([], deferreds);
        _deferreds.forEach((deferred, index) => {
            deferred
                .then((...args: any[]) => {
                    if ("pending" === df.state()) {
                        df.resolve(args);
                    }
                }, (...args: any[]) => {
                    if ("pending" === df.state()) {
                        df.reject(args);
                    }
                });
        });

        return <any>df.promise();
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @class PromiseManager
     * @brief 複数の DataProvider.Promise を管理するクラス
     */
    export class PromiseManager {

        private _pool: { promise: IPromise<any>; id: number; }[] = [];
        private _id: number = 0;

        ///////////////////////////////////////////////////////////////////////
        // public method

        /**
         * Promise を管理下に追加
         *
         * @param promise [in] 管理対象のオブジェクト
         * @returns 引数に渡したオブジェクト
         */
        public add<T>(promise: IPromise<T> | JQueryXHR): IPromise<T> {
            if (promise == null) {
                return null;
            }

            // abort() を持っていない場合はエラー
            if (!promise.abort) {
                console.error(TAG + "[add] promise object doesn't have 'abort()' method.");
                return <any>promise;
            }

            const cookie = {
                promise: <any>promise,
                id: this._id++,
            };

            this._pool.push(cookie);

            (<any>promise)
                .always(() => {
                    this._pool = this._pool.filter((element: { promise: IPromise<any>; id: number; }) => {
                        if (element.id !== cookie.id) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                });

            return <any>promise;
        }

        /**
         * 管理対象の Promise に対して abort を発行
         * キャンセル処理に対するキャンセルは不可
         *
         * @returns Promise オブジェクト
         */
        public cancel(info?: any): IPromiseBase<any> {
            const promises = this.promises();
            promises.forEach((element: IPromise<any>) => {
                if (element.abort) {
                    element.abort(info);
                }
            });
            return wait.apply(null, promises);
        }

        /**
         * 管理対象の Promise を配列で返す
         *
         * @returns Promise オブジェクト配列
         */
        public promises(): IPromise<any>[] {
            return this._pool.map((element) => {
                return element.promise;
            });
        }
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @class PromiseConstructor
     * @brief ES6 Promise 互換の Promise オブジェクトコンストラクタ
     */
    export class PromiseConstructor<T> implements IPromise<T> {

        ///////////////////////////////////////////////////////////////////////
        // mixin: native Promise

        then: <TResult1, TResult2 = never>(
            onfulfilled?: (
                (value?: TResult1, ...values: any[]) => TResult1 | PromiseLike<TResult1> | void
            ) | undefined | null,
            onrejected?: (
                (reason?: any, ...values: any[]) => TResult2 | PromiseLike<TResult2> | void
            ) | undefined | null
        ) => IPromise<TResult1 | TResult2>;

        catch: <TResult = never>(
            onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
        ) => IPromiseBase<TResult>;

        ///////////////////////////////////////////////////////////////////////
        // mixin: JQueryPromise

        state: () => string;
        always: (
            alwaysCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[],
            ...alwaysCallbacksN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>
        ) => IPromise<T>;
        done: (
            doneCallback1?: JQueryPromiseCallback<T> | JQueryPromiseCallback<T>[],
            ...doneCallbackN: Array<JQueryPromiseCallback<T> | JQueryPromiseCallback<T>[]>
        ) => IPromise<T>;
        fail: (
            failCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[],
            ...failCallbacksN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>
        ) => IPromise<T>;
        progress: (
            progressCallback1?: JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[],
            ...progressCallbackN: Array<JQueryPromiseCallback<any> | JQueryPromiseCallback<any>[]>
        ) => IPromise<T>;

        ///////////////////////////////////////////////////////////////////////
        // mixin: JQueryDeferred

        /* tslint:disable:no-unused-variable */
        private notify: (value?: any, ...args: any[]) => JQueryDeferred<T>;
        private notifyWith: (context: any, value?: any[]) => JQueryDeferred<T>;
        private reject: (value?: any, ...args: any[]) => JQueryDeferred<T>;
        private rejectWith: (context: any, value?: any[]) => JQueryDeferred<T>;
        private resolve: (value?: T, ...args: any[]) => JQueryDeferred<T>;
        private resolveWith: (context: any, value?: T[]) => JQueryDeferred<T>;
        /* tslint:enable:no-unused-variable */

        ///////////////////////////////////////////////////////////////////////
        // mixin: IProimise

        abort: (info?: any) => void;
        dependOn: <U>(promise: IPromise<U> | JQueryXHR) => IPromise<U>;

        /**
         * constructor
         *
         * @param executor [in] ES6 Promise 互換引数. (dependOn を第3引数に渡す)
         * @param options? [in] jQueryPromise を拡張するオブジェクト or キャンセル時に呼び出される関数を指定
         * @return IPromise オブジェクト
         */
        constructor(
            executor: (
                resolve: (value?: T | PromiseLike<T>) => void,
                reject: (reason?: any) => void,
                dependOn?: <U>(promise: IPromise<U> | JQueryXHR) => IPromise<U>,
            ) => void,
            options?: MakePromiseOptions | cancelCallback
        ) {
            // apply mixin
            const cancelable = makeCancelable($.Deferred(), options);
            $.extend(true, this, cancelable.df, cancelable.target);
            this.abort = cancelable.abort.bind(this);
            this.dependOn = cancelable.dependOn.bind(this);

            executor(this.resolve, this.reject, this.dependOn);
        }

        ///////////////////////////////////////////////////////////////////////
        // static methods:

        static resolve<T>(value?: T | PromiseLike<T>): IPromiseBase<T> {
            return <any>$.Deferred().resolve(value);
        }

        static reject<T>(reason?: any): Promise<T> {
            return <any>$.Deferred().reject(reason);
        }

        static all<T>(...deferreds: Array<T | IPromise<T> | JQueryPromise<T>>): IPromiseBase<T> {
            return <any>$.when(deferreds);
        }

        static wait<T>(...deferreds: Array<T | IPromise<T> | JQueryPromise<T>>): IPromiseBase<T> {
            return <any>wait(deferreds);
        }

        static race<T>(...deferreds: Array<T | IPromise<T> | JQueryPromise<T>>): IPromiseBase<T> {
            return <any>race(deferreds);
        }
    }

    export const Promise = PromiseConstructor;
}


declare module "cdp.promise" {
    export = CDP;
}
