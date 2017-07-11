import {
    registerPage,
    Toast,
    alert,
    confirm,
    prompt,
} from "cdp/ui";
import { BasePageView } from "./base-pageview";

const TAG = "[view.gallery.DialogPageView] ";

/**
 * @class DialogPageView
 * @brief Dialog サンプルの画面クラス
 */
class DialogPageView extends BasePageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/gallery/dialog.html", "gallery-dialog", {
            route: "gallery-dialog"
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    //! イベントハンドラのマッピング
    events(): any {
        return {
            "vclick .command-show-toast": this.onShowToast,
            "vclick .command-show-alert": this.onShowAlert,
            "vclick .command-show-confirm": this.onShowConfirm,
            "vclick .command-show-prompt": this.onShowPrompt,
        };
    }

    //! Toast 表示
    private onShowToast(event: JQuery.Event): void {
        Toast.show("Toast\nこんにちは。世界。");
    }

    //! Alert 表示
    private onShowAlert(event: JQuery.Event): void {
        event.preventDefault();

        alert("こんにちは。世界。", {
            title: "ALERT",
        })
            .on("popupafterclose", (ev: JQuery.Event) => {
                Toast.show("on OK.");
            });
    }

    //! Confirm 表示
    private onShowConfirm(event: JQuery.Event): void {
        event.preventDefault();
        confirm("今日はよい天気ですね?", {
            title: "CONFIRM",
        })
            .on("vclick", "#dlg-btn-positive", (ev: JQuery.Event) => {
                Toast.show("on OK.");
            })
            .on("vclick", "#dlg-btn-negative", (ev: JQuery.Event) => {
                Toast.show("on Cancel.");
            })
            ;
    }

    //! Prompt 表示
    private onShowPrompt(event: JQuery.Event): void {
        event.preventDefault();
        prompt("今日の天気は何ですか?", {
            title: "PROMPT",
        })
            .on("promptok", (ev: JQuery.Event, input: string) => {
                Toast.show("on OK. input:" + input);
            })
            .on("vclick", "#dlg-btn-negative", (ev: JQuery.Event) => {
                Toast.show("on Cancel.");
            })
            ;
    }
}

registerPage(DialogPageView);
