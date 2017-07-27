import {
    IPromise,
    Promise,
    makeErrorInfo,
} from "cdp/framework";

const TAG: string = "[cafeteria.images.NativeLocalContentProvider] ";

/**
 * @class NativeLocalContentProvider
 * @brief LocalContentProvider の Native Plugin クラス
 */
export default class NativeLocalContentProvider {

    ///////////////////////////////////////////////////////////////////////
    // public static methods

    /**
     * sync
     * Backbone.sync 互換メソッド
     */
    public static sync(
        method: string,
        collection: Backbone.Collection<Backbone.Model>,
        options?: Backbone.PersistenceOptions
    ): JQueryXHR {
        return <any>Promise.reject(makeErrorInfo(
            CDP.RESULT_CODE.FAILED,
            TAG,
            "operation not supported. [method: " + method + "]"
        ));
    }

    /**
     * thumbnail を取得
     *
     * @param key [in] コンテンツキーを指定
     * @returns サムネイル data-url (base64)
     */
    public static getThumbnail(key: string): IPromise<string> {
        return Promise.reject(makeErrorInfo(
            CDP.RESULT_CODE.FAILED,
            TAG,
            "operation not supported."
        ));
    }

    /**
     * Image Source を取得
     *
     * @param key [in] コンテンツキーを指定
     * @returns Image Source data-url (base64)
     */
    public static getImageSource(key: string): IPromise<string> {
        return Promise.reject(makeErrorInfo(
            CDP.RESULT_CODE.FAILED,
            TAG,
            "operation not supported."
        ));
    }
}
