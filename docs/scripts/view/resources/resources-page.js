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
define(["require", "exports", "cdp/ui", "../common/page-utils"], function (require, exports, ui_1, page_utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[view.ResourcesPage] ";
    /**
     * @class ResourcesView
     * @brief リソースカテゴリーのクラス
     */
    var ResourcesPage = /** @class */ (function (_super) {
        __extends(ResourcesPage, _super);
        /**
         * constructor
         */
        function ResourcesPage() {
            return _super.call(this, "/templates/resources/index.html", "page-resources", {
                route: "resources(/:query)"
            }) || this;
        }
        ///////////////////////////////////////////////////////////////////////
        // Event Handler
        //! イベントハンドラのマッピング
        ResourcesPage.prototype.events = function () {
            return {};
        };
        ///////////////////////////////////////////////////////////////////////
        // Override: UI.PageView
        /**
         * jQM event: "pagebeforecreate" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        ResourcesPage.prototype.onPageBeforeCreate = function (event) {
            _super.prototype.onPageBeforeCreate.call(this, event);
        };
        /**
         * jQM event: "pagecreate" (旧:"pageinit") に対応
         *
         * @param event [in] イベントオブジェクト
         */
        ResourcesPage.prototype.onPageInit = function (event) {
            _super.prototype.onPageInit.call(this, event);
        };
        /**
         * jQM event: "pagebeforeshow" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        ResourcesPage.prototype.onPageBeforeShow = function (event, data) {
            console.log(TAG + "onPageBeforeShow");
            if (!this._pageUtils) {
                this._pageUtils = new page_utils_1.PageUtils({
                    el: this.$el,
                    category: page_utils_1.PageCategory.RESOURCES,
                    templateDirctory: "/templates/resources/",
                    categoryPageHash: "#resources",
                    defaultPageName: "links-external-documents"
                });
            }
            // ページコンテンツの切り替え
            this._pageUtils.changeContent();
            _super.prototype.onPageBeforeShow.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainershow" (旧:"pageshow") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        ResourcesPage.prototype.onPageShow = function (event, data) {
            _super.prototype.onPageShow.call(this, event, data);
        };
        /**
         * jQM event: "pagebeforehide" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        ResourcesPage.prototype.onPageBeforeHide = function (event, data) {
            _super.prototype.onPageBeforeHide.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        ResourcesPage.prototype.onPageHide = function (event, data) {
            console.log(TAG + "onPageHide");
            _super.prototype.onPageHide.call(this, event, data);
        };
        /**
         * jQM event: "pageremove" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        ResourcesPage.prototype.onPageRemove = function (event) {
            console.log(TAG + "onPageRemove");
            if (this._pageUtils) {
                this._pageUtils.remove();
                this._pageUtils = null;
            }
            _super.prototype.onPageRemove.call(this, event);
        };
        return ResourcesPage;
    }(ui_1.PageView));
    exports.ResourcesPage = ResourcesPage;
    var __viewResourcesPage = new ResourcesPage();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb3VyY2VzLXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAvc2NyaXB0cy92aWV3L3Jlc291cmNlcy9yZXNvdXJjZXMtcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBS0EsSUFBTSxHQUFHLEdBQUcsdUJBQXVCLENBQUM7SUFFcEM7OztPQUdHO0lBQ0g7UUFBbUMsaUNBQXdCO1FBR3ZEOztXQUVHO1FBQ0g7bUJBQ0ksa0JBQU0saUNBQWlDLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBQ3ZELEtBQUssRUFBRSxvQkFBb0I7YUFDOUIsQ0FBQztRQUNOLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsZ0JBQWdCO1FBRWhCLGtCQUFrQjtRQUNsQiw4QkFBTSxHQUFOO1lBQ0ksTUFBTSxDQUFDLEVBQ04sQ0FBQztRQUNOLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsd0JBQXdCO1FBRXhCOzs7O1dBSUc7UUFDSCwwQ0FBa0IsR0FBbEIsVUFBbUIsS0FBd0I7WUFDdkMsaUJBQU0sa0JBQWtCLFlBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxrQ0FBVSxHQUFWLFVBQVcsS0FBd0I7WUFDL0IsaUJBQU0sVUFBVSxZQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFRDs7Ozs7V0FLRztRQUNILHdDQUFnQixHQUFoQixVQUFpQixLQUF3QixFQUFFLElBQW1CO1lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLGtCQUFrQixDQUFDLENBQUM7WUFFdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHNCQUFTLENBQUM7b0JBQzVCLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRztvQkFDWixRQUFRLEVBQUUseUJBQVksQ0FBQyxTQUFTO29CQUNoQyxnQkFBZ0IsRUFBRSx1QkFBdUI7b0JBQ3pDLGdCQUFnQixFQUFFLFlBQVk7b0JBQzlCLGVBQWUsRUFBRSwwQkFBMEI7aUJBQzlDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxnQkFBZ0I7WUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVoQyxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsa0NBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSCx3Q0FBZ0IsR0FBaEIsVUFBaUIsS0FBd0IsRUFBRSxJQUFtQjtZQUMxRCxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsa0NBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDaEMsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILG9DQUFZLEdBQVosVUFBYSxLQUF3QjtZQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDM0IsQ0FBQztZQUNELGlCQUFNLFlBQVksWUFBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBS0wsb0JBQUM7SUFBRCxDQUFDLEFBbEhELENBQW1DLGFBQVEsR0FrSDFDO0lBbEhZLHNDQUFhO0lBb0gxQixJQUFNLG1CQUFtQixHQUFHLElBQUksYUFBYSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBCYWNrYm9uZSBmcm9tIFwiYmFja2JvbmVcIjtcclxuaW1wb3J0IHsgUGFnZVZpZXcsIFNob3dFdmVudERhdGEsIEhpZGVFdmVudERhdGEgfSBmcm9tIFwiY2RwL3VpXCI7XHJcblxyXG5pbXBvcnQgeyBQYWdlVXRpbHMsIFBhZ2VDYXRlZ29yeSB9IGZyb20gXCIuLi9jb21tb24vcGFnZS11dGlsc1wiO1xyXG5cclxuY29uc3QgVEFHID0gXCJbdmlldy5SZXNvdXJjZXNQYWdlXSBcIjtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgUmVzb3VyY2VzVmlld1xyXG4gKiBAYnJpZWYg44Oq44K944O844K544Kr44OG44K044Oq44O844Gu44Kv44Op44K5XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVzb3VyY2VzUGFnZSBleHRlbmRzIFBhZ2VWaWV3PEJhY2tib25lLk1vZGVsPiB7XHJcbiAgICBwcml2YXRlIF9wYWdlVXRpbHM6IFBhZ2VVdGlscztcclxuXHJcbiAgICAvKipcclxuICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKFwiL3RlbXBsYXRlcy9yZXNvdXJjZXMvaW5kZXguaHRtbFwiLCBcInBhZ2UtcmVzb3VyY2VzXCIsIHtcclxuICAgICAgICAgICAgcm91dGU6IFwicmVzb3VyY2VzKC86cXVlcnkpXCJcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gRXZlbnQgSGFuZGxlclxyXG5cclxuICAgIC8vISDjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6njga7jg57jg4Pjg5Tjg7PjgrBcclxuICAgIGV2ZW50cygpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gT3ZlcnJpZGU6IFVJLlBhZ2VWaWV3XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBvblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY3JlYXRlXCIgKOaXpzpcInBhZ2Vpbml0XCIpIOOBq+WvvuW/nFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBvblBhZ2VJbml0KGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZUluaXQoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAqL1xyXG4gICAgb25QYWdlQmVmb3JlU2hvdyhldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IFNob3dFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhUQUcgKyBcIm9uUGFnZUJlZm9yZVNob3dcIik7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fcGFnZVV0aWxzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VVdGlscyA9IG5ldyBQYWdlVXRpbHMoe1xyXG4gICAgICAgICAgICAgICAgZWw6IHRoaXMuJGVsLFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFBhZ2VDYXRlZ29yeS5SRVNPVVJDRVMsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZURpcmN0b3J5OiBcIi90ZW1wbGF0ZXMvcmVzb3VyY2VzL1wiLFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnlQYWdlSGFzaDogXCIjcmVzb3VyY2VzXCIsXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0UGFnZU5hbWU6IFwibGlua3MtZXh0ZXJuYWwtZG9jdW1lbnRzXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOODmuODvOOCuOOCs+ODs+ODhuODs+ODhOOBruWIh+OCiuabv+OBiFxyXG4gICAgICAgIHRoaXMuX3BhZ2VVdGlscy5jaGFuZ2VDb250ZW50KCk7XHJcblxyXG4gICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgKi9cclxuICAgIG9uUGFnZVNob3coZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBTaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgc3VwZXIub25QYWdlU2hvdyhldmVudCwgZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWhpZGVcIiDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSBkYXRhICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICovXHJcbiAgICBvblBhZ2VCZWZvcmVIaWRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUhpZGUoZXZlbnQsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJoaWRlXCIgKOaXpzpcInBhZ2VoaWRlXCIpIOOBq+WvvuW/nFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgKi9cclxuICAgIG9uUGFnZUhpZGUoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBIaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coVEFHICsgXCJvblBhZ2VIaWRlXCIpO1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZUhpZGUoZXZlbnQsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2VyZW1vdmVcIiDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFRBRyArIFwib25QYWdlUmVtb3ZlXCIpO1xyXG4gICAgICAgIGlmICh0aGlzLl9wYWdlVXRpbHMpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFnZVV0aWxzLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYWdlVXRpbHMgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlci5vblBhZ2VSZW1vdmUoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBQcml2YXRlIG1ldGhvZHNcclxuXHJcbn1cclxuXHJcbmNvbnN0IF9fdmlld1Jlc291cmNlc1BhZ2UgPSBuZXcgUmVzb3VyY2VzUGFnZSgpO1xyXG4iXX0=