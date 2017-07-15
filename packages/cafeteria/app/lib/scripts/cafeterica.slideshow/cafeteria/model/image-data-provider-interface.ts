import * as _ from "underscore";
import {
    IPromise,
    Promise,
    makePromise,
    Model,
    Collection,
} from "cdp/framework";

const TAG = "[cafeteria.slideshow.model.image-data-provider-interface] ";

/**
 * @class ImageData
 * @brief 画像データインターフェイス
 */
export interface ImageData extends Model {
    /**
     * 画像 URL の取得
     * 準備できていないときは null を返却。
     *
     * @param  {String}  type   [in] [image|thumbnail] 指定可
     * @param  {Boolean} revoke [in] 取得後、メモリ破棄を自動で行う場合 true を指定
     * @return {String} URL
     */
    getUrl(type: string, revoke: boolean): string;

    /**
     * プロパティの取得
     *
     * @param {String} type    [in] [image|thumbnail] 指定可
     * @param {String} property[in] Backbone.Model の attribute の文字列を指定
     * @return Backbone.Model の attribute に設定したプロパティ値
     */
    getProperty(type: string, property: string): any;

    /**
     * 画像の破棄
     *
     * @param {String} type [in] [image|thumbnail] 指定可。指定しない場合はすべてが対象
     */
    revoke(type?: string): void;

    /**
     * 画像データのロード
     *
     * @param  {String} type [in] [image|thumbnail] 指定可。指定しない場合はすべてが対象
     * @return {Object} IPromise オブジェクト
     */
    load(type?: string): IPromise<any>;

    /**
     * 非同期処理のキャンセル
     *
     * @param  {Boolean} revoke [in] revoke を呼ぶときは true. 既定値。
     */
    cancel(revoke?: boolean): void;

    /**
     * URL 読み込み可能か判定
     *
     * @param  {String} type [in] [image|thumbnail] 指定可。
     * @return {Boolean} true: 読み込み可 / false: 読み込み不可(load 必要)
     */
    isUrlReady(type: string): boolean;
}

//___________________________________________________________________________________________________________________//

/**
 * @interface ImageDataProvider
 * @brief     画像コレクション用インターフェイス
 */
export interface ImageDataProvider extends Collection<ImageData> {
    /**
     * コレクションの検証
     *
     * @return {Boolean} true: データ設定済み / false: データ未設定
     */
    valid(): boolean;

    /**
     * 全体データ長取得
     *
     * @return {Number} 全体データ長
     */
    getTotalSize(): number;

    /**
     * 1回あたりの最大データ量取得
     *
     * @return {Number} データ長
     */
    getQuerySize(): number;

    /**
     * データのロード
     * image/thumbnail の読み込み指定が可能であるが、done() 制御が返るに、getUrl() が機能するかは保証されない。
     *
     * @param  {String} type [in] [image|thumbnail] 指定可。指定しない場合は、画像のロードは行わない。
     * @return {Object} IPromise オブジェクト
     */
    load(type?: string): IPromise<any>;

    /**
     * キャンセル
     * すべての非同期処理をキャンセル
     *
     * @param  {Boolean} revoke [in] revoke を呼ぶときは true. 既定値。
     */
    cancelAll(revoke?: boolean): void;

    /**
     * Index 指定によるデータ取得
     * 一度に返されるデータは最大で getQuerySize() と同じ。
     * jQueryPromise.done() 時に、ImageData の type に指定した URL のアクセスは保証される。
     *
     * @param  {String} type      [in] [image|thumbnail] 指定可。
     * @param  {Number} unitIndex [in] query unit index. ex) 0, 10, 20.
     * @return {Object} jQueryPromise. argument: { total: <number>, items: [models] }.
     */
    queryData(type: string, unitIndex?: number): IPromise<any>;

    /**
     * ID 指定によるデータ取得
     * 一度に返されるデータは最大で getQuerySize() と同じ。
     * jQueryPromise.done() 時に、ImageData の type に指定した URL のアクセスは保証される。
     *
     * @param  {String} type    [in] [image|thumbnail] 指定可。
     * @param  {String} imageId [in] ImageData の ID を指定.
     * @return {Object} jQueryPromise. argument: { total: <number>, items: [models] }, index, unitIndex.
     */
    findData(type: string, imageId: string): IPromise<any>;

    /**
     * 画像 URL ヘルパーアクセッサ。コールバックに指定される。
     * 準備済み imageData#isReady("image") === true であること必要がある。
     * 本メソッドは内部で revoke() を "行わない"
     *
     * @param  {Object} image [in] image model
     * @return {String} url property.
     */
    getImageUrl(image: ImageData): string;

    /**
     * サムネイル URL ヘルパーアクセッサ。コールバックに指定される。
     * 準備済み imageData#isReady("thumbnail") === true であること必要がある。
     * 本メソッドは内部で revoke() を "行う"
     *
     * @param  {Object} image [in] image model
     * @return {String} url property.
     */
    getThumbnailUrl(image: ImageData): string;
}

