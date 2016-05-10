/// <amd-dependency path="tests/app/scripts/View/ListView/PageListViewNative" />
/// <amd-dependency path="tests/app/scripts/View/ListView/PageListViewIScroll" />
/// <amd-dependency path="tests/app/scripts/View/ListView/PageExpandListView" />

import * as Framework from "cdp/framework";

const TAG: string = "[View/ListView/ListViewsRoot] ";

/**
 * @class ListViewsRoot
 * @brief ListView サンプル例のルート画面クラス
 *        モジュールの遅延ロードのタイミングに使用
 */
class ListViewsRoot extends Framework.Page {

    /**
     * constructor
     */
    constructor() {
        super("/templates/listviews/listview-root.html", "page-example-listview-root", { route: "listview-root" });
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Framework.Page

    //! 最初の OnPageInit() のときにのみコールされる
    public onInitialize(event: JQueryEventObject): void {
        super.onInitialize(event);
    }
}

let _viewExamplesRoot: Framework.IPage;
if (!_viewExamplesRoot) {
    _viewExamplesRoot = new ListViewsRoot();
}

export { _viewExamplesRoot as page };
