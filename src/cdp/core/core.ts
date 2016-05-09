import _core = require("cdp.core");

/**
 * システムの global オブジェクトにアクセス
 * 通常は Window オブジェクトとなる
 */
export let global = _core.global;

/**
 * Framework の初期化関数
 *
 * @param options {CoreInitOptions} [in] 初期化オプション.
 */
export let initialize = _core.initialize;

/**
 * Web root location にアクセス
 */
export let webRoot = _core.webRoot;
