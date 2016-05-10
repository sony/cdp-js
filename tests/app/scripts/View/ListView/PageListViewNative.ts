import { ShowEventData, HideEventData } from "cdp/framework";
import {
    BasePageView,
    PageListView,
    ScrollerNative,
    Toast,
} from "cdp/ui";
import { ItemInfo, DataUtil } from "tests/app/scripts/Model/ListView/DataUtil";
import { SimpleListItemView } from "tests/app/scripts/View/ListView/SimpleListItemView";

const TAG: string = "[View/ListView/PageListViewNative] ";

/**
 * @class PageListViewNative
 * @brief Native View スクロールを使用した PageListView のサンプル実装クラス
 */
class PageListViewNative extends PageListView<Backbone.Model> {

    private _promise: CDP.Promise = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/listviews/page-listview-native.html"
            , "page-example-pagelistview-native"
            , {
                route: "pagelistview/native",
                scrollerFactory: ScrollerNative.getFactory(),
            });
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageListView

    //! jQM event: "pagebeforeshow" に対応
    onPageBeforeShow(event: JQueryEventObject, data?: ShowEventData): void {
        super.onPageBeforeShow(event, data);
        this.load();
    }

    //! jQM event: "pagebeforehide" に対応
    onPageBeforeHide(event: JQueryEventObject, data?: HideEventData): void {
        super.onPageBeforeHide(event, data);
        if (this._promise) {
            this._promise.abort();
            this._promise = null;
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    //! データ取得
    private load(): void {
        this._promise = DataUtil.queryItemInfoList();
        this._promise
            .progress((items: ItemInfo[]) => {
                let baseHeight = 100; // TBD
                let initializer = SimpleListItemView;　            // コンストラクタを指定
                //                        let initializer = SquareGridImageListItemView;　// コンストラクタを指定
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
                Toast.show($.t("page-example-listview.loadComplete"));
            });
    }
}

let _viewPageListViewNative: BasePageView = new PageListViewNative();
