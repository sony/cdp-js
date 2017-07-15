import {
    PageView,
    registerPage,
} from "cdp/ui";

const TAG = "[view.MainView] ";

/**
 * @class MainView
 * @brief メインビュークラス
 *        サンプル例のルート画面
 *        モジュールの遅延ロードのタイミングに使用
 */
export class MainView extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/main.html", "page-main", {
            route: "main(/:query)"
        });
    }
}

registerPage(MainView);