//___________________________________________________________________________________________________________________//

/**
 * @class ImageDataProviderUtil
 * @brief ImageDataProvider の共通実装を提供するユーティリティクラス
 */
export class ImageDataProviderUtil {
    // Index 指定によるデータ取得
    static queryData(context: ImageDataProvider, type: string, unitIndex?: number, noload?: boolean): IPromise<any> {
        return new Promise((resolve, reject) => {
            if (!context.valid()) {
                console.error("error. ImageDataProvider valid() failed.");
                return Promise.reject();
            }

            unitIndex = ImageDataProviderUtil.ensureUnitIndex(context, unitIndex);

            // data setup proc
            setTimeout(() => {
                let data = {
                    total: context.getTotalSize(),
                    items: context.models.slice(unitIndex, unitIndex + context.getQuerySize()),
                };
                if (!noload) {
                    // wait for load
                    ImageDataProviderUtil.waitForLoadComplete(context, type, data)
                        .done((data) => {
                            resolve(data);
                        })
                        .fail(() => {
                            reject();
                        });
                } else {
                    resolve(data);
                }
            }, 0);
        });
    }

    // ID 指定によるデータ取得
    static findData(context: ImageDataProvider, type: string, imageId: string): IPromise<any> {
        const df = $.Deferred();
        const promise = makePromise(df);
        let index = 0, startIndex = 0, unitIndex = 0;

        if (null == imageId) {
            ImageDataProviderUtil.queryData(context, type, 0)
                .done((data) => {
                    df.resolve(data, 0, 0);
                })
                .fail(() => {
                    df.reject();
                });
            return promise;
        }

        const searchProc = () => {
            ImageDataProviderUtil.queryData(context, type, unitIndex, true)
                .done((data) => {
                    index = ImageDataProviderUtil.findIndexFromItemId(imageId, data, startIndex);
                    if (-1 !== index) {
                        ImageDataProviderUtil.waitForLoadComplete(context, type, data)
                            .done((data) => {
                                df.resolve(data, index, unitIndex);
                            })
                            .fail(() => {
                                df.reject();
                            });
                    } else {
                        startIndex += data.items.length;
                        unitIndex = ImageDataProviderUtil.ensureUnitIndex(context, startIndex);
                        if (startIndex < data.total) {
                            setTimeout(searchProc, 0);
                        } else {
                            console.error("error. item not found. id:" + imageId);
                            // for fail safe.
                            ImageDataProviderUtil.queryData(context, type, 0)
                                .done((data) => {
                                    df.resolve(data, 0, 0);
                                })
                                .fail(() => {
                                    df.reject();
                                });
                        }
                    }
                })
                .fail(() => {
                    df.reject();
                });
        };
        searchProc();

        return promise;
    }

    // 画像 URL ヘルパーアクセッサ。コールバックに指定される。
    static getImageUrl(image: ImageData): string {
        return image.getUrl("image", false);
    }

    // サムネイル URL ヘルパーアクセッサ。コールバックに指定される。
    static getThumbnailUrl(image: ImageData): string {
        return image.getUrl("thumbnail", true);
    }

    /**
     * 入力された unit index をデータ長のキリ番であることを保証する。
     *
     * @private
     * @param  {Number} index.
     * @return {Number} query unit index. ex) 0, 100, 200.
     */
    private static ensureUnitIndex(context: ImageDataProvider, index: number): number {
        if (null == index) {
            index = 0;
        }
        return Math.floor(index / context.getQuerySize()) * context.getQuerySize();
    }

    /**
     * id より index を検索
     *
     * @private
     * @param  {String} imageId id.
     * @param  {Object} data object.
     * @param  {Number} start index.
     * @return {Number} if -1 returned, means not found.
     */
    private static findIndexFromItemId(imageId: string, data: any, startIndex: number): number {
        if (null == data.items) {
            return -1;
        }

        for (let i = 0, length = data.items.length; i < length; i++) {
            let item = data.items[i];
            if (item.get("id") === imageId) {
                return startIndex;
            }
            startIndex++;
        }
        return -1;
    }

    /**
     * 対象のロードが完了するまで待機
     *
     * @private
     */
    private static waitForLoadComplete(context: ImageDataProvider, type: string, data: any): IPromise<any> {
        return new Promise((resolve, reject) => {
            // wait for load
            let promises = _.map(data.items, (item: ImageData) => {
                return item.load(type);
            });
            if (0 < promises.length) {
                $.when.apply(context, promises)
                    .done(() => {
                        resolve(data);
                    })
                    .fail(() => {
                        console.error("error. wait models load(), failed.");
                        reject();
                    });
            } else {
                resolve(data);
            }
        });
    }
}
