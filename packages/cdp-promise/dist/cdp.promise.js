/*!
 * cdp.promise.js 2.0.0
 *
 * Date: 2017-07-13T05:44:08.116Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(["jquery"], function ($) { return factory(root.CDP || (root.CDP = {}), $, root); }); } else if (typeof exports === "object") { module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"), root); } else { factory(root.CDP || (root.CDP = {}), root.jQuery || root.$, root); } }(((this || 0).self || global), function (CDP, $, root) {
var CDP;
(function (CDP) {
    var TAG = "[CDP.Promise] ";
    /**
     * Cancel 可能オブジェクトの作成
     *
     * @param df       [in] jQueryDeferred instance を指定
     * @param options? [in] jQueryPromise を拡張するオブジェクト or キャンセル時に呼び出される関数を指定
     * @returns {Object} Cancelable property
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
            var detail = info ? info : { message: "abort" };
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
     * Promise オブジェクトの作成
     * jQueryDeferred オブジェクトから、Tools.Promise オブジェクトを作成する
     *
     * @param df       [in] jQueryDeferred instance を指定
     * @param options? [in] jQueryPromise を拡張するオブジェクト or キャンセル時に呼び出される関数を指定
     * @returns IPromise オブジェクト
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
        // 投入法が可変引数だった場合は配列に修正する
        var _deferreds = [].concat.apply([], deferreds);
        // 実際の作業
        var df = $.Deferred();
        var results = [];
        var initialized = false;
        var isFinished = function () {
            if (!initialized) {
                return false;
            }
            else {
                return !results.some(function (element) {
                    return "pending" === element.status;
                });
            }
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
        initialized = true;
        if (isFinished()) {
            df.resolve(results);
        }
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
     * @class PromiseManager
     * @brief 複数の DataProvider.Promise を管理するクラス
     */
    var PromiseManager = (function () {
        function PromiseManager() {
            this._pool = [];
            this._id = 0;
        }
        ///////////////////////////////////////////////////////////////////////
        // public method
        /**
         * Promise を管理下に追加
         *
         * @param promise [in] 管理対象のオブジェクト
         * @returns 引数に渡したオブジェクト
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
         * 管理対象の Promise に対して abort を発行
         * キャンセル処理に対するキャンセルは不可
         *
         * @returns Promise オブジェクト
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
         * 管理対象の Promise を配列で返す
         *
         * @returns Promise オブジェクト配列
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
     * @class PromiseConstructor
     * @brief ES6 Promise 互換の Promise オブジェクトコンストラクタ
     */
    var PromiseConstructor = (function () {
        /**
         * constructor
         *
         * @param executor [in] ES6 Promise 互換引数. (dependOn を第3引数に渡す)
         * @param options? [in] jQueryPromise を拡張するオブジェクト or キャンセル時に呼び出される関数を指定
         * @return IPromise オブジェクト
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
            return $.when(deferreds);
        };
        PromiseConstructor.wait = function () {
            var deferreds = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                deferreds[_i] = arguments[_i];
            }
            return wait(deferreds);
        };
        PromiseConstructor.race = function () {
            var deferreds = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                deferreds[_i] = arguments[_i];
            }
            return race(deferreds);
        };
        return PromiseConstructor;
    }());
    CDP.PromiseConstructor = PromiseConstructor;
    CDP.Promise = PromiseConstructor;
})(CDP || (CDP = {}));

root.Promise = root.Promise || CDP.Promise; return CDP; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ID0gXCJbQ0RQLlByb21pc2VdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJUHJvbWlzZUJhc2VcclxuICAgICAqIEBicmllZiBOYXRpdmUgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jjga7mi6HlvLXjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnlrprnvqlcclxuICAgICAqICAgICAgICDjgq3jg6Pjg7Pjgrvjg6vjgZXjgZvjgZ/jgY/jgarjgYTjgYwgYWx3YXlzKCkg44Gq44GpIGpRdWVyeSBtZXRob2Qg44KS5o+Q5L6b44GX44Gf44GE5aC05ZCI44Gr5L2/55So44GZ44KLLlxyXG4gICAgICogICAgICAgIE5hdGl2ZSDjgqrjg5bjgrjjgqfjgq/jg4jjga7mi6HlvLXlrp/oo4Xjga/nhKHjgYTjgZ/jgoHjgIFnbG9iYWwg44Gr44Gv5a6a576p44GX44Gq44GELlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElQcm9taXNlQmFzZTxUPiBleHRlbmRzIFByb21pc2U8VD4ge1xyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gUHJvbWlzZSBleHRlbmRzOlxyXG5cclxuICAgICAgICB0aGVuPFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXHJcbiAgICAgICAgICAgIG9uZnVsZmlsbGVkPzogKFxyXG4gICAgICAgICAgICAgICAgKHZhbHVlOiBUKSA9PiBUUmVzdWx0MSB8IFByb21pc2VMaWtlPFRSZXN1bHQxPlxyXG4gICAgICAgICAgICApIHwgdW5kZWZpbmVkIHwgbnVsbCxcclxuICAgICAgICAgICAgb25yZWplY3RlZD86IChcclxuICAgICAgICAgICAgICAgIChyZWFzb246IGFueSkgPT4gVFJlc3VsdDIgfCBQcm9taXNlTGlrZTxUUmVzdWx0Mj5cclxuICAgICAgICAgICAgKSB8IHVuZGVmaW5lZCB8IG51bGxcclxuICAgICAgICApOiBJUHJvbWlzZUJhc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj47XHJcblxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEpRdWVyeVByb21pc2Ugc3R1ZmY6XHJcblxyXG4gICAgICAgIHN0YXRlOiAoKSA9PiBzdHJpbmc7XHJcbiAgICAgICAgYWx3YXlzOiAoXHJcbiAgICAgICAgICAgIGFsd2F5c0NhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4uYWx3YXlzQ2FsbGJhY2tzTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdPlxyXG4gICAgICAgICkgPT4gSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgICAgIGRvbmU6IChcclxuICAgICAgICAgICAgZG9uZUNhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxUPiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxUPltdLFxyXG4gICAgICAgICAgICAuLi5kb25lQ2FsbGJhY2tOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlQmFzZTxUPjtcclxuICAgICAgICBmYWlsOiAoXHJcbiAgICAgICAgICAgIGZhaWxDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10sXHJcbiAgICAgICAgICAgIC4uLmZhaWxDYWxsYmFja3NOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZUJhc2U8VD47XHJcbiAgICAgICAgcHJvZ3Jlc3M6IChcclxuICAgICAgICAgICAgcHJvZ3Jlc3NDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10sXHJcbiAgICAgICAgICAgIC4uLnByb2dyZXNzQ2FsbGJhY2tOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZUJhc2U8VD47XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElQcm9taXNlXHJcbiAgICAgKiBAYnJpZWYg44Kt44Oj44Oz44K744Or5Y+v6IO944GqIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44Gu44Kk44Oz44K/44O844OV44Kn44Kk44K55a6a576pXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVByb21pc2U8VD4gZXh0ZW5kcyBJUHJvbWlzZUJhc2U8VD4ge1xyXG4gICAgICAgIC8vISDjgq3jg6Pjg7Pjgrvjg6vlh6bnkIZcclxuICAgICAgICBhYm9ydChpbmZvPzogYW55KTogdm9pZDtcclxuICAgICAgICAvLyEg5L6d5a2Y44GZ44KLIHByb21pc2UuXHJcbiAgICAgICAgZGVwZW5kZW5jeT86IElQcm9taXNlPGFueT47XHJcbiAgICAgICAgLy8hIGFib3J0IOaZguOBq+iHqui6q+OCgiByZWplY3RcclxuICAgICAgICBjYWxsUmVqZWN0PzogYm9vbGVhbjtcclxuICAgICAgICAvLyEg5L6d5a2Y44GZ44KLIHByb21pc2Ug44KS6Kit5a6aXHJcbiAgICAgICAgZGVwZW5kT248VT4ocHJvbWlzZTogSVByb21pc2U8VT4gfCBKUXVlcnlYSFIpOiBJUHJvbWlzZTxVPjtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBQcm9taXNlIGV4dGVuZHM6XHJcblxyXG4gICAgICAgIHRoZW48VFJlc3VsdDEgPSBULCBUUmVzdWx0MiA9IG5ldmVyPihcclxuICAgICAgICAgICAgb25mdWxmaWxsZWQ/OiAoXHJcbiAgICAgICAgICAgICAgICAodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+XHJcbiAgICAgICAgICAgICkgfCB1bmRlZmluZWQgfCBudWxsLFxyXG4gICAgICAgICAgICBvbnJlamVjdGVkPzogKFxyXG4gICAgICAgICAgICAgICAgKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPlxyXG4gICAgICAgICAgICApIHwgdW5kZWZpbmVkIHwgbnVsbFxyXG4gICAgICAgICk6IElQcm9taXNlPFRSZXN1bHQxIHwgVFJlc3VsdDI+O1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEpRdWVyeVByb21pc2Ugc3R1ZmY6XHJcblxyXG4gICAgICAgIHN0YXRlOiAoKSA9PiBzdHJpbmc7XHJcbiAgICAgICAgYWx3YXlzOiAoXHJcbiAgICAgICAgICAgIGFsd2F5c0NhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4uYWx3YXlzQ2FsbGJhY2tzTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdPlxyXG4gICAgICAgICkgPT4gSVByb21pc2U8VD47XHJcbiAgICAgICAgZG9uZTogKFxyXG4gICAgICAgICAgICBkb25lQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+W10sXHJcbiAgICAgICAgICAgIC4uLmRvbmVDYWxsYmFja046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxUPiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxUPltdPlxyXG4gICAgICAgICkgPT4gSVByb21pc2U8VD47XHJcbiAgICAgICAgZmFpbDogKFxyXG4gICAgICAgICAgICBmYWlsQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdLFxyXG4gICAgICAgICAgICAuLi5mYWlsQ2FsbGJhY2tzTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdPlxyXG4gICAgICAgICkgPT4gSVByb21pc2U8VD47XHJcbiAgICAgICAgcHJvZ3Jlc3M6IChcclxuICAgICAgICAgICAgcHJvZ3Jlc3NDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10sXHJcbiAgICAgICAgICAgIC4uLnByb2dyZXNzQ2FsbGJhY2tOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogbWFrZVByb21pc2Ug44Gr5oyH5a6a5Y+v6IO944GqIGNhbmNlbCBjYWxsYmFjayDjga4gYWxpYXMuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB0eXBlIGNhbmNlbENhbGxiYWNrID0gKGRldGFpbD86IGFueSkgPT4gdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgTWFrZVByb21pc2VPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgICAgIG1ha2VQcm9taXNlIOOBq+a4oeOBm+OCi+OCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIE1ha2VQcm9taXNlT3B0aW9ucyB7XHJcbiAgICAgICAgZGVwZW5kZW5jeT86IElQcm9taXNlPGFueT47ICAgICAgICAgLy8hPCDkvp3lrZjjgZnjgosgcHJvbWlzZSDjgpLoqK3lrppcclxuICAgICAgICBjYWxsUmVqZWN0PzogYm9vbGVhbjsgICAgICAgICAgICAgICAvLyE8IGFib3J0IOaZguOBq+iHqui6q+OCgiByZWplY3RcclxuICAgICAgICBjYW5jZWxDYWxsYmFjaz86IGNhbmNlbENhbGxiYWNrOyAgICAvLyE8IOOCreODo+ODs+OCu+ODq+aZguOBq+WRvOOBsOOCjOOCi+mWouaVsFxyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IGFueTsgICAgICAgICAgICAgICAgIC8vITwg5ouh5by144OR44Op44Oh44O844K/XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDYW5jZWwg5Y+v6IO944Kq44OW44K444Kn44Kv44OI44Gu5L2c5oiQXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRmICAgICAgIFtpbl0galF1ZXJ5RGVmZXJyZWQgaW5zdGFuY2Ug44KS5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gb3B0aW9ucz8gW2luXSBqUXVlcnlQcm9taXNlIOOCkuaLoeW8teOBmeOCi+OCquODluOCuOOCp+OCr+ODiCBvciDjgq3jg6Pjg7Pjgrvjg6vmmYLjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbDjgpLmjIflrppcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3R9IENhbmNlbGFibGUgcHJvcGVydHlcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbWFrZUNhbmNlbGFibGU8VD4oXHJcbiAgICAgICAgZGY6IEpRdWVyeURlZmVycmVkPFQ+LFxyXG4gICAgICAgIG9wdGlvbnM/OiBNYWtlUHJvbWlzZU9wdGlvbnMgfCBjYW5jZWxDYWxsYmFja1xyXG4gICAgKTogeyBkZjogSlF1ZXJ5RGVmZXJyZWQ8VD4sIHRhcmdldDogb2JqZWN0OyBhYm9ydDogKGluZm8/OiBhbnkpID0+IHZvaWQ7IGRlcGVuZE9uOiAocHJvbWlzZTogYW55KSA9PiBKUXVlcnlQcm9taXNlPGFueT4gfSB7XHJcbiAgICAgICAgbGV0IGV4dGVuZE9wdGlvbnM6IE1ha2VQcm9taXNlT3B0aW9ucztcclxuICAgICAgICBsZXQgY2FuY2VsOiBjYW5jZWxDYWxsYmFjaztcclxuXHJcbiAgICAgICAgaWYgKFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgY2FuY2VsID0gPGNhbmNlbENhbGxiYWNrPm9wdGlvbnM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZXh0ZW5kT3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgICAgIGlmIChleHRlbmRPcHRpb25zICYmIGV4dGVuZE9wdGlvbnMuY2FuY2VsQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIGNhbmNlbCA9IGV4dGVuZE9wdGlvbnMuY2FuY2VsQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjYW5jZWwgPSAoKSA9PiB7IC8qIG5vb3AgKi8gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgX2Fib3J0ID0gZnVuY3Rpb24gKGluZm8/OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgZGV0YWlsID0gaW5mbyA/IGluZm8gOiB7IG1lc3NhZ2U6IFwiYWJvcnRcIiB9O1xyXG4gICAgICAgICAgICBjYW5jZWwoZGV0YWlsKTtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5kZXBlbmRlbmN5KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXBlbmRlbmN5LmFib3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmN5LmFib3J0KGRldGFpbCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJbY2FsbF0gZGVwZW5kZW5jeSBvYmplY3QgZG9lc24ndCBoYXZlICdhYm9ydCgpJyBtZXRob2QuXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FsbFJlamVjdCAmJiBcInBlbmRpbmdcIiA9PT0gdGhpcy5zdGF0ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGRldGFpbCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJwZW5kaW5nXCIgPT09IHRoaXMuc3RhdGUoKSkge1xyXG4gICAgICAgICAgICAgICAgZGYucmVqZWN0KGRldGFpbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfZGVwZW5kT24gPSBmdW5jdGlvbiAocHJvbWlzZTogYW55KTogSlF1ZXJ5UHJvbWlzZTxhbnk+IHtcclxuICAgICAgICAgICAgaWYgKHByb21pc2UuYWJvcnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jeSA9IHByb21pc2U7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlXHJcbiAgICAgICAgICAgICAgICAgICAgLmFsd2F5cygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jeSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiW3NldF0gZGVwZW5kZW5jeSBvYmplY3QgZG9lc24ndCBoYXZlICdhYm9ydCgpJyBtZXRob2QuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IF90YXJnZXQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBkZXBlbmRlbmN5OiBudWxsLFxyXG4gICAgICAgICAgICBjYWxsUmVqZWN0OiBmYWxzZSxcclxuICAgICAgICB9LCBleHRlbmRPcHRpb25zKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZGY6IGRmLFxyXG4gICAgICAgICAgICB0YXJnZXQ6IF90YXJnZXQsXHJcbiAgICAgICAgICAgIGFib3J0OiBfYWJvcnQsXHJcbiAgICAgICAgICAgIGRlcGVuZE9uOiBfZGVwZW5kT24sXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44Gu5L2c5oiQXHJcbiAgICAgKiBqUXVlcnlEZWZlcnJlZCDjgqrjg5bjgrjjgqfjgq/jg4jjgYvjgonjgIFUb29scy5Qcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOCkuS9nOaIkOOBmeOCi1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZiAgICAgICBbaW5dIGpRdWVyeURlZmVycmVkIGluc3RhbmNlIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIG9wdGlvbnM/IFtpbl0galF1ZXJ5UHJvbWlzZSDjgpLmi6HlvLXjgZnjgovjgqrjg5bjgrjjgqfjgq/jg4ggb3Ig44Kt44Oj44Oz44K744Or5pmC44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44KS5oyH5a6aXHJcbiAgICAgKiBAcmV0dXJucyBJUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1ha2VQcm9taXNlPFQ+KGRmOiBKUXVlcnlEZWZlcnJlZDxUPiwgb3B0aW9ucz86IE1ha2VQcm9taXNlT3B0aW9ucyB8IGNhbmNlbENhbGxiYWNrKTogSVByb21pc2U8VD4ge1xyXG4gICAgICAgIGNvbnN0IGNhbmNlbGFibGUgPSBtYWtlQ2FuY2VsYWJsZShkZiwgb3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3QgcHJvbWlzZSA9IDxJUHJvbWlzZTxUPj48YW55PmRmLnByb21pc2UoY2FuY2VsYWJsZS50YXJnZXQpO1xyXG4gICAgICAgIGlmIChudWxsID09IHByb21pc2UuYWJvcnQpIHtcclxuICAgICAgICAgICAgcHJvbWlzZS5hYm9ydCA9IGNhbmNlbGFibGUuYWJvcnQuYmluZChwcm9taXNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG51bGwgPT0gcHJvbWlzZS5kZXBlbmRPbikge1xyXG4gICAgICAgICAgICBwcm9taXNlLmRlcGVuZE9uID0gY2FuY2VsYWJsZS5kZXBlbmRPbi5iaW5kKHByb21pc2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jjga7ntYLkuobjgpLlvoXjgaRcclxuICAgICAqICQud2hlbigpIOOBr+WkseaVl+OBmeOCi+OBqOOBmeOBkOOBq+WItuW+oeOCkui/lOOBmeOBruOBq+WvvuOBl+OAgeWkseaVl+OCguWQq+OCgeOBpuW+heOBpCBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOCkui/lOWNtFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZWZlcnJlZHMgW2luXSBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiCjlj6/lpInlvJXmlbAsIOmFjeWIlylcclxuICAgICAqIEByZXR1cm5zIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiB3YWl0PFQ+KC4uLmRlZmVycmVkczogUHJvbWlzZTxUPltdKTogSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHdhaXQ8VD4oLi4uZGVmZXJyZWRzOiBKUXVlcnlHZW5lcmljUHJvbWlzZTxUPltdKTogSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHdhaXQ8VD4oLi4uZGVmZXJyZWRzOiBUW10pOiBJUHJvbWlzZUJhc2U8VD47XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gd2FpdDxUPiguLi5kZWZlcnJlZHM6IGFueVtdKTogSVByb21pc2VCYXNlPFQ+IHtcclxuXHJcbiAgICAgICAgLy8g5oqV5YWl5rOV44GM5Y+v5aSJ5byV5pWw44Gg44Gj44Gf5aC05ZCI44Gv6YWN5YiX44Gr5L+u5q2j44GZ44KLXHJcbiAgICAgICAgY29uc3QgX2RlZmVycmVkczogSlF1ZXJ5UHJvbWlzZTxUPltdID0gW10uY29uY2F0LmFwcGx5KFtdLCBkZWZlcnJlZHMpO1xyXG5cclxuICAgICAgICAvLyDlrp/pmpvjga7kvZzmpa1cclxuICAgICAgICBjb25zdCBkZiA9ICQuRGVmZXJyZWQoKTtcclxuICAgICAgICBjb25zdCByZXN1bHRzID0gW107XHJcbiAgICAgICAgbGV0IGluaXRpYWxpemVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGNvbnN0IGlzRmluaXNoZWQgPSAoKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgICAgIGlmICghaW5pdGlhbGl6ZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAhcmVzdWx0cy5zb21lKChlbGVtZW50OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJwZW5kaW5nXCIgPT09IGVsZW1lbnQuc3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBfZGVmZXJyZWRzLmZvckVhY2goKGRlZmVycmVkLCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICByZXN1bHRzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiBcInBlbmRpbmdcIixcclxuICAgICAgICAgICAgICAgIGFyZ3M6IG51bGwsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkZWZlcnJlZFxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKC4uLmFyZ3M6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1tpbmRleF0uc3RhdHVzID0gXCJyZXNvbHZlZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdLmFyZ3MgPSBhcmdzO1xyXG4gICAgICAgICAgICAgICAgfSwgKC4uLmFyZ3M6IGFueVtdKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0c1tpbmRleF0uc3RhdHVzID0gXCJyZWplY3RlZFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdLmFyZ3MgPSBhcmdzO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5hbHdheXMoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0ZpbmlzaGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmIChpc0ZpbmlzaGVkKCkpIHtcclxuICAgICAgICAgICAgZGYucmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiA8YW55PmRmLnByb21pc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44Gu5pyA5Yid44Gu5a6M5LqG44KS5b6F44GkXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRlZmVycmVkcyBbaW5dIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIKOWPr+WkieW8leaVsCwg6YWN5YiXKVxyXG4gICAgICogQHJldHVybnMgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4oLi4uZGVmZXJyZWRzOiBQcm9taXNlPFQ+W10pOiBJUHJvbWlzZUJhc2U8VD47XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmFjZTxUPiguLi5kZWZlcnJlZHM6IEpRdWVyeUdlbmVyaWNQcm9taXNlPFQ+W10pOiBJUHJvbWlzZUJhc2U8VD47XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmFjZTxUPiguLi5kZWZlcnJlZHM6IFRbXSk6IElQcm9taXNlQmFzZTxUPjtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KC4uLmRlZmVycmVkczogYW55W10pOiBJUHJvbWlzZUJhc2U8VD4ge1xyXG4gICAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZCgpO1xyXG5cclxuICAgICAgICBjb25zdCBfZGVmZXJyZWRzOiBKUXVlcnlQcm9taXNlPFQ+W10gPSBbXS5jb25jYXQuYXBwbHkoW10sIGRlZmVycmVkcyk7XHJcbiAgICAgICAgX2RlZmVycmVkcy5mb3JFYWNoKChkZWZlcnJlZCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgZGVmZXJyZWRcclxuICAgICAgICAgICAgICAgIC50aGVuKCguLi5hcmdzOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcInBlbmRpbmdcIiA9PT0gZGYuc3RhdGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZi5yZXNvbHZlKGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sICguLi5hcmdzOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcInBlbmRpbmdcIiA9PT0gZGYuc3RhdGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoYXJncyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiA8YW55PmRmLnByb21pc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFByb21pc2VNYW5hZ2VyXHJcbiAgICAgKiBAYnJpZWYg6KSH5pWw44GuIERhdGFQcm92aWRlci5Qcm9taXNlIOOCkueuoeeQhuOBmeOCi+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUHJvbWlzZU1hbmFnZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9wb29sOiB7IHByb21pc2U6IElQcm9taXNlPGFueT47IGlkOiBudW1iZXI7IH1bXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgX2lkOiBudW1iZXIgPSAwO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJvbWlzZSDjgpLnrqHnkIbkuIvjgavov73liqBcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBwcm9taXNlIFtpbl0g566h55CG5a++6LGh44Gu44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHJldHVybnMg5byV5pWw44Gr5rih44GX44Gf44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGFkZDxUPihwcm9taXNlOiBJUHJvbWlzZTxUPiB8IEpRdWVyeVhIUik6IElQcm9taXNlPFQ+IHtcclxuICAgICAgICAgICAgaWYgKHByb21pc2UgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGFib3J0KCkg44KS5oyB44Gj44Gm44GE44Gq44GE5aC05ZCI44Gv44Ko44Op44O8XHJcbiAgICAgICAgICAgIGlmICghcHJvbWlzZS5hYm9ydCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcIlthZGRdIHByb21pc2Ugb2JqZWN0IGRvZXNuJ3QgaGF2ZSAnYWJvcnQoKScgbWV0aG9kLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiA8YW55PnByb21pc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvb2tpZSA9IHtcclxuICAgICAgICAgICAgICAgIHByb21pc2U6IDxhbnk+cHJvbWlzZSxcclxuICAgICAgICAgICAgICAgIGlkOiB0aGlzLl9pZCsrLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcG9vbC5wdXNoKGNvb2tpZSk7XHJcblxyXG4gICAgICAgICAgICAoPGFueT5wcm9taXNlKVxyXG4gICAgICAgICAgICAgICAgLmFsd2F5cygoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcG9vbCA9IHRoaXMuX3Bvb2wuZmlsdGVyKChlbGVtZW50OiB7IHByb21pc2U6IElQcm9taXNlPGFueT47IGlkOiBudW1iZXI7IH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuaWQgIT09IGNvb2tpZS5pZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+cHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeuoeeQhuWvvuixoeOBriBQcm9taXNlIOOBq+WvvuOBl+OBpiBhYm9ydCDjgpLnmbrooYxcclxuICAgICAgICAgKiDjgq3jg6Pjg7Pjgrvjg6vlh6bnkIbjgavlr77jgZnjgovjgq3jg6Pjg7Pjgrvjg6vjga/kuI3lj69cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNhbmNlbChpbmZvPzogYW55KTogSVByb21pc2VCYXNlPGFueT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9taXNlcyA9IHRoaXMucHJvbWlzZXMoKTtcclxuICAgICAgICAgICAgcHJvbWlzZXMuZm9yRWFjaCgoZWxlbWVudDogSVByb21pc2U8YW55PikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQuYWJvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFib3J0KGluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHdhaXQuYXBwbHkobnVsbCwgcHJvbWlzZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog566h55CG5a++6LGh44GuIFByb21pc2Ug44KS6YWN5YiX44Gn6L+U44GZXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOmFjeWIl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBwcm9taXNlcygpOiBJUHJvbWlzZTxhbnk+W10ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcG9vbC5tYXAoKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBlbGVtZW50LnByb21pc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFByb21pc2VDb25zdHJ1Y3RvclxyXG4gICAgICogQGJyaWVmIEVTNiBQcm9taXNlIOS6kuaPm+OBriBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUHJvbWlzZUNvbnN0cnVjdG9yPFQ+IGltcGxlbWVudHMgSVByb21pc2U8VD4ge1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIG1peGluOiBuYXRpdmUgUHJvbWlzZVxyXG5cclxuICAgICAgICB0aGVuOiA8VFJlc3VsdDEgPSBULCBUUmVzdWx0MiA9IG5ldmVyPihcclxuICAgICAgICAgICAgb25mdWxmaWxsZWQ/OiAoXHJcbiAgICAgICAgICAgICAgICAodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+XHJcbiAgICAgICAgICAgICkgfCB1bmRlZmluZWQgfCBudWxsLFxyXG4gICAgICAgICAgICBvbnJlamVjdGVkPzogKFxyXG4gICAgICAgICAgICAgICAgKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPlxyXG4gICAgICAgICAgICApIHwgdW5kZWZpbmVkIHwgbnVsbFxyXG4gICAgICAgICkgPT4gSVByb21pc2U8VFJlc3VsdDEgfCBUUmVzdWx0Mj47XHJcblxyXG4gICAgICAgIGNhdGNoOiA8VFJlc3VsdCA9IG5ldmVyPihcclxuICAgICAgICAgICAgb25yZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQgfCBQcm9taXNlTGlrZTxUUmVzdWx0PikgfCB1bmRlZmluZWQgfCBudWxsXHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZUJhc2U8VFJlc3VsdD47XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gbWl4aW46IEpRdWVyeVByb21pc2VcclxuXHJcbiAgICAgICAgc3RhdGU6ICgpID0+IHN0cmluZztcclxuICAgICAgICBhbHdheXM6IChcclxuICAgICAgICAgICAgYWx3YXlzQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdLFxyXG4gICAgICAgICAgICAuLi5hbHdheXNDYWxsYmFja3NOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgICAgICBkb25lOiAoXHJcbiAgICAgICAgICAgIGRvbmVDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD5bXSxcclxuICAgICAgICAgICAgLi4uZG9uZUNhbGxiYWNrTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgICAgICBmYWlsOiAoXHJcbiAgICAgICAgICAgIGZhaWxDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10sXHJcbiAgICAgICAgICAgIC4uLmZhaWxDYWxsYmFja3NOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgICAgICBwcm9ncmVzczogKFxyXG4gICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4ucHJvZ3Jlc3NDYWxsYmFja046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIG1peGluOiBKUXVlcnlEZWZlcnJlZFxyXG5cclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuICAgICAgICBwcml2YXRlIG5vdGlmeTogKHZhbHVlPzogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gSlF1ZXJ5RGVmZXJyZWQ8VD47XHJcbiAgICAgICAgcHJpdmF0ZSBub3RpZnlXaXRoOiAoY29udGV4dDogYW55LCB2YWx1ZT86IGFueVtdKSA9PiBKUXVlcnlEZWZlcnJlZDxUPjtcclxuICAgICAgICBwcml2YXRlIHJlamVjdDogKHZhbHVlPzogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gSlF1ZXJ5RGVmZXJyZWQ8VD47XHJcbiAgICAgICAgcHJpdmF0ZSByZWplY3RXaXRoOiAoY29udGV4dDogYW55LCB2YWx1ZT86IGFueVtdKSA9PiBKUXVlcnlEZWZlcnJlZDxUPjtcclxuICAgICAgICBwcml2YXRlIHJlc29sdmU6ICh2YWx1ZT86IFQsIC4uLmFyZ3M6IGFueVtdKSA9PiBKUXVlcnlEZWZlcnJlZDxUPjtcclxuICAgICAgICBwcml2YXRlIHJlc29sdmVXaXRoOiAoY29udGV4dDogYW55LCB2YWx1ZT86IFRbXSkgPT4gSlF1ZXJ5RGVmZXJyZWQ8VD47XHJcbiAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBtaXhpbjogSVByb2ltaXNlXHJcblxyXG4gICAgICAgIGFib3J0OiAoaW5mbz86IGFueSkgPT4gdm9pZDtcclxuICAgICAgICBkZXBlbmRPbjogPFU+KHByb21pc2U6IElQcm9taXNlPFU+IHwgSlF1ZXJ5WEhSKSA9PiBJUHJvbWlzZTxVPjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBleGVjdXRvciBbaW5dIEVTNiBQcm9taXNlIOS6kuaPm+W8leaVsC4gKGRlcGVuZE9uIOOCkuesrDPlvJXmlbDjgavmuKHjgZkpXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnM/IFtpbl0galF1ZXJ5UHJvbWlzZSDjgpLmi6HlvLXjgZnjgovjgqrjg5bjgrjjgqfjgq/jg4ggb3Ig44Kt44Oj44Oz44K744Or5pmC44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiBJUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgZXhlY3V0b3I6IChcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6ICh2YWx1ZT86IFQgfCBQcm9taXNlTGlrZTxUPikgPT4gdm9pZCxcclxuICAgICAgICAgICAgICAgIHJlamVjdD86IChyZWFzb24/OiBhbnkpID0+IHZvaWQsXHJcbiAgICAgICAgICAgICAgICBkZXBlbmRPbj86IDxVPihwcm9taXNlOiBJUHJvbWlzZTxVPiB8IEpRdWVyeVhIUikgPT4gSVByb21pc2U8VT4sXHJcbiAgICAgICAgICAgICkgPT4gdm9pZCxcclxuICAgICAgICAgICAgb3B0aW9ucz86IE1ha2VQcm9taXNlT3B0aW9ucyB8IGNhbmNlbENhbGxiYWNrXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vIGFwcGx5IG1peGluXHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmNlbGFibGUgPSBtYWtlQ2FuY2VsYWJsZSgkLkRlZmVycmVkKCksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCB0aGlzLCBjYW5jZWxhYmxlLmRmLCBjYW5jZWxhYmxlLnRhcmdldCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWJvcnQgPSBjYW5jZWxhYmxlLmFib3J0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuZGVwZW5kT24gPSBjYW5jZWxhYmxlLmRlcGVuZE9uLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBleGVjdXRvcih0aGlzLnJlc29sdmUsIHRoaXMucmVqZWN0LCB0aGlzLmRlcGVuZE9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gc3RhdGljIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIHN0YXRpYyByZXNvbHZlPFU+KHZhbHVlPzogVSB8IFByb21pc2VMaWtlPFU+KTogSVByb21pc2VCYXNlPFU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+JC5EZWZlcnJlZCgpLnJlc29sdmUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIHJlamVjdDxVPihyZWFzb24/OiBhbnkpOiBQcm9taXNlPFU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+JC5EZWZlcnJlZCgpLnJlamVjdChyZWFzb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGFsbDxVPiguLi5kZWZlcnJlZHM6IEFycmF5PFUgfCBJUHJvbWlzZTxVPiB8IEpRdWVyeVByb21pc2U8VT4+KTogSVByb21pc2VCYXNlPFU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+JC53aGVuKGRlZmVycmVkcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgd2FpdDxVPiguLi5kZWZlcnJlZHM6IEFycmF5PFUgfCBJUHJvbWlzZTxVPiB8IEpRdWVyeVByb21pc2U8VT4+KTogSVByb21pc2VCYXNlPFU+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+d2FpdChkZWZlcnJlZHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIHJhY2U8VT4oLi4uZGVmZXJyZWRzOiBBcnJheTxVIHwgSVByb21pc2U8VT4gfCBKUXVlcnlQcm9taXNlPFU+Pik6IElQcm9taXNlQmFzZTxVPiB7XHJcbiAgICAgICAgICAgIHJldHVybiA8YW55PnJhY2UoZGVmZXJyZWRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IFByb21pc2UgPSBQcm9taXNlQ29uc3RydWN0b3I7XHJcbn1cclxuXHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcImNkcC5wcm9taXNlXCIge1xyXG4gICAgZXhwb3J0ID0gQ0RQO1xyXG59XHJcbiJdfQ==