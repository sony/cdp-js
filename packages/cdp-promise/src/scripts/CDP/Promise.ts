namespace CDP {

    const TAG: string = "[CDP.Promise] ";

    /**
     * @en Extend interface of Native Promise definition<br>
     *     When you don't want to provide the cancel operation but you'd like to use jQuery utility, this interface is useful.
     * @ja Native Promise 拡張インターフェイス定義<br>
     *     キャンセルさせたくないが always() など jQuery method を提供したい場合に使用する.<br>
     */
    export interface IPromiseBase<T> extends Promise<T> {
        ///////////////////////////////////////////////////////////////////////
        // Promise extends:

        then<TResult1 = T, TResult2 = never>(
            onfulfilled?: (
                (value: T) => TResult1 | PromiseLike<TResult1>
            ) | undefined | null,
            onrejected?: (
                (reason: any) => TResult2 | PromiseLike<TResult2>
            ) | undefined | null
        ): IPromiseBase<TResult1 | TResult2>;


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
     * @es Cancelable Promise object interface definition
     * @ja キャンセル可能な Promise オブジェクトのインターフェイス定義
     */
    export interface IPromise<T> extends IPromiseBase<T> {
        /**
         * @en cancel operation
         * @ja キャンセル処理
         *
         * @param info
         *  - `en` reject() argument
         *  - `ja` reject() の引数
         */
        abort(info?: object): void;
        /**
         * @en Promise object which does asynchronous processing on which this object depends.
         * @ja 依存する非同期処理を行う Promise オブジェクト
         */
        dependency?: IPromise<any>;
        /**
         * @en If the value set to true, the system fource call reject() when abort() is called from outside. <br>
         *     This setting is usually unnecessary.
         * @ja abort() コール時に自身の reject() もコールする場合 true を指定 <br>
         *     通常指定は不要
         */
        callReject?: boolean;
        /**
         * @en set IPromise which this object depends.
         * @ja 依存する IPromise を設定
         *
         * @see [[makePromise]]() example.
         */
        dependOn<U>(promise: IPromise<U> | JQueryXHR): IPromise<U>;

        ///////////////////////////////////////////////////////////////////////
        // Promise extends:

        then<TResult1 = T, TResult2 = never>(
            onfulfilled?: (
                (value: T) => TResult1 | PromiseLike<TResult1>
            ) | undefined | null,
            onrejected?: (
                (reason: any) => TResult2 | PromiseLike<TResult2>
            ) | undefined | null
        ): IPromise<TResult1 | TResult2>;

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
     * @en alias of cancel callback for [[makePromise]] argument.
     * @ja [[makePromise]] に指定可能な cancel callback の alias.
     */
    export type cancelCallback = (detail?: object) => void;

    /**
     * makePromise options
     */
    export interface MakePromiseOptions {
        /**
         * @en dependent promise object.
         * @ja 依存する promise を設定
         */
        dependency?: IPromise<any>;
        /**
         * @en If the value set to true, the system fource call reject() when abort() is called from outside. <br>
         *     This setting is usually unnecessary.
         * @ja abort() コール時に自身の reject() もコールする場合 true を指定 <br>
         *     通常指定は不要
         */
        callReject?: boolean;
        /**
         * @en the function called when abort() calling.
         * @ja キャンセル時に呼ばれる関数
         */
        cancelCallback?: cancelCallback;
        /**
         * @en extends parameters. jQuery.Deferred.promise() argument.
         * @ja 拡張パラメータ. jQuery.Deferred.promise() に渡される.
         */
        [key: string]: any;
    }

    /**
     * Cancel 可能オブジェクトの作成
     *
     * @internal <br>
     *
     * @param df jQueryDeferred instance を指定
     * @param options jQueryPromise を拡張するオブジェクト or キャンセル時に呼び出される関数を指定
     * @returns Cancelable property
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

        const _abort = function (info?: object): void {
            const detail = info ? $.extend({}, info, { message: "abort" }) : { message: "abort" };
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
     * @en make [[IPromise]] object.
     * @ja [[IPromise]] オブジェクトの作成
     *
     * @example <br>
     *
     * ```ts
     *  // pipe line operation
     *  function procPipeline(): IPromise<SomeData> {
     *      const df = $.Deferred();            // create jQueryDeferred instance.
     *      const promise = makePromise(df);    // create IPromise instance.
     *
     *      // async1(), async2(), async3() are async function and returned IPromise instance.
     *      promsie.dependOn(async1())
     *          .then(() => {
     *              return promsie.dependOn(async2());
     *          })
     *          .then(() => {
     *              return promsie.dependOn(async3());
     *          })
     *          .done(() => {
     *              df.resolve({ somedata: "hoge" });
     *          })
     *          .fail((error) => {
     *              df.reject(error);
     *          });
     *
     *      return promise;
     *  }
     *
     *  // client of pipe line operation
     *  function procCaller(): void {
     *      const promise = procPipeline();
     *      setTimeout(() => {
     *          promise.abort(); // The whole cancellation is possible by optional timing.
     *          // In whichever processing of async1(), async2() or async3(),
     *          // it can be canceled appropriately.
     *      });
     *  }
     *
     * ```
     *
     * @param df
     *  - `en` set the jQueryDeferred instance.
     *  - `ja` jQueryDeferred instance を指定
     * @param options
     *  - `en` set the extend object or cancel callback function.
     *  - `ja` jQueryPromise を拡張するオブジェクト or キャンセル時に呼び出される関数を指定
     * @returns
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
     * @en Wait for promise processing completing. <br>
     *     jQuery.when() returns control when one of promise is failed. <br>
     *     But this method wait for all promise objects operation including fail case.
     * @ja Promise オブジェクトの終了を待つ <br>
     *     jQuery.when() は失敗するとすぐに制御を返すのに対し、失敗も含めて待つ Promise オブジェクトを返却
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
     * @en Wait for race condition.<br>
     *     This have same semantics as ES2015 Promise.race().
     * @ja Promise オブジェクトの最初の完了を待つ <br>
     *     ES2015 Promise.race() と同等
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
     * @en The class provides the operation for multiple [[IPromise]] object.
     * @ja 複数の [[IPromise]] を一括管理するクラス
     *
     * @example <br>
     *
     * ```ts
     *  let _prmsManager = new PromiseManager();
     *
     *  function procCaller(): void {
     *      // add parallel operations under the management.
     *      _prmsManager.add(async1);
     *      _prmsManager.add(async2);
     *      _prmsManager.add(async3);
     *  }
     *
     *  function allCancel(): void {
     *      // just one call. all parallel ops are canceled.
     *      _prmsManager.cancel();
     *  }
     * ```
     */
    export class PromiseManager {

        private _pool: { promise: IPromise<any>; id: number; }[] = [];
        private _id: number = 0;

        ///////////////////////////////////////////////////////////////////////
        // public method

        /**
         * @en add Promise object that has abort() method.
         * @ja abort() を持つ Promise オブジェクトを管理下に追加
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
         * @en call abort() to under the management Promises.
         * @ja 管理対象の Promise に対して abort を発行
         *
         * @returns
         *  - `en` The cancellation to cancel processing is prohibited.
         *  - `ja` キャンセル処理に対するキャンセルは不可
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
         * @en get Promise objects as array.
         * @ja 管理対象の Promise を配列で取得
         */
        public promises(): IPromise<any>[] {
            return this._pool.map((element) => {
                return element.promise;
            });
        }
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @en Cancelable Promise class for ES2015 Promiise compatible.
     * @ja ES2015 Promise 互換のキャンセル可能な Promise オブジェクト
     */
    export class PromiseConstructor<T> implements IPromise<T> {

        ///////////////////////////////////////////////////////////////////////
        // mixin: native Promise

        then: <TResult1 = T, TResult2 = never>(
            onfulfilled?: (
                (value: T) => TResult1 | PromiseLike<TResult1>
            ) | undefined | null,
            onrejected?: (
                (reason: any) => TResult2 | PromiseLike<TResult2>
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
         * @example <br>
         *
         * ```ts
         *  // override global "Promise" for using Cancelable Promise in this module scope.
         *  import { Promise } from "cdp";
         *
         *  function (): IPromise<SomeData> => {
         *      return new Promise((resolve, reject, dependOn) => {
         *      // async1(), async2() are async function and returned IPromise instance.
         *      dependOn(async1())
         *          .then(() => {
         *              return dependOn(async2());
         *          })
         *          .then(() => {
         *              resolve({ somedata: "hoge" });
         *          })
         *          .catch((error) => {
         *              reject(error);
         *          });
         *      });
         *  };
         * ```
         *
         * @param executor
         *  - `en` ES2015 Promise executer compatible with `dependOn` 3rd arg.
         *  - `ja` ES6 Promise 互換引数. (dependOn を第3引数に渡す)
         * @param options
         *  - `en` set the extend object or cancel callback function.
         *  - `ja` jQueryPromise を拡張するオブジェクト or キャンセル時に呼び出される関数を指定
         */
        constructor(
            executor: (
                resolve: (value?: T | PromiseLike<T>, ...additional: any[]) => void,
                reject?: (reason?: any, ...additional: any[]) => void,
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

        static resolve<U>(value?: U | PromiseLike<U>): IPromise<U> {
            return <any>$.Deferred().resolve(value);
        }

        static reject<U>(reason?: any): IPromise<U> {
            return <any>$.Deferred().reject(reason);
        }

        static all<U>(...deferreds: Array<U | IPromise<U> | JQueryPromise<U>>): IPromiseBase<U> {
            return <any>$.when(deferreds);
        }

        static wait<U>(...deferreds: Array<U | IPromise<U> | JQueryPromise<U>>): IPromiseBase<U> {
            return <any>wait(deferreds);
        }

        static race<U>(...deferreds: Array<U | IPromise<U> | JQueryPromise<U>>): IPromiseBase<U> {
            return <any>race(deferreds);
        }
    }

    export const Promise = PromiseConstructor;
}


declare module "cdp.promise" {
    export = CDP;
}
