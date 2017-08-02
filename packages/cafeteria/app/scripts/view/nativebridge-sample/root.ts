import { global } from "cdp";
import {
    ErrorInfo,
    isCanceledError,
    toUrl,
} from "cdp/framework";
import {
    IPromise,
    PromiseManager,
    PageView,
    registerPage,
    alert,
    Toast,
} from "cdp/ui";
import {
    IStorage,
    IStorageOptions,
    IStorageSetItemOptions,
    IStorageGetItemOptions,
    IStorageRemoveItemOptions,
    STORAGE_KIND,
    StorageAccess,
} from "cdp.storage";
import * as SimpleGate from "../../bridge/simple-gate";
import * as Misc from "../../bridge/misc";
import { handleErrorInfo  } from "../../utils/error-defs";

const TAG = "[view.nativebridge-sample.RootPageView] ";
const DEVICE_STORAGE_KEY_BINARY = "Cafeteria/DEVICE_STORAGE/TEST_DATA_BIN";
const DEVICE_STORAGE_KEY_OBJECT = "Cafeteria/DEVICE_STORAGE/TEST_DATA_OBJ";
const SECURE_STORAGE_NAMESPACE  = "cafeteria";

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
            // local storage test
            "vclick .command-storage": this.onStorageTest,
            "vclick .command-clear-cache": this.onClearCache,
        };
    }

    private onCommandCoolMethod(event: JQuery.Event): void {
        this._prmsManager.add(SimpleGate.coolMethod(100, false, "cafeteria", { ok: true }))
            .then((result) => {
                this.outputMessage(result);
            })
            .catch((reason: ErrorInfo) => {
                if (!isCanceledError(reason)) {
                    handleErrorInfo(reason);
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
            .catch((reason: ErrorInfo) => {
                if (!isCanceledError(reason)) {
                    handleErrorInfo(reason);
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
            .fail((reason: ErrorInfo) => {
                if (isCanceledError(reason)) {
                    this.outputMessage("CANCELED: progressMethod()");
                } else {
                    handleErrorInfo(reason);
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
            .catch((reason: ErrorInfo) => {
                if (!(isCanceledError(reason))) {
                    handleErrorInfo(reason);
                }
            });
    }

    private onCommandChangeStatusBarDark(event: JQuery.Event): void {
        this._prmsManager.add(Misc.changeStatusBarColor(Misc.STATUSBAR_STYLE.DEFAULT))
            .then((result) => {
                Toast.show(result);
            })
            .catch((reason: ErrorInfo) => {
                if (!(isCanceledError(reason))) {
                    handleErrorInfo(reason);
                }
            });
    }

    // デバイスストレージのテスト
    private onStorageTest(event: JQueryEventObject): void {
        const dataType = <string>this.$page.find("input[name='nativebridge-radio-group-storage-data-type']:checked").val();
        const kind = <string>this.$page.find("input[name='nativebridge-radio-group-storage-kind']:checked").val();
        const root = <string>this.$page.find("input[name='nativebridge-radio-group-device-storage-root']:checked").val();
        const storage = StorageAccess.getStorage(kind);
        const action = $(event.currentTarget).data("action");

        switch (action) {
            case "set":
                this.deviceStorageSetItem(storage, dataType, root);
                break;
            case "get":
                this.deviceStorageGetItem(storage, dataType, root);
                break;
            case "remove":
                this.deviceStorageRemoveItem(storage, dataType, root);
                break;
            case "clear":
                this.deviceStorageClear(storage, root);
                break;
            default:
                break;
        }
    }

    // キャッシュの破棄
    /* eslint-disable no-fallthrough */
    private async onClearCache(event: JQueryEventObject): Promise<void> {
        const kinds = [
            STORAGE_KIND.DEVICE_STORAGE,
            STORAGE_KIND.SECURE_STORAGE,
            STORAGE_KIND.WEB_STORAGE,
        ];
        for (let i = 0, n = kinds.length; i < n; i++) {
            const storage = StorageAccess.getStorage(kinds[i]);
            await storage.clear(<IStorageOptions>{
                namespace: SECURE_STORAGE_NAMESPACE,
            });
        }
        this.refreshDeviceStorageOutput(null);
    }
    /* eslint-enable no-fallthrough */

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

    // デバイスストレージの root 取得
    private getDeviceStorageRoot(root: string): string {
        if (global.cordova && global.cordova.file) {
            return cordova.file[root];
        } else {
            return null;
        }
    }

    // デバイスストレージにデータ設定
    private deviceStorageSetItem(storage: IStorage, dataType: string, root: string): void {
        const url = ("json" === dataType)
            ? toUrl("/res/data/sample/image/recallplayback.json")
            : toUrl("/res/data/examples/contents/animal/koala.jpg");
        const key = ("json" === dataType) ? DEVICE_STORAGE_KEY_OBJECT : DEVICE_STORAGE_KEY_BINARY;

        $.ajax({
            url: url,
            type: "GET",
            dataType: dataType,
            processData: false,
        })
            .then((data: Blob | object) => {
                return this._prmsManager.add(storage.setItem(key, data, <IStorageSetItemOptions>{
                    root: this.getDeviceStorageRoot(root),
                    namespace: SECURE_STORAGE_NAMESPACE,
                }));
            })
            .done(() => {
                Toast.show("setItem(): " + dataType);
            })
            .fail((error) => {
                handleErrorInfo(error);
            });
    }

    // デバイスストレージからデータ取得
    private deviceStorageGetItem(storage: IStorage, dataType: string, root: string): void {
        const key = ("json" === dataType) ? DEVICE_STORAGE_KEY_OBJECT : DEVICE_STORAGE_KEY_BINARY;
        this._prmsManager.add(storage.getItem(key, <IStorageGetItemOptions>{
            root: this.getDeviceStorageRoot(root),
            dataInfo: {
                dataType: ("json" === dataType) ? "text" : "blob",
                mimeType: "image/png",
            },
            namespace: SECURE_STORAGE_NAMESPACE,
        }))
            .done((data: any) => {
                this.refreshDeviceStorageOutput(data);
                Toast.show("getItem(): " + dataType);
            })
            .fail((error) => {
                handleErrorInfo(error);
            });
    }

    // デバイスストレージのデータを破棄
    private deviceStorageRemoveItem(storage: IStorage, dataType: string, root: string): void {
        const key = ("json" === dataType) ? DEVICE_STORAGE_KEY_OBJECT : DEVICE_STORAGE_KEY_BINARY;
        this._prmsManager.add(storage.removeItem(key, <IStorageRemoveItemOptions>{
            root: this.getDeviceStorageRoot(root),
            namespace: SECURE_STORAGE_NAMESPACE,
        }))
            .done(() => {
                this.refreshDeviceStorageOutput(null);
                Toast.show("removeItem()");
            })
            .fail((error) => {
                handleErrorInfo(error);
            });
    }

    // デバイスストレージの初期化
    private deviceStorageClear(storage: IStorage, root: string): void {
        this._prmsManager.add(storage.clear(<IStorageOptions>{
            root: this.getDeviceStorageRoot(root),
            namespace: SECURE_STORAGE_NAMESPACE,
        }))
            .done(() => {
                this.refreshDeviceStorageOutput(null);
                Toast.show("clear()");
            })
            .fail((error) => {
                handleErrorInfo(error);
            });
    }

    // デバイスストレージデータの表示
    private refreshDeviceStorageOutput(data: Blob | object): void {
        const $output = this.$page.find(".nativebridge-storage-output-container");
        // 破棄
        $output
            .children()
            .css("background-image", "none")
            .text("");

        if (data instanceof Blob || data instanceof File) {
            let $binary = $output.find(".nativebridge-storage-binary");
            const reader = new FileReader();
            reader.onload = () => {
                $binary.css("background-image", `url('${reader.result}')`);
                $binary = null;
            };
            reader.readAsDataURL(data);
        } else if (data instanceof Object) {
            const $object = $output.find(".nativebridge-storage-object");
            $object.text(JSON.stringify(data, null, 4));
        }
    }
}

registerPage(RootPageView);
