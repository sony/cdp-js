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
define(["require", "exports", "cdp/framework"], function (require, exports, framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[model.UserCollection] ";
    var UserCollection = /** @class */ (function (_super) {
        __extends(UserCollection, _super);
        function UserCollection() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        UserCollection.prototype.parse = function (response) {
            return response.users;
        };
        return UserCollection;
    }(framework_1.Collection));
    exports.UserCollection = UserCollection;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1jb2xsZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL3NjcmlwdHMvbW9kZWwvdXNlci1jb2xsZWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFHQSxJQUFNLEdBQUcsR0FBVyx5QkFBeUIsQ0FBQztJQUU5QztRQUFvQyxrQ0FBZ0I7UUFBcEQ7O1FBSUEsQ0FBQztRQUhHLDhCQUFLLEdBQUwsVUFBTSxRQUFRO1lBQ1YsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFDMUIsQ0FBQztRQUNMLHFCQUFDO0lBQUQsQ0FBQyxBQUpELENBQW9DLHNCQUFVLEdBSTdDO0lBSlksd0NBQWMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb2xsZWN0aW9uIH0gZnJvbSBcImNkcC9mcmFtZXdvcmtcIjtcclxuaW1wb3J0IHsgVXNlciB9IGZyb20gXCIuL3VzZXJcIjtcclxuXHJcbmNvbnN0IFRBRzogc3RyaW5nID0gXCJbbW9kZWwuVXNlckNvbGxlY3Rpb25dIFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJDb2xsZWN0aW9uIGV4dGVuZHMgQ29sbGVjdGlvbjxVc2VyPiB7XHJcbiAgICBwYXJzZShyZXNwb25zZSkge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS51c2VycztcclxuICAgIH1cclxufSJdfQ==