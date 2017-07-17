/* tslint:disable:max-line-length */

import {
    Page,
    registerPage,
} from "cdp/framework";
import { JST } from "cdp/tools";
import PictureList from "../../model/picture-list";
import PictureListViewHelper from "./helper";

const TAG = "[view.views-sample.PictureListViewPage] ";

/**
 * @class PictureListViewPage
 * @brief CDP.Framework.Page から派生した PictureListView クラス
 *        自前のイベントハンドリングを必要とする。
 */
class PictureListViewPage extends Page {

    private _$listview: JQuery = null;
    private _template: JST = null;
    private _collection: PictureList = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/views-sample/view-page.html", "view-page", { route: "views/page" });
        // template の読み込み
        this._template = PictureListViewHelper.getJST("#view-list-el-template", "/templates/views-sample/view-templates.html");
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Page

    onPageInit(event: JQuery.Event): void {
        console.log(TAG + "onPageInit()");
        this._$listview = this.$page.find(".picture-listview");
        this._collection = new PictureList;
        this.bindEvent();
    }

    onPageRemove(event: JQuery.Event): void {
        console.log(TAG + "onPageRemove()");
    }

    ///////////////////////////////////////////////////////////////////////
    // 内部関数

    // イベントバインド
    private bindEvent(): void {
        $(".btn-add").on("vclick", (event: JQuery.Event) => {
            console.log(TAG + "onButtonAdd()");
            PictureListViewHelper.updateTarget(this._collection);
            const model = PictureListViewHelper.queryModel();
            this._collection.add(model);
            this.render();
        });

        $(".btn-fetch").on("vclick", (event: JQuery.Event) => {
            console.log(TAG + "onButtonFetch()");
            PictureListViewHelper.updateTarget(this._collection);
            this._collection.fetch(<Backbone.CollectionFetchOptions>{
                remove: false,
                success: () => {
                    this.render();
                }
            });
        });

        $(".btn-remove").on("vclick", (event: JQuery.Event) => {
            console.log(TAG + "onButtonRemove()");
            this._collection.pop();
            this.render();
        });

        $(".btn-reset").on("vclick", (event: JQuery.Event) => {
            console.log(TAG + "onButternReset()");
            this._collection.reset();
            this.render();
        });
    }

    // 描画
    private render(): void {
        this._$listview.html(
            this._template({
                imglist: this._collection.toJSON(),
            })
        );
        this._$listview.listview("refresh");
    }
}

registerPage(PictureListViewPage);
