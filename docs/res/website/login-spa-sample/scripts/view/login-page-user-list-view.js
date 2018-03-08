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
    var TAG = "[view.LoginPageUserListView] ";
    var LoginPageUserListView = /** @class */ (function (_super) {
        __extends(LoginPageUserListView, _super);
        function LoginPageUserListView(target, options) {
            var _this = _super.call(this, options) || this;
            _this._$loginId = null;
            _this._template = null;
            _this._$loginId = target;
            _this._template = ui_1.getTemplate("#page-login-page-login-id-list");
            var collection = login_state_1.getLoginStateInstance().getUserCollection();
            _this.listenTo(collection, "sync", _this.render);
            _this.listenTo(collection, "error", function () {
                alert("Failed to read JSON file");
            });
            return _this;
        }
        LoginPageUserListView.prototype.events = function () {
            return {};
        };
        LoginPageUserListView.prototype.render = function () {
            var users = login_state_1.getLoginStateInstance().getUserCollection();
            var usersJson = users.toJSON();
            var loginHtml = this._template({
                users: usersJson
            });
            var $loginDom = this._$loginId.append($(loginHtml));
            $loginDom.selectmenu("refresh");
            return this;
        };
        return LoginPageUserListView;
    }(ui_1.View));
    exports.LoginPageUserListView = LoginPageUserListView;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4tcGFnZS11c2VyLWxpc3Qtdmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9zY3JpcHRzL3ZpZXcvbG9naW4tcGFnZS11c2VyLWxpc3Qtdmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBUUEsSUFBTSxHQUFHLEdBQVcsK0JBQStCLENBQUM7SUFFcEQ7UUFBMkMseUNBQW9CO1FBRzNELCtCQUFZLE1BQWMsRUFBRSxPQUE4QztZQUExRSxZQUNJLGtCQUFNLE9BQU8sQ0FBQyxTQVNqQjtZQVpPLGVBQVMsR0FBVyxJQUFJLENBQUM7WUFDekIsZUFBUyxHQUFPLElBQUksQ0FBQztZQUd6QixLQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQztZQUN4QixLQUFJLENBQUMsU0FBUyxHQUFHLGdCQUFXLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztZQUUvRCxJQUFJLFVBQVUsR0FBbUIsbUNBQXFCLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQzdFLEtBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDL0MsS0FBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFO2dCQUMvQixLQUFLLENBQUMsMEJBQTBCLENBQUMsQ0FBQztZQUN0QyxDQUFDLENBQUMsQ0FBQzs7UUFDUCxDQUFDO1FBQ0Qsc0NBQU0sR0FBTjtZQUNJLE1BQU0sQ0FBQyxFQUNOLENBQUE7UUFDTCxDQUFDO1FBQ0Qsc0NBQU0sR0FBTjtZQUNJLElBQUksS0FBSyxHQUFtQixtQ0FBcUIsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDeEUsSUFBSSxTQUFTLEdBQVcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3ZDLElBQUksU0FBUyxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ25DLEtBQUssRUFBRSxTQUFTO2FBQ25CLENBQUMsQ0FBQztZQUNILElBQUksU0FBUyxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBRSxDQUFDO1lBQzlELFNBQVMsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7WUFFaEMsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0wsNEJBQUM7SUFBRCxDQUFDLEFBN0JELENBQTJDLFNBQUksR0E2QjlDO0lBN0JZLHNEQUFxQjtJQTZCakMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgICBWaWV3LFxyXG4gICAgSlNULFxyXG4gICAgZ2V0VGVtcGxhdGVcclxufSBmcm9tIFwiY2RwL3VpXCI7XHJcbmltcG9ydCB7IFVzZXJDb2xsZWN0aW9uIH0gZnJvbSBcIi4uL21vZGVsL3VzZXItY29sbGVjdGlvblwiO1xyXG5pbXBvcnQgeyBMb2dpblN0YXRlLCBnZXRMb2dpblN0YXRlSW5zdGFuY2UgfSBmcm9tIFwiLi4vbW9kZWwvbG9naW4tc3RhdGVcIjtcclxuXHJcbmNvbnN0IFRBRzogc3RyaW5nID0gXCJbdmlldy5Mb2dpblBhZ2VVc2VyTGlzdFZpZXddIFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIExvZ2luUGFnZVVzZXJMaXN0VmlldyBleHRlbmRzIFZpZXc8QmFja2JvbmUuTW9kZWw+IHsgICBcclxuICAgIHByaXZhdGUgXyRsb2dpbklkOiBKUXVlcnkgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfdGVtcGxhdGU6IEpTVD0gbnVsbDtcclxuICAgIGNvbnN0cnVjdG9yKHRhcmdldDogSlF1ZXJ5LCBvcHRpb25zPzogQmFja2JvbmUuVmlld09wdGlvbnM8QmFja2JvbmUuTW9kZWw+KSB7ICBcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICB0aGlzLl8kbG9naW5JZCA9IHRhcmdldDtcclxuICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IGdldFRlbXBsYXRlKFwiI3BhZ2UtbG9naW4tcGFnZS1sb2dpbi1pZC1saXN0XCIpO1xyXG5cclxuICAgICAgICBsZXQgY29sbGVjdGlvbjogVXNlckNvbGxlY3Rpb24gPSBnZXRMb2dpblN0YXRlSW5zdGFuY2UoKS5nZXRVc2VyQ29sbGVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMubGlzdGVuVG8oY29sbGVjdGlvbiwgXCJzeW5jXCIsIHRoaXMucmVuZGVyKTtcclxuICAgICAgICB0aGlzLmxpc3RlblRvKGNvbGxlY3Rpb24sIFwiZXJyb3JcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICBhbGVydChcIkZhaWxlZCB0byByZWFkIEpTT04gZmlsZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGV2ZW50cygpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmVuZGVyKCk6IExvZ2luUGFnZVVzZXJMaXN0VmlldyB7XHJcbiAgICAgICAgbGV0IHVzZXJzOiBVc2VyQ29sbGVjdGlvbiA9IGdldExvZ2luU3RhdGVJbnN0YW5jZSgpLmdldFVzZXJDb2xsZWN0aW9uKCk7XHJcbiAgICAgICAgbGV0IHVzZXJzSnNvbjogc3RyaW5nID0gdXNlcnMudG9KU09OKCk7XHJcbiAgICAgICAgbGV0IGxvZ2luSHRtbDogc3RyaW5nID0gdGhpcy5fdGVtcGxhdGUoe1xyXG4gICAgICAgICAgICB1c2VyczogdXNlcnNKc29uXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0ICRsb2dpbkRvbTogSlF1ZXJ5ID0gdGhpcy5fJGxvZ2luSWQuYXBwZW5kKCAkKGxvZ2luSHRtbCkgKTtcclxuICAgICAgICAkbG9naW5Eb20uc2VsZWN0bWVudShcInJlZnJlc2hcIik7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG59OyJdfQ==