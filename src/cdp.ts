/// <reference path="_dev.dependencies.d.ts" />
/// <amd-module name="cdp" />

export * from "./cdp/core";

import * as Framework from "./cdp/framework";
import * as Tools from "./cdp/tools";
import * as UI from "./cdp/ui";

export { Framework, Tools, UI };
