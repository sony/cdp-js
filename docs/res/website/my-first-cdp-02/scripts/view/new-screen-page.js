var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "cdp/ui"], function (require, exports, ui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[view.NewScreenPage] ";
    /**
     * @class NewScreenPage
     * @brief new-screenページメインビュークラス
     */
    var NewScreenPage = /** @class */ (function (_super) {
        __extends(NewScreenPage, _super);
        /**
         * constructor
         */
        function NewScreenPage() {
            return _super.call(this, "/templates/new-screen.html", "page-new-screen", {
                route: "new-screen"
            }) || this;
        }
        return NewScreenPage;
    }(ui_1.PageView));
    exports.NewScreenPage = NewScreenPage;
    ui_1.registerPage(NewScreenPage);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3LXNjcmVlbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL3NjcmlwdHMvdmlldy9uZXctc2NyZWVuLXBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUtBLElBQU0sR0FBRyxHQUFHLHVCQUF1QixDQUFDO0lBRXBDOzs7T0FHRztJQUNIO1FBQW1DLGlDQUFRO1FBRXZDOztXQUVHO1FBQ0g7bUJBQ0ksa0JBQU0sNEJBQTRCLEVBQUUsaUJBQWlCLEVBQUU7Z0JBQ25ELEtBQUssRUFBRSxZQUFZO2FBQ3RCLENBQUM7UUFDTixDQUFDO1FBQ0wsb0JBQUM7SUFBRCxDQUFDLEFBVkQsQ0FBbUMsYUFBUSxHQVUxQztJQVZZLHNDQUFhO0lBWTFCLGlCQUFZLENBQUMsYUFBYSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgUGFnZVZpZXcsXHJcbiAgICByZWdpc3RlclBhZ2UsXHJcbn0gZnJvbSBcImNkcC91aVwiO1xyXG5cclxuY29uc3QgVEFHID0gXCJbdmlldy5OZXdTY3JlZW5QYWdlXSBcIjtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgTmV3U2NyZWVuUGFnZVxyXG4gKiBAYnJpZWYgbmV3LXNjcmVlbuODmuODvOOCuOODoeOCpOODs+ODk+ODpeODvOOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIE5ld1NjcmVlblBhZ2UgZXh0ZW5kcyBQYWdlVmlldyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihcIi90ZW1wbGF0ZXMvbmV3LXNjcmVlbi5odG1sXCIsIFwicGFnZS1uZXctc2NyZWVuXCIsIHtcclxuICAgICAgICAgICAgcm91dGU6IFwibmV3LXNjcmVlblwiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbnJlZ2lzdGVyUGFnZShOZXdTY3JlZW5QYWdlKTsiXX0=