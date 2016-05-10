import _tools = require("cdp.tools");

// @module Blob
export module Blob {
    // Blob methods
    export let arrayBufferToBlob    = _tools.Blob.arrayBufferToBlob;
    export let base64ToBlob         = _tools.Blob.base64ToBlob;
    export let base64ToArrayBuffer  = _tools.Blob.base64ToArrayBuffer;
    export let base64ToUint8Array   = _tools.Blob.base64ToUint8Array;
    export let arrayBufferToBase64  = _tools.Blob.arrayBufferToBase64;
    export let uint8ArrayToBase64   = _tools.Blob.uint8ArrayToBase64;
    // Blob stuff
    export let URL = _tools.Blob.URL;
}

// @class DateTime
export type DateTime = CDP.Tools.DateTime;
export let  DateTime = _tools.DateTime;

// Tools APIs
export let abs                  = _tools.abs;
export let max                  = _tools.max;
export let min                  = _tools.min;
export let await                = _tools.await;
export let toZeroPadding        = _tools.toZeroPadding;
export let inherit              = _tools.inherit;
export let mixin                = _tools.mixin;
export let extend               = _tools.extend;
export let getDevicePixcelRatio = _tools.getDevicePixcelRatio;
export let doWork               = _tools.doWork;

// @class Template
export type Template = CDP.Tools.Template;
export let  Template = _tools.Template;

// interfaces
export type JST = CDP.Tools.JST;
