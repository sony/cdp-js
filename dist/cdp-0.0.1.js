/*!
 * cdp.js 0.0.1
 *
 * Date: 2016-05-10T22:26:32+0900
 */
/*!
 * cdp.core.js 1.2.0-dev
 *
 * Date: 2016-04-06T19:14:39+0900
 */

((function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define('cdp.core',[],function () {
            return factory(root);
        });
    } else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(root);
    } else {
        // Browser globals
        factory(root);
    }
})(((this || 0).self || global), function (root) {

    var TAG = "[CDP] ";

    // "CDP" global exports.
    var CDP = root.CDP || (root.CDP = {});

    /**
     * \~english
     * @class Patch
     * @brief This class applies patch codes to 3rd party libraries for they works good with the others.
     *
     * \~japanese
     * @class Patch
     * @brief 外部ライブラリに Patch を当てるクラス
     */
    var Patch = (function () {
        function Patch() {
        }

        /**
         * \~english
         * Apply patch.
         *
         * \~japanese
         * パッチの適用
         */
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
                count: function () {
                },
                groupEnd: function () {
                },
                time: function () {
                },
                timeEnd: function () {
                },
                trace: function () {
                },
                group: function () {
                },
                dirxml: function () {
                },
                debug: function () {
                },
                groupCollapsed: function () {
                },
                select: function () {
                },
                info: function () {
                },
                profile: function () {
                },
                assert: function () {
                },
                msIsIndependentlyComposed: function () {
                },
                clear: function () {
                },
                dir: function () {
                },
                warn: function () {
                },
                error: function () {
                },
                log: function () {
                },
                profileEnd: function () {
                }
            };
        }

        function _nodePatch() {
            var originalAppendChild = Node.prototype.appendChild;
            Node.prototype.appendChild = function (node) {
                var _this = this;
                return MSApp.execUnsafeLocalFunction(function () {
                    return originalAppendChild.call(_this, node);
                });
            };

            var originalInsertBefore = Node.prototype.insertBefore;
            Node.prototype.insertBefore = function (newElement, referenceElement) {
                var _this = this;
                return MSApp.execUnsafeLocalFunction(function () {
                    return originalInsertBefore.call(_this, newElement, referenceElement);
                });
            };
        }

        Patch.apply = _apply;

        return Patch;
    })();

    /**
     * \~english
     * Get web root.
     *
     * \~japanese
     * web root を取得
     */
    var _webRoot = (function () {
        var dir = /.+\/(.+)\/[^/]*#[^/]+/.exec(location.href);
        if (!dir) {
            dir = /.+\/(.+)\//.exec(location.href);
        }
        return dir[0];
    })();

    /**
     * \~english
     * Initialization function of environment.
     *
     * @param options {CoreInitOptions} [in] init options.
     *
     * \~japanese
     * Framework の初期化関数
     * v1.2.0+ より options のコールバックに変更
     *
     * @param options {CoreInitOptions} [in] 初期化オプション.
     */
    function _init(options) {
        setTimeout(function () {
            try {
                Patch.apply();
                if (options && typeof options.success === 'function') {
                    options.success();
                }
            } catch (error) {
                var msg = (error && error.message) ? error.message : "initialize failed.";
                console.error(TAG + msg);
                if (options && typeof options.fail === 'function') {
                    options.fail(error);
                }
            }
        });
    }

    CDP.global = root;
    CDP.initialize = _init;
    CDP.webRoot = _webRoot;

    return CDP;
}));

/*!
 * cdp.promise.js 1.0.0-dev
 *
 * Date: 2016-04-06T19:41:04+0900
 */

/* tslint:disable:typedef */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define('cdp.promise',["jquery"], function ($) {
            return factory(root.CDP || (root.CDP = {}), $);
        });
    }
    else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"));
    }
    else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}), root.jQuery || root.$);
    }
}(((this || 0).self || global), function (CDP, $) {
    
var CDP;
(function (CDP) {
    var TAG = "[CDP.Promise] ";
    /**
     * Promise オブジェクトの作成
     * jQueryDeferred オブジェクトから、Tools.Promise オブジェクトを作成する
     *
     * @param df {JQueryDeferred} [in] jQueryDeferred instance を指定
     * @param options? {Object}   [in] jQueryPromise を拡張するオブジェクトを指定
     * @return {IPromise} Tools.IPromise オブジェクト
     */
    function makePromise(df, options) {
        var _abort = function (info) {
            var detail = info ? info : { message: "abort" };
            if (null != this.dependency) {
                if (this.dependency.abort) {
                    this.dependency.abort(detail);
                }
                else {
                    console.error(TAG + "[call] dependency object doesn't have 'abort()' method.");
                }
                if (this.callReject && "pending" === this.state()) {
                    df.reject(detail);
                }
            }
            else if ("pending" === this.state()) {
                df.reject(detail);
            }
        };
        var _dependOn = function (promise) {
            var _this = this;
            if (promise.abort) {
                this.dependency = promise;
                promise
                    .always(function () {
                    _this.dependency = null;
                });
            }
            else {
                console.error(TAG + "[set] dependency object doesn't have 'abort()' method.");
            }
            return promise;
        };
        var target = $.extend({}, {
            dependency: null,
            callReject: false,
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
        // 投入法が可変引数だった場合は配列に修正する
        var _deferreds = [].concat.apply([], deferreds);
        // 実際の作業
        var df = $.Deferred();
        var results = [];
        var initialized = false;
        var isFinished = function () {
            if (!initialized) {
                return false;
            }
            else {
                return !results.some(function (element) {
                    return "pending" === element.status;
                });
            }
        };
        _deferreds.forEach(function (deferred, index) {
            results.push({
                status: "pending",
                args: null,
            });
            deferred
                .then(function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                results[index].status = "resolved";
                results[index].args = args;
            }, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                results[index].status = "rejected";
                results[index].args = args;
            })
                .always(function () {
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
    /**
     * @class PromiseManager
     * @brief 複数の DataProvider.Promise を管理するクラス
     */
    var PromiseManager = (function () {
        function PromiseManager() {
            this._pool = [];
            this._id = 0;
        }
        PromiseManager.prototype.add = function (promise) {
            var _this = this;
            if (promise == null) {
                return null;
            }
            // abort() を持っていない場合はエラー
            if (!promise.abort) {
                console.error(TAG + "[add] promise object doesn't have 'abort()' method.");
                return promise;
            }
            var cookie = {
                promise: promise,
                id: this._id++,
            };
            this._pool.push(cookie);
            promise
                .always(function () {
                _this._pool = _this._pool.filter(function (element) {
                    if (element.id !== cookie.id) {
                        return true;
                    }
                    else {
                        return false;
                    }
                });
            });
            return promise;
        };
        /**
         * 管理対象の Promise に対して abort を発行
         * キャンセル処理に対するキャンセルは不可
         *
         * @return {jQueryPromise}
         */
        PromiseManager.prototype.cancel = function (info) {
            var promises = this.promises();
            promises.forEach(function (element) {
                if (element.abort) {
                    element.abort(info);
                }
            });
            return wait.apply(null, promises);
        };
        /**
         * 管理対象の Promise を配列で返す
         *
         * @return {Promise[]}
         */
        PromiseManager.prototype.promises = function () {
            return this._pool.map(function (element) {
                return element.promise;
            });
        };
        return PromiseManager;
    }());
    CDP.PromiseManager = PromiseManager;
})(CDP || (CDP = {}));

    return CDP;
}));

/*!
 * cdp.framework.jqm.js 1.2.0-dev
 *
 * Date: 2016-04-26T19:31:53+0900
 */

/* tslint:disable:typedef */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define('cdp.framework.jqm',["cdp.core", "cdp.promise", "backbone"], function () {
            return factory(root.CDP || (root.CDP = {}));
        });
    }
    else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}));
    }
}(this, function (CDP) {
    CDP.Framework = CDP.Framework || {};
    /* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var Framework;
    (function (Framework) {
        /**
         * platform 判定オブジェクト
         * [参考] https://w3g.jp/blog/tools/js_browser_sniffing
         */
        Framework.Platform = (function () {
            var ua = navigator.userAgent.toLowerCase();
            var majorVersion = function (browser) {
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
                Android: (ua.indexOf("android") !== -1),
                iOS: (ua.indexOf("iphone") !== -1 || ua.indexOf("ipad") !== -1 || ua.indexOf("ipod") !== -1),
            };
        })();
    })(Framework = CDP.Framework || (CDP.Framework = {}));
})(CDP || (CDP = {}));



/* tslint:disable:typedef */
var CDP;
(function (CDP) {
    var Framework;
    (function (Framework) {
        /**
         * vclick patch
         */
        var _vclickPatch = function () {
            var jquery_on = $.fn.on, jquery_off = $.fn.off;
            var custom_on = function (types, selector, data, fn, /*INTERNAL*/ one) {
                if (typeof types === "string") {
                    types = types.replace(/vclick/g, "click");
                }
                return _.bind(jquery_on, this)(types, selector, data, fn, one);
            };
            var custom_off = function (types, selector, fn) {
                if (typeof types === "string") {
                    types = types.replace(/vclick/g, "click");
                }
                return _.bind(jquery_off, this)(types, selector, fn);
            };
            // replace functions.
            $.fn.on = custom_on;
            $.fn.off = custom_off;
        };
        //___________________________________________________________________________________________________________________//
        /**
         * @class Patch
         * @brief patch class for jqm framework.
         *       [review] vclick のパッチを当てることがわかるとよい
         */
        var Patch = (function () {
            function Patch() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static methods
            /**
             * \~english
             * Apply patch.
             *
             * \~japanese
             * パッチの適用
             */
            Patch.apply = function () {
                if (!Patch.isSupportedVclick()) {
                    _vclickPatch();
                    Patch.s_vclickEvent = "click";
                }
            };
            /**
             * \~english
             * if "vclick" event is unsupported, returns false. ex: Android 4.4 (Kitkat)
             *
             * \~japanese
             * "vclick" event が非サポートである platform (KitKat) は false を返す。
             * jQM の version up により、解決される場合は無効かする。
             */
            Patch.isSupportedVclick = function () {
                // for Android 4.4+ (Kitkat ～)
                if (Framework.Platform.Android && !Framework.Platform.ltAd4_4) {
                    return false;
                }
                return true;
            };
            Patch.s_vclickEvent = "vclick";
            return Patch;
        }());
        Framework.Patch = Patch;
    })(Framework = CDP.Framework || (CDP.Framework = {}));
})(CDP || (CDP = {}));

var CDP;
(function (CDP) {
    var Framework;
    (function (Framework) {
        /**
         * @enum Orientation
         */
        (function (Orientation) {
            Orientation[Orientation["PORTRAIT"] = 0] = "PORTRAIT";
            Orientation[Orientation["LANDSCAPE"] = 1] = "LANDSCAPE";
        })(Framework.Orientation || (Framework.Orientation = {}));
        var Orientation = Framework.Orientation;
        /**
         * \~english
         * Get Orientation enum code
         *
         * @return {Number} Orientation Code.
         *
         * \~japanese
         * Orientation の取得
         *
         * @return {Number} Orientation Code.
         */
        function getOrientation() {
            var $window = $(window);
            return ($window.width() < $window.height()) ? Orientation.PORTRAIT : Orientation.LANDSCAPE;
        }
        Framework.getOrientation = getOrientation;
    })(Framework = CDP.Framework || (CDP.Framework = {}));
})(CDP || (CDP = {}));











