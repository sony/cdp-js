/* tslint:disable:typedef */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["underscore", "cdp.core", "cdp.promise"], function () {
            return factory(root.CDP || (root.CDP = {}), root.jQuery || root.$, root._);
        });
    } else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}), root.jQuery || root.$, root._);
    }
} (((this || 0).self || global), function (CDP, $, _) {
    CDP.Tools = CDP.Tools || {};

    //<<
    CDP.lazyLoad("lazy-module-cdp.tools");
    //>>

    return CDP.Tools;
}));
