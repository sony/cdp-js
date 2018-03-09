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
    var TAG = "[view.GetStartedPage] ";
    /**
     * @class GetStartedView
     * @brief ホームページのクラス
     */
    var GetStartedPage = /** @class */ (function (_super) {
        __extends(GetStartedPage, _super);
        /**
         * constructor
         */
        function GetStartedPage() {
            return _super.call(this, "/templates/getstarted/index.html", "page-getstarted", {
                route: "getstarted(/:query)"
            }) || this;
        }
        ///////////////////////////////////////////////////////////////////////
        // Event Handler
        //! イベントハンドラのマッピング
        GetStartedPage.prototype.events = function () {
            return {};
        };
        ///////////////////////////////////////////////////////////////////////
        // Override: UI.PageView
        /**
         * jQM event: "pagebeforecreate" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        GetStartedPage.prototype.onPageBeforeCreate = function (event) {
            _super.prototype.onPageBeforeCreate.call(this, event);
        };
        /**
         * jQM event: "pagecreate" (旧:"pageinit") に対応
         *
         * @param event [in] イベントオブジェクト
         */
        GetStartedPage.prototype.onPageInit = function (event) {
            _super.prototype.onPageInit.call(this, event);
        };
        /**
         * jQM event: "pagebeforeshow" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        GetStartedPage.prototype.onPageBeforeShow = function (event, data) {
            console.log(TAG + "onPageBeforeShow");
            if (!this._pageUtils) {
                this._pageUtils = new page_utils_1.PageUtils({
                    el: this.$el,
                    category: page_utils_1.PageCategory.GETSTARTED,
                    templateDirctory: "/templates/getstarted/",
                    categoryPageHash: "#getstarted"
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
        GetStartedPage.prototype.onPageShow = function (event, data) {
            _super.prototype.onPageShow.call(this, event, data);
        };
        /**
         * jQM event: "pagebeforehide" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        GetStartedPage.prototype.onPageBeforeHide = function (event, data) {
            _super.prototype.onPageBeforeHide.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        GetStartedPage.prototype.onPageHide = function (event, data) {
            console.log(TAG + "onPageHide");
            _super.prototype.onPageHide.call(this, event, data);
        };
        /**
         * jQM event: "pageremove" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        GetStartedPage.prototype.onPageRemove = function (event) {
            console.log(TAG + "onPageRemove");
            if (this._pageUtils) {
                this._pageUtils.remove();
                this._pageUtils = null;
            }
            _super.prototype.onPageRemove.call(this, event);
        };
        return GetStartedPage;
    }(ui_1.PageView));
    exports.GetStartedPage = GetStartedPage;
    var __viewGetStartedPage = new GetStartedPage();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0c3RhcnRlZC1wYWdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vYXBwL3NjcmlwdHMvdmlldy9nZXRzdGFydGVkL2dldHN0YXJ0ZWQtcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBS0EsSUFBTSxHQUFHLEdBQUcsd0JBQXdCLENBQUM7SUFFckM7OztPQUdHO0lBQ0g7UUFBb0Msa0NBQXdCO1FBR3hEOztXQUVHO1FBQ0g7bUJBQ0ksa0JBQU0sa0NBQWtDLEVBQUUsaUJBQWlCLEVBQUU7Z0JBQ3pELEtBQUssRUFBRSxxQkFBcUI7YUFDL0IsQ0FBQztRQUNOLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsZ0JBQWdCO1FBRWhCLGtCQUFrQjtRQUNsQiwrQkFBTSxHQUFOO1lBQ0ksTUFBTSxDQUFDLEVBQ04sQ0FBQztRQUNOLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsd0JBQXdCO1FBRXhCOzs7O1dBSUc7UUFDSCwyQ0FBa0IsR0FBbEIsVUFBbUIsS0FBd0I7WUFDdkMsaUJBQU0sa0JBQWtCLFlBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxtQ0FBVSxHQUFWLFVBQVcsS0FBd0I7WUFDL0IsaUJBQU0sVUFBVSxZQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFRDs7Ozs7V0FLRztRQUNILHlDQUFnQixHQUFoQixVQUFpQixLQUF3QixFQUFFLElBQW1CO1lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLGtCQUFrQixDQUFDLENBQUM7WUFFdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHNCQUFTLENBQUM7b0JBQzVCLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRztvQkFDWixRQUFRLEVBQUUseUJBQVksQ0FBQyxVQUFVO29CQUNqQyxnQkFBZ0IsRUFBRSx3QkFBd0I7b0JBQzFDLGdCQUFnQixFQUFFLGFBQWE7aUJBQ2xDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxnQkFBZ0I7WUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVoQyxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsbUNBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSCx5Q0FBZ0IsR0FBaEIsVUFBaUIsS0FBd0IsRUFBRSxJQUFtQjtZQUMxRCxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsbUNBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDaEMsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILHFDQUFZLEdBQVosVUFBYSxLQUF3QjtZQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDM0IsQ0FBQztZQUNELGlCQUFNLFlBQVksWUFBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBS0wscUJBQUM7SUFBRCxDQUFDLEFBakhELENBQW9DLGFBQVEsR0FpSDNDO0lBakhZLHdDQUFjO0lBbUgzQixJQUFNLG9CQUFvQixHQUFHLElBQUksY0FBYyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBCYWNrYm9uZSBmcm9tIFwiYmFja2JvbmVcIjtcclxuaW1wb3J0IHsgUGFnZVZpZXcsIFNob3dFdmVudERhdGEsIEhpZGVFdmVudERhdGEgfSBmcm9tIFwiY2RwL3VpXCI7XHJcblxyXG5pbXBvcnQgeyBQYWdlVXRpbHMsIFBhZ2VDYXRlZ29yeSB9IGZyb20gXCIuLi9jb21tb24vcGFnZS11dGlsc1wiO1xyXG5cclxuY29uc3QgVEFHID0gXCJbdmlldy5HZXRTdGFydGVkUGFnZV0gXCI7XHJcblxyXG4vKipcclxuICogQGNsYXNzIEdldFN0YXJ0ZWRWaWV3XHJcbiAqIEBicmllZiDjg5vjg7zjg6Djg5rjg7zjgrjjga7jgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBHZXRTdGFydGVkUGFnZSBleHRlbmRzIFBhZ2VWaWV3PEJhY2tib25lLk1vZGVsPiB7XHJcbiAgICBwcml2YXRlIF9wYWdlVXRpbHM6IFBhZ2VVdGlscztcclxuXHJcbiAgICAvKipcclxuICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKFwiL3RlbXBsYXRlcy9nZXRzdGFydGVkL2luZGV4Lmh0bWxcIiwgXCJwYWdlLWdldHN0YXJ0ZWRcIiwge1xyXG4gICAgICAgICAgICByb3V0ZTogXCJnZXRzdGFydGVkKC86cXVlcnkpXCJcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gRXZlbnQgSGFuZGxlclxyXG5cclxuICAgIC8vISDjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6njga7jg57jg4Pjg5Tjg7PjgrBcclxuICAgIGV2ZW50cygpOiBhbnkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gT3ZlcnJpZGU6IFVJLlBhZ2VWaWV3XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBvblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY3JlYXRlXCIgKOaXpzpcInBhZ2Vpbml0XCIpIOOBq+WvvuW/nFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBvblBhZ2VJbml0KGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZUluaXQoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAqL1xyXG4gICAgb25QYWdlQmVmb3JlU2hvdyhldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IFNob3dFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhUQUcgKyBcIm9uUGFnZUJlZm9yZVNob3dcIik7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fcGFnZVV0aWxzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VVdGlscyA9IG5ldyBQYWdlVXRpbHMoe1xyXG4gICAgICAgICAgICAgICAgZWw6IHRoaXMuJGVsLFxyXG4gICAgICAgICAgICAgICAgY2F0ZWdvcnk6IFBhZ2VDYXRlZ29yeS5HRVRTVEFSVEVELFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVEaXJjdG9yeTogXCIvdGVtcGxhdGVzL2dldHN0YXJ0ZWQvXCIsXHJcbiAgICAgICAgICAgICAgICBjYXRlZ29yeVBhZ2VIYXNoOiBcIiNnZXRzdGFydGVkXCJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOODmuODvOOCuOOCs+ODs+ODhuODs+ODhOOBruWIh+OCiuabv+OBiFxyXG4gICAgICAgIHRoaXMuX3BhZ2VVdGlscy5jaGFuZ2VDb250ZW50KCk7XHJcblxyXG4gICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgKi9cclxuICAgIG9uUGFnZVNob3coZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBTaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgc3VwZXIub25QYWdlU2hvdyhldmVudCwgZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWhpZGVcIiDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSBkYXRhICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICovXHJcbiAgICBvblBhZ2VCZWZvcmVIaWRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUhpZGUoZXZlbnQsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJoaWRlXCIgKOaXpzpcInBhZ2VoaWRlXCIpIOOBq+WvvuW/nFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgKi9cclxuICAgIG9uUGFnZUhpZGUoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBIaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coVEFHICsgXCJvblBhZ2VIaWRlXCIpO1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZUhpZGUoZXZlbnQsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2VyZW1vdmVcIiDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFRBRyArIFwib25QYWdlUmVtb3ZlXCIpO1xyXG4gICAgICAgIGlmICh0aGlzLl9wYWdlVXRpbHMpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFnZVV0aWxzLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9wYWdlVXRpbHMgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzdXBlci5vblBhZ2VSZW1vdmUoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBQcml2YXRlIG1ldGhvZHNcclxuXHJcbn1cclxuXHJcbmNvbnN0IF9fdmlld0dldFN0YXJ0ZWRQYWdlID0gbmV3IEdldFN0YXJ0ZWRQYWdlKCk7XHJcbiJdfQ==