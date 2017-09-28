/*!
 * cdp.tools.js 2.0.0
 *
 * Date: 2017-09-28T09:39:39.988Z
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
             * @param base    {Date}   [in] 基準日
             * @param addDays {Number} [in] 加算日. マイナス指定でn日前も設定可能
             * @return {Date} 日付オブジェクト
             */
            DateTime.computeDate = function (base, addDays) {
                var dt = new Date(base.getTime());
                var baseSec = dt.getTime();
                var addSec = addDays * 86400000; //日数 * 1日のミリ秒数
                var targetSec = baseSec + addSec;
                dt.setTime(targetSec);
                return dt;
            };
            /**
             * Convert string to date object
             *
             * @param {String} date string ex) YYYY-MM-DDTHH:mm:SS.SSS
             * @return {Object} date object
             */
            DateTime.convertISOStringToDate = function (dateString) {
                var dateTime = dateString.split("T"), dateArray = dateTime[0].split("-");
                var timeArray, secArray, dateObject;
                if (dateTime[1]) {
                    timeArray = dateTime[1].split(":");
                    secArray = timeArray[2].split(".");
                }
                if (timeArray) {
                    dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], secArray[0], secArray[1]);
                }
                else {
                    if (dateArray[2]) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                    }
                    else if (dateArray[1]) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1);
                    }
                    else {
                        dateObject = new Date(dateArray[0]);
                    }
                }
                return dateObject;
            };
            /**
             *  Convert a date object into a string in PMOAPI recorded_date format(the ISO 8601 Extended Format)
             *
             * @param date   {Date}   [in] date object
             * @param target {String} [in] {year | month | date | hour | min | sec | msec }
             * @return {String}
             */
            DateTime.convertDateToISOString = function (date, target) {
                if (target === void 0) { target = "msec"; }
                var isoDateString;
                switch (target) {
                    case "year":
                    case "month":
                    case "date":
                    case "hour":
                    case "min":
                    case "sec":
                    case "msec":
                        break;
                    default:
                        console.warn(TAG + "unknown target: " + target);
                        target = "msec";
                }
                isoDateString = date.getFullYear();
                if ("year" === target) {
                    return isoDateString;
                }
                isoDateString += ("-" + DateTime.numberToDoubleDigitsString(date.getMonth() + 1));
                if ("month" === target) {
                    return isoDateString;
                }
                isoDateString += ("-" + DateTime.numberToDoubleDigitsString(date.getDate()));
                if ("date" === target) {
                    return isoDateString;
                }
                isoDateString += ("T" + DateTime.numberToDoubleDigitsString(date.getHours()));
                if ("hour" === target) {
                    return isoDateString;
                }
                isoDateString += (":" + DateTime.numberToDoubleDigitsString(date.getMinutes()));
                if ("min" === target) {
                    return isoDateString;
                }
                isoDateString += (":" + DateTime.numberToDoubleDigitsString(date.getSeconds()));
                if ("sec" === target) {
                    return isoDateString;
                }
                isoDateString += ("." + String((date.getMilliseconds() / 1000).toFixed(3)).slice(2, 5));
                return isoDateString;
            };
            /**
             * Convert file system compatible string to date object
             *
             * @param {String} date string ex) yyyy_MM_ddTHH_mm_ss_SSS
             * @return {Object} date object
             */
            DateTime.convertFileSystemStringToDate = function (dateString) {
                var dateTime = dateString.split("T"), dateArray = dateTime[0].split("_");
                var timeArray, dateObject;
                if (dateTime[1]) {
                    timeArray = dateTime[1].split("_");
                }
                if (timeArray) {
                    dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], timeArray[2], timeArray[3]);
                }
                else {
                    if (dateArray[2]) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                    }
                    else if (dateArray[1]) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1);
                    }
                    else {
                        dateObject = new Date(dateArray[0]);
                    }
                }
                return dateObject;
            };
            /**
             *  Convert a date object into a string in file system compatible format(yyyy_MM_ddTHH_mm_ss_SSS)
             *
             * @param date   {Date}   [in] date object
             * @param target {String} [in] {year | month | date | hour | min | sec | msec }
             * @return {String}
             */
            DateTime.convertDateToFileSystemString = function (date, target) {
                if (target === void 0) { target = "msec"; }
                var fileSystemString;
                switch (target) {
                    case "year":
                    case "month":
                    case "date":
                    case "hour":
                    case "min":
                    case "sec":
                    case "msec":
                        break;
                    default:
                        console.warn(TAG + "unknown target: " + target);
                        target = "msec";
                }
                fileSystemString = date.getFullYear();
                if ("year" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getMonth() + 1));
                if ("month" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getDate()));
                if ("date" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("T" + DateTime.numberToDoubleDigitsString(date.getHours()));
                if ("hour" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getMinutes()));
                if ("min" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getSeconds()));
                if ("sec" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + String((date.getMilliseconds() / 1000).toFixed(3)).slice(2, 5));
                return fileSystemString;
            };
            ///////////////////////////////////////////////////////////////////////
            // private static method
            /**
             * Convert num to string(double digits)
             *
             * @param  {Number} number (0 <number < 100)
             * @return {String} double digits string
             */
            DateTime.numberToDoubleDigitsString = function (num) {
                if (num < 0 || num > 100) {
                    return null;
                }
                if (num < 10) {
                    return "0" + num;
                }
                return "" + num;
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
                    allowIncrementeRemain: false,
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
                if (this._settings.allowIncrementeRemain || (remainTime < this._settings.lastRemainTime)) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVG9vbHMvRXJyb3JEZWZzLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9CaW5hcnkudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL0JpbmFyeVRyYW5zcG9ydC50cyIsImNkcDovLy9DRFAvVG9vbHMvRnVuY3Rpb25zLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9EYXRlVGltZS50cyIsImNkcDovLy9DRFAvVG9vbHMvVGVtcGxhdGUudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL1Byb2dyZXNzQ291bnRlci50cyIsImNkcDovLy9DRFAvVG9vbHMvSW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0FxQ1o7QUFyQ0QsV0FBVSxHQUFHO0lBRVQ7OztPQUdHO0lBQ0gsSUFBWSxnQkFHWDtJQUhELFdBQVksZ0JBQWdCO1FBQ3hCLDZGQUEyQjtRQUMzQixpREFBWSxDQUFDLEdBQUcsaUNBQTZCO0lBQ2pELENBQUMsRUFIVyxnQkFBZ0IsR0FBaEIsb0JBQWdCLEtBQWhCLG9CQUFnQixRQUczQjtJQUVELHVFQUF1RTtJQUN2RSw0QkFBNEI7SUFFNUIsSUFBTSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7SUFFL0I7OztPQUdHO0lBQ0gsSUFBSyxlQUdKO0lBSEQsV0FBSyxlQUFlO1FBQ2hCLCtEQUFlO1FBQ2YsMENBQWMsQ0FBQyxHQUFHLG1CQUFtQjtJQUN6QyxDQUFDLEVBSEksZUFBZSxLQUFmLGVBQWUsUUFHbkI7SUFFRCxvQ0FBb0M7SUFDcEM7OztPQUdHO0lBQ0gsSUFBWSxXQUtYO0lBTEQsV0FBWSxXQUFXO1FBQ25CLDJGQUF1QztRQUN2QywrREFBc0Msc0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxFQUFFLG9CQUFvQixDQUFDO1FBQ3pJLDJEQUFzQyxzQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsR0FBRyxD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QUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZGLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQztnQkFDL0MsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDSixVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7Z0JBQy9DLENBQUM7Z0JBRUQsTUFBTSxDQUFDLEVBQUUsUUFBUSxZQUFFLFVBQVUsY0FBRSxDQUFDO1lBQ3BDLENBQUM7WUFDTCxzQkFBQztRQUFELENBQUM7UUF0RFkscUJBQWUsa0JBc0QzQjtJQUNMLENBQUMsRUFsRmEsS0FBSyxHQUFMLFNBQUssS0FBTCxTQUFLLFFBa0ZsQjtBQUFELENBQUMsRUFsRlMsR0FBRyxLQUFILEdBQUcsUUFrRloiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgQ0RQIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbnVtICBSRVNVTFRfQ09ERV9CQVNFXHJcbiAgICAgKiBAYnJpZWYg44Oq44K244Or44OI44Kz44O844OJ44Gu44Kq44OV44K744OD44OI5YCkXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFX0JBU0Uge1xyXG4gICAgICAgIENEUF9UT09MU19ERUNMQVJFUkFUSU9OID0gMCwgICAgLy8gVFMyNDMyIOWvvuetllxyXG4gICAgICAgIENEUF9UT09MUyA9IDQgKiBfTU9EVUxFX1JFU1VMVF9DT0RFX1JBTkdFX0NEUCxcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gbW9kdWxlIGVycm9yIGRlY2xhcmF0aW9uOlxyXG5cclxuICAgIGNvbnN0IEZVTkNUSU9OX0NPREVfUkFOR0UgPSAxMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbnVtICBMT0NBTF9DT0RFX0JBU0VcclxuICAgICAqIEBicmllZiBjZHAudG9vbHMg5YaF44Gu44Ot44O844Kr44Or44Kz44O844OJ44Kq44OV44K744OD44OI5YCkXHJcbiAgICAgKi9cclxuICAgIGVudW0gTE9DQUxfQ09ERV9CQVNFIHtcclxuICAgICAgICBGVU5DVElPTlMgICA9IDAsXHJcbiAgICAgICAgQkxPQiAgICAgICAgPSAxICogRlVOQ1RJT05fQ09ERV9SQU5HRSxcclxuICAgIH1cclxuXHJcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIFJFU1VMVF9DT0RFXHJcbiAgICAgKiBAYnJpZWYgY2RwLnRvb2xzIOOBruOCqOODqeODvOOCs+ODvOODieWumue+qVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZW51bSBSRVNVTFRfQ09ERSB7XHJcbiAgICAgICAgRVJST1JfQ0RQX1RPT0xTX0RFQ0xBUkFUSU9OICAgICAgICAgPSAwLCAvLyBUUzI0MzIg5a++562WXHJcbiAgICAgICAgRVJST1JfQ0RQX1RPT0xTX0lNQUdFX0xPQURfRkFJTEVEICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfVE9PTFMsIExPQ0FMX0NPREVfQkFTRS5GVU5DVElPTlMgKyAxLCBcImltYWdlIGxvYWQgZmFpbGVkLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfVE9PTFNfSU5WQUxJRF9JTUFHRSAgICAgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9UT09MUywgTE9DQUxfQ09ERV9CQVNFLkZVTkNUSU9OUyArIDIsIFwiaW52YWxpZCBpbWFnZS5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX1RPT0xTX0ZJTEVfUkVBREVSX0VSUk9SICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfVE9PTFMsIExPQ0FMX0NPREVfQkFTRS5CTE9CICsgMSwgXCJGaWxlUmVhZGVyIG1ldGhvZCBmYWlsZWQuXCIpLFxyXG4gICAgfVxyXG4gICAgLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBpbXBvcnQgUHJvbWlzZSA9IENEUC5Qcm9taXNlO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5CaW5hcnldIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIEJpbmFyeVxyXG4gICAgICogQGJyaWVmIOODkOOCpOODiuODquODpuODvOODhuOCo+ODquODhuOCo1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgQmluYXJ5IHtcclxuXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBjb25zdHJ1Y3RvclxyXG4gICAgICAgIHByaXZhdGUgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIC8vIG5vb3BcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldCBCbG9iQnVpbGRlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQG9ic29sZXRlXHJcbiAgICAgICAgICogQHJldHVybiB7YW55fSBCbG9iQnVpbGRlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGdldEJsb2JCdWlsZGVyKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWwuQmxvYkJ1aWxkZXIgfHwgZ2xvYmFsLldlYktpdEJsb2JCdWlsZGVyIHx8IGdsb2JhbC5Nb3pCbG9iQnVpbGRlciB8fCBnbG9iYWwuTVNCbG9iQnVpbGRlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCqOODqeODvOaDheWgseeUn+aIkCBmcm9tIERPTUVycm9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcmVzdWx0Q29kZSBbaW5dIFJFU1VMVF9DT0RFIOOCkuaMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSBjYXVzZSAgICAgIFtpbl0g5LiL5L2N44GuIERPTSDjgqjjg6njg7zjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gW3RhZ10gICAgICBbaW5dIFRBRyDjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gW21lc3NhZ2VdICBbaW5dIOODoeODg+OCu+ODvOOCuOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIOOCqOODqeODvOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG1ha2VFcnJvckluZm9Gcm9tRE9NRXJyb3IocmVzdWx0Q29kZTogUkVTVUxUX0NPREUsIGNhdXNlOiBET01FcnJvciwgdGFnPzogc3RyaW5nLCBtZXNzYWdlPzogc3RyaW5nKTogRXJyb3JJbmZvIHtcclxuICAgICAgICAgICAgbGV0IF9jYXVzZTogRXJyb3I7XHJcbiAgICAgICAgICAgIGlmIChjYXVzZSkge1xyXG4gICAgICAgICAgICAgICAgX2NhdXNlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IGNhdXNlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogY2F1c2UubmFtZSwgICAgLy8gRE9NRXJyb3IubWVzc2FnZSDjgYzmnKrjgrXjg53jg7zjg4hcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG1ha2VFcnJvckluZm8ocmVzdWx0Q29kZSwgdGFnLCBtZXNzYWdlLCBfY2F1c2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0IEJsb2JCdWlsZGVyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAb2Jzb2xldGVcclxuICAgICAgICAgKiBAcmV0dXJuIOani+eviea4iOOBvyBCbG9iIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbmV3QmxvYihibG9iUGFydHM/OiBhbnlbXSwgb3B0aW9ucz86IEJsb2JQcm9wZXJ0eUJhZyk6IEJsb2Ige1xyXG4gICAgICAgICAgICBpZiAoZ2xvYmFsLkJsb2IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgZ2xvYmFsLkJsb2IoYmxvYlBhcnRzLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHVuZGVyIEFuZHJvaWQgNC40IEtpdEthdFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgICAgICAgICBjb25zdCBibG9iQnVpbGRlck9iamVjdDogYW55ID0gQmluYXJ5LmdldEJsb2JCdWlsZGVyKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBibG9iQnVpbGRlcjogYW55ID0gbmV3IGJsb2JCdWlsZGVyT2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXJ0cyA9IChibG9iUGFydHMgaW5zdGFuY2VvZiBBcnJheSkgPyBibG9iUGFydHNbMF0gOiBibG9iUGFydHM7XHJcbiAgICAgICAgICAgICAgICBibG9iQnVpbGRlci5hcHBlbmQocGFydHMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGJsb2JCdWlsZGVyLmdldEJsb2Iob3B0aW9ucy50eXBlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVVJMIE9iamVjdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQG9ic29sZXRlXHJcbiAgICAgICAgICogQHJldHVybiB7YW55fSBVUkwgT2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBibG9iVVJMOiBVUkwgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2xvYmFsLlVSTCB8fCBnbG9iYWwud2Via2l0VVJMO1xyXG4gICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFycmF5QnVmZmVyIHRvIEJsb2JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBidWYgW2luXSBBcnJheUJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICogQHBhcmFtIG1pbWVUeXBlIFtpbl0gTWltZVR5cGUgb2YgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm5zIEJsb2IgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYXJyYXlCdWZmZXJUb0Jsb2IoYnVmOiBBcnJheUJ1ZmZlciwgbWltZVR5cGU6IHN0cmluZyk6IEJsb2Ige1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5Lm5ld0Jsb2IoW2J1Zl0sIHsgdHlwZTogbWltZVR5cGUgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCYXNlNjQgc3RyaW5nIHRvIEJsb2JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBiYXNlNjQge3N0cmluZ30gW2luXSBCYXNlNjQgc3RyaW5nIGRhdGFcclxuICAgICAgICAgKiBAcGFyYW0gbWltZVR5cGUge3N0cmluZ30gW2luXSBNaW1lVHlwZSBvZiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7QmxvYn0gQmxvYiBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBiYXNlNjRUb0Jsb2IoYmFzZTY0OiBzdHJpbmcsIG1pbWVUeXBlOiBzdHJpbmcpOiBCbG9iIHtcclxuICAgICAgICAgICAgcmV0dXJuIEJpbmFyeS5uZXdCbG9iKFtCaW5hcnkuYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQpXSwgeyB0eXBlOiBtaW1lVHlwZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRhdGEtdXJsIOW9ouW8j+eUu+WDj+OBi+OCiSBCbG9iIOOCquODluOCuOOCp+OCr+ODiOOBuOWkieaPm1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBkYXRhVXJsICAgIFtpbl0gZGF0YSB1cmxcclxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IFttaW1lVHlwZV0gW2luXSBtaW1lIHR5cGUg44KS5oyH5a6aLiDml6Llrprjgafjga8gXCJpbWFnZS9wbmdcIlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jsb2J9IEJsb2Ig44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkYXRhVXJsVG9CbG9iKGRhdGFVcmw6IHN0cmluZywgbWltZVR5cGU6IHN0cmluZyA9IFwiaW1hZ2UvcG5nXCIpOiBCbG9iIHtcclxuICAgICAgICAgICAgY29uc3QgYmFzZTY0ID0gZGF0YVVybC5zcGxpdChcIixcIilbMV07XHJcbiAgICAgICAgICAgIHJldHVybiBCaW5hcnkuYmFzZTY0VG9CbG9iKGJhc2U2NCwgbWltZVR5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmFzZTY0IHN0cmluZyB0byBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJhc2U2NCB7c3RyaW5nfSBbaW5dIEJhc2U2NCBzdHJpbmcgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5QnVmZmVyfSBBcnJheUJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBiYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NDogc3RyaW5nKTogQXJyYXlCdWZmZXIge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IHdpbmRvdy5hdG9iKGJhc2U2NCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGJ5dGVzLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYnl0ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFbaV0gPSBieXRlcy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheUJ1ZmZlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJhc2U2NCBzdHJpbmcgdG8gVWludDhBcnJheVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJhc2U2NCB7c3RyaW5nfSBbaW5dIEJhc2U2NCBzdHJpbmcgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge1VpbnQ4QXJyYXl9IFVpbnQ4QXJyYXkgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYmFzZTY0VG9VaW50OEFycmF5KGVuY29kZWQ6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IHdpbmRvdy5hdG9iKGVuY29kZWQpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBieXRlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVtpXSA9IGJ5dGVzLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcnJheUJ1ZmZlciB0byBiYXNlNjQgc3RyaW5nXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYXJyYXlCdWZmZXIge0FycmF5QnVmZmVyfSBbaW5dIEFycmF5QnVmZmVyIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJhc2U2NCBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBhcnJheUJ1ZmZlclRvQmFzZTY0KGFycmF5QnVmZmVyOiBBcnJheUJ1ZmZlcik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xyXG4gICAgICAgICAgICByZXR1cm4gQmluYXJ5LnVpbnQ4QXJyYXlUb0Jhc2U2NChieXRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVaW50OEFycmF5IHRvIGJhc2U2NCBzdHJpbmdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBieXRlcyB7VWludDhBcnJheX0gW2luXSBVaW50OEFycmF5IGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJhc2U2NCBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB1aW50OEFycmF5VG9CYXNlNjQoYnl0ZXM6IFVpbnQ4QXJyYXkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgZGF0YTogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBieXRlcy5ieXRlTGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5idG9hKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7QmxvYn0gYmxvYiBbaW5dIGJsb2IgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0NEUC5JUHJvbWlzZTxBcnJheUJ1ZmZlcj59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYjogQmxvYik6IElQcm9taXNlPEFycmF5QnVmZmVyPiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmNlbCA9ICgpID0+IHJlYWRlci5hYm9ydCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoQmluYXJ5Lm1ha2VFcnJvckluZm9Gcm9tRE9NRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19GSUxFX1JFQURFUl9FUlJPUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLmVycm9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiRmlsZVJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcigpIGZhaWxlZC5cIlxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKTtcclxuICAgICAgICAgICAgfSwgY2FuY2VsKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyBVaW50OEFycmF5XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtCbG9ifSBibG9iIFtpbl0gYmxvYiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7Q0RQLklQcm9taXNlPFVpbnQ4QXJyYXk+fSBwcm9taXNlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVhZEJsb2JBc1VpbnQ4QXJyYXkoYmxvYjogQmxvYik6IElQcm9taXNlPFVpbnQ4QXJyYXk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QsIGRlcGVuZE9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRPbihCaW5hcnkucmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IEFycmF5QnVmZmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IFVpbnQ4QXJyYXkocmVzdWx0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yOiBFcnJvckluZm8pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgdGV4dCBzdHJpbmdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8VWludDhBcnJheT59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkQmxvYkFzVGV4dChibG9iOiBCbG9iLCBlbmNvZGU6IHN0cmluZyA9IFwidXRmLThcIik6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICBjb25zdCBjYW5jZWwgPSAoKSA9PiByZWFkZXIuYWJvcnQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEJpbmFyeS5tYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkZpbGVSZWFkZXIucmVhZEFzVGV4dCgpIGZhaWxlZC5cIlxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IsIGVuY29kZSk7XHJcbiAgICAgICAgICAgIH0sIGNhbmNlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgRGF0YSBVUkxcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8c3RyaW5nPn0gcHJvbWlzZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlYWRCbG9iQXNEYXRhVVJMKGJsb2I6IEJsb2IpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4gcmVhZGVyLmFib3J0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChCaW5hcnkubWFrZUVycm9ySW5mb0Zyb21ET01FcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0ZJTEVfUkVBREVSX0VSUk9SLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIuZXJyb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJGaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoKSBmYWlsZWQuXCJcclxuICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzRGF0YVVSTChibG9iKTtcclxuICAgICAgICAgICAgfSwgY2FuY2VsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIEBmaWxlICBCaW5hcnlUcmFuc3BvcnQudHNcclxuICogQGJyaWVmIGpRdWVyeSBhamF4IHRyYW5zcG9ydCBmb3IgbWFraW5nIGJpbmFyeSBkYXRhIHR5cGUgcmVxdWVzdHMuXHJcbiAqXHJcbiAqICAgICAgICBvcmlnaW5hbDogaHR0cHM6Ly9naXRodWIuY29tL2hlbnJ5YS9qcy1qcXVlcnkvYmxvYi9tYXN0ZXIvQmluYXJ5VHJhbnNwb3J0L2pxdWVyeS5iaW5hcnl0cmFuc3BvcnQuanNcclxuICogICAgICAgIGF1dGhvcjogICBIZW5yeSBBbGd1cyA8aGVucnlhbGd1c0BnbWFpbC5jb20+XHJcbiAqL1xyXG5uYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuICAgIC8vIFN1cHBvcnQgZmlsZSBwcm90b2NvbC4gKGFzIHNhbWUgYXMgb2ZmaWNpYWwgd2F5KVxyXG4gICAgY29uc3QgeGhyU3VjY2Vzc1N0YXR1cyA9IHtcclxuICAgICAgICAwOiAyMDAsXHJcbiAgICAgICAgMTIyMzogMjA0XHJcbiAgICB9O1xyXG5cclxuICAgICQuYWpheFRyYW5zcG9ydChcIitiaW5hcnlcIiwgKG9wdGlvbnM6IEpRdWVyeS5BamF4U2V0dGluZ3MsIG9yaWdpbmFsT3B0aW9uczogSlF1ZXJ5LkFqYXhTZXR0aW5ncywganFYSFI6IEpRdWVyeVhIUikgPT4ge1xyXG4gICAgICAgIGlmIChnbG9iYWwuRm9ybURhdGEgJiZcclxuICAgICAgICAgICAgKChvcHRpb25zLmRhdGFUeXBlICYmIChvcHRpb25zLmRhdGFUeXBlID09PSBcImJpbmFyeVwiKSkgfHxcclxuICAgICAgICAgICAgKG9wdGlvbnMuZGF0YSAmJiAoKGdsb2JhbC5BcnJheUJ1ZmZlciAmJiBvcHRpb25zLmRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikgfHxcclxuICAgICAgICAgICAgKGdsb2JhbC5CbG9iICYmIG9wdGlvbnMuZGF0YSBpbnN0YW5jZW9mIGdsb2JhbC5CbG9iKSkpKSkge1xyXG4gICAgICAgICAgICBsZXQgYWJvcnRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNlbmQ6IGZ1bmN0aW9uIChoZWFkZXJzOiBKUXVlcnkuUGxhaW5PYmplY3QsIGNhbGxiYWNrOiBKUXVlcnkuVHJhbnNwb3J0LlN1Y2Nlc3NDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldHVwIGFsbCB2YXJpYWJsZXNcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1cmwgPSBvcHRpb25zLnVybDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0eXBlID0gb3B0aW9ucy50eXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFzeW5jID0gb3B0aW9ucy5hc3luYyB8fCB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBibG9iIG9yIGFycmF5YnVmZmVyLiBEZWZhdWx0IGlzIGJsb2JcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhVHlwZSA9ICg8YW55Pm9wdGlvbnMpLnJlc3BvbnNlVHlwZSB8fCBcImJsb2JcIjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gb3B0aW9ucy5kYXRhIHx8IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlcm5hbWUgPSBvcHRpb25zLnVzZXJuYW1lIHx8IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFzc3dvcmQgPSBvcHRpb25zLnBhc3N3b3JkIHx8IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IF9jYWxsYmFjazogSlF1ZXJ5LlRyYW5zcG9ydC5TdWNjZXNzQ2FsbGJhY2sgPSBjYWxsYmFjayB8fCAoKCkgPT4geyAvKiBub29wICovIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBzdWNjZWVkZWQgaGFuZGxlclxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9kYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhW29wdGlvbnMuZGF0YVR5cGVdID0geGhyLnJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2FsbGJhY2soXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHJTdWNjZXNzU3RhdHVzW3hoci5zdGF0dXNdIHx8IHhoci5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SlF1ZXJ5LkFqYXguVGV4dFN0YXR1cz54aHIuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVycm9yIGhhbmRsZXJcclxuICAgICAgICAgICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX2RhdGEgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGFbb3B0aW9ucy5kYXRhVHlwZV0gPSB4aHIucmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgY2FsbGJhY2sgYW5kIHNlbmQgZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2FsbGJhY2soXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEpRdWVyeS5BamF4LlRleHRTdGF0dXM+eGhyLnN0YXR1c1RleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBhYm9ydCBoYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJhYm9ydFwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9kYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhW29wdGlvbnMuZGF0YVR5cGVdID0geGhyLnJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIGNhbGxiYWNrIGFuZCBzZW5kIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxKUXVlcnkuQWpheC5UZXh0U3RhdHVzPnhoci5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWJvcnQgY2FsbGJhY2tcclxuICAgICAgICAgICAgICAgICAgICBhYm9ydENhbGxiYWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB4aHIuYWJvcnQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB4aHIub3Blbih0eXBlLCB1cmwsIGFzeW5jLCB1c2VybmFtZSwgcGFzc3dvcmQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXR1cCBjdXN0b20gaGVhZGVyc1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBoZWFkZXJzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KGkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihpLCBoZWFkZXJzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IGRhdGFUeXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIHhoci5zZW5kKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGFib3J0OiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFib3J0Q2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWJvcnRDYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSB0eXBlcz1cImpxdWVyeVwiIC8+XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBpbXBvcnQgUHJvbWlzZSA9IENEUC5Qcm9taXNlO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5GdW5jdGlvbnNdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWF0aC5hYnMg44KI44KK44KC6auY6YCf44GqIGFic1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gYWJzKHg6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHggPj0gMCA/IHggOiAteDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGgubWF4IOOCiOOCiuOCgumrmOmAn+OBqiBtYXhcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1heChsaHM6IG51bWJlciwgcmhzOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBsaHMgPj0gcmhzID8gbGhzIDogcmhzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWF0aC5taW4g44KI44KK44KC6auY6YCf44GqIG1pblxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWluKGxoczogbnVtYmVyLCByaHM6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGxocyA8PSByaHMgPyBsaHMgOiByaHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmlbDlgKTjgpIgMCDoqbDjgoHjgZfjgabmloflrZfliJfjgpLnlJ/miJBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHRvWmVyb1BhZGRpbmcobm86IG51bWJlciwgbGltaXQ6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgbGV0IHNpZ25lZCA9IFwiXCI7XHJcbiAgICAgICAgbm8gPSBOdW1iZXIobm8pO1xyXG5cclxuICAgICAgICBpZiAoaXNOYU4obm8pIHx8IGlzTmFOKGxpbWl0KSB8fCBsaW1pdCA8PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG5vIDwgMCkge1xyXG4gICAgICAgICAgICBubyA9IFRvb2xzLmFicyhubyk7XHJcbiAgICAgICAgICAgIHNpZ25lZCA9IFwiLVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHNpZ25lZCArIChBcnJheShsaW1pdCkuam9pbihcIjBcIikgKyBubykuc2xpY2UoLWxpbWl0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaWh+Wtl+WIl+OBruODkOOCpOODiOaVsOOCkuOCq+OCpuODs+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0U3RyaW5nU2l6ZShzcmM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIChCaW5hcnkubmV3QmxvYihbc3JjXSwgeyB0eXBlOiBcInRleHQvcGxhaW5cIiB9KSkuc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaWh+Wtl+WIl+OCkuODkOOCpOODiOWItumZkOOBl+OBpuWIhuWJslxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gdG9TdHJpbmdDaHVua3Moc3JjOiBzdHJpbmcsIGxpbWl0OiBudW1iZXIpOiBzdHJpbmdbXSB7XHJcblxyXG4gICAgICAgIGNvbnN0IGNodW5rcyA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdCBzZXRDaHVuayA9IChpbnB1dDogc3RyaW5nKTogc3RyaW5nW10gPT4ge1xyXG4gICAgICAgICAgICBpZiAobGltaXQgPCBnZXRTdHJpbmdTaXplKGlucHV0KSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGFsZiA9IE1hdGguZmxvb3IoaW5wdXQubGVuZ3RoIC8gMik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsaHMgPSBpbnB1dC5zbGljZSgwLCBoYWxmKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHJocyA9IGlucHV0LnNsaWNlKGhhbGYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFtsaHMsIHJoc107XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjaHVua3MucHVzaChpbnB1dCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBtYWtlQ2h1bmsgPSAod29yazogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZhaWx1cmVzID0gc2V0Q2h1bmsod29yayk7XHJcbiAgICAgICAgICAgIHdoaWxlICgwIDwgZmFpbHVyZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBtYWtlQ2h1bmsoZmFpbHVyZXMuc2hpZnQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBtYWtlQ2h1bmsoc3JjKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNodW5rcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWkmumHjee2meaJv+OBruOBn+OCgeOBruWun+ihjOaZgue2meaJv+mWouaVsFxyXG4gICAgICpcclxuICAgICAqIFN1YiBDbGFzcyDlgJnoo5zjgqrjg5bjgrjjgqfjgq/jg4jjgavlr77jgZfjgaYgU3VwZXIgQ2xhc3Mg5YCZ6KOc44Kq44OW44K444Kn44Kv44OI44KS55u05YmN44GuIFN1cGVyIENsYXNzIOOBqOOBl+OBpuaMv+WFpeOBmeOCi+OAglxyXG4gICAgICogcHJvdG90eXBlIOOBruOBv+OCs+ODlOODvOOBmeOCi+OAglxyXG4gICAgICog44Kk44Oz44K544K/44Oz44K544Oh44Oz44OQ44KS44Kz44OU44O844GX44Gf44GE5aC05ZCI44CBU3VwZXIgQ2xhc3Mg44GM55aR5Ly844Kz44Oz44K544OI44Op44Kv44K/44KS5o+Q5L6b44GZ44KL5b+F6KaB44GM44GC44KL44CCXHJcbiAgICAgKiDoqbPntLDjga8gY2RwLnRvb2xzLkZ1bmN0aW9ucy5zcGVjLnRzIOOCkuWPgueFp+OAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzdWJDbGFzcyAgIHtjb25zdHJ1Y3Rvcn0gW2luXSDjgqrjg5bjgrjjgqfjgq/jg4jjga4gY29uc3RydWN0b3Ig44KS5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gc3VwZXJDbGFzcyB7Y29uc3RydWN0b3J9IFtpbl0g44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5oZXJpdChzdWJDbGFzczogYW55LCBzdXBlckNsYXNzOiBhbnkpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBfcHJvdG90eXBlID0gc3ViQ2xhc3MucHJvdG90eXBlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBfaW5oZXJpdCgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBfaW5oZXJpdC5wcm90b3R5cGUgPSBzdXBlckNsYXNzLnByb3RvdHlwZTtcclxuICAgICAgICBzdWJDbGFzcy5wcm90b3R5cGUgPSBuZXcgX2luaGVyaXQoKTtcclxuXHJcbiAgICAgICAgJC5leHRlbmQoc3ViQ2xhc3MucHJvdG90eXBlLCBfcHJvdG90eXBlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1peGluIOmWouaVsFxyXG4gICAgICpcclxuICAgICAqIFR5cGVTY3JpcHQgT2ZmaWNpYWwgU2l0ZSDjgavovInjgaPjgabjgYTjgosgbWl4aW4g6Zai5pWwXHJcbiAgICAgKiBodHRwOi8vd3d3LnR5cGVzY3JpcHRsYW5nLm9yZy9IYW5kYm9vayNtaXhpbnNcclxuICAgICAqIOaXouOBq+Wumue+qeOBleOCjOOBpuOBhOOCi+OCquODluOCuOOCp+OCr+ODiOOBi+OCieOAgeaWsOimj+OBq+OCquODluOCuOOCp+OCr+ODiOOCkuWQiOaIkOOBmeOCi+OAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZXJpdmVkIHtjb25zdHJ1Y3Rvcn0gICAgW2luXSDlkIjmiJDjgZXjgozjgovjgqrjg5bjgrjjgqfjgq/jg4jjga4gY29uc3RydWN0b3Ig44KS5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gYmFzZXMgICB7Y29uc3RydWN0b3IuLi59IFtpbl0g5ZCI5oiQ5YWD44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumiAo5Y+v5aSJ5byV5pWwKVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWl4aW4oZGVyaXZlZDogYW55LCAuLi5iYXNlczogYW55W10pOiB2b2lkIHtcclxuICAgICAgICBiYXNlcy5mb3JFYWNoKChiYXNlKSA9PiB7XHJcbiAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2UucHJvdG90eXBlKS5mb3JFYWNoKG5hbWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVyaXZlZC5wcm90b3R5cGVbbmFtZV0gPSBiYXNlLnByb3RvdHlwZVtuYW1lXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gY29ycmVjdGx5IHNldCB1cCB0aGUgcHJvdG90eXBlIGNoYWluLCBmb3Igc3ViY2xhc3Nlcy5cclxuICAgICAqIFRoZSBmdW5jdGlvbiBiZWhhdmlvciBpcyBzYW1lIGFzIGV4dGVuZCgpIGZ1bmN0aW9uIG9mIEJhY2tib25lLmpzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwcm90b1Byb3BzICB7T2JqZWN0fSBbaW5dIHNldCBwcm90b3R5cGUgcHJvcGVydGllcyBhcyBvYmplY3QuXHJcbiAgICAgKiBAcGFyYW0gc3RhdGljUHJvcHMge09iamVjdH0gW2luXSBzZXQgc3RhdGljIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBzdWJjbGFzcyBjb25zdHJ1Y3Rvci5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICog44Kv44Op44K557aZ5om/44Gu44Gf44KB44Gu44OY44Or44OR44O86Zai5pWwXHJcbiAgICAgKiBCYWNrYm9uZS5qcyBleHRlbmQoKSDplqLmlbDjgajlkIznrYlcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcHJvdG9Qcm9wcyAge09iamVjdH0gW2luXSBwcm90b3R5cGUgcHJvcGVydGllcyDjgpLjgqrjg5bjgrjjgqfjgq/jg4jjgafmjIflrppcclxuICAgICAqIEBwYXJhbSBzdGF0aWNQcm9wcyB7T2JqZWN0fSBbaW5dIHN0YXRpYyBwcm9wZXJ0aWVzIOOCkuOCquODluOCuOOCp+OCr+ODiOOBp+aMh+WumlxyXG4gICAgICogQHJldHVybiB7T2JqZWN0fSDjgrXjg5bjgq/jg6njgrnjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGV4dGVuZChwcm90b1Byb3BzOiBvYmplY3QsIHN0YXRpY1Byb3BzPzogb2JqZWN0KTogb2JqZWN0IHtcclxuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzO1xyXG4gICAgICAgIGxldCBjaGlsZDtcclxuXHJcbiAgICAgICAgaWYgKHByb3RvUHJvcHMgJiYgcHJvdG9Qcm9wcy5oYXNPd25Qcm9wZXJ0eShcImNvbnN0cnVjdG9yXCIpKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gcHJvdG9Qcm9wcy5jb25zdHJ1Y3RvcjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjaGlsZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuZXh0ZW5kKGNoaWxkLCBwYXJlbnQsIHN0YXRpY1Byb3BzKTtcclxuXHJcbiAgICAgICAgY29uc3QgU3Vycm9nYXRlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBTdXJyb2dhdGUucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTtcclxuICAgICAgICBjaGlsZC5wcm90b3R5cGUgPSBuZXcgU3Vycm9nYXRlO1xyXG5cclxuICAgICAgICBpZiAocHJvdG9Qcm9wcykge1xyXG4gICAgICAgICAgICAkLmV4dGVuZChjaGlsZC5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNoaWxkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRFBJIOWPluW+l1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0RGV2aWNlUGl4Y2VsUmF0aW8oKTogbnVtYmVyIHtcclxuICAgICAgICBsZXQgbWVkaWFRdWVyeTtcclxuICAgICAgICBjb25zdCBpc19maXJlZm94ID0gbmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoXCJmaXJlZm94XCIpID4gLTE7XHJcbiAgICAgICAgaWYgKG51bGwgIT0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gJiYgIWlzX2ZpcmVmb3gpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgIH0gZWxzZSBpZiAod2luZG93Lm1hdGNoTWVkaWEpIHtcclxuICAgICAgICAgICAgbWVkaWFRdWVyeSA9XHJcbiAgICAgICAgICAgICAgICBcIigtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuNSksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDMvMiksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLXJlc29sdXRpb246IDEuNWRwcHgpXCI7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5KS5tYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMS41O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1lZGlhUXVlcnkgPVxyXG4gICAgICAgICAgICAgICAgXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDIpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIvMSksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLXJlc29sdXRpb246IDJkcHB4KVwiO1xyXG4gICAgICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWVkaWFRdWVyeSA9XHJcbiAgICAgICAgICAgICAgICBcIigtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDAuNzUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMC43NSksXFxcclxuICAgICAgICAgICAgICAgICAgICAoLW8tbWluLWRldmljZS1waXhlbC1yYXRpbzogMy80KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tcmVzb2x1dGlvbjogMC43NWRwcHgpXCI7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5KS5tYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMC43O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIENhbnZhcyBlbGVtZW50IOOBruOCreODo+ODg+OCt+ODpVxyXG4gICAgbGV0IHNfY2FudmFzRmFjdG9yeTogSFRNTENhbnZhc0VsZW1lbnQ7XHJcblxyXG4gICAgLy8g44Kt44Oj44OD44K344Ol5riI44G/44GuIENhbnZhcyDjgpLlj5blvpfjgZnjgotcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRDYW52YXMoKTogSFRNTENhbnZhc0VsZW1lbnQge1xyXG4gICAgICAgIHNfY2FudmFzRmFjdG9yeSA9IHNfY2FudmFzRmFjdG9yeSB8fCBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xyXG4gICAgICAgIHJldHVybiA8SFRNTENhbnZhc0VsZW1lbnQ+c19jYW52YXNGYWN0b3J5LmNsb25lTm9kZShmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnlLvlg4/jg6rjgr3jg7zjgrnjga7jg63jg7zjg4nlrozkuobjgpLkv53oqLxcclxuICAgICAqIOODluODqeOCpuOCtuaXouWumuOBruODl+ODreOCsOODrOODg+OCt+ODluODreODvOODieOCkui1sOOCieOBm+OBquOBhOOBn+OCgS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHVybCBbaW5dIHVybCAoZGF0YS11cmwpXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvbWlzZTxzdHJpbmc+fSDooajnpLrlj6/og73jgaogdXJsXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBlbnN1cmVJbWFnZUxvYWRlZCh1cmw6IHN0cmluZyk6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGltZykge1xyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IFwiXCI7ICAgLy8g6Kqt44G/6L6844G/5YGc5q2iXHJcbiAgICAgICAgICAgICAgICBpbWcgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUodXJsKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5vbmVycm9yID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG1ha2VFcnJvckluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0lNQUdFX0xPQURfRkFJTEVELFxyXG4gICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICBcImltYWdlIGxvYWQgZmFpbGVkLiBbdXJsOiBcIiArIHVybCArIFwiXVwiXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSB1cmw7XHJcblxyXG4gICAgICAgIH0sIGRlc3Ryb3kpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55S75YOP44Gu44Oq44K144Kk44K6XHJcbiAgICAgKiDmjIflrprjgZfjgZ/plbfovrrjga7plbfjgZXjgavjgqLjgrnjg5rjgq/jg4jmr5TjgpLntq3mjIHjgZfjgabjg6rjgrXjgqTjgrrjgpLooYzjgYZcclxuICAgICAqIGxvbmdTaWRlTGVuZ3RoIOOCiOOCiuWwj+OBleOBquWgtOWQiOOBr+OCquODquOCuOODiuODq+OCteOCpOOCuuOBpyBkYXRhLXVybCDjgpLov5TljbTjgZnjgotcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNyYyAgICAgICAgICAgIFtpbl0gaW1hZ2Ug44Gr5oyH5a6a44GZ44KL44K944O844K5XHJcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGxvbmdTaWRlTGVuZ3RoIFtpbl0g44Oq44K144Kk44K644Gr5L2/55So44GZ44KL6ZW36L6644Gu5pyA5aSn5YCk44KS5oyH5a6aXHJcbiAgICAgKiBAcmV0dXJuIHtJUHJvbWlzZTxzdHJpbmc+fSBiYXNlNjQgZGF0YSB1cmwg44KS6L+U5Y20XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiByZXNpemVJbWFnZShzcmM6IHN0cmluZywgbG9uZ1NpZGVMZW5ndGg6IG51bWJlcik6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICAgICAgY29uc3QgZGVzdHJveSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGltZykge1xyXG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IFwiXCI7ICAgLy8g6Kqt44G/6L6844G/5YGc5q2iXHJcbiAgICAgICAgICAgICAgICBpbWcgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaW1nLm9ubG9hZCA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IGdldENhbnZhcygpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaWggPSBpbWcuaGVpZ2h0LCBpdyA9IGltZy53aWR0aCwgaWEgPSBpaCAvIGl3O1xyXG4gICAgICAgICAgICAgICAgbGV0IGN3OiBudW1iZXIsIGNoOiBudW1iZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGl3ID09PSAwIHx8IDAgPT09IGlhKSB7IC8vIOW/teOBruOBn+OCgeS4jeato+OBqueUu+WDj+OCkuOCrOODvOODiVxyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfSU5WQUxJRF9JTUFHRSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcImludmFsaWQgaW1hZ2UuIFtzcmM6IFwiICsgc3JjICsgXCJdXCJcclxuICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxvbmdTaWRlTGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ1NpZGVMZW5ndGggPSAoaWEgPCAxKSA/IGl3IDogaWg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpYSA8IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3cgPSAobG9uZ1NpZGVMZW5ndGggPCBpdykgPyBsb25nU2lkZUxlbmd0aCA6IGl3O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaCA9IE1hdGgucm91bmQoY3cgKiBpYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSAobG9uZ1NpZGVMZW5ndGggPCBpaCkgPyBsb25nU2lkZUxlbmd0aCA6IGloO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdyA9IE1hdGgucm91bmQoY2ggLyBpYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjYW52YXMud2lkdGggPSBjdztcclxuICAgICAgICAgICAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmdldENvbnRleHQoXCIyZFwiKS5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBjdywgY2gpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGNhbnZhcy50b0RhdGFVUkwoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaW1nLm9uZXJyb3IgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfSU1BR0VfTE9BRF9GQUlMRUQsXHJcbiAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UgbG9hZCBmYWlsZWQuIFtzcmM6IFwiICsgc3JjICsgXCJdXCJcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaW1nLnNyYyA9IHNyYztcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5EYXRlVGltZV0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgRGF0ZVRpbWVcclxuICAgICAqIEBicmllZiDmmYLliLvmk43kvZzjga7jg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIERhdGVUaW1lIHtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDln7rngrnjgajjgarjgovml6Xku5jjgYvjgonjgIFu5pel5b6M44CBbuaXpeWJjeOCkueul+WHulxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJhc2UgICAge0RhdGV9ICAgW2luXSDln7rmupbml6VcclxuICAgICAgICAgKiBAcGFyYW0gYWRkRGF5cyB7TnVtYmVyfSBbaW5dIOWKoOeul+aXpS4g44Oe44Kk44OK44K55oyH5a6a44GnbuaXpeWJjeOCguioreWumuWPr+iDvVxyXG4gICAgICAgICAqIEByZXR1cm4ge0RhdGV9IOaXpeS7mOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29tcHV0ZURhdGUoYmFzZTogRGF0ZSwgYWRkRGF5czogbnVtYmVyKTogRGF0ZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGR0ID0gbmV3IERhdGUoYmFzZS5nZXRUaW1lKCkpO1xyXG4gICAgICAgICAgICBjb25zdCBiYXNlU2VjID0gZHQuZ2V0VGltZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBhZGRTZWMgPSBhZGREYXlzICogODY0MDAwMDA7ICAgIC8v5pel5pWwICogMeaXpeOBruODn+ODquenkuaVsFxyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRTZWMgPSBiYXNlU2VjICsgYWRkU2VjO1xyXG4gICAgICAgICAgICBkdC5zZXRUaW1lKHRhcmdldFNlYyk7XHJcbiAgICAgICAgICAgIHJldHVybiBkdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnQgc3RyaW5nIHRvIGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0ZSBzdHJpbmcgZXgpIFlZWVktTU0tRERUSEg6bW06U1MuU1NTXHJcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udmVydElTT1N0cmluZ1RvRGF0ZShkYXRlU3RyaW5nOiBzdHJpbmcpOiBEYXRlIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0ZVRpbWUgPSBkYXRlU3RyaW5nLnNwbGl0KFwiVFwiKSxcclxuICAgICAgICAgICAgICAgIGRhdGVBcnJheSA9IGRhdGVUaW1lWzBdLnNwbGl0KFwiLVwiKTtcclxuICAgICAgICAgICAgbGV0IHRpbWVBcnJheSwgc2VjQXJyYXksIGRhdGVPYmplY3Q7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0ZVRpbWVbMV0pIHtcclxuICAgICAgICAgICAgICAgIHRpbWVBcnJheSA9IGRhdGVUaW1lWzFdLnNwbGl0KFwiOlwiKTtcclxuICAgICAgICAgICAgICAgIHNlY0FycmF5ID0gdGltZUFycmF5WzJdLnNwbGl0KFwiLlwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRpbWVBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZGF0ZU9iamVjdCA9IG5ldyBEYXRlKDxhbnk+ZGF0ZUFycmF5WzBdLCA8YW55PmRhdGVBcnJheVsxXSAtIDEsIDxhbnk+ZGF0ZUFycmF5WzJdLFxyXG4gICAgICAgICAgICAgICAgICAgIDxhbnk+dGltZUFycmF5WzBdLCA8YW55PnRpbWVBcnJheVsxXSwgPGFueT5zZWNBcnJheVswXSwgPGFueT5zZWNBcnJheVsxXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0ZUFycmF5WzJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZU9iamVjdCA9IG5ldyBEYXRlKDxhbnk+ZGF0ZUFycmF5WzBdLCA8YW55PmRhdGVBcnJheVsxXSAtIDEsIDxhbnk+ZGF0ZUFycmF5WzJdKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0ZUFycmF5WzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZU9iamVjdCA9IG5ldyBEYXRlKDxhbnk+ZGF0ZUFycmF5WzBdLCA8YW55PmRhdGVBcnJheVsxXSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRlT2JqZWN0ID0gbmV3IERhdGUoPGFueT5kYXRlQXJyYXlbMF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGF0ZU9iamVjdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqICBDb252ZXJ0IGEgZGF0ZSBvYmplY3QgaW50byBhIHN0cmluZyBpbiBQTU9BUEkgcmVjb3JkZWRfZGF0ZSBmb3JtYXQodGhlIElTTyA4NjAxIEV4dGVuZGVkIEZvcm1hdClcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRlICAge0RhdGV9ICAgW2luXSBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQge1N0cmluZ30gW2luXSB7eWVhciB8IG1vbnRoIHwgZGF0ZSB8IGhvdXIgfCBtaW4gfCBzZWMgfCBtc2VjIH1cclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb252ZXJ0RGF0ZVRvSVNPU3RyaW5nKGRhdGU6IERhdGUsIHRhcmdldDogc3RyaW5nID0gXCJtc2VjXCIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgaXNvRGF0ZVN0cmluZztcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwieWVhclwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1vbnRoXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGF0ZVwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcImhvdXJcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtaW5cIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzZWNcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtc2VjXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVua25vd24gdGFyZ2V0OiBcIiArIHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gXCJtc2VjXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlzb0RhdGVTdHJpbmcgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChcInllYXJcIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXNvRGF0ZVN0cmluZyArPSAoXCItXCIgKyBEYXRlVGltZS5udW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhkYXRlLmdldE1vbnRoKCkgKyAxKSk7XHJcbiAgICAgICAgICAgIGlmIChcIm1vbnRoXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlzb0RhdGVTdHJpbmcgKz0gKFwiLVwiICsgRGF0ZVRpbWUubnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcoZGF0ZS5nZXREYXRlKCkpKTtcclxuICAgICAgICAgICAgaWYgKFwiZGF0ZVwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc29EYXRlU3RyaW5nICs9IChcIlRcIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0SG91cnMoKSkpO1xyXG4gICAgICAgICAgICBpZiAoXCJob3VyXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlzb0RhdGVTdHJpbmcgKz0gKFwiOlwiICsgRGF0ZVRpbWUubnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcoZGF0ZS5nZXRNaW51dGVzKCkpKTtcclxuICAgICAgICAgICAgaWYgKFwibWluXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlzb0RhdGVTdHJpbmcgKz0gKFwiOlwiICsgRGF0ZVRpbWUubnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcoZGF0ZS5nZXRTZWNvbmRzKCkpKTtcclxuICAgICAgICAgICAgaWYgKFwic2VjXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlzb0RhdGVTdHJpbmcgKz0gKFwiLlwiICsgU3RyaW5nKChkYXRlLmdldE1pbGxpc2Vjb25kcygpIC8gMTAwMCkudG9GaXhlZCgzKSkuc2xpY2UoMiwgNSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZztcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IGZpbGUgc3lzdGVtIGNvbXBhdGlibGUgc3RyaW5nIHRvIGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gZGF0ZSBzdHJpbmcgZXgpIHl5eXlfTU1fZGRUSEhfbW1fc3NfU1NTXHJcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udmVydEZpbGVTeXN0ZW1TdHJpbmdUb0RhdGUoZGF0ZVN0cmluZzogc3RyaW5nKTogRGF0ZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGVUaW1lID0gZGF0ZVN0cmluZy5zcGxpdChcIlRcIiksXHJcbiAgICAgICAgICAgICAgICBkYXRlQXJyYXkgPSBkYXRlVGltZVswXS5zcGxpdChcIl9cIik7XHJcbiAgICAgICAgICAgIGxldCB0aW1lQXJyYXksIGRhdGVPYmplY3Q7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGF0ZVRpbWVbMV0pIHtcclxuICAgICAgICAgICAgICAgIHRpbWVBcnJheSA9IGRhdGVUaW1lWzFdLnNwbGl0KFwiX1wiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRpbWVBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgZGF0ZU9iamVjdCA9IG5ldyBEYXRlKDxhbnk+ZGF0ZUFycmF5WzBdLCA8YW55PmRhdGVBcnJheVsxXSAtIDEsIDxhbnk+ZGF0ZUFycmF5WzJdLFxyXG4gICAgICAgICAgICAgICAgICAgIDxhbnk+dGltZUFycmF5WzBdLCA8YW55PnRpbWVBcnJheVsxXSwgPGFueT50aW1lQXJyYXlbMl0sIDxhbnk+dGltZUFycmF5WzNdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRlQXJyYXlbMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRlT2JqZWN0ID0gbmV3IERhdGUoPGFueT5kYXRlQXJyYXlbMF0sIDxhbnk+ZGF0ZUFycmF5WzFdIC0gMSwgPGFueT5kYXRlQXJyYXlbMl0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRlQXJyYXlbMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRlT2JqZWN0ID0gbmV3IERhdGUoPGFueT5kYXRlQXJyYXlbMF0sIDxhbnk+ZGF0ZUFycmF5WzFdIC0gMSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGVPYmplY3QgPSBuZXcgRGF0ZSg8YW55PmRhdGVBcnJheVswXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkYXRlT2JqZWN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogIENvbnZlcnQgYSBkYXRlIG9iamVjdCBpbnRvIGEgc3RyaW5nIGluIGZpbGUgc3lzdGVtIGNvbXBhdGlibGUgZm9ybWF0KHl5eXlfTU1fZGRUSEhfbW1fc3NfU1NTKVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGUgICB7RGF0ZX0gICBbaW5dIGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHRhcmdldCB7U3RyaW5nfSBbaW5dIHt5ZWFyIHwgbW9udGggfCBkYXRlIHwgaG91ciB8IG1pbiB8IHNlYyB8IG1zZWMgfVxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnZlcnREYXRlVG9GaWxlU3lzdGVtU3RyaW5nKGRhdGU6IERhdGUsIHRhcmdldDogc3RyaW5nID0gXCJtc2VjXCIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgZmlsZVN5c3RlbVN0cmluZztcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwieWVhclwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1vbnRoXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiZGF0ZVwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcImhvdXJcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtaW5cIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzZWNcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtc2VjXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVua25vd24gdGFyZ2V0OiBcIiArIHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0ID0gXCJtc2VjXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHJpbmcgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICAgICAgICAgIGlmIChcInllYXJcIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZVN5c3RlbVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlsZVN5c3RlbVN0cmluZyArPSAoXCJfXCIgKyBEYXRlVGltZS5udW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhkYXRlLmdldE1vbnRoKCkgKyAxKSk7XHJcbiAgICAgICAgICAgIGlmIChcIm1vbnRoXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW1TdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHJpbmcgKz0gKFwiX1wiICsgRGF0ZVRpbWUubnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcoZGF0ZS5nZXREYXRlKCkpKTtcclxuICAgICAgICAgICAgaWYgKFwiZGF0ZVwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlU3lzdGVtU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWxlU3lzdGVtU3RyaW5nICs9IChcIlRcIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0SG91cnMoKSkpO1xyXG4gICAgICAgICAgICBpZiAoXCJob3VyXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW1TdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHJpbmcgKz0gKFwiX1wiICsgRGF0ZVRpbWUubnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcoZGF0ZS5nZXRNaW51dGVzKCkpKTtcclxuICAgICAgICAgICAgaWYgKFwibWluXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW1TdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHJpbmcgKz0gKFwiX1wiICsgRGF0ZVRpbWUubnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcoZGF0ZS5nZXRTZWNvbmRzKCkpKTtcclxuICAgICAgICAgICAgaWYgKFwic2VjXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW1TdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHJpbmcgKz0gKFwiX1wiICsgU3RyaW5nKChkYXRlLmdldE1pbGxpc2Vjb25kcygpIC8gMTAwMCkudG9GaXhlZCgzKSkuc2xpY2UoMiwgNSkpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsZVN5c3RlbVN0cmluZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBzdGF0aWMgbWV0aG9kXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnQgbnVtIHRvIHN0cmluZyhkb3VibGUgZGlnaXRzKVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7TnVtYmVyfSBudW1iZXIgKDAgPG51bWJlciA8IDEwMClcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IGRvdWJsZSBkaWdpdHMgc3RyaW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgbnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcobnVtOiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAobnVtIDwgMCB8fCBudW0gPiAxMDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChudW0gPCAxMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiMFwiICsgbnVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiICsgbnVtO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSB0eXBlcz1cImpxdWVyeVwiIC8+XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuVGVtcGxhdGVdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBKU1RcclxuICAgICAqIEBicmllZiDjgrPjg7Pjg5HjgqTjg6vmuIjjgb8g44OG44Oz44OX44Os44O844OI5qC857SN44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSlNUIHtcclxuICAgICAgICAoZGF0YT86IGFueSk6IHN0cmluZztcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFRlbXBsYXRlXHJcbiAgICAgKiBAYnJpZWYgdGVtcGxhdGUgc2NyaXB0IOOCkueuoeeQhuOBmeOCi+ODpuODvOODhuOCo+ODquODhuOCo+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgVGVtcGxhdGUge1xyXG5cclxuICAgICAgICBzdGF0aWMgX21hcEVsZW1lbnQ6IGFueTsgICAgLy8hPCDjgq3jg7zjgaggSlF1ZXJ5IEVsZW1lbnQg44GuIE1hcCDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICBzdGF0aWMgX21hcFNvdXJjZTogYW55OyAgICAgLy8hPCBVUkwg44GoIOOCveODvOOCueODleOCoeOCpOODqyhIVE1MKSDjga4gTWFwIOOCquODluOCuOOCp+OCr+ODiFxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIOWFrOmWi+ODoeOCveODg+ODiVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmjIflrprjgZfjgZ8gaWQsIGNsYXNzIOWQjSwgVGFnIOWQjeOCkuOCreODvOOBq+ODhuODs+ODl+ODrOODvOODiOOBriBKUXVlcnkgRWxlbWVudCDjgpLlj5blvpfjgZnjgovjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAga2V5ICAgICBbaW5dIGlkLCBjbGFzcywgdGFnIOOCkuihqOOBmeaWh+Wtl+WIl1xyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgW3NyY10gICBbaW5dIOWklumDqCBodG1sIOOCkuaMh+WumuOBmeOCi+WgtOWQiOOBryB1cmwg44KS6Kit5a6aXHJcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSBbY2FjaGVdIFtpbl0gc3JjIGh0bWwg44KS44Kt44Oj44OD44K344Ol44GZ44KL5aC05ZCI44GvIHRydWUuIHNyYyDjgYzmjIflrprjgZXjgozjgabjgYTjgovjgajjgY3jga7jgb/mnInlirlcclxuICAgICAgICAgKiBAcmV0dXJuIHRlbXBsYXRlIOOBjOagvOe0jeOBleOCjOOBpuOBhOOCiyBKUXVlcnkgRWxlbWVudFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBnZXRUZW1wbGF0ZUVsZW1lbnQoa2V5OiBzdHJpbmcsIHNyYzogc3RyaW5nID0gbnVsbCwgY2FjaGU6IGJvb2xlYW4gPSB0cnVlKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgY29uc3QgbWFwRWxlbWVudCA9IFRlbXBsYXRlLmdldEVsZW1lbnRNYXAoKTtcclxuICAgICAgICAgICAgbGV0ICRlbGVtZW50ID0gbWFwRWxlbWVudFtrZXldO1xyXG5cclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGlmICghJGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3JjKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGh0bWwgPSBUZW1wbGF0ZS5maW5kSHRtbEZyb21Tb3VyY2Uoc3JjKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQgPSAkKGh0bWwpLmZpbmQoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudCA9ICQoa2V5KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6KaB57Sg44Gu5qSc6Ki8XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRlbGVtZW50IDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgKFwiaW52YWxpZCBba2V5LCBzcmNdID0gW1wiICsga2V5ICsgXCIsIFwiICsgc3JjICsgXCJdXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3JjICYmIGNhY2hlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hcEVsZW1lbnRba2V5XSA9ICRlbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIGV4Y2VwdGlvbik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRlbGVtZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWFwIOOCquODluOCuOOCp+OCr+ODiOOBruWJiumZpFxyXG4gICAgICAgICAqIOaYjuekuueahOOBq+OCreODo+ODg+OCt+ODpeOCkumWi+aUvuOBmeOCi+WgtOWQiOOBr+acrOODoeOCveODg+ODieOCkuOCs+ODvOODq+OBmeOCi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBlbXB0eSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgVGVtcGxhdGUuX21hcEVsZW1lbnQgPSBudWxsO1xyXG4gICAgICAgICAgICBUZW1wbGF0ZS5fbWFwU291cmNlID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBnyBpZCwgY2xhc3Mg5ZCNLCBUYWcg5ZCN44KS44Kt44O844GrIEpTVCDjgpLlj5blvpfjgZnjgovjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nIHwgalF1ZXJ5fSBrZXkgICAgIFtpbl0gaWQsIGNsYXNzLCB0YWcg44KS6KGo44GZ5paH5a2X5YiXIOOBvuOBn+OBryDjg4bjg7Pjg5fjg6zjg7zjg4jmloflrZfliJcsIOOBvuOBn+OBryBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICAgICAgIFtzcmNdICAgW2luXSDlpJbpg6ggaHRtbCDjgpLmjIflrprjgZnjgovloLTlkIjjga8gdXJsIOOCkuioreWumlxyXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gICAgICAgICBbY2FjaGVdIFtpbl0gc3JjIGh0bWwg44KS44Kt44Oj44OD44K344Ol44GZ44KL5aC05ZCI44GvIHRydWUuIHNyYyDjgYzmjIflrprjgZXjgozjgabjgYTjgovjgajjgY3jga7jgb/mnInlirlcclxuICAgICAgICAgKiBAcmV0dXJuIOOCs+ODs+ODkeOCpOODq+OBleOCjOOBnyBKU1Qg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGdldEpTVChrZXk6IEpRdWVyeSk6IEpTVDtcclxuICAgICAgICBzdGF0aWMgZ2V0SlNUKGtleTogc3RyaW5nLCBzcmM/OiBzdHJpbmcsIGNhY2hlPzogYm9vbGVhbik6IEpTVDtcclxuICAgICAgICBzdGF0aWMgZ2V0SlNUKGtleTogYW55LCBzcmM/OiBzdHJpbmcsIGNhY2hlPzogYm9vbGVhbik6IEpTVCB7XHJcbiAgICAgICAgICAgIGxldCB0ZW1wbGF0ZTogYW55ID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IGpzdDogSlNUO1xyXG4gICAgICAgICAgICBsZXQgJGVsZW1lbnQ6IEpRdWVyeTtcclxuICAgICAgICAgICAgaWYgKGtleSBpbnN0YW5jZW9mIGpRdWVyeSkge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQgPSBrZXk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbWVudCA9IFRlbXBsYXRlLmdldFRlbXBsYXRlRWxlbWVudChrZXksIHNyYywgY2FjaGUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IGdsb2JhbC5Ib2dhbikge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBIb2dhbi5jb21waWxlKCRlbGVtZW50LnRleHQoKSk7XHJcbiAgICAgICAgICAgICAgICBqc3QgPSBmdW5jdGlvbiAoZGF0YT86IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlLnJlbmRlcihkYXRhKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobnVsbCAhPSBnbG9iYWwuXykge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBfLnRlbXBsYXRlKCRlbGVtZW50Lmh0bWwoKSk7XHJcbiAgICAgICAgICAgICAgICBqc3QgPSBmdW5jdGlvbiAoZGF0YT86IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5pS56KGM44Go44K/44OW44Gv5YmK6Zmk44GZ44KLXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRlbXBsYXRlKGRhdGEpLnJlcGxhY2UoL1xcbnxcXHQvZywgXCJcIik7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiY2Fubm90IGZpbmQgdGVtcGxhdGUgZW5naW5lIG1vZHVsZS5cIik7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCIgICAgJ2hvZ2FuJyBvciAndW5kZXJzY29yZScgaXMgcmVxdWlyZWQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBqc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIOWGhemDqOODoeOCveODg+ODiVxyXG5cclxuICAgICAgICAvLyEgRWxlbWVudCBNYXAg44Kq44OW44K444Kn44Kv44OI44Gu5Y+W5b6XXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZ2V0RWxlbWVudE1hcCgpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIVRlbXBsYXRlLl9tYXBFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICBUZW1wbGF0ZS5fbWFwRWxlbWVudCA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBUZW1wbGF0ZS5fbWFwRWxlbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBVUkwgTWFwIOOCquODluOCuOOCp+OCr+ODiOOBruWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGdldFNvdXJjZU1hcCgpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIVRlbXBsYXRlLl9tYXBTb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIFRlbXBsYXRlLl9tYXBTb3VyY2UgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVGVtcGxhdGUuX21hcFNvdXJjZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBVUkwgTWFwIOOBi+OCiSBIVE1MIOOCkuaknOe0oi4g5aSx5pWX44GX44Gf5aC05ZCI44GvIHVuZGVmaW5lZCDjgYzov5TjgotcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBmaW5kSHRtbEZyb21Tb3VyY2Uoc3JjOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBtYXBTb3VyY2UgPSBUZW1wbGF0ZS5nZXRTb3VyY2VNYXAoKTtcclxuICAgICAgICAgICAgbGV0IGh0bWwgPSBtYXBTb3VyY2Vbc3JjXTtcclxuXHJcbiAgICAgICAgICAgIGlmICghaHRtbCkge1xyXG4gICAgICAgICAgICAgICAgJC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiR0VUXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImh0bWxcIixcclxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiAoZGF0YTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh0bWwgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6IChkYXRhOiBhbnksIHN0YXR1czogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IChcImFqYXggcmVxdWVzdCBmYWlsZWQuIHN0YXR1czogXCIgKyBzdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8g44Kt44Oj44OD44K344Ol44Gr5qC857SNXHJcbiAgICAgICAgICAgICAgICBtYXBTb3VyY2Vbc3JjXSA9IGh0bWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGh0bWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5Qcm9ncmVzc0NvdW50ZXJdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQcm9ncmVzc0NvdW50ZXJPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgUHJvZ3Jlc3NDb3VudGVyIOOBq+aMh+WumuOBmeOCi+OCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFByb2dyZXNzQ291bnRlck9wdGlvbnMge1xyXG4gICAgICAgIG1heD86IG51bWJlcjsgICAgICAgICAgICAgICAgICAgICAgIC8vIOmAsuaNl+WApOOBruacgOWkp+WApCDml6Llrpo6IDEwMFxyXG4gICAgICAgIGFsbG93SW5jcmVtZW50UmVtYWluPzogYm9vbGVhbjsgICAgIC8vIOaui+OCiuaOqOWumuaZgumWk+OBjOWil+OBiOOBpuOCiOOBhOWgtOWQiOOBq+OBryB0cnVlIOaXouWumjogZmFsc2VcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUHJvZ3Jlc3NDb3VudGVyUmVzdWx0XHJcbiAgICAgKiBAYnJpZWYg6YCy5o2X44Gu5pmC6ZaT44KS5oyB44Gk44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKiAgICAgICAg5Y2Y5L2N44GvIFttc2VjXVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFByb2dyZXNzQ291bnRlclJlc3VsdCB7XHJcbiAgICAgICAgcGFzc1RpbWU6IG51bWJlcjsgICAgICAgLy8g57WM6YGO5pmC6ZaTXHJcbiAgICAgICAgcmVtYWluVGltZTogbnVtYmVyOyAgICAgLy8g5q6L44KK5o6o5a6a5pmC6ZaTXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgUHJvZ3Jlc3NDb3VudGVyXHJcbiAgICAgKiBAYnJpZWYg6YCy5o2X44Gu5pmC6ZaT44KS5omx44GG44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQcm9ncmVzc0NvdW50ZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9zZXR0aW5nczoge1xyXG4gICAgICAgICAgICBtYXg6IG51bWJlcjtcclxuICAgICAgICAgICAgYmVnaW5UaW1lOiBudW1iZXI7XHJcbiAgICAgICAgICAgIGFsbG93SW5jcmVtZW50ZVJlbWFpbjogYm9vbGVhbjtcclxuICAgICAgICAgICAgbGFzdFJlbWFpblRpbWU6IG51bWJlcjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIFtvcHRpb25zXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihvcHRpb25zPzogUHJvZ3Jlc3NDb3VudGVyT3B0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0KG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6ZaL5aeL5pmC6ZaT44KS5Yid5pyf5YyWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHJlc2V0KG9wdGlvbnM/OiBQcm9ncmVzc0NvdW50ZXJPcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzID0ge1xyXG4gICAgICAgICAgICAgICAgLi4ue1xyXG4gICAgICAgICAgICAgICAgICAgIG1heDogMTAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGJlZ2luVGltZTogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgICAgICAgICBhbGxvd0luY3JlbWVudGVSZW1haW46IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RSZW1haW5UaW1lOiBJbmZpbml0eSxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICwgLi4uPGFueT5vcHRpb25zXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDntYzpgY7mmYLplpPjgajmjqjlrprmrovjgormmYLplpPjgpLlj5blvpfjgZnjgotcclxuICAgICAgICAgKiDpgLLmjZflgKTjgYwgMCDjga7loLTlkIjjga/jgIHmjqjlrprmrovjgormmYLplpPjgasgSW5maW5pdHkg44KS6L+U44GZXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gICBwcm9ncmVzcyBbaW5dIOmAsuaNl+WApFxyXG4gICAgICAgICAqIEByZXR1cm5zIOe1jOmBjuaZgumWk+OBqOaOqOWumuaui+OCiuaZgumWkyBbbXNlY11cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgY29tcHV0ZShwcm9ncmVzczogbnVtYmVyKTogUHJvZ3Jlc3NDb3VudGVyUmVzdWx0IHtcclxuICAgICAgICAgICAgY29uc3QgcGFzc1RpbWUgPSBEYXRlLm5vdygpIC0gdGhpcy5fc2V0dGluZ3MuYmVnaW5UaW1lO1xyXG4gICAgICAgICAgICBsZXQgcmVtYWluVGltZSA9IEluZmluaXR5O1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBwcm9ncmVzcyAmJiAwICE9PSBwcm9ncmVzcykge1xyXG4gICAgICAgICAgICAgICAgcmVtYWluVGltZSA9IHBhc3NUaW1lICogdGhpcy5fc2V0dGluZ3MubWF4IC8gcHJvZ3Jlc3MgLSBwYXNzVGltZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MuYWxsb3dJbmNyZW1lbnRlUmVtYWluIHx8IChyZW1haW5UaW1lIDwgdGhpcy5fc2V0dGluZ3MubGFzdFJlbWFpblRpbWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR0aW5ncy5sYXN0UmVtYWluVGltZSA9IHJlbWFpblRpbWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZW1haW5UaW1lID0gdGhpcy5fc2V0dGluZ3MubGFzdFJlbWFpblRpbWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7IHBhc3NUaW1lLCByZW1haW5UaW1lIH07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImRlY2xhcmUgbW9kdWxlIFwiY2RwLnRvb2xzXCIge1xyXG4gICAgY29uc3QgVG9vbHM6IHR5cGVvZiBDRFAuVG9vbHM7XHJcbiAgICBleHBvcnQgPSBUb29scztcclxufVxyXG4iXX0=