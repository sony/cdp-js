/// <amd-dependency path="tests/app/scripts/View/Options" />
/// <amd-dependency path="tests/app/scripts/View/ListView/ListViewsRoot" />

import * as Framework from "cdp/framework";

const TAG: string = "[View/Root] ";

/**
 * @class Root
 * @brief サンプル例のルート画面クラス
 *        モジュールの遅延ロードのタイミングに使用
 */
class Root extends Framework.Page {

    /**
     * constructor
     */
    constructor() {
        super("/templates/main.html", "page-example-root", { route: "main(/:query)" });
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Framework.Page

    //! jQM event: "pagecreate" (旧:"pageinit") に対応
    onPageInit(event: JQueryEventObject): void {
        super.onPageInit(event);
        this.$page.find(".navigate").on("vclick", (event: JQueryEventObject): void => {
            this.onNavigate(event);
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    private onNavigate(event: JQueryEventObject): void {
        event.preventDefault();
    }
}

let _viewExamplesRoot: Framework.IPage;
if (!_viewExamplesRoot) {
    _viewExamplesRoot = new Root();
}

export { _viewExamplesRoot as page };
