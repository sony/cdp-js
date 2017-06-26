/// <reference path="_dev.dependencies.d.ts" />

/* tslint:disable:typedef */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["cdp.i18n", "backbone"], function () {
            return factory(root.CDP || (root.CDP = {}));
        });
    } else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}));
    }
} (this, function (CDP) {
    CDP.Framework = CDP.Framework || {};

    //<<
    CDP.lazyLoad("lazy-module-cdp.framework.jqm");
    //>>

    return CDP.Framework;
}));
