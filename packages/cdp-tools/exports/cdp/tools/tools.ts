import _tools = require("cdp.tools");

// Tools APIs
export const abs                    = _tools.abs;
export const max                    = _tools.max;
export const min                    = _tools.min;
export const toZeroPadding          = _tools.toZeroPadding;
export const getStringSize          = _tools.getStringSize;
export const toStringChunks         = _tools.toStringChunks;
export const inherit                = _tools.inherit;
export const mixin                  = _tools.mixin;
export const extend                 = _tools.extend;
export const getDevicePixcelRatio   = _tools.getDevicePixcelRatio;
export const getCanvas              = _tools.getCanvas;
export const ensureImageLoaded      = _tools.ensureImageLoaded;
export const resizeImage            = _tools.resizeImage;

// @class Binary
export type  Binary = CDP.Tools.Binary;
export const Binary = _tools.Binary;

// @class DateTime
export type  DateTime = CDP.Tools.DateTime;
export const DateTime = _tools.DateTime;

// @class Template
export type  Template = CDP.Tools.Template;
export const Template = _tools.Template;

// @class ProgressCounter
export type  ProgressCounterOptions = CDP.Tools.ProgressCounterOptions;
export type  ProgressCounterResult  = CDP.Tools.ProgressCounterResult;
export type  ProgressCounter        = CDP.Tools.ProgressCounter;
export const ProgressCounter        = _tools.ProgressCounter;

// interfaces
export type JST = CDP.Tools.JST;
