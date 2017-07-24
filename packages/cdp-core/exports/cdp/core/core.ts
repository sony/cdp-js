import _core = require("cdp.core");

// CDP stuff
export const global         = _core.global;
export const coreInitialize = _core.initialize;
export const webRoot        = _core.webRoot;
export const Config         = _core.Config;

// error utils
export type  ErrorInfo                  = _core.ErrorInfo;
export const makeErrorInfo              = _core.makeErrorInfo;
export const makeCanceledErrorInfo      = _core.makeCanceledErrorInfo;
export const isCanceledError            = _core.isCanceledError;
export type  RESULT_CODE                = _core.RESULT_CODE;
export const RESULT_CODE                = _core.RESULT_CODE;
export const DECLARE_ERROR_CODE         = _core.DECLARE_ERROR_CODE;
export const ASSIGN_RESULT_CODE         = _core.ASSIGN_RESULT_CODE;
export const MODULE_RESULT_CODE_RANGE   = _core.MODULE_RESULT_CODE_RANGE;
export type  RESULT_CODE_BASE           = _core.RESULT_CODE_BASE;
export const RESULT_CODE_BASE           = _core.RESULT_CODE_BASE;
export const ASSIGN_RESULT_CODE_BASE    = _core.ASSIGN_RESULT_CODE_BASE;

// interfaces
export type CoreInitOptions = _core.CoreInitOptions;
