/*!
 * cdp.tools.js 2.2.0
 *
 * Date: 2018-04-23T06:43:29.185Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(["cdp.core", "cdp.promise"], function () { return factory(root.CDP || (root.CDP = {}), root.jQuery || root.$); }); } else { factory(root.CDP || (root.CDP = {}), root.jQuery || root.$); } }(((this || 0).self || global), function (CDP, $) { CDP.Tools = CDP.Tools || {};
var CDP;
(function (CDP) {
    /**
     * @enum  RESULT_CODE_BASE
     * @brief リザルトコードのオフセット値
     */
    var RESULT_CODE_BASE;
    (function (RESULT_CODE_BASE) {
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_TOOLS_DECLARERATION"] = 0] = "CDP_TOOLS_DECLARERATION";
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_TOOLS"] = 4 * CDP._MODULE_RESULT_CODE_RANGE_CDP] = "CDP_TOOLS";
    })(RESULT_CODE_BASE = CDP.RESULT_CODE_BASE || (CDP.RESULT_CODE_BASE = {}));
    ///////////////////////////////////////////////////////////////////////
    // module error declaration:
    var FUNCTION_CODE_RANGE = 10;
    /**
     * @enum  LOCAL_CODE_BASE
     * @brief cdp.tools 内のローカルコードオフセット値
     */
    var LOCAL_CODE_BASE;
    (function (LOCAL_CODE_BASE) {
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["FUNCTIONS"] = 0] = "FUNCTIONS";
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["BLOB"] = 1 * FUNCTION_CODE_RANGE] = "BLOB";
    })(LOCAL_CODE_BASE || (LOCAL_CODE_BASE = {}));
    /* tslint:disable:max-line-length */
    /**
     * @enum  RESULT_CODE
     * @brief cdp.tools のエラーコード定義
     */
    var RESULT_CODE;
    (function (RESULT_CODE) {
        RESULT_CODE[RESULT_CODE["ERROR_CDP_TOOLS_DECLARATION"] = 0] = "ERROR_CDP_TOOLS_DECLARATION";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_TOOLS_IMAGE_LOAD_FAILED"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_TOOLS, LOCAL_CODE_BASE.FUNCTIONS + 1, "image load failed.")] = "ERROR_CDP_TOOLS_IMAGE_LOAD_FAILED";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_TOOLS_INVALID_IMAGE"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_TOOLS, LOCAL_CODE_BASE.FUNCTIONS + 2, "invalid image.")] = "ERROR_CDP_TOOLS_INVALID_IMAGE";
        RESULT_CODE[RESULT_CODE["ERROR_CDP_TOOLS_FILE_READER_ERROR"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_TOOLS, LOCAL_CODE_BASE.BLOB + 1, "FileReader method failed.")] = "ERROR_CDP_TOOLS_FILE_READER_ERROR";
    })(RESULT_CODE = CDP.RESULT_CODE || (CDP.RESULT_CODE = {}));
    /* tslint:enable:max-line-length */
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var Promise = CDP.Promise;
        var TAG = "[CDP.Tools.Binary] ";
        /**
         * @class Binary
         * @brief バイナリユーティリティ
         */
        var Binary = /** @class */ (function () {
            // private constructor
            function Binary() {
                // noop
            }
            /**
             * Get BlobBuilder
             *
             * @obsolete
             * @return {any} BlobBuilder
             */
            Binary.getBlobBuilder = function () {
                return CDP.global.BlobBuilder || CDP.global.WebKitBlobBuilder || CDP.global.MozBlobBuilder || CDP.global.MSBlobBuilder;
            };
            /**
             * エラー情報生成 from DOMError
             *
             * @param resultCode [in] RESULT_CODE を指定
             * @param cause      [in] 下位の DOM エラーを指定
             * @param [tag]      [in] TAG を指定
             * @param [message]  [in] メッセージを指定
             * @returns エラーオブジェクト
             */
            Binary.makeErrorInfoFromDOMError = function (resultCode, cause, tag, message) {
                var _cause;
                if (cause) {
                    _cause = {
                        name: cause.name,
                        message: cause.name,
                    };
                }
                return CDP.makeErrorInfo(resultCode, tag, message, _cause);
            };
            /**
             * Get BlobBuilder
             *
             * @obsolete
             * @return 構築済み Blob オブジェクト
             */
            Binary.newBlob = function (blobParts, options) {
                if (blobParts === void 0) { blobParts = []; }
                if (options === void 0) { options = {}; }
                if (CDP.global.Blob) {
                    return new CDP.global.Blob(blobParts, options);
                }
                else {
                    // under Android 4.4 KitKat
                    options = options || {};
                    var blobBuilderObject = Binary.getBlobBuilder();
                    var blobBuilder = new blobBuilderObject();
                    var parts = (blobParts instanceof Array) ? blobParts[0] : blobParts;
                    blobBuilder.append(parts);
                    return blobBuilder.getBlob(options.type);
                }
            };
            /**
             * ArrayBuffer to Blob
             *
             * @param buffer [in] ArrayBuffer data
             * @param mimeType [in] MimeType of data
             * @returns Blob data
             */
            Binary.arrayBufferToBlob = function (buffer, mimeType) {
                if (mimeType === void 0) { mimeType = "application/octet-stream"; }
                return Binary.newBlob([buffer], { type: mimeType });
            };
            /**
             * Uint8Array to Blob
             *
             * @param array [in] Uint8Array data
             * @param mimeType [in] MimeType of data
             * @returns Blob data
             */
            Binary.uint8ArrayToBlob = function (array, mimeType) {
                if (mimeType === void 0) { mimeType = "application/octet-stream"; }
                return Binary.newBlob([array], { type: mimeType });
            };
            /**
             * data URL string to Blob
             *
             * @param  {String} dataURL [in] data URL string
             * @return {Blob} Blob data
             */
            Binary.dataURLToBlob = function (dataURL) {
                var result = Binary.execDataURLRegExp(dataURL);
                if (result.base64) {
                    return Binary.base64ToBlob(result.data, result.mimeType);
                }
                else {
                    return Binary.textToBlob(result.data, result.mimeType);
                }
            };
            /**
             * Base64 string to Blob
             *
             * @param base64 {string} [in] Base64 string data
             * @param mimeType {string} [in] MimeType of data
             * @return {Blob} Blob data
             */
            Binary.base64ToBlob = function (base64, mimeType) {
                if (mimeType === void 0) { mimeType = "text/plain"; }
                var bytes = Binary.base64ToByteString(base64);
                var array = Binary.byteStringToUint8Array(bytes);
                return Binary.uint8ArrayToBlob(array, mimeType);
            };
            /**
             * text string to Blob
             *
             * @param text {string} [in] text string data
             * @param mimeType {string} [in] MimeType of data
             * @return {Blob} Blob data
             */
            Binary.textToBlob = function (text, mimeType) {
                if (mimeType === void 0) { mimeType = "text/plain"; }
                return Binary.newBlob([text], { type: mimeType });
            };
            /**
             * read Blob as ArrayBuffer
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<ArrayBuffer>} promise object
             */
            Binary.readBlobAsArrayBuffer = function (blob) {
                var reader = new FileReader();
                var cancel = function () { return reader.abort(); };
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function () {
                        reject(Binary.makeErrorInfoFromDOMError(CDP.RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR, reader.error, TAG, "FileReader.readAsArrayBuffer() failed."));
                    };
                    reader.readAsArrayBuffer(blob);
                }, cancel);
            };
            /**
             * read Blob as Uint8Array
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<Uint8Array>} promise object
             */
            Binary.readBlobAsUint8Array = function (blob) {
                return new Promise(function (resolve, reject, dependOn) {
                    dependOn(Binary.readBlobAsArrayBuffer(blob))
                        .then(function (buffer) {
                        resolve(new Uint8Array(buffer));
                    })
                        .catch(function (error) {
                        reject(error);
                    });
                });
            };
            /**
             * read Blob as data URL
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<string>} promise object
             */
            Binary.readBlobAsDataURL = function (blob) {
                var reader = new FileReader();
                var cancel = function () { return reader.abort(); };
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function () {
                        reject(Binary.makeErrorInfoFromDOMError(CDP.RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR, reader.error, TAG, "FileReader.readAsDataURL() failed."));
                    };
                    reader.readAsDataURL(blob);
                }, cancel);
            };
            /**
             * read Blob as Base64 string
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<string>} promise object
             */
            Binary.readBlobAsBase64 = function (blob) {
                return new Promise(function (resolve, reject, dependOn) {
                    dependOn(Binary.readBlobAsDataURL(blob))
                        .then(function (dataURL) {
                        // dataURL is always encoded base64
                        var base64 = dataURL.split(",")[1];
                        resolve(base64);
                    })
                        .catch(function (error) {
                        reject(error);
                    });
                });
            };
            /**
             * read Blob as text string
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<Uint8Array>} promise object
             */
            Binary.readBlobAsText = function (blob, encoding) {
                if (encoding === void 0) { encoding = "utf-8"; }
                var reader = new FileReader();
                var cancel = function () { return reader.abort(); };
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(decodeURIComponent(reader.result));
                    };
                    reader.onerror = function () {
                        reject(Binary.makeErrorInfoFromDOMError(CDP.RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR, reader.error, TAG, "FileReader.readAsText() failed."));
                    };
                    reader.readAsText(blob, encoding);
                }, cancel);
            };
            /**
             * data URL string to ArrayBuffer
             */
            Binary.dataURLToArrayBuffer = function (dataURL) {
                var array = Binary.dataURLToUint8Array(dataURL);
                return array.buffer;
            };
            /**
             * data URL string to Uint8Array
             */
            Binary.dataURLToUint8Array = function (dataURL) {
                var result = Binary.execDataURLRegExp(dataURL);
                if (result.base64) {
                    return Binary.base64ToUint8Array(result.data);
                }
                else {
                    return Binary.textToUint8Array(result.data);
                }
            };
            /**
             * Base64 string to ArrayBuffer
             */
            Binary.base64ToArrayBuffer = function (base64) {
                var array = Binary.base64ToUint8Array(base64);
                return array.buffer;
            };
            /**
             * Base64 string to Uint8Array
             */
            Binary.base64ToUint8Array = function (base64) {
                var bytes = Binary.base64ToByteString(base64);
                return Binary.byteStringToUint8Array(bytes);
            };
            /**
             * text string to ArrayBuffer
             */
            Binary.textToArrayBuffer = function (text) {
                var array = Binary.textToUint8Array(text);
                return array.buffer;
            };
            /**
             * text string to Uint8Array
             */
            Binary.textToUint8Array = function (text) {
                var bytes = Binary.textToByteString(text);
                return Binary.byteStringToUint8Array(bytes);
            };
            /**
             * ArrayBuffer to data URL string
             */
            Binary.arrayBufferToDataURL = function (buffer, mimeType) {
                if (mimeType === void 0) { mimeType = "text/plain"; }
                return Binary.uint8ArrayToDataURL(new Uint8Array(buffer), mimeType);
            };
            /**
             * ArrayBuffer to Base64 string
             */
            Binary.arrayBufferToBase64 = function (buffer) {
                return Binary.uint8ArrayToBase64(new Uint8Array(buffer));
            };
            /**
             * ArrayBuffer to text string
             */
            Binary.arrayBufferToText = function (buffer) {
                return Binary.uint8ArrayToText(new Uint8Array(buffer));
            };
            /**
             * Uint8Array to data URL string
             */
            Binary.uint8ArrayToDataURL = function (array, mimeType) {
                if (mimeType === void 0) { mimeType = "text/plain"; }
                var base64 = Binary.uint8ArrayToBase64(array);
                return "data:" + mimeType + ";base64," + base64;
            };
            /**
             * Uint8Array to Base64 string
             */
            Binary.uint8ArrayToBase64 = function (array) {
                var bytes = Binary.uint8ArrayToByteString(array);
                return Binary.byteStringToBase64(bytes);
            };
            /**
             * Uint8Array to text string
             */
            Binary.uint8ArrayToText = function (array) {
                var bytes = Binary.uint8ArrayToByteString(array);
                return Binary.byteStringToText(bytes);
            };
            /**
             * data URL string to text string
             */
            Binary.dataURLToText = function (dataURL) {
                var result = Binary.execDataURLRegExp(dataURL);
                if (result.base64) {
                    return Binary.base64ToText(result.data);
                }
                else {
                    return decodeURIComponent(result.data);
                }
            };
            /**
             * Base64 string to text string
             */
            Binary.base64ToText = function (base64) {
                var bytes = Binary.base64ToByteString(base64);
                return Binary.byteStringToText(bytes);
            };
            /**
             * text string to data URL string
             */
            Binary.textToDataURL = function (text, mimeType) {
                if (mimeType === void 0) { mimeType = "text/plain"; }
                var base64 = Binary.textToBase64(text);
                return "data:" + mimeType + ";base64," + base64;
            };
            /**
             * text string to Base64 string
             */
            Binary.textToBase64 = function (text) {
                var bytes = Binary.textToByteString(text);
                return Binary.byteStringToBase64(bytes);
            };
            /**
             * data URI 形式の正規表現
             * 参考: https://developer.mozilla.org/ja/docs/data_URIs
             */
            Binary.execDataURLRegExp = function (dataURL) {
                /**
                 * [match] 1: MimeType
                 *         2: ";base64" を含むオプション
                 *         3: data 本体
                 */
                var reDataURL = /^data:(.+?\/.+?)?(;.+?)?,(.*)$/;
                var result = reDataURL.exec(dataURL);
                var component = {
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
            };
            Binary.uint8ArrayToByteString = function (array) {
                return Array.prototype.map.call(array, function (i) { return String.fromCharCode(i); }).join("");
            };
            Binary.base64ToByteString = function (base64) {
                return window.atob(base64);
            };
            Binary.textToByteString = function (text) {
                // first we use encodeURIComponent to get percent-encoded UTF-8,
                // then we convert the percent encodings into raw bytes which
                // can be fed into btoa.
                return encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, function (match, p1) { return String.fromCharCode(parseInt(p1, 16)); });
            };
            Binary.byteStringToUint8Array = function (bytes) {
                var array = bytes.split("").map(function (c) { return c.charCodeAt(0); });
                return new Uint8Array(array);
            };
            Binary.byteStringToBase64 = function (bytes) {
                return window.btoa(bytes);
            };
            Binary.byteStringToText = function (bytes) {
                // going backwards: from bytestream, to percent-encoding, to original string.
                return decodeURIComponent(bytes.split("").map(function (c) { return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2); }).join(""));
            };
            /**
             * URL Object
             *
             * @obsolete
             * @return {any} URL Object
             */
            Binary.blobURL = (function () {
                return CDP.global.URL || CDP.global.webkitURL;
            })();
            return Binary;
        }());
        Tools.Binary = Binary;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));
