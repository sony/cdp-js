import _tools = require("cdp.tools");

// Tools APIs
export const abs                    = _tools.abs;
export const max                    = _tools.max;
export const min                    = _tools.min;
export const toZeroPadding          = _tools.toZeroPadding;
export const inherit                = _tools.inherit;
export const mixin                  = _tools.mixin;
export const extend                 = _tools.extend;
export const getDevicePixcelRatio   = _tools.getDevicePixcelRatio;
export const getCanvas              = _tools.getCanvas;
export const ensureImageLoaded      = _tools.ensureImageLoaded;
export const resizeImage            = _tools.resizeImage;

// @module Blob
export module Blob {
    // Blob methods
    export const arrayBufferToBlob      = _tools.Blob.arrayBufferToBlob;
    export const base64ToBlob           = _tools.Blob.base64ToBlob;
    export const dataUrlToBlob          = _tools.Blob.dataUrlToBlob;
    export const base64ToArrayBuffer    = _tools.Blob.base64ToArrayBuffer;
    export const base64ToUint8Array     = _tools.Blob.base64ToUint8Array;
    export const arrayBufferToBase64    = _tools.Blob.arrayBufferToBase64;
    export const uint8ArrayToBase64     = _tools.Blob.uint8ArrayToBase64;
    export const readBlobAsArrayBuffer  = _tools.Blob.readBlobAsArrayBuffer;
    export const readBlobAsUint8Array   = _tools.Blob.readBlobAsUint8Array;
    export const readBlobAsText         = _tools.Blob.readBlobAsText;
    export const readBlobAsDataURL      = _tools.Blob.readBlobAsDataURL;

    // Blob stuff
    export const URL = _tools.Blob.URL;
}

// @class DateTime
export type  DateTime = CDP.Tools.DateTime;
export const DateTime = _tools.DateTime;

// @class Template
export type  Template = CDP.Tools.Template;
export const Template = _tools.Template;

// interfaces
export type JST = CDP.Tools.JST;