/* tslint:disable:max-line-length no-string-literal */
var CDP;
(function (CDP) {
    var Framework;
    (function (Framework) {
        ///////////////////////////////////////////////////////////////////////
        // closure methods
        /**
         * \~english
         * Convert path to URL.
         * If the path starts from "/", the function translate the path as child folder of "web root".
         * Otherwise, it interprets as relative path from current page.
         * [Note] This behavior go along with jQM, NOT with require.toUrl().
         *
         * @param path {String} [in] path string
         *
         * \~japanese
         * path を URL に変換
         * "/" から始まるものは web root から、それ以外は現在のページから絶対パスURLに変換する。
         * jQM の挙動にあわせており、require.toUrl() と異なるので注意。
         *
         * @param path {String} [in] パスを指定。
         */
        function toUrl(path) {
            if (null != path[0] && "/" === path[0]) {
                return CDP.webRoot + path.slice(1);
            }
            else {
                return $.mobile.path.makeUrlAbsolute(path, getCurrentDocumentUrl());
            }
        }
        Framework.toUrl = toUrl;
        /**
         * \~english
         * Get current document url.
         *
         * @private
         *
         * \~japanese
         * 現在表示しているドキュメントの URL を取得
         *
         * @private
         */
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
        /**
         * \~english
         * Default "before route change" handler.
         *
         * @private
         *
         * \~japanese
         * 既定の "before route change" ハンドラ
         *
         * @private
         */
        var _beforeRouteChange = function () {
            return $.Deferred().resolve().promise();
        };
        // default "before route change" hanndler
        var _defaultBeforeRouteChange = _beforeRouteChange;
        /**
         * \~english
         * Setup "before route change" handler.
         *
         * @param  {Function} handler function.
         * @return {Function} old handler function.
         *
         * \~japanese
         * "before route change" ハンドラ設定
         *
         * @param  {Function} handler 指定.
         * @return {Function} 以前の handler.
         */
        function setBeforeRouteChangeHandler(handler) {
            if (null == handler) {
                return _beforeRouteChange;
            }
            else {
                var oldHandler = _beforeRouteChange;
                _beforeRouteChange = handler;
                return oldHandler;
            }
        }
        Framework.setBeforeRouteChangeHandler = setBeforeRouteChangeHandler;
        //___________________________________________________________________________________________________________________//
        /**
         * \~english
         * @class Router
         * @brief Router class for adjusting jQueryMobile functions and Backbone.Router functions.
         *        Even if Backbone.Router does not start routing, natigate() method works good with jQM framework.
         *
         * \~japanese
         * @class Router
         * @brief jQueryMobile と Backbone.Router を調停する Router クラス
         *        ルーティングを開始していない場合にも、navigate() は jQM フレームワークを使用して機能する。
         */
        var Router = (function () {
            function Router() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static methods
            /**
             * \~english
             * for initialize Router. this function is called in framework.
             *
             * @return {Boolean} true: succeeded / false: failed.
             *
             * \~japanese
             * 初期化
             * この関数はフレームワーク内部で使用される。
             *
             * @param  options {Object} [in] オプション
             * @return {Boolean} 成否
             */
            Router.initialize = function (options) {
                var $body = $("body");
                if (!!Router.s_router) {
                    console.warn("logic error. initialize call twice.");
                    return false;
                }
                Router.s_initOptions = $.extend({}, Router.s_defaultInitOptions, options);
                // Backbone.Router が、route を解決できなかった場合にも通知を捕捉するためのコールバックを設定
                Router.s_loadUrl = _.bind(Backbone.history.loadUrl, Backbone.history);
                Backbone.history.loadUrl = Router.customLoadUrl;
                Router.s_router = new Backbone.Router();
                Router.s_router.on("route", Router.onRouteSucceeded);
                // Backbone.Router を使用している場合、$.mobile.back() の挙動をブラウザの[戻る]に統一
                if (!$.mobile.hashListeningEnabled) {
                    Router.s_back = _.bind($.mobile.back, $.mobile);
                    $.mobile.back = Router.customJqmBack;
                }
                // changePage をサポート
                if (null == $.mobile.changePage) {
                    $.mobile.changePage = function (to, options) {
                        $body.pagecontainer("change", to, options);
                    };
                }
                Router.bindEvents();
                // Framework のイベントハンドラを更新
                Framework.setupEventHandlers();
                return true;
            };
            /**
             * \~english
             * Register to Router.
             *
             * @param route    {String}   [in] route string, it can be regular expression.
             * @param page     {String}   [in] page template path.
             * @param top      {Boolean}  [in] set "true" if application's top view. (optional)
             * @param callback {Function} [in] callback for custom page transition. If you don't want to trigger jQM.changePage(), return true by this callback. (optional)
             * @return {Router} Router instance.
             *
             * \~japanese
             * 登録
             *
             * @param route    {String}   [in] ルーティング文字列 / 正規表現
             * @param page     {String}   [in] page template path. イベント名にも使用される
             * @param top      {Boolean}  [in] Top ページの場合は true を指定 (任意)
             * @param callback {Function} [in] 遷移を自身で管理する場合に指定し、戻り値を true に設定すると changePage をコールしない (任意)
             * @return {Router} インスタンス。ただし method chain をしたい場合は、any cast が必要。
             */
            Router.register = function (route, page, top, callback) {
                if (top === void 0) { top = false; }
                // Backbone.Router への登録は history の停止が必要
                var restart = Router.stop();
                var name = route + page;
                var context = {
                    route: route,
                    regexp: Router.s_router._routeToRegExp(route),
                    page: page,
                    top: top,
                    callback: callback || function () { return false; }
                };
                if (Router.pushContext(name, context)) {
                    Router.s_router.route(route, name, function () { });
                }
                if (restart) {
                    // 再開時は再読み込みしない。
                    Router.start({ silent: true });
                }
                return Router;
            };
            /**
             * \~english
             * Start listening hash change.
             * It should be called after register().
             *
             * @param options {Object} [in] options object for Backbone.History.
             *
             * \~japanese
             * 履歴監視の開始
             * 登録完了後に呼び出す。
             *
             * @param options {Object} [in] Backbone.History にわたるオプション
             */
            Router.start = function (options) {
                if ($.mobile.hashListeningEnabled) {
                    console.log("setting error. confict: $.mobile.hashListeningEnabled = true, cannot start.");
                    return false;
                }
                return Backbone.history.start(options);
            };
            /**
             * \~english
             * Stop listening hash change.
             *
             * @return {Boolean} previous status.
             *
             * \~japanese
             * 履歴監視の終了
             *
             * @return {Boolean} 以前の開始状態を返却
             */
            Router.stop = function () {
                var prevState = Backbone.History.started;
                Backbone.history.stop();
                return prevState;
            };
            /**
             * \~english
             * Check routing status.
             *
             * @return {Boolean} true: routing / false: not routing
             *
             * \~japanese
             * ルーティングを開始しているか判定
             *
             * @return {Boolean} true: 有効 / false: 無効
             */
            Router.isRouting = function () {
                return Backbone.History.started;
            };
            /**
             * \~english
             * URL navigation.
             *
             * @param url        {String}          [in] set a navigate URL. (relative path / absolute path / fragment)
             * @param transition {String}          [in] set a transition string (optional)
             * @param reverse    {Boolean}         [in] set a direction string for transition. true:reverse / false:nomal (optional)
             * @param options    {NavigateOptions} [in] set a options object for Backbone.Router.navigate(). (optional)
             *
             * \~japanese
             * URL遷移
             *
             * @param url        {String}          [in] 遷移 URL を指定 (相対パス/絶対パス/フラグメント)
             * @param transition {String}          [in] transition に使用する effect を指定 (任意)
             * @param reverse    {Boolean}         [in] transition に使用する direction を指定 true:reverse/false:通常 (任意)
             * @param options    {NavigateOptions} [in] Backbone.Router.navigate() に渡されるオプション (任意)
             */
            Router.navigate = function (url, transition, reverse, options) {
                if (!!Router.s_lastNavigateInfo.inNavigation) {
                    // すでに Navigation 中であれば抑止
                    console.log("Router.navigate() called in navigation proc.");
                    return;
                }
                else if (Router.initFirstPageIfNeeded(url)) {
                    return;
                }
                var navOptions = $.extend({}, Router.s_defaultNavigateOptions, options);
                // ページ遷移開始通知. Sub Flow にてすでにコールされている場合は既定の何もしないコールバックを使用する.
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
                    inNavigation: true,
                };
                // ページ遷移開始通知
                notifyBeforeRouteChange()
                    .fail(function () {
                    // beforeRouteChange() が失敗した場合、致命的な不具合となるため、error 記録のみにして先に進む。
                    console.error("before route change call, failed.");
                })
                    .always(function () {
                    if (Router.isRouting() && !Router.s_lastNavigateInfo.noHashChange) {
                        if (navOptions.subFlow) {
                            switch (navOptions.subFlow.operation) {
                                case "begin":
                                    Router.beginSubFlow(navOptions.subFlow);
                                    break;
                                case "end":
                                    Router.endSubFlow(navOptions);
                                    return; // navigation は呼ばない
                                default:
                                    console.warn("unknown subFlow.operation. operation: " + navOptions.subFlow.operation);
                                    break;
                            }
                        }
                        Router.s_router.navigate(url, navOptions);
                    }
                    else {
                        (function () {
                            var fragment = Backbone.history.getFragment(url);
                            var context;
                            if (Router.s_lastNavigateInfo.noHashChange) {
                                // noHashChange が指定されたとき
                                context = _.find(Router.s_rootContexts, function (context) {
                                    return context.regexp.test(fragment);
                                });
                            }
                            else {
                                // Backbone.Router が有効でないとき
                                context = _.findWhere(Router.s_rootContexts, { route: fragment });
                            }
                            if (context) {
                                url = context.page;
                            }
                        })();
                        Router.changePage(url);
                    }
                });
            };
            /**
             * \~english
             * Back to previous history.
             * It's same as browser back button's behaviour.
             * [Note] If set the jQM: data-rel="back", work as well.
             *
             * \~japanese
             * 履歴を戻る
             * ブラウザの戻るボタンと同じ挙動。
             * jQM: data-rel="back" を指定しても同じであることに注意。
             */
            Router.back = function () {
                if (!!Router.s_lastNavigateInfo.inNavigation) {
                    // すでに Navigation 中であれば抑止
                    console.log("Router.back() called in navigation proc.");
                    return;
                }
                else if (Router.isTopPage()) {
                    // Top ページに指定されていれば終了
                    var app = navigator.app || {};
                    if (!!app.exitApp) {
                        app.exitApp(); // note: never exit on iOS 
                        return;
                    }
                }
                Router.s_lastNavigateInfo = {
                    inNavigation: true,
                    calledBeforeRouteChange: true,
                };
                // ページ遷移開始通知
                _beforeRouteChange()
                    .then(function () {
                    $.mobile.back();
                })
                    .fail(function () {
                    console.error("before route change call, failed.");
                    Router.s_lastNavigateInfo = {};
                });
            };
            /**
             * \~english
             * Store Intent object.
             *
             * \~japanese
             * Intent を格納
             */
            Router.pushIntent = function (intent) {
                Router.s_lastIntent = $.extend({}, Router.s_lastIntent, intent);
            };
            /**
             * \~english
             * Get Intent object.
             *
             * \~japanese
             * Intent を取得
             */
            Router.popIntent = function () {
                var intent = Router.s_lastIntent;
                Router.s_lastIntent = {};
                return intent;
            };
            /**
             * \~english
             * Get query parameters.
             *
             * \~japanese
             * query parameter に指定された引数の取得
             * ページ遷移中にのみアクセス可能 (pagebeforecreate ～ pagechange)
             */
            Router.getQueryParameters = function () {
                if (Router.s_lastNavigateInfo.intent && Router.s_lastNavigateInfo.intent.params) {
                    return Router.s_lastNavigateInfo.intent.params["queryParams"];
                }
                else {
                    return null;
                }
            };
            /**
             * \~english
             * Check in sub flow.
             *
             * \~japanese
             * sub flow 内であるか判定
             */
            Router.isInSubFlow = function () {
                var stack = Router.getJqmHistory().stack;
                var has = _.some(stack, function (value) {
                    return !!value[Router.SUBFLOW_PARAM];
                });
                return has;
            };
            /**
             * \~english
             * Check from hash changed navigation.
             *
             * \~japanese
             * Hash 変更によって Navigate が起こったか判定
             * "pagechange" が発生するまでに判定可能
             */
            Router.fromHashChanged = function () {
                // positiveNavigate = false は含めない
                return Router.s_lastNavigateInfo.inNavigation && (null == Router.s_lastNavigateInfo.positiveNavigate);
            };
            Router.registerPageStack = function (pageStack, withNavigate, options) {
                var newStacks = [];
                var failed = false;
                pageStack = (pageStack instanceof Array) ? pageStack : [pageStack];
                withNavigate = (null == withNavigate) ? false : withNavigate;
                (function () {
                    var makeStack = function (info) {
                        var url;
                        var stack;
                        var fragment = Backbone.history.getFragment(info.route);
                        var context = _.find(Router.s_rootContexts, function (context) {
                            return context.regexp.test(fragment);
                        });
                        if (!context) {
                            console.warn("route is not registered. route: " + info.route);
                            return null;
                        }
                        else {
                            url = Router.pathToJqmDataUrl(context.page);
                        }
                        stack = {
                            route: info.route,
                            pageUrl: url,
                            title: info.title,
                            transition: info.transition,
                            url: url,
                        };
                        return stack;
                    };
                    for (var i = 0, n = pageStack.length; i < n; i++) {
                        var stack = makeStack(pageStack[i]);
                        if (!stack) {
                            failed = true;
                            break;
                        }
                        else {
                            newStacks.push(stack);
                        }
                    }
                })();
                if (failed) {
                    return false;
                }
                (function () {
                    // Router の停止
                    var restart = Router.stop();
                    var silentLength = newStacks.length - 1;
                    var finalIndex = newStacks.length - 1;
                    Router.getJqmHistory().clearForward();
                    for (var i = 0, n = silentLength; i < n; i++) {
                        location.hash = newStacks[i].route;
                        Router.getJqmHistory().stack.push(newStacks[i]);
                        Router.getJqmHistory().activeIndex = Router.getJqmHistory().stack.length - 1;
                    }
                    // final stack with navigate
                    if (withNavigate) {
                        restart = false;
                        Router.start({ silent: true });
                        Router.navigate(newStacks[finalIndex].route, newStacks[finalIndex].transition, false, options);
                    }
                    else {
                        location.hash = newStacks[finalIndex].route;
                        Router.getJqmHistory().stack.push(newStacks[finalIndex]);
                        Router.getJqmHistory().activeIndex = Router.getJqmHistory().stack.length - 1;
                    }
                    // Router の再開
                    if (restart) {
                        Router.start({ silent: true });
                    }
                })();
                return true;
            };
            ///////////////////////////////////////////////////////////////////////
            // private static methods
            /**
             * \~english
             * Override: Backbone.History.loadUrl().
             *
             * @private
             *
             * \~japanese
             * Backbone.History.loadUrl() のオーバーライド
             *
             * @private
             */
            Router.customLoadUrl = function (fragment) {
                var handled = Router.s_loadUrl(fragment);
                if (!handled) {
                    Router.onRouteFailed(fragment);
                }
                return handled;
            };
            /**
             * \~english
             * Override: $.mobile.back().
             *
             * fail safe processing.
             *  If using Backbone's Router,
             *  this class unuses history object of jQuery Mobile 1.4,
             *  and standardize as browser back button's behaviour. (jQM 1.3 comparable)
             *
             * @private
             *
             * \~japanese
             * $.mobile.back() のオーバーライド
             *
             * [TBD] fail safe 処理
             *  Backbone の Router を使用している場合、
             *  jQuery Mobile 1.4 以降の内部の History 管理は使用せずに
             *  1.3 相当のブラウザの[戻る]の挙動に統一する。
             *
             * @private
             */
            Router.customJqmBack = function () {
                if (Router.isRouting()) {
                    history.back();
                }
                else {
                    // jQM 既定処理
                    Router.s_back();
                }
            };
            /**
             * \~english
             * Bind events.
             *
             * @private
             *
             * \~japanese
             * イベントバインド
             *
             * @private
             */
            Router.bindEvents = function () {
                $(document)
                    .one("pagechange", function () {
                    if (Router.s_initOptions.anchorVclick) {
                        // anchor vclick
                        $(document).on("vclick", "[href]", function (event) {
                            Router.onAnchorVclicked(event);
                        });
                    }
                })
                    .on("pagebeforeshow", function (event) {
                    // "data-back-dst" を page に設定
                    if (null != Router.s_lastNavigateInfo.backDestination) {
                        var active = Router.getJqmHistory().getActive();
                        active[Router.BACK_DESTINATION_URL] = Router.s_lastNavigateInfo.backDestination;
                    }
                })
                    .on("pageshow", function (event) {
                    var active = Router.getJqmHistory().getActive();
                    if (active[Router.SUBFLOW_PARAM]) {
                        delete active[Router.SUBFLOW_PARAM];
                    }
                })
                    .on("pagechange pagecontainerloadfailed", function (event) {
                    Router.s_lastNavigateInfo = {};
                });
                // back key assign
                CDP.setBackButtonHandler(Router.back);
            };
            /**
             * \~english
             * Store the RootContext.
             *
             * @private
             * @param name    {String}       [in] name of route
             * @param context {RouteContext} [in] context object
             * @return true: succeeded / false: already registered
             *
             * \~japanese
             * RootContext の格納
             *
             * @private
             * @param name    {String}       [in] route 名
             * @param context {RouteContext} [in] context オブジェクト
             * @return true: 登録成功 / false: すでに登録されている
             */
            Router.pushContext = function (name, context) {
                if (!!Router.s_rootContexts[name]) {
                    console.log("logic error. route is already registered. name: " + name);
                    return false;
                }
                Router.s_rootContexts[name] = context;
                return true;
            };
            /**
             * \~english
             * Check if $.mobile.initializePage() is called or not, and call it if needed.
             *
             * @private
             * @param url {String}  [in] set a navigate URL. (relative path / absolute path / fragment)
             *
             * \~japanese
             * $.mobile.initializePage() が呼ばれているか確認し、必要なら初期化する。
             *
             * @private
             * @param url {String} [in] 遷移 URL を指定 (相対パス/絶対パス/フラグメント)
             */
            Router.initFirstPageIfNeeded = function (url) {
                if (!$.mobile.autoInitializePage) {
                    $(document).one("pagebeforechange", function (event, data) {
                        data.toPage = Framework.toUrl(url);
                    });
                    $.mobile.initializePage();
                    $.mobile.autoInitializePage = true;
                    return true;
                }
                return false;
            };
            /**
             * \~english
             * Check for current page is top.
             *
             * @private
             * @return true: top page / false: not top page
             *
             * \~japanese
             * 現在のページが top に指定されているか判定
             *
             * @private
             * @return true: top 指定 / false: top ではない
             */
            Router.isTopPage = function () {
                var fragment = Backbone.history.getFragment($.mobile.path.parseUrl(location.href).hash);
                var context = _.find(Router.s_rootContexts, function (context) {
                    return context.regexp.test(fragment);
                });
                return (null == context) ? false : context.top;
            };
            /**
             * \~english
             * Called when anchor received "vclick" event.
             *
             * @private
             * @return true: need default processing / false: need custom processing
             *
             * \~japanese
             * anchor が vclick されたときにコールされる
             *
             * @private
             * @return true: default 処理 / false: カスタム処理
             */
            Router.onAnchorVclicked = function (event) {
                if (Router.isJustBeforeVclicked()) {
                    event.preventDefault();
                    return false;
                }
                return Router.followAnchor(event);
            };
            /**
             * \~english
             * Anchor processing.
             *
             * @private
             *
             * \~japanese
             * anchor 処理
             *
             * @private
             */
            Router.followAnchor = function (event) {
                var $target = $(event.currentTarget);
                var url = $target.jqmData("href") || $target.attr("href");
                var transition = $target.jqmData("transition");
                var direction = $target.jqmData("direction");
                var backDst = $target.attr(Router.DATA_BACK_DESTINATION);
                var noHashChange = $target.attr(Router.DATA_NO_HASH_CHANGE) ?
                    $target.attr(Router.DATA_NO_HASH_CHANGE) === "true" : false;
                var noHrefHandle = $target.attr(Router.DATA_NO_VCLICK_HANDLE) ?
                    $target.attr(Router.DATA_NO_VCLICK_HANDLE) === "true" : false;
                /*
                 * - 明示的にハンドルしない指定がある場合
                 * - jQM のフラグメントの場合
                 * 既定の処理を行う
                 */
                if (noHrefHandle || Router.needDefaultOperation(url)) {
                    return true;
                }
                // custom behavier
                event.preventDefault();
                if (Router.isBackButtonClicked(event)) {
                    Router.back();
                }
                else {
                    Router.navigate(url, transition, !!direction, { noHashChange: noHashChange, backDestination: backDst });
                }
                return false;
            };
            /**
             * \~english
             * Check default processing needed.
             *
             * @private
             * @param  url {String} [in] url string
             * @return true: need default processing / false: need not
             *
             * \~japanese
             * 既定の処理を行わせるか判定
             *
             * @private
             * @param  url {String} [in] url 文字列
             * @return true: 既定の処理が必要 / false: 不要
             */
            Router.needDefaultOperation = function (url) {
                if (!url || ("#" === url)) {
                    return true;
                }
                else if ("#" === url[0]) {
                    return !Router.canResolveRoute(url);
                }
                else {
                    return false;
                }
            };
            /**
             * \~english
             * Check status of Backbone.Router if they can resolve route.
             *
             * @private
             * @param  url {String} [in] url 文字列
             * @return true: can resolve / false: can not
             *
             * \~japanese
             * Backbone.Router が route を解決可能か判定
             *
             * @private
             * @param  url {String} [in] url 文字列
             * @return true: 解決可能 / false: 解決不可
             */
            Router.canResolveRoute = function (url) {
                var fragment = Backbone.history.getFragment(url);
                return _.any(Backbone.history.handlers, function (handler) {
                    if (handler.route.test(fragment)) {
                        return true;
                    }
                });
            };
            /**
             * \~english
             * Check "vclick" fired at the last minute.
             *
             * @private
             *
             * \~japanese
             * 直前に vclick が呼ばれたか判定
             *
             * @private
             */
            Router.isJustBeforeVclicked = function () {
                var isBefore = (Date.now() - Router.s_lastClickedTime) < Router.DELAY_TIME * 2;
                Router.s_lastClickedTime = Date.now();
                return isBefore;
            };
            /**
             * \~english
             * Check back button clicked.
             *
             * @private
             *
             * \~japanese
             * Back Button がクリックされたか判定
             *
             * @private
             */
            Router.isBackButtonClicked = function (event) {
                if ($(event.currentTarget).jqmData("rel") === "back") {
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
             * \~english
             * It called on succeed routing triggered by changing hash.
             *
             * @private
             * @param name {String} [in] name of route
             * @param args {Array}  [in] array of paramter
             *
             * \~japanese
             * ハッシュ値が変更され、ルーティングが成功したときにコールされる
             *
             * @private
             * @param name {String} [in] route 名。page の値が渡る。
             * @param args {Array}  [in] パラメータ配列。
             */
            Router.onRouteSucceeded = function (name) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                var context = Router.s_rootContexts[name];
                if (!!context) {
                    var intent = { params: { queryParams: args } };
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
            /**
             * \~english
             * It called on failed routing triggered by changing hash.
             *
             * @private
             * @param name {String} [in] name of route
             * @param args {Array}  [in] array of paramter
             *
             * \~japanese
             * ハッシュ値が変更され、ルーティングが失敗したときにコールされる
             *
             * @private
             * @param name {String} [in] route 名。page の値が渡る。
             * @param args {Array}  [in] パラメータ配列。
             */
            Router.onRouteFailed = function (fragment) {
                Router.s_lastNavigateInfo.inNavigation = true;
                if (null == fragment) {
                    fragment = Backbone.history.getFragment();
                }
                // route が解決できなかったものを管理下に
                if (Router.s_lastNavigateInfo.positiveNavigate) {
                    var context = Router.s_rootContexts[fragment];
                    if (null == context) {
                        context = {
                            route: fragment,
                            regexp: Router.s_router._routeToRegExp(fragment),
                            page: Router.s_lastNavigateInfo.url,
                            top: false,
                            callback: null,
                        };
                        Router.pushContext(fragment, context);
                    }
                }
                // fragment から path を解決
                var path = fragment;
                if (null != Router.s_rootContexts[fragment]) {
                    path = Router.s_rootContexts[fragment].page;
                }
                Router.changePage(path);
            };
            /**
             * \~english
             * This function just calls jQuery Mobile's navigation method.
             *
             * @private
             * @param path {String} [in] to page path
             *
             * \~japanese
             * jQuery Mobile によるページ遷移指定
             *
             * @private
             * @param path {String} [in] 遷移先パスを指定
             */
            Router.changePage = function (path) {
                var notifyBeforeRouteChange;
                // data-rel="back", ブラウザボタン, H/W Back Key が押下されたとき
                if (!Router.s_lastNavigateInfo.positiveNavigate) {
                    if (Router.s_lastNavigateInfo.inAdditionalBack) {
                        Router.s_lastNavigateInfo.inAdditionalBack = false;
                    }
                    else {
                        Router.decideDirection(path);
                        // 指定先に戻るか判定
                        var additional = Router.detectAdditionalBackDistance();
                        if (0 < additional) {
                            // 2回目以降の hash change には反応させない.
                            Router.s_lastNavigateInfo.inAdditionalBack = true;
                            Router.getJqmHistory().activeIndex -= additional;
                            history.go(-additional);
                            return;
                        }
                    }
                    // 遷移先が subflow 開始点である場合、param を削除
                    var subFlowInfo = Router.detectSubFlowBaseInfo();
                    if (subFlowInfo.isCurrent) {
                        delete subFlowInfo.stack[Router.SUBFLOW_PARAM];
                    }
                }
                // ページ遷移開始通知. すでにコールされている場合は既定の何もしないコールバックを使用する.
                notifyBeforeRouteChange = Router.s_lastNavigateInfo.calledBeforeRouteChange ? _defaultBeforeRouteChange : _beforeRouteChange;
                notifyBeforeRouteChange()
                    .then(function () {
                    // 付加情報
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
                        changeHash: !Router.s_lastNavigateInfo.noHashChange,
                    });
                })
                    .fail(function () {
                    console.error("before route change call, failed.");
                    Router.s_lastNavigateInfo = {};
                });
            };
            /**
             * \~english
             * Decide direction parameter.
             * It's as same as jQM internal implement. (imperfection)
             *
             * @private
             * @param path {String} [in] to page path
             *
             * \~japanese
             * direction の判定
             * jQM の内部実装と等価 (不完全)
             *
             * @private
             * @param path {String} [in] 遷移先パスを指定
             */
            Router.decideDirection = function (path) {
                Router.s_lastNavigateInfo.transition = Router.getJqmHistory().getActive().transition;
                var url = $.mobile.path.convertUrlToDataUrl(Framework.toUrl(path));
                Router.getJqmHistory().direct({
                    url: url,
                    present: function (newPage, direction) {
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
                    missing: function () {
                        // 初期ページ URL は判定できない。正常系。
                        if (1 === Router.getJqmHistory().activeIndex) {
                            Router.getJqmHistory().previousIndex = 1;
                            Router.getJqmHistory().activeIndex = 0;
                            Router.s_lastNavigateInfo.reverse = true;
                        }
                        else if (0 !== Router.getJqmHistory().activeIndex) {
                            console.log("unknown direction.");
                        }
                    }
                });
            };
            /**
             * \~english
             * Return additional back distance count when back destination set.
             * (const function)
             *
             * @private
             * @return {Number} count of additiona back distance.
             *
             * \~japanese
             * 戻り先が指定されているとき、追加の Back 数を返します。
             * (この関数は Router の状態を変更しません。)
             *
             * @private
             * @return {String} 追加で Back に必要な距離.
             */
            Router.detectAdditionalBackDistance = function () {
                var stack = Router.getJqmHistory().stack;
                var historyActiveIndex = Router.getJqmHistory().activeIndex; // decideDirection() の Router.getJqmHistory().direct() によって、history の activeIndex はすでに変わっている
                var previousIndex = Router.getJqmHistory().previousIndex; // [戻る]が押下された場合、必ず有効な値が入る
                var i, backDst, distance, fragment, context, jqmDataUrl;
                // check "back operation".
                if (!Router.s_lastNavigateInfo.reverse || null == previousIndex) {
                    return 0;
                }
                // "backDst exists".
                backDst = stack[previousIndex][Router.BACK_DESTINATION_URL];
                if ((null == backDst)) {
                    return 0;
                }
                fragment = Backbone.history.getFragment(backDst);
                // 初期ページ
                if ("" === fragment) {
                    return historyActiveIndex;
                }
                // rootContext から path を逆引き
                context = _.find(Router.s_rootContexts, function (context) {
                    return context.regexp.test(fragment);
                });
                if (null == context) {
                    console.warn("back destination is not registered. back-dst: " + backDst);
                    return 0;
                }
                // dataUrl を元に jQM History を検索
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
            /**
             * \~english
             * Begin sub flow
             * Attach SubFlowParam to jqm history stack object.
             *
             * @param subFlowParam {SubFlowParam} [in] Sub Flow parameter
             *
             * \~japanese
             * Sub Flow の開始
             * SubFlowParam を jqm history stack にアタッチ
             *
             * @param subFlowParam {SubFlowParam} [in] Sub Flow パラメータ
             */
            Router.beginSubFlow = function (subFlowParam) {
                var active = Router.getJqmHistory().getActive();
                var param = subFlowParam;
                if (subFlowParam.destBase) {
                    (function () {
                        var distance = 0;
                        var fragment = Backbone.history.getFragment(subFlowParam.destBase);
                        var context = _.find(Router.s_rootContexts, function (context) {
                            return context.regexp.test(fragment);
                        });
                        if (null == context) {
                            console.warn("base destination is not registered. destBase: " + subFlowParam.destBase);
                            return;
                        }
                        // dataUrl を元に jQM History を検索
                        var jqmDataUrl = Router.pathToJqmDataUrl(context.page);
                        var stack = Router.getJqmHistory().stack;
                        for (var i = Router.getJqmHistory().activeIndex; 0 <= i; i--, distance++) {
                            if (jqmDataUrl === stack[i].pageUrl) {
                                param.additionalDistance = distance;
                                break;
                            }
                        }
                    })();
                }
                else {
                    param.destBase = location.hash;
                    param.additionalDistance = 0;
                }
                active[Router.SUBFLOW_PARAM] = param;
            };
            /**
             * \~english
             * End sub flow
             * navigate and delete SubFlowParam from jqm history stack object.
             *
             * @param navOptions {NavigateOptions} [in] Sub Flow parameter
             *
             * \~japanese
             * Sub Flow の終了
             * 遷移と SubFlowParam を jqm history stack から削除
             *
             * @param navOptions {NavigateOptions} [in] Sub Flow パラメータ
             */
            Router.endSubFlow = function (options) {
                var navOptions = $.extend(true, {}, options);
                var baseInfo = Router.detectSubFlowBaseInfo();
                // "end" 時に更新されたものを上書き
                var param = $.extend({}, baseInfo.subFlowParam, navOptions.subFlow);
                var distance = baseInfo.distance;
                var stack = baseInfo.stack;
                var NAVIGATE_INTERVAL = 100;
                var MAX_RETRY_COUNT = 10;
                var retry = 0;
                // hash 変更が完了した後に navigate を実行
                var _navigate = function () {
                    if (MAX_RETRY_COUNT <= retry) {
                        console.error("reached navigate max retry count.");
                        Router.s_lastNavigateInfo = {};
                    }
                    else if (param.destBase !== location.hash) {
                        retry++;
                        setTimeout(_navigate, NAVIGATE_INTERVAL);
                    }
                    else {
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
                        delete navOptions.subFlow; // subFlow プロパティの破棄
                        setTimeout(_navigate, 0);
                    }
                    else {
                        Router.s_lastNavigateInfo.positiveNavigate = false;
                        history.go(-distance);
                    }
                }
                else {
                    console.warn("subFlow begin status does not exist in history.");
                    Router.s_lastNavigateInfo = {};
                }
            };
            /**
             * \~english
             * Return destination Sub Flow information.
             * (const function)
             *
             * @private
             * @return {Object} sub flow info.
             *
             * \~japanese
             * Sub Flow 情報を返却
             * (この関数は Router の状態を変更しません。)
             *
             * @private
             * @return {Object} Sub Flow 情報.
             */
            Router.detectSubFlowBaseInfo = function () {
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
                    isCurrent: (function () {
                        if (target && 0 === distance) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    })(),
                };
            };
            /**
             * \~english
             * Convert path to jQM dataUrl.
             *
             * @private
             * @return {String} jQM data url.
             *
             * \~japanese
             * パスを jQM dataUrl に変換
             *
             * @private
             * @return {String} jQM data url.
             */
            Router.pathToJqmDataUrl = function (path) {
                var url = Framework.toUrl(path);
                var dataUrl = $.mobile.path.convertUrlToDataUrl(url);
                return dataUrl;
            };
            /**
             * \~english
             * Update jQM urlHistory by window.history object.
             * To be natural browsing history behavior, application needs to update jQM urlHistory
             * when clicking back or next button of browser. (imperfection for decideDirection())
             *
             * @private
             *
             * \~japanese
             * ブラウザの履歴に基づき jQM urlHistory を更新
             * [戻る]/[進む]が押下された後、ページ遷移されるとき、jQM urlHistory を更新する。(decideDirection() により不完全)
             *
             * @private
             */
            Router.treatUrlHistory = function () {
                if (Router.s_lastNavigateInfo.positiveNavigate || history.length < Router.getJqmHistory().stack.length) {
                    Router.getJqmHistory().clearForward();
                }
            };
            /**
             * \~english
             * Get jQM's history object
             * version 1.4:
             *   $.mobile.navigate.history
             * version 1.3:
             *   $.mobile.urlHistory
             *
             * @private
             *
             * \~japanese
             * jQM の History オブジェクトの取得
             * version 1.4:
             *   $.mobile.navigate.history
             * version 1.3:
             *   $.mobile.urlHistory
             *
             * @private
             */
            Router.getJqmHistory = function () {
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
            Router.DELAY_TIME = 200; // TBD: 暫定値
            Router.DATA_BACK_DESTINATION = "data-back-dst";
            Router.DATA_NO_HASH_CHANGE = "data-no-hash-change";
            Router.DATA_NO_VCLICK_HANDLE = "data-no-vclick-handle";
            Router.BACK_DESTINATION_URL = "backDstUrl";
            Router.SUBFLOW_PARAM = "subFlowParam";
            Router.s_defaultInitOptions = {
                anchorVclick: true,
            };
            Router.s_defaultNavigateOptions = {
                trigger: true,
                replace: false,
                intent: null,
            };
            return Router;
        }());
        Framework.Router = Router;
    })(Framework = CDP.Framework || (CDP.Framework = {}));
})(CDP || (CDP = {}));








/* tslint:disable:max-line-length forin */
var CDP;
(function (CDP) {
    /**
     * \~english
     * The function returned JQueryPromise waits until PhoneGap is ready.
     * [Note] emulate when PC enviroment.
     *
     * \~japanese
     * PhoneGap が有効になるまで待機
     * PC 環境ではエミュレートされる。
     */
    function waitForDeviceReady() {
        var df = $.Deferred();
        if (!CDP.Framework.Platform.Mobile) {
            setTimeout(function () {
                df.resolve();
            }, 100);
        }
        else {
            if (null == CDP.global.cordova || null == CDP.global.cordova.exec) {
                $(document).one("deviceready", function () {
                    df.resolve();
                });
            }
            else {
                df.resolve();
            }
        }
        return df.promise();
    }
    CDP.waitForDeviceReady = waitForDeviceReady;
    var _defaultBackButtonHandler = null;
    /**
     * \~english
     * Setup H/W Back key handler.
     *
     * @param  {Function} handler function.
     * @return {Function} old handler function.
     *
     * \~japanese
     *
     * @param  {Function} handler 指定.
     * @return {Function} 以前の handler.
     */
    function setBackButtonHandler(handler) {
        var oldHandler = _defaultBackButtonHandler;
        _defaultBackButtonHandler = handler;
        return oldHandler;
    }
    CDP.setBackButtonHandler = setBackButtonHandler;
    // back key handler implement.
    (function () {
        waitForDeviceReady().done(function () {
            $(document).on("backbutton", function (event) {
                if (_defaultBackButtonHandler) {
                    _defaultBackButtonHandler(event);
                }
            });
        });
    })();
    //___________________________________________________________________________________________________________________//
    var Framework;
    (function (Framework) {
        var TAG = "[CDP.Framework] ";
        var _initializedState = {
            done: false,
            calling: false,
        };
        var _activePage = null;
        var _orientationListenerHolder = {};
        var _lastOrientation = null;
        /**
         * \~english
         * Initialization function of Framework.
         *
         * \~japanese
         * Framework の初期化関数
         *
         * @param options {FrameworkOptions} [in] options object.
         */
        function initialize(options) {
            var df = $.Deferred();
            var config = getConfig(options);
            if (_initializedState.calling) {
                console.warn(TAG + "cdp.framework.jqm is already initialized, ignored.");
                return df.resolve();
            }
            _initializedState.calling = true;
            // CDP 環境の初期化
            // 現状は、console オブジェクトの保証と jQuery の WinRT 対応。
            CDP.initialize({
                success: function () {
                    // Framework 用の Patch 適用
                    if (config.applyPatch) {
                        Framework.Patch.apply();
                    }
                    // jQuery の共通設定
                    config.jquery();
                    // AMD でない環境では初期化はここまで。
                    if (!isAMD()) {
                        console.warn(TAG + "need to init for 'jquery.mobile', 'i18Next' and 'CDP.Framework.Router' manually, because cdp.framework depends on require.js.");
                        _initializedState.done = true;
                        return df.resolve();
                    }
                    // jQuery Mobile の初期化
                    $(document).on("mobileinit", function () {
                        // config の反映
                        config.jquerymobile();
                        // i18next の初期化
                        i18nextInitialize(config)
                            .always(function (info) {
                            // i18next の初期化時のエラーは無視する. info が array の場合、エラー情報が格納されている.
                            $(document)
                                .one("pagebeforechange", function (event, data) {
                                data.options.showLoadMsg = false;
                            })
                                .on("pagebeforecreate", function (event) {
                                // i18nextライブラリによるhtml fragmentの翻訳処理
                                $(event.target).localize();
                            });
                            // Router の初期化
                            if (Framework.Router.initialize({ anchorVclick: config.anchorVclick, })) {
                                _initializedState.done = true;
                                df.resolve();
                            }
                            else {
                                console.error(TAG + "error. CDP.Framework.Router.initialize() failed.");
                                _initializedState.calling = false;
                                df.reject();
                            }
                        });
                    });
                    // jQuery Mobile のロード
                    require(["jquery.mobile"]);
                },
                fail: function (error) {
                    console.error(TAG + "error. CDP.initialize() failed.");
                    _initializedState.calling = false;
                    df.reject();
                },
            });
            return df.promise();
        }
        Framework.initialize = initialize;
        /**
         * \~english
         * Check for initialization status.
         *
         * \~japanese
         * 初期化済みか判定
         *
         * @return {Boolean} true: 初期化済み / false: 未初期化
         */
        function isInitialized() {
            return _initializedState.done;
        }
        Framework.isInitialized = isInitialized;
        /**
         * \~english
         * Register IOrientationChangedListener to framework.
         *
         * @param key      {String}                      [in] ID key
         * @param listener {IOrientationChangedListener} [in] IOrientationChangedListener instance
         *
         * \~japanese
         * IOrientationChangedListener を Framework に登録
         *
         * @param key      {String}                      [in] ID key
         * @param listener {IOrientationChangedListener} [in] IOrientationChangedListener instance
         */
        function registerOrientationChangedListener(key, listener) {
            _orientationListenerHolder[key] = listener;
        }
        Framework.registerOrientationChangedListener = registerOrientationChangedListener;
        /**
         * \~english
         * Unregister IOrientationChangedListener from framework.
         *
         * @param key {String} [in] ID key
         *
         * \~japanese
         * IOrientationChangedListener を Framework から登録解除
         *
         * @param key {String} [in] ID key
         */
        function unregisterOrientationChangedListener(key) {
            delete _orientationListenerHolder[key];
        }
        Framework.unregisterOrientationChangedListener = unregisterOrientationChangedListener;
        /**
         * \~english
         * Setup event handlers when after router initialized.
         *
         * @private
         *
         * \~japanese
         * イベントハンドラの設定. Router 初期化後に Framework がコールする.
         *
         * @private
         */
        function setupEventHandlers() {
            (function () {
                var oldBackButtonHandler = CDP.setBackButtonHandler(null);
                var baseBackButtonHandler = function (event) {
                    if (_activePage && _activePage.onHardwareBackButton(event)) {
                        // クライアント側でハンドリング済みと指定された場合、既定の処理を行わない
                        return;
                    }
                    else {
                        oldBackButtonHandler(event);
                    }
                };
                CDP.setBackButtonHandler(baseBackButtonHandler);
            })();
            (function () {
                var oldRouteChangeHandler = CDP.Framework.setBeforeRouteChangeHandler(null);
                var baseRouteChangeHandler = function () {
                    if (_activePage) {
                        return _activePage.onBeforeRouteChange();
                    }
                    else {
                        return oldRouteChangeHandler();
                    }
                };
                CDP.Framework.setBeforeRouteChangeHandler(baseRouteChangeHandler);
            })();
        }
        Framework.setupEventHandlers = setupEventHandlers;
        /**
         * \~english
         * Setup active IPage instance.
         *
         * @private
         * @param page {IPage} [in] IPage instance.
         *
         * \~japanese
         * active Page の設定. Framework がコールする.
         *
         * @private
         * @param page {IPage} [in] IPage instance.
         */
        function setActivePage(page) {
            _activePage = page;
            if (_activePage) {
                _lastOrientation = Framework.getOrientation();
            }
        }
        Framework.setActivePage = setActivePage;
        /**
         * \~english
         * Reterns framework default click event string.
         *
         * @private
         *
         * \~japanese
         * Framework が既定に使用するクリックイベント文字列を取得
         *
         * @private
         * @return {String} "vclick" / "click"
         */
        function getDefaultClickEvent() {
            return Framework.Patch.s_vclickEvent;
        }
        Framework.getDefaultClickEvent = getDefaultClickEvent;
        /**
         * \~english
         * Get Config object.
         *
         * @private
         * @return {FrameworkOptions} Config object.
         *
         * \~japanese
         * Config object の取得
         *
         * @private
         * @return {FrameworkOptions} Config object.
         */
        function getConfig(options) {
            var defConfig = {
                // for fail safe, default settings.
                jquery: function () {
                    $.support.cors = true;
                    $.ajaxSetup({ cache: false });
                },
                jquerymobile: function () {
                    $.mobile.allowCrossDomainPages = true;
                    $.mobile.defaultPageTransition = "none";
                    $.mobile.hashListeningEnabled = false;
                    $.mobile.pushStateEnabled = false;
                },
                i18next: {},
                applyPatch: true,
                anchorVclick: true,
            };
            return $.extend({}, defConfig, CDP.global.Config, options);
        }
        /**
         * \~english
         * Check for AMD is available.
         *
         * \~japanese
         * AMD が使用可能か判定
         *
         * @private
         * @return {Boolean} true: AMD 対応環境 / false: AMD 非対応
         */
        function isAMD() {
            return (typeof define === "function" && define.amd);
        }
        /**
         * \~english
         * get string resource for fallback.
         *
         * \~japanese
         * Fallback 用ローカライズリソースの取得
         *
         * @private
         * @return {Object}
         */
        function getLocaleFallbackResource(path) {
            var json;
            $.ajax({
                url: Framework.toUrl(path),
                method: "GET",
                async: false,
                dataType: "json",
                success: function (data) {
                    json = data;
                },
                error: function (data, status) {
                    console.log(TAG + "ajax request failed. status: " + status);
                }
            });
            return json;
        }
        /**
         * \~english
         * initialize i18next.
         *
         * \~japanese
         * i18next の初期化
         *
         * @private
         * @return {jQueryPromise}
         */
        function i18nextInitialize(config) {
            var df = $.Deferred();
            var i18nSettings = config.i18next;
            var modulePath = (function (path) {
                if (path) {
                    return (path.substr(-1) !== "/") ? path + "/" : path;
                }
                else {
                    return "";
                }
            })(i18nSettings.modulePath);
            var i18nOptions = (function (resources) {
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
                }
                else {
                    return i18nSettings.options;
                }
            })(i18nSettings.fallbackResources);
            if (modulePath) {
                require.config({
                    paths: {
                        "i18next": modulePath + "i18next",
                        "i18nextXHRBackend": modulePath + "i18nextXHRBackend",
                        "i18nextLocalStorageCache": modulePath + "i18nextLocalStorageCache",
                        "i18nextSprintfPostProcessor": modulePath + "i18nextSprintfPostProcessor",
                        "i18nextBrowserLanguageDetector": modulePath + "i18nextBrowserLanguageDetector",
                        "jqueryI18next": modulePath + "jquery-i18next",
                    }
                });
            }
            require(["jqueryI18next"], function ($18Next) {
                require([
                    "i18next",
                    "i18nextXHRBackend",
                    "i18nextLocalStorageCache",
                    "i18nextSprintfPostProcessor",
                    "i18nextBrowserLanguageDetector",
                ], function (i18next, Backend, Cache, PostProcessor, LanguageDetector) {
                    i18next
                        .use(Backend)
                        .use(Cache)
                        .use(PostProcessor)
                        .use(LanguageDetector)
                        .init(i18nOptions, function (error, t) {
                        $18Next.init(i18next, $, {
                            tName: "t",
                            i18nName: "i18n",
                            handleName: "localize",
                            selectorAttr: "data-i18n",
                            targetAttr: "i18n-target",
                            optionsAttr: "i18n-options",
                            useOptionsAttr: false,
                            parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
                        });
                        df.resolve();
                    });
                });
            });
            return df.promise();
        }
        ///////////////////////////////////////////////////////////////////////
        // closure methods
        // resize handler
        $(window).on("resize", function (event) {
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
(function (CDP) {
    var Framework;
    (function (Framework) {
        /**
         * \~english
         * @class Page
         * @brief Base class of all page unit.
         *
         * \~japanese
         * @class Page
         * @brief すべてのページの基本となる既定クラス
         */
        var Page = (function () {
            //////////////////////////////////////////
            // public methods
            /**
             * \~english
             * constructor
             *
             * @param _url    {String}               [in] page's URL
             * @param _id     {String}               [in] page's ID
             * @param options {PageConstructOptions} [in] options
             *
             * \~japanese
             * constructor
             *
             * @param _url    {String}               [in] ページ URL
             * @param _id     {String}               [in] ページ ID
             * @param options {PageConstructOptions} [in] オプション
             */
            function Page(_url, _id, options) {
                this._url = _url;
                this._id = _id;
                //////////////////////////////////////////
                // data member
                this._owner = null;
                this._$page = null;
                this._$header = null;
                this._$footer = null;
                this._intent = null;
                this._initialized = false;
                this.setup(options);
            }
            Object.defineProperty(Page.prototype, "active", {
                //////////////////////////////////////////
                // public accessor 
                get: function () { return !!this._$page && this._$page.hasClass("ui-page-active"); },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "url", {
                get: function () { return this._url; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "id", {
                get: function () { return this._id; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "$page", {
                get: function () { return this._$page; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "$header", {
                get: function () { return this._$header; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "$footer", {
                get: function () { return this._$footer; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Page.prototype, "intent", {
                get: function () { return this._intent; },
                set: function (newIntent) { this._intent = newIntent; this._intent._update = true; },
                enumerable: true,
                configurable: true
            });
            //////////////////////////////////////////
            // public Event Handler
            // Orientation の変更を受信
            Page.prototype.onOrientationChanged = function (newOrientation) {
                if (this._owner) {
                    this._owner.onOrientationChanged(newOrientation);
                }
            };
            // H/W Back Button ハンドラ
            Page.prototype.onHardwareBackButton = function (event) {
                if (this._owner) {
                    return this._owner.onHardwareBackButton(event);
                }
                else {
                    return false;
                }
            };
            // Router "before route change" ハンドラ
            Page.prototype.onBeforeRouteChange = function () {
                if (this._owner) {
                    return this._owner.onBeforeRouteChange();
                }
                else {
                    return $.Deferred().resolve().promise();
                }
            };
            // 汎用コマンドを受信
            Page.prototype.onCommand = function (event, kind) {
                if (this._owner) {
                    this._owner.onCommand(event, kind);
                }
            };
            // 最初の OnPageInit() のときにのみコールされる
            Page.prototype.onInitialize = function (event) {
                if (this._owner) {
                    this._owner.onInitialize(event);
                }
            };
            // jQM event: "pagebeforecreate" に対応
            Page.prototype.onPageBeforeCreate = function (event) {
                if (this._owner) {
                    this._owner.onPageBeforeCreate(event);
                }
            };
            // jQM event: "pagecreate" (旧:"pageinit") に対応
            Page.prototype.onPageInit = function (event) {
                if (this._owner) {
                    this._owner.onPageInit(event);
                }
            };
            // jQM event: "pagebeforeshow" に対応
            Page.prototype.onPageBeforeShow = function (event, data) {
                if (this._owner) {
                    this._owner.onPageBeforeShow(event, data);
                }
            };
            // jQM event: "pagecontainershow" (旧:"pageshow") に対応
            Page.prototype.onPageShow = function (event, data) {
                if (this._owner) {
                    this._owner.onPageShow(event, data);
                }
            };
            // jQM event: "pagebeforehide" に対応
            Page.prototype.onPageBeforeHide = function (event, data) {
                if (this._owner) {
                    this._owner.onPageBeforeHide(event, data);
                }
            };
            // jQM event: "pagecontainerhide" (旧:"pagehide") に対応
            Page.prototype.onPageHide = function (event, data) {
                if (this._owner) {
                    this._owner.onPageHide(event, data);
                }
            };
            // jQM event: "pageremove" に対応
            Page.prototype.onPageRemove = function (event) {
                if (this._owner) {
                    this._owner.onPageRemove(event);
                }
            };
            //////////////////////////////////////////
            // private methods
            // mixin 用疑似コンストラクタ
            Page.prototype.setup = function (options) {
                var _this = this;
                // mixin destination 用の再初期化
                this._initialized = false;
                this._intent = null;
                // イベントバインド
                var selector = "#" + this._id;
                $(document)
                    .off("pagebeforecreate", selector)
                    .on("pagebeforecreate", selector, function (event) {
                    _this._$page = $(selector).first();
                    _this._$header = _this._$page.children(":jqmData(role=header)").first();
                    _this._$footer = _this._$page.children(":jqmData(role=footer)").first();
                    _this._$page
                        .on("pagecreate", function (event) {
                        _this.pageInit(event);
                    })
                        .on("pagebeforeshow", function (event, data) {
                        _this.pageBeforeShow(event, data);
                    })
                        .on("pageshow", function (event, data) {
                        _this.pageShow(event, data);
                    })
                        .on("pagebeforehide", function (event, data) {
                        _this.pageBeforeHide(event, data);
                    })
                        .on("pagehide", function (event, data) {
                        _this.pageHide(event, data);
                    })
                        .on("pageremove", function (event) {
                        _this.pageRemove(event);
                    });
                    _this.pageBeforeCreate(event);
                });
                options = options || {};
                // owner 設定
                this._owner = options.owner;
                // intent 設定
                this._keepIntent = options.keepIntent;
                // Router へ登録
                if (null == options.route) {
                    options.route = this._id;
                }
                Framework.Router.register(options.route, this._url, options.top, options.callback);
            };
            Page.prototype.pageBeforeCreate = function (event) {
                this.onPageBeforeCreate(event);
            };
            Page.prototype.pageInit = function (event) {
                if (!this._initialized) {
                    this.onInitialize(event);
                    this._initialized = true;
                }
                this.onPageInit(event);
            };
            Page.prototype.pageBeforeShow = function (event, data) {
                Framework.setActivePage(this);
                this._intent = Framework.Router.popIntent();
                this.onPageBeforeShow(event, data);
            };
            Page.prototype.pageShow = function (event, data) {
                this.onPageShow(event, data);
            };
            Page.prototype.pageBeforeHide = function (event, data) {
                this.onPageBeforeHide(event, data);
                if (null != this._intent && (this._keepIntent || this._intent._update)) {
                    delete this._intent._update;
                    Framework.Router.pushIntent(this._intent);
                }
                else if (Framework.Router.fromHashChanged() && Framework.Router.isInSubFlow()) {
                    Framework.Router.pushIntent(this._intent);
                }
                this._intent = null;
                Framework.setActivePage(null);
            };
            Page.prototype.pageHide = function (event, data) {
                this.onPageHide(event, data);
            };
            Page.prototype.pageRemove = function (event) {
                this.onPageRemove(event);
                this._$page.off();
                this._$page = null;
                this._$header.off();
                this._$header = null;
                this._$footer.off();
                this._$footer = null;
            };
            return Page;
        }());
        Framework.Page = Page;
    })(Framework = CDP.Framework || (CDP.Framework = {}));
})(CDP || (CDP = {}));

    return CDP.Framework;
}));

/*!
 * cdp.tools.js 0.4.0-dev
 *
 * Date: 2016-04-06T21:20:48+0900
 */

/* tslint:disable:typedef */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define('cdp.tools',["jquery", "underscore"], function ($, _) {
            return factory(root.CDP || (root.CDP = {}), $, _);
        });
    }
    else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"), require("underscore"));
    }
    else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}), root.jQuery || root.$, root._);
    }
}(((this || 0).self || global), function (CDP, $, _) {
    CDP.Tools = CDP.Tools || {};
    /**
 * @file  Utils.
 * @brief Tools 専用のユーティリティ
 */
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        // cdp.tools は cdp.core に依存しないため、独自にglobal を提供する
        Tools.global = Tools.global || window;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));

var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.Blob] ";
        var Blob;
        (function (Blob) {
            /**
             * Get BlobBuilder
             *
             * @return {any} BlobBuilder
             */
            function getBlobBuilder() {
                return Tools.global.BlobBuilder || Tools.global.WebKitBlobBuilder || Tools.global.MozBlobBuilder || Tools.global.MSBlobBuilder;
            }
            /**
             * ArrayBuffer to Blob
             *
             * @param buf {ArrayBuffer} [in] ArrayBuffer data
             * @param mimeType {string} [in] MimeType of data
             * @return {Blob} Blob data
             */
            function arrayBufferToBlob(buf, mimeType) {
                var blob = null;
                var blobBuilderObject = getBlobBuilder();
                if (blobBuilderObject != null) {
                    var blobBuilder = new blobBuilderObject();
                    blobBuilder.append(buf);
                    blob = blobBuilder.getBlob(mimeType);
                }
                else {
                    // Android 4.4 KitKat Chromium WebView
                    blob = new Tools.global.Blob([buf], { type: mimeType });
                }
                return blob;
            }
            Blob.arrayBufferToBlob = arrayBufferToBlob;
            /**
             * Base64 string to Blob
             *
             * @param base64 {string} [in] Base64 string data
             * @param mimeType {string} [in] MimeType of data
             * @return {Blob} Blob data
             */
            function base64ToBlob(base64, mimeType) {
                var blob = null;
                var blobBuilderObject = getBlobBuilder();
                if (blobBuilderObject != null) {
                    var blobBuilder = new blobBuilderObject();
                    blobBuilder.append(base64ToArrayBuffer(base64));
                    blob = blobBuilder.getBlob(mimeType);
                }
                else {
                    // Android 4.4 KitKat Chromium WebView
                    blob = new Tools.global.Blob([base64ToArrayBuffer(base64)], { type: mimeType });
                }
                return blob;
            }
            Blob.base64ToBlob = base64ToBlob;
            /**
             * Base64 string to ArrayBuffer
             *
             * @param base64 {string} [in] Base64 string data
             * @return {ArrayBuffer} ArrayBuffer data
             */
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
            /**
             * Base64 string to Uint8Array
             *
             * @param base64 {string} [in] Base64 string data
             * @return {Uint8Array} Uint8Array data
             */
            function base64ToUint8Array(encoded) {
                var bytes = window.atob(encoded);
                var data = new Uint8Array(bytes.length);
                for (var i = 0, len = bytes.length; i < len; ++i) {
                    data[i] = bytes.charCodeAt(i);
                }
                return data;
            }
            Blob.base64ToUint8Array = base64ToUint8Array;
            /**
             * ArrayBuffer to base64 string
             *
             * @param arrayBuffer {ArrayBuffer} [in] ArrayBuffer data
             * @return {string} base64 data
             */
            function arrayBufferToBase64(arrayBuffer) {
                var bytes = new Uint8Array(arrayBuffer);
                return this.uint8ArrayToBase64(bytes);
            }
            Blob.arrayBufferToBase64 = arrayBufferToBase64;
            /**
             * Uint8Array to base64 string
             *
             * @param bytes {Uint8Array} [in] Uint8Array data
             * @return {string} base64 data
             */
            function uint8ArrayToBase64(bytes) {
                var data = "";
                for (var i = 0, len = bytes.byteLength; i < len; ++i) {
                    data += String.fromCharCode(bytes[i]);
                }
                return window.btoa(data);
            }
            Blob.uint8ArrayToBase64 = uint8ArrayToBase64;
            /**
             * URL Object
             *
             * @return {any} URL Object
             */
            Blob.URL = (function () {
                return Tools.global.URL || Tools.global.webkitURL;
            })();
        })(Blob = Tools.Blob || (Tools.Blob = {}));
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));
/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.DateTime] ";
        /**
         * @class DateTime
         * @brief 時刻操作のユーティリティクラス
         */
        var DateTime = (function () {
            function DateTime() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static method
            /**
             * 基点となる日付から、n日後、n日前を算出
             *
             * @param base    {Date}   [in] 基準日
             * @param addDays {Number} [in] 加算日. マイナス指定でn日前も設定可能
             * @return {Date} 日付オブジェクト
             */
            DateTime.computeDate = function (base, addDays) {
                var dt = new Date(base.getTime());
                var baseSec = dt.getTime();
                var addSec = addDays * 86400000; //日数 * 1日のミリ秒数
                var targetSec = baseSec + addSec;
                dt.setTime(targetSec);
                return dt;
            };
            /**
             * Convert string to date object
             *
             * @param {String} date string ex) YYYY-MM-DDTHH:mm:SS.SSS
             * @return {Object} date object
             */
            DateTime.convertISOStringToDate = function (dateString) {
                var dateTime = dateString.split("T"), dateArray = dateTime[0].split("-"), timeArray, secArray, dateObject;
                if (dateTime[1]) {
                    timeArray = dateTime[1].split(":");
                    secArray = timeArray[2].split(".");
                }
                if (timeArray) {
                    dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], secArray[0], secArray[1]);
                }
                else {
                    if (dateArray[2]) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                    }
                    else if (dateArray[1]) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1);
                    }
                    else {
                        dateObject = new Date(dateArray[0]);
                    }
                }
                return dateObject;
            };
            /**
             *  Convert a date object into a string in PMOAPI recorded_date format(the ISO 8601 Extended Format)
             *
             * @param date   {Date}   [in] date object
             * @param target {String} [in] {year | month | date | hour | min | sec | msec }
             * @return {String}
             */
            DateTime.convertDateToISOString = function (date, target) {
                if (target === void 0) { target = "msec"; }
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
                isoDateString += ("-" + DateTime.numberToDoubleDigitsString(date.getMonth() + 1));
                if ("month" === target) {
                    return isoDateString;
                }
                isoDateString += ("-" + DateTime.numberToDoubleDigitsString(date.getDate()));
                if ("date" === target) {
                    return isoDateString;
                }
                isoDateString += ("T" + DateTime.numberToDoubleDigitsString(date.getHours()));
                if ("hour" === target) {
                    return isoDateString;
                }
                isoDateString += (":" + DateTime.numberToDoubleDigitsString(date.getMinutes()));
                if ("min" === target) {
                    return isoDateString;
                }
                isoDateString += (":" + DateTime.numberToDoubleDigitsString(date.getSeconds()));
                if ("sec" === target) {
                    return isoDateString;
                }
                isoDateString += ("." + String((date.getMilliseconds() / 1000).toFixed(3)).slice(2, 5));
                return isoDateString;
            };
            /**
             * Convert file system compatible string to date object
             *
             * @param {String} date string ex) yyyy_MM_ddTHH_mm_ss_SSS
             * @return {Object} date object
             */
            DateTime.convertFileSystemStringToDate = function (dateString) {
                var dateTime = dateString.split("T"), dateArray = dateTime[0].split("_"), timeArray, dateObject;
                if (dateTime[1]) {
                    timeArray = dateTime[1].split("_");
                }
                if (timeArray) {
                    dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], timeArray[2], timeArray[3]);
                }
                else {
                    if (dateArray[2]) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
                    }
                    else if (dateArray[1]) {
                        dateObject = new Date(dateArray[0], dateArray[1] - 1);
                    }
                    else {
                        dateObject = new Date(dateArray[0]);
                    }
                }
                return dateObject;
            };
            /**
             *  Convert a date object into a string in file system compatible format(yyyy_MM_ddTHH_mm_ss_SSS)
             *
             * @param date   {Date}   [in] date object
             * @param target {String} [in] {year | month | date | hour | min | sec | msec }
             * @return {String}
             */
            DateTime.convertDateToFileSystemString = function (date, target) {
                if (target === void 0) { target = "msec"; }
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
                fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getMonth() + 1));
                if ("month" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getDate()));
                if ("date" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("T" + DateTime.numberToDoubleDigitsString(date.getHours()));
                if ("hour" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getMinutes()));
                if ("min" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getSeconds()));
                if ("sec" === target) {
                    return fileSystemString;
                }
                fileSystemString += ("_" + String((date.getMilliseconds() / 1000).toFixed(3)).slice(2, 5));
                return fileSystemString;
            };
            ///////////////////////////////////////////////////////////////////////
            // private static method
            /**
             * Convert num to string(double digits)
             *
             * @param  {Number} number (0 <number < 100)
             * @return {String} double digits string
             */
            DateTime.numberToDoubleDigitsString = function (num) {
                if (num < 0 || num > 100) {
                    return null;
                }
                if (num < 10) {
                    return "0" + num;
                }
                return "" + num;
            };
            return DateTime;
        }());
        Tools.DateTime = DateTime;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));

