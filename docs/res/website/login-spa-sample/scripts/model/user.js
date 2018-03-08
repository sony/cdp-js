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
    var TAG = "[model.User] ";
    var User = /** @class */ (function (_super) {
        __extends(User, _super);
        function User(attributes) {
            return _super.call(this, attributes, null) || this;
        }
        User.prototype.defaults = function () {
            return {};
        };
        return User;
    }(framework_1.Model));
    exports.User = User;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2FwcC9zY3JpcHRzL21vZGVsL3VzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUVBLElBQU0sR0FBRyxHQUFXLGVBQWUsQ0FBQztJQUVwQztRQUEwQix3QkFBSztRQUszQixjQUFZLFVBQWdCO21CQUN4QixrQkFBTSxVQUFVLEVBQUUsSUFBSSxDQUFDO1FBQzNCLENBQUM7UUFORCx1QkFBUSxHQUFSO1lBQ0ksTUFBTSxDQUFDLEVBQ04sQ0FBQztRQUNOLENBQUM7UUFJTCxXQUFDO0lBQUQsQ0FBQyxBQVJELENBQTBCLGlCQUFLLEdBUTlCO0lBUlksb0JBQUkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNb2RlbCB9IGZyb20gXCJjZHAvZnJhbWV3b3JrXCI7XHJcblxyXG5jb25zdCBUQUc6IHN0cmluZyA9IFwiW21vZGVsLlVzZXJdIFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXIgZXh0ZW5kcyBNb2RlbCB7XHJcbiAgICBkZWZhdWx0cygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBjb25zdHJ1Y3RvcihhdHRyaWJ1dGVzPzogYW55KSB7XHJcbiAgICAgICAgc3VwZXIoYXR0cmlidXRlcywgbnVsbCk7XHJcbiAgICB9XHJcbn0iXX0=