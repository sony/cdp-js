/*!
 * cdp.ui.jqm.js 2.0.0
 *
 * Date: 2017-07-19T11:53:16.085Z
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
            //! 現在 active なダイアログとして登録する
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
                this.$el
                    .on("vclick", ".command-prompt-ok ", function (event) {
                    var text = _this.$el.find("#_ui-prompt").val();
                    _this.$el.trigger(_this._eventOK, text);
                    _this.close();
                    event.preventDefault();
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
            //! jQuery plugin
            $.fn.ripple = function (options) {
                var $el = $(this);
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
                $ui.find(".ui-ripple").ripple();
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
            /**
             * Material Design Spinner 拡張
             *
             * @param {jQuery}              $target   [in] 検索対象の jQuery オブジェクト
             * @param {DomExtensionOptions} [options] [in] オプション
             */
            function applyDomExtension($target, options) {
                if (!_template) {
                    _template = Template.getJST("\n                <script type=\"text/template\">\n                    <span class=\"ui-spinner-base\">\n                        <span class=\"ui-spinner-inner\">\n                            <span class=\"ui-spinner-inner-gap\" {{borderTop}}></span>\n                            <span class=\"ui-spinner-inner-left\">\n                                <span class=\"ui-spinner-inner-half-circle\" {{border}}></span>\n                            </span>\n                            <span class=\"ui-spinner-inner-right\">\n                                <span class=\"ui-spinner-inner-half-circle\" {{border}}></span>\n                            </span>\n                        </span>\n                    </span>\n                </script>\n            ");
                }
                var makeTemplateParam = function (color) {
                    return {
                        borderTop: "style=border-top-color:" + color + ";",
                        border: "style=border-color:" + color + ";",
                    };
                };
                var spinnerify = function (elem) {
                    var $elem = $(elem);
                    var color = $elem.data("spinner-color");
                    var param = null;
                    if (color) {
                        $elem.css({ "background-color": color });
                        param = makeTemplateParam(color);
                    }
                    $elem.append(_template(param));
                    refresh($elem);
                };
                $target.find(".ui-spinner, .ui-icon-loading")
                    .each(function (index, elem) {
                    spinnerify(elem);
                });
                return $target;
            }
            // iOS 10.2+ SVG SMIL アニメーションが 2回目以降動かない問題の対策
            // data:image/svg+xml;<cache bust string>;base,... とすることで data-url にもcache busting が有効になる
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
                        }
                    }
                    if (valid(dataUrl)) {
                        $target.css(PREFIX[i] + "mask-image", dataUrl);
                    }
                }
                return $target;
            }
            //! jQuery plugin
            $.fn.spinner = function (options) {
                if ("string" === typeof options) {
                    return refresh($(this));
                }
                else {
                    return applyDomExtension($(this), options);
                }
            };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVUkvanFtL1RoZW1lLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uTWFuYWdlci50cyIsImNkcDovLy9DRFAvVUkvanFtL1RvYXN0LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nQ29tbW9ucy50cyIsImNkcDovLy9DRFAvVUkvanFtL0Jhc2VIZWFkZXJWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vQmFzZVBhZ2UudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9QYWdlVmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1BhZ2VMaXN0Vmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1BhZ2VFeHBhbmRhYmxlTGlzdFZpZXcudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vUmlwcGxlLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL1NwaW5uZXIudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vRmxvYXRMYWJlbC50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9GbGlwU3dpdGNoLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL1NsaWRlci50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9JU2Nyb2xsLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vSW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0E0T1o7QUE1T0QsV0FBVSxHQUFHO0lBQUMsTUFBRSxDQTRPZjtJQTVPYSxhQUFFO1FBRVosSUFBTyxNQUFNLEdBQVMsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNqQyxJQUFPLFNBQVMsR0FBTSxHQUFHLENBQUMsU0FBUyxDQUFDO1FBRXBDLElBQU0sR0FBRyxHQUFHLGlCQUFpQixDQUFDO1FBNEI5Qiw4R0FBOEc7UUFFOUc7OztXQUdHO1FBQ0g7WUFB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QUM7b0JBQzlCLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQzdCLENBQUM7WUFDTCxDQUFDLENBQUM7WUFFRixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7WUFFdEI7Ozs7O2VBS0c7WUFDSCxvQkFBb0IsR0FBVyxFQUFFLE9BQTZCO2dCQUMxRCxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsSUFBSSxTQUFNLENBQUMsT0FBTyxJQUFJLFNBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztvQkFDdkQsU0FBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLHlCQUF5QixDQUFDO29CQUN2RCxTQUFTLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixDQUFDO2dCQUNELE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDZixDQUFDO1lBRUQsS0FBSztZQUNMLG1CQUFnQixDQUFDLG9CQUFvQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3RELENBQUMsRUFqRGdCLFNBQVMsR0FBVCxZQUFTLEtBQVQsWUFBUyxRQWlEekI7SUFBRCxDQUFDLEVBakRhLEVBQUUsR0FBRixNQUFFLEtBQUYsTUFBRSxRQWlEZjtBQUFELENBQUMsRUFqRFMsR0FBRyxLQUFILEdBQUcsUUFpRFoiLCJzb3VyY2VzQ29udGVudCI6WyJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgQ29uZmlnICAgICAgID0gQ0RQLkNvbmZpZztcclxuICAgIGltcG9ydCBGcmFtZXdvcmsgICAgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5UaGVtZV0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFBsYXRmb3JtVHJhbnNpdGlvblxyXG4gICAgICogQGJyaWVmIOODl+ODqeODg+ODiOODleOCqeODvOODoOOBlOOBqOOBriBUcmFuc2l0aW9uIOOCkuagvOe0jVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBsYXRmb3JtVHJhbnNpdGlvbiB7XHJcbiAgICAgICAgW3BsYXRmb3JtOiBzdHJpbmddOiBzdHJpbmc7ICAgICAvLyBleCkgaW9zOiBcInNsaWRlXCJcclxuICAgICAgICBmYWxsYmFjazogc3RyaW5nOyAgICAgICAgICAgICAgIC8vIGZhbGxiYWNrIHRyYW5zaXRpb24gcHJvcFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBUcmFuc2l0aW9uTWFwXHJcbiAgICAgKiBAYnJpZWYg44OI44Op44Oz44K444K344On44Oz44Oe44OD44OXXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVHJhbnNpdGlvbk1hcCB7XHJcbiAgICAgICAgW3RyYW5zaXRpb25OYW1lOiBzdHJpbmddOiBQbGF0Zm9ybVRyYW5zaXRpb247XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFRoZW1lSW5pdE9wdGlvbnNcclxuICAgICAqIEBicmllZiDjg4jjg6njg7Pjgrjjgrfjg6fjg7Pjg57jg4Pjg5dcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUaGVtZUluaXRPcHRpb25zIHtcclxuICAgICAgICBwbGF0Zm9ybT86IHN0cmluZzsgICAgICAgICAgICAgICAgICAvLyBwbGF0Zm9ybSDjgpLmjIflrpouIGRlZmF1bHQ6XCJhdXRvXCJcclxuICAgICAgICByZXNlcnZlU2Nyb2xsYmFyUmVnaW9uPzogYm9vbGVhbjsgICAvLyBQQyDjg4fjg5Djg4PjgrDnkrDlooPjgafjga/jgrnjgq/jg63jg7zjg6vjg5Djg7zjgpLooajnpLouIGRlZmF1bHQ6IFwidHJ1ZVwiXHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBUaGVtZVxyXG4gICAgICogQGJyaWVmIFVJIFRoZW1lIOioreWumuOCkuihjOOBhuODpuODvOODhuOCo+ODquODhuOCo+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgVGhlbWUge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX3BsYXRmb3Jtczogc3RyaW5nW10gPSBbXCJpb3NcIiwgXCJhbmRyb2lkXCJdO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfcGFnZVRyYW5zaXRpb25NYXA6IFRyYW5zaXRpb25NYXAgPSB7XHJcbiAgICAgICAgICAgIFwicGxhdGZvcm0tZGVmYXVsdFwiOiB7XHJcbiAgICAgICAgICAgICAgICBpb3M6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgICAgIGFuZHJvaWQ6IFwiZmxvYXR1cFwiLFxyXG4gICAgICAgICAgICAgICAgZmFsbGJhY2s6IFwic2xpZGVcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCJwbGF0Zm9ybS1hbHRlcm5hdGl2ZVwiOiB7XHJcbiAgICAgICAgICAgICAgICBpb3M6IFwic2xpZGV1cFwiLFxyXG4gICAgICAgICAgICAgICAgYW5kcm9pZDogXCJmbG9hdHVwXCIsXHJcbiAgICAgICAgICAgICAgICBmYWxsYmFjazogXCJzbGlkZXVwXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX2RpYWxvZ1RyYW5zaXRpb25NYXA6IFRyYW5zaXRpb25NYXAgPSB7XHJcbiAgICAgICAgICAgIFwicGxhdGZvcm0tZGVmYXVsdFwiOiB7XHJcbiAgICAgICAgICAgICAgICBpb3M6IFwicG9wem9vbVwiLFxyXG4gICAgICAgICAgICAgICAgYW5kcm9pZDogXCJjcm9zc3pvb21cIixcclxuICAgICAgICAgICAgICAgIGZhbGxiYWNrOiBcIm5vbmVcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kczpcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlbWUg44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyDjgqrjg5fjgrfjg6fjg7PmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJucyB0cnVlOiDmiJDlip8gLyBmYWxzZTog5aSx5pWXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbml0aWFsaXplKG9wdGlvbnM/OiBUaGVtZUluaXRPcHRpb25zKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3Qgb3B0ID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgICAgIHBsYXRmb3JtOiBcImF1dG9cIixcclxuICAgICAgICAgICAgICAgIHJlc2VydmVTY3JvbGxiYXJSZWdpb246IHRydWUsXHJcbiAgICAgICAgICAgIH0sIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKFwiYXV0b1wiID09PSBvcHQucGxhdGZvcm0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBUaGVtZS5kZXRlY3RVSVBsYXRmb3JtKG9wdC5yZXNlcnZlU2Nyb2xsYmFyUmVnaW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChUaGVtZS5zZXRDdXJyZW50VUlQbGF0Zm9ybShvcHQucGxhdGZvcm0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9wdC5wbGF0Zm9ybTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwic2V0Q3VycmVudFVJUGxhdGZvcm0oKSwgZmFpbGVkLiBwbGF0Zm9ybTogXCIgKyBvcHQucGxhdGZvcm0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnj77lnKjmjIflrprjgZXjgozjgabjgYTjgosgVUkgUGxhdGZvcm0g44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IGV4KSBcImlvc1wiXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRDdXJyZW50VUlQbGF0Zm9ybSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCAkaHRtcyA9ICQoXCJodG1sXCIpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IFRoZW1lLnNfcGxhdGZvcm1zLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCRodG1zLmhhc0NsYXNzKFwidWktcGxhdGZvcm0tXCIgKyBUaGVtZS5zX3BsYXRmb3Jtc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gVGhlbWUuc19wbGF0Zm9ybXNbaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVSSBQbGF0Zm9ybSDjgpLoqK3lrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gdHJ1ZTog5oiQ5YqfIC8gZmFsc2U6IOWkseaVl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2V0Q3VycmVudFVJUGxhdGZvcm0ocGxhdGZvcm06IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBwbGF0Zm9ybSB8fCBUaGVtZS5zX3BsYXRmb3Jtcy5pbmRleE9mKHBsYXRmb3JtKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkaHRtcyA9ICQoXCJodG1sXCIpO1xyXG4gICAgICAgICAgICAgICAgVGhlbWUuc19wbGF0Zm9ybXMuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0bXMucmVtb3ZlQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1cIiArIHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChwbGF0Zm9ybSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRodG1zLmFkZENsYXNzKFwidWktcGxhdGZvcm0tXCIgKyBwbGF0Zm9ybSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog54++5Zyo44GuIFBsYXRmb3JtIOOCkuWIpOWumuOBl+acgOmBqeOBqiBwbGF0Zm9ybSDjgpLoh6rli5XmsbrlrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSByZXNlcnZlU2Nyb2xsYmFyUmVnaW9uIFBDIOODh+ODkOODg+OCsOeSsOWig+OBp+OBr+OCueOCr+ODreODvOODq+ODkOODvOOCkuihqOekui4gZGVmYXVsdDogdHJ1ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIGV4KSBcImlvc1wiXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkZXRlY3RVSVBsYXRmb3JtKHJlc2VydmVTY3JvbGxiYXJSZWdpb246IGJvb2xlYW4gPSB0cnVlKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgbGV0IHBsYXRmb3JtID0gXCJcIjtcclxuICAgICAgICAgICAgLy8gcGxhdGZvcm0g44Gu6Kit5a6aXHJcbiAgICAgICAgICAgIGlmIChGcmFtZXdvcmsuUGxhdGZvcm0uaU9TKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiaHRtbFwiKS5hZGRDbGFzcyhcInVpLXBsYXRmb3JtLWlvc1wiKTtcclxuICAgICAgICAgICAgICAgIHBsYXRmb3JtID0gXCJpb3NcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICQoXCJodG1sXCIpLmFkZENsYXNzKFwidWktcGxhdGZvcm0tYW5kcm9pZFwiKTtcclxuICAgICAgICAgICAgICAgIHBsYXRmb3JtID0gXCJhbmRyb2lkXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gUEMg44OH44OQ44OD44Kw55Kw5aKD44Gn44Gv44K544Kv44Ot44O844Or44OQ44O844KS6KGo56S6XHJcbiAgICAgICAgICAgIGlmIChDb25maWcuREVCVUcgJiYgcmVzZXJ2ZVNjcm9sbGJhclJlZ2lvbiAmJiAhRnJhbWV3b3JrLlBsYXRmb3JtLk1vYmlsZSkge1xyXG4gICAgICAgICAgICAgICAgJChcImJvZHlcIikuY3NzKFwib3ZlcmZsb3cteVwiLCBcInNjcm9sbFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcGxhdGZvcm07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwbGF0Zm9ybSDjgpLphY3liJfjgafnmbvpjLJcclxuICAgICAgICAgKiDkuIrmm7jjgY3jgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nW119IHBsYXRmb3JtcyBbaW5dIE9TIGV4KTogW1wiaW9zXCIsIFwiYW5kcm9pZFwiXVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJVSVBsYXRmb3JtcyhwbGF0Zm9ybXM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChwbGF0Zm9ybXMpIHtcclxuICAgICAgICAgICAgICAgIFRoZW1lLnNfcGxhdGZvcm1zID0gcGxhdGZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwYWdlIHRyYW5zaXRpb24g44KS55m76YyyXHJcbiAgICAgICAgICog5LiK5pu444GN44GV44KM44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1RyYW5zaXRpb25NYXB9IG1hcCBbaW5dIFRyYW5zaXRpb25NYXAg44KS5oyH5a6aXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWdpc3RlclBhZ2VUcmFuc2l0aW9uTWFwKG1hcDogVHJhbnNpdGlvbk1hcCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICBUaGVtZS5zX3BhZ2VUcmFuc2l0aW9uTWFwID0gbWFwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBkaWFsb2cgdHJhbnNpdGlvbiDjgpLnmbvpjLJcclxuICAgICAgICAgKiDkuIrmm7jjgY3jgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7VHJhbnNpdGlvbk1hcH0gbWFwIFtpbl0gVHJhbnNpdGlvbk1hcCDjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyRGlhbG9nVHJhbnNpdGlvbk1hcChtYXA6IFRyYW5zaXRpb25NYXApOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgVGhlbWUuc19kaWFsb2dUcmFuc2l0aW9uTWFwID0gbWFwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwYWdlIHRyYW5zaXRpb24g44KS5Y+W5b6XXHJcbiAgICAgICAgICogVHJhbnNpdGlvbk1hcCDjgavjgqLjgrXjgqTjg7PjgZXjgozjgabjgYTjgovjgoLjga7jgafjgYLjgozjgbDlpInmj5tcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ1tdfSBcInNsaWRlXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHF1ZXJ5UGFnZVRyYW5zaXRpb24ob3JpZ2luYWw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnZlcnQgPSBUaGVtZS5zX3BhZ2VUcmFuc2l0aW9uTWFwW29yaWdpbmFsXTtcclxuICAgICAgICAgICAgaWYgKGNvbnZlcnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjb252ZXJ0W1RoZW1lLmdldEN1cnJlbnRVSVBsYXRmb3JtKCldIHx8IGNvbnZlcnQuZmFsbGJhY2s7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRpYWxvZyB0cmFuc2l0aW9uIOOCkuWPluW+l1xyXG4gICAgICAgICAqIFRyYW5zaXRpb25NYXAg44Gr44Ki44K144Kk44Oz44GV44KM44Gm44GE44KL44KC44Gu44Gn44GC44KM44Gw5aSJ5o+bXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmdbXX0gXCJzbGlkZVwiXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBxdWVyeURpYWxvZ1RyYW5zaXRpb24ob3JpZ2luYWw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnZlcnQgPSBUaGVtZS5zX2RpYWxvZ1RyYW5zaXRpb25NYXBbb3JpZ2luYWxdO1xyXG4gICAgICAgICAgICBpZiAoY29udmVydCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRbVGhlbWUuZ2V0Q3VycmVudFVJUGxhdGZvcm0oKV0gfHwgY29udmVydC5mYWxsYmFjaztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8vIGpxdWV5Lm1vYmlsZS5jaGFuZ2VQYWdlKCkg44GuIEhvb2suXHJcbiAgICBmdW5jdGlvbiBhcHBseUN1c3RvbUNoYW5nZVBhZ2UoKSB7XHJcbiAgICAgICAgY29uc3QganFtQ2hhbmdlUGFnZTogKHRvOiBhbnksIG9wdGlvbnM/OiBDaGFuZ2VQYWdlT3B0aW9ucykgPT4gdm9pZCA9IF8uYmluZCgkLm1vYmlsZS5jaGFuZ2VQYWdlLCAkLm1vYmlsZSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGN1c3RvbUNoYW5nZVBhZ2UodG86IGFueSwgb3B0aW9ucz86IENoYW5nZVBhZ2VPcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChfLmlzU3RyaW5nKHRvKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy50cmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0aW9ucy50cmFuc2l0aW9uID0gVGhlbWUucXVlcnlQYWdlVHJhbnNpdGlvbihvcHRpb25zLnRyYW5zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGpxbUNoYW5nZVBhZ2UodG8sIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJC5tb2JpbGUuY2hhbmdlUGFnZSA9IGN1c3RvbUNoYW5nZVBhZ2U7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZnJhbWV3b3JrIOWIneacn+WMluW+jOOBq+mBqeeUqFxyXG4gICAgRnJhbWV3b3JrLndhaXRGb3JJbml0aWFsaXplKClcclxuICAgICAgICAuZG9uZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGFwcGx5Q3VzdG9tQ2hhbmdlUGFnZSgpO1xyXG4gICAgICAgIH0pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBEb21FeHRlbnNpb25PcHRpb25zXHJcbiAgICAgKiBAYnJlaWYgRG9tRXh0ZW5zaW9uIOOBq+a4oeOBmeOCquODl+OCt+ODp+ODs+OCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERvbUV4dGVuc2lvbk9wdGlvbnMge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IGFueTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB0eXBlIERvbUV4dGVuc2lvblxyXG4gICAgICogQGJyaWVmIERPTSDmi6HlvLXplqLmlbBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IHR5cGUgRG9tRXh0ZW5zaW9uID0gKCR0YXJnZXQ6IEpRdWVyeSwgRG9tRXh0ZW5zaW9uT3B0aW9ucz86IE9iamVjdCkgPT4gSlF1ZXJ5O1xyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgRXh0ZW5zaW9uTWFuYWdlclxyXG4gICAgICogQGJyaWVmIOaLoeW8teapn+iDveOCkueuoeeQhuOBmeOCi+ODpuODvOODhuOCo+ODquODhuOCo+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgRXh0ZW5zaW9uTWFuYWdlciB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfZG9tRXh0ZW5zaW9uczogRG9tRXh0ZW5zaW9uW10gPSBbXTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRE9NIOaLoeW8temWouaVsOOBrueZu+mMslxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtEb21FeHRlbnNpb259IGZ1bmMgW2luXSBET00g5ouh5by16Zai5pWwXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWdpc3RlckRvbUV4dGVuc2lvbihmdW5jOiBEb21FeHRlbnNpb24pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zX2RvbUV4dGVuc2lvbnMucHVzaChmdW5jKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERPTSDmi6HlvLXjgpLpgannlKhcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAkdWkgICAgICAgW2luXSDmi6HlvLXlr77osaHjga4gRE9NXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc19kb21FeHRlbnNpb25zLmZvckVhY2goKGZ1bmM6IERvbUV4dGVuc2lvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgZnVuYygkdWksIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bm8tYml0d2lzZSAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlRvYXN0XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBUb2FzdFxyXG4gICAgICogQGJyaWVmIEFuZHJvaWQgU0RLIOOBriBUb2FzdCDjgq/jg6njgrnjga7jgojjgYbjgavoh6rli5Xmtojmu4XjgZnjgovjg6Hjg4Pjgrvjg7zjgrjlh7rlipvjg6bjg7zjg4bjgqPjg6rjg4bjgqNcclxuICAgICAqICAgICAgICDlhaXjgozlrZDjga7plqLkv4LjgpLlrp/nj77jgZnjgovjgZ/jgoHjgasgbW9kdWxlIOOBp+Wun+ijhVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbW9kdWxlIFRvYXN0IHtcclxuXHJcbiAgICAgICAgLy8g6KGo56S65pmC6ZaT44Gu5a6a576pXHJcbiAgICAgICAgZXhwb3J0IGxldCBMRU5HVEhfU0hPUlQgPSAxNTAwOyAgIC8vITwg55+t44GEOjE1MDAgbXNlY1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTEVOR1RIX0xPTkcgID0gNDAwMDsgICAvLyE8IOmVt+OBhDo0MDAwIG1zZWNcclxuXHJcbiAgICAgICAgLy8hIEBlbnVtIOOCquODleOCu+ODg+ODiOOBruWfuua6llxyXG4gICAgICAgIGV4cG9ydCBlbnVtIE9mZnNldFgge1xyXG4gICAgICAgICAgICBMRUZUICAgID0gMHgwMDAxLFxyXG4gICAgICAgICAgICBSSUdIVCAgID0gMHgwMDAyLFxyXG4gICAgICAgICAgICBDRU5URVIgID0gMHgwMDA0LFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIEBlbnVtIOOCquODleOCu+ODg+ODiOOBruWfuua6llxyXG4gICAgICAgIGV4cG9ydCBlbnVtIE9mZnNldFkge1xyXG4gICAgICAgICAgICBUT1AgICAgID0gMHgwMDEwLFxyXG4gICAgICAgICAgICBCT1RUT00gID0gMHgwMDIwLFxyXG4gICAgICAgICAgICBDRU5URVIgID0gMHgwMDQwLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGludGVyZmFjZSBTdHlsZUJ1aWxkZXJcclxuICAgICAgICAgKiBAYnJpZWYgICAgIOOCueOCv+OCpOODq+WkieabtOaZguOBq+S9v+eUqOOBmeOCi+OCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICAgICAqICAgICAgICAgICAgY3NzIOOBq+OCueOCv+OCpOODq+OCkumAg+OBjOOBmeWgtOWQiOOAgeeLrOiHquOBriBjbGFzcyDjgpLoqK3lrprjgZfjgIFnZXRTdHlsZSDjga8gbnVsbCDjgpLov5TjgZnjgZPjgajjgIJcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgaW50ZXJmYWNlIFN0eWxlQnVpbGRlciB7XHJcbiAgICAgICAgICAgIC8vISBjbGFzcyBhdHRyaWJ1dGUg44Gr6Kit5a6a44GZ44KL5paH5a2X5YiX44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldENsYXNzKCk6IHN0cmluZztcclxuICAgICAgICAgICAgLy8hIHN0eWxlIGF0dHJpYnV0ZSDjgavoqK3lrprjgZnjgosgSlNPTiDjgqrjg5bjgrjjgqfjgq/jg4jjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0U3R5bGUoKTogYW55O1xyXG4gICAgICAgICAgICAvLyEg44Kq44OV44K744OD44OI44Gu5Z+65rqW5L2N572u44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFBvaW50KCk6IG51bWJlcjtcclxuICAgICAgICAgICAgLy8hIFgg5bqn5qiZ44Gu44Kq44OV44K744OD44OI5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFgoKTogbnVtYmVyO1xyXG4gICAgICAgICAgICAvLyEgWSDluqfmqJnjga7jgqrjg5Xjgrvjg4Pjg4jlgKTjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0T2Zmc2V0WSgpOiBudW1iZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAY2xhc3MgU3R5bGVCdWlsZGVyRGVmYXVsdFxyXG4gICAgICAgICAqIEBicmllZiDjgrnjgr/jgqTjg6vlpInmm7TmmYLjgavkvb/nlKjjgZnjgovml6Llrprjga7mp4vpgKDkvZPjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgY2xhc3MgU3R5bGVCdWlsZGVyRGVmYXVsdCBpbXBsZW1lbnRzIFN0eWxlQnVpbGRlciB7XHJcblxyXG4gICAgICAgICAgICAvLyEgY2xhc3MgYXR0cmlidXRlIOOBq+ioreWumuOBmeOCi+aWh+Wtl+WIl+OCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRDbGFzcygpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwidWktbG9hZGVyIHVpLW92ZXJsYXktc2hhZG93IHVpLWNvcm5lci1hbGxcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8hIHN0eWxlIGF0dHJpYnV0ZSDjgavoqK3lrprjgZnjgosgSlNPTiDjgqrjg5bjgrjjgqfjgq/jg4jjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0U3R5bGUoKTogYW55IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0eWxlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIFwicGFkZGluZ1wiOiAgICAgICAgICBcIjdweCAyNXB4IDdweCAyNXB4XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJkaXNwbGF5XCI6ICAgICAgICAgIFwiYmxvY2tcIixcclxuICAgICAgICAgICAgICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogXCIjMWQxZDFkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJib3JkZXItY29sb3JcIjogICAgIFwiIzFiMWIxYlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiY29sb3JcIjogICAgICAgICAgICBcIiNmZmZcIixcclxuICAgICAgICAgICAgICAgICAgICBcInRleHQtc2hhZG93XCI6ICAgICAgXCIwIDFweCAwICMxMTFcIixcclxuICAgICAgICAgICAgICAgICAgICBcImZvbnQtd2VpZ2h0XCI6ICAgICAgXCJib2xkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvcGFjaXR5XCI6ICAgICAgICAgIDAuOCxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3R5bGU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vISDjgqrjg5Xjgrvjg4Pjg4jjga7ln7rmupbkvY3nva7jgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0T2Zmc2V0UG9pbnQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPZmZzZXRYLkNFTlRFUiB8IE9mZnNldFkuQk9UVE9NO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyEgWCDluqfmqJnjga7jgqrjg5Xjgrvjg4Pjg4jlgKTjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0T2Zmc2V0WCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vISBZIOW6p+aomeOBruOCquODleOCu+ODg+ODiOWApOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRZKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTc1O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUb2FzdCDooajnpLpcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBtZXNzYWdlICBbaW5dIOODoeODg+OCu+ODvOOCuFxyXG4gICAgICAgICAqIEBwYXJhbSBkdXJhdGlvbiBbaW5dIOihqOekuuaZgumWk+OCkuioreWumiAobXNlYykgZGVmYXVsdDogTEVOR1RIX1NIT1JUXHJcbiAgICAgICAgICogQHBhcmFtIHN0eWxlICAgIFtpbl0g44K544K/44Kk44Or5aSJ5pu044GZ44KL5aC05ZCI44Gr44Gv5rS+55Sf44Kv44Op44K544Kq44OW44K444Kn44Kv44OI44KS5oyH5a6aXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGZ1bmN0aW9uIHNob3cobWVzc2FnZTogc3RyaW5nLCBkdXJhdGlvbjogbnVtYmVyID0gVG9hc3QuTEVOR1RIX1NIT1JULCBzdHlsZT86IFN0eWxlQnVpbGRlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zdCAkbW9iaWxlID0gJC5tb2JpbGU7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZm8gPSBzdHlsZSB8fCBuZXcgU3R5bGVCdWlsZGVyRGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBzZXRDU1MgPSBpbmZvLmdldFN0eWxlKCkgPyB0cnVlIDogZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvLyDmlLnooYzjgrPjg7zjg4njga8gPGJyLz4g44Gr572u5o+b44GZ44KLXHJcbiAgICAgICAgICAgIGNvbnN0IG1zZyA9IG1lc3NhZ2UucmVwbGFjZSgvXFxuL2csIFwiPGJyLz5cIik7XHJcblxyXG4gICAgICAgICAgICAvLyDjg6Hjg4Pjgrvjg7zjgrggZWxlbWVudCDjga7li5XnmoTnlJ/miJBcclxuICAgICAgICAgICAgY29uc3QgaHRtbCA9IFwiPGRpdj5cIiArIG1zZyArIFwiPC9kaXY+XCI7XHJcbiAgICAgICAgICAgIGNvbnN0IGJveCA9ICQoaHRtbCkuYWRkQ2xhc3MoaW5mby5nZXRDbGFzcygpKTtcclxuICAgICAgICAgICAgaWYgKHNldENTUykge1xyXG4gICAgICAgICAgICAgICAgYm94LmNzcyhpbmZvLmdldFN0eWxlKCkpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDoh6rli5XmlLnooYzjgZXjgozjgabjgoLjgojjgYTjgojjgYbjgavjgIHln7rngrnjgpLoqK3lrprjgZfjgabjgYvjgonov73liqBcclxuICAgICAgICAgICAgYm94LmNzcyh7XHJcbiAgICAgICAgICAgICAgICBcInRvcFwiOiAwLFxyXG4gICAgICAgICAgICAgICAgXCJsZWZ0XCI6IDAsXHJcbiAgICAgICAgICAgIH0pLmFwcGVuZFRvKCRtb2JpbGUucGFnZUNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgICAgICAvLyDphY3nva7kvY3nva7jga7msbrlrppcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0UG9pbnQgPSBpbmZvLmdldE9mZnNldFBvaW50KCk7XHJcbiAgICAgICAgICAgIGNvbnN0ICR3aW5kb3cgPSAkKHdpbmRvdyk7XHJcbiAgICAgICAgICAgIGxldCBwb3NYLCBwb3NZO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYm94X3dpZHRoID0gYm94LndpZHRoKCkgKyBwYXJzZUludChib3guY3NzKFwicGFkZGluZy1sZWZ0XCIpLCAxMCkgKyBwYXJzZUludChib3guY3NzKFwicGFkZGluZy1yaWdodFwiKSwgMTApO1xyXG4gICAgICAgICAgICBjb25zdCBib3hfaGVpZ2h0ID0gYm94LmhlaWdodCgpICsgcGFyc2VJbnQoYm94LmNzcyhcInBhZGRpbmctdG9wXCIpLCAxMCkgKyBwYXJzZUludChib3guY3NzKFwicGFkZGluZy1ib3R0b21cIiksIDEwKTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAob2Zmc2V0UG9pbnQgJiAweDAwMEYpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgT2Zmc2V0WC5MRUZUOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSAwICsgaW5mby5nZXRPZmZzZXRYKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFguUklHSFQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWCA9ICR3aW5kb3cud2lkdGgoKSAtIGJveF93aWR0aCArIGluZm8uZ2V0T2Zmc2V0WCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRYLkNFTlRFUjpcclxuICAgICAgICAgICAgICAgICAgICBwb3NYID0gKCR3aW5kb3cud2lkdGgoKSAvIDIpIC0gKGJveF93aWR0aCAvIDIpICsgaW5mby5nZXRPZmZzZXRYKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcIndhcm4uIHVua25vd24gb2Zmc2V0UG9pbnQ6XCIgKyAob2Zmc2V0UG9pbnQgJiAweDAwMEYpKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3NYID0gKCR3aW5kb3cud2lkdGgoKSAvIDIpIC0gKGJveF93aWR0aCAvIDIpICsgaW5mby5nZXRPZmZzZXRYKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAob2Zmc2V0UG9pbnQgJiAweDAwRjApIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgT2Zmc2V0WS5UT1A6XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWSA9IDAgKyBpbmZvLmdldE9mZnNldFkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgT2Zmc2V0WS5CT1RUT006XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWSA9ICR3aW5kb3cuaGVpZ2h0KCkgLSBib3hfaGVpZ2h0ICsgaW5mby5nZXRPZmZzZXRZKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFkuQ0VOVEVSOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1kgPSAoJHdpbmRvdy5oZWlnaHQoKSAvIDIpIC0gKGJveF9oZWlnaHQgLyAyKSArIGluZm8uZ2V0T2Zmc2V0WSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ3YXJuLiB1bmtub3duIG9mZnNldFBvaW50OlwiICsgKG9mZnNldFBvaW50ICYgMHgwMEYwKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWSA9ICgkd2luZG93LmhlaWdodCgpIC8gMikgLSAoYm94X2hlaWdodCAvIDIpICsgaW5mby5nZXRPZmZzZXRZKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOihqOekulxyXG4gICAgICAgICAgICBib3guY3NzKHtcclxuICAgICAgICAgICAgICAgIFwidG9wXCI6IHBvc1ksXHJcbiAgICAgICAgICAgICAgICBcImxlZnRcIjogcG9zWCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmRlbGF5KGR1cmF0aW9uKVxyXG4gICAgICAgICAgICAuZmFkZU91dCg0MDAsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgUHJvbWlzZSAgICAgID0gQ0RQLlByb21pc2U7XHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrICAgID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuRGlhbG9nXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEgvVyBCYWNrIEtleSBIb29rIOmWouaVsFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdHlwZSBEaWFsb2dCYWNrS2V5SGFuZGxlciA9IChldmVudD86IEpRdWVyeS5FdmVudCkgPT4gdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgRGlhbG9nT3B0aW9uc1xyXG4gICAgICogICAgICAgICAgICDjg4DjgqTjgqLjg63jgrDjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEaWFsb2dPcHRpb25zIGV4dGVuZHMgUG9wdXBPcHRpb25zIHtcclxuICAgICAgICBzcmM/OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAgIC8vITwge1N0cmluZ30gdGVtcGxhdGUg44OV44Kh44Kk44Or44Gu44OR44K5ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXHJcbiAgICAgICAgdGl0bGU/OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IOODgOOCpOOCouODreOCsOOCv+OCpOODiOODqyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXHJcbiAgICAgICAgbWVzc2FnZT86IHN0cmluZzsgICAgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IOODoeOCpOODs+ODoeODg+OCu+ODvOOCuCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgICAgICBpZFBvc2l0aXZlPzogc3RyaW5nOyAgICAgICAgICAgIC8vITwge1N0cmluZ30gUG9zaXRpdmUg44Oc44K/44Oz44GuSUQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJkbGctYnRuLXBvc2l0aXZlXCJcclxuICAgICAgICBpZE5lZ2F0aXZlPzogc3RyaW5nOyAgICAgICAgICAgIC8vITwge1N0cmluZ30gTmFnYXRpdmUg44Oc44K/44Oz44GuSUQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJkbGctYnRuLW5lZ2F0aXZlXCJcclxuICAgICAgICBldmVudD86IHN0cmluZzsgICAgICAgICAgICAgICAgIC8vITwge1N0cmluZ30gRGlhbG9nIOOCr+ODqeOCueOBjOeuoeeQhuOBmeOCi+OCpOODmeODs+ODiCAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcInZjbGlja1wiXHJcbiAgICAgICAgZGVmYXVsdEF1dG9DbG9zZT86IGJvb2xlYW47ICAgICAvLyE8IHtCb29sZWFufSBkYXRhLWF1dG8tY2xvc2Ug44GM5oyH5a6a44GV44KM44Gm44GE44Gq44GE5aC05ZCI44Gu5pei5a6a5YCkICAgICAgICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICBmb3JjZU92ZXJ3cml0ZUFmdGVyQ2xvc2U/OiBib29sZWFuOyAvLyE8IHtCb29sZWFufSBhZnRlcmNsb3NlIOOCquODl+OCt+ODp+ODs+OCkuW8t+WItuS4iuabuOOBjeOBmeOCi+OBn+OCgeOBruioreWumiAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgIGxhYmVsUG9zaXRpdmU/OiBzdHJpbmc7ICAgICAgICAgLy8hPCB7U3RyaW5nfSBQb3NpdGl2ZSDjg5zjgr/jg7Pjg6njg5njg6sgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiT0tcIlxyXG4gICAgICAgIGxhYmVsTmVnYXRpdmU/OiBzdHJpbmc7ICAgICAgICAgLy8hPCB7U3RyaW5nfSBOZWdhdGl2ZSDjg5zjgr/jg7Pjg6njg5njg6sgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiQ2FuY2VsXCJcclxuICAgICAgICBiYWNrS2V5PzogXCJjbG9zZVwiIHwgXCJkZW55XCIgfCBEaWFsb2dCYWNrS2V5SGFuZGxlcjsgIC8vITwgSC9XIGJhY2tLZXkg44Gu5oyv44KL6Iie44GEICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcImNsb3NlXCJcclxuICAgICAgICBzY3JvbGxFdmVudD86IFwiZGVueVwiIHwgXCJhbGxvd1wiIHwgXCJhZGp1c3RcIjsgICAvLyE8IHtTdHJpbmd9IHNjcm9sbOOBruaKkeatouaWueW8jyAgKOKAuyBhZGp1c3Qg44Gv6Kmm6aiT55qEKSAgICAgZGVmYXVsdDogXCJkZW55XCJcclxuICAgICAgICBkb21FeHRlbnNpb25PcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9uczsgICAvLyE8IERPTeaLoeW8teOCquODl+OCt+ODp+ODsy4gbnVsbHx1bmRlZmluZWQg44Gn5ouh5by144GX44Gq44GEICAgICAgZGVmYXVsdDoge31cclxuICAgICAgICBbeDogc3RyaW5nXTogYW55OyAgICAgICAgICAgICAgIC8vITwgYW55IGRpYWxvZyB0ZW1wbGF0ZSBwYXJhbWV0ZXJzLlxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgRGlhbG9nXHJcbiAgICAgKiBAYnJpZWYg5rGO55So44OA44Kk44Ki44Ot44Kw44Kv44Op44K5XHJcbiAgICAgKiAgICAgICAgalFNIOOBriBwb3B1cCB3aWRnZXQg44Gr44KI44Gj44Gm5a6f6KOFXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBEaWFsb2cge1xyXG5cclxuICAgICAgICBwcml2YXRlIF90ZW1wbGF0ZTogVG9vbHMuSlNUID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF9zZXR0aW5nczogRGlhbG9nT3B0aW9ucyA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfJGRpYWxvZzogSlF1ZXJ5ID0gbnVsbDtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19hY3RpdmVEaWFsb2c6IERpYWxvZyA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19vbGRCYWNrS2V5SGFuZGxlcjogKGV2ZW50PzogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX2RlZmF1bHRPcHRpb25zOiBEaWFsb2dPcHRpb25zID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBpZCAgICAgIHtTdHJpbmd9ICAgICAgICBbaW5dIOODgOOCpOOCouODreOCsCBET00gSUQg44KS5oyH5a6aIGV4KSAjZGlhbG9nLWhvZ2VcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7RGlhbG9nT3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBvcHRpb25zPzogRGlhbG9nT3B0aW9ucykge1xyXG4gICAgICAgICAgICAvLyBEaWFsb2cg5YWx6YCa6Kit5a6a44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICAgIERpYWxvZy5pbml0Q29tbW9uQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgIC8vIOioreWumuOCkuabtOaWsFxyXG4gICAgICAgICAgICB0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCBEaWFsb2cuc19kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIC8vIOODgOOCpOOCouODreOCsOODhuODs+ODl+ODrOODvOODiOOCkuS9nOaIkFxyXG4gICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFRvb2xzLlRlbXBsYXRlLmdldEpTVChpZCwgdGhpcy5fc2V0dGluZ3Muc3JjKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6KGo56S6XHJcbiAgICAgICAgICog6KGo56S644KS44GX44Gm5aeL44KB44GmIERPTSDjgYzmnInlirnjgavjgarjgovjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtEaWFsb2dPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODsyAoc3JjIOOBr+eEoeimluOBleOCjOOCiylcclxuICAgICAgICAgKiBAcmV0dXJuIOODgOOCpOOCouODreOCsOOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHNob3cob3B0aW9ucz86IERpYWxvZ09wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICBjb25zdCAkZG9jdW1lbnQgPSAkKGRvY3VtZW50KTtcclxuICAgICAgICAgICAgY29uc3QgJGJvZHkgPSAkKFwiYm9keVwiKTtcclxuICAgICAgICAgICAgY29uc3QgJHBhZ2UgPSAoPGFueT4kYm9keSkucGFnZWNvbnRhaW5lcihcImdldEFjdGl2ZVBhZ2VcIik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvZmNIaWRkZW4gPSB7XHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93XCI6ICAgICBcImhpZGRlblwiLFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvdy14XCI6ICAgXCJoaWRkZW5cIixcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteVwiOiAgIFwiaGlkZGVuXCIsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IG9mY0JvZHkgPSB7IC8vIGJvZHkgb3ZlcmZsb3cgY29udGV4dFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvd1wiOiAgICAgJGJvZHkuY3NzKFwib3ZlcmZsb3dcIiksXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXhcIjogICAkYm9keS5jc3MoXCJvdmVyZmxvdy14XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvdy15XCI6ICAgJGJvZHkuY3NzKFwib3ZlcmZsb3cteVwiKSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50U2Nyb2xsUG9zID0gJGJvZHkuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9mY1BhZ2UgPSB7IC8vIHBhZ2Ugb3ZlcmZsb3cgY29udGV4dFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvd1wiOiAgICAgJHBhZ2UuY3NzKFwib3ZlcmZsb3dcIiksXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXhcIjogICAkcGFnZS5jc3MoXCJvdmVyZmxvdy14XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvdy15XCI6ICAgJHBhZ2UuY3NzKFwib3ZlcmZsb3cteVwiKSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbEV2ZW50ID0gXCJzY3JvbGwgdG91Y2htb3ZlIG1vdXNlbW92ZSBNU1BvaW50ZXJNb3ZlXCI7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzY3JvbGxIYW5kZXIgPSAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKFwiZGVueVwiID09PSB0aGlzLl9zZXR0aW5ncy5zY3JvbGxFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiYWRqdXN0XCIgPT09IHRoaXMuX3NldHRpbmdzLnNjcm9sbEV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGJvZHkuc2Nyb2xsVG9wKHBhcmVudFNjcm9sbFBvcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyBvcHRpb24g44GM5oyH5a6a44GV44KM44Gm44GE44Gf5aC05ZCI5pu05pawXHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQoe30sIHRoaXMuX3NldHRpbmdzLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gYWZ0ZXJjbG9zZSDlh6bnkIbjga8gRGlhbG9nIOOBruegtOajhOWHpueQhuOCkuWun+ijheOBmeOCi+OBn+OCgeWfuuacrOeahOOBq+ioreWumuemgeatoiAo5by35Yi25LiK5pu444GN44Oi44O844OJ44KS6Kit5a6a5L2/55So5Y+vKVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MuYWZ0ZXJjbG9zZSAmJiAhdGhpcy5fc2V0dGluZ3MuZm9yY2VPdmVyd3JpdGVBZnRlckNsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJjYW5ub3QgYWNjZXB0ICdhZnRlcmNsb3NlJyBvcHRpb24uIHBsZWFzZSBpbnN0ZWFkIHVzaW5nICdwb3B1cGFmdGVyY2xvc2UnIGV2ZW50LlwiKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zZXR0aW5ncy5hZnRlcmNsb3NlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyB0aXRsZSDjga7mnInnhKFcclxuICAgICAgICAgICAgKDxhbnk+dGhpcy5fc2V0dGluZ3MpLl90aXRsZVN0YXRlID0gdGhpcy5fc2V0dGluZ3MudGl0bGUgPyBcInVpLWhhcy10aXRsZVwiIDogXCJ1aS1uby10aXRsZVwiO1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgICogdGVtcGxhdGUg44GL44KJIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4jjgpLkvZzmiJDjgZfjgIFcclxuICAgICAgICAgICAgICogPGJvZHk+IOebtOS4i+OBq+i/veWKoC5cclxuICAgICAgICAgICAgICogJHBhZ2Ug44Gn44GvIEJhY2tib25lIGV2ZW50IOOCkuWPl+OBkeOCieOCjOOBquOBhOOBk+OBqOOBq+azqOaEj1xyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgdGhpcy5fJGRpYWxvZyA9ICQodGhpcy5fdGVtcGxhdGUodGhpcy5fc2V0dGluZ3MpKTtcclxuICAgICAgICAgICAgdGhpcy5fJGRpYWxvZy5sb2NhbGl6ZSgpO1xyXG4gICAgICAgICAgICAkYm9keS5hcHBlbmQodGhpcy5fJGRpYWxvZyk7XHJcblxyXG4gICAgICAgICAgICAvLyB0aGVtZSDjgpLop6PmsbpcclxuICAgICAgICAgICAgdGhpcy5yZXNvbHZlVGhlbWUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuXyRkaWFsb2dcclxuICAgICAgICAgICAgICAgIC5vbihcInBvcHVwY3JlYXRlXCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g44K544Kv44Ot44O844Or44KS5oqR5q2iXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKFwiYWxsb3dcIiAhPT0gdGhpcy5fc2V0dGluZ3Muc2Nyb2xsRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9uKHNjcm9sbEV2ZW50LCBzY3JvbGxIYW5kZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkYm9keS5jc3Mob2ZjSGlkZGVuKTtcclxuICAgICAgICAgICAgICAgICAgICAkcGFnZS5jc3Mob2ZjSGlkZGVuKTtcclxuICAgICAgICAgICAgICAgICAgICBEaWFsb2cucmVnaXN0ZXIodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmVuaGFuY2VXaXRoaW4oKTtcclxuXHJcbiAgICAgICAgICAgIC8vIERPTSDmi6HlvLVcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fc2V0dGluZ3MuZG9tRXh0ZW5zaW9uT3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgRXh0ZW5zaW9uTWFuYWdlci5hcHBseURvbUV4dGVuc2lvbih0aGlzLl8kZGlhbG9nLCB0aGlzLl9zZXR0aW5ncy5kb21FeHRlbnNpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5vbkJlZm9yZVNob3coKVxyXG4gICAgICAgICAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOihqOekulxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyRkaWFsb2dcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnBvcHVwKCQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblRvOiBcIndpbmRvd1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWZ0ZXJjbG9zZTogKGV2ZW50OiBKUXVlcnkuRXZlbnQsIHVpOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDjgrnjgq/jg63jg7zjg6vnirbmhYvjgpLmiLvjgZlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcGFnZS5jc3Mob2ZjUGFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGJvZHkuY3NzKG9mY0JvZHkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcImFsbG93XCIgIT09IHRoaXMuX3NldHRpbmdzLnNjcm9sbEV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vZmYoc2Nyb2xsRXZlbnQsIHNjcm9sbEhhbmRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIERpYWxvZy5yZWdpc3RlcihudWxsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl8kZGlhbG9nLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGhpcy5fc2V0dGluZ3MpKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAucG9wdXAoXCJvcGVuXCIpLm9uKHRoaXMuX3NldHRpbmdzLmV2ZW50LCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gXCJkYXRhLWF1dG8tY2xvc2U9J2ZhbHNlJ1wiIOOBjOaMh+WumuOBleOCjOOBpuOBhOOCi+imgee0oOOBryBkaWFsb2cg44KS6ZaJ44GY44Gq44GEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXV0b0Nsb3NlID0gJChldmVudC50YXJnZXQpLmF0dHIoXCJkYXRhLWF1dG8tY2xvc2VcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVsbCA9PSBhdXRvQ2xvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhdXRvQ2xvc2UgPSB0aGlzLl9zZXR0aW5ncy5kZWZhdWx0QXV0b0Nsb3NlID8gXCJ0cnVlXCIgOiBcImZhbHNlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXCJmYWxzZVwiID09PSBhdXRvQ2xvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZhaWwoKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcIkRpYWxvZy5zaG93KCkgZmFpbGVkLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fJGRpYWxvZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl8kZGlhbG9nLnRyaWdnZXIoXCJlcnJvclwiLCBlcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJGRpYWxvZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOe1guS6hlxyXG4gICAgICAgICAqIOWfuuacrOeahOOBq+OBr+iHquWLleOBp+mWieOBmOOCi+OBjOOAgVxyXG4gICAgICAgICAqIOihqOekuuS4reOBruODgOOCpOOCouODreOCsOOCkuOCr+ODqeOCpOOCouODs+ODiOWBtOOBi+OCiemWieOBmOOCi+ODoeOCveODg+ODiVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBjbG9zZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuXyRkaWFsb2cpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cucG9wdXAoXCJjbG9zZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODgOOCpOOCouODreOCsCBlbGVtZW50IOOCkuWPluW+l1xyXG4gICAgICAgIHB1YmxpYyBnZXQgJGVsKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kZGlhbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcm90ZWN0ZWQgbWV0aG9kczogT3ZlcnJpZGVcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44OA44Kk44Ki44Ot44Kw6KGo56S644Gu55u05YmNXHJcbiAgICAgICAgICogRE9NIOOCkuaTjeS9nOOBp+OBjeOCi+OCv+OCpOODn+ODs+OCsOOBp+WRvOOBs+WHuuOBleOCjOOCiy5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0lQcm9taXNlQmFzZX0gcHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcm90ZWN0ZWQgb25CZWZvcmVTaG93KCk6IElQcm9taXNlQmFzZTx2b2lkPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmU8dm9pZD4oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODgOOCpOOCouODreOCsOOBruS9v+eUqOOBmeOCiyBUaGVtZSDjgpLop6PmsbpcclxuICAgICAgICAgKiDkuI3opoHjgarloLTlkIjjga/jgqrjg7zjg5Djg7zjg6njgqTjg4njgZnjgovjgZPjgajjgoLlj6/og71cclxuICAgICAgICAgKi9cclxuICAgICAgICBwcm90ZWN0ZWQgcmVzb2x2ZVRoZW1lKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zdCBxdWVyeVRoZW1lID0gKCk6IHN0cmluZyA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJChcIi51aS1wYWdlLWFjdGl2ZVwiKS5qcW1EYXRhKFwidGhlbWVcIik7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBsZXQgY2FuZGlkYXRlVGhlbWU6IHN0cmluZztcclxuXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fc2V0dGluZ3MudGhlbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRvbVRoZW1lID0gdGhpcy5fJGRpYWxvZy5qcW1EYXRhKFwidGhlbWVcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWRvbVRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MudGhlbWUgPSBjYW5kaWRhdGVUaGVtZSA9IHF1ZXJ5VGhlbWUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9zZXR0aW5ncy5vdmVybGF5VGhlbWUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRvbU92ZXJsYXlUaGVtZSA9IHRoaXMuXyRkaWFsb2cuanFtRGF0YShcIm92ZXJsYXktdGhlbWVcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWRvbU92ZXJsYXlUaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzLm92ZXJsYXlUaGVtZSA9IGNhbmRpZGF0ZVRoZW1lIHx8IHF1ZXJ5VGhlbWUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gdHJhbnNpdGlvbiDjga7mm7TmlrBcclxuICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MudHJhbnNpdGlvbiA9IFRoZW1lLnF1ZXJ5RGlhbG9nVHJhbnNpdGlvbih0aGlzLl9zZXR0aW5ncy50cmFuc2l0aW9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERpYWxvZyDjga7ml6Llrprjgqrjg5fjgrfjg6fjg7PjgpLmm7TmlrBcclxuICAgICAgICAgKiDjgZnjgbrjgabjga4gRGlhbG9nIOOBjOS9v+eUqOOBmeOCi+WFsemAmuioreWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0RpYWxvZ09wdGlvbnN9IFtpbl0g44OA44Kk44Ki44Ot44Kw44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXREZWZhdWx0T3B0aW9ucyhvcHRpb25zOiBEaWFsb2dPcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIERpYWxvZyDlhbHpgJroqK3lrprjga7liJ3mnJ/ljJZcclxuICAgICAgICAgICAgRGlhbG9nLmluaXRDb21tb25Db25kaXRpb24oKTtcclxuICAgICAgICAgICAgJC5leHRlbmQodHJ1ZSwgRGlhbG9nLnNfZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8hIOePvuWcqCBhY3RpdmUg44Gq44OA44Kk44Ki44Ot44Kw44Go44GX44Gm55m76Yyy44GZ44KLXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcmVnaXN0ZXIoZGlhbG9nOiBEaWFsb2cpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gZGlhbG9nICYmIG51bGwgIT0gRGlhbG9nLnNfYWN0aXZlRGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJuZXcgZGlhbG9nIHByb2MgaXMgY2FsbGVkIGluIHRoZSBwYXN0IGRpYWxvZydzIG9uZS4gdXNlIHNldFRpbWVvdXQoKSBmb3IgcG9zdCBwcm9jZXNzLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEaWFsb2cuc19hY3RpdmVEaWFsb2cgPSBkaWFsb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEaWFsb2cg5YWx6YCa6Kit5a6a44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgaW5pdENvbW1vbkNvbmRpdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gRnJhbWV3b3JrIOOBruWIneacn+WMluW+jOOBq+WHpueQhuOBmeOCi+W/heimgeOBjOOBguOCi1xyXG4gICAgICAgICAgICBpZiAoIUZyYW1ld29yay5pc0luaXRpYWxpemVkKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImluaXRDb21tb25Db25kaXRpb24oKSBzaG91bGQgYmUgY2FsbGVkIGFmdGVyIEZyYW1ld29yay5pbml0aWFsaXplZC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChudWxsID09IERpYWxvZy5zX29sZEJhY2tLZXlIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBCYWNrIEJ1dHRvbiBIYW5kbGVyXHJcbiAgICAgICAgICAgICAgICBEaWFsb2cuc19vbGRCYWNrS2V5SGFuZGxlciA9IENEUC5zZXRCYWNrQnV0dG9uSGFuZGxlcihudWxsKTtcclxuICAgICAgICAgICAgICAgIENEUC5zZXRCYWNrQnV0dG9uSGFuZGxlcihEaWFsb2cuY3VzdG9tQmFja0tleUhhbmRsZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIOaXouWumuOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAgICAgICAgRGlhbG9nLnNfZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWRQb3NpdGl2ZTogICAgICAgICAgICAgXCJkbGctYnRuLXBvc2l0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgaWROZWdhdGl2ZTogICAgICAgICAgICAgXCJkbGctYnRuLW5lZ2F0aXZlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6ICAgICAgICAgICAgICAgICAgRnJhbWV3b3JrLmdldERlZmF1bHRDbGlja0V2ZW50KCksXHJcbiAgICAgICAgICAgICAgICAgICAgZGlzbWlzc2libGU6ICAgICAgICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdEF1dG9DbG9zZTogICAgICAgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogICAgICAgICAgICAgXCJwbGF0Zm9ybS1kZWZhdWx0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxQb3NpdGl2ZTogICAgICAgICAgXCJPS1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsTmVnYXRpdmU6ICAgICAgICAgIFwiQ2FuY2VsXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja0tleTogICAgICAgICAgICAgICAgXCJjbG9zZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbEV2ZW50OiAgICAgICAgICAgIFwiZGVueVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM6ICAgIHt9LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSC9XIEJhY2sgQnV0dG9uIEhhbmRsZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBjdXN0b21CYWNrS2V5SGFuZGxlcihldmVudD86IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBEaWFsb2cuc19hY3RpdmVEaWFsb2cpIHtcclxuICAgICAgICAgICAgICAgIGlmIChcImNsb3NlXCIgPT09IERpYWxvZy5zX2FjdGl2ZURpYWxvZy5fc2V0dGluZ3MuYmFja0tleSkge1xyXG4gICAgICAgICAgICAgICAgICAgIERpYWxvZy5zX2FjdGl2ZURpYWxvZy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBEaWFsb2cuc19hY3RpdmVEaWFsb2cuX3NldHRpbmdzLmJhY2tLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAoPERpYWxvZ0JhY2tLZXlIYW5kbGVyPkRpYWxvZy5zX2FjdGl2ZURpYWxvZy5fc2V0dGluZ3MuYmFja0tleSkoZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuOyAvLyBEaWFsb2cg44GMIGFjdGl2ZSDjgarloLTlkIjjgIHluLjjgavml6Llrprjga7jg4/jg7Pjg4njg6njgavjga/muKHjgZXjgarjgYRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEaWFsb2cuc19vbGRCYWNrS2V5SGFuZGxlcihldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkRpYWxvZ0NvbW1vbnNdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWxlcnRcclxuICAgICAqIGFsZXJ0IOODoeODg+OCu+ODvOOCuOihqOekulxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICAgW2luXSDooajnpLrmloflrZfliJdcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uc10gW2luXSDjg4DjgqTjgqLjg63jgrDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEByZXR1cm4ge2pRdWVyeX0g44OA44Kk44Ki44Ot44Kw44GuIERPTSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGFsZXJ0KG1lc3NhZ2U6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ09wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYFxyXG4gICAgICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInVpLW1vZGFsXCIgZGF0YS1yb2xlPVwicG9wdXBcIiBkYXRhLWNvcm5lcnM9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzcz1cInVpLXRpdGxlIHt7X3RpdGxlU3RhdGV9fVwiPnt7dGl0bGV9fTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidWktbWVzc2FnZVwiPnt7bWVzc2FnZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1tb2RhbC1mb290ZXIgdWktZ3JpZC1zb2xvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkUG9zaXRpdmV9fVwiIGNsYXNzPVwidWktYnRuIHVpLWJsb2NrLWEgdWktdGV4dC1lbXBoYXNpc1wiIGRhdGEtYXV0by1jbG9zZT1cInRydWVcIj57e2xhYmVsUG9zaXRpdmV9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjb25zdCBkbGdBbGVydCA9IG5ldyBEaWFsb2codGVtcGxhdGUsICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIHNyYzogbnVsbCxcclxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICB9LCBvcHRpb25zKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkbGdBbGVydC5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25maXJtXHJcbiAgICAgKiDnorroqo3jg6Hjg4Pjgrvjg7zjgrjooajnpLpcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgIFtpbl0g6KGo56S65paH5a2X5YiXXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnNdIFtpbl0g44OA44Kk44Ki44Ot44Kw44Kq44OX44K344On44OzXHJcbiAgICAgKiBAcmV0dXJuIHtqUXVlcnl9IOODgOOCpOOCouODreOCsOOBriBET00g44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjb25maXJtKG1lc3NhZ2U6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ09wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYFxyXG4gICAgICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInVpLW1vZGFsXCIgZGF0YS1yb2xlPVwicG9wdXBcIiBkYXRhLWNvcm5lcnM9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzcz1cInVpLXRpdGxlIHt7X3RpdGxlU3RhdGV9fVwiPnt7dGl0bGV9fTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidWktbWVzc2FnZVwiPnt7bWVzc2FnZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1tb2RhbC1mb290ZXIgdWktZ3JpZC1hXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkTmVnYXRpdmV9fVwiIGNsYXNzPVwidWktYnRuIHVpLWJsb2NrLWFcIiBkYXRhLWF1dG8tY2xvc2U9XCJ0cnVlXCI+e3tsYWJlbE5lZ2F0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInt7aWRQb3NpdGl2ZX19XCIgY2xhc3M9XCJ1aS1idG4gdWktYmxvY2stYiB1aS10ZXh0LWVtcGhhc2lzXCIgZGF0YS1hdXRvLWNsb3NlPVwidHJ1ZVwiPnt7bGFiZWxQb3NpdGl2ZX19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgIDwvc2NyaXB0PlxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgICAgIGNvbnN0IGRsZ0NvbmZpcm0gPSBuZXcgRGlhbG9nKHRlbXBsYXRlLCAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBzcmM6IG51bGwsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgfSwgb3B0aW9ucykpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGxnQ29uZmlybS5zaG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIERpYWxvZ0NvbW1vbnNPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgcHJvbXB0IOOBruOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERpYWxvZ1Byb21wdE9wdGlvbnMgZXh0ZW5kcyBEaWFsb2dPcHRpb25zIHtcclxuICAgICAgICBldmVudE9LPzogc3RyaW5nOyAvLyE8IE9LIOODnOOCv+ODs+aKvOS4i+aZguOBriBldmVudDogZGVmYXVsdDogcHJvbXB0b2tcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBEaWFsb2dQcm9tcHRcclxuICAgICAqIEBicmllZiBwcm9tcHQg44OA44Kk44Ki44Ot44KwICjpnZ7lhazplospXHJcbiAgICAgKi9cclxuICAgIGNsYXNzIERpYWxvZ1Byb21wdCBleHRlbmRzIERpYWxvZyB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2V2ZW50T0s6IHN0cmluZztcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dQcm9tcHRPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGlkLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5fZXZlbnRPSyA9IG9wdGlvbnMuZXZlbnRPSyB8fCBcInByb21wdG9rXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OA44Kk44Ki44Ot44Kw6KGo56S644Gu55u05YmNXHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQmVmb3JlU2hvdygpOiBJUHJvbWlzZUJhc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICB0aGlzLiRlbFxyXG4gICAgICAgICAgICAgICAgLm9uKFwidmNsaWNrXCIsIFwiLmNvbW1hbmQtcHJvbXB0LW9rIFwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRleHQgPSB0aGlzLiRlbC5maW5kKFwiI191aS1wcm9tcHRcIikudmFsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZWwudHJpZ2dlcih0aGlzLl9ldmVudE9LLCB0ZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIub25CZWZvcmVTaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvbXB0XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgICBbaW5dIOihqOekuuaWh+Wtl+WIl1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zXSBbaW5dIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHJldHVybiB7alF1ZXJ5fSDjg4DjgqTjgqLjg63jgrDjga4gRE9NIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gcHJvbXB0KG1lc3NhZ2U6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ1Byb21wdE9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gYFxyXG4gICAgICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cInVpLW1vZGFsXCIgZGF0YS1yb2xlPVwicG9wdXBcIiBkYXRhLWNvcm5lcnM9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMSBjbGFzcz1cInVpLXRpdGxlIHt7X3RpdGxlU3RhdGV9fVwiPnt7dGl0bGV9fTwvaDE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwIGNsYXNzPVwidWktbWVzc2FnZVwiPnt7bWVzc2FnZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiX3VpLXByb21wdFwiIGNsYXNzPVwidWktaGlkZGVuLWFjY2Vzc2libGVcIj48L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBuYW1lPVwiX3VpLXByb21wdFwiIGlkPVwiX3VpLXByb21wdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1aS1tb2RhbC1mb290ZXIgdWktZ3JpZC1hXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkTmVnYXRpdmV9fVwiIGNsYXNzPVwidWktYnRuIHVpLWJsb2NrLWFcIiBkYXRhLWF1dG8tY2xvc2U9XCJ0cnVlXCI+e3tsYWJlbE5lZ2F0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInt7aWRQb3NpdGl2ZX19XCIgY2xhc3M9XCJjb21tYW5kLXByb21wdC1vayB1aS1idG4gdWktYmxvY2stYiB1aS10ZXh0LWVtcGhhc2lzXCIgZGF0YS1hdXRvLWNsb3NlPVwiZmFsc2VcIj57e2xhYmVsUG9zaXRpdmV9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjb25zdCBkbGdQcm9tcHQgPSBuZXcgRGlhbG9nUHJvbXB0KHRlbXBsYXRlLCAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBzcmM6IG51bGwsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgfSwgb3B0aW9ucykpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGxnUHJvbXB0LnNob3coKTtcclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgUm91dGVyICAgICAgID0gQ0RQLkZyYW1ld29yay5Sb3V0ZXI7XHJcbiAgICBpbXBvcnQgSVBhZ2UgICAgICAgID0gQ0RQLkZyYW1ld29yay5JUGFnZTtcclxuICAgIGltcG9ydCBNb2RlbCAgICAgICAgPSBDRFAuRnJhbWV3b3JrLk1vZGVsO1xyXG4gICAgaW1wb3J0IFZpZXcgICAgICAgICA9IENEUC5GcmFtZXdvcmsuVmlldztcclxuICAgIGltcG9ydCBWaWV3T3B0aW9ucyAgPSBDRFAuRnJhbWV3b3JrLlZpZXdPcHRpb25zO1xyXG4gICAgaW1wb3J0IFRlbXBsYXRlICAgICA9IENEUC5Ub29scy5UZW1wbGF0ZTtcclxuICAgIGltcG9ydCBKU1QgICAgICAgICAgPSBDRFAuVG9vbHMuSlNUO1xyXG5cclxuICAgIGNvbnN0IFRBRzogc3RyaW5nID0gXCJbQ0RQLlVJLkJhc2VIZWFkZXJWaWV3XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgQmFzZUhlYWRlclZpZXdPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgQmFzZUhlYWRlclZpZXcg44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgVmlld09wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgYmFzZVRlbXBsYXRlPzogSlNUOyAgICAgICAgICAgICAvLyE8IOWbuuWumuODmOODg+ODgOeUqCBKYXZhU2NyaXB0IOODhuODs+ODl+ODrOODvOODiC5cclxuICAgICAgICBiYWNrQ29tbWFuZFNlbGVjdG9yPzogc3RyaW5nOyAgIC8vITwgXCLmiLvjgotcIuOCs+ODnuODs+ODieOCu+ODrOOCr+OCvy4gZGVmYXVsdDogXCJjb21tYW5kLWJhY2tcIlxyXG4gICAgICAgIGJhY2tDb21tYW5kS2luZD86IHN0cmluZzsgICAgICAgLy8hPCBcIuaIu+OCi1wi44Kz44Oe44Oz44OJ56iu5YilIChvbkNvbW1hbmQg56ysMuW8leaVsCkuIGRlZmF1bHQ6IFwicGFnZWJhY2tcIlxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgQmFzZUhlYWRlclZpZXdcclxuICAgICAqIEBicmllZiDlhbHpgJrjg5jjg4Pjg4DjgpLmk43kvZzjgZnjgovjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEJhc2VIZWFkZXJWaWV3PFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgVmlldzxUTW9kZWw+IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc18kaGVhZGVyQmFzZTogSlF1ZXJ5OyAgIC8vITwg44Oa44O844K45aSW44Gr6YWN572u44GV44KM44KL5YWx6YCa44OY44OD44OA44Gu44OZ44O844K56YOo5ZOB55SoIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX3JlZkNvdW50ID0gMDsgICAgICAgICAgLy8hPCDlj4Lnhafjgqvjgqbjg7Pjg4hcclxuICAgICAgICBwcml2YXRlIF90ZW1wbGF0ZTogSlNUO1xyXG4gICAgICAgIHByaXZhdGUgX2hhc0JhY2tJbmRpY2F0b3I6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0lQYWdlfSBfb3duZXIgW2luXSDjgqrjg7zjg4rjg7zjg5rjg7zjgrjjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9vd25lcjogSVBhZ2UsIHByaXZhdGUgX29wdGlvbnM/OiBCYXNlSGVhZGVyVmlld09wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcihfb3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgIGVsOiBfb3duZXIuJHBhZ2UuZmluZChcIltkYXRhLXJvbGU9J2hlYWRlciddXCIpLFxyXG4gICAgICAgICAgICAgICAgYmFja0NvbW1hbmRTZWxlY3RvcjogXCIuY29tbWFuZC1iYWNrXCIsXHJcbiAgICAgICAgICAgICAgICBiYWNrQ29tbWFuZEtpbmQ6IFwicGFnZWJhY2tcIixcclxuICAgICAgICAgICAgfSwgX29wdGlvbnMpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRlbXBsYXRlIOioreWumlxyXG4gICAgICAgICAgICBpZiAoX29wdGlvbnMuYmFzZVRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IF9vcHRpb25zLmJhc2VUZW1wbGF0ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gVGVtcGxhdGUuZ2V0SlNUKGBcclxuICAgICAgICAgICAgICAgICAgICA8c2NyaXB0IHR5cGU9J3RleHQvdGVtcGxhdGUnPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aGVhZGVyIGNsYXNzPSd1aS1oZWFkZXItYmFzZSB1aS1ib2R5LXt7dGhlbWV9fSc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSd1aS1maXhlZC1iYWNrLWluZGljYXRvcic+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc2NyaXB0PlxyXG4gICAgICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEJhY2tib25lLlZpZXcg55So44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudCh0aGlzLiRlbCwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWIneacn+WMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBjcmVhdGUoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlSGVhZGVyQmFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5pyJ5Yq55YyWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGFjdGl2YXRlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNob3dJbmRpY2F0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeEoeWKueWMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBpbmFjdGl2YXRlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmhpZGVJbmRpY2F0b3IoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOegtOajhFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyByZWxlYXNlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbGVhc2VIZWFkZXJCYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEg5YWx6YCa44OY44OD44OA44Gu44OZ44O844K544KS5rqW5YKZXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVIZWFkZXJCYXNlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIC8vIOWbuuWumuODmOODg+ODgOOBruOBqOOBjeOBq+acieWKueWMllxyXG4gICAgICAgICAgICBpZiAoXCJmaXhlZFwiID09PSB0aGlzLl9vd25lci4kaGVhZGVyLmpxbURhdGEoXCJwb3NpdGlvblwiKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgPT0gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UgPSAkKHRoaXMuX3RlbXBsYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhlbWU6IHRoaXMuX293bmVyLiRwYWdlLmpxbURhdGEoXCJ0aGVtZVwiKSxcclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zX3JlZkNvdW50Kys7XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlLmFwcGVuZFRvKCQoZG9jdW1lbnQuYm9keSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEJhY2sgSW5kaWNhdG9yIOOCkuaMgeOBo+OBpuOBhOOCi+OBi+WIpOWumlxyXG4gICAgICAgICAgICBpZiAoMCA8IHRoaXMuJGVsLmZpbmQoXCIudWktYmFjay1pbmRpY2F0b3JcIikubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oYXNCYWNrSW5kaWNhdG9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBpbmRpY2F0b3Ig44Gu6KGo56S6XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93SW5kaWNhdG9yKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIC8vIEJhY2sgSW5kaWNhdG9yIOOCkuaMgeOBo+OBpuOBhOOBquOBhOWgtOWQiOihqOekuuOBl+OBquOBhFxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlICYmIHRoaXMuX2hhc0JhY2tJbmRpY2F0b3IpIHtcclxuICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UuZmluZChcIi51aS1maXhlZC1iYWNrLWluZGljYXRvclwiKS5hZGRDbGFzcyhcInNob3dcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgaW5kaWNhdG9yIOOBrumdnuihqOekulxyXG4gICAgICAgIHByaXZhdGUgaGlkZUluZGljYXRvcigpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlLmZpbmQoXCIudWktZml4ZWQtYmFjay1pbmRpY2F0b3JcIikucmVtb3ZlQ2xhc3MoXCJzaG93XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWFsemAmuODmOODg+ODgOOBruODmeODvOOCueOCkuegtOajhFxyXG4gICAgICAgIHByaXZhdGUgcmVsZWFzZUhlYWRlckJhc2UoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgLy8g5Zu65a6a44OY44OD44OA5pmC44Gr5Y+C54Wn44Kr44Km44Oz44OI44KS566h55CGXHJcbiAgICAgICAgICAgIGlmIChcImZpeGVkXCIgPT09IHRoaXMuX293bmVyLiRoZWFkZXIuanFtRGF0YShcInBvc2l0aW9uXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc19yZWZDb3VudC0tO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgwID09PSBCYXNlSGVhZGVyVmlldy5zX3JlZkNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IEJhY2tib25lLlZpZXdcclxuXHJcbiAgICAgICAgLy8hIGV2ZW50cyBiaW5kaW5nXHJcbiAgICAgICAgZXZlbnRzKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TWFwID0ge307XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudE1hcFtcInZjbGljayBcIiArIHRoaXMuX29wdGlvbnMuYmFja0NvbW1hbmRTZWxlY3Rvcl0gPSB0aGlzLm9uQ29tbWFuZEJhY2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50TWFwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGJhY2sg44Gu44OP44Oz44OJ44OpXHJcbiAgICAgICAgcHJpdmF0ZSBvbkNvbW1hbmRCYWNrKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgbGV0IGhhbmRsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX293bmVyKSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVkID0gdGhpcy5fb3duZXIub25Db21tYW5kKGV2ZW50LCB0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kS2luZCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFoYW5kbGVkKSB7XHJcbiAgICAgICAgICAgICAgICBSb3V0ZXIuYmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IEZyYW1ld29yayA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgY29uc3QgVEFHOiBzdHJpbmcgPSBcIltDRFAuVUkuQmFzZVBhZ2VdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBCYXNlUGFnZU9wdGlvbnNcclxuICAgICAqIEBicmllZiBCYXNlUGFnZSDjgavmjIflrprjgZnjgovjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCYXNlUGFnZU9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEZyYW1ld29yay5QYWdlQ29uc3RydWN0T3B0aW9ucywgQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIGJhc2VIZWFkZXI/OiBuZXcgKG93bmVyOiBGcmFtZXdvcmsuSVBhZ2UsIG9wdGlvbnM/OiBCYXNlSGVhZGVyVmlld09wdGlvbnM8VE1vZGVsPikgPT4gQmFzZUhlYWRlclZpZXc8VE1vZGVsPjsgICAvLyE8IEhlYWRlciDmqZ/og73jgpLmj5DkvpvjgZnjgovln7rlupXjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICBiYWNrQ29tbWFuZEhhbmRsZXI/OiBzdHJpbmc7ICAgICAgICAgICAgICAgIC8vITwgXCLmiLvjgotcIiDjgrPjg57jg7Pjg4njg4/jg7Pjg4njg6njg6Hjgr3jg4Pjg4nlkI0uICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBvblBhZ2VCYWNrXHJcbiAgICAgICAgZG9tRXh0ZW5zaW9uT3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnM7ICAvLyE8IERPTeaLoeW8teOBq+a4oeOBmeOCquODl+OCt+ODp+ODsy4gbnVsbHx1bmRlZmluZWQg44KS5oyH5a6a44GZ44KL44Go5ouh5by144GX44Gq44GEIGRlZmF1bHQ6IHt9XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBCYXNlUGFnZVxyXG4gICAgICogQGJyaWVmIEhlYWRlciDjgpLlgpnjgYjjgosgUGFnZSDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEJhc2VQYWdlPFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuUGFnZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2Jhc2VIZWFkZXI6IEJhc2VIZWFkZXJWaWV3PFRNb2RlbD47ICAgIC8vITwg44OY44OD44OA44Kv44Op44K5XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgdXJsICAgICAgIFtpbl0g44Oa44O844K4IFVSTFxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSAgICAgICAgICBpZCAgICAgICAgW2luXSDjg5rjg7zjgrggSURcclxuICAgICAgICAgKiBAcGFyYW0ge0Jhc2VQYWdlT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIHByaXZhdGUgX29wdGlvbnM/OiBCYXNlUGFnZU9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcih1cmwsIGlkLCBfb3B0aW9ucyA9ICQuZXh0ZW5kKHtcclxuICAgICAgICAgICAgICAgIGJhc2VIZWFkZXI6IEJhc2VIZWFkZXJWaWV3LFxyXG4gICAgICAgICAgICAgICAgYmFja0NvbW1hbmRIYW5kbGVyOiBcIm9uUGFnZUJhY2tcIixcclxuICAgICAgICAgICAgICAgIGJhY2tDb21tYW5kS2luZDogXCJwYWdlYmFja1wiLFxyXG4gICAgICAgICAgICAgICAgZG9tRXh0ZW5zaW9uT3B0aW9uczoge30sXHJcbiAgICAgICAgICAgIH0sIF9vcHRpb25zKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBGcmFtZXdvcmsgUGFnZVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMuYmFzZUhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlciA9IG5ldyB0aGlzLl9vcHRpb25zLmJhc2VIZWFkZXIodGhpcywgdGhpcy5fb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLmNyZWF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUNyZWF0ZShldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlSW5pdChldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX29wdGlvbnMuZG9tRXh0ZW5zaW9uT3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgRXh0ZW5zaW9uTWFuYWdlci5hcHBseURvbUV4dGVuc2lvbih0aGlzLiRwYWdlLCB0aGlzLl9vcHRpb25zLmRvbUV4dGVuc2lvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUluaXQoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge1Nob3dFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iYXNlSGVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlU2hvdyhldmVudCwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWhpZGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRhICB7SGlkZUV2ZW50RGF0YX0gICAgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlSGlkZShldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLkhpZGVFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Jhc2VIZWFkZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VIZWFkZXIuaW5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZUhpZGUoZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VyZW1vdmVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZVJlbW92ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iYXNlSGVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VIZWFkZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZVJlbW92ZShldmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIL1cgQmFjayBCdXR0b24g44OP44Oz44OJ44OpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0gZXZlbnQgb2JqZWN0XHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5pei5a6a44Gu5Yem55CG44KS6KGM44KP44Gq44GEIC8gZmFsc2U6IOaXouWumuOBruWHpueQhuOCkuihjOOBhlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uSGFyZHdhcmVCYWNrQnV0dG9uKGV2ZW50PzogSlF1ZXJ5LkV2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGxldCByZXR2YWwgPSBzdXBlci5vbkhhcmR3YXJlQmFja0J1dHRvbihldmVudCk7XHJcbiAgICAgICAgICAgIGlmICghcmV0dmFsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR2YWwgPSB0aGlzLm9uQ29tbWFuZChldmVudCwgdGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEtpbmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXR2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBDdXN0b20gRXZlbnRcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXCLmiLvjgotcIiBldmVudCDnmbrooYzmmYLjgavjgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaXouWumuOBruWHpueQhuOCkuihjOOCj+OBquOBhCAvIGZhbHNlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgYZcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkNvbW1hbmQoZXZlbnQ6IEpRdWVyeS5FdmVudCwga2luZDogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kS2luZCA9PT0ga2luZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX293bmVyICYmIHRoaXMuX293bmVyW3RoaXMuX29wdGlvbnMuYmFja0NvbW1hbmRIYW5kbGVyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lclt0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kSGFuZGxlcl0oZXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuICAgIGltcG9ydCBQcm9taXNlICAgICAgPSBDRFAuUHJvbWlzZTtcclxuICAgIGltcG9ydCBGcmFtZXdvcmsgICAgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5QYWdlVmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIFJvdXRlciDjgbjjga7nmbvpjLLmg4XloLHjgaggQmFja2JvbmUuVmlldyDjgbjjga7liJ3mnJ/ljJbmg4XloLHjgpLmoLzntI3jgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEJhc2VQYWdlT3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBiYXNlUGFnZT86IG5ldyAodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBGcmFtZXdvcmsuUGFnZUNvbnN0cnVjdE9wdGlvbnMpID0+IEZyYW1ld29yay5QYWdlOyAgICAvLyE8IFBhZ2Ug5qmf6IO944KS5o+Q5L6b44GZ44KL5Z+65bqV44Kk44Oz44K544K/44Oz44K5XHJcbiAgICB9XHJcblxyXG4gICAgLyogdHNsaW50OmRpc2FibGU6bm8tdXNlLWJlZm9yZS1kZWNsYXJlICovXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUGFnZUNvbnRhaW5lclZpZXdPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgUGFnZUNvbnRhaW5lciDjga7jgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYWdlQ29udGFpbmVyVmlld09wdGlvbnM8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEZyYW1ld29yay5WaWV3T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBvd25lcjogUGFnZVZpZXc7XHJcbiAgICAgICAgJGVsPzogSlF1ZXJ5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VDb250YWluZXJWaWV3XHJcbiAgICAgKiBAYnJpZWYgUGFnZVZpZXcg44Go6YCj5pC65Y+v6IO944GqIOOCs+ODs+ODhuODiuODk+ODpeODvOOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUGFnZUNvbnRhaW5lclZpZXc8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEZyYW1ld29yay5WaWV3PFRNb2RlbD4ge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9vd25lcjogUGFnZVZpZXcgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFBhZ2VDb250YWluZXJWaWV3T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLl9vd25lciA9IG9wdGlvbnMub3duZXI7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLiRlbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVsZWdhdGVzID0gKDxhbnk+dGhpcykuZXZlbnRzID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50KG9wdGlvbnMuJGVsLCBkZWxlZ2F0ZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHNob3J0IGN1dCBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vISBPd25lciDlj5blvpdcclxuICAgICAgICBnZXQgb3duZXIoKTogUGFnZVZpZXcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyogdHNsaW50OmVuYWJsZTpuby11c2UtYmVmb3JlLWRlY2xhcmUgKi9cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VWaWV3XHJcbiAgICAgKiBAYnJpZWYgQ0RQLkZyYW1ld29yay5QYWdlIOOBqCBCYWNrYm9uZS5WaWV3IOOBruS4oeaWueOBruapn+iDveOCkuaPkOS+m+OBmeOCi+ODmuODvOOCuOOBruWfuuW6leOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUGFnZVZpZXc8VE1vZGVsIGV4dGVuZHMgRnJhbWV3b3JrLk1vZGVsID0gRnJhbWV3b3JrLk1vZGVsPiBleHRlbmRzIEZyYW1ld29yay5WaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBGcmFtZXdvcmsuSVBhZ2UsIElTdGF0dXNNYW5hZ2VyIHtcclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIF9wYWdlT3B0aW9uczogUGFnZVZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4gPSBudWxsO1xyXG4gICAgICAgIHByb3RlY3RlZCBfYmFzZVBhZ2U6IEZyYW1ld29yay5QYWdlID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF9zdGF0dXNNZ3I6IFN0YXR1c01hbmFnZXIgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHVybCAgICAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgW2luXSDjg5rjg7zjgrggVVJMXHJcbiAgICAgICAgICogQHBhcmFtIGlkICAgICAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgW2luXSDjg5rjg7zjgrggSURcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7UGFnZVZpZXdDb25zdHJ1Y3RPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogUGFnZVZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAvLyBQYWdlVmlldyDoqK3lrppcclxuICAgICAgICAgICAgdGhpcy5fcGFnZU9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgeyBvd25lcjogdGhpcyB9LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5fYmFzZVBhZ2UgPSB0aGlzLl9wYWdlT3B0aW9ucy5iYXNlUGFnZSA/IG5ldyB0aGlzLl9wYWdlT3B0aW9ucy5iYXNlUGFnZSh1cmwsIGlkLCB0aGlzLl9wYWdlT3B0aW9ucykgOiBuZXcgQmFzZVBhZ2UodXJsLCBpZCwgdGhpcy5fcGFnZU9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gU3RhdHVzTWFuYWdlclxyXG4gICAgICAgICAgICB0aGlzLl9zdGF0dXNNZ3IgPSBuZXcgU3RhdHVzTWFuYWdlcigpO1xyXG4gICAgICAgICAgICAvLyBCYWNrYm9uZS5WaWV3IOeUqOOBruWIneacn+WMllxyXG4gICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZXMgPSAoPGFueT50aGlzKS5ldmVudHMgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudCh0aGlzLiRwYWdlLCBkZWxlZ2F0ZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJU3RhdHVzTWFuYWdlciDnirbmhYvnrqHnkIZcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog54q25oWL5aSJ5pWw44Gu5Y+C54Wn44Kr44Km44Oz44OI44Gu44Kk44Oz44Kv44Oq44Oh44Oz44OIXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdHVzIHtTdHJpbmd9IFtpbl0g54q25oWL6K2Y5Yil5a2QXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdHVzQWRkUmVmKHN0YXR1czogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1c01nci5zdGF0dXNBZGRSZWYoc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruODh+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyB7U3RyaW5nfSBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXR1c1JlbGVhc2Uoc3RhdHVzOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzTWdyLnN0YXR1c1JlbGVhc2Uoc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWHpueQhuOCueOCs+ODvOODl+avjuOBq+eKtuaFi+WkieaVsOOCkuioreWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyAgIHtTdHJpbmd9ICAgW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9ufSBbaW5dIOWHpueQhuOCs+ODvOODq+ODkOODg+OCr1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXR1c1Njb3BlKHN0YXR1czogc3RyaW5nLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF0dXNNZ3Iuc3RhdHVzU2NvcGUoc3RhdHVzLCBjYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmjIflrprjgZfjgZ/nirbmhYvkuK3jgafjgYLjgovjgYvnorroqo1cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMge1N0cmluZ30gICBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOeKtuaFi+WGhSAvIGZhbHNlOiDnirbmhYvlpJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBpc1N0YXR1c0luKHN0YXR1czogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNNZ3IuaXNTdGF0dXNJbihzdGF0dXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJUGFnZSBzdHViIHN0dWZmLlxyXG5cclxuICAgICAgICBnZXQgYWN0aXZlKCk6IGJvb2xlYW4gICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UuYWN0aXZlOyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBnZXQgdXJsKCk6IHN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UudXJsOyAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBnZXQgaWQoKTogc3RyaW5nICAgICAgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UgPyB0aGlzLl9iYXNlUGFnZS5pZCA6IG51bGw7IH1cclxuICAgICAgICBnZXQgJHBhZ2UoKTogSlF1ZXJ5ICAgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UuJHBhZ2U7ICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBnZXQgJGhlYWRlcigpOiBKUXVlcnkgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UuJGhlYWRlcjsgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBnZXQgJGZvb3RlcigpOiBKUXVlcnkgICAgICAgICAgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UuJGZvb3RlcjsgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBnZXQgaW50ZW50KCk6IEZyYW1ld29yay5JbnRlbnQgICAgICAgICAgeyByZXR1cm4gdGhpcy5fYmFzZVBhZ2UuaW50ZW50OyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBzZXQgaW50ZW50KG5ld0ludGVudDogRnJhbWV3b3JrLkludGVudCkgeyB0aGlzLl9iYXNlUGFnZS5pbnRlbnQgPSBuZXdJbnRlbnQ7ICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogT3JpZW50YXRpb24g44Gu5aSJ5pu044KS5Y+X5L+hXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gbmV3T3JpZW50YXRpb24ge09yaWVudGF0aW9ufSBbaW5dIG5ldyBvcmllbnRhdGlvbiBjb2RlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uT3JpZW50YXRpb25DaGFuZ2VkKG5ld09yaWVudGF0aW9uOiBGcmFtZXdvcmsuT3JpZW50YXRpb24pOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEgvVyBCYWNrIEJ1dHRvbiDjg4/jg7Pjg4njg6lcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAgZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSBldmVudCBvYmplY3RcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgo/jgarjgYQgLyBmYWxzZTog5pei5a6a44Gu5Yem55CG44KS6KGM44GGXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25IYXJkd2FyZUJhY2tCdXR0b24oZXZlbnQ/OiBKUXVlcnkuRXZlbnQpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUm91dGVyIFwiYmVmb3JlIHJvdXRlIGNoYW5nZVwiIOODj+ODs+ODieODqVxyXG4gICAgICAgICAqIOODmuODvOOCuOmBt+enu+ebtOWJjeOBq+mdnuWQjOacn+WHpueQhuOCkuihjOOBhuOBk+OBqOOBjOWPr+iDvVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7SVByb21pc2VCYXNlfSBQcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uQmVmb3JlUm91dGVDaGFuZ2UoKTogSVByb21pc2VCYXNlPGFueT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmsY7nlKjjgrPjg57jg7Pjg4njgpLlj5fkv6FcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSAgZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSBldmVudCBvYmplY3RcclxuICAgICAgICAgKiBAcGFyYW0gIGV2ZW50IHtraW5kfSAgICAgICAgICAgICAgW2luXSBjb21tYW5kIGtpbmQgc3RyaW5nXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5pei5a6a44Gu5Yem55CG44KS6KGM44KP44Gq44GEIC8gZmFsc2U6IOaXouWumuOBruWHpueQhuOCkuihjOOBhlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uQ29tbWFuZChldmVudD86IEpRdWVyeS5FdmVudCwga2luZD86IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmnIDliJ3jga4gT25QYWdlSW5pdCgpIOOBruOBqOOBjeOBq+OBruOBv+OCs+ODvOODq+OBleOCjOOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25Jbml0aWFsaXplKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3JlY3JlYXRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQodGhpcy4kcGFnZSwgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNyZWF0ZVwiICjml6c6XCJwYWdlaW5pdFwiKSDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUluaXQoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge1Nob3dFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNvbnRhaW5lcnNob3dcIiAo5penOlwicGFnZXNob3dcIikg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge1Nob3dFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWhpZGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRhICB7SGlkZUV2ZW50RGF0YX0gICAgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlSGlkZShldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLkhpZGVFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyaGlkZVwiICjml6c6XCJwYWdlaGlkZVwiKSDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSBkYXRhICB7SGlkZUV2ZW50RGF0YX0gICAgIFtpbl0g5LuY5Yqg5oOF5aCxXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlSGlkZShldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLkhpZGVFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VSZW1vdmUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVsICA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgTW9kZWwgPSBDRFAuRnJhbWV3b3JrLk1vZGVsO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5QYWdlTGlzdFZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgUGFnZUxpc3RWaWV3IOOBuOOBruWIneacn+WMluaDheWgseOCkuagvOe0jeOBmeOCi+OCpOODs+OCv+ODvOODleOCp+OCpOOCueOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBMaXN0Vmlld09wdGlvbnMsIFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBhdXRvRGVzdG9yeUVsZW1lbnQ/OiBib29sZWFuOyAgICAgICAgLy8hPCDjg5rjg7zjgrjpgbfnp7vliY3jgasgTGlzdCBFbGVtZW50IOOCkuegtOajhOOBmeOCi+WgtOWQiOOBryB0cnVlIOOCkuaMh+WumlxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIOS7ruaDs+ODquOCueODiOODk+ODpeODvOapn+iDveOCkuaMgeOBpCBQYWdlVmlldyDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VMaXN0VmlldzxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFBhZ2VWaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJTGlzdFZpZXcge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9zY3JvbGxNZ3I6IFNjcm9sbE1hbmFnZXIgPSBudWxsOyAgICAvLyE8IHNjcm9sbCDjgrPjgqLjg63jgrjjg4Pjgq9cclxuICAgICAgICBwcml2YXRlIF9uZWVkUmVidWlsZDogYm9vbGVhbiA9IGZhbHNlOyAgICAgICAvLyE8IOODmuODvOOCuOihqOekuuaZguOBqyByZWJ1aWxkKCkg44KS44Kz44O844Or44GZ44KL44Gf44KB44Gu5YaF6YOo5aSJ5pWwXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdXJsICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIHRlbXBsYXRlIOOBq+S9v+eUqOOBmeOCiyBVUkxcclxuICAgICAgICAgKiBAcGFyYW0gaWQgICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIOOBq+aMr+OCieOCjOOBnyBJRFxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogUGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHVybCwgaWQsICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgICAgICBhdXRvRGVzdG9yeUVsZW1lbnQ6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LCBvcHRpb25zKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nciA9IG5ldyBTY3JvbGxNYW5hZ2VyKG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHJlYnVpbGQoKSDjga7jgrnjgrHjgrjjg6Xjg7zjg6rjg7PjgrBcclxuICAgICAgICBwdWJsaWMgcmVzZXJ2ZVJlYnVpbGQoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX25lZWRSZWJ1aWxkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IFBhZ2VWaWV3XHJcblxyXG4gICAgICAgIC8vISBPcmllbnRhdGlvbiDjga7lpInmm7TmpJznn6VcclxuICAgICAgICBvbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbjogRnJhbWV3b3JrLk9yaWVudGF0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zZXRCYXNlSGVpZ2h0KHRoaXMuZ2V0UGFnZUJhc2VIZWlnaHQoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Oa44O844K46YG356e755u05YmN44Kk44OZ44Oz44OI5Yem55CGXHJcbiAgICAgICAgb25CZWZvcmVSb3V0ZUNoYW5nZSgpOiBJUHJvbWlzZUJhc2U8YW55PiB7XHJcbiAgICAgICAgICAgIGlmICgoPFBhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPj50aGlzLl9wYWdlT3B0aW9ucykuYXV0b0Rlc3RvcnlFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5vbkJlZm9yZVJvdXRlQ2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXHJcbiAgICAgICAgb25QYWdlQmVmb3JlU2hvdyhldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLlNob3dFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlU2hvdyhldmVudCwgZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5pbml0aWFsaXplKHRoaXMuJHBhZ2UsIHRoaXMuZ2V0UGFnZUJhc2VIZWlnaHQoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICAgIG9uUGFnZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3Iuc2V0QmFzZUhlaWdodCh0aGlzLmdldFBhZ2VCYXNlSGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbmVlZFJlYnVpbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVidWlsZCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmVlZFJlYnVpbGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIub25QYWdlUmVtb3ZlKGV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9maWxlIOeuoeeQhlxyXG5cclxuICAgICAgICAvLyEg5Yid5pyf5YyW5riI44G/44GL5Yik5a6aXHJcbiAgICAgICAgaXNJbml0aWFsaXplZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5pc0luaXRpYWxpemVkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OX44Ot44OR44OG44Kj44KS5oyH5a6a44GX44Gm44CBTGlzdEl0ZW0g44KS566h55CGXHJcbiAgICAgICAgYWRkSXRlbShcclxuICAgICAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgICAgIGluaXRpYWxpemVyOiBuZXcgKG9wdGlvbnM/OiBhbnkpID0+IEJhc2VMaXN0SXRlbVZpZXcsXHJcbiAgICAgICAgICAgIGluZm86IGFueSxcclxuICAgICAgICAgICAgaW5zZXJ0VG8/OiBudW1iZXJcclxuICAgICAgICAgICAgKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FkZExpbmUobmV3IExpbmVQcm9maWxlKHRoaXMuX3Njcm9sbE1nciwgTWF0aC5mbG9vcihoZWlnaHQpLCBpbml0aWFsaXplciwgaW5mbyksIGluc2VydFRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ8gSXRlbSDjgpLliYrpmaRcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXIsIHNpemU/OiBudW1iZXIsIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXJbXSwgZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xyXG4gICAgICAgIHJlbW92ZUl0ZW0oaW5kZXg6IGFueSwgYXJnMj86IG51bWJlciwgYXJnMz86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVtb3ZlSXRlbShpbmRleCwgYXJnMiwgYXJnMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIEl0ZW0g44Gr6Kit5a6a44GX44Gf5oOF5aCx44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBudW1iZXIpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBKUXVlcnkuRXZlbnQpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmdldEl0ZW1JbmZvKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Ki44Kv44OG44Kj44OW44Oa44O844K444KS5pu05pawXHJcbiAgICAgICAgcmVmcmVzaCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlZnJlc2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmnKrjgqLjgrXjgqTjg7Pjg5rjg7zjgrjjgpLmp4vnr4lcclxuICAgICAgICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci51cGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5rjg7zjgrjjgqLjgrXjgqTjg7PjgpLlho3mp4vmiJBcclxuICAgICAgICByZWJ1aWxkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVidWlsZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeuoei9hOODh+ODvOOCv+OCkuegtOajhFxyXG4gICAgICAgIHJlbGVhc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9maWxlIEJhY2t1cCAvIFJlc3RvcmVcclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODkOODg+OCr+OCouODg+ODl1xyXG4gICAgICAgIGJhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODquOCueODiOOColxyXG4gICAgICAgIHJlc3RvcmUoa2V5OiBzdHJpbmcsIHJlYnVpbGQ6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJldHZhbCA9IHRoaXMuX3Njcm9sbE1nci5yZXN0b3JlKGtleSwgcmVidWlsZCk7XHJcbiAgICAgICAgICAgIGlmIChyZXR2YWwgJiYgIXJlYnVpbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXJ2ZVJlYnVpbGQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0dmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruacieeEoVxyXG4gICAgICAgIGhhc0JhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmhhc0JhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruegtOajhFxyXG4gICAgICAgIGNsZWFyQmFja3VwKGtleT86IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmNsZWFyQmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gr44Ki44Kv44K744K5XHJcbiAgICAgICAgZ2V0IGJhY2t1cERhdGEoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5iYWNrdXBEYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgU2Nyb2xsXHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgc2V0U2Nyb2xsSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldFNjcm9sbEhhbmRsZXIoaGFuZGxlciwgb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+e1guS6huOCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICBzZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldFNjcm9sbFN0b3BIYW5kbGVyKGhhbmRsZXIsIG9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3MoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRTY3JvbGxQb3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jga7mnIDlpKflgKTjgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3NNYXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRTY3JvbGxQb3NNYXgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNjcm9sbFRvKHBvcywgYW5pbWF0ZSwgdGltZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GV44KM44GfIExpc3RJdGVtVmlldyDjga7ooajnpLrjgpLkv53oqLxcclxuICAgICAgICBlbnN1cmVWaXNpYmxlKGluZGV4OiBudW1iZXIsIG9wdGlvbnM/OiBFbnN1cmVWaXNpYmxlT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuZW5zdXJlVmlzaWJsZShpbmRleCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9wZXJ0aWVzXHJcblxyXG4gICAgICAgIC8vISBjb3JlIGZyYW1ld29yayBhY2Nlc3NcclxuICAgICAgICBnZXQgY29yZSgpOiBJTGlzdFZpZXdGcmFtZXdvcmsge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgSW50ZXJuYWwgSS9GXHJcblxyXG4gICAgICAgIC8vISDnmbvpjLIgZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCi1xyXG4gICAgICAgIF9hZGRMaW5lKF9saW5lOiBhbnksIGluc2VydFRvPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5fYWRkTGluZShfbGluZSwgaW5zZXJ0VG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZDpcclxuXHJcbiAgICAgICAgLy8hIOODmuODvOOCuOOBruWfuua6luWApOOCkuWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgZ2V0UGFnZUJhc2VIZWlnaHQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuICQod2luZG93KS5oZWlnaHQoKSAtIHBhcnNlSW50KHRoaXMuJHBhZ2UuY3NzKFwicGFkZGluZy10b3BcIiksIDEwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IE1vZGVsID0gQ0RQLkZyYW1ld29yay5Nb2RlbDtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZUV4cGFuZGFibGVMaXN0Vmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgUGFnZUV4cGFuZGFibGVMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIOmWi+mWieODquOCueODiOODk+ODpeODvOapn+iDveOCkuaMgeOBpCBQYWdlVmlldyDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VFeHBhbmRhYmxlTGlzdFZpZXc8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBQYWdlTGlzdFZpZXc8VE1vZGVsPiBpbXBsZW1lbnRzIElFeHBhbmRhYmxlTGlzdFZpZXcge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9leHBhbmRNYW5hZ2VyOiBFeHBhbmRNYW5hZ2VyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB1cmwgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHBhZ2UgdGVtcGxhdGUg44Gr5L2/55So44GZ44KLIFVSTFxyXG4gICAgICAgICAqIEBwYXJhbSBpZCAgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHBhZ2Ug44Gr5oyv44KJ44KM44GfIElEXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge1BhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIodXJsLCBpZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIgPSBuZXcgRXhwYW5kTWFuYWdlcih0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUV4cGFuZGFibGVMaXN0Vmlld1xyXG5cclxuICAgICAgICAvLyEg5paw6KaPIEdyb3VwUHJvZmlsZSDjgpLkvZzmiJBcclxuICAgICAgICBuZXdHcm91cChpZD86IHN0cmluZyk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLm5ld0dyb3VwKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnmbvpjLLmuIjjgb8gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0R3JvdXAoaWQ6IHN0cmluZyk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmdldEdyb3VwKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrKwx6ZqO5bGk44GuIEdyb3VwIOeZu+mMslxyXG4gICAgICAgIHJlZ2lzdGVyVG9wR3JvdXAodG9wR3JvdXA6IEdyb3VwUHJvZmlsZSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlZ2lzdGVyVG9wR3JvdXAodG9wR3JvdXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOesrDHpmo7lsaTjga4gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0VG9wR3JvdXBzKCk6IEdyb3VwUHJvZmlsZVtdIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuZ2V0VG9wR3JvdXBzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5bGV6ZaLICgx6ZqO5bGkKVxyXG4gICAgICAgIGV4cGFuZEFsbCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5leHBhbmRBbGwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgZnjgbnjgabjga7jgrDjg6vjg7zjg5fjgpLlj47mnZ8gKDHpmo7lsaQpXHJcbiAgICAgICAgY29sbGFwc2VBbGwoZGVsYXk/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5jb2xsYXBzZUFsbChkZWxheSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5bGV6ZaL5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNFeHBhbmRpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmlzRXhwYW5kaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5Y+O5p2f5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNDb2xsYXBzaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5pc0NvbGxhcHNpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDplovplonkuK3jgYvliKTlrppcclxuICAgICAgICBpc1N3aXRjaGluZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuaXNTd2l0Y2hpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBsYXlvdXQga2V5IOOCkuWPluW+l1xyXG4gICAgICAgIGdldCBsYXlvdXRLZXkoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIubGF5b3V0S2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGxheW91dCBrZXkg44KS6Kit5a6aXHJcbiAgICAgICAgc2V0IGxheW91dEtleShrZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLmxheW91dEtleSA9IGtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IFBhZ2VMaXN0Vmlld1xyXG5cclxuICAgICAgICAvLyEg44OH44O844K/44KS56C05qOEXHJcbiAgICAgICAgcmVsZWFzZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlbGVhc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg5Djg4Pjgq/jgqLjg4Pjg5dcclxuICAgICAgICBiYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuYmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44Oq44K544OI44KiXHJcbiAgICAgICAgcmVzdG9yZShrZXk6IHN0cmluZywgcmVidWlsZDogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIucmVzdG9yZShrZXksIHJlYnVpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKipcclxuICogalF1ZXJ5IHBsdWdpbiBkZWZpbml0aW9uXHJcbiAqL1xyXG5pbnRlcmZhY2UgSlF1ZXJ5IHtcclxuICAgIHJpcHBsZShvcHRpb25zPzogQ0RQLlVJLkRvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnk7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICAvLyEgalF1ZXJ5IHBsdWdpblxyXG4gICAgJC5mbi5yaXBwbGUgPSBmdW5jdGlvbiAob3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpIHtcclxuICAgICAgICBjb25zdCAkZWwgPSAkKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiAkZWwub24oRnJhbWV3b3JrLlBhdGNoLnNfdmNsaWNrRXZlbnQsIGZ1bmN0aW9uIChldmVudDogSlF1ZXJ5LkV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1cmZhY2UgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gY3JlYXRlIHN1cmZhY2UgaWYgaXQgZG9lc24ndCBleGlzdFxyXG4gICAgICAgICAgICBpZiAoc3VyZmFjZS5maW5kKFwiLnVpLXJpcHBsZS1pbmtcIikubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBzdXJmYWNlLnByZXBlbmQoXCI8ZGl2IGNsYXNzPSd1aS1yaXBwbGUtaW5rJz48L2Rpdj5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBpbmsgPSBzdXJmYWNlLmZpbmQoXCIudWktcmlwcGxlLWlua1wiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHN0b3AgdGhlIHByZXZpb3VzIGFuaW1hdGlvblxyXG4gICAgICAgICAgICBpbmsucmVtb3ZlQ2xhc3MoXCJ1aS1yaXBwbGUtYW5pbWF0ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGluayBzaXplOlxyXG4gICAgICAgICAgICBpZiAoIWluay5oZWlnaHQoKSAmJiAhaW5rLndpZHRoKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGQgPSBNYXRoLm1heChzdXJmYWNlLm91dGVyV2lkdGgoKSwgc3VyZmFjZS5vdXRlckhlaWdodCgpKTtcclxuICAgICAgICAgICAgICAgIGluay5jc3MoeyBoZWlnaHQ6IGQsIHdpZHRoOiBkIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB4ID0gZXZlbnQucGFnZVggLSBzdXJmYWNlLm9mZnNldCgpLmxlZnQgLSAoaW5rLndpZHRoKCkgLyAyKTtcclxuICAgICAgICAgICAgY29uc3QgeSA9IGV2ZW50LnBhZ2VZIC0gc3VyZmFjZS5vZmZzZXQoKS50b3AgLSAoaW5rLmhlaWdodCgpIC8gMik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByaXBwbGVDb2xvciA9IHN1cmZhY2UuZGF0YShcInJpcHBsZS1jb2xvclwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGFuaW1hdGlvbiBlbmQgaGFuZGxlclxyXG4gICAgICAgICAgICBjb25zdCBBTklNQVRJT05fRU5EX0VWRU5UID0gXCJhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kXCI7XHJcbiAgICAgICAgICAgIGluay5vbihBTklNQVRJT05fRU5EX0VWRU5ULCBmdW5jdGlvbiAoZXY6IEpRdWVyeS5FdmVudCkge1xyXG4gICAgICAgICAgICAgICAgaW5rLm9mZigpO1xyXG4gICAgICAgICAgICAgICAgaW5rLnJlbW92ZUNsYXNzKFwidWktcmlwcGxlLWFuaW1hdGVcIik7XHJcbiAgICAgICAgICAgICAgICBpbmsgPSBudWxsO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gYW5kIGFkZCBjbGFzcyAuYW5pbWF0ZVxyXG4gICAgICAgICAgICBpbmsuY3NzKHtcclxuICAgICAgICAgICAgICAgIHRvcDogeSArIFwicHhcIixcclxuICAgICAgICAgICAgICAgIGxlZnQ6IHggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiByaXBwbGVDb2xvclxyXG4gICAgICAgICAgICB9KS5hZGRDbGFzcyhcInVpLXJpcHBsZS1hbmltYXRlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGVyaWFsIERlc2lnbiBSaXBwbGUg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCBOT19SSVBQTEVfQ0xBU1MgPSBbXHJcbiAgICAgICAgICAgIFwiLnVpLXJpcHBsZS1ub25lXCIsXHJcbiAgICAgICAgICAgIFwiLnVpLWZsaXBzd2l0Y2gtb25cIixcclxuICAgICAgICAgICAgXCIudWktc2xpZGVyLWhhbmRsZVwiLFxyXG4gICAgICAgICAgICBcIi51aS1pbnB1dC1jbGVhclwiLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGxldCBzZWxlY3RvciA9IFwiLnVpLWJ0blwiO1xyXG4gICAgICAgIGlmICgkdWkuaGFzQ2xhc3MoXCJ1aS1wYWdlXCIpKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0gXCIudWktY29udGVudCAudWktYnRuXCI7IC8vIGhlYWRlciDjga/oh6rli5UgcmlwcGxlIOWMluWvvuixoeWkllxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHVpLmZpbmQoc2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKGluZGV4LCBlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGVsZW0uaXMoTk9fUklQUExFX0NMQVNTLmpvaW4oXCIsXCIpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcyhcInVpLXJpcHBsZVwiKTtcclxuXHJcbiAgICAgICAgLy8gcmlwcGxpZnlcclxuICAgICAgICAkdWkuZmluZChcIi51aS1yaXBwbGVcIikucmlwcGxlKCk7XHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIi8qKlxyXG4gKiBqUXVlcnkgcGx1Z2luIGRlZmluaXRpb25cclxuICovXHJcbmludGVyZmFjZSBKUXVlcnkge1xyXG4gICAgc3Bpbm5lcihvcHRpb25zPzogQ0RQLlVJLkRvbUV4dGVuc2lvbk9wdGlvbnMgfCBcInJlZnJlc2hcIik6IEpRdWVyeTtcclxufVxyXG5cclxubmFtZXNwYWNlIENEUC5VSS5FeHRlbnNpb24ge1xyXG5cclxuICAgIGltcG9ydCBUZW1wbGF0ZSA9IENEUC5Ub29scy5UZW1wbGF0ZTtcclxuICAgIGltcG9ydCBKU1QgICAgICA9IENEUC5Ub29scy5KU1Q7XHJcblxyXG4gICAgbGV0IF90ZW1wbGF0ZTogSlNUO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWF0ZXJpYWwgRGVzaWduIFNwaW5uZXIg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdGFyZ2V0ICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHRhcmdldDogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgaWYgKCFfdGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgX3RlbXBsYXRlID0gVGVtcGxhdGUuZ2V0SlNUKGBcclxuICAgICAgICAgICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHQvdGVtcGxhdGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItYmFzZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lci1nYXBcIiB7e2JvcmRlclRvcH19Pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lci1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyLWhhbGYtY2lyY2xlXCIge3tib3JkZXJ9fT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXItcmlnaHRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXItaGFsZi1jaXJjbGVcIiB7e2JvcmRlcn19Pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvc2NyaXB0PlxyXG4gICAgICAgICAgICBgKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1ha2VUZW1wbGF0ZVBhcmFtID0gKGNvbG9yOiBzdHJpbmcpOiBPYmplY3QgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wOiBcInN0eWxlPWJvcmRlci10b3AtY29sb3I6XCIgKyBjb2xvciArIFwiO1wiLFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyOiBcInN0eWxlPWJvcmRlci1jb2xvcjpcIiArIGNvbG9yICsgXCI7XCIsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3Bpbm5lcmlmeSA9IChlbGVtOiBFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtID0gJChlbGVtKTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSAkZWxlbS5kYXRhKFwic3Bpbm5lci1jb2xvclwiKTtcclxuICAgICAgICAgICAgbGV0IHBhcmFtID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKGNvbG9yKSB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbS5jc3MoeyBcImJhY2tncm91bmQtY29sb3JcIjogY29sb3IgfSk7XHJcbiAgICAgICAgICAgICAgICBwYXJhbSA9IG1ha2VUZW1wbGF0ZVBhcmFtKGNvbG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkZWxlbS5hcHBlbmQoX3RlbXBsYXRlKHBhcmFtKSk7XHJcbiAgICAgICAgICAgIHJlZnJlc2goJGVsZW0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICR0YXJnZXQuZmluZChcIi51aS1zcGlubmVyLCAudWktaWNvbi1sb2FkaW5nXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKChpbmRleDogbnVtYmVyLCBlbGVtOiBFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzcGlubmVyaWZ5KGVsZW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuICR0YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaU9TIDEwLjIrIFNWRyBTTUlMIOOCouODi+ODoeODvOOCt+ODp+ODs+OBjCAy5Zue55uu5Lul6ZmN5YuV44GL44Gq44GE5ZWP6aGM44Gu5a++562WXHJcbiAgICAvLyBkYXRhOmltYWdlL3N2Zyt4bWw7PGNhY2hlIGJ1c3Qgc3RyaW5nPjtiYXNlLC4uLiDjgajjgZnjgovjgZPjgajjgacgZGF0YS11cmwg44Gr44KCY2FjaGUgYnVzdGluZyDjgYzmnInlirnjgavjgarjgotcclxuICAgIGZ1bmN0aW9uIHJlZnJlc2goJHRhcmdldDogSlF1ZXJ5KTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCBQUkVGSVggPSBbXCItd2Via2l0LVwiLCBcIlwiXTtcclxuXHJcbiAgICAgICAgY29uc3QgdmFsaWQgPSAocHJvcCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKHByb3AgJiYgXCJub25lXCIgIT09IHByb3ApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGxldCBkYXRhVXJsOiBzdHJpbmc7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBQUkVGSVgubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdmFsaWQoZGF0YVVybCkpIHtcclxuICAgICAgICAgICAgICAgIGRhdGFVcmwgPSAkdGFyZ2V0LmNzcyhQUkVGSVhbaV0gKyBcIm1hc2staW1hZ2VcIik7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsaWQoZGF0YVVybCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBpT1Mg44Gn44GvIHVybChkYXRhKioqKTsg5YaF44GrICdcIicg44Gv5YWl44KJ44Gq44GEXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBkYXRhVXJsLm1hdGNoKC8odXJsXFwoZGF0YTppbWFnZVxcL3N2Z1xcK3htbDspKFtcXHNcXFNdKik/KGJhc2U2NCxbXFxzXFxTXSpcXCkpLyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFVcmwgPSBgJHttYXRjaFsxXX1idXN0PSR7RGF0ZS5ub3coKS50b1N0cmluZygzNil9OyR7bWF0Y2hbM119YDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHZhbGlkKGRhdGFVcmwpKSB7XHJcbiAgICAgICAgICAgICAgICAkdGFyZ2V0LmNzcyhQUkVGSVhbaV0gKyBcIm1hc2staW1hZ2VcIiwgZGF0YVVybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAkdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vISBqUXVlcnkgcGx1Z2luXHJcbiAgICAkLmZuLnNwaW5uZXIgPSBmdW5jdGlvbiAob3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMgfCBcInJlZnJlc2hcIikge1xyXG4gICAgICAgIGlmIChcInN0cmluZ1wiID09PSB0eXBlb2Ygb3B0aW9ucykge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVmcmVzaCgkKHRoaXMpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYXBwbHlEb21FeHRlbnNpb24oJCh0aGlzKSwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRleHQgSW5wdXQg55SoIEZsb2F0aW5nIExhYmVsIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlID0gKGVsZW06IEVsZW1lbnQsIGZsb2F0aW5nOiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtID0gJChlbGVtKTtcclxuICAgICAgICAgICAgaWYgKGZsb2F0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbS5hZGRDbGFzcyhcInVpLWZsb2F0LWxhYmVsLWZsb2F0aW5nXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGVsZW0ucmVtb3ZlQ2xhc3MoXCJ1aS1mbG9hdC1sYWJlbC1mbG9hdGluZ1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IGZsb2F0aW5naWZ5ID0gKGVsZW06IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSAkKGVsZW0pLmF0dHIoXCJmb3JcIik7XHJcbiAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9ICR1aS5maW5kKFwiI1wiICsgaWQpO1xyXG4gICAgICAgICAgICBpZiAoXCJzZWFyY2hcIiA9PT0gJGlucHV0LmpxbURhdGEoXCJ0eXBlXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAkKGVsZW0pLmFkZENsYXNzKFwidWktZmxvYXQtbGFiZWwtaGFzLWljb25cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdXBkYXRlKGVsZW0sICEhJGlucHV0LnZhbCgpKTtcclxuICAgICAgICAgICAgJGlucHV0Lm9uKFwia2V5dXAgY2hhbmdlIGlucHV0IGZvY3VzIGJsdXIgY3V0IHBhc3RlXCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGUoZWxlbSwgISEkKGV2ZW50LnRhcmdldCkudmFsKCkpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkdWkuZmluZChcImxhYmVsLnVpLWZsb2F0LWxhYmVsLCAudWktZmxvYXQtbGFiZWwgbGFiZWxcIilcclxuICAgICAgICAgICAgLmVhY2goKGluZGV4OiBudW1iZXIsIGVsZW06IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGZsb2F0aW5naWZ5KGVsZW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRdWVyeSBNb2JpbGUgRmxpcCBTd2l0Y2gg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICAvKlxyXG4gICAgICAgICAqIGZsaXBzd2l0Y2gg44Gr57SQ44Gl44GPIGxhYmVsIOOBryBPUyDjgavjgojjgaPjgaYgZXZlbnQg55m66KGM5b2i5byP44GM55Ww44Gq44KL44Gf44KB44OV44OD44Kv44GX44Gm54us6Ieq44Kk44OZ44Oz44OI44Gn5a++5b+c44GZ44KLLlxyXG4gICAgICAgICAqIOOBvuOBnyBmbGlwc3dpdGNoIOOBr+WGhemDqOOBpyBjbGljayDjgpLnmbrooYzjgZfjgabjgYTjgovjgYzjgIF2Y2xpY2sg44Gr5aSJ5pu044GZ44KLLlxyXG4gICAgICAgICAqL1xyXG5cclxuICAgICAgICBjb25zdCBfZ2V0QWxsU3dpdGNoZXMgPSAoKTogSlF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuICR1aS5maW5kKFwiLnVpLWZsaXBzd2l0Y2hcIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2dldElucHV0RnJvbVN3aXRjaCA9ICgkc3dpdGNoOiBKUXVlcnkpOiBKUXVlcnkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkaW5wdXQgPSAkc3dpdGNoLmZpbmQoXCJpbnB1dFwiKTtcclxuICAgICAgICAgICAgaWYgKCRpbnB1dC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkaW5wdXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgJHNlbGVjdCA9ICRzd2l0Y2guZmluZChcInNlbGVjdFwiKTtcclxuICAgICAgICAgICAgaWYgKCRzZWxlY3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJHNlbGVjdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfY2hhbmdlID0gKCRpbnB1dDogSlF1ZXJ5LCB0bzogYm9vbGVhbik6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBpZiAoJGlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJJTlBVVFwiID09PSAkaW5wdXRbMF0ubm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaW5wdXQucHJvcChcImNoZWNrZWRcIiwgdG8pLmZsaXBzd2l0Y2goXCJyZWZyZXNoXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcIlNFTEVDVFwiID09PSAkaW5wdXRbMF0ubm9kZU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaW5wdXQudmFsKHRvID8gXCJvblwiIDogXCJvZmZcIikuZmxpcHN3aXRjaChcInJlZnJlc2hcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfZ2V0TGFiZWxzRnJvbVN3aXRjaCA9ICgkc3dpdGNoOiBKUXVlcnkpOiBKUXVlcnkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkaW5wdXQgPSBfZ2V0SW5wdXRGcm9tU3dpdGNoKCRzd2l0Y2gpO1xyXG4gICAgICAgICAgICBpZiAoJGlucHV0KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYWJlbHMgPSAoPGFueT4kaW5wdXRbMF0pLmxhYmVscztcclxuICAgICAgICAgICAgICAgIGlmIChsYWJlbHMpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gJChsYWJlbHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2dldFN3aXRjaEZyb21MYWJlbCA9ICgkbGFiZWw6IEpRdWVyeSk6IEpRdWVyeSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSAkbGFiZWwuYXR0cihcImZvclwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIF9nZXRBbGxTd2l0Y2hlcygpLmZpbmQoXCJbbmFtZT0nXCIgKyBuYW1lICsgXCInXVwiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBfZ2V0QWxsU3dpdGNoZXMoKVxyXG4gICAgICAgICAgICAub24oXCJ2Y2xpY2sgX2NoYW5nZV9mbGlwc3dpY2hcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRzd2l0Y2ggPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJHRhcmdldCA9ICQoZXZlbnQudGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9IF9nZXRJbnB1dEZyb21Td2l0Y2goJHN3aXRjaCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFuZ2VUbyA9ICEkc3dpdGNoLmhhc0NsYXNzKFwidWktZmxpcHN3aXRjaC1hY3RpdmVcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCR0YXJnZXQuaGFzQ2xhc3MoXCJ1aS1mbGlwc3dpdGNoLWlucHV0XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2NoYW5nZSgkaW5wdXQsIGNoYW5nZVRvKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJHRhcmdldC5oYXNDbGFzcyhcInVpLWZsaXBzd2l0Y2gtb25cIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoRnJhbWV3b3JrLlBsYXRmb3JtLk1vYmlsZSAmJiBGcmFtZXdvcmsuUGF0Y2guaXNTdXBwb3J0ZWRWY2xpY2soKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfY2hhbmdlKCRpbnB1dCwgY2hhbmdlVG8pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLmVhY2goKGluZGV4OiBudW1iZXIsIGZsaXBzd2l0Y2g6IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIF9nZXRMYWJlbHNGcm9tU3dpdGNoKCQoZmxpcHN3aXRjaCkpXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uKFwidmNsaWNrXCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0ICRzd2l0Y2ggPSBfZ2V0U3dpdGNoRnJvbUxhYmVsKCQoZXZlbnQudGFyZ2V0KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghJHN3aXRjaC5wYXJlbnQoKS5oYXNDbGFzcyhcInVpLXN0YXRlLWRpc2FibGVkXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3dpdGNoLnRyaWdnZXIoXCJfY2hhbmdlX2ZsaXBzd2ljaFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIGpRdWVyeSBNb2JpbGUgU2xpZGVyIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgJHVpLmZpbmQoXCIudWktc2xpZGVyLWlucHV0XCIpXHJcbiAgICAgICAgICAgIC5vbihcInNsaWRlc3RvcFwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGhhbmRsZXMgPSAkKGV2ZW50LmN1cnJlbnRUYXJnZXQpXHJcbiAgICAgICAgICAgICAgICAgICAgLnBhcmVudCgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmZpbmQoXCIudWktc2xpZGVyLWhhbmRsZVwiKTtcclxuICAgICAgICAgICAgICAgICRoYW5kbGVzLmJsdXIoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICAvLyEgaVNjcm9sbC5jbGljayBwYXRjaFxyXG4gICAgY29uc3QgcGF0Y2hfSVNjcm9sbF91dGlsc19jbGljayA9IGZ1bmN0aW9uIChldmVudDogRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB0YXJnZXQ6IGFueSA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICBjb25zdCBlOiBhbnkgPSBldmVudDtcclxuICAgICAgICBsZXQgZXY6IE1vdXNlRXZlbnQ7XHJcblxyXG4gICAgICAgIC8vIFtDRFAgbW9kaWZpZWRdOiBzZXQgdGFyZ2V0LmNsaWVudFguXHJcbiAgICAgICAgaWYgKG51bGwgPT0gdGFyZ2V0LmNsaWVudFggfHwgbnVsbCA9PSB0YXJnZXQuY2xpZW50WSkge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBlLnBhZ2VYICYmIG51bGwgIT0gZS5wYWdlWSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsaWVudFggPSBlLnBhZ2VYO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsaWVudFkgPSBlLnBhZ2VZO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGUuY2hhbmdlZFRvdWNoZXMgJiYgZS5jaGFuZ2VkVG91Y2hlc1swXSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsaWVudFggPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VYO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmNsaWVudFkgPSBlLmNoYW5nZWRUb3VjaGVzWzBdLnBhZ2VZO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoISgvKFNFTEVDVHxJTlBVVHxURVhUQVJFQSkvaSkudGVzdCh0YXJnZXQudGFnTmFtZSkpIHtcclxuICAgICAgICAgICAgZXYgPSBkb2N1bWVudC5jcmVhdGVFdmVudChcIk1vdXNlRXZlbnRzXCIpO1xyXG4gICAgICAgICAgICBldi5pbml0TW91c2VFdmVudChcImNsaWNrXCIsIHRydWUsIHRydWUsIGUudmlldywgMSxcclxuICAgICAgICAgICAgICAgIHRhcmdldC5zY3JlZW5YLCB0YXJnZXQuc2NyZWVuWSwgdGFyZ2V0LmNsaWVudFgsIHRhcmdldC5jbGllbnRZLFxyXG4gICAgICAgICAgICAgICAgZS5jdHJsS2V5LCBlLmFsdEtleSwgZS5zaGlmdEtleSwgZS5tZXRhS2V5LFxyXG4gICAgICAgICAgICAgICAgMCwgbnVsbCk7XHJcblxyXG4gICAgICAgICAgICAoPGFueT5ldikuX2NvbnN0cnVjdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGFyZ2V0LmRpc3BhdGNoRXZlbnQoZXYpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgbGV0IHNfYXBwbGllZCA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogaVNjcm9sbCBQYXRjaCDmi6HlvLVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICAgICAgICR1aSAgICAgICBbaW5dIOaknOe0ouWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbk9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcHBseVBhdGNoKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgaWYgKCFzX2FwcGxpZWQgJiYgZ2xvYmFsLklTY3JvbGwgJiYgZ2xvYmFsLklTY3JvbGwudXRpbHMpIHtcclxuICAgICAgICAgICAgZ2xvYmFsLklTY3JvbGwudXRpbHMuY2xpY2sgPSBwYXRjaF9JU2Nyb2xsX3V0aWxzX2NsaWNrO1xyXG4gICAgICAgICAgICBzX2FwcGxpZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gJHVpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeZu+mMslxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3RlckRvbUV4dGVuc2lvbihhcHBseVBhdGNoKTtcclxufVxyXG4iLCJkZWNsYXJlIG1vZHVsZSBcImNkcC51aS5qcW1cIiB7XHJcbiAgICBjb25zdCBVSTogdHlwZW9mIENEUC5VSTtcclxuICAgIGV4cG9ydCA9IFVJO1xyXG59XHJcbiJdfQ==