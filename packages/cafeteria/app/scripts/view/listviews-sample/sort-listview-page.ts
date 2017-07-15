import {
    PageView,
    registerPage,
    ShowEventData,
    ScrollerElement,
} from "cdp/ui";
import {
    ListItemModel,
    ListItemCollection,
} from "../../model/listviews-sample/data";
import SortListView from "./sort-listview";

const TAG = "[view.listviews-sample.SortListViewPage] ";

/**
 * @class SortListViewPage
 * @brief SortListView のオーナー Page クラス
 */
class SortListViewPage extends PageView {

    private _listViewElement: SortListView = null;
    private _backup: ListItemModel[] = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/listviews-sample/sortable-listview.html",
            "sortable-listview",
            {
                route: "sortable-listview"
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageView

    // $el の高さが決まってから処理する必要があるため、onPageShow() をハンドリング
    onPageShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageShow(event, data);
        this._listViewElement = new SortListView({
            el: $("#sample-sortable-listview"),
            scrollerFactory: ScrollerElement.getFactory(),
            collection: new ListItemCollection(),
        });

        // 初回表示用
        this._listViewElement.collection.fetch();
    }

    onPageRemove(event: JQuery.Event): void {
        if (this._listViewElement) {
            this._listViewElement.remove();
            this._listViewElement = null;
        }
        this._backup = null;
        super.onPageRemove(event);
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    // イベントハンドラのマッピング
    events(): any {
        return {
            "vclick .button-sort": this.onSort,
            "vclick .button-fetch": this.onFetch,
            "vclick .button-reset": this.onReset,
        };
    }

    // ソート
    private onSort(event: JQuery.Event): void {
        event.preventDefault();
        if (this._listViewElement) {
            const collection = this._listViewElement.collection;
            if (null == collection.comparator) {
                // index 降順の comparator を設定
                collection.comparator = SortListViewPage.comparator;
                this._backup = collection.models.slice();
                collection.sort();
            } else {
                // comparator を解除して backup した model[] を再設定
                collection.comparator = null;
                collection.reset(this._backup);
                this._backup = null;
            }
        }
    }

    // 追加
    private onFetch(event: JQuery.Event): void {
        event.preventDefault();
        if (this._listViewElement) {
            this._listViewElement.collection.fetch();
        }
    }

    // 削除
    private onReset(event: JQuery.Event): void {
        event.preventDefault();
        if (this._listViewElement) {
            this._listViewElement.collection.reset();
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    // 比較関数: index の降順で並べ替え
    private static comparator(lhs: ListItemModel, rhs?: ListItemModel): number {
        if (lhs.get("index") < rhs.get("index")) {
            return 1;
        } else if (lhs.get("index") > rhs.get("index")) {
            return -1;
        } else {
            return 0;
        }
    }
}

registerPage(SortListViewPage);
