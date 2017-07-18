import {
    IPromiseBase,
    IPromise,
    Promise,
    PromiseManager,
    toUrl,
} from "cdp/framework";
import { DateTime } from "cdp/tools";
import {
    ItemGenerator,
    ItemListGenerator,
} from "cafeteria.images";
import { API, ContentProvider } from "./interfaces";
import { EventSource } from "./event-source";

/**
 * @class StubDashboard
 * @brief Dashboard を扱う StubDataProvider
 */
export default class StubDashboard extends EventSource implements ContentProvider.IDashboardProvider {

    private _loadCount: number = 0;
    private _recallItems: API.ItemsInfo = null;
    private _prmsManager: PromiseManager = null;

    /**
     * constructor
     */
    constructor() {
        super(StubDashboard);
        this._recallItems = ItemGenerator.loadJSON(toUrl("/res/data/sample/image/recallplayback.json"));
        this._prmsManager = new PromiseManager();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: IDashboardProvider

    // データ取得 (RecallPlayback)
    queryRecallPlaybackData(): IPromise<API.Recall.RecallInfo> {
        return new Promise((resolve, reject) => {
            let items: API.ItemInfo[];

            setTimeout(() => {
                this._prmsManager.add(ItemListGenerator.generate(30, 30, (item: API.ItemInfo, index: number) => {
                    const date = DateTime.convertISOStringToDate(item.recorded_date);
                    item.recorded_date =
                        item.uploaded_date =
                        DateTime.convertDateToISOString(DateTime.computeDate(date, -index));
                }))
                    .progress((data: API.ItemInfo[]) => {
                        items = data;
                    })
                    .then(() => {
                        const item: API.Recall.RecallInfo = <API.Recall.RecallInfo>$.extend(true, {}, this._recallItems);
                        item.items = items;
                        resolve(item);
                    })
                    .fail(() => {
                        console.error("Data.ItemListGenerator.create(30), failed.");
                        reject();
                    });
            });
        });
    }

    // Top Contents の取得
    queryTopContents(): IPromise<ContentProvider.TopContent[]> {
        return new Promise((resolve) => {
            let topContent: ContentProvider.TopContent[] = [];
            const odd = this._loadCount % 2;

            this._loadCount++;

            setTimeout(() => {
                topContent = [
                    {
                        hasContents: false,
                        url: toUrl("/res/data/sample/image/pmo/nodpi/gmenu_all.png"),
                    },
                    {
                        hasContents: false,
                        url: toUrl("/res/data/sample/image/pmo/nodpi/gmenu_mylists.png"),
                    },
                    {
                        hasContents: false,
                        url: toUrl("/res/data/sample/image/pmo/nodpi/gmenu_postcards.png"),
                    },
                    {
                        hasContents: false,
                        url: toUrl("/res/data/sample/image/pmo/nodpi/gmenu_photobooks.png"),
                    },
                    {
                        hasContents: false,
                        url: toUrl("/res/data/sample/image/pmo/nodpi/gmenu_friends.png"),
                    },
                ];

                // コンテンツがあるときのエミュレート
                if (0 < odd) {
                    topContent[0].hasContents = true;
                    topContent[0].url = ItemGenerator.create().thumbnail[0].location;
                }

                resolve(topContent);
            }, 250);
        });
    }

    // query をキャンセル
    cancel(): IPromiseBase<any> {
        return this._prmsManager.cancel();
    }

    // 管理対象のキャッシュをクリア
    clear(): IPromiseBase<any> {
        this._loadCount = 0;
        return this.cancel();
    }

    // 一度に query するサイズ
    get querySize(): number {
        return 30; // for RecallPlayback
    }
}
