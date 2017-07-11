/* tslint:disable:max-line-length */

import {
    PageView,
    JST,
    registerPage,
} from "cdp/ui";
import Picture from "../../model/picture";
import PictureList from "../../model/picture-list";
import PictureListViewHelper from "./helper";

const TAG = "[view.views-sample.PictureListViewPageView] ";

/**
 * @class PictureListViewPageView
 * @brief CDP.UI.PageView から派生した PictureListView クラス
 *        Backbone.View + CDP.Framework.Page の機能を持つ。(おすすめ)
 */
class PictureListViewPageView extends PageView<Picture> {

    private _$listview: JQuery = null;
    private _template: JST = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/views-sample/view-page-view.html", "view-page-view", { route: "view/page-view" });
        // template の読み込み
        this._template = PictureListViewHelper.getJST("#view-list-el-template", "/templates/views-sample/view-templates.html");
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    /**
     * イベントハンドラのマッピング。
     * CSS セレクタにマッチした要素にイベントハンドラを自動でセットされる。
     */
    events(): any {
        return {
            "vclick .btn-add": this.onButtonAdd,
            "vclick .btn-fetch": this.onButtonFetch,
            "vclick .btn-remove": this.onButtonRemove,
            "vclick .btn-reset": this.onButternReset,
        };
    }

    //! 描画
    render(): PageView {
        this._$listview.html(
            this._template({
                imglist: this.collection.toJSON(),
            })
        );
        this._$listview.listview("refresh");
        return this;
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    private onButtonAdd(): void {
        console.log(TAG + "onButtonAdd()");
        PictureListViewHelper.updateTarget(<PictureList>this.collection);
        const model = PictureListViewHelper.queryModel();
        this.collection.add(model);
    }

    private onButtonFetch(): void {
        console.log(TAG + "onButtonFetch()");
        PictureListViewHelper.updateTarget(<PictureList>this.collection);
        this.collection.fetch(<any>{ remove: false });
    }

    private onButtonRemove(): void {
        console.log(TAG + "onButtonRemove()");
        this.collection.pop();
    }

    private onButternReset(): void {
        console.log(TAG + "onButternReset()");
        this.collection.reset();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageView

    onPageInit(event: JQuery.Event): void {
        super.onPageInit(event);
        console.log(TAG + "onPageInit()");
        this._$listview = this.$page.find(".picture-listview");
        this.collection = new PictureList;
        this.listenTo(this.collection, "add sync remove reset", this.render);
    }

    onPageRemove(event: JQuery.Event): void {
        console.log(TAG + "onPageRemove()");
        this.stopListening();
        super.onPageRemove(event);
    }
}

registerPage(PictureListViewPageView);
