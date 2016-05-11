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

declare let global: any;
declare let exports: any;
declare let module: any;
