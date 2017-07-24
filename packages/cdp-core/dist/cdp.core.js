﻿/*!
 * cdp.core.js 2.0.0
 *
 * Date: 2017-07-24T11:13:53.476Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(function () { return factory(root.CDP || (root.CDP = {})); }); } else if (typeof exports === "object") { module.exports = factory(root.CDP || (root.CDP = {})); } else { factory(root.CDP || (root.CDP = {})); } }(((this || 0).self || global), function (CDP) {
var CDP;
(function (CDP) {
    var TAG = "[CDP] ";
    /**
     * システムの global オブジェクトにアクセス
     * 通常は Window オブジェクトとなる
     */
    CDP.global = Function("return this")();
    /**
     * Web root location にアクセス
     */
    CDP.webRoot = (function () {
        if (CDP.global.location) {
            var baseUrl = /(.+\/)[^/]*#[^/]+/.exec(CDP.global.location.href);
            if (!baseUrl) {
                baseUrl = /(.+\/)/.exec(CDP.global.location.href);
            }
            return baseUrl[1];
        }
    })();
    /**
     * Config オブジェクトにアクセス
     */
    CDP.Config = CDP.Config || CDP.global.Config || {};
    /**
     * core の初期化
     */
    function initialize(options) {
        setTimeout(function () {
            try {
                CDP.Patch.apply();
                if (options && typeof options.success === "function") {
                    options.success();
                }
            }
            catch (error) {
                var errorInfo = CDP.makeErrorInfo(CDP.RESULT_CODE.ERROR_CDP_INITIALIZE_FAILED, TAG, (error && error.message) ? error.message : null, error);
                console.error(errorInfo.message);
                if (options && typeof options.fail === "function") {
                    options.fail(errorInfo);
                }
            }
        });
    }
    CDP.initialize = initialize;
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var TAG = "[CDP.Patch] ";
    /**
     * @class Patch
     * @brief 実行環境用 Patch 適用ユーティリティクラス
     */
    var Patch = (function () {
        function Patch() {
        }
        ///////////////////////////////////////////////////////////////////////
        // public static methods:
        /**
         * パッチの適用
         */
        Patch.apply = function () {
            Patch.consolePatch();
            Patch.nodePatch();
        };
        ///////////////////////////////////////////////////////////////////////
        // private static methods:
        // console 用 patch
        Patch.consolePatch = function () {
            if (null == CDP.global.console || null == CDP.global.console.error) {
                CDP.global.console = {
                    count: function () { },
                    groupEnd: function () { },
                    time: function () { },
                    timeEnd: function () { },
                    trace: function () { },
                    group: function () { },
                    dirxml: function () { },
                    debug: function () { },
                    groupCollapsed: function () { },
                    select: function () { },
                    info: function () { },
                    profile: function () { },
                    assert: function () { },
                    msIsIndependentlyComposed: function () { },
                    clear: function () { },
                    dir: function () { },
                    warn: function () { },
                    error: function () { },
                    log: function () { },
                    profileEnd: function () { }
                };
            }
        };
        // WinRT 用 patch
        Patch.nodePatch = function () {
            if ("object" === typeof MSApp) {
                var _MSApp_1 = MSApp;
                var originalAppendChild_1 = Node.prototype.appendChild;
                Node.prototype.appendChild = function (node) {
                    var self = this;
                    return _MSApp_1.execUnsafeLocalFunction(function () {
                        return originalAppendChild_1.call(self, node);
                    });
                };
                var originalInsertBefore_1 = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function (newElement, referenceElement) {
                    var self = this;
                    return _MSApp_1.execUnsafeLocalFunction(function () {
                        return originalInsertBefore_1.call(self, newElement, referenceElement);
                    });
                };
            }
        };
        return Patch;
    }());
    CDP.Patch = Patch;
})(CDP || (CDP = {}));
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var CDP;
(function (CDP) {
    var CANCELED_MESSAGE = "abort";
    var s_code2message = {
        "0": "operation succeeded.",
        "-1": "operation failed."
    };
    ///////////////////////////////////////////////////////////////////////
    // error utilities:
    /**
     * @enum  RESULT_CODE
     * @brief アプリケーション全体で使用する共通エラーコード定義
     */
    var RESULT_CODE;
    (function (RESULT_CODE) {
        RESULT_CODE[RESULT_CODE["SUCCEEDED"] = 0] = "SUCCEEDED";
        RESULT_CODE[RESULT_CODE["FAILED"] = -1] = "FAILED";
    })(RESULT_CODE = CDP.RESULT_CODE || (CDP.RESULT_CODE = {}));
    // ローカルリザルトコードのアサイン可能数
    CDP.MODULE_RESULT_CODE_RANGE = 1000;
    /**
     * エラー情報生成
     *
     * @param resultCode [in] RESULT_CODE を指定
     * @param [tag]      [in] TAG を指定
     * @param [message]  [in] メッセージを指定
     * @param [cause]    [in] 下位のエラーを指定
     * @returns エラーオブジェクト
     */
    function makeErrorInfo(resultCode, tag, message, cause) {
        var canceled = (cause && CANCELED_MESSAGE === cause.message) ? true : false;
        var msg = canceled ? CANCELED_MESSAGE : message;
        var code = canceled ? RESULT_CODE.SUCCEEDED : resultCode;
        return __assign({}, new Error(msg || messageFromResultCode(code)), {
            name: buildErrorName(code, tag),
            code: code,
            cause: cause,
        });
    }
    CDP.makeErrorInfo = makeErrorInfo;
    /**
     * キャンセルエラー情報生成
     *
     * @param [cause]    [in] 下位のエラーを指定
     * @param [tag]      [in] TAG を指定
     * @returns エラーオブジェクト
     */
    function makeCanceledErrorInfo(tag, cause) {
        return makeErrorInfo(RESULT_CODE.SUCCEEDED, tag, CANCELED_MESSAGE, cause);
    }
    CDP.makeCanceledErrorInfo = makeCanceledErrorInfo;
    /**
     * エラー情報がキャンセルされたものか判定
     *
     * @param error [in] エラー情報
     * @returns true: キャンセル / false: その他エラー
     */
    function isCanceledError(error) {
        var errorInfo = error;
        if (errorInfo) {
            if (RESULT_CODE.SUCCEEDED === errorInfo.code || CANCELED_MESSAGE === errorInfo.message) {
                return true;
            }
        }
        return false;
    }
    CDP.isCanceledError = isCanceledError;
    /**
     * @enum  RESULT_CODE_BASE
     * @brief リザルトコードのオフセット値
     *        エラーコード対応するモジュール内で 定義を拡張する.
     */
    var RESULT_CODE_BASE;
    (function (RESULT_CODE_BASE) {
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_DECLARERATION"] = 0] = "CDP_DECLARERATION";
        //      MODULE_A = 1 * MODULE_RESULT_CODE_RANGE,    // ex) moduleA: 1001 ～ 1999
        //      MODULE_B = 2 * MODULE_RESULT_CODE_RANGE,    // ex) moduleB: 2001 ～ 2999
        //      MODULE_C = 3 * MODULE_RESULT_CODE_RANGE,    // ex) moduleC: 3001 ～ 3999
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP"] = 101 * CDP.MODULE_RESULT_CODE_RANGE] = "CDP";
    })(RESULT_CODE_BASE = CDP.RESULT_CODE_BASE || (CDP.RESULT_CODE_BASE = {}));
    // "CDP" 以外の namespace で定義した場合は、ASSING ユーティリティをコールする.
    //  ASSIGN_RESULT_CODE_BASE(RESULT_CODE_BASE);
    // エラーコード生成
    function DECLARE_ERROR_CODE(baseName, localCode, message) {
        return declareResultCode(CDP.RESULT_CODE_BASE[baseName], localCode, message);
    }
    CDP.DECLARE_ERROR_CODE = DECLARE_ERROR_CODE;
    /**
     * RESULT_CODE_BASE のアサイン
     */
    function ASSIGN_RESULT_CODE_BASE(resultCodeBase) {
        CDP.RESULT_CODE_BASE = __assign({}, CDP.RESULT_CODE_BASE, resultCodeBase);
    }
    CDP.ASSIGN_RESULT_CODE_BASE = ASSIGN_RESULT_CODE_BASE;
    /**
     * RESULT_CODE のアサイン
     */
    function ASSIGN_RESULT_CODE(resultCode) {
        CDP.RESULT_CODE = __assign({}, CDP.RESULT_CODE, resultCode);
    }
    CDP.ASSIGN_RESULT_CODE = ASSIGN_RESULT_CODE;
    ///////////////////////////////////////////////////////////////////////
    // module error declaration:
    var FUNCTION_CODE_RANGE = 10;
    /**
     * @enum  LOCAL_CODE_BASE
     * @brief cdp.core 内のローカルコードオフセット値
     */
    var LOCAL_CODE_BASE;
    (function (LOCAL_CODE_BASE) {
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["CORE"] = 0] = "CORE";
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["PATCH"] = 1 * FUNCTION_CODE_RANGE] = "PATCH";
    })(LOCAL_CODE_BASE || (LOCAL_CODE_BASE = {}));
    /**
     * @enum  RESULT_CODE
     * @brief FES.Utils のエラーコード定義
     *        モジュール別に拡張可能
     */
    (function (RESULT_CODE) {
        RESULT_CODE[RESULT_CODE["ERROR_CDP_DECLARATION_CDP"] = 0] = "ERROR_CDP_DECLARATION_CDP";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_INITIALIZE_FAILED"] = DECLARE_ERROR_CODE("CDP", LOCAL_CODE_BASE.CORE + 1, "initialized failed.")] = "ERROR_CDP_INITIALIZE_FAILED";
    })(RESULT_CODE = CDP.RESULT_CODE || (CDP.RESULT_CODE = {}));
    // "CDP" 以外の namespace で定義した場合は、ASSING ユーティリティをコールする.
    //  ASSIGN_RESULT_CODE_BASE(RESULT_CODE);
    ///////////////////////////////////////////////////////////////////////
    // private static methods:
    /**
     * リザルトコードの登録
     *
     * @param base       [in] RESULT_CODE_BASE を指定
     * @param moduleCode [in] モジュールで一意になる数値 (0 < localCode < 1000)
     * @param [message]  [in] リザルトコードに紐づくメッセージ
     * @returns リザルトコード
     */
    function declareResultCode(base, moduleCode, message) {
        if (moduleCode <= 0 || CDP.MODULE_RESULT_CODE_RANGE <= moduleCode) {
            console.error("declareResultCode(), invalid localCode range. [localCode: " + moduleCode + "]");
            return;
        }
        var resultCode = base + moduleCode;
        s_code2message[resultCode] = message ? message : ("[RESULT_CODE: " + resultCode + "]");
        return resultCode;
    }
    /**
     * リザルトコードから登録されているメッセージを取得
     *
     * @param resultCode [in] リザルトコード
     * @returns エラーメッセージ
     */
    function messageFromResultCode(resultCode) {
        if (s_code2message[resultCode]) {
            return s_code2message[resultCode];
        }
        else {
            return "unregistered result code. [RESULT_CODE: " + resultCode + "]";
        }
    }
    /**
     * リザルトコードから登録されているリザルトコード文字列を取得
     *
     * @param resultCode [in] リザルトコード
     * @param tag        [in] TAG を指定
     * @returns リザルトコード識別文字列
     */
    function buildErrorName(resultCode, tag) {
        var prefix = tag || "";
        if (RESULT_CODE[resultCode]) {
            return prefix + RESULT_CODE[resultCode] + ": ";
        }
        else {
            return prefix;
        }
    }
})(CDP || (CDP = {}));

