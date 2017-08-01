import {
    IPromise,
    Promise,
    makePromise,
    ErrorInfo,
    makeErrorInfo,
    Collection,
    Model,
} from "cdp/framework";
import { Gate } from "cdp/bridge";
import { RESULT_CODE } from "../error-defs";

const TAG: string = "[cafeteria.images.NativeLocalContentProvider] ";

export const MAX_QUERY_LIMIT = 48;
export const MAX_THUMBNAIL_WORK_LIMIT = 12;

/**
 * @interface Content
 * @brief     コンテンツスキーマ
 */
export interface Content {
    key: string;
    index?: number;
    width?: number;
    height?: number;
}

/**
 * @interface ContentList
 * @brief コンテンツリストスキーマ
 */
export interface ContentList {
    totalContentCount?: number; //!< コンテンツのトータル数
    contents?: Content[];       //!< 画像パス
}

//___________________________________________________________________________________________________________________//

/**
 * @interface QueryThumbnailInfo
 * @brief サムネイル取得用インターフェイス
 */
interface QueryThumbnailInfo {
    key: string;
    promise: IPromise<string>;
    df: JQueryDeferred<string>;
}

/**
 * @class LocalContentProvider
 * @brief ローカルコンテンツを供給する Native Bridge クラス
 */
export default class LocalContentProvider extends Gate {

    private static s_instacne: LocalContentProvider;
    private static s_queue: QueryThumbnailInfo[] = [];
    private static s_workThumbnail = 0;

