/*!
 * cdp.nativebridge.js 2.0.0
 *
 * Date: 2017-07-14T09:37:22.242Z
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
                NativeBridge.Utils.waitForPluginReady()
                    .then(function () {
                    _this._bridge = new CDP.Plugin.NativeBridge(feature, options);
                    _this._options = $.extend({ receiveParams: true }, options);
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
                    .then(function () {
                    var taskId = _this._bridge.exec(function (result) {
                        if (NativeBridge.SUCCESS_PROGRESS === result.code) {
                            if (opt.receiveParams) {
                                df.notify.apply(df, result.params.concat([result]));
                            }
                            else {
                                df.notify(result);
                            }
                        }
                        else {
                            if (opt.receiveParams) {
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
                    .then(function () {
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
                    .then(function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvTmF0aXZlQnJpZGdlL0ludGVyZmFjZXMudHMiLCJjZHA6Ly8vQ0RQL05hdGl2ZUJyaWRnZS9VdGlscy50cyIsImNkcDovLy9DRFAvTmF0aXZlQnJpZGdlL0dhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQWtFO0FDQWxFLElBQVUsR0FBRyxDQTZLWjtBQTdLRCxXQUFVLEdBQUc7SUFBQyxnQkFBWSxDQTZLekI7SUE3S2EsdUJBQVk7UUFJdEIsSUFBTSxHQUFHLEdBQUcsMkJBQTJCLENBQUM7UUFFeEM7Ozs7Ozs7O1dBUUc7UUFDSDtZQUFBO1lBNkpBLENBQUM7WUF6SkcsdUVBQXVFO1lBQ3ZFLHdCQUF3QjtZQUV4Qjs7Ozs7Ozs7OztlQVVHO1lBQ1csc0JBQWdCLEdBQTlCLFVBQStCLFNBQWlCO2dCQUM1QyxNQUFNLENBQUMsY0FBYyxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUU7b0JBQzNDLEdBQUcsRUFBRTt3QkFDRCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzs0QkFDdEIsTUFBTSxDQUFDLFVBQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUM7d0JBQzFDLENBQUM7d0JBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ0osTUFBTSxDQUFDLElBQUksQ0FBQzt3QkFDaEIsQ0FBQztvQkFDTCxDQUFDO29CQUNELFVBQVUsRUFBRSxJQUFJO29CQUNoQixZQUFZLEVBQUUsSUFBSTtpQkFDckIsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztZQUVEOzs7Ozs7ZUFNRztZQUNXLHdCQUFrQixHQUFoQztnQkFDSSxJQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFRLENBQUM7Z0JBRTlCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUN0QixNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUN4QyxD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RyxHQUFHLGFBQWE7b0JBQ3pCLE9BQU8sRUFBRSxHQUFHO2lCQUNmLENBQUM7WUFDTixDQUFDO1lBN0xELHVDQUF1QztZQUN2QyxxQ0FBcUM7WUFDdEIsV0FBTSxHQUFHLGtCQUFLLENBQUMsTUFBTSxDQUFDO1lBNEx6QyxXQUFDO1NBQUE7UUFuTVksaUJBQUksT0FtTWhCO0lBQ0wsQ0FBQyxFQXJPYSxZQUFZLEdBQVosZ0JBQVksS0FBWixnQkFBWSxRQXFPekI7QUFBRCxDQUFDLEVBck9TLEdBQUcsS0FBSCxHQUFHLFFBcU9aIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uL0B0eXBlcy9jZHAucGx1Z2luLm5hdGl2ZWJyaWRnZS5kLnRzXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBDRFAuTmF0aXZlQnJpZGdlIHtcclxuXHJcbiAgICBpbXBvcnQgUGx1Z2luICAgPSBDRFAuUGx1Z2luLk5hdGl2ZUJyaWRnZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBpbnRlcmZhY2UgRmVhdHVyZVxyXG4gICAgICogQGJyaWVmIGZlYXR1cmUgaW5mb3JtYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIEBpbnRlcmZhY2UgRmVhdHVyZVxyXG4gICAgICogQGJyaWVmIOapn+iDveaDheWgsVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEZlYXR1cmUgZXh0ZW5kcyBQbHVnaW4uRmVhdHVyZSB7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBpbnRlcmZhY2UgQ29uc3RydWN0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIE5hdGl2ZUJyaWRnZSBjbGFzcydzIGNvbnNydHJ1Y3Rpb24gb3B0aW9ucy5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGludGVyZmFjZSBDb25zdHJ1Y3RPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYg5Yid5pyf5YyW44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ29uc3RydWN0T3B0aW9ucyBleHRlbmRzIFBsdWdpbi5Db25zdHJ1Y3RPcHRpb25zIHtcclxuICAgICAgICByZWNlaXZlUGFyYW1zPzogYm9vbGVhbjsgLy8gZXhlYyDmiJDlip/mmYLjgassIC4uLnBhcmFtcywgSVJlc3VsdCDjgafov5TljbTjgZnjgovloLTlkIggdHJ1ZSAo5pei5a6a5YCkKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogQGludGVyZmFjZSBJUmVzdWx0XHJcbiAgICAgKiBAYnJpZWYgTmF0aXZlQnJpZGdlIGJhc2UgcmVzdWx0IGluZm9ybWF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBAaW50ZXJmYWNlIElSZXN1bHRcclxuICAgICAqIEBicmllZiBOYXRpdmVCcmlkZ2Ug44Gu5Z+65bqVIFJlc3VsdCDmg4XloLFcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUmVzdWx0IGV4dGVuZHMgUGx1Z2luLklSZXN1bHQgeyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBAaW50ZXJmYWNlIEV4ZWNPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgZXhlYygpIG1ldGhvZCBvcHRpb25zLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBAaW50ZXJmYWNlIEV4ZWNPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgZXhlYygpIOOBq+a4oeOBmeOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEV4ZWNPcHRpb25zIGV4dGVuZHMgUGx1Z2luLkV4ZWNPcHRpb25zIHtcclxuICAgICAgICByZWNlaXZlUGFyYW1zPzogYm9vbGVhbjsgLy8gZXhlYyDmiJDlip/mmYLjgassIC4uLnBhcmFtcywgSVJlc3VsdCDjgafov5TljbTjgZnjgovloLTlkIggdHJ1ZVxyXG4gICAgfVxyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcImNkcC5uYXRpdmVicmlkZ2VcIiB7XHJcbiAgICBjb25zdCBOYXRpdmVCcmlkZ2U6IHR5cGVvZiBDRFAuTmF0aXZlQnJpZGdlO1xyXG4gICAgZXhwb3J0ID0gTmF0aXZlQnJpZGdlO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuTmF0aXZlQnJpZGdlIHtcclxuXHJcbiAgICBpbXBvcnQgSVByb21pc2UgPSBDRFAuSVByb21pc2U7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLk5hdGl2ZUJyaWRnZS5VdGlsc10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBAY2xhc3MgVXRpbHNcclxuICAgICAqIEBicmllZiBUaGUgdXRpbGl0eSBjbGFzcyBmb3IgQ0RQLk5hdGl2ZUJyaWRnZS5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGNsYXNzIFV0aWxzXHJcbiAgICAgKiBAYnJpZWYgQ0RQLk5hdGl2ZUJyaWRnZSDjgYzkvb/nlKjjgZnjgovjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFV0aWxzIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19wbHVnaW5SZWFkeSA9IGZhbHNlO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgICAgICogRGVmaW5lcyBlcnJvciBjb2RlIG1hcCBmcm9tIHRoZSBwbHVnaW4gcmVzdWx0IHRvIENEUC5OYXRpdmVCcmlkZ2UgcmVzdWx0IGNvZGUuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXJyb3JDb2RlIFtpbl0gc2V0IHJlc3VsdCBjb2RlIHN0cmluZy4gZXgpOiBcIlNVQ0NFU1NfT0tcIlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiBwbHVnaW4g44GuIFJlc3VsdCBDb2RlIOOCkiBDRFAuTmF0aXZlQnJpZGdlIOOBq+ODnuODg+ODl+OBmeOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGVycm9yQ29kZSBbaW5dIFJlc3VsdCBDb2RlIOaWh+Wtl+WIl+OCkuaMh+WumiBleCk6IFwiU1VDQ0VTU19PS1wiXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkZWZpbmVSZXN1bHRDb2RlKGVycm9yQ29kZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShOYXRpdmVCcmlkZ2UsIGVycm9yQ29kZSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFV0aWxzLnNfcGx1Z2luUmVhZHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFBsdWdpbi5OYXRpdmVCcmlkZ2VbZXJyb3JDb2RlXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBXYWl0IGZvciBjb3Jkb3ZhIFwiZGV2aWNlcmVhZHlcIiBldmVudCBmaXJlZC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICogY29yZG92YSDjgYwg5L2/55So5Y+v6IO944Gr44Gq44KL44G+44Gn5b6F5qmfXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB3YWl0Rm9yUGx1Z2luUmVhZHkoKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZDx2b2lkPigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKFV0aWxzLnNfcGx1Z2luUmVhZHkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkLkRlZmVycmVkPHZvaWQ+KCkucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hhbm5lbCA9IGNvcmRvdmEucmVxdWlyZShcImNvcmRvdmEvY2hhbm5lbFwiKTtcclxuICAgICAgICAgICAgICAgIGNoYW5uZWwub25Db3Jkb3ZhUmVhZHkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSBDRFAuUGx1Z2luLk5hdGl2ZUJyaWRnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBVdGlscy5zX3BsdWdpblJlYWR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChUQUcgKyBcIidjb3Jkb3ZhLXBsdWdpbi1jZHAtbmF0aXZlYnJpZGdlJyBjb3Jkb3ZhIHBsdWdpbiByZXF1aXJlZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBkZi5yZWplY3QoVEFHICsgXCJjb3Jkb3ZhIHJlcXVpcmVkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRmLnByb21pc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBDcmVhdGUgTmF0aXZlQnJpZGdlLlByb21pc2Ugb2JqZWN0IGZyb20galF1ZXJ5RGVmZXJyZWQgb2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRmIFtpbl0gc2V0IGpRdWVyeURlZmVycmVkIGluc3RhbmNlLlxyXG4gICAgICAgICAqIEByZXR1cm5zIE5hdGl2ZUJyaWRnZS5Qcm9taXNlIG9iamVjdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICogUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jjga7kvZzmiJBcclxuICAgICAgICAgKiBqUXVlcnlEZWZlcnJlZCDjgqrjg5bjgrjjgqfjgq/jg4jjgYvjgonjgIFOYXRpdmVCcmlkZ2UuUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4jjgpLkvZzmiJDjgZnjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkZiBbaW5dIGpRdWVyeURlZmVycmVkIGluc3RhbmNlIOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIE5hdGl2ZUJyaWRnZS5Qcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbWFrZVByb21pc2UoZGY6IEpRdWVyeURlZmVycmVkPElSZXN1bHQ+KTogSVByb21pc2U8SVJlc3VsdD4ge1xyXG4gICAgICAgICAgICByZXR1cm4gQ0RQLm1ha2VQcm9taXNlKGRmLCB7XHJcbiAgICAgICAgICAgICAgICBfYnJpZGdlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgX3Rhc2tJZDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGFib3J0OiBmdW5jdGlvbiAoaW5mbz86IGFueSk6IHZvaWQge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRldGFpbCA9ICQuZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogTmF0aXZlQnJpZGdlLkVSUk9SX0NBTkNFTCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJhYm9ydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBUQUcgKyBcIkVSUk9SX0NBTkNFTFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXNrSWQ6IHRoaXMuX3Rhc2tJZCxcclxuICAgICAgICAgICAgICAgICAgICB9LCBpbmZvKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9icmlkZ2UgJiYgbnVsbCAhPSB0aGlzLl90YXNrSWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JyaWRnZS5jYW5jZWwodGhpcy5fdGFza0lkLCBkZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChkZXRhaWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuZGVwZW5kZW5jeSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXBlbmRlbmN5LmFib3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlcGVuZGVuY3kuYWJvcnQoZGV0YWlsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJbY2FsbF0gZGVwZW5kZW5jeSBvYmplY3QgZG9lc24ndCBoYXZlICdhYm9ydCgpJyBtZXRob2QuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNhbGxSZWplY3QgJiYgXCJwZW5kaW5nXCIgPT09IHRoaXMuc3RhdGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwicGVuZGluZ1wiID09PSB0aGlzLnN0YXRlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FuY2VsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gY29ycmVjdGx5IHNldCB1cCB0aGUgcHJvdG90eXBlIGNoYWluLCBmb3Igc3ViY2xhc3Nlcy5cclxuICAgICAgICAgKiBUaGUgZnVuY3Rpb24gYmVoYXZpb3IgaXMgc2FtZSBhcyBleHRlbmQoKSBmdW5jdGlvbiBvZiBCYWNrYm9uZS5qcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBwcm90b1Byb3BzICBbaW5dIHNldCBwcm90b3R5cGUgcHJvcGVydGllcyBhcyBvYmplY3QuXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXRpY1Byb3BzIFtpbl0gc2V0IHN0YXRpYyBwcm9wZXJ0aWVzIGFzIG9iamVjdC5cclxuICAgICAgICAgKiBAcmV0dXJucyBzdWJjbGFzcyBjb25zdHJ1Y3Rvci5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICog44Kv44Op44K557aZ5om/44Gu44Gf44KB44Gu44OY44Or44OR44O86Zai5pWwXHJcbiAgICAgICAgICogQmFja2JvbmUuanMgZXh0ZW5kKCkg6Zai5pWw44Go5ZCM562JXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcHJvdG9Qcm9wcyAgW2luXSBwcm90b3R5cGUgcHJvcGVydGllcyDjgpLjgqrjg5bjgrjjgqfjgq/jg4jjgafmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdGljUHJvcHMgW2luXSBzdGF0aWMgcHJvcGVydGllcyDjgpLjgqrjg5bjgrjjgqfjgq/jg4jjgafmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJucyDjgrXjg5bjgq/jg6njgrnjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGV4dGVuZChwcm90b1Byb3BzOiBPYmplY3QsIHN0YXRpY1Byb3BzPzogT2JqZWN0KTogT2JqZWN0IHtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcztcclxuICAgICAgICAgICAgbGV0IGNoaWxkO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb3RvUHJvcHMgJiYgcHJvdG9Qcm9wcy5oYXNPd25Qcm9wZXJ0eShcImNvbnN0cnVjdG9yXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkLmV4dGVuZChjaGlsZCwgcGFyZW50LCBzdGF0aWNQcm9wcyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBTdXJyb2dhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFN1cnJvZ2F0ZS5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xyXG4gICAgICAgICAgICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgU3Vycm9nYXRlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb3RvUHJvcHMpIHtcclxuICAgICAgICAgICAgICAgICQuZXh0ZW5kKGNoaWxkLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY2hpbGQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuTmF0aXZlQnJpZGdlIHtcclxuXHJcbiAgICBpbXBvcnQgSVByb21pc2UgICAgID0gQ0RQLklQcm9taXNlO1xyXG4gICAgaW1wb3J0IElQcm9taXNlQmFzZSA9IENEUC5JUHJvbWlzZUJhc2U7XHJcblxyXG4gICAgY29uc3QgVEFHOiBzdHJpbmcgPSBcIltDRFAuTmF0aXZlQnJpZGdlLkdhdGVdIFwiO1xyXG5cclxuICAgIC8vIFJlc3VsdCBjb2RlXHJcblxyXG4gICAgZXhwb3J0IGxldCBTVUNDRVNTX09LOiBudW1iZXI7ICAgICAgICAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiU1VDQ0VTU19PS1wiKTtcclxuICAgIGV4cG9ydCBsZXQgU1VDQ0VTU19QUk9HUkVTUzogbnVtYmVyOyAgICAgICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIlNVQ0NFU1NfUFJPR1JFU1NcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX0ZBSUw6IG51bWJlcjsgICAgICAgICAgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9GQUlMXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9DQU5DRUw6IG51bWJlcjsgICAgICAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfQ0FOQ0VMXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9JTlZBTElEX0FSRzogbnVtYmVyOyAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfSU5WQUxJRF9BUkdcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX05PVF9JTVBMRU1FTlQ6IG51bWJlcjsgICAgIFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9OT1RfSU1QTEVNRU5UXCIpO1xyXG4gICAgZXhwb3J0IGxldCBFUlJPUl9OT1RfU1VQUE9SVDogbnVtYmVyOyAgICAgICBVdGlscy5kZWZpbmVSZXN1bHRDb2RlKFwiRVJST1JfTk9UX1NVUFBPUlRcIik7XHJcbiAgICBleHBvcnQgbGV0IEVSUk9SX0lOVkFMSURfT1BFUkFUSU9OOiBudW1iZXI7IFV0aWxzLmRlZmluZVJlc3VsdENvZGUoXCJFUlJPUl9JTlZBTElEX09QRVJBVElPTlwiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfQ0xBU1NfTk9UX0ZPVU5EOiBudW1iZXI7ICAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX0NMQVNTX05PVF9GT1VORFwiKTtcclxuICAgIGV4cG9ydCBsZXQgRVJST1JfTUVUSE9EX05PVF9GT1VORDogbnVtYmVyOyAgVXRpbHMuZGVmaW5lUmVzdWx0Q29kZShcIkVSUk9SX01FVEhPRF9OT1RfRk9VTkRcIik7XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEBjbGFzcyBHYXRlXHJcbiAgICAgKiBAYnJpZWYgVGhlIGJhc2UgY2xhc3MgZm9yIE5hdGl2ZUJyaWRnZSBjb21tdW5pY2F0aW9uLlxyXG4gICAgICogICAgICAgIFlvdSBjYW4gZGVyaXZlIGFueSBHYXRlIGNsYXNzIGZyb20gdGhpcyBjbGFzcy5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogQGNsYXNzIEdhdGVcclxuICAgICAqIEBicmllZiBOYXRpdmVCcmlkZ2Ug44Go6YCa5L+h44GZ44KL44OZ44O844K544Kv44Op44K5XHJcbiAgICAgKiAgICAgICAg44GT44Gu44Kv44Op44K544GL44KJ5Lu75oSP44GuIEdhdGUg44Kv44Op44K544KS5rS+55Sf44GX44Gm5a6f6KOF5Y+v6IO9XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBHYXRlIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfYnJpZGdlOiBQbHVnaW4uTmF0aXZlQnJpZGdlO1xyXG4gICAgICAgIHByaXZhdGUgX29wdGlvbnM6IENvbnN0cnVjdE9wdGlvbnM7XHJcblxyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSAqL1xyXG4gICAgICAgIC8vIEZvciBwdXJlIGphdmFzY3JpcHQgZXh0ZW5kIGhlbHBlci5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBleHRlbmQgPSBVdGlscy5leHRlbmQ7XHJcbiAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZmVhdHVyZSBbaW5dIGZlYXR1cmUgaW5mb3JtYXRpb24uXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSBjb25zdHJ1Y3Rpb24gb3B0aW9ucy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBmZWF0dXJlIFtpbl0g5Yid5pyf5YyW5oOF5aCx44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSDjgqrjg5fjgrfjg6fjg7PjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihmZWF0dXJlOiBGZWF0dXJlLCBvcHRpb25zPzogQ29uc3RydWN0T3B0aW9ucykge1xyXG4gICAgICAgICAgICBVdGlscy53YWl0Rm9yUGx1Z2luUmVhZHkoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JyaWRnZSA9IG5ldyBQbHVnaW4uTmF0aXZlQnJpZGdlKGZlYXR1cmUsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX29wdGlvbnMgPSAkLmV4dGVuZCh7IHJlY2VpdmVQYXJhbXM6IHRydWUgfSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChyZWFzb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcihyZWFzb24pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIG92ZXJyaWRlIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIEV4ZWN1dGUgdGFzay5cclxuICAgICAgICAgKiB0aGUgZnVuY3Rpb24gY2FsbHMgdGhlIE5hdGl2ZSBjbGFzcyBtZXRob2QgZnJvbSBjb3JyZXNwb25kZW50IG1ldGhvZCBuYW1lLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZCAgW2luXSBtZXRob2QgbmFtZSBvZiBOYXRpdmUgY2xhc3NcclxuICAgICAgICAgKiBAcGFyYW0gYXJncyAgICBbaW5dIHNldCBhcmd1bWVudHMgYnkgYXJyYXkgdHlwZS5cclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIHNldCBleGVjIG9wdGlvbnMuXHJcbiAgICAgICAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIOOCv+OCueOCr+OBruWun+ihjFxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBnyBtZXRob2Qg5ZCN44Gr5a++5b+c44GZ44KLIE5hdGl2ZSBDbGFzcyDjga4gbWV0aG9kIOOCkuWRvOOBs+WHuuOBmeOAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG1ldGhvZCAgW2luXSBOYXRpdmUgQ2xhc3Mg44Gu44Oh44K944OD44OJ5ZCN44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIGFyZ3MgICAgW2luXSDlvJXmlbDjgpLphY3liJfjgafmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIOWun+ihjOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGV4ZWMobWV0aG9kOiBzdHJpbmcsIGFyZ3M/OiBhbnlbXSwgb3B0aW9ucz86IEV4ZWNPcHRpb25zKTogSVByb21pc2U8YW55PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRmID0gJC5EZWZlcnJlZCgpO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9taXNlID0gVXRpbHMubWFrZVByb21pc2UoZGYpO1xyXG4gICAgICAgICAgICBjb25zdCBvcHQgPSAkLmV4dGVuZCh7fSwgdGhpcy5fb3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBVdGlscy53YWl0Rm9yUGx1Z2luUmVhZHkoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhc2tJZCA9IHRoaXMuX2JyaWRnZS5leGVjKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0OiBJUmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoU1VDQ0VTU19QUk9HUkVTUyA9PT0gcmVzdWx0LmNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnJlY2VpdmVQYXJhbXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYubm90aWZ5KC4uLlsuLi5yZXN1bHQucGFyYW1zLCByZXN1bHRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5ub3RpZnkocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvcHQucmVjZWl2ZVBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZXNvbHZlKC4uLlsuLi5yZXN1bHQucGFyYW1zLCByZXN1bHRdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoZXJyb3I6IElSZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZCwgYXJncywgb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldCBpbnRlcm5hbCBwcm9wZXJ0aWVzLlxyXG4gICAgICAgICAgICAgICAgICAgICg8YW55PnByb21pc2UpLl9icmlkZ2UgPSB0aGlzLl9icmlkZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxhbnk+cHJvbWlzZSkuX3Rhc2tJZCA9IHRhc2tJZDtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdCh0aGlzLm1ha2VGYXRhbCgpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgICAgICogQ2FuY2VsIGFsbCB0YXNrcy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIFtpbl0gc2V0IGV4ZWN1dGUgb3B0aW9ucy5cclxuICAgICAgICAgKiBAcmV0dXJucyBQcm9taXNlIG9iamVjdC5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgICAgICog44GZ44G544Gm44Gu44K/44K544Kv44Gu44Kt44Oj44Oz44K744OrXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIOWun+ihjOOCquODl+OCt+ODp+ODs+OCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNhbmNlbChvcHRpb25zPzogRXhlY09wdGlvbnMpOiBJUHJvbWlzZUJhc2U8SVJlc3VsdD4ge1xyXG4gICAgICAgICAgICBjb25zdCBkZiA9ICQuRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgVXRpbHMud2FpdEZvclBsdWdpblJlYWR5KClcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9icmlkZ2UuY2FuY2VsKG51bGwsIG9wdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRmLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGRmLnJlamVjdCh0aGlzLm1ha2VGYXRhbCgpKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gZGYucHJvbWlzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIERlc3RydWN0aW9uIGZvciB0aGUgaW5zdGFuY2UuXHJcbiAgICAgICAgICogcmVsZWFzZSBOYXRpdmUgY2xhc3MgcmVmZXJlbmNlLiBhZnRlciB0aGF0LCBleGVjKCkgYmVjb21lcyBpbnZhbGlkLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSBzZXQgZXhlY3V0ZSBvcHRpb25zLlxyXG4gICAgICAgICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0LlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogXFx+amFwYW5lc2VcclxuICAgICAgICAgKiDjgqTjg7Pjgrnjgr/jg7Pjgrnjga7noLTmo4RcclxuICAgICAgICAgKiBOYXRpdmUg44Gu5Y+C54Wn44KS6Kej6Zmk44GZ44KL44CC5Lul6ZmN44CBZXhlYyDjga/nhKHlirnjgajjgarjgovjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIFtpbl0g5a6f6KGM44Kq44OX44K344On44Oz44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnMgUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgZGlzcG9zZShvcHRpb25zPzogRXhlY09wdGlvbnMpOiBJUHJvbWlzZUJhc2U8SVJlc3VsdD4ge1xyXG4gICAgICAgICAgICBjb25zdCBkZiA9ICQuRGVmZXJyZWQoKTtcclxuICAgICAgICAgICAgVXRpbHMud2FpdEZvclBsdWdpblJlYWR5KClcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9icmlkZ2UuZGlzcG9zZShvcHRpb25zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZi5yZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGYucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBkZi5yZWplY3QodGhpcy5tYWtlRmF0YWwoKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRmLnByb21pc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJvdGVjdGVkIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICAgICAqIEFjY2VzcyB0byBQbHVnaW4uTmF0aXZlQnJpZGdlIG9iamVjdC5cclxuICAgICAgICAgKiBJZiB5b3Ugd2FudCB0byB1c2UgbG93IGxldmVsIGV4ZWMoKSwgeW91IGNhbiB1c2UgdGhpcyBhY2Nlc3Nvci5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIFBsdWdpbi5OYXRpdmVCcmlkZ2UgaW5zdGFuY2UuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICAgICAqIFBsdWdpbi5OYXRpdmVCcmlkZ2Ug44Kq44OW44K444Kn44Kv44OI44G444Gu44Ki44Kv44K744K5XHJcbiAgICAgICAgICog5L2O44Os44OZ44OrIGV4ZWMoKSDjgpLkvb/nlKjjgZfjgZ/jgYTloLTlkIjjgavliKnnlKjlj6/og71cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm5zIFBsdWdpbi5OYXRpdmVCcmlkZ2Ug44Kk44Oz44K544K/44Oz44K5LlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3RlY3RlZCBnZXQgYnJpZGdlKCk6IFBsdWdpbi5OYXRpdmVCcmlkZ2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnJpZGdlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8hIE1ha2UgZmF0YWwgZXJyb3Igb2JqZWN0LlxyXG4gICAgICAgIHByaXZhdGUgbWFrZUZhdGFsKCk6IElSZXN1bHQge1xyXG4gICAgICAgICAgICBjb25zdCBtc2cgPSBUQUcgKyBcImZhdGFsIGVycm9yLiAnY29yZG92YS1wbHVnaW4tY2RwLW5hdGl2ZWJyaWRnZScgaXMgbm90IGF2YWlsYWJsZS5cIjtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgY29kZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIG5hbWU6IFRBRyArIFwiRVJST1JfRkFUQUxcIixcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IG1zZyxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19