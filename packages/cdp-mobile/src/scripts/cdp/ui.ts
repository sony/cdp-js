import * as _framework from "./framework/jqm";
import * as _tools from "./tools/tools";
export * from "./core/promise";
export * from "./ui/listview";
export * from "./ui/jqm";

// framework ui types
export type IPage           = _framework.IPage;
export type Page            = _framework.Page;
export type Orientation     = _framework.Orientation;
export type ShowEventData   = _framework.ShowEventData;
export type HideEventData   = _framework.HideEventData;

export type  View<TModel extends _framework.Model = _framework.Model> = CDP.Framework.View<TModel>;
export const View = _framework.View;

// framework ui utils
export const toUrl                                  = _framework.toUrl;
export const registerPage                           = _framework.registerPage;
export const Orientation                            = _framework.Orientation;
export const getOrientation                         = _framework.getOrientation;
export const registerOrientationChangedListener     = _framework.registerOrientationChangedListener;
export const unregisterOrientationChangedListener   = _framework.unregisterOrientationChangedListener;

// tools ui types & utils
export type JST             = _tools.JST;
export const getTemplate    = _tools.Template.getJST;

const _CDP_UI = CDP.UI;
export default _CDP_UI;
