import { Model, ModelSetOptions } from "cdp/framework";
import { Toast } from "cdp/ui";

const TAG = "[model.Options] ";

/**
 * @class OptionsSetOptions
 * @brief 開発用オプションオブジェクト用内部オプション
 */
interface OptionsSetOptions extends ModelSetOptions {
    noSave?: boolean;   // 永続化不要の場合 true
}

/**
 * @class Options
 * @brief 開発用オプションモデル
 */
export class Options extends Model {

    static s_instance: Options = null;

    //! constructor
    private constructor() {
        super();
        this.init();
    }

    ///////////////////////////////////////////////////////////////////////
    // public method: DeviceConsole

    // check device console visible
    public isVisibleDeviceConsole(): boolean {
        // TODO:
        return false;
        //if (!this.isEnableDeviceConsole()) {
        //    return false;
        //}
        //return CDP.UI.DeviceConsole.visible();
    }

    public showDeviceConsole(): void {
        // TODO:
        //if (this.isEnableDeviceConsole()) {
        //    CDP.UI.DeviceConsole.show();
        //}
    }

    public hideDeviceConsole(): void {
        // TODO:
        //if (this.isEnableDeviceConsole()) {
        //    CDP.UI.DeviceConsole.hide();
        //}
    }

    ///////////////////////////////////////////////////////////////////////
    // public static method

    // get singleton instance
    public static getInstance(): Options {
        if (!Options.s_instance) {
            Options.s_instance = new Options();
        }
        return Options.s_instance;
    }

    // 値のリセット
    public static reset(): void {
        localStorage.clear();
        if (Options.s_instance) {
            Options.s_instance.init(true);
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // private method

    // ローカルストレージからデータ取得
    private getStorageData(key: string): any {
        const value = localStorage.getItem(key);
        if (value) {
            return JSON.parse(value);
        } else {
            return null;
        }
    }

    // ローカルストレージからデータ取得
    private setStorageData(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    //! 初期化
    private init(update?: boolean): void {
        const keys = [
            "transition",
            "transitionLogger",
        ];

        const initValue = (key: string) => {
            const value = this.getStorageData(key);
            if (null != value) {
                super.set(key, value);
            } else if (update && null != this.defaults()[key]) {
                super.set(key, this.defaults()[key]);
            }
        };

        for (let i = 0, n = keys.length; i < n; i++) {
            initValue(keys[i]);
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Framework.Model

    set(attributeName: string, value: any, options?: ModelSetOptions): Model {
        options = options || {};
        if ("string" === typeof attributeName && !(<OptionsSetOptions>options).noSave) {
            this.setStorageData(attributeName, value);
        }
        return super.set(attributeName, value, options);
    }

    /**
     * default 属性
     */
    defaults(): any {
        return {
            transition: "platform-default",
            lastChangePageTime: null,
            transitionLogger: false,
        };
    }
}

//___________________________________________________________________________________________________________________//

// jquey.mobile.changePage() の Hook.
const jqmChangePage: (to: any, options?: ChangePageOptions) => void = $.mobile.changePage.bind($.mobile);

function customChangePage(to: any, options?: ChangePageOptions): void {
    if ("string" === typeof to) {
        Options.getInstance().set("lastChangePageTime", new Date, <OptionsSetOptions>{ noSave: true });
    }
    jqmChangePage(to, options);
}

$.mobile.changePage = customChangePage;
$(document).on("pageshow", (event: JQuery.Event) => {
    if (Options.getInstance().get("transitionLogger")) {
        const start = Options.getInstance().get("lastChangePageTime");
        const now = new Date();
        const msec = now.getTime() - start.getTime();
        Toast.show("Switching Time : " + msec + " [msec]");
    }
});

