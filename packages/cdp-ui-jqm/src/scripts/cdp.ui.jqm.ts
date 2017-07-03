/* tslint:disable:typedef */

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(["cdp.framework.jqm", "cdp.tools", "cdp.ui.listview"], function () {
            return factory(root.CDP || (root.CDP = {}));
        });
    } else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}));
    }
} (this, function (CDP) {
    CDP.UI = CDP.UI || {};

    //<<
    CDP.lazyLoad("lazy-module-cdp.ui.jqm");
    //>>

    return CDP.UI;
}));
