/*!
 * cdp.ui.jqm.js 2.0.0
 *
 * Date: 2017-07-13T06:17:48.026Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(["cdp.framework.jqm", "cdp.tools", "cdp.ui.listview"], function () { return factory(root.CDP || (root.CDP = {})); }); } else { factory(root.CDP || (root.CDP = {})); } }(this, function (CDP) { CDP.UI = CDP.UI || {};
var CDP;
(function (CDP) {
    var UI;
    (function (UI) {
        var Config = CDP.Config;
        var Framework = CDP.Framework;
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
             * 現在指定されている UI Platform を取得
             *
             * @return {String} ex) "ios"
             */
            Theme.getCurrentUIPlatform = function () {
                var $htms = $("html");
                for (var i = 0, n = this.s_platforms.length; i < n; i++) {
                    if ($htms.hasClass("ui-platform-" + this.s_platforms[i])) {
                        return this.s_platforms[i];
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
                if (null == platform || this.s_platforms.indexOf(platform) >= 0) {
                    var $htms_1 = $("html");
                    this.s_platforms.forEach(function (target) {
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
             * @return {String} ex) "ios"
             */
            Theme.detectUIPlatform = function () {
                // platform の設定
                if (Framework.Platform.iOS) {
                    $("html").addClass("ui-platform-ios");
                }
                else {
                    $("html").addClass("ui-platform-android");
                }
                // PC デバッグ環境ではスクロールバーを表示
                if (Config.DEBUG && !Framework.Platform.Mobile) {
                    $("body").css("overflow-y", "scroll");
                }
            };
            /**
             * platform を配列で設定
             * 上書きされる
             *
             * @param {String[]} platforms [in] OS ex): ["ios", "android"]
             */
            Theme.setUIPlatforms = function (platforms) {
                if (platforms) {
                    this.s_platforms = platforms;
                }
            };
            /**
             * page transition を設定
             * 上書きされる
             *
             * @param {TransitionMap} map [in] TransitionMap を指定
             */
            Theme.setPageTransitionMap = function (map) {
                if (map) {
                    this.s_pageTransitionMap = map;
                }
            };
            /**
             * dialog transition を設定
             * 上書きされる
             *
             * @param {TransitionMap} map [in] TransitionMap を指定
             */
            Theme.setDialogTransitionMap = function (map) {
                if (map) {
                    this.s_dialogTransitionMap = map;
                }
            };
            /**
             * page transition を取得
             * TransitionMap にアサインされているものであれば変換
             *
             * @return {String[]} "slide"
             */
            Theme.queryPageTransition = function (original) {
                var convert = this.s_pageTransitionMap[original];
                if (convert) {
                    return convert[this.getCurrentUIPlatform()] || convert.fallback;
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
                var convert = this.s_dialogTransitionMap[original];
                if (convert) {
                    return convert[this.getCurrentUIPlatform()] || convert.fallback;
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
                };
                $target.find(".ui-spinner, .ui-icon-loading")
                    .each(function (index, elem) {
                    spinnerify(elem);
                });
                return $target;
            }
            //! jQuery plugin
            $.fn.spinner = function (options) {
                return applyDomExtension($(this), options);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVUkvanFtL1RoZW1lLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uTWFuYWdlci50cyIsImNkcDovLy9DRFAvVUkvanFtL1RvYXN0LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nQ29tbW9ucy50cyIsImNkcDovLy9DRFAvVUkvanFtL0Jhc2VIZWFkZXJWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vQmFzZVBhZ2UudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9QYWdlVmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1BhZ2VMaXN0Vmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1BhZ2VFeHBhbmRhYmxlTGlzdFZpZXcudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vUmlwcGxlLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL1NwaW5uZXIudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vRmxvYXRMYWJlbC50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9GbGlwU3dpdGNoLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL1NsaWRlci50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9JU2Nyb2xsLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vSW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0FxTVo7QUFyTUQsV0FBVSxHQUFHO0lBQUMsTUFBRSxDQXFNZjtJQXJNYSxhQUFFO1FBRVosSUFBTyxNQUFNLEdBQVMsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNqQyxJQUFPLFNBQVMsR0FBTSxHQUFHLENBQUMsU0FBUyxDQUFDO1FBbUJwQyw4R0FBOEc7UUFFOUc7OztXQUdHO1FBQ0g7WUFBQTtZQWdKQSxDQUFDO1lBekhHLHVFQUF1RTtZQUN2RSx5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LEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxJQUFJLFNBQU0sQ0FBQyxPQUFPLElBQUksU0FBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO29CQUN2RCxTQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcseUJBQXlCLENBQUM7b0JBQ3ZELFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUM7WUFFRCxLQUFLO1lBQ0wsbUJBQWdCLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEQsQ0FBQyxFQWpEZ0IsU0FBUyxHQUFULFlBQVMsS0FBVCxZQUFTLFFBaUR6QjtJQUFELENBQUMsRUFqRGEsRUFBRSxHQUFGLE1BQUUsS0FBRixNQUFFLFFBaURmO0FBQUQsQ0FBQyxFQWpEUyxHQUFHLEtBQUgsR0FBRyxRQWlEWiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBDb25maWcgICAgICAgPSBDRFAuQ29uZmlnO1xyXG4gICAgaW1wb3J0IEZyYW1ld29yayAgICA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFBsYXRmb3JtVHJhbnNpdGlvblxyXG4gICAgICogQGJyaWVmIOODl+ODqeODg+ODiOODleOCqeODvOODoOOBlOOBqOOBriBUcmFuc2l0aW9uIOOCkuagvOe0jVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBsYXRmb3JtVHJhbnNpdGlvbiB7XHJcbiAgICAgICAgW3BsYXRmb3JtOiBzdHJpbmddOiBzdHJpbmc7ICAgICAvLyE8IGV4KSBpb3M6IFwic2xpZGVcIlxyXG4gICAgICAgIGZhbGxiYWNrOiBzdHJpbmc7ICAgICAgICAgICAgICAgLy8hPCBmYWxsYmFjayB0cmFuc2l0aW9uIHByb3BcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgVHJhbnNpdGlvbk1hcFxyXG4gICAgICogQGJyaWVmIOODiOODqeODs+OCuOOCt+ODp+ODs+ODnuODg+ODl1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFRyYW5zaXRpb25NYXAge1xyXG4gICAgICAgIFt0cmFuc2l0aW9uTmFtZTogc3RyaW5nXTogUGxhdGZvcm1UcmFuc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgVGhlbWVcclxuICAgICAqIEBicmllZiBVSSBUaGVtZSDoqK3lrprjgpLooYzjgYbjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFRoZW1lIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19wbGF0Zm9ybXM6IHN0cmluZ1tdID0gW1wiaW9zXCIsIFwiYW5kcm9pZFwiXTtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX3BhZ2VUcmFuc2l0aW9uTWFwOiBUcmFuc2l0aW9uTWFwID0ge1xyXG4gICAgICAgICAgICBcInBsYXRmb3JtLWRlZmF1bHRcIjoge1xyXG4gICAgICAgICAgICAgICAgaW9zOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgICAgICBhbmRyb2lkOiBcImZsb2F0dXBcIixcclxuICAgICAgICAgICAgICAgIGZhbGxiYWNrOiBcInNsaWRlXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwicGxhdGZvcm0tYWx0ZXJuYXRpdmVcIjoge1xyXG4gICAgICAgICAgICAgICAgaW9zOiBcInNsaWRldXBcIixcclxuICAgICAgICAgICAgICAgIGFuZHJvaWQ6IFwiZmxvYXR1cFwiLFxyXG4gICAgICAgICAgICAgICAgZmFsbGJhY2s6IFwic2xpZGV1cFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19kaWFsb2dUcmFuc2l0aW9uTWFwOiBUcmFuc2l0aW9uTWFwID0ge1xyXG4gICAgICAgICAgICBcInBsYXRmb3JtLWRlZmF1bHRcIjoge1xyXG4gICAgICAgICAgICAgICAgaW9zOiBcInBvcHpvb21cIixcclxuICAgICAgICAgICAgICAgIGFuZHJvaWQ6IFwiY3Jvc3N6b29tXCIsXHJcbiAgICAgICAgICAgICAgICBmYWxsYmFjazogXCJub25lXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOePvuWcqOaMh+WumuOBleOCjOOBpuOBhOOCiyBVSSBQbGF0Zm9ybSDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gZXgpIFwiaW9zXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldEN1cnJlbnRVSVBsYXRmb3JtKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRodG1zID0gJChcImh0bWxcIik7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gdGhpcy5zX3BsYXRmb3Jtcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICgkaHRtcy5oYXNDbGFzcyhcInVpLXBsYXRmb3JtLVwiICsgdGhpcy5zX3BsYXRmb3Jtc1tpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zX3BsYXRmb3Jtc1tpXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVJIFBsYXRmb3JtIOOCkuioreWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSB0cnVlOiDmiJDlip8gLyBmYWxzZTog5aSx5pWXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXRDdXJyZW50VUlQbGF0Zm9ybShwbGF0Zm9ybTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHBsYXRmb3JtIHx8IHRoaXMuc19wbGF0Zm9ybXMuaW5kZXhPZihwbGF0Zm9ybSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGh0bXMgPSAkKFwiaHRtbFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc19wbGF0Zm9ybXMuZm9yRWFjaCgodGFyZ2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGh0bXMucmVtb3ZlQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1cIiArIHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChwbGF0Zm9ybSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRodG1zLmFkZENsYXNzKFwidWktcGxhdGZvcm0tXCIgKyBwbGF0Zm9ybSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog54++5Zyo44GuIFBsYXRmb3JtIOOCkuWIpOWumuOBl+acgOmBqeOBqiBwbGF0Zm9ybSDjgpLoh6rli5XmsbrlrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gZXgpIFwiaW9zXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRldGVjdFVJUGxhdGZvcm0oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIHBsYXRmb3JtIOOBruioreWumlxyXG4gICAgICAgICAgICBpZiAoRnJhbWV3b3JrLlBsYXRmb3JtLmlPUykge1xyXG4gICAgICAgICAgICAgICAgJChcImh0bWxcIikuYWRkQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1pb3NcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiaHRtbFwiKS5hZGRDbGFzcyhcInVpLXBsYXRmb3JtLWFuZHJvaWRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gUEMg44OH44OQ44OD44Kw55Kw5aKD44Gn44Gv44K544Kv44Ot44O844Or44OQ44O844KS6KGo56S6XHJcbiAgICAgICAgICAgIGlmIChDb25maWcuREVCVUcgJiYgIUZyYW1ld29yay5QbGF0Zm9ybS5Nb2JpbGUpIHtcclxuICAgICAgICAgICAgICAgICQoXCJib2R5XCIpLmNzcyhcIm92ZXJmbG93LXlcIiwgXCJzY3JvbGxcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBsYXRmb3JtIOOCkumFjeWIl+OBp+ioreWumlxyXG4gICAgICAgICAqIOS4iuabuOOBjeOBleOCjOOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmdbXX0gcGxhdGZvcm1zIFtpbl0gT1MgZXgpOiBbXCJpb3NcIiwgXCJhbmRyb2lkXCJdXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXRVSVBsYXRmb3JtcyhwbGF0Zm9ybXM6IHN0cmluZ1tdKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChwbGF0Zm9ybXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc19wbGF0Zm9ybXMgPSBwbGF0Zm9ybXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBhZ2UgdHJhbnNpdGlvbiDjgpLoqK3lrppcclxuICAgICAgICAgKiDkuIrmm7jjgY3jgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7VHJhbnNpdGlvbk1hcH0gbWFwIFtpbl0gVHJhbnNpdGlvbk1hcCDjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNldFBhZ2VUcmFuc2l0aW9uTWFwKG1hcDogVHJhbnNpdGlvbk1hcCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobWFwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNfcGFnZVRyYW5zaXRpb25NYXAgPSBtYXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRpYWxvZyB0cmFuc2l0aW9uIOOCkuioreWumlxyXG4gICAgICAgICAqIOS4iuabuOOBjeOBleOCjOOCi1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtUcmFuc2l0aW9uTWFwfSBtYXAgW2luXSBUcmFuc2l0aW9uTWFwIOOCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2V0RGlhbG9nVHJhbnNpdGlvbk1hcChtYXA6IFRyYW5zaXRpb25NYXApOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zX2RpYWxvZ1RyYW5zaXRpb25NYXAgPSBtYXA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBhZ2UgdHJhbnNpdGlvbiDjgpLlj5blvpdcclxuICAgICAgICAgKiBUcmFuc2l0aW9uTWFwIOOBq+OCouOCteOCpOODs+OBleOCjOOBpuOBhOOCi+OCguOBruOBp+OBguOCjOOBsOWkieaPm1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nW119IFwic2xpZGVcIlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcXVlcnlQYWdlVHJhbnNpdGlvbihvcmlnaW5hbDogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgY29uc3QgY29udmVydCA9IHRoaXMuc19wYWdlVHJhbnNpdGlvbk1hcFtvcmlnaW5hbF07XHJcbiAgICAgICAgICAgIGlmIChjb252ZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udmVydFt0aGlzLmdldEN1cnJlbnRVSVBsYXRmb3JtKCldIHx8IGNvbnZlcnQuZmFsbGJhY2s7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGRpYWxvZyB0cmFuc2l0aW9uIOOCkuWPluW+l1xyXG4gICAgICAgICAqIFRyYW5zaXRpb25NYXAg44Gr44Ki44K144Kk44Oz44GV44KM44Gm44GE44KL44KC44Gu44Gn44GC44KM44Gw5aSJ5o+bXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmdbXX0gXCJzbGlkZVwiXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBxdWVyeURpYWxvZ1RyYW5zaXRpb24ob3JpZ2luYWw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnZlcnQgPSB0aGlzLnNfZGlhbG9nVHJhbnNpdGlvbk1hcFtvcmlnaW5hbF07XHJcbiAgICAgICAgICAgIGlmIChjb252ZXJ0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY29udmVydFt0aGlzLmdldEN1cnJlbnRVSVBsYXRmb3JtKCldIHx8IGNvbnZlcnQuZmFsbGJhY2s7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvLyBqcXVleS5tb2JpbGUuY2hhbmdlUGFnZSgpIOOBriBIb29rLlxyXG4gICAgZnVuY3Rpb24gYXBwbHlDdXN0b21DaGFuZ2VQYWdlKCkge1xyXG4gICAgICAgIGNvbnN0IGpxbUNoYW5nZVBhZ2U6ICh0bzogYW55LCBvcHRpb25zPzogQ2hhbmdlUGFnZU9wdGlvbnMpID0+IHZvaWQgPSBfLmJpbmQoJC5tb2JpbGUuY2hhbmdlUGFnZSwgJC5tb2JpbGUpO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjdXN0b21DaGFuZ2VQYWdlKHRvOiBhbnksIG9wdGlvbnM/OiBDaGFuZ2VQYWdlT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoXy5pc1N0cmluZyh0bykpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMudHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMudHJhbnNpdGlvbiA9IFRoZW1lLnF1ZXJ5UGFnZVRyYW5zaXRpb24ob3B0aW9ucy50cmFuc2l0aW9uKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBqcW1DaGFuZ2VQYWdlKHRvLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICQubW9iaWxlLmNoYW5nZVBhZ2UgPSBjdXN0b21DaGFuZ2VQYWdlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGZyYW1ld29yayDliJ3mnJ/ljJblvozjgavpgannlKhcclxuICAgIEZyYW1ld29yay53YWl0Rm9ySW5pdGlhbGl6ZSgpXHJcbiAgICAgICAgLmRvbmUoKCkgPT4ge1xyXG4gICAgICAgICAgICBhcHBseUN1c3RvbUNoYW5nZVBhZ2UoKTtcclxuICAgICAgICB9KTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgRG9tRXh0ZW5zaW9uT3B0aW9uc1xyXG4gICAgICogQGJyZWlmIERvbUV4dGVuc2lvbiDjgavmuKHjgZnjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEb21FeHRlbnNpb25PcHRpb25zIHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAdHlwZSBEb21FeHRlbnNpb25cclxuICAgICAqIEBicmllZiBET00g5ouh5by16Zai5pWwXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB0eXBlIERvbUV4dGVuc2lvbiA9ICgkdGFyZ2V0OiBKUXVlcnksIERvbUV4dGVuc2lvbk9wdGlvbnM/OiBPYmplY3QpID0+IEpRdWVyeTtcclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIEV4dGVuc2lvbk1hbmFnZXJcclxuICAgICAqIEBicmllZiDmi6HlvLXmqZ/og73jgpLnrqHnkIbjgZnjgovjg6bjg7zjg4bjgqPjg6rjg4bjgqPjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEV4dGVuc2lvbk1hbmFnZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX2RvbUV4dGVuc2lvbnM6IERvbUV4dGVuc2lvbltdID0gW107XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERPTSDmi6HlvLXplqLmlbDjga7nmbvpjLJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9ufSBmdW5jIFtpbl0gRE9NIOaLoeW8temWouaVsFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcmVnaXN0ZXJEb21FeHRlbnNpb24oZnVuYzogRG9tRXh0ZW5zaW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc19kb21FeHRlbnNpb25zLnB1c2goZnVuYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBET00g5ouh5by144KS6YGp55SoXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge2pRdWVyeX0gJHVpICAgICAgIFtpbl0g5ouh5by15a++6LGh44GuIERPTVxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNfZG9tRXh0ZW5zaW9ucy5mb3JFYWNoKChmdW5jOiBEb21FeHRlbnNpb24pID0+IHtcclxuICAgICAgICAgICAgICAgIGZ1bmMoJHVpLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2UgKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5Ub2FzdF0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgVG9hc3RcclxuICAgICAqIEBicmllZiBBbmRyb2lkIFNESyDjga4gVG9hc3Qg44Kv44Op44K544Gu44KI44GG44Gr6Ieq5YuV5raI5ruF44GZ44KL44Oh44OD44K744O844K45Ye65Yqb44Om44O844OG44Kj44Oq44OG44KjXHJcbiAgICAgKiAgICAgICAg5YWl44KM5a2Q44Gu6Zai5L+C44KS5a6f54++44GZ44KL44Gf44KB44GrIG1vZHVsZSDjgaflrp/oo4VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IG1vZHVsZSBUb2FzdCB7XHJcblxyXG4gICAgICAgIC8vIOihqOekuuaZgumWk+OBruWumue+qVxyXG4gICAgICAgIGV4cG9ydCBsZXQgTEVOR1RIX1NIT1JUID0gMTUwMDsgICAvLyE8IOefreOBhDoxNTAwIG1zZWNcclxuICAgICAgICBleHBvcnQgbGV0IExFTkdUSF9MT05HICA9IDQwMDA7ICAgLy8hPCDplbfjgYQ6NDAwMCBtc2VjXHJcblxyXG4gICAgICAgIC8vISBAZW51bSDjgqrjg5Xjgrvjg4Pjg4jjga7ln7rmupZcclxuICAgICAgICBleHBvcnQgZW51bSBPZmZzZXRYIHtcclxuICAgICAgICAgICAgTEVGVCAgICA9IDB4MDAwMSxcclxuICAgICAgICAgICAgUklHSFQgICA9IDB4MDAwMixcclxuICAgICAgICAgICAgQ0VOVEVSICA9IDB4MDAwNCxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBAZW51bSDjgqrjg5Xjgrvjg4Pjg4jjga7ln7rmupZcclxuICAgICAgICBleHBvcnQgZW51bSBPZmZzZXRZIHtcclxuICAgICAgICAgICAgVE9QICAgICA9IDB4MDAxMCxcclxuICAgICAgICAgICAgQk9UVE9NICA9IDB4MDAyMCxcclxuICAgICAgICAgICAgQ0VOVEVSICA9IDB4MDA0MCxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBpbnRlcmZhY2UgU3R5bGVCdWlsZGVyXHJcbiAgICAgICAgICogQGJyaWVmICAgICDjgrnjgr/jgqTjg6vlpInmm7TmmYLjgavkvb/nlKjjgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAgICAgKiAgICAgICAgICAgIGNzcyDjgavjgrnjgr/jgqTjg6vjgpLpgIPjgYzjgZnloLTlkIjjgIHni6zoh6rjga4gY2xhc3Mg44KS6Kit5a6a44GX44CBZ2V0U3R5bGUg44GvIG51bGwg44KS6L+U44GZ44GT44Go44CCXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGludGVyZmFjZSBTdHlsZUJ1aWxkZXIge1xyXG4gICAgICAgICAgICAvLyEgY2xhc3MgYXR0cmlidXRlIOOBq+ioreWumuOBmeOCi+aWh+Wtl+WIl+OCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRDbGFzcygpOiBzdHJpbmc7XHJcbiAgICAgICAgICAgIC8vISBzdHlsZSBhdHRyaWJ1dGUg44Gr6Kit5a6a44GZ44KLIEpTT04g44Kq44OW44K444Kn44Kv44OI44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldFN0eWxlKCk6IGFueTtcclxuICAgICAgICAgICAgLy8hIOOCquODleOCu+ODg+ODiOOBruWfuua6luS9jee9ruOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRQb2ludCgpOiBudW1iZXI7XHJcbiAgICAgICAgICAgIC8vISBYIOW6p+aomeOBruOCquODleOCu+ODg+ODiOWApOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRYKCk6IG51bWJlcjtcclxuICAgICAgICAgICAgLy8hIFkg5bqn5qiZ44Gu44Kq44OV44K744OD44OI5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFkoKTogbnVtYmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGNsYXNzIFN0eWxlQnVpbGRlckRlZmF1bHRcclxuICAgICAgICAgKiBAYnJpZWYg44K544K/44Kk44Or5aSJ5pu05pmC44Gr5L2/55So44GZ44KL5pei5a6a44Gu5qeL6YCg5L2T44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGNsYXNzIFN0eWxlQnVpbGRlckRlZmF1bHQgaW1wbGVtZW50cyBTdHlsZUJ1aWxkZXIge1xyXG5cclxuICAgICAgICAgICAgLy8hIGNsYXNzIGF0dHJpYnV0ZSDjgavoqK3lrprjgZnjgovmloflrZfliJfjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0Q2xhc3MoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcInVpLWxvYWRlciB1aS1vdmVybGF5LXNoYWRvdyB1aS1jb3JuZXItYWxsXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vISBzdHlsZSBhdHRyaWJ1dGUg44Gr6Kit5a6a44GZ44KLIEpTT04g44Kq44OW44K444Kn44Kv44OI44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldFN0eWxlKCk6IGFueSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdHlsZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBcInBhZGRpbmdcIjogICAgICAgICAgXCI3cHggMjVweCA3cHggMjVweFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZGlzcGxheVwiOiAgICAgICAgICBcImJsb2NrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IFwiIzFkMWQxZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYm9yZGVyLWNvbG9yXCI6ICAgICBcIiMxYjFiMWJcIixcclxuICAgICAgICAgICAgICAgICAgICBcImNvbG9yXCI6ICAgICAgICAgICAgXCIjZmZmXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0LXNoYWRvd1wiOiAgICAgIFwiMCAxcHggMCAjMTExXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJmb250LXdlaWdodFwiOiAgICAgIFwiYm9sZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwib3BhY2l0eVwiOiAgICAgICAgICAwLjgsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0eWxlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyEg44Kq44OV44K744OD44OI44Gu5Z+65rqW5L2N572u44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFBvaW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2Zmc2V0WC5DRU5URVIgfCBPZmZzZXRZLkJPVFRPTTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8hIFgg5bqn5qiZ44Gu44Kq44OV44K744OD44OI5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyEgWSDluqfmqJnjga7jgqrjg5Xjgrvjg4Pjg4jlgKTjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0T2Zmc2V0WSgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC03NTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVG9hc3Qg6KGo56S6XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gbWVzc2FnZSAgW2luXSDjg6Hjg4Pjgrvjg7zjgrhcclxuICAgICAgICAgKiBAcGFyYW0gZHVyYXRpb24gW2luXSDooajnpLrmmYLplpPjgpLoqK3lrpogKG1zZWMpIGRlZmF1bHQ6IExFTkdUSF9TSE9SVFxyXG4gICAgICAgICAqIEBwYXJhbSBzdHlsZSAgICBbaW5dIOOCueOCv+OCpOODq+WkieabtOOBmeOCi+WgtOWQiOOBq+OBr+a0vueUn+OCr+ODqeOCueOCquODluOCuOOCp+OCr+ODiOOCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBmdW5jdGlvbiBzaG93KG1lc3NhZ2U6IHN0cmluZywgZHVyYXRpb246IG51bWJlciA9IFRvYXN0LkxFTkdUSF9TSE9SVCwgc3R5bGU/OiBTdHlsZUJ1aWxkZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgJG1vYmlsZSA9ICQubW9iaWxlO1xyXG4gICAgICAgICAgICBjb25zdCBpbmZvID0gc3R5bGUgfHwgbmV3IFN0eWxlQnVpbGRlckRlZmF1bHQoKTtcclxuICAgICAgICAgICAgY29uc3Qgc2V0Q1NTID0gaW5mby5nZXRTdHlsZSgpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLy8g5pS56KGM44Kz44O844OJ44GvIDxici8+IOOBq+e9ruaPm+OBmeOCi1xyXG4gICAgICAgICAgICBjb25zdCBtc2cgPSBtZXNzYWdlLnJlcGxhY2UoL1xcbi9nLCBcIjxici8+XCIpO1xyXG5cclxuICAgICAgICAgICAgLy8g44Oh44OD44K744O844K4IGVsZW1lbnQg44Gu5YuV55qE55Sf5oiQXHJcbiAgICAgICAgICAgIGNvbnN0IGh0bWwgPSBcIjxkaXY+XCIgKyBtc2cgKyBcIjwvZGl2PlwiO1xyXG4gICAgICAgICAgICBjb25zdCBib3ggPSAkKGh0bWwpLmFkZENsYXNzKGluZm8uZ2V0Q2xhc3MoKSk7XHJcbiAgICAgICAgICAgIGlmIChzZXRDU1MpIHtcclxuICAgICAgICAgICAgICAgIGJveC5jc3MoaW5mby5nZXRTdHlsZSgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g6Ieq5YuV5pS56KGM44GV44KM44Gm44KC44KI44GE44KI44GG44Gr44CB5Z+654K544KS6Kit5a6a44GX44Gm44GL44KJ6L+95YqgXHJcbiAgICAgICAgICAgIGJveC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgXCJ0b3BcIjogMCxcclxuICAgICAgICAgICAgICAgIFwibGVmdFwiOiAwLFxyXG4gICAgICAgICAgICB9KS5hcHBlbmRUbygkbW9iaWxlLnBhZ2VDb250YWluZXIpO1xyXG5cclxuICAgICAgICAgICAgLy8g6YWN572u5L2N572u44Gu5rG65a6aXHJcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldFBvaW50ID0gaW5mby5nZXRPZmZzZXRQb2ludCgpO1xyXG4gICAgICAgICAgICBjb25zdCAkd2luZG93ID0gJCh3aW5kb3cpO1xyXG4gICAgICAgICAgICBsZXQgcG9zWCwgcG9zWTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJveF93aWR0aCA9IGJveC53aWR0aCgpICsgcGFyc2VJbnQoYm94LmNzcyhcInBhZGRpbmctbGVmdFwiKSwgMTApICsgcGFyc2VJbnQoYm94LmNzcyhcInBhZGRpbmctcmlnaHRcIiksIDEwKTtcclxuICAgICAgICAgICAgY29uc3QgYm94X2hlaWdodCA9IGJveC5oZWlnaHQoKSArIHBhcnNlSW50KGJveC5jc3MoXCJwYWRkaW5nLXRvcFwiKSwgMTApICsgcGFyc2VJbnQoYm94LmNzcyhcInBhZGRpbmctYm90dG9tXCIpLCAxMCk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKG9mZnNldFBvaW50ICYgMHgwMDBGKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFguTEVGVDpcclxuICAgICAgICAgICAgICAgICAgICBwb3NYID0gMCArIGluZm8uZ2V0T2Zmc2V0WCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRYLlJJR0hUOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSAkd2luZG93LndpZHRoKCkgLSBib3hfd2lkdGggKyBpbmZvLmdldE9mZnNldFgoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgT2Zmc2V0WC5DRU5URVI6XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWCA9ICgkd2luZG93LndpZHRoKCkgLyAyKSAtIChib3hfd2lkdGggLyAyKSArIGluZm8uZ2V0T2Zmc2V0WCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ3YXJuLiB1bmtub3duIG9mZnNldFBvaW50OlwiICsgKG9mZnNldFBvaW50ICYgMHgwMDBGKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWCA9ICgkd2luZG93LndpZHRoKCkgLyAyKSAtIChib3hfd2lkdGggLyAyKSArIGluZm8uZ2V0T2Zmc2V0WCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKG9mZnNldFBvaW50ICYgMHgwMEYwKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFkuVE9QOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1kgPSAwICsgaW5mby5nZXRPZmZzZXRZKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFkuQk9UVE9NOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1kgPSAkd2luZG93LmhlaWdodCgpIC0gYm94X2hlaWdodCArIGluZm8uZ2V0T2Zmc2V0WSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRZLkNFTlRFUjpcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gKCR3aW5kb3cuaGVpZ2h0KCkgLyAyKSAtIChib3hfaGVpZ2h0IC8gMikgKyBpbmZvLmdldE9mZnNldFkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwid2Fybi4gdW5rbm93biBvZmZzZXRQb2ludDpcIiArIChvZmZzZXRQb2ludCAmIDB4MDBGMCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc1kgPSAoJHdpbmRvdy5oZWlnaHQoKSAvIDIpIC0gKGJveF9oZWlnaHQgLyAyKSArIGluZm8uZ2V0T2Zmc2V0WSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDooajnpLpcclxuICAgICAgICAgICAgYm94LmNzcyh7XHJcbiAgICAgICAgICAgICAgICBcInRvcFwiOiBwb3NZLFxyXG4gICAgICAgICAgICAgICAgXCJsZWZ0XCI6IHBvc1gsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5kZWxheShkdXJhdGlvbilcclxuICAgICAgICAgICAgLmZhZGVPdXQoNDAwLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IFByb21pc2UgICAgICA9IENEUC5Qcm9taXNlO1xyXG4gICAgaW1wb3J0IEZyYW1ld29yayAgICA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkRpYWxvZ10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIL1cgQmFjayBLZXkgSG9vayDplqLmlbBcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IHR5cGUgRGlhbG9nQmFja0tleUhhbmRsZXIgPSAoZXZlbnQ/OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIERpYWxvZ09wdGlvbnNcclxuICAgICAqICAgICAgICAgICAg44OA44Kk44Ki44Ot44Kw44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGlhbG9nT3B0aW9ucyBleHRlbmRzIFBvcHVwT3B0aW9ucyB7XHJcbiAgICAgICAgc3JjPzogc3RyaW5nOyAgICAgICAgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IHRlbXBsYXRlIOODleOCoeOCpOODq+OBruODkeOCuSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxyXG4gICAgICAgIHRpdGxlPzogc3RyaW5nOyAgICAgICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSDjg4DjgqTjgqLjg63jgrDjgr/jgqTjg4jjg6sgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxyXG4gICAgICAgIG1lc3NhZ2U/OiBzdHJpbmc7ICAgICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSDjg6HjgqTjg7Pjg6Hjg4Pjgrvjg7zjgrggICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogdW5kZWZpbmVkXHJcbiAgICAgICAgaWRQb3NpdGl2ZT86IHN0cmluZzsgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IFBvc2l0aXZlIOODnOOCv+ODs+OBrklEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiZGxnLWJ0bi1wb3NpdGl2ZVwiXHJcbiAgICAgICAgaWROZWdhdGl2ZT86IHN0cmluZzsgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IE5hZ2F0aXZlIOODnOOCv+ODs+OBrklEICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiZGxnLWJ0bi1uZWdhdGl2ZVwiXHJcbiAgICAgICAgZXZlbnQ/OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAvLyE8IHtTdHJpbmd9IERpYWxvZyDjgq/jg6njgrnjgYznrqHnkIbjgZnjgovjgqTjg5njg7Pjg4ggICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJ2Y2xpY2tcIlxyXG4gICAgICAgIGRlZmF1bHRBdXRvQ2xvc2U/OiBib29sZWFuOyAgICAgLy8hPCB7Qm9vbGVhbn0gZGF0YS1hdXRvLWNsb3NlIOOBjOaMh+WumuOBleOCjOOBpuOBhOOBquOBhOWgtOWQiOOBruaXouWumuWApCAgICAgICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgZm9yY2VPdmVyd3JpdGVBZnRlckNsb3NlPzogYm9vbGVhbjsgLy8hPCB7Qm9vbGVhbn0gYWZ0ZXJjbG9zZSDjgqrjg5fjgrfjg6fjg7PjgpLlvLfliLbkuIrmm7jjgY3jgZnjgovjgZ/jgoHjga7oqK3lrpogICAgZGVmYXVsdDogZmFsc2VcclxuICAgICAgICBsYWJlbFBvc2l0aXZlPzogc3RyaW5nOyAgICAgICAgIC8vITwge1N0cmluZ30gUG9zaXRpdmUg44Oc44K/44Oz44Op44OZ44OrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcIk9LXCJcclxuICAgICAgICBsYWJlbE5lZ2F0aXZlPzogc3RyaW5nOyAgICAgICAgIC8vITwge1N0cmluZ30gTmVnYXRpdmUg44Oc44K/44Oz44Op44OZ44OrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcIkNhbmNlbFwiXHJcbiAgICAgICAgYmFja0tleT86IFwiY2xvc2VcIiB8IFwiZGVueVwiIHwgRGlhbG9nQmFja0tleUhhbmRsZXI7ICAvLyE8IEgvVyBiYWNrS2V5IOOBruaMr+OCi+iInuOBhCAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJjbG9zZVwiXHJcbiAgICAgICAgc2Nyb2xsRXZlbnQ/OiBcImRlbnlcIiB8IFwiYWxsb3dcIiB8IFwiYWRqdXN0XCI7ICAgLy8hPCB7U3RyaW5nfSBzY3JvbGzjga7mipHmraLmlrnlvI8gICjigLsgYWRqdXN0IOOBr+ippumok+eahCkgICAgIGRlZmF1bHQ6IFwiZGVueVwiXHJcbiAgICAgICAgZG9tRXh0ZW5zaW9uT3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnM7ICAgLy8hPCBET03mi6HlvLXjgqrjg5fjgrfjg6fjg7MuIG51bGx8dW5kZWZpbmVkIOOBp+aLoeW8teOBl+OBquOBhCAgICAgIGRlZmF1bHQ6IHt9XHJcbiAgICAgICAgW3g6IHN0cmluZ106IGFueTsgICAgICAgICAgICAgICAvLyE8IGFueSBkaWFsb2cgdGVtcGxhdGUgcGFyYW1ldGVycy5cclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIERpYWxvZ1xyXG4gICAgICogQGJyaWVmIOaxjueUqOODgOOCpOOCouODreOCsOOCr+ODqeOCuVxyXG4gICAgICogICAgICAgIGpRTSDjga4gcG9wdXAgd2lkZ2V0IOOBq+OCiOOBo+OBpuWun+ijhVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgRGlhbG9nIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGU6IFRvb2xzLkpTVCA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfc2V0dGluZ3M6IERpYWxvZ09wdGlvbnMgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgXyRkaWFsb2c6IEpRdWVyeSA9IG51bGw7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfYWN0aXZlRGlhbG9nOiBEaWFsb2cgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfb2xkQmFja0tleUhhbmRsZXI6IChldmVudD86IEpRdWVyeS5FdmVudCkgPT4gdm9pZCA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19kZWZhdWx0T3B0aW9uczogRGlhbG9nT3B0aW9ucyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gaWQgICAgICB7U3RyaW5nfSAgICAgICAgW2luXSDjg4DjgqTjgqLjg63jgrAgRE9NIElEIOOCkuaMh+WumiBleCkgI2RpYWxvZy1ob2dlXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0RpYWxvZ09wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ09wdGlvbnMpIHtcclxuICAgICAgICAgICAgLy8gRGlhbG9nIOWFsemAmuioreWumuOBruWIneacn+WMllxyXG4gICAgICAgICAgICBEaWFsb2cuaW5pdENvbW1vbkNvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICAvLyDoqK3lrprjgpLmm7TmlrBcclxuICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgRGlhbG9nLnNfZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAvLyDjg4DjgqTjgqLjg63jgrDjg4bjg7Pjg5fjg6zjg7zjg4jjgpLkvZzmiJBcclxuICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBUb29scy5UZW1wbGF0ZS5nZXRKU1QoaWQsIHRoaXMuX3NldHRpbmdzLnNyYyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOihqOekulxyXG4gICAgICAgICAqIOihqOekuuOCkuOBl+OBpuWni+OCgeOBpiBET00g44GM5pyJ5Yq544Gr44Gq44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7RGlhbG9nT3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7MgKHNyYyDjga/nhKHoppbjgZXjgozjgospXHJcbiAgICAgICAgICogQHJldHVybiDjg4DjgqTjgqLjg63jgrDjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzaG93KG9wdGlvbnM/OiBEaWFsb2dPcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgY29uc3QgJGRvY3VtZW50ID0gJChkb2N1bWVudCk7XHJcbiAgICAgICAgICAgIGNvbnN0ICRib2R5ID0gJChcImJvZHlcIik7XHJcbiAgICAgICAgICAgIGNvbnN0ICRwYWdlID0gKDxhbnk+JGJvZHkpLnBhZ2Vjb250YWluZXIoXCJnZXRBY3RpdmVQYWdlXCIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb2ZjSGlkZGVuID0ge1xyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvd1wiOiAgICAgXCJoaWRkZW5cIixcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteFwiOiAgIFwiaGlkZGVuXCIsXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXlcIjogICBcImhpZGRlblwiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBvZmNCb2R5ID0geyAvLyBib2R5IG92ZXJmbG93IGNvbnRleHRcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3dcIjogICAgICRib2R5LmNzcyhcIm92ZXJmbG93XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvdy14XCI6ICAgJGJvZHkuY3NzKFwib3ZlcmZsb3cteFwiKSxcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteVwiOiAgICRib2R5LmNzcyhcIm92ZXJmbG93LXlcIiksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudFNjcm9sbFBvcyA9ICRib2R5LnNjcm9sbFRvcCgpO1xyXG4gICAgICAgICAgICBjb25zdCBvZmNQYWdlID0geyAvLyBwYWdlIG92ZXJmbG93IGNvbnRleHRcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3dcIjogICAgICRwYWdlLmNzcyhcIm92ZXJmbG93XCIpLFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvdy14XCI6ICAgJHBhZ2UuY3NzKFwib3ZlcmZsb3cteFwiKSxcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteVwiOiAgICRwYWdlLmNzcyhcIm92ZXJmbG93LXlcIiksXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzY3JvbGxFdmVudCA9IFwic2Nyb2xsIHRvdWNobW92ZSBtb3VzZW1vdmUgTVNQb2ludGVyTW92ZVwiO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsSGFuZGVyID0gKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChcImRlbnlcIiA9PT0gdGhpcy5fc2V0dGluZ3Muc2Nyb2xsRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChcImFkanVzdFwiID09PSB0aGlzLl9zZXR0aW5ncy5zY3JvbGxFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRib2R5LnNjcm9sbFRvcChwYXJlbnRTY3JvbGxQb3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8gb3B0aW9uIOOBjOaMh+WumuOBleOCjOOBpuOBhOOBn+WgtOWQiOabtOaWsFxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXR0aW5ncyA9ICQuZXh0ZW5kKHt9LCB0aGlzLl9zZXR0aW5ncywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGFmdGVyY2xvc2Ug5Yem55CG44GvIERpYWxvZyDjga7noLTmo4Tlh6bnkIbjgpLlrp/oo4XjgZnjgovjgZ/jgoHln7rmnKznmoTjgavoqK3lrprnpoHmraIgKOW8t+WItuS4iuabuOOBjeODouODvOODieOCkuioreWumuS9v+eUqOWPrylcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmFmdGVyY2xvc2UgJiYgIXRoaXMuX3NldHRpbmdzLmZvcmNlT3ZlcndyaXRlQWZ0ZXJDbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiY2Fubm90IGFjY2VwdCAnYWZ0ZXJjbG9zZScgb3B0aW9uLiBwbGVhc2UgaW5zdGVhZCB1c2luZyAncG9wdXBhZnRlcmNsb3NlJyBldmVudC5cIik7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fc2V0dGluZ3MuYWZ0ZXJjbG9zZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gdGl0bGUg44Gu5pyJ54ShXHJcbiAgICAgICAgICAgICg8YW55PnRoaXMuX3NldHRpbmdzKS5fdGl0bGVTdGF0ZSA9IHRoaXMuX3NldHRpbmdzLnRpdGxlID8gXCJ1aS1oYXMtdGl0bGVcIiA6IFwidWktbm8tdGl0bGVcIjtcclxuXHJcbiAgICAgICAgICAgIC8qXHJcbiAgICAgICAgICAgICAqIHRlbXBsYXRlIOOBi+OCiSBqUXVlcnkg44Kq44OW44K444Kn44Kv44OI44KS5L2c5oiQ44GX44CBXHJcbiAgICAgICAgICAgICAqIDxib2R5PiDnm7TkuIvjgavov73liqAuXHJcbiAgICAgICAgICAgICAqICRwYWdlIOOBp+OBryBCYWNrYm9uZSBldmVudCDjgpLlj5fjgZHjgonjgozjgarjgYTjgZPjgajjgavms6jmhI9cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cgPSAkKHRoaXMuX3RlbXBsYXRlKHRoaXMuX3NldHRpbmdzKSk7XHJcbiAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cubG9jYWxpemUoKTtcclxuICAgICAgICAgICAgJGJvZHkuYXBwZW5kKHRoaXMuXyRkaWFsb2cpO1xyXG5cclxuICAgICAgICAgICAgLy8gdGhlbWUg44KS6Kej5rG6XHJcbiAgICAgICAgICAgIHRoaXMucmVzb2x2ZVRoZW1lKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl8kZGlhbG9nXHJcbiAgICAgICAgICAgICAgICAub24oXCJwb3B1cGNyZWF0ZVwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOOCueOCr+ODreODvOODq+OCkuaKkeatolxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChcImFsbG93XCIgIT09IHRoaXMuX3NldHRpbmdzLnNjcm9sbEV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRkb2N1bWVudC5vbihzY3JvbGxFdmVudCwgc2Nyb2xsSGFuZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJGJvZHkuY3NzKG9mY0hpZGRlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHBhZ2UuY3NzKG9mY0hpZGRlbik7XHJcbiAgICAgICAgICAgICAgICAgICAgRGlhbG9nLnJlZ2lzdGVyKHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5lbmhhbmNlV2l0aGluKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBET00g5ouh5by1XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX3NldHRpbmdzLmRvbUV4dGVuc2lvbk9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIEV4dGVuc2lvbk1hbmFnZXIuYXBwbHlEb21FeHRlbnNpb24odGhpcy5fJGRpYWxvZywgdGhpcy5fc2V0dGluZ3MuZG9tRXh0ZW5zaW9uT3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMub25CZWZvcmVTaG93KClcclxuICAgICAgICAgICAgICAgIC5kb25lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDooajnpLpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kZGlhbG9nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wb3B1cCgkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25UbzogXCJ3aW5kb3dcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFmdGVyY2xvc2U6IChldmVudDogSlF1ZXJ5LkV2ZW50LCB1aTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8g44K544Kv44Ot44O844Or54q25oWL44KS5oi744GZXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHBhZ2UuY3NzKG9mY1BhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRib2R5LmNzcyhvZmNCb2R5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoXCJhbGxvd1wiICE9PSB0aGlzLl9zZXR0aW5ncy5zY3JvbGxFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub2ZmKHNjcm9sbEV2ZW50LCBzY3JvbGxIYW5kZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEaWFsb2cucmVnaXN0ZXIobnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl8kZGlhbG9nID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRoaXMuX3NldHRpbmdzKSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnBvcHVwKFwib3BlblwiKS5vbih0aGlzLl9zZXR0aW5ncy5ldmVudCwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFwiZGF0YS1hdXRvLWNsb3NlPSdmYWxzZSdcIiDjgYzmjIflrprjgZXjgozjgabjgYTjgovopoHntKDjga8gZGlhbG9nIOOCkumWieOBmOOBquOBhFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF1dG9DbG9zZSA9ICQoZXZlbnQudGFyZ2V0KS5hdHRyKFwiZGF0YS1hdXRvLWNsb3NlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgPT0gYXV0b0Nsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXV0b0Nsb3NlID0gdGhpcy5fc2V0dGluZ3MuZGVmYXVsdEF1dG9DbG9zZSA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFwiZmFsc2VcIiA9PT0gYXV0b0Nsb3NlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5mYWlsKChlcnJvcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJEaWFsb2cuc2hvdygpIGZhaWxlZC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuXyRkaWFsb2cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZy50cmlnZ2VyKFwiZXJyb3JcIiwgZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRkaWFsb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDntYLkuoZcclxuICAgICAgICAgKiDln7rmnKznmoTjgavjga/oh6rli5XjgafplonjgZjjgovjgYzjgIFcclxuICAgICAgICAgKiDooajnpLrkuK3jga7jg4DjgqTjgqLjg63jgrDjgpLjgq/jg6njgqTjgqLjg7Pjg4jlgbTjgYvjgonplonjgZjjgovjg6Hjgr3jg4Pjg4lcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgY2xvc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl8kZGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kZGlhbG9nLnBvcHVwKFwiY2xvc2VcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg4DjgqTjgqLjg63jgrAgZWxlbWVudCDjgpLlj5blvpdcclxuICAgICAgICBwdWJsaWMgZ2V0ICRlbCgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJGRpYWxvZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJvdGVjdGVkIG1ldGhvZHM6IE92ZXJyaWRlXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODgOOCpOOCouODreOCsOihqOekuuOBruebtOWJjVxyXG4gICAgICAgICAqIERPTSDjgpLmk43kvZzjgafjgY3jgovjgr/jgqTjg5/jg7PjgrDjgaflkbzjgbPlh7rjgZXjgozjgosuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtJUHJvbWlzZUJhc2V9IHByb21pc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQmVmb3JlU2hvdygpOiBJUHJvbWlzZUJhc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlPHZvaWQ+KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg4DjgqTjgqLjg63jgrDjga7kvb/nlKjjgZnjgosgVGhlbWUg44KS6Kej5rG6XHJcbiAgICAgICAgICog5LiN6KaB44Gq5aC05ZCI44Gv44Kq44O844OQ44O844Op44Kk44OJ44GZ44KL44GT44Go44KC5Y+v6IO9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJvdGVjdGVkIHJlc29sdmVUaGVtZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgcXVlcnlUaGVtZSA9ICgpOiBzdHJpbmcgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICQoXCIudWktcGFnZS1hY3RpdmVcIikuanFtRGF0YShcInRoZW1lXCIpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZVRoZW1lOiBzdHJpbmc7XHJcblxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3NldHRpbmdzLnRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkb21UaGVtZSA9IHRoaXMuXyRkaWFsb2cuanFtRGF0YShcInRoZW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkb21UaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzLnRoZW1lID0gY2FuZGlkYXRlVGhlbWUgPSBxdWVyeVRoZW1lKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fc2V0dGluZ3Mub3ZlcmxheVRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkb21PdmVybGF5VGhlbWUgPSB0aGlzLl8kZGlhbG9nLmpxbURhdGEoXCJvdmVybGF5LXRoZW1lXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFkb21PdmVybGF5VGhlbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXR0aW5ncy5vdmVybGF5VGhlbWUgPSBjYW5kaWRhdGVUaGVtZSB8fCBxdWVyeVRoZW1lKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHRyYW5zaXRpb24g44Gu5pu05pawXHJcbiAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzLnRyYW5zaXRpb24gPSBUaGVtZS5xdWVyeURpYWxvZ1RyYW5zaXRpb24odGhpcy5fc2V0dGluZ3MudHJhbnNpdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBzdGF0aWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEaWFsb2cg44Gu5pei5a6a44Kq44OX44K344On44Oz44KS5pu05pawXHJcbiAgICAgICAgICog44GZ44G644Gm44GuIERpYWxvZyDjgYzkvb/nlKjjgZnjgovlhbHpgJroqK3lrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtEaWFsb2dPcHRpb25zfSBbaW5dIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2V0RGVmYXVsdE9wdGlvbnMob3B0aW9uczogRGlhbG9nT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBEaWFsb2cg5YWx6YCa6Kit5a6a44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICAgIERpYWxvZy5pbml0Q29tbW9uQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgICQuZXh0ZW5kKHRydWUsIERpYWxvZy5zX2RlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vISDnj77lnKggYWN0aXZlIOOBquODgOOCpOOCouODreOCsOOBqOOBl+OBpueZu+mMsuOBmeOCi1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHJlZ2lzdGVyKGRpYWxvZzogRGlhbG9nKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IGRpYWxvZyAmJiBudWxsICE9IERpYWxvZy5zX2FjdGl2ZURpYWxvZykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwibmV3IGRpYWxvZyBwcm9jIGlzIGNhbGxlZCBpbiB0aGUgcGFzdCBkaWFsb2cncyBvbmUuIHVzZSBzZXRUaW1lb3V0KCkgZm9yIHBvc3QgcHJvY2Vzcy5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRGlhbG9nLnNfYWN0aXZlRGlhbG9nID0gZGlhbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGlhbG9nIOWFsemAmuioreWumuOBruWIneacn+WMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGluaXRDb21tb25Db25kaXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIEZyYW1ld29yayDjga7liJ3mnJ/ljJblvozjgavlh6bnkIbjgZnjgovlv4XopoHjgYzjgYLjgotcclxuICAgICAgICAgICAgaWYgKCFGcmFtZXdvcmsuaXNJbml0aWFsaXplZCgpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJpbml0Q29tbW9uQ29uZGl0aW9uKCkgc2hvdWxkIGJlIGNhbGxlZCBhZnRlciBGcmFtZXdvcmsuaW5pdGlhbGl6ZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBEaWFsb2cuc19vbGRCYWNrS2V5SGFuZGxlcikge1xyXG4gICAgICAgICAgICAgICAgLy8gQmFjayBCdXR0b24gSGFuZGxlclxyXG4gICAgICAgICAgICAgICAgRGlhbG9nLnNfb2xkQmFja0tleUhhbmRsZXIgPSBDRFAuc2V0QmFja0J1dHRvbkhhbmRsZXIobnVsbCk7XHJcbiAgICAgICAgICAgICAgICBDRFAuc2V0QmFja0J1dHRvbkhhbmRsZXIoRGlhbG9nLmN1c3RvbUJhY2tLZXlIYW5kbGVyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyDml6Llrprjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgICAgICAgIERpYWxvZy5zX2RlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlkUG9zaXRpdmU6ICAgICAgICAgICAgIFwiZGxnLWJ0bi1wb3NpdGl2ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkTmVnYXRpdmU6ICAgICAgICAgICAgIFwiZGxnLWJ0bi1uZWdhdGl2ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiAgICAgICAgICAgICAgICAgIEZyYW1ld29yay5nZXREZWZhdWx0Q2xpY2tFdmVudCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpc21pc3NpYmxlOiAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHRBdXRvQ2xvc2U6ICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb246ICAgICAgICAgICAgIFwicGxhdGZvcm0tZGVmYXVsdFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsUG9zaXRpdmU6ICAgICAgICAgIFwiT0tcIixcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbE5lZ2F0aXZlOiAgICAgICAgICBcIkNhbmNlbFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGJhY2tLZXk6ICAgICAgICAgICAgICAgIFwiY2xvc2VcIixcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxFdmVudDogICAgICAgICAgICBcImRlbnlcIixcclxuICAgICAgICAgICAgICAgICAgICBkb21FeHRlbnNpb25PcHRpb25zOiAgICB7fSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEgvVyBCYWNrIEJ1dHRvbiBIYW5kbGVyXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgY3VzdG9tQmFja0tleUhhbmRsZXIoZXZlbnQ/OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gRGlhbG9nLnNfYWN0aXZlRGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJjbG9zZVwiID09PSBEaWFsb2cuc19hY3RpdmVEaWFsb2cuX3NldHRpbmdzLmJhY2tLZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICBEaWFsb2cuc19hY3RpdmVEaWFsb2cuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJmdW5jdGlvblwiID09PSB0eXBlb2YgRGlhbG9nLnNfYWN0aXZlRGlhbG9nLl9zZXR0aW5ncy5iYWNrS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgKDxEaWFsb2dCYWNrS2V5SGFuZGxlcj5EaWFsb2cuc19hY3RpdmVEaWFsb2cuX3NldHRpbmdzLmJhY2tLZXkpKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybjsgLy8gRGlhbG9nIOOBjCBhY3RpdmUg44Gq5aC05ZCI44CB5bi444Gr5pei5a6a44Gu44OP44Oz44OJ44Op44Gr44Gv5rih44GV44Gq44GEXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRGlhbG9nLnNfb2xkQmFja0tleUhhbmRsZXIoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5EaWFsb2dDb21tb25zXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEFsZXJ0XHJcbiAgICAgKiBhbGVydCDjg6Hjg4Pjgrvjg7zjgrjooajnpLpcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgIFtpbl0g6KGo56S65paH5a2X5YiXXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnNdIFtpbl0g44OA44Kk44Ki44Ot44Kw44Kq44OX44K344On44OzXHJcbiAgICAgKiBAcmV0dXJuIHtqUXVlcnl9IOODgOOCpOOCouODreOCsOOBriBET00g44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBhbGVydChtZXNzYWdlOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dPcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGBcclxuICAgICAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ1aS1tb2RhbFwiIGRhdGEtcm9sZT1cInBvcHVwXCIgZGF0YS1jb3JuZXJzPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3M9XCJ1aS10aXRsZSB7e190aXRsZVN0YXRlfX1cIj57e3RpdGxlfX08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInVpLW1lc3NhZ2VcIj57e21lc3NhZ2V9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktbW9kYWwtZm9vdGVyIHVpLWdyaWQtc29sb1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwie3tpZFBvc2l0aXZlfX1cIiBjbGFzcz1cInVpLWJ0biB1aS1ibG9jay1hIHVpLXRleHQtZW1waGFzaXNcIiBkYXRhLWF1dG8tY2xvc2U9XCJ0cnVlXCI+e3tsYWJlbFBvc2l0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICAgICAgPC9zY3JpcHQ+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY29uc3QgZGxnQWxlcnQgPSBuZXcgRGlhbG9nKHRlbXBsYXRlLCAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICBzcmM6IG51bGwsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXHJcbiAgICAgICAgfSwgb3B0aW9ucykpO1xyXG5cclxuICAgICAgICByZXR1cm4gZGxnQWxlcnQuc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uZmlybVxyXG4gICAgICog56K66KqN44Oh44OD44K744O844K46KGo56S6XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgICBbaW5dIOihqOekuuaWh+Wtl+WIl1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zXSBbaW5dIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHJldHVybiB7alF1ZXJ5fSDjg4DjgqTjgqLjg63jgrDjga4gRE9NIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gY29uZmlybShtZXNzYWdlOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dPcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGBcclxuICAgICAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ1aS1tb2RhbFwiIGRhdGEtcm9sZT1cInBvcHVwXCIgZGF0YS1jb3JuZXJzPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3M9XCJ1aS10aXRsZSB7e190aXRsZVN0YXRlfX1cIj57e3RpdGxlfX08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInVpLW1lc3NhZ2VcIj57e21lc3NhZ2V9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktbW9kYWwtZm9vdGVyIHVpLWdyaWQtYVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwie3tpZE5lZ2F0aXZlfX1cIiBjbGFzcz1cInVpLWJ0biB1aS1ibG9jay1hXCIgZGF0YS1hdXRvLWNsb3NlPVwidHJ1ZVwiPnt7bGFiZWxOZWdhdGl2ZX19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkUG9zaXRpdmV9fVwiIGNsYXNzPVwidWktYnRuIHVpLWJsb2NrLWIgdWktdGV4dC1lbXBoYXNpc1wiIGRhdGEtYXV0by1jbG9zZT1cInRydWVcIj57e2xhYmVsUG9zaXRpdmV9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9zZWN0aW9uPlxyXG4gICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICBgO1xyXG5cclxuICAgICAgICBjb25zdCBkbGdDb25maXJtID0gbmV3IERpYWxvZyh0ZW1wbGF0ZSwgJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgc3JjOiBudWxsLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgIH0sIG9wdGlvbnMpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRsZ0NvbmZpcm0uc2hvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBEaWFsb2dDb21tb25zT3B0aW9uc1xyXG4gICAgICogQGJyaWVmIHByb21wdCDjga7jgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBEaWFsb2dQcm9tcHRPcHRpb25zIGV4dGVuZHMgRGlhbG9nT3B0aW9ucyB7XHJcbiAgICAgICAgZXZlbnRPSz86IHN0cmluZzsgLy8hPCBPSyDjg5zjgr/jg7PmirzkuIvmmYLjga4gZXZlbnQ6IGRlZmF1bHQ6IHByb21wdG9rXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgRGlhbG9nUHJvbXB0XHJcbiAgICAgKiBAYnJpZWYgcHJvbXB0IOODgOOCpOOCouODreOCsCAo6Z2e5YWs6ZaLKVxyXG4gICAgICovXHJcbiAgICBjbGFzcyBEaWFsb2dQcm9tcHQgZXh0ZW5kcyBEaWFsb2cge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9ldmVudE9LOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBvcHRpb25zPzogRGlhbG9nUHJvbXB0T3B0aW9ucykge1xyXG4gICAgICAgICAgICBzdXBlcihpZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50T0sgPSBvcHRpb25zLmV2ZW50T0sgfHwgXCJwcm9tcHRva1wiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODgOOCpOOCouODreOCsOihqOekuuOBruebtOWJjVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkJlZm9yZVNob3coKTogSVByb21pc2VCYXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgdGhpcy4kZWxcclxuICAgICAgICAgICAgICAgIC5vbihcInZjbGlja1wiLCBcIi5jb21tYW5kLXByb21wdC1vayBcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy4kZWwuZmluZChcIiNfdWktcHJvbXB0XCIpLnZhbCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVsLnRyaWdnZXIodGhpcy5fZXZlbnRPSywgdGV4dCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLm9uQmVmb3JlU2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb21wdFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICAgW2luXSDooajnpLrmloflrZfliJdcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uc10gW2luXSDjg4DjgqTjgqLjg63jgrDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEByZXR1cm4ge2pRdWVyeX0g44OA44Kk44Ki44Ot44Kw44GuIERPTSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHByb21wdChtZXNzYWdlOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dQcm9tcHRPcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGBcclxuICAgICAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3M9XCJ1aS1tb2RhbFwiIGRhdGEtcm9sZT1cInBvcHVwXCIgZGF0YS1jb3JuZXJzPVwiZmFsc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3M9XCJ1aS10aXRsZSB7e190aXRsZVN0YXRlfX1cIj57e3RpdGxlfX08L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBjbGFzcz1cInVpLW1lc3NhZ2VcIj57e21lc3NhZ2V9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cIl91aS1wcm9tcHRcIiBjbGFzcz1cInVpLWhpZGRlbi1hY2Nlc3NpYmxlXCI+PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgbmFtZT1cIl91aS1wcm9tcHRcIiBpZD1cIl91aS1wcm9tcHRcIj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidWktbW9kYWwtZm9vdGVyIHVpLWdyaWQtYVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwie3tpZE5lZ2F0aXZlfX1cIiBjbGFzcz1cInVpLWJ0biB1aS1ibG9jay1hXCIgZGF0YS1hdXRvLWNsb3NlPVwidHJ1ZVwiPnt7bGFiZWxOZWdhdGl2ZX19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9XCJ7e2lkUG9zaXRpdmV9fVwiIGNsYXNzPVwiY29tbWFuZC1wcm9tcHQtb2sgdWktYnRuIHVpLWJsb2NrLWIgdWktdGV4dC1lbXBoYXNpc1wiIGRhdGEtYXV0by1jbG9zZT1cImZhbHNlXCI+e3tsYWJlbFBvc2l0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICAgICAgPC9zY3JpcHQ+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY29uc3QgZGxnUHJvbXB0ID0gbmV3IERpYWxvZ1Byb21wdCh0ZW1wbGF0ZSwgJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgc3JjOiBudWxsLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgIH0sIG9wdGlvbnMpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRsZ1Byb21wdC5zaG93KCk7XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IFJvdXRlciAgICAgICA9IENEUC5GcmFtZXdvcmsuUm91dGVyO1xyXG4gICAgaW1wb3J0IElQYWdlICAgICAgICA9IENEUC5GcmFtZXdvcmsuSVBhZ2U7XHJcbiAgICBpbXBvcnQgTW9kZWwgICAgICAgID0gQ0RQLkZyYW1ld29yay5Nb2RlbDtcclxuICAgIGltcG9ydCBWaWV3ICAgICAgICAgPSBDRFAuRnJhbWV3b3JrLlZpZXc7XHJcbiAgICBpbXBvcnQgVmlld09wdGlvbnMgID0gQ0RQLkZyYW1ld29yay5WaWV3T3B0aW9ucztcclxuICAgIGltcG9ydCBUZW1wbGF0ZSAgICAgPSBDRFAuVG9vbHMuVGVtcGxhdGU7XHJcbiAgICBpbXBvcnQgSlNUICAgICAgICAgID0gQ0RQLlRvb2xzLkpTVDtcclxuXHJcbiAgICBjb25zdCBUQUc6IHN0cmluZyA9IFwiW0NEUC5VSS5CYXNlSGVhZGVyVmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEJhc2VIZWFkZXJWaWV3T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIEJhc2VIZWFkZXJWaWV3IOOBq+aMh+WumuOBmeOCi+OCquODl+OCt+ODp+ODs+OCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJhc2VIZWFkZXJWaWV3T3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFZpZXdPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIGJhc2VUZW1wbGF0ZT86IEpTVDsgICAgICAgICAgICAgLy8hPCDlm7rlrprjg5jjg4Pjg4DnlKggSmF2YVNjcmlwdCDjg4bjg7Pjg5fjg6zjg7zjg4guXHJcbiAgICAgICAgYmFja0NvbW1hbmRTZWxlY3Rvcj86IHN0cmluZzsgICAvLyE8IFwi5oi744KLXCLjgrPjg57jg7Pjg4njgrvjg6zjgq/jgr8uIGRlZmF1bHQ6IFwiY29tbWFuZC1iYWNrXCJcclxuICAgICAgICBiYWNrQ29tbWFuZEtpbmQ/OiBzdHJpbmc7ICAgICAgIC8vITwgXCLmiLvjgotcIuOCs+ODnuODs+ODieeoruWIpSAob25Db21tYW5kIOesrDLlvJXmlbApLiBkZWZhdWx0OiBcInBhZ2ViYWNrXCJcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIEJhc2VIZWFkZXJWaWV3XHJcbiAgICAgKiBAYnJpZWYg5YWx6YCa44OY44OD44OA44KS5pON5L2c44GZ44KL44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBCYXNlSGVhZGVyVmlldzxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFZpZXc8VE1vZGVsPiB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfJGhlYWRlckJhc2U6IEpRdWVyeTsgICAvLyE8IOODmuODvOOCuOWkluOBq+mFjee9ruOBleOCjOOCi+WFsemAmuODmOODg+ODgOOBruODmeODvOOCuemDqOWTgeeUqCBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19yZWZDb3VudCA9IDA7ICAgICAgICAgIC8vITwg5Y+C54Wn44Kr44Km44Oz44OIXHJcbiAgICAgICAgcHJpdmF0ZSBfdGVtcGxhdGU6IEpTVDtcclxuICAgICAgICBwcml2YXRlIF9oYXNCYWNrSW5kaWNhdG9yOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtJUGFnZX0gX293bmVyIFtpbl0g44Kq44O844OK44O844Oa44O844K444Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfb3duZXI6IElQYWdlLCBwcml2YXRlIF9vcHRpb25zPzogQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIoX29wdGlvbnMgPSAkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICBlbDogX293bmVyLiRwYWdlLmZpbmQoXCJbZGF0YS1yb2xlPSdoZWFkZXInXVwiKSxcclxuICAgICAgICAgICAgICAgIGJhY2tDb21tYW5kU2VsZWN0b3I6IFwiLmNvbW1hbmQtYmFja1wiLFxyXG4gICAgICAgICAgICAgICAgYmFja0NvbW1hbmRLaW5kOiBcInBhZ2ViYWNrXCIsXHJcbiAgICAgICAgICAgIH0sIF9vcHRpb25zKSk7XHJcblxyXG4gICAgICAgICAgICAvLyB0ZW1wbGF0ZSDoqK3lrppcclxuICAgICAgICAgICAgaWYgKF9vcHRpb25zLmJhc2VUZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBfb3B0aW9ucy5iYXNlVGVtcGxhdGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IFRlbXBsYXRlLmdldEpTVChgXHJcbiAgICAgICAgICAgICAgICAgICAgPHNjcmlwdCB0eXBlPSd0ZXh0L3RlbXBsYXRlJz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGhlYWRlciBjbGFzcz0ndWktaGVhZGVyLWJhc2UgdWktYm9keS17e3RoZW1lfX0nPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0ndWktZml4ZWQtYmFjay1pbmRpY2F0b3InPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICAgICAgICAgIGApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBCYWNrYm9uZS5WaWV3IOeUqOOBruWIneacn+WMllxyXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQodGhpcy4kZWwsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDliJ3mnJ/ljJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgY3JlYXRlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUhlYWRlckJhc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOacieWKueWMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBhY3RpdmF0ZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zaG93SW5kaWNhdG9yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnhKHlirnljJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgaW5hY3RpdmF0ZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5oaWRlSW5kaWNhdG9yKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnoLTmo4RcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgcmVsZWFzZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZWxlYXNlSGVhZGVyQmFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8hIOWFsemAmuODmOODg+ODgOOBruODmeODvOOCueOCkua6luWCmVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlSGVhZGVyQmFzZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICAvLyDlm7rlrprjg5jjg4Pjg4Djga7jgajjgY3jgavmnInlirnljJZcclxuICAgICAgICAgICAgaWYgKFwiZml4ZWRcIiA9PT0gdGhpcy5fb3duZXIuJGhlYWRlci5qcW1EYXRhKFwicG9zaXRpb25cIikpIHtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsID09IEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlID0gJCh0aGlzLl90ZW1wbGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiB0aGlzLl9vd25lci4kcGFnZS5qcW1EYXRhKFwidGhlbWVcIiksXHJcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc19yZWZDb3VudCsrO1xyXG4gICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZS5hcHBlbmRUbygkKGRvY3VtZW50LmJvZHkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBCYWNrIEluZGljYXRvciDjgpLmjIHjgaPjgabjgYTjgovjgYvliKTlrppcclxuICAgICAgICAgICAgaWYgKDAgPCB0aGlzLiRlbC5maW5kKFwiLnVpLWJhY2staW5kaWNhdG9yXCIpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faGFzQmFja0luZGljYXRvciA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgaW5kaWNhdG9yIOOBruihqOekulxyXG4gICAgICAgIHByaXZhdGUgc2hvd0luZGljYXRvcigpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICAvLyBCYWNrIEluZGljYXRvciDjgpLmjIHjgaPjgabjgYTjgarjgYTloLTlkIjooajnpLrjgZfjgarjgYRcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSAmJiB0aGlzLl9oYXNCYWNrSW5kaWNhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlLmZpbmQoXCIudWktZml4ZWQtYmFjay1pbmRpY2F0b3JcIikuYWRkQ2xhc3MoXCJzaG93XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGluZGljYXRvciDjga7pnZ7ooajnpLpcclxuICAgICAgICBwcml2YXRlIGhpZGVJbmRpY2F0b3IoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSkge1xyXG4gICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZS5maW5kKFwiLnVpLWZpeGVkLWJhY2staW5kaWNhdG9yXCIpLnJlbW92ZUNsYXNzKFwic2hvd1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhbHpgJrjg5jjg4Pjg4Djga7jg5njg7zjgrnjgpLnoLTmo4RcclxuICAgICAgICBwcml2YXRlIHJlbGVhc2VIZWFkZXJCYXNlKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIC8vIOWbuuWumuODmOODg+ODgOaZguOBq+WPgueFp+OCq+OCpuODs+ODiOOCkueuoeeQhlxyXG4gICAgICAgICAgICBpZiAoXCJmaXhlZFwiID09PSB0aGlzLl9vd25lci4kaGVhZGVyLmpxbURhdGEoXCJwb3NpdGlvblwiKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfcmVmQ291bnQtLTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoMCA9PT0gQmFzZUhlYWRlclZpZXcuc19yZWZDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBCYWNrYm9uZS5WaWV3XHJcblxyXG4gICAgICAgIC8vISBldmVudHMgYmluZGluZ1xyXG4gICAgICAgIGV2ZW50cygpOiBhbnkge1xyXG4gICAgICAgICAgICBjb25zdCBldmVudE1hcCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRNYXBbXCJ2Y2xpY2sgXCIgKyB0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kU2VsZWN0b3JdID0gdGhpcy5vbkNvbW1hbmRCYWNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBldmVudE1hcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBiYWNrIOOBruODj+ODs+ODieODqVxyXG4gICAgICAgIHByaXZhdGUgb25Db21tYW5kQmFjayhldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vd25lcikge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlZCA9IHRoaXMuX293bmVyLm9uQ29tbWFuZChldmVudCwgdGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEtpbmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaGFuZGxlZCkge1xyXG4gICAgICAgICAgICAgICAgUm91dGVyLmJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBGcmFtZXdvcmsgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIGNvbnN0IFRBRzogc3RyaW5nID0gXCJbQ0RQLlVJLkJhc2VQYWdlXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgQmFzZVBhZ2VPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgQmFzZVBhZ2Ug44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFzZVBhZ2VPcHRpb25zPFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuUGFnZUNvbnN0cnVjdE9wdGlvbnMsIEJhc2VIZWFkZXJWaWV3T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBiYXNlSGVhZGVyPzogbmV3IChvd25lcjogRnJhbWV3b3JrLklQYWdlLCBvcHRpb25zPzogQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbD4pID0+IEJhc2VIZWFkZXJWaWV3PFRNb2RlbD47ICAgLy8hPCBIZWFkZXIg5qmf6IO944KS5o+Q5L6b44GZ44KL5Z+65bqV44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgYmFja0NvbW1hbmRIYW5kbGVyPzogc3RyaW5nOyAgICAgICAgICAgICAgICAvLyE8IFwi5oi744KLXCIg44Kz44Oe44Oz44OJ44OP44Oz44OJ44Op44Oh44K944OD44OJ5ZCNLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogb25QYWdlQmFja1xyXG4gICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zOyAgLy8hPCBET03mi6HlvLXjgavmuKHjgZnjgqrjg5fjgrfjg6fjg7MuIG51bGx8dW5kZWZpbmVkIOOCkuaMh+WumuOBmeOCi+OBqOaLoeW8teOBl+OBquOBhCBkZWZhdWx0OiB7fVxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgQmFzZVBhZ2VcclxuICAgICAqIEBicmllZiBIZWFkZXIg44KS5YKZ44GI44KLIFBhZ2Ug44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBCYXNlUGFnZTxUTW9kZWwgZXh0ZW5kcyBGcmFtZXdvcmsuTW9kZWwgPSBGcmFtZXdvcmsuTW9kZWw+IGV4dGVuZHMgRnJhbWV3b3JrLlBhZ2Uge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9iYXNlSGVhZGVyOiBCYXNlSGVhZGVyVmlldzxUTW9kZWw+OyAgICAvLyE8IOODmOODg+ODgOOCr+ODqeOCuVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICAgICAgIHVybCAgICAgICBbaW5dIOODmuODvOOCuCBVUkxcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgaWQgICAgICAgIFtpbl0g44Oa44O844K4IElEXHJcbiAgICAgICAgICogQHBhcmFtIHtCYXNlUGFnZU9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBwcml2YXRlIF9vcHRpb25zPzogQmFzZVBhZ2VPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIodXJsLCBpZCwgX29wdGlvbnMgPSAkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICBiYXNlSGVhZGVyOiBCYXNlSGVhZGVyVmlldyxcclxuICAgICAgICAgICAgICAgIGJhY2tDb21tYW5kSGFuZGxlcjogXCJvblBhZ2VCYWNrXCIsXHJcbiAgICAgICAgICAgICAgICBiYWNrQ29tbWFuZEtpbmQ6IFwicGFnZWJhY2tcIixcclxuICAgICAgICAgICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM6IHt9LFxyXG4gICAgICAgICAgICB9LCBfb3B0aW9ucykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBPdmVycmlkZTogRnJhbWV3b3JrIFBhZ2VcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVjcmVhdGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUNyZWF0ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmJhc2VIZWFkZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VIZWFkZXIgPSBuZXcgdGhpcy5fb3B0aW9ucy5iYXNlSGVhZGVyKHRoaXMsIHRoaXMuX29wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlci5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VjcmVhdGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUluaXQoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9vcHRpb25zLmRvbUV4dGVuc2lvbk9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIEV4dGVuc2lvbk1hbmFnZXIuYXBwbHlEb21FeHRlbnNpb24odGhpcy4kcGFnZSwgdGhpcy5fb3B0aW9ucy5kb21FeHRlbnNpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VJbml0KGV2ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmFzZUhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlci5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iYXNlSGVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLmluYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVIaWRlKGV2ZW50LCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VSZW1vdmUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmFzZUhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlci5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VSZW1vdmUoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSC9XIEJhY2sgQnV0dG9uIOODj+ODs+ODieODqVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIGV2ZW50IG9iamVjdFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaXouWumuOBruWHpueQhuOCkuihjOOCj+OBquOBhCAvIGZhbHNlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgYZcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkhhcmR3YXJlQmFja0J1dHRvbihldmVudD86IEpRdWVyeS5FdmVudCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBsZXQgcmV0dmFsID0gc3VwZXIub25IYXJkd2FyZUJhY2tCdXR0b24oZXZlbnQpO1xyXG4gICAgICAgICAgICBpZiAoIXJldHZhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dmFsID0gdGhpcy5vbkNvbW1hbmQoZXZlbnQsIHRoaXMuX29wdGlvbnMuYmFja0NvbW1hbmRLaW5kKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0dmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBPdmVycmlkZTogQ3VzdG9tIEV2ZW50XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFwi5oi744KLXCIgZXZlbnQg55m66KGM5pmC44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgo/jgarjgYQgLyBmYWxzZTog5pei5a6a44Gu5Yem55CG44KS6KGM44GGXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25Db21tYW5kKGV2ZW50OiBKUXVlcnkuRXZlbnQsIGtpbmQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEtpbmQgPT09IGtpbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vd25lciAmJiB0aGlzLl9vd25lclt0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kSGFuZGxlcl0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXJbdGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEhhbmRsZXJdKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcbiAgICBpbXBvcnQgUHJvbWlzZSAgICAgID0gQ0RQLlByb21pc2U7XHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrICAgID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZVZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnNcclxuICAgICAqIEBicmllZiBSb3V0ZXIg44G444Gu55m76Yyy5oOF5aCx44GoIEJhY2tib25lLlZpZXcg44G444Gu5Yid5pyf5YyW5oOF5aCx44KS5qC857SN44GZ44KL44Kk44Oz44K/44O844OV44Kn44Kk44K544Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUGFnZVZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBCYXNlUGFnZU9wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgYmFzZVBhZ2U/OiBuZXcgKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogRnJhbWV3b3JrLlBhZ2VDb25zdHJ1Y3RPcHRpb25zKSA9PiBGcmFtZXdvcmsuUGFnZTsgICAgLy8hPCBQYWdlIOapn+iDveOCkuaPkOS+m+OBmeOCi+WfuuW6leOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXVzZS1iZWZvcmUtZGVjbGFyZSAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFBhZ2VDb250YWluZXJPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgUGFnZUNvbnRhaW5lciDjga7jgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYWdlQ29udGFpbmVyT3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBGcmFtZXdvcmsuTW9kZWwgPSBGcmFtZXdvcmsuTW9kZWw+IGV4dGVuZHMgRnJhbWV3b3JrLlZpZXdPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIG93bmVyOiBQYWdlVmlldztcclxuICAgICAgICAkZWw/OiBKUXVlcnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgUGFnZUNvbnRhaW5lclZpZXdcclxuICAgICAqIEBicmllZiBQYWdlVmlldyDjgajpgKPmkLrlj6/og73jgaog44Kz44Oz44OG44OK44OT44Ol44O844Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlQ29udGFpbmVyVmlldzxUTW9kZWwgZXh0ZW5kcyBGcmFtZXdvcmsuTW9kZWwgPSBGcmFtZXdvcmsuTW9kZWw+IGV4dGVuZHMgRnJhbWV3b3JrLlZpZXc8VE1vZGVsPiB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX293bmVyOiBQYWdlVmlldyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9uczogUGFnZUNvbnRhaW5lck9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5fb3duZXIgPSBvcHRpb25zLm93bmVyO1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy4kZWwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlcyA9ICg8YW55PnRoaXMpLmV2ZW50cyA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudChvcHRpb25zLiRlbCwgZGVsZWdhdGVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBzaG9ydCBjdXQgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEgT3duZXIg5Y+W5b6XXHJcbiAgICAgICAgZ2V0IG93bmVyKCk6IFBhZ2VWaWV3IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qIHRzbGludDplbmFibGU6bm8tdXNlLWJlZm9yZS1kZWNsYXJlICovXHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQYWdlVmlld1xyXG4gICAgICogQGJyaWVmIENEUC5GcmFtZXdvcmsuUGFnZSDjgaggQmFja2JvbmUuVmlldyDjga7kuKHmlrnjga7mqZ/og73jgpLmj5DkvpvjgZnjgovjg5rjg7zjgrjjga7ln7rlupXjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VWaWV3PFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuVmlldzxUTW9kZWw+IGltcGxlbWVudHMgRnJhbWV3b3JrLklQYWdlLCBJU3RhdHVzTWFuYWdlciB7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBfcGFnZU9wdGlvbnM6IFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+ID0gbnVsbDtcclxuICAgICAgICBwcm90ZWN0ZWQgX2Jhc2VQYWdlOiBGcmFtZXdvcmsuUGFnZSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfc3RhdHVzTWdyOiBTdGF0dXNNYW5hZ2VyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB1cmwgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgIFtpbl0g44Oa44O844K4IFVSTFxyXG4gICAgICAgICAqIEBwYXJhbSBpZCAgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgIFtpbl0g44Oa44O844K4IElEXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge1BhZ2VWaWV3Q29uc3RydWN0T3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgaWQ6IHN0cmluZywgb3B0aW9ucz86IFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gUGFnZVZpZXcg6Kit5a6aXHJcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VPcHRpb25zID0gJC5leHRlbmQoe30sIHsgb3duZXI6IHRoaXMgfSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jhc2VQYWdlID0gdGhpcy5fcGFnZU9wdGlvbnMuYmFzZVBhZ2UgPyBuZXcgdGhpcy5fcGFnZU9wdGlvbnMuYmFzZVBhZ2UodXJsLCBpZCwgdGhpcy5fcGFnZU9wdGlvbnMpIDogbmV3IEJhc2VQYWdlKHVybCwgaWQsIHRoaXMuX3BhZ2VPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFN0YXR1c01hbmFnZXJcclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzTWdyID0gbmV3IFN0YXR1c01hbmFnZXIoKTtcclxuICAgICAgICAgICAgLy8gQmFja2JvbmUuVmlldyDnlKjjga7liJ3mnJ/ljJZcclxuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGVzID0gKDxhbnk+dGhpcykuZXZlbnRzID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQodGhpcy4kcGFnZSwgZGVsZWdhdGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSVN0YXR1c01hbmFnZXIg54q25oWL566h55CGXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruOCpOODs+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyB7U3RyaW5nfSBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXR1c0FkZFJlZihzdGF0dXM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNNZ3Iuc3RhdHVzQWRkUmVmKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jg4fjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMge1N0cmluZ30gW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0dXNSZWxlYXNlKHN0YXR1czogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1c01nci5zdGF0dXNSZWxlYXNlKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlh6bnkIbjgrnjgrPjg7zjg5fmr47jgavnirbmhYvlpInmlbDjgpLoqK3lrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMgICB7U3RyaW5nfSAgIFtpbl0g54q25oWL6K2Y5Yil5a2QXHJcbiAgICAgICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn0gW2luXSDlh6bnkIbjgrPjg7zjg6vjg5Djg4Pjgq9cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0dXNTY29wZShzdGF0dXM6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzTWdyLnN0YXR1c1Njb3BlKHN0YXR1cywgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44Gf54q25oWL5Lit44Gn44GC44KL44GL56K66KqNXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdHVzIHtTdHJpbmd9ICAgW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDnirbmhYvlhoUgLyBmYWxzZTog54q25oWL5aSWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNTdGF0dXNJbihzdGF0dXM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzTWdyLmlzU3RhdHVzSW4oc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSVBhZ2Ugc3R1YiBzdHVmZi5cclxuXHJcbiAgICAgICAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLmFjdGl2ZTsgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHVybCgpOiBzdHJpbmcgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLnVybDsgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGlkKCk6IHN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlID8gdGhpcy5fYmFzZVBhZ2UuaWQgOiBudWxsOyB9XHJcbiAgICAgICAgZ2V0ICRwYWdlKCk6IEpRdWVyeSAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLiRwYWdlOyAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0ICRoZWFkZXIoKTogSlF1ZXJ5ICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLiRoZWFkZXI7ICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0ICRmb290ZXIoKTogSlF1ZXJ5ICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLiRmb290ZXI7ICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGludGVudCgpOiBGcmFtZXdvcmsuSW50ZW50ICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLmludGVudDsgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgc2V0IGludGVudChuZXdJbnRlbnQ6IEZyYW1ld29yay5JbnRlbnQpIHsgdGhpcy5fYmFzZVBhZ2UuaW50ZW50ID0gbmV3SW50ZW50OyAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE9yaWVudGF0aW9uIOOBruWkieabtOOCkuWPl+S/oVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG5ld09yaWVudGF0aW9uIHtPcmllbnRhdGlvbn0gW2luXSBuZXcgb3JpZW50YXRpb24gY29kZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBvbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbjogRnJhbWV3b3JrLk9yaWVudGF0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIL1cgQmFjayBCdXR0b24g44OP44Oz44OJ44OpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0gZXZlbnQgb2JqZWN0XHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5pei5a6a44Gu5Yem55CG44KS6KGM44KP44Gq44GEIC8gZmFsc2U6IOaXouWumuOBruWHpueQhuOCkuihjOOBhlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uSGFyZHdhcmVCYWNrQnV0dG9uKGV2ZW50PzogSlF1ZXJ5LkV2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJvdXRlciBcImJlZm9yZSByb3V0ZSBjaGFuZ2VcIiDjg4/jg7Pjg4njg6lcclxuICAgICAgICAgKiDjg5rjg7zjgrjpgbfnp7vnm7TliY3jgavpnZ7lkIzmnJ/lh6bnkIbjgpLooYzjgYbjgZPjgajjgYzlj6/og71cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0lQcm9taXNlQmFzZX0gUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkJlZm9yZVJvdXRlQ2hhbmdlKCk6IElQcm9taXNlQmFzZTxhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5rGO55So44Kz44Oe44Oz44OJ44KS5Y+X5L+hXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0gZXZlbnQgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtICBldmVudCB7a2luZH0gICAgICAgICAgICAgIFtpbl0gY29tbWFuZCBraW5kIHN0cmluZ1xyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaXouWumuOBruWHpueQhuOCkuihjOOCj+OBquOBhCAvIGZhbHNlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgYZcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkNvbW1hbmQoZXZlbnQ/OiBKUXVlcnkuRXZlbnQsIGtpbmQ/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5pyA5Yid44GuIE9uUGFnZUluaXQoKSDjga7jgajjgY3jgavjga7jgb/jgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uSW5pdGlhbGl6ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50KHRoaXMuJHBhZ2UsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VjcmVhdGVcIiAo5penOlwicGFnZWluaXRcIikg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VJbml0KGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNvbnRhaW5lcmhpZGVcIiAo5penOlwicGFnZWhpZGVcIikg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZXJlbW92ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5lbCAgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLiRlbCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IE1vZGVsID0gQ0RQLkZyYW1ld29yay5Nb2RlbDtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZUxpc3RWaWV3XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgUGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIFBhZ2VMaXN0VmlldyDjgbjjga7liJ3mnJ/ljJbmg4XloLHjgpLmoLzntI3jgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgTGlzdFZpZXdPcHRpb25zLCBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgYXV0b0Rlc3RvcnlFbGVtZW50PzogYm9vbGVhbjsgICAgICAgIC8vITwg44Oa44O844K46YG356e75YmN44GrIExpc3QgRWxlbWVudCDjgpLnoLTmo4TjgZnjgovloLTlkIjjga8gdHJ1ZSDjgpLmjIflrppcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQYWdlTGlzdFZpZXdcclxuICAgICAqIEBicmllZiDku67mg7Pjg6rjgrnjg4jjg5Pjg6Xjg7zmqZ/og73jgpLmjIHjgaQgUGFnZVZpZXcg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlTGlzdFZpZXc8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBQYWdlVmlldzxUTW9kZWw+IGltcGxlbWVudHMgSUxpc3RWaWV3IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc2Nyb2xsTWdyOiBTY3JvbGxNYW5hZ2VyID0gbnVsbDsgICAgLy8hPCBzY3JvbGwg44Kz44Ki44Ot44K444OD44KvXHJcbiAgICAgICAgcHJpdmF0ZSBfbmVlZFJlYnVpbGQ6IGJvb2xlYW4gPSBmYWxzZTsgICAgICAgLy8hPCDjg5rjg7zjgrjooajnpLrmmYLjgasgcmVidWlsZCgpIOOCkuOCs+ODvOODq+OBmeOCi+OBn+OCgeOBruWGhemDqOWkieaVsFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHVybCAgICAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgIFtpbl0gcGFnZSB0ZW1wbGF0ZSDjgavkvb/nlKjjgZnjgosgVVJMXHJcbiAgICAgICAgICogQHBhcmFtIGlkICAgICAge1N0cmluZ30gICAgICAgICAgICAgICAgICAgICAgIFtpbl0gcGFnZSDjgavmjK/jgonjgozjgZ8gSURcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7UGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgaWQ6IHN0cmluZywgb3B0aW9ucz86IFBhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcih1cmwsIGlkLCAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICAgICAgYXV0b0Rlc3RvcnlFbGVtZW50OiBmYWxzZSxcclxuICAgICAgICAgICAgfSwgb3B0aW9ucykpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IgPSBuZXcgU2Nyb2xsTWFuYWdlcihvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISByZWJ1aWxkKCkg44Gu44K544Kx44K444Ol44O844Oq44Oz44KwXHJcbiAgICAgICAgcHVibGljIHJlc2VydmVSZWJ1aWxkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9uZWVkUmVidWlsZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBQYWdlVmlld1xyXG5cclxuICAgICAgICAvLyEgT3JpZW50YXRpb24g44Gu5aSJ5pu05qSc55+lXHJcbiAgICAgICAgb25PcmllbnRhdGlvbkNoYW5nZWQobmV3T3JpZW50YXRpb246IEZyYW1ld29yay5PcmllbnRhdGlvbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3Iuc2V0QmFzZUhlaWdodCh0aGlzLmdldFBhZ2VCYXNlSGVpZ2h0KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODmuODvOOCuOmBt+enu+ebtOWJjeOCpOODmeODs+ODiOWHpueQhlxyXG4gICAgICAgIG9uQmVmb3JlUm91dGVDaGFuZ2UoKTogSVByb21pc2VCYXNlPGFueT4ge1xyXG4gICAgICAgICAgICBpZiAoKDxQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4+dGhpcy5fcGFnZU9wdGlvbnMpLmF1dG9EZXN0b3J5RWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIub25CZWZvcmVSb3V0ZUNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICAgIG9uUGFnZUJlZm9yZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuaW5pdGlhbGl6ZSh0aGlzLiRwYWdlLCB0aGlzLmdldFBhZ2VCYXNlSGVpZ2h0KCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGpRTSBldmVudDogXCJwYWdlY29udGFpbmVyc2hvd1wiICjml6c6XCJwYWdlc2hvd1wiKSDjgavlr77lv5xcclxuICAgICAgICBvblBhZ2VTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VTaG93KGV2ZW50LCBkYXRhKTtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldEJhc2VIZWlnaHQodGhpcy5nZXRQYWdlQmFzZUhlaWdodCgpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX25lZWRSZWJ1aWxkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlYnVpbGQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25lZWRSZWJ1aWxkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBqUU0gZXZlbnQ6IFwicGFnZXJlbW92ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgIG9uUGFnZVJlbW92ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZVJlbW92ZShldmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVsZWFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgUHJvZmlsZSDnrqHnkIZcclxuXHJcbiAgICAgICAgLy8hIOWIneacn+WMlua4iOOBv+OBi+WIpOWumlxyXG4gICAgICAgIGlzSW5pdGlhbGl6ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuaXNJbml0aWFsaXplZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODl+ODreODkeODhuOCo+OCkuaMh+WumuOBl+OBpuOAgUxpc3RJdGVtIOOCkueuoeeQhlxyXG4gICAgICAgIGFkZEl0ZW0oXHJcbiAgICAgICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgICAgICBpbml0aWFsaXplcjogbmV3IChvcHRpb25zPzogYW55KSA9PiBCYXNlTGlzdEl0ZW1WaWV3LFxyXG4gICAgICAgICAgICBpbmZvOiBhbnksXHJcbiAgICAgICAgICAgIGluc2VydFRvPzogbnVtYmVyXHJcbiAgICAgICAgICAgICk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9hZGRMaW5lKG5ldyBMaW5lUHJvZmlsZSh0aGlzLl9zY3JvbGxNZ3IsIE1hdGguZmxvb3IoaGVpZ2h0KSwgaW5pdGlhbGl6ZXIsIGluZm8pLCBpbnNlcnRUbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIEl0ZW0g44KS5YmK6ZmkXHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogbnVtYmVyLCBzaXplPzogbnVtYmVyLCBkZWxheT86IG51bWJlcik6IHZvaWQ7XHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogbnVtYmVyW10sIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBhbnksIGFyZzI/OiBudW1iZXIsIGFyZzM/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlbW92ZUl0ZW0oaW5kZXgsIGFyZzIsIGFyZzMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBl+OBnyBJdGVtIOOBq+ioreWumuOBl+OBn+aDheWgseOCkuWPluW+l1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogbnVtYmVyKTogYW55O1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogSlF1ZXJ5LkV2ZW50KTogYW55O1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogYW55KTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRJdGVtSW5mbyh0YXJnZXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCouOCr+ODhuOCo+ODluODmuODvOOCuOOCkuabtOaWsFxyXG4gICAgICAgIHJlZnJlc2goKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5yZWZyZXNoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5pyq44Ki44K144Kk44Oz44Oa44O844K444KS5qeL56+JXHJcbiAgICAgICAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Oa44O844K444Ki44K144Kk44Oz44KS5YaN5qeL5oiQXHJcbiAgICAgICAgcmVidWlsZCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlYnVpbGQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrqHovYTjg4fjg7zjgr/jgpLnoLTmo4RcclxuICAgICAgICByZWxlYXNlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVsZWFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgUHJvZmlsZSBCYWNrdXAgLyBSZXN0b3JlXHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg5Djg4Pjgq/jgqLjg4Pjg5dcclxuICAgICAgICBiYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5iYWNrdXAoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg6rjgrnjg4jjgqJcclxuICAgICAgICByZXN0b3JlKGtleTogc3RyaW5nLCByZWJ1aWxkOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBjb25zdCByZXR2YWwgPSB0aGlzLl9zY3JvbGxNZ3IucmVzdG9yZShrZXksIHJlYnVpbGQpO1xyXG4gICAgICAgICAgICBpZiAocmV0dmFsICYmICFyZWJ1aWxkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2VydmVSZWJ1aWxkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldHZhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7mnInnhKFcclxuICAgICAgICBoYXNCYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5oYXNCYWNrdXAoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7noLTmo4RcclxuICAgICAgICBjbGVhckJhY2t1cChrZXk/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5jbGVhckJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBq+OCouOCr+OCu+OCuVxyXG4gICAgICAgIGdldCBiYWNrdXBEYXRhKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuYmFja3VwRGF0YTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IFNjcm9sbFxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or44Kk44OZ44Oz44OI44OP44Oz44OJ44Op6Kit5a6aL+ino+mZpFxyXG4gICAgICAgIHNldFNjcm9sbEhhbmRsZXIoaGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQsIG9uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zZXRTY3JvbGxIYW5kbGVyKGhhbmRsZXIsIG9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vntYLkuobjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgc2V0U2Nyb2xsU3RvcEhhbmRsZXIoaGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQsIG9uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyLCBvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuZ2V0U2Nyb2xsUG9zKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44Gu5pyA5aSn5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zTWF4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuZ2V0U2Nyb2xsUG9zTWF4KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5oyH5a6aXHJcbiAgICAgICAgc2Nyb2xsVG8ocG9zOiBudW1iZXIsIGFuaW1hdGU/OiBib29sZWFuLCB0aW1lPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zY3JvbGxUbyhwb3MsIGFuaW1hdGUsIHRpbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBleOCjOOBnyBMaXN0SXRlbVZpZXcg44Gu6KGo56S644KS5L+d6Ki8XHJcbiAgICAgICAgZW5zdXJlVmlzaWJsZShpbmRleDogbnVtYmVyLCBvcHRpb25zPzogRW5zdXJlVmlzaWJsZU9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLmVuc3VyZVZpc2libGUoaW5kZXgsIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgUHJvcGVydGllc1xyXG5cclxuICAgICAgICAvLyEgY29yZSBmcmFtZXdvcmsgYWNjZXNzXHJcbiAgICAgICAgZ2V0IGNvcmUoKTogSUxpc3RWaWV3RnJhbWV3b3JrIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1ncjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IEludGVybmFsIEkvRlxyXG5cclxuICAgICAgICAvLyEg55m76YyyIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgotcclxuICAgICAgICBfYWRkTGluZShfbGluZTogYW55LCBpbnNlcnRUbz86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuX2FkZExpbmUoX2xpbmUsIGluc2VydFRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBtZXRob2Q6XHJcblxyXG4gICAgICAgIC8vISDjg5rjg7zjgrjjga7ln7rmupblgKTjgpLlj5blvpdcclxuICAgICAgICBwcml2YXRlIGdldFBhZ2VCYXNlSGVpZ2h0KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiAkKHdpbmRvdykuaGVpZ2h0KCkgLSBwYXJzZUludCh0aGlzLiRwYWdlLmNzcyhcInBhZGRpbmctdG9wXCIpLCAxMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBNb2RlbCA9IENEUC5GcmFtZXdvcmsuTW9kZWw7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlBhZ2VFeHBhbmRhYmxlTGlzdFZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VFeHBhbmRhYmxlTGlzdFZpZXdcclxuICAgICAqIEBicmllZiDplovplonjg6rjgrnjg4jjg5Pjg6Xjg7zmqZ/og73jgpLmjIHjgaQgUGFnZVZpZXcg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlRXhwYW5kYWJsZUxpc3RWaWV3PFRNb2RlbCBleHRlbmRzIE1vZGVsID0gTW9kZWw+IGV4dGVuZHMgUGFnZUxpc3RWaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJRXhwYW5kYWJsZUxpc3RWaWV3IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfZXhwYW5kTWFuYWdlcjogRXhwYW5kTWFuYWdlciA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdXJsICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIHRlbXBsYXRlIOOBq+S9v+eUqOOBmeOCiyBVUkxcclxuICAgICAgICAgKiBAcGFyYW0gaWQgICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIOOBq+aMr+OCieOCjOOBnyBJRFxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogUGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHVybCwgaWQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyID0gbmV3IEV4cGFuZE1hbmFnZXIodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElFeHBhbmRhYmxlTGlzdFZpZXdcclxuXHJcbiAgICAgICAgLy8hIOaWsOimjyBHcm91cFByb2ZpbGUg44KS5L2c5oiQXHJcbiAgICAgICAgbmV3R3JvdXAoaWQ/OiBzdHJpbmcpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5uZXdHcm91cChpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg55m76Yyy5riI44G/IEdyb3VwIOOCkuWPluW+l1xyXG4gICAgICAgIGdldEdyb3VwKGlkOiBzdHJpbmcpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5nZXRHcm91cChpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg56ysMemajuWxpOOBriBHcm91cCDnmbvpjLJcclxuICAgICAgICByZWdpc3RlclRvcEdyb3VwKHRvcEdyb3VwOiBHcm91cFByb2ZpbGUpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5yZWdpc3RlclRvcEdyb3VwKHRvcEdyb3VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrKwx6ZqO5bGk44GuIEdyb3VwIOOCkuWPluW+l1xyXG4gICAgICAgIGdldFRvcEdyb3VwcygpOiBHcm91cFByb2ZpbGVbXSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmdldFRvcEdyb3VwcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOBmeOBueOBpuOBruOCsOODq+ODvOODl+OCkuWxlemWiyAoMemajuWxpClcclxuICAgICAgICBleHBhbmRBbGwoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIuZXhwYW5kQWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5Y+O5p2fICgx6ZqO5bGkKVxyXG4gICAgICAgIGNvbGxhcHNlQWxsKGRlbGF5PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIuY29sbGFwc2VBbGwoZGVsYXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWxlemWi+S4reOBi+WIpOWumlxyXG4gICAgICAgIGlzRXhwYW5kaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5pc0V4cGFuZGluZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWPjuadn+S4reOBi+WIpOWumlxyXG4gICAgICAgIGlzQ29sbGFwc2luZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuaXNDb2xsYXBzaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg6ZaL6ZaJ5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNTd2l0Y2hpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmlzU3dpdGNoaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgbGF5b3V0IGtleSDjgpLlj5blvpdcclxuICAgICAgICBnZXQgbGF5b3V0S2V5KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmxheW91dEtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBsYXlvdXQga2V5IOOCkuioreWumlxyXG4gICAgICAgIHNldCBsYXlvdXRLZXkoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5sYXlvdXRLZXkgPSBrZXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBQYWdlTGlzdFZpZXdcclxuXHJcbiAgICAgICAgLy8hIOODh+ODvOOCv+OCkuegtOajhFxyXG4gICAgICAgIHJlbGVhc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44OQ44OD44Kv44Ki44OD44OXXHJcbiAgICAgICAgYmFja3VwKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODquOCueODiOOColxyXG4gICAgICAgIHJlc3RvcmUoa2V5OiBzdHJpbmcsIHJlYnVpbGQ6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlc3RvcmUoa2V5LCByZWJ1aWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyoqXHJcbiAqIGpRdWVyeSBwbHVnaW4gZGVmaW5pdGlvblxyXG4gKi9cclxuaW50ZXJmYWNlIEpRdWVyeSB7XHJcbiAgICByaXBwbGUob3B0aW9ucz86IENEUC5VSS5Eb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5O1xyXG59XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgaW1wb3J0IEZyYW1ld29yayA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgLy8hIGpRdWVyeSBwbHVnaW5cclxuICAgICQuZm4ucmlwcGxlID0gZnVuY3Rpb24gKG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKSB7XHJcbiAgICAgICAgY29uc3QgJGVsID0gJCh0aGlzKTtcclxuICAgICAgICByZXR1cm4gJGVsLm9uKEZyYW1ld29yay5QYXRjaC5zX3ZjbGlja0V2ZW50LCBmdW5jdGlvbiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkge1xyXG4gICAgICAgICAgICBjb25zdCBzdXJmYWNlID0gJCh0aGlzKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZSBzdXJmYWNlIGlmIGl0IGRvZXNuJ3QgZXhpc3RcclxuICAgICAgICAgICAgaWYgKHN1cmZhY2UuZmluZChcIi51aS1yaXBwbGUtaW5rXCIpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgc3VyZmFjZS5wcmVwZW5kKFwiPGRpdiBjbGFzcz0ndWktcmlwcGxlLWluayc+PC9kaXY+XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsZXQgaW5rID0gc3VyZmFjZS5maW5kKFwiLnVpLXJpcHBsZS1pbmtcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBzdG9wIHRoZSBwcmV2aW91cyBhbmltYXRpb25cclxuICAgICAgICAgICAgaW5rLnJlbW92ZUNsYXNzKFwidWktcmlwcGxlLWFuaW1hdGVcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBpbmsgc2l6ZTpcclxuICAgICAgICAgICAgaWYgKCFpbmsuaGVpZ2h0KCkgJiYgIWluay53aWR0aCgpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkID0gTWF0aC5tYXgoc3VyZmFjZS5vdXRlcldpZHRoKCksIHN1cmZhY2Uub3V0ZXJIZWlnaHQoKSk7XHJcbiAgICAgICAgICAgICAgICBpbmsuY3NzKHsgaGVpZ2h0OiBkLCB3aWR0aDogZCB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgeCA9IGV2ZW50LnBhZ2VYIC0gc3VyZmFjZS5vZmZzZXQoKS5sZWZ0IC0gKGluay53aWR0aCgpIC8gMik7XHJcbiAgICAgICAgICAgIGNvbnN0IHkgPSBldmVudC5wYWdlWSAtIHN1cmZhY2Uub2Zmc2V0KCkudG9wIC0gKGluay5oZWlnaHQoKSAvIDIpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmlwcGxlQ29sb3IgPSBzdXJmYWNlLmRhdGEoXCJyaXBwbGUtY29sb3JcIik7XHJcblxyXG4gICAgICAgICAgICAvLyBhbmltYXRpb24gZW5kIGhhbmRsZXJcclxuICAgICAgICAgICAgY29uc3QgQU5JTUFUSU9OX0VORF9FVkVOVCA9IFwiYW5pbWF0aW9uZW5kIHdlYmtpdEFuaW1hdGlvbkVuZFwiO1xyXG4gICAgICAgICAgICBpbmsub24oQU5JTUFUSU9OX0VORF9FVkVOVCwgZnVuY3Rpb24gKGV2OiBKUXVlcnkuRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGluay5vZmYoKTtcclxuICAgICAgICAgICAgICAgIGluay5yZW1vdmVDbGFzcyhcInVpLXJpcHBsZS1hbmltYXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgaW5rID0gbnVsbDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBzZXQgdGhlIHBvc2l0aW9uIGFuZCBhZGQgY2xhc3MgLmFuaW1hdGVcclxuICAgICAgICAgICAgaW5rLmNzcyh7XHJcbiAgICAgICAgICAgICAgICB0b3A6IHkgKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICBsZWZ0OiB4ICsgXCJweFwiLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZDogcmlwcGxlQ29sb3JcclxuICAgICAgICAgICAgfSkuYWRkQ2xhc3MoXCJ1aS1yaXBwbGUtYW5pbWF0ZVwiKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRlcmlhbCBEZXNpZ24gUmlwcGxlIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgY29uc3QgTk9fUklQUExFX0NMQVNTID0gW1xyXG4gICAgICAgICAgICBcIi51aS1yaXBwbGUtbm9uZVwiLFxyXG4gICAgICAgICAgICBcIi51aS1mbGlwc3dpdGNoLW9uXCIsXHJcbiAgICAgICAgICAgIFwiLnVpLXNsaWRlci1oYW5kbGVcIixcclxuICAgICAgICAgICAgXCIudWktaW5wdXQtY2xlYXJcIixcclxuICAgICAgICBdO1xyXG5cclxuICAgICAgICBsZXQgc2VsZWN0b3IgPSBcIi51aS1idG5cIjtcclxuICAgICAgICBpZiAoJHVpLmhhc0NsYXNzKFwidWktcGFnZVwiKSkge1xyXG4gICAgICAgICAgICBzZWxlY3RvciA9IFwiLnVpLWNvbnRlbnQgLnVpLWJ0blwiOyAvLyBoZWFkZXIg44Gv6Ieq5YuVIHJpcHBsZSDljJblr77osaHlpJZcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICR1aS5maW5kKHNlbGVjdG9yKVxyXG4gICAgICAgICAgICAuZmlsdGVyKChpbmRleCwgZWxlbSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGVsZW0gPSAkKGVsZW0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKCRlbGVtLmlzKE5PX1JJUFBMRV9DTEFTUy5qb2luKFwiLFwiKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuYWRkQ2xhc3MoXCJ1aS1yaXBwbGVcIik7XHJcblxyXG4gICAgICAgIC8vIHJpcHBsaWZ5XHJcbiAgICAgICAgJHVpLmZpbmQoXCIudWktcmlwcGxlXCIpLnJpcHBsZSgpO1xyXG4gICAgICAgIHJldHVybiAkdWk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55m76YyyXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGFwcGx5RG9tRXh0ZW5zaW9uKTtcclxufVxyXG4iLCIvKipcclxuICogalF1ZXJ5IHBsdWdpbiBkZWZpbml0aW9uXHJcbiAqL1xyXG5pbnRlcmZhY2UgSlF1ZXJ5IHtcclxuICAgIHNwaW5uZXIob3B0aW9ucz86IENEUC5VSS5Eb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5O1xyXG59XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgaW1wb3J0IFRlbXBsYXRlID0gQ0RQLlRvb2xzLlRlbXBsYXRlO1xyXG4gICAgaW1wb3J0IEpTVCAgICAgID0gQ0RQLlRvb2xzLkpTVDtcclxuXHJcbiAgICBsZXQgX3RlbXBsYXRlOiBKU1Q7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXRlcmlhbCBEZXNpZ24gU3Bpbm5lciDmi6HlvLVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICAgICAgICR0YXJnZXQgICBbaW5dIOaknOe0ouWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbk9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcHBseURvbUV4dGVuc2lvbigkdGFyZ2V0OiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBpZiAoIV90ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICBfdGVtcGxhdGUgPSBUZW1wbGF0ZS5nZXRKU1QoYFxyXG4gICAgICAgICAgICAgICAgPHNjcmlwdCB0eXBlPVwidGV4dC90ZW1wbGF0ZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1iYXNlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyLWdhcFwiIHt7Ym9yZGVyVG9wfX0+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyLWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXItaGFsZi1jaXJjbGVcIiB7e2JvcmRlcn19Pjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lci1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lci1oYWxmLWNpcmNsZVwiIHt7Ym9yZGVyfX0+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9zY3JpcHQ+XHJcbiAgICAgICAgICAgIGApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbWFrZVRlbXBsYXRlUGFyYW0gPSAoY29sb3I6IHN0cmluZyk6IE9iamVjdCA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBib3JkZXJUb3A6IFwic3R5bGU9Ym9yZGVyLXRvcC1jb2xvcjpcIiArIGNvbG9yICsgXCI7XCIsXHJcbiAgICAgICAgICAgICAgICBib3JkZXI6IFwic3R5bGU9Ym9yZGVyLWNvbG9yOlwiICsgY29sb3IgKyBcIjtcIixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBzcGlubmVyaWZ5ID0gKGVsZW06IEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJGVsZW0gPSAkKGVsZW0pO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvciA9ICRlbGVtLmRhdGEoXCJzcGlubmVyLWNvbG9yXCIpO1xyXG4gICAgICAgICAgICBsZXQgcGFyYW0gPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAoY29sb3IpIHtcclxuICAgICAgICAgICAgICAgICRlbGVtLmNzcyh7IFwiYmFja2dyb3VuZC1jb2xvclwiOiBjb2xvciB9KTtcclxuICAgICAgICAgICAgICAgIHBhcmFtID0gbWFrZVRlbXBsYXRlUGFyYW0oY29sb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICRlbGVtLmFwcGVuZChfdGVtcGxhdGUocGFyYW0pKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkdGFyZ2V0LmZpbmQoXCIudWktc3Bpbm5lciwgLnVpLWljb24tbG9hZGluZ1wiKVxyXG4gICAgICAgICAgICAuZWFjaCgoaW5kZXg6IG51bWJlciwgZWxlbTogRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3Bpbm5lcmlmeShlbGVtKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAkdGFyZ2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vISBqUXVlcnkgcGx1Z2luXHJcbiAgICAkLmZuLnNwaW5uZXIgPSBmdW5jdGlvbiAob3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpIHtcclxuICAgICAgICByZXR1cm4gYXBwbHlEb21FeHRlbnNpb24oJCh0aGlzKSwgb3B0aW9ucyk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIOeZu+mMslxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3RlckRvbUV4dGVuc2lvbihhcHBseURvbUV4dGVuc2lvbik7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSS5FeHRlbnNpb24ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGV4dCBJbnB1dCDnlKggRmxvYXRpbmcgTGFiZWwg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCB1cGRhdGUgPSAoZWxlbTogRWxlbWVudCwgZmxvYXRpbmc6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJGVsZW0gPSAkKGVsZW0pO1xyXG4gICAgICAgICAgICBpZiAoZmxvYXRpbmcpIHtcclxuICAgICAgICAgICAgICAgICRlbGVtLmFkZENsYXNzKFwidWktZmxvYXQtbGFiZWwtZmxvYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkZWxlbS5yZW1vdmVDbGFzcyhcInVpLWZsb2F0LWxhYmVsLWZsb2F0aW5nXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgZmxvYXRpbmdpZnkgPSAoZWxlbTogRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9ICQoZWxlbSkuYXR0cihcImZvclwiKTtcclxuICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gJHVpLmZpbmQoXCIjXCIgKyBpZCk7XHJcbiAgICAgICAgICAgIGlmIChcInNlYXJjaFwiID09PSAkaW5wdXQuanFtRGF0YShcInR5cGVcIikpIHtcclxuICAgICAgICAgICAgICAgICQoZWxlbSkuYWRkQ2xhc3MoXCJ1aS1mbG9hdC1sYWJlbC1oYXMtaWNvblwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB1cGRhdGUoZWxlbSwgISEkaW5wdXQudmFsKCkpO1xyXG4gICAgICAgICAgICAkaW5wdXQub24oXCJrZXl1cCBjaGFuZ2UgaW5wdXQgZm9jdXMgYmx1ciBjdXQgcGFzdGVcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZShlbGVtLCAhISQoZXZlbnQudGFyZ2V0KS52YWwoKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICR1aS5maW5kKFwibGFiZWwudWktZmxvYXQtbGFiZWwsIC51aS1mbG9hdC1sYWJlbCBsYWJlbFwiKVxyXG4gICAgICAgICAgICAuZWFjaCgoaW5kZXg6IG51bWJlciwgZWxlbTogRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZmxvYXRpbmdpZnkoZWxlbSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gJHVpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeZu+mMslxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3RlckRvbUV4dGVuc2lvbihhcHBseURvbUV4dGVuc2lvbik7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSS5FeHRlbnNpb24ge1xyXG5cclxuICAgIGltcG9ydCBGcmFtZXdvcmsgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogalF1ZXJ5IE1vYmlsZSBGbGlwIFN3aXRjaCDmi6HlvLVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICAgICAgICR1aSAgICAgICBbaW5dIOaknOe0ouWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbk9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcHBseURvbUV4dGVuc2lvbigkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICogZmxpcHN3aXRjaCDjgavntJDjgaXjgY8gbGFiZWwg44GvIE9TIOOBq+OCiOOBo+OBpiBldmVudCDnmbrooYzlvaLlvI/jgYznlbDjgarjgovjgZ/jgoHjg5Xjg4Pjgq/jgZfjgabni6zoh6rjgqTjg5njg7Pjg4jjgaflr77lv5zjgZnjgosuXHJcbiAgICAgICAgICog44G+44GfIGZsaXBzd2l0Y2gg44Gv5YaF6YOo44GnIGNsaWNrIOOCkueZuuihjOOBl+OBpuOBhOOCi+OBjOOAgXZjbGljayDjgavlpInmm7TjgZnjgosuXHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIGNvbnN0IF9nZXRBbGxTd2l0Y2hlcyA9ICgpOiBKUXVlcnkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gJHVpLmZpbmQoXCIudWktZmxpcHN3aXRjaFwiKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfZ2V0SW5wdXRGcm9tU3dpdGNoID0gKCRzd2l0Y2g6IEpRdWVyeSk6IEpRdWVyeSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9ICRzd2l0Y2guZmluZChcImlucHV0XCIpO1xyXG4gICAgICAgICAgICBpZiAoJGlucHV0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRpbnB1dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCAkc2VsZWN0ID0gJHN3aXRjaC5maW5kKFwic2VsZWN0XCIpO1xyXG4gICAgICAgICAgICBpZiAoJHNlbGVjdC5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkc2VsZWN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IF9jaGFuZ2UgPSAoJGlucHV0OiBKUXVlcnksIHRvOiBib29sZWFuKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGlmICgkaW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChcIklOUFVUXCIgPT09ICRpbnB1dFswXS5ub2RlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRpbnB1dC5wcm9wKFwiY2hlY2tlZFwiLCB0bykuZmxpcHN3aXRjaChcInJlZnJlc2hcIik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiU0VMRUNUXCIgPT09ICRpbnB1dFswXS5ub2RlTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRpbnB1dC52YWwodG8gPyBcIm9uXCIgOiBcIm9mZlwiKS5mbGlwc3dpdGNoKFwicmVmcmVzaFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IF9nZXRMYWJlbHNGcm9tU3dpdGNoID0gKCRzd2l0Y2g6IEpRdWVyeSk6IEpRdWVyeSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRpbnB1dCA9IF9nZXRJbnB1dEZyb21Td2l0Y2goJHN3aXRjaCk7XHJcbiAgICAgICAgICAgIGlmICgkaW5wdXQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxhYmVscyA9ICg8YW55PiRpbnB1dFswXSkubGFiZWxzO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxhYmVscykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkKGxhYmVscyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICQoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBfZ2V0U3dpdGNoRnJvbUxhYmVsID0gKCRsYWJlbDogSlF1ZXJ5KTogSlF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmFtZSA9ICRsYWJlbC5hdHRyKFwiZm9yXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gX2dldEFsbFN3aXRjaGVzKCkuZmluZChcIltuYW1lPSdcIiArIG5hbWUgKyBcIiddXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIF9nZXRBbGxTd2l0Y2hlcygpXHJcbiAgICAgICAgICAgIC5vbihcInZjbGljayBfY2hhbmdlX2ZsaXBzd2ljaFwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJHN3aXRjaCA9ICQoZXZlbnQuY3VycmVudFRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkdGFyZ2V0ID0gJChldmVudC50YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gX2dldElucHV0RnJvbVN3aXRjaCgkc3dpdGNoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoYW5nZVRvID0gISRzd2l0Y2guaGFzQ2xhc3MoXCJ1aS1mbGlwc3dpdGNoLWFjdGl2ZVwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoJHRhcmdldC5oYXNDbGFzcyhcInVpLWZsaXBzd2l0Y2gtaW5wdXRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICBfY2hhbmdlKCRpbnB1dCwgY2hhbmdlVG8pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkdGFyZ2V0Lmhhc0NsYXNzKFwidWktZmxpcHN3aXRjaC1vblwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChGcmFtZXdvcmsuUGxhdGZvcm0uTW9iaWxlICYmIEZyYW1ld29yay5QYXRjaC5pc1N1cHBvcnRlZFZjbGljaygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF9jaGFuZ2UoJGlucHV0LCBjaGFuZ2VUbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZWFjaCgoaW5kZXg6IG51bWJlciwgZmxpcHN3aXRjaDogRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgX2dldExhYmVsc0Zyb21Td2l0Y2goJChmbGlwc3dpdGNoKSlcclxuICAgICAgICAgICAgICAgICAgICAub24oXCJ2Y2xpY2tcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgJHN3aXRjaCA9IF9nZXRTd2l0Y2hGcm9tTGFiZWwoJChldmVudC50YXJnZXQpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEkc3dpdGNoLnBhcmVudCgpLmhhc0NsYXNzKFwidWktc3RhdGUtZGlzYWJsZWRcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzd2l0Y2gudHJpZ2dlcihcIl9jaGFuZ2VfZmxpcHN3aWNoXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gJHVpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeZu+mMslxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3RlckRvbUV4dGVuc2lvbihhcHBseURvbUV4dGVuc2lvbik7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSS5FeHRlbnNpb24ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogalF1ZXJ5IE1vYmlsZSBTbGlkZXIg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICAkdWkuZmluZChcIi51aS1zbGlkZXItaW5wdXRcIilcclxuICAgICAgICAgICAgLm9uKFwic2xpZGVzdG9wXCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkaGFuZGxlcyA9ICQoZXZlbnQuY3VycmVudFRhcmdldClcclxuICAgICAgICAgICAgICAgICAgICAucGFyZW50KClcclxuICAgICAgICAgICAgICAgICAgICAuZmluZChcIi51aS1zbGlkZXItaGFuZGxlXCIpO1xyXG4gICAgICAgICAgICAgICAgJGhhbmRsZXMuYmx1cigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gJHVpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOeZu+mMslxyXG4gICAgRXh0ZW5zaW9uTWFuYWdlci5yZWdpc3RlckRvbUV4dGVuc2lvbihhcHBseURvbUV4dGVuc2lvbik7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSS5FeHRlbnNpb24ge1xyXG5cclxuICAgIC8vISBpU2Nyb2xsLmNsaWNrIHBhdGNoXHJcbiAgICBjb25zdCBwYXRjaF9JU2Nyb2xsX3V0aWxzX2NsaWNrID0gZnVuY3Rpb24gKGV2ZW50OiBFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldDogYW55ID0gZXZlbnQudGFyZ2V0O1xyXG4gICAgICAgIGNvbnN0IGU6IGFueSA9IGV2ZW50O1xyXG4gICAgICAgIGxldCBldjogTW91c2VFdmVudDtcclxuXHJcbiAgICAgICAgLy8gW0NEUCBtb2RpZmllZF06IHNldCB0YXJnZXQuY2xpZW50WC5cclxuICAgICAgICBpZiAobnVsbCA9PSB0YXJnZXQuY2xpZW50WCB8fCBudWxsID09IHRhcmdldC5jbGllbnRZKSB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IGUucGFnZVggJiYgbnVsbCAhPSBlLnBhZ2VZKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xpZW50WCA9IGUucGFnZVg7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xpZW50WSA9IGUucGFnZVk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzWzBdKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xpZW50WCA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVg7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuY2xpZW50WSA9IGUuY2hhbmdlZFRvdWNoZXNbMF0ucGFnZVk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghKC8oU0VMRUNUfElOUFVUfFRFWFRBUkVBKS9pKS50ZXN0KHRhcmdldC50YWdOYW1lKSkge1xyXG4gICAgICAgICAgICBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiTW91c2VFdmVudHNcIik7XHJcbiAgICAgICAgICAgIGV2LmluaXRNb3VzZUV2ZW50KFwiY2xpY2tcIiwgdHJ1ZSwgdHJ1ZSwgZS52aWV3LCAxLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnNjcmVlblgsIHRhcmdldC5zY3JlZW5ZLCB0YXJnZXQuY2xpZW50WCwgdGFyZ2V0LmNsaWVudFksXHJcbiAgICAgICAgICAgICAgICBlLmN0cmxLZXksIGUuYWx0S2V5LCBlLnNoaWZ0S2V5LCBlLm1ldGFLZXksXHJcbiAgICAgICAgICAgICAgICAwLCBudWxsKTtcclxuXHJcbiAgICAgICAgICAgICg8YW55PmV2KS5fY29uc3RydWN0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChldik7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBsZXQgc19hcHBsaWVkID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpU2Nyb2xsIFBhdGNoIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5UGF0Y2goJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBpZiAoIXNfYXBwbGllZCAmJiBnbG9iYWwuSVNjcm9sbCAmJiBnbG9iYWwuSVNjcm9sbC51dGlscykge1xyXG4gICAgICAgICAgICBnbG9iYWwuSVNjcm9sbC51dGlscy5jbGljayA9IHBhdGNoX0lTY3JvbGxfdXRpbHNfY2xpY2s7XHJcbiAgICAgICAgICAgIHNfYXBwbGllZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkdWk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55m76YyyXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGFwcGx5UGF0Y2gpO1xyXG59XHJcbiIsImRlY2xhcmUgbW9kdWxlIFwiY2RwLnVpLmpxbVwiIHtcclxuICAgIGNvbnN0IFVJOiB0eXBlb2YgQ0RQLlVJO1xyXG4gICAgZXhwb3J0ID0gVUk7XHJcbn1cclxuIl19