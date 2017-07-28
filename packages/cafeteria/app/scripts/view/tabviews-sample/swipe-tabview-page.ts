/* tslint:disable:no-bitwise */

import {
    PageView,
    registerPage,
    ShowEventData,
    TabHostView,
} from "cdp/ui";
import { LocalContentCollection } from "../../model/local-content-collection";
import { SwipeableTabHostView } from "./swipe-tab-host-view";

const TAG = "[view.tabviews-sample.SwipeableTabViewPage] ";

/**
 * @class SwipeableTabViewPage
 * @brief TabHostView のオーナー Page クラス
 */
class SwipeableTabViewPage extends PageView {

    private _$tabHighLight: JQuery;
    private _tabHostView: SwipeableTabHostView;
    private _lastActiveTabIndex = 0;
    private _localContentCollection: LocalContentCollection;

    /**
     * constructor
     */
    constructor() {
        super("/templates/tabviews-sample/swipeable-tabview.html",
            "swipeable-tabview",
            {
                route: "tabviews/swipeable-tabview"
            }
        );
        this._localContentCollection = new LocalContentCollection("localcontent");
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handlers:

    // events binding
    events(): any {
        return {
            "vclick .command-switch-content": this.onSwitchContent,
        };
    }

    // タブの切り替え選択
    private onSwitchContent(event: JQueryEventObject): void {
        const tabIndex: number = ~~$(event.currentTarget).data("tab-index");
        event.preventDefault();
        this._tabHostView.setActiveTab(tabIndex);
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageView

    // jQM event: "pagebeforeshow" に対応
    onPageBeforeShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageBeforeShow(event, data);

        this._$tabHighLight = this.$header.find(".tab-link-highlight");
        const $tabContainer = this.$page.find(".tab-container");
        const initialHeight = this.$el.height() - parseInt($tabContainer.css("top"), 10)

        this._tabHostView = new SwipeableTabHostView({
            $el: $tabContainer,
            owner: this,
            initialHeight: initialHeight,
            localContentCollection: this._localContentCollection,
            textileCollection: new LocalContentCollection("textile"),
        });
        this._tabHostView.on(TabHostView.EVENT_TAB_MOVE, this.onTabMoving.bind(this));
        this._tabHostView.on(TabHostView.EVENT_TAB_STOP, this.onTabChanged.bind(this));

        this._tabHostView.setActiveTab(this._lastActiveTabIndex);
    }

    // $el の高さが決まってから処理する必要があるため、onPageShow() をハンドリング
    onPageShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageShow(event, data);
        //this._listViewElement = new SimpleListView({
        //    el: this.$page.find("#sample-listview-element"),
        //    scrollerFactory: ScrollerElement.getFactory(),
        //    //          itemTagName: "li",    // display: block の指定も必要
        //});
    }

    onPageRemove(event: JQuery.Event): void {
        if (this._tabHostView) {
            this._lastActiveTabIndex = this._tabHostView.getActiveTabIndex();
            this._tabHostView.remove();
            this._tabHostView = null;
        }
        this._$tabHighLight = null;
        super.onPageRemove(event);
    }

    ///////////////////////////////////////////////////////////////////////
    // callback

    // flip 中にコールされる
    private onTabMoving(delta: number): void {
        this.$page.addClass("swiping");
        this.updateTabHighlight(this._tabHostView.getActiveTabIndex());
    }

    // flip 終了時にコールされる
    private onTabChanged(newIndex: number, moved: boolean): void {
        this.$page.removeClass("swiping");
        console.log("newIndex:" + newIndex);
        this.updateTabHighlight(newIndex);
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods: layout 用

    //! Page 表示前に Page の高さと ListView を調整する.
    private adjustListViewHeight($prevPage: JQuery): number {
        let $header = $prevPage.find("[data-role='header']");
        let headerHeight: number = $header.height() + parseInt($header.css("padding-top"), 10);
        let pageHeight = $prevPage.height();

        // 表示に先駆けて page の高さを合わせる
        this.$el.height(pageHeight);

        return this.$el.height() - headerHeight;
    }

    // tab highlight ポジションの更新
    private updateTabHighlight(index: number): void {
        const CSS_PREFIXES = ["-webkit-", ""];
        if (this._$tabHighLight) {
            const tabNum = this._tabHostView.getTabCount();
            const pos = (index * this.$page.width() / tabNum) - (this._tabHostView.getSwipeDelta() / tabNum);
            const transform = {};
            for (let i = 0; i < CSS_PREFIXES.length; i++) {
                transform[CSS_PREFIXES[i] + "transform"] = "translate3d(" + pos + "px, 0px, 0px)";
            }
            //console.log("POS: " + pos);
            console.log("  INDEX: " + index);
            this._$tabHighLight.css(transform);
        }
    }
}

registerPage(SwipeableTabViewPage);
