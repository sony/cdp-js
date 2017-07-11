import { registerPage } from "cdp/ui";
import { BasePageView } from "./base-pageview";
import "./button";
import "./checkbox";
import "./radio";
import "./spinner";
import "./switch";
import "./text-input";
import "./slider";
import "./dialog";
import "./list-control";

const TAG = "[view.gallery.RootPageView] ";

/**
 * @class RootPageView
 * @brief Gallery サンプル例のルート画面クラス
 */
class RootPageView extends BasePageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/gallery/root.html", "gallery-root", {
            route: "gallery"
        });
    }
}

registerPage(RootPageView);
