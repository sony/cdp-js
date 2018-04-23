/*!
 * cdp.core.js 2.1.0
 *
 * Date: 2018-04-23T06:40:00.175Z
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
            if ("object" === CDP.global.MSApp) {
                var _MSApp_1 = CDP.global.MSApp;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvQ29yZS50cyIsImNkcDovLy9DRFAvUGF0Y2gudHMiLCJjZHA6Ly8vQ0RQL0Vycm9yRGVmcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0E0R1o7QUE1R0QsV0FBVSxHQUFHO0lBRVQsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDO0lBRXJCOzs7OztPQUtHO0lBQ1UsVUFBTSxHQUFRLFFBQVEsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDO0lBR3JEOzs7OztPQUtHO0lBQ1UsV0FBTyxHQUFXLENBQUM7UUFDNUIsSUFBSSxVQUFNLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksT0FBTyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxVQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ1YsT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqRDtZQUNELE9BQU8sT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3JCO0lBQ0wsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUVMOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FxQkc7SUFDSCxlQUFzQixJQUFZO1FBQzlCLElBQU0sSUFBSSxHQUFHLFdBQU8sSUFBSSxFQUFFLENBQUM7UUFDM0IsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDakMsSUFBSSxHQUFHLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNqQixPQUFPLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQy9CO2lCQUFNO2dCQUNILE9BQU8sSUFBSSxHQUFHLElBQUksQ0FBQzthQUN0QjtTQUNKO2FBQU07WUFDSCxPQUFPLElBQUksQ0FBQztT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O1FBQzdDLElBQUksY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzVCLE9BQU8sY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3JDO2FBQU07WUFDSCxPQUFPLDZDQUEyQyxVQUFVLE1BQUcsQ0FBQztTQUNuRTtJQUNMLENBQUM7SUFFRCwyQ0FBMkM7SUFDM0Msd0JBQXdCLFVBQWtCLEVBQUUsR0FBVztRQUNuRCxJQUFNLE1BQU0sR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDO1FBQ3pCLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUM3QixPQUFPLE1BQU0sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxHQUFHLG9CQUFvQixDQUFDO1NBQ3RFO2FBQU07WUFDSCxPQUFPLE1BQU0sR0FBRyxrQkFBa0IsR0FBRyxvQkFBb0IsQ0FBQztTQUM3RDtJQUNMLENBQUM7QUFDTCxDQUFDLEVBaldTLEdBQUcsS0FBSCxHQUFHLFFBaVdaIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBY2Nlc3NvciBmb3Igc3lzdGVtIGdsb2JhbCBvYmplY3QuPGJyPlxyXG4gICAgICogICAgIEl0J2xsIGJlIHVzdWFsbHkgYSBgd2luZG93YCBvYmplY3QuXHJcbiAgICAgKiBAamEg44K344K544OG44Og44GuIGdsb2JhbCDjgqrjg5bjgrjjgqfjgq/jg4jjgbjjga7jgqLjgq/jgrvjgrk8YnI+XHJcbiAgICAgKiAgICAg6YCa5bi444GvIGB3aW5kb3dgIOOCquODluOCuOOCp+OCr+ODiOOBqOOBquOCi1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgZ2xvYmFsOiBhbnkgPSBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEFjY3Nlc3NvciBmb3IgV2ViIHJvb3QgbG9jYXRpb24gPGJyPlxyXG4gICAgICogICAgIE9ubHkgdGhlIGJyb3dzZXIgZW52aXJvbm1lbnQgd2lsbCBiZSBhbiBhbGxvY2F0aW5nIHBsYWNlIGluIGluZGV4Lmh0bWwsIGFuZCBiZWNvbWVzIGVmZmVjdGl2ZS5cclxuICAgICAqIEBqYSBXZWIgcm9vdCBsb2NhdGlvbiDjgbjjga7jgqLjgq/jgrvjgrkgPGJyPlxyXG4gICAgICogICAgIGluZGV4Lmh0bWwg44Gu6YWN572u5aC05omA44Go44Gq44KK44CB44OW44Op44Km44K255Kw5aKD44Gu44G/5pyJ5Yq544Go44Gq44KLLlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3Qgd2ViUm9vdDogc3RyaW5nID0gKCgpID0+IHtcclxuICAgICAgICBpZiAoZ2xvYmFsLmxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIGxldCBiYXNlVXJsID0gLyguK1xcLylbXi9dKiNbXi9dKy8uZXhlYyhnbG9iYWwubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgICAgIGlmICghYmFzZVVybCkge1xyXG4gICAgICAgICAgICAgICAgYmFzZVVybCA9IC8oLitcXC8pLy5leGVjKGdsb2JhbC5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmFzZVVybFsxXTtcclxuICAgICAgICB9XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENvbnZlcnRlciBmcm9tIHJlbGF0aXZlIHBhdGggdG8gYWJzb2x1dGUgdXJsIHN0cmluZy4gPGJyPlxyXG4gICAgICogICAgIElmIHlvdSB3YW50IHRvIGFjY2VzcyB0byBBc3NldHMgYW5kIGluIHNwaXRlIG9mIHRoZSBzY3JpcHQgbG9jYXRpb24sIHRoZSBmdW5jdGlvbiBpcyBhdmFpbGFibGUuXHJcbiAgICAgKiBAamEg55u45a++IHBhdGgg44KS57W25a++IFVSTCDjgavlpInmj5sgPGJyPlxyXG4gICAgICogICAgIGpzIOOBrumFjee9ruOBq+S+neWtmOOBmeOCi+OBk+OBqOOBquOBjyBgYXNzZXRzYCDjgqLjgq/jgrvjgrnjgZfjgZ/jgYTjgajjgY3jgavkvb/nlKjjgZnjgosuXHJcbiAgICAgKlxyXG4gICAgICogQHNlZSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMTg4MjE4L3JlbGF0aXZlLXBhdGhzLWluLWphdmFzY3JpcHQtaW4tYW4tZXh0ZXJuYWwtZmlsZVxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlIDxicj5cclxuICAgICAqXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogIGNvbnNvbGUubG9nKHRvVXJsKFwiL3Jlcy9kYXRhL2NvbGxlY3Rpb24uanNvblwiKSk7XHJcbiAgICAgKiAgLy8gXCJodHRwOi8vbG9jYWxob3N0OjgwODAvYXBwL3Jlcy9kYXRhL2NvbGxlY3Rpb24uanNvblwiXHJcbiAgICAgKiBgYGBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGF0aFxyXG4gICAgICogIC0gYGVuYCBzZXQgcmVsYXRpdmUgcGF0aCBmcm9tIFtbd2ViUm9vdF1dLlxyXG4gICAgICogIC0gYGphYCBbW3dlYlJvb3RdXSDjgYvjgonjga7nm7jlr77jg5HjgrnjgpLmjIflrppcclxuICAgICAqIEByZXR1cm5zIHVybCBzdHJpbmdcclxuICAgICAqICAtIGBlbmAgc2V0IHJlbGF0aXZlIHBhdGggZnJvbSBbW3dlYlJvb3RdXS5cclxuICAgICAqICAtIGBqYWAgW1t3ZWJSb290XV0g44GL44KJ44Gu55u45a++44OR44K544KS5oyH5a6aXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiB0b1VybChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IHJvb3QgPSB3ZWJSb290IHx8IFwiXCI7XHJcbiAgICAgICAgaWYgKG51bGwgIT0gcGF0aCAmJiBudWxsICE9IHBhdGhbMF0pIHtcclxuICAgICAgICAgICAgaWYgKFwiL1wiID09PSBwYXRoWzBdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcm9vdCArIHBhdGguc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcm9vdCArIHBhdGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gcm9vdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQWNjZXNzb3IgZm9yIGdsb2JhbCBDb25maWcgb2JqZWN0LlxyXG4gICAgICogQGphIENvbmZpZyDjgqrjg5bjgrjjgqfjgq/jg4jjgbjjga7jgqLjgq/jgrvjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IENvbmZpZzogYW55ID0gQ0RQLkNvbmZpZyB8fCBnbG9iYWwuQ29uZmlnIHx8IHt9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE9wdGlvbnMgaW50ZXJmYWNlIGZvciB0aGlzIG1vZHVsZSBpbml0aWFsaXplLlxyXG4gICAgICogQGphIOWIneacn+WMluOCquODl+OCt+ODp+ODs+OCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIENvcmVJbml0T3B0aW9ucyB7XHJcbiAgICAgICAgc3VjY2Vzcz86ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgZmFpbD86IChlcnJvcj86IGFueSkgPT4gdm9pZDtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW5pdGlhbGl6ZSBmdW5jdGlvbiBmb3IgYGNkcC1jb3JlYC4gPGJyPlxyXG4gICAgICogICAgIFRoaXMgZnVuY3Rpb24gYXBwbGllcyBwYXRjaCB0byB0aGUgcnVuIHRpbWUgZW52aXJvbm1lbnQuXHJcbiAgICAgKiBAamEgYGNkcC1jb3JlYCDjga7liJ3mnJ/ljJbplqLmlbA8YnI+XHJcbiAgICAgKiAgICAg55Kw5aKD44Gu5beu5YiG44KS5ZC45Y+O44GZ44KLIHBhdGNoIOOCkumBqeeUqOOBmeOCiy5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemUob3B0aW9ucz86IENvcmVJbml0T3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgUGF0Y2guYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2F1c2UgPSBlbnN1cmVFcnJvckluZm8oZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3JJbmZvID0gbWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfSU5JVElBTElaRV9GQUlMRUQsXHJcbiAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhdXNlLm1lc3NhZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgY2F1c2VcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9ySW5mby5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLmZhaWwgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuZmFpbChlcnJvckluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwiY2RwLmNvcmVcIiB7XHJcbiAgICBleHBvcnQgPSBDRFA7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgY29uc3QgVEFHOiBzdHJpbmcgPSBcIltDRFAuUGF0Y2hdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFV0aWxpdHkgY2xhc3MgZm9yIGFwcGxpbmcgdGhlIHBhdGNoIHRvIHRoZSBydW4gdGltZSBlbnZpcm9ubWVudC5cclxuICAgICAqIEBqYSDlrp/ooYznkrDlooPnlKggUGF0Y2gg6YGp55So44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKlxyXG4gICAgICogQGludGVybmFsXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQYXRjaCB7XHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBBcHBseSB0aGUgcGF0Y2hcclxuICAgICAgICAgKiBAamEg44OR44OD44OB44Gu6YGp55SoXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAaW50ZXJuYWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGFwcGx5KCk6IHZvaWQge1xyXG4gICAgICAgICAgICBQYXRjaC5jb25zb2xlUGF0Y2goKTtcclxuICAgICAgICAgICAgUGF0Y2gubm9kZVBhdGNoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgc3RhdGljIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUg55SoIHBhdGNoXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgY29uc29sZVBhdGNoKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBnbG9iYWwuY29uc29sZSB8fCBudWxsID09IGdsb2JhbC5jb25zb2xlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBnbG9iYWwuY29uc29sZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudDogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwRW5kOiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZTogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lRW5kOiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYWNlOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXA6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBkaXJ4bWw6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBDb2xsYXBzZWQ6ICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Q6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGluZm86ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZmlsZTogICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQ6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1zSXNJbmRlcGVuZGVudGx5Q29tcG9zZWQ6ICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXI6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBkaXI6ICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHdhcm46ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBsb2c6ICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2ZpbGVFbmQ6ICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdpblJUIOeUqCBwYXRjaFxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG5vZGVQYXRjaCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKFwib2JqZWN0XCIgPT09IGdsb2JhbC5NU0FwcCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgX01TQXBwOiBhbnkgPSBnbG9iYWwuTVNBcHA7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxBcHBlbmRDaGlsZCA9IE5vZGUucHJvdG90eXBlLmFwcGVuZENoaWxkO1xyXG4gICAgICAgICAgICAgICAgTm9kZS5wcm90b3R5cGUuYXBwZW5kQ2hpbGQgPSBmdW5jdGlvbiAobm9kZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9NU0FwcC5leGVjVW5zYWZlTG9jYWxGdW5jdGlvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEFwcGVuZENoaWxkLmNhbGwoc2VsZiwgbm9kZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsSW5zZXJ0QmVmb3JlID0gTm9kZS5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlO1xyXG4gICAgICAgICAgICAgICAgTm9kZS5wcm90b3R5cGUuaW5zZXJ0QmVmb3JlID0gZnVuY3Rpb24gKG5ld0VsZW1lbnQ6IGFueSwgcmVmZXJlbmNlRWxlbWVudDogTm9kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfTVNBcHAuZXhlY1Vuc2FmZUxvY2FsRnVuY3Rpb24oZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxJbnNlcnRCZWZvcmUuY2FsbChzZWxmLCBuZXdFbGVtZW50LCByZWZlcmVuY2VFbGVtZW50KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgY29uc3QgVU5LTk9XTl9FUlJPUl9OQU1FICAgID0gXCJVbmtub3duIEVycm9yXCI7XHJcbiAgICBjb25zdCBFUlJPUl9OQU1FX1NFUEFSQVRPUiAgPSBcIjogXCI7XHJcbiAgICBjb25zdCBDQU5DRUxFRF9NRVNTQUdFICAgICAgPSBcImFib3J0XCI7XHJcbiAgICBjb25zdCBzX2NvZGUybWVzc2FnZTogeyBbcmVzdWx0Q29kZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7XHJcbiAgICAgICAgXCIwXCI6IFwib3BlcmF0aW9uIHN1Y2NlZWRlZC5cIixcclxuICAgICAgICBcIjFcIjogXCJvcGVyYXRpb24gY2FuY2VsZWQuXCIsXHJcbiAgICAgICAgXCItMVwiOiBcIm9wZXJhdGlvbiBmYWlsZWQuXCJcclxuICAgIH07XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIGVycm9yIHV0aWxpdGllczpcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDb21tb24gZXJyb3IgY29kZSBmb3IgdGhlIGFwcGxpY2F0aW9uLlxyXG4gICAgICogQGphIOOCouODl+ODquOCseODvOOCt+ODp+ODs+WFqOS9k+OBp+S9v+eUqOOBmeOCi+WFsemAmuOCqOODqeODvOOCs+ODvOODieWumue+qVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZW51bSBSRVNVTFRfQ09ERSB7XHJcbiAgICAgICAgLyoqIGBlbmAgZ2VuZXJhbCBzdWNjZXNzIGNvZGUgPGJyPiBgamFgIOaxjueUqOaIkOWKn+OCs+ODvOODiSAgICAgICAgKi9cclxuICAgICAgICBTVUNDRUVERUQgICA9IDAsXHJcbiAgICAgICAgLyoqIGBlbmAgZ2VuZXJhbCBjYW5jZWwgY29kZSAgPGJyPiBgamFgIOaxjueUqOOCreODo+ODs+OCu+ODq+OCs+ODvOODiSAgKi9cclxuICAgICAgICBDQU5DRUxFRCAgICA9IDEsXHJcbiAgICAgICAgLyoqIGBlbmAgZ2VuZXJhbCBlcnJvciBjb2RlICAgPGJyPiBgamFgIOaxjueUqOOCqOODqeODvOOCs+ODvOODiSAgICAgICovXHJcbiAgICAgICAgRkFJTEVEICAgICAgPSAtMSxcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFcnJvciBjb21tdW5pY2F0aW9uIG9iamVjdC5cclxuICAgICAqIEBqYSDjgqjjg6njg7zkvJ3pgZTjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFcnJvckluZm8gZXh0ZW5kcyBFcnJvciB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGVuIFRoZSBudW1lcmljYWwgdmFsdWUgdGhhdCBpcyBkZWZpbmVkIHRoZSBhcHBsaWNhdGlvbiAvIGludGVybmFsIGxpYnJhcmllcy5cclxuICAgICAgICAgKiBAamEg44Ki44OX44Oq44Kx44O844K344On44OzL+ODqeOCpOODluODqeODquOBp+Wumue+qeOBmeOCi+aVsOWApOWei+OCs+ODvOODieOCkuagvOe0jVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvZGU6IFJFU1VMVF9DT0RFO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlbiBTdG9jayBsb3ctbGV2ZWwgZXJyb3IgaW5mb3JtYXRpb24uXHJcbiAgICAgICAgICogQGphIOS4i+S9jeOBruOCqOODqeODvOaDheWgseOCkuagvOe0jVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNhdXNlPzogRXJyb3I7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGFzc2lnbmFibGUgcmFuZ2UgZm9yIHRoZSBjbGllbnQncyBsb2NhbCByZXN1bHQgY29yZCBieSB3aGljaCBleHBhbnNpb24gaXMgcG9zc2libGUuXHJcbiAgICAgKiBAamEg44Kv44Op44Kk44Ki44Oz44OI44GM5ouh5by15Y+v6IO944Gq44Ot44O844Kr44Or44Oq44K244Or44OI44Kz44O844OJ44Gu44Ki44K144Kk44Oz5Y+v6IO96aCY5Z+fXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBNT0RVTEVfUkVTVUxUX0NPREVfUkFOR0UgPSAxMDAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdlbmVyYXRlIHRoZSBbW0Vycm9ySW5mb11dIG9iamVjdC5cclxuICAgICAqIEBqYSBbW0Vycm9ySW5mb11dIOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkFxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlIDxicj5cclxuICAgICAqXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogIHNvbWVBc3luY0Z1bmMoKVxyXG4gICAgICogICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgKiAgICAgICAgICBvdXRwdXRNZXNzYWdlKHJlc3VsdCk7XHJcbiAgICAgKiAgICAgIH0pXHJcbiAgICAgKiAgICAgIC5jYXRjaCgocmVhc29uOiBFcnJvcikgPT4ge1xyXG4gICAgICogICAgICAgICAgdGhyb3cgbWFrZUVycm9ySW5mbyhcclxuICAgICAqICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5GQUlMRUQsXHJcbiAgICAgKiAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICogICAgICAgICAgICAgIFwiZXJyb3Igb2NjdXIuXCIsXHJcbiAgICAgKiAgICAgICAgICAgICAgcmVhc29uICAvLyBzZXQgcmVjZWl2ZWQgZXJyb3IgaW5mby5cclxuICAgICAqICAgICAgICAgICk7XHJcbiAgICAgKiAgICAgIH0pO1xyXG4gICAgICogYGBgXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHJlc3VsdENvZGVcclxuICAgICAqICAtIGBlbmAgc2V0IFtbUkVTVUxUX0NPREVdXSBkZWZpbmVkLlxyXG4gICAgICogIC0gYGphYCDlrprnvqnjgZfjgZ8gW1tSRVNVTFRfQ09ERV1dIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIHRhZ1xyXG4gICAgICogIC0gYGVuYCBMb2cgdGFnIGluZm9ybWF0aW9uXHJcbiAgICAgKiAgLSBgamFgIOitmOWIpeaDheWgsVxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2VcclxuICAgICAqICAtIGBlbmAgSHVtYW4gcmVhZGFibGUgbWVzc2FnZVxyXG4gICAgICogIC0gYGphYCDjg6Hjg4Pjgrvjg7zjgrjjgpLmjIflrppcclxuICAgICAqIEBwYXJhbSBjYXVzZVxyXG4gICAgICogIC0gYGVuYCBsb3ctbGV2ZWwgRXJyb3Igb2JqZWN0XHJcbiAgICAgKiAgLSBgamFgIOS4i+S9jeOBruOCqOODqeODvOOCkuaMh+WumlxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1ha2VFcnJvckluZm8ocmVzdWx0Q29kZTogbnVtYmVyLCB0YWc/OiBzdHJpbmcsIG1lc3NhZ2U/OiBzdHJpbmcsIGNhdXNlPzogRXJyb3IpOiBFcnJvckluZm8ge1xyXG4gICAgICAgIGNvbnN0IGNhbmNlbGVkID0gKGNhdXNlICYmIENBTkNFTEVEX01FU1NBR0UgPT09IGNhdXNlLm1lc3NhZ2UpID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IG1zZyA9IGNhbmNlbGVkID8gQ0FOQ0VMRURfTUVTU0FHRSA6IG1lc3NhZ2U7XHJcbiAgICAgICAgY29uc3QgY29kZSA9IGNhbmNlbGVkID8gUkVTVUxUX0NPREUuQ0FOQ0VMRUQgOiByZXN1bHRDb2RlO1xyXG4gICAgICAgIGNvbnN0IGVycm9ySW5mbyA9IDxFcnJvckluZm8+bmV3IEVycm9yKG1zZyB8fCBtZXNzYWdlRnJvbVJlc3VsdENvZGUoY29kZSkpO1xyXG4gICAgICAgIGVycm9ySW5mby5uYW1lICA9IGJ1aWxkRXJyb3JOYW1lKGNvZGUsIHRhZyk7XHJcbiAgICAgICAgZXJyb3JJbmZvLmNvZGUgID0gY29kZTtcclxuICAgICAgICBlcnJvckluZm8uY2F1c2UgPSBjYXVzZTtcclxuICAgICAgICByZXR1cm4gZXJyb3JJbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdlbmVyYXRlIGNhbmNlbGVkIGVycm9yIGluZm9ybWF0aW9uLiA8YnI+XHJcbiAgICAgKiAgICAgVGhlIFtbRXJyb3JJbmZvXV0gb2JqZWN0IGdlbmVyYXRlZCBieSB0aGlzIGZ1bmN0aW9uIGhhcyBbW1JFU1VMVF9DT0RFLkNBTkNFTEVEXV0gY29kZS5cclxuICAgICAqIEBqYSDjgq3jg6Pjg7Pjgrvjg6vjgqjjg6njg7zmg4XloLHnlJ/miJAgPGJyPlxyXG4gICAgICogICAgIOOBk+OBrumWouaVsOOBp+eUn+aIkOOBleOCjOOBnyBbW0Vycm9ySW5mb11dIOOBryBbW1JFU1VMVF9DT0RFLkNBTkNFTEVEXV0g44KS5qC857SN44GZ44KLXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRhZ1xyXG4gICAgICogIC0gYGVuYCBMb2cgdGFnIGluZm9ybWF0aW9uXHJcbiAgICAgKiAgLSBgamFgIOitmOWIpeaDheWgsVxyXG4gICAgICogQHBhcmFtIGNhdXNlXHJcbiAgICAgKiAgLSBgZW5gIGxvdy1sZXZlbCBFcnJvciBvYmplY3RcclxuICAgICAqICAtIGBqYWAg5LiL5L2N44Gu44Ko44Op44O844KS5oyH5a6aXHJcbiAgICAgKiBAcmV0dXJuc1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWFrZUNhbmNlbGVkRXJyb3JJbmZvKHRhZz86IHN0cmluZywgY2F1c2U/OiBFcnJvcik6IEVycm9ySW5mbyB7XHJcbiAgICAgICAgcmV0dXJuIG1ha2VFcnJvckluZm8oUkVTVUxUX0NPREUuQ0FOQ0VMRUQsIHRhZywgQ0FOQ0VMRURfTUVTU0FHRSwgY2F1c2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVzIEp1ZGdlIHRoZSBlcnJvciBpcyBjYW5jZWxlZC5cclxuICAgICAqIEBqYSDjgqjjg6njg7zmg4XloLHjgYzjgq3jg6Pjg7Pjgrvjg6vjgZXjgozjgZ/jgoLjga7jgYvliKTlrppcclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZSA8YnI+XHJcbiAgICAgKlxyXG4gICAgICogYGBgdHNcclxuICAgICAqICA6XHJcbiAgICAgKiAgLmNhdGNoKChyZWFzb246IEVycm9ySW5mbykgPT4ge1xyXG4gICAgICogICAgICBpZiAoIWlzQ2FuY2VsZWRFcnJvcihyZWFzb24pKSB7XHJcbiAgICAgKiAgICAgICAgICBoYW5kbGVFcnJvckluZm8ocmVhc29uKTtcclxuICAgICAqICAgICAgfVxyXG4gICAgICogICB9KTtcclxuICAgICAqICA6XHJcbiAgICAgKiBgYGBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXJyb3JcclxuICAgICAqIEByZXR1cm5zXHJcbiAgICAgKiAgLSBgZW5gIHRydWU6IGNhbmNlbGVkIGVycm9yIC8gZmFsc2U6IG90aGVyc1xyXG4gICAgICogIC0gYGphYCB0cnVlOiDjgq3jg6Pjg7Pjgrvjg6sgLyBmYWxzZTog44Gd44Gu5LuW44Ko44Op44O8XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpc0NhbmNlbGVkRXJyb3IoZXJyb3I6IEVycm9yIHwgc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBlcnJvcikge1xyXG4gICAgICAgICAgICByZXR1cm4gQ0FOQ0VMRURfTUVTU0FHRSA9PT0gZXJyb3I7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyb3JJbmZvID0gPEVycm9ySW5mbz5lcnJvcjtcclxuICAgICAgICAgICAgaWYgKGVycm9ySW5mbykge1xyXG4gICAgICAgICAgICAgICAgaWYgKFJFU1VMVF9DT0RFLkNBTkNFTEVEID09PSBlcnJvckluZm8uY29kZSB8fCBDQU5DRUxFRF9NRVNTQUdFID09PSBlcnJvckluZm8ubWVzc2FnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlcyBDb252ZXJ0IGZyb20gYW55IHR5cGUgZXJyb3IgaW5mb3JtYXRpb24gdG8gW1tFcnJvckluZm9dXSBvYmplY3QuXHJcbiAgICAgKiBAanAg44GC44KJ44KG44KL44Ko44Op44O85YWl5Yqb44KSIFtbRXJyb3JJbmZvXV0g44Gr5aSJ5o+bXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBlbnN1cmVFcnJvckluZm8oY2F1c2U/OiBhbnkpOiBFcnJvckluZm8ge1xyXG4gICAgICAgIGNvbnN0IHVua25vd246IEVycm9ySW5mbyA9IHtcclxuICAgICAgICAgICAgbmFtZTogVU5LTk9XTl9FUlJPUl9OQU1FICsgRVJST1JfTkFNRV9TRVBBUkFUT1IsXHJcbiAgICAgICAgICAgIGNvZGU6IFJFU1VMVF9DT0RFLkZBSUxFRCxcclxuICAgICAgICAgICAgbWVzc2FnZTogXCJ1bmtub3duIGVycm9yIG9jY3VyZWQuXCIsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCB2YWxpZCA9IChlcnJvcj86IGFueSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIFwibnVtYmVyXCIgPT09IHR5cGVvZiBlcnJvci5jb2RlICYmXHJcbiAgICAgICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2YgZXJyb3IubmFtZSAmJlxyXG4gICAgICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGVycm9yLm1lc3NhZ2VcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAodmFsaWQoY2F1c2UpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjYXVzZTtcclxuICAgICAgICB9IGVsc2UgaWYgKGNhdXNlIGluc3RhbmNlb2YgRXJyb3IpIHtcclxuICAgICAgICAgICAgKDxFcnJvckluZm8+Y2F1c2UpLmNvZGUgPSBSRVNVTFRfQ09ERS5GQUlMRUQ7XHJcbiAgICAgICAgICAgIHJldHVybiA8RXJyb3JJbmZvPmNhdXNlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGNhdXNlKSB7XHJcbiAgICAgICAgICAgIGlmIChpc0NhbmNlbGVkRXJyb3IoY2F1c2UpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFrZUNhbmNlbGVkRXJyb3JJbmZvKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyAuLi51bmtub3duLCAuLi57IG1lc3NhZ2U6IGNhdXNlIH0gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAoXCJudW1iZXJcIiA9PT0gdHlwZW9mIGNhdXNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi51bmtub3duLFxyXG4gICAgICAgICAgICAgICAgLi4uPGFueT57XHJcbiAgICAgICAgICAgICAgICAgICAgY2F1c2U6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogVU5LTk9XTl9FUlJPUl9OQU1FICsgRVJST1JfTkFNRV9TRVBBUkFUT1IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiUGxlYXNlIGNoZWNrIHRoZSBlcnJvciBjb2RlLlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBjYXVzZVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9IGVsc2UgaWYgKFwib2JqZWN0XCIgPT09IHR5cGVvZiBjYXVzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4geyAuLi51bmtub3duLCAuLi5jYXVzZSB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHVua25vd247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJuYWwgZm9yIENEUCBtb2R1bGVzIGFzc2lnbmFibGUgcmFuZ2UuXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBfTU9EVUxFX1JFU1VMVF9DT0RFX1JBTkdFX0NEUCA9IDEwMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBPZmZzZXQgdmFsdWUgZW51bWVyYXRpb24gZm9yIFtbUkVTVUxUX0NPREVdXS4gPGJyPlxyXG4gICAgICogICAgIFRoZSBjbGllbnQgY2FuIGV4cGFuZCBhIGRlZmluaXRpb24gaW4gb3RoZXIgbW9kdWxlLlxyXG4gICAgICogQGphIFtbUkVTVUxUX0NPREVdXSDjga7jgqrjg5Xjgrvjg4Pjg4jlgKQgPGJyPlxyXG4gICAgICogICAgIOOCqOODqeODvOOCs+ODvOODieWvvuW/nOOBmeOCi+ODouOCuOODpeODvOODq+WGheOBpyDlrprnvqnjgpLmi6HlvLXjgZnjgosuXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGUgPGJyPlxyXG4gICAgICpcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREUge1xyXG4gICAgICogICAgICBFUlJPUl9TT01FTU9EVUxFX1VORVhQRUNURUQgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UsIExPQ0FMX0NPREVfQkFTRS5DT01NT04gKyAxLCBcImVycm9yIHVuZXhwZWN0ZWQuXCIpLFxyXG4gICAgICogICAgICBFUlJPUl9TT01FTU9EVUxFX0lOVkFMSURfQVJHID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UsIExPQ0FMX0NPREVfQkFTRS5DT01NT04gKyAyLCBcImludmFsaWQgYXJndW1lbnRzLlwiKSxcclxuICAgICAqICB9XHJcbiAgICAgKiAgQVNTSUdOX1JFU1VMVF9DT0RFKFJFU1VMVF9DT0RFKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZW51bSBSRVNVTFRfQ09ERV9CQVNFIHtcclxuICAgICAgICBDRFBfREVDTEFSRVJBVElPTiA9IDAsIC8vIFRTMjQzMiDlr77nrZY6IOWQjOS4gCBuYW1lc3BhY2Ug44Gr6KSH5pWw5Zue44Gr44KP44Gf44Gj44Gm5ZCM5ZCN44GuIGVudW0g44KS5a6j6KiA44GZ44KL5aC05ZCI44Gr5b+F6KaBLlxyXG4vLyAgICAgIE1PRFVMRV9BID0gMSAqIE1PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRSwgICAgLy8gZXgpIG1vZHVsZUE6IGFicygxMDAxIO+9niAxOTk5KVxyXG4vLyAgICAgIE1PRFVMRV9CID0gMiAqIE1PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRSwgICAgLy8gZXgpIG1vZHVsZUI6IGFicygyMDAxIO+9niAyOTk5KVxyXG4vLyAgICAgIE1PRFVMRV9DID0gMyAqIE1PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRSwgICAgLy8gZXgpIG1vZHVsZUM6IGFicygzMDAxIO+9niAzOTk5KVxyXG4gICAgICAgIENEUCA9IDEgKiBfTU9EVUxFX1JFU1VMVF9DT0RFX1JBTkdFX0NEUCwgICAgLy8gY2RwIHJlc2VydmVkLiBhYnMoMCDvvZ4gMTAwMClcclxuICAgIH1cclxuICAgIC8vIFwiQ0RQXCIg5Lul5aSW44GuIG5hbWVzcGFjZSDjgaflrprnvqnjgZfjgZ/loLTlkIjjga/jgIFBU1NJR04g44Om44O844OG44Kj44Oq44OG44Kj44KS44Kz44O844Or44GZ44KLLlxyXG4vLyAgQVNTSUdOX1JFU1VMVF9DT0RFX0JBU0UoUkVTVUxUX0NPREVfQkFTRSk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2VuZXJhdGUgc3VjY2VzcyBjb2RlLlxyXG4gICAgICogQGphIOaIkOWKn+OCs+ODvOODieOCkueUn+aIkFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBiYXNlXHJcbiAgICAgKiBAcGFyYW0gbG9jYWxDb2RlXHJcbiAgICAgKiBAcGFyYW0gbWVzc2FnZVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gREVDTEFSRV9TVUNDRVNTX0NPREUoYmFzZTogbnVtYmVyIHwgc3RyaW5nLCBsb2NhbENvZGU6IG51bWJlciwgbWVzc2FnZT86IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBiYXNlKSB7XHJcbiAgICAgICAgICAgIGJhc2UgPSBDRFAuUkVTVUxUX0NPREVfQkFTRVtiYXNlXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlY2xhcmVSZXN1bHRDb2RlKDxSRVNVTFRfQ09ERV9CQVNFPmJhc2UsIGxvY2FsQ29kZSwgbWVzc2FnZSwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2VuZXJhdGUgZXJyb3IgY29kZS5cclxuICAgICAqIEBqYSDjgqjjg6njg7zjgrPjg7zjg4nnlJ/miJBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYmFzZVxyXG4gICAgICogQHBhcmFtIGxvY2FsQ29kZVxyXG4gICAgICogQHBhcmFtIG1lc3NhZ2VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIERFQ0xBUkVfRVJST1JfQ09ERShiYXNlOiBudW1iZXIgfCBzdHJpbmcsIGxvY2FsQ29kZTogbnVtYmVyLCBtZXNzYWdlPzogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGJhc2UpIHtcclxuICAgICAgICAgICAgYmFzZSA9IENEUC5SRVNVTFRfQ09ERV9CQVNFW2Jhc2VdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGVjbGFyZVJlc3VsdENvZGUoPFJFU1VMVF9DT0RFX0JBU0U+YmFzZSwgbG9jYWxDb2RlLCBtZXNzYWdlLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSnVkZ2Ugc3VjY2VzcyBvciBub3QuXHJcbiAgICAgKiBAamEg5oiQ5Yqf5Yik5a6aXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNvZGVcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIFNVQ0NFRURFRChjb2RlOiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gMCA8PSBjb2RlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEp1ZGdlIGVycm9yIG9yIG5vdC5cclxuICAgICAqIEBqYSDlpLHmlZfliKTlrppcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29kZVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gRkFJTEVEKGNvZGU6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBjb2RlIDwgMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBc3NpZ24gZGVjbGFyZWQgW1tSRVNVTFRfQ09ERV9CQVNFXV0gdG8gcm9vdCBlbnVtZXJhdGlvbi48YnI+XHJcbiAgICAgKiAgICAgKEl0J3MgbmVjZXNzYXJ5IGFsc28gdG8gbWVyZ2UgZW51bSBpbiB0aGUgbW9kdWxlIHN5c3RlbSBlbnZpcm9ubWVudC4pXHJcbiAgICAgKiBAamEg5ouh5by144GX44GfIFtbUkVTVUxUX0NPREVfQkFTRV1dIOOCkiDjg6vjg7zjg4ggZW51bSDjgavjgqLjgrXjgqTjg7M8YnI+XHJcbiAgICAgKiAgICAg44Oi44K444Ol44O844Or44K344K544OG44Og55Kw5aKD44Gr44GK44GE44Gm44KC44CBZW51bSDjgpLjg57jg7zjgrjjgZnjgovjgZ/jgoHjgavlv4XopoFcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIEFTU0lHTl9SRVNVTFRfQ09ERV9CQVNFKHJlc3VsdENvZGVCYXNlOiBvYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBDRFAuUkVTVUxUX0NPREVfQkFTRSA9IDxhbnk+eyAuLi5DRFAuUkVTVUxUX0NPREVfQkFTRSwgLi4ucmVzdWx0Q29kZUJhc2UgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBc3NpZ24gZGVjbGFyZWQgW1tBU1NJR05fUkVTVUxUX0NPREVdXSB0byByb290IGVudW1lcmF0aW9uLlxyXG4gICAgICogICAgIChJdCdzIG5lY2Vzc2FyeSBhbHNvIHRvIG1lcmdlIGVudW0gaW4gdGhlIG1vZHVsZSBzeXN0ZW0gZW52aXJvbm1lbnQuKVxyXG4gICAgICogQGphIOaLoeW8teOBl+OBnyBbW0FTU0lHTl9SRVNVTFRfQ09ERV1dIOOCkiDjg6vjg7zjg4ggZW51bSDjgavjgqLjgrXjgqTjg7NcclxuICAgICAqICAgICDjg6Ljgrjjg6Xjg7zjg6vjgrfjgrnjg4bjg6DnkrDlooPjgavjgYrjgYTjgabjgoLjgIFlbnVtIOOCkuODnuODvOOCuOOBmeOCi+OBn+OCgeOBq+W/heimgVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gQVNTSUdOX1JFU1VMVF9DT0RFKHJlc3VsdENvZGU6IG9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIENEUC5SRVNVTFRfQ09ERSA9IDxhbnk+eyAuLi5DRFAuUkVTVUxUX0NPREUsIC4uLnJlc3VsdENvZGUgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gbW9kdWxlIGVycm9yIGRlY2xhcmF0aW9uOlxyXG5cclxuICAgIGNvbnN0IEZVTkNUSU9OX0NPREVfUkFOR0UgPSAxMDtcclxuXHJcbiAgICAvLyBjZHAuY29yZSDlhoXjga7jg63jg7zjgqvjg6vjgrPjg7zjg4njgqrjg5Xjgrvjg4Pjg4jlgKRcclxuICAgIGVudW0gTE9DQUxfQ09ERV9CQVNFIHtcclxuICAgICAgICBDT1JFICAgID0gMCxcclxuICAgICAgICBQQVRDSCAgID0gMSAqIEZVTkNUSU9OX0NPREVfUkFOR0UsXHJcbiAgICB9XHJcblxyXG4gICAgLy8gQGludGVybmFsIEVycm9yIGNvZGUgZGVmaW5pdGlvbiBvZiBgY2RwLWNvcmVgLlxyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREUge1xyXG4gICAgICAgIEVSUk9SX0NEUF9ERUNMQVJBVElPTl9DRFAgPSAwLCAvLyBUUzI0MzIg5a++562WOiDlkIzkuIAgbmFtZXNwYWNlIOOBq+ikh+aVsOWbnuOBq+OCj+OBn+OBo+OBpuWQjOWQjeOBriBlbnVtIOOCkuWuo+iogOOBmeOCi+WgtOWQiOOBq+W/heimgS5cclxuICAgICAgICAvKiogYGVuYCBbW0NEUC5pbml0aWFsaXplXV0oKSBmYWlsZXIgY29kZS4gPGJyPiBgamFgIFtbQ0RQLmluaXRpYWxpemVdXSgpIOOBruOCqOODqeODvOOCs+ODvOODiSAqL1xyXG4gICAgICAgIEVSUk9SX0NEUF9JTklUSUFMSVpFX0ZBSUxFRCA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUCwgTE9DQUxfQ09ERV9CQVNFLkNPUkUgKyAxLCBcImluaXRpYWxpemVkIGZhaWxlZC5cIiksXHJcbiAgICB9XHJcbiAgICAvLyBcIkNEUFwiIOS7peWkluOBriBuYW1lc3BhY2Ug44Gn5a6a576p44GX44Gf5aC05ZCI44Gv44CBQVNTSUdOIOODpuODvOODhuOCo+ODquODhuOCo+OCkuOCs+ODvOODq+OBmeOCiy5cclxuLy8gIEFTU0lHTl9SRVNVTFRfQ09ERV9CQVNFKFJFU1VMVF9DT0RFKTtcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gcHJpdmF0ZSBzdGF0aWMgbWV0aG9kczpcclxuXHJcbiAgICAvLyBSRVNVTFRfQ09ERSDjga7nmbvpjLJcclxuICAgIGZ1bmN0aW9uIGRlY2xhcmVSZXN1bHRDb2RlKGJhc2U6IFJFU1VMVF9DT0RFX0JBU0UsIG1vZHVsZUNvZGU6IG51bWJlciwgbWVzc2FnZT86IHN0cmluZywgc3VjY2VlZGVkOiBib29sZWFuID0gZmFsc2UpOiBudW1iZXIge1xyXG4gICAgICAgIGlmIChtb2R1bGVDb2RlIDw9IDAgfHwgTU9EVUxFX1JFU1VMVF9DT0RFX1JBTkdFIDw9IG1vZHVsZUNvZGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihgZGVjbGFyZVJlc3VsdENvZGUoKSwgaW52YWxpZCBsb2NhbENvZGUgcmFuZ2UuIFtsb2NhbENvZGU6ICR7bW9kdWxlQ29kZX1dYCk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc2lnbmVkID0gc3VjY2VlZGVkID8gMSA6IC0xO1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdENvZGUgPSBzaWduZWQgKiAoYmFzZSArIG1vZHVsZUNvZGUpO1xyXG4gICAgICAgIHNfY29kZTJtZXNzYWdlW3Jlc3VsdENvZGVdID0gbWVzc2FnZSA/IG1lc3NhZ2UgOiAoYFtSRVNVTFRfQ09ERTogJHtyZXN1bHRDb2RlfV1gKTtcclxuICAgICAgICByZXR1cm4gcmVzdWx0Q29kZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSRVNVTFRfQ09ERSDjgYvjgonnmbvpjLLjgZXjgozjgabjgYTjgovjg6Hjg4Pjgrvjg7zjgrjjgpLlj5blvpdcclxuICAgIGZ1bmN0aW9uIG1lc3NhZ2VGcm9tUmVzdWx0Q29kZShyZXN1bHRDb2RlOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmIChzX2NvZGUybWVzc2FnZVtyZXN1bHRDb2RlXSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc19jb2RlMm1lc3NhZ2VbcmVzdWx0Q29kZV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGB1bnJlZ2lzdGVyZWQgcmVzdWx0IGNvZGUuIFtSRVNVTFRfQ09ERTogJHtyZXN1bHRDb2RlfV1gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBSRVNVTFRfQ09ERSDjgYvjgonnmbvpjLLjgZXjgozjgabjgYTjgosgUkVTVUxUX0NPREUg5paH5a2X5YiX44KS5Y+W5b6XXHJcbiAgICBmdW5jdGlvbiBidWlsZEVycm9yTmFtZShyZXN1bHRDb2RlOiBudW1iZXIsIHRhZzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBwcmVmaXggPSB0YWcgfHwgXCJcIjtcclxuICAgICAgICBpZiAoQ0RQLlJFU1VMVF9DT0RFW3Jlc3VsdENvZGVdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwcmVmaXggKyBDRFAuUkVTVUxUX0NPREVbcmVzdWx0Q29kZV0gKyBFUlJPUl9OQU1FX1NFUEFSQVRPUjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gcHJlZml4ICsgVU5LTk9XTl9FUlJPUl9OQU1FICsgRVJST1JfTkFNRV9TRVBBUkFUT1I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==
