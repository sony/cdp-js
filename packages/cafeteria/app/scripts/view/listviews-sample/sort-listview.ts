import {
    ListView,
    ListViewConstructOptions,
} from "cdp/ui";
import {
    ListItemModel,
    ListItemCollection,
} from "../../model/listviews-sample/data";
import { SortListItemView } from "./sort-listitem-view";

const TAG = "[view.listviews-sample.SortListView] ";

// SortListView の構築オプション定義
export interface SortListViewConstructOptions extends ListViewConstructOptions<ListItemModel> {
    collection: ListItemCollection;
}

/**
 * @class SortListView
 * @brief ソート可能な ListView サンプルクラス
 *        Backbone.Collection と連携
 */
export default class SortListView extends ListView<ListItemModel> {

    /**
     * constructor
     *
     * @param options [in] オプション
     */
    constructor(options: SortListViewConstructOptions) {
        super(options);
        this.listenTo(this.collection, "reset", this.onChanged);
        this.listenTo(this.collection, "sort", this.onChanged);
    }

    onChanged(collection: ListItemCollection, options: any): void {
        // options.addedModels は ListItemCollection の独自定義
        let models: ListItemModel[] = options.addedModels;
        if (null == models) {
            this.release();
            models = this.collection.models;
        }
        this.render(models);
    }

    // 描画
    render(models?: ListItemModel[]): SortListView {
        if (null != this.$el) {
            models.forEach((model: ListItemModel) => {
                // SortListItemView を追加
                this.addItem(model.get("height"), SortListItemView, { model: model });
            });
            this.update();
        }
        return this;
    }
}
