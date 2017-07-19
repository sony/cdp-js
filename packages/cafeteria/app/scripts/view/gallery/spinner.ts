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

    ///////////////////////////////////////////////////////////////////////
    // Event Handler:

    // events binding
    events(): any {
        return {
            "change input[name='segmented-control-platform-theme']": this.onThemeChanged,
        };
    }

    // スピナーの更新
    private onThemeChanged(event: JQuery.Event): void {
        this.$page
            .find(".ui-spinner")
            .each((index: number, elem: Element) => {
                $(elem).spinner("refresh");
            });
    }
}

registerPage(SpinnerPageView);
