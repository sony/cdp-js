/* tslint:disable:typedef */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["jquery", "cdp.core", "cdp.promise"], function ($, CDP) {
            return factory($, CDP);
        });
    } else {
        // Browser globals
        factory(root.jQuery || root.$, root.CDP || (root.CDP = {}));
    }
}(this, function ($, CDP) {

    //<<
    CDP.lazyLoad("lazy-module-cdp.i18n");
    //>>

    return CDP;
}));
