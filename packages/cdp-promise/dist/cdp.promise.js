/*!
 * cdp.promise.js 2.0.0
 *
 * Date: 2017-10-27T05:59:38.260Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(["jquery"], function ($) { return factory(root.CDP || (root.CDP = {}), $, root); }); } else if (typeof exports === "object") { module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"), root); } else { factory(root.CDP || (root.CDP = {}), root.jQuery || root.$, root); } }(((this || 0).self || global), function (CDP, $, root) {
var CDP;
(function (CDP) {
    var TAG = "[CDP.Promise] ";
    /**
     * Cancel 可能オブジェクトの作成
     *
     * @internal <br>
     *
     * @param df jQueryDeferred instance を指定
     * @param options jQueryPromise を拡張するオブジェクト or キャンセル時に呼び出される関数を指定
     * @returns Cancelable property
     */
    function makeCancelable(df, options) {
        var extendOptions;
        var cancel;
        if ("function" === typeof options) {
            cancel = options;
        }
        else {
            extendOptions = options;
            if (extendOptions && extendOptions.cancelCallback) {
                cancel = extendOptions.cancelCallback;
            }
            else {
                cancel = function () { };
            }
        }
        var _abort = function (info) {
            var originalMessage = (info && info.message) ? info.message : undefined;
            var detail = info ? $.extend({}, info, { message: "abort", originalMessage: originalMessage }) : { message: "abort" };
            cancel(detail);
            if (null != this.dependency) {
                if (this.dependency.abort) {
                    this.dependency.abort(detail);
                }
                else {
                    console.error(TAG + "[call] dependency object doesn't have 'abort()' method.");
                }
                if (this.callReject && "pending" === this.state()) {
                    df.reject(detail);
                }
            }
            else if ("pending" === this.state()) {
                df.reject(detail);
            }
        };
        var _dependOn = function (promise) {
            var _this = this;
            if (promise.abort) {
                this.dependency = promise;
                promise
                    .always(function () {
                    _this.dependency = null;
                });
            }
            else {
                console.error(TAG + "[set] dependency object doesn't have 'abort()' method.");
            }
            return promise;
        };
        var _target = $.extend({}, {
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
    function makePromise(df, options) {
        var cancelable = makeCancelable(df, options);
        var promise = df.promise(cancelable.target);
        if (null == promise.abort) {
            promise.abort = cancelable.abort.bind(promise);
        }
        if (null == promise.dependOn) {
            promise.dependOn = cancelable.dependOn.bind(promise);
        }
        return promise;
    }
    CDP.makePromise = makePromise;
    function wait() {
        var deferreds = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            deferreds[_i] = arguments[_i];
        }
        // 1次元配列に保証
        var _deferreds = [].concat.apply([], deferreds);
        // 実際の作業
        var df = $.Deferred();
        var results = [];
        var isFinished = function () {
            return !results.some(function (element) {
                return "pending" === element.status;
            });
        };
        _deferreds.forEach(function (deferred, index) {
            results.push({
                status: "pending",
                args: null,
            });
            deferred
                .then(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                results[index].status = "resolved";
                results[index].args = args;
            }, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                results[index].status = "rejected";
                results[index].args = args;
            })
                .always(function () {
                if (isFinished()) {
                    df.resolve(results);
                }
            });
        });
        return df.promise();
    }
    CDP.wait = wait;
    function race() {
        var deferreds = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            deferreds[_i] = arguments[_i];
        }
        var df = $.Deferred();
        var _deferreds = [].concat.apply([], deferreds);
        _deferreds.forEach(function (deferred, index) {
            deferred
                .then(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if ("pending" === df.state()) {
                    df.resolve(args);
                }
            }, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if ("pending" === df.state()) {
                    df.reject(args);
                }
            });
        });
        return df.promise();
    }
    CDP.race = race;
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
    var PromiseManager = /** @class */ (function () {
        function PromiseManager() {
            this._pool = [];
            this._id = 0;
        }
        ///////////////////////////////////////////////////////////////////////
        // public method
        /**
         * @en add Promise object that has abort() method.
         * @ja abort() を持つ Promise オブジェクトを管理下に追加
         */
        PromiseManager.prototype.add = function (promise) {
            var _this = this;
            if (promise == null) {
                return null;
            }
            // abort() を持っていない場合はエラー
            if (!promise.abort) {
                console.error(TAG + "[add] promise object doesn't have 'abort()' method.");
                return promise;
            }
            var cookie = {
                promise: promise,
                id: this._id++,
            };
            this._pool.push(cookie);
            promise
                .always(function () {
                _this._pool = _this._pool.filter(function (element) {
                    if (element.id !== cookie.id) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            });
            return promise;
        };
        /**
         * @en call abort() to under the management Promises.
         * @ja 管理対象の Promise に対して abort を発行
         *
         * @param info
         *  - `en` abort() argument
         *  - `ja` abort() に渡される引数
         * @returns
         *  - `en` The cancellation to cancel processing is prohibited.
         *  - `ja` キャンセル処理に対するキャンセルは不可
         */
        PromiseManager.prototype.cancel = function (info) {
            var promises = this.promises();
            promises.forEach(function (element) {
                if (element.abort) {
                    element.abort(info);
                }
            });
            return wait.apply(null, promises);
        };
        /**
         * @en get Promise objects as array. <br>
         *     only pending state object are returned.
         * @ja 管理対象の Promise を配列で取得 <br>
         *     pending 状態のオブジェクトのみが返る.
         */
        PromiseManager.prototype.promises = function () {
            return this._pool.map(function (element) {
                return element.promise;
            });
        };
        return PromiseManager;
    }());
    CDP.PromiseManager = PromiseManager;
    //___________________________________________________________________________________________________________________//
    /**
     * @en Cancelable Promise class for ES2015 Promiise compatible.
     * @ja ES2015 Promise 互換のキャンセル可能な Promise オブジェクト
     */
    var PromiseConstructor = /** @class */ (function () {
        /**
         * @example <br>
         *
         * ```ts
         *  // override global "Promise" for using Cancelable Promise in this module scope.
         *  import { Promise } from "cdp";
         *
         *  function (): IPromise<SomeData> => {
         *      return new Promise((resolve, reject, dependOn) => {
         *          // async1(), async2() are async function and returned IPromise instance.
         *          dependOn(async1())
         *              .then(() => {
         *                  return dependOn(async2());
         *              })
         *              .then(() => {
         *                  resolve({ somedata: "hoge" });
         *              })
         *              .catch((error) => {
         *                  reject(error);
         *              });
         *          });
         *      };
         *  }
         * ```
         *
         * @param executor
         *  - `en` ES2015 Promise executer compatible with `dependOn` 3rd arg.
         *  - `ja` ES6 Promise 互換引数. (dependOn を第3引数に渡す)
         * @param options
         *  - `en` set the extend object or cancel callback function.
         *  - `ja` jQueryPromise を拡張するオブジェクト or キャンセル時に呼び出される関数を指定
         */
        function PromiseConstructor(executor, options) {
            // apply mixin
            var cancelable = makeCancelable($.Deferred(), options);
            $.extend(true, this, cancelable.df, cancelable.target);
            this.abort = cancelable.abort.bind(this);
            this.dependOn = cancelable.dependOn.bind(this);
            executor(this.resolve, this.reject, this.dependOn);
        }
        ///////////////////////////////////////////////////////////////////////
        // static methods:
        PromiseConstructor.resolve = function (value) {
            return $.Deferred().resolve(value);
        };
        PromiseConstructor.reject = function (reason) {
            return $.Deferred().reject(reason);
        };
        PromiseConstructor.all = function () {
            var deferreds = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                deferreds[_i] = arguments[_i];
            }
            return $.when.apply(this, [].concat.apply([], deferreds));
        };
        PromiseConstructor.wait = function () {
            var deferreds = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                deferreds[_i] = arguments[_i];
            }
            return wait([].concat.apply([], deferreds));
        };
        PromiseConstructor.race = function () {
            var deferreds = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                deferreds[_i] = arguments[_i];
            }
            return race([].concat.apply([], deferreds));
        };
        return PromiseConstructor;
    }());
    CDP.PromiseConstructor = PromiseConstructor;
    CDP.Promise = PromiseConstructor;
})(CDP || (CDP = {}));

