namespace CDP {

    // @internal Error code offset definition of `cdp-i18n`.
    export enum RESULT_CODE_BASE {
        CDP_I18N_DECLARERATION = 0, // TS2432 対策
        CDP_I18N = 3 * _MODULE_RESULT_CODE_RANGE_CDP,
    }

    ///////////////////////////////////////////////////////////////////////
    // module error declaration:

    /**
     * @enum  LOCAL_CODE_BASE
     * @brief cdp.i18n 内のローカルコードオフセット値
     */
    enum LOCAL_CODE_BASE {
        I18N = 0,
    }

    /* tslint:disable:max-line-length */
    // @internal Error code definition of `cdp-i18n`.
    export enum RESULT_CODE {
        ERROR_CDP_I18N_DECLARATION = 0, // TS2432 対策
        /** `en` [[CDP.initializeI18N]]() failer code. <br> `ja` [[CDP.initializeI18N]]() のエラーコード */
        ERROR_CDP_I18N_INITIALIZE_FAILED = DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_I18N, LOCAL_CODE_BASE.I18N + 1, "i18n initialize failed."),
    }
    /* tslint:enable:max-line-length */
}
