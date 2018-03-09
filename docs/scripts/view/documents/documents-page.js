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
    var TAG = "[view.DocumentsPage] ";
    /**
     * @class GetStartedView
     * @brief ホームページのクラス
     */
    var DocumentsPage = /** @class */ (function (_super) {
        __extends(DocumentsPage, _super);
        /**
         * constructor
         */
        function DocumentsPage() {
            return _super.call(this, "/templates/documents/index.html", "page-documents", {
                route: "documents(/:query)"
            }) || this;
        }
        ///////////////////////////////////////////////////////////////////////
        // Event Handler
        //! イベントハンドラのマッピング
        DocumentsPage.prototype.events = function () {
            return {};
        };
        ///////////////////////////////////////////////////////////////////////
        // Override: UI.PageView
        /**
         * jQM event: "pagebeforecreate" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        DocumentsPage.prototype.onPageBeforeCreate = function (event) {
            _super.prototype.onPageBeforeCreate.call(this, event);
        };
        /**
         * jQM event: "pagecreate" (旧:"pageinit") に対応
         *
         * @param event [in] イベントオブジェクト
         */
        DocumentsPage.prototype.onPageInit = function (event) {
            _super.prototype.onPageInit.call(this, event);
        };
        /**
         * jQM event: "pagebeforeshow" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        DocumentsPage.prototype.onPageBeforeShow = function (event, data) {
            console.log(TAG + "onPageBeforeShow");
            if (!this._pageUtils) {
                this._pageUtils = new page_utils_1.PageUtils({
                    el: this.$el,
                    category: page_utils_1.PageCategory.DOCUMENTS,
                    templateDirctory: "/templates/documents/",
                    categoryPageHash: "#documents",
                    defaultPageName: "cdp-boilerplate"
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
        DocumentsPage.prototype.onPageShow = function (event, data) {
            _super.prototype.onPageShow.call(this, event, data);
        };
        /**
         * jQM event: "pagebeforehide" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        DocumentsPage.prototype.onPageBeforeHide = function (event, data) {
            _super.prototype.onPageBeforeHide.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        DocumentsPage.prototype.onPageHide = function (event, data) {
            console.log(TAG + "onPageHide");
            _super.prototype.onPageHide.call(this, event, data);
        };
        /**
         * jQM event: "pageremove" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        DocumentsPage.prototype.onPageRemove = function (event) {
            console.log(TAG + "onPageRemove");
            if (this._pageUtils) {
                this._pageUtils.remove();
                this._pageUtils = null;
            }
            _super.prototype.onPageRemove.call(this, event);
        };
        return DocumentsPage;
    }(ui_1.PageView));
    exports.DocumentsPage = DocumentsPage;
    var __viewDocumentsPage = new DocumentsPage();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jdW1lbnRzLXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAvc2NyaXB0cy92aWV3L2RvY3VtZW50cy9kb2N1bWVudHMtcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBS0EsSUFBTSxHQUFHLEdBQUcsdUJBQXVCLENBQUM7SUFFcEM7OztPQUdHO0lBQ0g7UUFBbUMsaUNBQXdCO1FBR3ZEOztXQUVHO1FBQ0g7bUJBQ0ksa0JBQU0saUNBQWlDLEVBQUUsZ0JBQWdCLEVBQUU7Z0JBQ3ZELEtBQUssRUFBRSxvQkFBb0I7YUFDOUIsQ0FBQztRQUNOLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsZ0JBQWdCO1FBRWhCLGtCQUFrQjtRQUNsQiw4QkFBTSxHQUFOO1lBQ0ksTUFBTSxDQUFDLEVBQ04sQ0FBQztRQUNOLENBQUM7UUFFRCx1RUFBdUU7UUFDdkUsd0JBQXdCO1FBRXhCOzs7O1dBSUc7UUFDSCwwQ0FBa0IsR0FBbEIsVUFBbUIsS0FBd0I7WUFDdkMsaUJBQU0sa0JBQWtCLFlBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxrQ0FBVSxHQUFWLFVBQVcsS0FBd0I7WUFDL0IsaUJBQU0sVUFBVSxZQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzVCLENBQUM7UUFFRDs7Ozs7V0FLRztRQUNILHdDQUFnQixHQUFoQixVQUFpQixLQUF3QixFQUFFLElBQW1CO1lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLGtCQUFrQixDQUFDLENBQUM7WUFFdEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHNCQUFTLENBQUM7b0JBQzVCLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRztvQkFDWixRQUFRLEVBQUUseUJBQVksQ0FBQyxTQUFTO29CQUNoQyxnQkFBZ0IsRUFBRSx1QkFBdUI7b0JBQ3pDLGdCQUFnQixFQUFFLFlBQVk7b0JBQzlCLGVBQWUsRUFBRSxpQkFBaUI7aUJBQ3JDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxnQkFBZ0I7WUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUVoQyxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsa0NBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSCx3Q0FBZ0IsR0FBaEIsVUFBaUIsS0FBd0IsRUFBRSxJQUFtQjtZQUMxRCxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsa0NBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsWUFBWSxDQUFDLENBQUM7WUFDaEMsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILG9DQUFZLEdBQVosVUFBYSxLQUF3QjtZQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsQ0FBQztZQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDM0IsQ0FBQztZQUNELGlCQUFNLFlBQVksWUFBQyxLQUFLLENBQUMsQ0FBQztRQUM5QixDQUFDO1FBS0wsb0JBQUM7SUFBRCxDQUFDLEFBbEhELENBQW1DLGFBQVEsR0FrSDFDO0lBbEhZLHNDQUFhO0lBb0gxQixJQUFNLG1CQUFtQixHQUFHLElBQUksYUFBYSxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBCYWNrYm9uZSBmcm9tIFwiYmFja2JvbmVcIjtcclxuaW1wb3J0IHsgUGFnZVZpZXcsIFNob3dFdmVudERhdGEsIEhpZGVFdmVudERhdGEgfSBmcm9tIFwiY2RwL3VpXCI7XHJcblxyXG5pbXBvcnQgeyBQYWdlVXRpbHMsIFBhZ2VDYXRlZ29yeSB9IGZyb20gXCIuLi9jb21tb24vcGFnZS11dGlsc1wiO1xyXG5cclxuY29uc3QgVEFHID0gXCJbdmlldy5Eb2N1bWVudHNQYWdlXSBcIjtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgR2V0U3RhcnRlZFZpZXdcclxuICogQGJyaWVmIOODm+ODvOODoOODmuODvOOCuOOBruOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIERvY3VtZW50c1BhZ2UgZXh0ZW5kcyBQYWdlVmlldzxCYWNrYm9uZS5Nb2RlbD4ge1xyXG4gICAgcHJpdmF0ZSBfcGFnZVV0aWxzOiBQYWdlVXRpbHM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihcIi90ZW1wbGF0ZXMvZG9jdW1lbnRzL2luZGV4Lmh0bWxcIiwgXCJwYWdlLWRvY3VtZW50c1wiLCB7XHJcbiAgICAgICAgICAgIHJvdXRlOiBcImRvY3VtZW50cygvOnF1ZXJ5KVwiXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIEV2ZW50IEhhbmRsZXJcclxuXHJcbiAgICAvLyEg44Kk44OZ44Oz44OI44OP44Oz44OJ44Op44Gu44Oe44OD44OU44Oz44KwXHJcbiAgICBldmVudHMoKTogYW55IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIE92ZXJyaWRlOiBVSS5QYWdlVmlld1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVjcmVhdGVcIiDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUNyZWF0ZShldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNyZWF0ZVwiICjml6c6XCJwYWdlaW5pdFwiKSDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgb25QYWdlSW5pdChldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci5vblBhZ2VJbml0KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgKi9cclxuICAgIG9uUGFnZUJlZm9yZVNob3coZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBTaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coVEFHICsgXCJvblBhZ2VCZWZvcmVTaG93XCIpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX3BhZ2VVdGlscykge1xyXG4gICAgICAgICAgICB0aGlzLl9wYWdlVXRpbHMgPSBuZXcgUGFnZVV0aWxzKHtcclxuICAgICAgICAgICAgICAgIGVsOiB0aGlzLiRlbCxcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5OiBQYWdlQ2F0ZWdvcnkuRE9DVU1FTlRTLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVEaXJjdG9yeTogXCIvdGVtcGxhdGVzL2RvY3VtZW50cy9cIixcclxuICAgICAgICAgICAgICAgIGNhdGVnb3J5UGFnZUhhc2g6IFwiI2RvY3VtZW50c1wiLFxyXG4gICAgICAgICAgICAgICAgZGVmYXVsdFBhZ2VOYW1lOiBcImNkcC1ib2lsZXJwbGF0ZVwiXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyDjg5rjg7zjgrjjgrPjg7Pjg4bjg7Pjg4Tjga7liIfjgormm7/jgYhcclxuICAgICAgICB0aGlzLl9wYWdlVXRpbHMuY2hhbmdlQ29udGVudCgpO1xyXG5cclxuICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVTaG93KGV2ZW50LCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyc2hvd1wiICjml6c6XCJwYWdlc2hvd1wiKSDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSBkYXRhICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICovXHJcbiAgICBvblBhZ2VTaG93KGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAqL1xyXG4gICAgb25QYWdlQmVmb3JlSGlkZShldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IEhpZGVFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVIaWRlKGV2ZW50LCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyaGlkZVwiICjml6c6XCJwYWdlaGlkZVwiKSDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSBkYXRhICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICovXHJcbiAgICBvblBhZ2VIaWRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFRBRyArIFwib25QYWdlSGlkZVwiKTtcclxuICAgICAgICBzdXBlci5vblBhZ2VIaWRlKGV2ZW50LCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIG9uUGFnZVJlbW92ZShldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhUQUcgKyBcIm9uUGFnZVJlbW92ZVwiKTtcclxuICAgICAgICBpZiAodGhpcy5fcGFnZVV0aWxzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VVdGlscy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5fcGFnZVV0aWxzID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3VwZXIub25QYWdlUmVtb3ZlKGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgLy8gUHJpdmF0ZSBtZXRob2RzXHJcblxyXG59XHJcblxyXG5jb25zdCBfX3ZpZXdEb2N1bWVudHNQYWdlID0gbmV3IERvY3VtZW50c1BhZ2UoKTtcclxuIl19