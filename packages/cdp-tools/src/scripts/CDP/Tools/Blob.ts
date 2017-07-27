namespace CDP.Tools {

    import Promise = CDP.Promise;

    const TAG = "[CDP.Tools.Blob] ";

    export module Blob {

        /**
         * Get BlobBuilder
         *
         * @return {any} BlobBuilder
         */
        function getBlobBuilder(): any {
            return global.BlobBuilder || global.WebKitBlobBuilder || global.MozBlobBuilder || global.MSBlobBuilder;
        }

        /**
         * エラー情報生成 from DOMError
         *
         * @param  {RESULT_CODE} resultCode [in] RESULT_CODE を指定
         * @param  {DOMError}    cause      [in] 下位の DOM エラーを指定
         * @param  {String}      [tag]      [in] TAG を指定
         * @param  {String}      [message]  [in] メッセージを指定
         * @return {ErrorInfo} エラーオブジェクト
         */
        function makeErrorInfoFromDOMError(resultCode: RESULT_CODE, cause: DOMError, tag?: string, message?: string): ErrorInfo {
            let _cause: Error;
            if (cause) {
                _cause = {
                    name: cause.name,
                    message: cause.name,    // DOMError.message が未サポート
                };
            }
            return makeErrorInfo(resultCode, tag, message, _cause);
        }

        /**
         * ArrayBuffer to Blob
         *
         * @param buf {ArrayBuffer} [in] ArrayBuffer data
         * @param mimeType {string} [in] MimeType of data
         * @return {Blob} Blob data
         */
        export function arrayBufferToBlob(buf: ArrayBuffer, mimeType: string): Blob {
            let blob: Blob = null;

            const blobBuilderObject: any = getBlobBuilder();

            if (blobBuilderObject != null) {
                const blobBuilder: any = new blobBuilderObject();
                blobBuilder.append(buf);
                blob = blobBuilder.getBlob(mimeType);
            } else {
                // Android 4.4 KitKat Chromium WebView
                blob = new global.Blob([buf], { type: mimeType });
            }
            return blob;
        }

        /**
         * Base64 string to Blob
         *
         * @param base64 {string} [in] Base64 string data
         * @param mimeType {string} [in] MimeType of data
         * @return {Blob} Blob data
         */
        export function base64ToBlob(base64: string, mimeType: string): Blob {
            let blob: Blob = null;

            const blobBuilderObject: any = getBlobBuilder();

            if (blobBuilderObject != null) {
                const blobBuilder: any = new blobBuilderObject();
                blobBuilder.append(base64ToArrayBuffer(base64));
                blob = blobBuilder.getBlob(mimeType);
            } else {
                // Android 4.4 KitKat Chromium WebView
                blob = new global.Blob([base64ToArrayBuffer(base64)], { type: mimeType });
            }
            return blob;
        }

        /**
         * data-url 形式画像から Blob オブジェクトへ変換
         *
         * @param  {String} dataUrl    [in] data url
         * @param  {String} [mimeType] [in] mime type を指定. 既定では "image/png"
         * @return {Blob} Blob インスタンス
         */
        export function dataUrlToBlob(dataUrl: string, mimeType: string = "image/png"): Blob {
            const base64 = dataUrl.split(",")[1];
            return base64ToBlob(base64, mimeType);
        }

        /**
         * Base64 string to ArrayBuffer
         *
         * @param base64 {string} [in] Base64 string data
         * @return {ArrayBuffer} ArrayBuffer data
         */
        export function base64ToArrayBuffer(base64: string): ArrayBuffer {
            const bytes = window.atob(base64);
            const arrayBuffer = new ArrayBuffer(bytes.length);
            const data = new Uint8Array(arrayBuffer);

            for (let i = 0, len = bytes.length; i < len; ++i) {
                data[i] = bytes.charCodeAt(i);
            }
            return arrayBuffer;
        }

        /**
         * Base64 string to Uint8Array
         *
         * @param base64 {string} [in] Base64 string data
         * @return {Uint8Array} Uint8Array data
         */
        export function base64ToUint8Array(encoded: string): Uint8Array {
            const bytes = window.atob(encoded);
            const data = new Uint8Array(bytes.length);

            for (let i = 0, len = bytes.length; i < len; ++i) {
                data[i] = bytes.charCodeAt(i);
            }
            return data;
        }

        /**
         * ArrayBuffer to base64 string
         *
         * @param arrayBuffer {ArrayBuffer} [in] ArrayBuffer data
         * @return {string} base64 data
         */
        export function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
            const bytes = new Uint8Array(arrayBuffer);
            return uint8ArrayToBase64(bytes);
        }

        /**
         * Uint8Array to base64 string
         *
         * @param bytes {Uint8Array} [in] Uint8Array data
         * @return {string} base64 data
         */
        export function uint8ArrayToBase64(bytes: Uint8Array): string {
            let data: string = "";

            for (let i = 0, len = bytes.byteLength; i < len; ++i) {
                data += String.fromCharCode(bytes[i]);
            }
            return window.btoa(data);
        }


        /**
         * read Blob as ArrayBuffer
         *
         * @param  {Blob} blob [in] blob data
         * @return {CDP.IPromise<ArrayBuffer>} promise object
         */
        export function readBlobAsArrayBuffer(blob: Blob): IPromise<ArrayBuffer> {
            const reader = new FileReader();
            const cancel = () => reader.abort();

            return new Promise((resolve, reject) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(makeErrorInfoFromDOMError(
                        RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR,
                        reader.error,
                        TAG,
                        "FileReader.readAsArrayBuffer() failed."
                    ));
                };
                reader.readAsArrayBuffer(blob);
            }, cancel);
        }

        /**
         * read Blob as Uint8Array
         *
         * @param  {Blob} blob [in] blob data
         * @return {CDP.IPromise<Uint8Array>} promise object
         */
        export function readBlobAsUint8Array(blob: Blob): IPromise<Uint8Array> {
            return new Promise((resolve, reject, dependOn) => {
                dependOn(readBlobAsArrayBuffer(blob))
                    .then((result: ArrayBuffer) => {
                        resolve(new Uint8Array(result));
                    })
                    .catch((error: ErrorInfo) => {
                        reject(error);
                    });
            });
        }

        /**
         * read Blob as text string
         *
         * @param  {Blob} blob [in] blob data
         * @return {CDP.IPromise<Uint8Array>} promise object
         */
        export function readBlobAsText(blob: Blob, encode: string = "utf-8"): IPromise<string> {
            const reader = new FileReader();
            const cancel = () => reader.abort();

            return new Promise((resolve, reject) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(makeErrorInfoFromDOMError(
                        RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR,
                        reader.error,
                        TAG,
                        "FileReader.readAsText() failed."
                    ));
                };
                reader.readAsText(blob, encode);
            }, cancel);
        }

        /**
         * read Blob as Data URL
         *
         * @param  {Blob} blob [in] blob data
         * @return {CDP.IPromise<string>} promise object
         */
        export function readBlobAsDataURL(blob: Blob): IPromise<string> {
            const reader = new FileReader();
            const cancel = () => reader.abort();

            return new Promise((resolve, reject) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(makeErrorInfoFromDOMError(
                        RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR,
                        reader.error,
                        TAG,
                        "FileReader.readAsDataURL() failed."
                    ));
                };
                reader.readAsDataURL(blob);
            }, cancel);
        }

        /**
         * URL Object
         *
         * @return {any} URL Object
         */
        export const URL = (() => {
            return global.URL || global.webkitURL;
        })();
    }
}
