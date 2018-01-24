/// <reference path="../../@types/cdp.plugin.nativebridge.d.ts" />

namespace CDP.NativeBridge {

    import Plugin   = CDP.Plugin.NativeBridge;

    /**
     * @en Cordova feature information.
     * @ja 機能情報
     */
    export interface Feature extends Plugin.Feature { }

    /**
     * @en NativeBridge class's consrtruction options.
     * @ja 初期化に指定するオプション
     */
    export interface ConstructOptions extends Plugin.ConstructOptions {
        /**
         * @en [Backward Compat] if you want to receive IResult instance when exec() called, set the param 'true'. default: false
         * @ja [過去互換用] exec コール時に, IResult で返却する場合 true. default: false
         */
        useRawPluginResult?: boolean;
    }

    /**
     * @en NativeBridge base result information.
     * @ja NativeBridge の基底 Result 情報
     */
    export interface IResult extends Plugin.IResult, Error {
        message: string;
        name: string;
    }

    /**
     * @en exec() method options.
     * @ja exec() に渡すオプション
     */
    export interface ExecOptions extends Plugin.ExecOptions {
        /**
         * @en [Backward Compat] if you want to receive IResult instance when exec() called, set the param 'true'.
         *     default: use ConstructOptions param
         * @ja [過去互換用] exec コール時に, IResult で返却する場合 true.
         *     default: ConstructOptions param 指定された値を使用
         */
        useRawPluginResult?: boolean;
    }
}

declare module "cdp.nativebridge" {
    const NativeBridge: typeof CDP.NativeBridge;
    export = NativeBridge;
}
