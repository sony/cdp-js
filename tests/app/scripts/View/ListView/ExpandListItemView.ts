/* tslint:disable:max-line-length */

import { toUrl } from "cdp/framework";
import { Template, JST } from "cdp/tools";
import { GroupListItemView, ListItemViewOptions } from "cdp/ui";

const TAG: string = "[View/ListView/ExpandListItemView] ";

/**
 * @class ExpandListItemViewPreview
 * @brief テスト用 開閉 ListItemView 派生クラス1
 */
export class ExpandListItemViewPreview extends GroupListItemView<Backbone.Model> {

    private _template: JST = null;
    private _devId: string = null;
    private _devIndex: string = null;

    /**
     * constructor
     *
     * @param options {ListItemViewOptions} [in] オプション
     */
    constructor(options?: ListItemViewOptions<Backbone.Model>) {
        super(options);
        this._template = Template.getJST("#template-expandable-listitemview-preview", toUrl("/templates/listviews/listview-templates.html"));
        this._devId = (<any>options).devId;
        this._devIndex = (<any>options).devIndex;
        this.render();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: ListItemView

    //! 描画
    render(): ExpandListItemViewPreview {
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
        return {
            devId: this._devId,
            index: this._devIndex,
            operation: this.isExpanded() ? "to-collapse" : "to-expand",
            state: this.hasChildren() ? "enable" : "disable",
        };
    }
}


//___________________________________________________________________________________________________________________//


/**
 * @class ExpandListItemViewExtra
 * @brief テスト用 開閉 ListItemView 派生クラス2
 */
export class ExpandListItemViewExtra extends GroupListItemView<Backbone.Model> {

    private _template: JST = null;
    private _devId: string = null;
    private _devIndex: string = null;

    /**
     * constructor
     *
     * @param options {ListItemViewOptions} [in] オプション
     */
    constructor(options?: ListItemViewOptions<Backbone.Model>) {
        super(options);
        this._template = Template.getJST("#template-expandable-listitemview-extra", toUrl("/templates/listviews/listview-templates.html"));
        this._devId = (<any>options).devId;
        this._devIndex = (<any>options).devIndex;
        this.render();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: ListItemView

    //! 描画
    render(): ExpandListItemViewExtra {
        if (null != this.$el) {
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
        return {
            devId: this._devId,
            index: this._devIndex,
        };
    }
}