/*jshint multistr: true */
var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.Functions] ";
        /**
         * Math.abs よりも高速な abs
         */
        function abs(x) {
            return x >= 0 ? x : -x;
        }
        Tools.abs = abs;
        /**
         * Math.max よりも高速な max
         */
        function max(lhs, rhs) {
            return lhs >= rhs ? lhs : rhs;
        }
        Tools.max = max;
        /**
         * Math.min よりも高速な min
         */
        function min(lhs, rhs) {
            return lhs <= rhs ? lhs : rhs;
        }
        Tools.min = min;
        /**
         * condition() が true を返すまで deferred
         */
        function await(condition, msec) {
            if (msec === void 0) { msec = 0; }
            var df = $.Deferred();
            var proc = function () {
                if (!condition()) {
                    setTimeout(proc, msec);
                }
                else {
                    df.resolve();
                }
            };
            setTimeout(proc, msec);
            return df.promise();
        }
        Tools.await = await;
        /**
         * 数値を 0 詰めして文字列を生成
         */
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
        /**
         * 多重継承のための実行時継承関数
         *
         * Sub Class 候補オブジェクトに対して Super Class 候補オブジェクトを直前の Super Class として挿入する。
         * prototype のみコピーする。
         * インスタンスメンバをコピーしたい場合、Super Class が疑似コンストラクタを提供する必要がある。
         * 詳細は cdp.tools.Functions.spec.ts を参照。
         *
         * @param subClass   {constructor} [in] オブジェクトの constructor を指定
         * @param superClass {constructor} [in] オブジェクトの constructor を指定
         */
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
        /**
         * mixin 関数
         *
         * TypeScript Official Site に載っている mixin 関数
         * http://www.typescriptlang.org/Handbook#mixins
         * 既に定義されているオブジェクトから、新規にオブジェクトを合成する。
         *
         * @param derived {constructor}    [in] 合成されるオブジェクトの constructor を指定
         * @param bases   {constructor...} [in] 合成元オブジェクトの constructor を指定 (可変引数)
         */
        function mixin(derived) {
            var bases = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                bases[_i - 1] = arguments[_i];
            }
            bases.forEach(function (base) {
                Object.getOwnPropertyNames(base.prototype).forEach(function (name) {
                    derived.prototype[name] = base.prototype[name];
                });
            });
        }
        Tools.mixin = mixin;
        /**
         * \~english
         * Helper function to correctly set up the prototype chain, for subclasses.
         * The function behavior is same as extend() function of Backbone.js.
         *
         * @param protoProps  {Object} [in] set prototype properties as object.
         * @param staticProps {Object} [in] set static properties as object.
         * @return {Object} subclass constructor.
         *
         * \~japanese
         * クラス継承のためのヘルパー関数
         * Backbone.js extend() 関数と同等
         *
         * @param protoProps  {Object} [in] prototype properties をオブジェクトで指定
         * @param staticProps {Object} [in] static properties をオブジェクトで指定
         * @return {Object} サブクラスのコンストラクタ
         */
        function extend(protoProps, staticProps) {
            var parent = this;
            var child;
            if (protoProps && protoProps.hasOwnProperty("constructor")) {
                child = protoProps.constructor;
            }
            else {
                child = function () {
                    return parent.apply(this, arguments);
                };
            }
            $.extend(child, parent, staticProps);
            var Surrogate = function () {
                this.constructor = child;
            };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate;
            if (protoProps) {
                $.extend(child.prototype, protoProps);
            }
            child.__super__ = parent.prototype;
            return child;
        }
        Tools.extend = extend;
        /**
         * DPI 取得
         */
        function getDevicePixcelRatio() {
            var mediaQuery;
            var is_firefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
            if (null != window.devicePixelRatio && !is_firefox) {
                return window.devicePixelRatio;
            }
            else if (window.matchMedia) {
                mediaQuery =
                    "(-webkit-min-device-pixel-ratio: 1.5),\
                    (min--moz-device-pixel-ratio: 1.5),\
                    (-o-min-device-pixel-ratio: 3/2),\
                    (min-resolution: 1.5dppx)";
                if (window.matchMedia(mediaQuery).matches) {
                    return 1.5;
                }
                mediaQuery =
                    "(-webkit-min-device-pixel-ratio: 2),\
                    (min--moz-device-pixel-ratio: 2),\
                    (-o-min-device-pixel-ratio: 2/1),\
                    (min-resolution: 2dppx)";
                if (window.matchMedia(mediaQuery).matches) {
                    return 2;
                }
                mediaQuery =
                    "(-webkit-min-device-pixel-ratio: 0.75),\
                    (min--moz-device-pixel-ratio: 0.75),\
                    (-o-min-device-pixel-ratio: 3/4),\
                    (min-resolution: 0.75dppx)";
                if (window.matchMedia(mediaQuery).matches) {
                    return 0.7;
                }
            }
            else {
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
                    }
                    catch (ex) {
                        console.error(TAG + ex);
                        return df.reject(ex);
                    }
                    break;
                default:
                    return df.reject("invalid type argument");
            }
            wk.onerror = function (error) { return df.reject(error); };
            wk.onmessage = function (event) { return df.resolve(event.data); };
            wk.postMessage(msg);
            return df.promise();
        }
        Tools.doWork = doWork;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));



