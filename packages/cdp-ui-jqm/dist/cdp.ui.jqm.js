/*!
 * cdp.ui.jqm.js 2.0.0
 *
 * Date: 2017-10-27T07:49:04.991Z
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
                _this._$contentsHolder = null; // contents holder
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
                _this._$contentsHolder = _this.$el.find(_Config.TABHOST_SELECTOR).parent();
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
                this._$contentsHolder = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVUkvanFtL1RoZW1lLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uTWFuYWdlci50cyIsImNkcDovLy9DRFAvVUkvanFtL1RvYXN0LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nQ29tbW9ucy50cyIsImNkcDovLy9DRFAvVUkvanFtL0Jhc2VIZWFkZXJWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vQmFzZVBhZ2UudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9QYWdlVmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1BhZ2VDb250YWluZXJWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vVGFiSG9zdFZpZXcudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9UYWJWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vUGFnZUxpc3RWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vUGFnZUV4cGFuZGFibGVMaXN0Vmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9SaXBwbGUudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vU3Bpbm5lci50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9GbG9hdExhYmVsLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL0ZsaXBTd2l0Y2gudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vU2xpZGVyLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL0lTY3JvbGwudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9JbnRlcmZhY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQVUsR0FBRyxDQTRPWjtBQTVPRCxXQUFVLEdBQUc7SUFBQyxNQUFFLENBNE9mO0lBNU9hLGFBQUU7UUFFWixJQUFPLE1BQU0sR0FBUyxHQUFHLENBQUMsTUFBTSxDQUFDO1FB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RSxLQUFGLE1BQUUsUUFpRGY7QUFBRCxDQUFDLEVBakRTLEdBQUcsS0FBSCxHQUFHLFFBaURaIiwic291cmNlc0NvbnRlbnQiOlsibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IENvbmZpZyAgICAgICA9IENEUC5Db25maWc7XHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrICAgID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuVGhlbWVdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQbGF0Zm9ybVRyYW5zaXRpb25cclxuICAgICAqIEBicmllZiDjg5fjg6njg4Pjg4jjg5Xjgqnjg7zjg6DjgZTjgajjga4gVHJhbnNpdGlvbiDjgpLmoLzntI1cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQbGF0Zm9ybVRyYW5zaXRpb24ge1xyXG4gICAgICAgIFtwbGF0Zm9ybTogc3RyaW5nXTogc3RyaW5nOyAgICAgLy8gZXgpIGlvczogXCJzbGlkZVwiXHJcbiAgICAgICAgZmFsbGJhY2s6IHN0cmluZzsgICAgICAgICAgICAgICAvLyBmYWxsYmFjayB0cmFuc2l0aW9uIHByb3BcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgVHJhbnNpdGlvbk1hcFxyXG4gICAgICogQGJyaWVmIOODiOODqeODs+OCuOOCt+ODp+ODs+ODnuODg+ODl1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRyYW5zaXRpb25NYXAge1xyXG4gICAgICAgIFt0cmFuc2l0aW9uTmFtZTogc3RyaW5nXTogUGxhdGZvcm1UcmFuc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBUaGVtZUluaXRPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYg44OI44Op44Oz44K444K344On44Oz44Oe44OD44OXXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVGhlbWVJbml0T3B0aW9ucyB7XHJcbiAgICAgICAgcGxhdGZvcm0/OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAgLy8gcGxhdGZvcm0g44KS5oyH5a6aLiBkZWZhdWx0OlwiYXV0b1wiXHJcbiAgICAgICAgcmVzZXJ2ZVNjcm9sbGJhclJlZ2lvbj86IGJvb2xlYW47ICAgLy8gUEMg44OH44OQ44OD44Kw55Kw5aKD44Gn44Gv44K544Kv44Ot44O844Or44OQ44O844KS6KGo56S6LiBkZWZhdWx0OiBcInRydWVcIlxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgVGhlbWVcclxuICAgICAqIEBicmllZiBVSSBUaGVtZSDoqK3lrprjgpLooYzjgYbjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFRoZW1lIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19wbGF0Zm9ybXM6IHN0cmluZ1tdID0gW1wiaW9zXCIsIFwiYW5kcm9pZFwiXTtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX3BhZ2VUcmFuc2l0aW9uTWFwOiBUcmFuc2l0aW9uTWFwID0ge1xyXG4gICAgICAgICAgICBcInBsYXRmb3JtLWRlZmF1bHRcIjoge1xyXG4gICAgICAgICAgICAgICAgaW9zOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBhbmRyb2lkOiBcImZsb2F0dXBcIixcclxuICAgICAgICAgICAgICAgIGZhbGxiYWNrOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwicGxhdGZvcm0tYWx0ZXJuYXRpdmVcIjoge1xyXG4gICAgICAgICAgICAgICAgaW9zOiBcInNsaWRldXBcIixcclxuICAgICAgICAgICAgICAgIGFuZHJvaWQ6IFwiZmxvYXR1cFwiLFxyXG4gICAgICAgICAgICAgICAgZmFsbGJhY2s6IFwic2xpZGV1cFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19kaWFsb2dUcmFuc2l0aW9uTWFwOiBUcmFuc2l0aW9uTWFwID0ge1xyXG4gICAgICAgICAgICBcInBsYXRmb3JtLWRlZmF1bHRcIjoge1xyXG4gICAgICAgICAgICAgICAgaW9zOiBcInBvcHpvb21cIixcclxuICAgICAgICAgICAgICAgIGFuZHJvaWQ6IFwiY3Jvc3N6b29tXCIsXHJcbiAgICAgICAgICAgICAgICBmYWxsYmFjazogXCJub25lXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZW1lIOOBruWIneacn+WMllxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMg44Kq44OX44K344On44Oz5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybnMgdHJ1ZTog5oiQ5YqfIC8gZmFsc2U6IOWkseaVl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgaW5pdGlhbGl6ZShvcHRpb25zPzogVGhlbWVJbml0T3B0aW9ucyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdCA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybTogXCJhdXRvXCIsXHJcbiAgICAgICAgICAgICAgICByZXNlcnZlU2Nyb2xsYmFyUmVnaW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB9LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChcImF1dG9cIiA9PT0gb3B0LnBsYXRmb3JtKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gVGhlbWUuZGV0ZWN0VUlQbGF0Zm9ybShvcHQucmVzZXJ2ZVNjcm9sbGJhclJlZ2lvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoVGhlbWUuc2V0Q3VycmVudFVJUGxhdGZvcm0ob3B0LnBsYXRmb3JtKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvcHQucGxhdGZvcm07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInNldEN1cnJlbnRVSVBsYXRmb3JtKCksIGZhaWxlZC4gcGxhdGZvcm06IFwiICsgb3B0LnBsYXRmb3JtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog54++5Zyo5oyH5a6a44GV44KM44Gm44GE44KLIFVJIFBsYXRmb3JtIOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSBleCkgXCJpb3NcIlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0Q3VycmVudFVJUGxhdGZvcm0oKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgJGh0bXMgPSAkKFwiaHRtbFwiKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBUaGVtZS5zX3BsYXRmb3Jtcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICgkaHRtcy5oYXNDbGFzcyhcInVpLXBsYXRmb3JtLVwiICsgVGhlbWUuc19wbGF0Zm9ybXNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFRoZW1lLnNfcGxhdGZvcm1zW2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVUkgUGxhdGZvcm0g44KS6Kit5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IHRydWU6IOaIkOWKnyAvIGZhbHNlOiDlpLHmlZdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNldEN1cnJlbnRVSVBsYXRmb3JtKHBsYXRmb3JtOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gcGxhdGZvcm0gfHwgVGhlbWUuc19wbGF0Zm9ybXMuaW5kZXhPZihwbGF0Zm9ybSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGh0bXMgPSAkKFwiaHRtbFwiKTtcclxuICAgICAgICAgICAgICAgIFRoZW1lLnNfcGxhdGZvcm1zLmZvckVhY2goKHRhcmdldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICRodG1zLnJlbW92ZUNsYXNzKFwidWktcGxhdGZvcm0tXCIgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGxhdGZvcm0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkaHRtcy5hZGRDbGFzcyhcInVpLXBsYXRmb3JtLVwiICsgcGxhdGZvcm0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOePvuWcqOOBriBQbGF0Zm9ybSDjgpLliKTlrprjgZfmnIDpganjgaogcGxhdGZvcm0g44KS6Ieq5YuV5rG65a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcmVzZXJ2ZVNjcm9sbGJhclJlZ2lvbiBQQyDjg4fjg5Djg4PjgrDnkrDlooPjgafjga/jgrnjgq/jg63jg7zjg6vjg5Djg7zjgpLooajnpLouIGRlZmF1bHQ6IHRydWVcclxuICAgICAgICAgKiBAcmV0dXJucyBleCkgXCJpb3NcIlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZGV0ZWN0VUlQbGF0Zm9ybShyZXNlcnZlU2Nyb2xsYmFyUmVnaW9uOiBib29sZWFuID0gdHJ1ZSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGxldCBwbGF0Zm9ybSA9IFwiXCI7XHJcbiAgICAgICAgICAgIC8vIHBsYXRmb3JtIOOBruioreWumlxyXG4gICAgICAgICAgICBpZiAoRnJhbWV3b3JrLlBsYXRmb3JtLmlPUykge1xyXG4gICAgICAgICAgICAgICAgJChcImh0bWxcIikuYWRkQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1pb3NcIik7XHJcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybSA9IFwiaW9zXCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiaHRtbFwiKS5hZGRDbGFzcyhcInVpLXBsYXRmb3JtLWFuZHJvaWRcIik7XHJcbiAgICAgICAgICAgICAgICBwbGF0Zm9ybSA9IFwiYW5kcm9pZFwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFBDIOODh+ODkOODg+OCsOeSsOWig+OBp+OBr+OCueOCr+ODreODvOODq+ODkOODvOOCkuihqOekulxyXG4gICAgICAgICAgICBpZiAoQ29uZmlnLkRFQlVHICYmIHJlc2VydmVTY3JvbGxiYXJSZWdpb24gJiYgIUZyYW1ld29yay5QbGF0Zm9ybS5Nb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICQoXCJib2R5XCIpLmNzcyhcIm92ZXJmbG93LXlcIiwgXCJzY3JvbGxcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHBsYXRmb3JtO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGxhdGZvcm0g44KS6YWN5YiX44Gn55m76YyyXHJcbiAgICAgICAgICog5LiK5pu444GN44GV44KM44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBwbGF0Zm9ybXMgW2luXSBPUyBleCk6IFtcImlvc1wiLCBcImFuZHJvaWRcIl1cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyVUlQbGF0Zm9ybXMocGxhdGZvcm1zOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAocGxhdGZvcm1zKSB7XHJcbiAgICAgICAgICAgICAgICBUaGVtZS5zX3BsYXRmb3JtcyA9IHBsYXRmb3JtcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGFnZSB0cmFuc2l0aW9uIOOCkueZu+mMslxyXG4gICAgICAgICAqIOS4iuabuOOBjeOBleOCjOOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtUcmFuc2l0aW9uTWFwfSBtYXAgW2luXSBUcmFuc2l0aW9uTWFwIOOCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJQYWdlVHJhbnNpdGlvbk1hcChtYXA6IFRyYW5zaXRpb25NYXApOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgVGhlbWUuc19wYWdlVHJhbnNpdGlvbk1hcCA9IG1hcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZGlhbG9nIHRyYW5zaXRpb24g44KS55m76YyyXHJcbiAgICAgICAgICog5LiK5pu444GN44GV44KM44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1RyYW5zaXRpb25NYXB9IG1hcCBbaW5dIFRyYW5zaXRpb25NYXAg44KS5oyH5a6aXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWdpc3RlckRpYWxvZ1RyYW5zaXRpb25NYXAobWFwOiBUcmFuc2l0aW9uTWFwKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChtYXApIHtcclxuICAgICAgICAgICAgICAgIFRoZW1lLnNfZGlhbG9nVHJhbnNpdGlvbk1hcCA9IG1hcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGFnZSB0cmFuc2l0aW9uIOOCkuWPluW+l1xyXG4gICAgICAgICAqIFRyYW5zaXRpb25NYXAg44Gr44Ki44K144Kk44Oz44GV44KM44Gm44GE44KL44KC44Gu44Gn44GC44KM44Gw5aSJ5o+bXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmdbXX0gXCJzbGlkZVwiXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBxdWVyeVBhZ2VUcmFuc2l0aW9uKG9yaWdpbmFsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBjb252ZXJ0ID0gVGhlbWUuc19wYWdlVHJhbnNpdGlvbk1hcFtvcmlnaW5hbF07XHJcbiAgICAgICAgICAgIGlmIChjb252ZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udmVydFtUaGVtZS5nZXRDdXJyZW50VUlQbGF0Zm9ybSgpXSB8fCBjb252ZXJ0LmZhbGxiYWNrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBkaWFsb2cgdHJhbnNpdGlvbiDjgpLlj5blvpdcclxuICAgICAgICAgKiBUcmFuc2l0aW9uTWFwIOOBq+OCouOCteOCpOODs+OBleOCjOOBpuOBhOOCi+OCguOBruOBp+OBguOCjOOBsOWkieaPm1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nW119IFwic2xpZGVcIlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcXVlcnlEaWFsb2dUcmFuc2l0aW9uKG9yaWdpbmFsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBjb252ZXJ0ID0gVGhlbWUuc19kaWFsb2dUcmFuc2l0aW9uTWFwW29yaWdpbmFsXTtcclxuICAgICAgICAgICAgaWYgKGNvbnZlcnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb252ZXJ0W1RoZW1lLmdldEN1cnJlbnRVSVBsYXRmb3JtKCldIHx8IGNvbnZlcnQuZmFsbGJhY2s7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvLyBqcXVleS5tb2JpbGUuY2hhbmdlUGFnZSgpIOOBriBIb29rLlxyXG4gICAgZnVuY3Rpb24gYXBwbHlDdXN0b21DaGFuZ2VQYWdlKCkge1xyXG4gICAgICAgIGNvbnN0IGpxbUNoYW5nZVBhZ2U6ICh0bzogYW55LCBvcHRpb25zPzogQ2hhbmdlUGFnZU9wdGlvbnMpID0+IHZvaWQgPSAkLm1vYmlsZS5jaGFuZ2VQYWdlLmJpbmQoJC5tb2JpbGUpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjdXN0b21DaGFuZ2VQYWdlKHRvOiBhbnksIG9wdGlvbnM/OiBDaGFuZ2VQYWdlT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoXy5pc1N0cmluZyh0bykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudHJhbnNpdGlvbiA9IFRoZW1lLnF1ZXJ5UGFnZVRyYW5zaXRpb24ob3B0aW9ucy50cmFuc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBqcW1DaGFuZ2VQYWdlKHRvLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQubW9iaWxlLmNoYW5nZVBhZ2UgPSBjdXN0b21DaGFuZ2VQYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGZyYW1ld29yayDliJ3mnJ/ljJblvozjgavpgannlKhcclxuICAgIEZyYW1ld29yay53YWl0Rm9ySW5pdGlhbGl6ZSgpXHJcbiAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICAgICAgICBhcHBseUN1c3RvbUNoYW5nZVBhZ2UoKTtcclxuICAgICAgICB9KTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgRG9tRXh0ZW5zaW9uT3B0aW9uc1xyXG4gICAgICogQGJyZWlmIERvbUV4dGVuc2lvbiDjgavmuKHjgZnjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEb21FeHRlbnNpb25PcHRpb25zIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSBEb21FeHRlbnNpb25cclxuICAgICAqIEBicmllZiBET00g5ouh5by16Zai5pWwXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB0eXBlIERvbUV4dGVuc2lvbiA9ICgkdGFyZ2V0OiBKUXVlcnksIERvbUV4dGVuc2lvbk9wdGlvbnM/OiBPYmplY3QpID0+IEpRdWVyeTtcclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIEV4dGVuc2lvbk1hbmFnZXJcclxuICAgICAqIEBicmllZiDmi6HlvLXmqZ/og73jgpLnrqHnkIbjgZnjgovjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEV4dGVuc2lvbk1hbmFnZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX2RvbUV4dGVuc2lvbnM6IERvbUV4dGVuc2lvbltdID0gW107XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERPTSDmi6HlvLXplqLmlbDjga7nmbvpjLJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9ufSBmdW5jIFtpbl0gRE9NIOaLoeW8temWouaVsFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJEb21FeHRlbnNpb24oZnVuYzogRG9tRXh0ZW5zaW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc19kb21FeHRlbnNpb25zLnB1c2goZnVuYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBET00g5ouh5by144KS6YGp55SoXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHVpICAgICAgIFtpbl0g5ouh5by15a++6LGh44GuIERPTVxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNfZG9tRXh0ZW5zaW9ucy5mb3JFYWNoKChmdW5jOiBEb21FeHRlbnNpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGZ1bmMoJHVpLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2UgKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5Ub2FzdF0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgVG9hc3RcclxuICAgICAqIEBicmllZiBBbmRyb2lkIFNESyDjga4gVG9hc3Qg44Kv44Op44K544Gu44KI44GG44Gr6Ieq5YuV5raI5ruF44GZ44KL44Oh44OD44K744O844K45Ye65Yqb44Om44O844OG44Kj44Oq44OG44KjXHJcbiAgICAgKiAgICAgICAg5YWl44KM5a2Q44Gu6Zai5L+C44KS5a6f54++44GZ44KL44Gf44KB44GrIG1vZHVsZSDjgaflrp/oo4VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IG1vZHVsZSBUb2FzdCB7XHJcblxyXG4gICAgICAgIC8vIOihqOekuuaZgumWk+OBruWumue+qVxyXG4gICAgICAgIGV4cG9ydCBsZXQgTEVOR1RIX1NIT1JUID0gMTUwMDsgICAvLyE8IOefreOBhDoxNTAwIG1zZWNcclxuICAgICAgICBleHBvcnQgbGV0IExFTkdUSF9MT05HICA9IDQwMDA7ICAgLy8hPCDplbfjgYQ6NDAwMCBtc2VjXHJcblxyXG4gICAgICAgIC8vISBAZW51bSDjgqrjg5Xjgrvjg4Pjg4jjga7ln7rmupZcclxuICAgICAgICBleHBvcnQgZW51bSBPZmZzZXRYIHtcclxuICAgICAgICAgICAgTEVGVCAgICA9IDB4MDAwMSxcclxuICAgICAgICAgICAgUklHSFQgICA9IDB4MDAwMixcclxuICAgICAgICAgICAgQ0VOVEVSICA9IDB4MDAwNCxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBAZW51bSDjgqrjg5Xjgrvjg4Pjg4jjga7ln7rmupZcclxuICAgICAgICBleHBvcnQgZW51bSBPZmZzZXRZIHtcclxuICAgICAgICAgICAgVE9QICAgICA9IDB4MDAxMCxcclxuICAgICAgICAgICAgQk9UVE9NICA9IDB4MDAyMCxcclxuICAgICAgICAgICAgQ0VOVEVSICA9IDB4MDA0MCxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBpbnRlcmZhY2UgU3R5bGVCdWlsZGVyXHJcbiAgICAgICAgICogQGJyaWVmICAgICDjgrnjgr/jgqTjg6vlpInmm7TmmYLjgavkvb/nlKjjgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAgICAgKiAgICAgICAgICAgIGNzcyDjgavjgrnjgr/jgqTjg6vjgpLpgIPjgYzjgZnloLTlkIjjgIHni6zoh6rjga4gY2xhc3Mg44KS6Kit5a6a44GX44CBZ2V0U3R5bGUg44GvIG51bGwg44KS6L+U44GZ44GT44Go44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTdHlsZUJ1aWxkZXIge1xyXG4gICAgICAgICAgICAvLyEgY2xhc3MgYXR0cmlidXRlIOOBq+ioreWumuOBmeOCi+aWh+Wtl+WIl+OCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRDbGFzcygpOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIC8vISBzdHlsZSBhdHRyaWJ1dGUg44Gr6Kit5a6a44GZ44KLIEpTT04g44Kq44OW44K444Kn44Kv44OI44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldFN0eWxlKCk6IGFueTtcclxuICAgICAgICAgICAgLy8hIOOCquODleOCu+ODg+ODiOOBruWfuua6luS9jee9ruOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRQb2ludCgpOiBudW1iZXI7XHJcbiAgICAgICAgICAgIC8vISBYIOW6p+aomeOBruOCquODleOCu+ODg+ODiOWApOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRYKCk6IG51bWJlcjtcclxuICAgICAgICAgICAgLy8hIFkg5bqn5qiZ44Gu44Kq44OV44K744OD44OI5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFkoKTogbnVtYmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGNsYXNzIFN0eWxlQnVpbGRlckRlZmF1bHRcclxuICAgICAgICAgKiBAYnJpZWYg44K544K/44Kk44Or5aSJ5pu05pmC44Gr5L2/55So44GZ44KL5pei5a6a44Gu5qeL6YCg5L2T44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFN0eWxlQnVpbGRlckRlZmF1bHQgaW1wbGVtZW50cyBTdHlsZUJ1aWxkZXIge1xyXG5cclxuICAgICAgICAgICAgLy8hIGNsYXNzIGF0dHJpYnV0ZSDjgavoqK3lrprjgZnjgovmloflrZfliJfjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0Q2xhc3MoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcInVpLWxvYWRlciB1aS1vdmVybGF5LXNoYWRvdyB1aS1jb3JuZXItYWxsXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vISBzdHlsZSBhdHRyaWJ1dGUg44Gr6Kit5a6a44GZ44KLIEpTT04g44Kq44OW44K444Kn44Kv44OI44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldFN0eWxlKCk6IGFueSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhZGRpbmdcIjogICAgICAgICAgXCI3cHggMjVweCA3cHggMjVweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzcGxheVwiOiAgICAgICAgICBcImJsb2NrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiIzFkMWQxZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6ICAgICBcIiMxYjFiMWJcIixcclxuICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6ICAgICAgICAgICAgXCIjZmZmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0LXNoYWRvd1wiOiAgICAgIFwiMCAxcHggMCAjMTExXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJmb250LXdlaWdodFwiOiAgICAgIFwiYm9sZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib3BhY2l0eVwiOiAgICAgICAgICAwLjgsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyEg44Kq44OV44K744OD44OI44Gu5Z+65rqW5L2N572u44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFBvaW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2Zmc2V0WC5DRU5URVIgfCBPZmZzZXRZLkJPVFRPTTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8hIFgg5bqn5qiZ44Gu44Kq44OV44K744OD44OI5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyEgWSDluqfmqJnjga7jgqrjg5Xjgrvjg4Pjg4jlgKTjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0T2Zmc2V0WSgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC03NTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVG9hc3Qg6KGo56S6XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZSAgW2luXSDjg6Hjg4Pjgrvjg7zjgrhcclxuICAgICAgICAgKiBAcGFyYW0gZHVyYXRpb24gW2luXSDooajnpLrmmYLplpPjgpLoqK3lrpogKG1zZWMpIGRlZmF1bHQ6IExFTkdUSF9TSE9SVFxyXG4gICAgICAgICAqIEBwYXJhbSBzdHlsZSAgICBbaW5dIOOCueOCv+OCpOODq+WkieabtOOBmeOCi+WgtOWQiOOBq+OBr+a0vueUn+OCr+ODqeOCueOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBzaG93KG1lc3NhZ2U6IHN0cmluZywgZHVyYXRpb246IG51bWJlciA9IFRvYXN0LkxFTkdUSF9TSE9SVCwgc3R5bGU/OiBTdHlsZUJ1aWxkZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgJG1vYmlsZSA9ICQubW9iaWxlO1xyXG4gICAgICAgICAgICBjb25zdCBpbmZvID0gc3R5bGUgfHwgbmV3IFN0eWxlQnVpbGRlckRlZmF1bHQoKTtcclxuICAgICAgICAgICAgY29uc3Qgc2V0Q1NTID0gaW5mby5nZXRTdHlsZSgpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLy8g5pS56KGM44Kz44O844OJ44GvIDxici8+IOOBq+e9ruaPm+OBmeOCi1xyXG4gICAgICAgICAgICBjb25zdCBtc2cgPSBtZXNzYWdlLnJlcGxhY2UoL1xcbi9nLCBcIjxici8+XCIpO1xyXG5cclxuICAgICAgICAgICAgLy8g44Oh44OD44K744O844K4IGVsZW1lbnQg44Gu5YuV55qE55Sf5oiQXHJcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSBcIjxkaXY+XCIgKyBtc2cgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICBjb25zdCBib3ggPSAkKGh0bWwpLmFkZENsYXNzKGluZm8uZ2V0Q2xhc3MoKSk7XHJcbiAgICAgICAgICAgIGlmIChzZXRDU1MpIHtcclxuICAgICAgICAgICAgICAgIGJveC5jc3MoaW5mby5nZXRTdHlsZSgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g6Ieq5YuV5pS56KGM44GV44KM44Gm44KC44KI44GE44KI44GG44Gr44CB5Z+654K544KS6Kit5a6a44GX44Gm44GL44KJ6L+95YqgXHJcbiAgICAgICAgICAgIGJveC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgXCJ0b3BcIjogMCxcclxuICAgICAgICAgICAgICAgIFwibGVmdFwiOiAwLFxyXG4gICAgICAgICAgICB9KS5hcHBlbmRUbygkbW9iaWxlLnBhZ2VDb250YWluZXIpO1xyXG5cclxuICAgICAgICAgICAgLy8g6YWN572u5L2N572u44Gu5rG65a6aXHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldFBvaW50ID0gaW5mby5nZXRPZmZzZXRQb2ludCgpO1xyXG4gICAgICAgICAgICBjb25zdCAkd2luZG93ID0gJCh3aW5kb3cpO1xyXG4gICAgICAgICAgICBsZXQgcG9zWCwgcG9zWTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJveF93aWR0aCA9IGJveC53aWR0aCgpICsgcGFyc2VJbnQoYm94LmNzcyhcInBhZGRpbmctbGVmdFwiKSwgMTApICsgcGFyc2VJbnQoYm94LmNzcyhcInBhZGRpbmctcmlnaHRcIiksIDEwKTtcclxuICAgICAgICAgICAgY29uc3QgYm94X2hlaWdodCA9IGJveC5oZWlnaHQoKSArIHBhcnNlSW50KGJveC5jc3MoXCJwYWRkaW5nLXRvcFwiKSwgMTApICsgcGFyc2VJbnQoYm94LmNzcyhcInBhZGRpbmctYm90dG9tXCIpLCAxMCk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKG9mZnNldFBvaW50ICYgMHgwMDBGKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFguTEVGVDpcclxuICAgICAgICAgICAgICAgICAgICBwb3NYID0gMCArIGluZm8uZ2V0T2Zmc2V0WCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRYLlJJR0hUOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSAkd2luZG93LndpZHRoKCkgLSBib3hfd2lkdGggKyBpbmZvLmdldE9mZnNldFgoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgT2Zmc2V0WC5DRU5URVI6XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWCA9ICgkd2luZG93LndpZHRoKCkgLyAyKSAtIChib3hfd2lkdGggLyAyKSArIGluZm8uZ2V0T2Zmc2V0WCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ3YXJuLiB1bmtub3duIG9mZnNldFBvaW50OlwiICsgKG9mZnNldFBvaW50ICYgMHgwMDBGKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWCA9ICgkd2luZG93LndpZHRoKCkgLyAyKSAtIChib3hfd2lkdGggLyAyKSArIGluZm8uZ2V0T2Zmc2V0WCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKG9mZnNldFBvaW50ICYgMHgwMEYwKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFkuVE9QOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1kgPSAwICsgaW5mby5nZXRPZmZzZXRZKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFkuQk9UVE9NOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1kgPSAkd2luZG93LmhlaWdodCgpIC0gYm94X2hlaWdodCArIGluZm8uZ2V0T2Zmc2V0WSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRZLkNFTlRFUjpcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gKCR3aW5kb3cuaGVpZ2h0KCkgLyAyKSAtIChib3hfaGVpZ2h0IC8gMikgKyBpbmZvLmdldE9mZnNldFkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwid2Fybi4gdW5rbm93biBvZmZzZXRQb2ludDpcIiArIChvZmZzZXRQb2ludCAmIDB4MDBGMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc1kgPSAoJHdpbmRvdy5oZWlnaHQoKSAvIDIpIC0gKGJveF9oZWlnaHQgLyAyKSArIGluZm8uZ2V0T2Zmc2V0WSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDooajnpLpcclxuICAgICAgICAgICAgYm94LmNzcyh7XHJcbiAgICAgICAgICAgICAgICBcInRvcFwiOiBwb3NZLFxyXG4gICAgICAgICAgICAgICAgXCJsZWZ0XCI6IHBvc1gsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5kZWxheShkdXJhdGlvbilcclxuICAgICAgICAgICAgLmZhZGVPdXQoNDAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IFByb21pc2UgICAgICA9IENEUC5Qcm9taXNlO1xyXG4gICAgaW1wb3J0IEZyYW1ld29yayAgICA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkRpYWxvZ10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIL1cgQmFjayBLZXkgSG9vayDplqLmlbBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IHR5cGUgRGlhbG9nQmFja0tleUhhbmRsZXIgPSAoZXZlbnQ/OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIERpYWxvZ09wdGlvbnNcclxuICAgICAqICAgICAgICAgICAg44OA44Kk44Ki44Ot44Kw44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGlhbG9nT3B0aW9ucyBleHRlbmRzIFBvcHVwT3B0aW9ucyB7XHJcbiAgICAgICAgc3JjPzogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IHRlbXBsYXRlIOODleOCoeOCpOODq+OBruODkeOCuSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxyXG4gICAgICAgIHRpdGxlPzogc3RyaW5nOyAgICAgICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSDjg4DjgqTjgqLjg63jgrDjgr/jgqTjg4jjg6sgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxyXG4gICAgICAgIG1lc3NhZ2U/OiBzdHJpbmc7ICAgICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSDjg6HjgqTjg7Pjg6Hjg4Pjgrvjg7zjgrggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXHJcbiAgICAgICAgaWRQb3NpdGl2ZT86IHN0cmluZzsgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IFBvc2l0aXZlIOODnOOCv+ODs+OBrklEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiZGxnLWJ0bi1wb3NpdGl2ZVwiXHJcbiAgICAgICAgaWROZWdhdGl2ZT86IHN0cmluZzsgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IE5hZ2F0aXZlIOODnOOCv+ODs+OBrklEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiZGxnLWJ0bi1uZWdhdGl2ZVwiXHJcbiAgICAgICAgZXZlbnQ/OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IERpYWxvZyDjgq/jg6njgrnjgYznrqHnkIbjgZnjgovjgqTjg5njg7Pjg4ggICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJ2Y2xpY2tcIlxyXG4gICAgICAgIGRlZmF1bHRBdXRvQ2xvc2U/OiBib29sZWFuOyAgICAgLy8hPCB7Qm9vbGVhbn0gZGF0YS1hdXRvLWNsb3NlIOOBjOaMh+WumuOBleOCjOOBpuOBhOOBquOBhOWgtOWQiOOBruaXouWumuWApCAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgZm9yY2VPdmVyd3JpdGVBZnRlckNsb3NlPzogYm9vbGVhbjsgLy8hPCB7Qm9vbGVhbn0gYWZ0ZXJjbG9zZSDjgqrjg5fjgrfjg6fjg7PjgpLlvLfliLbkuIrmm7jjgY3jgZnjgovjgZ/jgoHjga7oqK3lrpogICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICBsYWJlbFBvc2l0aXZlPzogc3RyaW5nOyAgICAgICAgIC8vITwge1N0cmluZ30gUG9zaXRpdmUg44Oc44K/44Oz44Op44OZ44OrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcIk9LXCJcclxuICAgICAgICBsYWJlbE5lZ2F0aXZlPzogc3RyaW5nOyAgICAgICAgIC8vITwge1N0cmluZ30gTmVnYXRpdmUg44Oc44K/44Oz44Op44OZ44OrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcIkNhbmNlbFwiXHJcbiAgICAgICAgYmFja0tleT86IFwiY2xvc2VcIiB8IFwiZGVueVwiIHwgRGlhbG9nQmFja0tleUhhbmRsZXI7ICAvLyE8IEgvVyBiYWNrS2V5IOOBruaMr+OCi+iInuOBhCAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJjbG9zZVwiXHJcbiAgICAgICAgc2Nyb2xsRXZlbnQ/OiBcImRlbnlcIiB8IFwiYWxsb3dcIiB8IFwiYWRqdXN0XCI7ICAgLy8hPCB7U3RyaW5nfSBzY3JvbGzjga7mipHmraLmlrnlvI8gICjigLsgYWRqdXN0IOOBr+ippumok+eahCkgICAgIGRlZmF1bHQ6IFwiZGVueVwiXHJcbiAgICAgICAgZG9tRXh0ZW5zaW9uT3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnM7ICAgLy8hPCBET03mi6HlvLXjgqrjg5fjgrfjg6fjg7MuIG51bGx8dW5kZWZpbmVkIOOBp+aLoeW8teOBl+OBquOBhCAgICAgIGRlZmF1bHQ6IHt9XHJcbiAgICAgICAgW3g6IHN0cmluZ106IGFueTsgICAgICAgICAgICAgICAvLyE8IGFueSBkaWFsb2cgdGVtcGxhdGUgcGFyYW1ldGVycy5cclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIERpYWxvZ1xyXG4gICAgICogQGJyaWVmIOaxjueUqOODgOOCpOOCouODreOCsOOCr+ODqeOCuVxyXG4gICAgICogICAgICAgIGpRTSDjga4gcG9wdXAgd2lkZ2V0IOOBq+OCiOOBo+OBpuWun+ijhVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgRGlhbG9nIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGU6IFRvb2xzLkpTVCA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfc2V0dGluZ3M6IERpYWxvZ09wdGlvbnMgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgXyRkaWFsb2c6IEpRdWVyeSA9IG51bGw7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfYWN0aXZlRGlhbG9nOiBEaWFsb2cgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfb2xkQmFja0tleUhhbmRsZXI6IChldmVudD86IEpRdWVyeS5FdmVudCkgPT4gdm9pZCA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19kZWZhdWx0T3B0aW9uczogRGlhbG9nT3B0aW9ucyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gaWQgICAgICB7U3RyaW5nfSAgICAgICAgW2luXSDjg4DjgqTjgqLjg63jgrAgRE9NIElEIOOCkuaMh+WumiBleCkgI2RpYWxvZy1ob2dlXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0RpYWxvZ09wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ09wdGlvbnMpIHtcclxuICAgICAgICAgICAgLy8gRGlhbG9nIOWFsemAmuioreWumuOBruWIneacn+WMllxyXG4gICAgICAgICAgICBEaWFsb2cuaW5pdENvbW1vbkNvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICAvLyDoqK3lrprjgpLmm7TmlrBcclxuICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgRGlhbG9nLnNfZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAvLyDjg4DjgqTjgqLjg63jgrDjg4bjg7Pjg5fjg6zjg7zjg4jjgpLkvZzmiJBcclxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBUb29scy5UZW1wbGF0ZS5nZXRKU1QoaWQsIHRoaXMuX3NldHRpbmdzLnNyYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOihqOekulxyXG4gICAgICAgICAqIOihqOekuuOCkuOBl+OBpuWni+OCgeOBpiBET00g44GM5pyJ5Yq544Gr44Gq44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7RGlhbG9nT3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7MgKHNyYyDjga/nhKHoppbjgZXjgozjgospXHJcbiAgICAgICAgICogQHJldHVybiDjg4DjgqTjgqLjg63jgrDjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzaG93KG9wdGlvbnM/OiBEaWFsb2dPcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgY29uc3QgJGRvY3VtZW50ID0gJChkb2N1bWVudCk7XHJcbiAgICAgICAgICAgIGNvbnN0ICRib2R5ID0gJChcImJvZHlcIik7XHJcbiAgICAgICAgICAgIGNvbnN0ICRwYWdlID0gKDxhbnk+JGJvZHkpLnBhZ2Vjb250YWluZXIoXCJnZXRBY3RpdmVQYWdlXCIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb2ZjSGlkZGVuID0ge1xyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvd1wiOiAgICAgXCJoaWRkZW5cIixcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteFwiOiAgIFwiaGlkZGVuXCIsXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXlcIjogICBcImhpZGRlblwiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBvZmNCb2R5ID0geyAvLyBib2R5IG92ZXJmbG93IGNvbnRleHRcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3dcIjogICAgICRib2R5LmNzcyhcIm92ZXJmbG93XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvdy14XCI6ICAgJGJvZHkuY3NzKFwib3ZlcmZsb3cteFwiKSxcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteVwiOiAgICRib2R5LmNzcyhcIm92ZXJmbG93LXlcIiksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudFNjcm9sbFBvcyA9ICRib2R5LnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICBjb25zdCBvZmNQYWdlID0geyAvLyBwYWdlIG92ZXJmbG93IGNvbnRleHRcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3dcIjogICAgICRwYWdlLmNzcyhcIm92ZXJmbG93XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvdy14XCI6ICAgJHBhZ2UuY3NzKFwib3ZlcmZsb3cteFwiKSxcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteVwiOiAgICRwYWdlLmNzcyhcIm92ZXJmbG93LXlcIiksXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzY3JvbGxFdmVudCA9IFwic2Nyb2xsIHRvdWNobW92ZSBtb3VzZW1vdmUgTVNQb2ludGVyTW92ZVwiO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsSGFuZGVyID0gKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChcImRlbnlcIiA9PT0gdGhpcy5fc2V0dGluZ3Muc2Nyb2xsRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImFkanVzdFwiID09PSB0aGlzLl9zZXR0aW5ncy5zY3JvbGxFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRib2R5LnNjcm9sbFRvcChwYXJlbnRTY3JvbGxQb3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gb3B0aW9uIOOBjOaMh+WumuOBleOCjOOBpuOBhOOBn+WgtOWQiOabtOaWsFxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB0aGlzLl9zZXR0aW5ncywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGFmdGVyY2xvc2Ug5Yem55CG44GvIERpYWxvZyDjga7noLTmo4Tlh6bnkIbjgpLlrp/oo4XjgZnjgovjgZ/jgoHln7rmnKznmoTjgavoqK3lrprnpoHmraIgKOW8t+WItuS4iuabuOOBjeODouODvOODieOCkuioreWumuS9v+eUqOWPrylcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmFmdGVyY2xvc2UgJiYgIXRoaXMuX3NldHRpbmdzLmZvcmNlT3ZlcndyaXRlQWZ0ZXJDbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiY2Fubm90IGFjY2VwdCAnYWZ0ZXJjbG9zZScgb3B0aW9uLiBwbGVhc2UgaW5zdGVhZCB1c2luZyAncG9wdXBhZnRlcmNsb3NlJyBldmVudC5cIik7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fc2V0dGluZ3MuYWZ0ZXJjbG9zZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gdGl0bGUg44Gu5pyJ54ShXHJcbiAgICAgICAgICAgICg8YW55PnRoaXMuX3NldHRpbmdzKS5fdGl0bGVTdGF0ZSA9IHRoaXMuX3NldHRpbmdzLnRpdGxlID8gXCJ1aS1oYXMtdGl0bGVcIiA6IFwidWktbm8tdGl0bGVcIjtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHRlbXBsYXRlIOOBi+OCiSBqUXVlcnkg44Kq44OW44K444Kn44Kv44OI44KS5L2c5oiQ44GX44CBXHJcbiAgICAgICAgICAgICAqIDxib2R5PiDnm7TkuIvjgavov73liqAuXHJcbiAgICAgICAgICAgICAqICRwYWdlIOOBp+OBryBCYWNrYm9uZSBldmVudCDjgpLlj5fjgZHjgonjgozjgarjgYTjgZPjgajjgavms6jmhI9cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cgPSAkKHRoaXMuX3RlbXBsYXRlKHRoaXMuX3NldHRpbmdzKSk7XHJcbiAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cubG9jYWxpemUoKTtcclxuICAgICAgICAgICAgJGJvZHkuYXBwZW5kKHRoaXMuXyRkaWFsb2cpO1xyXG5cclxuICAgICAgICAgICAgLy8gdGhlbWUg44KS6Kej5rG6XHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZVRoZW1lKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl8kZGlhbG9nXHJcbiAgICAgICAgICAgICAgICAub24oXCJwb3B1cGNyZWF0ZVwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOOCueOCr+ODreODvOODq+OCkuaKkeatolxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcImFsbG93XCIgIT09IHRoaXMuX3NldHRpbmdzLnNjcm9sbEV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vbihzY3JvbGxFdmVudCwgc2Nyb2xsSGFuZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJGJvZHkuY3NzKG9mY0hpZGRlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBhZ2UuY3NzKG9mY0hpZGRlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgRGlhbG9nLnJlZ2lzdGVyKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5lbmhhbmNlV2l0aGluKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBET00g5ouh5by1XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX3NldHRpbmdzLmRvbUV4dGVuc2lvbk9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIEV4dGVuc2lvbk1hbmFnZXIuYXBwbHlEb21FeHRlbnNpb24odGhpcy5fJGRpYWxvZywgdGhpcy5fc2V0dGluZ3MuZG9tRXh0ZW5zaW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMub25CZWZvcmVTaG93KClcclxuICAgICAgICAgICAgICAgIC5kb25lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDooajnpLpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kZGlhbG9nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wb3B1cCgkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25UbzogXCJ3aW5kb3dcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyY2xvc2U6IChldmVudDogSlF1ZXJ5LkV2ZW50LCB1aTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g44K544Kv44Ot44O844Or54q25oWL44KS5oi744GZXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHBhZ2UuY3NzKG9mY1BhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRib2R5LmNzcyhvZmNCb2R5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXCJhbGxvd1wiICE9PSB0aGlzLl9zZXR0aW5ncy5zY3JvbGxFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub2ZmKHNjcm9sbEV2ZW50LCBzY3JvbGxIYW5kZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEaWFsb2cucmVnaXN0ZXIobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl8kZGlhbG9nID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMuX3NldHRpbmdzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnBvcHVwKFwib3BlblwiKS5vbih0aGlzLl9zZXR0aW5ncy5ldmVudCwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiZGF0YS1hdXRvLWNsb3NlPSdmYWxzZSdcIiDjgYzmjIflrprjgZXjgozjgabjgYTjgovopoHntKDjga8gZGlhbG9nIOOCkumWieOBmOOBquOBhFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF1dG9DbG9zZSA9ICQoZXZlbnQudGFyZ2V0KS5hdHRyKFwiZGF0YS1hdXRvLWNsb3NlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgPT0gYXV0b0Nsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b0Nsb3NlID0gdGhpcy5fc2V0dGluZ3MuZGVmYXVsdEF1dG9DbG9zZSA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFwiZmFsc2VcIiA9PT0gYXV0b0Nsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5mYWlsKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJEaWFsb2cuc2hvdygpIGZhaWxlZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuXyRkaWFsb2cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZy50cmlnZ2VyKFwiZXJyb3JcIiwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRkaWFsb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDntYLkuoZcclxuICAgICAgICAgKiDln7rmnKznmoTjgavjga/oh6rli5XjgafplonjgZjjgovjgYzjgIFcclxuICAgICAgICAgKiDooajnpLrkuK3jga7jg4DjgqTjgqLjg63jgrDjgpLjgq/jg6njgqTjgqLjg7Pjg4jlgbTjgYvjgonplonjgZjjgovjg6Hjgr3jg4Pjg4lcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgY2xvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl8kZGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kZGlhbG9nLnBvcHVwKFwiY2xvc2VcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg4DjgqTjgqLjg63jgrAgZWxlbWVudCDjgpLlj5blvpdcclxuICAgICAgICBwdWJsaWMgZ2V0ICRlbCgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJGRpYWxvZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJvdGVjdGVkIG1ldGhvZHM6IE92ZXJyaWRlXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODgOOCpOOCouODreOCsOihqOekuuOBruebtOWJjVxyXG4gICAgICAgICAqIERPTSDjgpLmk43kvZzjgafjgY3jgovjgr/jgqTjg5/jg7PjgrDjgaflkbzjgbPlh7rjgZXjgozjgosuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtJUHJvbWlzZUJhc2V9IHByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQmVmb3JlU2hvdygpOiBJUHJvbWlzZUJhc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHZvaWQ+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg4DjgqTjgqLjg63jgrDjga7kvb/nlKjjgZnjgosgVGhlbWUg44KS6Kej5rG6XHJcbiAgICAgICAgICog5LiN6KaB44Gq5aC05ZCI44Gv44Kq44O844OQ44O844Op44Kk44OJ44GZ44KL44GT44Go44KC5Y+v6IO9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlc29sdmVUaGVtZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgcXVlcnlUaGVtZSA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQoXCIudWktcGFnZS1hY3RpdmVcIikuanFtRGF0YShcInRoZW1lXCIpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZVRoZW1lOiBzdHJpbmc7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3NldHRpbmdzLnRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkb21UaGVtZSA9IHRoaXMuXyRkaWFsb2cuanFtRGF0YShcInRoZW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkb21UaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzLnRoZW1lID0gY2FuZGlkYXRlVGhlbWUgPSBxdWVyeVRoZW1lKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fc2V0dGluZ3Mub3ZlcmxheVRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkb21PdmVybGF5VGhlbWUgPSB0aGlzLl8kZGlhbG9nLmpxbURhdGEoXCJvdmVybGF5LXRoZW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkb21PdmVybGF5VGhlbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXR0aW5ncy5vdmVybGF5VGhlbWUgPSBjYW5kaWRhdGVUaGVtZSB8fCBxdWVyeVRoZW1lKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHRyYW5zaXRpb24g44Gu5pu05pawXHJcbiAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzLnRyYW5zaXRpb24gPSBUaGVtZS5xdWVyeURpYWxvZ1RyYW5zaXRpb24odGhpcy5fc2V0dGluZ3MudHJhbnNpdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEaWFsb2cg44Gu5pei5a6a44Kq44OX44K344On44Oz44KS5pu05pawXHJcbiAgICAgICAgICog44GZ44G544Gm44GuIERpYWxvZyDjgYzkvb/nlKjjgZnjgovlhbHpgJroqK3lrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtEaWFsb2dPcHRpb25zfSBbaW5dIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2V0RGVmYXVsdE9wdGlvbnMob3B0aW9uczogRGlhbG9nT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBEaWFsb2cg5YWx6YCa6Kit5a6a44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICAgIERpYWxvZy5pbml0Q29tbW9uQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIERpYWxvZy5zX2RlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vIOePvuWcqCBhY3RpdmUg44Gq44OA44Kk44Ki44Ot44Kw44Go44GX44Gm55m76Yyy44GZ44KLXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVnaXN0ZXIoZGlhbG9nOiBEaWFsb2cpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gZGlhbG9nICYmIG51bGwgIT0gRGlhbG9nLnNfYWN0aXZlRGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJuZXcgZGlhbG9nIHByb2MgaXMgY2FsbGVkIGluIHRoZSBwYXN0IGRpYWxvZydzIG9uZS4gdXNlIHNldFRpbWVvdXQoKSBmb3IgcG9zdCBwcm9jZXNzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEaWFsb2cuc19hY3RpdmVEaWFsb2cgPSBkaWFsb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEaWFsb2cg5YWx6YCa6Kit5a6a44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgaW5pdENvbW1vbkNvbmRpdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gRnJhbWV3b3JrIOOBruWIneacn+WMluW+jOOBq+WHpueQhuOBmeOCi+W/heimgeOBjOOBguOCi1xyXG4gICAgICAgICAgICBpZiAoIUZyYW1ld29yay5pc0luaXRpYWxpemVkKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImluaXRDb21tb25Db25kaXRpb24oKSBzaG91bGQgYmUgY2FsbGVkIGFmdGVyIEZyYW1ld29yay5pbml0aWFsaXplZC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChudWxsID09IERpYWxvZy5zX29sZEJhY2tLZXlIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBCYWNrIEJ1dHRvbiBIYW5kbGVyXHJcbiAgICAgICAgICAgICAgICBEaWFsb2cuc19vbGRCYWNrS2V5SGFuZGxlciA9IENEUC5zZXRCYWNrQnV0dG9uSGFuZGxlcihudWxsKTtcclxuICAgICAgICAgICAgICAgIENEUC5zZXRCYWNrQnV0dG9uSGFuZGxlcihEaWFsb2cuY3VzdG9tQmFja0tleUhhbmRsZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOaXouWumuOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAgICAgICAgRGlhbG9nLnNfZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWRQb3NpdGl2ZTogICAgICAgICAgICAgXCJkbGctYnRuLXBvc2l0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaWROZWdhdGl2ZTogICAgICAgICAgICAgXCJkbGctYnRuLW5lZ2F0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6ICAgICAgICAgICAgICAgICAgRnJhbWV3b3JrLmdldERlZmF1bHRDbGlja0V2ZW50KCksXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzbWlzc2libGU6ICAgICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdEF1dG9DbG9zZTogICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogICAgICAgICAgICAgXCJwbGF0Zm9ybS1kZWZhdWx0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxQb3NpdGl2ZTogICAgICAgICAgXCJPS1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsTmVnYXRpdmU6ICAgICAgICAgIFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja0tleTogICAgICAgICAgICAgICAgXCJjbG9zZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbEV2ZW50OiAgICAgICAgICAgIFwiZGVueVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM6ICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSC9XIEJhY2sgQnV0dG9uIEhhbmRsZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21CYWNrS2V5SGFuZGxlcihldmVudD86IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBEaWFsb2cuc19hY3RpdmVEaWFsb2cpIHtcclxuICAgICAgICAgICAgICAgIGlmIChcImNsb3NlXCIgPT09IERpYWxvZy5zX2FjdGl2ZURpYWxvZy5fc2V0dGluZ3MuYmFja0tleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIERpYWxvZy5zX2FjdGl2ZURpYWxvZy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBEaWFsb2cuc19hY3RpdmVEaWFsb2cuX3NldHRpbmdzLmJhY2tLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAoPERpYWxvZ0JhY2tLZXlIYW5kbGVyPkRpYWxvZy5zX2FjdGl2ZURpYWxvZy5fc2V0dGluZ3MuYmFja0tleSkoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBEaWFsb2cg44GMIGFjdGl2ZSDjgarloLTlkIjjgIHluLjjgavml6Llrprjga7jg4/jg7Pjg4njg6njgavjga/muKHjgZXjgarjgYRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEaWFsb2cuc19vbGRCYWNrS2V5SGFuZGxlcihldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkRpYWxvZ0NvbW1vbnNdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWxlcnRcclxuICAgICAqIGFsZXJ0IOODoeODg+OCu+ODvOOCuOihqOekulxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICAgW2luXSDooajnpLrmloflrZfliJdcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uc10gW2luXSDjg4DjgqTjgqLjg63jgrDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEByZXR1cm4ge2pRdWVyeX0g44OA44Kk44Ki44Ot44Kw44GuIERPTSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGFsZXJ0KG1lc3NhZ2U6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ09wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYFxyXG4gICAgICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInVpLW1vZGFsXCIgZGF0YS1yb2xlPVwicG9wdXBcIiBkYXRhLWNvcm5lcnM9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzcz1cInVpLXRpdGxlIHt7X3RpdGxlU3RhdGV9fVwiPnt7dGl0bGV9fTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidWktbWVzc2FnZVwiPnt7bWVzc2FnZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1tb2RhbC1mb290ZXIgdWktZ3JpZC1zb2xvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkUG9zaXRpdmV9fVwiIGNsYXNzPVwidWktYnRuIHVpLWJsb2NrLWEgdWktdGV4dC1lbXBoYXNpc1wiIGRhdGEtYXV0by1jbG9zZT1cInRydWVcIj57e2xhYmVsUG9zaXRpdmV9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjb25zdCBkbGdBbGVydCA9IG5ldyBEaWFsb2codGVtcGxhdGUsICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIHNyYzogbnVsbCxcclxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICB9LCBvcHRpb25zKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkbGdBbGVydC5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25maXJtXHJcbiAgICAgKiDnorroqo3jg6Hjg4Pjgrvjg7zjgrjooajnpLpcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgIFtpbl0g6KGo56S65paH5a2X5YiXXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnNdIFtpbl0g44OA44Kk44Ki44Ot44Kw44Kq44OX44K344On44OzXHJcbiAgICAgKiBAcmV0dXJuIHtqUXVlcnl9IOODgOOCpOOCouODreOCsOOBriBET00g44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjb25maXJtKG1lc3NhZ2U6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ09wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYFxyXG4gICAgICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInVpLW1vZGFsXCIgZGF0YS1yb2xlPVwicG9wdXBcIiBkYXRhLWNvcm5lcnM9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzcz1cInVpLXRpdGxlIHt7X3RpdGxlU3RhdGV9fVwiPnt7dGl0bGV9fTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidWktbWVzc2FnZVwiPnt7bWVzc2FnZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1tb2RhbC1mb290ZXIgdWktZ3JpZC1hXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkTmVnYXRpdmV9fVwiIGNsYXNzPVwidWktYnRuIHVpLWJsb2NrLWFcIiBkYXRhLWF1dG8tY2xvc2U9XCJ0cnVlXCI+e3tsYWJlbE5lZ2F0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInt7aWRQb3NpdGl2ZX19XCIgY2xhc3M9XCJ1aS1idG4gdWktYmxvY2stYiB1aS10ZXh0LWVtcGhhc2lzXCIgZGF0YS1hdXRvLWNsb3NlPVwidHJ1ZVwiPnt7bGFiZWxQb3NpdGl2ZX19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgIDwvc2NyaXB0PlxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgICAgIGNvbnN0IGRsZ0NvbmZpcm0gPSBuZXcgRGlhbG9nKHRlbXBsYXRlLCAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBzcmM6IG51bGwsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgfSwgb3B0aW9ucykpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGxnQ29uZmlybS5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIERpYWxvZ0NvbW1vbnNPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgcHJvbXB0IOOBruOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERpYWxvZ1Byb21wdE9wdGlvbnMgZXh0ZW5kcyBEaWFsb2dPcHRpb25zIHtcclxuICAgICAgICBldmVudE9LPzogc3RyaW5nOyAvLyE8IE9LIOODnOOCv+ODs+aKvOS4i+aZguOBriBldmVudDogZGVmYXVsdDogcHJvbXB0b2tcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBEaWFsb2dQcm9tcHRcclxuICAgICAqIEBicmllZiBwcm9tcHQg44OA44Kk44Ki44Ot44KwICjpnZ7lhazplospXHJcbiAgICAgKi9cclxuICAgIGNsYXNzIERpYWxvZ1Byb21wdCBleHRlbmRzIERpYWxvZyB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2V2ZW50T0s6IHN0cmluZztcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dQcm9tcHRPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGlkLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRPSyA9IG9wdGlvbnMuZXZlbnRPSyB8fCBcInByb21wdG9rXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OA44Kk44Ki44Ot44Kw6KGo56S644Gu55u05YmNXHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQmVmb3JlU2hvdygpOiBJUHJvbWlzZUJhc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICBjb25zdCBvbkNvbW1pdCA9IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy4kZWwuZmluZChcIiNfdWktcHJvbXB0XCIpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWwudHJpZ2dlcih0aGlzLl9ldmVudE9LLCB0ZXh0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLiRlbFxyXG4gICAgICAgICAgICAgICAgLm9uKFwidmNsaWNrXCIsIFwiLmNvbW1hbmQtcHJvbXB0LW9rIFwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIG9uQ29tbWl0KGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAub24oXCJrZXlkb3duXCIsIFwiI191aS1wcm9tcHRcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBFTlRFUl9LRVlfQ09ERSA9IDEzO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChFTlRFUl9LRVlfQ09ERSA9PT0gZXZlbnQua2V5Q29kZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNvbW1pdChldmVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIub25CZWZvcmVTaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvbXB0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgICBbaW5dIOihqOekuuaWh+Wtl+WIl1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zXSBbaW5dIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHJldHVybiB7alF1ZXJ5fSDjg4DjgqTjgqLjg63jgrDjga4gRE9NIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcHJvbXB0KG1lc3NhZ2U6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ1Byb21wdE9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYFxyXG4gICAgICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInVpLW1vZGFsXCIgZGF0YS1yb2xlPVwicG9wdXBcIiBkYXRhLWNvcm5lcnM9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzcz1cInVpLXRpdGxlIHt7X3RpdGxlU3RhdGV9fVwiPnt7dGl0bGV9fTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidWktbWVzc2FnZVwiPnt7bWVzc2FnZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiX3VpLXByb21wdFwiIGNsYXNzPVwidWktaGlkZGVuLWFjY2Vzc2libGVcIj48L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiX3VpLXByb21wdFwiIGlkPVwiX3VpLXByb21wdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1tb2RhbC1mb290ZXIgdWktZ3JpZC1hXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkTmVnYXRpdmV9fVwiIGNsYXNzPVwidWktYnRuIHVpLWJsb2NrLWFcIiBkYXRhLWF1dG8tY2xvc2U9XCJ0cnVlXCI+e3tsYWJlbE5lZ2F0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInt7aWRQb3NpdGl2ZX19XCIgY2xhc3M9XCJjb21tYW5kLXByb21wdC1vayB1aS1idG4gdWktYmxvY2stYiB1aS10ZXh0LWVtcGhhc2lzXCIgZGF0YS1hdXRvLWNsb3NlPVwiZmFsc2VcIj57e2xhYmVsUG9zaXRpdmV9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjb25zdCBkbGdQcm9tcHQgPSBuZXcgRGlhbG9nUHJvbXB0KHRlbXBsYXRlLCAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBzcmM6IG51bGwsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgfSwgb3B0aW9ucykpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGxnUHJvbXB0LnNob3coKTtcclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgUm91dGVyICAgICAgID0gQ0RQLkZyYW1ld29yay5Sb3V0ZXI7XHJcbiAgICBpbXBvcnQgSVBhZ2UgICAgICAgID0gQ0RQLkZyYW1ld29yay5JUGFnZTtcclxuICAgIGltcG9ydCBNb2RlbCAgICAgICAgPSBDRFAuRnJhbWV3b3JrLk1vZGVsO1xyXG4gICAgaW1wb3J0IFZpZXcgICAgICAgICA9IENEUC5GcmFtZXdvcmsuVmlldztcclxuICAgIGltcG9ydCBWaWV3T3B0aW9ucyAgPSBDRFAuRnJhbWV3b3JrLlZpZXdPcHRpb25zO1xyXG4gICAgaW1wb3J0IFRlbXBsYXRlICAgICA9IENEUC5Ub29scy5UZW1wbGF0ZTtcclxuICAgIGltcG9ydCBKU1QgICAgICAgICAgPSBDRFAuVG9vbHMuSlNUO1xyXG5cclxuICAgIGNvbnN0IFRBRzogc3RyaW5nID0gXCJbQ0RQLlVJLkJhc2VIZWFkZXJWaWV3XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgQmFzZUhlYWRlclZpZXdPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgQmFzZUhlYWRlclZpZXcg44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgVmlld09wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgYmFzZVRlbXBsYXRlPzogSlNUOyAgICAgICAgICAgICAvLyE8IOWbuuWumuODmOODg+ODgOeUqCBKYXZhU2NyaXB0IOODhuODs+ODl+ODrOODvOODiC5cclxuICAgICAgICBiYWNrQ29tbWFuZFNlbGVjdG9yPzogc3RyaW5nOyAgIC8vITwgXCLmiLvjgotcIuOCs+ODnuODs+ODieOCu+ODrOOCr+OCvy4gZGVmYXVsdDogXCJjb21tYW5kLWJhY2tcIlxyXG4gICAgICAgIGJhY2tDb21tYW5kS2luZD86IHN0cmluZzsgICAgICAgLy8hPCBcIuaIu+OCi1wi44Kz44Oe44Oz44OJ56iu5YilIChvbkNvbW1hbmQg56ysMuW8leaVsCkuIGRlZmF1bHQ6IFwicGFnZWJhY2tcIlxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgQmFzZUhlYWRlclZpZXdcclxuICAgICAqIEBicmllZiDlhbHpgJrjg5jjg4Pjg4DjgpLmk43kvZzjgZnjgovjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEJhc2VIZWFkZXJWaWV3PFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgVmlldzxUTW9kZWw+IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc18kaGVhZGVyQmFzZTogSlF1ZXJ5OyAgIC8vITwg44Oa44O844K45aSW44Gr6YWN572u44GV44KM44KL5YWx6YCa44OY44OD44OA44Gu44OZ44O844K56YOo5ZOB55SoIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX3JlZkNvdW50ID0gMDsgICAgICAgICAgLy8hPCDlj4Lnhafjgqvjgqbjg7Pjg4hcclxuICAgICAgICBwcml2YXRlIF90ZW1wbGF0ZTogSlNUO1xyXG4gICAgICAgIHByaXZhdGUgX2hhc0JhY2tJbmRpY2F0b3I6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0lQYWdlfSBfb3duZXIgW2luXSDjgqrjg7zjg4rjg7zjg5rjg7zjgrjjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9vd25lcjogSVBhZ2UsIHByaXZhdGUgX29wdGlvbnM/OiBCYXNlSGVhZGVyVmlld09wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcihfb3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgIGVsOiBfb3duZXIuJHBhZ2UuZmluZChcIltkYXRhLXJvbGU9J2hlYWRlciddXCIpLFxyXG4gICAgICAgICAgICAgICAgYmFja0NvbW1hbmRTZWxlY3RvcjogXCIuY29tbWFuZC1iYWNrXCIsXHJcbiAgICAgICAgICAgICAgICBiYWNrQ29tbWFuZEtpbmQ6IFwicGFnZWJhY2tcIixcclxuICAgICAgICAgICAgfSwgX29wdGlvbnMpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRlbXBsYXRlIOioreWumlxyXG4gICAgICAgICAgICBpZiAoX29wdGlvbnMuYmFzZVRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IF9vcHRpb25zLmJhc2VUZW1wbGF0ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gVGVtcGxhdGUuZ2V0SlNUKGBcclxuICAgICAgICAgICAgICAgICAgICA8c2NyaXB0IHR5cGU9J3RleHQvdGVtcGxhdGUnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGVhZGVyIGNsYXNzPSd1aS1oZWFkZXItYmFzZSB1aS1ib2R5LXt7dGhlbWV9fSc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSd1aS1maXhlZC1iYWNrLWluZGljYXRvcic+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc2NyaXB0PlxyXG4gICAgICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEJhY2tib25lLlZpZXcg55So44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudCh0aGlzLiRlbCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWIneacn+WMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBjcmVhdGUoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlSGVhZGVyQmFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5pyJ5Yq55YyWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGFjdGl2YXRlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3dJbmRpY2F0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeEoeWKueWMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBpbmFjdGl2YXRlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhpZGVJbmRpY2F0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOegtOajhFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyByZWxlYXNlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbGVhc2VIZWFkZXJCYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEg5YWx6YCa44OY44OD44OA44Gu44OZ44O844K544KS5rqW5YKZXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVIZWFkZXJCYXNlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIC8vIOWbuuWumuODmOODg+ODgOOBruOBqOOBjeOBq+acieWKueWMllxyXG4gICAgICAgICAgICBpZiAoXCJmaXhlZFwiID09PSB0aGlzLl9vd25lci4kaGVhZGVyLmpxbURhdGEoXCJwb3NpdGlvblwiKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgPT0gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UgPSAkKHRoaXMuX3RlbXBsYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU6IHRoaXMuX293bmVyLiRwYWdlLmpxbURhdGEoXCJ0aGVtZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zX3JlZkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlLmFwcGVuZFRvKCQoZG9jdW1lbnQuYm9keSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEJhY2sgSW5kaWNhdG9yIOOCkuaMgeOBo+OBpuOBhOOCi+OBi+WIpOWumlxyXG4gICAgICAgICAgICBpZiAoMCA8IHRoaXMuJGVsLmZpbmQoXCIudWktYmFjay1pbmRpY2F0b3JcIikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNCYWNrSW5kaWNhdG9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBpbmRpY2F0b3Ig44Gu6KGo56S6XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93SW5kaWNhdG9yKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIC8vIEJhY2sgSW5kaWNhdG9yIOOCkuaMgeOBo+OBpuOBhOOBquOBhOWgtOWQiOihqOekuuOBl+OBquOBhFxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlICYmIHRoaXMuX2hhc0JhY2tJbmRpY2F0b3IpIHtcclxuICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UuZmluZChcIi51aS1maXhlZC1iYWNrLWluZGljYXRvclwiKS5hZGRDbGFzcyhcInNob3dcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgaW5kaWNhdG9yIOOBrumdnuihqOekulxyXG4gICAgICAgIHByaXZhdGUgaGlkZUluZGljYXRvcigpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlLmZpbmQoXCIudWktZml4ZWQtYmFjay1pbmRpY2F0b3JcIikucmVtb3ZlQ2xhc3MoXCJzaG93XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWFsemAmuODmOODg+ODgOOBruODmeODvOOCueOCkuegtOajhFxyXG4gICAgICAgIHByaXZhdGUgcmVsZWFzZUhlYWRlckJhc2UoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgLy8g5Zu65a6a44OY44OD44OA5pmC44Gr5Y+C54Wn44Kr44Km44Oz44OI44KS566h55CGXHJcbiAgICAgICAgICAgIGlmIChcImZpeGVkXCIgPT09IHRoaXMuX293bmVyLiRoZWFkZXIuanFtRGF0YShcInBvc2l0aW9uXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc19yZWZDb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgwID09PSBCYXNlSGVhZGVyVmlldy5zX3JlZkNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IEJhY2tib25lLlZpZXdcclxuXHJcbiAgICAgICAgLy8hIGV2ZW50cyBiaW5kaW5nXHJcbiAgICAgICAgZXZlbnRzKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TWFwID0ge307XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudE1hcFtcInZjbGljayBcIiArIHRoaXMuX29wdGlvbnMuYmFja0NvbW1hbmRTZWxlY3Rvcl0gPSB0aGlzLm9uQ29tbWFuZEJhY2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50TWFwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGJhY2sg44Gu44OP44Oz44OJ44OpXHJcbiAgICAgICAgcHJpdmF0ZSBvbkNvbW1hbmRCYWNrKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbGV0IGhhbmRsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX293bmVyKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVkID0gdGhpcy5fb3duZXIub25Db21tYW5kKGV2ZW50LCB0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kS2luZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFoYW5kbGVkKSB7XHJcbiAgICAgICAgICAgICAgICBSb3V0ZXIuYmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IEZyYW1ld29yayA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgY29uc3QgVEFHOiBzdHJpbmcgPSBcIltDRFAuVUkuQmFzZVBhZ2VdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBCYXNlUGFnZU9wdGlvbnNcclxuICAgICAqIEBicmllZiBCYXNlUGFnZSDjgavmjIflrprjgZnjgovjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCYXNlUGFnZU9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEZyYW1ld29yay5QYWdlQ29uc3RydWN0T3B0aW9ucywgQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIGJhc2VIZWFkZXI/OiBuZXcgKG93bmVyOiBGcmFtZXdvcmsuSVBhZ2UsIG9wdGlvbnM/OiBCYXNlSGVhZGVyVmlld09wdGlvbnM8VE1vZGVsPikgPT4gQmFzZUhlYWRlclZpZXc8VE1vZGVsPjsgICAvLyE8IEhlYWRlciDmqZ/og73jgpLmj5DkvpvjgZnjgovln7rlupXjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICBiYWNrQ29tbWFuZEhhbmRsZXI/OiBzdHJpbmc7ICAgICAgICAgICAgICAgIC8vITwgXCLmiLvjgotcIiDjgrPjg57jg7Pjg4njg4/jg7Pjg4njg6njg6Hjgr3jg4Pjg4nlkI0uICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBvblBhZ2VCYWNrXHJcbiAgICAgICAgZG9tRXh0ZW5zaW9uT3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnM7ICAvLyE8IERPTeaLoeW8teOBq+a4oeOBmeOCquODl+OCt+ODp+ODsy4gbnVsbHx1bmRlZmluZWQg44KS5oyH5a6a44GZ44KL44Go5ouh5by144GX44Gq44GEIGRlZmF1bHQ6IHt9XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBCYXNlUGFnZVxyXG4gICAgICogQGJyaWVmIEhlYWRlciDjgpLlgpnjgYjjgosgUGFnZSDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEJhc2VQYWdlPFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuUGFnZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2Jhc2VIZWFkZXI6IEJhc2VIZWFkZXJWaWV3PFRNb2RlbD47ICAgIC8vITwg44OY44OD44OA44Kv44Op44K5XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgdXJsICAgICAgIFtpbl0g44Oa44O844K4IFVSTFxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgICAgICAgICBpZCAgICAgICAgW2luXSDjg5rjg7zjgrggSURcclxuICAgICAgICAgKiBAcGFyYW0ge0Jhc2VQYWdlT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHByaXZhdGUgX29wdGlvbnM/OiBCYXNlUGFnZU9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcih1cmwsIGlkLCBfb3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgIGJhc2VIZWFkZXI6IEJhc2VIZWFkZXJWaWV3LFxyXG4gICAgICAgICAgICAgICAgYmFja0NvbW1hbmRIYW5kbGVyOiBcIm9uUGFnZUJhY2tcIixcclxuICAgICAgICAgICAgICAgIGJhY2tDb21tYW5kS2luZDogXCJwYWdlYmFja1wiLFxyXG4gICAgICAgICAgICAgICAgZG9tRXh0ZW5zaW9uT3B0aW9uczoge30sXHJcbiAgICAgICAgICAgIH0sIF9vcHRpb25zKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBGcmFtZXdvcmsgUGFnZVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuYmFzZUhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlciA9IG5ldyB0aGlzLl9vcHRpb25zLmJhc2VIZWFkZXIodGhpcywgdGhpcy5fb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUNyZWF0ZShldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlSW5pdChldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX29wdGlvbnMuZG9tRXh0ZW5zaW9uT3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgRXh0ZW5zaW9uTWFuYWdlci5hcHBseURvbUV4dGVuc2lvbih0aGlzLiRwYWdlLCB0aGlzLl9vcHRpb25zLmRvbUV4dGVuc2lvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUluaXQoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge1Nob3dFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iYXNlSGVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlU2hvdyhldmVudCwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWhpZGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRhICB7SGlkZUV2ZW50RGF0YX0gICAgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlSGlkZShldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLkhpZGVFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Jhc2VIZWFkZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VIZWFkZXIuaW5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUhpZGUoZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VyZW1vdmVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZVJlbW92ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iYXNlSGVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VIZWFkZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZVJlbW92ZShldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIL1cgQmFjayBCdXR0b24g44OP44Oz44OJ44OpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0gZXZlbnQgb2JqZWN0XHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5pei5a6a44Gu5Yem55CG44KS6KGM44KP44Gq44GEIC8gZmFsc2U6IOaXouWumuOBruWHpueQhuOCkuihjOOBhlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uSGFyZHdhcmVCYWNrQnV0dG9uKGV2ZW50PzogSlF1ZXJ5LkV2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGxldCByZXR2YWwgPSBzdXBlci5vbkhhcmR3YXJlQmFja0J1dHRvbihldmVudCk7XHJcbiAgICAgICAgICAgIGlmICghcmV0dmFsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR2YWwgPSB0aGlzLm9uQ29tbWFuZChldmVudCwgdGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEtpbmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXR2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBDdXN0b20gRXZlbnRcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXCLmiLvjgotcIiBldmVudCDnmbrooYzmmYLjgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaXouWumuOBruWHpueQhuOCkuihjOOCj+OBquOBhCAvIGZhbHNlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgYZcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkNvbW1hbmQoZXZlbnQ6IEpRdWVyeS5FdmVudCwga2luZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kS2luZCA9PT0ga2luZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX293bmVyICYmIHRoaXMuX293bmVyW3RoaXMuX29wdGlvbnMuYmFja0NvbW1hbmRIYW5kbGVyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lclt0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kSGFuZGxlcl0oZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuICAgIGltcG9ydCBQcm9taXNlICAgICAgPSBDRFAuUHJvbWlzZTtcclxuICAgIGltcG9ydCBGcmFtZXdvcmsgICAgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5QYWdlVmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQYWdlVmlldyDjgYznmbrooYzjgZnjgovjgqTjg5njg7Pjg4jlrprnvqlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGVudW0gUEFHRVZJRVdfRVZFTlRTIHtcclxuICAgICAgICBPUklFTlRBVElPTl9DSEFOR0VEID0gXCJwYWdldmlldzpvcmllbnRhdGlvbi1jaGFuZ2VkXCIsXHJcbiAgICAgICAgSU5JVElBTFpTRSAgICAgICAgICA9IFwicGFnZXZpZXc6aW5pdGlhbGl6ZVwiLFxyXG4gICAgICAgIFBBR0VfQkVGT1JFX0NSRUFURSAgPSBcInBhZ2V2aWV3OmJlZm9yZS1jcmVhdGVcIixcclxuICAgICAgICBQQUdFX0lOSVQgICAgICAgICAgID0gXCJwYWdldmlldzpwYWdlLWluaXRcIixcclxuICAgICAgICBQQUdFX0JFRk9SRV9TSE9XICAgID0gXCJwYWdldmlldzpiZWZvcmUtc2hvd1wiLFxyXG4gICAgICAgIFBBR0VfU0hPVyAgICAgICAgICAgPSBcInBhZ2V2aWV3OnNob3dcIixcclxuICAgICAgICBQQUdFX0JFRk9SRV9ISURFICAgID0gXCJwYWdldmlldzpiZWZvcmUtaGlkZVwiLFxyXG4gICAgICAgIFBBR0VfSElERSAgICAgICAgICAgPSBcInBhZ2V2aWV3OmhpZGVcIixcclxuICAgICAgICBQQUdFX1JFTU9WRSAgICAgICAgID0gXCJwYWdldmlldzpyZW1vdmVcIixcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUGFnZVZpZXdDb25zdHJ1Y3RPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgUm91dGVyIOOBuOOBrueZu+mMsuaDheWgseOBqCBCYWNrYm9uZS5WaWV3IOOBuOOBruWIneacn+WMluaDheWgseOCkuagvOe0jeOBmeOCi+OCpOODs+OCv+ODvOODleOCp+OCpOOCueOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBGcmFtZXdvcmsuTW9kZWwgPSBGcmFtZXdvcmsuTW9kZWw+IGV4dGVuZHMgQmFzZVBhZ2VPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIGJhc2VQYWdlPzogbmV3ICh1cmw6IHN0cmluZywgaWQ6IHN0cmluZywgb3B0aW9ucz86IEZyYW1ld29yay5QYWdlQ29uc3RydWN0T3B0aW9ucykgPT4gRnJhbWV3b3JrLlBhZ2U7ICAgIC8vITwgUGFnZSDmqZ/og73jgpLmj5DkvpvjgZnjgovln7rlupXjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQYWdlVmlld1xyXG4gICAgICogQGJyaWVmIENEUC5GcmFtZXdvcmsuUGFnZSDjgaggQmFja2JvbmUuVmlldyDjga7kuKHmlrnjga7mqZ/og73jgpLmj5DkvpvjgZnjgovjg5rjg7zjgrjjga7ln7rlupXjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VWaWV3PFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuVmlldzxUTW9kZWw+IGltcGxlbWVudHMgRnJhbWV3b3JrLklQYWdlLCBJU3RhdHVzTWFuYWdlciB7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBfcGFnZU9wdGlvbnM6IFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+ID0gbnVsbDtcclxuICAgICAgICBwcm90ZWN0ZWQgX2Jhc2VQYWdlOiBGcmFtZXdvcmsuUGFnZSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfc3RhdHVzTWdyOiBTdGF0dXNNYW5hZ2VyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB1cmwgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgIFtpbl0g44Oa44O844K4IFVSTFxyXG4gICAgICAgICAqIEBwYXJhbSBpZCAgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgIFtpbl0g44Oa44O844K4IElEXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge1BhZ2VWaWV3Q29uc3RydWN0T3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgaWQ6IHN0cmluZywgb3B0aW9ucz86IFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gUGFnZVZpZXcg6Kit5a6aXHJcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VPcHRpb25zID0gJC5leHRlbmQoe30sIHsgb3duZXI6IHRoaXMgfSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jhc2VQYWdlID0gdGhpcy5fcGFnZU9wdGlvbnMuYmFzZVBhZ2UgPyBuZXcgdGhpcy5fcGFnZU9wdGlvbnMuYmFzZVBhZ2UodXJsLCBpZCwgdGhpcy5fcGFnZU9wdGlvbnMpIDogbmV3IEJhc2VQYWdlKHVybCwgaWQsIHRoaXMuX3BhZ2VPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFN0YXR1c01hbmFnZXJcclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzTWdyID0gbmV3IFN0YXR1c01hbmFnZXIoKTtcclxuICAgICAgICAgICAgLy8gQmFja2JvbmUuVmlldyDnlKjjga7liJ3mnJ/ljJZcclxuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGVzID0gKDxhbnk+dGhpcykuZXZlbnRzID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQodGhpcy4kcGFnZSwgZGVsZWdhdGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSVN0YXR1c01hbmFnZXIg54q25oWL566h55CGXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruOCpOODs+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyB7U3RyaW5nfSBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXR1c0FkZFJlZihzdGF0dXM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNNZ3Iuc3RhdHVzQWRkUmVmKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jg4fjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMge1N0cmluZ30gW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0dXNSZWxlYXNlKHN0YXR1czogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1c01nci5zdGF0dXNSZWxlYXNlKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlh6bnkIbjgrnjgrPjg7zjg5fmr47jgavnirbmhYvlpInmlbDjgpLoqK3lrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMgICB7U3RyaW5nfSAgIFtpbl0g54q25oWL6K2Y5Yil5a2QXHJcbiAgICAgICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn0gW2luXSDlh6bnkIbjgrPjg7zjg6vjg5Djg4Pjgq9cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0dXNTY29wZShzdGF0dXM6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQgfCBQcm9taXNlPGFueT4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzTWdyLnN0YXR1c1Njb3BlKHN0YXR1cywgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44Gf54q25oWL5Lit44Gn44GC44KL44GL56K66KqNXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdHVzIHtTdHJpbmd9ICAgW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDnirbmhYvlhoUgLyBmYWxzZTog54q25oWL5aSWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNTdGF0dXNJbihzdGF0dXM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzTWdyLmlzU3RhdHVzSW4oc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSVBhZ2Ugc3R1YiBzdHVmZi5cclxuXHJcbiAgICAgICAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLmFjdGl2ZTsgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHVybCgpOiBzdHJpbmcgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLnVybDsgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGlkKCk6IHN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlID8gdGhpcy5fYmFzZVBhZ2UuaWQgOiBudWxsOyB9XHJcbiAgICAgICAgZ2V0ICRwYWdlKCk6IEpRdWVyeSAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLiRwYWdlOyAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0ICRoZWFkZXIoKTogSlF1ZXJ5ICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLiRoZWFkZXI7ICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0ICRmb290ZXIoKTogSlF1ZXJ5ICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLiRmb290ZXI7ICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGludGVudCgpOiBGcmFtZXdvcmsuSW50ZW50ICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLmludGVudDsgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgc2V0IGludGVudChuZXdJbnRlbnQ6IEZyYW1ld29yay5JbnRlbnQpIHsgdGhpcy5fYmFzZVBhZ2UuaW50ZW50ID0gbmV3SW50ZW50OyAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE9yaWVudGF0aW9uIOOBruWkieabtOOCkuWPl+S/oVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG5ld09yaWVudGF0aW9uIHtPcmllbnRhdGlvbn0gW2luXSBuZXcgb3JpZW50YXRpb24gY29kZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBvbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbjogRnJhbWV3b3JrLk9yaWVudGF0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihQQUdFVklFV19FVkVOVFMuT1JJRU5UQVRJT05fQ0hBTkdFRCwgbmV3T3JpZW50YXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSC9XIEJhY2sgQnV0dG9uIOODj+ODs+ODieODqVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIGV2ZW50IG9iamVjdFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaXouWumuOBruWHpueQhuOCkuihjOOCj+OBquOBhCAvIGZhbHNlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgYZcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkhhcmR3YXJlQmFja0J1dHRvbihldmVudD86IEpRdWVyeS5FdmVudCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSb3V0ZXIgXCJiZWZvcmUgcm91dGUgY2hhbmdlXCIg44OP44Oz44OJ44OpXHJcbiAgICAgICAgICog44Oa44O844K46YG356e755u05YmN44Gr6Z2e5ZCM5pyf5Yem55CG44KS6KGM44GG44GT44Go44GM5Y+v6IO9XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtJUHJvbWlzZUJhc2V9IFByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25CZWZvcmVSb3V0ZUNoYW5nZSgpOiBJUHJvbWlzZUJhc2U8YW55PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaxjueUqOOCs+ODnuODs+ODieOCkuWPl+S/oVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIGV2ZW50IG9iamVjdFxyXG4gICAgICAgICAqIEBwYXJhbSAgZXZlbnQge2tpbmR9ICAgICAgICAgICAgICBbaW5dIGNvbW1hbmQga2luZCBzdHJpbmdcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgo/jgarjgYQgLyBmYWxzZTog5pei5a6a44Gu5Yem55CG44KS6KGM44GGXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25Db21tYW5kKGV2ZW50PzogSlF1ZXJ5LkV2ZW50LCBraW5kPzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOacgOWIneOBriBPblBhZ2VJbml0KCkg44Gu44Go44GN44Gr44Gu44G/44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkluaXRpYWxpemUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoUEFHRVZJRVdfRVZFTlRTLklOSVRJQUxaU0UsIGV2ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3JlY3JlYXRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQodGhpcy4kcGFnZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihQQUdFVklFV19FVkVOVFMuUEFHRV9CRUZPUkVfQ1JFQVRFLCBldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNyZWF0ZVwiICjml6c6XCJwYWdlaW5pdFwiKSDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUluaXQoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoUEFHRVZJRVdfRVZFTlRTLlBBR0VfSU5JVCwgZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge1Nob3dFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihQQUdFVklFV19FVkVOVFMuUEFHRV9CRUZPUkVfU0hPVywgZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoUEFHRVZJRVdfRVZFTlRTLlBBR0VfU0hPVywgZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihQQUdFVklFV19FVkVOVFMuUEFHRV9CRUZPUkVfSElERSwgZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJoaWRlXCIgKOaXpzpcInBhZ2VoaWRlXCIpIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtIaWRlRXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VIaWRlKGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuSGlkZUV2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoUEFHRVZJRVdfRVZFTlRTLlBBR0VfSElERSwgZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VyZW1vdmVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZVJlbW92ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihQQUdFVklFV19FVkVOVFMuUEFHRV9SRU1PVkUsIGV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5lbCAgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLiRlbCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZUNvbnRhaW5lclZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQYWdlQ29udGFpbmVyVmlld09wdGlvbnNcclxuICAgICAqIEBicmllZiBQYWdlQ29udGFpbmVyIOOBruOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBhZ2VDb250YWluZXJWaWV3T3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBGcmFtZXdvcmsuTW9kZWwgPSBGcmFtZXdvcmsuTW9kZWw+IGV4dGVuZHMgRnJhbWV3b3JrLlZpZXdPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIG93bmVyOiBQYWdlVmlldztcclxuICAgICAgICAkZWw/OiBKUXVlcnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgUGFnZUNvbnRhaW5lclZpZXdcclxuICAgICAqIEBicmllZiBQYWdlVmlldyDjgajpgKPmkLrlj6/og73jgaog44Kz44Oz44OG44OK44OT44Ol44O844Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlQ29udGFpbmVyVmlldzxUTW9kZWwgZXh0ZW5kcyBGcmFtZXdvcmsuTW9kZWwgPSBGcmFtZXdvcmsuTW9kZWw+IGV4dGVuZHMgRnJhbWV3b3JrLlZpZXc8VE1vZGVsPiB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX293bmVyOiBQYWdlVmlldyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9uczogUGFnZUNvbnRhaW5lclZpZXdPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX293bmVyID0gb3B0aW9ucy5vd25lcjtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuJGVsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZXMgPSAoPGFueT50aGlzKS5ldmVudHMgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQob3B0aW9ucy4kZWwsIGRlbGVnYXRlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gc2V0IGV2ZW50IGxpc3RlbmVyXHJcbiAgICAgICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5fb3duZXIsIFBBR0VWSUVXX0VWRU5UUy5PUklFTlRBVElPTl9DSEFOR0VELCB0aGlzLm9uT3JpZW50YXRpb25DaGFuZ2VkLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMuX293bmVyLCBQQUdFVklFV19FVkVOVFMuSU5JVElBTFpTRSwgdGhpcy5vbkluaXRpYWxpemUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5fb3duZXIsIFBBR0VWSUVXX0VWRU5UUy5QQUdFX0JFRk9SRV9DUkVBVEUsIHRoaXMub25QYWdlQmVmb3JlQ3JlYXRlLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMuX293bmVyLCBQQUdFVklFV19FVkVOVFMuUEFHRV9JTklULCB0aGlzLm9uUGFnZUluaXQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5fb3duZXIsIFBBR0VWSUVXX0VWRU5UUy5QQUdFX0JFRk9SRV9TSE9XLCB0aGlzLm9uUGFnZUJlZm9yZVNob3cuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgIHRoaXMubGlzdGVuVG8odGhpcy5fb3duZXIsIFBBR0VWSUVXX0VWRU5UUy5QQUdFX1NIT1csIHRoaXMub25QYWdlU2hvdy5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLl9vd25lciwgUEFHRVZJRVdfRVZFTlRTLlBBR0VfQkVGT1JFX0hJREUsIHRoaXMub25QYWdlQmVmb3JlSGlkZS5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgdGhpcy5saXN0ZW5Ubyh0aGlzLl9vd25lciwgUEFHRVZJRVdfRVZFTlRTLlBBR0VfSElERSwgdGhpcy5vblBhZ2VIaWRlLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICB0aGlzLmxpc3RlblRvKHRoaXMuX293bmVyLCBQQUdFVklFV19FVkVOVFMuUEFHRV9SRU1PVkUsIHRoaXMub25QYWdlUmVtb3ZlLmJpbmQodGhpcykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBzaG9ydCBjdXQgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEgT3duZXIg5Y+W5b6XXHJcbiAgICAgICAgZ2V0IG93bmVyKCk6IFBhZ2VWaWV3IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBIYW5kbGUgUGFnZVZpZXcgZXZlbnRzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE9yaWVudGF0aW9uIOOBruWkieabtOOCkuWPl+S/oVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG5ld09yaWVudGF0aW9uIHtPcmllbnRhdGlvbn0gW2luXSBuZXcgb3JpZW50YXRpb24gY29kZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBvbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbjogRnJhbWV3b3JrLk9yaWVudGF0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmnIDliJ3jga4gT25QYWdlSW5pdCgpIOOBruOBqOOBjeOBq+OBruOBv+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25Jbml0aWFsaXplKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3JlY3JlYXRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VjcmVhdGVcIiAo5penOlwicGFnZWluaXRcIikg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VJbml0KGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNvbnRhaW5lcmhpZGVcIiAo5penOlwicGFnZWhpZGVcIikg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZXJlbW92ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zdG9wTGlzdGVuaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIGZvciBub24gZmxpcHNuYXAgdXNlci5cclxuaW50ZXJmYWNlIElGbGlwc25hcCB7XHJcbiAgICBbeDogc3RyaW5nXTogYW55O1xyXG59XHJcbmludGVyZmFjZSBGbGlwc25hcE9wdGlvbnMge1xyXG59XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgTW9kZWwgICAgICAgICAgICAgICAgICAgICAgICA9IEZyYW1ld29yay5Nb2RlbDtcclxuICAgIGltcG9ydCBJT3JpZW50YXRpb25DaGFuZ2VkTGlzdGVuZXIgID0gRnJhbWV3b3JrLklPcmllbnRhdGlvbkNoYW5nZWRMaXN0ZW5lcjtcclxuICAgIGltcG9ydCBPcmllbnRhdGlvbiAgICAgICAgICAgICAgICAgID0gRnJhbWV3b3JrLk9yaWVudGF0aW9uO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5UYWJIb3N0Vmlld10gXCI7XHJcblxyXG4gICAgbmFtZXNwYWNlIF9Db25maWcge1xyXG4gICAgICAgIGV4cG9ydCBjb25zdCBUQUJWSUVXX0NMQVNTID0gXCJ1aS10YWJ2aWV3XCI7XHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IFRBQlZJRVdfU0VMRUNUT1IgPSBcIi5cIiArIFRBQlZJRVdfQ0xBU1M7XHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IFRBQkhPU1RfQ0xBU1MgPSBcInVpLXRhYmhvc3RcIjtcclxuICAgICAgICBleHBvcnQgY29uc3QgVEFCSE9TVF9TRUxFQ1RPUiA9IFwiLlwiICsgVEFCSE9TVF9DTEFTUztcclxuICAgICAgICBleHBvcnQgY29uc3QgVEFCSE9TVF9SRUZSRVNIX0NPRUZGID0gMS4wOyAgICAgICAvLyBmbGlwc25hcCDliIfjgormm7/jgYjmmYLjgasgZHVyYXRpb24g44Gr5a++44GX44Gm5pu05paw44KS6KGM44GG5L+C5pWwXHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IFRBQkhPU1RfUkVGUkVTSF9JTlRFUlZBTCA9IDIwMDsgICAgLy8gZmxpcHNuYXAg44Gu5pu05paw44Gr5L2/55So44GZ44KL6ZaT6ZqUIFttc2VjXVxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElUYWJWaWV3XHJcbiAgICAgKiBAYnJpZWYgVGFiSG9zdFZpZXcg44Gr44Ki44K/44OD44OB5Y+v6IO944GqIFZpZXcg44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVRhYlZpZXcgZXh0ZW5kcyBJTGlzdFZpZXcsIElPcmllbnRhdGlvbkNoYW5nZWRMaXN0ZW5lciB7XHJcbiAgICAgICAgaG9zdDogVGFiSG9zdFZpZXc7ICAgICAgLy8gaG9zdCDjgavjgqLjgq/jgrvjgrlcclxuICAgICAgICAkZWw6IEpRdWVyeTsgICAgICAgICAgICAvLyDnrqHnkIYgRE9NIOOBq+OCouOCr+OCu+OCuVxyXG4gICAgICAgIG5lZWRSZWJ1aWxkPzogYm9vbGVhbjsgIC8vIHJlYnVpbGQg54q25oWL44Gr44Ki44Kv44K744K5XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZHM6IEZyYW1ld29ya1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnirbmhYvjgavlv5zjgZjjgZ/jgrnjgq/jg63jg7zjg6vkvY3nva7jga7kv53lrZgv5b6p5YWDXHJcbiAgICAgICAgICogQnJvd3NlciDjga4gTmF0aXZlIFNjcm9sbCDmmYLjgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKi9cclxuICAgICAgICB0cmVhdFNjcm9sbFBvc2l0aW9uKCk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZHM6IEV2ZW50XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNjcm9sbGVyIOOBruWIneacn+WMluaZguOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uSW5pdGlhbGl6ZShob3N0OiBUYWJIb3N0VmlldywgJHJvb3Q6IEpRdWVyeSk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNjcm9sbGVyIOOBruegtOajhOaZguOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uRGVzdHJveSgpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiB2aXNpYmlsaXR5IOWxnuaAp+OBjOWkieabtOOBleOCjOOBn+OBqOOBjeOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqIGFjdGl2ZSDjg5rjg7zjgrjjgajjgZ3jga7kuKHnq6/jga7jg5rjg7zjgrjjgYzlr77osaFcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB2aXNpYmxlIFtpbl0gdHJ1ZTog6KGo56S6IC8gZmFsc2U6IOmdnuihqOekulxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uVmlzaWJpbGl0eUNoYW5nZWQodmlzaWJsZTogYm9vbGVhbik6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODmuODvOOCuOOBjOihqOekuuWujOS6huOBl+OBn+OBqOOBjeOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uVGFiU2VsZWN0ZWQoKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Oa44O844K444GM6Z2e6KGo56S644Gr5YiH44KK5pu/44KP44Gj44Gf44Go44GN44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25UYWJSZWxlYXNlZCgpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg4njg6njg4PjgrDkuK3jgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBwb3NpdGlvbiBbaW5dIOePvuWcqOOBriB0YWIgaW5kZXhcclxuICAgICAgICAgKiBAcGFyYW0gb2Zmc2V0ICAgW2luXSDnp7vli5Xph49cclxuICAgICAgICAgKi9cclxuICAgICAgICBvblRhYlNjcm9sbGluZyhwb3NpdGlvbjogbnVtYmVyLCBvZmZzZXQ6IG51bWJlcik6IHZvaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFRhYlZpZXdDb250ZXh0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIFRhYlZpZXdDb250ZXh0IOOBq+aMh+WumuOBmeOCi+OCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRhYlZpZXdDb250ZXh0T3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIExpc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBkZWxheVJlZ2lzdGVyPzogYm9vbGVhbjsgICAgLy8g6YGF5bu255m76Yyy44KS6KGM44GG5aC05ZCI44GvIHRydWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgVGFiVmlld0NvbnN0cnVjdGlvbk9wdGlvbnNcclxuICAgICAqIEBicmllZiBUYWJWaWV3IOOBruOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRhYlZpZXdDb25zdHJ1Y3Rpb25PcHRpb25zPFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgVGFiVmlld0NvbnRleHRPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIGhvc3Q6IFRhYkhvc3RWaWV3OyAgLy8gaG9zdCDjgpLmjIflrppcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBUYWJWaWV3Q29udGV4dFxyXG4gICAgICogQGJyaWVmIElUYWJWaWV3IOOCkuWIneacn+WMluOBmeOCi+OBn+OCgeOBruaDheWgseOCkuagvOe0jVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRhYlZpZXdDb250ZXh0PFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IHtcclxuICAgICAgICBjdG9yPzogbmV3IChvcHRpb25zPzogVGFiVmlld0NvbnN0cnVjdGlvbk9wdGlvbnM8VE1vZGVsPikgPT4gSVRhYlZpZXc7ICAvLyBJVGFiVmlldyDjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAgICBvcHRpb25zPzogVGFiVmlld0NvbnRleHRPcHRpb25zPFRNb2RlbD47ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDmp4vnr4nmmYLjga7ln7rlupXjgqrjg5fjgrfjg6fjg7NcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBUYWJIb3N0Vmlld0NvbnN0cnVjdE9wdGlvbnNcclxuICAgICAqIEBicmllZiBUYWJIb3N0VmlldyDjga7liJ3mnJ/ljJbmg4XloLHjgpLmoLzntI3jgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUYWJIb3N0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBQYWdlQ29udGFpbmVyVmlld09wdGlvbnM8VE1vZGVsPiwgRmxpcHNuYXBPcHRpb25zIHtcclxuICAgICAgICBpbmFjdGl2ZVZpc2libGVUYWJEaXN0YW5jZT86IG51bWJlcjsgICAgLy8g6Z2e6YG45oqe5pmC44GuIHZpc2libGUg44K/44OW5pWwIGV4KSAxOiDkuKHjgrXjgqTjg4lcclxuICAgICAgICB0YWJDb250ZXh0cz86IFRhYlZpZXdDb250ZXh0W107ICAgICAgICAgLy8gVGFiVmlld0NvbnRleHQg44Gu6YWN5YiXXHJcbiAgICAgICAgZW5hYmxlQm91bmNlPzogYm9vbGVhbjsgICAgICAgICAgICAgICAgIC8vIOe1guerr+OBpyBib3VuY2Ug44GZ44KL5aC05ZCI44Gr44GvIHRydWVcclxuICAgICAgICBpbml0aWFsV2lkdGg/OiBudW1iZXI7ICAgICAgICAgICAgICAgICAgLy8gd2lkdGgg44Gu5Yid5pyf5YCkXHJcbiAgICAgICAgaW5pdGlhbEhlaWdodD86IG51bWJlcjsgICAgICAgICAgICAgICAgIC8vIGhlaWdodCDjga7liJ3mnJ/lgKRcclxuICAgICAgICBpbml0SW1tZWRpYXRlPzogYm9vbGVhbjsgICAgICAgICAgICAgICAgLy8g44Kz44Oz44K544OI44Op44Kv44K/44GnIFRhYlZpZXcg44KS5Yid5pyf5YyW44GZ44KL5aC05ZCIIHRydWVcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFRhYkhvc3RWaWV3XHJcbiAgICAgKiBAYnJpZWYg44K/44OW5YiH44KK5pu/44GI5qmf6IO944KS5oyB44GkIFZpZXcg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBUYWJIb3N0VmlldzxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFBhZ2VDb250YWluZXJWaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJT3JpZW50YXRpb25DaGFuZ2VkTGlzdGVuZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIF90YWJzOiBJVGFiVmlld1tdID0gW107ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBJVGFiVmlldyDjgpLmoLzntI1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfYWN0aXZlVGFiSW5kZXg6IG51bWJlciA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWN0aXZlIHRhYlxyXG4gICAgICAgIHByaXZhdGUgX2ZsaXBzbmFwOiBJRmxpcHNuYXAgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZsaXBzbmFwIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgIHByaXZhdGUgX2ZsaXBFbmRFdmVudEhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkID0gbnVsbDsgICAgIC8vIFwiZnN0b3VjaGVuZFwiXHJcbiAgICAgICAgcHJpdmF0ZSBfZmxpcE1vdmVFdmVudEhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkID0gbnVsbDsgICAgLy8gXCJmc3RvdWNobW92ZVwiXHJcbiAgICAgICAgcHJpdmF0ZSBfZmxpcERlbHRhQ2FjaGU6IG51bWJlciA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJmbGlwIOi3nembouOBruOCreODo+ODg+OCt+ODpVwiXHJcbiAgICAgICAgcHJpdmF0ZSBfc2Nyb2xsRW5kRXZlbnRIYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCA9IG51bGw7ICAgLy8gdGFidmlldyBcInNjcm9sbHN0b3BcIlxyXG4gICAgICAgIHByaXZhdGUgX3Njcm9sbE1vdmVFdmVudEhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkID0gbnVsbDsgIC8vIHRhYnZpZXcgXCJzY3JvbGxcIlxyXG4gICAgICAgIHByaXZhdGUgX3JlZnJlc2hUaW1lcklkOiBudW1iZXIgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlZnJlc2goKSDlj43mmKDnorroqo3nlKhcclxuICAgICAgICBwcml2YXRlIF8kY29udGVudHNIb2xkZXI6IEpRdWVyeSA9IG51bGw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250ZW50cyBob2xkZXJcclxuICAgICAgICBwcml2YXRlIF9zZXR0aW5nczogVGFiSG9zdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD47ICAgICAgICAgICAgICAgICAvLyBUYWJIb3N0VmlldyDoqK3lrprlgKRcclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBFVkVOVF9TQ1JPTExfTU9WRSA9IFwidGFiaG9zdDpzY3JvbGxtb3ZlXCI7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBFVkVOVF9TQ1JPTExfU1RPUCA9IFwidGFiaG9zdDpzY3JvbGxzdG9wXCI7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBFVkVOVF9UQUJfTU9WRSAgICA9IFwidGFiaG9zdDp0YWJtb3ZlXCI7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBFVkVOVF9UQUJfU1RPUCAgICA9IFwidGFiaG9zdDp0YXZzdG9wXCI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFRhYkhvc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gY2hlY2sgcnVudGltZSBjb25kaXRpb25cclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gZ2xvYmFsLkZsaXBzbmFwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiZmxpcHNuYXAgbW9kdWxlIGRvZXNuJ3QgbG9hZC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQoe1xyXG4gICAgICAgICAgICAgICAgdGFiQ29udGV4dHM6IFtdLFxyXG4gICAgICAgICAgICAgICAgdGFiTW92ZUhhbmRsZXI6IChkZWx0YTogbnVtYmVyKTogdm9pZCA9PiB7IC8qIG5vb3AgKi8gfSxcclxuICAgICAgICAgICAgICAgIHRhYlN0b3BIYW5kbGVyOiAobmV3SW5kZXg6IG51bWJlciwgbW92ZWQ6IGJvb2xlYW4pOiB2b2lkID0+IHsgLyogbm9vcCAqLyB9XHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gc2V0dXAgZXZlbnQgaGFuZGxlcnNcclxuICAgICAgICAgICAgdGhpcy5fZmxpcEVuZEV2ZW50SGFuZGxlciA9IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmc0V2ZW50OiBhbnkgPSBldmVudC5vcmlnaW5hbEV2ZW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmxpcERlbHRhQ2FjaGUgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblRhYkNoYW5nZWQoZnNFdmVudC5uZXdQb2ludCwgZnNFdmVudC5tb3ZlZCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9mbGlwTW92ZUV2ZW50SGFuZGxlciA9IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmc0V2ZW50OiBhbnkgPSBldmVudC5vcmlnaW5hbEV2ZW50O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmxpcERlbHRhQ2FjaGUgKz0gZnNFdmVudC5kZWx0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBib3VuY2Ug44Gu44Ks44O844OJXHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX3NldHRpbmdzLmVuYWJsZUJvdW5jZSAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgKC0xID09PSBmc0V2ZW50LmRpcmVjdGlvbiAmJiAwID09PSB0aGlzLl9hY3RpdmVUYWJJbmRleCAmJiAwIDwgdGhpcy5fZmxpcERlbHRhQ2FjaGUpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKDEgPT09IGZzRXZlbnQuZGlyZWN0aW9uICYmIHRoaXMuX2FjdGl2ZVRhYkluZGV4ID09PSB0aGlzLl90YWJzLmxlbmd0aCAtIDEgJiYgdGhpcy5fZmxpcERlbHRhQ2FjaGUgPCAwKVxyXG4gICAgICAgICAgICAgICAgKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZmxpcHNuYXAubW92ZVRvUG9pbnQoZnNFdmVudC5uZXdQb2ludCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25UYWJNb3ZpbmcoZnNFdmVudC5kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdGFicy5mb3JFYWNoKCh0YWJ2aWV3OiBJVGFiVmlldykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3Lm9uVGFiU2Nyb2xsaW5nKHRoaXMuX2FjdGl2ZVRhYkluZGV4LCBmc0V2ZW50LmRlbHRhKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXByb2Nlc3ModGhpcy5fYWN0aXZlVGFiSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsRW5kRXZlbnRIYW5kbGVyID0gKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TY3JvbGxTdG9wKCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNb3ZlRXZlbnRIYW5kbGVyID0gKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TY3JvbGwoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNldHVwIHRhYnNcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmluaXRpYWxXaWR0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWwud2lkdGgodGhpcy5fc2V0dGluZ3MuaW5pdGlhbFdpZHRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MuaW5pdGlhbEhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy4kZWwuaGVpZ2h0KHRoaXMuX3NldHRpbmdzLmluaXRpYWxIZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBpbml0aWFsV2lkdGggID0gdGhpcy5fc2V0dGluZ3MuaW5pdGlhbFdpZHRoO1xyXG4gICAgICAgICAgICBjb25zdCBpbml0aWFsSGVpZ2h0ID0gdGhpcy4kZWwuaGVpZ2h0KCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0YWJDb250ZXh0cyA9IHRoaXMuX3NldHRpbmdzLnRhYkNvbnRleHRzLnNsaWNlKCk7XHJcbiAgICAgICAgICAgIGlmICgwIDwgdGFiQ29udGV4dHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0YWJDb250ZXh0cy5mb3JFYWNoKChjb250ZXh0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLWV4cHJlc3Npb24gKi9cclxuICAgICAgICAgICAgICAgICAgICBuZXcgY29udGV4dC5jdG9yKCQuZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5pdGlhbEhlaWdodDogaW5pdGlhbEhlaWdodCxcclxuICAgICAgICAgICAgICAgICAgICB9LCBjb250ZXh0Lm9wdGlvbnMsIHsgaG9zdDogdGhpcywgZGVsYXlSZWdpc3RlcjogZmFsc2UgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8qIHRzbGludDplbmFibGU6bm8tdW51c2VkLWV4cHJlc3Npb24gKi9cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gSVRhYlZpZXcg44Kk44Oz44K544K/44Oz44K55YyW6KaB5rGCXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uVGFiVmlld1NldHVwUmVxdWVzdChpbml0aWFsSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmluaXRJbW1lZGlhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZVRhYlZpZXdzKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuXyRjb250ZW50c0hvbGRlciA9IHRoaXMuJGVsLmZpbmQoX0NvbmZpZy5UQUJIT1NUX1NFTEVDVE9SKS5wYXJlbnQoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEZsaXBzbmFwXHJcbiAgICAgICAgICAgIHRoaXMuc2V0RmxpcHNuYXBDb25kaXRpb24oJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiBpbml0aWFsV2lkdGgsXHJcbiAgICAgICAgICAgIH0sIHRoaXMuX3NldHRpbmdzKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlVGFiKHRoaXMuX2FjdGl2ZVRhYkluZGV4LCAwLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOmFjeS4i+OBriBUYWJWaWV3IOOCkuWIneacn+WMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBpbml0aWFsaXplVGFiVmlld3MoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIElUYWJWaWV3IOOBqyAkdGFiSG9zdCDjgpLjgqLjgrXjgqTjg7PjgZnjgotcclxuICAgICAgICAgICAgLy8gTk9URTog54++5Zyo44GvIERPTSDjga7poIbluo/jga/lm7rlrppcclxuICAgICAgICAgICAgY29uc3QgJHRhYnMgPSB0aGlzLiRlbC5maW5kKF9Db25maWcuVEFCVklFV19TRUxFQ1RPUik7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFidmlldzogSVRhYlZpZXcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0YWJ2aWV3Lm9uSW5pdGlhbGl6ZSh0aGlzLCAkKCR0YWJzW2luZGV4XSkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOegtOajhOOBruODmOODq+ODkeODvOmWouaVsFxyXG4gICAgICAgICAqIOODoeODs+ODkOODvOOBruegtOajhOOBruOCv+OCpOODn+ODs+OCsOOCkuWkieOBiOOCi+WgtOWQiOOAgeacrOODoeOCveODg+ODieOCkuOCs+ODvOODq+OBmeOCi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnJlc2V0RmxpcHNuYXBDb25kaXRpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5fdGFicy5mb3JFYWNoKCh0YWJ2aWV3OiBJVGFiVmlldykgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGFidmlldy5vbkRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhYnMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5fJGNvbnRlbnRzSG9sZGVyID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gRnJhbWV3b3JrIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIC8vIOODmuODvOOCuOOBruWfuua6luWApOOCkuWPluW+l1xyXG4gICAgICAgIHB1YmxpYyBnZXRCYXNlSGVpZ2h0KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiRlbC5oZWlnaHQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRhYlZpZXcg44KS55m76YyyXHJcbiAgICAgICAgICogRnJhbWV3b3JrIOOBjOS9v+eUqFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHRhYnZpZXcgW2luXSBJVGFiVmlldyDjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgcmVnaXN0ZXJUYWJWaWV3KHRhYnZpZXc6IElUYWJWaWV3KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHRoaXMuZ2V0VGFiSW5kZXhPZih0YWJ2aWV3KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGFicy5wdXNoKHRhYnZpZXcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidGFiIGluc3RhbmNlIGFscmVhZHkgcmVnaXN0ZXJlZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRhYlZpZXcg44GuIFRhYiBpbmRleCDjgpLlj5blvpdcclxuICAgICAgICAgKiBGcmFtZXdvcmsg44GM5L2/55SoXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdGFidmlldyBbaW5dIElUYWJWaWV3IOOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqIEByZXR1cm4g5oyH5a6a44Kk44Oz44K544K/44Oz44K544Gu44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGdldFRhYkluZGV4T2YodGFidmlldzogSVRhYlZpZXcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IHRoaXMuX3RhYnMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFidmlldyA9PT0gdGhpcy5fdGFic1tpXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44K/44OW44Od44K444K344On44Oz44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlc2V0VGFiUG9zaXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFidmlldzogSVRhYlZpZXcpID0+IHtcclxuICAgICAgICAgICAgICAgIHRhYnZpZXcuc2Nyb2xsVG8oMCwgZmFsc2UsIDApO1xyXG4gICAgICAgICAgICAgICAgdGFidmlldy5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnNldEFjdGl2ZVRhYigwLCAwLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElUYWJWaWV3IOioreWumuODquOCr+OCqOOCueODiOaZguOBq+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgIHByb3RlY3RlZCBvblRhYlZpZXdTZXR1cFJlcXVlc3QoaW5pdGlhbEhlaWdodDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIG92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIFRhYiBjb250cm9sIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIC8vIOOCouOCr+ODhuOCo+ODliBUYWIg44KS6Kit5a6aXHJcbiAgICAgICAgcHVibGljIHNldEFjdGl2ZVRhYihpbmRleDogbnVtYmVyLCB0cmFuc2l0aW9uRHVyYXRpb24/OiBudW1iZXIsIGluaXRpYWw/OiBib29sZWFuKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbGlkVGFiKGluZGV4KSAmJiAoaW5pdGlhbCB8fCAodGhpcy5fYWN0aXZlVGFiSW5kZXggIT09IGluZGV4KSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIOmBt+enu+WJjeOBqyBzY3JvbGwg5L2N572u44GuIHZpZXcg44KS5pu05pawXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByZXByb2Nlc3MoaW5kZXgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RBY3RpdmVUYWJJbmRleCA9IHRoaXMuX2FjdGl2ZVRhYkluZGV4O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlVGFiSW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZsaXBzbmFwLm1vdmVUb1BvaW50KHRoaXMuX2FjdGl2ZVRhYkluZGV4LCB0cmFuc2l0aW9uRHVyYXRpb24pO1xyXG5cclxuICAgICAgICAgICAgICAgIHsvLyDpgbfnp7vlvozjgasgbGlzdHZpZXcg44Gu54q25oWL44KS5aSJ5pu0XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hhbmdlVGFiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnBvc3Rwcm9jZXNzKGxhc3RBY3RpdmVUYWJJbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub25UYWJDaGFuZ2VkKHRoaXMuX2FjdGl2ZVRhYkluZGV4LCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkR1cmF0aW9uID0gdHJhbnNpdGlvbkR1cmF0aW9uIHx8IHBhcnNlSW50KHRoaXMuX2ZsaXBzbmFwLnRyYW5zaXRpb25EdXJhdGlvbiwgMTApO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgwID09PSB0cmFuc2l0aW9uRHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlVGFiKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VUYWIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdHJhbnNpdGlvbkR1cmF0aW9uICogX0NvbmZpZy5UQUJIT1NUX1JFRlJFU0hfQ09FRkYpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgr/jg5bjga7mlbDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0g44K/44OW5pWwXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGdldFRhYkNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJzLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCouOCr+ODhuOCo+ODluOBquOCv+ODliBJbmRleCDjgpLlj5blvpdcclxuICAgICAgICBwdWJsaWMgZ2V0QWN0aXZlVGFiSW5kZXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVRhYkluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gc3dpcGUg56e75YuV6YeP44KS5Y+W5b6XIChzd2lwZSDkuK3jgasgZGVsdGEg44Gu5Yqg566X5YCk44KS6L+U5Y20KVxyXG4gICAgICAgIHB1YmxpYyBnZXRTd2lwZURlbHRhKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9mbGlwRGVsdGFDYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCv+ODluenu+WLleOCpOODmeODs+ODiFxyXG4gICAgICAgIHByb3RlY3RlZCBvblRhYk1vdmluZyhkZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihUYWJIb3N0Vmlldy5FVkVOVF9UQUJfTU9WRSwgZGVsdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44K/44OW5aSJ5pu05a6M5LqG44Kk44OZ44Oz44OIXHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVGFiQ2hhbmdlZChuZXdJbmRleDogbnVtYmVyLCBtb3ZlZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobW92ZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0QWN0aXZlVGFiKG5ld0luZGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoVGFiSG9zdFZpZXcuRVZFTlRfVEFCX1NUT1AsIG5ld0luZGV4LCBtb3ZlZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIFNjcm9sbCBjb250cm9sIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIC8vIOOCueOCr+ODreODvOODq+S9jee9ruOCkuWPluW+l1xyXG4gICAgICAgIGdldFNjcm9sbFBvcygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlVGFiVmlldykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjdGl2ZVRhYlZpZXcuZ2V0U2Nyb2xsUG9zKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44K544Kv44Ot44O844Or5L2N572u44Gu5pyA5aSn5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zTWF4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmVUYWJWaWV3KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlVGFiVmlldy5nZXRTY3JvbGxQb3NNYXgoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVRhYlZpZXcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2FjdGl2ZVRhYlZpZXcuc2Nyb2xsVG8ocG9zLCBhbmltYXRlLCB0aW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44K544Kv44Ot44O844Or44Kk44OZ44Oz44OIXHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU2Nyb2xsKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoVGFiSG9zdFZpZXcuRVZFTlRfU0NST0xMX01PVkUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44K544Kv44Ot44O844Or5a6M5LqG44Kk44OZ44Oz44OIXHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU2Nyb2xsU3RvcCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy50cmlnZ2VyKFRhYkhvc3RWaWV3LkVWRU5UX1NDUk9MTF9TVE9QKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCueOCr+ODreODvOODq+OCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICBzZXRTY3JvbGxIYW5kbGVyKGhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkLCBvbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlVGFiVmlldykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlVGFiVmlldy5zZXRTY3JvbGxIYW5kbGVyKGhhbmRsZXIsIG9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44K544Kv44Ot44O844Or57WC5LqG44Kk44OZ44Oz44OI44OP44Oz44OJ44Op6Kit5a6aL+ino+mZpFxyXG4gICAgICAgIHNldFNjcm9sbFN0b3BIYW5kbGVyKGhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkLCBvbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlVGFiVmlldykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYWN0aXZlVGFiVmlldy5zZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyLCBvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEhvc3QgZXZlbnQgaG9va3M6XHJcblxyXG4gICAgICAgIC8vIE9yaWVudGF0aW9uIOOBruWkieabtOaknOefpVxyXG4gICAgICAgIG9uT3JpZW50YXRpb25DaGFuZ2VkKG5ld09yaWVudGF0aW9uOiBPcmllbnRhdGlvbik6IHZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5vbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYnZpZXc6IElUYWJWaWV3KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0YWJ2aWV3Lm9uT3JpZW50YXRpb25DaGFuZ2VkKG5ld09yaWVudGF0aW9uKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9yZWZyZXNoVGltZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlZnJlc2hUaW1lcklkKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ZsaXBzbmFwICYmIDAgPCB0aGlzLl90YWJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDjg6rjg4jjg6njgqRcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZmxpcHNuYXAgJiYgdGhpcy5fZmxpcHNuYXAuX21heFBvaW50ICE9PSAodGhpcy5fdGFicy5sZW5ndGggLSAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9mbGlwc25hcC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlZnJlc2hUaW1lcklkID0gc2V0VGltZW91dChwcm9jLCBfQ29uZmlnLlRBQkhPU1RfUkVGUkVTSF9JTlRFUlZBTCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVmcmVzaFRpbWVySWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mbGlwc25hcC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGltZXJJZCA9IHNldFRpbWVvdXQocHJvYywgX0NvbmZpZy5UQUJIT1NUX1JFRlJFU0hfSU5URVJWQUwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBqUU0gZXZlbnQ6IFwicGFnZWNvbnRhaW5lcnNob3dcIiAo5penOlwicGFnZXNob3dcIikg44Gr5a++5b+cXHJcbiAgICAgICAgb25QYWdlU2hvdyhldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLlNob3dFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIub25QYWdlU2hvdyhldmVudCwgZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMucmVidWlsZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBTY3JvbGxNYW5hZ2VyIFByb2ZpbGUg566h55CGXHJcblxyXG4gICAgICAgIC8vIOODmuODvOOCuOOCouOCteOCpOODs+OCkuWGjeani+aIkFxyXG4gICAgICAgIHJlYnVpbGQoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFidmlldzogSVRhYlZpZXcpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICh0YWJ2aWV3Lm5lZWRSZWJ1aWxkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFidmlldy5yZWJ1aWxkKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFidmlldy5uZWVkUmVidWlsZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBtZXRob2RzOlxyXG5cclxuICAgICAgICAvLyBmbGlwc25hcCDnkrDlooPoqK3lrppcclxuICAgICAgICBwcml2YXRlIHNldEZsaXBzbmFwQ29uZGl0aW9uKG9wdGlvbnM6IEZsaXBzbmFwT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9mbGlwc25hcCA9IGdsb2JhbC5GbGlwc25hcChfQ29uZmlnLlRBQkhPU1RfU0VMRUNUT1IsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAkKHRoaXMuX2ZsaXBzbmFwLmVsZW1lbnQpLm9uKFwiZnN0b3VjaGVuZFwiLCB0aGlzLl9mbGlwRW5kRXZlbnRIYW5kbGVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICAkKHRoaXMuX2ZsaXBzbmFwLmVsZW1lbnQpLm9uKFwiZnN0b3VjaG1vdmVcIiwgdGhpcy5fZmxpcE1vdmVFdmVudEhhbmRsZXIuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmbGlwc25hcCDnkrDlooPnoLTmo4RcclxuICAgICAgICBwcml2YXRlIHJlc2V0RmxpcHNuYXBDb25kaXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9mbGlwc25hcCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzLl9mbGlwc25hcC5lbGVtZW50KS5vZmYoXCJmc3RvdWNobW92ZVwiLCB0aGlzLl9mbGlwTW92ZUV2ZW50SGFuZGxlci5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICAgICAgICQodGhpcy5fZmxpcHNuYXAuZWxlbWVudCkub2ZmKFwiZnN0b3VjaGVuZFwiLCB0aGlzLl9mbGlwRW5kRXZlbnRIYW5kbGVyLmJpbmQodGhpcykpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmxpcHNuYXAuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZmxpcHNuYXAgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2ZsaXBEZWx0YUNhY2hlID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFRhYiDliIfjgormm7/jgYjjga7liY3lh6bnkIZcclxuICAgICAgICBwcml2YXRlIHByZXByb2Nlc3ModG9JbmRleDogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RhYnMuZm9yRWFjaCgodGFidmlldzogSVRhYlZpZXcsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IHRoaXMuX2FjdGl2ZVRhYkluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFidmlldy50cmVhdFNjcm9sbFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyDnp7vli5Xnr4Tlm7LjgpLlj6/oppbljJYgTk9URTogbG9vcCDlr77lv5zmmYLjgavmnaHku7bopovnm7TjgZdcclxuICAgICAgICAgICAgICAgIGlmICgodGhpcy5fYWN0aXZlVGFiSW5kZXggPCB0b0luZGV4ICYmICh0aGlzLl9hY3RpdmVUYWJJbmRleCA8IGluZGV4ICYmIGluZGV4IDw9IHRvSW5kZXgpKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICh0b0luZGV4IDwgdGhpcy5fYWN0aXZlVGFiSW5kZXggJiYgKHRvSW5kZXggPD0gaW5kZXggJiYgaW5kZXggPCB0aGlzLl9hY3RpdmVUYWJJbmRleCkpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3LiRlbC5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwidmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBUYWIg5YiH44KK5pu/44GI44Gu5b6M5Yem55CGXHJcbiAgICAgICAgcHJpdmF0ZSBwb3N0cHJvY2VzcyhsYXN0QWN0aXZlVGFiSW5kZXg6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl90YWJzLmZvckVhY2goKHRhYnZpZXc6IElUYWJWaWV3LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fc2V0dGluZ3MuaW5hY3RpdmVWaXNpYmxlVGFiRGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiBsb29wIOWvvuW/nOaZguOBq+adoeS7tuWvvuW/nFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gdGhpcy5fc2V0dGluZ3MuaW5hY3RpdmVWaXNpYmxlVGFiRGlzdGFuY2U7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZVRhYkluZGV4IC0gZGlzdGFuY2UgPD0gaW5kZXggJiYgaW5kZXggPD0gdGhpcy5fYWN0aXZlVGFiSW5kZXggKyBkaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3LiRlbC5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwidmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFidmlldy5vblZpc2liaWxpdHlDaGFuZ2VkKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYnZpZXcuJGVsLmNzcyhcInZpc2liaWxpdHlcIiwgXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhYnZpZXcub25WaXNpYmlsaXR5Q2hhbmdlZChmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSB0aGlzLl9hY3RpdmVUYWJJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYnZpZXcub25UYWJTZWxlY3RlZCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYnZpZXcuc2V0U2Nyb2xsSGFuZGxlcih0aGlzLl9zY3JvbGxNb3ZlRXZlbnRIYW5kbGVyLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3LnNldFNjcm9sbFN0b3BIYW5kbGVyKHRoaXMuX3Njcm9sbEVuZEV2ZW50SGFuZGxlciwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSBsYXN0QWN0aXZlVGFiSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YWJ2aWV3LnNldFNjcm9sbEhhbmRsZXIodGhpcy5fc2Nyb2xsTW92ZUV2ZW50SGFuZGxlciwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRhYnZpZXcuc2V0U2Nyb2xsU3RvcEhhbmRsZXIodGhpcy5fc2Nyb2xsRW5kRXZlbnRIYW5kbGVyLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFidmlldy5vblRhYlJlbGVhc2VkKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gVGFiIEluZGV4IOOCkuaknOiovFxyXG4gICAgICAgIHByaXZhdGUgdmFsaWRUYWIoaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoMCA9PT0gdGhpcy5fdGFicy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICgwIDw9IGluZGV4ICYmIGluZGV4IDwgdGhpcy5fdGFicy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImludmFsaWQgdGFiIGluZGV4LiBpbmRleDogXCIgKyBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOOCouOCr+ODhuOCo+ODluOBquOCv+ODliBTY3JvbGxNYW5hZ2VyIOOCkuWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgZ2V0IF9hY3RpdmVUYWJWaWV3KCk6IElUYWJWaWV3IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYnNbdGhpcy5fYWN0aXZlVGFiSW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgTW9kZWwgPSBDRFAuRnJhbWV3b3JrLk1vZGVsO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5UYWJWaWV3XSBcIjtcclxuICAgIGNvbnN0IFNVUFBSRVNTX1dBUk5JTkdfSU5JVElBTF9IRUlHSFQgPSAxO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFRhYlZpZXdcclxuICAgICAqIEBicmllZiBUYWJIb3N0VmlldyDjgavjgqLjgr/jg4Pjg4Hlj6/og73jgaogVmlldyDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFRhYlZpZXc8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBMaXN0VmlldzxUTW9kZWw+IGltcGxlbWVudHMgSVRhYlZpZXcge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9ob3N0OiBUYWJIb3N0VmlldyA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfbmVlZFJlYnVpbGQ6IGJvb2xlYW4gPSBmYWxzZTsgIC8vIOODmuODvOOCuOihqOekuuaZguOBqyByZWJ1aWxkKCkg44KS44Kz44O844Or44GZ44KL44Gf44KB44Gu5YaF6YOo5aSJ5pWwXHJcbiAgICAgICAgcHJpdmF0ZSBfdGFiSW5kZXg6IG51bWJlcjsgICAgICAgICAgICAgIC8vIOiHqui6q+OBriBUYWIgSW5kZXhcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFRhYlZpZXdDb25zdHJ1Y3Rpb25PcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIoJC5leHRlbmQoe30sIHsgaW5pdGlhbEhlaWdodDogU1VQUFJFU1NfV0FSTklOR19JTklUSUFMX0hFSUdIVCB9LCBvcHRpb25zKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hvc3QgPSBvcHRpb25zLmhvc3Q7XHJcbiAgICAgICAgICAgIGlmICghb3B0aW9ucy5kZWxheVJlZ2lzdGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ob3N0LnJlZ2lzdGVyVGFiVmlldyh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJVmlld1BhZ2VyIHByb3BlcnRpZXMuXHJcblxyXG4gICAgICAgIC8vIEJhc2VUYWJQYWdlVmlldyDjgavjgqLjgq/jgrvjgrlcclxuICAgICAgICBwdWJsaWMgZ2V0IGhvc3QoKTogVGFiSG9zdFZpZXcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faG9zdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJlYnVpbGQg54q25oWL44G444Ki44Kv44K744K5XHJcbiAgICAgICAgcHVibGljIGdldCBuZWVkUmVidWlsZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX25lZWRSZWJ1aWxkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmVidWlsZCDnirbmhYvjgpLoqK3lrppcclxuICAgICAgICBwdWJsaWMgc2V0IG5lZWRSZWJ1aWxkKHJlYnVpbGQ6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy5fbmVlZFJlYnVpbGQgPSByZWJ1aWxkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJVmlld1BhZ2VyIEZyYW1ld29yay5cclxuXHJcbiAgICAgICAgLy8g54q25oWL44Gr5b+c44GY44Gf44K544Kv44Ot44O844Or5L2N572u44Gu5L+d5a2YL+W+qeWFg1xyXG4gICAgICAgIHRyZWF0U2Nyb2xsUG9zaXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuY29yZS50cmVhdFNjcm9sbFBvc2l0aW9uKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElUYWJWaWV3IEV2ZW50cy5cclxuXHJcbiAgICAgICAgLy8gU2Nyb2xsZXIg44Gu5Yid5pyf5YyW5pmC44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgb25Jbml0aWFsaXplKGhvc3Q6IFRhYkhvc3RWaWV3LCAkcm9vdDogSlF1ZXJ5KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hvc3QgPSBob3N0O1xyXG4gICAgICAgICAgICB0aGlzLmNvcmUuaW5pdGlhbGl6ZSgkcm9vdCwgaG9zdC5nZXRCYXNlSGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICBCYWNrYm9uZS5WaWV3LnByb3RvdHlwZS5zZXRFbGVtZW50LmNhbGwodGhpcywgJHJvb3QsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gU2Nyb2xsZXIg44Gu56C05qOE5pmC44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgb25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9ob3N0ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHZpc2liaWxpdHkg5bGe5oCn44GM5aSJ5pu044GV44KM44Gf44Go44GN44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgb25WaXNpYmlsaXR5Q2hhbmdlZCh2aXNpYmxlOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIG92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjg5rjg7zjgrjjgYzooajnpLrlrozkuobjgZfjgZ/jgajjgY3jgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICBvblRhYlNlbGVjdGVkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLmNvcmUuc2V0QWN0aXZlU3RhdGUodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDjg5rjg7zjgrjjgYzpnZ7ooajnpLrjgavliIfjgormm7/jgo/jgaPjgZ/jgajjgY3jgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICBvblRhYlJlbGVhc2VkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLmNvcmUuc2V0QWN0aXZlU3RhdGUoZmFsc2UpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g44OJ44Op44OD44Kw5Lit44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgb25UYWJTY3JvbGxpbmcocG9zaXRpb246IG51bWJlciwgb2Zmc2V0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gb3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSU9yaWVudGF0aW9uQ2hhbmdlZExpc3RlbmVyIGV2ZW50cy5cclxuXHJcbiAgICAgICAgLy8gT3JpZW50YXRpb24g44Gu5aSJ5pu044KS5Y+X5L+hXHJcbiAgICAgICAgb25PcmllbnRhdGlvbkNoYW5nZWQobmV3T3JpZW50YXRpb246IEZyYW1ld29yay5PcmllbnRhdGlvbik6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBvdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBPdmVycmlkZTogSUxpc3RWaWV3XHJcblxyXG4gICAgICAgIC8vIGNvcmUgZnJhbWV3b3JrIGFjY2Vzc1xyXG4gICAgICAgIGdldCBjb3JlKCk6IFNjcm9sbE1hbmFnZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gKDxhbnk+dGhpcykuX3Njcm9sbE1ncjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJvdGVjdGVkIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8g6Ieq6Lqr44GuIFRhYiBJbmRleCDjgpLlj5blvpdcclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IHRhYkluZGV4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHRoaXMuX3RhYkluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90YWJJbmRleCA9IHRoaXMuX2hvc3QuZ2V0VGFiSW5kZXhPZih0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFiSW5kZXg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDoh6rouqvjgYwgYWN0aXZlIOOBi+WIpOWumlxyXG4gICAgICAgIHByb3RlY3RlZCBpc0FjdGl2ZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGFiSW5kZXggPT09IHRoaXMuX2hvc3QuZ2V0QWN0aXZlVGFiSW5kZXgoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgTW9kZWwgPSBDRFAuRnJhbWV3b3JrLk1vZGVsO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5QYWdlTGlzdFZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgUGFnZUxpc3RWaWV3IOOBuOOBruWIneacn+WMluaDheWgseOCkuagvOe0jeOBmeOCi+OCpOODs+OCv+ODvOODleOCp+OCpOOCueOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBMaXN0Vmlld09wdGlvbnMsIFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBhdXRvRGVzdG9yeUVsZW1lbnQ/OiBib29sZWFuOyAgICAgICAgLy8hPCDjg5rjg7zjgrjpgbfnp7vliY3jgasgTGlzdCBFbGVtZW50IOOCkuegtOajhOOBmeOCi+WgtOWQiOOBryB0cnVlIOOCkuaMh+WumlxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIOS7ruaDs+ODquOCueODiOODk+ODpeODvOapn+iDveOCkuaMgeOBpCBQYWdlVmlldyDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VMaXN0VmlldzxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFBhZ2VWaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJTGlzdFZpZXcge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9zY3JvbGxNZ3I6IFNjcm9sbE1hbmFnZXIgPSBudWxsOyAgICAvLyE8IHNjcm9sbCDjgrPjgqLjg63jgrjjg4Pjgq9cclxuICAgICAgICBwcml2YXRlIF9uZWVkUmVidWlsZDogYm9vbGVhbiA9IGZhbHNlOyAgICAgICAvLyE8IOODmuODvOOCuOihqOekuuaZguOBqyByZWJ1aWxkKCkg44KS44Kz44O844Or44GZ44KL44Gf44KB44Gu5YaF6YOo5aSJ5pWwXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdXJsICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIHRlbXBsYXRlIOOBq+S9v+eUqOOBmeOCiyBVUkxcclxuICAgICAgICAgKiBAcGFyYW0gaWQgICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIOOBq+aMr+OCieOCjOOBnyBJRFxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogUGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHVybCwgaWQsICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgICAgICBhdXRvRGVzdG9yeUVsZW1lbnQ6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LCBvcHRpb25zKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nciA9IG5ldyBTY3JvbGxNYW5hZ2VyKG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHJlYnVpbGQoKSDjga7jgrnjgrHjgrjjg6Xjg7zjg6rjg7PjgrBcclxuICAgICAgICBwdWJsaWMgcmVzZXJ2ZVJlYnVpbGQoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX25lZWRSZWJ1aWxkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IFBhZ2VWaWV3XHJcblxyXG4gICAgICAgIC8vISBPcmllbnRhdGlvbiDjga7lpInmm7TmpJznn6VcclxuICAgICAgICBvbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbjogRnJhbWV3b3JrLk9yaWVudGF0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zZXRCYXNlSGVpZ2h0KHRoaXMuZ2V0UGFnZUJhc2VIZWlnaHQoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Oa44O844K46YG356e755u05YmN44Kk44OZ44Oz44OI5Yem55CGXHJcbiAgICAgICAgb25CZWZvcmVSb3V0ZUNoYW5nZSgpOiBJUHJvbWlzZUJhc2U8YW55PiB7XHJcbiAgICAgICAgICAgIGlmICgoPFBhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPj50aGlzLl9wYWdlT3B0aW9ucykuYXV0b0Rlc3RvcnlFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5vbkJlZm9yZVJvdXRlQ2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXHJcbiAgICAgICAgb25QYWdlQmVmb3JlU2hvdyhldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLlNob3dFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlU2hvdyhldmVudCwgZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5pbml0aWFsaXplKHRoaXMuJHBhZ2UsIHRoaXMuZ2V0UGFnZUJhc2VIZWlnaHQoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICAgIG9uUGFnZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3Iuc2V0QmFzZUhlaWdodCh0aGlzLmdldFBhZ2VCYXNlSGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbmVlZFJlYnVpbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVidWlsZCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmVlZFJlYnVpbGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIub25QYWdlUmVtb3ZlKGV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9maWxlIOeuoeeQhlxyXG5cclxuICAgICAgICAvLyEg5Yid5pyf5YyW5riI44G/44GL5Yik5a6aXHJcbiAgICAgICAgaXNJbml0aWFsaXplZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5pc0luaXRpYWxpemVkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OX44Ot44OR44OG44Kj44KS5oyH5a6a44GX44Gm44CBTGlzdEl0ZW0g44KS566h55CGXHJcbiAgICAgICAgYWRkSXRlbShcclxuICAgICAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgICAgIGluaXRpYWxpemVyOiBuZXcgKG9wdGlvbnM/OiBhbnkpID0+IEJhc2VMaXN0SXRlbVZpZXcsXHJcbiAgICAgICAgICAgIGluZm86IGFueSxcclxuICAgICAgICAgICAgaW5zZXJ0VG8/OiBudW1iZXJcclxuICAgICAgICAgICAgKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FkZExpbmUobmV3IExpbmVQcm9maWxlKHRoaXMuX3Njcm9sbE1nciwgTWF0aC5mbG9vcihoZWlnaHQpLCBpbml0aWFsaXplciwgaW5mbyksIGluc2VydFRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ8gSXRlbSDjgpLliYrpmaRcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXIsIHNpemU/OiBudW1iZXIsIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXJbXSwgZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xyXG4gICAgICAgIHJlbW92ZUl0ZW0oaW5kZXg6IGFueSwgYXJnMj86IG51bWJlciwgYXJnMz86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVtb3ZlSXRlbShpbmRleCwgYXJnMiwgYXJnMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIEl0ZW0g44Gr6Kit5a6a44GX44Gf5oOF5aCx44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBudW1iZXIpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBKUXVlcnkuRXZlbnQpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmdldEl0ZW1JbmZvKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Ki44Kv44OG44Kj44OW44Oa44O844K444KS5pu05pawXHJcbiAgICAgICAgcmVmcmVzaCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlZnJlc2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmnKrjgqLjgrXjgqTjg7Pjg5rjg7zjgrjjgpLmp4vnr4lcclxuICAgICAgICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci51cGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5rjg7zjgrjjgqLjgrXjgqTjg7PjgpLlho3mp4vmiJBcclxuICAgICAgICByZWJ1aWxkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVidWlsZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeuoei9hOODh+ODvOOCv+OCkuegtOajhFxyXG4gICAgICAgIHJlbGVhc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9maWxlIEJhY2t1cCAvIFJlc3RvcmVcclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODkOODg+OCr+OCouODg+ODl1xyXG4gICAgICAgIGJhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODquOCueODiOOColxyXG4gICAgICAgIHJlc3RvcmUoa2V5OiBzdHJpbmcsIHJlYnVpbGQ6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJldHZhbCA9IHRoaXMuX3Njcm9sbE1nci5yZXN0b3JlKGtleSwgcmVidWlsZCk7XHJcbiAgICAgICAgICAgIGlmIChyZXR2YWwgJiYgIXJlYnVpbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXJ2ZVJlYnVpbGQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0dmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruacieeEoVxyXG4gICAgICAgIGhhc0JhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmhhc0JhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruegtOajhFxyXG4gICAgICAgIGNsZWFyQmFja3VwKGtleT86IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmNsZWFyQmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gr44Ki44Kv44K744K5XHJcbiAgICAgICAgZ2V0IGJhY2t1cERhdGEoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5iYWNrdXBEYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgU2Nyb2xsXHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgc2V0U2Nyb2xsSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldFNjcm9sbEhhbmRsZXIoaGFuZGxlciwgb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+e1guS6huOCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICBzZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldFNjcm9sbFN0b3BIYW5kbGVyKGhhbmRsZXIsIG9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3MoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRTY3JvbGxQb3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jga7mnIDlpKflgKTjgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3NNYXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRTY3JvbGxQb3NNYXgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNjcm9sbFRvKHBvcywgYW5pbWF0ZSwgdGltZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GV44KM44GfIExpc3RJdGVtVmlldyDjga7ooajnpLrjgpLkv53oqLxcclxuICAgICAgICBlbnN1cmVWaXNpYmxlKGluZGV4OiBudW1iZXIsIG9wdGlvbnM/OiBFbnN1cmVWaXNpYmxlT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuZW5zdXJlVmlzaWJsZShpbmRleCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9wZXJ0aWVzXHJcblxyXG4gICAgICAgIC8vISBjb3JlIGZyYW1ld29yayBhY2Nlc3NcclxuICAgICAgICBnZXQgY29yZSgpOiBJTGlzdFZpZXdGcmFtZXdvcmsge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgSW50ZXJuYWwgSS9GXHJcblxyXG4gICAgICAgIC8vISDnmbvpjLIgZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCi1xyXG4gICAgICAgIF9hZGRMaW5lKF9saW5lOiBhbnksIGluc2VydFRvPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5fYWRkTGluZShfbGluZSwgaW5zZXJ0VG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZDpcclxuXHJcbiAgICAgICAgLy8hIOODmuODvOOCuOOBruWfuua6luWApOOCkuWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgZ2V0UGFnZUJhc2VIZWlnaHQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuICQod2luZG93KS5oZWlnaHQoKSAtIHBhcnNlSW50KHRoaXMuJHBhZ2UuY3NzKFwicGFkZGluZy10b3BcIiksIDEwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IE1vZGVsID0gQ0RQLkZyYW1ld29yay5Nb2RlbDtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZUV4cGFuZGFibGVMaXN0Vmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgUGFnZUV4cGFuZGFibGVMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIOmWi+mWieODquOCueODiOODk+ODpeODvOapn+iDveOCkuaMgeOBpCBQYWdlVmlldyDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VFeHBhbmRhYmxlTGlzdFZpZXc8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBQYWdlTGlzdFZpZXc8VE1vZGVsPiBpbXBsZW1lbnRzIElFeHBhbmRhYmxlTGlzdFZpZXcge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9leHBhbmRNYW5hZ2VyOiBFeHBhbmRNYW5hZ2VyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB1cmwgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHBhZ2UgdGVtcGxhdGUg44Gr5L2/55So44GZ44KLIFVSTFxyXG4gICAgICAgICAqIEBwYXJhbSBpZCAgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHBhZ2Ug44Gr5oyv44KJ44KM44GfIElEXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge1BhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIodXJsLCBpZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIgPSBuZXcgRXhwYW5kTWFuYWdlcih0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUV4cGFuZGFibGVMaXN0Vmlld1xyXG5cclxuICAgICAgICAvLyEg5paw6KaPIEdyb3VwUHJvZmlsZSDjgpLkvZzmiJBcclxuICAgICAgICBuZXdHcm91cChpZD86IHN0cmluZyk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLm5ld0dyb3VwKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnmbvpjLLmuIjjgb8gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0R3JvdXAoaWQ6IHN0cmluZyk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmdldEdyb3VwKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrKwx6ZqO5bGk44GuIEdyb3VwIOeZu+mMslxyXG4gICAgICAgIHJlZ2lzdGVyVG9wR3JvdXAodG9wR3JvdXA6IEdyb3VwUHJvZmlsZSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlZ2lzdGVyVG9wR3JvdXAodG9wR3JvdXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOesrDHpmo7lsaTjga4gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0VG9wR3JvdXBzKCk6IEdyb3VwUHJvZmlsZVtdIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuZ2V0VG9wR3JvdXBzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5bGV6ZaLICgx6ZqO5bGkKVxyXG4gICAgICAgIGV4cGFuZEFsbCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5leHBhbmRBbGwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgZnjgbnjgabjga7jgrDjg6vjg7zjg5fjgpLlj47mnZ8gKDHpmo7lsaQpXHJcbiAgICAgICAgY29sbGFwc2VBbGwoZGVsYXk/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5jb2xsYXBzZUFsbChkZWxheSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5bGV6ZaL5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNFeHBhbmRpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmlzRXhwYW5kaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5Y+O5p2f5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNDb2xsYXBzaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5pc0NvbGxhcHNpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDplovplonkuK3jgYvliKTlrppcclxuICAgICAgICBpc1N3aXRjaGluZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuaXNTd2l0Y2hpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBsYXlvdXQga2V5IOOCkuWPluW+l1xyXG4gICAgICAgIGdldCBsYXlvdXRLZXkoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIubGF5b3V0S2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGxheW91dCBrZXkg44KS6Kit5a6aXHJcbiAgICAgICAgc2V0IGxheW91dEtleShrZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLmxheW91dEtleSA9IGtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IFBhZ2VMaXN0Vmlld1xyXG5cclxuICAgICAgICAvLyEg44OH44O844K/44KS56C05qOEXHJcbiAgICAgICAgcmVsZWFzZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlbGVhc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg5Djg4Pjgq/jgqLjg4Pjg5dcclxuICAgICAgICBiYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuYmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44Oq44K544OI44KiXHJcbiAgICAgICAgcmVzdG9yZShrZXk6IHN0cmluZywgcmVidWlsZDogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIucmVzdG9yZShrZXksIHJlYnVpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKipcclxuICogalF1ZXJ5IHBsdWdpbiBkZWZpbml0aW9uXHJcbiAqL1xyXG5pbnRlcmZhY2UgSlF1ZXJ5IHtcclxuICAgIHJpcHBsZShvcHRpb25zPzogQ0RQLlVJLkRvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnk7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICAvLyBqUXVlcnkgcGx1Z2luXHJcbiAgICAkLmZuLnJpcHBsZSA9IGZ1bmN0aW9uIChvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgY29uc3QgJGVsID0gJCh0aGlzKTtcclxuICAgICAgICBpZiAoJGVsLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkZWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkZWwub24oRnJhbWV3b3JrLlBhdGNoLnNfdmNsaWNrRXZlbnQsIGZ1bmN0aW9uIChldmVudDogSlF1ZXJ5LkV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1cmZhY2UgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gY3JlYXRlIHN1cmZhY2UgaWYgaXQgZG9lc24ndCBleGlzdFxyXG4gICAgICAgICAgICBpZiAoc3VyZmFjZS5maW5kKFwiLnVpLXJpcHBsZS1pbmtcIikubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBzdXJmYWNlLnByZXBlbmQoXCI8ZGl2IGNsYXNzPSd1aS1yaXBwbGUtaW5rJz48L2Rpdj5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBpbmsgPSBzdXJmYWNlLmZpbmQoXCIudWktcmlwcGxlLWlua1wiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHN0b3AgdGhlIHByZXZpb3VzIGFuaW1hdGlvblxyXG4gICAgICAgICAgICBpbmsucmVtb3ZlQ2xhc3MoXCJ1aS1yaXBwbGUtYW5pbWF0ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGluayBzaXplOlxyXG4gICAgICAgICAgICBpZiAoIWluay5oZWlnaHQoKSAmJiAhaW5rLndpZHRoKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGQgPSBNYXRoLm1heChzdXJmYWNlLm91dGVyV2lkdGgoKSwgc3VyZmFjZS5vdXRlckhlaWdodCgpKTtcclxuICAgICAgICAgICAgICAgIGluay5jc3MoeyBoZWlnaHQ6IGQsIHdpZHRoOiBkIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB4ID0gZXZlbnQucGFnZVggLSBzdXJmYWNlLm9mZnNldCgpLmxlZnQgLSAoaW5rLndpZHRoKCkgLyAyKTtcclxuICAgICAgICAgICAgY29uc3QgeSA9IGV2ZW50LnBhZ2VZIC0gc3VyZmFjZS5vZmZzZXQoKS50b3AgLSAoaW5rLmhlaWdodCgpIC8gMik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByaXBwbGVDb2xvciA9IHN1cmZhY2UuZGF0YShcInJpcHBsZS1jb2xvclwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGFuaW1hdGlvbiBlbmQgaGFuZGxlclxyXG4gICAgICAgICAgICBjb25zdCBBTklNQVRJT05fRU5EX0VWRU5UID0gXCJhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kXCI7XHJcbiAgICAgICAgICAgIGluay5vbihBTklNQVRJT05fRU5EX0VWRU5ULCBmdW5jdGlvbiAoZXY6IEpRdWVyeS5FdmVudCkge1xyXG4gICAgICAgICAgICAgICAgaW5rLm9mZigpO1xyXG4gICAgICAgICAgICAgICAgaW5rLnJlbW92ZUNsYXNzKFwidWktcmlwcGxlLWFuaW1hdGVcIik7XHJcbiAgICAgICAgICAgICAgICBpbmsgPSBudWxsO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gYW5kIGFkZCBjbGFzcyAuYW5pbWF0ZVxyXG4gICAgICAgICAgICBpbmsuY3NzKHtcclxuICAgICAgICAgICAgICAgIHRvcDogeSArIFwicHhcIixcclxuICAgICAgICAgICAgICAgIGxlZnQ6IHggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiByaXBwbGVDb2xvclxyXG4gICAgICAgICAgICB9KS5hZGRDbGFzcyhcInVpLXJpcHBsZS1hbmltYXRlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGVyaWFsIERlc2lnbiBSaXBwbGUg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCBOT19SSVBQTEVfQ0xBU1MgPSBbXHJcbiAgICAgICAgICAgIFwiLnVpLXJpcHBsZS1ub25lXCIsXHJcbiAgICAgICAgICAgIFwiLnVpLWZsaXBzd2l0Y2gtb25cIixcclxuICAgICAgICAgICAgXCIudWktc2xpZGVyLWhhbmRsZVwiLFxyXG4gICAgICAgICAgICBcIi51aS1pbnB1dC1jbGVhclwiLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGxldCBzZWxlY3RvciA9IFwiLnVpLWJ0blwiO1xyXG4gICAgICAgIGlmICgkdWkuaGFzQ2xhc3MoXCJ1aS1wYWdlXCIpKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0gXCIudWktY29udGVudCAudWktYnRuXCI7IC8vIGhlYWRlciDjga/oh6rli5UgcmlwcGxlIOWMluWvvuixoeWkllxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHVpLmZpbmQoc2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKGluZGV4LCBlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGVsZW0uaXMoTk9fUklQUExFX0NMQVNTLmpvaW4oXCIsXCIpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcyhcInVpLXJpcHBsZVwiKTtcclxuXHJcbiAgICAgICAgLy8gcmlwcGxpZnlcclxuICAgICAgICAkdWkuZmluZChcIi51aS1yaXBwbGVcIilcclxuICAgICAgICAgICAgLmVhY2goKGluZGV4OiBudW1iZXIsIGVsZW06IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICQoZWxlbSkucmlwcGxlKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gJHVpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeZu+mMslxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3RlckRvbUV4dGVuc2lvbihhcHBseURvbUV4dGVuc2lvbik7XHJcbn1cclxuIiwiLyoqXHJcbiAqIGpRdWVyeSBwbHVnaW4gZGVmaW5pdGlvblxyXG4gKi9cclxuaW50ZXJmYWNlIEpRdWVyeSB7XHJcbiAgICBzcGlubmVyKG9wdGlvbnM/OiBDRFAuVUkuRG9tRXh0ZW5zaW9uT3B0aW9ucyB8IFwicmVmcmVzaFwiKTogSlF1ZXJ5O1xyXG59XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgaW1wb3J0IFRlbXBsYXRlID0gQ0RQLlRvb2xzLlRlbXBsYXRlO1xyXG4gICAgaW1wb3J0IEpTVCAgICAgID0gQ0RQLlRvb2xzLkpTVDtcclxuXHJcbiAgICBsZXQgX3RlbXBsYXRlOiBKU1Q7XHJcblxyXG4gICAgLy8galF1ZXJ5IHBsdWdpblxyXG4gICAgJC5mbi5zcGlubmVyID0gZnVuY3Rpb24gKG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zIHwgXCJyZWZyZXNoXCIpIHtcclxuICAgICAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlZnJlc2goJCh0aGlzKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNwaW5uZXJpZnkoJCh0aGlzKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBzcGlubmVyaWZ5KCR0YXJnZXQ6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGlmICgkdGFyZ2V0Lmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkdGFyZ2V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFfdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgX3RlbXBsYXRlID0gVGVtcGxhdGUuZ2V0SlNUKGBcclxuICAgICAgICAgICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHQvdGVtcGxhdGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItYmFzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lci1nYXBcIiB7e2JvcmRlclRvcH19Pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lci1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyLWhhbGYtY2lyY2xlXCIge3tib3JkZXJ9fT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXItcmlnaHRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXItaGFsZi1jaXJjbGVcIiB7e2JvcmRlcn19Pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvc2NyaXB0PlxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1ha2VUZW1wbGF0ZVBhcmFtID0gKGNscjogc3RyaW5nKTogb2JqZWN0ID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGJvcmRlclRvcDogXCJzdHlsZT1ib3JkZXItdG9wLWNvbG9yOlwiICsgY2xyICsgXCI7XCIsXHJcbiAgICAgICAgICAgICAgICBib3JkZXI6IFwic3R5bGU9Ym9yZGVyLWNvbG9yOlwiICsgY2xyICsgXCI7XCIsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgY29sb3IgPSAkdGFyZ2V0LmRhdGEoXCJzcGlubmVyLWNvbG9yXCIpO1xyXG4gICAgICAgIGxldCBwYXJhbSA9IG51bGw7XHJcbiAgICAgICAgaWYgKGNvbG9yKSB7XHJcbiAgICAgICAgICAgICR0YXJnZXQuY3NzKHsgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IGNvbG9yIH0pO1xyXG4gICAgICAgICAgICBwYXJhbSA9IG1ha2VUZW1wbGF0ZVBhcmFtKGNvbG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHRhcmdldC5hcHBlbmQoX3RlbXBsYXRlKHBhcmFtKSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZWZyZXNoKCR0YXJnZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlPUyAxMC4yKyBTVkcgU01JTCDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PjgYwgMuWbnuebruS7pemZjeWLleOBi+OBquOBhOWVj+mhjOOBruWvvuetllxyXG4gICAgLy8gZGF0YTppbWFnZS9zdmcreG1sOzxjYWNoZSBidXN0IHN0cmluZz47YmFzZTY0LC4uLiDjgajjgZnjgovjgZPjgajjgacgZGF0YS11cmwg44Gr44KCIGNhY2hlIGJ1c3Rpbmcg44GM5pyJ5Yq544Gr44Gq44KLXHJcbiAgICBmdW5jdGlvbiByZWZyZXNoKCR0YXJnZXQ6IEpRdWVyeSk6IEpRdWVyeSB7XHJcbiAgICAgICAgY29uc3QgUFJFRklYID0gW1wiLXdlYmtpdC1cIiwgXCJcIl07XHJcblxyXG4gICAgICAgIGNvbnN0IHZhbGlkID0gKHByb3ApID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIChwcm9wICYmIFwibm9uZVwiICE9PSBwcm9wKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgZGF0YVVybDogc3RyaW5nO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gUFJFRklYLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIXZhbGlkKGRhdGFVcmwpKSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhVXJsID0gJHRhcmdldC5jc3MoUFJFRklYW2ldICsgXCJtYXNrLWltYWdlXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbGlkKGRhdGFVcmwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaU9TIOOBp+OBryB1cmwoZGF0YSoqKik7IOWGheOBqyAnXCInIOOBr+WFpeOCieOBquOBhFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gZGF0YVVybC5tYXRjaCgvKHVybFxcKGRhdGE6aW1hZ2VcXC9zdmdcXCt4bWw7KShbXFxzXFxTXSopPyhiYXNlNjQsW1xcc1xcU10qXFwpKS8pO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVXJsID0gYCR7bWF0Y2hbMV19YnVzdD0ke0RhdGUubm93KCkudG9TdHJpbmcoMzYpfTske21hdGNoWzNdfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVVybCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh2YWxpZChkYXRhVXJsKSkge1xyXG4gICAgICAgICAgICAgICAgJHRhcmdldC5jc3MoUFJFRklYW2ldICsgXCJtYXNrLWltYWdlXCIsIGRhdGFVcmwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gJHRhcmdldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGVyaWFsIERlc2lnbiBTcGlubmVyIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgJHVpLmZpbmQoXCIudWktc3Bpbm5lciwgLnVpLWljb24tbG9hZGluZ1wiKVxyXG4gICAgICAgICAgICAuZWFjaCgoaW5kZXg6IG51bWJlciwgZWxlbTogRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJChlbGVtKS5zcGlubmVyKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gJHVpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeZu+mMslxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3RlckRvbUV4dGVuc2lvbihhcHBseURvbUV4dGVuc2lvbik7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSS5FeHRlbnNpb24ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGV4dCBJbnB1dCDnlKggRmxvYXRpbmcgTGFiZWwg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCB1cGRhdGUgPSAoZWxlbTogRWxlbWVudCwgZmxvYXRpbmc6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJGVsZW0gPSAkKGVsZW0pO1xyXG4gICAgICAgICAgICBpZiAoZmxvYXRpbmcpIHtcclxuICAgICAgICAgICAgICAgICRlbGVtLmFkZENsYXNzKFwidWktZmxvYXQtbGFiZWwtZmxvYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbS5yZW1vdmVDbGFzcyhcInVpLWZsb2F0LWxhYmVsLWZsb2F0aW5nXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgZmxvYXRpbmdpZnkgPSAoZWxlbTogRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9ICQoZWxlbSkuYXR0cihcImZvclwiKTtcclxuICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gJHVpLmZpbmQoXCIjXCIgKyBpZCk7XHJcbiAgICAgICAgICAgIGlmIChcInNlYXJjaFwiID09PSAkaW5wdXQuanFtRGF0YShcInR5cGVcIikpIHtcclxuICAgICAgICAgICAgICAgICQoZWxlbSkuYWRkQ2xhc3MoXCJ1aS1mbG9hdC1sYWJlbC1oYXMtaWNvblwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1cGRhdGUoZWxlbSwgISEkaW5wdXQudmFsKCkpO1xyXG4gICAgICAgICAgICAkaW5wdXQub24oXCJrZXl1cCBjaGFuZ2UgaW5wdXQgZm9jdXMgYmx1ciBjdXQgcGFzdGVcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZShlbGVtLCAhISQoZXZlbnQudGFyZ2V0KS52YWwoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICR1aS5maW5kKFwibGFiZWwudWktZmxvYXQtbGFiZWwsIC51aS1mbG9hdC1sYWJlbCBsYWJlbFwiKVxyXG4gICAgICAgICAgICAuZWFjaCgoaW5kZXg6IG51bWJlciwgZWxlbTogRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZmxvYXRpbmdpZnkoZWxlbSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gJHVpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeZu+mMslxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3RlckRvbUV4dGVuc2lvbihhcHBseURvbUV4dGVuc2lvbik7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSS5FeHRlbnNpb24ge1xyXG5cclxuICAgIGltcG9ydCBGcmFtZXdvcmsgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogalF1ZXJ5IE1vYmlsZSBGbGlwIFN3aXRjaCDmi6HlvLVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICAgICAgICR1aSAgICAgICBbaW5dIOaknOe0ouWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbk9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcHBseURvbUV4dGVuc2lvbigkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogZmxpcHN3aXRjaCDjgavntJDjgaXjgY8gbGFiZWwg44GvIE9TIOOBq+OCiOOBo+OBpiBldmVudCDnmbrooYzlvaLlvI/jgYznlbDjgarjgovjgZ/jgoHjg5Xjg4Pjgq/jgZfjgabni6zoh6rjgqTjg5njg7Pjg4jjgaflr77lv5zjgZnjgosuXHJcbiAgICAgICAgICog44G+44GfIGZsaXBzd2l0Y2gg44Gv5YaF6YOo44GnIGNsaWNrIOOCkueZuuihjOOBl+OBpuOBhOOCi+OBjOOAgXZjbGljayDjgavlpInmm7TjgZnjgosuXHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIGNvbnN0IF9nZXRBbGxTd2l0Y2hlcyA9ICgpOiBKUXVlcnkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gJHVpLmZpbmQoXCIudWktZmxpcHN3aXRjaFwiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfZ2V0SW5wdXRGcm9tU3dpdGNoID0gKCRzd2l0Y2g6IEpRdWVyeSk6IEpRdWVyeSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9ICRzd2l0Y2guZmluZChcImlucHV0XCIpO1xyXG4gICAgICAgICAgICBpZiAoJGlucHV0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRpbnB1dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCAkc2VsZWN0ID0gJHN3aXRjaC5maW5kKFwic2VsZWN0XCIpO1xyXG4gICAgICAgICAgICBpZiAoJHNlbGVjdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkc2VsZWN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IF9jaGFuZ2UgPSAoJGlucHV0OiBKUXVlcnksIHRvOiBib29sZWFuKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGlmICgkaW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChcIklOUFVUXCIgPT09ICRpbnB1dFswXS5ub2RlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRpbnB1dC5wcm9wKFwiY2hlY2tlZFwiLCB0bykuZmxpcHN3aXRjaChcInJlZnJlc2hcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiU0VMRUNUXCIgPT09ICRpbnB1dFswXS5ub2RlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRpbnB1dC52YWwodG8gPyBcIm9uXCIgOiBcIm9mZlwiKS5mbGlwc3dpdGNoKFwicmVmcmVzaFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IF9nZXRMYWJlbHNGcm9tU3dpdGNoID0gKCRzd2l0Y2g6IEpRdWVyeSk6IEpRdWVyeSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9IF9nZXRJbnB1dEZyb21Td2l0Y2goJHN3aXRjaCk7XHJcbiAgICAgICAgICAgIGlmICgkaW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVscyA9ICg8YW55PiRpbnB1dFswXSkubGFiZWxzO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxhYmVscykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKGxhYmVscyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfZ2V0U3dpdGNoRnJvbUxhYmVsID0gKCRsYWJlbDogSlF1ZXJ5KTogSlF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9ICRsYWJlbC5hdHRyKFwiZm9yXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gX2dldEFsbFN3aXRjaGVzKCkuZmluZChcIltuYW1lPSdcIiArIG5hbWUgKyBcIiddXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIF9nZXRBbGxTd2l0Y2hlcygpXHJcbiAgICAgICAgICAgIC5vbihcInZjbGljayBfY2hhbmdlX2ZsaXBzd2ljaFwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJHN3aXRjaCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChldmVudC50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gX2dldElucHV0RnJvbVN3aXRjaCgkc3dpdGNoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoYW5nZVRvID0gISRzd2l0Y2guaGFzQ2xhc3MoXCJ1aS1mbGlwc3dpdGNoLWFjdGl2ZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJHRhcmdldC5oYXNDbGFzcyhcInVpLWZsaXBzd2l0Y2gtaW5wdXRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBfY2hhbmdlKCRpbnB1dCwgY2hhbmdlVG8pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkdGFyZ2V0Lmhhc0NsYXNzKFwidWktZmxpcHN3aXRjaC1vblwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChGcmFtZXdvcmsuUGxhdGZvcm0uTW9iaWxlICYmIEZyYW1ld29yay5QYXRjaC5pc1N1cHBvcnRlZFZjbGljaygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGFuZ2UoJGlucHV0LCBjaGFuZ2VUbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZWFjaCgoaW5kZXg6IG51bWJlciwgZmxpcHN3aXRjaDogRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgX2dldExhYmVsc0Zyb21Td2l0Y2goJChmbGlwc3dpdGNoKSlcclxuICAgICAgICAgICAgICAgICAgICAub24oXCJ2Y2xpY2tcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgJHN3aXRjaCA9IF9nZXRTd2l0Y2hGcm9tTGFiZWwoJChldmVudC50YXJnZXQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkc3dpdGNoLnBhcmVudCgpLmhhc0NsYXNzKFwidWktc3RhdGUtZGlzYWJsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzd2l0Y2gudHJpZ2dlcihcIl9jaGFuZ2VfZmxpcHN3aWNoXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gJHVpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeZu+mMslxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3RlckRvbUV4dGVuc2lvbihhcHBseURvbUV4dGVuc2lvbik7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSS5FeHRlbnNpb24ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogalF1ZXJ5IE1vYmlsZSBTbGlkZXIg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICAkdWkuZmluZChcIi51aS1zbGlkZXItaW5wdXRcIilcclxuICAgICAgICAgICAgLm9uKFwic2xpZGVzdG9wXCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkaGFuZGxlcyA9ICQoZXZlbnQuY3VycmVudFRhcmdldClcclxuICAgICAgICAgICAgICAgICAgICAucGFyZW50KClcclxuICAgICAgICAgICAgICAgICAgICAuZmluZChcIi51aS1zbGlkZXItaGFuZGxlXCIpO1xyXG4gICAgICAgICAgICAgICAgJGhhbmRsZXMuYmx1cigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gJHVpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeZu+mMslxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3RlckRvbUV4dGVuc2lvbihhcHBseURvbUV4dGVuc2lvbik7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSS5FeHRlbnNpb24ge1xyXG5cclxuICAgIC8vISBpU2Nyb2xsLmNsaWNrIHBhdGNoXHJcbiAgICBjb25zdCBwYXRjaF9JU2Nyb2xsX3V0aWxzX2NsaWNrID0gZnVuY3Rpb24gKGV2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldDogYW55ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgIGNvbnN0IGU6IGFueSA9IGV2ZW50O1xyXG4gICAgICAgIGxldCBldjogTW91c2VFdmVudDtcclxuXHJcbiAgICAgICAgLy8gW0NEUCBtb2RpZmllZF06IHNldCB0YXJnZXQuY2xpZW50WC5cclxuICAgICAgICBpZiAobnVsbCA9PSB0YXJnZXQuY2xpZW50WCB8fCBudWxsID09IHRhcmdldC5jbGllbnRZKSB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IGUucGFnZVggJiYgbnVsbCAhPSBlLnBhZ2VZKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xpZW50WCA9IGUucGFnZVg7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xpZW50WSA9IGUucGFnZVk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xpZW50WCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xpZW50WSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghKC8oU0VMRUNUfElOUFVUfFRFWFRBUkVBKS9pKS50ZXN0KHRhcmdldC50YWdOYW1lKSkge1xyXG4gICAgICAgICAgICBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiTW91c2VFdmVudHNcIik7XHJcbiAgICAgICAgICAgIGV2LmluaXRNb3VzZUV2ZW50KFwiY2xpY2tcIiwgdHJ1ZSwgdHJ1ZSwgZS52aWV3LCAxLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNjcmVlblgsIHRhcmdldC5zY3JlZW5ZLCB0YXJnZXQuY2xpZW50WCwgdGFyZ2V0LmNsaWVudFksXHJcbiAgICAgICAgICAgICAgICBlLmN0cmxLZXksIGUuYWx0S2V5LCBlLnNoaWZ0S2V5LCBlLm1ldGFLZXksXHJcbiAgICAgICAgICAgICAgICAwLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgICg8YW55PmV2KS5fY29uc3RydWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChldik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgc19hcHBsaWVkID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpU2Nyb2xsIFBhdGNoIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5UGF0Y2goJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBpZiAoIXNfYXBwbGllZCAmJiBnbG9iYWwuSVNjcm9sbCAmJiBnbG9iYWwuSVNjcm9sbC51dGlscykge1xyXG4gICAgICAgICAgICBnbG9iYWwuSVNjcm9sbC51dGlscy5jbGljayA9IHBhdGNoX0lTY3JvbGxfdXRpbHNfY2xpY2s7XHJcbiAgICAgICAgICAgIHNfYXBwbGllZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkdWk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55m76YyyXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGFwcGx5UGF0Y2gpO1xyXG59XHJcbiIsImRlY2xhcmUgbW9kdWxlIFwiY2RwLnVpLmpxbVwiIHtcclxuICAgIGNvbnN0IFVJOiB0eXBlb2YgQ0RQLlVJO1xyXG4gICAgZXhwb3J0ID0gVUk7XHJcbn1cclxuIl19