/// <amd-module name="cdp" />

export * from "./cdp/core";

import * as Framework from "./cdp/framework";
import * as Tools from "./cdp/tools";
import * as UI from "./cdp/ui";
import * as NativeBridge from "./cdp/bridge";

export { Framework, Tools, UI, NativeBridge };

// short cut for initialize method
export const initialize           = Framework.initialize;
export const isInitialized        = Framework.isInitialized;
export const waitForInitialize    = Framework.waitForInitialize;
