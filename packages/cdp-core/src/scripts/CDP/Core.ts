namespace CDP {

    const TAG = "[CDP] ";

    /**
     * @en Accessor for system global object.<br>
     *     It'll be usually a `window` object.
     * @ja システムの global オブジェクトへのアクセス<br>
     *     通常は `window` オブジェクトとなる
     */
    export const global: any = Function("return this")();


    /**
     * @en Accsessor for Web root location <br>
     *     Only the browser environment will be an allocating place in index.html, and becomes effective.
     * @ja Web root location へのアクセス <br>
     *     index.html の配置場所となり、ブラウザ環境のみ有効となる.
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
     * @en Converter from relative path to absolute url string. <br>
     *     If you want to access to Assets and in spite of the script location, the function is available.
     * @ja 相対 path を絶対 URL に変換 <br>
     *     js の配置に依存することなく `assets` アクセスしたいときに使用する.
     *
     * @see https://stackoverflow.com/questions/2188218/relative-paths-in-javascript-in-an-external-file
     *
     * @example <br>
     *
     * ```ts
     *  console.log(toUrl("/res/data/collection.json"));
     *  // "http://localhost:8080/app/res/data/collection.json"
     * ```
     *
     * @param path
     *  - `en` set relative path from [[webRoot]].
     *  - `ja` [[webRoot]] からの相対パスを指定
     * @returns url string
     *  - `en` set relative path from [[webRoot]].
     *  - `ja` [[webRoot]] からの相対パスを指定
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
     * @en Accessor for global Config object.
     * @ja Config オブジェクトへのアクセス
     */
    export const Config: any = CDP.Config || global.Config || {};

    /**
     * @en Options interface for this module initialize.
     * @ja 初期化オプションインターフェイス
     */
    export interface CoreInitOptions {
        success?: () => void;
        fail?: (error?: any) => void;
        [key: string]: any;
    }

    /**
     * @en Initialize function for `cdp-core`. <br>
     *     This function applies patch to the run time environment.
     * @ja `cdp-core` の初期化関数<br>
     *     環境の差分を吸収する patch を適用する.
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
