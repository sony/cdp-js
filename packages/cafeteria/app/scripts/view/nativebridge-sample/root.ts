import {
    PageView,
    registerPage,
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

    /**
     * constructor
     */
    constructor() {
        super("/templates/nativebridge-sample/nativebridge-root.html", "nativebridge-root", {
            route: "bridge"
        });
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

    private onCommandGenUUID(event: JQuery.Event): void {
        Toast.show(TAG + "onCommandGenUUID");
    }

    private onCommandChangeStatusBarLight(event: JQuery.Event): void {
        Toast.show(TAG + "onCommandChangeStatusBarLight");
    }

    private onCommandChangeStatusBarDark(event: JQuery.Event): void {
        Toast.show(TAG + "onCommandChangeStatusBarDark");
    }
}

registerPage(RootPageView);
