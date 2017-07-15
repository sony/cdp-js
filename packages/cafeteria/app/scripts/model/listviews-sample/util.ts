import {
    IPromise,
    makePromise,
} from "cdp/framework";
import { Toast } from "cdp/ui";
import {
    ItemInfo,
    ItemListGenerator,
} from "cafeteria.images";
import * as Config from "./config";

const TAG = "[model.listview-sample.DataUtil] ";

// re-export
export { ItemInfo };

/**
 * @interface ItemInfoGroup
 * @brief Group 化された ItemInfo のインターフェイス
 */
export interface ItemInfoGroup {
    preview: ItemInfo[];    // 1 - 5
    extra: ItemInfo[];      // 0 - 40
}

/**
 * @file Data 取得ユーティリティ
 */

///////////////////////////////////////////////////////////////////////
// public static methods

// ItemInfo を生成
export function queryItemInfoList(): IPromise<ItemInfo[]> {
    const df = $.Deferred();
    const promise = makePromise(df);

    loadModules()
        .then(() => {
            promise.dependOn(ItemListGenerator.generate(Config.LIMIT_ITEMINFO_LIST_IMAGE_COUNT, Config.UNIT_COUNT))
                .progress((data: ItemInfo[]) => {
                    df.notify(data);
                })
                .then(() => {
                    df.resolve();
                })
                .fail((error: any) => {
                    handleError(error);
                });
        });

    return promise;
}

// ItemInfo を生成 (Group 用)
export function queryItemInfoGroupList(): IPromise<ItemInfoGroup[]> {
    // [NOTE] async- await を使用する場合、Top Level に Promise import は不可
    return new CDP.Promise((resolve, reject, dependOn) => {
        const itemGroup: ItemInfoGroup[] = [];
        let groupCount = Math.floor(Math.random() * (Config.LIMIT_ITEMGROUPINFO_LIST_COUNT - 1)) + 1;

        loadModules()
            .then(() => {
                const proc = () => {
                    let imageCount: number;
                    let images: ItemInfo[];
                    if (groupCount <= 0) {
                        resolve(itemGroup);
                    } else {
                        groupCount--;
                        imageCount = Math.floor(Math.random() * (Config.LIMIT_ITEMGROUPINFO_IMAGE_COUNT - 1)) + 1;
                        dependOn(ItemListGenerator.generate(imageCount))
                            .progress((data: ItemInfo[]) => {
                                images = data;
                            })
                            .then(() => {
                                const groupInfo: ItemInfoGroup = {
                                    preview: images.slice(0, Config.UNIT_COUNT),
                                    extra: images.slice(Config.UNIT_COUNT),
                                };
                                itemGroup.push(groupInfo);
                                setTimeout(proc);
                            })
                            .fail((error: any) => {
                                handleError(error);
                            });
                    }
                };
                setTimeout(proc);
            });
    });
}

///////////////////////////////////////////////////////////////////////
// private static methods

// "cafeteria.images" をロード
async function loadModules(): Promise<void> {
    await import("cafeteria.images");
}

// エラーハンドラ
function handleError(error: any): void {
    let msg = TAG;
    if (error && "abort" === error.message) {
        msg += "Data.ItemListGenerator.generate, canceled.";
        console.log(msg);
    } else {
        msg += "Data.ItemListGenerator.generate, failed.";
        console.error(msg);
    }
    Toast.show(msg);
}
