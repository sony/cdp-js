﻿import {
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
    private _prmsProgress: IPromise<void>;

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
     * イベントハンドラのマッピング
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
        this._prmsManager.add(SimpleGate.coolMethod(100, false, "cafeteria", { ok: true }))
            .then((result) => {
                this.outputMessage(result);
            })
            .catch((reason: IResult) => {
                if (reason.code !== CDP.NativeBridge.ERROR_CANCEL) {
                    Toast.show(TAG + reason.message);
                }
            });
    }

    private onCommandThreadMethod(event: JQuery.Event): void {
        this._prmsManager.add(SimpleGate.threadMethod(200, true, "cafeteria:thread", { ok: false }))
            .progress((arg1: any, arg2: any) => {
                if ("object" === typeof arg2) {
                    arg2 = JSON.stringify(arg2);
                }
                this.outputMessage(`[progress] ${arg1}, ${arg2}`);
            })
            .then((result) => {
                this.outputMessage(result);
            })
            .catch((reason: IResult) => {
                if (reason.code !== CDP.NativeBridge.ERROR_CANCEL) {
                    Toast.show(TAG + reason.message);
                }
            });
    }

    private onCommandProgressMethod(event: JQuery.Event): void {
        if (this._prmsProgress && "pending" === this._prmsProgress.state()) {
            this._prmsProgress.abort();
            this.refreshProgressButton();
            return;
        }

        this._prmsProgress = this._prmsManager.add(SimpleGate.progressMethod());
        this._prmsProgress
            .progress((prog: number) => {
                this.outputMessage(`[progress] ${prog}%`);
            })
            .then(() => {
                this.clearMessage();
                this.outputMessage("DONE: progressMethod()");
            })
            .fail((reason: IResult) => {
                if (reason.code === CDP.NativeBridge.ERROR_CANCEL) {
                    this.outputMessage("CANCELED: progressMethod()");
                } else {
                    Toast.show(TAG + reason.message);
                }
            })
            .always(() => {
                this.refreshProgressButton();
            });

        this.refreshProgressButton();
    }

    // 連携例: UUID の生成
    private async onCommandGenUUID(event: JQuery.Event): Promise<void> {
        event.preventDefault();
        const uuid = await this._prmsManager.add(Misc.generateUUID());
        alert(uuid, {
            title: $.t("nativebridge.misc.uuidDlgTitle"),
        });
    }

    // 連携例: UUID の生成
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

    ///////////////////////////////////////////////////////////////////////
    // private methods:

    private refreshProgressButton(): void {
        const $buttonProgress = this.$page.find("#nativebridge-button-progress");
        if (this._prmsProgress && "pending" === this._prmsProgress.state()) {
            $buttonProgress.removeClass("ui-emphasis");
            $buttonProgress.addClass("ui-alt-emphasis");
            $buttonProgress.text($.t("nativebridge.simpleGate.progressMethodAbort"));
        } else {
            $buttonProgress.removeClass("ui-alt-emphasis");
            $buttonProgress.addClass("ui-emphasis");
            $buttonProgress.text($.t("nativebridge.simpleGate.progressMethod"));
        }
    }

    private outputMessage(msg: string): void {
        const $console = $("#nativebridge-console");
        $console.append(`<p>${msg}</p>`);
        $console.scrollTop($console[0].scrollHeight);
    }

    private clearMessage(): void {
        const $console = $("#nativebridge-console");
        $console.find("p").remove();
    }
}

registerPage(RootPageView);
