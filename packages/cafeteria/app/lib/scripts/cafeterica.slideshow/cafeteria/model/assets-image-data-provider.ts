import {
    IPromise,
    Promise,
    toUrl,
    Model,
    Collection,
} from "cdp/framework";
import { toZeroPadding } from "cdp/tools";
import {
    ImageData,
    ImageDataProvider,
    ImageDataProviderUtil,
} from "./image-data-provider-interface";

const TAG = "[cafeteria.slideshow.model.assets-image-data-provider] ";

const SAMPLE_DATA_ROOT = "/res/data/sample/image/";
const SAMPLE_DATA_FILE_PATH = SAMPLE_DATA_ROOT + "image.json";

/**
 * @class AssetsImageData
 * @brief assets 用画像データクラス
 */
export class AssetsImageData extends Model implements ImageData {
    // default value.
    defaults(): any {
        return {
            id:                 undefined,
            title:              "",
            dateTime:           new Date(),
            url_image:          "",
            width_image:        0,
            height_image:       0,
            url_thumbnail:      "",
            width_thumbnail:    0,
            height_thumbnail:   0,
        };
    }

    /**
     *  constructor
     *
     * @param data [in] object
     */
    constructor(attributes?: any) {
        super(attributes, null);
    }

    // 画像 URL の取得
    getUrl(type: string, revoke: boolean): string {
        const url = this.get("url_" + type);
        if (!url) {
            return null;
        }
        if (revoke) {
            setTimeout(() => {
                this.revoke(type);
            }, 0);
        }
        return url;
    }

    // プロパティの取得
    getProperty(type: string, property: string): any {
        const imgProp = ["width", "height"];
        if (-1 !== imgProp.indexOf(property)) {
            property = property + "_" + type;
        }
        return this.get(property);
    }

    // 画像の破棄
    revoke(type?: string): void {
        const types = (null == type) ? ["image", "thumbnail"] : [type];
        for (let i = 0; i < types.length; i++) {
            this.set("url_" + types[i], "");
        }
    }

    // 画像データのロード
    load(type?: string): IPromise<any> {
        return new Promise((resolve, reject) => {
            if (null == type) {
                if (this.isUrlReady("image") && this.isUrlReady("thumbnail")) {
                    return resolve();
                }
            } else {
                if (this.isUrlReady(type)) {
                    return resolve();
                }
            }
            // async emulate
            setTimeout(() => {
                this.setUrl(type);
                resolve();
            });

        });
    }

    // 非同期処理のキャンセル
    cancel(revoke?: boolean): void {
        // noop.
    }

    // URL 読み込み可能か判定
    isUrlReady(type: string): boolean {
        return (null != this.getUrl(type, false));
    }

    // URL の設定
    private setUrl(type: string): void {
        const index = parseInt(this.get("id"), 10);
        const types = (null == type) ? ["image", "thumbnail"] : [type];
        for (let i = 0; i < types.length; i++) {
            const path = ("image" === types[i]) ? (`org/${index}.jpg`) : (`small/${index}.jpg`);
            const url = toUrl(SAMPLE_DATA_ROOT + path);
            this.set("url_" + types[i], url);
        }
    }
}

//___________________________________________________________________________________________________________________//

/**
 * @class AssetsImageDataProvider
 * @brief assets 用画像データクラス
 */
export class AssetsImageDataProvider extends Collection<AssetsImageData> implements ImageDataProvider {

    model = AssetsImageData;

    // constructor
    constructor(private _limit: number = 100, private _querySize: number = 10) {
        super(null);
        // 以降のモデルが追加されたときに発生する add イベントにハンドラを登録する。
        this.bind("add", this.onAdd, this);
    }

    // コレクションの検証
    valid(): boolean {
        return 0 !== this.length;
    }

    // 全体データ長取得
    getTotalSize(): number {
        return this.length;
    }

    // 1回あたりの最大データ量取得
    getQuerySize(): number {
        return this._querySize;
    }

    // データのロード
    load(type?: string): IPromise<any> {
        return new Promise((resolve, reject) => {
            let _dummydata = null;

            this.reset();

            const loadImage = (!!type && "image" === type);
            const loadThumb = (!!type && "thumbnail" === type);

            $.ajax({
                url: toUrl(SAMPLE_DATA_FILE_PATH),
                method: "GET",
                async: false,
                dataType: "json",
            })
                .done((data: any) => {
                    this._limit = data.length;
                    _dummydata = data;
                    // モデルの追加
                    for (let i = 0; i < this._limit; i++) {
                        this.add(new AssetsImageData({
                            id: toZeroPadding(i, 3),
                            title: `Sample${toZeroPadding(i, 3)}.jpg`,
                            dateTime: new Date(),
                            url_image: loadImage ? toUrl(`${SAMPLE_DATA_ROOT}org/${i}.jpg`) : "",
                            width_image: _dummydata[i].width,
                            height_image: _dummydata[i].height,
                            url_thumbnail: loadThumb ? toUrl(`${SAMPLE_DATA_ROOT}small/${i}.jpg`) : "",
                            width_thumbnail: _dummydata[i].width / 4,
                            height_thumbnail: _dummydata[i].height / 4,
                        }));
                    }
                    resolve();
                })
                .fail((data: any, status: string) => {
                    console.warn("image.json is not found! status = " + status);
                    reject();
                });
        });
    }

    // キャンセル
    cancelAll(revoke?: boolean): void {
        if (null == revoke) {
            revoke = true;
        }
        this.each((model) => {
            (<ImageData>model).cancel(revoke);
        });
    }

    // Index 指定によるデータ取得
    queryData(type: string, unitIndex?: number): IPromise<any> {
        return ImageDataProviderUtil.queryData(this, type, unitIndex);
    }

    // ID 指定によるデータ取得
    findData(type: string, imageId: string): IPromise<any> {
        return ImageDataProviderUtil.findData(this, type, imageId);
    }

    // 画像 URL ヘルパーアクセッサ。コールバックに指定される。
    getImageUrl(image: ImageData): string {
        return ImageDataProviderUtil.getImageUrl(image);
    }

    // サムネイル URL ヘルパーアクセッサ。コールバックに指定される。
    getThumbnailUrl(image: ImageData): string {
        return ImageDataProviderUtil.getThumbnailUrl(image);
    }

    // model の追加
    private onAdd(image: ImageData): void {
        // noop.
    }
}
