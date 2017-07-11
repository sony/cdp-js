/* tslint:disable:max-line-length */

import * as Backbone from "backbone";
import { Router } from "cdp/framework";
import { JST } from "cdp/tools";
import Picture from "../../model/picture";
import PictureList from "../../model/picture-list";
import PictureListViewHelper from "./helper";

const TAG = "[view.views-sample.PictureListViewBackbone] ";

/**
 * @class PictureListViewBackbone
 * @brief Backbone.View から派生した PictureListView クラス
 *        初期化にややノウハウが必要。
 */
export default class PictureListViewBackbone extends Backbone.View<Picture> {

    private _$listview: JQuery = null;
    private _template: JST = null;

    /**
     * constructor
     */
    constructor(options?: Backbone.ViewOptions<Picture>) {
        super(options);
        // template の読み込み
        this._template = PictureListViewHelper.getJST("#view-list-el-template", "/templates/views-sample/view-templates.html");
        this._$listview = this.$el.find(".picture-listview");
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    /**
     * イベントハンドラのマッピング。
     * CSS セレクタにマッチした要素にイベントハンドラを自動でセットされる。
     */
    events() {
        return {
            "vclick .btn-add": this.onButtonAdd,
            "vclick .btn-fetch": this.onButtonFetch,
            "vclick .btn-remove": this.onButtonRemove,
            "vclick .btn-reset": this.onButternReset,
        };
    }

    // 初期化
    initialize(options?: Backbone.ViewOptions<Picture>) {
        this.collection = new PictureList;
        this.listenTo(this.collection, "add sync remove reset", this.render);
    }

    // 描画
    render(): PictureListViewBackbone {
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
}

// DOM が構築された後に View インスタンスを作成し、Event Handler を有効にする必要がある。
let viewPicutureListViewBackbone: PictureListViewBackbone = null;
$(document)
    .off("pageinit pageremove", "#view-backbone")
    .on("pageinit", "#view-backbone", (event: JQuery.Event) => {
        viewPicutureListViewBackbone = new PictureListViewBackbone({ el: event.target });
    })
    .on("pageremove", "#view-backbone", (event: JQuery.Event) => {
        if (viewPicutureListViewBackbone) {
            viewPicutureListViewBackbone.stopListening();
            viewPicutureListViewBackbone = null;
        }
    });

// Router へは script が読み込まれたタイミングで登録を行う。
Router.register("view/backbone", "/templates/views-sample/view-backbone.html");
