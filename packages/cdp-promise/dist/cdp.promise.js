/*!
 * cdp.promise.js 2.0.0
 *
 * Date: 2017-07-03T02:12:40.268Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(["jquery"], function ($) { return factory(root.CDP || (root.CDP = {}), $); }); } else if (typeof exports === "object") { module.exports = factory(root.CDP || (root.CDP = {}), require("jquery")); } else { factory(root.CDP || (root.CDP = {}), root.jQuery || root.$); } }(((this || 0).self || global), function (CDP, $) {
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

return CDP; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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ID0gXCJbQ0RQLlByb21pc2VdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJUHJvbWlzZUJhc2VcclxuICAgICAqIEBicmllZiBOYXRpdmUgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jjga7mi6HlvLXjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnlrprnvqlcclxuICAgICAqICAgICAgICDjgq3jg6Pjg7Pjgrvjg6vjgZXjgZvjgZ/jgY/jgarjgYTjgYwgYWx3YXlzKCkg44Gq44GpIGpRdWVyeSBtZXRob2Qg44KS5o+Q5L6b44GX44Gf44GE5aC05ZCI44Gr5L2/55So44GZ44KLLlxyXG4gICAgICogICAgICAgIE5hdGl2ZSDjgqrjg5bjgrjjgqfjgq/jg4jjga7mi6HlvLXlrp/oo4Xjga/nhKHjgYTjgZ/jgoHjgIFnbG9iYWwg44Gr44Gv5a6a576p44GX44Gq44GELlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElQcm9taXNlQmFzZTxUPiBleHRlbmRzIFByb21pc2U8VD4ge1xyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gUHJvbWlzZSBleHRlbmRzOlxyXG5cclxuICAgICAgICB0aGVuPFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXG4gICAgICAgICAgICBvbmZ1bGZpbGxlZD86IChcbiAgICAgICAgICAgICAgICAodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+XG4gICAgICAgICAgICApIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgIG9ucmVqZWN0ZWQ/OiAoXG4gICAgICAgICAgICAgICAgKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPlxuICAgICAgICAgICAgKSB8IHVuZGVmaW5lZCB8IG51bGxcbiAgICAgICAgKTogSVByb21pc2VCYXNlPFRSZXN1bHQxIHwgVFJlc3VsdDI+O1xuXHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSlF1ZXJ5UHJvbWlzZSBzdHVmZjpcclxuXHJcbiAgICAgICAgc3RhdGU6ICgpID0+IHN0cmluZztcclxuICAgICAgICBhbHdheXM6IChcclxuICAgICAgICAgICAgYWx3YXlzQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdLFxyXG4gICAgICAgICAgICAuLi5hbHdheXNDYWxsYmFja3NOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZUJhc2U8VD47XHJcbiAgICAgICAgZG9uZTogKFxyXG4gICAgICAgICAgICBkb25lQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+W10sXHJcbiAgICAgICAgICAgIC4uLmRvbmVDYWxsYmFja046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxUPiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxUPltdPlxyXG4gICAgICAgICkgPT4gSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgICAgIGZhaWw6IChcclxuICAgICAgICAgICAgZmFpbENhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4uZmFpbENhbGxiYWNrc046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlQmFzZTxUPjtcclxuICAgICAgICBwcm9ncmVzczogKFxyXG4gICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4ucHJvZ3Jlc3NDYWxsYmFja046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlQmFzZTxUPjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSVByb21pc2VcclxuICAgICAqIEBicmllZiDjgq3jg6Pjg7Pjgrvjg6vlj6/og73jgaogUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jjga7jgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnlrprnvqlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUHJvbWlzZTxUPiBleHRlbmRzIElQcm9taXNlQmFzZTxUPiB7XHJcbiAgICAgICAgLy8hIOOCreODo+ODs+OCu+ODq+WHpueQhlxyXG4gICAgICAgIGFib3J0KGluZm8/OiBhbnkpOiB2b2lkO1xyXG4gICAgICAgIC8vISDkvp3lrZjjgZnjgosgcHJvbWlzZS5cclxuICAgICAgICBkZXBlbmRlbmN5PzogSVByb21pc2U8YW55PjtcclxuICAgICAgICAvLyEgYWJvcnQg5pmC44Gr6Ieq6Lqr44KCIHJlamVjdFxyXG4gICAgICAgIGNhbGxSZWplY3Q/OiBib29sZWFuO1xyXG4gICAgICAgIC8vISDkvp3lrZjjgZnjgosgcHJvbWlzZSDjgpLoqK3lrppcclxuICAgICAgICBkZXBlbmRPbjxVPihwcm9taXNlOiBJUHJvbWlzZTxVPiB8IEpRdWVyeVhIUik6IElQcm9taXNlPFU+O1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIFByb21pc2UgZXh0ZW5kczpcclxuXHJcbiAgICAgICAgdGhlbjxUUmVzdWx0MSA9IFQsIFRSZXN1bHQyID0gbmV2ZXI+KFxuICAgICAgICAgICAgb25mdWxmaWxsZWQ/OiAoXG4gICAgICAgICAgICAgICAgKHZhbHVlOiBUKSA9PiBUUmVzdWx0MSB8IFByb21pc2VMaWtlPFRSZXN1bHQxPlxuICAgICAgICAgICAgKSB8IHVuZGVmaW5lZCB8IG51bGwsXG4gICAgICAgICAgICBvbnJlamVjdGVkPzogKFxuICAgICAgICAgICAgICAgIChyZWFzb246IGFueSkgPT4gVFJlc3VsdDIgfCBQcm9taXNlTGlrZTxUUmVzdWx0Mj5cbiAgICAgICAgICAgICkgfCB1bmRlZmluZWQgfCBudWxsXG4gICAgICAgICk6IElQcm9taXNlPFRSZXN1bHQxIHwgVFJlc3VsdDI+O1xuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBKUXVlcnlQcm9taXNlIHN0dWZmOlxyXG5cclxuICAgICAgICBzdGF0ZTogKCkgPT4gc3RyaW5nO1xyXG4gICAgICAgIGFsd2F5czogKFxyXG4gICAgICAgICAgICBhbHdheXNDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10sXHJcbiAgICAgICAgICAgIC4uLmFsd2F5c0NhbGxiYWNrc046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG4gICAgICAgIGRvbmU6IChcclxuICAgICAgICAgICAgZG9uZUNhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxUPiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxUPltdLFxyXG4gICAgICAgICAgICAuLi5kb25lQ2FsbGJhY2tOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG4gICAgICAgIGZhaWw6IChcclxuICAgICAgICAgICAgZmFpbENhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4uZmFpbENhbGxiYWNrc046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG4gICAgICAgIHByb2dyZXNzOiAoXHJcbiAgICAgICAgICAgIHByb2dyZXNzQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdLFxyXG4gICAgICAgICAgICAuLi5wcm9ncmVzc0NhbGxiYWNrTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdPlxyXG4gICAgICAgICkgPT4gSVByb21pc2U8VD47XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1ha2VQcm9taXNlIOOBq+aMh+WumuWPr+iDveOBqiBjYW5jZWwgY2FsbGJhY2sg44GuIGFsaWFzLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdHlwZSBjYW5jZWxDYWxsYmFjayA9IChkZXRhaWw/OiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIE1ha2VQcm9taXNlT3B0aW9uc1xyXG4gICAgICogQGJyaWVmICAgICBtYWtlUHJvbWlzZSDjgavmuKHjgZvjgovjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBNYWtlUHJvbWlzZU9wdGlvbnMge1xyXG4gICAgICAgIGRlcGVuZGVuY3k/OiBJUHJvbWlzZTxhbnk+OyAgICAgICAgIC8vITwg5L6d5a2Y44GZ44KLIHByb21pc2Ug44KS6Kit5a6aXHJcbiAgICAgICAgY2FsbFJlamVjdD86IGJvb2xlYW47ICAgICAgICAgICAgICAgLy8hPCBhYm9ydCDmmYLjgavoh6rouqvjgoIgcmVqZWN0XHJcbiAgICAgICAgY2FuY2VsQ2FsbGJhY2s/OiBjYW5jZWxDYWxsYmFjazsgICAgLy8hPCDjgq3jg6Pjg7Pjgrvjg6vmmYLjgavlkbzjgbDjgozjgovplqLmlbBcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7ICAgICAgICAgICAgICAgICAvLyE8IOaLoeW8teODkeODqeODoeODvOOCv1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2FuY2VsIOWPr+iDveOCquODluOCuOOCp+OCr+ODiOOBruS9nOaIkFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZiAgICAgICBbaW5dIGpRdWVyeURlZmVycmVkIGluc3RhbmNlIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIG9wdGlvbnM/IFtpbl0galF1ZXJ5UHJvbWlzZSDjgpLmi6HlvLXjgZnjgovjgqrjg5bjgrjjgqfjgq/jg4ggb3Ig44Kt44Oj44Oz44K744Or5pmC44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44KS5oyH5a6aXHJcbiAgICAgKiBAcmV0dXJucyB7T2JqZWN0fSBDYW5jZWxhYmxlIHByb3BlcnR5XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1ha2VDYW5jZWxhYmxlPFQ+KFxyXG4gICAgICAgIGRmOiBKUXVlcnlEZWZlcnJlZDxUPixcclxuICAgICAgICBvcHRpb25zPzogTWFrZVByb21pc2VPcHRpb25zIHwgY2FuY2VsQ2FsbGJhY2tcclxuICAgICk6IHsgZGY6IEpRdWVyeURlZmVycmVkPFQ+LCB0YXJnZXQ6IG9iamVjdDsgYWJvcnQ6IChpbmZvPzogYW55KSA9PiB2b2lkOyBkZXBlbmRPbjogKHByb21pc2U6IGFueSkgPT4gSlF1ZXJ5UHJvbWlzZTxhbnk+IH0ge1xyXG4gICAgICAgIGxldCBleHRlbmRPcHRpb25zOiBNYWtlUHJvbWlzZU9wdGlvbnM7XHJcbiAgICAgICAgbGV0IGNhbmNlbDogY2FuY2VsQ2FsbGJhY2s7XHJcblxyXG4gICAgICAgIGlmIChcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGNhbmNlbCA9IDxjYW5jZWxDYWxsYmFjaz5vcHRpb25zO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGV4dGVuZE9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgICAgICBpZiAoZXh0ZW5kT3B0aW9ucyAmJiBleHRlbmRPcHRpb25zLmNhbmNlbENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjYW5jZWwgPSBleHRlbmRPcHRpb25zLmNhbmNlbENhbGxiYWNrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2FuY2VsID0gKCkgPT4geyAvKiBub29wICovIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IF9hYm9ydCA9IGZ1bmN0aW9uIChpbmZvPzogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9IGluZm8gPyBpbmZvIDogeyBtZXNzYWdlOiBcImFib3J0XCIgfTtcclxuICAgICAgICAgICAgY2FuY2VsKGRldGFpbCk7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuZGVwZW5kZW5jeSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW5jeS5hYm9ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jeS5hYm9ydChkZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiW2NhbGxdIGRlcGVuZGVuY3kgb2JqZWN0IGRvZXNuJ3QgaGF2ZSAnYWJvcnQoKScgbWV0aG9kLlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNhbGxSZWplY3QgJiYgXCJwZW5kaW5nXCIgPT09IHRoaXMuc3RhdGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChkZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKFwicGVuZGluZ1wiID09PSB0aGlzLnN0YXRlKCkpIHtcclxuICAgICAgICAgICAgICAgIGRmLnJlamVjdChkZXRhaWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2RlcGVuZE9uID0gZnVuY3Rpb24gKHByb21pc2U6IGFueSk6IEpRdWVyeVByb21pc2U8YW55PiB7XHJcbiAgICAgICAgICAgIGlmIChwcm9taXNlLmFib3J0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlcGVuZGVuY3kgPSBwcm9taXNlO1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZVxyXG4gICAgICAgICAgICAgICAgICAgIC5hbHdheXMoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlcGVuZGVuY3kgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcIltzZXRdIGRlcGVuZGVuY3kgb2JqZWN0IGRvZXNuJ3QgaGF2ZSAnYWJvcnQoKScgbWV0aG9kLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfdGFyZ2V0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgZGVwZW5kZW5jeTogbnVsbCxcclxuICAgICAgICAgICAgY2FsbFJlamVjdDogZmFsc2UsXHJcbiAgICAgICAgfSwgZXh0ZW5kT3B0aW9ucyk7XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGRmOiBkZixcclxuICAgICAgICAgICAgdGFyZ2V0OiBfdGFyZ2V0LFxyXG4gICAgICAgICAgICBhYm9ydDogX2Fib3J0LFxyXG4gICAgICAgICAgICBkZXBlbmRPbjogX2RlcGVuZE9uLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOBruS9nOaIkFxyXG4gICAgICogalF1ZXJ5RGVmZXJyZWQg44Kq44OW44K444Kn44Kv44OI44GL44KJ44CBVG9vbHMuUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jjgpLkvZzmiJDjgZnjgotcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGYgICAgICAgW2luXSBqUXVlcnlEZWZlcnJlZCBpbnN0YW5jZSDjgpLmjIflrppcclxuICAgICAqIEBwYXJhbSBvcHRpb25zPyBbaW5dIGpRdWVyeVByb21pc2Ug44KS5ouh5by144GZ44KL44Kq44OW44K444Kn44Kv44OIIG9yIOOCreODo+ODs+OCu+ODq+aZguOBq+WRvOOBs+WHuuOBleOCjOOCi+mWouaVsOOCkuaMh+WumlxyXG4gICAgICogQHJldHVybnMgSVByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBtYWtlUHJvbWlzZTxUPihkZjogSlF1ZXJ5RGVmZXJyZWQ8VD4sIG9wdGlvbnM/OiBNYWtlUHJvbWlzZU9wdGlvbnMgfCBjYW5jZWxDYWxsYmFjayk6IElQcm9taXNlPFQ+IHtcclxuICAgICAgICBjb25zdCBjYW5jZWxhYmxlID0gbWFrZUNhbmNlbGFibGUoZGYsIG9wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0IHByb21pc2UgPSA8SVByb21pc2U8VD4+PGFueT5kZi5wcm9taXNlKGNhbmNlbGFibGUudGFyZ2V0KTtcclxuICAgICAgICBpZiAobnVsbCA9PSBwcm9taXNlLmFib3J0KSB7XHJcbiAgICAgICAgICAgIHByb21pc2UuYWJvcnQgPSBjYW5jZWxhYmxlLmFib3J0LmJpbmQocHJvbWlzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChudWxsID09IHByb21pc2UuZGVwZW5kT24pIHtcclxuICAgICAgICAgICAgcHJvbWlzZS5kZXBlbmRPbiA9IGNhbmNlbGFibGUuZGVwZW5kT24uYmluZChwcm9taXNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44Gu57WC5LqG44KS5b6F44GkXHJcbiAgICAgKiAkLndoZW4oKSDjga/lpLHmlZfjgZnjgovjgajjgZnjgZDjgavliLblvqHjgpLov5TjgZnjga7jgavlr77jgZfjgIHlpLHmlZfjgoLlkKvjgoHjgablvoXjgaQgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jjgpLov5TljbRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGVmZXJyZWRzIFtpbl0gUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4go5Y+v5aSJ5byV5pWwLCDphY3liJcpXHJcbiAgICAgKiBAcmV0dXJucyBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gd2FpdDxUPiguLi5kZWZlcnJlZHM6IFByb21pc2U8VD5bXSk6IElQcm9taXNlQmFzZTxUPjtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiB3YWl0PFQ+KC4uLmRlZmVycmVkczogSlF1ZXJ5R2VuZXJpY1Byb21pc2U8VD5bXSk6IElQcm9taXNlQmFzZTxUPjtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiB3YWl0PFQ+KC4uLmRlZmVycmVkczogVFtdKTogSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHdhaXQ8VD4oLi4uZGVmZXJyZWRzOiBhbnlbXSk6IElQcm9taXNlQmFzZTxUPiB7XHJcblxyXG4gICAgICAgIC8vIOaKleWFpeazleOBjOWPr+WkieW8leaVsOOBoOOBo+OBn+WgtOWQiOOBr+mFjeWIl+OBq+S/ruato+OBmeOCi1xyXG4gICAgICAgIGNvbnN0IF9kZWZlcnJlZHM6IEpRdWVyeVByb21pc2U8VD5bXSA9IFtdLmNvbmNhdC5hcHBseShbXSwgZGVmZXJyZWRzKTtcclxuXHJcbiAgICAgICAgLy8g5a6f6Zqb44Gu5L2c5qWtXHJcbiAgICAgICAgY29uc3QgZGYgPSAkLkRlZmVycmVkKCk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgIGxldCBpbml0aWFsaXplZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICBjb25zdCBpc0ZpbmlzaGVkID0gKCk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWluaXRpYWxpemVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gIXJlc3VsdHMuc29tZSgoZWxlbWVudDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwicGVuZGluZ1wiID09PSBlbGVtZW50LnN0YXR1cztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgX2RlZmVycmVkcy5mb3JFYWNoKChkZWZlcnJlZCwgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIHN0YXR1czogXCJwZW5kaW5nXCIsXHJcbiAgICAgICAgICAgICAgICBhcmdzOiBudWxsLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZGVmZXJyZWRcclxuICAgICAgICAgICAgICAgIC50aGVuKCguLi5hcmdzOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdLnN0YXR1cyA9IFwicmVzb2x2ZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2luZGV4XS5hcmdzID0gYXJncztcclxuICAgICAgICAgICAgICAgIH0sICguLi5hcmdzOiBhbnlbXSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdHNbaW5kZXhdLnN0YXR1cyA9IFwicmVqZWN0ZWRcIjtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRzW2luZGV4XS5hcmdzID0gYXJncztcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuYWx3YXlzKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNGaW5pc2hlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGluaXRpYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICBpZiAoaXNGaW5pc2hlZCgpKSB7XHJcbiAgICAgICAgICAgIGRmLnJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gPGFueT5kZi5wcm9taXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOBruacgOWIneOBruWujOS6huOCkuW+heOBpFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZWZlcnJlZHMgW2luXSBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiCjlj6/lpInlvJXmlbAsIOmFjeWIlylcclxuICAgICAqIEByZXR1cm5zIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KC4uLmRlZmVycmVkczogUHJvbWlzZTxUPltdKTogSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4oLi4uZGVmZXJyZWRzOiBKUXVlcnlHZW5lcmljUHJvbWlzZTxUPltdKTogSVByb21pc2VCYXNlPFQ+O1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4oLi4uZGVmZXJyZWRzOiBUW10pOiBJUHJvbWlzZUJhc2U8VD47XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmFjZTxUPiguLi5kZWZlcnJlZHM6IGFueVtdKTogSVByb21pc2VCYXNlPFQ+IHtcclxuICAgICAgICBjb25zdCBkZiA9ICQuRGVmZXJyZWQoKTtcclxuXHJcbiAgICAgICAgY29uc3QgX2RlZmVycmVkczogSlF1ZXJ5UHJvbWlzZTxUPltdID0gW10uY29uY2F0LmFwcGx5KFtdLCBkZWZlcnJlZHMpO1xyXG4gICAgICAgIF9kZWZlcnJlZHMuZm9yRWFjaCgoZGVmZXJyZWQsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGRlZmVycmVkXHJcbiAgICAgICAgICAgICAgICAudGhlbigoLi4uYXJnczogYW55W10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJwZW5kaW5nXCIgPT09IGRmLnN0YXRlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVzb2x2ZShhcmdzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAoLi4uYXJnczogYW55W10pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJwZW5kaW5nXCIgPT09IGRmLnN0YXRlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gPGFueT5kZi5wcm9taXNlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQcm9taXNlTWFuYWdlclxyXG4gICAgICogQGJyaWVmIOikh+aVsOOBriBEYXRhUHJvdmlkZXIuUHJvbWlzZSDjgpLnrqHnkIbjgZnjgovjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFByb21pc2VNYW5hZ2VyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfcG9vbDogeyBwcm9taXNlOiBJUHJvbWlzZTxhbnk+OyBpZDogbnVtYmVyOyB9W10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIF9pZDogbnVtYmVyID0gMDtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFByb21pc2Ug44KS566h55CG5LiL44Gr6L+95YqgXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcHJvbWlzZSBbaW5dIOeuoeeQhuWvvuixoeOBruOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEByZXR1cm5zIOW8leaVsOOBq+a4oeOBl+OBn+OCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBhZGQ8VD4ocHJvbWlzZTogSVByb21pc2U8VD4gfCBKUXVlcnlYSFIpOiBJUHJvbWlzZTxUPiB7XHJcbiAgICAgICAgICAgIGlmIChwcm9taXNlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBhYm9ydCgpIOOCkuaMgeOBo+OBpuOBhOOBquOBhOWgtOWQiOOBr+OCqOODqeODvFxyXG4gICAgICAgICAgICBpZiAoIXByb21pc2UuYWJvcnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJbYWRkXSBwcm9taXNlIG9iamVjdCBkb2Vzbid0IGhhdmUgJ2Fib3J0KCknIG1ldGhvZC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gPGFueT5wcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb29raWUgPSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlOiA8YW55PnByb21pc2UsXHJcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5faWQrKyxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Bvb2wucHVzaChjb29raWUpO1xyXG5cclxuICAgICAgICAgICAgKDxhbnk+cHJvbWlzZSlcclxuICAgICAgICAgICAgICAgIC5hbHdheXMoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Bvb2wgPSB0aGlzLl9wb29sLmZpbHRlcigoZWxlbWVudDogeyBwcm9taXNlOiBJUHJvbWlzZTxhbnk+OyBpZDogbnVtYmVyOyB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmlkICE9PSBjb29raWUuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiA8YW55PnByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnrqHnkIblr77osaHjga4gUHJvbWlzZSDjgavlr77jgZfjgaYgYWJvcnQg44KS55m66KGMXHJcbiAgICAgICAgICog44Kt44Oj44Oz44K744Or5Yem55CG44Gr5a++44GZ44KL44Kt44Oj44Oz44K744Or44Gv5LiN5Y+vXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBjYW5jZWwoaW5mbz86IGFueSk6IElQcm9taXNlQmFzZTxhbnk+IHtcclxuICAgICAgICAgICAgY29uc3QgcHJvbWlzZXMgPSB0aGlzLnByb21pc2VzKCk7XHJcbiAgICAgICAgICAgIHByb21pc2VzLmZvckVhY2goKGVsZW1lbnQ6IElQcm9taXNlPGFueT4pID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50LmFib3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5hYm9ydChpbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiB3YWl0LmFwcGx5KG51bGwsIHByb21pc2VzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeuoeeQhuWvvuixoeOBriBQcm9taXNlIOOCkumFjeWIl+OBp+i/lOOBmVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jphY3liJdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgcHJvbWlzZXMoKTogSVByb21pc2U8YW55PltdIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Bvb2wubWFwKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZWxlbWVudC5wcm9taXNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQcm9taXNlQ29uc3RydWN0b3JcclxuICAgICAqIEBicmllZiBFUzYgUHJvbWlzZSDkupLmj5vjga4gUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jjgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFByb21pc2VDb25zdHJ1Y3RvcjxUPiBpbXBsZW1lbnRzIElQcm9taXNlPFQ+IHtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBtaXhpbjogbmF0aXZlIFByb21pc2VcclxuXHJcbiAgICAgICAgdGhlbjogPFRSZXN1bHQxID0gVCwgVFJlc3VsdDIgPSBuZXZlcj4oXG4gICAgICAgICAgICBvbmZ1bGZpbGxlZD86IChcbiAgICAgICAgICAgICAgICAodmFsdWU6IFQpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+XG4gICAgICAgICAgICApIHwgdW5kZWZpbmVkIHwgbnVsbCxcbiAgICAgICAgICAgIG9ucmVqZWN0ZWQ/OiAoXG4gICAgICAgICAgICAgICAgKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPlxuICAgICAgICAgICAgKSB8IHVuZGVmaW5lZCB8IG51bGxcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUUmVzdWx0MSB8IFRSZXN1bHQyPjtcblxyXG4gICAgICAgIGNhdGNoOiA8VFJlc3VsdCA9IG5ldmVyPihcclxuICAgICAgICAgICAgb25yZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQgfCBQcm9taXNlTGlrZTxUUmVzdWx0PikgfCB1bmRlZmluZWQgfCBudWxsXHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZUJhc2U8VFJlc3VsdD47XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gbWl4aW46IEpRdWVyeVByb21pc2VcclxuXHJcbiAgICAgICAgc3RhdGU6ICgpID0+IHN0cmluZztcclxuICAgICAgICBhbHdheXM6IChcclxuICAgICAgICAgICAgYWx3YXlzQ2FsbGJhY2sxPzogSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PltdLFxyXG4gICAgICAgICAgICAuLi5hbHdheXNDYWxsYmFja3NOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgICAgICBkb25lOiAoXHJcbiAgICAgICAgICAgIGRvbmVDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD4gfCBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8VD5bXSxcclxuICAgICAgICAgICAgLi4uZG9uZUNhbGxiYWNrTjogQXJyYXk8SlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPFQ+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgICAgICBmYWlsOiAoXHJcbiAgICAgICAgICAgIGZhaWxDYWxsYmFjazE/OiBKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10sXHJcbiAgICAgICAgICAgIC4uLmZhaWxDYWxsYmFja3NOOiBBcnJheTxKUXVlcnlQcm9taXNlQ2FsbGJhY2s8YW55PiB8IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+W10+XHJcbiAgICAgICAgKSA9PiBJUHJvbWlzZTxUPjtcclxuICAgICAgICBwcm9ncmVzczogKFxyXG4gICAgICAgICAgICBwcm9ncmVzc0NhbGxiYWNrMT86IEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXSxcclxuICAgICAgICAgICAgLi4ucHJvZ3Jlc3NDYWxsYmFja046IEFycmF5PEpRdWVyeVByb21pc2VDYWxsYmFjazxhbnk+IHwgSlF1ZXJ5UHJvbWlzZUNhbGxiYWNrPGFueT5bXT5cclxuICAgICAgICApID0+IElQcm9taXNlPFQ+O1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIG1peGluOiBKUXVlcnlEZWZlcnJlZFxyXG5cclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuICAgICAgICBwcml2YXRlIG5vdGlmeTogKHZhbHVlPzogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gSlF1ZXJ5RGVmZXJyZWQ8VD47XHJcbiAgICAgICAgcHJpdmF0ZSBub3RpZnlXaXRoOiAoY29udGV4dDogYW55LCB2YWx1ZT86IGFueVtdKSA9PiBKUXVlcnlEZWZlcnJlZDxUPjtcclxuICAgICAgICBwcml2YXRlIHJlamVjdDogKHZhbHVlPzogYW55LCAuLi5hcmdzOiBhbnlbXSkgPT4gSlF1ZXJ5RGVmZXJyZWQ8VD47XHJcbiAgICAgICAgcHJpdmF0ZSByZWplY3RXaXRoOiAoY29udGV4dDogYW55LCB2YWx1ZT86IGFueVtdKSA9PiBKUXVlcnlEZWZlcnJlZDxUPjtcclxuICAgICAgICBwcml2YXRlIHJlc29sdmU6ICh2YWx1ZT86IFQsIC4uLmFyZ3M6IGFueVtdKSA9PiBKUXVlcnlEZWZlcnJlZDxUPjtcclxuICAgICAgICBwcml2YXRlIHJlc29sdmVXaXRoOiAoY29udGV4dDogYW55LCB2YWx1ZT86IFRbXSkgPT4gSlF1ZXJ5RGVmZXJyZWQ8VD47XHJcbiAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBtaXhpbjogSVByb2ltaXNlXHJcblxyXG4gICAgICAgIGFib3J0OiAoaW5mbz86IGFueSkgPT4gdm9pZDtcclxuICAgICAgICBkZXBlbmRPbjogPFU+KHByb21pc2U6IElQcm9taXNlPFU+IHwgSlF1ZXJ5WEhSKSA9PiBJUHJvbWlzZTxVPjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBleGVjdXRvciBbaW5dIEVTNiBQcm9taXNlIOS6kuaPm+W8leaVsC4gKGRlcGVuZE9uIOOCkuesrDPlvJXmlbDjgavmuKHjgZkpXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnM/IFtpbl0galF1ZXJ5UHJvbWlzZSDjgpLmi6HlvLXjgZnjgovjgqrjg5bjgrjjgqfjgq/jg4ggb3Ig44Kt44Oj44Oz44K744Or5pmC44Gr5ZG844Gz5Ye644GV44KM44KL6Zai5pWw44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiBJUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgZXhlY3V0b3I6IChcclxuICAgICAgICAgICAgICAgIHJlc29sdmU6ICh2YWx1ZT86IFQgfCBQcm9taXNlTGlrZTxUPikgPT4gdm9pZCxcclxuICAgICAgICAgICAgICAgIHJlamVjdD86IChyZWFzb24/OiBhbnkpID0+IHZvaWQsXHJcbiAgICAgICAgICAgICAgICBkZXBlbmRPbj86IDxVPihwcm9taXNlOiBJUHJvbWlzZTxVPiB8IEpRdWVyeVhIUikgPT4gSVByb21pc2U8VT4sXHJcbiAgICAgICAgICAgICkgPT4gdm9pZCxcclxuICAgICAgICAgICAgb3B0aW9ucz86IE1ha2VQcm9taXNlT3B0aW9ucyB8IGNhbmNlbENhbGxiYWNrXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIC8vIGFwcGx5IG1peGluXHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmNlbGFibGUgPSBtYWtlQ2FuY2VsYWJsZSgkLkRlZmVycmVkKCksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCB0aGlzLCBjYW5jZWxhYmxlLmRmLCBjYW5jZWxhYmxlLnRhcmdldCk7XHJcbiAgICAgICAgICAgIHRoaXMuYWJvcnQgPSBjYW5jZWxhYmxlLmFib3J0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuZGVwZW5kT24gPSBjYW5jZWxhYmxlLmRlcGVuZE9uLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgICAgICBleGVjdXRvcih0aGlzLnJlc29sdmUsIHRoaXMucmVqZWN0LCB0aGlzLmRlcGVuZE9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gc3RhdGljIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIHN0YXRpYyByZXNvbHZlPFQ+KHZhbHVlPzogVCB8IFByb21pc2VMaWtlPFQ+KTogSVByb21pc2VCYXNlPFQ+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+JC5EZWZlcnJlZCgpLnJlc29sdmUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIHJlamVjdDxUPihyZWFzb24/OiBhbnkpOiBQcm9taXNlPFQ+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+JC5EZWZlcnJlZCgpLnJlamVjdChyZWFzb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIGFsbDxUPiguLi5kZWZlcnJlZHM6IEFycmF5PFQgfCBJUHJvbWlzZTxUPiB8IEpRdWVyeVByb21pc2U8VD4+KTogSVByb21pc2VCYXNlPFQ+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+JC53aGVuKGRlZmVycmVkcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzdGF0aWMgd2FpdDxUPiguLi5kZWZlcnJlZHM6IEFycmF5PFQgfCBJUHJvbWlzZTxUPiB8IEpRdWVyeVByb21pc2U8VD4+KTogSVByb21pc2VCYXNlPFQ+IHtcclxuICAgICAgICAgICAgcmV0dXJuIDxhbnk+d2FpdChkZWZlcnJlZHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3RhdGljIHJhY2U8VD4oLi4uZGVmZXJyZWRzOiBBcnJheTxUIHwgSVByb21pc2U8VD4gfCBKUXVlcnlQcm9taXNlPFQ+Pik6IElQcm9taXNlQmFzZTxUPiB7XHJcbiAgICAgICAgICAgIHJldHVybiA8YW55PnJhY2UoZGVmZXJyZWRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNvbnN0IFByb21pc2UgPSBQcm9taXNlQ29uc3RydWN0b3I7XHJcbn1cclxuXHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcImNkcC5wcm9taXNlXCIge1xyXG4gICAgZXhwb3J0ID0gQ0RQO1xyXG59XHJcbiJdfQ==