import { Router, SubFlowParam } from "cdp/framework";
import {
    PageView,
    ShowEventData,
    HideEventData,
    registerPage,
} from "cdp/ui";

const TAG = "[view.link-sample.AdvancedControlBackViewA] ";

/**
 * @class AdvancedControlBackViewA
 * @brief [戻る]制御のための View Root クラス
 */
class AdvancedControlBackViewA extends PageView {

    private _otherMode: boolean = false;

    /**
     * constructor
     */
    constructor() {
        super("/templates/link-sample/link-back-script-a.html",
            "link-back-script-a",
            {
                route: "link-back-script-a(/:query)"
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
            "vclick #subflow-a-btn-1": this.onButton1,
            "vclick #subflow-a-btn-2": this.onButton2,
            "vclick #subflow-a-btn-3": this.onButton3,
            "vclick #subflow-a-btn-4": this.onButton4,
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
        let route = "#link-back-script-b";
        if (this._otherMode) {
            route += "/other";
        }
        Router.navigate(route, "platform-default", false);
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
            destStacks: [
                {
                    route: "#link-back-script-b",
                    transition: "platform-default",
                }
            ],
        };
        Router.navigate("#link-back-script-a/other", "platform-default", false, { subFlow: subFlow });
    }

    private onButton4(event: JQuery.Event): void {
        console.log(TAG + "onButton4()");
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
        const params = Router.getQueryParameters();
        if (params && params[0][0] === "other") {
            this._otherMode = true;
        } else {
            this._otherMode = false;
        }
        this.stateChange();
        /* tslint:disable:no-string-literal */
        this.intent.params["other"] = this._otherMode;
        /* tslint:enable:no-string-literal */
        this.intent = this.intent;    // update 属性を true にするため
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
            this.$header.find("h1").text($.t("page-example-link-back.titleScriptA'"));
            this.$page.find("h3").text($.t("page-example-link-back.description-subflow-A'"));
            this.$page.find("#subflow-a-btn-1").val($.t("page-example-link-back.toPageScriptB'")).button("refresh");
            this.$page.find("#subflow-a-btn-2").parent().css("display", "none");
            this.$page.find("#subflow-a-btn-3").parent().css("display", "none");
            this.$page.find("#subflow-a-btn-4").parent().css("display", "none");
        } else {
            this.$page.page({ theme: "b" });
            this.$header.find("h1").text($.t("page-example-link-back.titleScriptA"));
            this.$page.find("h3").text($.t("page-example-link-back.description-subflow-A"));
            this.$page.find("#subflow-a-btn-1").val($.t("page-example-link-back.toPageScriptB")).button("refresh");
            this.$page.find("#subflow-a-btn-2").parent().css("display", "block");
            this.$page.find("#subflow-a-btn-3").parent().css("display", "block");
            this.$page.find("#subflow-a-btn-4").parent().css("display", "block");
        }
    }
}

registerPage(AdvancedControlBackViewA);
