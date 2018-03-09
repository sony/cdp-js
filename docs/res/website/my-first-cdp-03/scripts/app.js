define(["require", "exports", "cdp", "hammerjs", "cdp/framework", "cdp/ui", "hogan", "jquery-hammerjs", "./view/loader"], function (require, exports, cdp_1, Hammer, framework_1, ui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    cdp_1.global["Hammer"] = Hammer;
    var TAG = "[app] ";
    function onStart() {
        // Not show vertical scroll bar.
        ui_1.Theme.detectUIPlatform(false);
        framework_1.Router.register("", "/templates/main.html", true);
        // start Router.
        framework_1.Router.start();
    }
    exports.main = onStart;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYXBwL3NjcmlwdHMvYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUtBLFlBQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxNQUFNLENBQUM7SUFPMUIsSUFBTSxHQUFHLEdBQVcsUUFBUSxDQUFDO0lBRTdCO1FBQ0ksZ0NBQWdDO1FBQ2hDLFVBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU5QixrQkFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEQsZ0JBQWdCO1FBQ2hCLGtCQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVtQix1QkFBSSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBcImhvZ2FuXCI7XHJcbmltcG9ydCBcImpxdWVyeS1oYW1tZXJqc1wiO1xyXG5pbXBvcnQgeyBnbG9iYWwgfSBmcm9tIFwiY2RwXCI7XHJcbi8qIHRzbGludDpkaXNhYmxlOm5vLXN0cmluZy1saXRlcmFsICovXHJcbmltcG9ydCAqIGFzIEhhbW1lciBmcm9tIFwiaGFtbWVyanNcIjtcclxuZ2xvYmFsW1wiSGFtbWVyXCJdID0gSGFtbWVyO1xyXG4vKiB0c2xpbnQ6ZW5hYmxlOm5vLXN0cmluZy1saXRlcmFsICovXHJcblxyXG5pbXBvcnQgeyBSb3V0ZXIgYXMgcm91dGVyIH0gZnJvbSBcImNkcC9mcmFtZXdvcmtcIjtcclxuaW1wb3J0IHsgVGhlbWUgfSBmcm9tIFwiY2RwL3VpXCI7XHJcbmltcG9ydCBcIi4vdmlldy9sb2FkZXJcIjtcclxuXHJcbmNvbnN0IFRBRzogc3RyaW5nID0gXCJbYXBwXSBcIjtcclxuXHJcbmZ1bmN0aW9uIG9uU3RhcnQoKTogdm9pZCB7XHJcbiAgICAvLyBOb3Qgc2hvdyB2ZXJ0aWNhbCBzY3JvbGwgYmFyLlxyXG4gICAgVGhlbWUuZGV0ZWN0VUlQbGF0Zm9ybShmYWxzZSk7XHJcbiAgICBcclxuICAgIHJvdXRlci5yZWdpc3RlcihcIlwiLCBcIi90ZW1wbGF0ZXMvbWFpbi5odG1sXCIsIHRydWUpO1xyXG4gICAgLy8gc3RhcnQgUm91dGVyLlxyXG4gICAgcm91dGVyLnN0YXJ0KCk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IG9uU3RhcnQgYXMgbWFpbiB9O1xyXG4iXX0=