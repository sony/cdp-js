// AMD entries module must be named for releases build
/// <amd-module name="cdp.ui.smoothscroll" />

/*
 * [NOTE]
 * CDP.UI にアサインする例
 * ※既存の cdp.ui.*.js に実装する場合は、従来どおり classical module 方式にすること
 */

/* tslint:disable:no-string-literal */

import SmoothScroll from "./smoothscroll";

const global = Function("return this")();
global["CDP"]       = global["CDP"] || {};
global["CDP"]["UI"] = global["CDP"]["UI"] || {};

const UI = global["CDP"]["UI"];
UI.SmoothScroll = SmoothScroll;

export { SmoothScroll };
