/* tslint:disable:typedef */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["jquery"], function ($) {
            return factory(root.CDP || (root.CDP = {}), $, root);
        });
    } else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"), root);
    } else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}), root.jQuery || root.$, root);
    }
} (((this || 0).self || global), function (CDP, $, root) {

    //<<
    CDP.lazyLoad("lazy-module-cdp.promise");
    //>>

    // ensure global promise for "await" - "async" syntax.
    root.Promise = root.Promise || CDP.Promise;

    return CDP;
}));
