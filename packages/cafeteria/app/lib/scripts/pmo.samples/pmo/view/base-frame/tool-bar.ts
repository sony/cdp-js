import {
    Model,
    View,
    ViewOptions,
} from "cdp/framework";
import CommandViewAdaptor from "./command-view-adaptor";

const TAG = "[pmo.view.base-frame.ToolBar] ";

/**
 * @class ToolBar
 * @brief iOS クライアント用 ToolBar クラス
 */
export default class ToolBar extends View<Model> {

    /**
     * constructor
     */
    constructor(private _adaptor: CommandViewAdaptor, options?: ViewOptions) {
        super(options);
    }

    ///////////////////////////////////////////////////////////////////////
    // public methods

    // アクティブモードの設定
    public setActiveMode(mode: string): void {
        this.$el.find(".command-set").each((index, commandSet) => {
            const $commandSet = $(commandSet);
            if (mode === $commandSet.data("mode")) {
                $commandSet.addClass("active");
            } else {
                $commandSet.removeClass("active");
            }
        });
    }

    // アクティブモードの取得
    public getActiveMode(): string {
        const $commandSet = this.getActiveCommandSet();
        if ($commandSet) {
            return $commandSet.data("mode");
        } else {
            console.warn(TAG + "command-set.active not found.");
            return null;
        }
    }

    // アクティブな command set オブジェクトを取得
    public getActiveCommandSet(): JQuery {
        const $commandSet = this.$el.find(".command-set.active");
        if (0 < $commandSet.length) {
            return $commandSet;
        } else {
            console.warn(TAG + "command-set.active not found.");
            return null;
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    /**
     * イベントハンドラのマッピング
     */
    events(): any {
        return {
            "vclick .command-button.add": this.onAdd,
            "vclick .command-button.delete": this.onDelete,
            "vclick .command-button.notification": this.onNotification,
            "vclick .command-button.photo": this.onPhoto,
            "vclick .command-button.play": this.onPlay,
            "vclick .command-button.refresh": this.onRefresh,
            "vclick .command-button.share": this.onShare,
            "vclick .command-button.overflow": this.onOverflow,
        };
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    // .command-button.add のコールバック
    private onAdd(event: JQuery.Event): void {
        this._adaptor.onAdd(event);
    }

    // .command-button.delete のコールバック
    private onDelete(event: JQuery.Event): void {
        this._adaptor.onDelete(event);
    }

    // .command-button.notification のコールバック
    private onNotification(event: JQuery.Event): void {
        this._adaptor.onNotification(event);
    }

    // .command-button.photo のコールバック
    private onPhoto(event: JQuery.Event): void {
        this._adaptor.onPhoto(event);
    }

    // .command-button.play のコールバック
    private onPlay(event: JQuery.Event): void {
        this._adaptor.onPlay(event);
    }

    // .command-button.refresh のコールバック
    private onRefresh(event: JQuery.Event): void {
        this._adaptor.onRefresh(event);
    }

    // .command-button.share のコールバック
    private onShare(event: JQuery.Event): void {
        this._adaptor.onShare(event);
    }

    // .command-button.overflow のコールバック
    private onOverflow(event: JQuery.Event): void {
        this._adaptor.onOverflow(event);
    }
}
