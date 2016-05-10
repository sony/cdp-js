import { IPromise, PromiseManager, makePromise } from "cdp";
import { ShowEventData, HideEventData } from "cdp/framework";
import { toZeroPadding } from "cdp/tools";
import {
    BasePageView,
    PageExpandableListView,
    GroupProfile,
    ScrollerNative,
    Toast,
} from "cdp/ui";
import { ItemInfo, ItemInfoGroup, DataUtil } from "tests/app/scripts/Model/ListView/DataUtil";
import { ListViewConfig as _Config } from "tests/app/scripts/Model/ListView/Config";
import { SimpleListItemView } from "tests/app/scripts/View/ListView/SimpleListItemView";
import { ExpandListItemViewPreview, ExpandListItemViewExtra } from "tests/app/scripts/View/ListView/ExpandListItemView";

const TAG: string = "[View/ListView/PageExpandListView] ";

/**
 * @class PageExpandListView
 * @brief Native View スクロールを使用した PageExpandableListView のサンプル実装クラス
 */
class PageExpandListView extends PageExpandableListView<Backbone.Model> {

    private _prmsManager: PromiseManager = null;

    /**
     * constructor
     */
    constructor() {
        super("/templates/listviews/page-expandable-listview.html"
            , "page-example-page-expandable-listview"
            , {
                route: "page-expandable-listview",
                scrollerFactory: ScrollerNative.getFactory(),
                animationDuration: _Config.COLLAPSE_DELAY_TIME,
                baseDepth: "0",
            });
        this._prmsManager = new PromiseManager();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: PageListView

    //! jQM event: "pagebeforeshow" に対応
    onPageBeforeShow(event: JQueryEventObject, data?: ShowEventData): void {
        super.onPageBeforeShow(event, data);
        this.load();
    }

    //! jQM event: "pagebeforehide" に対応
    onPageBeforeHide(event: JQueryEventObject, data?: HideEventData): void {
        super.onPageBeforeHide(event, data);
        this._prmsManager.cancel();
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    //! イベントハンドラのマッピング
    events(): any {
        return {
            "vclick .simple-listitem": this.onTopGroupClick,
            "vclick nav.expand-button.to-expand.enable": this.onExpand,
            "vclick nav.expand-button.to-collapse.enable": this.onCollapse,
        };
    }

    //! Top Group のイベントハンドラ
    private onTopGroupClick(event: JQueryEventObject): void {
        let devId = $(event.currentTarget).data("dev-id");
        let devIndex = this.getItemInfo(event).devIndex;
        let $spinner: JQuery;
        let status = "operation:" + devId;
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

    //! 開閉ボタン のイベントハンドラ
    private onExpand(event: JQueryEventObject): void {
        let $target = $(event.currentTarget);
        let devId = $target.data("dev-id");
        let status = "operation:" + devId;
        event.preventDefault();

        if (!this.isStatusIn(status)) {
            this.statusScope(status, () => {
                let group = this.getGroup(devId);
                group.expand();
                $target.removeClass("to-expand").addClass("to-collapse");
                $target = null;
            });
        }
    }

    //! 開閉ボタン のイベントハンドラ
    private onCollapse(event: JQueryEventObject): void {
        let $target = $(event.currentTarget);
        let devId = $target.data("dev-id");
        let status = "operation:" + devId;
        event.preventDefault();

        if (!this.isStatusIn(status)) {
            this.statusScope(status, () => {
                let group = this.getGroup(devId);
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

    //! データ取得
    private load(): void {
        this._prmsManager.add(this.queryTopGroups())
            .progress((group: GroupProfile) => {
                this.registerTopGroup(group);
                this.update();
            })
            .then(() => {
                Toast.show($.t("page-example-listview.loadComplete"));
            });
    }

    //! Top Group を取得
    private queryTopGroups(): IPromise<GroupProfile> {
        let df = $.Deferred();
        let promise = makePromise(df);
        let index = 0;

        promise.dependOn(DataUtil.queryItemInfoList())
            .progress((items: ItemInfo[]) => {
                let baseHeight = 100; // TBD
                let initializer = SimpleListItemView;    // コンストラクタを指定
                let group: GroupProfile;
                let devId = items[0].item_id;

                group = this.newGroup(devId);
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

    //! Sub Group を取得
    private querySubGroups(devId: string, parentIndex: number): IPromise<GroupProfile[]> {
        let df = $.Deferred();
        let promise = makePromise(df);
        let prevIndex = 0;

        promise.dependOn(DataUtil.queryItemInfoGroupList())
            .then((data: ItemInfoGroup[]) => {
                let groups: GroupProfile[] = [];

                let proc = () => {
                    let groupInfo: ItemInfoGroup;
                    let groupPreview: GroupProfile;
                    let groupsExtra: GroupProfile[] = [];
                    let baseHeight = 80; // TBD
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
                                let items = groupInfo.extra.splice(0, _Config.UNIT_COUNT);
                                let extraId = prevId + "-extra-" + items[0].item_id;
                                let extraFormatIndex = prevFormatIndex + "-" + toZeroPadding(extraIndex, 2);
                                let extra = this.newGroup(extraId);
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

let _viewPageExpandListView: BasePageView = new PageExpandListView();
