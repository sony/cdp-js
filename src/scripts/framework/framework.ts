import _framework = require("cdp.framework.jqm");

/**
 * @class Patch
 * @brief patch class for jqm framework.
 */
export let Patch: CDP.Framework.Patch = _framework.Patch;

/**
 * Orientation の取得
 *
 * @return {Number} Orientation Code.
 */
export let getOrientation: () => CDP.Framework.Orientation = _framework.getOrientation;

/**
 * path を URL に変換
 * "/" から始まるものは web root から、それ以外は現在のページから絶対パスURLに変換する。
 * jQM の挙動にあわせており、require.toUrl() と異なるので注意。
 *
 * @param path {String} [in] パスを指定。
 */
export let toUrl: (path: string) => string = _framework.toUrl;

/**
 * "before route change" ハンドラ設定
 *
 * @param  {Function} handler 指定.
 * @return {Function} 以前の handler.
 */
export let setBeforeRouteChangeHandler: (handler: () => JQueryPromise<any>) => () => JQueryPromise<any> = _framework.setBeforeRouteChangeHandler;

/**
 * @class Router
 * @brief jQueryMobile と Backbone.Router を調停する Router クラス
 *        ルーティングを開始していない場合にも、navigate() は jQM フレームワークを使用して機能する。
 */
export let Router: CDP.Framework.Router = _framework.Router;

/**
 * Framework の初期化関数
 *
 * @param options {FrameworkOptions} [in] options object.
 */
export let initialize: (options?: CDP.Framework.FrameworkOptions) => JQueryPromise<any> = _framework.initialize;

/**
 * 初期化済みか判定
 *
 * @return {Boolean} true: 初期化済み / false: 未初期化
 */
export let isInitialized: () => boolean = _framework.isInitialized;

/**
 * IOrientationChangedListener を Framework に登録
 *
 * @param key      {String}                      [in] ID key
 * @param listener {IOrientationChangedListener} [in] IOrientationChangedListener instance
 */
export let registerOrientationChangedListener: (key: string, listener: CDP.Framework.IOrientationChangedListener) => void = _framework.registerOrientationChangedListener;

/**
 * IOrientationChangedListener を Framework から登録解除
 *
 * @param key {String} [in] ID key
 */
export let unregisterOrientationChangedListener: (key: string) => void = _framework.unregisterOrientationChangedListener;

/**
 * \~english
 * Setup event handlers when after router initialized.
 *
 * @private
 *
 * \~japanese
 * イベントハンドラの設定. Router 初期化後に Framework がコールする.
 *
 * @private
 */
export let setupEventHandlers: () => void = _framework.setupEventHandlers;

/**
 * active Page の設定. Framework がコールする.
 *
 * @private
 * @param page {IPage} [in] IPage instance.
 */
export let setActivePage: (page: CDP.Framework.IPage) => void = _framework.setActivePage;

/**
 * Framework が既定に使用するクリックイベント文字列を取得
 *
 * @private
 * @return {String} "vclick" / "click"
 */
export let getDefaultClickEvent: () => string = _framework.getDefaultClickEvent;

/**
 * @class Page
 * @brief すべてのページの基本となる既定クラス
 */
export let Page: new (_url: string, _id: string, options?: CDP.Framework.PageConstructOptions) => CDP.Framework.Page = _framework.Page;
