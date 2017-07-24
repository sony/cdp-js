namespace CDP {

    /**
     * @enum  RESULT_CODE_BASE
     * @brief リザルトコードのオフセット値
     */
    export enum RESULT_CODE_BASE {
        CDP_FRAMEWORK_DECLARERATION = 0,    // TS2432 対策
        CDP_FRAMEWORK = 103 * MODULE_RESULT_CODE_RANGE,
    }

    ///////////////////////////////////////////////////////////////////////
    // module error declaration:

    const FUNCTION_CODE_RANGE = 10;

    /**
     * @enum  LOCAL_CODE_BASE
     * @brief cdp.core 内のローカルコードオフセット値
     */
    enum LOCAL_CODE_BASE {
        CoreAPI = 0,
        Router  = 1 * FUNCTION_CODE_RANGE,
        Page    = 2 * FUNCTION_CODE_RANGE,
    }

    /* tslint:disable:max-line-length */
    /**
     * @enum  RESULT_CODE
     * @brief cdp-framework-jqm のエラーコード定義
     */
    export enum RESULT_CODE {
        ERROR_CDP_FRAMEWORK_DECLARATION                 = 0, // TS2432 対策
        ERROR_CDP_FRAMEWORK_INITIALIZE_FAILED           = DECLARE_ERROR_CODE("CDP_FRAMEWORK", LOCAL_CODE_BASE.CoreAPI + 1, "framework initialize failed."),
        ERROR_CDP_FRAMEWORK_ROUTER_INITIALIZE_FAILED    = DECLARE_ERROR_CODE("CDP_FRAMEWORK", LOCAL_CODE_BASE.Router + 1, "router initialize failed."),
    }
    /* tslint:enable:max-line-length */
}
