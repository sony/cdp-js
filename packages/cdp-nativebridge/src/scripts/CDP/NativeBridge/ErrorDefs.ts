namespace CDP {

    /**
     * @enum  RESULT_CODE_BASE
     * @brief リザルトコードのオフセット値
     */
    export enum RESULT_CODE_BASE {
        CDP_NATIVEBRIDGE_DECLARERATION = 0, // TS2432 対策
        CDP_NATIVEBRIDGE = 102 * MODULE_RESULT_CODE_RANGE,
    }

    ///////////////////////////////////////////////////////////////////////
    // module error declaration:

    const FUNCTION_CODE_RANGE = 10;

    /**
     * @enum  LOCAL_CODE_BASE
     * @brief cdp.core 内のローカルコードオフセット値
     */
    enum LOCAL_CODE_BASE {
        GATE    = 0,
        UTILS   = 1 * FUNCTION_CODE_RANGE,
    }

    /* tslint:disable:max-line-length */
    /**
     * @enum  RESULT_CODE
     * @brief cdp-nativebridge のエラーコード定義
     */
    export enum RESULT_CODE {
        ERROR_CDP_NATIVEBRIDG_DECLARATION               = 0, // TS2432 対策
        ERROR_CDP_NATIVEBRIDGE_INVALID_ARG              = DECLARE_ERROR_CODE("CDP_NATIVEBRIDGE", LOCAL_CODE_BASE.GATE + 1, "called with invalid args."),
        ERROR_CDP_NATIVEBRIDGE_NOT_IMPLEMENT            = DECLARE_ERROR_CODE("CDP_NATIVEBRIDGE", LOCAL_CODE_BASE.GATE + 2, "method not implemented."),
        ERROR_CDP_NATIVEBRIDGE_NOT_SUPPORT              = DECLARE_ERROR_CODE("CDP_NATIVEBRIDGE", LOCAL_CODE_BASE.GATE + 3, "method not supported."),
        ERROR_CDP_NATIVEBRIDGE_INVALID_OPERATION        = DECLARE_ERROR_CODE("CDP_NATIVEBRIDGE", LOCAL_CODE_BASE.GATE + 4, "invalid operation."),
        ERROR_CDP_NATIVEBRIDGE_CLASS_NOT_FOUND          = DECLARE_ERROR_CODE("CDP_NATIVEBRIDGE", LOCAL_CODE_BASE.GATE + 5, "class not found."),
        ERROR_CDP_NATIVEBRIDGE_METHOD_NOT_FOUND         = DECLARE_ERROR_CODE("CDP_NATIVEBRIDGE", LOCAL_CODE_BASE.GATE + 6, "method not found."),
        ERROR_CDP_NATIVEBRIDGE_CORDOVA_REQUIRED         = DECLARE_ERROR_CODE("CDP_NATIVEBRIDGE", LOCAL_CODE_BASE.UTILS + 1, "cordova required."),
        ERROR_CDP_NATIVEBRIDGE_CORDOVA_PLUGIN_REQUIRED  = DECLARE_ERROR_CODE("CDP_NATIVEBRIDGE", LOCAL_CODE_BASE.UTILS + 2, "'cordova-plugin-cdp-nativebridge' cordova plugin required."),
    }
    /* tslint:enable:max-line-length */
}
