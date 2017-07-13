import {
    PageView,
    registerPage,
    ShowEventData,
    ScrollerIScroll,
} from "cdp/ui";
import SimpleListView from "./simple-listview";

const TAG = "[view.listviews-sample.ListViewIScrollPage] ";

/**
 * @class ListViewIScrollPage
 * @brief SimpleListView のオーナー Page クラス
 */
class ListViewIScrollPage extends PageView {

    private _listViewIScroll: SimpleListView = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/listviews-sample/listview-iscroll.html",
            "listview-iscroll",
            {
                route: "listview/iscroll"
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Page

    // $el の高さが決まってから処理する必要があるため、onPageShow() をハンドリング
    onPageShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageShow(event, data);
        this._listViewIScroll = new SimpleListView({
            el: this.$page.find("#sample-listview-iscroll"),
            scrollerFactory: ScrollerIScroll.getFactory({
                fadeScrollbars: false,
            }),
        });
    }

    onPageRemove(event: JQuery.Event): void {
        if (this._listViewIScroll) {
            this._listViewIScroll.remove();
            this._listViewIScroll = null;
        }
        super.onPageRemove(event);
    }
}

registerPage(ListViewIScrollPage);
