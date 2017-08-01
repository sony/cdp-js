/*!
 * cdp.tools.js 2.0.0
 *
 * Date: 2017-08-01T11:22:15.611Z
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
        var ProgressCounter = (function () {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVG9vbHMvRXJyb3JEZWZzLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9GdW5jdGlvbnMudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL0Jsb2IudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL0JpbmFyeVRyYW5zcG9ydC50cyIsImNkcDovLy9DRFAvVG9vbHMvRGF0ZVRpbWUudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL1RlbXBsYXRlLnRzIiwiY2RwOi8vL0NEUC9Ub29scy9Qcm9ncmVzc0NvdW50ZXIudHMiLCJjZHA6Ly8vQ0RQL1Rvb2xzL0ludGVyZmFjZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBVSxHQUFHLENBcUNaO0FBckNELFdBQVUsR0FBRztJQUVUOzs7T0FHRztJQUNILElBQVksZ0JBR1g7SUFIRCxXQUFZLGdCQUFnQjtRQUN4Qiw2RkFBMkI7UUFDM0IsaURBQVksQ0FBQyxHQUFHLGdDQUE0QjtJQUNoRCxDQUFDLEVBSFcsZ0JBQWdCLEdBQWhCLG9CQUFnQixLQUFoQixvQkFBZ0IsUUFHM0I7SUFFRCx1RUFBdUU7SUFDdkUsNEJBQTRCO0lBRTVCLElBQU0sbUJBQW1CLEdBQUcsRUFBRSxDQUFDO0lBRS9COzs7T0FHRztJQUNILElBQUssZUFHSjtJQUhELFdBQUssZUFBZTtRQUNoQiwrREFBZTtRQUNmLDBDQUFjLENBQUMsR0FBRyxtQkFBbUI7SUFDekMsQ0FBQyxFQUhJLGVBQWUsS0FBZixlQUFlLFFBR25CO0lBRUQsb0NBQW9DO0lBQ3BDOzs7T0FHRztJQUNILElBQVksV0FLWDtJQUxELFdBQVksV0FBVztRQUNuQiwyRkFBdUM7UUFDdkMsK0RBQXNDLHNCQUFrQixDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUyxHQUFHLENBQUMsRUFBRSxvQkFBb0IsQ0FBQztRQUN6SSwyREFBc0Msc0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGVBQWUsQ0FBQyxTQUFTLEdBQUcsQ0FB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QUFDO29CQUNKLFVBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztnQkFDL0MsQ0FBQztnQkFFRCxNQUFNLENBQUMsRUFBRSxRQUFRLFlBQUUsVUFBVSxjQUFFLENBQUM7WUFDcEMsQ0FBQztZQUNMLHNCQUFDO1FBQUQsQ0FBQztRQXREWSxxQkFBZSxrQkFzRDNCO0lBQ0wsQ0FBQyxFQWxGYSxLQUFLLEdBQUwsU0FBSyxLQUFMLFNBQUssUUFrRmxCO0FBQUQsQ0FBQyxFQWxGUyxHQUFHLEtBQUgsR0FBRyxRQWtGWiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBDRFAge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVudW0gIFJFU1VMVF9DT0RFX0JBU0VcclxuICAgICAqIEBicmllZiDjg6rjgrbjg6vjg4jjgrPjg7zjg4njga7jgqrjg5Xjgrvjg4Pjg4jlgKRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREVfQkFTRSB7XHJcbiAgICAgICAgQ0RQX1RPT0xTX0RFQ0xBUkVSQVRJT04gPSAwLCAgICAvLyBUUzI0MzIg5a++562WXHJcbiAgICAgICAgQ0RQX1RPT0xTID0gNCAqIE1PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRV9DRFAsXHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIG1vZHVsZSBlcnJvciBkZWNsYXJhdGlvbjpcclxuXHJcbiAgICBjb25zdCBGVU5DVElPTl9DT0RFX1JBTkdFID0gMTA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW51bSAgTE9DQUxfQ09ERV9CQVNFXHJcbiAgICAgKiBAYnJpZWYgY2RwLnRvb2xzIOWGheOBruODreODvOOCq+ODq+OCs+ODvOODieOCquODleOCu+ODg+ODiOWApFxyXG4gICAgICovXHJcbiAgICBlbnVtIExPQ0FMX0NPREVfQkFTRSB7XHJcbiAgICAgICAgRlVOQ1RJT05TICAgPSAwLFxyXG4gICAgICAgIEJMT0IgICAgICAgID0gMSAqIEZVTkNUSU9OX0NPREVfUkFOR0UsXHJcbiAgICB9XHJcblxyXG4gICAgLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcbiAgICAvKipcclxuICAgICAqIEBlbnVtICBSRVNVTFRfQ09ERVxyXG4gICAgICogQGJyaWVmIGNkcC50b29scyDjga7jgqjjg6njg7zjgrPjg7zjg4nlrprnvqlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGVudW0gUkVTVUxUX0NPREUge1xyXG4gICAgICAgIEVSUk9SX0NEUF9UT09MU19ERUNMQVJBVElPTiAgICAgICAgID0gMCwgLy8gVFMyNDMyIOWvvuetllxyXG4gICAgICAgIEVSUk9SX0NEUF9UT09MU19JTUFHRV9MT0FEX0ZBSUxFRCAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX1RPT0xTLCBMT0NBTF9DT0RFX0JBU0UuRlVOQ1RJT05TICsgMSwgXCJpbWFnZSBsb2FkIGZhaWxlZC5cIiksXHJcbiAgICAgICAgRVJST1JfQ0RQX1RPT0xTX0lOVkFMSURfSU1BR0UgICAgICAgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfVE9PTFMsIExPQ0FMX0NPREVfQkFTRS5GVU5DVElPTlMgKyAyLCBcImludmFsaWQgaW1hZ2UuXCIpLFxyXG4gICAgICAgIEVSUk9SX0NEUF9UT09MU19GSUxFX1JFQURFUl9FUlJPUiAgID0gREVDTEFSRV9FUlJPUl9DT0RFKFJFU1VMVF9DT0RFX0JBU0UuQ0RQX1RPT0xTLCBMT0NBTF9DT0RFX0JBU0UuQkxPQiArIDEsIFwiRmlsZVJlYWRlciBtZXRob2QgZmFpbGVkLlwiKSxcclxuICAgIH1cclxuICAgIC8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJqcXVlcnlcIiAvPlxyXG5cclxubmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgaW1wb3J0IFByb21pc2UgPSBDRFAuUHJvbWlzZTtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuRnVuY3Rpb25zXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGguYWJzIOOCiOOCiuOCgumrmOmAn+OBqiBhYnNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGFicyh4OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB4ID49IDAgPyB4IDogLXg7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRoLm1heCDjgojjgorjgoLpq5jpgJ/jgaogbWF4XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBtYXgobGhzOiBudW1iZXIsIHJoczogbnVtYmVyKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gbGhzID49IHJocyA/IGxocyA6IHJocztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGgubWluIOOCiOOCiuOCgumrmOmAn+OBqiBtaW5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1pbihsaHM6IG51bWJlciwgcmhzOiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBsaHMgPD0gcmhzID8gbGhzIDogcmhzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pWw5YCk44KSIDAg6Kmw44KB44GX44Gm5paH5a2X5YiX44KS55Sf5oiQXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiB0b1plcm9QYWRkaW5nKG5vOiBudW1iZXIsIGxpbWl0OiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgICAgIGxldCBzaWduZWQgPSBcIlwiO1xyXG4gICAgICAgIG5vID0gTnVtYmVyKG5vKTtcclxuXHJcbiAgICAgICAgaWYgKGlzTmFOKG5vKSB8fCBpc05hTihsaW1pdCkgfHwgbGltaXQgPD0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChubyA8IDApIHtcclxuICAgICAgICAgICAgbm8gPSBUb29scy5hYnMobm8pO1xyXG4gICAgICAgICAgICBzaWduZWQgPSBcIi1cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzaWduZWQgKyAoQXJyYXkobGltaXQpLmpvaW4oXCIwXCIpICsgbm8pLnNsaWNlKC1saW1pdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlpJrph43ntpnmib/jga7jgZ/jgoHjga7lrp/ooYzmmYLntpnmib/plqLmlbBcclxuICAgICAqXHJcbiAgICAgKiBTdWIgQ2xhc3Mg5YCZ6KOc44Kq44OW44K444Kn44Kv44OI44Gr5a++44GX44GmIFN1cGVyIENsYXNzIOWAmeijnOOCquODluOCuOOCp+OCr+ODiOOCkuebtOWJjeOBriBTdXBlciBDbGFzcyDjgajjgZfjgabmjL/lhaXjgZnjgovjgIJcclxuICAgICAqIHByb3RvdHlwZSDjga7jgb/jgrPjg5Tjg7zjgZnjgovjgIJcclxuICAgICAqIOOCpOODs+OCueOCv+ODs+OCueODoeODs+ODkOOCkuOCs+ODlOODvOOBl+OBn+OBhOWgtOWQiOOAgVN1cGVyIENsYXNzIOOBjOeWkeS8vOOCs+ODs+OCueODiOODqeOCr+OCv+OCkuaPkOS+m+OBmeOCi+W/heimgeOBjOOBguOCi+OAglxyXG4gICAgICog6Kmz57Sw44GvIGNkcC50b29scy5GdW5jdGlvbnMuc3BlYy50cyDjgpLlj4LnhafjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc3ViQ2xhc3MgICB7Y29uc3RydWN0b3J9IFtpbl0g44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIHN1cGVyQ2xhc3Mge2NvbnN0cnVjdG9yfSBbaW5dIOOCquODluOCuOOCp+OCr+ODiOOBriBjb25zdHJ1Y3RvciDjgpLmjIflrppcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaGVyaXQoc3ViQ2xhc3M6IGFueSwgc3VwZXJDbGFzczogYW55KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgX3Byb3RvdHlwZSA9IHN1YkNsYXNzLnByb3RvdHlwZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2luaGVyaXQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBzdWJDbGFzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgX2luaGVyaXQucHJvdG90eXBlID0gc3VwZXJDbGFzcy5wcm90b3R5cGU7XHJcbiAgICAgICAgc3ViQ2xhc3MucHJvdG90eXBlID0gbmV3IF9pbmhlcml0KCk7XHJcblxyXG4gICAgICAgICQuZXh0ZW5kKHN1YkNsYXNzLnByb3RvdHlwZSwgX3Byb3RvdHlwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtaXhpbiDplqLmlbBcclxuICAgICAqXHJcbiAgICAgKiBUeXBlU2NyaXB0IE9mZmljaWFsIFNpdGUg44Gr6LyJ44Gj44Gm44GE44KLIG1peGluIOmWouaVsFxyXG4gICAgICogaHR0cDovL3d3dy50eXBlc2NyaXB0bGFuZy5vcmcvSGFuZGJvb2sjbWl4aW5zXHJcbiAgICAgKiDml6LjgavlrprnvqnjgZXjgozjgabjgYTjgovjgqrjg5bjgrjjgqfjgq/jg4jjgYvjgonjgIHmlrDopo/jgavjgqrjg5bjgrjjgqfjgq/jg4jjgpLlkIjmiJDjgZnjgovjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGVyaXZlZCB7Y29uc3RydWN0b3J9ICAgIFtpbl0g5ZCI5oiQ44GV44KM44KL44Kq44OW44K444Kn44Kv44OI44GuIGNvbnN0cnVjdG9yIOOCkuaMh+WumlxyXG4gICAgICogQHBhcmFtIGJhc2VzICAge2NvbnN0cnVjdG9yLi4ufSBbaW5dIOWQiOaIkOWFg+OCquODluOCuOOCp+OCr+ODiOOBriBjb25zdHJ1Y3RvciDjgpLmjIflrpogKOWPr+WkieW8leaVsClcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1peGluKGRlcml2ZWQ6IGFueSwgLi4uYmFzZXM6IGFueVtdKTogdm9pZCB7XHJcbiAgICAgICAgYmFzZXMuZm9yRWFjaCgoYmFzZSkgPT4ge1xyXG4gICAgICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlLnByb3RvdHlwZSkuZm9yRWFjaChuYW1lID0+IHtcclxuICAgICAgICAgICAgICAgIGRlcml2ZWQucHJvdG90eXBlW25hbWVdID0gYmFzZS5wcm90b3R5cGVbbmFtZV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogSGVscGVyIGZ1bmN0aW9uIHRvIGNvcnJlY3RseSBzZXQgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiwgZm9yIHN1YmNsYXNzZXMuXHJcbiAgICAgKiBUaGUgZnVuY3Rpb24gYmVoYXZpb3IgaXMgc2FtZSBhcyBleHRlbmQoKSBmdW5jdGlvbiBvZiBCYWNrYm9uZS5qcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcHJvdG9Qcm9wcyAge09iamVjdH0gW2luXSBzZXQgcHJvdG90eXBlIHByb3BlcnRpZXMgYXMgb2JqZWN0LlxyXG4gICAgICogQHBhcmFtIHN0YXRpY1Byb3BzIHtPYmplY3R9IFtpbl0gc2V0IHN0YXRpYyBwcm9wZXJ0aWVzIGFzIG9iamVjdC5cclxuICAgICAqIEByZXR1cm4ge09iamVjdH0gc3ViY2xhc3MgY29uc3RydWN0b3IuXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIOOCr+ODqeOCuee2meaJv+OBruOBn+OCgeOBruODmOODq+ODkeODvOmWouaVsFxyXG4gICAgICogQmFja2JvbmUuanMgZXh0ZW5kKCkg6Zai5pWw44Go5ZCM562JXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHByb3RvUHJvcHMgIHtPYmplY3R9IFtpbl0gcHJvdG90eXBlIHByb3BlcnRpZXMg44KS44Kq44OW44K444Kn44Kv44OI44Gn5oyH5a6aXHJcbiAgICAgKiBAcGFyYW0gc3RhdGljUHJvcHMge09iamVjdH0gW2luXSBzdGF0aWMgcHJvcGVydGllcyDjgpLjgqrjg5bjgrjjgqfjgq/jg4jjgafmjIflrppcclxuICAgICAqIEByZXR1cm4ge09iamVjdH0g44K144OW44Kv44Op44K544Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBleHRlbmQocHJvdG9Qcm9wczogb2JqZWN0LCBzdGF0aWNQcm9wcz86IG9iamVjdCk6IG9iamVjdCB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcztcclxuICAgICAgICBsZXQgY2hpbGQ7XHJcblxyXG4gICAgICAgIGlmIChwcm90b1Byb3BzICYmIHByb3RvUHJvcHMuaGFzT3duUHJvcGVydHkoXCJjb25zdHJ1Y3RvclwiKSkge1xyXG4gICAgICAgICAgICBjaGlsZCA9IHByb3RvUHJvcHMuY29uc3RydWN0b3I7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY2hpbGQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyZW50LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLmV4dGVuZChjaGlsZCwgcGFyZW50LCBzdGF0aWNQcm9wcyk7XHJcblxyXG4gICAgICAgIGNvbnN0IFN1cnJvZ2F0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgU3Vycm9nYXRlLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7XHJcbiAgICAgICAgY2hpbGQucHJvdG90eXBlID0gbmV3IFN1cnJvZ2F0ZTtcclxuXHJcbiAgICAgICAgaWYgKHByb3RvUHJvcHMpIHtcclxuICAgICAgICAgICAgJC5leHRlbmQoY2hpbGQucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7XHJcblxyXG4gICAgICAgIHJldHVybiBjaGlsZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERQSSDlj5blvpdcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldERldmljZVBpeGNlbFJhdGlvKCk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IG1lZGlhUXVlcnk7XHJcbiAgICAgICAgY29uc3QgaXNfZmlyZWZveCA9IG5hdmlnYXRvci51c2VyQWdlbnQudG9Mb3dlckNhc2UoKS5pbmRleE9mKFwiZmlyZWZveFwiKSA+IC0xO1xyXG4gICAgICAgIGlmIChudWxsICE9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvICYmICFpc19maXJlZm94KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICB9IGVsc2UgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKSB7XHJcbiAgICAgICAgICAgIG1lZGlhUXVlcnkgPVxyXG4gICAgICAgICAgICAgICAgXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAxLjUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi0tbW96LWRldmljZS1waXhlbC1yYXRpbzogMS41KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAzLzIpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi1yZXNvbHV0aW9uOiAxLjVkcHB4KVwiO1xyXG4gICAgICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDEuNTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtZWRpYVF1ZXJ5ID1cclxuICAgICAgICAgICAgICAgIFwiKC13ZWJraXQtbWluLWRldmljZS1waXhlbC1yYXRpbzogMiksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLS1tb3otZGV2aWNlLXBpeGVsLXJhdGlvOiAyKSxcXFxyXG4gICAgICAgICAgICAgICAgICAgICgtby1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAyLzEpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKG1pbi1yZXNvbHV0aW9uOiAyZHBweClcIjtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKG1lZGlhUXVlcnkpLm1hdGNoZXMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1lZGlhUXVlcnkgPVxyXG4gICAgICAgICAgICAgICAgXCIoLXdlYmtpdC1taW4tZGV2aWNlLXBpeGVsLXJhdGlvOiAwLjc1KSxcXFxyXG4gICAgICAgICAgICAgICAgICAgIChtaW4tLW1vei1kZXZpY2UtcGl4ZWwtcmF0aW86IDAuNzUpLFxcXHJcbiAgICAgICAgICAgICAgICAgICAgKC1vLW1pbi1kZXZpY2UtcGl4ZWwtcmF0aW86IDMvNCksXFxcclxuICAgICAgICAgICAgICAgICAgICAobWluLXJlc29sdXRpb246IDAuNzVkcHB4KVwiO1xyXG4gICAgICAgICAgICBpZiAod2luZG93Lm1hdGNoTWVkaWEobWVkaWFRdWVyeSkubWF0Y2hlcykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAuNztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDYW52YXMgZWxlbWVudCDjga7jgq3jg6Pjg4Pjgrfjg6VcclxuICAgIGxldCBzX2NhbnZhc0ZhY3Rvcnk6IEhUTUxDYW52YXNFbGVtZW50O1xyXG5cclxuICAgIC8vIOOCreODo+ODg+OCt+ODpea4iOOBv+OBriBDYW52YXMg44KS5Y+W5b6X44GZ44KLXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q2FudmFzKCk6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgICAgICBzX2NhbnZhc0ZhY3RvcnkgPSBzX2NhbnZhc0ZhY3RvcnkgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcclxuICAgICAgICByZXR1cm4gPEhUTUxDYW52YXNFbGVtZW50PnNfY2FudmFzRmFjdG9yeS5jbG9uZU5vZGUoZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog55S75YOP44Oq44K944O844K544Gu44Ot44O844OJ5a6M5LqG44KS5L+d6Ki8XHJcbiAgICAgKiDjg5bjg6njgqbjgrbml6Llrprjga7jg5fjg63jgrDjg6zjg4Pjgrfjg5bjg63jg7zjg4njgpLotbDjgonjgZvjgarjgYTjgZ/jgoEuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSB1cmwgW2luXSB1cmwgKGRhdGEtdXJsKVxyXG4gICAgICogQHJldHVybiB7SVByb21pc2U8c3RyaW5nPn0g6KGo56S65Y+v6IO944GqIHVybFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZW5zdXJlSW1hZ2VMb2FkZWQodXJsOiBzdHJpbmcpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpbWcpIHtcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBcIlwiOyAgIC8vIOiqreOBv+i+vOOBv+WBnOatolxyXG4gICAgICAgICAgICAgICAgaW1nID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHVybCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWcub25lcnJvciA9IChldmVudDogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHJlamVjdChtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19JTUFHRV9MT0FEX0ZBSUxFRCxcclxuICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpbWFnZSBsb2FkIGZhaWxlZC4gW3VybDogXCIgKyB1cmwgKyBcIl1cIlxyXG4gICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpbWcuc3JjID0gdXJsO1xyXG5cclxuICAgICAgICB9LCBkZXN0cm95KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOeUu+WDj+OBruODquOCteOCpOOCulxyXG4gICAgICog5oyH5a6a44GX44Gf6ZW36L6644Gu6ZW344GV44Gr44Ki44K544Oa44Kv44OI5q+U44KS57at5oyB44GX44Gm44Oq44K144Kk44K644KS6KGM44GGXHJcbiAgICAgKiBsb25nU2lkZUxlbmd0aCDjgojjgorlsI/jgZXjgarloLTlkIjjga/jgqrjg6rjgrjjg4rjg6vjgrXjgqTjgrrjgacgZGF0YS11cmwg44KS6L+U5Y2044GZ44KLXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBzcmMgICAgICAgICAgICBbaW5dIGltYWdlIOOBq+aMh+WumuOBmeOCi+OCveODvOOCuVxyXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSBsb25nU2lkZUxlbmd0aCBbaW5dIOODquOCteOCpOOCuuOBq+S9v+eUqOOBmeOCi+mVt+i+uuOBruacgOWkp+WApOOCkuaMh+WumlxyXG4gICAgICogQHJldHVybiB7SVByb21pc2U8c3RyaW5nPn0gYmFzZTY0IGRhdGEgdXJsIOOCkui/lOWNtFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcmVzaXplSW1hZ2Uoc3JjOiBzdHJpbmcsIGxvbmdTaWRlTGVuZ3RoOiBudW1iZXIpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICBsZXQgaW1nID0gbmV3IEltYWdlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGRlc3Ryb3kgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpbWcpIHtcclxuICAgICAgICAgICAgICAgIGltZy5zcmMgPSBcIlwiOyAgIC8vIOiqreOBv+i+vOOBv+WBnOatolxyXG4gICAgICAgICAgICAgICAgaW1nID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoZXZlbnQ6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYW52YXMgPSBnZXRDYW52YXMoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGloID0gaW1nLmhlaWdodCwgaXcgPSBpbWcud2lkdGgsIGlhID0gaWggLyBpdztcclxuICAgICAgICAgICAgICAgIGxldCBjdzogbnVtYmVyLCBjaDogbnVtYmVyO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpdyA9PT0gMCB8fCAwID09PSBpYSkgeyAvLyDlv7Xjga7jgZ/jgoHkuI3mraPjgarnlLvlg4/jgpLjgqzjg7zjg4lcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QobWFrZUVycm9ySW5mbyhcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0lOVkFMSURfSU1BR0UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpbnZhbGlkIGltYWdlLiBbc3JjOiBcIiArIHNyYyArIFwiXVwiXHJcbiAgICAgICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsb25nU2lkZUxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdTaWRlTGVuZ3RoID0gKGlhIDwgMSkgPyBpdyA6IGloO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoaWEgPCAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGN3ID0gKGxvbmdTaWRlTGVuZ3RoIDwgaXcpID8gbG9uZ1NpZGVMZW5ndGggOiBpdztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2ggPSBNYXRoLnJvdW5kKGN3ICogaWEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoID0gKGxvbmdTaWRlTGVuZ3RoIDwgaWgpID8gbG9uZ1NpZGVMZW5ndGggOiBpaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY3cgPSBNYXRoLnJvdW5kKGNoIC8gaWEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLndpZHRoID0gY3c7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IGNoO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikuZHJhd0ltYWdlKGltZywgMCwgMCwgY3csIGNoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjYW52YXMudG9EYXRhVVJMKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5vbmVycm9yID0gKGV2ZW50OiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KG1ha2VFcnJvckluZm8oXHJcbiAgICAgICAgICAgICAgICAgICAgUkVTVUxUX0NPREUuRVJST1JfQ0RQX1RPT0xTX0lNQUdFX0xPQURfRkFJTEVELFxyXG4gICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICBcImltYWdlIGxvYWQgZmFpbGVkLiBbc3JjOiBcIiArIHNyYyArIFwiXVwiXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGltZy5zcmMgPSBzcmM7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgaW1wb3J0IFByb21pc2UgPSBDRFAuUHJvbWlzZTtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuQmxvYl0gXCI7XHJcblxyXG4gICAgZXhwb3J0IG1vZHVsZSBCbG9iIHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR2V0IEJsb2JCdWlsZGVyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHthbnl9IEJsb2JCdWlsZGVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0QmxvYkJ1aWxkZXIoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbC5CbG9iQnVpbGRlciB8fCBnbG9iYWwuV2ViS2l0QmxvYkJ1aWxkZXIgfHwgZ2xvYmFsLk1vekJsb2JCdWlsZGVyIHx8IGdsb2JhbC5NU0Jsb2JCdWlsZGVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Ko44Op44O85oOF5aCx55Sf5oiQIGZyb20gRE9NRXJyb3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge1JFU1VMVF9DT0RFfSByZXN1bHRDb2RlIFtpbl0gUkVTVUxUX0NPREUg44KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtICB7RE9NRXJyb3J9ICAgIGNhdXNlICAgICAgW2luXSDkuIvkvY3jga4gRE9NIOOCqOODqeODvOOCkuaMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gICAgICBbdGFnXSAgICAgIFtpbl0gVEFHIOOCkuaMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gICAgICBbbWVzc2FnZV0gIFtpbl0g44Oh44OD44K744O844K444KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiB7RXJyb3JJbmZvfSDjgqjjg6njg7zjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBtYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKHJlc3VsdENvZGU6IFJFU1VMVF9DT0RFLCBjYXVzZTogRE9NRXJyb3IsIHRhZz86IHN0cmluZywgbWVzc2FnZT86IHN0cmluZyk6IEVycm9ySW5mbyB7XHJcbiAgICAgICAgICAgIGxldCBfY2F1c2U6IEVycm9yO1xyXG4gICAgICAgICAgICBpZiAoY2F1c2UpIHtcclxuICAgICAgICAgICAgICAgIF9jYXVzZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBjYXVzZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IGNhdXNlLm5hbWUsICAgIC8vIERPTUVycm9yLm1lc3NhZ2Ug44GM5pyq44K144Od44O844OIXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtYWtlRXJyb3JJbmZvKHJlc3VsdENvZGUsIHRhZywgbWVzc2FnZSwgX2NhdXNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEFycmF5QnVmZmVyIHRvIEJsb2JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBidWYge0FycmF5QnVmZmVyfSBbaW5dIEFycmF5QnVmZmVyIGRhdGFcclxuICAgICAgICAgKiBAcGFyYW0gbWltZVR5cGUge3N0cmluZ30gW2luXSBNaW1lVHlwZSBvZiBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7QmxvYn0gQmxvYiBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGFycmF5QnVmZmVyVG9CbG9iKGJ1ZjogQXJyYXlCdWZmZXIsIG1pbWVUeXBlOiBzdHJpbmcpOiBCbG9iIHtcclxuICAgICAgICAgICAgbGV0IGJsb2I6IEJsb2IgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYmxvYkJ1aWxkZXJPYmplY3Q6IGFueSA9IGdldEJsb2JCdWlsZGVyKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoYmxvYkJ1aWxkZXJPYmplY3QgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmxvYkJ1aWxkZXI6IGFueSA9IG5ldyBibG9iQnVpbGRlck9iamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgYmxvYkJ1aWxkZXIuYXBwZW5kKGJ1Zik7XHJcbiAgICAgICAgICAgICAgICBibG9iID0gYmxvYkJ1aWxkZXIuZ2V0QmxvYihtaW1lVHlwZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBBbmRyb2lkIDQuNCBLaXRLYXQgQ2hyb21pdW0gV2ViVmlld1xyXG4gICAgICAgICAgICAgICAgYmxvYiA9IG5ldyBnbG9iYWwuQmxvYihbYnVmXSwgeyB0eXBlOiBtaW1lVHlwZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmxvYjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJhc2U2NCBzdHJpbmcgdG8gQmxvYlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGJhc2U2NCB7c3RyaW5nfSBbaW5dIEJhc2U2NCBzdHJpbmcgZGF0YVxyXG4gICAgICAgICAqIEBwYXJhbSBtaW1lVHlwZSB7c3RyaW5nfSBbaW5dIE1pbWVUeXBlIG9mIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtCbG9ifSBCbG9iIGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gYmFzZTY0VG9CbG9iKGJhc2U2NDogc3RyaW5nLCBtaW1lVHlwZTogc3RyaW5nKTogQmxvYiB7XHJcbiAgICAgICAgICAgIGxldCBibG9iOiBCbG9iID0gbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2JCdWlsZGVyT2JqZWN0OiBhbnkgPSBnZXRCbG9iQnVpbGRlcigpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGJsb2JCdWlsZGVyT2JqZWN0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJsb2JCdWlsZGVyOiBhbnkgPSBuZXcgYmxvYkJ1aWxkZXJPYmplY3QoKTtcclxuICAgICAgICAgICAgICAgIGJsb2JCdWlsZGVyLmFwcGVuZChiYXNlNjRUb0FycmF5QnVmZmVyKGJhc2U2NCkpO1xyXG4gICAgICAgICAgICAgICAgYmxvYiA9IGJsb2JCdWlsZGVyLmdldEJsb2IobWltZVR5cGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gQW5kcm9pZCA0LjQgS2l0S2F0IENocm9taXVtIFdlYlZpZXdcclxuICAgICAgICAgICAgICAgIGJsb2IgPSBuZXcgZ2xvYmFsLkJsb2IoW2Jhc2U2NFRvQXJyYXlCdWZmZXIoYmFzZTY0KV0sIHsgdHlwZTogbWltZVR5cGUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJsb2I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBkYXRhLXVybCDlvaLlvI/nlLvlg4/jgYvjgokgQmxvYiDjgqrjg5bjgrjjgqfjgq/jg4jjgbjlpInmj5tcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge1N0cmluZ30gZGF0YVVybCAgICBbaW5dIGRhdGEgdXJsXHJcbiAgICAgICAgICogQHBhcmFtICB7U3RyaW5nfSBbbWltZVR5cGVdIFtpbl0gbWltZSB0eXBlIOOCkuaMh+Wumi4g5pei5a6a44Gn44GvIFwiaW1hZ2UvcG5nXCJcclxuICAgICAgICAgKiBAcmV0dXJuIHtCbG9ifSBCbG9iIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBkYXRhVXJsVG9CbG9iKGRhdGFVcmw6IHN0cmluZywgbWltZVR5cGU6IHN0cmluZyA9IFwiaW1hZ2UvcG5nXCIpOiBCbG9iIHtcclxuICAgICAgICAgICAgY29uc3QgYmFzZTY0ID0gZGF0YVVybC5zcGxpdChcIixcIilbMV07XHJcbiAgICAgICAgICAgIHJldHVybiBiYXNlNjRUb0Jsb2IoYmFzZTY0LCBtaW1lVHlwZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCYXNlNjQgc3RyaW5nIHRvIEFycmF5QnVmZmVyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYmFzZTY0IHtzdHJpbmd9IFtpbl0gQmFzZTY0IHN0cmluZyBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7QXJyYXlCdWZmZXJ9IEFycmF5QnVmZmVyIGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gYmFzZTY0VG9BcnJheUJ1ZmZlcihiYXNlNjQ6IHN0cmluZyk6IEFycmF5QnVmZmVyIHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSB3aW5kb3cuYXRvYihiYXNlNjQpO1xyXG4gICAgICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihieXRlcy5sZW5ndGgpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGJ5dGVzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhW2ldID0gYnl0ZXMuY2hhckNvZGVBdChpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXlCdWZmZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCYXNlNjQgc3RyaW5nIHRvIFVpbnQ4QXJyYXlcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBiYXNlNjQge3N0cmluZ30gW2luXSBCYXNlNjQgc3RyaW5nIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtVaW50OEFycmF5fSBVaW50OEFycmF5IGRhdGFcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gYmFzZTY0VG9VaW50OEFycmF5KGVuY29kZWQ6IHN0cmluZyk6IFVpbnQ4QXJyYXkge1xyXG4gICAgICAgICAgICBjb25zdCBieXRlcyA9IHdpbmRvdy5hdG9iKGVuY29kZWQpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gbmV3IFVpbnQ4QXJyYXkoYnl0ZXMubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBieXRlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVtpXSA9IGJ5dGVzLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBcnJheUJ1ZmZlciB0byBiYXNlNjQgc3RyaW5nXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYXJyYXlCdWZmZXIge0FycmF5QnVmZmVyfSBbaW5dIEFycmF5QnVmZmVyIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IGJhc2U2NCBkYXRhXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIGFycmF5QnVmZmVyVG9CYXNlNjQoYXJyYXlCdWZmZXI6IEFycmF5QnVmZmVyKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcik7XHJcbiAgICAgICAgICAgIHJldHVybiB1aW50OEFycmF5VG9CYXNlNjQoYnl0ZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVWludDhBcnJheSB0byBiYXNlNjQgc3RyaW5nXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gYnl0ZXMge1VpbnQ4QXJyYXl9IFtpbl0gVWludDhBcnJheSBkYXRhXHJcbiAgICAgICAgICogQHJldHVybiB7c3RyaW5nfSBiYXNlNjQgZGF0YVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiB1aW50OEFycmF5VG9CYXNlNjQoYnl0ZXM6IFVpbnQ4QXJyYXkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgZGF0YTogc3RyaW5nID0gXCJcIjtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBieXRlcy5ieXRlTGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGRhdGEgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5idG9hKGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyBBcnJheUJ1ZmZlclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7QmxvYn0gYmxvYiBbaW5dIGJsb2IgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0NEUC5JUHJvbWlzZTxBcnJheUJ1ZmZlcj59IHByb21pc2Ugb2JqZWN0XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iOiBCbG9iKTogSVByb21pc2U8QXJyYXlCdWZmZXI+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4gcmVhZGVyLmFib3J0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChtYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkZpbGVSZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoKSBmYWlsZWQuXCJcclxuICAgICAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYik7XHJcbiAgICAgICAgICAgIH0sIGNhbmNlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgVWludDhBcnJheVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7QmxvYn0gYmxvYiBbaW5dIGJsb2IgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0NEUC5JUHJvbWlzZTxVaW50OEFycmF5Pn0gcHJvbWlzZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gcmVhZEJsb2JBc1VpbnQ4QXJyYXkoYmxvYjogQmxvYik6IElQcm9taXNlPFVpbnQ4QXJyYXk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QsIGRlcGVuZE9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXBlbmRPbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdDogQXJyYXlCdWZmZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShuZXcgVWludDhBcnJheShyZXN1bHQpKTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3I6IEVycm9ySW5mbykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlYWQgQmxvYiBhcyB0ZXh0IHN0cmluZ1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICB7QmxvYn0gYmxvYiBbaW5dIGJsb2IgZGF0YVxyXG4gICAgICAgICAqIEByZXR1cm4ge0NEUC5JUHJvbWlzZTxVaW50OEFycmF5Pn0gcHJvbWlzZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gcmVhZEJsb2JBc1RleHQoYmxvYjogQmxvYiwgZW5jb2RlOiBzdHJpbmcgPSBcInV0Zi04XCIpOiBJUHJvbWlzZTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgY2FuY2VsID0gKCkgPT4gcmVhZGVyLmFib3J0KCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChtYWtlRXJyb3JJbmZvRnJvbURPTUVycm9yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRVNVTFRfQ09ERS5FUlJPUl9DRFBfVE9PTFNfRklMRV9SRUFERVJfRVJST1IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5lcnJvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgVEFHLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkZpbGVSZWFkZXIucmVhZEFzVGV4dCgpIGZhaWxlZC5cIlxyXG4gICAgICAgICAgICAgICAgICAgICkpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGJsb2IsIGVuY29kZSk7XHJcbiAgICAgICAgICAgIH0sIGNhbmNlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWFkIEJsb2IgYXMgRGF0YSBVUkxcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge0Jsb2J9IGJsb2IgW2luXSBibG9iIGRhdGFcclxuICAgICAgICAgKiBAcmV0dXJuIHtDRFAuSVByb21pc2U8c3RyaW5nPn0gcHJvbWlzZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gcmVhZEJsb2JBc0RhdGFVUkwoYmxvYjogQmxvYik6IElQcm9taXNlPHN0cmluZz4ge1xyXG4gICAgICAgICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgICAgICAgICBjb25zdCBjYW5jZWwgPSAoKSA9PiByZWFkZXIuYWJvcnQoKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVhZGVyLnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KG1ha2VFcnJvckluZm9Gcm9tRE9NRXJyb3IoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9UT09MU19GSUxFX1JFQURFUl9FUlJPUixcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLmVycm9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBUQUcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiRmlsZVJlYWRlci5yZWFkQXNEYXRhVVJMKCkgZmFpbGVkLlwiXHJcbiAgICAgICAgICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmVhZGVyLnJlYWRBc0RhdGFVUkwoYmxvYik7XHJcbiAgICAgICAgICAgIH0sIGNhbmNlbCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVUkwgT2JqZWN0XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHthbnl9IFVSTCBPYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgY29uc3QgVVJMID0gKCgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGdsb2JhbC5VUkwgfHwgZ2xvYmFsLndlYmtpdFVSTDtcclxuICAgICAgICB9KSgpO1xyXG4gICAgfVxyXG59XHJcbiIsIi8qKlxyXG4gKiBAZmlsZSAgQmluYXJ5VHJhbnNwb3J0LnRzXHJcbiAqIEBicmllZiBqUXVlcnkgYWpheCB0cmFuc3BvcnQgZm9yIG1ha2luZyBiaW5hcnkgZGF0YSB0eXBlIHJlcXVlc3RzLlxyXG4gKlxyXG4gKiAgICAgICAgb3JpZ2luYWw6IGh0dHBzOi8vZ2l0aHViLmNvbS9oZW5yeWEvanMtanF1ZXJ5L2Jsb2IvbWFzdGVyL0JpbmFyeVRyYW5zcG9ydC9qcXVlcnkuYmluYXJ5dHJhbnNwb3J0LmpzXHJcbiAqICAgICAgICBhdXRob3I6ICAgSGVucnkgQWxndXMgPGhlbnJ5YWxndXNAZ21haWwuY29tPlxyXG4gKi9cclxubmFtZXNwYWNlIENEUC5Ub29scyB7XHJcbiAgICAvLyBTdXBwb3J0IGZpbGUgcHJvdG9jb2wuIChhcyBzYW1lIGFzIG9mZmljaWFsIHdheSlcclxuICAgIGNvbnN0IHhoclN1Y2Nlc3NTdGF0dXMgPSB7XHJcbiAgICAgICAgMDogMjAwLFxyXG4gICAgICAgIDEyMjM6IDIwNFxyXG4gICAgfTtcclxuXHJcbiAgICAkLmFqYXhUcmFuc3BvcnQoXCIrYmluYXJ5XCIsIChvcHRpb25zOiBKUXVlcnkuQWpheFNldHRpbmdzLCBvcmlnaW5hbE9wdGlvbnM6IEpRdWVyeS5BamF4U2V0dGluZ3MsIGpxWEhSOiBKUXVlcnlYSFIpID0+IHtcclxuICAgICAgICBpZiAoZ2xvYmFsLkZvcm1EYXRhICYmXHJcbiAgICAgICAgICAgICgob3B0aW9ucy5kYXRhVHlwZSAmJiAob3B0aW9ucy5kYXRhVHlwZSA9PT0gXCJiaW5hcnlcIikpIHx8XHJcbiAgICAgICAgICAgIChvcHRpb25zLmRhdGEgJiYgKChnbG9iYWwuQXJyYXlCdWZmZXIgJiYgb3B0aW9ucy5kYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHx8XHJcbiAgICAgICAgICAgIChnbG9iYWwuQmxvYiAmJiBvcHRpb25zLmRhdGEgaW5zdGFuY2VvZiBnbG9iYWwuQmxvYikpKSkpIHtcclxuICAgICAgICAgICAgbGV0IGFib3J0Q2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZW5kOiBmdW5jdGlvbiAoaGVhZGVyczogSlF1ZXJ5LlBsYWluT2JqZWN0LCBjYWxsYmFjazogSlF1ZXJ5LlRyYW5zcG9ydC5TdWNjZXNzQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBzZXR1cCBhbGwgdmFyaWFibGVzXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXJsID0gb3B0aW9ucy51cmw7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdHlwZSA9IG9wdGlvbnMudHlwZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhc3luYyA9IG9wdGlvbnMuYXN5bmMgfHwgdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYmxvYiBvciBhcnJheWJ1ZmZlci4gRGVmYXVsdCBpcyBibG9iXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YVR5cGUgPSAoPGFueT5vcHRpb25zKS5yZXNwb25zZVR5cGUgfHwgXCJibG9iXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGF0YSA9IG9wdGlvbnMuZGF0YSB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJuYW1lID0gb3B0aW9ucy51c2VybmFtZSB8fCBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhc3N3b3JkID0gb3B0aW9ucy5wYXNzd29yZCB8fCBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBfY2FsbGJhY2s6IEpRdWVyeS5UcmFuc3BvcnQuU3VjY2Vzc0NhbGxiYWNrID0gY2FsbGJhY2sgfHwgKCgpID0+IHsgLyogbm9vcCAqLyB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc3VjY2VlZGVkIGhhbmRsZXJcclxuICAgICAgICAgICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZGF0YVtvcHRpb25zLmRhdGFUeXBlXSA9IHhoci5yZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyU3VjY2Vzc1N0YXR1c1t4aHIuc3RhdHVzXSB8fCB4aHIuc3RhdHVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEpRdWVyeS5BamF4LlRleHRTdGF0dXM+eGhyLnN0YXR1c1RleHQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfZGF0YSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBlcnJvciBoYW5kbGVyXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9kYXRhID0ge307XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhW29wdGlvbnMuZGF0YVR5cGVdID0geGhyLnJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBtYWtlIGNhbGxiYWNrIGFuZCBzZW5kIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NhbGxiYWNrKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnN0YXR1cyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxKUXVlcnkuQWpheC5UZXh0U3RhdHVzPnhoci5zdGF0dXNUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX2RhdGEsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWJvcnQgaGFuZGxlclxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfZGF0YSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfZGF0YVtvcHRpb25zLmRhdGFUeXBlXSA9IHhoci5yZXNwb25zZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBjYWxsYmFjayBhbmQgc2VuZCBkYXRhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jYWxsYmFjayhcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zdGF0dXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SlF1ZXJ5LkFqYXguVGV4dFN0YXR1cz54aHIuc3RhdHVzVGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9kYXRhLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmdldEFsbFJlc3BvbnNlSGVhZGVycygpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFib3J0IGNhbGxiYWNrXHJcbiAgICAgICAgICAgICAgICAgICAgYWJvcnRDYWxsYmFjayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgeGhyLmFib3J0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgeGhyLm9wZW4odHlwZSwgdXJsLCBhc3luYywgdXNlcm5hbWUsIHBhc3N3b3JkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0dXAgY3VzdG9tIGhlYWRlcnNcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gaGVhZGVycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaSwgaGVhZGVyc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSBkYXRhVHlwZTtcclxuICAgICAgICAgICAgICAgICAgICB4aHIuc2VuZChkYXRhKTtcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBhYm9ydDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhYm9ydENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFib3J0Q2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuRGF0ZVRpbWVdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIERhdGVUaW1lXHJcbiAgICAgKiBAYnJpZWYg5pmC5Yi75pON5L2c44Gu44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBEYXRlVGltZSB7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5Z+654K544Go44Gq44KL5pel5LuY44GL44KJ44CBbuaXpeW+jOOAgW7ml6XliY3jgpLnrpflh7pcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBiYXNlICAgIHtEYXRlfSAgIFtpbl0g5Z+65rqW5pelXHJcbiAgICAgICAgICogQHBhcmFtIGFkZERheXMge051bWJlcn0gW2luXSDliqDnrpfml6UuIOODnuOCpOODiuOCueaMh+WumuOBp27ml6XliY3jgoLoqK3lrprlj6/og71cclxuICAgICAgICAgKiBAcmV0dXJuIHtEYXRlfSDml6Xku5jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbXB1dGVEYXRlKGJhc2U6IERhdGUsIGFkZERheXM6IG51bWJlcik6IERhdGUge1xyXG4gICAgICAgICAgICBjb25zdCBkdCA9IG5ldyBEYXRlKGJhc2UuZ2V0VGltZSgpKTtcclxuICAgICAgICAgICAgY29uc3QgYmFzZVNlYyA9IGR0LmdldFRpbWUoKTtcclxuICAgICAgICAgICAgY29uc3QgYWRkU2VjID0gYWRkRGF5cyAqIDg2NDAwMDAwOyAgICAvL+aXpeaVsCAqIDHml6Xjga7jg5/jg6rnp5LmlbBcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0U2VjID0gYmFzZVNlYyArIGFkZFNlYztcclxuICAgICAgICAgICAgZHQuc2V0VGltZSh0YXJnZXRTZWMpO1xyXG4gICAgICAgICAgICByZXR1cm4gZHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IHN0cmluZyB0byBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGUgc3RyaW5nIGV4KSBZWVlZLU1NLUREVEhIOm1tOlNTLlNTU1xyXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnZlcnRJU09TdHJpbmdUb0RhdGUoZGF0ZVN0cmluZzogc3RyaW5nKTogRGF0ZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRhdGVUaW1lID0gZGF0ZVN0cmluZy5zcGxpdChcIlRcIiksXHJcbiAgICAgICAgICAgICAgICBkYXRlQXJyYXkgPSBkYXRlVGltZVswXS5zcGxpdChcIi1cIik7XHJcbiAgICAgICAgICAgIGxldCB0aW1lQXJyYXksIHNlY0FycmF5LCBkYXRlT2JqZWN0O1xyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGVUaW1lWzFdKSB7XHJcbiAgICAgICAgICAgICAgICB0aW1lQXJyYXkgPSBkYXRlVGltZVsxXS5zcGxpdChcIjpcIik7XHJcbiAgICAgICAgICAgICAgICBzZWNBcnJheSA9IHRpbWVBcnJheVsyXS5zcGxpdChcIi5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aW1lQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGRhdGVPYmplY3QgPSBuZXcgRGF0ZSg8YW55PmRhdGVBcnJheVswXSwgPGFueT5kYXRlQXJyYXlbMV0gLSAxLCA8YW55PmRhdGVBcnJheVsyXSxcclxuICAgICAgICAgICAgICAgICAgICA8YW55PnRpbWVBcnJheVswXSwgPGFueT50aW1lQXJyYXlbMV0sIDxhbnk+c2VjQXJyYXlbMF0sIDxhbnk+c2VjQXJyYXlbMV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGVBcnJheVsyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGVPYmplY3QgPSBuZXcgRGF0ZSg8YW55PmRhdGVBcnJheVswXSwgPGFueT5kYXRlQXJyYXlbMV0gLSAxLCA8YW55PmRhdGVBcnJheVsyXSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRhdGVBcnJheVsxXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRhdGVPYmplY3QgPSBuZXcgRGF0ZSg8YW55PmRhdGVBcnJheVswXSwgPGFueT5kYXRlQXJyYXlbMV0gLSAxKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZU9iamVjdCA9IG5ldyBEYXRlKDxhbnk+ZGF0ZUFycmF5WzBdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGVPYmplY3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiAgQ29udmVydCBhIGRhdGUgb2JqZWN0IGludG8gYSBzdHJpbmcgaW4gUE1PQVBJIHJlY29yZGVkX2RhdGUgZm9ybWF0KHRoZSBJU08gODYwMSBFeHRlbmRlZCBGb3JtYXQpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGF0ZSAgIHtEYXRlfSAgIFtpbl0gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IHtTdHJpbmd9IFtpbl0ge3llYXIgfCBtb250aCB8IGRhdGUgfCBob3VyIHwgbWluIHwgc2VjIHwgbXNlYyB9XHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgY29udmVydERhdGVUb0lTT1N0cmluZyhkYXRlOiBEYXRlLCB0YXJnZXQ6IHN0cmluZyA9IFwibXNlY1wiKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGlzb0RhdGVTdHJpbmc7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInllYXJcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtb250aFwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcImRhdGVcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJob3VyXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibWluXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VjXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibXNlY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmtub3duIHRhcmdldDogXCIgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IFwibXNlY1wiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc29EYXRlU3RyaW5nID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICBpZiAoXCJ5ZWFyXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlzb0RhdGVTdHJpbmcgKz0gKFwiLVwiICsgRGF0ZVRpbWUubnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcoZGF0ZS5nZXRNb250aCgpICsgMSkpO1xyXG4gICAgICAgICAgICBpZiAoXCJtb250aFwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc29EYXRlU3RyaW5nICs9IChcIi1cIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0RGF0ZSgpKSk7XHJcbiAgICAgICAgICAgIGlmIChcImRhdGVcIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaXNvRGF0ZVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaXNvRGF0ZVN0cmluZyArPSAoXCJUXCIgKyBEYXRlVGltZS5udW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhkYXRlLmdldEhvdXJzKCkpKTtcclxuICAgICAgICAgICAgaWYgKFwiaG91clwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc29EYXRlU3RyaW5nICs9IChcIjpcIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0TWludXRlcygpKSk7XHJcbiAgICAgICAgICAgIGlmIChcIm1pblwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc29EYXRlU3RyaW5nICs9IChcIjpcIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0U2Vjb25kcygpKSk7XHJcbiAgICAgICAgICAgIGlmIChcInNlY1wiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBpc29EYXRlU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpc29EYXRlU3RyaW5nICs9IChcIi5cIiArIFN0cmluZygoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDApLnRvRml4ZWQoMykpLnNsaWNlKDIsIDUpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGlzb0RhdGVTdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ29udmVydCBmaWxlIHN5c3RlbSBjb21wYXRpYmxlIHN0cmluZyB0byBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9IGRhdGUgc3RyaW5nIGV4KSB5eXl5X01NX2RkVEhIX21tX3NzX1NTU1xyXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gZGF0ZSBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGNvbnZlcnRGaWxlU3lzdGVtU3RyaW5nVG9EYXRlKGRhdGVTdHJpbmc6IHN0cmluZyk6IERhdGUge1xyXG4gICAgICAgICAgICBjb25zdCBkYXRlVGltZSA9IGRhdGVTdHJpbmcuc3BsaXQoXCJUXCIpLFxyXG4gICAgICAgICAgICAgICAgZGF0ZUFycmF5ID0gZGF0ZVRpbWVbMF0uc3BsaXQoXCJfXCIpO1xyXG4gICAgICAgICAgICBsZXQgdGltZUFycmF5LCBkYXRlT2JqZWN0O1xyXG5cclxuICAgICAgICAgICAgaWYgKGRhdGVUaW1lWzFdKSB7XHJcbiAgICAgICAgICAgICAgICB0aW1lQXJyYXkgPSBkYXRlVGltZVsxXS5zcGxpdChcIl9cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aW1lQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIGRhdGVPYmplY3QgPSBuZXcgRGF0ZSg8YW55PmRhdGVBcnJheVswXSwgPGFueT5kYXRlQXJyYXlbMV0gLSAxLCA8YW55PmRhdGVBcnJheVsyXSxcclxuICAgICAgICAgICAgICAgICAgICA8YW55PnRpbWVBcnJheVswXSwgPGFueT50aW1lQXJyYXlbMV0sIDxhbnk+dGltZUFycmF5WzJdLCA8YW55PnRpbWVBcnJheVszXSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0ZUFycmF5WzJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZU9iamVjdCA9IG5ldyBEYXRlKDxhbnk+ZGF0ZUFycmF5WzBdLCA8YW55PmRhdGVBcnJheVsxXSAtIDEsIDxhbnk+ZGF0ZUFycmF5WzJdKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0ZUFycmF5WzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGF0ZU9iamVjdCA9IG5ldyBEYXRlKDxhbnk+ZGF0ZUFycmF5WzBdLCA8YW55PmRhdGVBcnJheVsxXSAtIDEpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRlT2JqZWN0ID0gbmV3IERhdGUoPGFueT5kYXRlQXJyYXlbMF0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGF0ZU9iamVjdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqICBDb252ZXJ0IGEgZGF0ZSBvYmplY3QgaW50byBhIHN0cmluZyBpbiBmaWxlIHN5c3RlbSBjb21wYXRpYmxlIGZvcm1hdCh5eXl5X01NX2RkVEhIX21tX3NzX1NTUylcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRlICAge0RhdGV9ICAgW2luXSBkYXRlIG9iamVjdFxyXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQge1N0cmluZ30gW2luXSB7eWVhciB8IG1vbnRoIHwgZGF0ZSB8IGhvdXIgfCBtaW4gfCBzZWMgfCBtc2VjIH1cclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBjb252ZXJ0RGF0ZVRvRmlsZVN5c3RlbVN0cmluZyhkYXRlOiBEYXRlLCB0YXJnZXQ6IHN0cmluZyA9IFwibXNlY1wiKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IGZpbGVTeXN0ZW1TdHJpbmc7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInllYXJcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJtb250aFwiOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcImRhdGVcIjpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJob3VyXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibWluXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2VjXCI6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibXNlY1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmtub3duIHRhcmdldDogXCIgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldCA9IFwibXNlY1wiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWxlU3lzdGVtU3RyaW5nID0gZGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgICAgICAgICBpZiAoXCJ5ZWFyXCIgPT09IHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW1TdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZpbGVTeXN0ZW1TdHJpbmcgKz0gKFwiX1wiICsgRGF0ZVRpbWUubnVtYmVyVG9Eb3VibGVEaWdpdHNTdHJpbmcoZGF0ZS5nZXRNb250aCgpICsgMSkpO1xyXG4gICAgICAgICAgICBpZiAoXCJtb250aFwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlU3lzdGVtU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWxlU3lzdGVtU3RyaW5nICs9IChcIl9cIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0RGF0ZSgpKSk7XHJcbiAgICAgICAgICAgIGlmIChcImRhdGVcIiA9PT0gdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZVN5c3RlbVN0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlsZVN5c3RlbVN0cmluZyArPSAoXCJUXCIgKyBEYXRlVGltZS5udW1iZXJUb0RvdWJsZURpZ2l0c1N0cmluZyhkYXRlLmdldEhvdXJzKCkpKTtcclxuICAgICAgICAgICAgaWYgKFwiaG91clwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlU3lzdGVtU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWxlU3lzdGVtU3RyaW5nICs9IChcIl9cIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0TWludXRlcygpKSk7XHJcbiAgICAgICAgICAgIGlmIChcIm1pblwiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlU3lzdGVtU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWxlU3lzdGVtU3RyaW5nICs9IChcIl9cIiArIERhdGVUaW1lLm51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKGRhdGUuZ2V0U2Vjb25kcygpKSk7XHJcbiAgICAgICAgICAgIGlmIChcInNlY1wiID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlU3lzdGVtU3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmaWxlU3lzdGVtU3RyaW5nICs9IChcIl9cIiArIFN0cmluZygoZGF0ZS5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDApLnRvRml4ZWQoMykpLnNsaWNlKDIsIDUpKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbGVTeXN0ZW1TdHJpbmc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgc3RhdGljIG1ldGhvZFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb252ZXJ0IG51bSB0byBzdHJpbmcoZG91YmxlIGRpZ2l0cylcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAge051bWJlcn0gbnVtYmVyICgwIDxudW1iZXIgPCAxMDApXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSBkb3VibGUgZGlnaXRzIHN0cmluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG51bWJlclRvRG91YmxlRGlnaXRzU3RyaW5nKG51bTogbnVtYmVyKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKG51bSA8IDAgfHwgbnVtID4gMTAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobnVtIDwgMTApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIjBcIiArIG51bTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gXCJcIiArIG51bTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJqcXVlcnlcIiAvPlxyXG5cclxubmFtZXNwYWNlIENEUC5Ub29scyB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlRvb2xzLlRlbXBsYXRlXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSlNUXHJcbiAgICAgKiBAYnJpZWYg44Kz44Oz44OR44Kk44Or5riI44G/IOODhuODs+ODl+ODrOODvOODiOagvOe0jeOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEpTVCB7XHJcbiAgICAgICAgKGRhdGE/OiBhbnkpOiBzdHJpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBUZW1wbGF0ZVxyXG4gICAgICogQGJyaWVmIHRlbXBsYXRlIHNjcmlwdCDjgpLnrqHnkIbjgZnjgovjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFRlbXBsYXRlIHtcclxuXHJcbiAgICAgICAgc3RhdGljIF9tYXBFbGVtZW50OiBhbnk7ICAgIC8vITwg44Kt44O844GoIEpRdWVyeSBFbGVtZW50IOOBriBNYXAg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgc3RhdGljIF9tYXBTb3VyY2U6IGFueTsgICAgIC8vITwgVVJMIOOBqCDjgr3jg7zjgrnjg5XjgqHjgqTjg6soSFRNTCkg44GuIE1hcCDjgqrjg5bjgrjjgqfjgq/jg4hcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyDlhazplovjg6Hjgr3jg4Pjg4lcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44GfIGlkLCBjbGFzcyDlkI0sIFRhZyDlkI3jgpLjgq3jg7zjgavjg4bjg7Pjg5fjg6zjg7zjg4jjga4gSlF1ZXJ5IEVsZW1lbnQg44KS5Y+W5b6X44GZ44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIGtleSAgICAgW2luXSBpZCwgY2xhc3MsIHRhZyDjgpLooajjgZnmloflrZfliJdcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gIFtzcmNdICAgW2luXSDlpJbpg6ggaHRtbCDjgpLmjIflrprjgZnjgovloLTlkIjjga8gdXJsIOOCkuioreWumlxyXG4gICAgICAgICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2NhY2hlXSBbaW5dIHNyYyBodG1sIOOCkuOCreODo+ODg+OCt+ODpeOBmeOCi+WgtOWQiOOBryB0cnVlLiBzcmMg44GM5oyH5a6a44GV44KM44Gm44GE44KL44Go44GN44Gu44G/5pyJ5Yq5XHJcbiAgICAgICAgICogQHJldHVybiB0ZW1wbGF0ZSDjgYzmoLzntI3jgZXjgozjgabjgYTjgosgSlF1ZXJ5IEVsZW1lbnRcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgZ2V0VGVtcGxhdGVFbGVtZW50KGtleTogc3RyaW5nLCBzcmM6IHN0cmluZyA9IG51bGwsIGNhY2hlOiBib29sZWFuID0gdHJ1ZSk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hcEVsZW1lbnQgPSBUZW1wbGF0ZS5nZXRFbGVtZW50TWFwKCk7XHJcbiAgICAgICAgICAgIGxldCAkZWxlbWVudCA9IG1hcEVsZW1lbnRba2V5XTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoISRlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNyYykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBodG1sID0gVGVtcGxhdGUuZmluZEh0bWxGcm9tU291cmNlKHNyYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGVtZW50ID0gJChodG1sKS5maW5kKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsZW1lbnQgPSAkKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOimgee0oOOBruaknOiovFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkZWxlbWVudCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IChcImludmFsaWQgW2tleSwgc3JjXSA9IFtcIiArIGtleSArIFwiLCBcIiArIHNyYyArIFwiXVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNyYyAmJiBjYWNoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBFbGVtZW50W2tleV0gPSAkZWxlbWVudDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBleGNlcHRpb24pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkZWxlbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1hcCDjgqrjg5bjgrjjgqfjgq/jg4jjga7liYrpmaRcclxuICAgICAgICAgKiDmmI7npLrnmoTjgavjgq3jg6Pjg4Pjgrfjg6XjgpLplovmlL7jgZnjgovloLTlkIjjga/mnKzjg6Hjgr3jg4Pjg4njgpLjgrPjg7zjg6vjgZnjgotcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgZW1wdHkoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIFRlbXBsYXRlLl9tYXBFbGVtZW50ID0gbnVsbDtcclxuICAgICAgICAgICAgVGVtcGxhdGUuX21hcFNvdXJjZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmjIflrprjgZfjgZ8gaWQsIGNsYXNzIOWQjSwgVGFnIOWQjeOCkuOCreODvOOBqyBKU1Qg44KS5Y+W5b6X44GZ44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZyB8IGpRdWVyeX0ga2V5ICAgICBbaW5dIGlkLCBjbGFzcywgdGFnIOOCkuihqOOBmeaWh+Wtl+WIlyDjgb7jgZ/jga8g44OG44Oz44OX44Os44O844OI5paH5a2X5YiXLCDjgb7jgZ/jga8galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgICAgICAgICBbc3JjXSAgIFtpbl0g5aSW6YOoIGh0bWwg44KS5oyH5a6a44GZ44KL5aC05ZCI44GvIHVybCDjgpLoqK3lrppcclxuICAgICAgICAgKiBAcGFyYW0ge0Jvb2xlYW59ICAgICAgICAgW2NhY2hlXSBbaW5dIHNyYyBodG1sIOOCkuOCreODo+ODg+OCt+ODpeOBmeOCi+WgtOWQiOOBryB0cnVlLiBzcmMg44GM5oyH5a6a44GV44KM44Gm44GE44KL44Go44GN44Gu44G/5pyJ5Yq5XHJcbiAgICAgICAgICogQHJldHVybiDjgrPjg7Pjg5HjgqTjg6vjgZXjgozjgZ8gSlNUIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBnZXRKU1Qoa2V5OiBKUXVlcnkpOiBKU1Q7XHJcbiAgICAgICAgc3RhdGljIGdldEpTVChrZXk6IHN0cmluZywgc3JjPzogc3RyaW5nLCBjYWNoZT86IGJvb2xlYW4pOiBKU1Q7XHJcbiAgICAgICAgc3RhdGljIGdldEpTVChrZXk6IGFueSwgc3JjPzogc3RyaW5nLCBjYWNoZT86IGJvb2xlYW4pOiBKU1Qge1xyXG4gICAgICAgICAgICBsZXQgdGVtcGxhdGU6IGFueSA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBqc3Q6IEpTVDtcclxuICAgICAgICAgICAgbGV0ICRlbGVtZW50OiBKUXVlcnk7XHJcbiAgICAgICAgICAgIGlmIChrZXkgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuICAgICAgICAgICAgICAgICRlbGVtZW50ID0ga2V5O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGVsZW1lbnQgPSBUZW1wbGF0ZS5nZXRUZW1wbGF0ZUVsZW1lbnQoa2V5LCBzcmMsIGNhY2hlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBnbG9iYWwuSG9nYW4pIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gSG9nYW4uY29tcGlsZSgkZWxlbWVudC50ZXh0KCkpO1xyXG4gICAgICAgICAgICAgICAganN0ID0gZnVuY3Rpb24gKGRhdGE/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZS5yZW5kZXIoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG51bGwgIT0gZ2xvYmFsLl8pIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlID0gXy50ZW1wbGF0ZSgkZWxlbWVudC5odG1sKCkpO1xyXG4gICAgICAgICAgICAgICAganN0ID0gZnVuY3Rpb24gKGRhdGE/OiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOaUueihjOOBqOOCv+ODluOBr+WJiumZpOOBmeOCi1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZShkYXRhKS5yZXBsYWNlKC9cXG58XFx0L2csIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImNhbm5vdCBmaW5kIHRlbXBsYXRlIGVuZ2luZSBtb2R1bGUuXCIpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwiICAgICdob2dhbicgb3IgJ3VuZGVyc2NvcmUnIGlzIHJlcXVpcmVkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4ganN0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyDlhoXpg6jjg6Hjgr3jg4Pjg4lcclxuXHJcbiAgICAgICAgLy8hIEVsZW1lbnQgTWFwIOOCquODluOCuOOCp+OCr+ODiOOBruWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGdldEVsZW1lbnRNYXAoKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFUZW1wbGF0ZS5fbWFwRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgVGVtcGxhdGUuX21hcEVsZW1lbnQgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gVGVtcGxhdGUuX21hcEVsZW1lbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgVVJMIE1hcCDjgqrjg5bjgrjjgqfjgq/jg4jjga7lj5blvpdcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBnZXRTb3VyY2VNYXAoKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFUZW1wbGF0ZS5fbWFwU291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBUZW1wbGF0ZS5fbWFwU291cmNlID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFRlbXBsYXRlLl9tYXBTb3VyY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgVVJMIE1hcCDjgYvjgokgSFRNTCDjgpLmpJzntKIuIOWkseaVl+OBl+OBn+WgtOWQiOOBryB1bmRlZmluZWQg44GM6L+U44KLXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZmluZEh0bWxGcm9tU291cmNlKHNyYzogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgbWFwU291cmNlID0gVGVtcGxhdGUuZ2V0U291cmNlTWFwKCk7XHJcbiAgICAgICAgICAgIGxldCBodG1sID0gbWFwU291cmNlW3NyY107XHJcblxyXG4gICAgICAgICAgICBpZiAoIWh0bWwpIHtcclxuICAgICAgICAgICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGFzeW5jOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJodG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogKGRhdGE6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodG1sID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiAoZGF0YTogYW55LCBzdGF0dXM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyAoXCJhamF4IHJlcXVlc3QgZmFpbGVkLiBzdGF0dXM6IFwiICsgc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIOOCreODo+ODg+OCt+ODpeOBq+agvOe0jVxyXG4gICAgICAgICAgICAgICAgbWFwU291cmNlW3NyY10gPSBodG1sO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBodG1sO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlRvb2xzIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVG9vbHMuUHJvZ3Jlc3NDb3VudGVyXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUHJvZ3Jlc3NDb3VudGVyT3B0aW9uc1xyXG4gICAgICogQGJyaWVmIFByb2dyZXNzQ291bnRlciDjgavmjIflrprjgZnjgovjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQcm9ncmVzc0NvdW50ZXJPcHRpb25zIHtcclxuICAgICAgICBtYXg/OiBudW1iZXI7ICAgICAgICAgICAgICAgICAgICAgICAvLyDpgLLmjZflgKTjga7mnIDlpKflgKQg5pei5a6aOiAxMDBcclxuICAgICAgICBhbGxvd0luY3JlbWVudFJlbWFpbj86IGJvb2xlYW47ICAgICAvLyDmrovjgormjqjlrprmmYLplpPjgYzlopfjgYjjgabjgojjgYTloLTlkIjjgavjga8gdHJ1ZSDml6Llrpo6IGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFByb2dyZXNzQ291bnRlclJlc3VsdFxyXG4gICAgICogQGJyaWVmIOmAsuaNl+OBruaZgumWk+OCkuaMgeOBpOOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICogICAgICAgIOWNmOS9jeOBryBbbXNlY11cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQcm9ncmVzc0NvdW50ZXJSZXN1bHQge1xyXG4gICAgICAgIHBhc3NUaW1lOiBudW1iZXI7ICAgICAgIC8vIOe1jOmBjuaZgumWk1xyXG4gICAgICAgIHJlbWFpblRpbWU6IG51bWJlcjsgICAgIC8vIOaui+OCiuaOqOWumuaZgumWk1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFByb2dyZXNzQ291bnRlclxyXG4gICAgICogQGJyaWVmIOmAsuaNl+OBruaZgumWk+OCkuaJseOBhuODpuODvOODhuOCo+ODquODhuOCo+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUHJvZ3Jlc3NDb3VudGVyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgbWF4OiBudW1iZXI7XHJcbiAgICAgICAgICAgIGJlZ2luVGltZTogbnVtYmVyO1xyXG4gICAgICAgICAgICBhbGxvd0luY3JlbWVudGVSZW1haW46IGJvb2xlYW47XHJcbiAgICAgICAgICAgIGxhc3RSZW1haW5UaW1lOiBudW1iZXI7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBbb3B0aW9uc10g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9ucz86IFByb2dyZXNzQ291bnRlck9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldChvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOmWi+Wni+aZgumWk+OCkuWIneacn+WMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyByZXNldChvcHRpb25zPzogUHJvZ3Jlc3NDb3VudGVyT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zZXR0aW5ncyA9IHtcclxuICAgICAgICAgICAgICAgIC4uLntcclxuICAgICAgICAgICAgICAgICAgICBtYXg6IDEwMCxcclxuICAgICAgICAgICAgICAgICAgICBiZWdpblRpbWU6IERhdGUubm93KCksXHJcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dJbmNyZW1lbnRlUmVtYWluOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBsYXN0UmVtYWluVGltZTogSW5maW5pdHksXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAsIC4uLjxhbnk+b3B0aW9uc1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog57WM6YGO5pmC6ZaT44Go5o6o5a6a5q6L44KK5pmC6ZaT44KS5Y+W5b6X44GZ44KLXHJcbiAgICAgICAgICog6YCy5o2X5YCk44GMIDAg44Gu5aC05ZCI44Gv44CB5o6o5a6a5q6L44KK5pmC6ZaT44GrIEluZmluaXR5IOOCkui/lOOBmVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICAgcHJvZ3Jlc3MgW2luXSDpgLLmjZflgKRcclxuICAgICAgICAgKiBAcmV0dXJucyDntYzpgY7mmYLplpPjgajmjqjlrprmrovjgormmYLplpMgW21zZWNdXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNvbXB1dGUocHJvZ3Jlc3M6IG51bWJlcik6IFByb2dyZXNzQ291bnRlclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhc3NUaW1lID0gRGF0ZS5ub3coKSAtIHRoaXMuX3NldHRpbmdzLmJlZ2luVGltZTtcclxuICAgICAgICAgICAgbGV0IHJlbWFpblRpbWUgPSBJbmZpbml0eTtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gcHJvZ3Jlc3MgJiYgMCAhPT0gcHJvZ3Jlc3MpIHtcclxuICAgICAgICAgICAgICAgIHJlbWFpblRpbWUgPSBwYXNzVGltZSAqIHRoaXMuX3NldHRpbmdzLm1heCAvIHByb2dyZXNzIC0gcGFzc1RpbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmFsbG93SW5jcmVtZW50ZVJlbWFpbiB8fCAocmVtYWluVGltZSA8IHRoaXMuX3NldHRpbmdzLmxhc3RSZW1haW5UaW1lKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MubGFzdFJlbWFpblRpbWUgPSByZW1haW5UaW1lO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVtYWluVGltZSA9IHRoaXMuX3NldHRpbmdzLmxhc3RSZW1haW5UaW1lO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4geyBwYXNzVGltZSwgcmVtYWluVGltZSB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJkZWNsYXJlIG1vZHVsZSBcImNkcC50b29sc1wiIHtcclxuICAgIGNvbnN0IFRvb2xzOiB0eXBlb2YgQ0RQLlRvb2xzO1xyXG4gICAgZXhwb3J0ID0gVG9vbHM7XHJcbn1cclxuIl19