import {
    PageView,
    registerPage,
    ShowEventData,
    ScrollerElement,
    ScrollerIScroll,
} from "cdp/ui";
import SimpleListView from "./simple-listview";

const TAG = "[view.listviews-sample.ListViewComparePage] ";

/**
 * @class ListViewComparePage
 * @brief SimpleListView のオーナー Page クラス
 */
class ListViewComparePage extends PageView {

    private _listViewElement: SimpleListView = null;
    private _listViewIScroll: SimpleListView = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/listviews-sample/listview-compare.html",
            "listview-compare",
            {
                route: "listviews/listview/compare"
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Page

    // $el の高さが決まってから処理する必要があるため、onPageShow() をハンドリング
    onPageShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageShow(event, data);
        this._listViewElement = new SimpleListView({
            el: this.$page.find("#sample-listview-element-comp"),
            scrollerFactory: ScrollerElement.getFactory(),
        });
        this._listViewIScroll = new SimpleListView({
            el: this.$page.find("#sample-listview-iscroll-comp"),
            scrollerFactory: ScrollerIScroll.getFactory({
                fadeScrollbars: false,
            }),
        });
    }

    onPageRemove(event: JQuery.Event): void {
        if (this._listViewElement) {
            this._listViewElement.remove();
            this._listViewElement = null;
        }
        if (this._listViewIScroll) {
            this._listViewIScroll.remove();
            this._listViewIScroll = null;
        }
        super.onPageRemove(event);
    }
}

registerPage(ListViewComparePage);
