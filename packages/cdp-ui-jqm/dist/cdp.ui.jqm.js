/*!
 * cdp.ui.jqm.js 2.1.0
 *
 * Date: 2018-01-09T03:20:50.449Z
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
        var Theme = /** @class */ (function () {
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
            var jqmChangePage = $.mobile.changePage.bind($.mobile);
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
        var ExtensionManager = /** @class */ (function () {
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
            var StyleBuilderDefault = /** @class */ (function () {
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
        var Dialog = /** @class */ (function () {
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
        var DialogPrompt = /** @class */ (function (_super) {
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
        var BaseHeaderView = /** @class */ (function (_super) {
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
        var BasePage = /** @class */ (function (_super) {
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
         * @class PageView
         * @brief CDP.Framework.Page と Backbone.View の両方の機能を提供するページの基底クラス
         */
        var PageView = /** @class */ (function (_super) {
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
                this.trigger("pageview:orientation-changed" /* ORIENTATION_CHANGED */, newOrientation);
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
                this.trigger("pageview:initialize" /* INITIALZSE */, event);
            };
            /**
             * jQM event: "pagebeforecreate" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageView.prototype.onPageBeforeCreate = function (event) {
                this.setElement(this.$page, true);
                this.trigger("pageview:before-create" /* PAGE_BEFORE_CREATE */, event);
            };
            /**
             * jQM event: "pagecreate" (旧:"pageinit") に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageView.prototype.onPageInit = function (event) {
                this.trigger("pageview:page-init" /* PAGE_INIT */, event);
            };
            /**
             * jQM event: "pagebeforeshow" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            PageView.prototype.onPageBeforeShow = function (event, data) {
                this.trigger("pageview:before-show" /* PAGE_BEFORE_SHOW */, event, data);
            };
            /**
             * jQM event: "pagecontainershow" (旧:"pageshow") に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            PageView.prototype.onPageShow = function (event, data) {
                this.trigger("pageview:show" /* PAGE_SHOW */, event, data);
            };
            /**
             * jQM event: "pagebeforehide" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            PageView.prototype.onPageBeforeHide = function (event, data) {
                this.trigger("pageview:before-hide" /* PAGE_BEFORE_HIDE */, event, data);
            };
            /**
             * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            PageView.prototype.onPageHide = function (event, data) {
                this.trigger("pageview:hide" /* PAGE_HIDE */, event, data);
            };
            /**
             * jQM event: "pageremove" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageView.prototype.onPageRemove = function (event) {
                this.trigger("pageview:remove" /* PAGE_REMOVE */, event);
                this.remove();
                this.el = null;
                this.$el = null;
            };
            return PageView;
        }(Framework.View));
        UI.PageView = PageView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));
