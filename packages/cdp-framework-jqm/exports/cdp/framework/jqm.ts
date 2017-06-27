import _framework = require("cdp.framework.jqm");

// @module Platform
export const Platform = _framework.Platform;

// Framework methods
export const getOrientation                 = _framework.getOrientation;
export const toUrl                          = _framework.toUrl;
export const setBeforeRouteChangeHandler    = _framework.setBeforeRouteChangeHandler;

// @class Router
export type  Router = CDP.Framework.Router;
export const Router = _framework.Router;

// Framework Core APIs
export const initialize                             = _framework.initialize;
export const isInitialized                          = _framework.isInitialized;
export const waitForInitialize                      = _framework.waitForInitialize;
export const registerOrientationChangedListener     = _framework.registerOrientationChangedListener;
export const unregisterOrientationChangedListener   = _framework.unregisterOrientationChangedListener;
export const getDefaultClickEvent                   = _framework.getDefaultClickEvent;
export const registerPages                          = _framework.registerPages;
export const constructPages                         = _framework.constructPages;
export const disposePages                           = _framework.disposePages;

// @class Page
export type  Page = CDP.Framework.Page;
export const Page = _framework.Page;

// interfaces
export type  Model                                  = CDP.Framework.Model;
export const Model                                  = _framework.Model;
export type  Collection<TModel extends Model>       = CDP.Framework.Collection<TModel>;
export const Collection                             = _framework.Collection;
export type  View<TModel extends Model = Model>     = CDP.Framework.View<TModel>;
export const View                                   = _framework.View;
export type  Events                                 = CDP.Framework.Events;
export const Events                                 = _framework.Events;
export type  Orientation                            = CDP.Framework.Orientation;
export type  PageTransitionDirection                = CDP.Framework.PageTransitionDirection;
export type  Intent                                 = CDP.Framework.Intent;
export type  PageStack                              = CDP.Framework.PageStack;
export type  SubFlowParam                           = CDP.Framework.SubFlowParam;
export type  RouterOptions                          = CDP.Framework.RouterOptions;
export type  NavigateOptions                        = CDP.Framework.NavigateOptions;
export type  IOrientationChangedListener            = CDP.Framework.IOrientationChangedListener;
export type  IBackButtonEventListener               = CDP.Framework.IBackButtonEventListener;
export type  ICommandListener                       = CDP.Framework.ICommandListener;
export type  PageConstructOptions                   = CDP.Framework.PageConstructOptions;
export type  IPage                                  = CDP.Framework.IPage;
export type  ShowEventData                          = CDP.Framework.ShowEventData;
export type  HideEventData                          = CDP.Framework.HideEventData;
export type  FrameworkOptions                       = CDP.Framework.FrameworkOptions;
