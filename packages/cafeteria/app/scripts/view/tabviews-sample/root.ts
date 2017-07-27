import { PageView, registerPage } from "cdp/ui";
import "./swipe-tabview-page";

const TAG = "[view.tabviews-sample.RootPageView] ";

/**
 * @class RootPageView
 * @brief TabView サンプル例のルート画面クラス
 */
class RootPageView extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/tabviews-sample/tabview-root.html",
            "tabview-root",
            {
                route: "tabviews"
            }
        );
    }
}

registerPage(RootPageView);
