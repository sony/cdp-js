/*!
 * cdp.core.js 2.0.0
 *
 * Date: 2017-09-06T05:47:25.271Z
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvQ29yZS50cyIsImNkcDovLy9DRFAvUGF0Y2gudHMiLCJjZHA6Ly8vQ0RQL0Vycm9yRGVmcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0E0R1o7QUE1R0QsV0FBVSxHQUFHO0lBRVQsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDO0lBRXJCOzs7OztPQUtHO0lBQ1UsVUFBTSxHQUFRLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO0lBR3JEOzs7OztPQUtHO0lBQ1UsV0FBTyxHQUFXLENBQUM7UUFDNUIsRUFBRSxDQUFDLENBQUMsVUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxPQUFPLEdBQUcsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFVBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNYLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsQ0FBQztZQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEIsQ0FBQztJQUNMLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFFTDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BcUJHO0lBQ0gsZUFBc0IsSUFBWTtRQUM5QixJQUFNLElBQUksR0FBRyxXQUFPLElBQUksRUFBRSxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsRUFBRSxDQUFDLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7WUFDdkIsQ0FBQztRQUNMLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDaEIsQ0FBQztJQUNMLENBQUM7SUFYZSxTQUFLLFFBV3BCO0lBRUQ7OztPQUdHO0lBQ1UsVUFBTSxHQUFRLEdBQUcsQ0FBQyxNQUFNLElBQUksVUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7SUFZN0Q7Ozs7O09BS0c7SUFDSCxvQkFBMkIsT0FBeUI7UUFDaEQsVUFBVSxDQUFDO1lBQ1AsSUFBSSxDQUFDO2dCQUNELFNBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDZCxFQUFFLENBQUMsQ0FBQyxPQUFPLElBQUksT0FBTyxPQUFPLENBQUMsT0FBTyxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ25ELE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDdEIsQ0FBQztZQUNMLENBQUM7WUFBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNiLElBQU0sS0FBSyxHQUFHLG1CQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JDLElBQU0sU0FBUyxHQUFHLGlCQUFhLENBQzNCLGVBQVcsQ0FBQywyQkFBMkIsRUFDdkMsR0FBRyxFQUNILEtBQUssQ0FBQyxPQUFPLEVBQ2IsS0FBSyxDQUNSLENBQUM7Z0JBQ0YsT0FBTyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2pDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLE9BQU8sQ0FBQyxJQUFJLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDaEQsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDNUIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFyQmUsY0FBVSxhQXFCekI7QUFDTCxDQUFDLEVBNUdTLEdBQUcsS0FBSCxHQUFHLFFBNEdaO0FDNUdELElBQVUsR0FBRyxDQStFWjtBQS9FRCxXQUFVLEdBQUc7SUFFVCxJQUFNLEdBQUcsR0FBVyxjQUFjLENBQUM7SUFFbkM7Ozs7O09BS0c7SUFDSDtRQUFBO1FBb0VBLENBQUM7UUFuRUcsdUVBQXVFO1FBQ3ZFLHlCQUF5QjtRQUV6Qjs7Ozs7V0FLRztRQUNXLFdBQUssR0FBbkI7WUFDSSxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDckIsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3RCLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsMEJBQTBCO1FBRTFCLGtCQUFrQjtRQUNILGtCQUFZLEdBQTNCO1lBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLFVBQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxJQUFJLFVBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDekQsVUFBTSxDQUFDLE9BQU8sR0FBRztvQkFDYixLQUFLLEVBQXVCLGNBQTBCLENBQUM7b0JBQ3ZELFFBQVEsRUFBb0IsY0FBMEIsQ0FBQztvQkFDdkQsSUFBSSxFQUF3QixjQUEwQixDQUFDO29CQUN2RCxPQUFPLEVBQXFCLGNBQTBCLENBQUM7b0JBQ3ZELEtBQUssRUFBdUIsY0FBMEIsQ0FBQztvQkFDdkQsS0FBSyxFQUF1QixjQUEwQixDQUFDO29CQUN2RCxNQUFNLEVBQXNCLGNBQTBCLENBQUM7b0JBQ3ZELEtBQUssRUFBdUIsY0FBMEIsQ0FBQztvQkFDdkQsY0FBYyxFQUFjLGNBQTBCLENBQUM7b0JBQ3ZELE1BQU0sRUFBc0IsY0FBMEIsQ0FBQztvQkFDdkQsSUFBSSxFQUF3QixjQUEwQixDQUFDO29CQUN2RCxPQUFPLEVBQXFCLGNBQTBCLENBQUM7b0JBQ3ZELE1BQU0sRUFBc0IsY0FBMEIsQ0FBQztvQkFDdkQseUJBQXlCLEVBQUcsY0FBMEIsQ0FBQztvQkFDdkQsS0FBSyxFQUF1QixjQUEwQixDQUFDO29CQUN2RCxHQUFHLEVBQXlCLGNBQTBCLENBQUM7b0JBQ3ZELElBQUksRUFBd0IsY0FBMEIsQ0FBQztvQkFDdkQsS0FBSyxFQUF1QixjQUEwQixDQUFDO29CQUN2RCxHQUFHLEVBQXlCLGNBQTBCLENBQUM7b0JBQ3ZELFVBQVUsRUFBa0IsY0FBMEIsQ0FBQztpQkFDMUQsQ0FBQztZQUNOLENBQUM7UUFDTCxDQUFDO1FBRUQsZ0JBQWdCO1FBQ0QsZUFBUyxHQUF4QjtZQUNJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLElBQU0sUUFBTSxHQUFRLEtBQUssQ0FBQztnQkFFMUIsSUFBTSxxQkFBbUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxJQUFTO29CQUM1QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ2xCLE1BQU0sQ0FBQyxRQUFNLENBQUMsdUJBQXVCLENBQUM7d0JBQ2xDLE1BQU0sQ0FBQyxxQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNoRCxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUM7Z0JBRUYsSUFBTSxzQkFBb0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztnQkFDekQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsVUFBVSxVQUFlLEVBQUUsZ0JBQXNCO29CQUMzRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ2xCLE1BQU0sQ0FBQyxRQUFNLENBQUMsdUJBQXVCLENBQUM7d0JBQ2xDLE1BQU0sQ0FBQyxzQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO29CQUN6RSxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUM7WUFDTixDQUFDO1FBQ0wsQ0FBQztRQUNMLFlBQUM7SUFBRCxDQUFDO0lBcEVZLFNBQUssUUFvRWpCO0FBQ0wsQ0FBQyxFQS9FUyxHQUFHLEtBQUgsR0FBRyxRQStFWjs7Ozs7Ozs7O0FDL0VELElBQVUsR0FBRyxDQWlXWjtBQWpXRCxXQUFVLEdBQUc7SUFFVCxJQUFNLGtCQUFrQixHQUFNLGVBQWUsQ0FBQztJQUM5QyxJQUFNLG9CQUFvQixHQUFJLElBQUksQ0FBQztJQUNuQyxJQUFNLGdCQUFnQixHQUFRLE9BQU8sQ0FBQztJQUN0QyxJQUFNLGNBQWMsR0FBcUM7UUFDckQsR0FBRyxFQUFFLHNCQUFzQjtRQUMzQixHQUFHLEVBQUUscUJBQXFCO1FBQzFCLElBQUksRUFBRSxtQkFBbUI7S0FDNUIsQ0FBQztJQUVGLHVFQUF1RTtJQUN2RSxtQkFBbUI7SUFFbkI7OztPQUdHO0lBQ0gsSUFBWSxXQU9YO0lBUEQsV0FBWSxXQUFXO1FBQ25CLHlEQUF5RDtRQUN6RCx1REFBZTtRQUNmLHNEQUFzRDtRQUN0RCxxREFBZTtRQUNmLHdEQUF3RDtRQUN4RCxrREFBZ0I7SUFDcEIsQ0FBQyxFQVBXLFdBQVcsR0FBWCxlQUFXLEtBQVgsZUFBVyxRQU90QjtJQW1CRDs7O09BR0c7SUFDVSw0QkFBd0IsR0FBRyxJQUFJLENBQUM7SUFFN0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQ0c7SUFDSCx1QkFBOEIsVUFBa0IsRUFBRSxHQUFZLEVBQUUsT0FBZ0IsRUFBRSxLQUFhO1FBQzNGLElBQU0sUUFBUSxHQUFHLENBQUMsS0FBSyxJQUFJLGdCQUFnQixLQUFLLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQzlFLElBQU0sR0FBRyxHQUFHLFFBQVEsR0FBRyxnQkFBZ0IsR0FBRyxPQUFPLENBQUM7UUFDbEQsSUFBTSxJQUFJLEdBQUcsUUFBUSxHQUFHLFdBQVcsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQzFELElBQU0sU0FBUyxHQUFjLElBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzNFLFNBQVMsQ0FBQyxJQUFJLEdBQUksY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUM1QyxTQUFTLENBQUMsSUFBSSxHQUFJLElBQUksQ0FBQztRQUN2QixTQUFTLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN4QixNQUFNLENBQUMsU0FBUyxDQUFDO0lBQ3JCLENBQUM7SUFUZSxpQkFBYSxnQkFTNUI7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0gsK0JBQXNDLEdBQVksRUFBRSxLQUFhO1FBQzdELE1BQU0sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDN0UsQ0FBQztJQUZlLHlCQUFxQix3QkFFcEM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FvQkc7SUFDSCx5QkFBZ0MsS0FBcUI7UUFDakQsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsZ0JBQWdCLEtBQUssS0FBSyxDQUFDO1FBQ3RDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQU0sU0FBUyxHQUFjLEtBQUssQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUNaLEVBQUUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLElBQUksSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztvQkFDcEYsTUFBTSxDQUFDLElBQUksQ0FBQztnQkFDaEIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBWmUsbUJBQWUsa0JBWTlCO0lBRUQ7OztPQUdHO0lBQ0gseUJBQWdDLEtBQVc7UUFDdkMsSUFBTSxPQUFPLEdBQWM7WUFDdkIsSUFBSSxFQUFFLGtCQUFrQixHQUFHLG9CQUFvQjtZQUMvQyxJQUFJLEVBQUUsV0FBVyxDQUFDLE1BQU07WUFDeEIsT0FBTyxFQUFFLHdCQUF3QjtTQUNwQyxDQUFDO1FBQ0YsSUFBTSxLQUFLLEdBQUcsVUFBQyxLQUFXO1lBQ3RCLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVCxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ2pCLENBQUM7WUFDRCxNQUFNLENBQUMsQ0FDSCxRQUFRLEtBQUssT0FBTyxLQUFLLENBQUMsSUFBSTtnQkFDOUIsUUFBUSxLQUFLLE9BQU8sS0FBSyxDQUFDLElBQUk7Z0JBQzlCLFFBQVEsS0FBSyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQ3BDLENBQUM7UUFDTixDQUFDLENBQUM7UUFFRixFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNqQixDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLEtBQU0sQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztZQUM3QyxNQUFNLENBQVksS0FBSyxDQUFDO1FBQzVCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNuQyxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixNQUFNLENBQUMscUJBQXFCLEVBQUUsQ0FBQztZQUNuQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxjQUFNLE9BQU8sRUFBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBRztZQUNqRCxDQUFDO1FBQ0wsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sY0FDQyxPQUFPLEVBQ0Y7Z0JBQ0osS0FBSyxFQUFFO29CQUNILElBQUksRUFBRSxrQkFBa0IsR0FBRyxvQkFBb0I7b0JBQy9DLE9BQU8sRUFBRSw4QkFBOEI7b0JBQ3ZDLElBQUksRUFBRSxLQUFLO2lCQUNkO2FBQ0osRUFDSDtRQUNOLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNuQyxNQUFNLGNBQU0sT0FBTyxFQUFLLEtBQUssRUFBRztRQUNwQyxDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDO0lBNUNlLG1CQUFlLGtCQTRDOUI7SUFFRDs7T0FFRztJQUNVLGlDQUE2QixHQUFHLEdBQUcsQ0FBQztJQUVqRDs7Ozs7Ozs7Ozs7Ozs7O09BZUc7SUFDSCxJQUFZLGdCQU1YO0lBTkQsV0FBWSxnQkFBZ0I7UUFDeEIsaUZBQXFCO1FBQzdCLG9GQUFvRjtRQUNwRixvRkFBb0Y7UUFDcEYsb0ZBQW9GO1FBQzVFLDJDQUFNLENBQUMsR0FBRyxpQ0FBNkI7SUFDM0MsQ0FBQyxFQU5XLGdCQUFnQixHQUFoQixvQkFBZ0IsS0FBaEIsb0JBQWdCLFFBTTNCO0lBQ0QscURBQXFEO0lBQ3pELDhDQUE4QztJQUUxQzs7Ozs7OztPQU9HO0lBQ0gsOEJBQXFDLElBQXFCLEVBQUUsU0FBaUIsRUFBRSxPQUFnQjtRQUMzRixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBbUIsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUxlLHdCQUFvQix1QkFLbkM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gsNEJBQW1DLElBQXFCLEVBQUUsU0FBaUIsRUFBRSxPQUFnQjtRQUN6RixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBbUIsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEYsQ0FBQztJQUxlLHNCQUFrQixxQkFLakM7SUFFRDs7Ozs7T0FLRztJQUNILG1CQUEwQixJQUFZO1FBQ2xDLE1BQU0sQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDO0lBQ3JCLENBQUM7SUFGZSxhQUFTLFlBRXhCO0lBRUQ7Ozs7O09BS0c7SUFDSCxnQkFBdUIsSUFBWTtRQUMvQixNQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRmUsVUFBTSxTQUVyQjtJQUVEOzs7OztPQUtHO0lBQ0gsaUNBQXdDLGNBQXNCO1FBQzFELEdBQUcsQ0FBQyxnQkFBZ0IsR0FBRyxhQUFVLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBSyxjQUFjLENBQUUsQ0FBQztJQUMvRSxDQUFDO0lBRmUsMkJBQXVCLDBCQUV0QztJQUVEOzs7OztPQUtHO0lBQ0gsNEJBQW1DLFVBQWtCO1FBQ2pELEdBQUcsQ0FBQyxXQUFXLEdBQUcsYUFBVSxHQUFHLENBQUMsV0FBVyxFQUFLLFVBQVUsQ0FBRSxDQUFDO0lBQ2pFLENBQUM7SUFGZSxzQkFBa0IscUJBRWpDO0lBRUQsdUVBQXVFO0lBQ3ZFLDRCQUE0QjtJQUU1QixJQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztJQUUvQiwyQkFBMkI7SUFDM0IsSUFBSyxlQUdKO0lBSEQsV0FBSyxlQUFlO1FBQ2hCLHFEQUFXO1FBQ1gsMkNBQVUsQ0FBQyxHQUFHLG1CQUFtQjtJQUNyQyxDQUFDLEVBSEksZUFBZSxLQUFmLGVBQWUsUUFHbkI7SUFFRCxpREFBaUQ7SUFDakQsV0FBWSxXQUFXO1FBQ25CLHVGQUE2QjtRQUM3QixvRkFBb0Y7UUFDcEYseURBQThCLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxxQkFBcUIsQ0FBQztJQUMzSCxDQUFDLEVBSlcsV0FBVyxHQUFYLGVBQVcsS0FBWCxlQUFXLFFBSXRCO0lBQ0QscURBQXFEO0lBQ3pELHlDQUF5QztJQUVyQyx1RUFBdUU7SUFDdkUsMEJBQTBCO0lBRTFCLGtCQUFrQjtJQUNsQiwyQkFBMkIsSUFBc0IsRUFBRSxVQUFrQixFQUFFLE9BQWdCLEVBQUUsU0FBMEI7UUFBMUIsNkNBQTBCO1FBQy9HLEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxDQUFDLElBQUksNEJBQXdCLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztZQUM1RCxPQUFPLENBQUMsS0FBSyxDQUFDLCtEQUE2RCxVQUFVLE1BQUcsQ0FBQyxDQUFDO1lBQzFGLE1BQU0sQ0FBQztRQUNYLENBQUM7UUFDRCxJQUFNLE1BQU0sR0FBRyxTQUFTLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLElBQU0sVUFBVSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQztRQUNoRCxjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUcsT0FBTyxHQUFHLE9BQU8sR0FBRyxDQUFDLG1CQUFpQixVQUFVLE1BQUcsQ0FBQyxDQUFDO1FBQ2xGLE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDdEIsQ0FBQztJQUVELGdDQUFnQztJQUNoQywrQkFBK0IsVUFBa0I7UUFDN0MsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLE1BQU0sQ0FBQyw2Q0FBMkMsVUFBVSxNQUFHLENBQUM7UUFDcEUsQ0FBQztJQUNMLENBQUM7SUFFRCwyQ0FBMkM7SUFDM0Msd0JBQXdCLFVBQWtCLEVBQUUsR0FBVztRQUNuRCxJQUFNLE1BQU0sR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsR0FBRyxvQkFBb0IsQ0FBQztRQUN2RSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixNQUFNLENBQUMsTUFBTSxHQUFHLGtCQUFrQixHQUFHLG9CQUFvQixDQUFDO1FBQzlELENBQUM7SUFDTCxDQUFDO0FBQ0wsQ0FBQyxFQWpXUyxHQUFHLEtBQUgsR0FBRyxRQWlXWiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBDRFAge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUF0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWNjZXNzb3IgZm9yIHN5c3RlbSBnbG9iYWwgb2JqZWN0Ljxicj5cclxuICAgICAqICAgICBJdCdsbCBiZSB1c3VhbGx5IGEgYHdpbmRvd2Agb2JqZWN0LlxyXG4gICAgICogQGphIOOCt+OCueODhuODoOOBriBnbG9iYWwg44Kq44OW44K444Kn44Kv44OI44G444Gu44Ki44Kv44K744K5PGJyPlxyXG4gICAgICogICAgIOmAmuW4uOOBryBgd2luZG93YCDjgqrjg5bjgrjjgqfjgq/jg4jjgajjgarjgotcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGdsb2JhbDogYW55ID0gRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBY2NzZXNzb3IgZm9yIFdlYiByb290IGxvY2F0aW9uIDxicj5cclxuICAgICAqICAgICBPbmx5IHRoZSBicm93c2VyIGVudmlyb25tZW50IHdpbGwgYmUgYW4gYWxsb2NhdGluZyBwbGFjZSBpbiBpbmRleC5odG1sLCBhbmQgYmVjb21lcyBlZmZlY3RpdmUuXHJcbiAgICAgKiBAamEgV2ViIHJvb3QgbG9jYXRpb24g44G444Gu44Ki44Kv44K744K5IDxicj5cclxuICAgICAqICAgICBpbmRleC5odG1sIOOBrumFjee9ruWgtOaJgOOBqOOBquOCiuOAgeODluODqeOCpuOCtueSsOWig+OBruOBv+acieWKueOBqOOBquOCiy5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IHdlYlJvb3Q6IHN0cmluZyA9ICgoKSA9PiB7XHJcbiAgICAgICAgaWYgKGdsb2JhbC5sb2NhdGlvbikge1xyXG4gICAgICAgICAgICBsZXQgYmFzZVVybCA9IC8oLitcXC8pW14vXSojW14vXSsvLmV4ZWMoZ2xvYmFsLmxvY2F0aW9uLmhyZWYpO1xyXG4gICAgICAgICAgICBpZiAoIWJhc2VVcmwpIHtcclxuICAgICAgICAgICAgICAgIGJhc2VVcmwgPSAvKC4rXFwvKS8uZXhlYyhnbG9iYWwubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJhc2VVcmxbMV07XHJcbiAgICAgICAgfVxyXG4gICAgfSkoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDb252ZXJ0ZXIgZnJvbSByZWxhdGl2ZSBwYXRoIHRvIGFic29sdXRlIHVybCBzdHJpbmcuIDxicj5cclxuICAgICAqICAgICBJZiB5b3Ugd2FudCB0byBhY2Nlc3MgdG8gQXNzZXRzIGFuZCBpbiBzcGl0ZSBvZiB0aGUgc2NyaXB0IGxvY2F0aW9uLCB0aGUgZnVuY3Rpb24gaXMgYXZhaWxhYmxlLlxyXG4gICAgICogQGphIOebuOWvviBwYXRoIOOCkue1tuWvviBVUkwg44Gr5aSJ5o+bIDxicj5cclxuICAgICAqICAgICBqcyDjga7phY3nva7jgavkvp3lrZjjgZnjgovjgZPjgajjgarjgY8gYGFzc2V0c2Ag44Ki44Kv44K744K544GX44Gf44GE44Go44GN44Gr5L2/55So44GZ44KLLlxyXG4gICAgICpcclxuICAgICAqIEBzZWUgaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjE4ODIxOC9yZWxhdGl2ZS1wYXRocy1pbi1qYXZhc2NyaXB0LWluLWFuLWV4dGVybmFsLWZpbGVcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZSA8YnI+XHJcbiAgICAgKlxyXG4gICAgICogYGBgdHNcclxuICAgICAqICBjb25zb2xlLmxvZyh0b1VybChcIi9yZXMvZGF0YS9jb2xsZWN0aW9uLmpzb25cIikpO1xyXG4gICAgICogIC8vIFwiaHR0cDovL2xvY2FsaG9zdDo4MDgwL2FwcC9yZXMvZGF0YS9jb2xsZWN0aW9uLmpzb25cIlxyXG4gICAgICogYGBgXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHBhdGhcclxuICAgICAqICAtIGBlbmAgc2V0IHJlbGF0aXZlIHBhdGggZnJvbSBbW3dlYlJvb3RdXS5cclxuICAgICAqICAtIGBqYWAgW1t3ZWJSb290XV0g44GL44KJ44Gu55u45a++44OR44K544KS5oyH5a6aXHJcbiAgICAgKiBAcmV0dXJucyB1cmwgc3RyaW5nXHJcbiAgICAgKiAgLSBgZW5gIHNldCByZWxhdGl2ZSBwYXRoIGZyb20gW1t3ZWJSb290XV0uXHJcbiAgICAgKiAgLSBgamFgIFtbd2ViUm9vdF1dIOOBi+OCieOBruebuOWvvuODkeOCueOCkuaMh+WumlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gdG9VcmwocGF0aDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCByb290ID0gd2ViUm9vdCB8fCBcIlwiO1xyXG4gICAgICAgIGlmIChudWxsICE9IHBhdGggJiYgbnVsbCAhPSBwYXRoWzBdKSB7XHJcbiAgICAgICAgICAgIGlmIChcIi9cIiA9PT0gcGF0aFswXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvb3QgKyBwYXRoLnNsaWNlKDEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJvb3QgKyBwYXRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJvb3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEFjY2Vzc29yIGZvciBnbG9iYWwgQ29uZmlnIG9iamVjdC5cclxuICAgICAqIEBqYSBDb25maWcg44Kq44OW44K444Kn44Kv44OI44G444Gu44Ki44Kv44K744K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBDb25maWc6IGFueSA9IENEUC5Db25maWcgfHwgZ2xvYmFsLkNvbmZpZyB8fCB7fTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBPcHRpb25zIGludGVyZmFjZSBmb3IgdGhpcyBtb2R1bGUgaW5pdGlhbGl6ZS5cclxuICAgICAqIEBqYSDliJ3mnJ/ljJbjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBDb3JlSW5pdE9wdGlvbnMge1xyXG4gICAgICAgIHN1Y2Nlc3M/OiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIGZhaWw/OiAoZXJyb3I/OiBhbnkpID0+IHZvaWQ7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEluaXRpYWxpemUgZnVuY3Rpb24gZm9yIGBjZHAtY29yZWAuIDxicj5cclxuICAgICAqICAgICBUaGlzIGZ1bmN0aW9uIGFwcGxpZXMgcGF0Y2ggdG8gdGhlIHJ1biB0aW1lIGVudmlyb25tZW50LlxyXG4gICAgICogQGphIGBjZHAtY29yZWAg44Gu5Yid5pyf5YyW6Zai5pWwPGJyPlxyXG4gICAgICogICAgIOeSsOWig+OBruW3ruWIhuOCkuWQuOWPjuOBmeOCiyBwYXRjaCDjgpLpgannlKjjgZnjgosuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplKG9wdGlvbnM/OiBDb3JlSW5pdE9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIFBhdGNoLmFwcGx5KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5zdWNjZXNzID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnN1Y2Nlc3MoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhdXNlID0gZW5zdXJlRXJyb3JJbmZvKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVycm9ySW5mbyA9IG1ha2VFcnJvckluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX0lOSVRJQUxJWkVfRkFJTEVELFxyXG4gICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICBjYXVzZS5tZXNzYWdlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhdXNlXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvckluZm8ubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5mYWlsID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmZhaWwoZXJyb3JJbmZvKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcImNkcC5jb3JlXCIge1xyXG4gICAgZXhwb3J0ID0gQ0RQO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAge1xyXG5cclxuICAgIGNvbnN0IFRBRzogc3RyaW5nID0gXCJbQ0RQLlBhdGNoXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBVdGlsaXR5IGNsYXNzIGZvciBhcHBsaW5nIHRoZSBwYXRjaCB0byB0aGUgcnVuIHRpbWUgZW52aXJvbm1lbnQuXHJcbiAgICAgKiBAamEg5a6f6KGM55Kw5aKD55SoIFBhdGNoIOmBqeeUqOODpuODvOODhuOCo+ODquODhuOCo+OCr+ODqeOCuVxyXG4gICAgICpcclxuICAgICAqIEBpbnRlcm5hbFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUGF0Y2gge1xyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RzOlxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZW4gQXBwbHkgdGhlIHBhdGNoXHJcbiAgICAgICAgICogQGphIOODkeODg+ODgeOBrumBqeeUqFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQGludGVybmFsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBhcHBseSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgUGF0Y2guY29uc29sZVBhdGNoKCk7XHJcbiAgICAgICAgICAgIFBhdGNoLm5vZGVQYXRjaCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIHN0YXRpYyBtZXRob2RzOlxyXG5cclxuICAgICAgICAvLyBjb25zb2xlIOeUqCBwYXRjaFxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGNvbnNvbGVQYXRjaCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gZ2xvYmFsLmNvbnNvbGUgfHwgbnVsbCA9PSBnbG9iYWwuY29uc29sZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgZ2xvYmFsLmNvbnNvbGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY291bnQ6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBncm91cEVuZDogICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZUVuZDogICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICB0cmFjZTogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyeG1sOiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBkZWJ1ZzogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwQ29sbGFwc2VkOiAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0OiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBpbmZvOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2ZpbGU6ICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0OiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBtc0lzSW5kZXBlbmRlbnRseUNvbXBvc2VkOiAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZGlyOiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICB3YXJuOiAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbG9nOiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBwcm9maWxlRW5kOiAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBXaW5SVCDnlKggcGF0Y2hcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBub2RlUGF0Y2goKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChcIm9iamVjdFwiID09PSB0eXBlb2YgTVNBcHApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IF9NU0FwcDogYW55ID0gTVNBcHA7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxBcHBlbmRDaGlsZCA9IE5vZGUucHJvdG90eXBlLmFwcGVuZENoaWxkO1xyXG4gICAgICAgICAgICAgICAgTm9kZS5wcm90b3R5cGUuYXBwZW5kQ2hpbGQgPSBmdW5jdGlvbiAobm9kZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9NU0FwcC5leGVjVW5zYWZlTG9jYWxGdW5jdGlvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEFwcGVuZENoaWxkLmNhbGwoc2VsZiwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsSW5zZXJ0QmVmb3JlID0gTm9kZS5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlO1xyXG4gICAgICAgICAgICAgICAgTm9kZS5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlID0gZnVuY3Rpb24gKG5ld0VsZW1lbnQ6IGFueSwgcmVmZXJlbmNlRWxlbWVudDogTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfTVNBcHAuZXhlY1Vuc2FmZUxvY2FsRnVuY3Rpb24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxJbnNlcnRCZWZvcmUuY2FsbChzZWxmLCBuZXdFbGVtZW50LCByZWZlcmVuY2VFbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgY29uc3QgVU5LTk9XTl9FUlJPUl9OQU1FICAgID0gXCJVbmtub3duIEVycm9yXCI7XHJcbiAgICBjb25zdCBFUlJPUl9OQU1FX1NFUEFSQVRPUiAgPSBcIjogXCI7XHJcbiAgICBjb25zdCBDQU5DRUxFRF9NRVNTQUdFICAgICAgPSBcImFib3J0XCI7XHJcbiAgICBjb25zdCBzX2NvZGUybWVzc2FnZTogeyBbcmVzdWx0Q29kZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7XHJcbiAgICAgICAgXCIwXCI6IFwib3BlcmF0aW9uIHN1Y2NlZWRlZC5cIixcclxuICAgICAgICBcIjFcIjogXCJvcGVyYXRpb24gY2FuY2VsZWQuXCIsXHJcbiAgICAgICAgXCItMVwiOiBcIm9wZXJhdGlvbiBmYWlsZWQuXCJcclxuICAgIH07XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGVycm9yIHV0aWxpdGllczpcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDb21tb24gZXJyb3IgY29kZSBmb3IgdGhlIGFwcGxpY2F0aW9uLlxyXG4gICAgICogQGphIOOCouODl+ODquOCseODvOOCt+ODp+ODs+WFqOS9k+OBp+S9v+eUqOOBmeOCi+WFsemAmuOCqOODqeODvOOCs+ODvOODieWumue+qVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZW51bSBSRVNVTFRfQ09ERSB7XHJcbiAgICAgICAgLyoqIGBlbmAgZ2VuZXJhbCBzdWNjZXNzIGNvZGUgPGJyPiBgamFgIOaxjueUqOaIkOWKn+OCs+ODvOODiSAgICAgICAgKi9cclxuICAgICAgICBTVUNDRUVERUQgICA9IDAsXHJcbiAgICAgICAgLyoqIGBlbmAgZ2VuZXJhbCBjYW5jZWwgY29kZSAgPGJyPiBgamFgIOaxjueUqOOCreODo+ODs+OCu+ODq+OCs+ODvOODiSAgKi9cclxuICAgICAgICBDQU5DRUxFRCAgICA9IDEsXHJcbiAgICAgICAgLyoqIGBlbmAgZ2VuZXJhbCBlcnJvciBjb2RlICAgPGJyPiBgamFgIOaxjueUqOOCqOODqeODvOOCs+ODvOODiSAgICAgICovXHJcbiAgICAgICAgRkFJTEVEICAgICAgPSAtMSxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFcnJvciBjb21tdW5pY2F0aW9uIG9iamVjdC5cclxuICAgICAqIEBqYSDjgqjjg6njg7zkvJ3pgZTjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFcnJvckluZm8gZXh0ZW5kcyBFcnJvciB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGVuIFRoZSBudW1lcmljYWwgdmFsdWUgdGhhdCBpcyBkZWZpbmVkIHRoZSBhcHBsaWNhdGlvbiAvIGludGVybmFsIGxpYnJhcmllcy5cclxuICAgICAgICAgKiBAamEg44Ki44OX44Oq44Kx44O844K344On44OzL+ODqeOCpOODluODqeODquOBp+Wumue+qeOBmeOCi+aVsOWApOWei+OCs+ODvOODieOCkuagvOe0jVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvZGU6IFJFU1VMVF9DT0RFO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBTdG9jayBsb3ctbGV2ZWwgZXJyb3IgaW5mb3JtYXRpb24uXHJcbiAgICAgICAgICogQGphIOS4i+S9jeOBruOCqOODqeODvOaDheWgseOCkuagvOe0jVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNhdXNlPzogRXJyb3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGFzc2lnbmFibGUgcmFuZ2UgZm9yIHRoZSBjbGllbnQncyBsb2NhbCByZXN1bHQgY29yZCBieSB3aGljaCBleHBhbnNpb24gaXMgcG9zc2libGUuXHJcbiAgICAgKiBAamEg44Kv44Op44Kk44Ki44Oz44OI44GM5ouh5by15Y+v6IO944Gq44Ot44O844Kr44Or44Oq44K244Or44OI44Kz44O844OJ44Gu44Ki44K144Kk44Oz5Y+v6IO96aCY5Z+fXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBNT0RVTEVfUkVTVUxUX0NPREVfUkFOR0UgPSAxMDAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdlbmVyYXRlIHRoZSBbW0Vycm9ySW5mb11dIG9iamVjdC5cclxuICAgICAqIEBqYSBbW0Vycm9ySW5mb11dIOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkFxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlIDxicj5cclxuICAgICAqXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogIHNvbWVBc3luY0Z1bmMoKVxyXG4gICAgICogICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgKiAgICAgICAgICBvdXRwdXRNZXNzYWdlKHJlc3VsdCk7XHJcbiAgICAgKiAgICAgIH0pXHJcbiAgICAgKiAgICAgIC5jYXRjaCgocmVhc29uOiBFcnJvcikgPT4ge1xyXG4gICAgICogICAgICAgICAgdGhyb3cgbWFrZUVycm9ySW5mbyhcclxuICAgICAqICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5GQUlMRUQsXHJcbiAgICAgKiAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICogICAgICAgICAgICAgIFwiZXJyb3Igb2NjdXIuXCIsXHJcbiAgICAgKiAgICAgICAgICAgICAgcmVhc29uICAvLyBzZXQgcmVjZWl2ZWQgZXJyb3IgaW5mby5cclxuICAgICAqICAgICAgICAgICk7XHJcbiAgICAgKiAgICAgIH0pO1xyXG4gICAgICogYGBgXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHJlc3VsdENvZGVcclxuICAgICAqICAtIGBlbmAgc2V0IFtbUkVTVUxUX0NPREVdXSBkZWZpbmVkLlxyXG4gICAgICogIC0gYGphYCDlrprnvqnjgZfjgZ8gW1tSRVNVTFRfQ09ERV1dIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIHRhZ1xyXG4gICAgICogIC0gYGVuYCBMb2cgdGFnIGluZm9ybWF0aW9uXHJcbiAgICAgKiAgLSBgamFgIOitmOWIpeaDheWgsVxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2VcclxuICAgICAqICAtIGBlbmAgSHVtYW4gcmVhZGFibGUgbWVzc2FnZVxyXG4gICAgICogIC0gYGphYCDjg6Hjg4Pjgrvjg7zjgrjjgpLmjIflrppcclxuICAgICAqIEBwYXJhbSBjYXVzZVxyXG4gICAgICogIC0gYGVuYCBsb3ctbGV2ZWwgRXJyb3Igb2JqZWN0XHJcbiAgICAgKiAgLSBgamFgIOS4i+S9jeOBruOCqOODqeODvOOCkuaMh+WumlxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1ha2VFcnJvckluZm8ocmVzdWx0Q29kZTogbnVtYmVyLCB0YWc/OiBzdHJpbmcsIG1lc3NhZ2U/OiBzdHJpbmcsIGNhdXNlPzogRXJyb3IpOiBFcnJvckluZm8ge1xyXG4gICAgICAgIGNvbnN0IGNhbmNlbGVkID0gKGNhdXNlICYmIENBTkNFTEVEX01FU1NBR0UgPT09IGNhdXNlLm1lc3NhZ2UpID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IG1zZyA9IGNhbmNlbGVkID8gQ0FOQ0VMRURfTUVTU0FHRSA6IG1lc3NhZ2U7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGNhbmNlbGVkID8gUkVTVUxUX0NPREUuQ0FOQ0VMRUQgOiByZXN1bHRDb2RlO1xyXG4gICAgICAgIGNvbnN0IGVycm9ySW5mbyA9IDxFcnJvckluZm8+bmV3IEVycm9yKG1zZyB8fCBtZXNzYWdlRnJvbVJlc3VsdENvZGUoY29kZSkpO1xyXG4gICAgICAgIGVycm9ySW5mby5uYW1lICA9IGJ1aWxkRXJyb3JOYW1lKGNvZGUsIHRhZyk7XHJcbiAgICAgICAgZXJyb3JJbmZvLmNvZGUgID0gY29kZTtcclxuICAgICAgICBlcnJvckluZm8uY2F1c2UgPSBjYXVzZTtcclxuICAgICAgICByZXR1cm4gZXJyb3JJbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdlbmVyYXRlIGNhbmNlbGVkIGVycm9yIGluZm9ybWF0aW9uLiA8YnI+XHJcbiAgICAgKiAgICAgVGhlIFtbRXJyb3JJbmZvXV0gb2JqZWN0IGdlbmVyYXRlZCBieSB0aGlzIGZ1bmN0aW9uIGhhcyBbW1JFU1VMVF9DT0RFLkNBTkNFTEVEXV0gY29kZS5cclxuICAgICAqIEBqYSDjgq3jg6Pjg7Pjgrvjg6vjgqjjg6njg7zmg4XloLHnlJ/miJAgPGJyPlxyXG4gICAgICogICAgIOOBk+OBrumWouaVsOOBp+eUn+aIkOOBleOCjOOBnyBbW0Vycm9ySW5mb11dIOOBryBbW1JFU1VMVF9DT0RFLkNBTkNFTEVEXV0g44KS5qC857SN44GZ44KLXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRhZ1xyXG4gICAgICogIC0gYGVuYCBMb2cgdGFnIGluZm9ybWF0aW9uXHJcbiAgICAgKiAgLSBgamFgIOitmOWIpeaDheWgsVxyXG4gICAgICogQHBhcmFtIGNhdXNlXHJcbiAgICAgKiAgLSBgZW5gIGxvdy1sZXZlbCBFcnJvciBvYmplY3RcclxuICAgICAqICAtIGBqYWAg5LiL5L2N44Gu44Ko44Op44O844KS5oyH5a6aXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWFrZUNhbmNlbGVkRXJyb3JJbmZvKHRhZz86IHN0cmluZywgY2F1c2U/OiBFcnJvcik6IEVycm9ySW5mbyB7XHJcbiAgICAgICAgcmV0dXJuIG1ha2VFcnJvckluZm8oUkVTVUxUX0NPREUuQ0FOQ0VMRUQsIHRhZywgQ0FOQ0VMRURfTUVTU0FHRSwgY2F1c2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVzIEp1ZGdlIHRoZSBlcnJvciBpcyBjYW5jZWxlZC5cclxuICAgICAqIEBqYSDjgqjjg6njg7zmg4XloLHjgYzjgq3jg6Pjg7Pjgrvjg6vjgZXjgozjgZ/jgoLjga7jgYvliKTlrppcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZSA8YnI+XHJcbiAgICAgKlxyXG4gICAgICogYGBgdHNcclxuICAgICAqICA6XHJcbiAgICAgKiAgLmNhdGNoKChyZWFzb246IEVycm9ySW5mbykgPT4ge1xyXG4gICAgICogICAgICBpZiAoIWlzQ2FuY2VsZWRFcnJvcihyZWFzb24pKSB7XHJcbiAgICAgKiAgICAgICAgICBoYW5kbGVFcnJvckluZm8ocmVhc29uKTtcclxuICAgICAqICAgICAgfVxyXG4gICAgICogICB9KTtcclxuICAgICAqICA6XHJcbiAgICAgKiBgYGBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXJyb3JcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKiAgLSBgZW5gIHRydWU6IGNhbmNlbGVkIGVycm9yIC8gZmFsc2U6IG90aGVyc1xyXG4gICAgICogIC0gYGphYCB0cnVlOiDjgq3jg6Pjg7Pjgrvjg6sgLyBmYWxzZTog44Gd44Gu5LuW44Ko44Op44O8XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpc0NhbmNlbGVkRXJyb3IoZXJyb3I6IEVycm9yIHwgc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBlcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gQ0FOQ0VMRURfTUVTU0FHRSA9PT0gZXJyb3I7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3JJbmZvID0gPEVycm9ySW5mbz5lcnJvcjtcclxuICAgICAgICAgICAgaWYgKGVycm9ySW5mbykge1xyXG4gICAgICAgICAgICAgICAgaWYgKFJFU1VMVF9DT0RFLkNBTkNFTEVEID09PSBlcnJvckluZm8uY29kZSB8fCBDQU5DRUxFRF9NRVNTQUdFID09PSBlcnJvckluZm8ubWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlcyBDb252ZXJ0IGZyb20gYW55IHR5cGUgZXJyb3IgaW5mb3JtYXRpb24gdG8gW1tFcnJvckluZm9dXSBvYmplY3QuXHJcbiAgICAgKiBAanAg44GC44KJ44KG44KL44Ko44Op44O85YWl5Yqb44KSIFtbRXJyb3JJbmZvXV0g44Gr5aSJ5o+bXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBlbnN1cmVFcnJvckluZm8oY2F1c2U/OiBhbnkpOiBFcnJvckluZm8ge1xyXG4gICAgICAgIGNvbnN0IHVua25vd246IEVycm9ySW5mbyA9IHtcclxuICAgICAgICAgICAgbmFtZTogVU5LTk9XTl9FUlJPUl9OQU1FICsgRVJST1JfTkFNRV9TRVBBUkFUT1IsXHJcbiAgICAgICAgICAgIGNvZGU6IFJFU1VMVF9DT0RFLkZBSUxFRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogXCJ1bmtub3duIGVycm9yIG9jY3VyZWQuXCIsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCB2YWxpZCA9IChlcnJvcj86IGFueSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIFwibnVtYmVyXCIgPT09IHR5cGVvZiBlcnJvci5jb2RlICYmXHJcbiAgICAgICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2YgZXJyb3IubmFtZSAmJlxyXG4gICAgICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGVycm9yLm1lc3NhZ2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAodmFsaWQoY2F1c2UpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjYXVzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNhdXNlIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgKDxFcnJvckluZm8+Y2F1c2UpLmNvZGUgPSBSRVNVTFRfQ09ERS5GQUlMRUQ7XHJcbiAgICAgICAgICAgIHJldHVybiA8RXJyb3JJbmZvPmNhdXNlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGNhdXNlKSB7XHJcbiAgICAgICAgICAgIGlmIChpc0NhbmNlbGVkRXJyb3IoY2F1c2UpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFrZUNhbmNlbGVkRXJyb3JJbmZvKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi51bmtub3duLCAuLi57IG1lc3NhZ2U6IGNhdXNlIH0gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoXCJudW1iZXJcIiA9PT0gdHlwZW9mIGNhdXNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi51bmtub3duLFxyXG4gICAgICAgICAgICAgICAgLi4uPGFueT57XHJcbiAgICAgICAgICAgICAgICAgICAgY2F1c2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogVU5LTk9XTl9FUlJPUl9OQU1FICsgRVJST1JfTkFNRV9TRVBBUkFUT1IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiUGxlYXNlIGNoZWNrIHRoZSBlcnJvciBjb2RlLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBjYXVzZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKFwib2JqZWN0XCIgPT09IHR5cGVvZiBjYXVzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyAuLi51bmtub3duLCAuLi5jYXVzZSB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVua25vd247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJuYWwgZm9yIENEUCBtb2R1bGVzIGFzc2lnbmFibGUgcmFuZ2UuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBfTU9EVUxFX1JFU1VMVF9DT0RFX1JBTkdFX0NEUCA9IDEwMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBPZmZzZXQgdmFsdWUgZW51bWVyYXRpb24gZm9yIFtbUkVTVUxUX0NPREVdXS4gPGJyPlxyXG4gICAgICogICAgIFRoZSBjbGllbnQgY2FuIGV4cGFuZCBhIGRlZmluaXRpb24gaW4gb3RoZXIgbW9kdWxlLlxyXG4gICAgICogQGphIFtbUkVTVUxUX0NPREVdXSDjga7jgqrjg5Xjgrvjg4Pjg4jlgKQgPGJyPlxyXG4gICAgICogICAgIOOCqOODqeODvOOCs+ODvOODieWvvuW/nOOBmeOCi+ODouOCuOODpeODvOODq+WGheOBpyDlrprnvqnjgpLmi6HlvLXjgZnjgosuXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGUgPGJyPlxyXG4gICAgICpcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREUge1xyXG4gICAgICogICAgICBFUlJPUl9TT01FTU9EVUxFX1VORVhQRUNURUQgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UsIExPQ0FMX0NPREVfQkFTRS5DT01NT04gKyAxLCBcImVycm9yIHVuZXhwZWN0ZWQuXCIpLFxyXG4gICAgICogICAgICBFUlJPUl9TT01FTU9EVUxFX0lOVkFMSURfQVJHID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UsIExPQ0FMX0NPREVfQkFTRS5DT01NT04gKyAyLCBcImludmFsaWQgYXJndW1lbnRzLlwiKSxcclxuICAgICAqICB9XHJcbiAgICAgKiAgQVNTSUdOX1JFU1VMVF9DT0RFKFJFU1VMVF9DT0RFKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZW51bSBSRVNVTFRfQ09ERV9CQVNFIHtcclxuICAgICAgICBDRFBfREVDTEFSRVJBVElPTiA9IDAsIC8vIFRTMjQzMiDlr77nrZY6IOWQjOS4gCBuYW1lc3BhY2Ug44Gr6KSH5pWw5Zue44Gr44KP44Gf44Gj44Gm5ZCM5ZCN44GuIGVudW0g44KS5a6j6KiA44GZ44KL5aC05ZCI44Gr5b+F6KaBLlxyXG4vLyAgICAgIE1PRFVMRV9BID0gMSAqIE1PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRSwgICAgLy8gZXgpIG1vZHVsZUE6IGFicygxMDAxIO+9niAxOTk5KVxyXG4vLyAgICAgIE1PRFVMRV9CID0gMiAqIE1PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRSwgICAgLy8gZXgpIG1vZHVsZUI6IGFicygyMDAxIO+9niAyOTk5KVxyXG4vLyAgICAgIE1PRFVMRV9DID0gMyAqIE1PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRSwgICAgLy8gZXgpIG1vZHVsZUM6IGFicygzMDAxIO+9niAzOTk5KVxyXG4gICAgICAgIENEUCA9IDEgKiBfTU9EVUxFX1JFU1VMVF9DT0RFX1JBTkdFX0NEUCwgICAgLy8gY2RwIHJlc2VydmVkLiBhYnMoMCDvvZ4gMTAwMClcclxuICAgIH1cclxuICAgIC8vIFwiQ0RQXCIg5Lul5aSW44GuIG5hbWVzcGFjZSDjgaflrprnvqnjgZfjgZ/loLTlkIjjga/jgIFBU1NJR04g44Om44O844OG44Kj44Oq44OG44Kj44KS44Kz44O844Or44GZ44KLLlxyXG4vLyAgQVNTSUdOX1JFU1VMVF9DT0RFX0JBU0UoUkVTVUxUX0NPREVfQkFTRSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2VuZXJhdGUgc3VjY2VzcyBjb2RlLlxyXG4gICAgICogQGphIOaIkOWKn+OCs+ODvOODieOCkueUn+aIkFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBiYXNlXHJcbiAgICAgKiBAcGFyYW0gbG9jYWxDb2RlXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gREVDTEFSRV9TVUNDRVNTX0NPREUoYmFzZTogbnVtYmVyIHwgc3RyaW5nLCBsb2NhbENvZGU6IG51bWJlciwgbWVzc2FnZT86IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBiYXNlKSB7XHJcbiAgICAgICAgICAgIGJhc2UgPSBDRFAuUkVTVUxUX0NPREVfQkFTRVtiYXNlXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlY2xhcmVSZXN1bHRDb2RlKDxSRVNVTFRfQ09ERV9CQVNFPmJhc2UsIGxvY2FsQ29kZSwgbWVzc2FnZSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2VuZXJhdGUgZXJyb3IgY29kZS5cclxuICAgICAqIEBqYSDjgqjjg6njg7zjgrPjg7zjg4nnlJ/miJBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYmFzZVxyXG4gICAgICogQHBhcmFtIGxvY2FsQ29kZVxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIERFQ0xBUkVfRVJST1JfQ09ERShiYXNlOiBudW1iZXIgfCBzdHJpbmcsIGxvY2FsQ29kZTogbnVtYmVyLCBtZXNzYWdlPzogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGJhc2UpIHtcclxuICAgICAgICAgICAgYmFzZSA9IENEUC5SRVNVTFRfQ09ERV9CQVNFW2Jhc2VdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVjbGFyZVJlc3VsdENvZGUoPFJFU1VMVF9DT0RFX0JBU0U+YmFzZSwgbG9jYWxDb2RlLCBtZXNzYWdlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSnVkZ2Ugc3VjY2VzcyBvciBub3QuXHJcbiAgICAgKiBAamEg5oiQ5Yqf5Yik5a6aXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvZGVcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIFNVQ0NFRURFRChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gMCA8PSBjb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEp1ZGdlIGVycm9yIG9yIG5vdC5cclxuICAgICAqIEBqYSDlpLHmlZfliKTlrppcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29kZVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gRkFJTEVEKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBjb2RlIDwgMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBc3NpZ24gZGVjbGFyZWQgW1tSRVNVTFRfQ09ERV9CQVNFXV0gdG8gcm9vdCBlbnVtZXJhdGlvbi48YnI+XHJcbiAgICAgKiAgICAgKEl0J3MgbmVjZXNzYXJ5IGFsc28gdG8gbWVyZ2UgZW51bSBpbiB0aGUgbW9kdWxlIHN5c3RlbSBlbnZpcm9ubWVudC4pXHJcbiAgICAgKiBAamEg5ouh5by144GX44GfIFtbUkVTVUxUX0NPREVfQkFTRV1dIOOCkiDjg6vjg7zjg4ggZW51bSDjgavjgqLjgrXjgqTjg7M8YnI+XHJcbiAgICAgKiAgICAg44Oi44K444Ol44O844Or44K344K544OG44Og55Kw5aKD44Gr44GK44GE44Gm44KC44CBZW51bSDjgpLjg57jg7zjgrjjgZnjgovjgZ/jgoHjgavlv4XopoFcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIEFTU0lHTl9SRVNVTFRfQ09ERV9CQVNFKHJlc3VsdENvZGVCYXNlOiBvYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBDRFAuUkVTVUxUX0NPREVfQkFTRSA9IDxhbnk+eyAuLi5DRFAuUkVTVUxUX0NPREVfQkFTRSwgLi4ucmVzdWx0Q29kZUJhc2UgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBc3NpZ24gZGVjbGFyZWQgW1tBU1NJR05fUkVTVUxUX0NPREVdXSB0byByb290IGVudW1lcmF0aW9uLlxyXG4gICAgICogICAgIChJdCdzIG5lY2Vzc2FyeSBhbHNvIHRvIG1lcmdlIGVudW0gaW4gdGhlIG1vZHVsZSBzeXN0ZW0gZW52aXJvbm1lbnQuKVxyXG4gICAgICogQGphIOaLoeW8teOBl+OBnyBbW0FTU0lHTl9SRVNVTFRfQ09ERV1dIOOCkiDjg6vjg7zjg4ggZW51bSDjgavjgqLjgrXjgqTjg7NcclxuICAgICAqICAgICDjg6Ljgrjjg6Xjg7zjg6vjgrfjgrnjg4bjg6DnkrDlooPjgavjgYrjgYTjgabjgoLjgIFlbnVtIOOCkuODnuODvOOCuOOBmeOCi+OBn+OCgeOBq+W/heimgVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gQVNTSUdOX1JFU1VMVF9DT0RFKHJlc3VsdENvZGU6IG9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIENEUC5SRVNVTFRfQ09ERSA9IDxhbnk+eyAuLi5DRFAuUkVTVUxUX0NPREUsIC4uLnJlc3VsdENvZGUgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gbW9kdWxlIGVycm9yIGRlY2xhcmF0aW9uOlxyXG5cclxuICAgIGNvbnN0IEZVTkNUSU9OX0NPREVfUkFOR0UgPSAxMDtcclxuXHJcbiAgICAvLyBjZHAuY29yZSDlhoXjga7jg63jg7zjgqvjg6vjgrPjg7zjg4njgqrjg5Xjgrvjg4Pjg4jlgKRcclxuICAgIGVudW0gTE9DQUxfQ09ERV9CQVNFIHtcclxuICAgICAgICBDT1JFICAgID0gMCxcclxuICAgICAgICBQQVRDSCAgID0gMSAqIEZVTkNUSU9OX0NPREVfUkFOR0UsXHJcbiAgICB9XHJcblxyXG4gICAgLy8gQGludGVybmFsIEVycm9yIGNvZGUgZGVmaW5pdGlvbiBvZiBgY2RwLWNvcmVgLlxyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREUge1xyXG4gICAgICAgIEVSUk9SX0NEUF9ERUNMQVJBVElPTl9DRFAgPSAwLCAvLyBUUzI0MzIg5a++562WOiDlkIzkuIAgbmFtZXNwYWNlIOOBq+ikh+aVsOWbnuOBq+OCj+OBn+OBo+OBpuWQjOWQjeOBriBlbnVtIOOCkuWuo+iogOOBmeOCi+WgtOWQiOOBq+W/heimgS5cclxuICAgICAgICAvKiogYGVuYCBbW0NEUC5pbml0aWFsaXplXV0oKSBmYWlsZXIgY29kZS4gPGJyPiBgamFgIFtbQ0RQLmluaXRpYWxpemVdXSgpIOOBruOCqOODqeODvOOCs+ODvOODiSAqL1xyXG4gICAgICAgIEVSUk9SX0NEUF9JTklUSUFMSVpFX0ZBSUxFRCA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUCwgTE9DQUxfQ09ERV9CQVNFLkNPUkUgKyAxLCBcImluaXRpYWxpemVkIGZhaWxlZC5cIiksXHJcbiAgICB9XHJcbiAgICAvLyBcIkNEUFwiIOS7peWkluOBriBuYW1lc3BhY2Ug44Gn5a6a576p44GX44Gf5aC05ZCI44Gv44CBQVNTSUdOIOODpuODvOODhuOCo+ODquODhuOCo+OCkuOCs+ODvOODq+OBmeOCiy5cclxuLy8gIEFTU0lHTl9SRVNVTFRfQ09ERV9CQVNFKFJFU1VMVF9DT0RFKTtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHJpdmF0ZSBzdGF0aWMgbWV0aG9kczpcclxuXHJcbiAgICAvLyBSRVNVTFRfQ09ERSDjga7nmbvpjLJcclxuICAgIGZ1bmN0aW9uIGRlY2xhcmVSZXN1bHRDb2RlKGJhc2U6IFJFU1VMVF9DT0RFX0JBU0UsIG1vZHVsZUNvZGU6IG51bWJlciwgbWVzc2FnZT86IHN0cmluZywgc3VjY2VlZGVkOiBib29sZWFuID0gZmFsc2UpOiBudW1iZXIge1xyXG4gICAgICAgIGlmIChtb2R1bGVDb2RlIDw9IDAgfHwgTU9EVUxFX1JFU1VMVF9DT0RFX1JBTkdFIDw9IG1vZHVsZUNvZGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgZGVjbGFyZVJlc3VsdENvZGUoKSwgaW52YWxpZCBsb2NhbENvZGUgcmFuZ2UuIFtsb2NhbENvZGU6ICR7bW9kdWxlQ29kZX1dYCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc2lnbmVkID0gc3VjY2VlZGVkID8gMSA6IC0xO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdENvZGUgPSBzaWduZWQgKiAoYmFzZSArIG1vZHVsZUNvZGUpO1xyXG4gICAgICAgIHNfY29kZTJtZXNzYWdlW3Jlc3VsdENvZGVdID0gbWVzc2FnZSA/IG1lc3NhZ2UgOiAoYFtSRVNVTFRfQ09ERTogJHtyZXN1bHRDb2RlfV1gKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0Q29kZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSRVNVTFRfQ09ERSDjgYvjgonnmbvpjLLjgZXjgozjgabjgYTjgovjg6Hjg4Pjgrvjg7zjgrjjgpLlj5blvpdcclxuICAgIGZ1bmN0aW9uIG1lc3NhZ2VGcm9tUmVzdWx0Q29kZShyZXN1bHRDb2RlOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChzX2NvZGUybWVzc2FnZVtyZXN1bHRDb2RlXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc19jb2RlMm1lc3NhZ2VbcmVzdWx0Q29kZV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGB1bnJlZ2lzdGVyZWQgcmVzdWx0IGNvZGUuIFtSRVNVTFRfQ09ERTogJHtyZXN1bHRDb2RlfV1gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSRVNVTFRfQ09ERSDjgYvjgonnmbvpjLLjgZXjgozjgabjgYTjgosgUkVTVUxUX0NPREUg5paH5a2X5YiX44KS5Y+W5b6XXHJcbiAgICBmdW5jdGlvbiBidWlsZEVycm9yTmFtZShyZXN1bHRDb2RlOiBudW1iZXIsIHRhZzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBwcmVmaXggPSB0YWcgfHwgXCJcIjtcclxuICAgICAgICBpZiAoQ0RQLlJFU1VMVF9DT0RFW3Jlc3VsdENvZGVdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXggKyBDRFAuUkVTVUxUX0NPREVbcmVzdWx0Q29kZV0gKyBFUlJPUl9OQU1FX1NFUEFSQVRPUjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJlZml4ICsgVU5LTk9XTl9FUlJPUl9OQU1FICsgRVJST1JfTkFNRV9TRVBBUkFUT1I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==