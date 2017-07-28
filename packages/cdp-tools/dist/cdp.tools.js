/*!
 * cdp.tools.js 2.0.0
 *
 * Date: 2017-07-28T03:59:21.664Z
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
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_TOOLS"] = 4 * CDP.MODULE_RESULT_CODE_RANGE_CDP] = "CDP_TOOLS";
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
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var Promise = CDP.Promise;
        var TAG = "[CDP.Tools.Blob] ";
        var Blob;
        (function (Blob) {
            /**
             * Get BlobBuilder
             *
             * @return {any} BlobBuilder
             */
            function getBlobBuilder() {
                return CDP.global.BlobBuilder || CDP.global.WebKitBlobBuilder || CDP.global.MozBlobBuilder || CDP.global.MSBlobBuilder;
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
            function makeErrorInfoFromDOMError(resultCode, cause, tag, message) {
                var _cause;
                if (cause) {
                    _cause = {
                        name: cause.name,
                        message: cause.name,
                    };
                }
                return CDP.makeErrorInfo(resultCode, tag, message, _cause);
            }
            /**
             * ArrayBuffer to Blob
             *
             * @param buf {ArrayBuffer} [in] ArrayBuffer data
             * @param mimeType {string} [in] MimeType of data
             * @return {Blob} Blob data
             */
            function arrayBufferToBlob(buf, mimeType) {
                var blob = null;
                var blobBuilderObject = getBlobBuilder();
                if (blobBuilderObject != null) {
                    var blobBuilder = new blobBuilderObject();
                    blobBuilder.append(buf);
                    blob = blobBuilder.getBlob(mimeType);
                }
                else {
                    // Android 4.4 KitKat Chromium WebView
                    blob = new CDP.global.Blob([buf], { type: mimeType });
                }
                return blob;
            }
            Blob.arrayBufferToBlob = arrayBufferToBlob;
            /**
             * Base64 string to Blob
             *
             * @param base64 {string} [in] Base64 string data
             * @param mimeType {string} [in] MimeType of data
             * @return {Blob} Blob data
             */
            function base64ToBlob(base64, mimeType) {
                var blob = null;
                var blobBuilderObject = getBlobBuilder();
                if (blobBuilderObject != null) {
                    var blobBuilder = new blobBuilderObject();
                    blobBuilder.append(base64ToArrayBuffer(base64));
                    blob = blobBuilder.getBlob(mimeType);
                }
                else {
                    // Android 4.4 KitKat Chromium WebView
                    blob = new CDP.global.Blob([base64ToArrayBuffer(base64)], { type: mimeType });
                }
                return blob;
            }
            Blob.base64ToBlob = base64ToBlob;
            /**
             * data-url 形式画像から Blob オブジェクトへ変換
             *
             * @param  {String} dataUrl    [in] data url
             * @param  {String} [mimeType] [in] mime type を指定. 既定では "image/png"
             * @return {Blob} Blob インスタンス
             */
            function dataUrlToBlob(dataUrl, mimeType) {
                if (mimeType === void 0) { mimeType = "image/png"; }
                var base64 = dataUrl.split(",")[1];
                return base64ToBlob(base64, mimeType);
            }
            Blob.dataUrlToBlob = dataUrlToBlob;
            /**
             * Base64 string to ArrayBuffer
             *
             * @param base64 {string} [in] Base64 string data
             * @return {ArrayBuffer} ArrayBuffer data
             */
            function base64ToArrayBuffer(base64) {
                var bytes = window.atob(base64);
                var arrayBuffer = new ArrayBuffer(bytes.length);
                var data = new Uint8Array(arrayBuffer);
                for (var i = 0, len = bytes.length; i < len; ++i) {
                    data[i] = bytes.charCodeAt(i);
                }
                return arrayBuffer;
            }
            Blob.base64ToArrayBuffer = base64ToArrayBuffer;
            /**
             * Base64 string to Uint8Array
             *
             * @param base64 {string} [in] Base64 string data
             * @return {Uint8Array} Uint8Array data
             */
            function base64ToUint8Array(encoded) {
                var bytes = window.atob(encoded);
                var data = new Uint8Array(bytes.length);
                for (var i = 0, len = bytes.length; i < len; ++i) {
                    data[i] = bytes.charCodeAt(i);
                }
                return data;
            }
            Blob.base64ToUint8Array = base64ToUint8Array;
            /**
             * ArrayBuffer to base64 string
             *
             * @param arrayBuffer {ArrayBuffer} [in] ArrayBuffer data
             * @return {string} base64 data
             */
            function arrayBufferToBase64(arrayBuffer) {
                var bytes = new Uint8Array(arrayBuffer);
                return uint8ArrayToBase64(bytes);
            }
            Blob.arrayBufferToBase64 = arrayBufferToBase64;
            /**
             * Uint8Array to base64 string
             *
             * @param bytes {Uint8Array} [in] Uint8Array data
             * @return {string} base64 data
             */
            function uint8ArrayToBase64(bytes) {
                var data = "";
                for (var i = 0, len = bytes.byteLength; i < len; ++i) {
                    data += String.fromCharCode(bytes[i]);
                }
                return window.btoa(data);
            }
            Blob.uint8ArrayToBase64 = uint8ArrayToBase64;
            /**
             * read Blob as ArrayBuffer
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<ArrayBuffer>} promise object
             */
            function readBlobAsArrayBuffer(blob) {
                var reader = new FileReader();
                var cancel = function () { return reader.abort(); };
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function () {
                        reject(makeErrorInfoFromDOMError(CDP.RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR, reader.error, TAG, "FileReader.readAsArrayBuffer() failed."));
                    };
                    reader.readAsArrayBuffer(blob);
                }, cancel);
            }
            Blob.readBlobAsArrayBuffer = readBlobAsArrayBuffer;
            /**
             * read Blob as Uint8Array
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<Uint8Array>} promise object
             */
            function readBlobAsUint8Array(blob) {
                return new Promise(function (resolve, reject, dependOn) {
                    dependOn(readBlobAsArrayBuffer(blob))
                        .then(function (result) {
                        resolve(new Uint8Array(result));
                    })
                        .catch(function (error) {
                        reject(error);
                    });
                });
            }
            Blob.readBlobAsUint8Array = readBlobAsUint8Array;
            /**
             * read Blob as text string
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<Uint8Array>} promise object
             */
            function readBlobAsText(blob, encode) {
                if (encode === void 0) { encode = "utf-8"; }
                var reader = new FileReader();
                var cancel = function () { return reader.abort(); };
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function () {
                        reject(makeErrorInfoFromDOMError(CDP.RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR, reader.error, TAG, "FileReader.readAsText() failed."));
                    };
                    reader.readAsText(blob, encode);
                }, cancel);
            }
            Blob.readBlobAsText = readBlobAsText;
            /**
             * read Blob as Data URL
             *
             * @param  {Blob} blob [in] blob data
             * @return {CDP.IPromise<string>} promise object
             */
            function readBlobAsDataURL(blob) {
                var reader = new FileReader();
                var cancel = function () { return reader.abort(); };
                return new Promise(function (resolve, reject) {
                    reader.onload = function () {
                        resolve(reader.result);
                    };
                    reader.onerror = function () {
                        reject(makeErrorInfoFromDOMError(CDP.RESULT_CODE.ERROR_CDP_TOOLS_FILE_READER_ERROR, reader.error, TAG, "FileReader.readAsDataURL() failed."));
                    };
                    reader.readAsDataURL(blob);
                }, cancel);
            }
            Blob.readBlobAsDataURL = readBlobAsDataURL;
            /**
             * URL Object
             *
             * @return {any} URL Object
             */
            Blob.URL = (function () {
                return CDP.global.URL || CDP.global.webkitURL;
            })();
        })(Blob = Tools.Blob || (Tools.Blob = {}));
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
        var DateTime = (function () {
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
        var Template = (function () {
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

return CDP.Tools; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVG9vbHMvRXJyb3JEZWZzLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9GdW5jdGlvbnMudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL0Jsb2IudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL0JpbmFyeVRyYW5zcG9ydC50cyIsImNkcDovLy9DRFAvVG9vbHMvRGF0ZVRpbWUudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL1RlbXBsYXRlLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9JbnRlcmZhY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQVUsR0FBRyxDQXFDWjtBQXJDRCxXQUFVLEdBQUc7SUFFVDs7O09BR0c7SUFDSCxJQUFZLGdCQUdYO0lBSEQsV0FBWSxnQkFBZ0I7UUFDeEIsNkZBQTJCO1FBQzNCLGlEQUFZLENBQUMsR0FBRyxnQ0FBNEI7SUFDaEQsQ0FBQyxFQUhXLGdCQUFnQixHQUFoQixvQkFBZ0IsS0FBaEIsb0JBQWdCLFFBRzNCO0lBRUQsdUVBQXVFO0lBQ3ZFLDRCQUE0QjtJQUU1QixJQUFNLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztJQUUvQjs7O09BR0c7SUFDSCxJQUFLLGVBR0o7SUFIRCxXQUFLLGVBQWU7UUFDaEIsK0RBQWU7UUFDZiwwQ0FBYyxDQUFDLEdBQUcsbUJBQW1CO0lBQ3pDLENBQUMsRUFISSxlQUFlLEtBQWYsZUFBZSxRQUduQjtJQUVELG9DQUFvQztJQUNwQzs7O09BR0c7SUFDSCxJQUFZLFdBS1g7SUFMRCxXQUFZLFdBQVc7UUFDbkIsMkZBQXVDO1FBQ3ZDLCtEQUFzQyxzQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsZUFBZSxDQUFDLFNBQVMsR0FBRyxDQUFDLEVBQUUsb0JBQW9CLENBQUM7UUFDekksMkRBQXNDLHNCQUFrQixDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQztRQUNySSwrREFBc0Msc0JBQWtC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ICAgICAqIEBlbnVtICBSRVNVTFRfQ09ERV9CQVNFXHJcbiAgICAgKiBAYnJpZWYg44Oq44K244Or44OI44Kz44O844OJ44Gu44Kq44OV44K744OD44OI5YCkXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFX0JBU0Uge1xyXG4gICAgICAgIENEUF9UT09MU19ERUNMQVJFUkFUSU9OID0gMCwgICAgLy8gVFMyNDMyIOWvvuetllxyXG4gICAgICAgIENEUF9UT09MUyA9IDQgKiBNT0RVTEVfUkVTVUxUX0NPREVfUkFOR0VfQ0RQLFxyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBtb2R1bGUgZXJyb3IgZGVjbGFyYXRpb246XHJcblxyXG4gICAgY29uc3QgRlVOQ1RJT05fQ09ERV9SQU5HRSA9IDEwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIExPQ0FMX0NPREVfQkFTRVxyXG4gICAgICogQGJyaWVmIGNkcC50b29scyDlhoXjga7jg63jg7zjgqvjg6vjgrPjg7zjg4njgqrjg5Xjgrvjg4Pjg4jlgKRcclxuICAgICAqL1xyXG4gICAgZW51bSBMT0NBTF9DT0RFX0JBU0Uge1xyXG4gICAgICAgIEZVTkNUSU9OUyAgID0gMCxcclxuICAgICAgICBCTE9CICAgICAgICA9IDEgKiBGVU5DVElPTl9DT0RFX1JBTkdFLFxyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW51bSAgUkVTVUxUX0NPREVcclxuICAgICAqIEBicmllZiBjZHAudG9vbHMg44Gu44Ko44Op44O844Kz44O844OJ5a6a576pXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFIHtcclxuICAgICAgICBFUlJPUl9DRFBfVE9PTFNfREVDTEFSQVRJT04gICAgICAgICA9IDAsIC8vIFRTMjQzMiDlr77nrZZcclxuICAgICAgICBFUlJPUl9DRFBfVE9PTFNfSU1BR0VfTE9BRF9GQUlMRUQgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9UT09MUywgTE9DQUxfQ09ERV9CQVNFLkZVTkNUSU9OUyArIDEsIFwiaW1hZ2UgbG9hZCBmYWlsZWQuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9UT09MU19JTlZBTElEX0lNQUdFICAgICAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX1RPT0xTLCBMT0NBTF9DT0RFX0JBU0UuRlVOQ1RJT05TICsgMiwgXCJpbnZhbGlkIGltYWdlLlwiKSxcclxuICAgICAgICBFUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IgICA9IERFQ0xBUkVfRVJST1JfQ09ERShSRVNVTFRfQ09ERV9CQVNFLkNEUF9UT09MUywgTE9DQUxfQ09ERV9CQVNFLkJMT0IgKyAxLCBcIkZpbGVSZWFkZXIgbWV0aG9kIGZhaWxlZC5cIiksXHJcbiAgICB9XHJcbiAgICAvKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwianF1ZXJ5XCIgLz5cclxuXHJcbm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG5cclxuICAgIGltcG9ydCBQcm9taXNlID0gQ0RQLlByb21pc2U7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlRvb2xzLkZ1bmN0aW9uc10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRoLmFicyDjgojjgorjgoLpq5jpgJ/jgaogYWJzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBhYnMoeDogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4geCA+PSAwID8geCA6IC14O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWF0aC5tYXgg44KI44KK44KC6auY6YCf44GqIG1heFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWF4KGxoczogbnVtYmVyLCByaHM6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIGxocyA+PSByaHMgPyBsaHMgOiByaHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRoLm1pbiDjgojjgorjgoLpq5jpgJ/jgaogbWluXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBtaW4obGhzOiBudW1iZXIsIHJoczogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gbGhzIDw9IHJocyA/IGxocyA6IHJocztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaVsOWApOOCkiAwIOipsOOCgeOBl+OBpuaWh+Wtl+WIl+OCkueUn+aIkFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gdG9aZXJvUGFkZGluZyhubzogbnVtYmVyLCBsaW1pdDogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICBsZXQgc2lnbmVkID0gXCJcIjtcclxuICAgICAgICBubyA9IE51bWJlcihubyk7XHJcblxyXG4gICAgICAgIGlmIChpc05hTihubykgfHwgaXNOYU4obGltaXQpIHx8IGxpbWl0IDw9IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobm8gPCAwKSB7XHJcbiAgICAgICAgICAgIG5vID0gVG9vbHMuYWJzKG5vKTtcclxuICAgICAgICAgICAgc2lnbmVkID0gXCItXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gc2lnbmVkICsgKEFycmF5KGxpbWl0KS5qb2luKFwiMFwiKSArIG5vKS5zbGljZSgtbGltaXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5aSa6YeN57aZ5om/44Gu44Gf44KB44Gu5a6f6KGM5pmC57aZ5om/6Zai5pWwXHJcbiAgICAgKlxyXG4gICAgICogU3ViIENsYXNzIOWAmeijnOOCquODluOCuOOCp+OCr+ODiOOBq+WvvuOBl+OBpiBTdXBlciBDbGFzcyDlgJnoo5zjgqrjg5bjgrjjgqfjgq/jg4jjgpLnm7TliY3jga4gU3VwZXIgQ2xhc3Mg44Go44GX44Gm5oy/5YWl44GZ44KL44CCXHJcbiAgICAgKiBwcm90b3R5cGUg44Gu44G/44Kz44OU44O844GZ44KL44CCXHJcbiAgICAgKiDjgqTjg7Pjgrnjgr/jg7Pjgrnjg6Hjg7Pjg5DjgpLjgrPjg5Tjg7zjgZfjgZ/jgYTloLTlkIjjgIFTdXBlciBDbGFzcyDjgYznlpHkvLzjgrPjg7Pjgrnjg4jjg6njgq/jgr/jgpLmj5DkvpvjgZnjgovlv4XopoHjgYzjgYLjgovjgIJcclxuICAgICAqIOips+e0sOOBryBjZHAudG9vbHMuRnVuY3Rpb25zLnNwZWMudHMg44KS5Y+C54Wn44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHN1YkNsYXNzICAge2NvbnN0cnVjdG9yfSBbaW5dIOOCquODluOCuOOCp+OCr+ODiOOBriBjb25zdHJ1Y3RvciDjgpLmjIflrppcclxuICAgICAqIEBwYXJhbSBzdXBlckNsYXNzIHtjb25zdHJ1Y3Rvcn0gW2luXSDjgqrjg5bjgrjjgqfjgq/jg4jjga4gY29uc3RydWN0b3Ig44KS5oyH5a6aXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbmhlcml0KHN1YkNsYXNzOiBhbnksIHN1cGVyQ2xhc3M6IGFueSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IF9wcm90b3R5cGUgPSBzdWJDbGFzcy5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF9pbmhlcml0KCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnN0cnVjdG9yID0gc3ViQ2xhc3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF9pbmhlcml0LnByb3RvdHlwZSA9IHN1cGVyQ2xhc3MucHJvdG90eXBlO1xyXG4gICAgICAgIHN1YkNsYXNzLnByb3RvdHlwZSA9IG5ldyBfaW5oZXJpdCgpO1xyXG5cclxuICAgICAgICAkLmV4dGVuZChzdWJDbGFzcy5wcm90b3R5cGUsIF9wcm90b3R5cGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogbWl4aW4g6Zai5pWwXHJcbiAgICAgKlxyXG4gICAgICogVHlwZVNjcmlwdCBPZmZpY2lhbCBTaXRlIOOBq+i8ieOBo+OBpuOBhOOCiyBtaXhpbiDplqLmlbBcclxuICAgICAqIGh0dHA6Ly93d3cudHlwZXNjcmlwdGxhbmcub3JnL0hhbmRib29rI21peGluc1xyXG4gICAgICog5pei44Gr5a6a576p44GV44KM44Gm44GE44KL44Kq44OW44K444Kn44Kv44OI44GL44KJ44CB5paw6KaP44Gr44Kq44OW44K444Kn44Kv44OI44KS5ZCI5oiQ44GZ44KL44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRlcml2ZWQge2NvbnN0cnVjdG9yfSAgICBbaW5dIOWQiOaIkOOBleOCjOOCi+OCquODluOCuOOCp+OCr+ODiOOBriBjb25zdHJ1Y3RvciDjgpLmjIflrppcclxuICAgICAqIEBwYXJhbSBiYXNlcyAgIHtjb25zdHJ1Y3Rvci4uLn0gW2luXSDlkIjmiJDlhYPjgqrjg5bjgrjjgqfjgq/jg4jjga4gY29uc3RydWN0b3Ig44KS5oyH5a6aICjlj6/lpInlvJXmlbApXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBtaXhpbihkZXJpdmVkOiBhbnksIC4uLmJhc2VzOiBhbnlbXSk6IHZvaWQge1xyXG4gICAgICAgIGJhc2VzLmZvckVhY2goKGJhc2UpID0+IHtcclxuICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZS5wcm90b3R5cGUpLmZvckVhY2gobmFtZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXJpdmVkLnByb3RvdHlwZVtuYW1lXSA9IGJhc2UucHJvdG90eXBlW25hbWVdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBjb3JyZWN0bHkgc2V0IHVwIHRoZSBwcm90b3R5cGUgY2hhaW4sIGZvciBzdWJjbGFzc2VzLlxyXG4gICAgICogVGhlIGZ1bmN0aW9uIGJlaGF2aW9yIGlzIHNhbWUgYXMgZXh0ZW5kKCkgZnVuY3Rpb24gb2YgQmFja2JvbmUuanMuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHByb3RvUHJvcHMgIHtPYmplY3R9IFtpbl0gc2V0IHByb3RvdHlwZSBwcm9wZXJ0aWVzIGFzIG9iamVjdC5cclxuICAgICAqIEBwYXJhbSBzdGF0aWNQcm9wcyB7T2JqZWN0fSBbaW5dIHNldCBzdGF0aWMgcHJvcGVydGllcyBhcyBvYmplY3QuXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IHN1YmNsYXNzIGNvbnN0cnVjdG9yLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiDjgq/jg6njgrnntpnmib/jga7jgZ/jgoHjga7jg5jjg6vjg5Hjg7zplqLmlbBcclxuICAgICAqIEJhY2tib25lLmpzIGV4dGVuZCgpIOmWouaVsOOBqOWQjOetiVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwcm90b1Byb3BzICB7T2JqZWN0fSBbaW5dIHByb3RvdHlwZSBwcm9wZXJ0aWVzIOOCkuOCquODluOCuOOCp+OCr+ODiOOBp+aMh+WumlxyXG4gICAgICogQHBhcmFtIHN0YXRpY1Byb3BzIHtPYmplY3R9IFtpbl0gc3RhdGljIHByb3BlcnRpZXMg44KS44Kq44OW44K444Kn44Kv44OI44Gn5oyH5a6aXHJcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IOOCteODluOCr+ODqeOCueOBruOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZXh0ZW5kKHByb3RvUHJvcHM6IG9iamVjdCwgc3RhdGljUHJvcHM/OiBvYmplY3QpOiBvYmplY3Qge1xyXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGNoaWxkO1xyXG5cclxuICAgICAgICBpZiAocHJvdG9Qcm9wcyAmJiBwcm90b1Byb3BzLmhhc093blByb3BlcnR5KFwiY29uc3RydWN0b3JcIikpIHtcclxuICAgICAgICAgICAgY2hpbGQgPSBwcm90b1Byb3BzLmNvbnN0cnVjdG9yO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJC5leHRlbmQoY2hpbGQsIHBhcmVudCwgc3RhdGljUHJvcHMpO1xyXG5cclxuICAgICAgICBjb25zdCBTdXJyb2dhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIFN1cnJvZ2F0ZS5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlO1xyXG4gICAgICAgIGNoaWxkLnByb3RvdHlwZSA9IG5ldyBTdXJyb2dhdGU7XHJcblxyXG4gICAgICAgIGlmIChwcm90b1Byb3BzKSB7XHJcbiAgICAgICAgICAgICQuZXh0ZW5kKGNoaWxkLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlO1xyXG5cclxuICAgICAgICByZXR1cm4gY2hpbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBEUEkg5Y+W5b6XXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXREZXZpY2VQaXhjZWxSYXRpbygpOiBudW1iZXIge1xyXG4gICAgICAgIGxldCBtZWRpYVF1ZXJ5O1xyXG4gICAgICAgIGNvbnN0IGlzX2ZpcmVmb3ggPSBuYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCkuaW5kZXhPZihcImZpcmVmb3hcIikgPiAtMTtcclxuICAgICAgICBpZiAobnVsbCAhPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyAmJiAhaXNfZmlyZWZveCkge1xyXG4gICAgICAgICAgICByZXR1cm4gd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgfSBlbHNlIGlmICh3aW5kb3cubWF0Y2hNZWRpYSkge1xyXG4gICAgICAgICAgICBtZWRpYVF1ZXJ5ID1cclxuICAgICAgICAgICAgICAgIFwiKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMS41KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDEuNSksXFxcclxuICAgICAgICAgICAgICAgICAgICAoLW8tbWluLWRldmljZS1waXhlbC1yYXRpbzogMy8yKSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tcmVzb2x1dGlvbjogMS41ZHBweClcIjtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKG1lZGlhUXVlcnkpLm1hdGNoZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAxLjU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWVkaWFRdWVyeSA9XHJcbiAgICAgICAgICAgICAgICBcIigtd2Via2l0LW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDIpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMiksXFxcclxuICAgICAgICAgICAgICAgICAgICAoLW8tbWluLWRldmljZS1waXhlbC1yYXRpbzogMi8xKSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tcmVzb2x1dGlvbjogMmRwcHgpXCI7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYShtZWRpYVF1ZXJ5KS5tYXRjaGVzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZWRpYVF1ZXJ5ID1cclxuICAgICAgICAgICAgICAgIFwiKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMC43NSksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAwLjc1KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAzLzQpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi1yZXNvbHV0aW9uOiAwLjc1ZHBweClcIjtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKG1lZGlhUXVlcnkpLm1hdGNoZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwLjc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2FudmFzIGVsZW1lbnQg44Gu44Kt44Oj44OD44K344OlXHJcbiAgICBsZXQgc19jYW52YXNGYWN0b3J5OiBIVE1MQ2FudmFzRWxlbWVudDtcclxuXHJcbiAgICAvLyDjgq3jg6Pjg4Pjgrfjg6XmuIjjgb/jga4gQ2FudmFzIOOCkuWPluW+l+OBmeOCi1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldENhbnZhcygpOiBIVE1MQ2FudmFzRWxlbWVudCB7XHJcbiAgICAgICAgc19jYW52YXNGYWN0b3J5ID0gc19jYW52YXNGYWN0b3J5IHx8IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgICAgICAgcmV0dXJuIDxIVE1MQ2FudmFzRWxlbWVudD5zX2NhbnZhc0ZhY3RvcnkuY2xvbmVOb2RlKGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeUu+WDj+ODquOCveODvOOCueOBruODreODvOODieWujOS6huOCkuS/neiovFxyXG4gICAgICog44OW44Op44Km44K25pei5a6a44Gu44OX44Ot44Kw44Os44OD44K344OW44Ot44O844OJ44KS6LWw44KJ44Gb44Gq44GE44Gf44KBLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gdXJsIFtpbl0gdXJsIChkYXRhLXVybClcclxuICAgICAqIEByZXR1cm4ge0lQcm9taXNlPHN0cmluZz59IOihqOekuuWPr+iDveOBqiB1cmxcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGVuc3VyZUltYWdlTG9hZGVkKHVybDogc3RyaW5nKTogSVByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgICAgICBjb25zdCBkZXN0cm95ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaW1nKSB7XHJcbiAgICAgICAgICAgICAgICBpbWcuc3JjID0gXCJcIjsgICAvLyDoqq3jgb/ovrzjgb/lgZzmraJcclxuICAgICAgICAgICAgICAgIGltZyA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBpbWcub25sb2FkID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh1cmwpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaW1nLm9uZXJyb3IgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICByZWplY3QobWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfSU1BR0VfTE9BRF9GQUlMRUQsXHJcbiAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2UgbG9hZCBmYWlsZWQuIFt1cmw6IFwiICsgdXJsICsgXCJdXCJcclxuICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaW1nLnNyYyA9IHVybDtcclxuXHJcbiAgICAgICAgfSwgZGVzdHJveSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnlLvlg4/jga7jg6rjgrXjgqTjgrpcclxuICAgICAqIOaMh+WumuOBl+OBn+mVt+i+uuOBrumVt+OBleOBq+OCouOCueODmuOCr+ODiOavlOOCkue2reaMgeOBl+OBpuODquOCteOCpOOCuuOCkuihjOOBhlxyXG4gICAgICogbG9uZ1NpZGVMZW5ndGgg44KI44KK5bCP44GV44Gq5aC05ZCI44Gv44Kq44Oq44K444OK44Or44K144Kk44K644GnIGRhdGEtdXJsIOOCkui/lOWNtOOBmeOCi1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gc3JjICAgICAgICAgICAgW2luXSBpbWFnZSDjgavmjIflrprjgZnjgovjgr3jg7zjgrlcclxuICAgICAqIEBwYXJhbSAge051bWJlcn0gbG9uZ1NpZGVMZW5ndGggW2luXSDjg6rjgrXjgqTjgrrjgavkvb/nlKjjgZnjgovplbfovrrjga7mnIDlpKflgKTjgpLmjIflrppcclxuICAgICAqIEByZXR1cm4ge0lQcm9taXNlPHN0cmluZz59IGJhc2U2NCBkYXRhIHVybCDjgpLov5TljbRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJlc2l6ZUltYWdlKHNyYzogc3RyaW5nLCBsb25nU2lkZUxlbmd0aDogbnVtYmVyKTogSVByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgbGV0IGltZyA9IG5ldyBJbWFnZSgpO1xyXG5cclxuICAgICAgICBjb25zdCBkZXN0cm95ID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaW1nKSB7XHJcbiAgICAgICAgICAgICAgICBpbWcuc3JjID0gXCJcIjsgICAvLyDoqq3jgb/ovrzjgb/lgZzmraJcclxuICAgICAgICAgICAgICAgIGltZyA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBpbWcub25sb2FkID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2FudmFzID0gZ2V0Q2FudmFzKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpaCA9IGltZy5oZWlnaHQsIGl3ID0gaW1nLndpZHRoLCBpYSA9IGloIC8gaXc7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3c6IG51bWJlciwgY2g6IG51bWJlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXcgPT09IDAgfHwgMCA9PT0gaWEpIHsgLy8g5b+144Gu44Gf44KB5LiN5q2j44Gq55S75YOP44KS44Ks44O844OJXHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG1ha2VFcnJvckluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19JTlZBTElEX0lNQUdFLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaW52YWxpZCBpbWFnZS4gW3NyYzogXCIgKyBzcmMgKyBcIl1cIlxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobG9uZ1NpZGVMZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb25nU2lkZUxlbmd0aCA9IChpYSA8IDEpID8gaXcgOiBpaDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlhIDwgMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjdyA9IChsb25nU2lkZUxlbmd0aCA8IGl3KSA/IGxvbmdTaWRlTGVuZ3RoIDogaXc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoID0gTWF0aC5yb3VuZChjdyAqIGlhKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaCA9IChsb25nU2lkZUxlbmd0aCA8IGloKSA/IGxvbmdTaWRlTGVuZ3RoIDogaWg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN3ID0gTWF0aC5yb3VuZChjaCAvIGlhKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IGN3O1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy5oZWlnaHQgPSBjaDtcclxuICAgICAgICAgICAgICAgICAgICBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLmRyYXdJbWFnZShpbWcsIDAsIDAsIGN3LCBjaCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoY2FudmFzLnRvRGF0YVVSTCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWcub25lcnJvciA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19JTUFHRV9MT0FEX0ZBSUxFRCxcclxuICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZSBsb2FkIGZhaWxlZC4gW3NyYzogXCIgKyBzcmMgKyBcIl1cIlxyXG4gICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWcuc3JjID0gc3JjO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG5cclxuICAgIGltcG9ydCBQcm9taXNlID0gQ0RQLlByb21pc2U7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlRvb2xzLkJsb2JdIFwiO1xyXG5cclxuICAgIGV4cG9ydCBtb2R1bGUgQmxvYiB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdldCBCbG9iQnVpbGRlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7YW55fSBCbG9iQnVpbGRlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldEJsb2JCdWlsZGVyKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWwuQmxvYkJ1aWxkZXIgfHwgZ2xvYmFsLldlYktpdEJsb2JCdWlsZGVyIHx8IGdsb2JhbC5Nb3pCbG9iQnVpbGRlciB8fCBnbG9iYWwuTVNCbG9iQnVpbGRlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCqOODqeODvOaDheWgseeUn+aIkCBmcm9tIERPTUVycm9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtSRVNVTFRfQ09ERX0gcmVzdWx0Q29kZSBbaW5dIFJFU1VMVF9DT0RFIOOCkuaMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSAge0RPTUVycm9yfSAgICBjYXVzZSAgICAgIFtpbl0g5LiL5L2N44GuIERPTSDjgqjjg6njg7zjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgW3RhZ10gICAgICBbaW5dIFRBRyDjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgICAgW21lc3NhZ2VdICBbaW5dIOODoeODg+OCu+ODvOOCuOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Vycm9ySW5mb30g44Ko44Op44O844Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gbWFrZUVycm9ySW5mb0Zyb21ET01FcnJvcihyZXN1bHRDb2RlOiBSRVNVTFRfQ09ERSwgY2F1c2U6IERPTUVycm9yLCB0YWc/OiBzdHJpbmcsIG1lc3NhZ2U/OiBzdHJpbmcpOiBFcnJvckluZm8ge1xyXG4gICAgICAgICAgICBsZXQgX2NhdXNlOiBFcnJvcjtcclxuICAgICAgICAgICAgaWYgKGNhdXNlKSB7XHJcbiAgICAgICAgICAgICAgICBfY2F1c2UgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogY2F1c2UubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBjYXVzZS5uYW1lLCAgICAvLyBET01FcnJvci5tZXNzYWdlIOOBjOacquOCteODneODvOODiFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbWFrZUVycm9ySW5mbyhyZXN1bHRDb2RlLCB0YWcsIG1lc3NhZ2UsIF9jYXVzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcnJheUJ1ZmZlciB0byBCbG9iXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYnVmIHtBcnJheUJ1ZmZlcn0gW2luXSBBcnJheUJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICogQHBhcmFtIG1pbWVUeXBlIHtzdHJpbmd9IFtpbl0gTWltZVR5cGUgb2YgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jsb2J9IEJsb2IgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBhcnJheUJ1ZmZlclRvQmxvYihidWY6IEFycmF5QnVmZmVyLCBtaW1lVHlwZTogc3RyaW5nKTogQmxvYiB7XHJcbiAgICAgICAgICAgIGxldCBibG9iOiBCbG9iID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2JCdWlsZGVyT2JqZWN0OiBhbnkgPSBnZXRCbG9iQnVpbGRlcigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJsb2JCdWlsZGVyT2JqZWN0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2JCdWlsZGVyOiBhbnkgPSBuZXcgYmxvYkJ1aWxkZXJPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgIGJsb2JCdWlsZGVyLmFwcGVuZChidWYpO1xyXG4gICAgICAgICAgICAgICAgYmxvYiA9IGJsb2JCdWlsZGVyLmdldEJsb2IobWltZVR5cGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQW5kcm9pZCA0LjQgS2l0S2F0IENocm9taXVtIFdlYlZpZXdcclxuICAgICAgICAgICAgICAgIGJsb2IgPSBuZXcgZ2xvYmFsLkJsb2IoW2J1Zl0sIHsgdHlwZTogbWltZVR5cGUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJsb2I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCYXNlNjQgc3RyaW5nIHRvIEJsb2JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBiYXNlNjQge3N0cmluZ30gW2luXSBCYXNlNjQgc3RyaW5nIGRhdGFcclxuICAgICAgICAgKiBAcGFyYW0gbWltZVR5cGUge3N0cmluZ30gW2luXSBNaW1lVHlwZSBvZiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7QmxvYn0gQmxvYiBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NFRvQmxvYihiYXNlNjQ6IHN0cmluZywgbWltZVR5cGU6IHN0cmluZyk6IEJsb2Ige1xyXG4gICAgICAgICAgICBsZXQgYmxvYjogQmxvYiA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBibG9iQnVpbGRlck9iamVjdDogYW55ID0gZ2V0QmxvYkJ1aWxkZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChibG9iQnVpbGRlck9iamVjdCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBibG9iQnVpbGRlcjogYW55ID0gbmV3IGJsb2JCdWlsZGVyT2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICBibG9iQnVpbGRlci5hcHBlbmQoYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQpKTtcclxuICAgICAgICAgICAgICAgIGJsb2IgPSBibG9iQnVpbGRlci5nZXRCbG9iKG1pbWVUeXBlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIEFuZHJvaWQgNC40IEtpdEthdCBDaHJvbWl1bSBXZWJWaWV3XHJcbiAgICAgICAgICAgICAgICBibG9iID0gbmV3IGdsb2JhbC5CbG9iKFtiYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NCldLCB7IHR5cGU6IG1pbWVUeXBlIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBibG9iO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZGF0YS11cmwg5b2i5byP55S75YOP44GL44KJIEJsb2Ig44Kq44OW44K444Kn44Kv44OI44G45aSJ5o+bXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGRhdGFVcmwgICAgW2luXSBkYXRhIHVybFxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gW21pbWVUeXBlXSBbaW5dIG1pbWUgdHlwZSDjgpLmjIflrpouIOaXouWumuOBp+OBryBcImltYWdlL3BuZ1wiXHJcbiAgICAgICAgICogQHJldHVybiB7QmxvYn0gQmxvYiDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gZGF0YVVybFRvQmxvYihkYXRhVXJsOiBzdHJpbmcsIG1pbWVUeXBlOiBzdHJpbmcgPSBcImltYWdlL3BuZ1wiKTogQmxvYiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhc2U2NCA9IGRhdGFVcmwuc3BsaXQoXCIsXCIpWzFdO1xyXG4gICAgICAgICAgICByZXR1cm4gYmFzZTY0VG9CbG9iKGJhc2U2NCwgbWltZVR5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmFzZTY0IHN0cmluZyB0byBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJhc2U2NCB7c3RyaW5nfSBbaW5dIEJhc2U2NCBzdHJpbmcgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5QnVmZmVyfSBBcnJheUJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0OiBzdHJpbmcpOiBBcnJheUJ1ZmZlciB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0gd2luZG93LmF0b2IoYmFzZTY0KTtcclxuICAgICAgICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoYnl0ZXMubGVuZ3RoKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBVaW50OEFycmF5KGFycmF5QnVmZmVyKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBieXRlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVtpXSA9IGJ5dGVzLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5QnVmZmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQmFzZTY0IHN0cmluZyB0byBVaW50OEFycmF5XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYmFzZTY0IHtzdHJpbmd9IFtpbl0gQmFzZTY0IHN0cmluZyBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7VWludDhBcnJheX0gVWludDhBcnJheSBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGJhc2U2NFRvVWludDhBcnJheShlbmNvZGVkOiBzdHJpbmcpOiBVaW50OEFycmF5IHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSB3aW5kb3cuYXRvYihlbmNvZGVkKTtcclxuICAgICAgICAgICAgY29uc3QgZGF0YSA9IG5ldyBVaW50OEFycmF5KGJ5dGVzLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYnl0ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFbaV0gPSBieXRlcy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQXJyYXlCdWZmZXIgdG8gYmFzZTY0IHN0cmluZ1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGFycmF5QnVmZmVyIHtBcnJheUJ1ZmZlcn0gW2luXSBBcnJheUJ1ZmZlciBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBiYXNlNjQgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBhcnJheUJ1ZmZlclRvQmFzZTY0KGFycmF5QnVmZmVyOiBBcnJheUJ1ZmZlcik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xyXG4gICAgICAgICAgICByZXR1cm4gdWludDhBcnJheVRvQmFzZTY0KGJ5dGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVpbnQ4QXJyYXkgdG8gYmFzZTY0IHN0cmluZ1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJ5dGVzIHtVaW50OEFycmF5fSBbaW5dIFVpbnQ4QXJyYXkgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge3N0cmluZ30gYmFzZTY0IGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gdWludDhBcnJheVRvQmFzZTY0KGJ5dGVzOiBVaW50OEFycmF5KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGRhdGE6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYnl0ZXMuYnl0ZUxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuYnRvYShkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgQXJyYXlCdWZmZXJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8QXJyYXlCdWZmZXI+fSBwcm9taXNlIG9iamVjdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYjogQmxvYik6IElQcm9taXNlPEFycmF5QnVmZmVyPiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmNlbCA9ICgpID0+IHJlYWRlci5hYm9ydCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QobWFrZUVycm9ySW5mb0Zyb21ET01FcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0ZJTEVfUkVBREVSX0VSUk9SLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIuZXJyb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJGaWxlUmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKCkgZmFpbGVkLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpO1xyXG4gICAgICAgICAgICB9LCBjYW5jZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcmVhZCBCbG9iIGFzIFVpbnQ4QXJyYXlcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8VWludDhBcnJheT59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIHJlYWRCbG9iQXNVaW50OEFycmF5KGJsb2I6IEJsb2IpOiBJUHJvbWlzZTxVaW50OEFycmF5PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0LCBkZXBlbmRPbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVwZW5kT24ocmVhZEJsb2JBc0FycmF5QnVmZmVyKGJsb2IpKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHQ6IEFycmF5QnVmZmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUobmV3IFVpbnQ4QXJyYXkocmVzdWx0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yOiBFcnJvckluZm8pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgdGV4dCBzdHJpbmdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8VWludDhBcnJheT59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2I6IEJsb2IsIGVuY29kZTogc3RyaW5nID0gXCJ1dGYtOFwiKTogSVByb21pc2U8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhbmNlbCA9ICgpID0+IHJlYWRlci5hYm9ydCgpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QobWFrZUVycm9ySW5mb0Zyb21ET01FcnJvcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0ZJTEVfUkVBREVSX0VSUk9SLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIuZXJyb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJGaWxlUmVhZGVyLnJlYWRBc1RleHQoKSBmYWlsZWQuXCJcclxuICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChibG9iLCBlbmNvZGUpO1xyXG4gICAgICAgICAgICB9LCBjYW5jZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcmVhZCBCbG9iIGFzIERhdGEgVVJMXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtCbG9ifSBibG9iIFtpbl0gYmxvYiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7Q0RQLklQcm9taXNlPHN0cmluZz59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIHJlYWRCbG9iQXNEYXRhVVJMKGJsb2I6IEJsb2IpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4gcmVhZGVyLmFib3J0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChtYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkZpbGVSZWFkZXIucmVhZEFzRGF0YVVSTCgpIGZhaWxlZC5cIlxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGJsb2IpO1xyXG4gICAgICAgICAgICB9LCBjYW5jZWwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVVJMIE9iamVjdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7YW55fSBVUkwgT2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IFVSTCA9ICgoKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBnbG9iYWwuVVJMIHx8IGdsb2JhbC53ZWJraXRVUkw7XHJcbiAgICAgICAgfSkoKTtcclxuICAgIH1cclxufVxyXG4iLCIvKipcclxuICogQGZpbGUgIEJpbmFyeVRyYW5zcG9ydC50c1xyXG4gKiBAYnJpZWYgalF1ZXJ5IGFqYXggdHJhbnNwb3J0IGZvciBtYWtpbmcgYmluYXJ5IGRhdGEgdHlwZSByZXF1ZXN0cy5cclxuICpcclxuICogICAgICAgIG9yaWdpbmFsOiBodHRwczovL2dpdGh1Yi5jb20vaGVucnlhL2pzLWpxdWVyeS9ibG9iL21hc3Rlci9CaW5hcnlUcmFuc3BvcnQvanF1ZXJ5LmJpbmFyeXRyYW5zcG9ydC5qc1xyXG4gKiAgICAgICAgYXV0aG9yOiAgIEhlbnJ5IEFsZ3VzIDxoZW5yeWFsZ3VzQGdtYWlsLmNvbT5cclxuICovXHJcbm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG4gICAgLy8gU3VwcG9ydCBmaWxlIHByb3RvY29sLiAoYXMgc2FtZSBhcyBvZmZpY2lhbCB3YXkpXHJcbiAgICBjb25zdCB4aHJTdWNjZXNzU3RhdHVzID0ge1xyXG4gICAgICAgIDA6IDIwMCxcclxuICAgICAgICAxMjIzOiAyMDRcclxuICAgIH07XHJcblxyXG4gICAgJC5hamF4VHJhbnNwb3J0KFwiK2JpbmFyeVwiLCAob3B0aW9uczogSlF1ZXJ5LkFqYXhTZXR0aW5ncywgb3JpZ2luYWxPcHRpb25zOiBKUXVlcnkuQWpheFNldHRpbmdzLCBqcVhIUjogSlF1ZXJ5WEhSKSA9PiB7XHJcbiAgICAgICAgaWYgKGdsb2JhbC5Gb3JtRGF0YSAmJlxyXG4gICAgICAgICAgICAoKG9wdGlvbnMuZGF0YVR5cGUgJiYgKG9wdGlvbnMuZGF0YVR5cGUgPT09IFwiYmluYXJ5XCIpKSB8fFxyXG4gICAgICAgICAgICAob3B0aW9ucy5kYXRhICYmICgoZ2xvYmFsLkFycmF5QnVmZmVyICYmIG9wdGlvbnMuZGF0YSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB8fFxyXG4gICAgICAgICAgICAoZ2xvYmFsLkJsb2IgJiYgb3B0aW9ucy5kYXRhIGluc3RhbmNlb2YgZ2xvYmFsLkJsb2IpKSkpKSB7XHJcbiAgICAgICAgICAgIGxldCBhYm9ydENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2VuZDogZnVuY3Rpb24gKGhlYWRlcnM6IEpRdWVyeS5QbGFpbk9iamVjdCwgY2FsbGJhY2s6IEpRdWVyeS5UcmFuc3BvcnQuU3VjY2Vzc0NhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0dXAgYWxsIHZhcmlhYmxlc1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IG9wdGlvbnMudXJsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBvcHRpb25zLnR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXN5bmMgPSBvcHRpb25zLmFzeW5jIHx8IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJsb2Igb3IgYXJyYXlidWZmZXIuIERlZmF1bHQgaXMgYmxvYlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFUeXBlID0gKDxhbnk+b3B0aW9ucykucmVzcG9uc2VUeXBlIHx8IFwiYmxvYlwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSBvcHRpb25zLmRhdGEgfHwgbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VybmFtZSA9IG9wdGlvbnMudXNlcm5hbWUgfHwgbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXNzd29yZCA9IG9wdGlvbnMucGFzc3dvcmQgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgX2NhbGxiYWNrOiBKUXVlcnkuVHJhbnNwb3J0LlN1Y2Nlc3NDYWxsYmFjayA9IGNhbGxiYWNrIHx8ICgoKSA9PiB7IC8qIG5vb3AgKi8gfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHN1Y2NlZWRlZCBoYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX2RhdGEgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGFbb3B0aW9ucy5kYXRhVHlwZV0gPSB4aHIucmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jYWxsYmFjayhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoclN1Y2Nlc3NTdGF0dXNbeGhyLnN0YXR1c10gfHwgeGhyLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxKUXVlcnkuQWpheC5UZXh0U3RhdHVzPnhoci5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXJyb3IgaGFuZGxlclxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZGF0YVtvcHRpb25zLmRhdGFUeXBlXSA9IHhoci5yZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBjYWxsYmFjayBhbmQgc2VuZCBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jYWxsYmFjayhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SlF1ZXJ5LkFqYXguVGV4dFN0YXR1cz54aHIuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFib3J0IGhhbmRsZXJcclxuICAgICAgICAgICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX2RhdGEgPSB7fTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGFbb3B0aW9ucy5kYXRhVHlwZV0gPSB4aHIucmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgY2FsbGJhY2sgYW5kIHNlbmQgZGF0YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2FsbGJhY2soXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEpRdWVyeS5BamF4LlRleHRTdGF0dXM+eGhyLnN0YXR1c1RleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBhYm9ydCBjYWxsYmFja1xyXG4gICAgICAgICAgICAgICAgICAgIGFib3J0Q2FsbGJhY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHhoci5hYm9ydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5vcGVuKHR5cGUsIHVybCwgYXN5bmMsIHVzZXJuYW1lLCBwYXNzd29yZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNldHVwIGN1c3RvbSBoZWFkZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBpIGluIGhlYWRlcnMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoaSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGksIGhlYWRlcnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gZGF0YVR5cGU7XHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLnNlbmQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgYWJvcnQ6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYWJvcnRDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhYm9ydENhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlRvb2xzLkRhdGVUaW1lXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBEYXRlVGltZVxyXG4gICAgICogQGJyaWVmIOaZguWIu+aTjeS9nOOBruODpuODvOODhuOCo+ODquODhuOCo+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgRGF0ZVRpbWUge1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWfuueCueOBqOOBquOCi+aXpeS7mOOBi+OCieOAgW7ml6XlvozjgIFu5pel5YmN44KS566X5Ye6XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYmFzZSAgICB7RGF0ZX0gICBbaW5dIOWfuua6luaXpVxyXG4gICAgICAgICAqIEBwYXJhbSBhZGREYXlzIHtOdW1iZXJ9IFtpbl0g5Yqg566X5pelLiDjg57jgqTjg4rjgrnmjIflrprjgadu5pel5YmN44KC6Kit5a6a5Y+v6IO9XHJcbiAgICAgICAgICogQHJldHVybiB7RGF0ZX0g5pel5LuY44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb21wdXRlRGF0ZShiYXNlOiBEYXRlLCBhZGREYXlzOiBudW1iZXIpOiBEYXRlIHtcclxuICAgICAgICAgICAgY29uc3QgZHQgPSBuZXcgRGF0ZShiYXNlLmdldFRpbWUoKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhc2VTZWMgPSBkdC5nZXRUaW1lKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGFkZFNlYyA9IGFkZERheXMgKiA4NjQwMDAwMDsgICAgLy/ml6XmlbAgKiAx5pel44Gu44Of44Oq56eS5pWwXHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFNlYyA9IGJhc2VTZWMgKyBhZGRTZWM7XHJcbiAgICAgICAgICAgIGR0LnNldFRpbWUodGFyZ2V0U2VjKTtcclxuICAgICAgICAgICAgcmV0dXJuIGR0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBzdHJpbmcgdG8gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRlIHN0cmluZyBleCkgWVlZWS1NTS1ERFRISDptbTpTUy5TU1NcclxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb252ZXJ0SVNPU3RyaW5nVG9EYXRlKGRhdGVTdHJpbmc6IHN0cmluZyk6IERhdGUge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlVGltZSA9IGRhdGVTdHJpbmcuc3BsaXQoXCJUXCIpLFxyXG4gICAgICAgICAgICAgICAgZGF0ZUFycmF5ID0gZGF0ZVRpbWVbMF0uc3BsaXQoXCItXCIpO1xyXG4gICAgICAgICAgICBsZXQgdGltZUFycmF5LCBzZWNBcnJheSwgZGF0ZU9iamVjdDtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRlVGltZVsxXSkge1xyXG4gICAgICAgICAgICAgICAgdGltZUFycmF5ID0gZGF0ZVRpbWVbMV0uc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgICAgICAgICAgc2VjQXJyYXkgPSB0aW1lQXJyYXlbMl0uc3BsaXQoXCIuXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGltZUFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlT2JqZWN0ID0gbmV3IERhdGUoPGFueT5kYXRlQXJyYXlbMF0sIDxhbnk+ZGF0ZUFycmF5WzFdIC0gMSwgPGFueT5kYXRlQXJyYXlbMl0sXHJcbiAgICAgICAgICAgICAgICAgICAgPGFueT50aW1lQXJyYXlbMF0sIDxhbnk+dGltZUFycmF5WzFdLCA8YW55PnNlY0FycmF5WzBdLCA8YW55PnNlY0FycmF5WzFdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRlQXJyYXlbMl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRlT2JqZWN0ID0gbmV3IERhdGUoPGFueT5kYXRlQXJyYXlbMF0sIDxhbnk+ZGF0ZUFycmF5WzFdIC0gMSwgPGFueT5kYXRlQXJyYXlbMl0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRlQXJyYXlbMV0pIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRlT2JqZWN0ID0gbmV3IERhdGUoPGFueT5kYXRlQXJyYXlbMF0sIDxhbnk+ZGF0ZUFycmF5WzFdIC0gMSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGVPYmplY3QgPSBuZXcgRGF0ZSg8YW55PmRhdGVBcnJheVswXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkYXRlT2JqZWN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogIENvbnZlcnQgYSBkYXRlIG9iamVjdCBpbnRvIGEgc3RyaW5nIGluIFBNT0FQSSByZWNvcmRlZF9kYXRlIGZvcm1hdCh0aGUgSVNPIDg2MDEgRXh0ZW5kZWQgRm9ybWF0KVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGUgICB7RGF0ZX0gICBbaW5dIGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtIHRhcmdldCB7U3RyaW5nfSBbaW5dIHt5ZWFyIHwgbW9udGggfCBkYXRlIHwgaG91ciB8IG1pbiB8IHNlYyB8IG1zZWMgfVxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnZlcnREYXRlVG9JU09TdHJpbmcoZGF0ZTogRGF0ZSwgdGFyZ2V0OiBzdHJpbmcgPSBcIm1zZWNcIik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBpc29EYXRlU3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ5ZWFyXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibW9udGhcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaG91clwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1pblwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlY1wiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1zZWNcIjpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5rbm93biB0YXJnZXQ6IFwiICsgdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBcIm1zZWNcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXNvRGF0ZVN0cmluZyA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICAgICAgaWYgKFwieWVhclwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc29EYXRlU3RyaW5nICs9IChcIi1cIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0TW9udGgoKSArIDEpKTtcclxuICAgICAgICAgICAgaWYgKFwibW9udGhcIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXNvRGF0ZVN0cmluZyArPSAoXCItXCIgKyBEYXRlVGltZS5udW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhkYXRlLmdldERhdGUoKSkpO1xyXG4gICAgICAgICAgICBpZiAoXCJkYXRlXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlzb0RhdGVTdHJpbmcgKz0gKFwiVFwiICsgRGF0ZVRpbWUubnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcoZGF0ZS5nZXRIb3VycygpKSk7XHJcbiAgICAgICAgICAgIGlmIChcImhvdXJcIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXNvRGF0ZVN0cmluZyArPSAoXCI6XCIgKyBEYXRlVGltZS5udW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhkYXRlLmdldE1pbnV0ZXMoKSkpO1xyXG4gICAgICAgICAgICBpZiAoXCJtaW5cIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXNvRGF0ZVN0cmluZyArPSAoXCI6XCIgKyBEYXRlVGltZS5udW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhkYXRlLmdldFNlY29uZHMoKSkpO1xyXG4gICAgICAgICAgICBpZiAoXCJzZWNcIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXNvRGF0ZVN0cmluZyArPSAoXCIuXCIgKyBTdHJpbmcoKGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAwKS50b0ZpeGVkKDMpKS5zbGljZSgyLCA1KSk7XHJcbiAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENvbnZlcnQgZmlsZSBzeXN0ZW0gY29tcGF0aWJsZSBzdHJpbmcgdG8gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBkYXRlIHN0cmluZyBleCkgeXl5eV9NTV9kZFRISF9tbV9zc19TU1NcclxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IGRhdGUgb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb252ZXJ0RmlsZVN5c3RlbVN0cmluZ1RvRGF0ZShkYXRlU3RyaW5nOiBzdHJpbmcpOiBEYXRlIHtcclxuICAgICAgICAgICAgY29uc3QgZGF0ZVRpbWUgPSBkYXRlU3RyaW5nLnNwbGl0KFwiVFwiKSxcclxuICAgICAgICAgICAgICAgIGRhdGVBcnJheSA9IGRhdGVUaW1lWzBdLnNwbGl0KFwiX1wiKTtcclxuICAgICAgICAgICAgbGV0IHRpbWVBcnJheSwgZGF0ZU9iamVjdDtcclxuXHJcbiAgICAgICAgICAgIGlmIChkYXRlVGltZVsxXSkge1xyXG4gICAgICAgICAgICAgICAgdGltZUFycmF5ID0gZGF0ZVRpbWVbMV0uc3BsaXQoXCJfXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGltZUFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICBkYXRlT2JqZWN0ID0gbmV3IERhdGUoPGFueT5kYXRlQXJyYXlbMF0sIDxhbnk+ZGF0ZUFycmF5WzFdIC0gMSwgPGFueT5kYXRlQXJyYXlbMl0sXHJcbiAgICAgICAgICAgICAgICAgICAgPGFueT50aW1lQXJyYXlbMF0sIDxhbnk+dGltZUFycmF5WzFdLCA8YW55PnRpbWVBcnJheVsyXSwgPGFueT50aW1lQXJyYXlbM10pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGVBcnJheVsyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGVPYmplY3QgPSBuZXcgRGF0ZSg8YW55PmRhdGVBcnJheVswXSwgPGFueT5kYXRlQXJyYXlbMV0gLSAxLCA8YW55PmRhdGVBcnJheVsyXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGVBcnJheVsxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGVPYmplY3QgPSBuZXcgRGF0ZSg8YW55PmRhdGVBcnJheVswXSwgPGFueT5kYXRlQXJyYXlbMV0gLSAxKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZU9iamVjdCA9IG5ldyBEYXRlKDxhbnk+ZGF0ZUFycmF5WzBdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGVPYmplY3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiAgQ29udmVydCBhIGRhdGUgb2JqZWN0IGludG8gYSBzdHJpbmcgaW4gZmlsZSBzeXN0ZW0gY29tcGF0aWJsZSBmb3JtYXQoeXl5eV9NTV9kZFRISF9tbV9zc19TU1MpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGF0ZSAgIHtEYXRlfSAgIFtpbl0gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IHtTdHJpbmd9IFtpbl0ge3llYXIgfCBtb250aCB8IGRhdGUgfCBob3VyIHwgbWluIHwgc2VjIHwgbXNlYyB9XHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udmVydERhdGVUb0ZpbGVTeXN0ZW1TdHJpbmcoZGF0ZTogRGF0ZSwgdGFyZ2V0OiBzdHJpbmcgPSBcIm1zZWNcIik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBmaWxlU3lzdGVtU3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoICh0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ5ZWFyXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibW9udGhcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJkYXRlXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiaG91clwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1pblwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNlY1wiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm1zZWNcIjpcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5rbm93biB0YXJnZXQ6IFwiICsgdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQgPSBcIm1zZWNcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlsZVN5c3RlbVN0cmluZyA9IGRhdGUuZ2V0RnVsbFllYXIoKTtcclxuICAgICAgICAgICAgaWYgKFwieWVhclwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlU3lzdGVtU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWxlU3lzdGVtU3RyaW5nICs9IChcIl9cIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0TW9udGgoKSArIDEpKTtcclxuICAgICAgICAgICAgaWYgKFwibW9udGhcIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZVN5c3RlbVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlsZVN5c3RlbVN0cmluZyArPSAoXCJfXCIgKyBEYXRlVGltZS5udW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhkYXRlLmdldERhdGUoKSkpO1xyXG4gICAgICAgICAgICBpZiAoXCJkYXRlXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW1TdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHJpbmcgKz0gKFwiVFwiICsgRGF0ZVRpbWUubnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcoZGF0ZS5nZXRIb3VycygpKSk7XHJcbiAgICAgICAgICAgIGlmIChcImhvdXJcIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZVN5c3RlbVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlsZVN5c3RlbVN0cmluZyArPSAoXCJfXCIgKyBEYXRlVGltZS5udW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhkYXRlLmdldE1pbnV0ZXMoKSkpO1xyXG4gICAgICAgICAgICBpZiAoXCJtaW5cIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZVN5c3RlbVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlsZVN5c3RlbVN0cmluZyArPSAoXCJfXCIgKyBEYXRlVGltZS5udW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhkYXRlLmdldFNlY29uZHMoKSkpO1xyXG4gICAgICAgICAgICBpZiAoXCJzZWNcIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZVN5c3RlbVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlsZVN5c3RlbVN0cmluZyArPSAoXCJfXCIgKyBTdHJpbmcoKGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAwKS50b0ZpeGVkKDMpKS5zbGljZSgyLCA1KSk7XHJcbiAgICAgICAgICAgIHJldHVybiBmaWxlU3lzdGVtU3RyaW5nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIHN0YXRpYyBtZXRob2RcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBudW0gdG8gc3RyaW5nKGRvdWJsZSBkaWdpdHMpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IG51bWJlciAoMCA8bnVtYmVyIDwgMTAwKVxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gZG91YmxlIGRpZ2l0cyBzdHJpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBudW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhudW06IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChudW0gPCAwIHx8IG51bSA+IDEwMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG51bSA8IDEwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIwXCIgKyBudW07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFwiXCIgKyBudW07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwianF1ZXJ5XCIgLz5cclxuXHJcbm5hbWVzcGFjZSBDRFAuVG9vbHMge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5Ub29scy5UZW1wbGF0ZV0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEpTVFxyXG4gICAgICogQGJyaWVmIOOCs+ODs+ODkeOCpOODq+a4iOOBvyDjg4bjg7Pjg5fjg6zjg7zjg4jmoLzntI3jgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBKU1Qge1xyXG4gICAgICAgIChkYXRhPzogYW55KTogc3RyaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgVGVtcGxhdGVcclxuICAgICAqIEBicmllZiB0ZW1wbGF0ZSBzY3JpcHQg44KS566h55CG44GZ44KL44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBUZW1wbGF0ZSB7XHJcblxyXG4gICAgICAgIHN0YXRpYyBfbWFwRWxlbWVudDogYW55OyAgICAvLyE8IOOCreODvOOBqCBKUXVlcnkgRWxlbWVudCDjga4gTWFwIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgIHN0YXRpYyBfbWFwU291cmNlOiBhbnk7ICAgICAvLyE8IFVSTCDjgagg44K944O844K544OV44Kh44Kk44OrKEhUTUwpIOOBriBNYXAg44Kq44OW44K444Kn44Kv44OIXHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8g5YWs6ZaL44Oh44K944OD44OJXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBnyBpZCwgY2xhc3Mg5ZCNLCBUYWcg5ZCN44KS44Kt44O844Gr44OG44Oz44OX44Os44O844OI44GuIEpRdWVyeSBFbGVtZW50IOOCkuWPluW+l+OBmeOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICBrZXkgICAgIFtpbl0gaWQsIGNsYXNzLCB0YWcg44KS6KGo44GZ5paH5a2X5YiXXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICBbc3JjXSAgIFtpbl0g5aSW6YOoIGh0bWwg44KS5oyH5a6a44GZ44KL5aC05ZCI44GvIHVybCDjgpLoqK3lrppcclxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtjYWNoZV0gW2luXSBzcmMgaHRtbCDjgpLjgq3jg6Pjg4Pjgrfjg6XjgZnjgovloLTlkIjjga8gdHJ1ZS4gc3JjIOOBjOaMh+WumuOBleOCjOOBpuOBhOOCi+OBqOOBjeOBruOBv+acieWKuVxyXG4gICAgICAgICAqIEByZXR1cm4gdGVtcGxhdGUg44GM5qC857SN44GV44KM44Gm44GE44KLIEpRdWVyeSBFbGVtZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGdldFRlbXBsYXRlRWxlbWVudChrZXk6IHN0cmluZywgc3JjOiBzdHJpbmcgPSBudWxsLCBjYWNoZTogYm9vbGVhbiA9IHRydWUpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICBjb25zdCBtYXBFbGVtZW50ID0gVGVtcGxhdGUuZ2V0RWxlbWVudE1hcCgpO1xyXG4gICAgICAgICAgICBsZXQgJGVsZW1lbnQgPSBtYXBFbGVtZW50W2tleV07XHJcblxyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCEkZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaHRtbCA9IFRlbXBsYXRlLmZpbmRIdG1sRnJvbVNvdXJjZShzcmMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZWxlbWVudCA9ICQoaHRtbCkuZmluZChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50ID0gJChrZXkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyDopoHntKDjga7mpJzoqLxcclxuICAgICAgICAgICAgICAgICAgICBpZiAoJGVsZW1lbnQgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAoXCJpbnZhbGlkIFtrZXksIHNyY10gPSBbXCIgKyBrZXkgKyBcIiwgXCIgKyBzcmMgKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzcmMgJiYgY2FjaGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFwRWxlbWVudFtrZXldID0gJGVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChleGNlcHRpb24pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgZXhjZXB0aW9uKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYXAg44Kq44OW44K444Kn44Kv44OI44Gu5YmK6ZmkXHJcbiAgICAgICAgICog5piO56S655qE44Gr44Kt44Oj44OD44K344Ol44KS6ZaL5pS+44GZ44KL5aC05ZCI44Gv5pys44Oh44K944OD44OJ44KS44Kz44O844Or44GZ44KLXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGVtcHR5KCk6IHZvaWQge1xyXG4gICAgICAgICAgICBUZW1wbGF0ZS5fbWFwRWxlbWVudCA9IG51bGw7XHJcbiAgICAgICAgICAgIFRlbXBsYXRlLl9tYXBTb3VyY2UgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44GfIGlkLCBjbGFzcyDlkI0sIFRhZyDlkI3jgpLjgq3jg7zjgasgSlNUIOOCkuWPluW+l+OBmeOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmcgfCBqUXVlcnl9IGtleSAgICAgW2luXSBpZCwgY2xhc3MsIHRhZyDjgpLooajjgZnmloflrZfliJcg44G+44Gf44GvIOODhuODs+ODl+ODrOODvOODiOaWh+Wtl+WIlywg44G+44Gf44GvIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgW3NyY10gICBbaW5dIOWklumDqCBodG1sIOOCkuaMh+WumuOBmeOCi+WgtOWQiOOBryB1cmwg44KS6Kit5a6aXHJcbiAgICAgICAgICogQHBhcmFtIHtCb29sZWFufSAgICAgICAgIFtjYWNoZV0gW2luXSBzcmMgaHRtbCDjgpLjgq3jg6Pjg4Pjgrfjg6XjgZnjgovloLTlkIjjga8gdHJ1ZS4gc3JjIOOBjOaMh+WumuOBleOCjOOBpuOBhOOCi+OBqOOBjeOBruOBv+acieWKuVxyXG4gICAgICAgICAqIEByZXR1cm4g44Kz44Oz44OR44Kk44Or44GV44KM44GfIEpTVCDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgZ2V0SlNUKGtleTogSlF1ZXJ5KTogSlNUO1xyXG4gICAgICAgIHN0YXRpYyBnZXRKU1Qoa2V5OiBzdHJpbmcsIHNyYz86IHN0cmluZywgY2FjaGU/OiBib29sZWFuKTogSlNUO1xyXG4gICAgICAgIHN0YXRpYyBnZXRKU1Qoa2V5OiBhbnksIHNyYz86IHN0cmluZywgY2FjaGU/OiBib29sZWFuKTogSlNUIHtcclxuICAgICAgICAgICAgbGV0IHRlbXBsYXRlOiBhbnkgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQganN0OiBKU1Q7XHJcbiAgICAgICAgICAgIGxldCAkZWxlbWVudDogSlF1ZXJ5O1xyXG4gICAgICAgICAgICBpZiAoa2V5IGluc3RhbmNlb2YgalF1ZXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbWVudCA9IGtleTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRlbGVtZW50ID0gVGVtcGxhdGUuZ2V0VGVtcGxhdGVFbGVtZW50KGtleSwgc3JjLCBjYWNoZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gZ2xvYmFsLkhvZ2FuKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IEhvZ2FuLmNvbXBpbGUoJGVsZW1lbnQudGV4dCgpKTtcclxuICAgICAgICAgICAgICAgIGpzdCA9IGZ1bmN0aW9uIChkYXRhPzogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUucmVuZGVyKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChudWxsICE9IGdsb2JhbC5fKSB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZSA9IF8udGVtcGxhdGUoJGVsZW1lbnQuaHRtbCgpKTtcclxuICAgICAgICAgICAgICAgIGpzdCA9IGZ1bmN0aW9uIChkYXRhPzogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDmlLnooYzjgajjgr/jg5bjga/liYrpmaTjgZnjgotcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUoZGF0YSkucmVwbGFjZSgvXFxufFxcdC9nLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJjYW5ub3QgZmluZCB0ZW1wbGF0ZSBlbmdpbmUgbW9kdWxlLlwiKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcIiAgICAnaG9nYW4nIG9yICd1bmRlcnNjb3JlJyBpcyByZXF1aXJlZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGpzdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8g5YaF6YOo44Oh44K944OD44OJXHJcblxyXG4gICAgICAgIC8vISBFbGVtZW50IE1hcCDjgqrjg5bjgrjjgqfjgq/jg4jjga7lj5blvpdcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBnZXRFbGVtZW50TWFwKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghVGVtcGxhdGUuX21hcEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIFRlbXBsYXRlLl9tYXBFbGVtZW50ID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFRlbXBsYXRlLl9tYXBFbGVtZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFVSTCBNYXAg44Kq44OW44K444Kn44Kv44OI44Gu5Y+W5b6XXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZ2V0U291cmNlTWFwKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghVGVtcGxhdGUuX21hcFNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgVGVtcGxhdGUuX21hcFNvdXJjZSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBUZW1wbGF0ZS5fbWFwU291cmNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFVSTCBNYXAg44GL44KJIEhUTUwg44KS5qSc57SiLiDlpLHmlZfjgZfjgZ/loLTlkIjjga8gdW5kZWZpbmVkIOOBjOi/lOOCi1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGZpbmRIdG1sRnJvbVNvdXJjZShzcmM6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcFNvdXJjZSA9IFRlbXBsYXRlLmdldFNvdXJjZU1hcCgpO1xyXG4gICAgICAgICAgICBsZXQgaHRtbCA9IG1hcFNvdXJjZVtzcmNdO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFodG1sKSB7XHJcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwiaHRtbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHRtbCA9IGRhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogKGRhdGE6IGFueSwgc3RhdHVzOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgKFwiYWpheCByZXF1ZXN0IGZhaWxlZC4gc3RhdHVzOiBcIiArIHN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyDjgq3jg6Pjg4Pjgrfjg6XjgavmoLzntI1cclxuICAgICAgICAgICAgICAgIG1hcFNvdXJjZVtzcmNdID0gaHRtbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaHRtbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiZGVjbGFyZSBtb2R1bGUgXCJjZHAudG9vbHNcIiB7XHJcbiAgICBjb25zdCBUb29sczogdHlwZW9mIENEUC5Ub29scztcclxuICAgIGV4cG9ydCA9IFRvb2xzO1xyXG59XHJcbiJdfQ==