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
define(["require", "exports", "cdp/ui"], function (require, exports, ui_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TAG = "[view.gallery.BasePageView] ";
    /**
     * @class ThemeSwitcher
     * @brief テーマ切り替え View
     */
    var ThemeSwitcher = /** @class */ (function (_super) {
        __extends(ThemeSwitcher, _super);
        /**
         * constructor
         */
        function ThemeSwitcher(options) {
            var _this = _super.call(this, options) || this;
            switch (ui_1.Theme.getCurrentUIPlatform()) {
                case "ios":
                    _this.$el.find("#gallery-theme-ios").prop("checked", true);
                    break;
                case "android":
                    _this.$el.find("#gallery-theme-android").prop("checked", true);
                    break;
                default:
                    ui_1.Toast.show(TAG + "\n unknown platform.");
                    _this.$el.find("#gallery-theme-default").prop("checked", true);
                    break;
            }
            _this.$el.find("input[name='segmented-control-platform-theme']").checkboxradio("refresh");
            return _this;
        }
        //! 破棄 (同一 element を扱わないようにするための専用処理)
        ThemeSwitcher.prototype.destroy = function () {
            this.stopListening();
            this.$el.find("#gallery-theme-ios").attr("id", null);
            this.$el.find("#gallery-theme-android").attr("id", null);
            this.$el.find("#gallery-theme-default").attr("id", null);
            this.$el.find("label").attr("for", null);
            this.$el.removeClass("theme-switcher");
        };
        ///////////////////////////////////////////////////////////////////////
        // Event Handler:
        //! events binding
        ThemeSwitcher.prototype.events = function () {
            return {
                "change input[name='segmented-control-platform-theme']": this.onThemeChanged,
            };
        };
        //! テーマ切り替え
        ThemeSwitcher.prototype.onThemeChanged = function (event) {
            var platform = this.$el.find("input[name='segmented-control-platform-theme']:checked").val();
            if ("default" === platform) {
                platform = null;
            }
            ui_1.Theme.setCurrentUIPlatform(platform);
        };
        return ThemeSwitcher;
    }(ui_1.PageContainerView));
    //_____________________________________________________________________________________________//
    /**
     * @class BasePageView
     * @brief Gallery 共通の画面基底クラス
     */
    var BasePageView = /** @class */ (function (_super) {
        __extends(BasePageView, _super);
        /**
         * constructor
         */
        function BasePageView(url, id, options) {
            var _this = _super.call(this, url, id, options) || this;
            _this._themeSwitchTemplate = ui_1.getTemplate("#template-gallery-theme-switcher", ui_1.toUrl("/templates/gallery/theme-switcher.html"));
            return _this;
        }
        ///////////////////////////////////////////////////////////////////////
        // Override: UI.PageView
        //! Router "before route change" ハンドラ
        BasePageView.prototype.onBeforeRouteChange = function () {
            if (this._themeSwitcher) {
                this._themeSwitcher.destroy();
                this._themeSwitcher = null;
            }
            return _super.prototype.onBeforeRouteChange.call(this);
        };
        //! jQM event: "pagebeforecreate" に対応
        BasePageView.prototype.onPageBeforeCreate = function (event) {
            _super.prototype.onPageBeforeCreate.call(this, event);
            $(this._themeSwitchTemplate()).prependTo(this.$page.find("[data-role=content]"));
        };
        //! jQM event: "pagecreate" (旧:"pageinit") に対応
        BasePageView.prototype.onPageInit = function (event) {
            _super.prototype.onPageInit.call(this, event);
            this._themeSwitcher = new ThemeSwitcher({
                owner: this,
                $el: this.$el.find(".theme-switcher"),
            });
        };
        //! jQM event: "pagebeforehide" に対応
        BasePageView.prototype.onPageBeforeHide = function (event, data) {
            _super.prototype.onPageBeforeHide.call(this, event, data);
        };
        return BasePageView;
    }(ui_1.PageView));
    exports.BasePageView = BasePageView;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1wYWdldmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9zY3JpcHRzL3ZpZXcvZ2FsbGVyeS9iYXNlLXBhZ2V2aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFjQSxJQUFNLEdBQUcsR0FBRyw4QkFBOEIsQ0FBQztJQUUzQzs7O09BR0c7SUFDSDtRQUE0QixpQ0FBaUI7UUFFekM7O1dBRUc7UUFDSCx1QkFBWSxPQUFpQztZQUE3QyxZQUNJLGtCQUFNLE9BQU8sQ0FBQyxTQWNqQjtZQWJHLE1BQU0sQ0FBQyxDQUFDLFVBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsS0FBSyxLQUFLO29CQUNOLEtBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDMUQsS0FBSyxDQUFDO2dCQUNWLEtBQUssU0FBUztvQkFDVixLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzlELEtBQUssQ0FBQztnQkFDVjtvQkFDSSxVQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDO29CQUN6QyxLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzlELEtBQUssQ0FBQztZQUNkLENBQUM7WUFDRCxLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7UUFDN0YsQ0FBQztRQUVELHFDQUFxQztRQUM5QiwrQkFBTyxHQUFkO1lBQ0ksSUFBSSxDQUFDLGFBQWEsRUFB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QWlCLEtBQXdCLEVBQUUsSUFBbUI7WUFDMUQsaUJBQU0sZ0JBQWdCLFlBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFDTCxtQkFBQztJQUFELENBQUMsQUE1Q0QsQ0FBa0MsYUFBUSxHQTRDekM7SUE1Q1ksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xyXG4gICAgdG9VcmwsXHJcbiAgICBnZXRUZW1wbGF0ZSxcclxuICAgIEpTVCxcclxuICAgIElQcm9taXNlQmFzZSxcclxuICAgIEhpZGVFdmVudERhdGEsXHJcbiAgICBQYWdlVmlldyxcclxuICAgIFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9ucyxcclxuICAgIFBhZ2VDb250YWluZXJWaWV3LFxyXG4gICAgUGFnZUNvbnRhaW5lclZpZXdPcHRpb25zLFxyXG4gICAgVGhlbWUsXHJcbiAgICBUb2FzdCxcclxufSBmcm9tIFwiY2RwL3VpXCI7XHJcblxyXG5jb25zdCBUQUcgPSBcIlt2aWV3LmdhbGxlcnkuQmFzZVBhZ2VWaWV3XSBcIjtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgVGhlbWVTd2l0Y2hlclxyXG4gKiBAYnJpZWYg44OG44O844Oe5YiH44KK5pu/44GIIFZpZXdcclxuICovXHJcbmNsYXNzIFRoZW1lU3dpdGNoZXIgZXh0ZW5kcyBQYWdlQ29udGFpbmVyVmlldyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBQYWdlQ29udGFpbmVyVmlld09wdGlvbnMpIHtcclxuICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICBzd2l0Y2ggKFRoZW1lLmdldEN1cnJlbnRVSVBsYXRmb3JtKCkpIHtcclxuICAgICAgICAgICAgY2FzZSBcImlvc1wiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWwuZmluZChcIiNnYWxsZXJ5LXRoZW1lLWlvc1wiKS5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFwiYW5kcm9pZFwiOlxyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWwuZmluZChcIiNnYWxsZXJ5LXRoZW1lLWFuZHJvaWRcIikucHJvcChcImNoZWNrZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIFRvYXN0LnNob3coVEFHICsgXCJcXG4gdW5rbm93biBwbGF0Zm9ybS5cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5maW5kKFwiI2dhbGxlcnktdGhlbWUtZGVmYXVsdFwiKS5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLiRlbC5maW5kKFwiaW5wdXRbbmFtZT0nc2VnbWVudGVkLWNvbnRyb2wtcGxhdGZvcm0tdGhlbWUnXVwiKS5jaGVja2JveHJhZGlvKFwicmVmcmVzaFwiKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyEg56C05qOEICjlkIzkuIAgZWxlbWVudCDjgpLmibHjgo/jgarjgYTjgojjgYbjgavjgZnjgovjgZ/jgoHjga7lsILnlKjlh6bnkIYpXHJcbiAgICBwdWJsaWMgZGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnN0b3BMaXN0ZW5pbmcoKTtcclxuICAgICAgICB0aGlzLiRlbC5maW5kKFwiI2dhbGxlcnktdGhlbWUtaW9zXCIpLmF0dHIoXCJpZFwiLCBudWxsKTtcclxuICAgICAgICB0aGlzLiRlbC5maW5kKFwiI2dhbGxlcnktdGhlbWUtYW5kcm9pZFwiKS5hdHRyKFwiaWRcIiwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy4kZWwuZmluZChcIiNnYWxsZXJ5LXRoZW1lLWRlZmF1bHRcIikuYXR0cihcImlkXCIsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoXCJsYWJlbFwiKS5hdHRyKFwiZm9yXCIsIG51bGwpO1xyXG4gICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKFwidGhlbWUtc3dpdGNoZXJcIik7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIEV2ZW50IEhhbmRsZXI6XHJcblxyXG4gICAgLy8hIGV2ZW50cyBiaW5kaW5nXHJcbiAgICBldmVudHMoKTogYW55IHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBcImNoYW5nZSBpbnB1dFtuYW1lPSdzZWdtZW50ZWQtY29udHJvbC1wbGF0Zm9ybS10aGVtZSddXCI6IHRoaXMub25UaGVtZUNoYW5nZWQsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvLyEg44OG44O844Oe5YiH44KK5pu/44GIXHJcbiAgICBwcml2YXRlIG9uVGhlbWVDaGFuZ2VkKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xyXG4gICAgICAgIGxldCBwbGF0Zm9ybSA9IDxzdHJpbmc+dGhpcy4kZWwuZmluZChcImlucHV0W25hbWU9J3NlZ21lbnRlZC1jb250cm9sLXBsYXRmb3JtLXRoZW1lJ106Y2hlY2tlZFwiKS52YWwoKTtcclxuICAgICAgICBpZiAoXCJkZWZhdWx0XCIgPT09IHBsYXRmb3JtKSB7XHJcbiAgICAgICAgICAgIHBsYXRmb3JtID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgVGhlbWUuc2V0Q3VycmVudFVJUGxhdGZvcm0ocGxhdGZvcm0pO1xyXG4gICAgfVxyXG59XHJcblxyXG4vL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4vKipcclxuICogQGNsYXNzIEJhc2VQYWdlVmlld1xyXG4gKiBAYnJpZWYgR2FsbGVyeSDlhbHpgJrjga7nlLvpnaLln7rlupXjgq/jg6njgrlcclxuICovXHJcbmV4cG9ydCBjbGFzcyBCYXNlUGFnZVZpZXcgZXh0ZW5kcyBQYWdlVmlldyB7XHJcblxyXG4gICAgcHJpdmF0ZSBfdGhlbWVTd2l0Y2hUZW1wbGF0ZTogSlNUO1xyXG4gICAgcHJpdmF0ZSBfdGhlbWVTd2l0Y2hlcjogVGhlbWVTd2l0Y2hlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogUGFnZVZpZXdDb25zdHJ1Y3RPcHRpb25zKSB7XHJcbiAgICAgICAgc3VwZXIodXJsLCBpZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgdGhpcy5fdGhlbWVTd2l0Y2hUZW1wbGF0ZSA9IGdldFRlbXBsYXRlKFwiI3RlbXBsYXRlLWdhbGxlcnktdGhlbWUtc3dpdGNoZXJcIiwgdG9VcmwoXCIvdGVtcGxhdGVzL2dhbGxlcnkvdGhlbWUtc3dpdGNoZXIuaHRtbFwiKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIE92ZXJyaWRlOiBVSS5QYWdlVmlld1xyXG5cclxuICAgIC8vISBSb3V0ZXIgXCJiZWZvcmUgcm91dGUgY2hhbmdlXCIg44OP44Oz44OJ44OpXHJcbiAgICBvbkJlZm9yZVJvdXRlQ2hhbmdlKCk6IElQcm9taXNlQmFzZTxhbnk+IHtcclxuICAgICAgICBpZiAodGhpcy5fdGhlbWVTd2l0Y2hlcikge1xyXG4gICAgICAgICAgICB0aGlzLl90aGVtZVN3aXRjaGVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5fdGhlbWVTd2l0Y2hlciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzdXBlci5vbkJlZm9yZVJvdXRlQ2hhbmdlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8hIGpRTSBldmVudDogXCJwYWdlYmVmb3JlY3JlYXRlXCIg44Gr5a++5b+cXHJcbiAgICBvblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50KTtcclxuICAgICAgICAkKHRoaXMuX3RoZW1lU3dpdGNoVGVtcGxhdGUoKSkucHJlcGVuZFRvKHRoaXMuJHBhZ2UuZmluZChcIltkYXRhLXJvbGU9Y29udGVudF1cIikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vISBqUU0gZXZlbnQ6IFwicGFnZWNyZWF0ZVwiICjml6c6XCJwYWdlaW5pdFwiKSDjgavlr77lv5xcclxuICAgIG9uUGFnZUluaXQoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0KTogdm9pZCB7XHJcbiAgICAgICAgc3VwZXIub25QYWdlSW5pdChldmVudCk7XHJcbiAgICAgICAgdGhpcy5fdGhlbWVTd2l0Y2hlciA9IG5ldyBUaGVtZVN3aXRjaGVyKHtcclxuICAgICAgICAgICAgb3duZXI6IHRoaXMsXHJcbiAgICAgICAgICAgICRlbDogdGhpcy4kZWwuZmluZChcIi50aGVtZS1zd2l0Y2hlclwiKSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyEgalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXHJcbiAgICBvblBhZ2VCZWZvcmVIaWRlKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCwgZGF0YTogSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUhpZGUoZXZlbnQsIGRhdGEpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==