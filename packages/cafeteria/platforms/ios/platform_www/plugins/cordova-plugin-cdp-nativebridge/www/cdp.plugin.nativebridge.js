cordova.define("cordova-plugin-cdp-nativebridge.NativeBridge", function(require, exports, module) {
/*!
 * cdp.plugin.nativebridge.js 1.1.0
 *
 * Date: 2016-03-23T21:32:52
 */

var CDP;
(function (CDP) {
    var Plugin;
    (function (Plugin) {
        var _NativeBridge;
        (function (_NativeBridge) {
            /**
             * \~english
             * @class Patch
             * @brief Utility class to apply patch code to the cordova instance.
             *
             * \~japanese
             * @class Patch
             * @brief cordova 本体への Patch を扱うユーティリティクラス
             */
            var Patch = (function () {
                function Patch() {
                }
                ///////////////////////////////////////////////////////////////////////
                // public static methods
                /**
                 * \~english
                 * "backbutton" event is handled with priority.
                 *
                 * \~japanese
                 * "backbutton" イベントを優先的に扱う
                 */
                Patch.setBackButtonPriority = function (first) {
                    if (typeof cordova !== "undefined") {
                        if (first) {
                            if (null == Patch.s_fireDocumentEventOrg) {
                                Patch.s_fireDocumentEventOrg = cordova.fireDocumentEvent;
                            }
                            cordova.fireDocumentEvent = function (eventType, data, bNoDetach) {
                                if ("backbutton" === eventType) {
                                    Patch.s_fireDocumentEventOrg(eventType, data, true);
                                }
                                else {
                                    Patch.s_fireDocumentEventOrg(eventType, data, bNoDetach);
                                }
                            };
                        }
                        else if (null != Patch.s_fireDocumentEventOrg) {
                            cordova.fireDocumentEvent = Patch.s_fireDocumentEventOrg;
                            Patch.s_fireDocumentEventOrg = null;
                        }
                    }
                };
                return Patch;
            }());
            _NativeBridge.Patch = Patch;
        })(_NativeBridge = Plugin._NativeBridge || (Plugin._NativeBridge = {}));
    })(Plugin = CDP.Plugin || (CDP.Plugin = {}));
})(CDP || (CDP = {}));

/* tslint:disable:max-line-length forin */
var CDP;
(function (CDP) {
    var Plugin;
    (function (Plugin) {
        var TAG = "[CDP.Plugin.NativeBridge] ";
        var _utils = cordova.require("cordova/utils");
        /**
         * \~english
         * @class NativeBridge
         * @brief Main class for "cdp.plugin.nativebridge" module.
         *        [JavaScript instance : Native instance] = [1 : 1].
         *
         * \~japanese
         * @class NativeBridge
         * @brief Native Bridge の主クラス
         *        [JavaScript instance : Native instance] = [1 : 1] となる
         */
        var NativeBridge = (function () {
            /**
             * \~english
             * constructor
             *
             * @param feature {Feature}           [in] feature information.
             * @param options {ConstructOptions?} [in] construction options.
             *
             * \~japanese
             * constructor
             *
             * @param feature {Feature}           [in] 機能情報
             * @param options {ConstructOptions?} [in] オプション情報
             */
            function NativeBridge(feature, options) {
                if (!(this instanceof NativeBridge)) {
                    return new NativeBridge(feature, options);
                }
                this._feature = feature;
                this._objectId = "object:" + _utils.createUUID();
                this._execTaskHistory = {};
            }
            ///////////////////////////////////////////////////////////////////////
            // public methods
            /**
             * \~english
             * Execute task.
             * the function calls the Native class method from correspondent method name.
             *
             * @param success {Function}     [in] success callback.
             * @param fail    {Function}     [in] fail callback.
             * @param method  {String}       [in] method name of Native class
             * @param args    {Object[]}     [in] set arguments by array type.
             * @param options {ExecOptions?} [in] set exec options.
             * @return task ID {String}
             *
             * \~japanese
             * タスクの実行
             * 指定した method 名に対応する Native Class の method を呼び出す。
             *
             * @param success {Function}     [in] success callback
             * @param fail    {Function}     [in] fail callback
             * @param method  {String}       [in] Native Class のメソッド名を指定
             * @param args    {Object[]}     [in] 引数を配列で指定
             * @param options {ExecOptions?} [in] 実行オプションを指定
             * @return task ID {String}
             */
            NativeBridge.prototype.exec = function (success, fail, method, args, options) {
                var _this = this;
                var opt = NativeBridge._extend({
                    post: true,
                    compatible: false,
                    pluginAction: "execTask",
                }, options);
                var taskId = ("execTask" !== opt.pluginAction) ? opt.taskId : (this._objectId + "-task:" + _utils.createUUID());
                var execInfo = {
                    feature: this._feature,
                    objectId: this._objectId,
                    taskId: taskId,
                    method: method,
                    compatible: opt.compatible,
                };
                var _fireCallback = function (taskId, func, result, post) {
                    // history から削除
                    if (null != taskId && null != _this._execTaskHistory[taskId]) {
                        delete _this._execTaskHistory[taskId];
                    }
                    if (null != func) {
                        if (!post) {
                            func(result);
                        }
                        else {
                            setTimeout(function () {
                                func(result);
                            });
                        }
                    }
                };
                var errorMsg;
                var rawArgs = (null != args && args instanceof Array) ? args : ((null == args) ? [] : [].slice.apply(args));
                rawArgs.unshift(execInfo);
                // すでに dispose されていた場合はエラー
                if (null == this._objectId) {
                    errorMsg = TAG + "this object is already disposed.";
                    _fireCallback(null, fail, {
                        code: NativeBridge.ERROR_INVALID_OPERATION,
                        message: errorMsg,
                        name: TAG + "ERROR_INVALID_OPERATION",
                    }, opt.post);
                    console.error(errorMsg);
                    return null;
                }
                // 引数に null/undefined がある場合はエラー
                for (var i = 1, n = rawArgs.length; i < n; i++) {
                    if (null == rawArgs[i]) {
                        errorMsg = TAG + "invalid arg. (arg[" + (i - 1) + "] == null)";
                        _fireCallback(taskId, fail, {
                            code: NativeBridge.ERROR_INVALID_ARG,
                            message: errorMsg,
                            name: TAG + "ERROR_INVALID_ARG",
                            taskId: taskId,
                        }, opt.post);
                        console.error(errorMsg);
                        return taskId;
                    }
                }
                // history 管理に追加
                if ("execTask" === opt.pluginAction) {
                    this._execTaskHistory[taskId] = false;
                }
                // exec 実行
                cordova.exec(function (result) {
                    if (_this._execTaskHistory[taskId]) {
                        errorMsg = TAG + "[taskId:" + taskId + "] is canceled.";
                        _fireCallback(taskId, fail, {
                            code: NativeBridge.ERROR_CANCEL,
                            message: errorMsg,
                            name: TAG + "ERROR_CANCEL",
                            taskId: taskId,
                        }, opt.post);
                        console.log(errorMsg);
                    }
                    else {
                        _fireCallback(taskId, success, result, opt.post);
                    }
                }, function (result) {
                    _fireCallback(taskId, fail, result, opt.post);
                }, "NativeBridge", opt.pluginAction, rawArgs);
                return taskId;
            };
            /**
             * \~english
             * Cancel task.
             *
             * @param taskId  {String}       [in] set task ID that returned exec(). if set null, all tasks will be cancelling.
             * @param options {ExecOptions?} [in] set execute options.
             * @param success {Function?}    [in] success callback.
             * @param fail    {Function?}    [in] fail callback.
             *
             * \~japanese
             * タスクのキャンセル
             *
             * @param taskId  {String}       [in] タスク ID を指定. exec() の戻り値. null 指定で全キャンセル
             * @param options {ExecOptions?} [in] 実行オプションを指定
             * @param success {Function?}    [in] success callback
             * @param fail    {Function?}    [in] fail callback
             */
            NativeBridge.prototype.cancel = function (taskId, options, success, fail) {
                var opt = NativeBridge._extend({ post: false }, options);
                opt.pluginAction = "cancelTask";
                opt.taskId = taskId;
                opt.compatible = false;
                if (null == taskId) {
                    this._setCancelAll();
                }
                else if (null != this._execTaskHistory[taskId]) {
                    this._execTaskHistory[taskId] = true;
                }
                this.exec(success, fail, null, [], opt);
            };
            /**
             * \~english
             * Destruction for the instance.
             * release Native class reference. after that, exec() becomes invalid.
             *
             * @param options {ExecOptions?} [in] set execute options.
             * @param success {Function?}    [in] success callback.
             * @param fail    {Function?}    [in] fail callback.
             *
             * \~japanese
             * インスタンスの破棄
             * Native の参照を解除する。以降、exec() は無効となる。
             *
             * @param options {ExecOptions?} [in] 実行オプションを指定
             * @param success {Function?}    [in] success callback
             * @param fail    {Function?}    [in] fail callback
             */
            NativeBridge.prototype.dispose = function (options, success, fail) {
                var opt = NativeBridge._extend({ post: false }, options);
                opt.pluginAction = "disposeTask";
                opt.taskId = null;
                opt.compatible = false;
                this._setCancelAll();
                this.exec(success, fail, null, [], opt);
                this._objectId = null;
            };
            ///////////////////////////////////////////////////////////////////////
            // public static methods
            /**
             * \~english
             * Set priority for "backbutton" event.
             *
             * @param first {Boolean} [in] true: set first priority / false: default.
             *
             * \~japanese
             * "backbutton" イベントを優先設定
             *
             * @param first {Boolean} [in] true: 優先処理 / false: default
             */
            NativeBridge.setBackButtonPriority = function (first) {
                Plugin._NativeBridge.Patch.setBackButtonPriority(first);
            };
            Object.defineProperty(NativeBridge, "SUCCESS_OK", {
                ///////////////////////////////////////////////////////////////////////
                // const valiable
                // Result code
                get: function () { return 0x0000; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeBridge, "SUCCESS_PROGRESS", {
                get: function () { return 0x0001; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeBridge, "ERROR_FAIL", {
                get: function () { return 0x0002; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeBridge, "ERROR_CANCEL", {
                get: function () { return 0x0003; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeBridge, "ERROR_INVALID_ARG", {
                get: function () { return 0x0004; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeBridge, "ERROR_NOT_IMPLEMENT", {
                get: function () { return 0x0005; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeBridge, "ERROR_NOT_SUPPORT", {
                get: function () { return 0x0006; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeBridge, "ERROR_INVALID_OPERATION", {
                get: function () { return 0x0007; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeBridge, "ERROR_CLASS_NOT_FOUND", {
                get: function () { return 0x0008; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(NativeBridge, "ERROR_METHOD_NOT_FOUND", {
                get: function () { return 0x0009; },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // private methods
            // history をすべて cancel 候補に変換
            NativeBridge.prototype._setCancelAll = function () {
                for (var key in this._execTaskHistory) {
                    if (this._execTaskHistory.hasOwnProperty(key)) {
                        this._execTaskHistory[key] = true;
                    }
                }
            };
            ///////////////////////////////////////////////////////////////////////
            // private static methods
            // オプション初期化用
            NativeBridge._extend = function (dst, src) {
                for (var key in src) {
                    dst[key] = src[key];
                }
                return dst;
            };
            return NativeBridge;
        }());
        Plugin.NativeBridge = NativeBridge;
        ///////////////////////////////////////////////////////////////////////
        // closure methods
        // 既定で backbutton を優先処理に設定
        NativeBridge.setBackButtonPriority(true);
    })(Plugin = CDP.Plugin || (CDP.Plugin = {}));
})(CDP || (CDP = {}));


module.exports = CDP.Plugin.NativeBridge;

});