return CDP; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvQ29yZS50cyIsImNkcDovLy9DRFAvUGF0Y2gudHMiLCJjZHA6Ly8vQ0RQL0Vycm9yRGVmcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0E4RFo7QUE5REQsV0FBVSxHQUFHO0lBRVQsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDO0lBRXJCOzs7T0FHRztJQUNVLFVBQU0sR0FBUSxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztJQUdyRDs7T0FFRztJQUNVLFdBQU8sR0FBVyxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksT0FBTyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxVQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDWCxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELENBQUM7WUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLENBQUM7SUFDTCxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRUw7O09BRUc7SUFDVSxVQUFNLEdBQVEsR0FBRyxDQUFDLE1BQU0sSUFBSSxVQUFNLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQVc3RDs7T0FFRztJQUNILG9CQUEyQixPQUF5QjtRQUNoRCxVQUFVLENBQUM7WUFDUCxJQUFJLENBQUM7Z0JBQ0QsU0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNkLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDbkQsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUN0QixDQUFD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QUFNLENBQUMsTUFBTSxDQUFDO1FBQ2xCLENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQyxFQWxNUyxHQUFHLEtBQUgsR0FBRyxRQWtNWiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBDRFAge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUF0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrfjgrnjg4bjg6Djga4gZ2xvYmFsIOOCquODluOCuOOCp+OCr+ODiOOBq+OCouOCr+OCu+OCuVxyXG4gICAgICog6YCa5bi444GvIFdpbmRvdyDjgqrjg5bjgrjjgqfjgq/jg4jjgajjgarjgotcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGdsb2JhbDogYW55ID0gRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdlYiByb290IGxvY2F0aW9uIOOBq+OCouOCr+OCu+OCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3Qgd2ViUm9vdDogc3RyaW5nID0gKCgpID0+IHtcclxuICAgICAgICBpZiAoZ2xvYmFsLmxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIGxldCBiYXNlVXJsID0gLyguK1xcLylbXi9dKiNbXi9dKy8uZXhlYyhnbG9iYWwubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgICAgIGlmICghYmFzZVVybCkge1xyXG4gICAgICAgICAgICAgICAgYmFzZVVybCA9IC8oLitcXC8pLy5leGVjKGdsb2JhbC5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmFzZVVybFsxXTtcclxuICAgICAgICB9XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uZmlnIOOCquODluOCuOOCp+OCr+ODiOOBq+OCouOCr+OCu+OCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgQ29uZmlnOiBhbnkgPSBDRFAuQ29uZmlnIHx8IGdsb2JhbC5Db25maWcgfHwge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3mnJ/ljJbjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBDb3JlSW5pdE9wdGlvbnMge1xyXG4gICAgICAgIHN1Y2Nlc3M/OiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIGZhaWw/OiAoZXJyb3I/OiBhbnkpID0+IHZvaWQ7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY29yZSDjga7liJ3mnJ/ljJZcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemUob3B0aW9ucz86IENvcmVJbml0T3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgUGF0Y2guYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JJbmZvID0gbWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfSU5JVElBTElaRV9GQUlMRUQsXHJcbiAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgIChlcnJvciAmJiBlcnJvci5tZXNzYWdlKSA/IGVycm9yLm1lc3NhZ2UgOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvckluZm8ubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5mYWlsID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmZhaWwoZXJyb3JJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcImNkcC5jb3JlXCIge1xyXG4gICAgZXhwb3J0ID0gQ0RQO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAge1xyXG5cclxuICAgIGNvbnN0IFRBRzogc3RyaW5nID0gXCJbQ0RQLlBhdGNoXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQYXRjaFxyXG4gICAgICogQGJyaWVmIOWun+ihjOeSsOWig+eUqCBQYXRjaCDpgannlKjjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhdGNoIHtcclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kczpcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44OR44OD44OB44Gu6YGp55SoXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBhcHBseSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgUGF0Y2guY29uc29sZVBhdGNoKCk7XHJcbiAgICAgICAgICAgIFBhdGNoLm5vZGVQYXRjaCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIHN0YXRpYyBtZXRob2RzOlxyXG5cclxuICAgICAgICAvLyBjb25zb2xlIOeUqCBwYXRjaFxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGNvbnNvbGVQYXRjaCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gZ2xvYmFsLmNvbnNvbGUgfHwgbnVsbCA9PSBnbG9iYWwuY29uc29sZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgZ2xvYmFsLmNvbnNvbGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBncm91cEVuZDogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZUVuZDogICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICB0cmFjZTogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyeG1sOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBkZWJ1ZzogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwQ29sbGFwc2VkOiAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0OiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBpbmZvOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2ZpbGU6ICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0OiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBtc0lzSW5kZXBlbmRlbnRseUNvbXBvc2VkOiAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyOiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICB3YXJuOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbG9nOiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBwcm9maWxlRW5kOiAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXaW5SVCDnlKggcGF0Y2hcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBub2RlUGF0Y2goKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChcIm9iamVjdFwiID09PSB0eXBlb2YgTVNBcHApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IF9NU0FwcDogYW55ID0gTVNBcHA7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxBcHBlbmRDaGlsZCA9IE5vZGUucHJvdG90eXBlLmFwcGVuZENoaWxkO1xyXG4gICAgICAgICAgICAgICAgTm9kZS5wcm90b3R5cGUuYXBwZW5kQ2hpbGQgPSBmdW5jdGlvbiAobm9kZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9NU0FwcC5leGVjVW5zYWZlTG9jYWxGdW5jdGlvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEFwcGVuZENoaWxkLmNhbGwoc2VsZiwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsSW5zZXJ0QmVmb3JlID0gTm9kZS5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlO1xyXG4gICAgICAgICAgICAgICAgTm9kZS5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlID0gZnVuY3Rpb24gKG5ld0VsZW1lbnQ6IGFueSwgcmVmZXJlbmNlRWxlbWVudDogTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfTVNBcHAuZXhlY1Vuc2FmZUxvY2FsRnVuY3Rpb24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxJbnNlcnRCZWZvcmUuY2FsbChzZWxmLCBuZXdFbGVtZW50LCByZWZlcmVuY2VFbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgY29uc3QgQ0FOQ0VMRURfTUVTU0FHRSA9IFwiYWJvcnRcIjtcclxuICAgIGNvbnN0IHNfY29kZTJtZXNzYWdlOiB7IFtyZXN1bHRDb2RlOiBzdHJpbmddOiBzdHJpbmcgfSA9IHtcclxuICAgICAgICBcIjBcIjogXCJvcGVyYXRpb24gc3VjY2VlZGVkLlwiLFxyXG4gICAgICAgIFwiLTFcIjogXCJvcGVyYXRpb24gZmFpbGVkLlwiXHJcbiAgICB9O1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBlcnJvciB1dGlsaXRpZXM6XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW51bSAgUkVTVUxUX0NPREVcclxuICAgICAqIEBicmllZiDjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7PlhajkvZPjgafkvb/nlKjjgZnjgovlhbHpgJrjgqjjg6njg7zjgrPjg7zjg4nlrprnvqlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREUge1xyXG4gICAgICAgIFNVQ0NFRURFRCA9IDAsICAvLyDmsY7nlKjmiJDlip9cclxuICAgICAgICBGQUlMRUQgPSAtMSwgICAgLy8g5rGO55So44Gu44Ko44Op44O8XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEVycm9ySW5mb1xyXG4gICAgICogQGJyaWVmICAgICDjgqjjg6njg7zkvJ3pgZTjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFcnJvckluZm8gZXh0ZW5kcyBFcnJvciB7XHJcbiAgICAgICAgY29kZTogUkVTVUxUX0NPREU7ICAgLy8g44Ki44OX44Oq44Kx44O844K344On44OzL+ODqeOCpOODluODqeODquOBp+Wumue+qeOBmeOCi+ODquOCtuODq+ODiOOCs+ODvOODiVxyXG4gICAgICAgIGNhdXNlPzogRXJyb3I7ICAgICAgIC8vIOOCqOODqeODvOOBruips+e0sFxyXG4gICAgfVxyXG5cclxuICAgIC8vIOODreODvOOCq+ODq+ODquOCtuODq+ODiOOCs+ODvOODieOBruOCouOCteOCpOODs+WPr+iDveaVsFxyXG4gICAgZXhwb3J0IGNvbnN0IE1PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRSA9IDEwMDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg6njg7zmg4XloLHnlJ/miJBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcmVzdWx0Q29kZSBbaW5dIFJFU1VMVF9DT0RFIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIFt0YWddICAgICAgW2luXSBUQUcg44KS5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gW21lc3NhZ2VdICBbaW5dIOODoeODg+OCu+ODvOOCuOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIFtjYXVzZV0gICAgW2luXSDkuIvkvY3jga7jgqjjg6njg7zjgpLmjIflrppcclxuICAgICAqIEByZXR1cm5zIOOCqOODqeODvOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWFrZUVycm9ySW5mbyhyZXN1bHRDb2RlOiBudW1iZXIsIHRhZz86IHN0cmluZywgbWVzc2FnZT86IHN0cmluZywgY2F1c2U/OiBFcnJvcik6IEVycm9ySW5mbyB7XHJcbiAgICAgICAgY29uc3QgY2FuY2VsZWQgPSAoY2F1c2UgJiYgQ0FOQ0VMRURfTUVTU0FHRSA9PT0gY2F1c2UubWVzc2FnZSkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgY29uc3QgbXNnID0gY2FuY2VsZWQgPyBDQU5DRUxFRF9NRVNTQUdFIDogbWVzc2FnZTtcclxuICAgICAgICBjb25zdCBjb2RlID0gY2FuY2VsZWQgPyBSRVNVTFRfQ09ERS5TVUNDRUVERUQgOiByZXN1bHRDb2RlO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC4uLm5ldyBFcnJvcihtc2cgfHwgbWVzc2FnZUZyb21SZXN1bHRDb2RlKGNvZGUpKSxcclxuICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgbmFtZTogYnVpbGRFcnJvck5hbWUoY29kZSwgdGFnKSxcclxuICAgICAgICAgICAgICAgIGNvZGU6IGNvZGUsXHJcbiAgICAgICAgICAgICAgICBjYXVzZTogY2F1c2UsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kt44Oj44Oz44K744Or44Ko44Op44O85oOF5aCx55Sf5oiQXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIFtjYXVzZV0gICAgW2luXSDkuIvkvY3jga7jgqjjg6njg7zjgpLmjIflrppcclxuICAgICAqIEBwYXJhbSBbdGFnXSAgICAgIFtpbl0gVEFHIOOCkuaMh+WumlxyXG4gICAgICogQHJldHVybnMg44Ko44Op44O844Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBtYWtlQ2FuY2VsZWRFcnJvckluZm8odGFnPzogc3RyaW5nLCBjYXVzZT86IEVycm9yKTogRXJyb3JJbmZvIHtcclxuICAgICAgICByZXR1cm4gbWFrZUVycm9ySW5mbyhSRVNVTFRfQ09ERS5TVUNDRUVERUQsIHRhZywgQ0FOQ0VMRURfTUVTU0FHRSwgY2F1c2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ko44Op44O85oOF5aCx44GM44Kt44Oj44Oz44K744Or44GV44KM44Gf44KC44Gu44GL5Yik5a6aXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGVycm9yIFtpbl0g44Ko44Op44O85oOF5aCxXHJcbiAgICAgKiBAcmV0dXJucyB0cnVlOiDjgq3jg6Pjg7Pjgrvjg6sgLyBmYWxzZTog44Gd44Gu5LuW44Ko44Op44O8XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpc0NhbmNlbGVkRXJyb3IoZXJyb3I6IEVycm9yKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgZXJyb3JJbmZvID0gPEVycm9ySW5mbz5lcnJvcjtcclxuICAgICAgICBpZiAoZXJyb3JJbmZvKSB7XHJcbiAgICAgICAgICAgIGlmIChSRVNVTFRfQ09ERS5TVUNDRUVERUQgPT09IGVycm9ySW5mby5jb2RlIHx8IENBTkNFTEVEX01FU1NBR0UgPT09IGVycm9ySW5mby5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIFJFU1VMVF9DT0RFX0JBU0VcclxuICAgICAqIEBicmllZiDjg6rjgrbjg6vjg4jjgrPjg7zjg4njga7jgqrjg5Xjgrvjg4Pjg4jlgKRcclxuICAgICAqICAgICAgICDjgqjjg6njg7zjgrPjg7zjg4nlr77lv5zjgZnjgovjg6Ljgrjjg6Xjg7zjg6vlhoXjgacg5a6a576p44KS5ouh5by144GZ44KLLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZW51bSBSRVNVTFRfQ09ERV9CQVNFIHtcclxuICAgICAgICBDRFBfREVDTEFSRVJBVElPTiA9IDAsIC8vIFRTMjQzMiDlr77nrZY6IOWQjOS4gCBuYW1lc3BhY2Ug44Gr6KSH5pWw5Zue44Gr44KP44Gf44Gj44Gm5ZCM5ZCN44GuIGVudW0g44KS5a6j6KiA44GZ44KL5aC05ZCI44Gr5b+F6KaBLlxyXG4vLyAgICAgIE1PRFVMRV9BID0gMSAqIE1PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRSwgICAgLy8gZXgpIG1vZHVsZUE6IDEwMDEg772eIDE5OTlcclxuLy8gICAgICBNT0RVTEVfQiA9IDIgKiBNT0RVTEVfUkVTVUxUX0NPREVfUkFOR0UsICAgIC8vIGV4KSBtb2R1bGVCOiAyMDAxIO+9niAyOTk5XHJcbi8vICAgICAgTU9EVUxFX0MgPSAzICogTU9EVUxFX1JFU1VMVF9DT0RFX1JBTkdFLCAgICAvLyBleCkgbW9kdWxlQzogMzAwMSDvvZ4gMzk5OVxyXG4gICAgICAgIENEUCA9IDEwMSAqIE1PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRSwgICAgICAgLy8gY2RwIHJlc2VydmVkLiAxMDEsMDAwIO+9nlxyXG4gICAgfVxyXG4gICAgLy8gXCJDRFBcIiDku6XlpJbjga4gbmFtZXNwYWNlIOOBp+Wumue+qeOBl+OBn+WgtOWQiOOBr+OAgUFTU0lORyDjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgpLjgrPjg7zjg6vjgZnjgosuXHJcbi8vICBBU1NJR05fUkVTVUxUX0NPREVfQkFTRShSRVNVTFRfQ09ERV9CQVNFKTtcclxuXHJcbiAgICAvLyDjgqjjg6njg7zjgrPjg7zjg4nnlJ/miJBcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBERUNMQVJFX0VSUk9SX0NPREUoYmFzZU5hbWU6IHN0cmluZywgbG9jYWxDb2RlOiBudW1iZXIsIG1lc3NhZ2U/OiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBkZWNsYXJlUmVzdWx0Q29kZShDRFAuUkVTVUxUX0NPREVfQkFTRVtiYXNlTmFtZV0sIGxvY2FsQ29kZSwgbWVzc2FnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSRVNVTFRfQ09ERV9CQVNFIOOBruOCouOCteOCpOODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gQVNTSUdOX1JFU1VMVF9DT0RFX0JBU0UocmVzdWx0Q29kZUJhc2U6IG9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIENEUC5SRVNVTFRfQ09ERV9CQVNFID0gPGFueT57IC4uLkNEUC5SRVNVTFRfQ09ERV9CQVNFLCAuLi5yZXN1bHRDb2RlQmFzZSB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUkVTVUxUX0NPREUg44Gu44Ki44K144Kk44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBBU1NJR05fUkVTVUxUX0NPREUocmVzdWx0Q29kZTogb2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgQ0RQLlJFU1VMVF9DT0RFID0gPGFueT57IC4uLkNEUC5SRVNVTFRfQ09ERSwgLi4ucmVzdWx0Q29kZSB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBtb2R1bGUgZXJyb3IgZGVjbGFyYXRpb246XHJcblxyXG4gICAgY29uc3QgRlVOQ1RJT05fQ09ERV9SQU5HRSA9IDEwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIExPQ0FMX0NPREVfQkFTRVxyXG4gICAgICogQGJyaWVmIGNkcC5jb3JlIOWGheOBruODreODvOOCq+ODq+OCs+ODvOODieOCquODleOCu+ODg+ODiOWApFxyXG4gICAgICovXHJcbiAgICBlbnVtIExPQ0FMX0NPREVfQkFTRSB7XHJcbiAgICAgICAgQ09SRSAgICA9IDAsXHJcbiAgICAgICAgUEFUQ0ggICA9IDEgKiBGVU5DVElPTl9DT0RFX1JBTkdFLFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIFJFU1VMVF9DT0RFXHJcbiAgICAgKiBAYnJpZWYgRkVTLlV0aWxzIOOBruOCqOODqeODvOOCs+ODvOODieWumue+qVxyXG4gICAgICogICAgICAgIOODouOCuOODpeODvOODq+WIpeOBq+aLoeW8teWPr+iDvVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZW51bSBSRVNVTFRfQ09ERSB7XHJcbiAgICAgICAgRVJST1JfQ0RQX0RFQ0xBUkFUSU9OX0NEUCAgID0gMCwgLy8gVFMyNDMyIOWvvuetljog5ZCM5LiAIG5hbWVzcGFjZSDjgavopIfmlbDlm57jgavjgo/jgZ/jgaPjgablkIzlkI3jga4gZW51bSDjgpLlrqPoqIDjgZnjgovloLTlkIjjgavlv4XopoEuXHJcbiAgICAgICAgRVJST1JfQ0RQX0lOSVRJQUxJWkVfRkFJTEVEID0gREVDTEFSRV9FUlJPUl9DT0RFKFwiQ0RQXCIsIExPQ0FMX0NPREVfQkFTRS5DT1JFICsgMSwgXCJpbml0aWFsaXplZCBmYWlsZWQuXCIpLFxyXG4gICAgfVxyXG4gICAgLy8gXCJDRFBcIiDku6XlpJbjga4gbmFtZXNwYWNlIOOBp+Wumue+qeOBl+OBn+WgtOWQiOOBr+OAgUFTU0lORyDjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgpLjgrPjg7zjg6vjgZnjgosuXHJcbi8vICBBU1NJR05fUkVTVUxUX0NPREVfQkFTRShSRVNVTFRfQ09ERSk7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByaXZhdGUgc3RhdGljIG1ldGhvZHM6XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg6rjgrbjg6vjg4jjgrPjg7zjg4njga7nmbvpjLJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYmFzZSAgICAgICBbaW5dIFJFU1VMVF9DT0RFX0JBU0Ug44KS5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gbW9kdWxlQ29kZSBbaW5dIOODouOCuOODpeODvOODq+OBp+S4gOaEj+OBq+OBquOCi+aVsOWApCAoMCA8IGxvY2FsQ29kZSA8IDEwMDApXHJcbiAgICAgKiBAcGFyYW0gW21lc3NhZ2VdICBbaW5dIOODquOCtuODq+ODiOOCs+ODvOODieOBq+e0kOOBpeOBj+ODoeODg+OCu+ODvOOCuFxyXG4gICAgICogQHJldHVybnMg44Oq44K244Or44OI44Kz44O844OJXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGRlY2xhcmVSZXN1bHRDb2RlKGJhc2U6IFJFU1VMVF9DT0RFX0JBU0UsIG1vZHVsZUNvZGU6IG51bWJlciwgbWVzc2FnZT86IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKG1vZHVsZUNvZGUgPD0gMCB8fCBNT0RVTEVfUkVTVUxUX0NPREVfUkFOR0UgPD0gbW9kdWxlQ29kZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBkZWNsYXJlUmVzdWx0Q29kZSgpLCBpbnZhbGlkIGxvY2FsQ29kZSByYW5nZS4gW2xvY2FsQ29kZTogJHttb2R1bGVDb2RlfV1gKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZXN1bHRDb2RlID0gYmFzZSArIG1vZHVsZUNvZGU7XHJcbiAgICAgICAgc19jb2RlMm1lc3NhZ2VbcmVzdWx0Q29kZV0gPSBtZXNzYWdlID8gbWVzc2FnZSA6IChgW1JFU1VMVF9DT0RFOiAke3Jlc3VsdENvZGV9XWApO1xyXG4gICAgICAgIHJldHVybiByZXN1bHRDb2RlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODquOCtuODq+ODiOOCs+ODvOODieOBi+OCieeZu+mMsuOBleOCjOOBpuOBhOOCi+ODoeODg+OCu+ODvOOCuOOCkuWPluW+l1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByZXN1bHRDb2RlIFtpbl0g44Oq44K244Or44OI44Kz44O844OJXHJcbiAgICAgKiBAcmV0dXJucyDjgqjjg6njg7zjg6Hjg4Pjgrvjg7zjgrhcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbWVzc2FnZUZyb21SZXN1bHRDb2RlKHJlc3VsdENvZGU6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgaWYgKHNfY29kZTJtZXNzYWdlW3Jlc3VsdENvZGVdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzX2NvZGUybWVzc2FnZVtyZXN1bHRDb2RlXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYHVucmVnaXN0ZXJlZCByZXN1bHQgY29kZS4gW1JFU1VMVF9DT0RFOiAke3Jlc3VsdENvZGV9XWA7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Oq44K244Or44OI44Kz44O844OJ44GL44KJ55m76Yyy44GV44KM44Gm44GE44KL44Oq44K244Or44OI44Kz44O844OJ5paH5a2X5YiX44KS5Y+W5b6XXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHJlc3VsdENvZGUgW2luXSDjg6rjgrbjg6vjg4jjgrPjg7zjg4lcclxuICAgICAqIEBwYXJhbSB0YWcgICAgICAgIFtpbl0gVEFHIOOCkuaMh+WumlxyXG4gICAgICogQHJldHVybnMg44Oq44K244Or44OI44Kz44O844OJ6K2Y5Yil5paH5a2X5YiXXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGJ1aWxkRXJyb3JOYW1lKHJlc3VsdENvZGU6IG51bWJlciwgdGFnOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHByZWZpeCA9IHRhZyB8fCBcIlwiO1xyXG4gICAgICAgIGlmIChSRVNVTFRfQ09ERVtyZXN1bHRDb2RlXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJlZml4ICsgUkVTVUxUX0NPREVbcmVzdWx0Q29kZV0gKyBcIjogXCI7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByZWZpeDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19