/**
 * @file  BinaryTransport.ts
 * @brief jQuery ajax transport for making binary data type requests.
 *
 *        original: https://github.com/henrya/js-jquery/blob/master/BinaryTransport/jquery.binarytransport.js
 *        author:   Henry Algus <henryalgus@gmail.com>
 */
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        // Support file protocol. (as same as official way)
        var xhrSuccessStatus = {
            0: 200,
            1223: 204
        };
        $.ajaxTransport("+binary", function (options, originalOptions, jqXHR) {
            if (CDP.global.FormData &&
                ((options.dataType && (options.dataType === "binary")) ||
                    (options.data && ((CDP.global.ArrayBuffer && options.data instanceof ArrayBuffer) ||
                        (CDP.global.Blob && options.data instanceof CDP.global.Blob))))) {
                var abortCallback_1;
                return {
                    send: function (headers, callback) {
                        // setup all variables
                        var xhr = new XMLHttpRequest();
                        var url = options.url;
                        var type = options.type;
                        var async = options.async || true;
                        // blob or arraybuffer. Default is blob
                        var dataType = options.responseType || "blob";
                        var data = options.data || null;
                        var username = options.username || null;
                        var password = options.password || null;
                        var _callback = callback || (function () { });
                        // succeeded handler
                        xhr.addEventListener("load", function () {
                            var _data = {};
                            _data[options.dataType] = xhr.response;
                            _callback(xhrSuccessStatus[xhr.status] || xhr.status, xhr.statusText, _data, xhr.getAllResponseHeaders());
                        });
                        // error handler
                        xhr.addEventListener("error", function () {
                            var _data = {};
                            _data[options.dataType] = xhr.response;
                            // make callback and send data
                            _callback(xhr.status, xhr.statusText, _data, xhr.getAllResponseHeaders());
                        });
                        // abort handler
                        xhr.addEventListener("abort", function () {
                            var _data = {};
                            _data[options.dataType] = xhr.response;
                            // make callback and send data
                            _callback(xhr.status, xhr.statusText, _data, xhr.getAllResponseHeaders());
                        });
                        // abort callback
                        abortCallback_1 = function () {
                            xhr.abort();
                        };
                        xhr.open(type, url, async, username, password);
                        // setup custom headers
                        for (var i in headers) {
                            if (headers.hasOwnProperty(i)) {
                                xhr.setRequestHeader(i, headers[i]);
                            }
                        }
                        xhr.responseType = dataType;
                        xhr.send(data);
                    },
                    abort: function () {
                        if (abortCallback_1) {
                            abortCallback_1();
                        }
                    }
                };
            }
        });
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));
/// <reference types="jquery" />
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var Promise = CDP.Promise;
        var TAG = "[CDP.Tools.Functions] ";
        /**
         * Math.abs よりも高速な abs
         */
        function abs(x) {
            return x >= 0 ? x : -x;
        }
        Tools.abs = abs;
        /**
         * Math.max よりも高速な max
         */
        function max(lhs, rhs) {
            return lhs >= rhs ? lhs : rhs;
        }
        Tools.max = max;
        /**
         * Math.min よりも高速な min
         */
        function min(lhs, rhs) {
            return lhs <= rhs ? lhs : rhs;
        }
        Tools.min = min;
        /**
         * 数値を 0 詰めして文字列を生成
         */
        function toZeroPadding(no, limit) {
            var signed = "";
            no = Number(no);
            if (isNaN(no) || isNaN(limit) || limit <= 0) {
                return null;
            }
            if (no < 0) {
                no = Tools.abs(no);
                signed = "-";
            }
            return signed + (Array(limit).join("0") + no).slice(-limit);
        }
        Tools.toZeroPadding = toZeroPadding;
        /**
         * 文字列のバイト数をカウント
         */
        function getStringSize(src) {
            return (Tools.Binary.newBlob([src], { type: "text/plain" })).size;
        }
        Tools.getStringSize = getStringSize;
        /**
         * 文字列をバイト制限して分割
         */
        function toStringChunks(src, limit) {
            var chunks = [];
            var setChunk = function (input) {
                if (limit < getStringSize(input)) {
                    var half = Math.floor(input.length / 2);
                    var lhs = input.slice(0, half);
                    var rhs = input.slice(half);
                    return [lhs, rhs];
                }
                else {
                    chunks.push(input);
                    return [];
                }
            };
            var makeChunk = function (work) {
                var failures = setChunk(work);
                while (0 < failures.length) {
                    makeChunk(failures.shift());
                }
            };
            makeChunk(src);
            return chunks;
        }
        Tools.toStringChunks = toStringChunks;
        /**
         * 多重継承のための実行時継承関数
         *
         * Sub Class 候補オブジェクトに対して Super Class 候補オブジェクトを直前の Super Class として挿入する。
         * prototype のみコピーする。
         * インスタンスメンバをコピーしたい場合、Super Class が疑似コンストラクタを提供する必要がある。
         * 詳細は cdp.tools.Functions.spec.ts を参照。
         *
         * @param subClass   {constructor} [in] オブジェクトの constructor を指定
         * @param superClass {constructor} [in] オブジェクトの constructor を指定
         */
        function inherit(subClass, superClass) {
            var _prototype = subClass.prototype;
            function _inherit() {
                this.constructor = subClass;
            }
            _inherit.prototype = superClass.prototype;
            subClass.prototype = new _inherit();
            $.extend(subClass.prototype, _prototype);
        }
        Tools.inherit = inherit;
        /**
         * mixin 関数
         *
         * TypeScript Official Site に載っている mixin 関数
         * http://www.typescriptlang.org/Handbook#mixins
         * 既に定義されているオブジェクトから、新規にオブジェクトを合成する。
         *
         * @param derived {constructor}    [in] 合成されるオブジェクトの constructor を指定
         * @param bases   {constructor...} [in] 合成元オブジェクトの constructor を指定 (可変引数)
         */
        function mixin(derived) {
            var bases = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                bases[_i - 1] = arguments[_i];
            }
            bases.forEach(function (base) {
                Object.getOwnPropertyNames(base.prototype).forEach(function (name) {
                    derived.prototype[name] = base.prototype[name];
                });
            });
        }
        Tools.mixin = mixin;
        /**
         * \~english
         * Helper function to correctly set up the prototype chain, for subclasses.
         * The function behavior is same as extend() function of Backbone.js.
         *
         * @param protoProps  {Object} [in] set prototype properties as object.
         * @param staticProps {Object} [in] set static properties as object.
         * @return {Object} subclass constructor.
         *
         * \~japanese
         * クラス継承のためのヘルパー関数
         * Backbone.js extend() 関数と同等
         *
         * @param protoProps  {Object} [in] prototype properties をオブジェクトで指定
         * @param staticProps {Object} [in] static properties をオブジェクトで指定
         * @return {Object} サブクラスのコンストラクタ
         */
        function extend(protoProps, staticProps) {
            var parent = this;
            var child;
            if (protoProps && protoProps.hasOwnProperty("constructor")) {
                child = protoProps.constructor;
            }
            else {
                child = function () {
                    return parent.apply(this, arguments);
                };
            }
            $.extend(child, parent, staticProps);
            var Surrogate = function () {
                this.constructor = child;
            };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate;
            if (protoProps) {
                $.extend(child.prototype, protoProps);
            }
            child.__super__ = parent.prototype;
            return child;
        }
        Tools.extend = extend;
        /**
         * DPI 取得
         */
        function getDevicePixcelRatio() {
            var mediaQuery;
            var is_firefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
            if (null != window.devicePixelRatio && !is_firefox) {
                return window.devicePixelRatio;
            }
            else if (window.matchMedia) {
                mediaQuery =
                    "(-webkit-min-device-pixel-ratio: 1.5),\
                    (min--moz-device-pixel-ratio: 1.5),\
                    (-o-min-device-pixel-ratio: 3/2),\
                    (min-resolution: 1.5dppx)";
                if (window.matchMedia(mediaQuery).matches) {
                    return 1.5;
                }
                mediaQuery =
                    "(-webkit-min-device-pixel-ratio: 2),\
                    (min--moz-device-pixel-ratio: 2),\
                    (-o-min-device-pixel-ratio: 2/1),\
                    (min-resolution: 2dppx)";
                if (window.matchMedia(mediaQuery).matches) {
                    return 2;
                }
                mediaQuery =
                    "(-webkit-min-device-pixel-ratio: 0.75),\
                    (min--moz-device-pixel-ratio: 0.75),\
                    (-o-min-device-pixel-ratio: 3/4),\
                    (min-resolution: 0.75dppx)";
                if (window.matchMedia(mediaQuery).matches) {
                    return 0.7;
                }
            }
            else {
                return 1;
            }
        }
        Tools.getDevicePixcelRatio = getDevicePixcelRatio;
        // Canvas element のキャッシュ
        var s_canvasFactory;
        // キャッシュ済みの Canvas を取得する
        function getCanvas() {
            s_canvasFactory = s_canvasFactory || document.createElement("canvas");
            return s_canvasFactory.cloneNode(false);
        }
        Tools.getCanvas = getCanvas;
        /**
         * 画像リソースのロード完了を保証
         * ブラウザ既定のプログレッシブロードを走らせないため.
         *
         * @param  {String} url [in] url (data-url)
         * @return {IPromise<string>} 表示可能な url
         */
        function ensureImageLoaded(url) {
            var img = new Image();
            var destroy = function () {
                if (img) {
                    img.src = ""; // 読み込み停止
                    img = null;
                }
            };
            return new Promise(function (resolve, reject) {
                img.onload = function (event) {
                    destroy();
                    resolve(url);
                };
                img.onerror = function (event) {
                    destroy();
                    reject(CDP.makeErrorInfo(CDP.RESULT_CODE.ERROR_CDP_TOOLS_IMAGE_LOAD_FAILED, TAG, "image load failed. [url: " + url + "]"));
                };
                img.src = url;
            }, destroy);
        }
        Tools.ensureImageLoaded = ensureImageLoaded;
        /**
         * 画像のリサイズ
         * 指定した長辺の長さにアスペクト比を維持してリサイズを行う
         * longSideLength より小さな場合はオリジナルサイズで data-url を返却する
         *
         * @param  {String} src            [in] image に指定するソース
         * @param  {Number} longSideLength [in] リサイズに使用する長辺の最大値を指定
         * @return {IPromise<string>} base64 data url を返却
         */
        function resizeImage(src, longSideLength) {
            var img = new Image();
            var destroy = function () {
                if (img) {
                    img.src = ""; // 読み込み停止
                    img = null;
                }
            };
            return new Promise(function (resolve, reject) {
                img.onload = function (event) {
                    var canvas = getCanvas();
                    var ih = img.height, iw = img.width, ia = ih / iw;
                    var cw, ch;
                    if (iw === 0 || 0 === ia) { // 念のため不正な画像をガード
                        reject(CDP.makeErrorInfo(CDP.RESULT_CODE.ERROR_CDP_TOOLS_INVALID_IMAGE, TAG, "invalid image. [src: " + src + "]"));
                    }
                    else {
                        if (longSideLength <= 0) {
                            longSideLength = (ia < 1) ? iw : ih;
                        }
                        if (ia < 1) {
                            cw = (longSideLength < iw) ? longSideLength : iw;
                            ch = Math.round(cw * ia);
                        }
                        else {
                            ch = (longSideLength < ih) ? longSideLength : ih;
                            cw = Math.round(ch / ia);
                        }
                        canvas.width = cw;
                        canvas.height = ch;
                        canvas.getContext("2d").drawImage(img, 0, 0, cw, ch);
                        resolve(canvas.toDataURL());
                    }
                    destroy();
                };
                img.onerror = function (event) {
                    destroy();
                    reject(CDP.makeErrorInfo(CDP.RESULT_CODE.ERROR_CDP_TOOLS_IMAGE_LOAD_FAILED, TAG, "image load failed. [src: " + src + "]"));
                };
                img.src = src;
            });
        }
        Tools.resizeImage = resizeImage;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));
