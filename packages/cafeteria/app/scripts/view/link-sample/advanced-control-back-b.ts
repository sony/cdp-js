import { Router, SubFlowParam } from "cdp/framework";
import {
    PageView,
    ShowEventData,
    HideEventData,
    registerPage,
} from "cdp/ui";

const TAG = "[view.link-sample.AdvancedControlBackViewB] ";

/**
 * @class AdvancedControlBackViewB
 * @brief [戻る]制御のための View Root クラス
 */
class AdvancedControlBackViewB extends PageView {

    private _otherMode: boolean = false;

    /**
     * constructor
     */
    constructor() {
        super("/templates/link-sample/link-back-script-b.html",
            "link-back-script-b",
            {
                route: "link-back-script-b(/:query)"
            }
        );
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    /**
     * イベントハンドラのマッピング。
     * CSS セレクタにマッチした要素にイベントハンドラを自動でセットされる。
     */
    events(): any {
        return {
            "vclick #subflow-b-btn-1": this.onButton1,
            "vclick #subflow-b-btn-2": this.onButton2,
            "vclick #subflow-b-btn-3": this.onButton3,
        };
    }

    //! 描画
    render(): PageView {
        return this;
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    private onButton1(event: JQuery.Event): void {
        console.log(TAG + "onButton1()");
        event.preventDefault();
        if (this._otherMode) {
            Router.navigate(null, "platform-default", true, { subFlow: { operation: "end" } });
        } else {
            const subFlow: SubFlowParam = {
                operation: "begin",
                destBase: "#link-back-script-a",
            };
            Router.navigate("#link-back-script-a/other", "platform-default", false, { subFlow: subFlow });
        }
    }

    private onButton2(event: JQuery.Event): void {
        console.log(TAG + "onButton2()");
        event.preventDefault();
        Router.navigate("#link-back-script-a/other", "platform-default", false, { subFlow: { operation: "begin" } });
    }

    private onButton3(event: JQuery.Event): void {
        console.log(TAG + "onButton3()");
        event.preventDefault();
        const subFlow: SubFlowParam = {
            operation: "begin",
            destBase: "#link-back-root",
            destStacks: [
                {
                    route: "#link-back-script-c",
                    transition: "platform-default",
                }
            ],
        };
        Router.navigate("#link-back-script-a/other", "platform-default", false, { subFlow: subFlow });
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageView

    onPageBeforeHide(event: JQuery.Event, data?: HideEventData): void {
        const fromHashChanged = Router.fromHashChanged();
        const isInSubFlow = Router.isInSubFlow();
        console.log(TAG + "onPageBeforeHide()");
        console.log(TAG + "\tFrom Hash Changed: " + fromHashChanged);
        console.log(TAG + "\tIs in Sub Flow: " + isInSubFlow);
    }

    onPageBeforeShow(event: JQuery.Event, data?: ShowEventData): void {
        console.log(TAG + "onPageBeforeShow()");
        const params = Router.getQueryParameters();
        if (params && params[0][0] === "other") {
            this._otherMode = true;
        } else {
            this._otherMode = false;
        }
        this.stateChange();
    }

    onPageInit(event: JQuery.Event): void {
        console.log(TAG + "onPageInit()");
    }

    onPageRemove(event: JQuery.Event): void {
        console.log(TAG + "onPageRemove()");
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    private stateChange(): void {
        if (this._otherMode) {
            this.$page.page({ theme: "a" });
            this.$header.find("h1").text($.t("page-example-link-back.titleScriptB'"));
            this.$page.find("h3").text($.t("page-example-link-back.description-subflow-B'"));
            this.$page.find("#subflow-b-btn-1").val($.t("page-example-link-back.endSubFlow")).button("refresh");
            this.$page.find("#subflow-b-btn-2").parent().css("display", "none");
            this.$page.find("#subflow-b-btn-3").parent().css("display", "none");
        } else {
            this.$page.page({ theme: "b" });
            this.$header.find("h1").text($.t("page-example-link-back.titleScriptB"));
            this.$page.find("h3").text($.t("page-example-link-back.description-subflow-B"));
            this.$page.find("#subflow-b-btn-1").val($.t("page-example-link-back.beginSubFlowDestA")).button("refresh");
            this.$page.find("#subflow-b-btn-2").parent().css("display", "block");
            this.$page.find("#subflow-b-btn-3").parent().css("display", "block");
        }
    }
}

registerPage(AdvancedControlBackViewB);
