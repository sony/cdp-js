// AMD entries module must be named for releases build
/// <amd-module name="cdp.device.console" />

/*
 * [NOTE]
 * CDP にアサインする例
 * ※既存の cdp.*.js に実装する場合は、従来どおり classical module 方式にすること
 */

/* tslint:disable:no-string-literal */

import { Player as SlideShow } from "./slideshow/player";

const global = Function("return this")();
global["CDP"] = global["CDP"] || {};

const _CDP = global["CDP"];
_CDP.SlideShow = SlideShow;

export { SlideShow };
