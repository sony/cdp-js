import { PageView, registerPage } from "cdp/ui";
import "./backbone";
import "./page-owner";
import "./page-view";
import "./page";

const TAG = "[view.views-sample.RootPageView] ";

/**
 * @class RootPageView
 * @brief Views サンプル例のルート画面クラス
 */
class RootPageView extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/views-sample/view-root.html", "view-root", {
            route: "views"
        });
    }
}

registerPage(RootPageView);
