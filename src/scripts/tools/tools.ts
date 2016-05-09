/* tslint:disable:max-line-length */

import _tools = require("cdp.tools");

/**
 * @class Blob
 * @brief Blob 操作のユーティリティクラス
 */
export module Blob {
    /**
     * ArrayBuffer to Blob
     *
     * @param buf {ArrayBuffer} [in] ArrayBuffer data
     * @param mimeType {string} [in] MimeType of data
     * @return {Blob} Blob data
     */
    export let arrayBufferToBlob: (buf: ArrayBuffer, mimeType: string) => Blob = _tools.Blob.arrayBufferToBlob;
    /**
     * Base64 string to Blob
     *
     * @param base64 {string} [in] Base64 string data
     * @param mimeType {string} [in] MimeType of data
     * @return {Blob} Blob data
     */
    export let base64ToBlob: (base64: string, mimeType: string) => Blob = _tools.Blob.base64ToBlob;
    /**
     * Base64 string to ArrayBuffer
     *
     * @param base64 {string} [in] Base64 string data
     * @return {ArrayBuffer} ArrayBuffer data
     */
    export let base64ToArrayBuffer: (base64: string) => ArrayBuffer = _tools.Blob.base64ToArrayBuffer;
    /**
     * Base64 string to Uint8Array
     *
     * @param base64 {string} [in] Base64 string data
     * @return {Uint8Array} Uint8Array data
     */
    export let base64ToUint8Array: (encoded: string) => Uint8Array = _tools.Blob.base64ToUint8Array;
    /**
     * ArrayBuffer to base64 string
     *
     * @param arrayBuffer {ArrayBuffer} [in] ArrayBuffer data
     * @return {string} base64 data
     */
    export let arrayBufferToBase64: (arrayBuffer: ArrayBuffer) => string = _tools.Blob.arrayBufferToBase64;
    /**
     * Uint8Array to base64 string
     *
     * @param bytes {Uint8Array} [in] Uint8Array data
     * @return {string} base64 data
     */
    export let uint8ArrayToBase64: (bytes: Uint8Array) => string = _tools.Blob.uint8ArrayToBase64;
    /**
     * URL Object
     *
     * @return {any} URL Object
     */
    export let URL: any = _tools.Blob.URL;
}

/**
 * @class DateTime
 * @brief 時刻操作のユーティリティクラス
 */
export let DateTime: CDP.Tools.DateTime = _tools.DateTime;

/**
 * Math.abs よりも高速な abs
 */
export let abs: (x: number) => number = _tools.abs;

/**
 * Math.max よりも高速な max
 */
export let max: (lhs: number, rhs: number) => number = _tools.max;

/**
 * Math.min よりも高速な min
 */
export let min: (lhs: number, rhs: number) => number = _tools.min;

/**
 * condition() が true を返すまで deferred
 */
export let await: (condition: () => boolean, msec?: number) => JQueryPromise<any> = _tools.await;

/**
 * 数値を 0 詰めして文字列を生成
 */
export let toZeroPadding: (no: number, limit: number) => string = _tools.toZeroPadding;

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
export let inherit: (subClass: any, superClass: any) => void = _tools.inherit;

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
export let mixin: (derived: any, ...bases: any[]) => void = _tools.mixin;

/**
 * クラス継承のためのヘルパー関数
 * Backbone.js extend() 関数と同等
 *
 * @param protoProps  {Object} [in] prototype properties をオブジェクトで指定
 * @param staticProps {Object} [in] static properties をオブジェクトで指定
 * @return {Object} サブクラスのコンストラクタ
 */
export let extend: (protoProps: Object, staticProps?: Object) => Object = _tools.extend;

/**
 * DPI 取得
 */
export let getDevicePixcelRatio: () => number = _tools.getDevicePixcelRatio;

/**
 * Web Worker 起動ユーティリティ
 */
export let doWork: (worker: Worker | string, msg: any) => JQueryPromise<any> = _tools.doWork;

/**
 * @class Template
 * @brief template script を管理するユーティリティクラス
 */
export let Template: CDP.Tools.Template = _tools.Template;
