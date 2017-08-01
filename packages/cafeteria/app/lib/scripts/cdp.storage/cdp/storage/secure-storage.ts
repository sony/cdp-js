import {
    Config,
    IPromise,
    Promise,
    ErrorInfo,
    makeErrorInfo,
    waitForDeviceReady,
} from "cdp";
import {
    IStorage,
    ISecureStorageOptions,
    ISecureStorageGetItemOptions,
    ISecureStorageSetItemOptions,
    ISecureStorageRemoveItemOptions,
    STORAGE_KIND,
    MIME_TYPE_BINRAY_DATA,
} from "./interfaces";
import { RESULT_CODE } from "./error-defs";
import {
    convertAsDataText,
    convertFromDataText,
} from "./utils";

const TAG = "[cdp.storage.secure-storage] ";

/**
 * @class SecureStorage
 * @brief セキュアストレージを操作する IStrage 実装クラス
 */
export default class SecureStorage implements IStorage {

    private _fallbackNamespace: string;

    ///////////////////////////////////////////////////////////////////////
    // Implements: IStorage

    // 種別
    get kind(): string {
        return STORAGE_KIND.SECURE_STORAGE;
    }

    // データ設定
    setItem(key: string, data: any, options?: ISecureStorageSetItemOptions): IPromise<void> {
        if (!key) {
            return Promise.reject(makeErrorInfo(
                RESULT_CODE.ERROR_CDP_STORAGE_INVALID_PARAM,
                TAG,
                "key is null."
            ));
        }

        if (null == data) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject, dependOn) => {
            options = options || {};
            dependOn(convertAsDataText(data))
                .then((text: string) => {
                    this.getPlugin(options)
                        .then((plugin: ICordovaSecureStorage) => {
                            plugin.set(
                                (_key: string) => {
                                    resolve();
                                },
                                (error: string) => {
                                    reject(this.makeErrorInfoFromPlugin(error));
                                },
                                key, text
                            );
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // データ取得
    getItem(key: string, options?: ISecureStorageGetItemOptions): IPromise<any> {
        if (!key) {
            return Promise.reject(makeErrorInfo(
                RESULT_CODE.ERROR_CDP_STORAGE_INVALID_PARAM,
                TAG,
                "key is null."
            ));
        }

        return new Promise((resolve, reject, dependOn) => {
            options = options || {};

            let dataType = "text";
            let mimeType = MIME_TYPE_BINRAY_DATA;

            if (options.dataInfo) {
                dataType = options.dataInfo.dataType || dataType;
                mimeType = options.dataInfo.mimeType || mimeType;
            }

            const read = (): IPromise<string> => {
                return new Promise((_resolve, _reject) => {
                    this.getPlugin(options)
                        .then((plugin: ICordovaSecureStorage) => {
                            plugin.get(
                                (text: string) => {
                                    _resolve(text);
                                },
                                (error: string) => {
                                    _reject(this.makeErrorInfoFromPlugin(error));
                                },
                                key
                            );
                        });
                });
            };

            dependOn(read())
                .then((text: string) => {
                    if (null != text) {
                        return dependOn(convertFromDataText(text, dataType, mimeType));
                    } else {
                        return null;
                    }
                })
                .done((data: any) => {
                    resolve(data);
                })
                .fail((error) => {
                    reject(error);
                });
        });
    }

    // 指定したデータを削除
    removeItem(key: string, options?: ISecureStorageRemoveItemOptions): IPromise<void> {
        if (!key) {
            return Promise.reject(makeErrorInfo(
                RESULT_CODE.ERROR_CDP_STORAGE_INVALID_PARAM,
                TAG,
                "key is null."
            ));
        }

        return new Promise((resolve, reject) => {
            options = options || {};

            this.getPlugin(options)
                .then((plugin: ICordovaSecureStorage) => {
                    plugin.remove(
                        () => {
                            resolve();
                        },
                        (error: string) => {
                            reject(this.makeErrorInfoFromPlugin(error));
                        },
                        key
                    );
                });
        });
    }

    // ストレージの破棄
    clear(options?: ISecureStorageOptions): IPromise<void> {
        return new Promise((resolve, reject) => {
            options = options || {};

            this.getPlugin(options)
                .then((plugin: ICordovaSecureStorage) => {
                    plugin.clear(
                        () => {
                            resolve();
                        },
                        (error: string) => {
                            reject(this.makeErrorInfoFromPlugin(error));
                        }
                    );
                });
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods: エラー情報生成

    // cordova plugin の取得
    private getPlugin(options: ISecureStorageOptions): IPromise<ICordovaSecureStorage> {
        return new Promise((resolve, reject) => {
            waitForDeviceReady()
                .then(() => {
                    let _namespace = options.namespace || this._fallbackNamespace;
                    if (null == _namespace) {
                        this._fallbackNamespace = Config.namespace || $(document).find("head > title").text() || "cdp.storage";
                        _namespace = this._fallbackNamespace;
                    }
                    const plugin = new cordova.plugins.SecureStorage(
                        () => {
                            resolve(plugin);
                        },
                        (message: string) => {
                            reject(this.makeErrorInfoFromPlugin(message));
                        },
                        _namespace
                    );
                });
        });
    }

    // Plugin エラーメッセージから ErrorInfo を生成
    private makeErrorInfoFromPlugin(message?: string): ErrorInfo {
        return makeErrorInfo(
            RESULT_CODE.ERROR_CDP_STORAGE_SECURESTORAGE_OPERATION,
            TAG,
            message,
            <Error>{
                name: "cordova-plugin-secure-storage",
                message: message,
            }
        );
    }
}
