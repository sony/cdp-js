import _framework = require("cdp.framework.jqm");

// @class Patch
export type  Patch = CDP.Framework.Patch;
export const Patch = _framework.Patch;

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
export const setupEventHandlers                     = _framework.setupEventHandlers;
export const setActivePage                          = _framework.setActivePage;
export const getDefaultClickEvent                   = _framework.getDefaultClickEvent;

// @class Page
export type  Page = CDP.Framework.Page;
export const Page = _framework.Page;

// interfaces
export type Orientation         = CDP.Framework.Orientation;
export type IPage               = CDP.Framework.IPage;
export type ShowEventData       = CDP.Framework.ShowEventData;
export type HideEventData       = CDP.Framework.HideEventData;
export type FrameworkOptions    = CDP.Framework.FrameworkOptions;
