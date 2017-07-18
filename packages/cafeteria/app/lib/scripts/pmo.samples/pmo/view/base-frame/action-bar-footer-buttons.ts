import {
    Model,
    View,
    ViewOptions,
} from "cdp/framework";
import { AppPageBase } from "./app-page-base";

const TAG = "[pmo.view.base-frame.ActionBarFooterButtons] ";

/**
 * @class ActionBarFooterButtons
 * @brief Android 用 ActionBar 使用時に Footer Button を実現するクラス
 */
export default class ActionBarFooterButtons extends View<Model> {

    private _owner: AppPageBase = null;

    /**
     * constructor
     */
    constructor(owner: AppPageBase, options?: ViewOptions) {
        super(options);
        this._owner = owner;
    }

    ///////////////////////////////////////////////////////////////////////
    // public methods

    // アクティブモードの設定
    public setActiveMode(mode: string): void {
        this.$el.find(".footer-buttons").each((index, footerButtons) => {
            const $footerButtons = $(footerButtons);
            if (mode === $footerButtons.data("mode")) {
                $footerButtons.addClass("active");
            } else {
                $footerButtons.removeClass("active");
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    /**
     * イベントハンドラのマッピング
     */
    events(): any {
        return {
            "vclick .button.negative": "onNegativeFooter",
            "vclick .button.positive": "onPositiveFooter",
        };
    }

    // .button.negative のコールバック
    onNegativeFooter(event: JQuery.Event): void {
        this._owner.onCommand(event, "command-general:negative");
        event.preventDefault();
    }

    // .button.positive のコールバック
    onPositiveFooter(event: JQuery.Event): void {
        this._owner.onCommand(event, "command-general:positive");
        event.preventDefault();
    }
}
