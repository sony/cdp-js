namespace CDP.NativeBridge {

    import Plugin   = CDP.Plugin.NativeBridge;

    /**
     * \~english
     * @interface Feature
     * @brief feature information.
     *
     * \~japanese
     * @interface Feature
     * @brief 機能情報
     */
    export interface Feature extends Plugin.Feature { }

    /**
     * \~english
     * @interface ConstructOptions
     * @brief NativeBridge class's consrtruction options.
     *
     * \~japanese
     * @interface ConstructOptions
     * @brief 初期化に指定するオプション
     */
    export interface ConstructOptions extends Plugin.ConstructOptions { }

    /**
     * \~english
     * @interface IResult
     * @brief NativeBridge base result information.
     *
     * \~japanese
     * @interface IResult
     * @brief NativeBridge の基底 Result 情報
     */
    export interface IResult extends Plugin.IResult { }

    /**
     * \~english
     * @interface ExecOptions
     * @brief exec() method options.
     *
     * \~japanese
     * @interface ExecOptions
     * @brief exec() に渡すオプション
     */
    export interface ExecOptions extends Plugin.ExecOptions { }
}
