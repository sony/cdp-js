namespace CDP {

    /**
     * @enum  RESULT_CODE_BASE
     * @brief リザルトコードのオフセット値
     */
    export enum RESULT_CODE_BASE {
        CDP_TOOLS_DECLARERATION = 0,    // TS2432 対策
        CDP_TOOLS = 4 * MODULE_RESULT_CODE_RANGE_CDP,
    }

    ///////////////////////////////////////////////////////////////////////
    // module error declaration:

    const FUNCTION_CODE_RANGE = 10;

    /**
     * @enum  LOCAL_CODE_BASE
     * @brief cdp.tools 内のローカルコードオフセット値
     */
    enum LOCAL_CODE_BASE {
        FUNCTIONS   = 0,
        BLOB        = 1 * FUNCTION_CODE_RANGE,
    }

    /* tslint:disable:max-line-length */
    /**
     * @enum  RESULT_CODE
     * @brief cdp.tools のエラーコード定義
     */
    export enum RESULT_CODE {
        ERROR_CDP_TOOLS_DECLARATION         = 0, // TS2432 対策
        ERROR_CDP_TOOLS_IMAGE_LOAD_FAILED   = DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_TOOLS, LOCAL_CODE_BASE.FUNCTIONS + 1, "image load failed."),
        ERROR_CDP_TOOLS_INVALID_IMAGE       = DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_TOOLS, LOCAL_CODE_BASE.FUNCTIONS + 2, "invalid image."),
        ERROR_CDP_TOOLS_FILE_READER_ERROR   = DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_TOOLS, LOCAL_CODE_BASE.BLOB + 1, "FileReader method failed."),
    }
    /* tslint:enable:max-line-length */
}
