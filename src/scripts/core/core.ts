/* tslint:disable:max-line-length */

import _core = require("cdp.core");

/**
 * システムの global オブジェクトにアクセス
 * 通常は Window オブジェクトとなる
 */
export let global: any = _core.global;

/**
 * Framework の初期化関数
 *
 * @param options {CoreInitOptions} [in] 初期化オプション.
 */
export let initialize: (options?: CDP.CoreInitOptions) => void = _core.initialize;

/**
 * Web root location にアクセス
 */
export let webRoot: string = _core.webRoot;

export * from "./promise";
export * from "./framework";
