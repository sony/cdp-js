/// <reference path="./_export.d.ts" />

/*
 * [NOTE]
 * CDP にアサインする例
 * ※既存の cdp.*.js に実装する場合は、従来どおり classical module 方式にすること
 */
declare namespace CDP {
    const SlideShow: typeof LibSlideShow;
}

declare module "cdp.slideshow" {
    export = CDP.SlideShow;
}
