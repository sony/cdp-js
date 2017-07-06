import _promise = require("cdp.promise");

// Promise methods
export const makePromise    = _promise.makePromise;
export const wait           = _promise.wait;

// @class PromiseManager
export type  PromiseManager = CDP.PromiseManager;
export const PromiseManager = _promise.PromiseManager;

// @class es2015 Promise
export type  PromiseConstructor<T> = CDP.PromiseConstructor<T>;
export const Promise = _promise.Promise;

// interfaces
export type IPromiseBase<T> = CDP.IPromiseBase<T>;
export type IPromise<T>     = CDP.IPromise<T>;
