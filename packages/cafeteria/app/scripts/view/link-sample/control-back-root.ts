import { Router } from "cdp/framework";
import {
    PageView,
    registerPage,
} from "cdp/ui";

const TAG = "[view.link-sample.ControlBackViewRoot] ";

/**
 * @class ControlBackViewRoot
 * @brief [戻る]制御のための View Root クラス
 */
class ControlBackViewRoot extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/link-sample/link-back-root.html",
            "link-back-root",
            {
                route: "link-back-root"
            }
        );

        // link-back-hash 用 route の登録
        Router.register("link-back-hash1", "/templates/link-sample/link-back-hash1.html");
        Router.register("link-back-hash2", "/templates/link-sample/link-back-hash2.html");
        Router.register("link-back-hash3", "/templates/link-sample/link-back-hash3.html");
        Router.register("link-back-script3", "/templates/link-sample/link-back-script3.html");
        Router.register("link-back-script-c", "/templates/link-sample/link-back-script-c.html");
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    /**
     * イベントハンドラのマッピング。
     * CSS セレクタにマッチした要素にイベントハンドラを自動でセットされる。
     */
    events(): any {
        return {
            "vclick .btn-change-page": this.onButtonChangePageWithBackDestination,
            "vclick .btn-sub-flow": this.onButtonChangePage,
        };
    }

    //! 描画
    render(): PageView {
        return this;
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    private onButtonChangePageWithBackDestination(event: JQuery.Event): void {
        console.log(TAG + "onButtonChangePage()");
        const url = $(event.currentTarget).data("url");
        event.preventDefault();
        Router.navigate(url, "platform-default", false, { backDestination: "#link-back-root" });
    }

    private onButtonChangePage(event: JQuery.Event): void {
        console.log(TAG + "onButtonChangePage()");
        const url = $(event.currentTarget).data("url");
        event.preventDefault();
        Router.navigate(url, "platform-default", false);
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageView

    onPageInit(event: JQuery.Event): void {
        console.log(TAG + "onPageInit()");
    }

    onPageRemove(event: JQuery.Event): void {
        console.log(TAG + "onPageRemove()");
    }
}

registerPage(ControlBackViewRoot);
