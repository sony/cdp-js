import {
    IPromise,
    Orientation,
    getOrientation,
} from "cdp/framework";
import {
    TabView,
    TabViewConstructionOptions,
    TabHostView,
} from "cdp/ui";
import ImageContent from "../../model/image-content";
import {
    ImageContentCollection,
    ImageContentResponse,
} from "../../model/image-content-collection";
import {
    AssetsContentListItemView,
} from "./tab-assets-content-listitem-view";

const TAG = "[view.tabviews-sample.AssetsContentListView] ";

const LINE_ITEM_MAX_COUNT       = 12;
const POST_RENDER_PROC_INTERVAL = 240;
const BP_GRID_SMALL_MIN         = 420;
const BP_GRID_MID_MIN           = 720;
const PROC_LOOP_THRESHOLD       = 50;

/**
 * @interface AssetsContentListViewOptions
 * @brief AssetsContentListView の構築オプション
 */
export interface AssetsContentListViewOptions extends TabViewConstructionOptions<ImageContent> {
}

//___________________________________________________________________________________________________________________//

/**
 * @class AssetsContentListView
 * @brief アセット画像用リスト一覧 View クラス.
 */
export class AssetsContentListView extends TabView<ImageContent> {

    private _promise: IPromise<any> = null;

    /**
     * constructor
     */
    constructor(options: AssetsContentListViewOptions) {
        super(options);
        this.listenTo(this.collection, "sync", this.onSync);
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handlers:

    // events binding
    events(): any {
        return {
            "click .command-content-selected": this.onContentSelected, // "-webkit-overflow-scrolling: touch" と干渉するため "click" を使用
        };
    }

    // コンテンツの選択
    private onContentSelected(event: JQueryEventObject): void {
        event.preventDefault();
        const contentIndex = $(event.target).data("content-index");
        const target = this.collection.at(contentIndex);
        (<any>this.host).onContentSelected(target, "assets");
    }

    ///////////////////////////////////////////////////////////////////////
    // Implements: TabView Events.

    // Scroller の初期化時にコールされる
    onInitialize(host: TabHostView, $root: JQuery): void {
        super.onInitialize(host, $root);
        this.render(this.collection.models);
    }

    /**
     * Orientation の変更を受信
     *
     * @param newOrientation {Orientation} [in] new orientation code.
     */
    onOrientationChanged(newOrientation: Orientation): void {
        super.onOrientationChanged(newOrientation);
        if (this._promise) {
            this._promise.abort();
            this._promise = null;
        }
        const pos = this.getScrollPos();
        if (!this.restore(this.getBackupKey(newOrientation))) {
            this.release();
            this.render(this.collection.models);
        }
        this.scrollTo(pos);
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    // 描画
    render(models?: ImageContent[]): AssetsContentListView {
        if (this.$el) {
            if (models && models.length) {
                const baseSize = $(window).width();
                const works = models.slice();

                // 処理に時間がかかるときメッセージループに制御を戻す
                const startTime = Date.now();

                const postRenderProc = (next: ImageContent[]) => {
                    this.update();
                    setTimeout(() => {
                        this.render(next);
                    }, POST_RENDER_PROC_INTERVAL);
                };

                while (0 < works.length) {
                    const lineModels = [];
                    for (let i = 0; i < LINE_ITEM_MAX_COUNT; i++) {
                        lineModels.push(works.shift());
                        if (works.length <= 0) {
                            break;
                        }
                    }
                    // ListItemView を追加
                    this.addItem(
                        this.getBaseHeight(baseSize, lineModels.length),
                        AssetsContentListItemView, {
                            models: lineModels,
                        });

                    // 閾値判定による中断
                    if (Date.now() - startTime > PROC_LOOP_THRESHOLD) {
                        postRenderProc(works);
                        return this;
                    }
                }
                this.update();
            }

            if (!this.fetch()) {
                // orientation change に備えて layout をバックアップ
                this.backup(this.getBackupKey(getOrientation()));
            }
        }

        return this;
    }

    // 破棄
    remove(): AssetsContentListView {
        if (this._promise) {
            this._promise.abort();
            this._promise = null;
        }
        return <AssetsContentListView>super.remove();
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    // アイテム設定
    private onSync(collection: ImageContentCollection, resp: ImageContentResponse, options: any): void {
        this.render(collection.models);
    }

    // fetch 開始
    private fetch(): boolean {
        const collection = <ImageContentCollection>this.collection;
        if (collection.length !== collection.totalCount) {
            if (!this._promise) {
                this._promise = <any>collection.fetch({
                    queryIndex: collection.length,
                    autoFetch: true,
                });
            }
            return true;
        } else {
            this._promise = null;
            return false;
        }
    }

    // 基準の高さを取得
    private getBaseHeight(baseSize: number, itemCount: number): number {
        let itemHeight: number;
        let lineCount: number;

        if (baseSize <= BP_GRID_SMALL_MIN) {
            itemHeight = baseSize / 2;
            lineCount = Math.ceil(itemCount / 2);
        } else if (baseSize <= BP_GRID_MID_MIN) {
            itemHeight = baseSize / 3;
            lineCount = Math.ceil(itemCount / 3);
        } else {
            itemHeight = baseSize / 4;
            lineCount = Math.ceil(itemCount / 4);
        }

        return itemHeight * lineCount;
    }

    // backup key を取得
    private getBackupKey(orientation: Orientation): string {
        switch (orientation) {
            case Orientation.PORTRAIT:
                return "layout-assets-portrait";
            case Orientation.LANDSCAPE:
                return "layout-assets-landscape";
            default:
                console.warn("unknown orientation: " + orientation);
                return "layout-assets-portrait";
        }
    }
}
