import {
    IPromise,
    PromiseManager,
    PageView,
    registerPage,
    alert,
    Toast,
} from "cdp/ui";
import { IResult } from "cdp/bridge";
import * as SimpleGate from "../../bridge/simple-gate";
import * as Misc from "../../bridge/misc";

const TAG = "[view.nativebridge-sample.RootPageView] ";

/**
 * @class RootPageView
 * @brief NativeBridge サンプル例のルート画面クラス
 */
class RootPageView extends PageView {

    private _prmsManager: PromiseManager;

    /**
     * constructor
     */
    constructor() {
        super("/templates/nativebridge-sample/nativebridge-root.html", "nativebridge-root", {
            route: "bridge"
        });
        this._prmsManager = new PromiseManager();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    /**
     * イベントハンドラのマッピング。
     * CSS セレクタにマッチした要素にイベントハンドラを自動でセットされる。
     */
    events(): any {
        return {
            "vclick .command-cool-method": this.onCommandCoolMethod,
            "vclick .command-thread-method": this.onCommandThreadMethod,
            "vclick .command-progress-method": this.onCommandProgressMethod,
            "vclick .command-gen-uuid": this.onCommandGenUUID,
            "vclick .command-change-statusbar-light": this.onCommandChangeStatusBarLight,
            "vclick .command-change-statusbar-dark": this.onCommandChangeStatusBarDark,
        };
    }

    private onCommandCoolMethod(event: JQuery.Event): void {
        Toast.show(TAG + "onCommandCoolMethod");
    }

    private onCommandThreadMethod(event: JQuery.Event): void {
        Toast.show(TAG + "onCommandThreadMethod");
    }

    private onCommandProgressMethod(event: JQuery.Event): void {
        Toast.show(TAG + "onCommandProgressMethod");
    }

    private async onCommandGenUUID(event: JQuery.Event): Promise<void> {
        event.preventDefault();
        const uuid = await this._prmsManager.add(Misc.generateUUID());
        alert(uuid, {
            title: $.t("nativebridge.misc.uuidDlgTitle"),
        });
    }

    private onCommandChangeStatusBarLight(event: JQuery.Event): void {
        this._prmsManager.add(Misc.changeStatusBarColor(Misc.STATUSBAR_STYLE.LIGHT_CONTENT))
            .then((result) => {
                Toast.show(result);
            })
            .catch((reason: IResult) => {
                if (reason.code !== CDP.NativeBridge.ERROR_CANCEL) {
                    Toast.show(TAG + reason.message);
                }
            });
    }

    private onCommandChangeStatusBarDark(event: JQuery.Event): void {
        this._prmsManager.add(Misc.changeStatusBarColor(Misc.STATUSBAR_STYLE.DEFAULT))
            .then((result) => {
                Toast.show(result);
            })
            .catch((reason: IResult) => {
                if (reason.code !== CDP.NativeBridge.ERROR_CANCEL) {
                    Toast.show(TAG + reason.message);
                }
            });
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageView

    onPageRemove(event: JQuery.Event): void {
        this._prmsManager.cancel();
        super.onPageRemove(event);
    }
}

registerPage(RootPageView);
