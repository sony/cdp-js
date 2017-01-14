// amd define function shim
(function (root) {
    if (!(typeof define === "function" && define.amd)) {
        root.define = function () { /* noop */ };
    }
})(this);
