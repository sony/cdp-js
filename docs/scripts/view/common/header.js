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
    var TAG = "[view.HeaderView] ";
    var HeaderCategory;
    (function (HeaderCategory) {
        HeaderCategory[HeaderCategory["GETSTARTED"] = 0] = "GETSTARTED";
        HeaderCategory[HeaderCategory["RESOURCES"] = 1] = "RESOURCES";
        HeaderCategory[HeaderCategory["DOCUMENTS"] = 2] = "DOCUMENTS";
        HeaderCategory[HeaderCategory["COMMUNICATION"] = 3] = "COMMUNICATION";
    })(HeaderCategory = exports.HeaderCategory || (exports.HeaderCategory = {}));
    /**
     * @class HeaderView
     * @brief ヘッダーのクラス
     */
    var HeaderView = /** @class */ (function (_super) {
        __extends(HeaderView, _super);
        /**
         * constructor
         */
        function HeaderView(options) {
            return _super.call(this, options) || this;
        }
        /**
         * ヘッダーをレンダリングする
         * @param category [in] ヘッダーのカテゴリー
         */
        HeaderView.prototype.render = function (category) {
            var headerData = {};
            switch (category) {
                case HeaderCategory.GETSTARTED:
                    headerData.getstarted = true;
                    break;
                case HeaderCategory.RESOURCES:
                    headerData.resources = true;
                    break;
                case HeaderCategory.DOCUMENTS:
                    headerData.documents = true;
                    break;
                case HeaderCategory.COMMUNICATION:
                    headerData.communication = true;
                    break;
            }
            var template = tools_1.Template.getJST("#template-common-header", framework_1.toUrl("/templates/common/header.html"));
            var $header = $(template(headerData));
            this.$el.append($header);
            return this;
        };
        return HeaderView;
    }(Backbone.View));
    exports.HeaderView = HeaderView;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYXBwL3NjcmlwdHMvdmlldy9jb21tb24vaGVhZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFJQSxJQUFNLEdBQUcsR0FBRyxvQkFBb0IsQ0FBQztJQUVqQyxJQUFZLGNBS1g7SUFMRCxXQUFZLGNBQWM7UUFDdEIsK0RBQVUsQ0FBQTtRQUNWLDZEQUFTLENBQUE7UUFDVCw2REFBUyxDQUFBO1FBQ1QscUVBQWEsQ0FBQTtJQUNqQixDQUFDLEVBTFcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFLekI7SUFTRDs7O09BR0c7SUFDSDtRQUFnQyw4QkFBNkI7UUFDekQ7O1dBRUc7UUFDSCxvQkFBWSxPQUE4QzttQkFDdEQsa0JBQU0sT0FBTyxDQUFDO1FBQ2xCLENBQUM7UUFFRDs7O1dBR0c7UUFDSCwyQkFBTSxHQUFOLFVBQU8sUUFBeUI7WUFDNUIsSUFBTSxVQUFVLEdBQWUsRUFBRSxDQUFDO1lBQ2xDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2YsS0FBSyxjQUFjLENBQUMsVUFBVTtvQkFDMUIsVUFBVSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7b0JBQzdCLEtBQUssQ0FBQztnQkFFVixLQUFLLGNBQWMsQ0FBQyxTQUFTO29CQUN6QixVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDNUIsS0FBSyxDQUFDO2dCQUVWLEtBQUssY0FBYyxDQUFDLFNBQVM7b0JBQ3pCLFVBQVUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO29CQUM1QixLQUFLLENBQUM7Z0JBRVYsS0FBSyxjQUFjLENBQUMsYUFBYTtvQkFDN0IsVUFBVSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7b0JBQ2hDLEtBQUssQ0FBQztZQUNkLENBQUM7WUFFRCxJQUFNLFFBQVEsR0FBRyxnQkFBUSxDQUFDLE1BQU0sQ0FDNUIseUJBQXlCLEVBQ3pCLGlCQUFLLENBQUMsK0JBQStCLENBQUMsQ0FDekMsQ0FBQztZQUNGLElBQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUV6QixNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFDTCxpQkFBQztJQUFELENBQUMsQUF6Q0QsQ0FBZ0MsUUFBUSxDQUFDLElBQUksR0F5QzVDO0lBekNZLGdDQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQmFja2JvbmUgZnJvbSBcImJhY2tib25lXCI7XHJcbmltcG9ydCB7IHRvVXJsIH0gZnJvbSBcImNkcC9mcmFtZXdvcmtcIjtcclxuaW1wb3J0IHsgSlNULCBUZW1wbGF0ZSB9IGZyb20gXCJjZHAvdG9vbHMvdG9vbHNcIjtcclxuXHJcbmNvbnN0IFRBRyA9IFwiW3ZpZXcuSGVhZGVyVmlld10gXCI7XHJcblxyXG5leHBvcnQgZW51bSBIZWFkZXJDYXRlZ29yeSB7XHJcbiAgICBHRVRTVEFSVEVELFxyXG4gICAgUkVTT1VSQ0VTLFxyXG4gICAgRE9DVU1FTlRTLFxyXG4gICAgQ09NTVVOSUNBVElPTixcclxufVxyXG5cclxuaW50ZXJmYWNlIEhlYWRlckRhdGEge1xyXG4gICAgZ2V0c3RhcnRlZD86IGJvb2xlYW47XHJcbiAgICByZXNvdXJjZXM/OiBib29sZWFuO1xyXG4gICAgZG9jdW1lbnRzPzogYm9vbGVhbjtcclxuICAgIGNvbW11bmljYXRpb24/OiBib29sZWFuO1xyXG59XHJcblxyXG4vKipcclxuICogQGNsYXNzIEhlYWRlclZpZXdcclxuICogQGJyaWVmIOODmOODg+ODgOODvOOBruOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEhlYWRlclZpZXcgZXh0ZW5kcyBCYWNrYm9uZS5WaWV3PEJhY2tib25lLk1vZGVsPiB7XHJcbiAgICAvKipcclxuICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBCYWNrYm9uZS5WaWV3T3B0aW9uczxCYWNrYm9uZS5Nb2RlbD4pIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODmOODg+ODgOODvOOCkuODrOODs+ODgOODquODs+OCsOOBmeOCi1xyXG4gICAgICogQHBhcmFtIGNhdGVnb3J5IFtpbl0g44OY44OD44OA44O844Gu44Kr44OG44K044Oq44O8XHJcbiAgICAgKi9cclxuICAgIHJlbmRlcihjYXRlZ29yeT86IEhlYWRlckNhdGVnb3J5KTogSGVhZGVyVmlldyB7XHJcbiAgICAgICAgY29uc3QgaGVhZGVyRGF0YTogSGVhZGVyRGF0YSA9IHt9O1xyXG4gICAgICAgIHN3aXRjaCAoY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgY2FzZSBIZWFkZXJDYXRlZ29yeS5HRVRTVEFSVEVEOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyRGF0YS5nZXRzdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBIZWFkZXJDYXRlZ29yeS5SRVNPVVJDRVM6XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJEYXRhLnJlc291cmNlcyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgSGVhZGVyQ2F0ZWdvcnkuRE9DVU1FTlRTOlxyXG4gICAgICAgICAgICAgICAgaGVhZGVyRGF0YS5kb2N1bWVudHMgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIEhlYWRlckNhdGVnb3J5LkNPTU1VTklDQVRJT046XHJcbiAgICAgICAgICAgICAgICBoZWFkZXJEYXRhLmNvbW11bmljYXRpb24gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmdldEpTVChcclxuICAgICAgICAgICAgXCIjdGVtcGxhdGUtY29tbW9uLWhlYWRlclwiLFxyXG4gICAgICAgICAgICB0b1VybChcIi90ZW1wbGF0ZXMvY29tbW9uL2hlYWRlci5odG1sXCIpXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCAkaGVhZGVyID0gJCh0ZW1wbGF0ZShoZWFkZXJEYXRhKSk7XHJcbiAgICAgICAgdGhpcy4kZWwuYXBwZW5kKCRoZWFkZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxyXG4iXX0=