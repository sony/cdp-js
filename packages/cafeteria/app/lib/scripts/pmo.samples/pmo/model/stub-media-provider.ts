import {
    IPromiseBase,
    IPromise,
    Promise,
    PromiseManager,
} from "cdp/framework";
import { SlideShow } from "cdp.slideshow";
import { MediaProvider } from "./interfaces";

/**
 * @class StubMediaProvider
 * @brief MediaProvider の Stub 実装クラス
 */
export default class StubMediaProvider implements MediaProvider.IProvider {

    private _prmsManager: PromiseManager = null;

    // constructor
    constructor() {
        this._prmsManager = new PromiseManager();
    }

    ///////////////////////////////////////////////////////////////////////
    // Implements: IProvider

    // Media Source の取得
    get(key: MediaProvider.Key): IPromise<any> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let errorMsg: string;
                let src: string;
                let media: MediaProvider.MediaInfo;
                if (!key.info) {
                    errorMsg = "logic error. key.info is null.";
                    console.error(errorMsg);
                    reject({ message: errorMsg });
                    return;
                } else if (!key.info.item || !key.info.item.thumbnail) {
                    // [NOTE] status: pending は正常系でくる
//                  src = WebAPI.Items.getThumbnailURL(key.key, key.info.size, true);
                } else {
                    src = key.info.item.thumbnail[0].location;
                }

                media = {
                    src: src,
                    info: key.info,
                };
                (<any>resolve)(media.src, media);
            });
        });
    }

    // 管理下の Promise をすべてキャンセル
    cancel(): IPromiseBase<any> {
        return this._prmsManager.cancel();
    }

    // 管理対象のキャッシュをクリア
    clear(): IPromiseBase<any> {
        return this.cancel();
    }

    // Property Accesser の生成
    makePropertyAccesser(detail: (element: any) => MediaProvider.Key): SlideShow.PropertyAccesser {
        const accesser: SlideShow.PropertyAccesser = (element: any): IPromise<any> => {
            return this.get(detail(element));
        };
        accesser.async = true;
        return accesser;
    }
}
