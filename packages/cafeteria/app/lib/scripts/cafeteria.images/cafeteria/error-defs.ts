import {
    MODULE_RESULT_CODE_RANGE,
    DECLARE_ERROR_CODE,
    ASSIGN_RESULT_CODE,
} from "cdp";

///////////////////////////////////////////////////////////////////////
// module error declaration:

const RESULT_CODE_BASE = 2 * MODULE_RESULT_CODE_RANGE;

/**
 * @enum  LOCAL_CODE_BASE
 * @brief cafeteria/app 内のローカルコードオフセット値
 */
enum LOCAL_CODE_BASE {
    COMMON = 0,
    LOCAL_CONTENT,
}

/* tslint:disable:max-line-length */
/**
 * @enum  RESULT_CODE
 * @brief モジュールのエラーコード定義
 */
export enum RESULT_CODE {
    ERROR_CAFETERIA_IMAGES_TEST                                     = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.COMMON + 1, "test declaration"),
    ERROR_CAFETERIA_IMAGES_LOCAL_CONTENTS_QUERY_CONTENTS_FAILED     = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.LOCAL_CONTENT + 1, "query local contents failed."),
    ERROR_CAFETERIA_IMAGES_LOCAL_CONTENTS_QUERY_THUMBNAIL_FAILED    = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.LOCAL_CONTENT + 2, "query thumbnail failed."),
    ERROR_CAFETERIA_IMAGES_LOCAL_CONTENTS_QUERY_IMAGE_SOURCE_FAILED = DECLARE_ERROR_CODE(RESULT_CODE_BASE, LOCAL_CODE_BASE.LOCAL_CONTENT + 3, "query image source failed."),
}
ASSIGN_RESULT_CODE(RESULT_CODE);
/* tslint:enable:max-line-length */
