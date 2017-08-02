import {
    Config,
    IPromise,
    IPromiseBase,
    Promise,
    ErrorInfo,
    makeErrorInfo,
    waitForDeviceReady,
    Tools,
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
const CHUNK_SIGNATURE = "chunk:";
const MAX_DATA_LIMIT  = 127 * 1024;

// 保存可能なデータ形式
interface KeyValue {
    key: string;
    value: string;
}

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
            let _data: string;
            dependOn(convertAsDataText(data))
                .then((text: string) => {
                    _data = text;
                    return dependOn(this.getPlugin(options));
                })
                .then((plugin: ICordovaSecureStorage) => {
                    return dependOn(this.writeData(plugin, key, _data));
                })
                .then(() => {
                    resolve();
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

            dependOn(this.getPlugin(options))
                .then((plugin: ICordovaSecureStorage) => {
                    return dependOn(this.readData(plugin, key));
                })
                .then((text: string) => {
                    if (null != text) {
                        return dependOn(convertFromDataText(text, dataType, mimeType));
                    } else {
                        return null;
                    }
                })
                .then((data: any) => {
                    resolve(data);
                })
                .catch((error) => {
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

        return new Promise((resolve, reject, dependOn) => {
            options = options || {};

            dependOn(this.getPlugin(options))
                .then((plugin: ICordovaSecureStorage) => {
                    return dependOn(this.removeData(plugin, key));
                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
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
    // private methods: データ整形

    // 保存可能なデータサイズを保証し分割する
    private ensureData(key: string, value: string): KeyValue[] {
        const chunks = Tools.toStringChunks(value, MAX_DATA_LIMIT);
        if (1 === chunks.length) {
            return [{ key: key, value: value }];
        } else {
            const retval = [];
            chunks.forEach((chunk, index) => {
                retval.push({
                    key: `${key}[${CHUNK_SIGNATURE}${Tools.toZeroPadding(index, 4)}]`,
                    value: chunk,
                });
            });
            return retval;
        }
    }

    // 書き込み
    private writeData(plugin: ICordovaSecureStorage, key: string, data: string): IPromise<void> {
        const completeKeys = [];
        const cancel = () => {
            this.procRemoveData(plugin, completeKeys);
        };

        const promise = new Promise<void>((resolve, reject) => {
            const dataChunk = this.ensureData(key, data);
            const proc = () => {
                const chunk = dataChunk.shift();
                if ("pending" !== promise.state()) {
                    return;
                }
                if (null == chunk) {
                    resolve();
                    return;
                }
                plugin.set(
                    (_key: string) => {
                        completeKeys.push(_key);
                        setTimeout(proc);
                    },
                    (error: string) => {
                        reject(this.makeErrorInfoFromPlugin(error));
                    },
                    chunk.key, chunk.value
                );
            };
            setTimeout(proc);
        }, cancel);

        return promise;
    }

    // 対象の key を取得
    private queryKeys(plugin: ICordovaSecureStorage, key: string): IPromise<string[]> {
        let chunkKeys: string[];
        const promise = new Promise<string[]>((resolve, reject) => {
            plugin.keys(
                (keys: string[]) => {
                    if ("pending" === promise.state()) {
                        const regexp = new RegExp(`^${key}\\[${CHUNK_SIGNATURE}`);
                        chunkKeys = keys
                            .filter((_key) => {
                                return regexp.test(_key);
                            })
                            .sort();
                        if (chunkKeys.length <= 0) {
                            chunkKeys.push(key);
                        }
                        resolve(chunkKeys);
                    }
                },
                (error: string) => {
                    reject(this.makeErrorInfoFromPlugin(error));
                },
            );
        });
        return promise;
    }

    // 読み込み
    private readData(plugin: ICordovaSecureStorage, key: string): IPromise<string> {
        const promise = new Promise<string>((resolve, reject, dependOn) => {
            const read = (_keys: string[]): IPromise<string> => {
                let _data = "";
                const _promise = new Promise<string>((_resolve, _reject) => {
                    const proc = () => {
                        if ("pending" !== _promise.state()) {
                            return;
                        }
                        const _key = _keys.shift();
                        if (null == _key) {
                            _resolve(_data);
                            return;
                        }
                        plugin.get(
                            (chunk: string) => {
                                _data += chunk;
                                setTimeout(proc);
                            },
                            (error: string) => {
                                _reject(this.makeErrorInfoFromPlugin(error));
                            },
                            _key
                        );
                    };
                    setTimeout(proc);
                });
                return _promise;
            };

            dependOn(this.queryKeys(plugin, key))
                .then((keys) => {
                    return dependOn(read(keys));
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });

        return promise;
    }

    // 削除処理: キャンセル不可
    private procRemoveData(plugin: ICordovaSecureStorage, keys: string[]): IPromiseBase<void> {
        return new Promise((resolve, reject) => {
            const proc = () => {
                const removeKey = keys.shift();
                if (null == removeKey) {
                    return resolve();
                }
                plugin.remove(
                    () => {
                        setTimeout(proc);
                    },
                    (error: string) => {
                        reject(this.makeErrorInfoFromPlugin(error));
                    },
                    removeKey
                );
            };
            proc();
        });
    }

    // 削除
    private removeData(plugin: ICordovaSecureStorage, key: string): IPromise<void> {
        const promise = new Promise<void>((resolve, reject, dependOn) => {
            dependOn(this.queryKeys(plugin, key))
                .then((keys) => {
                    return this.procRemoveData(plugin, keys);
                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });

        return promise;
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
