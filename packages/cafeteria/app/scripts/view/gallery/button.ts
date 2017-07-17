import { registerPage } from "cdp/ui";
import { BasePageView } from "./base-pageview";

const TAG = "[view.gallery.ButtonPageView] ";

/**
 * @class ButtonPageView
 * @brief Button サンプルの画面クラス
 */
class ButtonPageView extends BasePageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/gallery/button.html", "gallery-button", {
            route: "gallery/button"
        });
    }
}

registerPage(ButtonPageView);
