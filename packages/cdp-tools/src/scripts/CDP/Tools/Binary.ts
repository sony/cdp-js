namespace CDP.Tools {

    import Promise = CDP.Promise;

    const TAG = "[CDP.Tools.Binary] ";

    /**
     * @class Binary
     * @brief バイナリユーティリティ
     */
    export class Binary {

        // private constructor
        private constructor() {
            // noop
        }

        /**
         * Get BlobBuilder
         *
         * @obsolete
         * @return {any} BlobBuilder
         */
        private static getBlobBuilder(): any {
            return global.BlobBuilder || global.WebKitBlobBuilder || global.MozBlobBuilder || global.MSBlobBuilder;
        }

        /**
         * エラー情報生成 from DOMError
         *
         * @param resultCode [in] RESULT_CODE を指定
         * @param cause      [in] 下位の DOM エラーを指定
         * @param [tag]      [in] TAG を指定
         * @param [message]  [in] メッセージを指定
         * @returns エラーオブジェクト
         */
        private static makeErrorInfoFromDOMError(resultCode: RESULT_CODE, cause: DOMError, tag?: string, message?: string): ErrorInfo {
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
         * Get BlobBuilder
         *
         * @obsolete
         * @return 構築済み Blob オブジェクト
         */
        public static newBlob(blobParts?: any[], options?: BlobPropertyBag): Blob {
            if (global.Blob) {
                return new global.Blob(blobParts, options);
            } else {
                // under Android 4.4 KitKat
                options = options || {};
                const blobBuilderObject: any = Binary.getBlobBuilder();
                const blobBuilder: any = new blobBuilderObject();
                const parts = (blobParts instanceof Array) ? blobParts[0] : blobParts;
                blobBuilder.append(parts);
                return blobBuilder.getBlob(options.type);
            }
        }

        /**
         * URL Object
         *
         * @obsolete
         * @return {any} URL Object
         */
        public static blobURL: URL = (() => {
            return global.URL || global.webkitURL;
        })();

        /**
         * ArrayBuffer to Blob
         *
         * @param buf [in] ArrayBuffer data
         * @param mimeType [in] MimeType of data
         * @returns Blob data
         */
        public static arrayBufferToBlob(buf: ArrayBuffer, mimeType: string): Blob {
            return Binary.newBlob([buf], { type: mimeType });
        }

        /**
         * Base64 string to Blob
         *
         * @param base64 {string} [in] Base64 string data
         * @param mimeType {string} [in] MimeType of data
         * @return {Blob} Blob data
         */
        public static base64ToBlob(base64: string, mimeType: string): Blob {
            return Binary.newBlob([Binary.base64ToArrayBuffer(base64)], { type: mimeType });
        }

        /**
         * data-url 形式画像から Blob オブジェクトへ変換
         *
         * @param  {String} dataUrl    [in] data url
         * @param  {String} [mimeType] [in] mime type を指定. 既定では "image/png"
         * @return {Blob} Blob インスタンス
         */
        public static dataUrlToBlob(dataUrl: string, mimeType: string = "image/png"): Blob {
            const base64 = dataUrl.split(",")[1];
            return Binary.base64ToBlob(base64, mimeType);
        }

        /**
         * Base64 string to ArrayBuffer
         *
         * @param base64 {string} [in] Base64 string data
         * @return {ArrayBuffer} ArrayBuffer data
         */
        public static base64ToArrayBuffer(base64: string): ArrayBuffer {
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
        public static base64ToUint8Array(encoded: string): Uint8Array {
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
        public static arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
            const bytes = new Uint8Array(arrayBuffer);
            return Binary.uint8ArrayToBase64(bytes);
        }

        /**
         * Uint8Array to base64 string
         *
         * @param bytes {Uint8Array} [in] Uint8Array data
         * @return {string} base64 data
         */
        public static uint8ArrayToBase64(bytes: Uint8Array): string {
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
        public static readBlobAsArrayBuffer(blob: Blob): IPromise<ArrayBuffer> {
            const reader = new FileReader();
            const cancel = () => reader.abort();

            return new Promise((resolve, reject) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(Binary.makeErrorInfoFromDOMError(
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
        public static readBlobAsUint8Array(blob: Blob): IPromise<Uint8Array> {
            return new Promise((resolve, reject, dependOn) => {
                dependOn(Binary.readBlobAsArrayBuffer(blob))
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
        public static readBlobAsText(blob: Blob, encode: string = "utf-8"): IPromise<string> {
            const reader = new FileReader();
            const cancel = () => reader.abort();

            return new Promise((resolve, reject) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(Binary.makeErrorInfoFromDOMError(
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
        public static readBlobAsDataURL(blob: Blob): IPromise<string> {
            const reader = new FileReader();
            const cancel = () => reader.abort();

            return new Promise((resolve, reject) => {
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(Binary.makeErrorInfoFromDOMError(
                        RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR,
                        reader.error,
                        TAG,
                        "FileReader.readAsDataURL() failed."
                    ));
                };
                reader.readAsDataURL(blob);
            }, cancel);
        }
    }
}
