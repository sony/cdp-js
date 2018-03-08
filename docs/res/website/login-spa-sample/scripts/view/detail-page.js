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
define(["require", "exports", "cdp/ui", "./detail-page-user-view"], function (require, exports, ui_1, detail_page_user_view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[view.DetailPage] ";
    var DetailPage = /** @class */ (function (_super) {
        __extends(DetailPage, _super);
        function DetailPage() {
            var _this = _super.call(this, "/templates/detail-page.html", "page-detail-page", {
                route: "detail-page"
            }) || this;
            _this._userView = null;
            return _this;
        }
        DetailPage.prototype.onInitialize = function (event) {
            _super.prototype.onInitialize.call(this, event);
        };
        DetailPage.prototype.events = function () {
            return {};
        };
        DetailPage.prototype.render = function () {
            this._userView.render();
            return this;
        };
        DetailPage.prototype.onPageInit = function (event) {
            _super.prototype.onPageInit.call(this, event);
            var $targetDom = this.$el.find("#page-detail-page-user-view");
            this._userView = new detail_page_user_view_1.DetailPageUserView($targetDom);
            this.render();
        };
        DetailPage.prototype.onPageRemove = function (event) {
            _super.prototype.onPageRemove.call(this, event);
            this._userView.remove();
            this._userView = null;
        };
        return DetailPage;
    }(ui_1.PageView));
    ui_1.registerPage(DetailPage);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV0YWlsLXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hcHAvc2NyaXB0cy92aWV3L2RldGFpbC1wYWdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFNQSxJQUFNLEdBQUcsR0FBVyxvQkFBb0IsQ0FBQztJQUV6QztRQUF5Qiw4QkFBUTtRQUc3QjtZQUFBLFlBQ0ksa0JBQU0sNkJBQTZCLEVBQUUsa0JBQWtCLEVBQUU7Z0JBQ2pELEtBQUssRUFBRSxhQUFhO2FBQzNCLENBQUMsU0FDTDtZQU5PLGVBQVMsR0FBdUIsSUFBSSxDQUFDOztRQU03QyxDQUFDO1FBRUQsaUNBQVksR0FBWixVQUFhLEtBQW1CO1lBQzVCLGlCQUFNLFlBQVksWUFBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBRUQsMkJBQU0sR0FBTjtZQUNJLE1BQU0sQ0FBQyxFQUNOLENBQUE7UUFDTCxDQUFDO1FBRUQsMkJBQU0sR0FBTjtZQUNJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBRUQsK0JBQVUsR0FBVixVQUFXLEtBQW1CO1lBQzFCLGlCQUFNLFVBQVUsWUFBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO1lBQzlELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSwwQ0FBa0IsQ0FBRyxVQUFVLENBQUUsQ0FBQztZQUN2RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUNELGlDQUFZLEdBQVosVUFBYSxLQUFtQjtZQUM1QixpQkFBTSxZQUFZLFlBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUMxQixDQUFDO1FBQ0wsaUJBQUM7SUFBRCxDQUFDLEFBbENELENBQXlCLGFBQVEsR0FrQ2hDO0lBRUQsaUJBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgICBQYWdlVmlldyxcclxuICAgIHJlZ2lzdGVyUGFnZSxcclxufSBmcm9tIFwiY2RwL3VpXCI7XHJcbmltcG9ydCB7IERldGFpbFBhZ2VVc2VyVmlldyB9IGZyb20gXCIuL2RldGFpbC1wYWdlLXVzZXItdmlld1wiO1xyXG5cclxuY29uc3QgVEFHOiBzdHJpbmcgPSBcIlt2aWV3LkRldGFpbFBhZ2VdIFwiO1xyXG5cclxuY2xhc3MgRGV0YWlsUGFnZSBleHRlbmRzIFBhZ2VWaWV3IHtcclxuICAgIHByaXZhdGUgX3VzZXJWaWV3OiBEZXRhaWxQYWdlVXNlclZpZXcgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKFwiL3RlbXBsYXRlcy9kZXRhaWwtcGFnZS5odG1sXCIsIFwicGFnZS1kZXRhaWwtcGFnZVwiLCB7XHJcbiAgICAgICAgICAgICAgICByb3V0ZTogXCJkZXRhaWwtcGFnZVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgb25Jbml0aWFsaXplKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci5vbkluaXRpYWxpemUoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGV2ZW50cygpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpOiBEZXRhaWxQYWdlIHtcclxuICAgICAgICB0aGlzLl91c2VyVmlldy5yZW5kZXIoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBvblBhZ2VJbml0KGV2ZW50OiBKUXVlcnkuRXZlbnQpe1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZUluaXQoZXZlbnQpO1xyXG4gICAgICAgIGxldCAkdGFyZ2V0RG9tID0gdGhpcy4kZWwuZmluZChcIiNwYWdlLWRldGFpbC1wYWdlLXVzZXItdmlld1wiKTtcclxuICAgICAgICB0aGlzLl91c2VyVmlldyA9IG5ldyBEZXRhaWxQYWdlVXNlclZpZXcgKCAkdGFyZ2V0RG9tICk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuICAgIG9uUGFnZVJlbW92ZShldmVudDogSlF1ZXJ5LkV2ZW50KXtcclxuICAgICAgICBzdXBlci5vblBhZ2VSZW1vdmUoZXZlbnQpO1xyXG4gICAgICAgIHRoaXMuX3VzZXJWaWV3LnJlbW92ZSgpO1xyXG4gICAgICAgIHRoaXMuX3VzZXJWaWV3ID0gbnVsbDtcclxuICAgIH1cclxufVxyXG5cclxucmVnaXN0ZXJQYWdlKERldGFpbFBhZ2UpOyJdfQ==