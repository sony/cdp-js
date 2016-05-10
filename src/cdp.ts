/// <reference path="_dev.dependencies.d.ts" />
/// <reference path="../external/include/cdp.core.d.ts" />
/// <reference path="../external/include/cdp.promise.d.ts" />
/// <reference path="../external/include/cdp.framework.jqm.d.ts" />
/// <reference path="../external/include/cdp.tools.d.ts" />
/// <reference path="../external/include/cdp.ui.listview.d.ts" />
/// <reference path="../external/include/cdp.ui.jqm.d.ts" />
/// <amd-module name="cdp" />

export * from "./cdp/core";

import * as Framework from "./cdp/framework";
import * as Tools from "./cdp/tools";
import * as UI from "./cdp/ui";

export { Framework, Tools, UI };

export let initialize = Framework.initialize;
