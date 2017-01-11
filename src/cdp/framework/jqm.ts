import _framework = require("cdp.framework.jqm");

// @class Patch
export type Patch = CDP.Framework.Patch;
export let  Patch = _framework.Patch;

// @module Platform
export let Platform = _framework.Platform;

// Framework methods
export let getOrientation               = _framework.getOrientation;
export let toUrl                        = _framework.toUrl;
export let setBeforeRouteChangeHandler  = _framework.setBeforeRouteChangeHandler;

// @class Router
export type Router = CDP.Framework.Router;
export let  Router = _framework.Router;

// Framework Core APIs
export let initialize                           = _framework.initialize;
export let isInitialized                        = _framework.isInitialized;
export let registerOrientationChangedListener   = _framework.registerOrientationChangedListener;
export let unregisterOrientationChangedListener = _framework.unregisterOrientationChangedListener;
export let setupEventHandlers                   = _framework.setupEventHandlers;
export let setActivePage                        = _framework.setActivePage;
export let getDefaultClickEvent                 = _framework.getDefaultClickEvent;

// @class Page
export type Page = CDP.Framework.Page;
export let  Page = _framework.Page;

// interfaces
export type Orientation         = CDP.Framework.Orientation;
export type IPage               = CDP.Framework.IPage;
export type ShowEventData       = CDP.Framework.ShowEventData;
export type HideEventData       = CDP.Framework.HideEventData;
export type FrameworkOptions    = CDP.Framework.FrameworkOptions;
