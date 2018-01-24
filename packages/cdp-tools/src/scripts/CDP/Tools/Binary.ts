namespace CDP.Tools {

    import Promise = CDP.Promise;

    const TAG = "[CDP.Tools.Binary] ";

    interface IDataURLComponent {
        mimeType: string;
        base64: boolean;
        data: string;
    }

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
            const result = Binary.execDataURLRegExp(dataURL);

            if (result.base64) {
                return Binary.base64ToBlob(result.data, result.mimeType);
            } else {
                return Binary.textToBlob(result.data, result.mimeType);
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
         * text string to Blob
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
         * read Blob as data URL
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
                    resolve(decodeURIComponent(reader.result));
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

        /**
         * data URL string to ArrayBuffer
         */
        public static dataURLToArrayBuffer(dataURL: string): ArrayBuffer {
            const array = Binary.dataURLToUint8Array(dataURL);
            return array.buffer;
        }

        /**
         * data URL string to Uint8Array
         */
        public static dataURLToUint8Array(dataURL: string): Uint8Array {
            const result = Binary.execDataURLRegExp(dataURL);

            if (result.base64) {
                return Binary.base64ToUint8Array(result.data);
            } else {
                return Binary.textToUint8Array(result.data);
            }
        }

        /**
         * Base64 string to ArrayBuffer
         */
        public static base64ToArrayBuffer(base64: string): ArrayBuffer {
            const array = Binary.base64ToUint8Array(base64);
            return array.buffer;
        }

        /**
         * Base64 string to Uint8Array
         */
        public static base64ToUint8Array(base64: string): Uint8Array {
            return Binary.byteStringToUint8Array(Binary.base64ToByteString(base64));
        }

        /**
         * text string to ArrayBuffer
         */
        public static textToArrayBuffer(text: string): ArrayBuffer {
            const array = Binary.textToUint8Array(text);
            return array.buffer;
        }

        /**
         * text string to Uint8Array
         */
        public static textToUint8Array(text: string): Uint8Array {
            return Binary.byteStringToUint8Array(Binary.textToByteString(text));
        }

        /**
         * ArrayBuffer to data URL string
         */
        public static arrayBufferToDataURL(buffer: ArrayBuffer, mimeType: string = "text/plain"): string {
            return Binary.uint8ArrayToDataURL(new Uint8Array(buffer), mimeType);
        }

        /**
         * ArrayBuffer to Base64 string
         */
        public static arrayBufferToBase64(buffer: ArrayBuffer): string {
            return Binary.uint8ArrayToBase64(new Uint8Array(buffer));
        }

        /**
         * ArrayBuffer to text string
         */
        public static arrayBufferToText(buffer: ArrayBuffer): string {
            return Binary.uint8ArrayToText(new Uint8Array(buffer));
        }

        /**
         * Uint8Array to data URL string
         */
        public static uint8ArrayToDataURL(array: Uint8Array, mimeType: string = "text/plain"): string {
            const base64 = Binary.uint8ArrayToBase64(array);
            return `data:${mimeType};base64,${base64}`;
        }

        /**
         * Uint8Array to Base64 string
         */
        public static uint8ArrayToBase64(array: Uint8Array): string {
            return Binary.byteStringToBase64(Binary.uint8ArrayToByteString(array));
        }

        /**
         * Uint8Array to text string
         */
        public static uint8ArrayToText(array: Uint8Array): string {
            return Binary.byteStringToText(Binary.uint8ArrayToByteString(array));
        }

        /**
         * data URL string to text string
         */
        public static dataURLToText(dataURL: string): string {
            const result = Binary.execDataURLRegExp(dataURL);

            if (result.base64) {
                return Binary.base64ToText(result.data);
            } else {
                return decodeURIComponent(result.data);
            }
        }

        /**
         * Base64 string to text string
         */
        public static base64ToText(base64: string): string {
            return Binary.byteStringToText(Binary.base64ToByteString(base64));
        }

        /**
         * text string to data URL string
         */
        public static textToDataURL(text: string, mimeType: string = "text/plain"): string {
            const base64 = Binary.textToBase64(text);
            return `data:${mimeType};base64,${base64}`;
        }

        /**
         * text string to Base64 string
         */
        public static textToBase64(text: string): string {
            return Binary.byteStringToBase64(Binary.textToByteString(text));
        }

        /**
         * data URI 形式の正規表現
         * 参考: https://developer.mozilla.org/ja/docs/data_URIs
         */
        private static execDataURLRegExp(dataURL: string): IDataURLComponent {
            /**
             * [match] 1: MimeType
             *         2: ";base64" を含むオプション
             *         3: data 本体
             */
            const reDataURL = /^data:(.+?\/.+?)?(;.+?)?,(.*)$/;
            const result = reDataURL.exec(dataURL);

            const component: IDataURLComponent = {
                mimeType: "",
                base64: true,
                data: "",
            };

            if (null != result) {
                component.mimeType = result[1];
                component.base64 = /;base64/.test(result[2]);
                component.data = result[3];
            }

            return component;
        }

        private static uint8ArrayToByteString(array: Uint8Array) {
            return Array.prototype.map.call(array, i => String.fromCharCode(i)).join("");
        }

        private static base64ToByteString(base64: string): string {
            return window.atob(base64);
        }

        private static textToByteString(text: string): string {
            // first we use encodeURIComponent to get percent-encoded UTF-8,
            // then we convert the percent encodings into raw bytes which
            // can be fed into btoa.
            return encodeURIComponent(text).replace(/%([0-9A-F]{2})/g,
                (match, p1) => String.fromCharCode(parseInt(p1, 16))
            );
        }

        private static byteStringToUint8Array(bytes: string): Uint8Array {
            const array = bytes.split("").map(c => c.charCodeAt(0));
            return new Uint8Array(array);
        }

        private static byteStringToBase64(bytes: string): string {
            return window.btoa(bytes);
        }

        private static byteStringToText(bytes: string): string {
            // going backwards: from bytestream, to percent-encoding, to original string.
            return decodeURIComponent(bytes.split("").map(
                c => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`
            ).join(""));
        }
    }
}
