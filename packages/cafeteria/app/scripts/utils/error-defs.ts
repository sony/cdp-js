import {
    Config,
    MODULE_RESULT_CODE_RANGE,
    DECLARE_ERROR_CODE,
    ASSIGN_RESULT_CODE,
    ErrorInfo,
    isCanceledError,
    ensureErrorInfo,
} from "cdp";
import { Toast } from "cdp/ui";
import { RESULT_CODE as RESULT_CODE_IMAGES } from "cafeteria.images";
import { RESULT_CODE as RESULT_CODE_SLIDESHOW } from "cafeteria.slideshow";

///////////////////////////////////////////////////////////////////////
// module error declaration:

const RESULT_CODE_BASE = 1 * MODULE_RESULT_CODE_RANGE;
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
    ERROR_CAFETERIA_ASSET_ACCESS_FAILED         = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.COMMON + 1, "assets access failed."),
    ERROR_CAFETERIA_NATIVEBRIDGE_METHOD_FAILED  = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.NATIVEBRIDGE + 1, "nativebride method call failed."),
}
ASSIGN_RESULT_CODE(RESULT_CODE);
/* tslint:enable:max-line-length */

// アプリケーション定義の RESULT_CODE をマージ可
const MERGED_RESULT_CODE = { ...RESULT_CODE, ...RESULT_CODE_IMAGES, ...RESULT_CODE_SLIDESHOW };
export default MERGED_RESULT_CODE;

///////////////////////////////////////////////////////////////////////
// example: handleErrorInfo

/**
 * エラー情報のハンドリング
 *
 * @param [error] [in] エラー情報
 */
export function handleErrorInfo(error?: Error): void {
    const errorInfo = ensureErrorInfo(error);
    if (isCanceledError(errorInfo)) {
        return;
    }
    const msg = `${errorInfo.name} ${errorInfo.message}`;
    const toast = `${errorInfo.name}\n${errorInfo.message}`;

    console.error(msg + "\ndetail: " + JSON.stringify(errorInfo, null, 4));
    if (Config.DEV_FUNCTIONS_ENABLED) {
        Toast.show(toast);
    }
}
