import { registerPage } from "cdp/ui";
import { BasePageView } from "./base-pageview";

const TAG = "[view.gallery.TextInputPageView] ";

/**
 * @class TextInputPageView
 * @brief TextInput サンプルの画面クラス
 */
class TextInputPageView extends BasePageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/gallery/text-input.html", "gallery-text-input", {
            route: "gallery/text-input"
        });
    }
}

registerPage(TextInputPageView);
