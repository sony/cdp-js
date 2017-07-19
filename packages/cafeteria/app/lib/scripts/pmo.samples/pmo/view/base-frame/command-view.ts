import {
    Model,
    View,
    ViewOptions,
    setBackButtonHandler,
} from "cdp/framework";
import {
    abs,
} from "cdp/tools";
import {
    AppPageBase,
} from "./app-page-base";


const TAG = "[pmo.view.base-frame.CommandView] ";

///////////////////////////////////////////////////////////////////////
// closure methods

const _oldBackKeyHandler: (event?: JQuery.Event) => void = setBackButtonHandler(null);
const _moveEvent = "touchmove MSPointerMove";

// Overflow menu が表示中のときは true
function _isShowOverflowMenu(): boolean {
    return $("menu.overflow").parent().hasClass("ui-popup-active");
}

// H/W Back Key に、overflow menu を閉じる対応
function _customBackKeyHandler(event?: JQuery.Event): void {
    if (_isShowOverflowMenu()) {
        $("menu.overflow").popup("close");
    } else {
        _oldBackKeyHandler(event);
    }
}

setBackButtonHandler(_customBackKeyHandler);

//  擬似要素を用いない active 状態設定用ハンドラ
(() => {
    const EVENT_TOUCH_START = "touchstart mousedown MSPointerDown";
    const EVENT_TOUCH_END = "touchend touchmove mouseup mousemove MSPointerUp MSPointerMove";
    const ACTIVE_TARGET = ".active-target, .command-icon, .command-button, .overflow>li, .button, menu>li";

    const $document = $(document);

    const touchEndHandler = (event: JQuery.Event): void => {
        const $target = $(event.currentTarget);
        $target.removeClass("active");
        $document.off(EVENT_TOUCH_END, ACTIVE_TARGET, touchEndHandler);
    };

    $document.on(EVENT_TOUCH_START, ACTIVE_TARGET, (ev: JQuery.Event) => {
        const $target = $(ev.currentTarget);
        $target.addClass("active");
        $document.on(EVENT_TOUCH_END, ACTIVE_TARGET, touchEndHandler);
    });
})();

//___________________________________________________________________________________________________________________//


// @interface ScrollPos
interface ScrollPos {
    page: {
        x: number;
        y: number;
    };
    document: {
        x: number;
        y: number;
    };
}


//___________________________________________________________________________________________________________________//


/**
 * @class CommandView
 * @brief Command Handler を抽象化した View クラス
 */
export default class CommandView extends View<Model> {

    private _owner: AppPageBase = null;
    private _pageEventHandler: (event: JQuery.Event) => any = null;
    private _moveEventHander: (event: JQuery.Event) => any = null;
    private _lastScrollPos: ScrollPos = null;

    /**
     * constructor
     */
    constructor(owner: AppPageBase, options?: ViewOptions) {
        super(options);
        this._owner = owner;

        const $document = $(document);

        this._pageEventHandler = this.onPageEvent.bind(this);
        this._owner.$page.on("scroll", this._pageEventHandler);
        $document.on("scroll", this._pageEventHandler);

        this._moveEventHander = (event: JQuery.Event) => {
            if (_isShowOverflowMenu()) {
                event.preventDefault();
                $("menu.overflow").popup("close");
            }
        };
        $document.on(_moveEvent, this._moveEventHander);
    }

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * 有効化
     * instance 作成後、表示直前の初期化を行う
     */
    public activate(): void {
        this._lastScrollPos = null;
    }

    /**
     * 無効化
     * 非表示になる直前に _activeOwner を無効化する
     */
    public inactivate(): void {
        // noop.
    }

    ///////////////////////////////////////////////////////////////////////
    // Override methods

    /**
     * アクティブモードの設定
     *
     * @param mode {String} [in] モードの文字列
     */
    setActiveMode(mode: string): void {
        console.warn(TAG + "need to implement in subclass.");
    }

    /**
     * アクティブモードの取得
     *
     * @return {String} モードの文字列
     */
    getActiveMode(): string {
        console.warn(TAG + "need to implement in subclass.");
        return null;
    }

    /**
     * アクティブな command set オブジェクトを取得
     *
     * @return {jQuery} command set jquery object
     */
    getActiveCommandSet(): JQuery {
        console.warn(TAG + "need to implement in subclass.");
        return null;
    }

    /**
     * タイトル設定
     *
     * @param title {String} [in] タイトル文字列
     */
    setTitle(title: string): void {
        console.warn(TAG + "need to implement in subclass.");
    }

    /**
     * Notification の表示/非表示
     *
     * @param show {Boolean} [in] true: 表示 / false: 非表示
     */
    showNotification(show: boolean): void {
        console.warn(TAG + "need to implement in subclass.");
    }

