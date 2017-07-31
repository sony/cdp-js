import {
    IPromise,
    Promise,
    makePromise,
    toUrl,
    makeErrorInfo,
    Model,
    Collection,
} from "cdp/framework";
import { RESULT_CODE } from "../error-defs";

const TAG: string = "[cafeteria.images.StubLocalContentProvider] ";

const TOTAL_CONTENT_COUNT = 330;
const MAX_QUERY_LIMIT = 48; // 3, 4, 6 の公倍数

interface Content extends Model {
    key: string;
    index: number;
    width: number;
    height: number;
}

type ContentCollection = Collection<Content>;

/**
 * @interface ContentList
 * @brief ダミーコンテンツスキーマ
 */
interface ContentList {
    totalContentCount: number;  // コンテンツのトータル数
    contents: Content[];        // 画像パス
}

//___________________________________________________________________________________________________________________//

/**
 * @class StubLocalContentProvider
 * @brief LocalContentProvider の Stub クラス
 */
export default class StubLocalContentProvider {

    private static s_images: object;

    ///////////////////////////////////////////////////////////////////////
    // public static methods

    /**
     * sync
     * Backbone.sync 互換メソッド
     */
    public static sync(method: string, collection: Collection<Model>, options?: Backbone.PersistenceOptions): JQueryXHR {
        switch (method) {
            case "read":
                return StubLocalContentProvider.read(<ContentCollection>collection, options);
            default:
                return <any>$.Deferred().reject(makeErrorInfo(
                    CDP.RESULT_CODE.FAILED,
                    TAG,
                    "operation not supported. [method: " + method + "]"
                ));
        }
    }

    /**
     * thumbnail を取得
     *
     * @param key [in] コンテンツキーを指定
     * @returns サムネイル data-url (base64)
     */
    public static getThumbnail(key: string): IPromise<string> {
        return new Promise((resolve) => {
            StubLocalContentProvider.loadSchema();
            setTimeout(() => {
                resolve(toUrl("/res/data/sample/image/small/" + key + ".jpg"));
            });
        });
    }

    /**
     * Image Source を取得
     *
     * @param key [in] コンテンツキーを指定
     * @returns Image Source data-url (base64)
     */
    public static getImageSource(key: string): IPromise<string> {
        return new Promise((resolve) => {
            StubLocalContentProvider.loadSchema();
            setTimeout(() => {
                resolve(toUrl("/res/data/sample/image/org/" + key + ".jpg"));
            });
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // private static methods

    // ダミーコンテンツ読み込み
    private static read(collection: ContentCollection, options?: Backbone.PersistenceOptions): JQueryXHR {
        const promise = new Promise((resolve, reject, dependOn) => {
            dependOn(StubLocalContentProvider.generateContents((<any>options).queryIndex, (<any>options).queryLimit))
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
                        error
                    ));
                });

            collection.trigger("request", collection, promise, options);
        });

        return <any>promise;
    }

    // ダミーコンテンツの生成
    private static generateContents(index: number = 0, limit: number = MAX_QUERY_LIMIT): IPromise<ContentList> {
        const df = $.Deferred();
        const promise = makePromise(df);

        let queryCount = TOTAL_CONTENT_COUNT - index;
        if (TOTAL_CONTENT_COUNT <= 0) {
            const resp = {
                totalContentCount: TOTAL_CONTENT_COUNT,
                contents: [],
            };
            df.resolve(resp, {
                code: CDP.NativeBridge.SUCCESS_OK,
                taskId: "dummy-localcontents-task",
                params: [resp],
            });
        } else if (queryCount <= 0) {
            df.reject(TAG + "invalid index: " + index);
        } else {
            setTimeout(() => {
                if (limit < queryCount) {
                    queryCount = limit;
                }

                StubLocalContentProvider.loadSchema();

                const getContent = (idx: number): Content => {
                    // "index === 0" 以外は "0 - 99" のランダム値
                    const random = (0 === idx) ? 0 : Math.floor(Math.random() * 100);
                    const image = StubLocalContentProvider.s_images[random];

                    return <Content>{
                        index: idx,
                        key: image.id,
                        width: image.width,
                        height: image.height,
                    };
                };

                const resp: ContentList = {
                    totalContentCount: TOTAL_CONTENT_COUNT,
                    contents: [],
                };
                for (let i = 0, n = queryCount; i < n; i++) {
                    if ("pending" !== promise.state()) {
                        return;
                    }
                    resp.contents.push(getContent(index + i));
                }

                df.resolve(resp, {
                    code: CDP.NativeBridge.SUCCESS_OK,
                    taskId: "dummy-localcontents-task",
                    params: [resp],
                });
            });
        }

        return promise;
    }

    ///////////////////////////////////////////////////////////////////////
    // private static method

    /**
     * json の読み込み (同期)
     *
     * @param path [in] json のパスを指定
     * @returns json オブジェクト
     */
    private static loadJSON(path: string): object {
        let obj: object;

        $.ajax({
            url: path,
            method: "GET",
            async: false,
            dataType: "json",
        })
            .done((data: any) => {
                obj = data;
            });

        return obj;
    }

    // スキーマのロード
    private static loadSchema(): void {
        if (!StubLocalContentProvider.s_images) {
            StubLocalContentProvider.s_images = StubLocalContentProvider.loadJSON(toUrl("/res/data/sample/image/image.json"));
        }
    }
}
