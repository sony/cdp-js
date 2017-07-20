import {
    registerPage,
    PageView,
    ShowEventData,
    Theme,
} from "cdp/ui";

import Func from "../model/porting-function";

/**
 * @class PortingTestView
 * @brief Porting 確認用ビュークラス
 */
class PortingTestView extends PageView implements IPortingPageView {
    /**
     * constructor
     */
    constructor() {
        super("/porting/templates/porting-test.html",
            "porting-test",
            {
                route: "advanced/porting"
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageView

    onPageBeforeShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageBeforeShow(event, data);
        Theme.setCurrentUIPlatform("android");
    }

    onPageShow(event: JQuery.Event, data: ShowEventData): void {
        super.onPageShow(event, data);
        Func.sayHello();
    }
}

registerPage(PortingTestView);
