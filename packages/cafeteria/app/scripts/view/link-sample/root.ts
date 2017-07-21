import { Router } from "cdp/framework";
import { PageView, registerPage } from "cdp/ui";
import "./control-back-root";
import "./control-back-1";
import "./control-back-2";
import "./advanced-control-back-a";
import "./advanced-control-back-b";
import "./stack-manage";

const TAG = "[view.link-sample.RootPageView] ";

/**
 * @class RootPageView
 * @brief Links サンプル例のルート画面クラス
 */
class RootPageView extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/link-sample/link-root.html", "link-root", {
            route: "links"
        });
        // link-hash 用 route の登録
        Router.register("link-hash", "/templates/link-sample/link-hash.html");
    }
}

registerPage(RootPageView);
