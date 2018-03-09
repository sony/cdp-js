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
        // 追加 ここから
        ///////////////////////////////////////////////////////////////////////
        // Event Handler
        //! イベントハンドラーのマッピング
        NewScreenPage.prototype.events = function () {
            return {
                "vclick .command-show-message": this.onShowMessage,
            };
        };
        //! ".command-show-message" のイベントハンドラ
        NewScreenPage.prototype.onShowMessage = function (event) {
            ui_1.Toast.show("こんにちは！");
        };
        return NewScreenPage;
    }(ui_1.PageView));
    exports.NewScreenPage = NewScreenPage;
    ui_1.registerPage(NewScreenPage);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV3LXNjcmVlbi1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL3NjcmlwdHMvdmlldy9uZXctc2NyZWVuLXBhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQU1BLElBQU0sR0FBRyxHQUFHLHVCQUF1QixDQUFDO0lBRXBDOzs7T0FHRztJQUNIO1FBQW1DLGlDQUFRO1FBRXZDOztXQUVHO1FBQ0g7bUJBQ0ksa0JBQU0sNEJBQTRCLEVBQUUsaUJBQWlCLEVBQUU7Z0JBQ25ELEtBQUssRUFBRSxZQUFZO2FBQ3RCLENBQUM7UUFDTixDQUFDO1FBRUQsVUFBVTtRQUVWLHVFQUF1RTtRQUN2RSxnQkFBZ0I7UUFFaEIsbUJBQW1CO1FBQ25CLDhCQUFNLEdBQU47WUFDSSxNQUFNLENBQUM7Z0JBQ0gsOEJBQThCLEVBQUUsSUFBSSxDQUFDLGFBQWE7YUFDckQsQ0FBQztRQUNOLENBQUM7UUFFRCxxQ0FBcUM7UUFDN0IscUNBQWEsR0FBckIsVUFBc0IsS0FBd0I7WUFDMUMsVUFBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBRUwsb0JBQUM7SUFBRCxDQUFDLEFBNUJELENBQW1DLGFBQVEsR0E0QjFDO0lBNUJZLHNDQUFhO0lBOEIxQixpQkFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIFBhZ2VWaWV3LFxyXG4gICAgcmVnaXN0ZXJQYWdlLFxyXG4gICAgVG9hc3QsIC8vIOi/veWKoFxyXG59IGZyb20gXCJjZHAvdWlcIjtcclxuXHJcbmNvbnN0IFRBRyA9IFwiW3ZpZXcuTmV3U2NyZWVuUGFnZV0gXCI7XHJcblxyXG4vKipcclxuICogQGNsYXNzIE5ld1NjcmVlblBhZ2VcclxuICogQGJyaWVmIG5ldy1zY3JlZW7jg5rjg7zjgrjjg6HjgqTjg7Pjg5Pjg6Xjg7zjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBOZXdTY3JlZW5QYWdlIGV4dGVuZHMgUGFnZVZpZXcge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoXCIvdGVtcGxhdGVzL25ldy1zY3JlZW4uaHRtbFwiLCBcInBhZ2UtbmV3LXNjcmVlblwiLCB7XHJcbiAgICAgICAgICAgIHJvdXRlOiBcIm5ldy1zY3JlZW5cIlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOi/veWKoCDjgZPjgZPjgYvjgolcclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gRXZlbnQgSGFuZGxlclxyXG5cclxuICAgIC8vISDjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6njg7zjga7jg57jg4Pjg5Tjg7PjgrBcclxuICAgIGV2ZW50cygpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIFwidmNsaWNrIC5jb21tYW5kLXNob3ctbWVzc2FnZVwiOiB0aGlzLm9uU2hvd01lc3NhZ2UsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyEgXCIuY29tbWFuZC1zaG93LW1lc3NhZ2VcIiDjga7jgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6lcclxuICAgIHByaXZhdGUgb25TaG93TWVzc2FnZShldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBUb2FzdC5zaG93KFwi44GT44KT44Gr44Gh44Gv77yBXCIpO1xyXG4gICAgfVxyXG4gICAgLy8g6L+95YqgIOOBk+OBk+OBvuOBp1xyXG59XHJcblxyXG5yZWdpc3RlclBhZ2UoTmV3U2NyZWVuUGFnZSk7Il19