import _promise = require("cdp.promise");

/**
 * Promise オブジェクトの作成
 * jQueryDeferred オブジェクトから、Tools.Promise オブジェクトを作成する
 *
 * @param df {JQueryDeferred} [in] jQueryDeferred instance を指定
 * @param options? {Object}   [in] jQueryPromise を拡張するオブジェクトを指定
 * @return {IPromise} Tools.IPromise オブジェクト
 */
export let makePromise = _promise.makePromise;

/**
 * Promise オブジェクトの終了を待つ
 * $.when() は失敗するとすぐに制御を返すのに対し、失敗も含めて待つ Promise オブジェクトを返却
 *
 * @param deferreds {JQueryPromise<T>|JQueryPromise<T>[]} [in] Promise オブジェクト(可変引数, 配列)
 * @return {JQueryPromise<T>} Promise オブジェクト
 */
export let wait = _promise.wait;

/**
 * @class PromiseManager
 * @brief 複数の DataProvider.Promise を管理するクラス
 */
export let PromiseManager = _promise.PromiseManager;
