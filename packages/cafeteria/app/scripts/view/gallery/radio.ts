import { registerPage } from "cdp/ui";
import { BasePageView } from "./base-pageview";

const TAG = "[view.gallery.RadioButtonPageView] ";

/**
 * @class RadioButtonPageView
 * @brief RadioButton サンプルの画面クラス
 */
class RadioButtonPageView extends BasePageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/gallery/radio-button.html", "gallery-radio-button", {
            route: "gallery/radio-button"
        });
    }
}

registerPage(RadioButtonPageView);
