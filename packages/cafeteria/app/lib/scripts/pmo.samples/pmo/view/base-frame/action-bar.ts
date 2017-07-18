import {
    View,
    ViewOptions,
} from "cdp/framework";
import CommandView from "./command-view";
import ActionBarFooterButtons from "./action-bar-footer-buttons";
import { AppPageBase } from "./app-page-base";

const TAG = "[pmo.view.base-frame.ActionBar] ";

/**
 * @class ActionBar
 * @brief Android 用 ActionBar を実装する View クラス
 */
export default class ActionBar extends CommandView {

    private _footerButtons: ActionBarFooterButtons = null;

    /**
     * constructor
     */
    constructor(owner: AppPageBase, options?: ViewOptions) {
        super(owner, options);
        this.setupFooterButtons(owner);
        this.setTitleMaxWidth();
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    // footer button の準備
    private setupFooterButtons(owner: AppPageBase): void {
        const $commandView = owner.$footer.find(".actionbar");
        if (0 < $commandView.length) {
            this._footerButtons = new ActionBarFooterButtons(owner, { el: $commandView.first() });
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: CommandView

    // アクティブモードの設定
    setActiveMode(mode: string): void {
        this.$el.find(".command-set").each((index, commandSet) => {
            const $commandSet = $(commandSet);
            if (mode === $commandSet.data("mode")) {
                $commandSet.addClass("active");
            } else {
                $commandSet.removeClass("active");
            }
        });
        if (this._footerButtons) {
            this._footerButtons.setActiveMode(mode);
        }
        this.setTitleMaxWidth();
    }

    // アクティブモードの取得
    getActiveMode(): string {
        const $commandSet = this.getActiveCommandSet();
        if ($commandSet) {
            return $commandSet.data("mode");
        } else {
            console.warn(TAG + "command-set.active not found.");
            return null;
        }
    }

    // アクティブな command set オブジェクトを取得
    getActiveCommandSet(): JQuery {
        const $commandSet = this.$el.find(".command-set.active");
        if (0 < $commandSet.length) {
            return $commandSet;
        } else {
            console.warn(TAG + "command-set.active not found.");
            return null;
        }
    }

    // タイトル設定
    setTitle(title: string): void {
        const $title = this.$el.find(".command-set.active").find(".command-title");
        $title.text(title);
        this.setTitleMaxWidth();
    }

    // Notification の表示/非表示
    showNotification(show: boolean): void {
        const $result = this.$el.find(".command-button.notification").css("visibility", show ? "visible" : "hidden");
        if (0 < $result.length) {
            this.setTitleMaxWidth();
        }
    }

    // Notification 表示中か? (UI Status)
    isVisibleNotification(): boolean {
        return "visible" === this.$el.find(".command-button.notification").css("visibility");
    }

    // Loading の表示/非表示
    setLoadingState(loading: boolean): void {
        if (loading) {
            this.$el.find(".command-button.refresh").addClass("loading");
        } else {
            this.$el.find(".command-button.refresh").removeClass("loading");
        }
    }

    // ロード表示中か? (UI Status)
    isVisibleLoading(): boolean {
        return 0 < this.$el.find(".command-button.refresh.loading").length;
    }

    // タイトルエリアの width 設定
    setTitleMaxWidth(): void {
        // status によってフィルタ
        let count = 0;
        let titleMaxWidth = 0;
        let buttonWidth = 0;
        const $commandSet = this.$el.find(".command-set.active");
        const $commandTitle = $commandSet.children(".command-title");
        const $commandButtons = $commandSet.children(".command-button");
        const $button = $commandButtons.first();

        $commandButtons.each((index, button) => {
            if ("visible" === $(button).css("visibility")) {
                count++;
            }
        });

        if (0 < count) {
            buttonWidth = $button.width() +
                parseInt($button.css("margin-left"), 10) +
                parseInt($button.css("margin-right"), 10) +
                parseInt($button.css("padding-left"), 10) +
                parseInt($button.css("padding-right"), 10) +
                parseInt($button.css("border-left-width"), 10) +
                parseInt($button.css("border-right-width"), 10);

            titleMaxWidth = $(window).width() - parseInt($commandTitle.css("left"), 10) - (buttonWidth * count);
            $commandTitle.css("max-width", titleMaxWidth);
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    // 破棄
    remove(): View {
        if (this._footerButtons) {
            this._footerButtons.remove();
            this._footerButtons = null;
        }
        return super.remove();
    }

    /**
     * イベントハンドラのマッピング
     */
    events(): any {
        return {
            "vclick .command-icon.withindicator": "onBack",
            "vclick .command-icon.done": "onDone",
            "vclick .command-button.add": "onAdd",
            "vclick .command-button.delete": "onDelete",
            "vclick .command-button.edit": "onEdit",
            "vclick .command-button.notification": "onNotification",
            "vclick .command-button.photo": "onPhoto",
            "vclick .command-button.play": "onPlay",
            "vclick .command-button.refresh": "onRefresh",
            "vclick .command-button.share": "onShare",
            "vclick .command-button.overflow": "onOverflow",
        };
    }
}
