const TAG: string = "[Model/Settings] ";

// global にあるものは "=" でもいけるように見えるが、
// amd: dependency を用いなければ concat されたリリースビルドでは保証ができないので注意
 import Backbone = require("backbone");

/**
 * @class Settings
 * @brief Application Common Setting model object
 */
export class Settings extends Backbone.Model {
    static s_instance: Settings = null;

    defaults(): any {
        return {
            transition: "slide",
            lastChangePageTime: null,
            showLog: false,
        };
    }

    /**
     *  constructor
     *
     * @param data [in] object
     */
    constructor(attributes?: any) {
        super(attributes, null);
    }

    //! get singleton instance
    static getInstance(): Settings {
        if (!Settings.s_instance) {
            Settings.s_instance = new Settings;
        }
        return Settings.s_instance;
    }

    // Performance Log
    isEnablePerformaceLog(): boolean {
        return (null != (<any>CDP).UI);
    }

    // Device Console

    isEnableDeviceConsole(): boolean {
        return false;
//        return (null != (<any>CDP).Tools);
    }

    isVisibleDeviceConsole(): boolean {
        if (!this.isEnableDeviceConsole()) {
            return false;
        }
        return (<any>CDP).UI.DeviceConsole.visible();
    }

    showDeviceConsole(): void {
        if (this.isEnableDeviceConsole()) {
            (<any>CDP).UI.DeviceConsole.show();
        }
    }

    hideDeviceConsole(): void {
        if (this.isEnableDeviceConsole()) {
            (<any>CDP).UI.DeviceConsole.hide();
        }
    }
}

// jquey.mobile.changePage() の Hook.
let jqmChangePage: (to: any, options?: ChangePageOptions) => void = $.mobile.changePage.bind($.mobile);

function customChangePage(to: any, options?: ChangePageOptions): void {
    if (_.isString(to)) {
        Settings.getInstance().set("lastChangePageTime", new Date);
        if (options && options.transition && "example-selected" === options.transition) {
            options.transition = Settings.getInstance().get("transition");
        }
    }
    jqmChangePage(to, options);
}

$.mobile.changePage = customChangePage;
$(document).on("pageshow", (event: JQueryEventObject) => {
    if (Settings.getInstance().get("showLog")) {
        let start = Settings.getInstance().get("lastChangePageTime");
        let now = new Date();
        let msec = now.getTime() - start.getTime();
        if (Settings.getInstance().isEnablePerformaceLog()) {
            (<any>CDP).UI.Toast.show("Switching Time : " + msec + " [msec]");
        }
    }
});
