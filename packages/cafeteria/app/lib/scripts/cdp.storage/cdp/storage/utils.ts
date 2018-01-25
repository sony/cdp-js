import {
    IPromise,
    Promise,
    makeErrorInfo,
    Tools,
} from "cdp";
import {
    MIME_TYPE_BINRAY_DATA,
    MIME_TYPE_TEXT,
} from "./interfaces";
import { RESULT_CODE } from "./error-defs";

const arrayBufferToBase64   = Tools.Binary.arrayBufferToBase64;
const uint8ArrayToBase64    = Tools.Binary.uint8ArrayToBase64;
const base64ToArrayBuffer   = Tools.Binary.base64ToArrayBuffer;
const base64ToUint8Array    = Tools.Binary.base64ToUint8Array;
const arrayBufferToBlob     = Tools.Binary.arrayBufferToBlob;
const uint8ArrayToBlob      = Tools.Binary.uint8ArrayToBlob;
const base64ToBlob          = Tools.Binary.base64ToBlob;
const readBlobAsArrayBuffer = Tools.Binary.readBlobAsArrayBuffer;
const readBlobAsUint8Array  = Tools.Binary.readBlobAsUint8Array;
const readBlobAsBase64      = Tools.Binary.readBlobAsBase64;
const readBlobAsText        = Tools.Binary.readBlobAsText;

const TAG = "[cdp.storage.utils] ";

// バイナリから base64 変換
function binaryToBase64(data: Blob | ArrayBuffer | Uint8Array): IPromise<string> {
    return new Promise((resolve, reject, dependOn) => {
        let base64: string;

        if (data instanceof Blob) {
            dependOn(readBlobAsBase64(data))
                .then((b64: string) => {
                    resolve(b64);
                })
                .catch((error) => {
                    reject(makeErrorInfo(
                        RESULT_CODE.ERROR_CDP_STORAGE_DATA_NOT_SUPPORTED,
                        TAG,
                        "readBlobAsArrayBuffer() failed.",
                        error
                    ));
                });
        } else {
            setTimeout(() => {
                if (data instanceof ArrayBuffer) {
                    base64 = arrayBufferToBase64(data);
                    resolve(base64);
                } else if (<any>data instanceof Uint8Array) { // TypeScript 2.5+ 判定が完了しているとみなされコンパイルエラーになる問題
                    base64 = uint8ArrayToBase64(data);
                    resolve(base64);
                } else {
                    reject(makeErrorInfo(
                        RESULT_CODE.ERROR_CDP_STORAGE_DATA_NOT_SUPPORTED,
                        TAG,
                        "unknown data object."
                    ));
                }
            });
        }
    });
}

// base64 から バイナリ変換
function base64ToBinary(base64: string, dataType: string, mimeType: string): IPromise<Blob | ArrayBuffer | Uint8Array> {
    return new Promise((resolve, reject) => {
        let data: Blob | ArrayBuffer | Uint8Array;

        setTimeout(() => {
            try {
                switch (dataType) {
                    case "blob":
                        data = base64ToBlob(base64, mimeType);
                        break;
                    case "buffer":
                        data = base64ToArrayBuffer(base64);
                        break;
                    case "binary":
                        data = base64ToUint8Array(base64);
                        break;
                    default:
                        return reject(makeErrorInfo(
                            RESULT_CODE.ERROR_CDP_STORAGE_DATA_NOT_SUPPORTED,
                            TAG,
                            "unknown data type: " + dataType
                        ));
                }
                resolve(data);
            } catch (error) {
                console.error(TAG + "detect exception.");
                reject(makeErrorInfo(
                    RESULT_CODE.ERROR_CDP_STORAGE_INVALID_BASE64,
                    TAG,
                    "convert from base64 error.",
                    error
                ));
            }
        });
    });
}

