Developlers Guide
======

`cordova-plugin-cdp-nativebridge` および `cdp.nativebridge.js` モジュールの使い方を解説するページです。

- [なぜ必要なの?](#WHY)
- [設計情報](#DEVINFO)
    - [モジュール構成](#MODULE)
    - [クラス構成](#CLASS)
    - [Native Bridge クラスの呼び出し規約](#CALLING_AGREEMENT)
- [Native Bridge クラスの作り方/使い方](#HOW_TO)
    - [JSレイヤ](#JS)
        - [JSレイヤ で使用可能なメソッド一覧](#JS_METHOD)
    - [Nativeレイヤ (Android)](#JAVA)
        - [実践1: 非同期処理](#JAVA_ASYNC)
        - [実践2: 非同期処理のキャンセル対応](#JAVA_ASYNC_CANCELING)
        - [実践3: Cordova Plugin Compatible な呼び出し方](#JAVA_COMPATIBLE)
        - [Nativeレイヤ で使用可能なメソッド一覧](#JAVA_METHOD)
    - [Nativeレイヤ (iOS)](#OBJC)
        - [実践1: 非同期処理](#OBJC_ASYNC)
        - [実践2: 非同期処理のキャンセル対応](#OBJC_ASYNC_CANCELING)
        - [実践3: Cordova Plugin Compatible な呼び出し方](#OBJC_COMPATIBLE)
        - [Nativeレイヤ で使用可能なメソッド一覧](#OBJC_METHOD)

# <a name="WHY"/>1:なぜ必要なの?

`cordova 3.x+` から、JS Layer と Native Layer の通信を行うには、通常 cordova plugin を作成する必要があります。
しかしながら、Plugin 機構は機能を再利用したい場合に非常に有効な手段となりますが、以下の場合にはオーバースペックで少々実装コストが高い傾向にあると考えます。

- 雑多に簡単なNative 通信をしたいだけのとき
- 既にある Native アプリのコードとつなぎたいとき (Plugin にしても、再利用性が低いとき)

`cordova-plugin-cdp-nativebridge` と `cdp.nativebridge.js` を使用すると、以下のことをするだけ済むようになります。

- 1. `cordova-plugin-cdp-nativebridge` を汎用 NativeBridge plugin としてプロジェクトにインストールする。
- 2. `cdp.nativebridge.js` から派生した JavaScript (TypeScript) のクラスを作成し、メソッドを追加する。
- 3. JavaScriptクラスに対応した、Native クラスを作成し、対応したメソッドを追加する。

これだけです。クラスの単位に制約はありません。あとは自由に JavaScript ファイルと Native ファイルを追加してください。plugin.xml を用意する必要もありません。

本ライブラリは、[JS file : Native file] = [1:1] となるような、直感的に実装できる仕組みを提供します。


# 2: <a name="DEVINFO"/>設計情報

詳細な使い方の前に、`cordova-plugin-cdp-nativebridge` と `cdp.nativebridge.js` の基本設計について触れておきます。


## <a name="MODULE"/>2-1:モジュール構成

![nativebridge_modules](../images/nativebridge_modules.png)

| module/package                     |type                              | description                                                             |
|:-----------------------------------|:---------------------------------|:------------------------------------------------------------------------|
| cordova.js                         | 3rd js module                    | cordova 本体                                                            |
| jquery.js                          | 3rd js module                    | jQuery. 非同期ユーティリティ Deferred を使用                            |
| cdp.promise.js                     | CDP js module                    | CDP のユーティリティライブラリ cancel 可能な Promise オブジェクトを提供 |
| `cdp.nativebridge.js`              | CDP js module                    | cordova-plugin-cdp-nativebridge のラッパー                              |
| `cdp.plugin.nativebridge.js`       | CDP cordova plugin module        | 汎用 Native Bridge を実現する cordova plugin js module                  |
| `com.sony.cdp.plugin.nativebridge` | CDP cordova plugin native source | 汎用 Native Bridge を実現する cordova plugin pakage (Android)           |
| client_source.java                 | client source                    | クライアントが用意する Native 側のソース                                |
| client_source.js(.ts)              | client source                    | クライアントが用意する JS 側のソース                                    |

- `cordova-plugin-cdp-nativebridge` はその名のとおり cordova plugin です。他のライブラリには依存しておらず、単体で成立する plugin です。
- `cdp.nativebridge.js` は JS-Native の対称性を実現するためのJS モジュールです。このモジュールは cdp.promise.js, jquery.js に依存します。


## <a name="CLASS"/>2-2:クラス構成

![nativebridge_classes](../images/nativebridge_classes.png)

| class                                         | description                                                                                                          |
|:----------------------------------------------|:---------------------------------------------------------------------------------------------------------------------|
| `CDP.NativeBridge.Gate`                       | JSレイヤで実装するクラスの基底クラス. 橋門でいう門に該当。cdp.nativebridge.js が提供                                 |
| CDP.Plugin.NativeBridge                       | JSレイヤの Bridge クラス。橋そのものであり、クライアントは意識しなくても良い。cordva-plugin として実装               |
| com.sony.cdp.plugin.nativebridge.NativeBridge | Native レイヤ(Android)の Bridge クラス。橋そのものであり、クライアントは意識しなくても良い。cordva-plugin として実装 |
| `com.sony.cdp.plugin.nativebridge.Gate`       | Native レイヤ(Android)で実装するクラスの基底クラス. 橋門でいう門に該当。cordva-plugin が提供                         |

クライアントは以下を定義します。

    JS レイヤで `CDP.NativeBridge.Gate` から派生クラスを作成
    Native レイヤで`com.sony.cdp.plugin.nativebridge.Gate` から派生クラスを作成

すると、JSレイヤで定義したクラスがNativeレイヤで反応するようになります。

![nativebridge_classes](../images/bridge_gate.png)


## <a name="CALLING_AGREEMENT"/>2-3:Native Bridge クラスの呼び出し規約

このフレームワークが提供するクラスの呼び出し規約の概念図です。

![nativebridge_calling_convention](../images/nativebridge_calling_convention.png)

- JSレイヤからNativeレイヤへの通信は、メソッドコールと同等とみなすことができます。
- 反対にNativeレイヤからJSレイヤへの通信は、コールバック (`cdp.nativebridge.js`からは Promise) と同等とみなすことができます。

この振る舞いは、cordova 既定の通信モデルと等価であるためです。
一般的なハイブリッドアプリケーションでは、アプリケーションモデルの上位レイヤにJSレイヤを、下位の機能サービスレイヤにてNativeレイヤを使用します。

もしあなたが、Native → JS 方向への通信をメソッドコールで行いたいのであれば、もう1階層ラッパーを設けることで実現は可能です。
しかし本 Native Bridge フレームワークから機能は提供しないことを留めておいてください。


# <a name="HOW_TO"/>3:Native Bridge クラスの作り方/使い方

## <a name="JS"/>3-1:JSレイヤ

JSレイヤのクラス定義の例を以下に示します。(TypeScript を使用しています。)

```javascript
/// <reference path="modules/include/cdp.nativebridge.d.ts" />

module SampleApp {

    import Promise = CDP.NativeBridge.Promise;

    var TAG: string = "[SampleApp.SimpleGate] ";

    /**
     * @class SimpleGate
     * @brief クライアント定義 NativeBridge.Gate クラス
     */
    export class SimpleGate extends CDP.NativeBridge.Gate {
        /**
         * constructor
         *
         */
        constructor() {
            super({                                                     // super constructor には CDP.NativeBridge.Feature を指定 (必須)
                name: "SimpleGate",
                android: {
                    packageInfo: "com.sony.cdp.sample.SimpleGate",      // Android Java でリフレクションに使用するクラス
                },
                ios: {
                    packageInfo: "SMPSimpleGate",                       // iOS Objective-C でリフレクションに使用するクラス
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
        public coolMethod(arg1: number, arg2: boolean, arg3: string, arg4: Object): Promise {
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
    }
}
```
メソッド要件の注意点として以下があります。

- `cordova` を呼び出すため必ず非同期メソッドとなります。
    - 戻り値の型は既定で `CDP.NativeBridge.Promise` です。
- 引数に `null`, `undefined` が渡ると、`CDP.NativeBridge.ERROR_INVALID_ARG` が発生します。
    - 渡る可能性がある場合は、default 引数などを用いてメソッド定義内で実体に置換してください。
- `<platform>.packageInfo` に指定する値は、プロジェクトに一意になるような名前である必要があります。
    - 文字列からクラスを実体化(リフレクション)するため、被らないクラス名で運用する必要があります。(cordova plugin root クラス名も同様)
- `<platform>` プロパティを省略す場合、その省略された platform 上で機能を呼び出すと `CDP.NativeBridge.ERROR_NOT_SUPPORT` が返ります。
    - このエラーをハンドリングすることで、アプリケーション仕様内で正常系として扱うこともできます。
    - たとえば `android` にしかない機能の呼び出しをするような場合、`ios` プロパティを省略することができます。


上記のクラスは以下のように使用できます。

```javascript
    function main(): void {
        // インスタンスを作成
        var gate = new SampleApp.SimpleGate();

        // メソッド呼び出し
        gate.coolMethod(1, false, "test", { ok: true })
            .then((result: CDP.NativeBridge.IResult) => {
                // 成功
                console.log(result.code === CDP.NativeBridge.SUCCESS_OK);   // true
                console.log(result.params);                                 // object (戻り値情報)
            })
            .fail((error: CDP.NativeBridge.IResult) => {
                // 失敗
                console.error(error.message);
            });
    }
```

### <a name="JS_METHOD"/>3-1-1:JSレイヤ で使用可能なメソッド一覧

- CDP.NativeBridge.Gate クラスが提供するメソッド/プロパティは以下です。

 ※ExecOptionについては、javadoc コメントを参照してください。本稿では触れません。

| method                                                               | description                                                                                                                                     |
|:---------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------|
| `exec(method: string, args?: any[], options?: ExecOptions): Promise` | 指定した method 名に対応する Native Class の method を呼び出します。                                                                            |
| `cancel(options?: ExecOptions): JQueryPromise<IResult>`              | すべてのタスクのキャンセルします。キャンセルが返す Promise オブジェクト自体は成否のみが返ります。タスクの実行結果は exec() の戻り値に返ります。 |
| `dispose(options?: ExecOptions): JQueryPromise<IResult>`             | Native の参照を解除します。破棄の直前に呼ぶことを想定しており、以降、exec は無効となります。戻り値はキャンセルと同等です。                      |


| property                          | description                                                                                                                                                   |
|:----------------------------------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `bridge: CDP.Plugin.NativeBridge` | cordova plugin の NativeBridge オブジェクトにアクセスします。protected 属性です。低レベルな `cordova.exec()` 互換 API である、`bridge.exec()` が使用可能です。|


## <a name="JAVA"/>3-2:Nativeレイヤ (Android)

NativeレイヤのJavaクラス定義の例を以下に示します。


```java
package com.sony.cdp.sample;

import org.apache.cordova.CallbackContext;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.sony.cdp.plugin.nativebridge.Gate;
import com.sony.cdp.plugin.nativebridge.MessageUtils;


/**
 * @class SimpleGate
 * @brief サンプル Gate クラス
 */
public class SimpleGate extends Gate {
    private static final String TAG = "[com.sony.cdp.sample][Native][SimpleGate] ";

    ///////////////////////////////////////////////////////////////////////
    // public mehtods

    /**
     * サンプルメソッド
     * JavaScript レイヤで指定したメソッドと引数を受けることができる
     * 数値は double 固定
     *
     * 値を戻すには
     *  - returnParams()
     * を使用する。
     *
     * @throws JSONException
     */
    public void coolMethod(double arg1, boolean arg2, String arg3, JSONObject arg4) throws JSONException {
        // ※第1引数 number → double にマッピングされる。

        // 任意の処理
        String msg = "arg1: " + String.valueOf((int)arg1) + ", arg2: " + String.valueOf(arg2) + ", arg3: " + arg3;
        msg += (", 日本語でOK: " + String.valueOf(arg4.getBoolean("ok")));

        // returnParams() は Object を1つ返却できる。(return ステートメントと同じセマンティックス)
        returnParams(msg);
    }
}

```
※注意点:
- js の `number` 型は Java の `double` にマッピングされます。
    - js の number の仕様に合わせています。
    - しかしながら、Cordova Framework の中で、整数は `int` に、小数は `float` に一度変換されているため、精度を求めることはあきらめなくてはいけません。

Gate クラスは CordovaPlugin クラスと同じメンバ変数を持っています。以下のプロパティへはアクセス可能です。
※ただし `protected` メンバとなっており、可視性を落としてあります。
- `cordova`
- `webView`
- `preferences`

### <a name="JAVA_ASYNC"/>3-2-1:実践1: 非同期処理

非同期処理がしたい場合は以下のように`context`を取得し、cordova プラグインの作法を踏襲できます。

```java
    /**
     * サンプルメソッド (スレッドを扱う例)
     * 引数に "final" を指定しても、リフレクションコール可能
     * getContext() より、CallbackContext 互換の MethodContext にアクセス可能
     *
     * スレッド内では
     *  - notifyParams()
     *  - resolveParams()
     *  - rejectParams()
     * がそれぞれ使用可能
     *
     */
    public void threadMethod(final double arg1, final boolean arg2, final String arg3, final JSONObject arg4) {
        // context オブジェクトを基底クラスより取得. 引数なしで取得すると暗黙的コールバックを行わない。
        // [!! 注意 !!] context の取得は呼び出し thread でのみ有効
        final MethodContext context = getContext();

        // cordova インスタンスは基底クラスの protected property として定義されている。
        // ここでは cordova 公式ドキュメントの作法でスレッドを起こす。
        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                String errorMsg;
                try {
                    // notifyParams は jQuery.Deferred.notify() と同じセマンティクスを持つ
                    //  ここで使用しているのは keepCallback = true が暗黙的に設定される版
                    //  また、Result Code は SUCCESS_PROGRESS となる。
                    notifyParams(context, (int)arg1, arg2);
                    notifyParams(context, arg3, arg4);

                    // 任意の処理
                    String msg = "arg1: " + String.valueOf((int)arg1) + ", arg2: " + String.valueOf(arg2) + ", arg3: " + arg3;
                    msg += (", 日本語でOK: " + String.valueOf(arg4.getBoolean("ok")));

                    // resolveParams は jQuery.Deferred.resolve() と同じセマンティクスを持つ
                    // このメソッドで keepCallback = false となる
                    resolveParams(context, msg);
                } catch (JSONException e) {
                    errorMsg = "Invalid JSON object";
                    Log.e(TAG, errorMsg, e);
                    // resolveParams は jQuery.Deferred.reject() と同じセマンティクスを持つ
                    // このメソッドで keepCallback = false となる
                    rejectParams(MessageUtils.ERROR_FAIL, errorMsg, context);
                }
            }
        });
    }
```

非同期処理はJSレイヤでは以下のように受けることができます。

```javascript
    function main(): void {
        // インスタンスを作成
        var gate = new SampleApp.SimpleGate();
        var progressValue = [];

        // 非同期メソッド呼び出し
        gate.threadMethod(1, false, "test", { ok: true })
            .progress((result: CDP.NativeBridge.IResult) => {
                // 進捗
                console.log(result.code === CDP.NativeBridge.SUCCESS_PROGRESS);   // true
                progressValue.push(result);
            })
            .then((result: CDP.NativeBridge.IResult) => {
                // 成功
                console.log(result.code === CDP.NativeBridge.SUCCESS_OK);   // true
                console.log(result.params);                                 // object (戻り値情報)
                console.log(progressValue[0].params[0] === 1);              // true
                console.log(progressValue[0].params[1] === false);          // true
                console.log(progressValue[1].params[0] === "test");         // true
                console.log(progressValue[2].params[1].ok === true);        // true
            })
            .fail((error: CDP.NativeBridge.IResult) => {
                // 失敗
                console.error(error.message);
            });
    }
```

### <a name="JAVA_ASYNC_CANCELING"/>3-2-2:実践2: 非同期処理のキャンセル対応

非同期処理はキャンセル対応する必要があります。

- JSレイヤからのキャンセル
```javascript
    function main(): void {
        // インスタンスを作成
        var gate = new SampleApp.SimpleGate();

        // 非同期メソッド呼び出し
        var promise = gate.progressMethod();
        // キャンセルコール
        promise.abort();

        promise
            .progress((result: CDP.NativeBridge.IResult) => {
                :
            })
            .then((result: CDP.NativeBridge.IResult) => {
                :
            })
            .fail((error: CDP.NativeBridge.IResult) => {
                // 失敗
                console.log(error.code === CDP.NativeBridge.ERROR_CANCEL);   // true
                console.error(error.message);
            });
    }
```

- Native レイヤ (Java) の対応
```java
    /**
     * ワーカースレッドとキャンセルの例
     * cancel() がコールされるまで、100 [msec] ごとに進捗を通知するサンプル
     */
    public void progressMethod() {
        // [!! 注意 !!] context の取得は呼び出し thread でのみ有効
        final MethodContext context = getContext();

        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                String errorMsg;
                int progress = 0;
                try {
                    // キャンセル対象処理として登録
                    setCancelable(context);

                    // 任意の処理
                    while (true) {
                        // キャンセルされたかチェック
                        if (isCanceled(context)) {
                            rejectParams(MessageUtils.ERROR_CANCEL, TAG + "progressMethod() canceled.", context);
                            break;
                        }
                        notifyParams(context, progress);
                        progress++;
                        Thread.sleep(100);
                    }

                } catch (InterruptedException e) {
                    errorMsg = "InterruptedException occur.";
                    Log.e(TAG, errorMsg, e);
                    rejectParams(MessageUtils.ERROR_FAIL, errorMsg, context);
                } finally {
                    // キャンセル対象から登録解除
                    removeCancelable(context);
                }
            }
    }

    //! キャンセルイベントハンドラ
    @Override
    protected void onCancel(String taskId) {
        // キャンセルが発生した場合、onCancel() が発火
        // 引数からタスクを特定し、独自の処理をオーバーライドすることも可能
        Log.d(TAG, "cancel task: " + taskId);
    }
```

### <a name="JAVA_COMPATIBLE"/>3-2-3:実践3: Cordova Plugin Compatible な呼び出し方

cordova 公式準拠のやり方を踏襲したい場合があります。このときは Cordova Plugin Compatible なメソッド呼び出しが利用可能です。

- JS レイヤ
```javascript
    function main(): void {
        // インスタンスを作成
        var gate = new SampleApp.SimpleGate();
        var bin: ArrayBuffer;
        :

        // オプションに "compatible: true" を指定
        gate.compatibleMethod(bin, { compatible: true })
            .then((result: CDP.NativeBridge.IResult) => {
                :
            })
            .fail((error: CDP.NativeBridge.IResult) => {
                :
            });
    }
```

- Native レイヤ (Java)

```java
    /**
     * Cordova 互換ハンドラ (CordovaArgs 版)
     * NativeBridge からコールされる
     * compatible オプションが有効な場合、このメソッドがコールされる
     * クライアントは本メソッドをオーバーライド可能
     *
     * @param action          [in] アクション名.
     * @param args            [in] exec() 引数.
     * @param callbackContext [in] CallbackContext を格納. MethodContext にダウンキャスト可能
     * @return  action の成否 true:成功 / false: 失敗
     */
    @Override
    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        // callbackContext は MethodContext にダウンキャスト可能
        MethodContext context = (MethodContext)callbackContext;

        if (action.equals("compatibleMethod")) {

            // 任意の処理
            :
            // CallbackContext method へアクセス
            context.success(message);
            return true;
        }
        return false;
    }
```

### <a name="JAVA_METHOD"/>3-2-4:Nativeレイヤ で使用可能なメソッド一覧

- com.sony.cdp.plugin.nativebridge.Gate クラスが提供するメソッドは以下です。

 ※より自由にコールバックを操作するためには、com.sony.cdp.plugin.nativebridge.MessageUtils の javadoc コメントを参照してください。

| method                                                                                                   | description                                                                                                                                                                                                 |
|:---------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException` | Cordova 互換ハンドラです。{ compatible: true } を指定したときに有効になります。 CordovaArgs 版と JSONArray 版のオーバーライドが可能です。                                                                   |
| `MethodContext getContext(boolean autoSendResult)`                                                       | メソッドの開始スレッドのみアクセスできます。非同期処理を行う場合、callback に必要な情報としてキャッシュする必要があります。引数なし版は、`autoSendResult` は `false` に設定されます。                       |
| `void returnParams(Object param)`                                                                        | 結果を JavaScript へ返却します。`return` ステートメントと同等のセマンティクスを持ち、開始スレッドからのみ呼び出すことができます。                                                                           |
| `void notifyParams(boolean keepCallback, final MethodContext context, Object... params)`                 | 値を JavaScript へ通知します。`jQuery.Deferred.notify` メソッドと同等のセマンティクスを持ちます。`keepCallback` 無し版は、既定で `true` が設定されます。`ResultCode` は `SUCCESS_PROGRESS` が設定されます。 |
| `void resolveParams(finale MethodContext context, Object... params)`                                     | 値を JavaScript へ返却します。`jQuery.Deferred.resolve` メソッドと同等のセマンティクスを持ちます。完了ステータスとなり、`ResultCode` は `SUCCESS_OK`が設定されます。                                        |
| `void rejectParams(int code, String message, final final MethodContext context, Object... params)`       | エラーを JavaScript へ返却します。`jQuery.Deferred.reject` メソッドと同等のセマンティクスを持ちます。完了ステータスとなり、簡易版では `ResultCode` は `ERROR_FAIL`が設定されます。                          |
| `void setCancelable(final MethodContext context)`                                                        | キャンセル可能タスクとして登録します。登録すると isCanceled(context) が有効になります。                                                                                                                     |
| `void removeCancelable(final MethodContext context)`                                                     | キャンセル可能タスクを登録解除します。                                                                                                                                                                      |
| `boolean isCanceled(final MethodContext context)`                                                        | タスクがキャンセルされたか確認します。setCancelable(context) を呼んだときに有効になります。実際のキャンセル処理はクライアントが実装する必要があります。                                                     |
| `void onCancel(String taskId)`                                                                           | キャンセルイベントハンドラです。cancel()がコールされたときに呼び出されます。より詳細なキャンセル制御をおこないたい場合は、オーバーライドします。                                                            |


- com.sony.cdp.plugin.nativebridge.MethodContext クラスが提供するプロパティは以下です。

 CallbackContext +αのプロパティを有します。

| property          | type                 | description                                                                        |
|:------------------|:---------------------|:-----------------------------------------------------------------------------------|
| `className`       | `String`             | 対象クラス名が格納されています。                                                   |
| `methodName`      | `String`             | 対象メソッド名が格納されています。                                                 |
| `methodArgs`      | `JSONArray`          | 引数情報が格納されています。                                                       |
| `objectId`        | `String`             | インスタンスに紐づいたIDが格納されています。                                       |
| `taskId`          | `String`             | タスクID が格納されています。 onCancel() に渡された値との比較に使用できます。      |
| `compatible`      | `boolean`            | 互換情報が格納されています。                                                       |
| `threadId`        | `String`             | 呼び出しスレッド情報が格納されています。                                           |


## <a name="OBJC"/>3-3:Nativeレイヤ (iOS)

Nativeレイヤの Objective-C クラス定義の例を以下に示します。

```objc
#import "Plugins/CDPNativeBridge/CDPGate.h"
#import "Plugins/CDPNativeBridge/CDPNativeBridgeMsgUtils.h"

#define TAG @"[Sample][Native][SMPSimpleGate]"

// リフレクションでインスタンス化されるため、.h ファイルを用意しなくてもよい。
@interface SMPSimpleGate : CDPGate
@end

@implementation SMPSimpleGate

/**
 * サンプルメソッド
 * JavaScript レイヤで指定したメソッドと引数を受けることができる
 * boolean は BOOL 型になる
 * 第2引数以降の Label は記述しないこと
 *
 * 値を戻すには
 *  - returnParams
 * を使用する。
 */
- (void)coolMethod:(NSNumber*)arg1 :(BOOL)arg2 :(NSString*)arg3 :(NSDictionary*)arg4
{
    // ※第2引数 boolean → BOOL にマッピングされる。

    // 任意の処理
    NSString* msg = [NSString stringWithFormat:@"arg1: %@, arg2: %@, arg3: %@, 日本語でOK: %@"
                     , arg1, (arg2 ? @"true" : @"false"), arg3, (arg4[@"ok"] ? @"true" : @"false")];

    // returnParams は NSObject を1つ返却できる。(return ステートメントと同じセマンティックス)
    [self returnParams:msg];
}
```

※注意点:
- js の `boolean` 型は Objective-C の慣例に従い `BOOL` にマッピングされます。
    - Objective-C では C99 から使用可能な `bool` もありますが、iOS Framework 内では出番がほとんどありません。
- 第2引数以降の Label は使用できません。
    - Objective-C では Label 情報も関数の型として認識されます。リフレクションで解決するには、js から指定する必要が出てきます。
    - Objective-C の入り口までは、js メソッドのメタファーがあると割り切ってください。

CDPGate クラスは CDVPlugin クラスと同じメンバ変数を持っています。以下のプロパティへはアクセス可能です。
- `webView`
- `viewController`
- `commandDelegate`

### <a name="OBJC_ASYNC"/>3-3-1:実践1: 非同期処理

非同期処理がしたい場合は以下のように`context`を取得し、cordova プラグインの作法を踏襲できます。

```objc
/**
 * サンプルメソッド (スレッドを扱う例)
 * getContext より、CDVInvokedUrlCommand 互換の CDPMethodContext にアクセス可能
 *
 * スレッド内では
 *  - notifyParams
 *  - resolveParams
 *  - rejectParams
 * がそれぞれ使用可能
 */
- (void) threadMethod:(NSNumber*)arg1 :(BOOL)arg2 :(NSString*)arg3 :(NSDictionary*)arg4
{
    // context オブジェクトを基底クラスより取得. 引数なしで取得すると暗黙的コールバックを行わない。
    // [!! 注意 !!] context の取得は呼び出し thread でのみ有効
    const CDPMethodContext* context = [self getContext];
    
    // commandDelegate は基底クラスの protected property として定義されている。
    // ここでは cordova 公式ドキュメントの作法でスレッドを起こす。
    [self.commandDelegate runInBackground:^{
        // notifyParams は jQuery.Deferred.notify() と同じセマンティクスを持つ
        //  ここで使用しているのは keepCallback = YES が暗黙的に設定される版
        //  また、Result Code は SUCCESS_PROGRESS となる。
        [self notifyParams:context withParams:@[arg1, (arg2 ? @YES : @NO)]];
        [self notifyParams:context withParams:@[arg3, arg4]];

        // 任意の処理
        NSString* msg = [NSString stringWithFormat:@"arg1: %@, arg2: %@, arg3: %@, 日本語でOK: %@"
                         , arg1, (arg2 ? @"true" : @"false"), arg3, (arg4[@"ok"] ? @"true" : @"false")];

        if (succeeded) {
            // resolveParams は jQuery.Deferred.resolve() と同じセマンティクスを持つ
            // このメソッドで keepCallback = NO となる
            [self resolveParams:context withParams:@[msg]];
        } else {
            // rejectParams は jQuery.Deferred.reject() と同じセマンティクスを持つ
            // このメソッドで keepCallback = NO となる
            [self rejectParams:context withParams:nil andCode:CDP_NATIVEBRIDGE_ERROR_FAIL andMessage:@"error"];
        }
    }];
}
```

非同期処理はJSレイヤでは以下のように受けることができます。(3-2版と同じ)

```javascript
    function main(): void {
        // インスタンスを作成
        var gate = new SampleApp.SimpleGate();
        var progressValue = [];

        // 非同期メソッド呼び出し
        gate.threadMethod(1, false, "test", { ok: true })
            .progress((result: CDP.NativeBridge.IResult) => {
                // 進捗
                console.log(result.code === CDP.NativeBridge.SUCCESS_PROGRESS);   // true
                progressValue.push(result);
            })
            .then((result: CDP.NativeBridge.IResult) => {
                // 成功
                console.log(result.code === CDP.NativeBridge.SUCCESS_OK);   // true
                console.log(result.params);                                 // object (戻り値情報)
                console.log(progressValue[0].params[0] === 1);              // true
                console.log(progressValue[0].params[1] === false);          // true
                console.log(progressValue[1].params[0] === "test");         // true
                console.log(progressValue[2].params[1].ok === true);        // true
            })
            .fail((error: CDP.NativeBridge.IResult) => {
                // 失敗
                console.error(error.message);
            });
    }
```

### <a name="OBJC_ASYNC_CANCELING"/>3-3-2:実践2: 非同期処理のキャンセル対応

非同期処理はキャンセル対応する必要があります。

- JSレイヤからのキャンセル(3-2版と同じ)
```javascript
    function main(): void {
        // インスタンスを作成
        var gate = new SampleApp.SimpleGate();

        // 非同期メソッド呼び出し
        var promise = gate.progressMethod();
        // キャンセルコール
        promise.abort();

        promise
            .progress((result: CDP.NativeBridge.IResult) => {
                :
            })
            .then((result: CDP.NativeBridge.IResult) => {
                :
            })
            .fail((error: CDP.NativeBridge.IResult) => {
                // 失敗
                console.log(error.code === CDP.NativeBridge.ERROR_CANCEL);   // true
                console.error(error.message);
            });
    }
```

- Native レイヤ (Objective-C) の対応

```objc
/**
 * ワーカースレッドとキャンセルの例
 * cancel() がコールされるまで、100 [msec] ごとに進捗を通知するサンプル
 */
- (void) progressMethod
{
    // [!! 注意 !!] context の取得は呼び出し thread でのみ有効
    const CDPMethodContext* context = [self getContext];
    
    [self.commandDelegate runInBackground:^{
        int progress = 0;

        // キャンセル対象処理として登録
        [self setCancelable:context];

        // 任意の処理
        while (true) {
            // キャンセルされたかチェック
            if ([self isCanceled:context]) {
                NSString* msg = [NSString stringWithFormat:@"%@ progressMethod canceled.", TAG];
                [self rejectParams:context withParams:nil andCode:CDP_NATIVEBRIDGE_ERROR_CANCEL andMessage:msg];
                break;
            }
            [self notifyParams:context withParams:@[[NSNumber numberWithInteger:progress]]];
            progress++;
            [NSThread sleepForTimeInterval:0.1f];
        }

        // キャンセル対象から登録解除
        [self removeCancelable:context];
    }];
}
    
//! キャンセルイベントハンドラ
- (void) onCancel:(NSString*)taskId
{
    // キャンセルが発生した場合、onCancel が発火
    // 引数からタスクを特定し、独自の処理をオーバーライドすることも可能
    NSLog(@"%@ cancel task: %@", TAG, taskId);
}
```

### <a name="OBJC_COMPATIBLE"/>3-3-3:実践3: Cordova Plugin Compatible な呼び出し方

cordova 公式準拠のやり方を踏襲したい場合があります。このときは Cordova Plugin Compatible なメソッド呼び出しが利用可能です。

- JS レイヤ(3-2版と同じ)
```javascript
    function main(): void {
        // インスタンスを作成
        var gate = new SampleApp.SimpleGate();
        var bin: ArrayBuffer;
        :

        // オプションに "compatible: true" を指定
        gate.compatibleMethod(bin, { compatible: true })
            .then((result: CDP.NativeBridge.IResult) => {
                :
            })
            .fail((error: CDP.NativeBridge.IResult) => {
                :
            });
    }
```

- Native レイヤ (Objective-C)

```objc
/**
 * Cordova 互換ハンドラ
 * NativeBridge からコールされる
 * compatible オプションが有効な場合、このメソッドがコールされる
 *
 * @param command [in] CDVInvokedUrlCommand を格納. CDPMethodContext にダウンキャスト可能
 */
- (void) compatibleMethod:(CDVInvokedUrlCommand*)command
{
    // command は CDPMethodContext にダウンキャスト可能
    CDPMethodContext* context = (CDPMethodContext*)command;

    // 任意の処理
    NSDictionary* argsInfo = @{
                               @"taskId": context.taskId,
                               @"arg1": command.arguments[0],
                               @"arg2": command.arguments[1],
                               @"arg3": command.arguments[2],
                               @"arg4": command.arguments[3],
                              };
    NSArray* message = @[context.taskId, argsInfo];

    // pluginResult を commandDelegate に送信
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:message];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
```

### <a name="OBJC_METHOD"/>3-3-4:Nativeレイヤ で使用可能なメソッド一覧

- Plugins/CDPNativeBridge/CDPGate クラスが提供するメソッドは以下です。
 ※より自由にコールバックを操作するためには、CDPNativeBridgeMsgUtils の javadoc コメントを参照してください。

| method                                                                                                                                         | description                                                                                                                                                                                                 |
|:-----------------------------------------------------------------------------------------------------------------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `(CDPMethodContext*) getContext`                                                                                                               | メソッドの開始スレッドのみアクセスできます。非同期処理を行う場合、callback に必要な情報としてキャッシュする必要があります。引数なし版は、`autoSendResult` は `NO` に設定されます。                          |
| `(void) returnParams:(NSObject*)params`                                                                                                        | 結果を JavaScript へ返却します。`return` ステートメントと同等のセマンティクスを持ち、開始スレッドからのみ呼び出すことができます。                                                                           |
| `(void) notifyParams:(const CDPMethodContext*)context withParams:(NSArray*)params keepCallback:(BOOL)keepCallback`                             | 値を JavaScript へ通知します。`jQuery.Deferred.notify` メソッドと同等のセマンティクスを持ちます。`keepCallback` 無し版は、既定で `YES` が設定されます。`ResultCode` は `SUCCESS_PROGRESS` が設定されます。  |
| `(void) resolveParams:(const CDPMethodContext*)context withParams:(NSArray*)params`                                                            | 値を JavaScript へ返却します。`jQuery.Deferred.resolve` メソッドと同等のセマンティクスを持ちます。完了ステータスとなり、`ResultCode` は `SUCCESS_OK`が設定されます。                                        |
| `(void) rejectParams:(const CDPMethodContext*)context withParams:(NSArray*)params andCode:(NSInteger)errorCode andMessage:(NSString*)errorMsg` | エラーを JavaScript へ返却します。`jQuery.Deferred.reject` メソッドと同等のセマンティクスを持ちます。完了ステータスとなり、簡易版では `ResultCode` は `ERROR_FAIL`が設定されます。                          |
| `(void) setCancelable:(const CDPMethodContext*)context`                                                                                        | キャンセル可能タスクとして登録します。登録すると isCanceled  が有効になります。                                                                                                                             |
| `(void) removeCancelable:(const CDPMethodContext*)context`                                                                                     | キャンセル可能タスクを登録解除します。                                                                                                                                                                      |
| `(BOOL) isCanceled:(const CDPMethodContext*)context`                                                                                           | タスクがキャンセルされたか確認します。setCancelable(context) を呼んだときに有効になります。実際のキャンセル処理はクライアントが実装する必要があります。                                                     |
| `(void) onCancel:(NSString*)taskId`                                                                                                            | キャンセルイベントハンドラです。cancel()がコールされたときに呼び出されます。より詳細なキャンセル制御をおこないたい場合は、オーバーライドします。                                                            |


-  Plugins/CDPNativeBridge/CDPMethodContext クラスが提供するプロパティは以下です。
 CDVInvokedUrlCommand +αのプロパティを有します。

| property          | type                      | description                                                                        |
|:------------------|:--------------------------|:-----------------------------------------------------------------------------------|
| `commandDelegate` | `id <CDVCommandDelegate>` | Command Delegate proxy クラスです。                                                |
| `objectId`        | `NSString*`               | インスタンスに紐づいたIDが格納されています。                                       |
| `taskId`          | `NSString*`               | タスクID が格納されています。 onCancel() に渡された値との比較に使用できます。      |
| `compatible`      | `BOOL`                    | 互換情報が格納されています。                                                       |
| `threadId`        | `NSString*`               | 呼び出しスレッド情報が格納されています。                                           |

※CDVInvokedUrlCommand には初めから以下のプロパティが格納されています。
- `className`
- `methodName`
- `arguments`
- `callbackId`
