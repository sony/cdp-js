import {
    IPromise,
    Promise,
    ErrorInfo,
    Model,
} from "cdp/framework";
import { resizeImage  } from "cdp/tools/tools";
import {
    LocalContentProvider,
    AssetsContentProvider,
} from "cafeteria.images";

const TAG = "[model.ImageContent] ";
const MAX_IMAGE_LONG_SIDE_LENGTH = 1920; // Image サイズの 長辺

/**
 * @class ImageContent
 * @brief ローカルコンテンツを扱う Backbone.Model クラス
 */
export default class ImageContent extends Model {

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
        return this.Provider.getThumbnail(this.key);
    }

    /**
     * source url の取得
     *
     * @returns data-url
     */
    public getImageSource(): IPromise<string> {
        return new Promise((resolve, reject, dependOn) => {
            dependOn(this.Provider.getImageSource(this.key))
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

    ///////////////////////////////////////////////////////////////////////
    // private accesser

    private get Provider(
    ): { getThumbnail: (key: string) => IPromise<string>; getImageSource: (key: string) => IPromise<string>; } {
        if (!this.get("assets")) {
            return LocalContentProvider;
        } else {
            return AssetsContentProvider;
        }
    }

}
