import {
    PageView,
    PageContainerView,
    PageContainerOptions,
    Theme,
    Toast,
    registerPage,
} from "cdp/ui";

import { Options } from "../model/options";

const TAG = "[view.MainView] ";

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

//___________________________________________________________________________________________________________________//

/**
 * @class OptionsView
 * @brief メインビュークラス
 */
export class OptionsView extends PageView {

    private _themeSwitcher: ThemeSwitcher;

    /**
     * constructor
     */
    constructor() {
        super("/templates/options.html", "page-options", {
            route: "options"
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    //! イベントハンドラのマッピング
    events(): any {
        return {
            "change #option-select-transition": this.onTransitionChanged,
            "change #flip-transition-logger": this.onPerformanceLoggerChanged,
            "change #flip-device-console": this.onDeviceConsoleChanged,
        };
    }

    private onTransitionChanged(event: JQuery.Event): void {
        const options = Options.getInstance();
        options.set("transition", $(event.target).val());
    }

    private onPerformanceLoggerChanged(event: JQuery.Event): void {
        const options = Options.getInstance();
        options.set("transitionLogger", $(event.target).prop("checked") ? true : false);
    }

    private onDeviceConsoleChanged(event: JQuery.Event): void {
        const options = Options.getInstance();
        if ($(event.target).prop("checked")) {
            options.showDeviceConsole();
        } else {
            options.hideDeviceConsole();
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: UI.PageView

    /**
     * jQM event: "pagecreate" (旧:"pageinit") に対応
     *
     * @param event [in] イベントオブジェクト
     */
    onPageInit(event: JQuery.Event): void {
        super.onPageInit(event);
        console.log(TAG + "onPageInit()");

        const options = Options.getInstance();

        const $transition = $("#option-select-transition");
        $transition.val(options.get("transition"));
        $transition.selectmenu("refresh");

        const $flipLogger = $("#flip-transition-logger");
        $flipLogger.prop("checked", options.get("transitionLogger") ? true : false);
        $flipLogger.flipswitch("refresh");

        const $flipConsole = $("#flip-device-console");
        $flipConsole.prop("checked", options.isVisibleDeviceConsole() ? true : false);
        $flipConsole.flipswitch("refresh");

        this._themeSwitcher = new ThemeSwitcher({
            owner: this,
            $el: this.$el.find(".theme-switcher"),
        });
    }

    /**
     * jQM event: "pageremove" に対応
     *
     * @param event {JQuery.Event} [in] イベントオブジェクト
     */
    onPageRemove(event: JQuery.Event): void {
        if (this._themeSwitcher) {
            this._themeSwitcher.remove();
            this._themeSwitcher = null;
        }
        super.onPageRemove(event);
    }

}

registerPage(OptionsView);
