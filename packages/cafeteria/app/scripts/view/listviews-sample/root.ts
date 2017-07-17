import { PageView, registerPage } from "cdp/ui";
import "./expand-listview-page";
import "./listview-compare-page";
import "./listview-element-page";
import "./listview-iscroll-page";
import "./sort-listview-page";
import "./page-expand-listview";
import "./page-listview-iscroll";
import "./page-listview-native";

const TAG = "[view.listviews-sample.RootPageView] ";

/**
 * @class ListViewsRoot
 * @brief ListView サンプル例のルート画面クラス
 */
class RootPageView extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/listviews-sample/listview-root.html",
            "listview-root",
            {
                route: "listviews"
            }
        );
    }
}

registerPage(RootPageView);
