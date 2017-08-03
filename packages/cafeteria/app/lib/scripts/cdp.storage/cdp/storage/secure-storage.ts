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
const CLEAR_SIGNATURE = "_clear_";
const MAX_DATA_LIMIT  = 127 * 1024;

// key の排他情報
interface Lock {
    [lock: string]: boolean;
}

// Secure Storage Context 情報
interface Context {
    [namespace: string]: { plugin?: ICordovaSecureStorage; lock?: Lock; };
}

// 保存可能なデータ形式
interface Chunk {
    key: string;
    value: string;
}

/**
 * @class SecureStorage
 * @brief セキュアストレージを操作する IStrage 実装クラス
 */
export default class SecureStorage implements IStorage {

    private static s_context: Context = {};
    private static s_fallbackNamespace: string;

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

        if (!this.lock(key, options)) {
            return Promise.reject(makeErrorInfo(
                RESULT_CODE.ERROR_CDP_STORAGE_SECURESTORAGE_BUSY,
                TAG
            ));
        }

        return new Promise((resolve, reject, dependOn) => {
            let _data: string;
            let _plugin: ICordovaSecureStorage;
            dependOn(convertAsDataText(data))
                .then((text: string) => {
                    _data = text;
                    return dependOn(this.getPlugin(options));
                })
                .then((plugin: ICordovaSecureStorage) => {
                    _plugin = plugin;
                    return dependOn(this.removeData(plugin, key, true));
                })
                .then(() => {
                    return dependOn(this.writeData(_plugin, key, _data));
                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
                .then(() => {
                    this.unlock(key, options);
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

        if (!this.lock(key, options)) {
            return Promise.reject(makeErrorInfo(
                RESULT_CODE.ERROR_CDP_STORAGE_SECURESTORAGE_BUSY,
                TAG
            ));
        }

        return new Promise((resolve, reject, dependOn) => {
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
                })
                .then(() => {
                    this.unlock(key, options);
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

        if (!this.lock(key, options)) {
            return Promise.reject(makeErrorInfo(
                RESULT_CODE.ERROR_CDP_STORAGE_SECURESTORAGE_BUSY,
                TAG
            ));
        }

        return new Promise((resolve, reject, dependOn) => {
            dependOn(this.getPlugin(options))
                .then((plugin: ICordovaSecureStorage) => {
                    return dependOn(this.removeData(plugin, key, false));
                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
                .then(() => {
                    this.unlock(key, options);
                });
        });
    }

    // ストレージの破棄
    clear(options?: ISecureStorageOptions): IPromise<void> {
        if (!this.lock(null, options)) {
            return Promise.reject(makeErrorInfo(
                RESULT_CODE.ERROR_CDP_STORAGE_SECURESTORAGE_BUSY,
                TAG
            ));
        }

        return new Promise((resolve, reject) => {
            this.getPlugin(options)
                .then((plugin: ICordovaSecureStorage) => {
                    plugin.clear(
                        () => {
                            this.unlock(null, options);
                            resolve();
                        },
                        (error: Error) => {
                            this.unlock(null, options);
                            reject(this.makeErrorInfoFromPlugin(error));
                        }
                    );
                });
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods: データ整形

    // 保存可能なデータサイズを保証し分割する
    private ensureData(key: string, value: string): Chunk[] {
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
                    (error: Error) => {
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
                                if (key === _key) {
                                    return true;
                                } else {
                                    return regexp.test(_key);
                                }
                            })
                            .sort();
                        if (Config.DEBUG) {
                            if (key === chunkKeys[0] && 2 <= chunkKeys.length) {
                                console.warn(TAG + `duplicate: the [${key}] has original and chunks.`);
                            }
                        }
                        resolve(chunkKeys);
                    }
                },
                (error: Error) => {
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
                            (error: Error) => {
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
                    if (keys.length <= 0) {
                        return null;
                    } else {
                        return dependOn(read(keys));
                    }
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
                    (error: Error) => {
                        reject(this.makeErrorInfoFromPlugin(error));
                    },
                    removeKey
                );
            };
            proc();
        });
    }

    // 削除
    private removeData(plugin: ICordovaSecureStorage, key: string, fromSet: boolean): IPromise<void> {
        const promise = new Promise<void>((resolve, reject, dependOn) => {
            dependOn(this.queryKeys(plugin, key))
                .then((keys) => {
                    if (fromSet && keys.length <= 1) {
                        return;
                    } else {
                        return this.procRemoveData(plugin, keys);
                    }
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

    // namespace の保証
    private ensureNamespace(options: ISecureStorageOptions): string {
        options = options || {};
        let _namespace = options.namespace || SecureStorage.s_fallbackNamespace;
        if (null == _namespace) {
            SecureStorage.s_fallbackNamespace = Config.namespace || $(document).find("head > title").text() || "cdp.storage";
            _namespace = SecureStorage.s_fallbackNamespace;
        }
        return _namespace;
    }

    // Context からの plugin 検索
    private findPluginFromContext(_namespace: string): ICordovaSecureStorage {
        if (SecureStorage.s_context[_namespace] && SecureStorage.s_context[_namespace].plugin) {
            return SecureStorage.s_context[_namespace].plugin;
        }
    }

    // cordova plugin の取得
    private getPlugin(options: ISecureStorageOptions): IPromise<ICordovaSecureStorage> {
        return new Promise((resolve, reject) => {
            waitForDeviceReady()
                .then(() => {
                    const _namespace = this.ensureNamespace(options);
                    let plugin = this.findPluginFromContext(_namespace);
                    if (plugin) {
                        resolve(plugin);
                    } else {
                        plugin = new cordova.plugins.SecureStorage(
                            () => {
                                SecureStorage.s_context[_namespace] = { plugin: plugin, lock: {} };
                                resolve(plugin);
                            },
                            (message: Error) => {
                                reject(this.makeErrorInfoFromPlugin(message));
                            },
                            _namespace
                        );
                    }
                });
        });
    }

    // context の取得
    private getLockContext(options: ISecureStorageOptions): { lock?: Lock } {
        const _namespace = this.ensureNamespace(options);
        if (null == SecureStorage.s_context[_namespace]) {
            SecureStorage.s_context[_namespace] = { lock: {} };
        }
        return SecureStorage.s_context[_namespace];
    }

    // lock の獲得
    private lock(key: string, options: ISecureStorageOptions): boolean {
        const context = this.getLockContext(options);
        if (null != key) {
            if (context.lock[CLEAR_SIGNATURE] || context.lock[key]) {
                return false;
            } else {
                context.lock[key] = true;
                return true;
            }
        } else {
            if (0 < Object.keys(context.lock).length) {
                return false;
            } else {
                context.lock[CLEAR_SIGNATURE] = true;
                return true;
            }
        }
    }

    // lock の解除
    private unlock(key: string, options: ISecureStorageOptions): void {
        const context = this.getLockContext(options);
        if (null != key) {
            delete context.lock[key];
        } else {
            delete context.lock[CLEAR_SIGNATURE];
        }
    }

    // Plugin エラーメッセージから ErrorInfo を生成
    private makeErrorInfoFromPlugin(error?: Error | string): ErrorInfo {
        if ("string" === typeof error) {
            error = <Error>{ message: error };
        } else {
            error = error || <Error>{};
        }
        error.name = "cordova-plugin-secure-storage";
        return makeErrorInfo(
            RESULT_CODE.ERROR_CDP_STORAGE_SECURESTORAGE_OPERATION,
            TAG,
            error.message,
            error
        );
    }
}
