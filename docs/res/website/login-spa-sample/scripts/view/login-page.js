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
define(["require", "exports", "cdp/ui", "./login-page-user-list-view", "../model/login-state"], function (require, exports, ui_1, login_page_user_list_view_1, login_state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[view.LoginPage] ";
    var LoginPage = /** @class */ (function (_super) {
        __extends(LoginPage, _super);
        function LoginPage() {
            var _this = _super.call(this, "/templates/login-page.html", "page-login-page", {
                route: "login-page"
            }) || this;
            _this._userCollectionView = null;
            return _this;
        }
        LoginPage.prototype.onInitialize = function (event) {
            _super.prototype.onInitialize.call(this, event);
        };
        LoginPage.prototype.events = function () {
            return {
                "vclick #submit-login": "onSubmitLogin"
            };
        };
        LoginPage.prototype.render = function () {
            this._userCollectionView.render();
            return this;
        };
        LoginPage.prototype.onPageInit = function (event) {
            _super.prototype.onPageInit.call(this, event);
            var $targetDom = this.$el.find("#select-login-id");
            this._userCollectionView = new login_page_user_list_view_1.LoginPageUserListView($targetDom);
            this.render();
        };
        LoginPage.prototype.onPageRemove = function (event) {
            _super.prototype.onPageRemove.call(this, event);
            this._userCollectionView.remove();
            this._userCollectionView = null;
        };
        LoginPage.prototype.onSubmitLogin = function (event) {
            var id = $("#select-login-id").val();
            var pw = $("#password-login-pw").val();
            var ret = login_state_1.getLoginStateInstance().login(id, pw);
            if (ret) {
                CDP.Framework.Router.navigate("#detail-page");
            }
            else {
                alert("Failed to Login");
            }
            event.preventDefault();
        };
        return LoginPage;
    }(ui_1.PageView));
    ui_1.registerPage(LoginPage);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4tcGFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9zY3JpcHRzL3ZpZXcvbG9naW4tcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBUUEsSUFBTSxHQUFHLEdBQVcsbUJBQW1CLENBQUM7SUFFeEM7UUFBd0IsNkJBQVE7UUFHNUI7WUFBQSxZQUNJLGtCQUFNLDRCQUE0QixFQUFFLGlCQUFpQixFQUFFO2dCQUNuRCxLQUFLLEVBQUUsWUFBWTthQUN0QixDQUFDLFNBQ0w7WUFOTyx5QkFBbUIsR0FBMEIsSUFBSSxDQUFDOztRQU0xRCxDQUFDO1FBRUQsZ0NBQVksR0FBWixVQUFhLEtBQW1CO1lBQzVCLGlCQUFNLFlBQVksWUFBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBRUQsMEJBQU0sR0FBTjtZQUNJLE1BQU0sQ0FBQztnQkFDSCxzQkFBc0IsRUFBRSxlQUFlO2FBQzFDLENBQUE7UUFDTCxDQUFDO1FBRUQsMEJBQU0sR0FBTjtZQUNJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRCw4QkFBVSxHQUFWLFVBQVcsS0FBbUI7WUFDMUIsaUJBQU0sVUFBVSxZQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDbkQsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksaURBQXFCLENBQUUsVUFBVSxDQUFFLENBQUM7WUFDbkUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2xCLENBQUM7UUFFRCxnQ0FBWSxHQUFaLFVBQWEsS0FBbUI7WUFDNUIsaUJBQU0sWUFBWSxZQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1FBQ3BDLENBQUM7UUFFRCxpQ0FBYSxHQUFiLFVBQWMsS0FBbUI7WUFDN0IsSUFBSSxFQUFFLEdBQVcsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDN0MsSUFBSSxFQUFFLEdBQVcsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7WUFFL0MsSUFBSSxHQUFHLEdBQVksbUNBQXFCLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3pELEVBQUUsQ0FBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ2xELENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUM3QixDQUFDO1lBQ0QsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzNCLENBQUM7UUFDTCxnQkFBQztJQUFELENBQUMsQUFqREQsQ0FBd0IsYUFBUSxHQWlEL0I7SUFFRCxpQkFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICAgIFBhZ2VWaWV3LFxyXG4gICAgcmVnaXN0ZXJQYWdlLFxyXG59IGZyb20gXCJjZHAvdWlcIjtcclxuXHJcbmltcG9ydCB7IExvZ2luUGFnZVVzZXJMaXN0VmlldyB9IGZyb20gXCIuL2xvZ2luLXBhZ2UtdXNlci1saXN0LXZpZXdcIjtcclxuaW1wb3J0IHsgTG9naW5TdGF0ZSwgZ2V0TG9naW5TdGF0ZUluc3RhbmNlIH0gZnJvbSBcIi4uL21vZGVsL2xvZ2luLXN0YXRlXCI7XHJcblxyXG5jb25zdCBUQUc6IHN0cmluZyA9IFwiW3ZpZXcuTG9naW5QYWdlXSBcIjtcclxuXHJcbmNsYXNzIExvZ2luUGFnZSBleHRlbmRzIFBhZ2VWaWV3IHtcclxuICAgIHByaXZhdGUgX3VzZXJDb2xsZWN0aW9uVmlldzogTG9naW5QYWdlVXNlckxpc3RWaWV3ID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihcIi90ZW1wbGF0ZXMvbG9naW4tcGFnZS5odG1sXCIsIFwicGFnZS1sb2dpbi1wYWdlXCIsIHsgXHJcbiAgICAgICAgICAgIHJvdXRlOiBcImxvZ2luLXBhZ2VcIiBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbkluaXRpYWxpemUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLm9uSW5pdGlhbGl6ZShldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXZlbnRzKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ2Y2xpY2sgI3N1Ym1pdC1sb2dpblwiOiBcIm9uU3VibWl0TG9naW5cIlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKTogTG9naW5QYWdlIHtcclxuICAgICAgICB0aGlzLl91c2VyQ29sbGVjdGlvblZpZXcucmVuZGVyKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcblxyXG4gICAgb25QYWdlSW5pdChldmVudDogSlF1ZXJ5LkV2ZW50KXtcclxuICAgICAgICBzdXBlci5vblBhZ2VJbml0KGV2ZW50KTtcclxuICAgICAgICBsZXQgJHRhcmdldERvbSA9IHRoaXMuJGVsLmZpbmQoXCIjc2VsZWN0LWxvZ2luLWlkXCIpO1xyXG4gICAgICAgIHRoaXMuX3VzZXJDb2xsZWN0aW9uVmlldyA9IG5ldyBMb2dpblBhZ2VVc2VyTGlzdFZpZXcoICR0YXJnZXREb20gKTtcclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBvblBhZ2VSZW1vdmUoZXZlbnQ6IEpRdWVyeS5FdmVudCl7XHJcbiAgICAgICAgc3VwZXIub25QYWdlUmVtb3ZlKGV2ZW50KTtcclxuICAgICAgICB0aGlzLl91c2VyQ29sbGVjdGlvblZpZXcucmVtb3ZlKCk7XHJcbiAgICAgICAgdGhpcy5fdXNlckNvbGxlY3Rpb25WaWV3ID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBvblN1Ym1pdExvZ2luKGV2ZW50OiBKUXVlcnkuRXZlbnQpIHtcclxuICAgICAgICBsZXQgaWQgPSA8c3RyaW5nPiQoXCIjc2VsZWN0LWxvZ2luLWlkXCIpLnZhbCgpO1xyXG4gICAgICAgIGxldCBwdyA9IDxzdHJpbmc+JChcIiNwYXNzd29yZC1sb2dpbi1wd1wiKS52YWwoKTtcclxuXHJcbiAgICAgICAgbGV0IHJldDogYm9vbGVhbiA9IGdldExvZ2luU3RhdGVJbnN0YW5jZSgpLmxvZ2luKGlkLCBwdyk7XHJcbiAgICAgICAgaWYocmV0KSB7XHJcbiAgICAgICAgICAgIENEUC5GcmFtZXdvcmsuUm91dGVyLm5hdmlnYXRlKFwiI2RldGFpbC1wYWdlXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiRmFpbGVkIHRvIExvZ2luXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5yZWdpc3RlclBhZ2UoTG9naW5QYWdlKTsiXX0=