root.Promise = root.Promise || CDP.Promise; return CDP; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvUHJvbWlzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0F5bEJaO0FBemxCRCxXQUFVLEdBQUc7SUFFVCxJQUFNLEdBQUcsR0FBVyxnQkFBZ0IsQ0FBQztJQW9KckM7Ozs7Ozs7O09BUUc7SUFDSCx3QkFDSSxFQUFxQixFQUNyQixPQUE2QztRQUU3QyxJQUFJLGFBQWlDLENBQUM7UUFDdEMsSUFBSSxNQUFzQixDQUFDO1FBRTNCLEVBQUUsQ0FBQyxDQUFDLFVBQVUsS0FBSyxPQUFPLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDaEMsTUFBTSxHQUFtQixPQUFPLENBQUM7UUFDckMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osYUFBYSxHQUFHLE9BQU8sQ0FBQztZQUN4QixFQUFFLENBQUMsQ0FBQyxhQUFhLElBQUksYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sR0FBRyxhQUFhLENBQUMsY0FBYyxDQUFDO1lBQzFDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixNQUFNLEdBQUcsY0FBbUIsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7UUFDTCxDQUFDO1FBRUQsSUFBTSxNQUFNLEdBQUcsVUFBVSxJQUFhO1lBQ2xDLElBQU0sZUFBZSxHQUFHLENBQUMsSUFBSSxJQUFVLElBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQU8sSUFBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1lBQ3hGLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQUUsZUFBZSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUM7WUFDeEgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2YsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLHlEQUF5RCxDQUFDLENBQUM7Z0JBQ25GLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxTQUFTLEtBQUssSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDaEQsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEIsQ0FBQztZQUNMLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsU0FBUyxLQUFLLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEIsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLElBQU0sU0FBUyxHQUFHLFVBQVUsT0FBWTtZQUF0QixpQkFXakI7WUFWRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUM7Z0JBQzFCLE9BQU87cUJBQ0YsTUFBTSxDQUFDO29CQUNKLEtBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUMzQixDQUFDLENBQUMsQ0FBQztZQUNYLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyx3REFBd0QsQ0FBQyxDQUFDO1lBQ2xGLENBQUM7WUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQztRQUVGLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFO1lBQ3pCLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFVBQVUsRUFBRSxLQUFLO1NBQ3BCLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFFbEIsTUFBTSxDQUFDO1lBQ0gsRUFBRSxFQUFFLEVBQUU7WUFDTixNQUFNLEVBQUUsT0FBTztZQUNmLEtBQUssRUFBRSxNQUFNO1lBQ2IsUUFBUSxFQUFFLFNBQVM7U0FDdEIsQ0FBQztJQUNOLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQWlERztJQUNILHFCQUErQixFQUFxQixFQUFFLE9BQTZDO1FBQy9GLElBQU0sVUFBVSxHQUFHLGNBQWMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0MsSUFBTSxPQUFPLEdBQXFCLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hFLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN4QixPQUFPLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDM0IsT0FBTyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBVmUsZUFBVyxjQVUxQjtJQWNEO1FBQXdCLG1CQUFtQjthQUFuQixVQUFtQixFQUFuQixxQkFBbUIsRUFBbkIsSUFBbUI7WUFBbkIsOEJBQW1COztRQUV2QyxXQUFXO1FBQ1gsSUFBTSxVQUFVLEdBQXVCLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUV0RSxRQUFRO1FBQ1IsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hCLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUVuQixJQUFNLFVBQVUsR0FBRztZQUNmLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQyxPQUFZO2dCQUM5QixNQUFNLENBQUMsU0FBUyxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7UUFFRixVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUSxFQUFFLEtBQUs7WUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQztnQkFDVCxNQUFNLEVBQUUsU0FBUztnQkFDakIsSUFBSSxFQUFFLElBQUk7YUFDYixDQUFDLENBQUM7WUFDSCxRQUFRO2lCQUNILElBQUksQ0FBQztnQkFBQyxjQUFjO3FCQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7b0JBQWQseUJBQWM7O2dCQUNqQixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztnQkFDbkMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDL0IsQ0FBQyxFQUFFO2dCQUFDLGNBQWM7cUJBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztvQkFBZCx5QkFBYzs7Z0JBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7Z0JBQ25DLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQy9CLENBQUMsQ0FBQztpQkFDRCxNQUFNLENBQUM7Z0JBQ0osRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUNmLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3hCLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFNLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBcENlLFFBQUksT0FvQ25CO0lBV0Q7UUFBd0IsbUJBQW1CO2FBQW5CLFVBQW1CLEVBQW5CLHFCQUFtQixFQUFuQixJQUFtQjtZQUFuQiw4QkFBbUI7O1FBQ3ZDLElBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUV4QixJQUFNLFVBQVUsR0FBdUIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUUsS0FBSztZQUMvQixRQUFRO2lCQUNILElBQUksQ0FBQztnQkFBQyxjQUFjO3FCQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7b0JBQWQseUJBQWM7O2dCQUNqQixFQUFFLENBQUMsQ0FBQyxTQUFTLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDM0IsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckIsQ0FBQztZQUNMLENBQUMsRUFBRTtnQkFBQyxjQUFjO3FCQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7b0JBQWQseUJBQWM7O2dCQUNkLEVBQUUsQ0FBQyxDQUFDLFNBQVMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMzQixFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNwQixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBTSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQWxCZSxRQUFJLE9Ba0JuQjtJQUVELHVIQUF1SDtJQUV2SDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BcUJHO0lBQ0g7UUFBQTtZQUVZLFVBQUssR0FBOEMsRUFBRSxDQUFDO1lBQ3RELFFBQUcsR0FBVyxDQUFDLENBQUM7UUF5RTVCLENBQUM7UUF2RUcsdUVBQXVFO1FBQ3ZFLGdCQUFnQjtRQUVoQjs7O1dBR0c7UUFDSSw0QkFBRyxHQUFWLFVBQWMsT0FBZ0M7WUFBOUMsaUJBOEJDO1lBN0JHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2hCLENBQUM7WUFFRCx3QkFBd0I7WUFDeEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDakIsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcscURBQXFELENBQUMsQ0FBQztnQkFDM0UsTUFBTSxDQUFNLE9BQU8sQ0FBQztZQUN4QixDQUFDO1lBRUQsSUFBTSxNQUFNLEdBQUc7Z0JBQ1gsT0FBTyxFQUFPLE9BQU87Z0JBQ3JCLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFO2FBQ2pCLENBQUM7WUFFRixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVsQixPQUFRO2lCQUNULE1BQU0sQ0FBQztnQkFDSixLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUMsT0FBZ0Q7b0JBQzVFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUM7b0JBQ2hCLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQztvQkFDakIsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1lBRVAsTUFBTSxDQUFNLE9BQU8sQ0FBQztRQUN4QixDQUFDO1FBRUQ7Ozs7Ozs7Ozs7V0FVRztRQUNJLCtCQUFNLEdBQWIsVUFBYyxJQUFhO1lBQ3ZCLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBc0I7Z0JBQ3BDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4QixDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0ksaUNBQVEsR0FBZjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLE9BQU87Z0JBQzFCLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNMLHFCQUFDO0lBQUQsQ0FBQztJQTVFWSxrQkFBYyxpQkE0RTFCO0lBRUQsdUhBQXVIO0lBRXZIOzs7T0FHRztJQUNIO1FBeURJOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBK0JHO1FBQ0gsNEJBQ0ksUUFJUyxFQUNULE9BQTZDO1lBRTdDLGNBQWM7WUFDZCxJQUFNLFVBQVUsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3pELENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsRUFBRSxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN2RCxJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLElBQUksQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFL0MsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUVELHVFQUF1RTtRQUN2RSxrQkFBa0I7UUFFWCwwQkFBTyxHQUFkLFVBQWtCLEtBQTBCO1lBQ3hDLE1BQU0sQ0FBTSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVDLENBQUM7UUFFTSx5QkFBTSxHQUFiLFVBQWlCLE1BQVk7WUFDekIsTUFBTSxDQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUMsQ0FBQztRQUVNLHNCQUFHLEdBQVY7WUFBYyxtQkFBdUQ7aUJBQXZELFVBQXVELEVBQXZELHFCQUF1RCxFQUF2RCxJQUF1RDtnQkFBdkQsOEJBQXVEOztZQUNqRSxNQUFNLENBQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFFTSx1QkFBSSxHQUFYO1lBQWUsbUJBQXVEO2lCQUF2RCxVQUF1RCxFQUF2RCxxQkFBdUQsRUFBdkQsSUFBdUQ7Z0JBQXZELDhCQUF1RDs7WUFDbEUsTUFBTSxDQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRU0sdUJBQUksR0FBWDtZQUFlLG1CQUF1RDtpQkFBdkQsVUFBdUQsRUFBdkQscUJBQXVELEVBQXZELElBQXVEO2dCQUF2RCw4QkFBdUQ7O1lBQ2xFLE1BQU0sQ0FBTSxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUNMLHlCQUFDO0lBQUQsQ0FBQztJQWhJWSxzQkFBa0IscUJBZ0k5QjtJQUVZLFdBQU8sR0FBRyxrQkFBa0IsQ0FBQztBQUM5QyxDQUFDLEVBemxCUyxHQUFHLEtBQUgsR0FBRyxRQXlsQloiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgQ0RQIHtcclxuXHJcbiAgICBjb25zdCBUQUc6IHN0cmluZyA9IFwiW0NEUC5Qcm9taXNlXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFeHRlbmQgaW50ZXJmYWNlIG9mIE5hdGl2ZSBQcm9taXNlIGRlZmluaXRpb248YnI+XHJcbiAgICAgKiAgICAgV2hlbiB5b3UgZG9uJ3Qgd2FudCB0byBwcm92aWRlIHRoZSBjYW5jZWwgb3BlcmF0aW9uIGJ1dCB5b3UnZCBsaWtlIHRvIHVzZSBqUXVlcnkgdXRpbGl0eSwgdGhpcyBpbnRlcmZhY2UgaXMgdXNlZnVsLlxyXG4gICAgICogQGphIE5hdGl2ZSBQcm9taXNlIOaLoeW8teOCpOODs+OCv+ODvOODleOCp+OCpOOCueWumue+qTxicj5cclxuICAgICAqICAgICDjgq3jg6Pjg7Pjgrvjg6vjgZXjgZvjgZ/jgY/jgarjgYTjgYwgYWx3YXlzKCkg44Gq44GpIGpRdWVyeSBtZXRob2Qg44KS5o+Q5L6b44GX44Gf44GE5aC05ZCI44Gr5L2/55So44GZ44KLLjxicj5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUHJvbWlzZUJhc2U8VD4gZXh0ZW5kcyBQcm9taXNlPFQ+IHtcclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIFByb21pc2UgZXh0ZW5kczpcclxuXHJcbiAgICAgICAgdGhlbjxUUmVzdWx0MSA9IFQsIFRSZXN1bHQyID0gbmV2ZXI+KFxyXG4gICAgICAgICAgICBvbmZ1bGZpbGxlZD86IChcclxuICAgICAgICAgICAgICAgICh2YWx1ZTogVCkgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT5cclxuICAgICAgICAgICAgKSB8IHVuZGVmaW5lZCB8IG51bGwsXHJcbiAgICAgICAgICAgIG9ucmVqZWN0ZWQ/OiAoXHJcbiAgICAgICAgICAgICAgICAocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+XHJcbiAgICAgICAgICAgICkgfCB1bmRlZmluZWQgfCBudWxsXHJcbiAgICAgICAgKTogSVByb21pc2VCYXNlPFRSZXN1bHQxIHwgVFJlc3VsdDI+O1xyXG5cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBKUXVlcnlQcm9taXNlIHN0dWZmOlxyXG5cclxuICAgICAgICBzdGF0ZTogKCkgPT4gc3RyaW5nO1xyXG4gICAgICAgIGFsd2F5czogKFxyXG4gICAgICAgICAgICBhbHdheXNDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10sXHJcbiAgICAgICAgICAgIC4uLmFsd2F5c0NhbGxiYWNrc046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlQmFzZTxUPjtcclxuICAgICAgICBkb25lOiAoXHJcbiAgICAgICAgICAgIGRvbmVDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD5bXSxcclxuICAgICAgICAgICAgLi4uZG9uZUNhbGxiYWNrTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZUJhc2U8VD47XHJcbiAgICAgICAgZmFpbDogKFxyXG4gICAgICAgICAgICBmYWlsQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdLFxyXG4gICAgICAgICAgICAuLi5mYWlsQ2FsbGJhY2tzTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdPlxyXG4gICAgICAgICkgPT4gSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgICAgIHByb2dyZXNzOiAoXHJcbiAgICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdLFxyXG4gICAgICAgICAgICAuLi5wcm9ncmVzc0NhbGxiYWNrTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdPlxyXG4gICAgICAgICkgPT4gSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVzIENhbmNlbGFibGUgUHJvbWlzZSBvYmplY3QgaW50ZXJmYWNlIGRlZmluaXRpb25cclxuICAgICAqIEBqYSDjgq3jg6Pjg7Pjgrvjg6vlj6/og73jgaogUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jjga7jgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnlrprnvqlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUHJvbWlzZTxUPiBleHRlbmRzIElQcm9taXNlQmFzZTxUPiB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGVuIGNhbmNlbCBvcGVyYXRpb25cclxuICAgICAgICAgKiBAamEg44Kt44Oj44Oz44K744Or5Yem55CGXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gaW5mb1xyXG4gICAgICAgICAqICAtIGBlbmAgcmVqZWN0KCkgYXJndW1lbnRcclxuICAgICAgICAgKiAgLSBgamFgIHJlamVjdCgpIOOBruW8leaVsFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGFib3J0KGluZm8/OiBvYmplY3QpOiB2b2lkO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBQcm9taXNlIG9iamVjdCB3aGljaCBkb2VzIGFzeW5jaHJvbm91cyBwcm9jZXNzaW5nIG9uIHdoaWNoIHRoaXMgb2JqZWN0IGRlcGVuZHMuXHJcbiAgICAgICAgICogQGphIOS+neWtmOOBmeOCi+mdnuWQjOacn+WHpueQhuOCkuihjOOBhiBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGRlcGVuZGVuY3k/OiBJUHJvbWlzZTxhbnk+O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBJZiB0aGUgdmFsdWUgc2V0IHRvIHRydWUsIHRoZSBzeXN0ZW0gZm91cmNlIGNhbGwgcmVqZWN0KCkgd2hlbiBhYm9ydCgpIGlzIGNhbGxlZCBmcm9tIG91dHNpZGUuIDxicj5cclxuICAgICAgICAgKiAgICAgVGhpcyBzZXR0aW5nIGlzIHVzdWFsbHkgdW5uZWNlc3NhcnkuXHJcbiAgICAgICAgICogQGphIGFib3J0KCkg44Kz44O844Or5pmC44Gr6Ieq6Lqr44GuIHJlamVjdCgpIOOCguOCs+ODvOODq+OBmeOCi+WgtOWQiCB0cnVlIOOCkuaMh+WumiA8YnI+XHJcbiAgICAgICAgICogICAgIOmAmuW4uOaMh+WumuOBr+S4jeimgVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNhbGxSZWplY3Q/OiBib29sZWFuO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBzZXQgSVByb21pc2Ugd2hpY2ggdGhpcyBvYmplY3QgZGVwZW5kcy5cclxuICAgICAgICAgKiBAamEg5L6d5a2Y44GZ44KLIElQcm9taXNlIOOCkuioreWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHNlZSBbW21ha2VQcm9taXNlXV0oKSBleGFtcGxlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGRlcGVuZE9uPFU+KHByb21pc2U6IElQcm9taXNlPFU+IHwgSlF1ZXJ5WEhSKTogSVByb21pc2U8VT47XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gUHJvbWlzZSBleHRlbmRzOlxyXG5cclxuICAgICAgICB0aGVuPFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXHJcbiAgICAgICAgICAgIG9uZnVsZmlsbGVkPzogKFxyXG4gICAgICAgICAgICAgICAgKHZhbHVlOiBUKSA9PiBUUmVzdWx0MSB8IFByb21pc2VMaWtlPFRSZXN1bHQxPlxyXG4gICAgICAgICAgICApIHwgdW5kZWZpbmVkIHwgbnVsbCxcclxuICAgICAgICAgICAgb25yZWplY3RlZD86IChcclxuICAgICAgICAgICAgICAgIChyZWFzb246IGFueSkgPT4gVFJlc3VsdDIgfCBQcm9taXNlTGlrZTxUUmVzdWx0Mj5cclxuICAgICAgICAgICAgKSB8IHVuZGVmaW5lZCB8IG51bGxcclxuICAgICAgICApOiBJUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPjtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBKUXVlcnlQcm9taXNlIHN0dWZmOlxyXG5cclxuICAgICAgICBzdGF0ZTogKCkgPT4gc3RyaW5nO1xyXG4gICAgICAgIGFsd2F5czogKFxyXG4gICAgICAgICAgICBhbHdheXNDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10sXHJcbiAgICAgICAgICAgIC4uLmFsd2F5c0NhbGxiYWNrc046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG4gICAgICAgIGRvbmU6IChcclxuICAgICAgICAgICAgZG9uZUNhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxUPiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxUPltdLFxyXG4gICAgICAgICAgICAuLi5kb25lQ2FsbGJhY2tOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG4gICAgICAgIGZhaWw6IChcclxuICAgICAgICAgICAgZmFpbENhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4uZmFpbENhbGxiYWNrc046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG4gICAgICAgIHByb2dyZXNzOiAoXHJcbiAgICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdLFxyXG4gICAgICAgICAgICAuLi5wcm9ncmVzc0NhbGxiYWNrTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdPlxyXG4gICAgICAgICkgPT4gSVByb21pc2U8VD47XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBhbGlhcyBvZiBjYW5jZWwgY2FsbGJhY2sgZm9yIFtbbWFrZVByb21pc2VdXSBhcmd1bWVudC5cclxuICAgICAqIEBqYSBbW21ha2VQcm9taXNlXV0g44Gr5oyH5a6a5Y+v6IO944GqIGNhbmNlbCBjYWxsYmFjayDjga4gYWxpYXMuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB0eXBlIGNhbmNlbENhbGxiYWNrID0gKGRldGFpbD86IG9iamVjdCkgPT4gdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIG1ha2VQcm9taXNlIG9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBNYWtlUHJvbWlzZU9wdGlvbnMge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBkZXBlbmRlbnQgcHJvbWlzZSBvYmplY3QuXHJcbiAgICAgICAgICogQGphIOS+neWtmOOBmeOCiyBwcm9taXNlIOOCkuioreWumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGRlcGVuZGVuY3k/OiBJUHJvbWlzZTxhbnk+O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBJZiB0aGUgdmFsdWUgc2V0IHRvIHRydWUsIHRoZSBzeXN0ZW0gZm91cmNlIGNhbGwgcmVqZWN0KCkgd2hlbiBhYm9ydCgpIGlzIGNhbGxlZCBmcm9tIG91dHNpZGUuIDxicj5cclxuICAgICAgICAgKiAgICAgVGhpcyBzZXR0aW5nIGlzIHVzdWFsbHkgdW5uZWNlc3NhcnkuXHJcbiAgICAgICAgICogQGphIGFib3J0KCkg44Kz44O844Or5pmC44Gr6Ieq6Lqr44GuIHJlamVjdCgpIOOCguOCs+ODvOODq+OBmeOCi+WgtOWQiCB0cnVlIOOCkuaMh+WumiA8YnI+XHJcbiAgICAgICAgICogICAgIOmAmuW4uOaMh+WumuOBr+S4jeimgVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNhbGxSZWplY3Q/OiBib29sZWFuO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiB0aGUgZnVuY3Rpb24gY2FsbGVkIHdoZW4gYWJvcnQoKSBjYWxsaW5nLlxyXG4gICAgICAgICAqIEBqYSDjgq3jg6Pjg7Pjgrvjg6vmmYLjgavlkbzjgbDjgozjgovplqLmlbBcclxuICAgICAgICAgKi9cclxuICAgICAgICBjYW5jZWxDYWxsYmFjaz86IGNhbmNlbENhbGxiYWNrO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBleHRlbmRzIHBhcmFtZXRlcnMuIGpRdWVyeS5EZWZlcnJlZC5wcm9taXNlKCkgYXJndW1lbnQuXHJcbiAgICAgICAgICogQGphIOaLoeW8teODkeODqeODoeODvOOCvy4galF1ZXJ5LkRlZmVycmVkLnByb21pc2UoKSDjgavmuKHjgZXjgozjgosuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FuY2VsIOWPr+iDveOCquODluOCuOOCp+OCr+ODiOOBruS9nOaIkFxyXG4gICAgICpcclxuICAgICAqIEBpbnRlcm5hbCA8YnI+XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRmIGpRdWVyeURlZmVycmVkIGluc3RhbmNlIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIG9wdGlvbnMgalF1ZXJ5UHJvbWlzZSDjgpLmi6HlvLXjgZnjgovjgqrjg5bjgrjjgqfjgq/jg4ggb3Ig44Kt44Oj44Oz44K744Or5pmC44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44KS5oyH5a6aXHJcbiAgICAgKiBAcmV0dXJucyBDYW5jZWxhYmxlIHByb3BlcnR5XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1ha2VDYW5jZWxhYmxlPFQ+KFxyXG4gICAgICAgIGRmOiBKUXVlcnlEZWZlcnJlZDxUPixcclxuICAgICAgICBvcHRpb25zPzogTWFrZVByb21pc2VPcHRpb25zIHwgY2FuY2VsQ2FsbGJhY2tcclxuICAgICk6IHsgZGY6IEpRdWVyeURlZmVycmVkPFQ+LCB0YXJnZXQ6IG9iamVjdDsgYWJvcnQ6IChpbmZvPzogYW55KSA9PiB2b2lkOyBkZXBlbmRPbjogKHByb21pc2U6IGFueSkgPT4gSlF1ZXJ5UHJvbWlzZTxhbnk+IH0ge1xyXG4gICAgICAgIGxldCBleHRlbmRPcHRpb25zOiBNYWtlUHJvbWlzZU9wdGlvbnM7XHJcbiAgICAgICAgbGV0IGNhbmNlbDogY2FuY2VsQ2FsbGJhY2s7XHJcblxyXG4gICAgICAgIGlmIChcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGNhbmNlbCA9IDxjYW5jZWxDYWxsYmFjaz5vcHRpb25zO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGV4dGVuZE9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgICAgICBpZiAoZXh0ZW5kT3B0aW9ucyAmJiBleHRlbmRPcHRpb25zLmNhbmNlbENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYW5jZWwgPSBleHRlbmRPcHRpb25zLmNhbmNlbENhbGxiYWNrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2FuY2VsID0gKCkgPT4geyAvKiBub29wICovIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IF9hYm9ydCA9IGZ1bmN0aW9uIChpbmZvPzogb2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsTWVzc2FnZSA9IChpbmZvICYmICg8YW55PmluZm8pLm1lc3NhZ2UpID8gKDxhbnk+aW5mbykubWVzc2FnZSA6IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgY29uc3QgZGV0YWlsID0gaW5mbyA/ICQuZXh0ZW5kKHt9LCBpbmZvLCB7IG1lc3NhZ2U6IFwiYWJvcnRcIiwgb3JpZ2luYWxNZXNzYWdlOiBvcmlnaW5hbE1lc3NhZ2UgfSkgOiB7IG1lc3NhZ2U6IFwiYWJvcnRcIiB9O1xyXG4gICAgICAgICAgICBjYW5jZWwoZGV0YWlsKTtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5kZXBlbmRlbmN5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXBlbmRlbmN5LmFib3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmN5LmFib3J0KGRldGFpbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJbY2FsbF0gZGVwZW5kZW5jeSBvYmplY3QgZG9lc24ndCBoYXZlICdhYm9ydCgpJyBtZXRob2QuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FsbFJlamVjdCAmJiBcInBlbmRpbmdcIiA9PT0gdGhpcy5zdGF0ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGRldGFpbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJwZW5kaW5nXCIgPT09IHRoaXMuc3RhdGUoKSkge1xyXG4gICAgICAgICAgICAgICAgZGYucmVqZWN0KGRldGFpbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfZGVwZW5kT24gPSBmdW5jdGlvbiAocHJvbWlzZTogYW55KTogSlF1ZXJ5UHJvbWlzZTxhbnk+IHtcclxuICAgICAgICAgICAgaWYgKHByb21pc2UuYWJvcnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jeSA9IHByb21pc2U7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlXHJcbiAgICAgICAgICAgICAgICAgICAgLmFsd2F5cygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jeSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiW3NldF0gZGVwZW5kZW5jeSBvYmplY3QgZG9lc24ndCBoYXZlICdhYm9ydCgpJyBtZXRob2QuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IF90YXJnZXQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBkZXBlbmRlbmN5OiBudWxsLFxyXG4gICAgICAgICAgICBjYWxsUmVqZWN0OiBmYWxzZSxcclxuICAgICAgICB9LCBleHRlbmRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGY6IGRmLFxyXG4gICAgICAgICAgICB0YXJnZXQ6IF90YXJnZXQsXHJcbiAgICAgICAgICAgIGFib3J0OiBfYWJvcnQsXHJcbiAgICAgICAgICAgIGRlcGVuZE9uOiBfZGVwZW5kT24sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBtYWtlIFtbSVByb21pc2VdXSBvYmplY3QuXHJcbiAgICAgKiBAamEgW1tJUHJvbWlzZV1dIOOCquODluOCuOOCp+OCr+ODiOOBruS9nOaIkFxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlIDxicj5cclxuICAgICAqXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogIC8vIHBpcGUgbGluZSBvcGVyYXRpb25cclxuICAgICAqICBmdW5jdGlvbiBwcm9jUGlwZWxpbmUoKTogSVByb21pc2U8U29tZURhdGE+IHtcclxuICAgICAqICAgICAgY29uc3QgZGYgPSAkLkRlZmVycmVkKCk7ICAgICAgICAgICAgLy8gY3JlYXRlIGpRdWVyeURlZmVycmVkIGluc3RhbmNlLlxyXG4gICAgICogICAgICBjb25zdCBwcm9taXNlID0gbWFrZVByb21pc2UoZGYpOyAgICAvLyBjcmVhdGUgSVByb21pc2UgaW5zdGFuY2UuXHJcbiAgICAgKlxyXG4gICAgICogICAgICAvLyBhc3luYzEoKSwgYXN5bmMyKCksIGFzeW5jMygpIGFyZSBhc3luYyBmdW5jdGlvbiBhbmQgcmV0dXJuZWQgSVByb21pc2UgaW5zdGFuY2UuXHJcbiAgICAgKiAgICAgIHByb21zaWUuZGVwZW5kT24oYXN5bmMxKCkpXHJcbiAgICAgKiAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgKiAgICAgICAgICAgICAgcmV0dXJuIHByb21zaWUuZGVwZW5kT24oYXN5bmMyKCkpO1xyXG4gICAgICogICAgICAgICAgfSlcclxuICAgICAqICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAqICAgICAgICAgICAgICByZXR1cm4gcHJvbXNpZS5kZXBlbmRPbihhc3luYzMoKSk7XHJcbiAgICAgKiAgICAgICAgICB9KVxyXG4gICAgICogICAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICogICAgICAgICAgICAgIGRmLnJlc29sdmUoeyBzb21lZGF0YTogXCJob2dlXCIgfSk7XHJcbiAgICAgKiAgICAgICAgICB9KVxyXG4gICAgICogICAgICAgICAgLmZhaWwoKGVycm9yKSA9PiB7XHJcbiAgICAgKiAgICAgICAgICAgICAgZGYucmVqZWN0KGVycm9yKTtcclxuICAgICAqICAgICAgICAgIH0pO1xyXG4gICAgICpcclxuICAgICAqICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgKiAgfVxyXG4gICAgICpcclxuICAgICAqICAvLyBjbGllbnQgb2YgcGlwZSBsaW5lIG9wZXJhdGlvblxyXG4gICAgICogIGZ1bmN0aW9uIHByb2NDYWxsZXIoKTogdm9pZCB7XHJcbiAgICAgKiAgICAgIGNvbnN0IHByb21pc2UgPSBwcm9jUGlwZWxpbmUoKTtcclxuICAgICAqICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgKiAgICAgICAgICBwcm9taXNlLmFib3J0KCk7IC8vIFRoZSB3aG9sZSBjYW5jZWxsYXRpb24gaXMgcG9zc2libGUgYnkgb3B0aW9uYWwgdGltaW5nLlxyXG4gICAgICogICAgICAgICAgLy8gSW4gd2hpY2hldmVyIHByb2Nlc3Npbmcgb2YgYXN5bmMxKCksIGFzeW5jMigpIG9yIGFzeW5jMygpLFxyXG4gICAgICogICAgICAgICAgLy8gaXQgY2FuIGJlIGNhbmNlbGVkIGFwcHJvcHJpYXRlbHkuXHJcbiAgICAgKiAgICAgIH0pO1xyXG4gICAgICogIH1cclxuICAgICAqXHJcbiAgICAgKiBgYGBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGZcclxuICAgICAqICAtIGBlbmAgc2V0IHRoZSBqUXVlcnlEZWZlcnJlZCBpbnN0YW5jZS5cclxuICAgICAqICAtIGBqYWAgalF1ZXJ5RGVmZXJyZWQgaW5zdGFuY2Ug44KS5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9uc1xyXG4gICAgICogIC0gYGVuYCBzZXQgdGhlIGV4dGVuZCBvYmplY3Qgb3IgY2FuY2VsIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG4gICAgICogIC0gYGphYCBqUXVlcnlQcm9taXNlIOOCkuaLoeW8teOBmeOCi+OCquODluOCuOOCp+OCr+ODiCBvciDjgq3jg6Pjg7Pjgrvjg6vmmYLjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgpLmjIflrppcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBtYWtlUHJvbWlzZTxUPihkZjogSlF1ZXJ5RGVmZXJyZWQ8VD4sIG9wdGlvbnM/OiBNYWtlUHJvbWlzZU9wdGlvbnMgfCBjYW5jZWxDYWxsYmFjayk6IElQcm9taXNlPFQ+IHtcclxuICAgICAgICBjb25zdCBjYW5jZWxhYmxlID0gbWFrZUNhbmNlbGFibGUoZGYsIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHByb21pc2UgPSA8SVByb21pc2U8VD4+PGFueT5kZi5wcm9taXNlKGNhbmNlbGFibGUudGFyZ2V0KTtcclxuICAgICAgICBpZiAobnVsbCA9PSBwcm9taXNlLmFib3J0KSB7XHJcbiAgICAgICAgICAgIHByb21pc2UuYWJvcnQgPSBjYW5jZWxhYmxlLmFib3J0LmJpbmQocHJvbWlzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChudWxsID09IHByb21pc2UuZGVwZW5kT24pIHtcclxuICAgICAgICAgICAgcHJvbWlzZS5kZXBlbmRPbiA9IGNhbmNlbGFibGUuZGVwZW5kT24uYmluZChwcm9taXNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXYWl0IGZvciBwcm9taXNlIHByb2Nlc3NpbmcgY29tcGxldGluZy4gPGJyPlxyXG4gICAgICogICAgIGpRdWVyeS53aGVuKCkgcmV0dXJucyBjb250cm9sIHdoZW4gb25lIG9mIHByb21pc2UgaXMgZmFpbGVkLiA8YnI+XHJcbiAgICAgKiAgICAgQnV0IHRoaXMgbWV0aG9kIHdhaXQgZm9yIGFsbCBwcm9taXNlIG9iamVjdHMgb3BlcmF0aW9uIGluY2x1ZGluZyBmYWlsIGNhc2UuXHJcbiAgICAgKiBAamEgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jjga7ntYLkuobjgpLlvoXjgaQgPGJyPlxyXG4gICAgICogICAgIGpRdWVyeS53aGVuKCkg44Gv5aSx5pWX44GZ44KL44Go44GZ44GQ44Gr5Yi25b6h44KS6L+U44GZ44Gu44Gr5a++44GX44CB5aSx5pWX44KC5ZCr44KB44Gm5b6F44GkIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiB3YWl0PFQ+KC4uLmRlZmVycmVkczogUHJvbWlzZTxUPltdKTogSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHdhaXQ8VD4oLi4uZGVmZXJyZWRzOiBKUXVlcnlHZW5lcmljUHJvbWlzZTxUPltdKTogSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHdhaXQ8VD4oLi4uZGVmZXJyZWRzOiBUW10pOiBJUHJvbWlzZUJhc2U8VD47XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gd2FpdDxUPiguLi5kZWZlcnJlZHM6IGFueVtdKTogSVByb21pc2VCYXNlPFQ+IHtcclxuXHJcbiAgICAgICAgLy8gMeasoeWFg+mFjeWIl+OBq+S/neiovFxyXG4gICAgICAgIGNvbnN0IF9kZWZlcnJlZHM6IEpRdWVyeVByb21pc2U8VD5bXSA9IFtdLmNvbmNhdC5hcHBseShbXSwgZGVmZXJyZWRzKTtcclxuXHJcbiAgICAgICAgLy8g5a6f6Zqb44Gu5L2c5qWtXHJcbiAgICAgICAgY29uc3QgZGYgPSAkLkRlZmVycmVkKCk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdCBpc0ZpbmlzaGVkID0gKCk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gIXJlc3VsdHMuc29tZSgoZWxlbWVudDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJwZW5kaW5nXCIgPT09IGVsZW1lbnQuc3RhdHVzO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBfZGVmZXJyZWRzLmZvckVhY2goKGRlZmVycmVkLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInBlbmRpbmdcIixcclxuICAgICAgICAgICAgICAgIGFyZ3M6IG51bGwsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkZWZlcnJlZFxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKC4uLmFyZ3M6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1tpbmRleF0uc3RhdHVzID0gXCJyZXNvbHZlZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdLmFyZ3MgPSBhcmdzO1xyXG4gICAgICAgICAgICAgICAgfSwgKC4uLmFyZ3M6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1tpbmRleF0uc3RhdHVzID0gXCJyZWplY3RlZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdLmFyZ3MgPSBhcmdzO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5hbHdheXMoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0ZpbmlzaGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDxhbnk+ZGYucHJvbWlzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFdhaXQgZm9yIHJhY2UgY29uZGl0aW9uLjxicj5cclxuICAgICAqICAgICBUaGlzIGhhdmUgc2FtZSBzZW1hbnRpY3MgYXMgRVMyMDE1IFByb21pc2UucmFjZSgpLlxyXG4gICAgICogQGphIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44Gu5pyA5Yid44Gu5a6M5LqG44KS5b6F44GkIDxicj5cclxuICAgICAqICAgICBFUzIwMTUgUHJvbWlzZS5yYWNlKCkg44Go5ZCM562JXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KC4uLmRlZmVycmVkczogUHJvbWlzZTxUPltdKTogSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4oLi4uZGVmZXJyZWRzOiBKUXVlcnlHZW5lcmljUHJvbWlzZTxUPltdKTogSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4oLi4uZGVmZXJyZWRzOiBUW10pOiBJUHJvbWlzZUJhc2U8VD47XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmFjZTxUPiguLi5kZWZlcnJlZHM6IGFueVtdKTogSVByb21pc2VCYXNlPFQ+IHtcclxuICAgICAgICBjb25zdCBkZiA9ICQuRGVmZXJyZWQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgX2RlZmVycmVkczogSlF1ZXJ5UHJvbWlzZTxUPltdID0gW10uY29uY2F0LmFwcGx5KFtdLCBkZWZlcnJlZHMpO1xyXG4gICAgICAgIF9kZWZlcnJlZHMuZm9yRWFjaCgoZGVmZXJyZWQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGRlZmVycmVkXHJcbiAgICAgICAgICAgICAgICAudGhlbigoLi4uYXJnczogYW55W10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJwZW5kaW5nXCIgPT09IGRmLnN0YXRlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVzb2x2ZShhcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAoLi4uYXJnczogYW55W10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJwZW5kaW5nXCIgPT09IGRmLnN0YXRlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gPGFueT5kZi5wcm9taXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgY2xhc3MgcHJvdmlkZXMgdGhlIG9wZXJhdGlvbiBmb3IgbXVsdGlwbGUgW1tJUHJvbWlzZV1dIG9iamVjdC5cclxuICAgICAqIEBqYSDopIfmlbDjga4gW1tJUHJvbWlzZV1dIOOCkuS4gOaLrOeuoeeQhuOBmeOCi+OCr+ODqeOCuVxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlIDxicj5cclxuICAgICAqXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogIGxldCBfcHJtc01hbmFnZXIgPSBuZXcgUHJvbWlzZU1hbmFnZXIoKTtcclxuICAgICAqXHJcbiAgICAgKiAgZnVuY3Rpb24gcHJvY0NhbGxlcigpOiB2b2lkIHtcclxuICAgICAqICAgICAgLy8gYWRkIHBhcmFsbGVsIG9wZXJhdGlvbnMgdW5kZXIgdGhlIG1hbmFnZW1lbnQuXHJcbiAgICAgKiAgICAgIF9wcm1zTWFuYWdlci5hZGQoYXN5bmMxKTtcclxuICAgICAqICAgICAgX3BybXNNYW5hZ2VyLmFkZChhc3luYzIpO1xyXG4gICAgICogICAgICBfcHJtc01hbmFnZXIuYWRkKGFzeW5jMyk7XHJcbiAgICAgKiAgfVxyXG4gICAgICpcclxuICAgICAqICBmdW5jdGlvbiBhbGxDYW5jZWwoKTogdm9pZCB7XHJcbiAgICAgKiAgICAgIC8vIGp1c3Qgb25lIGNhbGwuIGFsbCBwYXJhbGxlbCBvcHMgYXJlIGNhbmNlbGVkLlxyXG4gICAgICogICAgICBfcHJtc01hbmFnZXIuY2FuY2VsKCk7XHJcbiAgICAgKiAgfVxyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQcm9taXNlTWFuYWdlciB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3Bvb2w6IHsgcHJvbWlzZTogSVByb21pc2U8YW55PjsgaWQ6IG51bWJlcjsgfVtdID0gW107XHJcbiAgICAgICAgcHJpdmF0ZSBfaWQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gYWRkIFByb21pc2Ugb2JqZWN0IHRoYXQgaGFzIGFib3J0KCkgbWV0aG9kLlxyXG4gICAgICAgICAqIEBqYSBhYm9ydCgpIOOCkuaMgeOBpCBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOCkueuoeeQhuS4i+OBq+i/veWKoFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBhZGQ8VD4ocHJvbWlzZTogSVByb21pc2U8VD4gfCBKUXVlcnlYSFIpOiBJUHJvbWlzZTxUPiB7XHJcbiAgICAgICAgICAgIGlmIChwcm9taXNlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBhYm9ydCgpIOOCkuaMgeOBo+OBpuOBhOOBquOBhOWgtOWQiOOBr+OCqOODqeODvFxyXG4gICAgICAgICAgICBpZiAoIXByb21pc2UuYWJvcnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJbYWRkXSBwcm9taXNlIG9iamVjdCBkb2Vzbid0IGhhdmUgJ2Fib3J0KCknIG1ldGhvZC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gPGFueT5wcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb29raWUgPSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlOiA8YW55PnByb21pc2UsXHJcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5faWQrKyxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Bvb2wucHVzaChjb29raWUpO1xyXG5cclxuICAgICAgICAgICAgKDxhbnk+cHJvbWlzZSlcclxuICAgICAgICAgICAgICAgIC5hbHdheXMoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Bvb2wgPSB0aGlzLl9wb29sLmZpbHRlcigoZWxlbWVudDogeyBwcm9taXNlOiBJUHJvbWlzZTxhbnk+OyBpZDogbnVtYmVyOyB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmlkICE9PSBjb29raWUuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8YW55PnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gY2FsbCBhYm9ydCgpIHRvIHVuZGVyIHRoZSBtYW5hZ2VtZW50IFByb21pc2VzLlxyXG4gICAgICAgICAqIEBqYSDnrqHnkIblr77osaHjga4gUHJvbWlzZSDjgavlr77jgZfjgaYgYWJvcnQg44KS55m66KGMXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gaW5mb1xyXG4gICAgICAgICAqICAtIGBlbmAgYWJvcnQoKSBhcmd1bWVudFxyXG4gICAgICAgICAqICAtIGBqYWAgYWJvcnQoKSDjgavmuKHjgZXjgozjgovlvJXmlbBcclxuICAgICAgICAgKiBAcmV0dXJuc1xyXG4gICAgICAgICAqICAtIGBlbmAgVGhlIGNhbmNlbGxhdGlvbiB0byBjYW5jZWwgcHJvY2Vzc2luZyBpcyBwcm9oaWJpdGVkLlxyXG4gICAgICAgICAqICAtIGBqYWAg44Kt44Oj44Oz44K744Or5Yem55CG44Gr5a++44GZ44KL44Kt44Oj44Oz44K744Or44Gv5LiN5Y+vXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNhbmNlbChpbmZvPzogb2JqZWN0KTogSVByb21pc2VCYXNlPGFueT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9taXNlcyA9IHRoaXMucHJvbWlzZXMoKTtcclxuICAgICAgICAgICAgcHJvbWlzZXMuZm9yRWFjaCgoZWxlbWVudDogSVByb21pc2U8YW55PikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuYWJvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFib3J0KGluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHdhaXQuYXBwbHkobnVsbCwgcHJvbWlzZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGVuIGdldCBQcm9taXNlIG9iamVjdHMgYXMgYXJyYXkuIDxicj5cclxuICAgICAgICAgKiAgICAgb25seSBwZW5kaW5nIHN0YXRlIG9iamVjdCBhcmUgcmV0dXJuZWQuXHJcbiAgICAgICAgICogQGphIOeuoeeQhuWvvuixoeOBriBQcm9taXNlIOOCkumFjeWIl+OBp+WPluW+lyA8YnI+XHJcbiAgICAgICAgICogICAgIHBlbmRpbmcg54q25oWL44Gu44Kq44OW44K444Kn44Kv44OI44Gu44G/44GM6L+U44KLLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBwcm9taXNlcygpOiBJUHJvbWlzZTxhbnk+W10ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcG9vbC5tYXAoKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnByb21pc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENhbmNlbGFibGUgUHJvbWlzZSBjbGFzcyBmb3IgRVMyMDE1IFByb21paXNlIGNvbXBhdGlibGUuXHJcbiAgICAgKiBAamEgRVMyMDE1IFByb21pc2Ug5LqS5o+b44Gu44Kt44Oj44Oz44K744Or5Y+v6IO944GqIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQcm9taXNlQ29uc3RydWN0b3I8VD4gaW1wbGVtZW50cyBJUHJvbWlzZTxUPiB7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gbWl4aW46IG5hdGl2ZSBQcm9taXNlXHJcblxyXG4gICAgICAgIHRoZW46IDxUUmVzdWx0MSA9IFQsIFRSZXN1bHQyID0gbmV2ZXI+KFxyXG4gICAgICAgICAgICBvbmZ1bGZpbGxlZD86IChcclxuICAgICAgICAgICAgICAgICh2YWx1ZTogVCkgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT5cclxuICAgICAgICAgICAgKSB8IHVuZGVmaW5lZCB8IG51bGwsXHJcbiAgICAgICAgICAgIG9ucmVqZWN0ZWQ/OiAoXHJcbiAgICAgICAgICAgICAgICAocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+XHJcbiAgICAgICAgICAgICkgfCB1bmRlZmluZWQgfCBudWxsXHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPjtcclxuXHJcbiAgICAgICAgY2F0Y2g6IDxUUmVzdWx0ID0gbmV2ZXI+KFxyXG4gICAgICAgICAgICBvbnJlamVjdGVkPzogKChyZWFzb246IGFueSkgPT4gVFJlc3VsdCB8IFByb21pc2VMaWtlPFRSZXN1bHQ+KSB8IHVuZGVmaW5lZCB8IG51bGxcclxuICAgICAgICApID0+IElQcm9taXNlQmFzZTxUUmVzdWx0PjtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBtaXhpbjogSlF1ZXJ5UHJvbWlzZVxyXG5cclxuICAgICAgICBzdGF0ZTogKCkgPT4gc3RyaW5nO1xyXG4gICAgICAgIGFsd2F5czogKFxyXG4gICAgICAgICAgICBhbHdheXNDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10sXHJcbiAgICAgICAgICAgIC4uLmFsd2F5c0NhbGxiYWNrc046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG4gICAgICAgIGRvbmU6IChcclxuICAgICAgICAgICAgZG9uZUNhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxUPiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxUPltdLFxyXG4gICAgICAgICAgICAuLi5kb25lQ2FsbGJhY2tOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG4gICAgICAgIGZhaWw6IChcclxuICAgICAgICAgICAgZmFpbENhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4uZmFpbENhbGxiYWNrc046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG4gICAgICAgIHByb2dyZXNzOiAoXHJcbiAgICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdLFxyXG4gICAgICAgICAgICAuLi5wcm9ncmVzc0NhbGxiYWNrTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdPlxyXG4gICAgICAgICkgPT4gSVByb21pc2U8VD47XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gbWl4aW46IEpRdWVyeURlZmVycmVkXHJcblxyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSAqL1xyXG4gICAgICAgIHByaXZhdGUgbm90aWZ5OiAodmFsdWU/OiBhbnksIC4uLmFyZ3M6IGFueVtdKSA9PiBKUXVlcnlEZWZlcnJlZDxUPjtcclxuICAgICAgICBwcml2YXRlIG5vdGlmeVdpdGg6IChjb250ZXh0OiBhbnksIHZhbHVlPzogYW55W10pID0+IEpRdWVyeURlZmVycmVkPFQ+O1xyXG4gICAgICAgIHByaXZhdGUgcmVqZWN0OiAodmFsdWU/OiBhbnksIC4uLmFyZ3M6IGFueVtdKSA9PiBKUXVlcnlEZWZlcnJlZDxUPjtcclxuICAgICAgICBwcml2YXRlIHJlamVjdFdpdGg6IChjb250ZXh0OiBhbnksIHZhbHVlPzogYW55W10pID0+IEpRdWVyeURlZmVycmVkPFQ+O1xyXG4gICAgICAgIHByaXZhdGUgcmVzb2x2ZTogKHZhbHVlPzogVCwgLi4uYXJnczogYW55W10pID0+IEpRdWVyeURlZmVycmVkPFQ+O1xyXG4gICAgICAgIHByaXZhdGUgcmVzb2x2ZVdpdGg6IChjb250ZXh0OiBhbnksIHZhbHVlPzogVFtdKSA9PiBKUXVlcnlEZWZlcnJlZDxUPjtcclxuICAgICAgICAvKiB0c2xpbnQ6ZW5hYmxlOm5vLXVudXNlZC12YXJpYWJsZSAqL1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIG1peGluOiBJUHJvaW1pc2VcclxuXHJcbiAgICAgICAgYWJvcnQ6IChpbmZvPzogYW55KSA9PiB2b2lkO1xyXG4gICAgICAgIGRlcGVuZE9uOiA8VT4ocHJvbWlzZTogSVByb21pc2U8VT4gfCBKUXVlcnlYSFIpID0+IElQcm9taXNlPFU+O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZXhhbXBsZSA8YnI+XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBgYGB0c1xyXG4gICAgICAgICAqICAvLyBvdmVycmlkZSBnbG9iYWwgXCJQcm9taXNlXCIgZm9yIHVzaW5nIENhbmNlbGFibGUgUHJvbWlzZSBpbiB0aGlzIG1vZHVsZSBzY29wZS5cclxuICAgICAgICAgKiAgaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gXCJjZHBcIjtcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqICBmdW5jdGlvbiAoKTogSVByb21pc2U8U29tZURhdGE+ID0+IHtcclxuICAgICAgICAgKiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0LCBkZXBlbmRPbikgPT4ge1xyXG4gICAgICAgICAqICAgICAgICAgIC8vIGFzeW5jMSgpLCBhc3luYzIoKSBhcmUgYXN5bmMgZnVuY3Rpb24gYW5kIHJldHVybmVkIElQcm9taXNlIGluc3RhbmNlLlxyXG4gICAgICAgICAqICAgICAgICAgIGRlcGVuZE9uKGFzeW5jMSgpKVxyXG4gICAgICAgICAqICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICogICAgICAgICAgICAgICAgICByZXR1cm4gZGVwZW5kT24oYXN5bmMyKCkpO1xyXG4gICAgICAgICAqICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAqICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICogICAgICAgICAgICAgICAgICByZXNvbHZlKHsgc29tZWRhdGE6IFwiaG9nZVwiIH0pO1xyXG4gICAgICAgICAqICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAqICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICogICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAqICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgKiAgICAgICAgICB9KTtcclxuICAgICAgICAgKiAgICAgIH07XHJcbiAgICAgICAgICogIH1cclxuICAgICAgICAgKiBgYGBcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBleGVjdXRvclxyXG4gICAgICAgICAqICAtIGBlbmAgRVMyMDE1IFByb21pc2UgZXhlY3V0ZXIgY29tcGF0aWJsZSB3aXRoIGBkZXBlbmRPbmAgM3JkIGFyZy5cclxuICAgICAgICAgKiAgLSBgamFgIEVTNiBQcm9taXNlIOS6kuaPm+W8leaVsC4gKGRlcGVuZE9uIOOCkuesrDPlvJXmlbDjgavmuKHjgZkpXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnNcclxuICAgICAgICAgKiAgLSBgZW5gIHNldCB0aGUgZXh0ZW5kIG9iamVjdCBvciBjYW5jZWwgY2FsbGJhY2sgZnVuY3Rpb24uXHJcbiAgICAgICAgICogIC0gYGphYCBqUXVlcnlQcm9taXNlIOOCkuaLoeW8teOBmeOCi+OCquODluOCuOOCp+OCr+ODiCBvciDjgq3jg6Pjg7Pjgrvjg6vmmYLjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgZXhlY3V0b3I6IChcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6ICh2YWx1ZT86IFQgfCBQcm9taXNlTGlrZTxUPiwgLi4uYWRkaXRpb25hbDogYW55W10pID0+IHZvaWQsXHJcbiAgICAgICAgICAgICAgICByZWplY3Q/OiAocmVhc29uPzogYW55LCAuLi5hZGRpdGlvbmFsOiBhbnlbXSkgPT4gdm9pZCxcclxuICAgICAgICAgICAgICAgIGRlcGVuZE9uPzogPFU+KHByb21pc2U6IElQcm9taXNlPFU+IHwgSlF1ZXJ5WEhSKSA9PiBJUHJvbWlzZTxVPixcclxuICAgICAgICAgICAgKSA9PiB2b2lkLFxyXG4gICAgICAgICAgICBvcHRpb25zPzogTWFrZVByb21pc2VPcHRpb25zIHwgY2FuY2VsQ2FsbGJhY2tcclxuICAgICAgICApIHtcclxuICAgICAgICAgICAgLy8gYXBwbHkgbWl4aW5cclxuICAgICAgICAgICAgY29uc3QgY2FuY2VsYWJsZSA9IG1ha2VDYW5jZWxhYmxlKCQuRGVmZXJyZWQoKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIHRoaXMsIGNhbmNlbGFibGUuZGYsIGNhbmNlbGFibGUudGFyZ2V0KTtcclxuICAgICAgICAgICAgdGhpcy5hYm9ydCA9IGNhbmNlbGFibGUuYWJvcnQuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5kZXBlbmRPbiA9IGNhbmNlbGFibGUuZGVwZW5kT24uYmluZCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIGV4ZWN1dG9yKHRoaXMucmVzb2x2ZSwgdGhpcy5yZWplY3QsIHRoaXMuZGVwZW5kT24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBzdGF0aWMgbWV0aG9kczpcclxuXHJcbiAgICAgICAgc3RhdGljIHJlc29sdmU8VT4odmFsdWU/OiBVIHwgUHJvbWlzZUxpa2U8VT4pOiBJUHJvbWlzZTxVPiB7XHJcbiAgICAgICAgICAgIHJldHVybiA8YW55PiQuRGVmZXJyZWQoKS5yZXNvbHZlKHZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyByZWplY3Q8VT4ocmVhc29uPzogYW55KTogSVByb21pc2U8VT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gPGFueT4kLkRlZmVycmVkKCkucmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgYWxsPFU+KC4uLmRlZmVycmVkczogQXJyYXk8VSB8IElQcm9taXNlPFU+IHwgSlF1ZXJ5UHJvbWlzZTxVPj4pOiBJUHJvbWlzZUJhc2U8VT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gPGFueT4kLndoZW4uYXBwbHkodGhpcywgW10uY29uY2F0LmFwcGx5KFtdLCBkZWZlcnJlZHMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN0YXRpYyB3YWl0PFU+KC4uLmRlZmVycmVkczogQXJyYXk8VSB8IElQcm9taXNlPFU+IHwgSlF1ZXJ5UHJvbWlzZTxVPj4pOiBJUHJvbWlzZUJhc2U8VT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gPGFueT53YWl0KFtdLmNvbmNhdC5hcHBseShbXSwgZGVmZXJyZWRzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgcmFjZTxVPiguLi5kZWZlcnJlZHM6IEFycmF5PFUgfCBJUHJvbWlzZTxVPiB8IEpRdWVyeVByb21pc2U8VT4+KTogSVByb21pc2VCYXNlPFU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+cmFjZShbXS5jb25jYXQuYXBwbHkoW10sIGRlZmVycmVkcykpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY29uc3QgUHJvbWlzZSA9IFByb21pc2VDb25zdHJ1Y3RvcjtcclxufVxyXG5cclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwiY2RwLnByb21pc2VcIiB7XHJcbiAgICBleHBvcnQgPSBDRFA7XHJcbn1cclxuIl19