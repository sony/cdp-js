import _core = require("cdp.core");

// CDP stuff
export const global         = _core.global;
export const coreInitialize = _core.initialize;
export const webRoot        = _core.webRoot;
export const Config         = _core.Config;

// interfaces
export type CoreInitOptions = _core.CoreInitOptions;
