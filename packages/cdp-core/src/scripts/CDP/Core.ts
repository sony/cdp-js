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
     * path を URL に変換
     *
     * @param path パスを指定。
     * @returns webRoot からの URL。
     */
    export function toUrl(path: string): string {
        const root = webRoot || "";
        if (null != path[0]) {
            if ("/" === path[0]) {
                return root + path.slice(1);
            } else {
                return root + path;
            }
        } else {
            return root;
        }
    }

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
                const errorInfo = makeErrorInfo(
                    RESULT_CODE.ERROR_CDP_INITIALIZE_FAILED,
                    TAG,
                    (error && error.message) ? error.message : null,
                    error
                );
                console.error(errorInfo.message);
                if (options && typeof options.fail === "function") {
                    options.fail(errorInfo);
                }
            }
        });
    }
}

declare module "cdp.core" {
    export = CDP;
}
