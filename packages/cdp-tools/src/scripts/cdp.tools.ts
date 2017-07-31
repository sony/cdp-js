/* tslint:disable:typedef */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["cdp.core", "cdp.promise"], function () {
            return factory(root.CDP || (root.CDP = {}), root.jQuery || root.$);
        });
    } else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}), root.jQuery || root.$);
    }
} (((this || 0).self || global), function (CDP, $) {
    CDP.Tools = CDP.Tools || {};

    //<<
    CDP.lazyLoad("lazy-module-cdp.tools");
    //>>

    return CDP.Tools;
}));
