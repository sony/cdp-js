/*!
 * cdp.ui.jqm.js 2.0.0
 *
 * Date: 2017-07-27T02:33:21.753Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(["cdp.framework.jqm", "cdp.tools", "cdp.ui.listview"], function () { return factory(root.CDP || (root.CDP = {})); }); } else { factory(root.CDP || (root.CDP = {})); } }(this, function (CDP) { CDP.UI = CDP.UI || {};
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Config = CDP.Config;
        var Framework = CDP.Framework;
        var TAG = "[CDP.UI.Theme] ";
        //__________________________________________________________________________________________________________//
        /**
         * @class Theme
         * @brief UI Theme 設定を行うユーティリティクラス
         */
        var Theme = (function () {
            function Theme() {
            }
            ///////////////////////////////////////////////////////////////////////
            // public static methods:
            /**
             * Theme の初期化
             *
             * @param options オプション指定
             * @returns true: 成功 / false: 失敗
             */
            Theme.initialize = function (options) {
                var opt = $.extend({}, {
                    platform: "auto",
                    reserveScrollbarRegion: true,
                }, options);
                if ("auto" === opt.platform) {
                    return Theme.detectUIPlatform(opt.reserveScrollbarRegion);
                }
                else {
                    if (Theme.setCurrentUIPlatform(opt.platform)) {
                        return opt.platform;
                    }
                    else {
                        console.warn(TAG + "setCurrentUIPlatform(), failed. platform: " + opt.platform);
                    }
                }
            };
            /**
             * 現在指定されている UI Platform を取得
             *
             * @return {String} ex) "ios"
             */
            Theme.getCurrentUIPlatform = function () {
                var $htms = $("html");
                for (var i = 0, n = Theme.s_platforms.length; i < n; i++) {
                    if ($htms.hasClass("ui-platform-" + Theme.s_platforms[i])) {
                        return Theme.s_platforms[i];
                    }
                }
                return null;
            };
            /**
             * UI Platform を設定
             *
             * @return {String} true: 成功 / false: 失敗
             */
            Theme.setCurrentUIPlatform = function (platform) {
                if (null == platform || Theme.s_platforms.indexOf(platform) >= 0) {
                    var $htms_1 = $("html");
                    Theme.s_platforms.forEach(function (target) {
                        $htms_1.removeClass("ui-platform-" + target);
                    });
                    if (platform) {
                        $htms_1.addClass("ui-platform-" + platform);
                    }
                    return true;
                }
                else {
                    return false;
                }
            };
            /**
             * 現在の Platform を判定し最適な platform を自動決定
             *
             * @param reserveScrollbarRegion PC デバッグ環境ではスクロールバーを表示. default: true
             * @returns ex) "ios"
             */
            Theme.detectUIPlatform = function (reserveScrollbarRegion) {
                if (reserveScrollbarRegion === void 0) { reserveScrollbarRegion = true; }
                var platform = "";
                // platform の設定
                if (Framework.Platform.iOS) {
                    $("html").addClass("ui-platform-ios");
                    platform = "ios";
                }
                else {
                    $("html").addClass("ui-platform-android");
                    platform = "android";
                }
                // PC デバッグ環境ではスクロールバーを表示
                if (Config.DEBUG && reserveScrollbarRegion && !Framework.Platform.Mobile) {
                    $("body").css("overflow-y", "scroll");
                }
                return platform;
            };
            /**
             * platform を配列で登録
             * 上書きされる
             *
             * @param {String[]} platforms [in] OS ex): ["ios", "android"]
             */
            Theme.registerUIPlatforms = function (platforms) {
                if (platforms) {
                    Theme.s_platforms = platforms;
                }
            };
            /**
             * page transition を登録
             * 上書きされる
             *
             * @param {TransitionMap} map [in] TransitionMap を指定
             */
            Theme.registerPageTransitionMap = function (map) {
                if (map) {
                    Theme.s_pageTransitionMap = map;
                }
            };
            /**
             * dialog transition を登録
             * 上書きされる
             *
             * @param {TransitionMap} map [in] TransitionMap を指定
             */
            Theme.registerDialogTransitionMap = function (map) {
                if (map) {
                    Theme.s_dialogTransitionMap = map;
                }
            };
            /**
             * page transition を取得
             * TransitionMap にアサインされているものであれば変換
             *
             * @return {String[]} "slide"
             */
            Theme.queryPageTransition = function (original) {
                var convert = Theme.s_pageTransitionMap[original];
                if (convert) {
                    return convert[Theme.getCurrentUIPlatform()] || convert.fallback;
                }
                else {
                    return original;
                }
            };
            /**
             * dialog transition を取得
             * TransitionMap にアサインされているものであれば変換
             *
             * @return {String[]} "slide"
             */
            Theme.queryDialogTransition = function (original) {
                var convert = Theme.s_dialogTransitionMap[original];
                if (convert) {
                    return convert[Theme.getCurrentUIPlatform()] || convert.fallback;
                }
                else {
                    return original;
                }
            };
            Theme.s_platforms = ["ios", "android"];
            Theme.s_pageTransitionMap = {
                "platform-default": {
                    ios: "slide",
                    android: "floatup",
                    fallback: "slide",
                },
                "platform-alternative": {
                    ios: "slideup",
                    android: "floatup",
                    fallback: "slideup",
                },
            };
            Theme.s_dialogTransitionMap = {
                "platform-default": {
                    ios: "popzoom",
                    android: "crosszoom",
                    fallback: "none",
                },
            };
            return Theme;
        }());
        UI.Theme = Theme;
        //__________________________________________________________________________________________________________//
        // jquey.mobile.changePage() の Hook.
        function applyCustomChangePage() {
            var jqmChangePage = _.bind($.mobile.changePage, $.mobile);
            function customChangePage(to, options) {
                if (_.isString(to)) {
                    if (options && options.transition) {
                        options.transition = Theme.queryPageTransition(options.transition);
                    }
                }
                jqmChangePage(to, options);
            }
            $.mobile.changePage = customChangePage;
        }
        // framework 初期化後に適用
        Framework.waitForInitialize()
            .done(function () {
            applyCustomChangePage();
        });
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        //__________________________________________________________________________________________________________//
        /**
         * @class ExtensionManager
         * @brief 拡張機能を管理するユーティリティクラス
         */
        var ExtensionManager = (function () {
            function ExtensionManager() {
            }
            /**
             * DOM 拡張関数の登録
             *
             * @param {DomExtension} func [in] DOM 拡張関数
             */
            ExtensionManager.registerDomExtension = function (func) {
                this.s_domExtensions.push(func);
            };
            /**
             * DOM 拡張を適用
             *
             * @param {jQuery} $ui       [in] 拡張対象の DOM
             * @param {Object} [options] [in] オプション
             */
            ExtensionManager.applyDomExtension = function ($ui, options) {
                this.s_domExtensions.forEach(function (func) {
                    func($ui, options);
                });
            };
            ExtensionManager.s_domExtensions = [];
            return ExtensionManager;
        }());
        UI.ExtensionManager = ExtensionManager;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
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
            Toast.LENGTH_SHORT = 1500; //!< 短い:1500 msec
            Toast.LENGTH_LONG = 4000; //!< 長い:4000 msec
            //! @enum オフセットの基準
            var OffsetX;
            (function (OffsetX) {
                OffsetX[OffsetX["LEFT"] = 1] = "LEFT";
                OffsetX[OffsetX["RIGHT"] = 2] = "RIGHT";
                OffsetX[OffsetX["CENTER"] = 4] = "CENTER";
            })(OffsetX = Toast.OffsetX || (Toast.OffsetX = {}));
            //! @enum オフセットの基準
            var OffsetY;
            (function (OffsetY) {
                OffsetY[OffsetY["TOP"] = 16] = "TOP";
                OffsetY[OffsetY["BOTTOM"] = 32] = "BOTTOM";
                OffsetY[OffsetY["CENTER"] = 64] = "CENTER";
            })(OffsetY = Toast.OffsetY || (Toast.OffsetY = {}));
            /**
             * @class StyleBuilderDefault
             * @brief スタイル変更時に使用する既定の構造体オブジェクト
             */
            var StyleBuilderDefault = (function () {
                function StyleBuilderDefault() {
                }
                //! class attribute に設定する文字列を取得
                StyleBuilderDefault.prototype.getClass = function () {
                    return "ui-loader ui-overlay-shadow ui-corner-all";
                };
                //! style attribute に設定する JSON オブジェクトを取得
                StyleBuilderDefault.prototype.getStyle = function () {
                    var style = {
                        "padding": "7px 25px 7px 25px",
                        "display": "block",
                        "background-color": "#1d1d1d",
                        "border-color": "#1b1b1b",
                        "color": "#fff",
                        "text-shadow": "0 1px 0 #111",
                        "font-weight": "bold",
                        "opacity": 0.8,
                    };
                    return style;
                };
                //! オフセットの基準位置を取得
                StyleBuilderDefault.prototype.getOffsetPoint = function () {
                    return OffsetX.CENTER | OffsetY.BOTTOM;
                };
                //! X 座標のオフセット値を取得
                StyleBuilderDefault.prototype.getOffsetX = function () {
                    return 0;
                };
                //! Y 座標のオフセット値を取得
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
                var $window = $(window);
                var posX, posY;
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
        var Promise = CDP.Promise;
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
                var $document = $(document);
                var $body = $("body");
                var $page = $body.pagecontainer("getActivePage");
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
                var parentScrollPos = $body.scrollTop();
                var ofcPage = {
                    "overflow": $page.css("overflow"),
                    "overflow-x": $page.css("overflow-x"),
                    "overflow-y": $page.css("overflow-y"),
                };
                var scrollEvent = "scroll touchmove mousemove MSPointerMove";
                var scrollHander = function (event) {
                    if ("deny" === _this._settings.scrollEvent) {
                        event.preventDefault();
                    }
                    else if ("adjust" === _this._settings.scrollEvent) {
                        $body.scrollTop(parentScrollPos);
                    }
                };
                // option が指定されていた場合更新
                if (null != options) {
                    this._settings = $.extend({}, this._settings, options);
                }
                // afterclose 処理は Dialog の破棄処理を実装するため基本的に設定禁止 (強制上書きモードを設定使用可)
                if (this._settings.afterclose && !this._settings.forceOverwriteAfterClose) {
                    console.warn(TAG + "cannot accept 'afterclose' option. please instead using 'popupafterclose' event.");
                    delete this._settings.afterclose;
                }
                // title の有無
                this._settings._titleState = this._settings.title ? "ui-has-title" : "ui-no-title";
                /*
                 * template から jQuery オブジェクトを作成し、
                 * <body> 直下に追加.
                 * $page では Backbone event を受けられないことに注意
                 */
                this._$dialog = $(this._template(this._settings));
                this._$dialog.localize();
                $body.append(this._$dialog);
                // theme を解決
                this.resolveTheme();
                this._$dialog
                    .on("popupcreate", function (event) {
                    // スクロールを抑止
                    if ("allow" !== _this._settings.scrollEvent) {
                        $document.on(scrollEvent, scrollHander);
                    }
                    $body.css(ofcHidden);
                    $page.css(ofcHidden);
                    Dialog.register(_this);
                })
                    .enhanceWithin();
                // DOM 拡張
                if (null != this._settings.domExtensionOptions) {
                    UI.ExtensionManager.applyDomExtension(this._$dialog, this._settings.domExtensionOptions);
                }
                this.onBeforeShow()
                    .done(function () {
                    // 表示
                    _this._$dialog
                        .popup($.extend({}, {
                        positionTo: "window",
                        afterclose: function (event, ui) {
                            // スクロール状態を戻す
                            $page.css(ofcPage);
                            $body.css(ofcBody);
                            if ("allow" !== _this._settings.scrollEvent) {
                                $document.off(scrollEvent, scrollHander);
                            }
                            Dialog.register(null);
                            _this._$dialog.remove();
                            _this._$dialog = null;
                        },
                    }, _this._settings))
                        .popup("open").on(_this._settings.event, function (event) {
                        // "data-auto-close='false'" が指定されている要素は dialog を閉じない
                        var autoClose = $(event.target).attr("data-auto-close");
                        if (null == autoClose) {
                            autoClose = _this._settings.defaultAutoClose ? "true" : "false";
                        }
                        if ("false" === autoClose) {
                            return;
                        }
                        _this.close();
                        event.preventDefault();
                    });
                })
                    .fail(function (error) {
                    console.error(TAG + "Dialog.show() failed.");
                    if (_this._$dialog) {
                        _this._$dialog.trigger("error", error);
                    }
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
                //! ダイアログ element を取得
                get: function () {
                    return this._$dialog;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // protected methods: Override
            /**
             * ダイアログ表示の直前
             * DOM を操作できるタイミングで呼び出される.
             *
             * @return {IPromiseBase} promise オブジェクト
             */
            Dialog.prototype.onBeforeShow = function () {
                return Promise.resolve();
            };
            /**
             * ダイアログの使用する Theme を解決
             * 不要な場合はオーバーライドすることも可能
             */
            Dialog.prototype.resolveTheme = function () {
                var queryTheme = function () {
                    return $(".ui-page-active").jqmData("theme");
                };
                var candidateTheme;
                if (!this._settings.theme) {
                    var domTheme = this._$dialog.jqmData("theme");
                    if (!domTheme) {
                        this._settings.theme = candidateTheme = queryTheme();
                    }
                }
                if (!this._settings.overlayTheme) {
                    var domOverlayTheme = this._$dialog.jqmData("overlay-theme");
                    if (!domOverlayTheme) {
                        this._settings.overlayTheme = candidateTheme || queryTheme();
                    }
                }
                // transition の更新
                this._settings.transition = UI.Theme.queryDialogTransition(this._settings.transition);
            };
            ///////////////////////////////////////////////////////////////////////
            // public static methods
            /**
             * Dialog の既定オプションを更新
             * すべての Dialog が使用する共通設定
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
                        defaultAutoClose: false,
                        transition: "platform-default",
                        labelPositive: "OK",
                        labelNegative: "Cancel",
                        backKey: "close",
                        scrollEvent: "deny",
                        domExtensionOptions: {},
                    };
                }
            };
            /**
             * H/W Back Button Handler
             */
            Dialog.customBackKeyHandler = function (event) {
                if (null != Dialog.s_activeDialog) {
                    if ("close" === Dialog.s_activeDialog._settings.backKey) {
                        Dialog.s_activeDialog.close();
                    }
                    else if ("function" === typeof Dialog.s_activeDialog._settings.backKey) {
                        Dialog.s_activeDialog._settings.backKey(event);
                    }
                    return; // Dialog が active な場合、常に既定のハンドラには渡さない
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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.DialogCommons] ";
        /**
         * Alert
         * alert メッセージ表示
         *
         * @param {String} message   [in] 表示文字列
         * @param {String} [options] [in] ダイアログオプション
         * @return {jQuery} ダイアログの DOM オブジェクト
         */
        function alert(message, options) {
            var template = "\n            <script type=\"text/template\">\n                <section class=\"ui-modal\" data-role=\"popup\" data-corners=\"false\">\n                    <div class=\"ui-content\">\n                        <h1 class=\"ui-title {{_titleState}}\">{{title}}</h1>\n                        <p class=\"ui-message\">{{message}}</p>\n                    </div>\n                    <div class=\"ui-modal-footer ui-grid-solo\">\n                        <button id=\"{{idPositive}}\" class=\"ui-btn ui-block-a ui-text-emphasis\" data-auto-close=\"true\">{{labelPositive}}</button>\n                    </div>\n                </section>\n            </script>\n        ";
            var dlgAlert = new UI.Dialog(template, $.extend({}, {
                src: null,
                message: message,
            }, options));
            return dlgAlert.show();
        }
        UI.alert = alert;
        /**
         * Confirm
         * 確認メッセージ表示
         *
         * @param {String} message   [in] 表示文字列
         * @param {String} [options] [in] ダイアログオプション
         * @return {jQuery} ダイアログの DOM オブジェクト
         */
        function confirm(message, options) {
            var template = "\n            <script type=\"text/template\">\n                <section class=\"ui-modal\" data-role=\"popup\" data-corners=\"false\">\n                    <div class=\"ui-content\">\n                        <h1 class=\"ui-title {{_titleState}}\">{{title}}</h1>\n                        <p class=\"ui-message\">{{message}}</p>\n                    </div>\n                    <div class=\"ui-modal-footer ui-grid-a\">\n                        <button id=\"{{idNegative}}\" class=\"ui-btn ui-block-a\" data-auto-close=\"true\">{{labelNegative}}</button>\n                        <button id=\"{{idPositive}}\" class=\"ui-btn ui-block-b ui-text-emphasis\" data-auto-close=\"true\">{{labelPositive}}</button>\n                    </div>\n                </section>\n            </script>\n        ";
            var dlgConfirm = new UI.Dialog(template, $.extend({}, {
                src: null,
                message: message,
            }, options));
            return dlgConfirm.show();
        }
        UI.confirm = confirm;
        /**
         * @class DialogPrompt
         * @brief prompt ダイアログ (非公開)
         */
        var DialogPrompt = (function (_super) {
            __extends(DialogPrompt, _super);
            /**
             * constructor
             *
             */
            function DialogPrompt(id, options) {
                var _this = _super.call(this, id, options) || this;
                _this._eventOK = options.eventOK || "promptok";
                return _this;
            }
            //! ダイアログ表示の直前
            DialogPrompt.prototype.onBeforeShow = function () {
                var _this = this;
                var onCommit = function (event) {
                    var text = _this.$el.find("#_ui-prompt").val();
                    _this.$el.trigger(_this._eventOK, text);
                    _this.close();
                    event.preventDefault();
                };
                this.$el
                    .on("vclick", ".command-prompt-ok ", function (event) {
                    onCommit(event);
                })
                    .on("keydown", "#_ui-prompt", function (event) {
                    var ENTER_KEY_CODE = 13;
                    if (ENTER_KEY_CODE === event.keyCode) {
                        onCommit(event);
                    }
                });
                return _super.prototype.onBeforeShow.call(this);
            };
            return DialogPrompt;
        }(UI.Dialog));
        /**
         * Prompt
         *
         * @param {String} message   [in] 表示文字列
         * @param {String} [options] [in] ダイアログオプション
         * @return {jQuery} ダイアログの DOM オブジェクト
         */
        function prompt(message, options) {
            var template = "\n            <script type=\"text/template\">\n                <section class=\"ui-modal\" data-role=\"popup\" data-corners=\"false\">\n                    <div class=\"ui-content\">\n                        <h1 class=\"ui-title {{_titleState}}\">{{title}}</h1>\n                        <p class=\"ui-message\">{{message}}</p>\n                        <label for=\"_ui-prompt\" class=\"ui-hidden-accessible\"></label>\n                        <input type=\"text\" name=\"_ui-prompt\" id=\"_ui-prompt\">\n                    </div>\n                    <div class=\"ui-modal-footer ui-grid-a\">\n                        <button id=\"{{idNegative}}\" class=\"ui-btn ui-block-a\" data-auto-close=\"true\">{{labelNegative}}</button>\n                        <button id=\"{{idPositive}}\" class=\"command-prompt-ok ui-btn ui-block-b ui-text-emphasis\" data-auto-close=\"false\">{{labelPositive}}</button>\n                    </div>\n                </section>\n            </script>\n        ";
            var dlgPrompt = new DialogPrompt(template, $.extend({}, {
                src: null,
                message: message,
            }, options));
            return dlgPrompt.show();
        }
        UI.prompt = prompt;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Router = CDP.Framework.Router;
        var View = CDP.Framework.View;
        var Template = CDP.Tools.Template;
        var TAG = "[CDP.UI.BaseHeaderView] ";
        //__________________________________________________________________________________________________________//
        /**
         * @class BaseHeaderView
         * @brief 共通ヘッダを操作するクラス
         */
        var BaseHeaderView = (function (_super) {
            __extends(BaseHeaderView, _super);
            /**
             * constructor
             *
             * @param {IPage} _owner [in] オーナーページインスタンス
             */
            function BaseHeaderView(_owner, _options) {
                var _this = _super.call(this, _options = $.extend({
                    el: _owner.$page.find("[data-role='header']"),
                    backCommandSelector: ".command-back",
                    backCommandKind: "pageback",
                }, _options)) || this;
                _this._owner = _owner;
                _this._options = _options;
                // template 設定
                if (_options.baseTemplate) {
                    _this._template = _options.baseTemplate;
                }
                else {
                    _this._template = Template.getJST("\n                    <script type='text/template'>\n                        <header class='ui-header-base ui-body-{{theme}}'>\n                            <div class='ui-fixed-back-indicator'></div>\n                        </header>\n                    </script>\n                ");
                }
                // Backbone.View 用の初期化
                _this.setElement(_this.$el, true);
                return _this;
            }
            ///////////////////////////////////////////////////////////////////////
            // public methods
            /**
             * 初期化
             */
            BaseHeaderView.prototype.create = function () {
                return this.createHeaderBase();
            };
            /**
             * 有効化
             */
            BaseHeaderView.prototype.activate = function () {
                return this.showIndicator();
            };
            /**
             * 無効化
             */
            BaseHeaderView.prototype.inactivate = function () {
                return this.hideIndicator();
            };
            /**
             * 破棄
             */
            BaseHeaderView.prototype.release = function () {
                return this.releaseHeaderBase();
            };
            ///////////////////////////////////////////////////////////////////////
            // private methods
            //! 共通ヘッダのベースを準備
            BaseHeaderView.prototype.createHeaderBase = function () {
                // 固定ヘッダのときに有効化
                if ("fixed" === this._owner.$header.jqmData("position")) {
                    if (null == BaseHeaderView.s_$headerBase) {
                        BaseHeaderView.s_$headerBase = $(this._template({
                            theme: this._owner.$page.jqmData("theme"),
                        }));
                    }
                    BaseHeaderView.s_refCount++;
                    BaseHeaderView.s_$headerBase.appendTo($(document.body));
                }
                // Back Indicator を持っているか判定
                if (0 < this.$el.find(".ui-back-indicator").length) {
                    this._hasBackIndicator = true;
                }
                return BaseHeaderView.s_$headerBase;
            };
            //! indicator の表示
            BaseHeaderView.prototype.showIndicator = function () {
                // Back Indicator を持っていない場合表示しない
                if (null != BaseHeaderView.s_$headerBase && this._hasBackIndicator) {
                    BaseHeaderView.s_$headerBase.find(".ui-fixed-back-indicator").addClass("show");
                }
                return BaseHeaderView.s_$headerBase;
            };
            //! indicator の非表示
            BaseHeaderView.prototype.hideIndicator = function () {
                if (null != BaseHeaderView.s_$headerBase) {
                    BaseHeaderView.s_$headerBase.find(".ui-fixed-back-indicator").removeClass("show");
                }
                return BaseHeaderView.s_$headerBase;
            };
            //! 共通ヘッダのベースを破棄
            BaseHeaderView.prototype.releaseHeaderBase = function () {
                // 固定ヘッダ時に参照カウントを管理
                if ("fixed" === this._owner.$header.jqmData("position")) {
                    if (null != BaseHeaderView.s_$headerBase) {
                        BaseHeaderView.s_refCount--;
                        if (0 === BaseHeaderView.s_refCount) {
                            BaseHeaderView.s_$headerBase.remove();
                            BaseHeaderView.s_$headerBase = null;
                        }
                    }
                }
                return BaseHeaderView.s_$headerBase;
            };
            ///////////////////////////////////////////////////////////////////////
            // Override: Backbone.View
            //! events binding
            BaseHeaderView.prototype.events = function () {
                var eventMap = {};
                if (this._options) {
                    eventMap["vclick " + this._options.backCommandSelector] = this.onCommandBack;
                }
                return eventMap;
            };
            //! back のハンドラ
            BaseHeaderView.prototype.onCommandBack = function (event) {
                event.preventDefault();
                var handled = false;
                if (this._owner) {
                    handled = this._owner.onCommand(event, this._options.backCommandKind);
                }
                if (!handled) {
                    Router.back();
                }
            };
            BaseHeaderView.s_refCount = 0; //!< 参照カウント
            return BaseHeaderView;
        }(View));
        UI.BaseHeaderView = BaseHeaderView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Framework = CDP.Framework;
        var TAG = "[CDP.UI.BasePage] ";
        //__________________________________________________________________________________________________________//
        /**
         * @class BasePage
         * @brief Header を備える Page クラス
         */
        var BasePage = (function (_super) {
            __extends(BasePage, _super);
            /**
             * constructor
             *
             * @param {String}          url       [in] ページ URL
             * @param {String}          id        [in] ページ ID
             * @param {BasePageOptions} [options] [in] オプション
             */
            function BasePage(url, id, _options) {
                var _this = _super.call(this, url, id, _options = $.extend({
                    baseHeader: UI.BaseHeaderView,
                    backCommandHandler: "onPageBack",
                    backCommandKind: "pageback",
                    domExtensionOptions: {},
                }, _options)) || this;
                _this._options = _options;
                return _this;
            }
            ///////////////////////////////////////////////////////////////////////
            // Override: Framework Page
            /**
             * jQM event: "pagebeforecreate" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            BasePage.prototype.onPageBeforeCreate = function (event) {
                if (this._options.baseHeader) {
                    this._baseHeader = new this._options.baseHeader(this, this._options);
                    this._baseHeader.create();
                }
                _super.prototype.onPageBeforeCreate.call(this, event);
            };
            /**
             * jQM event: "pagecreate" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            BasePage.prototype.onPageInit = function (event) {
                if (null != this._options.domExtensionOptions) {
                    UI.ExtensionManager.applyDomExtension(this.$page, this._options.domExtensionOptions);
                }
                _super.prototype.onPageInit.call(this, event);
            };
            /**
             * jQM event: "pagebeforeshow" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            BasePage.prototype.onPageBeforeShow = function (event, data) {
                if (this._baseHeader) {
                    this._baseHeader.activate();
                }
                _super.prototype.onPageBeforeShow.call(this, event, data);
            };
            /**
             * jQM event: "pagebeforehide" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            BasePage.prototype.onPageBeforeHide = function (event, data) {
                if (this._baseHeader) {
                    this._baseHeader.inactivate();
                }
                _super.prototype.onPageBeforeHide.call(this, event, data);
            };
            /**
             * jQM event: "pageremove" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            BasePage.prototype.onPageRemove = function (event) {
                if (this._baseHeader) {
                    this._baseHeader.release();
                    this._baseHeader = null;
                }
                _super.prototype.onPageRemove.call(this, event);
            };
            /**
             * H/W Back Button ハンドラ
             *
             * @param  event {JQuery.Event} [in] event object
             * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
             */
            BasePage.prototype.onHardwareBackButton = function (event) {
                var retval = _super.prototype.onHardwareBackButton.call(this, event);
                if (!retval) {
                    retval = this.onCommand(event, this._options.backCommandKind);
                }
                return retval;
            };
            ///////////////////////////////////////////////////////////////////////
            // Override: Custom Event
            /**
             * "戻る" event 発行時にコールされる
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
             */
            BasePage.prototype.onCommand = function (event, kind) {
                if (this._options.backCommandKind === kind) {
                    if (this._owner && this._owner[this._options.backCommandHandler]) {
                        return this._owner[this._options.backCommandHandler](event);
                    }
                }
                return false;
            };
            return BasePage;
        }(Framework.Page));
        UI.BasePage = BasePage;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Promise = CDP.Promise;
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
                var _this = _super.call(this, options) || this;
                _this._owner = null;
                _this._owner = options.owner;
                if (options.$el) {
                    var delegates = _this.events ? true : false;
                    _this.setElement(options.$el, delegates);
                }
                return _this;
            }
            Object.defineProperty(PageContainerView.prototype, "owner", {
                ///////////////////////////////////////////////////////////////////////
                // short cut methods
                //! Owner 取得
                get: function () {
                    return this._owner;
                },
                enumerable: true,
                configurable: true
            });
            return PageContainerView;
        }(Framework.View));
        UI.PageContainerView = PageContainerView;
        /* tslint:enable:no-use-before-declare */
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
                var _this = _super.call(this, options) || this;
                _this._pageOptions = null;
                _this._basePage = null;
                _this._statusMgr = null;
                // PageView 設定
                _this._pageOptions = $.extend({}, { owner: _this }, options);
                _this._basePage = _this._pageOptions.basePage ? new _this._pageOptions.basePage(url, id, _this._pageOptions) : new UI.BasePage(url, id, _this._pageOptions);
                // StatusManager
                _this._statusMgr = new UI.StatusManager();
                // Backbone.View 用の初期化
                var delegates = _this.events ? true : false;
                _this.setElement(_this.$page, delegates);
                return _this;
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
             * @param  event {JQuery.Event} [in] event object
             * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
             */
            PageView.prototype.onHardwareBackButton = function (event) {
                return false;
            };
            /**
             * Router "before route change" ハンドラ
             * ページ遷移直前に非同期処理を行うことが可能
             *
             * @return {IPromiseBase} Promise オブジェクト
             */
            PageView.prototype.onBeforeRouteChange = function () {
                return Promise.resolve();
            };
            /**
             * 汎用コマンドを受信
             *
             * @param  event {JQuery.Event} [in] event object
             * @param  event {kind}              [in] command kind string
             * @return {Boolean} true: 既定の処理を行わない / false: 既定の処理を行う
             */
            PageView.prototype.onCommand = function (event, kind) {
                return false;
            };
            /**
             * 最初の OnPageInit() のときにのみコールされる
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageView.prototype.onInitialize = function (event) {
                // Override
            };
            /**
             * jQM event: "pagebeforecreate" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageView.prototype.onPageBeforeCreate = function (event) {
                this.setElement(this.$page, true);
            };
            /**
             * jQM event: "pagecreate" (旧:"pageinit") に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageView.prototype.onPageInit = function (event) {
                // Override
            };
            /**
             * jQM event: "pagebeforeshow" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            PageView.prototype.onPageBeforeShow = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pagecontainershow" (旧:"pageshow") に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            PageView.prototype.onPageShow = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pagebeforehide" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            PageView.prototype.onPageBeforeHide = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            PageView.prototype.onPageHide = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pageremove" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageView.prototype.onPageRemove = function (event) {
                this.remove();
                this.el = null;
                this.$el = null;
            };
            return PageView;
        }(Framework.View));
        UI.PageView = PageView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.TabHostView] ";
        var _Config;
        (function (_Config) {
            _Config.TABVIEW_CLASS = "ui-tabview";
            _Config.TABVIEW_SELECTOR = "." + _Config.TABVIEW_CLASS;
            _Config.TABHOST_CLASS = "ui-tabhost";
            _Config.TABHOST_SELECTOR = "." + _Config.TABHOST_CLASS;
            _Config.TABHOST_REFRESH_COEFF = 1.0; // flipsnap 切り替え時に duration に対して更新を行う係数
            _Config.TABHOST_REFRESH_INTERVAL = 200; // flipsnap の更新に使用する間隔 [msec]
        })(_Config || (_Config = {}));
        /**
         * @class TabHostView
         * @brief タブ切り替え機能を持つ View クラス
         */
        var TabHostView = (function (_super) {
            __extends(TabHostView, _super);
            /**
             * constructor
             *
             * @param options [in] オプション
             */
            function TabHostView(options) {
                var _this = _super.call(this, options) || this;
                _this._tabs = []; // ITabView を格納
                _this._activeTabIndex = 0; // active tab
                _this._flipsnap = null; // flipsnap オブジェクト
                _this._flipEndEventHandler = null; // "fstouchend"
                _this._flipMoveEventHandler = null; // "fstouchmove"
                _this._flipDeltaCache = 0; // "flip 距離のキャッシュ"
                _this._refreshTimerId = null; // refresh() 反映確認用
                _this._$contentsHolder = null; // contents holder
                _this._hostEventHooks = {};
                // check runtime condition
                if (null == UI.global.Flipsnap) {
                    console.error(TAG + "flipsnap module doesn't load.");
                    return _this;
                }
                _this._settings = $.extend({
                    tabContexts: [],
                    tabMoveHandler: function (delta) { },
                    tabStopHandler: function (newIndex, moved) { }
                }, options);
                // setup event handlers
                _this._flipEndEventHandler = function (event) {
                    var fsEvent = event.originalEvent;
                    _this._flipDeltaCache = 0;
                    _this.onTabChanged(fsEvent.newPoint, fsEvent.moved);
                };
                _this._flipMoveEventHandler = function (event) {
                    var fsEvent = event.originalEvent;
                    _this._flipDeltaCache += fsEvent.delta;
                    // bounce のガード
                    if (!_this._settings.enableBounce && ((-1 === fsEvent.direction && 0 === _this._activeTabIndex && 0 < _this._flipDeltaCache) ||
                        (1 === fsEvent.direction && _this._activeTabIndex === _this._tabs.length - 1 && _this._flipDeltaCache < 0))) {
                        event.preventDefault();
                        _this._flipsnap.moveToPoint(fsEvent.newPoint);
                    }
                    else {
                        _this.onTabMoving(fsEvent.delta);
                        _this._tabs.forEach(function (tabview) {
                            tabview.onTabScrolling(_this._activeTabIndex, fsEvent.delta);
                        });
                        _this.preprocess(_this._activeTabIndex);
                    }
                };
                if (_this._settings.scrollHandler) {
                    _this.setScrollHandler(_this._settings.scrollHandler, true);
                }
                if (_this._settings.scrollStopHandler) {
                    _this.setScrollStopHandler(_this._settings.scrollStopHandler, true);
                }
                // host event hook
                _this._hostEventHooks.onOrientationChanged = _this.owner.onOrientationChanged.bind(_this.owner);
                _this.owner.onOrientationChanged = _this.onOrientationChanged.bind(_this);
                _this._hostEventHooks.onPageShow = _this.owner.onPageShow.bind(_this.owner);
                _this.owner.onPageShow = _this.onPageShow.bind(_this);
                // setup tabs
                var initialWidth = _this._settings.initialWidth || _this.$el.width();
                var initialHeight = _this._settings.initialHeight || _this.$el.height();
                var tabContexts = _this._settings.tabContexts.slice();
                if (0 < tabContexts.length) {
                    tabContexts.forEach(function (context) {
                        /* tslint:disable:no-unused-expression */
                        new context.ctor($.extend({}, context.options, { host: _this, delayRegister: false }));
                        /* tslint:enable:no-unused-expression */
                    });
                }
                else {
                    // ITabView インスタンス化要求
                    _this.onTabViewSetupRequest(initialHeight);
                }
                // ITabView に $tabHost をアサインする
                // NOTE: 現在は DOM の順序は固定
                _this._tabs.forEach(function (tabview, index) {
                    tabview.onInitialize(_this, $(_this.$el[index]));
                });
                _this._$contentsHolder = _this.$el.parent();
                // Flipsnap
                _this.setFlipsnapCondition($.extend({}, {
                    distance: initialWidth,
                }, _this._settings));
                _this.setActiveTab(_this._activeTabIndex, 0, true);
                return _this;
            }
            /**
             * 破棄のヘルパー関数
             * メンバーの破棄のタイミングを変える場合、本メソッドをコールする
             */
            TabHostView.prototype.destroy = function () {
                if (this._settings.scrollHandler) {
                    this.setScrollHandler(this._settings.scrollHandler, false);
                }
                if (this._settings.scrollStopHandler) {
                    this.setScrollStopHandler(this._settings.scrollStopHandler, false);
                }
                this.resetFlipsnapCondition();
                this._tabs.forEach(function (tabview) {
                    tabview.onDestroy();
                });
                this._tabs = [];
                this._$contentsHolder = null;
            };
            ///////////////////////////////////////////////////////////////////////
            // public methods:
            /**
             * TabView を登録
             * Framework が使用
             *
             * @param tabview [in] ITabView のインスタンス
             */
            TabHostView.prototype.registerTabView = function (tabview) {
                if (null == this.getTabIndexOf(tabview)) {
                    this._tabs.push(tabview);
                }
                else {
                    console.warn(TAG + "tab instance already registered.");
                }
            };
            /**
             * TabView の Tab index を取得
             * Framework が使用
             *
             * @param tabview [in] ITabView のインスタンス
             * @return 指定インスタンスのインデックス
             */
            TabHostView.prototype.getTabIndexOf = function (tabview) {
                for (var i = 0, n = this._tabs.length; i < n; i++) {
                    if (tabview === this._tabs[i]) {
                        return i;
                    }
                }
                return null;
            };
            // ページの基準値を取得
            TabHostView.prototype.getBaseHeight = function () {
                return this.$el.height();
            };
            /**
             * タブの数を取得
             *
             * @return {Number} タブ数
             */
            TabHostView.prototype.getTabCount = function () {
                return this._tabs.length;
            };
            // アクティブなタブ Index を取得
            TabHostView.prototype.getActiveTabIndex = function () {
                return this._activeTabIndex;
            };
            // swipe 移動量を取得 (swipe 中に delta の加算値を返却)
            TabHostView.prototype.getSwipeDelta = function () {
                return this._flipDeltaCache;
            };
            // アクティブ Tab を設定
            TabHostView.prototype.setActiveTab = function (index, transitionDuration, initial) {
                var _this = this;
                if (this.validTab(index) && (initial || (this._activeTabIndex !== index))) {
                    // 遷移前に scroll 位置の view を更新
                    this.preprocess(index);
                    var lastActiveTabIndex_1 = this._activeTabIndex;
                    this._activeTabIndex = index;
                    this._flipsnap.moveToPoint(this._activeTabIndex, transitionDuration);
                    {
                        var changeTab_1 = function () {
                            _this.postprocess(lastActiveTabIndex_1);
                            _this.onTabChanged(_this._activeTabIndex, false);
                        };
                        transitionDuration = transitionDuration || parseInt(this._flipsnap.transitionDuration, 10);
                        if (0 === transitionDuration) {
                            changeTab_1();
                        }
                        else {
                            setTimeout(function () {
                                changeTab_1();
                            }, transitionDuration * _Config.TABHOST_REFRESH_COEFF);
                        }
                    }
                    return true;
                }
                else {
                    return false;
                }
            };
            ///////////////////////////////////////////////////////////////////////
            // protected methods:
            // flip 終了時にコールされる
            TabHostView.prototype.onTabChanged = function (newIndex, moved) {
                if (moved) {
                    this.setActiveTab(newIndex);
                }
                this._settings.tabStopHandler(newIndex, moved);
            };
            // flip 中にコールされる
            TabHostView.prototype.onTabMoving = function (delta) {
                this._settings.tabMoveHandler(delta);
            };
            // タブポジションの初期化
            TabHostView.prototype.resetTabPosition = function () {
                this._tabs.forEach(function (tabview) {
                    tabview.scrollTo(0, false, 0);
                    tabview.refresh();
                });
                this.setActiveTab(0, 0, true);
            };
            // ITabView 設定リクエスト時にコールされる
            TabHostView.prototype.onTabViewSetupRequest = function (initialHeight) {
                // override
            };
            ///////////////////////////////////////////////////////////////////////
            // Host event hooks:
            // Orientation の変更検知
            TabHostView.prototype.onOrientationChanged = function (newOrientation) {
                var _this = this;
                this._hostEventHooks.onOrientationChanged(newOrientation);
                this._tabs.forEach(function (tabview) {
                    tabview.onOrientationChanged(newOrientation);
                });
                if (null != this._refreshTimerId) {
                    clearTimeout(this._refreshTimerId);
                }
                if (this._flipsnap && 0 < this._tabs.length) {
                    (function () {
                        var proc = function () {
                            // リトライ
                            if (_this._flipsnap && _this._flipsnap._maxPoint !== (_this._tabs.length - 1)) {
                                _this._flipsnap.refresh();
                                _this._refreshTimerId = setTimeout(proc, _Config.TABHOST_REFRESH_INTERVAL);
                            }
                            else {
                                _this._refreshTimerId = null;
                            }
                        };
                        _this._flipsnap.refresh();
                        _this._refreshTimerId = setTimeout(proc, _Config.TABHOST_REFRESH_INTERVAL);
                    })();
                }
            };
            // jQM event: "pagecontainershow" (旧:"pageshow") に対応
            TabHostView.prototype.onPageShow = function (event, data) {
                this._hostEventHooks.onPageShow(event, data);
                this.rebuild();
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: ScrollManager Profile 管理
            // ページアサインを再構成
            TabHostView.prototype.rebuild = function () {
                this._tabs.forEach(function (tabview) {
                    if (tabview.needRebuild) {
                        tabview.rebuild();
                        tabview.needRebuild = false;
                    }
                });
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: ScrollManager Scroll
            // スクロールイベントハンドラ設定/解除
            TabHostView.prototype.setScrollHandler = function (handler, on) {
                if (this._activeTabView) {
                    this._activeTabView.setScrollHandler(handler, on);
                }
            };
            // スクロール終了イベントハンドラ設定/解除
            TabHostView.prototype.setScrollStopHandler = function (handler, on) {
                if (this._activeTabView) {
                    this._activeTabView.setScrollStopHandler(handler, on);
                }
            };
            // スクロール位置を取得
            TabHostView.prototype.getScrollPos = function () {
                if (this._activeTabView) {
                    return this._activeTabView.getScrollPos();
                }
                else {
                    return 0;
                }
            };
            // スクロール位置の最大値を取得
            TabHostView.prototype.getScrollPosMax = function () {
                if (this._activeTabView) {
                    return this._activeTabView.getScrollPosMax();
                }
                else {
                    return 0;
                }
            };
            // スクロール位置を指定
            TabHostView.prototype.scrollTo = function (pos, animate, time) {
                if (this._activeTabView) {
                    this._activeTabView.scrollTo(pos, animate, time);
                }
            };
            ///////////////////////////////////////////////////////////////////////
            // private methods:
            // flipsnap 環境設定
            TabHostView.prototype.setFlipsnapCondition = function (options) {
                this._flipsnap = UI.global.Flipsnap(_Config.TABHOST_SELECTOR, options);
                $(this._flipsnap.element).on("fstouchend", _.bind(this._flipEndEventHandler, this));
                $(this._flipsnap.element).on("fstouchmove", _.bind(this._flipMoveEventHandler, this));
            };
            // flipsnap 環境破棄
            TabHostView.prototype.resetFlipsnapCondition = function () {
                if (this._flipsnap) {
                    $(this._flipsnap.element).off("fstouchmove", _.bind(this._flipMoveEventHandler, this));
                    $(this._flipsnap.element).off("fstouchend", _.bind(this._flipEndEventHandler, this));
                    this._flipsnap.destroy();
                    this._flipsnap = null;
                }
                this._flipDeltaCache = 0;
            };
            // Tab 切り替えの前処理
            TabHostView.prototype.preprocess = function (toIndex) {
                var _this = this;
                this._tabs.forEach(function (tabview, index) {
                    if (index !== _this._activeTabIndex) {
                        tabview.treatScrollPosition();
                    }
                    // 移動範囲を可視化 NOTE: loop 対応時に条件見直し
                    if ((_this._activeTabIndex < toIndex && (_this._activeTabIndex < index && index <= toIndex)) ||
                        (toIndex < _this._activeTabIndex && (toIndex <= index && index < _this._activeTabIndex))) {
                        tabview.$el.css("visibility", "visible");
                    }
                });
            };
            // Tab 切り替えの後処理
            TabHostView.prototype.postprocess = function (lastActiveTabIndex) {
                var _this = this;
                this._tabs.forEach(function (tabview, index) {
                    if (null != _this._settings.inactiveVisibleTabDistance) {
                        // NOTE: loop 対応時に条件対応
                        var distance = _this._settings.inactiveVisibleTabDistance;
                        if (_this._activeTabIndex - distance <= index && index <= _this._activeTabIndex + distance) {
                            tabview.$el.css("visibility", "visible");
                            tabview.onVisibilityChanged(true);
                        }
                        else {
                            tabview.$el.css("visibility", "hidden");
                            tabview.onVisibilityChanged(false);
                        }
                    }
                    if (index === _this._activeTabIndex) {
                        tabview.onTabSelected();
                    }
                    else if (index === lastActiveTabIndex) {
                        tabview.onTabReleased();
                    }
                });
            };
            // Tab Index を検証
            TabHostView.prototype.validTab = function (index) {
                if (0 === this._tabs.length) {
                    return false;
                }
                else if (0 <= index && index < this._tabs.length) {
                    return true;
                }
                else {
                    console.error(TAG + "invalid tab index. index: " + index);
                    return false;
                }
            };
            Object.defineProperty(TabHostView.prototype, "_activeTabView", {
                // アクティブなタブ ScrollManager を取得
                get: function () {
                    return this._tabs[this._activeTabIndex];
                },
                enumerable: true,
                configurable: true
            });
            return TabHostView;
        }(UI.PageContainerView));
        UI.TabHostView = TabHostView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var TAG = "[CDP.UI.TabView] ";
        var SUPPRESS_WARNING_INITIAL_HEIGHT = 1;
        /**
         * @class TabView
         * @brief TabHostView にアタッチ可能な View クラス
         */
        var TabView = (function (_super) {
            __extends(TabView, _super);
            /**
             * constructor
             *
             */
            function TabView(options) {
                var _this = _super.call(this, $.extend({}, { initialHeight: SUPPRESS_WARNING_INITIAL_HEIGHT }, options)) || this;
                _this._host = null;
                _this._needRebuild = false; // ページ表示時に rebuild() をコールするための内部変数
                _this._host = options.host;
                if (!options.delayRegister) {
                    _this._host.registerTabView(_this);
                }
                return _this;
            }
            Object.defineProperty(TabView.prototype, "host", {
                ///////////////////////////////////////////////////////////////////////
                // Implements: IViewPager properties.
                // BaseTabPageView にアクセス
                get: function () {
                    return this._host;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TabView.prototype, "needRebuild", {
                // rebuild 状態へアクセス
                get: function () {
                    return this._needRebuild;
                },
                // rebuild 状態を設定
                set: function (rebuild) {
                    this._needRebuild = rebuild;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Implements: IViewPager Framework.
            // 状態に応じたスクロール位置の保存/復元
            TabView.prototype.treatScrollPosition = function () {
                this.core.treatScrollPosition();
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IViewPager Events.
            // Scroller の初期化時にコールされる
            TabView.prototype.onInitialize = function (host, $root) {
                this._host = host;
                this.core.initialize($root, host.getBaseHeight());
                Backbone.View.prototype.setElement.call(this, $root, true);
            };
            // Scroller の破棄時にコールされる
            TabView.prototype.onDestroy = function () {
                this.remove();
                this._host = null;
            };
            // visibility 属性が変更されたときにコールされる
            TabView.prototype.onVisibilityChanged = function (visible) {
                // override
            };
            // ページが表示完了したときにコールされる
            TabView.prototype.onTabSelected = function () {
                this.core.setActiveState(true);
            };
            // ページが非表示に切り替わったときにコールされる
            TabView.prototype.onTabReleased = function () {
                this.core.setActiveState(false);
            };
            // ドラッグ中にコールされる
            TabView.prototype.onTabScrolling = function (position, offset) {
                // override
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IOrientationChangedListener events.
            // Orientation の変更を受信
            TabView.prototype.onOrientationChanged = function (newOrientation) {
                // override
            };
            Object.defineProperty(TabView.prototype, "core", {
                ///////////////////////////////////////////////////////////////////////
                // Override: IListView
                // core framework access
                get: function () {
                    return this._scrollMgr;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(TabView.prototype, "tabIndex", {
                ///////////////////////////////////////////////////////////////////////
                // protected methods
                // 自身の Tab Index を取得
                get: function () {
                    if (null == this._tabIndex) {
                        this._tabIndex = this._host.getTabIndexOf(this);
                    }
                    return this._tabIndex;
                },
                enumerable: true,
                configurable: true
            });
            // 自身が active か判定
            TabView.prototype.isActive = function () {
                return this.tabIndex === this._host.getActiveTabIndex();
            };
            return TabView;
        }(UI.ListView));
        UI.TabView = TabView;
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
                var _this = _super.call(this, url, id, $.extend({}, {
                    autoDestoryElement: false,
                }, options)) || this;
                _this._scrollMgr = null; //!< scroll コアロジック
                _this._needRebuild = false; //!< ページ表示時に rebuild() をコールするための内部変数
                _this._scrollMgr = new UI.ScrollManager(options);
                return _this;
            }
            //! rebuild() のスケジューリング
            PageListView.prototype.reserveRebuild = function () {
                this._needRebuild = true;
            };
            ///////////////////////////////////////////////////////////////////////
            // Override: PageView
            //! Orientation の変更検知
            PageListView.prototype.onOrientationChanged = function (newOrientation) {
                this._scrollMgr.setBaseHeight(this.getPageBaseHeight());
            };
            //! ページ遷移直前イベント処理
            PageListView.prototype.onBeforeRouteChange = function () {
                if (this._pageOptions.autoDestoryElement) {
                    this._scrollMgr.destroy();
                }
                return _super.prototype.onBeforeRouteChange.call(this);
            };
            //! jQM event: "pagebeforeshow" に対応
            PageListView.prototype.onPageBeforeShow = function (event, data) {
                _super.prototype.onPageBeforeShow.call(this, event, data);
                this._scrollMgr.initialize(this.$page, this.getPageBaseHeight());
            };
            //! jQM event: "pagecontainershow" (旧:"pageshow") に対応
            PageListView.prototype.onPageShow = function (event, data) {
                _super.prototype.onPageShow.call(this, event, data);
                this._scrollMgr.setBaseHeight(this.getPageBaseHeight());
                if (this._needRebuild) {
                    this.rebuild();
                    this._needRebuild = false;
                }
            };
            //! jQM event: "pageremove" に対応
            PageListView.prototype.onPageRemove = function (event) {
                _super.prototype.onPageRemove.call(this, event);
                this.release();
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Profile 管理
            //! 初期化済みか判定
            PageListView.prototype.isInitialized = function () {
                return this._scrollMgr.isInitialized();
            };
            //! プロパティを指定して、ListItem を管理
            PageListView.prototype.addItem = function (height, initializer, info, insertTo) {
                this._addLine(new UI.LineProfile(this._scrollMgr, Math.floor(height), initializer, info), insertTo);
            };
            PageListView.prototype.removeItem = function (index, arg2, arg3) {
                this._scrollMgr.removeItem(index, arg2, arg3);
            };
            PageListView.prototype.getItemInfo = function (target) {
                return this._scrollMgr.getItemInfo(target);
            };
            //! アクティブページを更新
            PageListView.prototype.refresh = function () {
                this._scrollMgr.refresh();
            };
            //! 未アサインページを構築
            PageListView.prototype.update = function () {
                this._scrollMgr.update();
            };
            //! ページアサインを再構成
            PageListView.prototype.rebuild = function () {
                this._scrollMgr.rebuild();
            };
            //! 管轄データを破棄
            PageListView.prototype.release = function () {
                this._scrollMgr.release();
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Profile Backup / Restore
            //! 内部データをバックアップ
            PageListView.prototype.backup = function (key) {
                return this._scrollMgr.backup(key);
            };
            //! 内部データをリストア
            PageListView.prototype.restore = function (key, rebuild) {
                if (rebuild === void 0) { rebuild = true; }
                var retval = this._scrollMgr.restore(key, rebuild);
                if (retval && !rebuild) {
                    this.reserveRebuild();
                }
                return retval;
            };
            //! バックアップデータの有無
            PageListView.prototype.hasBackup = function (key) {
                return this._scrollMgr.hasBackup(key);
            };
            //! バックアップデータの破棄
            PageListView.prototype.clearBackup = function (key) {
                return this._scrollMgr.clearBackup(key);
            };
            Object.defineProperty(PageListView.prototype, "backupData", {
                //! バックアップデータにアクセス
                get: function () {
                    return this._scrollMgr.backupData;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Scroll
            //! スクロールイベントハンドラ設定/解除
            PageListView.prototype.setScrollHandler = function (handler, on) {
                this._scrollMgr.setScrollHandler(handler, on);
            };
            //! スクロール終了イベントハンドラ設定/解除
            PageListView.prototype.setScrollStopHandler = function (handler, on) {
                this._scrollMgr.setScrollStopHandler(handler, on);
            };
            //! スクロール位置を取得
            PageListView.prototype.getScrollPos = function () {
                return this._scrollMgr.getScrollPos();
            };
            //! スクロール位置の最大値を取得
            PageListView.prototype.getScrollPosMax = function () {
                return this._scrollMgr.getScrollPosMax();
            };
            //! スクロール位置を指定
            PageListView.prototype.scrollTo = function (pos, animate, time) {
                this._scrollMgr.scrollTo(pos, animate, time);
            };
            //! 指定された ListItemView の表示を保証
            PageListView.prototype.ensureVisible = function (index, options) {
                this._scrollMgr.ensureVisible(index, options);
            };
            Object.defineProperty(PageListView.prototype, "core", {
                ///////////////////////////////////////////////////////////////////////
                // Implements: IListView Properties
                //! core framework access
                get: function () {
                    return this._scrollMgr;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Internal I/F
            //! 登録 framework が使用する
            PageListView.prototype._addLine = function (_line, insertTo) {
                this._scrollMgr._addLine(_line, insertTo);
            };
            ///////////////////////////////////////////////////////////////////////
            // private method:
            //! ページの基準値を取得
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
                var _this = _super.call(this, url, id, options) || this;
                _this._expandManager = null;
                _this._expandManager = new UI.ExpandManager(_this);
                return _this;
            }
            ///////////////////////////////////////////////////////////////////////
            // Implements: IExpandableListView
            //! 新規 GroupProfile を作成
            PageExpandableListView.prototype.newGroup = function (id) {
                return this._expandManager.newGroup(id);
            };
            //! 登録済み Group を取得
            PageExpandableListView.prototype.getGroup = function (id) {
                return this._expandManager.getGroup(id);
            };
            //! 第1階層の Group 登録
            PageExpandableListView.prototype.registerTopGroup = function (topGroup) {
                this._expandManager.registerTopGroup(topGroup);
            };
            //! 第1階層の Group を取得
            PageExpandableListView.prototype.getTopGroups = function () {
                return this._expandManager.getTopGroups();
            };
            //! すべてのグループを展開 (1階層)
            PageExpandableListView.prototype.expandAll = function () {
                this._expandManager.expandAll();
            };
            //! すべてのグループを収束 (1階層)
            PageExpandableListView.prototype.collapseAll = function (delay) {
                this._expandManager.collapseAll(delay);
            };
            //! 展開中か判定
            PageExpandableListView.prototype.isExpanding = function () {
                return this._expandManager.isExpanding();
            };
            //! 収束中か判定
            PageExpandableListView.prototype.isCollapsing = function () {
                return this._expandManager.isCollapsing();
            };
            //! 開閉中か判定
            PageExpandableListView.prototype.isSwitching = function () {
                return this._expandManager.isSwitching();
            };
            Object.defineProperty(PageExpandableListView.prototype, "layoutKey", {
                //! layout key を取得
                get: function () {
                    return this._expandManager.layoutKey;
                },
                //! layout key を設定
                set: function (key) {
                    this._expandManager.layoutKey = key;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Override: PageListView
            //! データを破棄
            PageExpandableListView.prototype.release = function () {
                _super.prototype.release.call(this);
                this._expandManager.release();
            };
            //! 内部データをバックアップ
            PageExpandableListView.prototype.backup = function (key) {
                return this._expandManager.backup(key);
            };
            //! 内部データをリストア
            PageExpandableListView.prototype.restore = function (key, rebuild) {
                if (rebuild === void 0) { rebuild = true; }
                return this._expandManager.restore(key, rebuild);
            };
            return PageExpandableListView;
        }(UI.PageListView));
        UI.PageExpandableListView = PageExpandableListView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Extension;
        (function (Extension) {
            var Framework = CDP.Framework;
            // jQuery plugin
            $.fn.ripple = function (options) {
                var $el = $(this);
                if ($el.length <= 0) {
                    return $el;
                }
                return $el.on(Framework.Patch.s_vclickEvent, function (event) {
                    var surface = $(this);
                    // create surface if it doesn't exist
                    if (surface.find(".ui-ripple-ink").length === 0) {
                        surface.prepend("<div class='ui-ripple-ink'></div>");
                    }
                    var ink = surface.find(".ui-ripple-ink");
                    // stop the previous animation
                    ink.removeClass("ui-ripple-animate");
                    // ink size:
                    if (!ink.height() && !ink.width()) {
                        var d = Math.max(surface.outerWidth(), surface.outerHeight());
                        ink.css({ height: d, width: d });
                    }
                    var x = event.pageX - surface.offset().left - (ink.width() / 2);
                    var y = event.pageY - surface.offset().top - (ink.height() / 2);
                    var rippleColor = surface.data("ripple-color");
                    // animation end handler
                    var ANIMATION_END_EVENT = "animationend webkitAnimationEnd";
                    ink.on(ANIMATION_END_EVENT, function (ev) {
                        ink.off();
                        ink.removeClass("ui-ripple-animate");
                        ink = null;
                    });
                    // set the position and add class .animate
                    ink.css({
                        top: y + "px",
                        left: x + "px",
                        background: rippleColor
                    }).addClass("ui-ripple-animate");
                });
            };
            /**
             * Material Design Ripple 拡張
             *
             * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyDomExtension($ui, options) {
                var NO_RIPPLE_CLASS = [
                    ".ui-ripple-none",
                    ".ui-flipswitch-on",
                    ".ui-slider-handle",
                    ".ui-input-clear",
                ];
                var selector = ".ui-btn";
                if ($ui.hasClass("ui-page")) {
                    selector = ".ui-content .ui-btn"; // header は自動 ripple 化対象外
                }
                $ui.find(selector)
                    .filter(function (index, elem) {
                    var $elem = $(elem);
                    if ($elem.is(NO_RIPPLE_CLASS.join(","))) {
                        return false;
                    }
                    else {
                        return true;
                    }
                })
                    .addClass("ui-ripple");
                // ripplify
                //        $ui.find(".ui-ripple").ripple(options);
                $ui.find(".ui-ripple")
                    .each(function (index, elem) {
                    $(elem).ripple(options);
                });
                return $ui;
            }
            // 登録
            UI.ExtensionManager.registerDomExtension(applyDomExtension);
        })(Extension = UI.Extension || (UI.Extension = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Extension;
        (function (Extension) {
            var Template = CDP.Tools.Template;
            var _template;
            // jQuery plugin
            $.fn.spinner = function (options) {
                if ("string" === typeof options) {
                    return refresh($(this));
                }
                else {
                    return spinnerify($(this), options);
                }
            };
            function spinnerify($target, options) {
                if ($target.length <= 0) {
                    return $target;
                }
                if (!_template) {
                    _template = Template.getJST("\n                <script type=\"text/template\">\n                    <span class=\"ui-spinner-base\">\n                        <span class=\"ui-spinner-inner\">\n                            <span class=\"ui-spinner-inner-gap\" {{borderTop}}></span>\n                            <span class=\"ui-spinner-inner-left\">\n                                <span class=\"ui-spinner-inner-half-circle\" {{border}}></span>\n                            </span>\n                            <span class=\"ui-spinner-inner-right\">\n                                <span class=\"ui-spinner-inner-half-circle\" {{border}}></span>\n                            </span>\n                        </span>\n                    </span>\n                </script>\n            ");
                }
                var makeTemplateParam = function (clr) {
                    return {
                        borderTop: "style=border-top-color:" + clr + ";",
                        border: "style=border-color:" + clr + ";",
                    };
                };
                var color = $target.data("spinner-color");
                var param = null;
                if (color) {
                    $target.css({ "background-color": color });
                    param = makeTemplateParam(color);
                }
                $target.append(_template(param));
                return refresh($target);
            }
            // iOS 10.2+ SVG SMIL アニメーションが 2回目以降動かない問題の対策
            // data:image/svg+xml;<cache bust string>;base64,... とすることで data-url にも cache busting が有効になる
            function refresh($target) {
                var PREFIX = ["-webkit-", ""];
                var valid = function (prop) {
                    return (prop && "none" !== prop);
                };
                var dataUrl;
                for (var i = 0, n = PREFIX.length; i < n; i++) {
                    if (!valid(dataUrl)) {
                        dataUrl = $target.css(PREFIX[i] + "mask-image");
                        if (valid(dataUrl)) {
                            // iOS では url(data***); 内に '"' は入らない
                            var match = dataUrl.match(/(url\(data:image\/svg\+xml;)([\s\S]*)?(base64,[\s\S]*\))/);
                            if (match) {
                                dataUrl = match[1] + "bust=" + Date.now().toString(36) + ";" + match[3];
                            }
                            else {
                                dataUrl = null;
                            }
                        }
                    }
                    if (valid(dataUrl)) {
                        $target.css(PREFIX[i] + "mask-image", dataUrl);
                    }
                }
                return $target;
            }
            /**
             * Material Design Spinner 拡張
             *
             * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyDomExtension($ui, options) {
                $ui.find(".ui-spinner, .ui-icon-loading")
                    .each(function (index, elem) {
                    $(elem).spinner(options);
                });
                return $ui;
            }
            // 登録
            UI.ExtensionManager.registerDomExtension(applyDomExtension);
        })(Extension = UI.Extension || (UI.Extension = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Extension;
        (function (Extension) {
            /**
             * Text Input 用 Floating Label 拡張
             *
             * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyDomExtension($ui, options) {
                var update = function (elem, floating) {
                    var $elem = $(elem);
                    if (floating) {
                        $elem.addClass("ui-float-label-floating");
                    }
                    else {
                        $elem.removeClass("ui-float-label-floating");
                    }
                };
                var floatingify = function (elem) {
                    var id = $(elem).attr("for");
                    var $input = $ui.find("#" + id);
                    if ("search" === $input.jqmData("type")) {
                        $(elem).addClass("ui-float-label-has-icon");
                    }
                    update(elem, !!$input.val());
                    $input.on("keyup change input focus blur cut paste", function (event) {
                        update(elem, !!$(event.target).val());
                    });
                };
                $ui.find("label.ui-float-label, .ui-float-label label")
                    .each(function (index, elem) {
                    floatingify(elem);
                });
                return $ui;
            }
            // 登録
            UI.ExtensionManager.registerDomExtension(applyDomExtension);
        })(Extension = UI.Extension || (UI.Extension = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Extension;
        (function (Extension) {
            var Framework = CDP.Framework;
            /**
             * jQuery Mobile Flip Switch 拡張
             *
             * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyDomExtension($ui, options) {
                /*
                 * flipswitch に紐づく label は OS によって event 発行形式が異なるためフックして独自イベントで対応する.
                 * また flipswitch は内部で click を発行しているが、vclick に変更する.
                 */
                var _getAllSwitches = function () {
                    return $ui.find(".ui-flipswitch");
                };
                var _getInputFromSwitch = function ($switch) {
                    var $input = $switch.find("input");
                    if ($input.length) {
                        return $input;
                    }
                    var $select = $switch.find("select");
                    if ($select.length) {
                        return $select;
                    }
                    return null;
                };
                var _change = function ($input, to) {
                    if ($input) {
                        if ("INPUT" === $input[0].nodeName) {
                            $input.prop("checked", to).flipswitch("refresh");
                        }
                        else if ("SELECT" === $input[0].nodeName) {
                            $input.val(to ? "on" : "off").flipswitch("refresh");
                        }
                    }
                };
                var _getLabelsFromSwitch = function ($switch) {
                    var $input = _getInputFromSwitch($switch);
                    if ($input) {
                        var labels = $input[0].labels;
                        if (labels) {
                            return $(labels);
                        }
                    }
                    return $();
                };
                var _getSwitchFromLabel = function ($label) {
                    var name = $label.attr("for");
                    return _getAllSwitches().find("[name='" + name + "']");
                };
                _getAllSwitches()
                    .on("vclick _change_flipswich", function (event) {
                    var $switch = $(event.currentTarget);
                    var $target = $(event.target);
                    var $input = _getInputFromSwitch($switch);
                    var changeTo = !$switch.hasClass("ui-flipswitch-active");
                    if ($target.hasClass("ui-flipswitch-input")) {
                        _change($input, changeTo);
                    }
                    else if ($target.hasClass("ui-flipswitch-on")) {
                        if (Framework.Platform.Mobile && Framework.Patch.isSupportedVclick()) {
                            _change($input, changeTo);
                            event.preventDefault();
                        }
                    }
                })
                    .each(function (index, flipswitch) {
                    _getLabelsFromSwitch($(flipswitch))
                        .on("vclick", function (event) {
                        var $switch = _getSwitchFromLabel($(event.target));
                        if (!$switch.parent().hasClass("ui-state-disabled")) {
                            $switch.trigger("_change_flipswich");
                        }
                        event.preventDefault();
                    });
                });
                return $ui;
            }
            // 登録
            UI.ExtensionManager.registerDomExtension(applyDomExtension);
        })(Extension = UI.Extension || (UI.Extension = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Extension;
        (function (Extension) {
            /**
             * jQuery Mobile Slider 拡張
             *
             * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyDomExtension($ui, options) {
                $ui.find(".ui-slider-input")
                    .on("slidestop", function (event) {
                    var $handles = $(event.currentTarget)
                        .parent()
                        .find(".ui-slider-handle");
                    $handles.blur();
                });
                return $ui;
            }
            // 登録
            UI.ExtensionManager.registerDomExtension(applyDomExtension);
        })(Extension = UI.Extension || (UI.Extension = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Extension;
        (function (Extension) {
            //! iScroll.click patch
            var patch_IScroll_utils_click = function (event) {
                var target = event.target;
                var e = event;
                var ev;
                // [CDP modified]: set target.clientX.
                if (null == target.clientX || null == target.clientY) {
                    if (null != e.pageX && null != e.pageY) {
                        target.clientX = e.pageX;
                        target.clientY = e.pageY;
                    }
                    else if (e.changedTouches && e.changedTouches[0]) {
                        target.clientX = e.changedTouches[0].pageX;
                        target.clientY = e.changedTouches[0].pageY;
                    }
                }
                if (!(/(SELECT|INPUT|TEXTAREA)/i).test(target.tagName)) {
                    ev = document.createEvent("MouseEvents");
                    ev.initMouseEvent("click", true, true, e.view, 1, target.screenX, target.screenY, target.clientX, target.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, 0, null);
                    ev._constructed = true;
                    target.dispatchEvent(ev);
                }
            };
            var s_applied = false;
            /**
             * iScroll Patch 拡張
             *
             * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyPatch($ui, options) {
                if (!s_applied && UI.global.IScroll && UI.global.IScroll.utils) {
                    UI.global.IScroll.utils.click = patch_IScroll_utils_click;
                    s_applied = true;
                }
                return $ui;
            }
            // 登録
            UI.ExtensionManager.registerDomExtension(applyPatch);
        })(Extension = UI.Extension || (UI.Extension = {}));
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

return CDP.UI; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVUkvanFtL1RoZW1lLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uTWFuYWdlci50cyIsImNkcDovLy9DRFAvVUkvanFtL1RvYXN0LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nQ29tbW9ucy50cyIsImNkcDovLy9DRFAvVUkvanFtL0Jhc2VIZWFkZXJWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vQmFzZVBhZ2UudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9QYWdlVmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1RhYkhvc3RWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vVGFiVmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1BhZ2VMaXN0Vmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1BhZ2VFeHBhbmRhYmxlTGlzdFZpZXcudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vUmlwcGxlLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL1NwaW5uZXIudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vRmxvYXRMYWJlbC50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9GbGlwU3dpdGNoLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL1NsaWRlci50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9JU2Nyb2xsLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vSW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0E0T1o7QUE1T0QsV0FBVSxHQUFHO0lBQUMsTUFBRSxDQTRPZjtJQTVPYSxhQUFFO1FBRVosSUFBTyxNQUFNLEdBQVMsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNqQyxJQUFPLFNBQVMsR0FBTSxHQUFHLENBQUMsU0FBUyxDQUFDO1FB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RCxLQUFLO1lBQ0wsbUJBQWdCLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEQsQ0FBQyxFQWpEZ0IsU0FBUyxHQUFULFlBQVMsS0FBVCxZQUFTLFFBaUR6QjtJQUFELENBQUMsRUFqRGEsRUFBRSxHQUFGLE1BQUUsS0FBRixNQUFFLFFBaURmO0FBQUQsQ0FBQyxFQWpEUyxHQUFHLEtBQUgsR0FBRyxRQWlEWiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBDb25maWcgICAgICAgPSBDRFAuQ29uZmlnO1xyXG4gICAgaW1wb3J0IEZyYW1ld29yayAgICA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlRoZW1lXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUGxhdGZvcm1UcmFuc2l0aW9uXHJcbiAgICAgKiBAYnJpZWYg44OX44Op44OD44OI44OV44Kp44O844Og44GU44Go44GuIFRyYW5zaXRpb24g44KS5qC857SNXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUGxhdGZvcm1UcmFuc2l0aW9uIHtcclxuICAgICAgICBbcGxhdGZvcm06IHN0cmluZ106IHN0cmluZzsgICAgIC8vIGV4KSBpb3M6IFwic2xpZGVcIlxyXG4gICAgICAgIGZhbGxiYWNrOiBzdHJpbmc7ICAgICAgICAgICAgICAgLy8gZmFsbGJhY2sgdHJhbnNpdGlvbiBwcm9wXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFRyYW5zaXRpb25NYXBcclxuICAgICAqIEBicmllZiDjg4jjg6njg7Pjgrjjgrfjg6fjg7Pjg57jg4Pjg5dcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUcmFuc2l0aW9uTWFwIHtcclxuICAgICAgICBbdHJhbnNpdGlvbk5hbWU6IHN0cmluZ106IFBsYXRmb3JtVHJhbnNpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgVGhlbWVJbml0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIOODiOODqeODs+OCuOOCt+ODp+ODs+ODnuODg+ODl1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRoZW1lSW5pdE9wdGlvbnMge1xyXG4gICAgICAgIHBsYXRmb3JtPzogc3RyaW5nOyAgICAgICAgICAgICAgICAgIC8vIHBsYXRmb3JtIOOCkuaMh+Wumi4gZGVmYXVsdDpcImF1dG9cIlxyXG4gICAgICAgIHJlc2VydmVTY3JvbGxiYXJSZWdpb24/OiBib29sZWFuOyAgIC8vIFBDIOODh+ODkOODg+OCsOeSsOWig+OBp+OBr+OCueOCr+ODreODvOODq+ODkOODvOOCkuihqOekui4gZGVmYXVsdDogXCJ0cnVlXCJcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFRoZW1lXHJcbiAgICAgKiBAYnJpZWYgVUkgVGhlbWUg6Kit5a6a44KS6KGM44GG44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBUaGVtZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfcGxhdGZvcm1zOiBzdHJpbmdbXSA9IFtcImlvc1wiLCBcImFuZHJvaWRcIl07XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19wYWdlVHJhbnNpdGlvbk1hcDogVHJhbnNpdGlvbk1hcCA9IHtcclxuICAgICAgICAgICAgXCJwbGF0Zm9ybS1kZWZhdWx0XCI6IHtcclxuICAgICAgICAgICAgICAgIGlvczogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgYW5kcm9pZDogXCJmbG9hdHVwXCIsXHJcbiAgICAgICAgICAgICAgICBmYWxsYmFjazogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcInBsYXRmb3JtLWFsdGVybmF0aXZlXCI6IHtcclxuICAgICAgICAgICAgICAgIGlvczogXCJzbGlkZXVwXCIsXHJcbiAgICAgICAgICAgICAgICBhbmRyb2lkOiBcImZsb2F0dXBcIixcclxuICAgICAgICAgICAgICAgIGZhbGxiYWNrOiBcInNsaWRldXBcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfZGlhbG9nVHJhbnNpdGlvbk1hcDogVHJhbnNpdGlvbk1hcCA9IHtcclxuICAgICAgICAgICAgXCJwbGF0Zm9ybS1kZWZhdWx0XCI6IHtcclxuICAgICAgICAgICAgICAgIGlvczogXCJwb3B6b29tXCIsXHJcbiAgICAgICAgICAgICAgICBhbmRyb2lkOiBcImNyb3Nzem9vbVwiLFxyXG4gICAgICAgICAgICAgICAgZmFsbGJhY2s6IFwibm9uZVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RzOlxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGVtZSDjga7liJ3mnJ/ljJZcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIOOCquODl+OCt+ODp+ODs+aMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIHRydWU6IOaIkOWKnyAvIGZhbHNlOiDlpLHmlZdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGluaXRpYWxpemUob3B0aW9ucz86IFRoZW1lSW5pdE9wdGlvbnMpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICAgICAgcGxhdGZvcm06IFwiYXV0b1wiLFxyXG4gICAgICAgICAgICAgICAgcmVzZXJ2ZVNjcm9sbGJhclJlZ2lvbjogdHJ1ZSxcclxuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoXCJhdXRvXCIgPT09IG9wdC5wbGF0Zm9ybSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFRoZW1lLmRldGVjdFVJUGxhdGZvcm0ob3B0LnJlc2VydmVTY3JvbGxiYXJSZWdpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKFRoZW1lLnNldEN1cnJlbnRVSVBsYXRmb3JtKG9wdC5wbGF0Zm9ybSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0LnBsYXRmb3JtO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJzZXRDdXJyZW50VUlQbGF0Zm9ybSgpLCBmYWlsZWQuIHBsYXRmb3JtOiBcIiArIG9wdC5wbGF0Zm9ybSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOePvuWcqOaMh+WumuOBleOCjOOBpuOBhOOCiyBVSSBQbGF0Zm9ybSDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gZXgpIFwiaW9zXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldEN1cnJlbnRVSVBsYXRmb3JtKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRodG1zID0gJChcImh0bWxcIik7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gVGhlbWUuc19wbGF0Zm9ybXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGh0bXMuaGFzQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1cIiArIFRoZW1lLnNfcGxhdGZvcm1zW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBUaGVtZS5zX3BsYXRmb3Jtc1tpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVJIFBsYXRmb3JtIOOCkuioreWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSB0cnVlOiDmiJDlip8gLyBmYWxzZTog5aSx5pWXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXRDdXJyZW50VUlQbGF0Zm9ybShwbGF0Zm9ybTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHBsYXRmb3JtIHx8IFRoZW1lLnNfcGxhdGZvcm1zLmluZGV4T2YocGxhdGZvcm0pID49IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRodG1zID0gJChcImh0bWxcIik7XHJcbiAgICAgICAgICAgICAgICBUaGVtZS5zX3BsYXRmb3Jtcy5mb3JFYWNoKCh0YXJnZXQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAkaHRtcy5yZW1vdmVDbGFzcyhcInVpLXBsYXRmb3JtLVwiICsgdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBsYXRmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0bXMuYWRkQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1cIiArIHBsYXRmb3JtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnj77lnKjjga4gUGxhdGZvcm0g44KS5Yik5a6a44GX5pyA6YGp44GqIHBsYXRmb3JtIOOCkuiHquWLleaxuuWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHJlc2VydmVTY3JvbGxiYXJSZWdpb24gUEMg44OH44OQ44OD44Kw55Kw5aKD44Gn44Gv44K544Kv44Ot44O844Or44OQ44O844KS6KGo56S6LiBkZWZhdWx0OiB0cnVlXHJcbiAgICAgICAgICogQHJldHVybnMgZXgpIFwiaW9zXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRldGVjdFVJUGxhdGZvcm0ocmVzZXJ2ZVNjcm9sbGJhclJlZ2lvbjogYm9vbGVhbiA9IHRydWUpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcGxhdGZvcm0gPSBcIlwiO1xyXG4gICAgICAgICAgICAvLyBwbGF0Zm9ybSDjga7oqK3lrppcclxuICAgICAgICAgICAgaWYgKEZyYW1ld29yay5QbGF0Zm9ybS5pT1MpIHtcclxuICAgICAgICAgICAgICAgICQoXCJodG1sXCIpLmFkZENsYXNzKFwidWktcGxhdGZvcm0taW9zXCIpO1xyXG4gICAgICAgICAgICAgICAgcGxhdGZvcm0gPSBcImlvc1wiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcImh0bWxcIikuYWRkQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1hbmRyb2lkXCIpO1xyXG4gICAgICAgICAgICAgICAgcGxhdGZvcm0gPSBcImFuZHJvaWRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBQQyDjg4fjg5Djg4PjgrDnkrDlooPjgafjga/jgrnjgq/jg63jg7zjg6vjg5Djg7zjgpLooajnpLpcclxuICAgICAgICAgICAgaWYgKENvbmZpZy5ERUJVRyAmJiByZXNlcnZlU2Nyb2xsYmFyUmVnaW9uICYmICFGcmFtZXdvcmsuUGxhdGZvcm0uTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJvdmVyZmxvdy15XCIsIFwic2Nyb2xsXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwbGF0Zm9ybTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBsYXRmb3JtIOOCkumFjeWIl+OBp+eZu+mMslxyXG4gICAgICAgICAqIOS4iuabuOOBjeOBleOCjOOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmdbXX0gcGxhdGZvcm1zIFtpbl0gT1MgZXgpOiBbXCJpb3NcIiwgXCJhbmRyb2lkXCJdXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWdpc3RlclVJUGxhdGZvcm1zKHBsYXRmb3Jtczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHBsYXRmb3Jtcykge1xyXG4gICAgICAgICAgICAgICAgVGhlbWUuc19wbGF0Zm9ybXMgPSBwbGF0Zm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBhZ2UgdHJhbnNpdGlvbiDjgpLnmbvpjLJcclxuICAgICAgICAgKiDkuIrmm7jjgY3jgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7VHJhbnNpdGlvbk1hcH0gbWFwIFtpbl0gVHJhbnNpdGlvbk1hcCDjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyUGFnZVRyYW5zaXRpb25NYXAobWFwOiBUcmFuc2l0aW9uTWFwKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChtYXApIHtcclxuICAgICAgICAgICAgICAgIFRoZW1lLnNfcGFnZVRyYW5zaXRpb25NYXAgPSBtYXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRpYWxvZyB0cmFuc2l0aW9uIOOCkueZu+mMslxyXG4gICAgICAgICAqIOS4iuabuOOBjeOBleOCjOOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtUcmFuc2l0aW9uTWFwfSBtYXAgW2luXSBUcmFuc2l0aW9uTWFwIOOCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJEaWFsb2dUcmFuc2l0aW9uTWFwKG1hcDogVHJhbnNpdGlvbk1hcCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICBUaGVtZS5zX2RpYWxvZ1RyYW5zaXRpb25NYXAgPSBtYXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBhZ2UgdHJhbnNpdGlvbiDjgpLlj5blvpdcclxuICAgICAgICAgKiBUcmFuc2l0aW9uTWFwIOOBq+OCouOCteOCpOODs+OBleOCjOOBpuOBhOOCi+OCguOBruOBp+OBguOCjOOBsOWkieaPm1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nW119IFwic2xpZGVcIlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcXVlcnlQYWdlVHJhbnNpdGlvbihvcmlnaW5hbDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgY29udmVydCA9IFRoZW1lLnNfcGFnZVRyYW5zaXRpb25NYXBbb3JpZ2luYWxdO1xyXG4gICAgICAgICAgICBpZiAoY29udmVydCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRbVGhlbWUuZ2V0Q3VycmVudFVJUGxhdGZvcm0oKV0gfHwgY29udmVydC5mYWxsYmFjaztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZGlhbG9nIHRyYW5zaXRpb24g44KS5Y+W5b6XXHJcbiAgICAgICAgICogVHJhbnNpdGlvbk1hcCDjgavjgqLjgrXjgqTjg7PjgZXjgozjgabjgYTjgovjgoLjga7jgafjgYLjgozjgbDlpInmj5tcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ1tdfSBcInNsaWRlXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHF1ZXJ5RGlhbG9nVHJhbnNpdGlvbihvcmlnaW5hbDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgY29udmVydCA9IFRoZW1lLnNfZGlhbG9nVHJhbnNpdGlvbk1hcFtvcmlnaW5hbF07XHJcbiAgICAgICAgICAgIGlmIChjb252ZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udmVydFtUaGVtZS5nZXRDdXJyZW50VUlQbGF0Zm9ybSgpXSB8fCBjb252ZXJ0LmZhbGxiYWNrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLy8ganF1ZXkubW9iaWxlLmNoYW5nZVBhZ2UoKSDjga4gSG9vay5cclxuICAgIGZ1bmN0aW9uIGFwcGx5Q3VzdG9tQ2hhbmdlUGFnZSgpIHtcclxuICAgICAgICBjb25zdCBqcW1DaGFuZ2VQYWdlOiAodG86IGFueSwgb3B0aW9ucz86IENoYW5nZVBhZ2VPcHRpb25zKSA9PiB2b2lkID0gXy5iaW5kKCQubW9iaWxlLmNoYW5nZVBhZ2UsICQubW9iaWxlKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3VzdG9tQ2hhbmdlUGFnZSh0bzogYW55LCBvcHRpb25zPzogQ2hhbmdlUGFnZU9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcodG8pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRyYW5zaXRpb24gPSBUaGVtZS5xdWVyeVBhZ2VUcmFuc2l0aW9uKG9wdGlvbnMudHJhbnNpdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAganFtQ2hhbmdlUGFnZSh0bywgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLm1vYmlsZS5jaGFuZ2VQYWdlID0gY3VzdG9tQ2hhbmdlUGFnZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBmcmFtZXdvcmsg5Yid5pyf5YyW5b6M44Gr6YGp55SoXHJcbiAgICBGcmFtZXdvcmsud2FpdEZvckluaXRpYWxpemUoKVxyXG4gICAgICAgIC5kb25lKCgpID0+IHtcclxuICAgICAgICAgICAgYXBwbHlDdXN0b21DaGFuZ2VQYWdlKCk7XHJcbiAgICAgICAgfSk7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIERvbUV4dGVuc2lvbk9wdGlvbnNcclxuICAgICAqIEBicmVpZiBEb21FeHRlbnNpb24g44Gr5rih44GZ44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRG9tRXh0ZW5zaW9uT3B0aW9ucyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgRG9tRXh0ZW5zaW9uXHJcbiAgICAgKiBAYnJpZWYgRE9NIOaLoeW8temWouaVsFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdHlwZSBEb21FeHRlbnNpb24gPSAoJHRhcmdldDogSlF1ZXJ5LCBEb21FeHRlbnNpb25PcHRpb25zPzogT2JqZWN0KSA9PiBKUXVlcnk7XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBFeHRlbnNpb25NYW5hZ2VyXHJcbiAgICAgKiBAYnJpZWYg5ouh5by15qmf6IO944KS566h55CG44GZ44KL44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBFeHRlbnNpb25NYW5hZ2VyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19kb21FeHRlbnNpb25zOiBEb21FeHRlbnNpb25bXSA9IFtdO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBET00g5ouh5by16Zai5pWw44Gu55m76YyyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbn0gZnVuYyBbaW5dIERPTSDmi6HlvLXplqLmlbBcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGZ1bmM6IERvbUV4dGVuc2lvbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNfZG9tRXh0ZW5zaW9ucy5wdXNoKGZ1bmMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRE9NIOaLoeW8teOCkumBqeeUqFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9ICR1aSAgICAgICBbaW5dIOaLoeW8teWvvuixoeOBriBET01cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBhcHBseURvbUV4dGVuc2lvbigkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zX2RvbUV4dGVuc2lvbnMuZm9yRWFjaCgoZnVuYzogRG9tRXh0ZW5zaW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmdW5jKCR1aSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuVG9hc3RdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFRvYXN0XHJcbiAgICAgKiBAYnJpZWYgQW5kcm9pZCBTREsg44GuIFRvYXN0IOOCr+ODqeOCueOBruOCiOOBhuOBq+iHquWLlea2iOa7heOBmeOCi+ODoeODg+OCu+ODvOOCuOWHuuWKm+ODpuODvOODhuOCo+ODquODhuOCo1xyXG4gICAgICogICAgICAgIOWFpeOCjOWtkOOBrumWouS/guOCkuWun+ePvuOBmeOCi+OBn+OCgeOBqyBtb2R1bGUg44Gn5a6f6KOFXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBtb2R1bGUgVG9hc3Qge1xyXG5cclxuICAgICAgICAvLyDooajnpLrmmYLplpPjga7lrprnvqlcclxuICAgICAgICBleHBvcnQgbGV0IExFTkdUSF9TSE9SVCA9IDE1MDA7ICAgLy8hPCDnn63jgYQ6MTUwMCBtc2VjXHJcbiAgICAgICAgZXhwb3J0IGxldCBMRU5HVEhfTE9ORyAgPSA0MDAwOyAgIC8vITwg6ZW344GEOjQwMDAgbXNlY1xyXG5cclxuICAgICAgICAvLyEgQGVudW0g44Kq44OV44K744OD44OI44Gu5Z+65rqWXHJcbiAgICAgICAgZXhwb3J0IGVudW0gT2Zmc2V0WCB7XHJcbiAgICAgICAgICAgIExFRlQgICAgPSAweDAwMDEsXHJcbiAgICAgICAgICAgIFJJR0hUICAgPSAweDAwMDIsXHJcbiAgICAgICAgICAgIENFTlRFUiAgPSAweDAwMDQsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgQGVudW0g44Kq44OV44K744OD44OI44Gu5Z+65rqWXHJcbiAgICAgICAgZXhwb3J0IGVudW0gT2Zmc2V0WSB7XHJcbiAgICAgICAgICAgIFRPUCAgICAgPSAweDAwMTAsXHJcbiAgICAgICAgICAgIEJPVFRPTSAgPSAweDAwMjAsXHJcbiAgICAgICAgICAgIENFTlRFUiAgPSAweDAwNDAsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAaW50ZXJmYWNlIFN0eWxlQnVpbGRlclxyXG4gICAgICAgICAqIEBicmllZiAgICAg44K544K/44Kk44Or5aSJ5pu05pmC44Gr5L2/55So44GZ44KL44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgICAgICogICAgICAgICAgICBjc3Mg44Gr44K544K/44Kk44Or44KS6YCD44GM44GZ5aC05ZCI44CB54us6Ieq44GuIGNsYXNzIOOCkuioreWumuOBl+OAgWdldFN0eWxlIOOBryBudWxsIOOCkui/lOOBmeOBk+OBqOOAglxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU3R5bGVCdWlsZGVyIHtcclxuICAgICAgICAgICAgLy8hIGNsYXNzIGF0dHJpYnV0ZSDjgavoqK3lrprjgZnjgovmloflrZfliJfjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0Q2xhc3MoKTogc3RyaW5nO1xyXG4gICAgICAgICAgICAvLyEgc3R5bGUgYXR0cmlidXRlIOOBq+ioreWumuOBmeOCiyBKU09OIOOCquODluOCuOOCp+OCr+ODiOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRTdHlsZSgpOiBhbnk7XHJcbiAgICAgICAgICAgIC8vISDjgqrjg5Xjgrvjg4Pjg4jjga7ln7rmupbkvY3nva7jgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0T2Zmc2V0UG9pbnQoKTogbnVtYmVyO1xyXG4gICAgICAgICAgICAvLyEgWCDluqfmqJnjga7jgqrjg5Xjgrvjg4Pjg4jlgKTjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0T2Zmc2V0WCgpOiBudW1iZXI7XHJcbiAgICAgICAgICAgIC8vISBZIOW6p+aomeOBruOCquODleOCu+ODg+ODiOWApOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRZKCk6IG51bWJlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBjbGFzcyBTdHlsZUJ1aWxkZXJEZWZhdWx0XHJcbiAgICAgICAgICogQGJyaWVmIOOCueOCv+OCpOODq+WkieabtOaZguOBq+S9v+eUqOOBmeOCi+aXouWumuOBruani+mAoOS9k+OCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTdHlsZUJ1aWxkZXJEZWZhdWx0IGltcGxlbWVudHMgU3R5bGVCdWlsZGVyIHtcclxuXHJcbiAgICAgICAgICAgIC8vISBjbGFzcyBhdHRyaWJ1dGUg44Gr6Kit5a6a44GZ44KL5paH5a2X5YiX44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldENsYXNzKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ1aS1sb2FkZXIgdWktb3ZlcmxheS1zaGFkb3cgdWktY29ybmVyLWFsbFwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyEgc3R5bGUgYXR0cmlidXRlIOOBq+ioreWumuOBmeOCiyBKU09OIOOCquODluOCuOOCp+OCr+ODiOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRTdHlsZSgpOiBhbnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYWRkaW5nXCI6ICAgICAgICAgIFwiN3B4IDI1cHggN3B4IDI1cHhcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRpc3BsYXlcIjogICAgICAgICAgXCJibG9ja1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiMxZDFkMWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiAgICAgXCIjMWIxYjFiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiAgICAgICAgICAgIFwiI2ZmZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dC1zaGFkb3dcIjogICAgICBcIjAgMXB4IDAgIzExMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZm9udC13ZWlnaHRcIjogICAgICBcImJvbGRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9wYWNpdHlcIjogICAgICAgICAgMC44LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdHlsZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8hIOOCquODleOCu+ODg+ODiOOBruWfuua6luS9jee9ruOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRQb2ludCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9mZnNldFguQ0VOVEVSIHwgT2Zmc2V0WS5CT1RUT007XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vISBYIOW6p+aomeOBruOCquODleOCu+ODg+ODiOWApOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRYKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8hIFkg5bqn5qiZ44Gu44Kq44OV44K744OD44OI5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFkoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtNzU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRvYXN0IOihqOekulxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2UgIFtpbl0g44Oh44OD44K744O844K4XHJcbiAgICAgICAgICogQHBhcmFtIGR1cmF0aW9uIFtpbl0g6KGo56S65pmC6ZaT44KS6Kit5a6aIChtc2VjKSBkZWZhdWx0OiBMRU5HVEhfU0hPUlRcclxuICAgICAgICAgKiBAcGFyYW0gc3R5bGUgICAgW2luXSDjgrnjgr/jgqTjg6vlpInmm7TjgZnjgovloLTlkIjjgavjga/mtL7nlJ/jgq/jg6njgrnjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gc2hvdyhtZXNzYWdlOiBzdHJpbmcsIGR1cmF0aW9uOiBudW1iZXIgPSBUb2FzdC5MRU5HVEhfU0hPUlQsIHN0eWxlPzogU3R5bGVCdWlsZGVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRtb2JpbGUgPSAkLm1vYmlsZTtcclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IHN0eWxlIHx8IG5ldyBTdHlsZUJ1aWxkZXJEZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNldENTUyA9IGluZm8uZ2V0U3R5bGUoKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIOaUueihjOOCs+ODvOODieOBryA8YnIvPiDjgavnva7mj5vjgZnjgotcclxuICAgICAgICAgICAgY29uc3QgbXNnID0gbWVzc2FnZS5yZXBsYWNlKC9cXG4vZywgXCI8YnIvPlwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOODoeODg+OCu+ODvOOCuCBlbGVtZW50IOOBruWLleeahOeUn+aIkFxyXG4gICAgICAgICAgICBjb25zdCBodG1sID0gXCI8ZGl2PlwiICsgbXNnICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICAgICAgY29uc3QgYm94ID0gJChodG1sKS5hZGRDbGFzcyhpbmZvLmdldENsYXNzKCkpO1xyXG4gICAgICAgICAgICBpZiAoc2V0Q1NTKSB7XHJcbiAgICAgICAgICAgICAgICBib3guY3NzKGluZm8uZ2V0U3R5bGUoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOiHquWLleaUueihjOOBleOCjOOBpuOCguOCiOOBhOOCiOOBhuOBq+OAgeWfuueCueOCkuioreWumuOBl+OBpuOBi+OCiei/veWKoFxyXG4gICAgICAgICAgICBib3guY3NzKHtcclxuICAgICAgICAgICAgICAgIFwidG9wXCI6IDAsXHJcbiAgICAgICAgICAgICAgICBcImxlZnRcIjogMCxcclxuICAgICAgICAgICAgfSkuYXBwZW5kVG8oJG1vYmlsZS5wYWdlQ29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOmFjee9ruS9jee9ruOBruaxuuWumlxyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXRQb2ludCA9IGluZm8uZ2V0T2Zmc2V0UG9pbnQoKTtcclxuICAgICAgICAgICAgY29uc3QgJHdpbmRvdyA9ICQod2luZG93KTtcclxuICAgICAgICAgICAgbGV0IHBvc1gsIHBvc1k7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBib3hfd2lkdGggPSBib3gud2lkdGgoKSArIHBhcnNlSW50KGJveC5jc3MoXCJwYWRkaW5nLWxlZnRcIiksIDEwKSArIHBhcnNlSW50KGJveC5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIpLCAxMCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJveF9oZWlnaHQgPSBib3guaGVpZ2h0KCkgKyBwYXJzZUludChib3guY3NzKFwicGFkZGluZy10b3BcIiksIDEwKSArIHBhcnNlSW50KGJveC5jc3MoXCJwYWRkaW5nLWJvdHRvbVwiKSwgMTApO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChvZmZzZXRQb2ludCAmIDB4MDAwRikge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRYLkxFRlQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWCA9IDAgKyBpbmZvLmdldE9mZnNldFgoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgT2Zmc2V0WC5SSUdIVDpcclxuICAgICAgICAgICAgICAgICAgICBwb3NYID0gJHdpbmRvdy53aWR0aCgpIC0gYm94X3dpZHRoICsgaW5mby5nZXRPZmZzZXRYKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFguQ0VOVEVSOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSAoJHdpbmRvdy53aWR0aCgpIC8gMikgLSAoYm94X3dpZHRoIC8gMikgKyBpbmZvLmdldE9mZnNldFgoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwid2Fybi4gdW5rbm93biBvZmZzZXRQb2ludDpcIiArIChvZmZzZXRQb2ludCAmIDB4MDAwRikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSAoJHdpbmRvdy53aWR0aCgpIC8gMikgLSAoYm94X3dpZHRoIC8gMikgKyBpbmZvLmdldE9mZnNldFgoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChvZmZzZXRQb2ludCAmIDB4MDBGMCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRZLlRPUDpcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gMCArIGluZm8uZ2V0T2Zmc2V0WSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRZLkJPVFRPTTpcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gJHdpbmRvdy5oZWlnaHQoKSAtIGJveF9oZWlnaHQgKyBpbmZvLmdldE9mZnNldFkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgT2Zmc2V0WS5DRU5URVI6XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWSA9ICgkd2luZG93LmhlaWdodCgpIC8gMikgLSAoYm94X2hlaWdodCAvIDIpICsgaW5mby5nZXRPZmZzZXRZKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcIndhcm4uIHVua25vd24gb2Zmc2V0UG9pbnQ6XCIgKyAob2Zmc2V0UG9pbnQgJiAweDAwRjApKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gKCR3aW5kb3cuaGVpZ2h0KCkgLyAyKSAtIChib3hfaGVpZ2h0IC8gMikgKyBpbmZvLmdldE9mZnNldFkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g6KGo56S6XHJcbiAgICAgICAgICAgIGJveC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgXCJ0b3BcIjogcG9zWSxcclxuICAgICAgICAgICAgICAgIFwibGVmdFwiOiBwb3NYLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZGVsYXkoZHVyYXRpb24pXHJcbiAgICAgICAgICAgIC5mYWRlT3V0KDQwMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBQcm9taXNlICAgICAgPSBDRFAuUHJvbWlzZTtcclxuICAgIGltcG9ydCBGcmFtZXdvcmsgICAgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5EaWFsb2ddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSC9XIEJhY2sgS2V5IEhvb2sg6Zai5pWwXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB0eXBlIERpYWxvZ0JhY2tLZXlIYW5kbGVyID0gKGV2ZW50PzogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBEaWFsb2dPcHRpb25zXHJcbiAgICAgKiAgICAgICAgICAgIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs+OCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERpYWxvZ09wdGlvbnMgZXh0ZW5kcyBQb3B1cE9wdGlvbnMge1xyXG4gICAgICAgIHNyYz86IHN0cmluZzsgICAgICAgICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSB0ZW1wbGF0ZSDjg5XjgqHjgqTjg6vjga7jg5HjgrkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgICAgICB0aXRsZT86IHN0cmluZzsgICAgICAgICAgICAgICAgIC8vITwge1N0cmluZ30g44OA44Kk44Ki44Ot44Kw44K/44Kk44OI44OrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgICAgICBtZXNzYWdlPzogc3RyaW5nOyAgICAgICAgICAgICAgIC8vITwge1N0cmluZ30g44Oh44Kk44Oz44Oh44OD44K744O844K4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxyXG4gICAgICAgIGlkUG9zaXRpdmU/OiBzdHJpbmc7ICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSBQb3NpdGl2ZSDjg5zjgr/jg7Pjga5JRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcImRsZy1idG4tcG9zaXRpdmVcIlxyXG4gICAgICAgIGlkTmVnYXRpdmU/OiBzdHJpbmc7ICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSBOYWdhdGl2ZSDjg5zjgr/jg7Pjga5JRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcImRsZy1idG4tbmVnYXRpdmVcIlxyXG4gICAgICAgIGV2ZW50Pzogc3RyaW5nOyAgICAgICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSBEaWFsb2cg44Kv44Op44K544GM566h55CG44GZ44KL44Kk44OZ44Oz44OIICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwidmNsaWNrXCJcclxuICAgICAgICBkZWZhdWx0QXV0b0Nsb3NlPzogYm9vbGVhbjsgICAgIC8vITwge0Jvb2xlYW59IGRhdGEtYXV0by1jbG9zZSDjgYzmjIflrprjgZXjgozjgabjgYTjgarjgYTloLTlkIjjga7ml6LlrprlgKQgICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgIGZvcmNlT3ZlcndyaXRlQWZ0ZXJDbG9zZT86IGJvb2xlYW47IC8vITwge0Jvb2xlYW59IGFmdGVyY2xvc2Ug44Kq44OX44K344On44Oz44KS5by35Yi25LiK5pu444GN44GZ44KL44Gf44KB44Gu6Kit5a6aICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgbGFiZWxQb3NpdGl2ZT86IHN0cmluZzsgICAgICAgICAvLyE8IHtTdHJpbmd9IFBvc2l0aXZlIOODnOOCv+ODs+ODqeODmeODqyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJPS1wiXHJcbiAgICAgICAgbGFiZWxOZWdhdGl2ZT86IHN0cmluZzsgICAgICAgICAvLyE8IHtTdHJpbmd9IE5lZ2F0aXZlIOODnOOCv+ODs+ODqeODmeODqyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJDYW5jZWxcIlxyXG4gICAgICAgIGJhY2tLZXk/OiBcImNsb3NlXCIgfCBcImRlbnlcIiB8IERpYWxvZ0JhY2tLZXlIYW5kbGVyOyAgLy8hPCBIL1cgYmFja0tleSDjga7mjK/jgovoiJ7jgYQgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiY2xvc2VcIlxyXG4gICAgICAgIHNjcm9sbEV2ZW50PzogXCJkZW55XCIgfCBcImFsbG93XCIgfCBcImFkanVzdFwiOyAgIC8vITwge1N0cmluZ30gc2Nyb2xs44Gu5oqR5q2i5pa55byPICAo4oC7IGFkanVzdCDjga/oqabpqJPnmoQpICAgICBkZWZhdWx0OiBcImRlbnlcIlxyXG4gICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zOyAgIC8vITwgRE9N5ouh5by144Kq44OX44K344On44OzLiBudWxsfHVuZGVmaW5lZCDjgafmi6HlvLXjgZfjgarjgYQgICAgICBkZWZhdWx0OiB7fVxyXG4gICAgICAgIFt4OiBzdHJpbmddOiBhbnk7ICAgICAgICAgICAgICAgLy8hPCBhbnkgZGlhbG9nIHRlbXBsYXRlIHBhcmFtZXRlcnMuXHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBEaWFsb2dcclxuICAgICAqIEBicmllZiDmsY7nlKjjg4DjgqTjgqLjg63jgrDjgq/jg6njgrlcclxuICAgICAqICAgICAgICBqUU0g44GuIHBvcHVwIHdpZGdldCDjgavjgojjgaPjgablrp/oo4VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIERpYWxvZyB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3RlbXBsYXRlOiBUb29scy5KU1QgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX3NldHRpbmdzOiBEaWFsb2dPcHRpb25zID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF8kZGlhbG9nOiBKUXVlcnkgPSBudWxsO1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX2FjdGl2ZURpYWxvZzogRGlhbG9nID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX29sZEJhY2tLZXlIYW5kbGVyOiAoZXZlbnQ/OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfZGVmYXVsdE9wdGlvbnM6IERpYWxvZ09wdGlvbnMgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGlkICAgICAge1N0cmluZ30gICAgICAgIFtpbl0g44OA44Kk44Ki44Ot44KwIERPTSBJRCDjgpLmjIflrpogZXgpICNkaWFsb2ctaG9nZVxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtEaWFsb2dPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIC8vIERpYWxvZyDlhbHpgJroqK3lrprjga7liJ3mnJ/ljJZcclxuICAgICAgICAgICAgRGlhbG9nLmluaXRDb21tb25Db25kaXRpb24oKTtcclxuICAgICAgICAgICAgLy8g6Kit5a6a44KS5pu05pawXHJcbiAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQoe30sIERpYWxvZy5zX2RlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgLy8g44OA44Kk44Ki44Ot44Kw44OG44Oz44OX44Os44O844OI44KS5L2c5oiQXHJcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gVG9vbHMuVGVtcGxhdGUuZ2V0SlNUKGlkLCB0aGlzLl9zZXR0aW5ncy5zcmMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDooajnpLpcclxuICAgICAgICAgKiDooajnpLrjgpLjgZfjgablp4vjgoHjgaYgRE9NIOOBjOacieWKueOBq+OBquOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0RpYWxvZ09wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzIChzcmMg44Gv54Sh6KaW44GV44KM44KLKVxyXG4gICAgICAgICAqIEByZXR1cm4g44OA44Kk44Ki44Ot44Kw44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc2hvdyhvcHRpb25zPzogRGlhbG9nT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xyXG4gICAgICAgICAgICBjb25zdCAkYm9keSA9ICQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICBjb25zdCAkcGFnZSA9ICg8YW55PiRib2R5KS5wYWdlY29udGFpbmVyKFwiZ2V0QWN0aXZlUGFnZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9mY0hpZGRlbiA9IHtcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3dcIjogICAgIFwiaGlkZGVuXCIsXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXhcIjogICBcImhpZGRlblwiLFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvdy15XCI6ICAgXCJoaWRkZW5cIixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3Qgb2ZjQm9keSA9IHsgLy8gYm9keSBvdmVyZmxvdyBjb250ZXh0XHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93XCI6ICAgICAkYm9keS5jc3MoXCJvdmVyZmxvd1wiKSxcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteFwiOiAgICRib2R5LmNzcyhcIm92ZXJmbG93LXhcIiksXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXlcIjogICAkYm9keS5jc3MoXCJvdmVyZmxvdy15XCIpLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRTY3JvbGxQb3MgPSAkYm9keS5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgY29uc3Qgb2ZjUGFnZSA9IHsgLy8gcGFnZSBvdmVyZmxvdyBjb250ZXh0XHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93XCI6ICAgICAkcGFnZS5jc3MoXCJvdmVyZmxvd1wiKSxcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteFwiOiAgICRwYWdlLmNzcyhcIm92ZXJmbG93LXhcIiksXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXlcIjogICAkcGFnZS5jc3MoXCJvdmVyZmxvdy15XCIpLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsRXZlbnQgPSBcInNjcm9sbCB0b3VjaG1vdmUgbW91c2Vtb3ZlIE1TUG9pbnRlck1vdmVcIjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbEhhbmRlciA9IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJkZW55XCIgPT09IHRoaXMuX3NldHRpbmdzLnNjcm9sbEV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJhZGp1c3RcIiA9PT0gdGhpcy5fc2V0dGluZ3Muc2Nyb2xsRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkYm9keS5zY3JvbGxUb3AocGFyZW50U2Nyb2xsUG9zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIG9wdGlvbiDjgYzmjIflrprjgZXjgozjgabjgYTjgZ/loLTlkIjmm7TmlrBcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gb3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5fc2V0dGluZ3MsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBhZnRlcmNsb3NlIOWHpueQhuOBryBEaWFsb2cg44Gu56C05qOE5Yem55CG44KS5a6f6KOF44GZ44KL44Gf44KB5Z+65pys55qE44Gr6Kit5a6a56aB5q2iICjlvLfliLbkuIrmm7jjgY3jg6Ljg7zjg4njgpLoqK3lrprkvb/nlKjlj68pXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5hZnRlcmNsb3NlICYmICF0aGlzLl9zZXR0aW5ncy5mb3JjZU92ZXJ3cml0ZUFmdGVyQ2xvc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImNhbm5vdCBhY2NlcHQgJ2FmdGVyY2xvc2UnIG9wdGlvbi4gcGxlYXNlIGluc3RlYWQgdXNpbmcgJ3BvcHVwYWZ0ZXJjbG9zZScgZXZlbnQuXCIpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3NldHRpbmdzLmFmdGVyY2xvc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHRpdGxlIOOBruacieeEoVxyXG4gICAgICAgICAgICAoPGFueT50aGlzLl9zZXR0aW5ncykuX3RpdGxlU3RhdGUgPSB0aGlzLl9zZXR0aW5ncy50aXRsZSA/IFwidWktaGFzLXRpdGxlXCIgOiBcInVpLW5vLXRpdGxlXCI7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB0ZW1wbGF0ZSDjgYvjgokgalF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiOOCkuS9nOaIkOOBl+OAgVxyXG4gICAgICAgICAgICAgKiA8Ym9keT4g55u05LiL44Gr6L+95YqgLlxyXG4gICAgICAgICAgICAgKiAkcGFnZSDjgafjga8gQmFja2JvbmUgZXZlbnQg44KS5Y+X44GR44KJ44KM44Gq44GE44GT44Go44Gr5rOo5oSPXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLl8kZGlhbG9nID0gJCh0aGlzLl90ZW1wbGF0ZSh0aGlzLl9zZXR0aW5ncykpO1xyXG4gICAgICAgICAgICB0aGlzLl8kZGlhbG9nLmxvY2FsaXplKCk7XHJcbiAgICAgICAgICAgICRib2R5LmFwcGVuZCh0aGlzLl8kZGlhbG9nKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRoZW1lIOOCkuino+axulxyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVUaGVtZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fJGRpYWxvZ1xyXG4gICAgICAgICAgICAgICAgLm9uKFwicG9wdXBjcmVhdGVcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDjgrnjgq/jg63jg7zjg6vjgpLmipHmraJcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJhbGxvd1wiICE9PSB0aGlzLl9zZXR0aW5ncy5zY3JvbGxFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oc2Nyb2xsRXZlbnQsIHNjcm9sbEhhbmRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICRib2R5LmNzcyhvZmNIaWRkZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICRwYWdlLmNzcyhvZmNIaWRkZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIERpYWxvZy5yZWdpc3Rlcih0aGlzKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZW5oYW5jZVdpdGhpbigpO1xyXG5cclxuICAgICAgICAgICAgLy8gRE9NIOaLoeW8tVxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9zZXR0aW5ncy5kb21FeHRlbnNpb25PcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBFeHRlbnNpb25NYW5hZ2VyLmFwcGx5RG9tRXh0ZW5zaW9uKHRoaXMuXyRkaWFsb2csIHRoaXMuX3NldHRpbmdzLmRvbUV4dGVuc2lvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uQmVmb3JlU2hvdygpXHJcbiAgICAgICAgICAgICAgICAuZG9uZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6KGo56S6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAucG9wdXAoJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG86IFwid2luZG93XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZnRlcmNsb3NlOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCwgdWk6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOOCueOCr+ODreODvOODq+eKtuaFi+OCkuaIu+OBmVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwYWdlLmNzcyhvZmNQYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYm9keS5jc3Mob2ZjQm9keSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFwiYWxsb3dcIiAhPT0gdGhpcy5fc2V0dGluZ3Muc2Nyb2xsRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZihzY3JvbGxFdmVudCwgc2Nyb2xsSGFuZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGlhbG9nLnJlZ2lzdGVyKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLl9zZXR0aW5ncykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wb3B1cChcIm9wZW5cIikub24odGhpcy5fc2V0dGluZ3MuZXZlbnQsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImRhdGEtYXV0by1jbG9zZT0nZmFsc2UnXCIg44GM5oyH5a6a44GV44KM44Gm44GE44KL6KaB57Sg44GvIGRpYWxvZyDjgpLplonjgZjjgarjgYRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhdXRvQ2xvc2UgPSAkKGV2ZW50LnRhcmdldCkuYXR0cihcImRhdGEtYXV0by1jbG9zZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudWxsID09IGF1dG9DbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9DbG9zZSA9IHRoaXMuX3NldHRpbmdzLmRlZmF1bHRBdXRvQ2xvc2UgPyBcInRydWVcIiA6IFwiZmFsc2VcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcImZhbHNlXCIgPT09IGF1dG9DbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiRGlhbG9nLnNob3coKSBmYWlsZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl8kZGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cudHJpZ2dlcihcImVycm9yXCIsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kZGlhbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog57WC5LqGXHJcbiAgICAgICAgICog5Z+65pys55qE44Gr44Gv6Ieq5YuV44Gn6ZaJ44GY44KL44GM44CBXHJcbiAgICAgICAgICog6KGo56S65Lit44Gu44OA44Kk44Ki44Ot44Kw44KS44Kv44Op44Kk44Ki44Oz44OI5YG044GL44KJ6ZaJ44GY44KL44Oh44K944OD44OJXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNsb3NlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fJGRpYWxvZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZy5wb3B1cChcImNsb3NlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OA44Kk44Ki44Ot44KwIGVsZW1lbnQg44KS5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIGdldCAkZWwoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRkaWFsb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByb3RlY3RlZCBtZXRob2RzOiBPdmVycmlkZVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg4DjgqTjgqLjg63jgrDooajnpLrjga7nm7TliY1cclxuICAgICAgICAgKiBET00g44KS5pON5L2c44Gn44GN44KL44K/44Kk44Of44Oz44Kw44Gn5ZG844Gz5Ye644GV44KM44KLLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7SVByb21pc2VCYXNlfSBwcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3RlY3RlZCBvbkJlZm9yZVNob3coKTogSVByb21pc2VCYXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44OA44Kk44Ki44Ot44Kw44Gu5L2/55So44GZ44KLIFRoZW1lIOOCkuino+axulxyXG4gICAgICAgICAqIOS4jeimgeOBquWgtOWQiOOBr+OCquODvOODkOODvOODqeOCpOODieOBmeOCi+OBk+OBqOOCguWPr+iDvVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3RlY3RlZCByZXNvbHZlVGhlbWUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5VGhlbWUgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkKFwiLnVpLXBhZ2UtYWN0aXZlXCIpLmpxbURhdGEoXCJ0aGVtZVwiKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYW5kaWRhdGVUaGVtZTogc3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9zZXR0aW5ncy50aGVtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tVGhlbWUgPSB0aGlzLl8kZGlhbG9nLmpxbURhdGEoXCJ0aGVtZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmICghZG9tVGhlbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXR0aW5ncy50aGVtZSA9IGNhbmRpZGF0ZVRoZW1lID0gcXVlcnlUaGVtZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3NldHRpbmdzLm92ZXJsYXlUaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tT3ZlcmxheVRoZW1lID0gdGhpcy5fJGRpYWxvZy5qcW1EYXRhKFwib3ZlcmxheS10aGVtZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmICghZG9tT3ZlcmxheVRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3Mub3ZlcmxheVRoZW1lID0gY2FuZGlkYXRlVGhlbWUgfHwgcXVlcnlUaGVtZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyB0cmFuc2l0aW9uIOOBruabtOaWsFxyXG4gICAgICAgICAgICB0aGlzLl9zZXR0aW5ncy50cmFuc2l0aW9uID0gVGhlbWUucXVlcnlEaWFsb2dUcmFuc2l0aW9uKHRoaXMuX3NldHRpbmdzLnRyYW5zaXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGlhbG9nIOOBruaXouWumuOCquODl+OCt+ODp+ODs+OCkuabtOaWsFxyXG4gICAgICAgICAqIOOBmeOBueOBpuOBriBEaWFsb2cg44GM5L2/55So44GZ44KL5YWx6YCa6Kit5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7RGlhbG9nT3B0aW9uc30gW2luXSDjg4DjgqTjgqLjg63jgrDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNldERlZmF1bHRPcHRpb25zKG9wdGlvbnM6IERpYWxvZ09wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gRGlhbG9nIOWFsemAmuioreWumuOBruWIneacn+WMllxyXG4gICAgICAgICAgICBEaWFsb2cuaW5pdENvbW1vbkNvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBEaWFsb2cuc19kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyDnj77lnKggYWN0aXZlIOOBquODgOOCpOOCouODreOCsOOBqOOBl+OBpueZu+mMsuOBmeOCi1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHJlZ2lzdGVyKGRpYWxvZzogRGlhbG9nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IGRpYWxvZyAmJiBudWxsICE9IERpYWxvZy5zX2FjdGl2ZURpYWxvZykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwibmV3IGRpYWxvZyBwcm9jIGlzIGNhbGxlZCBpbiB0aGUgcGFzdCBkaWFsb2cncyBvbmUuIHVzZSBzZXRUaW1lb3V0KCkgZm9yIHBvc3QgcHJvY2Vzcy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRGlhbG9nLnNfYWN0aXZlRGlhbG9nID0gZGlhbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGlhbG9nIOWFsemAmuioreWumuOBruWIneacn+WMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGluaXRDb21tb25Db25kaXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIEZyYW1ld29yayDjga7liJ3mnJ/ljJblvozjgavlh6bnkIbjgZnjgovlv4XopoHjgYzjgYLjgotcclxuICAgICAgICAgICAgaWYgKCFGcmFtZXdvcmsuaXNJbml0aWFsaXplZCgpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJpbml0Q29tbW9uQ29uZGl0aW9uKCkgc2hvdWxkIGJlIGNhbGxlZCBhZnRlciBGcmFtZXdvcmsuaW5pdGlhbGl6ZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBEaWFsb2cuc19vbGRCYWNrS2V5SGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgLy8gQmFjayBCdXR0b24gSGFuZGxlclxyXG4gICAgICAgICAgICAgICAgRGlhbG9nLnNfb2xkQmFja0tleUhhbmRsZXIgPSBDRFAuc2V0QmFja0J1dHRvbkhhbmRsZXIobnVsbCk7XHJcbiAgICAgICAgICAgICAgICBDRFAuc2V0QmFja0J1dHRvbkhhbmRsZXIoRGlhbG9nLmN1c3RvbUJhY2tLZXlIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDml6Llrprjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgICAgICAgIERpYWxvZy5zX2RlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkUG9zaXRpdmU6ICAgICAgICAgICAgIFwiZGxnLWJ0bi1wb3NpdGl2ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkTmVnYXRpdmU6ICAgICAgICAgICAgIFwiZGxnLWJ0bi1uZWdhdGl2ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiAgICAgICAgICAgICAgICAgIEZyYW1ld29yay5nZXREZWZhdWx0Q2xpY2tFdmVudCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc21pc3NpYmxlOiAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRBdXRvQ2xvc2U6ICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgICAgIFwicGxhdGZvcm0tZGVmYXVsdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsUG9zaXRpdmU6ICAgICAgICAgIFwiT0tcIixcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbE5lZ2F0aXZlOiAgICAgICAgICBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tLZXk6ICAgICAgICAgICAgICAgIFwiY2xvc2VcIixcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxFdmVudDogICAgICAgICAgICBcImRlbnlcIixcclxuICAgICAgICAgICAgICAgICAgICBkb21FeHRlbnNpb25PcHRpb25zOiAgICB7fSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEgvVyBCYWNrIEJ1dHRvbiBIYW5kbGVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tQmFja0tleUhhbmRsZXIoZXZlbnQ/OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gRGlhbG9nLnNfYWN0aXZlRGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJjbG9zZVwiID09PSBEaWFsb2cuc19hY3RpdmVEaWFsb2cuX3NldHRpbmdzLmJhY2tLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBEaWFsb2cuc19hY3RpdmVEaWFsb2cuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJmdW5jdGlvblwiID09PSB0eXBlb2YgRGlhbG9nLnNfYWN0aXZlRGlhbG9nLl9zZXR0aW5ncy5iYWNrS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxEaWFsb2dCYWNrS2V5SGFuZGxlcj5EaWFsb2cuc19hY3RpdmVEaWFsb2cuX3NldHRpbmdzLmJhY2tLZXkpKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gRGlhbG9nIOOBjCBhY3RpdmUg44Gq5aC05ZCI44CB5bi444Gr5pei5a6a44Gu44OP44Oz44OJ44Op44Gr44Gv5rih44GV44Gq44GEXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRGlhbG9nLnNfb2xkQmFja0tleUhhbmRsZXIoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5EaWFsb2dDb21tb25zXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFsZXJ0XHJcbiAgICAgKiBhbGVydCDjg6Hjg4Pjgrvjg7zjgrjooajnpLpcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgIFtpbl0g6KGo56S65paH5a2X5YiXXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnNdIFtpbl0g44OA44Kk44Ki44Ot44Kw44Kq44OX44K344On44OzXHJcbiAgICAgKiBAcmV0dXJuIHtqUXVlcnl9IOODgOOCpOOCouODreOCsOOBriBET00g44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBhbGVydChtZXNzYWdlOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dPcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGBcclxuICAgICAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ1aS1tb2RhbFwiIGRhdGEtcm9sZT1cInBvcHVwXCIgZGF0YS1jb3JuZXJzPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3M9XCJ1aS10aXRsZSB7e190aXRsZVN0YXRlfX1cIj57e3RpdGxlfX08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInVpLW1lc3NhZ2VcIj57e21lc3NhZ2V9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktbW9kYWwtZm9vdGVyIHVpLWdyaWQtc29sb1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwie3tpZFBvc2l0aXZlfX1cIiBjbGFzcz1cInVpLWJ0biB1aS1ibG9jay1hIHVpLXRleHQtZW1waGFzaXNcIiBkYXRhLWF1dG8tY2xvc2U9XCJ0cnVlXCI+e3tsYWJlbFBvc2l0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICAgICAgPC9zY3JpcHQ+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY29uc3QgZGxnQWxlcnQgPSBuZXcgRGlhbG9nKHRlbXBsYXRlLCAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBzcmM6IG51bGwsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgfSwgb3B0aW9ucykpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGxnQWxlcnQuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uZmlybVxyXG4gICAgICog56K66KqN44Oh44OD44K744O844K46KGo56S6XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgICBbaW5dIOihqOekuuaWh+Wtl+WIl1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zXSBbaW5dIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHJldHVybiB7alF1ZXJ5fSDjg4DjgqTjgqLjg63jgrDjga4gRE9NIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gY29uZmlybShtZXNzYWdlOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dPcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGBcclxuICAgICAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ1aS1tb2RhbFwiIGRhdGEtcm9sZT1cInBvcHVwXCIgZGF0YS1jb3JuZXJzPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3M9XCJ1aS10aXRsZSB7e190aXRsZVN0YXRlfX1cIj57e3RpdGxlfX08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInVpLW1lc3NhZ2VcIj57e21lc3NhZ2V9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktbW9kYWwtZm9vdGVyIHVpLWdyaWQtYVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwie3tpZE5lZ2F0aXZlfX1cIiBjbGFzcz1cInVpLWJ0biB1aS1ibG9jay1hXCIgZGF0YS1hdXRvLWNsb3NlPVwidHJ1ZVwiPnt7bGFiZWxOZWdhdGl2ZX19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkUG9zaXRpdmV9fVwiIGNsYXNzPVwidWktYnRuIHVpLWJsb2NrLWIgdWktdGV4dC1lbXBoYXNpc1wiIGRhdGEtYXV0by1jbG9zZT1cInRydWVcIj57e2xhYmVsUG9zaXRpdmV9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjb25zdCBkbGdDb25maXJtID0gbmV3IERpYWxvZyh0ZW1wbGF0ZSwgJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgc3JjOiBudWxsLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgIH0sIG9wdGlvbnMpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRsZ0NvbmZpcm0uc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBEaWFsb2dDb21tb25zT3B0aW9uc1xyXG4gICAgICogQGJyaWVmIHByb21wdCDjga7jgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEaWFsb2dQcm9tcHRPcHRpb25zIGV4dGVuZHMgRGlhbG9nT3B0aW9ucyB7XHJcbiAgICAgICAgZXZlbnRPSz86IHN0cmluZzsgLy8hPCBPSyDjg5zjgr/jg7PmirzkuIvmmYLjga4gZXZlbnQ6IGRlZmF1bHQ6IHByb21wdG9rXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgRGlhbG9nUHJvbXB0XHJcbiAgICAgKiBAYnJpZWYgcHJvbXB0IOODgOOCpOOCouODreOCsCAo6Z2e5YWs6ZaLKVxyXG4gICAgICovXHJcbiAgICBjbGFzcyBEaWFsb2dQcm9tcHQgZXh0ZW5kcyBEaWFsb2cge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9ldmVudE9LOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBvcHRpb25zPzogRGlhbG9nUHJvbXB0T3B0aW9ucykge1xyXG4gICAgICAgICAgICBzdXBlcihpZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50T0sgPSBvcHRpb25zLmV2ZW50T0sgfHwgXCJwcm9tcHRva1wiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODgOOCpOOCouODreOCsOihqOekuuOBruebtOWJjVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkJlZm9yZVNob3coKTogSVByb21pc2VCYXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgY29uc3Qgb25Db21taXQgPSAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuJGVsLmZpbmQoXCIjX3VpLXByb21wdFwiKS52YWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVsLnRyaWdnZXIodGhpcy5fZXZlbnRPSywgdGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZWxcclxuICAgICAgICAgICAgICAgIC5vbihcInZjbGlja1wiLCBcIi5jb21tYW5kLXByb21wdC1vayBcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvbkNvbW1pdChldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKFwia2V5ZG93blwiLCBcIiNfdWktcHJvbXB0XCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgRU5URVJfS0VZX0NPREUgPSAxMztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoRU5URVJfS0VZX0NPREUgPT09IGV2ZW50LmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25Db21taXQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLm9uQmVmb3JlU2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb21wdFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICAgW2luXSDooajnpLrmloflrZfliJdcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uc10gW2luXSDjg4DjgqTjgqLjg63jgrDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEByZXR1cm4ge2pRdWVyeX0g44OA44Kk44Ki44Ot44Kw44GuIERPTSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHByb21wdChtZXNzYWdlOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dQcm9tcHRPcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGBcclxuICAgICAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ1aS1tb2RhbFwiIGRhdGEtcm9sZT1cInBvcHVwXCIgZGF0YS1jb3JuZXJzPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3M9XCJ1aS10aXRsZSB7e190aXRsZVN0YXRlfX1cIj57e3RpdGxlfX08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInVpLW1lc3NhZ2VcIj57e21lc3NhZ2V9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIl91aS1wcm9tcHRcIiBjbGFzcz1cInVpLWhpZGRlbi1hY2Nlc3NpYmxlXCI+PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIl91aS1wcm9tcHRcIiBpZD1cIl91aS1wcm9tcHRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktbW9kYWwtZm9vdGVyIHVpLWdyaWQtYVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwie3tpZE5lZ2F0aXZlfX1cIiBjbGFzcz1cInVpLWJ0biB1aS1ibG9jay1hXCIgZGF0YS1hdXRvLWNsb3NlPVwidHJ1ZVwiPnt7bGFiZWxOZWdhdGl2ZX19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkUG9zaXRpdmV9fVwiIGNsYXNzPVwiY29tbWFuZC1wcm9tcHQtb2sgdWktYnRuIHVpLWJsb2NrLWIgdWktdGV4dC1lbXBoYXNpc1wiIGRhdGEtYXV0by1jbG9zZT1cImZhbHNlXCI+e3tsYWJlbFBvc2l0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICAgICAgPC9zY3JpcHQ+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY29uc3QgZGxnUHJvbXB0ID0gbmV3IERpYWxvZ1Byb21wdCh0ZW1wbGF0ZSwgJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgc3JjOiBudWxsLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgIH0sIG9wdGlvbnMpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRsZ1Byb21wdC5zaG93KCk7XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IFJvdXRlciAgICAgICA9IENEUC5GcmFtZXdvcmsuUm91dGVyO1xyXG4gICAgaW1wb3J0IElQYWdlICAgICAgICA9IENEUC5GcmFtZXdvcmsuSVBhZ2U7XHJcbiAgICBpbXBvcnQgTW9kZWwgICAgICAgID0gQ0RQLkZyYW1ld29yay5Nb2RlbDtcclxuICAgIGltcG9ydCBWaWV3ICAgICAgICAgPSBDRFAuRnJhbWV3b3JrLlZpZXc7XHJcbiAgICBpbXBvcnQgVmlld09wdGlvbnMgID0gQ0RQLkZyYW1ld29yay5WaWV3T3B0aW9ucztcclxuICAgIGltcG9ydCBUZW1wbGF0ZSAgICAgPSBDRFAuVG9vbHMuVGVtcGxhdGU7XHJcbiAgICBpbXBvcnQgSlNUICAgICAgICAgID0gQ0RQLlRvb2xzLkpTVDtcclxuXHJcbiAgICBjb25zdCBUQUc6IHN0cmluZyA9IFwiW0NEUC5VSS5CYXNlSGVhZGVyVmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEJhc2VIZWFkZXJWaWV3T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIEJhc2VIZWFkZXJWaWV3IOOBq+aMh+WumuOBmeOCi+OCquODl+OCt+ODp+ODs+OCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJhc2VIZWFkZXJWaWV3T3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFZpZXdPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIGJhc2VUZW1wbGF0ZT86IEpTVDsgICAgICAgICAgICAgLy8hPCDlm7rlrprjg5jjg4Pjg4DnlKggSmF2YVNjcmlwdCDjg4bjg7Pjg5fjg6zjg7zjg4guXHJcbiAgICAgICAgYmFja0NvbW1hbmRTZWxlY3Rvcj86IHN0cmluZzsgICAvLyE8IFwi5oi744KLXCLjgrPjg57jg7Pjg4njgrvjg6zjgq/jgr8uIGRlZmF1bHQ6IFwiY29tbWFuZC1iYWNrXCJcclxuICAgICAgICBiYWNrQ29tbWFuZEtpbmQ/OiBzdHJpbmc7ICAgICAgIC8vITwgXCLmiLvjgotcIuOCs+ODnuODs+ODieeoruWIpSAob25Db21tYW5kIOesrDLlvJXmlbApLiBkZWZhdWx0OiBcInBhZ2ViYWNrXCJcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIEJhc2VIZWFkZXJWaWV3XHJcbiAgICAgKiBAYnJpZWYg5YWx6YCa44OY44OD44OA44KS5pON5L2c44GZ44KL44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBCYXNlSGVhZGVyVmlldzxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFZpZXc8VE1vZGVsPiB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfJGhlYWRlckJhc2U6IEpRdWVyeTsgICAvLyE8IOODmuODvOOCuOWkluOBq+mFjee9ruOBleOCjOOCi+WFsemAmuODmOODg+ODgOOBruODmeODvOOCuemDqOWTgeeUqCBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19yZWZDb3VudCA9IDA7ICAgICAgICAgIC8vITwg5Y+C54Wn44Kr44Km44Oz44OIXHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGU6IEpTVDtcclxuICAgICAgICBwcml2YXRlIF9oYXNCYWNrSW5kaWNhdG9yOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtJUGFnZX0gX293bmVyIFtpbl0g44Kq44O844OK44O844Oa44O844K444Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfb3duZXI6IElQYWdlLCBwcml2YXRlIF9vcHRpb25zPzogQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIoX29wdGlvbnMgPSAkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICBlbDogX293bmVyLiRwYWdlLmZpbmQoXCJbZGF0YS1yb2xlPSdoZWFkZXInXVwiKSxcclxuICAgICAgICAgICAgICAgIGJhY2tDb21tYW5kU2VsZWN0b3I6IFwiLmNvbW1hbmQtYmFja1wiLFxyXG4gICAgICAgICAgICAgICAgYmFja0NvbW1hbmRLaW5kOiBcInBhZ2ViYWNrXCIsXHJcbiAgICAgICAgICAgIH0sIF9vcHRpb25zKSk7XHJcblxyXG4gICAgICAgICAgICAvLyB0ZW1wbGF0ZSDoqK3lrppcclxuICAgICAgICAgICAgaWYgKF9vcHRpb25zLmJhc2VUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBfb3B0aW9ucy5iYXNlVGVtcGxhdGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFRlbXBsYXRlLmdldEpTVChgXHJcbiAgICAgICAgICAgICAgICAgICAgPHNjcmlwdCB0eXBlPSd0ZXh0L3RlbXBsYXRlJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhlYWRlciBjbGFzcz0ndWktaGVhZGVyLWJhc2UgdWktYm9keS17e3RoZW1lfX0nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0ndWktZml4ZWQtYmFjay1pbmRpY2F0b3InPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBCYWNrYm9uZS5WaWV3IOeUqOOBruWIneacn+WMllxyXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQodGhpcy4kZWwsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDliJ3mnJ/ljJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgY3JlYXRlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUhlYWRlckJhc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOacieWKueWMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBhY3RpdmF0ZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93SW5kaWNhdG9yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnhKHlirnljJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgaW5hY3RpdmF0ZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oaWRlSW5kaWNhdG9yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnoLTmo4RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgcmVsZWFzZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWxlYXNlSGVhZGVyQmFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8hIOWFsemAmuODmOODg+ODgOOBruODmeODvOOCueOCkua6luWCmVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlSGVhZGVyQmFzZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICAvLyDlm7rlrprjg5jjg4Pjg4Djga7jgajjgY3jgavmnInlirnljJZcclxuICAgICAgICAgICAgaWYgKFwiZml4ZWRcIiA9PT0gdGhpcy5fb3duZXIuJGhlYWRlci5qcW1EYXRhKFwicG9zaXRpb25cIikpIHtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsID09IEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlID0gJCh0aGlzLl90ZW1wbGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiB0aGlzLl9vd25lci4kcGFnZS5qcW1EYXRhKFwidGhlbWVcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc19yZWZDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZS5hcHBlbmRUbygkKGRvY3VtZW50LmJvZHkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBCYWNrIEluZGljYXRvciDjgpLmjIHjgaPjgabjgYTjgovjgYvliKTlrppcclxuICAgICAgICAgICAgaWYgKDAgPCB0aGlzLiRlbC5maW5kKFwiLnVpLWJhY2staW5kaWNhdG9yXCIpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faGFzQmFja0luZGljYXRvciA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgaW5kaWNhdG9yIOOBruihqOekulxyXG4gICAgICAgIHByaXZhdGUgc2hvd0luZGljYXRvcigpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICAvLyBCYWNrIEluZGljYXRvciDjgpLmjIHjgaPjgabjgYTjgarjgYTloLTlkIjooajnpLrjgZfjgarjgYRcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSAmJiB0aGlzLl9oYXNCYWNrSW5kaWNhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlLmZpbmQoXCIudWktZml4ZWQtYmFjay1pbmRpY2F0b3JcIikuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGluZGljYXRvciDjga7pnZ7ooajnpLpcclxuICAgICAgICBwcml2YXRlIGhpZGVJbmRpY2F0b3IoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSkge1xyXG4gICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZS5maW5kKFwiLnVpLWZpeGVkLWJhY2staW5kaWNhdG9yXCIpLnJlbW92ZUNsYXNzKFwic2hvd1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhbHpgJrjg5jjg4Pjg4Djga7jg5njg7zjgrnjgpLnoLTmo4RcclxuICAgICAgICBwcml2YXRlIHJlbGVhc2VIZWFkZXJCYXNlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIC8vIOWbuuWumuODmOODg+ODgOaZguOBq+WPgueFp+OCq+OCpuODs+ODiOOCkueuoeeQhlxyXG4gICAgICAgICAgICBpZiAoXCJmaXhlZFwiID09PSB0aGlzLl9vd25lci4kaGVhZGVyLmpxbURhdGEoXCJwb3NpdGlvblwiKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfcmVmQ291bnQtLTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PT0gQmFzZUhlYWRlclZpZXcuc19yZWZDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBCYWNrYm9uZS5WaWV3XHJcblxyXG4gICAgICAgIC8vISBldmVudHMgYmluZGluZ1xyXG4gICAgICAgIGV2ZW50cygpOiBhbnkge1xyXG4gICAgICAgICAgICBjb25zdCBldmVudE1hcCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRNYXBbXCJ2Y2xpY2sgXCIgKyB0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kU2VsZWN0b3JdID0gdGhpcy5vbkNvbW1hbmRCYWNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBldmVudE1hcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBiYWNrIOOBruODj+ODs+ODieODqVxyXG4gICAgICAgIHByaXZhdGUgb25Db21tYW5kQmFjayhldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vd25lcikge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlZCA9IHRoaXMuX293bmVyLm9uQ29tbWFuZChldmVudCwgdGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEtpbmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaGFuZGxlZCkge1xyXG4gICAgICAgICAgICAgICAgUm91dGVyLmJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBGcmFtZXdvcmsgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIGNvbnN0IFRBRzogc3RyaW5nID0gXCJbQ0RQLlVJLkJhc2VQYWdlXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgQmFzZVBhZ2VPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgQmFzZVBhZ2Ug44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFzZVBhZ2VPcHRpb25zPFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuUGFnZUNvbnN0cnVjdE9wdGlvbnMsIEJhc2VIZWFkZXJWaWV3T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBiYXNlSGVhZGVyPzogbmV3IChvd25lcjogRnJhbWV3b3JrLklQYWdlLCBvcHRpb25zPzogQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbD4pID0+IEJhc2VIZWFkZXJWaWV3PFRNb2RlbD47ICAgLy8hPCBIZWFkZXIg5qmf6IO944KS5o+Q5L6b44GZ44KL5Z+65bqV44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgYmFja0NvbW1hbmRIYW5kbGVyPzogc3RyaW5nOyAgICAgICAgICAgICAgICAvLyE8IFwi5oi744KLXCIg44Kz44Oe44Oz44OJ44OP44Oz44OJ44Op44Oh44K944OD44OJ5ZCNLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogb25QYWdlQmFja1xyXG4gICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zOyAgLy8hPCBET03mi6HlvLXjgavmuKHjgZnjgqrjg5fjgrfjg6fjg7MuIG51bGx8dW5kZWZpbmVkIOOCkuaMh+WumuOBmeOCi+OBqOaLoeW8teOBl+OBquOBhCBkZWZhdWx0OiB7fVxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgQmFzZVBhZ2VcclxuICAgICAqIEBicmllZiBIZWFkZXIg44KS5YKZ44GI44KLIFBhZ2Ug44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBCYXNlUGFnZTxUTW9kZWwgZXh0ZW5kcyBGcmFtZXdvcmsuTW9kZWwgPSBGcmFtZXdvcmsuTW9kZWw+IGV4dGVuZHMgRnJhbWV3b3JrLlBhZ2Uge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9iYXNlSGVhZGVyOiBCYXNlSGVhZGVyVmlldzxUTW9kZWw+OyAgICAvLyE8IOODmOODg+ODgOOCr+ODqeOCuVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICAgICAgIHVybCAgICAgICBbaW5dIOODmuODvOOCuCBVUkxcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgaWQgICAgICAgIFtpbl0g44Oa44O844K4IElEXHJcbiAgICAgICAgICogQHBhcmFtIHtCYXNlUGFnZU9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBwcml2YXRlIF9vcHRpb25zPzogQmFzZVBhZ2VPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIodXJsLCBpZCwgX29wdGlvbnMgPSAkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICBiYXNlSGVhZGVyOiBCYXNlSGVhZGVyVmlldyxcclxuICAgICAgICAgICAgICAgIGJhY2tDb21tYW5kSGFuZGxlcjogXCJvblBhZ2VCYWNrXCIsXHJcbiAgICAgICAgICAgICAgICBiYWNrQ29tbWFuZEtpbmQ6IFwicGFnZWJhY2tcIixcclxuICAgICAgICAgICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM6IHt9LFxyXG4gICAgICAgICAgICB9LCBfb3B0aW9ucykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBPdmVycmlkZTogRnJhbWV3b3JrIFBhZ2VcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVjcmVhdGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUNyZWF0ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmJhc2VIZWFkZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VIZWFkZXIgPSBuZXcgdGhpcy5fb3B0aW9ucy5iYXNlSGVhZGVyKHRoaXMsIHRoaXMuX29wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlci5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VjcmVhdGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUluaXQoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9vcHRpb25zLmRvbUV4dGVuc2lvbk9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIEV4dGVuc2lvbk1hbmFnZXIuYXBwbHlEb21FeHRlbnNpb24odGhpcy4kcGFnZSwgdGhpcy5fb3B0aW9ucy5kb21FeHRlbnNpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VJbml0KGV2ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmFzZUhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlci5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iYXNlSGVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLmluYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVIaWRlKGV2ZW50LCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VSZW1vdmUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmFzZUhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlci5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VSZW1vdmUoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSC9XIEJhY2sgQnV0dG9uIOODj+ODs+ODieODqVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIGV2ZW50IG9iamVjdFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaXouWumuOBruWHpueQhuOCkuihjOOCj+OBquOBhCAvIGZhbHNlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgYZcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkhhcmR3YXJlQmFja0J1dHRvbihldmVudD86IEpRdWVyeS5FdmVudCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBsZXQgcmV0dmFsID0gc3VwZXIub25IYXJkd2FyZUJhY2tCdXR0b24oZXZlbnQpO1xyXG4gICAgICAgICAgICBpZiAoIXJldHZhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dmFsID0gdGhpcy5vbkNvbW1hbmQoZXZlbnQsIHRoaXMuX29wdGlvbnMuYmFja0NvbW1hbmRLaW5kKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0dmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBPdmVycmlkZTogQ3VzdG9tIEV2ZW50XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFwi5oi744KLXCIgZXZlbnQg55m66KGM5pmC44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgo/jgarjgYQgLyBmYWxzZTog5pei5a6a44Gu5Yem55CG44KS6KGM44GGXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25Db21tYW5kKGV2ZW50OiBKUXVlcnkuRXZlbnQsIGtpbmQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEtpbmQgPT09IGtpbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vd25lciAmJiB0aGlzLl9vd25lclt0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kSGFuZGxlcl0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXJbdGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEhhbmRsZXJdKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcbiAgICBpbXBvcnQgUHJvbWlzZSAgICAgID0gQ0RQLlByb21pc2U7XHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrICAgID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZVZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnNcclxuICAgICAqIEBicmllZiBSb3V0ZXIg44G444Gu55m76Yyy5oOF5aCx44GoIEJhY2tib25lLlZpZXcg44G444Gu5Yid5pyf5YyW5oOF5aCx44KS5qC857SN44GZ44KL44Kk44Oz44K/44O844OV44Kn44Kk44K544Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUGFnZVZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBCYXNlUGFnZU9wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgYmFzZVBhZ2U/OiBuZXcgKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogRnJhbWV3b3JrLlBhZ2VDb25zdHJ1Y3RPcHRpb25zKSA9PiBGcmFtZXdvcmsuUGFnZTsgICAgLy8hPCBQYWdlIOapn+iDveOCkuaPkOS+m+OBmeOCi+WfuuW6leOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXVzZS1iZWZvcmUtZGVjbGFyZSAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFBhZ2VDb250YWluZXJWaWV3T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIFBhZ2VDb250YWluZXIg44Gu44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUGFnZUNvbnRhaW5lclZpZXdPcHRpb25zPFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuVmlld09wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgb3duZXI6IFBhZ2VWaWV3O1xyXG4gICAgICAgICRlbD86IEpRdWVyeTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQYWdlQ29udGFpbmVyVmlld1xyXG4gICAgICogQGJyaWVmIFBhZ2VWaWV3IOOBqOmAo+aQuuWPr+iDveOBqiDjgrPjg7Pjg4bjg4rjg5Pjg6Xjg7zjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VDb250YWluZXJWaWV3PFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuVmlldzxUTW9kZWw+IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfb3duZXI6IFBhZ2VWaWV3ID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBQYWdlQ29udGFpbmVyVmlld09wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5fb3duZXIgPSBvcHRpb25zLm93bmVyO1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy4kZWwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlcyA9ICg8YW55PnRoaXMpLmV2ZW50cyA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudChvcHRpb25zLiRlbCwgZGVsZWdhdGVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBzaG9ydCBjdXQgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEgT3duZXIg5Y+W5b6XXHJcbiAgICAgICAgZ2V0IG93bmVyKCk6IFBhZ2VWaWV3IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qIHRzbGludDplbmFibGU6bm8tdXNlLWJlZm9yZS1kZWNsYXJlICovXHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQYWdlVmlld1xyXG4gICAgICogQGJyaWVmIENEUC5GcmFtZXdvcmsuUGFnZSDjgaggQmFja2JvbmUuVmlldyDjga7kuKHmlrnjga7mqZ/og73jgpLmj5DkvpvjgZnjgovjg5rjg7zjgrjjga7ln7rlupXjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VWaWV3PFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuVmlldzxUTW9kZWw+IGltcGxlbWVudHMgRnJhbWV3b3JrLklQYWdlLCBJU3RhdHVzTWFuYWdlciB7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBfcGFnZU9wdGlvbnM6IFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+ID0gbnVsbDtcclxuICAgICAgICBwcm90ZWN0ZWQgX2Jhc2VQYWdlOiBGcmFtZXdvcmsuUGFnZSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfc3RhdHVzTWdyOiBTdGF0dXNNYW5hZ2VyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB1cmwgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgIFtpbl0g44Oa44O844K4IFVSTFxyXG4gICAgICAgICAqIEBwYXJhbSBpZCAgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgIFtpbl0g44Oa44O844K4IElEXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge1BhZ2VWaWV3Q29uc3RydWN0T3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgaWQ6IHN0cmluZywgb3B0aW9ucz86IFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gUGFnZVZpZXcg6Kit5a6aXHJcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VPcHRpb25zID0gJC5leHRlbmQoe30sIHsgb3duZXI6IHRoaXMgfSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jhc2VQYWdlID0gdGhpcy5fcGFnZU9wdGlvbnMuYmFzZVBhZ2UgPyBuZXcgdGhpcy5fcGFnZU9wdGlvbnMuYmFzZVBhZ2UodXJsLCBpZCwgdGhpcy5fcGFnZU9wdGlvbnMpIDogbmV3IEJhc2VQYWdlKHVybCwgaWQsIHRoaXMuX3BhZ2VPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFN0YXR1c01hbmFnZXJcclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzTWdyID0gbmV3IFN0YXR1c01hbmFnZXIoKTtcclxuICAgICAgICAgICAgLy8gQmFja2JvbmUuVmlldyDnlKjjga7liJ3mnJ/ljJZcclxuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGVzID0gKDxhbnk+dGhpcykuZXZlbnRzID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQodGhpcy4kcGFnZSwgZGVsZWdhdGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSVN0YXR1c01hbmFnZXIg54q25oWL566h55CGXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruOCpOODs+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyB7U3RyaW5nfSBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXR1c0FkZFJlZihzdGF0dXM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNNZ3Iuc3RhdHVzQWRkUmVmKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jg4fjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMge1N0cmluZ30gW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0dXNSZWxlYXNlKHN0YXR1czogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1c01nci5zdGF0dXNSZWxlYXNlKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlh6bnkIbjgrnjgrPjg7zjg5fmr47jgavnirbmhYvlpInmlbDjgpLoqK3lrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMgICB7U3RyaW5nfSAgIFtpbl0g54q25oWL6K2Y5Yil5a2QXHJcbiAgICAgICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn0gW2luXSDlh6bnkIbjgrPjg7zjg6vjg5Djg4Pjgq9cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0dXNTY29wZShzdGF0dXM6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQgfCBQcm9taXNlPGFueT4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzTWdyLnN0YXR1c1Njb3BlKHN0YXR1cywgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44Gf54q25oWL5Lit44Gn44GC44KL44GL56K66KqNXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdHVzIHtTdHJpbmd9ICAgW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDnirbmhYvlhoUgLyBmYWxzZTog54q25oWL5aSWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNTdGF0dXNJbihzdGF0dXM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzTWdyLmlzU3RhdHVzSW4oc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSVBhZ2Ugc3R1YiBzdHVmZi5cclxuXHJcbiAgICAgICAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLmFjdGl2ZTsgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHVybCgpOiBzdHJpbmcgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLnVybDsgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGlkKCk6IHN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlID8gdGhpcy5fYmFzZVBhZ2UuaWQgOiBudWxsOyB9XHJcbiAgICAgICAgZ2V0ICRwYWdlKCk6IEpRdWVyeSAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLiRwYWdlOyAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0ICRoZWFkZXIoKTogSlF1ZXJ5ICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLiRoZWFkZXI7ICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0ICRmb290ZXIoKTogSlF1ZXJ5ICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLiRmb290ZXI7ICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGludGVudCgpOiBGcmFtZXdvcmsuSW50ZW50ICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLmludGVudDsgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgc2V0IGludGVudChuZXdJbnRlbnQ6IEZyYW1ld29yay5JbnRlbnQpIHsgdGhpcy5fYmFzZVBhZ2UuaW50ZW50ID0gbmV3SW50ZW50OyAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE9yaWVudGF0aW9uIOOBruWkieabtOOCkuWPl+S/oVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG5ld09yaWVudGF0aW9uIHtPcmllbnRhdGlvbn0gW2luXSBuZXcgb3JpZW50YXRpb24gY29kZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBvbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbjogRnJhbWV3b3JrLk9yaWVudGF0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIL1cgQmFjayBCdXR0b24g44OP44Oz44OJ44OpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0gZXZlbnQgb2JqZWN0XHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5pei5a6a44Gu5Yem55CG44KS6KGM44KP44Gq44GEIC8gZmFsc2U6IOaXouWumuOBruWHpueQhuOCkuihjOOBhlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uSGFyZHdhcmVCYWNrQnV0dG9uKGV2ZW50PzogSlF1ZXJ5LkV2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJvdXRlciBcImJlZm9yZSByb3V0ZSBjaGFuZ2VcIiDjg4/jg7Pjg4njg6lcclxuICAgICAgICAgKiDjg5rjg7zjgrjpgbfnp7vnm7TliY3jgavpnZ7lkIzmnJ/lh6bnkIbjgpLooYzjgYbjgZPjgajjgYzlj6/og71cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0lQcm9taXNlQmFzZX0gUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkJlZm9yZVJvdXRlQ2hhbmdlKCk6IElQcm9taXNlQmFzZTxhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5rGO55So44Kz44Oe44Oz44OJ44KS5Y+X5L+hXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0gZXZlbnQgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtICBldmVudCB7a2luZH0gICAgICAgICAgICAgIFtpbl0gY29tbWFuZCBraW5kIHN0cmluZ1xyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaXouWumuOBruWHpueQhuOCkuihjOOCj+OBquOBhCAvIGZhbHNlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgYZcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkNvbW1hbmQoZXZlbnQ/OiBKUXVlcnkuRXZlbnQsIGtpbmQ/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5pyA5Yid44GuIE9uUGFnZUluaXQoKSDjga7jgajjgY3jgavjga7jgb/jgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uSW5pdGlhbGl6ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50KHRoaXMuJHBhZ2UsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VjcmVhdGVcIiAo5penOlwicGFnZWluaXRcIikg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VJbml0KGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNvbnRhaW5lcmhpZGVcIiAo5penOlwicGFnZWhpZGVcIikg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZXJlbW92ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5lbCAgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLiRlbCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIGZvciBub24gZmxpcHNuYXAgdXNlci5cclxuaW50ZXJmYWNlIElGbGlwc25hcCB7XHJcbiAgICBbeDogc3RyaW5nXTogYW55O1xyXG59XHJcbmludGVyZmFjZSBGbGlwc25hcE9wdGlvbnMge1xyXG59XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgTW9kZWwgICAgICAgICAgICAgICAgICAgICAgICA9IEZyYW1ld29yay5Nb2RlbDtcclxuICAgIGltcG9ydCBJT3JpZW50YXRpb25DaGFuZ2VkTGlzdGVuZXIgID0gRnJhbWV3b3JrLklPcmllbnRhdGlvbkNoYW5nZWRMaXN0ZW5lcjtcclxuICAgIGltcG9ydCBPcmllbnRhdGlvbiAgICAgICAgICAgICAgICAgID0gRnJhbWV3b3JrLk9yaWVudGF0aW9uO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5UYWJIb3N0Vmlld10gXCI7XHJcblxyXG4gICAgbmFtZXNwYWNlIF9Db25maWcge1xyXG4gICAgICAgIGV4cG9ydCBjb25zdCBUQUJWSUVXX0NMQVNTID0gXCJ1aS10YWJ2aWV3XCI7XHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IFRBQlZJRVdfU0VMRUNUT1IgPSBcIi5cIiArIFRBQlZJRVdfQ0xBU1M7XHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IFRBQkhPU1RfQ0xBU1MgPSBcInVpLXRhYmhvc3RcIjtcclxuICAgICAgICBleHBvcnQgY29uc3QgVEFCSE9TVF9TRUxFQ1RPUiA9IFwiLlwiICsgVEFCSE9TVF9DTEFTUztcclxuICAgICAgICBleHBvcnQgY29uc3QgVEFCSE9TVF9SRUZSRVNIX0NPRUZGID0gMS4wOyAgICAgICAvLyBmbGlwc25hcCDliIfjgormm7/jgYjmmYLjgasgZHVyYXRpb24g44Gr5a++44GX44Gm5pu05paw44KS6KGM44GG5L+C5pWwXHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IFRBQkhPU1RfUkVGUkVTSF9JTlRFUlZBTCA9IDIwMDsgICAgLy8gZmxpcHNuYXAg44Gu5pu05paw44Gr5L2/55So44GZ44KL6ZaT6ZqUIFttc2VjXVxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElUYWJWaWV3XHJcbiAgICAgKiBAYnJpZWYgVGFiSG9zdFZpZXcg44Gr44Ki44K/44OD44OB5Y+v6IO944GqIFZpZXcg44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVRhYlZpZXcgZXh0ZW5kcyBJTGlzdFZpZXcsIElPcmllbnRhdGlvbkNoYW5nZWRMaXN0ZW5lciB7XHJcbiAgICAgICAgaG9zdDogVGFiSG9zdFZpZXc7ICAgICAgLy8gaG9zdCDjgavjgqLjgq/jgrvjgrlcclxuICAgICAgICAkZWw6IEpRdWVyeTsgICAgICAgICAgICAvLyDnrqHnkIYgRE9NIOOBq+OCouOCr+OCu+OCuVxyXG4gICAgICAgIG5lZWRSZWJ1aWxkPzogYm9vbGVhbjsgIC8vIHJlYnVpbGQg54q25oWL44Gr44Ki44Kv44K744K5XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZHM6IEZyYW1ld29ya1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnirbmhYvjgavlv5zjgZjjgZ/jgrnjgq/jg63jg7zjg6vkvY3nva7jga7kv53lrZgv5b6p5YWDXHJcbiAgICAgICAgICogQnJvd3NlciDjga4gTmF0aXZlIFNjcm9sbCDmmYLjgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKi9cclxuICAgICAgICB0cmVhdFNjcm9sbFBvc2l0aW9uKCk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZHM6IEV2ZW50XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNjcm9sbGVyIOOBruWIneacn+WMluaZguOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uSW5pdGlhbGl6ZShob3N0OiBUYWJIb3N0VmlldywgJHJvb3Q6IEpRdWVyeSk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNjcm9sbGVyIOOBruegtOajhOaZguOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uRGVzdHJveSgpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiB2aXNpYmlsaXR5IOWxnuaAp+OBjOWkieabtOOBleOCjOOBn+OBqOOBjeOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqIGFjdGl2ZSDjg5rjg7zjgrjjgajjgZ3jga7kuKHnq6/jga7jg5rjg7zjgrjjgYzlr77osaFcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB2aXNpYmxlIFtpbl0gdHJ1ZTog6KGo56S6IC8gZmFsc2U6IOmdnuihqOekulxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uVmlzaWJpbGl0eUNoYW5nZWQodmlzaWJsZTogYm9vbGVhbik6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODmuODvOOCuOOBjOihqOekuuWujOS6huOBl+OBn+OBqOOBjeOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uVGFiU2VsZWN0ZWQoKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Oa44O844K444GM6Z2e6KGo56S644Gr5YiH44KK5pu/44KP44Gj44Gf44Go44GN44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25UYWJSZWxlYXNlZCgpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg4njg6njg4PjgrDkuK3jgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBwb3NpdGlvbiBbaW5dIOePvuWcqOOBriB0YWIgaW5kZXhcclxuICAgICAgICAgKiBAcGFyYW0gb2Zmc2V0ICAgW2luXSDnp7vli5Xph49cclxuICAgICAgICAgKi9cclxuICAgICAgICBvblRhYlNjcm9sbGluZyhwb3NpdGlvbjogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcik6IHZvaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFRhYlZpZXdDb25zdHJ1Y3Rpb25PcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgVGFiVmlldyDjga7jgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUYWJWaWV3Q29uc3RydWN0aW9uT3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIExpc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBob3N0OiBUYWJIb3N0VmlldzsgICAgICAgICAgLy8gaG9zdCDjgpLmjIflrppcclxuICAgICAgICBkZWxheVJlZ2lzdGVyPzogYm9vbGVhbjsgICAgLy8g6YGF5bu255m76Yyy44KS6KGM44GG5aC05ZCI44GvIHRydWVcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBUYWJWaWV3Q29udGV4dFxyXG4gICAgICogQGJyaWVmIElUYWJWaWV3IOOCkuWIneacn+WMluOBmeOCi+OBn+OCgeOBruaDheWgseOCkuagvOe0jVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRhYlZpZXdDb250ZXh0PFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IHtcclxuICAgICAgICBjdG9yPzogbmV3IChvcHRpb25zPzogVGFiVmlld0NvbnN0cnVjdGlvbk9wdGlvbnM8VE1vZGVsPikgPT4gSVRhYlZpZXc7ICAvLyBJVGFiVmlldyDjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAgICBvcHRpb25zPzogVGFiVmlld0NvbnN0cnVjdGlvbk9wdGlvbnM8VE1vZGVsPjsgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmp4vnr4nmmYLjga7ln7rlupXjgqrjg5fjgrfjg6fjg7NcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBUYWJIb3N0Vmlld0NvbnN0cnVjdE9wdGlvbnNcclxuICAgICAqIEBicmllZiBUYWJIb3N0VmlldyDjga7liJ3mnJ/ljJbmg4XloLHjgpLmoLzntI3jgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUYWJIb3N0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBQYWdlQ29udGFpbmVyVmlld09wdGlvbnM8VE1vZGVsPiwgRmxpcHNuYXBPcHRpb25zIHtcclxuICAgICAgICBpbmFjdGl2ZVZpc2libGVUYWJEaXN0YW5jZT86IG51bWJlcjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g6Z2e6YG45oqe5pmC44GuIHZpc2libGUg44K/44OW5pWwIGV4KSAxOiDkuKHjgrXjgqTjg4lcclxuICAgICAgICBlbmFibGVOYXRpdmVTY3JvbGw/OiBib29sZWFuOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g44OW44Op44Km44K244Gu5pyA5aSW5p6gIOOBriBOYXRpdmUg44K544Kv44Ot44O844Or44KS5pyJ5Yq544Gr44GZ44KL5aC05ZCI44GvIHRydWVcclxuICAgICAgICB0YWJDb250ZXh0cz86IFRhYlZpZXdDb250ZXh0W107ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGFiVmlld0NvbnRleHQg44Gu6YWN5YiXXHJcbiAgICAgICAgZW5hYmxlQm91bmNlPzogYm9vbGVhbjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOe1guerr+OBpyBib3VuY2Ug44GZ44KL5aC05ZCI44Gr44GvIHRydWVcclxuICAgICAgICBpbml0aWFsV2lkdGg/OiBudW1iZXI7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2lkdGgg44Gu5Yid5pyf5YCkXHJcbiAgICAgICAgaW5pdGlhbEhlaWdodD86IG51bWJlcjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhlaWdodCDjga7liJ3mnJ/lgKRcclxuICAgICAgICBzY3JvbGxIYW5kbGVyPzogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQ7ICAgICAgICAgICAgICAgICAgLy8g5Z6C55u05pa55ZCR44Gu44K544Kv44Ot44O844Or44OP44Oz44OJ44OpXHJcbiAgICAgICAgc2Nyb2xsU3RvcEhhbmRsZXI/OiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZDsgICAgICAgICAgICAgIC8vIOWeguebtOaWueWQkeOBruOCueOCr+ODreODvOODq+OCueODiOODg+ODl+ODj+ODs+ODieODqVxyXG4gICAgICAgIHRhYk1vdmVIYW5kbGVyPzogKGRlbHRhOiBudW1iZXIpID0+IHZvaWQ7ICAgICAgICAgICAgICAgICAgICAgICAvLyDmsLTlubPmlrnlkJHjga7jgrnjgq/jg63jg7zjg6vjg4/jg7Pjg4njg6lcclxuICAgICAgICB0YWJTdG9wSGFuZGxlcj86IChuZXdJbmRleDogbnVtYmVyLCBtb3ZlZDogYm9vbGVhbikgPT4gdm9pZDsgICAgLy8g5rC05bmz5pa55ZCR44Gu44K544Kv44Ot44O844Or44K544OI44OD44OX44OP44Oz44OJ44OpXHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvLyBPd25lciDjgqTjg5njg7Pjg4jjg5Xjg4Pjgq9cclxuICAgIGludGVyZmFjZSBIb3N0SG9va0V2ZW50cyB7XHJcbiAgICAgICAgb25PcmllbnRhdGlvbkNoYW5nZWQ/OiAobmV3T3JpZW50YXRpb246IE9yaWVudGF0aW9uKSA9PiB2b2lkO1xyXG4gICAgICAgIG9uUGFnZVNob3c/OiAoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKSA9PiB2b2lkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFRhYkhvc3RWaWV3XHJcbiAgICAgKiBAYnJpZWYg44K/44OW5YiH44KK5pu/44GI5qmf6IO944KS5oyB44GkIFZpZXcg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBUYWJIb3N0VmlldzxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFBhZ2VDb250YWluZXJWaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJT3JpZW50YXRpb25DaGFuZ2VkTGlzdGVuZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIF90YWJzOiBJVGFiVmlld1tdID0gW107ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJVGFiVmlldyDjgpLmoLzntI1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfYWN0aXZlVGFiSW5kZXg6IG51bWJlciA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWN0aXZlIHRhYlxyXG4gICAgICAgIHByaXZhdGUgX2ZsaXBzbmFwOiBJRmxpcHNuYXAgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZsaXBzbmFwIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgIHByaXZhdGUgX2ZsaXBFbmRFdmVudEhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkID0gbnVsbDsgICAgIC8vIFwiZnN0b3VjaGVuZFwiXHJcbiAgICAgICAgcHJpdmF0ZSBfZmxpcE1vdmVFdmVudEhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkID0gbnVsbDsgICAgLy8gXCJmc3RvdWNobW92ZVwiXHJcbiAgICAgICAgcHJpdmF0ZSBfZmxpcERlbHRhQ2FjaGU6IG51bWJlciA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJmbGlwIOi3nembouOBruOCreODo+ODg+OCt+ODpVwiXHJcbiAgICAgICAgcHJpdmF0ZSBfcmVmcmVzaFRpbWVySWQ6IG51bWJlciA9IG51bGw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVmcmVzaCgpIOWPjeaYoOeiuuiqjeeUqFxyXG4gICAgICAgIHByaXZhdGUgXyRjb250ZW50c0hvbGRlcjogSlF1ZXJ5ID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRlbnRzIGhvbGRlclxyXG4gICAgICAgIHByaXZhdGUgX3NldHRpbmdzOiBUYWJIb3N0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPjsgICAgICAgICAgICAgICAgIC8vIFRhYkhvc3RWaWV3IOioreWumuWApFxyXG5cclxuICAgICAgICBwcml2YXRlIF9ob3N0RXZlbnRIb29rczogSG9zdEhvb2tFdmVudHMgPSB7fTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9uczogVGFiSG9zdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAvLyBjaGVjayBydW50aW1lIGNvbmRpdGlvblxyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBnbG9iYWwuRmxpcHNuYXApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJmbGlwc25hcCBtb2R1bGUgZG9lc24ndCBsb2FkLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICB0YWJDb250ZXh0czogW10sXHJcbiAgICAgICAgICAgICAgICB0YWJNb3ZlSGFuZGxlcjogKGRlbHRhOiBudW1iZXIpOiB2b2lkID0+IHsgLyogbm9vcCAqLyB9LFxyXG4gICAgICAgICAgICAgICAgdGFiU3RvcEhhbmRsZXI6IChuZXdJbmRleDogbnVtYmVyLCBtb3ZlZDogYm9vbGVhbik6IHZvaWQgPT4geyAvKiBub29wICovIH1cclxuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAvLyBzZXR1cCBldmVudCBoYW5kbGVyc1xyXG4gICAgICAgICAgICB0aGlzLl9mbGlwRW5kRXZlbnRIYW5kbGVyID0gKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZzRXZlbnQ6IGFueSA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGlwRGVsdGFDYWNoZSA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uVGFiQ2hhbmdlZChmc0V2ZW50Lm5ld1BvaW50LCBmc0V2ZW50Lm1vdmVkKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2ZsaXBNb3ZlRXZlbnRIYW5kbGVyID0gKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZzRXZlbnQ6IGFueSA9IGV2ZW50Lm9yaWdpbmFsRXZlbnQ7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGlwRGVsdGFDYWNoZSArPSBmc0V2ZW50LmRlbHRhO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGJvdW5jZSDjga7jgqzjg7zjg4lcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fc2V0dGluZ3MuZW5hYmxlQm91bmNlICYmIChcclxuICAgICAgICAgICAgICAgICAgICAoLTEgPT09IGZzRXZlbnQuZGlyZWN0aW9uICYmIDAgPT09IHRoaXMuX2FjdGl2ZVRhYkluZGV4ICYmIDAgPCB0aGlzLl9mbGlwRGVsdGFDYWNoZSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAoMSA9PT0gZnNFdmVudC5kaXJlY3Rpb24gJiYgdGhpcy5fYWN0aXZlVGFiSW5kZXggPT09IHRoaXMuX3RhYnMubGVuZ3RoIC0gMSAmJiB0aGlzLl9mbGlwRGVsdGFDYWNoZSA8IDApXHJcbiAgICAgICAgICAgICAgICApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9mbGlwc25hcC5tb3ZlVG9Qb2ludChmc0V2ZW50Lm5ld1BvaW50KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vblRhYk1vdmluZyhmc0V2ZW50LmRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYnZpZXc6IElUYWJWaWV3KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYnZpZXcub25UYWJTY3JvbGxpbmcodGhpcy5fYWN0aXZlVGFiSW5kZXgsIGZzRXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlcHJvY2Vzcyh0aGlzLl9hY3RpdmVUYWJJbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3Muc2Nyb2xsSGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTY3JvbGxIYW5kbGVyKHRoaXMuX3NldHRpbmdzLnNjcm9sbEhhbmRsZXIsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5zY3JvbGxTdG9wSGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTY3JvbGxTdG9wSGFuZGxlcih0aGlzLl9zZXR0aW5ncy5zY3JvbGxTdG9wSGFuZGxlciwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGhvc3QgZXZlbnQgaG9va1xyXG4gICAgICAgICAgICB0aGlzLl9ob3N0RXZlbnRIb29rcy5vbk9yaWVudGF0aW9uQ2hhbmdlZCA9IHRoaXMub3duZXIub25PcmllbnRhdGlvbkNoYW5nZWQuYmluZCh0aGlzLm93bmVyKTtcclxuICAgICAgICAgICAgdGhpcy5vd25lci5vbk9yaWVudGF0aW9uQ2hhbmdlZCA9IHRoaXMub25PcmllbnRhdGlvbkNoYW5nZWQuYmluZCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5faG9zdEV2ZW50SG9va3Mub25QYWdlU2hvdyA9IHRoaXMub3duZXIub25QYWdlU2hvdy5iaW5kKHRoaXMub3duZXIpO1xyXG4gICAgICAgICAgICB0aGlzLm93bmVyLm9uUGFnZVNob3cgPSB0aGlzLm9uUGFnZVNob3cuYmluZCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNldHVwIHRhYnNcclxuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFdpZHRoICA9IHRoaXMuX3NldHRpbmdzLmluaXRpYWxXaWR0aCB8fCB0aGlzLiRlbC53aWR0aCgpO1xyXG4gICAgICAgICAgICBjb25zdCBpbml0aWFsSGVpZ2h0ID0gdGhpcy5fc2V0dGluZ3MuaW5pdGlhbEhlaWdodCB8fCB0aGlzLiRlbC5oZWlnaHQoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRhYkNvbnRleHRzID0gdGhpcy5fc2V0dGluZ3MudGFiQ29udGV4dHMuc2xpY2UoKTtcclxuICAgICAgICAgICAgaWYgKDAgPCB0YWJDb250ZXh0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRhYkNvbnRleHRzLmZvckVhY2goKGNvbnRleHQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtZXhwcmVzc2lvbiAqL1xyXG4gICAgICAgICAgICAgICAgICAgIG5ldyBjb250ZXh0LmN0b3IoJC5leHRlbmQoe30sIGNvbnRleHQub3B0aW9ucywgeyBob3N0OiB0aGlzLCBkZWxheVJlZ2lzdGVyOiBmYWxzZSB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby11bnVzZWQtZXhwcmVzc2lvbiAqL1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBJVGFiVmlldyDjgqTjg7Pjgrnjgr/jg7PjgrnljJbopoHmsYJcclxuICAgICAgICAgICAgICAgIHRoaXMub25UYWJWaWV3U2V0dXBSZXF1ZXN0KGluaXRpYWxIZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBJVGFiVmlldyDjgasgJHRhYkhvc3Qg44KS44Ki44K144Kk44Oz44GZ44KLXHJcbiAgICAgICAgICAgIC8vIE5PVEU6IOePvuWcqOOBryBET00g44Gu6aCG5bqP44Gv5Zu65a6aXHJcbiAgICAgICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFidmlldzogSVRhYlZpZXcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0YWJ2aWV3Lm9uSW5pdGlhbGl6ZSh0aGlzLCAkKHRoaXMuJGVsW2luZGV4XSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuXyRjb250ZW50c0hvbGRlciA9IHRoaXMuJGVsLnBhcmVudCgpO1xyXG5cclxuICAgICAgICAgICAgLy8gRmxpcHNuYXBcclxuICAgICAgICAgICAgdGhpcy5zZXRGbGlwc25hcENvbmRpdGlvbigkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6IGluaXRpYWxXaWR0aCxcclxuICAgICAgICAgICAgfSwgdGhpcy5fc2V0dGluZ3MpKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVUYWIodGhpcy5fYWN0aXZlVGFiSW5kZXgsIDAsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog56C05qOE44Gu44OY44Or44OR44O86Zai5pWwXHJcbiAgICAgICAgICog44Oh44Oz44OQ44O844Gu56C05qOE44Gu44K/44Kk44Of44Oz44Kw44KS5aSJ44GI44KL5aC05ZCI44CB5pys44Oh44K944OD44OJ44KS44Kz44O844Or44GZ44KLXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5zY3JvbGxIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFNjcm9sbEhhbmRsZXIodGhpcy5fc2V0dGluZ3Muc2Nyb2xsSGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5zY3JvbGxTdG9wSGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTY3JvbGxTdG9wSGFuZGxlcih0aGlzLl9zZXR0aW5ncy5zY3JvbGxTdG9wSGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVzZXRGbGlwc25hcENvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYnZpZXc6IElUYWJWaWV3KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0YWJ2aWV3Lm9uRGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fdGFicyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLl8kY29udGVudHNIb2xkZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kczpcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGFiVmlldyDjgpLnmbvpjLJcclxuICAgICAgICAgKiBGcmFtZXdvcmsg44GM5L2/55SoXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdGFidmlldyBbaW5dIElUYWJWaWV3IOOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyByZWdpc3RlclRhYlZpZXcodGFidmlldzogSVRhYlZpZXcpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gdGhpcy5nZXRUYWJJbmRleE9mKHRhYnZpZXcpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90YWJzLnB1c2godGFidmlldyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ0YWIgaW5zdGFuY2UgYWxyZWFkeSByZWdpc3RlcmVkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGFiVmlldyDjga4gVGFiIGluZGV4IOOCkuWPluW+l1xyXG4gICAgICAgICAqIEZyYW1ld29yayDjgYzkvb/nlKhcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB0YWJ2aWV3IFtpbl0gSVRhYlZpZXcg44Gu44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICogQHJldHVybiDmjIflrprjgqTjg7Pjgrnjgr/jg7Pjgrnjga7jgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgZ2V0VGFiSW5kZXhPZih0YWJ2aWV3OiBJVGFiVmlldyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gdGhpcy5fdGFicy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0YWJ2aWV3ID09PSB0aGlzLl90YWJzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjg5rjg7zjgrjjga7ln7rmupblgKTjgpLlj5blvpdcclxuICAgICAgICBwdWJsaWMgZ2V0QmFzZUhlaWdodCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWwuaGVpZ2h0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgr/jg5bjga7mlbDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0g44K/44OW5pWwXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGdldFRhYkNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJzLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCouOCr+ODhuOCo+ODluOBquOCv+ODliBJbmRleCDjgpLlj5blvpdcclxuICAgICAgICBwdWJsaWMgZ2V0QWN0aXZlVGFiSW5kZXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVRhYkluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc3dpcGUg56e75YuV6YeP44KS5Y+W5b6XIChzd2lwZSDkuK3jgasgZGVsdGEg44Gu5Yqg566X5YCk44KS6L+U5Y20KVxyXG4gICAgICAgIHB1YmxpYyBnZXRTd2lwZURlbHRhKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mbGlwRGVsdGFDYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCouOCr+ODhuOCo+ODliBUYWIg44KS6Kit5a6aXHJcbiAgICAgICAgcHVibGljIHNldEFjdGl2ZVRhYihpbmRleDogbnVtYmVyLCB0cmFuc2l0aW9uRHVyYXRpb24/OiBudW1iZXIsIGluaXRpYWw/OiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbGlkVGFiKGluZGV4KSAmJiAoaW5pdGlhbCB8fCAodGhpcy5fYWN0aXZlVGFiSW5kZXggIT09IGluZGV4KSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIOmBt+enu+WJjeOBqyBzY3JvbGwg5L2N572u44GuIHZpZXcg44KS5pu05pawXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXByb2Nlc3MoaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RBY3RpdmVUYWJJbmRleCA9IHRoaXMuX2FjdGl2ZVRhYkluZGV4O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlVGFiSW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZsaXBzbmFwLm1vdmVUb1BvaW50KHRoaXMuX2FjdGl2ZVRhYkluZGV4LCB0cmFuc2l0aW9uRHVyYXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgIHsvLyDpgbfnp7vlvozjgasgbGlzdHZpZXcg44Gu54q25oWL44KS5aSJ5pu0XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hhbmdlVGFiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc3Rwcm9jZXNzKGxhc3RBY3RpdmVUYWJJbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25UYWJDaGFuZ2VkKHRoaXMuX2FjdGl2ZVRhYkluZGV4LCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uID0gdHJhbnNpdGlvbkR1cmF0aW9uIHx8IHBhcnNlSW50KHRoaXMuX2ZsaXBzbmFwLnRyYW5zaXRpb25EdXJhdGlvbiwgMTApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgwID09PSB0cmFuc2l0aW9uRHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlVGFiKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VUYWIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdHJhbnNpdGlvbkR1cmF0aW9uICogX0NvbmZpZy5UQUJIT1NUX1JFRlJFU0hfQ09FRkYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByb3RlY3RlZCBtZXRob2RzOlxyXG5cclxuICAgICAgICAvLyBmbGlwIOe1guS6huaZguOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgIHByb3RlY3RlZCBvblRhYkNoYW5nZWQobmV3SW5kZXg6IG51bWJlciwgbW92ZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG1vdmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZVRhYihuZXdJbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MudGFiU3RvcEhhbmRsZXIobmV3SW5kZXgsIG1vdmVkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGZsaXAg5Lit44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVGFiTW92aW5nKGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MudGFiTW92ZUhhbmRsZXIoZGVsdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44K/44OW44Od44K444K344On44Oz44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlc2V0VGFiUG9zaXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFidmlldzogSVRhYlZpZXcpID0+IHtcclxuICAgICAgICAgICAgICAgIHRhYnZpZXcuc2Nyb2xsVG8oMCwgZmFsc2UsIDApO1xyXG4gICAgICAgICAgICAgICAgdGFidmlldy5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZVRhYigwLCAwLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElUYWJWaWV3IOioreWumuODquOCr+OCqOOCueODiOaZguOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgIHByb3RlY3RlZCBvblRhYlZpZXdTZXR1cFJlcXVlc3QoaW5pdGlhbEhlaWdodDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIG92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEhvc3QgZXZlbnQgaG9va3M6XHJcblxyXG4gICAgICAgIC8vIE9yaWVudGF0aW9uIOOBruWkieabtOaknOefpVxyXG4gICAgICAgIG9uT3JpZW50YXRpb25DaGFuZ2VkKG5ld09yaWVudGF0aW9uOiBPcmllbnRhdGlvbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9ob3N0RXZlbnRIb29rcy5vbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYnZpZXc6IElUYWJWaWV3KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0YWJ2aWV3Lm9uT3JpZW50YXRpb25DaGFuZ2VkKG5ld09yaWVudGF0aW9uKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9yZWZyZXNoVGltZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlZnJlc2hUaW1lcklkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ZsaXBzbmFwICYmIDAgPCB0aGlzLl90YWJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwcm9jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDjg6rjg4jjg6njgqRcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ZsaXBzbmFwICYmIHRoaXMuX2ZsaXBzbmFwLl9tYXhQb2ludCAhPT0gKHRoaXMuX3RhYnMubGVuZ3RoIC0gMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZsaXBzbmFwLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlZnJlc2hUaW1lcklkID0gc2V0VGltZW91dChwcm9jLCBfQ29uZmlnLlRBQkhPU1RfUkVGUkVTSF9JTlRFUlZBTCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGltZXJJZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZsaXBzbmFwLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGltZXJJZCA9IHNldFRpbWVvdXQocHJvYywgX0NvbmZpZy5UQUJIT1NUX1JFRlJFU0hfSU5URVJWQUwpO1xyXG4gICAgICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8galFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICAgIG9uUGFnZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hvc3RFdmVudEhvb2tzLm9uUGFnZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnJlYnVpbGQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogU2Nyb2xsTWFuYWdlciBQcm9maWxlIOeuoeeQhlxyXG5cclxuICAgICAgICAvLyDjg5rjg7zjgrjjgqLjgrXjgqTjg7PjgpLlho3mp4vmiJBcclxuICAgICAgICByZWJ1aWxkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYnZpZXc6IElUYWJWaWV3KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFidmlldy5uZWVkUmVidWlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYnZpZXcucmVidWlsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYnZpZXcubmVlZFJlYnVpbGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IFNjcm9sbE1hbmFnZXIgU2Nyb2xsXHJcblxyXG4gICAgICAgIC8vIOOCueOCr+ODreODvOODq+OCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICBzZXRTY3JvbGxIYW5kbGVyKGhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkLCBvbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlVGFiVmlldykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlVGFiVmlldy5zZXRTY3JvbGxIYW5kbGVyKGhhbmRsZXIsIG9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44K544Kv44Ot44O844Or57WC5LqG44Kk44OZ44Oz44OI44OP44Oz44OJ44Op6Kit5a6aL+ino+mZpFxyXG4gICAgICAgIHNldFNjcm9sbFN0b3BIYW5kbGVyKGhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkLCBvbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlVGFiVmlldykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlVGFiVmlldy5zZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyLCBvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCueOCr+ODreODvOODq+S9jee9ruOCkuWPluW+l1xyXG4gICAgICAgIGdldFNjcm9sbFBvcygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlVGFiVmlldykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVRhYlZpZXcuZ2V0U2Nyb2xsUG9zKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44K544Kv44Ot44O844Or5L2N572u44Gu5pyA5aSn5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zTWF4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVUYWJWaWV3KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlVGFiVmlldy5nZXRTY3JvbGxQb3NNYXgoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVRhYlZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVRhYlZpZXcuc2Nyb2xsVG8ocG9zLCBhbmltYXRlLCB0aW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIC8vIGZsaXBzbmFwIOeSsOWig+ioreWumlxyXG4gICAgICAgIHByaXZhdGUgc2V0RmxpcHNuYXBDb25kaXRpb24ob3B0aW9uczogRmxpcHNuYXBPcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZsaXBzbmFwID0gZ2xvYmFsLkZsaXBzbmFwKF9Db25maWcuVEFCSE9TVF9TRUxFQ1RPUiwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICQodGhpcy5fZmxpcHNuYXAuZWxlbWVudCkub24oXCJmc3RvdWNoZW5kXCIsIF8uYmluZCh0aGlzLl9mbGlwRW5kRXZlbnRIYW5kbGVyLCB0aGlzKSk7XHJcbiAgICAgICAgICAgICQodGhpcy5fZmxpcHNuYXAuZWxlbWVudCkub24oXCJmc3RvdWNobW92ZVwiLCBfLmJpbmQodGhpcy5fZmxpcE1vdmVFdmVudEhhbmRsZXIsIHRoaXMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGZsaXBzbmFwIOeSsOWig+egtOajhFxyXG4gICAgICAgIHByaXZhdGUgcmVzZXRGbGlwc25hcENvbmRpdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ZsaXBzbmFwKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMuX2ZsaXBzbmFwLmVsZW1lbnQpLm9mZihcImZzdG91Y2htb3ZlXCIsIF8uYmluZCh0aGlzLl9mbGlwTW92ZUV2ZW50SGFuZGxlciwgdGhpcykpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLl9mbGlwc25hcC5lbGVtZW50KS5vZmYoXCJmc3RvdWNoZW5kXCIsIF8uYmluZCh0aGlzLl9mbGlwRW5kRXZlbnRIYW5kbGVyLCB0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGlwc25hcC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGlwc25hcCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fZmxpcERlbHRhQ2FjaGUgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGFiIOWIh+OCiuabv+OBiOOBruWJjeWHpueQhlxyXG4gICAgICAgIHByaXZhdGUgcHJlcHJvY2Vzcyh0b0luZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fdGFicy5mb3JFYWNoKCh0YWJ2aWV3OiBJVGFiVmlldywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gdGhpcy5fYWN0aXZlVGFiSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3LnRyZWF0U2Nyb2xsUG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIOenu+WLleevhOWbsuOCkuWPr+imluWMliBOT1RFOiBsb29wIOWvvuW/nOaZguOBq+adoeS7tuimi+ebtOOBl1xyXG4gICAgICAgICAgICAgICAgaWYgKCh0aGlzLl9hY3RpdmVUYWJJbmRleCA8IHRvSW5kZXggJiYgKHRoaXMuX2FjdGl2ZVRhYkluZGV4IDwgaW5kZXggJiYgaW5kZXggPD0gdG9JbmRleCkpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKHRvSW5kZXggPCB0aGlzLl9hY3RpdmVUYWJJbmRleCAmJiAodG9JbmRleCA8PSBpbmRleCAmJiBpbmRleCA8IHRoaXMuX2FjdGl2ZVRhYkluZGV4KSlcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYnZpZXcuJGVsLmNzcyhcInZpc2liaWxpdHlcIiwgXCJ2aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRhYiDliIfjgormm7/jgYjjga7lvozlh6bnkIZcclxuICAgICAgICBwcml2YXRlIHBvc3Rwcm9jZXNzKGxhc3RBY3RpdmVUYWJJbmRleDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFidmlldzogSVRhYlZpZXcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9zZXR0aW5ncy5pbmFjdGl2ZVZpc2libGVUYWJEaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IGxvb3Ag5a++5b+c5pmC44Gr5p2h5Lu25a++5b+cXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2UgPSB0aGlzLl9zZXR0aW5ncy5pbmFjdGl2ZVZpc2libGVUYWJEaXN0YW5jZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlVGFiSW5kZXggLSBkaXN0YW5jZSA8PSBpbmRleCAmJiBpbmRleCA8PSB0aGlzLl9hY3RpdmVUYWJJbmRleCArIGRpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYnZpZXcuJGVsLmNzcyhcInZpc2liaWxpdHlcIiwgXCJ2aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3Lm9uVmlzaWJpbGl0eUNoYW5nZWQodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFidmlldy4kZWwuY3NzKFwidmlzaWJpbGl0eVwiLCBcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFidmlldy5vblZpc2liaWxpdHlDaGFuZ2VkKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IHRoaXMuX2FjdGl2ZVRhYkluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFidmlldy5vblRhYlNlbGVjdGVkKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBsYXN0QWN0aXZlVGFiSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3Lm9uVGFiUmVsZWFzZWQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUYWIgSW5kZXgg44KS5qSc6Ki8XHJcbiAgICAgICAgcHJpdmF0ZSB2YWxpZFRhYihpbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICgwID09PSB0aGlzLl90YWJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKDAgPD0gaW5kZXggJiYgaW5kZXggPCB0aGlzLl90YWJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiaW52YWxpZCB0YWIgaW5kZXguIGluZGV4OiBcIiArIGluZGV4KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44Ki44Kv44OG44Kj44OW44Gq44K/44OWIFNjcm9sbE1hbmFnZXIg44KS5Y+W5b6XXHJcbiAgICAgICAgcHJpdmF0ZSBnZXQgX2FjdGl2ZVRhYlZpZXcoKTogSVRhYlZpZXcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFic1t0aGlzLl9hY3RpdmVUYWJJbmRleF07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBNb2RlbCA9IENEUC5GcmFtZXdvcmsuTW9kZWw7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlRhYlZpZXddIFwiO1xyXG4gICAgY29uc3QgU1VQUFJFU1NfV0FSTklOR19JTklUSUFMX0hFSUdIVCA9IDE7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgVGFiVmlld1xyXG4gICAgICogQGJyaWVmIFRhYkhvc3RWaWV3IOOBq+OCouOCv+ODg+ODgeWPr+iDveOBqiBWaWV3IOOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgVGFiVmlldzxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIExpc3RWaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJVGFiVmlldyB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2hvc3Q6IFRhYkhvc3RWaWV3ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF9uZWVkUmVidWlsZDogYm9vbGVhbiA9IGZhbHNlOyAgLy8g44Oa44O844K46KGo56S65pmC44GrIHJlYnVpbGQoKSDjgpLjgrPjg7zjg6vjgZnjgovjgZ/jgoHjga7lhoXpg6jlpInmlbBcclxuICAgICAgICBwcml2YXRlIF90YWJJbmRleDogbnVtYmVyOyAgICAgICAgICAgICAgLy8g6Ieq6Lqr44GuIFRhYiBJbmRleFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9uczogVGFiVmlld0NvbnN0cnVjdGlvbk9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcigkLmV4dGVuZCh7fSwgeyBpbml0aWFsSGVpZ2h0OiBTVVBQUkVTU19XQVJOSU5HX0lOSVRJQUxfSEVJR0hUIH0sIG9wdGlvbnMpKTtcclxuICAgICAgICAgICAgdGhpcy5faG9zdCA9IG9wdGlvbnMuaG9zdDtcclxuICAgICAgICAgICAgaWYgKCFvcHRpb25zLmRlbGF5UmVnaXN0ZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hvc3QucmVnaXN0ZXJUYWJWaWV3KHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElWaWV3UGFnZXIgcHJvcGVydGllcy5cclxuXHJcbiAgICAgICAgLy8gQmFzZVRhYlBhZ2VWaWV3IOOBq+OCouOCr+OCu+OCuVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaG9zdCgpOiBUYWJIb3N0VmlldyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ob3N0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVidWlsZCDnirbmhYvjgbjjgqLjgq/jgrvjgrlcclxuICAgICAgICBwdWJsaWMgZ2V0IG5lZWRSZWJ1aWxkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbmVlZFJlYnVpbGQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZWJ1aWxkIOeKtuaFi+OCkuioreWumlxyXG4gICAgICAgIHB1YmxpYyBzZXQgbmVlZFJlYnVpbGQocmVidWlsZDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB0aGlzLl9uZWVkUmVidWlsZCA9IHJlYnVpbGQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElWaWV3UGFnZXIgRnJhbWV3b3JrLlxyXG5cclxuICAgICAgICAvLyDnirbmhYvjgavlv5zjgZjjgZ/jgrnjgq/jg63jg7zjg6vkvY3nva7jga7kv53lrZgv5b6p5YWDXHJcbiAgICAgICAgdHJlYXRTY3JvbGxQb3NpdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5jb3JlLnRyZWF0U2Nyb2xsUG9zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSVZpZXdQYWdlciBFdmVudHMuXHJcblxyXG4gICAgICAgIC8vIFNjcm9sbGVyIOOBruWIneacn+WMluaZguOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgIG9uSW5pdGlhbGl6ZShob3N0OiBUYWJIb3N0VmlldywgJHJvb3Q6IEpRdWVyeSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9ob3N0ID0gaG9zdDtcclxuICAgICAgICAgICAgdGhpcy5jb3JlLmluaXRpYWxpemUoJHJvb3QsIGhvc3QuZ2V0QmFzZUhlaWdodCgpKTtcclxuICAgICAgICAgICAgQmFja2JvbmUuVmlldy5wcm90b3R5cGUuc2V0RWxlbWVudC5jYWxsKHRoaXMsICRyb290LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNjcm9sbGVyIOOBruegtOajhOaZguOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgIG9uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5faG9zdCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB2aXNpYmlsaXR5IOWxnuaAp+OBjOWkieabtOOBleOCjOOBn+OBqOOBjeOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgIG9uVmlzaWJpbGl0eUNoYW5nZWQodmlzaWJsZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBvdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44Oa44O844K444GM6KGo56S65a6M5LqG44GX44Gf44Go44GN44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgb25UYWJTZWxlY3RlZCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5jb3JlLnNldEFjdGl2ZVN0YXRlKHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44Oa44O844K444GM6Z2e6KGo56S644Gr5YiH44KK5pu/44KP44Gj44Gf44Go44GN44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgb25UYWJSZWxlYXNlZCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5jb3JlLnNldEFjdGl2ZVN0YXRlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOODieODqeODg+OCsOS4reOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgIG9uVGFiU2Nyb2xsaW5nKHBvc2l0aW9uOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIG92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElPcmllbnRhdGlvbkNoYW5nZWRMaXN0ZW5lciBldmVudHMuXHJcblxyXG4gICAgICAgIC8vIE9yaWVudGF0aW9uIOOBruWkieabtOOCkuWPl+S/oVxyXG4gICAgICAgIG9uT3JpZW50YXRpb25DaGFuZ2VkKG5ld09yaWVudGF0aW9uOiBGcmFtZXdvcmsuT3JpZW50YXRpb24pOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gb3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IElMaXN0Vmlld1xyXG5cclxuICAgICAgICAvLyBjb3JlIGZyYW1ld29yayBhY2Nlc3NcclxuICAgICAgICBnZXQgY29yZSgpOiBTY3JvbGxNYW5hZ2VyIHtcclxuICAgICAgICAgICAgcmV0dXJuICg8YW55PnRoaXMpLl9zY3JvbGxNZ3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByb3RlY3RlZCBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vIOiHqui6q+OBriBUYWIgSW5kZXgg44KS5Y+W5b6XXHJcbiAgICAgICAgcHJvdGVjdGVkIGdldCB0YWJJbmRleCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl90YWJJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGFiSW5kZXggPSB0aGlzLl9ob3N0LmdldFRhYkluZGV4T2YodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYkluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6Ieq6Lqr44GMIGFjdGl2ZSDjgYvliKTlrppcclxuICAgICAgICBwcm90ZWN0ZWQgaXNBY3RpdmUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYkluZGV4ID09PSB0aGlzLl9ob3N0LmdldEFjdGl2ZVRhYkluZGV4KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IE1vZGVsID0gQ0RQLkZyYW1ld29yay5Nb2RlbDtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZUxpc3RWaWV3XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIFBhZ2VMaXN0VmlldyDjgbjjga7liJ3mnJ/ljJbmg4XloLHjgpLmoLzntI3jgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgTGlzdFZpZXdPcHRpb25zLCBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgYXV0b0Rlc3RvcnlFbGVtZW50PzogYm9vbGVhbjsgICAgICAgIC8vITwg44Oa44O844K46YG356e75YmN44GrIExpc3QgRWxlbWVudCDjgpLnoLTmo4TjgZnjgovloLTlkIjjga8gdHJ1ZSDjgpLmjIflrppcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQYWdlTGlzdFZpZXdcclxuICAgICAqIEBicmllZiDku67mg7Pjg6rjgrnjg4jjg5Pjg6Xjg7zmqZ/og73jgpLmjIHjgaQgUGFnZVZpZXcg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlTGlzdFZpZXc8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBQYWdlVmlldzxUTW9kZWw+IGltcGxlbWVudHMgSUxpc3RWaWV3IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc2Nyb2xsTWdyOiBTY3JvbGxNYW5hZ2VyID0gbnVsbDsgICAgLy8hPCBzY3JvbGwg44Kz44Ki44Ot44K444OD44KvXHJcbiAgICAgICAgcHJpdmF0ZSBfbmVlZFJlYnVpbGQ6IGJvb2xlYW4gPSBmYWxzZTsgICAgICAgLy8hPCDjg5rjg7zjgrjooajnpLrmmYLjgasgcmVidWlsZCgpIOOCkuOCs+ODvOODq+OBmeOCi+OBn+OCgeOBruWGhemDqOWkieaVsFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHVybCAgICAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgIFtpbl0gcGFnZSB0ZW1wbGF0ZSDjgavkvb/nlKjjgZnjgosgVVJMXHJcbiAgICAgICAgICogQHBhcmFtIGlkICAgICAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgIFtpbl0gcGFnZSDjgavmjK/jgonjgozjgZ8gSURcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7UGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgaWQ6IHN0cmluZywgb3B0aW9ucz86IFBhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcih1cmwsIGlkLCAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICAgICAgYXV0b0Rlc3RvcnlFbGVtZW50OiBmYWxzZSxcclxuICAgICAgICAgICAgfSwgb3B0aW9ucykpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IgPSBuZXcgU2Nyb2xsTWFuYWdlcihvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISByZWJ1aWxkKCkg44Gu44K544Kx44K444Ol44O844Oq44Oz44KwXHJcbiAgICAgICAgcHVibGljIHJlc2VydmVSZWJ1aWxkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9uZWVkUmVidWlsZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBQYWdlVmlld1xyXG5cclxuICAgICAgICAvLyEgT3JpZW50YXRpb24g44Gu5aSJ5pu05qSc55+lXHJcbiAgICAgICAgb25PcmllbnRhdGlvbkNoYW5nZWQobmV3T3JpZW50YXRpb246IEZyYW1ld29yay5PcmllbnRhdGlvbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3Iuc2V0QmFzZUhlaWdodCh0aGlzLmdldFBhZ2VCYXNlSGVpZ2h0KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODmuODvOOCuOmBt+enu+ebtOWJjeOCpOODmeODs+ODiOWHpueQhlxyXG4gICAgICAgIG9uQmVmb3JlUm91dGVDaGFuZ2UoKTogSVByb21pc2VCYXNlPGFueT4ge1xyXG4gICAgICAgICAgICBpZiAoKDxQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4+dGhpcy5fcGFnZU9wdGlvbnMpLmF1dG9EZXN0b3J5RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIub25CZWZvcmVSb3V0ZUNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICAgIG9uUGFnZUJlZm9yZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuaW5pdGlhbGl6ZSh0aGlzLiRwYWdlLCB0aGlzLmdldFBhZ2VCYXNlSGVpZ2h0KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyc2hvd1wiICjml6c6XCJwYWdlc2hvd1wiKSDjgavlr77lv5xcclxuICAgICAgICBvblBhZ2VTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VTaG93KGV2ZW50LCBkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldEJhc2VIZWlnaHQodGhpcy5nZXRQYWdlQmFzZUhlaWdodCgpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX25lZWRSZWJ1aWxkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlYnVpbGQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25lZWRSZWJ1aWxkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBqUU0gZXZlbnQ6IFwicGFnZXJlbW92ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgIG9uUGFnZVJlbW92ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZVJlbW92ZShldmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgUHJvZmlsZSDnrqHnkIZcclxuXHJcbiAgICAgICAgLy8hIOWIneacn+WMlua4iOOBv+OBi+WIpOWumlxyXG4gICAgICAgIGlzSW5pdGlhbGl6ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuaXNJbml0aWFsaXplZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODl+ODreODkeODhuOCo+OCkuaMh+WumuOBl+OBpuOAgUxpc3RJdGVtIOOCkueuoeeQhlxyXG4gICAgICAgIGFkZEl0ZW0oXHJcbiAgICAgICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgICAgICBpbml0aWFsaXplcjogbmV3IChvcHRpb25zPzogYW55KSA9PiBCYXNlTGlzdEl0ZW1WaWV3LFxyXG4gICAgICAgICAgICBpbmZvOiBhbnksXHJcbiAgICAgICAgICAgIGluc2VydFRvPzogbnVtYmVyXHJcbiAgICAgICAgICAgICk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9hZGRMaW5lKG5ldyBMaW5lUHJvZmlsZSh0aGlzLl9zY3JvbGxNZ3IsIE1hdGguZmxvb3IoaGVpZ2h0KSwgaW5pdGlhbGl6ZXIsIGluZm8pLCBpbnNlcnRUbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIEl0ZW0g44KS5YmK6ZmkXHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogbnVtYmVyLCBzaXplPzogbnVtYmVyLCBkZWxheT86IG51bWJlcik6IHZvaWQ7XHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogbnVtYmVyW10sIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBhbnksIGFyZzI/OiBudW1iZXIsIGFyZzM/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlbW92ZUl0ZW0oaW5kZXgsIGFyZzIsIGFyZzMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBl+OBnyBJdGVtIOOBq+ioreWumuOBl+OBn+aDheWgseOCkuWPluW+l1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogbnVtYmVyKTogYW55O1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogSlF1ZXJ5LkV2ZW50KTogYW55O1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogYW55KTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRJdGVtSW5mbyh0YXJnZXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCouOCr+ODhuOCo+ODluODmuODvOOCuOOCkuabtOaWsFxyXG4gICAgICAgIHJlZnJlc2goKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5yZWZyZXNoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5pyq44Ki44K144Kk44Oz44Oa44O844K444KS5qeL56+JXHJcbiAgICAgICAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Oa44O844K444Ki44K144Kk44Oz44KS5YaN5qeL5oiQXHJcbiAgICAgICAgcmVidWlsZCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlYnVpbGQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrqHovYTjg4fjg7zjgr/jgpLnoLTmo4RcclxuICAgICAgICByZWxlYXNlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVsZWFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgUHJvZmlsZSBCYWNrdXAgLyBSZXN0b3JlXHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg5Djg4Pjgq/jgqLjg4Pjg5dcclxuICAgICAgICBiYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5iYWNrdXAoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg6rjgrnjg4jjgqJcclxuICAgICAgICByZXN0b3JlKGtleTogc3RyaW5nLCByZWJ1aWxkOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXR2YWwgPSB0aGlzLl9zY3JvbGxNZ3IucmVzdG9yZShrZXksIHJlYnVpbGQpO1xyXG4gICAgICAgICAgICBpZiAocmV0dmFsICYmICFyZWJ1aWxkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2VydmVSZWJ1aWxkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldHZhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7mnInnhKFcclxuICAgICAgICBoYXNCYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5oYXNCYWNrdXAoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7noLTmo4RcclxuICAgICAgICBjbGVhckJhY2t1cChrZXk/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5jbGVhckJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBq+OCouOCr+OCu+OCuVxyXG4gICAgICAgIGdldCBiYWNrdXBEYXRhKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuYmFja3VwRGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IFNjcm9sbFxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or44Kk44OZ44Oz44OI44OP44Oz44OJ44Op6Kit5a6aL+ino+mZpFxyXG4gICAgICAgIHNldFNjcm9sbEhhbmRsZXIoaGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQsIG9uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zZXRTY3JvbGxIYW5kbGVyKGhhbmRsZXIsIG9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vntYLkuobjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgc2V0U2Nyb2xsU3RvcEhhbmRsZXIoaGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQsIG9uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyLCBvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuZ2V0U2Nyb2xsUG9zKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44Gu5pyA5aSn5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zTWF4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuZ2V0U2Nyb2xsUG9zTWF4KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5oyH5a6aXHJcbiAgICAgICAgc2Nyb2xsVG8ocG9zOiBudW1iZXIsIGFuaW1hdGU/OiBib29sZWFuLCB0aW1lPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zY3JvbGxUbyhwb3MsIGFuaW1hdGUsIHRpbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBleOCjOOBnyBMaXN0SXRlbVZpZXcg44Gu6KGo56S644KS5L+d6Ki8XHJcbiAgICAgICAgZW5zdXJlVmlzaWJsZShpbmRleDogbnVtYmVyLCBvcHRpb25zPzogRW5zdXJlVmlzaWJsZU9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLmVuc3VyZVZpc2libGUoaW5kZXgsIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgUHJvcGVydGllc1xyXG5cclxuICAgICAgICAvLyEgY29yZSBmcmFtZXdvcmsgYWNjZXNzXHJcbiAgICAgICAgZ2V0IGNvcmUoKTogSUxpc3RWaWV3RnJhbWV3b3JrIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1ncjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IEludGVybmFsIEkvRlxyXG5cclxuICAgICAgICAvLyEg55m76YyyIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgotcclxuICAgICAgICBfYWRkTGluZShfbGluZTogYW55LCBpbnNlcnRUbz86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuX2FkZExpbmUoX2xpbmUsIGluc2VydFRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBtZXRob2Q6XHJcblxyXG4gICAgICAgIC8vISDjg5rjg7zjgrjjga7ln7rmupblgKTjgpLlj5blvpdcclxuICAgICAgICBwcml2YXRlIGdldFBhZ2VCYXNlSGVpZ2h0KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKHdpbmRvdykuaGVpZ2h0KCkgLSBwYXJzZUludCh0aGlzLiRwYWdlLmNzcyhcInBhZGRpbmctdG9wXCIpLCAxMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBNb2RlbCA9IENEUC5GcmFtZXdvcmsuTW9kZWw7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlBhZ2VFeHBhbmRhYmxlTGlzdFZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VFeHBhbmRhYmxlTGlzdFZpZXdcclxuICAgICAqIEBicmllZiDplovplonjg6rjgrnjg4jjg5Pjg6Xjg7zmqZ/og73jgpLmjIHjgaQgUGFnZVZpZXcg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlRXhwYW5kYWJsZUxpc3RWaWV3PFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgUGFnZUxpc3RWaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJRXhwYW5kYWJsZUxpc3RWaWV3IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfZXhwYW5kTWFuYWdlcjogRXhwYW5kTWFuYWdlciA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdXJsICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIHRlbXBsYXRlIOOBq+S9v+eUqOOBmeOCiyBVUkxcclxuICAgICAgICAgKiBAcGFyYW0gaWQgICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIOOBq+aMr+OCieOCjOOBnyBJRFxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogUGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHVybCwgaWQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyID0gbmV3IEV4cGFuZE1hbmFnZXIodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElFeHBhbmRhYmxlTGlzdFZpZXdcclxuXHJcbiAgICAgICAgLy8hIOaWsOimjyBHcm91cFByb2ZpbGUg44KS5L2c5oiQXHJcbiAgICAgICAgbmV3R3JvdXAoaWQ/OiBzdHJpbmcpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5uZXdHcm91cChpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg55m76Yyy5riI44G/IEdyb3VwIOOCkuWPluW+l1xyXG4gICAgICAgIGdldEdyb3VwKGlkOiBzdHJpbmcpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5nZXRHcm91cChpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg56ysMemajuWxpOOBriBHcm91cCDnmbvpjLJcclxuICAgICAgICByZWdpc3RlclRvcEdyb3VwKHRvcEdyb3VwOiBHcm91cFByb2ZpbGUpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5yZWdpc3RlclRvcEdyb3VwKHRvcEdyb3VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrKwx6ZqO5bGk44GuIEdyb3VwIOOCkuWPluW+l1xyXG4gICAgICAgIGdldFRvcEdyb3VwcygpOiBHcm91cFByb2ZpbGVbXSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmdldFRvcEdyb3VwcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOBmeOBueOBpuOBruOCsOODq+ODvOODl+OCkuWxlemWiyAoMemajuWxpClcclxuICAgICAgICBleHBhbmRBbGwoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIuZXhwYW5kQWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5Y+O5p2fICgx6ZqO5bGkKVxyXG4gICAgICAgIGNvbGxhcHNlQWxsKGRlbGF5PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIuY29sbGFwc2VBbGwoZGVsYXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWxlemWi+S4reOBi+WIpOWumlxyXG4gICAgICAgIGlzRXhwYW5kaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5pc0V4cGFuZGluZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWPjuadn+S4reOBi+WIpOWumlxyXG4gICAgICAgIGlzQ29sbGFwc2luZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuaXNDb2xsYXBzaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg6ZaL6ZaJ5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNTd2l0Y2hpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmlzU3dpdGNoaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgbGF5b3V0IGtleSDjgpLlj5blvpdcclxuICAgICAgICBnZXQgbGF5b3V0S2V5KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmxheW91dEtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBsYXlvdXQga2V5IOOCkuioreWumlxyXG4gICAgICAgIHNldCBsYXlvdXRLZXkoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5sYXlvdXRLZXkgPSBrZXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBQYWdlTGlzdFZpZXdcclxuXHJcbiAgICAgICAgLy8hIOODh+ODvOOCv+OCkuegtOajhFxyXG4gICAgICAgIHJlbGVhc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44OQ44OD44Kv44Ki44OD44OXXHJcbiAgICAgICAgYmFja3VwKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODquOCueODiOOColxyXG4gICAgICAgIHJlc3RvcmUoa2V5OiBzdHJpbmcsIHJlYnVpbGQ6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlc3RvcmUoa2V5LCByZWJ1aWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIGpRdWVyeSBwbHVnaW4gZGVmaW5pdGlvblxyXG4gKi9cclxuaW50ZXJmYWNlIEpRdWVyeSB7XHJcbiAgICByaXBwbGUob3B0aW9ucz86IENEUC5VSS5Eb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5O1xyXG59XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgaW1wb3J0IEZyYW1ld29yayA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgLy8galF1ZXJ5IHBsdWdpblxyXG4gICAgJC5mbi5yaXBwbGUgPSBmdW5jdGlvbiAob3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0ICRlbCA9ICQodGhpcyk7XHJcbiAgICAgICAgaWYgKCRlbC5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGVsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJGVsLm9uKEZyYW1ld29yay5QYXRjaC5zX3ZjbGlja0V2ZW50LCBmdW5jdGlvbiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBzdXJmYWNlID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBzdXJmYWNlIGlmIGl0IGRvZXNuJ3QgZXhpc3RcclxuICAgICAgICAgICAgaWYgKHN1cmZhY2UuZmluZChcIi51aS1yaXBwbGUtaW5rXCIpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgc3VyZmFjZS5wcmVwZW5kKFwiPGRpdiBjbGFzcz0ndWktcmlwcGxlLWluayc+PC9kaXY+XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5rID0gc3VyZmFjZS5maW5kKFwiLnVpLXJpcHBsZS1pbmtcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBzdG9wIHRoZSBwcmV2aW91cyBhbmltYXRpb25cclxuICAgICAgICAgICAgaW5rLnJlbW92ZUNsYXNzKFwidWktcmlwcGxlLWFuaW1hdGVcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBpbmsgc2l6ZTpcclxuICAgICAgICAgICAgaWYgKCFpbmsuaGVpZ2h0KCkgJiYgIWluay53aWR0aCgpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkID0gTWF0aC5tYXgoc3VyZmFjZS5vdXRlcldpZHRoKCksIHN1cmZhY2Uub3V0ZXJIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgICAgICBpbmsuY3NzKHsgaGVpZ2h0OiBkLCB3aWR0aDogZCB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgeCA9IGV2ZW50LnBhZ2VYIC0gc3VyZmFjZS5vZmZzZXQoKS5sZWZ0IC0gKGluay53aWR0aCgpIC8gMik7XHJcbiAgICAgICAgICAgIGNvbnN0IHkgPSBldmVudC5wYWdlWSAtIHN1cmZhY2Uub2Zmc2V0KCkudG9wIC0gKGluay5oZWlnaHQoKSAvIDIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmlwcGxlQ29sb3IgPSBzdXJmYWNlLmRhdGEoXCJyaXBwbGUtY29sb3JcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBhbmltYXRpb24gZW5kIGhhbmRsZXJcclxuICAgICAgICAgICAgY29uc3QgQU5JTUFUSU9OX0VORF9FVkVOVCA9IFwiYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZFwiO1xyXG4gICAgICAgICAgICBpbmsub24oQU5JTUFUSU9OX0VORF9FVkVOVCwgZnVuY3Rpb24gKGV2OiBKUXVlcnkuRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGluay5vZmYoKTtcclxuICAgICAgICAgICAgICAgIGluay5yZW1vdmVDbGFzcyhcInVpLXJpcHBsZS1hbmltYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgaW5rID0gbnVsbDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIGFuZCBhZGQgY2xhc3MgLmFuaW1hdGVcclxuICAgICAgICAgICAgaW5rLmNzcyh7XHJcbiAgICAgICAgICAgICAgICB0b3A6IHkgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiB4ICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogcmlwcGxlQ29sb3JcclxuICAgICAgICAgICAgfSkuYWRkQ2xhc3MoXCJ1aS1yaXBwbGUtYW5pbWF0ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRlcmlhbCBEZXNpZ24gUmlwcGxlIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgY29uc3QgTk9fUklQUExFX0NMQVNTID0gW1xyXG4gICAgICAgICAgICBcIi51aS1yaXBwbGUtbm9uZVwiLFxyXG4gICAgICAgICAgICBcIi51aS1mbGlwc3dpdGNoLW9uXCIsXHJcbiAgICAgICAgICAgIFwiLnVpLXNsaWRlci1oYW5kbGVcIixcclxuICAgICAgICAgICAgXCIudWktaW5wdXQtY2xlYXJcIixcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSBcIi51aS1idG5cIjtcclxuICAgICAgICBpZiAoJHVpLmhhc0NsYXNzKFwidWktcGFnZVwiKSkge1xyXG4gICAgICAgICAgICBzZWxlY3RvciA9IFwiLnVpLWNvbnRlbnQgLnVpLWJ0blwiOyAvLyBoZWFkZXIg44Gv6Ieq5YuVIHJpcHBsZSDljJblr77osaHlpJZcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICR1aS5maW5kKHNlbGVjdG9yKVxyXG4gICAgICAgICAgICAuZmlsdGVyKChpbmRleCwgZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGVsZW0gPSAkKGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRlbGVtLmlzKE5PX1JJUFBMRV9DTEFTUy5qb2luKFwiLFwiKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoXCJ1aS1yaXBwbGVcIik7XHJcblxyXG4gICAgICAgIC8vIHJpcHBsaWZ5XHJcbi8vICAgICAgICAkdWkuZmluZChcIi51aS1yaXBwbGVcIikucmlwcGxlKG9wdGlvbnMpO1xyXG4gICAgICAgICR1aS5maW5kKFwiLnVpLXJpcHBsZVwiKVxyXG4gICAgICAgICAgICAuZWFjaCgoaW5kZXg6IG51bWJlciwgZWxlbTogRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJChlbGVtKS5yaXBwbGUob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiAkdWk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55m76YyyXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGFwcGx5RG9tRXh0ZW5zaW9uKTtcclxufVxyXG4iLCIvKipcclxuICogalF1ZXJ5IHBsdWdpbiBkZWZpbml0aW9uXHJcbiAqL1xyXG5pbnRlcmZhY2UgSlF1ZXJ5IHtcclxuICAgIHNwaW5uZXIob3B0aW9ucz86IENEUC5VSS5Eb21FeHRlbnNpb25PcHRpb25zIHwgXCJyZWZyZXNoXCIpOiBKUXVlcnk7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICBpbXBvcnQgVGVtcGxhdGUgPSBDRFAuVG9vbHMuVGVtcGxhdGU7XHJcbiAgICBpbXBvcnQgSlNUICAgICAgPSBDRFAuVG9vbHMuSlNUO1xyXG5cclxuICAgIGxldCBfdGVtcGxhdGU6IEpTVDtcclxuXHJcbiAgICAvLyBqUXVlcnkgcGx1Z2luXHJcbiAgICAkLmZuLnNwaW5uZXIgPSBmdW5jdGlvbiAob3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMgfCBcInJlZnJlc2hcIikge1xyXG4gICAgICAgIGlmIChcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVmcmVzaCgkKHRoaXMpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gc3Bpbm5lcmlmeSgkKHRoaXMpLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHNwaW5uZXJpZnkoJHRhcmdldDogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgaWYgKCR0YXJnZXQubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICR0YXJnZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIV90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICBfdGVtcGxhdGUgPSBUZW1wbGF0ZS5nZXRKU1QoYFxyXG4gICAgICAgICAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1iYXNlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyLWdhcFwiIHt7Ym9yZGVyVG9wfX0+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyLWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXItaGFsZi1jaXJjbGVcIiB7e2JvcmRlcn19Pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lci1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lci1oYWxmLWNpcmNsZVwiIHt7Ym9yZGVyfX0+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9zY3JpcHQ+XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbWFrZVRlbXBsYXRlUGFyYW0gPSAoY2xyOiBzdHJpbmcpOiBvYmplY3QgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wOiBcInN0eWxlPWJvcmRlci10b3AtY29sb3I6XCIgKyBjbHIgKyBcIjtcIixcclxuICAgICAgICAgICAgICAgIGJvcmRlcjogXCJzdHlsZT1ib3JkZXItY29sb3I6XCIgKyBjbHIgKyBcIjtcIixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBjb2xvciA9ICR0YXJnZXQuZGF0YShcInNwaW5uZXItY29sb3JcIik7XHJcbiAgICAgICAgbGV0IHBhcmFtID0gbnVsbDtcclxuICAgICAgICBpZiAoY29sb3IpIHtcclxuICAgICAgICAgICAgJHRhcmdldC5jc3MoeyBcImJhY2tncm91bmQtY29sb3JcIjogY29sb3IgfSk7XHJcbiAgICAgICAgICAgIHBhcmFtID0gbWFrZVRlbXBsYXRlUGFyYW0oY29sb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkdGFyZ2V0LmFwcGVuZChfdGVtcGxhdGUocGFyYW0pKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlZnJlc2goJHRhcmdldCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaU9TIDEwLjIrIFNWRyBTTUlMIOOCouODi+ODoeODvOOCt+ODp+ODs+OBjCAy5Zue55uu5Lul6ZmN5YuV44GL44Gq44GE5ZWP6aGM44Gu5a++562WXHJcbiAgICAvLyBkYXRhOmltYWdlL3N2Zyt4bWw7PGNhY2hlIGJ1c3Qgc3RyaW5nPjtiYXNlNjQsLi4uIOOBqOOBmeOCi+OBk+OBqOOBpyBkYXRhLXVybCDjgavjgoIgY2FjaGUgYnVzdGluZyDjgYzmnInlirnjgavjgarjgotcclxuICAgIGZ1bmN0aW9uIHJlZnJlc2goJHRhcmdldDogSlF1ZXJ5KTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCBQUkVGSVggPSBbXCItd2Via2l0LVwiLCBcIlwiXTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsaWQgPSAocHJvcCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKHByb3AgJiYgXCJub25lXCIgIT09IHByb3ApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBkYXRhVXJsOiBzdHJpbmc7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBQUkVGSVgubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdmFsaWQoZGF0YVVybCkpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFVcmwgPSAkdGFyZ2V0LmNzcyhQUkVGSVhbaV0gKyBcIm1hc2staW1hZ2VcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsaWQoZGF0YVVybCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpT1Mg44Gn44GvIHVybChkYXRhKioqKTsg5YaF44GrICdcIicg44Gv5YWl44KJ44Gq44GEXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBkYXRhVXJsLm1hdGNoKC8odXJsXFwoZGF0YTppbWFnZVxcL3N2Z1xcK3htbDspKFtcXHNcXFNdKik/KGJhc2U2NCxbXFxzXFxTXSpcXCkpLyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFVcmwgPSBgJHttYXRjaFsxXX1idXN0PSR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9OyR7bWF0Y2hbM119YDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVXJsID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbGlkKGRhdGFVcmwpKSB7XHJcbiAgICAgICAgICAgICAgICAkdGFyZ2V0LmNzcyhQUkVGSVhbaV0gKyBcIm1hc2staW1hZ2VcIiwgZGF0YVVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAkdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWF0ZXJpYWwgRGVzaWduIFNwaW5uZXIg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICAkdWkuZmluZChcIi51aS1zcGlubmVyLCAudWktaWNvbi1sb2FkaW5nXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKChpbmRleDogbnVtYmVyLCBlbGVtOiBFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW0pLnNwaW5uZXIob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiAkdWk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55m76YyyXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGFwcGx5RG9tRXh0ZW5zaW9uKTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXh0IElucHV0IOeUqCBGbG9hdGluZyBMYWJlbCDmi6HlvLVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICAgICAgICR1aSAgICAgICBbaW5dIOaknOe0ouWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbk9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcHBseURvbUV4dGVuc2lvbigkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IChlbGVtOiBFbGVtZW50LCBmbG9hdGluZzogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XHJcbiAgICAgICAgICAgIGlmIChmbG9hdGluZykge1xyXG4gICAgICAgICAgICAgICAgJGVsZW0uYWRkQ2xhc3MoXCJ1aS1mbG9hdC1sYWJlbC1mbG9hdGluZ1wiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRlbGVtLnJlbW92ZUNsYXNzKFwidWktZmxvYXQtbGFiZWwtZmxvYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBmbG9hdGluZ2lmeSA9IChlbGVtOiBFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gJChlbGVtKS5hdHRyKFwiZm9yXCIpO1xyXG4gICAgICAgICAgICBjb25zdCAkaW5wdXQgPSAkdWkuZmluZChcIiNcIiArIGlkKTtcclxuICAgICAgICAgICAgaWYgKFwic2VhcmNoXCIgPT09ICRpbnB1dC5qcW1EYXRhKFwidHlwZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgJChlbGVtKS5hZGRDbGFzcyhcInVpLWZsb2F0LWxhYmVsLWhhcy1pY29uXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHVwZGF0ZShlbGVtLCAhISRpbnB1dC52YWwoKSk7XHJcbiAgICAgICAgICAgICRpbnB1dC5vbihcImtleXVwIGNoYW5nZSBpbnB1dCBmb2N1cyBibHVyIGN1dCBwYXN0ZVwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlKGVsZW0sICEhJChldmVudC50YXJnZXQpLnZhbCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHVpLmZpbmQoXCJsYWJlbC51aS1mbG9hdC1sYWJlbCwgLnVpLWZsb2F0LWxhYmVsIGxhYmVsXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKChpbmRleDogbnVtYmVyLCBlbGVtOiBFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdGluZ2lmeShlbGVtKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAkdWk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55m76YyyXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGFwcGx5RG9tRXh0ZW5zaW9uKTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgaW1wb3J0IEZyYW1ld29yayA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBqUXVlcnkgTW9iaWxlIEZsaXAgU3dpdGNoIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBmbGlwc3dpdGNoIOOBq+e0kOOBpeOBjyBsYWJlbCDjga8gT1Mg44Gr44KI44Gj44GmIGV2ZW50IOeZuuihjOW9ouW8j+OBjOeVsOOBquOCi+OBn+OCgeODleODg+OCr+OBl+OBpueLrOiHquOCpOODmeODs+ODiOOBp+WvvuW/nOOBmeOCiy5cclxuICAgICAgICAgKiDjgb7jgZ8gZmxpcHN3aXRjaCDjga/lhoXpg6jjgacgY2xpY2sg44KS55m66KGM44GX44Gm44GE44KL44GM44CBdmNsaWNrIOOBq+WkieabtOOBmeOCiy5cclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgY29uc3QgX2dldEFsbFN3aXRjaGVzID0gKCk6IEpRdWVyeSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAkdWkuZmluZChcIi51aS1mbGlwc3dpdGNoXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IF9nZXRJbnB1dEZyb21Td2l0Y2ggPSAoJHN3aXRjaDogSlF1ZXJ5KTogSlF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gJHN3aXRjaC5maW5kKFwiaW5wdXRcIik7XHJcbiAgICAgICAgICAgIGlmICgkaW5wdXQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGlucHV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0ICRzZWxlY3QgPSAkc3dpdGNoLmZpbmQoXCJzZWxlY3RcIik7XHJcbiAgICAgICAgICAgIGlmICgkc2VsZWN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRzZWxlY3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2NoYW5nZSA9ICgkaW5wdXQ6IEpRdWVyeSwgdG86IGJvb2xlYW4pOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKCRpbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFwiSU5QVVRcIiA9PT0gJGlucHV0WzBdLm5vZGVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0LnByb3AoXCJjaGVja2VkXCIsIHRvKS5mbGlwc3dpdGNoKFwicmVmcmVzaFwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJTRUxFQ1RcIiA9PT0gJGlucHV0WzBdLm5vZGVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0LnZhbCh0byA/IFwib25cIiA6IFwib2ZmXCIpLmZsaXBzd2l0Y2goXCJyZWZyZXNoXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2dldExhYmVsc0Zyb21Td2l0Y2ggPSAoJHN3aXRjaDogSlF1ZXJ5KTogSlF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gX2dldElucHV0RnJvbVN3aXRjaCgkc3dpdGNoKTtcclxuICAgICAgICAgICAgaWYgKCRpbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGFiZWxzID0gKDxhbnk+JGlucHV0WzBdKS5sYWJlbHM7XHJcbiAgICAgICAgICAgICAgICBpZiAobGFiZWxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQobGFiZWxzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gJCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IF9nZXRTd2l0Y2hGcm9tTGFiZWwgPSAoJGxhYmVsOiBKUXVlcnkpOiBKUXVlcnkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gJGxhYmVsLmF0dHIoXCJmb3JcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBfZ2V0QWxsU3dpdGNoZXMoKS5maW5kKFwiW25hbWU9J1wiICsgbmFtZSArIFwiJ11cIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgX2dldEFsbFN3aXRjaGVzKClcclxuICAgICAgICAgICAgLm9uKFwidmNsaWNrIF9jaGFuZ2VfZmxpcHN3aWNoXCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkc3dpdGNoID0gJChldmVudC5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkaW5wdXQgPSBfZ2V0SW5wdXRGcm9tU3dpdGNoKCRzd2l0Y2gpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hhbmdlVG8gPSAhJHN3aXRjaC5oYXNDbGFzcyhcInVpLWZsaXBzd2l0Y2gtYWN0aXZlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkdGFyZ2V0Lmhhc0NsYXNzKFwidWktZmxpcHN3aXRjaC1pbnB1dFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9jaGFuZ2UoJGlucHV0LCBjaGFuZ2VUbyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCR0YXJnZXQuaGFzQ2xhc3MoXCJ1aS1mbGlwc3dpdGNoLW9uXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEZyYW1ld29yay5QbGF0Zm9ybS5Nb2JpbGUgJiYgRnJhbWV3b3JrLlBhdGNoLmlzU3VwcG9ydGVkVmNsaWNrKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NoYW5nZSgkaW5wdXQsIGNoYW5nZVRvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5lYWNoKChpbmRleDogbnVtYmVyLCBmbGlwc3dpdGNoOiBFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBfZ2V0TGFiZWxzRnJvbVN3aXRjaCgkKGZsaXBzd2l0Y2gpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5vbihcInZjbGlja1wiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCAkc3dpdGNoID0gX2dldFN3aXRjaEZyb21MYWJlbCgkKGV2ZW50LnRhcmdldCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISRzd2l0Y2gucGFyZW50KCkuaGFzQ2xhc3MoXCJ1aS1zdGF0ZS1kaXNhYmxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN3aXRjaC50cmlnZ2VyKFwiX2NoYW5nZV9mbGlwc3dpY2hcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAkdWk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55m76YyyXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGFwcGx5RG9tRXh0ZW5zaW9uKTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBqUXVlcnkgTW9iaWxlIFNsaWRlciDmi6HlvLVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICAgICAgICR1aSAgICAgICBbaW5dIOaknOe0ouWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbk9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcHBseURvbUV4dGVuc2lvbigkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgICR1aS5maW5kKFwiLnVpLXNsaWRlci1pbnB1dFwiKVxyXG4gICAgICAgICAgICAub24oXCJzbGlkZXN0b3BcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRoYW5kbGVzID0gJChldmVudC5jdXJyZW50VGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgICAgIC5wYXJlbnQoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKFwiLnVpLXNsaWRlci1oYW5kbGVcIik7XHJcbiAgICAgICAgICAgICAgICAkaGFuZGxlcy5ibHVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiAkdWk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55m76YyyXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGFwcGx5RG9tRXh0ZW5zaW9uKTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgLy8hIGlTY3JvbGwuY2xpY2sgcGF0Y2hcclxuICAgIGNvbnN0IHBhdGNoX0lTY3JvbGxfdXRpbHNfY2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0OiBhbnkgPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgY29uc3QgZTogYW55ID0gZXZlbnQ7XHJcbiAgICAgICAgbGV0IGV2OiBNb3VzZUV2ZW50O1xyXG5cclxuICAgICAgICAvLyBbQ0RQIG1vZGlmaWVkXTogc2V0IHRhcmdldC5jbGllbnRYLlxyXG4gICAgICAgIGlmIChudWxsID09IHRhcmdldC5jbGllbnRYIHx8IG51bGwgPT0gdGFyZ2V0LmNsaWVudFkpIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gZS5wYWdlWCAmJiBudWxsICE9IGUucGFnZVkpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGllbnRYID0gZS5wYWdlWDtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGllbnRZID0gZS5wYWdlWTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGllbnRYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGllbnRZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCEoLyhTRUxFQ1R8SU5QVVR8VEVYVEFSRUEpL2kpLnRlc3QodGFyZ2V0LnRhZ05hbWUpKSB7XHJcbiAgICAgICAgICAgIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJNb3VzZUV2ZW50c1wiKTtcclxuICAgICAgICAgICAgZXYuaW5pdE1vdXNlRXZlbnQoXCJjbGlja1wiLCB0cnVlLCB0cnVlLCBlLnZpZXcsIDEsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuc2NyZWVuWCwgdGFyZ2V0LnNjcmVlblksIHRhcmdldC5jbGllbnRYLCB0YXJnZXQuY2xpZW50WSxcclxuICAgICAgICAgICAgICAgIGUuY3RybEtleSwgZS5hbHRLZXksIGUuc2hpZnRLZXksIGUubWV0YUtleSxcclxuICAgICAgICAgICAgICAgIDAsIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgKDxhbnk+ZXYpLl9jb25zdHJ1Y3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBzX2FwcGxpZWQgPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIGlTY3JvbGwgUGF0Y2gg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlQYXRjaCgkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGlmICghc19hcHBsaWVkICYmIGdsb2JhbC5JU2Nyb2xsICYmIGdsb2JhbC5JU2Nyb2xsLnV0aWxzKSB7XHJcbiAgICAgICAgICAgIGdsb2JhbC5JU2Nyb2xsLnV0aWxzLmNsaWNrID0gcGF0Y2hfSVNjcm9sbF91dGlsc19jbGljaztcclxuICAgICAgICAgICAgc19hcHBsaWVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlQYXRjaCk7XHJcbn1cclxuIiwiZGVjbGFyZSBtb2R1bGUgXCJjZHAudWkuanFtXCIge1xyXG4gICAgY29uc3QgVUk6IHR5cGVvZiBDRFAuVUk7XHJcbiAgICBleHBvcnQgPSBVSTtcclxufVxyXG4iXX0=