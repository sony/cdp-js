import { Router } from "cdp/framework";
import {
    PageView,
    registerPage,
} from "cdp/ui";

const TAG = "[view.link-sample.ControlBackView1] ";

/**
 * @class ControlBackView1
 * @brief [戻る]制御のための View クラス1
 */
class ControlBackView1 extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/link-sample/link-back-script1.html",
            "link-back-script1",
            {
                route: "link-back-script1"
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    /**
     * イベントハンドラのマッピング。
     * CSS セレクタにマッチした要素にイベントハンドラを自動でセットされる。
     */
    events(): any {
        return {
            "vclick .btn-change-page": this.onButtonChangePage,
        };
    }

    //! 描画
    render(): PageView {
        return this;
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    private onButtonChangePage(): void {
        console.log(TAG + "onButtonChangePage()");
        Router.navigate("#link-back-script2", "platform-default", false, { backDestination: "#link-back-root" });
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

registerPage(ControlBackView1);
