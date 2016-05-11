/*!
 * cdp.js 0.0.1
 *
 * Date: 2016-05-11T12:51:21+0900
 */
(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define("cdp.core", [], function() {
            return factory(root);
        });
    } else if (typeof exports === "object") {
        module.exports = factory(root);
    } else {
        factory(root);
    }
})((this || 0).self || global, function(root) {
    var TAG = "[CDP] ";
    var CDP = root.CDP || (root.CDP = {});
    var Patch = function() {
        function Patch() {}
        function _apply() {
            if (null == root.console || null == root.console.error) {
                _consolePatch();
            }
            if (typeof MSApp === "object") {
                _nodePatch();
            }
        }
        function _consolePatch() {
            root.console = {
                count: function() {},
                groupEnd: function() {},
                time: function() {},
                timeEnd: function() {},
                trace: function() {},
                group: function() {},
                dirxml: function() {},
                debug: function() {},
                groupCollapsed: function() {},
                select: function() {},
                info: function() {},
                profile: function() {},
                assert: function() {},
                msIsIndependentlyComposed: function() {},
                clear: function() {},
                dir: function() {},
                warn: function() {},
                error: function() {},
                log: function() {},
                profileEnd: function() {}
            };
        }
        function _nodePatch() {
            var originalAppendChild = Node.prototype.appendChild;
            Node.prototype.appendChild = function(node) {
                var _this = this;
                return MSApp.execUnsafeLocalFunction(function() {
                    return originalAppendChild.call(_this, node);
                });
            };
            var originalInsertBefore = Node.prototype.insertBefore;
            Node.prototype.insertBefore = function(newElement, referenceElement) {
                var _this = this;
                return MSApp.execUnsafeLocalFunction(function() {
                    return originalInsertBefore.call(_this, newElement, referenceElement);
                });
            };
        }
        Patch.apply = _apply;
        return Patch;
    }();
    var _webRoot = function() {
        var dir = /.+\/(.+)\/[^\/]*#[^\/]+/.exec(location.href);
        if (!dir) {
            dir = /.+\/(.+)\//.exec(location.href);
        }
        return dir[0];
    }();
    function _init(options) {
        setTimeout(function() {
            try {
                Patch.apply();
                if (options && typeof options.success === "function") {
                    options.success();
                }
            } catch (error) {
                var msg = error && error.message ? error.message : "initialize failed.";
                console.error(TAG + msg);
                if (options && typeof options.fail === "function") {
                    options.fail(error);
                }
            }
        });
    }
    CDP.global = root;
    CDP.initialize = _init;
    CDP.webRoot = _webRoot;
    return CDP;
});

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define("cdp.promise", [ "jquery" ], function($) {
            return factory(root.CDP || (root.CDP = {}), $);
        });
    } else if (typeof exports === "object") {
        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"));
    } else {
        factory(root.CDP || (root.CDP = {}), root.jQuery || root.$);
    }
})((this || 0).self || global, function(CDP, $) {
    var CDP;
    (function(CDP) {
        var TAG = "[CDP.Promise] ";
        function makePromise(df, options) {
            var _abort = function(info) {
                var detail = info ? info : {
                    message: "abort"
                };
                if (null != this.dependency) {
                    if (this.dependency.abort) {
                        this.dependency.abort(detail);
                    } else {
                        console.error(TAG + "[call] dependency object doesn't have 'abort()' method.");
                    }
                    if (this.callReject && "pending" === this.state()) {
                        df.reject(detail);
                    }
                } else if ("pending" === this.state()) {
                    df.reject(detail);
                }
            };
            var _dependOn = function(promise) {
                var _this = this;
                if (promise.abort) {
                    this.dependency = promise;
                    promise.always(function() {
                        _this.dependency = null;
                    });
                } else {
                    console.error(TAG + "[set] dependency object doesn't have 'abort()' method.");
                }
                return promise;
            };
            var target = $.extend({}, {
                dependency: null,
                callReject: false
            }, options);
            var promise = df.promise(target);
            if (null == promise.abort) {
                promise.abort = _abort.bind(promise);
            }
            if (null == promise.dependOn) {
                promise.dependOn = _dependOn.bind(promise);
            }
            return promise;
        }
        CDP.makePromise = makePromise;
        function wait() {
            var deferreds = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                deferreds[_i - 0] = arguments[_i];
            }
            var _deferreds = [].concat.apply([], deferreds);
            var df = $.Deferred();
            var results = [];
            var initialized = false;
            var isFinished = function() {
                if (!initialized) {
                    return false;
                } else {
                    return !results.some(function(element) {
                        return "pending" === element.status;
                    });
                }
            };
            _deferreds.forEach(function(deferred, index) {
                results.push({
                    status: "pending",
                    args: null
                });
                deferred.then(function() {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    results[index].status = "resolved";
                    results[index].args = args;
                }, function() {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    results[index].status = "rejected";
                    results[index].args = args;
                }).always(function() {
                    if (isFinished()) {
                        df.resolve(results);
                    }
                });
            });
            initialized = true;
            if (isFinished()) {
                df.resolve(results);
            }
            return df.promise();
        }
        CDP.wait = wait;
        var PromiseManager = function() {
            function PromiseManager() {
                this._pool = [];
                this._id = 0;
            }
            PromiseManager.prototype.add = function(promise) {
                var _this = this;
                if (promise == null) {
                    return null;
                }
                if (!promise.abort) {
                    console.error(TAG + "[add] promise object doesn't have 'abort()' method.");
                    return promise;
                }
                var cookie = {
                    promise: promise,
                    id: this._id++
                };
                this._pool.push(cookie);
                promise.always(function() {
                    _this._pool = _this._pool.filter(function(element) {
                        if (element.id !== cookie.id) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                });
                return promise;
            };
            PromiseManager.prototype.cancel = function(info) {
                var promises = this.promises();
                promises.forEach(function(element) {
                    if (element.abort) {
                        element.abort(info);
                    }
                });
                return wait.apply(null, promises);
            };
            PromiseManager.prototype.promises = function() {
                return this._pool.map(function(element) {
                    return element.promise;
                });
            };
            return PromiseManager;
        }();
        CDP.PromiseManager = PromiseManager;
    })(CDP || (CDP = {}));
    return CDP;
});

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define("cdp.framework.jqm", [ "cdp.core", "cdp.promise", "backbone" ], function() {
            return factory(root.CDP || (root.CDP = {}));
        });
    } else {
        factory(root.CDP || (root.CDP = {}));
    }
})(this, function(CDP) {
    CDP.Framework = CDP.Framework || {};
    var CDP;
    (function(CDP) {
        var Framework;
        (function(Framework) {
            Framework.Platform = function() {
                var ua = navigator.userAgent.toLowerCase();
                var majorVersion = function(browser) {
                    var version = ua.match(new RegExp("(" + browser + ")( |/)([0-9]+)"));
                    if (!version || version.length < 4) {
                        return 0;
                    }
                    return parseInt(version[3], 10);
                };
                return {
                    ltIE6: typeof window.addEventListener === "undefined" && typeof document.documentElement.style.maxHeight === "undefined",
                    ltIE7: typeof window.addEventListener === "undefined" && typeof document.querySelectorAll === "undefined",
                    ltIE8: typeof window.addEventListener === "undefined" && typeof document.getElementsByClassName === "undefined",
                    ltIE9: document.uniqueID && typeof window.matchMedia === "undefined",
                    gtIE10: document.uniqueID && window.matchMedia,
                    Trident: document.uniqueID,
                    Gecko: "MozAppearance" in document.documentElement.style,
                    Presto: CDP.global.opera,
                    Blink: CDP.global.chrome,
                    Webkit: typeof CDP.global.chrome === "undefined" && "WebkitAppearance" in document.documentElement.style,
                    Touch: typeof CDP.global.ontouchstart !== "undefined",
                    Mobile: typeof CDP.global.orientation !== "undefined",
                    ltAd4_4: typeof CDP.global.orientation !== "undefined" && (typeof CDP.global.EventSource === "undefined" || 30 > majorVersion("chrome")),
                    Pointer: CDP.global.navigator.pointerEnabled,
                    MSPoniter: CDP.global.navigator.msPointerEnabled,
                    Android: ua.indexOf("android") !== -1,
                    iOS: ua.indexOf("iphone") !== -1 || ua.indexOf("ipad") !== -1 || ua.indexOf("ipod") !== -1
                };
            }();
        })(Framework = CDP.Framework || (CDP.Framework = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var Framework;
        (function(Framework) {
            var _vclickPatch = function() {
                var jquery_on = $.fn.on, jquery_off = $.fn.off;
                var custom_on = function(types, selector, data, fn, one) {
                    if (typeof types === "string") {
                        types = types.replace(/vclick/g, "click");
                    }
                    return _.bind(jquery_on, this)(types, selector, data, fn, one);
                };
                var custom_off = function(types, selector, fn) {
                    if (typeof types === "string") {
                        types = types.replace(/vclick/g, "click");
                    }
                    return _.bind(jquery_off, this)(types, selector, fn);
                };
                $.fn.on = custom_on;
                $.fn.off = custom_off;
            };
            var Patch = function() {
                function Patch() {}
                Patch.apply = function() {
                    if (!Patch.isSupportedVclick()) {
                        _vclickPatch();
                        Patch.s_vclickEvent = "click";
                    }
                };
                Patch.isSupportedVclick = function() {
                    if (Framework.Platform.Android && !Framework.Platform.ltAd4_4) {
                        return false;
                    }
                    return true;
                };
                Patch.s_vclickEvent = "vclick";
                return Patch;
            }();
            Framework.Patch = Patch;
        })(Framework = CDP.Framework || (CDP.Framework = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var Framework;
        (function(Framework) {
            (function(Orientation) {
                Orientation[Orientation["PORTRAIT"] = 0] = "PORTRAIT";
                Orientation[Orientation["LANDSCAPE"] = 1] = "LANDSCAPE";
            })(Framework.Orientation || (Framework.Orientation = {}));
            var Orientation = Framework.Orientation;
            function getOrientation() {
                var $window = $(window);
                return $window.width() < $window.height() ? Orientation.PORTRAIT : Orientation.LANDSCAPE;
            }
            Framework.getOrientation = getOrientation;
        })(Framework = CDP.Framework || (CDP.Framework = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var Framework;
        (function(Framework) {
            function toUrl(path) {
                if (null != path[0] && "/" === path[0]) {
                    return CDP.webRoot + path.slice(1);
                } else {
                    return $.mobile.path.makeUrlAbsolute(path, getCurrentDocumentUrl());
                }
            }
            Framework.toUrl = toUrl;
            function getCurrentDocumentUrl() {
                var $activePage = $("body").pagecontainer("getActivePage");
                if (null == $activePage) {
                    return $.mobile.path.documentBase.hrefNoHash;
                }
                var url = $.mobile.activePage.closest(".ui-page").jqmData("url"), base = $.mobile.path.documentBase.hrefNoHash;
                if (!url || !$.mobile.path.isPath(url)) {
                    url = base;
                }
                return $.mobile.path.makeUrlAbsolute(url, base);
            }
            var _beforeRouteChange = function() {
                return $.Deferred().resolve().promise();
            };
            var _defaultBeforeRouteChange = _beforeRouteChange;
            function setBeforeRouteChangeHandler(handler) {
                if (null == handler) {
                    return _beforeRouteChange;
                } else {
                    var oldHandler = _beforeRouteChange;
                    _beforeRouteChange = handler;
                    return oldHandler;
                }
            }
            Framework.setBeforeRouteChangeHandler = setBeforeRouteChangeHandler;
            var Router = function() {
                function Router() {}
                Router.initialize = function(options) {
                    var $body = $("body");
                    if (!!Router.s_router) {
                        console.warn("logic error. initialize call twice.");
                        return false;
                    }
                    Router.s_initOptions = $.extend({}, Router.s_defaultInitOptions, options);
                    Router.s_loadUrl = _.bind(Backbone.history.loadUrl, Backbone.history);
                    Backbone.history.loadUrl = Router.customLoadUrl;
                    Router.s_router = new Backbone.Router();
                    Router.s_router.on("route", Router.onRouteSucceeded);
                    if (!$.mobile.hashListeningEnabled) {
                        Router.s_back = _.bind($.mobile.back, $.mobile);
                        $.mobile.back = Router.customJqmBack;
                    }
                    if (null == $.mobile.changePage) {
                        $.mobile.changePage = function(to, options) {
                            $body.pagecontainer("change", to, options);
                        };
                    }
                    Router.bindEvents();
                    Framework.setupEventHandlers();
                    return true;
                };
                Router.register = function(route, page, top, callback) {
                    if (top === void 0) {
                        top = false;
                    }
                    var restart = Router.stop();
                    var name = route + page;
                    var context = {
                        route: route,
                        regexp: Router.s_router._routeToRegExp(route),
                        page: page,
                        top: top,
                        callback: callback || function() {
                            return false;
                        }
                    };
                    if (Router.pushContext(name, context)) {
                        Router.s_router.route(route, name, function() {});
                    }
                    if (restart) {
                        Router.start({
                            silent: true
                        });
                    }
                    return Router;
                };
                Router.start = function(options) {
                    if ($.mobile.hashListeningEnabled) {
                        console.log("setting error. confict: $.mobile.hashListeningEnabled = true, cannot start.");
                        return false;
                    }
                    return Backbone.history.start(options);
                };
                Router.stop = function() {
                    var prevState = Backbone.History.started;
                    Backbone.history.stop();
                    return prevState;
                };
                Router.isRouting = function() {
                    return Backbone.History.started;
                };
                Router.navigate = function(url, transition, reverse, options) {
                    if (!!Router.s_lastNavigateInfo.inNavigation) {
                        console.log("Router.navigate() called in navigation proc.");
                        return;
                    } else if (Router.initFirstPageIfNeeded(url)) {
                        return;
                    }
                    var navOptions = $.extend({}, Router.s_defaultNavigateOptions, options);
                    var notifyBeforeRouteChange = Router.s_lastNavigateInfo.calledBeforeRouteChange ? _defaultBeforeRouteChange : _beforeRouteChange;
                    Router.s_lastNavigateInfo = {
                        url: url,
                        transition: transition,
                        reverse: reverse,
                        backDestination: navOptions.backDestination,
                        noHashChange: navOptions.noHashChange,
                        intent: navOptions.intent || {},
                        positiveNavigate: true,
                        calledBeforeRouteChange: true,
                        inNavigation: true
                    };
                    notifyBeforeRouteChange().fail(function() {
                        console.error("before route change call, failed.");
                    }).always(function() {
                        if (Router.isRouting() && !Router.s_lastNavigateInfo.noHashChange) {
                            if (navOptions.subFlow) {
                                switch (navOptions.subFlow.operation) {
                                  case "begin":
                                    Router.beginSubFlow(navOptions.subFlow);
                                    break;

                                  case "end":
                                    Router.endSubFlow(navOptions);
                                    return;

                                  default:
                                    console.warn("unknown subFlow.operation. operation: " + navOptions.subFlow.operation);
                                    break;
                                }
                            }
                            Router.s_router.navigate(url, navOptions);
                        } else {
                            (function() {
                                var fragment = Backbone.history.getFragment(url);
                                var context;
                                if (Router.s_lastNavigateInfo.noHashChange) {
                                    context = _.find(Router.s_rootContexts, function(context) {
                                        return context.regexp.test(fragment);
                                    });
                                } else {
                                    context = _.findWhere(Router.s_rootContexts, {
                                        route: fragment
                                    });
                                }
                                if (context) {
                                    url = context.page;
                                }
                            })();
                            Router.changePage(url);
                        }
                    });
                };
                Router.back = function() {
                    if (!!Router.s_lastNavigateInfo.inNavigation) {
                        console.log("Router.back() called in navigation proc.");
                        return;
                    } else if (Router.isTopPage()) {
                        var app = navigator.app || {};
                        if (!!app.exitApp) {
                            app.exitApp();
                            return;
                        }
                    }
                    Router.s_lastNavigateInfo = {
                        inNavigation: true,
                        calledBeforeRouteChange: true
                    };
                    _beforeRouteChange().then(function() {
                        $.mobile.back();
                    }).fail(function() {
                        console.error("before route change call, failed.");
                        Router.s_lastNavigateInfo = {};
                    });
                };
                Router.pushIntent = function(intent) {
                    Router.s_lastIntent = $.extend({}, Router.s_lastIntent, intent);
                };
                Router.popIntent = function() {
                    var intent = Router.s_lastIntent;
                    Router.s_lastIntent = {};
                    return intent;
                };
                Router.getQueryParameters = function() {
                    if (Router.s_lastNavigateInfo.intent && Router.s_lastNavigateInfo.intent.params) {
                        return Router.s_lastNavigateInfo.intent.params["queryParams"];
                    } else {
                        return null;
                    }
                };
                Router.isInSubFlow = function() {
                    var stack = Router.getJqmHistory().stack;
                    var has = _.some(stack, function(value) {
                        return !!value[Router.SUBFLOW_PARAM];
                    });
                    return has;
                };
                Router.fromHashChanged = function() {
                    return Router.s_lastNavigateInfo.inNavigation && null == Router.s_lastNavigateInfo.positiveNavigate;
                };
                Router.registerPageStack = function(pageStack, withNavigate, options) {
                    var newStacks = [];
                    var failed = false;
                    pageStack = pageStack instanceof Array ? pageStack : [ pageStack ];
                    withNavigate = null == withNavigate ? false : withNavigate;
                    (function() {
                        var makeStack = function(info) {
                            var url;
                            var stack;
                            var fragment = Backbone.history.getFragment(info.route);
                            var context = _.find(Router.s_rootContexts, function(context) {
                                return context.regexp.test(fragment);
                            });
                            if (!context) {
                                console.warn("route is not registered. route: " + info.route);
                                return null;
                            } else {
                                url = Router.pathToJqmDataUrl(context.page);
                            }
                            stack = {
                                route: info.route,
                                pageUrl: url,
                                title: info.title,
                                transition: info.transition,
                                url: url
                            };
                            return stack;
                        };
                        for (var i = 0, n = pageStack.length; i < n; i++) {
                            var stack = makeStack(pageStack[i]);
                            if (!stack) {
                                failed = true;
                                break;
                            } else {
                                newStacks.push(stack);
                            }
                        }
                    })();
                    if (failed) {
                        return false;
                    }
                    (function() {
                        var restart = Router.stop();
                        var silentLength = newStacks.length - 1;
                        var finalIndex = newStacks.length - 1;
                        Router.getJqmHistory().clearForward();
                        for (var i = 0, n = silentLength; i < n; i++) {
                            location.hash = newStacks[i].route;
                            Router.getJqmHistory().stack.push(newStacks[i]);
                            Router.getJqmHistory().activeIndex = Router.getJqmHistory().stack.length - 1;
                        }
                        if (withNavigate) {
                            restart = false;
                            Router.start({
                                silent: true
                            });
                            Router.navigate(newStacks[finalIndex].route, newStacks[finalIndex].transition, false, options);
                        } else {
                            location.hash = newStacks[finalIndex].route;
                            Router.getJqmHistory().stack.push(newStacks[finalIndex]);
                            Router.getJqmHistory().activeIndex = Router.getJqmHistory().stack.length - 1;
                        }
                        if (restart) {
                            Router.start({
                                silent: true
                            });
                        }
                    })();
                    return true;
                };
                Router.customLoadUrl = function(fragment) {
                    var handled = Router.s_loadUrl(fragment);
                    if (!handled) {
                        Router.onRouteFailed(fragment);
                    }
                    return handled;
                };
                Router.customJqmBack = function() {
                    if (Router.isRouting()) {
                        history.back();
                    } else {
                        Router.s_back();
                    }
                };
                Router.bindEvents = function() {
                    $(document).one("pagechange", function() {
                        if (Router.s_initOptions.anchorVclick) {
                            $(document).on("vclick", "[href]", function(event) {
                                Router.onAnchorVclicked(event);
                            });
                        }
                    }).on("pagebeforeshow", function(event) {
                        if (null != Router.s_lastNavigateInfo.backDestination) {
                            var active = Router.getJqmHistory().getActive();
                            active[Router.BACK_DESTINATION_URL] = Router.s_lastNavigateInfo.backDestination;
                        }
                    }).on("pageshow", function(event) {
                        var active = Router.getJqmHistory().getActive();
                        if (active[Router.SUBFLOW_PARAM]) {
                            delete active[Router.SUBFLOW_PARAM];
                        }
                    }).on("pagechange pagecontainerloadfailed", function(event) {
                        Router.s_lastNavigateInfo = {};
                    });
                    CDP.setBackButtonHandler(Router.back);
                };
                Router.pushContext = function(name, context) {
                    if (!!Router.s_rootContexts[name]) {
                        console.log("logic error. route is already registered. name: " + name);
                        return false;
                    }
                    Router.s_rootContexts[name] = context;
                    return true;
                };
                Router.initFirstPageIfNeeded = function(url) {
                    if (!$.mobile.autoInitializePage) {
                        $(document).one("pagebeforechange", function(event, data) {
                            data.toPage = Framework.toUrl(url);
                        });
                        $.mobile.initializePage();
                        $.mobile.autoInitializePage = true;
                        return true;
                    }
                    return false;
                };
                Router.isTopPage = function() {
                    var fragment = Backbone.history.getFragment($.mobile.path.parseUrl(location.href).hash);
                    var context = _.find(Router.s_rootContexts, function(context) {
                        return context.regexp.test(fragment);
                    });
                    return null == context ? false : context.top;
                };
                Router.onAnchorVclicked = function(event) {
                    if (Router.isJustBeforeVclicked()) {
                        event.preventDefault();
                        return false;
                    }
                    return Router.followAnchor(event);
                };
                Router.followAnchor = function(event) {
                    var $target = $(event.currentTarget);
                    var url = $target.jqmData("href") || $target.attr("href");
                    var transition = $target.jqmData("transition");
                    var direction = $target.jqmData("direction");
                    var backDst = $target.attr(Router.DATA_BACK_DESTINATION);
                    var noHashChange = $target.attr(Router.DATA_NO_HASH_CHANGE) ? $target.attr(Router.DATA_NO_HASH_CHANGE) === "true" : false;
                    var noHrefHandle = $target.attr(Router.DATA_NO_VCLICK_HANDLE) ? $target.attr(Router.DATA_NO_VCLICK_HANDLE) === "true" : false;
                    if (noHrefHandle || Router.needDefaultOperation(url)) {
                        return true;
                    }
                    event.preventDefault();
                    if (Router.isBackButtonClicked(event)) {
                        Router.back();
                    } else {
                        Router.navigate(url, transition, !!direction, {
                            noHashChange: noHashChange,
                            backDestination: backDst
                        });
                    }
                    return false;
                };
                Router.needDefaultOperation = function(url) {
                    if (!url || "#" === url) {
                        return true;
                    } else if ("#" === url[0]) {
                        return !Router.canResolveRoute(url);
                    } else {
                        return false;
                    }
                };
                Router.canResolveRoute = function(url) {
                    var fragment = Backbone.history.getFragment(url);
                    return _.any(Backbone.history.handlers, function(handler) {
                        if (handler.route.test(fragment)) {
                            return true;
                        }
                    });
                };
                Router.isJustBeforeVclicked = function() {
                    var isBefore = Date.now() - Router.s_lastClickedTime < Router.DELAY_TIME * 2;
                    Router.s_lastClickedTime = Date.now();
                    return isBefore;
                };
                Router.isBackButtonClicked = function(event) {
                    if ($(event.currentTarget).jqmData("rel") === "back") {
                        return true;
                    } else {
                        return false;
                    }
                };
                Router.onRouteSucceeded = function(name) {
                    var args = [];
                    for (var _i = 1; _i < arguments.length; _i++) {
                        args[_i - 1] = arguments[_i];
                    }
                    var context = Router.s_rootContexts[name];
                    if (!!context) {
                        var intent = {
                            params: {
                                queryParams: args
                            }
                        };
                        Router.s_lastNavigateInfo.inNavigation = true;
                        if (null != Router.s_lastNavigateInfo.intent) {
                            intent.params = $.extend({}, intent.params, Router.s_lastNavigateInfo.intent.params || {});
                        }
                        Router.s_lastNavigateInfo.intent = $.extend({}, Router.s_lastNavigateInfo.intent, intent);
                        var handled = context.callback(args);
                        if (!handled) {
                            Router.changePage(context.page);
                        }
                    }
                };
                Router.onRouteFailed = function(fragment) {
                    Router.s_lastNavigateInfo.inNavigation = true;
                    if (null == fragment) {
                        fragment = Backbone.history.getFragment();
                    }
                    if (Router.s_lastNavigateInfo.positiveNavigate) {
                        var context = Router.s_rootContexts[fragment];
                        if (null == context) {
                            context = {
                                route: fragment,
                                regexp: Router.s_router._routeToRegExp(fragment),
                                page: Router.s_lastNavigateInfo.url,
                                top: false,
                                callback: null
                            };
                            Router.pushContext(fragment, context);
                        }
                    }
                    var path = fragment;
                    if (null != Router.s_rootContexts[fragment]) {
                        path = Router.s_rootContexts[fragment].page;
                    }
                    Router.changePage(path);
                };
                Router.changePage = function(path) {
                    var notifyBeforeRouteChange;
                    if (!Router.s_lastNavigateInfo.positiveNavigate) {
                        if (Router.s_lastNavigateInfo.inAdditionalBack) {
                            Router.s_lastNavigateInfo.inAdditionalBack = false;
                        } else {
                            Router.decideDirection(path);
                            var additional = Router.detectAdditionalBackDistance();
                            if (0 < additional) {
                                Router.s_lastNavigateInfo.inAdditionalBack = true;
                                Router.getJqmHistory().activeIndex -= additional;
                                history.go(-additional);
                                return;
                            }
                        }
                        var subFlowInfo = Router.detectSubFlowBaseInfo();
                        if (subFlowInfo.isCurrent) {
                            delete subFlowInfo.stack[Router.SUBFLOW_PARAM];
                        }
                    }
                    notifyBeforeRouteChange = Router.s_lastNavigateInfo.calledBeforeRouteChange ? _defaultBeforeRouteChange : _beforeRouteChange;
                    notifyBeforeRouteChange().then(function() {
                        if (Router.s_lastNavigateInfo.intent) {
                            Router.pushIntent(Router.s_lastNavigateInfo.intent);
                        }
                        Router.treatUrlHistory();
                        $.mobile.changePage(Framework.toUrl(path), {
                            showLoadMsg: false,
                            allowSamePageTransition: true,
                            transition: Router.s_lastNavigateInfo.transition || "none",
                            reverse: Router.s_lastNavigateInfo.reverse,
                            fromHashChange: !Router.s_lastNavigateInfo.positiveNavigate,
                            changeHash: !Router.s_lastNavigateInfo.noHashChange
                        });
                    }).fail(function() {
                        console.error("before route change call, failed.");
                        Router.s_lastNavigateInfo = {};
                    });
                };
                Router.decideDirection = function(path) {
                    Router.s_lastNavigateInfo.transition = Router.getJqmHistory().getActive().transition;
                    var url = $.mobile.path.convertUrlToDataUrl(Framework.toUrl(path));
                    Router.getJqmHistory().direct({
                        url: url,
                        present: function(newPage, direction) {
                            switch (direction) {
                              case "back":
                                Router.s_lastNavigateInfo.reverse = true;
                                break;

                              case "forward":
                                Router.s_lastNavigateInfo.transition = newPage.transition;
                                break;

                              default:
                                console.log("unknown direction: " + direction);
                                break;
                            }
                        },
                        missing: function() {
                            if (1 === Router.getJqmHistory().activeIndex) {
                                Router.getJqmHistory().previousIndex = 1;
                                Router.getJqmHistory().activeIndex = 0;
                                Router.s_lastNavigateInfo.reverse = true;
                            } else if (0 !== Router.getJqmHistory().activeIndex) {
                                console.log("unknown direction.");
                            }
                        }
                    });
                };
                Router.detectAdditionalBackDistance = function() {
                    var stack = Router.getJqmHistory().stack;
                    var historyActiveIndex = Router.getJqmHistory().activeIndex;
                    var previousIndex = Router.getJqmHistory().previousIndex;
                    var i, backDst, distance, fragment, context, jqmDataUrl;
                    if (!Router.s_lastNavigateInfo.reverse || null == previousIndex) {
                        return 0;
                    }
                    backDst = stack[previousIndex][Router.BACK_DESTINATION_URL];
                    if (null == backDst) {
                        return 0;
                    }
                    fragment = Backbone.history.getFragment(backDst);
                    if ("" === fragment) {
                        return historyActiveIndex;
                    }
                    context = _.find(Router.s_rootContexts, function(context) {
                        return context.regexp.test(fragment);
                    });
                    if (null == context) {
                        console.warn("back destination is not registered. back-dst: " + backDst);
                        return 0;
                    }
                    jqmDataUrl = Router.pathToJqmDataUrl(context.page);
                    for (i = historyActiveIndex, distance = 0; 0 <= i; i--, distance++) {
                        if (jqmDataUrl === stack[i].pageUrl) {
                            break;
                        }
                    }
                    if (i < 0) {
                        console.warn("back destination does not exist in history. back-dst: " + backDst);
                        return 0;
                    }
                    return distance;
                };
                Router.beginSubFlow = function(subFlowParam) {
                    var active = Router.getJqmHistory().getActive();
                    var param = subFlowParam;
                    if (subFlowParam.destBase) {
                        (function() {
                            var distance = 0;
                            var fragment = Backbone.history.getFragment(subFlowParam.destBase);
                            var context = _.find(Router.s_rootContexts, function(context) {
                                return context.regexp.test(fragment);
                            });
                            if (null == context) {
                                console.warn("base destination is not registered. destBase: " + subFlowParam.destBase);
                                return;
                            }
                            var jqmDataUrl = Router.pathToJqmDataUrl(context.page);
                            var stack = Router.getJqmHistory().stack;
                            for (var i = Router.getJqmHistory().activeIndex; 0 <= i; i--, distance++) {
                                if (jqmDataUrl === stack[i].pageUrl) {
                                    param.additionalDistance = distance;
                                    break;
                                }
                            }
                        })();
                    } else {
                        param.destBase = location.hash;
                        param.additionalDistance = 0;
                    }
                    active[Router.SUBFLOW_PARAM] = param;
                };
                Router.endSubFlow = function(options) {
                    var navOptions = $.extend(true, {}, options);
                    var baseInfo = Router.detectSubFlowBaseInfo();
                    var param = $.extend({}, baseInfo.subFlowParam, navOptions.subFlow);
                    var distance = baseInfo.distance;
                    var stack = baseInfo.stack;
                    var NAVIGATE_INTERVAL = 100;
                    var MAX_RETRY_COUNT = 10;
                    var retry = 0;
                    var _navigate = function() {
                        if (MAX_RETRY_COUNT <= retry) {
                            console.error("reached navigate max retry count.");
                            Router.s_lastNavigateInfo = {};
                        } else if (param.destBase !== location.hash) {
                            retry++;
                            setTimeout(_navigate, NAVIGATE_INTERVAL);
                        } else {
                            Router.s_lastNavigateInfo.inNavigation = false;
                            Router.registerPageStack(param.destStacks, true, navOptions);
                        }
                    };
                    if (stack) {
                        delete stack[Router.SUBFLOW_PARAM];
                        Router.getJqmHistory().activeIndex -= distance;
                        Router.getJqmHistory().clearForward();
                        if (param.destStacks) {
                            Router.stop();
                            history.go(-distance);
                            delete navOptions.subFlow;
                            setTimeout(_navigate, 0);
                        } else {
                            Router.s_lastNavigateInfo.positiveNavigate = false;
                            history.go(-distance);
                        }
                    } else {
                        console.warn("subFlow begin status does not exist in history.");
                        Router.s_lastNavigateInfo = {};
                    }
                };
                Router.detectSubFlowBaseInfo = function() {
                    var stack = Router.getJqmHistory().stack;
                    var historyActiveIndex = Router.getJqmHistory().activeIndex;
                    var i, distance;
                    var param = {};
                    var target;
                    param.additionalDistance = 0;
                    for (i = historyActiveIndex, distance = 0; 0 <= i; i--, distance++) {
                        if (stack[i][Router.SUBFLOW_PARAM]) {
                            target = stack[i];
                            param = stack[i][Router.SUBFLOW_PARAM];
                            break;
                        }
                    }
                    return {
                        stack: target,
                        subFlowParam: param,
                        distance: distance + param.additionalDistance,
                        isCurrent: function() {
                            if (target && 0 === distance) {
                                return true;
                            } else {
                                return false;
                            }
                        }()
                    };
                };
                Router.pathToJqmDataUrl = function(path) {
                    var url = Framework.toUrl(path);
                    var dataUrl = $.mobile.path.convertUrlToDataUrl(url);
                    return dataUrl;
                };
                Router.treatUrlHistory = function() {
                    if (Router.s_lastNavigateInfo.positiveNavigate || history.length < Router.getJqmHistory().stack.length) {
                        Router.getJqmHistory().clearForward();
                    }
                };
                Router.getJqmHistory = function() {
                    return $.mobile.navigate.history;
                };
                Router.s_initOptions = {};
                Router.s_router = null;
                Router.s_rootContexts = {};
                Router.s_lastNavigateInfo = {};
                Router.s_lastClickedTime = null;
                Router.s_lastIntent = {};
                Router.s_loadUrl = null;
                Router.s_back = null;
                Router.DELAY_TIME = 200;
                Router.DATA_BACK_DESTINATION = "data-back-dst";
                Router.DATA_NO_HASH_CHANGE = "data-no-hash-change";
                Router.DATA_NO_VCLICK_HANDLE = "data-no-vclick-handle";
                Router.BACK_DESTINATION_URL = "backDstUrl";
                Router.SUBFLOW_PARAM = "subFlowParam";
                Router.s_defaultInitOptions = {
                    anchorVclick: true
                };
                Router.s_defaultNavigateOptions = {
                    trigger: true,
                    replace: false,
                    intent: null
                };
                return Router;
            }();
            Framework.Router = Router;
        })(Framework = CDP.Framework || (CDP.Framework = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        function waitForDeviceReady() {
            var df = $.Deferred();
            if (!CDP.Framework.Platform.Mobile) {
                setTimeout(function() {
                    df.resolve();
                }, 100);
            } else {
                if (null == CDP.global.cordova || null == CDP.global.cordova.exec) {
                    $(document).one("deviceready", function() {
                        df.resolve();
                    });
                } else {
                    df.resolve();
                }
            }
            return df.promise();
        }
        CDP.waitForDeviceReady = waitForDeviceReady;
        var _defaultBackButtonHandler = null;
        function setBackButtonHandler(handler) {
            var oldHandler = _defaultBackButtonHandler;
            _defaultBackButtonHandler = handler;
            return oldHandler;
        }
        CDP.setBackButtonHandler = setBackButtonHandler;
        (function() {
            waitForDeviceReady().done(function() {
                $(document).on("backbutton", function(event) {
                    if (_defaultBackButtonHandler) {
                        _defaultBackButtonHandler(event);
                    }
                });
            });
        })();
        var Framework;
        (function(Framework) {
            var TAG = "[CDP.Framework] ";
            var _initializedState = {
                done: false,
                calling: false
            };
            var _activePage = null;
            var _orientationListenerHolder = {};
            var _lastOrientation = null;
            function initialize(options) {
                var df = $.Deferred();
                var config = getConfig(options);
                if (_initializedState.calling) {
                    console.warn(TAG + "cdp.framework.jqm is already initialized, ignored.");
                    return df.resolve();
                }
                _initializedState.calling = true;
                CDP.initialize({
                    success: function() {
                        if (config.applyPatch) {
                            Framework.Patch.apply();
                        }
                        config.jquery();
                        if (!isAMD()) {
                            console.warn(TAG + "need to init for 'jquery.mobile', 'i18Next' and 'CDP.Framework.Router' manually, because cdp.framework depends on require.js.");
                            _initializedState.done = true;
                            return df.resolve();
                        }
                        $(document).on("mobileinit", function() {
                            config.jquerymobile();
                            i18nextInitialize(config).always(function(info) {
                                $(document).one("pagebeforechange", function(event, data) {
                                    data.options.showLoadMsg = false;
                                }).on("pagebeforecreate", function(event) {
                                    $(event.target).localize();
                                });
                                if (Framework.Router.initialize({
                                    anchorVclick: config.anchorVclick
                                })) {
                                    _initializedState.done = true;
                                    df.resolve();
                                } else {
                                    console.error(TAG + "error. CDP.Framework.Router.initialize() failed.");
                                    _initializedState.calling = false;
                                    df.reject();
                                }
                            });
                        });
                        require([ "jquery.mobile" ]);
                    },
                    fail: function(error) {
                        console.error(TAG + "error. CDP.initialize() failed.");
                        _initializedState.calling = false;
                        df.reject();
                    }
                });
                return df.promise();
            }
            Framework.initialize = initialize;
            function isInitialized() {
                return _initializedState.done;
            }
            Framework.isInitialized = isInitialized;
            function registerOrientationChangedListener(key, listener) {
                _orientationListenerHolder[key] = listener;
            }
            Framework.registerOrientationChangedListener = registerOrientationChangedListener;
            function unregisterOrientationChangedListener(key) {
                delete _orientationListenerHolder[key];
            }
            Framework.unregisterOrientationChangedListener = unregisterOrientationChangedListener;
            function setupEventHandlers() {
                (function() {
                    var oldBackButtonHandler = CDP.setBackButtonHandler(null);
                    var baseBackButtonHandler = function(event) {
                        if (_activePage && _activePage.onHardwareBackButton(event)) {
                            return;
                        } else {
                            oldBackButtonHandler(event);
                        }
                    };
                    CDP.setBackButtonHandler(baseBackButtonHandler);
                })();
                (function() {
                    var oldRouteChangeHandler = CDP.Framework.setBeforeRouteChangeHandler(null);
                    var baseRouteChangeHandler = function() {
                        if (_activePage) {
                            return _activePage.onBeforeRouteChange();
                        } else {
                            return oldRouteChangeHandler();
                        }
                    };
                    CDP.Framework.setBeforeRouteChangeHandler(baseRouteChangeHandler);
                })();
            }
            Framework.setupEventHandlers = setupEventHandlers;
            function setActivePage(page) {
                _activePage = page;
                if (_activePage) {
                    _lastOrientation = Framework.getOrientation();
                }
            }
            Framework.setActivePage = setActivePage;
            function getDefaultClickEvent() {
                return Framework.Patch.s_vclickEvent;
            }
            Framework.getDefaultClickEvent = getDefaultClickEvent;
            function getConfig(options) {
                var defConfig = {
                    jquery: function() {
                        $.support.cors = true;
                        $.ajaxSetup({
                            cache: false
                        });
                    },
                    jquerymobile: function() {
                        $.mobile.allowCrossDomainPages = true;
                        $.mobile.defaultPageTransition = "none";
                        $.mobile.hashListeningEnabled = false;
                        $.mobile.pushStateEnabled = false;
                    },
                    i18next: {},
                    applyPatch: true,
                    anchorVclick: true
                };
                return $.extend({}, defConfig, CDP.global.Config, options);
            }
            function isAMD() {
                return typeof define === "function" && define.amd;
            }
            function getLocaleFallbackResource(path) {
                var json;
                $.ajax({
                    url: Framework.toUrl(path),
                    method: "GET",
                    async: false,
                    dataType: "json",
                    success: function(data) {
                        json = data;
                    },
                    error: function(data, status) {
                        console.log(TAG + "ajax request failed. status: " + status);
                    }
                });
                return json;
            }
            function i18nextInitialize(config) {
                var df = $.Deferred();
                var i18nSettings = config.i18next;
                var modulePath = function(path) {
                    if (path) {
                        return path.substr(-1) !== "/" ? path + "/" : path;
                    } else {
                        return "";
                    }
                }(i18nSettings.modulePath);
                var i18nOptions = function(resources) {
                    if (resources) {
                        for (var lng in resources) {
                            if (resources.hasOwnProperty(lng)) {
                                for (var ns in resources[lng]) {
                                    if (resources[lng].hasOwnProperty(ns)) {
                                        resources[lng][ns] = getLocaleFallbackResource(resources[lng][ns]);
                                    }
                                }
                            }
                        }
                        i18nSettings.options.resources = resources;
                        return i18nSettings.options;
                    } else {
                        return i18nSettings.options;
                    }
                }(i18nSettings.fallbackResources);
                if (modulePath) {
                    require.config({
                        paths: {
                            i18next: modulePath + "i18next",
                            i18nextXHRBackend: modulePath + "i18nextXHRBackend",
                            i18nextLocalStorageCache: modulePath + "i18nextLocalStorageCache",
                            i18nextSprintfPostProcessor: modulePath + "i18nextSprintfPostProcessor",
                            i18nextBrowserLanguageDetector: modulePath + "i18nextBrowserLanguageDetector",
                            jqueryI18next: modulePath + "jquery-i18next"
                        }
                    });
                }
                require([ "jqueryI18next" ], function($18Next) {
                    require([ "i18next", "i18nextXHRBackend", "i18nextLocalStorageCache", "i18nextSprintfPostProcessor", "i18nextBrowserLanguageDetector" ], function(i18next, Backend, Cache, PostProcessor, LanguageDetector) {
                        i18next.use(Backend).use(Cache).use(PostProcessor).use(LanguageDetector).init(i18nOptions, function(error, t) {
                            $18Next.init(i18next, $, {
                                tName: "t",
                                i18nName: "i18n",
                                handleName: "localize",
                                selectorAttr: "data-i18n",
                                targetAttr: "i18n-target",
                                optionsAttr: "i18n-options",
                                useOptionsAttr: false,
                                parseDefaultValueFromContent: true
                            });
                            df.resolve();
                        });
                    });
                });
                return df.promise();
            }
            $(window).on("resize", function(event) {
                var newOrientation = Framework.getOrientation();
                if (_lastOrientation !== newOrientation) {
                    for (var key in _orientationListenerHolder) {
                        _orientationListenerHolder[key].onOrientationChanged(newOrientation);
                    }
                    if (_activePage) {
                        _activePage.onOrientationChanged(newOrientation);
                    }
                    _lastOrientation = newOrientation;
                }
            });
        })(Framework = CDP.Framework || (CDP.Framework = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var Framework;
        (function(Framework) {
            var Page = function() {
                function Page(_url, _id, options) {
                    this._url = _url;
                    this._id = _id;
                    this._owner = null;
                    this._$page = null;
                    this._$header = null;
                    this._$footer = null;
                    this._intent = null;
                    this._initialized = false;
                    this.setup(options);
                }
                Object.defineProperty(Page.prototype, "active", {
                    get: function() {
                        return !!this._$page && this._$page.hasClass("ui-page-active");
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Page.prototype, "url", {
                    get: function() {
                        return this._url;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Page.prototype, "id", {
                    get: function() {
                        return this._id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Page.prototype, "$page", {
                    get: function() {
                        return this._$page;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Page.prototype, "$header", {
                    get: function() {
                        return this._$header;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Page.prototype, "$footer", {
                    get: function() {
                        return this._$footer;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Page.prototype, "intent", {
                    get: function() {
                        return this._intent;
                    },
                    set: function(newIntent) {
                        this._intent = newIntent;
                        this._intent._update = true;
                    },
                    enumerable: true,
                    configurable: true
                });
                Page.prototype.onOrientationChanged = function(newOrientation) {
                    if (this._owner) {
                        this._owner.onOrientationChanged(newOrientation);
                    }
                };
                Page.prototype.onHardwareBackButton = function(event) {
                    if (this._owner) {
                        return this._owner.onHardwareBackButton(event);
                    } else {
                        return false;
                    }
                };
                Page.prototype.onBeforeRouteChange = function() {
                    if (this._owner) {
                        return this._owner.onBeforeRouteChange();
                    } else {
                        return $.Deferred().resolve().promise();
                    }
                };
                Page.prototype.onCommand = function(event, kind) {
                    if (this._owner) {
                        this._owner.onCommand(event, kind);
                    }
                };
                Page.prototype.onInitialize = function(event) {
                    if (this._owner) {
                        this._owner.onInitialize(event);
                    }
                };
                Page.prototype.onPageBeforeCreate = function(event) {
                    if (this._owner) {
                        this._owner.onPageBeforeCreate(event);
                    }
                };
                Page.prototype.onPageInit = function(event) {
                    if (this._owner) {
                        this._owner.onPageInit(event);
                    }
                };
                Page.prototype.onPageBeforeShow = function(event, data) {
                    if (this._owner) {
                        this._owner.onPageBeforeShow(event, data);
                    }
                };
                Page.prototype.onPageShow = function(event, data) {
                    if (this._owner) {
                        this._owner.onPageShow(event, data);
                    }
                };
                Page.prototype.onPageBeforeHide = function(event, data) {
                    if (this._owner) {
                        this._owner.onPageBeforeHide(event, data);
                    }
                };
                Page.prototype.onPageHide = function(event, data) {
                    if (this._owner) {
                        this._owner.onPageHide(event, data);
                    }
                };
                Page.prototype.onPageRemove = function(event) {
                    if (this._owner) {
                        this._owner.onPageRemove(event);
                    }
                };
                Page.prototype.setup = function(options) {
                    var _this = this;
                    this._initialized = false;
                    this._intent = null;
                    var selector = "#" + this._id;
                    $(document).off("pagebeforecreate", selector).on("pagebeforecreate", selector, function(event) {
                        _this._$page = $(selector).first();
                        _this._$header = _this._$page.children(":jqmData(role=header)").first();
                        _this._$footer = _this._$page.children(":jqmData(role=footer)").first();
                        _this._$page.on("pagecreate", function(event) {
                            _this.pageInit(event);
                        }).on("pagebeforeshow", function(event, data) {
                            _this.pageBeforeShow(event, data);
                        }).on("pageshow", function(event, data) {
                            _this.pageShow(event, data);
                        }).on("pagebeforehide", function(event, data) {
                            _this.pageBeforeHide(event, data);
                        }).on("pagehide", function(event, data) {
                            _this.pageHide(event, data);
                        }).on("pageremove", function(event) {
                            _this.pageRemove(event);
                        });
                        _this.pageBeforeCreate(event);
                    });
                    options = options || {};
                    this._owner = options.owner;
                    this._keepIntent = options.keepIntent;
                    if (null == options.route) {
                        options.route = this._id;
                    }
                    Framework.Router.register(options.route, this._url, options.top, options.callback);
                };
                Page.prototype.pageBeforeCreate = function(event) {
                    this.onPageBeforeCreate(event);
                };
                Page.prototype.pageInit = function(event) {
                    if (!this._initialized) {
                        this.onInitialize(event);
                        this._initialized = true;
                    }
                    this.onPageInit(event);
                };
                Page.prototype.pageBeforeShow = function(event, data) {
                    Framework.setActivePage(this);
                    this._intent = Framework.Router.popIntent();
                    this.onPageBeforeShow(event, data);
                };
                Page.prototype.pageShow = function(event, data) {
                    this.onPageShow(event, data);
                };
                Page.prototype.pageBeforeHide = function(event, data) {
                    this.onPageBeforeHide(event, data);
                    if (null != this._intent && (this._keepIntent || this._intent._update)) {
                        delete this._intent._update;
                        Framework.Router.pushIntent(this._intent);
                    } else if (Framework.Router.fromHashChanged() && Framework.Router.isInSubFlow()) {
                        Framework.Router.pushIntent(this._intent);
                    }
                    this._intent = null;
                    Framework.setActivePage(null);
                };
                Page.prototype.pageHide = function(event, data) {
                    this.onPageHide(event, data);
                };
                Page.prototype.pageRemove = function(event) {
                    this.onPageRemove(event);
                    this._$page.off();
                    this._$page = null;
                    this._$header.off();
                    this._$header = null;
                    this._$footer.off();
                    this._$footer = null;
                };
                return Page;
            }();
            Framework.Page = Page;
        })(Framework = CDP.Framework || (CDP.Framework = {}));
    })(CDP || (CDP = {}));
    return CDP.Framework;
});

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define("cdp.tools", [ "jquery", "underscore" ], function($, _) {
            return factory(root.CDP || (root.CDP = {}), $, _);
        });
    } else if (typeof exports === "object") {
        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"), require("underscore"));
    } else {
        factory(root.CDP || (root.CDP = {}), root.jQuery || root.$, root._);
    }
})((this || 0).self || global, function(CDP, $, _) {
    CDP.Tools = CDP.Tools || {};
    var CDP;
    (function(CDP) {
        var Tools;
        (function(Tools) {
            Tools.global = Tools.global || window;
        })(Tools = CDP.Tools || (CDP.Tools = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var Tools;
        (function(Tools) {
            var TAG = "[CDP.Tools.Blob] ";
            var Blob;
            (function(Blob) {
                function getBlobBuilder() {
                    return Tools.global.BlobBuilder || Tools.global.WebKitBlobBuilder || Tools.global.MozBlobBuilder || Tools.global.MSBlobBuilder;
                }
                function arrayBufferToBlob(buf, mimeType) {
                    var blob = null;
                    var blobBuilderObject = getBlobBuilder();
                    if (blobBuilderObject != null) {
                        var blobBuilder = new blobBuilderObject();
                        blobBuilder.append(buf);
                        blob = blobBuilder.getBlob(mimeType);
                    } else {
                        blob = new Tools.global.Blob([ buf ], {
                            type: mimeType
                        });
                    }
                    return blob;
                }
                Blob.arrayBufferToBlob = arrayBufferToBlob;
                function base64ToBlob(base64, mimeType) {
                    var blob = null;
                    var blobBuilderObject = getBlobBuilder();
                    if (blobBuilderObject != null) {
                        var blobBuilder = new blobBuilderObject();
                        blobBuilder.append(base64ToArrayBuffer(base64));
                        blob = blobBuilder.getBlob(mimeType);
                    } else {
                        blob = new Tools.global.Blob([ base64ToArrayBuffer(base64) ], {
                            type: mimeType
                        });
                    }
                    return blob;
                }
                Blob.base64ToBlob = base64ToBlob;
                function base64ToArrayBuffer(base64) {
                    var bytes = window.atob(base64);
                    var arrayBuffer = new ArrayBuffer(bytes.length);
                    var data = new Uint8Array(arrayBuffer);
                    for (var i = 0, len = bytes.length; i < len; ++i) {
                        data[i] = bytes.charCodeAt(i);
                    }
                    return arrayBuffer;
                }
                Blob.base64ToArrayBuffer = base64ToArrayBuffer;
                function base64ToUint8Array(encoded) {
                    var bytes = window.atob(encoded);
                    var data = new Uint8Array(bytes.length);
                    for (var i = 0, len = bytes.length; i < len; ++i) {
                        data[i] = bytes.charCodeAt(i);
                    }
                    return data;
                }
                Blob.base64ToUint8Array = base64ToUint8Array;
                function arrayBufferToBase64(arrayBuffer) {
                    var bytes = new Uint8Array(arrayBuffer);
                    return this.uint8ArrayToBase64(bytes);
                }
                Blob.arrayBufferToBase64 = arrayBufferToBase64;
                function uint8ArrayToBase64(bytes) {
                    var data = "";
                    for (var i = 0, len = bytes.byteLength; i < len; ++i) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    return window.btoa(data);
                }
                Blob.uint8ArrayToBase64 = uint8ArrayToBase64;
                Blob.URL = function() {
                    return Tools.global.URL || Tools.global.webkitURL;
                }();
            })(Blob = Tools.Blob || (Tools.Blob = {}));
        })(Tools = CDP.Tools || (CDP.Tools = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var Tools;
        (function(Tools) {
            var TAG = "[CDP.Tools.DateTime] ";
            var DateTime = function() {
                function DateTime() {}
                DateTime.computeDate = function(base, addDays) {
                    var dt = new Date(base.getTime());
                    var baseSec = dt.getTime();
                    var addSec = addDays * 864e5;
                    var targetSec = baseSec + addSec;
                    dt.setTime(targetSec);
                    return dt;
                };
                DateTime.convertISOStringToDate = function(dateString) {
                    var dateTime = dateString.split("T"), dateArray = dateTime[0].split("-"), timeArray, secArray, dateObject;
                    if (dateTime[1]) {
                        timeArray = dateTime[1].split(":");
                        secArray = timeArray[2].split(".");
                    }
                    if (timeArray) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], secArray[0], secArray[1]);
                    } else {
                        if (dateArray[2]) {
                            dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                        } else if (dateArray[1]) {
                            dateObject = new Date(dateArray[0], dateArray[1] - 1);
                        } else {
                            dateObject = new Date(dateArray[0]);
                        }
                    }
                    return dateObject;
                };
                DateTime.convertDateToISOString = function(date, target) {
                    if (target === void 0) {
                        target = "msec";
                    }
                    var isoDateString;
                    switch (target) {
                      case "year":
                      case "month":
                      case "date":
                      case "hour":
                      case "min":
                      case "sec":
                      case "msec":
                        break;

                      default:
                        console.warn(TAG + "unknown target: " + target);
                        target = "msec";
                    }
                    isoDateString = date.getFullYear();
                    if ("year" === target) {
                        return isoDateString;
                    }
                    isoDateString += "-" + DateTime.numberToDoubleDigitsString(date.getMonth() + 1);
                    if ("month" === target) {
                        return isoDateString;
                    }
                    isoDateString += "-" + DateTime.numberToDoubleDigitsString(date.getDate());
                    if ("date" === target) {
                        return isoDateString;
                    }
                    isoDateString += "T" + DateTime.numberToDoubleDigitsString(date.getHours());
                    if ("hour" === target) {
                        return isoDateString;
                    }
                    isoDateString += ":" + DateTime.numberToDoubleDigitsString(date.getMinutes());
                    if ("min" === target) {
                        return isoDateString;
                    }
                    isoDateString += ":" + DateTime.numberToDoubleDigitsString(date.getSeconds());
                    if ("sec" === target) {
                        return isoDateString;
                    }
                    isoDateString += "." + String((date.getMilliseconds() / 1e3).toFixed(3)).slice(2, 5);
                    return isoDateString;
                };
                DateTime.convertFileSystemStringToDate = function(dateString) {
                    var dateTime = dateString.split("T"), dateArray = dateTime[0].split("_"), timeArray, dateObject;
                    if (dateTime[1]) {
                        timeArray = dateTime[1].split("_");
                    }
                    if (timeArray) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], timeArray[2], timeArray[3]);
                    } else {
                        if (dateArray[2]) {
                            dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                        } else if (dateArray[1]) {
                            dateObject = new Date(dateArray[0], dateArray[1] - 1);
                        } else {
                            dateObject = new Date(dateArray[0]);
                        }
                    }
                    return dateObject;
                };
                DateTime.convertDateToFileSystemString = function(date, target) {
                    if (target === void 0) {
                        target = "msec";
                    }
                    var fileSystemString;
                    switch (target) {
                      case "year":
                      case "month":
                      case "date":
                      case "hour":
                      case "min":
                      case "sec":
                      case "msec":
                        break;

                      default:
                        console.warn(TAG + "unknown target: " + target);
                        target = "msec";
                    }
                    fileSystemString = date.getFullYear();
                    if ("year" === target) {
                        return fileSystemString;
                    }
                    fileSystemString += "_" + DateTime.numberToDoubleDigitsString(date.getMonth() + 1);
                    if ("month" === target) {
                        return fileSystemString;
                    }
                    fileSystemString += "_" + DateTime.numberToDoubleDigitsString(date.getDate());
                    if ("date" === target) {
                        return fileSystemString;
                    }
                    fileSystemString += "T" + DateTime.numberToDoubleDigitsString(date.getHours());
                    if ("hour" === target) {
                        return fileSystemString;
                    }
                    fileSystemString += "_" + DateTime.numberToDoubleDigitsString(date.getMinutes());
                    if ("min" === target) {
                        return fileSystemString;
                    }
                    fileSystemString += "_" + DateTime.numberToDoubleDigitsString(date.getSeconds());
                    if ("sec" === target) {
                        return fileSystemString;
                    }
                    fileSystemString += "_" + String((date.getMilliseconds() / 1e3).toFixed(3)).slice(2, 5);
                    return fileSystemString;
                };
                DateTime.numberToDoubleDigitsString = function(num) {
                    if (num < 0 || num > 100) {
                        return null;
                    }
                    if (num < 10) {
                        return "0" + num;
                    }
                    return "" + num;
                };
                return DateTime;
            }();
            Tools.DateTime = DateTime;
        })(Tools = CDP.Tools || (CDP.Tools = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var Tools;
        (function(Tools) {
            var TAG = "[CDP.Tools.Functions] ";
            function abs(x) {
                return x >= 0 ? x : -x;
            }
            Tools.abs = abs;
            function max(lhs, rhs) {
                return lhs >= rhs ? lhs : rhs;
            }
            Tools.max = max;
            function min(lhs, rhs) {
                return lhs <= rhs ? lhs : rhs;
            }
            Tools.min = min;
            function await(condition, msec) {
                if (msec === void 0) {
                    msec = 0;
                }
                var df = $.Deferred();
                var proc = function() {
                    if (!condition()) {
                        setTimeout(proc, msec);
                    } else {
                        df.resolve();
                    }
                };
                setTimeout(proc, msec);
                return df.promise();
            }
            Tools.await = await;
            function toZeroPadding(no, limit) {
                var signed = "";
                no = Number(no);
                if (isNaN(no) || isNaN(limit) || limit <= 0) {
                    return null;
                }
                if (no < 0) {
                    no = Tools.abs(no);
                    signed = "-";
                }
                return signed + (Array(limit).join("0") + no).slice(-limit);
            }
            Tools.toZeroPadding = toZeroPadding;
            function inherit(subClass, superClass) {
                var _prototype = subClass.prototype;
                function _inherit() {
                    this.constructor = subClass;
                }
                _inherit.prototype = superClass.prototype;
                subClass.prototype = new _inherit();
                $.extend(subClass.prototype, _prototype);
            }
            Tools.inherit = inherit;
            function mixin(derived) {
                var bases = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    bases[_i - 1] = arguments[_i];
                }
                bases.forEach(function(base) {
                    Object.getOwnPropertyNames(base.prototype).forEach(function(name) {
                        derived.prototype[name] = base.prototype[name];
                    });
                });
            }
            Tools.mixin = mixin;
            function extend(protoProps, staticProps) {
                var parent = this;
                var child;
                if (protoProps && protoProps.hasOwnProperty("constructor")) {
                    child = protoProps.constructor;
                } else {
                    child = function() {
                        return parent.apply(this, arguments);
                    };
                }
                $.extend(child, parent, staticProps);
                var Surrogate = function() {
                    this.constructor = child;
                };
                Surrogate.prototype = parent.prototype;
                child.prototype = new Surrogate();
                if (protoProps) {
                    $.extend(child.prototype, protoProps);
                }
                child.__super__ = parent.prototype;
                return child;
            }
            Tools.extend = extend;
            function getDevicePixcelRatio() {
                var mediaQuery;
                var is_firefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
                if (null != window.devicePixelRatio && !is_firefox) {
                    return window.devicePixelRatio;
                } else if (window.matchMedia) {
                    mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),                    (min--moz-device-pixel-ratio: 1.5),                    (-o-min-device-pixel-ratio: 3/2),                    (min-resolution: 1.5dppx)";
                    if (window.matchMedia(mediaQuery).matches) {
                        return 1.5;
                    }
                    mediaQuery = "(-webkit-min-device-pixel-ratio: 2),                    (min--moz-device-pixel-ratio: 2),                    (-o-min-device-pixel-ratio: 2/1),                    (min-resolution: 2dppx)";
                    if (window.matchMedia(mediaQuery).matches) {
                        return 2;
                    }
                    mediaQuery = "(-webkit-min-device-pixel-ratio: 0.75),                    (min--moz-device-pixel-ratio: 0.75),                    (-o-min-device-pixel-ratio: 3/4),                    (min-resolution: 0.75dppx)";
                    if (window.matchMedia(mediaQuery).matches) {
                        return .7;
                    }
                } else {
                    return 1;
                }
            }
            Tools.getDevicePixcelRatio = getDevicePixcelRatio;
            function doWork(worker, msg) {
                var df = $.Deferred();
                if (!worker) {
                    return df.reject("null argument");
                }
                var wk;
                switch (typeof worker) {
                  case "object":
                    wk = worker;
                    break;

                  case "string":
                    try {
                        wk = new Worker(worker);
                    } catch (ex) {
                        console.error(TAG + ex);
                        return df.reject(ex);
                    }
                    break;

                  default:
                    return df.reject("invalid type argument");
                }
                wk.onerror = function(error) {
                    return df.reject(error);
                };
                wk.onmessage = function(event) {
                    return df.resolve(event.data);
                };
                wk.postMessage(msg);
                return df.promise();
            }
            Tools.doWork = doWork;
        })(Tools = CDP.Tools || (CDP.Tools = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var Tools;
        (function(Tools) {
            var TAG = "[CDP.Tools.Template] ";
            var Template = function() {
                function Template() {}
                Template.getTemplateElement = function(key, src) {
                    var mapElement = Template.getElementMap();
                    var $element = mapElement[key];
                    try {
                        if (!$element) {
                            if (src) {
                                var html = Template.findHtmlFromSource(src);
                                $element = $(html).find(key);
                            } else {
                                $element = $(key);
                            }
                            if ($element <= 0) {
                                throw "invalid [key, src] = [" + key + ", " + src + "]";
                            }
                            mapElement[key] = $element;
                        }
                    } catch (exception) {
                        console.error(TAG + exception);
                        return null;
                    }
                    return $element;
                };
                Template.empty = function() {
                    Template._mapElement = null;
                    Template._mapSource = null;
                };
                Template.getJST = function(key, src) {
                    var $element = this.getTemplateElement(key, src);
                    var template = null;
                    var jst;
                    if (null != Tools.global.Hogan) {
                        template = Hogan.compile($element.text());
                        jst = function(data) {
                            return template.render(data);
                        };
                    } else {
                        template = _.template($element.html());
                        jst = function(data) {
                            return template(data).replace(/\n|\t/g, "");
                        };
                    }
                    return jst;
                };
                Template.getElementMap = function() {
                    if (!Template._mapElement) {
                        Template._mapElement = {};
                    }
                    return Template._mapElement;
                };
                Template.getSourceMap = function() {
                    if (!Template._mapSource) {
                        Template._mapSource = {};
                    }
                    return Template._mapSource;
                };
                Template.findHtmlFromSource = function(src) {
                    var mapSource = Template.getSourceMap();
                    var html = mapSource[src];
                    if (!html) {
                        $.ajax({
                            url: src,
                            method: "GET",
                            async: false,
                            dataType: "html",
                            success: function(data) {
                                html = data;
                            },
                            error: function(data, status) {
                                throw "ajax request failed. status: " + status;
                            }
                        });
                        mapSource[src] = html;
                    }
                    return html;
                };
                return Template;
            }();
            Tools.Template = Template;
        })(Tools = CDP.Tools || (CDP.Tools = {}));
    })(CDP || (CDP = {}));
    return CDP.Tools;
});

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define("cdp.ui.listview", [ "jquery", "underscore", "backbone" ], function($, _, Backbone) {
            return factory(root.CDP || (root.CDP = {}), $, _, Backbone);
        });
    } else if (typeof exports === "object") {
        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"), require("underscore"), require("backbone"));
    } else {
        factory(root.CDP || (root.CDP = {}), root.$, root._, root.Backbone);
    }
})((this || 0).self || global, function(CDP, $, _, Backbone) {
    CDP.UI = CDP.UI || {};
    var __extends = this && this.__extends || function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var ListViewGlobalConfig;
            (function(ListViewGlobalConfig) {
                ListViewGlobalConfig.WRAPPER_CLASS = "listview-wrapper";
                ListViewGlobalConfig.WRAPPER_SELECTOR = "." + ListViewGlobalConfig.WRAPPER_CLASS;
                ListViewGlobalConfig.SCROLL_MAP_CLASS = "listview-scroll-map";
                ListViewGlobalConfig.SCROLL_MAP_SELECTOR = "." + ListViewGlobalConfig.SCROLL_MAP_CLASS;
                ListViewGlobalConfig.INACTIVE_CLASS = "inactive";
                ListViewGlobalConfig.INACTIVE_CLASS_SELECTOR = "." + ListViewGlobalConfig.INACTIVE_CLASS;
                ListViewGlobalConfig.RECYCLE_CLASS = "listview-recycle";
                ListViewGlobalConfig.RECYCLE_CLASS_SELECTOR = "." + ListViewGlobalConfig.RECYCLE_CLASS;
                ListViewGlobalConfig.LISTITEM_BASE_CLASS = "listview-item-base";
                ListViewGlobalConfig.LISTITEM_BASE_CLASS_SELECTOR = "." + ListViewGlobalConfig.LISTITEM_BASE_CLASS;
                ListViewGlobalConfig.DATA_PAGE_INDEX = "data-page-index";
                ListViewGlobalConfig.DATA_CONTAINER_INDEX = "data-container-index";
            })(ListViewGlobalConfig = UI.ListViewGlobalConfig || (UI.ListViewGlobalConfig = {}));
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var _Config = CDP.UI.ListViewGlobalConfig;
            var _ToolCSS = CDP.UI._ListViewUtils;
            var TAG = "[CDP.UI.LineProfile] ";
            var LineProfile = function() {
                function LineProfile(_owner, _height, _initializer, _info) {
                    this._owner = _owner;
                    this._height = _height;
                    this._initializer = _initializer;
                    this._info = _info;
                    this._index = null;
                    this._pageIndex = null;
                    this._offset = null;
                    this._$base = null;
                    this._instance = null;
                }
                LineProfile.prototype.activate = function() {
                    if (null == this._instance) {
                        var options = void 0;
                        this._$base = this.prepareBaseElement();
                        options = $.extend({}, {
                            el: this._$base,
                            owner: this._owner,
                            lineProfile: this
                        }, this._info);
                        this._instance = new this._initializer(options);
                        if ("none" === this._$base.css("display")) {
                            this._$base.css("display", "block");
                        }
                    }
                    this.updatePageIndex(this._$base);
                    if ("visible" !== this._$base.css("visibility")) {
                        this._$base.css("visibility", "visible");
                    }
                };
                LineProfile.prototype.hide = function() {
                    if (null == this._instance) {
                        this.activate();
                    }
                    if ("hidden" !== this._$base.css("visibility")) {
                        this._$base.css("visibility", "hidden");
                    }
                };
                LineProfile.prototype.inactivate = function() {
                    if (null != this._instance) {
                        if ("visible" !== this._$base.css("visibility")) {
                            this._$base.css("visibility", "visible");
                        }
                        this._instance.remove();
                        this._instance = null;
                        this._$base.addClass(_Config.RECYCLE_CLASS);
                        this._$base.css("display", "none");
                        this._$base = null;
                    }
                };
                LineProfile.prototype.refresh = function() {
                    if (null != this._instance) {
                        this._instance.render();
                    }
                };
                LineProfile.prototype.isActive = function() {
                    return null != this._instance;
                };
                LineProfile.prototype.updateHeight = function(newHeight, options) {
                    var delta = newHeight - this._height;
                    this._height = newHeight;
                    this._owner.updateScrollMapHeight(delta);
                    if (null != options && options.reflectAll) {
                        this._owner.updateProfiles(this._index);
                    }
                };
                LineProfile.prototype.resetDepth = function() {
                    if (null != this._instance) {
                        this._$base.css("z-index", this._owner.getListViewOptions().baseDepth);
                    }
                };
                Object.defineProperty(LineProfile.prototype, "height", {
                    get: function() {
                        return this._height;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LineProfile.prototype, "index", {
                    get: function() {
                        return this._index;
                    },
                    set: function(index) {
                        this._index = index;
                        if (null != this._$base) {
                            this.updateIndex(this._$base);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LineProfile.prototype, "pageIndex", {
                    get: function() {
                        return this._pageIndex;
                    },
                    set: function(index) {
                        this._pageIndex = index;
                        if (null != this._$base) {
                            this.updatePageIndex(this._$base);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LineProfile.prototype, "offset", {
                    get: function() {
                        return this._offset;
                    },
                    set: function(offset) {
                        this._offset = offset;
                        if (null != this._$base) {
                            this.updateOffset(this._$base);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(LineProfile.prototype, "info", {
                    get: function() {
                        return this._info;
                    },
                    enumerable: true,
                    configurable: true
                });
                LineProfile.prototype.prepareBaseElement = function() {
                    var $base;
                    var $map = this._owner.getScrollMapElement();
                    var $recycle = this._owner.findRecycleElements().first();
                    var itemTagName = this._owner.getListViewOptions().itemTagName;
                    if (null != this._$base) {
                        console.warn(TAG + "this._$base is not null.");
                        return this._$base;
                    }
                    if (0 < $recycle.length) {
                        $base = $recycle;
                        $base.removeAttr("z-index");
                        $base.removeClass(_Config.RECYCLE_CLASS);
                    } else {
                        $base = $("<" + itemTagName + " class='" + _Config.LISTITEM_BASE_CLASS + "'></" + itemTagName + ">");
                        $base.css("display", "none");
                        $map.append($base);
                    }
                    if ($base.height() !== this._height) {
                        $base.height(this._height);
                    }
                    this.updateIndex($base);
                    this.updateOffset($base);
                    return $base;
                };
                LineProfile.prototype.updateIndex = function($base) {
                    if ($base.attr(_Config.DATA_CONTAINER_INDEX) !== this._index.toString()) {
                        $base.attr(_Config.DATA_CONTAINER_INDEX, this._index.toString());
                    }
                };
                LineProfile.prototype.updatePageIndex = function($base) {
                    if ($base.attr(_Config.DATA_PAGE_INDEX) !== this._pageIndex.toString()) {
                        $base.attr(_Config.DATA_PAGE_INDEX, this._pageIndex.toString());
                    }
                };
                LineProfile.prototype.updateOffset = function($base) {
                    var transform = {};
                    if (this._owner.getListViewOptions().enableTransformOffset) {
                        if (_ToolCSS.getCssMatrixValue($base, "translateY") !== this._offset) {
                            for (var i = 0; i < _ToolCSS.cssPrefixes.length; i++) {
                                transform[_ToolCSS.cssPrefixes[i] + "transform"] = "translate3d(0px," + this._offset + "px,0px)";
                            }
                            $base.css(transform);
                        }
                    } else {
                        if (parseInt($base.css("top"), 10) !== this._offset) {
                            $base.css("top", this._offset + "px");
                        }
                    }
                };
                return LineProfile;
            }();
            UI.LineProfile = LineProfile;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var TAG = "[CDP.UI.GroupProfile] ";
            var GroupProfile = function() {
                function GroupProfile(_id, _owner) {
                    this._id = _id;
                    this._owner = _owner;
                    this._parent = null;
                    this._children = [];
                    this._expanded = false;
                    this._status = "unregistered";
                    this._mapLines = {};
                }
                GroupProfile.prototype.addItem = function(height, initializer, info, layoutKey) {
                    var line;
                    var options = $.extend({}, {
                        groupProfile: this
                    }, info);
                    if (null == layoutKey) {
                        layoutKey = GroupProfile.LAYOUT_KEY_DEFAULT;
                    }
                    if (null == this._mapLines[layoutKey]) {
                        this._mapLines[layoutKey] = [];
                    }
                    line = new UI.LineProfile(this._owner.core, Math.floor(height), initializer, options);
                    if ("registered" === this._status && (null == this._owner.layoutKey || layoutKey === this._owner.layoutKey)) {
                        this._owner._addLine(line, this.getLastLineIndex() + 1);
                        this._owner.update();
                    }
                    this._mapLines[layoutKey].push(line);
                    return this;
                };
                GroupProfile.prototype.addChildren = function(target) {
                    var _this = this;
                    var children = target instanceof Array ? target : [ target ];
                    children.forEach(function(child) {
                        child.setParent(_this);
                    });
                    this._children = this._children.concat(children);
                    return this;
                };
                GroupProfile.prototype.getParent = function() {
                    return this._parent;
                };
                GroupProfile.prototype.getChildren = function() {
                    return this._children;
                };
                GroupProfile.prototype.hasChildren = function(layoutKey) {
                    if (this._children.length <= 0) {
                        return false;
                    } else if (null != layoutKey) {
                        return this._children[0].hasLayoutKeyOf(layoutKey);
                    } else {
                        return true;
                    }
                };
                GroupProfile.prototype.hasLayoutKeyOf = function(layoutKey) {
                    if (null == layoutKey) {
                        layoutKey = GroupProfile.LAYOUT_KEY_DEFAULT;
                    }
                    return null != this._mapLines[layoutKey];
                };
                GroupProfile.prototype.expand = function() {
                    var _this = this;
                    var lines = [];
                    if (this._lines.length < 0) {
                        console.warn(TAG + "this group has no lines.");
                    } else if (!this.hasChildren()) {
                        console.warn(TAG + "this group has no children.");
                    } else if (!this.isExpanded()) {
                        lines = this.queryOperationTarget("registered");
                        this._expanded = true;
                        if (0 < lines.length) {
                            this._owner.statusScope("expanding", function() {
                                _this._lines.forEach(function(line) {
                                    line.refresh();
                                });
                                _this._owner._addLine(lines, _this.getLastLineIndex() + 1);
                                _this._owner.update();
                            });
                        }
                    }
                };
                GroupProfile.prototype.collapse = function(delay) {
                    var _this = this;
                    var lines = [];
                    if (!this.hasChildren()) {
                        console.warn(TAG + "this group has no children.");
                    } else if (this.isExpanded()) {
                        lines = this.queryOperationTarget("unregistered");
                        this._expanded = false;
                        if (0 < lines.length) {
                            delay = null != delay ? delay : this._owner.core.getListViewOptions().animationDuration;
                            this._owner.statusScope("collapsing", function() {
                                _this._lines.forEach(function(line) {
                                    line.refresh();
                                });
                                _this._owner.removeItem(lines[0].index, lines.length, delay);
                                _this._owner.update();
                            });
                        }
                    }
                };
                GroupProfile.prototype.ensureVisible = function(options) {
                    if (0 < this._lines.length) {
                        this._owner.ensureVisible(this._lines[0].index, options);
                    } else if (null != options.callback) {
                        options.callback();
                    }
                };
                GroupProfile.prototype.toggle = function(delay) {
                    if (this._expanded) {
                        this.collapse(delay);
                    } else {
                        this.expand();
                    }
                };
                GroupProfile.prototype.isExpanded = function() {
                    return this._expanded;
                };
                GroupProfile.prototype.register = function(insertTo) {
                    if (this._parent) {
                        console.error(TAG + "logic error: 'register' method is acceptable only top group.");
                    } else {
                        this._owner._addLine(this.preprocess("registered"), insertTo);
                    }
                    return this;
                };
                GroupProfile.prototype.restore = function() {
                    var lines = [];
                    if (this._parent) {
                        console.error(TAG + "logic error: 'restore' method is acceptable only top group.");
                    } else if (this._lines) {
                        if (this._expanded) {
                            lines = this._lines.concat(this.queryOperationTarget("active"));
                        } else {
                            lines = this._lines;
                        }
                        this._owner._addLine(lines);
                    }
                    return this;
                };
                GroupProfile.prototype.getLastLineIndex = function(withActiveChildren) {
                    var _this = this;
                    if (withActiveChildren === void 0) {
                        withActiveChildren = false;
                    }
                    var lines = function() {
                        var lines;
                        if (withActiveChildren) {
                            lines = _this.queryOperationTarget("active");
                        }
                        if (null == lines || lines.length <= 0) {
                            lines = _this._lines;
                        }
                        return lines;
                    }();
                    if (lines.length <= 0) {
                        console.error(TAG + "logic error: this group is stil not registered.");
                        return null;
                    } else {
                        return lines[lines.length - 1].index;
                    }
                };
                Object.defineProperty(GroupProfile.prototype, "id", {
                    get: function() {
                        return this._id;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GroupProfile.prototype, "status", {
                    get: function() {
                        return this._status;
                    },
                    enumerable: true,
                    configurable: true
                });
                GroupProfile.prototype.setParent = function(parent) {
                    this._parent = parent;
                };
                GroupProfile.prototype.preprocess = function(newStatus) {
                    var lines = [];
                    if (newStatus !== this._status && null != this._lines) {
                        lines = this._lines;
                    }
                    this._status = newStatus;
                    return lines;
                };
                GroupProfile.prototype.queryOperationTarget = function(operation) {
                    var findTargets = function(group) {
                        var lines = [];
                        group._children.forEach(function(group) {
                            switch (operation) {
                              case "registered":
                                lines = lines.concat(group.preprocess(operation));
                                break;

                              case "unregistered":
                                lines = lines.concat(group.preprocess(operation));
                                break;

                              case "active":
                                if (null != group._lines) {
                                    lines = lines.concat(group._lines);
                                }
                                break;

                              default:
                                console.warn(TAG + "unknown operation: " + operation);
                                return;
                            }
                            if (group.isExpanded()) {
                                lines = lines.concat(findTargets(group));
                            }
                        });
                        return lines;
                    };
                    return findTargets(this);
                };
                Object.defineProperty(GroupProfile.prototype, "_lines", {
                    get: function() {
                        var key = this._owner.layoutKey;
                        if (null != key) {
                            return this._mapLines[key];
                        } else {
                            return this._mapLines[GroupProfile.LAYOUT_KEY_DEFAULT];
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
                GroupProfile.LAYOUT_KEY_DEFAULT = "-layout-default";
                return GroupProfile;
            }();
            UI.GroupProfile = GroupProfile;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            UI.global = CDP.global || window;
            function composeViews(base, derives) {
                var _composed = base;
                var _derives = derives instanceof Array ? derives : [ derives ];
                _derives.forEach(function(derive) {
                    var seed = {};
                    _.extendOwn(seed, derive.prototype);
                    delete seed.constructor;
                    _composed = _composed.extend(seed);
                });
                return _composed;
            }
            UI.composeViews = composeViews;
            function deriveViews(derived, bases) {
                var _composed;
                var _bases = bases instanceof Array ? bases : [ bases ];
                if (2 <= _bases.length) {
                    _composed = composeViews(_bases[0], _bases.slice(1));
                } else {
                    _composed = _bases[0];
                }
                derived = composeViews(_composed, derived);
            }
            UI.deriveViews = deriveViews;
            function mixinViews(derived, bases) {
                var _bases = bases instanceof Array ? bases : [ bases ];
                _bases.forEach(function(base) {
                    Object.getOwnPropertyNames(base.prototype).forEach(function(name) {
                        derived.prototype[name] = base.prototype[name];
                    });
                });
            }
            UI.mixinViews = mixinViews;
            var _ListViewUtils;
            (function(_ListViewUtils) {
                _ListViewUtils.cssPrefixes = [ "-webkit-", "-moz-", "-ms-", "-o-", "" ];
                _ListViewUtils.getCssMatrixValue = function(element, type) {
                    var transX = 0;
                    var transY = 0;
                    var scaleX = 0;
                    var scaleY = 0;
                    for (var i = 0; i < _ListViewUtils.cssPrefixes.length; i++) {
                        var matrix = $(element).css(_ListViewUtils.cssPrefixes[i] + "transform");
                        if (matrix) {
                            var is3dMatrix = matrix.indexOf("3d") !== -1 ? true : false;
                            matrix = matrix.replace("matrix3d", "").replace("matrix", "").replace(/[^\d.,-]/g, "");
                            var arr = matrix.split(",");
                            transX = Number(arr[is3dMatrix ? 12 : 4]);
                            transY = Number(arr[is3dMatrix ? 13 : 5]);
                            scaleX = Number(arr[0]);
                            scaleY = Number(arr[is3dMatrix ? 5 : 3]);
                            break;
                        }
                    }
                    switch (type) {
                      case "translateX":
                        return isNaN(transX) ? 0 : transX;

                      case "translateY":
                        return isNaN(transY) ? 0 : transY;

                      case "scaleX":
                        return isNaN(scaleX) ? 1 : scaleX;

                      case "scaleY":
                        return isNaN(scaleY) ? 1 : scaleY;

                      default:
                        return 0;
                    }
                };
                _ListViewUtils.transitionEnd = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";
                _ListViewUtils.setTransformsTransitions = function(element, prop, msec, timingFunction) {
                    var $element = $(element);
                    var transitions = {};
                    var second = msec / 1e3 + "s";
                    var animation = " " + second + " " + timingFunction;
                    var transform = ", transform" + animation;
                    for (var i = 0; i < _ListViewUtils.cssPrefixes.length; i++) {
                        transitions[_ListViewUtils.cssPrefixes[i] + "transition"] = prop + animation + transform;
                    }
                    $element.css(transitions);
                };
                _ListViewUtils.clearTransitions = function(element) {
                    var $element = $(element);
                    $element.off(_ListViewUtils.transitionEnd);
                    var transitions = {};
                    for (var i = 0; i < _ListViewUtils.cssPrefixes.length; i++) {
                        transitions[_ListViewUtils.cssPrefixes[i] + "transition"] = "";
                    }
                    $element.css(transitions);
                };
                _ListViewUtils.abs = function(x) {
                    return x >= 0 ? x : -x;
                };
                _ListViewUtils.max = function(lhs, rhs) {
                    return lhs >= rhs ? lhs : rhs;
                };
            })(_ListViewUtils = UI._ListViewUtils || (UI._ListViewUtils = {}));
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var TAG = "[CDP.UI.StatusManager] ";
            var StatusManager = function() {
                function StatusManager() {
                    this._status = {};
                }
                StatusManager.prototype.statusAddRef = function(status) {
                    if (!this._status[status]) {
                        this._status[status] = 1;
                    } else {
                        this._status[status]++;
                    }
                    return this._status[status];
                };
                StatusManager.prototype.statusRelease = function(status) {
                    var retval;
                    if (!this._status[status]) {
                        retval = 0;
                    } else {
                        this._status[status]--;
                        retval = this._status[status];
                        if (0 === retval) {
                            delete this._status[status];
                        }
                    }
                    return retval;
                };
                StatusManager.prototype.statusScope = function(status, callback) {
                    this.statusAddRef(status);
                    callback();
                    this.statusRelease(status);
                };
                StatusManager.prototype.isStatusIn = function(status) {
                    return !!this._status[status];
                };
                return StatusManager;
            }();
            UI.StatusManager = StatusManager;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var TAG = "[CDP.UI.PageProfile] ";
            var PageProfile = function() {
                function PageProfile() {
                    this._index = 0;
                    this._offset = 0;
                    this._height = 0;
                    this._lines = [];
                    this._status = "inactive";
                }
                PageProfile.prototype.activate = function() {
                    if ("active" !== this._status) {
                        this._lines.forEach(function(line) {
                            line.activate();
                        });
                    }
                    this._status = "active";
                };
                PageProfile.prototype.hide = function() {
                    if ("hidden" !== this._status) {
                        this._lines.forEach(function(line) {
                            line.hide();
                        });
                    }
                    this._status = "hidden";
                };
                PageProfile.prototype.inactivate = function() {
                    if ("inactive" !== this._status) {
                        this._lines.forEach(function(line) {
                            line.inactivate();
                        });
                    }
                    this._status = "inactive";
                };
                PageProfile.prototype.push = function(line) {
                    this._lines.push(line);
                    this._height += line.height;
                };
                PageProfile.prototype.normalize = function() {
                    var enableAll = _.every(this._lines, function(line) {
                        return line.isActive();
                    });
                    if (!enableAll) {
                        this._status = "inactive";
                    }
                };
                PageProfile.prototype.getLineProfile = function(index) {
                    if (0 <= index && index < this._lines.length) {
                        return this._lines[index];
                    } else {
                        return null;
                    }
                };
                PageProfile.prototype.getLineProfileFirst = function() {
                    return this.getLineProfile(0);
                };
                PageProfile.prototype.getLineProfileLast = function() {
                    return this.getLineProfile(this._lines.length - 1);
                };
                Object.defineProperty(PageProfile.prototype, "index", {
                    get: function() {
                        return this._index;
                    },
                    set: function(index) {
                        this._index = index;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PageProfile.prototype, "offset", {
                    get: function() {
                        return this._offset;
                    },
                    set: function(offset) {
                        this._offset = offset;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PageProfile.prototype, "height", {
                    get: function() {
                        return this._height;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PageProfile.prototype, "status", {
                    get: function() {
                        return this._status;
                    },
                    enumerable: true,
                    configurable: true
                });
                return PageProfile;
            }();
            UI.PageProfile = PageProfile;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var _Utils = CDP.UI._ListViewUtils;
            var TAG = "[CDP.UI.ScrollerElement] ";
            var ScrollerElement = function() {
                function ScrollerElement(element, options) {
                    this._$target = null;
                    this._$scrollMap = null;
                    this._listviewOptions = null;
                    this._$target = $(element);
                    this._listviewOptions = options;
                }
                ScrollerElement.prototype.getType = function() {
                    return ScrollerElement.TYPE;
                };
                ScrollerElement.prototype.getPos = function() {
                    return this._$target.scrollTop();
                };
                ScrollerElement.prototype.getPosMax = function() {
                    if (null == this._$scrollMap) {
                        this._$scrollMap = this._$target.children().first();
                    }
                    return _Utils.max(this._$scrollMap.height() - this._$target.height(), 0);
                };
                ScrollerElement.prototype.on = function(type, func) {
                    switch (type) {
                      case "scroll":
                        this._$target.on("scroll", func);
                        break;

                      case "scrollstop":
                        this._$target.on("scrollstop", func);
                        break;

                      default:
                        console.warn(TAG + "unsupported type: " + type);
                        break;
                    }
                };
                ScrollerElement.prototype.off = function(type, func) {
                    switch (type) {
                      case "scroll":
                        this._$target.off("scroll", func);
                        break;

                      case "scrollstop":
                        this._$target.off("scrollstop", func);
                        break;

                      default:
                        console.warn(TAG + "unsupported type: " + type);
                        break;
                    }
                };
                ScrollerElement.prototype.scrollTo = function(pos, animate, time) {
                    if (!this._listviewOptions.enableAnimation || !animate) {
                        this._$target.scrollTop(pos);
                    } else {
                        if (null == time) {
                            time = this._listviewOptions.animationDuration;
                        }
                        this._$target.animate({
                            scrollTop: pos
                        }, time);
                    }
                };
                ScrollerElement.prototype.update = function() {};
                ScrollerElement.prototype.destroy = function() {
                    this._$scrollMap = null;
                    if (this._$target) {
                        this._$target.off();
                        this._$target = null;
                    }
                };
                Object.defineProperty(ScrollerElement, "TYPE", {
                    get: function() {
                        return "element-overflow";
                    },
                    enumerable: true,
                    configurable: true
                });
                ScrollerElement.getFactory = function() {
                    var factory = function(element, options) {
                        return new ScrollerElement(element, options);
                    };
                    factory.type = ScrollerElement.TYPE;
                    return factory;
                };
                return ScrollerElement;
            }();
            UI.ScrollerElement = ScrollerElement;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var _Utils = CDP.UI._ListViewUtils;
            var TAG = "[CDP.UI.ScrollerNative] ";
            var ScrollerNative = function() {
                function ScrollerNative(options) {
                    this._$body = null;
                    this._$target = null;
                    this._$scrollMap = null;
                    this._listviewOptions = null;
                    this._$target = $(document);
                    this._$body = $("body");
                    this._listviewOptions = options;
                }
                ScrollerNative.prototype.getType = function() {
                    return ScrollerNative.TYPE;
                };
                ScrollerNative.prototype.getPos = function() {
                    return this._$target.scrollTop();
                };
                ScrollerNative.prototype.getPosMax = function() {
                    return _Utils.max(this._$target.height() - window.innerHeight, 0);
                };
                ScrollerNative.prototype.on = function(type, func) {
                    switch (type) {
                      case "scroll":
                        this._$target.on("scroll", func);
                        break;

                      case "scrollstop":
                        $(window).on("scrollstop", func);
                        break;

                      default:
                        console.warn(TAG + "unsupported type: " + type);
                        break;
                    }
                };
                ScrollerNative.prototype.off = function(type, func) {
                    switch (type) {
                      case "scroll":
                        this._$target.off("scroll", func);
                        break;

                      case "scrollstop":
                        $(window).off("scrollstop", func);
                        break;

                      default:
                        console.warn(TAG + "unsupported type: " + type);
                        break;
                    }
                };
                ScrollerNative.prototype.scrollTo = function(pos, animate, time) {
                    if (!this._listviewOptions.enableAnimation || !animate) {
                        this._$body.scrollTop(pos);
                    } else {
                        if (null == time) {
                            time = this._listviewOptions.animationDuration;
                        }
                        this._$body.animate({
                            scrollTop: pos
                        }, time);
                    }
                };
                ScrollerNative.prototype.update = function() {};
                ScrollerNative.prototype.destroy = function() {
                    this._$scrollMap = null;
                    this._$target = null;
                };
                Object.defineProperty(ScrollerNative, "TYPE", {
                    get: function() {
                        return "native-scroll";
                    },
                    enumerable: true,
                    configurable: true
                });
                ScrollerNative.getFactory = function() {
                    var factory = function(element, options) {
                        return new ScrollerNative(options);
                    };
                    factory.type = ScrollerNative.TYPE;
                    return factory;
                };
                return ScrollerNative;
            }();
            UI.ScrollerNative = ScrollerNative;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var _Config = CDP.UI.ListViewGlobalConfig;
            var _Utils = CDP.UI._ListViewUtils;
            var TAG = "[CDP.UI.ScrollerIScroll] ";
            var ScrollerIScroll = function() {
                function ScrollerIScroll($owner, element, iscrollOptions, listviewOptions) {
                    this._$owner = null;
                    this._iscroll = null;
                    this._refreshTimerId = null;
                    this._$wrapper = null;
                    this._$scroller = null;
                    this._listviewOptions = null;
                    if (null != UI.global.IScroll) {
                        this._$owner = $owner;
                        this._iscroll = new IScroll(element, iscrollOptions);
                        this._$wrapper = $(this._iscroll.wrapper);
                        this._$scroller = $(this._iscroll.scroller);
                        this._listviewOptions = listviewOptions;
                    } else {
                        console.error(TAG + "iscroll module doesn't load.");
                    }
                }
                ScrollerIScroll.prototype.getType = function() {
                    return ScrollerIScroll.TYPE;
                };
                ScrollerIScroll.prototype.getPos = function() {
                    var pos = this._iscroll.getComputedPosition().y;
                    if (_.isNaN(pos)) {
                        pos = 0;
                    } else {
                        pos = -pos;
                    }
                    return pos;
                };
                ScrollerIScroll.prototype.getPosMax = function() {
                    return _Utils.max(-this._iscroll.maxScrollY, 0);
                };
                ScrollerIScroll.prototype.on = function(type, func) {
                    switch (type) {
                      case "scroll":
                        this._iscroll.on("scroll", func);
                        break;

                      case "scrollstop":
                        this._iscroll.on("scrollEnd", func);
                        break;

                      default:
                        console.warn(TAG + "unsupported type: " + type);
                        break;
                    }
                };
                ScrollerIScroll.prototype.off = function(type, func) {
                    switch (type) {
                      case "scroll":
                        this._iscroll.off("scroll", func);
                        break;

                      case "scrollstop":
                        this._iscroll.on("scrollEnd", func);
                        break;

                      default:
                        console.warn(TAG + "unsupported type: " + type);
                        break;
                    }
                };
                ScrollerIScroll.prototype.scrollTo = function(pos, animate, time) {
                    time = 0;
                    if (this._listviewOptions.enableAnimation && animate) {
                        time = time || this._listviewOptions.animationDuration;
                    }
                    this._iscroll.scrollTo(0, -pos, time);
                };
                ScrollerIScroll.prototype.update = function() {
                    var _this = this;
                    if (this._$owner) {
                        (function() {
                            var ownerHeight = _this._$owner.height();
                            if (ownerHeight !== _this._$wrapper.height()) {
                                _this._$wrapper.height(ownerHeight);
                            }
                        })();
                        if (null != this._refreshTimerId) {
                            clearTimeout(this._refreshTimerId);
                        }
                        var proc_1 = function() {
                            if (_this._$scroller && _this._$scroller.height() !== _this._iscroll.scrollerHeight) {
                                _this._iscroll.refresh();
                                _this._refreshTimerId = setTimeout(proc_1, _this._listviewOptions.scrollMapRefreshInterval);
                            } else {
                                _this._refreshTimerId = null;
                            }
                        };
                        this._iscroll.refresh();
                        this._refreshTimerId = setTimeout(proc_1, this._listviewOptions.scrollMapRefreshInterval);
                    }
                };
                ScrollerIScroll.prototype.destroy = function() {
                    this._$scroller = null;
                    this._$wrapper = null;
                    this._iscroll.destroy();
                    this._$owner = null;
                };
                Object.defineProperty(ScrollerIScroll, "TYPE", {
                    get: function() {
                        return "iscroll";
                    },
                    enumerable: true,
                    configurable: true
                });
                ScrollerIScroll.getFactory = function(options) {
                    var defaultOpt = {
                        scrollX: false,
                        bounce: false,
                        mouseWheel: true,
                        scrollbars: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: "scale",
                        fadeScrollbars: true,
                        probeType: 2
                    };
                    var iscrollOptions = $.extend({}, defaultOpt, options);
                    var factory = function(element, listviewOptions) {
                        var $owner = $(element);
                        var $map = $owner.find(_Config.SCROLL_MAP_SELECTOR);
                        var $wrapper = $("<div class='" + _Config.WRAPPER_CLASS + "'></div>").css({
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            overflow: "hidden"
                        });
                        $map.wrap($wrapper);
                        return new ScrollerIScroll($owner, _Config.WRAPPER_SELECTOR, iscrollOptions, listviewOptions);
                    };
                    factory.type = ScrollerIScroll.TYPE;
                    return factory;
                };
                return ScrollerIScroll;
            }();
            UI.ScrollerIScroll = ScrollerIScroll;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var TAG = "[CDP.UI.ListItemView] ";
            var ListItemView = function(_super) {
                __extends(ListItemView, _super);
                function ListItemView(options) {
                    _super.call(this, options);
                    this._owner = null;
                    this._lineProfile = null;
                    this._owner = options.owner;
                    if (options.$el) {
                        var delegates = this.events ? true : false;
                        this.setElement(options.$el, delegates);
                    }
                    this._lineProfile = options.lineProfile;
                }
                ListItemView.prototype.render = function() {
                    console.warn(TAG + "need override 'render()' method.");
                    return this;
                };
                ListItemView.prototype.getIndex = function() {
                    return this._lineProfile.index;
                };
                ListItemView.prototype.getSpecifiedHeight = function() {
                    return this._lineProfile.height;
                };
                ListItemView.prototype.hasChildNode = function() {
                    if (!this.$el) {
                        return false;
                    } else {
                        return 0 < this.$el.children().length;
                    }
                };
                ListItemView.prototype.updateHeight = function(newHeight, options) {
                    if (this.$el) {
                        if (this.getSpecifiedHeight() !== newHeight) {
                            this._lineProfile.updateHeight(newHeight, options);
                            this.$el.height(newHeight);
                        }
                    }
                    return this;
                };
                ListItemView.compose = function(derives, properties, classProperties) {
                    var composed = UI.composeViews(ListItemView, derives);
                    return composed.extend(properties, classProperties);
                };
                ListItemView.prototype.remove = function() {
                    this.$el.find("figure").css("background-image", "none");
                    this.$el.children().remove();
                    this.$el.off();
                    this.$el = null;
                    this.stopListening();
                    this._lineProfile = null;
                    return this;
                };
                Object.defineProperty(ListItemView.prototype, "owner", {
                    get: function() {
                        return this._owner;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ListItemView;
            }(Backbone.View);
            UI.ListItemView = ListItemView;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var _Config = CDP.UI.ListViewGlobalConfig;
            var _Utils = CDP.UI._ListViewUtils;
            var TAG = "[CDP.UI.ScrollManager] ";
            var ScrollManager = function() {
                function ScrollManager(options) {
                    var _this = this;
                    this._$root = null;
                    this._$map = null;
                    this._mapHeight = 0;
                    this._scroller = null;
                    this._settings = null;
                    this._active = true;
                    this._scrollEventHandler = null;
                    this._scrollStopEventHandler = null;
                    this._baseHeight = 0;
                    this._lines = [];
                    this._pages = [];
                    this._lastActivePageContext = {
                        index: 0,
                        from: 0,
                        to: 0,
                        pos: 0
                    };
                    this._backup = {};
                    var defOptions = {
                        scrollerFactory: UI.ScrollerNative.getFactory(),
                        enableHiddenPage: false,
                        enableTransformOffset: false,
                        scrollMapRefreshInterval: 200,
                        scrollRefreshDistance: 200,
                        pagePrepareCount: 3,
                        pagePreloadCount: 1,
                        enableAnimation: true,
                        animationDuration: 0,
                        baseDepth: "auto",
                        itemTagName: "div",
                        removeItemWithTransition: true,
                        useDummyInactiveScrollMap: false
                    };
                    this._settings = $.extend({}, defOptions, options);
                    this._scrollEventHandler = function(event) {
                        _this.onScroll(_this._scroller.getPos());
                    };
                    this._scrollStopEventHandler = function(event) {
                        _this.onScrollStop(_this._scroller.getPos());
                    };
                }
                ScrollManager.prototype.initialize = function($root, height) {
                    if (this._$root) {
                        this.destroy();
                    }
                    this._$root = $root;
                    this._$map = $root.hasClass(_Config.SCROLL_MAP_CLASS) ? $root : $root.find(_Config.SCROLL_MAP_SELECTOR);
                    if (this._$map.length <= 0) {
                        this._$root = null;
                        return false;
                    }
                    this._scroller = this.createScroller();
                    this.setBaseHeight(height);
                    this.setScrollerCondition();
                    return true;
                };
                ScrollManager.prototype.destroy = function() {
                    if (this._scroller) {
                        this.resetScrollerCondition();
                        this._scroller.destroy();
                        this._scroller = null;
                    }
                    this.release();
                    this._$map = null;
                    this._$root = null;
                };
                ScrollManager.prototype.setBaseHeight = function(height) {
                    this._baseHeight = height;
                    if (this._baseHeight <= 0) {
                        console.warn(TAG + "invalid base height: " + this._baseHeight);
                    }
                    if (this._scroller) {
                        this._scroller.update();
                    }
                };
                ScrollManager.prototype.setActiveState = function(active) {
                    this._active = active;
                    this.treatScrollPosition();
                };
                ScrollManager.prototype.isActive = function() {
                    return this._active;
                };
                ScrollManager.prototype.getScrollerType = function() {
                    return this._settings.scrollerFactory.type;
                };
                ScrollManager.prototype.treatScrollPosition = function() {
                    var _this = this;
                    var i;
                    var transform = {};
                    var updateOffset = function($target, offset) {
                        offset = offset || _this._scroller.getPos() - _this._lastActivePageContext.pos;
                        if (_Utils.getCssMatrixValue($target, "translateY") !== offset) {
                            for (i = 0; i < _Utils.cssPrefixes.length; i++) {
                                transform[_Utils.cssPrefixes[i] + "transform"] = "translate3d(0px," + offset + "px,0px)";
                            }
                            $target.css(transform);
                            return $target;
                        }
                    };
                    var clearOffset = function($target) {
                        for (i = 0; i < _Utils.cssPrefixes.length; i++) {
                            transform[_Utils.cssPrefixes[i] + "transform"] = "";
                        }
                        $target.css(transform);
                        return $target;
                    };
                    if (this._active) {
                        (function() {
                            if (_this._scroller) {
                                _this._scroller.scrollTo(_this._lastActivePageContext.pos, false, 0);
                            }
                            clearOffset(_this._$map).css("display", "block");
                        })();
                        if (this._settings.useDummyInactiveScrollMap) {
                            this.prepareInactiveMap().remove();
                        }
                    } else {
                        if (this._settings.useDummyInactiveScrollMap) {
                            updateOffset(this.prepareInactiveMap());
                        } else {
                            updateOffset(this._$map);
                        }
                    }
                };
                ScrollManager.prototype.prepareInactiveMap = function() {
                    var $parent = this._$map.parent();
                    var $inactiveMap = $parent.find(_Config.INACTIVE_CLASS_SELECTOR);
                    if ($inactiveMap.length <= 0) {
                        var currentPageIndex_1 = this.getPageIndex();
                        var $listItemViews = this._$map.clone().children().filter(function(index, element) {
                            var pageIndex = ~~$(element).attr(_Config.DATA_PAGE_INDEX);
                            if (currentPageIndex_1 - 1 <= pageIndex || pageIndex <= currentPageIndex_1 + 1) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        $inactiveMap = $("<section class='" + _Config.SCROLL_MAP_CLASS + " " + _Config.INACTIVE_CLASS + "'></section>").append($listItemViews).height(this._mapHeight);
                        $parent.append($inactiveMap);
                        this._$map.css("display", "none");
                    }
                    return $inactiveMap;
                };
                ScrollManager.prototype.isInitialized = function() {
                    return !!this._$root;
                };
                ScrollManager.prototype.addItem = function(height, initializer, info, insertTo) {
                    this._addLine(new UI.LineProfile(this, Math.floor(height), initializer, info), insertTo);
                };
                ScrollManager.prototype._addLine = function(_line, insertTo) {
                    var i, n;
                    var deltaHeight = 0;
                    var lines = _line instanceof Array ? _line : [ _line ];
                    var addTail = false;
                    if (null == insertTo) {
                        insertTo = this._lines.length;
                    }
                    if (insertTo === this._lines.length) {
                        addTail = true;
                    }
                    for (i = 0, n = lines.length; i < n; i++) {
                        deltaHeight += lines[i].height;
                    }
                    this.updateScrollMapHeight(deltaHeight);
                    for (i = lines.length - 1; i >= 0; i--) {
                        this._lines.splice(insertTo, 0, lines[i]);
                    }
                    if (!addTail) {
                        if (0 === insertTo) {
                            this.clearPage();
                        } else if (null != this._lines[insertTo - 1].pageIndex) {
                            this.clearPage(this._lines[insertTo - 1].pageIndex);
                        }
                    }
                    this.updateProfiles(insertTo);
                };
                ScrollManager.prototype.removeItem = function(index, size, delay) {
                    var _this = this;
                    if (null == size) {
                        size = 1;
                    }
                    if (index < 0 || this._lines.length < index + size) {
                        console.error(TAG + "logic error. GroupProfile.removeItem(), invalid index: " + index);
                        return;
                    }
                    delay = null != delay ? delay : 0;
                    var setupTransition = function($map, delay) {
                        var transitionEndHandler = function(event) {
                            $map.off(_Utils.transitionEnd);
                            _Utils.clearTransitions($map);
                        };
                        _this._$map.on(_Utils.transitionEnd, transitionEndHandler);
                        _Utils.setTransformsTransitions($map, "height", delay, "ease");
                    };
                    var delta = 0;
                    var removed = [];
                    var mapTransition = false;
                    (function() {
                        var line;
                        for (var i = 0; i < size; i++) {
                            line = _this._lines[index + i];
                            delta += line.height;
                            line.resetDepth();
                            removed.push(line);
                        }
                        if (_this._settings.removeItemWithTransition && 0 < delay) {
                            var current = _this.getScrollPos();
                            var posMax = _this.getScrollPosMax() - delta;
                            mapTransition = posMax < current;
                        }
                    })();
                    (function() {
                        if (mapTransition) {
                            setupTransition(_this._$map, delay);
                        }
                        if (null != _this._lines[index].pageIndex) {
                            _this.clearPage(_this._lines[index].pageIndex);
                        }
                        _this.updateScrollMapHeight(-delta);
                        _this._lines.splice(index, size);
                        _this.updateProfiles(index);
                        setTimeout(function() {
                            removed.forEach(function(line) {
                                line.inactivate();
                            });
                        }, delay);
                    })();
                };
                ScrollManager.prototype.getItemInfo = function(target) {
                    var index;
                    var parser = function($target) {
                        if ($target.hasClass(_Config.LISTITEM_BASE_CLASS)) {
                            return ~~$target.attr(_Config.DATA_CONTAINER_INDEX);
                        } else if ($target.hasClass(_Config.SCROLL_MAP_CLASS) || $target.length <= 0) {
                            console.warn(TAG + "cannot ditect line from event object.");
                            return null;
                        } else {
                            return parser($target.parent());
                        }
                    };
                    if (target instanceof $.Event) {
                        index = parser($(target.currentTarget));
                    } else if (typeof target === "number") {
                        index = target;
                    }
                    if (null == index) {
                        console.error(TAG + "logic error. unsupported arg type. type: " + typeof target);
                        return null;
                    } else if (index < 0 || this._lines.length <= index) {
                        console.error(TAG + "logic error. invalid range. index: " + index);
                        return null;
                    }
                    return this._lines[index].info;
                };
                ScrollManager.prototype.refresh = function() {
                    var _this = this;
                    var targets = {};
                    var searchCount = this._settings.pagePrepareCount + this._settings.pagePreloadCount;
                    var currentPageIndex = this.getPageIndex();
                    var highPriorityIndex = [];
                    var oldExsistPage = _.filter(this._pages, function(page) {
                        return "inactive" !== page.status;
                    });
                    var changeState = function(index) {
                        if (index === currentPageIndex) {
                            targets[index] = "activate";
                            highPriorityIndex.push(index);
                        } else if (_Utils.abs(currentPageIndex - index) <= _this._settings.pagePrepareCount) {
                            targets[index] = "activate";
                        } else {
                            if (_this._settings.enableHiddenPage) {
                                targets[index] = "hide";
                            } else {
                                targets[index] = "activate";
                            }
                        }
                        if (currentPageIndex + 1 === index || currentPageIndex - 1 === index) {
                            highPriorityIndex.push(index);
                        }
                    };
                    if (this._lines.length <= 0) {
                        return;
                    }
                    (function() {
                        var i = 0;
                        var pageIndex = 0;
                        var overflowPrev = 0, overflowNext = 0;
                        var beginIndex = currentPageIndex - searchCount;
                        var endIndex = currentPageIndex + searchCount;
                        for (pageIndex = beginIndex; pageIndex <= endIndex; pageIndex++) {
                            if (pageIndex < 0) {
                                overflowPrev++;
                                continue;
                            }
                            if (_this._pages.length <= pageIndex) {
                                overflowNext++;
                                continue;
                            }
                            changeState(pageIndex);
                        }
                        if (0 < overflowPrev) {
                            for (i = 0, pageIndex = currentPageIndex + searchCount + 1; i < overflowPrev; i++, 
                            pageIndex++) {
                                if (_this._pages.length <= pageIndex) {
                                    break;
                                }
                                changeState(pageIndex);
                            }
                        }
                        if (0 < overflowNext) {
                            for (i = 0, pageIndex = currentPageIndex - searchCount - 1; i < overflowNext; i++, 
                            pageIndex--) {
                                if (pageIndex < 0) {
                                    break;
                                }
                                changeState(pageIndex);
                            }
                        }
                    })();
                    oldExsistPage.forEach(function(page) {
                        var index = page.index;
                        if (null == targets[index]) {
                            page.inactivate();
                        }
                    });
                    highPriorityIndex.sort(function(lhs, rhs) {
                        if (lhs < rhs) {
                            return -1;
                        } else if (lhs > rhs) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }).forEach(function(index) {
                        setTimeout(function() {
                            if (_this.isInitialized()) {
                                _this._pages[index] && _this._pages[index].activate();
                            }
                        }, 0);
                    });
                    _.each(targets, function(action, key) {
                        setTimeout(function() {
                            if (_this.isInitialized()) {
                                var index = ~~key;
                                switch (action) {
                                  case "activate":
                                    _this._pages[index] && _this._pages[index].activate();
                                    break;

                                  case "hide":
                                    _this._pages[index] && _this._pages[index].hide();
                                    break;

                                  case "inactivate":
                                    console.warn(TAG + "unexpected operation: inactivate");
                                    break;

                                  default:
                                    console.warn(TAG + "unknown operation: " + targets[key]);
                                    break;
                                }
                            }
                        }, 0);
                    });
                    this.findRecycleElements().remove();
                    this._lastActivePageContext.from = this._pages[currentPageIndex].getLineProfileFirst().index;
                    this._lastActivePageContext.to = this._pages[currentPageIndex].getLineProfileLast().index;
                    this._lastActivePageContext.index = currentPageIndex;
                };
                ScrollManager.prototype.update = function() {
                    var index = this._pages.length;
                    this.assignPage(index);
                    this.refresh();
                };
                ScrollManager.prototype.rebuild = function() {
                    this.clearPage();
                    this.assignPage();
                    this.refresh();
                };
                ScrollManager.prototype.release = function() {
                    this._lines.forEach(function(line) {
                        line.inactivate();
                    });
                    this._pages = [];
                    this._lines = [];
                    if (this._$map) {
                        this._mapHeight = 0;
                        this._$map.height(0);
                    }
                };
                ScrollManager.prototype.backup = function(key) {
                    if (null == this._backup[key]) {
                        this._backup[key] = {
                            lines: this._lines
                        };
                    }
                    return true;
                };
                ScrollManager.prototype.restore = function(key, rebuild) {
                    if (rebuild === void 0) {
                        rebuild = true;
                    }
                    if (null == this._backup[key]) {
                        return false;
                    }
                    if (0 < this._lines.length) {
                        this.release();
                    }
                    this._addLine(this._backup[key].lines);
                    if (rebuild) {
                        this.rebuild();
                    }
                    return true;
                };
                ScrollManager.prototype.hasBackup = function(key) {
                    if (null != this._backup[key]) {
                        return true;
                    } else {
                        return false;
                    }
                };
                ScrollManager.prototype.clearBackup = function(key) {
                    if (null == key) {
                        this._backup = {};
                        return true;
                    } else if (null != this._backup[key]) {
                        delete this._backup[key];
                        return true;
                    } else {
                        return false;
                    }
                };
                Object.defineProperty(ScrollManager.prototype, "backupData", {
                    get: function() {
                        return this._backup;
                    },
                    enumerable: true,
                    configurable: true
                });
                ScrollManager.prototype.setScrollHandler = function(handler, on) {
                    if (this._scroller) {
                        if (on) {
                            this._scroller.on("scroll", handler);
                        } else {
                            this._scroller.off("scroll", handler);
                        }
                    }
                };
                ScrollManager.prototype.setScrollStopHandler = function(handler, on) {
                    if (this._scroller) {
                        if (on) {
                            this._scroller.on("scrollstop", handler);
                        } else {
                            this._scroller.off("scrollstop", handler);
                        }
                    }
                };
                ScrollManager.prototype.getScrollPos = function() {
                    return this._scroller ? this._scroller.getPos() : 0;
                };
                ScrollManager.prototype.getScrollPosMax = function() {
                    return this._scroller ? this._scroller.getPosMax() : 0;
                };
                ScrollManager.prototype.scrollTo = function(pos, animate, time) {
                    if (this._scroller) {
                        if (pos < 0) {
                            console.warn(TAG + "invalid position, too small. [pos: " + pos + "]");
                            pos = 0;
                        } else if (this._scroller.getPosMax() < pos) {
                            console.warn(TAG + "invalid position, too big. [pos: " + pos + "]");
                            pos = this._scroller.getPosMax();
                        }
                        this._lastActivePageContext.pos = pos;
                        if (pos !== this._scroller.getPos()) {
                            this._scroller.scrollTo(pos, animate, time);
                        }
                    }
                };
                ScrollManager.prototype.ensureVisible = function(index, options) {
                    var _this = this;
                    if (index < 0 || this._lines.length <= index) {
                        console.warn(TAG + "ensureVisible(), invalid index, noop. [index: " + index + "]");
                        return;
                    } else if (!this._scroller) {
                        console.warn(TAG + "scroller is not ready.");
                        return;
                    }
                    (function() {
                        var target = _this._lines[index];
                        var defaultOptions = {
                            partialOK: true,
                            setTop: false,
                            animate: _this._settings.enableAnimation,
                            time: _this._settings.animationDuration,
                            callback: function() {}
                        };
                        var operation = $.extend({}, defaultOptions, options);
                        var currentScope = {
                            from: _this._scroller.getPos(),
                            to: _this._scroller.getPos() + _this._baseHeight
                        };
                        var targetScope = {
                            from: target.offset,
                            to: target.offset + target.height
                        };
                        var isInScope = function() {
                            if (operation.partialOK) {
                                if (targetScope.from <= currentScope.from) {
                                    if (currentScope.from <= targetScope.to) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                } else {
                                    if (targetScope.from <= currentScope.to) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            } else {
                                if (currentScope.from <= targetScope.from && targetScope.to <= currentScope.to) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        };
                        var detectPosition = function() {
                            if (targetScope.from < currentScope.from) {
                                return targetScope.from;
                            } else if (currentScope.from < targetScope.from) {
                                return target.offset - target.height;
                            } else {
                                console.warn(TAG + "logic error.");
                                return 0;
                            }
                        };
                        var pos;
                        if (operation.setTop) {
                            pos = targetScope.from;
                        } else if (isInScope()) {
                            operation.callback();
                            return;
                        } else {
                            pos = detectPosition();
                        }
                        if (pos < 0) {
                            pos = 0;
                        } else if (_this._scroller.getPosMax() < pos) {
                            pos = _this._scroller.getPosMax();
                        }
                        setTimeout(operation.callback, operation.time);
                        _this.scrollTo(pos, operation.animate, operation.time);
                    })();
                };
                ScrollManager.prototype.getScrollMapHeight = function() {
                    return this._$map ? this._mapHeight : 0;
                };
                ScrollManager.prototype.updateScrollMapHeight = function(delta) {
                    if (this._$map) {
                        this._mapHeight += delta;
                        if (this._mapHeight < 0) {
                            this._mapHeight = 0;
                        }
                        this._$map.height(this._mapHeight);
                    }
                };
                ScrollManager.prototype.updateProfiles = function(from) {
                    var i, n;
                    var last;
                    for (i = from, n = this._lines.length; i < n; i++) {
                        if (0 < i) {
                            last = this._lines[i - 1];
                            this._lines[i].index = last.index + 1;
                            this._lines[i].offset = last.offset + last.height;
                        } else {
                            this._lines[i].index = 0;
                            this._lines[i].offset = 0;
                        }
                    }
                };
                ScrollManager.prototype.getScrollMapElement = function() {
                    return this._$map || $("");
                };
                ScrollManager.prototype.findRecycleElements = function() {
                    return this._$map ? this._$map.find(_Config.RECYCLE_CLASS_SELECTOR) : $("");
                };
                ScrollManager.prototype.getListViewOptions = function() {
                    return this._settings;
                };
                ScrollManager.prototype.setScrollerCondition = function() {
                    this._scroller.on("scroll", this._scrollEventHandler);
                    this._scroller.on("scrollstop", this._scrollStopEventHandler);
                };
                ScrollManager.prototype.resetScrollerCondition = function() {
                    this._scroller.off("scrollstop", this._scrollStopEventHandler);
                    this._scroller.off("scroll", this._scrollEventHandler);
                };
                ScrollManager.prototype.createScroller = function() {
                    return this._settings.scrollerFactory(this._$root[0], this._settings);
                };
                ScrollManager.prototype.getPageIndex = function() {
                    var _this = this;
                    var i, n;
                    var page;
                    var candidate;
                    var scrollPos = this._scroller ? this._scroller.getPos() : 0;
                    var scrollPosMax = this._scroller ? this._scroller.getPosMax() : 0;
                    var scrollMapSize = function() {
                        var lastPage = _this.getLastPage();
                        if (null != lastPage) {
                            return lastPage.offset + lastPage.height;
                        } else {
                            return _this._baseHeight;
                        }
                    }();
                    var pos = function() {
                        if (0 === scrollPosMax || scrollPosMax <= _this._baseHeight) {
                            return 0;
                        } else {
                            return scrollPos * scrollMapSize / scrollPosMax;
                        }
                    }();
                    var validRange = function(page) {
                        if (null == page) {
                            return false;
                        } else if (page.offset <= pos && pos <= page.offset + page.height) {
                            return true;
                        } else {
                            return false;
                        }
                    };
                    if (this._baseHeight <= 0) {
                        console.error(TAG + "invalid base height: " + this._baseHeight);
                        return 0;
                    }
                    candidate = Math.floor(pos / this._baseHeight);
                    if (this._pages.length <= candidate) {
                        candidate = this._pages.length - 1;
                    }
                    page = this._pages[candidate];
                    if (validRange(page)) {
                        return page.index;
                    } else if (pos < page.offset) {
                        for (i = candidate - 1; i >= 0; i--) {
                            page = this._pages[i];
                            if (validRange(page)) {
                                return page.index;
                            }
                        }
                        console.warn(TAG + "unknown page index.");
                        return 0;
                    } else {
                        for (i = candidate + 1, n = this._pages.length; i < n; i++) {
                            page = this._pages[i];
                            if (validRange(page)) {
                                return page.index;
                            }
                        }
                        console.warn(TAG + "unknown page index.");
                        return this.getLastPage().index;
                    }
                };
                ScrollManager.prototype.onScroll = function(pos) {
                    if (this._active && 0 < this._pages.length) {
                        var currentPageIndex = this.getPageIndex();
                        if (_Utils.abs(pos - this._lastActivePageContext.pos) < this._settings.scrollRefreshDistance) {
                            if (this._lastActivePageContext.index !== currentPageIndex) {
                                this.refresh();
                            }
                        }
                        this._lastActivePageContext.pos = pos;
                    }
                };
                ScrollManager.prototype.onScrollStop = function(pos) {
                    if (this._active && 0 < this._pages.length) {
                        var currentPageIndex = this.getPageIndex();
                        if (this._lastActivePageContext.index !== currentPageIndex) {
                            this.refresh();
                        }
                        this._lastActivePageContext.pos = pos;
                    }
                };
                ScrollManager.prototype.getLastPage = function() {
                    if (0 < this._pages.length) {
                        return this._pages[this._pages.length - 1];
                    } else {
                        return null;
                    }
                };
                ScrollManager.prototype.assignPage = function(from) {
                    var _this = this;
                    var i, n;
                    if (null == from) {
                        from = 0;
                    } else {
                        this.clearPage(from);
                    }
                    (function() {
                        var lineIndex = 0;
                        var lastPage = _this.getLastPage();
                        var lastLine;
                        var tempPage;
                        if (null == lastPage) {
                            lastPage = new UI.PageProfile();
                            _this._pages.push(lastPage);
                        } else {
                            lastLine = lastPage.getLineProfileLast();
                            if (null != lastLine) {
                                lineIndex = lastLine.index + 1;
                            }
                        }
                        var asignee = _this._lines.slice(lineIndex);
                        for (i = 0, n = asignee.length; i < n; i++) {
                            if (_this._baseHeight <= lastPage.height) {
                                lastPage.normalize();
                                tempPage = lastPage;
                                tempPage = new UI.PageProfile();
                                tempPage.index = lastPage.index + 1;
                                tempPage.offset = lastPage.offset + lastPage.height;
                                lastPage = tempPage;
                                _this._pages.push(lastPage);
                            }
                            asignee[i].pageIndex = lastPage.index;
                            lastPage.push(asignee[i]);
                        }
                        lastPage.normalize();
                    })();
                    if (this._scroller) {
                        this._scroller.update();
                    }
                };
                ScrollManager.prototype.clearPage = function(from) {
                    if (null == from) {
                        from = 0;
                    }
                    this._pages = this._pages.slice(0, from);
                };
                return ScrollManager;
            }();
            UI.ScrollManager = ScrollManager;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var TAG = "[CDP.UI.ListView] ";
            var ListView = function(_super) {
                __extends(ListView, _super);
                function ListView(options) {
                    _super.call(this, options);
                    this._scrollMgr = null;
                    var opt = options || {};
                    this._scrollMgr = new UI.ScrollManager(options);
                    if (opt.$el) {
                        var delegates = this.events ? true : false;
                        this.setElement(opt.$el, delegates);
                    } else {
                        var height = opt.initialHeight || this.$el.height();
                        this._scrollMgr.initialize(this.$el, height);
                    }
                }
                ListView.prototype.setElement = function(element, delegate) {
                    if (this._scrollMgr) {
                        var $el = $(element);
                        this._scrollMgr.destroy();
                        this._scrollMgr.initialize($el, $el.height());
                    }
                    return _super.prototype.setElement.call(this, element, delegate);
                };
                ListView.prototype.remove = function() {
                    this._scrollMgr.destroy();
                    return _super.prototype.remove.call(this);
                };
                ListView.prototype.isInitialized = function() {
                    return this._scrollMgr.isInitialized();
                };
                ListView.prototype.addItem = function(height, initializer, info, insertTo) {
                    this._addLine(new UI.LineProfile(this._scrollMgr, Math.floor(height), initializer, info), insertTo);
                };
                ListView.prototype.removeItem = function(index, size, delay) {
                    this._scrollMgr.removeItem(index, size, delay);
                };
                ListView.prototype.getItemInfo = function(target) {
                    return this._scrollMgr.getItemInfo(target);
                };
                ListView.prototype.refresh = function() {
                    this._scrollMgr.refresh();
                };
                ListView.prototype.update = function() {
                    this._scrollMgr.update();
                };
                ListView.prototype.rebuild = function() {
                    this._scrollMgr.rebuild();
                };
                ListView.prototype.release = function() {
                    this._scrollMgr.release();
                };
                ListView.prototype.backup = function(key) {
                    return this._scrollMgr.backup(key);
                };
                ListView.prototype.restore = function(key, rebuild) {
                    if (rebuild === void 0) {
                        rebuild = true;
                    }
                    return this._scrollMgr.restore(key, rebuild);
                };
                ListView.prototype.hasBackup = function(key) {
                    return this._scrollMgr.hasBackup(key);
                };
                ListView.prototype.clearBackup = function(key) {
                    return this._scrollMgr.clearBackup(key);
                };
                Object.defineProperty(ListView.prototype, "backupData", {
                    get: function() {
                        return this._scrollMgr ? this._scrollMgr.backupData : null;
                    },
                    enumerable: true,
                    configurable: true
                });
                ListView.prototype.setScrollHandler = function(handler, on) {
                    this._scrollMgr.setScrollHandler(handler, on);
                };
                ListView.prototype.setScrollStopHandler = function(handler, on) {
                    this._scrollMgr.setScrollStopHandler(handler, on);
                };
                ListView.prototype.getScrollPos = function() {
                    return this._scrollMgr.getScrollPos();
                };
                ListView.prototype.getScrollPosMax = function() {
                    return this._scrollMgr.getScrollPosMax();
                };
                ListView.prototype.scrollTo = function(pos, animate, time) {
                    this._scrollMgr.scrollTo(pos, animate, time);
                };
                ListView.prototype.ensureVisible = function(index, options) {
                    this._scrollMgr.ensureVisible(index, options);
                };
                Object.defineProperty(ListView.prototype, "core", {
                    get: function() {
                        return this._scrollMgr;
                    },
                    enumerable: true,
                    configurable: true
                });
                ListView.prototype._addLine = function(_line, insertTo) {
                    this._scrollMgr._addLine(_line, insertTo);
                };
                ListView.compose = function(derives, properties, classProperties) {
                    var composed = UI.composeViews(ListView, derives);
                    return composed.extend(properties, classProperties);
                };
                return ListView;
            }(Backbone.View);
            UI.ListView = ListView;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var TAG = "[CDP.UI.GroupListItemView] ";
            var GroupListItemView = function(_super) {
                __extends(GroupListItemView, _super);
                function GroupListItemView(options) {
                    _super.call(this, options);
                    this._groupProfile = null;
                    this._groupProfile = options.groupProfile;
                }
                GroupListItemView.prototype.isExpanded = function() {
                    return this._groupProfile.isExpanded();
                };
                GroupListItemView.prototype.isExpanding = function() {
                    return this.owner.isExpanding();
                };
                GroupListItemView.prototype.isCollapsing = function() {
                    return this.owner.isCollapsing();
                };
                GroupListItemView.prototype.isSwitching = function() {
                    return this.owner.isSwitching();
                };
                GroupListItemView.prototype.hasChildren = function(layoutKey) {
                    return this._groupProfile.hasChildren(layoutKey);
                };
                return GroupListItemView;
            }(UI.ListItemView);
            UI.GroupListItemView = GroupListItemView;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var TAG = "[CDP.UI.ExpandManager] ";
            var ExpandManager = function() {
                function ExpandManager(owner) {
                    this._owner = null;
                    this._mapGroups = {};
                    this._aryTopGroups = [];
                    this._layoutKey = null;
                    this._owner = owner;
                }
                ExpandManager.prototype.newGroup = function(id) {
                    var group;
                    if (null == id) {
                        id = "group-id:" + ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
                    }
                    if (null != this._mapGroups[id]) {
                        return this._mapGroups[id];
                    }
                    group = new UI.GroupProfile(id, this._owner);
                    this._mapGroups[id] = group;
                    return group;
                };
                ExpandManager.prototype.getGroup = function(id) {
                    if (null == this._mapGroups[id]) {
                        console.warn(TAG + "group id: " + id + " is not registered.");
                        return null;
                    }
                    return this._mapGroups[id];
                };
                ExpandManager.prototype.registerTopGroup = function(topGroup) {
                    var lastGroup;
                    var insertTo;
                    if ("registered" === topGroup.status) {
                        topGroup.restore();
                        return;
                    }
                    lastGroup = 0 < this._aryTopGroups.length ? this._aryTopGroups[this._aryTopGroups.length - 1] : null;
                    insertTo = null != lastGroup ? lastGroup.getLastLineIndex(true) + 1 : 0;
                    if (_.isNaN(insertTo)) {
                        console.error(TAG + "logic error, 'insertTo' is NaN.");
                        return;
                    }
                    this._aryTopGroups.push(topGroup);
                    topGroup.register(insertTo);
                };
                ExpandManager.prototype.getTopGroups = function() {
                    return this._aryTopGroups.slice(0);
                };
                ExpandManager.prototype.expandAll = function() {
                    this._aryTopGroups.forEach(function(group) {
                        if (group.hasChildren()) {
                            group.expand();
                        }
                    });
                };
                ExpandManager.prototype.collapseAll = function(delay) {
                    this._aryTopGroups.forEach(function(group) {
                        if (group.hasChildren()) {
                            group.collapse(delay);
                        }
                    });
                };
                ExpandManager.prototype.isExpanding = function() {
                    return this._owner.isStatusIn("expanding");
                };
                ExpandManager.prototype.isCollapsing = function() {
                    return this._owner.isStatusIn("collapsing");
                };
                ExpandManager.prototype.isSwitching = function() {
                    return this.isExpanding() || this.isCollapsing();
                };
                ExpandManager.prototype.statusAddRef = function(status) {
                    return this._owner.statusAddRef(status);
                };
                ExpandManager.prototype.statusRelease = function(status) {
                    return this._owner.statusRelease(status);
                };
                ExpandManager.prototype.statusScope = function(status, callback) {
                    this._owner.statusScope(status, callback);
                };
                ExpandManager.prototype.isStatusIn = function(status) {
                    return this._owner.isStatusIn(status);
                };
                Object.defineProperty(ExpandManager.prototype, "layoutKey", {
                    get: function() {
                        return this._layoutKey;
                    },
                    set: function(key) {
                        this._layoutKey = key;
                    },
                    enumerable: true,
                    configurable: true
                });
                ExpandManager.prototype.release = function() {
                    this._mapGroups = {};
                    this._aryTopGroups = [];
                };
                ExpandManager.prototype.backup = function(key) {
                    var _backup = this.backupData;
                    if (null == _backup[key]) {
                        _backup[key] = {
                            map: this._mapGroups,
                            tops: this._aryTopGroups
                        };
                    }
                    return true;
                };
                ExpandManager.prototype.restore = function(key, rebuild) {
                    if (rebuild === void 0) {
                        rebuild = true;
                    }
                    var _backup = this.backupData;
                    if (null == _backup[key]) {
                        return false;
                    }
                    if (0 < this._aryTopGroups.length) {
                        this.release();
                    }
                    this._mapGroups = _backup[key].map;
                    this._aryTopGroups = _backup[key].tops;
                    if (this._aryTopGroups.length <= 0 || !this._aryTopGroups[0].hasLayoutKeyOf(this.layoutKey)) {
                        return false;
                    }
                    this._aryTopGroups.forEach(function(group) {
                        group.restore();
                    });
                    if (rebuild) {
                        this._owner.rebuild();
                    }
                    return true;
                };
                ExpandManager.prototype.hasBackup = function(key) {
                    return this._owner.hasBackup(key);
                };
                ExpandManager.prototype.clearBackup = function(key) {
                    return this._owner.clearBackup(key);
                };
                Object.defineProperty(ExpandManager.prototype, "backupData", {
                    get: function() {
                        return this._owner.backupData;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ExpandManager;
            }();
            UI.ExpandManager = ExpandManager;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var TAG = "[CDP.UI.ExpandableListView] ";
            var ExpandableListView = function(_super) {
                __extends(ExpandableListView, _super);
                function ExpandableListView(options) {
                    _super.call(this, options);
                    this._statusMgr = null;
                    this._expandManager = null;
                    this._statusMgr = new UI.StatusManager();
                    this._expandManager = new UI.ExpandManager(this);
                }
                ExpandableListView.prototype.newGroup = function(id) {
                    return this._expandManager.newGroup(id);
                };
                ExpandableListView.prototype.getGroup = function(id) {
                    return this._expandManager.getGroup(id);
                };
                ExpandableListView.prototype.registerTopGroup = function(topGroup) {
                    this._expandManager.registerTopGroup(topGroup);
                };
                ExpandableListView.prototype.getTopGroups = function() {
                    return this._expandManager.getTopGroups();
                };
                ExpandableListView.prototype.expandAll = function() {
                    this._expandManager.expandAll();
                };
                ExpandableListView.prototype.collapseAll = function(delay) {
                    this._expandManager.collapseAll(delay);
                };
                ExpandableListView.prototype.isExpanding = function() {
                    return this._expandManager.isExpanding();
                };
                ExpandableListView.prototype.isCollapsing = function() {
                    return this._expandManager.isCollapsing();
                };
                ExpandableListView.prototype.isSwitching = function() {
                    return this._expandManager.isSwitching();
                };
                ExpandableListView.prototype.statusAddRef = function(status) {
                    return this._statusMgr.statusAddRef(status);
                };
                ExpandableListView.prototype.statusRelease = function(status) {
                    return this._statusMgr.statusRelease(status);
                };
                ExpandableListView.prototype.statusScope = function(status, callback) {
                    this._statusMgr.statusScope(status, callback);
                };
                ExpandableListView.prototype.isStatusIn = function(status) {
                    return this._statusMgr.isStatusIn(status);
                };
                Object.defineProperty(ExpandableListView.prototype, "layoutKey", {
                    get: function() {
                        return this._expandManager.layoutKey;
                    },
                    set: function(key) {
                        this._expandManager.layoutKey = key;
                    },
                    enumerable: true,
                    configurable: true
                });
                ExpandableListView.prototype.release = function() {
                    _super.prototype.release.call(this);
                    this._expandManager.release();
                };
                ExpandableListView.prototype.backup = function(key) {
                    return this._expandManager.backup(key);
                };
                ExpandableListView.prototype.restore = function(key, rebuild) {
                    if (rebuild === void 0) {
                        rebuild = true;
                    }
                    return this._expandManager.restore(key, rebuild);
                };
                return ExpandableListView;
            }(UI.ListView);
            UI.ExpandableListView = ExpandableListView;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    return CDP.UI;
});

(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        define("cdp.ui.jqm", [ "cdp.framework.jqm", "cdp.tools", "cdp.ui.listview" ], function() {
            return factory(root.CDP || (root.CDP = {}));
        });
    } else {
        factory(root.CDP || (root.CDP = {}));
    }
})(this, function(CDP) {
    CDP.UI = CDP.UI || {};
    var __extends = this && this.__extends || function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var TAG = "[CDP.UI.Toast] ";
            var Toast;
            (function(Toast) {
                Toast.LENGTH_SHORT = 1500;
                Toast.LENGTH_LONG = 4e3;
                (function(OffsetX) {
                    OffsetX[OffsetX["LEFT"] = 1] = "LEFT";
                    OffsetX[OffsetX["RIGHT"] = 2] = "RIGHT";
                    OffsetX[OffsetX["CENTER"] = 4] = "CENTER";
                })(Toast.OffsetX || (Toast.OffsetX = {}));
                var OffsetX = Toast.OffsetX;
                (function(OffsetY) {
                    OffsetY[OffsetY["TOP"] = 16] = "TOP";
                    OffsetY[OffsetY["BOTTOM"] = 32] = "BOTTOM";
                    OffsetY[OffsetY["CENTER"] = 64] = "CENTER";
                })(Toast.OffsetY || (Toast.OffsetY = {}));
                var OffsetY = Toast.OffsetY;
                var StyleBuilderDefault = function() {
                    function StyleBuilderDefault() {}
                    StyleBuilderDefault.prototype.getClass = function() {
                        return "ui-loader ui-overlay-shadow ui-corner-all ui-body-b";
                    };
                    StyleBuilderDefault.prototype.getStyle = function() {
                        var style = {
                            padding: "7px 25px 7px 25px",
                            display: "block",
                            opacity: .8
                        };
                        return style;
                    };
                    StyleBuilderDefault.prototype.getOffsetPoint = function() {
                        return OffsetX.CENTER | OffsetY.BOTTOM;
                    };
                    StyleBuilderDefault.prototype.getOffsetX = function() {
                        return 0;
                    };
                    StyleBuilderDefault.prototype.getOffsetY = function() {
                        return -75;
                    };
                    return StyleBuilderDefault;
                }();
                Toast.StyleBuilderDefault = StyleBuilderDefault;
                function show(message, duration, style) {
                    if (duration === void 0) {
                        duration = Toast.LENGTH_SHORT;
                    }
                    var $mobile = $.mobile;
                    var info = style || new StyleBuilderDefault();
                    var setCSS = info.getStyle() ? true : false;
                    var msg = message.replace(/\n/g, "<br/>");
                    var html = "<div>" + msg + "</div>";
                    var box = $(html).addClass(info.getClass());
                    if (setCSS) {
                        box.css(info.getStyle());
                    }
                    box.css({
                        top: 0,
                        left: 0
                    }).appendTo($mobile.pageContainer);
                    var offsetPoint = info.getOffsetPoint();
                    var posX, posY;
                    var $window = $(window);
                    var box_width = box.width() + parseInt(box.css("padding-left"), 10) + parseInt(box.css("padding-right"), 10);
                    var box_height = box.height() + parseInt(box.css("padding-top"), 10) + parseInt(box.css("padding-bottom"), 10);
                    switch (offsetPoint & 15) {
                      case OffsetX.LEFT:
                        posX = 0 + info.getOffsetX();
                        break;

                      case OffsetX.RIGHT:
                        posX = $window.width() - box_width + info.getOffsetX();
                        break;

                      case OffsetX.CENTER:
                        posX = $window.width() / 2 - box_width / 2 + info.getOffsetX();
                        break;

                      default:
                        console.warn(TAG + "warn. unknown offsetPoint:" + (offsetPoint & 15));
                        posX = $window.width() / 2 - box_width / 2 + info.getOffsetX();
                        break;
                    }
                    switch (offsetPoint & 240) {
                      case OffsetY.TOP:
                        posY = 0 + info.getOffsetY();
                        break;

                      case OffsetY.BOTTOM:
                        posY = $window.height() - box_height + info.getOffsetY();
                        break;

                      case OffsetY.CENTER:
                        posY = $window.height() / 2 - box_height / 2 + info.getOffsetY();
                        break;

                      default:
                        console.warn(TAG + "warn. unknown offsetPoint:" + (offsetPoint & 240));
                        posY = $window.height() / 2 - box_height / 2 + info.getOffsetY();
                        break;
                    }
                    box.css({
                        top: posY,
                        left: posX
                    }).delay(duration).fadeOut(400, function() {
                        $(this).remove();
                    });
                }
                Toast.show = show;
            })(Toast = UI.Toast || (UI.Toast = {}));
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var Framework = CDP.Framework;
            var TAG = "[CDP.UI.Dialog] ";
            var Dialog = function() {
                function Dialog(id, options) {
                    this._template = null;
                    this._settings = null;
                    this._$dialog = null;
                    Dialog.initCommonCondition();
                    this._settings = $.extend({}, Dialog.s_defaultOptions, options);
                    this._template = CDP.Tools.Template.getJST(id, this._settings.src);
                }
                Dialog.prototype.show = function(options) {
                    var _this = this;
                    var $document = $(document), $body = $("body"), $page = $body.pagecontainer("getActivePage");
                    var moveEvent = "touchmove mousemove MSPointerMove";
                    var scrollHander = function(event) {
                        event.preventDefault();
                    };
                    var ofcHidden = {
                        overflow: "hidden",
                        "overflow-x": "hidden",
                        "overflow-y": "hidden"
                    };
                    var ofcBody = {
                        overflow: $body.css("overflow"),
                        "overflow-x": $body.css("overflow-x"),
                        "overflow-y": $body.css("overflow-y")
                    };
                    var ofcPage = {
                        overflow: $page.css("overflow"),
                        "overflow-x": $page.css("overflow-x"),
                        "overflow-y": $page.css("overflow-y")
                    };
                    if (null != options) {
                        this._settings = $.extend({}, this._settings, options);
                    }
                    this._settings._header = this._settings.title ? "has-title" : "no-title";
                    this._$dialog = $(this._template(this._settings));
                    $body.append(this._$dialog);
                    this._$dialog.popup({
                        dismissible: this._settings.dismissible,
                        transition: this._settings.transition,
                        positionTo: "window",
                        create: function(event, ui) {
                            $document.on(moveEvent, scrollHander);
                            $body.css(ofcHidden);
                            $page.css(ofcHidden);
                            Dialog.register(_this);
                        },
                        afterclose: function(event, ui) {
                            $page.css(ofcPage);
                            $body.css(ofcBody);
                            $document.off(moveEvent, scrollHander);
                            Dialog.register(null);
                            _this._$dialog.remove();
                            _this._$dialog = null;
                        }
                    }).popup("open").on(this._settings.event, function(event) {
                        event.preventDefault();
                        if ("false" === $(event.target).attr("data-auto-close")) {
                            return;
                        }
                        _this.close();
                    });
                    return this._$dialog;
                };
                Dialog.prototype.close = function() {
                    if (this._$dialog) {
                        this._$dialog.popup("close");
                    }
                };
                Object.defineProperty(Dialog.prototype, "$el", {
                    get: function() {
                        return this._$dialog;
                    },
                    enumerable: true,
                    configurable: true
                });
                Dialog.setDefaultOptions = function(options) {
                    Dialog.initCommonCondition();
                    $.extend(true, Dialog.s_defaultOptions, options);
                };
                Dialog.register = function(dialog) {
                    if (null != dialog && null != Dialog.s_activeDialog) {
                        console.warn(TAG + "new dialog proc is called in the past dialog's one. use setTimeout() for post process.");
                    }
                    Dialog.s_activeDialog = dialog;
                };
                Dialog.initCommonCondition = function() {
                    if (!Framework.isInitialized()) {
                        console.warn(TAG + "initCommonCondition() should be called after Framework.initialized.");
                        return;
                    }
                    if (null == Dialog.s_oldBackKeyHandler) {
                        Dialog.s_oldBackKeyHandler = CDP.setBackButtonHandler(null);
                        CDP.setBackButtonHandler(Dialog.customBackKeyHandler);
                        Dialog.s_defaultOptions = {
                            idPositive: "dlg-btn-positive",
                            idNegative: "dlg-btn-negative",
                            event: Framework.getDefaultClickEvent(),
                            dismissible: false,
                            transition: "pop",
                            labelPositive: "OK",
                            labelNegative: "Cancel"
                        };
                    }
                };
                Dialog.customBackKeyHandler = function(event) {
                    var $target;
                    if (null != Dialog.s_activeDialog) {
                        if (null != Dialog.s_activeDialog._settings.idNegative) {
                            $target = Dialog.s_activeDialog._$dialog.find("#" + Dialog.s_activeDialog._settings.idNegative);
                            if (0 === $target.length) {
                                $target = Dialog.s_activeDialog._$dialog;
                            }
                            $target.trigger(Dialog.s_activeDialog._settings.event);
                        }
                        return;
                    }
                    Dialog.s_oldBackKeyHandler(event);
                };
                Dialog.s_activeDialog = null;
                Dialog.s_oldBackKeyHandler = null;
                Dialog.s_defaultOptions = null;
                return Dialog;
            }();
            UI.Dialog = Dialog;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var Framework = CDP.Framework;
            var TAG = "[CDP.UI.PageView] ";
            var PageContainerView = function(_super) {
                __extends(PageContainerView, _super);
                function PageContainerView(options) {
                    _super.call(this, options);
                    this._owner = null;
                    this._owner = options.owner;
                    if (options.$el) {
                        var delegates = this.events ? true : false;
                        this.setElement(options.$el, delegates);
                    }
                }
                Object.defineProperty(PageContainerView.prototype, "owner", {
                    get: function() {
                        return this._owner;
                    },
                    enumerable: true,
                    configurable: true
                });
                return PageContainerView;
            }(Backbone.View);
            UI.PageContainerView = PageContainerView;
            var PageView = function(_super) {
                __extends(PageView, _super);
                function PageView(url, id, options) {
                    _super.call(this, options);
                    this._pageOptions = null;
                    this._basePage = null;
                    this._statusMgr = null;
                    this._pageOptions = $.extend({}, {
                        owner: this
                    }, options);
                    this._basePage = this._pageOptions.basePage ? new this._pageOptions.basePage(url, id, this._pageOptions) : new Framework.Page(url, id, this._pageOptions);
                    this._statusMgr = new UI.StatusManager();
                    var delegates = this.events ? true : false;
                    this.setElement(this.$page, delegates);
                }
                PageView.prototype.statusAddRef = function(status) {
                    return this._statusMgr.statusAddRef(status);
                };
                PageView.prototype.statusRelease = function(status) {
                    return this._statusMgr.statusRelease(status);
                };
                PageView.prototype.statusScope = function(status, callback) {
                    this._statusMgr.statusScope(status, callback);
                };
                PageView.prototype.isStatusIn = function(status) {
                    return this._statusMgr.isStatusIn(status);
                };
                Object.defineProperty(PageView.prototype, "active", {
                    get: function() {
                        return this._basePage.active;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PageView.prototype, "url", {
                    get: function() {
                        return this._basePage.url;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PageView.prototype, "id", {
                    get: function() {
                        return this._basePage ? this._basePage.id : null;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PageView.prototype, "$page", {
                    get: function() {
                        return this._basePage.$page;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PageView.prototype, "$header", {
                    get: function() {
                        return this._basePage.$header;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PageView.prototype, "$footer", {
                    get: function() {
                        return this._basePage.$footer;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(PageView.prototype, "intent", {
                    get: function() {
                        return this._basePage.intent;
                    },
                    set: function(newIntent) {
                        this._basePage.intent = newIntent;
                    },
                    enumerable: true,
                    configurable: true
                });
                PageView.prototype.onOrientationChanged = function(newOrientation) {};
                PageView.prototype.onHardwareBackButton = function(event) {
                    return false;
                };
                PageView.prototype.onBeforeRouteChange = function() {
                    return $.Deferred().resolve().promise();
                };
                PageView.prototype.onCommand = function(event, kind) {};
                PageView.prototype.onInitialize = function(event) {};
                PageView.prototype.onPageBeforeCreate = function(event) {
                    this.setElement(this.$page, true);
                };
                PageView.prototype.onPageInit = function(event) {};
                PageView.prototype.onPageBeforeShow = function(event, data) {};
                PageView.prototype.onPageShow = function(event, data) {};
                PageView.prototype.onPageBeforeHide = function(event, data) {};
                PageView.prototype.onPageHide = function(event, data) {};
                PageView.prototype.onPageRemove = function(event) {
                    this.remove();
                };
                return PageView;
            }(Backbone.View);
            UI.PageView = PageView;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var TAG = "[CDP.UI.PageListView] ";
            var PageListView = function(_super) {
                __extends(PageListView, _super);
                function PageListView(url, id, options) {
                    _super.call(this, url, id, $.extend({}, {
                        autoDestoryElement: false
                    }, options));
                    this._scrollMgr = null;
                    this._needRebuild = false;
                    this._scrollMgr = new UI.ScrollManager(options);
                }
                PageListView.prototype.reserveRebuild = function() {
                    this._needRebuild = true;
                };
                PageListView.prototype.onOrientationChanged = function(newOrientation) {
                    this._scrollMgr.setBaseHeight(this.getPageBaseHeight());
                };
                PageListView.prototype.onBeforeRouteChange = function() {
                    if (this._pageOptions.autoDestoryElement) {
                        this._scrollMgr.destroy();
                    }
                    return _super.prototype.onBeforeRouteChange.call(this);
                };
                PageListView.prototype.onPageBeforeShow = function(event, data) {
                    _super.prototype.onPageBeforeShow.call(this, event, data);
                    this._scrollMgr.initialize(this.$page, this.getPageBaseHeight());
                };
                PageListView.prototype.onPageShow = function(event, data) {
                    _super.prototype.onPageShow.call(this, event, data);
                    this._scrollMgr.setBaseHeight(this.getPageBaseHeight());
                    if (this._needRebuild) {
                        this.rebuild();
                        this._needRebuild = false;
                    }
                };
                PageListView.prototype.onPageRemove = function(event) {
                    _super.prototype.onPageRemove.call(this, event);
                    this.release();
                };
                PageListView.prototype.isInitialized = function() {
                    return this._scrollMgr.isInitialized();
                };
                PageListView.prototype.addItem = function(height, initializer, info, insertTo) {
                    this._addLine(new UI.LineProfile(this._scrollMgr, Math.floor(height), initializer, info), insertTo);
                };
                PageListView.prototype.removeItem = function(index, size, delay) {
                    this._scrollMgr.removeItem(index, size, delay);
                };
                PageListView.prototype.getItemInfo = function(target) {
                    return this._scrollMgr.getItemInfo(target);
                };
                PageListView.prototype.refresh = function() {
                    this._scrollMgr.refresh();
                };
                PageListView.prototype.update = function() {
                    this._scrollMgr.update();
                };
                PageListView.prototype.rebuild = function() {
                    this._scrollMgr.rebuild();
                };
                PageListView.prototype.release = function() {
                    this._scrollMgr.release();
                };
                PageListView.prototype.backup = function(key) {
                    return this._scrollMgr.backup(key);
                };
                PageListView.prototype.restore = function(key, rebuild) {
                    if (rebuild === void 0) {
                        rebuild = true;
                    }
                    var retval = this._scrollMgr.restore(key, rebuild);
                    if (retval && !rebuild) {
                        this.reserveRebuild();
                    }
                    return retval;
                };
                PageListView.prototype.hasBackup = function(key) {
                    return this._scrollMgr.hasBackup(key);
                };
                PageListView.prototype.clearBackup = function(key) {
                    return this._scrollMgr.clearBackup(key);
                };
                Object.defineProperty(PageListView.prototype, "backupData", {
                    get: function() {
                        return this._scrollMgr.backupData;
                    },
                    enumerable: true,
                    configurable: true
                });
                PageListView.prototype.setScrollHandler = function(handler, on) {
                    this._scrollMgr.setScrollHandler(handler, on);
                };
                PageListView.prototype.setScrollStopHandler = function(handler, on) {
                    this._scrollMgr.setScrollStopHandler(handler, on);
                };
                PageListView.prototype.getScrollPos = function() {
                    return this._scrollMgr.getScrollPos();
                };
                PageListView.prototype.getScrollPosMax = function() {
                    return this._scrollMgr.getScrollPosMax();
                };
                PageListView.prototype.scrollTo = function(pos, animate, time) {
                    this._scrollMgr.scrollTo(pos, animate, time);
                };
                PageListView.prototype.ensureVisible = function(index, options) {
                    this._scrollMgr.ensureVisible(index, options);
                };
                Object.defineProperty(PageListView.prototype, "core", {
                    get: function() {
                        return this._scrollMgr;
                    },
                    enumerable: true,
                    configurable: true
                });
                PageListView.prototype._addLine = function(_line, insertTo) {
                    this._scrollMgr._addLine(_line, insertTo);
                };
                PageListView.prototype.getPageBaseHeight = function() {
                    return $(window).height() - parseInt(this.$page.css("padding-top"), 10);
                };
                return PageListView;
            }(UI.PageView);
            UI.PageListView = PageListView;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    var CDP;
    (function(CDP) {
        var UI;
        (function(UI) {
            var TAG = "[CDP.UI.PageExpandableListView] ";
            var PageExpandableListView = function(_super) {
                __extends(PageExpandableListView, _super);
                function PageExpandableListView(url, id, options) {
                    _super.call(this, url, id, options);
                    this._expandManager = null;
                    this._expandManager = new UI.ExpandManager(this);
                }
                PageExpandableListView.prototype.newGroup = function(id) {
                    return this._expandManager.newGroup(id);
                };
                PageExpandableListView.prototype.getGroup = function(id) {
                    return this._expandManager.getGroup(id);
                };
                PageExpandableListView.prototype.registerTopGroup = function(topGroup) {
                    this._expandManager.registerTopGroup(topGroup);
                };
                PageExpandableListView.prototype.getTopGroups = function() {
                    return this._expandManager.getTopGroups();
                };
                PageExpandableListView.prototype.expandAll = function() {
                    this._expandManager.expandAll();
                };
                PageExpandableListView.prototype.collapseAll = function(delay) {
                    this._expandManager.collapseAll(delay);
                };
                PageExpandableListView.prototype.isExpanding = function() {
                    return this._expandManager.isExpanding();
                };
                PageExpandableListView.prototype.isCollapsing = function() {
                    return this._expandManager.isCollapsing();
                };
                PageExpandableListView.prototype.isSwitching = function() {
                    return this._expandManager.isSwitching();
                };
                Object.defineProperty(PageExpandableListView.prototype, "layoutKey", {
                    get: function() {
                        return this._expandManager.layoutKey;
                    },
                    set: function(key) {
                        this._expandManager.layoutKey = key;
                    },
                    enumerable: true,
                    configurable: true
                });
                PageExpandableListView.prototype.release = function() {
                    _super.prototype.release.call(this);
                    this._expandManager.release();
                };
                PageExpandableListView.prototype.backup = function(key) {
                    return this._expandManager.backup(key);
                };
                PageExpandableListView.prototype.restore = function(key, rebuild) {
                    if (rebuild === void 0) {
                        rebuild = true;
                    }
                    return this._expandManager.restore(key, rebuild);
                };
                return PageExpandableListView;
            }(UI.PageListView);
            UI.PageExpandableListView = PageExpandableListView;
        })(UI = CDP.UI || (CDP.UI = {}));
    })(CDP || (CDP = {}));
    return CDP.UI;
});

define("cdp/core/core", [ "require", "exports", "cdp.core" ], function(require, exports, _core) {
    "use strict";
    exports.global = _core.global;
    exports.initialize = _core.initialize;
    exports.webRoot = _core.webRoot;
});

define("cdp/core/promise", [ "require", "exports", "cdp.promise" ], function(require, exports, _promise) {
    "use strict";
    exports.makePromise = _promise.makePromise;
    exports.wait = _promise.wait;
    exports.PromiseManager = _promise.PromiseManager;
});

define("cdp/core/framework.jqm", [ "require", "exports", "cdp.framework.jqm" ], function(require, exports) {
    "use strict";
    exports.waitForDeviceReady = CDP.waitForDeviceReady;
    exports.setBackButtonHandler = CDP.setBackButtonHandler;
});

define("cdp/core", [ "require", "exports", "cdp/core/core", "cdp/core/promise", "cdp/core/framework.jqm" ], function(require, exports, core_1, promise_1, framework_jqm_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(core_1);
    __export(promise_1);
    __export(framework_jqm_1);
});

define("cdp/framework/jqm", [ "require", "exports", "cdp.framework.jqm" ], function(require, exports, _framework) {
    "use strict";
    exports.Patch = _framework.Patch;
    exports.Platform = _framework.Platform;
    exports.getOrientation = _framework.getOrientation;
    exports.toUrl = _framework.toUrl;
    exports.setBeforeRouteChangeHandler = _framework.setBeforeRouteChangeHandler;
    exports.Router = _framework.Router;
    exports.initialize = _framework.initialize;
    exports.isInitialized = _framework.isInitialized;
    exports.registerOrientationChangedListener = _framework.registerOrientationChangedListener;
    exports.unregisterOrientationChangedListener = _framework.unregisterOrientationChangedListener;
    exports.setupEventHandlers = _framework.setupEventHandlers;
    exports.setActivePage = _framework.setActivePage;
    exports.getDefaultClickEvent = _framework.getDefaultClickEvent;
    exports.Page = _framework.Page;
});

define("cdp/framework", [ "require", "exports", "cdp/framework/jqm" ], function(require, exports, jqm_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(jqm_1);
});

define("cdp/tools/tools", [ "require", "exports", "cdp.tools" ], function(require, exports, _tools) {
    "use strict";
    var Blob;
    (function(Blob) {
        Blob.arrayBufferToBlob = _tools.Blob.arrayBufferToBlob;
        Blob.base64ToBlob = _tools.Blob.base64ToBlob;
        Blob.base64ToArrayBuffer = _tools.Blob.base64ToArrayBuffer;
        Blob.base64ToUint8Array = _tools.Blob.base64ToUint8Array;
        Blob.arrayBufferToBase64 = _tools.Blob.arrayBufferToBase64;
        Blob.uint8ArrayToBase64 = _tools.Blob.uint8ArrayToBase64;
        Blob.URL = _tools.Blob.URL;
    })(Blob = exports.Blob || (exports.Blob = {}));
    exports.DateTime = _tools.DateTime;
    exports.abs = _tools.abs;
    exports.max = _tools.max;
    exports.min = _tools.min;
    exports.await = _tools.await;
    exports.toZeroPadding = _tools.toZeroPadding;
    exports.inherit = _tools.inherit;
    exports.mixin = _tools.mixin;
    exports.extend = _tools.extend;
    exports.getDevicePixcelRatio = _tools.getDevicePixcelRatio;
    exports.doWork = _tools.doWork;
    exports.Template = _tools.Template;
});

define("cdp/tools", [ "require", "exports", "cdp/tools/tools" ], function(require, exports, tools_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(tools_1);
});

define("cdp/ui/listview", [ "require", "exports", "cdp.ui.listview" ], function(require, exports, _ui) {
    "use strict";
    exports.ListViewGlobalConfig = _ui.ListViewGlobalConfig;
    exports.LineProfile = _ui.LineProfile;
    exports.GroupProfile = _ui.GroupProfile;
    exports.composeViews = _ui.composeViews;
    exports.deriveViews = _ui.deriveViews;
    exports.mixinViews = _ui.mixinViews;
    exports.StatusManager = _ui.StatusManager;
    exports.PageProfile = _ui.PageProfile;
    exports.ScrollerElement = _ui.ScrollerElement;
    exports.ScrollerNative = _ui.ScrollerNative;
    exports.ScrollerIScroll = _ui.ScrollerIScroll;
    exports.ListItemView = _ui.ListItemView;
    exports.ScrollManager = _ui.ScrollManager;
    exports.ListView = _ui.ListView;
    exports.GroupListItemView = _ui.GroupListItemView;
    exports.ExpandManager = _ui.ExpandManager;
    exports.ExpandableListView = _ui.ExpandableListView;
});

define("cdp/ui/jqm", [ "require", "exports", "cdp.ui.jqm" ], function(require, exports, _ui) {
    "use strict";
    var Toast;
    (function(Toast) {
        Toast.LENGTH_SHORT = _ui.Toast.LENGTH_SHORT;
        Toast.LENGTH_LONG = _ui.Toast.LENGTH_LONG;
        Toast.StyleBuilderDefault = _ui.Toast.StyleBuilderDefault;
        Toast.show = _ui.Toast.show;
    })(Toast = exports.Toast || (exports.Toast = {}));
    exports.Dialog = _ui.Dialog;
    exports.PageContainerView = _ui.PageContainerView;
    exports.PageView = _ui.PageView;
    exports.PageListView = _ui.PageListView;
    exports.PageExpandableListView = _ui.PageExpandableListView;
});

define("cdp/ui", [ "require", "exports", "cdp/ui/listview", "cdp/ui/jqm" ], function(require, exports, listview_1, jqm_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(listview_1);
    __export(jqm_2);
});

define("cdp", [ "require", "exports", "cdp/core", "cdp/framework", "cdp/tools", "cdp/ui" ], function(require, exports, core_2, Framework, Tools, UI) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(core_2);
    exports.Framework = Framework;
    exports.Tools = Tools;
    exports.UI = UI;
    exports.initialize = Framework.initialize;
});