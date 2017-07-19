import { Model } from "cdp/framework";

const TAG: string = "[pmo.model.Settings] ";

/**
 * @class Settngs
 * @brief 設定情報のモデルクラス
 */
export class Settings extends Model {

    private static s_instance: Settings = null;

    // constructor
    private constructor() {
        super();
        this.init();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.Model

    defaults(): any {
        return {
            "account.userId": "",
            "account.firstName": "",
            "account.lastName": "",
        };
    }

    ///////////////////////////////////////////////////////////////////////
    // public method

    /**
     * アカウント情報の設定
     *
     * @param accountData {Account.IAccountData} [in] アカウント情報
     * @return {Boolean} true: 成功 / false: 失敗
     */
    public setAccountData(accountData: any): boolean {
        // [NOTE] dummy
        return false;
    }

    /**
     * アカウント情報の破棄
     */
    public releaseAccountInfo(): void {
        this.set({
            "account.userId": "",
            "account.firstName": "",
            "account.lastName": "",
        });
    }

    /**
     * ログイン済みか判定
     */
    public isLogIn(): boolean {
        return false;
    }

    ///////////////////////////////////////////////////////////////////////
    // public static method

    //! シングルトン取得
    public static getInstance(): Settings {
        if (!Settings.s_instance) {
            Settings.s_instance = new Settings();
        }
        return Settings.s_instance;
    }

    ///////////////////////////////////////////////////////////////////////
    // private method

    // 初期化
    private init(): void {
        // noop
    }
}
