import {
    MODULE_RESULT_CODE_RANGE,
    ASSIGN_RESULT_CODE_BASE,
    DECLARE_ERROR_CODE,
    ASSIGN_RESULT_CODE,
    ErrorInfo,
    isCanceledError,
} from "cdp/framework";
import { Toast } from "cdp/ui";

/**
 * @enum  RESULT_CODE_BASE
 * @brief リザルトコードのオフセット値
 *        本定義はアプリケーション内で分散管理しても良いが、
 *        モジュールごとに被らない運用が必要
 */
export enum RESULT_CODE_BASE {
//    RESULT_CODE_BASE_DECLARATION = 0,       // TS2432 対策
    CAFETERIA_APP       = 1 * MODULE_RESULT_CODE_RANGE,
    CAFETERIA_IMAGES    = 2 * MODULE_RESULT_CODE_RANGE,
    CAFETERIA_SLIDESHOW = 3 * MODULE_RESULT_CODE_RANGE,
    CDP_DEVICECONSOLE   = 4 * MODULE_RESULT_CODE_RANGE,
    CDP_SLIDESHOW       = 5 * MODULE_RESULT_CODE_RANGE,
    CDP_UI_SMOOTHSCROLL = 6 * MODULE_RESULT_CODE_RANGE,
    PMO_SAMPLES         = 7 * MODULE_RESULT_CODE_RANGE,
};
ASSIGN_RESULT_CODE_BASE(RESULT_CODE_BASE);


///////////////////////////////////////////////////////////////////////
// module error declaration:

const FUNCTION_CODE_RANGE = 10;

/**
 * @enum  LOCAL_CODE_BASE
 * @brief cafeteria/app 内のローカルコードオフセット値
 */
enum LOCAL_CODE_BASE {
    COMMON          = 0,
    GALLERY         = 1 * FUNCTION_CODE_RANGE,
    LINKS           = 2 * FUNCTION_CODE_RANGE,
    VIEWS           = 3 * FUNCTION_CODE_RANGE,
    LISTVIEWS       = 4 * FUNCTION_CODE_RANGE,
    NATIVEBRIDGE    = 5 * FUNCTION_CODE_RANGE,
    ADVANCED        = 6 * FUNCTION_CODE_RANGE,
}

/* tslint:disable:max-line-length */
/**
 * @enum  RESULT_CODE
 * @brief アプリケーションのエラーコード定義
 *        base name を指定し、モジュール別に拡張可能
 */
export enum RESULT_CODE {
    RESULT_CODE_DECLARATION = 0,    // TS2432 対策
    ERROR_CAFETERIA_ASSET_ACCESS_FAILED                 = DECLARE_ERROR_CODE("CAFETERIA_APP", LOCAL_CODE_BASE.COMMON + 1, "assets access failed."),
    ERROR_CAFETERIA_NATIVEBRIDGE_METHOD_FAILED          = DECLARE_ERROR_CODE("CAFETERIA_APP", LOCAL_CODE_BASE.NATIVEBRIDGE + 1, "nativebride method call failed."),
}
ASSIGN_RESULT_CODE(RESULT_CODE);
/* tslint:enable:max-line-length */

///////////////////////////////////////////////////////////////////////
// example: handleErrorInfo

/**
 * エラー情報のハンドリング
 *
 * @param [error] [in] エラー情報
 */
export function handleErrorInfo(error?: Error): void {
    const errorInfo = <ErrorInfo>error;
    const detail = <ErrorInfo>{ message: "unknown" };
    let msg, toast: string;
    let code: number;
    if (errorInfo) {
        if (isCanceledError(errorInfo)) {
            return;
        } else {
            msg = (errorInfo.name ? errorInfo.name : "") + errorInfo.message;
            toast = (errorInfo.name ? errorInfo.name + "\n" : "") + errorInfo.message;
            detail.name = errorInfo.name;
            detail.message = errorInfo.message || detail.message;
            detail.code = errorInfo.code;
            detail.cause = errorInfo.cause;
        }
    } else {
        error = error || <any>{};
        msg = toast = error.message || "[Cafeteria] unexpected error.";
        code = CDP.RESULT_CODE.FAILED;
    }

    console.error(msg + "\ndetail: " + JSON.stringify(detail, null, 4));
    if (Config.DEV_FUNCTIONS_ENABLED) {
        Toast.show(toast);
    }
}