/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Framework = CDP.Framework;
        var TAG = "[CDP.UI.PageContainerView] ";
        /**
         * @class PageContainerView
         * @brief PageView と連携可能な コンテナビュークラス
         */
        var PageContainerView = /** @class */ (function (_super) {
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
                // set event listener
                _this.listenTo(_this._owner, "pageview:orientation-changed" /* ORIENTATION_CHANGED */, _this.onOrientationChanged.bind(_this));
                _this.listenTo(_this._owner, "pageview:initialize" /* INITIALZSE */, _this.onInitialize.bind(_this));
                _this.listenTo(_this._owner, "pageview:before-create" /* PAGE_BEFORE_CREATE */, _this.onPageBeforeCreate.bind(_this));
                _this.listenTo(_this._owner, "pageview:page-init" /* PAGE_INIT */, _this.onPageInit.bind(_this));
                _this.listenTo(_this._owner, "pageview:before-show" /* PAGE_BEFORE_SHOW */, _this.onPageBeforeShow.bind(_this));
                _this.listenTo(_this._owner, "pageview:show" /* PAGE_SHOW */, _this.onPageShow.bind(_this));
                _this.listenTo(_this._owner, "pageview:before-hide" /* PAGE_BEFORE_HIDE */, _this.onPageBeforeHide.bind(_this));
                _this.listenTo(_this._owner, "pageview:hide" /* PAGE_HIDE */, _this.onPageHide.bind(_this));
                _this.listenTo(_this._owner, "pageview:remove" /* PAGE_REMOVE */, _this.onPageRemove.bind(_this));
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
            ///////////////////////////////////////////////////////////////////////
            // Handle PageView events
            /**
             * Orientation の変更を受信
             *
             * @param newOrientation {Orientation} [in] new orientation code.
             */
            PageContainerView.prototype.onOrientationChanged = function (newOrientation) {
                // Override
            };
            /**
             * 最初の OnPageInit() のときにのみコールされる
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageContainerView.prototype.onInitialize = function (event) {
                // Override
            };
            /**
             * jQM event: "pagebeforecreate" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageContainerView.prototype.onPageBeforeCreate = function (event) {
                // Override
            };
            /**
             * jQM event: "pagecreate" (旧:"pageinit") に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageContainerView.prototype.onPageInit = function (event) {
                // Override
            };
            /**
             * jQM event: "pagebeforeshow" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            PageContainerView.prototype.onPageBeforeShow = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pagecontainershow" (旧:"pageshow") に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {ShowEventData}     [in] 付加情報
             */
            PageContainerView.prototype.onPageShow = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pagebeforehide" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            PageContainerView.prototype.onPageBeforeHide = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pagecontainerhide" (旧:"pagehide") に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             * @param data  {HideEventData}     [in] 付加情報
             */
            PageContainerView.prototype.onPageHide = function (event, data) {
                // Override
            };
            /**
             * jQM event: "pageremove" に対応
             *
             * @param event {JQuery.Event} [in] イベントオブジェクト
             */
            PageContainerView.prototype.onPageRemove = function (event) {
                this.stopListening();
            };
            return PageContainerView;
        }(Framework.View));
        UI.PageContainerView = PageContainerView;
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
        //___________________________________________________________________________________________________________________//
        /**
         * @class TabHostView
         * @brief タブ切り替え機能を持つ View クラス
         */
        var TabHostView = /** @class */ (function (_super) {
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
                _this._scrollEndEventHandler = null; // tabview "scrollstop"
                _this._scrollMoveEventHandler = null; // tabview "scroll"
                _this._refreshTimerId = null; // refresh() 反映確認用
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
                _this._scrollEndEventHandler = function (event) {
                    _this.onScrollStop();
                };
                _this._scrollMoveEventHandler = function (event) {
                    _this.onScroll();
                };
                // setup tabs
                if (_this._settings.initialWidth) {
                    _this.$el.width(_this._settings.initialWidth);
                }
                if (_this._settings.initialHeight) {
                    _this.$el.height(_this._settings.initialHeight);
                }
                var initialWidth = _this._settings.initialWidth;
                var initialHeight = _this.$el.height();
                var tabContexts = _this._settings.tabContexts.slice();
                if (0 < tabContexts.length) {
                    tabContexts.forEach(function (context) {
                        /* tslint:disable:no-unused-expression */
                        new context.ctor($.extend({
                            initialHeight: initialHeight,
                        }, context.options, { host: _this, delayRegister: false }));
                        /* tslint:enable:no-unused-expression */
                    });
                }
                else {
                    // ITabView インスタンス化要求
                    _this.onTabViewSetupRequest(initialHeight);
                }
                if (_this._settings.initImmediate) {
                    _this.initializeTabViews();
                }
                // Flipsnap
                _this.setFlipsnapCondition($.extend({}, {
                    distance: initialWidth,
                }, _this._settings));
                _this.setActiveTab(_this._activeTabIndex, 0, true);
                return _this;
            }
            /**
             * 配下の TabView を初期化
             */
            TabHostView.prototype.initializeTabViews = function () {
                var _this = this;
                // ITabView に $tabHost をアサインする
                // NOTE: 現在は DOM の順序は固定
                var $tabs = this.$el.find(_Config.TABVIEW_SELECTOR);
                this._tabs.forEach(function (tabview, index) {
                    tabview.onInitialize(_this, $($tabs[index]));
                });
            };
            /**
             * 破棄のヘルパー関数
             * メンバーの破棄のタイミングを変える場合、本メソッドをコールする
             */
            TabHostView.prototype.destroy = function () {
                this.resetFlipsnapCondition();
                this._tabs.forEach(function (tabview) {
                    tabview.onDestroy();
                });
                this._tabs = [];
            };
            ///////////////////////////////////////////////////////////////////////
            // Framework methods:
            // ページの基準値を取得
            TabHostView.prototype.getBaseHeight = function () {
                return this.$el.height();
            };
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
            // Tab control methods:
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
            // タブ移動イベント
            TabHostView.prototype.onTabMoving = function (delta) {
                this.trigger(TabHostView.EVENT_TAB_MOVE, delta);
            };
            // タブ変更完了イベント
            TabHostView.prototype.onTabChanged = function (newIndex, moved) {
                if (moved) {
                    this.setActiveTab(newIndex);
                }
                this.trigger(TabHostView.EVENT_TAB_STOP, newIndex, moved);
            };
            ///////////////////////////////////////////////////////////////////////
            // Scroll control methods:
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
            // スクロールイベント
            TabHostView.prototype.onScroll = function () {
                this.trigger(TabHostView.EVENT_SCROLL_MOVE);
            };
            // スクロール完了イベント
            TabHostView.prototype.onScrollStop = function () {
                this.trigger(TabHostView.EVENT_SCROLL_STOP);
            };
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
            ///////////////////////////////////////////////////////////////////////
            // Host event hooks:
            // Orientation の変更検知
            TabHostView.prototype.onOrientationChanged = function (newOrientation) {
                var _this = this;
                _super.prototype.onOrientationChanged.call(this, newOrientation);
                this._tabs.forEach(function (tabview) {
                    tabview.onOrientationChanged(newOrientation);
                });
                if (null != this._refreshTimerId) {
                    clearTimeout(this._refreshTimerId);
                }
                if (this._flipsnap && 0 < this._tabs.length) {
                    var proc_1 = function () {
                        // リトライ
                        if (_this._flipsnap && _this._flipsnap._maxPoint !== (_this._tabs.length - 1)) {
                            _this._flipsnap.refresh();
                            _this._refreshTimerId = setTimeout(proc_1, _Config.TABHOST_REFRESH_INTERVAL);
                        }
                        else {
                            _this._refreshTimerId = null;
                        }
                    };
                    this._flipsnap.refresh();
                    this._refreshTimerId = setTimeout(proc_1, _Config.TABHOST_REFRESH_INTERVAL);
                }
            };
            // jQM event: "pagecontainershow" (旧:"pageshow") に対応
            TabHostView.prototype.onPageShow = function (event, data) {
                _super.prototype.onPageShow.call(this, event, data);
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
            // private methods:
            // flipsnap 環境設定
            TabHostView.prototype.setFlipsnapCondition = function (options) {
                this._flipsnap = UI.global.Flipsnap(_Config.TABHOST_SELECTOR, options);
                $(this._flipsnap.element).on("fstouchend", this._flipEndEventHandler.bind(this));
                $(this._flipsnap.element).on("fstouchmove", this._flipMoveEventHandler.bind(this));
            };
            // flipsnap 環境破棄
            TabHostView.prototype.resetFlipsnapCondition = function () {
                if (this._flipsnap) {
                    $(this._flipsnap.element).off("fstouchmove", this._flipMoveEventHandler.bind(this));
                    $(this._flipsnap.element).off("fstouchend", this._flipEndEventHandler.bind(this));
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
                        tabview.setScrollHandler(_this._scrollMoveEventHandler, true);
                        tabview.setScrollStopHandler(_this._scrollEndEventHandler, true);
                    }
                    else if (index === lastActiveTabIndex) {
                        tabview.setScrollHandler(_this._scrollMoveEventHandler, false);
                        tabview.setScrollStopHandler(_this._scrollEndEventHandler, false);
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
            TabHostView.EVENT_SCROLL_MOVE = "tabhost:scrollmove";
            TabHostView.EVENT_SCROLL_STOP = "tabhost:scrollstop";
            TabHostView.EVENT_TAB_MOVE = "tabhost:tabmove";
            TabHostView.EVENT_TAB_STOP = "tabhost:tavstop";
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
        var TabView = /** @class */ (function (_super) {
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
            // Implements: ITabView Events.
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
        var PageListView = /** @class */ (function (_super) {
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
        var PageExpandableListView = /** @class */ (function (_super) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVUkvanFtL1RoZW1lLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uTWFuYWdlci50cyIsImNkcDovLy9DRFAvVUkvanFtL1RvYXN0LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nQ29tbW9ucy50cyIsImNkcDovLy9DRFAvVUkvanFtL0Jhc2VIZWFkZXJWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vQmFzZVBhZ2UudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9QYWdlVmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1BhZ2VDb250YWluZXJWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vVGFiSG9zdFZpZXcudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9UYWJWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vUGFnZUxpc3RWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vUGFnZUV4cGFuZGFibGVMaXN0Vmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9SaXBwbGUudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vU3Bpbm5lci50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9GbG9hdExhYmVsLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL0ZsaXBTd2l0Y2gudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vU2xpZGVyLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL0lTY3JvbGwudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9JbnRlcmZhY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQVUsR0FBRyxDQTRPWjtBQTVPRCxXQUFVLEdBQUc7SUFBQyxNQUFFLENBNE9mO0lBNU9hLGFBQUU7UUFFWixJQUFPLE1BQU0sR0FBUyxHQUFHLENBQUMsTUFBTSxDQUFDO1FB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QUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQzlELENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQzFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFFUCxFQUFHLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztvQkFDOUIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDN0IsQ0FBQztZQUNMLENBQUMsQ0FBQztZQUVGLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztZQUV0Qjs7Ozs7ZUFLRztZQUNILG9CQUFvQixHQUFXLEVBQUUsT0FBNkI7Z0JBQzFELEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLFNBQU0sQ0FBQyxPQUFPLElBQUksU0FBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2RCxTQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcseUJBQXlCLENBQUM7b0JBQ3ZELFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUM7WUFFRCxLQUFLO1lBQ0wsbUJBQWdCLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEQsQ0FBQyxFQWpEZ0IsU0FBUyxHQUFULFlBQVMsS0FBVCxZQUFTLFFBaUR6QjtJQUFELENBQUMsRUFqRGEsRUFBRSxHQUFGLE1BQUUsS0FBRixNQUFFLFFBaURmO0FBQUQsQ0FBQyxFQWpEUyxHQUFHLEtBQUgsR0FBRyxRQWlEWiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBDb25maWcgICAgICAgPSBDRFAuQ29uZmlnO1xyXG4gICAgaW1wb3J0IEZyYW1ld29yayAgICA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlRoZW1lXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUGxhdGZvcm1UcmFuc2l0aW9uXHJcbiAgICAgKiBAYnJpZWYg44OX44Op44OD44OI44OV44Kp44O844Og44GU44Go44GuIFRyYW5zaXRpb24g44KS5qC857SNXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUGxhdGZvcm1UcmFuc2l0aW9uIHtcclxuICAgICAgICBbcGxhdGZvcm06IHN0cmluZ106IHN0cmluZzsgICAgIC8vIGV4KSBpb3M6IFwic2xpZGVcIlxyXG4gICAgICAgIGZhbGxiYWNrOiBzdHJpbmc7ICAgICAgICAgICAgICAgLy8gZmFsbGJhY2sgdHJhbnNpdGlvbiBwcm9wXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFRyYW5zaXRpb25NYXBcclxuICAgICAqIEBicmllZiDjg4jjg6njg7Pjgrjjgrfjg6fjg7Pjg57jg4Pjg5dcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUcmFuc2l0aW9uTWFwIHtcclxuICAgICAgICBbdHJhbnNpdGlvbk5hbWU6IHN0cmluZ106IFBsYXRmb3JtVHJhbnNpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgVGhlbWVJbml0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIOODiOODqeODs+OCuOOCt+ODp+ODs+ODnuODg+ODl1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRoZW1lSW5pdE9wdGlvbnMge1xyXG4gICAgICAgIHBsYXRmb3JtPzogc3RyaW5nOyAgICAgICAgICAgICAgICAgIC8vIHBsYXRmb3JtIOOCkuaMh+Wumi4gZGVmYXVsdDpcImF1dG9cIlxyXG4gICAgICAgIHJlc2VydmVTY3JvbGxiYXJSZWdpb24/OiBib29sZWFuOyAgIC8vIFBDIOODh+ODkOODg+OCsOeSsOWig+OBp+OBr+OCueOCr+ODreODvOODq+ODkOODvOOCkuihqOekui4gZGVmYXVsdDogXCJ0cnVlXCJcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFRoZW1lXHJcbiAgICAgKiBAYnJpZWYgVUkgVGhlbWUg6Kit5a6a44KS6KGM44GG44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBUaGVtZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfcGxhdGZvcm1zOiBzdHJpbmdbXSA9IFtcImlvc1wiLCBcImFuZHJvaWRcIl07XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19wYWdlVHJhbnNpdGlvbk1hcDogVHJhbnNpdGlvbk1hcCA9IHtcclxuICAgICAgICAgICAgXCJwbGF0Zm9ybS1kZWZhdWx0XCI6IHtcclxuICAgICAgICAgICAgICAgIGlvczogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgYW5kcm9pZDogXCJmbG9hdHVwXCIsXHJcbiAgICAgICAgICAgICAgICBmYWxsYmFjazogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcInBsYXRmb3JtLWFsdGVybmF0aXZlXCI6IHtcclxuICAgICAgICAgICAgICAgIGlvczogXCJzbGlkZXVwXCIsXHJcbiAgICAgICAgICAgICAgICBhbmRyb2lkOiBcImZsb2F0dXBcIixcclxuICAgICAgICAgICAgICAgIGZhbGxiYWNrOiBcInNsaWRldXBcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfZGlhbG9nVHJhbnNpdGlvbk1hcDogVHJhbnNpdGlvbk1hcCA9IHtcclxuICAgICAgICAgICAgXCJwbGF0Zm9ybS1kZWZhdWx0XCI6IHtcclxuICAgICAgICAgICAgICAgIGlvczogXCJwb3B6b29tXCIsXHJcbiAgICAgICAgICAgICAgICBhbmRyb2lkOiBcImNyb3Nzem9vbVwiLFxyXG4gICAgICAgICAgICAgICAgZmFsbGJhY2s6IFwibm9uZVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RzOlxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGVtZSDjga7liJ3mnJ/ljJZcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIOOCquODl+OCt+ODp+ODs+aMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm5zIHRydWU6IOaIkOWKnyAvIGZhbHNlOiDlpLHmlZdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGluaXRpYWxpemUob3B0aW9ucz86IFRoZW1lSW5pdE9wdGlvbnMpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBvcHQgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICAgICAgcGxhdGZvcm06IFwiYXV0b1wiLFxyXG4gICAgICAgICAgICAgICAgcmVzZXJ2ZVNjcm9sbGJhclJlZ2lvbjogdHJ1ZSxcclxuICAgICAgICAgICAgfSwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoXCJhdXRvXCIgPT09IG9wdC5wbGF0Zm9ybSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFRoZW1lLmRldGVjdFVJUGxhdGZvcm0ob3B0LnJlc2VydmVTY3JvbGxiYXJSZWdpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKFRoZW1lLnNldEN1cnJlbnRVSVBsYXRmb3JtKG9wdC5wbGF0Zm9ybSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3B0LnBsYXRmb3JtO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJzZXRDdXJyZW50VUlQbGF0Zm9ybSgpLCBmYWlsZWQuIHBsYXRmb3JtOiBcIiArIG9wdC5wbGF0Zm9ybSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOePvuWcqOaMh+WumuOBleOCjOOBpuOBhOOCiyBVSSBQbGF0Zm9ybSDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gZXgpIFwiaW9zXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldEN1cnJlbnRVSVBsYXRmb3JtKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRodG1zID0gJChcImh0bWxcIik7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gVGhlbWUuc19wbGF0Zm9ybXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGh0bXMuaGFzQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1cIiArIFRoZW1lLnNfcGxhdGZvcm1zW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBUaGVtZS5zX3BsYXRmb3Jtc1tpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVJIFBsYXRmb3JtIOOCkuioreWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSB0cnVlOiDmiJDlip8gLyBmYWxzZTog5aSx5pWXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXRDdXJyZW50VUlQbGF0Zm9ybShwbGF0Zm9ybTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHBsYXRmb3JtIHx8IFRoZW1lLnNfcGxhdGZvcm1zLmluZGV4T2YocGxhdGZvcm0pID49IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRodG1zID0gJChcImh0bWxcIik7XHJcbiAgICAgICAgICAgICAgICBUaGVtZS5zX3BsYXRmb3Jtcy5mb3JFYWNoKCh0YXJnZXQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAkaHRtcy5yZW1vdmVDbGFzcyhcInVpLXBsYXRmb3JtLVwiICsgdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBsYXRmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0bXMuYWRkQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1cIiArIHBsYXRmb3JtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnj77lnKjjga4gUGxhdGZvcm0g44KS5Yik5a6a44GX5pyA6YGp44GqIHBsYXRmb3JtIOOCkuiHquWLleaxuuWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHJlc2VydmVTY3JvbGxiYXJSZWdpb24gUEMg44OH44OQ44OD44Kw55Kw5aKD44Gn44Gv44K544Kv44Ot44O844Or44OQ44O844KS6KGo56S6LiBkZWZhdWx0OiB0cnVlXHJcbiAgICAgICAgICogQHJldHVybnMgZXgpIFwiaW9zXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRldGVjdFVJUGxhdGZvcm0ocmVzZXJ2ZVNjcm9sbGJhclJlZ2lvbjogYm9vbGVhbiA9IHRydWUpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBsZXQgcGxhdGZvcm0gPSBcIlwiO1xyXG4gICAgICAgICAgICAvLyBwbGF0Zm9ybSDjga7oqK3lrppcclxuICAgICAgICAgICAgaWYgKEZyYW1ld29yay5QbGF0Zm9ybS5pT1MpIHtcclxuICAgICAgICAgICAgICAgICQoXCJodG1sXCIpLmFkZENsYXNzKFwidWktcGxhdGZvcm0taW9zXCIpO1xyXG4gICAgICAgICAgICAgICAgcGxhdGZvcm0gPSBcImlvc1wiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcImh0bWxcIikuYWRkQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1hbmRyb2lkXCIpO1xyXG4gICAgICAgICAgICAgICAgcGxhdGZvcm0gPSBcImFuZHJvaWRcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBQQyDjg4fjg5Djg4PjgrDnkrDlooPjgafjga/jgrnjgq/jg63jg7zjg6vjg5Djg7zjgpLooajnpLpcclxuICAgICAgICAgICAgaWYgKENvbmZpZy5ERUJVRyAmJiByZXNlcnZlU2Nyb2xsYmFyUmVnaW9uICYmICFGcmFtZXdvcmsuUGxhdGZvcm0uTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJvdmVyZmxvdy15XCIsIFwic2Nyb2xsXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwbGF0Zm9ybTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBsYXRmb3JtIOOCkumFjeWIl+OBp+eZu+mMslxyXG4gICAgICAgICAqIOS4iuabuOOBjeOBleOCjOOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmdbXX0gcGxhdGZvcm1zIFtpbl0gT1MgZXgpOiBbXCJpb3NcIiwgXCJhbmRyb2lkXCJdXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWdpc3RlclVJUGxhdGZvcm1zKHBsYXRmb3Jtczogc3RyaW5nW10pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHBsYXRmb3Jtcykge1xyXG4gICAgICAgICAgICAgICAgVGhlbWUuc19wbGF0Zm9ybXMgPSBwbGF0Zm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBhZ2UgdHJhbnNpdGlvbiDjgpLnmbvpjLJcclxuICAgICAgICAgKiDkuIrmm7jjgY3jgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7VHJhbnNpdGlvbk1hcH0gbWFwIFtpbl0gVHJhbnNpdGlvbk1hcCDjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyUGFnZVRyYW5zaXRpb25NYXAobWFwOiBUcmFuc2l0aW9uTWFwKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChtYXApIHtcclxuICAgICAgICAgICAgICAgIFRoZW1lLnNfcGFnZVRyYW5zaXRpb25NYXAgPSBtYXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRpYWxvZyB0cmFuc2l0aW9uIOOCkueZu+mMslxyXG4gICAgICAgICAqIOS4iuabuOOBjeOBleOCjOOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtUcmFuc2l0aW9uTWFwfSBtYXAgW2luXSBUcmFuc2l0aW9uTWFwIOOCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJEaWFsb2dUcmFuc2l0aW9uTWFwKG1hcDogVHJhbnNpdGlvbk1hcCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICBUaGVtZS5zX2RpYWxvZ1RyYW5zaXRpb25NYXAgPSBtYXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBhZ2UgdHJhbnNpdGlvbiDjgpLlj5blvpdcclxuICAgICAgICAgKiBUcmFuc2l0aW9uTWFwIOOBq+OCouOCteOCpOODs+OBleOCjOOBpuOBhOOCi+OCguOBruOBp+OBguOCjOOBsOWkieaPm1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nW119IFwic2xpZGVcIlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcXVlcnlQYWdlVHJhbnNpdGlvbihvcmlnaW5hbDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgY29udmVydCA9IFRoZW1lLnNfcGFnZVRyYW5zaXRpb25NYXBbb3JpZ2luYWxdO1xyXG4gICAgICAgICAgICBpZiAoY29udmVydCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRbVGhlbWUuZ2V0Q3VycmVudFVJUGxhdGZvcm0oKV0gfHwgY29udmVydC5mYWxsYmFjaztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZGlhbG9nIHRyYW5zaXRpb24g44KS5Y+W5b6XXHJcbiAgICAgICAgICogVHJhbnNpdGlvbk1hcCDjgavjgqLjgrXjgqTjg7PjgZXjgozjgabjgYTjgovjgoLjga7jgafjgYLjgozjgbDlpInmj5tcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ1tdfSBcInNsaWRlXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHF1ZXJ5RGlhbG9nVHJhbnNpdGlvbihvcmlnaW5hbDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgY29udmVydCA9IFRoZW1lLnNfZGlhbG9nVHJhbnNpdGlvbk1hcFtvcmlnaW5hbF07XHJcbiAgICAgICAgICAgIGlmIChjb252ZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udmVydFtUaGVtZS5nZXRDdXJyZW50VUlQbGF0Zm9ybSgpXSB8fCBjb252ZXJ0LmZhbGxiYWNrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLy8ganF1ZXkubW9iaWxlLmNoYW5nZVBhZ2UoKSDjga4gSG9vay5cclxuICAgIGZ1bmN0aW9uIGFwcGx5Q3VzdG9tQ2hhbmdlUGFnZSgpIHtcclxuICAgICAgICBjb25zdCBqcW1DaGFuZ2VQYWdlOiAodG86IGFueSwgb3B0aW9ucz86IENoYW5nZVBhZ2VPcHRpb25zKSA9PiB2b2lkID0gJC5tb2JpbGUuY2hhbmdlUGFnZS5iaW5kKCQubW9iaWxlKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3VzdG9tQ2hhbmdlUGFnZSh0bzogYW55LCBvcHRpb25zPzogQ2hhbmdlUGFnZU9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcodG8pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRyYW5zaXRpb24gPSBUaGVtZS5xdWVyeVBhZ2VUcmFuc2l0aW9uKG9wdGlvbnMudHJhbnNpdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAganFtQ2hhbmdlUGFnZSh0bywgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLm1vYmlsZS5jaGFuZ2VQYWdlID0gY3VzdG9tQ2hhbmdlUGFnZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBmcmFtZXdvcmsg5Yid5pyf5YyW5b6M44Gr6YGp55SoXHJcbiAgICBGcmFtZXdvcmsud2FpdEZvckluaXRpYWxpemUoKVxyXG4gICAgICAgIC5kb25lKCgpID0+IHtcclxuICAgICAgICAgICAgYXBwbHlDdXN0b21DaGFuZ2VQYWdlKCk7XHJcbiAgICAgICAgfSk7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIERvbUV4dGVuc2lvbk9wdGlvbnNcclxuICAgICAqIEBicmVpZiBEb21FeHRlbnNpb24g44Gr5rih44GZ44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRG9tRXh0ZW5zaW9uT3B0aW9ucyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgRG9tRXh0ZW5zaW9uXHJcbiAgICAgKiBAYnJpZWYgRE9NIOaLoeW8temWouaVsFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdHlwZSBEb21FeHRlbnNpb24gPSAoJHRhcmdldDogSlF1ZXJ5LCBEb21FeHRlbnNpb25PcHRpb25zPzogT2JqZWN0KSA9PiBKUXVlcnk7XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBFeHRlbnNpb25NYW5hZ2VyXHJcbiAgICAgKiBAYnJpZWYg5ouh5by15qmf6IO944KS566h55CG44GZ44KL44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBFeHRlbnNpb25NYW5hZ2VyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19kb21FeHRlbnNpb25zOiBEb21FeHRlbnNpb25bXSA9IFtdO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBET00g5ouh5by16Zai5pWw44Gu55m76YyyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbn0gZnVuYyBbaW5dIERPTSDmi6HlvLXplqLmlbBcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGZ1bmM6IERvbUV4dGVuc2lvbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNfZG9tRXh0ZW5zaW9ucy5wdXNoKGZ1bmMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRE9NIOaLoeW8teOCkumBqeeUqFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9ICR1aSAgICAgICBbaW5dIOaLoeW8teWvvuixoeOBriBET01cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBhcHBseURvbUV4dGVuc2lvbigkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zX2RvbUV4dGVuc2lvbnMuZm9yRWFjaCgoZnVuYzogRG9tRXh0ZW5zaW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmdW5jKCR1aSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuVG9hc3RdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFRvYXN0XHJcbiAgICAgKiBAYnJpZWYgQW5kcm9pZCBTREsg44GuIFRvYXN0IOOCr+ODqeOCueOBruOCiOOBhuOBq+iHquWLlea2iOa7heOBmeOCi+ODoeODg+OCu+ODvOOCuOWHuuWKm+ODpuODvOODhuOCo+ODquODhuOCo1xyXG4gICAgICogICAgICAgIOWFpeOCjOWtkOOBrumWouS/guOCkuWun+ePvuOBmeOCi+OBn+OCgeOBqyBtb2R1bGUg44Gn5a6f6KOFXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBtb2R1bGUgVG9hc3Qge1xyXG5cclxuICAgICAgICAvLyDooajnpLrmmYLplpPjga7lrprnvqlcclxuICAgICAgICBleHBvcnQgbGV0IExFTkdUSF9TSE9SVCA9IDE1MDA7ICAgLy8hPCDnn63jgYQ6MTUwMCBtc2VjXHJcbiAgICAgICAgZXhwb3J0IGxldCBMRU5HVEhfTE9ORyAgPSA0MDAwOyAgIC8vITwg6ZW344GEOjQwMDAgbXNlY1xyXG5cclxuICAgICAgICAvLyEgQGVudW0g44Kq44OV44K744OD44OI44Gu5Z+65rqWXHJcbiAgICAgICAgZXhwb3J0IGVudW0gT2Zmc2V0WCB7XHJcbiAgICAgICAgICAgIExFRlQgICAgPSAweDAwMDEsXHJcbiAgICAgICAgICAgIFJJR0hUICAgPSAweDAwMDIsXHJcbiAgICAgICAgICAgIENFTlRFUiAgPSAweDAwMDQsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgQGVudW0g44Kq44OV44K744OD44OI44Gu5Z+65rqWXHJcbiAgICAgICAgZXhwb3J0IGVudW0gT2Zmc2V0WSB7XHJcbiAgICAgICAgICAgIFRPUCAgICAgPSAweDAwMTAsXHJcbiAgICAgICAgICAgIEJPVFRPTSAgPSAweDAwMjAsXHJcbiAgICAgICAgICAgIENFTlRFUiAgPSAweDAwNDAsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAaW50ZXJmYWNlIFN0eWxlQnVpbGRlclxyXG4gICAgICAgICAqIEBicmllZiAgICAg44K544K/44Kk44Or5aSJ5pu05pmC44Gr5L2/55So44GZ44KL44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgICAgICogICAgICAgICAgICBjc3Mg44Gr44K544K/44Kk44Or44KS6YCD44GM44GZ5aC05ZCI44CB54us6Ieq44GuIGNsYXNzIOOCkuioreWumuOBl+OAgWdldFN0eWxlIOOBryBudWxsIOOCkui/lOOBmeOBk+OBqOOAglxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU3R5bGVCdWlsZGVyIHtcclxuICAgICAgICAgICAgLy8hIGNsYXNzIGF0dHJpYnV0ZSDjgavoqK3lrprjgZnjgovmloflrZfliJfjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0Q2xhc3MoKTogc3RyaW5nO1xyXG4gICAgICAgICAgICAvLyEgc3R5bGUgYXR0cmlidXRlIOOBq+ioreWumuOBmeOCiyBKU09OIOOCquODluOCuOOCp+OCr+ODiOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRTdHlsZSgpOiBhbnk7XHJcbiAgICAgICAgICAgIC8vISDjgqrjg5Xjgrvjg4Pjg4jjga7ln7rmupbkvY3nva7jgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0T2Zmc2V0UG9pbnQoKTogbnVtYmVyO1xyXG4gICAgICAgICAgICAvLyEgWCDluqfmqJnjga7jgqrjg5Xjgrvjg4Pjg4jlgKTjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0T2Zmc2V0WCgpOiBudW1iZXI7XHJcbiAgICAgICAgICAgIC8vISBZIOW6p+aomeOBruOCquODleOCu+ODg+ODiOWApOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRZKCk6IG51bWJlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBjbGFzcyBTdHlsZUJ1aWxkZXJEZWZhdWx0XHJcbiAgICAgICAgICogQGJyaWVmIOOCueOCv+OCpOODq+WkieabtOaZguOBq+S9v+eUqOOBmeOCi+aXouWumuOBruani+mAoOS9k+OCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTdHlsZUJ1aWxkZXJEZWZhdWx0IGltcGxlbWVudHMgU3R5bGVCdWlsZGVyIHtcclxuXHJcbiAgICAgICAgICAgIC8vISBjbGFzcyBhdHRyaWJ1dGUg44Gr6Kit5a6a44GZ44KL5paH5a2X5YiX44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldENsYXNzKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ1aS1sb2FkZXIgdWktb3ZlcmxheS1zaGFkb3cgdWktY29ybmVyLWFsbFwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyEgc3R5bGUgYXR0cmlidXRlIOOBq+ioreWumuOBmeOCiyBKU09OIOOCquODluOCuOOCp+OCr+ODiOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRTdHlsZSgpOiBhbnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYWRkaW5nXCI6ICAgICAgICAgIFwiN3B4IDI1cHggN3B4IDI1cHhcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRpc3BsYXlcIjogICAgICAgICAgXCJibG9ja1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiMxZDFkMWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiAgICAgXCIjMWIxYjFiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiAgICAgICAgICAgIFwiI2ZmZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dC1zaGFkb3dcIjogICAgICBcIjAgMXB4IDAgIzExMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZm9udC13ZWlnaHRcIjogICAgICBcImJvbGRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9wYWNpdHlcIjogICAgICAgICAgMC44LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdHlsZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8hIOOCquODleOCu+ODg+ODiOOBruWfuua6luS9jee9ruOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRQb2ludCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9mZnNldFguQ0VOVEVSIHwgT2Zmc2V0WS5CT1RUT007XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vISBYIOW6p+aomeOBruOCquODleOCu+ODg+ODiOWApOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRYKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8hIFkg5bqn5qiZ44Gu44Kq44OV44K744OD44OI5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFkoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtNzU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRvYXN0IOihqOekulxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2UgIFtpbl0g44Oh44OD44K744O844K4XHJcbiAgICAgICAgICogQHBhcmFtIGR1cmF0aW9uIFtpbl0g6KGo56S65pmC6ZaT44KS6Kit5a6aIChtc2VjKSBkZWZhdWx0OiBMRU5HVEhfU0hPUlRcclxuICAgICAgICAgKiBAcGFyYW0gc3R5bGUgICAgW2luXSDjgrnjgr/jgqTjg6vlpInmm7TjgZnjgovloLTlkIjjgavjga/mtL7nlJ/jgq/jg6njgrnjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gc2hvdyhtZXNzYWdlOiBzdHJpbmcsIGR1cmF0aW9uOiBudW1iZXIgPSBUb2FzdC5MRU5HVEhfU0hPUlQsIHN0eWxlPzogU3R5bGVCdWlsZGVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRtb2JpbGUgPSAkLm1vYmlsZTtcclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IHN0eWxlIHx8IG5ldyBTdHlsZUJ1aWxkZXJEZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNldENTUyA9IGluZm8uZ2V0U3R5bGUoKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIOaUueihjOOCs+ODvOODieOBryA8YnIvPiDjgavnva7mj5vjgZnjgotcclxuICAgICAgICAgICAgY29uc3QgbXNnID0gbWVzc2FnZS5yZXBsYWNlKC9cXG4vZywgXCI8YnIvPlwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOODoeODg+OCu+ODvOOCuCBlbGVtZW50IOOBruWLleeahOeUn+aIkFxyXG4gICAgICAgICAgICBjb25zdCBodG1sID0gXCI8ZGl2PlwiICsgbXNnICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICAgICAgY29uc3QgYm94ID0gJChodG1sKS5hZGRDbGFzcyhpbmZvLmdldENsYXNzKCkpO1xyXG4gICAgICAgICAgICBpZiAoc2V0Q1NTKSB7XHJcbiAgICAgICAgICAgICAgICBib3guY3NzKGluZm8uZ2V0U3R5bGUoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOiHquWLleaUueihjOOBleOCjOOBpuOCguOCiOOBhOOCiOOBhuOBq+OAgeWfuueCueOCkuioreWumuOBl+OBpuOBi+OCiei/veWKoFxyXG4gICAgICAgICAgICBib3guY3NzKHtcclxuICAgICAgICAgICAgICAgIFwidG9wXCI6IDAsXHJcbiAgICAgICAgICAgICAgICBcImxlZnRcIjogMCxcclxuICAgICAgICAgICAgfSkuYXBwZW5kVG8oJG1vYmlsZS5wYWdlQ29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOmFjee9ruS9jee9ruOBruaxuuWumlxyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXRQb2ludCA9IGluZm8uZ2V0T2Zmc2V0UG9pbnQoKTtcclxuICAgICAgICAgICAgY29uc3QgJHdpbmRvdyA9ICQod2luZG93KTtcclxuICAgICAgICAgICAgbGV0IHBvc1gsIHBvc1k7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBib3hfd2lkdGggPSBib3gud2lkdGgoKSArIHBhcnNlSW50KGJveC5jc3MoXCJwYWRkaW5nLWxlZnRcIiksIDEwKSArIHBhcnNlSW50KGJveC5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIpLCAxMCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJveF9oZWlnaHQgPSBib3guaGVpZ2h0KCkgKyBwYXJzZUludChib3guY3NzKFwicGFkZGluZy10b3BcIiksIDEwKSArIHBhcnNlSW50KGJveC5jc3MoXCJwYWRkaW5nLWJvdHRvbVwiKSwgMTApO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChvZmZzZXRQb2ludCAmIDB4MDAwRikge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRYLkxFRlQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWCA9IDAgKyBpbmZvLmdldE9mZnNldFgoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgT2Zmc2V0WC5SSUdIVDpcclxuICAgICAgICAgICAgICAgICAgICBwb3NYID0gJHdpbmRvdy53aWR0aCgpIC0gYm94X3dpZHRoICsgaW5mby5nZXRPZmZzZXRYKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFguQ0VOVEVSOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSAoJHdpbmRvdy53aWR0aCgpIC8gMikgLSAoYm94X3dpZHRoIC8gMikgKyBpbmZvLmdldE9mZnNldFgoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwid2Fybi4gdW5rbm93biBvZmZzZXRQb2ludDpcIiArIChvZmZzZXRQb2ludCAmIDB4MDAwRikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSAoJHdpbmRvdy53aWR0aCgpIC8gMikgLSAoYm94X3dpZHRoIC8gMikgKyBpbmZvLmdldE9mZnNldFgoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChvZmZzZXRQb2ludCAmIDB4MDBGMCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRZLlRPUDpcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gMCArIGluZm8uZ2V0T2Zmc2V0WSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRZLkJPVFRPTTpcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gJHdpbmRvdy5oZWlnaHQoKSAtIGJveF9oZWlnaHQgKyBpbmZvLmdldE9mZnNldFkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgT2Zmc2V0WS5DRU5URVI6XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWSA9ICgkd2luZG93LmhlaWdodCgpIC8gMikgLSAoYm94X2hlaWdodCAvIDIpICsgaW5mby5nZXRPZmZzZXRZKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcIndhcm4uIHVua25vd24gb2Zmc2V0UG9pbnQ6XCIgKyAob2Zmc2V0UG9pbnQgJiAweDAwRjApKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gKCR3aW5kb3cuaGVpZ2h0KCkgLyAyKSAtIChib3hfaGVpZ2h0IC8gMikgKyBpbmZvLmdldE9mZnNldFkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g6KGo56S6XHJcbiAgICAgICAgICAgIGJveC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgXCJ0b3BcIjogcG9zWSxcclxuICAgICAgICAgICAgICAgIFwibGVmdFwiOiBwb3NYLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZGVsYXkoZHVyYXRpb24pXHJcbiAgICAgICAgICAgIC5mYWRlT3V0KDQwMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBQcm9taXNlICAgICAgPSBDRFAuUHJvbWlzZTtcclxuICAgIGltcG9ydCBGcmFtZXdvcmsgICAgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5EaWFsb2ddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSC9XIEJhY2sgS2V5IEhvb2sg6Zai5pWwXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB0eXBlIERpYWxvZ0JhY2tLZXlIYW5kbGVyID0gKGV2ZW50PzogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBEaWFsb2dPcHRpb25zXHJcbiAgICAgKiAgICAgICAgICAgIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs+OCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERpYWxvZ09wdGlvbnMgZXh0ZW5kcyBQb3B1cE9wdGlvbnMge1xyXG4gICAgICAgIHNyYz86IHN0cmluZzsgICAgICAgICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSB0ZW1wbGF0ZSDjg5XjgqHjgqTjg6vjga7jg5HjgrkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgICAgICB0aXRsZT86IHN0cmluZzsgICAgICAgICAgICAgICAgIC8vITwge1N0cmluZ30g44OA44Kk44Ki44Ot44Kw44K/44Kk44OI44OrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgICAgICBtZXNzYWdlPzogc3RyaW5nOyAgICAgICAgICAgICAgIC8vITwge1N0cmluZ30g44Oh44Kk44Oz44Oh44OD44K744O844K4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxyXG4gICAgICAgIGlkUG9zaXRpdmU/OiBzdHJpbmc7ICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSBQb3NpdGl2ZSDjg5zjgr/jg7Pjga5JRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcImRsZy1idG4tcG9zaXRpdmVcIlxyXG4gICAgICAgIGlkTmVnYXRpdmU/OiBzdHJpbmc7ICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSBOYWdhdGl2ZSDjg5zjgr/jg7Pjga5JRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcImRsZy1idG4tbmVnYXRpdmVcIlxyXG4gICAgICAgIGV2ZW50Pzogc3RyaW5nOyAgICAgICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSBEaWFsb2cg44Kv44Op44K544GM566h55CG44GZ44KL44Kk44OZ44Oz44OIICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwidmNsaWNrXCJcclxuICAgICAgICBkZWZhdWx0QXV0b0Nsb3NlPzogYm9vbGVhbjsgICAgIC8vITwge0Jvb2xlYW59IGRhdGEtYXV0by1jbG9zZSDjgYzmjIflrprjgZXjgozjgabjgYTjgarjgYTloLTlkIjjga7ml6LlrprlgKQgICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgIGZvcmNlT3ZlcndyaXRlQWZ0ZXJDbG9zZT86IGJvb2xlYW47IC8vITwge0Jvb2xlYW59IGFmdGVyY2xvc2Ug44Kq44OX44K344On44Oz44KS5by35Yi25LiK5pu444GN44GZ44KL44Gf44KB44Gu6Kit5a6aICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgbGFiZWxQb3NpdGl2ZT86IHN0cmluZzsgICAgICAgICAvLyE8IHtTdHJpbmd9IFBvc2l0aXZlIOODnOOCv+ODs+ODqeODmeODqyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJPS1wiXHJcbiAgICAgICAgbGFiZWxOZWdhdGl2ZT86IHN0cmluZzsgICAgICAgICAvLyE8IHtTdHJpbmd9IE5lZ2F0aXZlIOODnOOCv+ODs+ODqeODmeODqyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJDYW5jZWxcIlxyXG4gICAgICAgIGJhY2tLZXk/OiBcImNsb3NlXCIgfCBcImRlbnlcIiB8IERpYWxvZ0JhY2tLZXlIYW5kbGVyOyAgLy8hPCBIL1cgYmFja0tleSDjga7mjK/jgovoiJ7jgYQgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiY2xvc2VcIlxyXG4gICAgICAgIHNjcm9sbEV2ZW50PzogXCJkZW55XCIgfCBcImFsbG93XCIgfCBcImFkanVzdFwiOyAgIC8vITwge1N0cmluZ30gc2Nyb2xs44Gu5oqR5q2i5pa55byPICAo4oC7IGFkanVzdCDjga/oqabpqJPnmoQpICAgICBkZWZhdWx0OiBcImRlbnlcIlxyXG4gICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zOyAgIC8vITwgRE9N5ouh5by144Kq44OX44K344On44OzLiBudWxsfHVuZGVmaW5lZCDjgafmi6HlvLXjgZfjgarjgYQgICAgICBkZWZhdWx0OiB7fVxyXG4gICAgICAgIFt4OiBzdHJpbmddOiBhbnk7ICAgICAgICAgICAgICAgLy8hPCBhbnkgZGlhbG9nIHRlbXBsYXRlIHBhcmFtZXRlcnMuXHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBEaWFsb2dcclxuICAgICAqIEBicmllZiDmsY7nlKjjg4DjgqTjgqLjg63jgrDjgq/jg6njgrlcclxuICAgICAqICAgICAgICBqUU0g44GuIHBvcHVwIHdpZGdldCDjgavjgojjgaPjgablrp/oo4VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIERpYWxvZyB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3RlbXBsYXRlOiBUb29scy5KU1QgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX3NldHRpbmdzOiBEaWFsb2dPcHRpb25zID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF8kZGlhbG9nOiBKUXVlcnkgPSBudWxsO1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX2FjdGl2ZURpYWxvZzogRGlhbG9nID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX29sZEJhY2tLZXlIYW5kbGVyOiAoZXZlbnQ/OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfZGVmYXVsdE9wdGlvbnM6IERpYWxvZ09wdGlvbnMgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGlkICAgICAge1N0cmluZ30gICAgICAgIFtpbl0g44OA44Kk44Ki44Ot44KwIERPTSBJRCDjgpLmjIflrpogZXgpICNkaWFsb2ctaG9nZVxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtEaWFsb2dPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIC8vIERpYWxvZyDlhbHpgJroqK3lrprjga7liJ3mnJ/ljJZcclxuICAgICAgICAgICAgRGlhbG9nLmluaXRDb21tb25Db25kaXRpb24oKTtcclxuICAgICAgICAgICAgLy8g6Kit5a6a44KS5pu05pawXHJcbiAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQoe30sIERpYWxvZy5zX2RlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgLy8g44OA44Kk44Ki44Ot44Kw44OG44Oz44OX44Os44O844OI44KS5L2c5oiQXHJcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gVG9vbHMuVGVtcGxhdGUuZ2V0SlNUKGlkLCB0aGlzLl9zZXR0aW5ncy5zcmMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDooajnpLpcclxuICAgICAgICAgKiDooajnpLrjgpLjgZfjgablp4vjgoHjgaYgRE9NIOOBjOacieWKueOBq+OBquOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0RpYWxvZ09wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzIChzcmMg44Gv54Sh6KaW44GV44KM44KLKVxyXG4gICAgICAgICAqIEByZXR1cm4g44OA44Kk44Ki44Ot44Kw44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc2hvdyhvcHRpb25zPzogRGlhbG9nT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xyXG4gICAgICAgICAgICBjb25zdCAkYm9keSA9ICQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICBjb25zdCAkcGFnZSA9ICg8YW55PiRib2R5KS5wYWdlY29udGFpbmVyKFwiZ2V0QWN0aXZlUGFnZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9mY0hpZGRlbiA9IHtcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3dcIjogICAgIFwiaGlkZGVuXCIsXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXhcIjogICBcImhpZGRlblwiLFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvdy15XCI6ICAgXCJoaWRkZW5cIixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3Qgb2ZjQm9keSA9IHsgLy8gYm9keSBvdmVyZmxvdyBjb250ZXh0XHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93XCI6ICAgICAkYm9keS5jc3MoXCJvdmVyZmxvd1wiKSxcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteFwiOiAgICRib2R5LmNzcyhcIm92ZXJmbG93LXhcIiksXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXlcIjogICAkYm9keS5jc3MoXCJvdmVyZmxvdy15XCIpLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRTY3JvbGxQb3MgPSAkYm9keS5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgY29uc3Qgb2ZjUGFnZSA9IHsgLy8gcGFnZSBvdmVyZmxvdyBjb250ZXh0XHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93XCI6ICAgICAkcGFnZS5jc3MoXCJvdmVyZmxvd1wiKSxcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteFwiOiAgICRwYWdlLmNzcyhcIm92ZXJmbG93LXhcIiksXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXlcIjogICAkcGFnZS5jc3MoXCJvdmVyZmxvdy15XCIpLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsRXZlbnQgPSBcInNjcm9sbCB0b3VjaG1vdmUgbW91c2Vtb3ZlIE1TUG9pbnRlck1vdmVcIjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbEhhbmRlciA9IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJkZW55XCIgPT09IHRoaXMuX3NldHRpbmdzLnNjcm9sbEV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJhZGp1c3RcIiA9PT0gdGhpcy5fc2V0dGluZ3Muc2Nyb2xsRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkYm9keS5zY3JvbGxUb3AocGFyZW50U2Nyb2xsUG9zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIG9wdGlvbiDjgYzmjIflrprjgZXjgozjgabjgYTjgZ/loLTlkIjmm7TmlrBcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gb3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5fc2V0dGluZ3MsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBhZnRlcmNsb3NlIOWHpueQhuOBryBEaWFsb2cg44Gu56C05qOE5Yem55CG44KS5a6f6KOF44GZ44KL44Gf44KB5Z+65pys55qE44Gr6Kit5a6a56aB5q2iICjlvLfliLbkuIrmm7jjgY3jg6Ljg7zjg4njgpLoqK3lrprkvb/nlKjlj68pXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5hZnRlcmNsb3NlICYmICF0aGlzLl9zZXR0aW5ncy5mb3JjZU92ZXJ3cml0ZUFmdGVyQ2xvc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImNhbm5vdCBhY2NlcHQgJ2FmdGVyY2xvc2UnIG9wdGlvbi4gcGxlYXNlIGluc3RlYWQgdXNpbmcgJ3BvcHVwYWZ0ZXJjbG9zZScgZXZlbnQuXCIpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3NldHRpbmdzLmFmdGVyY2xvc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHRpdGxlIOOBruacieeEoVxyXG4gICAgICAgICAgICAoPGFueT50aGlzLl9zZXR0aW5ncykuX3RpdGxlU3RhdGUgPSB0aGlzLl9zZXR0aW5ncy50aXRsZSA/IFwidWktaGFzLXRpdGxlXCIgOiBcInVpLW5vLXRpdGxlXCI7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB0ZW1wbGF0ZSDjgYvjgokgalF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiOOCkuS9nOaIkOOBl+OAgVxyXG4gICAgICAgICAgICAgKiA8Ym9keT4g55u05LiL44Gr6L+95YqgLlxyXG4gICAgICAgICAgICAgKiAkcGFnZSDjgafjga8gQmFja2JvbmUgZXZlbnQg44KS5Y+X44GR44KJ44KM44Gq44GE44GT44Go44Gr5rOo5oSPXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLl8kZGlhbG9nID0gJCh0aGlzLl90ZW1wbGF0ZSh0aGlzLl9zZXR0aW5ncykpO1xyXG4gICAgICAgICAgICB0aGlzLl8kZGlhbG9nLmxvY2FsaXplKCk7XHJcbiAgICAgICAgICAgICRib2R5LmFwcGVuZCh0aGlzLl8kZGlhbG9nKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRoZW1lIOOCkuino+axulxyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVUaGVtZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fJGRpYWxvZ1xyXG4gICAgICAgICAgICAgICAgLm9uKFwicG9wdXBjcmVhdGVcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDjgrnjgq/jg63jg7zjg6vjgpLmipHmraJcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJhbGxvd1wiICE9PSB0aGlzLl9zZXR0aW5ncy5zY3JvbGxFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oc2Nyb2xsRXZlbnQsIHNjcm9sbEhhbmRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICRib2R5LmNzcyhvZmNIaWRkZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICRwYWdlLmNzcyhvZmNIaWRkZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIERpYWxvZy5yZWdpc3Rlcih0aGlzKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZW5oYW5jZVdpdGhpbigpO1xyXG5cclxuICAgICAgICAgICAgLy8gRE9NIOaLoeW8tVxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9zZXR0aW5ncy5kb21FeHRlbnNpb25PcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBFeHRlbnNpb25NYW5hZ2VyLmFwcGx5RG9tRXh0ZW5zaW9uKHRoaXMuXyRkaWFsb2csIHRoaXMuX3NldHRpbmdzLmRvbUV4dGVuc2lvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uQmVmb3JlU2hvdygpXHJcbiAgICAgICAgICAgICAgICAuZG9uZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6KGo56S6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAucG9wdXAoJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG86IFwid2luZG93XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZnRlcmNsb3NlOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCwgdWk6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOOCueOCr+ODreODvOODq+eKtuaFi+OCkuaIu+OBmVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwYWdlLmNzcyhvZmNQYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYm9keS5jc3Mob2ZjQm9keSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFwiYWxsb3dcIiAhPT0gdGhpcy5fc2V0dGluZ3Muc2Nyb2xsRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZihzY3JvbGxFdmVudCwgc2Nyb2xsSGFuZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGlhbG9nLnJlZ2lzdGVyKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLl9zZXR0aW5ncykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wb3B1cChcIm9wZW5cIikub24odGhpcy5fc2V0dGluZ3MuZXZlbnQsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImRhdGEtYXV0by1jbG9zZT0nZmFsc2UnXCIg44GM5oyH5a6a44GV44KM44Gm44GE44KL6KaB57Sg44GvIGRpYWxvZyDjgpLplonjgZjjgarjgYRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhdXRvQ2xvc2UgPSAkKGV2ZW50LnRhcmdldCkuYXR0cihcImRhdGEtYXV0by1jbG9zZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudWxsID09IGF1dG9DbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9DbG9zZSA9IHRoaXMuX3NldHRpbmdzLmRlZmF1bHRBdXRvQ2xvc2UgPyBcInRydWVcIiA6IFwiZmFsc2VcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcImZhbHNlXCIgPT09IGF1dG9DbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiRGlhbG9nLnNob3coKSBmYWlsZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl8kZGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cudHJpZ2dlcihcImVycm9yXCIsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kZGlhbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog57WC5LqGXHJcbiAgICAgICAgICog5Z+65pys55qE44Gr44Gv6Ieq5YuV44Gn6ZaJ44GY44KL44GM44CBXHJcbiAgICAgICAgICog6KGo56S65Lit44Gu44OA44Kk44Ki44Ot44Kw44KS44Kv44Op44Kk44Ki44Oz44OI5YG044GL44KJ6ZaJ44GY44KL44Oh44K944OD44OJXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNsb3NlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fJGRpYWxvZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZy5wb3B1cChcImNsb3NlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OA44Kk44Ki44Ot44KwIGVsZW1lbnQg44KS5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIGdldCAkZWwoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRkaWFsb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByb3RlY3RlZCBtZXRob2RzOiBPdmVycmlkZVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg4DjgqTjgqLjg63jgrDooajnpLrjga7nm7TliY1cclxuICAgICAgICAgKiBET00g44KS5pON5L2c44Gn44GN44KL44K/44Kk44Of44Oz44Kw44Gn5ZG844Gz5Ye644GV44KM44KLLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7SVByb21pc2VCYXNlfSBwcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3RlY3RlZCBvbkJlZm9yZVNob3coKTogSVByb21pc2VCYXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44OA44Kk44Ki44Ot44Kw44Gu5L2/55So44GZ44KLIFRoZW1lIOOCkuino+axulxyXG4gICAgICAgICAqIOS4jeimgeOBquWgtOWQiOOBr+OCquODvOODkOODvOODqeOCpOODieOBmeOCi+OBk+OBqOOCguWPr+iDvVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3RlY3RlZCByZXNvbHZlVGhlbWUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5VGhlbWUgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkKFwiLnVpLXBhZ2UtYWN0aXZlXCIpLmpxbURhdGEoXCJ0aGVtZVwiKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYW5kaWRhdGVUaGVtZTogc3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9zZXR0aW5ncy50aGVtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tVGhlbWUgPSB0aGlzLl8kZGlhbG9nLmpxbURhdGEoXCJ0aGVtZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmICghZG9tVGhlbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXR0aW5ncy50aGVtZSA9IGNhbmRpZGF0ZVRoZW1lID0gcXVlcnlUaGVtZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3NldHRpbmdzLm92ZXJsYXlUaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tT3ZlcmxheVRoZW1lID0gdGhpcy5fJGRpYWxvZy5qcW1EYXRhKFwib3ZlcmxheS10aGVtZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmICghZG9tT3ZlcmxheVRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3Mub3ZlcmxheVRoZW1lID0gY2FuZGlkYXRlVGhlbWUgfHwgcXVlcnlUaGVtZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyB0cmFuc2l0aW9uIOOBruabtOaWsFxyXG4gICAgICAgICAgICB0aGlzLl9zZXR0aW5ncy50cmFuc2l0aW9uID0gVGhlbWUucXVlcnlEaWFsb2dUcmFuc2l0aW9uKHRoaXMuX3NldHRpbmdzLnRyYW5zaXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGlhbG9nIOOBruaXouWumuOCquODl+OCt+ODp+ODs+OCkuabtOaWsFxyXG4gICAgICAgICAqIOOBmeOBueOBpuOBriBEaWFsb2cg44GM5L2/55So44GZ44KL5YWx6YCa6Kit5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7RGlhbG9nT3B0aW9uc30gW2luXSDjg4DjgqTjgqLjg63jgrDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNldERlZmF1bHRPcHRpb25zKG9wdGlvbnM6IERpYWxvZ09wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gRGlhbG9nIOWFsemAmuioreWumuOBruWIneacn+WMllxyXG4gICAgICAgICAgICBEaWFsb2cuaW5pdENvbW1vbkNvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBEaWFsb2cuc19kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyDnj77lnKggYWN0aXZlIOOBquODgOOCpOOCouODreOCsOOBqOOBl+OBpueZu+mMsuOBmeOCi1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHJlZ2lzdGVyKGRpYWxvZzogRGlhbG9nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IGRpYWxvZyAmJiBudWxsICE9IERpYWxvZy5zX2FjdGl2ZURpYWxvZykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwibmV3IGRpYWxvZyBwcm9jIGlzIGNhbGxlZCBpbiB0aGUgcGFzdCBkaWFsb2cncyBvbmUuIHVzZSBzZXRUaW1lb3V0KCkgZm9yIHBvc3QgcHJvY2Vzcy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRGlhbG9nLnNfYWN0aXZlRGlhbG9nID0gZGlhbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGlhbG9nIOWFsemAmuioreWumuOBruWIneacn+WMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGluaXRDb21tb25Db25kaXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIEZyYW1ld29yayDjga7liJ3mnJ/ljJblvozjgavlh6bnkIbjgZnjgovlv4XopoHjgYzjgYLjgotcclxuICAgICAgICAgICAgaWYgKCFGcmFtZXdvcmsuaXNJbml0aWFsaXplZCgpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJpbml0Q29tbW9uQ29uZGl0aW9uKCkgc2hvdWxkIGJlIGNhbGxlZCBhZnRlciBGcmFtZXdvcmsuaW5pdGlhbGl6ZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBEaWFsb2cuc19vbGRCYWNrS2V5SGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgLy8gQmFjayBCdXR0b24gSGFuZGxlclxyXG4gICAgICAgICAgICAgICAgRGlhbG9nLnNfb2xkQmFja0tleUhhbmRsZXIgPSBDRFAuc2V0QmFja0J1dHRvbkhhbmRsZXIobnVsbCk7XHJcbiAgICAgICAgICAgICAgICBDRFAuc2V0QmFja0J1dHRvbkhhbmRsZXIoRGlhbG9nLmN1c3RvbUJhY2tLZXlIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDml6Llrprjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgICAgICAgIERpYWxvZy5zX2RlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkUG9zaXRpdmU6ICAgICAgICAgICAgIFwiZGxnLWJ0bi1wb3NpdGl2ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkTmVnYXRpdmU6ICAgICAgICAgICAgIFwiZGxnLWJ0bi1uZWdhdGl2ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiAgICAgICAgICAgICAgICAgIEZyYW1ld29yay5nZXREZWZhdWx0Q2xpY2tFdmVudCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc21pc3NpYmxlOiAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRBdXRvQ2xvc2U6ICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgICAgIFwicGxhdGZvcm0tZGVmYXVsdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsUG9zaXRpdmU6ICAgICAgICAgIFwiT0tcIixcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbE5lZ2F0aXZlOiAgICAgICAgICBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tLZXk6ICAgICAgICAgICAgICAgIFwiY2xvc2VcIixcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxFdmVudDogICAgICAgICAgICBcImRlbnlcIixcclxuICAgICAgICAgICAgICAgICAgICBkb21FeHRlbnNpb25PcHRpb25zOiAgICB7fSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEgvVyBCYWNrIEJ1dHRvbiBIYW5kbGVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tQmFja0tleUhhbmRsZXIoZXZlbnQ/OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gRGlhbG9nLnNfYWN0aXZlRGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJjbG9zZVwiID09PSBEaWFsb2cuc19hY3RpdmVEaWFsb2cuX3NldHRpbmdzLmJhY2tLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBEaWFsb2cuc19hY3RpdmVEaWFsb2cuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJmdW5jdGlvblwiID09PSB0eXBlb2YgRGlhbG9nLnNfYWN0aXZlRGlhbG9nLl9zZXR0aW5ncy5iYWNrS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxEaWFsb2dCYWNrS2V5SGFuZGxlcj5EaWFsb2cuc19hY3RpdmVEaWFsb2cuX3NldHRpbmdzLmJhY2tLZXkpKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gRGlhbG9nIOOBjCBhY3RpdmUg44Gq5aC05ZCI44CB5bi444Gr5pei5a6a44Gu44OP44Oz44OJ44Op44Gr44Gv5rih44GV44Gq44GEXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRGlhbG9nLnNfb2xkQmFja0tleUhhbmRsZXIoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5EaWFsb2dDb21tb25zXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFsZXJ0XHJcbiAgICAgKiBhbGVydCDjg6Hjg4Pjgrvjg7zjgrjooajnpLpcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgIFtpbl0g6KGo56S65paH5a2X5YiXXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnNdIFtpbl0g44OA44Kk44Ki44Ot44Kw44Kq44OX44K344On44OzXHJcbiAgICAgKiBAcmV0dXJuIHtqUXVlcnl9IOODgOOCpOOCouODreOCsOOBriBET00g44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBhbGVydChtZXNzYWdlOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dPcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGBcclxuICAgICAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ1aS1tb2RhbFwiIGRhdGEtcm9sZT1cInBvcHVwXCIgZGF0YS1jb3JuZXJzPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3M9XCJ1aS10aXRsZSB7e190aXRsZVN0YXRlfX1cIj57e3RpdGxlfX08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInVpLW1lc3NhZ2VcIj57e21lc3NhZ2V9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktbW9kYWwtZm9vdGVyIHVpLWdyaWQtc29sb1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwie3tpZFBvc2l0aXZlfX1cIiBjbGFzcz1cInVpLWJ0biB1aS1ibG9jay1hIHVpLXRleHQtZW1waGFzaXNcIiBkYXRhLWF1dG8tY2xvc2U9XCJ0cnVlXCI+e3tsYWJlbFBvc2l0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICAgICAgPC9zY3JpcHQ+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY29uc3QgZGxnQWxlcnQgPSBuZXcgRGlhbG9nKHRlbXBsYXRlLCAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBzcmM6IG51bGwsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgfSwgb3B0aW9ucykpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGxnQWxlcnQuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uZmlybVxyXG4gICAgICog56K66KqN44Oh44OD44K744O844K46KGo56S6XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgICBbaW5dIOihqOekuuaWh+Wtl+WIl1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zXSBbaW5dIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHJldHVybiB7alF1ZXJ5fSDjg4DjgqTjgqLjg63jgrDjga4gRE9NIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gY29uZmlybShtZXNzYWdlOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dPcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGBcclxuICAgICAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ1aS1tb2RhbFwiIGRhdGEtcm9sZT1cInBvcHVwXCIgZGF0YS1jb3JuZXJzPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3M9XCJ1aS10aXRsZSB7e190aXRsZVN0YXRlfX1cIj57e3RpdGxlfX08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInVpLW1lc3NhZ2VcIj57e21lc3NhZ2V9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktbW9kYWwtZm9vdGVyIHVpLWdyaWQtYVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwie3tpZE5lZ2F0aXZlfX1cIiBjbGFzcz1cInVpLWJ0biB1aS1ibG9jay1hXCIgZGF0YS1hdXRvLWNsb3NlPVwidHJ1ZVwiPnt7bGFiZWxOZWdhdGl2ZX19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkUG9zaXRpdmV9fVwiIGNsYXNzPVwidWktYnRuIHVpLWJsb2NrLWIgdWktdGV4dC1lbXBoYXNpc1wiIGRhdGEtYXV0by1jbG9zZT1cInRydWVcIj57e2xhYmVsUG9zaXRpdmV9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjb25zdCBkbGdDb25maXJtID0gbmV3IERpYWxvZyh0ZW1wbGF0ZSwgJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgc3JjOiBudWxsLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgIH0sIG9wdGlvbnMpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRsZ0NvbmZpcm0uc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBEaWFsb2dDb21tb25zT3B0aW9uc1xyXG4gICAgICogQGJyaWVmIHByb21wdCDjga7jgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEaWFsb2dQcm9tcHRPcHRpb25zIGV4dGVuZHMgRGlhbG9nT3B0aW9ucyB7XHJcbiAgICAgICAgZXZlbnRPSz86IHN0cmluZzsgLy8hPCBPSyDjg5zjgr/jg7PmirzkuIvmmYLjga4gZXZlbnQ6IGRlZmF1bHQ6IHByb21wdG9rXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgRGlhbG9nUHJvbXB0XHJcbiAgICAgKiBAYnJpZWYgcHJvbXB0IOODgOOCpOOCouODreOCsCAo6Z2e5YWs6ZaLKVxyXG4gICAgICovXHJcbiAgICBjbGFzcyBEaWFsb2dQcm9tcHQgZXh0ZW5kcyBEaWFsb2cge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9ldmVudE9LOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBvcHRpb25zPzogRGlhbG9nUHJvbXB0T3B0aW9ucykge1xyXG4gICAgICAgICAgICBzdXBlcihpZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50T0sgPSBvcHRpb25zLmV2ZW50T0sgfHwgXCJwcm9tcHRva1wiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODgOOCpOOCouODreOCsOihqOekuuOBruebtOWJjVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkJlZm9yZVNob3coKTogSVByb21pc2VCYXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgY29uc3Qgb25Db21taXQgPSAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuJGVsLmZpbmQoXCIjX3VpLXByb21wdFwiKS52YWwoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVsLnRyaWdnZXIodGhpcy5fZXZlbnRPSywgdGV4dCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kZWxcclxuICAgICAgICAgICAgICAgIC5vbihcInZjbGlja1wiLCBcIi5jb21tYW5kLXByb21wdC1vayBcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBvbkNvbW1pdChldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uKFwia2V5ZG93blwiLCBcIiNfdWktcHJvbXB0XCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgRU5URVJfS0VZX0NPREUgPSAxMztcclxuICAgICAgICAgICAgICAgICAgICBpZiAoRU5URVJfS0VZX0NPREUgPT09IGV2ZW50LmtleUNvZGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25Db21taXQoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLm9uQmVmb3JlU2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb21wdFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICAgW2luXSDooajnpLrmloflrZfliJdcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uc10gW2luXSDjg4DjgqTjgqLjg63jgrDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEByZXR1cm4ge2pRdWVyeX0g44OA44Kk44Ki44Ot44Kw44GuIERPTSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHByb21wdChtZXNzYWdlOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dQcm9tcHRPcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGBcclxuICAgICAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ1aS1tb2RhbFwiIGRhdGEtcm9sZT1cInBvcHVwXCIgZGF0YS1jb3JuZXJzPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3M9XCJ1aS10aXRsZSB7e190aXRsZVN0YXRlfX1cIj57e3RpdGxlfX08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInVpLW1lc3NhZ2VcIj57e21lc3NhZ2V9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIl91aS1wcm9tcHRcIiBjbGFzcz1cInVpLWhpZGRlbi1hY2Nlc3NpYmxlXCI+PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIl91aS1wcm9tcHRcIiBpZD1cIl91aS1wcm9tcHRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktbW9kYWwtZm9vdGVyIHVpLWdyaWQtYVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwie3tpZE5lZ2F0aXZlfX1cIiBjbGFzcz1cInVpLWJ0biB1aS1ibG9jay1hXCIgZGF0YS1hdXRvLWNsb3NlPVwidHJ1ZVwiPnt7bGFiZWxOZWdhdGl2ZX19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkUG9zaXRpdmV9fVwiIGNsYXNzPVwiY29tbWFuZC1wcm9tcHQtb2sgdWktYnRuIHVpLWJsb2NrLWIgdWktdGV4dC1lbXBoYXNpc1wiIGRhdGEtYXV0by1jbG9zZT1cImZhbHNlXCI+e3tsYWJlbFBvc2l0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICAgICAgPC9zY3JpcHQ+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY29uc3QgZGxnUHJvbXB0ID0gbmV3IERpYWxvZ1Byb21wdCh0ZW1wbGF0ZSwgJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgc3JjOiBudWxsLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgIH0sIG9wdGlvbnMpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRsZ1Byb21wdC5zaG93KCk7XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IFJvdXRlciAgICAgICA9IENEUC5GcmFtZXdvcmsuUm91dGVyO1xyXG4gICAgaW1wb3J0IElQYWdlICAgICAgICA9IENEUC5GcmFtZXdvcmsuSVBhZ2U7XHJcbiAgICBpbXBvcnQgTW9kZWwgICAgICAgID0gQ0RQLkZyYW1ld29yay5Nb2RlbDtcclxuICAgIGltcG9ydCBWaWV3ICAgICAgICAgPSBDRFAuRnJhbWV3b3JrLlZpZXc7XHJcbiAgICBpbXBvcnQgVmlld09wdGlvbnMgID0gQ0RQLkZyYW1ld29yay5WaWV3T3B0aW9ucztcclxuICAgIGltcG9ydCBUZW1wbGF0ZSAgICAgPSBDRFAuVG9vbHMuVGVtcGxhdGU7XHJcbiAgICBpbXBvcnQgSlNUICAgICAgICAgID0gQ0RQLlRvb2xzLkpTVDtcclxuXHJcbiAgICBjb25zdCBUQUc6IHN0cmluZyA9IFwiW0NEUC5VSS5CYXNlSGVhZGVyVmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEJhc2VIZWFkZXJWaWV3T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIEJhc2VIZWFkZXJWaWV3IOOBq+aMh+WumuOBmeOCi+OCquODl+OCt+ODp+ODs+OCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJhc2VIZWFkZXJWaWV3T3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFZpZXdPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIGJhc2VUZW1wbGF0ZT86IEpTVDsgICAgICAgICAgICAgLy8hPCDlm7rlrprjg5jjg4Pjg4DnlKggSmF2YVNjcmlwdCDjg4bjg7Pjg5fjg6zjg7zjg4guXHJcbiAgICAgICAgYmFja0NvbW1hbmRTZWxlY3Rvcj86IHN0cmluZzsgICAvLyE8IFwi5oi744KLXCLjgrPjg57jg7Pjg4njgrvjg6zjgq/jgr8uIGRlZmF1bHQ6IFwiY29tbWFuZC1iYWNrXCJcclxuICAgICAgICBiYWNrQ29tbWFuZEtpbmQ/OiBzdHJpbmc7ICAgICAgIC8vITwgXCLmiLvjgotcIuOCs+ODnuODs+ODieeoruWIpSAob25Db21tYW5kIOesrDLlvJXmlbApLiBkZWZhdWx0OiBcInBhZ2ViYWNrXCJcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIEJhc2VIZWFkZXJWaWV3XHJcbiAgICAgKiBAYnJpZWYg5YWx6YCa44OY44OD44OA44KS5pON5L2c44GZ44KL44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBCYXNlSGVhZGVyVmlldzxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFZpZXc8VE1vZGVsPiB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfJGhlYWRlckJhc2U6IEpRdWVyeTsgICAvLyE8IOODmuODvOOCuOWkluOBq+mFjee9ruOBleOCjOOCi+WFsemAmuODmOODg+ODgOOBruODmeODvOOCuemDqOWTgeeUqCBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19yZWZDb3VudCA9IDA7ICAgICAgICAgIC8vITwg5Y+C54Wn44Kr44Km44Oz44OIXHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGU6IEpTVDtcclxuICAgICAgICBwcml2YXRlIF9oYXNCYWNrSW5kaWNhdG9yOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtJUGFnZX0gX293bmVyIFtpbl0g44Kq44O844OK44O844Oa44O844K444Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfb3duZXI6IElQYWdlLCBwcml2YXRlIF9vcHRpb25zPzogQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIoX29wdGlvbnMgPSAkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICBlbDogX293bmVyLiRwYWdlLmZpbmQoXCJbZGF0YS1yb2xlPSdoZWFkZXInXVwiKSxcclxuICAgICAgICAgICAgICAgIGJhY2tDb21tYW5kU2VsZWN0b3I6IFwiLmNvbW1hbmQtYmFja1wiLFxyXG4gICAgICAgICAgICAgICAgYmFja0NvbW1hbmRLaW5kOiBcInBhZ2ViYWNrXCIsXHJcbiAgICAgICAgICAgIH0sIF9vcHRpb25zKSk7XHJcblxyXG4gICAgICAgICAgICAvLyB0ZW1wbGF0ZSDoqK3lrppcclxuICAgICAgICAgICAgaWYgKF9vcHRpb25zLmJhc2VUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBfb3B0aW9ucy5iYXNlVGVtcGxhdGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFRlbXBsYXRlLmdldEpTVChgXHJcbiAgICAgICAgICAgICAgICAgICAgPHNjcmlwdCB0eXBlPSd0ZXh0L3RlbXBsYXRlJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhlYWRlciBjbGFzcz0ndWktaGVhZGVyLWJhc2UgdWktYm9keS17e3RoZW1lfX0nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0ndWktZml4ZWQtYmFjay1pbmRpY2F0b3InPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBCYWNrYm9uZS5WaWV3IOeUqOOBruWIneacn+WMllxyXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQodGhpcy4kZWwsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDliJ3mnJ/ljJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgY3JlYXRlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUhlYWRlckJhc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOacieWKueWMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBhY3RpdmF0ZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93SW5kaWNhdG9yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnhKHlirnljJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgaW5hY3RpdmF0ZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oaWRlSW5kaWNhdG9yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnoLTmo4RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgcmVsZWFzZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWxlYXNlSGVhZGVyQmFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8hIOWFsemAmuODmOODg+ODgOOBruODmeODvOOCueOCkua6luWCmVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlSGVhZGVyQmFzZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICAvLyDlm7rlrprjg5jjg4Pjg4Djga7jgajjgY3jgavmnInlirnljJZcclxuICAgICAgICAgICAgaWYgKFwiZml4ZWRcIiA9PT0gdGhpcy5fb3duZXIuJGhlYWRlci5qcW1EYXRhKFwicG9zaXRpb25cIikpIHtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsID09IEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlID0gJCh0aGlzLl90ZW1wbGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiB0aGlzLl9vd25lci4kcGFnZS5qcW1EYXRhKFwidGhlbWVcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc19yZWZDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZS5hcHBlbmRUbygkKGRvY3VtZW50LmJvZHkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBCYWNrIEluZGljYXRvciDjgpLmjIHjgaPjgabjgYTjgovjgYvliKTlrppcclxuICAgICAgICAgICAgaWYgKDAgPCB0aGlzLiRlbC5maW5kKFwiLnVpLWJhY2staW5kaWNhdG9yXCIpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faGFzQmFja0luZGljYXRvciA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgaW5kaWNhdG9yIOOBruihqOekulxyXG4gICAgICAgIHByaXZhdGUgc2hvd0luZGljYXRvcigpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICAvLyBCYWNrIEluZGljYXRvciDjgpLmjIHjgaPjgabjgYTjgarjgYTloLTlkIjooajnpLrjgZfjgarjgYRcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSAmJiB0aGlzLl9oYXNCYWNrSW5kaWNhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlLmZpbmQoXCIudWktZml4ZWQtYmFjay1pbmRpY2F0b3JcIikuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGluZGljYXRvciDjga7pnZ7ooajnpLpcclxuICAgICAgICBwcml2YXRlIGhpZGVJbmRpY2F0b3IoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSkge1xyXG4gICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZS5maW5kKFwiLnVpLWZpeGVkLWJhY2staW5kaWNhdG9yXCIpLnJlbW92ZUNsYXNzKFwic2hvd1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhbHpgJrjg5jjg4Pjg4Djga7jg5njg7zjgrnjgpLnoLTmo4RcclxuICAgICAgICBwcml2YXRlIHJlbGVhc2VIZWFkZXJCYXNlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIC8vIOWbuuWumuODmOODg+ODgOaZguOBq+WPgueFp+OCq+OCpuODs+ODiOOCkueuoeeQhlxyXG4gICAgICAgICAgICBpZiAoXCJmaXhlZFwiID09PSB0aGlzLl9vd25lci4kaGVhZGVyLmpxbURhdGEoXCJwb3NpdGlvblwiKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfcmVmQ291bnQtLTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PT0gQmFzZUhlYWRlclZpZXcuc19yZWZDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBCYWNrYm9uZS5WaWV3XHJcblxyXG4gICAgICAgIC8vISBldmVudHMgYmluZGluZ1xyXG4gICAgICAgIGV2ZW50cygpOiBhbnkge1xyXG4gICAgICAgICAgICBjb25zdCBldmVudE1hcCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRNYXBbXCJ2Y2xpY2sgXCIgKyB0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kU2VsZWN0b3JdID0gdGhpcy5vbkNvbW1hbmRCYWNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBldmVudE1hcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBiYWNrIOOBruODj+ODs+ODieODqVxyXG4gICAgICAgIHByaXZhdGUgb25Db21tYW5kQmFjayhldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vd25lcikge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlZCA9IHRoaXMuX293bmVyLm9uQ29tbWFuZChldmVudCwgdGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEtpbmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaGFuZGxlZCkge1xyXG4gICAgICAgICAgICAgICAgUm91dGVyLmJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBGcmFtZXdvcmsgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIGNvbnN0IFRBRzogc3RyaW5nID0gXCJbQ0RQLlVJLkJhc2VQYWdlXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgQmFzZVBhZ2VPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgQmFzZVBhZ2Ug44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFzZVBhZ2VPcHRpb25zPFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuUGFnZUNvbnN0cnVjdE9wdGlvbnMsIEJhc2VIZWFkZXJWaWV3T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBiYXNlSGVhZGVyPzogbmV3IChvd25lcjogRnJhbWV3b3JrLklQYWdlLCBvcHRpb25zPzogQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbD4pID0+IEJhc2VIZWFkZXJWaWV3PFRNb2RlbD47ICAgLy8hPCBIZWFkZXIg5qmf6IO944KS5o+Q5L6b44GZ44KL5Z+65bqV44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgYmFja0NvbW1hbmRIYW5kbGVyPzogc3RyaW5nOyAgICAgICAgICAgICAgICAvLyE8IFwi5oi744KLXCIg44Kz44Oe44Oz44OJ44OP44Oz44OJ44Op44Oh44K944OD44OJ5ZCNLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogb25QYWdlQmFja1xyXG4gICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zOyAgLy8hPCBET03mi6HlvLXjgavmuKHjgZnjgqrjg5fjgrfjg6fjg7MuIG51bGx8dW5kZWZpbmVkIOOCkuaMh+WumuOBmeOCi+OBqOaLoeW8teOBl+OBquOBhCBkZWZhdWx0OiB7fVxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgQmFzZVBhZ2VcclxuICAgICAqIEBicmllZiBIZWFkZXIg44KS5YKZ44GI44KLIFBhZ2Ug44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBCYXNlUGFnZTxUTW9kZWwgZXh0ZW5kcyBGcmFtZXdvcmsuTW9kZWwgPSBGcmFtZXdvcmsuTW9kZWw+IGV4dGVuZHMgRnJhbWV3b3JrLlBhZ2Uge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9iYXNlSGVhZGVyOiBCYXNlSGVhZGVyVmlldzxUTW9kZWw+OyAgICAvLyE8IOODmOODg+ODgOOCr+ODqeOCuVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICAgICAgIHVybCAgICAgICBbaW5dIOODmuODvOOCuCBVUkxcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgaWQgICAgICAgIFtpbl0g44Oa44O844K4IElEXHJcbiAgICAgICAgICogQHBhcmFtIHtCYXNlUGFnZU9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBwcml2YXRlIF9vcHRpb25zPzogQmFzZVBhZ2VPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIodXJsLCBpZCwgX29wdGlvbnMgPSAkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICBiYXNlSGVhZGVyOiBCYXNlSGVhZGVyVmlldyxcclxuICAgICAgICAgICAgICAgIGJhY2tDb21tYW5kSGFuZGxlcjogXCJvblBhZ2VCYWNrXCIsXHJcbiAgICAgICAgICAgICAgICBiYWNrQ29tbWFuZEtpbmQ6IFwicGFnZWJhY2tcIixcclxuICAgICAgICAgICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM6IHt9LFxyXG4gICAgICAgICAgICB9LCBfb3B0aW9ucykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBPdmVycmlkZTogRnJhbWV3b3JrIFBhZ2VcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVjcmVhdGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUNyZWF0ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmJhc2VIZWFkZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VIZWFkZXIgPSBuZXcgdGhpcy5fb3B0aW9ucy5iYXNlSGVhZGVyKHRoaXMsIHRoaXMuX29wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlci5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VjcmVhdGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUluaXQoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9vcHRpb25zLmRvbUV4dGVuc2lvbk9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIEV4dGVuc2lvbk1hbmFnZXIuYXBwbHlEb21FeHRlbnNpb24odGhpcy4kcGFnZSwgdGhpcy5fb3B0aW9ucy5kb21FeHRlbnNpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VJbml0KGV2ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmFzZUhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlci5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iYXNlSGVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLmluYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVIaWRlKGV2ZW50LCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VSZW1vdmUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmFzZUhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlci5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VSZW1vdmUoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSC9XIEJhY2sgQnV0dG9uIOODj+ODs+ODieODqVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIGV2ZW50IG9iamVjdFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaXouWumuOBruWHpueQhuOCkuihjOOCj+OBquOBhCAvIGZhbHNlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgYZcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkhhcmR3YXJlQmFja0J1dHRvbihldmVudD86IEpRdWVyeS5FdmVudCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBsZXQgcmV0dmFsID0gc3VwZXIub25IYXJkd2FyZUJhY2tCdXR0b24oZXZlbnQpO1xyXG4gICAgICAgICAgICBpZiAoIXJldHZhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dmFsID0gdGhpcy5vbkNvbW1hbmQoZXZlbnQsIHRoaXMuX29wdGlvbnMuYmFja0NvbW1hbmRLaW5kKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0dmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBPdmVycmlkZTogQ3VzdG9tIEV2ZW50XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFwi5oi744KLXCIgZXZlbnQg55m66KGM5pmC44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgo/jgarjgYQgLyBmYWxzZTog5pei5a6a44Gu5Yem55CG44KS6KGM44GGXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25Db21tYW5kKGV2ZW50OiBKUXVlcnkuRXZlbnQsIGtpbmQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEtpbmQgPT09IGtpbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vd25lciAmJiB0aGlzLl9vd25lclt0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kSGFuZGxlcl0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXJbdGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEhhbmRsZXJdKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcbiAgICBpbXBvcnQgUHJvbWlzZSAgICAgID0gQ0RQLlByb21pc2U7XHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrICAgID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZVZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGFnZVZpZXcg44GM55m66KGM44GZ44KL44Kk44OZ44Oz44OI5a6a576pXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjb25zdCBlbnVtIFBBR0VWSUVXX0VWRU5UUyB7XHJcbiAgICAgICAgT1JJRU5UQVRJT05fQ0hBTkdFRCA9IFwicGFnZXZpZXc6b3JpZW50YXRpb24tY2hhbmdlZFwiLFxyXG4gICAgICAgIElOSVRJQUxaU0UgICAgICAgICAgPSBcInBhZ2V2aWV3OmluaXRpYWxpemVcIixcclxuICAgICAgICBQQUdFX0JFRk9SRV9DUkVBVEUgID0gXCJwYWdldmlldzpiZWZvcmUtY3JlYXRlXCIsXHJcbiAgICAgICAgUEFHRV9JTklUICAgICAgICAgICA9IFwicGFnZXZpZXc6cGFnZS1pbml0XCIsXHJcbiAgICAgICAgUEFHRV9CRUZPUkVfU0hPVyAgICA9IFwicGFnZXZpZXc6YmVmb3JlLXNob3dcIixcclxuICAgICAgICBQQUdFX1NIT1cgICAgICAgICAgID0gXCJwYWdldmlldzpzaG93XCIsXHJcbiAgICAgICAgUEFHRV9CRUZPUkVfSElERSAgICA9IFwicGFnZXZpZXc6YmVmb3JlLWhpZGVcIixcclxuICAgICAgICBQQUdFX0hJREUgICAgICAgICAgID0gXCJwYWdldmlldzpoaWRlXCIsXHJcbiAgICAgICAgUEFHRV9SRU1PVkUgICAgICAgICA9IFwicGFnZXZpZXc6cmVtb3ZlXCIsXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIFJvdXRlciDjgbjjga7nmbvpjLLmg4XloLHjgaggQmFja2JvbmUuVmlldyDjgbjjga7liJ3mnJ/ljJbmg4XloLHjgpLmoLzntI3jgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEJhc2VQYWdlT3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBiYXNlUGFnZT86IG5ldyAodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBGcmFtZXdvcmsuUGFnZUNvbnN0cnVjdE9wdGlvbnMpID0+IEZyYW1ld29yay5QYWdlOyAgICAvLyE8IFBhZ2Ug5qmf6IO944KS5o+Q5L6b44GZ44KL5Z+65bqV44Kk44Oz44K544K/44Oz44K5XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgUGFnZVZpZXdcclxuICAgICAqIEBicmllZiBDRFAuRnJhbWV3b3JrLlBhZ2Ug44GoIEJhY2tib25lLlZpZXcg44Gu5Lih5pa544Gu5qmf6IO944KS5o+Q5L6b44GZ44KL44Oa44O844K444Gu5Z+65bqV44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlVmlldzxUTW9kZWwgZXh0ZW5kcyBGcmFtZXdvcmsuTW9kZWwgPSBGcmFtZXdvcmsuTW9kZWw+IGV4dGVuZHMgRnJhbWV3b3JrLlZpZXc8VE1vZGVsPiBpbXBsZW1lbnRzIEZyYW1ld29yay5JUGFnZSwgSVN0YXR1c01hbmFnZXIge1xyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgX3BhZ2VPcHRpb25zOiBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPiA9IG51bGw7XHJcbiAgICAgICAgcHJvdGVjdGVkIF9iYXNlUGFnZTogRnJhbWV3b3JrLlBhZ2UgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX3N0YXR1c01ncjogU3RhdHVzTWFuYWdlciA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdXJsICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICBbaW5dIOODmuODvOOCuCBVUkxcclxuICAgICAgICAgKiBAcGFyYW0gaWQgICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICBbaW5dIOODmuODvOOCuCBJRFxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFBhZ2VWaWV3IOioreWumlxyXG4gICAgICAgICAgICB0aGlzLl9wYWdlT3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB7IG93bmVyOiB0aGlzIH0sIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLl9iYXNlUGFnZSA9IHRoaXMuX3BhZ2VPcHRpb25zLmJhc2VQYWdlID8gbmV3IHRoaXMuX3BhZ2VPcHRpb25zLmJhc2VQYWdlKHVybCwgaWQsIHRoaXMuX3BhZ2VPcHRpb25zKSA6IG5ldyBCYXNlUGFnZSh1cmwsIGlkLCB0aGlzLl9wYWdlT3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAvLyBTdGF0dXNNYW5hZ2VyXHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1c01nciA9IG5ldyBTdGF0dXNNYW5hZ2VyKCk7XHJcbiAgICAgICAgICAgIC8vIEJhY2tib25lLlZpZXcg55So44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlcyA9ICg8YW55PnRoaXMpLmV2ZW50cyA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50KHRoaXMuJHBhZ2UsIGRlbGVnYXRlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElTdGF0dXNNYW5hZ2VyIOeKtuaFi+euoeeQhlxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jgqTjg7Pjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMge1N0cmluZ30gW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0dXNBZGRSZWYoc3RhdHVzOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzTWdyLnN0YXR1c0FkZFJlZihzdGF0dXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog54q25oWL5aSJ5pWw44Gu5Y+C54Wn44Kr44Km44Oz44OI44Gu44OH44Kv44Oq44Oh44Oz44OIXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdHVzIHtTdHJpbmd9IFtpbl0g54q25oWL6K2Y5Yil5a2QXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdHVzUmVsZWFzZShzdGF0dXM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNNZ3Iuc3RhdHVzUmVsZWFzZShzdGF0dXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5Yem55CG44K544Kz44O844OX5q+O44Gr54q25oWL5aSJ5pWw44KS6Kit5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdHVzICAge1N0cmluZ30gICBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb259IFtpbl0g5Yem55CG44Kz44O844Or44OQ44OD44KvXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdHVzU2NvcGUoc3RhdHVzOiBzdHJpbmcsIGNhbGxiYWNrOiAoKSA9PiB2b2lkIHwgUHJvbWlzZTxhbnk+KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1c01nci5zdGF0dXNTY29wZShzdGF0dXMsIGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBn+eKtuaFi+S4reOBp+OBguOCi+OBi+eiuuiqjVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyB7U3RyaW5nfSAgIFtpbl0g54q25oWL6K2Y5Yil5a2QXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog54q25oWL5YaFIC8gZmFsc2U6IOeKtuaFi+WkllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzU3RhdHVzSW4oc3RhdHVzOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1c01nci5pc1N0YXR1c0luKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIElQYWdlIHN0dWIgc3R1ZmYuXHJcblxyXG4gICAgICAgIGdldCBhY3RpdmUoKTogYm9vbGVhbiAgICAgICAgICAgICAgICAgICB7IHJldHVybiB0aGlzLl9iYXNlUGFnZS5hY3RpdmU7ICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIGdldCB1cmwoKTogc3RyaW5nICAgICAgICAgICAgICAgICAgICAgICB7IHJldHVybiB0aGlzLl9iYXNlUGFnZS51cmw7ICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIGdldCBpZCgpOiBzdHJpbmcgICAgICAgICAgICAgICAgICAgICAgICB7IHJldHVybiB0aGlzLl9iYXNlUGFnZSA/IHRoaXMuX2Jhc2VQYWdlLmlkIDogbnVsbDsgfVxyXG4gICAgICAgIGdldCAkcGFnZSgpOiBKUXVlcnkgICAgICAgICAgICAgICAgICAgICB7IHJldHVybiB0aGlzLl9iYXNlUGFnZS4kcGFnZTsgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIGdldCAkaGVhZGVyKCk6IEpRdWVyeSAgICAgICAgICAgICAgICAgICB7IHJldHVybiB0aGlzLl9iYXNlUGFnZS4kaGVhZGVyOyAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIGdldCAkZm9vdGVyKCk6IEpRdWVyeSAgICAgICAgICAgICAgICAgICB7IHJldHVybiB0aGlzLl9iYXNlUGFnZS4kZm9vdGVyOyAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIGdldCBpbnRlbnQoKTogRnJhbWV3b3JrLkludGVudCAgICAgICAgICB7IHJldHVybiB0aGlzLl9iYXNlUGFnZS5pbnRlbnQ7ICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIHNldCBpbnRlbnQobmV3SW50ZW50OiBGcmFtZXdvcmsuSW50ZW50KSB7IHRoaXMuX2Jhc2VQYWdlLmludGVudCA9IG5ld0ludGVudDsgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBPcmllbnRhdGlvbiDjga7lpInmm7TjgpLlj5fkv6FcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBuZXdPcmllbnRhdGlvbiB7T3JpZW50YXRpb259IFtpbl0gbmV3IG9yaWVudGF0aW9uIGNvZGUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25PcmllbnRhdGlvbkNoYW5nZWQobmV3T3JpZW50YXRpb246IEZyYW1ld29yay5PcmllbnRhdGlvbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoUEFHRVZJRVdfRVZFTlRTLk9SSUVOVEFUSU9OX0NIQU5HRUQsIG5ld09yaWVudGF0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEgvVyBCYWNrIEJ1dHRvbiDjg4/jg7Pjg4njg6lcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAgZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSBldmVudCBvYmplY3RcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgo/jgarjgYQgLyBmYWxzZTog5pei5a6a44Gu5Yem55CG44KS6KGM44GGXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25IYXJkd2FyZUJhY2tCdXR0b24oZXZlbnQ/OiBKUXVlcnkuRXZlbnQpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUm91dGVyIFwiYmVmb3JlIHJvdXRlIGNoYW5nZVwiIOODj+ODs+ODieODqVxyXG4gICAgICAgICAqIOODmuODvOOCuOmBt+enu+ebtOWJjeOBq+mdnuWQjOacn+WHpueQhuOCkuihjOOBhuOBk+OBqOOBjOWPr+iDvVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7SVByb21pc2VCYXNlfSBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uQmVmb3JlUm91dGVDaGFuZ2UoKTogSVByb21pc2VCYXNlPGFueT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmsY7nlKjjgrPjg57jg7Pjg4njgpLlj5fkv6FcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAgZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSBldmVudCBvYmplY3RcclxuICAgICAgICAgKiBAcGFyYW0gIGV2ZW50IHtraW5kfSAgICAgICAgICAgICAgW2luXSBjb21tYW5kIGtpbmQgc3RyaW5nXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5pei5a6a44Gu5Yem55CG44KS6KGM44KP44Gq44GEIC8gZmFsc2U6IOaXouWumuOBruWHpueQhuOCkuihjOOBhlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uQ29tbWFuZChldmVudD86IEpRdWVyeS5FdmVudCwga2luZD86IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmnIDliJ3jga4gT25QYWdlSW5pdCgpIOOBruOBqOOBjeOBq+OBruOBv+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25Jbml0aWFsaXplKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFBBR0VWSUVXX0VWRU5UUy5JTklUSUFMWlNFLCBldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50KHRoaXMuJHBhZ2UsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoUEFHRVZJRVdfRVZFTlRTLlBBR0VfQkVGT1JFX0NSRUFURSwgZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VjcmVhdGVcIiAo5penOlwicGFnZWluaXRcIikg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VJbml0KGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFBBR0VWSUVXX0VWRU5UUy5QQUdFX0lOSVQsIGV2ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoUEFHRVZJRVdfRVZFTlRTLlBBR0VfQkVGT1JFX1NIT1csIGV2ZW50LCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyc2hvd1wiICjml6c6XCJwYWdlc2hvd1wiKSDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRhICB7U2hvd0V2ZW50RGF0YX0gICAgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlU2hvdyhldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLlNob3dFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFBBR0VWSUVXX0VWRU5UUy5QQUdFX1NIT1csIGV2ZW50LCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3JlaGlkZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtIaWRlRXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVIaWRlKGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoUEFHRVZJRVdfRVZFTlRTLlBBR0VfQkVGT1JFX0hJREUsIGV2ZW50LCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyaGlkZVwiICjml6c6XCJwYWdlaGlkZVwiKSDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRhICB7SGlkZUV2ZW50RGF0YX0gICAgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlSGlkZShldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLkhpZGVFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFBBR0VWSUVXX0VWRU5UUy5QQUdFX0hJREUsIGV2ZW50LCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VSZW1vdmUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoUEFHRVZJRVdfRVZFTlRTLlBBR0VfUkVNT1ZFLCBldmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWwgID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy4kZWwgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG4gICAgaW1wb3J0IEZyYW1ld29yayA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlBhZ2VDb250YWluZXJWaWV3XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUGFnZUNvbnRhaW5lclZpZXdPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgUGFnZUNvbnRhaW5lciDjga7jgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYWdlQ29udGFpbmVyVmlld09wdGlvbnM8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEZyYW1ld29yay5WaWV3T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBvd25lcjogUGFnZVZpZXc7XHJcbiAgICAgICAgJGVsPzogSlF1ZXJ5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VDb250YWluZXJWaWV3XHJcbiAgICAgKiBAYnJpZWYgUGFnZVZpZXcg44Go6YCj5pC65Y+v6IO944GqIOOCs+ODs+ODhuODiuODk+ODpeODvOOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUGFnZUNvbnRhaW5lclZpZXc8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEZyYW1ld29yay5WaWV3PFRNb2RlbD4ge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9vd25lcjogUGFnZVZpZXcgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFBhZ2VDb250YWluZXJWaWV3T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLl9vd25lciA9IG9wdGlvbnMub3duZXI7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLiRlbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVsZWdhdGVzID0gKDxhbnk+dGhpcykuZXZlbnRzID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50KG9wdGlvbnMuJGVsLCBkZWxlZ2F0ZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHNldCBldmVudCBsaXN0ZW5lclxyXG4gICAgICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMuX293bmVyLCBQQUdFVklFV19FVkVOVFMuT1JJRU5UQVRJT05fQ0hBTkdFRCwgdGhpcy5vbk9yaWVudGF0aW9uQ2hhbmdlZC5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLl9vd25lciwgUEFHRVZJRVdfRVZFTlRTLklOSVRJQUxaU0UsIHRoaXMub25Jbml0aWFsaXplLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMuX293bmVyLCBQQUdFVklFV19FVkVOVFMuUEFHRV9CRUZPUkVfQ1JFQVRFLCB0aGlzLm9uUGFnZUJlZm9yZUNyZWF0ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLl9vd25lciwgUEFHRVZJRVdfRVZFTlRTLlBBR0VfSU5JVCwgdGhpcy5vblBhZ2VJbml0LmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMuX293bmVyLCBQQUdFVklFV19FVkVOVFMuUEFHRV9CRUZPUkVfU0hPVywgdGhpcy5vblBhZ2VCZWZvcmVTaG93LmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMuX293bmVyLCBQQUdFVklFV19FVkVOVFMuUEFHRV9TSE9XLCB0aGlzLm9uUGFnZVNob3cuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5fb3duZXIsIFBBR0VWSUVXX0VWRU5UUy5QQUdFX0JFRk9SRV9ISURFLCB0aGlzLm9uUGFnZUJlZm9yZUhpZGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5fb3duZXIsIFBBR0VWSUVXX0VWRU5UUy5QQUdFX0hJREUsIHRoaXMub25QYWdlSGlkZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLl9vd25lciwgUEFHRVZJRVdfRVZFTlRTLlBBR0VfUkVNT1ZFLCB0aGlzLm9uUGFnZVJlbW92ZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gc2hvcnQgY3V0IG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8hIE93bmVyIOWPluW+l1xyXG4gICAgICAgIGdldCBvd25lcigpOiBQYWdlVmlldyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSGFuZGxlIFBhZ2VWaWV3IGV2ZW50c1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBPcmllbnRhdGlvbiDjga7lpInmm7TjgpLlj5fkv6FcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBuZXdPcmllbnRhdGlvbiB7T3JpZW50YXRpb259IFtpbl0gbmV3IG9yaWVudGF0aW9uIGNvZGUuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25PcmllbnRhdGlvbkNoYW5nZWQobmV3T3JpZW50YXRpb246IEZyYW1ld29yay5PcmllbnRhdGlvbik6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5pyA5Yid44GuIE9uUGFnZUluaXQoKSDjga7jgajjgY3jgavjga7jgb/jgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uSW5pdGlhbGl6ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlY3JlYXRlXCIgKOaXpzpcInBhZ2Vpbml0XCIpIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlSW5pdChldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZXNob3dcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRhICB7U2hvd0V2ZW50RGF0YX0gICAgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlU2hvdyhldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLlNob3dFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyc2hvd1wiICjml6c6XCJwYWdlc2hvd1wiKSDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRhICB7U2hvd0V2ZW50RGF0YX0gICAgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlU2hvdyhldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLlNob3dFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3JlaGlkZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtIaWRlRXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVIaWRlKGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJoaWRlXCIgKOaXpzpcInBhZ2VoaWRlXCIpIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtIaWRlRXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VIaWRlKGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VyZW1vdmVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZVJlbW92ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcExpc3RlbmluZygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLyBmb3Igbm9uIGZsaXBzbmFwIHVzZXIuXHJcbmludGVyZmFjZSBJRmxpcHNuYXAge1xyXG4gICAgW3g6IHN0cmluZ106IGFueTtcclxufVxyXG5pbnRlcmZhY2UgRmxpcHNuYXBPcHRpb25zIHtcclxufVxyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IE1vZGVsICAgICAgICAgICAgICAgICAgICAgICAgPSBGcmFtZXdvcmsuTW9kZWw7XHJcbiAgICBpbXBvcnQgSU9yaWVudGF0aW9uQ2hhbmdlZExpc3RlbmVyICA9IEZyYW1ld29yay5JT3JpZW50YXRpb25DaGFuZ2VkTGlzdGVuZXI7XHJcbiAgICBpbXBvcnQgT3JpZW50YXRpb24gICAgICAgICAgICAgICAgICA9IEZyYW1ld29yay5PcmllbnRhdGlvbjtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuVGFiSG9zdFZpZXddIFwiO1xyXG5cclxuICAgIG5hbWVzcGFjZSBfQ29uZmlnIHtcclxuICAgICAgICBleHBvcnQgY29uc3QgVEFCVklFV19DTEFTUyA9IFwidWktdGFidmlld1wiO1xyXG4gICAgICAgIGV4cG9ydCBjb25zdCBUQUJWSUVXX1NFTEVDVE9SID0gXCIuXCIgKyBUQUJWSUVXX0NMQVNTO1xyXG4gICAgICAgIGV4cG9ydCBjb25zdCBUQUJIT1NUX0NMQVNTID0gXCJ1aS10YWJob3N0XCI7XHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IFRBQkhPU1RfU0VMRUNUT1IgPSBcIi5cIiArIFRBQkhPU1RfQ0xBU1M7XHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IFRBQkhPU1RfUkVGUkVTSF9DT0VGRiA9IDEuMDsgICAgICAgLy8gZmxpcHNuYXAg5YiH44KK5pu/44GI5pmC44GrIGR1cmF0aW9uIOOBq+WvvuOBl+OBpuabtOaWsOOCkuihjOOBhuS/guaVsFxyXG4gICAgICAgIGV4cG9ydCBjb25zdCBUQUJIT1NUX1JFRlJFU0hfSU5URVJWQUwgPSAyMDA7ICAgIC8vIGZsaXBzbmFwIOOBruabtOaWsOOBq+S9v+eUqOOBmeOCi+mWk+malCBbbXNlY11cclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJVGFiVmlld1xyXG4gICAgICogQGJyaWVmIFRhYkhvc3RWaWV3IOOBq+OCouOCv+ODg+ODgeWPr+iDveOBqiBWaWV3IOOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElUYWJWaWV3IGV4dGVuZHMgSUxpc3RWaWV3LCBJT3JpZW50YXRpb25DaGFuZ2VkTGlzdGVuZXIge1xyXG4gICAgICAgIGhvc3Q6IFRhYkhvc3RWaWV3OyAgICAgIC8vIGhvc3Qg44Gr44Ki44Kv44K744K5XHJcbiAgICAgICAgJGVsOiBKUXVlcnk7ICAgICAgICAgICAgLy8g566h55CGIERPTSDjgavjgqLjgq/jgrvjgrlcclxuICAgICAgICBuZWVkUmVidWlsZD86IGJvb2xlYW47ICAvLyByZWJ1aWxkIOeKtuaFi+OBq+OCouOCr+OCu+OCuVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RzOiBGcmFtZXdvcmtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog54q25oWL44Gr5b+c44GY44Gf44K544Kv44Ot44O844Or5L2N572u44Gu5L+d5a2YL+W+qeWFg1xyXG4gICAgICAgICAqIEJyb3dzZXIg44GuIE5hdGl2ZSBTY3JvbGwg5pmC44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdHJlYXRTY3JvbGxQb3NpdGlvbigpOiB2b2lkO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RzOiBFdmVudFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTY3JvbGxlciDjga7liJ3mnJ/ljJbmmYLjgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkluaXRpYWxpemUoaG9zdDogVGFiSG9zdFZpZXcsICRyb290OiBKUXVlcnkpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTY3JvbGxlciDjga7noLTmo4TmmYLjgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkRlc3Ryb3koKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdmlzaWJpbGl0eSDlsZ7mgKfjgYzlpInmm7TjgZXjgozjgZ/jgajjgY3jgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKiBhY3RpdmUg44Oa44O844K444Go44Gd44Gu5Lih56uv44Gu44Oa44O844K444GM5a++6LGhXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdmlzaWJsZSBbaW5dIHRydWU6IOihqOekuiAvIGZhbHNlOiDpnZ7ooajnpLpcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblZpc2liaWxpdHlDaGFuZ2VkKHZpc2libGU6IGJvb2xlYW4pOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg5rjg7zjgrjjgYzooajnpLrlrozkuobjgZfjgZ/jgajjgY3jgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblRhYlNlbGVjdGVkKCk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODmuODvOOCuOOBjOmdnuihqOekuuOBq+WIh+OCiuabv+OCj+OBo+OBn+OBqOOBjeOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uVGFiUmVsZWFzZWQoKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44OJ44Op44OD44Kw5Lit44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcG9zaXRpb24gW2luXSDnj77lnKjjga4gdGFiIGluZGV4XHJcbiAgICAgICAgICogQHBhcmFtIG9mZnNldCAgIFtpbl0g56e75YuV6YePXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25UYWJTY3JvbGxpbmcocG9zaXRpb246IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpOiB2b2lkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBUYWJWaWV3Q29udGV4dE9wdGlvbnNcclxuICAgICAqIEBicmllZiBUYWJWaWV3Q29udGV4dCDjgavmjIflrprjgZnjgovjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUYWJWaWV3Q29udGV4dE9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgZGVsYXlSZWdpc3Rlcj86IGJvb2xlYW47ICAgIC8vIOmBheW7tueZu+mMsuOCkuihjOOBhuWgtOWQiOOBryB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFRhYlZpZXdDb25zdHJ1Y3Rpb25PcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgVGFiVmlldyDjga7jgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUYWJWaWV3Q29uc3RydWN0aW9uT3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFRhYlZpZXdDb250ZXh0T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBob3N0OiBUYWJIb3N0VmlldzsgIC8vIGhvc3Qg44KS5oyH5a6aXHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgVGFiVmlld0NvbnRleHRcclxuICAgICAqIEBicmllZiBJVGFiVmlldyDjgpLliJ3mnJ/ljJbjgZnjgovjgZ/jgoHjga7mg4XloLHjgpLmoLzntI1cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUYWJWaWV3Q29udGV4dDxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiB7XHJcbiAgICAgICAgY3Rvcj86IG5ldyAob3B0aW9ucz86IFRhYlZpZXdDb25zdHJ1Y3Rpb25PcHRpb25zPFRNb2RlbD4pID0+IElUYWJWaWV3OyAgLy8gSVRhYlZpZXcg44Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgICAgb3B0aW9ucz86IFRhYlZpZXdDb250ZXh0T3B0aW9uczxUTW9kZWw+OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g5qeL56+J5pmC44Gu5Z+65bqV44Kq44OX44K344On44OzXHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgVGFiSG9zdFZpZXdDb25zdHJ1Y3RPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgVGFiSG9zdFZpZXcg44Gu5Yid5pyf5YyW5oOF5aCx44KS5qC857SN44GZ44KL44Kk44Oz44K/44O844OV44Kn44Kk44K544Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGFiSG9zdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgUGFnZUNvbnRhaW5lclZpZXdPcHRpb25zPFRNb2RlbD4sIEZsaXBzbmFwT3B0aW9ucyB7XHJcbiAgICAgICAgaW5hY3RpdmVWaXNpYmxlVGFiRGlzdGFuY2U/OiBudW1iZXI7ICAgIC8vIOmdnumBuOaKnuaZguOBriB2aXNpYmxlIOOCv+ODluaVsCBleCkgMTog5Lih44K144Kk44OJXHJcbiAgICAgICAgdGFiQ29udGV4dHM/OiBUYWJWaWV3Q29udGV4dFtdOyAgICAgICAgIC8vIFRhYlZpZXdDb250ZXh0IOOBrumFjeWIl1xyXG4gICAgICAgIGVuYWJsZUJvdW5jZT86IGJvb2xlYW47ICAgICAgICAgICAgICAgICAvLyDntYLnq6/jgacgYm91bmNlIOOBmeOCi+WgtOWQiOOBq+OBryB0cnVlXHJcbiAgICAgICAgaW5pdGlhbFdpZHRoPzogbnVtYmVyOyAgICAgICAgICAgICAgICAgIC8vIHdpZHRoIOOBruWIneacn+WApFxyXG4gICAgICAgIGluaXRpYWxIZWlnaHQ/OiBudW1iZXI7ICAgICAgICAgICAgICAgICAvLyBoZWlnaHQg44Gu5Yid5pyf5YCkXHJcbiAgICAgICAgaW5pdEltbWVkaWF0ZT86IGJvb2xlYW47ICAgICAgICAgICAgICAgIC8vIOOCs+ODs+OCueODiOODqeOCr+OCv+OBpyBUYWJWaWV3IOOCkuWIneacn+WMluOBmeOCi+WgtOWQiCB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBUYWJIb3N0Vmlld1xyXG4gICAgICogQGJyaWVmIOOCv+ODluWIh+OCiuabv+OBiOapn+iDveOCkuaMgeOBpCBWaWV3IOOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgVGFiSG9zdFZpZXc8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBQYWdlQ29udGFpbmVyVmlldzxUTW9kZWw+IGltcGxlbWVudHMgSU9yaWVudGF0aW9uQ2hhbmdlZExpc3RlbmVyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfdGFiczogSVRhYlZpZXdbXSA9IFtdOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gSVRhYlZpZXcg44KS5qC857SNXHJcblxyXG4gICAgICAgIHByaXZhdGUgX2FjdGl2ZVRhYkluZGV4OiBudW1iZXIgPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFjdGl2ZSB0YWJcclxuICAgICAgICBwcml2YXRlIF9mbGlwc25hcDogSUZsaXBzbmFwID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBmbGlwc25hcCDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICBwcml2YXRlIF9mbGlwRW5kRXZlbnRIYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCA9IG51bGw7ICAgICAvLyBcImZzdG91Y2hlbmRcIlxyXG4gICAgICAgIHByaXZhdGUgX2ZsaXBNb3ZlRXZlbnRIYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCA9IG51bGw7ICAgIC8vIFwiZnN0b3VjaG1vdmVcIlxyXG4gICAgICAgIHByaXZhdGUgX2ZsaXBEZWx0YUNhY2hlOiBudW1iZXIgPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiZmxpcCDot53pm6Ljga7jgq3jg6Pjg4Pjgrfjg6VcIlxyXG4gICAgICAgIHByaXZhdGUgX3Njcm9sbEVuZEV2ZW50SGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQgPSBudWxsOyAgIC8vIHRhYnZpZXcgXCJzY3JvbGxzdG9wXCJcclxuICAgICAgICBwcml2YXRlIF9zY3JvbGxNb3ZlRXZlbnRIYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCA9IG51bGw7ICAvLyB0YWJ2aWV3IFwic2Nyb2xsXCJcclxuICAgICAgICBwcml2YXRlIF9yZWZyZXNoVGltZXJJZDogbnVtYmVyID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWZyZXNoKCkg5Y+N5pig56K66KqN55SoXHJcbiAgICAgICAgcHJpdmF0ZSBfc2V0dGluZ3M6IFRhYkhvc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+OyAgICAgICAgICAgICAgICAgLy8gVGFiSG9zdFZpZXcg6Kit5a6a5YCkXHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgRVZFTlRfU0NST0xMX01PVkUgPSBcInRhYmhvc3Q6c2Nyb2xsbW92ZVwiO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgRVZFTlRfU0NST0xMX1NUT1AgPSBcInRhYmhvc3Q6c2Nyb2xsc3RvcFwiO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgRVZFTlRfVEFCX01PVkUgICAgPSBcInRhYmhvc3Q6dGFibW92ZVwiO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgRVZFTlRfVEFCX1NUT1AgICAgPSBcInRhYmhvc3Q6dGF2c3RvcFwiO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBUYWJIb3N0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNoZWNrIHJ1bnRpbWUgY29uZGl0aW9uXHJcbiAgICAgICAgICAgIGlmIChudWxsID09IGdsb2JhbC5GbGlwc25hcCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImZsaXBzbmFwIG1vZHVsZSBkb2Vzbid0IGxvYWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgIHRhYkNvbnRleHRzOiBbXSxcclxuICAgICAgICAgICAgICAgIHRhYk1vdmVIYW5kbGVyOiAoZGVsdGE6IG51bWJlcik6IHZvaWQgPT4geyAvKiBub29wICovIH0sXHJcbiAgICAgICAgICAgICAgICB0YWJTdG9wSGFuZGxlcjogKG5ld0luZGV4OiBudW1iZXIsIG1vdmVkOiBib29sZWFuKTogdm9pZCA9PiB7IC8qIG5vb3AgKi8gfVxyXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNldHVwIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgICAgICAgIHRoaXMuX2ZsaXBFbmRFdmVudEhhbmRsZXIgPSAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZnNFdmVudDogYW55ID0gZXZlbnQub3JpZ2luYWxFdmVudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZsaXBEZWx0YUNhY2hlID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMub25UYWJDaGFuZ2VkKGZzRXZlbnQubmV3UG9pbnQsIGZzRXZlbnQubW92ZWQpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fZmxpcE1vdmVFdmVudEhhbmRsZXIgPSAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZnNFdmVudDogYW55ID0gZXZlbnQub3JpZ2luYWxFdmVudDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZsaXBEZWx0YUNhY2hlICs9IGZzRXZlbnQuZGVsdGE7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gYm91bmNlIOOBruOCrOODvOODiVxyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9zZXR0aW5ncy5lbmFibGVCb3VuY2UgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICgtMSA9PT0gZnNFdmVudC5kaXJlY3Rpb24gJiYgMCA9PT0gdGhpcy5fYWN0aXZlVGFiSW5kZXggJiYgMCA8IHRoaXMuX2ZsaXBEZWx0YUNhY2hlKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICgxID09PSBmc0V2ZW50LmRpcmVjdGlvbiAmJiB0aGlzLl9hY3RpdmVUYWJJbmRleCA9PT0gdGhpcy5fdGFicy5sZW5ndGggLSAxICYmIHRoaXMuX2ZsaXBEZWx0YUNhY2hlIDwgMClcclxuICAgICAgICAgICAgICAgICkpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2ZsaXBzbmFwLm1vdmVUb1BvaW50KGZzRXZlbnQubmV3UG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9uVGFiTW92aW5nKGZzRXZlbnQuZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFidmlldzogSVRhYlZpZXcpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFidmlldy5vblRhYlNjcm9sbGluZyh0aGlzLl9hY3RpdmVUYWJJbmRleCwgZnNFdmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcmVwcm9jZXNzKHRoaXMuX2FjdGl2ZVRhYkluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbEVuZEV2ZW50SGFuZGxlciA9IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2Nyb2xsU3RvcCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTW92ZUV2ZW50SGFuZGxlciA9IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2Nyb2xsKCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBzZXR1cCB0YWJzXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5pbml0aWFsV2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVsLndpZHRoKHRoaXMuX3NldHRpbmdzLmluaXRpYWxXaWR0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmluaXRpYWxIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuJGVsLmhlaWdodCh0aGlzLl9zZXR0aW5ncy5pbml0aWFsSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaW5pdGlhbFdpZHRoICA9IHRoaXMuX3NldHRpbmdzLmluaXRpYWxXaWR0aDtcclxuICAgICAgICAgICAgY29uc3QgaW5pdGlhbEhlaWdodCA9IHRoaXMuJGVsLmhlaWdodCgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdGFiQ29udGV4dHMgPSB0aGlzLl9zZXR0aW5ncy50YWJDb250ZXh0cy5zbGljZSgpO1xyXG4gICAgICAgICAgICBpZiAoMCA8IHRhYkNvbnRleHRzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGFiQ29udGV4dHMuZm9yRWFjaCgoY29udGV4dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uICovXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IGNvbnRleHQuY3RvcigkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluaXRpYWxIZWlnaHQ6IGluaXRpYWxIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgfSwgY29udGV4dC5vcHRpb25zLCB7IGhvc3Q6IHRoaXMsIGRlbGF5UmVnaXN0ZXI6IGZhbHNlIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICAvKiB0c2xpbnQ6ZW5hYmxlOm5vLXVudXNlZC1leHByZXNzaW9uICovXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIElUYWJWaWV3IOOCpOODs+OCueOCv+ODs+OCueWMluimgeaxglxyXG4gICAgICAgICAgICAgICAgdGhpcy5vblRhYlZpZXdTZXR1cFJlcXVlc3QoaW5pdGlhbEhlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5pbml0SW1tZWRpYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluaXRpYWxpemVUYWJWaWV3cygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBGbGlwc25hcFxyXG4gICAgICAgICAgICB0aGlzLnNldEZsaXBzbmFwQ29uZGl0aW9uKCQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogaW5pdGlhbFdpZHRoLFxyXG4gICAgICAgICAgICB9LCB0aGlzLl9zZXR0aW5ncykpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZVRhYih0aGlzLl9hY3RpdmVUYWJJbmRleCwgMCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDphY3kuIvjga4gVGFiVmlldyDjgpLliJ3mnJ/ljJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgaW5pdGlhbGl6ZVRhYlZpZXdzKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBJVGFiVmlldyDjgasgJHRhYkhvc3Qg44KS44Ki44K144Kk44Oz44GZ44KLXHJcbiAgICAgICAgICAgIC8vIE5PVEU6IOePvuWcqOOBryBET00g44Gu6aCG5bqP44Gv5Zu65a6aXHJcbiAgICAgICAgICAgIGNvbnN0ICR0YWJzID0gdGhpcy4kZWwuZmluZChfQ29uZmlnLlRBQlZJRVdfU0VMRUNUT1IpO1xyXG4gICAgICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYnZpZXc6IElUYWJWaWV3LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGFidmlldy5vbkluaXRpYWxpemUodGhpcywgJCgkdGFic1tpbmRleF0pKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnoLTmo4Tjga7jg5jjg6vjg5Hjg7zplqLmlbBcclxuICAgICAgICAgKiDjg6Hjg7Pjg5Djg7zjga7noLTmo4Tjga7jgr/jgqTjg5/jg7PjgrDjgpLlpInjgYjjgovloLTlkIjjgIHmnKzjg6Hjgr3jg4Pjg4njgpLjgrPjg7zjg6vjgZnjgotcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgZGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNldEZsaXBzbmFwQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFidmlldzogSVRhYlZpZXcpID0+IHtcclxuICAgICAgICAgICAgICAgIHRhYnZpZXcub25EZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl90YWJzID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEZyYW1ld29yayBtZXRob2RzOlxyXG5cclxuICAgICAgICAvLyDjg5rjg7zjgrjjga7ln7rmupblgKTjgpLlj5blvpdcclxuICAgICAgICBwdWJsaWMgZ2V0QmFzZUhlaWdodCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZWwuaGVpZ2h0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUYWJWaWV3IOOCkueZu+mMslxyXG4gICAgICAgICAqIEZyYW1ld29yayDjgYzkvb/nlKhcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB0YWJ2aWV3IFtpbl0gSVRhYlZpZXcg44Gu44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHJlZ2lzdGVyVGFiVmlldyh0YWJ2aWV3OiBJVGFiVmlldyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSB0aGlzLmdldFRhYkluZGV4T2YodGFidmlldykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RhYnMucHVzaCh0YWJ2aWV3KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInRhYiBpbnN0YW5jZSBhbHJlYWR5IHJlZ2lzdGVyZWQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUYWJWaWV3IOOBriBUYWIgaW5kZXgg44KS5Y+W5b6XXHJcbiAgICAgICAgICogRnJhbWV3b3JrIOOBjOS9v+eUqFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHRhYnZpZXcgW2luXSBJVGFiVmlldyDjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKiBAcmV0dXJuIOaMh+WumuOCpOODs+OCueOCv+ODs+OCueOBruOCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBnZXRUYWJJbmRleE9mKHRhYnZpZXc6IElUYWJWaWV3KTogbnVtYmVyIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSB0aGlzLl90YWJzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhYnZpZXcgPT09IHRoaXMuX3RhYnNbaV0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCv+ODluODneOCuOOCt+ODp+ODs+OBruWIneacn+WMllxyXG4gICAgICAgIHByb3RlY3RlZCByZXNldFRhYlBvc2l0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYnZpZXc6IElUYWJWaWV3KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0YWJ2aWV3LnNjcm9sbFRvKDAsIGZhbHNlLCAwKTtcclxuICAgICAgICAgICAgICAgIHRhYnZpZXcucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5zZXRBY3RpdmVUYWIoMCwgMCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBJVGFiVmlldyDoqK3lrprjg6rjgq/jgqjjgrnjg4jmmYLjgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICBwcm90ZWN0ZWQgb25UYWJWaWV3U2V0dXBSZXF1ZXN0KGluaXRpYWxIZWlnaHQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBvdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBUYWIgY29udHJvbCBtZXRob2RzOlxyXG5cclxuICAgICAgICAvLyDjgqLjgq/jg4bjgqPjg5YgVGFiIOOCkuioreWumlxyXG4gICAgICAgIHB1YmxpYyBzZXRBY3RpdmVUYWIoaW5kZXg6IG51bWJlciwgdHJhbnNpdGlvbkR1cmF0aW9uPzogbnVtYmVyLCBpbml0aWFsPzogYm9vbGVhbik6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy52YWxpZFRhYihpbmRleCkgJiYgKGluaXRpYWwgfHwgKHRoaXMuX2FjdGl2ZVRhYkluZGV4ICE9PSBpbmRleCkpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDpgbfnp7vliY3jgasgc2Nyb2xsIOS9jee9ruOBriB2aWV3IOOCkuabtOaWsFxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcmVwcm9jZXNzKGluZGV4KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0QWN0aXZlVGFiSW5kZXggPSB0aGlzLl9hY3RpdmVUYWJJbmRleDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVRhYkluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGlwc25hcC5tb3ZlVG9Qb2ludCh0aGlzLl9hY3RpdmVUYWJJbmRleCwgdHJhbnNpdGlvbkR1cmF0aW9uKTtcclxuXHJcbiAgICAgICAgICAgICAgICB7Ly8g6YG356e75b6M44GrIGxpc3R2aWV3IOOBrueKtuaFi+OCkuWkieabtFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoYW5nZVRhYiA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wb3N0cHJvY2VzcyhsYXN0QWN0aXZlVGFiSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9uVGFiQ2hhbmdlZCh0aGlzLl9hY3RpdmVUYWJJbmRleCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbiA9IHRyYW5zaXRpb25EdXJhdGlvbiB8fCBwYXJzZUludCh0aGlzLl9mbGlwc25hcC50cmFuc2l0aW9uRHVyYXRpb24sIDEwKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PT0gdHJhbnNpdGlvbkR1cmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVRhYigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlVGFiKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRyYW5zaXRpb25EdXJhdGlvbiAqIF9Db25maWcuVEFCSE9TVF9SRUZSRVNIX0NPRUZGKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44K/44OW44Gu5pWw44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IOOCv+ODluaVsFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBnZXRUYWJDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFicy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjgqLjgq/jg4bjgqPjg5bjgarjgr/jg5YgSW5kZXgg44KS5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIGdldEFjdGl2ZVRhYkluZGV4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmVUYWJJbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHN3aXBlIOenu+WLlemHj+OCkuWPluW+lyAoc3dpcGUg5Lit44GrIGRlbHRhIOOBruWKoOeul+WApOOCkui/lOWNtClcclxuICAgICAgICBwdWJsaWMgZ2V0U3dpcGVEZWx0YSgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZmxpcERlbHRhQ2FjaGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjgr/jg5bnp7vli5XjgqTjg5njg7Pjg4hcclxuICAgICAgICBwcm90ZWN0ZWQgb25UYWJNb3ZpbmcoZGVsdGE6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoVGFiSG9zdFZpZXcuRVZFTlRfVEFCX01PVkUsIGRlbHRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCv+ODluWkieabtOWujOS6huOCpOODmeODs+ODiFxyXG4gICAgICAgIHByb3RlY3RlZCBvblRhYkNoYW5nZWQobmV3SW5kZXg6IG51bWJlciwgbW92ZWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG1vdmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZVRhYihuZXdJbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFRhYkhvc3RWaWV3LkVWRU5UX1RBQl9TVE9QLCBuZXdJbmRleCwgbW92ZWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBTY3JvbGwgY29udHJvbCBtZXRob2RzOlxyXG5cclxuICAgICAgICAvLyDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3MoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVRhYlZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmVUYWJWaWV3LmdldFNjcm9sbFBvcygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCueOCr+ODreODvOODq+S9jee9ruOBruacgOWkp+WApOOCkuWPluW+l1xyXG4gICAgICAgIGdldFNjcm9sbFBvc01heCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlVGFiVmlldykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVRhYlZpZXcuZ2V0U2Nyb2xsUG9zTWF4KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44K544Kv44Ot44O844Or5L2N572u44KS5oyH5a6aXHJcbiAgICAgICAgc2Nyb2xsVG8ocG9zOiBudW1iZXIsIGFuaW1hdGU/OiBib29sZWFuLCB0aW1lPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVUYWJWaWV3KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hY3RpdmVUYWJWaWV3LnNjcm9sbFRvKHBvcywgYW5pbWF0ZSwgdGltZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCueOCr+ODreODvOODq+OCpOODmeODs+ODiFxyXG4gICAgICAgIHByb3RlY3RlZCBvblNjcm9sbCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFRhYkhvc3RWaWV3LkVWRU5UX1NDUk9MTF9NT1ZFKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCueOCr+ODreODvOODq+WujOS6huOCpOODmeODs+ODiFxyXG4gICAgICAgIHByb3RlY3RlZCBvblNjcm9sbFN0b3AoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihUYWJIb3N0Vmlldy5FVkVOVF9TQ1JPTExfU1RPUCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjgrnjgq/jg63jg7zjg6vjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgc2V0U2Nyb2xsSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVRhYlZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVRhYlZpZXcuc2V0U2Nyb2xsSGFuZGxlcihoYW5kbGVyLCBvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCueOCr+ODreODvOODq+e1guS6huOCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICBzZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVRhYlZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVRhYlZpZXcuc2V0U2Nyb2xsU3RvcEhhbmRsZXIoaGFuZGxlciwgb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBIb3N0IGV2ZW50IGhvb2tzOlxyXG5cclxuICAgICAgICAvLyBPcmllbnRhdGlvbiDjga7lpInmm7TmpJznn6VcclxuICAgICAgICBvbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbjogT3JpZW50YXRpb24pOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIub25PcmllbnRhdGlvbkNoYW5nZWQobmV3T3JpZW50YXRpb24pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fdGFicy5mb3JFYWNoKCh0YWJ2aWV3OiBJVGFiVmlldykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGFidmlldy5vbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fcmVmcmVzaFRpbWVySWQpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZWZyZXNoVGltZXJJZCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9mbGlwc25hcCAmJiAwIDwgdGhpcy5fdGFicy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2MgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g44Oq44OI44Op44KkXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2ZsaXBzbmFwICYmIHRoaXMuX2ZsaXBzbmFwLl9tYXhQb2ludCAhPT0gKHRoaXMuX3RhYnMubGVuZ3RoIC0gMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmxpcHNuYXAucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGltZXJJZCA9IHNldFRpbWVvdXQocHJvYywgX0NvbmZpZy5UQUJIT1NUX1JFRlJFU0hfSU5URVJWQUwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlZnJlc2hUaW1lcklkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmxpcHNuYXAucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVmcmVzaFRpbWVySWQgPSBzZXRUaW1lb3V0KHByb2MsIF9Db25maWcuVEFCSE9TVF9SRUZSRVNIX0lOVEVSVkFMKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8galFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICAgIG9uUGFnZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLnJlYnVpbGQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogU2Nyb2xsTWFuYWdlciBQcm9maWxlIOeuoeeQhlxyXG5cclxuICAgICAgICAvLyDjg5rjg7zjgrjjgqLjgrXjgqTjg7PjgpLlho3mp4vmiJBcclxuICAgICAgICByZWJ1aWxkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYnZpZXc6IElUYWJWaWV3KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFidmlldy5uZWVkUmVidWlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYnZpZXcucmVidWlsZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYnZpZXcubmVlZFJlYnVpbGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kczpcclxuXHJcbiAgICAgICAgLy8gZmxpcHNuYXAg55Kw5aKD6Kit5a6aXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRGbGlwc25hcENvbmRpdGlvbihvcHRpb25zOiBGbGlwc25hcE9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZmxpcHNuYXAgPSBnbG9iYWwuRmxpcHNuYXAoX0NvbmZpZy5UQUJIT1NUX1NFTEVDVE9SLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgJCh0aGlzLl9mbGlwc25hcC5lbGVtZW50KS5vbihcImZzdG91Y2hlbmRcIiwgdGhpcy5fZmxpcEVuZEV2ZW50SGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgJCh0aGlzLl9mbGlwc25hcC5lbGVtZW50KS5vbihcImZzdG91Y2htb3ZlXCIsIHRoaXMuX2ZsaXBNb3ZlRXZlbnRIYW5kbGVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZmxpcHNuYXAg55Kw5aKD56C05qOEXHJcbiAgICAgICAgcHJpdmF0ZSByZXNldEZsaXBzbmFwQ29uZGl0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fZmxpcHNuYXApIHtcclxuICAgICAgICAgICAgICAgICQodGhpcy5fZmxpcHNuYXAuZWxlbWVudCkub2ZmKFwiZnN0b3VjaG1vdmVcIiwgdGhpcy5fZmxpcE1vdmVFdmVudEhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMuX2ZsaXBzbmFwLmVsZW1lbnQpLm9mZihcImZzdG91Y2hlbmRcIiwgdGhpcy5fZmxpcEVuZEV2ZW50SGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZsaXBzbmFwLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZsaXBzbmFwID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9mbGlwRGVsdGFDYWNoZSA9IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUYWIg5YiH44KK5pu/44GI44Gu5YmN5Yem55CGXHJcbiAgICAgICAgcHJpdmF0ZSBwcmVwcm9jZXNzKHRvSW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYnZpZXc6IElUYWJWaWV3LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ICE9PSB0aGlzLl9hY3RpdmVUYWJJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYnZpZXcudHJlYXRTY3JvbGxQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8g56e75YuV56+E5Zuy44KS5Y+v6KaW5YyWIE5PVEU6IGxvb3Ag5a++5b+c5pmC44Gr5p2h5Lu26KaL55u044GXXHJcbiAgICAgICAgICAgICAgICBpZiAoKHRoaXMuX2FjdGl2ZVRhYkluZGV4IDwgdG9JbmRleCAmJiAodGhpcy5fYWN0aXZlVGFiSW5kZXggPCBpbmRleCAmJiBpbmRleCA8PSB0b0luZGV4KSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAodG9JbmRleCA8IHRoaXMuX2FjdGl2ZVRhYkluZGV4ICYmICh0b0luZGV4IDw9IGluZGV4ICYmIGluZGV4IDwgdGhpcy5fYWN0aXZlVGFiSW5kZXgpKVxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFidmlldy4kZWwuY3NzKFwidmlzaWJpbGl0eVwiLCBcInZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGFiIOWIh+OCiuabv+OBiOOBruW+jOWHpueQhlxyXG4gICAgICAgIHByaXZhdGUgcG9zdHByb2Nlc3MobGFzdEFjdGl2ZVRhYkluZGV4OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fdGFicy5mb3JFYWNoKCh0YWJ2aWV3OiBJVGFiVmlldywgaW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX3NldHRpbmdzLmluYWN0aXZlVmlzaWJsZVRhYkRpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogbG9vcCDlr77lv5zmmYLjgavmnaHku7blr77lv5xcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IHRoaXMuX3NldHRpbmdzLmluYWN0aXZlVmlzaWJsZVRhYkRpc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVUYWJJbmRleCAtIGRpc3RhbmNlIDw9IGluZGV4ICYmIGluZGV4IDw9IHRoaXMuX2FjdGl2ZVRhYkluZGV4ICsgZGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFidmlldy4kZWwuY3NzKFwidmlzaWJpbGl0eVwiLCBcInZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYnZpZXcub25WaXNpYmlsaXR5Q2hhbmdlZCh0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3LiRlbC5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3Lm9uVmlzaWJpbGl0eUNoYW5nZWQoZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gdGhpcy5fYWN0aXZlVGFiSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3Lm9uVGFiU2VsZWN0ZWQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3LnNldFNjcm9sbEhhbmRsZXIodGhpcy5fc2Nyb2xsTW92ZUV2ZW50SGFuZGxlciwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFidmlldy5zZXRTY3JvbGxTdG9wSGFuZGxlcih0aGlzLl9zY3JvbGxFbmRFdmVudEhhbmRsZXIsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gbGFzdEFjdGl2ZVRhYkluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFidmlldy5zZXRTY3JvbGxIYW5kbGVyKHRoaXMuX3Njcm9sbE1vdmVFdmVudEhhbmRsZXIsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3LnNldFNjcm9sbFN0b3BIYW5kbGVyKHRoaXMuX3Njcm9sbEVuZEV2ZW50SGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYnZpZXcub25UYWJSZWxlYXNlZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRhYiBJbmRleCDjgpLmpJzoqLxcclxuICAgICAgICBwcml2YXRlIHZhbGlkVGFiKGluZGV4OiBudW1iZXIpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKDAgPT09IHRoaXMuX3RhYnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoMCA8PSBpbmRleCAmJiBpbmRleCA8IHRoaXMuX3RhYnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJpbnZhbGlkIHRhYiBpbmRleC4gaW5kZXg6IFwiICsgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjgqLjgq/jg4bjgqPjg5bjgarjgr/jg5YgU2Nyb2xsTWFuYWdlciDjgpLlj5blvpdcclxuICAgICAgICBwcml2YXRlIGdldCBfYWN0aXZlVGFiVmlldygpOiBJVGFiVmlldyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJzW3RoaXMuX2FjdGl2ZVRhYkluZGV4XTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IE1vZGVsID0gQ0RQLkZyYW1ld29yay5Nb2RlbDtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuVGFiVmlld10gXCI7XHJcbiAgICBjb25zdCBTVVBQUkVTU19XQVJOSU5HX0lOSVRJQUxfSEVJR0hUID0gMTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBUYWJWaWV3XHJcbiAgICAgKiBAYnJpZWYgVGFiSG9zdFZpZXcg44Gr44Ki44K/44OD44OB5Y+v6IO944GqIFZpZXcg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBUYWJWaWV3PFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgTGlzdFZpZXc8VE1vZGVsPiBpbXBsZW1lbnRzIElUYWJWaWV3IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfaG9zdDogVGFiSG9zdFZpZXcgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX25lZWRSZWJ1aWxkOiBib29sZWFuID0gZmFsc2U7ICAvLyDjg5rjg7zjgrjooajnpLrmmYLjgasgcmVidWlsZCgpIOOCkuOCs+ODvOODq+OBmeOCi+OBn+OCgeOBruWGhemDqOWkieaVsFxyXG4gICAgICAgIHByaXZhdGUgX3RhYkluZGV4OiBudW1iZXI7ICAgICAgICAgICAgICAvLyDoh6rouqvjga4gVGFiIEluZGV4XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBUYWJWaWV3Q29uc3RydWN0aW9uT3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCQuZXh0ZW5kKHt9LCB7IGluaXRpYWxIZWlnaHQ6IFNVUFBSRVNTX1dBUk5JTkdfSU5JVElBTF9IRUlHSFQgfSwgb3B0aW9ucykpO1xyXG4gICAgICAgICAgICB0aGlzLl9ob3N0ID0gb3B0aW9ucy5ob3N0O1xyXG4gICAgICAgICAgICBpZiAoIW9wdGlvbnMuZGVsYXlSZWdpc3Rlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faG9zdC5yZWdpc3RlclRhYlZpZXcodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSVZpZXdQYWdlciBwcm9wZXJ0aWVzLlxyXG5cclxuICAgICAgICAvLyBCYXNlVGFiUGFnZVZpZXcg44Gr44Ki44Kv44K744K5XHJcbiAgICAgICAgcHVibGljIGdldCBob3N0KCk6IFRhYkhvc3RWaWV3IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hvc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZWJ1aWxkIOeKtuaFi+OBuOOCouOCr+OCu+OCuVxyXG4gICAgICAgIHB1YmxpYyBnZXQgbmVlZFJlYnVpbGQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9uZWVkUmVidWlsZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlYnVpbGQg54q25oWL44KS6Kit5a6aXHJcbiAgICAgICAgcHVibGljIHNldCBuZWVkUmVidWlsZChyZWJ1aWxkOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX25lZWRSZWJ1aWxkID0gcmVidWlsZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSVZpZXdQYWdlciBGcmFtZXdvcmsuXHJcblxyXG4gICAgICAgIC8vIOeKtuaFi+OBq+W/nOOBmOOBn+OCueOCr+ODreODvOODq+S9jee9ruOBruS/neWtmC/lvqnlhYNcclxuICAgICAgICB0cmVhdFNjcm9sbFBvc2l0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLmNvcmUudHJlYXRTY3JvbGxQb3NpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJVGFiVmlldyBFdmVudHMuXHJcblxyXG4gICAgICAgIC8vIFNjcm9sbGVyIOOBruWIneacn+WMluaZguOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgIG9uSW5pdGlhbGl6ZShob3N0OiBUYWJIb3N0VmlldywgJHJvb3Q6IEpRdWVyeSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9ob3N0ID0gaG9zdDtcclxuICAgICAgICAgICAgdGhpcy5jb3JlLmluaXRpYWxpemUoJHJvb3QsIGhvc3QuZ2V0QmFzZUhlaWdodCgpKTtcclxuICAgICAgICAgICAgQmFja2JvbmUuVmlldy5wcm90b3R5cGUuc2V0RWxlbWVudC5jYWxsKHRoaXMsICRyb290LCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNjcm9sbGVyIOOBruegtOajhOaZguOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgIG9uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5faG9zdCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB2aXNpYmlsaXR5IOWxnuaAp+OBjOWkieabtOOBleOCjOOBn+OBqOOBjeOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgIG9uVmlzaWJpbGl0eUNoYW5nZWQodmlzaWJsZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBvdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44Oa44O844K444GM6KGo56S65a6M5LqG44GX44Gf44Go44GN44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgb25UYWJTZWxlY3RlZCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5jb3JlLnNldEFjdGl2ZVN0YXRlKHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44Oa44O844K444GM6Z2e6KGo56S644Gr5YiH44KK5pu/44KP44Gj44Gf44Go44GN44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgb25UYWJSZWxlYXNlZCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5jb3JlLnNldEFjdGl2ZVN0YXRlKGZhbHNlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOODieODqeODg+OCsOS4reOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgIG9uVGFiU2Nyb2xsaW5nKHBvc2l0aW9uOiBudW1iZXIsIG9mZnNldDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIG92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElPcmllbnRhdGlvbkNoYW5nZWRMaXN0ZW5lciBldmVudHMuXHJcblxyXG4gICAgICAgIC8vIE9yaWVudGF0aW9uIOOBruWkieabtOOCkuWPl+S/oVxyXG4gICAgICAgIG9uT3JpZW50YXRpb25DaGFuZ2VkKG5ld09yaWVudGF0aW9uOiBGcmFtZXdvcmsuT3JpZW50YXRpb24pOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gb3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IElMaXN0Vmlld1xyXG5cclxuICAgICAgICAvLyBjb3JlIGZyYW1ld29yayBhY2Nlc3NcclxuICAgICAgICBnZXQgY29yZSgpOiBTY3JvbGxNYW5hZ2VyIHtcclxuICAgICAgICAgICAgcmV0dXJuICg8YW55PnRoaXMpLl9zY3JvbGxNZ3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByb3RlY3RlZCBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vIOiHqui6q+OBriBUYWIgSW5kZXgg44KS5Y+W5b6XXHJcbiAgICAgICAgcHJvdGVjdGVkIGdldCB0YWJJbmRleCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl90YWJJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGFiSW5kZXggPSB0aGlzLl9ob3N0LmdldFRhYkluZGV4T2YodGhpcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYkluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6Ieq6Lqr44GMIGFjdGl2ZSDjgYvliKTlrppcclxuICAgICAgICBwcm90ZWN0ZWQgaXNBY3RpdmUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYkluZGV4ID09PSB0aGlzLl9ob3N0LmdldEFjdGl2ZVRhYkluZGV4KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IE1vZGVsID0gQ0RQLkZyYW1ld29yay5Nb2RlbDtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZUxpc3RWaWV3XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIFBhZ2VMaXN0VmlldyDjgbjjga7liJ3mnJ/ljJbmg4XloLHjgpLmoLzntI3jgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgTGlzdFZpZXdPcHRpb25zLCBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgYXV0b0Rlc3RvcnlFbGVtZW50PzogYm9vbGVhbjsgICAgICAgIC8vITwg44Oa44O844K46YG356e75YmN44GrIExpc3QgRWxlbWVudCDjgpLnoLTmo4TjgZnjgovloLTlkIjjga8gdHJ1ZSDjgpLmjIflrppcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQYWdlTGlzdFZpZXdcclxuICAgICAqIEBicmllZiDku67mg7Pjg6rjgrnjg4jjg5Pjg6Xjg7zmqZ/og73jgpLmjIHjgaQgUGFnZVZpZXcg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlTGlzdFZpZXc8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBQYWdlVmlldzxUTW9kZWw+IGltcGxlbWVudHMgSUxpc3RWaWV3IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc2Nyb2xsTWdyOiBTY3JvbGxNYW5hZ2VyID0gbnVsbDsgICAgLy8hPCBzY3JvbGwg44Kz44Ki44Ot44K444OD44KvXHJcbiAgICAgICAgcHJpdmF0ZSBfbmVlZFJlYnVpbGQ6IGJvb2xlYW4gPSBmYWxzZTsgICAgICAgLy8hPCDjg5rjg7zjgrjooajnpLrmmYLjgasgcmVidWlsZCgpIOOCkuOCs+ODvOODq+OBmeOCi+OBn+OCgeOBruWGhemDqOWkieaVsFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHVybCAgICAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgIFtpbl0gcGFnZSB0ZW1wbGF0ZSDjgavkvb/nlKjjgZnjgosgVVJMXHJcbiAgICAgICAgICogQHBhcmFtIGlkICAgICAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgIFtpbl0gcGFnZSDjgavmjK/jgonjgozjgZ8gSURcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7UGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgaWQ6IHN0cmluZywgb3B0aW9ucz86IFBhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcih1cmwsIGlkLCAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICAgICAgYXV0b0Rlc3RvcnlFbGVtZW50OiBmYWxzZSxcclxuICAgICAgICAgICAgfSwgb3B0aW9ucykpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IgPSBuZXcgU2Nyb2xsTWFuYWdlcihvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISByZWJ1aWxkKCkg44Gu44K544Kx44K444Ol44O844Oq44Oz44KwXHJcbiAgICAgICAgcHVibGljIHJlc2VydmVSZWJ1aWxkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9uZWVkUmVidWlsZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBQYWdlVmlld1xyXG5cclxuICAgICAgICAvLyEgT3JpZW50YXRpb24g44Gu5aSJ5pu05qSc55+lXHJcbiAgICAgICAgb25PcmllbnRhdGlvbkNoYW5nZWQobmV3T3JpZW50YXRpb246IEZyYW1ld29yay5PcmllbnRhdGlvbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3Iuc2V0QmFzZUhlaWdodCh0aGlzLmdldFBhZ2VCYXNlSGVpZ2h0KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODmuODvOOCuOmBt+enu+ebtOWJjeOCpOODmeODs+ODiOWHpueQhlxyXG4gICAgICAgIG9uQmVmb3JlUm91dGVDaGFuZ2UoKTogSVByb21pc2VCYXNlPGFueT4ge1xyXG4gICAgICAgICAgICBpZiAoKDxQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4+dGhpcy5fcGFnZU9wdGlvbnMpLmF1dG9EZXN0b3J5RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIub25CZWZvcmVSb3V0ZUNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICAgIG9uUGFnZUJlZm9yZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuaW5pdGlhbGl6ZSh0aGlzLiRwYWdlLCB0aGlzLmdldFBhZ2VCYXNlSGVpZ2h0KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyc2hvd1wiICjml6c6XCJwYWdlc2hvd1wiKSDjgavlr77lv5xcclxuICAgICAgICBvblBhZ2VTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VTaG93KGV2ZW50LCBkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldEJhc2VIZWlnaHQodGhpcy5nZXRQYWdlQmFzZUhlaWdodCgpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX25lZWRSZWJ1aWxkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlYnVpbGQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25lZWRSZWJ1aWxkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBqUU0gZXZlbnQ6IFwicGFnZXJlbW92ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgIG9uUGFnZVJlbW92ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZVJlbW92ZShldmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgUHJvZmlsZSDnrqHnkIZcclxuXHJcbiAgICAgICAgLy8hIOWIneacn+WMlua4iOOBv+OBi+WIpOWumlxyXG4gICAgICAgIGlzSW5pdGlhbGl6ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuaXNJbml0aWFsaXplZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODl+ODreODkeODhuOCo+OCkuaMh+WumuOBl+OBpuOAgUxpc3RJdGVtIOOCkueuoeeQhlxyXG4gICAgICAgIGFkZEl0ZW0oXHJcbiAgICAgICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgICAgICBpbml0aWFsaXplcjogbmV3IChvcHRpb25zPzogYW55KSA9PiBCYXNlTGlzdEl0ZW1WaWV3LFxyXG4gICAgICAgICAgICBpbmZvOiBhbnksXHJcbiAgICAgICAgICAgIGluc2VydFRvPzogbnVtYmVyXHJcbiAgICAgICAgICAgICk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9hZGRMaW5lKG5ldyBMaW5lUHJvZmlsZSh0aGlzLl9zY3JvbGxNZ3IsIE1hdGguZmxvb3IoaGVpZ2h0KSwgaW5pdGlhbGl6ZXIsIGluZm8pLCBpbnNlcnRUbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIEl0ZW0g44KS5YmK6ZmkXHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogbnVtYmVyLCBzaXplPzogbnVtYmVyLCBkZWxheT86IG51bWJlcik6IHZvaWQ7XHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogbnVtYmVyW10sIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBhbnksIGFyZzI/OiBudW1iZXIsIGFyZzM/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlbW92ZUl0ZW0oaW5kZXgsIGFyZzIsIGFyZzMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBl+OBnyBJdGVtIOOBq+ioreWumuOBl+OBn+aDheWgseOCkuWPluW+l1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogbnVtYmVyKTogYW55O1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogSlF1ZXJ5LkV2ZW50KTogYW55O1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogYW55KTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRJdGVtSW5mbyh0YXJnZXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCouOCr+ODhuOCo+ODluODmuODvOOCuOOCkuabtOaWsFxyXG4gICAgICAgIHJlZnJlc2goKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5yZWZyZXNoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5pyq44Ki44K144Kk44Oz44Oa44O844K444KS5qeL56+JXHJcbiAgICAgICAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Oa44O844K444Ki44K144Kk44Oz44KS5YaN5qeL5oiQXHJcbiAgICAgICAgcmVidWlsZCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlYnVpbGQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrqHovYTjg4fjg7zjgr/jgpLnoLTmo4RcclxuICAgICAgICByZWxlYXNlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVsZWFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgUHJvZmlsZSBCYWNrdXAgLyBSZXN0b3JlXHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg5Djg4Pjgq/jgqLjg4Pjg5dcclxuICAgICAgICBiYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5iYWNrdXAoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg6rjgrnjg4jjgqJcclxuICAgICAgICByZXN0b3JlKGtleTogc3RyaW5nLCByZWJ1aWxkOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXR2YWwgPSB0aGlzLl9zY3JvbGxNZ3IucmVzdG9yZShrZXksIHJlYnVpbGQpO1xyXG4gICAgICAgICAgICBpZiAocmV0dmFsICYmICFyZWJ1aWxkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2VydmVSZWJ1aWxkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldHZhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7mnInnhKFcclxuICAgICAgICBoYXNCYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5oYXNCYWNrdXAoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7noLTmo4RcclxuICAgICAgICBjbGVhckJhY2t1cChrZXk/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5jbGVhckJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBq+OCouOCr+OCu+OCuVxyXG4gICAgICAgIGdldCBiYWNrdXBEYXRhKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuYmFja3VwRGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IFNjcm9sbFxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or44Kk44OZ44Oz44OI44OP44Oz44OJ44Op6Kit5a6aL+ino+mZpFxyXG4gICAgICAgIHNldFNjcm9sbEhhbmRsZXIoaGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQsIG9uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zZXRTY3JvbGxIYW5kbGVyKGhhbmRsZXIsIG9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vntYLkuobjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgc2V0U2Nyb2xsU3RvcEhhbmRsZXIoaGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQsIG9uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyLCBvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuZ2V0U2Nyb2xsUG9zKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44Gu5pyA5aSn5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zTWF4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuZ2V0U2Nyb2xsUG9zTWF4KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5oyH5a6aXHJcbiAgICAgICAgc2Nyb2xsVG8ocG9zOiBudW1iZXIsIGFuaW1hdGU/OiBib29sZWFuLCB0aW1lPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zY3JvbGxUbyhwb3MsIGFuaW1hdGUsIHRpbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBleOCjOOBnyBMaXN0SXRlbVZpZXcg44Gu6KGo56S644KS5L+d6Ki8XHJcbiAgICAgICAgZW5zdXJlVmlzaWJsZShpbmRleDogbnVtYmVyLCBvcHRpb25zPzogRW5zdXJlVmlzaWJsZU9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLmVuc3VyZVZpc2libGUoaW5kZXgsIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgUHJvcGVydGllc1xyXG5cclxuICAgICAgICAvLyEgY29yZSBmcmFtZXdvcmsgYWNjZXNzXHJcbiAgICAgICAgZ2V0IGNvcmUoKTogSUxpc3RWaWV3RnJhbWV3b3JrIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1ncjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IEludGVybmFsIEkvRlxyXG5cclxuICAgICAgICAvLyEg55m76YyyIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgotcclxuICAgICAgICBfYWRkTGluZShfbGluZTogYW55LCBpbnNlcnRUbz86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuX2FkZExpbmUoX2xpbmUsIGluc2VydFRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBtZXRob2Q6XHJcblxyXG4gICAgICAgIC8vISDjg5rjg7zjgrjjga7ln7rmupblgKTjgpLlj5blvpdcclxuICAgICAgICBwcml2YXRlIGdldFBhZ2VCYXNlSGVpZ2h0KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKHdpbmRvdykuaGVpZ2h0KCkgLSBwYXJzZUludCh0aGlzLiRwYWdlLmNzcyhcInBhZGRpbmctdG9wXCIpLCAxMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBNb2RlbCA9IENEUC5GcmFtZXdvcmsuTW9kZWw7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlBhZ2VFeHBhbmRhYmxlTGlzdFZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VFeHBhbmRhYmxlTGlzdFZpZXdcclxuICAgICAqIEBicmllZiDplovplonjg6rjgrnjg4jjg5Pjg6Xjg7zmqZ/og73jgpLmjIHjgaQgUGFnZVZpZXcg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlRXhwYW5kYWJsZUxpc3RWaWV3PFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgUGFnZUxpc3RWaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJRXhwYW5kYWJsZUxpc3RWaWV3IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfZXhwYW5kTWFuYWdlcjogRXhwYW5kTWFuYWdlciA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdXJsICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIHRlbXBsYXRlIOOBq+S9v+eUqOOBmeOCiyBVUkxcclxuICAgICAgICAgKiBAcGFyYW0gaWQgICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIOOBq+aMr+OCieOCjOOBnyBJRFxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogUGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHVybCwgaWQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyID0gbmV3IEV4cGFuZE1hbmFnZXIodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElFeHBhbmRhYmxlTGlzdFZpZXdcclxuXHJcbiAgICAgICAgLy8hIOaWsOimjyBHcm91cFByb2ZpbGUg44KS5L2c5oiQXHJcbiAgICAgICAgbmV3R3JvdXAoaWQ/OiBzdHJpbmcpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5uZXdHcm91cChpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg55m76Yyy5riI44G/IEdyb3VwIOOCkuWPluW+l1xyXG4gICAgICAgIGdldEdyb3VwKGlkOiBzdHJpbmcpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5nZXRHcm91cChpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg56ysMemajuWxpOOBriBHcm91cCDnmbvpjLJcclxuICAgICAgICByZWdpc3RlclRvcEdyb3VwKHRvcEdyb3VwOiBHcm91cFByb2ZpbGUpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5yZWdpc3RlclRvcEdyb3VwKHRvcEdyb3VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrKwx6ZqO5bGk44GuIEdyb3VwIOOCkuWPluW+l1xyXG4gICAgICAgIGdldFRvcEdyb3VwcygpOiBHcm91cFByb2ZpbGVbXSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmdldFRvcEdyb3VwcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOBmeOBueOBpuOBruOCsOODq+ODvOODl+OCkuWxlemWiyAoMemajuWxpClcclxuICAgICAgICBleHBhbmRBbGwoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIuZXhwYW5kQWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5Y+O5p2fICgx6ZqO5bGkKVxyXG4gICAgICAgIGNvbGxhcHNlQWxsKGRlbGF5PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIuY29sbGFwc2VBbGwoZGVsYXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWxlemWi+S4reOBi+WIpOWumlxyXG4gICAgICAgIGlzRXhwYW5kaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5pc0V4cGFuZGluZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWPjuadn+S4reOBi+WIpOWumlxyXG4gICAgICAgIGlzQ29sbGFwc2luZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuaXNDb2xsYXBzaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg6ZaL6ZaJ5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNTd2l0Y2hpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmlzU3dpdGNoaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgbGF5b3V0IGtleSDjgpLlj5blvpdcclxuICAgICAgICBnZXQgbGF5b3V0S2V5KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmxheW91dEtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBsYXlvdXQga2V5IOOCkuioreWumlxyXG4gICAgICAgIHNldCBsYXlvdXRLZXkoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5sYXlvdXRLZXkgPSBrZXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBQYWdlTGlzdFZpZXdcclxuXHJcbiAgICAgICAgLy8hIOODh+ODvOOCv+OCkuegtOajhFxyXG4gICAgICAgIHJlbGVhc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44OQ44OD44Kv44Ki44OD44OXXHJcbiAgICAgICAgYmFja3VwKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODquOCueODiOOColxyXG4gICAgICAgIHJlc3RvcmUoa2V5OiBzdHJpbmcsIHJlYnVpbGQ6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlc3RvcmUoa2V5LCByZWJ1aWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIGpRdWVyeSBwbHVnaW4gZGVmaW5pdGlvblxyXG4gKi9cclxuaW50ZXJmYWNlIEpRdWVyeSB7XHJcbiAgICByaXBwbGUob3B0aW9ucz86IENEUC5VSS5Eb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5O1xyXG59XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgaW1wb3J0IEZyYW1ld29yayA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgLy8galF1ZXJ5IHBsdWdpblxyXG4gICAgJC5mbi5yaXBwbGUgPSBmdW5jdGlvbiAob3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0ICRlbCA9ICQodGhpcyk7XHJcbiAgICAgICAgaWYgKCRlbC5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJGVsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJGVsLm9uKEZyYW1ld29yay5QYXRjaC5zX3ZjbGlja0V2ZW50LCBmdW5jdGlvbiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBzdXJmYWNlID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBzdXJmYWNlIGlmIGl0IGRvZXNuJ3QgZXhpc3RcclxuICAgICAgICAgICAgaWYgKHN1cmZhY2UuZmluZChcIi51aS1yaXBwbGUtaW5rXCIpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgc3VyZmFjZS5wcmVwZW5kKFwiPGRpdiBjbGFzcz0ndWktcmlwcGxlLWluayc+PC9kaXY+XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5rID0gc3VyZmFjZS5maW5kKFwiLnVpLXJpcHBsZS1pbmtcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBzdG9wIHRoZSBwcmV2aW91cyBhbmltYXRpb25cclxuICAgICAgICAgICAgaW5rLnJlbW92ZUNsYXNzKFwidWktcmlwcGxlLWFuaW1hdGVcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBpbmsgc2l6ZTpcclxuICAgICAgICAgICAgaWYgKCFpbmsuaGVpZ2h0KCkgJiYgIWluay53aWR0aCgpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkID0gTWF0aC5tYXgoc3VyZmFjZS5vdXRlcldpZHRoKCksIHN1cmZhY2Uub3V0ZXJIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgICAgICBpbmsuY3NzKHsgaGVpZ2h0OiBkLCB3aWR0aDogZCB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgeCA9IGV2ZW50LnBhZ2VYIC0gc3VyZmFjZS5vZmZzZXQoKS5sZWZ0IC0gKGluay53aWR0aCgpIC8gMik7XHJcbiAgICAgICAgICAgIGNvbnN0IHkgPSBldmVudC5wYWdlWSAtIHN1cmZhY2Uub2Zmc2V0KCkudG9wIC0gKGluay5oZWlnaHQoKSAvIDIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmlwcGxlQ29sb3IgPSBzdXJmYWNlLmRhdGEoXCJyaXBwbGUtY29sb3JcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBhbmltYXRpb24gZW5kIGhhbmRsZXJcclxuICAgICAgICAgICAgY29uc3QgQU5JTUFUSU9OX0VORF9FVkVOVCA9IFwiYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZFwiO1xyXG4gICAgICAgICAgICBpbmsub24oQU5JTUFUSU9OX0VORF9FVkVOVCwgZnVuY3Rpb24gKGV2OiBKUXVlcnkuRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGluay5vZmYoKTtcclxuICAgICAgICAgICAgICAgIGluay5yZW1vdmVDbGFzcyhcInVpLXJpcHBsZS1hbmltYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgaW5rID0gbnVsbDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIGFuZCBhZGQgY2xhc3MgLmFuaW1hdGVcclxuICAgICAgICAgICAgaW5rLmNzcyh7XHJcbiAgICAgICAgICAgICAgICB0b3A6IHkgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiB4ICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogcmlwcGxlQ29sb3JcclxuICAgICAgICAgICAgfSkuYWRkQ2xhc3MoXCJ1aS1yaXBwbGUtYW5pbWF0ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRlcmlhbCBEZXNpZ24gUmlwcGxlIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgY29uc3QgTk9fUklQUExFX0NMQVNTID0gW1xyXG4gICAgICAgICAgICBcIi51aS1yaXBwbGUtbm9uZVwiLFxyXG4gICAgICAgICAgICBcIi51aS1mbGlwc3dpdGNoLW9uXCIsXHJcbiAgICAgICAgICAgIFwiLnVpLXNsaWRlci1oYW5kbGVcIixcclxuICAgICAgICAgICAgXCIudWktaW5wdXQtY2xlYXJcIixcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSBcIi51aS1idG5cIjtcclxuICAgICAgICBpZiAoJHVpLmhhc0NsYXNzKFwidWktcGFnZVwiKSkge1xyXG4gICAgICAgICAgICBzZWxlY3RvciA9IFwiLnVpLWNvbnRlbnQgLnVpLWJ0blwiOyAvLyBoZWFkZXIg44Gv6Ieq5YuVIHJpcHBsZSDljJblr77osaHlpJZcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICR1aS5maW5kKHNlbGVjdG9yKVxyXG4gICAgICAgICAgICAuZmlsdGVyKChpbmRleCwgZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGVsZW0gPSAkKGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRlbGVtLmlzKE5PX1JJUFBMRV9DTEFTUy5qb2luKFwiLFwiKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoXCJ1aS1yaXBwbGVcIik7XHJcblxyXG4gICAgICAgIC8vIHJpcHBsaWZ5XHJcbiAgICAgICAgJHVpLmZpbmQoXCIudWktcmlwcGxlXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKChpbmRleDogbnVtYmVyLCBlbGVtOiBFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW0pLnJpcHBsZShvcHRpb25zKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIi8qKlxyXG4gKiBqUXVlcnkgcGx1Z2luIGRlZmluaXRpb25cclxuICovXHJcbmludGVyZmFjZSBKUXVlcnkge1xyXG4gICAgc3Bpbm5lcihvcHRpb25zPzogQ0RQLlVJLkRvbUV4dGVuc2lvbk9wdGlvbnMgfCBcInJlZnJlc2hcIik6IEpRdWVyeTtcclxufVxyXG5cclxubmFtZXNwYWNlIENEUC5VSS5FeHRlbnNpb24ge1xyXG5cclxuICAgIGltcG9ydCBUZW1wbGF0ZSA9IENEUC5Ub29scy5UZW1wbGF0ZTtcclxuICAgIGltcG9ydCBKU1QgICAgICA9IENEUC5Ub29scy5KU1Q7XHJcblxyXG4gICAgbGV0IF90ZW1wbGF0ZTogSlNUO1xyXG5cclxuICAgIC8vIGpRdWVyeSBwbHVnaW5cclxuICAgICQuZm4uc3Bpbm5lciA9IGZ1bmN0aW9uIChvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyB8IFwicmVmcmVzaFwiKSB7XHJcbiAgICAgICAgaWYgKFwic3RyaW5nXCIgPT09IHR5cGVvZiBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZWZyZXNoKCQodGhpcykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzcGlubmVyaWZ5KCQodGhpcyksIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gc3Bpbm5lcmlmeSgkdGFyZ2V0OiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBpZiAoJHRhcmdldC5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJHRhcmdldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIF90ZW1wbGF0ZSA9IFRlbXBsYXRlLmdldEpTVChgXHJcbiAgICAgICAgICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWJhc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXItZ2FwXCIge3tib3JkZXJUb3B9fT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXItbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lci1oYWxmLWNpcmNsZVwiIHt7Ym9yZGVyfX0+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyLXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyLWhhbGYtY2lyY2xlXCIge3tib3JkZXJ9fT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtYWtlVGVtcGxhdGVQYXJhbSA9IChjbHI6IHN0cmluZyk6IG9iamVjdCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBib3JkZXJUb3A6IFwic3R5bGU9Ym9yZGVyLXRvcC1jb2xvcjpcIiArIGNsciArIFwiO1wiLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyOiBcInN0eWxlPWJvcmRlci1jb2xvcjpcIiArIGNsciArIFwiO1wiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbG9yID0gJHRhcmdldC5kYXRhKFwic3Bpbm5lci1jb2xvclwiKTtcclxuICAgICAgICBsZXQgcGFyYW0gPSBudWxsO1xyXG4gICAgICAgIGlmIChjb2xvcikge1xyXG4gICAgICAgICAgICAkdGFyZ2V0LmNzcyh7IFwiYmFja2dyb3VuZC1jb2xvclwiOiBjb2xvciB9KTtcclxuICAgICAgICAgICAgcGFyYW0gPSBtYWtlVGVtcGxhdGVQYXJhbShjb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICR0YXJnZXQuYXBwZW5kKF90ZW1wbGF0ZShwYXJhbSkpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVmcmVzaCgkdGFyZ2V0KTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpT1MgMTAuMisgU1ZHIFNNSUwg44Ki44OL44Oh44O844K344On44Oz44GMIDLlm57nm67ku6XpmY3li5XjgYvjgarjgYTllY/poYzjga7lr77nrZZcclxuICAgIC8vIGRhdGE6aW1hZ2Uvc3ZnK3htbDs8Y2FjaGUgYnVzdCBzdHJpbmc+O2Jhc2U2NCwuLi4g44Go44GZ44KL44GT44Go44GnIGRhdGEtdXJsIOOBq+OCgiBjYWNoZSBidXN0aW5nIOOBjOacieWKueOBq+OBquOCi1xyXG4gICAgZnVuY3Rpb24gcmVmcmVzaCgkdGFyZ2V0OiBKUXVlcnkpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IFBSRUZJWCA9IFtcIi13ZWJraXQtXCIsIFwiXCJdO1xyXG5cclxuICAgICAgICBjb25zdCB2YWxpZCA9IChwcm9wKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAocHJvcCAmJiBcIm5vbmVcIiAhPT0gcHJvcCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbGV0IGRhdGFVcmw6IHN0cmluZztcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IFBSRUZJWC5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKCF2YWxpZChkYXRhVXJsKSkge1xyXG4gICAgICAgICAgICAgICAgZGF0YVVybCA9ICR0YXJnZXQuY3NzKFBSRUZJWFtpXSArIFwibWFzay1pbWFnZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxpZChkYXRhVXJsKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlPUyDjgafjga8gdXJsKGRhdGEqKiopOyDlhoXjgasgJ1wiJyDjga/lhaXjgonjgarjgYRcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGRhdGFVcmwubWF0Y2goLyh1cmxcXChkYXRhOmltYWdlXFwvc3ZnXFwreG1sOykoW1xcc1xcU10qKT8oYmFzZTY0LFtcXHNcXFNdKlxcKSkvKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVVybCA9IGAke21hdGNoWzFdfWJ1c3Q9JHtEYXRlLm5vdygpLnRvU3RyaW5nKDM2KX07JHttYXRjaFszXX1gO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFVcmwgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodmFsaWQoZGF0YVVybCkpIHtcclxuICAgICAgICAgICAgICAgICR0YXJnZXQuY3NzKFBSRUZJWFtpXSArIFwibWFzay1pbWFnZVwiLCBkYXRhVXJsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICR0YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRlcmlhbCBEZXNpZ24gU3Bpbm5lciDmi6HlvLVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICAgICAgICR1aSAgICAgICBbaW5dIOaknOe0ouWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbk9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcHBseURvbUV4dGVuc2lvbigkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgICR1aS5maW5kKFwiLnVpLXNwaW5uZXIsIC51aS1pY29uLWxvYWRpbmdcIilcclxuICAgICAgICAgICAgLmVhY2goKGluZGV4OiBudW1iZXIsIGVsZW06IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICQoZWxlbSkuc3Bpbm5lcihvcHRpb25zKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRleHQgSW5wdXQg55SoIEZsb2F0aW5nIExhYmVsIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlID0gKGVsZW06IEVsZW1lbnQsIGZsb2F0aW5nOiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtID0gJChlbGVtKTtcclxuICAgICAgICAgICAgaWYgKGZsb2F0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbS5hZGRDbGFzcyhcInVpLWZsb2F0LWxhYmVsLWZsb2F0aW5nXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGVsZW0ucmVtb3ZlQ2xhc3MoXCJ1aS1mbG9hdC1sYWJlbC1mbG9hdGluZ1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGZsb2F0aW5naWZ5ID0gKGVsZW06IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSAkKGVsZW0pLmF0dHIoXCJmb3JcIik7XHJcbiAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9ICR1aS5maW5kKFwiI1wiICsgaWQpO1xyXG4gICAgICAgICAgICBpZiAoXCJzZWFyY2hcIiA9PT0gJGlucHV0LmpxbURhdGEoXCJ0eXBlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW0pLmFkZENsYXNzKFwidWktZmxvYXQtbGFiZWwtaGFzLWljb25cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdXBkYXRlKGVsZW0sICEhJGlucHV0LnZhbCgpKTtcclxuICAgICAgICAgICAgJGlucHV0Lm9uKFwia2V5dXAgY2hhbmdlIGlucHV0IGZvY3VzIGJsdXIgY3V0IHBhc3RlXCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGUoZWxlbSwgISEkKGV2ZW50LnRhcmdldCkudmFsKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkdWkuZmluZChcImxhYmVsLnVpLWZsb2F0LWxhYmVsLCAudWktZmxvYXQtbGFiZWwgbGFiZWxcIilcclxuICAgICAgICAgICAgLmVhY2goKGluZGV4OiBudW1iZXIsIGVsZW06IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGZsb2F0aW5naWZ5KGVsZW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRdWVyeSBNb2JpbGUgRmxpcCBTd2l0Y2gg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGZsaXBzd2l0Y2gg44Gr57SQ44Gl44GPIGxhYmVsIOOBryBPUyDjgavjgojjgaPjgaYgZXZlbnQg55m66KGM5b2i5byP44GM55Ww44Gq44KL44Gf44KB44OV44OD44Kv44GX44Gm54us6Ieq44Kk44OZ44Oz44OI44Gn5a++5b+c44GZ44KLLlxyXG4gICAgICAgICAqIOOBvuOBnyBmbGlwc3dpdGNoIOOBr+WGhemDqOOBpyBjbGljayDjgpLnmbrooYzjgZfjgabjgYTjgovjgYzjgIF2Y2xpY2sg44Gr5aSJ5pu044GZ44KLLlxyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICBjb25zdCBfZ2V0QWxsU3dpdGNoZXMgPSAoKTogSlF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICR1aS5maW5kKFwiLnVpLWZsaXBzd2l0Y2hcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2dldElucHV0RnJvbVN3aXRjaCA9ICgkc3dpdGNoOiBKUXVlcnkpOiBKUXVlcnkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkaW5wdXQgPSAkc3dpdGNoLmZpbmQoXCJpbnB1dFwiKTtcclxuICAgICAgICAgICAgaWYgKCRpbnB1dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaW5wdXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgJHNlbGVjdCA9ICRzd2l0Y2guZmluZChcInNlbGVjdFwiKTtcclxuICAgICAgICAgICAgaWYgKCRzZWxlY3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHNlbGVjdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfY2hhbmdlID0gKCRpbnB1dDogSlF1ZXJ5LCB0bzogYm9vbGVhbik6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoJGlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJJTlBVVFwiID09PSAkaW5wdXRbMF0ubm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaW5wdXQucHJvcChcImNoZWNrZWRcIiwgdG8pLmZsaXBzd2l0Y2goXCJyZWZyZXNoXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcIlNFTEVDVFwiID09PSAkaW5wdXRbMF0ubm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaW5wdXQudmFsKHRvID8gXCJvblwiIDogXCJvZmZcIikuZmxpcHN3aXRjaChcInJlZnJlc2hcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfZ2V0TGFiZWxzRnJvbVN3aXRjaCA9ICgkc3dpdGNoOiBKUXVlcnkpOiBKUXVlcnkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkaW5wdXQgPSBfZ2V0SW5wdXRGcm9tU3dpdGNoKCRzd2l0Y2gpO1xyXG4gICAgICAgICAgICBpZiAoJGlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYWJlbHMgPSAoPGFueT4kaW5wdXRbMF0pLmxhYmVscztcclxuICAgICAgICAgICAgICAgIGlmIChsYWJlbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJChsYWJlbHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2dldFN3aXRjaEZyb21MYWJlbCA9ICgkbGFiZWw6IEpRdWVyeSk6IEpRdWVyeSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSAkbGFiZWwuYXR0cihcImZvclwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIF9nZXRBbGxTd2l0Y2hlcygpLmZpbmQoXCJbbmFtZT0nXCIgKyBuYW1lICsgXCInXVwiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBfZ2V0QWxsU3dpdGNoZXMoKVxyXG4gICAgICAgICAgICAub24oXCJ2Y2xpY2sgX2NoYW5nZV9mbGlwc3dpY2hcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRzd2l0Y2ggPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoZXZlbnQudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9IF9nZXRJbnB1dEZyb21Td2l0Y2goJHN3aXRjaCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFuZ2VUbyA9ICEkc3dpdGNoLmhhc0NsYXNzKFwidWktZmxpcHN3aXRjaC1hY3RpdmVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCR0YXJnZXQuaGFzQ2xhc3MoXCJ1aS1mbGlwc3dpdGNoLWlucHV0XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2NoYW5nZSgkaW5wdXQsIGNoYW5nZVRvKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJHRhcmdldC5oYXNDbGFzcyhcInVpLWZsaXBzd2l0Y2gtb25cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoRnJhbWV3b3JrLlBsYXRmb3JtLk1vYmlsZSAmJiBGcmFtZXdvcmsuUGF0Y2guaXNTdXBwb3J0ZWRWY2xpY2soKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hhbmdlKCRpbnB1dCwgY2hhbmdlVG8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmVhY2goKGluZGV4OiBudW1iZXIsIGZsaXBzd2l0Y2g6IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIF9nZXRMYWJlbHNGcm9tU3dpdGNoKCQoZmxpcHN3aXRjaCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uKFwidmNsaWNrXCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0ICRzd2l0Y2ggPSBfZ2V0U3dpdGNoRnJvbUxhYmVsKCQoZXZlbnQudGFyZ2V0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghJHN3aXRjaC5wYXJlbnQoKS5oYXNDbGFzcyhcInVpLXN0YXRlLWRpc2FibGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3dpdGNoLnRyaWdnZXIoXCJfY2hhbmdlX2ZsaXBzd2ljaFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRdWVyeSBNb2JpbGUgU2xpZGVyIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgJHVpLmZpbmQoXCIudWktc2xpZGVyLWlucHV0XCIpXHJcbiAgICAgICAgICAgIC5vbihcInNsaWRlc3RvcFwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGhhbmRsZXMgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpXHJcbiAgICAgICAgICAgICAgICAgICAgLnBhcmVudCgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoXCIudWktc2xpZGVyLWhhbmRsZVwiKTtcclxuICAgICAgICAgICAgICAgICRoYW5kbGVzLmJsdXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICAvLyEgaVNjcm9sbC5jbGljayBwYXRjaFxyXG4gICAgY29uc3QgcGF0Y2hfSVNjcm9sbF91dGlsc19jbGljayA9IGZ1bmN0aW9uIChldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQ6IGFueSA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICBjb25zdCBlOiBhbnkgPSBldmVudDtcclxuICAgICAgICBsZXQgZXY6IE1vdXNlRXZlbnQ7XHJcblxyXG4gICAgICAgIC8vIFtDRFAgbW9kaWZpZWRdOiBzZXQgdGFyZ2V0LmNsaWVudFguXHJcbiAgICAgICAgaWYgKG51bGwgPT0gdGFyZ2V0LmNsaWVudFggfHwgbnVsbCA9PSB0YXJnZXQuY2xpZW50WSkge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBlLnBhZ2VYICYmIG51bGwgIT0gZS5wYWdlWSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsaWVudFggPSBlLnBhZ2VYO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsaWVudFkgPSBlLnBhZ2VZO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsaWVudFggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsaWVudFkgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoISgvKFNFTEVDVHxJTlBVVHxURVhUQVJFQSkvaSkudGVzdCh0YXJnZXQudGFnTmFtZSkpIHtcclxuICAgICAgICAgICAgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIk1vdXNlRXZlbnRzXCIpO1xyXG4gICAgICAgICAgICBldi5pbml0TW91c2VFdmVudChcImNsaWNrXCIsIHRydWUsIHRydWUsIGUudmlldywgMSxcclxuICAgICAgICAgICAgICAgIHRhcmdldC5zY3JlZW5YLCB0YXJnZXQuc2NyZWVuWSwgdGFyZ2V0LmNsaWVudFgsIHRhcmdldC5jbGllbnRZLFxyXG4gICAgICAgICAgICAgICAgZS5jdHJsS2V5LCBlLmFsdEtleSwgZS5zaGlmdEtleSwgZS5tZXRhS2V5LFxyXG4gICAgICAgICAgICAgICAgMCwgbnVsbCk7XHJcblxyXG4gICAgICAgICAgICAoPGFueT5ldikuX2NvbnN0cnVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXYpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGV0IHNfYXBwbGllZCA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogaVNjcm9sbCBQYXRjaCDmi6HlvLVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICAgICAgICR1aSAgICAgICBbaW5dIOaknOe0ouWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbk9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcHBseVBhdGNoKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgaWYgKCFzX2FwcGxpZWQgJiYgZ2xvYmFsLklTY3JvbGwgJiYgZ2xvYmFsLklTY3JvbGwudXRpbHMpIHtcclxuICAgICAgICAgICAgZ2xvYmFsLklTY3JvbGwudXRpbHMuY2xpY2sgPSBwYXRjaF9JU2Nyb2xsX3V0aWxzX2NsaWNrO1xyXG4gICAgICAgICAgICBzX2FwcGxpZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJHVpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeZu+mMslxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3RlckRvbUV4dGVuc2lvbihhcHBseVBhdGNoKTtcclxufVxyXG4iLCJkZWNsYXJlIG1vZHVsZSBcImNkcC51aS5qcW1cIiB7XHJcbiAgICBjb25zdCBVSTogdHlwZW9mIENEUC5VSTtcclxuICAgIGV4cG9ydCA9IFVJO1xyXG59XHJcbiJdfQ==