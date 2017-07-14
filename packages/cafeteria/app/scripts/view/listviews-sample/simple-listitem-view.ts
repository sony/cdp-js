import { toZeroPadding } from "cdp/tools";
import {
    toUrl,
    JST,
    getTemplate,
    ListItemView,
    ListItemViewOptions,
} from "cdp/ui";

const TAG = "[view.listviews-sample.SimpleListItemView] ";

/**
 * @class SimpleListItemView
 * @brief テスト用 ListItemView 派生クラス
 */
export default class SimpleListItemView extends ListItemView {

    private _template: JST = null;
    private _devId: string = null;
    private _index: number = null;

    /**
     * constructor
     *
     * @param options [in] オプション
     */
    constructor(options?: ListItemViewOptions) {
        super(options);
        this._template = getTemplate(
            "#template-simple-listitemview",
            toUrl("/templates/listviews-sample/listview-templates.html")
        );
        this._devId = (<any>options).devId;
        this._index = (<any>options).devIndex;
        this.render();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: ListItemView

    // 描画
    render(): SimpleListItemView {
        if (null != this.$el && !this.hasChildNode()) {
            const $line = $(this._template(this.makeTemplateParam()));
            $line.height(this.$el.height());
            this.$el.append($line);
        }
        return this;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    // template に設定する JSON オブジェクトを作成
    private makeTemplateParam(): object {
        const index = this._index || this.getIndex();
        return {
            devId: this._devId,
            index: toZeroPadding(index, 3),
            type: (0 === index % 2) ? "even" : "odd",
        };
    }
}
