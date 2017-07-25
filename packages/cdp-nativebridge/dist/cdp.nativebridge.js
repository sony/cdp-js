/*!
 * cdp.nativebridge.js 2.0.0
 *
 * Date: 2017-07-25T09:13:01.409Z
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
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_NATIVEBRIDGE"] = 2 * CDP.MODULE_RESULT_CODE_RANGE_CDP] = "CDP_NATIVEBRIDGE";
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
        var Utils = (function () {
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
        var Gate = (function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvTmF0aXZlQnJpZGdlL0ludGVyZmFjZXMudHMiLCJjZHA6Ly8vQ0RQL05hdGl2ZUJyaWRnZS9FcnJvckRlZnMudHMiLCJjZHA6Ly8vQ0RQL05hdGl2ZUJyaWRnZS9VdGlscy50cyIsImNkcDovLy9DRFAvTmF0aXZlQnJpZGdlL0dhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWtFO0FDQWxFLElBQVUsR0FBRyxDQTBDWjtBQTFDRCxXQUFVLEdBQUc7SUFFVDs7O09BR0c7SUFDSCxJQUFZLGdCQUdYO0lBSEQsV0FBWSxnQkFBZ0I7UUFDeEIsMkdBQWtDO1FBQ2xDLHdEQUFtQixDQUFDLEdBQUcsZ0NBQTRCO0lBQ3ZELENBQUMsRUFIVyxnQkFBZ0IsR0FBaEIsb0JBQWdCLEtBQWhCLG9CQUFnQixRQUczQjtJQUVELHVFQUF1RTtJQUN2RSw0QkFBNEI7SUFFNUIsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFFL0I7OztPQUdHO0lBQ0gsSUFBSyxlQUdKO0lBSEQsV0FBSyxlQUFlO1FBQ2hCLHFEQUFXO1FBQ1gsMkNBQVUsQ0FBQyxHQUFHLG1CQUFtQjtJQUNyQyxDQUFDLEVBSEksZUFBZSxLQUFmLGVBQWUsUUFHbkI7SUFFRCxvQ0FBb0M7SUFDcEM7OztPQUdHO0lBQ0gsSUFBWSxXQVVYO0lBVkQsV0FBWSxXQUFXO1FBQ25CLHVHQUFtRDtRQUNuRCxnRUFBa0Qsc0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsMkJBQTJCLENBQUM7UUFDOUosa0VBQWtELHNCQUFrQixDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLHlCQUF5QixDQUFDO1FBQzVKLGdFQUFrRCxzQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSx1QkFB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Q0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN4QixDQUFDO1lBa0JELHNCQUFjLHdCQUFNO2dCQWhCcEIsdUVBQXVFO2dCQUN2RSxvQkFBb0I7Z0JBRXBCOzs7Ozs7Ozs7Ozs7bUJBWUc7cUJBQ0g7b0JBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ3hCLENBQUM7OztlQUFBO1lBak1ELHVDQUF1QztZQUN2QyxxQ0FBcUM7WUFDdEIsV0FBTSxHQUFHLGtCQUFLLENBQUMsTUFBTSxDQUFDO1lBZ016QyxXQUFDO1NBQUE7UUF2TVksaUJBQUksT0F1TWhCO0lBQ0wsQ0FBQyxFQTdRYSxZQUFZLEdBQVosZ0JBQVksS0FBWixnQkFBWSxRQTZRekI7QUFBRCxDQUFDLEVBN1FTLEdBQUcsS0FBSCxHQUFHLFFBNlFaIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL0B0eXBlcy9jZHAucGx1Z2luLm5hdGl2ZWJyaWRnZS5kLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBDRFAuTmF0aXZlQnJpZGdlIHtcclxuXHJcbiAgICBpbXBvcnQgUGx1Z2luICAgPSBDRFAuUGx1Z2luLk5hdGl2ZUJyaWRnZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBpbnRlcmZhY2UgRmVhdHVyZVxyXG4gICAgICogQGJyaWVmIGZlYXR1cmUgaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIEBpbnRlcmZhY2UgRmVhdHVyZVxyXG4gICAgICogQGJyaWVmIOapn+iDveaDheWgsVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEZlYXR1cmUgZXh0ZW5kcyBQbHVnaW4uRmVhdHVyZSB7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBpbnRlcmZhY2UgQ29uc3RydWN0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIE5hdGl2ZUJyaWRnZSBjbGFzcydzIGNvbnNydHJ1Y3Rpb24gb3B0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGludGVyZmFjZSBDb25zdHJ1Y3RPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYg5Yid5pyf5YyW44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ29uc3RydWN0T3B0aW9ucyBleHRlbmRzIFBsdWdpbi5Db25zdHJ1Y3RPcHRpb25zIHtcclxuICAgICAgICB1c2VSYXdQbHVnaW5SZXN1bHQ/OiBib29sZWFuOyAgIC8vIFvpgY7ljrvkupLmj5vnlKhdIGV4ZWMg44Kz44O844Or5pmC44GrLCBJUmVzdWx0IOOBp+i/lOWNtOOBmeOCi+WgtOWQiCB0cnVlLiBkZWZhdWx0OiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogQGludGVyZmFjZSBJUmVzdWx0XHJcbiAgICAgKiBAYnJpZWYgTmF0aXZlQnJpZGdlIGJhc2UgcmVzdWx0IGluZm9ybWF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBAaW50ZXJmYWNlIElSZXN1bHRcclxuICAgICAqIEBicmllZiBOYXRpdmVCcmlkZ2Ug44Gu5Z+65bqVIFJlc3VsdCDmg4XloLFcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUmVzdWx0IGV4dGVuZHMgUGx1Z2luLklSZXN1bHQsIEVycm9yIHtcclxuICAgICAgICBtZXNzYWdlOiBzdHJpbmc7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogQGludGVyZmFjZSBFeGVjT3B0aW9uc1xyXG4gICAgICogQGJyaWVmIGV4ZWMoKSBtZXRob2Qgb3B0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGludGVyZmFjZSBFeGVjT3B0aW9uc1xyXG4gICAgICogQGJyaWVmIGV4ZWMoKSDjgavmuKHjgZnjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFeGVjT3B0aW9ucyBleHRlbmRzIFBsdWdpbi5FeGVjT3B0aW9ucyB7XHJcbiAgICAgICAgcmVjZWl2ZVBhcmFtcz86IGJvb2xlYW47IC8vIGV4ZWMg5oiQ5Yqf5pmC44GrLCAuLi5wYXJhbXMsIElSZXN1bHQg44Gn6L+U5Y2044GZ44KL5aC05ZCIIHRydWVcclxuICAgIH1cclxufVxyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCJjZHAubmF0aXZlYnJpZGdlXCIge1xyXG4gICAgY29uc3QgTmF0aXZlQnJpZGdlOiB0eXBlb2YgQ0RQLk5hdGl2ZUJyaWRnZTtcclxuICAgIGV4cG9ydCA9IE5hdGl2ZUJyaWRnZTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbnVtICBSRVNVTFRfQ09ERV9CQVNFXHJcbiAgICAgKiBAYnJpZWYg44Oq44K244Or44OI44Kz44O844OJ44Gu44Kq44OV44K744OD44OI5YCkXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFX0JBU0Uge1xyXG4gICAgICAgIENEUF9OQVRJVkVCUklER0VfREVDTEFSRVJBVElPTiA9IDAsIC8vIFRTMjQzMiDlr77nrZZcclxuICAgICAgICBDRFBfTkFUSVZFQlJJREdFID0gMiAqIE1PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRV9DRFAsXHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIG1vZHVsZSBlcnJvciBkZWNsYXJhdGlvbjpcclxuXHJcbiAgICBjb25zdCBGVU5DVElPTl9DT0RFX1JBTkdFID0gMTA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW51bSAgTE9DQUxfQ09ERV9CQVNFXHJcbiAgICAgKiBAYnJpZWYgY2RwLm5hdGl2ZWJyaWRnZSDlhoXjga7jg63jg7zjgqvjg6vjgrPjg7zjg4njgqrjg5Xjgrvjg4Pjg4jlgKRcclxuICAgICAqL1xyXG4gICAgZW51bSBMT0NBTF9DT0RFX0JBU0Uge1xyXG4gICAgICAgIEdBVEUgICAgPSAwLFxyXG4gICAgICAgIFVUSUxTICAgPSAxICogRlVOQ1RJT05fQ09ERV9SQU5HRSxcclxuICAgIH1cclxuXHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIFJFU1VMVF9DT0RFXHJcbiAgICAgKiBAYnJpZWYgY2RwLW5hdGl2ZWJyaWRnZSDjga7jgqjjg6njg7zjgrPjg7zjg4nlrprnvqlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREUge1xyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER19ERUNMQVJBVElPTiAgICAgICAgICAgICAgID0gMCwgLy8gVFMyNDMyIOWvvuetllxyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER0VfSU5WQUxJRF9BUkcgICAgICAgICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX05BVElWRUJSSURHRSwgTE9DQUxfQ09ERV9CQVNFLkdBVEUgKyAxLCBcImNhbGxlZCB3aXRoIGludmFsaWQgYXJncy5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX05BVElWRUJSSURHRV9OT1RfSU1QTEVNRU5UICAgICAgICAgICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfTkFUSVZFQlJJREdFLCBMT0NBTF9DT0RFX0JBU0UuR0FURSArIDIsIFwibWV0aG9kIG5vdCBpbXBsZW1lbnRlZC5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX05BVElWRUJSSURHRV9OT1RfU1VQUE9SVCAgICAgICAgICAgICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfTkFUSVZFQlJJREdFLCBMT0NBTF9DT0RFX0JBU0UuR0FURSArIDMsIFwibWV0aG9kIG5vdCBzdXBwb3J0ZWQuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER0VfSU5WQUxJRF9PUEVSQVRJT04gICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX05BVElWRUJSSURHRSwgTE9DQUxfQ09ERV9CQVNFLkdBVEUgKyA0LCBcImludmFsaWQgb3BlcmF0aW9uLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdFX0NMQVNTX05PVF9GT1VORCAgICAgICAgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9OQVRJVkVCUklER0UsIExPQ0FMX0NPREVfQkFTRS5HQVRFICsgNSwgXCJjbGFzcyBub3QgZm91bmQuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER0VfTUVUSE9EX05PVF9GT1VORCAgICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX05BVElWRUJSSURHRSwgTE9DQUxfQ09ERV9CQVNFLkdBVEUgKyA2LCBcIm1ldGhvZCBub3QgZm91bmQuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER0VfQ09SRE9WQV9SRVFVSVJFRCAgICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX05BVElWRUJSSURHRSwgTE9DQUxfQ09ERV9CQVNFLlVUSUxTICsgMSwgXCJjb3Jkb3ZhIHJlcXVpcmVkLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdFX0NPUkRPVkFfUExVR0lOX1JFUVVJUkVEICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9OQVRJVkVCUklER0UsIExPQ0FMX0NPREVfQkFTRS5VVElMUyArIDIsIFwiJ2NvcmRvdmEtcGx1Z2luLWNkcC1uYXRpdmVicmlkZ2UnIGNvcmRvdmEgcGx1Z2luIHJlcXVpcmVkLlwiKSxcclxuICAgIH1cclxuICAgIC8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5OYXRpdmVCcmlkZ2Uge1xyXG5cclxuICAgIGltcG9ydCBJUHJvbWlzZUJhc2UgPSBDRFAuSVByb21pc2VCYXNlO1xyXG4gICAgaW1wb3J0IElQcm9taXNlICAgICA9IENEUC5JUHJvbWlzZTtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuTmF0aXZlQnJpZGdlLlV0aWxzXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBjbGFzcyBVdGlsc1xyXG4gICAgICogQGJyaWVmIFRoZSB1dGlsaXR5IGNsYXNzIGZvciBDRFAuTmF0aXZlQnJpZGdlLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBAY2xhc3MgVXRpbHNcclxuICAgICAqIEBicmllZiBDRFAuTmF0aXZlQnJpZGdlIOOBjOS9v+eUqOOBmeOCi+ODpuODvOODhuOCo+ODquODhuOCo+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgVXRpbHMge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX3BsdWdpblJlYWR5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBEZWZpbmVzIGVycm9yIGNvZGUgbWFwIGZyb20gdGhlIHBsdWdpbiByZXN1bHQgdG8gQ0RQLk5hdGl2ZUJyaWRnZSByZXN1bHQgY29kZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBlcnJvckNvZGUgW2luXSBzZXQgcmVzdWx0IGNvZGUgc3RyaW5nLiBleCk6IFwiU1VDQ0VTU19PS1wiXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIHBsdWdpbiDjga4gUmVzdWx0IENvZGUg44KSIENEUC5OYXRpdmVCcmlkZ2Ug44Gr44Oe44OD44OX44GZ44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXJyb3JDb2RlIFtpbl0gUmVzdWx0IENvZGUg5paH5a2X5YiX44KS5oyH5a6aIGV4KTogXCJTVUNDRVNTX09LXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRlZmluZVJlc3VsdENvZGUoZXJyb3JDb2RlOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KE5hdGl2ZUJyaWRnZSwgZXJyb3JDb2RlLCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoVXRpbHMuc19wbHVnaW5SZWFkeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUGx1Z2luLk5hdGl2ZUJyaWRnZVtlcnJvckNvZGVdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIFdhaXQgZm9yIGNvcmRvdmEgXCJkZXZpY2VyZWFkeVwiIGV2ZW50IGZpcmVkLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiBjb3Jkb3ZhIOOBjCDkvb/nlKjlj6/og73jgavjgarjgovjgb7jgaflvoXmqZ9cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHdhaXRGb3JQbHVnaW5SZWFkeSgpOiBJUHJvbWlzZUJhc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICBjb25zdCBkZiA9ICQuRGVmZXJyZWQ8dm9pZD4oKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChVdGlscy5zX3BsdWdpblJlYWR5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJC5EZWZlcnJlZDx2b2lkPigpLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoYW5uZWwgPSBjb3Jkb3ZhLnJlcXVpcmUoXCJjb3Jkb3ZhL2NoYW5uZWxcIik7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsLm9uQ29yZG92YVJlYWR5LnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gQ0RQLlBsdWdpbi5OYXRpdmVCcmlkZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVXRpbHMuc19wbHVnaW5SZWFkeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QobWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfQ09SRE9WQV9QTFVHSU5fUkVRVUlSRUQsIFRBR1xyXG4gICAgICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGRmLnJlamVjdChtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfQ09SRE9WQV9SRVFVSVJFRCwgVEFHXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRmLnByb21pc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBDcmVhdGUgTmF0aXZlQnJpZGdlLlByb21pc2Ugb2JqZWN0IGZyb20galF1ZXJ5RGVmZXJyZWQgb2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRmIFtpbl0gc2V0IGpRdWVyeURlZmVycmVkIGluc3RhbmNlLlxyXG4gICAgICAgICAqIEBwYXJhbSB1c2VSYXdQbHVnaW5SZXN1bHQgW2luXSByZXR1cm4gcGx1Z2luIHJlc3VsdCBvciBlcnJvcmluZm9cclxuICAgICAgICAgKiBAcmV0dXJucyBOYXRpdmVCcmlkZ2UuUHJvbWlzZSBvYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44Gu5L2c5oiQXHJcbiAgICAgICAgICogalF1ZXJ5RGVmZXJyZWQg44Kq44OW44K444Kn44Kv44OI44GL44KJ44CBTmF0aXZlQnJpZGdlLlByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44KS5L2c5oiQ44GZ44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGYgW2luXSBqUXVlcnlEZWZlcnJlZCBpbnN0YW5jZSDjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gdXNlUmF3UGx1Z2luUmVzdWx0IFtpbl0gcGx1Z2luIHJlc3VsdCDjgpLov5TjgZnjgYvlkKbjgYtcclxuICAgICAgICAgKiBAcmV0dXJucyBOYXRpdmVCcmlkZ2UuUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIG1ha2VQcm9taXNlKGRmOiBKUXVlcnlEZWZlcnJlZDxJUmVzdWx0PiwgdXNlUmF3UGx1Z2luUmVzdWx0OiBib29sZWFuKTogSVByb21pc2U8SVJlc3VsdD4ge1xyXG4gICAgICAgICAgICByZXR1cm4gQ0RQLm1ha2VQcm9taXNlKGRmLCB7XHJcbiAgICAgICAgICAgICAgICBfYnJpZGdlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgX3Rhc2tJZDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGFib3J0OiBmdW5jdGlvbiAoaW5mbz86IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvZGUgPSB1c2VSYXdQbHVnaW5SZXN1bHQgPyBOYXRpdmVCcmlkZ2UuRVJST1JfQ0FOQ0VMIDogUkVTVUxUX0NPREUuU1VDQ0VFREVEO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9ICQuZXh0ZW5kKHsgY29kZTogY29kZSB9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiYWJvcnRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogVEFHICsgXCJtZXRob2QgY2FuY2VsZWRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFza0lkOiB0aGlzLl90YXNrSWQsXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgaW5mbyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhbmNlbCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fYnJpZGdlICYmIG51bGwgIT0gdGhpcy5fdGFza0lkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9icmlkZ2UuY2FuY2VsKHRoaXMuX3Rhc2tJZCwgZGV0YWlsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoZGV0YWlsKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLmRlcGVuZGVuY3kpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVwZW5kZW5jeS5hYm9ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXBlbmRlbmN5LmFib3J0KGRldGFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiW2NhbGxdIGRlcGVuZGVuY3kgb2JqZWN0IGRvZXNuJ3QgaGF2ZSAnYWJvcnQoKScgbWV0aG9kLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jYWxsUmVqZWN0ICYmIFwicGVuZGluZ1wiID09PSB0aGlzLnN0YXRlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcInBlbmRpbmdcIiA9PT0gdGhpcy5zdGF0ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNvcnJlY3RseSBzZXQgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiwgZm9yIHN1YmNsYXNzZXMuXHJcbiAgICAgICAgICogVGhlIGZ1bmN0aW9uIGJlaGF2aW9yIGlzIHNhbWUgYXMgZXh0ZW5kKCkgZnVuY3Rpb24gb2YgQmFja2JvbmUuanMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcHJvdG9Qcm9wcyAgW2luXSBzZXQgcHJvdG90eXBlIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0aWNQcm9wcyBbaW5dIHNldCBzdGF0aWMgcHJvcGVydGllcyBhcyBvYmplY3QuXHJcbiAgICAgICAgICogQHJldHVybnMgc3ViY2xhc3MgY29uc3RydWN0b3IuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIOOCr+ODqeOCuee2meaJv+OBruOBn+OCgeOBruODmOODq+ODkeODvOmWouaVsFxyXG4gICAgICAgICAqIEJhY2tib25lLmpzIGV4dGVuZCgpIOmWouaVsOOBqOWQjOetiVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHByb3RvUHJvcHMgIFtpbl0gcHJvdG90eXBlIHByb3BlcnRpZXMg44KS44Kq44OW44K444Kn44Kv44OI44Gn5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXRpY1Byb3BzIFtpbl0gc3RhdGljIHByb3BlcnRpZXMg44KS44Kq44OW44K444Kn44Kv44OI44Gn5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnMg44K144OW44Kv44Op44K544Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlbmQocHJvdG9Qcm9wczogb2JqZWN0LCBzdGF0aWNQcm9wcz86IG9iamVjdCk6IG9iamVjdCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcm90b1Byb3BzICYmIHByb3RvUHJvcHMuaGFzT3duUHJvcGVydHkoXCJjb25zdHJ1Y3RvclwiKSkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJC5leHRlbmQoY2hpbGQsIHBhcmVudCwgc3RhdGljUHJvcHMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgU3Vycm9nYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTdXJyb2dhdGUucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcclxuICAgICAgICAgICAgY2hpbGQucHJvdG90eXBlID0gbmV3IFN1cnJvZ2F0ZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcm90b1Byb3BzKSB7XHJcbiAgICAgICAgICAgICAgICAkLmV4dGVuZChjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLk5hdGl2ZUJyaWRnZSB7XHJcblxyXG4gICAgaW1wb3J0IElQcm9taXNlICAgICA9IENEUC5JUHJvbWlzZTtcclxuICAgIGltcG9ydCBJUHJvbWlzZUJhc2UgPSBDRFAuSVByb21pc2VCYXNlO1xyXG5cclxuICAgIGNvbnN0IFRBRzogc3RyaW5nID0gXCJbQ0RQLk5hdGl2ZUJyaWRnZS5HYXRlXSBcIjtcclxuXHJcbiAgICAvLyBQbHVnaW4gcmF3IFJlc3VsdCBjb2RlXHJcblxyXG4gICAgZXhwb3J0IGxldCBTVUNDRVNTX09LOiBudW1iZXI7ICAgICAgICAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiU1VDQ0VTU19PS1wiKTtcclxuICAgIGV4cG9ydCBsZXQgU1VDQ0VTU19QUk9HUkVTUzogbnVtYmVyOyAgICAgICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIlNVQ0NFU1NfUFJPR1JFU1NcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX0ZBSUw6IG51bWJlcjsgICAgICAgICAgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9GQUlMXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9DQU5DRUw6IG51bWJlcjsgICAgICAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfQ0FOQ0VMXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9JTlZBTElEX0FSRzogbnVtYmVyOyAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfSU5WQUxJRF9BUkdcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX05PVF9JTVBMRU1FTlQ6IG51bWJlcjsgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9OT1RfSU1QTEVNRU5UXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9OT1RfU1VQUE9SVDogbnVtYmVyOyAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfTk9UX1NVUFBPUlRcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX0lOVkFMSURfT1BFUkFUSU9OOiBudW1iZXI7IFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9JTlZBTElEX09QRVJBVElPTlwiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfQ0xBU1NfTk9UX0ZPVU5EOiBudW1iZXI7ICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX0NMQVNTX05PVF9GT1VORFwiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfTUVUSE9EX05PVF9GT1VORDogbnVtYmVyOyAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX01FVEhPRF9OT1RfRk9VTkRcIik7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnZlcnRFcnJvckluZm8ocmVzdWx0OiBJUmVzdWx0IHwgQ0RQLlBsdWdpbi5OYXRpdmVCcmlkZ2UuSVJlc3VsdCk6IEVycm9ySW5mbyB7XHJcbiAgICAgICAgbGV0IHJlc3VsdENvZGU6IG51bWJlcjtcclxuICAgICAgICBzd2l0Y2ggKHJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgRVJST1JfQ0FOQ0VMOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRVJST1JfSU5WQUxJRF9BUkc6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9JTlZBTElEX0FSRztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEVSUk9SX05PVF9JTVBMRU1FTlQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9OT1RfSU1QTEVNRU5UO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRVJST1JfTk9UX1NVUFBPUlQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9OT1RfU1VQUE9SVDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEVSUk9SX0lOVkFMSURfT1BFUkFUSU9OOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q29kZSA9IFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfSU5WQUxJRF9PUEVSQVRJT047XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBFUlJPUl9DTEFTU19OT1RfRk9VTkQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9DTEFTU19OT1RfRk9VTkQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBFUlJPUl9NRVRIT0RfTk9UX0ZPVU5EOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q29kZSA9IFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfTUVUSE9EX05PVF9GT1VORDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEVSUk9SX0ZBSUw6XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRkFJTEVEO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChFUlJPUl9DQU5DRUwgPT09IHJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlQ2FuY2VsZWRFcnJvckluZm8oVEFHLCA8SVJlc3VsdD5yZXN1bHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlRXJyb3JJbmZvKHJlc3VsdENvZGUsIFRBRywgbnVsbCwgPElSZXN1bHQ+cmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBjbGFzcyBHYXRlXHJcbiAgICAgKiBAYnJpZWYgVGhlIGJhc2UgY2xhc3MgZm9yIE5hdGl2ZUJyaWRnZSBjb21tdW5pY2F0aW9uLlxyXG4gICAgICogICAgICAgIFlvdSBjYW4gZGVyaXZlIGFueSBHYXRlIGNsYXNzIGZyb20gdGhpcyBjbGFzcy5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGNsYXNzIEdhdGVcclxuICAgICAqIEBicmllZiBOYXRpdmVCcmlkZ2Ug44Go6YCa5L+h44GZ44KL44OZ44O844K544Kv44Op44K5XHJcbiAgICAgKiAgICAgICAg44GT44Gu44Kv44Op44K544GL44KJ5Lu75oSP44GuIEdhdGUg44Kv44Op44K544KS5rS+55Sf44GX44Gm5a6f6KOF5Y+v6IO9XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBHYXRlIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfYnJpZGdlOiBQbHVnaW4uTmF0aXZlQnJpZGdlO1xyXG4gICAgICAgIHByaXZhdGUgX29wdGlvbnM6IENvbnN0cnVjdE9wdGlvbnM7XHJcblxyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSAqL1xyXG4gICAgICAgIC8vIEZvciBwdXJlIGphdmFzY3JpcHQgZXh0ZW5kIGhlbHBlci5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBleHRlbmQgPSBVdGlscy5leHRlbmQ7XHJcbiAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZmVhdHVyZSBbaW5dIGZlYXR1cmUgaW5mb3JtYXRpb24uXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSBjb25zdHJ1Y3Rpb24gb3B0aW9ucy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBmZWF0dXJlIFtpbl0g5Yid5pyf5YyW5oOF5aCx44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSDjgqrjg5fjgrfjg6fjg7PjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihmZWF0dXJlOiBGZWF0dXJlLCBvcHRpb25zPzogQ29uc3RydWN0T3B0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLl9vcHRpb25zID0gJC5leHRlbmQoe1xyXG4gICAgICAgICAgICAgICAgdXNlUmF3UGx1Z2luUmVzdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIFV0aWxzLndhaXRGb3JQbHVnaW5SZWFkeSgpXHJcbiAgICAgICAgICAgICAgICAuZG9uZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnJpZGdlID0gbmV3IFBsdWdpbi5OYXRpdmVCcmlkZ2UoZmVhdHVyZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIG92ZXJyaWRlIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIEV4ZWN1dGUgdGFzay5cclxuICAgICAgICAgKiB0aGUgZnVuY3Rpb24gY2FsbHMgdGhlIE5hdGl2ZSBjbGFzcyBtZXRob2QgZnJvbSBjb3JyZXNwb25kZW50IG1ldGhvZCBuYW1lLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZCAgW2luXSBtZXRob2QgbmFtZSBvZiBOYXRpdmUgY2xhc3NcclxuICAgICAgICAgKiBAcGFyYW0gYXJncyAgICBbaW5dIHNldCBhcmd1bWVudHMgYnkgYXJyYXkgdHlwZS5cclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIHNldCBleGVjIG9wdGlvbnMuXHJcbiAgICAgICAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIOOCv+OCueOCr+OBruWun+ihjFxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBnyBtZXRob2Qg5ZCN44Gr5a++5b+c44GZ44KLIE5hdGl2ZSBDbGFzcyDjga4gbWV0aG9kIOOCkuWRvOOBs+WHuuOBmeOAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZCAgW2luXSBOYXRpdmUgQ2xhc3Mg44Gu44Oh44K944OD44OJ5ZCN44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIGFyZ3MgICAgW2luXSDlvJXmlbDjgpLphY3liJfjgafmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIOWun+ihjOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGV4ZWMobWV0aG9kOiBzdHJpbmcsIGFyZ3M/OiBhbnlbXSwgb3B0aW9ucz86IEV4ZWNPcHRpb25zKTogSVByb21pc2U8YW55PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZCgpO1xyXG4gICAgICAgICAgICBjb25zdCBvcHQgPSAkLmV4dGVuZCh7fSwgdGhpcy5fb3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSBVdGlscy5tYWtlUHJvbWlzZShkZiwgb3B0LnVzZVJhd1BsdWdpblJlc3VsdCk7XHJcblxyXG4gICAgICAgICAgICBVdGlscy53YWl0Rm9yUGx1Z2luUmVhZHkoKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhc2tJZCA9IHRoaXMuX2JyaWRnZS5leGVjKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0OiBJUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoU1VDQ0VTU19QUk9HUkVTUyA9PT0gcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdC51c2VSYXdQbHVnaW5SZXN1bHQgJiYgbnVsbCAhPSByZXN1bHQucGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLm5vdGlmeSguLi5bLi4ucmVzdWx0LnBhcmFtcywgcmVzdWx0XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYubm90aWZ5KHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIW9wdC51c2VSYXdQbHVnaW5SZXN1bHQgJiYgbnVsbCAhPSByZXN1bHQucGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUoLi4uWy4uLnJlc3VsdC5wYXJhbXMsIHJlc3VsdF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChlcnJvcjogSVJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC51c2VSYXdQbHVnaW5SZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoY29udmVydEVycm9ySW5mbyhlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2QsIGFyZ3MsIG9wdGlvbnNcclxuICAgICAgICAgICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXQgaW50ZXJuYWwgcHJvcGVydGllcy5cclxuICAgICAgICAgICAgICAgICAgICAoPGFueT5wcm9taXNlKS5fYnJpZGdlID0gdGhpcy5fYnJpZGdlO1xyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnByb21pc2UpLl90YXNrSWQgPSB0YXNrSWQ7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgICAgICogQ2FuY2VsIGFsbCB0YXNrcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIFtpbl0gc2V0IGV4ZWN1dGUgb3B0aW9ucy5cclxuICAgICAgICAgKiBAcmV0dXJucyBQcm9taXNlIG9iamVjdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICog44GZ44G544Gm44Gu44K/44K544Kv44Gu44Kt44Oj44Oz44K744OrXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIOWun+ihjOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNhbmNlbChvcHRpb25zPzogRXhlY09wdGlvbnMpOiBJUHJvbWlzZUJhc2U8SVJlc3VsdD4ge1xyXG4gICAgICAgICAgICBjb25zdCBkZiA9ICQuRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgY29uc3Qgb3B0ID0gJC5leHRlbmQoe30sIHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgVXRpbHMud2FpdEZvclBsdWdpblJlYWR5KClcclxuICAgICAgICAgICAgICAgIC5kb25lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9icmlkZ2UuY2FuY2VsKG51bGwsIG9wdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHQudXNlUmF3UGx1Z2luUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGNvbnZlcnRFcnJvckluZm8oZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGYucHJvbWlzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIERlc3RydWN0aW9uIGZvciB0aGUgaW5zdGFuY2UuXHJcbiAgICAgICAgICogcmVsZWFzZSBOYXRpdmUgY2xhc3MgcmVmZXJlbmNlLiBhZnRlciB0aGF0LCBleGVjKCkgYmVjb21lcyBpbnZhbGlkLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSBzZXQgZXhlY3V0ZSBvcHRpb25zLlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiDjgqTjg7Pjgrnjgr/jg7Pjgrnjga7noLTmo4RcclxuICAgICAgICAgKiBOYXRpdmUg44Gu5Y+C54Wn44KS6Kej6Zmk44GZ44KL44CC5Lul6ZmN44CBZXhlYyDjga/nhKHlirnjgajjgarjgovjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIFtpbl0g5a6f6KGM44Kq44OX44K344On44Oz44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnMgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgZGlzcG9zZShvcHRpb25zPzogRXhlY09wdGlvbnMpOiBJUHJvbWlzZUJhc2U8SVJlc3VsdD4ge1xyXG4gICAgICAgICAgICBjb25zdCBkZiA9ICQuRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgY29uc3Qgb3B0ID0gJC5leHRlbmQoe30sIHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgVXRpbHMud2FpdEZvclBsdWdpblJlYWR5KClcclxuICAgICAgICAgICAgICAgIC5kb25lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9icmlkZ2UuZGlzcG9zZShvcHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnVzZVJhd1BsdWdpblJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChjb252ZXJ0RXJyb3JJbmZvKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgocmVhc29uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KHJlYXNvbik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRmLnByb21pc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJvdGVjdGVkIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIEFjY2VzcyB0byBQbHVnaW4uTmF0aXZlQnJpZGdlIG9iamVjdC5cclxuICAgICAgICAgKiBJZiB5b3Ugd2FudCB0byB1c2UgbG93IGxldmVsIGV4ZWMoKSwgeW91IGNhbiB1c2UgdGhpcyBhY2Nlc3Nvci5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIFBsdWdpbi5OYXRpdmVCcmlkZ2UgaW5zdGFuY2UuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIFBsdWdpbi5OYXRpdmVCcmlkZ2Ug44Kq44OW44K444Kn44Kv44OI44G444Gu44Ki44Kv44K744K5XHJcbiAgICAgICAgICog5L2O44Os44OZ44OrIGV4ZWMoKSDjgpLkvb/nlKjjgZfjgZ/jgYTloLTlkIjjgavliKnnlKjlj6/og71cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIFBsdWdpbi5OYXRpdmVCcmlkZ2Ug44Kk44Oz44K544K/44Oz44K5LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3RlY3RlZCBnZXQgYnJpZGdlKCk6IFBsdWdpbi5OYXRpdmVCcmlkZ2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnJpZGdlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=