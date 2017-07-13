import { Router } from "cdp/framework";
import {
    PageView,
    registerPage,
} from "cdp/ui";

const TAG = "[view.link-sample.ControlBackView2] ";

/**
 * @class ControlBackView2
 * @brief [戻る]制御のための View クラス2
 */
class ControlBackView2 extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/link-sample/link-back-script2.html",
            "link-back-script2",
            {
                route: "link-back-script2(/:query)"
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
            "vclick .command-change-page": this.onCommandChangePage,
        };
    }

    //! 描画
    render(): PageView {
        return this;
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    private onCommandChangePage(): void {
        console.log(TAG + "onCommandChangePage()");
        Router.navigate("#link-back-script3", "platform-default", false, { backDestination: "#link-back-script2" });
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

registerPage(ControlBackView2);
