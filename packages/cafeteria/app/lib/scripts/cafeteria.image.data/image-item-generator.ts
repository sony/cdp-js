import { IPromise, makePromise, toUrl } from "cdp/framework";
import { DateTime, toZeroPadding } from "cdp/tools";
import { ItemInfo } from "./image-interface";

const TAG = "[cafeteria.ItemGenerator] ";

let _id: number = 0;

/**
 * @class ItemGenerator
 * @brief ダミー item を生成するユーティリティクラス
 */
export class ItemGenerator {

    private static s_schemaSource: object = null;
    private static s_schemaItem: object = null;
    private static s_schemaMetaData: object = null;
    private static s_schemaThumbnail: object = null;

    ///////////////////////////////////////////////////////////////////////
    // public static method

    /**
     * Item を 1つ生成
     *
     * @returns ItemInfo オブジェクト
     */
    public static create(): ItemInfo {
        let item: ItemInfo;

        ItemGenerator.loadSchema();
        if (!ItemGenerator.s_schemaSource) {
            console.error("Please setup 'sample' folder under 'res'");
        }

        item = $.extend(true, {}, ItemGenerator.s_schemaItem);
        item.metadata = $.extend(true, {}, ItemGenerator.s_schemaMetaData);
        item.thumbnail = $.extend(true, {}, <any>ItemGenerator.s_schemaThumbnail);

        {
            // 0 - 99 のランダム値
            const random = Math.floor(Math.random() * 100);
            const source = ItemGenerator.s_schemaSource[random];
            const dateTime = DateTime.convertDateToISOString(new Date());

            item.item_id = "dev-item-id:" + toZeroPadding(_id, 8);
            _id++;
            item.mime_type = source.mimeType;
            item.file_name = source.id + ".jpg";
            item.width = source.width * 2;
            item.height = source.height * 2;

            item.score = random / 100;

            item.recorded_date =
                item.modified_date =
                item.meta_modified_date =
                item.content_modified_date =
                item.uploaded_date =
                item.metadata.recorded_date = dateTime;

            item.thumbnail[0].width = source.width;
            item.thumbnail[0].height = source.height;
            item.thumbnail[0].location = toUrl("/res/data/sample/image/org/" + source.id + ".jpg");
            item.thumbnail[1].location = toUrl("/res/data/sample/image/thumb/" + source.id + ".jpg");
        }

        return item;
    }

    /**
     * json の読み込み (同期)
     *
     * @param path [in] json のパスを指定
     * @returns {Object} json オブジェクト
     */
    public static loadJSON(path: string): object {
        let json: object;

        $.ajax({
            url: path,
            method: "GET",
            async: false,
            dataType: "json",
        })
            .done((data: any) => {
                json = data;
            });

        return json;
    }

    ///////////////////////////////////////////////////////////////////////
    // private static method

    // スキーマのロード
    private static loadSchema(): void {
        if (!ItemGenerator.s_schemaSource ||
            !ItemGenerator.s_schemaItem ||
            !ItemGenerator.s_schemaMetaData ||
            !ItemGenerator.s_schemaThumbnail
        ) {
            ItemGenerator.s_schemaSource = ItemGenerator.loadJSON(toUrl("/res/data/sample/image/image.json"));
            ItemGenerator.s_schemaItem = ItemGenerator.loadJSON(toUrl("/res/data/sample/image/item.json"));
            ItemGenerator.s_schemaMetaData = ItemGenerator.loadJSON(toUrl("/res/data/sample/image/metadata.json"));
            ItemGenerator.s_schemaThumbnail = ItemGenerator.loadJSON(toUrl("/res/data/sample/image/thumbnail.json"));
        }
    }
}

//___________________________________________________________________________________________________________________//

/**
 * @class ItemListGenerator
 * @brief 複数のダミー item を生成するユーティリティクラス
 */
export class ItemListGenerator {

    ///////////////////////////////////////////////////////////////////////
    // public static method

    /**
     * 指定した数だけ Item を生成
     *
     * @param   num      [in] 生成数
     * @param   unit     [in] 進捗単位
     * @param   callback [in] プロパティコールバック
     * @returns done(data: item[])
     */
    public static generate(num: number, unit: number = 100, callback?: (item: ItemInfo, index?: number) => void): IPromise<any> {
        const df = $.Deferred();
        const promise = makePromise(df);

        let _index = 0;

        const proc = () => {
            const itemInfo: ItemInfo[] = [];
            let item: ItemInfo;
            let size: number;

            if (df.state() !== "pending") {
                return;
            }

            if (unit <= num) {
                size = unit;
                num -= size;
            } else {
                size = num;
                num = 0;
            }

            for (let i = 0; i < size; i++) {
                item = ItemGenerator.create();
                if (null != callback) {
                    callback(item, _index);
                }
                itemInfo.push(item);
                _index++;
            }

            df.notify(itemInfo);

            if (0 < num) {
                setTimeout(proc);
            } else {
                df.resolve();
            }
        };

        if (0 < num) {
            setTimeout(proc);
        } else {
            df.reject();
        }

        return promise;
    }
}
