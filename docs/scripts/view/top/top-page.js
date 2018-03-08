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
define(["require", "exports", "cdp/ui", "../common/header", "../common/footer", "../../util/functions"], function (require, exports, ui_1, header_1, footer_1, functions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[view.TopPage] ";
    /**
     * @class HomeView
     * @brief ホームページのクラス
     */
    var TopPage = /** @class */ (function (_super) {
        __extends(TopPage, _super);
        /**
         * constructor
         */
        function TopPage() {
            return _super.call(this, "/templates/top/top.html", "page-top", {
                route: "top"
            }) || this;
        }
        ///////////////////////////////////////////////////////////////////////
        // Event Handler
        //! イベントハンドラのマッピング
        TopPage.prototype.events = function () {
            return {
                "vclick .command-demo-device-rotate": this.onDemoDeviceRotate,
                "vclick .command-demo-zoom": this.onDemoDeviceZoom,
            };
        };
        /**
         * デモの回転ボタンをクリックされたときに呼び出される
         *
         * @param event [in] イベントオブジェクト
         */
        TopPage.prototype.onDemoDeviceRotate = function (event) {
            var $demoContainer = this.$el.find(".demo-container");
            if ($demoContainer.hasClass("iphone7-portrait")) {
                $demoContainer.removeClass("iphone7-portrait")
                    .addClass("iphone7-landscape");
            }
            else {
                $demoContainer.removeClass("iphone7-landscape")
                    .addClass("iphone7-portrait");
            }
        };
        /**
         * デモのZoomボタンをクリックされたときに呼び出される
         *
         * @param event [in] イベントオブジェクト
         */
        TopPage.prototype.onDemoDeviceZoom = function (event) {
            var $demoContainer = this.$el.find(".demo-container");
            if ($demoContainer.hasClass("zoom-out")) {
                $demoContainer.removeClass("zoom-out");
            }
            else {
                $demoContainer.addClass("zoom-out");
            }
        };
        ///////////////////////////////////////////////////////////////////////
        // Override: UI.PageView
        /**
         * jQM event: "pagebeforecreate" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        TopPage.prototype.onPageBeforeCreate = function (event) {
            _super.prototype.onPageBeforeCreate.call(this, event);
        };
        /**
         * jQM event: "pagecreate" (旧:"pageinit") に対応
         *
         * @param event [in] イベントオブジェクト
         */
        TopPage.prototype.onPageInit = function (event) {
            _super.prototype.onPageInit.call(this, event);
        };
        /**
         * jQM event: "pagebeforeshow" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        TopPage.prototype.onPageBeforeShow = function (event, data) {
            if (!this._headerView) {
                this._headerView = new header_1.HeaderView({
                    el: this.$el.find(".page-base-header")
                });
                this._headerView.render();
            }
            if (!this._footerView) {
                this._footerView = new footer_1.FooterView({
                    el: this.$el.find(".page-base-footer")
                });
                this._footerView.render();
            }
            functions_1.Utils.activateAllExternalLinks(this.$el);
            _super.prototype.onPageBeforeShow.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainershow" (旧:"pageshow") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        TopPage.prototype.onPageShow = function (event, data) {
            _super.prototype.onPageShow.call(this, event, data);
        };
        /**
         * jQM event: "pagebeforehide" に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        TopPage.prototype.onPageBeforeHide = function (event, data) {
            _super.prototype.onPageBeforeHide.call(this, event, data);
        };
        /**
         * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
         *
         * @param event [in] イベントオブジェクト
         * @param data  [in] 付加情報
         */
        TopPage.prototype.onPageHide = function (event, data) {
            _super.prototype.onPageHide.call(this, event, data);
        };
        /**
         * jQM event: "pageremove" に対応
         *
         * @param event [in] イベントオブジェクト
         */
        TopPage.prototype.onPageRemove = function (event) {
            this._headerView = null;
            this._footerView = null;
            _super.prototype.onPageRemove.call(this, event);
        };
        return TopPage;
    }(ui_1.PageView));
    exports.TopPage = TopPage;
    var __viewTopPage = new TopPage();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9wLXBhZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9hcHAvc2NyaXB0cy92aWV3L3RvcC90b3AtcGFnZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBT0EsSUFBTSxHQUFHLEdBQUcsaUJBQWlCLENBQUM7SUFFOUI7OztPQUdHO0lBQ0g7UUFBNkIsMkJBQXdCO1FBSWpEOztXQUVHO1FBQ0g7bUJBQ0ksa0JBQU0seUJBQXlCLEVBQUUsVUFBVSxFQUFFO2dCQUN6QyxLQUFLLEVBQUUsS0FBSzthQUNmLENBQUM7UUFDTixDQUFDO1FBRUQsdUVBQXVFO1FBQ3ZFLGdCQUFnQjtRQUVoQixrQkFBa0I7UUFDbEIsd0JBQU0sR0FBTjtZQUNJLE1BQU0sQ0FBQztnQkFDSCxvQ0FBb0MsRUFBRSxJQUFJLENBQUMsa0JBQWtCO2dCQUM3RCwyQkFBMkIsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO2FBQ3JELENBQUM7UUFDTixDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILG9DQUFrQixHQUFsQixVQUFtQixLQUF3QjtZQUN2QyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3hELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlDLGNBQWMsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUM7cUJBQ3pDLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBQ3ZDLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixjQUFjLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDO3FCQUMxQyxRQUFRLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUN0QyxDQUFDO1FBQ0wsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxrQ0FBZ0IsR0FBaEIsVUFBaUIsS0FBd0I7WUFDckMsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUN4RCxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osY0FBYyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QyxDQUFDO1FBQ0wsQ0FBQztRQUVELHVFQUF1RTtRQUN2RSx3QkFBd0I7UUFFeEI7Ozs7V0FJRztRQUNILG9DQUFrQixHQUFsQixVQUFtQixLQUF3QjtZQUN2QyxpQkFBTSxrQkFBa0IsWUFBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILDRCQUFVLEdBQVYsVUFBVyxLQUF3QjtZQUMvQixpQkFBTSxVQUFVLFlBQUMsS0FBSyxDQUFDLENBQUM7UUFDNUIsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsa0NBQWdCLEdBQWhCLFVBQWlCLEtBQXdCLEVBQUUsSUFBbUI7WUFDMUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztnQkFDcEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLG1CQUFVLENBQUM7b0JBQzlCLEVBQUUsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztpQkFDekMsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDOUIsQ0FBQztZQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxtQkFBVSxDQUFDO29CQUM5QixFQUFFLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUM7aUJBQ3pDLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQzlCLENBQUM7WUFFRCxpQkFBSyxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV6QyxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsNEJBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7O1dBS0c7UUFDSCxrQ0FBZ0IsR0FBaEIsVUFBaUIsS0FBd0IsRUFBRSxJQUFtQjtZQUMxRCxpQkFBTSxnQkFBZ0IsWUFBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEMsQ0FBQztRQUVEOzs7OztXQUtHO1FBQ0gsNEJBQVUsR0FBVixVQUFXLEtBQXdCLEVBQUUsSUFBbUI7WUFDcEQsaUJBQU0sVUFBVSxZQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBRUQ7Ozs7V0FJRztRQUNILDhCQUFZLEdBQVosVUFBYSxLQUF3QjtZQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixpQkFBTSxZQUFZLFlBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUNMLGNBQUM7SUFBRCxDQUFDLEFBNUlELENBQTZCLGFBQVEsR0E0SXBDO0lBNUlZLDBCQUFPO0lBOElwQixJQUFNLGFBQWEsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgQmFja2JvbmUgZnJvbSBcImJhY2tib25lXCI7XHJcbmltcG9ydCB7IFBhZ2VWaWV3LCBTaG93RXZlbnREYXRhLCBIaWRlRXZlbnREYXRhIH0gZnJvbSBcImNkcC91aVwiO1xyXG5cclxuaW1wb3J0IHsgSGVhZGVyVmlldyB9IGZyb20gXCIuLi9jb21tb24vaGVhZGVyXCI7XHJcbmltcG9ydCB7IEZvb3RlclZpZXcgfSBmcm9tIFwiLi4vY29tbW9uL2Zvb3RlclwiO1xyXG5pbXBvcnQgeyBVdGlscyB9IGZyb20gXCIuLi8uLi91dGlsL2Z1bmN0aW9uc1wiO1xyXG5cclxuY29uc3QgVEFHID0gXCJbdmlldy5Ub3BQYWdlXSBcIjtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgSG9tZVZpZXdcclxuICogQGJyaWVmIOODm+ODvOODoOODmuODvOOCuOOBruOCr+ODqeOCuVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFRvcFBhZ2UgZXh0ZW5kcyBQYWdlVmlldzxCYWNrYm9uZS5Nb2RlbD4ge1xyXG5cclxuICAgIHByaXZhdGUgX2hlYWRlclZpZXc6IEhlYWRlclZpZXc7XHJcbiAgICBwcml2YXRlIF9mb290ZXJWaWV3OiBGb290ZXJWaWV3O1xyXG4gICAgLyoqXHJcbiAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihcIi90ZW1wbGF0ZXMvdG9wL3RvcC5odG1sXCIsIFwicGFnZS10b3BcIiwge1xyXG4gICAgICAgICAgICByb3V0ZTogXCJ0b3BcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAvLyBFdmVudCBIYW5kbGVyXHJcblxyXG4gICAgLy8hIOOCpOODmeODs+ODiOODj+ODs+ODieODqeOBruODnuODg+ODlOODs+OCsFxyXG4gICAgZXZlbnRzKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgXCJ2Y2xpY2sgLmNvbW1hbmQtZGVtby1kZXZpY2Utcm90YXRlXCI6IHRoaXMub25EZW1vRGV2aWNlUm90YXRlLFxyXG4gICAgICAgICAgICBcInZjbGljayAuY29tbWFuZC1kZW1vLXpvb21cIjogdGhpcy5vbkRlbW9EZXZpY2Vab29tLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg4fjg6Ljga7lm57ou6Ljg5zjgr/jg7PjgpLjgq/jg6rjg4Pjgq/jgZXjgozjgZ/jgajjgY3jgavlkbzjgbPlh7rjgZXjgozjgotcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgb25EZW1vRGV2aWNlUm90YXRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0ICRkZW1vQ29udGFpbmVyID0gdGhpcy4kZWwuZmluZChcIi5kZW1vLWNvbnRhaW5lclwiKTtcclxuICAgICAgICBpZiAoJGRlbW9Db250YWluZXIuaGFzQ2xhc3MoXCJpcGhvbmU3LXBvcnRyYWl0XCIpKSB7XHJcbiAgICAgICAgICAgICRkZW1vQ29udGFpbmVyLnJlbW92ZUNsYXNzKFwiaXBob25lNy1wb3J0cmFpdFwiKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiaXBob25lNy1sYW5kc2NhcGVcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJGRlbW9Db250YWluZXIucmVtb3ZlQ2xhc3MoXCJpcGhvbmU3LWxhbmRzY2FwZVwiKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKFwiaXBob25lNy1wb3J0cmFpdFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg4fjg6Ljga5ab29t44Oc44K/44Oz44KS44Kv44Oq44OD44Kv44GV44KM44Gf44Go44GN44Gr5ZG844Gz5Ye644GV44KM44KLXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIG9uRGVtb0RldmljZVpvb20oZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgJGRlbW9Db250YWluZXIgPSB0aGlzLiRlbC5maW5kKFwiLmRlbW8tY29udGFpbmVyXCIpO1xyXG4gICAgICAgIGlmICgkZGVtb0NvbnRhaW5lci5oYXNDbGFzcyhcInpvb20tb3V0XCIpKSB7XHJcbiAgICAgICAgICAgICRkZW1vQ29udGFpbmVyLnJlbW92ZUNsYXNzKFwiem9vbS1vdXRcIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJGRlbW9Db250YWluZXIuYWRkQ2xhc3MoXCJ6b29tLW91dFwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIE92ZXJyaWRlOiBVSS5QYWdlVmlld1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVjcmVhdGVcIiDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUNyZWF0ZShldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNyZWF0ZVwiICjml6c6XCJwYWdlaW5pdFwiKSDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgb25QYWdlSW5pdChldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci5vblBhZ2VJbml0KGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBldmVudCBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIGRhdGEgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgKi9cclxuICAgIG9uUGFnZUJlZm9yZVNob3coZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBTaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9oZWFkZXJWaWV3KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlYWRlclZpZXcgPSBuZXcgSGVhZGVyVmlldyh7XHJcbiAgICAgICAgICAgICAgICBlbDogdGhpcy4kZWwuZmluZChcIi5wYWdlLWJhc2UtaGVhZGVyXCIpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9oZWFkZXJWaWV3LnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuX2Zvb3RlclZpZXcpIHtcclxuICAgICAgICAgICAgdGhpcy5fZm9vdGVyVmlldyA9IG5ldyBGb290ZXJWaWV3KHtcclxuICAgICAgICAgICAgICAgIGVsOiB0aGlzLiRlbC5maW5kKFwiLnBhZ2UtYmFzZS1mb290ZXJcIilcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Zvb3RlclZpZXcucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBVdGlscy5hY3RpdmF0ZUFsbEV4dGVybmFsTGlua3ModGhpcy4kZWwpO1xyXG5cclxuICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVTaG93KGV2ZW50LCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyc2hvd1wiICjml6c6XCJwYWdlc2hvd1wiKSDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSBkYXRhICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICovXHJcbiAgICBvblBhZ2VTaG93KGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGV2ZW50IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0gZGF0YSAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAqL1xyXG4gICAgb25QYWdlQmVmb3JlSGlkZShldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QsIGRhdGE6IEhpZGVFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVIaWRlKGV2ZW50LCBkYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyaGlkZVwiICjml6c6XCJwYWdlaGlkZVwiKSDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSBkYXRhICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICovXHJcbiAgICBvblBhZ2VIaWRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZUhpZGUoZXZlbnQsIGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogalFNIGV2ZW50OiBcInBhZ2VyZW1vdmVcIiDjgavlr77lv5xcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZXZlbnQgW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2hlYWRlclZpZXcgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2Zvb3RlclZpZXcgPSBudWxsO1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZVJlbW92ZShldmVudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IF9fdmlld1RvcFBhZ2UgPSBuZXcgVG9wUGFnZSgpO1xyXG4iXX0=