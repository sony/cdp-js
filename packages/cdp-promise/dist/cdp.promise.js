/*!
 * cdp.promise.js 2.1.0
 *
 * Date: 2018-04-23T06:40:48.143Z
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QXZELFVBQXVELEVBQXZELHFCQUF1RCxFQUF2RCxJQUF1RDtnQkFBdkQsOEJBQXVEOztZQUNsRSxPQUFZLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBRU0sdUJBQUksR0FBWDtZQUFlLG1CQUF1RDtpQkFBdkQsVUFBdUQsRUFBdkQscUJBQXVELEVBQXZELElBQXVEO2dCQUF2RCw4QkFBdUQ7O1lBQ2xFLE9BQVksSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3JELENBQUM7UUFDTCx5QkFBQztJQUFELENBQUM7SUFoSVksc0JBQWtCLHFCQWdJOUI7SUFFWSxXQUFPLEdBQUcsa0JBQWtCLENBQUM7QUFDOUMsQ0FBQyxFQXpsQlMsR0FBRyxLQUFILEdBQUcsUUF5bEJaIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgY29uc3QgVEFHOiBzdHJpbmcgPSBcIltDRFAuUHJvbWlzZV0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRXh0ZW5kIGludGVyZmFjZSBvZiBOYXRpdmUgUHJvbWlzZSBkZWZpbml0aW9uPGJyPlxyXG4gICAgICogICAgIFdoZW4geW91IGRvbid0IHdhbnQgdG8gcHJvdmlkZSB0aGUgY2FuY2VsIG9wZXJhdGlvbiBidXQgeW91J2QgbGlrZSB0byB1c2UgalF1ZXJ5IHV0aWxpdHksIHRoaXMgaW50ZXJmYWNlIGlzIHVzZWZ1bC5cclxuICAgICAqIEBqYSBOYXRpdmUgUHJvbWlzZSDmi6HlvLXjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnlrprnvqk8YnI+XHJcbiAgICAgKiAgICAg44Kt44Oj44Oz44K744Or44GV44Gb44Gf44GP44Gq44GE44GMIGFsd2F5cygpIOOBquOBqSBqUXVlcnkgbWV0aG9kIOOCkuaPkOS+m+OBl+OBn+OBhOWgtOWQiOOBq+S9v+eUqOOBmeOCiy48YnI+XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVByb21pc2VCYXNlPFQ+IGV4dGVuZHMgUHJvbWlzZTxUPiB7XHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBQcm9taXNlIGV4dGVuZHM6XHJcblxyXG4gICAgICAgIHRoZW48VFJlc3VsdDEgPSBULCBUUmVzdWx0MiA9IG5ldmVyPihcclxuICAgICAgICAgICAgb25mdWxmaWxsZWQ/OiAoXHJcbiAgICAgICAgICAgICAgICAodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+XHJcbiAgICAgICAgICAgICkgfCB1bmRlZmluZWQgfCBudWxsLFxyXG4gICAgICAgICAgICBvbnJlamVjdGVkPzogKFxyXG4gICAgICAgICAgICAgICAgKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPlxyXG4gICAgICAgICAgICApIHwgdW5kZWZpbmVkIHwgbnVsbFxyXG4gICAgICAgICk6IElQcm9taXNlQmFzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPjtcclxuXHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSlF1ZXJ5UHJvbWlzZSBzdHVmZjpcclxuXHJcbiAgICAgICAgc3RhdGU6ICgpID0+IHN0cmluZztcclxuICAgICAgICBhbHdheXM6IChcclxuICAgICAgICAgICAgYWx3YXlzQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdLFxyXG4gICAgICAgICAgICAuLi5hbHdheXNDYWxsYmFja3NOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZUJhc2U8VD47XHJcbiAgICAgICAgZG9uZTogKFxyXG4gICAgICAgICAgICBkb25lQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+W10sXHJcbiAgICAgICAgICAgIC4uLmRvbmVDYWxsYmFja046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxUPiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxUPltdPlxyXG4gICAgICAgICkgPT4gSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgICAgIGZhaWw6IChcclxuICAgICAgICAgICAgZmFpbENhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4uZmFpbENhbGxiYWNrc046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlQmFzZTxUPjtcclxuICAgICAgICBwcm9ncmVzczogKFxyXG4gICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4ucHJvZ3Jlc3NDYWxsYmFja046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlQmFzZTxUPjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlcyBDYW5jZWxhYmxlIFByb21pc2Ugb2JqZWN0IGludGVyZmFjZSBkZWZpbml0aW9uXHJcbiAgICAgKiBAamEg44Kt44Oj44Oz44K744Or5Y+v6IO944GqIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44Gu44Kk44Oz44K/44O844OV44Kn44Kk44K55a6a576pXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVByb21pc2U8VD4gZXh0ZW5kcyBJUHJvbWlzZUJhc2U8VD4ge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBjYW5jZWwgb3BlcmF0aW9uXHJcbiAgICAgICAgICogQGphIOOCreODo+ODs+OCu+ODq+WHpueQhlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGluZm9cclxuICAgICAgICAgKiAgLSBgZW5gIHJlamVjdCgpIGFyZ3VtZW50XHJcbiAgICAgICAgICogIC0gYGphYCByZWplY3QoKSDjga7lvJXmlbBcclxuICAgICAgICAgKi9cclxuICAgICAgICBhYm9ydChpbmZvPzogb2JqZWN0KTogdm9pZDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gUHJvbWlzZSBvYmplY3Qgd2hpY2ggZG9lcyBhc3luY2hyb25vdXMgcHJvY2Vzc2luZyBvbiB3aGljaCB0aGlzIG9iamVjdCBkZXBlbmRzLlxyXG4gICAgICAgICAqIEBqYSDkvp3lrZjjgZnjgovpnZ7lkIzmnJ/lh6bnkIbjgpLooYzjgYYgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBkZXBlbmRlbmN5PzogSVByb21pc2U8YW55PjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gSWYgdGhlIHZhbHVlIHNldCB0byB0cnVlLCB0aGUgc3lzdGVtIGZvdXJjZSBjYWxsIHJlamVjdCgpIHdoZW4gYWJvcnQoKSBpcyBjYWxsZWQgZnJvbSBvdXRzaWRlLiA8YnI+XHJcbiAgICAgICAgICogICAgIFRoaXMgc2V0dGluZyBpcyB1c3VhbGx5IHVubmVjZXNzYXJ5LlxyXG4gICAgICAgICAqIEBqYSBhYm9ydCgpIOOCs+ODvOODq+aZguOBq+iHqui6q+OBriByZWplY3QoKSDjgoLjgrPjg7zjg6vjgZnjgovloLTlkIggdHJ1ZSDjgpLmjIflrpogPGJyPlxyXG4gICAgICAgICAqICAgICDpgJrluLjmjIflrprjga/kuI3opoFcclxuICAgICAgICAgKi9cclxuICAgICAgICBjYWxsUmVqZWN0PzogYm9vbGVhbjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gc2V0IElQcm9taXNlIHdoaWNoIHRoaXMgb2JqZWN0IGRlcGVuZHMuXHJcbiAgICAgICAgICogQGphIOS+neWtmOOBmeOCiyBJUHJvbWlzZSDjgpLoqK3lrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBzZWUgW1ttYWtlUHJvbWlzZV1dKCkgZXhhbXBsZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBkZXBlbmRPbjxVPihwcm9taXNlOiBJUHJvbWlzZTxVPiB8IEpRdWVyeVhIUik6IElQcm9taXNlPFU+O1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIFByb21pc2UgZXh0ZW5kczpcclxuXHJcbiAgICAgICAgdGhlbjxUUmVzdWx0MSA9IFQsIFRSZXN1bHQyID0gbmV2ZXI+KFxyXG4gICAgICAgICAgICBvbmZ1bGZpbGxlZD86IChcclxuICAgICAgICAgICAgICAgICh2YWx1ZTogVCkgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT5cclxuICAgICAgICAgICAgKSB8IHVuZGVmaW5lZCB8IG51bGwsXHJcbiAgICAgICAgICAgIG9ucmVqZWN0ZWQ/OiAoXHJcbiAgICAgICAgICAgICAgICAocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+XHJcbiAgICAgICAgICAgICkgfCB1bmRlZmluZWQgfCBudWxsXHJcbiAgICAgICAgKTogSVByb21pc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj47XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSlF1ZXJ5UHJvbWlzZSBzdHVmZjpcclxuXHJcbiAgICAgICAgc3RhdGU6ICgpID0+IHN0cmluZztcclxuICAgICAgICBhbHdheXM6IChcclxuICAgICAgICAgICAgYWx3YXlzQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdLFxyXG4gICAgICAgICAgICAuLi5hbHdheXNDYWxsYmFja3NOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgICAgICBkb25lOiAoXHJcbiAgICAgICAgICAgIGRvbmVDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD5bXSxcclxuICAgICAgICAgICAgLi4uZG9uZUNhbGxiYWNrTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgICAgICBmYWlsOiAoXHJcbiAgICAgICAgICAgIGZhaWxDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10sXHJcbiAgICAgICAgICAgIC4uLmZhaWxDYWxsYmFja3NOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgICAgICBwcm9ncmVzczogKFxyXG4gICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4ucHJvZ3Jlc3NDYWxsYmFja046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gYWxpYXMgb2YgY2FuY2VsIGNhbGxiYWNrIGZvciBbW21ha2VQcm9taXNlXV0gYXJndW1lbnQuXHJcbiAgICAgKiBAamEgW1ttYWtlUHJvbWlzZV1dIOOBq+aMh+WumuWPr+iDveOBqiBjYW5jZWwgY2FsbGJhY2sg44GuIGFsaWFzLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdHlwZSBjYW5jZWxDYWxsYmFjayA9IChkZXRhaWw/OiBvYmplY3QpID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtYWtlUHJvbWlzZSBvcHRpb25zXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTWFrZVByb21pc2VPcHRpb25zIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gZGVwZW5kZW50IHByb21pc2Ugb2JqZWN0LlxyXG4gICAgICAgICAqIEBqYSDkvp3lrZjjgZnjgosgcHJvbWlzZSDjgpLoqK3lrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBkZXBlbmRlbmN5PzogSVByb21pc2U8YW55PjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gSWYgdGhlIHZhbHVlIHNldCB0byB0cnVlLCB0aGUgc3lzdGVtIGZvdXJjZSBjYWxsIHJlamVjdCgpIHdoZW4gYWJvcnQoKSBpcyBjYWxsZWQgZnJvbSBvdXRzaWRlLiA8YnI+XHJcbiAgICAgICAgICogICAgIFRoaXMgc2V0dGluZyBpcyB1c3VhbGx5IHVubmVjZXNzYXJ5LlxyXG4gICAgICAgICAqIEBqYSBhYm9ydCgpIOOCs+ODvOODq+aZguOBq+iHqui6q+OBriByZWplY3QoKSDjgoLjgrPjg7zjg6vjgZnjgovloLTlkIggdHJ1ZSDjgpLmjIflrpogPGJyPlxyXG4gICAgICAgICAqICAgICDpgJrluLjmjIflrprjga/kuI3opoFcclxuICAgICAgICAgKi9cclxuICAgICAgICBjYWxsUmVqZWN0PzogYm9vbGVhbjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gdGhlIGZ1bmN0aW9uIGNhbGxlZCB3aGVuIGFib3J0KCkgY2FsbGluZy5cclxuICAgICAgICAgKiBAamEg44Kt44Oj44Oz44K744Or5pmC44Gr5ZG844Gw44KM44KL6Zai5pWwXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY2FuY2VsQ2FsbGJhY2s/OiBjYW5jZWxDYWxsYmFjaztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gZXh0ZW5kcyBwYXJhbWV0ZXJzLiBqUXVlcnkuRGVmZXJyZWQucHJvbWlzZSgpIGFyZ3VtZW50LlxyXG4gICAgICAgICAqIEBqYSDmi6HlvLXjg5Hjg6njg6Hjg7zjgr8uIGpRdWVyeS5EZWZlcnJlZC5wcm9taXNlKCkg44Gr5rih44GV44KM44KLLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENhbmNlbCDlj6/og73jgqrjg5bjgrjjgqfjgq/jg4jjga7kvZzmiJBcclxuICAgICAqXHJcbiAgICAgKiBAaW50ZXJuYWwgPGJyPlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZiBqUXVlcnlEZWZlcnJlZCBpbnN0YW5jZSDjgpLmjIflrppcclxuICAgICAqIEBwYXJhbSBvcHRpb25zIGpRdWVyeVByb21pc2Ug44KS5ouh5by144GZ44KL44Kq44OW44K444Kn44Kv44OIIG9yIOOCreODo+ODs+OCu+ODq+aZguOBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCkuaMh+WumlxyXG4gICAgICogQHJldHVybnMgQ2FuY2VsYWJsZSBwcm9wZXJ0eVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtYWtlQ2FuY2VsYWJsZTxUPihcclxuICAgICAgICBkZjogSlF1ZXJ5RGVmZXJyZWQ8VD4sXHJcbiAgICAgICAgb3B0aW9ucz86IE1ha2VQcm9taXNlT3B0aW9ucyB8IGNhbmNlbENhbGxiYWNrXHJcbiAgICApOiB7IGRmOiBKUXVlcnlEZWZlcnJlZDxUPiwgdGFyZ2V0OiBvYmplY3Q7IGFib3J0OiAoaW5mbz86IGFueSkgPT4gdm9pZDsgZGVwZW5kT246IChwcm9taXNlOiBhbnkpID0+IEpRdWVyeVByb21pc2U8YW55PiB9IHtcclxuICAgICAgICBsZXQgZXh0ZW5kT3B0aW9uczogTWFrZVByb21pc2VPcHRpb25zO1xyXG4gICAgICAgIGxldCBjYW5jZWw6IGNhbmNlbENhbGxiYWNrO1xyXG5cclxuICAgICAgICBpZiAoXCJmdW5jdGlvblwiID09PSB0eXBlb2Ygb3B0aW9ucykge1xyXG4gICAgICAgICAgICBjYW5jZWwgPSA8Y2FuY2VsQ2FsbGJhY2s+b3B0aW9ucztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBleHRlbmRPcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICAgICAgaWYgKGV4dGVuZE9wdGlvbnMgJiYgZXh0ZW5kT3B0aW9ucy5jYW5jZWxDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgY2FuY2VsID0gZXh0ZW5kT3B0aW9ucy5jYW5jZWxDYWxsYmFjaztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNhbmNlbCA9ICgpID0+IHsgLyogbm9vcCAqLyB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBfYWJvcnQgPSBmdW5jdGlvbiAoaW5mbz86IG9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbE1lc3NhZ2UgPSAoaW5mbyAmJiAoPGFueT5pbmZvKS5tZXNzYWdlKSA/ICg8YW55PmluZm8pLm1lc3NhZ2UgOiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGluZm8gPyAkLmV4dGVuZCh7fSwgaW5mbywgeyBtZXNzYWdlOiBcImFib3J0XCIsIG9yaWdpbmFsTWVzc2FnZTogb3JpZ2luYWxNZXNzYWdlIH0pIDogeyBtZXNzYWdlOiBcImFib3J0XCIgfTtcclxuICAgICAgICAgICAgY2FuY2VsKGRldGFpbCk7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuZGVwZW5kZW5jeSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW5jeS5hYm9ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jeS5hYm9ydChkZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiW2NhbGxdIGRlcGVuZGVuY3kgb2JqZWN0IGRvZXNuJ3QgaGF2ZSAnYWJvcnQoKScgbWV0aG9kLlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNhbGxSZWplY3QgJiYgXCJwZW5kaW5nXCIgPT09IHRoaXMuc3RhdGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChkZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFwicGVuZGluZ1wiID09PSB0aGlzLnN0YXRlKCkpIHtcclxuICAgICAgICAgICAgICAgIGRmLnJlamVjdChkZXRhaWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2RlcGVuZE9uID0gZnVuY3Rpb24gKHByb21pc2U6IGFueSk6IEpRdWVyeVByb21pc2U8YW55PiB7XHJcbiAgICAgICAgICAgIGlmIChwcm9taXNlLmFib3J0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlcGVuZGVuY3kgPSBwcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgICAgIC5hbHdheXMoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlcGVuZGVuY3kgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcIltzZXRdIGRlcGVuZGVuY3kgb2JqZWN0IGRvZXNuJ3QgaGF2ZSAnYWJvcnQoKScgbWV0aG9kLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfdGFyZ2V0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgZGVwZW5kZW5jeTogbnVsbCxcclxuICAgICAgICAgICAgY2FsbFJlamVjdDogZmFsc2UsXHJcbiAgICAgICAgfSwgZXh0ZW5kT3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRmOiBkZixcclxuICAgICAgICAgICAgdGFyZ2V0OiBfdGFyZ2V0LFxyXG4gICAgICAgICAgICBhYm9ydDogX2Fib3J0LFxyXG4gICAgICAgICAgICBkZXBlbmRPbjogX2RlcGVuZE9uLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gbWFrZSBbW0lQcm9taXNlXV0gb2JqZWN0LlxyXG4gICAgICogQGphIFtbSVByb21pc2VdXSDjgqrjg5bjgrjjgqfjgq/jg4jjga7kvZzmiJBcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZSA8YnI+XHJcbiAgICAgKlxyXG4gICAgICogYGBgdHNcclxuICAgICAqICAvLyBwaXBlIGxpbmUgb3BlcmF0aW9uXHJcbiAgICAgKiAgZnVuY3Rpb24gcHJvY1BpcGVsaW5lKCk6IElQcm9taXNlPFNvbWVEYXRhPiB7XHJcbiAgICAgKiAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZCgpOyAgICAgICAgICAgIC8vIGNyZWF0ZSBqUXVlcnlEZWZlcnJlZCBpbnN0YW5jZS5cclxuICAgICAqICAgICAgY29uc3QgcHJvbWlzZSA9IG1ha2VQcm9taXNlKGRmKTsgICAgLy8gY3JlYXRlIElQcm9taXNlIGluc3RhbmNlLlxyXG4gICAgICpcclxuICAgICAqICAgICAgLy8gYXN5bmMxKCksIGFzeW5jMigpLCBhc3luYzMoKSBhcmUgYXN5bmMgZnVuY3Rpb24gYW5kIHJldHVybmVkIElQcm9taXNlIGluc3RhbmNlLlxyXG4gICAgICogICAgICBwcm9tc2llLmRlcGVuZE9uKGFzeW5jMSgpKVxyXG4gICAgICogICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICogICAgICAgICAgICAgIHJldHVybiBwcm9tc2llLmRlcGVuZE9uKGFzeW5jMigpKTtcclxuICAgICAqICAgICAgICAgIH0pXHJcbiAgICAgKiAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgKiAgICAgICAgICAgICAgcmV0dXJuIHByb21zaWUuZGVwZW5kT24oYXN5bmMzKCkpO1xyXG4gICAgICogICAgICAgICAgfSlcclxuICAgICAqICAgICAgICAgIC5kb25lKCgpID0+IHtcclxuICAgICAqICAgICAgICAgICAgICBkZi5yZXNvbHZlKHsgc29tZWRhdGE6IFwiaG9nZVwiIH0pO1xyXG4gICAgICogICAgICAgICAgfSlcclxuICAgICAqICAgICAgICAgIC5mYWlsKChlcnJvcikgPT4ge1xyXG4gICAgICogICAgICAgICAgICAgIGRmLnJlamVjdChlcnJvcik7XHJcbiAgICAgKiAgICAgICAgICB9KTtcclxuICAgICAqXHJcbiAgICAgKiAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICogIH1cclxuICAgICAqXHJcbiAgICAgKiAgLy8gY2xpZW50IG9mIHBpcGUgbGluZSBvcGVyYXRpb25cclxuICAgICAqICBmdW5jdGlvbiBwcm9jQ2FsbGVyKCk6IHZvaWQge1xyXG4gICAgICogICAgICBjb25zdCBwcm9taXNlID0gcHJvY1BpcGVsaW5lKCk7XHJcbiAgICAgKiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICogICAgICAgICAgcHJvbWlzZS5hYm9ydCgpOyAvLyBUaGUgd2hvbGUgY2FuY2VsbGF0aW9uIGlzIHBvc3NpYmxlIGJ5IG9wdGlvbmFsIHRpbWluZy5cclxuICAgICAqICAgICAgICAgIC8vIEluIHdoaWNoZXZlciBwcm9jZXNzaW5nIG9mIGFzeW5jMSgpLCBhc3luYzIoKSBvciBhc3luYzMoKSxcclxuICAgICAqICAgICAgICAgIC8vIGl0IGNhbiBiZSBjYW5jZWxlZCBhcHByb3ByaWF0ZWx5LlxyXG4gICAgICogICAgICB9KTtcclxuICAgICAqICB9XHJcbiAgICAgKlxyXG4gICAgICogYGBgXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRmXHJcbiAgICAgKiAgLSBgZW5gIHNldCB0aGUgalF1ZXJ5RGVmZXJyZWQgaW5zdGFuY2UuXHJcbiAgICAgKiAgLSBgamFgIGpRdWVyeURlZmVycmVkIGluc3RhbmNlIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIG9wdGlvbnNcclxuICAgICAqICAtIGBlbmAgc2V0IHRoZSBleHRlbmQgb2JqZWN0IG9yIGNhbmNlbCBjYWxsYmFjayBmdW5jdGlvbi5cclxuICAgICAqICAtIGBqYWAgalF1ZXJ5UHJvbWlzZSDjgpLmi6HlvLXjgZnjgovjgqrjg5bjgrjjgqfjgq/jg4ggb3Ig44Kt44Oj44Oz44K744Or5pmC44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44KS5oyH5a6aXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWFrZVByb21pc2U8VD4oZGY6IEpRdWVyeURlZmVycmVkPFQ+LCBvcHRpb25zPzogTWFrZVByb21pc2VPcHRpb25zIHwgY2FuY2VsQ2FsbGJhY2spOiBJUHJvbWlzZTxUPiB7XHJcbiAgICAgICAgY29uc3QgY2FuY2VsYWJsZSA9IG1ha2VDYW5jZWxhYmxlKGRmLCBvcHRpb25zKTtcclxuICAgICAgICBjb25zdCBwcm9taXNlID0gPElQcm9taXNlPFQ+Pjxhbnk+ZGYucHJvbWlzZShjYW5jZWxhYmxlLnRhcmdldCk7XHJcbiAgICAgICAgaWYgKG51bGwgPT0gcHJvbWlzZS5hYm9ydCkge1xyXG4gICAgICAgICAgICBwcm9taXNlLmFib3J0ID0gY2FuY2VsYWJsZS5hYm9ydC5iaW5kKHByb21pc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobnVsbCA9PSBwcm9taXNlLmRlcGVuZE9uKSB7XHJcbiAgICAgICAgICAgIHByb21pc2UuZGVwZW5kT24gPSBjYW5jZWxhYmxlLmRlcGVuZE9uLmJpbmQocHJvbWlzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gV2FpdCBmb3IgcHJvbWlzZSBwcm9jZXNzaW5nIGNvbXBsZXRpbmcuIDxicj5cclxuICAgICAqICAgICBqUXVlcnkud2hlbigpIHJldHVybnMgY29udHJvbCB3aGVuIG9uZSBvZiBwcm9taXNlIGlzIGZhaWxlZC4gPGJyPlxyXG4gICAgICogICAgIEJ1dCB0aGlzIG1ldGhvZCB3YWl0IGZvciBhbGwgcHJvbWlzZSBvYmplY3RzIG9wZXJhdGlvbiBpbmNsdWRpbmcgZmFpbCBjYXNlLlxyXG4gICAgICogQGphIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44Gu57WC5LqG44KS5b6F44GkIDxicj5cclxuICAgICAqICAgICBqUXVlcnkud2hlbigpIOOBr+WkseaVl+OBmeOCi+OBqOOBmeOBkOOBq+WItuW+oeOCkui/lOOBmeOBruOBq+WvvuOBl+OAgeWkseaVl+OCguWQq+OCgeOBpuW+heOBpCBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gd2FpdDxUPiguLi5kZWZlcnJlZHM6IFByb21pc2U8VD5bXSk6IElQcm9taXNlQmFzZTxUPjtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiB3YWl0PFQ+KC4uLmRlZmVycmVkczogSlF1ZXJ5R2VuZXJpY1Byb21pc2U8VD5bXSk6IElQcm9taXNlQmFzZTxUPjtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiB3YWl0PFQ+KC4uLmRlZmVycmVkczogVFtdKTogSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHdhaXQ8VD4oLi4uZGVmZXJyZWRzOiBhbnlbXSk6IElQcm9taXNlQmFzZTxUPiB7XHJcblxyXG4gICAgICAgIC8vIDHmrKHlhYPphY3liJfjgavkv53oqLxcclxuICAgICAgICBjb25zdCBfZGVmZXJyZWRzOiBKUXVlcnlQcm9taXNlPFQ+W10gPSBbXS5jb25jYXQuYXBwbHkoW10sIGRlZmVycmVkcyk7XHJcblxyXG4gICAgICAgIC8vIOWun+mam+OBruS9nOalrVxyXG4gICAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZCgpO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3QgaXNGaW5pc2hlZCA9ICgpOiBib29sZWFuID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICFyZXN1bHRzLnNvbWUoKGVsZW1lbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwicGVuZGluZ1wiID09PSBlbGVtZW50LnN0YXR1cztcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgX2RlZmVycmVkcy5mb3JFYWNoKChkZWZlcnJlZCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogXCJwZW5kaW5nXCIsXHJcbiAgICAgICAgICAgICAgICBhcmdzOiBudWxsLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZGVmZXJyZWRcclxuICAgICAgICAgICAgICAgIC50aGVuKCguLi5hcmdzOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdLnN0YXR1cyA9IFwicmVzb2x2ZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2luZGV4XS5hcmdzID0gYXJncztcclxuICAgICAgICAgICAgICAgIH0sICguLi5hcmdzOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdLnN0YXR1cyA9IFwicmVqZWN0ZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2luZGV4XS5hcmdzID0gYXJncztcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuYWx3YXlzKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNGaW5pc2hlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiA8YW55PmRmLnByb21pc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXYWl0IGZvciByYWNlIGNvbmRpdGlvbi48YnI+XHJcbiAgICAgKiAgICAgVGhpcyBoYXZlIHNhbWUgc2VtYW50aWNzIGFzIEVTMjAxNSBQcm9taXNlLnJhY2UoKS5cclxuICAgICAqIEBqYSBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOBruacgOWIneOBruWujOS6huOCkuW+heOBpCA8YnI+XHJcbiAgICAgKiAgICAgRVMyMDE1IFByb21pc2UucmFjZSgpIOOBqOWQjOetiVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmFjZTxUPiguLi5kZWZlcnJlZHM6IFByb21pc2U8VD5bXSk6IElQcm9taXNlQmFzZTxUPjtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KC4uLmRlZmVycmVkczogSlF1ZXJ5R2VuZXJpY1Byb21pc2U8VD5bXSk6IElQcm9taXNlQmFzZTxUPjtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KC4uLmRlZmVycmVkczogVFtdKTogSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4oLi4uZGVmZXJyZWRzOiBhbnlbXSk6IElQcm9taXNlQmFzZTxUPiB7XHJcbiAgICAgICAgY29uc3QgZGYgPSAkLkRlZmVycmVkKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IF9kZWZlcnJlZHM6IEpRdWVyeVByb21pc2U8VD5bXSA9IFtdLmNvbmNhdC5hcHBseShbXSwgZGVmZXJyZWRzKTtcclxuICAgICAgICBfZGVmZXJyZWRzLmZvckVhY2goKGRlZmVycmVkLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBkZWZlcnJlZFxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKC4uLmFyZ3M6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFwicGVuZGluZ1wiID09PSBkZi5zdGF0ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUoYXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgKC4uLmFyZ3M6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFwicGVuZGluZ1wiID09PSBkZi5zdGF0ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChhcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIDxhbnk+ZGYucHJvbWlzZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGNsYXNzIHByb3ZpZGVzIHRoZSBvcGVyYXRpb24gZm9yIG11bHRpcGxlIFtbSVByb21pc2VdXSBvYmplY3QuXHJcbiAgICAgKiBAamEg6KSH5pWw44GuIFtbSVByb21pc2VdXSDjgpLkuIDmi6znrqHnkIbjgZnjgovjgq/jg6njgrlcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZSA8YnI+XHJcbiAgICAgKlxyXG4gICAgICogYGBgdHNcclxuICAgICAqICBsZXQgX3BybXNNYW5hZ2VyID0gbmV3IFByb21pc2VNYW5hZ2VyKCk7XHJcbiAgICAgKlxyXG4gICAgICogIGZ1bmN0aW9uIHByb2NDYWxsZXIoKTogdm9pZCB7XHJcbiAgICAgKiAgICAgIC8vIGFkZCBwYXJhbGxlbCBvcGVyYXRpb25zIHVuZGVyIHRoZSBtYW5hZ2VtZW50LlxyXG4gICAgICogICAgICBfcHJtc01hbmFnZXIuYWRkKGFzeW5jMSk7XHJcbiAgICAgKiAgICAgIF9wcm1zTWFuYWdlci5hZGQoYXN5bmMyKTtcclxuICAgICAqICAgICAgX3BybXNNYW5hZ2VyLmFkZChhc3luYzMpO1xyXG4gICAgICogIH1cclxuICAgICAqXHJcbiAgICAgKiAgZnVuY3Rpb24gYWxsQ2FuY2VsKCk6IHZvaWQge1xyXG4gICAgICogICAgICAvLyBqdXN0IG9uZSBjYWxsLiBhbGwgcGFyYWxsZWwgb3BzIGFyZSBjYW5jZWxlZC5cclxuICAgICAqICAgICAgX3BybXNNYW5hZ2VyLmNhbmNlbCgpO1xyXG4gICAgICogIH1cclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUHJvbWlzZU1hbmFnZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9wb29sOiB7IHByb21pc2U6IElQcm9taXNlPGFueT47IGlkOiBudW1iZXI7IH1bXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgX2lkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGVuIGFkZCBQcm9taXNlIG9iamVjdCB0aGF0IGhhcyBhYm9ydCgpIG1ldGhvZC5cclxuICAgICAgICAgKiBAamEgYWJvcnQoKSDjgpLmjIHjgaQgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jjgpLnrqHnkIbkuIvjgavov73liqBcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgYWRkPFQ+KHByb21pc2U6IElQcm9taXNlPFQ+IHwgSlF1ZXJ5WEhSKTogSVByb21pc2U8VD4ge1xyXG4gICAgICAgICAgICBpZiAocHJvbWlzZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gYWJvcnQoKSDjgpLmjIHjgaPjgabjgYTjgarjgYTloLTlkIjjga/jgqjjg6njg7xcclxuICAgICAgICAgICAgaWYgKCFwcm9taXNlLmFib3J0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiW2FkZF0gcHJvbWlzZSBvYmplY3QgZG9lc24ndCBoYXZlICdhYm9ydCgpJyBtZXRob2QuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDxhbnk+cHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgY29va2llID0ge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZTogPGFueT5wcm9taXNlLFxyXG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMuX2lkKyssXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9wb29sLnB1c2goY29va2llKTtcclxuXHJcbiAgICAgICAgICAgICg8YW55PnByb21pc2UpXHJcbiAgICAgICAgICAgICAgICAuYWx3YXlzKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wb29sID0gdGhpcy5fcG9vbC5maWx0ZXIoKGVsZW1lbnQ6IHsgcHJvbWlzZTogSVByb21pc2U8YW55PjsgaWQ6IG51bWJlcjsgfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlbWVudC5pZCAhPT0gY29va2llLmlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gPGFueT5wcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGVuIGNhbGwgYWJvcnQoKSB0byB1bmRlciB0aGUgbWFuYWdlbWVudCBQcm9taXNlcy5cclxuICAgICAgICAgKiBAamEg566h55CG5a++6LGh44GuIFByb21pc2Ug44Gr5a++44GX44GmIGFib3J0IOOCkueZuuihjFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGluZm9cclxuICAgICAgICAgKiAgLSBgZW5gIGFib3J0KCkgYXJndW1lbnRcclxuICAgICAgICAgKiAgLSBgamFgIGFib3J0KCkg44Gr5rih44GV44KM44KL5byV5pWwXHJcbiAgICAgICAgICogQHJldHVybnNcclxuICAgICAgICAgKiAgLSBgZW5gIFRoZSBjYW5jZWxsYXRpb24gdG8gY2FuY2VsIHByb2Nlc3NpbmcgaXMgcHJvaGliaXRlZC5cclxuICAgICAgICAgKiAgLSBgamFgIOOCreODo+ODs+OCu+ODq+WHpueQhuOBq+WvvuOBmeOCi+OCreODo+ODs+OCu+ODq+OBr+S4jeWPr1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBjYW5jZWwoaW5mbz86IG9iamVjdCk6IElQcm9taXNlQmFzZTxhbnk+IHtcclxuICAgICAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB0aGlzLnByb21pc2VzKCk7XHJcbiAgICAgICAgICAgIHByb21pc2VzLmZvckVhY2goKGVsZW1lbnQ6IElQcm9taXNlPGFueT4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmFib3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hYm9ydChpbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB3YWl0LmFwcGx5KG51bGwsIHByb21pc2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBnZXQgUHJvbWlzZSBvYmplY3RzIGFzIGFycmF5LiA8YnI+XHJcbiAgICAgICAgICogICAgIG9ubHkgcGVuZGluZyBzdGF0ZSBvYmplY3QgYXJlIHJldHVybmVkLlxyXG4gICAgICAgICAqIEBqYSDnrqHnkIblr77osaHjga4gUHJvbWlzZSDjgpLphY3liJfjgaflj5blvpcgPGJyPlxyXG4gICAgICAgICAqICAgICBwZW5kaW5nIOeKtuaFi+OBruOCquODluOCuOOCp+OCr+ODiOOBruOBv+OBjOi/lOOCiy5cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgcHJvbWlzZXMoKTogSVByb21pc2U8YW55PltdIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Bvb2wubWFwKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5wcm9taXNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDYW5jZWxhYmxlIFByb21pc2UgY2xhc3MgZm9yIEVTMjAxNSBQcm9taWlzZSBjb21wYXRpYmxlLlxyXG4gICAgICogQGphIEVTMjAxNSBQcm9taXNlIOS6kuaPm+OBruOCreODo+ODs+OCu+ODq+WPr+iDveOBqiBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUHJvbWlzZUNvbnN0cnVjdG9yPFQ+IGltcGxlbWVudHMgSVByb21pc2U8VD4ge1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIG1peGluOiBuYXRpdmUgUHJvbWlzZVxyXG5cclxuICAgICAgICB0aGVuOiA8VFJlc3VsdDEgPSBULCBUUmVzdWx0MiA9IG5ldmVyPihcclxuICAgICAgICAgICAgb25mdWxmaWxsZWQ/OiAoXHJcbiAgICAgICAgICAgICAgICAodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+XHJcbiAgICAgICAgICAgICkgfCB1bmRlZmluZWQgfCBudWxsLFxyXG4gICAgICAgICAgICBvbnJlamVjdGVkPzogKFxyXG4gICAgICAgICAgICAgICAgKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPlxyXG4gICAgICAgICAgICApIHwgdW5kZWZpbmVkIHwgbnVsbFxyXG4gICAgICAgICkgPT4gSVByb21pc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj47XHJcblxyXG4gICAgICAgIGNhdGNoOiA8VFJlc3VsdCA9IG5ldmVyPihcclxuICAgICAgICAgICAgb25yZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQgfCBQcm9taXNlTGlrZTxUUmVzdWx0PikgfCB1bmRlZmluZWQgfCBudWxsXHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZUJhc2U8VFJlc3VsdD47XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gbWl4aW46IEpRdWVyeVByb21pc2VcclxuXHJcbiAgICAgICAgc3RhdGU6ICgpID0+IHN0cmluZztcclxuICAgICAgICBhbHdheXM6IChcclxuICAgICAgICAgICAgYWx3YXlzQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdLFxyXG4gICAgICAgICAgICAuLi5hbHdheXNDYWxsYmFja3NOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgICAgICBkb25lOiAoXHJcbiAgICAgICAgICAgIGRvbmVDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD5bXSxcclxuICAgICAgICAgICAgLi4uZG9uZUNhbGxiYWNrTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgICAgICBmYWlsOiAoXHJcbiAgICAgICAgICAgIGZhaWxDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10sXHJcbiAgICAgICAgICAgIC4uLmZhaWxDYWxsYmFja3NOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgICAgICBwcm9ncmVzczogKFxyXG4gICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4ucHJvZ3Jlc3NDYWxsYmFja046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIG1peGluOiBKUXVlcnlEZWZlcnJlZFxyXG5cclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuICAgICAgICBwcml2YXRlIG5vdGlmeTogKHZhbHVlPzogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gSlF1ZXJ5RGVmZXJyZWQ8VD47XHJcbiAgICAgICAgcHJpdmF0ZSBub3RpZnlXaXRoOiAoY29udGV4dDogYW55LCB2YWx1ZT86IGFueVtdKSA9PiBKUXVlcnlEZWZlcnJlZDxUPjtcclxuICAgICAgICBwcml2YXRlIHJlamVjdDogKHZhbHVlPzogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gSlF1ZXJ5RGVmZXJyZWQ8VD47XHJcbiAgICAgICAgcHJpdmF0ZSByZWplY3RXaXRoOiAoY29udGV4dDogYW55LCB2YWx1ZT86IGFueVtdKSA9PiBKUXVlcnlEZWZlcnJlZDxUPjtcclxuICAgICAgICBwcml2YXRlIHJlc29sdmU6ICh2YWx1ZT86IFQsIC4uLmFyZ3M6IGFueVtdKSA9PiBKUXVlcnlEZWZlcnJlZDxUPjtcclxuICAgICAgICBwcml2YXRlIHJlc29sdmVXaXRoOiAoY29udGV4dDogYW55LCB2YWx1ZT86IFRbXSkgPT4gSlF1ZXJ5RGVmZXJyZWQ8VD47XHJcbiAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBtaXhpbjogSVByb2ltaXNlXHJcblxyXG4gICAgICAgIGFib3J0OiAoaW5mbz86IGFueSkgPT4gdm9pZDtcclxuICAgICAgICBkZXBlbmRPbjogPFU+KHByb21pc2U6IElQcm9taXNlPFU+IHwgSlF1ZXJ5WEhSKSA9PiBJUHJvbWlzZTxVPjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGV4YW1wbGUgPGJyPlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogYGBgdHNcclxuICAgICAgICAgKiAgLy8gb3ZlcnJpZGUgZ2xvYmFsIFwiUHJvbWlzZVwiIGZvciB1c2luZyBDYW5jZWxhYmxlIFByb21pc2UgaW4gdGhpcyBtb2R1bGUgc2NvcGUuXHJcbiAgICAgICAgICogIGltcG9ydCB7IFByb21pc2UgfSBmcm9tIFwiY2RwXCI7XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiAgZnVuY3Rpb24gKCk6IElQcm9taXNlPFNvbWVEYXRhPiA9PiB7XHJcbiAgICAgICAgICogICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCwgZGVwZW5kT24pID0+IHtcclxuICAgICAgICAgKiAgICAgICAgICAvLyBhc3luYzEoKSwgYXN5bmMyKCkgYXJlIGFzeW5jIGZ1bmN0aW9uIGFuZCByZXR1cm5lZCBJUHJvbWlzZSBpbnN0YW5jZS5cclxuICAgICAgICAgKiAgICAgICAgICBkZXBlbmRPbihhc3luYzEoKSlcclxuICAgICAgICAgKiAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlcGVuZE9uKGFzeW5jMigpKTtcclxuICAgICAgICAgKiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgKiAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHNvbWVkYXRhOiBcImhvZ2VcIiB9KTtcclxuICAgICAgICAgKiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgKiAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgKiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICogICAgICAgICAgfSk7XHJcbiAgICAgICAgICogICAgICB9O1xyXG4gICAgICAgICAqICB9XHJcbiAgICAgICAgICogYGBgXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXhlY3V0b3JcclxuICAgICAgICAgKiAgLSBgZW5gIEVTMjAxNSBQcm9taXNlIGV4ZWN1dGVyIGNvbXBhdGlibGUgd2l0aCBgZGVwZW5kT25gIDNyZCBhcmcuXHJcbiAgICAgICAgICogIC0gYGphYCBFUzYgUHJvbWlzZSDkupLmj5vlvJXmlbAuIChkZXBlbmRPbiDjgpLnrKwz5byV5pWw44Gr5rih44GZKVxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zXHJcbiAgICAgICAgICogIC0gYGVuYCBzZXQgdGhlIGV4dGVuZCBvYmplY3Qgb3IgY2FuY2VsIGNhbGxiYWNrIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqICAtIGBqYWAgalF1ZXJ5UHJvbWlzZSDjgpLmi6HlvLXjgZnjgovjgqrjg5bjgrjjgqfjgq/jg4ggb3Ig44Kt44Oj44Oz44K744Or5pmC44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44KS5oyH5a6aXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgIGV4ZWN1dG9yOiAoXHJcbiAgICAgICAgICAgICAgICByZXNvbHZlOiAodmFsdWU/OiBUIHwgUHJvbWlzZUxpa2U8VD4sIC4uLmFkZGl0aW9uYWw6IGFueVtdKSA9PiB2b2lkLFxyXG4gICAgICAgICAgICAgICAgcmVqZWN0PzogKHJlYXNvbj86IGFueSwgLi4uYWRkaXRpb25hbDogYW55W10pID0+IHZvaWQsXHJcbiAgICAgICAgICAgICAgICBkZXBlbmRPbj86IDxVPihwcm9taXNlOiBJUHJvbWlzZTxVPiB8IEpRdWVyeVhIUikgPT4gSVByb21pc2U8VT4sXHJcbiAgICAgICAgICAgICkgPT4gdm9pZCxcclxuICAgICAgICAgICAgb3B0aW9ucz86IE1ha2VQcm9taXNlT3B0aW9ucyB8IGNhbmNlbENhbGxiYWNrXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vIGFwcGx5IG1peGluXHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmNlbGFibGUgPSBtYWtlQ2FuY2VsYWJsZSgkLkRlZmVycmVkKCksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCB0aGlzLCBjYW5jZWxhYmxlLmRmLCBjYW5jZWxhYmxlLnRhcmdldCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWJvcnQgPSBjYW5jZWxhYmxlLmFib3J0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuZGVwZW5kT24gPSBjYW5jZWxhYmxlLmRlcGVuZE9uLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBleGVjdXRvcih0aGlzLnJlc29sdmUsIHRoaXMucmVqZWN0LCB0aGlzLmRlcGVuZE9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gc3RhdGljIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIHN0YXRpYyByZXNvbHZlPFU+KHZhbHVlPzogVSB8IFByb21pc2VMaWtlPFU+KTogSVByb21pc2U8VT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gPGFueT4kLkRlZmVycmVkKCkucmVzb2x2ZSh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgcmVqZWN0PFU+KHJlYXNvbj86IGFueSk6IElQcm9taXNlPFU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+JC5EZWZlcnJlZCgpLnJlamVjdChyZWFzb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGFsbDxVPiguLi5kZWZlcnJlZHM6IEFycmF5PFUgfCBJUHJvbWlzZTxVPiB8IEpRdWVyeVByb21pc2U8VT4+KTogSVByb21pc2VCYXNlPFU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+JC53aGVuLmFwcGx5KHRoaXMsIFtdLmNvbmNhdC5hcHBseShbXSwgZGVmZXJyZWRzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgd2FpdDxVPiguLi5kZWZlcnJlZHM6IEFycmF5PFUgfCBJUHJvbWlzZTxVPiB8IEpRdWVyeVByb21pc2U8VT4+KTogSVByb21pc2VCYXNlPFU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+d2FpdChbXS5jb25jYXQuYXBwbHkoW10sIGRlZmVycmVkcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIHJhY2U8VT4oLi4uZGVmZXJyZWRzOiBBcnJheTxVIHwgSVByb21pc2U8VT4gfCBKUXVlcnlQcm9taXNlPFU+Pik6IElQcm9taXNlQmFzZTxVPiB7XHJcbiAgICAgICAgICAgIHJldHVybiA8YW55PnJhY2UoW10uY29uY2F0LmFwcGx5KFtdLCBkZWZlcnJlZHMpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IFByb21pc2UgPSBQcm9taXNlQ29uc3RydWN0b3I7XHJcbn1cclxuXHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcImNkcC5wcm9taXNlXCIge1xyXG4gICAgZXhwb3J0ID0gQ0RQO1xyXG59XHJcbiJdfQ==
