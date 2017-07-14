import {
    IPromise,
    View,
    ListView,
    ListViewConstructOptions,
    Toast,
} from "cdp/ui";
import {
    ItemInfo,
    queryItemInfoList,
} from "../../model/listviews-sample/util";
import SimpleListItemView from "./simple-listitem-view";

const TAG = "[view.listviews-sample.SimpleListView] ";

/**
 * @class SimpleListView
 * @brief ListView 派生クラス
 */
export default class SimpleListView extends ListView {

    private _promise: IPromise<any> = null;

    /**
     * constructor
     *
     * @param options [in] オプション
     */
    constructor(options?: ListViewConstructOptions) {
        super(options);
        this.render();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: ListItemView

    // 描画
    render(): SimpleListView {
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
        return this;
    }

    // 開放
    remove(): View {
        if (this._promise) {
            this._promise.abort();
            this._promise = null;
        }
        return super.remove();
    }
}
