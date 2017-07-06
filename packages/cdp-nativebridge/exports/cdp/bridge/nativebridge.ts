import _bridge = require("cdp.nativebridge");

// @class Gate
export type  Gate = CDP.NativeBridge.Gate;
export const Gate = _bridge.Gate;

// interfaces
export type Feature             = CDP.NativeBridge.Feature;
export type ConstructOptions    = CDP.NativeBridge.ConstructOptions;
export type IResult             = CDP.NativeBridge.IResult;
export type ExecOptions         = CDP.NativeBridge.ExecOptions;
