import { Framework } from "cdp";
import { IStorage, STORAGE_KIND } from "./interfaces";
import WebStorage from "./web-storage";
import DeviceStorage from "./device-storage";
import SecureStorage from "./secure-storage";

const TAG = "[cdp.storage.storage-access] ";

/**
 * @class StorageAccess
 * @brief 指定された IStorage を管理するユーティリティクラス
 */
export class StorageAccess {
    ///////////////////////////////////////////////////////////////////////
    // public static methods

    /**
     * 指定した IStorage インスタンスを取得
     * PC 環境では DeviceStorage, SecureStorage は WebStorage にフォールバックされる
     *
     * @param kind [in] STORAGE_KIND に定義される文字列を指定
     * @returns IStorage instance
     */
    public static getStorage(kind: string): IStorage {
        switch (kind) {
            case STORAGE_KIND.DEVICE_STORAGE:
                if (!Framework.Platform.Mobile) {
                    return new WebStorage();
                } else {
                    return new DeviceStorage();
                }
            case STORAGE_KIND.SECURE_STORAGE:
                if (!Framework.Platform.Mobile) {
                    return new WebStorage();
                } else {
                    return new SecureStorage();
                }
            case STORAGE_KIND.WEB_STORAGE:
                return new WebStorage();
            default:
                console.error(TAG + `unknown storage kind. [kind: ${kind}]`);
                return null;
        }
    }
}
