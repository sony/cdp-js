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
    var TAG = "[view.MenuView] ";
    var MenuCategory;
    (function (MenuCategory) {
        MenuCategory[MenuCategory["GETSTARTED"] = 0] = "GETSTARTED";
        MenuCategory[MenuCategory["DOCUMENTS"] = 1] = "DOCUMENTS";
        MenuCategory[MenuCategory["RESOURCES"] = 2] = "RESOURCES";
        MenuCategory[MenuCategory["COMMUNICATION"] = 3] = "COMMUNICATION";
    })(MenuCategory = exports.MenuCategory || (exports.MenuCategory = {}));
    var TOP_MENU_DATA = "/res/data/menu/top.json";
    var GETSTARTED_MENU_DATA = "/res/data/menu/getstarted.json";
    var DOCUMENTS_MENU_DATA = "/res/data/menu/documents.json";
    var RESOURCES_MENU_DATA = "/res/data/menu/resources.json";
    var COMMUNICATION_MENU_DATA = "/res/data/menu/communication.json";
    /**
     * @class MenuView
     * @brief サイドメニューのクラス
     */
    var MenuView = /** @class */ (function (_super) {
        __extends(MenuView, _super);
        /**
         * constructor
         */
        function MenuView(options) {
            return _super.call(this, options) || this;
        }
        /**
         * メニューをレンダリングする
         * @param category [in] メニューのカテゴリー
         */
        MenuView.prototype.render = function (category) {
            var _this = this;
            var menuData = "";
            switch (category) {
                case MenuCategory.GETSTARTED:
                    menuData = GETSTARTED_MENU_DATA;
                    break;
                case MenuCategory.DOCUMENTS:
                    menuData = DOCUMENTS_MENU_DATA;
                    break;
                case MenuCategory.RESOURCES:
                    menuData = RESOURCES_MENU_DATA;
                    break;
                case MenuCategory.COMMUNICATION:
                    menuData = COMMUNICATION_MENU_DATA;
                    break;
                default:
                    menuData = TOP_MENU_DATA;
            }
            $.ajax({
                url: framework_1.toUrl(menuData),
                type: "GET",
                dataType: "json",
                async: false
            })
                .done(function (data) {
                var template = tools_1.Template.getJST("#template-menu-list-container", framework_1.toUrl("/templates/common/menu.html"));
                var $menu = $(template(data));
                _this.$el.append($menu);
            });
            return this;
        };
        /**
         * メニューに選択したページをマークする
         *
         * @param pageId [in] 選択したページ
         */
        MenuView.prototype.setCurrentPage = function (pageId) {
            var $links = this.$el.find("a");
            $links.each(function (index, elem) {
                var $link = $(elem);
                var href = $link.attr("href");
                if (href === pageId) {
                    $link.addClass("selected");
                    $link.parents(".expandable").removeClass("collapsed");
                }
                else {
                    $link.removeClass("selected");
                }
            });
        };
        MenuView.prototype.events = function () {
            return {
                "vclick .expandable": this.onClickedExpand,
            };
        };
        /**
         * 開閉可能なリストの処理
         * @param event
         */
        MenuView.prototype.onClickedExpand = function (event) {
            var _this = this;
            var $target = $(event.target);
            if ($target.attr("target") === "_blank") {
                return;
            }
            event.preventDefault();
            if (this._preventListExpand) {
                return;
            }
            this._preventListExpand = true;
            if ($target.hasClass("collapsed")) {
                $target.removeClass("collapsed");
            }
            else {
                $target.addClass("collapsed");
            }
            setTimeout(function () {
                _this._preventListExpand = false;
            }, 500);
        };
        return MenuView;
    }(Backbone.View));
    exports.MenuView = MenuView;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9zY3JpcHRzL3ZpZXcvY29tbW9uL21lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUtBLElBQU0sR0FBRyxHQUFHLGtCQUFrQixDQUFDO0lBRS9CLElBQVksWUFLWDtJQUxELFdBQVksWUFBWTtRQUNwQiwyREFBVSxDQUFBO1FBQ1YseURBQVMsQ0FBQTtRQUNULHlEQUFTLENBQUE7UUFDVCxpRUFBYSxDQUFBO0lBQ2pCLENBQUMsRUFMVyxZQUFZLEdBQVosb0JBQVksS0FBWixvQkFBWSxRQUt2QjtJQUVELElBQU0sYUFBYSxHQUFHLHlCQUF5QixDQUFDO0lBQ2hELElBQU0sb0JBQW9CLEdBQUcsZ0NBQWdDLENBQUM7SUFDOUQsSUFBTSxtQkFBbUIsR0FBRywrQkFBK0IsQ0FBQztJQUM1RCxJQUFNLG1CQUFtQixHQUFHLCtCQUErQixDQUFDO0lBQzVELElBQU0sdUJBQXVCLEdBQUcsbUNBQW1DLENBQUM7SUFFcEU7OztPQUdHO0lBQ0g7UUFBOEIsNEJBQTZCO1FBR3ZEOztXQUVHO1FBQ0gsa0JBQVksT0FBOEM7bUJBQ3RELGtCQUFNLE9BQU8sQ0FBQztRQUNsQixDQUFDO1FBRUQ7OztXQUdHO1FBQ0gseUJBQU0sR0FBTixVQUFPLFFBQXVCO1lBQTlCLGlCQXVDQztZQXRDRyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbEIsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDZixLQUFLLFlBQVksQ0FBQyxVQUFVO29CQUN4QixRQUFRLEdBQUcsb0JBQW9CLENBQUM7b0JBQ2hDLEtBQUssQ0FBQztnQkFFVixLQUFLLFlBQVksQ0FBQyxTQUFTO29CQUN2QixRQUFRLEdBQUcsbUJBQW1CLENBQUM7b0JBQy9CLEtBQUssQ0FBQztnQkFFVixLQUFLLFlBQVksQ0FBQyxTQUFTO29CQUN2QixRQUFRLEdBQUcsbUJBQW1C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QUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQztRQUNMLGVBQUM7SUFBRCxDQUFDLEFBMUdELENBQThCLFFBQVEsQ0FBQyxJQUFJLEdBMEcxQztJQTFHWSw0QkFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEJhY2tib25lIGZyb20gXCJiYWNrYm9uZVwiO1xyXG4vL2ltcG9ydCB7IFBhZ2VWaWV3LCBTaG93RXZlbnREYXRhLCBIaWRlRXZlbnREYXRhLCBUb2FzdCwgUGFnZVZpZXdDb25zdHJ1Y3RPcHRpb25zIH0gZnJvbSBcImNkcC91aVwiO1xyXG5pbXBvcnQgeyB0b1VybCB9IGZyb20gXCJjZHAvZnJhbWV3b3JrXCI7XHJcbmltcG9ydCB7IEpTVCwgVGVtcGxhdGUgfSBmcm9tIFwiY2RwL3Rvb2xzL3Rvb2xzXCI7XHJcblxyXG5jb25zdCBUQUcgPSBcIlt2aWV3Lk1lbnVWaWV3XSBcIjtcclxuXHJcbmV4cG9ydCBlbnVtIE1lbnVDYXRlZ29yeSB7XHJcbiAgICBHRVRTVEFSVEVELFxyXG4gICAgRE9DVU1FTlRTLFxyXG4gICAgUkVTT1VSQ0VTLFxyXG4gICAgQ09NTVVOSUNBVElPTixcclxufVxyXG5cclxuY29uc3QgVE9QX01FTlVfREFUQSA9IFwiL3Jlcy9kYXRhL21lbnUvdG9wLmpzb25cIjtcclxuY29uc3QgR0VUU1RBUlRFRF9NRU5VX0RBVEEgPSBcIi9yZXMvZGF0YS9tZW51L2dldHN0YXJ0ZWQuanNvblwiO1xyXG5jb25zdCBET0NVTUVOVFNfTUVOVV9EQVRBID0gXCIvcmVzL2RhdGEvbWVudS9kb2N1bWVudHMuanNvblwiO1xyXG5jb25zdCBSRVNPVVJDRVNfTUVOVV9EQVRBID0gXCIvcmVzL2RhdGEvbWVudS9yZXNvdXJjZXMuanNvblwiO1xyXG5jb25zdCBDT01NVU5JQ0FUSU9OX01FTlVfREFUQSA9IFwiL3Jlcy9kYXRhL21lbnUvY29tbXVuaWNhdGlvbi5qc29uXCI7XHJcblxyXG4vKipcclxuICogQGNsYXNzIE1lbnVWaWV3XHJcbiAqIEBicmllZiDjgrXjgqTjg4njg6Hjg4vjg6Xjg7zjga7jgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNZW51VmlldyBleHRlbmRzIEJhY2tib25lLlZpZXc8QmFja2JvbmUuTW9kZWw+IHtcclxuICAgIHByaXZhdGUgX3ByZXZlbnRMaXN0RXhwYW5kOiBib29sZWFuO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucz86IEJhY2tib25lLlZpZXdPcHRpb25zPEJhY2tib25lLk1vZGVsPikge1xyXG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Oh44OL44Ol44O844KS44Os44Oz44OA44Oq44Oz44Kw44GZ44KLXHJcbiAgICAgKiBAcGFyYW0gY2F0ZWdvcnkgW2luXSDjg6Hjg4vjg6Xjg7zjga7jgqvjg4bjgrTjg6rjg7xcclxuICAgICAqL1xyXG4gICAgcmVuZGVyKGNhdGVnb3J5PzogTWVudUNhdGVnb3J5KTogTWVudVZpZXcge1xyXG4gICAgICAgIGxldCBtZW51RGF0YSA9IFwiXCI7XHJcbiAgICAgICAgc3dpdGNoIChjYXRlZ29yeSkge1xyXG4gICAgICAgICAgICBjYXNlIE1lbnVDYXRlZ29yeS5HRVRTVEFSVEVEOlxyXG4gICAgICAgICAgICAgICAgbWVudURhdGEgPSBHRVRTVEFSVEVEX01FTlVfREFUQTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgY2FzZSBNZW51Q2F0ZWdvcnkuRE9DVU1FTlRTOlxyXG4gICAgICAgICAgICAgICAgbWVudURhdGEgPSBET0NVTUVOVFNfTUVOVV9EQVRBO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBjYXNlIE1lbnVDYXRlZ29yeS5SRVNPVVJDRVM6XHJcbiAgICAgICAgICAgICAgICBtZW51RGF0YSA9IFJFU09VUkNFU19NRU5VX0RBVEE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIGNhc2UgTWVudUNhdGVnb3J5LkNPTU1VTklDQVRJT046XHJcbiAgICAgICAgICAgICAgICBtZW51RGF0YSA9IENPTU1VTklDQVRJT05fTUVOVV9EQVRBO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgbWVudURhdGEgPSBUT1BfTUVOVV9EQVRBO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdG9VcmwobWVudURhdGEpLFxyXG4gICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgIGFzeW5jOiBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5kb25lKChkYXRhOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZ2V0SlNUKFxyXG4gICAgICAgICAgICAgICAgICAgIFwiI3RlbXBsYXRlLW1lbnUtbGlzdC1jb250YWluZXJcIixcclxuICAgICAgICAgICAgICAgICAgICB0b1VybChcIi90ZW1wbGF0ZXMvY29tbW9uL21lbnUuaHRtbFwiKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRtZW51ID0gJCh0ZW1wbGF0ZShkYXRhKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5hcHBlbmQoJG1lbnUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODoeODi+ODpeODvOOBq+mBuOaKnuOBl+OBn+ODmuODvOOCuOOCkuODnuODvOOCr+OBmeOCi1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwYWdlSWQgW2luXSDpgbjmip7jgZfjgZ/jg5rjg7zjgrhcclxuICAgICAqL1xyXG4gICAgc2V0Q3VycmVudFBhZ2UocGFnZUlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCAkbGlua3MgPSB0aGlzLiRlbC5maW5kKFwiYVwiKTtcclxuICAgICAgICAkbGlua3MuZWFjaCgoaW5kZXgsIGVsZW0pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJGxpbmsgPSAkKGVsZW0pO1xyXG4gICAgICAgICAgICBjb25zdCBocmVmID0gJGxpbmsuYXR0cihcImhyZWZcIik7XHJcbiAgICAgICAgICAgIGlmKGhyZWYgPT09IHBhZ2VJZCkge1xyXG4gICAgICAgICAgICAgICAgJGxpbmsuYWRkQ2xhc3MoXCJzZWxlY3RlZFwiKTtcclxuICAgICAgICAgICAgICAgICRsaW5rLnBhcmVudHMoXCIuZXhwYW5kYWJsZVwiKS5yZW1vdmVDbGFzcyhcImNvbGxhcHNlZFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRsaW5rLnJlbW92ZUNsYXNzKFwic2VsZWN0ZWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBldmVudHMoKTogYW55IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcInZjbGljayAuZXhwYW5kYWJsZVwiOiB0aGlzLm9uQ2xpY2tlZEV4cGFuZCxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog6ZaL6ZaJ5Y+v6IO944Gq44Oq44K544OI44Gu5Yem55CGXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgb25DbGlja2VkRXhwYW5kKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgaWYoJHRhcmdldC5hdHRyKFwidGFyZ2V0XCIpID09PSBcIl9ibGFua1wiKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3ByZXZlbnRMaXN0RXhwYW5kKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcHJldmVudExpc3RFeHBhbmQgPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoJHRhcmdldC5oYXNDbGFzcyhcImNvbGxhcHNlZFwiKSkge1xyXG4gICAgICAgICAgICAkdGFyZ2V0LnJlbW92ZUNsYXNzKFwiY29sbGFwc2VkXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICR0YXJnZXQuYWRkQ2xhc3MoXCJjb2xsYXBzZWRcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fcHJldmVudExpc3RFeHBhbmQgPSBmYWxzZTtcclxuICAgICAgICB9LCA1MDApO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==