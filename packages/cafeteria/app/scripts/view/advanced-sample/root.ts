import { Router, constructPages } from "cdp/framework";
import { PageView, registerPage } from "cdp/ui";

/**
 * @class AdvancedRoot
 * @brief 高度な機能のルート画面クラス
 *        モジュールの遅延ロードのタイミングに使用
 */
class AdvancedRoot extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/advanced-sample/advanced-root.html",
            "advanced-root",
            {
                route: "advanced"
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
            "vclick .command-load-navigate": this.onCommandLoadNavigate,
        };
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    private async onCommandLoadNavigate(event: JQuery.Event): Promise<void> {
        event.preventDefault();
        const url = $(event.target).data("navigate-to");
        const target: string = $(event.target).data("module");
        await import(target);
        constructPages();
        Router.navigate(url);
    }
}

registerPage(AdvancedRoot);
