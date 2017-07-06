/// <reference path="@types/cdp.core.d.ts" />
/// <reference path="@types/cdp.promise.d.ts" />
/// <reference path="@types/cdp.nativebridge.d.ts" />
/// <reference path="@types/cdp.i18n.d.ts" />
/// <reference path="@types/cdp.framework.jqm.d.ts" />
/// <reference path="@types/cdp.tools.d.ts" />
/// <reference path="@types/cdp.ui.listview.d.ts" />
/// <reference path="@types/cdp.ui.jqm.d.ts" />
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
