/*!
 * cdp.core.js 2.1.0
 *
 * Date: 2017-11-06T05:33:05.221Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(function () { return factory(root.CDP || (root.CDP = {})); }); } else if (typeof exports === "object") { module.exports = factory(root.CDP || (root.CDP = {})); } else { factory(root.CDP || (root.CDP = {})); } }(((this || 0).self || global), function (CDP) {
var CDP;
(function (CDP) {
    var TAG = "[CDP] ";
    /**
     * @en Accessor for system global object.<br>
     *     It'll be usually a `window` object.
     * @ja システムの global オブジェクトへのアクセス<br>
     *     通常は `window` オブジェクトとなる
     */
    CDP.global = Function("return this")();
    /**
     * @en Accsessor for Web root location <br>
     *     Only the browser environment will be an allocating place in index.html, and becomes effective.
     * @ja Web root location へのアクセス <br>
     *     index.html の配置場所となり、ブラウザ環境のみ有効となる.
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
     * @en Converter from relative path to absolute url string. <br>
     *     If you want to access to Assets and in spite of the script location, the function is available.
     * @ja 相対 path を絶対 URL に変換 <br>
     *     js の配置に依存することなく `assets` アクセスしたいときに使用する.
     *
     * @see https://stackoverflow.com/questions/2188218/relative-paths-in-javascript-in-an-external-file
     *
     * @example <br>
     *
     * ```ts
     *  console.log(toUrl("/res/data/collection.json"));
     *  // "http://localhost:8080/app/res/data/collection.json"
     * ```
     *
     * @param path
     *  - `en` set relative path from [[webRoot]].
     *  - `ja` [[webRoot]] からの相対パスを指定
     * @returns url string
     *  - `en` set relative path from [[webRoot]].
     *  - `ja` [[webRoot]] からの相対パスを指定
     */
    function toUrl(path) {
        var root = CDP.webRoot || "";
        if (null != path && null != path[0]) {
            if ("/" === path[0]) {
                return root + path.slice(1);
            }
            else {
                return root + path;
            }
        }
        else {
            return root;
        }
    }
    CDP.toUrl = toUrl;
    /**
     * @en Accessor for global Config object.
     * @ja Config オブジェクトへのアクセス
     */
    CDP.Config = CDP.Config || CDP.global.Config || {};
    /**
     * @en Initialize function for `cdp-core`. <br>
     *     This function applies patch to the run time environment.
     * @ja `cdp-core` の初期化関数<br>
     *     環境の差分を吸収する patch を適用する.
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
                var cause = CDP.ensureErrorInfo(error);
                var errorInfo = CDP.makeErrorInfo(CDP.RESULT_CODE.ERROR_CDP_INITIALIZE_FAILED, TAG, cause.message, cause);
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
     * @en Utility class for appling the patch to the run time environment.
     * @ja 実行環境用 Patch 適用ユーティリティクラス
     *
     * @internal
     */
    var Patch = /** @class */ (function () {
        function Patch() {
        }
        ///////////////////////////////////////////////////////////////////////
        // public static methods:
        /**
         * @en Apply the patch
         * @ja パッチの適用
         *
         * @internal
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
    var UNKNOWN_ERROR_NAME = "Unknown Error";
    var ERROR_NAME_SEPARATOR = ": ";
    var CANCELED_MESSAGE = "abort";
    var s_code2message = {
        "0": "operation succeeded.",
        "1": "operation canceled.",
        "-1": "operation failed."
    };
    ///////////////////////////////////////////////////////////////////////
    // error utilities:
    /**
     * @en Common error code for the application.
     * @ja アプリケーション全体で使用する共通エラーコード定義
     */
    var RESULT_CODE;
    (function (RESULT_CODE) {
        /** `en` general success code <br> `ja` 汎用成功コード        */
        RESULT_CODE[RESULT_CODE["SUCCEEDED"] = 0] = "SUCCEEDED";
        /** `en` general cancel code  <br> `ja` 汎用キャンセルコード  */
        RESULT_CODE[RESULT_CODE["CANCELED"] = 1] = "CANCELED";
        /** `en` general error code   <br> `ja` 汎用エラーコード      */
        RESULT_CODE[RESULT_CODE["FAILED"] = -1] = "FAILED";
    })(RESULT_CODE = CDP.RESULT_CODE || (CDP.RESULT_CODE = {}));
    /**
     * @en The assignable range for the client's local result cord by which expansion is possible.
     * @ja クライアントが拡張可能なローカルリザルトコードのアサイン可能領域
     */
    CDP.MODULE_RESULT_CODE_RANGE = 1000;
    /**
     * @en Generate the [[ErrorInfo]] object.
     * @ja [[ErrorInfo]] オブジェクトを生成
     *
     * @example <br>
     *
     * ```ts
     *  someAsyncFunc()
     *      .then((result) => {
     *          outputMessage(result);
     *      })
     *      .catch((reason: Error) => {
     *          throw makeErrorInfo(
     *              RESULT_CODE.FAILED,
     *              TAG,
     *              "error occur.",
     *              reason  // set received error info.
     *          );
     *      });
     * ```
     *
     * @param resultCode
     *  - `en` set [[RESULT_CODE]] defined.
     *  - `ja` 定義した [[RESULT_CODE]] を指定
     * @param tag
     *  - `en` Log tag information
     *  - `ja` 識別情報
     * @param message
     *  - `en` Human readable message
     *  - `ja` メッセージを指定
     * @param cause
     *  - `en` low-level Error object
     *  - `ja` 下位のエラーを指定
     * @returns
     */
    function makeErrorInfo(resultCode, tag, message, cause) {
        var canceled = (cause && CANCELED_MESSAGE === cause.message) ? true : false;
        var msg = canceled ? CANCELED_MESSAGE : message;
        var code = canceled ? RESULT_CODE.CANCELED : resultCode;
        var errorInfo = new Error(msg || messageFromResultCode(code));
        errorInfo.name = buildErrorName(code, tag);
        errorInfo.code = code;
        errorInfo.cause = cause;
        return errorInfo;
    }
    CDP.makeErrorInfo = makeErrorInfo;
    /**
     * @en Generate canceled error information. <br>
     *     The [[ErrorInfo]] object generated by this function has [[RESULT_CODE.CANCELED]] code.
     * @ja キャンセルエラー情報生成 <br>
     *     この関数で生成された [[ErrorInfo]] は [[RESULT_CODE.CANCELED]] を格納する
     *
     * @param tag
     *  - `en` Log tag information
     *  - `ja` 識別情報
     * @param cause
     *  - `en` low-level Error object
     *  - `ja` 下位のエラーを指定
     * @returns
     */
    function makeCanceledErrorInfo(tag, cause) {
        return makeErrorInfo(RESULT_CODE.CANCELED, tag, CANCELED_MESSAGE, cause);
    }
    CDP.makeCanceledErrorInfo = makeCanceledErrorInfo;
    /**
     * @es Judge the error is canceled.
     * @ja エラー情報がキャンセルされたものか判定
     *
     * @example <br>
     *
     * ```ts
     *  :
     *  .catch((reason: ErrorInfo) => {
     *      if (!isCanceledError(reason)) {
     *          handleErrorInfo(reason);
     *      }
     *   });
     *  :
     * ```
     *
     * @param error
     * @returns
     *  - `en` true: canceled error / false: others
     *  - `ja` true: キャンセル / false: その他エラー
     */
    function isCanceledError(error) {
        if ("string" === typeof error) {
            return CANCELED_MESSAGE === error;
        }
        else {
            var errorInfo = error;
            if (errorInfo) {
                if (RESULT_CODE.CANCELED === errorInfo.code || CANCELED_MESSAGE === errorInfo.message) {
                    return true;
                }
            }
        }
        return false;
    }
    CDP.isCanceledError = isCanceledError;
    /**
     * @es Convert from any type error information to [[ErrorInfo]] object.
     * @jp あらゆるエラー入力を [[ErrorInfo]] に変換
     */
    function ensureErrorInfo(cause) {
        var unknown = {
            name: UNKNOWN_ERROR_NAME + ERROR_NAME_SEPARATOR,
            code: RESULT_CODE.FAILED,
            message: "unknown error occured.",
        };
        var valid = function (error) {
            if (!error) {
                return false;
            }
            return ("number" === typeof error.code &&
                "string" === typeof error.name &&
                "string" === typeof error.message);
        };
        if (valid(cause)) {
            return cause;
        }
        else if (cause instanceof Error) {
            cause.code = RESULT_CODE.FAILED;
            return cause;
        }
        else if ("string" === typeof cause) {
            if (isCanceledError(cause)) {
                return makeCanceledErrorInfo();
            }
            else {
                return __assign({}, unknown, { message: cause });
            }
        }
        else if ("number" === typeof cause) {
            return __assign({}, unknown, {
                cause: {
                    name: UNKNOWN_ERROR_NAME + ERROR_NAME_SEPARATOR,
                    message: "Please check the error code.",
                    code: cause
                }
            });
        }
        else if ("object" === typeof cause) {
            return __assign({}, unknown, cause);
        }
        return unknown;
    }
    CDP.ensureErrorInfo = ensureErrorInfo;
    /**
     * @internal for CDP modules assignable range.
     */
    CDP._MODULE_RESULT_CODE_RANGE_CDP = 100;
    /**
     * @en Offset value enumeration for [[RESULT_CODE]]. <br>
     *     The client can expand a definition in other module.
     * @ja [[RESULT_CODE]] のオフセット値 <br>
     *     エラーコード対応するモジュール内で 定義を拡張する.
     *
     * @example <br>
     *
     * ```ts
     *  export enum RESULT_CODE {
     *      ERROR_SOMEMODULE_UNEXPECTED  = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.COMMON + 1, "error unexpected."),
     *      ERROR_SOMEMODULE_INVALID_ARG = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.COMMON + 2, "invalid arguments."),
     *  }
     *  ASSIGN_RESULT_CODE(RESULT_CODE);
     * ```
     */
    var RESULT_CODE_BASE;
    (function (RESULT_CODE_BASE) {
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_DECLARERATION"] = 0] = "CDP_DECLARERATION";
        //      MODULE_A = 1 * MODULE_RESULT_CODE_RANGE,    // ex) moduleA: abs(1001 ～ 1999)
        //      MODULE_B = 2 * MODULE_RESULT_CODE_RANGE,    // ex) moduleB: abs(2001 ～ 2999)
        //      MODULE_C = 3 * MODULE_RESULT_CODE_RANGE,    // ex) moduleC: abs(3001 ～ 3999)
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP"] = 1 * CDP._MODULE_RESULT_CODE_RANGE_CDP] = "CDP";
    })(RESULT_CODE_BASE = CDP.RESULT_CODE_BASE || (CDP.RESULT_CODE_BASE = {}));
    // "CDP" 以外の namespace で定義した場合は、ASSIGN ユーティリティをコールする.
    //  ASSIGN_RESULT_CODE_BASE(RESULT_CODE_BASE);
    /**
     * @en Generate success code.
     * @ja 成功コードを生成
     *
     * @param base
     * @param localCode
     * @param message
     */
    function DECLARE_SUCCESS_CODE(base, localCode, message) {
        if ("string" === typeof base) {
            base = CDP.RESULT_CODE_BASE[base];
        }
        return declareResultCode(base, localCode, message, true);
    }
    CDP.DECLARE_SUCCESS_CODE = DECLARE_SUCCESS_CODE;
    /**
     * @en Generate error code.
     * @ja エラーコード生成
     *
     * @param base
     * @param localCode
     * @param message
     */
    function DECLARE_ERROR_CODE(base, localCode, message) {
        if ("string" === typeof base) {
            base = CDP.RESULT_CODE_BASE[base];
        }
        return declareResultCode(base, localCode, message, false);
    }
    CDP.DECLARE_ERROR_CODE = DECLARE_ERROR_CODE;
    /**
     * @en Judge success or not.
     * @ja 成功判定
     *
     * @param code
     */
    function SUCCEEDED(code) {
        return 0 <= code;
    }
    CDP.SUCCEEDED = SUCCEEDED;
    /**
     * @en Judge error or not.
     * @ja 失敗判定
     *
     * @param code
     */
    function FAILED(code) {
        return code < 0;
    }
    CDP.FAILED = FAILED;
    /**
     * @en Assign declared [[RESULT_CODE_BASE]] to root enumeration.<br>
     *     (It's necessary also to merge enum in the module system environment.)
     * @ja 拡張した [[RESULT_CODE_BASE]] を ルート enum にアサイン<br>
     *     モジュールシステム環境においても、enum をマージするために必要
     */
    function ASSIGN_RESULT_CODE_BASE(resultCodeBase) {
        CDP.RESULT_CODE_BASE = __assign({}, CDP.RESULT_CODE_BASE, resultCodeBase);
    }
    CDP.ASSIGN_RESULT_CODE_BASE = ASSIGN_RESULT_CODE_BASE;
    /**
     * @en Assign declared [[ASSIGN_RESULT_CODE]] to root enumeration.
     *     (It's necessary also to merge enum in the module system environment.)
     * @ja 拡張した [[ASSIGN_RESULT_CODE]] を ルート enum にアサイン
     *     モジュールシステム環境においても、enum をマージするために必要
     */
    function ASSIGN_RESULT_CODE(resultCode) {
        CDP.RESULT_CODE = __assign({}, CDP.RESULT_CODE, resultCode);
    }
    CDP.ASSIGN_RESULT_CODE = ASSIGN_RESULT_CODE;
    ///////////////////////////////////////////////////////////////////////
    // module error declaration:
    var FUNCTION_CODE_RANGE = 10;
    // cdp.core 内のローカルコードオフセット値
    var LOCAL_CODE_BASE;
    (function (LOCAL_CODE_BASE) {
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["CORE"] = 0] = "CORE";
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["PATCH"] = 1 * FUNCTION_CODE_RANGE] = "PATCH";
    })(LOCAL_CODE_BASE || (LOCAL_CODE_BASE = {}));
    // @internal Error code definition of `cdp-core`.
    (function (RESULT_CODE) {
        RESULT_CODE[RESULT_CODE["ERROR_CDP_DECLARATION_CDP"] = 0] = "ERROR_CDP_DECLARATION_CDP";
        /** `en` [[CDP.initialize]]() failer code. <br> `ja` [[CDP.initialize]]() のエラーコード */
        RESULT_CODE[RESULT_CODE["ERROR_CDP_INITIALIZE_FAILED"] = DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP, LOCAL_CODE_BASE.CORE + 1, "initialized failed.")] = "ERROR_CDP_INITIALIZE_FAILED";
    })(RESULT_CODE = CDP.RESULT_CODE || (CDP.RESULT_CODE = {}));
    // "CDP" 以外の namespace で定義した場合は、ASSIGN ユーティリティをコールする.
    //  ASSIGN_RESULT_CODE_BASE(RESULT_CODE);
    ///////////////////////////////////////////////////////////////////////
    // private static methods:
    // RESULT_CODE の登録
    function declareResultCode(base, moduleCode, message, succeeded) {
        if (succeeded === void 0) { succeeded = false; }
        if (moduleCode <= 0 || CDP.MODULE_RESULT_CODE_RANGE <= moduleCode) {
            console.error("declareResultCode(), invalid localCode range. [localCode: " + moduleCode + "]");
            return;
        }
        var signed = succeeded ? 1 : -1;
        var resultCode = signed * (base + moduleCode);
        s_code2message[resultCode] = message ? message : ("[RESULT_CODE: " + resultCode + "]");
        return resultCode;
    }
    // RESULT_CODE から登録されているメッセージを取得
    function messageFromResultCode(resultCode) {
        if (s_code2message[resultCode]) {
            return s_code2message[resultCode];
        }
        else {
            return "unregistered result code. [RESULT_CODE: " + resultCode + "]";
        }
    }
    // RESULT_CODE から登録されている RESULT_CODE 文字列を取得
    function buildErrorName(resultCode, tag) {
        var prefix = tag || "";
        if (CDP.RESULT_CODE[resultCode]) {
            return prefix + CDP.RESULT_CODE[resultCode] + ERROR_NAME_SEPARATOR;
        }
        else {
            return prefix + UNKNOWN_ERROR_NAME + ERROR_NAME_SEPARATOR;
        }
    }
})(CDP || (CDP = {}));

