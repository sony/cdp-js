import _ui = require("cdp.ui.listview");

/**
 * @class LineProfile
 * @brief 1 ラインに関するプロファイルクラス
 *        framework が使用する
 */
export let LineProfile = _ui.LineProfile;

/**
 * @class GroupProfile
 * @brief ラインをグループ管理するプロファイルクラス
 *        本クラスでは直接 DOM を操作してはいけない
 */
export let GroupProfile = _ui.GroupProfile;

/**
 * Backbone.View の新規合成
 *
 * @param base    {Backbone.View}                 [in] prototype chain 最下位の View クラス
 * @param derives {Backbone.View|Backbone.View[]} [in] 派生されるの View クラス
 * @return {Backbone.View|Backbone.View[]} 新規に生成された View のコンストラクタ
 */
export let composeViews = _ui.composeViews;

/**
 * Backbone.View の合成
 * prototype chain を作る合成
 *
 * @param derived {Backbone.View}                 [in] prototype chain 最上位の View クラス
 * @param bases   {Backbone.View|Backbone.View[]} [in] 合成元のView クラス
 */
export let deriveViews = _ui.deriveViews;

/**
 * Backbone.View の合成
 * prototype chain を作らない合成
 *
 * @param derived {Backbone.View}                 [in] 元となる View クラス
 * @param bases   {Backbone.View|Backbone.View[]} [in] 合成元のView クラス
 */
export let mixinViews = _ui.mixinViews;

/**
 * @class StatusManager
 * @brief UI 用状態管理クラス
 *        StatusManager のインスタンスごとに任意の状態管理ができる
 *
 */
export let StatusManager = _ui.StatusManager;

/**
 * @class PageProfile
 * @brief 1 ページに関するプロファイルクラス
 *        framework が使用する
 *        本クラスでは直接 DOM を操作してはいけない
 */
export let PageProfile = _ui.PageProfile;

/**
 * @class ScrollerElement
 * @brief HTMLElement の Scroller クラス
 */
export let ScrollerElement = _ui.ScrollerElement;

/**
 * @class ScrollerNative
 * @brief Browser Native の Scroller クラス
 */
export let ScrollerNative = _ui.ScrollerNative;

/**
 * @class ScrollerIScroll
 * @brief iScroll を使用した Scroller クラス
 */
export let ScrollerIScroll = _ui.ScrollerIScroll;

/**
 * @class ListItemView
 * @brief ListView が扱う ListItem コンテナクラス
 */
export let ListItemView = _ui.ListItemView;

/**
 * @class ScrollManager
 * @brief メモリ管理を行うスクロール処理のコアロジック実装クラス
 *        本クラスは IListView インターフェイスを持ち DOM にアクセスするが、Backbone.View を継承しない
 */
export let ScrollManager = _ui.ScrollManager;

/**
 * @class ListView
 * @brief メモリ管理機能を提供する仮想リストビュークラス
 */
export let ListView = _ui.ListView;

/**
 * @class GroupListItemView
 * @brief ExpandableListView が扱う ListItem コンテナクラス
 */
export let GroupListItemView = _ui.GroupListItemView;

/**
 * @class ExpandManager
 * @brief 開閉状態管理クラス
 */
export let ExpandManager = _ui.ExpandManager;

/**
 * @class ExpandableListView
 * @brief 開閉機能を備えた仮想リストビュークラス
 */
export let ExpandableListView = _ui.ExpandableListView;