    /**
     * constructor
     */
    constructor() {
        super({
            name: "LocalContentProvider",
            android: {
                packageInfo: "com.sony.cdp.cafeteria.nativebridge.LocalContentProvider",
            },
            ios: {
                packageInfo: "CafeteriaLocalContentProvider",
            }
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // public static methods:

    /**
     * sync
     * Backbone.sync 互換メソッド
     */
    public static sync(
        method: string,
        collection: Backbone.Collection<Backbone.Model>,
        options?: Backbone.PersistenceOptions
    ): JQueryXHR {
        return this.getInstance().syncNativeBridge(method, collection, options);
    }

    /**
     * thumbnail を取得
     * 複数コンテンツを一度に取得する際、[JS → Native] > [Native → JS] の通信状況になり、
     * サムネイル表示されるまでにブロッキングが発生するため、
     * 本関数でスケジューリングする
     *
     * @param  {String} key [in] コンテンツキーを指定
     * @return {IPromise<string>} サムネイル data-url (base64)
     */
    public static getThumbnail(key: string): IPromise<string> {
        const df = $.Deferred();
        const promise = makePromise(df);

        // 複数コンテンツを一度に取得すると、cordova message queue を圧迫するため queuing する
        this.s_queue.push({
            key: key,
            promise: promise,
            df: df,
        });

        const proc = (caller: string) => {
            // すでにキャンセルされたものは対象から外す
            this.s_queue = this.s_queue.filter((info: QueryThumbnailInfo) => {
                return "pending" === info.promise.state();
            });

            if (this.s_workThumbnail < MAX_THUMBNAIL_WORK_LIMIT) {
                const info = this.s_queue.shift();
                if (info) {
                    this.s_workThumbnail++;
                    this.queryThumbnail(info)
                        .always(() => {
                            this.s_workThumbnail--;
                            setTimeout(() => {
                                proc("always");
                            });
                        });
                }
            }
        };

        setTimeout(() => {
            proc("setup");
        });

        return promise;
    }

    /**
     * thumbnail 取得用の実装関数
     *
     * @param  {String} key [in] コンテンツキーを指定
     * @return {IPromise<string>} サムネイル data-url (base64)
     */
    private static queryThumbnail(info: QueryThumbnailInfo): IPromise<string> {
        info.promise.dependOn(this.getInstance().queryThumbnailByKey(info.key))
            .done((result: string) => {
                info.df.resolve(result);   // data-url
            })
            .fail((error: ErrorInfo) => {
                info.df.reject(makeErrorInfo(
                    RESULT_CODE.ERROR_CAFETERIA_IMAGES_LOCAL_CONTENTS_QUERY_THUMBNAIL_FAILED,
                    TAG,
                    "query thumbnail failed. key: " + info.key,
                    error
                ));
            });

        return info.promise;
    }

    /**
     * Image Source を取得
     *
     * @param  {String} key [in] コンテンツキーを指定
     * @return {IPromise<string>} Image Source data-url (base64)
     */
    public static getImageSource(key: string): IPromise<string> {
        const df = $.Deferred();
        const promise = makePromise(df);

        promise.dependOn(this.getInstance().queryImageSourceByKey(key))
            .done((result: string) => {
                df.resolve(result);   // data-url
            })
            .fail((error: ErrorInfo) => {
                df.reject(makeErrorInfo(
                    RESULT_CODE.ERROR_CAFETERIA_IMAGES_LOCAL_CONTENTS_QUERY_IMAGE_SOURCE_FAILED,
                    TAG,
                    "query image source failed. key: " + key,
                    error
                ));
            });

        return promise;
    }

    ///////////////////////////////////////////////////////////////////////
    // private static methods:

    /**
     * シングルトンインスタンスを取得
     */
    private static getInstance(): LocalContentProvider {
        if (!this.s_instacne) {
            this.s_instacne = new LocalContentProvider();
        }
        return this.s_instacne;
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods:

    /**
     * Native Bridge Sync
     */
    private syncNativeBridge(method: string, collection: Collection<Model>, options?: Backbone.PersistenceOptions): JQueryXHR {
        switch (method) {
            case "read":
                return this.read(collection, options);
            default:
                return <any>$.Deferred().reject(makeErrorInfo(
                    CDP.RESULT_CODE.FAILED,
                    TAG,
                    "operation not supported. [method: " + method + "]"
                ));
        }
    }

    // コンテンツ読み込み
    private read(collection: Collection<Model>, options?: Backbone.PersistenceOptions): JQueryXHR {
        const promise = new Promise((resolve, reject, dependOn) => {
            dependOn(this.queryLocalContents((<any>options).queryIndex, (<any>options).queryLimit))
                .done((info: ContentList, result: CDP.NativeBridge.IResult) => {
                    const resp = { ...info, ...{ result: result } };
                    if (options && options.success) {
                        options.success(resp);
                    }
                    resolve(resp);
                })
                .fail((error) => {
                    if (options && options.error) {
                        options.error(error);
                    }
                    reject(makeErrorInfo(
                        RESULT_CODE.ERROR_CAFETERIA_IMAGES_LOCAL_CONTENTS_QUERY_CONTENTS_FAILED,
                        TAG,
                        null,
                        <any>error
                    ));
                });

            collection.trigger("request", collection, promise, options);
        });

        return <any>promise;
    }

    ///////////////////////////////////////////////////////////////////////
    // NativeBridge methods:

    /**
     * コンテンツ取得
     * Native Bridge I/F.
     *
     * @param {Number} index [in] 開始インデックス
     */
    private queryLocalContents(index: number = 0, limit: number = MAX_QUERY_LIMIT): IPromise<ContentList> {
        if (MAX_QUERY_LIMIT < limit) {
            limit = MAX_QUERY_LIMIT;
        }
        return super.exec("queryLocalContents", [index, limit]);
    }

    /**
     * サムネイル取得
     * Native Bridge I/F.
     *
     * @param {String} key [in] コンテンツキー
     */
    private queryThumbnailByKey(key: string): IPromise<string> {
        return super.exec("queryThumbnailByKey", [key]);
    }

    /**
     * Image Source 取得
     * Native Bridge I/F.
     *
     * @param {String} key [in] コンテンツキー
     */
    private queryImageSourceByKey(key: string): IPromise<string> {
        return super.exec("queryImageSourceByKey", [key]);
    }
}
