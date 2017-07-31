import {
    IPromise,
    Promise,
    ErrorInfo,
    Model,
} from "cdp/framework";
import { resizeImage  } from "cdp/tools/tools";
import { LocalContentProvider as Provider } from "cafeteria.images";

const TAG = "[model.LocalContent] ";
const MAX_IMAGE_LONG_SIDE_LENGTH = 1920; // Image サイズの 長辺

/**
 * @class LocalContent
 * @brief ローカルコンテンツを扱う Backbone.Model クラス
 */
export default class LocalContent extends Model {

    /**
     * key の取得
     */
    public get key(): string {
        return this.get("key");
    }

    /**
     * index の取得
     */
    public get index(): number {
        return this.get("index");
    }

    /**
     * width の取得
     */
    public get width(): number {
        return this.get("width");
    }

    /**
     * height の取得
     */
    public get height(): number {
        return this.get("height");
    }

    ///////////////////////////////////////////////////////////////////////
    // public accesser

    /**
     * thumbnail url の取得
     *
     * @returns data-url
     */
    public getThumbnail(): IPromise<string> {
        return Provider.getThumbnail(this.key);
    }

    /**
     * source url の取得
     *
     * @returns data-url
     */
    public getImageSource(): IPromise<string> {
        return new Promise((resolve, reject, dependOn) => {
            dependOn(Provider.getImageSource(this.key))
                .then((src: string) => {
                    return dependOn(resizeImage(src, MAX_IMAGE_LONG_SIDE_LENGTH));
                })
                .done((imgSrc: string) => {
                    resolve(imgSrc);
                })
                .fail((error: ErrorInfo) => {
                    reject(error);
                });
        });
    }
}
