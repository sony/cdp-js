/*!
 * cdp.nativebridge.js 2.0.0
 *
 * Date: 2017-09-06T06:01:20.215Z
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvTmF0aXZlQnJpZGdlL0ludGVyZmFjZXMudHMiLCJjZHA6Ly8vQ0RQL05hdGl2ZUJyaWRnZS9FcnJvckRlZnMudHMiLCJjZHA6Ly8vQ0RQL05hdGl2ZUJyaWRnZS9VdGlscy50cyIsImNkcDovLy9DRFAvTmF0aXZlQnJpZGdlL0dhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWtFO0FDQWxFLElBQVUsR0FBRyxDQTBDWjtBQTFDRCxXQUFVLEdBQUc7SUFFVDs7O09BR0c7SUFDSCxJQUFZLGdCQUdYO0lBSEQsV0FBWSxnQkFBZ0I7UUFDeEIsMkdBQWtDO1FBQ2xDLHdEQUFtQixDQUFDLEdBQUcsaUNBQTZCO0lBQ3hELENBQUMsRUFIVyxnQkFBZ0IsR0FBaEIsb0JBQWdCLEtBQWhCLG9CQUFnQixRQUczQjtJQUVELHVFQUF1RTtJQUN2RSw0QkFBNEI7SUFFNUIsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFFL0I7OztPQUdHO0lBQ0gsSUFBSyxlQUdKO0lBSEQsV0FBSyxlQUFlO1FBQ2hCLHFEQUFXO1FBQ1gsMkNBQVUsQ0FBQyxHQUFHLG1CQUFtQjtJQUNyQyxDQUFDLEVBSEksZUFBZSxLQUFmLGVBQWUsUUFHbkI7SUFFRCxvQ0FBb0M7SUFDcEM7OztPQUdHO0lBQ0gsSUFBWSxXQVVYO0lBVkQsV0FBWSxXQUFXO1FBQ25CLHVHQUFtRDtRQUNuRCxnRUFBa0Qsc0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsMkJBQTJCLENBQUM7UUFDOUosa0VBQWtELHNCQUFrQixDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLHlCQUF5QixDQUFDO1FBQzVKLGdFQUFrRCxzQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSx1QkFB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Q0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN4QixDQUFDO1lBa0JELHNCQUFjLHdCQUFNO2dCQWhCcEIsdUVBQXVFO2dCQUN2RSxvQkFBb0I7Z0JBRXBCOzs7Ozs7Ozs7Ozs7bUJBWUc7cUJBQ0g7b0JBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLENBQUM7OztlQUFBO1lBak1ELHVDQUF1QztZQUN2QyxxQ0FBcUM7WUFDdEIsV0FBTSxHQUFHLGtCQUFLLENBQUMsTUFBTSxDQUFDO1lBZ016QyxXQUFDO1NBQUE7UUF2TVksaUJBQUksT0F1TWhCO0lBQ0wsQ0FBQyxFQTdRYSxZQUFZLEdBQVosZ0JBQVksS0FBWixnQkFBWSxRQTZRekI7QUFBRCxDQUFDLEVBN1FTLEdBQUcsS0FBSCxHQUFHLFFBNlFaIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL0B0eXBlcy9jZHAucGx1Z2luLm5hdGl2ZWJyaWRnZS5kLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBDRFAuTmF0aXZlQnJpZGdlIHtcclxuXHJcbiAgICBpbXBvcnQgUGx1Z2luICAgPSBDRFAuUGx1Z2luLk5hdGl2ZUJyaWRnZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBpbnRlcmZhY2UgRmVhdHVyZVxyXG4gICAgICogQGJyaWVmIGZlYXR1cmUgaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIEBpbnRlcmZhY2UgRmVhdHVyZVxyXG4gICAgICogQGJyaWVmIOapn+iDveaDheWgsVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEZlYXR1cmUgZXh0ZW5kcyBQbHVnaW4uRmVhdHVyZSB7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBpbnRlcmZhY2UgQ29uc3RydWN0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIE5hdGl2ZUJyaWRnZSBjbGFzcydzIGNvbnNydHJ1Y3Rpb24gb3B0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGludGVyZmFjZSBDb25zdHJ1Y3RPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYg5Yid5pyf5YyW44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ29uc3RydWN0T3B0aW9ucyBleHRlbmRzIFBsdWdpbi5Db25zdHJ1Y3RPcHRpb25zIHtcclxuICAgICAgICB1c2VSYXdQbHVnaW5SZXN1bHQ/OiBib29sZWFuOyAgIC8vIFvpgY7ljrvkupLmj5vnlKhdIGV4ZWMg44Kz44O844Or5pmC44GrLCBJUmVzdWx0IOOBp+i/lOWNtOOBmeOCi+WgtOWQiCB0cnVlLiBkZWZhdWx0OiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogQGludGVyZmFjZSBJUmVzdWx0XHJcbiAgICAgKiBAYnJpZWYgTmF0aXZlQnJpZGdlIGJhc2UgcmVzdWx0IGluZm9ybWF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBAaW50ZXJmYWNlIElSZXN1bHRcclxuICAgICAqIEBicmllZiBOYXRpdmVCcmlkZ2Ug44Gu5Z+65bqVIFJlc3VsdCDmg4XloLFcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUmVzdWx0IGV4dGVuZHMgUGx1Z2luLklSZXN1bHQsIEVycm9yIHtcclxuICAgICAgICBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogQGludGVyZmFjZSBFeGVjT3B0aW9uc1xyXG4gICAgICogQGJyaWVmIGV4ZWMoKSBtZXRob2Qgb3B0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGludGVyZmFjZSBFeGVjT3B0aW9uc1xyXG4gICAgICogQGJyaWVmIGV4ZWMoKSDjgavmuKHjgZnjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFeGVjT3B0aW9ucyBleHRlbmRzIFBsdWdpbi5FeGVjT3B0aW9ucyB7XHJcbiAgICAgICAgcmVjZWl2ZVBhcmFtcz86IGJvb2xlYW47IC8vIGV4ZWMg5oiQ5Yqf5pmC44GrLCAuLi5wYXJhbXMsIElSZXN1bHQg44Gn6L+U5Y2044GZ44KL5aC05ZCIIHRydWVcclxuICAgIH1cclxufVxyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCJjZHAubmF0aXZlYnJpZGdlXCIge1xyXG4gICAgY29uc3QgTmF0aXZlQnJpZGdlOiB0eXBlb2YgQ0RQLk5hdGl2ZUJyaWRnZTtcclxuICAgIGV4cG9ydCA9IE5hdGl2ZUJyaWRnZTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbnVtICBSRVNVTFRfQ09ERV9CQVNFXHJcbiAgICAgKiBAYnJpZWYg44Oq44K244Or44OI44Kz44O844OJ44Gu44Kq44OV44K744OD44OI5YCkXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFX0JBU0Uge1xyXG4gICAgICAgIENEUF9OQVRJVkVCUklER0VfREVDTEFSRVJBVElPTiA9IDAsIC8vIFRTMjQzMiDlr77nrZZcclxuICAgICAgICBDRFBfTkFUSVZFQlJJREdFID0gMiAqIF9NT0RVTEVfUkVTVUxUX0NPREVfUkFOR0VfQ0RQLFxyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBtb2R1bGUgZXJyb3IgZGVjbGFyYXRpb246XHJcblxyXG4gICAgY29uc3QgRlVOQ1RJT05fQ09ERV9SQU5HRSA9IDEwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIExPQ0FMX0NPREVfQkFTRVxyXG4gICAgICogQGJyaWVmIGNkcC5uYXRpdmVicmlkZ2Ug5YaF44Gu44Ot44O844Kr44Or44Kz44O844OJ44Kq44OV44K744OD44OI5YCkXHJcbiAgICAgKi9cclxuICAgIGVudW0gTE9DQUxfQ09ERV9CQVNFIHtcclxuICAgICAgICBHQVRFICAgID0gMCxcclxuICAgICAgICBVVElMUyAgID0gMSAqIEZVTkNUSU9OX0NPREVfUkFOR0UsXHJcbiAgICB9XHJcblxyXG4gICAgLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcbiAgICAvKipcclxuICAgICAqIEBlbnVtICBSRVNVTFRfQ09ERVxyXG4gICAgICogQGJyaWVmIGNkcC1uYXRpdmVicmlkZ2Ug44Gu44Ko44Op44O844Kz44O844OJ5a6a576pXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFIHtcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdfREVDTEFSQVRJT04gICAgICAgICAgICAgICA9IDAsIC8vIFRTMjQzMiDlr77nrZZcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdFX0lOVkFMSURfQVJHICAgICAgICAgICAgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9OQVRJVkVCUklER0UsIExPQ0FMX0NPREVfQkFTRS5HQVRFICsgMSwgXCJjYWxsZWQgd2l0aCBpbnZhbGlkIGFyZ3MuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER0VfTk9UX0lNUExFTUVOVCAgICAgICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX05BVElWRUJSSURHRSwgTE9DQUxfQ09ERV9CQVNFLkdBVEUgKyAyLCBcIm1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER0VfTk9UX1NVUFBPUlQgICAgICAgICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX05BVElWRUJSSURHRSwgTE9DQUxfQ09ERV9CQVNFLkdBVEUgKyAzLCBcIm1ldGhvZCBub3Qgc3VwcG9ydGVkLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdFX0lOVkFMSURfT1BFUkFUSU9OICAgICAgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9OQVRJVkVCUklER0UsIExPQ0FMX0NPREVfQkFTRS5HQVRFICsgNCwgXCJpbnZhbGlkIG9wZXJhdGlvbi5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX05BVElWRUJSSURHRV9DTEFTU19OT1RfRk9VTkQgICAgICAgICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfTkFUSVZFQlJJREdFLCBMT0NBTF9DT0RFX0JBU0UuR0FURSArIDUsIFwiY2xhc3Mgbm90IGZvdW5kLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdFX01FVEhPRF9OT1RfRk9VTkQgICAgICAgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9OQVRJVkVCUklER0UsIExPQ0FMX0NPREVfQkFTRS5HQVRFICsgNiwgXCJtZXRob2Qgbm90IGZvdW5kLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdFX0NPUkRPVkFfUkVRVUlSRUQgICAgICAgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9OQVRJVkVCUklER0UsIExPQ0FMX0NPREVfQkFTRS5VVElMUyArIDEsIFwiY29yZG92YSByZXF1aXJlZC5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX05BVElWRUJSSURHRV9DT1JET1ZBX1BMVUdJTl9SRVFVSVJFRCAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfTkFUSVZFQlJJREdFLCBMT0NBTF9DT0RFX0JBU0UuVVRJTFMgKyAyLCBcIidjb3Jkb3ZhLXBsdWdpbi1jZHAtbmF0aXZlYnJpZGdlJyBjb3Jkb3ZhIHBsdWdpbiByZXF1aXJlZC5cIiksXHJcbiAgICB9XHJcbiAgICAvKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuTmF0aXZlQnJpZGdlIHtcclxuXHJcbiAgICBpbXBvcnQgSVByb21pc2VCYXNlID0gQ0RQLklQcm9taXNlQmFzZTtcclxuICAgIGltcG9ydCBJUHJvbWlzZSAgICAgPSBDRFAuSVByb21pc2U7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLk5hdGl2ZUJyaWRnZS5VdGlsc10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBAY2xhc3MgVXRpbHNcclxuICAgICAqIEBicmllZiBUaGUgdXRpbGl0eSBjbGFzcyBmb3IgQ0RQLk5hdGl2ZUJyaWRnZS5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGNsYXNzIFV0aWxzXHJcbiAgICAgKiBAYnJpZWYgQ0RQLk5hdGl2ZUJyaWRnZSDjgYzkvb/nlKjjgZnjgovjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFV0aWxzIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19wbHVnaW5SZWFkeSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgICAgICogRGVmaW5lcyBlcnJvciBjb2RlIG1hcCBmcm9tIHRoZSBwbHVnaW4gcmVzdWx0IHRvIENEUC5OYXRpdmVCcmlkZ2UgcmVzdWx0IGNvZGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXJyb3JDb2RlIFtpbl0gc2V0IHJlc3VsdCBjb2RlIHN0cmluZy4gZXgpOiBcIlNVQ0NFU1NfT0tcIlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiBwbHVnaW4g44GuIFJlc3VsdCBDb2RlIOOCkiBDRFAuTmF0aXZlQnJpZGdlIOOBq+ODnuODg+ODl+OBmeOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGVycm9yQ29kZSBbaW5dIFJlc3VsdCBDb2RlIOaWh+Wtl+WIl+OCkuaMh+WumiBleCk6IFwiU1VDQ0VTU19PS1wiXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkZWZpbmVSZXN1bHRDb2RlKGVycm9yQ29kZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYXRpdmVCcmlkZ2UsIGVycm9yQ29kZSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFV0aWxzLnNfcGx1Z2luUmVhZHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFBsdWdpbi5OYXRpdmVCcmlkZ2VbZXJyb3JDb2RlXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBXYWl0IGZvciBjb3Jkb3ZhIFwiZGV2aWNlcmVhZHlcIiBldmVudCBmaXJlZC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICogY29yZG92YSDjgYwg5L2/55So5Y+v6IO944Gr44Gq44KL44G+44Gn5b6F5qmfXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB3YWl0Rm9yUGx1Z2luUmVhZHkoKTogSVByb21pc2VCYXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgY29uc3QgZGYgPSAkLkRlZmVycmVkPHZvaWQ+KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoVXRpbHMuc19wbHVnaW5SZWFkeSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQuRGVmZXJyZWQ8dm9pZD4oKS5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFubmVsID0gY29yZG92YS5yZXF1aXJlKFwiY29yZG92YS9jaGFubmVsXCIpO1xyXG4gICAgICAgICAgICAgICAgY2hhbm5lbC5vbkNvcmRvdmFSZWFkeS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChudWxsICE9IENEUC5QbHVnaW4uTmF0aXZlQnJpZGdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFV0aWxzLnNfcGx1Z2luUmVhZHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZi5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KG1ha2VFcnJvckluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfTkFUSVZFQlJJREdFX0NPUkRPVkFfUExVR0lOX1JFUVVJUkVELCBUQUdcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBkZi5yZWplY3QobWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfTkFUSVZFQlJJREdFX0NPUkRPVkFfUkVRVUlSRUQsIFRBR1xyXG4gICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkZi5wcm9taXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgICAgICogQ3JlYXRlIE5hdGl2ZUJyaWRnZS5Qcm9taXNlIG9iamVjdCBmcm9tIGpRdWVyeURlZmVycmVkIG9iamVjdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkZiBbaW5dIHNldCBqUXVlcnlEZWZlcnJlZCBpbnN0YW5jZS5cclxuICAgICAgICAgKiBAcGFyYW0gdXNlUmF3UGx1Z2luUmVzdWx0IFtpbl0gcmV0dXJuIHBsdWdpbiByZXN1bHQgb3IgZXJyb3JpbmZvXHJcbiAgICAgICAgICogQHJldHVybnMgTmF0aXZlQnJpZGdlLlByb21pc2Ugb2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOBruS9nOaIkFxyXG4gICAgICAgICAqIGpRdWVyeURlZmVycmVkIOOCquODluOCuOOCp+OCr+ODiOOBi+OCieOAgU5hdGl2ZUJyaWRnZS5Qcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOCkuS9nOaIkOOBmeOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRmIFtpbl0galF1ZXJ5RGVmZXJyZWQgaW5zdGFuY2Ug44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIHVzZVJhd1BsdWdpblJlc3VsdCBbaW5dIHBsdWdpbiByZXN1bHQg44KS6L+U44GZ44GL5ZCm44GLXHJcbiAgICAgICAgICogQHJldHVybnMgTmF0aXZlQnJpZGdlLlByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBtYWtlUHJvbWlzZShkZjogSlF1ZXJ5RGVmZXJyZWQ8SVJlc3VsdD4sIHVzZVJhd1BsdWdpblJlc3VsdDogYm9vbGVhbik6IElQcm9taXNlPElSZXN1bHQ+IHtcclxuICAgICAgICAgICAgcmV0dXJuIENEUC5tYWtlUHJvbWlzZShkZiwge1xyXG4gICAgICAgICAgICAgICAgX2JyaWRnZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIF90YXNrSWQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBhYm9ydDogZnVuY3Rpb24gKGluZm8/OiBhbnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb2RlID0gdXNlUmF3UGx1Z2luUmVzdWx0ID8gTmF0aXZlQnJpZGdlLkVSUk9SX0NBTkNFTCA6IFJFU1VMVF9DT0RFLlNVQ0NFRURFRDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXRhaWwgPSAkLmV4dGVuZCh7IGNvZGU6IGNvZGUgfSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImFib3J0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFRBRyArIFwibWV0aG9kIGNhbmNlbGVkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tJZDogdGhpcy5fdGFza0lkLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGluZm8pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYW5jZWwgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX2JyaWRnZSAmJiBudWxsICE9IHRoaXMuX3Rhc2tJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnJpZGdlLmNhbmNlbCh0aGlzLl90YXNrSWQsIGRldGFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGRldGFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5kZXBlbmRlbmN5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlcGVuZGVuY3kuYWJvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jeS5hYm9ydChkZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcIltjYWxsXSBkZXBlbmRlbmN5IG9iamVjdCBkb2Vzbid0IGhhdmUgJ2Fib3J0KCknIG1ldGhvZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FsbFJlamVjdCAmJiBcInBlbmRpbmdcIiA9PT0gdGhpcy5zdGF0ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJwZW5kaW5nXCIgPT09IHRoaXMuc3RhdGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBjb3JyZWN0bHkgc2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sIGZvciBzdWJjbGFzc2VzLlxyXG4gICAgICAgICAqIFRoZSBmdW5jdGlvbiBiZWhhdmlvciBpcyBzYW1lIGFzIGV4dGVuZCgpIGZ1bmN0aW9uIG9mIEJhY2tib25lLmpzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHByb3RvUHJvcHMgIFtpbl0gc2V0IHByb3RvdHlwZSBwcm9wZXJ0aWVzIGFzIG9iamVjdC5cclxuICAgICAgICAgKiBAcGFyYW0gc3RhdGljUHJvcHMgW2luXSBzZXQgc3RhdGljIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICAgICAqIEByZXR1cm5zIHN1YmNsYXNzIGNvbnN0cnVjdG9yLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiDjgq/jg6njgrnntpnmib/jga7jgZ/jgoHjga7jg5jjg6vjg5Hjg7zplqLmlbBcclxuICAgICAgICAgKiBCYWNrYm9uZS5qcyBleHRlbmQoKSDplqLmlbDjgajlkIznrYlcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBwcm90b1Byb3BzICBbaW5dIHByb3RvdHlwZSBwcm9wZXJ0aWVzIOOCkuOCquODluOCuOOCp+OCr+ODiOOBp+aMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0aWNQcm9wcyBbaW5dIHN0YXRpYyBwcm9wZXJ0aWVzIOOCkuOCquODluOCuOOCp+OCr+ODiOOBp+aMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIOOCteODluOCr+ODqeOCueOBruOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZW5kKHByb3RvUHJvcHM6IG9iamVjdCwgc3RhdGljUHJvcHM/OiBvYmplY3QpOiBvYmplY3Qge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICBsZXQgY2hpbGQ7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJvdG9Qcm9wcyAmJiBwcm90b1Byb3BzLmhhc093blByb3BlcnR5KFwiY29uc3RydWN0b3JcIikpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQuZXh0ZW5kKGNoaWxkLCBwYXJlbnQsIHN0YXRpY1Byb3BzKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IFN1cnJvZ2F0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU3Vycm9nYXRlLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XHJcbiAgICAgICAgICAgIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBTdXJyb2dhdGU7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJvdG9Qcm9wcykge1xyXG4gICAgICAgICAgICAgICAgJC5leHRlbmQoY2hpbGQucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5OYXRpdmVCcmlkZ2Uge1xyXG5cclxuICAgIGltcG9ydCBJUHJvbWlzZSAgICAgPSBDRFAuSVByb21pc2U7XHJcbiAgICBpbXBvcnQgSVByb21pc2VCYXNlID0gQ0RQLklQcm9taXNlQmFzZTtcclxuXHJcbiAgICBjb25zdCBUQUc6IHN0cmluZyA9IFwiW0NEUC5OYXRpdmVCcmlkZ2UuR2F0ZV0gXCI7XHJcblxyXG4gICAgLy8gUGx1Z2luIHJhdyBSZXN1bHQgY29kZVxyXG5cclxuICAgIGV4cG9ydCBsZXQgU1VDQ0VTU19PSzogbnVtYmVyOyAgICAgICAgICAgICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIlNVQ0NFU1NfT0tcIik7XHJcbiAgICBleHBvcnQgbGV0IFNVQ0NFU1NfUFJPR1JFU1M6IG51bWJlcjsgICAgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJTVUNDRVNTX1BST0dSRVNTXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9GQUlMOiBudW1iZXI7ICAgICAgICAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfRkFJTFwiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfQ0FOQ0VMOiBudW1iZXI7ICAgICAgICAgICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX0NBTkNFTFwiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfSU5WQUxJRF9BUkc6IG51bWJlcjsgICAgICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX0lOVkFMSURfQVJHXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9OT1RfSU1QTEVNRU5UOiBudW1iZXI7ICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfTk9UX0lNUExFTUVOVFwiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfTk9UX1NVUFBPUlQ6IG51bWJlcjsgICAgICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX05PVF9TVVBQT1JUXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9JTlZBTElEX09QRVJBVElPTjogbnVtYmVyOyBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfSU5WQUxJRF9PUEVSQVRJT05cIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX0NMQVNTX05PVF9GT1VORDogbnVtYmVyOyAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9DTEFTU19OT1RfRk9VTkRcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX01FVEhPRF9OT1RfRk9VTkQ6IG51bWJlcjsgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9NRVRIT0RfTk9UX0ZPVU5EXCIpO1xyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBjb252ZXJ0RXJyb3JJbmZvKHJlc3VsdDogSVJlc3VsdCB8IENEUC5QbHVnaW4uTmF0aXZlQnJpZGdlLklSZXN1bHQpOiBFcnJvckluZm8ge1xyXG4gICAgICAgIGxldCByZXN1bHRDb2RlOiBudW1iZXI7XHJcbiAgICAgICAgc3dpdGNoIChyZXN1bHQuY29kZSkge1xyXG4gICAgICAgICAgICBjYXNlIEVSUk9SX0NBTkNFTDpcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEVSUk9SX0lOVkFMSURfQVJHOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q29kZSA9IFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfSU5WQUxJRF9BUkc7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBFUlJPUl9OT1RfSU1QTEVNRU5UOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q29kZSA9IFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfTk9UX0lNUExFTUVOVDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEVSUk9SX05PVF9TVVBQT1JUOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q29kZSA9IFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfTk9UX1NVUFBPUlQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBFUlJPUl9JTlZBTElEX09QRVJBVElPTjpcclxuICAgICAgICAgICAgICAgIHJlc3VsdENvZGUgPSBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfTkFUSVZFQlJJREdFX0lOVkFMSURfT1BFUkFUSU9OO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRVJST1JfQ0xBU1NfTk9UX0ZPVU5EOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q29kZSA9IFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfQ0xBU1NfTk9UX0ZPVU5EO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRVJST1JfTUVUSE9EX05PVF9GT1VORDpcclxuICAgICAgICAgICAgICAgIHJlc3VsdENvZGUgPSBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfTkFUSVZFQlJJREdFX01FVEhPRF9OT1RfRk9VTkQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBFUlJPUl9GQUlMOlxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q29kZSA9IFJFU1VMVF9DT0RFLkZBSUxFRDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoRVJST1JfQ0FOQ0VMID09PSByZXN1bHQuY29kZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbWFrZUNhbmNlbGVkRXJyb3JJbmZvKFRBRywgPElSZXN1bHQ+cmVzdWx0KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbWFrZUVycm9ySW5mbyhyZXN1bHRDb2RlLCBUQUcsIG51bGwsIDxJUmVzdWx0PnJlc3VsdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBAY2xhc3MgR2F0ZVxyXG4gICAgICogQGJyaWVmIFRoZSBiYXNlIGNsYXNzIGZvciBOYXRpdmVCcmlkZ2UgY29tbXVuaWNhdGlvbi5cclxuICAgICAqICAgICAgICBZb3UgY2FuIGRlcml2ZSBhbnkgR2F0ZSBjbGFzcyBmcm9tIHRoaXMgY2xhc3MuXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIEBjbGFzcyBHYXRlXHJcbiAgICAgKiBAYnJpZWYgTmF0aXZlQnJpZGdlIOOBqOmAmuS/oeOBmeOCi+ODmeODvOOCueOCr+ODqeOCuVxyXG4gICAgICogICAgICAgIOOBk+OBruOCr+ODqeOCueOBi+OCieS7u+aEj+OBriBHYXRlIOOCr+ODqeOCueOCkua0vueUn+OBl+OBpuWun+ijheWPr+iDvVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgR2F0ZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2JyaWRnZTogUGx1Z2luLk5hdGl2ZUJyaWRnZTtcclxuICAgICAgICBwcml2YXRlIF9vcHRpb25zOiBDb25zdHJ1Y3RPcHRpb25zO1xyXG5cclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuICAgICAgICAvLyBGb3IgcHVyZSBqYXZhc2NyaXB0IGV4dGVuZCBoZWxwZXIuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZXh0ZW5kID0gVXRpbHMuZXh0ZW5kO1xyXG4gICAgICAgIC8qIHRzbGludDplbmFibGU6bm8tdW51c2VkLXZhcmlhYmxlICovXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGZlYXR1cmUgW2luXSBmZWF0dXJlIGluZm9ybWF0aW9uLlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIFtpbl0gY29uc3RydWN0aW9uIG9wdGlvbnMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZmVhdHVyZSBbaW5dIOWIneacn+WMluaDheWgseOCkuaMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIFtpbl0g44Kq44OX44K344On44Oz44KS5oyH5a6aXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IoZmVhdHVyZTogRmVhdHVyZSwgb3B0aW9ucz86IENvbnN0cnVjdE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5fb3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgIHVzZVJhd1BsdWdpblJlc3VsdDogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBVdGlscy53YWl0Rm9yUGx1Z2luUmVhZHkoKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JyaWRnZSA9IG5ldyBQbHVnaW4uTmF0aXZlQnJpZGdlKGZlYXR1cmUsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBvdmVycmlkZSBtZXRob2RzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBFeGVjdXRlIHRhc2suXHJcbiAgICAgICAgICogdGhlIGZ1bmN0aW9uIGNhbGxzIHRoZSBOYXRpdmUgY2xhc3MgbWV0aG9kIGZyb20gY29ycmVzcG9uZGVudCBtZXRob2QgbmFtZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBtZXRob2QgIFtpbl0gbWV0aG9kIG5hbWUgb2YgTmF0aXZlIGNsYXNzXHJcbiAgICAgICAgICogQHBhcmFtIGFyZ3MgICAgW2luXSBzZXQgYXJndW1lbnRzIGJ5IGFycmF5IHR5cGUuXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSBzZXQgZXhlYyBvcHRpb25zLlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiDjgr/jgrnjgq/jga7lrp/ooYxcclxuICAgICAgICAgKiDmjIflrprjgZfjgZ8gbWV0aG9kIOWQjeOBq+WvvuW/nOOBmeOCiyBOYXRpdmUgQ2xhc3Mg44GuIG1ldGhvZCDjgpLlkbzjgbPlh7rjgZnjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBtZXRob2QgIFtpbl0gTmF0aXZlIENsYXNzIOOBruODoeOCveODg+ODieWQjeOCkuaMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSBhcmdzICAgIFtpbl0g5byV5pWw44KS6YWN5YiX44Gn5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSDlrp/ooYzjgqrjg5fjgrfjg6fjg7PjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJucyBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBleGVjKG1ldGhvZDogc3RyaW5nLCBhcmdzPzogYW55W10sIG9wdGlvbnM/OiBFeGVjT3B0aW9ucyk6IElQcm9taXNlPGFueT4ge1xyXG4gICAgICAgICAgICBjb25zdCBkZiA9ICQuRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgY29uc3Qgb3B0ID0gJC5leHRlbmQoe30sIHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9taXNlID0gVXRpbHMubWFrZVByb21pc2UoZGYsIG9wdC51c2VSYXdQbHVnaW5SZXN1bHQpO1xyXG5cclxuICAgICAgICAgICAgVXRpbHMud2FpdEZvclBsdWdpblJlYWR5KClcclxuICAgICAgICAgICAgICAgIC5kb25lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0YXNrSWQgPSB0aGlzLl9icmlkZ2UuZXhlYyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdDogSVJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFNVQ0NFU1NfUFJPR1JFU1MgPT09IHJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvcHQudXNlUmF3UGx1Z2luUmVzdWx0ICYmIG51bGwgIT0gcmVzdWx0LnBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5ub3RpZnkoLi4uWy4uLnJlc3VsdC5wYXJhbXMsIHJlc3VsdF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLm5vdGlmeShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFvcHQudXNlUmF3UGx1Z2luUmVzdWx0ICYmIG51bGwgIT0gcmVzdWx0LnBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZXNvbHZlKC4uLlsuLi5yZXN1bHQucGFyYW1zLCByZXN1bHRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoZXJyb3I6IElSZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHQudXNlUmF3UGx1Z2luUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGNvbnZlcnRFcnJvckluZm8oZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLCBhcmdzLCBvcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IGludGVybmFsIHByb3BlcnRpZXMuXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+cHJvbWlzZSkuX2JyaWRnZSA9IHRoaXMuX2JyaWRnZTtcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT5wcm9taXNlKS5fdGFza0lkID0gdGFza0lkO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIENhbmNlbCBhbGwgdGFza3MuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIHNldCBleGVjdXRlIG9wdGlvbnMuXHJcbiAgICAgICAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIOOBmeOBueOBpuOBruOCv+OCueOCr+OBruOCreODo+ODs+OCu+ODq1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSDlrp/ooYzjgqrjg5fjgrfjg6fjg7PjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJucyBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBjYW5jZWwob3B0aW9ucz86IEV4ZWNPcHRpb25zKTogSVByb21pc2VCYXNlPElSZXN1bHQ+IHtcclxuICAgICAgICAgICAgY29uc3QgZGYgPSAkLkRlZmVycmVkKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdCA9ICQuZXh0ZW5kKHt9LCB0aGlzLl9vcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIFV0aWxzLndhaXRGb3JQbHVnaW5SZWFkeSgpXHJcbiAgICAgICAgICAgICAgICAuZG9uZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnJpZGdlLmNhbmNlbChudWxsLCBvcHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnVzZVJhd1BsdWdpblJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChjb252ZXJ0RXJyb3JJbmZvKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRmLnByb21pc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBEZXN0cnVjdGlvbiBmb3IgdGhlIGluc3RhbmNlLlxyXG4gICAgICAgICAqIHJlbGVhc2UgTmF0aXZlIGNsYXNzIHJlZmVyZW5jZS4gYWZ0ZXIgdGhhdCwgZXhlYygpIGJlY29tZXMgaW52YWxpZC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIFtpbl0gc2V0IGV4ZWN1dGUgb3B0aW9ucy5cclxuICAgICAgICAgKiBAcmV0dXJucyBQcm9taXNlIG9iamVjdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICog44Kk44Oz44K544K/44Oz44K544Gu56C05qOEXHJcbiAgICAgICAgICogTmF0aXZlIOOBruWPgueFp+OCkuino+mZpOOBmeOCi+OAguS7pemZjeOAgWV4ZWMg44Gv54Sh5Yq544Go44Gq44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIOWun+ihjOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGRpc3Bvc2Uob3B0aW9ucz86IEV4ZWNPcHRpb25zKTogSVByb21pc2VCYXNlPElSZXN1bHQ+IHtcclxuICAgICAgICAgICAgY29uc3QgZGYgPSAkLkRlZmVycmVkKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdCA9ICQuZXh0ZW5kKHt9LCB0aGlzLl9vcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIFV0aWxzLndhaXRGb3JQbHVnaW5SZWFkeSgpXHJcbiAgICAgICAgICAgICAgICAuZG9uZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnJpZGdlLmRpc3Bvc2Uob3B0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC51c2VSYXdQbHVnaW5SZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoY29udmVydEVycm9ySW5mbyhlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZi5wcm9taXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByb3RlY3RlZCBtZXRob2RzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBBY2Nlc3MgdG8gUGx1Z2luLk5hdGl2ZUJyaWRnZSBvYmplY3QuXHJcbiAgICAgICAgICogSWYgeW91IHdhbnQgdG8gdXNlIGxvdyBsZXZlbCBleGVjKCksIHlvdSBjYW4gdXNlIHRoaXMgYWNjZXNzb3IuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyBQbHVnaW4uTmF0aXZlQnJpZGdlIGluc3RhbmNlLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiBQbHVnaW4uTmF0aXZlQnJpZGdlIOOCquODluOCuOOCp+OCr+ODiOOBuOOBruOCouOCr+OCu+OCuVxyXG4gICAgICAgICAqIOS9juODrOODmeODqyBleGVjKCkg44KS5L2/55So44GX44Gf44GE5aC05ZCI44Gr5Yip55So5Y+v6IO9XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJucyBQbHVnaW4uTmF0aXZlQnJpZGdlIOOCpOODs+OCueOCv+ODs+OCuS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IGJyaWRnZSgpOiBQbHVnaW4uTmF0aXZlQnJpZGdlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JyaWRnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19