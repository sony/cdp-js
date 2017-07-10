import { Router } from "cdp/framework";
import {
//    Promise,  // async - await を使用する場合、top level に Promise を再配置することは不可
    PageView,
    IPromiseBase,
    registerPage,
} from "cdp/ui";

const TAG = "[view.MainView] ";

/**
 * @class MainView
 * @brief メインビュークラス
 *        サンプル例のルート画面
 *        モジュールの遅延ロードのタイミングに使用
 */
export class MainView extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/main.html", "page-main", {
            route: "main(/:query)"
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    //! イベントハンドラのマッピング
    events(): any {
        return {
            "vclick .command-navigate": this.onNavigate,
        };
    }

    //! ".command-navigate" のイベントハンドラ
    private async onNavigate(event: JQuery.Event): Promise<void> {
        let url = $(event.currentTarget).data("command");
        let transition = $(event.currentTarget).data("transition") || "platform-default";
        event.preventDefault();

        await this.loadSubModule();
        Router.navigate(url, transition);
    }
/*
    //! ".command-navigate" のイベントハンドラ
    private onNavigate(event: JQuery.Event): Promise<void> {
        let url = $(event.currentTarget).data("command");
        let transition = $(event.currentTarget).data("transition") || "platform-default";
        event.preventDefault();
        return this.loadSubModule()
            .then(() => {
                Router.navigate(url, transition);
            })
    }
*/
    ///////////////////////////////////////////////////////////////////////
    // 内部関数

    private loadSubModule(): Promise<void> {
        // async - await を使用する場合、top level に Promise を再配置することは不可
        // CDP.Promise ならアクセス可.
//        return new CDP.Promise<void>((resolve, reject) => {
        return new Promise<void>((resolve, reject) => {
            if (this.isLoadedSubModule()) {
                resolve();
            } else {
                // TODO:
                reject();
                //require(["modernizr", "app.extends"], () => {
                //    let $css: JQuery = $("<link rel='stylesheet'/>");
                //    $css.attr("href", CDP.Framework.toUrl("/lib/stylesheets/app.extends.css") + "?bust=" + Date.now());
                //    $css.appendTo(document.head);
                //    df.resolve();
                //});
            }
        });
    }

    private isLoadedSubModule(): boolean {
        // TODO:
        return true;
        //let $css = $("link[rel='stylesheet']")
        //    .filter((index: number, elem: HTMLElement) => {
        //        return $(elem).attr("href").match(/app.extends.css/ig) ? true : false;
        //    });
        //return (0 < $css.length);
    }
}

registerPage(MainView);
