import { registerPage } from "cdp/ui";
import { BasePageView } from "./base-pageview";

const TAG = "[view.gallery.SwitchPageView] ";

/**
 * @class SwitchPageView
 * @brief Switch サンプルの画面クラス
 */
class SwitchPageView extends BasePageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/gallery/switch.html", "gallery-switch", {
            route: "gallery/switch"
        });
    }
}

registerPage(SwitchPageView);
