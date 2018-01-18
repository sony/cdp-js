/*
 * [NOTE] AMD entries module must be named for releases build
 *
 * 生成する d.ts に AMD module 名を設定するために、
 * <amd-module name/> の triple slash directive が必須
 */
/// <amd-module name="cdp.slideshow" />

/*
 * [NOTE] Managed AMD namespace
 *
 * 複数のファイルで構成される lib module の場合、
 * release ビルド時において、複数の module 間で内部で使用される AMD module 名のコンフリクト避けるため、
 * 必ず namespace path がシステム内で一意となるように管理することが必須
 */
import * as _SlideShow from "./cdp/slideshow/player";
export { _SlideShow as SlideShow };

/*
 * [NOTE] global export
 *
 * CDP のような global オブジェクトにアサインする場合は、
 * 以下のように string literal を使用可能
 * ※既存の cdp.*.js に実装する場合は、従来どおり classical module 方式にすること
 */
/* tslint:disable:no-string-literal */
const global = Function("return this")();
global["CDP"] = global["CDP"] || {};
global["CDP"].SlideShow = _SlideShow;
/* tslint:enable:no-string-literal */

/*
 * [NOTE] global declaration
 *
 * 以下のように global オブジェクトにアサイン可能
 * ※既存の cdp.ui.*.js に実装する場合は、従来どおり classical module 方式にすること
 */
declare global {
    namespace CDP {
        const SlideShow: typeof _SlideShow;
    }
}
