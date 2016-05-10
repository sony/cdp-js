/* tslint:disable:max-line-length */

import { toUrl } from "cdp/framework";
import { Template, JST, toZeroPadding } from "cdp/tools";
import { ListItemView, ListItemViewOptions } from "cdp/ui";

const TAG: string = "[View/ListView/SimpleListItemView] ";

/**
 * @class SimpleListItemView
 * @brief テスト用 ListItemView 派生クラス
 */
export class SimpleListItemView extends ListItemView<Backbone.Model> {

    private _template: JST = null;
    private _devId: string = null;
    private _index: number = null;

    /**
     * constructor
     *
     * @param options {ListItemViewOptions} [in] オプション
     */
    constructor(options?: ListItemViewOptions<Backbone.Model>) {
        super(options);
        this._template = Template.getJST("#template-simple-listitemview", toUrl("/templates/listviews/listview-templates.html"));
        this._devId = (<any>options).devId;
        this._index = (<any>options).devIndex;
        this.render();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: ListItemView

    //! 描画
    render(): SimpleListItemView {
        if (null != this.$el && !this.hasChildNode()) {
            let $line = $(this._template(this.makeTemplateParam()));
            $line.height(this.$el.height());
            this.$el.append($line);
        }
        return this;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    //! template に設定する JSON オブジェクトを作成
    private makeTemplateParam(): Object {
        let index = this._index || this.getIndex();
        return {
            devId: this._devId,
            index: toZeroPadding(index, 3),
            type: (0 === index % 2) ? "even" : "odd",
        };
    }
}
