/*!
 * cdp.tools.js 2.2.0
 *
 * Date: 2018-01-24T03:45:55.670Z
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVG9vbHMvRXJyb3JEZWZzLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9CaW5hcnkudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL0JpbmFyeVRyYW5zcG9ydC50cyIsImNkcDovLy9DRFAvVG9vbHMvRnVuY3Rpb25zLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9EYXRlVGltZS50cyIsImNkcDovLy9DRFAvVG9vbHMvVGVtcGxhdGUudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL1Byb2dyZXNzQ291bnRlci50cyIsImNkcDovLy9DRFAvVG9vbHMvSW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0FxQ1o7QUFyQ0QsV0FBVSxHQUFHO0lBRVQ7OztPQUdHO0lBQ0gsSUFBWSxnQkFHWDtJQUhELFdBQVksZ0JBQWdCO1FBQ3hCLDZGQUEyQjtRQUMzQixpREFBWSxDQUFDLEdBQUcsaUNBQTZCO0lBQ2pELENBQUMsRUFIVyxnQkFBZ0IsR0FBaEIsb0JBQWdCLEtBQWhCLG9CQUFnQixRQUczQjtJQUVELHVFQUF1RTtJQUN2RSw0QkFBNEI7SUFFNUIsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFFL0I7OztPQUdHO0lBQ0gsSUFBSyxlQUdKO0lBSEQsV0FBSyxlQUFlO1FBQ2hCLCtEQUFlO1FBQ2YsMENBQWMsQ0FBQyxHQUFHLG1CQUFtQjtJQUN6QyxDQUFDLEVBSEksZUFBZSxLQUFmLGVBQWUsUUFHbkI7SUFFRCxvQ0FBb0M7SUFDcEM7OztPQUdHO0lBQ0gsSUFBWSxXQUtYO0lBTEQsV0FBWSxXQUFXO1FBQ25CLDJGQUF1QztRQUN2QywrREFBc0Msc0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLG9CQUFvQixDQUFDO1FBQ3pJLDJEQUFzQyxzQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsR0FBRyxD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QW9CLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RGLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQztnQkFDL0MsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7Z0JBQy9DLENBQUM7Z0JBRUQsTUFBTSxDQUFDLEVBQUUsUUFBUSxZQUFFLFVBQVUsY0FBRSxDQUFDO1lBQ3BDLENBQUM7WUFDTCxzQkFBQztRQUFELENBQUM7UUF0RFkscUJBQWUsa0JBc0QzQjtJQUNMLENBQUMsRUFsRmEsS0FBSyxHQUFMLFNBQUssS0FBTCxTQUFLLFFBa0ZsQjtBQUFELENBQUMsRUFsRlMsR0FBRyxLQUFILEdBQUcsUUFrRloiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgQ0RQIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbnVtICBSRVNVTFRfQ09ERV9CQVNFXHJcbiAgICAgKiBAYnJpZWYg44Oq44K244Or44OI44Kz44O844OJ44Gu44Kq44OV44K744OD44OI5YCkXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFX0JBU0Uge1xyXG4gICAgICAgIENEUF9UT09MU19ERUNMQVJFUkFUSU9OID0gMCwgICAgLy8gVFMyNDMyIOWvvuetllxyXG4gICAgICAgIENEUF9UT09MUyA9IDQgKiBfTU9EVUxFX1JFU1VMVF9DT0RFX1JBTkdFX0NEUCxcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gbW9kdWxlIGVycm9yIGRlY2xhcmF0aW9uOlxyXG5cclxuICAgIGNvbnN0IEZVTkNUSU9OX0NPREVfUkFOR0UgPSAxMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbnVtICBMT0NBTF9DT0RFX0JBU0VcclxuICAgICAqIEBicmllZiBjZHAudG9vbHMg5YaF44Gu44Ot44O844Kr44Or44Kz44O844OJ44Kq44OV44K744OD44OI5YCkXHJcbiAgICAgKi9cclxuICAgIGVudW0gTE9DQUxfQ09ERV9CQVNFIHtcclxuICAgICAgICBGVU5DVElPTlMgICA9IDAsXHJcbiAgICAgICAgQkxPQiAgICAgICAgPSAxICogRlVOQ1RJT05fQ09ERV9SQU5HRSxcclxuICAgIH1cclxuXHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIFJFU1VMVF9DT0RFXHJcbiAgICAgKiBAYnJpZWYgY2RwLnRvb2xzIOOBruOCqOODqeODvOOCs+ODvOODieWumue+qVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZW51bSBSRVNVTFRfQ09ERSB7XHJcbiAgICAgICAgRVJST1JfQ0RQX1RPT0xTX0RFQ0xBUkFUSU9OICAgICAgICAgPSAwLCAvLyBUUzI0MzIg5a++562WXHJcbiAgICAgICAgRVJST1JfQ0RQX1RPT0xTX0lNQUdFX0xPQURfRkFJTEVEICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfVE9PTFMsIExPQ0FMX0NPREVfQkFTRS5GVU5DVElPTlMgKyAxLCBcImltYWdlIGxvYWQgZmFpbGVkLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfVE9PTFNfSU5WQUxJRF9JTUFHRSAgICAgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9UT09MUywgTE9DQUxfQ09ERV9CQVNFLkZVTkNUSU9OUyArIDIsIFwiaW52YWxpZCBpbWFnZS5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX1RPT0xTX0ZJTEVfUkVBREVSX0VSUk9SICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfVE9PTFMsIExPQ0FMX0NPREVfQkFTRS5CTE9CICsgMSwgXCJGaWxlUmVhZGVyIG1ldGhvZCBmYWlsZWQuXCIpLFxyXG4gICAgfVxyXG4gICAgLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBpbXBvcnQgUHJvbWlzZSA9IENEUC5Qcm9taXNlO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5CaW5hcnldIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIEJpbmFyeVxyXG4gICAgICogQGJyaWVmIOODkOOCpOODiuODquODpuODvOODhuOCo+ODquODhuOCo1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgQmluYXJ5IHtcclxuXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBjb25zdHJ1Y3RvclxyXG4gICAgICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIC8vIG5vb3BcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldCBCbG9iQnVpbGRlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQG9ic29sZXRlXHJcbiAgICAgICAgICogQHJldHVybiB7YW55fSBCbG9iQnVpbGRlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGdldEJsb2JCdWlsZGVyKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWwuQmxvYkJ1aWxkZXIgfHwgZ2xvYmFsLldlYktpdEJsb2JCdWlsZGVyIHx8IGdsb2JhbC5Nb3pCbG9iQnVpbGRlciB8fCBnbG9iYWwuTVNCbG9iQnVpbGRlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCqOODqeODvOaDheWgseeUn+aIkCBmcm9tIERPTUVycm9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcmVzdWx0Q29kZSBbaW5dIFJFU1VMVF9DT0RFIOOCkuaMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSBjYXVzZSAgICAgIFtpbl0g5LiL5L2N44GuIERPTSDjgqjjg6njg7zjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gW3RhZ10gICAgICBbaW5dIFRBRyDjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gW21lc3NhZ2VdICBbaW5dIOODoeODg+OCu+ODvOOCuOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIOOCqOODqeODvOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG1ha2VFcnJvckluZm9Gcm9tRE9NRXJyb3IocmVzdWx0Q29kZTogUkVTVUxUX0NPREUsIGNhdXNlOiBET01FcnJvciwgdGFnPzogc3RyaW5nLCBtZXNzYWdlPzogc3RyaW5nKTogRXJyb3JJbmZvIHtcclxuICAgICAgICAgICAgbGV0IF9jYXVzZTogRXJyb3I7XHJcbiAgICAgICAgICAgIGlmIChjYXVzZSkge1xyXG4gICAgICAgICAgICAgICAgX2NhdXNlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGNhdXNlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2F1c2UubmFtZSwgICAgLy8gRE9NRXJyb3IubWVzc2FnZSDjgYzmnKrjgrXjg53jg7zjg4hcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG1ha2VFcnJvckluZm8ocmVzdWx0Q29kZSwgdGFnLCBtZXNzYWdlLCBfY2F1c2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0IEJsb2JCdWlsZGVyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAb2Jzb2xldGVcclxuICAgICAgICAgKiBAcmV0dXJuIOani+eviea4iOOBvyBCbG9iIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbmV3QmxvYihibG9iUGFydHM/OiBhbnlbXSwgb3B0aW9ucz86IEJsb2JQcm9wZXJ0eUJhZyk6IEJsb2Ige1xyXG4gICAgICAgICAgICBpZiAoZ2xvYmFsLkJsb2IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgZ2xvYmFsLkJsb2IoYmxvYlBhcnRzLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHVuZGVyIEFuZHJvaWQgNC40IEtpdEthdFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgICAgICAgICBjb25zdCBibG9iQnVpbGRlck9iamVjdDogYW55ID0gQmluYXJ5LmdldEJsb2JCdWlsZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBibG9iQnVpbGRlcjogYW55ID0gbmV3IGJsb2JCdWlsZGVyT2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJ0cyA9IChibG9iUGFydHMgaW5zdGFuY2VvZiBBcnJheSkgPyBibG9iUGFydHNbMF0gOiBibG9iUGFydHM7XHJcbiAgICAgICAgICAgICAgICBibG9iQnVpbGRlci5hcHBlbmQocGFydHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2JCdWlsZGVyLmdldEJsb2Iob3B0aW9ucy50eXBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVVJMIE9iamVjdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQG9ic29sZXRlXHJcbiAgICAgICAgICogQHJldHVybiB7YW55fSBVUkwgT2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBibG9iVVJMOiBVUkwgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsLlVSTCB8fCBnbG9iYWwud2Via2l0VVJMO1xyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFycmF5QnVmZmVyIHRvIEJsb2JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBidWYgW2luXSBBcnJheUJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICogQHBhcmFtIG1pbWVUeXBlIFtpbl0gTWltZVR5cGUgb2YgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm5zIEJsb2IgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYXJyYXlCdWZmZXJUb0Jsb2IoYnVmOiBBcnJheUJ1ZmZlciwgbWltZVR5cGU6IHN0cmluZyk6IEJsb2Ige1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5Lm5ld0Jsb2IoW2J1Zl0sIHsgdHlwZTogbWltZVR5cGUgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCYXNlNjQgc3RyaW5nIHRvIEJsb2JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBiYXNlNjQge3N0cmluZ30gW2luXSBCYXNlNjQgc3RyaW5nIGRhdGFcclxuICAgICAgICAgKiBAcGFyYW0gbWltZVR5cGUge3N0cmluZ30gW2luXSBNaW1lVHlwZSBvZiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7QmxvYn0gQmxvYiBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBiYXNlNjRUb0Jsb2IoYmFzZTY0OiBzdHJpbmcsIG1pbWVUeXBlOiBzdHJpbmcpOiBCbG9iIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS5uZXdCbG9iKFtCaW5hcnkuYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQpXSwgeyB0eXBlOiBtaW1lVHlwZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRhdGEtdXJsIOW9ouW8j+eUu+WDj+OBi+OCiSBCbG9iIOOCquODluOCuOOCp+OCr+ODiOOBuOWkieaPm1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBkYXRhVXJsICAgIFtpbl0gZGF0YSB1cmxcclxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IFttaW1lVHlwZV0gW2luXSBtaW1lIHR5cGUg44KS5oyH5a6aLiDml6Llrprjgafjga8gXCJpbWFnZS9wbmdcIlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jsb2J9IEJsb2Ig44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkYXRhVXJsVG9CbG9iKGRhdGFVcmw6IHN0cmluZywgbWltZVR5cGU6IHN0cmluZyA9IFwiaW1hZ2UvcG5nXCIpOiBCbG9iIHtcclxuICAgICAgICAgICAgY29uc3QgYmFzZTY0ID0gZGF0YVVybC5zcGxpdChcIixcIilbMV07XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkuYmFzZTY0VG9CbG9iKGJhc2U2NCwgbWltZVR5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmFzZTY0IHN0cmluZyB0byBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJhc2U2NCB7c3RyaW5nfSBbaW5dIEJhc2U2NCBzdHJpbmcgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5QnVmZmVyfSBBcnJheUJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBiYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NDogc3RyaW5nKTogQXJyYXlCdWZmZXIge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IHdpbmRvdy5hdG9iKGJhc2U2NCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYnl0ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFbaV0gPSBieXRlcy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheUJ1ZmZlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJhc2U2NCBzdHJpbmcgdG8gVWludDhBcnJheVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJhc2U2NCB7c3RyaW5nfSBbaW5dIEJhc2U2NCBzdHJpbmcgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge1VpbnQ4QXJyYXl9IFVpbnQ4QXJyYXkgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmFzZTY0VG9VaW50OEFycmF5KGVuY29kZWQ6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IHdpbmRvdy5hdG9iKGVuY29kZWQpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBieXRlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVtpXSA9IGJ5dGVzLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcnJheUJ1ZmZlciB0byBiYXNlNjQgc3RyaW5nXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYXJyYXlCdWZmZXIge0FycmF5QnVmZmVyfSBbaW5dIEFycmF5QnVmZmVyIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJhc2U2NCBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBhcnJheUJ1ZmZlclRvQmFzZTY0KGFycmF5QnVmZmVyOiBBcnJheUJ1ZmZlcik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5LnVpbnQ4QXJyYXlUb0Jhc2U2NChieXRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVaW50OEFycmF5IHRvIGJhc2U2NCBzdHJpbmdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBieXRlcyB7VWludDhBcnJheX0gW2luXSBVaW50OEFycmF5IGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJhc2U2NCBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB1aW50OEFycmF5VG9CYXNlNjQoYnl0ZXM6IFVpbnQ4QXJyYXkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgZGF0YTogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBieXRlcy5ieXRlTGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5idG9hKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7QmxvYn0gYmxvYiBbaW5dIGJsb2IgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0NEUC5JUHJvbWlzZTxBcnJheUJ1ZmZlcj59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYjogQmxvYik6IElQcm9taXNlPEFycmF5QnVmZmVyPiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmNlbCA9ICgpID0+IHJlYWRlci5hYm9ydCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoQmluYXJ5Lm1ha2VFcnJvckluZm9Gcm9tRE9NRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19GSUxFX1JFQURFUl9FUlJPUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLmVycm9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiRmlsZVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcigpIGZhaWxlZC5cIlxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKTtcclxuICAgICAgICAgICAgfSwgY2FuY2VsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyBVaW50OEFycmF5XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtCbG9ifSBibG9iIFtpbl0gYmxvYiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7Q0RQLklQcm9taXNlPFVpbnQ4QXJyYXk+fSBwcm9taXNlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZEJsb2JBc1VpbnQ4QXJyYXkoYmxvYjogQmxvYik6IElQcm9taXNlPFVpbnQ4QXJyYXk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QsIGRlcGVuZE9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRPbihCaW5hcnkucmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IEFycmF5QnVmZmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IFVpbnQ4QXJyYXkocmVzdWx0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yOiBFcnJvckluZm8pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgdGV4dCBzdHJpbmdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8VWludDhBcnJheT59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkQmxvYkFzVGV4dChibG9iOiBCbG9iLCBlbmNvZGU6IHN0cmluZyA9IFwidXRmLThcIik6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICBjb25zdCBjYW5jZWwgPSAoKSA9PiByZWFkZXIuYWJvcnQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEJpbmFyeS5tYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkZpbGVSZWFkZXIucmVhZEFzVGV4dCgpIGZhaWxlZC5cIlxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IsIGVuY29kZSk7XHJcbiAgICAgICAgICAgIH0sIGNhbmNlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgRGF0YSBVUkxcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8c3RyaW5nPn0gcHJvbWlzZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRCbG9iQXNEYXRhVVJMKGJsb2I6IEJsb2IpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4gcmVhZGVyLmFib3J0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChCaW5hcnkubWFrZUVycm9ySW5mb0Zyb21ET01FcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0ZJTEVfUkVBREVSX0VSUk9SLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIuZXJyb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJGaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoKSBmYWlsZWQuXCJcclxuICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChibG9iKTtcclxuICAgICAgICAgICAgfSwgY2FuY2VsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIEBmaWxlICBCaW5hcnlUcmFuc3BvcnQudHNcclxuICogQGJyaWVmIGpRdWVyeSBhamF4IHRyYW5zcG9ydCBmb3IgbWFraW5nIGJpbmFyeSBkYXRhIHR5cGUgcmVxdWVzdHMuXHJcbiAqXHJcbiAqICAgICAgICBvcmlnaW5hbDogaHR0cHM6Ly9naXRodWIuY29tL2hlbnJ5YS9qcy1qcXVlcnkvYmxvYi9tYXN0ZXIvQmluYXJ5VHJhbnNwb3J0L2pxdWVyeS5iaW5hcnl0cmFuc3BvcnQuanNcclxuICogICAgICAgIGF1dGhvcjogICBIZW5yeSBBbGd1cyA8aGVucnlhbGd1c0BnbWFpbC5jb20+XHJcbiAqL1xyXG5uYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuICAgIC8vIFN1cHBvcnQgZmlsZSBwcm90b2NvbC4gKGFzIHNhbWUgYXMgb2ZmaWNpYWwgd2F5KVxyXG4gICAgY29uc3QgeGhyU3VjY2Vzc1N0YXR1cyA9IHtcclxuICAgICAgICAwOiAyMDAsXHJcbiAgICAgICAgMTIyMzogMjA0XHJcbiAgICB9O1xyXG5cclxuICAgICQuYWpheFRyYW5zcG9ydChcIitiaW5hcnlcIiwgKG9wdGlvbnM6IEpRdWVyeS5BamF4U2V0dGluZ3MsIG9yaWdpbmFsT3B0aW9uczogSlF1ZXJ5LkFqYXhTZXR0aW5ncywganFYSFI6IEpRdWVyeVhIUikgPT4ge1xyXG4gICAgICAgIGlmIChnbG9iYWwuRm9ybURhdGEgJiZcclxuICAgICAgICAgICAgKChvcHRpb25zLmRhdGFUeXBlICYmIChvcHRpb25zLmRhdGFUeXBlID09PSBcImJpbmFyeVwiKSkgfHxcclxuICAgICAgICAgICAgKG9wdGlvbnMuZGF0YSAmJiAoKGdsb2JhbC5BcnJheUJ1ZmZlciAmJiBvcHRpb25zLmRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgfHxcclxuICAgICAgICAgICAgKGdsb2JhbC5CbG9iICYmIG9wdGlvbnMuZGF0YSBpbnN0YW5jZW9mIGdsb2JhbC5CbG9iKSkpKSkge1xyXG4gICAgICAgICAgICBsZXQgYWJvcnRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNlbmQ6IGZ1bmN0aW9uIChoZWFkZXJzOiBKUXVlcnkuUGxhaW5PYmplY3QsIGNhbGxiYWNrOiBKUXVlcnkuVHJhbnNwb3J0LlN1Y2Nlc3NDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldHVwIGFsbCB2YXJpYWJsZXNcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBvcHRpb25zLnVybDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gb3B0aW9ucy50eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBibG9iIG9yIGFycmF5YnVmZmVyLiBEZWZhdWx0IGlzIGJsb2JcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhVHlwZSA9ICg8YW55Pm9wdGlvbnMpLnJlc3BvbnNlVHlwZSB8fCBcImJsb2JcIjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gb3B0aW9ucy5kYXRhIHx8IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlcm5hbWUgPSBvcHRpb25zLnVzZXJuYW1lIHx8IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkIHx8IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IF9jYWxsYmFjazogSlF1ZXJ5LlRyYW5zcG9ydC5TdWNjZXNzQ2FsbGJhY2sgPSBjYWxsYmFjayB8fCAoKCkgPT4geyAvKiBub29wICovIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBzdWNjZWVkZWQgaGFuZGxlclxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9kYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhW29wdGlvbnMuZGF0YVR5cGVdID0geGhyLnJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2FsbGJhY2soXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHJTdWNjZXNzU3RhdHVzW3hoci5zdGF0dXNdIHx8IHhoci5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SlF1ZXJ5LkFqYXguVGV4dFN0YXR1cz54aHIuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIGhhbmRsZXJcclxuICAgICAgICAgICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX2RhdGEgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGFbb3B0aW9ucy5kYXRhVHlwZV0gPSB4aHIucmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgY2FsbGJhY2sgYW5kIHNlbmQgZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2FsbGJhY2soXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEpRdWVyeS5BamF4LlRleHRTdGF0dXM+eGhyLnN0YXR1c1RleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBhYm9ydCBoYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9kYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhW29wdGlvbnMuZGF0YVR5cGVdID0geGhyLnJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIGNhbGxiYWNrIGFuZCBzZW5kIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxKUXVlcnkuQWpheC5UZXh0U3RhdHVzPnhoci5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWJvcnQgY2FsbGJhY2tcclxuICAgICAgICAgICAgICAgICAgICBhYm9ydENhbGxiYWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4aHIuYWJvcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB4aHIub3Blbih0eXBlLCB1cmwsIGFzeW5jLCB1c2VybmFtZSwgcGFzc3dvcmQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXR1cCBjdXN0b20gaGVhZGVyc1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBoZWFkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihpLCBoZWFkZXJzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IGRhdGFUeXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFib3J0OiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFib3J0Q2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWJvcnRDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSB0eXBlcz1cImpxdWVyeVwiIC8+XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBpbXBvcnQgUHJvbWlzZSA9IENEUC5Qcm9taXNlO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5GdW5jdGlvbnNdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWF0aC5hYnMg44KI44KK44KC6auY6YCf44GqIGFic1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gYWJzKHg6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHggPj0gMCA/IHggOiAteDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGgubWF4IOOCiOOCiuOCgumrmOmAn+OBqiBtYXhcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1heChsaHM6IG51bWJlciwgcmhzOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBsaHMgPj0gcmhzID8gbGhzIDogcmhzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWF0aC5taW4g44KI44KK44KC6auY6YCf44GqIG1pblxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWluKGxoczogbnVtYmVyLCByaHM6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGxocyA8PSByaHMgPyBsaHMgOiByaHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmlbDlgKTjgpIgMCDoqbDjgoHjgZfjgabmloflrZfliJfjgpLnlJ/miJBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHRvWmVyb1BhZGRpbmcobm86IG51bWJlciwgbGltaXQ6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHNpZ25lZCA9IFwiXCI7XHJcbiAgICAgICAgbm8gPSBOdW1iZXIobm8pO1xyXG5cclxuICAgICAgICBpZiAoaXNOYU4obm8pIHx8IGlzTmFOKGxpbWl0KSB8fCBsaW1pdCA8PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5vIDwgMCkge1xyXG4gICAgICAgICAgICBubyA9IFRvb2xzLmFicyhubyk7XHJcbiAgICAgICAgICAgIHNpZ25lZCA9IFwiLVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNpZ25lZCArIChBcnJheShsaW1pdCkuam9pbihcIjBcIikgKyBubykuc2xpY2UoLWxpbWl0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaWh+Wtl+WIl+OBruODkOOCpOODiOaVsOOCkuOCq+OCpuODs+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3RyaW5nU2l6ZShzcmM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIChCaW5hcnkubmV3QmxvYihbc3JjXSwgeyB0eXBlOiBcInRleHQvcGxhaW5cIiB9KSkuc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaWh+Wtl+WIl+OCkuODkOOCpOODiOWItumZkOOBl+OBpuWIhuWJslxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gdG9TdHJpbmdDaHVua3Moc3JjOiBzdHJpbmcsIGxpbWl0OiBudW1iZXIpOiBzdHJpbmdbXSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGNodW5rcyA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdCBzZXRDaHVuayA9IChpbnB1dDogc3RyaW5nKTogc3RyaW5nW10gPT4ge1xyXG4gICAgICAgICAgICBpZiAobGltaXQgPCBnZXRTdHJpbmdTaXplKGlucHV0KSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGFsZiA9IE1hdGguZmxvb3IoaW5wdXQubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaHMgPSBpbnB1dC5zbGljZSgwLCBoYWxmKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJocyA9IGlucHV0LnNsaWNlKGhhbGYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtsaHMsIHJoc107XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjaHVua3MucHVzaChpbnB1dCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBtYWtlQ2h1bmsgPSAod29yazogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZhaWx1cmVzID0gc2V0Q2h1bmsod29yayk7XHJcbiAgICAgICAgICAgIHdoaWxlICgwIDwgZmFpbHVyZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBtYWtlQ2h1bmsoZmFpbHVyZXMuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBtYWtlQ2h1bmsoc3JjKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNodW5rcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWkmumHjee2meaJv+OBruOBn+OCgeOBruWun+ihjOaZgue2meaJv+mWouaVsFxyXG4gICAgICpcclxuICAgICAqIFN1YiBDbGFzcyDlgJnoo5zjgqrjg5bjgrjjgqfjgq/jg4jjgavlr77jgZfjgaYgU3VwZXIgQ2xhc3Mg5YCZ6KOc44Kq44OW44K444Kn44Kv44OI44KS55u05YmN44GuIFN1cGVyIENsYXNzIOOBqOOBl+OBpuaMv+WFpeOBmeOCi+OAglxyXG4gICAgICogcHJvdG90eXBlIOOBruOBv+OCs+ODlOODvOOBmeOCi+OAglxyXG4gICAgICog44Kk44Oz44K544K/44Oz44K544Oh44Oz44OQ44KS44Kz44OU44O844GX44Gf44GE5aC05ZCI44CBU3VwZXIgQ2xhc3Mg44GM55aR5Ly844Kz44Oz44K544OI44Op44Kv44K/44KS5o+Q5L6b44GZ44KL5b+F6KaB44GM44GC44KL44CCXHJcbiAgICAgKiDoqbPntLDjga8gY2RwLnRvb2xzLkZ1bmN0aW9ucy5zcGVjLnRzIOOCkuWPgueFp+OAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzdWJDbGFzcyAgIHtjb25zdHJ1Y3Rvcn0gW2luXSDjgqrjg5bjgrjjgqfjgq/jg4jjga4gY29uc3RydWN0b3Ig44KS5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gc3VwZXJDbGFzcyB7Y29uc3RydWN0b3J9IFtpbl0g44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5oZXJpdChzdWJDbGFzczogYW55LCBzdXBlckNsYXNzOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBfcHJvdG90eXBlID0gc3ViQ2xhc3MucHJvdG90eXBlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBfaW5oZXJpdCgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfaW5oZXJpdC5wcm90b3R5cGUgPSBzdXBlckNsYXNzLnByb3RvdHlwZTtcclxuICAgICAgICBzdWJDbGFzcy5wcm90b3R5cGUgPSBuZXcgX2luaGVyaXQoKTtcclxuXHJcbiAgICAgICAgJC5leHRlbmQoc3ViQ2xhc3MucHJvdG90eXBlLCBfcHJvdG90eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1peGluIOmWouaVsFxyXG4gICAgICpcclxuICAgICAqIFR5cGVTY3JpcHQgT2ZmaWNpYWwgU2l0ZSDjgavovInjgaPjgabjgYTjgosgbWl4aW4g6Zai5pWwXHJcbiAgICAgKiBodHRwOi8vd3d3LnR5cGVzY3JpcHRsYW5nLm9yZy9IYW5kYm9vayNtaXhpbnNcclxuICAgICAqIOaXouOBq+Wumue+qeOBleOCjOOBpuOBhOOCi+OCquODluOCuOOCp+OCr+ODiOOBi+OCieOAgeaWsOimj+OBq+OCquODluOCuOOCp+OCr+ODiOOCkuWQiOaIkOOBmeOCi+OAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZXJpdmVkIHtjb25zdHJ1Y3Rvcn0gICAgW2luXSDlkIjmiJDjgZXjgozjgovjgqrjg5bjgrjjgqfjgq/jg4jjga4gY29uc3RydWN0b3Ig44KS5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gYmFzZXMgICB7Y29uc3RydWN0b3IuLi59IFtpbl0g5ZCI5oiQ5YWD44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumiAo5Y+v5aSJ5byV5pWwKVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWl4aW4oZGVyaXZlZDogYW55LCAuLi5iYXNlczogYW55W10pOiB2b2lkIHtcclxuICAgICAgICBiYXNlcy5mb3JFYWNoKChiYXNlKSA9PiB7XHJcbiAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2UucHJvdG90eXBlKS5mb3JFYWNoKG5hbWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVyaXZlZC5wcm90b3R5cGVbbmFtZV0gPSBiYXNlLnByb3RvdHlwZVtuYW1lXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gY29ycmVjdGx5IHNldCB1cCB0aGUgcHJvdG90eXBlIGNoYWluLCBmb3Igc3ViY2xhc3Nlcy5cclxuICAgICAqIFRoZSBmdW5jdGlvbiBiZWhhdmlvciBpcyBzYW1lIGFzIGV4dGVuZCgpIGZ1bmN0aW9uIG9mIEJhY2tib25lLmpzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwcm90b1Byb3BzICB7T2JqZWN0fSBbaW5dIHNldCBwcm90b3R5cGUgcHJvcGVydGllcyBhcyBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gc3RhdGljUHJvcHMge09iamVjdH0gW2luXSBzZXQgc3RhdGljIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBzdWJjbGFzcyBjb25zdHJ1Y3Rvci5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICog44Kv44Op44K557aZ5om/44Gu44Gf44KB44Gu44OY44Or44OR44O86Zai5pWwXHJcbiAgICAgKiBCYWNrYm9uZS5qcyBleHRlbmQoKSDplqLmlbDjgajlkIznrYlcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcHJvdG9Qcm9wcyAge09iamVjdH0gW2luXSBwcm90b3R5cGUgcHJvcGVydGllcyDjgpLjgqrjg5bjgrjjgqfjgq/jg4jjgafmjIflrppcclxuICAgICAqIEBwYXJhbSBzdGF0aWNQcm9wcyB7T2JqZWN0fSBbaW5dIHN0YXRpYyBwcm9wZXJ0aWVzIOOCkuOCquODluOCuOOCp+OCr+ODiOOBp+aMh+WumlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSDjgrXjg5bjgq/jg6njgrnjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChwcm90b1Byb3BzOiBvYmplY3QsIHN0YXRpY1Byb3BzPzogb2JqZWN0KTogb2JqZWN0IHtcclxuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIGxldCBjaGlsZDtcclxuXHJcbiAgICAgICAgaWYgKHByb3RvUHJvcHMgJiYgcHJvdG9Qcm9wcy5oYXNPd25Qcm9wZXJ0eShcImNvbnN0cnVjdG9yXCIpKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjaGlsZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuZXh0ZW5kKGNoaWxkLCBwYXJlbnQsIHN0YXRpY1Byb3BzKTtcclxuXHJcbiAgICAgICAgY29uc3QgU3Vycm9nYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdXJyb2dhdGUucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcclxuICAgICAgICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgU3Vycm9nYXRlO1xyXG5cclxuICAgICAgICBpZiAocHJvdG9Qcm9wcykge1xyXG4gICAgICAgICAgICAkLmV4dGVuZChjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNoaWxkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRFBJIOWPluW+l1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0RGV2aWNlUGl4Y2VsUmF0aW8oKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgbWVkaWFRdWVyeTtcclxuICAgICAgICBjb25zdCBpc19maXJlZm94ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJmaXJlZm94XCIpID4gLTE7XHJcbiAgICAgICAgaWYgKG51bGwgIT0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gJiYgIWlzX2ZpcmVmb3gpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93Lm1hdGNoTWVkaWEpIHtcclxuICAgICAgICAgICAgbWVkaWFRdWVyeSA9XHJcbiAgICAgICAgICAgICAgICBcIigtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuNSksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDMvMiksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLXJlc29sdXRpb246IDEuNWRwcHgpXCI7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5KS5tYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMS41O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1lZGlhUXVlcnkgPVxyXG4gICAgICAgICAgICAgICAgXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDIpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIvMSksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLXJlc29sdXRpb246IDJkcHB4KVwiO1xyXG4gICAgICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWVkaWFRdWVyeSA9XHJcbiAgICAgICAgICAgICAgICBcIigtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDAuNzUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMC43NSksXFxcclxuICAgICAgICAgICAgICAgICAgICAoLW8tbWluLWRldmljZS1waXhlbC1yYXRpbzogMy80KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tcmVzb2x1dGlvbjogMC43NWRwcHgpXCI7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5KS5tYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMC43O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbnZhcyBlbGVtZW50IOOBruOCreODo+ODg+OCt+ODpVxyXG4gICAgbGV0IHNfY2FudmFzRmFjdG9yeTogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblxyXG4gICAgLy8g44Kt44Oj44OD44K344Ol5riI44G/44GuIENhbnZhcyDjgpLlj5blvpfjgZnjgotcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRDYW52YXMoKTogSFRNTENhbnZhc0VsZW1lbnQge1xyXG4gICAgICAgIHNfY2FudmFzRmFjdG9yeSA9IHNfY2FudmFzRmFjdG9yeSB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIHJldHVybiA8SFRNTENhbnZhc0VsZW1lbnQ+c19jYW52YXNGYWN0b3J5LmNsb25lTm9kZShmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnlLvlg4/jg6rjgr3jg7zjgrnjga7jg63jg7zjg4nlrozkuobjgpLkv53oqLxcclxuICAgICAqIOODluODqeOCpuOCtuaXouWumuOBruODl+ODreOCsOODrOODg+OCt+ODluODreODvOODieOCkui1sOOCieOBm+OBquOBhOOBn+OCgS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHVybCBbaW5dIHVybCAoZGF0YS11cmwpXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvbWlzZTxzdHJpbmc+fSDooajnpLrlj6/og73jgaogdXJsXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBlbnN1cmVJbWFnZUxvYWRlZCh1cmw6IHN0cmluZyk6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGltZykge1xyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IFwiXCI7ICAgLy8g6Kqt44G/6L6844G/5YGc5q2iXHJcbiAgICAgICAgICAgICAgICBpbWcgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodXJsKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5vbmVycm9yID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG1ha2VFcnJvckluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0lNQUdFX0xPQURfRkFJTEVELFxyXG4gICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICBcImltYWdlIGxvYWQgZmFpbGVkLiBbdXJsOiBcIiArIHVybCArIFwiXVwiXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSB1cmw7XHJcblxyXG4gICAgICAgIH0sIGRlc3Ryb3kpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55S75YOP44Gu44Oq44K144Kk44K6XHJcbiAgICAgKiDmjIflrprjgZfjgZ/plbfovrrjga7plbfjgZXjgavjgqLjgrnjg5rjgq/jg4jmr5TjgpLntq3mjIHjgZfjgabjg6rjgrXjgqTjgrrjgpLooYzjgYZcclxuICAgICAqIGxvbmdTaWRlTGVuZ3RoIOOCiOOCiuWwj+OBleOBquWgtOWQiOOBr+OCquODquOCuOODiuODq+OCteOCpOOCuuOBpyBkYXRhLXVybCDjgpLov5TljbTjgZnjgotcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNyYyAgICAgICAgICAgIFtpbl0gaW1hZ2Ug44Gr5oyH5a6a44GZ44KL44K944O844K5XHJcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGxvbmdTaWRlTGVuZ3RoIFtpbl0g44Oq44K144Kk44K644Gr5L2/55So44GZ44KL6ZW36L6644Gu5pyA5aSn5YCk44KS5oyH5a6aXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvbWlzZTxzdHJpbmc+fSBiYXNlNjQgZGF0YSB1cmwg44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiByZXNpemVJbWFnZShzcmM6IHN0cmluZywgbG9uZ1NpZGVMZW5ndGg6IG51bWJlcik6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGltZykge1xyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IFwiXCI7ICAgLy8g6Kqt44G/6L6844G/5YGc5q2iXHJcbiAgICAgICAgICAgICAgICBpbWcgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IGdldENhbnZhcygpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWggPSBpbWcuaGVpZ2h0LCBpdyA9IGltZy53aWR0aCwgaWEgPSBpaCAvIGl3O1xyXG4gICAgICAgICAgICAgICAgbGV0IGN3OiBudW1iZXIsIGNoOiBudW1iZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGl3ID09PSAwIHx8IDAgPT09IGlhKSB7IC8vIOW/teOBruOBn+OCgeS4jeato+OBqueUu+WDj+OCkuOCrOODvOODiVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfSU5WQUxJRF9JTUFHRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImludmFsaWQgaW1hZ2UuIFtzcmM6IFwiICsgc3JjICsgXCJdXCJcclxuICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdTaWRlTGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ1NpZGVMZW5ndGggPSAoaWEgPCAxKSA/IGl3IDogaWg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpYSA8IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3cgPSAobG9uZ1NpZGVMZW5ndGggPCBpdykgPyBsb25nU2lkZUxlbmd0aCA6IGl3O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaCA9IE1hdGgucm91bmQoY3cgKiBpYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSAobG9uZ1NpZGVMZW5ndGggPCBpaCkgPyBsb25nU2lkZUxlbmd0aCA6IGloO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdyA9IE1hdGgucm91bmQoY2ggLyBpYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSBjdztcclxuICAgICAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmdldENvbnRleHQoXCIyZFwiKS5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBjdywgY2gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNhbnZhcy50b0RhdGFVUkwoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaW1nLm9uZXJyb3IgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfSU1BR0VfTE9BRF9GQUlMRUQsXHJcbiAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UgbG9hZCBmYWlsZWQuIFtzcmM6IFwiICsgc3JjICsgXCJdXCJcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaW1nLnNyYyA9IHNyYztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5EYXRlVGltZV0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgRGF0ZVRpbWVcclxuICAgICAqIEBicmllZiDmmYLliLvmk43kvZzjga7jg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIERhdGVUaW1lIHtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDln7rngrnjgajjgarjgovml6Xku5jjgYvjgonjgIFu5pel5b6M44CBbuaXpeWJjeOCkueul+WHulxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJhc2UgICB7RGF0ZX0gICBbaW5dIOWfuua6luaXpVxyXG4gICAgICAgICAqIEBwYXJhbSBhZGQgICAge051bWJlcn0gW2luXSDliqDnrpfml6UuIOODnuOCpOODiuOCueaMh+WumuOBp27ml6XliY3jgoLoqK3lrprlj6/og71cclxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IHtTdHJpbmd9IFtpbl0geyB5ZWFyIHwgbW9udGggfCBkYXRlIHwgaG91ciB8IG1pbiB8IHNlYyB8IG1zZWMgfVxyXG4gICAgICAgICAqIEByZXR1cm4ge0RhdGV9IOaXpeS7mOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29tcHV0ZURhdGUoYmFzZTogRGF0ZSwgYWRkOiBudW1iZXIsIHRhcmdldDogc3RyaW5nID0gXCJkYXRlXCIpOiBEYXRlIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKGJhc2UuZ2V0VGltZSgpKTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwieWVhclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoYmFzZS5nZXRVVENGdWxsWWVhcigpICsgYWRkKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtb250aFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDTW9udGgoYmFzZS5nZXRVVENNb250aCgpICsgYWRkKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZS5zZXRVVENEYXRlKGJhc2UuZ2V0VVRDRGF0ZSgpICsgYWRkKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJob3VyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZS5zZXRVVENIb3VycyhiYXNlLmdldFVUQ0hvdXJzKCkgKyBhZGQpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1pblwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGUuc2V0VVRDTWludXRlcyhiYXNlLmdldFVUQ01pbnV0ZXMoKSArIGFkZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VjXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZS5zZXRVVENTZWNvbmRzKGJhc2UuZ2V0VVRDU2Vjb25kcygpICsgYWRkKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtc2VjXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZS5zZXRVVENNaWxsaXNlY29uZHMoYmFzZS5nZXRVVENNaWxsaXNlY29uZHMoKSArIGFkZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVua25vd24gdGFyZ2V0OiBcIiArIHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZS5zZXRVVENEYXRlKGJhc2UuZ2V0VVRDRGF0ZSgpICsgYWRkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IHN0cmluZyB0byBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGUgc3RyaW5nIGV4KSBZWVlZLU1NLUREVEhIOm1tOnNzLnNzc1pcclxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb252ZXJ0SVNPU3RyaW5nVG9EYXRlKGRhdGVTdHJpbmc6IHN0cmluZyk6IERhdGUge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlVmFsdWUgPSB0aGlzLmNvbnZlcnRJU09TdHJpbmdUb0RhdGVWYWx1ZShkYXRlU3RyaW5nKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGVWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IGRhdGUgb2JqZWN0IGludG8gc3RyaW5nICh0aGUgSVNPIDg2MDEgRXh0ZW5kZWQgRm9ybWF0KVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGUgICB7RGF0ZX0gICBbaW5dIGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHRhcmdldCB7U3RyaW5nfSBbaW5dIHsgeWVhciB8IG1vbnRoIHwgZGF0ZSB8IG1pbiB8IHNlYyB8IG1zZWMgfCB0eiB9XHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSBkYXRlIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udmVydERhdGVUb0lTT1N0cmluZyhkYXRlOiBEYXRlLCB0YXJnZXQ6IHN0cmluZyA9IFwidHpcIik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzb0RhdGVTdHJpbmcgPSBkYXRlLnRvSVNPU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBuZWVkIG9mZnNldCBpZiBleHRlbmRlZCBmb3JtYXQgKMKxWVlZWVlZLU1NLUREVEhIOm1tOnNzLnNzc1opXHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IDI3ID09PSBpc29EYXRlU3RyaW5nLmxlbmd0aCA/IDMgOiAwO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ5ZWFyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmcuc3Vic3RyKDAsIG9mZnNldCArIDQpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1vbnRoXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmcuc3Vic3RyKDAsIG9mZnNldCArIDcpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImRhdGVcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZy5zdWJzdHIoMCwgb2Zmc2V0ICsgMTApO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1pblwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nLnN1YnN0cigwLCBvZmZzZXQgKyAxNik7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VjXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmcuc3Vic3RyKDAsIG9mZnNldCArIDE5KTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtc2VjXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmcuc3Vic3RyKDAsIG9mZnNldCArIDIzKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ0elwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmtub3duIHRhcmdldDogXCIgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBmaWxlIHN5c3RlbSBjb21wYXRpYmxlIHN0cmluZyB0byBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGUgc3RyaW5nIGV4KSBZWVlZX01NX0REVEhIX21tX3NzX3Nzc1xyXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnZlcnRGaWxlU3lzdGVtU3RyaW5nVG9EYXRlKGRhdGVTdHJpbmc6IHN0cmluZyk6IERhdGUge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlVmFsdWUgPSB0aGlzLmNvbnZlcnRGaWxlU3lzdGVtU3RyaW5nVG9EYXRlVmFsdWUoZGF0ZVN0cmluZyk7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlVmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBkYXRlIG9iamVjdCBpbnRvIHN0cmluZyBpbiBmaWxlIHN5c3RlbSBjb21wYXRpYmxlIGZvcm1hdCAoWVlZWV9NTV9ERFRISF9tbV9zc19zc3MpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGF0ZSAgIHtEYXRlfSAgIFtpbl0gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IHtTdHJpbmd9IFtpbl0geyB5ZWFyIHwgbW9udGggfCBkYXRlIHwgbWluIHwgc2VjIHwgbXNlYyB9XHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSBmaWxlIHN5c3RlbSBjb21wYXRpYmxlIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udmVydERhdGVUb0ZpbGVTeXN0ZW1TdHJpbmcoZGF0ZTogRGF0ZSwgdGFyZ2V0OiBzdHJpbmcgPSBcIm1zZWNcIik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlzb0RhdGVTdHJpbmcgPSBEYXRlVGltZS5jb252ZXJ0RGF0ZVRvSVNPU3RyaW5nKGRhdGUsIHRhcmdldCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbGVTeXN0ZW1TdHJpbmcgPSBpc29EYXRlU3RyaW5nLnJlcGxhY2UoL1stOi5dL2csIFwiX1wiKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW1TdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IElTTyBzdHJpbmcgdG8gdmFsdWUgb2YgZGF0ZSAobWlsbGlzZWNvbmRzKVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGlzb1N0cmluZyB7U3RyaW5nfSBbaW5dIGRhdGUgc3RyaW5nXHJcbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfSB2YWx1ZSBvZiBkYXRlIChtcylcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBjb252ZXJ0SVNPU3RyaW5nVG9EYXRlVmFsdWUoaXNvU3RyaW5nOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBjb25zdCByZVllYXIgPSAvKFxcZHs0fXxbLStdXFxkezZ9KS87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlTW9udGggPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZURheSA9IC8oXFxkezJ9KS87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlRGF0ZSA9IG5ldyBSZWdFeHAoYCR7cmVZZWFyLnNvdXJjZX0oPzotJHtyZU1vbnRoLnNvdXJjZX0oPzotJHtyZURheS5zb3VyY2V9KSopKmApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVIb3VycyA9IC8oXFxkezJ9KS87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlTWludXRlcyA9IC8oXFxkezJ9KS87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlU2Vjb25kcyA9IC8oXFxkezJ9KS87XHJcbiAgICAgICAgICAgIGNvbnN0IHJlTXMgPSAvKFxcZHszfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZVRpbWUgPSBuZXcgUmVnRXhwKGBUJHtyZUhvdXJzLnNvdXJjZX06JHtyZU1pbnV0ZXMuc291cmNlfSg/Ojoke3JlU2Vjb25kcy5zb3VyY2V9KD86XFwuJHtyZU1zLnNvdXJjZX0pKikqYCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZVR6ICA9IC8oWnxbLStdXFxkezJ9OlxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZUlTT1N0cmluZyA9IG5ldyBSZWdFeHAoYF4ke3JlRGF0ZS5zb3VyY2V9KD86JHtyZVRpbWUuc291cmNlfSg/OiR7cmVUei5zb3VyY2V9KSopKiRgKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IHJlSVNPU3RyaW5nLmV4ZWMoaXNvU3RyaW5nKTtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpbnZhbGlkIElTTyBzdHJpbmdcclxuICAgICAgICAgICAgICAgIHJldHVybiBOYU47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSBwYXJzZUludChyZXN1bHRbMV0sIDEwKTtcclxuICAgICAgICAgICAgY29uc3QgbW9udGggPSBwYXJzZUludChyZXN1bHRbMl0sIDEwKSAtIDEgfHwgMDtcclxuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IHBhcnNlSW50KHJlc3VsdFszXSwgMTApIHx8IDE7XHJcbiAgICAgICAgICAgIGxldCBob3VycyA9IHBhcnNlSW50KHJlc3VsdFs0XSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgIGxldCBtaW51dGVzID0gcGFyc2VJbnQocmVzdWx0WzVdLCAxMCkgfHwgMDtcclxuICAgICAgICAgICAgY29uc3Qgc2Vjb25kcyA9IHBhcnNlSW50KHJlc3VsdFs2XSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IG1zID0gcGFyc2VJbnQocmVzdWx0WzddLCAxMCkgfHwgMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHRbOF0pIHtcclxuICAgICAgICAgICAgICAgIC8vIHRpbWV6b25lIG9mZnNldFxyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChyZXN1bHRbOF1bMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiWlwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiLVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyAtSEg6bW1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaG91cnMgKz0gcGFyc2VJbnQocmVzdWx0WzhdLnN1YnN0cigxLCAyKSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbnV0ZXMgKz0gcGFyc2VJbnQocmVzdWx0WzhdLnN1YnN0cig0LCAyKSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCIrXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICtISDptbVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VycyAtPSBwYXJzZUludChyZXN1bHRbOF0uc3Vic3RyKDEsIDIpLCAxMCkgfHwgMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWludXRlcyAtPSBwYXJzZUludChyZXN1bHRbOF0uc3Vic3RyKDQsIDIpLCAxMCkgfHwgMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiaW52YWxpZCB0aW1lem9uZSBpbiBJU08gc3RyaW5nXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5VVEMoeWVhciwgbW9udGgsIGRhdGUsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBtcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IGZpbGUgc3lzdGVtIGNvbXBhdGlibGUgc3RyaW5nIHRvIHRvIHZhbHVlIG9mIGRhdGUgKG1pbGxpc2Vjb25kcylcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRlU3RyaW5nIHtTdHJpbmd9IFtpbl0gZGF0ZSBzdHJpbmcgKFlZWVlfTU1fRERUSEhfbW1fc3Nfc3NzKVxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gY29udmVydGVkIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGNvbnZlcnRGaWxlU3lzdGVtU3RyaW5nVG9EYXRlVmFsdWUoZGF0ZVN0cmluZzogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgY29uc3QgcmVZZWFyID0gLyhcXGR7NH18Wy0rXVxcZHs2fSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZU1vbnRoID0gLyhcXGR7Mn0pLztcclxuICAgICAgICAgICAgY29uc3QgcmVEYXkgPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZURhdGUgPSBuZXcgUmVnRXhwKGAke3JlWWVhci5zb3VyY2V9KD86XyR7cmVNb250aC5zb3VyY2V9KD86XyR7cmVEYXkuc291cmNlfSk/KT9gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlSG91cnMgPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZU1pbnV0ZXMgPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZVNlY29uZHMgPSAvKFxcZHsyfSkvO1xyXG4gICAgICAgICAgICBjb25zdCByZU1zID0gLyhcXGR7M30pLztcclxuICAgICAgICAgICAgY29uc3QgcmVUaW1lID0gbmV3IFJlZ0V4cChgVCR7cmVIb3Vycy5zb3VyY2V9XyR7cmVNaW51dGVzLnNvdXJjZX0oPzpfJHtyZVNlY29uZHMuc291cmNlfSg/Ol8ke3JlTXMuc291cmNlfSk/KT9gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlRmlsZVN5c3RlbVN0cmluZyA9IG5ldyBSZWdFeHAoYF4ke3JlRGF0ZS5zb3VyY2V9KD86JHtyZVRpbWUuc291cmNlfSkqJGApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcmVGaWxlU3lzdGVtU3RyaW5nLmV4ZWMoZGF0ZVN0cmluZyk7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgLy8gaW52YWxpZCBmaWxlIHN5c3RlbSBzdHJpbmdcclxuICAgICAgICAgICAgICAgIHJldHVybiBOYU47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHllYXIgPSBwYXJzZUludChyZXN1bHRbMV0sIDEwKTtcclxuICAgICAgICAgICAgY29uc3QgbW9udGggPSBwYXJzZUludChyZXN1bHRbMl0sIDEwKSAtIDEgfHwgMDtcclxuICAgICAgICAgICAgY29uc3QgZGF0ZSA9IHBhcnNlSW50KHJlc3VsdFszXSwgMTApIHx8IDE7XHJcbiAgICAgICAgICAgIGNvbnN0IGhvdXJzID0gcGFyc2VJbnQocmVzdWx0WzRdLCAxMCkgfHwgMDtcclxuICAgICAgICAgICAgY29uc3QgbWludXRlcyA9IHBhcnNlSW50KHJlc3VsdFs1XSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZHMgPSBwYXJzZUludChyZXN1bHRbNl0sIDEwKSB8fCAwO1xyXG4gICAgICAgICAgICBjb25zdCBtcyA9IHBhcnNlSW50KHJlc3VsdFs3XSwgMTApIHx8IDA7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gRGF0ZS5VVEMoeWVhciwgbW9udGgsIGRhdGUsIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCBtcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwianF1ZXJ5XCIgLz5cclxuXHJcbm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5UZW1wbGF0ZV0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEpTVFxyXG4gICAgICogQGJyaWVmIOOCs+ODs+ODkeOCpOODq+a4iOOBvyDjg4bjg7Pjg5fjg6zjg7zjg4jmoLzntI3jgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBKU1Qge1xyXG4gICAgICAgIChkYXRhPzogYW55KTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgVGVtcGxhdGVcclxuICAgICAqIEBicmllZiB0ZW1wbGF0ZSBzY3JpcHQg44KS566h55CG44GZ44KL44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBUZW1wbGF0ZSB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBfbWFwRWxlbWVudDogYW55OyAgICAvLyE8IOOCreODvOOBqCBKUXVlcnkgRWxlbWVudCDjga4gTWFwIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgIHN0YXRpYyBfbWFwU291cmNlOiBhbnk7ICAgICAvLyE8IFVSTCDjgagg44K944O844K544OV44Kh44Kk44OrKEhUTUwpIOOBriBNYXAg44Kq44OW44K444Kn44Kv44OIXHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8g5YWs6ZaL44Oh44K944OD44OJXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBnyBpZCwgY2xhc3Mg5ZCNLCBUYWcg5ZCN44KS44Kt44O844Gr44OG44Oz44OX44Os44O844OI44GuIEpRdWVyeSBFbGVtZW50IOOCkuWPluW+l+OBmeOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICBrZXkgICAgIFtpbl0gaWQsIGNsYXNzLCB0YWcg44KS6KGo44GZ5paH5a2X5YiXXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICBbc3JjXSAgIFtpbl0g5aSW6YOoIGh0bWwg44KS5oyH5a6a44GZ44KL5aC05ZCI44GvIHVybCDjgpLoqK3lrppcclxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjYWNoZV0gW2luXSBzcmMgaHRtbCDjgpLjgq3jg6Pjg4Pjgrfjg6XjgZnjgovloLTlkIjjga8gdHJ1ZS4gc3JjIOOBjOaMh+WumuOBleOCjOOBpuOBhOOCi+OBqOOBjeOBruOBv+acieWKuVxyXG4gICAgICAgICAqIEByZXR1cm4gdGVtcGxhdGUg44GM5qC857SN44GV44KM44Gm44GE44KLIEpRdWVyeSBFbGVtZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGdldFRlbXBsYXRlRWxlbWVudChrZXk6IHN0cmluZywgc3JjOiBzdHJpbmcgPSBudWxsLCBjYWNoZTogYm9vbGVhbiA9IHRydWUpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICBjb25zdCBtYXBFbGVtZW50ID0gVGVtcGxhdGUuZ2V0RWxlbWVudE1hcCgpO1xyXG4gICAgICAgICAgICBsZXQgJGVsZW1lbnQgPSBtYXBFbGVtZW50W2tleV07XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEkZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaHRtbCA9IFRlbXBsYXRlLmZpbmRIdG1sRnJvbVNvdXJjZShzcmMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudCA9ICQoaHRtbCkuZmluZChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50ID0gJChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyDopoHntKDjga7mpJzoqLxcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJGVsZW1lbnQgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAoXCJpbnZhbGlkIFtrZXksIHNyY10gPSBbXCIgKyBrZXkgKyBcIiwgXCIgKyBzcmMgKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcmMgJiYgY2FjaGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwRWxlbWVudFtrZXldID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgZXhjZXB0aW9uKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYXAg44Kq44OW44K444Kn44Kv44OI44Gu5YmK6ZmkXHJcbiAgICAgICAgICog5piO56S655qE44Gr44Kt44Oj44OD44K344Ol44KS6ZaL5pS+44GZ44KL5aC05ZCI44Gv5pys44Oh44K944OD44OJ44KS44Kz44O844Or44GZ44KLXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGVtcHR5KCk6IHZvaWQge1xyXG4gICAgICAgICAgICBUZW1wbGF0ZS5fbWFwRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgIFRlbXBsYXRlLl9tYXBTb3VyY2UgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44GfIGlkLCBjbGFzcyDlkI0sIFRhZyDlkI3jgpLjgq3jg7zjgasgSlNUIOOCkuWPluW+l+OBmeOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmcgfCBqUXVlcnl9IGtleSAgICAgW2luXSBpZCwgY2xhc3MsIHRhZyDjgpLooajjgZnmloflrZfliJcg44G+44Gf44GvIOODhuODs+ODl+ODrOODvOODiOaWh+Wtl+WIlywg44G+44Gf44GvIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgW3NyY10gICBbaW5dIOWklumDqCBodG1sIOOCkuaMh+WumuOBmeOCi+WgtOWQiOOBryB1cmwg44KS6Kit5a6aXHJcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSAgICAgICAgIFtjYWNoZV0gW2luXSBzcmMgaHRtbCDjgpLjgq3jg6Pjg4Pjgrfjg6XjgZnjgovloLTlkIjjga8gdHJ1ZS4gc3JjIOOBjOaMh+WumuOBleOCjOOBpuOBhOOCi+OBqOOBjeOBruOBv+acieWKuVxyXG4gICAgICAgICAqIEByZXR1cm4g44Kz44Oz44OR44Kk44Or44GV44KM44GfIEpTVCDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgZ2V0SlNUKGtleTogSlF1ZXJ5KTogSlNUO1xyXG4gICAgICAgIHN0YXRpYyBnZXRKU1Qoa2V5OiBzdHJpbmcsIHNyYz86IHN0cmluZywgY2FjaGU/OiBib29sZWFuKTogSlNUO1xyXG4gICAgICAgIHN0YXRpYyBnZXRKU1Qoa2V5OiBhbnksIHNyYz86IHN0cmluZywgY2FjaGU/OiBib29sZWFuKTogSlNUIHtcclxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQganN0OiBKU1Q7XHJcbiAgICAgICAgICAgIGxldCAkZWxlbWVudDogSlF1ZXJ5O1xyXG4gICAgICAgICAgICBpZiAoa2V5IGluc3RhbmNlb2YgalF1ZXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbWVudCA9IGtleTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRlbGVtZW50ID0gVGVtcGxhdGUuZ2V0VGVtcGxhdGVFbGVtZW50KGtleSwgc3JjLCBjYWNoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gZ2xvYmFsLkhvZ2FuKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IEhvZ2FuLmNvbXBpbGUoJGVsZW1lbnQudGV4dCgpKTtcclxuICAgICAgICAgICAgICAgIGpzdCA9IGZ1bmN0aW9uIChkYXRhPzogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUucmVuZGVyKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChudWxsICE9IGdsb2JhbC5fKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJGVsZW1lbnQuaHRtbCgpKTtcclxuICAgICAgICAgICAgICAgIGpzdCA9IGZ1bmN0aW9uIChkYXRhPzogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDmlLnooYzjgajjgr/jg5bjga/liYrpmaTjgZnjgotcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUoZGF0YSkucmVwbGFjZSgvXFxufFxcdC9nLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJjYW5ub3QgZmluZCB0ZW1wbGF0ZSBlbmdpbmUgbW9kdWxlLlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIiAgICAnaG9nYW4nIG9yICd1bmRlcnNjb3JlJyBpcyByZXF1aXJlZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGpzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8g5YaF6YOo44Oh44K944OD44OJXHJcblxyXG4gICAgICAgIC8vISBFbGVtZW50IE1hcCDjgqrjg5bjgrjjgqfjgq/jg4jjga7lj5blvpdcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBnZXRFbGVtZW50TWFwKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghVGVtcGxhdGUuX21hcEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIFRlbXBsYXRlLl9tYXBFbGVtZW50ID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFRlbXBsYXRlLl9tYXBFbGVtZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFVSTCBNYXAg44Kq44OW44K444Kn44Kv44OI44Gu5Y+W5b6XXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZ2V0U291cmNlTWFwKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghVGVtcGxhdGUuX21hcFNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgVGVtcGxhdGUuX21hcFNvdXJjZSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBUZW1wbGF0ZS5fbWFwU291cmNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFVSTCBNYXAg44GL44KJIEhUTUwg44KS5qSc57SiLiDlpLHmlZfjgZfjgZ/loLTlkIjjga8gdW5kZWZpbmVkIOOBjOi/lOOCi1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGZpbmRIdG1sRnJvbVNvdXJjZShzcmM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcFNvdXJjZSA9IFRlbXBsYXRlLmdldFNvdXJjZU1hcCgpO1xyXG4gICAgICAgICAgICBsZXQgaHRtbCA9IG1hcFNvdXJjZVtzcmNdO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogKGRhdGE6IGFueSwgc3RhdHVzOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgKFwiYWpheCByZXF1ZXN0IGZhaWxlZC4gc3RhdHVzOiBcIiArIHN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyDjgq3jg6Pjg4Pjgrfjg6XjgavmoLzntI1cclxuICAgICAgICAgICAgICAgIG1hcFNvdXJjZVtzcmNdID0gaHRtbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlRvb2xzLlByb2dyZXNzQ291bnRlcl0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFByb2dyZXNzQ291bnRlck9wdGlvbnNcclxuICAgICAqIEBicmllZiBQcm9ncmVzc0NvdW50ZXIg44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJvZ3Jlc3NDb3VudGVyT3B0aW9ucyB7XHJcbiAgICAgICAgbWF4PzogbnVtYmVyOyAgICAgICAgICAgICAgICAgICAgICAgLy8g6YCy5o2X5YCk44Gu5pyA5aSn5YCkIOaXouWumjogMTAwXHJcbiAgICAgICAgYWxsb3dJbmNyZW1lbnRSZW1haW4/OiBib29sZWFuOyAgICAgLy8g5q6L44KK5o6o5a6a5pmC6ZaT44GM5aKX44GI44Gm44KI44GE5aC05ZCI44Gr44GvIHRydWUg5pei5a6aOiBmYWxzZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQcm9ncmVzc0NvdW50ZXJSZXN1bHRcclxuICAgICAqIEBicmllZiDpgLLmjZfjga7mmYLplpPjgpLmjIHjgaTjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqICAgICAgICDljZjkvY3jga8gW21zZWNdXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUHJvZ3Jlc3NDb3VudGVyUmVzdWx0IHtcclxuICAgICAgICBwYXNzVGltZTogbnVtYmVyOyAgICAgICAvLyDntYzpgY7mmYLplpNcclxuICAgICAgICByZW1haW5UaW1lOiBudW1iZXI7ICAgICAvLyDmrovjgormjqjlrprmmYLplpNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQcm9ncmVzc0NvdW50ZXJcclxuICAgICAqIEBicmllZiDpgLLmjZfjga7mmYLplpPjgpLmibHjgYbjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFByb2dyZXNzQ291bnRlciB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3NldHRpbmdzOiB7XHJcbiAgICAgICAgICAgIG1heDogbnVtYmVyO1xyXG4gICAgICAgICAgICBiZWdpblRpbWU6IG51bWJlcjtcclxuICAgICAgICAgICAgYWxsb3dJbmNyZW1lbnRSZW1haW46IGJvb2xlYW47XHJcbiAgICAgICAgICAgIGxhc3RSZW1haW5UaW1lOiBudW1iZXI7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBbb3B0aW9uc10g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9ucz86IFByb2dyZXNzQ291bnRlck9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldChvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOmWi+Wni+aZgumWk+OCkuWIneacn+WMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyByZXNldChvcHRpb25zPzogUHJvZ3Jlc3NDb3VudGVyT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgICAgIC4uLntcclxuICAgICAgICAgICAgICAgICAgICBtYXg6IDEwMCxcclxuICAgICAgICAgICAgICAgICAgICBiZWdpblRpbWU6IERhdGUubm93KCksXHJcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dJbmNyZW1lbnRSZW1haW46IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RSZW1haW5UaW1lOiBJbmZpbml0eSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICwgLi4uPGFueT5vcHRpb25zXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDntYzpgY7mmYLplpPjgajmjqjlrprmrovjgormmYLplpPjgpLlj5blvpfjgZnjgotcclxuICAgICAgICAgKiDpgLLmjZflgKTjgYwgMCDjga7loLTlkIjjga/jgIHmjqjlrprmrovjgormmYLplpPjgasgSW5maW5pdHkg44KS6L+U44GZXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gICBwcm9ncmVzcyBbaW5dIOmAsuaNl+WApFxyXG4gICAgICAgICAqIEByZXR1cm5zIOe1jOmBjuaZgumWk+OBqOaOqOWumuaui+OCiuaZgumWkyBbbXNlY11cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgY29tcHV0ZShwcm9ncmVzczogbnVtYmVyKTogUHJvZ3Jlc3NDb3VudGVyUmVzdWx0IHtcclxuICAgICAgICAgICAgY29uc3QgcGFzc1RpbWUgPSBEYXRlLm5vdygpIC0gdGhpcy5fc2V0dGluZ3MuYmVnaW5UaW1lO1xyXG4gICAgICAgICAgICBsZXQgcmVtYWluVGltZSA9IEluZmluaXR5O1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBwcm9ncmVzcyAmJiAwICE9PSBwcm9ncmVzcykge1xyXG4gICAgICAgICAgICAgICAgcmVtYWluVGltZSA9IHBhc3NUaW1lICogdGhpcy5fc2V0dGluZ3MubWF4IC8gcHJvZ3Jlc3MgLSBwYXNzVGltZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MuYWxsb3dJbmNyZW1lbnRSZW1haW4gfHwgKHJlbWFpblRpbWUgPCB0aGlzLl9zZXR0aW5ncy5sYXN0UmVtYWluVGltZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzLmxhc3RSZW1haW5UaW1lID0gcmVtYWluVGltZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlbWFpblRpbWUgPSB0aGlzLl9zZXR0aW5ncy5sYXN0UmVtYWluVGltZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHsgcGFzc1RpbWUsIHJlbWFpblRpbWUgfTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiZGVjbGFyZSBtb2R1bGUgXCJjZHAudG9vbHNcIiB7XHJcbiAgICBjb25zdCBUb29sczogdHlwZW9mIENEUC5Ub29scztcclxuICAgIGV4cG9ydCA9IFRvb2xzO1xyXG59XHJcbiJdfQ==