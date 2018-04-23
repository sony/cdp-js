/*!
 * cdp.nativebridge.js 2.1.1
 *
 * Date: 2018-04-23T06:46:09.114Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(["cdp.core", "cdp.promise"], function () { return factory(root.CDP || (root.CDP = {}), root.jQuery || root.$); }); } else { factory(root.CDP || (root.CDP = {}), root.jQuery || root.$); } }(((this || 0).self || global), function (CDP, $) { CDP.NativeBridge = CDP.NativeBridge || {};
var CDP;
(function (CDP) {
    // @internal Error code offset definition of `cdp-nativebridge`.
    var RESULT_CODE_BASE;
    (function (RESULT_CODE_BASE) {
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_NATIVEBRIDGE_DECLARERATION"] = 0] = "CDP_NATIVEBRIDGE_DECLARERATION";
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_NATIVEBRIDGE"] = 2 * CDP._MODULE_RESULT_CODE_RANGE_CDP] = "CDP_NATIVEBRIDGE";
    })(RESULT_CODE_BASE = CDP.RESULT_CODE_BASE || (CDP.RESULT_CODE_BASE = {}));
    ///////////////////////////////////////////////////////////////////////
    // module error declaration:
    var FUNCTION_CODE_RANGE = 10;
    // @internal cdp.nativebridge 内のローカルコードオフセット値
    var LOCAL_CODE_BASE;
    (function (LOCAL_CODE_BASE) {
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["GATE"] = 0] = "GATE";
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["UTILS"] = 1 * FUNCTION_CODE_RANGE] = "UTILS";
    })(LOCAL_CODE_BASE || (LOCAL_CODE_BASE = {}));
    /* tslint:disable:max-line-length */
    // Error code definition of `cdp-nativebridge`.
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
         * @en The utility class for CDP.NativeBridge.
         * @ja CDP.NativeBridge が使用するユーティリティクラス
         */
        var Utils = /** @class */ (function () {
            function Utils() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static methods
            /**
             * @en Defines error code map from the plugin result to CDP.NativeBridge result code.
             * @ja plugin の Result Code を CDP.NativeBridge にマップする
             *
             * @param errorCode
             *  - `en` set result code string. ex): "SUCCESS_OK"
             *  - `ja` Result Code 文字列を指定 ex): "SUCCESS_OK"
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
             * @en Wait for cordova "deviceready" event fired.
             * @ja cordova が 使用可能になるまで待機
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
             * @en Create NativeBridge.Promise object from jQueryDeferred object.
             * @ja Promise オブジェクトの作成
             *     jQueryDeferred オブジェクトから、NativeBridge.Promise オブジェクトを作成する
             *
             * @param df
             *  - `en` set jQueryDeferred instance.
             *  - `ja` jQueryDeferred instance を指定
             * @param useRawPluginResult
             *  - `en` return plugin result or errorinfo
             *  - `ja` plugin result を返すか否か
             * @returns
             *  - `en` NativeBridge.Promise object.
             *  - `ja` NativeBridge.Promise オブジェクト
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
             * @en Helper function to correctly set up the prototype chain, for subclasses.
             *     The function behavior is same as extend() function of Backbone.js.
             * @ja クラス継承のためのヘルパー関数
             *     Backbone.js extend() 関数と同等
             *
             * @param protoProps
             *  - `en` set prototype properties as object.
             *  - `ja` prototype properties をオブジェクトで指定
             * @param staticProps
             *  - `en` set static properties as object.
             *  - `ja` static properties をオブジェクトで指定
             * @returns
             *  - `en` subclass constructor.
             *  - `ja` サブクラスのコンストラクタ
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
         * @en The base class for NativeBridge communication.
         *     You can derive any Gate class from this class.
         * @ja NativeBridge と通信するベースクラス
         *     このクラスから任意の Gate クラスを派生して実装可能
         *
         * @example <br>
         *
         * ```ts
         *  import { Gate } from "cdp/bridge";
         *
         *  export class SimpleGate extends Gate {
         *    constructor() {
         *      super({  // set CDP.NativeBridge.Feature object to super constructor. (required)
         *        name: "SimpleGate",
         *        android: {
         *          // the class name used by reflection in Anroid Java.
         *          packageInfo: "com.sony.cdp.sample.SimpleGate",
         *        },
         *        ios: {
         *          // the class name used by reflection in Objective-C.
         *          packageInfo: "SMPSimpleGate",
         *        },
         *      });
         *    }
         *
         *    // an example definition of client method.
         *    //  any type of primitive / JSON is available. (cordova compatible. void is also possible.)
         *    //  default return value is Promise object.
         *    public coolMethod(arg1: number, arg2: boolean, arg3: string, arg4: Object): Promise {
         *      // calling super.exec().
         *      // the first argument is method name set by string.
         *      // the second argument is "arguments" set available. (<any> cast required)
         *      //
         *      // !! Note !!
         *      // When null/undefined passes to arguments,
         *      // you must to set default value to the argument in this layer.
         *      return super.exec("coolMethod", <any>arguments);
         *    }
         *  }
         * ```
         */
        var Gate = /** @class */ (function () {
            /* tslint:enable:no-unused-variable */
            /**
             * @param feature
             *  - `en` feature information.
             *  - `ja` 初期化情報を指定
             * @param options
             *  - `en` construction options.
             *  - `ja` オプションを指定
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
             * @en Execute task.
             *     the function calls the Native class method from correspondent method name.
             * @ja タスクの実行
             *     指定した method 名に対応する Native Class の method を呼び出す。
             *
             * @param method
             *  - `en` method name of Native class
             *  - `ja` Native Class のメソッド名を指定
             * @param args
             *  - `en` set arguments by array type.
             *  - `ja` 引数を配列で指定
             * @param options
             *  - `en` set exec options.
             *  - `ja` 実行オプションを指定
             * @returns
             *  - `en` Promise object.
             *  - `ja` Promise オブジェクト
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
             * @en Cancel all tasks.
             * @ja すべてのタスクのキャンセル
             *
             * @param options
             *  - `en` set execute options.
             *  - `ja` 実行オプションを指定
             * @returns
             *  - `en` Promise object.
             *  - `ja` Promise オブジェクト
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
             * @en Destruction for the instance.
             *     release Native class reference. after that, exec() becomes invalid.
             * @ja インスタンスの破棄
             *     Native の参照を解除する。以降、exec は無効となる。
             *
             * @param options
             *  - `en` set execute options.
             *  - `ja` 実行オプションを指定
             * @returns Promise object.
             *  - `en` Promise object.
             *  - `ja` Promise オブジェクト
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
                 * @en Access to Plugin.NativeBridge object.
                 *     If you want to use low level exec(), you can use this accessor.
                 * @ja Plugin.NativeBridge オブジェクトへのアクセス
                 *     低レベル exec() を使用したい場合に利用可能
                 *
                 * @returns
                 *  - `en` Plugin.NativeBridge instance.
                 *  - `ja` Plugin.NativeBridge インスタンス
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvTmF0aXZlQnJpZGdlL0ludGVyZmFjZXMudHMiLCJjZHA6Ly8vQ0RQL05hdGl2ZUJyaWRnZS9FcnJvckRlZnMudHMiLCJjZHA6Ly8vQ0RQL05hdGl2ZUJyaWRnZS9VdGlscy50cyIsImNkcDovLy9DRFAvTmF0aXZlQnJpZGdlL0dhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsUUFBa0U7QUNBbEUsSUFBVSxHQUFHLENBaUNaO0FBakNELFdBQVUsR0FBRztJQUVULHFCQUFnRTtJQUNoRSxJQUFZLGdCQUdYO0lBSEQsV0FBWSxnQkFBZ0I7UUFDeEIsMkdBQWtDO1FBQ2xDLHdEQUFtQixDQUFDLEdBQUcsV0FBNkI7SUFDeEQsQ0FBQyxFQUhXLGdCQUFnQixHQUFoQixvQkFBZ0IsS0FBaEIsb0JBQWdCLElBRzNCO0lBRUQsNEJBQXVFO0lBQ3ZFLDRCQUE0QjtJQUU1QixJQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztJQUUvQixvQkFBNkM7SUFDN0MsSUFBSyxlQUdKO0lBSEQsV0FBSyxlQUFlO1FBQ2hCLHFEQUFXO1FBQ1gsMENBQWlDO0lBQ3JDLENBQUMsRUFISSxlQUFlLEtBQWYsYUFHSjtJQUVELG9DQUFvQztJQUNwQyxnQkFBK0M7SUFDL0MsSUFBWSxXQVVYO0lBVkQsV0FBWSxXQUFXO1FBQ25CLHVHQUFtRDtRQUNuRCxnRUFBa0Qsc0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsMkJBQTJCLENBQUM7UUFDOUosa0VBQWtELHNCQUFrQixDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLHlCQUF5QixDQUFDO1FBQzVKLGdFQUFrRCxzQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSx1QkFBdUIsQ0FBQztRQUMxSixz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cEI7NkJBQU07eUJBQ2dDO3VCQUN0QztrQkFFUDtnQkFDTixDQUFDLENBQUM7cUJBQ0QsS0FBSyxDQUFDLFVBQUMsQ0FBTTttQkFDUTtnQkFDdEIsQ0FBQyxDQUFDLENBQUM7Y0FDYTtZQUN4QixDQUFDO1lBZUQsc0JBQWMsd0JBQU07Z0JBYnBCLG9CQUF1RTtnQkFDdkUsR0FBb0I7Z0JBRXBCOzs7Ozs7Ozs7bUJBU0c7cUJBQ0g7a0JBQ3dCO2dCQUN4QixDQUFDOzs7ZUFBQTtZQXJMRCxxQ0FBdUM7WUFDdkMscUNBQXFDO1lBQ3RCLFdBQU0sQ0FBZ0I7WUFvTHpDLENBQUM7U0FBQTtRQTNMWSxpQkFBSSxPQTJMaEI7SUFDTCxDQUFDLEVBaFNhLFlBQVksR0FnU3pCIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL0B0eXBlcy9jZHAucGx1Z2luLm5hdGl2ZWJyaWRnZS5kLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBDRFAuTmF0aXZlQnJpZGdlIHtcclxuXHJcbiAgICBpbXBvcnQgUGx1Z2luICAgPSBDRFAuUGx1Z2luLk5hdGl2ZUJyaWRnZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDb3Jkb3ZhIGZlYXR1cmUgaW5mb3JtYXRpb24uXHJcbiAgICAgKiBAamEg5qmf6IO95oOF5aCxXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRmVhdHVyZSBleHRlbmRzIFBsdWdpbi5GZWF0dXJlIHsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE5hdGl2ZUJyaWRnZSBjbGFzcydzIGNvbnNydHJ1Y3Rpb24gb3B0aW9ucy5cclxuICAgICAqIEBqYSDliJ3mnJ/ljJbjgavmjIflrprjgZnjgovjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBDb25zdHJ1Y3RPcHRpb25zIGV4dGVuZHMgUGx1Z2luLkNvbnN0cnVjdE9wdGlvbnMge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBbQmFja3dhcmQgQ29tcGF0XSBpZiB5b3Ugd2FudCB0byByZWNlaXZlIElSZXN1bHQgaW5zdGFuY2Ugd2hlbiBleGVjKCkgY2FsbGVkLCBzZXQgdGhlIHBhcmFtICd0cnVlJy4gZGVmYXVsdDogZmFsc2VcclxuICAgICAgICAgKiBAamEgW+mBjuWOu+S6kuaPm+eUqF0gZXhlYyDjgrPjg7zjg6vmmYLjgassIElSZXN1bHQg44Gn6L+U5Y2044GZ44KL5aC05ZCIIHRydWUuIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdXNlUmF3UGx1Z2luUmVzdWx0PzogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBOYXRpdmVCcmlkZ2UgYmFzZSByZXN1bHQgaW5mb3JtYXRpb24uXHJcbiAgICAgKiBAamEgTmF0aXZlQnJpZGdlIOOBruWfuuW6lSBSZXN1bHQg5oOF5aCxXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVJlc3VsdCBleHRlbmRzIFBsdWdpbi5JUmVzdWx0LCBFcnJvciB7XHJcbiAgICAgICAgbWVzc2FnZTogc3RyaW5nO1xyXG4gICAgICAgIG5hbWU6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBleGVjKCkgbWV0aG9kIG9wdGlvbnMuXHJcbiAgICAgKiBAamEgZXhlYygpIOOBq+a4oeOBmeOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEV4ZWNPcHRpb25zIGV4dGVuZHMgUGx1Z2luLkV4ZWNPcHRpb25zIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gW0JhY2t3YXJkIENvbXBhdF0gaWYgeW91IHdhbnQgdG8gcmVjZWl2ZSBJUmVzdWx0IGluc3RhbmNlIHdoZW4gZXhlYygpIGNhbGxlZCwgc2V0IHRoZSBwYXJhbSAndHJ1ZScuXHJcbiAgICAgICAgICogICAgIGRlZmF1bHQ6IHVzZSBDb25zdHJ1Y3RPcHRpb25zIHBhcmFtXHJcbiAgICAgICAgICogQGphIFvpgY7ljrvkupLmj5vnlKhdIGV4ZWMg44Kz44O844Or5pmC44GrLCBJUmVzdWx0IOOBp+i/lOWNtOOBmeOCi+WgtOWQiCB0cnVlLlxyXG4gICAgICAgICAqICAgICBkZWZhdWx0OiBDb25zdHJ1Y3RPcHRpb25zIHBhcmFtIOaMh+WumuOBleOCjOOBn+WApOOCkuS9v+eUqFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHVzZVJhd1BsdWdpblJlc3VsdD86IGJvb2xlYW47XHJcbiAgICB9XHJcbn1cclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwiY2RwLm5hdGl2ZWJyaWRnZVwiIHtcclxuICAgIGNvbnN0IE5hdGl2ZUJyaWRnZTogdHlwZW9mIENEUC5OYXRpdmVCcmlkZ2U7XHJcbiAgICBleHBvcnQgPSBOYXRpdmVCcmlkZ2U7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgLy8gQGludGVybmFsIEVycm9yIGNvZGUgb2Zmc2V0IGRlZmluaXRpb24gb2YgYGNkcC1uYXRpdmVicmlkZ2VgLlxyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREVfQkFTRSB7XHJcbiAgICAgICAgQ0RQX05BVElWRUJSSURHRV9ERUNMQVJFUkFUSU9OID0gMCwgLy8gVFMyNDMyIOWvvuetllxyXG4gICAgICAgIENEUF9OQVRJVkVCUklER0UgPSAyICogX01PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRV9DRFAsXHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIG1vZHVsZSBlcnJvciBkZWNsYXJhdGlvbjpcclxuXHJcbiAgICBjb25zdCBGVU5DVElPTl9DT0RFX1JBTkdFID0gMTA7XHJcblxyXG4gICAgLy8gQGludGVybmFsIGNkcC5uYXRpdmVicmlkZ2Ug5YaF44Gu44Ot44O844Kr44Or44Kz44O844OJ44Kq44OV44K744OD44OI5YCkXHJcbiAgICBlbnVtIExPQ0FMX0NPREVfQkFTRSB7XHJcbiAgICAgICAgR0FURSAgICA9IDAsXHJcbiAgICAgICAgVVRJTFMgICA9IDEgKiBGVU5DVElPTl9DT0RFX1JBTkdFLFxyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG4gICAgLy8gRXJyb3IgY29kZSBkZWZpbml0aW9uIG9mIGBjZHAtbmF0aXZlYnJpZGdlYC5cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFIHtcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdfREVDTEFSQVRJT04gICAgICAgICAgICAgICA9IDAsIC8vIFRTMjQzMiDlr77nrZZcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdFX0lOVkFMSURfQVJHICAgICAgICAgICAgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9OQVRJVkVCUklER0UsIExPQ0FMX0NPREVfQkFTRS5HQVRFICsgMSwgXCJjYWxsZWQgd2l0aCBpbnZhbGlkIGFyZ3MuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER0VfTk9UX0lNUExFTUVOVCAgICAgICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX05BVElWRUJSSURHRSwgTE9DQUxfQ09ERV9CQVNFLkdBVEUgKyAyLCBcIm1ldGhvZCBub3QgaW1wbGVtZW50ZWQuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9OQVRJVkVCUklER0VfTk9UX1NVUFBPUlQgICAgICAgICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX05BVElWRUJSSURHRSwgTE9DQUxfQ09ERV9CQVNFLkdBVEUgKyAzLCBcIm1ldGhvZCBub3Qgc3VwcG9ydGVkLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdFX0lOVkFMSURfT1BFUkFUSU9OICAgICAgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9OQVRJVkVCUklER0UsIExPQ0FMX0NPREVfQkFTRS5HQVRFICsgNCwgXCJpbnZhbGlkIG9wZXJhdGlvbi5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX05BVElWRUJSSURHRV9DTEFTU19OT1RfRk9VTkQgICAgICAgICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfTkFUSVZFQlJJREdFLCBMT0NBTF9DT0RFX0JBU0UuR0FURSArIDUsIFwiY2xhc3Mgbm90IGZvdW5kLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdFX01FVEhPRF9OT1RfRk9VTkQgICAgICAgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9OQVRJVkVCUklER0UsIExPQ0FMX0NPREVfQkFTRS5HQVRFICsgNiwgXCJtZXRob2Qgbm90IGZvdW5kLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfTkFUSVZFQlJJREdFX0NPUkRPVkFfUkVRVUlSRUQgICAgICAgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9OQVRJVkVCUklER0UsIExPQ0FMX0NPREVfQkFTRS5VVElMUyArIDEsIFwiY29yZG92YSByZXF1aXJlZC5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX05BVElWRUJSSURHRV9DT1JET1ZBX1BMVUdJTl9SRVFVSVJFRCAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfTkFUSVZFQlJJREdFLCBMT0NBTF9DT0RFX0JBU0UuVVRJTFMgKyAyLCBcIidjb3Jkb3ZhLXBsdWdpbi1jZHAtbmF0aXZlYnJpZGdlJyBjb3Jkb3ZhIHBsdWdpbiByZXF1aXJlZC5cIiksXHJcbiAgICB9XHJcbiAgICAvKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuTmF0aXZlQnJpZGdlIHtcclxuXHJcbiAgICBpbXBvcnQgSVByb21pc2VCYXNlID0gQ0RQLklQcm9taXNlQmFzZTtcclxuICAgIGltcG9ydCBJUHJvbWlzZSAgICAgPSBDRFAuSVByb21pc2U7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLk5hdGl2ZUJyaWRnZS5VdGlsc10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHV0aWxpdHkgY2xhc3MgZm9yIENEUC5OYXRpdmVCcmlkZ2UuXHJcbiAgICAgKiBAamEgQ0RQLk5hdGl2ZUJyaWRnZSDjgYzkvb/nlKjjgZnjgovjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFV0aWxzIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19wbHVnaW5SZWFkeSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gRGVmaW5lcyBlcnJvciBjb2RlIG1hcCBmcm9tIHRoZSBwbHVnaW4gcmVzdWx0IHRvIENEUC5OYXRpdmVCcmlkZ2UgcmVzdWx0IGNvZGUuXHJcbiAgICAgICAgICogQGphIHBsdWdpbiDjga4gUmVzdWx0IENvZGUg44KSIENEUC5OYXRpdmVCcmlkZ2Ug44Gr44Oe44OD44OX44GZ44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXJyb3JDb2RlXHJcbiAgICAgICAgICogIC0gYGVuYCBzZXQgcmVzdWx0IGNvZGUgc3RyaW5nLiBleCk6IFwiU1VDQ0VTU19PS1wiXHJcbiAgICAgICAgICogIC0gYGphYCBSZXN1bHQgQ29kZSDmloflrZfliJfjgpLmjIflrpogZXgpOiBcIlNVQ0NFU1NfT0tcIlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZGVmaW5lUmVzdWx0Q29kZShlcnJvckNvZGU6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTmF0aXZlQnJpZGdlLCBlcnJvckNvZGUsIHtcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChVdGlscy5zX3BsdWdpblJlYWR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQbHVnaW4uTmF0aXZlQnJpZGdlW2Vycm9yQ29kZV07XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gV2FpdCBmb3IgY29yZG92YSBcImRldmljZXJlYWR5XCIgZXZlbnQgZmlyZWQuXHJcbiAgICAgICAgICogQGphIGNvcmRvdmEg44GMIOS9v+eUqOWPr+iDveOBq+OBquOCi+OBvuOBp+W+heapn1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgd2FpdEZvclBsdWdpblJlYWR5KCk6IElQcm9taXNlQmFzZTx2b2lkPiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZDx2b2lkPigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKFV0aWxzLnNfcGx1Z2luUmVhZHkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkLkRlZmVycmVkPHZvaWQ+KCkucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hhbm5lbCA9IGNvcmRvdmEucmVxdWlyZShcImNvcmRvdmEvY2hhbm5lbFwiKTtcclxuICAgICAgICAgICAgICAgIGNoYW5uZWwub25Db3Jkb3ZhUmVhZHkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSBDRFAuUGx1Z2luLk5hdGl2ZUJyaWRnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBVdGlscy5zX3BsdWdpblJlYWR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9DT1JET1ZBX1BMVUdJTl9SRVFVSVJFRCwgVEFHXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgZGYucmVqZWN0KG1ha2VFcnJvckluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9DT1JET1ZBX1JFUVVJUkVELCBUQUdcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGYucHJvbWlzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGVuIENyZWF0ZSBOYXRpdmVCcmlkZ2UuUHJvbWlzZSBvYmplY3QgZnJvbSBqUXVlcnlEZWZlcnJlZCBvYmplY3QuXHJcbiAgICAgICAgICogQGphIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OI44Gu5L2c5oiQXHJcbiAgICAgICAgICogICAgIGpRdWVyeURlZmVycmVkIOOCquODluOCuOOCp+OCr+ODiOOBi+OCieOAgU5hdGl2ZUJyaWRnZS5Qcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOCkuS9nOaIkOOBmeOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRmXHJcbiAgICAgICAgICogIC0gYGVuYCBzZXQgalF1ZXJ5RGVmZXJyZWQgaW5zdGFuY2UuXHJcbiAgICAgICAgICogIC0gYGphYCBqUXVlcnlEZWZlcnJlZCBpbnN0YW5jZSDjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gdXNlUmF3UGx1Z2luUmVzdWx0XHJcbiAgICAgICAgICogIC0gYGVuYCByZXR1cm4gcGx1Z2luIHJlc3VsdCBvciBlcnJvcmluZm9cclxuICAgICAgICAgKiAgLSBgamFgIHBsdWdpbiByZXN1bHQg44KS6L+U44GZ44GL5ZCm44GLXHJcbiAgICAgICAgICogQHJldHVybnNcclxuICAgICAgICAgKiAgLSBgZW5gIE5hdGl2ZUJyaWRnZS5Qcm9taXNlIG9iamVjdC5cclxuICAgICAgICAgKiAgLSBgamFgIE5hdGl2ZUJyaWRnZS5Qcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbWFrZVByb21pc2UoZGY6IEpRdWVyeURlZmVycmVkPElSZXN1bHQ+LCB1c2VSYXdQbHVnaW5SZXN1bHQ6IGJvb2xlYW4pOiBJUHJvbWlzZTxJUmVzdWx0PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBDRFAubWFrZVByb21pc2UoZGYsIHtcclxuICAgICAgICAgICAgICAgIF9icmlkZ2U6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBfdGFza0lkOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgYWJvcnQ6IGZ1bmN0aW9uIChpbmZvPzogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY29kZSA9IHVzZVJhd1BsdWdpblJlc3VsdCA/IE5hdGl2ZUJyaWRnZS5FUlJPUl9DQU5DRUwgOiBSRVNVTFRfQ09ERS5TVUNDRUVERUQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGV0YWlsID0gJC5leHRlbmQoeyBjb2RlOiBjb2RlIH0sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJhYm9ydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBUQUcgKyBcIm1ldGhvZCBjYW5jZWxlZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrSWQ6IHRoaXMuX3Rhc2tJZCxcclxuICAgICAgICAgICAgICAgICAgICB9LCBpbmZvKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9icmlkZ2UgJiYgbnVsbCAhPSB0aGlzLl90YXNrSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JyaWRnZS5jYW5jZWwodGhpcy5fdGFza0lkLCBkZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChkZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuZGVwZW5kZW5jeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXBlbmRlbmN5LmFib3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlcGVuZGVuY3kuYWJvcnQoZGV0YWlsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJbY2FsbF0gZGVwZW5kZW5jeSBvYmplY3QgZG9lc24ndCBoYXZlICdhYm9ydCgpJyBtZXRob2QuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNhbGxSZWplY3QgJiYgXCJwZW5kaW5nXCIgPT09IHRoaXMuc3RhdGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwicGVuZGluZ1wiID09PSB0aGlzLnN0YXRlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBIZWxwZXIgZnVuY3Rpb24gdG8gY29ycmVjdGx5IHNldCB1cCB0aGUgcHJvdG90eXBlIGNoYWluLCBmb3Igc3ViY2xhc3Nlcy5cclxuICAgICAgICAgKiAgICAgVGhlIGZ1bmN0aW9uIGJlaGF2aW9yIGlzIHNhbWUgYXMgZXh0ZW5kKCkgZnVuY3Rpb24gb2YgQmFja2JvbmUuanMuXHJcbiAgICAgICAgICogQGphIOOCr+ODqeOCuee2meaJv+OBruOBn+OCgeOBruODmOODq+ODkeODvOmWouaVsFxyXG4gICAgICAgICAqICAgICBCYWNrYm9uZS5qcyBleHRlbmQoKSDplqLmlbDjgajlkIznrYlcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBwcm90b1Byb3BzXHJcbiAgICAgICAgICogIC0gYGVuYCBzZXQgcHJvdG90eXBlIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICAgICAqICAtIGBqYWAgcHJvdG90eXBlIHByb3BlcnRpZXMg44KS44Kq44OW44K444Kn44Kv44OI44Gn5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXRpY1Byb3BzXHJcbiAgICAgICAgICogIC0gYGVuYCBzZXQgc3RhdGljIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICAgICAqICAtIGBqYWAgc3RhdGljIHByb3BlcnRpZXMg44KS44Kq44OW44K444Kn44Kv44OI44Gn5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnNcclxuICAgICAgICAgKiAgLSBgZW5gIHN1YmNsYXNzIGNvbnN0cnVjdG9yLlxyXG4gICAgICAgICAqICAtIGBqYWAg44K144OW44Kv44Op44K544Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBleHRlbmQocHJvdG9Qcm9wczogb2JqZWN0LCBzdGF0aWNQcm9wcz86IG9iamVjdCk6IG9iamVjdCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgICAgIGxldCBjaGlsZDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcm90b1Byb3BzICYmIHByb3RvUHJvcHMuaGFzT3duUHJvcGVydHkoXCJjb25zdHJ1Y3RvclwiKSkge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJC5leHRlbmQoY2hpbGQsIHBhcmVudCwgc3RhdGljUHJvcHMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgU3Vycm9nYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBTdXJyb2dhdGUucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcclxuICAgICAgICAgICAgY2hpbGQucHJvdG90eXBlID0gbmV3IFN1cnJvZ2F0ZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwcm90b1Byb3BzKSB7XHJcbiAgICAgICAgICAgICAgICAkLmV4dGVuZChjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLk5hdGl2ZUJyaWRnZSB7XHJcblxyXG4gICAgaW1wb3J0IElQcm9taXNlICAgICA9IENEUC5JUHJvbWlzZTtcclxuICAgIGltcG9ydCBJUHJvbWlzZUJhc2UgPSBDRFAuSVByb21pc2VCYXNlO1xyXG5cclxuICAgIGNvbnN0IFRBRzogc3RyaW5nID0gXCJbQ0RQLk5hdGl2ZUJyaWRnZS5HYXRlXSBcIjtcclxuXHJcbiAgICAvLyBQbHVnaW4gcmF3IFJlc3VsdCBjb2RlXHJcblxyXG4gICAgZXhwb3J0IGxldCBTVUNDRVNTX09LOiBudW1iZXI7ICAgICAgICAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiU1VDQ0VTU19PS1wiKTtcclxuICAgIGV4cG9ydCBsZXQgU1VDQ0VTU19QUk9HUkVTUzogbnVtYmVyOyAgICAgICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIlNVQ0NFU1NfUFJPR1JFU1NcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX0ZBSUw6IG51bWJlcjsgICAgICAgICAgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9GQUlMXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9DQU5DRUw6IG51bWJlcjsgICAgICAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfQ0FOQ0VMXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9JTlZBTElEX0FSRzogbnVtYmVyOyAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfSU5WQUxJRF9BUkdcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX05PVF9JTVBMRU1FTlQ6IG51bWJlcjsgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9OT1RfSU1QTEVNRU5UXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9OT1RfU1VQUE9SVDogbnVtYmVyOyAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfTk9UX1NVUFBPUlRcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX0lOVkFMSURfT1BFUkFUSU9OOiBudW1iZXI7IFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9JTlZBTElEX09QRVJBVElPTlwiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfQ0xBU1NfTk9UX0ZPVU5EOiBudW1iZXI7ICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX0NMQVNTX05PVF9GT1VORFwiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfTUVUSE9EX05PVF9GT1VORDogbnVtYmVyOyAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX01FVEhPRF9OT1RfRk9VTkRcIik7XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnZlcnRFcnJvckluZm8ocmVzdWx0OiBJUmVzdWx0IHwgQ0RQLlBsdWdpbi5OYXRpdmVCcmlkZ2UuSVJlc3VsdCk6IEVycm9ySW5mbyB7XHJcbiAgICAgICAgbGV0IHJlc3VsdENvZGU6IG51bWJlcjtcclxuICAgICAgICBzd2l0Y2ggKHJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgRVJST1JfQ0FOQ0VMOlxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRVJST1JfSU5WQUxJRF9BUkc6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9JTlZBTElEX0FSRztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEVSUk9SX05PVF9JTVBMRU1FTlQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9OT1RfSU1QTEVNRU5UO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgRVJST1JfTk9UX1NVUFBPUlQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9OT1RfU1VQUE9SVDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEVSUk9SX0lOVkFMSURfT1BFUkFUSU9OOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q29kZSA9IFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfSU5WQUxJRF9PUEVSQVRJT047XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBFUlJPUl9DTEFTU19OT1RfRk9VTkQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRVJST1JfQ0RQX05BVElWRUJSSURHRV9DTEFTU19OT1RfRk9VTkQ7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBFUlJPUl9NRVRIT0RfTk9UX0ZPVU5EOlxyXG4gICAgICAgICAgICAgICAgcmVzdWx0Q29kZSA9IFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9OQVRJVkVCUklER0VfTUVUSE9EX05PVF9GT1VORDtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIEVSUk9SX0ZBSUw6XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXN1bHRDb2RlID0gUkVTVUxUX0NPREUuRkFJTEVEO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChFUlJPUl9DQU5DRUwgPT09IHJlc3VsdC5jb2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlQ2FuY2VsZWRFcnJvckluZm8oVEFHLCA8SVJlc3VsdD5yZXN1bHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlRXJyb3JJbmZvKHJlc3VsdENvZGUsIFRBRywgbnVsbCwgPElSZXN1bHQ+cmVzdWx0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgYmFzZSBjbGFzcyBmb3IgTmF0aXZlQnJpZGdlIGNvbW11bmljYXRpb24uXHJcbiAgICAgKiAgICAgWW91IGNhbiBkZXJpdmUgYW55IEdhdGUgY2xhc3MgZnJvbSB0aGlzIGNsYXNzLlxyXG4gICAgICogQGphIE5hdGl2ZUJyaWRnZSDjgajpgJrkv6HjgZnjgovjg5njg7zjgrnjgq/jg6njgrlcclxuICAgICAqICAgICDjgZPjga7jgq/jg6njgrnjgYvjgonku7vmhI/jga4gR2F0ZSDjgq/jg6njgrnjgpLmtL7nlJ/jgZfjgablrp/oo4Xlj6/og71cclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZSA8YnI+XHJcbiAgICAgKlxyXG4gICAgICogYGBgdHNcclxuICAgICAqICBpbXBvcnQgeyBHYXRlIH0gZnJvbSBcImNkcC9icmlkZ2VcIjtcclxuICAgICAqXHJcbiAgICAgKiAgZXhwb3J0IGNsYXNzIFNpbXBsZUdhdGUgZXh0ZW5kcyBHYXRlIHtcclxuICAgICAqICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICogICAgICBzdXBlcih7ICAvLyBzZXQgQ0RQLk5hdGl2ZUJyaWRnZS5GZWF0dXJlIG9iamVjdCB0byBzdXBlciBjb25zdHJ1Y3Rvci4gKHJlcXVpcmVkKVxyXG4gICAgICogICAgICAgIG5hbWU6IFwiU2ltcGxlR2F0ZVwiLFxyXG4gICAgICogICAgICAgIGFuZHJvaWQ6IHtcclxuICAgICAqICAgICAgICAgIC8vIHRoZSBjbGFzcyBuYW1lIHVzZWQgYnkgcmVmbGVjdGlvbiBpbiBBbnJvaWQgSmF2YS5cclxuICAgICAqICAgICAgICAgIHBhY2thZ2VJbmZvOiBcImNvbS5zb255LmNkcC5zYW1wbGUuU2ltcGxlR2F0ZVwiLFxyXG4gICAgICogICAgICAgIH0sXHJcbiAgICAgKiAgICAgICAgaW9zOiB7XHJcbiAgICAgKiAgICAgICAgICAvLyB0aGUgY2xhc3MgbmFtZSB1c2VkIGJ5IHJlZmxlY3Rpb24gaW4gT2JqZWN0aXZlLUMuXHJcbiAgICAgKiAgICAgICAgICBwYWNrYWdlSW5mbzogXCJTTVBTaW1wbGVHYXRlXCIsXHJcbiAgICAgKiAgICAgICAgfSxcclxuICAgICAqICAgICAgfSk7XHJcbiAgICAgKiAgICB9XHJcbiAgICAgKlxyXG4gICAgICogICAgLy8gYW4gZXhhbXBsZSBkZWZpbml0aW9uIG9mIGNsaWVudCBtZXRob2QuXHJcbiAgICAgKiAgICAvLyAgYW55IHR5cGUgb2YgcHJpbWl0aXZlIC8gSlNPTiBpcyBhdmFpbGFibGUuIChjb3Jkb3ZhIGNvbXBhdGlibGUuIHZvaWQgaXMgYWxzbyBwb3NzaWJsZS4pXHJcbiAgICAgKiAgICAvLyAgZGVmYXVsdCByZXR1cm4gdmFsdWUgaXMgUHJvbWlzZSBvYmplY3QuXHJcbiAgICAgKiAgICBwdWJsaWMgY29vbE1ldGhvZChhcmcxOiBudW1iZXIsIGFyZzI6IGJvb2xlYW4sIGFyZzM6IHN0cmluZywgYXJnNDogT2JqZWN0KTogUHJvbWlzZSB7XHJcbiAgICAgKiAgICAgIC8vIGNhbGxpbmcgc3VwZXIuZXhlYygpLlxyXG4gICAgICogICAgICAvLyB0aGUgZmlyc3QgYXJndW1lbnQgaXMgbWV0aG9kIG5hbWUgc2V0IGJ5IHN0cmluZy5cclxuICAgICAqICAgICAgLy8gdGhlIHNlY29uZCBhcmd1bWVudCBpcyBcImFyZ3VtZW50c1wiIHNldCBhdmFpbGFibGUuICg8YW55PiBjYXN0IHJlcXVpcmVkKVxyXG4gICAgICogICAgICAvL1xyXG4gICAgICogICAgICAvLyAhISBOb3RlICEhXHJcbiAgICAgKiAgICAgIC8vIFdoZW4gbnVsbC91bmRlZmluZWQgcGFzc2VzIHRvIGFyZ3VtZW50cyxcclxuICAgICAqICAgICAgLy8geW91IG11c3QgdG8gc2V0IGRlZmF1bHQgdmFsdWUgdG8gdGhlIGFyZ3VtZW50IGluIHRoaXMgbGF5ZXIuXHJcbiAgICAgKiAgICAgIHJldHVybiBzdXBlci5leGVjKFwiY29vbE1ldGhvZFwiLCA8YW55PmFyZ3VtZW50cyk7XHJcbiAgICAgKiAgICB9XHJcbiAgICAgKiAgfVxyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBHYXRlIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfYnJpZGdlOiBQbHVnaW4uTmF0aXZlQnJpZGdlO1xyXG4gICAgICAgIHByaXZhdGUgX29wdGlvbnM6IENvbnN0cnVjdE9wdGlvbnM7XHJcblxyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSAqL1xyXG4gICAgICAgIC8vIEZvciBwdXJlIGphdmFzY3JpcHQgZXh0ZW5kIGhlbHBlci5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBleHRlbmQgPSBVdGlscy5leHRlbmQ7XHJcbiAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHBhcmFtIGZlYXR1cmVcclxuICAgICAgICAgKiAgLSBgZW5gIGZlYXR1cmUgaW5mb3JtYXRpb24uXHJcbiAgICAgICAgICogIC0gYGphYCDliJ3mnJ/ljJbmg4XloLHjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9uc1xyXG4gICAgICAgICAqICAtIGBlbmAgY29uc3RydWN0aW9uIG9wdGlvbnMuXHJcbiAgICAgICAgICogIC0gYGphYCDjgqrjg5fjgrfjg6fjg7PjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihmZWF0dXJlOiBGZWF0dXJlLCBvcHRpb25zPzogQ29uc3RydWN0T3B0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLl9vcHRpb25zID0gJC5leHRlbmQoe1xyXG4gICAgICAgICAgICAgICAgdXNlUmF3UGx1Z2luUmVzdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIFV0aWxzLndhaXRGb3JQbHVnaW5SZWFkeSgpXHJcbiAgICAgICAgICAgICAgICAuZG9uZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnJpZGdlID0gbmV3IFBsdWdpbi5OYXRpdmVCcmlkZ2UoZmVhdHVyZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIG92ZXJyaWRlIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGVuIEV4ZWN1dGUgdGFzay5cclxuICAgICAgICAgKiAgICAgdGhlIGZ1bmN0aW9uIGNhbGxzIHRoZSBOYXRpdmUgY2xhc3MgbWV0aG9kIGZyb20gY29ycmVzcG9uZGVudCBtZXRob2QgbmFtZS5cclxuICAgICAgICAgKiBAamEg44K/44K544Kv44Gu5a6f6KGMXHJcbiAgICAgICAgICogICAgIOaMh+WumuOBl+OBnyBtZXRob2Qg5ZCN44Gr5a++5b+c44GZ44KLIE5hdGl2ZSBDbGFzcyDjga4gbWV0aG9kIOOCkuWRvOOBs+WHuuOBmeOAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZFxyXG4gICAgICAgICAqICAtIGBlbmAgbWV0aG9kIG5hbWUgb2YgTmF0aXZlIGNsYXNzXHJcbiAgICAgICAgICogIC0gYGphYCBOYXRpdmUgQ2xhc3Mg44Gu44Oh44K944OD44OJ5ZCN44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIGFyZ3NcclxuICAgICAgICAgKiAgLSBgZW5gIHNldCBhcmd1bWVudHMgYnkgYXJyYXkgdHlwZS5cclxuICAgICAgICAgKiAgLSBgamFgIOW8leaVsOOCkumFjeWIl+OBp+aMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zXHJcbiAgICAgICAgICogIC0gYGVuYCBzZXQgZXhlYyBvcHRpb25zLlxyXG4gICAgICAgICAqICAtIGBqYWAg5a6f6KGM44Kq44OX44K344On44Oz44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnNcclxuICAgICAgICAgKiAgLSBgZW5gIFByb21pc2Ugb2JqZWN0LlxyXG4gICAgICAgICAqICAtIGBqYWAgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgZXhlYyhtZXRob2Q6IHN0cmluZywgYXJncz86IGFueVtdLCBvcHRpb25zPzogRXhlY09wdGlvbnMpOiBJUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICAgICAgY29uc3QgZGYgPSAkLkRlZmVycmVkKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdCA9ICQuZXh0ZW5kKHt9LCB0aGlzLl9vcHRpb25zLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IFV0aWxzLm1ha2VQcm9taXNlKGRmLCBvcHQudXNlUmF3UGx1Z2luUmVzdWx0KTtcclxuXHJcbiAgICAgICAgICAgIFV0aWxzLndhaXRGb3JQbHVnaW5SZWFkeSgpXHJcbiAgICAgICAgICAgICAgICAuZG9uZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFza0lkID0gdGhpcy5fYnJpZGdlLmV4ZWMoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQ6IElSZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChTVUNDRVNTX1BST0dSRVNTID09PSByZXN1bHQuY29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3B0LnVzZVJhd1BsdWdpblJlc3VsdCAmJiBudWxsICE9IHJlc3VsdC5wYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYubm90aWZ5KC4uLlsuLi5yZXN1bHQucGFyYW1zLCByZXN1bHRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5ub3RpZnkocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghb3B0LnVzZVJhd1BsdWdpblJlc3VsdCAmJiBudWxsICE9IHJlc3VsdC5wYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVzb2x2ZSguLi5bLi4ucmVzdWx0LnBhcmFtcywgcmVzdWx0XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGVycm9yOiBJUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnVzZVJhd1BsdWdpblJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChjb252ZXJ0RXJyb3JJbmZvKGVycm9yKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZCwgYXJncywgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldCBpbnRlcm5hbCBwcm9wZXJ0aWVzLlxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnByb21pc2UpLl9icmlkZ2UgPSB0aGlzLl9icmlkZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+cHJvbWlzZSkuX3Rhc2tJZCA9IHRhc2tJZDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBDYW5jZWwgYWxsIHRhc2tzLlxyXG4gICAgICAgICAqIEBqYSDjgZnjgbnjgabjga7jgr/jgrnjgq/jga7jgq3jg6Pjg7Pjgrvjg6tcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zXHJcbiAgICAgICAgICogIC0gYGVuYCBzZXQgZXhlY3V0ZSBvcHRpb25zLlxyXG4gICAgICAgICAqICAtIGBqYWAg5a6f6KGM44Kq44OX44K344On44Oz44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnNcclxuICAgICAgICAgKiAgLSBgZW5gIFByb21pc2Ugb2JqZWN0LlxyXG4gICAgICAgICAqICAtIGBqYWAgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgY2FuY2VsKG9wdGlvbnM/OiBFeGVjT3B0aW9ucyk6IElQcm9taXNlQmFzZTxJUmVzdWx0PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZCgpO1xyXG4gICAgICAgICAgICBjb25zdCBvcHQgPSAkLmV4dGVuZCh7fSwgdGhpcy5fb3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBVdGlscy53YWl0Rm9yUGx1Z2luUmVhZHkoKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JyaWRnZS5jYW5jZWwobnVsbCwgb3B0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC51c2VSYXdQbHVnaW5SZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoY29udmVydEVycm9ySW5mbyhlcnJvcikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKHJlYXNvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZi5wcm9taXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gRGVzdHJ1Y3Rpb24gZm9yIHRoZSBpbnN0YW5jZS5cclxuICAgICAgICAgKiAgICAgcmVsZWFzZSBOYXRpdmUgY2xhc3MgcmVmZXJlbmNlLiBhZnRlciB0aGF0LCBleGVjKCkgYmVjb21lcyBpbnZhbGlkLlxyXG4gICAgICAgICAqIEBqYSDjgqTjg7Pjgrnjgr/jg7Pjgrnjga7noLTmo4RcclxuICAgICAgICAgKiAgICAgTmF0aXZlIOOBruWPgueFp+OCkuino+mZpOOBmeOCi+OAguS7pemZjeOAgWV4ZWMg44Gv54Sh5Yq544Go44Gq44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9uc1xyXG4gICAgICAgICAqICAtIGBlbmAgc2V0IGV4ZWN1dGUgb3B0aW9ucy5cclxuICAgICAgICAgKiAgLSBgamFgIOWun+ihjOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0LlxyXG4gICAgICAgICAqICAtIGBlbmAgUHJvbWlzZSBvYmplY3QuXHJcbiAgICAgICAgICogIC0gYGphYCBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBkaXNwb3NlKG9wdGlvbnM/OiBFeGVjT3B0aW9ucyk6IElQcm9taXNlQmFzZTxJUmVzdWx0PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZCgpO1xyXG4gICAgICAgICAgICBjb25zdCBvcHQgPSAkLmV4dGVuZCh7fSwgdGhpcy5fb3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBVdGlscy53YWl0Rm9yUGx1Z2luUmVhZHkoKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JyaWRnZS5kaXNwb3NlKG9wdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHQudXNlUmF3UGx1Z2luUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGNvbnZlcnRFcnJvckluZm8oZXJyb3IpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QocmVhc29uKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGYucHJvbWlzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcm90ZWN0ZWQgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gQWNjZXNzIHRvIFBsdWdpbi5OYXRpdmVCcmlkZ2Ugb2JqZWN0LlxyXG4gICAgICAgICAqICAgICBJZiB5b3Ugd2FudCB0byB1c2UgbG93IGxldmVsIGV4ZWMoKSwgeW91IGNhbiB1c2UgdGhpcyBhY2Nlc3Nvci5cclxuICAgICAgICAgKiBAamEgUGx1Z2luLk5hdGl2ZUJyaWRnZSDjgqrjg5bjgrjjgqfjgq/jg4jjgbjjga7jgqLjgq/jgrvjgrlcclxuICAgICAgICAgKiAgICAg5L2O44Os44OZ44OrIGV4ZWMoKSDjgpLkvb/nlKjjgZfjgZ/jgYTloLTlkIjjgavliKnnlKjlj6/og71cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zXHJcbiAgICAgICAgICogIC0gYGVuYCBQbHVnaW4uTmF0aXZlQnJpZGdlIGluc3RhbmNlLlxyXG4gICAgICAgICAqICAtIGBqYWAgUGx1Z2luLk5hdGl2ZUJyaWRnZSDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IGJyaWRnZSgpOiBQbHVnaW4uTmF0aXZlQnJpZGdlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JyaWRnZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19
