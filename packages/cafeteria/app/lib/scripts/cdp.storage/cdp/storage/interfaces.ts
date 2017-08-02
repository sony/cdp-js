import { IPromise } from "cdp";

// Mime-Type
export const MIME_TYPE_BINRAY_DATA  = "application/octet-stream";
export const MIME_TYPE_TEXT         = "text/plain";
export const MIME_TYPE_IMG_PNG      = "image/png";

/**
 * @namespace STORAGE_KIND
 * @brief     ストレージ種別の定数宣言
 */
export const enum STORAGE_KIND {
    DEVICE_STORAGE = "cdp-storage:device:local-storage",
    SECURE_STORAGE = "cdp-storage:device:secure-storage",
    WEB_STORAGE    = "cdp-storage:web:local-storage",
}

/**
 * @interface IStorageOptions
 * @brief     IStorage 操作に使用するオプションインターフェイス
 */
export interface IStorageOptions {
}

/**
 * @interface IStorageDataInfo
 * @brief     IStorage が扱うデータの情報を格納するインターフェイス
 */
export interface IStorageDataInfo {
    // data type を指定. 既定値は text
    dataType?: "text" | "blob" | "buffer" | "binary";
    // mime type を指定 data type が "blob" の場合設定が必要
    mimeType?: string;
}

/**
 * @interface IStorageItemOperationOptions
 * @brief     IStorage.setItem/getItem に指定する基底オプションインターフェイス
 */
export interface IStorageItemOperationOptions extends IStorageOptions {
    dataInfo?: IStorageDataInfo;
}

/**
 * @type  IStorageSetItemOptions
 * @brief IStorage.setItem() に使用するオプション
 */
export type IStorageSetItemOptions = IStorageItemOperationOptions;

/**
 * @type  IStorageGetItemOptions
 * @brief IStorage.getItem() に使用するオプション
 */
export type IStorageGetItemOptions = IStorageItemOperationOptions;

/**
 * @interface IStorageRemoveItemOptions
 * @brief     IStorage.removeItem に指定するオプションインターフェイス
 */
export interface IStorageRemoveItemOptions extends IStorageOptions {
}

/**
 * @interface IStorage
 * @brief     ストレージを抽象化したインターフェイス
 */
export interface IStorage {
    /**
     * ストレージの種別
     * STORAGE_KIND の値を返却
     */
    kind: string;

    /**
     * データ設定
     *
     * @param key       [in] アクセス指定子
     * @param data      [in] データ
     * @param [options] [in] オプション
     * @returns promise オブジェクト
     */
    setItem(key: string, data: any, options?: IStorageSetItemOptions): IPromise<void>;

    /**
     * データ取得
     *
     * @param key       [in] アクセス指定子
     * @param [options] [in] オプション
     * @returns promise オブジェクト
     */
    getItem(key: string, options?: IStorageGetItemOptions): IPromise<any>;

    /**
     * 指定したデータを削除
     *
     * @param key       [in] アクセス指定子
     * @param [options] [in] オプション
     * @returns promise オブジェクト
     */
    removeItem(key: string, options?: IStorageRemoveItemOptions): IPromise<void>;

    /**
     * ストレージの破棄
     *
     * @param [options] [in] オプション
     * @returns promise オブジェクト
     */
    clear(options?: IStorageOptions): IPromise<void>;
}

//_____________________________________________________________________________________________//

/**
 * @interface IDeviceStorageOptions
 * @brief     DeviceStorage 操作に使用する共通オプションインターフェイス
 */
export interface IDeviceStorageOptions extends IStorageOptions {
    root?: string;      // "cordova.file.<dirctory>" を指定. 既定は "cordova.file.dataDirectory"
}

/**
 * @type  IDeviceStorageSetItemOptions
 * @brief DeviceStorage.setItem() に使用するオプション
 */
export interface IDeviceStorageSetItemOptions extends IStorageSetItemOptions, IDeviceStorageOptions {
}

/**
 * @type  IStorageGetItemOptions
 * @brief DeviceStorage.getItem() に使用するオプション
 */
export interface IDeviceStorageGetItemOptions extends IStorageGetItemOptions, IDeviceStorageOptions {
}

/**
 * @interface IDeviceStorageRemoveItemOptions
 * @brief     DeviceStorage.removeItem に指定するオプションインターフェイス
 */
export interface IDeviceStorageRemoveItemOptions extends IStorageRemoveItemOptions, IDeviceStorageOptions {
    target?: "both" | "file" | "directory";  // 削除ターゲット. 既定値は "both"
}

//_____________________________________________________________________________________________//

/**
 * @interface ISecureStorageOptions
 * @brief     SecureStorage 操作に使用する共通オプションインターフェイス
 */
export interface ISecureStorageOptions extends IStorageOptions {
    namespace?: string;      // 指定なしの場合、Config.namespace, $(document).find("head > title").text(), "cdp.storage" を使用
}

/**
 * @type  ISecureStorageSetItemOptions
 * @brief SecureStorage.setItem() に使用するオプション
 */
export interface ISecureStorageSetItemOptions extends IStorageSetItemOptions, ISecureStorageOptions {
}

/**
 * @type  ISecureStorageGetItemOptions
 * @brief SecureStorage.getItem() に使用するオプション
 */
export interface ISecureStorageGetItemOptions extends IStorageGetItemOptions, ISecureStorageOptions {
}

/**
 * @interface ISecureStorageRemoveItemOptions
 * @brief     SecureStorage.removeItem に指定するオプションインターフェイス
 */
export interface ISecureStorageRemoveItemOptions extends IStorageRemoveItemOptions, ISecureStorageOptions {
}