// ストレージが扱えるテキスト形式に変換
export function convertAsDataText(data: any): IPromise<string> {
    return new Promise((resolve, reject, dependOn) => {
        if ((data instanceof Blob) || (data instanceof ArrayBuffer) || (data instanceof Uint8Array)) {
            dependOn(binaryToBase64(data))
                .then((base64: string) => {
                    resolve(base64);
                })
                .catch((error) => {
                    reject(error);
                });
        } else {
            setTimeout(() => {
                try {
                    const text = JSON.stringify(data);
                    resolve(text);
                } catch (error) {
                    console.error(TAG + "detect exception.");
                    reject(makeErrorInfo(
                        RESULT_CODE.ERROR_CDP_STORAGE_INVALID_JSON,
                        TAG,
                        "json stringify error.",
                        error
                    ));
                }
            });
        }
    });
}

// ストレージが扱えるテキスト形式から返却するデータに変換
export function convertFromDataText(text: string, dataType: string, mimeType: string): IPromise<any> {
    if (null == text) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject, dependOn) => {
        if ("text" !== dataType) {
            dependOn(base64ToBinary(text, dataType, mimeType))
                .done((data) => {
                    resolve(data);
                })
                .fail((error) => {
                    reject(error);
                });
        } else {
            try {
                const data = JSON.parse(text);
                resolve(data);
            } catch (error) {
                console.error(TAG + "detect exception.");
                reject(makeErrorInfo(
                    RESULT_CODE.ERROR_CDP_STORAGE_INVALID_JSON,
                    TAG,
                    "json parse error.",
                    error
                ));
            }
        }
    });
}

// ストレージが扱える Blob 形式に変換
export function convertAsDataBlob(data: any, mimeType: string): IPromise<Blob> {
    const promise = new Promise<Blob>((resolve, reject) => {
        setTimeout(() => {
            let blob: Blob;
            if (data instanceof Blob) {
                blob = data;
            } else if (data instanceof ArrayBuffer) {
                blob = arrayBufferToBlob(data, mimeType || MIME_TYPE_BINRAY_DATA);
            } else if (data instanceof Uint8Array) {
                blob = uint8ArrayToBlob(data, mimeType || MIME_TYPE_BINRAY_DATA);
            } else {
                try {
                    const text = JSON.stringify(data);
                    blob = new Blob([text], { type: mimeType || MIME_TYPE_TEXT });
                } catch (error) {
                    console.error(TAG + "detect exception.");
                    reject(makeErrorInfo(
                        RESULT_CODE.ERROR_CDP_STORAGE_INVALID_JSON,
                        TAG,
                        "json stringify error.",
                        error
                    ));
                }
            }
            if (blob) {
                resolve(blob);
            } else if ("pending" === promise.state()) {
                reject(makeErrorInfo(RESULT_CODE.ERROR_CDP_STORAGE_UNEXPECTED));
            }
        });
    });

    return promise;
}

// ストレージが扱える Blob 形式から返却するデータに変換
export function convertFromDataBlob(blob: Blob, dataType: string): IPromise<any> {
    return new Promise((resolve, reject, dependOn) => {
        if ("blob" === dataType) {
            resolve(blob);
        } else if ("buffer" === dataType) {
            dependOn(readBlobAsArrayBuffer(blob))
                .done((buffer) => {
                    resolve(buffer);
                })
                .fail((error) => {
                    reject(error);
                });
        } else if ("binary" === dataType) {
            dependOn(readBlobAsUint8Array(blob))
                .done((binary) => {
                    resolve(binary);
                })
                .fail((error) => {
                    reject(error);
                });
        } else {
            dependOn(readBlobAsText(blob))
                .done((text) => {
                    try {
                        const data = JSON.parse(text);
                        resolve(data);
                    } catch (error) {
                        console.error(TAG + "detect exception.");
                        reject(makeErrorInfo(
                            RESULT_CODE.ERROR_CDP_STORAGE_INVALID_JSON,
                            TAG,
                            "json parse error.",
                            error
                        ));
                    }
                })
                .fail((error) => {
                    reject(error);
                });
        }
    });
}
