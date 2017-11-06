/*!
 * cdp.nativebridge.js 2.1.0
 *
 * Date: 2017-11-06T05:39:57.321Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(["cdp.core", "cdp.promise"], function () { return factory(root.CDP || (root.CDP = {}), root.jQuery || root.$); }); } else { factory(root.CDP || (root.CDP = {}), root.jQuery || root.$); } }(((this || 0).self || global), function (CDP, $) { CDP.NativeBridge = CDP.NativeBridge || {};

var CDP;
(function (CDP) {
    /**
     * @enum  RESULT_CODE_BASE
     * @brief リザルトコードのオフセット値
     */
    var RESULT_CODE_BASE;
    (function (RESULT_CODE_BASE) {
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_NATIVEBRIDGE_DECLARERATION"] = 0] = "CDP_NATIVEBRIDGE_DECLARERATION";
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_NATIVEBRIDGE"] = 2 * CDP._MODULE_RESULT_CODE_RANGE_CDP] = "CDP_NATIVEBRIDGE";
    })(RESULT_CODE_BASE = CDP.RESULT_CODE_BASE || (CDP.RESULT_CODE_BASE = {}));
    ///////////////////////////////////////////////////////////////////////
    // module error declaration:
    var FUNCTION_CODE_RANGE = 10;
    /**
     * @enum  LOCAL_CODE_BASE
     * @brief cdp.nativebridge 内のローカルコードオフセット値
     */
    var LOCAL_CODE_BASE;
    (function (LOCAL_CODE_BASE) {
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["GATE"] = 0] = "GATE";
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["UTILS"] = 1 * FUNCTION_CODE_RANGE] = "UTILS";
    })(LOCAL_CODE_BASE || (LOCAL_CODE_BASE = {}));
    /* tslint:disable:max-line-length */
    /**
     * @enum  RESULT_CODE
     * @brief cdp-nativebridge のエラーコード定義
     */
    var RESULT_CODE;
    (function (RESULT_CODE) {
        RESULT_CODE[RESULT_CODE["ERROR_CDP_NATIVEBRIDG_DECLARATION"] = 0] = "ERROR_CDP_NATIVEBRIDG_DECLARATION";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_NATIVEBRIDGE_INVALID_ARG"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_NATIVEBRIDGE, LOCAL_CODE_BASE.GATE + 1, "called with invalid args.")] = "ERROR_CDP_NATIVEBRIDGE_INVALID_ARG";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_NATIVEBRIDGE_NOT_IMPLEMENT"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_NATIVEBRIDGE, LOCAL_CODE_BASE.GATE + 2, "method not implemented.")] = "ERROR_CDP_NATIVEBRIDGE_NOT_IMPLEMENT";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_NATIVEBRIDGE_NOT_SUPPORT"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_NATIVEBRIDGE, LOCAL_CODE_BASE.GATE + 3, "method not supported.")] = "ERROR_CDP_NATIVEBRIDGE_NOT_SUPPORT";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_NATIVEBRIDGE_INVALID_OPERATION"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_NATIVEBRIDGE, LOCAL_CODE_BASE.GATE + 4, "invalid operation.")] = "ERROR_CDP_NATIVEBRIDGE_INVALID_OPERATION";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_NATIVEBRIDGE_CLASS_NOT_FOUND"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_NATIVEBRIDGE, LOCAL_CODE_BASE.GATE + 5, "class not found.")] = "ERROR_CDP_NATIVEBRIDGE_CLASS_NOT_FOUND";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_NATIVEBRIDGE_METHOD_NOT_FOUND"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_NATIVEBRIDGE, LOCAL_CODE_BASE.GATE + 6, "method not found.")] = "ERROR_CDP_NATIVEBRIDGE_METHOD_NOT_FOUND";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_NATIVEBRIDGE_CORDOVA_REQUIRED"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_NATIVEBRIDGE, LOCAL_CODE_BASE.UTILS + 1, "cordova required.")] = "ERROR_CDP_NATIVEBRIDGE_CORDOVA_REQUIRED";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_NATIVEBRIDGE_CORDOVA_PLUGIN_REQUIRED"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_NATIVEBRIDGE, LOCAL_CODE_BASE.UTILS + 2, "'cordova-plugin-cdp-nativebridge' cordova plugin required.")] = "ERROR_CDP_NATIVEBRIDGE_CORDOVA_PLUGIN_REQUIRED";
    })(RESULT_CODE = CDP.RESULT_CODE || (CDP.RESULT_CODE = {}));
    /* tslint:enable:max-line-length */
})(CDP || (CDP = {}));
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
        var Utils = /** @class */ (function () {
            function Utils() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static methods
            /**
             * \~english
             * Defines error code map from the plugin result to CDP.NativeBridge result code.
             *
             * @param errorCode [in] set result code string. ex): "SUCCESS_OK"
             *
             * \~japanese
             * plugin の Result Code を CDP.NativeBridge にマップする
             *
             * @param errorCode [in] Result Code 文字列を指定 ex): "SUCCESS_OK"
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
                            df.reject(CDP.makeErrorInfo(CDP.RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_CORDOVA_PLUGIN_REQUIRED, TAG));
                        }
                    });
                }
                catch (error) {
                    df.reject(CDP.makeErrorInfo(CDP.RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_CORDOVA_REQUIRED, TAG));
                }
                return df.promise();
            };
            /**
             * \~english
             * Create NativeBridge.Promise object from jQueryDeferred object.
             *
             * @param df [in] set jQueryDeferred instance.
             * @param useRawPluginResult [in] return plugin result or errorinfo
             * @returns NativeBridge.Promise object.
             *
             * \~japanese
             * Promise オブジェクトの作成
             * jQueryDeferred オブジェクトから、NativeBridge.Promise オブジェクトを作成する
             *
             * @param df [in] jQueryDeferred instance を指定
             * @param useRawPluginResult [in] plugin result を返すか否か
             * @returns NativeBridge.Promise オブジェクト
             */
            Utils.makePromise = function (df, useRawPluginResult) {
                return CDP.makePromise(df, {
                    _bridge: null,
                    _taskId: null,
                    abort: function (info) {
                        var _this = this;
                        var code = useRawPluginResult ? NativeBridge.ERROR_CANCEL : CDP.RESULT_CODE.SUCCEEDED;
                        var detail = $.extend({ code: code }, {
                            message: "abort",
                            name: TAG + "method canceled",
                            taskId: this._taskId,
                        }, info);
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
             * @param protoProps  [in] set prototype properties as object.
             * @param staticProps [in] set static properties as object.
             * @returns subclass constructor.
             *
             * \~japanese
             * クラス継承のためのヘルパー関数
             * Backbone.js extend() 関数と同等
             *
             * @param protoProps  [in] prototype properties をオブジェクトで指定
             * @param staticProps [in] static properties をオブジェクトで指定
             * @returns サブクラスのコンストラクタ
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
        function convertErrorInfo(result) {
            var resultCode;
            switch (result.code) {
                case NativeBridge.ERROR_CANCEL:
                    break;
                case NativeBridge.ERROR_INVALID_ARG:
                    resultCode = CDP.RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_INVALID_ARG;
                    break;
                case NativeBridge.ERROR_NOT_IMPLEMENT:
                    resultCode = CDP.RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_NOT_IMPLEMENT;
                    break;
                case NativeBridge.ERROR_NOT_SUPPORT:
                    resultCode = CDP.RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_NOT_SUPPORT;
                    break;
                case NativeBridge.ERROR_INVALID_OPERATION:
                    resultCode = CDP.RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_INVALID_OPERATION;
                    break;
                case NativeBridge.ERROR_CLASS_NOT_FOUND:
                    resultCode = CDP.RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_CLASS_NOT_FOUND;
                    break;
                case NativeBridge.ERROR_METHOD_NOT_FOUND:
                    resultCode = CDP.RESULT_CODE.ERROR_CDP_NATIVEBRIDGE_METHOD_NOT_FOUND;
                    break;
                case NativeBridge.ERROR_FAIL:
                default:
                    resultCode = CDP.RESULT_CODE.FAILED;
                    break;
            }
            if (NativeBridge.ERROR_CANCEL === result.code) {
                return CDP.makeCanceledErrorInfo(TAG, result);
            }
            else {
                return CDP.makeErrorInfo(resultCode, TAG, null, result);
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
        var Gate = /** @class */ (function () {
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
            function Gate(feature, options) {
                var _this = this;
                this._options = $.extend({
                    useRawPluginResult: false,
                }, options);
                NativeBridge.Utils.waitForPluginReady()
                    .done(function () {
                    _this._bridge = new CDP.Plugin.NativeBridge(feature, options);
                })
                    .catch(function (reason) {
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
            Gate.prototype.exec = function (method, args, options) {
                var _this = this;
                var df = $.Deferred();
                var opt = $.extend({}, this._options, options);
                var promise = NativeBridge.Utils.makePromise(df, opt.useRawPluginResult);
                NativeBridge.Utils.waitForPluginReady()
                    .done(function () {
                    var taskId = _this._bridge.exec(function (result) {
                        if (NativeBridge.SUCCESS_PROGRESS === result.code) {
                            if (!opt.useRawPluginResult && null != result.params) {
                                df.notify.apply(df, result.params.concat([result]));
                            }
                            else {
                                df.notify(result);
                            }
                        }
                        else {
                            if (!opt.useRawPluginResult && null != result.params) {
                                df.resolve.apply(df, result.params.concat([result]));
                            }
                            else {
                                df.resolve(result);
                            }
                        }
                    }, function (error) {
                        if (opt.useRawPluginResult) {
                            df.reject(error);
                        }
                        else {
                            df.reject(convertErrorInfo(error));
                        }
                    }, method, args, options);
                    // set internal properties.
                    promise._bridge = _this._bridge;
                    promise._taskId = taskId;
                })
                    .catch(function (reason) {
                    df.reject(reason);
                });
                return promise;
            };
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
            Gate.prototype.cancel = function (options) {
                var _this = this;
                var df = $.Deferred();
                var opt = $.extend({}, this._options, options);
                NativeBridge.Utils.waitForPluginReady()
                    .done(function () {
                    _this._bridge.cancel(null, opt, function (result) {
                        df.resolve(result);
                    }, function (error) {
                        if (opt.useRawPluginResult) {
                            df.reject(error);
                        }
                        else {
                            df.reject(convertErrorInfo(error));
                        }
                    });
                })
                    .catch(function (reason) {
                    df.reject(reason);
                });
                return df.promise();
            };
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
            Gate.prototype.dispose = function (options) {
                var _this = this;
                var df = $.Deferred();
                var opt = $.extend({}, this._options, options);
                NativeBridge.Utils.waitForPluginReady()
                    .done(function () {
                    _this._bridge.dispose(opt, function (result) {
                        df.resolve(result);
                    }, function (error) {
                        if (opt.useRawPluginResult) {
                            df.reject(error);
                        }
                        else {
                            df.reject(convertErrorInfo(error));
                        }
                    });
                })
                    .catch(function (reason) {
                    df.reject(reason);
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
                 * @returns Plugin.NativeBridge instance.
                 *
                 * \~japanese
                 * Plugin.NativeBridge オブジェクトへのアクセス
                 * 低レベル exec() を使用したい場合に利用可能
                 *
                 * @returns Plugin.NativeBridge インスタンス.
                 */
                get: function () {
                    return this._bridge;
                },
                enumerable: true,
                configurable: true
            });
            /* tslint:disable:no-unused-variable */
            // For pure javascript extend helper.
            Gate.extend = NativeBridge.Utils.extend;
            return Gate;
        }());
        NativeBridge.Gate = Gate;
    })(NativeBridge = CDP.NativeBridge || (CDP.NativeBridge = {}));
})(CDP || (CDP = {}));

return CDP.NativeBridge; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvTmF0aXZlQnJpZGdlL0ludGVyZmFjZXMudHMiLCJjZHA6Ly8vQ0RQL05hdGl2ZUJyaWRnZS9FcnJvckRlZnMudHMiLCJjZHA6Ly8vQ0RQL05hdGl2ZUJyaWRnZS9VdGlscy50cyIsImNkcDovLy9DRFAvTmF0aXZlQnJpZGdlL0dhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWtFO0FDQWxFLElBQVUsR0FBRyxDQTBDWjtBQTFDRCxXQUFVLEdBQUc7SUFFVDs7O09BR0c7SUFDSCxJQUFZLGdCQUdYO0lBSEQsV0FBWSxnQkFBZ0I7UUFDeEIsMkdBQWtDO1FBQ2xDLHdEQUFtQixDQUFDLEdBQUcsaUNBQTZCO0lBQ3hELENBQUMsRUFIVyxnQkFBZ0IsR0FBaEIsb0JBQWdCLEtBQWhCLG9CQUFnQixRQUczQjtJQUVELHVFQUF1RTtJQUN2RSw0QkFBNEI7SUFFNUIsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFFL0I7OztPQUdHO0lBQ0gsSUFBSyxlQUdKO0lBSEQsV0FBSyxlQUFlO1FBQ2hCLHFEQUFXO1FBQ1gsMkNBQVUsQ0FBQyxHQUFHLG1CQUFtQjtJQUNyQyxDQUFDLEVBSEksZUFBZSxLQUFmLGVBQWUsUUFHbkI7SUFFRCxvQ0FBb0M7SUFDcEM7OztPQUdHO0lBQ0gsSUFBWSxXQVVYO0lBVkQsV0FBWSxXQUFXO1FBQ25CLHVHQUFtRDtRQUNuRCxnRUFBa0Qsc0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsMkJBQTJCLENBQUM7UUFDOUosa0VBQWtELHNCQUFrQixDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLHlCQUF5QixDQUFDO1FBQzVKLGdFQUFrRCxzQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSx1QkFB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QkFDUCxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3hCLENBQUM7WUFrQkQsc0JBQWMsd0JBQU07Z0JBaEJwQix1RUFBdUU7Z0JBQ3ZFLG9CQUFvQjtnQkFFcEI7Ozs7Ozs7Ozs7OzttQkFZRztxQkFDSDtvQkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDeEIsQ0FBQzs7O2VBQUE7WUFqTUQsdUNBQXVDO1lBQ3ZDLHFDQUFxQztZQUN0QixXQUFNLEdBQUcsa0JBQUssQ0FBQyxNQUFNLENBQUM7WUFnTXpDLFdBQUM7U0FBQTtRQXZNWSxpQkFBSSxPQXVNaEI7SUFDTCxDQUFDLEVBN1FhLFlBQVksR0FBWixnQkFBWSxLQUFaLGdCQUFZLFFBNlF6QjtBQUFELENBQUMsRUE3UVMsR0FBRyxLQUFILEdBQUcsUUE2UVoiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vLi4vQHR5cGVzL2NkcC5wbHVnaW4ubmF0aXZlYnJpZGdlLmQudHNcIiAvPlxyXG5cclxubmFtZXNwYWNlIENEUC5OYXRpdmVCcmlkZ2Uge1xyXG5cclxuICAgIGltcG9ydCBQbHVnaW4gICA9IENEUC5QbHVnaW4uTmF0aXZlQnJpZGdlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogQGludGVyZmFjZSBGZWF0dXJlXHJcbiAgICAgKiBAYnJpZWYgZmVhdHVyZSBpbmZvcm1hdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGludGVyZmFjZSBGZWF0dXJlXHJcbiAgICAgKiBAYnJpZWYg5qmf6IO95oOF5aCxXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRmVhdHVyZSBleHRlbmRzIFBsdWdpbi5GZWF0dXJlIHsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogQGludGVyZmFjZSBDb25zdHJ1Y3RPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgTmF0aXZlQnJpZGdlIGNsYXNzJ3MgY29uc3J0cnVjdGlvbiBvcHRpb25zLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBAaW50ZXJmYWNlIENvbnN0cnVjdE9wdGlvbnNcclxuICAgICAqIEBicmllZiDliJ3mnJ/ljJbjgavmjIflrprjgZnjgovjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBDb25zdHJ1Y3RPcHRpb25zIGV4dGVuZHMgUGx1Z2luLkNvbnN0cnVjdE9wdGlvbnMge1xyXG4gICAgICAgIHVzZVJhd1BsdWdpblJlc3VsdD86IGJvb2xlYW47ICAgLy8gW+mBjuWOu+S6kuaPm+eUqF0gZXhlYyDjgrPjg7zjg6vmmYLjgassIElSZXN1bHQg44Gn6L+U5Y2044GZ44KL5aC05ZCIIHRydWUuIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBAaW50ZXJmYWNlIElSZXN1bHRcclxuICAgICAqIEBicmllZiBOYXRpdmVCcmlkZ2UgYmFzZSByZXN1bHQgaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIEBpbnRlcmZhY2UgSVJlc3VsdFxyXG4gICAgICogQGJyaWVmIE5hdGl2ZUJyaWRnZSDjga7ln7rlupUgUmVzdWx0IOaDheWgsVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElSZXN1bHQgZXh0ZW5kcyBQbHVnaW4uSVJlc3VsdCwgRXJyb3Ige1xyXG4gICAgICAgIG1lc3NhZ2U6IHN0cmluZztcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBAaW50ZXJmYWNlIEV4ZWNPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgZXhlYygpIG1ldGhvZCBvcHRpb25zLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBAaW50ZXJmYWNlIEV4ZWNPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgZXhlYygpIOOBq+a4oeOBmeOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEV4ZWNPcHRpb25zIGV4dGVuZHMgUGx1Z2luLkV4ZWNPcHRpb25zIHtcclxuICAgICAgICByZWNlaXZlUGFyYW1zPzogYm9vbGVhbjsgLy8gZXhlYyDmiJDlip/mmYLjgassIC4uLnBhcmFtcywgSVJlc3VsdCDjgafov5TljbTjgZnjgovloLTlkIggdHJ1ZVxyXG4gICAgfVxyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcImNkcC5uYXRpdmVicmlkZ2VcIiB7XHJcbiAgICBjb25zdCBOYXRpdmVCcmlkZ2U6IHR5cGVvZiBDRFAuTmF0aXZlQnJpZGdlO1xyXG4gICAgZXhwb3J0ID0gTmF0aXZlQnJpZGdlO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIFJFU1VMVF9DT0RFX0JBU0VcclxuICAgICAqIEBicmllZiDjg6rjgrbjg6vjg4jjgrPjg7zjg4njga7jgqrjg5Xjgrvjg4Pjg4jlgKRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREVfQkFTRSB7XHJcbiAgICAgICAgQ0RQX05BVElWRUJSSURHRV9ERUNMQVJFUkFUSU9OID0gMCwgLy8gVFMyNDMyIOWvvuetllxyXG4gICAgICAgIENEUF9OQVRJVkVCUklER0UgPSAyICogX01PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRV9DRFAsXHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIG1vZHVsZSBlcnJvciBkZWNsYXJhdGlvbjpcclxuXHJcbiAgICBjb25zdCBGVU5DVElPTl9DT0RFX1JBTkdFID0gMTA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW51bSAgTE9DQUxfQ09ERV9CQVNFXHJcbiAgICAgKiBAYnJpZWYgY2RwLm5hdGl2ZWJyaWRnZSDlhoXjga7jg63jg7zjgqvjg6vjgrPjg7zjg4njgqrjg5Xjgrvjg4Pjg4jlgKRcclxuICAgICAqL1xyXG4gICAgZW51bSBMT0NBTF9DT0RFX0JBU0Uge1xyXG4gICAgICAgIEdBVEUgICAgPSAwLFxyXG4gICAgICAgIFVUSUxTICAgPSAxICogRlVOQ1RJT05fQ09ERV9SQU5HRSxcclxuICAgIH1cclxuXHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIFJFU1VMVF9DT0RFXHJcbiAgICAgKiBAYnJpZWYgY2RwLW5hdGl2ZWJyaWRnZSDjga7jgqjjg6njg7zjgrPjg7zjg4nlrprnvqlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREUge1xyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER19ERUNMQVJBVElPTiAgICAgICAgICAgICAgID0gMCwgLy8gVFMyNDMyIOWvvuetllxyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER0VfSU5WQUxJRF9BUkcgICAgICAgICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX05BVElWRUJSSURHRSwgTE9DQUxfQ09ERV9CQVNFLkdBVEUgKyAxLCBcImNhbGxlZCB3aXRoIGludmFsaWQgYXJncy5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX05BVElWRUJSSURHRV9OT1RfSU1QTEVNRU5UICAgICAgICAgICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfTkFUSVZFQlJJREdFLCBMT0NBTF9DT0RFX0JBU0UuR0FURSArIDIsIFwibWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX05BVElWRUJSSURHRV9OT1RfU1VQUE9SVCAgICAgICAgICAgICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfTkFUSVZFQlJJREdFLCBMT0NBTF9DT0RFX0JBU0UuR0FURSArIDMsIFwibWV0aG9kIG5vdCBzdXBwb3J0ZWQuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER0VfSU5WQUxJRF9PUEVSQVRJT04gICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX05BVElWRUJSSURHRSwgTE9DQUxfQ09ERV9CQVNFLkdBVEUgKyA0LCBcImludmFsaWQgb3BlcmF0aW9uLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdFX0NMQVNTX05PVF9GT1VORCAgICAgICAgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9OQVRJVkVCUklER0UsIExPQ0FMX0NPREVfQkFTRS5HQVRFICsgNSwgXCJjbGFzcyBub3QgZm91bmQuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER0VfTUVUSE9EX05PVF9GT1VORCAgICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX05BVElWRUJSSURHRSwgTE9DQUxfQ09ERV9CQVNFLkdBVEUgKyA2LCBcIm1ldGhvZCBub3QgZm91bmQuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER0VfQ09SRE9WQV9SRVFVSVJFRCAgICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX05BVElWRUJSSURHRSwgTE9DQUxfQ09ERV9CQVNFLlVUSUxTICsgMSwgXCJjb3Jkb3ZhIHJlcXVpcmVkLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdFX0NPUkRPVkFfUExVR0lOX1JFUVVJUkVEICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9OQVRJVkVCUklER0UsIExPQ0FMX0NPREVfQkFTRS5VVElMUyArIDIsIFwiJ2NvcmRvdmEtcGx1Z2luLWNkcC1uYXRpdmVicmlkZ2UnIGNvcmRvdmEgcGx1Z2luIHJlcXVpcmVkLlwiKSxcclxuICAgIH1cclxuICAgIC8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5OYXRpdmVCcmlkZ2Uge1xyXG5cclxuICAgIGltcG9ydCBJUHJvbWlzZUJhc2UgPSBDRFAuSVByb21pc2VCYXNlO1xyXG4gICAgaW1wb3J0IElQcm9taXNlICAgICA9IENEUC5JUHJvbWlzZTtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuTmF0aXZlQnJpZGdlLlV0aWxzXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBjbGFzcyBVdGlsc1xyXG4gICAgICogQGJyaWVmIFRoZSB1dGlsaXR5IGNsYXNzIGZvciBDRFAuTmF0aXZlQnJpZGdlLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBAY2xhc3MgVXRpbHNcclxuICAgICAqIEBicmllZiBDRFAuTmF0aXZlQnJpZGdlIOOBjOS9v+eUqOOBmeOCi+ODpuODvOODhuOCo+ODquODhuOCo+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgVXRpbHMge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX3BsdWdpblJlYWR5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBEZWZpbmVzIGVycm9yIGNvZGUgbWFwIGZyb20gdGhlIHBsdWdpbiByZXN1bHQgdG8gQ0RQLk5hdGl2ZUJyaWRnZSByZXN1bHQgY29kZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBlcnJvckNvZGUgW2luXSBzZXQgcmVzdWx0IGNvZGUgc3RyaW5nLiBleCk6IFwiU1VDQ0VTU19PS1wiXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIHBsdWdpbiDjga4gUmVzdWx0IENvZGUg44KSIENEUC5OYXRpdmVCcmlkZ2Ug44Gr44Oe44OD44OX44GZ44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXJyb3JDb2RlIFtpbl0gUmVzdWx0IENvZGUg5paH5a2X5YiX44KS5oyH5a6aIGV4KTogXCJTVUNDRVNTX09LXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRlZmluZVJlc3VsdENvZGUoZXJyb3JDb2RlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hdGl2ZUJyaWRnZSwgZXJyb3JDb2RlLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoVXRpbHMuc19wbHVnaW5SZWFkeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUGx1Z2luLk5hdGl2ZUJyaWRnZVtlcnJvckNvZGVdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIFdhaXQgZm9yIGNvcmRvdmEgXCJkZXZpY2VyZWFkeVwiIGV2ZW50IGZpcmVkLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiBjb3Jkb3ZhIOOBjCDkvb/nlKjlj6/og73jgavjgarjgovjgb7jgaflvoXmqZ9cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHdhaXRGb3JQbHVnaW5SZWFkeSgpOiBJUHJvbWlzZUJhc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICBjb25zdCBkZiA9ICQuRGVmZXJyZWQ8dm9pZD4oKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChVdGlscy5zX3BsdWdpblJlYWR5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJC5EZWZlcnJlZDx2b2lkPigpLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoYW5uZWwgPSBjb3Jkb3ZhLnJlcXVpcmUoXCJjb3Jkb3ZhL2NoYW5uZWxcIik7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsLm9uQ29yZG92YVJlYWR5LnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gQ0RQLlBsdWdpbi5OYXRpdmVCcmlkZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVXRpbHMuc19wbHVnaW5SZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QobWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfQ09SRE9WQV9QTFVHSU5fUkVRVUlSRUQsIFRBR1xyXG4gICAgICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGRmLnJlamVjdChtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfQ09SRE9WQV9SRVFVSVJFRCwgVEFHXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRmLnByb21pc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBDcmVhdGUgTmF0aXZlQnJpZGdlLlByb21pc2Ugb2JqZWN0IGZyb20galF1ZXJ5RGVmZXJyZWQgb2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRmIFtpbl0gc2V0IGpRdWVyeURlZmVycmVkIGluc3RhbmNlLlxyXG4gICAgICAgICAqIEBwYXJhbSB1c2VSYXdQbHVnaW5SZXN1bHQgW2luXSByZXR1cm4gcGx1Z2luIHJlc3VsdCBvciBlcnJvcmluZm9cclxuICAgICAgICAgKiBAcmV0dXJucyBOYXRpdmVCcmlkZ2UuUHJvbWlzZSBvYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44Gu5L2c5oiQXHJcbiAgICAgICAgICogalF1ZXJ5RGVmZXJyZWQg44Kq44OW44K444Kn44Kv44OI44GL44KJ44CBTmF0aXZlQnJpZGdlLlByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44KS5L2c5oiQ44GZ44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGYgW2luXSBqUXVlcnlEZWZlcnJlZCBpbnN0YW5jZSDjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gdXNlUmF3UGx1Z2luUmVzdWx0IFtpbl0gcGx1Z2luIHJlc3VsdCDjgpLov5TjgZnjgYvlkKbjgYtcclxuICAgICAgICAgKiBAcmV0dXJucyBOYXRpdmVCcmlkZ2UuUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIG1ha2VQcm9taXNlKGRmOiBKUXVlcnlEZWZlcnJlZDxJUmVzdWx0PiwgdXNlUmF3UGx1Z2luUmVzdWx0OiBib29sZWFuKTogSVByb21pc2U8SVJlc3VsdD4ge1xyXG4gICAgICAgICAgICByZXR1cm4gQ0RQLm1ha2VQcm9taXNlKGRmLCB7XHJcbiAgICAgICAgICAgICAgICBfYnJpZGdlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgX3Rhc2tJZDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGFib3J0OiBmdW5jdGlvbiAoaW5mbz86IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvZGUgPSB1c2VSYXdQbHVnaW5SZXN1bHQgPyBOYXRpdmVCcmlkZ2UuRVJST1JfQ0FOQ0VMIDogUkVTVUxUX0NPREUuU1VDQ0VFREVEO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9ICQuZXh0ZW5kKHsgY29kZTogY29kZSB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiYWJvcnRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogVEFHICsgXCJtZXRob2QgY2FuY2VsZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFza0lkOiB0aGlzLl90YXNrSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgaW5mbyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbmNlbCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fYnJpZGdlICYmIG51bGwgIT0gdGhpcy5fdGFza0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9icmlkZ2UuY2FuY2VsKHRoaXMuX3Rhc2tJZCwgZGV0YWlsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoZGV0YWlsKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLmRlcGVuZGVuY3kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW5jeS5hYm9ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmN5LmFib3J0KGRldGFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiW2NhbGxdIGRlcGVuZGVuY3kgb2JqZWN0IGRvZXNuJ3QgaGF2ZSAnYWJvcnQoKScgbWV0aG9kLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jYWxsUmVqZWN0ICYmIFwicGVuZGluZ1wiID09PSB0aGlzLnN0YXRlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcInBlbmRpbmdcIiA9PT0gdGhpcy5zdGF0ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNvcnJlY3RseSBzZXQgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiwgZm9yIHN1YmNsYXNzZXMuXHJcbiAgICAgICAgICogVGhlIGZ1bmN0aW9uIGJlaGF2aW9yIGlzIHNhbWUgYXMgZXh0ZW5kKCkgZnVuY3Rpb24gb2YgQmFja2JvbmUuanMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcHJvdG9Qcm9wcyAgW2luXSBzZXQgcHJvdG90eXBlIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0aWNQcm9wcyBbaW5dIHNldCBzdGF0aWMgcHJvcGVydGllcyBhcyBvYmplY3QuXHJcbiAgICAgICAgICogQHJldHVybnMgc3ViY2xhc3MgY29uc3RydWN0b3IuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIOOCr+ODqeOCuee2meaJv+OBruOBn+OCgeOBruODmOODq+ODkeODvOmWouaVsFxyXG4gICAgICAgICAqIEJhY2tib25lLmpzIGV4dGVuZCgpIOmWouaVsOOBqOWQjOetiVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHByb3RvUHJvcHMgIFtpbl0gcHJvdG90eXBlIHByb3BlcnRpZXMg44KS44Kq44OW44K444Kn44Kv44OI44Gn5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXRpY1Byb3BzIFtpbl0gc3RhdGljIHByb3BlcnRpZXMg44KS44Kq44OW44K444Kn44Kv44OI44Gn5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnMg44K144OW44Kv44Op44K544Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlbmQocHJvdG9Qcm9wczogb2JqZWN0LCBzdGF0aWNQcm9wcz86IG9iamVjdCk6IG9iamVjdCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcm90b1Byb3BzICYmIHByb3RvUHJvcHMuaGFzT3duUHJvcGVydHkoXCJjb25zdHJ1Y3RvclwiKSkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJC5leHRlbmQoY2hpbGQsIHBhcmVudCwgc3RhdGljUHJvcHMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgU3Vycm9nYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTdXJyb2dhdGUucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcclxuICAgICAgICAgICAgY2hpbGQucHJvdG90eXBlID0gbmV3IFN1cnJvZ2F0ZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcm90b1Byb3BzKSB7XHJcbiAgICAgICAgICAgICAgICAkLmV4dGVuZChjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLk5hdGl2ZUJyaWRnZSB7XHJcblxyXG4gICAgaW1wb3J0IElQcm9taXNlICAgICA9IENEUC5JUHJvbWlzZTtcclxuICAgIGltcG9ydCBJUHJvbWlzZUJhc2UgPSBDRFAuSVByb21pc2VCYXNlO1xyXG5cclxuICAgIGNvbnN0IFRBRzogc3RyaW5nID0gXCJbQ0RQLk5hdGl2ZUJyaWRnZS5HYXRlXSBcIjtcclxuXHJcbiAgICAvLyBQbHVnaW4gcmF3IFJlc3VsdCBjb2RlXHJcblxyXG4gICAgZXhwb3J0IGxldCBTVUNDRVNTX09LOiBudW1iZXI7ICAgICAgICAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiU1VDQ0VTU19PS1wiKTtcclxuICAgIGV4cG9ydCBsZXQgU1VDQ0VTU19QUk9HUkVTUzogbnVtYmVyOyAgICAgICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIlNVQ0NFU1NfUFJPR1JFU1NcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX0ZBSUw6IG51bWJlcjsgICAgICAgICAgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9GQUlMXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9DQU5DRUw6IG51bWJlcjsgICAgICAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfQ0FOQ0VMXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9JTlZBTElEX0FSRzogbnVtYmVyOyAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfSU5WQUxJRF9BUkdcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX05PVF9JTVBMRU1FTlQ6IG51bWJlcjsgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9OT1RfSU1QTEVNRU5UXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9OT1RfU1VQUE9SVDogbnVtYmVyOyAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfTk9UX1NVUFBPUlRcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX0lOVkFMSURfT1BFUkFUSU9OOiBudW1iZXI7IFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9JTlZBTElEX09QRVJBVElPTlwiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfQ0xBU1NfTk9UX0ZPVU5EOiBudW1iZXI7ICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX0NMQVNTX05PVF9GT1VORFwiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfTUVUSE9EX05PVF9GT1VORDogbnVtYmVyOyAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX01FVEhPRF9OT1RfRk9VTkRcIik7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnZlcnRFcnJvckluZm8ocmVzdWx0OiBJUmVzdWx0IHwgQ0RQLlBsdWdpbi5OYXRpdmVCcmlkZ2UuSVJlc3VsdCk6IEVycm9ySW5mbyB7XHJcbiAgICAgICAgbGV0IHJlc3VsdENvZGU6IG51bWJlcjtcclxuICAgICAgICBzd2l0Y2ggKHJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgRVJST1JfQ0FOQ0VMOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRVJST1JfSU5WQUxJRF9BUkc6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9JTlZBTElEX0FSRztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEVSUk9SX05PVF9JTVBMRU1FTlQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9OT1RfSU1QTEVNRU5UO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRVJST1JfTk9UX1NVUFBPUlQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9OT1RfU1VQUE9SVDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEVSUk9SX0lOVkFMSURfT1BFUkFUSU9OOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q29kZSA9IFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfSU5WQUxJRF9PUEVSQVRJT047XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBFUlJPUl9DTEFTU19OT1RfRk9VTkQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9DTEFTU19OT1RfRk9VTkQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBFUlJPUl9NRVRIT0RfTk9UX0ZPVU5EOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q29kZSA9IFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfTUVUSE9EX05PVF9GT1VORDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEVSUk9SX0ZBSUw6XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRkFJTEVEO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChFUlJPUl9DQU5DRUwgPT09IHJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlQ2FuY2VsZWRFcnJvckluZm8oVEFHLCA8SVJlc3VsdD5yZXN1bHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlRXJyb3JJbmZvKHJlc3VsdENvZGUsIFRBRywgbnVsbCwgPElSZXN1bHQ+cmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBjbGFzcyBHYXRlXHJcbiAgICAgKiBAYnJpZWYgVGhlIGJhc2UgY2xhc3MgZm9yIE5hdGl2ZUJyaWRnZSBjb21tdW5pY2F0aW9uLlxyXG4gICAgICogICAgICAgIFlvdSBjYW4gZGVyaXZlIGFueSBHYXRlIGNsYXNzIGZyb20gdGhpcyBjbGFzcy5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGNsYXNzIEdhdGVcclxuICAgICAqIEBicmllZiBOYXRpdmVCcmlkZ2Ug44Go6YCa5L+h44GZ44KL44OZ44O844K544Kv44Op44K5XHJcbiAgICAgKiAgICAgICAg44GT44Gu44Kv44Op44K544GL44KJ5Lu75oSP44GuIEdhdGUg44Kv44Op44K544KS5rS+55Sf44GX44Gm5a6f6KOF5Y+v6IO9XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBHYXRlIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfYnJpZGdlOiBQbHVnaW4uTmF0aXZlQnJpZGdlO1xyXG4gICAgICAgIHByaXZhdGUgX29wdGlvbnM6IENvbnN0cnVjdE9wdGlvbnM7XHJcblxyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSAqL1xyXG4gICAgICAgIC8vIEZvciBwdXJlIGphdmFzY3JpcHQgZXh0ZW5kIGhlbHBlci5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBleHRlbmQgPSBVdGlscy5leHRlbmQ7XHJcbiAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZmVhdHVyZSBbaW5dIGZlYXR1cmUgaW5mb3JtYXRpb24uXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSBjb25zdHJ1Y3Rpb24gb3B0aW9ucy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBmZWF0dXJlIFtpbl0g5Yid5pyf5YyW5oOF5aCx44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSDjgqrjg5fjgrfjg6fjg7PjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihmZWF0dXJlOiBGZWF0dXJlLCBvcHRpb25zPzogQ29uc3RydWN0T3B0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLl9vcHRpb25zID0gJC5leHRlbmQoe1xyXG4gICAgICAgICAgICAgICAgdXNlUmF3UGx1Z2luUmVzdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIFV0aWxzLndhaXRGb3JQbHVnaW5SZWFkeSgpXHJcbiAgICAgICAgICAgICAgICAuZG9uZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnJpZGdlID0gbmV3IFBsdWdpbi5OYXRpdmVCcmlkZ2UoZmVhdHVyZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIG92ZXJyaWRlIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIEV4ZWN1dGUgdGFzay5cclxuICAgICAgICAgKiB0aGUgZnVuY3Rpb24gY2FsbHMgdGhlIE5hdGl2ZSBjbGFzcyBtZXRob2QgZnJvbSBjb3JyZXNwb25kZW50IG1ldGhvZCBuYW1lLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZCAgW2luXSBtZXRob2QgbmFtZSBvZiBOYXRpdmUgY2xhc3NcclxuICAgICAgICAgKiBAcGFyYW0gYXJncyAgICBbaW5dIHNldCBhcmd1bWVudHMgYnkgYXJyYXkgdHlwZS5cclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIHNldCBleGVjIG9wdGlvbnMuXHJcbiAgICAgICAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIOOCv+OCueOCr+OBruWun+ihjFxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBnyBtZXRob2Qg5ZCN44Gr5a++5b+c44GZ44KLIE5hdGl2ZSBDbGFzcyDjga4gbWV0aG9kIOOCkuWRvOOBs+WHuuOBmeOAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZCAgW2luXSBOYXRpdmUgQ2xhc3Mg44Gu44Oh44K944OD44OJ5ZCN44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIGFyZ3MgICAgW2luXSDlvJXmlbDjgpLphY3liJfjgafmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIOWun+ihjOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGV4ZWMobWV0aG9kOiBzdHJpbmcsIGFyZ3M/OiBhbnlbXSwgb3B0aW9ucz86IEV4ZWNPcHRpb25zKTogSVByb21pc2U8YW55PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZCgpO1xyXG4gICAgICAgICAgICBjb25zdCBvcHQgPSAkLmV4dGVuZCh7fSwgdGhpcy5fb3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSBVdGlscy5tYWtlUHJvbWlzZShkZiwgb3B0LnVzZVJhd1BsdWdpblJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICBVdGlscy53YWl0Rm9yUGx1Z2luUmVhZHkoKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhc2tJZCA9IHRoaXMuX2JyaWRnZS5leGVjKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0OiBJUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoU1VDQ0VTU19QUk9HUkVTUyA9PT0gcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdC51c2VSYXdQbHVnaW5SZXN1bHQgJiYgbnVsbCAhPSByZXN1bHQucGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLm5vdGlmeSguLi5bLi4ucmVzdWx0LnBhcmFtcywgcmVzdWx0XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYubm90aWZ5KHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdC51c2VSYXdQbHVnaW5SZXN1bHQgJiYgbnVsbCAhPSByZXN1bHQucGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUoLi4uWy4uLnJlc3VsdC5wYXJhbXMsIHJlc3VsdF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChlcnJvcjogSVJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC51c2VSYXdQbHVnaW5SZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoY29udmVydEVycm9ySW5mbyhlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QsIGFyZ3MsIG9wdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXQgaW50ZXJuYWwgcHJvcGVydGllcy5cclxuICAgICAgICAgICAgICAgICAgICAoPGFueT5wcm9taXNlKS5fYnJpZGdlID0gdGhpcy5fYnJpZGdlO1xyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnByb21pc2UpLl90YXNrSWQgPSB0YXNrSWQ7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgICAgICogQ2FuY2VsIGFsbCB0YXNrcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIFtpbl0gc2V0IGV4ZWN1dGUgb3B0aW9ucy5cclxuICAgICAgICAgKiBAcmV0dXJucyBQcm9taXNlIG9iamVjdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICog44GZ44G544Gm44Gu44K/44K544Kv44Gu44Kt44Oj44Oz44K744OrXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIOWun+ihjOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNhbmNlbChvcHRpb25zPzogRXhlY09wdGlvbnMpOiBJUHJvbWlzZUJhc2U8SVJlc3VsdD4ge1xyXG4gICAgICAgICAgICBjb25zdCBkZiA9ICQuRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgY29uc3Qgb3B0ID0gJC5leHRlbmQoe30sIHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgVXRpbHMud2FpdEZvclBsdWdpblJlYWR5KClcclxuICAgICAgICAgICAgICAgIC5kb25lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9icmlkZ2UuY2FuY2VsKG51bGwsIG9wdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHQudXNlUmF3UGx1Z2luUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGNvbnZlcnRFcnJvckluZm8oZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGYucHJvbWlzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIERlc3RydWN0aW9uIGZvciB0aGUgaW5zdGFuY2UuXHJcbiAgICAgICAgICogcmVsZWFzZSBOYXRpdmUgY2xhc3MgcmVmZXJlbmNlLiBhZnRlciB0aGF0LCBleGVjKCkgYmVjb21lcyBpbnZhbGlkLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSBzZXQgZXhlY3V0ZSBvcHRpb25zLlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiDjgqTjg7Pjgrnjgr/jg7Pjgrnjga7noLTmo4RcclxuICAgICAgICAgKiBOYXRpdmUg44Gu5Y+C54Wn44KS6Kej6Zmk44GZ44KL44CC5Lul6ZmN44CBZXhlYyDjga/nhKHlirnjgajjgarjgovjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIFtpbl0g5a6f6KGM44Kq44OX44K344On44Oz44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnMgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgZGlzcG9zZShvcHRpb25zPzogRXhlY09wdGlvbnMpOiBJUHJvbWlzZUJhc2U8SVJlc3VsdD4ge1xyXG4gICAgICAgICAgICBjb25zdCBkZiA9ICQuRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgY29uc3Qgb3B0ID0gJC5leHRlbmQoe30sIHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgVXRpbHMud2FpdEZvclBsdWdpblJlYWR5KClcclxuICAgICAgICAgICAgICAgIC5kb25lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9icmlkZ2UuZGlzcG9zZShvcHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnVzZVJhd1BsdWdpblJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChjb252ZXJ0RXJyb3JJbmZvKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRmLnByb21pc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJvdGVjdGVkIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIEFjY2VzcyB0byBQbHVnaW4uTmF0aXZlQnJpZGdlIG9iamVjdC5cclxuICAgICAgICAgKiBJZiB5b3Ugd2FudCB0byB1c2UgbG93IGxldmVsIGV4ZWMoKSwgeW91IGNhbiB1c2UgdGhpcyBhY2Nlc3Nvci5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIFBsdWdpbi5OYXRpdmVCcmlkZ2UgaW5zdGFuY2UuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIFBsdWdpbi5OYXRpdmVCcmlkZ2Ug44Kq44OW44K444Kn44Kv44OI44G444Gu44Ki44Kv44K744K5XHJcbiAgICAgICAgICog5L2O44Os44OZ44OrIGV4ZWMoKSDjgpLkvb/nlKjjgZfjgZ/jgYTloLTlkIjjgavliKnnlKjlj6/og71cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIFBsdWdpbi5OYXRpdmVCcmlkZ2Ug44Kk44Oz44K544K/44Oz44K5LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3RlY3RlZCBnZXQgYnJpZGdlKCk6IFBsdWdpbi5OYXRpdmVCcmlkZ2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnJpZGdlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=