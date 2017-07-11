/// <reference path="./_export.d.ts" />

declare namespace CDP {
    const DeviceConsole: typeof LibDeviceConsole;
}

declare module "cdp.device.console" {
    export = CDP.DeviceConsole;
}
