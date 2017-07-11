/* tslint:disable:max-line-length */

import { toUrl, Model } from "cdp/framework";
import { Toast, getTemplate, JST } from "cdp/ui";
import PictureList from "../../model/picture-list";

const TAG = "[view.views-sample.PictureListViewHelper] ";

/**
 * @class PictureListViewHelper
 * @brief PictureListView の共通実装を提供するユーティリティクラス。
 */
export default class PictureListViewHelper {
    private static s_addCount: number = 0;

    // JST の取得
    static getJST(key: string, src: string): JST {
        return getTemplate(key, toUrl(src));
    }

    // ラジオボタンからターゲットの更新
    static updateTarget(collection: PictureList): void {
        collection.setTargetKind(PictureListViewHelper.getTargetKind());
    }

    // モデルデータの取得
    static queryModel(): Model {
        const url: string = toUrl("/res/data/examples/json/" + PictureListViewHelper.getTargetKind() + ".json");
        let picture = null;
        $.ajax({
            url: url,
            method: "GET",
            async: false,
            dataType: "json",
            success: (data: any) => {
                const i = PictureListViewHelper.s_addCount % data.pictures.length;
                picture = data.pictures[i];
                picture.src = toUrl(picture.src);
                PictureListViewHelper.s_addCount++;
            },
            error: (data: any, status: string) => {
                Toast.show("error: ajax request failed. status: " + status);
            }
        });

        return <Model>picture;
    }

    // ラジオボタンの選択状態取得
    private static getTargetKind(): string {
        // ラジオにチェックが入っているものを参照
        const result = $("input[name='picture-kind']:checked").val();
        let kind: string;

        switch (result) {
            case "1":
                kind = "animal";
                break;
            case "2":
                kind = "plant";
                break;
            case "3":
                kind = "landscape";
                break;
            default:
                kind = "unknown";
                break;
        }

        return kind;
    }
}
