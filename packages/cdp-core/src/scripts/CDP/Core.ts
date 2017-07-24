namespace CDP {

    const TAG = "[CDP] ";

    /**
     * システムの global オブジェクトにアクセス
     * 通常は Window オブジェクトとなる
     */
    export const global: any = Function("return this")();


    /**
     * Web root location にアクセス
     */
    export const webRoot: string = (() => {
        if (global.location) {
            let baseUrl = /(.+\/)[^/]*#[^/]+/.exec(global.location.href);
            if (!baseUrl) {
                baseUrl = /(.+\/)/.exec(global.location.href);
            }
            return baseUrl[1];
        }
    })();

    /**
     * Config オブジェクトにアクセス
     */
    export const Config: any = CDP.Config || global.Config || {};

    /**
     * 初期化オプションインターフェイス
     */
    export interface CoreInitOptions {
        success?: () => void;
        fail?: (error?: any) => void;
        [key: string]: any;
    }

    /**
     * core の初期化
     */
    export function initialize(options?: CoreInitOptions): void {
        setTimeout(() => {
            try {
                Patch.apply();
                if (options && typeof options.success === "function") {
                    options.success();
                }
            } catch (error) {
                const msg = (error && error.message) ? error.message : "initialize failed.";
                console.error(TAG + msg);
                if (options && typeof options.fail === "function") {
                    options.fail(error);
                }
            }
        });
    }
}

declare module "cdp.core" {
    export = CDP;
}
