import { BasePageView } from "./base-pageview";
import { registerPage } from "cdp/ui";

const TAG = "[view.gallery.ListControlPageView] ";

/**
 * @class ListControlPageView
 * @brief ListControl サンプルの画面クラス
 */
class ListControlPageView extends BasePageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/gallery/listctrl.html", "gallery-listctrl", {
            route: "gallery-listctrl"
        });
    }
}

registerPage(ListControlPageView);
