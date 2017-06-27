namespace CDP.Tools {

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
         * URL Object
         *
         * @return {any} URL Object
         */
        export const URL = (() => {
            return global.URL || global.webkitURL;
        })();
    }
}
