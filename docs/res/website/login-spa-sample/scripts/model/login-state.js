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
define(["require", "exports", "cdp/framework", "./user-collection"], function (require, exports, framework_1, user_collection_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[model.LoginState] ";
    var LoginState = /** @class */ (function (_super) {
        __extends(LoginState, _super);
        function LoginState(attributes) {
            var _this = _super.call(this, attributes, null) || this;
            _this._userCollection = null;
            _this._userCollection = new user_collection_1.UserCollection();
            _this._userCollection.fetch({
                url: CDP.Framework.toUrl("/res/data/json/users.json")
            });
            return _this;
        }
        LoginState.prototype.defaults = function () {
            return {};
        };
        LoginState.prototype.getUserCollection = function () {
            return this._userCollection;
        };
        LoginState.prototype.getActiveUser = function () {
            return this.get("activeUser");
        };
        LoginState.prototype.login = function (id, pw) {
            var user = this._userCollection.get(id);
            if (!user || user.get("pw") != pw) {
                return false;
            }
            this.set("activeUser", user);
            return true;
        };
        return LoginState;
    }(framework_1.Model));
    exports.LoginState = LoginState;
    // Make LoginState singleton
    var _loginState = null;
    function getLoginStateInstance() {
        if (_loginState == null) {
            _loginState = new LoginState();
        }
        return _loginState;
    }
    exports.getLoginStateInstance = getLoginStateInstance;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9naW4tc3RhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9hcHAvc2NyaXB0cy9tb2RlbC9sb2dpbi1zdGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBSUEsSUFBTSxHQUFHLEdBQVcscUJBQXFCLENBQUM7SUFFMUM7UUFBZ0MsOEJBQUs7UUFPakMsb0JBQVksVUFBZ0I7WUFBNUIsWUFDSSxrQkFBTSxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBSzFCO1lBWk8scUJBQWUsR0FBbUIsSUFBSSxDQUFDO1lBUTNDLEtBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxnQ0FBYyxFQUFFLENBQUM7WUFDNUMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZCLEdBQUcsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQzthQUN4RCxDQUFDLENBQUM7O1FBQ1AsQ0FBQztRQVhELDZCQUFRLEdBQVI7WUFDSSxNQUFNLENBQUMsRUFDTixDQUFDO1FBQ04sQ0FBQztRQVVELHNDQUFpQixHQUFqQjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDO1FBQ2hDLENBQUM7UUFFRCxrQ0FBYSxHQUFiO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbEMsQ0FBQztRQUNELDBCQUFLLEdBQUwsVUFBTSxFQUFVLEVBQUUsRUFBVTtZQUN4QixJQUFJLElBQUksR0FBUyxJQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM5QyxFQUFFLENBQUEsQ0FBRSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0wsaUJBQUM7SUFBRCxDQUFDLEFBNUJELENBQWdDLGlCQUFLLEdBNEJwQztJQTVCWSxnQ0FBVTtJQThCdkIsNEJBQTRCO0lBQzVCLElBQUksV0FBVyxHQUFlLElBQUksQ0FBQztJQUNuQztRQUNJLEVBQUUsQ0FBQSxDQUFFLFdBQVcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLFdBQVcsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQ25DLENBQUM7UUFDRCxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQ3ZCLENBQUM7SUFMRCxzREFLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1vZGVsIH0gZnJvbSBcImNkcC9mcmFtZXdvcmtcIjtcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuL3VzZXJcIjtcclxuaW1wb3J0IHsgVXNlckNvbGxlY3Rpb24gfSBmcm9tIFwiLi91c2VyLWNvbGxlY3Rpb25cIjtcclxuXHJcbmNvbnN0IFRBRzogc3RyaW5nID0gXCJbbW9kZWwuTG9naW5TdGF0ZV0gXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTG9naW5TdGF0ZSBleHRlbmRzIE1vZGVsIHtcclxuICAgIHByaXZhdGUgX3VzZXJDb2xsZWN0aW9uOiBVc2VyQ29sbGVjdGlvbiA9IG51bGw7XHJcbiAgICBkZWZhdWx0cygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXR0cmlidXRlcz86IGFueSkge1xyXG4gICAgICAgIHN1cGVyKGF0dHJpYnV0ZXMsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuX3VzZXJDb2xsZWN0aW9uID0gbmV3IFVzZXJDb2xsZWN0aW9uKCk7XHJcbiAgICAgICAgdGhpcy5fdXNlckNvbGxlY3Rpb24uZmV0Y2goe1xyXG4gICAgICAgICAgICB1cmw6IENEUC5GcmFtZXdvcmsudG9VcmwoXCIvcmVzL2RhdGEvanNvbi91c2Vycy5qc29uXCIpXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VXNlckNvbGxlY3Rpb24oKTogVXNlckNvbGxlY3Rpb24ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91c2VyQ29sbGVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBY3RpdmVVc2VyKCk6IFVzZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldChcImFjdGl2ZVVzZXJcIik7XHJcbiAgICB9XHJcbiAgICBsb2dpbihpZDogc3RyaW5nLCBwdzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IHVzZXI6IFVzZXIgPSB0aGlzLl91c2VyQ29sbGVjdGlvbi5nZXQoaWQpO1xyXG4gICAgICAgIGlmKCAhdXNlciB8fCB1c2VyLmdldChcInB3XCIpICE9IHB3KSB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIHRoaXMuc2V0KFwiYWN0aXZlVXNlclwiLCB1c2VyKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gTWFrZSBMb2dpblN0YXRlIHNpbmdsZXRvblxyXG5sZXQgX2xvZ2luU3RhdGU6IExvZ2luU3RhdGUgPSBudWxsO1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9naW5TdGF0ZUluc3RhbmNlKCkge1xyXG4gICAgaWYoIF9sb2dpblN0YXRlID09IG51bGwpIHtcclxuICAgICAgICBfbG9naW5TdGF0ZSA9IG5ldyBMb2dpblN0YXRlKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX2xvZ2luU3RhdGU7XHJcbn0iXX0=