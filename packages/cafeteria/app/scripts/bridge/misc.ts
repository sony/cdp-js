import {
    IPromise,
    Promise,
    Platform,
} from "cdp/framework";
import {
    Gate,
    IResult,
} from "cdp/bridge";

const TAG = "[bridge.Misc] ";

/**
 * @enum  STATUSBAR_STYLE
 * @param ステータスバーのスタイルーコード
 */
export enum STATUSBAR_STYLE {
    DEFAULT = 0,
    LIGHT_CONTENT = 1,
}

/**
 * @class Misc
 * @brief 雑多なNative処理を実現するクラス.
 *        ここでは戻り値を返却する前に加工する例を取り上げる.
 *        PC 環境においてはフォールバックする.
 */
class Misc extends Gate {

    /**
     * constructor
     *
     */
    constructor() {
        super({
            name: "Misc",
            android: {
                packageInfo: "com.sony.cdp.cafeteria.nativebridge.Misc",    // Android Java でリフレクションに使用するクラス
            },
            ios: {
                packageInfo: "CafeteriaNativeBridgeMisc",                   // iOS Objective-C でリフレクションに使用するクラス
            },
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // public methods:

    /**
     * UUID を生成
     *
     * @return UUID ハイフンなし小文字に正規化した文字列
     */
    public genarateUUID(): IPromise<string> {
        return new Promise((resolve, reject, dependOn) => {
            dependOn(super.exec("generateUUID"))
                .done((uuid: string, result: IResult) => {
                    // ハイフンの除去と小文字に正規化
                    resolve(uuid.split("-").join("").toLowerCase(), result);
                })
                .fail((error: IResult) => {
                    reject(error);
                });
        });
    }

    /**
     * ステータスバーの色を変更 (iOS)
     *
     * @param  styleId [in] STATUSBAR_COLOR を指定
     * @return Promise オブジェクト
     */
    public changeStatusBarColor(styleId: STATUSBAR_STYLE): IPromise<string> {
        return new Promise((resolve, reject, dependOn) => {
            dependOn(super.exec("changeStatusBarColor", [styleId]))
                .done((result: IResult) => {
                    resolve("changed: " + STATUSBAR_STYLE[styleId]);
                })
                .fail((error: IResult) => {
                    if (CDP.NativeBridge.ERROR_METHOD_NOT_FOUND === error.code ||
                        CDP.NativeBridge.ERROR_CLASS_NOT_FOUND === error.code
                    ) {
                        // 正常系
                        resolve("changeStatusBarColor() not supported.");
                    } else {
                        reject(error);
                    }
                });
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // fallback methods:

    /**
     * UUID 生成のフォールバック関数
     * RFC 4122 に準拠しておらず、アルゴリズムとしては強固でないため、実運用には使用しないこと.
     */
    public static genarateUUIDFallback(): IPromise<string> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // ハイフンの除去と小文字に正規化
                resolve(Misc.createUUID().split("-").join("").toLowerCase());
            });
        });
    }

    // UUID の生成 (cordova compatible)
    private static createUUID(): string {
        console.warn(TAG + "createUUID() is not based upon RFC 4122.");

        const UUIDcreatePart = (length: number) => {
            let uuidpart = "";
            for (let i = 0; i < length; i++) {
                let uuidchar = parseInt((Math.random() * 256).toString(), 10).toString(16);
                if (uuidchar.length === 1) {
                    uuidchar = "0" + uuidchar;
                }
                uuidpart += uuidchar;
            }
            return uuidpart;
        };

        return UUIDcreatePart(4) + "-" +
            UUIDcreatePart(2) + "-" +
            UUIDcreatePart(2) + "-" +
            UUIDcreatePart(2) + "-" +
            UUIDcreatePart(6);
    }

    /**
     * PC 環境用汎用フォールバック関数
     */
    public static nullOperation(): IPromise<string> {
        return new Promise((resolve) => {
            resolve(TAG + "method not supported");
        });
    }
}

//_____________________________________________________________________________________________//

let s_Misc: Misc;

function getGate(): Misc {
    if (!s_Misc) {
        s_Misc = new Misc();
    }
    return s_Misc;
}

/**
 * UUID の生成
 *
 * @return {IPromise<string>} UUID ハイフンなし文字列
 */
export function generateUUID(): IPromise<string> {
    if (Platform.Mobile) {
        return getGate().genarateUUID();
    } else {
        return Misc.genarateUUIDFallback();
    }
}

/**
 * ステータスバーの色を変更
 *
 * @param  {STATUSBAR_COLOR} styleId [in] STATUSBAR_COLOR を指定
 * @return {IPromise<void>} Promise オブジェクト
 */
export function changeStatusBarColor(styleId: STATUSBAR_STYLE): IPromise<string> {
    if (Platform.Mobile) {
        return getGate().changeStatusBarColor(styleId);
    } else {
        return Misc.nullOperation();
    }
}
