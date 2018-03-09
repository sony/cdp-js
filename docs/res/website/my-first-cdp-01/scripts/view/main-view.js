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
define(["require", "exports", "cdp/ui", "../model/sample-model"], function (require, exports, ui_1, sample_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[view.MainView] ";
    /**
     * @class MainView
     * @brief メインビュークラス
     */
    var MainView = /** @class */ (function (_super) {
        __extends(MainView, _super);
        /**
         * constructor
         */
        function MainView() {
            return _super.call(this, "/templates/main.html", "page-main", {
                route: "page-main"
            }) || this;
        }
        ///////////////////////////////////////////////////////////////////////
        // Event Handler
        //! イベントハンドラのマッピング
        MainView.prototype.events = function () {
            return {
                "vclick .command-hello": this.onHello,
            };
        };
        //! ".command-hello" のイベントハンドラ
        MainView.prototype.onHello = function (event) {
            ui_1.Toast.show(sample_model_1.default.coolMethod("from CheckModel"));
        };
        ///////////////////////////////////////////////////////////////////////
        // Override: UI.PageView
        /**
         * jQM event: "pagebeforecreate" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        MainView.prototype.onPageBeforeCreate = function (event) {
            _super.prototype.onPageBeforeCreate.call(this, event);
        };
        /**
         * jQM event: "pagecreate" (旧:"pageinit") に対応
         *
         * @param event [in] イベントオブジェクト
         */
        MainView.prototype.onPageInit = function (event) {
            _super.prototype.onPageInit.call(this, event);
        };
        /**
         * jQM event: "pagebeforeshow" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        MainView.prototype.onPageBeforeShow = function (event, data) {
            _super.prototype.onPageBeforeShow.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainershow" (旧:"pageshow") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        MainView.prototype.onPageShow = function (event, data) {
            _super.prototype.onPageShow.call(this, event, data);
        };
        /**
         * jQM event: "pagebeforehide" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        MainView.prototype.onPageBeforeHide = function (event, data) {
            _super.prototype.onPageBeforeHide.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        MainView.prototype.onPageHide = function (event, data) {
            _super.prototype.onPageHide.call(this, event, data);
        };
        /**
         * jQM event: "pageremove" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        MainView.prototype.onPageRemove = function (event) {
            _super.prototype.onPageRemove.call(this, event);
        };
        return MainView;
    }(ui_1.PageView));
    exports.MainView = MainView;
    ui_1.registerPage(MainView);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi12aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vYXBwL3NjcmlwdHMvdmlldy9tYWluLXZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVVBLElBQU0sR0FBRyxHQUFHLGtCQUFrQixDQUFDO0lBRS9COzs7T0FHRztJQUNIO1FBQThCLDRCQUFRO1FBRWxDOztXQUVHO1FBQ0g7bUJBQ0ksa0JBQU0sc0JBQXNCLEVBQUUsV0FBVyxFQUFFO2dCQUN2QyxLQUFLLEVBQUUsV0FBVzthQUNyQixDQUFDO1FBQ04sQ0FBQztRQUVELHVFQUF1RTtRQUN2RSxnQkFBZ0I7UUFFaEIsa0JBQWtCO1FBQ2xCLHlCQUFNLEdBQU47WUFDSSxNQUFNLENBQUM7Z0JBQ0gsdUJBQXVCLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDeEMsQ0FBQztRQUNOLENBQUM7UUFFRCw4QkFBOEI7UUFDdEIsMEJBQU8sR0FBZixVQUFnQixLQUF3QjtZQUNwQyxVQUFLLENBQUMsSUFBSSxDQUFDLHNCQUFVLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUN6RCxDQUFDO1FBRUQsdUVBQXVFO1FBQ3ZFLHdCQUF3QjtRQUV4Qjs7OztXQUlHO1FBQ0gscUNBQWtCLEdBQWxCLFVBQW1CLEtBQXdCO1lBQ3ZDLGlCQUFNLGtCQUFrQixZQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFFRDs7OztXQUlHO1FBQ0gsNkJBQVUsR0FBVixVQUFXLEtBQXdCO1lBQy9CLGlCQUFNLFVBQVUsWUFBQyxLQUFLLENBQUMsQ0FBQztRQUM1QixDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSCxtQ0FBZ0IsR0FBaEIsVUFBaUIsS0FBd0IsRUFBRSxJQUFtQjtZQUMxRCxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsNkJBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSCxtQ0FBZ0IsR0FBaEIsVUFBaUIsS0FBd0IsRUFBRSxJQUFtQjtZQUMxRCxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsNkJBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILCtCQUFZLEdBQVosVUFBYSxLQUF3QjtZQUNqQyxpQkFBTSxZQUFZLFlBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUNMLGVBQUM7SUFBRCxDQUFDLEFBL0ZELENBQThCLGFBQVEsR0ErRnJDO0lBL0ZZLDRCQUFRO0lBaUdyQixpQkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgICBQYWdlVmlldyxcbiAgICBTaG93RXZlbnREYXRhLFxuICAgIEhpZGVFdmVudERhdGEsXG4gICAgVG9hc3QsXG4gICAgcmVnaXN0ZXJQYWdlLFxufSBmcm9tIFwiY2RwL3VpXCI7XG5cbmltcG9ydCBDaGVja01vZGVsIGZyb20gXCIuLi9tb2RlbC9zYW1wbGUtbW9kZWxcIjtcblxuY29uc3QgVEFHID0gXCJbdmlldy5NYWluVmlld10gXCI7XG5cbi8qKlxuICogQGNsYXNzIE1haW5WaWV3XG4gKiBAYnJpZWYg44Oh44Kk44Oz44OT44Ol44O844Kv44Op44K5XG4gKi9cbmV4cG9ydCBjbGFzcyBNYWluVmlldyBleHRlbmRzIFBhZ2VWaWV3IHtcblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKFwiL3RlbXBsYXRlcy9tYWluLmh0bWxcIiwgXCJwYWdlLW1haW5cIiwge1xuICAgICAgICAgICAgcm91dGU6IFwicGFnZS1tYWluXCJcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyBFdmVudCBIYW5kbGVyXG5cbiAgICAvLyEg44Kk44OZ44Oz44OI44OP44Oz44OJ44Op44Gu44Oe44OD44OU44Oz44KwXG4gICAgZXZlbnRzKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBcInZjbGljayAuY29tbWFuZC1oZWxsb1wiOiB0aGlzLm9uSGVsbG8sXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8hIFwiLmNvbW1hbmQtaGVsbG9cIiDjga7jgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6lcbiAgICBwcml2YXRlIG9uSGVsbG8oZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0KTogdm9pZCB7XG4gICAgICAgIFRvYXN0LnNob3coQ2hlY2tNb2RlbC5jb29sTWV0aG9kKFwiZnJvbSBDaGVja01vZGVsXCIpKTtcbiAgICB9XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vIE92ZXJyaWRlOiBVSS5QYWdlVmlld1xuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVjcmVhdGVcIiDjgavlr77lv5xcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxuICAgICAqL1xuICAgIG9uUGFnZUJlZm9yZUNyZWF0ZShldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNyZWF0ZVwiICjml6c6XCJwYWdlaW5pdFwiKSDjgavlr77lv5xcbiAgICAgKlxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxuICAgICAqL1xuICAgIG9uUGFnZUluaXQoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0KTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uUGFnZUluaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXG4gICAgICovXG4gICAgb25QYWdlQmVmb3JlU2hvdyhldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IFNob3dFdmVudERhdGEpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlU2hvdyhldmVudCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXG4gICAgICovXG4gICAgb25QYWdlU2hvdyhldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IFNob3dFdmVudERhdGEpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlU2hvdyhldmVudCwgZGF0YSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcbiAgICAgKi9cbiAgICBvblBhZ2VCZWZvcmVIaWRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xuICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVIaWRlKGV2ZW50LCBkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNvbnRhaW5lcmhpZGVcIiAo5penOlwicGFnZWhpZGVcIikg44Gr5a++5b+cXG4gICAgICpcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcbiAgICAgKi9cbiAgICBvblBhZ2VIaWRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xuICAgICAgICBzdXBlci5vblBhZ2VIaWRlKGV2ZW50LCBkYXRhKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZXJlbW92ZVwiIOOBq+WvvuW/nFxuICAgICAqXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXG4gICAgICovXG4gICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xuICAgICAgICBzdXBlci5vblBhZ2VSZW1vdmUoZXZlbnQpO1xuICAgIH1cbn1cblxucmVnaXN0ZXJQYWdlKE1haW5WaWV3KTtcbiJdfQ==