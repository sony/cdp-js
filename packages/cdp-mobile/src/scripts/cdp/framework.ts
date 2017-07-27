import * as _errors from "./core/errors";
export * from "./core/promise";
export * from "./framework/jqm";

// core error utils
export { _errors as ErrorUtils };

export type ErrorInfo               = _errors.ErrorInfo;
export const makeErrorInfo          = _errors.makeErrorInfo;
export const makeCanceledErrorInfo  = _errors.makeCanceledErrorInfo;
export const isCanceledError        = _errors.isCanceledError;
export const ensureErrorInfo        = _errors.ensureErrorInfo;

const _CDP_FRAMEWORK = CDP.Framework;
export default _CDP_FRAMEWORK;
