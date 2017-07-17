import { registerPage } from "cdp/ui";
import { BasePageView } from "./base-pageview";

const TAG = "[view.gallery.SliderPageView] ";

/**
 * @class SliderPageView
 * @brief Slider サンプルの画面クラス
 */
class SliderPageView extends BasePageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/gallery/slider.html", "gallery-slider", {
            route: "gallery/slider"
        });
    }
}

registerPage(SliderPageView);
