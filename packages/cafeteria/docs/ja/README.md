Developlers Guide
======

- [task & command 解説](#TASKS)
    - [npm scripts](#TASKS_SCRIPTS)
        - [boilerplate 共通](#TASKS_SCRIPTS_BOILERPLATE)
        - [Cafeteria 専用](#TASKS_SCRIPTS_CAFETERIA)
    - [cordova command](#TASKS_CORDOVA)
    - [options](#TASKS_OPTIONS)
- [Next boilerplate 変更点 & 新機能](#BOILERPLATE)
    - [es2015 モジュールで開発](#BOILERPLATE_ES2015)
    - [node-sass + post-css を用いて scss ビルド](#BOILERPLATE_SCSS)
    - [d.ts ファイルの解決](#BOILERPLATE_DTS)
        - [@types のインストール](#BOILERPLATE_DTS_TYPES)
        - [global モジュールの解決](#BOILERPLATE_DTS_GLOBAL)
        - [@types に見つからない or 定義が足りない場合](#BOILERPLATE_DTS_PATCH)
    - [config.ts の変更点](#BOILERPLATE_CONFIGTS)
        - [require.config の path 指定](#BOILERPLATE_CONFIGTS_REQUIREJS)
        - [基幹ライブラリのコンフィギュレーション指定](#BOILERPLATE_CONFIGTS_CORES)
    - [よく使用するビルドタスクのユーザー開放](#BOILERPLATE_BUILDTASKS)
        - [copy_src](#BOILERPLATE_BUILDTASKS_COPY)
        - [string_replace](#BOILERPLATE_BUILDTASKS_SREPLACE)
        - [hook_scripts](#BOILERPLATE_BUILDTASKS_HOOKS)
    - [library module 開発](#BOILERPLATE_LIB)
    - [porting module 開発](#BOILERPLATE_PORTING)



# <a name="TASKS" />task & command 解説

## <a name="TASKS_SCRIPTS" />npm scripts

### <a name="TASKS_SCRIPTS_BOILERPLATE" />boilerplate 共通

```
$ npm run <command>
```

| command         | description                                                                                                           |
|:----------------|:----------------------------------------------------------------------------------------------------------------------|
| clean           | `docs/reports/metrics` 以外の生成したファイルを削除                                                                   |
| update          | `devDependencies`, `dependencies`, `@cdp/mobile` および `package.json` の更新. ※要 ssh-agent                         |
| test            | `compile`, `lint`, `unit-test` の実行                                                                                 |
| rearrange       | `dependencies` に記載されているモジュールを `node_modules` から `external` 以下に再配置. ※既定で 整形, minify を実行 |
| package         | `cordova build --release` を実行                                                                                      |
| compile:dev     | `.ts` ファイルと同じ位置に `.js` をコンパイル. 既定の tsconfig.json の設定                                            |
| watch           | [TBD] watch:ts と watch:scss の同時実行                                                                               |
| watch:ts        | comming soon                                                                                                          |
| watch:scss      | [TBD] post-css まで考慮するとたくさん node_modules を追加する必要がありそうなのが懸案                                 |
| build:debug     | `www` 以下にデバッグビルドを作成                                                                                      |
| build:release   | `www` 以下にリリースビルドを作成                                                                                      |
| lint            | `eslint` と `tslint` の実行                                                                                           |
| lint:js         | `eslint` の実行                                                                                                       |
| lint:ts         | `tslint` の実行                                                                                                       |
| debug           | TDD モードで `unit-test` の実行. library 開発と共通にしてこのコマンドをアサインしたが `tdd` にするかも.               |
| coverage        | `unit-test` を実行し `docs/reports/coverage` 以下にレポートを作成                                                     |
| document        | `typedoc` を実行し、`docs/typedoc` 以下にドキュメントを生成                                                           |
| metrics         | `plato` を実行し、`docs/reports/metrics` 以下にレポートを作成                                                         |
| ci              | `compile`, `lint`, `unit-test`, `metrics`, `document`, `build:release` の実行                                         |
| module          | `lib` 以下をモジュールビルド                                                                                          |
| porting:dev     | `www` にビルド済みの場合、dev 用 porting を有効にする                                                                 |
| porting:android | `www` にビルド済みの場合、android 用 porting を有効にする                                                             |
| porting:ios     | `www` にビルド済みの場合、ios 用 porting を有効にする                                                                 |
| depends         | `npm list --depth=1` の実行                                                                                           |
| depends:prod    | `npm list --depth=0 --only=prod` の実行                                                                               |
| depends:dev     | `npm list --depth=0 --only=dev` の実行                                                                                |


### <a name="TASKS_SCRIPTS_CAFETERIA" />Cafeteria 専用

| command             | description                                                                     |
|:--------------------|:--------------------------------------------------------------------------------|
| setup               | repository 取得後は最初に実行しなければいけないタスク. `npm install` も実行     |
| setup:tasks         | `tasks` に script を配置                                                        |
| setup:platform      | `platforms/<platform>/cordova/node_modules` をコピー                            |
| update:cdp          | monorepo 内の `@cdp/mobile` を反映                                              |
| update:cdp:[module] | monorepo 内の `cdp-[module]` と `@cdp/mobile` を反映                            |


## <a name="TASKS_CORDOVA" />cordova command

- 以下の `cordova command` 時に、build が走ります。
    - `build`
    - `emulate`
    - `run`
    - `prepare`

```
$ cordova <command> [platform] [--release]
```

## <a name="TASKS_OPTIONS" />options

npm scripts, cordova command ともに、以下の便利オプションが指定可能です。

| option      | description                                                                        |
|:------------|:-----------------------------------------------------------------------------------|
| --no-minify | リリースビルドで `minify` しない                                                   |
| --map       | リリースビルドで `map file` を生成する. `--no-minify` が指定されていた場合無効.    |
| --no-hook   | 対象の cordova command を実行しても hook しない (公式 --nohook が効かない)         |


- npm scripts からの指定方法

```
$ npm run build:release -- --no-minify
```

- cordova command からの指定方法

```
$ cordova build android --release --no-minify
```

# <a name="BOILERPLATE" />Next boilerplate 変更点 & 新機能

## <a name="BOILERPLATE_ES2015" />es2015 モジュールで開発

基本的に `import` 構文を使用して、ファイルを読み込みます。  
`/// <reference path="hoge.ts">` の**記述は不要**です。  
後述の View ルート解決を除いて、ファイル追加のみですぐに開発可能です。

```typescript
import { registerPage } from "cdp/ui";
import { BasePageView } from "./base-pageview";

const TAG = "[view.gallery.ButtonPageView] ";

/**
 * @class ButtonPageView
 * @brief Button サンプルの画面クラス
 */
class ButtonPageView extends BasePageView {

    /**
     * constructor
     */
    constructor() {
        super("/templates/gallery/button.html", "gallery-button", {
            route: "gallery/button"
        });
    }
}

registerPage(ButtonPageView);
```

ただし、`View` のルートクラスを起動時に読み込む必要があります。  
既定では `app/scripts/view/loader.ts` に以下のようにアサインします。

```typescript
// >>>TOP_VIEWS_ENTRY>>> top views entry
import "./main-view";
import "./options-view";
import "./gallery/root";
import "./link-sample/root";
import "./views-sample/root";
import "./listviews-sample/root";
import "./nativebridge-sample/root";
import "./advanced-sample/root";
// <<<TOP_VIEWS_ENTRY<<<
```

このあたりは将来、[perroquet](https://github.com/CDP-Tokyo/perroquet) で解決したいと考えています。

以前の boilerplate4 のときのように、`namespace` + `/// <reference path/>` を用いた classical な開発をする場合、  
手動で、`cdp-lazyload` をセットアップする必要があります。  
理屈ではうまくいくはずですが、build script のメンテナンスを含めてサポート対象外です。


## <a name="BOILERPLATE_SCSS" />node-sass + post-css を用いて scss ビルド

以前は、`compass` を用いて `scss` をビルドしていたため、`ruby` のセットアップが必須でしたが、**不要となりました**。  
ファイル・ディレクトリの構成に変更はありません。  
特筆すべきは、**もはや `vender-prefix` を手動でつけるべきではない**。 という点です。

`post-css` の処理によって、ネットワークからダイナミックに解決してくれます。  
既定の対象ブラウザの設定は、`package.json` の `browserslist` のプロパティに定義されています。

```
    "browserslist": [
        "last 1 Android versions",
        "last 2 ChromeAndroid versions",
        "last 2 iOS versions"
    ],
```

[browserslist](https://github.com/ai/browserslist) は `post-css` が使用する、ブラウザ対応状況を解決してくれる `node modules` です。  
なお `node-sass` + `post-css` にしたことで、`cdp-ui-jqm` の `scss` のコンパイルが 45sec → 3sec に短縮されました。

## <a name="BOILERPLATE_DTS" />d.ts ファイルの解決

従来の `<reference path />` に変わって、今回の boilerplate では、`@types` を積極的に利用しています。

### <a name="BOILERPLATE_DTS_TYPES" />@types のインストール

[公式](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html) にあるとおり、@types は以下のようにインストールするだけで、基本的には使用可能です。

```
$ npm install @types/<modoule> --save-dev
```

モバイルアプリケーションであるため npm から配布しないので、`--save-dev` が適切です。

### <a name="BOILERPLATE_DTS_GLOBAL" />global モジュールの解決

`import` 構文を使用せずに、 global オブジェクトとして使用したいモジュールがあります。  
この場合、`tsconfig.base.json` の `types` エントリを編集する必要があります。

※TypeScript の既定値では global 解決できるモジュールはすべて global に展開されますが、  
`require` 関数などは、`NodeJS` と `requirejs` のものとでコンフリクトを起こすため、boilerplate では手動で管理する運用となっています。

- tsconfig.base.json

```
    "types": [
      "@cdp/mobile",
      "patch.dependencies",
      "requirejs",
      "cordova",
      "jasmine"
    ]
```

ここに追加すれば、すべてのビルドタスクに反映されます。

### <a name="BOILERPLATE_DTS_PATCH" />@types に見つからない or 定義が足りない場合

@types に無いモジュールは、手動で `d.ts` を追加することが可能です。  
TypeScript 2.3 以降、無くても空気を読んでくれるようになりましたが、boilerplate では、`app/external/@types/patch.dependencies` にエントリすることで対応できます。

例: @types にはあるが、module 定義が無い場合(よくある)

- app/external/@types/patch.dependencies/index.d.ts
```typescript
/// <reference path="flipsnap.d.ts"/>
```

- app/external/@types/patch.dependencies/flipsnap.d.ts
```typescript
/// <reference types="flipsnap"/>

declare module "flipsnap" {
    const _Flipsnap: IFlipsnap;
    export { _Flipsnap as Flipsnap };
}
```



## <a name="BOILERPLATE_CONFIGTS" />config.ts の変更点

### <a name="BOILERPLATE_CONFIGTS_REQUIREJS" />require.config の path 指定

`requirejs` の `config` に `_module()` ヘルパー関数を用意しました。  
`app/external/<module>/scripts/<module>.js` へのパスを展開します。  
第2引数を使用することで、実際のファイル名がモジュール名と異なる場合にも解決可能です。(`iscrol`の例)  
このヘルパー関数を使用することで、`Unit Test` 時のパスも解決されます。  
したがって、`Unit TEST` のセットアップに**特別な設定は不要**です。

```typescript
        const config = {
           :
            // >>>EXTERNAL_MODULES>>> external module entry
            paths: {
                // external modules
                "jquery": _module("jquery"),
                "underscore": _module("underscore"),
                "backbone": _module("backbone"),
                "hogan": _module("hogan"),
                "flipsnap": _module("flipsnap"),
                "hammerjs": _module("hammerjs", "hammer"),
                "jquery-hammerjs": _module("hammerjs", "jquery.hammer"),
                "iscroll": _module("iscroll", "iscroll-probe"),
                "sylvester": _module("sylvester"),

                // core frameworks
                "cdp": _module("cdp"),
                "cordova": _index("cordova"),
            },
            // <<<EXTERNAL_MODULES<<<
            :
        };
```

### <a name="BOILERPLATE_CONFIGTS_CORES" />基幹ライブラリのコンフィギュレーション指定

既定で必須なのは、`i18next` のリソースパス指定のみです。  
`jquery`, `jquerymobile` は参考設定となっており、既定値が設定されています。  

また従来の関数版の `jquery()`, `jquerymobile()` コンフィグは廃止しています。

## <a name="BOILERPLATE_BUILDTASKS" />よく使用するビルドタスクのユーザー開放

ビルド時に細かい設定を変更したい場合があります。  
たとえばサーバーにアクセスするアプリケーションの場合、API の向き先を QA 環境 <-> PROD 環境を柔軟に変更したいときなどが該当します。  
このような時、従来の boilerplate では専用タスクを起こす必要がありました。  
今回の boilerplate では、`project.config.js` にプロパティを追加するだけで、実現可能です。

- `project.config.js`

```javascript
const build_settings = {
    copy_src: {
    },
    string_replace: {
    },
    hook_scripts: {
    },
};
```

### <a name="BOILERPLATE_BUILDTASKS_COPY" />copy_src

デバッグビルド時には含めたいけど、リリースビルド時には含めたくないリソースディレクトリの指定が可能です。

- `project.config.js`

```javascript
const build_settings = {
    copy_src: {
        dev_resource: ['samples'],
    },
};
```

上記設定では、`app/res/samples` ディレクトリは、デバッグビルドのときにのみコピーされます。  
`dev_resource` は配列で複数指定可能ですが、ルートは `app/res` 固定です。


### <a name="BOILERPLATE_BUILDTASKS_SREPLACE" />string_replace

文字列置換タスクです。対象は `config.ts` をコンパイルした `config.js` 限定です。

- `project.config.js`

```javascript
const build_settings = {
    string_replace: {
        'dev-func': {
            '%% dev_functions_enabled %%': 'enable',    // 置換対象が1つのときはオプションなしでデフォルト
        },
        'server': {
            '%% target_server %%': 'prod|dev|stg|qa',   // 配列が2つ以上あるときはいずれか1つの値をとる. 誤りがあればエラー
        },
        'runtime-context': {
            '%% runtime_context %%': false,             // false の場合、引数は任意. デフォルトは空に置換
        },
        'release': {
            '%% build_setting %%': true,                // true の場合、必ず空に置換
            '%% dev_functions_enabled %%': true,
        },
    },
};
```

`string_replace` セクションには、プロパティを文字列で指定します。この文字列は、コマンドライン引数として使用可能です。

```
$ cordova build android --server=prod
```

以下、上記の例を解説します。

- dev-func
    - `cordova build --dev-func` とした場合
        - `config.js` の `%% dev_functions_enabled %%` 文字列を `enable` に書き換える
    - `cordova build --dev-func=hoge` とした場合
        - `config.js` の `%% dev_functions_enabled %%` 文字列を `hoge` に書き換える

- server
    - `cordova build --server=prod` とした場合
        - `config.js` の `%% target_server %%` 文字列を `prod` に書き換える
    - `cordova build --server=hoge` とした場合
        - エラーとなり、ビルドが失敗する
    - `cordova build --server` とした場合
        - エラーとなり、ビルドが失敗する

- runtime-context
    - `cordova build --runtime-context` とした場合
        - `config.js` の `%% runtime_context %%` 文字列を `` (空文字)に書き換える
    - `cordova build --runtime-context=hoge` とした場合
        - `config.js` の `%% runtime_context %%` 文字列を `hoge` に書き換える

- release
    - `cordova build --release` とした場合
        - `config.js` の `%% build_setting %%` 文字列を `` (空文字)に書き換える
        - `config.js` の `%% dev_functions_enabled %%` 文字列を `` (空文字)に書き換える
    - `cordova build --release=hoge` とした場合
        - `config.js` の `%% build_setting %%` 文字列を `` (空文字)に書き換える
        - `config.js` の `%% dev_functions_enabled %%` 文字列を `` (空文字)に書き換える
    - `cordova build --release --dev-func` とした場合
        - `config.js` の `%% build_setting %%` 文字列を `` (空文字)に書き換える

最後に例は、先に　`%% dev_functions_enabled %%` の置換が走るため、`--release` の対象外になるという振る舞いです。  
これは、**リリース版でも、エンジニアリングUI を有効にする** ようなシナリオで活用できます。


### <a name="BOILERPLATE_BUILDTASKS_HOOKS" />hook_scripts

ビルドシーケンスの中で、自前のスクリプト処理をはさみたいことがあります。  
以下の2つのタイミングを提供します。

- `project.config.js`

```javascript
const build_settings = {
    hook_scripts: {
        // called all files setup to pkg
        after_setup: {
            // <npm script name>: <need option argument>
        },
        // called after minfiy
        after_optimize: {
            // <npm script name>: <need option argument>
        },
    },
};
```

- `after_setup`: コンパイル直後、`www` にファイルを配置したとき
- `after_optimize`: minify 直後、cordova のビルドが走る前

## <a name="BOILERPLATE_LIB" />library module 開発

従来どおり、`app/lib` 以下のディレクトリで、内部モジュール開発が可能です。  
しかし、`cdp-lazyload` を使用しない新しい手法が必要です。

- 1: `app/lib/scripts` 以下に モジュールディレクトリを作成する
- 2: モジュールディレクトリ内に、以下の3つファイルを追加する
    - main.ts
    - _export.d.ts
    - _declare.d.ts
- 3: main.ts に、`/// <amd-module name= />` ディレクティブを追加する
    - release ビルドの際、モジュール名が "main" になるのを避けるため. `.d.ts` の生成にも影響.
- 4: モジュールディレクトリ以下に、**必ず namespace ディレクトリ** を作成して、ほかのモジュールに被らないように運用する
    - release ビルドされる場合、他のモジュールと同じ名前の `amd module` が生成されるのを避けるため. `requirejs` では先勝ちになってロードされないことになる.
    - 被らなければOK なので、namespace 以下はいつもどおり実装
- 5: 2 のファイルを編集する
    - [main.ts](https://github.com/CDP-Tokyo/cdp-js/blob/master/packages/cafeteria/app/lib/scripts/cafeteria.images/main.ts)
    - [_export.d.ts](https://github.com/CDP-Tokyo/cdp-js/blob/master/packages/cafeteria/app/lib/scripts/cafeteria.images/_export.d.ts)
    - [_declare.d.ts](https://github.com/CDP-Tokyo/cdp-js/blob/master/packages/cafeteria/app/lib/scripts/cafeteria.images/_declare.d.ts)
- 6: config.ts の assign_lib() ヘルパー関数を使用して、requirejs のコンフィグ設定を行う
    - 依存関係は assign_lib() を書いた順になります
    - `Unit Test` にも使用されます

Cafeteria にはいくつかの実験コードがありますが、参考実装は `cafeteria.images` が適切です。

## <a name="BOILERPLATE_PORTING" />porting module 開発

`poiting module` は従来どおり experimental な側面がまだあり、仕様を欲張っていません。  
基本的に dynamic load を行い、`.d.ts` であらかじめ API を固定する運用にしています。  
known の方向は、app → porting としていますが、ビルドの順序は 1. app, 2. porting となるためです。

app 本体と porting モジュール間にあまりにも強い結びつきが発生してしまうと、設計が破綻する恐れがあるため注意してください。

実プロジェクトで役に立ったのは、android 用 splash screen を対応です。scss 程度なら十分に実用に耐えました。
