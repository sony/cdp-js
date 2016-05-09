// for development dependencies definition

/// <reference path="../external/include/frameworks.d.ts" />

declare module "iscroll" {
    let _IScroll: IScroll;
    export { _IScroll as IScroll };
}

declare module "hogan" {
    let _Hogan: any;
    export { _Hogan as Hogan };
}

declare module "cdp.core" {
    export = CDP;
}

declare module "cdp.promise" {
    export = CDP;
}

declare module "cdp.framework.jqm" {
    export = CDP.Framework;
}

declare module "cdp.tools" {
    export = CDP.Tools;
}

declare module "cdp.ui.listview" {
    export = CDP.UI;
}

declare module "cdp.ui.jqm" {
    export = CDP.UI;
}

declare let global: any;
declare let exports: any;
declare let module: any;
