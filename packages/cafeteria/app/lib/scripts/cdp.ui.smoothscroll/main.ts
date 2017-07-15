/*
 * [NOTE] AMD entries module must be named for releases build
 *
 * 生成する d.ts に AMD module 名を設定するために、
 * <amd-module name/> の triple slash directive が必須
 */
/// <amd-module name="cdp.ui.smoothscroll" />

/*
 * [NOTE] Managed AMD namespace
 *
 * 複数のファイルで構成される lib module の場合、
 * release ビルド時において、複数の module 間で内部で使用される AMD module 名のコンフリクト避けるため、
 * 必ず namespace path がシステム内で一意となるように管理することが必須
 */
import SmoothScroll from "./cdp/ui/smooth-scroll";

/*
 * [NOTE] global export
 *
 * CDP のような global オブジェクトにアサインする場合は、
 * 以下のように string literal を使用可能
 * ※既存の cdp.*.js に実装する場合は、従来どおり classical module 方式にすること
 */
/* tslint:disable:no-string-literal */
const global = Function("return this")();
global["CDP"]       = global["CDP"] || {};
global["CDP"]["UI"] = global["CDP"]["UI"] || {};
global["CDP"]["UI"].SmoothScroll = SmoothScroll;
/* tslint:enable:no-string-literal */

export { SmoothScroll };
