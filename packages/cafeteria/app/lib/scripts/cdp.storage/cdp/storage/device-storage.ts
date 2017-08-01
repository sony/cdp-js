import {
    IPromise,
    Promise,
    makePromise,
    ErrorInfo,
    makeErrorInfo,
    waitForDeviceReady,
} from "cdp";
import {
    IStorage,
    IDeviceStorageOptions,
    IDeviceStorageGetItemOptions,
    IDeviceStorageSetItemOptions,
    IDeviceStorageRemoveItemOptions,
    STORAGE_KIND,
} from "./interfaces";
import { RESULT_CODE } from "./error-defs";
import {
    convertAsDataBlob,
    convertFromDataBlob,
} from "./utils";

const TAG = "[cdp.storage.device-storage] ";

/**
 * @class DeviceStorage
 * @brief モバイルデバイスのストレージを操作する IStrage 実装クラス
 */
export default class DeviceStorage implements IStorage {

    private static _handleDeviceReady = false;

    ///////////////////////////////////////////////////////////////////////
    // Implements: IStorage

    // 種別
    get kind(): string {
        return STORAGE_KIND.DEVICE_STORAGE;
    }

    // データ設定
    setItem(key: string, data: any, options?: IDeviceStorageSetItemOptions): IPromise<void> {
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
            let mimeType: string;

            if (options && options.dataInfo) {
                mimeType = options.dataInfo.mimeType;
            }

            dependOn(this.waitForDeviceReady())
                .then(() => {
                    return dependOn(convertAsDataBlob(data, mimeType));
                })
                .then((blob: Blob) => {
                    return dependOn(this.saveItem(key, blob, options || {}));
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
    getItem(key: string, options?: IDeviceStorageGetItemOptions): IPromise<any> {
        if (!key) {
            return Promise.reject(makeErrorInfo(
                RESULT_CODE.ERROR_CDP_STORAGE_INVALID_PARAM,
                TAG,
                "key is null."
            ));
        }

        return new Promise((resolve, reject, dependOn) => {
            dependOn(this.waitForDeviceReady())
                .then(() => {
                    return dependOn(this.loadItem(key, options || {}));
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // 指定したデータを削除
    removeItem(key: string, options?: IDeviceStorageRemoveItemOptions): IPromise<void> {
        if (!key) {
            return Promise.reject(makeErrorInfo(
                RESULT_CODE.ERROR_CDP_STORAGE_INVALID_PARAM,
                TAG,
                "key is null."
            ));
        }

        return new Promise((resolve, reject, dependOn) => {
            dependOn(this.waitForDeviceReady())
                .then(() => {
                    return dependOn(this.removeEntry(key, options || {}));
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
    clear(options?: IDeviceStorageOptions): IPromise<void> {
        return new Promise((resolve, reject, dependOn) => {
            dependOn(this.waitForDeviceReady())
                .then(() => {
                    return dependOn(this.clearEntries(options || {}));
                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods: 共通

    // "deviceready" イベントの保証
    private waitForDeviceReady(): IPromise<void> {
        return new Promise((resolve) => {
            if (!DeviceStorage._handleDeviceReady) {
                waitForDeviceReady()
                    .then(() => {
                        DeviceStorage._handleDeviceReady = true;
                        resolve();
                    });
            } else {
                resolve();
            }
        });
    }

    // パスを分解
    private splitPath(path: string): { dir: string; file: string; } {
        const retval = {
            dir: "",
            file: "",
        };

        if (!path) {
            return retval;
        }

        const split = path.split("/");

        retval.file = split.pop();

        if (0 < split.length && "" === split[0]) {
            split.shift();
        }
        if (0 < split.length) {
            retval.dir = split.join("/");
        }

        return retval;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods: 保存

    /**
     * ファイル出力
     * <dataRoot>は既定では cordova-plugin-file の cordova.file.dataDirectory を用いる
     *
     * @param key       [in] "dataDirectory" からのパスを指定. ex) /data/example.mp3
     * @param data      [in] Blob オブジェクトを指定
     * @param options   [in] オプション
     * @returns Promise オブジェクト
     */
    private saveItem(key: string, data: Blob, options: IDeviceStorageSetItemOptions): IPromise<void> {
        return new Promise((resolve, reject, dependOn) => {
            const split = this.splitPath(key);
            const root = options.root || cordova.file.dataDirectory;

            window.resolveLocalFileSystemURL(
                root,
                (entry: DirectoryEntry) => {
                    dependOn(this.ensureDirectory(entry, split))
                        .then((_entry: DirectoryEntry) => {
                            return dependOn(this.createFile(_entry, split.file, data, options));
                        })
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                },
                (error: FileError) => {
                    reject(this.makeErrorInfoFromFileError(error, "resolveLocalFileSystemURI() failed."));
                });
        });
    }

    // ディレクトリ作成
    private ensureDirectory(entry: DirectoryEntry, info: { dir: string; file: string; }): IPromise<DirectoryEntry> {
        if (null == info.dir) {
            return Promise.resolve(entry);
        }
        return new Promise((resolve, reject) => {
            let newEntry = entry;
            const dirs = info.dir.split("/");
            const proc = () => {
                const dir = dirs.shift();
                if (!dir) {
                    resolve(newEntry);
                    return;
                }
                newEntry.getDirectory(dir, { create: true },
                    (_entry: DirectoryEntry) => {
                        newEntry = _entry;
                        setTimeout(proc);
                    },
                    (error: FileError) => {
                        reject(this.makeErrorInfoFromFileError(error, "create directory failed."));
                    });
            };
            setTimeout(proc);
        });
    }

    // ファイル作成
    private createFile(entry: DirectoryEntry, file: string, data: Blob, options: IDeviceStorageSetItemOptions): IPromise<void> {
        let _writer: FileWriter;

        const canceler = () => {
            if (_writer) {
                _writer.abort();
            }
        };

        const df = $.Deferred<void>();
        const promise = makePromise(df, canceler);

        entry.getFile(file, { create: true },
            // win
            (_entry: FileEntry) => {
                if ("pending" === df.state()) {             // for cancel check
                    _entry.createWriter(
                        // win
                        (writer: FileWriter) => {
                            if ("pending" === df.state()) { // for cancel check
                                _writer = writer;           // set for canceler

                                writer.write(data);
                                writer.onwriteend = (event: ProgressEvent) => {
                                    df.resolve();
                                };
                                writer.onprogress = (event: ProgressEvent) => {
                                    const percent = (event.loaded / event.total) * 100;
                                    df.notify(percent);
                                };
                                writer.onerror = (event: ProgressEvent) => {
                                    df.reject(makeErrorInfo(
                                        RESULT_CODE.ERROR_CDP_STORAGE_DEVICE_FILE_OPERATION,
                                        TAG,
                                        "writer file failed."
                                    ));
                                };
                            }
                        },
                        // fail
                        (error: FileError) => {
                            df.reject(this.makeErrorInfoFromFileError(error, "create writer failed."));
                        });
                }
            },
            // fail
            (error: FileError) => {
                df.reject(this.makeErrorInfoFromFileError(error, "create file failed."));
            });

        return promise;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods: 読み込み

    /**
     * ファイル読み込み
     * <dataRoot>は既定では cordova-plugin-file の cordova.file.dataDirectory を用いる
     *
     * @param key       [in] "dataDirectory" からのパスを指定. ex) /data/example.mp3
     * @param options   [in] オプション
     * @returns Promise オブジェクト
     */
    private loadItem(key: string, options: IDeviceStorageGetItemOptions): IPromise<any> {
        const split = this.splitPath(key);

        let path = options.root || cordova.file.dataDirectory;
        if (!split.file) {
            return Promise.reject(makeErrorInfo(
                RESULT_CODE.ERROR_CDP_STORAGE_INVALID_PARAM,
                TAG,
                "key is invalid. [key: " + key + "]"
            ));
        } else if (split.dir) {
            path += split.dir;
        }

        return new Promise((resolve, reject, dependOn) => {
            dependOn(this.loadFile(path, split.file, options))
                .then((file: File) => {
                    if (file) {
                        let dataType = file.type;
                        if (options && options.dataInfo) {
                            dataType = options.dataInfo.dataType || dataType;
                        }
                        return dependOn(convertFromDataBlob(file, dataType));
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

    // ファイルオブジェクトの読み込み
    private loadFile(path: string, file: string, options: IDeviceStorageGetItemOptions): IPromise<File> {
        const promise = new Promise<File>((resolve, reject) => {
            window.resolveLocalFileSystemURL(
                path,
                (dirEntry: DirectoryEntry) => {
                    if ("pending" === promise.state()) {
                        dirEntry.getFile(file, { create: false },
                            (fileEntry: FileEntry) => {
                                if ("pending" === promise.state()) {
                                    fileEntry.file(
                                        (fileObj: File) => {
                                            resolve(fileObj);
                                        },
                                        (error: FileError) => {
                                            reject(this.makeErrorInfoFromFileError(error, "FileEntry.file() failed."));
                                        }
                                    );
                                }
                            },
                            (error: FileError) => {
                                if (1 === error.code) {
                                    console.log(TAG + file + " doesn't exist. " + JSON.stringify(error));
                                    resolve(null);
                                } else {
                                    reject(this.makeErrorInfoFromFileError(error, path));
                                }
                            }
                        );
                    }
                },
                (error: FileError) => {
                    console.log(TAG + path + " doesn't exist. " + JSON.stringify(error));
                    resolve(null);
                });
        });

        return promise;
    }


    ///////////////////////////////////////////////////////////////////////
    // private methods: 削除

    /**
     * ファイルシステム の削除
     * ファイル/ディレクトリ削除処理の入り口
     *
     * @param key       [in] "dataDirectory" からのパスを指定. ex) /data/example.mp3
     * @param options   [in] オプション
     * @returns Promise オブジェクト
     */
    private removeEntry(key: string, options: IDeviceStorageRemoveItemOptions): IPromise<void> {
        return new Promise((resolve, reject, dependOn) => {
            const target = options.target || "both";

            // file 削除ヘルパー
            const rmFile = (_key: string): IPromise<string> => {
                const split = this.splitPath(_key);
                return new Promise((_resolve, _reject, _dependOn) => {
                    const root = options.root || cordova.file.dataDirectory;
                    const path = root + "/" + split.dir;

                    _dependOn(this.removeFile(path, split.file, options))
                        .then(() => {
                            _resolve(split.dir);
                        })
                        .catch((error) => {
                            _reject(error);
                        });
                });
            };

            // directory 削除ヘルパー
            const rmDir = (_key: string): IPromise<void> => {
                let dir = _key;
                let path = options.root || cordova.file.dataDirectory;
                return new Promise((_resolve, _reject, _dependOn) => {
                    if (dir) {
                        if ("/" !== dir[0]) {
                            dir = "/" + dir;
                        }
                        path += dir;
                    }

                    _dependOn(this.removeDirectory(path, options))
                        .then(() => {
                            _resolve();
                        })
                        .catch((error) => {
                            _reject(error);
                        });
                });
            };

            switch (target) {
                case "file":
                    dependOn(rmFile(key))
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                    break;
                case "directory":
                    dependOn(rmDir(key))
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                    break;
                case "both":
                    dependOn(rmFile(key))
                        .then((parent: string) => {
                            // root 出なければ direcotry 削除実行
                            if (parent) {
                                return dependOn(rmDir(parent));
                            }
                        })
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        });
                    break;
                default:
                    reject(makeErrorInfo(
                        RESULT_CODE.ERROR_CDP_STORAGE_INVALID_PARAM,
                        TAG,
                        "unknown removeItem target: " + target
                    ));
            }
        });
    }

    // ファイル削除
    private removeFile(path: string, file: string, options: IDeviceStorageRemoveItemOptions): IPromise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            window.resolveLocalFileSystemURL(
                path,
                (dirEntry: DirectoryEntry) => {
                    if ("pending" === promise.state()) {
                        dirEntry.getFile(file, { create: false },
                            (fileEntry: FileEntry) => {
                                if ("pending" === promise.state()) {
                                    fileEntry.remove(
                                        () => {
                                            resolve();
                                        },
                                        (error: FileError) => {
                                            reject(this.makeErrorInfoFromFileError(error, "FileEntry.remove() failed."));
                                        }
                                    );
                                }
                            },
                            (error: FileError) => {
                                if (1 === error.code) {
                                    console.log(TAG + file + " doesn't exist. " + JSON.stringify(error));
                                    resolve(null);
                                } else {
                                    reject(this.makeErrorInfoFromFileError(error, path));
                                }
                            }
                        );
                    }
                },
                (error: FileError) => {
                    console.log(TAG + path + " doesn't exist. " + JSON.stringify(error));
                    resolve();
                });

        });

        return promise;
    }

    // ディレクトリ削除
    private removeDirectory(path: string, options: IDeviceStorageRemoveItemOptions): IPromise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            window.resolveLocalFileSystemURL(
                path,
                (dirEntry: DirectoryEntry) => {
                    if ("pending" === promise.state()) {
                        dirEntry.removeRecursively(
                            () => {
                                resolve();
                            },
                            (error: FileError) => {
                                reject(this.makeErrorInfoFromFileError(error, "DirectoryEntry.removeRecursively() failed."));
                            }
                        );
                    }
                },
                (error: FileError) => {
                    console.log(TAG + path + " doesn't exist. " + JSON.stringify(error));
                    resolve();
                });

        });

        return promise;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods: エラー情報生成

    /**
     * ファイルシステム の初期化
     * 全削除処理の入り口
     *
     * @param options [in] オプション
     * @returns Promise オブジェクト
     */
    private clearEntries(options: IDeviceStorageOptions): IPromise<void> {
        const df = $.Deferred<void>();
        const promise = makePromise(df);

        const path = options.root || cordova.file.dataDirectory;

        const removeEntries = (notifier: JQueryDeferred<void>, entries: DirectoryEntry[]) => {
            return new Promise((resolve, reject) => {
                const work = entries.slice();
                const length = entries.length;
                let counter = 0;

                const proc = () => {
                    const entry = work.shift();
                    if (!entry) {
                        resolve();
                        return;
                    }

                    counter++;

                    entry.removeRecursively(
                        () => {
                            notifier.notify((counter / length) * 100);
                            setTimeout(proc);
                        },
                        (error: FileError) => {
                            reject(this.makeErrorInfoFromFileError(error, "DirectoryEntry.removeRecursively() failed."));
                        }
                    );

                };
                setTimeout(proc);
            });
        };

        promise.dependOn(this.parseEntries(path, options))
            .then((entries: DirectoryEntry[]) => {
                return promise.dependOn(removeEntries(df, entries));
            })
            .then(() => {
                df.resolve();
            })
            .catch((error) => {
                df.reject(error);
            });

        return promise;
    }

    // Entry の列挙
    private parseEntries(path: string, options: IDeviceStorageOptions): IPromise<DirectoryEntry[]> {
        const promise = new Promise<DirectoryEntry[]>((resolve, reject) => {
            window.resolveLocalFileSystemURL(
                path,
                (dirEntry: DirectoryEntry) => {
                    if ("pending" === promise.state()) {
                        const reader = dirEntry.createReader();
                        reader.readEntries(
                            (entries: Entry[]) => {
                                const dirEntries: DirectoryEntry[] = [];
                                entries.forEach((entry: Entry) => {
                                    if (entry.isDirectory) {
                                        dirEntries.push(<DirectoryEntry>entry);
                                    }
                                });
                                resolve(dirEntries);
                            },
                            (error: FileError) => {
                                reject(this.makeErrorInfoFromFileError(error, "DirectoryEntry.removeRecursively() failed."));
                            }
                        );
                    }
                },
                (error: FileError) => {
                    reject(this.makeErrorInfoFromFileError(error, path + " doesn't exist. "));
                });
        });

        return promise;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods: エラー情報生成

    // FileError から ErrorInfo を生成
    private makeErrorInfoFromFileError(fileError: FileError, message?: string): ErrorInfo {
        const code = (2 === fileError.code) ?
            RESULT_CODE.ERROR_CDP_STORAGE_DEVICE_FILE_SECURITY_ERR :
            RESULT_CODE.ERROR_CDP_STORAGE_DEVICE_FILE_OPERATION
            ;
        return makeErrorInfo(
            code,
            TAG,
            message,
            <Error>{
                name: "cordova-plugin-file",
                message: message,
                code: fileError.code
            }
        );
    }
}
