import { toZeroPadding } from "cdp/tools";
import {
    IPromise,
    makePromise,
    PromiseManager,
    PageExpandableListView,
    ShowEventData,
    HideEventData,
    registerPage,
    ScrollerNative,
    GroupProfile,
    Toast,
} from "cdp/ui";
import * as Config from "../../model/listviews-sample/config";
import {
    ItemInfo,
    queryItemInfoList,
    ItemInfoGroup,
    queryItemInfoGroupList,
} from "../../model/listviews-sample/util";
import SimpleListItemView from "./simple-listitem-view";
import {
    ExpandListItemViewPreview,
    ExpandListItemViewExtra,
} from "./expand-listitem-view";

const TAG = "[view.listviews-sample.PageExpandListView] ";

/**
 * @class PageExpandListView
 * @brief Native View スクロールを使用した PageExpandableListView のサンプル実装クラス
 */
class PageExpandListView extends PageExpandableListView {

    private _prmsManager: PromiseManager = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/listviews-sample/page-expandable-listview.html",
            "page-expandable-listview",
            {
                route: "listviews/pagelistview/expandable",
                scrollerFactory: ScrollerNative.getFactory(),
                animationDuration: Config.COLLAPSE_DELAY_TIME,
                baseDepth: "0",
            });
        this._prmsManager = new PromiseManager();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageListView

    // jQM event: "pagebeforeshow" に対応
    onPageBeforeShow(event: JQuery.Event, data?: ShowEventData): void {
        super.onPageBeforeShow(event, data);
        this.load();
    }

    // jQM event: "pagebeforehide" に対応
    onPageBeforeHide(event: JQuery.Event, data?: HideEventData): void {
        super.onPageBeforeHide(event, data);
        this._prmsManager.cancel();
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    // イベントハンドラのマッピング
    events(): any {
        return {
            "vclick .simple-listitem": this.onTopGroupClick,
            "vclick nav.expand-button.to-expand.enable": this.onExpand,
            "vclick nav.expand-button.to-collapse.enable": this.onCollapse,
        };
    }

    // Top Group のイベントハンドラ
    private onTopGroupClick(event: JQuery.Event): void {
        const devId = $(event.currentTarget).data("dev-id");
        const devIndex = this.getItemInfo(event).devIndex;
        const status = "operation:" + devId;
        let $spinner: JQuery;
        event.preventDefault();

        if (!this.isStatusIn(status)) {
            this.statusScope(status, () => {
                let group: GroupProfile;
                group = this.getGroup(devId);
                if (null == group) {
                    console.error(TAG + "logic error. dev-id is not registered. [dev-id: " + devId + "]");
                } else if (group.hasChildren()) {
                    group.toggle();
                    if (group.isExpanded()) {
                        group.ensureVisible({ setTop: true });
                    }
                } else {
                    $spinner = $(event.currentTarget).find(".spinner");
                    $spinner.addClass("show");
                    this.statusAddRef(status);
                    this._prmsManager.add(this.querySubGroups(devId, devIndex))
                        .then((groups: GroupProfile[]) => {
                            group.addChildren(groups);
                            group.expand();
                            group.ensureVisible({ setTop: true });
                        })
                        .always(() => {
                            this.statusRelease(status);
                            $spinner.removeClass("show");
                            $spinner = null;
                        });
                }
            });
        }
    }

    // 開閉ボタン のイベントハンドラ
    private onExpand(event: JQuery.Event): void {
        let $target = $(event.currentTarget);
        const devId = $target.data("dev-id");
        const status = "operation:" + devId;
        event.preventDefault();

        if (!this.isStatusIn(status)) {
            this.statusScope(status, () => {
                const group = this.getGroup(devId);
                group.expand();
                $target.removeClass("to-expand").addClass("to-collapse");
                $target = null;
            });
        }
    }

    // 開閉ボタン のイベントハンドラ
    private onCollapse(event: JQuery.Event): void {
        let $target = $(event.currentTarget);
        const devId = $target.data("dev-id");
        const status = "operation:" + devId;
        event.preventDefault();

        if (!this.isStatusIn(status)) {
            this.statusScope(status, () => {
                const group = this.getGroup(devId);
                this.statusAddRef(status);
                group.ensureVisible({
                    partialOK: false,
                    callback: () => {
                        group.collapse();
                        this.statusRelease(status);
                    },
                });
                $target.removeClass("to-collapse").addClass("to-expand");
                $target = null;
            });
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    // データ取得
    private load(): void {
        this._prmsManager.add(this.queryTopGroups())
            .progress((group: GroupProfile) => {
                this.registerTopGroup(group);
                this.update();
            })
            .then(() => {
                Toast.show($.t("listviews.loadComplete"));
            });
    }

    // Top Group を取得
    private queryTopGroups(): IPromise<GroupProfile> {
        const df = $.Deferred();
        const promise = makePromise(df);
        let index = 0;

        promise.dependOn(queryItemInfoList())
            .progress((items: ItemInfo[]) => {
                const baseHeight = 100;
                const initializer = SimpleListItemView;    // コンストラクタを指定
                const devId = items[0].item_id;

                const group = this.newGroup(devId);
                group.addItem(baseHeight, initializer, {
                    devId: devId,
                    items: items,
                    devIndex: index,
                });
                index++;

                df.notify(group);
            })
            .then(() => {
                df.resolve();
            });

        return promise;
    }

    // Sub Group を取得
    private querySubGroups(devId: string, parentIndex: number): IPromise<GroupProfile[]> {
        const df = $.Deferred();
        const promise = makePromise(df);
        let prevIndex = 0;

        promise.dependOn(queryItemInfoGroupList())
            .then((data: ItemInfoGroup[]) => {
                const groups: GroupProfile[] = [];

                const proc = () => {
                    let groupInfo: ItemInfoGroup;
                    let groupPreview: GroupProfile;
                    const groupsExtra: GroupProfile[] = [];
                    const baseHeight = 80;
                    let prevId: string;
                    let prevFormatIndex: string;

                    if (df.state() !== "pending") {
                        return;
                    }

                    if (data.length <= 0) {
                        df.resolve(groups);
                    } else {
                        groupInfo = data.shift();
                        (() => {
                            prevId = devId + "-preview-" + groupInfo.preview[0].item_id;
                            prevFormatIndex = toZeroPadding(parentIndex, 3) + ":" + prevIndex;
                            prevIndex++;
                            groupPreview = this.newGroup(prevId);
                            groupPreview.addItem(baseHeight, ExpandListItemViewPreview, {
                                devId: prevId,
                                items: groupInfo.preview,
                                parentIndex: parentIndex,
                                devIndex: prevFormatIndex + "-00",
                            });
                        })();
                        (() => {
                            let extraIndex = 1;
                            while (0 < groupInfo.extra.length) {
                                const items = groupInfo.extra.splice(0, Config.UNIT_COUNT);
                                const extraId = prevId + "-extra-" + items[0].item_id;
                                const extraFormatIndex = prevFormatIndex + "-" + toZeroPadding(extraIndex, 2);
                                const extra = this.newGroup(extraId);
                                extra.addItem(baseHeight, ExpandListItemViewExtra, {
                                    devId: extraId,
                                    items: items,
                                    parentIndex: parentIndex,
                                    devIndex: extraFormatIndex,
                                });
                                groupsExtra.push(extra);
                                extraIndex++;
                            }
                        })();
                        groupPreview.addChildren(groupsExtra);
                        groups.push(groupPreview);
                        setTimeout(proc);
                    }
                };
                setTimeout(proc);
            });

        return promise;
    }
}

registerPage(PageExpandListView);
