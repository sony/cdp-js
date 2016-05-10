import { ListViewConfig as _Config } from "tests/app/scripts/Model/ListView/Config";
import { ItemInfo } from "tests/app/scripts/Model/ListView/DataIF";
import { ItemListGenerator } from "tests/app/scripts/Model/ListView/ItemGenerator";

const TAG: string = "[Model/ListView/DataUtil] ";

/**
 * @interface ItemInfoGroup
 * @brief Group 化された ItemInfo のインターフェイス
 */
export interface ItemInfoGroup {
    preview: ItemInfo[];    // 1 - 5
    extra: ItemInfo[];      // 0 - 40
}

// re-export
export { ItemInfo };

/**
 * @class DataUtil
 * @brief Data 取得ユーティリティ
 */
export module DataUtil {

    ///////////////////////////////////////////////////////////////////////
    // public static methods

    //! ItemInfo を生成
    export function queryItemInfoList(): CDP.IPromise<ItemInfo[]> {
        let df = $.Deferred();
        let promise = CDP.makePromise(df);

        loadModules()
            .then(() => {
                promise.dependOn(ItemListGenerator.generate(_Config.LIMIT_ITEMINFO_LIST_IMAGE_COUNT, _Config.UNIT_COUNT))
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

    //! ItemInfo を生成 (Group 用)
    export function queryItemInfoGroupList(): CDP.IPromise<ItemInfoGroup[]> {
        let df = $.Deferred();
        let promise = CDP.makePromise(df);

        let itemGroup: ItemInfoGroup[] = [];
        let groupCount = Math.floor(Math.random() * (_Config.LIMIT_ITEMGROUPINFO_LIST_COUNT - 1)) + 1;

        loadModules()
            .then(() => {
                let proc = () => {
                    let imageCount: number;
                    let images: ItemInfo[];
                    if (groupCount <= 0) {
                        df.resolve(itemGroup);
                    } else {
                        groupCount--;
                        imageCount = Math.floor(Math.random() * (_Config.LIMIT_ITEMGROUPINFO_IMAGE_COUNT - 1)) + 1;
                        promise.dependOn(ItemListGenerator.generate(imageCount))
                            .progress((data: ItemInfo[]) => {
                                images = data;
                            })
                            .then(() => {
                                let groupInfo: ItemInfoGroup = {
                                    preview: images.slice(0, _Config.UNIT_COUNT),
                                    extra: images.slice(_Config.UNIT_COUNT),
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

        return promise;
    }

    ///////////////////////////////////////////////////////////////////////
    // private static methods

    //! app.data をロード
    function loadModules(): JQueryPromise<void> {
        let df = $.Deferred<void>();
        setTimeout(() => {
            df.resolve();
        });
        return df.promise();
    }

    //! エラーハンドラ
    function handleError(error: any): void {
        let msg = TAG;
        if (error && "abort" === error.message) {
            msg += "ItemListGenerator.generate, canceled.";
            console.log(msg);
        } else {
            msg += "ItemListGenerator.generate, failed.";
            console.error(msg);
        }
    }
}
