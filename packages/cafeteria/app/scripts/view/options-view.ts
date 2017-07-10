import {
    PageView,
    ShowEventData,
    HideEventData,
    Toast,
    registerPage,
} from "cdp/ui";

import { Options } from "../model/options";

import CheckModel from "../model/sample-model";

const TAG = "[view.MainView] ";

/**
 * @class OptionsView
 * @brief メインビュークラス
 */
export class OptionsView extends PageView {

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
        options.set("showLog", ($(event.target).val() === "on") ? true : false);
    }

    private onDeviceConsoleChanged(event: JQuery.Event): void {
        const options = Options.getInstance();
        if ($(event.target).val() === "on") {
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
        $flipLogger.val(options.get("showLog") ? "on" : "off");
        $flipLogger.flipswitch("refresh");

        const $flipConsole = $("#flip-device-console");
        $flipConsole.val(options.isVisibleDeviceConsole() ? "on" : "off");
        $flipConsole.flipswitch("refresh");
    }
}

registerPage(OptionsView);
