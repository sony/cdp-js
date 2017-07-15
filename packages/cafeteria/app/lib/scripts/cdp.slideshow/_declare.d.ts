/// <reference path="./_export.d.ts" />

/*
 * [NOTE] global declaration
 *
 * 以下のように global オブジェクトにアサイン可能
 * ※既存の cdp.ui.*.js に実装する場合は、従来どおり classical module 方式にすること
 */
declare namespace CDP {
    const SlideShow: typeof LibSlideShow;
}

declare module "cdp.slideshow" {
    export = CDP.SlideShow;
}
