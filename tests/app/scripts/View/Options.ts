import { Page } from "cdp/framework";
import { Settings } from "tests/app/scripts/Model/Settings";

const TAG: string = "[View/Options] ";

/**
 * @class Options
 * @brief オプション画面クラス
 */
class Options extends Page {

    /**
     * constructor
     */
    constructor() {
        super("/templates/options.html", "page-options", { route: "options" });
    }

    ///////////////////////////////////////////////////////////////////////
    // override

    onInitialize(event: JQueryEventObject): void {
        console.log(TAG + "onInitialize()");
        console.log(TAG + "Default click event: " + CDP.Framework.getDefaultClickEvent());
    }

    onPageInit(event: JQueryEventObject): void {
        console.log(TAG + "onPageInit()");
        let settings = Settings.getInstance();


        let $transition = $("#option-select-transition");
        $transition.val(settings.get("transition"));
        $transition.selectmenu("refresh");
        this.$page.on("change", "#option-select-transition", (event: JQueryEventObject) => {
            settings.set("transition", $transition.val());
        });


        let $flipLogger = $("#flip-transition-logger");
        $flipLogger.val(settings.get("showLog") ? "on" : "off");
        if (!settings.isEnablePerformaceLog()) {
            $flipLogger.slider("disable");
        }
        $flipLogger.slider("refresh");
        this.$page.on("change", "#flip-transition-logger", (event: JQueryEventObject) => {
            settings.set("showLog", ($flipLogger.val() === "on") ? true : false);
        });


        let $flipConsole = $("#flip-device-console");
        $flipConsole.val(settings.isVisibleDeviceConsole() ? "on" : "off");
        if (!settings.isEnableDeviceConsole()) {
            $flipConsole.slider("disable");
        }
        $flipConsole.slider("refresh");
        this.$page.on("change", "#flip-device-console", (e: JQueryEventObject, ui: any) => {
            if ($flipConsole.val() === "on") {
                settings.showDeviceConsole();
            } else {
                settings.hideDeviceConsole();
            }
        });
    }
}

let _viewOptions: Page = new Options();
