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
define(["require", "exports", "backbone", "underscore", "cdp/framework", "cdp/tools/tools", "./menu", "./header", "./footer", "../../util/functions", "cdp/framework"], function (require, exports, Backbone, _, framework_1, tools_1, menu_1, header_1, footer_1, functions_1, framework_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PageCategory;
    (function (PageCategory) {
        PageCategory[PageCategory["GETSTARTED"] = 0] = "GETSTARTED";
        PageCategory[PageCategory["DOCUMENTS"] = 1] = "DOCUMENTS";
        PageCategory[PageCategory["RESOURCES"] = 2] = "RESOURCES";
        PageCategory[PageCategory["COMMUNICATION"] = 3] = "COMMUNICATION";
    })(PageCategory = exports.PageCategory || (exports.PageCategory = {}));
    var PageUtils = /** @class */ (function (_super) {
        __extends(PageUtils, _super);
        function PageUtils(params) {
            var _this = _super.call(this, params) || this;
            _this._menu = new menu_1.MenuView({
                el: _this.$el.find(".contents-list")
            });
            _this._header = new header_1.HeaderView({
                el: _this.$el.find(".page-base-header")
            });
            _this._footer = new footer_1.FooterView({
                el: _this.$el.find(".page-base-footer")
            });
            switch (params.category) {
                case PageCategory.GETSTARTED:
                    _this._menu.render(menu_1.MenuCategory.GETSTARTED);
                    _this._header.render(header_1.HeaderCategory.GETSTARTED);
                    break;
                case PageCategory.DOCUMENTS:
                    _this._menu.render(menu_1.MenuCategory.DOCUMENTS);
                    _this._header.render(header_1.HeaderCategory.DOCUMENTS);
                    break;
                case PageCategory.RESOURCES:
                    _this._menu.render(menu_1.MenuCategory.RESOURCES);
                    _this._header.render(header_1.HeaderCategory.RESOURCES);
                    break;
                case PageCategory.COMMUNICATION:
                    _this._menu.render(menu_1.MenuCategory.COMMUNICATION);
                    _this._header.render(header_1.HeaderCategory.COMMUNICATION);
                    break;
            }
            _this._footer.render();
            _this._templateDirectory = params.templateDirctory;
            _this._categoryPageHash = params.categoryPageHash;
            _this._defaultPageName = params.defaultPageName ? params.defaultPageName : "top";
            return _this;
        }
        ///////////////////////////////////////////////////////////////////////
        // Override: Backbone.View
        PageUtils.prototype.remove = function () {
            if (this._menu) {
                this._menu.remove();
                this._menu = null;
            }
            if (this._header) {
                this._header.remove();
                this._header = null;
            }
            if (this._footer) {
                this._footer.remove();
                this._footer = null;
            }
            _super.prototype.remove.call(this);
            return this;
        };
        ///////////////////////////////////////////////////////////////////////
        // Public Methods
        /**
         * 同一カテゴリーのページのコンテンツを切り替える
         */
        PageUtils.prototype.changeContent = function () {
            // query params から入れ替えるページ名を取得
            var params = framework_2.Router.getQueryParameters();
            var pageName = null;
            if (_.isArray(params) && _.isArray(params[0])) {
                pageName = params[0][0];
            }
            if (!pageName) {
                pageName = this._defaultPageName;
            }
            this._menu.setCurrentPage(this._categoryPageHash + "/" + pageName);
            // メインのコンテンツを入れ替える
            var $mainContent = this.$el.find(".main-content");
            $mainContent.empty();
            var templateId = this._categoryPageHash + "-" + pageName;
            var templateFile = framework_1.toUrl(this._templateDirectory + pageName + ".html");
            var template = tools_1.Template.getJST(templateId, templateFile);
            var $content = $(template());
            $mainContent.append($content);
            this.$el.scrollTop(0);
            // 外部リンクの有効化
            functions_1.Utils.activateAllExternalLinks(this.$el);
            // inline code の有効化
            functions_1.Utils.activateInlineCode(this.$el);
            // Highlight.js を発動
            functions_1.Utils.activateHighlight(this.$el);
        };
        return PageUtils;
    }(Backbone.View));
    exports.PageUtils = PageUtils;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnZS11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9zY3JpcHRzL3ZpZXcvY29tbW9uL3BhZ2UtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQWNBLElBQVksWUFLWDtJQUxELFdBQVksWUFBWTtRQUNwQiwyREFBVSxDQUFBO1FBQ1YseURBQVMsQ0FBQTtRQUNULHlEQUFTLENBQUE7UUFDVCxpRUFBYSxDQUFBO0lBQ2pCLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2QjtJQVNEO1FBQStCLDZCQUE2QjtRQVF4RCxtQkFBWSxNQUF3QjtZQUFwQyxZQUNJLGtCQUFNLE1BQU0sQ0FBQyxTQXNDaEI7WUFwQ0csS0FBSSxDQUFDLEtBQUssR0FBRyxJQUFJLGVBQVEsQ0FBQztnQkFDdEIsRUFBRSxFQUFFLEtBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDO2FBQ3RDLENBQUMsQ0FBQztZQUNILEtBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxtQkFBVSxDQUFDO2dCQUMxQixFQUFFLEVBQUUsS0FBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUM7YUFDekMsQ0FBQyxDQUFDO1lBQ0gsS0FBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLG1CQUFVLENBQUM7Z0JBQzFCLEVBQUUsRUFBRSxLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQzthQUN6QyxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDdEIsS0FBSyxZQUFZLENBQUMsVUFBVTtvQkFDeEIsS0FBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsbUJBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDM0MsS0FBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsdUJBQWMsQ0FB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RyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUM7WUFFbkUsa0JBQWtCO1lBQ2xCLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQ3BELFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUVyQixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQztZQUMzRCxJQUFNLFlBQVksR0FBRyxpQkFBSyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUM7WUFFekUsSUFBTSxRQUFRLEdBQUcsZ0JBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQzNELElBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQy9CLFlBQVksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFFOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFdEIsWUFBWTtZQUNaLGlCQUFLLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBRXpDLG1CQUFtQjtZQUNuQixpQkFBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUVuQyxtQkFBbUI7WUFDbkIsaUJBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdEMsQ0FBQztRQUNMLGdCQUFDO0lBQUQsQ0FBQyxBQWpIRCxDQUErQixRQUFRLENBQUMsSUFBSSxHQWlIM0M7SUFqSFksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBCYWNrYm9uZSBmcm9tIFwiYmFja2JvbmVcIjtcclxuaW1wb3J0ICogYXMgXyBmcm9tIFwidW5kZXJzY29yZVwiO1xyXG5cclxuaW1wb3J0IHsgdG9VcmwgfSBmcm9tIFwiY2RwL2ZyYW1ld29ya1wiO1xyXG5pbXBvcnQgeyBKU1QsIFRlbXBsYXRlIH0gZnJvbSBcImNkcC90b29scy90b29sc1wiO1xyXG5cclxuaW1wb3J0IHsgTWVudVZpZXcsIE1lbnVDYXRlZ29yeSB9IGZyb20gXCIuL21lbnVcIjtcclxuaW1wb3J0IHsgSGVhZGVyVmlldywgSGVhZGVyQ2F0ZWdvcnkgfSBmcm9tIFwiLi9oZWFkZXJcIjtcclxuaW1wb3J0IHsgRm9vdGVyVmlldyB9IGZyb20gXCIuL2Zvb3RlclwiO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi8uLi91dGlsL2Z1bmN0aW9uc1wiO1xyXG5cclxuXHJcbmltcG9ydCB7IFJvdXRlciBhcyByb3V0ZXIgfSBmcm9tIFwiY2RwL2ZyYW1ld29ya1wiO1xyXG5cclxuZXhwb3J0IGVudW0gUGFnZUNhdGVnb3J5IHtcclxuICAgIEdFVFNUQVJURUQsXHJcbiAgICBET0NVTUVOVFMsXHJcbiAgICBSRVNPVVJDRVMsXHJcbiAgICBDT01NVU5JQ0FUSU9OLFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFBhZ2VVdGlsc1BhcmFtcyBleHRlbmRzIEJhY2tib25lLlZpZXdPcHRpb25zPEJhY2tib25lLk1vZGVsPiB7XHJcbiAgICBjYXRlZ29yeTogUGFnZUNhdGVnb3J5O1xyXG4gICAgdGVtcGxhdGVEaXJjdG9yeTogc3RyaW5nO1xyXG4gICAgY2F0ZWdvcnlQYWdlSGFzaDogc3RyaW5nO1xyXG4gICAgZGVmYXVsdFBhZ2VOYW1lPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUGFnZVV0aWxzIGV4dGVuZHMgQmFja2JvbmUuVmlldzxCYWNrYm9uZS5Nb2RlbD4ge1xyXG4gICAgcHJpdmF0ZSBfbWVudTogTWVudVZpZXc7XHJcbiAgICBwcml2YXRlIF9oZWFkZXI6IEhlYWRlclZpZXc7XHJcbiAgICBwcml2YXRlIF9mb290ZXI6IEZvb3RlclZpZXc7XHJcbiAgICBwcml2YXRlIF90ZW1wbGF0ZURpcmVjdG9yeTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfY2F0ZWdvcnlQYWdlSGFzaDogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBfZGVmYXVsdFBhZ2VOYW1lOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyYW1zPzogUGFnZVV0aWxzUGFyYW1zKSB7XHJcbiAgICAgICAgc3VwZXIocGFyYW1zKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbWVudSA9IG5ldyBNZW51Vmlldyh7XHJcbiAgICAgICAgICAgIGVsOiB0aGlzLiRlbC5maW5kKFwiLmNvbnRlbnRzLWxpc3RcIilcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9oZWFkZXIgPSBuZXcgSGVhZGVyVmlldyh7XHJcbiAgICAgICAgICAgIGVsOiB0aGlzLiRlbC5maW5kKFwiLnBhZ2UtYmFzZS1oZWFkZXJcIilcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9mb290ZXIgPSBuZXcgRm9vdGVyVmlldyh7XHJcbiAgICAgICAgICAgIGVsOiB0aGlzLiRlbC5maW5kKFwiLnBhZ2UtYmFzZS1mb290ZXJcIilcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgc3dpdGNoIChwYXJhbXMuY2F0ZWdvcnkpIHtcclxuICAgICAgICAgICAgY2FzZSBQYWdlQ2F0ZWdvcnkuR0VUU1RBUlRFRDpcclxuICAgICAgICAgICAgICAgIHRoaXMuX21lbnUucmVuZGVyKE1lbnVDYXRlZ29yeS5HRVRTVEFSVEVEKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hlYWRlci5yZW5kZXIoSGVhZGVyQ2F0ZWdvcnkuR0VUU1RBUlRFRCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgUGFnZUNhdGVnb3J5LkRPQ1VNRU5UUzpcclxuICAgICAgICAgICAgICAgIHRoaXMuX21lbnUucmVuZGVyKE1lbnVDYXRlZ29yeS5ET0NVTUVOVFMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faGVhZGVyLnJlbmRlcihIZWFkZXJDYXRlZ29yeS5ET0NVTUVOVFMpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIFBhZ2VDYXRlZ29yeS5SRVNPVVJDRVM6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tZW51LnJlbmRlcihNZW51Q2F0ZWdvcnkuUkVTT1VSQ0VTKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hlYWRlci5yZW5kZXIoSGVhZGVyQ2F0ZWdvcnkuUkVTT1VSQ0VTKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBQYWdlQ2F0ZWdvcnkuQ09NTVVOSUNBVElPTjpcclxuICAgICAgICAgICAgICAgIHRoaXMuX21lbnUucmVuZGVyKE1lbnVDYXRlZ29yeS5DT01NVU5JQ0FUSU9OKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hlYWRlci5yZW5kZXIoSGVhZGVyQ2F0ZWdvcnkuQ09NTVVOSUNBVElPTik7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZm9vdGVyLnJlbmRlcigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuX3RlbXBsYXRlRGlyZWN0b3J5ID0gcGFyYW1zLnRlbXBsYXRlRGlyY3Rvcnk7XHJcbiAgICAgICAgdGhpcy5fY2F0ZWdvcnlQYWdlSGFzaCA9IHBhcmFtcy5jYXRlZ29yeVBhZ2VIYXNoO1xyXG4gICAgICAgIHRoaXMuX2RlZmF1bHRQYWdlTmFtZSA9IHBhcmFtcy5kZWZhdWx0UGFnZU5hbWUgPyBwYXJhbXMuZGVmYXVsdFBhZ2VOYW1lIDogXCJ0b3BcIjtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gT3ZlcnJpZGU6IEJhY2tib25lLlZpZXdcclxuXHJcbiAgICByZW1vdmUoKTogUGFnZVV0aWxzIHtcclxuICAgICAgICBpZiAodGhpcy5fbWVudSkge1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9tZW51ID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2hlYWRlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9oZWFkZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlYWRlciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fZm9vdGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Zvb3Rlci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5fZm9vdGVyID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHN1cGVyLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIFB1YmxpYyBNZXRob2RzXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDlkIzkuIDjgqvjg4bjgrTjg6rjg7zjga7jg5rjg7zjgrjjga7jgrPjg7Pjg4bjg7Pjg4TjgpLliIfjgormm7/jgYjjgotcclxuICAgICAqL1xyXG4gICAgY2hhbmdlQ29udGVudCgpOiB2b2lkIHtcclxuICAgICAgICAvLyBxdWVyeSBwYXJhbXMg44GL44KJ5YWl44KM5pu/44GI44KL44Oa44O844K45ZCN44KS5Y+W5b6XXHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gcm91dGVyLmdldFF1ZXJ5UGFyYW1ldGVycygpO1xyXG4gICAgICAgIGxldCBwYWdlTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBpZiAoXy5pc0FycmF5KHBhcmFtcykgJiYgXy5pc0FycmF5KHBhcmFtc1swXSkpIHtcclxuICAgICAgICAgICAgcGFnZU5hbWUgPSBwYXJhbXNbMF1bMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghcGFnZU5hbWUpIHtcclxuICAgICAgICAgICAgcGFnZU5hbWUgPSB0aGlzLl9kZWZhdWx0UGFnZU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX21lbnUuc2V0Q3VycmVudFBhZ2UodGhpcy5fY2F0ZWdvcnlQYWdlSGFzaCArIFwiL1wiICsgcGFnZU5hbWUpO1xyXG5cclxuICAgICAgICAvLyDjg6HjgqTjg7Pjga7jgrPjg7Pjg4bjg7Pjg4TjgpLlhaXjgozmm7/jgYjjgotcclxuICAgICAgICBjb25zdCAkbWFpbkNvbnRlbnQgPSB0aGlzLiRlbC5maW5kKFwiLm1haW4tY29udGVudFwiKTtcclxuICAgICAgICAkbWFpbkNvbnRlbnQuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGVJZCA9IHRoaXMuX2NhdGVnb3J5UGFnZUhhc2ggKyBcIi1cIiArIHBhZ2VOYW1lO1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlRmlsZSA9IHRvVXJsKHRoaXMuX3RlbXBsYXRlRGlyZWN0b3J5ICsgcGFnZU5hbWUgKyBcIi5odG1sXCIpO1xyXG5cclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmdldEpTVCh0ZW1wbGF0ZUlkLCB0ZW1wbGF0ZUZpbGUpO1xyXG4gICAgICAgIGNvbnN0ICRjb250ZW50ID0gJCh0ZW1wbGF0ZSgpKTtcclxuICAgICAgICAkbWFpbkNvbnRlbnQuYXBwZW5kKCRjb250ZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy4kZWwuc2Nyb2xsVG9wKDApO1xyXG5cclxuICAgICAgICAvLyDlpJbpg6jjg6rjg7Pjgq/jga7mnInlirnljJZcclxuICAgICAgICBVdGlscy5hY3RpdmF0ZUFsbEV4dGVybmFsTGlua3ModGhpcy4kZWwpO1xyXG5cclxuICAgICAgICAvLyBpbmxpbmUgY29kZSDjga7mnInlirnljJZcclxuICAgICAgICBVdGlscy5hY3RpdmF0ZUlubGluZUNvZGUodGhpcy4kZWwpO1xyXG5cclxuICAgICAgICAvLyBIaWdobGlnaHQuanMg44KS55m65YuVXHJcbiAgICAgICAgVXRpbHMuYWN0aXZhdGVIaWdobGlnaHQodGhpcy4kZWwpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==