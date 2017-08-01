import {
    IPromise,
    Promise,
    makeErrorInfo,
} from "cdp";
import {
    IStorage,
    IStorageOptions,
    IStorageGetItemOptions,
    IStorageSetItemOptions,
    IStorageRemoveItemOptions,
    STORAGE_KIND,
    MIME_TYPE_BINRAY_DATA,
} from "./interfaces";
import { RESULT_CODE } from "./error-defs";
import {
    convertAsDataText,
    convertFromDataText,
} from "./utils";

const TAG = "[cdp.storage.web-storage] ";

/**
 * @class WebStorage
 * @brief localStorage を操作する IStrage 実装クラス
 *        I/F を合わせるために Promise オブジェクトを使用
 */
export default class WebStorage implements IStorage {

    ///////////////////////////////////////////////////////////////////////
    // Implements: IStorage

    // 種別
    get kind(): string {
        return STORAGE_KIND.WEB_STORAGE;
    }

    // データ設定
    setItem(key: string, data: any, options?: IStorageSetItemOptions): IPromise<void> {
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
            dependOn(convertAsDataText(data))
                .then((text: string) => {
                    localStorage.setItem(key, text);
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    // データ取得
    getItem(key: string, options?: IStorageGetItemOptions): IPromise<any> {
        if (!key) {
            return Promise.reject(makeErrorInfo(
                RESULT_CODE.ERROR_CDP_STORAGE_INVALID_PARAM,
                TAG,
                "key is null."
            ));
        }

        return new Promise((resolve, reject, dependOn) => {
            let dataType = "text";
            let mimeType = MIME_TYPE_BINRAY_DATA;

            const read = (): IPromise<string> => {
                return new Promise((_resolve) => {
                    setTimeout(() => {
                        _resolve(localStorage.getItem(key));
                    });
                });
            };

            if (options && options.dataInfo) {
                dataType = options.dataInfo.dataType || dataType;
                mimeType = options.dataInfo.mimeType || mimeType;
            }

            dependOn(read())
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
    removeItem(key: string, options?: IStorageRemoveItemOptions): IPromise<void> {
        if (!key) {
            return Promise.reject(makeErrorInfo(
                RESULT_CODE.ERROR_CDP_STORAGE_INVALID_PARAM,
                TAG,
                "key is null."
            ));
        }

        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.removeItem(key);
                resolve();
            });
        });
    }

    // ストレージの破棄
    clear(options?: IStorageOptions): IPromise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.clear();
                resolve();
            });
        });
    }
}
