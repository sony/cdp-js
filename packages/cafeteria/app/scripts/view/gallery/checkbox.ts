import { registerPage } from "cdp/ui";
import { BasePageView } from "./base-pageview";

const TAG = "[view.gallery.CheckBoxPageView] ";

/**
 * @class CheckBoxPageView
 * @brief CheckBox サンプルの画面クラス
 */
class CheckBoxPageView extends BasePageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/gallery/checkbox.html", "gallery-checkbox", {
            route: "gallery-checkbox"
        });
    }
}

registerPage(CheckBoxPageView);
