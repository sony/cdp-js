import {
    IPromise,
    PageListView,
    registerPage,
    ShowEventData,
    HideEventData,
    ScrollerIScroll,
    Toast,
} from "cdp/ui";
import {
    ItemInfo,
    queryItemInfoList,
} from "../../model/listviews-sample/util";
import SimpleListItemView from "./simple-listitem-view";

const TAG = "[view.listviews-sample.PageListViewIScroll] ";

/**
 * @class PageListViewIScroll
 * @brief iScroll を使用した PageListView のサンプル実装クラス
 */
class PageListViewIScroll extends PageListView {

    private _promise: IPromise<any> = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/listviews-sample/page-listview-iscroll.html",
            "pagelistview-iscroll",
            {
                route: "listviews/pagelistview/iscroll",
                scrollerFactory: ScrollerIScroll.getFactory({
                    fadeScrollbars: false,
                }),
                itemTagName: "div",
            });
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageListView

    // jQM event: "pagebeforeshow" に対応
    onPageBeforeShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageBeforeShow(event, data);
        this.load();
    }

    // jQM event: "pagebeforehide" に対応
    onPageBeforeHide(event: JQuery.Event, data?: HideEventData): void {
        super.onPageBeforeHide(event, data);
        if (this._promise) {
            this._promise.abort();
            this._promise = null;
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    // データ取得
    private load(): void {
        this._promise = queryItemInfoList();
        this._promise
            .progress((items: ItemInfo[]) => {
                const baseHeight = 100;
                const initializer = SimpleListItemView; // コンストラクタを指定
                // ListItemView を追加
                this.addItem(
                    baseHeight,
                    initializer, {
                        devId: items[0].item_id,
                        items: items,
                    });
                this.update();
            })
            .then(() => {
                Toast.show($.t("listviews.loadComplete"));
            });
    }
}

registerPage(PageListViewIScroll);
