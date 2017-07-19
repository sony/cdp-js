import {
    Model,
    View,
    ViewOptions,
} from "cdp/framework";
import CommandViewAdaptor from "./command-view-adaptor";

const TAG = "[pmo.view.base-frame.NavigationBar] ";

/**
 * @class NavigationBar
 * @brief iOS クライアント用 NavigationBar クラス
 */
export default class NavigationBar extends View<Model> {

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
        this.setTitleMaxWidth();
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

    // タイトル設定
    public setTitle(title: string): void {
        const $title = this.$el.find(".command-set.active").find(".command-title");
        $title.text(title);
        this.setTitleMaxWidth();
    }

    // タイトルエリアの width 設定
    public setTitleMaxWidth(): void {
        // noop.
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    /**
     * イベントハンドラのマッピング
     */
    events(): any {
        return {
            "vclick .command-button.back": this.onBack,
            "vclick .command-button.done": this.onDone,
            "vclick .command-button.edit": this.onEdit,
            "vclick .command-button.notification": this.onNotification,
        };
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    // .command-icon.withindicator のコールバック
    private onBack(event: JQuery.Event): void {
        this._adaptor.onBack(event);
    }

    // .command-icon.done のコールバック
    private onDone(event: JQuery.Event): void {
        this._adaptor.onDone(event);
    }

    // .command-button.edit のコールバック
    private onEdit(event: JQuery.Event): void {
        this._adaptor.onEdit(event);
    }

    // .command-button.notification のコールバック
    private onNotification(event: JQuery.Event): void {
        this._adaptor.onNotification(event);
    }
}
