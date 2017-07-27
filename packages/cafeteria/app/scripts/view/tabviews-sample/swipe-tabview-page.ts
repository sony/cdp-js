import {
    PageView,
    registerPage,
    ShowEventData,
} from "cdp/ui";

const TAG = "[view.tabviews-sample.SwipeableTabViewPage] ";

/**
 * @class SwipeableTabViewPage
 * @brief TabHostView のオーナー Page クラス
 */
class SwipeableTabViewPage extends PageView {

//    private _listViewElement: SimpleListView = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/tabviews-sample/swipeable-tabview.html",
            "swipeable-tabview",
            {
                route: "tabviews/swipeable-tabview"
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Page

    // $el の高さが決まってから処理する必要があるため、onPageShow() をハンドリング
    onPageShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageShow(event, data);
        //this._listViewElement = new SimpleListView({
        //    el: this.$page.find("#sample-listview-element"),
        //    scrollerFactory: ScrollerElement.getFactory(),
        //    //          itemTagName: "li",    // display: block の指定も必要
        //});
    }

    onPageRemove(event: JQuery.Event): void {
        //if (this._listViewElement) {
        //    this._listViewElement.remove();
        //    this._listViewElement = null;
        //}
        super.onPageRemove(event);
    }
}

registerPage(SwipeableTabViewPage);
