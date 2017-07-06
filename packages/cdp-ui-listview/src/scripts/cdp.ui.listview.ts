/* tslint:disable:typedef */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["jquery", "underscore", "backbone"], function ($, _, Backbone) {
            return factory(root.CDP || (root.CDP = {}), $, _, Backbone);
        });
    } else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"), require("underscore"), require("backbone"));
    } else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}), root.$, root._, root.Backbone);
    }
} (((this || 0).self || global), function (CDP, $, _, Backbone) {
    CDP.UI = CDP.UI || {};

    //<<
    CDP.lazyLoad("lazy-module-cdp.ui.listview");
    //>>

    return CDP.UI;
}));
