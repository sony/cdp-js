import _ui = require("cdp.ui.jqm");

/**
 * @class Toast
 * @brief Android SDK の Toast クラスのように自動消滅するメッセージ出力ユーティリティ
 *        入れ子の関係を実現するために module で実装
 */
export module Toast {
    export let LENGTH_SHORT = _ui.Toast.LENGTH_SHORT;
    export let LENGTH_LONG = _ui.Toast.LENGTH_LONG;

    /**
     * @class StyleBuilderDefault
     * @brief スタイル変更時に使用する既定の構造体オブジェクト
     */
    export let StyleBuilderDefault = _ui.Toast.StyleBuilderDefault;
    /**
     * Toast 表示
     *
     * @param message  [in] メッセージ
     * @param duration [in] 表示時間を設定 (msec) default: LENGTH_SHORT
     * @param style    [in] スタイル変更する場合には派生クラスオブジェクトを指定
     */
    export let show = _ui.Toast.show;
}

/**
 * @class Dialog
 * @brief 汎用ダイアログクラス
 *        jQM の popup widget によって実装
 */
export let Dialog = _ui.Dialog;

/**
 * @class PageContainerView
 * @brief PageView と連携可能な コンテナビュークラス
 */
export let PageContainerView = _ui.PageContainerView;

/**
 * @class PageView
 * @brief CDP.Framework.Page と Backbone.View の両方の機能を提供するページの基底クラス
 */
export let PageView = _ui.PageView;

/**
 * @class PageListView
 * @brief 仮想リストビュー機能を持つ PageView クラス
 */
export let PageListView = _ui.PageListView;

/**
 * @class PageExpandableListView
 * @brief 開閉リストビュー機能を持つ PageView クラス
 */
export let PageExpandableListView = _ui.PageExpandableListView;
