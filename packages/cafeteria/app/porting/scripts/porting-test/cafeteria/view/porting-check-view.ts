import {
    registerPage,
    PageView,
    ShowEventData,
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

    onPageShow(event: JQuery.Event, data: ShowEventData): void {
        super.onPageShow(event, data);
        Func.sayHello();
    }
}

registerPage(PortingTestView);
