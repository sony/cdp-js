/*!
 * cdp.nativebridge.js 1.1.0
 *
 * Date: 2016-03-23T21:32:56
 */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["cdp.promise"], function () {
            return factory(root.CDP || (root.CDP = {}), root.jQuery || root.$);
        });
    }
    else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(require("cdp.promise"), require("jquery"));
    }
    else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}), root.jQuery || root.$);
    }
}(((this || 0).self || global), function (CDP, $) {
    CDP.NativeBridge = CDP.NativeBridge || {};
    



var CDP;
(function (CDP) {
    var NativeBridge;
    (function (NativeBridge) {
        var TAG = "[CDP.NativeBridge.Utils] ";
        /**
         * \~english
         * @class Utils
         * @brief The utility class for CDP.NativeBridge.
         *
         * \~japanese
         * @class Utils
         * @brief CDP.NativeBridge が使用するユーティリティクラス
         */
        var Utils = (function () {
            function Utils() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static methods
            /**
             * \~english
             * Defines error code map from the plugin result to CDP.NativeBridge result code.
             *
             * @param errorCode {String} [in] set result code string. ex): "SUCCESS_OK"
             *
             * \~japanese
             * plugin の Result Code を CDP.NativeBridge にマップする
             *
             * @param errorCode {String} [in] Result Code 文字列を指定 ex): "SUCCESS_OK"
             */
            Utils.defineResultCode = function (errorCode) {
                Object.defineProperty(NativeBridge, errorCode, {
                    get: function () {
                        if (Utils.s_pluginReady) {
                            return CDP.Plugin.NativeBridge[errorCode];
                        }
                        else {
                            return null;
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
            };
            /**
             * \~english
             * Wait for cordova "deviceready" event fired.
             *
             * \~japanese
             * cordova が 使用可能になるまで待機
             */
            Utils.waitForPluginReady = function () {
                var df = $.Deferred();
                if (Utils.s_pluginReady) {
                    return $.Deferred().resolve();
                }
                try {
                    var channel = cordova.require("cordova/channel");
                    channel.onCordovaReady.subscribe(function () {
                        if (null != CDP.Plugin.NativeBridge) {
                            Utils.s_pluginReady = true;
                            df.resolve();
                        }
                        else {
                            console.error(TAG + "'cordova-plugin-cdp-nativebridge' cordova plugin required.");
                            df.reject();
                        }
                    });
                }
                catch (error) {
                    console.error(TAG + "cordova required.");
                    df.reject();
                }
                return df.promise();
            };
            /**
             * \~english
             * Create NativeBridge.Promise object from jQueryDeferred object.
             *
             * @param df {JQueryDeferred} [in] set jQueryDeferred instance.
             * @return   {Promise} NativeBridge.Promise object.
             *
             * \~japanese
             * Promise オブジェクトの作成
             * jQueryDeferred オブジェクトから、NativeBridge.Promise オブジェクトを作成する
             *
             * @param df {JQueryDeferred} [in] jQueryDeferred instance を指定
             * @return   {Promise} NativeBridge.Promise オブジェクト
             */
            Utils.makePromise = function (df) {
                return CDP.makePromise(df, {
                    _bridge: null,
                    _taskId: null,
                    abort: function (info) {
                        var _this = this;
                        var detail = $.extend({ message: "abort" }, info);
                        var cancel = function () {
                            if (null != _this._bridge && null != _this._taskId) {
                                _this._bridge.cancel(_this._taskId, detail);
                            }
                            df.reject(detail);
                        };
                        if (null != this.dependency) {
                            if (this.dependency.abort) {
                                this.dependency.abort(detail);
                            }
                            else {
                                console.error(TAG + "[call] dependency object doesn't have 'abort()' method.");
                            }
                            if (this.callReject && "pending" === this.state()) {
                                cancel();
                            }
                        }
                        else if ("pending" === this.state()) {
                            cancel();
                        }
                    }
                });
            };
            /**
             * \~english
             * Helper function to correctly set up the prototype chain, for subclasses.
             * The function behavior is same as extend() function of Backbone.js.
             *
             * @param protoProps  {Object} [in] set prototype properties as object.
             * @param staticProps {Object} [in] set static properties as object.
             * @return {Object} subclass constructor.
             *
             * \~japanese
             * クラス継承のためのヘルパー関数
             * Backbone.js extend() 関数と同等
             *
             * @param protoProps  {Object} [in] prototype properties をオブジェクトで指定
             * @param staticProps {Object} [in] static properties をオブジェクトで指定
             * @return {Object} サブクラスのコンストラクタ
             */
            Utils.extend = function (protoProps, staticProps) {
                var parent = this;
                var child;
                if (protoProps && protoProps.hasOwnProperty("constructor")) {
                    child = protoProps.constructor;
                }
                else {
                    child = function () {
                        return parent.apply(this, arguments);
                    };
                }
                $.extend(child, parent, staticProps);
                var Surrogate = function () {
                    this.constructor = child;
                };
                Surrogate.prototype = parent.prototype;
                child.prototype = new Surrogate;
                if (protoProps) {
                    $.extend(child.prototype, protoProps);
                }
                child.__super__ = parent.prototype;
                return child;
            };
            Utils.s_pluginReady = false;
            return Utils;
        }());
        NativeBridge.Utils = Utils;
    })(NativeBridge = CDP.NativeBridge || (CDP.NativeBridge = {}));
})(CDP || (CDP = {}));

var CDP;
(function (CDP) {
    var NativeBridge;
    (function (NativeBridge) {
        var TAG = "[CDP.NativeBridge.Gate] ";
        NativeBridge.Utils.defineResultCode("SUCCESS_OK");
        NativeBridge.Utils.defineResultCode("SUCCESS_PROGRESS");
        NativeBridge.Utils.defineResultCode("ERROR_FAIL");
        NativeBridge.Utils.defineResultCode("ERROR_CANCEL");
        NativeBridge.Utils.defineResultCode("ERROR_INVALID_ARG");
        NativeBridge.Utils.defineResultCode("ERROR_NOT_IMPLEMENT");
        NativeBridge.Utils.defineResultCode("ERROR_NOT_SUPPORT");
        NativeBridge.Utils.defineResultCode("ERROR_INVALID_OPERATION");
        NativeBridge.Utils.defineResultCode("ERROR_CLASS_NOT_FOUND");
        NativeBridge.Utils.defineResultCode("ERROR_METHOD_NOT_FOUND");
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
        var Gate = (function () {
            /**
             * \~english
             * constructor
             *
             * @param feature {Feature}          [in] feature information.
             * @param options {ConstructOptions} [in] construction options.
             *
             * \~japanese
             * constructor
             *
             * @param feature {Feature}          [in] 初期化情報を指定
             * @param options {ConstructOptions} [in] オプションを指定
             */
            function Gate(feature, options) {
                var _this = this;
                NativeBridge.Utils.waitForPluginReady()
                    .then(function () {
                    _this._bridge = new CDP.Plugin.NativeBridge(feature, options);
                })
                    .fail(function () {
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
             * @param method  {String}       [in] method name of Native class
             * @param args    {Object[]}     [in] set arguments by array type.
             * @param options {ExecOptions?} [in] set exec options.
             * @return {Promise} NativeBridge.Promise object.
             *
             * \~japanese
             * タスクの実行
             * 指定した method 名に対応する Native Class の method を呼び出す。
             *
             * @param method  {String}       [in] Native Class のメソッド名を指定
             * @param args    {Object[]}     [in] 引数を配列で指定
             * @param options {ExecOptions?} [in] 実行オプションを指定
             * @return {Promise} NativeBridge.Promise オブジェクト
             */
            Gate.prototype.exec = function (method, args, options) {
                var _this = this;
                var df = $.Deferred();
                var promise = NativeBridge.Utils.makePromise(df);
                NativeBridge.Utils.waitForPluginReady()
                    .then(function () {
                    var taskId = _this._bridge.exec(function (result) {
                        if (NativeBridge.SUCCESS_PROGRESS === result.code) {
                            df.notify(result);
                        }
                        else {
                            df.resolve(result);
                        }
                    }, function (error) {
                        df.reject(error);
                    }, method, args, options);
                    // set internal properties.
                    promise._bridge = _this._bridge;
                    promise._taskId = taskId;
                })
                    .fail(function () {
                    df.reject(_this.makeFatal());
                });
                return promise;
            };
            /**
             * \~english
             * Cancel all tasks.
             *
             * @param options {ExecOptions?} [in] set execute options.
             * @return {jQueryPromise} jQuery.Promise object.
             *
             * \~japanese
             * すべてのタスクのキャンセル
             *
             * @param options {ExecOptions?} [in] 実行オプションを指定
             * @return {jQueryPromise} jQuery.Promise オブジェクト
             */
            Gate.prototype.cancel = function (options) {
                var _this = this;
                var df = $.Deferred();
                NativeBridge.Utils.waitForPluginReady()
                    .then(function () {
                    _this._bridge.cancel(null, options, function (result) {
                        df.resolve(result);
                    }, function (error) {
                        df.reject(error);
                    });
                })
                    .fail(function () {
                    df.reject(_this.makeFatal());
                });
                return df.promise();
            };
            /**
             * \~english
             * Destruction for the instance.
             * release Native class reference. after that, exec() becomes invalid.
             *
             * @param options {ExecOptions?} [in] set execute options.
             * @return {jQueryPromise} jQuery.Promise object.
             *
             * \~japanese
             * インスタンスの破棄
             * Native の参照を解除する。以降、exec は無効となる。
             *
             * @param options {ExecOptions?} [in] 実行オプションを指定
             * @return {jQueryPromise} jQuery.Promise オブジェクト
             */
            Gate.prototype.dispose = function (options) {
                var _this = this;
                var df = $.Deferred();
                NativeBridge.Utils.waitForPluginReady()
                    .then(function () {
                    _this._bridge.dispose(options, function (result) {
                        df.resolve(result);
                    }, function (error) {
                        df.reject(error);
                    });
                })
                    .fail(function () {
                    df.reject(_this.makeFatal());
                });
                return df.promise();
            };
            Object.defineProperty(Gate.prototype, "bridge", {
                ///////////////////////////////////////////////////////////////////////
                // protected methods
                /**
                 * \~english
                 * Access to Plugin.NativeBridge object.
                 * If you want to use low level exec(), you can use this accessor.
                 *
                 * @return {Plugin.NativeBridge} Plugin.NativeBridge instance.
                 *
                 * \~japanese
                 * Plugin.NativeBridge オブジェクトへのアクセス
                 * 低レベル exec() を使用したい場合に利用可能
                 *
                 * @return {Plugin.NativeBridge} Plugin.NativeBridge インスタンス.
                 */
                get: function () {
                    return this._bridge;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // private methods
            // Make fatal error object.
            Gate.prototype.makeFatal = function () {
                var msg = TAG + "fatal error. 'cordova-plugin-cdp-nativebridge' is not available.";
                console.error(msg);
                return {
                    code: null,
                    name: TAG + "ERROR_FATAL",
                    message: msg,
                };
            };
            // For pure javascript extend helper.
            Gate.extend = NativeBridge.Utils.extend;
            return Gate;
        }());
        NativeBridge.Gate = Gate;
    })(NativeBridge = CDP.NativeBridge || (CDP.NativeBridge = {}));
})(CDP || (CDP = {}));

    return CDP.NativeBridge;
}));
