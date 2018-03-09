define(["require", "exports", "cdp", "hammerjs", "cdp/framework", "cdp/ui", "hogan", "jquery-hammerjs", "./view/loader"], function (require, exports, cdp_1, Hammer, framework_1, ui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    cdp_1.global["Hammer"] = Hammer;
    var TAG = "[app] ";
    function onStart() {
        // for dev. always show vertical scroll bar.
        ui_1.Theme.detectUIPlatform();
        framework_1.Router.register("", "/templates/top/top.html", true);
        // start Router.
        framework_1.Router.start();
    }
    exports.main = onStart;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYXBwL3NjcmlwdHMvYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUtBLFlBQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUM7SUFNMUIsSUFBTSxHQUFHLEdBQVcsUUFBUSxDQUFDO0lBRTdCO1FBQ0ksNENBQTRDO1FBQzVDLFVBQUssQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBRXpCLGtCQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSx5QkFBeUIsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyRCxnQkFBZ0I7UUFDaEIsa0JBQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRW1CLHVCQUFJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiaG9nYW5cIjtcclxuaW1wb3J0IFwianF1ZXJ5LWhhbW1lcmpzXCI7XHJcbmltcG9ydCB7IGdsb2JhbCB9IGZyb20gXCJjZHBcIjtcclxuLyogdHNsaW50OmRpc2FibGU6bm8tc3RyaW5nLWxpdGVyYWwgKi9cclxuaW1wb3J0ICogYXMgSGFtbWVyIGZyb20gXCJoYW1tZXJqc1wiO1xyXG5nbG9iYWxbXCJIYW1tZXJcIl0gPSBIYW1tZXI7XHJcbi8qIHRzbGludDplbmFibGU6bm8tc3RyaW5nLWxpdGVyYWwgKi9cclxuaW1wb3J0IHsgUm91dGVyIGFzIHJvdXRlciB9IGZyb20gXCJjZHAvZnJhbWV3b3JrXCI7XHJcbmltcG9ydCB7IFRoZW1lIH0gZnJvbSBcImNkcC91aVwiO1xyXG5pbXBvcnQgXCIuL3ZpZXcvbG9hZGVyXCI7XHJcblxyXG5jb25zdCBUQUc6IHN0cmluZyA9IFwiW2FwcF0gXCI7XHJcblxyXG5mdW5jdGlvbiBvblN0YXJ0KCk6IHZvaWQge1xyXG4gICAgLy8gZm9yIGRldi4gYWx3YXlzIHNob3cgdmVydGljYWwgc2Nyb2xsIGJhci5cclxuICAgIFRoZW1lLmRldGVjdFVJUGxhdGZvcm0oKTtcclxuXHJcbiAgICByb3V0ZXIucmVnaXN0ZXIoXCJcIiwgXCIvdGVtcGxhdGVzL3RvcC90b3AuaHRtbFwiLCB0cnVlKTtcclxuICAgIC8vIHN0YXJ0IFJvdXRlci5cclxuICAgIHJvdXRlci5zdGFydCgpO1xyXG59XHJcblxyXG5leHBvcnQgeyBvblN0YXJ0IGFzIG1haW4gfTtcclxuIl19