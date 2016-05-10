import _promise = require("cdp.promise");

// Promise methods
export let makePromise    = _promise.makePromise;
export let wait           = _promise.wait;

// @class PromiseManager
export type PromiseManager = CDP.PromiseManager;
export let  PromiseManager = _promise.PromiseManager;

// interfaces
export type IPromise<T> = CDP.IPromise<T>;
export type Promise     = CDP.Promise;