var CDP;
(function (CDP) {
    var Tools;
    (function (Tools) {
        var TAG = "[CDP.Tools.Template] ";
        //___________________________________________________________________________________________________________________//
        /**
         * @class Template
         * @brief template script を管理するユーティリティクラス
         */
        var Template = (function () {
            function Template() {
            }
            ///////////////////////////////////////////////////////////////////////
            // 公開メソッド
            /**
             * 指定した id, class 名, Tag 名をキーにテンプレートの JQuery Element を取得する。
             *
             * @param key [in] id, class, tag を表す文字列
             * @param src [in] 外部 html を指定する場合は url を設定
             * @return template が格納されている JQuery Element
             */
            Template.getTemplateElement = function (key, src) {
                var mapElement = Template.getElementMap();
                var $element = mapElement[key];
                try {
                    if (!$element) {
                        if (src) {
                            var html = Template.findHtmlFromSource(src);
                            $element = $(html).find(key);
                        }
                        else {
                            $element = $(key);
                        }
                        // 要素の検証
                        if ($element <= 0) {
                            throw ("invalid [key, src] = [" + key + ", " + src + "]");
                        }
                        mapElement[key] = $element;
                    }
                }
                catch (exception) {
                    console.error(TAG + exception);
                    return null;
                }
                return $element;
            };
            /**
             * Map オブジェクトの削除
             * 明示的にキャッシュを開放する場合は本メソッドをコールする
             */
            Template.empty = function () {
                Template._mapElement = null;
                Template._mapSource = null;
            };
            /**
             * 指定した id, class 名, Tag 名をキーに JST を取得する。
             *
             * @param key [in] id, class, tag を表す文字列
             * @param src [in] 外部 html を指定する場合は url を設定
             * @return コンパイルされた JST オブジェクト
             */
            Template.getJST = function (key, src) {
                var $element = this.getTemplateElement(key, src);
                var template = null;
                var jst;
                if (null != Tools.global.Hogan) {
                    template = Hogan.compile($element.text());
                    jst = function (data) {
                        return template.render(data);
                    };
                }
                else {
                    template = _.template($element.html());
                    jst = function (data) {
                        // 改行とタブは削除する
                        return template(data).replace(/\n|\t/g, "");
                    };
                }
                return jst;
            };
            ///////////////////////////////////////////////////////////////////////
            // 内部メソッド
            // Element Map オブジェクトの取得
            Template.getElementMap = function () {
                if (!Template._mapElement) {
                    Template._mapElement = {};
                }
                return Template._mapElement;
            };
            // URL Map オブジェクトの取得
            Template.getSourceMap = function () {
                if (!Template._mapSource) {
                    Template._mapSource = {};
                }
                return Template._mapSource;
            };
            // URL Map から HTML を検索. 失敗した場合は undefined が返る
            Template.findHtmlFromSource = function (src) {
                var mapSource = Template.getSourceMap();
                var html = mapSource[src];
                if (!html) {
                    $.ajax({
                        url: src,
                        method: "GET",
                        async: false,
                        dataType: "html",
                        success: function (data) {
                            html = data;
                        },
                        error: function (data, status) {
                            throw ("ajax request failed. status: " + status);
                        }
                    });
                    // キャッシュに格納
                    mapSource[src] = html;
                }
                return html;
            };
            return Template;
        }());
        Tools.Template = Template;
    })(Tools = CDP.Tools || (CDP.Tools = {}));
})(CDP || (CDP = {}));

    return CDP.Tools;
}));

/*!
 * cdp.ui.listview.js 0.4.0-dev
 *
 * Date: 2016-04-11T12:01:20+0900
 */

