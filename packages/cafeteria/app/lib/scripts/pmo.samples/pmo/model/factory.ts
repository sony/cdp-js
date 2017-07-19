import {
    ContentProvider,
    MediaProvider,
} from "./interfaces";
import { Settings } from "./settings";
import StubDashboard from "./stub-dashboard";
import StubMediaProvider from "./stub-media-provider";

const TAG = "[pmo.model.Factory] ";

/**
 * @class Factory
 * @brief Model の Factory ユーティリティクラス
 */
export class Factory {

    private static s_mediaProvider: MediaProvider.IProvider = null;
    private static s_contentProviders = {};

    ///////////////////////////////////////////////////////////////////////
    // public static method

    /**
     * 初期化
     * 必要なスクリプトを読み込む。 Dashboard からコールされる。
     *
     * @return {jQueryPromise} done()
     */
    public static initialize(): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            });
        });
    }

    /**
     * コンテントプロバイダの取得
     *
     * @param type {String} [in] タイプを指定 [calendar | album | postcard | dashboard | friend | reserved | imageorganizer] のいずれか
     * @return {ContentProvider.IProvider} コンテントプロバイダインスタンス
     */
    public static getContentProvider(type: string): ContentProvider.IProvider {
        const key = type + ":stub";
        if (!Factory.s_contentProviders[key]) {
            Factory.s_contentProviders[key] = Factory.createContentProvider(type);
        }
        return <ContentProvider.IProvider>Factory.s_contentProviders[key];
    }

    /**
     * コンテントプロバイダの生成
     *
     * @param type {String} [in] タイプを指定 [calendar | album | postcard | dashboard | friend | reserved | imageorganizer] のいずれか
     * @return {ContentProvider.IProvider} コンテントプロバイダインスタンス
     */
    private static createContentProvider(type: string): ContentProvider.IProvider {
        switch (type) {
            case "dashboard":
                return new StubDashboard();
            default:
                console.warn(TAG + "unknown data-provider type: " + type);
                return null;
        }
    }

    /**
     * メディアプロバイダの取得
     *
     * @return {MediaProvider.IProvider} メディアプロバイダインスタンス
     */
    public static getMediaProvider(): MediaProvider.IProvider {
        if (!Factory.s_mediaProvider) {
            Factory.s_mediaProvider = new StubMediaProvider();
        }
        return Factory.s_mediaProvider;
    }

    /**
     * 設定オブジェクトの取得
     *
     * @return {Model.Settings} 設定用モデルオブジェクト
     */
    public static getSettings(): Settings {
        return Settings.getInstance();
    }
}
