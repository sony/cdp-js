import {
    PageView,
    registerPage,
    ShowEventData,
    ScrollerElement,
} from "cdp/ui";
import SimpleListView from "./simple-listview";

const TAG = "[view.listviews-sample.ListViewElementPage] ";

/**
 * @class ListViewElementPage
 * @brief SimpleListView のオーナー Page クラス
 */
class ListViewElementPage extends PageView {

    private _listViewElement: SimpleListView = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/listviews-sample/listview-element.html",
            "listview-element",
            {
                route: "listviews/listview/element"
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Page

    // $el の高さが決まってから処理する必要があるため、onPageShow() をハンドリング
    onPageShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageShow(event, data);
        this._listViewElement = new SimpleListView({
            el: this.$page.find("#sample-listview-element"),
            scrollerFactory: ScrollerElement.getFactory(),
//          itemTagName: "li",    // display: block の指定も必要
        });
    }

    onPageRemove(event: JQuery.Event): void {
        if (this._listViewElement) {
            this._listViewElement.remove();
            this._listViewElement = null;
        }
        super.onPageRemove(event);
    }
}

registerPage(ListViewElementPage);
