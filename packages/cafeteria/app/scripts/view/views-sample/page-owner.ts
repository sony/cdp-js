import {
    View,
    Page,
    registerPage,
} from "cdp/framework";
import Picture from "../../model/picture";
import PictureListViewBackbone from "./backbone";

const TAG = "[view.views-sample.PictureListViewPageOwner] ";

/**
 * @class PictureListViewPageOwner
 * @brief CDP.Framework.Page から派生した PictureListView クラス
 *        メンバに Backbone.View を持ち、レンダリングは移譲する
 */
class PictureListViewPageOwner extends Page {

    private _view: View<Picture> = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/views-sample/view-page-owner.html", "view-page-owner", { route: "view/page-owner" });
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Page

    onPageInit(event: JQuery.Event): void {
        console.log(TAG + "onPageInit()");
        this._view = new PictureListViewBackbone({ el: "#view-page-owner" });
    }

    onPageRemove(event: JQuery.Event): void {
        console.log(TAG + "onPageRemove()");
        if (this._view) {
            this._view.stopListening();
            this._view = null;
        }
    }
}

registerPage(PictureListViewPageOwner);