return CDP; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvQ29yZS50cyIsImNkcDovLy9DRFAvUGF0Y2gudHMiLCJjZHA6Ly8vQ0RQL0Vycm9yRGVmcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0E0R1o7QUE1R0QsV0FBVSxHQUFHO0lBRVQsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDO0lBRXJCOzs7OztPQUtHO0lBQ1UsVUFBTSxHQUFRLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO0lBR3JEOzs7OztPQUtHO0lBQ1UsV0FBTyxHQUFXLENBQUM7UUFDNUIsRUFBRSxDQUFDLENBQUMsVUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxPQUFPLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFVBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsQ0FBQztZQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsQ0FBQztJQUNMLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFTDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BcUJHO0lBQ0gsZUFBc0IsSUFBWTtRQUM5QixJQUFNLElBQUksR0FBRyxXQUFPLElBQUksRUFBRSxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDdkIsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7SUFYZSxTQUFLLFFBV3BCO0lBRUQ7OztPQUdHO0lBQ1UsVUFBTSxHQUFRLEdBQUcsQ0FBQyxNQUFNLElBQUksVUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFZN0Q7Ozs7O09BS0c7SUFDSCxvQkFBMkIsT0FBeUI7UUFDaEQsVUFBVSxDQUFDO1lBQ1AsSUFBSSxDQUFDO2dCQUNELFNBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDZCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLENBQUMsT0FBTyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ25ELE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDdEIsQ0FBQztZQUNMLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQU0sS0FBSyxHQUFHLG1CQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JDLElBQU0sU0FBUyxHQUFHLGlCQUFhLENBQzNCLGVBQVcsQ0FBQywyQkFBMkIsRUFDdkMsR0FBRyxFQUNILEtBQUssQ0FBQyxPQUFPLEVBQ2IsS0FBSyxDQUNSLENBQUM7Z0JBQ0YsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDaEQsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFyQmUsY0FBVSxhQXFCekI7QUFDTCxDQUFDLEVBNUdTLEdBQUcsS0FBSCxHQUFHLFFBNEdaO0FDNUdELElBQVUsR0FBRyxDQStFWjtBQS9FRCxXQUFVLEdBQUc7SUFFVCxJQUFNLEdBQUcsR0FBVyxjQUFjLENBQUM7SUFFbkM7Ozs7O09BS0c7SUFDSDtRQUFBO1FBb0VBLENBQUM7UUFuRUcsdUVBQXVFO1FBQ3ZFLHlCQUF5QjtRQUV6Qjs7Ozs7V0FLRztRQUNXLFdBQUssR0FBbkI7WUFDSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDckIsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsMEJBQTBCO1FBRTFCLGtCQUFrQjtRQUNILGtCQUFZLEdBQTNCO1lBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLFVBQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLFVBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDekQsVUFBTSxDQUFDLE9BQU8sR0FBRztvQkFDYixLQUFLLEVBQXVCLGNBQTBCLENBQUM7b0JBQ3ZELFFBQVEsRUFBb0IsY0FBMEIsQ0FBQztvQkFDdkQsSUFBSSxFQUF3QixjQUEwQixDQUFDO29CQUN2RCxPQUFPLEVBQXFCLGNBQTBCLENBQUM7b0JBQ3ZELEtBQUssRUFBdUIsY0FBMEIsQ0FBQztvQkFDdkQsS0FBSyxFQUF1QixjQUEwQixDQUFDO29CQUN2RCxNQUFNLEVBQXNCLGNBQTBCLENBQUM7b0JBQ3ZELEtBQUssRUFBdUIsY0FBMEIsQ0FBQztvQkFDdkQsY0FBYyxFQUFjLGNBQTBCLENBQUM7b0JBQ3ZELE1BQU0sRUFBc0IsY0FBMEIsQ0FBQztvQkFDdkQsSUFBSSxFQUF3QixjQUEwQixDQUFDO29CQUN2RCxPQUFPLEVBQXFCLGNBQTBCLENBQUM7b0JBQ3ZELE1BQU0sRUFBc0IsY0FBMEIsQ0FBQztvQkFDdkQseUJBQXlCLEVBQUcsY0FBMEIsQ0FBQztvQkFDdkQsS0FBSyxFQUF1QixjQUEwQixDQUFDO29CQUN2RCxHQUFHLEVBQXlCLGNBQTBCLENBQUM7b0JBQ3ZELElBQUksRUFBd0IsY0FBMEIsQ0FBQztvQkFDdkQsS0FBSyxFQUF1QixjQUEwQixDQUFDO29CQUN2RCxHQUFHLEVBQXlCLGNBQTBCLENBQUM7b0JBQ3ZELFVBQVUsRUFBa0IsY0FBMEIsQ0FBQztpQkFDMUQsQ0FBQztZQUNOLENBQUM7UUFDTCxDQUFDO1FBRUQsZ0JBQWdCO1FBQ0QsZUFBUyxHQUF4QjtZQUNJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQU0sUUFBTSxHQUFRLEtBQUssQ0FBQztnQkFFMUIsSUFBTSxxQkFBbUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxJQUFTO29CQUM1QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ2xCLE1BQU0sQ0FBQyxRQUFNLENBQUMsdUJBQXVCLENBQUM7d0JBQ2xDLE1BQU0sQ0FBQyxxQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNoRCxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUM7Z0JBRUYsSUFBTSxzQkFBb0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztnQkFDekQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsVUFBVSxVQUFlLEVBQUUsZ0JBQXNCO29CQUMzRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ2xCLE1BQU0sQ0FBQyxRQUFNLENBQUMsdUJBQXVCLENBQUM7d0JBQ2xDLE1BQU0sQ0FBQyxzQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO29CQUN6RSxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUM7WUFDTixDQUFDO1FBQ0wsQ0FBQztRQUNMLFlBQUM7SUFBRCxDQUFDO0lBcEVZLFNBQUssUUFvRWpCO0FBQ0wsQ0FBQyxFQS9FUyxHQUFHLEtBQUgsR0FBRyxRQStFWjs7Ozs7Ozs7O0FDL0VELElBQVUsR0FBRyxDQWlXWjtBQWpXRCxXQUFVLEdBQUc7SUFFVCxJQUFNLGtCQUFrQixHQUFNLGVBQWUsQ0FBQztJQUM5QyxJQUFNLG9CQUFvQixHQUFJLElBQUksQ0FBQztJQUNuQyxJQUFNLGdCQUFnQixHQUFRLE9BQU8sQ0FBQztJQUN0QyxJQUFNLGNBQWMsR0FBcUM7UUFDckQsR0FBRyxFQUFFLHNCQUFzQjtRQUMzQixHQUFHLEVBQUUscUJBQXFCO1FBQzFCLElBQUksRUFBRSxtQkFBbUI7S0FDNUIsQ0FBQztJQUVGLHVFQUF1RTtJQUN2RSxtQkFBbUI7SUFFbkI7OztPQUdHO0lBQ0gsSUFBWSxXQU9YO0lBUEQsV0FBWSxXQUFXO1FBQ25CLHlEQUF5RDtRQUN6RCx1REFBZTtRQUNmLHNEQUFzRDtRQUN0RCxxREFBZTtRQUNmLHdEQUF3RDtRQUN4RCxrREFBZ0I7SUFDcEIsQ0FBQyxFQVBXLFdBQVcsR0FBWCxlQUFXLEtBQVgsZUFBVyxRQU90QjtJQW1CRDs7O09BR0c7SUFDVSw0QkFBd0IsR0FBRyxJQUFJLENBQUM7SUFFN0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQ0c7SUFDSCx1QkFBOEIsVUFBa0IsRUFBRSxHQUFZLEVBQUUsT0FBZ0IsRUFBRSxLQUFhO1FBQzNGLElBQU0sUUFBUSxHQUFHLENBQUMsS0FBSyxJQUFJLGdCQUFnQixLQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7UUFDOUUsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ2xELElBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQzFELElBQU0sU0FBUyxHQUFjLElBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzNFLFNBQVMsQ0FBQyxJQUFJLEdBQUksY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QyxTQUFTLENBQUMsSUFBSSxHQUFJLElBQUksQ0FBQztRQUN2QixTQUFTLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN4QixNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFUZSxpQkFBYSxnQkFTNUI7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0gsK0JBQXNDLEdBQVksRUFBRSxLQUFhO1FBQzdELE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUZlLHlCQUFxQix3QkFFcEM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FvQkc7SUFDSCx5QkFBZ0MsS0FBcUI7UUFDakQsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsZ0JBQWdCLEtBQUssS0FBSyxDQUFDO1FBQ3RDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQU0sU0FBUyxHQUFjLEtBQUssQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNaLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLElBQUksSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDcEYsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBWmUsbUJBQWUsa0JBWTlCO0lBRUQ7OztPQUdHO0lBQ0gseUJBQWdDLEtBQVc7UUFDdkMsSUFBTSxPQUFPLEdBQWM7WUFDdkIsSUFBSSxFQUFFLGtCQUFrQixHQUFHLG9CQUFvQjtZQUMvQyxJQUFJLEVBQUUsV0FBVyxDQUFDLE1BQU07WUFDeEIsT0FBTyxFQUFFLHdCQUF3QjtTQUNwQyxDQUFDO1FBQ0YsSUFBTSxLQUFLLEdBQUcsVUFBQyxLQUFXO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FDSCxRQUFRLEtBQUssT0FBTyxLQUFLLENBQUMsSUFBSTtnQkFDOUIsUUFBUSxLQUFLLE9BQU8sS0FBSyxDQUFDLElBQUk7Z0JBQzlCLFFBQVEsS0FBSyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQ3BDLENBQUM7UUFDTixDQUFDLENBQUM7UUFFRixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEtBQU0sQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUM3QyxNQUFNLENBQVksS0FBSyxDQUFDO1FBQzVCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUNuQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxjQUFNLE9BQU8sRUFBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRztZQUNqRCxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sY0FDQyxPQUFPLEVBQ0Y7Z0JBQ0osS0FBSyxFQUFFO29CQUNILElBQUksRUFBRSxrQkFBa0IsR0FBRyxvQkFBb0I7b0JBQy9DLE9BQU8sRUFBRSw4QkFBOEI7b0JBQ3ZDLElBQUksRUFBRSxLQUFLO2lCQUNkO2FBQ0osRUFDSDtRQUNOLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLGNBQU0sT0FBTyxFQUFLLEtBQUssRUFBRztRQUNwQyxDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBNUNlLG1CQUFlLGtCQTRDOUI7SUFFRDs7T0FFRztJQUNVLGlDQUE2QixHQUFHLEdBQUcsQ0FBQztJQUVqRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSCxJQUFZLGdCQU1YO0lBTkQsV0FBWSxnQkFBZ0I7UUFDeEIsaUZBQXFCO1FBQzdCLG9GQUFvRjtRQUNwRixvRkFBb0Y7UUFDcEYsb0ZBQW9GO1FBQzVFLDJDQUFNLENBQUMsR0FBRyxpQ0FBNkI7SUFDM0MsQ0FBQyxFQU5XLGdCQUFnQixHQUFoQixvQkFBZ0IsS0FBaEIsb0JBQWdCLFFBTTNCO0lBQ0QscURBQXFEO0lBQ3pELDhDQUE4QztJQUUxQzs7Ozs7OztPQU9HO0lBQ0gsOEJBQXFDLElBQXFCLEVBQUUsU0FBaUIsRUFBRSxPQUFnQjtRQUMzRixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBbUIsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUxlLHdCQUFvQix1QkFLbkM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsNEJBQW1DLElBQXFCLEVBQUUsU0FBaUIsRUFBRSxPQUFnQjtRQUN6RixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBbUIsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUxlLHNCQUFrQixxQkFLakM7SUFFRDs7Ozs7T0FLRztJQUNILG1CQUEwQixJQUFZO1FBQ2xDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFGZSxhQUFTLFlBRXhCO0lBRUQ7Ozs7O09BS0c7SUFDSCxnQkFBdUIsSUFBWTtRQUMvQixNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRmUsVUFBTSxTQUVyQjtJQUVEOzs7OztPQUtHO0lBQ0gsaUNBQXdDLGNBQXNCO1FBQzFELEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxhQUFVLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBSyxjQUFjLENBQUUsQ0FBQztJQUMvRSxDQUFDO0lBRmUsMkJBQXVCLDBCQUV0QztJQUVEOzs7OztPQUtHO0lBQ0gsNEJBQW1DLFVBQWtCO1FBQ2pELEdBQUcsQ0FBQyxXQUFXLEdBQUcsYUFBVSxHQUFHLENBQUMsV0FBVyxFQUFLLFVBQVUsQ0FBRSxDQUFDO0lBQ2pFLENBQUM7SUFGZSxzQkFBa0IscUJBRWpDO0lBRUQsdUVBQXVFO0lBQ3ZFLDRCQUE0QjtJQUU1QixJQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztJQUUvQiwyQkFBMkI7SUFDM0IsSUFBSyxlQUdKO0lBSEQsV0FBSyxlQUFlO1FBQ2hCLHFEQUFXO1FBQ1gsMkNBQVUsQ0FBQyxHQUFHLG1CQUFtQjtJQUNyQyxDQUFDLEVBSEksZUFBZSxLQUFmLGVBQWUsUUFHbkI7SUFFRCxpREFBaUQ7SUFDakQsV0FBWSxXQUFXO1FBQ25CLHVGQUE2QjtRQUM3QixvRkFBb0Y7UUFDcEYseURBQThCLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxxQkFBcUIsQ0FBQztJQUMzSCxDQUFDLEVBSlcsV0FBVyxHQUFYLGVBQVcsS0FBWCxlQUFXLFFBSXRCO0lBQ0QscURBQXFEO0lBQ3pELHlDQUF5QztJQUVyQyx1RUFBdUU7SUFDdkUsMEJBQTBCO0lBRTFCLGtCQUFrQjtJQUNsQiwyQkFBMkIsSUFBc0IsRUFBRSxVQUFrQixFQUFFLE9BQWdCLEVBQUUsU0FBMEI7UUFBMUIsNkNBQTBCO1FBQy9HLEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksNEJBQXdCLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztZQUM1RCxPQUFPLENBQUMsS0FBSyxDQUFDLCtEQUE2RCxVQUFVLE1BQUcsQ0FBQyxDQUFDO1lBQzFGLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFDRCxJQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsSUFBTSxVQUFVLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxDQUFDO1FBQ2hELGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBaUIsVUFBVSxNQUFHLENBQUMsQ0FBQztRQUNsRixNQUFNLENBQUMsVUFBVSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxnQ0FBZ0M7SUFDaEMsK0JBQStCLFVBQWtCO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUN0QyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsNkNBQTJDLFVBQVUsTUFBRyxDQUFDO1FBQ3BFLENBQUM7SUFDTCxDQUFDO0lBRUQsMkNBQTJDO0lBQzNDLHdCQUF3QixVQUFrQixFQUFFLEdBQVc7UUFDbkQsSUFBTSxNQUFNLEdBQUcsR0FBRyxJQUFJLEVBQUUsQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEdBQUcsb0JBQW9CLENBQUM7UUFDdkUsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQztRQUM5RCxDQUFDO0lBQ0wsQ0FBQztBQUNMLENBQUMsRUFqV1MsR0FBRyxLQUFILEdBQUcsUUFpV1oiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgQ0RQIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFBdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEFjY2Vzc29yIGZvciBzeXN0ZW0gZ2xvYmFsIG9iamVjdC48YnI+XHJcbiAgICAgKiAgICAgSXQnbGwgYmUgdXN1YWxseSBhIGB3aW5kb3dgIG9iamVjdC5cclxuICAgICAqIEBqYSDjgrfjgrnjg4bjg6Djga4gZ2xvYmFsIOOCquODluOCuOOCp+OCr+ODiOOBuOOBruOCouOCr+OCu+OCuTxicj5cclxuICAgICAqICAgICDpgJrluLjjga8gYHdpbmRvd2Ag44Kq44OW44K444Kn44Kv44OI44Go44Gq44KLXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBnbG9iYWw6IGFueSA9IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWNjc2Vzc29yIGZvciBXZWIgcm9vdCBsb2NhdGlvbiA8YnI+XHJcbiAgICAgKiAgICAgT25seSB0aGUgYnJvd3NlciBlbnZpcm9ubWVudCB3aWxsIGJlIGFuIGFsbG9jYXRpbmcgcGxhY2UgaW4gaW5kZXguaHRtbCwgYW5kIGJlY29tZXMgZWZmZWN0aXZlLlxyXG4gICAgICogQGphIFdlYiByb290IGxvY2F0aW9uIOOBuOOBruOCouOCr+OCu+OCuSA8YnI+XHJcbiAgICAgKiAgICAgaW5kZXguaHRtbCDjga7phY3nva7loLTmiYDjgajjgarjgorjgIHjg5bjg6njgqbjgrbnkrDlooPjga7jgb/mnInlirnjgajjgarjgosuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCB3ZWJSb290OiBzdHJpbmcgPSAoKCkgPT4ge1xyXG4gICAgICAgIGlmIChnbG9iYWwubG9jYXRpb24pIHtcclxuICAgICAgICAgICAgbGV0IGJhc2VVcmwgPSAvKC4rXFwvKVteL10qI1teL10rLy5leGVjKGdsb2JhbC5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgaWYgKCFiYXNlVXJsKSB7XHJcbiAgICAgICAgICAgICAgICBiYXNlVXJsID0gLyguK1xcLykvLmV4ZWMoZ2xvYmFsLmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBiYXNlVXJsWzFdO1xyXG4gICAgICAgIH1cclxuICAgIH0pKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ29udmVydGVyIGZyb20gcmVsYXRpdmUgcGF0aCB0byBhYnNvbHV0ZSB1cmwgc3RyaW5nLiA8YnI+XHJcbiAgICAgKiAgICAgSWYgeW91IHdhbnQgdG8gYWNjZXNzIHRvIEFzc2V0cyBhbmQgaW4gc3BpdGUgb2YgdGhlIHNjcmlwdCBsb2NhdGlvbiwgdGhlIGZ1bmN0aW9uIGlzIGF2YWlsYWJsZS5cclxuICAgICAqIEBqYSDnm7jlr74gcGF0aCDjgpLntbblr74gVVJMIOOBq+WkieaPmyA8YnI+XHJcbiAgICAgKiAgICAganMg44Gu6YWN572u44Gr5L6d5a2Y44GZ44KL44GT44Go44Gq44GPIGBhc3NldHNgIOOCouOCr+OCu+OCueOBl+OBn+OBhOOBqOOBjeOBq+S9v+eUqOOBmeOCiy5cclxuICAgICAqXHJcbiAgICAgKiBAc2VlIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzIxODgyMTgvcmVsYXRpdmUtcGF0aHMtaW4tamF2YXNjcmlwdC1pbi1hbi1leHRlcm5hbC1maWxlXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGUgPGJyPlxyXG4gICAgICpcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiAgY29uc29sZS5sb2codG9VcmwoXCIvcmVzL2RhdGEvY29sbGVjdGlvbi5qc29uXCIpKTtcclxuICAgICAqICAvLyBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hcHAvcmVzL2RhdGEvY29sbGVjdGlvbi5qc29uXCJcclxuICAgICAqIGBgYFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwYXRoXHJcbiAgICAgKiAgLSBgZW5gIHNldCByZWxhdGl2ZSBwYXRoIGZyb20gW1t3ZWJSb290XV0uXHJcbiAgICAgKiAgLSBgamFgIFtbd2ViUm9vdF1dIOOBi+OCieOBruebuOWvvuODkeOCueOCkuaMh+WumlxyXG4gICAgICogQHJldHVybnMgdXJsIHN0cmluZ1xyXG4gICAgICogIC0gYGVuYCBzZXQgcmVsYXRpdmUgcGF0aCBmcm9tIFtbd2ViUm9vdF1dLlxyXG4gICAgICogIC0gYGphYCBbW3dlYlJvb3RdXSDjgYvjgonjga7nm7jlr77jg5HjgrnjgpLmjIflrppcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHRvVXJsKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3Qgcm9vdCA9IHdlYlJvb3QgfHwgXCJcIjtcclxuICAgICAgICBpZiAobnVsbCAhPSBwYXRoICYmIG51bGwgIT0gcGF0aFswXSkge1xyXG4gICAgICAgICAgICBpZiAoXCIvXCIgPT09IHBhdGhbMF0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByb290ICsgcGF0aC5zbGljZSgxKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiByb290ICsgcGF0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiByb290O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBY2Nlc3NvciBmb3IgZ2xvYmFsIENvbmZpZyBvYmplY3QuXHJcbiAgICAgKiBAamEgQ29uZmlnIOOCquODluOCuOOCp+OCr+ODiOOBuOOBruOCouOCr+OCu+OCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgQ29uZmlnOiBhbnkgPSBDRFAuQ29uZmlnIHx8IGdsb2JhbC5Db25maWcgfHwge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gT3B0aW9ucyBpbnRlcmZhY2UgZm9yIHRoaXMgbW9kdWxlIGluaXRpYWxpemUuXHJcbiAgICAgKiBAamEg5Yid5pyf5YyW44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQ29yZUluaXRPcHRpb25zIHtcclxuICAgICAgICBzdWNjZXNzPzogKCkgPT4gdm9pZDtcclxuICAgICAgICBmYWlsPzogKGVycm9yPzogYW55KSA9PiB2b2lkO1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbml0aWFsaXplIGZ1bmN0aW9uIGZvciBgY2RwLWNvcmVgLiA8YnI+XHJcbiAgICAgKiAgICAgVGhpcyBmdW5jdGlvbiBhcHBsaWVzIHBhdGNoIHRvIHRoZSBydW4gdGltZSBlbnZpcm9ubWVudC5cclxuICAgICAqIEBqYSBgY2RwLWNvcmVgIOOBruWIneacn+WMlumWouaVsDxicj5cclxuICAgICAqICAgICDnkrDlooPjga7lt67liIbjgpLlkLjlj47jgZnjgosgcGF0Y2gg44KS6YGp55So44GZ44KLLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZShvcHRpb25zPzogQ29yZUluaXRPcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBQYXRjaC5hcHBseSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuc3VjY2VzcyA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5zdWNjZXNzKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYXVzZSA9IGVuc3VyZUVycm9ySW5mbyhlcnJvcik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlcnJvckluZm8gPSBtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9JTklUSUFMSVpFX0ZBSUxFRCxcclxuICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgY2F1c2UubWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgICBjYXVzZVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3JJbmZvLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMuZmFpbCA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy5mYWlsKGVycm9ySW5mbyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCJjZHAuY29yZVwiIHtcclxuICAgIGV4cG9ydCA9IENEUDtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQIHtcclxuXHJcbiAgICBjb25zdCBUQUc6IHN0cmluZyA9IFwiW0NEUC5QYXRjaF0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVXRpbGl0eSBjbGFzcyBmb3IgYXBwbGluZyB0aGUgcGF0Y2ggdG8gdGhlIHJ1biB0aW1lIGVudmlyb25tZW50LlxyXG4gICAgICogQGphIOWun+ihjOeSsOWig+eUqCBQYXRjaCDpgannlKjjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqXHJcbiAgICAgKiBAaW50ZXJuYWxcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhdGNoIHtcclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kczpcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGVuIEFwcGx5IHRoZSBwYXRjaFxyXG4gICAgICAgICAqIEBqYSDjg5Hjg4Pjg4Hjga7pgannlKhcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBpbnRlcm5hbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYXBwbHkoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIFBhdGNoLmNvbnNvbGVQYXRjaCgpO1xyXG4gICAgICAgICAgICBQYXRjaC5ub2RlUGF0Y2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBzdGF0aWMgbWV0aG9kczpcclxuXHJcbiAgICAgICAgLy8gY29uc29sZSDnlKggcGF0Y2hcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBjb25zb2xlUGF0Y2goKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IGdsb2JhbC5jb25zb2xlIHx8IG51bGwgPT0gZ2xvYmFsLmNvbnNvbGUuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGdsb2JhbC5jb25zb2xlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvdW50OiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBFbmQ6ICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWVFbmQ6ICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhY2U6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBncm91cDogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcnhtbDogICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGVidWc6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBncm91cENvbGxhcHNlZDogICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdDogICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgaW5mbzogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBwcm9maWxlOiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGFzc2VydDogICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbXNJc0luZGVwZW5kZW50bHlDb21wb3NlZDogIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBjbGVhcjogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcjogICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgd2FybjogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGxvZzogICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZmlsZUVuZDogICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gV2luUlQg55SoIHBhdGNoXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgbm9kZVBhdGNoKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoXCJvYmplY3RcIiA9PT0gdHlwZW9mIE1TQXBwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBfTVNBcHA6IGFueSA9IE1TQXBwO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsQXBwZW5kQ2hpbGQgPSBOb2RlLnByb3RvdHlwZS5hcHBlbmRDaGlsZDtcclxuICAgICAgICAgICAgICAgIE5vZGUucHJvdG90eXBlLmFwcGVuZENoaWxkID0gZnVuY3Rpb24gKG5vZGU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfTVNBcHAuZXhlY1Vuc2FmZUxvY2FsRnVuY3Rpb24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxBcHBlbmRDaGlsZC5jYWxsKHNlbGYsIG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbEluc2VydEJlZm9yZSA9IE5vZGUucHJvdG90eXBlLmluc2VydEJlZm9yZTtcclxuICAgICAgICAgICAgICAgIE5vZGUucHJvdG90eXBlLmluc2VydEJlZm9yZSA9IGZ1bmN0aW9uIChuZXdFbGVtZW50OiBhbnksIHJlZmVyZW5jZUVsZW1lbnQ6IE5vZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX01TQXBwLmV4ZWNVbnNhZmVMb2NhbEZ1bmN0aW9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsSW5zZXJ0QmVmb3JlLmNhbGwoc2VsZiwgbmV3RWxlbWVudCwgcmVmZXJlbmNlRWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAge1xyXG5cclxuICAgIGNvbnN0IFVOS05PV05fRVJST1JfTkFNRSAgICA9IFwiVW5rbm93biBFcnJvclwiO1xyXG4gICAgY29uc3QgRVJST1JfTkFNRV9TRVBBUkFUT1IgID0gXCI6IFwiO1xyXG4gICAgY29uc3QgQ0FOQ0VMRURfTUVTU0FHRSAgICAgID0gXCJhYm9ydFwiO1xyXG4gICAgY29uc3Qgc19jb2RlMm1lc3NhZ2U6IHsgW3Jlc3VsdENvZGU6IHN0cmluZ106IHN0cmluZyB9ID0ge1xyXG4gICAgICAgIFwiMFwiOiBcIm9wZXJhdGlvbiBzdWNjZWVkZWQuXCIsXHJcbiAgICAgICAgXCIxXCI6IFwib3BlcmF0aW9uIGNhbmNlbGVkLlwiLFxyXG4gICAgICAgIFwiLTFcIjogXCJvcGVyYXRpb24gZmFpbGVkLlwiXHJcbiAgICB9O1xyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBlcnJvciB1dGlsaXRpZXM6XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ29tbW9uIGVycm9yIGNvZGUgZm9yIHRoZSBhcHBsaWNhdGlvbi5cclxuICAgICAqIEBqYSDjgqLjg5fjg6rjgrHjg7zjgrfjg6fjg7PlhajkvZPjgafkvb/nlKjjgZnjgovlhbHpgJrjgqjjg6njg7zjgrPjg7zjg4nlrprnvqlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREUge1xyXG4gICAgICAgIC8qKiBgZW5gIGdlbmVyYWwgc3VjY2VzcyBjb2RlIDxicj4gYGphYCDmsY7nlKjmiJDlip/jgrPjg7zjg4kgICAgICAgICovXHJcbiAgICAgICAgU1VDQ0VFREVEICAgPSAwLFxyXG4gICAgICAgIC8qKiBgZW5gIGdlbmVyYWwgY2FuY2VsIGNvZGUgIDxicj4gYGphYCDmsY7nlKjjgq3jg6Pjg7Pjgrvjg6vjgrPjg7zjg4kgICovXHJcbiAgICAgICAgQ0FOQ0VMRUQgICAgPSAxLFxyXG4gICAgICAgIC8qKiBgZW5gIGdlbmVyYWwgZXJyb3IgY29kZSAgIDxicj4gYGphYCDmsY7nlKjjgqjjg6njg7zjgrPjg7zjg4kgICAgICAqL1xyXG4gICAgICAgIEZBSUxFRCAgICAgID0gLTEsXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRXJyb3IgY29tbXVuaWNhdGlvbiBvYmplY3QuXHJcbiAgICAgKiBAamEg44Ko44Op44O85Lyd6YGU44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRXJyb3JJbmZvIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBUaGUgbnVtZXJpY2FsIHZhbHVlIHRoYXQgaXMgZGVmaW5lZCB0aGUgYXBwbGljYXRpb24gLyBpbnRlcm5hbCBsaWJyYXJpZXMuXHJcbiAgICAgICAgICogQGphIOOCouODl+ODquOCseODvOOCt+ODp+ODsy/jg6njgqTjg5bjg6njg6rjgaflrprnvqnjgZnjgovmlbDlgKTlnovjgrPjg7zjg4njgpLmoLzntI1cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb2RlOiBSRVNVTFRfQ09ERTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gU3RvY2sgbG93LWxldmVsIGVycm9yIGluZm9ybWF0aW9uLlxyXG4gICAgICAgICAqIEBqYSDkuIvkvY3jga7jgqjjg6njg7zmg4XloLHjgpLmoLzntI1cclxuICAgICAgICAgKi9cclxuICAgICAgICBjYXVzZT86IEVycm9yO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBhc3NpZ25hYmxlIHJhbmdlIGZvciB0aGUgY2xpZW50J3MgbG9jYWwgcmVzdWx0IGNvcmQgYnkgd2hpY2ggZXhwYW5zaW9uIGlzIHBvc3NpYmxlLlxyXG4gICAgICogQGphIOOCr+ODqeOCpOOCouODs+ODiOOBjOaLoeW8teWPr+iDveOBquODreODvOOCq+ODq+ODquOCtuODq+ODiOOCs+ODvOODieOBruOCouOCteOCpOODs+WPr+iDvemgmOWfn1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgTU9EVUxFX1JFU1VMVF9DT0RFX1JBTkdFID0gMTAwMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZW5lcmF0ZSB0aGUgW1tFcnJvckluZm9dXSBvYmplY3QuXHJcbiAgICAgKiBAamEgW1tFcnJvckluZm9dXSDjgqrjg5bjgrjjgqfjgq/jg4jjgpLnlJ/miJBcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZSA8YnI+XHJcbiAgICAgKlxyXG4gICAgICogYGBgdHNcclxuICAgICAqICBzb21lQXN5bmNGdW5jKClcclxuICAgICAqICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICogICAgICAgICAgb3V0cHV0TWVzc2FnZShyZXN1bHQpO1xyXG4gICAgICogICAgICB9KVxyXG4gICAgICogICAgICAuY2F0Y2goKHJlYXNvbjogRXJyb3IpID0+IHtcclxuICAgICAqICAgICAgICAgIHRocm93IG1ha2VFcnJvckluZm8oXHJcbiAgICAgKiAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRkFJTEVELFxyXG4gICAgICogICAgICAgICAgICAgIFRBRyxcclxuICAgICAqICAgICAgICAgICAgICBcImVycm9yIG9jY3VyLlwiLFxyXG4gICAgICogICAgICAgICAgICAgIHJlYXNvbiAgLy8gc2V0IHJlY2VpdmVkIGVycm9yIGluZm8uXHJcbiAgICAgKiAgICAgICAgICApO1xyXG4gICAgICogICAgICB9KTtcclxuICAgICAqIGBgYFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByZXN1bHRDb2RlXHJcbiAgICAgKiAgLSBgZW5gIHNldCBbW1JFU1VMVF9DT0RFXV0gZGVmaW5lZC5cclxuICAgICAqICAtIGBqYWAg5a6a576p44GX44GfIFtbUkVTVUxUX0NPREVdXSDjgpLmjIflrppcclxuICAgICAqIEBwYXJhbSB0YWdcclxuICAgICAqICAtIGBlbmAgTG9nIHRhZyBpbmZvcm1hdGlvblxyXG4gICAgICogIC0gYGphYCDorZjliKXmg4XloLFcclxuICAgICAqIEBwYXJhbSBtZXNzYWdlXHJcbiAgICAgKiAgLSBgZW5gIEh1bWFuIHJlYWRhYmxlIG1lc3NhZ2VcclxuICAgICAqICAtIGBqYWAg44Oh44OD44K744O844K444KS5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gY2F1c2VcclxuICAgICAqICAtIGBlbmAgbG93LWxldmVsIEVycm9yIG9iamVjdFxyXG4gICAgICogIC0gYGphYCDkuIvkvY3jga7jgqjjg6njg7zjgpLmjIflrppcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBtYWtlRXJyb3JJbmZvKHJlc3VsdENvZGU6IG51bWJlciwgdGFnPzogc3RyaW5nLCBtZXNzYWdlPzogc3RyaW5nLCBjYXVzZT86IEVycm9yKTogRXJyb3JJbmZvIHtcclxuICAgICAgICBjb25zdCBjYW5jZWxlZCA9IChjYXVzZSAmJiBDQU5DRUxFRF9NRVNTQUdFID09PSBjYXVzZS5tZXNzYWdlKSA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICBjb25zdCBtc2cgPSBjYW5jZWxlZCA/IENBTkNFTEVEX01FU1NBR0UgOiBtZXNzYWdlO1xyXG4gICAgICAgIGNvbnN0IGNvZGUgPSBjYW5jZWxlZCA/IFJFU1VMVF9DT0RFLkNBTkNFTEVEIDogcmVzdWx0Q29kZTtcclxuICAgICAgICBjb25zdCBlcnJvckluZm8gPSA8RXJyb3JJbmZvPm5ldyBFcnJvcihtc2cgfHwgbWVzc2FnZUZyb21SZXN1bHRDb2RlKGNvZGUpKTtcclxuICAgICAgICBlcnJvckluZm8ubmFtZSAgPSBidWlsZEVycm9yTmFtZShjb2RlLCB0YWcpO1xyXG4gICAgICAgIGVycm9ySW5mby5jb2RlICA9IGNvZGU7XHJcbiAgICAgICAgZXJyb3JJbmZvLmNhdXNlID0gY2F1c2U7XHJcbiAgICAgICAgcmV0dXJuIGVycm9ySW5mbztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZW5lcmF0ZSBjYW5jZWxlZCBlcnJvciBpbmZvcm1hdGlvbi4gPGJyPlxyXG4gICAgICogICAgIFRoZSBbW0Vycm9ySW5mb11dIG9iamVjdCBnZW5lcmF0ZWQgYnkgdGhpcyBmdW5jdGlvbiBoYXMgW1tSRVNVTFRfQ09ERS5DQU5DRUxFRF1dIGNvZGUuXHJcbiAgICAgKiBAamEg44Kt44Oj44Oz44K744Or44Ko44Op44O85oOF5aCx55Sf5oiQIDxicj5cclxuICAgICAqICAgICDjgZPjga7plqLmlbDjgafnlJ/miJDjgZXjgozjgZ8gW1tFcnJvckluZm9dXSDjga8gW1tSRVNVTFRfQ09ERS5DQU5DRUxFRF1dIOOCkuagvOe0jeOBmeOCi1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0YWdcclxuICAgICAqICAtIGBlbmAgTG9nIHRhZyBpbmZvcm1hdGlvblxyXG4gICAgICogIC0gYGphYCDorZjliKXmg4XloLFcclxuICAgICAqIEBwYXJhbSBjYXVzZVxyXG4gICAgICogIC0gYGVuYCBsb3ctbGV2ZWwgRXJyb3Igb2JqZWN0XHJcbiAgICAgKiAgLSBgamFgIOS4i+S9jeOBruOCqOODqeODvOOCkuaMh+WumlxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1ha2VDYW5jZWxlZEVycm9ySW5mbyh0YWc/OiBzdHJpbmcsIGNhdXNlPzogRXJyb3IpOiBFcnJvckluZm8ge1xyXG4gICAgICAgIHJldHVybiBtYWtlRXJyb3JJbmZvKFJFU1VMVF9DT0RFLkNBTkNFTEVELCB0YWcsIENBTkNFTEVEX01FU1NBR0UsIGNhdXNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlcyBKdWRnZSB0aGUgZXJyb3IgaXMgY2FuY2VsZWQuXHJcbiAgICAgKiBAamEg44Ko44Op44O85oOF5aCx44GM44Kt44Oj44Oz44K744Or44GV44KM44Gf44KC44Gu44GL5Yik5a6aXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGUgPGJyPlxyXG4gICAgICpcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiAgOlxyXG4gICAgICogIC5jYXRjaCgocmVhc29uOiBFcnJvckluZm8pID0+IHtcclxuICAgICAqICAgICAgaWYgKCFpc0NhbmNlbGVkRXJyb3IocmVhc29uKSkge1xyXG4gICAgICogICAgICAgICAgaGFuZGxlRXJyb3JJbmZvKHJlYXNvbik7XHJcbiAgICAgKiAgICAgIH1cclxuICAgICAqICAgfSk7XHJcbiAgICAgKiAgOlxyXG4gICAgICogYGBgXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGVycm9yXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICogIC0gYGVuYCB0cnVlOiBjYW5jZWxlZCBlcnJvciAvIGZhbHNlOiBvdGhlcnNcclxuICAgICAqICAtIGBqYWAgdHJ1ZTog44Kt44Oj44Oz44K744OrIC8gZmFsc2U6IOOBneOBruS7luOCqOODqeODvFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaXNDYW5jZWxlZEVycm9yKGVycm9yOiBFcnJvciB8IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmIChcInN0cmluZ1wiID09PSB0eXBlb2YgZXJyb3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIENBTkNFTEVEX01FU1NBR0UgPT09IGVycm9yO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVycm9ySW5mbyA9IDxFcnJvckluZm8+ZXJyb3I7XHJcbiAgICAgICAgICAgIGlmIChlcnJvckluZm8pIHtcclxuICAgICAgICAgICAgICAgIGlmIChSRVNVTFRfQ09ERS5DQU5DRUxFRCA9PT0gZXJyb3JJbmZvLmNvZGUgfHwgQ0FOQ0VMRURfTUVTU0FHRSA9PT0gZXJyb3JJbmZvLm1lc3NhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZXMgQ29udmVydCBmcm9tIGFueSB0eXBlIGVycm9yIGluZm9ybWF0aW9uIHRvIFtbRXJyb3JJbmZvXV0gb2JqZWN0LlxyXG4gICAgICogQGpwIOOBguOCieOChuOCi+OCqOODqeODvOWFpeWKm+OCkiBbW0Vycm9ySW5mb11dIOOBq+WkieaPm1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZW5zdXJlRXJyb3JJbmZvKGNhdXNlPzogYW55KTogRXJyb3JJbmZvIHtcclxuICAgICAgICBjb25zdCB1bmtub3duOiBFcnJvckluZm8gPSB7XHJcbiAgICAgICAgICAgIG5hbWU6IFVOS05PV05fRVJST1JfTkFNRSArIEVSUk9SX05BTUVfU0VQQVJBVE9SLFxyXG4gICAgICAgICAgICBjb2RlOiBSRVNVTFRfQ09ERS5GQUlMRUQsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwidW5rbm93biBlcnJvciBvY2N1cmVkLlwiLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgY29uc3QgdmFsaWQgPSAoZXJyb3I/OiBhbnkpOiBib29sZWFuID0+IHtcclxuICAgICAgICAgICAgaWYgKCFlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICBcIm51bWJlclwiID09PSB0eXBlb2YgZXJyb3IuY29kZSAmJlxyXG4gICAgICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGVycm9yLm5hbWUgJiZcclxuICAgICAgICAgICAgICAgIFwic3RyaW5nXCIgPT09IHR5cGVvZiBlcnJvci5tZXNzYWdlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKHZhbGlkKGNhdXNlKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gY2F1c2U7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjYXVzZSBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgICAgICAgICg8RXJyb3JJbmZvPmNhdXNlKS5jb2RlID0gUkVTVUxUX0NPREUuRkFJTEVEO1xyXG4gICAgICAgICAgICByZXR1cm4gPEVycm9ySW5mbz5jYXVzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBjYXVzZSkge1xyXG4gICAgICAgICAgICBpZiAoaXNDYW5jZWxlZEVycm9yKGNhdXNlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1ha2VDYW5jZWxlZEVycm9ySW5mbygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgLi4udW5rbm93biwgLi4ueyBtZXNzYWdlOiBjYXVzZSB9IH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKFwibnVtYmVyXCIgPT09IHR5cGVvZiBjYXVzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgLi4udW5rbm93bixcclxuICAgICAgICAgICAgICAgIC4uLjxhbnk+e1xyXG4gICAgICAgICAgICAgICAgICAgIGNhdXNlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IFVOS05PV05fRVJST1JfTkFNRSArIEVSUk9SX05BTUVfU0VQQVJBVE9SLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlBsZWFzZSBjaGVjayB0aGUgZXJyb3IgY29kZS5cIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29kZTogY2F1c2VcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSBlbHNlIGlmIChcIm9iamVjdFwiID09PSB0eXBlb2YgY2F1c2UpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4udW5rbm93biwgLi4uY2F1c2UgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB1bmtub3duO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVybmFsIGZvciBDRFAgbW9kdWxlcyBhc3NpZ25hYmxlIHJhbmdlLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgX01PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRV9DRFAgPSAxMDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gT2Zmc2V0IHZhbHVlIGVudW1lcmF0aW9uIGZvciBbW1JFU1VMVF9DT0RFXV0uIDxicj5cclxuICAgICAqICAgICBUaGUgY2xpZW50IGNhbiBleHBhbmQgYSBkZWZpbml0aW9uIGluIG90aGVyIG1vZHVsZS5cclxuICAgICAqIEBqYSBbW1JFU1VMVF9DT0RFXV0g44Gu44Kq44OV44K744OD44OI5YCkIDxicj5cclxuICAgICAqICAgICDjgqjjg6njg7zjgrPjg7zjg4nlr77lv5zjgZnjgovjg6Ljgrjjg6Xjg7zjg6vlhoXjgacg5a6a576p44KS5ouh5by144GZ44KLLlxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlIDxicj5cclxuICAgICAqXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFIHtcclxuICAgICAqICAgICAgRVJST1JfU09NRU1PRFVMRV9VTkVYUEVDVEVEICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLCBMT0NBTF9DT0RFX0JBU0UuQ09NTU9OICsgMSwgXCJlcnJvciB1bmV4cGVjdGVkLlwiKSxcclxuICAgICAqICAgICAgRVJST1JfU09NRU1PRFVMRV9JTlZBTElEX0FSRyA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLCBMT0NBTF9DT0RFX0JBU0UuQ09NTU9OICsgMiwgXCJpbnZhbGlkIGFyZ3VtZW50cy5cIiksXHJcbiAgICAgKiAgfVxyXG4gICAgICogIEFTU0lHTl9SRVNVTFRfQ09ERShSRVNVTFRfQ09ERSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREVfQkFTRSB7XHJcbiAgICAgICAgQ0RQX0RFQ0xBUkVSQVRJT04gPSAwLCAvLyBUUzI0MzIg5a++562WOiDlkIzkuIAgbmFtZXNwYWNlIOOBq+ikh+aVsOWbnuOBq+OCj+OBn+OBo+OBpuWQjOWQjeOBriBlbnVtIOOCkuWuo+iogOOBmeOCi+WgtOWQiOOBq+W/heimgS5cclxuLy8gICAgICBNT0RVTEVfQSA9IDEgKiBNT0RVTEVfUkVTVUxUX0NPREVfUkFOR0UsICAgIC8vIGV4KSBtb2R1bGVBOiBhYnMoMTAwMSDvvZ4gMTk5OSlcclxuLy8gICAgICBNT0RVTEVfQiA9IDIgKiBNT0RVTEVfUkVTVUxUX0NPREVfUkFOR0UsICAgIC8vIGV4KSBtb2R1bGVCOiBhYnMoMjAwMSDvvZ4gMjk5OSlcclxuLy8gICAgICBNT0RVTEVfQyA9IDMgKiBNT0RVTEVfUkVTVUxUX0NPREVfUkFOR0UsICAgIC8vIGV4KSBtb2R1bGVDOiBhYnMoMzAwMSDvvZ4gMzk5OSlcclxuICAgICAgICBDRFAgPSAxICogX01PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRV9DRFAsICAgIC8vIGNkcCByZXNlcnZlZC4gYWJzKDAg772eIDEwMDApXHJcbiAgICB9XHJcbiAgICAvLyBcIkNEUFwiIOS7peWkluOBriBuYW1lc3BhY2Ug44Gn5a6a576p44GX44Gf5aC05ZCI44Gv44CBQVNTSUdOIOODpuODvOODhuOCo+ODquODhuOCo+OCkuOCs+ODvOODq+OBmeOCiy5cclxuLy8gIEFTU0lHTl9SRVNVTFRfQ09ERV9CQVNFKFJFU1VMVF9DT0RFX0JBU0UpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdlbmVyYXRlIHN1Y2Nlc3MgY29kZS5cclxuICAgICAqIEBqYSDmiJDlip/jgrPjg7zjg4njgpLnlJ/miJBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYmFzZVxyXG4gICAgICogQHBhcmFtIGxvY2FsQ29kZVxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIERFQ0xBUkVfU1VDQ0VTU19DT0RFKGJhc2U6IG51bWJlciB8IHN0cmluZywgbG9jYWxDb2RlOiBudW1iZXIsIG1lc3NhZ2U/OiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgIGlmIChcInN0cmluZ1wiID09PSB0eXBlb2YgYmFzZSkge1xyXG4gICAgICAgICAgICBiYXNlID0gQ0RQLlJFU1VMVF9DT0RFX0JBU0VbYmFzZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkZWNsYXJlUmVzdWx0Q29kZSg8UkVTVUxUX0NPREVfQkFTRT5iYXNlLCBsb2NhbENvZGUsIG1lc3NhZ2UsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdlbmVyYXRlIGVycm9yIGNvZGUuXHJcbiAgICAgKiBAamEg44Ko44Op44O844Kz44O844OJ55Sf5oiQXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGJhc2VcclxuICAgICAqIEBwYXJhbSBsb2NhbENvZGVcclxuICAgICAqIEBwYXJhbSBtZXNzYWdlXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBERUNMQVJFX0VSUk9SX0NPREUoYmFzZTogbnVtYmVyIHwgc3RyaW5nLCBsb2NhbENvZGU6IG51bWJlciwgbWVzc2FnZT86IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBiYXNlKSB7XHJcbiAgICAgICAgICAgIGJhc2UgPSBDRFAuUkVTVUxUX0NPREVfQkFTRVtiYXNlXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlY2xhcmVSZXN1bHRDb2RlKDxSRVNVTFRfQ09ERV9CQVNFPmJhc2UsIGxvY2FsQ29kZSwgbWVzc2FnZSwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEp1ZGdlIHN1Y2Nlc3Mgb3Igbm90LlxyXG4gICAgICogQGphIOaIkOWKn+WIpOWumlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjb2RlXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBTVUNDRUVERUQoY29kZTogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIDAgPD0gY29kZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBKdWRnZSBlcnJvciBvciBub3QuXHJcbiAgICAgKiBAamEg5aSx5pWX5Yik5a6aXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvZGVcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIEZBSUxFRChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gY29kZSA8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQXNzaWduIGRlY2xhcmVkIFtbUkVTVUxUX0NPREVfQkFTRV1dIHRvIHJvb3QgZW51bWVyYXRpb24uPGJyPlxyXG4gICAgICogICAgIChJdCdzIG5lY2Vzc2FyeSBhbHNvIHRvIG1lcmdlIGVudW0gaW4gdGhlIG1vZHVsZSBzeXN0ZW0gZW52aXJvbm1lbnQuKVxyXG4gICAgICogQGphIOaLoeW8teOBl+OBnyBbW1JFU1VMVF9DT0RFX0JBU0VdXSDjgpIg44Or44O844OIIGVudW0g44Gr44Ki44K144Kk44OzPGJyPlxyXG4gICAgICogICAgIOODouOCuOODpeODvOODq+OCt+OCueODhuODoOeSsOWig+OBq+OBiuOBhOOBpuOCguOAgWVudW0g44KS44Oe44O844K444GZ44KL44Gf44KB44Gr5b+F6KaBXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBBU1NJR05fUkVTVUxUX0NPREVfQkFTRShyZXN1bHRDb2RlQmFzZTogb2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgQ0RQLlJFU1VMVF9DT0RFX0JBU0UgPSA8YW55PnsgLi4uQ0RQLlJFU1VMVF9DT0RFX0JBU0UsIC4uLnJlc3VsdENvZGVCYXNlIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQXNzaWduIGRlY2xhcmVkIFtbQVNTSUdOX1JFU1VMVF9DT0RFXV0gdG8gcm9vdCBlbnVtZXJhdGlvbi5cclxuICAgICAqICAgICAoSXQncyBuZWNlc3NhcnkgYWxzbyB0byBtZXJnZSBlbnVtIGluIHRoZSBtb2R1bGUgc3lzdGVtIGVudmlyb25tZW50LilcclxuICAgICAqIEBqYSDmi6HlvLXjgZfjgZ8gW1tBU1NJR05fUkVTVUxUX0NPREVdXSDjgpIg44Or44O844OIIGVudW0g44Gr44Ki44K144Kk44OzXHJcbiAgICAgKiAgICAg44Oi44K444Ol44O844Or44K344K544OG44Og55Kw5aKD44Gr44GK44GE44Gm44KC44CBZW51bSDjgpLjg57jg7zjgrjjgZnjgovjgZ/jgoHjgavlv4XopoFcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIEFTU0lHTl9SRVNVTFRfQ09ERShyZXN1bHRDb2RlOiBvYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBDRFAuUkVTVUxUX0NPREUgPSA8YW55PnsgLi4uQ0RQLlJFU1VMVF9DT0RFLCAuLi5yZXN1bHRDb2RlIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIG1vZHVsZSBlcnJvciBkZWNsYXJhdGlvbjpcclxuXHJcbiAgICBjb25zdCBGVU5DVElPTl9DT0RFX1JBTkdFID0gMTA7XHJcblxyXG4gICAgLy8gY2RwLmNvcmUg5YaF44Gu44Ot44O844Kr44Or44Kz44O844OJ44Kq44OV44K744OD44OI5YCkXHJcbiAgICBlbnVtIExPQ0FMX0NPREVfQkFTRSB7XHJcbiAgICAgICAgQ09SRSAgICA9IDAsXHJcbiAgICAgICAgUEFUQ0ggICA9IDEgKiBGVU5DVElPTl9DT0RFX1JBTkdFLFxyXG4gICAgfVxyXG5cclxuICAgIC8vIEBpbnRlcm5hbCBFcnJvciBjb2RlIGRlZmluaXRpb24gb2YgYGNkcC1jb3JlYC5cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFIHtcclxuICAgICAgICBFUlJPUl9DRFBfREVDTEFSQVRJT05fQ0RQID0gMCwgLy8gVFMyNDMyIOWvvuetljog5ZCM5LiAIG5hbWVzcGFjZSDjgavopIfmlbDlm57jgavjgo/jgZ/jgaPjgablkIzlkI3jga4gZW51bSDjgpLlrqPoqIDjgZnjgovloLTlkIjjgavlv4XopoEuXHJcbiAgICAgICAgLyoqIGBlbmAgW1tDRFAuaW5pdGlhbGl6ZV1dKCkgZmFpbGVyIGNvZGUuIDxicj4gYGphYCBbW0NEUC5pbml0aWFsaXplXV0oKSDjga7jgqjjg6njg7zjgrPjg7zjg4kgKi9cclxuICAgICAgICBFUlJPUl9DRFBfSU5JVElBTElaRV9GQUlMRUQgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFAsIExPQ0FMX0NPREVfQkFTRS5DT1JFICsgMSwgXCJpbml0aWFsaXplZCBmYWlsZWQuXCIpLFxyXG4gICAgfVxyXG4gICAgLy8gXCJDRFBcIiDku6XlpJbjga4gbmFtZXNwYWNlIOOBp+Wumue+qeOBl+OBn+WgtOWQiOOBr+OAgUFTU0lHTiDjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgpLjgrPjg7zjg6vjgZnjgosuXHJcbi8vICBBU1NJR05fUkVTVUxUX0NPREVfQkFTRShSRVNVTFRfQ09ERSk7XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIHByaXZhdGUgc3RhdGljIG1ldGhvZHM6XHJcblxyXG4gICAgLy8gUkVTVUxUX0NPREUg44Gu55m76YyyXHJcbiAgICBmdW5jdGlvbiBkZWNsYXJlUmVzdWx0Q29kZShiYXNlOiBSRVNVTFRfQ09ERV9CQVNFLCBtb2R1bGVDb2RlOiBudW1iZXIsIG1lc3NhZ2U/OiBzdHJpbmcsIHN1Y2NlZWRlZDogYm9vbGVhbiA9IGZhbHNlKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAobW9kdWxlQ29kZSA8PSAwIHx8IE1PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRSA8PSBtb2R1bGVDb2RlKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYGRlY2xhcmVSZXN1bHRDb2RlKCksIGludmFsaWQgbG9jYWxDb2RlIHJhbmdlLiBbbG9jYWxDb2RlOiAke21vZHVsZUNvZGV9XWApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHNpZ25lZCA9IHN1Y2NlZWRlZCA/IDEgOiAtMTtcclxuICAgICAgICBjb25zdCByZXN1bHRDb2RlID0gc2lnbmVkICogKGJhc2UgKyBtb2R1bGVDb2RlKTtcclxuICAgICAgICBzX2NvZGUybWVzc2FnZVtyZXN1bHRDb2RlXSA9IG1lc3NhZ2UgPyBtZXNzYWdlIDogKGBbUkVTVUxUX0NPREU6ICR7cmVzdWx0Q29kZX1dYCk7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdENvZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUkVTVUxUX0NPREUg44GL44KJ55m76Yyy44GV44KM44Gm44GE44KL44Oh44OD44K744O844K444KS5Y+W5b6XXHJcbiAgICBmdW5jdGlvbiBtZXNzYWdlRnJvbVJlc3VsdENvZGUocmVzdWx0Q29kZTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICBpZiAoc19jb2RlMm1lc3NhZ2VbcmVzdWx0Q29kZV0pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNfY29kZTJtZXNzYWdlW3Jlc3VsdENvZGVdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBgdW5yZWdpc3RlcmVkIHJlc3VsdCBjb2RlLiBbUkVTVUxUX0NPREU6ICR7cmVzdWx0Q29kZX1dYDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUkVTVUxUX0NPREUg44GL44KJ55m76Yyy44GV44KM44Gm44GE44KLIFJFU1VMVF9DT0RFIOaWh+Wtl+WIl+OCkuWPluW+l1xyXG4gICAgZnVuY3Rpb24gYnVpbGRFcnJvck5hbWUocmVzdWx0Q29kZTogbnVtYmVyLCB0YWc6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgcHJlZml4ID0gdGFnIHx8IFwiXCI7XHJcbiAgICAgICAgaWYgKENEUC5SRVNVTFRfQ09ERVtyZXN1bHRDb2RlXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJlZml4ICsgQ0RQLlJFU1VMVF9DT0RFW3Jlc3VsdENvZGVdICsgRVJST1JfTkFNRV9TRVBBUkFUT1I7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHByZWZpeCArIFVOS05PV05fRVJST1JfTkFNRSArIEVSUk9SX05BTUVfU0VQQVJBVE9SO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=