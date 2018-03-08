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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1wYWdldmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2FwcC9zY3JpcHRzL3ZpZXcvZ2FsbGVyeS9iYXNlLXBhZ2V2aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFjQSxJQUFNLEdBQUcsR0FBRyw4QkFBOEIsQ0FBQztJQUUzQzs7O09BR0c7SUFDSDtRQUE0QixpQ0FBaUI7UUFFekM7O1dBRUc7UUFDSCx1QkFBWSxPQUFpQztZQUE3QyxZQUNJLGtCQUFNLE9BQU8sQ0FBQyxTQWNqQjtZQWJHLE1BQU0sQ0FBQyxDQUFDLFVBQUssQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkMsS0FBSyxLQUFLO29CQUNOLEtBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDMUQsS0FBSyxDQUFDO2dCQUNWLEtBQUssU0FBUztvQkFDVixLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzlELEtBQUssQ0FBQztnQkFDVjtvQkFDSSxVQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxzQkFBc0IsQ0FBQyxDQUFDO29CQUN6QyxLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzlELEtBQUssQ0FBQztZQUNkLENBQUM7WUFDRCxLQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7UUFDN0YsQ0FBQztRQUVELHFDQUFxQztRQUM5QiwrQkFBTyxHQUFkO1lBQ0ksSUFBSSxDQUFDLGFBQWEsRUFB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QWlCLEtBQXdCLEVBQUUsSUFBbUI7WUFDMUQsaUJBQU0sZ0JBQWdCLFlBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3hDLENBQUM7UUFDTCxtQkFBQztJQUFELENBQUMsQUE1Q0QsQ0FBa0MsYUFBUSxHQTRDekM7SUE1Q1ksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICAgIHRvVXJsLFxuICAgIGdldFRlbXBsYXRlLFxuICAgIEpTVCxcbiAgICBJUHJvbWlzZUJhc2UsXG4gICAgSGlkZUV2ZW50RGF0YSxcbiAgICBQYWdlVmlldyxcbiAgICBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnMsXG4gICAgUGFnZUNvbnRhaW5lclZpZXcsXG4gICAgUGFnZUNvbnRhaW5lclZpZXdPcHRpb25zLFxuICAgIFRoZW1lLFxuICAgIFRvYXN0LFxufSBmcm9tIFwiY2RwL3VpXCI7XG5cbmNvbnN0IFRBRyA9IFwiW3ZpZXcuZ2FsbGVyeS5CYXNlUGFnZVZpZXddIFwiO1xuXG4vKipcbiAqIEBjbGFzcyBUaGVtZVN3aXRjaGVyXG4gKiBAYnJpZWYg44OG44O844Oe5YiH44KK5pu/44GIIFZpZXdcbiAqL1xuY2xhc3MgVGhlbWVTd2l0Y2hlciBleHRlbmRzIFBhZ2VDb250YWluZXJWaWV3IHtcblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9uczogUGFnZUNvbnRhaW5lclZpZXdPcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgICAgICBzd2l0Y2ggKFRoZW1lLmdldEN1cnJlbnRVSVBsYXRmb3JtKCkpIHtcbiAgICAgICAgICAgIGNhc2UgXCJpb3NcIjpcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5maW5kKFwiI2dhbGxlcnktdGhlbWUtaW9zXCIpLnByb3AoXCJjaGVja2VkXCIsIHRydWUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImFuZHJvaWRcIjpcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5maW5kKFwiI2dhbGxlcnktdGhlbWUtYW5kcm9pZFwiKS5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgVG9hc3Quc2hvdyhUQUcgKyBcIlxcbiB1bmtub3duIHBsYXRmb3JtLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRlbC5maW5kKFwiI2dhbGxlcnktdGhlbWUtZGVmYXVsdFwiKS5wcm9wKFwiY2hlY2tlZFwiLCB0cnVlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiRlbC5maW5kKFwiaW5wdXRbbmFtZT0nc2VnbWVudGVkLWNvbnRyb2wtcGxhdGZvcm0tdGhlbWUnXVwiKS5jaGVja2JveHJhZGlvKFwicmVmcmVzaFwiKTtcbiAgICB9XG5cbiAgICAvLyEg56C05qOEICjlkIzkuIAgZWxlbWVudCDjgpLmibHjgo/jgarjgYTjgojjgYbjgavjgZnjgovjgZ/jgoHjga7lsILnlKjlh6bnkIYpXG4gICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgICAgIHRoaXMuc3RvcExpc3RlbmluZygpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKFwiI2dhbGxlcnktdGhlbWUtaW9zXCIpLmF0dHIoXCJpZFwiLCBudWxsKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZChcIiNnYWxsZXJ5LXRoZW1lLWFuZHJvaWRcIikuYXR0cihcImlkXCIsIG51bGwpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKFwiI2dhbGxlcnktdGhlbWUtZGVmYXVsdFwiKS5hdHRyKFwiaWRcIiwgbnVsbCk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoXCJsYWJlbFwiKS5hdHRyKFwiZm9yXCIsIG51bGwpO1xuICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcyhcInRoZW1lLXN3aXRjaGVyXCIpO1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gRXZlbnQgSGFuZGxlcjpcblxuICAgIC8vISBldmVudHMgYmluZGluZ1xuICAgIGV2ZW50cygpOiBhbnkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgXCJjaGFuZ2UgaW5wdXRbbmFtZT0nc2VnbWVudGVkLWNvbnRyb2wtcGxhdGZvcm0tdGhlbWUnXVwiOiB0aGlzLm9uVGhlbWVDaGFuZ2VkLFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vISDjg4bjg7zjg57liIfjgormm7/jgYhcbiAgICBwcml2YXRlIG9uVGhlbWVDaGFuZ2VkKGV2ZW50OiBKUXVlcnlFdmVudE9iamVjdCk6IHZvaWQge1xuICAgICAgICBsZXQgcGxhdGZvcm0gPSA8c3RyaW5nPnRoaXMuJGVsLmZpbmQoXCJpbnB1dFtuYW1lPSdzZWdtZW50ZWQtY29udHJvbC1wbGF0Zm9ybS10aGVtZSddOmNoZWNrZWRcIikudmFsKCk7XG4gICAgICAgIGlmIChcImRlZmF1bHRcIiA9PT0gcGxhdGZvcm0pIHtcbiAgICAgICAgICAgIHBsYXRmb3JtID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBUaGVtZS5zZXRDdXJyZW50VUlQbGF0Zm9ybShwbGF0Zm9ybSk7XG4gICAgfVxufVxuXG4vL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXG5cbi8qKlxuICogQGNsYXNzIEJhc2VQYWdlVmlld1xuICogQGJyaWVmIEdhbGxlcnkg5YWx6YCa44Gu55S76Z2i5Z+65bqV44Kv44Op44K5XG4gKi9cbmV4cG9ydCBjbGFzcyBCYXNlUGFnZVZpZXcgZXh0ZW5kcyBQYWdlVmlldyB7XG5cbiAgICBwcml2YXRlIF90aGVtZVN3aXRjaFRlbXBsYXRlOiBKU1Q7XG4gICAgcHJpdmF0ZSBfdGhlbWVTd2l0Y2hlcjogVGhlbWVTd2l0Y2hlcjtcblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIodXJsLCBpZCwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX3RoZW1lU3dpdGNoVGVtcGxhdGUgPSBnZXRUZW1wbGF0ZShcIiN0ZW1wbGF0ZS1nYWxsZXJ5LXRoZW1lLXN3aXRjaGVyXCIsIHRvVXJsKFwiL3RlbXBsYXRlcy9nYWxsZXJ5L3RoZW1lLXN3aXRjaGVyLmh0bWxcIikpO1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gT3ZlcnJpZGU6IFVJLlBhZ2VWaWV3XG5cbiAgICAvLyEgUm91dGVyIFwiYmVmb3JlIHJvdXRlIGNoYW5nZVwiIOODj+ODs+ODieODqVxuICAgIG9uQmVmb3JlUm91dGVDaGFuZ2UoKTogSVByb21pc2VCYXNlPGFueT4ge1xuICAgICAgICBpZiAodGhpcy5fdGhlbWVTd2l0Y2hlcikge1xuICAgICAgICAgICAgdGhpcy5fdGhlbWVTd2l0Y2hlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLl90aGVtZVN3aXRjaGVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIub25CZWZvcmVSb3V0ZUNoYW5nZSgpO1xuICAgIH1cblxuICAgIC8vISBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxuICAgIG9uUGFnZUJlZm9yZUNyZWF0ZShldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50KTtcbiAgICAgICAgJCh0aGlzLl90aGVtZVN3aXRjaFRlbXBsYXRlKCkpLnByZXBlbmRUbyh0aGlzLiRwYWdlLmZpbmQoXCJbZGF0YS1yb2xlPWNvbnRlbnRdXCIpKTtcbiAgICB9XG5cbiAgICAvLyEgalFNIGV2ZW50OiBcInBhZ2VjcmVhdGVcIiAo5penOlwicGFnZWluaXRcIikg44Gr5a++5b+cXG4gICAgb25QYWdlSW5pdChldmVudDogSlF1ZXJ5RXZlbnRPYmplY3QpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIub25QYWdlSW5pdChldmVudCk7XG4gICAgICAgIHRoaXMuX3RoZW1lU3dpdGNoZXIgPSBuZXcgVGhlbWVTd2l0Y2hlcih7XG4gICAgICAgICAgICBvd25lcjogdGhpcyxcbiAgICAgICAgICAgICRlbDogdGhpcy4kZWwuZmluZChcIi50aGVtZS1zd2l0Y2hlclwiKSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8hIGpRTSBldmVudDogXCJwYWdlYmVmb3JlaGlkZVwiIOOBq+WvvuW/nFxuICAgIG9uUGFnZUJlZm9yZUhpZGUoZXZlbnQ6IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhOiBIaWRlRXZlbnREYXRhKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUhpZGUoZXZlbnQsIGRhdGEpO1xuICAgIH1cbn1cbiJdfQ==