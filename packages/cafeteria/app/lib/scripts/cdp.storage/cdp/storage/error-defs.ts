import {
    DECLARE_ERROR_CODE,
    ASSIGN_RESULT_CODE,
} from "cdp";

///////////////////////////////////////////////////////////////////////
// module error declaration:

const RESULT_CODE_BASE      = 7 * CDP.MODULE_RESULT_CODE_RANGE_CDP;
const FUNCTION_CODE_RANGE   = 10;

/**
 * @enum  LOCAL_CODE_BASE
 * @brief cafeteria/app 内のローカルコードオフセット値
 */
enum LOCAL_CODE_BASE {
    STORAGE_ACCESS  = 0,
    DEVICE_STORAGE  = 1 * FUNCTION_CODE_RANGE,
    SECURE_STORAGE  = 2 * FUNCTION_CODE_RANGE,
    WEB_STORAGE     = 3 * FUNCTION_CODE_RANGE,
}

/* tslint:disable:max-line-length */
/**
 * @enum  RESULT_CODE
 * @brief モジュールのエラーコード定義
 */
export enum RESULT_CODE {
    ERROR_CDP_STORAGE_UNEXPECTED                = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.STORAGE_ACCESS + 1, "unexpected error occured."),
    ERROR_CDP_STORAGE_INVALID_JSON              = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.STORAGE_ACCESS + 2, "json is invalid."),
    ERROR_CDP_STORAGE_INVALID_BASE64            = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.STORAGE_ACCESS + 3, "base64 is invalid."),
    ERROR_CDP_STORAGE_DATA_NOT_SUPPORTED        = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.STORAGE_ACCESS + 4, "data is unspported."),
    ERROR_CDP_STORAGE_INVALID_PARAM             = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.STORAGE_ACCESS + 5, "invalid parameter."),
    ERROR_CDP_STORAGE_DEVICE_FILE_OPERATION     = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.DEVICE_STORAGE + 1, "Device Storage file operation error."),
    ERROR_CDP_STORAGE_DEVICE_FILE_SECURITY_ERR  = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.DEVICE_STORAGE + 2, "Device Storage file sequrity error."),
    ERROR_CDP_STORAGE_SECURESTORAGE_OPERATION   = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.SECURE_STORAGE + 1, "Secure Storage operation error."),
}
ASSIGN_RESULT_CODE(RESULT_CODE);
/* tslint:enable:max-line-length */
