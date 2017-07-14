Developlers Guide
======

* TODO:

### 独自拡張 css `ui-*` class

| name                             | description                                            | 主な定義箇所                                          |
|:---------------------------------|:-------------------------------------------------------|:------------------------------------------------------|
| ui-platform-android              | プラットフォームデザイン Android                       | stylesheets/structure/widget/<platform>/*.scss        |
| ui-platform-ios                  | プラットフォームデザイン iOS                           | stylesheets/structure/widget/<platform>/*.scss        |
| ui-layout-match-parent           | レイアウト指定. 親幅あわせ                             | stylesheets/structure/widget/base/_global.scss        |
| ui-layout-center-container       | レイアウト指定. 中央あわせ                             | stylesheets/structure/widget/base/_global.scss        |
| ui-control-inline                | コントロールレイアウト指定. インライン配置             | stylesheets/structure/widget/base/_switch.scss        |
| ui-control-right                 | コントロールレイアウト指定. 右あわせ                   | stylesheets/structure/widget/base/_switch.scss        |
| ui-control-full                  | コントロールレイアウト指定. フルサイズ                 | stylesheets/structure/widget/base/_slider.scss        |
| ui-separator                     | セパレータ定義                                         | stylesheets/structure/widget/base/_global.scss        |
| ui-alt                           | 代価デザイン                                           | stylesheets/structure/widget/<platform>/_button.scss  |
| ui-big                           | 大きいデザイン                                         | stylesheets/structure/widget/<platform>/_button.scss  |
| ui-state-selected                | ボタンの選択状態                                       | stylesheets/structure/widget/<platform>/_button.scss  |
| ui-emphasis                      | 強調デザイン                                           | stylesheets/structure/widget/<platform>/_button.scss  |
| ui-alt-emphasis                  | 代価の強調デザイン                                     | stylesheets/structure/widget/<platform>/_button.scss  |
| ui-text-emphasis                 | ボタンテキストの強調                                   | stylesheets/structure/widget/base/_dialog.scss        |
| ui-back-indicator                | ヘッダ用戻るインジケータ                               | stylesheets/structure/widget/base/_header.scss        |
| ui-header-base                   | 画面遷移時にも有効なベースヘッダ(internal)             | stylesheets/structure/widget/base/_header.scss        |
| ui-fixed-back-indicator          | 画面遷移時にも有効なヘッダ用戻るインジケータ(internal) | stylesheets/structure/widget/ios/_header.scss         |
| ui-header-no-fix                 | 固定ヘッダを使用しないときには必須 (がたつき回避)      | stylesheets/structure/widget/base/_page.scss          |
| ui-page-no-fix                   | body native scroll したい場合は必須 (がたつき回避)     | stylesheets/structure/widget/base/_page.scss          |
| ui-screen-wide                   | パディングのないページ指定. .ui-content に紐づく       | stylesheets/structure/widget/base/_page.scss          |
| ui-screen-full                   | フルスクリーン指定. .ui-content に紐づく               | stylesheets/structure/widget/base/_page.scss          |
| ui-screen-no-fix                 | Native WebView スクロールバーを使用する場合に使用      | stylesheets/structure/widget/base/_page.scss          |
| ui-ripple                        | リップル装飾対象の明示                                 | stylesheets/structure/widget/<platform>/_ripple.scss  |
| ui-ripple-center                 | リップル装飾対象の明示 (中央固定)                      | stylesheets/structure/widget/base/_mixins.scss        |
| ui-ripple-none                   | リップル装飾非対象の明示                               | N/A                                                   |
| ui-ripple-ink                    | リップル装飾部品(internal)                             | stylesheets/structure/widget/<platform>/_ripple.scss  |
| ui-ripple-animate                | リップルアニメーション状態(internal)                   | stylesheets/structure/widget/<platform>/_ripple.scss  |
| ui-spinner                       | スピナー本体                                           | stylesheets/structure/widget/base/_spinner.scss       |
| ui-spinner-base                  | スピナー装飾部品(internal)                             | stylesheets/structure/widget/android/_spinner.scss    |
| ui-spinner-inner                 | スピナー装飾部品(internal)                             | stylesheets/structure/widget/android/_spinner.scss    |
| ui-spinner-inner-gap             | スピナー装飾部品(internal)                             | stylesheets/structure/widget/android/_spinner.scss    |
| ui-spinner-inner-left            | スピナー装飾部品(internal)                             | stylesheets/structure/widget/android/_spinner.scss    |
| ui-spinner-inner-half-circle     | スピナー装飾部品(internal)                             | stylesheets/structure/widget/android/_spinner.scss    |
| ui-spinner-inner-right           | スピナー装飾部品(internal)                             | stylesheets/structure/widget/android/_spinner.scss    |
| ui-float-lable                   | フロートラベル本体                                     | stylesheets/structure/widget/android/_text-input.scss |
| ui-float-lable-floating          | フロートラベルプロパティ(internal)                     | stylesheets/structure/widget/android/_text-input.scss |
| ui-float-lable-has-icon          | フロートラベルプロパティ(internal)                     | stylesheets/structure/widget/android/_text-input.scss |
| ui-slider-no-scale               | 操作中につまみをズームしないときに使用                 | stylesheets/structure/widget/android/_slider.scss     |
| ui-listitem-title                | リストアイテムタイトル                                 | stylesheets/structure/widget/base/_list-ctrl.scss     |
| ui-listitem-property             | リストアイテムプロパティ                               | stylesheets/structure/widget/base/_list-ctrl.scss     |
| ui-listitem-multiline            | リストアイテム複数行の許可                             | stylesheets/structure/widget/base/_list-ctrl.scss     |
| ui-listitem-border-disable       | 対象のボーダーライン()を非表示                         | stylesheets/structure/widget/base/_list-ctrl.scss     |
| ui-listitem-border-first-disable | 先頭のボーダーラインを非表示                           | stylesheets/structure/widget/base/_list-ctrl.scss     |
| ui-listitem-border-offset-enable | Android でもボーダーオフセットを設定したいときに指定   | stylesheets/structure/widget/base/_list-ctrl.scss     |
| ui-listitem-border-offset-icon   | 左にアイコンを配置した場合のボーダーオフセットを設定   | stylesheets/structure/widget/base/_list-ctrl.scss     |
| ui-text-s                        | フォント小 (リストアイテム10px)                        | stylesheets/structure/widget/base/_list-ctrl.scss     |
| ui-text-m                        | フォント中 (リストアイテム12px)                        | stylesheets/structure/widget/base/_list-ctrl.scss     |
| ui-text-l                        | フォント大 (リストアイテム14px)                        | stylesheets/structure/widget/base/_list-ctrl.scss     |
| ui-modal                         | 共通ダイアログ                                         | stylesheets/structure/widget/base/_dialog.scss        |
| ui-has-title                     | ヘッダータイトル所有                                   | stylesheets/structure/widget/base/_dialog.scss        |
| ui-no-title                      | ヘッダータイトル未所有                                 | stylesheets/structure/widget/base/_dialog.scss        |
| ui-message                       | メッセージ                                             | stylesheets/structure/widget/base/_dialog.scss        |
| ui-modal-footer                  | ボタン領域                                             | stylesheets/structure/widget/base/_dialog.scss        |
| ui-no-override-icon              | ui-icon-carat などの上書きをしない (ui-content に設定) | stylesheets/structure/widget/base/_global.scss        |
| ui-listview-scroll-map           | 仮想リストビュー用スクロールマップ領域                 | stylesheets/structure/widget/base/_global.scss        |
| ui-listview-item-base            | 仮想リストビュー用リスト要素                           | stylesheets/structure/widget/base/_global.scss        |
| ui-listview-wrapper              | iScroll 使用時の wrapper                               | cdp-ui-listview 内の Config 既定値                    |
| ui-listview-recycle              | 仮想リストビュー用リスト要素のリサイクル可能状態       | cdp-ui-listview 内の Config 既定値                    |


* ui-ripple-center は label の class 属性に引越し