/* tslint:disable:typedef */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define('cdp.ui.listview',["jquery", "underscore", "backbone"], function ($, _, Backbone) {
            return factory(root.CDP || (root.CDP = {}), $, _, Backbone);
        });
    }
    else if (typeof exports === "object") {
        // CommonJS
        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"), require("underscore"), require("backbone"));
    }
    else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}), root.$, root._, root.Backbone);
    }
}(((this || 0).self || global), function (CDP, $, _, Backbone) {
    CDP.UI = CDP.UI || {};
    var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        /**
         * @class ListViewGlobalConfig
         * @brief cdp.ui.listview の global confing
         */
        var ListViewGlobalConfig;
        (function (ListViewGlobalConfig) {
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
(function (CDP) {
    var UI;
    (function (UI) {
        var _Config = CDP.UI.ListViewGlobalConfig;
        var _ToolCSS = CDP.UI._ListViewUtils;
        var TAG = "[CDP.UI.LineProfile] ";
        /**
         * @class LineProfile
         * @brief 1 ラインに関するプロファイルクラス
         *        framework が使用する
         */
        var LineProfile = (function () {
            /**
             * constructor
             *
             * @param _owner       {IListViewFramework} [in] 管理者である IListViewFramework インスタンス
             * @param _height      {Number}            [in] 初期の高さ
             * @param _initializer {Function}          [in] ListItemView 派生クラスのコンストラクタ
             * @param _info        {Object}            [in] ListItemView コンストラクタに渡されるオプション
             */
            function LineProfile(_owner, _height, _initializer, _info) {
                this._owner = _owner;
                this._height = _height;
                this._initializer = _initializer;
                this._info = _info;
                this._index = null; //< global index
                this._pageIndex = null; //< 所属する page index
                this._offset = null; //< global offset
                this._$base = null; //< 土台となる DOM インスタンスを格納
                this._instance = null; //< ListItemView インスタンスを格納
            }
            ///////////////////////////////////////////////////////////////////////
            // public methods
            // 有効化
            LineProfile.prototype.activate = function () {
                if (null == this._instance) {
                    var options = void 0;
                    this._$base = this.prepareBaseElement();
                    options = $.extend({}, {
                        el: this._$base,
                        owner: this._owner,
                        lineProfile: this,
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
            // 不可視化
            LineProfile.prototype.hide = function () {
                if (null == this._instance) {
                    this.activate();
                }
                if ("hidden" !== this._$base.css("visibility")) {
                    this._$base.css("visibility", "hidden");
                }
            };
            // 無効化
            LineProfile.prototype.inactivate = function () {
                if (null != this._instance) {
                    // xperia AX Jelly Bean (4.1.2)にて、 hidden element の削除でメモリーリークするため可視化する。
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
            // 更新
            LineProfile.prototype.refresh = function () {
                if (null != this._instance) {
                    this._instance.render();
                }
            };
            // 有効無効判定
            LineProfile.prototype.isActive = function () {
                return null != this._instance;
            };
            // 高さ情報の更新. ListItemView からコールされる。
            LineProfile.prototype.updateHeight = function (newHeight, options) {
                var delta = newHeight - this._height;
                this._height = newHeight;
                this._owner.updateScrollMapHeight(delta);
                if (null != options && options.reflectAll) {
                    this._owner.updateProfiles(this._index);
                }
            };
            // z-index のリセット. ScrollManager.removeItem() からコールされる。
            LineProfile.prototype.resetDepth = function () {
                if (null != this._instance) {
                    this._$base.css("z-index", this._owner.getListViewOptions().baseDepth);
                }
            };
            Object.defineProperty(LineProfile.prototype, "height", {
                ///////////////////////////////////////////////////////////////////////
                // getter/setter methods
                // getter: ラインの高さ
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineProfile.prototype, "index", {
                // getter: global index
                get: function () {
                    return this._index;
                },
                // setter: global index
                set: function (index) {
                    this._index = index;
                    if (null != this._$base) {
                        this.updateIndex(this._$base);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineProfile.prototype, "pageIndex", {
                // getter: 所属ページ index
                get: function () {
                    return this._pageIndex;
                },
                // setter: 所属ページ index
                set: function (index) {
                    this._pageIndex = index;
                    if (null != this._$base) {
                        this.updatePageIndex(this._$base);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineProfile.prototype, "offset", {
                // getter: line offset
                get: function () {
                    return this._offset;
                },
                // setter: line offset
                set: function (offset) {
                    this._offset = offset;
                    if (null != this._$base) {
                        this.updateOffset(this._$base);
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineProfile.prototype, "info", {
                // getter: info
                get: function () {
                    return this._info;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // private methods
            // Base jQuery オブジェクトの生成
            LineProfile.prototype.prepareBaseElement = function () {
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
                }
                else {
                    $base = $("<" + itemTagName + " class='" + _Config.LISTITEM_BASE_CLASS + "'></" + itemTagName + ">");
                    $base.css("display", "none");
                    $map.append($base);
                }
                // 高さの更新
                if ($base.height() !== this._height) {
                    $base.height(this._height);
                }
                // index の設定
                this.updateIndex($base);
                // offset の更新
                this.updateOffset($base);
                return $base;
            };
            // global index の更新
            LineProfile.prototype.updateIndex = function ($base) {
                if ($base.attr(_Config.DATA_CONTAINER_INDEX) !== this._index.toString()) {
                    $base.attr(_Config.DATA_CONTAINER_INDEX, this._index.toString());
                }
            };
            // page index の更新
            LineProfile.prototype.updatePageIndex = function ($base) {
                if ($base.attr(_Config.DATA_PAGE_INDEX) !== this._pageIndex.toString()) {
                    $base.attr(_Config.DATA_PAGE_INDEX, this._pageIndex.toString());
                }
            };
            // offset の更新
            LineProfile.prototype.updateOffset = function ($base) {
                var transform = {};
                if (this._owner.getListViewOptions().enableTransformOffset) {
                    if (_ToolCSS.getCssMatrixValue($base, "translateY") !== this._offset) {
                        for (var i = 0; i < _ToolCSS.cssPrefixes.length; i++) {
                            transform[_ToolCSS.cssPrefixes[i] + "transform"] = "translate3d(0px," + this._offset + "px,0px)";
                        }
                        $base.css(transform);
                    }
                }
                else {
                    if (parseInt($base.css("top"), 10) !== this._offset) {
                        $base.css("top", this._offset + "px");
                    }
                }
            };
            return LineProfile;
        }());
        UI.LineProfile = LineProfile;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.GroupProfile] ";
        /**
         * @class GroupProfile
         * @brief ラインをグループ管理するプロファイルクラス
         *        本クラスでは直接 DOM を操作してはいけない
         */
        var GroupProfile = (function () {
            /**
             * constructor
             *
             * @param _id    {String}             [in] GroupProfile の ID
             * @param _owner {ExpandableListView} [in] 管理者である ExpandableListView インスタンス
             */
            function GroupProfile(_id, _owner) {
                this._id = _id;
                this._owner = _owner;
                this._parent = null; //< 親 GroupProfile インスタンス
                this._children = []; //< 子 GroupProfile インスタンス
                this._expanded = false; //< 開閉情報
                this._status = "unregistered"; //< _owner への登録状態 [ unregistered | registered ]
                this._mapLines = {}; //< 自身が管轄する LineProfile を key とともに格納
            }
            ///////////////////////////////////////////////////////////////////////
            // public method
            /**
             * 本 GroupProfile が管理する List を作成して登録
             *
             * @param height      {Number}   [in] ラインの高さ
             * @param initializer {Function} [in] ListItemView 派生クラスのコンストラクタ
             * @param info        {Object}   [in] initializer に渡されるオプション引数
             * @param layoutKey   {String}   [in] layout 毎に使用する識別子 (オプショナル)
             * @return {GroupProfile} 本インスタンス
             */
            GroupProfile.prototype.addItem = function (height, initializer, info, layoutKey) {
                var line;
                var options = $.extend({}, { groupProfile: this }, info);
                if (null == layoutKey) {
                    layoutKey = GroupProfile.LAYOUT_KEY_DEFAULT;
                }
                if (null == this._mapLines[layoutKey]) {
                    this._mapLines[layoutKey] = [];
                }
                line = new UI.LineProfile(this._owner.core, Math.floor(height), initializer, options);
                // _owner の管理下にあるときは速やかに追加
                if (("registered" === this._status) &&
                    (null == this._owner.layoutKey || layoutKey === this._owner.layoutKey)) {
                    this._owner._addLine(line, this.getLastLineIndex() + 1);
                    this._owner.update();
                }
                this._mapLines[layoutKey].push(line);
                return this;
            };
            GroupProfile.prototype.addChildren = function (target) {
                var _this = this;
                var children = (target instanceof Array) ? target : [target];
                children.forEach(function (child) {
                    child.setParent(_this);
                });
                this._children = this._children.concat(children);
                return this;
            };
            /**
             * 親 GroupProfile を取得
             *
             * @return {GroupProfile} GroupProfile 親 インスタンス
             */
            GroupProfile.prototype.getParent = function () {
                return this._parent;
            };
            /**
             * 子 GroupProfile を取得
             *
             * @return {GroupProfile[]} GroupProfile 子 インスタンス配列
             */
            GroupProfile.prototype.getChildren = function () {
                return this._children;
            };
            /**
             * 子 Group を持っているか判定
             * layoutKey が指定されれば、layout の状態まで判定
             *
             * @param layoutKey {String} [in] layout 毎に使用する識別子 (オプショナル)
             * @return {Boolean} true: 有, false: 無
             */
            GroupProfile.prototype.hasChildren = function (layoutKey) {
                if (this._children.length <= 0) {
                    return false;
                }
                else if (null != layoutKey) {
                    return this._children[0].hasLayoutKeyOf(layoutKey);
                }
                else {
                    return true;
                }
            };
            /**
             * layout の状態を判定
             *
             * @param layoutKey {String} [in] layout 毎に使用する識別子
             * @return {Boolean} true: 有, false: 無
             */
            GroupProfile.prototype.hasLayoutKeyOf = function (layoutKey) {
                if (null == layoutKey) {
                    layoutKey = GroupProfile.LAYOUT_KEY_DEFAULT;
                }
                return (null != this._mapLines[layoutKey]);
            };
            /**
             * グループ展開
             */
            GroupProfile.prototype.expand = function () {
                var _this = this;
                var lines = [];
                if (this._lines.length < 0) {
                    console.warn(TAG + "this group has no lines.");
                }
                else if (!this.hasChildren()) {
                    console.warn(TAG + "this group has no children.");
                }
                else if (!this.isExpanded()) {
                    lines = this.queryOperationTarget("registered");
                    this._expanded = true;
                    if (0 < lines.length) {
                        this._owner.statusScope("expanding", function () {
                            // 自身を更新
                            _this._lines.forEach(function (line) {
                                line.refresh();
                            });
                            // 配下を更新
                            _this._owner._addLine(lines, _this.getLastLineIndex() + 1);
                            _this._owner.update();
                        });
                    }
                }
            };
            /**
             * グループ収束
             *
             * @param delay {Number} [in] 要素削除に費やす遅延時間. 既定: animationDuration 値
             */
            GroupProfile.prototype.collapse = function (delay) {
                var _this = this;
                var lines = [];
                if (!this.hasChildren()) {
                    console.warn(TAG + "this group has no children.");
                }
                else if (this.isExpanded()) {
                    lines = this.queryOperationTarget("unregistered");
                    this._expanded = false;
                    if (0 < lines.length) {
                        delay = (null != delay) ? delay : this._owner.core.getListViewOptions().animationDuration;
                        this._owner.statusScope("collapsing", function () {
                            // 自身を更新
                            _this._lines.forEach(function (line) {
                                line.refresh();
                            });
                            // 配下を更新
                            _this._owner.removeItem(lines[0].index, lines.length, delay);
                            _this._owner.update();
                        });
                    }
                }
            };
            /**
             * 自身をリストの可視領域に表示
             *
             * @param options {EnsureVisibleOptions} [in] オプション
             */
            GroupProfile.prototype.ensureVisible = function (options) {
                if (0 < this._lines.length) {
                    this._owner.ensureVisible(this._lines[0].index, options);
                }
                else if (null != options.callback) {
                    options.callback();
                }
            };
            /**
             * 開閉のトグル
             *
             * @param delay {Number} [in] collapse の要素削除に費やす遅延時間. 既定: animationDuration 値
             */
            GroupProfile.prototype.toggle = function (delay) {
                if (this._expanded) {
                    this.collapse(delay);
                }
                else {
                    this.expand();
                }
            };
            /**
             * 展開状態を判定
             *
             * @return {Boolean} true: 展開, false:収束
             */
            GroupProfile.prototype.isExpanded = function () {
                return this._expanded;
            };
            /**
             * list view へ登録
             * Top Group のみ登録可能
             *
             * @param insertTo {Number} 挿入位置を index で指定
             * @return {GroupProfile} 本インスタンス
             */
            GroupProfile.prototype.register = function (insertTo) {
                if (this._parent) {
                    console.error(TAG + "logic error: 'register' method is acceptable only top group.");
                }
                else {
                    this._owner._addLine(this.preprocess("registered"), insertTo);
                }
                return this;
            };
            /**
             * list view へ復元
             * Top Group のみ登録可能
             *
             * @return {GroupProfile} 本インスタンス
             */
            GroupProfile.prototype.restore = function () {
                var lines = [];
                if (this._parent) {
                    console.error(TAG + "logic error: 'restore' method is acceptable only top group.");
                }
                else if (this._lines) {
                    if (this._expanded) {
                        lines = this._lines.concat(this.queryOperationTarget("active"));
                    }
                    else {
                        lines = this._lines;
                    }
                    this._owner._addLine(lines);
                }
                return this;
            };
            /**
             * 配下の最後の line index を取得
             *
             * @param withActiveChildren {Boolean} [in] 登録済みの子 GroupProfile を含めて検索する場合は true を指定
             * @return {Number} index. エラーの場合は null.
             */
            GroupProfile.prototype.getLastLineIndex = function (withActiveChildren) {
                var _this = this;
                if (withActiveChildren === void 0) { withActiveChildren = false; }
                var lines = (function () {
                    var lines;
                    if (withActiveChildren) {
                        lines = _this.queryOperationTarget("active");
                    }
                    if (null == lines || lines.length <= 0) {
                        lines = _this._lines;
                    }
                    return lines;
                })();
                if (lines.length <= 0) {
                    console.error(TAG + "logic error: this group is stil not registered.");
                    return null;
                }
                else {
                    return lines[lines.length - 1].index;
                }
            };
            Object.defineProperty(GroupProfile.prototype, "id", {
                /**
                 * ID を取得
                 *
                 * @return {String} 割り振られた ID
                 */
                get: function () {
                    return this._id;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GroupProfile.prototype, "status", {
                /**
                 * ステータスを取得
                 *
                 * @return {String} ステータス文字列
                 */
                get: function () {
                    return this._status;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // private method
            /* tslint:disable:no-unused-variable */
            /**
             * 親 Group 指定
             *
             * @param parent {GroupProfile} [in] 親 GroupProfile インスタンス
             */
            GroupProfile.prototype.setParent = function (parent) {
                this._parent = parent;
            };
            /* tslint:enable:no-unused-variable */
            /**
             * register / unregister の前処理
             *
             * @param newStatus {String} [in] 新ステータス文字列
             * @return {LineProfile[]} 更新すべき LineProfile の配列
             */
            GroupProfile.prototype.preprocess = function (newStatus) {
                var lines = [];
                if (newStatus !== this._status && null != this._lines) {
                    lines = this._lines;
                }
                this._status = newStatus;
                return lines;
            };
            /**
             * 操作対象の LineProfile 配列を取得
             *
             * @param newStatus {String} [in] 新ステータス文字列
             * @return {LineProfile[]} 操作対象の LineProfile の配列
             */
            GroupProfile.prototype.queryOperationTarget = function (operation) {
                var findTargets = function (group) {
                    var lines = [];
                    group._children.forEach(function (group) {
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
                /**
                 * 自身の管理するアクティブな LineProfie を取得
                 *
                 * @return {LineProfile[]} LineProfie 配列
                 */
                get: function () {
                    var key = this._owner.layoutKey;
                    if (null != key) {
                        return this._mapLines[key];
                    }
                    else {
                        return this._mapLines[GroupProfile.LAYOUT_KEY_DEFAULT];
                    }
                },
                enumerable: true,
                configurable: true
            });
            GroupProfile.LAYOUT_KEY_DEFAULT = "-layout-default";
            return GroupProfile;
        }());
        UI.GroupProfile = GroupProfile;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));




var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        // cdp.ui.listview は cdp.core に依存しないため、独自にglobal を提供する
        UI.global = CDP.global || window;
        /**
         * Backbone.View の新規合成
         *
         * @param base    {Backbone.View}                 [in] prototype chain 最下位の View クラス
         * @param derives {Backbone.View|Backbone.View[]} [in] 派生されるの View クラス
         * @return {Backbone.View|Backbone.View[]} 新規に生成された View のコンストラクタ
         */
        function composeViews(base, derives) {
            var _composed = base;
            var _derives = (derives instanceof Array ? derives : [derives]);
            _derives.forEach(function (derive) {
                var seed = {};
                _.extendOwn(seed, derive.prototype);
                delete seed.constructor;
                _composed = _composed.extend(seed);
            });
            return _composed;
        }
        UI.composeViews = composeViews;
        /**
         * Backbone.View の合成
         * prototype chain を作る合成
         *
         * @param derived {Backbone.View}                 [in] prototype chain 最上位の View クラス
         * @param bases   {Backbone.View|Backbone.View[]} [in] 合成元のView クラス
         */
        function deriveViews(derived, bases) {
            var _composed;
            var _bases = (bases instanceof Array ? bases : [bases]);
            if (2 <= _bases.length) {
                _composed = composeViews(_bases[0], _bases.slice(1));
            }
            else {
                _composed = _bases[0];
            }
            derived = composeViews(_composed, derived);
        }
        UI.deriveViews = deriveViews;
        /**
         * Backbone.View の合成
         * prototype chain を作らない合成
         *
         * @param derived {Backbone.View}                 [in] 元となる View クラス
         * @param bases   {Backbone.View|Backbone.View[]} [in] 合成元のView クラス
         */
        function mixinViews(derived, bases) {
            var _bases = (bases instanceof Array ? bases : [bases]);
            _bases.forEach(function (base) {
                Object.getOwnPropertyNames(base.prototype).forEach(function (name) {
                    derived.prototype[name] = base.prototype[name];
                });
            });
        }
        UI.mixinViews = mixinViews;
        //___________________________________________________________________________________________________________________//
        /**
         * @class _ListViewUtils
         * @brief 内部で使用する便利関数
         *        Tools からの最低限の流用
         */
        var _ListViewUtils;
        (function (_ListViewUtils) {
            /**
             * css の vender 拡張 prefix を返す
             *
             * @return {Array} prefix
             */
            _ListViewUtils.cssPrefixes = ["-webkit-", "-moz-", "-ms-", "-o-", ""];
            /**
             * css の matrix の値を取得.
             *
             * @param element {jQuery} [in] 対象の jQuery オブジェクト
             * @param type    {String} [in] matrix type string [translateX | translateY | scaleX | scaleY]
             * @return {Number} value
             */
            _ListViewUtils.getCssMatrixValue = function (element, type) {
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
            /**
             * "transitionend" のイベント名配列を返す
             *
             * @return {Array} transitionend イベント名
             */
            _ListViewUtils.transitionEnd = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";
            /**
             * transition 設定
             *
             * @private
             * @param {Object} element
             */
            _ListViewUtils.setTransformsTransitions = function (element, prop, msec, timingFunction) {
                var $element = $(element);
                var transitions = {};
                var second = (msec / 1000) + "s";
                var animation = " " + second + " " + timingFunction;
                var transform = ", transform" + animation;
                for (var i = 0; i < _ListViewUtils.cssPrefixes.length; i++) {
                    transitions[_ListViewUtils.cssPrefixes[i] + "transition"] = prop + animation + transform;
                }
                $element.css(transitions);
            };
            /**
             * transition 設定の削除
             *
             * @private
             * @param {Object} element
             */
            _ListViewUtils.clearTransitions = function (element) {
                var $element = $(element);
                $element.off(_ListViewUtils.transitionEnd);
                var transitions = {};
                for (var i = 0; i < _ListViewUtils.cssPrefixes.length; i++) {
                    transitions[_ListViewUtils.cssPrefixes[i] + "transition"] = "";
                }
                $element.css(transitions);
            };
            /**
             * Math.abs よりも高速な abs
             */
            _ListViewUtils.abs = function (x) {
                return x >= 0 ? x : -x;
            };
            /**
             * Math.max よりも高速な max
             */
            _ListViewUtils.max = function (lhs, rhs) {
                return lhs >= rhs ? lhs : rhs;
            };
        })(_ListViewUtils = UI._ListViewUtils || (UI._ListViewUtils = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.StatusManager] ";
        /**
         * @class StatusManager
         * @brief UI 用状態管理クラス
         *        StatusManager のインスタンスごとに任意の状態管理ができる
         *
         */
        var StatusManager = (function () {
            function StatusManager() {
                this._status = {}; //< statusScope() に使用される状態管理オブジェクト
            }
            ///////////////////////////////////////////////////////////////////////
            // Implements: IStatusManager
            // 状態変数の参照カウントのインクリメント
            StatusManager.prototype.statusAddRef = function (status) {
                if (!this._status[status]) {
                    this._status[status] = 1;
                }
                else {
                    this._status[status]++;
                }
                return this._status[status];
            };
            // 状態変数の参照カウントのデクリメント
            StatusManager.prototype.statusRelease = function (status) {
                var retval;
                if (!this._status[status]) {
                    retval = 0;
                }
                else {
                    this._status[status]--;
                    retval = this._status[status];
                    if (0 === retval) {
                        delete this._status[status];
                    }
                }
                return retval;
            };
            // 処理スコープ毎に状態変数を設定
            StatusManager.prototype.statusScope = function (status, callback) {
                this.statusAddRef(status);
                callback();
                this.statusRelease(status);
            };
            // 指定した状態中であるか確認
            StatusManager.prototype.isStatusIn = function (status) {
                return !!this._status[status];
            };
            return StatusManager;
        }());
        UI.StatusManager = StatusManager;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.PageProfile] ";
        /**
         * @class PageProfile
         * @brief 1 ページに関するプロファイルクラス
         *        framework が使用する
         *        本クラスでは直接 DOM を操作してはいけない
         */
        var PageProfile = (function () {
            function PageProfile() {
                this._index = 0; //< page index
                this._offset = 0; //< page の Top からのオフセット
                this._height = 0; //< page の高さ
                this._lines = []; //< page 内で管理される LineProfile
                this._status = "inactive"; //< page の状態 [ inactive | hidden | active ]
            }
            ///////////////////////////////////////////////////////////////////////
            // public methods
            // 有効化
            PageProfile.prototype.activate = function () {
                if ("active" !== this._status) {
                    this._lines.forEach(function (line) {
                        line.activate();
                    });
                }
                this._status = "active";
            };
            // 無可視化
            PageProfile.prototype.hide = function () {
                if ("hidden" !== this._status) {
                    this._lines.forEach(function (line) {
                        line.hide();
                    });
                }
                this._status = "hidden";
            };
            // 無効化
            PageProfile.prototype.inactivate = function () {
                if ("inactive" !== this._status) {
                    this._lines.forEach(function (line) {
                        line.inactivate();
                    });
                }
                this._status = "inactive";
            };
            // LineProfile を設定
            PageProfile.prototype.push = function (line) {
                this._lines.push(line);
                this._height += line.height;
            };
            // 配下の LineProfile すべてが有効でない場合、Page ステータスを無効にする
            PageProfile.prototype.normalize = function () {
                var enableAll = _.every(this._lines, function (line) {
                    return line.isActive();
                });
                if (!enableAll) {
                    this._status = "inactive";
                }
            };
            // LineProfile を取得
            PageProfile.prototype.getLineProfile = function (index) {
                if (0 <= index && index < this._lines.length) {
                    return this._lines[index];
                }
                else {
                    return null;
                }
            };
            // 最初の LineProfile を取得
            PageProfile.prototype.getLineProfileFirst = function () {
                return this.getLineProfile(0);
            };
            // 最後の LineProfile を取得
            PageProfile.prototype.getLineProfileLast = function () {
                return this.getLineProfile(this._lines.length - 1);
            };
            Object.defineProperty(PageProfile.prototype, "index", {
                ///////////////////////////////////////////////////////////////////////
                // getter/setter methods
                // getter: page index
                get: function () {
                    return this._index;
                },
                // setter: page index
                set: function (index) {
                    this._index = index;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageProfile.prototype, "offset", {
                // getter: page offset
                get: function () {
                    return this._offset;
                },
                // setter: page offset
                set: function (offset) {
                    this._offset = offset;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageProfile.prototype, "height", {
                // getter: 実際にページに割り当てられている高さ
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageProfile.prototype, "status", {
                // getter: 状態取得
                get: function () {
                    return this._status;
                },
                enumerable: true,
                configurable: true
            });
            return PageProfile;
        }());
        UI.PageProfile = PageProfile;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));


var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var _Utils = CDP.UI._ListViewUtils;
        var TAG = "[CDP.UI.ScrollerElement] ";
        /**
         * @class ScrollerElement
         * @brief HTMLElement の Scroller クラス
         */
        var ScrollerElement = (function () {
            function ScrollerElement(element, options) {
                this._$target = null;
                this._$scrollMap = null;
                this._listviewOptions = null;
                this._$target = $(element);
                this._listviewOptions = options;
            }
            // Scroller の型を取得
            ScrollerElement.prototype.getType = function () {
                return ScrollerElement.TYPE;
            };
            // position 取得
            ScrollerElement.prototype.getPos = function () {
                return this._$target.scrollTop();
            };
            // position の最大値を取得
            ScrollerElement.prototype.getPosMax = function () {
                if (null == this._$scrollMap) {
                    this._$scrollMap = this._$target.children().first();
                }
                return _Utils.max(this._$scrollMap.height() - this._$target.height(), 0);
            };
            // イベント登録
            ScrollerElement.prototype.on = function (type, func) {
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
            // イベント登録解除
            ScrollerElement.prototype.off = function (type, func) {
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
            // スクロール位置を指定
            ScrollerElement.prototype.scrollTo = function (pos, animate, time) {
                if (!this._listviewOptions.enableAnimation || !animate) {
                    this._$target.scrollTop(pos);
                }
                else {
                    if (null == time) {
                        time = this._listviewOptions.animationDuration;
                    }
                    this._$target.animate({
                        scrollTop: pos
                    }, time);
                }
            };
            // Scroller の状態更新
            ScrollerElement.prototype.update = function () {
                // noop.
            };
            // Scroller の破棄
            ScrollerElement.prototype.destroy = function () {
                this._$scrollMap = null;
                if (this._$target) {
                    this._$target.off();
                    this._$target = null;
                }
            };
            Object.defineProperty(ScrollerElement, "TYPE", {
                // タイプ定義
                get: function () {
                    return "element-overflow";
                },
                enumerable: true,
                configurable: true
            });
            // factory 取得
            ScrollerElement.getFactory = function () {
                var factory = function (element, options) {
                    return new ScrollerElement(element, options);
                };
                // set type signature.
                factory.type = ScrollerElement.TYPE;
                return factory;
            };
            return ScrollerElement;
        }());
        UI.ScrollerElement = ScrollerElement;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));


var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var _Utils = CDP.UI._ListViewUtils;
        var TAG = "[CDP.UI.ScrollerNative] ";
        /**
         * @class ScrollerNative
         * @brief Browser Native の Scroller クラス
         */
        var ScrollerNative = (function () {
            // constructor
            function ScrollerNative(options) {
                this._$body = null;
                this._$target = null;
                this._$scrollMap = null;
                this._listviewOptions = null;
                this._$target = $(document);
                this._$body = $("body");
                this._listviewOptions = options;
            }
            // Scroller の型を取得
            ScrollerNative.prototype.getType = function () {
                return ScrollerNative.TYPE;
            };
            // position 取得
            ScrollerNative.prototype.getPos = function () {
                return this._$target.scrollTop();
            };
            // position の最大値を取得
            ScrollerNative.prototype.getPosMax = function () {
                return _Utils.max(this._$target.height() - window.innerHeight, 0);
            };
            // イベント登録
            ScrollerNative.prototype.on = function (type, func) {
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
            // イベント登録解除
            ScrollerNative.prototype.off = function (type, func) {
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
            // スクロール位置を指定
            ScrollerNative.prototype.scrollTo = function (pos, animate, time) {
                if (!this._listviewOptions.enableAnimation || !animate) {
                    this._$body.scrollTop(pos);
                }
                else {
                    if (null == time) {
                        time = this._listviewOptions.animationDuration;
                    }
                    this._$body.animate({
                        scrollTop: pos
                    }, time);
                }
            };
            // Scroller の状態更新
            ScrollerNative.prototype.update = function () {
                // noop.
            };
            // Scroller の破棄
            ScrollerNative.prototype.destroy = function () {
                this._$scrollMap = null;
                this._$target = null;
            };
            Object.defineProperty(ScrollerNative, "TYPE", {
                // タイプ定義
                get: function () {
                    return "native-scroll";
                },
                enumerable: true,
                configurable: true
            });
            // factory 取得
            ScrollerNative.getFactory = function () {
                var factory = function (element, options) {
                    return new ScrollerNative(options);
                };
                // set type signature.
                factory.type = ScrollerNative.TYPE;
                return factory;
            };
            return ScrollerNative;
        }());
        UI.ScrollerNative = ScrollerNative;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));



var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var _Config = CDP.UI.ListViewGlobalConfig;
        var _Utils = CDP.UI._ListViewUtils;
        var TAG = "[CDP.UI.ScrollerIScroll] ";
        /**
         * @class ScrollerIScroll
         * @brief iScroll を使用した Scroller クラス
         */
        var ScrollerIScroll = (function () {
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
                }
                else {
                    console.error(TAG + "iscroll module doesn't load.");
                }
            }
            // Scroller の型を取得
            ScrollerIScroll.prototype.getType = function () {
                return ScrollerIScroll.TYPE;
            };
            // position 取得
            ScrollerIScroll.prototype.getPos = function () {
                var pos = this._iscroll.getComputedPosition().y;
                if (_.isNaN(pos)) {
                    pos = 0;
                }
                else {
                    pos = -pos;
                }
                return pos;
            };
            // position の最大値を取得
            ScrollerIScroll.prototype.getPosMax = function () {
                return _Utils.max(-this._iscroll.maxScrollY, 0);
            };
            // イベント登録
            ScrollerIScroll.prototype.on = function (type, func) {
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
            // イベント登録解除
            ScrollerIScroll.prototype.off = function (type, func) {
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
            // スクロール位置を指定
            ScrollerIScroll.prototype.scrollTo = function (pos, animate, time) {
                time = 0;
                if (this._listviewOptions.enableAnimation && animate) {
                    time = time || this._listviewOptions.animationDuration;
                }
                this._iscroll.scrollTo(0, -pos, time);
            };
            // Scroller の状態更新
            ScrollerIScroll.prototype.update = function () {
                var _this = this;
                if (this._$owner) {
                    // update wrapper
                    (function () {
                        var ownerHeight = _this._$owner.height();
                        if (ownerHeight !== _this._$wrapper.height()) {
                            _this._$wrapper.height(ownerHeight);
                        }
                    })();
                    if (null != this._refreshTimerId) {
                        clearTimeout(this._refreshTimerId);
                    }
                    var proc_1 = function () {
                        if (_this._$scroller && _this._$scroller.height() !== _this._iscroll.scrollerHeight) {
                            _this._iscroll.refresh();
                            _this._refreshTimerId = setTimeout(proc_1, _this._listviewOptions.scrollMapRefreshInterval);
                        }
                        else {
                            _this._refreshTimerId = null;
                        }
                    };
                    this._iscroll.refresh();
                    this._refreshTimerId = setTimeout(proc_1, this._listviewOptions.scrollMapRefreshInterval);
                }
            };
            // Scroller の破棄
            ScrollerIScroll.prototype.destroy = function () {
                this._$scroller = null;
                this._$wrapper = null;
                this._iscroll.destroy();
                this._$owner = null;
            };
            Object.defineProperty(ScrollerIScroll, "TYPE", {
                // タイプ定義
                get: function () {
                    return "iscroll";
                },
                enumerable: true,
                configurable: true
            });
            // factory 取得
            ScrollerIScroll.getFactory = function (options) {
                var defaultOpt = {
                    scrollX: false,
                    bounce: false,
                    mouseWheel: true,
                    scrollbars: true,
                    interactiveScrollbars: true,
                    shrinkScrollbars: "scale",
                    fadeScrollbars: true,
                    probeType: 2,
                };
                var iscrollOptions = $.extend({}, defaultOpt, options);
                var factory = function (element, listviewOptions) {
                    var $owner = $(element);
                    var $map = $owner.find(_Config.SCROLL_MAP_SELECTOR);
                    var $wrapper = $("<div class='" + _Config.WRAPPER_CLASS + "'></div>")
                        .css({
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                    });
                    $map.wrap($wrapper);
                    return new ScrollerIScroll($owner, _Config.WRAPPER_SELECTOR, iscrollOptions, listviewOptions);
                };
                // set type signature.
                factory.type = ScrollerIScroll.TYPE;
                return factory;
            };
            return ScrollerIScroll;
        }());
        UI.ScrollerIScroll = ScrollerIScroll;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.ListItemView] ";
        /**
         * @class ListItemView
         * @brief ListView が扱う ListItem コンテナクラス
         */
        var ListItemView = (function (_super) {
            __extends(ListItemView, _super);
            /**
             * constructor
             */
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
            ///////////////////////////////////////////////////////////////////////
            // Implements: ListItemView
            // 描画: framework から呼び出されるため、オーバーライド必須
            ListItemView.prototype.render = function () {
                console.warn(TAG + "need override 'render()' method.");
                return this;
            };
            // 自身の Line インデックスを取得
            ListItemView.prototype.getIndex = function () {
                return this._lineProfile.index;
            };
            // 自身に指定された高さを取得
            ListItemView.prototype.getSpecifiedHeight = function () {
                return this._lineProfile.height;
            };
            // child node が存在するか判定
            ListItemView.prototype.hasChildNode = function () {
                if (!this.$el) {
                    return false;
                }
                else {
                    return 0 < this.$el.children().length;
                }
            };
            /**
             * 高さを更新
             *
             * @param newHeight {Number}              [in] 新しい高さ
             * @param options   {UpdateHeightOptions} [in] line の高さ更新時に影響するすべての LineProfile の再計算を行う場合は { reflectAll: true }
             * @return {ListItemView} インスタンス
             */
            ListItemView.prototype.updateHeight = function (newHeight, options) {
                if (this.$el) {
                    if (this.getSpecifiedHeight() !== newHeight) {
                        this._lineProfile.updateHeight(newHeight, options);
                        this.$el.height(newHeight);
                    }
                }
                return this;
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IComposableView
            /**
             * すでに定義された Backbone.View を基底クラスに設定し、extend を実行する。
             *
             * @param derives         {Backbone.View|Backbone.View[]} [in] 合成元の View クラス
             * @param properties      {Object}                        [in] prototype プロパティ
             * @param classProperties {Object}                        [in] static プロパティ
             * @return {Backbone.View|Backbone.View[]} 新規に生成された View のコンストラクタ
             */
            ListItemView.compose = function (derives, properties, classProperties) {
                var composed = UI.composeViews(ListItemView, derives);
                return composed.extend(properties, classProperties);
            };
            ///////////////////////////////////////////////////////////////////////
            // Override: Backbone.View
            // 開放
            ListItemView.prototype.remove = function () {
                // xperia AX Jelly Bean (4.1.2)にて、メモリーリークを軽減させる効果
                this.$el.find("figure").css("background-image", "none");
                // this.$el は再利用するため破棄しない
                this.$el.children().remove();
                this.$el.off();
                this.$el = null;
                this.stopListening();
                this._lineProfile = null;
                return this;
            };
            Object.defineProperty(ListItemView.prototype, "owner", {
                ///////////////////////////////////////////////////////////////////////
                // short cut methods
                // Owner 取得
                get: function () {
                    return this._owner;
                },
                enumerable: true,
                configurable: true
            });
            return ListItemView;
        }(Backbone.View));
        UI.ListItemView = ListItemView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));


/* tslint:disable:no-bitwise no-unused-expression */
/* jshint -W030 */ // for "Expected an assignment or function call and instead saw an expression"
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var _Config = CDP.UI.ListViewGlobalConfig;
        var _Utils = CDP.UI._ListViewUtils;
        var TAG = "[CDP.UI.ScrollManager] ";
        /**
         * @class ScrollManager
         * @brief メモリ管理を行うスクロール処理のコアロジック実装クラス
         *        本クラスは IListView インターフェイスを持ち DOM にアクセスするが、Backbone.View を継承しない
         */
        var ScrollManager = (function () {
            /**
             * constructor
             *
             * @param _$root  {JQuery} [in] 管理対象のルートエレメント
             * @param options {ListViewOptions} [in] オプション
             */
            function ScrollManager(options) {
                var _this = this;
                this._$root = null; //< Scroll 対象のルートオブジェクト
                this._$map = null; //< Scroll Map element を格納
                this._mapHeight = 0; //< Scroll Map の高さを格納 (_$map の状態に依存させない)
                this._scroller = null; //< Scroll に使用する IScroller インスタンス
                this._settings = null; //< ScrollManager オプションを格納
                this._active = true; //< UI 表示中は true に指定
                this._scrollEventHandler = null; //< Scroll Event Handler
                this._scrollStopEventHandler = null; //< Scroll Stop Event Handler
                this._baseHeight = 0; //< 高さの基準値
                this._lines = []; //< 管理下にある LineProfile 配列
                this._pages = []; //< 管理下にある PageProfile 配列
                // 最新の表示領域情報を格納 (Scroll 中の更新処理に使用)
                this._lastActivePageContext = {
                    index: 0,
                    from: 0,
                    to: 0,
                    pos: 0,
                };
                this._backup = {}; //< データの backup 領域. key と _lines を格納。派生クラスで拡張可能。
                // ListViewOptions 既定値
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
                    useDummyInactiveScrollMap: false,
                };
                // 設定格納
                this._settings = $.extend({}, defOptions, options);
                // スクロールイベント
                this._scrollEventHandler = function (event) {
                    _this.onScroll(_this._scroller.getPos());
                };
                // スクロール停止イベント
                this._scrollStopEventHandler = function (event) {
                    _this.onScrollStop(_this._scroller.getPos());
                };
            }
            ///////////////////////////////////////////////////////////////////////
            // public method
            // 内部オブジェクトの初期化
            ScrollManager.prototype.initialize = function ($root, height) {
                // 既に構築されていた場合は破棄
                if (this._$root) {
                    this.destroy();
                }
                this._$root = $root;
                this._$map = $root.hasClass(_Config.SCROLL_MAP_CLASS) ? $root : $root.find(_Config.SCROLL_MAP_SELECTOR);
                // _$map が無い場合は初期化しない
                if (this._$map.length <= 0) {
                    this._$root = null;
                    return false;
                }
                this._scroller = this.createScroller();
                this.setBaseHeight(height);
                this.setScrollerCondition();
                return true;
            };
            // 内部オブジェクトの破棄
            ScrollManager.prototype.destroy = function () {
                if (this._scroller) {
                    this.resetScrollerCondition();
                    this._scroller.destroy();
                    this._scroller = null;
                }
                this.release();
                this._$map = null;
                this._$root = null;
            };
            // ページの基準値を取得
            ScrollManager.prototype.setBaseHeight = function (height) {
                this._baseHeight = height;
                if (this._baseHeight <= 0) {
                    console.warn(TAG + "invalid base height: " + this._baseHeight);
                }
                if (this._scroller) {
                    this._scroller.update();
                }
            };
            // active 状態設定
            ScrollManager.prototype.setActiveState = function (active) {
                this._active = active;
                this.treatScrollPosition();
            };
            // active 状態判定
            ScrollManager.prototype.isActive = function () {
                return this._active;
            };
            // scroller の種類を取得
            ScrollManager.prototype.getScrollerType = function () {
                return this._settings.scrollerFactory.type;
            };
            /**
             * 状態に応じたスクロール位置の保存/復元
             * cdp.ui.fs.js: PageTabListView が実験的に使用
             * TODO: ※iscroll は未対応
             */
            ScrollManager.prototype.treatScrollPosition = function () {
                var _this = this;
                var i;
                var transform = {};
                var updateOffset = function ($target, offset) {
                    offset = offset || (_this._scroller.getPos() - _this._lastActivePageContext.pos);
                    if (_Utils.getCssMatrixValue($target, "translateY") !== offset) {
                        for (i = 0; i < _Utils.cssPrefixes.length; i++) {
                            transform[_Utils.cssPrefixes[i] + "transform"] = "translate3d(0px," + offset + "px,0px)";
                        }
                        $target.css(transform);
                        return $target;
                    }
                };
                var clearOffset = function ($target) {
                    for (i = 0; i < _Utils.cssPrefixes.length; i++) {
                        transform[_Utils.cssPrefixes[i] + "transform"] = "";
                    }
                    $target.css(transform);
                    return $target;
                };
                if (this._active) {
                    // 以下のスコープの処理に対して画面更新を1回にできないため、JB, ICS ではちらつきが発生する。Kitkat 以降は良好。
                    (function () {
                        if (_this._scroller) {
                            _this._scroller.scrollTo(_this._lastActivePageContext.pos, false, 0);
                        }
                        clearOffset(_this._$map).css("display", "block");
                    })();
                    if (this._settings.useDummyInactiveScrollMap) {
                        this.prepareInactiveMap().remove();
                    }
                }
                else {
                    if (this._settings.useDummyInactiveScrollMap) {
                        updateOffset(this.prepareInactiveMap());
                    }
                    else {
                        updateOffset(this._$map);
                    }
                }
            };
            // inactive 用 Map の生成
            ScrollManager.prototype.prepareInactiveMap = function () {
                var $parent = this._$map.parent();
                var $inactiveMap = $parent.find(_Config.INACTIVE_CLASS_SELECTOR);
                if ($inactiveMap.length <= 0) {
                    var currentPageIndex_1 = this.getPageIndex();
                    var $listItemViews = this._$map.clone().children().filter(function (index, element) {
                        var pageIndex = ~~$(element).attr(_Config.DATA_PAGE_INDEX);
                        if (currentPageIndex_1 - 1 <= pageIndex || pageIndex <= currentPageIndex_1 + 1) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    });
                    $inactiveMap = $("<section class='" + _Config.SCROLL_MAP_CLASS + " " + _Config.INACTIVE_CLASS + "'></section>")
                        .append($listItemViews)
                        .height(this._mapHeight);
                    $parent.append($inactiveMap);
                    this._$map.css("display", "none");
                }
                return $inactiveMap;
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView プロファイル管理
            // 初期化済みか判定
            ScrollManager.prototype.isInitialized = function () {
                return !!this._$root;
            };
            // プロパティを指定して、LineProfile を管理
            ScrollManager.prototype.addItem = function (height, initializer, info, insertTo) {
                this._addLine(new UI.LineProfile(this, Math.floor(height), initializer, info), insertTo);
            };
            // プロパティを指定して、LineProfile を管理. 登録 framework が使用する
            ScrollManager.prototype._addLine = function (_line, insertTo) {
                var i, n;
                var deltaHeight = 0;
                var lines = (_line instanceof Array) ? _line : [_line];
                var addTail = false;
                if (null == insertTo) {
                    insertTo = this._lines.length;
                }
                if (insertTo === this._lines.length) {
                    addTail = true;
                }
                // scroll map の更新
                for (i = 0, n = lines.length; i < n; i++) {
                    deltaHeight += lines[i].height;
                }
                this.updateScrollMapHeight(deltaHeight);
                // 挿入
                for (i = lines.length - 1; i >= 0; i--) {
                    this._lines.splice(insertTo, 0, lines[i]);
                }
                // page 設定の解除
                if (!addTail) {
                    if (0 === insertTo) {
                        this.clearPage();
                    }
                    else if (null != this._lines[insertTo - 1].pageIndex) {
                        this.clearPage(this._lines[insertTo - 1].pageIndex);
                    }
                }
                // offset の再計算
                this.updateProfiles(insertTo);
            };
            // 指定した Item を削除
            ScrollManager.prototype.removeItem = function (index, size, delay) {
                var _this = this;
                if (null == size) {
                    size = 1;
                }
                if (index < 0 || this._lines.length < index + size) {
                    console.error(TAG + "logic error. GroupProfile.removeItem(), invalid index: " + index);
                    return;
                }
                delay = (null != delay) ? delay : 0;
                var setupTransition = function ($map, delay) {
                    var transitionEndHandler = function (event) {
                        $map.off(_Utils.transitionEnd);
                        _Utils.clearTransitions($map);
                    };
                    _this._$map.on(_Utils.transitionEnd, transitionEndHandler);
                    _Utils.setTransformsTransitions($map, "height", delay, "ease");
                };
                var delta = 0;
                var removed = [];
                var mapTransition = false;
                // 削除候補と変化量の算出
                (function () {
                    var line;
                    for (var i = 0; i < size; i++) {
                        line = _this._lines[index + i];
                        delta += line.height;
                        // 削除要素の z-index の初期化
                        line.resetDepth();
                        removed.push(line);
                    }
                    // 自動設定・削除遅延時間が設定されかつ、スクロールポジションに変更がある場合は transition 設定
                    if (_this._settings.removeItemWithTransition && (0 < delay)) {
                        var current = _this.getScrollPos();
                        var posMax = _this.getScrollPosMax() - delta;
                        mapTransition = (posMax < current);
                    }
                })();
                // 更新
                (function () {
                    // transition 設定
                    if (mapTransition) {
                        setupTransition(_this._$map, delay);
                    }
                    // page 設定の解除
                    if (null != _this._lines[index].pageIndex) {
                        _this.clearPage(_this._lines[index].pageIndex);
                    }
                    // スクロール領域の更新
                    _this.updateScrollMapHeight(-delta);
                    // 配列から削除
                    _this._lines.splice(index, size);
                    // offset の再計算
                    _this.updateProfiles(index);
                    // 遅延削除
                    setTimeout(function () {
                        removed.forEach(function (line) {
                            line.inactivate();
                        });
                    }, delay);
                })();
            };
            ScrollManager.prototype.getItemInfo = function (target) {
                var index;
                var parser = function ($target) {
                    if ($target.hasClass(_Config.LISTITEM_BASE_CLASS)) {
                        return ~~$target.attr(_Config.DATA_CONTAINER_INDEX);
                    }
                    else if ($target.hasClass(_Config.SCROLL_MAP_CLASS) || $target.length <= 0) {
                        console.warn(TAG + "cannot ditect line from event object.");
                        return null;
                    }
                    else {
                        return parser($target.parent());
                    }
                };
                if (target instanceof $.Event) {
                    index = parser($(target.currentTarget));
                }
                else if (typeof target === "number") {
                    index = target;
                }
                if (null == index) {
                    console.error(TAG + "logic error. unsupported arg type. type: " + typeof target);
                    return null;
                }
                else if (index < 0 || this._lines.length <= index) {
                    console.error(TAG + "logic error. invalid range. index: " + index);
                    return null;
                }
                return this._lines[index].info;
            };
            // アクティブページを更新
            ScrollManager.prototype.refresh = function () {
                var _this = this;
                var targets = {};
                var searchCount = this._settings.pagePrepareCount + this._settings.pagePreloadCount;
                var currentPageIndex = this.getPageIndex();
                var highPriorityIndex = [];
                var oldExsistPage = _.filter(this._pages, function (page) {
                    return "inactive" !== page.status;
                });
                var changeState = function (index) {
                    if (index === currentPageIndex) {
                        targets[index] = "activate";
                        highPriorityIndex.push(index);
                    }
                    else if (_Utils.abs(currentPageIndex - index) <= _this._settings.pagePrepareCount) {
                        targets[index] = "activate";
                    }
                    else {
                        if (_this._settings.enableHiddenPage) {
                            targets[index] = "hide";
                        }
                        else {
                            targets[index] = "activate";
                        }
                    }
                    // current page の 前後は high priority にする
                    if (currentPageIndex + 1 === index || currentPageIndex - 1 === index) {
                        highPriorityIndex.push(index);
                    }
                };
                // 対象無し
                if (this._lines.length <= 0) {
                    return;
                }
                (function () {
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
                        for (i = 0, pageIndex = currentPageIndex + searchCount + 1; i < overflowPrev; i++, pageIndex++) {
                            if (_this._pages.length <= pageIndex) {
                                break;
                            }
                            changeState(pageIndex);
                        }
                    }
                    if (0 < overflowNext) {
                        for (i = 0, pageIndex = currentPageIndex - searchCount - 1; i < overflowNext; i++, pageIndex--) {
                            if (pageIndex < 0) {
                                break;
                            }
                            changeState(pageIndex);
                        }
                    }
                })();
                // 不要になった page の inactivate
                oldExsistPage.forEach(function (page) {
                    var index = page.index;
                    if (null == targets[index]) {
                        page.inactivate();
                    }
                });
                // 優先 page の activate
                highPriorityIndex
                    .sort(function (lhs, rhs) {
                    if (lhs < rhs) {
                        return -1;
                    }
                    else if (lhs > rhs) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                })
                    .forEach(function (index) {
                    setTimeout(function () {
                        if (_this.isInitialized()) {
                            _this._pages[index] && _this._pages[index].activate();
                        }
                    }, 0);
                });
                // そのほかの page の 状態変更
                _.each(targets, function (action, key) {
                    setTimeout(function () {
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
                // 更新後に使用しなかった DOM を削除
                this.findRecycleElements().remove();
                this._lastActivePageContext.from = this._pages[currentPageIndex].getLineProfileFirst().index;
                this._lastActivePageContext.to = this._pages[currentPageIndex].getLineProfileLast().index;
                this._lastActivePageContext.index = currentPageIndex;
            };
            // 未アサインページを構築
            ScrollManager.prototype.update = function () {
                var index = this._pages.length;
                this.assignPage(index);
                this.refresh();
            };
            // ページアサインを再構成
            ScrollManager.prototype.rebuild = function () {
                this.clearPage();
                this.assignPage();
                this.refresh();
            };
            // 管轄データを破棄
            ScrollManager.prototype.release = function () {
                this._lines.forEach(function (line) {
                    line.inactivate();
                });
                this._pages = [];
                this._lines = [];
                if (this._$map) {
                    this._mapHeight = 0;
                    this._$map.height(0);
                }
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Backup / Restore
            // 内部データをバックアップ
            ScrollManager.prototype.backup = function (key) {
                if (null == this._backup[key]) {
                    this._backup[key] = {
                        lines: this._lines,
                    };
                }
                return true;
            };
            // 内部データをリストア
            ScrollManager.prototype.restore = function (key, rebuild) {
                if (rebuild === void 0) { rebuild = true; }
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
            // バックアップデータの有無
            ScrollManager.prototype.hasBackup = function (key) {
                if (null != this._backup[key]) {
                    return true;
                }
                else {
                    return false;
                }
            };
            // バックアップデータの破棄
            ScrollManager.prototype.clearBackup = function (key) {
                if (null == key) {
                    this._backup = {};
                    return true;
                }
                else if (null != this._backup[key]) {
                    delete this._backup[key];
                    return true;
                }
                else {
                    return false;
                }
            };
            Object.defineProperty(ScrollManager.prototype, "backupData", {
                // バックアップデータにアクセス
                get: function () {
                    return this._backup;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Scroll
            // スクロールイベントハンドラ設定/解除
            ScrollManager.prototype.setScrollHandler = function (handler, on) {
                if (this._scroller) {
                    if (on) {
                        this._scroller.on("scroll", handler);
                    }
                    else {
                        this._scroller.off("scroll", handler);
                    }
                }
            };
            // スクロール終了イベントハンドラ設定/解除
            ScrollManager.prototype.setScrollStopHandler = function (handler, on) {
                if (this._scroller) {
                    if (on) {
                        this._scroller.on("scrollstop", handler);
                    }
                    else {
                        this._scroller.off("scrollstop", handler);
                    }
                }
            };
            // スクロール位置を取得
            ScrollManager.prototype.getScrollPos = function () {
                return this._scroller ? this._scroller.getPos() : 0;
            };
            // スクロール位置の最大値を取得
            ScrollManager.prototype.getScrollPosMax = function () {
                return this._scroller ? this._scroller.getPosMax() : 0;
            };
            // スクロール位置を指定
            ScrollManager.prototype.scrollTo = function (pos, animate, time) {
                if (this._scroller) {
                    if (pos < 0) {
                        console.warn(TAG + "invalid position, too small. [pos: " + pos + "]");
                        pos = 0;
                    }
                    else if (this._scroller.getPosMax() < pos) {
                        console.warn(TAG + "invalid position, too big. [pos: " + pos + "]");
                        pos = this._scroller.getPosMax();
                    }
                    // pos のみ先駆けて更新
                    this._lastActivePageContext.pos = pos;
                    if (pos !== this._scroller.getPos()) {
                        this._scroller.scrollTo(pos, animate, time);
                    }
                }
            };
            // 指定された ListItemView の表示を保証
            ScrollManager.prototype.ensureVisible = function (index, options) {
                var _this = this;
                if (index < 0 || this._lines.length <= index) {
                    console.warn(TAG + "ensureVisible(), invalid index, noop. [index: " + index + "]");
                    return;
                }
                else if (!this._scroller) {
                    console.warn(TAG + "scroller is not ready.");
                    return;
                }
                (function () {
                    var target = _this._lines[index];
                    var defaultOptions = {
                        partialOK: true,
                        setTop: false,
                        animate: _this._settings.enableAnimation,
                        time: _this._settings.animationDuration,
                        callback: function () { },
                    };
                    var operation = $.extend({}, defaultOptions, options);
                    var currentScope = {
                        from: _this._scroller.getPos(),
                        to: _this._scroller.getPos() + _this._baseHeight,
                    };
                    var targetScope = {
                        from: target.offset,
                        to: target.offset + target.height,
                    };
                    var isInScope = function () {
                        if (operation.partialOK) {
                            if (targetScope.from <= currentScope.from) {
                                if (currentScope.from <= targetScope.to) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                            else {
                                if (targetScope.from <= currentScope.to) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            }
                        }
                        else {
                            if (currentScope.from <= targetScope.from && targetScope.to <= currentScope.to) {
                                return true;
                            }
                            else {
                                return false;
                            }
                        }
                    };
                    var detectPosition = function () {
                        if (targetScope.from < currentScope.from) {
                            return targetScope.from;
                        }
                        else if (currentScope.from < targetScope.from) {
                            return target.offset - target.height; // bottom 合わせは情報不足により不可
                        }
                        else {
                            console.warn(TAG + "logic error.");
                            return 0;
                        }
                    };
                    var pos;
                    if (operation.setTop) {
                        pos = targetScope.from;
                    }
                    else if (isInScope()) {
                        // noop.
                        operation.callback();
                        return;
                    }
                    else {
                        pos = detectPosition();
                    }
                    // 補正
                    if (pos < 0) {
                        pos = 0;
                    }
                    else if (_this._scroller.getPosMax() < pos) {
                        pos = _this._scroller.getPosMax();
                    }
                    setTimeout(operation.callback, operation.time);
                    _this.scrollTo(pos, operation.animate, operation.time);
                })();
            };
            ///////////////////////////////////////////////////////////////////////
            // implements: IListViewFramework:
            // Scroll Map の高さを取得
            ScrollManager.prototype.getScrollMapHeight = function () {
                return this._$map ? this._mapHeight : 0;
            };
            // Scroll Map の高さを更新. framework が使用する.
            ScrollManager.prototype.updateScrollMapHeight = function (delta) {
                if (this._$map) {
                    this._mapHeight += delta;
                    // for fail safe.
                    if (this._mapHeight < 0) {
                        this._mapHeight = 0;
                    }
                    this._$map.height(this._mapHeight);
                }
            };
            // 内部 Profile の更新. framework が使用する.
            ScrollManager.prototype.updateProfiles = function (from) {
                var i, n;
                var last;
                for (i = from, n = this._lines.length; i < n; i++) {
                    if (0 < i) {
                        last = this._lines[i - 1];
                        this._lines[i].index = last.index + 1;
                        this._lines[i].offset = last.offset + last.height;
                    }
                    else {
                        this._lines[i].index = 0;
                        this._lines[i].offset = 0;
                    }
                }
            };
            // Scroll Map Element を取得. framework が使用する.
            ScrollManager.prototype.getScrollMapElement = function () {
                return this._$map || $("");
            };
            // リサイクル可能な Element を取得. framework が使用する.
            ScrollManager.prototype.findRecycleElements = function () {
                return this._$map ? this._$map.find(_Config.RECYCLE_CLASS_SELECTOR) : $("");
            };
            // ListViewOptions を取得. framework が使用する.
            ScrollManager.prototype.getListViewOptions = function () {
                return this._settings;
            };
            ///////////////////////////////////////////////////////////////////////
            // private method:
            // Scroller 用環境設定
            ScrollManager.prototype.setScrollerCondition = function () {
                this._scroller.on("scroll", this._scrollEventHandler);
                this._scroller.on("scrollstop", this._scrollStopEventHandler);
            };
            // Scroller 用環境破棄
            ScrollManager.prototype.resetScrollerCondition = function () {
                this._scroller.off("scrollstop", this._scrollStopEventHandler);
                this._scroller.off("scroll", this._scrollEventHandler);
            };
            // 既定の Scroller オブジェクトの作成
            ScrollManager.prototype.createScroller = function () {
                return this._settings.scrollerFactory(this._$root[0], this._settings);
            };
            // 現在の Page Index を取得
            ScrollManager.prototype.getPageIndex = function () {
                var _this = this;
                var i, n;
                var page;
                var candidate;
                var scrollPos = this._scroller ? this._scroller.getPos() : 0;
                var scrollPosMax = this._scroller ? this._scroller.getPosMax() : 0;
                var scrollMapSize = (function () {
                    var lastPage = _this.getLastPage();
                    if (null != lastPage) {
                        return lastPage.offset + lastPage.height;
                    }
                    else {
                        return _this._baseHeight;
                    }
                })();
                var pos = (function () {
                    if (0 === scrollPosMax || scrollPosMax <= _this._baseHeight) {
                        return 0;
                    }
                    else {
                        return scrollPos * scrollMapSize / scrollPosMax;
                    }
                })();
                var validRange = function (page) {
                    if (null == page) {
                        return false;
                    }
                    else if (page.offset <= pos && pos <= page.offset + page.height) {
                        return true;
                    }
                    else {
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
                }
                else if (pos < page.offset) {
                    for (i = candidate - 1; i >= 0; i--) {
                        page = this._pages[i];
                        if (validRange(page)) {
                            return page.index;
                        }
                    }
                    console.warn(TAG + "unknown page index.");
                    return 0;
                }
                else {
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
            /**
             * スクロールイベント
             *
             * @param pos {Number} [in] スクロールポジション
             */
            ScrollManager.prototype.onScroll = function (pos) {
                if (this._active && 0 < this._pages.length) {
                    var currentPageIndex = this.getPageIndex();
                    // TODO: 調整
                    if (_Utils.abs(pos - this._lastActivePageContext.pos) < this._settings.scrollRefreshDistance) {
                        if (this._lastActivePageContext.index !== currentPageIndex) {
                            this.refresh();
                        }
                    }
                    this._lastActivePageContext.pos = pos;
                }
            };
            /**
             * スクロール停止イベント
             *
             * @param pos {Number} [in] スクロールポジション
             */
            ScrollManager.prototype.onScrollStop = function (pos) {
                if (this._active && 0 < this._pages.length) {
                    var currentPageIndex = this.getPageIndex();
                    if (this._lastActivePageContext.index !== currentPageIndex) {
                        this.refresh();
                    }
                    this._lastActivePageContext.pos = pos;
                }
            };
            // 最後のページを取得
            ScrollManager.prototype.getLastPage = function () {
                if (0 < this._pages.length) {
                    return this._pages[this._pages.length - 1];
                }
                else {
                    return null;
                }
            };
            /**
             * ページ区分のアサイン
             *
             * @param from {Number} [in] page index を指定
             */
            ScrollManager.prototype.assignPage = function (from) {
                var _this = this;
                var i, n;
                if (null == from) {
                    from = 0;
                }
                else {
                    this.clearPage(from);
                }
                (function () {
                    var lineIndex = 0;
                    var lastPage = _this.getLastPage();
                    var lastLine;
                    var tempPage;
                    if (null == lastPage) {
                        lastPage = new UI.PageProfile();
                        _this._pages.push(lastPage);
                    }
                    else {
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
            /**
             * ページ区分の解除
             *
             * @param from {Number} [in] page index を指定
             */
            ScrollManager.prototype.clearPage = function (from) {
                if (null == from) {
                    from = 0;
                }
                this._pages = this._pages.slice(0, from);
            };
            return ScrollManager;
        }());
        UI.ScrollManager = ScrollManager;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.ListView] ";
        /**
         * @class ListView
         * @brief メモリ管理機能を提供する仮想リストビュークラス
         */
        var ListView = (function (_super) {
            __extends(ListView, _super);
            /**
             * constructor
             *
             * @param options {ListViewConstructOptions} [in] オプション
             */
            function ListView(options) {
                _super.call(this, options);
                this._scrollMgr = null; //< scroll コアロジック
                var opt = options || {};
                this._scrollMgr = new UI.ScrollManager(options);
                if (opt.$el) {
                    var delegates = this.events ? true : false;
                    this.setElement(opt.$el, delegates);
                }
                else {
                    var height = opt.initialHeight || this.$el.height();
                    this._scrollMgr.initialize(this.$el, height);
                }
            }
            ListView.prototype.setElement = function (element, delegate) {
                if (this._scrollMgr) {
                    var $el = $(element);
                    this._scrollMgr.destroy();
                    this._scrollMgr.initialize($el, $el.height());
                }
                return _super.prototype.setElement.call(this, element, delegate);
            };
            // 破棄
            ListView.prototype.remove = function () {
                this._scrollMgr.destroy();
                return _super.prototype.remove.call(this);
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Profile 管理
            // 初期化済みか判定
            ListView.prototype.isInitialized = function () {
                return this._scrollMgr.isInitialized();
            };
            // プロパティを指定して、LineProfile を管理
            ListView.prototype.addItem = function (height, initializer, info, insertTo) {
                this._addLine(new UI.LineProfile(this._scrollMgr, Math.floor(height), initializer, info), insertTo);
            };
            // 指定した Item を削除
            ListView.prototype.removeItem = function (index, size, delay) {
                this._scrollMgr.removeItem(index, size, delay);
            };
            ListView.prototype.getItemInfo = function (target) {
                return this._scrollMgr.getItemInfo(target);
            };
            // アクティブページを更新
            ListView.prototype.refresh = function () {
                this._scrollMgr.refresh();
            };
            // 未アサインページを構築
            ListView.prototype.update = function () {
                this._scrollMgr.update();
            };
            // ページアサインを再構成
            ListView.prototype.rebuild = function () {
                this._scrollMgr.rebuild();
            };
            // 管轄データを破棄
            ListView.prototype.release = function () {
                this._scrollMgr.release();
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Profile Backup / Restore
            // 内部データをバックアップ
            ListView.prototype.backup = function (key) {
                return this._scrollMgr.backup(key);
            };
            // 内部データをリストア
            ListView.prototype.restore = function (key, rebuild) {
                if (rebuild === void 0) { rebuild = true; }
                return this._scrollMgr.restore(key, rebuild);
            };
            // バックアップデータの有無
            ListView.prototype.hasBackup = function (key) {
                return this._scrollMgr.hasBackup(key);
            };
            // バックアップデータの破棄
            ListView.prototype.clearBackup = function (key) {
                return this._scrollMgr.clearBackup(key);
            };
            Object.defineProperty(ListView.prototype, "backupData", {
                // バックアップデータにアクセス
                get: function () {
                    return this._scrollMgr ? this._scrollMgr.backupData : null;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Scroll
            // スクロールイベントハンドラ設定/解除
            ListView.prototype.setScrollHandler = function (handler, on) {
                this._scrollMgr.setScrollHandler(handler, on);
            };
            // スクロール終了イベントハンドラ設定/解除
            ListView.prototype.setScrollStopHandler = function (handler, on) {
                this._scrollMgr.setScrollStopHandler(handler, on);
            };
            // スクロール位置を取得
            ListView.prototype.getScrollPos = function () {
                return this._scrollMgr.getScrollPos();
            };
            // スクロール位置の最大値を取得
            ListView.prototype.getScrollPosMax = function () {
                return this._scrollMgr.getScrollPosMax();
            };
            // スクロール位置を指定
            ListView.prototype.scrollTo = function (pos, animate, time) {
                this._scrollMgr.scrollTo(pos, animate, time);
            };
            // 指定された ListItemView の表示を保証
            ListView.prototype.ensureVisible = function (index, options) {
                this._scrollMgr.ensureVisible(index, options);
            };
            Object.defineProperty(ListView.prototype, "core", {
                ///////////////////////////////////////////////////////////////////////
                // Implements: IListView Properties
                // core framework access
                get: function () {
                    return this._scrollMgr;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Internal I/F
            // 登録 framework が使用する
            ListView.prototype._addLine = function (_line, insertTo) {
                this._scrollMgr._addLine(_line, insertTo);
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IComposableView
            /**
             * すでに定義された Backbone.View を基底クラスに設定し、extend を実行する。
             *
             * @param derives         {Backbone.View|Backbone.View[]} [in] 合成元の View クラス
             * @param properties      {Object}                        [in] prototype プロパティ
             * @param classProperties {Object}                        [in] static プロパティ
             * @return {Backbone.View|Backbone.View[]} 新規に生成された View のコンストラクタ
             */
            ListView.compose = function (derives, properties, classProperties) {
                var composed = UI.composeViews(ListView, derives);
                return composed.extend(properties, classProperties);
            };
            return ListView;
        }(Backbone.View));
        UI.ListView = ListView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));


var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.GroupListItemView] ";
        /**
         * @class GroupListItemView
         * @brief ExpandableListView が扱う ListItem コンテナクラス
         */
        var GroupListItemView = (function (_super) {
            __extends(GroupListItemView, _super);
            /**
             * constructor
             *
             * @param options {GroupLineViewOptions} [in] オプション
             */
            function GroupListItemView(options) {
                _super.call(this, options);
                this._groupProfile = null; //< 管轄の GroupProfile
                this._groupProfile = options.groupProfile;
            }
            ///////////////////////////////////////////////////////////////////////
            // protected methods
            /**
             * 展開状態を判定
             *
             * @return {Boolean} true: 展開, false:収束
             */
            GroupListItemView.prototype.isExpanded = function () {
                return this._groupProfile.isExpanded();
            };
            // 展開中か判定
            GroupListItemView.prototype.isExpanding = function () {
                return this.owner.isExpanding();
            };
            // 収束中か判定
            GroupListItemView.prototype.isCollapsing = function () {
                return this.owner.isCollapsing();
            };
            // 開閉中か判定
            GroupListItemView.prototype.isSwitching = function () {
                return this.owner.isSwitching();
            };
            // 子 Group を持っているか判定
            GroupListItemView.prototype.hasChildren = function (layoutKey) {
                return this._groupProfile.hasChildren(layoutKey);
            };
            return GroupListItemView;
        }(UI.ListItemView));
        UI.GroupListItemView = GroupListItemView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));


/* tslint:disable:no-bitwise */
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.ExpandManager] ";
        /**
         * @class ExpandManager
         * @brief 開閉状態管理クラス
         */
        var ExpandManager = (function () {
            /**
             * constructor
             *
             * @param owner {BaseExpandableListView} [in] 親View のインスタンス
             */
            function ExpandManager(owner) {
                this._owner = null;
                this._mapGroups = {}; //< {id, GroupProfile} の map
                this._aryTopGroups = []; //< 第1階層 GroupProfile を格納
                this._layoutKey = null;
                this._owner = owner;
            }
            ///////////////////////////////////////////////////////////////////////
            // Implements: IExpandManager
            /**
             * 新規 GroupProfile を作成
             * 登録済みの場合はそのオブジェクトを返却
             *
             * @parma id {String} [in] 新規に作成する Group ID を指定. 指定しない場合は自動割り振り
             * @return {GroupProfile} GroupProfile インスタンス
             */
            ExpandManager.prototype.newGroup = function (id) {
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
            /**
             * 登録済み Group を取得
             *
             * @parma id {String} [in] 取得する Group ID を指定
             * @return {GroupProfile} GroupProfile インスタンス / null
             */
            ExpandManager.prototype.getGroup = function (id) {
                if (null == this._mapGroups[id]) {
                    console.warn(TAG + "group id: " + id + " is not registered.");
                    return null;
                }
                return this._mapGroups[id];
            };
            /**
             * 第1階層の Group 登録
             *
             * @param topGroup {GroupProfile} [in] 構築済み GroupProfile インスタンス
             */
            ExpandManager.prototype.registerTopGroup = function (topGroup) {
                var lastGroup;
                var insertTo;
                // すでに登録済みの場合は restore して layout キーごとに復元する。
                if ("registered" === topGroup.status) {
                    // TODO: orientation changed 時の layout キー変更対応だが、キーに変更が無いときは不具合となる。
                    // この API に実装が必要かも含めて見直しが必要
                    topGroup.restore();
                    return;
                }
                lastGroup = (0 < this._aryTopGroups.length) ? this._aryTopGroups[this._aryTopGroups.length - 1] : null;
                insertTo = (null != lastGroup) ? lastGroup.getLastLineIndex(true) + 1 : 0;
                if (_.isNaN(insertTo)) {
                    console.error(TAG + "logic error, 'insertTo' is NaN.");
                    return;
                }
                this._aryTopGroups.push(topGroup);
                topGroup.register(insertTo);
            };
            /**
             * 第1階層の Group を取得
             * コピー配列が返されるため、クライアントはキャッシュ不可
             *
             * @return {GroupProfile[]} GroupProfile 配列
             */
            ExpandManager.prototype.getTopGroups = function () {
                return this._aryTopGroups.slice(0);
            };
            // すべてのグループを展開 (1階層)
            ExpandManager.prototype.expandAll = function () {
                this._aryTopGroups.forEach(function (group) {
                    if (group.hasChildren()) {
                        group.expand();
                    }
                });
            };
            // すべてのグループを収束 (1階層)
            ExpandManager.prototype.collapseAll = function (delay) {
                this._aryTopGroups.forEach(function (group) {
                    if (group.hasChildren()) {
                        group.collapse(delay);
                    }
                });
            };
            // 展開中か判定
            ExpandManager.prototype.isExpanding = function () {
                return this._owner.isStatusIn("expanding");
            };
            // 収束中か判定
            ExpandManager.prototype.isCollapsing = function () {
                return this._owner.isStatusIn("collapsing");
            };
            // 開閉中か判定
            ExpandManager.prototype.isSwitching = function () {
                return this.isExpanding() || this.isCollapsing();
            };
            // 状態変数の参照カウントのインクリメント
            ExpandManager.prototype.statusAddRef = function (status) {
                return this._owner.statusAddRef(status);
            };
            // 状態変数の参照カウントのデクリメント
            ExpandManager.prototype.statusRelease = function (status) {
                return this._owner.statusRelease(status);
            };
            // 処理スコープ毎に状態変数を設定
            ExpandManager.prototype.statusScope = function (status, callback) {
                this._owner.statusScope(status, callback);
            };
            // 指定した状態中であるか確認
            ExpandManager.prototype.isStatusIn = function (status) {
                return this._owner.isStatusIn(status);
            };
            Object.defineProperty(ExpandManager.prototype, "layoutKey", {
                // layout key を取得
                get: function () {
                    return this._layoutKey;
                },
                // layout key を設定
                set: function (key) {
                    this._layoutKey = key;
                },
                enumerable: true,
                configurable: true
            });
            // データを破棄
            ExpandManager.prototype.release = function () {
                this._mapGroups = {};
                this._aryTopGroups = [];
            };
            ///////////////////////////////////////////////////////////////////////
            // Implementes: IBackupRestore
            /**
             * 内部データをバックアップ
             *
             * @param key {String} [in] バックアップキーを指定
             * @return {Boolean} true: 成功 / false: 失敗
             */
            ExpandManager.prototype.backup = function (key) {
                var _backup = this.backupData;
                if (null == _backup[key]) {
                    _backup[key] = {
                        map: this._mapGroups,
                        tops: this._aryTopGroups,
                    };
                }
                return true;
            };
            /**
             * 内部データをリストア
             *
             * @param key     {String}  [in] バックアップキーを指定
             * @param rebuild {Boolean} [in] rebuild を実行する場合は true を指定
             * @return {Boolean} true: 成功 / false: 失敗
             */
            ExpandManager.prototype.restore = function (key, rebuild) {
                if (rebuild === void 0) { rebuild = true; }
                var _backup = this.backupData;
                if (null == _backup[key]) {
                    return false;
                }
                if (0 < this._aryTopGroups.length) {
                    this.release();
                }
                this._mapGroups = _backup[key].map;
                this._aryTopGroups = _backup[key].tops;
                // layout 情報の確認
                if (this._aryTopGroups.length <= 0 || !this._aryTopGroups[0].hasLayoutKeyOf(this.layoutKey)) {
                    return false;
                }
                // 展開しているものを登録
                this._aryTopGroups.forEach(function (group) {
                    group.restore();
                });
                // 再構築の予約
                if (rebuild) {
                    this._owner.rebuild();
                }
                return true;
            };
            // バックアップデータの有無
            ExpandManager.prototype.hasBackup = function (key) {
                return this._owner.hasBackup(key);
            };
            // バックアップデータの破棄
            ExpandManager.prototype.clearBackup = function (key) {
                return this._owner.clearBackup(key);
            };
            Object.defineProperty(ExpandManager.prototype, "backupData", {
                // バックアップデータにアクセス
                get: function () {
                    return this._owner.backupData;
                },
                enumerable: true,
                configurable: true
            });
            return ExpandManager;
        }());
        UI.ExpandManager = ExpandManager;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));


var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.ExpandableListView] ";
        /**
         * @class ExpandableListView
         * @brief 開閉機能を備えた仮想リストビュークラス
         */
        var ExpandableListView = (function (_super) {
            __extends(ExpandableListView, _super);
            /**
             * constructor
             *
             * @param options {ListViewConstructOptions} [in] オプション
             */
            function ExpandableListView(options) {
                _super.call(this, options);
                this._statusMgr = null;
                this._expandManager = null;
                this._statusMgr = new UI.StatusManager();
                this._expandManager = new UI.ExpandManager(this);
            }
            ///////////////////////////////////////////////////////////////////////
            // Implements: IExpandableListView
            // 新規 GroupProfile を作成
            ExpandableListView.prototype.newGroup = function (id) {
                return this._expandManager.newGroup(id);
            };
            // 登録済み Group を取得
            ExpandableListView.prototype.getGroup = function (id) {
                return this._expandManager.getGroup(id);
            };
            // 第1階層の Group 登録
            ExpandableListView.prototype.registerTopGroup = function (topGroup) {
                this._expandManager.registerTopGroup(topGroup);
            };
            // 第1階層の Group を取得
            ExpandableListView.prototype.getTopGroups = function () {
                return this._expandManager.getTopGroups();
            };
            // すべてのグループを展開 (1階層)
            ExpandableListView.prototype.expandAll = function () {
                this._expandManager.expandAll();
            };
            // すべてのグループを収束 (1階層)
            ExpandableListView.prototype.collapseAll = function (delay) {
                this._expandManager.collapseAll(delay);
            };
            // 展開中か判定
            ExpandableListView.prototype.isExpanding = function () {
                return this._expandManager.isExpanding();
            };
            // 収束中か判定
            ExpandableListView.prototype.isCollapsing = function () {
                return this._expandManager.isCollapsing();
            };
            // 開閉中か判定
            ExpandableListView.prototype.isSwitching = function () {
                return this._expandManager.isSwitching();
            };
            // 状態変数の参照カウントのインクリメント
            ExpandableListView.prototype.statusAddRef = function (status) {
                return this._statusMgr.statusAddRef(status);
            };
            // 状態変数の参照カウントのデクリメント
            ExpandableListView.prototype.statusRelease = function (status) {
                return this._statusMgr.statusRelease(status);
            };
            // 処理スコープ毎に状態変数を設定
            ExpandableListView.prototype.statusScope = function (status, callback) {
                this._statusMgr.statusScope(status, callback);
            };
            // 指定した状態中であるか確認
            ExpandableListView.prototype.isStatusIn = function (status) {
                return this._statusMgr.isStatusIn(status);
            };
            Object.defineProperty(ExpandableListView.prototype, "layoutKey", {
                // layout key を取得
                get: function () {
                    return this._expandManager.layoutKey;
                },
                // layout key を設定
                set: function (key) {
                    this._expandManager.layoutKey = key;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Override: ListView
            // データを破棄
            ExpandableListView.prototype.release = function () {
                _super.prototype.release.call(this);
                this._expandManager.release();
            };
            // 内部データをバックアップ
            ExpandableListView.prototype.backup = function (key) {
                return this._expandManager.backup(key);
            };
            // 内部データをリストア
            ExpandableListView.prototype.restore = function (key, rebuild) {
                if (rebuild === void 0) { rebuild = true; }
                return this._expandManager.restore(key, rebuild);
            };
            return ExpandableListView;
        }(UI.ListView));
        UI.ExpandableListView = ExpandableListView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

    return CDP.UI;
}));

/*!
 * cdp.ui.jqm.js 0.4.0-dev
 *
 * Date: 2016-04-12T16:10:18+0900
 */

/* tslint:disable:typedef */
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD
        define('cdp.ui.jqm',["cdp.framework.jqm", "cdp.tools", "cdp.ui.listview"], function () {
            return factory(root.CDP || (root.CDP = {}));
        });
    }
    else {
        // Browser globals
        factory(root.CDP || (root.CDP = {}));
    }
}(this, function (CDP) {
    CDP.UI = CDP.UI || {};
    var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};


/*jshint sub: true */
/* tslint:disable:no-bitwise */
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.Toast] ";
        /**
         * @class Toast
         * @brief Android SDK の Toast クラスのように自動消滅するメッセージ出力ユーティリティ
         *        入れ子の関係を実現するために module で実装
         */
        var Toast;
        (function (Toast) {
            // 表示時間の定義
            Toast.LENGTH_SHORT = 1500; //< 短い:1500 msec
            Toast.LENGTH_LONG = 4000; //< 長い:4000 msec
            // @enum オフセットの基準
            (function (OffsetX) {
                OffsetX[OffsetX["LEFT"] = 1] = "LEFT";
                OffsetX[OffsetX["RIGHT"] = 2] = "RIGHT";
                OffsetX[OffsetX["CENTER"] = 4] = "CENTER";
            })(Toast.OffsetX || (Toast.OffsetX = {}));
            var OffsetX = Toast.OffsetX;
            // @enum オフセットの基準
            (function (OffsetY) {
                OffsetY[OffsetY["TOP"] = 16] = "TOP";
                OffsetY[OffsetY["BOTTOM"] = 32] = "BOTTOM";
                OffsetY[OffsetY["CENTER"] = 64] = "CENTER";
            })(Toast.OffsetY || (Toast.OffsetY = {}));
            var OffsetY = Toast.OffsetY;
            /**
             * @class StyleBuilderDefault
             * @brief スタイル変更時に使用する既定の構造体オブジェクト
             */
            var StyleBuilderDefault = (function () {
                function StyleBuilderDefault() {
                }
                // class attribute に設定する文字列を取得
                StyleBuilderDefault.prototype.getClass = function () {
                    return "ui-loader ui-overlay-shadow ui-corner-all ui-body-b";
                };
                // style attribute に設定する JSON オブジェクトを取得
                StyleBuilderDefault.prototype.getStyle = function () {
                    var style = {
                        "padding": "7px 25px 7px 25px",
                        "display": "block",
                        "opacity": 0.8
                    };
                    return style;
                };
                // オフセットの基準位置を取得
                StyleBuilderDefault.prototype.getOffsetPoint = function () {
                    return OffsetX.CENTER | OffsetY.BOTTOM;
                };
                // X 座標のオフセット値を取得
                StyleBuilderDefault.prototype.getOffsetX = function () {
                    return 0;
                };
                // Y 座標のオフセット値を取得
                StyleBuilderDefault.prototype.getOffsetY = function () {
                    return -75;
                };
                return StyleBuilderDefault;
            }());
            Toast.StyleBuilderDefault = StyleBuilderDefault;
            /**
             * Toast 表示
             *
             * @param message  [in] メッセージ
             * @param duration [in] 表示時間を設定 (msec) default: LENGTH_SHORT
             * @param style    [in] スタイル変更する場合には派生クラスオブジェクトを指定
             */
            function show(message, duration, style) {
                if (duration === void 0) { duration = Toast.LENGTH_SHORT; }
                var $mobile = $.mobile;
                var info = style || new StyleBuilderDefault();
                var setCSS = info.getStyle() ? true : false;
                // 改行コードは <br/> に置換する
                var msg = message.replace(/\n/g, "<br/>");
                // メッセージ element の動的生成
                var html = "<div>" + msg + "</div>";
                var box = $(html).addClass(info.getClass());
                if (setCSS) {
                    box.css(info.getStyle());
                }
                // 自動改行されてもよいように、基点を設定してから追加
                box.css({
                    "top": 0,
                    "left": 0,
                }).appendTo($mobile.pageContainer);
                // 配置位置の決定
                var offsetPoint = info.getOffsetPoint();
                var posX, posY;
                var $window = $(window);
                var box_width = box.width() + parseInt(box.css("padding-left"), 10) + parseInt(box.css("padding-right"), 10);
                var box_height = box.height() + parseInt(box.css("padding-top"), 10) + parseInt(box.css("padding-bottom"), 10);
                switch (offsetPoint & 0x000F) {
                    case OffsetX.LEFT:
                        posX = 0 + info.getOffsetX();
                        break;
                    case OffsetX.RIGHT:
                        posX = $window.width() - box_width + info.getOffsetX();
                        break;
                    case OffsetX.CENTER:
                        posX = ($window.width() / 2) - (box_width / 2) + info.getOffsetX();
                        break;
                    default:
                        console.warn(TAG + "warn. unknown offsetPoint:" + (offsetPoint & 0x000F));
                        posX = ($window.width() / 2) - (box_width / 2) + info.getOffsetX();
                        break;
                }
                switch (offsetPoint & 0x00F0) {
                    case OffsetY.TOP:
                        posY = 0 + info.getOffsetY();
                        break;
                    case OffsetY.BOTTOM:
                        posY = $window.height() - box_height + info.getOffsetY();
                        break;
                    case OffsetY.CENTER:
                        posY = ($window.height() / 2) - (box_height / 2) + info.getOffsetY();
                        break;
                    default:
                        console.warn(TAG + "warn. unknown offsetPoint:" + (offsetPoint & 0x00F0));
                        posY = ($window.height() / 2) - (box_height / 2) + info.getOffsetY();
                        break;
                }
                // 表示
                box.css({
                    "top": posY,
                    "left": posX,
                })
                    .delay(duration)
                    .fadeOut(400, function () {
                    $(this).remove();
                });
            }
            Toast.show = show;
        })(Toast = UI.Toast || (UI.Toast = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));



var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Framework = CDP.Framework;
        var TAG = "[CDP.UI.Dialog] ";
        //___________________________________________________________________________________________________________________//
        /**
         * @class Dialog
         * @brief 汎用ダイアログクラス
         *        jQM の popup widget によって実装
         */
        var Dialog = (function () {
            /**
             * constructor
             *
             * @param id      {String}        [in] ダイアログ DOM ID を指定 ex) #dialog-hoge
             * @param options {DialogOptions} [in] オプション
             */
            function Dialog(id, options) {
                this._template = null;
                this._settings = null;
                this._$dialog = null;
                // Dialog 共通設定の初期化
                Dialog.initCommonCondition();
                // 設定を更新
                this._settings = $.extend({}, Dialog.s_defaultOptions, options);
                // ダイアログテンプレートを作成
                this._template = CDP.Tools.Template.getJST(id, this._settings.src);
            }
            ///////////////////////////////////////////////////////////////////////
            // public methods
            /**
             * 表示
             * 表示をして始めて DOM が有効になる。
             *
             * @param options {DialogOptions} [in] オプション (src は無視される)
             * @return ダイアログの jQuery オブジェクト
             */
            Dialog.prototype.show = function (options) {
                var _this = this;
                var $document = $(document), $body = $("body"), $page = $body.pagecontainer("getActivePage");
                var moveEvent = "touchmove mousemove MSPointerMove";
                var scrollHander = function (event) {
                    event.preventDefault();
                };
                var ofcHidden = {
                    "overflow": "hidden",
                    "overflow-x": "hidden",
                    "overflow-y": "hidden",
                };
                var ofcBody = {
                    "overflow": $body.css("overflow"),
                    "overflow-x": $body.css("overflow-x"),
                    "overflow-y": $body.css("overflow-y"),
                };
                var ofcPage = {
                    "overflow": $page.css("overflow"),
                    "overflow-x": $page.css("overflow-x"),
                    "overflow-y": $page.css("overflow-y"),
                };
                // option が指定されていた場合更新
                if (null != options) {
                    this._settings = $.extend({}, this._settings, options);
                }
                // title の有無
                this._settings._header = this._settings.title ? "has-title" : "no-title";
                /*
                 * template から jQuery オブジェクトを作成し、
                 * <body> 直下に追加.
                 * $page では Backbone event を受けられないことに注意
                 */
                this._$dialog = $(this._template(this._settings));
                $body.append(this._$dialog);
                // 表示
                this._$dialog.popup({
                    dismissible: this._settings.dismissible,
                    transition: this._settings.transition,
                    positionTo: "window",
                    create: function (event, ui) {
                        // スクロールを抑止
                        $document.on(moveEvent, scrollHander);
                        $body.css(ofcHidden);
                        $page.css(ofcHidden);
                        Dialog.register(_this);
                    },
                    afterclose: function (event, ui) {
                        // スクロール状態を戻す
                        $page.css(ofcPage);
                        $body.css(ofcBody);
                        $document.off(moveEvent, scrollHander);
                        Dialog.register(null);
                        _this._$dialog.remove();
                        _this._$dialog = null;
                    },
                })
                    .popup("open").on(this._settings.event, function (event) {
                    event.preventDefault();
                    // "data-auto-close='false'" が指定されている要素は dialog を閉じない
                    if ("false" === $(event.target).attr("data-auto-close")) {
                        return;
                    }
                    _this.close();
                });
                return this._$dialog;
            };
            /**
             * 終了
             * 基本的には自動で閉じるが、
             * 表示中のダイアログをクライアント側から閉じるメソッド
             */
            Dialog.prototype.close = function () {
                if (this._$dialog) {
                    this._$dialog.popup("close");
                }
            };
            Object.defineProperty(Dialog.prototype, "$el", {
                // ダイアログ element を取得
                get: function () {
                    return this._$dialog;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // public static methods
            /**
             * Dialog の既定オプションを更新
             * すぺての Dialog が使用する共通設定
             *
             * @param options {DialogOptions} [in] ダイアログオプション
             */
            Dialog.setDefaultOptions = function (options) {
                // Dialog 共通設定の初期化
                Dialog.initCommonCondition();
                $.extend(true, Dialog.s_defaultOptions, options);
            };
            ///////////////////////////////////////////////////////////////////////
            // private methods
            // 現在 active なダイアログとして登録する
            Dialog.register = function (dialog) {
                if (null != dialog && null != Dialog.s_activeDialog) {
                    console.warn(TAG + "new dialog proc is called in the past dialog's one. use setTimeout() for post process.");
                }
                Dialog.s_activeDialog = dialog;
            };
            /**
             * Dialog 共通設定の初期化
             */
            Dialog.initCommonCondition = function () {
                // Framework の初期化後に処理する必要がある
                if (!Framework.isInitialized()) {
                    console.warn(TAG + "initCommonCondition() should be called after Framework.initialized.");
                    return;
                }
                if (null == Dialog.s_oldBackKeyHandler) {
                    // Back Button Handler
                    Dialog.s_oldBackKeyHandler = CDP.setBackButtonHandler(null);
                    CDP.setBackButtonHandler(Dialog.customBackKeyHandler);
                    // 既定オプション
                    Dialog.s_defaultOptions = {
                        idPositive: "dlg-btn-positive",
                        idNegative: "dlg-btn-negative",
                        event: Framework.getDefaultClickEvent(),
                        dismissible: false,
                        transition: "pop",
                        labelPositive: "OK",
                        labelNegative: "Cancel",
                    };
                }
            };
            /**
             * H/W Back Button Handler
             */
            Dialog.customBackKeyHandler = function (event) {
                var $target;
                if (null != Dialog.s_activeDialog) {
                    if (null != Dialog.s_activeDialog._settings.idNegative) {
                        $target = Dialog.s_activeDialog._$dialog.find("#" + Dialog.s_activeDialog._settings.idNegative);
                        if (0 === $target.length) {
                            // 要素が見つからない場合は親を指定する
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
        }());
        UI.Dialog = Dialog;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));


/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Framework = CDP.Framework;
        var TAG = "[CDP.UI.PageView] ";
        /**
         * @class PageContainerView
         * @brief PageView と連携可能な コンテナビュークラス
         */
        var PageContainerView = (function (_super) {
            __extends(PageContainerView, _super);
            /**
             * constructor
             */
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
                ///////////////////////////////////////////////////////////////////////
                // short cut methods
                // Owner 取得
                get: function () {
                    return this._owner;
                },
                enumerable: true,
                configurable: true
            });
            return PageContainerView;
        }(Backbone.View));
        UI.PageContainerView = PageContainerView;
        //___________________________________________________________________________________________________________________//
        /**
         * @class PageView
         * @brief CDP.Framework.Page と Backbone.View の両方の機能を提供するページの基底クラス
         */
        var PageView = (function (_super) {
            __extends(PageView, _super);
            /**
             * constructor
             *
             * @param url     {String}                   [in] ページ URL
             * @param id      {String}                   [in] ページ ID
             * @param options {PageViewConstructOptions} [in] オプション
             */
            function PageView(url, id, options) {
                _super.call(this, options);
                this._pageOptions = null;
                this._basePage = null;
                this._statusMgr = null;
                // PageView 設定
                this._pageOptions = $.extend({}, { owner: this }, options);
                this._basePage = this._pageOptions.basePage ? new this._pageOptions.basePage(url, id, this._pageOptions) : new Framework.Page(url, id, this._pageOptions);
                // StatusManager
                this._statusMgr = new UI.StatusManager();
                // Backbone.View 用の初期化
                var delegates = this.events ? true : false;
                this.setElement(this.$page, delegates);
            }
            ///////////////////////////////////////////////////////////////////////
            // Implements: IStatusManager 状態管理
            /**
             * 状態変数の参照カウントのインクリメント
             *
             * @param status {String} [in] 状態識別子
             */
            PageView.prototype.statusAddRef = function (status) {
                return this._statusMgr.statusAddRef(status);
            };
            /**
             * 状態変数の参照カウントのデクリメント
             *
             * @param status {String} [in] 状態識別子
             */
            PageView.prototype.statusRelease = function (status) {
                return this._statusMgr.statusRelease(status);
            };
            /**
             * 処理スコープ毎に状態変数を設定
             *
             * @param status   {String}   [in] 状態識別子
             * @param callback {Function} [in] 処理コールバック
             */
            PageView.prototype.statusScope = function (status, callback) {
                this._statusMgr.statusScope(status, callback);
            };
            /**
             * 指定した状態中であるか確認
             *
             * @param status {String}   [in] 状態識別子
             * @return {Boolean} true: 状態内 / false: 状態外
             */
            PageView.prototype.isStatusIn = function (status) {
                return this._statusMgr.isStatusIn(status);
            };
            Object.defineProperty(PageView.prototype, "active", {
                ///////////////////////////////////////////////////////////////////////
                // IPage stub stuff.
                get: function () { return this._basePage.active; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "url", {
                get: function () { return this._basePage.url; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "id", {
                get: function () { return this._basePage ? this._basePage.id : null; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "$page", {
                get: function () { return this._basePage.$page; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "$header", {
                get: function () { return this._basePage.$header; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "$footer", {
                get: function () { return this._basePage.$footer; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageView.prototype, "intent", {
                get: function () { return this._basePage.intent; },
                set: function (newIntent) { this._basePage.intent = newIntent; },
                enumerable: true,
                configurable: true
            });
            /**
             * Orientation の変更を受信
             *
             * @param newOrientation {Orientation} [in] new orientation code.
             */
            PageView.prototype.onOrientationChanged = function (newOrientation) {
                // Override
            };
            /**
             * H/W Back Button ハンドラ
             *
             * @param  event {JQueryEventObject} [in] event object
             * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
             */
            PageView.prototype.onHardwareBackButton = function (event) {
                return false;
            };
            /**
             * Router "before route change" ハンドラ
             * ページ遷移直前に非同期処理を行うことが可能
             *
             * @return {JQueryPromise} jQueryPromise オブジェクト
             */
            PageView.prototype.onBeforeRouteChange = function () {
                return $.Deferred().resolve().promise();
            };
            /**
             * 汎用コマンドを受信
             *
             * @param  event {JQueryEventObject} [in] event object
             * @param  event {kind}              [in] command kind string
             */
            PageView.prototype.onCommand = function (event, kind) {
                // Override
            };
            /**
             * 最初の OnPageInit() のときにのみコールされる
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             */
            PageView.prototype.onInitialize = function (event) {
                // Override
            };
            /**
             * jQM event: "pagebeforecreate" に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             */
            PageView.prototype.onPageBeforeCreate = function (event) {
                this.setElement(this.$page, true);
            };
            /**
             * jQM event: "pagecreate" (旧:"pageinit") に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             */
            PageView.prototype.onPageInit = function (event) {
                // Override
            };
            /**
             * jQM event: "pagebeforeshow" に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            PageView.prototype.onPageBeforeShow = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pagecontainershow" (旧:"pageshow") に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            PageView.prototype.onPageShow = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pagebeforehide" に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            PageView.prototype.onPageBeforeHide = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            PageView.prototype.onPageHide = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pageremove" に対応
             *
             * @param event {JQueryEventObject} [in] イベントオブジェクト
             */
            PageView.prototype.onPageRemove = function (event) {
                this.remove();
            };
            return PageView;
        }(Backbone.View));
        UI.PageView = PageView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.PageListView] ";
        /**
         * @class PageListView
         * @brief 仮想リストビュー機能を持つ PageView クラス
         */
        var PageListView = (function (_super) {
            __extends(PageListView, _super);
            /**
             * constructor
             *
             * @param url     {String}                       [in] page template に使用する URL
             * @param id      {String}                       [in] page に振られた ID
             * @param options {PageListViewConstructOptions} [in] オプション
             */
            function PageListView(url, id, options) {
                _super.call(this, url, id, $.extend({}, {
                    autoDestoryElement: false,
                }, options));
                this._scrollMgr = null; //< scroll コアロジック
                this._needRebuild = false; //< ページ表示時に rebuild() をコールするための内部変数
                this._scrollMgr = new UI.ScrollManager(options);
            }
            // rebuild() のスケジューリング
            PageListView.prototype.reserveRebuild = function () {
                this._needRebuild = true;
            };
            ///////////////////////////////////////////////////////////////////////
            // Override: PageView
            // Orientation の変更検知
            PageListView.prototype.onOrientationChanged = function (newOrientation) {
                this._scrollMgr.setBaseHeight(this.getPageBaseHeight());
            };
            // ページ遷移直前イベント処理
            PageListView.prototype.onBeforeRouteChange = function () {
                if (this._pageOptions.autoDestoryElement) {
                    this._scrollMgr.destroy();
                }
                return _super.prototype.onBeforeRouteChange.call(this);
            };
            // jQM event: "pagebeforeshow" に対応
            PageListView.prototype.onPageBeforeShow = function (event, data) {
                _super.prototype.onPageBeforeShow.call(this, event, data);
                this._scrollMgr.initialize(this.$page, this.getPageBaseHeight());
            };
            // jQM event: "pagecontainershow" (旧:"pageshow") に対応
            PageListView.prototype.onPageShow = function (event, data) {
                _super.prototype.onPageShow.call(this, event, data);
                this._scrollMgr.setBaseHeight(this.getPageBaseHeight());
                if (this._needRebuild) {
                    this.rebuild();
                    this._needRebuild = false;
                }
            };
            // jQM event: "pageremove" に対応
            PageListView.prototype.onPageRemove = function (event) {
                _super.prototype.onPageRemove.call(this, event);
                this.release();
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Profile 管理
            // 初期化済みか判定
            PageListView.prototype.isInitialized = function () {
                return this._scrollMgr.isInitialized();
            };
            // プロパティを指定して、ListItem を管理
            PageListView.prototype.addItem = function (height, initializer, info, insertTo) {
                this._addLine(new UI.LineProfile(this._scrollMgr, Math.floor(height), initializer, info), insertTo);
            };
            // 指定した Item を削除
            PageListView.prototype.removeItem = function (index, size, delay) {
                this._scrollMgr.removeItem(index, size, delay);
            };
            PageListView.prototype.getItemInfo = function (target) {
                return this._scrollMgr.getItemInfo(target);
            };
            // アクティブページを更新
            PageListView.prototype.refresh = function () {
                this._scrollMgr.refresh();
            };
            // 未アサインページを構築
            PageListView.prototype.update = function () {
                this._scrollMgr.update();
            };
            // ページアサインを再構成
            PageListView.prototype.rebuild = function () {
                this._scrollMgr.rebuild();
            };
            // 管轄データを破棄
            PageListView.prototype.release = function () {
                this._scrollMgr.release();
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Profile Backup / Restore
            // 内部データをバックアップ
            PageListView.prototype.backup = function (key) {
                return this._scrollMgr.backup(key);
            };
            // 内部データをリストア
            PageListView.prototype.restore = function (key, rebuild) {
                if (rebuild === void 0) { rebuild = true; }
                var retval = this._scrollMgr.restore(key, rebuild);
                if (retval && !rebuild) {
                    this.reserveRebuild();
                }
                return retval;
            };
            // バックアップデータの有無
            PageListView.prototype.hasBackup = function (key) {
                return this._scrollMgr.hasBackup(key);
            };
            // バックアップデータの破棄
            PageListView.prototype.clearBackup = function (key) {
                return this._scrollMgr.clearBackup(key);
            };
            Object.defineProperty(PageListView.prototype, "backupData", {
                // バックアップデータにアクセス
                get: function () {
                    return this._scrollMgr.backupData;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Scroll
            // スクロールイベントハンドラ設定/解除
            PageListView.prototype.setScrollHandler = function (handler, on) {
                this._scrollMgr.setScrollHandler(handler, on);
            };
            // スクロール終了イベントハンドラ設定/解除
            PageListView.prototype.setScrollStopHandler = function (handler, on) {
                this._scrollMgr.setScrollStopHandler(handler, on);
            };
            // スクロール位置を取得
            PageListView.prototype.getScrollPos = function () {
                return this._scrollMgr.getScrollPos();
            };
            // スクロール位置の最大値を取得
            PageListView.prototype.getScrollPosMax = function () {
                return this._scrollMgr.getScrollPosMax();
            };
            // スクロール位置を指定
            PageListView.prototype.scrollTo = function (pos, animate, time) {
                this._scrollMgr.scrollTo(pos, animate, time);
            };
            // 指定された ListItemView の表示を保証
            PageListView.prototype.ensureVisible = function (index, options) {
                this._scrollMgr.ensureVisible(index, options);
            };
            Object.defineProperty(PageListView.prototype, "core", {
                ///////////////////////////////////////////////////////////////////////
                // Implements: IListView Properties
                // core framework access
                get: function () {
                    return this._scrollMgr;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Internal I/F
            // 登録 framework が使用する
            PageListView.prototype._addLine = function (_line, insertTo) {
                this._scrollMgr._addLine(_line, insertTo);
            };
            ///////////////////////////////////////////////////////////////////////
            // private method:
            // ページの基準値を取得
            PageListView.prototype.getPageBaseHeight = function () {
                return $(window).height() - parseInt(this.$page.css("padding-top"), 10);
            };
            return PageListView;
        }(UI.PageView));
        UI.PageListView = PageListView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.PageExpandableListView] ";
        /**
         * @class PageExpandableListView
         * @brief 開閉リストビュー機能を持つ PageView クラス
         */
        var PageExpandableListView = (function (_super) {
            __extends(PageExpandableListView, _super);
            /**
             * constructor
             *
             * @param url     {String}                       [in] page template に使用する URL
             * @param id      {String}                       [in] page に振られた ID
             * @param options {PageListViewConstructOptions} [in] オプション
             */
            function PageExpandableListView(url, id, options) {
                _super.call(this, url, id, options);
                this._expandManager = null;
                this._expandManager = new UI.ExpandManager(this);
            }
            ///////////////////////////////////////////////////////////////////////
            // Implements: IExpandableListView
            // 新規 GroupProfile を作成
            PageExpandableListView.prototype.newGroup = function (id) {
                return this._expandManager.newGroup(id);
            };
            // 登録済み Group を取得
            PageExpandableListView.prototype.getGroup = function (id) {
                return this._expandManager.getGroup(id);
            };
            // 第1階層の Group 登録
            PageExpandableListView.prototype.registerTopGroup = function (topGroup) {
                this._expandManager.registerTopGroup(topGroup);
            };
            // 第1階層の Group を取得
            PageExpandableListView.prototype.getTopGroups = function () {
                return this._expandManager.getTopGroups();
            };
            // すべてのグループを展開 (1階層)
            PageExpandableListView.prototype.expandAll = function () {
                this._expandManager.expandAll();
            };
            // すべてのグループを収束 (1階層)
            PageExpandableListView.prototype.collapseAll = function (delay) {
                this._expandManager.collapseAll(delay);
            };
            // 展開中か判定
            PageExpandableListView.prototype.isExpanding = function () {
                return this._expandManager.isExpanding();
            };
            // 収束中か判定
            PageExpandableListView.prototype.isCollapsing = function () {
                return this._expandManager.isCollapsing();
            };
            // 開閉中か判定
            PageExpandableListView.prototype.isSwitching = function () {
                return this._expandManager.isSwitching();
            };
            Object.defineProperty(PageExpandableListView.prototype, "layoutKey", {
                // layout key を取得
                get: function () {
                    return this._expandManager.layoutKey;
                },
                // layout key を設定
                set: function (key) {
                    this._expandManager.layoutKey = key;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Override: PageListView
            // データを破棄
            PageExpandableListView.prototype.release = function () {
                _super.prototype.release.call(this);
                this._expandManager.release();
            };
            // 内部データをバックアップ
            PageExpandableListView.prototype.backup = function (key) {
                return this._expandManager.backup(key);
            };
            // 内部データをリストア
            PageExpandableListView.prototype.restore = function (key, rebuild) {
                if (rebuild === void 0) { rebuild = true; }
                return this._expandManager.restore(key, rebuild);
            };
            return PageExpandableListView;
        }(UI.PageListView));
        UI.PageExpandableListView = PageExpandableListView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

    return CDP.UI;
}));

define("cdp/core/core", ["require", "exports", "cdp.core"], function (require, exports, _core) {
    "use strict";
    // CDP stuff
    exports.global = _core.global;
    exports.initialize = _core.initialize;
    exports.webRoot = _core.webRoot;
});
define("cdp/core/promise", ["require", "exports", "cdp.promise"], function (require, exports, _promise) {
    "use strict";
    // Promise methods
    exports.makePromise = _promise.makePromise;
    exports.wait = _promise.wait;
    exports.PromiseManager = _promise.PromiseManager;
});
/// <amd-dependency path="cdp.framework.jqm" />
define("cdp/core/framework.jqm", ["require", "exports", "cdp.framework.jqm"], function (require, exports) {
    "use strict";
    // CDP methods
    exports.waitForDeviceReady = CDP.waitForDeviceReady;
    exports.setBackButtonHandler = CDP.setBackButtonHandler;
});
define("cdp/core", ["require", "exports", "cdp/core/core", "cdp/core/promise", "cdp/core/framework.jqm"], function (require, exports, core_1, promise_1, framework_jqm_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(core_1);
    __export(promise_1);
    __export(framework_jqm_1);
});
define("cdp/framework/jqm", ["require", "exports", "cdp.framework.jqm"], function (require, exports, _framework) {
    "use strict";
    exports.Patch = _framework.Patch;
    // @module Platform
    exports.Platform = _framework.Platform;
    // Framework methods
    exports.getOrientation = _framework.getOrientation;
    exports.toUrl = _framework.toUrl;
    exports.setBeforeRouteChangeHandler = _framework.setBeforeRouteChangeHandler;
    exports.Router = _framework.Router;
    // Framework Core APIs
    exports.initialize = _framework.initialize;
    exports.isInitialized = _framework.isInitialized;
    exports.registerOrientationChangedListener = _framework.registerOrientationChangedListener;
    exports.unregisterOrientationChangedListener = _framework.unregisterOrientationChangedListener;
    exports.setupEventHandlers = _framework.setupEventHandlers;
    exports.setActivePage = _framework.setActivePage;
    exports.getDefaultClickEvent = _framework.getDefaultClickEvent;
    exports.Page = _framework.Page;
});
define("cdp/framework", ["require", "exports", "cdp/framework/jqm"], function (require, exports, jqm_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(jqm_1);
});
define("cdp/tools/tools", ["require", "exports", "cdp.tools"], function (require, exports, _tools) {
    "use strict";
    // @module Blob
    var Blob;
    (function (Blob) {
        // Blob methods
        Blob.arrayBufferToBlob = _tools.Blob.arrayBufferToBlob;
        Blob.base64ToBlob = _tools.Blob.base64ToBlob;
        Blob.base64ToArrayBuffer = _tools.Blob.base64ToArrayBuffer;
        Blob.base64ToUint8Array = _tools.Blob.base64ToUint8Array;
        Blob.arrayBufferToBase64 = _tools.Blob.arrayBufferToBase64;
        Blob.uint8ArrayToBase64 = _tools.Blob.uint8ArrayToBase64;
        // Blob stuff
        Blob.URL = _tools.Blob.URL;
    })(Blob = exports.Blob || (exports.Blob = {}));
    exports.DateTime = _tools.DateTime;
    // Tools APIs
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
define("cdp/tools", ["require", "exports", "cdp/tools/tools"], function (require, exports, tools_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(tools_1);
});
define("cdp/ui/listview", ["require", "exports", "cdp.ui.listview"], function (require, exports, _ui) {
    "use strict";
    // global config
    exports.ListViewGlobalConfig = _ui.ListViewGlobalConfig;
    exports.LineProfile = _ui.LineProfile;
    exports.GroupProfile = _ui.GroupProfile;
    // ListView APIs
    exports.composeViews = _ui.composeViews;
    exports.deriveViews = _ui.deriveViews;
    exports.mixinViews = _ui.mixinViews;
    exports.StatusManager = _ui.StatusManager;
    exports.PageProfile = _ui.PageProfile;
    exports.ScrollerElement = _ui.ScrollerElement;
    // @class ScrollerNative
    exports.ScrollerNative = _ui.ScrollerNative;
    exports.ScrollerIScroll = _ui.ScrollerIScroll;
    exports.ListItemView = _ui.ListItemView;
    exports.ScrollManager = _ui.ScrollManager;
    exports.ListView = _ui.ListView;
    exports.GroupListItemView = _ui.GroupListItemView;
    exports.ExpandManager = _ui.ExpandManager;
    exports.ExpandableListView = _ui.ExpandableListView;
});
define("cdp/ui/jqm", ["require", "exports", "cdp.ui.jqm"], function (require, exports, _ui) {
    "use strict";
    // @module Toast
    var Toast;
    (function (Toast) {
        // Toast stuff
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
define("cdp/ui", ["require", "exports", "cdp/ui/listview", "cdp/ui/jqm"], function (require, exports, listview_1, jqm_2) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(listview_1);
    __export(jqm_2);
});







/// <amd-module name="cdp" />
define("cdp", ["require", "exports", "cdp/core", "cdp/framework", "cdp/tools", "cdp/ui"], function (require, exports, core_2, Framework, Tools, UI) {
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

