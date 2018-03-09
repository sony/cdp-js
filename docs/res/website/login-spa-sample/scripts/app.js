define(["require", "exports", "cdp/framework", "cdp/ui", "hogan", "./view/loader"], function (require, exports, framework_1, ui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[app] ";
    function onStart() {
        // for dev. always show vertical scroll bar.
        ui_1.Theme.detectUIPlatform();
        // router.register("", "/templates/main.html", true);
        framework_1.Router.register("", "/templates/login-page.html", true);
        // start Router.
        framework_1.Router.start();
    }
    exports.main = onStart;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYXBwL3NjcmlwdHMvYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQU1BLElBQU0sR0FBRyxHQUFXLFFBQVEsQ0FBQztJQUU3QjtRQUNJLDRDQUE0QztRQUM1QyxVQUFLLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUV6QixxREFBcUQ7UUFDckQsa0JBQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLDRCQUE0QixFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXhELGdCQUFnQjtRQUNoQixrQkFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFbUIsdUJBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCJob2dhblwiO1xyXG5cclxuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcImNkcC9mcmFtZXdvcmtcIjtcclxuaW1wb3J0IHsgVGhlbWUgfSBmcm9tIFwiY2RwL3VpXCI7XHJcbmltcG9ydCBcIi4vdmlldy9sb2FkZXJcIjtcclxuXHJcbmNvbnN0IFRBRzogc3RyaW5nID0gXCJbYXBwXSBcIjtcclxuXHJcbmZ1bmN0aW9uIG9uU3RhcnQoKTogdm9pZCB7XHJcbiAgICAvLyBmb3IgZGV2LiBhbHdheXMgc2hvdyB2ZXJ0aWNhbCBzY3JvbGwgYmFyLlxyXG4gICAgVGhlbWUuZGV0ZWN0VUlQbGF0Zm9ybSgpO1xyXG5cclxuICAgIC8vIHJvdXRlci5yZWdpc3RlcihcIlwiLCBcIi90ZW1wbGF0ZXMvbWFpbi5odG1sXCIsIHRydWUpO1xyXG4gICAgUm91dGVyLnJlZ2lzdGVyKFwiXCIsIFwiL3RlbXBsYXRlcy9sb2dpbi1wYWdlLmh0bWxcIiwgdHJ1ZSk7XHJcblxyXG4gICAgLy8gc3RhcnQgUm91dGVyLlxyXG4gICAgUm91dGVyLnN0YXJ0KCk7XHJcbn1cclxuXHJcbmV4cG9ydCB7IG9uU3RhcnQgYXMgbWFpbiB9O1xyXG4iXX0=