/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.DateTime] ";
        /**
         * @class DateTime
         * @brief 時刻操作のユーティリティクラス
         */
        var DateTime = /** @class */ (function () {
            function DateTime() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static method
            /**
             * 基点となる日付から、n日後、n日前を算出
             *
             * @param base   {Date}   [in] 基準日
             * @param add    {Number} [in] 加算日. マイナス指定でn日前も設定可能
             * @param target {String} [in] { year | month | date | hour | min | sec | msec }
             * @return {Date} 日付オブジェクト
             */
            DateTime.computeDate = function (base, add, target) {
                if (target === void 0) { target = "date"; }
                var date = new Date(base.getTime());
                switch (target) {
                    case "year":
                        date.setUTCFullYear(base.getUTCFullYear() + add);
                        break;
                    case "month":
                        date.setUTCMonth(base.getUTCMonth() + add);
                        break;
                    case "date":
                        date.setUTCDate(base.getUTCDate() + add);
                        break;
                    case "hour":
                        date.setUTCHours(base.getUTCHours() + add);
                        break;
                    case "min":
                        date.setUTCMinutes(base.getUTCMinutes() + add);
                        break;
                    case "sec":
                        date.setUTCSeconds(base.getUTCSeconds() + add);
                        break;
                    case "msec":
                        date.setUTCMilliseconds(base.getUTCMilliseconds() + add);
                        break;
                    default:
                        console.warn(TAG + "unknown target: " + target);
                        date.setUTCDate(base.getUTCDate() + add);
                }
                return date;
            };
            /**
             * Convert string to date object
             *
             * @param {String} date string ex) YYYY-MM-DDTHH:mm:ss.sssZ
             * @return {Object} date object
             */
            DateTime.convertISOStringToDate = function (dateString) {
                var dateValue = this.convertISOStringToDateValue(dateString);
                return new Date(dateValue);
            };
            /**
             * Convert date object into string (the ISO 8601 Extended Format)
             *
             * @param date   {Date}   [in] date object
             * @param target {String} [in] { year | month | date | min | sec | msec | tz }
             * @return {String} date string
             */
            DateTime.convertDateToISOString = function (date, target) {
                if (target === void 0) { target = "tz"; }
                var isoDateString = date.toISOString();
                // need offset if extended format (±YYYYYY-MM-DDTHH:mm:ss.sssZ)
                var offset = 27 === isoDateString.length ? 3 : 0;
                switch (target) {
                    case "year":
                        return isoDateString.substr(0, offset + 4);
                    case "month":
                        return isoDateString.substr(0, offset + 7);
                    case "date":
                        return isoDateString.substr(0, offset + 10);
                    case "min":
                        return isoDateString.substr(0, offset + 16);
                    case "sec":
                        return isoDateString.substr(0, offset + 19);
                    case "msec":
                        return isoDateString.substr(0, offset + 23);
                    case "tz":
                        return isoDateString;
                    default:
                        console.warn(TAG + "unknown target: " + target);
                        return isoDateString;
                }
            };
            /**
             * Convert file system compatible string to date object
             *
             * @param {String} date string ex) YYYY_MM_DDTHH_mm_ss_sss
             * @return {Object} date object
             */
            DateTime.convertFileSystemStringToDate = function (dateString) {
                var dateValue = this.convertFileSystemStringToDateValue(dateString);
                return new Date(dateValue);
            };
            /**
             * Convert date object into string in file system compatible format (YYYY_MM_DDTHH_mm_ss_sss)
             *
             * @param date   {Date}   [in] date object
             * @param target {String} [in] { year | month | date | min | sec | msec }
             * @return {String} file system compatible string
             */
            DateTime.convertDateToFileSystemString = function (date, target) {
                if (target === void 0) { target = "msec"; }
                var isoDateString = DateTime.convertDateToISOString(date, target);
                var fileSystemString = isoDateString.replace(/[-:.]/g, "_");
                return fileSystemString;
            };
            /**
             * Convert ISO string to value of date (milliseconds)
             *
             * @param isoString {String} [in] date string
             * @return {Number} value of date (ms)
             */
            DateTime.convertISOStringToDateValue = function (isoString) {
                var reYear = /(\d{4}|[-+]\d{6})/;
                var reMonth = /(\d{2})/;
                var reDay = /(\d{2})/;
                var reDate = new RegExp(reYear.source + "(?:-" + reMonth.source + "(?:-" + reDay.source + ")*)*");
                var reHours = /(\d{2})/;
                var reMinutes = /(\d{2})/;
                var reSeconds = /(\d{2})/;
                var reMs = /(\d{3})/;
                var reTime = new RegExp("T" + reHours.source + ":" + reMinutes.source + "(?::" + reSeconds.source + "(?:." + reMs.source + ")*)*");
                var reTz = /(Z|[-+]\d{2}:\d{2})/;
                var reISOString = new RegExp("^" + reDate.source + "(?:" + reTime.source + "(?:" + reTz.source + ")*)*$");
                var result = reISOString.exec(isoString);
                if (null == result) {
                    // invalid ISO string
                    return NaN;
                }
                var year = parseInt(result[1], 10);
                var month = parseInt(result[2], 10) - 1 || 0;
                var date = parseInt(result[3], 10) || 1;
                var hours = parseInt(result[4], 10) || 0;
                var minutes = parseInt(result[5], 10) || 0;
                var seconds = parseInt(result[6], 10) || 0;
                var ms = parseInt(result[7], 10) || 0;
                if (result[8]) {
                    // timezone offset
                    switch (result[8][0]) {
                        case "Z":
                            break;
                        case "-":
                            // -HH:mm
                            hours += parseInt(result[8].substr(1, 2), 10) || 0;
                            minutes += parseInt(result[8].substr(4, 2), 10) || 0;
                            break;
                        case "+":
                            // +HH:mm
                            hours -= parseInt(result[8].substr(1, 2), 10) || 0;
                            minutes -= parseInt(result[8].substr(4, 2), 10) || 0;
                            break;
                        default:
                            console.warn("invalid timezone in ISO string");
                    }
                }
                return Date.UTC(year, month, date, hours, minutes, seconds, ms);
            };
            /**
             * Convert file system compatible string to to value of date (milliseconds)
             *
             * @param dateString {String} [in] date string (YYYY_MM_DDTHH_mm_ss_sss)
             * @return {String} converted string
             */
            DateTime.convertFileSystemStringToDateValue = function (dateString) {
                var reYear = /(\d{4}|[-+]\d{6})/;
                var reMonth = /(\d{2})/;
                var reDay = /(\d{2})/;
                var reDate = new RegExp(reYear.source + "(?:_" + reMonth.source + "(?:_" + reDay.source + ")?)?");
                var reHours = /(\d{2})/;
                var reMinutes = /(\d{2})/;
                var reSeconds = /(\d{2})/;
                var reMs = /(\d{3})/;
                var reTime = new RegExp("T" + reHours.source + "_" + reMinutes.source + "(?:_" + reSeconds.source + "(?:_" + reMs.source + ")?)?");
                var reFileSystemString = new RegExp("^" + reDate.source + "(?:" + reTime.source + ")*$");
                var result = reFileSystemString.exec(dateString);
                if (null == result) {
                    // invalid file system string
                    return NaN;
                }
                var year = parseInt(result[1], 10);
                var month = parseInt(result[2], 10) - 1 || 0;
                var date = parseInt(result[3], 10) || 1;
                var hours = parseInt(result[4], 10) || 0;
                var minutes = parseInt(result[5], 10) || 0;
                var seconds = parseInt(result[6], 10) || 0;
                var ms = parseInt(result[7], 10) || 0;
                return Date.UTC(year, month, date, hours, minutes, seconds, ms);
            };
            return DateTime;
        }());
        Tools.DateTime = DateTime;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));
/// <reference types="jquery" />
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.Template] ";
        //___________________________________________________________________________________________________________________//
        /**
         * @class Template
         * @brief template script を管理するユーティリティクラス
         */
        var Template = /** @class */ (function () {
            function Template() {
            }
            ///////////////////////////////////////////////////////////////////////
            // 公開メソッド
            /**
             * 指定した id, class 名, Tag 名をキーにテンプレートの JQuery Element を取得する。
             *
             * @param {String}  key     [in] id, class, tag を表す文字列
             * @param {String}  [src]   [in] 外部 html を指定する場合は url を設定
             * @param {Boolean} [cache] [in] src html をキャッシュする場合は true. src が指定されているときのみ有効
             * @return template が格納されている JQuery Element
             */
            Template.getTemplateElement = function (key, src, cache) {
                if (src === void 0) { src = null; }
                if (cache === void 0) { cache = true; }
                var mapElement = Template.getElementMap();
                var $element = mapElement[key];
                if (!$element || !$element[0]) {
                    // 要素の取得
                    if (src) {
                        var html = Template.findHtmlFromSource(src);
                        $element = $(html).find(key);
                    }
                    else {
                        $element = $(key);
                    }
                    // 要素の検証
                    if (!$element || !$element[0]) {
                        console.warn(TAG, "invalid [key, src] = [" + key + ", " + src + "]");
                    }
                    else if (src && cache) {
                        mapElement[key] = $element;
                    }
                }
                return $element;
            };
            /**
             * Map オブジェクトの削除
             * 明示的にキャッシュを開放する場合は本メソッドをコールする
             */
            Template.empty = function () {
                Template._mapElement = null;
                Template._mapSource = null;
            };
            Template.getJST = function (key, src, cache) {
                var jst = function () { return ""; };
                var $element;
                if (key instanceof jQuery) {
                    $element = key;
                }
                else {
                    $element = Template.getTemplateElement(key, src, cache);
                }
                if (!$element || !$element[0]) {
                    console.warn(TAG + "cannot generate template");
                }
                else if (null != CDP.global.Hogan) {
                    var template_1 = Hogan.compile($element.text());
                    jst = function (data) {
                        return template_1.render(data);
                    };
                }
                else if (null != CDP.global._) {
                    var template_2 = _.template($element.html());
                    jst = function (data) {
                        // 改行とタブは削除する
                        return template_2(data).replace(/\n|\t/g, "");
                    };
                }
                else {
                    console.warn(TAG + "cannot find template engine module.");
                    console.warn("    'hogan' or 'underscore' is required.");
                }
                return jst;
            };
            ///////////////////////////////////////////////////////////////////////
            // 内部メソッド
            //! Element Map オブジェクトの取得
            Template.getElementMap = function () {
                Template._mapElement = Template._mapElement || {};
                return Template._mapElement;
            };
            //! URL Map オブジェクトの取得
            Template.getSourceMap = function () {
                Template._mapSource = Template._mapSource || {};
                return Template._mapSource;
            };
            //! URL Map から HTML を検索. 失敗した場合は空文字が返る
            Template.findHtmlFromSource = function (src) {
                var mapSource = Template.getSourceMap();
                var html = mapSource[src] || "";
                if (!html) {
                    $.ajax({
                        url: src,
                        method: "GET",
                        async: false,
                        dataType: "html",
                        success: function (data) {
                            html = data;
                        },
                        error: function (data, status) {
                            console.error(TAG, "ajax request failed. status: " + status);
                        }
                    });
                    // キャッシュに格納
                    mapSource[src] = html;
                }
                return html;
            };
            return Template;
        }());
        Tools.Template = Template;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.ProgressCounter] ";
        /**
         * @class ProgressCounter
         * @brief 進捗の時間を扱うユーティリティクラス
         */
        var ProgressCounter = /** @class */ (function () {
            /**
             * constructor
             *
             * @param [options] オプション
             */
            function ProgressCounter(options) {
                this.reset(options);
            }
            /**
             * 開始時間を初期化
             */
            ProgressCounter.prototype.reset = function (options) {
                this._settings = __assign({
                    max: 100,
                    beginTime: Date.now(),
                    allowIncrementRemain: false,
                    lastRemainTime: Infinity,
                }, options);
            };
            /**
             * 経過時間と推定残り時間を取得する
             * 進捗値が 0 の場合は、推定残り時間に Infinity を返す
             *
             * @param   progress [in] 進捗値
             * @returns 経過時間と推定残り時間 [msec]
             */
            ProgressCounter.prototype.compute = function (progress) {
                var passTime = Date.now() - this._settings.beginTime;
                var remainTime = Infinity;
                if (null != progress && 0 !== progress) {
                    remainTime = passTime * this._settings.max / progress - passTime;
                }
                if (this._settings.allowIncrementRemain || (remainTime < this._settings.lastRemainTime)) {
                    this._settings.lastRemainTime = remainTime;
                }
                else {
                    remainTime = this._settings.lastRemainTime;
                }
                return { passTime: passTime, remainTime: remainTime };
            };
            return ProgressCounter;
        }());
        Tools.ProgressCounter = ProgressCounter;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));

