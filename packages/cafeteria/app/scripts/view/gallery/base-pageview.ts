import {
    toUrl,
    getTemplate,
    JST,
    IPromiseBase,
    HideEventData,
    PageView,
    PageViewConstructOptions,
    PageContainerView,
    PageContainerOptions,
    Theme,
    Toast,
} from "cdp/ui";

const TAG = "[view.gallery.BasePageView] ";

/**
 * @class ThemeSwitcher
 * @brief テーマ切り替え View
 */
class ThemeSwitcher extends PageContainerView {

    /**
     * constructor
     */
    constructor(options: PageContainerOptions) {
        super(options);
        switch (Theme.getCurrentUIPlatform()) {
            case "ios":
                this.$el.find("#gallery-theme-ios").prop("checked", true);
                break;
            case "android":
                this.$el.find("#gallery-theme-android").prop("checked", true);
                break;
            default:
                Toast.show(TAG + "\n unknown platform.");
                this.$el.find("#gallery-theme-default").prop("checked", true);
                break;
        }
        this.$el.find("input[name='segmented-control-platform-theme']").checkboxradio("refresh");
    }

    //! 破棄 (同一 element を扱わないようにするための専用処理)
    public destroy(): void {
        this.stopListening();
        this.$el.find("#gallery-theme-ios").attr("id", null);
        this.$el.find("#gallery-theme-android").attr("id", null);
        this.$el.find("#gallery-theme-default").attr("id", null);
        this.$el.find("label").attr("for", null);
        this.$el.removeClass("theme-switcher");
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler:

    //! events binding
    events(): any {
        return {
            "change input[name='segmented-control-platform-theme']": this.onThemeChanged,
        };
    }

    //! テーマ切り替え
    private onThemeChanged(event: JQueryEventObject): void {
        let platform = <string>this.$el.find("input[name='segmented-control-platform-theme']:checked").val();
        if ("default" === platform) {
            platform = null;
        }
        Theme.setCurrentUIPlatform(platform);
    }
}

//_____________________________________________________________________________________________//

/**
 * @class BasePageView
 * @brief Gallery 共通の画面基底クラス
 */
export class BasePageView extends PageView {

    private _themeSwitchTemplate: JST;
    private _themeSwitcher: ThemeSwitcher;

    /**
     * constructor
     */
    constructor(url: string, id: string, options?: PageViewConstructOptions) {
        super(url, id, options);
        this._themeSwitchTemplate = getTemplate("#template-gallery-theme-switcher", toUrl("/templates/gallery/theme-switcher.html"));
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: UI.PageView

    //! Router "before route change" ハンドラ
    onBeforeRouteChange(): IPromiseBase<any> {
        if (this._themeSwitcher) {
            this._themeSwitcher.destroy();
            this._themeSwitcher = null;
        }
        return super.onBeforeRouteChange();
    }

    //! jQM event: "pagebeforecreate" に対応
    onPageBeforeCreate(event: JQueryEventObject): void {
        super.onPageBeforeCreate(event);
        $(this._themeSwitchTemplate()).prependTo(this.$page.find("[data-role=content]"));
    }

    //! jQM event: "pagecreate" (旧:"pageinit") に対応
    onPageInit(event: JQueryEventObject): void {
        super.onPageInit(event);
        this._themeSwitcher = new ThemeSwitcher({
            owner: this,
            $el: this.$el.find(".theme-switcher"),
        });
    }

    //! jQM event: "pagebeforehide" に対応
    onPageBeforeHide(event: JQueryEventObject, data: HideEventData): void {
        super.onPageBeforeHide(event, data);
    }
}
