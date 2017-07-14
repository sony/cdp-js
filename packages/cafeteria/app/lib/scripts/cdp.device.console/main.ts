// AMD entries module must be named for releases build
/// <amd-module name="cdp.device.console" />

/*
 * [NOTE]
 * CDP にアサインする例
 * ※既存の cdp.*.js に実装する場合は、従来どおり classical module 方式にすること
 */

/* tslint:disable:no-string-literal */

import DeviceConsole from "./device-console";

const global = Function("return this")();
global["CDP"] = global["CDP"] || {};

const _CDP = global["CDP"];
_CDP.DeviceConsole = DeviceConsole;

export { DeviceConsole };
