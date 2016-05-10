import _framework = require("cdp.framework.jqm");

// @class Patch
export let Patch = _framework.Patch;

// Framework methods
export let getOrientation               = _framework.getOrientation;
export let toUrl                        = _framework.toUrl;
export let setBeforeRouteChangeHandler  = _framework.setBeforeRouteChangeHandler;

// @class Router
export let Router = _framework.Router;

// Framework Core APIs
export let initialize                           = _framework.initialize;
export let isInitialized                        = _framework.isInitialized;
export let registerOrientationChangedListener   = _framework.registerOrientationChangedListener;
export let unregisterOrientationChangedListener = _framework.unregisterOrientationChangedListener;
export let setupEventHandlers                   = _framework.setupEventHandlers;
export let setActivePage                        = _framework.setActivePage;
export let getDefaultClickEvent                 = _framework.getDefaultClickEvent;

// @class Page
export let Page = _framework.Page;
