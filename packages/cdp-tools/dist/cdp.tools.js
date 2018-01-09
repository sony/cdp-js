/*!
 * cdp.tools.js 2.2.0
 *
 * Date: 2018-01-09T03:19:04.096Z
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
             * @param buf [in] ArrayBuffer data
             * @param mimeType [in] MimeType of data
             * @returns Blob data
             */
            Binary.arrayBufferToBlob = function (buf, mimeType) {
                return Binary.newBlob([buf], { type: mimeType });
            };
            /**
             * Base64 string to Blob
             *
             * @param base64 {string} [in] Base64 string data
             * @param mimeType {string} [in] MimeType of data
             * @return {Blob} Blob data
             */
            Binary.base64ToBlob = function (base64, mimeType) {
                return Binary.newBlob([Binary.base64ToArrayBuffer(base64)], { type: mimeType });
            };
            /**
             * data-url 形式画像から Blob オブジェクトへ変換
             *
             * @param  {String} dataUrl    [in] data url
             * @param  {String} [mimeType] [in] mime type を指定. 既定では "image/png"
             * @return {Blob} Blob インスタンス
             */
            Binary.dataUrlToBlob = function (dataUrl, mimeType) {
                if (mimeType === void 0) { mimeType = "image/png"; }
                var base64 = dataUrl.split(",")[1];
                return Binary.base64ToBlob(base64, mimeType);
            };
            /**
             * Base64 string to ArrayBuffer
             *
             * @param base64 {string} [in] Base64 string data
             * @return {ArrayBuffer} ArrayBuffer data
             */
            Binary.base64ToArrayBuffer = function (base64) {
                var bytes = window.atob(base64);
                var arrayBuffer = new ArrayBuffer(bytes.length);
                var data = new Uint8Array(arrayBuffer);
                for (var i = 0, len = bytes.length; i < len; ++i) {
                    data[i] = bytes.charCodeAt(i);
                }
                return arrayBuffer;
            };
            /**
             * Base64 string to Uint8Array
             *
             * @param base64 {string} [in] Base64 string data
             * @return {Uint8Array} Uint8Array data
             */
            Binary.base64ToUint8Array = function (encoded) {
                var bytes = window.atob(encoded);
                var data = new Uint8Array(bytes.length);
                for (var i = 0, len = bytes.length; i < len; ++i) {
                    data[i] = bytes.charCodeAt(i);
                }
                return data;
            };
            /**
             * ArrayBuffer to base64 string
             *
             * @param arrayBuffer {ArrayBuffer} [in] ArrayBuffer data
             * @return {string} base64 data
             */
            Binary.arrayBufferToBase64 = function (arrayBuffer) {
                var bytes = new Uint8Array(arrayBuffer);
                return Binary.uint8ArrayToBase64(bytes);
            };
            /**
             * Uint8Array to base64 string
             *
             * @param bytes {Uint8Array} [in] Uint8Array data
             * @return {string} base64 data
             */
            Binary.uint8ArrayToBase64 = function (bytes) {
                var data = "";
                for (var i = 0, len = bytes.byteLength; i < len; ++i) {
                    data += String.fromCharCode(bytes[i]);
                }
                return window.btoa(data);
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
                        .then(function (result) {
                        resolve(new Uint8Array(result));
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
            Binary.readBlobAsText = function (blob, encode) {
                if (encode === void 0) { encode = "utf-8"; }
                var reader = new FileReader();
                var cancel = function () { return reader.abort(); };
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function () {
                        reject(Binary.makeErrorInfoFromDOMError(CDP.RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR, reader.error, TAG, "FileReader.readAsText() failed."));
                    };
                    reader.readAsText(blob, encode);
                }, cancel);
            };
            /**
             * read Blob as Data URL
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
                    if (iw === 0 || 0 === ia) {
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
                return new Date(dateString);
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
                var offset = 0;
                if (27 === isoDateString.length) {
                    offset = 3;
                }
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
                var dateTime = dateString.split("T");
                var isoDateString = dateTime[0].replace(/_/g, "-");
                if (dateTime[1]) {
                    var timeArray = dateTime[1].split("_");
                    var timeString = "T";
                    if (timeArray.length < 4) {
                        timeString += timeArray.join(":");
                    }
                    else {
                        timeString += timeArray.slice(0, 3).join(":");
                        timeString += "." + timeArray[3];
                    }
                    isoDateString += timeString;
                }
                return new Date(isoDateString);
            };
            /**
             * Convert date object into string in file system compatible format (YYYY_MM_DDTHH_mm_ss_sss)
             *
             * @param date   {Date}   [in] date object
             * @param target {String} [in] { year | month | date | min | sec | msec | tz }
             * @return {String} file system compatible string
             */
            DateTime.convertDateToFileSystemString = function (date, target) {
                if (target === void 0) { target = "tz"; }
                var isoDateString = DateTime.convertDateToISOString(date, target);
                var fileSystemString = isoDateString.replace(/[-:.]/g, "_");
                return fileSystemString;
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
                try {
                    if (!$element) {
                        if (src) {
                            var html = Template.findHtmlFromSource(src);
                            $element = $(html).find(key);
                        }
                        else {
                            $element = $(key);
                        }
                        // 要素の検証
                        if ($element <= 0) {
                            throw ("invalid [key, src] = [" + key + ", " + src + "]");
                        }
                        if (src && cache) {
                            mapElement[key] = $element;
                        }
                    }
                }
                catch (exception) {
                    console.error(TAG + exception);
                    return null;
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
                var template = null;
                var jst;
                var $element;
                if (key instanceof jQuery) {
                    $element = key;
                }
                else {
                    $element = Template.getTemplateElement(key, src, cache);
                }
                if (null != CDP.global.Hogan) {
                    template = Hogan.compile($element.text());
                    jst = function (data) {
                        return template.render(data);
                    };
                }
                else if (null != CDP.global._) {
                    template = _.template($element.html());
                    jst = function (data) {
                        // 改行とタブは削除する
                        return template(data).replace(/\n|\t/g, "");
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
                if (!Template._mapElement) {
                    Template._mapElement = {};
                }
                return Template._mapElement;
            };
            //! URL Map オブジェクトの取得
            Template.getSourceMap = function () {
                if (!Template._mapSource) {
                    Template._mapSource = {};
                }
                return Template._mapSource;
            };
            //! URL Map から HTML を検索. 失敗した場合は undefined が返る
            Template.findHtmlFromSource = function (src) {
                var mapSource = Template.getSourceMap();
                var html = mapSource[src];
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
                            throw ("ajax request failed. status: " + status);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVG9vbHMvRXJyb3JEZWZzLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9CaW5hcnkudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL0JpbmFyeVRyYW5zcG9ydC50cyIsImNkcDovLy9DRFAvVG9vbHMvRnVuY3Rpb25zLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9EYXRlVGltZS50cyIsImNkcDovLy9DRFAvVG9vbHMvVGVtcGxhdGUudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL1Byb2dyZXNzQ291bnRlci50cyIsImNkcDovLy9DRFAvVG9vbHMvSW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0FxQ1o7QUFyQ0QsV0FBVSxHQUFHO0lBRVQ7OztPQUdHO0lBQ0gsSUFBWSxnQkFHWDtJQUhELFdBQVksZ0JBQWdCO1FBQ3hCLDZGQUEyQjtRQUMzQixpREFBWSxDQUFDLEdBQUcsaUNBQTZCO0lBQ2pELENBQUMsRUFIVyxnQkFBZ0IsR0FBaEIsb0JBQWdCLEtBQWhCLG9CQUFnQixRQUczQjtJQUVELHVFQUF1RTtJQUN2RSw0QkFBNEI7SUFFNUIsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFFL0I7OztPQUdHO0lBQ0gsSUFBSyxlQUdKO0lBSEQsV0FBSyxlQUFlO1FBQ2hCLCtEQUFlO1FBQ2YsMENBQWMsQ0FBQyxHQUFHLG1CQUFtQjtJQUN6QyxDQUFDLEVBSEksZUFBZSxLQUFmLGVBQWUsUUFHbkI7SUFFRCxvQ0FBb0M7SUFDcEM7OztPQUdHO0lBQ0gsSUFBWSxXQUtYO0lBTEQsV0FBWSxXQUFXO1FBQ25CLDJGQUF1QztRQUN2QywrREFBc0Msc0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLG9CQUFvQixDQUFDO1FBQ3pJLDJEQUFzQyxzQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsR0FBRyxD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Q1MsT0FBTyxDQUNwQixDQUFDO1lBQ04sQ0FBQztZQUVEOzs7Ozs7ZUFNRztZQUNJLGlDQUFPLEdBQWQsVUFBZSxRQUFnQjtnQkFDM0IsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO2dCQUN2RCxJQUFJLFVBQVUsR0FBRyxRQUFRLENBQUM7Z0JBQzFCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxRQUFRLElBQUksQ0FBQyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ3JDLFVBQVUsR0FBRyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsUUFBUSxHQUFHLFFBQVEsQ0FBQztnQkFDckUsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG9CQUFvQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN0RixJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsR0FBRyxVQUFVLENBQUM7Z0JBQy9DLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO2dCQUMvQyxDQUFDO2dCQUVELE1BQU0sQ0FBQyxFQUFFLFFBQVEsWUFBRSxVQUFVLGNBQUUsQ0FBQztZQUNwQyxDQUFDO1lBQ0wsc0JBQUM7UUFBRCxDQUFDO1FBdERZLHFCQUFlLGtCQXNEM0I7SUFDTCxDQUFDLEVBbEZhLEtBQUssR0FBTCxTQUFLLEtBQUwsU0FBSyxRQWtGbEI7QUFBRCxDQUFDLEVBbEZTLEdBQUcsS0FBSCxHQUFHLFFBa0ZaIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW51bSAgUkVTVUxUX0NPREVfQkFTRVxyXG4gICAgICogQGJyaWVmIOODquOCtuODq+ODiOOCs+ODvOODieOBruOCquODleOCu+ODg+ODiOWApFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZW51bSBSRVNVTFRfQ09ERV9CQVNFIHtcclxuICAgICAgICBDRFBfVE9PTFNfREVDTEFSRVJBVElPTiA9IDAsICAgIC8vIFRTMjQzMiDlr77nrZZcclxuICAgICAgICBDRFBfVE9PTFMgPSA0ICogX01PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRV9DRFAsXHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIG1vZHVsZSBlcnJvciBkZWNsYXJhdGlvbjpcclxuXHJcbiAgICBjb25zdCBGVU5DVElPTl9DT0RFX1JBTkdFID0gMTA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW51bSAgTE9DQUxfQ09ERV9CQVNFXHJcbiAgICAgKiBAYnJpZWYgY2RwLnRvb2xzIOWGheOBruODreODvOOCq+ODq+OCs+ODvOODieOCquODleOCu+ODg+ODiOWApFxyXG4gICAgICovXHJcbiAgICBlbnVtIExPQ0FMX0NPREVfQkFTRSB7XHJcbiAgICAgICAgRlVOQ1RJT05TICAgPSAwLFxyXG4gICAgICAgIEJMT0IgICAgICAgID0gMSAqIEZVTkNUSU9OX0NPREVfUkFOR0UsXHJcbiAgICB9XHJcblxyXG4gICAgLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcbiAgICAvKipcclxuICAgICAqIEBlbnVtICBSRVNVTFRfQ09ERVxyXG4gICAgICogQGJyaWVmIGNkcC50b29scyDjga7jgqjjg6njg7zjgrPjg7zjg4nlrprnvqlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREUge1xyXG4gICAgICAgIEVSUk9SX0NEUF9UT09MU19ERUNMQVJBVElPTiAgICAgICAgID0gMCwgLy8gVFMyNDMyIOWvvuetllxyXG4gICAgICAgIEVSUk9SX0NEUF9UT09MU19JTUFHRV9MT0FEX0ZBSUxFRCAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX1RPT0xTLCBMT0NBTF9DT0RFX0JBU0UuRlVOQ1RJT05TICsgMSwgXCJpbWFnZSBsb2FkIGZhaWxlZC5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX1RPT0xTX0lOVkFMSURfSU1BR0UgICAgICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfVE9PTFMsIExPQ0FMX0NPREVfQkFTRS5GVU5DVElPTlMgKyAyLCBcImludmFsaWQgaW1hZ2UuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9UT09MU19GSUxFX1JFQURFUl9FUlJPUiAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX1RPT0xTLCBMT0NBTF9DT0RFX0JBU0UuQkxPQiArIDEsIFwiRmlsZVJlYWRlciBtZXRob2QgZmFpbGVkLlwiKSxcclxuICAgIH1cclxuICAgIC8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgaW1wb3J0IFByb21pc2UgPSBDRFAuUHJvbWlzZTtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuQmluYXJ5XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBCaW5hcnlcclxuICAgICAqIEBicmllZiDjg5DjgqTjg4rjg6rjg6bjg7zjg4bjgqPjg6rjg4bjgqNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEJpbmFyeSB7XHJcblxyXG4gICAgICAgIC8vIHByaXZhdGUgY29uc3RydWN0b3JcclxuICAgICAgICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICAvLyBub29wXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgQmxvYkJ1aWxkZXJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBvYnNvbGV0ZVxyXG4gICAgICAgICAqIEByZXR1cm4ge2FueX0gQmxvYkJ1aWxkZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBnZXRCbG9iQnVpbGRlcigpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsLkJsb2JCdWlsZGVyIHx8IGdsb2JhbC5XZWJLaXRCbG9iQnVpbGRlciB8fCBnbG9iYWwuTW96QmxvYkJ1aWxkZXIgfHwgZ2xvYmFsLk1TQmxvYkJ1aWxkZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqjjg6njg7zmg4XloLHnlJ/miJAgZnJvbSBET01FcnJvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHJlc3VsdENvZGUgW2luXSBSRVNVTFRfQ09ERSDjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gY2F1c2UgICAgICBbaW5dIOS4i+S9jeOBriBET00g44Ko44Op44O844KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIFt0YWddICAgICAgW2luXSBUQUcg44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIFttZXNzYWdlXSAgW2luXSDjg6Hjg4Pjgrvjg7zjgrjjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJucyDjgqjjg6njg7zjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBtYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKHJlc3VsdENvZGU6IFJFU1VMVF9DT0RFLCBjYXVzZTogRE9NRXJyb3IsIHRhZz86IHN0cmluZywgbWVzc2FnZT86IHN0cmluZyk6IEVycm9ySW5mbyB7XHJcbiAgICAgICAgICAgIGxldCBfY2F1c2U6IEVycm9yO1xyXG4gICAgICAgICAgICBpZiAoY2F1c2UpIHtcclxuICAgICAgICAgICAgICAgIF9jYXVzZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBjYXVzZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNhdXNlLm5hbWUsICAgIC8vIERPTUVycm9yLm1lc3NhZ2Ug44GM5pyq44K144Od44O844OIXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlRXJyb3JJbmZvKHJlc3VsdENvZGUsIHRhZywgbWVzc2FnZSwgX2NhdXNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldCBCbG9iQnVpbGRlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQG9ic29sZXRlXHJcbiAgICAgICAgICogQHJldHVybiDmp4vnr4nmuIjjgb8gQmxvYiDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIG5ld0Jsb2IoYmxvYlBhcnRzPzogYW55W10sIG9wdGlvbnM/OiBCbG9iUHJvcGVydHlCYWcpOiBCbG9iIHtcclxuICAgICAgICAgICAgaWYgKGdsb2JhbC5CbG9iKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IGdsb2JhbC5CbG9iKGJsb2JQYXJ0cywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1bmRlciBBbmRyb2lkIDQuNCBLaXRLYXRcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmxvYkJ1aWxkZXJPYmplY3Q6IGFueSA9IEJpbmFyeS5nZXRCbG9iQnVpbGRlcigpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmxvYkJ1aWxkZXI6IGFueSA9IG5ldyBibG9iQnVpbGRlck9iamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcGFydHMgPSAoYmxvYlBhcnRzIGluc3RhbmNlb2YgQXJyYXkpID8gYmxvYlBhcnRzWzBdIDogYmxvYlBhcnRzO1xyXG4gICAgICAgICAgICAgICAgYmxvYkJ1aWxkZXIuYXBwZW5kKHBhcnRzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBibG9iQnVpbGRlci5nZXRCbG9iKG9wdGlvbnMudHlwZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVSTCBPYmplY3RcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBvYnNvbGV0ZVxyXG4gICAgICAgICAqIEByZXR1cm4ge2FueX0gVVJMIE9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmxvYlVSTDogVVJMID0gKCgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbC5VUkwgfHwgZ2xvYmFsLndlYmtpdFVSTDtcclxuICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcnJheUJ1ZmZlciB0byBCbG9iXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYnVmIFtpbl0gQXJyYXlCdWZmZXIgZGF0YVxyXG4gICAgICAgICAqIEBwYXJhbSBtaW1lVHlwZSBbaW5dIE1pbWVUeXBlIG9mIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJucyBCbG9iIGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGFycmF5QnVmZmVyVG9CbG9iKGJ1ZjogQXJyYXlCdWZmZXIsIG1pbWVUeXBlOiBzdHJpbmcpOiBCbG9iIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS5uZXdCbG9iKFtidWZdLCB7IHR5cGU6IG1pbWVUeXBlIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmFzZTY0IHN0cmluZyB0byBCbG9iXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYmFzZTY0IHtzdHJpbmd9IFtpbl0gQmFzZTY0IHN0cmluZyBkYXRhXHJcbiAgICAgICAgICogQHBhcmFtIG1pbWVUeXBlIHtzdHJpbmd9IFtpbl0gTWltZVR5cGUgb2YgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jsb2J9IEJsb2IgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmFzZTY0VG9CbG9iKGJhc2U2NDogc3RyaW5nLCBtaW1lVHlwZTogc3RyaW5nKTogQmxvYiB7XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkubmV3QmxvYihbQmluYXJ5LmJhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0KV0sIHsgdHlwZTogbWltZVR5cGUgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBkYXRhLXVybCDlvaLlvI/nlLvlg4/jgYvjgokgQmxvYiDjgqrjg5bjgrjjgqfjgq/jg4jjgbjlpInmj5tcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gZGF0YVVybCAgICBbaW5dIGRhdGEgdXJsXHJcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBbbWltZVR5cGVdIFtpbl0gbWltZSB0eXBlIOOCkuaMh+Wumi4g5pei5a6a44Gn44GvIFwiaW1hZ2UvcG5nXCJcclxuICAgICAgICAgKiBAcmV0dXJuIHtCbG9ifSBCbG9iIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZGF0YVVybFRvQmxvYihkYXRhVXJsOiBzdHJpbmcsIG1pbWVUeXBlOiBzdHJpbmcgPSBcImltYWdlL3BuZ1wiKTogQmxvYiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IGRhdGFVcmwuc3BsaXQoXCIsXCIpWzFdO1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5LmJhc2U2NFRvQmxvYihiYXNlNjQsIG1pbWVUeXBlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJhc2U2NCBzdHJpbmcgdG8gQXJyYXlCdWZmZXJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBiYXNlNjQge3N0cmluZ30gW2luXSBCYXNlNjQgc3RyaW5nIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheUJ1ZmZlcn0gQXJyYXlCdWZmZXIgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQ6IHN0cmluZyk6IEFycmF5QnVmZmVyIHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSB3aW5kb3cuYXRvYihiYXNlNjQpO1xyXG4gICAgICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihieXRlcy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGJ5dGVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhW2ldID0gYnl0ZXMuY2hhckNvZGVBdChpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXlCdWZmZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCYXNlNjQgc3RyaW5nIHRvIFVpbnQ4QXJyYXlcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBiYXNlNjQge3N0cmluZ30gW2luXSBCYXNlNjQgc3RyaW5nIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtVaW50OEFycmF5fSBVaW50OEFycmF5IGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGJhc2U2NFRvVWludDhBcnJheShlbmNvZGVkOiBzdHJpbmcpOiBVaW50OEFycmF5IHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSB3aW5kb3cuYXRvYihlbmNvZGVkKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBVaW50OEFycmF5KGJ5dGVzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYnl0ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFbaV0gPSBieXRlcy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQXJyYXlCdWZmZXIgdG8gYmFzZTY0IHN0cmluZ1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGFycmF5QnVmZmVyIHtBcnJheUJ1ZmZlcn0gW2luXSBBcnJheUJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBiYXNlNjQgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYXJyYXlCdWZmZXJUb0Jhc2U2NChhcnJheUJ1ZmZlcjogQXJyYXlCdWZmZXIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKTtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS51aW50OEFycmF5VG9CYXNlNjQoYnl0ZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVWludDhBcnJheSB0byBiYXNlNjQgc3RyaW5nXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYnl0ZXMge1VpbnQ4QXJyYXl9IFtpbl0gVWludDhBcnJheSBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBiYXNlNjQgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdWludDhBcnJheVRvQmFzZTY0KGJ5dGVzOiBVaW50OEFycmF5KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGRhdGE6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYnl0ZXMuYnl0ZUxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuYnRvYShkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgQXJyYXlCdWZmZXJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8QXJyYXlCdWZmZXI+fSBwcm9taXNlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2I6IEJsb2IpOiBJUHJvbWlzZTxBcnJheUJ1ZmZlcj4ge1xyXG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICBjb25zdCBjYW5jZWwgPSAoKSA9PiByZWFkZXIuYWJvcnQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEJpbmFyeS5tYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkZpbGVSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoKSBmYWlsZWQuXCJcclxuICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYik7XHJcbiAgICAgICAgICAgIH0sIGNhbmNlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgVWludDhBcnJheVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7QmxvYn0gYmxvYiBbaW5dIGJsb2IgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0NEUC5JUHJvbWlzZTxVaW50OEFycmF5Pn0gcHJvbWlzZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRCbG9iQXNVaW50OEFycmF5KGJsb2I6IEJsb2IpOiBJUHJvbWlzZTxVaW50OEFycmF5PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0LCBkZXBlbmRPbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVwZW5kT24oQmluYXJ5LnJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSlcclxuICAgICAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0OiBBcnJheUJ1ZmZlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBVaW50OEFycmF5KHJlc3VsdCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcjogRXJyb3JJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcmVhZCBCbG9iIGFzIHRleHQgc3RyaW5nXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtCbG9ifSBibG9iIFtpbl0gYmxvYiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7Q0RQLklQcm9taXNlPFVpbnQ4QXJyYXk+fSBwcm9taXNlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZEJsb2JBc1RleHQoYmxvYjogQmxvYiwgZW5jb2RlOiBzdHJpbmcgPSBcInV0Zi04XCIpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4gcmVhZGVyLmFib3J0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChCaW5hcnkubWFrZUVycm9ySW5mb0Zyb21ET01FcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0ZJTEVfUkVBREVSX0VSUk9SLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIuZXJyb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJGaWxlUmVhZGVyLnJlYWRBc1RleHQoKSBmYWlsZWQuXCJcclxuICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChibG9iLCBlbmNvZGUpO1xyXG4gICAgICAgICAgICB9LCBjYW5jZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcmVhZCBCbG9iIGFzIERhdGEgVVJMXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtCbG9ifSBibG9iIFtpbl0gYmxvYiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7Q0RQLklQcm9taXNlPHN0cmluZz59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkQmxvYkFzRGF0YVVSTChibG9iOiBCbG9iKTogSVByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmNlbCA9ICgpID0+IHJlYWRlci5hYm9ydCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoQmluYXJ5Lm1ha2VFcnJvckluZm9Gcm9tRE9NRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19GSUxFX1JFQURFUl9FUlJPUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLmVycm9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiRmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKCkgZmFpbGVkLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoYmxvYik7XHJcbiAgICAgICAgICAgIH0sIGNhbmNlbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBAZmlsZSAgQmluYXJ5VHJhbnNwb3J0LnRzXHJcbiAqIEBicmllZiBqUXVlcnkgYWpheCB0cmFuc3BvcnQgZm9yIG1ha2luZyBiaW5hcnkgZGF0YSB0eXBlIHJlcXVlc3RzLlxyXG4gKlxyXG4gKiAgICAgICAgb3JpZ2luYWw6IGh0dHBzOi8vZ2l0aHViLmNvbS9oZW5yeWEvanMtanF1ZXJ5L2Jsb2IvbWFzdGVyL0JpbmFyeVRyYW5zcG9ydC9qcXVlcnkuYmluYXJ5dHJhbnNwb3J0LmpzXHJcbiAqICAgICAgICBhdXRob3I6ICAgSGVucnkgQWxndXMgPGhlbnJ5YWxndXNAZ21haWwuY29tPlxyXG4gKi9cclxubmFtZXNwYWNlIENEUC5Ub29scyB7XHJcbiAgICAvLyBTdXBwb3J0IGZpbGUgcHJvdG9jb2wuIChhcyBzYW1lIGFzIG9mZmljaWFsIHdheSlcclxuICAgIGNvbnN0IHhoclN1Y2Nlc3NTdGF0dXMgPSB7XHJcbiAgICAgICAgMDogMjAwLFxyXG4gICAgICAgIDEyMjM6IDIwNFxyXG4gICAgfTtcclxuXHJcbiAgICAkLmFqYXhUcmFuc3BvcnQoXCIrYmluYXJ5XCIsIChvcHRpb25zOiBKUXVlcnkuQWpheFNldHRpbmdzLCBvcmlnaW5hbE9wdGlvbnM6IEpRdWVyeS5BamF4U2V0dGluZ3MsIGpxWEhSOiBKUXVlcnlYSFIpID0+IHtcclxuICAgICAgICBpZiAoZ2xvYmFsLkZvcm1EYXRhICYmXHJcbiAgICAgICAgICAgICgob3B0aW9ucy5kYXRhVHlwZSAmJiAob3B0aW9ucy5kYXRhVHlwZSA9PT0gXCJiaW5hcnlcIikpIHx8XHJcbiAgICAgICAgICAgIChvcHRpb25zLmRhdGEgJiYgKChnbG9iYWwuQXJyYXlCdWZmZXIgJiYgb3B0aW9ucy5kYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHx8XHJcbiAgICAgICAgICAgIChnbG9iYWwuQmxvYiAmJiBvcHRpb25zLmRhdGEgaW5zdGFuY2VvZiBnbG9iYWwuQmxvYikpKSkpIHtcclxuICAgICAgICAgICAgbGV0IGFib3J0Q2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kOiBmdW5jdGlvbiAoaGVhZGVyczogSlF1ZXJ5LlBsYWluT2JqZWN0LCBjYWxsYmFjazogSlF1ZXJ5LlRyYW5zcG9ydC5TdWNjZXNzQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXR1cCBhbGwgdmFyaWFibGVzXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gb3B0aW9ucy51cmw7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IG9wdGlvbnMudHlwZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3luYyA9IG9wdGlvbnMuYXN5bmMgfHwgdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYmxvYiBvciBhcnJheWJ1ZmZlci4gRGVmYXVsdCBpcyBibG9iXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YVR5cGUgPSAoPGFueT5vcHRpb25zKS5yZXNwb25zZVR5cGUgfHwgXCJibG9iXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IG9wdGlvbnMuZGF0YSB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJuYW1lID0gb3B0aW9ucy51c2VybmFtZSB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhc3N3b3JkID0gb3B0aW9ucy5wYXNzd29yZCB8fCBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBfY2FsbGJhY2s6IEpRdWVyeS5UcmFuc3BvcnQuU3VjY2Vzc0NhbGxiYWNrID0gY2FsbGJhY2sgfHwgKCgpID0+IHsgLyogbm9vcCAqLyB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3VjY2VlZGVkIGhhbmRsZXJcclxuICAgICAgICAgICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZGF0YVtvcHRpb25zLmRhdGFUeXBlXSA9IHhoci5yZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyU3VjY2Vzc1N0YXR1c1t4aHIuc3RhdHVzXSB8fCB4aHIuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEpRdWVyeS5BamF4LlRleHRTdGF0dXM+eGhyLnN0YXR1c1RleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBoYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9kYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhW29wdGlvbnMuZGF0YVR5cGVdID0geGhyLnJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIGNhbGxiYWNrIGFuZCBzZW5kIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxKUXVlcnkuQWpheC5UZXh0U3RhdHVzPnhoci5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWJvcnQgaGFuZGxlclxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZGF0YVtvcHRpb25zLmRhdGFUeXBlXSA9IHhoci5yZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBjYWxsYmFjayBhbmQgc2VuZCBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jYWxsYmFjayhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SlF1ZXJ5LkFqYXguVGV4dFN0YXR1cz54aHIuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFib3J0IGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICAgICAgYWJvcnRDYWxsYmFjayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmFib3J0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLm9wZW4odHlwZSwgdXJsLCBhc3luYywgdXNlcm5hbWUsIHBhc3N3b3JkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0dXAgY3VzdG9tIGhlYWRlcnNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gaGVhZGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaSwgaGVhZGVyc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSBkYXRhVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhYm9ydDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhYm9ydENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFib3J0Q2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJqcXVlcnlcIiAvPlxyXG5cclxubmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgaW1wb3J0IFByb21pc2UgPSBDRFAuUHJvbWlzZTtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuRnVuY3Rpb25zXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGguYWJzIOOCiOOCiuOCgumrmOmAn+OBqiBhYnNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGFicyh4OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB4ID49IDAgPyB4IDogLXg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRoLm1heCDjgojjgorjgoLpq5jpgJ/jgaogbWF4XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBtYXgobGhzOiBudW1iZXIsIHJoczogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gbGhzID49IHJocyA/IGxocyA6IHJocztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGgubWluIOOCiOOCiuOCgumrmOmAn+OBqiBtaW5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1pbihsaHM6IG51bWJlciwgcmhzOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBsaHMgPD0gcmhzID8gbGhzIDogcmhzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pWw5YCk44KSIDAg6Kmw44KB44GX44Gm5paH5a2X5YiX44KS55Sf5oiQXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiB0b1plcm9QYWRkaW5nKG5vOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBzaWduZWQgPSBcIlwiO1xyXG4gICAgICAgIG5vID0gTnVtYmVyKG5vKTtcclxuXHJcbiAgICAgICAgaWYgKGlzTmFOKG5vKSB8fCBpc05hTihsaW1pdCkgfHwgbGltaXQgPD0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChubyA8IDApIHtcclxuICAgICAgICAgICAgbm8gPSBUb29scy5hYnMobm8pO1xyXG4gICAgICAgICAgICBzaWduZWQgPSBcIi1cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzaWduZWQgKyAoQXJyYXkobGltaXQpLmpvaW4oXCIwXCIpICsgbm8pLnNsaWNlKC1saW1pdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmloflrZfliJfjga7jg5DjgqTjg4jmlbDjgpLjgqvjgqbjg7Pjg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldFN0cmluZ1NpemUoc3JjOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiAoQmluYXJ5Lm5ld0Jsb2IoW3NyY10sIHsgdHlwZTogXCJ0ZXh0L3BsYWluXCIgfSkpLnNpemU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmloflrZfliJfjgpLjg5DjgqTjg4jliLbpmZDjgZfjgabliIblibJcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHRvU3RyaW5nQ2h1bmtzKHNyYzogc3RyaW5nLCBsaW1pdDogbnVtYmVyKTogc3RyaW5nW10ge1xyXG5cclxuICAgICAgICBjb25zdCBjaHVua3MgPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2V0Q2h1bmsgPSAoaW5wdXQ6IHN0cmluZyk6IHN0cmluZ1tdID0+IHtcclxuICAgICAgICAgICAgaWYgKGxpbWl0IDwgZ2V0U3RyaW5nU2l6ZShpbnB1dCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhhbGYgPSBNYXRoLmZsb29yKGlucHV0Lmxlbmd0aCAvIDIpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGhzID0gaW5wdXQuc2xpY2UoMCwgaGFsZik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByaHMgPSBpbnB1dC5zbGljZShoYWxmKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBbbGhzLCByaHNdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2h1bmtzLnB1c2goaW5wdXQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgbWFrZUNodW5rID0gKHdvcms6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBmYWlsdXJlcyA9IHNldENodW5rKHdvcmspO1xyXG4gICAgICAgICAgICB3aGlsZSAoMCA8IGZhaWx1cmVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgbWFrZUNodW5rKGZhaWx1cmVzLnNoaWZ0KCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbWFrZUNodW5rKHNyYyk7XHJcblxyXG4gICAgICAgIHJldHVybiBjaHVua3M7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlpJrph43ntpnmib/jga7jgZ/jgoHjga7lrp/ooYzmmYLntpnmib/plqLmlbBcclxuICAgICAqXHJcbiAgICAgKiBTdWIgQ2xhc3Mg5YCZ6KOc44Kq44OW44K444Kn44Kv44OI44Gr5a++44GX44GmIFN1cGVyIENsYXNzIOWAmeijnOOCquODluOCuOOCp+OCr+ODiOOCkuebtOWJjeOBriBTdXBlciBDbGFzcyDjgajjgZfjgabmjL/lhaXjgZnjgovjgIJcclxuICAgICAqIHByb3RvdHlwZSDjga7jgb/jgrPjg5Tjg7zjgZnjgovjgIJcclxuICAgICAqIOOCpOODs+OCueOCv+ODs+OCueODoeODs+ODkOOCkuOCs+ODlOODvOOBl+OBn+OBhOWgtOWQiOOAgVN1cGVyIENsYXNzIOOBjOeWkeS8vOOCs+ODs+OCueODiOODqeOCr+OCv+OCkuaPkOS+m+OBmeOCi+W/heimgeOBjOOBguOCi+OAglxyXG4gICAgICog6Kmz57Sw44GvIGNkcC50b29scy5GdW5jdGlvbnMuc3BlYy50cyDjgpLlj4LnhafjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc3ViQ2xhc3MgICB7Y29uc3RydWN0b3J9IFtpbl0g44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIHN1cGVyQ2xhc3Mge2NvbnN0cnVjdG9yfSBbaW5dIOOCquODluOCuOOCp+OCr+ODiOOBriBjb25zdHJ1Y3RvciDjgpLmjIflrppcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaGVyaXQoc3ViQ2xhc3M6IGFueSwgc3VwZXJDbGFzczogYW55KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgX3Byb3RvdHlwZSA9IHN1YkNsYXNzLnByb3RvdHlwZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2luaGVyaXQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBzdWJDbGFzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgX2luaGVyaXQucHJvdG90eXBlID0gc3VwZXJDbGFzcy5wcm90b3R5cGU7XHJcbiAgICAgICAgc3ViQ2xhc3MucHJvdG90eXBlID0gbmV3IF9pbmhlcml0KCk7XHJcblxyXG4gICAgICAgICQuZXh0ZW5kKHN1YkNsYXNzLnByb3RvdHlwZSwgX3Byb3RvdHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtaXhpbiDplqLmlbBcclxuICAgICAqXHJcbiAgICAgKiBUeXBlU2NyaXB0IE9mZmljaWFsIFNpdGUg44Gr6LyJ44Gj44Gm44GE44KLIG1peGluIOmWouaVsFxyXG4gICAgICogaHR0cDovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvSGFuZGJvb2sjbWl4aW5zXHJcbiAgICAgKiDml6LjgavlrprnvqnjgZXjgozjgabjgYTjgovjgqrjg5bjgrjjgqfjgq/jg4jjgYvjgonjgIHmlrDopo/jgavjgqrjg5bjgrjjgqfjgq/jg4jjgpLlkIjmiJDjgZnjgovjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGVyaXZlZCB7Y29uc3RydWN0b3J9ICAgIFtpbl0g5ZCI5oiQ44GV44KM44KL44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIGJhc2VzICAge2NvbnN0cnVjdG9yLi4ufSBbaW5dIOWQiOaIkOWFg+OCquODluOCuOOCp+OCr+ODiOOBriBjb25zdHJ1Y3RvciDjgpLmjIflrpogKOWPr+WkieW8leaVsClcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1peGluKGRlcml2ZWQ6IGFueSwgLi4uYmFzZXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgYmFzZXMuZm9yRWFjaCgoYmFzZSkgPT4ge1xyXG4gICAgICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlLnByb3RvdHlwZSkuZm9yRWFjaChuYW1lID0+IHtcclxuICAgICAgICAgICAgICAgIGRlcml2ZWQucHJvdG90eXBlW25hbWVdID0gYmFzZS5wcm90b3R5cGVbbmFtZV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNvcnJlY3RseSBzZXQgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiwgZm9yIHN1YmNsYXNzZXMuXHJcbiAgICAgKiBUaGUgZnVuY3Rpb24gYmVoYXZpb3IgaXMgc2FtZSBhcyBleHRlbmQoKSBmdW5jdGlvbiBvZiBCYWNrYm9uZS5qcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcHJvdG9Qcm9wcyAge09iamVjdH0gW2luXSBzZXQgcHJvdG90eXBlIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHN0YXRpY1Byb3BzIHtPYmplY3R9IFtpbl0gc2V0IHN0YXRpYyBwcm9wZXJ0aWVzIGFzIG9iamVjdC5cclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gc3ViY2xhc3MgY29uc3RydWN0b3IuXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIOOCr+ODqeOCuee2meaJv+OBruOBn+OCgeOBruODmOODq+ODkeODvOmWouaVsFxyXG4gICAgICogQmFja2JvbmUuanMgZXh0ZW5kKCkg6Zai5pWw44Go5ZCM562JXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHByb3RvUHJvcHMgIHtPYmplY3R9IFtpbl0gcHJvdG90eXBlIHByb3BlcnRpZXMg44KS44Kq44OW44K444Kn44Kv44OI44Gn5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gc3RhdGljUHJvcHMge09iamVjdH0gW2luXSBzdGF0aWMgcHJvcGVydGllcyDjgpLjgqrjg5bjgrjjgqfjgq/jg4jjgafmjIflrppcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0g44K144OW44Kv44Op44K544Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBleHRlbmQocHJvdG9Qcm9wczogb2JqZWN0LCBzdGF0aWNQcm9wcz86IG9iamVjdCk6IG9iamVjdCB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcztcclxuICAgICAgICBsZXQgY2hpbGQ7XHJcblxyXG4gICAgICAgIGlmIChwcm90b1Byb3BzICYmIHByb3RvUHJvcHMuaGFzT3duUHJvcGVydHkoXCJjb25zdHJ1Y3RvclwiKSkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hpbGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLmV4dGVuZChjaGlsZCwgcGFyZW50LCBzdGF0aWNQcm9wcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IFN1cnJvZ2F0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3Vycm9nYXRlLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XHJcbiAgICAgICAgY2hpbGQucHJvdG90eXBlID0gbmV3IFN1cnJvZ2F0ZTtcclxuXHJcbiAgICAgICAgaWYgKHByb3RvUHJvcHMpIHtcclxuICAgICAgICAgICAgJC5leHRlbmQoY2hpbGQucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgIHJldHVybiBjaGlsZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERQSSDlj5blvpdcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldERldmljZVBpeGNlbFJhdGlvKCk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IG1lZGlhUXVlcnk7XHJcbiAgICAgICAgY29uc3QgaXNfZmlyZWZveCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiZmlyZWZveFwiKSA+IC0xO1xyXG4gICAgICAgIGlmIChudWxsICE9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICYmICFpc19maXJlZm94KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKSB7XHJcbiAgICAgICAgICAgIG1lZGlhUXVlcnkgPVxyXG4gICAgICAgICAgICAgICAgXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMS41KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAzLzIpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi1yZXNvbHV0aW9uOiAxLjVkcHB4KVwiO1xyXG4gICAgICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDEuNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZWRpYVF1ZXJ5ID1cclxuICAgICAgICAgICAgICAgIFwiKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMiksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSxcXFxyXG4gICAgICAgICAgICAgICAgICAgICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyLzEpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi1yZXNvbHV0aW9uOiAyZHBweClcIjtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKG1lZGlhUXVlcnkpLm1hdGNoZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1lZGlhUXVlcnkgPVxyXG4gICAgICAgICAgICAgICAgXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAwLjc1KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDAuNzUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDMvNCksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLXJlc29sdXRpb246IDAuNzVkcHB4KVwiO1xyXG4gICAgICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDYW52YXMgZWxlbWVudCDjga7jgq3jg6Pjg4Pjgrfjg6VcclxuICAgIGxldCBzX2NhbnZhc0ZhY3Rvcnk6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cclxuICAgIC8vIOOCreODo+ODg+OCt+ODpea4iOOBv+OBriBDYW52YXMg44KS5Y+W5b6X44GZ44KLXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q2FudmFzKCk6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgICAgICBzX2NhbnZhc0ZhY3RvcnkgPSBzX2NhbnZhc0ZhY3RvcnkgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICByZXR1cm4gPEhUTUxDYW52YXNFbGVtZW50PnNfY2FudmFzRmFjdG9yeS5jbG9uZU5vZGUoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55S75YOP44Oq44K944O844K544Gu44Ot44O844OJ5a6M5LqG44KS5L+d6Ki8XHJcbiAgICAgKiDjg5bjg6njgqbjgrbml6Llrprjga7jg5fjg63jgrDjg6zjg4Pjgrfjg5bjg63jg7zjg4njgpLotbDjgonjgZvjgarjgYTjgZ/jgoEuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSB1cmwgW2luXSB1cmwgKGRhdGEtdXJsKVxyXG4gICAgICogQHJldHVybiB7SVByb21pc2U8c3RyaW5nPn0g6KGo56S65Y+v6IO944GqIHVybFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZW5zdXJlSW1hZ2VMb2FkZWQodXJsOiBzdHJpbmcpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpbWcpIHtcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBcIlwiOyAgIC8vIOiqreOBv+i+vOOBv+WBnOatolxyXG4gICAgICAgICAgICAgICAgaW1nID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHVybCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWcub25lcnJvciA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19JTUFHRV9MT0FEX0ZBSUxFRCxcclxuICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZSBsb2FkIGZhaWxlZC4gW3VybDogXCIgKyB1cmwgKyBcIl1cIlxyXG4gICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWcuc3JjID0gdXJsO1xyXG5cclxuICAgICAgICB9LCBkZXN0cm95KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeUu+WDj+OBruODquOCteOCpOOCulxyXG4gICAgICog5oyH5a6a44GX44Gf6ZW36L6644Gu6ZW344GV44Gr44Ki44K544Oa44Kv44OI5q+U44KS57at5oyB44GX44Gm44Oq44K144Kk44K644KS6KGM44GGXHJcbiAgICAgKiBsb25nU2lkZUxlbmd0aCDjgojjgorlsI/jgZXjgarloLTlkIjjga/jgqrjg6rjgrjjg4rjg6vjgrXjgqTjgrrjgacgZGF0YS11cmwg44KS6L+U5Y2044GZ44KLXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBzcmMgICAgICAgICAgICBbaW5dIGltYWdlIOOBq+aMh+WumuOBmeOCi+OCveODvOOCuVxyXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBsb25nU2lkZUxlbmd0aCBbaW5dIOODquOCteOCpOOCuuOBq+S9v+eUqOOBmeOCi+mVt+i+uuOBruacgOWkp+WApOOCkuaMh+WumlxyXG4gICAgICogQHJldHVybiB7SVByb21pc2U8c3RyaW5nPn0gYmFzZTY0IGRhdGEgdXJsIOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmVzaXplSW1hZ2Uoc3JjOiBzdHJpbmcsIGxvbmdTaWRlTGVuZ3RoOiBudW1iZXIpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpbWcpIHtcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBcIlwiOyAgIC8vIOiqreOBv+i+vOOBv+WBnOatolxyXG4gICAgICAgICAgICAgICAgaW1nID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYW52YXMgPSBnZXRDYW52YXMoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGloID0gaW1nLmhlaWdodCwgaXcgPSBpbWcud2lkdGgsIGlhID0gaWggLyBpdztcclxuICAgICAgICAgICAgICAgIGxldCBjdzogbnVtYmVyLCBjaDogbnVtYmVyO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdyA9PT0gMCB8fCAwID09PSBpYSkgeyAvLyDlv7Xjga7jgZ/jgoHkuI3mraPjgarnlLvlg4/jgpLjgqzjg7zjg4lcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QobWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0lOVkFMSURfSU1BR0UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbnZhbGlkIGltYWdlLiBbc3JjOiBcIiArIHNyYyArIFwiXVwiXHJcbiAgICAgICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb25nU2lkZUxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdTaWRlTGVuZ3RoID0gKGlhIDwgMSkgPyBpdyA6IGloO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWEgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN3ID0gKGxvbmdTaWRlTGVuZ3RoIDwgaXcpID8gbG9uZ1NpZGVMZW5ndGggOiBpdztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSBNYXRoLnJvdW5kKGN3ICogaWEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoID0gKGxvbmdTaWRlTGVuZ3RoIDwgaWgpID8gbG9uZ1NpZGVMZW5ndGggOiBpaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3cgPSBNYXRoLnJvdW5kKGNoIC8gaWEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLndpZHRoID0gY3c7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGNoO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikuZHJhd0ltYWdlKGltZywgMCwgMCwgY3csIGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjYW52YXMudG9EYXRhVVJMKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5vbmVycm9yID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG1ha2VFcnJvckluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0lNQUdFX0xPQURfRkFJTEVELFxyXG4gICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICBcImltYWdlIGxvYWQgZmFpbGVkLiBbc3JjOiBcIiArIHNyYyArIFwiXVwiXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBzcmM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuRGF0ZVRpbWVdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIERhdGVUaW1lXHJcbiAgICAgKiBAYnJpZWYg5pmC5Yi75pON5L2c44Gu44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBEYXRlVGltZSB7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5Z+654K544Go44Gq44KL5pel5LuY44GL44KJ44CBbuaXpeW+jOOAgW7ml6XliY3jgpLnrpflh7pcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBiYXNlICAge0RhdGV9ICAgW2luXSDln7rmupbml6VcclxuICAgICAgICAgKiBAcGFyYW0gYWRkICAgIHtOdW1iZXJ9IFtpbl0g5Yqg566X5pelLiDjg57jgqTjg4rjgrnmjIflrprjgadu5pel5YmN44KC6Kit5a6a5Y+v6IO9XHJcbiAgICAgICAgICogQHBhcmFtIHRhcmdldCB7U3RyaW5nfSBbaW5dIHsgeWVhciB8IG1vbnRoIHwgZGF0ZSB8IGhvdXIgfCBtaW4gfCBzZWMgfCBtc2VjIH1cclxuICAgICAgICAgKiBAcmV0dXJuIHtEYXRlfSDml6Xku5jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbXB1dGVEYXRlKGJhc2U6IERhdGUsIGFkZDogbnVtYmVyLCB0YXJnZXQ6IHN0cmluZyA9IFwiZGF0ZVwiKTogRGF0ZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShiYXNlLmdldFRpbWUoKSk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInllYXJcIjpcclxuICAgICAgICAgICAgICAgICAgICBkYXRlLnNldFVUQ0Z1bGxZZWFyKGJhc2UuZ2V0VVRDRnVsbFllYXIoKSArIGFkZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibW9udGhcIjpcclxuICAgICAgICAgICAgICAgICAgICBkYXRlLnNldFVUQ01vbnRoKGJhc2UuZ2V0VVRDTW9udGgoKSArIGFkZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGF0ZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDRGF0ZShiYXNlLmdldFVUQ0RhdGUoKSArIGFkZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaG91clwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDSG91cnMoYmFzZS5nZXRVVENIb3VycygpICsgYWRkKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtaW5cIjpcclxuICAgICAgICAgICAgICAgICAgICBkYXRlLnNldFVUQ01pbnV0ZXMoYmFzZS5nZXRVVENNaW51dGVzKCkgKyBhZGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDU2Vjb25kcyhiYXNlLmdldFVUQ1NlY29uZHMoKSArIGFkZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibXNlY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDTWlsbGlzZWNvbmRzKGJhc2UuZ2V0VVRDTWlsbGlzZWNvbmRzKCkgKyBhZGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmtub3duIHRhcmdldDogXCIgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDRGF0ZShiYXNlLmdldFVUQ0RhdGUoKSArIGFkZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkYXRlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBzdHJpbmcgdG8gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRlIHN0cmluZyBleCkgWVlZWS1NTS1ERFRISDptbTpzcy5zc3NaXHJcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udmVydElTT1N0cmluZ1RvRGF0ZShkYXRlU3RyaW5nOiBzdHJpbmcpOiBEYXRlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGVTdHJpbmcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBkYXRlIG9iamVjdCBpbnRvIHN0cmluZyAodGhlIElTTyA4NjAxIEV4dGVuZGVkIEZvcm1hdClcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRlICAge0RhdGV9ICAgW2luXSBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQge1N0cmluZ30gW2luXSB7IHllYXIgfCBtb250aCB8IGRhdGUgfCBtaW4gfCBzZWMgfCBtc2VjIHwgdHogfVxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gZGF0ZSBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnZlcnREYXRlVG9JU09TdHJpbmcoZGF0ZTogRGF0ZSwgdGFyZ2V0OiBzdHJpbmcgPSBcInR6XCIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBpc29EYXRlU3RyaW5nID0gZGF0ZS50b0lTT1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgbGV0IG9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgIGlmICgyNyA9PT0gaXNvRGF0ZVN0cmluZy5sZW5ndGgpIHsgIC8vIMKxWVlZWVlZLU1NLUREVEhIOm1tOnNzLnNzc1pcclxuICAgICAgICAgICAgICAgIG9mZnNldCA9IDM7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwieWVhclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nLnN1YnN0cigwLCBvZmZzZXQgKyA0KTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtb250aFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nLnN1YnN0cigwLCBvZmZzZXQgKyA3KTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmcuc3Vic3RyKDAsIG9mZnNldCArIDEwKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtaW5cIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZy5zdWJzdHIoMCwgb2Zmc2V0ICsgMTYpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nLnN1YnN0cigwLCBvZmZzZXQgKyAxOSk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibXNlY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nLnN1YnN0cigwLCBvZmZzZXQgKyAyMyk7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwidHpcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5rbm93biB0YXJnZXQ6IFwiICsgdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnQgZmlsZSBzeXN0ZW0gY29tcGF0aWJsZSBzdHJpbmcgdG8gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRlIHN0cmluZyBleCkgWVlZWV9NTV9ERFRISF9tbV9zc19zc3NcclxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb252ZXJ0RmlsZVN5c3RlbVN0cmluZ1RvRGF0ZShkYXRlU3RyaW5nOiBzdHJpbmcpOiBEYXRlIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0ZVRpbWUgPSBkYXRlU3RyaW5nLnNwbGl0KFwiVFwiKTtcclxuICAgICAgICAgICAgbGV0IGlzb0RhdGVTdHJpbmcgPSBkYXRlVGltZVswXS5yZXBsYWNlKC9fL2csIFwiLVwiKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRlVGltZVsxXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGltZUFycmF5ID0gZGF0ZVRpbWVbMV0uc3BsaXQoXCJfXCIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRpbWVTdHJpbmcgPSBcIlRcIjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGltZUFycmF5Lmxlbmd0aCA8IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lU3RyaW5nICs9IHRpbWVBcnJheS5qb2luKFwiOlwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZVN0cmluZyArPSB0aW1lQXJyYXkuc2xpY2UoMCwgMykuam9pbihcIjpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZVN0cmluZyArPSBcIi5cIiArIHRpbWVBcnJheVszXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpc29EYXRlU3RyaW5nICs9IHRpbWVTdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShpc29EYXRlU3RyaW5nKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnQgZGF0ZSBvYmplY3QgaW50byBzdHJpbmcgaW4gZmlsZSBzeXN0ZW0gY29tcGF0aWJsZSBmb3JtYXQgKFlZWVlfTU1fRERUSEhfbW1fc3Nfc3NzKVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGUgICB7RGF0ZX0gICBbaW5dIGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHRhcmdldCB7U3RyaW5nfSBbaW5dIHsgeWVhciB8IG1vbnRoIHwgZGF0ZSB8IG1pbiB8IHNlYyB8IG1zZWMgfCB0eiB9XHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSBmaWxlIHN5c3RlbSBjb21wYXRpYmxlIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udmVydERhdGVUb0ZpbGVTeXN0ZW1TdHJpbmcoZGF0ZTogRGF0ZSwgdGFyZ2V0OiBzdHJpbmcgPSBcInR6XCIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBpc29EYXRlU3RyaW5nID0gRGF0ZVRpbWUuY29udmVydERhdGVUb0lTT1N0cmluZyhkYXRlLCB0YXJnZXQpO1xyXG4gICAgICAgICAgICBjb25zdCAgZmlsZVN5c3RlbVN0cmluZyA9IGlzb0RhdGVTdHJpbmcucmVwbGFjZSgvWy06Ll0vZywgXCJfXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsZVN5c3RlbVN0cmluZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJqcXVlcnlcIiAvPlxyXG5cclxubmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlRvb2xzLlRlbXBsYXRlXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSlNUXHJcbiAgICAgKiBAYnJpZWYg44Kz44Oz44OR44Kk44Or5riI44G/IOODhuODs+ODl+ODrOODvOODiOagvOe0jeOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEpTVCB7XHJcbiAgICAgICAgKGRhdGE/OiBhbnkpOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBUZW1wbGF0ZVxyXG4gICAgICogQGJyaWVmIHRlbXBsYXRlIHNjcmlwdCDjgpLnrqHnkIbjgZnjgovjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFRlbXBsYXRlIHtcclxuXHJcbiAgICAgICAgc3RhdGljIF9tYXBFbGVtZW50OiBhbnk7ICAgIC8vITwg44Kt44O844GoIEpRdWVyeSBFbGVtZW50IOOBriBNYXAg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgc3RhdGljIF9tYXBTb3VyY2U6IGFueTsgICAgIC8vITwgVVJMIOOBqCDjgr3jg7zjgrnjg5XjgqHjgqTjg6soSFRNTCkg44GuIE1hcCDjgqrjg5bjgrjjgqfjgq/jg4hcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyDlhazplovjg6Hjgr3jg4Pjg4lcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44GfIGlkLCBjbGFzcyDlkI0sIFRhZyDlkI3jgpLjgq3jg7zjgavjg4bjg7Pjg5fjg6zjg7zjg4jjga4gSlF1ZXJ5IEVsZW1lbnQg44KS5Y+W5b6X44GZ44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIGtleSAgICAgW2luXSBpZCwgY2xhc3MsIHRhZyDjgpLooajjgZnmloflrZfliJdcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzcmNdICAgW2luXSDlpJbpg6ggaHRtbCDjgpLmjIflrprjgZnjgovloLTlkIjjga8gdXJsIOOCkuioreWumlxyXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NhY2hlXSBbaW5dIHNyYyBodG1sIOOCkuOCreODo+ODg+OCt+ODpeOBmeOCi+WgtOWQiOOBryB0cnVlLiBzcmMg44GM5oyH5a6a44GV44KM44Gm44GE44KL44Go44GN44Gu44G/5pyJ5Yq5XHJcbiAgICAgICAgICogQHJldHVybiB0ZW1wbGF0ZSDjgYzmoLzntI3jgZXjgozjgabjgYTjgosgSlF1ZXJ5IEVsZW1lbnRcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgZ2V0VGVtcGxhdGVFbGVtZW50KGtleTogc3RyaW5nLCBzcmM6IHN0cmluZyA9IG51bGwsIGNhY2hlOiBib29sZWFuID0gdHJ1ZSk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcEVsZW1lbnQgPSBUZW1wbGF0ZS5nZXRFbGVtZW50TWFwKCk7XHJcbiAgICAgICAgICAgIGxldCAkZWxlbWVudCA9IG1hcEVsZW1lbnRba2V5XTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISRlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNyYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBodG1sID0gVGVtcGxhdGUuZmluZEh0bWxGcm9tU291cmNlKHNyYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50ID0gJChodG1sKS5maW5kKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQgPSAkKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOimgee0oOOBruaknOiovFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkZWxlbWVudCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IChcImludmFsaWQgW2tleSwgc3JjXSA9IFtcIiArIGtleSArIFwiLCBcIiArIHNyYyArIFwiXVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNyYyAmJiBjYWNoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBFbGVtZW50W2tleV0gPSAkZWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBleGNlcHRpb24pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkZWxlbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1hcCDjgqrjg5bjgrjjgqfjgq/jg4jjga7liYrpmaRcclxuICAgICAgICAgKiDmmI7npLrnmoTjgavjgq3jg6Pjg4Pjgrfjg6XjgpLplovmlL7jgZnjgovloLTlkIjjga/mnKzjg6Hjgr3jg4Pjg4njgpLjgrPjg7zjg6vjgZnjgotcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgZW1wdHkoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIFRlbXBsYXRlLl9tYXBFbGVtZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgVGVtcGxhdGUuX21hcFNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmjIflrprjgZfjgZ8gaWQsIGNsYXNzIOWQjSwgVGFnIOWQjeOCkuOCreODvOOBqyBKU1Qg44KS5Y+W5b6X44GZ44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZyB8IGpRdWVyeX0ga2V5ICAgICBbaW5dIGlkLCBjbGFzcywgdGFnIOOCkuihqOOBmeaWh+Wtl+WIlyDjgb7jgZ/jga8g44OG44Oz44OX44Os44O844OI5paH5a2X5YiXLCDjgb7jgZ/jga8galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgICAgICAgICBbc3JjXSAgIFtpbl0g5aSW6YOoIGh0bWwg44KS5oyH5a6a44GZ44KL5aC05ZCI44GvIHVybCDjgpLoqK3lrppcclxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59ICAgICAgICAgW2NhY2hlXSBbaW5dIHNyYyBodG1sIOOCkuOCreODo+ODg+OCt+ODpeOBmeOCi+WgtOWQiOOBryB0cnVlLiBzcmMg44GM5oyH5a6a44GV44KM44Gm44GE44KL44Go44GN44Gu44G/5pyJ5Yq5XHJcbiAgICAgICAgICogQHJldHVybiDjgrPjg7Pjg5HjgqTjg6vjgZXjgozjgZ8gSlNUIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBnZXRKU1Qoa2V5OiBKUXVlcnkpOiBKU1Q7XHJcbiAgICAgICAgc3RhdGljIGdldEpTVChrZXk6IHN0cmluZywgc3JjPzogc3RyaW5nLCBjYWNoZT86IGJvb2xlYW4pOiBKU1Q7XHJcbiAgICAgICAgc3RhdGljIGdldEpTVChrZXk6IGFueSwgc3JjPzogc3RyaW5nLCBjYWNoZT86IGJvb2xlYW4pOiBKU1Qge1xyXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGU6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBqc3Q6IEpTVDtcclxuICAgICAgICAgICAgbGV0ICRlbGVtZW50OiBKUXVlcnk7XHJcbiAgICAgICAgICAgIGlmIChrZXkgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuICAgICAgICAgICAgICAgICRlbGVtZW50ID0ga2V5O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQgPSBUZW1wbGF0ZS5nZXRUZW1wbGF0ZUVsZW1lbnQoa2V5LCBzcmMsIGNhY2hlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBnbG9iYWwuSG9nYW4pIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gSG9nYW4uY29tcGlsZSgkZWxlbWVudC50ZXh0KCkpO1xyXG4gICAgICAgICAgICAgICAganN0ID0gZnVuY3Rpb24gKGRhdGE/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZS5yZW5kZXIoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG51bGwgIT0gZ2xvYmFsLl8pIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkZWxlbWVudC5odG1sKCkpO1xyXG4gICAgICAgICAgICAgICAganN0ID0gZnVuY3Rpb24gKGRhdGE/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOaUueihjOOBqOOCv+ODluOBr+WJiumZpOOBmeOCi1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZShkYXRhKS5yZXBsYWNlKC9cXG58XFx0L2csIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImNhbm5vdCBmaW5kIHRlbXBsYXRlIGVuZ2luZSBtb2R1bGUuXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiICAgICdob2dhbicgb3IgJ3VuZGVyc2NvcmUnIGlzIHJlcXVpcmVkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ganN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyDlhoXpg6jjg6Hjgr3jg4Pjg4lcclxuXHJcbiAgICAgICAgLy8hIEVsZW1lbnQgTWFwIOOCquODluOCuOOCp+OCr+ODiOOBruWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGdldEVsZW1lbnRNYXAoKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFUZW1wbGF0ZS5fbWFwRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgVGVtcGxhdGUuX21hcEVsZW1lbnQgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVGVtcGxhdGUuX21hcEVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgVVJMIE1hcCDjgqrjg5bjgrjjgqfjgq/jg4jjga7lj5blvpdcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBnZXRTb3VyY2VNYXAoKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFUZW1wbGF0ZS5fbWFwU291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBUZW1wbGF0ZS5fbWFwU291cmNlID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFRlbXBsYXRlLl9tYXBTb3VyY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgVVJMIE1hcCDjgYvjgokgSFRNTCDjgpLmpJzntKIuIOWkseaVl+OBl+OBn+WgtOWQiOOBryB1bmRlZmluZWQg44GM6L+U44KLXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZmluZEh0bWxGcm9tU291cmNlKHNyYzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgbWFwU291cmNlID0gVGVtcGxhdGUuZ2V0U291cmNlTWFwKCk7XHJcbiAgICAgICAgICAgIGxldCBodG1sID0gbWFwU291cmNlW3NyY107XHJcblxyXG4gICAgICAgICAgICBpZiAoIWh0bWwpIHtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJodG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiAoZGF0YTogYW55LCBzdGF0dXM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAoXCJhamF4IHJlcXVlc3QgZmFpbGVkLiBzdGF0dXM6IFwiICsgc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIOOCreODo+ODg+OCt+ODpeOBq+agvOe0jVxyXG4gICAgICAgICAgICAgICAgbWFwU291cmNlW3NyY10gPSBodG1sO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuUHJvZ3Jlc3NDb3VudGVyXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUHJvZ3Jlc3NDb3VudGVyT3B0aW9uc1xyXG4gICAgICogQGJyaWVmIFByb2dyZXNzQ291bnRlciDjgavmjIflrprjgZnjgovjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQcm9ncmVzc0NvdW50ZXJPcHRpb25zIHtcclxuICAgICAgICBtYXg/OiBudW1iZXI7ICAgICAgICAgICAgICAgICAgICAgICAvLyDpgLLmjZflgKTjga7mnIDlpKflgKQg5pei5a6aOiAxMDBcclxuICAgICAgICBhbGxvd0luY3JlbWVudFJlbWFpbj86IGJvb2xlYW47ICAgICAvLyDmrovjgormjqjlrprmmYLplpPjgYzlopfjgYjjgabjgojjgYTloLTlkIjjgavjga8gdHJ1ZSDml6Llrpo6IGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFByb2dyZXNzQ291bnRlclJlc3VsdFxyXG4gICAgICogQGJyaWVmIOmAsuaNl+OBruaZgumWk+OCkuaMgeOBpOOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICogICAgICAgIOWNmOS9jeOBryBbbXNlY11cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQcm9ncmVzc0NvdW50ZXJSZXN1bHQge1xyXG4gICAgICAgIHBhc3NUaW1lOiBudW1iZXI7ICAgICAgIC8vIOe1jOmBjuaZgumWk1xyXG4gICAgICAgIHJlbWFpblRpbWU6IG51bWJlcjsgICAgIC8vIOaui+OCiuaOqOWumuaZgumWk1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFByb2dyZXNzQ291bnRlclxyXG4gICAgICogQGJyaWVmIOmAsuaNl+OBruaZgumWk+OCkuaJseOBhuODpuODvOODhuOCo+ODquODhuOCo+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUHJvZ3Jlc3NDb3VudGVyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgbWF4OiBudW1iZXI7XHJcbiAgICAgICAgICAgIGJlZ2luVGltZTogbnVtYmVyO1xyXG4gICAgICAgICAgICBhbGxvd0luY3JlbWVudFJlbWFpbjogYm9vbGVhbjtcclxuICAgICAgICAgICAgbGFzdFJlbWFpblRpbWU6IG51bWJlcjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIFtvcHRpb25zXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihvcHRpb25zPzogUHJvZ3Jlc3NDb3VudGVyT3B0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0KG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6ZaL5aeL5pmC6ZaT44KS5Yid5pyf5YyWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHJlc2V0KG9wdGlvbnM/OiBQcm9ncmVzc0NvdW50ZXJPcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzID0ge1xyXG4gICAgICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgICAgIG1heDogMTAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZ2luVGltZTogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgICAgICAgICBhbGxvd0luY3JlbWVudFJlbWFpbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFJlbWFpblRpbWU6IEluZmluaXR5LFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLCAuLi48YW55Pm9wdGlvbnNcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOe1jOmBjuaZgumWk+OBqOaOqOWumuaui+OCiuaZgumWk+OCkuWPluW+l+OBmeOCi1xyXG4gICAgICAgICAqIOmAsuaNl+WApOOBjCAwIOOBruWgtOWQiOOBr+OAgeaOqOWumuaui+OCiuaZgumWk+OBqyBJbmZpbml0eSDjgpLov5TjgZlcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAgIHByb2dyZXNzIFtpbl0g6YCy5o2X5YCkXHJcbiAgICAgICAgICogQHJldHVybnMg57WM6YGO5pmC6ZaT44Go5o6o5a6a5q6L44KK5pmC6ZaTIFttc2VjXVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBjb21wdXRlKHByb2dyZXNzOiBudW1iZXIpOiBQcm9ncmVzc0NvdW50ZXJSZXN1bHQge1xyXG4gICAgICAgICAgICBjb25zdCBwYXNzVGltZSA9IERhdGUubm93KCkgLSB0aGlzLl9zZXR0aW5ncy5iZWdpblRpbWU7XHJcbiAgICAgICAgICAgIGxldCByZW1haW5UaW1lID0gSW5maW5pdHk7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHByb2dyZXNzICYmIDAgIT09IHByb2dyZXNzKSB7XHJcbiAgICAgICAgICAgICAgICByZW1haW5UaW1lID0gcGFzc1RpbWUgKiB0aGlzLl9zZXR0aW5ncy5tYXggLyBwcm9ncmVzcyAtIHBhc3NUaW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5hbGxvd0luY3JlbWVudFJlbWFpbiB8fCAocmVtYWluVGltZSA8IHRoaXMuX3NldHRpbmdzLmxhc3RSZW1haW5UaW1lKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MubGFzdFJlbWFpblRpbWUgPSByZW1haW5UaW1lO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVtYWluVGltZSA9IHRoaXMuX3NldHRpbmdzLmxhc3RSZW1haW5UaW1lO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4geyBwYXNzVGltZSwgcmVtYWluVGltZSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJkZWNsYXJlIG1vZHVsZSBcImNkcC50b29sc1wiIHtcclxuICAgIGNvbnN0IFRvb2xzOiB0eXBlb2YgQ0RQLlRvb2xzO1xyXG4gICAgZXhwb3J0ID0gVG9vbHM7XHJcbn1cclxuIl19