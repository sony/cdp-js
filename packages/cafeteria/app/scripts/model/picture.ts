import * as _ from "underscore";
import { Model } from "cdp/framework";

const TAG = "[model.Picture] ";

/**
 * @class Picture モデルオブジェクト
 * @brief 写真データを格納
 */
export default class Picture extends Model {
    /**
     *  constructor
     *
     * @param data [in] object
     */
    constructor(attributes?: any) {
        super(attributes, null);
    }

    /**
     * destroy をオーバーライド。
     * 本来ならサーバーと通信するがサンプルではデータを永続化しないため、
     * destroy イベントだけ発生させる。
     */
    destroy() {
        this.trigger("destroy", this);
    }

    /**
     * モデルの初期値を返す。
     * new でオブジェクトを生成したとき、まずこの値が attributes に格納される。
     */
    defaults(): any {
        return {
            name: "",           // 画像の名前
            kind: "",           // [動物][植物][風景]のどれか
            src: "",            // 画像のurl
            desc: "",           // 画像の説明
            date: new Date(),   // オブジェクトが作られた時刻
        };
    }

    /**
     * set メソッドに渡されたデータを検証する。
     * 何か値を返すと検証エラー扱いになるので、
     * 不正な値だったときはエラーメッセージなんかを返すといい。
     */
    validate(attrs: any): string {
        // 検証には、underscore の便利メソッドを使っている。
        if (_.isString(attrs.name) && _.isEmpty(attrs.name)) {
            return "name is empty.";
        }
    }
}
