import {
    IPromise,
    Promise,
    Platform,
} from "cdp/framework";
import { Gate } from "cdp/bridge";

const TAG = "[bridge.SimpleGate] ";

/**
 * @class SimpleGate
 * @brief クライアント定義 NativeBridge.Gate クラス
 */
class SimpleGate extends Gate {
    /**
     * constructor
     *
     */
    constructor() {
        super({     // super constructor には CDP.NativeBridge.Feature を指定 (必須)
            name: "SimpleGate",
            android: {
                packageInfo: "com.sony.cdp.cafeteria.nativebridge.SimpleGate",  // Android Java でリフレクションに使用するクラス
            },
            ios: {
                packageInfo: "CafeteriaSimpleGate",                             // iOS Objective-C でリフレクションに使用するクラス
            },
        });
    }

    ///////////////////////////////////////////////////////////////////////
    // public methods

    /**
     * coolMethod
     * クライアントメソッドの定義
     *
     * 引数は任意の primitive, JSON で OK. (cordova 互換. void も可能)
     * 戻り値は既定で Promise の形をとる
     */
    public coolMethod(arg1: number, arg2: boolean, arg3: string, arg4: object): IPromise<any> {
        /*
         * super.exec() 呼び出し
         * 第1引数は メソッド名を文字列で指定
         * 第2引数は arguments を使用可能. (<any>キャストは必要)
         *
         * !! 注意点 !!
         * 引数に null/undefined が渡るような場合、このレイヤで default 引数などを用いて実体を入れる必要があり。
         */
        return super.exec("coolMethod", <any>arguments);
    }

    /**
     * threadMethod
     * Native 側で非同期
     */
    public threadMethod(arg1: number, arg2: boolean, arg3: string, arg4: object): IPromise<any> {
        return super.exec("threadMethod", <any>arguments);
    }

    /**
     * progressMethod
     * 非同期処理のキャンセル
     */
    public progressMethod(): IPromise<any> {
        return super.exec("progressMethod");
    }

    ///////////////////////////////////////////////////////////////////////
    // fallback methods:

    /**
     * PC 環境用フォールバック関数
     */
    public static stubOperation(...arg: any[]): IPromise<void> {
        return <any>Promise.resolve();
    }
}

//_____________________________________________________________________________________________//

let s_gate: SimpleGate;

function getGate(): SimpleGate {
    if (!s_gate) {
        s_gate = new SimpleGate();
    }
    return s_gate;
}

export function coolMethod(arg1: number, arg2: boolean, arg3: string, arg4: object): IPromise<void> {
    if (Platform.Mobile) {
        return getGate().coolMethod(arg1, arg2, arg3, arg4);
    } else {
        return SimpleGate.stubOperation("coolMethod", arg1, arg2, arg3, arg4);
    }
}

export function threadMethod(arg1: number, arg2: boolean, arg3: string, arg4: object): IPromise<void> {
    if (Platform.Mobile) {
        return getGate().threadMethod(arg1, arg2, arg3, arg4);
    } else {
        return SimpleGate.stubOperation("threadMethod", arg1, arg2, arg3, arg4);
    }
}

export function progressMethod(): IPromise<void> {
    if (Platform.Mobile) {
        return getGate().progressMethod();
    } else {
        return SimpleGate.stubOperation("progressMethod");
    }
}
