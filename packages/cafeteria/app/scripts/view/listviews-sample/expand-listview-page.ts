import {
    PageView,
    registerPage,
    ShowEventData,
    ScrollerElement,
} from "cdp/ui";
import * as Config from "../../model/listviews-sample/config";
import ExpandListView from "./expand-listview";

const TAG = "[view.listviews-sample.ExpandListViewPage] ";

/**
 * @class ExpandListViewPage
 * @brief ExpandListView のオーナー Page クラス
 */
class ExpandListViewPage extends PageView {

    private _listViewElement: ExpandListView = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/listviews-sample/expandable-listview.html",
            "expandable-listview",
            {
                route: "listviews/listview/expandable"
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Page

    // $el の高さが決まってから処理する必要があるため、onPageShow() をハンドリング
    onPageShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageShow(event, data);
        this._listViewElement = new ExpandListView({
            el: this.$page.find("#sample-expandable-listview"),
            scrollerFactory: ScrollerElement.getFactory(),
            animationDuration: Config.COLLAPSE_DELAY_TIME,
            baseDepth: "0",
        });
        this.$header.find(".to-expand-all").on("vclick", (ev: JQuery.Event) => {
            ev.preventDefault();
            if (this._listViewElement) {
                this._listViewElement.expandAll();
            }
        });
        this.$header.find(".to-collapse-all").on("vclick", (ev: JQuery.Event) => {
            ev.preventDefault();
            if (this._listViewElement) {
                this._listViewElement.collapseAll();
            }
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

registerPage(ExpandListViewPage);
