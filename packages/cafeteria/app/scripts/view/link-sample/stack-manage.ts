import { Router } from "cdp/framework";
import {
    PageView,
    Toast,
    registerPage,
} from "cdp/ui";

const TAG = "[view.link-sample.StackManageView] ";

/**
 * @class StackManageView
 * @brief ページスタック管理の確認クラス
 */
class StackManageView extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/link-sample/link-stack-manage.html",
            "link-stack-manage",
            {
                route: "link-stack-manage(/:query)"
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
            "vclick .btn-stack-manage": this.onButtonStartStackManage,
        };
    }

    //! 描画
    render(): PageView {
        return this;
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    private onButtonStartStackManage(event: JQuery.Event): void {
        Toast.show("onButtonStartStackManage");
        const test = [
            { route: "#view/backbone",      transition: "slide", },
            { route: "#view/page",          transition: "slide", },
            { route: "#view/page-owner",    transition: "slide", },
            { route: "#view/page-view",     transition: "slide", },
            { route: "",                    transition: "slide", },
        ];
        Router.registerPageStack(test, true);
    }
}

registerPage(StackManageView);
