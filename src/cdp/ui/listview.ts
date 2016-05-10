import _ui = require("cdp.ui.listview");

// global config
export let ListViewGlobalConfig = _ui.ListViewGlobalConfig;

// @class LineProfile
export type LineProfile = CDP.UI.LineProfile;
export let  LineProfile = _ui.LineProfile;

// @class GroupProfile
export type GroupProfile = CDP.UI.GroupProfile;
export let  GroupProfile = _ui.GroupProfile;

// ListView APIs
export let composeViews = _ui.composeViews;
export let deriveViews  = _ui.deriveViews;
export let mixinViews   = _ui.mixinViews;

// @class StatusManager
export type StatusManager = CDP.UI.StatusManager;
export let  StatusManager = _ui.StatusManager;

// @class PageProfile
export type PageProfile = CDP.UI.PageProfile;
export let  PageProfile = _ui.PageProfile;

// @class ScrollerElement
export type ScrollerElement = CDP.UI.ScrollerElement;
export let  ScrollerElement = _ui.ScrollerElement;

// @class ScrollerNative
export let ScrollerNative = _ui.ScrollerNative;

// @class ScrollerIScroll
export type ScrollerIScroll = CDP.UI.ScrollerIScroll;
export let  ScrollerIScroll = _ui.ScrollerIScroll;

// @class ListItemView
export type ListItemView<TModel extends Backbone.Model> = CDP.UI.ListItemView<TModel>;
export let  ListItemView                                = _ui.ListItemView;

// @class ScrollManager
export type ScrollManager = CDP.UI.ScrollManager;
export let  ScrollManager = _ui.ScrollManager;

// @class ListView
export type ListView<TModel extends Backbone.Model> = CDP.UI.ListView<TModel>;
export let  ListView                                = _ui.ListView;

// @class GroupListItemView
export type GroupListItemView<TModel extends Backbone.Model> = CDP.UI.GroupListItemView<TModel>;
export let  GroupListItemView                                = _ui.GroupListItemView;

// @class ExpandManager
export type ExpandManager = CDP.UI.ExpandManager;
export let  ExpandManager = _ui.ExpandManager;

// @class ExpandableListView
export type ExpandableListView<TModel extends Backbone.Model>   = CDP.UI.ExpandableListView<TModel>;
export let  ExpandableListView                                  = _ui.ExpandableListView;

// interfaces
export type ListViewOptions                                         = CDP.UI.ListViewOptions;
export type IListViewFramework                                      = CDP.UI.IListViewFramework;
export type IScroller                                               = CDP.UI.IScroller;
export type IScrollable                                             = CDP.UI.IScrollable;
export type IBackupRestore                                          = CDP.UI.IBackupRestore;
export type ViewConstructor                                         = CDP.UI.ViewConstructor;
export type IComposableView                                         = CDP.UI.IComposableView;
export type IComposableViewStatic                                   = CDP.UI.IComposableViewStatic;
export type UpdateHeightOptions                                     = CDP.UI.UpdateHeightOptions;
export type IListItemView                                           = CDP.UI.IListItemView;
export type BaseListItemView                                        = CDP.UI.BaseListItemView;
export type EnsureVisibleOptions                                    = CDP.UI.EnsureVisibleOptions;
export type IListView                                               = CDP.UI.IListView;
export type BaseListView                                            = CDP.UI.BaseListView;
export type IStatusManager                                          = CDP.UI.IStatusManager;
export type IExpandManager                                          = CDP.UI.IExpandManager;
export type IExpandableListView                                     = CDP.UI.IExpandableListView;
export type BaseExpandableListView                                  = CDP.UI.BaseExpandableListView;
export type ListItemViewOptions<TModel extends Backbone.Model>      = CDP.UI.ListItemViewOptions<TModel>;
export type ListViewConstructOptions<TModel extends Backbone.Model> = CDP.UI.ListViewConstructOptions<TModel>;
export type GroupListItemViewOptions<TModel extends Backbone.Model> = CDP.UI.GroupListItemViewOptions<TModel>;