return CDP.Tools; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVG9vbHMvRXJyb3JEZWZzLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9CaW5hcnkudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL0JpbmFyeVRyYW5zcG9ydC50cyIsImNkcDovLy9DRFAvVG9vbHMvRnVuY3Rpb25zLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9EYXRlVGltZS50cyIsImNkcDovLy9DRFAvVG9vbHMvVGVtcGxhdGUudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL1Byb2dyZXNzQ291bnRlci50cyIsImNkcDovLy9DRFAvVG9vbHMvSW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0FxQ1o7QUFyQ0QsV0FBVSxHQUFHO0lBRVQ7OztPQUdHO0lBQ0gsSUFBWSxnQkFHWDtJQUhELFdBQVksZ0JBQWdCO1FBQ3hCLDZGQUEyQjtRQUMzQixpREFBWSxDQUFDLEdBQUcsaUNBQTZCO0lBQ2pELENBQUMsRUFIVyxnQkFBZ0IsR0FBaEIsb0JBQWdCLEtBQWhCLG9CQUFnQixRQUczQjtJQUVELHVFQUF1RTtJQUN2RSw0QkFBNEI7SUFFNUIsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFFL0I7OztPQUdHO0lBQ0gsSUFBSyxlQUdKO0lBSEQsV0FBSyxlQUFlO1FBQ2hCLCtEQUFlO1FBQ2YsMENBQWMsQ0FBQyxHQUFHLG1CQUFtQjtJQUN6QyxDQUFDLEVBSEksZUFBZSxLQUFmLGVBQWUsUUFHbkI7SUFFRCxvQ0FBb0M7SUFDcEM7OztPQUdHO0lBQ0gsSUFBWSxXQUtYO0lBTEQsV0FBWSxXQUFXO1FBQ25CLDJGQUF1QztRQUN2QywrREFBc0Msc0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLG9CQUFvQixDQUFDO1FBQ3pJLDJEQUFzQyxzQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsR0FBRyxD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UUFBRCxDQUFDO1FBdERZLHFCQUFlLGtCQXNEM0I7SUFDTCxDQUFDLEVBbEZhLEtBQUssR0FBTCxTQUFLLEtBQUwsU0FBSyxRQWtGbEI7QUFBRCxDQUFDLEVBbEZTLEdBQUcsS0FBSCxHQUFHLFFBa0ZaIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW51bSAgUkVTVUxUX0NPREVfQkFTRVxyXG4gICAgICogQGJyaWVmIOODquOCtuODq+ODiOOCs+ODvOODieOBruOCquODleOCu+ODg+ODiOWApFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZW51bSBSRVNVTFRfQ09ERV9CQVNFIHtcclxuICAgICAgICBDRFBfVE9PTFNfREVDTEFSRVJBVElPTiA9IDAsICAgIC8vIFRTMjQzMiDlr77nrZZcclxuICAgICAgICBDRFBfVE9PTFMgPSA0ICogX01PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRV9DRFAsXHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIG1vZHVsZSBlcnJvciBkZWNsYXJhdGlvbjpcclxuXHJcbiAgICBjb25zdCBGVU5DVElPTl9DT0RFX1JBTkdFID0gMTA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW51bSAgTE9DQUxfQ09ERV9CQVNFXHJcbiAgICAgKiBAYnJpZWYgY2RwLnRvb2xzIOWGheOBruODreODvOOCq+ODq+OCs+ODvOODieOCquODleOCu+ODg+ODiOWApFxyXG4gICAgICovXHJcbiAgICBlbnVtIExPQ0FMX0NPREVfQkFTRSB7XHJcbiAgICAgICAgRlVOQ1RJT05TICAgPSAwLFxyXG4gICAgICAgIEJMT0IgICAgICAgID0gMSAqIEZVTkNUSU9OX0NPREVfUkFOR0UsXHJcbiAgICB9XHJcblxyXG4gICAgLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcbiAgICAvKipcclxuICAgICAqIEBlbnVtICBSRVNVTFRfQ09ERVxyXG4gICAgICogQGJyaWVmIGNkcC50b29scyDjga7jgqjjg6njg7zjgrPjg7zjg4nlrprnvqlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREUge1xyXG4gICAgICAgIEVSUk9SX0NEUF9UT09MU19ERUNMQVJBVElPTiAgICAgICAgID0gMCwgLy8gVFMyNDMyIOWvvuetllxyXG4gICAgICAgIEVSUk9SX0NEUF9UT09MU19JTUFHRV9MT0FEX0ZBSUxFRCAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX1RPT0xTLCBMT0NBTF9DT0RFX0JBU0UuRlVOQ1RJT05TICsgMSwgXCJpbWFnZSBsb2FkIGZhaWxlZC5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX1RPT0xTX0lOVkFMSURfSU1BR0UgICAgICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfVE9PTFMsIExPQ0FMX0NPREVfQkFTRS5GVU5DVElPTlMgKyAyLCBcImludmFsaWQgaW1hZ2UuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9UT09MU19GSUxFX1JFQURFUl9FUlJPUiAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX1RPT0xTLCBMT0NBTF9DT0RFX0JBU0UuQkxPQiArIDEsIFwiRmlsZVJlYWRlciBtZXRob2QgZmFpbGVkLlwiKSxcclxuICAgIH1cclxuICAgIC8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgaW1wb3J0IFByb21pc2UgPSBDRFAuUHJvbWlzZTtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuQmluYXJ5XSBcIjtcclxuXHJcbiAgICBpbnRlcmZhY2UgSURhdGFVUkxDb21wb25lbnQge1xyXG4gICAgICAgIG1pbWVUeXBlOiBzdHJpbmc7XHJcbiAgICAgICAgYmFzZTY0OiBib29sZWFuO1xyXG4gICAgICAgIGRhdGE6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBCaW5hcnlcclxuICAgICAqIEBicmllZiDjg5DjgqTjg4rjg6rjg6bjg7zjg4bjgqPjg6rjg4bjgqNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEJpbmFyeSB7XHJcblxyXG4gICAgICAgIC8vIHByaXZhdGUgY29uc3RydWN0b3JcclxuICAgICAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICAvLyBub29wXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgQmxvYkJ1aWxkZXJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBvYnNvbGV0ZVxyXG4gICAgICAgICAqIEByZXR1cm4ge2FueX0gQmxvYkJ1aWxkZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBnZXRCbG9iQnVpbGRlcigpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsLkJsb2JCdWlsZGVyIHx8IGdsb2JhbC5XZWJLaXRCbG9iQnVpbGRlciB8fCBnbG9iYWwuTW96QmxvYkJ1aWxkZXIgfHwgZ2xvYmFsLk1TQmxvYkJ1aWxkZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqjjg6njg7zmg4XloLHnlJ/miJAgZnJvbSBET01FcnJvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHJlc3VsdENvZGUgW2luXSBSRVNVTFRfQ09ERSDjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gY2F1c2UgICAgICBbaW5dIOS4i+S9jeOBriBET00g44Ko44Op44O844KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIFt0YWddICAgICAgW2luXSBUQUcg44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIFttZXNzYWdlXSAgW2luXSDjg6Hjg4Pjgrvjg7zjgrjjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJucyDjgqjjg6njg7zjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBtYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKHJlc3VsdENvZGU6IFJFU1VMVF9DT0RFLCBjYXVzZTogRE9NRXJyb3IsIHRhZz86IHN0cmluZywgbWVzc2FnZT86IHN0cmluZyk6IEVycm9ySW5mbyB7XHJcbiAgICAgICAgICAgIGxldCBfY2F1c2U6IEVycm9yO1xyXG4gICAgICAgICAgICBpZiAoY2F1c2UpIHtcclxuICAgICAgICAgICAgICAgIF9jYXVzZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBjYXVzZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNhdXNlLm5hbWUsICAgIC8vIERPTUVycm9yLm1lc3NhZ2Ug44GM5pyq44K144Od44O844OIXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlRXJyb3JJbmZvKHJlc3VsdENvZGUsIHRhZywgbWVzc2FnZSwgX2NhdXNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldCBCbG9iQnVpbGRlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQG9ic29sZXRlXHJcbiAgICAgICAgICogQHJldHVybiDmp4vnr4nmuIjjgb8gQmxvYiDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIG5ld0Jsb2IoYmxvYlBhcnRzOiBhbnlbXSA9IFtdLCBvcHRpb25zOiBCbG9iUHJvcGVydHlCYWcgPSB7fSk6IEJsb2Ige1xyXG4gICAgICAgICAgICBpZiAoZ2xvYmFsLkJsb2IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgZ2xvYmFsLkJsb2IoYmxvYlBhcnRzLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHVuZGVyIEFuZHJvaWQgNC40IEtpdEthdFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgICAgICAgICBjb25zdCBibG9iQnVpbGRlck9iamVjdDogYW55ID0gQmluYXJ5LmdldEJsb2JCdWlsZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBibG9iQnVpbGRlcjogYW55ID0gbmV3IGJsb2JCdWlsZGVyT2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJ0cyA9IChibG9iUGFydHMgaW5zdGFuY2VvZiBBcnJheSkgPyBibG9iUGFydHNbMF0gOiBibG9iUGFydHM7XHJcbiAgICAgICAgICAgICAgICBibG9iQnVpbGRlci5hcHBlbmQocGFydHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2JCdWlsZGVyLmdldEJsb2Iob3B0aW9ucy50eXBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVVJMIE9iamVjdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQG9ic29sZXRlXHJcbiAgICAgICAgICogQHJldHVybiB7YW55fSBVUkwgT2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBibG9iVVJMOiBVUkwgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsLlVSTCB8fCBnbG9iYWwud2Via2l0VVJMO1xyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFycmF5QnVmZmVyIHRvIEJsb2JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBidWZmZXIgW2luXSBBcnJheUJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICogQHBhcmFtIG1pbWVUeXBlIFtpbl0gTWltZVR5cGUgb2YgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm5zIEJsb2IgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYXJyYXlCdWZmZXJUb0Jsb2IoYnVmZmVyOiBBcnJheUJ1ZmZlciwgbWltZVR5cGU6IHN0cmluZyA9IFwiYXBwbGljYXRpb24vb2N0ZXQtc3RyZWFtXCIpOiBCbG9iIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS5uZXdCbG9iKFtidWZmZXJdLCB7IHR5cGU6IG1pbWVUeXBlIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVWludDhBcnJheSB0byBCbG9iXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYXJyYXkgW2luXSBVaW50OEFycmF5IGRhdGFcclxuICAgICAgICAgKiBAcGFyYW0gbWltZVR5cGUgW2luXSBNaW1lVHlwZSBvZiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybnMgQmxvYiBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB1aW50OEFycmF5VG9CbG9iKGFycmF5OiBVaW50OEFycmF5LCBtaW1lVHlwZTogc3RyaW5nID0gXCJhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW1cIik6IEJsb2Ige1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5Lm5ld0Jsb2IoW2FycmF5XSwgeyB0eXBlOiBtaW1lVHlwZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRhdGEgVVJMIHN0cmluZyB0byBCbG9iXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGRhdGFVUkwgW2luXSBkYXRhIFVSTCBzdHJpbmdcclxuICAgICAgICAgKiBAcmV0dXJuIHtCbG9ifSBCbG9iIGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRhdGFVUkxUb0Jsb2IoZGF0YVVSTDogc3RyaW5nKTogQmxvYiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IEJpbmFyeS5leGVjRGF0YVVSTFJlZ0V4cChkYXRhVVJMKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQuYmFzZTY0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQmluYXJ5LmJhc2U2NFRvQmxvYihyZXN1bHQuZGF0YSwgcmVzdWx0Lm1pbWVUeXBlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBCaW5hcnkudGV4dFRvQmxvYihyZXN1bHQuZGF0YSwgcmVzdWx0Lm1pbWVUeXBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmFzZTY0IHN0cmluZyB0byBCbG9iXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYmFzZTY0IHtzdHJpbmd9IFtpbl0gQmFzZTY0IHN0cmluZyBkYXRhXHJcbiAgICAgICAgICogQHBhcmFtIG1pbWVUeXBlIHtzdHJpbmd9IFtpbl0gTWltZVR5cGUgb2YgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jsb2J9IEJsb2IgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmFzZTY0VG9CbG9iKGJhc2U2NDogc3RyaW5nLCBtaW1lVHlwZTogc3RyaW5nID0gXCJ0ZXh0L3BsYWluXCIpOiBCbG9iIHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSBCaW5hcnkuYmFzZTY0VG9CeXRlU3RyaW5nKGJhc2U2NCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gQmluYXJ5LmJ5dGVTdHJpbmdUb1VpbnQ4QXJyYXkoYnl0ZXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5LnVpbnQ4QXJyYXlUb0Jsb2IoYXJyYXksIG1pbWVUeXBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHRleHQgc3RyaW5nIHRvIEJsb2JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB0ZXh0IHtzdHJpbmd9IFtpbl0gdGV4dCBzdHJpbmcgZGF0YVxyXG4gICAgICAgICAqIEBwYXJhbSBtaW1lVHlwZSB7c3RyaW5nfSBbaW5dIE1pbWVUeXBlIG9mIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtCbG9ifSBCbG9iIGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHRleHRUb0Jsb2IodGV4dDogc3RyaW5nLCBtaW1lVHlwZTogc3RyaW5nID0gXCJ0ZXh0L3BsYWluXCIpOiBCbG9iIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS5uZXdCbG9iKFt0ZXh0XSwgeyB0eXBlOiBtaW1lVHlwZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7QmxvYn0gYmxvYiBbaW5dIGJsb2IgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0NEUC5JUHJvbWlzZTxBcnJheUJ1ZmZlcj59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYjogQmxvYik6IElQcm9taXNlPEFycmF5QnVmZmVyPiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmNlbCA9ICgpID0+IHJlYWRlci5hYm9ydCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoQmluYXJ5Lm1ha2VFcnJvckluZm9Gcm9tRE9NRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19GSUxFX1JFQURFUl9FUlJPUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLmVycm9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiRmlsZVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcigpIGZhaWxlZC5cIlxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKTtcclxuICAgICAgICAgICAgfSwgY2FuY2VsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyBVaW50OEFycmF5XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtCbG9ifSBibG9iIFtpbl0gYmxvYiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7Q0RQLklQcm9taXNlPFVpbnQ4QXJyYXk+fSBwcm9taXNlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZEJsb2JBc1VpbnQ4QXJyYXkoYmxvYjogQmxvYik6IElQcm9taXNlPFVpbnQ4QXJyYXk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QsIGRlcGVuZE9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRPbihCaW5hcnkucmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChidWZmZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgVWludDhBcnJheShidWZmZXIpKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3I6IEVycm9ySW5mbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyBkYXRhIFVSTFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7QmxvYn0gYmxvYiBbaW5dIGJsb2IgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0NEUC5JUHJvbWlzZTxzdHJpbmc+fSBwcm9taXNlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZEJsb2JBc0RhdGFVUkwoYmxvYjogQmxvYik6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICBjb25zdCBjYW5jZWwgPSAoKSA9PiByZWFkZXIuYWJvcnQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEJpbmFyeS5tYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkZpbGVSZWFkZXIucmVhZEFzRGF0YVVSTCgpIGZhaWxlZC5cIlxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGJsb2IpO1xyXG4gICAgICAgICAgICB9LCBjYW5jZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcmVhZCBCbG9iIGFzIEJhc2U2NCBzdHJpbmdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8c3RyaW5nPn0gcHJvbWlzZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRCbG9iQXNCYXNlNjQoYmxvYjogQmxvYik6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCwgZGVwZW5kT24pID0+IHtcclxuICAgICAgICAgICAgICAgIGRlcGVuZE9uKEJpbmFyeS5yZWFkQmxvYkFzRGF0YVVSTChibG9iKSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigoZGF0YVVSTCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBkYXRhVVJMIGlzIGFsd2F5cyBlbmNvZGVkIGJhc2U2NFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYXNlNjQgPSBkYXRhVVJMLnNwbGl0KFwiLFwiKVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShiYXNlNjQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcjogRXJyb3JJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcmVhZCBCbG9iIGFzIHRleHQgc3RyaW5nXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtCbG9ifSBibG9iIFtpbl0gYmxvYiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7Q0RQLklQcm9taXNlPFVpbnQ4QXJyYXk+fSBwcm9taXNlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZEJsb2JBc1RleHQoYmxvYjogQmxvYiwgZW5jb2Rpbmc6IHN0cmluZyA9IFwidXRmLThcIik6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICBjb25zdCBjYW5jZWwgPSAoKSA9PiByZWFkZXIuYWJvcnQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZGVjb2RlVVJJQ29tcG9uZW50KHJlYWRlci5yZXN1bHQpKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoQmluYXJ5Lm1ha2VFcnJvckluZm9Gcm9tRE9NRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19GSUxFX1JFQURFUl9FUlJPUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLmVycm9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiRmlsZVJlYWRlci5yZWFkQXNUZXh0KCkgZmFpbGVkLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYiwgZW5jb2RpbmcpO1xyXG4gICAgICAgICAgICB9LCBjYW5jZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZGF0YSBVUkwgc3RyaW5nIHRvIEFycmF5QnVmZmVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkYXRhVVJMVG9BcnJheUJ1ZmZlcihkYXRhVVJMOiBzdHJpbmcpOiBBcnJheUJ1ZmZlciB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gQmluYXJ5LmRhdGFVUkxUb1VpbnQ4QXJyYXkoZGF0YVVSTCk7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5idWZmZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBkYXRhIFVSTCBzdHJpbmcgdG8gVWludDhBcnJheVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZGF0YVVSTFRvVWludDhBcnJheShkYXRhVVJMOiBzdHJpbmcpOiBVaW50OEFycmF5IHtcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gQmluYXJ5LmV4ZWNEYXRhVVJMUmVnRXhwKGRhdGFVUkwpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5iYXNlNjQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBCaW5hcnkuYmFzZTY0VG9VaW50OEFycmF5KHJlc3VsdC5kYXRhKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBCaW5hcnkudGV4dFRvVWludDhBcnJheShyZXN1bHQuZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJhc2U2NCBzdHJpbmcgdG8gQXJyYXlCdWZmZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0OiBzdHJpbmcpOiBBcnJheUJ1ZmZlciB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFycmF5ID0gQmluYXJ5LmJhc2U2NFRvVWludDhBcnJheShiYXNlNjQpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXkuYnVmZmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmFzZTY0IHN0cmluZyB0byBVaW50OEFycmF5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBiYXNlNjRUb1VpbnQ4QXJyYXkoYmFzZTY0OiBzdHJpbmcpOiBVaW50OEFycmF5IHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSBCaW5hcnkuYmFzZTY0VG9CeXRlU3RyaW5nKGJhc2U2NCk7XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkuYnl0ZVN0cmluZ1RvVWludDhBcnJheShieXRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiB0ZXh0IHN0cmluZyB0byBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdGV4dFRvQXJyYXlCdWZmZXIodGV4dDogc3RyaW5nKTogQXJyYXlCdWZmZXIge1xyXG4gICAgICAgICAgICBjb25zdCBhcnJheSA9IEJpbmFyeS50ZXh0VG9VaW50OEFycmF5KHRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXkuYnVmZmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdGV4dCBzdHJpbmcgdG8gVWludDhBcnJheVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdGV4dFRvVWludDhBcnJheSh0ZXh0OiBzdHJpbmcpOiBVaW50OEFycmF5IHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSBCaW5hcnkudGV4dFRvQnl0ZVN0cmluZyh0ZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS5ieXRlU3RyaW5nVG9VaW50OEFycmF5KGJ5dGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFycmF5QnVmZmVyIHRvIGRhdGEgVVJMIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYXJyYXlCdWZmZXJUb0RhdGFVUkwoYnVmZmVyOiBBcnJheUJ1ZmZlciwgbWltZVR5cGU6IHN0cmluZyA9IFwidGV4dC9wbGFpblwiKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS51aW50OEFycmF5VG9EYXRhVVJMKG5ldyBVaW50OEFycmF5KGJ1ZmZlciksIG1pbWVUeXBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFycmF5QnVmZmVyIHRvIEJhc2U2NCBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGFycmF5QnVmZmVyVG9CYXNlNjQoYnVmZmVyOiBBcnJheUJ1ZmZlcik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkudWludDhBcnJheVRvQmFzZTY0KG5ldyBVaW50OEFycmF5KGJ1ZmZlcikpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQXJyYXlCdWZmZXIgdG8gdGV4dCBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGFycmF5QnVmZmVyVG9UZXh0KGJ1ZmZlcjogQXJyYXlCdWZmZXIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5LnVpbnQ4QXJyYXlUb1RleHQobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVaW50OEFycmF5IHRvIGRhdGEgVVJMIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdWludDhBcnJheVRvRGF0YVVSTChhcnJheTogVWludDhBcnJheSwgbWltZVR5cGU6IHN0cmluZyA9IFwidGV4dC9wbGFpblwiKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgYmFzZTY0ID0gQmluYXJ5LnVpbnQ4QXJyYXlUb0Jhc2U2NChhcnJheSk7XHJcbiAgICAgICAgICAgIHJldHVybiBgZGF0YToke21pbWVUeXBlfTtiYXNlNjQsJHtiYXNlNjR9YDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVpbnQ4QXJyYXkgdG8gQmFzZTY0IHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdWludDhBcnJheVRvQmFzZTY0KGFycmF5OiBVaW50OEFycmF5KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSBCaW5hcnkudWludDhBcnJheVRvQnl0ZVN0cmluZyhhcnJheSk7XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkuYnl0ZVN0cmluZ1RvQmFzZTY0KGJ5dGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVpbnQ4QXJyYXkgdG8gdGV4dCBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHVpbnQ4QXJyYXlUb1RleHQoYXJyYXk6IFVpbnQ4QXJyYXkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IEJpbmFyeS51aW50OEFycmF5VG9CeXRlU3RyaW5nKGFycmF5KTtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS5ieXRlU3RyaW5nVG9UZXh0KGJ5dGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRhdGEgVVJMIHN0cmluZyB0byB0ZXh0IHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZGF0YVVSTFRvVGV4dChkYXRhVVJMOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBCaW5hcnkuZXhlY0RhdGFVUkxSZWdFeHAoZGF0YVVSTCk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVzdWx0LmJhc2U2NCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS5iYXNlNjRUb1RleHQocmVzdWx0LmRhdGEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyZXN1bHQuZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJhc2U2NCBzdHJpbmcgdG8gdGV4dCBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJhc2U2NFRvVGV4dChiYXNlNjQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0gQmluYXJ5LmJhc2U2NFRvQnl0ZVN0cmluZyhiYXNlNjQpO1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5LmJ5dGVTdHJpbmdUb1RleHQoYnl0ZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdGV4dCBzdHJpbmcgdG8gZGF0YSBVUkwgc3RyaW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB0ZXh0VG9EYXRhVVJMKHRleHQ6IHN0cmluZywgbWltZVR5cGU6IHN0cmluZyA9IFwidGV4dC9wbGFpblwiKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgYmFzZTY0ID0gQmluYXJ5LnRleHRUb0Jhc2U2NCh0ZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIGBkYXRhOiR7bWltZVR5cGV9O2Jhc2U2NCwke2Jhc2U2NH1gO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdGV4dCBzdHJpbmcgdG8gQmFzZTY0IHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdGV4dFRvQmFzZTY0KHRleHQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0gQmluYXJ5LnRleHRUb0J5dGVTdHJpbmcodGV4dCk7XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkuYnl0ZVN0cmluZ1RvQmFzZTY0KGJ5dGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRhdGEgVVJJIOW9ouW8j+OBruato+imj+ihqOePvlxyXG4gICAgICAgICAqIOWPguiAgzogaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvamEvZG9jcy9kYXRhX1VSSXNcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBleGVjRGF0YVVSTFJlZ0V4cChkYXRhVVJMOiBzdHJpbmcpOiBJRGF0YVVSTENvbXBvbmVudCB7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBbbWF0Y2hdIDE6IE1pbWVUeXBlXHJcbiAgICAgICAgICAgICAqICAgICAgICAgMjogXCI7YmFzZTY0XCIg44KS5ZCr44KA44Kq44OX44K344On44OzXHJcbiAgICAgICAgICAgICAqICAgICAgICAgMzogZGF0YSDmnKzkvZNcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGNvbnN0IHJlRGF0YVVSTCA9IC9eZGF0YTooLis/XFwvLis/KT8oOy4rPyk/LCguKikkLztcclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVEYXRhVVJMLmV4ZWMoZGF0YVVSTCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb21wb25lbnQ6IElEYXRhVVJMQ29tcG9uZW50ID0ge1xyXG4gICAgICAgICAgICAgICAgbWltZVR5cGU6IFwiXCIsXHJcbiAgICAgICAgICAgICAgICBiYXNlNjQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBcIlwiLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQubWltZVR5cGUgPSByZXN1bHRbMV07XHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnQuYmFzZTY0ID0gLztiYXNlNjQvLnRlc3QocmVzdWx0WzJdKTtcclxuICAgICAgICAgICAgICAgIGNvbXBvbmVudC5kYXRhID0gcmVzdWx0WzNdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9uZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdWludDhBcnJheVRvQnl0ZVN0cmluZyhhcnJheTogVWludDhBcnJheSkge1xyXG4gICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKGFycmF5LCBpID0+IFN0cmluZy5mcm9tQ2hhckNvZGUoaSkpLmpvaW4oXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBiYXNlNjRUb0J5dGVTdHJpbmcoYmFzZTY0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmF0b2IoYmFzZTY0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHRleHRUb0J5dGVTdHJpbmcodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgLy8gZmlyc3Qgd2UgdXNlIGVuY29kZVVSSUNvbXBvbmVudCB0byBnZXQgcGVyY2VudC1lbmNvZGVkIFVURi04LFxyXG4gICAgICAgICAgICAvLyB0aGVuIHdlIGNvbnZlcnQgdGhlIHBlcmNlbnQgZW5jb2RpbmdzIGludG8gcmF3IGJ5dGVzIHdoaWNoXHJcbiAgICAgICAgICAgIC8vIGNhbiBiZSBmZWQgaW50byBidG9hLlxyXG4gICAgICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KHRleHQpLnJlcGxhY2UoLyUoWzAtOUEtRl17Mn0pL2csXHJcbiAgICAgICAgICAgICAgICAobWF0Y2gsIHAxKSA9PiBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KHAxLCAxNikpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBieXRlU3RyaW5nVG9VaW50OEFycmF5KGJ5dGVzOiBzdHJpbmcpOiBVaW50OEFycmF5IHtcclxuICAgICAgICAgICAgY29uc3QgYXJyYXkgPSBieXRlcy5zcGxpdChcIlwiKS5tYXAoYyA9PiBjLmNoYXJDb2RlQXQoMCkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkoYXJyYXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgYnl0ZVN0cmluZ1RvQmFzZTY0KGJ5dGVzOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmJ0b2EoYnl0ZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgYnl0ZVN0cmluZ1RvVGV4dChieXRlczogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgLy8gZ29pbmcgYmFja3dhcmRzOiBmcm9tIGJ5dGVzdHJlYW0sIHRvIHBlcmNlbnQtZW5jb2RpbmcsIHRvIG9yaWdpbmFsIHN0cmluZy5cclxuICAgICAgICAgICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChieXRlcy5zcGxpdChcIlwiKS5tYXAoXHJcbiAgICAgICAgICAgICAgICBjID0+IGAlJHsoXCIwMFwiICsgYy5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpfWBcclxuICAgICAgICAgICAgKS5qb2luKFwiXCIpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIEBmaWxlICBCaW5hcnlUcmFuc3BvcnQudHNcclxuICogQGJyaWVmIGpRdWVyeSBhamF4IHRyYW5zcG9ydCBmb3IgbWFraW5nIGJpbmFyeSBkYXRhIHR5cGUgcmVxdWVzdHMuXHJcbiAqXHJcbiAqICAgICAgICBvcmlnaW5hbDogaHR0cHM6Ly9naXRodWIuY29tL2hlbnJ5YS9qcy1qcXVlcnkvYmxvYi9tYXN0ZXIvQmluYXJ5VHJhbnNwb3J0L2pxdWVyeS5iaW5hcnl0cmFuc3BvcnQuanNcclxuICogICAgICAgIGF1dGhvcjogICBIZW5yeSBBbGd1cyA8aGVucnlhbGd1c0BnbWFpbC5jb20+XHJcbiAqL1xyXG5uYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuICAgIC8vIFN1cHBvcnQgZmlsZSBwcm90b2NvbC4gKGFzIHNhbWUgYXMgb2ZmaWNpYWwgd2F5KVxyXG4gICAgY29uc3QgeGhyU3VjY2Vzc1N0YXR1cyA9IHtcclxuICAgICAgICAwOiAyMDAsXHJcbiAgICAgICAgMTIyMzogMjA0XHJcbiAgICB9O1xyXG5cclxuICAgICQuYWpheFRyYW5zcG9ydChcIitiaW5hcnlcIiwgKG9wdGlvbnM6IEpRdWVyeS5BamF4U2V0dGluZ3MsIG9yaWdpbmFsT3B0aW9uczogSlF1ZXJ5LkFqYXhTZXR0aW5ncywganFYSFI6IEpRdWVyeVhIUikgPT4ge1xyXG4gICAgICAgIGlmIChnbG9iYWwuRm9ybURhdGEgJiZcclxuICAgICAgICAgICAgKChvcHRpb25zLmRhdGFUeXBlICYmIChvcHRpb25zLmRhdGFUeXBlID09PSBcImJpbmFyeVwiKSkgfHxcclxuICAgICAgICAgICAgKG9wdGlvbnMuZGF0YSAmJiAoKGdsb2JhbC5BcnJheUJ1ZmZlciAmJiBvcHRpb25zLmRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgfHxcclxuICAgICAgICAgICAgKGdsb2JhbC5CbG9iICYmIG9wdGlvbnMuZGF0YSBpbnN0YW5jZW9mIGdsb2JhbC5CbG9iKSkpKSkge1xyXG4gICAgICAgICAgICBsZXQgYWJvcnRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNlbmQ6IGZ1bmN0aW9uIChoZWFkZXJzOiBKUXVlcnkuUGxhaW5PYmplY3QsIGNhbGxiYWNrOiBKUXVlcnkuVHJhbnNwb3J0LlN1Y2Nlc3NDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldHVwIGFsbCB2YXJpYWJsZXNcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBvcHRpb25zLnVybDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gb3B0aW9ucy50eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBibG9iIG9yIGFycmF5YnVmZmVyLiBEZWZhdWx0IGlzIGJsb2JcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhVHlwZSA9ICg8YW55Pm9wdGlvbnMpLnJlc3BvbnNlVHlwZSB8fCBcImJsb2JcIjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gb3B0aW9ucy5kYXRhIHx8IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlcm5hbWUgPSBvcHRpb25zLnVzZXJuYW1lIHx8IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkIHx8IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IF9jYWxsYmFjazogSlF1ZXJ5LlRyYW5zcG9ydC5TdWNjZXNzQ2FsbGJhY2sgPSBjYWxsYmFjayB8fCAoKCkgPT4geyAvKiBub29wICovIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBzdWNjZWVkZWQgaGFuZGxlclxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9kYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhW29wdGlvbnMuZGF0YVR5cGVdID0geGhyLnJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2FsbGJhY2soXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHJTdWNjZXNzU3RhdHVzW3hoci5zdGF0dXNdIHx8IHhoci5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SlF1ZXJ5LkFqYXguVGV4dFN0YXR1cz54aHIuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIGhhbmRsZXJcclxuICAgICAgICAgICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX2RhdGEgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGFbb3B0aW9ucy5kYXRhVHlwZV0gPSB4aHIucmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgY2FsbGJhY2sgYW5kIHNlbmQgZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2FsbGJhY2soXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEpRdWVyeS5BamF4LlRleHRTdGF0dXM+eGhyLnN0YXR1c1RleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBhYm9ydCBoYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9kYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhW29wdGlvbnMuZGF0YVR5cGVdID0geGhyLnJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIGNhbGxiYWNrIGFuZCBzZW5kIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxKUXVlcnkuQWpheC5UZXh0U3RhdHVzPnhoci5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWJvcnQgY2FsbGJhY2tcclxuICAgICAgICAgICAgICAgICAgICBhYm9ydENhbGxiYWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4aHIuYWJvcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB4aHIub3Blbih0eXBlLCB1cmwsIGFzeW5jLCB1c2VybmFtZSwgcGFzc3dvcmQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXR1cCBjdXN0b20gaGVhZGVyc1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBoZWFkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihpLCBoZWFkZXJzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IGRhdGFUeXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFib3J0OiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFib3J0Q2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWJvcnRDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSB0eXBlcz1cImpxdWVyeVwiIC8+XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBpbXBvcnQgUHJvbWlzZSA9IENEUC5Qcm9taXNlO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5GdW5jdGlvbnNdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWF0aC5hYnMg44KI44KK44KC6auY6YCf44GqIGFic1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gYWJzKHg6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHggPj0gMCA/IHggOiAteDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGgubWF4IOOCiOOCiuOCgumrmOmAn+OBqiBtYXhcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1heChsaHM6IG51bWJlciwgcmhzOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBsaHMgPj0gcmhzID8gbGhzIDogcmhzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWF0aC5taW4g44KI44KK44KC6auY6YCf44GqIG1pblxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWluKGxoczogbnVtYmVyLCByaHM6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGxocyA8PSByaHMgPyBsaHMgOiByaHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmlbDlgKTjgpIgMCDoqbDjgoHjgZfjgabmloflrZfliJfjgpLnlJ/miJBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHRvWmVyb1BhZGRpbmcobm86IG51bWJlciwgbGltaXQ6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHNpZ25lZCA9IFwiXCI7XHJcbiAgICAgICAgbm8gPSBOdW1iZXIobm8pO1xyXG5cclxuICAgICAgICBpZiAoaXNOYU4obm8pIHx8IGlzTmFOKGxpbWl0KSB8fCBsaW1pdCA8PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5vIDwgMCkge1xyXG4gICAgICAgICAgICBubyA9IFRvb2xzLmFicyhubyk7XHJcbiAgICAgICAgICAgIHNpZ25lZCA9IFwiLVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNpZ25lZCArIChBcnJheShsaW1pdCkuam9pbihcIjBcIikgKyBubykuc2xpY2UoLWxpbWl0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaWh+Wtl+WIl+OBruODkOOCpOODiOaVsOOCkuOCq+OCpuODs+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3RyaW5nU2l6ZShzcmM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIChCaW5hcnkubmV3QmxvYihbc3JjXSwgeyB0eXBlOiBcInRleHQvcGxhaW5cIiB9KSkuc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaWh+Wtl+WIl+OCkuODkOOCpOODiOWItumZkOOBl+OBpuWIhuWJslxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gdG9TdHJpbmdDaHVua3Moc3JjOiBzdHJpbmcsIGxpbWl0OiBudW1iZXIpOiBzdHJpbmdbXSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGNodW5rcyA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdCBzZXRDaHVuayA9IChpbnB1dDogc3RyaW5nKTogc3RyaW5nW10gPT4ge1xyXG4gICAgICAgICAgICBpZiAobGltaXQgPCBnZXRTdHJpbmdTaXplKGlucHV0KSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGFsZiA9IE1hdGguZmxvb3IoaW5wdXQubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaHMgPSBpbnB1dC5zbGljZSgwLCBoYWxmKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJocyA9IGlucHV0LnNsaWNlKGhhbGYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtsaHMsIHJoc107XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjaHVua3MucHVzaChpbnB1dCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBtYWtlQ2h1bmsgPSAod29yazogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZhaWx1cmVzID0gc2V0Q2h1bmsod29yayk7XHJcbiAgICAgICAgICAgIHdoaWxlICgwIDwgZmFpbHVyZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBtYWtlQ2h1bmsoZmFpbHVyZXMuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBtYWtlQ2h1bmsoc3JjKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNodW5rcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWkmumHjee2meaJv+OBruOBn+OCgeOBruWun+ihjOaZgue2meaJv+mWouaVsFxyXG4gICAgICpcclxuICAgICAqIFN1YiBDbGFzcyDlgJnoo5zjgqrjg5bjgrjjgqfjgq/jg4jjgavlr77jgZfjgaYgU3VwZXIgQ2xhc3Mg5YCZ6KOc44Kq44OW44K444Kn44Kv44OI44KS55u05YmN44GuIFN1cGVyIENsYXNzIOOBqOOBl+OBpuaMv+WFpeOBmeOCi+OAglxyXG4gICAgICogcHJvdG90eXBlIOOBruOBv+OCs+ODlOODvOOBmeOCi+OAglxyXG4gICAgICog44Kk44Oz44K544K/44Oz44K544Oh44Oz44OQ44KS44Kz44OU44O844GX44Gf44GE5aC05ZCI44CBU3VwZXIgQ2xhc3Mg44GM55aR5Ly844Kz44Oz44K544OI44Op44Kv44K/44KS5o+Q5L6b44GZ44KL5b+F6KaB44GM44GC44KL44CCXHJcbiAgICAgKiDoqbPntLDjga8gY2RwLnRvb2xzLkZ1bmN0aW9ucy5zcGVjLnRzIOOCkuWPgueFp+OAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzdWJDbGFzcyAgIHtjb25zdHJ1Y3Rvcn0gW2luXSDjgqrjg5bjgrjjgqfjgq/jg4jjga4gY29uc3RydWN0b3Ig44KS5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gc3VwZXJDbGFzcyB7Y29uc3RydWN0b3J9IFtpbl0g44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5oZXJpdChzdWJDbGFzczogYW55LCBzdXBlckNsYXNzOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBfcHJvdG90eXBlID0gc3ViQ2xhc3MucHJvdG90eXBlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBfaW5oZXJpdCgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfaW5oZXJpdC5wcm90b3R5cGUgPSBzdXBlckNsYXNzLnByb3RvdHlwZTtcclxuICAgICAgICBzdWJDbGFzcy5wcm90b3R5cGUgPSBuZXcgX2luaGVyaXQoKTtcclxuXHJcbiAgICAgICAgJC5leHRlbmQoc3ViQ2xhc3MucHJvdG90eXBlLCBfcHJvdG90eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1peGluIOmWouaVsFxyXG4gICAgICpcclxuICAgICAqIFR5cGVTY3JpcHQgT2ZmaWNpYWwgU2l0ZSDjgavovInjgaPjgabjgYTjgosgbWl4aW4g6Zai5pWwXHJcbiAgICAgKiBodHRwOi8vd3d3LnR5cGVzY3JpcHRsYW5nLm9yZy9IYW5kYm9vayNtaXhpbnNcclxuICAgICAqIOaXouOBq+Wumue+qeOBleOCjOOBpuOBhOOCi+OCquODluOCuOOCp+OCr+ODiOOBi+OCieOAgeaWsOimj+OBq+OCquODluOCuOOCp+OCr+ODiOOCkuWQiOaIkOOBmeOCi+OAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZXJpdmVkIHtjb25zdHJ1Y3Rvcn0gICAgW2luXSDlkIjmiJDjgZXjgozjgovjgqrjg5bjgrjjgqfjgq/jg4jjga4gY29uc3RydWN0b3Ig44KS5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gYmFzZXMgICB7Y29uc3RydWN0b3IuLi59IFtpbl0g5ZCI5oiQ5YWD44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumiAo5Y+v5aSJ5byV5pWwKVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWl4aW4oZGVyaXZlZDogYW55LCAuLi5iYXNlczogYW55W10pOiB2b2lkIHtcclxuICAgICAgICBiYXNlcy5mb3JFYWNoKChiYXNlKSA9PiB7XHJcbiAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2UucHJvdG90eXBlKS5mb3JFYWNoKG5hbWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVyaXZlZC5wcm90b3R5cGVbbmFtZV0gPSBiYXNlLnByb3RvdHlwZVtuYW1lXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gY29ycmVjdGx5IHNldCB1cCB0aGUgcHJvdG90eXBlIGNoYWluLCBmb3Igc3ViY2xhc3Nlcy5cclxuICAgICAqIFRoZSBmdW5jdGlvbiBiZWhhdmlvciBpcyBzYW1lIGFzIGV4dGVuZCgpIGZ1bmN0aW9uIG9mIEJhY2tib25lLmpzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwcm90b1Byb3BzICB7T2JqZWN0fSBbaW5dIHNldCBwcm90b3R5cGUgcHJvcGVydGllcyBhcyBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gc3RhdGljUHJvcHMge09iamVjdH0gW2luXSBzZXQgc3RhdGljIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBzdWJjbGFzcyBjb25zdHJ1Y3Rvci5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICog44Kv44Op44K557aZ5om/44Gu44Gf44KB44Gu44OY44Or44OR44O86Zai5pWwXHJcbiAgICAgKiBCYWNrYm9uZS5qcyBleHRlbmQoKSDplqLmlbDjgajlkIznrYlcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcHJvdG9Qcm9wcyAge09iamVjdH0gW2luXSBwcm90b3R5cGUgcHJvcGVydGllcyDjgpLjgqrjg5bjgrjjgqfjgq/jg4jjgafmjIflrppcclxuICAgICAqIEBwYXJhbSBzdGF0aWNQcm9wcyB7T2JqZWN0fSBbaW5dIHN0YXRpYyBwcm9wZXJ0aWVzIOOCkuOCquODluOCuOOCp+OCr+ODiOOBp+aMh+WumlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSDjgrXjg5bjgq/jg6njgrnjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChwcm90b1Byb3BzOiBvYmplY3QsIHN0YXRpY1Byb3BzPzogb2JqZWN0KTogb2JqZWN0IHtcclxuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIGxldCBjaGlsZDtcclxuXHJcbiAgICAgICAgaWYgKHByb3RvUHJvcHMgJiYgcHJvdG9Qcm9wcy5oYXNPd25Qcm9wZXJ0eShcImNvbnN0cnVjdG9yXCIpKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjaGlsZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuZXh0ZW5kKGNoaWxkLCBwYXJlbnQsIHN0YXRpY1Byb3BzKTtcclxuXHJcbiAgICAgICAgY29uc3QgU3Vycm9nYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdXJyb2dhdGUucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcclxuICAgICAgICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgU3Vycm9nYXRlO1xyXG5cclxuICAgICAgICBpZiAocHJvdG9Qcm9wcykge1xyXG4gICAgICAgICAgICAkLmV4dGVuZChjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNoaWxkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRFBJIOWPluW+l1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0RGV2aWNlUGl4Y2VsUmF0aW8oKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgbWVkaWFRdWVyeTtcclxuICAgICAgICBjb25zdCBpc19maXJlZm94ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJmaXJlZm94XCIpID4gLTE7XHJcbiAgICAgICAgaWYgKG51bGwgIT0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gJiYgIWlzX2ZpcmVmb3gpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93Lm1hdGNoTWVkaWEpIHtcclxuICAgICAgICAgICAgbWVkaWFRdWVyeSA9XHJcbiAgICAgICAgICAgICAgICBcIigtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuNSksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDMvMiksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLXJlc29sdXRpb246IDEuNWRwcHgpXCI7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5KS5tYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMS41O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1lZGlhUXVlcnkgPVxyXG4gICAgICAgICAgICAgICAgXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDIpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIvMSksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLXJlc29sdXRpb246IDJkcHB4KVwiO1xyXG4gICAgICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWVkaWFRdWVyeSA9XHJcbiAgICAgICAgICAgICAgICBcIigtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDAuNzUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMC43NSksXFxcclxuICAgICAgICAgICAgICAgICAgICAoLW8tbWluLWRldmljZS1waXhlbC1yYXRpbzogMy80KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tcmVzb2x1dGlvbjogMC43NWRwcHgpXCI7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5KS5tYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMC43O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbnZhcyBlbGVtZW50IOOBruOCreODo+ODg+OCt+ODpVxyXG4gICAgbGV0IHNfY2FudmFzRmFjdG9yeTogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblxyXG4gICAgLy8g44Kt44Oj44OD44K344Ol5riI44G/44GuIENhbnZhcyDjgpLlj5blvpfjgZnjgotcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRDYW52YXMoKTogSFRNTENhbnZhc0VsZW1lbnQge1xyXG4gICAgICAgIHNfY2FudmFzRmFjdG9yeSA9IHNfY2FudmFzRmFjdG9yeSB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIHJldHVybiA8SFRNTENhbnZhc0VsZW1lbnQ+c19jYW52YXNGYWN0b3J5LmNsb25lTm9kZShmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnlLvlg4/jg6rjgr3jg7zjgrnjga7jg63jg7zjg4nlrozkuobjgpLkv53oqLxcclxuICAgICAqIOODluODqeOCpuOCtuaXouWumuOBruODl+ODreOCsOODrOODg+OCt+ODluODreODvOODieOCkui1sOOCieOBm+OBquOBhOOBn+OCgS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHVybCBbaW5dIHVybCAoZGF0YS11cmwpXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvbWlzZTxzdHJpbmc+fSDooajnpLrlj6/og73jgaogdXJsXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBlbnN1cmVJbWFnZUxvYWRlZCh1cmw6IHN0cmluZyk6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGltZykge1xyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IFwiXCI7ICAgLy8g6Kqt44G/6L6844G/5YGc5q2iXHJcbiAgICAgICAgICAgICAgICBpbWcgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodXJsKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5vbmVycm9yID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG1ha2VFcnJvckluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0lNQUdFX0xPQURfRkFJTEVELFxyXG4gICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICBcImltYWdlIGxvYWQgZmFpbGVkLiBbdXJsOiBcIiArIHVybCArIFwiXVwiXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSB1cmw7XHJcblxyXG4gICAgICAgIH0sIGRlc3Ryb3kpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55S75YOP44Gu44Oq44K144Kk44K6XHJcbiAgICAgKiDmjIflrprjgZfjgZ/plbfovrrjga7plbfjgZXjgavjgqLjgrnjg5rjgq/jg4jmr5TjgpLntq3mjIHjgZfjgabjg6rjgrXjgqTjgrrjgpLooYzjgYZcclxuICAgICAqIGxvbmdTaWRlTGVuZ3RoIOOCiOOCiuWwj+OBleOBquWgtOWQiOOBr+OCquODquOCuOODiuODq+OCteOCpOOCuuOBpyBkYXRhLXVybCDjgpLov5TljbTjgZnjgotcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNyYyAgICAgICAgICAgIFtpbl0gaW1hZ2Ug44Gr5oyH5a6a44GZ44KL44K944O844K5XHJcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGxvbmdTaWRlTGVuZ3RoIFtpbl0g44Oq44K144Kk44K644Gr5L2/55So44GZ44KL6ZW36L6644Gu5pyA5aSn5YCk44KS5oyH5a6aXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvbWlzZTxzdHJpbmc+fSBiYXNlNjQgZGF0YSB1cmwg44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiByZXNpemVJbWFnZShzcmM6IHN0cmluZywgbG9uZ1NpZGVMZW5ndGg6IG51bWJlcik6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGltZykge1xyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IFwiXCI7ICAgLy8g6Kqt44G/6L6844G/5YGc5q2iXHJcbiAgICAgICAgICAgICAgICBpbWcgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IGdldENhbnZhcygpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWggPSBpbWcuaGVpZ2h0LCBpdyA9IGltZy53aWR0aCwgaWEgPSBpaCAvIGl3O1xyXG4gICAgICAgICAgICAgICAgbGV0IGN3OiBudW1iZXIsIGNoOiBudW1iZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGl3ID09PSAwIHx8IDAgPT09IGlhKSB7IC8vIOW/teOBruOBn+OCgeS4jeato+OBqueUu+WDj+OCkuOCrOODvOODiVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfSU5WQUxJRF9JTUFHRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImludmFsaWQgaW1hZ2UuIFtzcmM6IFwiICsgc3JjICsgXCJdXCJcclxuICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdTaWRlTGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ1NpZGVMZW5ndGggPSAoaWEgPCAxKSA/IGl3IDogaWg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpYSA8IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3cgPSAobG9uZ1NpZGVMZW5ndGggPCBpdykgPyBsb25nU2lkZUxlbmd0aCA6IGl3O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaCA9IE1hdGgucm91bmQoY3cgKiBpYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSAobG9uZ1NpZGVMZW5ndGggPCBpaCkgPyBsb25nU2lkZUxlbmd0aCA6IGloO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdyA9IE1hdGgucm91bmQoY2ggLyBpYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSBjdztcclxuICAgICAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmdldENvbnRleHQoXCIyZFwiKS5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBjdywgY2gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNhbnZhcy50b0RhdGFVUkwoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaW1nLm9uZXJyb3IgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfSU1BR0VfTE9BRF9GQUlMRUQsXHJcbiAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UgbG9hZCBmYWlsZWQuIFtzcmM6IFwiICsgc3JjICsgXCJdXCJcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaW1nLnNyYyA9IHNyYztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5EYXRlVGltZV0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgRGF0ZVRpbWVcclxuICAgICAqIEBicmllZiDmmYLliLvmk43kvZzjga7jg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIERhdGVUaW1lIHtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDln7rngrnjgajjgarjgovml6Xku5jjgYvjgonjgIFu5pel5b6M44CBbuaXpeWJjeOCkueul+WHulxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJhc2UgICB7RGF0ZX0gICBbaW5dIOWfuua6luaXpVxyXG4gICAgICAgICAqIEBwYXJhbSBhZGQgICAge051bWJlcn0gW2luXSDliqDnrpfml6UuIOODnuOCpOODiuOCueaMh+WumuOBp27ml6XliY3jgoLoqK3lrprlj6/og71cclxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IHtTdHJpbmd9IFtpbl0geyB5ZWFyIHwgbW9udGggfCBkYXRlIHwgaG91ciB8IG1pbiB8IHNlYyB8IG1zZWMgfVxyXG4gICAgICAgICAqIEByZXR1cm4ge0RhdGV9IOaXpeS7mOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29tcHV0ZURhdGUoYmFzZTogRGF0ZSwgYWRkOiBudW1iZXIsIHRhcmdldDogc3RyaW5nID0gXCJkYXRlXCIpOiBEYXRlIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGJhc2UuZ2V0VGltZSgpKTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwieWVhclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoYmFzZS5nZXRVVENGdWxsWWVhcigpICsgYWRkKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtb250aFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDTW9udGgoYmFzZS5nZXRVVENNb250aCgpICsgYWRkKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZS5zZXRVVENEYXRlKGJhc2UuZ2V0VVRDRGF0ZSgpICsgYWRkKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJob3VyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZS5zZXRVVENIb3VycyhiYXNlLmdldFVUQ0hvdXJzKCkgKyBhZGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1pblwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDTWludXRlcyhiYXNlLmdldFVUQ01pbnV0ZXMoKSArIGFkZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VjXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZS5zZXRVVENTZWNvbmRzKGJhc2UuZ2V0VVRDU2Vjb25kcygpICsgYWRkKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtc2VjXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZS5zZXRVVENNaWxsaXNlY29uZHMoYmFzZS5nZXRVVENNaWxsaXNlY29uZHMoKSArIGFkZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVua25vd24gdGFyZ2V0OiBcIiArIHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZS5zZXRVVENEYXRlKGJhc2UuZ2V0VVRDRGF0ZSgpICsgYWRkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IHN0cmluZyB0byBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGUgc3RyaW5nIGV4KSBZWVlZLU1NLUREVEhIOm1tOnNzLnNzc1pcclxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb252ZXJ0SVNPU3RyaW5nVG9EYXRlKGRhdGVTdHJpbmc6IHN0cmluZyk6IERhdGUge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlVmFsdWUgPSB0aGlzLmNvbnZlcnRJU09TdHJpbmdUb0RhdGVWYWx1ZShkYXRlU3RyaW5nKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGVWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IGRhdGUgb2JqZWN0IGludG8gc3RyaW5nICh0aGUgSVNPIDg2MDEgRXh0ZW5kZWQgRm9ybWF0KVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGUgICB7RGF0ZX0gICBbaW5dIGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHRhcmdldCB7U3RyaW5nfSBbaW5dIHsgeWVhciB8IG1vbnRoIHwgZGF0ZSB8IG1pbiB8IHNlYyB8IG1zZWMgfCB0eiB9XHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSBkYXRlIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udmVydERhdGVUb0lTT1N0cmluZyhkYXRlOiBEYXRlLCB0YXJnZXQ6IHN0cmluZyA9IFwidHpcIik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzb0RhdGVTdHJpbmcgPSBkYXRlLnRvSVNPU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBuZWVkIG9mZnNldCBpZiBleHRlbmRlZCBmb3JtYXQgKMKxWVlZWVlZLU1NLUREVEhIOm1tOnNzLnNzc1opXHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IDI3ID09PSBpc29EYXRlU3RyaW5nLmxlbmd0aCA/IDMgOiAwO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ5ZWFyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmcuc3Vic3RyKDAsIG9mZnNldCArIDQpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1vbnRoXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmcuc3Vic3RyKDAsIG9mZnNldCArIDcpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImRhdGVcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZy5zdWJzdHIoMCwgb2Zmc2V0ICsgMTApO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1pblwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nLnN1YnN0cigwLCBvZmZzZXQgKyAxNik7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VjXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmcuc3Vic3RyKDAsIG9mZnNldCArIDE5KTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtc2VjXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmcuc3Vic3RyKDAsIG9mZnNldCArIDIzKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ0elwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmtub3duIHRhcmdldDogXCIgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBmaWxlIHN5c3RlbSBjb21wYXRpYmxlIHN0cmluZyB0byBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGUgc3RyaW5nIGV4KSBZWVlZX01NX0REVEhIX21tX3NzX3Nzc1xyXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnZlcnRGaWxlU3lzdGVtU3RyaW5nVG9EYXRlKGRhdGVTdHJpbmc6IHN0cmluZyk6IERhdGUge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlVmFsdWUgPSB0aGlzLmNvbnZlcnRGaWxlU3lzdGVtU3RyaW5nVG9EYXRlVmFsdWUoZGF0ZVN0cmluZyk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlVmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBkYXRlIG9iamVjdCBpbnRvIHN0cmluZyBpbiBmaWxlIHN5c3RlbSBjb21wYXRpYmxlIGZvcm1hdCAoWVlZWV9NTV9ERFRISF9tbV9zc19zc3MpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGF0ZSAgIHtEYXRlfSAgIFtpbl0gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IHtTdHJpbmd9IFtpbl0geyB5ZWFyIHwgbW9udGggfCBkYXRlIHwgbWluIHwgc2VjIHwgbXNlYyB9XHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSBmaWxlIHN5c3RlbSBjb21wYXRpYmxlIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udmVydERhdGVUb0ZpbGVTeXN0ZW1TdHJpbmcoZGF0ZTogRGF0ZSwgdGFyZ2V0OiBzdHJpbmcgPSBcIm1zZWNcIik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzb0RhdGVTdHJpbmcgPSBEYXRlVGltZS5jb252ZXJ0RGF0ZVRvSVNPU3RyaW5nKGRhdGUsIHRhcmdldCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVTeXN0ZW1TdHJpbmcgPSBpc29EYXRlU3RyaW5nLnJlcGxhY2UoL1stOi5dL2csIFwiX1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW1TdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IElTTyBzdHJpbmcgdG8gdmFsdWUgb2YgZGF0ZSAobWlsbGlzZWNvbmRzKVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGlzb1N0cmluZyB7U3RyaW5nfSBbaW5dIGRhdGUgc3RyaW5nXHJcbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfSB2YWx1ZSBvZiBkYXRlIChtcylcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBjb252ZXJ0SVNPU3RyaW5nVG9EYXRlVmFsdWUoaXNvU3RyaW5nOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBjb25zdCByZVllYXIgPSAvKFxcZHs0fXxbLStdXFxkezZ9KS87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlTW9udGggPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZURheSA9IC8oXFxkezJ9KS87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlRGF0ZSA9IG5ldyBSZWdFeHAoYCR7cmVZZWFyLnNvdXJjZX0oPzotJHtyZU1vbnRoLnNvdXJjZX0oPzotJHtyZURheS5zb3VyY2V9KSopKmApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVIb3VycyA9IC8oXFxkezJ9KS87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlTWludXRlcyA9IC8oXFxkezJ9KS87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlU2Vjb25kcyA9IC8oXFxkezJ9KS87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlTXMgPSAvKFxcZHszfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZVRpbWUgPSBuZXcgUmVnRXhwKGBUJHtyZUhvdXJzLnNvdXJjZX06JHtyZU1pbnV0ZXMuc291cmNlfSg/Ojoke3JlU2Vjb25kcy5zb3VyY2V9KD86XFwuJHtyZU1zLnNvdXJjZX0pKikqYCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZVR6ICA9IC8oWnxbLStdXFxkezJ9OlxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZUlTT1N0cmluZyA9IG5ldyBSZWdFeHAoYF4ke3JlRGF0ZS5zb3VyY2V9KD86JHtyZVRpbWUuc291cmNlfSg/OiR7cmVUei5zb3VyY2V9KSopKiRgKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlSVNPU3RyaW5nLmV4ZWMoaXNvU3RyaW5nKTtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpbnZhbGlkIElTTyBzdHJpbmdcclxuICAgICAgICAgICAgICAgIHJldHVybiBOYU47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSBwYXJzZUludChyZXN1bHRbMV0sIDEwKTtcclxuICAgICAgICAgICAgY29uc3QgbW9udGggPSBwYXJzZUludChyZXN1bHRbMl0sIDEwKSAtIDEgfHwgMDtcclxuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IHBhcnNlSW50KHJlc3VsdFszXSwgMTApIHx8IDE7XHJcbiAgICAgICAgICAgIGxldCBob3VycyA9IHBhcnNlSW50KHJlc3VsdFs0XSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gcGFyc2VJbnQocmVzdWx0WzVdLCAxMCkgfHwgMDtcclxuICAgICAgICAgICAgY29uc3Qgc2Vjb25kcyA9IHBhcnNlSW50KHJlc3VsdFs2XSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IG1zID0gcGFyc2VJbnQocmVzdWx0WzddLCAxMCkgfHwgMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRbOF0pIHtcclxuICAgICAgICAgICAgICAgIC8vIHRpbWV6b25lIG9mZnNldFxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChyZXN1bHRbOF1bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiWlwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiLVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAtSEg6bW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaG91cnMgKz0gcGFyc2VJbnQocmVzdWx0WzhdLnN1YnN0cigxLCAyKSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbnV0ZXMgKz0gcGFyc2VJbnQocmVzdWx0WzhdLnN1YnN0cig0LCAyKSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCIrXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICtISDptbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VycyAtPSBwYXJzZUludChyZXN1bHRbOF0uc3Vic3RyKDEsIDIpLCAxMCkgfHwgMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWludXRlcyAtPSBwYXJzZUludChyZXN1bHRbOF0uc3Vic3RyKDQsIDIpLCAxMCkgfHwgMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiaW52YWxpZCB0aW1lem9uZSBpbiBJU08gc3RyaW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5VVEMoeWVhciwgbW9udGgsIGRhdGUsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBtcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IGZpbGUgc3lzdGVtIGNvbXBhdGlibGUgc3RyaW5nIHRvIHRvIHZhbHVlIG9mIGRhdGUgKG1pbGxpc2Vjb25kcylcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRlU3RyaW5nIHtTdHJpbmd9IFtpbl0gZGF0ZSBzdHJpbmcgKFlZWVlfTU1fRERUSEhfbW1fc3Nfc3NzKVxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gY29udmVydGVkIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGNvbnZlcnRGaWxlU3lzdGVtU3RyaW5nVG9EYXRlVmFsdWUoZGF0ZVN0cmluZzogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgY29uc3QgcmVZZWFyID0gLyhcXGR7NH18Wy0rXVxcZHs2fSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZU1vbnRoID0gLyhcXGR7Mn0pLztcclxuICAgICAgICAgICAgY29uc3QgcmVEYXkgPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZURhdGUgPSBuZXcgUmVnRXhwKGAke3JlWWVhci5zb3VyY2V9KD86XyR7cmVNb250aC5zb3VyY2V9KD86XyR7cmVEYXkuc291cmNlfSk/KT9gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlSG91cnMgPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZU1pbnV0ZXMgPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZVNlY29uZHMgPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZU1zID0gLyhcXGR7M30pLztcclxuICAgICAgICAgICAgY29uc3QgcmVUaW1lID0gbmV3IFJlZ0V4cChgVCR7cmVIb3Vycy5zb3VyY2V9XyR7cmVNaW51dGVzLnNvdXJjZX0oPzpfJHtyZVNlY29uZHMuc291cmNlfSg/Ol8ke3JlTXMuc291cmNlfSk/KT9gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlRmlsZVN5c3RlbVN0cmluZyA9IG5ldyBSZWdFeHAoYF4ke3JlRGF0ZS5zb3VyY2V9KD86JHtyZVRpbWUuc291cmNlfSkqJGApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVGaWxlU3lzdGVtU3RyaW5nLmV4ZWMoZGF0ZVN0cmluZyk7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgLy8gaW52YWxpZCBmaWxlIHN5c3RlbSBzdHJpbmdcclxuICAgICAgICAgICAgICAgIHJldHVybiBOYU47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSBwYXJzZUludChyZXN1bHRbMV0sIDEwKTtcclxuICAgICAgICAgICAgY29uc3QgbW9udGggPSBwYXJzZUludChyZXN1bHRbMl0sIDEwKSAtIDEgfHwgMDtcclxuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IHBhcnNlSW50KHJlc3VsdFszXSwgMTApIHx8IDE7XHJcbiAgICAgICAgICAgIGNvbnN0IGhvdXJzID0gcGFyc2VJbnQocmVzdWx0WzRdLCAxMCkgfHwgMDtcclxuICAgICAgICAgICAgY29uc3QgbWludXRlcyA9IHBhcnNlSW50KHJlc3VsdFs1XSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZHMgPSBwYXJzZUludChyZXN1bHRbNl0sIDEwKSB8fCAwO1xyXG4gICAgICAgICAgICBjb25zdCBtcyA9IHBhcnNlSW50KHJlc3VsdFs3XSwgMTApIHx8IDA7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5VVEMoeWVhciwgbW9udGgsIGRhdGUsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwianF1ZXJ5XCIgLz5cclxuXHJcbm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5UZW1wbGF0ZV0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEpTVFxyXG4gICAgICogQGJyaWVmIOOCs+ODs+ODkeOCpOODq+a4iOOBvyDjg4bjg7Pjg5fjg6zjg7zjg4jmoLzntI3jgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBKU1Qge1xyXG4gICAgICAgIChkYXRhPzogYW55KTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIGludGVyZmFjZSBFbGVtZW50TWFwIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBKUXVlcnk7XHJcbiAgICB9XHJcblxyXG4gICAgaW50ZXJmYWNlIFNvdXJjZU1hcCB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgVGVtcGxhdGVcclxuICAgICAqIEBicmllZiB0ZW1wbGF0ZSBzY3JpcHQg44KS566h55CG44GZ44KL44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBUZW1wbGF0ZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9tYXBFbGVtZW50OiBFbGVtZW50TWFwOyAvLyE8IOOCreODvOOBqCBKUXVlcnkgRWxlbWVudCDjga4gTWFwIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIF9tYXBTb3VyY2U6IFNvdXJjZU1hcDsgICAvLyE8IFVSTCDjgagg44K944O844K544OV44Kh44Kk44OrKEhUTUwpIOOBriBNYXAg44Kq44OW44K444Kn44Kv44OIXHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8g5YWs6ZaL44Oh44K944OD44OJXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBnyBpZCwgY2xhc3Mg5ZCNLCBUYWcg5ZCN44KS44Kt44O844Gr44OG44Oz44OX44Os44O844OI44GuIEpRdWVyeSBFbGVtZW50IOOCkuWPluW+l+OBmeOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICBrZXkgICAgIFtpbl0gaWQsIGNsYXNzLCB0YWcg44KS6KGo44GZ5paH5a2X5YiXXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICBbc3JjXSAgIFtpbl0g5aSW6YOoIGh0bWwg44KS5oyH5a6a44GZ44KL5aC05ZCI44GvIHVybCDjgpLoqK3lrppcclxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjYWNoZV0gW2luXSBzcmMgaHRtbCDjgpLjgq3jg6Pjg4Pjgrfjg6XjgZnjgovloLTlkIjjga8gdHJ1ZS4gc3JjIOOBjOaMh+WumuOBleOCjOOBpuOBhOOCi+OBqOOBjeOBruOBv+acieWKuVxyXG4gICAgICAgICAqIEByZXR1cm4gdGVtcGxhdGUg44GM5qC857SN44GV44KM44Gm44GE44KLIEpRdWVyeSBFbGVtZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGdldFRlbXBsYXRlRWxlbWVudChrZXk6IHN0cmluZywgc3JjOiBzdHJpbmcgPSBudWxsLCBjYWNoZTogYm9vbGVhbiA9IHRydWUpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICBjb25zdCBtYXBFbGVtZW50ID0gVGVtcGxhdGUuZ2V0RWxlbWVudE1hcCgpO1xyXG4gICAgICAgICAgICBsZXQgJGVsZW1lbnQgPSBtYXBFbGVtZW50W2tleV07XHJcblxyXG4gICAgICAgICAgICBpZiAoISRlbGVtZW50IHx8ICEkZWxlbWVudFswXSkge1xyXG4gICAgICAgICAgICAgICAgLy8g6KaB57Sg44Gu5Y+W5b6XXHJcbiAgICAgICAgICAgICAgICBpZiAoc3JjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaHRtbCA9IFRlbXBsYXRlLmZpbmRIdG1sRnJvbVNvdXJjZShzcmMpO1xyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50ID0gJChodG1sKS5maW5kKGtleSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRlbGVtZW50ID0gJChrZXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8g6KaB57Sg44Gu5qSc6Ki8XHJcbiAgICAgICAgICAgICAgICBpZiAoISRlbGVtZW50IHx8ICEkZWxlbWVudFswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcsIGBpbnZhbGlkIFtrZXksIHNyY10gPSBbJHtrZXl9LCAke3NyY31dYCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNyYyAmJiBjYWNoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcEVsZW1lbnRba2V5XSA9ICRlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYXAg44Kq44OW44K444Kn44Kv44OI44Gu5YmK6ZmkXHJcbiAgICAgICAgICog5piO56S655qE44Gr44Kt44Oj44OD44K344Ol44KS6ZaL5pS+44GZ44KL5aC05ZCI44Gv5pys44Oh44K944OD44OJ44KS44Kz44O844Or44GZ44KLXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGVtcHR5KCk6IHZvaWQge1xyXG4gICAgICAgICAgICBUZW1wbGF0ZS5fbWFwRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgIFRlbXBsYXRlLl9tYXBTb3VyY2UgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44GfIGlkLCBjbGFzcyDlkI0sIFRhZyDlkI3jgpLjgq3jg7zjgasgSlNUIOOCkuWPluW+l+OBmeOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmcgfCBqUXVlcnl9IGtleSAgICAgW2luXSBpZCwgY2xhc3MsIHRhZyDjgpLooajjgZnmloflrZfliJcg44G+44Gf44GvIOODhuODs+ODl+ODrOODvOODiOaWh+Wtl+WIlywg44G+44Gf44GvIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgW3NyY10gICBbaW5dIOWklumDqCBodG1sIOOCkuaMh+WumuOBmeOCi+WgtOWQiOOBryB1cmwg44KS6Kit5a6aXHJcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSAgICAgICAgIFtjYWNoZV0gW2luXSBzcmMgaHRtbCDjgpLjgq3jg6Pjg4Pjgrfjg6XjgZnjgovloLTlkIjjga8gdHJ1ZS4gc3JjIOOBjOaMh+WumuOBleOCjOOBpuOBhOOCi+OBqOOBjeOBruOBv+acieWKuVxyXG4gICAgICAgICAqIEByZXR1cm4g44Kz44Oz44OR44Kk44Or44GV44KM44GfIEpTVCDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgZ2V0SlNUKGtleTogSlF1ZXJ5KTogSlNUO1xyXG4gICAgICAgIHN0YXRpYyBnZXRKU1Qoa2V5OiBzdHJpbmcsIHNyYz86IHN0cmluZywgY2FjaGU/OiBib29sZWFuKTogSlNUO1xyXG4gICAgICAgIHN0YXRpYyBnZXRKU1Qoa2V5OiBhbnksIHNyYz86IHN0cmluZywgY2FjaGU/OiBib29sZWFuKTogSlNUIHtcclxuICAgICAgICAgICAgbGV0IGpzdDogSlNUID0gKCkgPT4gXCJcIjtcclxuICAgICAgICAgICAgbGV0ICRlbGVtZW50OiBKUXVlcnk7XHJcbiAgICAgICAgICAgIGlmIChrZXkgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuICAgICAgICAgICAgICAgICRlbGVtZW50ID0ga2V5O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQgPSBUZW1wbGF0ZS5nZXRUZW1wbGF0ZUVsZW1lbnQoa2V5LCBzcmMsIGNhY2hlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoISRlbGVtZW50IHx8ICEkZWxlbWVudFswXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiY2Fubm90IGdlbmVyYXRlIHRlbXBsYXRlXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG51bGwgIT0gZ2xvYmFsLkhvZ2FuKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IEhvZ2FuLmNvbXBpbGUoJGVsZW1lbnQudGV4dCgpKTtcclxuICAgICAgICAgICAgICAgIGpzdCA9IChkYXRhPzogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlLnJlbmRlcihkYXRhKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobnVsbCAhPSBnbG9iYWwuXykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBfLnRlbXBsYXRlKCRlbGVtZW50Lmh0bWwoKSk7XHJcbiAgICAgICAgICAgICAgICBqc3QgPSAoZGF0YT86IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOaUueihjOOBqOOCv+ODluOBr+WJiumZpOOBmeOCi1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZShkYXRhKS5yZXBsYWNlKC9cXG58XFx0L2csIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImNhbm5vdCBmaW5kIHRlbXBsYXRlIGVuZ2luZSBtb2R1bGUuXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiICAgICdob2dhbicgb3IgJ3VuZGVyc2NvcmUnIGlzIHJlcXVpcmVkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ganN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyDlhoXpg6jjg6Hjgr3jg4Pjg4lcclxuXHJcbiAgICAgICAgLy8hIEVsZW1lbnQgTWFwIOOCquODluOCuOOCp+OCr+ODiOOBruWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGdldEVsZW1lbnRNYXAoKTogRWxlbWVudE1hcCB7XHJcbiAgICAgICAgICAgIFRlbXBsYXRlLl9tYXBFbGVtZW50ID0gVGVtcGxhdGUuX21hcEVsZW1lbnQgfHwge307XHJcbiAgICAgICAgICAgIHJldHVybiBUZW1wbGF0ZS5fbWFwRWxlbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBVUkwgTWFwIOOCquODluOCuOOCp+OCr+ODiOOBruWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGdldFNvdXJjZU1hcCgpOiBTb3VyY2VNYXAge1xyXG4gICAgICAgICAgICBUZW1wbGF0ZS5fbWFwU291cmNlID0gVGVtcGxhdGUuX21hcFNvdXJjZSB8fCB7fTtcclxuICAgICAgICAgICAgcmV0dXJuIFRlbXBsYXRlLl9tYXBTb3VyY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgVVJMIE1hcCDjgYvjgokgSFRNTCDjgpLmpJzntKIuIOWkseaVl+OBl+OBn+WgtOWQiOOBr+epuuaWh+Wtl+OBjOi/lOOCi1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGZpbmRIdG1sRnJvbVNvdXJjZShzcmM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcFNvdXJjZSA9IFRlbXBsYXRlLmdldFNvdXJjZU1hcCgpO1xyXG4gICAgICAgICAgICBsZXQgaHRtbCA9IG1hcFNvdXJjZVtzcmNdIHx8IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWh0bWwpIHtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJodG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiAoZGF0YTogYW55LCBzdGF0dXM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRywgYGFqYXggcmVxdWVzdCBmYWlsZWQuIHN0YXR1czogJHtzdGF0dXN9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyDjgq3jg6Pjg4Pjgrfjg6XjgavmoLzntI1cclxuICAgICAgICAgICAgICAgIG1hcFNvdXJjZVtzcmNdID0gaHRtbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlRvb2xzLlByb2dyZXNzQ291bnRlcl0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFByb2dyZXNzQ291bnRlck9wdGlvbnNcclxuICAgICAqIEBicmllZiBQcm9ncmVzc0NvdW50ZXIg44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJvZ3Jlc3NDb3VudGVyT3B0aW9ucyB7XHJcbiAgICAgICAgbWF4PzogbnVtYmVyOyAgICAgICAgICAgICAgICAgICAgICAgLy8g6YCy5o2X5YCk44Gu5pyA5aSn5YCkIOaXouWumjogMTAwXHJcbiAgICAgICAgYWxsb3dJbmNyZW1lbnRSZW1haW4/OiBib29sZWFuOyAgICAgLy8g5q6L44KK5o6o5a6a5pmC6ZaT44GM5aKX44GI44Gm44KI44GE5aC05ZCI44Gr44GvIHRydWUg5pei5a6aOiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQcm9ncmVzc0NvdW50ZXJSZXN1bHRcclxuICAgICAqIEBicmllZiDpgLLmjZfjga7mmYLplpPjgpLmjIHjgaTjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqICAgICAgICDljZjkvY3jga8gW21zZWNdXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJvZ3Jlc3NDb3VudGVyUmVzdWx0IHtcclxuICAgICAgICBwYXNzVGltZTogbnVtYmVyOyAgICAgICAvLyDntYzpgY7mmYLplpNcclxuICAgICAgICByZW1haW5UaW1lOiBudW1iZXI7ICAgICAvLyDmrovjgormjqjlrprmmYLplpNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQcm9ncmVzc0NvdW50ZXJcclxuICAgICAqIEBicmllZiDpgLLmjZfjga7mmYLplpPjgpLmibHjgYbjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFByb2dyZXNzQ291bnRlciB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3NldHRpbmdzOiB7XHJcbiAgICAgICAgICAgIG1heDogbnVtYmVyO1xyXG4gICAgICAgICAgICBiZWdpblRpbWU6IG51bWJlcjtcclxuICAgICAgICAgICAgYWxsb3dJbmNyZW1lbnRSZW1haW46IGJvb2xlYW47XHJcbiAgICAgICAgICAgIGxhc3RSZW1haW5UaW1lOiBudW1iZXI7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBbb3B0aW9uc10g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9ucz86IFByb2dyZXNzQ291bnRlck9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldChvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOmWi+Wni+aZgumWk+OCkuWIneacn+WMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyByZXNldChvcHRpb25zPzogUHJvZ3Jlc3NDb3VudGVyT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgICAgIC4uLntcclxuICAgICAgICAgICAgICAgICAgICBtYXg6IDEwMCxcclxuICAgICAgICAgICAgICAgICAgICBiZWdpblRpbWU6IERhdGUubm93KCksXHJcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dJbmNyZW1lbnRSZW1haW46IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RSZW1haW5UaW1lOiBJbmZpbml0eSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICwgLi4uPGFueT5vcHRpb25zXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDntYzpgY7mmYLplpPjgajmjqjlrprmrovjgormmYLplpPjgpLlj5blvpfjgZnjgotcclxuICAgICAgICAgKiDpgLLmjZflgKTjgYwgMCDjga7loLTlkIjjga/jgIHmjqjlrprmrovjgormmYLplpPjgasgSW5maW5pdHkg44KS6L+U44GZXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gICBwcm9ncmVzcyBbaW5dIOmAsuaNl+WApFxyXG4gICAgICAgICAqIEByZXR1cm5zIOe1jOmBjuaZgumWk+OBqOaOqOWumuaui+OCiuaZgumWkyBbbXNlY11cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgY29tcHV0ZShwcm9ncmVzczogbnVtYmVyKTogUHJvZ3Jlc3NDb3VudGVyUmVzdWx0IHtcclxuICAgICAgICAgICAgY29uc3QgcGFzc1RpbWUgPSBEYXRlLm5vdygpIC0gdGhpcy5fc2V0dGluZ3MuYmVnaW5UaW1lO1xyXG4gICAgICAgICAgICBsZXQgcmVtYWluVGltZSA9IEluZmluaXR5O1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBwcm9ncmVzcyAmJiAwICE9PSBwcm9ncmVzcykge1xyXG4gICAgICAgICAgICAgICAgcmVtYWluVGltZSA9IHBhc3NUaW1lICogdGhpcy5fc2V0dGluZ3MubWF4IC8gcHJvZ3Jlc3MgLSBwYXNzVGltZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MuYWxsb3dJbmNyZW1lbnRSZW1haW4gfHwgKHJlbWFpblRpbWUgPCB0aGlzLl9zZXR0aW5ncy5sYXN0UmVtYWluVGltZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzLmxhc3RSZW1haW5UaW1lID0gcmVtYWluVGltZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbWFpblRpbWUgPSB0aGlzLl9zZXR0aW5ncy5sYXN0UmVtYWluVGltZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHsgcGFzc1RpbWUsIHJlbWFpblRpbWUgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiZGVjbGFyZSBtb2R1bGUgXCJjZHAudG9vbHNcIiB7XHJcbiAgICBjb25zdCBUb29sczogdHlwZW9mIENEUC5Ub29scztcclxuICAgIGV4cG9ydCA9IFRvb2xzO1xyXG59XHJcbiJdfQ==
