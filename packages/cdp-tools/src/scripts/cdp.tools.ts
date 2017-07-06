/* tslint:disable:typedef */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["jquery", "underscore"], function ($, _) {
            return factory(root.CDP || (root.CDP = {}), $, _);
        });
    } else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"), require("underscore"));
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
