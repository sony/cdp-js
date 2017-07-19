import { global } from "cdp";
import {
    View,
    ViewOptions,
} from "cdp/framework";
import { AppPageBase } from "./app-page-base";
import CommandView from "./command-view";
import NavigationBar from "./navigation-bar";
import ToolBar from "./tool-bar";

const TAG = "[pmo.view.base-frame.CommandViewAdaptor] ";

/**
 * @class CommandViewAdaptor
 * @brief NavigationBar と ToolBar を所有した ComamadView クラス
 */
export default class CommandViewAdaptor extends CommandView {

    private _navigationBar: NavigationBar = null;
    private _toolBar: ToolBar = null;

    /**
     * constructor
     */
    constructor(owner: AppPageBase, options?: ViewOptions) {
        super(owner, options);
        this._navigationBar = new NavigationBar(this, { el: options.el.first() });
        this._toolBar = new ToolBar(this, { el: options.el.last() });
        this.setTitleMaxWidth();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: CommandView

    // アクティブモードの設定
    setActiveMode(mode: string): void {
        this._navigationBar.setActiveMode(mode);
        this._toolBar.setActiveMode(mode);
    }

    // アクティブモードの取得
    getActiveMode(): string {
        const mode = this._navigationBar.getActiveMode();
        if (global.Config.DEBUG) {
            if (this._toolBar.getActiveMode() !== mode) {
                console.warn(TAG + "mode conflict between navigationbar and toolbar.");
            }
        }
        return mode;
    }

    // アクティブな command set オブジェクトを取得
    getActiveCommandSet(): JQuery {
        // NavigationBar, ToolBar 双方が対象
        const $commandSet = $(".command-set.active");
        if (0 < $commandSet.length) {
            return $commandSet;
        } else {
            console.warn(TAG + "command-set.active not found.");
            return null;
        }
    }

    // タイトル設定
    setTitle(title: string): void {
        this._navigationBar.setTitle(title);
    }

    // Notification の表示/非表示
    showNotification(show: boolean): void {
        // noop.
    }

    // Notification 表示中か? (UI Status)
    isVisibleNotification(): boolean {
        return false;
    }

    // Loading の表示/非表示
    setLoadingState(loading: boolean): void {
        // noop.
    }

    // ロード表示中か? (UI Status)
    isVisibleLoading(): boolean {
        return false;
    }

    // タイトルエリアの width 設定
    setTitleMaxWidth(): void {
        this._navigationBar.setTitleMaxWidth();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    // 破棄
    remove(): View {
        super.remove();
        return this;
    }
}
