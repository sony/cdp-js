/*!
 * cdp.nativebridge.js 2.0.0
 *
 * Date: 2017-07-24T00:48:48.659Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(["cdp.promise"], function () { return factory(root.CDP || (root.CDP = {}), root.jQuery || root.$); }); } else { factory(root.CDP || (root.CDP = {}), root.jQuery || root.$); } }(((this || 0).self || global), function (CDP, $) { CDP.NativeBridge = CDP.NativeBridge || {};

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
                            df.reject(TAG + "'cordova-plugin-cdp-nativebridge' cordova plugin required.");
                        }
                    });
                }
                catch (error) {
                    df.reject(TAG + "cordova required.");
                }
                return df.promise();
            };
            /**
             * \~english
             * Create NativeBridge.Promise object from jQueryDeferred object.
             *
             * @param df [in] set jQueryDeferred instance.
             * @returns NativeBridge.Promise object.
             *
             * \~japanese
             * Promise オブジェクトの作成
             * jQueryDeferred オブジェクトから、NativeBridge.Promise オブジェクトを作成する
             *
             * @param df [in] jQueryDeferred instance を指定
             * @returns NativeBridge.Promise オブジェクト
             */
            Utils.makePromise = function (df) {
                return CDP.makePromise(df, {
                    _bridge: null,
                    _taskId: null,
                    abort: function (info) {
                        var _this = this;
                        var detail = $.extend({
                            code: NativeBridge.ERROR_CANCEL,
                            message: "abort",
                            name: TAG + "ERROR_CANCEL",
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
                this._options = $.extend({ receiveParams: true }, options);
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
                var promise = NativeBridge.Utils.makePromise(df);
                var opt = $.extend({}, this._options, options);
                NativeBridge.Utils.waitForPluginReady()
                    .done(function () {
                    var taskId = _this._bridge.exec(function (result) {
                        if (NativeBridge.SUCCESS_PROGRESS === result.code) {
                            if (opt.receiveParams && null != result.params) {
                                df.notify.apply(df, result.params.concat([result]));
                            }
                            else {
                                df.notify(result);
                            }
                        }
                        else {
                            if (opt.receiveParams && null != result.params) {
                                df.resolve.apply(df, result.params.concat([result]));
                            }
                            else {
                                df.resolve(result);
                            }
                        }
                    }, function (error) {
                        df.reject(error);
                    }, method, args, options);
                    // set internal properties.
                    promise._bridge = _this._bridge;
                    promise._taskId = taskId;
                })
                    .catch(function () {
                    df.reject(_this.makeFatal());
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
                NativeBridge.Utils.waitForPluginReady()
                    .done(function () {
                    _this._bridge.cancel(null, options, function (result) {
                        df.resolve(result);
                    }, function (error) {
                        df.reject(error);
                    });
                })
                    .catch(function () {
                    df.reject(_this.makeFatal());
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
                NativeBridge.Utils.waitForPluginReady()
                    .done(function () {
                    _this._bridge.dispose(options, function (result) {
                        df.resolve(result);
                    }, function (error) {
                        df.reject(error);
                    });
                })
                    .catch(function () {
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
            ///////////////////////////////////////////////////////////////////////
            // private methods
            //! Make fatal error object.
            Gate.prototype.makeFatal = function () {
                var msg = TAG + "fatal error. 'cordova-plugin-cdp-nativebridge' is not available.";
                console.error(msg);
                return {
                    code: null,
                    name: TAG + "ERROR_FATAL",
                    message: msg,
                };
            };
            /* tslint:disable:no-unused-variable */
            // For pure javascript extend helper.
            Gate.extend = NativeBridge.Utils.extend;
            return Gate;
        }());
        NativeBridge.Gate = Gate;
    })(NativeBridge = CDP.NativeBridge || (CDP.NativeBridge = {}));
})(CDP || (CDP = {}));

return CDP.NativeBridge; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvTmF0aXZlQnJpZGdlL0ludGVyZmFjZXMudHMiLCJjZHA6Ly8vQ0RQL05hdGl2ZUJyaWRnZS9VdGlscy50cyIsImNkcDovLy9DRFAvTmF0aXZlQnJpZGdlL0dhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWtFO0FDQWxFLElBQVUsR0FBRyxDQThLWjtBQTlLRCxXQUFVLEdBQUc7SUFBQyxnQkFBWSxDQThLekI7SUE5S2EsdUJBQVk7UUFLdEIsSUFBTSxHQUFHLEdBQUcsMkJBQTJCLENBQUM7UUFFeEM7Ozs7Ozs7O1dBUUc7UUFDSDtZQUFBO1lBNkpBLENBQUM7WUF6SkcsdUVBQXVFO1lBQ3ZFLHdCQUF3QjtZQUV4Qjs7Ozs7Ozs7OztlQVVHO1lBQ1csc0JBQWdCLEdBQTlCLFVBQStCLFNBQWlCO2dCQUM1QyxNQUFNLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUU7b0JBQzNDLEdBQUcsRUFBRTt3QkFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzs0QkFDdEIsTUFBTSxDQUFDLFVBQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQzFDLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDaEIsQ0FBQztvQkFDTCxDQUFDO29CQUNELFVBQVUsRUFBRSxJQUFJO29CQUNoQixZQUFZLEVBQUUsSUFBSTtpQkFDckIsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUVEOzs7Ozs7ZUFNRztZQUNXLHdCQUFrQixHQUFoQztnQkFDSSxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFRLENBQUM7Z0JBRTlCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUN4QyxD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QUM7Z0JBQ25CLE1BQU0sQ0FBQztvQkFDSCxJQUFJLEVBQUUsSUFBSTtvQkFDVixJQUFJLEVBQUUsR0FBRyxHQUFHLGFBQWE7b0JBQ3pCLE9BQU8sRUFBRSxHQUFHO2lCQUNmLENBQUM7WUFDTixDQUFDO1lBN0xELHVDQUF1QztZQUN2QyxxQ0FBcUM7WUFDdEIsV0FBTSxHQUFHLGtCQUFLLENBQUMsTUFBTSxDQUFDO1lBNEx6QyxXQUFDO1NBQUE7UUFuTVksaUJBQUksT0FtTWhCO0lBQ0wsQ0FBQyxFQXJPYSxZQUFZLEdBQVosZ0JBQVksS0FBWixnQkFBWSxRQXFPekI7QUFBRCxDQUFDLEVBck9TLEdBQUcsS0FBSCxHQUFHLFFBcU9aIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL0B0eXBlcy9jZHAucGx1Z2luLm5hdGl2ZWJyaWRnZS5kLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBDRFAuTmF0aXZlQnJpZGdlIHtcclxuXHJcbiAgICBpbXBvcnQgUGx1Z2luICAgPSBDRFAuUGx1Z2luLk5hdGl2ZUJyaWRnZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBpbnRlcmZhY2UgRmVhdHVyZVxyXG4gICAgICogQGJyaWVmIGZlYXR1cmUgaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIEBpbnRlcmZhY2UgRmVhdHVyZVxyXG4gICAgICogQGJyaWVmIOapn+iDveaDheWgsVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEZlYXR1cmUgZXh0ZW5kcyBQbHVnaW4uRmVhdHVyZSB7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBpbnRlcmZhY2UgQ29uc3RydWN0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIE5hdGl2ZUJyaWRnZSBjbGFzcydzIGNvbnNydHJ1Y3Rpb24gb3B0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGludGVyZmFjZSBDb25zdHJ1Y3RPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYg5Yid5pyf5YyW44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ29uc3RydWN0T3B0aW9ucyBleHRlbmRzIFBsdWdpbi5Db25zdHJ1Y3RPcHRpb25zIHtcclxuICAgICAgICByZWNlaXZlUGFyYW1zPzogYm9vbGVhbjsgLy8gZXhlYyDmiJDlip/mmYLjgassIC4uLnBhcmFtcywgSVJlc3VsdCDjgafov5TljbTjgZnjgovloLTlkIggdHJ1ZSAo5pei5a6a5YCkKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogQGludGVyZmFjZSBJUmVzdWx0XHJcbiAgICAgKiBAYnJpZWYgTmF0aXZlQnJpZGdlIGJhc2UgcmVzdWx0IGluZm9ybWF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBAaW50ZXJmYWNlIElSZXN1bHRcclxuICAgICAqIEBicmllZiBOYXRpdmVCcmlkZ2Ug44Gu5Z+65bqVIFJlc3VsdCDmg4XloLFcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUmVzdWx0IGV4dGVuZHMgUGx1Z2luLklSZXN1bHQgeyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBAaW50ZXJmYWNlIEV4ZWNPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgZXhlYygpIG1ldGhvZCBvcHRpb25zLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBAaW50ZXJmYWNlIEV4ZWNPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgZXhlYygpIOOBq+a4oeOBmeOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEV4ZWNPcHRpb25zIGV4dGVuZHMgUGx1Z2luLkV4ZWNPcHRpb25zIHtcclxuICAgICAgICByZWNlaXZlUGFyYW1zPzogYm9vbGVhbjsgLy8gZXhlYyDmiJDlip/mmYLjgassIC4uLnBhcmFtcywgSVJlc3VsdCDjgafov5TljbTjgZnjgovloLTlkIggdHJ1ZVxyXG4gICAgfVxyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcImNkcC5uYXRpdmVicmlkZ2VcIiB7XHJcbiAgICBjb25zdCBOYXRpdmVCcmlkZ2U6IHR5cGVvZiBDRFAuTmF0aXZlQnJpZGdlO1xyXG4gICAgZXhwb3J0ID0gTmF0aXZlQnJpZGdlO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuTmF0aXZlQnJpZGdlIHtcclxuXHJcbiAgICBpbXBvcnQgSVByb21pc2VCYXNlID0gQ0RQLklQcm9taXNlQmFzZTtcclxuICAgIGltcG9ydCBJUHJvbWlzZSAgICAgPSBDRFAuSVByb21pc2U7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLk5hdGl2ZUJyaWRnZS5VdGlsc10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBAY2xhc3MgVXRpbHNcclxuICAgICAqIEBicmllZiBUaGUgdXRpbGl0eSBjbGFzcyBmb3IgQ0RQLk5hdGl2ZUJyaWRnZS5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGNsYXNzIFV0aWxzXHJcbiAgICAgKiBAYnJpZWYgQ0RQLk5hdGl2ZUJyaWRnZSDjgYzkvb/nlKjjgZnjgovjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFV0aWxzIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19wbHVnaW5SZWFkeSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgICAgICogRGVmaW5lcyBlcnJvciBjb2RlIG1hcCBmcm9tIHRoZSBwbHVnaW4gcmVzdWx0IHRvIENEUC5OYXRpdmVCcmlkZ2UgcmVzdWx0IGNvZGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXJyb3JDb2RlIFtpbl0gc2V0IHJlc3VsdCBjb2RlIHN0cmluZy4gZXgpOiBcIlNVQ0NFU1NfT0tcIlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiBwbHVnaW4g44GuIFJlc3VsdCBDb2RlIOOCkiBDRFAuTmF0aXZlQnJpZGdlIOOBq+ODnuODg+ODl+OBmeOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGVycm9yQ29kZSBbaW5dIFJlc3VsdCBDb2RlIOaWh+Wtl+WIl+OCkuaMh+WumiBleCk6IFwiU1VDQ0VTU19PS1wiXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkZWZpbmVSZXN1bHRDb2RlKGVycm9yQ29kZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYXRpdmVCcmlkZ2UsIGVycm9yQ29kZSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFV0aWxzLnNfcGx1Z2luUmVhZHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFBsdWdpbi5OYXRpdmVCcmlkZ2VbZXJyb3JDb2RlXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBXYWl0IGZvciBjb3Jkb3ZhIFwiZGV2aWNlcmVhZHlcIiBldmVudCBmaXJlZC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICogY29yZG92YSDjgYwg5L2/55So5Y+v6IO944Gr44Gq44KL44G+44Gn5b6F5qmfXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB3YWl0Rm9yUGx1Z2luUmVhZHkoKTogSVByb21pc2VCYXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgY29uc3QgZGYgPSAkLkRlZmVycmVkPHZvaWQ+KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoVXRpbHMuc19wbHVnaW5SZWFkeSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQuRGVmZXJyZWQ8dm9pZD4oKS5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFubmVsID0gY29yZG92YS5yZXF1aXJlKFwiY29yZG92YS9jaGFubmVsXCIpO1xyXG4gICAgICAgICAgICAgICAgY2hhbm5lbC5vbkNvcmRvdmFSZWFkeS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChudWxsICE9IENEUC5QbHVnaW4uTmF0aXZlQnJpZGdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFV0aWxzLnNfcGx1Z2luUmVhZHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZi5yZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KFRBRyArIFwiJ2NvcmRvdmEtcGx1Z2luLWNkcC1uYXRpdmVicmlkZ2UnIGNvcmRvdmEgcGx1Z2luIHJlcXVpcmVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGRmLnJlamVjdChUQUcgKyBcImNvcmRvdmEgcmVxdWlyZWQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGYucHJvbWlzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIENyZWF0ZSBOYXRpdmVCcmlkZ2UuUHJvbWlzZSBvYmplY3QgZnJvbSBqUXVlcnlEZWZlcnJlZCBvYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGYgW2luXSBzZXQgalF1ZXJ5RGVmZXJyZWQgaW5zdGFuY2UuXHJcbiAgICAgICAgICogQHJldHVybnMgTmF0aXZlQnJpZGdlLlByb21pc2Ugb2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOBruS9nOaIkFxyXG4gICAgICAgICAqIGpRdWVyeURlZmVycmVkIOOCquODluOCuOOCp+OCr+ODiOOBi+OCieOAgU5hdGl2ZUJyaWRnZS5Qcm9taXNlIOOCquODluOCuOOCp+OCr+ODiOOCkuS9nOaIkOOBmeOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRmIFtpbl0galF1ZXJ5RGVmZXJyZWQgaW5zdGFuY2Ug44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnMgTmF0aXZlQnJpZGdlLlByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBtYWtlUHJvbWlzZShkZjogSlF1ZXJ5RGVmZXJyZWQ8SVJlc3VsdD4pOiBJUHJvbWlzZTxJUmVzdWx0PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBDRFAubWFrZVByb21pc2UoZGYsIHtcclxuICAgICAgICAgICAgICAgIF9icmlkZ2U6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBfdGFza0lkOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgYWJvcnQ6IGZ1bmN0aW9uIChpbmZvPzogYW55KTogdm9pZCB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGV0YWlsID0gJC5leHRlbmQoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBOYXRpdmVCcmlkZ2UuRVJST1JfQ0FOQ0VMLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcImFib3J0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFRBRyArIFwiRVJST1JfQ0FOQ0VMXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhc2tJZDogdGhpcy5fdGFza0lkLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sIGluZm8pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYW5jZWwgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX2JyaWRnZSAmJiBudWxsICE9IHRoaXMuX3Rhc2tJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnJpZGdlLmNhbmNlbCh0aGlzLl90YXNrSWQsIGRldGFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGRldGFpbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5kZXBlbmRlbmN5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlcGVuZGVuY3kuYWJvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVwZW5kZW5jeS5hYm9ydChkZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcIltjYWxsXSBkZXBlbmRlbmN5IG9iamVjdCBkb2Vzbid0IGhhdmUgJ2Fib3J0KCknIG1ldGhvZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2FsbFJlamVjdCAmJiBcInBlbmRpbmdcIiA9PT0gdGhpcy5zdGF0ZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJwZW5kaW5nXCIgPT09IHRoaXMuc3RhdGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYW5jZWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBjb3JyZWN0bHkgc2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sIGZvciBzdWJjbGFzc2VzLlxyXG4gICAgICAgICAqIFRoZSBmdW5jdGlvbiBiZWhhdmlvciBpcyBzYW1lIGFzIGV4dGVuZCgpIGZ1bmN0aW9uIG9mIEJhY2tib25lLmpzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHByb3RvUHJvcHMgIFtpbl0gc2V0IHByb3RvdHlwZSBwcm9wZXJ0aWVzIGFzIG9iamVjdC5cclxuICAgICAgICAgKiBAcGFyYW0gc3RhdGljUHJvcHMgW2luXSBzZXQgc3RhdGljIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICAgICAqIEByZXR1cm5zIHN1YmNsYXNzIGNvbnN0cnVjdG9yLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiDjgq/jg6njgrnntpnmib/jga7jgZ/jgoHjga7jg5jjg6vjg5Hjg7zplqLmlbBcclxuICAgICAgICAgKiBCYWNrYm9uZS5qcyBleHRlbmQoKSDplqLmlbDjgajlkIznrYlcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBwcm90b1Byb3BzICBbaW5dIHByb3RvdHlwZSBwcm9wZXJ0aWVzIOOCkuOCquODluOCuOOCp+OCr+ODiOOBp+aMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0aWNQcm9wcyBbaW5dIHN0YXRpYyBwcm9wZXJ0aWVzIOOCkuOCquODluOCuOOCp+OCr+ODiOOBp+aMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIOOCteODluOCr+ODqeOCueOBruOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZXh0ZW5kKHByb3RvUHJvcHM6IG9iamVjdCwgc3RhdGljUHJvcHM/OiBvYmplY3QpOiBvYmplY3Qge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgICAgICBsZXQgY2hpbGQ7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJvdG9Qcm9wcyAmJiBwcm90b1Byb3BzLmhhc093blByb3BlcnR5KFwiY29uc3RydWN0b3JcIikpIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNoaWxkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQuZXh0ZW5kKGNoaWxkLCBwYXJlbnQsIHN0YXRpY1Byb3BzKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IFN1cnJvZ2F0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgU3Vycm9nYXRlLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XHJcbiAgICAgICAgICAgIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBTdXJyb2dhdGU7XHJcblxyXG4gICAgICAgICAgICBpZiAocHJvdG9Qcm9wcykge1xyXG4gICAgICAgICAgICAgICAgJC5leHRlbmQoY2hpbGQucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBjaGlsZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5OYXRpdmVCcmlkZ2Uge1xyXG5cclxuICAgIGltcG9ydCBJUHJvbWlzZSAgICAgPSBDRFAuSVByb21pc2U7XHJcbiAgICBpbXBvcnQgSVByb21pc2VCYXNlID0gQ0RQLklQcm9taXNlQmFzZTtcclxuXHJcbiAgICBjb25zdCBUQUc6IHN0cmluZyA9IFwiW0NEUC5OYXRpdmVCcmlkZ2UuR2F0ZV0gXCI7XHJcblxyXG4gICAgLy8gUmVzdWx0IGNvZGVcclxuXHJcbiAgICBleHBvcnQgbGV0IFNVQ0NFU1NfT0s6IG51bWJlcjsgICAgICAgICAgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJTVUNDRVNTX09LXCIpO1xyXG4gICAgZXhwb3J0IGxldCBTVUNDRVNTX1BST0dSRVNTOiBudW1iZXI7ICAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiU1VDQ0VTU19QUk9HUkVTU1wiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfRkFJTDogbnVtYmVyOyAgICAgICAgICAgICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX0ZBSUxcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX0NBTkNFTDogbnVtYmVyOyAgICAgICAgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9DQU5DRUxcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX0lOVkFMSURfQVJHOiBudW1iZXI7ICAgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9JTlZBTElEX0FSR1wiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfTk9UX0lNUExFTUVOVDogbnVtYmVyOyAgICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX05PVF9JTVBMRU1FTlRcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX05PVF9TVVBQT1JUOiBudW1iZXI7ICAgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9OT1RfU1VQUE9SVFwiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfSU5WQUxJRF9PUEVSQVRJT046IG51bWJlcjsgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX0lOVkFMSURfT1BFUkFUSU9OXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9DTEFTU19OT1RfRk9VTkQ6IG51bWJlcjsgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfQ0xBU1NfTk9UX0ZPVU5EXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9NRVRIT0RfTk9UX0ZPVU5EOiBudW1iZXI7ICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfTUVUSE9EX05PVF9GT1VORFwiKTtcclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogQGNsYXNzIEdhdGVcclxuICAgICAqIEBicmllZiBUaGUgYmFzZSBjbGFzcyBmb3IgTmF0aXZlQnJpZGdlIGNvbW11bmljYXRpb24uXHJcbiAgICAgKiAgICAgICAgWW91IGNhbiBkZXJpdmUgYW55IEdhdGUgY2xhc3MgZnJvbSB0aGlzIGNsYXNzLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBAY2xhc3MgR2F0ZVxyXG4gICAgICogQGJyaWVmIE5hdGl2ZUJyaWRnZSDjgajpgJrkv6HjgZnjgovjg5njg7zjgrnjgq/jg6njgrlcclxuICAgICAqICAgICAgICDjgZPjga7jgq/jg6njgrnjgYvjgonku7vmhI/jga4gR2F0ZSDjgq/jg6njgrnjgpLmtL7nlJ/jgZfjgablrp/oo4Xlj6/og71cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEdhdGUge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9icmlkZ2U6IFBsdWdpbi5OYXRpdmVCcmlkZ2U7XHJcbiAgICAgICAgcHJpdmF0ZSBfb3B0aW9uczogQ29uc3RydWN0T3B0aW9ucztcclxuXHJcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLXZhcmlhYmxlICovXHJcbiAgICAgICAgLy8gRm9yIHB1cmUgamF2YXNjcmlwdCBleHRlbmQgaGVscGVyLlxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGV4dGVuZCA9IFV0aWxzLmV4dGVuZDtcclxuICAgICAgICAvKiB0c2xpbnQ6ZW5hYmxlOm5vLXVudXNlZC12YXJpYWJsZSAqL1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBmZWF0dXJlIFtpbl0gZmVhdHVyZSBpbmZvcm1hdGlvbi5cclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIGNvbnN0cnVjdGlvbiBvcHRpb25zLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGZlYXR1cmUgW2luXSDliJ3mnJ/ljJbmg4XloLHjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGZlYXR1cmU6IEZlYXR1cmUsIG9wdGlvbnM/OiBDb25zdHJ1Y3RPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29wdGlvbnMgPSAkLmV4dGVuZCh7IHJlY2VpdmVQYXJhbXM6IHRydWUgfSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIFV0aWxzLndhaXRGb3JQbHVnaW5SZWFkeSgpXHJcbiAgICAgICAgICAgICAgICAuZG9uZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYnJpZGdlID0gbmV3IFBsdWdpbi5OYXRpdmVCcmlkZ2UoZmVhdHVyZSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIG92ZXJyaWRlIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIEV4ZWN1dGUgdGFzay5cclxuICAgICAgICAgKiB0aGUgZnVuY3Rpb24gY2FsbHMgdGhlIE5hdGl2ZSBjbGFzcyBtZXRob2QgZnJvbSBjb3JyZXNwb25kZW50IG1ldGhvZCBuYW1lLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZCAgW2luXSBtZXRob2QgbmFtZSBvZiBOYXRpdmUgY2xhc3NcclxuICAgICAgICAgKiBAcGFyYW0gYXJncyAgICBbaW5dIHNldCBhcmd1bWVudHMgYnkgYXJyYXkgdHlwZS5cclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIHNldCBleGVjIG9wdGlvbnMuXHJcbiAgICAgICAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIOOCv+OCueOCr+OBruWun+ihjFxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBnyBtZXRob2Qg5ZCN44Gr5a++5b+c44GZ44KLIE5hdGl2ZSBDbGFzcyDjga4gbWV0aG9kIOOCkuWRvOOBs+WHuuOBmeOAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZCAgW2luXSBOYXRpdmUgQ2xhc3Mg44Gu44Oh44K944OD44OJ5ZCN44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIGFyZ3MgICAgW2luXSDlvJXmlbDjgpLphY3liJfjgafmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIOWun+ihjOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGV4ZWMobWV0aG9kOiBzdHJpbmcsIGFyZ3M/OiBhbnlbXSwgb3B0aW9ucz86IEV4ZWNPcHRpb25zKTogSVByb21pc2U8YW55PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZCgpO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9taXNlID0gVXRpbHMubWFrZVByb21pc2UoZGYpO1xyXG4gICAgICAgICAgICBjb25zdCBvcHQgPSAkLmV4dGVuZCh7fSwgdGhpcy5fb3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBVdGlscy53YWl0Rm9yUGx1Z2luUmVhZHkoKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhc2tJZCA9IHRoaXMuX2JyaWRnZS5leGVjKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0OiBJUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoU1VDQ0VTU19QUk9HUkVTUyA9PT0gcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnJlY2VpdmVQYXJhbXMgJiYgbnVsbCAhPSByZXN1bHQucGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLm5vdGlmeSguLi5bLi4ucmVzdWx0LnBhcmFtcywgcmVzdWx0XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYubm90aWZ5KHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnJlY2VpdmVQYXJhbXMgJiYgbnVsbCAhPSByZXN1bHQucGFyYW1zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUoLi4uWy4uLnJlc3VsdC5wYXJhbXMsIHJlc3VsdF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChlcnJvcjogSVJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kLCBhcmdzLCBvcHRpb25zXHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IGludGVybmFsIHByb3BlcnRpZXMuXHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+cHJvbWlzZSkuX2JyaWRnZSA9IHRoaXMuX2JyaWRnZTtcclxuICAgICAgICAgICAgICAgICAgICAoPGFueT5wcm9taXNlKS5fdGFza0lkID0gdGFza0lkO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KHRoaXMubWFrZUZhdGFsKCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBDYW5jZWwgYWxsIHRhc2tzLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSBzZXQgZXhlY3V0ZSBvcHRpb25zLlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiDjgZnjgbnjgabjga7jgr/jgrnjgq/jga7jgq3jg6Pjg7Pjgrvjg6tcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIFtpbl0g5a6f6KGM44Kq44OX44K344On44Oz44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnMgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgY2FuY2VsKG9wdGlvbnM/OiBFeGVjT3B0aW9ucyk6IElQcm9taXNlQmFzZTxJUmVzdWx0PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZCgpO1xyXG4gICAgICAgICAgICBVdGlscy53YWl0Rm9yUGx1Z2luUmVhZHkoKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JyaWRnZS5jYW5jZWwobnVsbCwgb3B0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KHRoaXMubWFrZUZhdGFsKCkpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBkZi5wcm9taXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgICAgICogRGVzdHJ1Y3Rpb24gZm9yIHRoZSBpbnN0YW5jZS5cclxuICAgICAgICAgKiByZWxlYXNlIE5hdGl2ZSBjbGFzcyByZWZlcmVuY2UuIGFmdGVyIHRoYXQsIGV4ZWMoKSBiZWNvbWVzIGludmFsaWQuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIHNldCBleGVjdXRlIG9wdGlvbnMuXHJcbiAgICAgICAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIOOCpOODs+OCueOCv+ODs+OCueOBruegtOajhFxyXG4gICAgICAgICAqIE5hdGl2ZSDjga7lj4LnhafjgpLop6PpmaTjgZnjgovjgILku6XpmY3jgIFleGVjIOOBr+eEoeWKueOBqOOBquOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSDlrp/ooYzjgqrjg5fjgrfjg6fjg7PjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJucyBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBkaXNwb3NlKG9wdGlvbnM/OiBFeGVjT3B0aW9ucyk6IElQcm9taXNlQmFzZTxJUmVzdWx0PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZCgpO1xyXG4gICAgICAgICAgICBVdGlscy53YWl0Rm9yUGx1Z2luUmVhZHkoKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JyaWRnZS5kaXNwb3NlKG9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdCh0aGlzLm1ha2VGYXRhbCgpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGYucHJvbWlzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcm90ZWN0ZWQgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgICAgICogQWNjZXNzIHRvIFBsdWdpbi5OYXRpdmVCcmlkZ2Ugb2JqZWN0LlxyXG4gICAgICAgICAqIElmIHlvdSB3YW50IHRvIHVzZSBsb3cgbGV2ZWwgZXhlYygpLCB5b3UgY2FuIHVzZSB0aGlzIGFjY2Vzc29yLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMgUGx1Z2luLk5hdGl2ZUJyaWRnZSBpbnN0YW5jZS5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICogUGx1Z2luLk5hdGl2ZUJyaWRnZSDjgqrjg5bjgrjjgqfjgq/jg4jjgbjjga7jgqLjgq/jgrvjgrlcclxuICAgICAgICAgKiDkvY7jg6zjg5njg6sgZXhlYygpIOOCkuS9v+eUqOOBl+OBn+OBhOWgtOWQiOOBq+WIqeeUqOWPr+iDvVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybnMgUGx1Z2luLk5hdGl2ZUJyaWRnZSDjgqTjg7Pjgrnjgr/jg7PjgrkuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJvdGVjdGVkIGdldCBicmlkZ2UoKTogUGx1Z2luLk5hdGl2ZUJyaWRnZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9icmlkZ2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEgTWFrZSBmYXRhbCBlcnJvciBvYmplY3QuXHJcbiAgICAgICAgcHJpdmF0ZSBtYWtlRmF0YWwoKTogSVJlc3VsdCB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1zZyA9IFRBRyArIFwiZmF0YWwgZXJyb3IuICdjb3Jkb3ZhLXBsdWdpbi1jZHAtbmF0aXZlYnJpZGdlJyBpcyBub3QgYXZhaWxhYmxlLlwiO1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogVEFHICsgXCJFUlJPUl9GQVRBTFwiLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbXNnLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=