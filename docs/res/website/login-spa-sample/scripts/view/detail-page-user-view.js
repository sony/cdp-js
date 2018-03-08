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
define(["require", "exports", "cdp/ui", "../model/login-state"], function (require, exports, ui_1, login_state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[view.DetailPageUserView] ";
    var DetailPageUserView = /** @class */ (function (_super) {
        __extends(DetailPageUserView, _super);
        function DetailPageUserView(target, options) {
            var _this = _super.call(this, options) || this;
            _this._$user = null;
            _this._template = null;
            _this._$user = target;
            _this._template = ui_1.getTemplate("#page-detail-page-properties-list");
            return _this;
        }
        DetailPageUserView.prototype.events = function () {
            return {};
        };
        DetailPageUserView.prototype.render = function () {
            var activeUser = login_state_1.getLoginStateInstance().getActiveUser();
            var userHtml = this._template({
                user: activeUser ? activeUser.toJSON() : null
            });
            this._$user.append($(userHtml));
            return this;
        };
        return DetailPageUserView;
    }(ui_1.View));
    exports.DetailPageUserView = DetailPageUserView;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGV0YWlsLXBhZ2UtdXNlci12aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL3NjcmlwdHMvdmlldy9kZXRhaWwtcGFnZS11c2VyLXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVFBLElBQU0sR0FBRyxHQUFXLDRCQUE0QixDQUFDO0lBRWpEO1FBQXdDLHNDQUFVO1FBSTlDLDRCQUFZLE1BQWMsRUFBRSxPQUFvQztZQUFoRSxZQUNJLGtCQUFNLE9BQU8sQ0FBQyxTQUdqQjtZQVBPLFlBQU0sR0FBVyxJQUFJLENBQUM7WUFDdEIsZUFBUyxHQUFRLElBQUksQ0FBQztZQUkxQixLQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNyQixLQUFJLENBQUMsU0FBUyxHQUFHLGdCQUFXLENBQUMsbUNBQW1DLENBQUMsQ0FBQzs7UUFDdEUsQ0FBQztRQUNELG1DQUFNLEdBQU47WUFDSSxNQUFNLENBQUMsRUFDTixDQUFBO1FBQ0wsQ0FBQztRQUNELG1DQUFNLEdBQU47WUFDSSxJQUFJLFVBQVUsR0FBUyxtQ0FBcUIsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQy9ELElBQUksUUFBUSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2xDLElBQUksRUFBRSxVQUFVLENBQUEsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSTthQUMvQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUUsQ0FBQztZQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDTCx5QkFBQztJQUFELENBQUMsQUFyQkQsQ0FBd0MsU0FBSSxHQXFCM0M7SUFyQlksZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIFZpZXcsXHJcbiAgICBKU1QsXHJcbiAgICBnZXRUZW1wbGF0ZVxyXG59IGZyb20gXCJjZHAvdWlcIjtcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuLi9tb2RlbC91c2VyXCJcclxuaW1wb3J0IHsgTG9naW5TdGF0ZSwgZ2V0TG9naW5TdGF0ZUluc3RhbmNlIH0gZnJvbSBcIi4uL21vZGVsL2xvZ2luLXN0YXRlXCI7XHJcblxyXG5jb25zdCBUQUc6IHN0cmluZyA9IFwiW3ZpZXcuRGV0YWlsUGFnZVVzZXJWaWV3XSBcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEZXRhaWxQYWdlVXNlclZpZXcgZXh0ZW5kcyBWaWV3PFVzZXI+IHtcclxuICAgIHByaXZhdGUgXyR1c2VyOiBKUXVlcnkgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfdGVtcGxhdGU6IEpTVCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IodGFyZ2V0OiBKUXVlcnksIG9wdGlvbnM/OiBCYWNrYm9uZS5WaWV3T3B0aW9uczxVc2VyPikge1xyXG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuXyR1c2VyID0gdGFyZ2V0O1xyXG4gICAgICAgIHRoaXMuX3RlbXBsYXRlID0gZ2V0VGVtcGxhdGUoXCIjcGFnZS1kZXRhaWwtcGFnZS1wcm9wZXJ0aWVzLWxpc3RcIik7XHJcbiAgICB9XHJcbiAgICBldmVudHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZW5kZXIoKTogRGV0YWlsUGFnZVVzZXJWaWV3IHtcclxuICAgICAgICBsZXQgYWN0aXZlVXNlcjogVXNlciA9IGdldExvZ2luU3RhdGVJbnN0YW5jZSgpLmdldEFjdGl2ZVVzZXIoKTtcclxuICAgICAgICBsZXQgdXNlckh0bWw6IHN0cmluZyA9IHRoaXMuX3RlbXBsYXRlKHtcclxuICAgICAgICAgICAgdXNlcjogYWN0aXZlVXNlcj8gYWN0aXZlVXNlci50b0pTT04oKSA6IG51bGxcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl8kdXNlci5hcHBlbmQoICQodXNlckh0bWwpICk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn0iXX0=