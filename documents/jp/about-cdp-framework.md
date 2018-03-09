About CDP Framework
======

- [CDP フレームワークについて](#CDP)
    - [モジュールルート](#MODULES_ROOT)
    - [CDP.UI.PageView](#CDP_UI_PAGEVIEW)
        - [ページイベントとライフサイクル](#CDP_UI_PAGEVIEW_LIFECICLE)
    - [CDP.Framework.Router](#CDP_FRAMEWORK_ROUTER)
    - [CDP.Framework.toUrl](#CDP_FRAMEWORK_TOURL)
    - [CDP.Framework.Platform](#CDP_FRAMEWORK_PLATFORM)
    - [CDP.Promise](#CDP_PROMISE)
    - [CDP.Tools.Template](#CDP_TOOLS_TEMPLATE)
    - [CDP.UI.Dialog](#CDP_UI_DIALOG)
    - [ローカライズ](#CDP_LOCALIZE)
- [さらに詳しく](#MORE_INFO)
- [参考リンク](#LINK)


## <a name="CDP"/>CDP フレームワークについて

CDP フレームワークとは、

- [Backbone.js](http://backbonejs.org/)
- [jQuery Mobile](http://jquerymobile.com/)
- [i18next](http://i18next.com/)

の OSS 基盤に構成された、アプリケーション開発用クラスライブラリで、TypeScript で記述されています。  
またこれらの OSS はほかの OSS と組み合わせやすいため、必要に応じて OSS で機能を拡張する方針を採っています。  
CDP フレームワークは、`global` 空間に `CDP` オブジェクトを基点としてさまざまなクラスを提供しますが、  
[boilerplate](https://github.com/sony/cdp-cli) を使用する場合は、ES Modules 形式もサポートします。  

ここではよく使用する最低限知っておくとよいクラスの使い方を解説します。


### <a name="MODULES_ROOT"/>モジュールルート

| global           | ES Modules      | 説明                                   |
|:-----------------|:----------------|:---------------------------------------|
| CDP              | "cdp"           | CDP フレームワークのルートオブジェクト |
| CDP.Framework    | "cdp/framework" | コアフレームワークオブジェクト         |
| CDP.Tools        | "cdp/tools"     | ユーティリティオブジェクト             |
| CDP.UI           | "cdp/ui"        | UI フレームワークオブジェクト          |
| CDP.NativeBridge | "cdp/bridge"    | ネイティブブリッジユーティリティ       |


### <a name="CDP_UI_PAGEVIEW"/>CDP.UI.PageView

モバイルアプリケーションにおいて、1画面のライフサイクルと機能を提供するクラスです。
アプリケーションの起動時にインスタンス化しておき、後述する```CDP.Framework.Router``` から発行されるページ切り替えイベントをハンドリングできます。

基本的なページクラスの実装は以下のようになります。

* app/templates/mypage.html

```html
<article data-role="page" id="page-mypage" data-theme="cdp">
    <header data-role="header" data-position="fixed" data-tap-toggle="false">
        <!-- 任意の HTML -->
        <h1>My Page</h1>
    </header>
    <section data-role="content">
        <!-- 任意の HTML -->
        <button id="mypage-exec" class="ui-btn ui-btn-b ui-corner-all">実行</button>
    </section>
</article>
```

`data-role`, `data-theme`, `class="ui-xxx"` は jQuery Mobile の定義です。ページの基本要素は jQuery Mobile で処理されますが、そのほかのレイアウトに基本的に制限はありません。
jQuery Mobile の theme が邪魔になる場合は、`data-theme="none"` が指定可能です。

ここではページタイトルに `My Page`、コンテンツに `実行` ボタンを配置しています。

* app/scripts/View/MyPageView.ts

```typescript
import {
    PageView,       // CDP.UI.PageView
    Toast,          // CDP.UI.Toast
    registerPage,
} from "cdp/ui";

class MyPageView extends PageView {

    constructor() {
        super(
            "/templates/mypage.html",       // MyPageView が使用する html リソースの "app" から、"/" ではじまる相対パスを指定
            "page-mypage",                  // mypage.html の lookup に使用する HTML Tag ID
            {
                route: "mypage",            // Router に登録する hash フラグメント
                top: true,                  // top 画面として登録した場合、H/W Back Key でアプリケーションが終了
            }
        );
    }
    :

    ///////////////////////////////////////////////////////////////////////
    // Event Handlers:

    // events binding
    events(): any {
        return {
            "vclick #mypage-exec": this.onExecute,
        };
    }

    // 実行ボタンのイベントハンドラ
    private onExecute(event: JQuery.Event): void {
        Toast.show("onExecute() called.");   // Toast は実行環境で popup 表示する Android like なユーティリティ
    }
}

// スクリプトロード時にインスタンス化を予約
registerPage(MyPageView);
```

コンストラクタでスーパークラス `CDP.UI.PageView` にページの基本情報を渡します。

イベントハンドラは、[Backbone.View](http://backbonejs.org/#View) コンパチブルです。

`events()` 関数に `event [selector]` を key に指定し、value に ハンドラの関数を登録します。

ここで出てくる `vclick` は jQuery Mobile が提供する、モバイル環境 (特に iOS デバイス)においても、遅延が発生しない `click` 代価の DOM イベントとなります。


#### <a name="CDP_UI_PAGEVIEW_LIFECICLE"/>ページイベントとライフサイクル

前述の方法で作成したページクラスのインスタンス自体は、アプリケーションの起動～終了まで、シングルトンに存在することになります。

しかし大量のリストコンテンツを扱うようなページであるとき、メモリ管理の観点よりページが表示されるときに要素を作成し、非表示になるときに要素を開放したいようなシナリオがあります。

このユースケースを実現するために、`CDP.UI.PageView` クラスは以下のイベントのハンドラを用意しています。必要に応じて、オーバーライド可能です。

* app/scripts/View/MyPageView.ts

```typescript
import {
    PageView,
    ShowEventData,
    HideEventData,
    registerPage,
} from "cdp/ui";

class MyPageView extends PageView {
    :
    // 最初の OnPageInit() のときにのみコールされる
    onInitialize(event: JQuery.Event): void {
        super.onInitialize(event);
        :
    }
    // jQM event: "pagebeforecreate" に対応 (jQuery Mobile による DOM 装飾前のタイミング)
    onPageBeforeCreate(event: JQuery.Event): void {
        super.onPageBeforeCreate(event);
        :
    }
    // jQM event: "pagecreate" (旧:"pageinit") に対応 (jQuery Mobile の DOM 装飾完了のタイミング)
    onPageInit(event: JQuery.Event): void {
        super.onPageInit(event);
        :
    }
    // jQM event: "pagebeforeshow" に対応 (ページ遷移前のタイミング)
    onPageBeforeShow(event: JQuery.Event, data: ShowEventData): void {
        super.onPageBeforeShow(event, data);
        :
    }
    // jQM event: "pagecontainershow" (旧:"pageshow") に対応 (遷移後、ページが完全に表示されたタイミング)
    onPageShow(event: JQuery.Event, data: ShowEventData): void {
        super.onPageShow(event, data);
        :
    }
    // jQM event: "pagebeforehide" に対応 (ページ遷移前、これから非表示になる直前のタイミング)
    onPageBeforeHide(event: JQuery.Event, data: HideEventData): void {
        super.onPageBeforeHide(event, data);
        :
    }
    // jQM event: "pagecontainerhide" (旧:"pagehide") に対応 (ページ遷移後、完全に非表示になったタイミング)
    onPageHide(event: JQuery.Event, data?: HideEventData): void;
        super.onPageHide(event, data);
        :
    }
    // jQM event: "pageremove" に対応 (ページ非表示後、DOM から削除されるタイミング)
    onPageRemove(event: JQuery.Event): void {
        :
        super.onPageRemove(event);
    }
}
```

### <a name="CDP_FRAMEWORK_ROUTER"/>CDP.Framework.Router

ページ遷移機能は、`CDP.Framework.Router` クラスによって提供されます。

`CDP.Framework.Router` 自体は、[Backbone.Router](http://backbonejs.org/#Router) のラッパーですが、route の登録は `CDP.UI.PageView` の `constructor` の設定で解決しています。

* ※ `Backbone.Router` のように、route 定義を一元管理することも可能です。

`CDP.Framework.Router` の代表的なメソッドは以下となります。

* app/scripts/View/MyPageView.ts

```typescript
import { Router } from "cdp/framework";

class MyPageView extends PageView {
    :
    // 画面遷移指定
    private doNavigate(): void {
        Router.navigate(
            "#mypage2",  // route に登録したフラグメント に "#" をつけたもの. (相対パス/絶対パスも指定可)
            "slide"      // jQuery Mobile の提供するトランジション http://demos.jquerymobile.com/1.4.5/transitions/
        );
    }

    // 戻る
    private doBack(): void {
        Router.back();
    }
}
```

画面遷移は、以下のようにHTML で完結した書き方も可能です。

* app/templates/mypage.html

```html
<article data-role="page" id="page-mypage" data-theme="cdp">
    <header data-role="header" data-position="fixed" data-tap-toggle="false">
        <a href="#" data-rel="back" data-icon="arrow-l" data-iconpos="notext"></a>
        <h1>My Page</h1>
        <a href="#mypage2" data-transition="slide" data-icon="arrow-r" data-iconpos="notext"></a>
    </header>
    :
</article>
```

### <a name="CDP_FRAMEWORK_TOURL"/>CDP.Framework.toUrl

`CDP.Framework.toUrl()` は実行されるスクリプトの配置を問わず、リソースにアクセスするために使用可能なユーティリティ関数です。

※[参考:JavaScript関数のカレントパスがそれを使うHTMLの場所になる仕様への対策](http://qiita.com/richmikan@github/items/f6546c1cb913c78a6338)

* app/scripts/View/MyPageView.ts

```typescript
import { toUrl } from "cdp/framework";

class MyPageView extends PageView {
    :
    // リソース取得
    private getResource(): object {
        let _data: object;

        $.ajax({
            url: toUrl("/res/data/sample.json"),    // "app/res/data/sample.json" を取得
            type: "GET",
            dataType: "json",
            async: false,
            success: (data: any) => {
                _skinSingle = data;
            },
            error: (data: any, status: string) => {
                throw new Error("ajax request failed. status: " + status);
            }
        });

        return _data;
    }
}
```

### <a name="CDP_FRAMEWORK_PLATFORM"/>CDP.Framework.Platform

いろいろな事情で、ランタイムでプラットフォームを判定したいことがあります。

`CDP.Framework.Platform` が利用可能です。

* app/scripts/View/MyPageView.ts

```typescript
import { Platform } from "cdp/framework";

class MyPageView extends PageView {
    :
    // リソース取得
    private checkEnvironment(): void {
        if (Platform.Mobile) {  // モバイルデバイス
            :
        }
        if (Platform.Android) { // Android
            :
        }
        if (Platform.iOS) {     // iOS
            :
        }
    }
}
```


### <a name="CDP_PROMISE"/>CDP.Promise

ブラウザエンジンで動作する JavaScript はその性質上、非同期処理が煩雑になる傾向にあります。  
近年、JavaScript の標準に `Promise` オブジェクトが追加されましたが、CDP フレームワークでは `jQuery.Promise` 拡張の`CDP.Promise` オブジェクトを提供します。  

* [JavaScriptとコールバック地獄](https://techblog.yahoo.co.jp/programming/js_callback/)
* [爆速でわかるjQuery.Deferred超入門](https://techblog.yahoo.co.jp/programming/jquery-deferred/)


`CDP.Promise` は非同期処理のパイプライン処理時に問題となる、依存関係の解決や一括キャンセル機能を提供する `jQueryXHR` オブジェクトと互換のある Promise オブジェクトです。

* app/scripts/View/MyPageView.ts

```typescript
import {
    IPromise,
    makePromise,
} from "cdp";

class MyPageView extends PageView {
    :
    // パイプライン処理
    private procPipeline(): IPromise<SomeData> {
        let df = $.Deferred();          // jQueryDeferred オブジェクト生成
        let promise = makePromise(df);  // CDP.Promise オブジェクト生成

        /*
         * async1(), async2(), async3() はそれぞれ IPromise オブジェクトを返す
         */
        promise.dependOn(async1())
        .then(() => {
            return promise.dependOn(async2());
        })
        .then(() => {
            return promise.dependOn(async3());
        })
        .done(() => {
            df.resolve({ somedata: "hoge" });
        })
        .fail((error) => {
            df.reject(error);
        });

        return promise;
    }

    // パイプライン処理の呼び出しもと
    private procCaller(): void {
        let promise = this.procPipeline();

        setTimeout(() => {
            promise.abort();    // 任意のタイミングで全キャンセル
            // async1(), async2(), async3() のどの処理にいても、適切にキャンセル可能
        });
    }
}
```

`CDP.PromiseManager` を用いれば、`CDP.UI.PageView` のライフサイクルとさらに結び付けやすくなります。

* app/scripts/View/MyPageView.ts

```typescript
import {
    IPromise,
    makePromise,
    PromiseManager,
} from "cdp";

class MyPageView extends PageView {
    private _prmsManager: PromiseManager;

    constructor() {
        super("/templates/mypage.html", "page-mypage", {
            route: "mypage",
            top: true,
        });
        // コンストラクタでインスタンス化
        this._prmsManager = new PromiseManager();
    }
    :
    // パイプライン処理
    private procPipeline(): IPromise<SomeData> {
        let df = $.Deferred();          // jQueryDeferred オブジェクト生成
        let promise = makePromise(df);  // CDP.Promise オブジェクト生成

        /*
         * async1(), async2(), async3() はそれぞれ IPromise オブジェクトを返す
         */
        promise.dependOn(async1())
        .then(() => {
            return promise.dependOn(async2());
        })
        .then(() => {
            return promise.dependOn(async3());
        })
        .done(() => {
            df.resolve({ somedata: "hoge" });
        })
        .fail((error) => {
            df.reject(error);
        });

        return promise;
    }

    // パイプライン処理の呼び出しもと
    private procCaller(): void {
        // PromiseManager の管理下に追加
        this._prmsManager.add(this.procPipeline());
        // そのほか "procPipeline()" と依存の無い async4() も管理下に追加
        this._prmsManager.add(async4());
    }
    :
    // jQM event: "pageremove" に対応 (ページ非表示後、DOM から削除されるタイミング)
    onPageRemove(event: JQuery.Event): void {
        // 画面遷移に伴い、ページが削除されるタイミングで全キャンセル実行
        this._prmsManager.cancel();
        super.onPageRemove(event);
    }
```

また `CDP.Promise` は `ES Promise` オブジェクトと互換があり、以下のように使用することも可能です。

```typescript
// "Promise" オブジェクトをこのモジュールスコープ内でオーバーライド
import { Promise } from "cdp";

function (): IPromise<SomeData> => {
    return new Promise((resolve, reject, dependOn) => {
        // async1(), async2() はそれぞれ IPromise オブジェクトを返す
        dependOn(async1())
            .then(() => {
                return dependOn(async2());
            })
            .then(() => {
                resolve({ somedata: "hoge" });
            })
            .catch((error) => {
                reject(error);
            });
        });
    };
}
```


### <a name="CDP_TOOLS_TEMPLATE"/>CDP.Tools.Template

`CDP.Tools.Template` は JavaScriptテンプレートエンジンのI/Fを提供します。  
`CDP` フレームワークでは既定では[Underscore.js](http://underscorejs.org/)を使用し、  
[Hogan.js](http://twitter.github.io/hogan.js/) が global オブジェクトに存在すれば、それをバックエンドに使用します。

* [どこでも活躍できるテンプレートエンジン「Mustache」](http://blog.mach3.jp/2010/10/05/mustache-template-engine.html)

テンプレートの使い方は以下になります。

* app/templates/listview.html

```html
<article>
    <script type="text/template" id="template-listview">
        <ul>
            {{#item}}
            <li data-item-id="{{id}}">
                <p class="item-name">{{name}}</p>
            </li>
            {{/item}}
        </ui>
    </script>
</article>
```

* app/scripts/View/MyPageView.ts

```typescript
import {
    toUrl,          // toUrl は "cdp/ui" からもアクセス可
    getTemplate,
    PageView,
} from "cdp/ui";

class MyPageView extends PageView {
    :
    // リストビュー描画
    private renderListView(): void {
        // HTML template を取得し、JavaScript Template(JST) にコンパイル
        let template = getTemplate("#template-listview", toUrl("/templates/listview.html"));

        // template parameter
        let param = {
            items: [
                { id: "aa:aa:aa:aa", name: "hoge" },
                { id: "bb:bb:bb:bb", name: "fuga" },
                :
                { id: "jj:jj:jj:jj", name: "zzzz" },
            ],
        };

        // テンプレートから DOM を作成
        let $listview = $(template(param));

        // ターゲットに追加
        $("#some-listview-target").append($listview);
    }
}
```

JavaScript Template (JST) はキャッシュしておくことも可能です。


### <a name="CDP_UI_DIALOG"/>CDP.UI.Dialog

`CDP` フレームワークは、モーダルダイアログの機能を `jQuery Mobile` の `Popup` ウィジェットをラップして提供します。

ダイアログレイアウトは前述のテンプレートに逃がしておくことが可能です。基本的な使い方は以下です。


* app/templates/dialog.html

```html
<article>
    <!-- confirm dialog (2 buttons) -->
    <script type="text/template" id="dialog-common-message">
        <section data-role="popup" data-corners="false" data-theme="cdp" data-overlay-theme="cdp">
            <header class="{{_header}}">
                <h1 class="title">{{title}}</h1>
            </header>
            <p class="message">{{message}}</p>
            <div class="ui-grid-a">
                <button id="{{idNegative}}" class="ui-btn ui-block-a" data-auto-close="true">{{labelNegative}}</button>
                <button id="{{idPositive}}" class="ui-btn ui-block-b emphasis" data-auto-close="true">{{labelPositive}}</button>
            </div>
        </section>
    </script>
</article>
```

※ `data-auto-close="true"` 属性は、その DOM element が `click` された場合に、自動でダイアログを閉じる属性です。

* app/scripts/View/MyPageView.ts

```typescript
import {
    Dialog,
    Toast,
    PageView,
} from "cdp/ui";

class MyPageView extends PageView {
    :
    // ダイアログ表示
    private showDialog(): void {
        // メッセージダイアログインスタンスの作成
        let dialog = new Dialog("#dialog-common-message", {
            title: "メッセージダイアログテスト",
            message: "Simple is best.",
        });

        // 表示とイベントハンドリング
        dialog.show()
            .on("vclick", "#dlg-btn-positive", (event: JQuery.Event) => {
                Toast.show("onOK");
            })
            .on("vclick", "#dlg-btn-negative", (event: JQuery.Event) => {
                Toast.show("onCancel");
            })
            .on("popupafterclose", (event: JQuery.Event) => {
                // ダイアログの終了イベントハンドラ
            });
}
```

より詳細なダイアログのオプションは[こちらを参照](https://github.com/sony/cdp-js/blob/master/packages/cdp-ui-jqm/src/scripts/CDP/UI/jqm/Dialog.ts)してください。  
ダイアログクラスは継承して、独自の機能を持たせることも可能です。

### <a name="CDP_LOCALIZE"/>ローカライズ

ローカライズは、[i18next](http://i18next.com/) ライブラリとその [jQuery Plugin](https://github.com/i18next/jquery-i18next) を用いて実現します。

ローカライズリソースは以下に配置されています。

    root/
        app/                              // application development root directory.
            res/                          // for application resources.
                locales/
                    messages.en-US.json   // 英語リソース
                    messages.ja-JP.json   // 日本語リソース


リソースは JSON となっています。

```
{
    "preinstall": {
        "package": {
            "label": "Package:",
            "unavailable": "パッケージが設定されていません"
        },
        "device": {
            "label": "接続設定:",
            "selectAuto": "自動判別",
            "search": "検索",
            "connect": "接続",
            "disconnect": "切断",
            "info": {
                "label": "ウォッチ情報",
                "fwVersion": "本体ソフトウェアバージョン",
                "modelName": "モデル",
                "serialNo": "シリアル番号"
            }
        },
        "operation": {
            "label": "オペレーション:",
            "install": "転送"
        },
        "error": { 
            "title": "エラーが発生しています"
        }
    }
}
```

HTML の `data-i18n` 属性を使用して、値に json の参照を記述すれば、基本的には**自動でローカライズ**されます。

```html
<section class="package-info ui-mini">
    <ul data-role="listview" data-inset="true">
        <!-- "Package" に置き換わる -->
        <li data-role="list-divider" data-i18n="preinstall.package.label">preinstall.package.label</li>
        <li>
            <!-- "パッケージが設定されていません" に置き換わる -->
            <p id="preinstall-package-name" data-i18n="preinstall.package.unavailable">preinstall.package.unavailable</p>
        </li>
    </ul>
</section>
```

TypeScript からの指定も可能です。

```typescript

private handleErrorInfo(error: ErrorInfo): void {
    // jQuery に "t" メソッドが追加され使用可能
    let text = $.t("preinstall.error.title");
    // text -> "エラーが発生しています"
}
```

i18next ライブラリは、このほかにもさまざまな強力なローカライズメソッドを提供します。

詳しくは公式と、[jquery-i18next](https://github.com/i18next/jquery-i18next)  のチュートリアルも参照してください。


## <a name="MORE_INFO"/>さらに詳しく

- [packages/cafeteria/](../../packages/cafeteria) 以下に、CDP フレームワークのテスト兼サンプルアプリケーションがあります。
- `$ npm run document` コマンドから、TypeDoc 形式のドキュメントが生成可能です。

## <a name="LINK"/>参考リンク

各 OSS の Home Page

- [jQuery](http://jquery.com/)
- [Underscore.js](http://underscorejs.org/)
- [Backbone.js](http://backbonejs.org/)
- [jQuery Mobile](http://jquerymobile.com/)
- [i18next](http://i18next.com/)
- [Hogan.js](http://twitter.github.io/hogan.js/)