    /**
     * Notification 表示中か? (UI Status)
     *
     * @return {Boolean} true: Notification 表示中 / false: 非表示
     */
    isVisibleNotification(): boolean {
        console.warn(TAG + "need to implement in subclass.");
        return false;
    }

    /**
     * Loading の表示/非表示
     *
     * @param show {Boolean} [in] true: ロード中 / false:    非表示
     */
    setLoadingState(loading: boolean): void {
        console.warn(TAG + "need to implement in subclass.");
    }

    /**
     * ロード表示中か? (UI Status)
     *
     * @return {Boolean} true: ロード中 / false: 非表示
     */
    isVisibleLoading(): boolean {
        console.warn(TAG + "need to implement in subclass.");
        return false;
    }

    // タイトルエリアの width 設定
    setTitleMaxWidth(): void {
        console.warn(TAG + "need to implement in subclass.");
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    // 破棄
    remove(): Backbone.View<Backbone.Model> {
        const $document = $(document);
        $document.off(_moveEvent, this._moveEventHander);
        $document.off("scroll", this._pageEventHandler);
        this._owner.$page.off("scroll", this._pageEventHandler);
        this._pageEventHandler = null;
        return super.remove();
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    /* eslint-disable no-unused-vars */
    // active page に発生したイベントハンドラ
    private onPageEvent(event?: JQuery.Event): void {
        let absPageX = 0,
            absPageY = 0,
            absDocumentX = 0,
            absDocumentY = 0;
        const $document = $(document);
        const scrollPos: ScrollPos = {
            page: {
                x: this._owner.$page.scrollLeft(),
                y: this._owner.$page.scrollTop(),
            },
            document: {
                x: $document.scrollLeft(),
                y: $document.scrollTop(),
            }
        };

        if (null == this._lastScrollPos) {
            this._lastScrollPos = {
                page: {
                    x: scrollPos.page.x,
                    y: scrollPos.page.y,
                },
                document: {
                    x: scrollPos.document.x,
                    y: scrollPos.document.y,
                }
            };
        }

        if (_isShowOverflowMenu()) {
            absPageX = abs(this._lastScrollPos.page.x - scrollPos.page.x);
            absPageY = abs(this._lastScrollPos.page.y - scrollPos.page.y);
            absDocumentX = abs(this._lastScrollPos.document.x - scrollPos.document.x);
            absDocumentY = abs(this._lastScrollPos.document.y - scrollPos.document.y);
            if (0 < absPageY || 0 < absPageY || 0 < absDocumentX || 0 < absDocumentY) {
                $("menu.overflow").popup("close");
            }
        }

        this._lastScrollPos = {
            page: {
                x: scrollPos.page.x,
                y: scrollPos.page.y,
            },
            document: {
                x: scrollPos.document.x,
                y: scrollPos.document.y,
            }
        };
    }
    /* eslint-enable no-unused-vars */

    // Orientation の変更検知
    public onOrientationChanged(): void {
        if (_isShowOverflowMenu()) {
            $("menu.overflow").popup("close");
        }
        this.setTitleMaxWidth();
    }

    // .command-icon.withindicator のコールバック
    onBack(event: JQuery.Event): void {
        this._owner.onCommandBack(event);
        event.preventDefault();
    }

    // .command-icon.done のコールバック
    onDone(event: JQuery.Event): void {
        this._owner.onCommandDone(event);
        event.preventDefault();
    }

    // .command-button.add のコールバック
    onAdd(event: JQuery.Event): void {
        this._owner.onCommandAdd(event);
        event.preventDefault();
    }

    // .command-button.delete のコールバック
    onDelete(event: JQuery.Event): void {
        this._owner.onCommandDelete(event);
        event.preventDefault();
    }

    // .command-button.edit のコールバック
    onEdit(event: JQuery.Event): void {
        this._owner.onCommandEdit(event);
        event.preventDefault();
    }

    // .command-button.notification のコールバック
    onNotification(event: JQuery.Event): void {
        this._owner.onCommandNotification(event);
        event.preventDefault();
    }

    // .command-button.photo のコールバック
    onPhoto(event: JQuery.Event): void {
        this._owner.onCommandPhoto(event);
        event.preventDefault();
    }

    // .command-button.play のコールバック
    onPlay(event: JQuery.Event): void {
        this._owner.onCommandPlay(event);
        event.preventDefault();
    }

    // .command-button.refresh のコールバック
    onRefresh(event: JQuery.Event): void {
        this._owner.onCommandRefresh(event);
        event.preventDefault();
    }

    // .command-button.share のコールバック
    onShare(event: JQuery.Event): void {
        this._owner.onCommandShare(event);
        event.preventDefault();
    }

    // .command-button.overflow のコールバック
    onOverflow(event: JQuery.Event): void {
        this._owner.onCommandOverflow(event);
        event.preventDefault();
    }
}
