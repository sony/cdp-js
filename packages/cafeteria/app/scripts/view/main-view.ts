import {
    PageView,
    ShowEventData,
    HideEventData,
    Toast,
    registerPage,
} from "cdp/ui";

import CheckModel from "../model/sample-model";

const TAG = "[view.MainView] ";

/**
 * @class MainView
 * @brief メインビュークラス
 */
export class MainView extends PageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/main.html", "page-main", {
            route: "page-main"
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    //! イベントハンドラのマッピング
    events(): any {
        return {
            "vclick .command-hello": this.onHello,
        };
    }

    //! ".command-hello" のイベントハンドラ
    private onHello(event: JQueryEventObject): void {
        Toast.show(CheckModel.coolMethod("from CheckModel"));
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: UI.PageView

    /**
     * jQM event: "pagebeforecreate" に対応
     *
     * @param event [in] イベントオブジェクト
     */
    onPageBeforeCreate(event: JQueryEventObject): void {
        super.onPageBeforeCreate(event);
    }

    /**
     * jQM event: "pagecreate" (旧:"pageinit") に対応
     *
     * @param event [in] イベントオブジェクト
     */
    onPageInit(event: JQueryEventObject): void {
        super.onPageInit(event);
    }

    /**
     * jQM event: "pagebeforeshow" に対応
     *
     * @param event [in] イベントオブジェクト
     * @param data  [in] 付加情報
     */
    onPageBeforeShow(event: JQueryEventObject, data: ShowEventData): void {
        super.onPageBeforeShow(event, data);
    }

    /**
     * jQM event: "pagecontainershow" (旧:"pageshow") に対応
     *
     * @param event [in] イベントオブジェクト
     * @param data  [in] 付加情報
     */
    onPageShow(event: JQueryEventObject, data: ShowEventData): void {
        super.onPageShow(event, data);
    }

    /**
     * jQM event: "pagebeforehide" に対応
     *
     * @param event [in] イベントオブジェクト
     * @param data  [in] 付加情報
     */
    onPageBeforeHide(event: JQueryEventObject, data: HideEventData): void {
        super.onPageBeforeHide(event, data);
    }

    /**
     * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
     *
     * @param event [in] イベントオブジェクト
     * @param data  [in] 付加情報
     */
    onPageHide(event: JQueryEventObject, data: HideEventData): void {
        super.onPageHide(event, data);
    }

    /**
     * jQM event: "pageremove" に対応
     *
     * @param event [in] イベントオブジェクト
     */
    onPageRemove(event: JQueryEventObject): void {
        super.onPageRemove(event);
    }
}

registerPage(MainView);
