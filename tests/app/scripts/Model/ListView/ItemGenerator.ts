/* tslint:disable:max-line-length */

import { ItemInfo } from "tests/app/scripts/Model/ListView/DataIF";
import { toUrl } from "cdp/framework";
import { DateTime, toZeroPadding } from "cdp/tools";

const TAG: string = "[Model/ListView/ItemGenerator] ";

let _id: number = 0;

/**
 * @class ItemGenerator
 * @brief ダミー item を生成するユーティリティクラス
 */
export class ItemGenerator {

    private static s_schemaSource: Object = null;
    private static s_schemaItem: Object = null;
    private static s_schemaMetaData: Object = null;
    private static s_schemaThumbnail: Object = null;

    ///////////////////////////////////////////////////////////////////////
    // public static method

    /**
     * Item を 1つ生成
     *
     * @return {API.ItemInfo} item オブジェクト
     */
    public static create(): ItemInfo {
        let item: ItemInfo;

        ItemGenerator.loadSchema();
        if (!ItemGenerator.s_schemaSource) {
            console.error("Please setup 'sample' folder under 'res'");
        }

        item = $.extend(true, {}, ItemGenerator.s_schemaItem);
        item.metadata = $.extend(true, {}, ItemGenerator.s_schemaMetaData);
        item.thumbnail = $.extend(true, {}, ItemGenerator.s_schemaThumbnail);

        (() => {
            // 0 - 99 のランダム値
            let random = Math.floor(Math.random() * 100);
            let source = ItemGenerator.s_schemaSource[random];
            let dateTime = DateTime.convertDateToISOString(new Date());

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

        })();

        return item;
    }

    /**
     * json の読み込み (同期)
     *
     * @param path {String} [in] json のパスを指定
     * @return {Object} json オブジェクト
     */
    public static loadJSON(path: string): Object {
        let object: Object;

        $.ajax({
            url: path,
            method: "GET",
            async: false,
            dataType: "json",
        })
            .done((data: any) => {
                object = data;
            });

        return object;
    }

    ///////////////////////////////////////////////////////////////////////
    // private static method

    //! スキーマのロード
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
     * @param  num  {Number}   [in] 生成数
     * @param  unit {Number}   [in] 進捗単位
     * @param  callback {Function} [in] プロパティコールバック
     * @return {jQueryPromise} done(data: item[])
     */
    public static generate(num: number, unit: number = 100, callback?: (item: ItemInfo, index?: number) => void): CDP.IPromise<any> {
        let df = $.Deferred();
        let _index = 0;

        let proc = function () {
            let itemInfo: ItemInfo[] = [];
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

        return CDP.makePromise(df);
    }
}
