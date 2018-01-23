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
        public static newBlob(blobParts: any[] = [], options: BlobPropertyBag = {}): Blob {
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
         * @param buffer [in] ArrayBuffer data
         * @param mimeType [in] MimeType of data
         * @returns Blob data
         */
        public static arrayBufferToBlob(buffer: ArrayBuffer, mimeType: string = "application/octet-stream"): Blob {
            return Binary.newBlob([buffer], { type: mimeType });
        }

        /**
         * Uint8Array to Blob
         *
         * @param array [in] Uint8Array data
         * @param mimeType [in] MimeType of data
         * @returns Blob data
         */
        public static uint8ArrayToBlob(array: Uint8Array, mimeType: string = "application/octet-stream"): Blob {
            return Binary.newBlob([array], { type: mimeType });
        }

        /**
         * data URL string to Blob
         *
         * @param  {String} dataURL [in] data URL string
         * @return {Blob} Blob data
         */
        public static dataURLToBlob(dataURL: string): Blob {
            const reDataURL = /^data:(.+?\/.+?)?(;.+?)?,(.*)$/;
            const result = reDataURL.exec(dataURL);
            if (null == result) {
                console.error("Invalid data URI");
                return null;
            }

            const mimeType = result[1];
            const isBase64 = /;base64/.test(result[2]);
            const data = result[3];

            if (isBase64) {
                return Binary.base64ToBlob(data, mimeType);
            } else {
                return Binary.textToBlob(data, mimeType);
            }
        }

        /**
         * Base64 string to Blob
         *
         * @param base64 {string} [in] Base64 string data
         * @param mimeType {string} [in] MimeType of data
         * @return {Blob} Blob data
         */
        public static base64ToBlob(base64: string, mimeType: string = "text/plain"): Blob {
            const binstr = window.atob(base64);
            return Binary.newBlob([binstr], { type: mimeType });
        }

        /**
         * Text string to Blob
         *
         * @param text {string} [in] text string data
         * @param mimeType {string} [in] MimeType of data
         * @return {Blob} Blob data
         */
        public static textToBlob(text: string, mimeType: string = "text/plain"): Blob {
            return Binary.newBlob([text], { type: mimeType });
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
                    .then((buffer) => {
                        resolve(new Uint8Array(buffer));
                    })
                    .catch((error: ErrorInfo) => {
                        reject(error);
                    });
            });
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

        /**
         * read Blob as Base64 string
         *
         * @param  {Blob} blob [in] blob data
         * @return {CDP.IPromise<string>} promise object
         */
        public static readBlobAsBase64(blob: Blob): IPromise<string> {
            return new Promise((resolve, reject, dependOn) => {
                dependOn(Binary.readBlobAsDataURL(blob))
                    .then((dataURL) => {
                        // dataURL is always encoded base64
                        const base64 = dataURL.split(",")[1];
                        resolve(base64);
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
        public static readBlobAsText(blob: Blob, encoding: string = "utf-8"): IPromise<string> {
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
                reader.readAsText(blob, encoding);
            }, cancel);
        }
    }
}
