import { registerPage } from "cdp/ui";
import { BasePageView } from "./base-pageview";

const TAG = "[view.gallery.SpinnerPageView] ";

/**
 * @class SpinnerPageView
 * @brief Spinner サンプルの画面クラス
 */
class SpinnerPageView extends BasePageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/gallery/spinner.html", "gallery-spinner", {
            route: "gallery/spinner"
        });
    }
}

registerPage(SpinnerPageView);
