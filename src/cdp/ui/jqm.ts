import _ui = require("cdp.ui.jqm");

// @module Toast
export module Toast {
    // Toast stuff
    export let LENGTH_SHORT         = _ui.Toast.LENGTH_SHORT;
    export let LENGTH_LONG          = _ui.Toast.LENGTH_LONG;
    export let StyleBuilderDefault  = _ui.Toast.StyleBuilderDefault;
    export let show                 = _ui.Toast.show;
    // interfaces
    export type OffsetX             = CDP.UI.Toast.OffsetX;
    export type OffsetY             = CDP.UI.Toast.OffsetY;
    export type StyleBuilder        = CDP.UI.Toast.StyleBuilder;
}

// @class Dialog
export type Dialog = CDP.UI.Dialog;
export let  Dialog = _ui.Dialog;

// @class PageContainerView
export type PageContainerView<TModel extends Backbone.Model>    = CDP.UI.PageContainerView<TModel>;
export let  PageContainerView                                   = _ui.PageContainerView;

// @class PageView
export type PageView<TModel extends Backbone.Model> = CDP.UI.PageView<TModel>;
export let  PageView                                = _ui.PageView;

// @class PageListView
export type PageListView<TModel extends Backbone.Model> = CDP.UI.PageListView<TModel>;
export let  PageListView                                = _ui.PageListView;

// @class PageExpandableListView
export type PageExpandableListView<TModel extends Backbone.Model>   = CDP.UI.PageExpandableListView<TModel>;
export let  PageExpandableListView                                  = _ui.PageExpandableListView;

// interfaces
export type DialogOptions                                               = CDP.UI.DialogOptions;
export type BasePageView                                                = CDP.UI.BasePageView;
export type PageViewConstructOptions<TModel extends Backbone.Model>     = CDP.UI.PageViewConstructOptions<TModel>;
export type PageContainerOptions<TModel extends Backbone.Model>         = CDP.UI.PageContainerOptions<TModel>;
export type PageListViewConstructOptions<TModel extends Backbone.Model> = CDP.UI.PageListViewConstructOptions<TModel>;
