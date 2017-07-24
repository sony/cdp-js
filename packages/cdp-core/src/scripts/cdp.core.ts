/* tslint:disable:typedef */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define(function () {
            return factory(root.CDP || (root.CDP = {}));
        });
    } else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(root.CDP || (root.CDP = {}));
    } else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}));
    }
}(((this || 0).self || global), function (CDP) {

    //<<
    CDP.lazyLoad("lazy-module-cdp.core");
    //>>

    return CDP;
}));
