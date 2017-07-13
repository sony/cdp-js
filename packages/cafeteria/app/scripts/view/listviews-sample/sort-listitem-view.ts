import { toZeroPadding } from "cdp/tools";
import {
    toUrl,
    JST,
    getTemplate,
    ListItemView,
    ListItemViewOptions,
} from "cdp/ui";
import { ListItemModel } from "../../model/listviews-sample/data";

const TAG = "[view.listviews-sample.SortListItemView] ";

// SortListItemView の構築オプション定義
export interface SortListItemViewOptions extends ListItemViewOptions<ListItemModel> {
    model: ListItemModel;
}

/**
 * @class SortListItemView
 * @brief ソート可能な ListItemView サンプルクラス
 *        Backbone.Model と連携
 */
export class SortListItemView extends ListItemView<ListItemModel> {

    private _template: JST = null;

    /**
     * constructor
     *
     * @param options [in] オプション
     */
    constructor(options: SortListItemViewOptions) {
        super(options);
        this._template = getTemplate(
            "#template-simple-listitemview",
            toUrl("/templates/listviews-sample/listview-templates.html")
        );
        this.render();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: ListItemView

    // 描画
    render(): SortListItemView {
        if (null != this.$el && !this.hasChildNode()) {
            const $line = $(this._template(this.makeTemplateParam()));
            $line.height(this.model.get("height"));
            this.$el.append($line);
        }
        return this;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    // template に設定する JSON オブジェクトを作成
    private makeTemplateParam(): object {
        const index = (null != this.model.get("index")) ? this.model.get("index") : this.getIndex();
        return {
            devId: this.model.get("devId"),
            index: toZeroPadding(index, 3),
            type: (0 === index % 2) ? "even" : "odd",
        };
    }
}
