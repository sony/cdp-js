import {
    MODULE_RESULT_CODE_RANGE,
    DECLARE_ERROR_CODE,
    ASSIGN_RESULT_CODE,
} from "cdp";

///////////////////////////////////////////////////////////////////////
// module error declaration:

const RESULT_CODE_BASE = 3 * MODULE_RESULT_CODE_RANGE;

/**
 * @enum  LOCAL_CODE_BASE
 * @brief cafeteria/app 内のローカルコードオフセット値
 */
enum LOCAL_CODE_BASE {
    COMMON = 0,
}

/* tslint:disable:max-line-length */
/**
 * @enum  RESULT_CODE
 * @brief モジュールのエラーコード定義
 */
export enum RESULT_CODE {
    ERROR_CAFETERIA_SLIDESHOE_TEST = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.COMMON + 1, "test declaration"),
}
ASSIGN_RESULT_CODE(RESULT_CODE);
/* tslint:enable:max-line-length */
