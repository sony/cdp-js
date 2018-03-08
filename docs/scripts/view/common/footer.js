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
define(["require", "exports", "backbone", "cdp/framework", "cdp/tools/tools"], function (require, exports, Backbone, framework_1, tools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[view.FooterView] ";
    /**
     * @class FooterView
     * @brief フッターのクラス
     */
    var FooterView = /** @class */ (function (_super) {
        __extends(FooterView, _super);
        /**
         * constructor
         */
        function FooterView(options) {
            return _super.call(this, options) || this;
        }
        /**
         * フッターをレンダリングする
         */
        FooterView.prototype.render = function () {
            var template = tools_1.Template.getJST("#template-common-footer", framework_1.toUrl("/templates/common/footer.html"));
            this.$el.append($(template()));
            return this;
        };
        return FooterView;
    }(Backbone.View));
    exports.FooterView = FooterView;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9vdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYXBwL3NjcmlwdHMvdmlldy9jb21tb24vZm9vdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFJQSxJQUFNLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQztJQUVqQzs7O09BR0c7SUFDSDtRQUFnQyw4QkFBNkI7UUFDekQ7O1dBRUc7UUFDSCxvQkFBWSxPQUE4QzttQkFDdEQsa0JBQU0sT0FBTyxDQUFDO1FBQ2xCLENBQUM7UUFFRDs7V0FFRztRQUNILDJCQUFNLEdBQU47WUFDSSxJQUFNLFFBQVEsR0FBRyxnQkFBUSxDQUFDLE1BQU0sQ0FDNUIseUJBQXlCLEVBQ3pCLGlCQUFLLENBQUMsK0JBQStCLENBQUMsQ0FDekMsQ0FBQztZQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFL0IsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0wsaUJBQUM7SUFBRCxDQUFDLEFBcEJELENBQWdDLFFBQVEsQ0FBQyxJQUFJLEdBb0I1QztJQXBCWSxnQ0FBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEJhY2tib25lIGZyb20gXCJiYWNrYm9uZVwiO1xyXG5pbXBvcnQgeyB0b1VybCB9IGZyb20gXCJjZHAvZnJhbWV3b3JrXCI7XHJcbmltcG9ydCB7IEpTVCwgVGVtcGxhdGUgfSBmcm9tIFwiY2RwL3Rvb2xzL3Rvb2xzXCI7XHJcblxyXG5jb25zdCBUQUcgPSBcIlt2aWV3LkZvb3RlclZpZXddIFwiO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBGb290ZXJWaWV3XHJcbiAqIEBicmllZiDjg5Xjg4Pjgr/jg7zjga7jgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBGb290ZXJWaWV3IGV4dGVuZHMgQmFja2JvbmUuVmlldzxCYWNrYm9uZS5Nb2RlbD4ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zPzogQmFja2JvbmUuVmlld09wdGlvbnM8QmFja2JvbmUuTW9kZWw+KSB7XHJcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5Xjg4Pjgr/jg7zjgpLjg6zjg7Pjg4Djg6rjg7PjgrDjgZnjgotcclxuICAgICAqL1xyXG4gICAgcmVuZGVyKCk6IEZvb3RlclZpZXcge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZ2V0SlNUKFxyXG4gICAgICAgICAgICBcIiN0ZW1wbGF0ZS1jb21tb24tZm9vdGVyXCIsXHJcbiAgICAgICAgICAgIHRvVXJsKFwiL3RlbXBsYXRlcy9jb21tb24vZm9vdGVyLmh0bWxcIilcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMuJGVsLmFwcGVuZCgkKHRlbXBsYXRlKCkpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbn1cclxuIl19