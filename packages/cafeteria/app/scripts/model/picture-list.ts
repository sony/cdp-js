import { Collection, toUrl } from "cdp/framework";
import Picture from "./picture";

const TAG = "[model.PictureList] ";

/**
 * @class PictureList
 * @brief Picture のコレクションオブジェクト
 */
export default class PictureList extends Collection<Picture> {

    // Backbone.Collection に対象の Model の型を与える。
    model = Picture;

    /**
     * constructor
     */
    constructor(model?: any) {
        super(model);
        // モデルが追加されたときに発生する add イベントにハンドラを登録する。
        this.bind("add", this.onAdd, this);
    }

    /**
     * 種類を指定してデータ読み込み先を設定する。
     * this.url に設定された URL は fetch() 関数で使用される。
     *
     * @param kind [in] "animal" などの種別を表す文字列
     */
    setTargetKind(kind: string): void {
        this.url = toUrl("/res/data/examples/json/" + kind + ".json");
    }

    /**
     * json のパースヒントを指定 (Backbone.js で定義)
     * json のフォーマットによっては、配列名の指定を与える必要がある。
     * http://stackoverflow.com/questions/8608184/how-to-add-json-to-backbone-js-collection-using-fetch
     *
     * @param response JSON の入力
     */
    parse(response: any): any {
        const json = response.pictures;
        for (let i = 0, n = json.length; i < n; i++) {
            json[i].src = toUrl(json[i].src);
        }
        return json;
    }

    // model の追加
    private onAdd(picture: Picture) {
        console.log(TAG + "onAdd()");
    }
}
