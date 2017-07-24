import * as _errors from "./core/core";
export * from "./core/promise";
export * from "./framework/jqm";

// core error utils
export type  ErrorInfo                  = _errors.ErrorInfo;
export const makeErrorInfo              = _errors.makeErrorInfo;
export const makeCanceledErrorInfo      = _errors.makeCanceledErrorInfo;
export const isCanceledError            = _errors.isCanceledError;
export type  RESULT_CODE                = _errors.RESULT_CODE;
export const RESULT_CODE                = _errors.RESULT_CODE;
export const DECLARE_ERROR_CODE         = _errors.DECLARE_ERROR_CODE;
export const ASSIGN_RESULT_CODE         = _errors.ASSIGN_RESULT_CODE;
export const MODULE_RESULT_CODE_RANGE   = _errors.MODULE_RESULT_CODE_RANGE;
export type  RESULT_CODE_BASE           = _errors.RESULT_CODE_BASE;
export const RESULT_CODE_BASE           = _errors.RESULT_CODE_BASE;
export const ASSIGN_RESULT_CODE_BASE    = _errors.ASSIGN_RESULT_CODE_BASE;
