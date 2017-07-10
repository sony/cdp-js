/*!
 * cdp.ui.jqm.js 2.0.0
 *
 * Date: 2017-07-10T11:08:32.633Z
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
                if (null != BaseHeaderView.s_$headerBase) {
                    BaseHeaderView.s_refCount--;
                    if (0 === BaseHeaderView.s_refCount) {
                        BaseHeaderView.s_$headerBase.remove();
                        BaseHeaderView.s_$headerBase = null;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVUkvanFtL1RoZW1lLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uTWFuYWdlci50cyIsImNkcDovLy9DRFAvVUkvanFtL1RvYXN0LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRGlhbG9nQ29tbW9ucy50cyIsImNkcDovLy9DRFAvVUkvanFtL0Jhc2VIZWFkZXJWaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vQmFzZVBhZ2UudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9QYWdlVmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1BhZ2VMaXN0Vmlldy50cyIsImNkcDovLy9DRFAvVUkvanFtL1BhZ2VFeHBhbmRhYmxlTGlzdFZpZXcudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vUmlwcGxlLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL1NwaW5uZXIudHMiLCJjZHA6Ly8vQ0RQL1VJL2pxbS9FeHRlbnNpb24vRmxvYXRMYWJlbC50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9GbGlwU3dpdGNoLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vRXh0ZW5zaW9uL1NsaWRlci50cyIsImNkcDovLy9DRFAvVUkvanFtL0V4dGVuc2lvbi9JU2Nyb2xsLnRzIiwiY2RwOi8vL0NEUC9VSS9qcW0vSW50ZXJmYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0FxTVo7QUFyTUQsV0FBVSxHQUFHO0lBQUMsTUFBRSxDQXFNZjtJQXJNYSxhQUFFO1FBRVosSUFBTyxNQUFNLEdBQVMsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUNqQyxJQUFPLFNBQVMsR0FBTSxHQUFHLENBQUMsU0FBUyxDQUFDO1FBbUJwQyw4R0FBOEc7UUFFOUc7OztXQUdHO1FBQ0g7WUFBQTtZQWdKQSxDQUFDO1lBekhHLHVFQUF1RTtZQUN2RSx5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TUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNmLENBQUM7WUFFRCxLQUFLO1lBQ0wsbUJBQWdCLENBQUMsb0JBQW9CLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEQsQ0FBQyxFQWpEZ0IsU0FBUyxHQUFULFlBQVMsS0FBVCxZQUFTLFFBaUR6QjtJQUFELENBQUMsRUFqRGEsRUFBRSxHQUFGLE1BQUUsS0FBRixNQUFFLFFBaURmO0FBQUQsQ0FBQyxFQWpEUyxHQUFHLEtBQUgsR0FBRyxRQWlEWiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBDb25maWcgICAgICAgPSBDRFAuQ29uZmlnO1xyXG4gICAgaW1wb3J0IEZyYW1ld29yayAgICA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFRyYW5zaXRpb25NYXBcclxuICAgICAqIEBicmllZiDjg4jjg6njg7Pjgrjjgrfjg6fjg7Pjg57jg4Pjg5dcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQbGF0Zm9ybVRyYW5zaXRpb24ge1xyXG4gICAgICAgIFtwbGF0Zm9ybTogc3RyaW5nXTogc3RyaW5nOyAgICAgLy8hPCBleCkgaW9zOiBcInNsaWRlXCJcclxuICAgICAgICBmYWxsYmFjazogc3RyaW5nOyAgICAgICAgICAgICAgIC8vITwgZmFsbGJhY2sgdHJhbnNpdGlvbiBwcm9wXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFRyYW5zaXRpb25NYXBcclxuICAgICAqIEBicmllZiDjg4jjg6njg7Pjgrjjgrfjg6fjg7Pjg57jg4Pjg5dcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBUcmFuc2l0aW9uTWFwIHtcclxuICAgICAgICBbdHJhbnNpdGlvbk5hbWU6IHN0cmluZ106IFBsYXRmb3JtVHJhbnNpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFRoZW1lXHJcbiAgICAgKiBAYnJpZWYgVUkgVGhlbWUg6Kit5a6a44KS6KGM44GG44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBUaGVtZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfcGxhdGZvcm1zOiBzdHJpbmdbXSA9IFtcImlvc1wiLCBcImFuZHJvaWRcIl07XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19wYWdlVHJhbnNpdGlvbk1hcDogVHJhbnNpdGlvbk1hcCA9IHtcclxuICAgICAgICAgICAgXCJwbGF0Zm9ybS1kZWZhdWx0XCI6IHtcclxuICAgICAgICAgICAgICAgIGlvczogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICAgICAgYW5kcm9pZDogXCJmbG9hdHVwXCIsXHJcbiAgICAgICAgICAgICAgICBmYWxsYmFjazogXCJzbGlkZVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcInBsYXRmb3JtLWFsdGVybmF0aXZlXCI6IHtcclxuICAgICAgICAgICAgICAgIGlvczogXCJzbGlkZXVwXCIsXHJcbiAgICAgICAgICAgICAgICBhbmRyb2lkOiBcImZsb2F0dXBcIixcclxuICAgICAgICAgICAgICAgIGZhbGxiYWNrOiBcInNsaWRldXBcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfZGlhbG9nVHJhbnNpdGlvbk1hcDogVHJhbnNpdGlvbk1hcCA9IHtcclxuICAgICAgICAgICAgXCJwbGF0Zm9ybS1kZWZhdWx0XCI6IHtcclxuICAgICAgICAgICAgICAgIGlvczogXCJwb3B6b29tXCIsXHJcbiAgICAgICAgICAgICAgICBhbmRyb2lkOiBcImNyb3Nzem9vbVwiLFxyXG4gICAgICAgICAgICAgICAgZmFsbGJhY2s6IFwibm9uZVwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RzOlxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnj77lnKjmjIflrprjgZXjgozjgabjgYTjgosgVUkgUGxhdGZvcm0g44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IGV4KSBcImlvc1wiXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRDdXJyZW50VUlQbGF0Zm9ybSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCAkaHRtcyA9ICQoXCJodG1sXCIpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IHRoaXMuc19wbGF0Zm9ybXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGh0bXMuaGFzQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1cIiArIHRoaXMuc19wbGF0Zm9ybXNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc19wbGF0Zm9ybXNbaV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBVSSBQbGF0Zm9ybSDjgpLoqK3lrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30gdHJ1ZTog5oiQ5YqfIC8gZmFsc2U6IOWkseaVl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2V0Q3VycmVudFVJUGxhdGZvcm0ocGxhdGZvcm06IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBwbGF0Zm9ybSB8fCB0aGlzLnNfcGxhdGZvcm1zLmluZGV4T2YocGxhdGZvcm0pID49IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRodG1zID0gJChcImh0bWxcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNfcGxhdGZvcm1zLmZvckVhY2goKHRhcmdldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICRodG1zLnJlbW92ZUNsYXNzKFwidWktcGxhdGZvcm0tXCIgKyB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGxhdGZvcm0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkaHRtcy5hZGRDbGFzcyhcInVpLXBsYXRmb3JtLVwiICsgcGxhdGZvcm0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOePvuWcqOOBriBQbGF0Zm9ybSDjgpLliKTlrprjgZfmnIDpganjgaogcGxhdGZvcm0g44KS6Ieq5YuV5rG65a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IGV4KSBcImlvc1wiXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkZXRlY3RVSVBsYXRmb3JtKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBwbGF0Zm9ybSDjga7oqK3lrppcclxuICAgICAgICAgICAgaWYgKEZyYW1ld29yay5QbGF0Zm9ybS5pT1MpIHtcclxuICAgICAgICAgICAgICAgICQoXCJodG1sXCIpLmFkZENsYXNzKFwidWktcGxhdGZvcm0taW9zXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJChcImh0bWxcIikuYWRkQ2xhc3MoXCJ1aS1wbGF0Zm9ybS1hbmRyb2lkXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIFBDIOODh+ODkOODg+OCsOeSsOWig+OBp+OBr+OCueOCr+ODreODvOODq+ODkOODvOOCkuihqOekulxyXG4gICAgICAgICAgICBpZiAoQ29uZmlnLkRFQlVHICYmICFGcmFtZXdvcmsuUGxhdGZvcm0uTW9iaWxlKSB7XHJcbiAgICAgICAgICAgICAgICAkKFwiYm9keVwiKS5jc3MoXCJvdmVyZmxvdy15XCIsIFwic2Nyb2xsXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwbGF0Zm9ybSDjgpLphY3liJfjgafoqK3lrppcclxuICAgICAgICAgKiDkuIrmm7jjgY3jgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7U3RyaW5nW119IHBsYXRmb3JtcyBbaW5dIE9TIGV4KTogW1wiaW9zXCIsIFwiYW5kcm9pZFwiXVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2V0VUlQbGF0Zm9ybXMocGxhdGZvcm1zOiBzdHJpbmdbXSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAocGxhdGZvcm1zKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNfcGxhdGZvcm1zID0gcGxhdGZvcm1zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwYWdlIHRyYW5zaXRpb24g44KS6Kit5a6aXHJcbiAgICAgICAgICog5LiK5pu444GN44GV44KM44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge1RyYW5zaXRpb25NYXB9IG1hcCBbaW5dIFRyYW5zaXRpb25NYXAg44KS5oyH5a6aXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXRQYWdlVHJhbnNpdGlvbk1hcChtYXA6IFRyYW5zaXRpb25NYXApOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG1hcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zX3BhZ2VUcmFuc2l0aW9uTWFwID0gbWFwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBkaWFsb2cgdHJhbnNpdGlvbiDjgpLoqK3lrppcclxuICAgICAgICAgKiDkuIrmm7jjgY3jgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7VHJhbnNpdGlvbk1hcH0gbWFwIFtpbl0gVHJhbnNpdGlvbk1hcCDjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNldERpYWxvZ1RyYW5zaXRpb25NYXAobWFwOiBUcmFuc2l0aW9uTWFwKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChtYXApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc19kaWFsb2dUcmFuc2l0aW9uTWFwID0gbWFwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwYWdlIHRyYW5zaXRpb24g44KS5Y+W5b6XXHJcbiAgICAgICAgICogVHJhbnNpdGlvbk1hcCDjgavjgqLjgrXjgqTjg7PjgZXjgozjgabjgYTjgovjgoLjga7jgafjgYLjgozjgbDlpInmj5tcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ1tdfSBcInNsaWRlXCJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHF1ZXJ5UGFnZVRyYW5zaXRpb24ob3JpZ2luYWw6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnZlcnQgPSB0aGlzLnNfcGFnZVRyYW5zaXRpb25NYXBbb3JpZ2luYWxdO1xyXG4gICAgICAgICAgICBpZiAoY29udmVydCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRbdGhpcy5nZXRDdXJyZW50VUlQbGF0Zm9ybSgpXSB8fCBjb252ZXJ0LmZhbGxiYWNrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBkaWFsb2cgdHJhbnNpdGlvbiDjgpLlj5blvpdcclxuICAgICAgICAgKiBUcmFuc2l0aW9uTWFwIOOBq+OCouOCteOCpOODs+OBleOCjOOBpuOBhOOCi+OCguOBruOBp+OBguOCjOOBsOWkieaPm1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nW119IFwic2xpZGVcIlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcXVlcnlEaWFsb2dUcmFuc2l0aW9uKG9yaWdpbmFsOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBjb25zdCBjb252ZXJ0ID0gdGhpcy5zX2RpYWxvZ1RyYW5zaXRpb25NYXBbb3JpZ2luYWxdO1xyXG4gICAgICAgICAgICBpZiAoY29udmVydCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRbdGhpcy5nZXRDdXJyZW50VUlQbGF0Zm9ybSgpXSB8fCBjb252ZXJ0LmZhbGxiYWNrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLy8ganF1ZXkubW9iaWxlLmNoYW5nZVBhZ2UoKSDjga4gSG9vay5cclxuICAgIGZ1bmN0aW9uIGFwcGx5Q3VzdG9tQ2hhbmdlUGFnZSgpIHtcclxuICAgICAgICBjb25zdCBqcW1DaGFuZ2VQYWdlOiAodG86IGFueSwgb3B0aW9ucz86IENoYW5nZVBhZ2VPcHRpb25zKSA9PiB2b2lkID0gXy5iaW5kKCQubW9iaWxlLmNoYW5nZVBhZ2UsICQubW9iaWxlKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY3VzdG9tQ2hhbmdlUGFnZSh0bzogYW55LCBvcHRpb25zPzogQ2hhbmdlUGFnZU9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKF8uaXNTdHJpbmcodG8pKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLnRyYW5zaXRpb24gPSBUaGVtZS5xdWVyeVBhZ2VUcmFuc2l0aW9uKG9wdGlvbnMudHJhbnNpdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAganFtQ2hhbmdlUGFnZSh0bywgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkLm1vYmlsZS5jaGFuZ2VQYWdlID0gY3VzdG9tQ2hhbmdlUGFnZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBmcmFtZXdvcmsg5Yid5pyf5YyW5b6M44Gr6YGp55SoXHJcbiAgICBGcmFtZXdvcmsud2FpdEZvckluaXRpYWxpemUoKVxyXG4gICAgICAgIC5kb25lKCgpID0+IHtcclxuICAgICAgICAgICAgYXBwbHlDdXN0b21DaGFuZ2VQYWdlKCk7XHJcbiAgICAgICAgfSk7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIERvbUV4dGVuc2lvbk9wdGlvbnNcclxuICAgICAqIEBicmVpZiBEb21FeHRlbnNpb24g44Gr5rih44GZ44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRG9tRXh0ZW5zaW9uT3B0aW9ucyB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHR5cGUgRG9tRXh0ZW5zaW9uXHJcbiAgICAgKiBAYnJpZWYgRE9NIOaLoeW8temWouaVsFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgdHlwZSBEb21FeHRlbnNpb24gPSAoJHRhcmdldDogSlF1ZXJ5LCBEb21FeHRlbnNpb25PcHRpb25zPzogT2JqZWN0KSA9PiBKUXVlcnk7XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBFeHRlbnNpb25NYW5hZ2VyXHJcbiAgICAgKiBAYnJpZWYg5ouh5by15qmf6IO944KS566h55CG44GZ44KL44Om44O844OG44Kj44Oq44OG44Kj44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBFeHRlbnNpb25NYW5hZ2VyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgc19kb21FeHRlbnNpb25zOiBEb21FeHRlbnNpb25bXSA9IFtdO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBET00g5ouh5by16Zai5pWw44Gu55m76YyyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbn0gZnVuYyBbaW5dIERPTSDmi6HlvLXplqLmlbBcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGZ1bmM6IERvbUV4dGVuc2lvbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnNfZG9tRXh0ZW5zaW9ucy5wdXNoKGZ1bmMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRE9NIOaLoeW8teOCkumBqeeUqFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtqUXVlcnl9ICR1aSAgICAgICBbaW5dIOaLoeW8teWvvuixoeOBriBET01cclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBhcHBseURvbUV4dGVuc2lvbigkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zX2RvbUV4dGVuc2lvbnMuZm9yRWFjaCgoZnVuYzogRG9tRXh0ZW5zaW9uKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmdW5jKCR1aSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuVG9hc3RdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFRvYXN0XHJcbiAgICAgKiBAYnJpZWYgQW5kcm9pZCBTREsg44GuIFRvYXN0IOOCr+ODqeOCueOBruOCiOOBhuOBq+iHquWLlea2iOa7heOBmeOCi+ODoeODg+OCu+ODvOOCuOWHuuWKm+ODpuODvOODhuOCo+ODquODhuOCo1xyXG4gICAgICogICAgICAgIOWFpeOCjOWtkOOBrumWouS/guOCkuWun+ePvuOBmeOCi+OBn+OCgeOBqyBtb2R1bGUg44Gn5a6f6KOFXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBtb2R1bGUgVG9hc3Qge1xyXG5cclxuICAgICAgICAvLyDooajnpLrmmYLplpPjga7lrprnvqlcclxuICAgICAgICBleHBvcnQgbGV0IExFTkdUSF9TSE9SVCA9IDE1MDA7ICAgLy8hPCDnn63jgYQ6MTUwMCBtc2VjXHJcbiAgICAgICAgZXhwb3J0IGxldCBMRU5HVEhfTE9ORyAgPSA0MDAwOyAgIC8vITwg6ZW344GEOjQwMDAgbXNlY1xyXG5cclxuICAgICAgICAvLyEgQGVudW0g44Kq44OV44K744OD44OI44Gu5Z+65rqWXHJcbiAgICAgICAgZXhwb3J0IGVudW0gT2Zmc2V0WCB7XHJcbiAgICAgICAgICAgIExFRlQgICAgPSAweDAwMDEsXHJcbiAgICAgICAgICAgIFJJR0hUICAgPSAweDAwMDIsXHJcbiAgICAgICAgICAgIENFTlRFUiAgPSAweDAwMDQsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgQGVudW0g44Kq44OV44K744OD44OI44Gu5Z+65rqWXHJcbiAgICAgICAgZXhwb3J0IGVudW0gT2Zmc2V0WSB7XHJcbiAgICAgICAgICAgIFRPUCAgICAgPSAweDAwMTAsXHJcbiAgICAgICAgICAgIEJPVFRPTSAgPSAweDAwMjAsXHJcbiAgICAgICAgICAgIENFTlRFUiAgPSAweDAwNDAsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAaW50ZXJmYWNlIFN0eWxlQnVpbGRlclxyXG4gICAgICAgICAqIEBicmllZiAgICAg44K544K/44Kk44Or5aSJ5pu05pmC44Gr5L2/55So44GZ44KL44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgICAgICogICAgICAgICAgICBjc3Mg44Gr44K544K/44Kk44Or44KS6YCD44GM44GZ5aC05ZCI44CB54us6Ieq44GuIGNsYXNzIOOCkuioreWumuOBl+OAgWdldFN0eWxlIOOBryBudWxsIOOCkui/lOOBmeOBk+OBqOOAglxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBpbnRlcmZhY2UgU3R5bGVCdWlsZGVyIHtcclxuICAgICAgICAgICAgLy8hIGNsYXNzIGF0dHJpYnV0ZSDjgavoqK3lrprjgZnjgovmloflrZfliJfjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0Q2xhc3MoKTogc3RyaW5nO1xyXG4gICAgICAgICAgICAvLyEgc3R5bGUgYXR0cmlidXRlIOOBq+ioreWumuOBmeOCiyBKU09OIOOCquODluOCuOOCp+OCr+ODiOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRTdHlsZSgpOiBhbnk7XHJcbiAgICAgICAgICAgIC8vISDjgqrjg5Xjgrvjg4Pjg4jjga7ln7rmupbkvY3nva7jgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0T2Zmc2V0UG9pbnQoKTogbnVtYmVyO1xyXG4gICAgICAgICAgICAvLyEgWCDluqfmqJnjga7jgqrjg5Xjgrvjg4Pjg4jlgKTjgpLlj5blvpdcclxuICAgICAgICAgICAgZ2V0T2Zmc2V0WCgpOiBudW1iZXI7XHJcbiAgICAgICAgICAgIC8vISBZIOW6p+aomeOBruOCquODleOCu+ODg+ODiOWApOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRZKCk6IG51bWJlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBjbGFzcyBTdHlsZUJ1aWxkZXJEZWZhdWx0XHJcbiAgICAgICAgICogQGJyaWVmIOOCueOCv+OCpOODq+WkieabtOaZguOBq+S9v+eUqOOBmeOCi+aXouWumuOBruani+mAoOS9k+OCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBjbGFzcyBTdHlsZUJ1aWxkZXJEZWZhdWx0IGltcGxlbWVudHMgU3R5bGVCdWlsZGVyIHtcclxuXHJcbiAgICAgICAgICAgIC8vISBjbGFzcyBhdHRyaWJ1dGUg44Gr6Kit5a6a44GZ44KL5paH5a2X5YiX44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldENsYXNzKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ1aS1sb2FkZXIgdWktb3ZlcmxheS1zaGFkb3cgdWktY29ybmVyLWFsbFwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyEgc3R5bGUgYXR0cmlidXRlIOOBq+ioreWumuOBmeOCiyBKU09OIOOCquODluOCuOOCp+OCr+ODiOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRTdHlsZSgpOiBhbnkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgXCJwYWRkaW5nXCI6ICAgICAgICAgIFwiN3B4IDI1cHggN3B4IDI1cHhcIixcclxuICAgICAgICAgICAgICAgICAgICBcImRpc3BsYXlcIjogICAgICAgICAgXCJibG9ja1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBcIiMxZDFkMWRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImJvcmRlci1jb2xvclwiOiAgICAgXCIjMWIxYjFiXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJjb2xvclwiOiAgICAgICAgICAgIFwiI2ZmZlwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwidGV4dC1zaGFkb3dcIjogICAgICBcIjAgMXB4IDAgIzExMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiZm9udC13ZWlnaHRcIjogICAgICBcImJvbGRcIixcclxuICAgICAgICAgICAgICAgICAgICBcIm9wYWNpdHlcIjogICAgICAgICAgMC44LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdHlsZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8hIOOCquODleOCu+ODg+ODiOOBruWfuua6luS9jee9ruOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRQb2ludCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9mZnNldFguQ0VOVEVSIHwgT2Zmc2V0WS5CT1RUT007XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vISBYIOW6p+aomeOBruOCquODleOCu+ODg+ODiOWApOOCkuWPluW+l1xyXG4gICAgICAgICAgICBnZXRPZmZzZXRYKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8hIFkg5bqn5qiZ44Gu44Kq44OV44K744OD44OI5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgICAgIGdldE9mZnNldFkoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtNzU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRvYXN0IOihqOekulxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG1lc3NhZ2UgIFtpbl0g44Oh44OD44K744O844K4XHJcbiAgICAgICAgICogQHBhcmFtIGR1cmF0aW9uIFtpbl0g6KGo56S65pmC6ZaT44KS6Kit5a6aIChtc2VjKSBkZWZhdWx0OiBMRU5HVEhfU0hPUlRcclxuICAgICAgICAgKiBAcGFyYW0gc3R5bGUgICAgW2luXSDjgrnjgr/jgqTjg6vlpInmm7TjgZnjgovloLTlkIjjgavjga/mtL7nlJ/jgq/jg6njgrnjgqrjg5bjgrjjgqfjgq/jg4jjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgZnVuY3Rpb24gc2hvdyhtZXNzYWdlOiBzdHJpbmcsIGR1cmF0aW9uOiBudW1iZXIgPSBUb2FzdC5MRU5HVEhfU0hPUlQsIHN0eWxlPzogU3R5bGVCdWlsZGVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRtb2JpbGUgPSAkLm1vYmlsZTtcclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IHN0eWxlIHx8IG5ldyBTdHlsZUJ1aWxkZXJEZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNldENTUyA9IGluZm8uZ2V0U3R5bGUoKSA/IHRydWUgOiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIOaUueihjOOCs+ODvOODieOBryA8YnIvPiDjgavnva7mj5vjgZnjgotcclxuICAgICAgICAgICAgY29uc3QgbXNnID0gbWVzc2FnZS5yZXBsYWNlKC9cXG4vZywgXCI8YnIvPlwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOODoeODg+OCu+ODvOOCuCBlbGVtZW50IOOBruWLleeahOeUn+aIkFxyXG4gICAgICAgICAgICBjb25zdCBodG1sID0gXCI8ZGl2PlwiICsgbXNnICsgXCI8L2Rpdj5cIjtcclxuICAgICAgICAgICAgY29uc3QgYm94ID0gJChodG1sKS5hZGRDbGFzcyhpbmZvLmdldENsYXNzKCkpO1xyXG4gICAgICAgICAgICBpZiAoc2V0Q1NTKSB7XHJcbiAgICAgICAgICAgICAgICBib3guY3NzKGluZm8uZ2V0U3R5bGUoKSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOiHquWLleaUueihjOOBleOCjOOBpuOCguOCiOOBhOOCiOOBhuOBq+OAgeWfuueCueOCkuioreWumuOBl+OBpuOBi+OCiei/veWKoFxyXG4gICAgICAgICAgICBib3guY3NzKHtcclxuICAgICAgICAgICAgICAgIFwidG9wXCI6IDAsXHJcbiAgICAgICAgICAgICAgICBcImxlZnRcIjogMCxcclxuICAgICAgICAgICAgfSkuYXBwZW5kVG8oJG1vYmlsZS5wYWdlQ29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOmFjee9ruS9jee9ruOBruaxuuWumlxyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXRQb2ludCA9IGluZm8uZ2V0T2Zmc2V0UG9pbnQoKTtcclxuICAgICAgICAgICAgY29uc3QgJHdpbmRvdyA9ICQod2luZG93KTtcclxuICAgICAgICAgICAgbGV0IHBvc1gsIHBvc1k7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBib3hfd2lkdGggPSBib3gud2lkdGgoKSArIHBhcnNlSW50KGJveC5jc3MoXCJwYWRkaW5nLWxlZnRcIiksIDEwKSArIHBhcnNlSW50KGJveC5jc3MoXCJwYWRkaW5nLXJpZ2h0XCIpLCAxMCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJveF9oZWlnaHQgPSBib3guaGVpZ2h0KCkgKyBwYXJzZUludChib3guY3NzKFwicGFkZGluZy10b3BcIiksIDEwKSArIHBhcnNlSW50KGJveC5jc3MoXCJwYWRkaW5nLWJvdHRvbVwiKSwgMTApO1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChvZmZzZXRQb2ludCAmIDB4MDAwRikge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRYLkxFRlQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWCA9IDAgKyBpbmZvLmdldE9mZnNldFgoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgT2Zmc2V0WC5SSUdIVDpcclxuICAgICAgICAgICAgICAgICAgICBwb3NYID0gJHdpbmRvdy53aWR0aCgpIC0gYm94X3dpZHRoICsgaW5mby5nZXRPZmZzZXRYKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIE9mZnNldFguQ0VOVEVSOlxyXG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSAoJHdpbmRvdy53aWR0aCgpIC8gMikgLSAoYm94X3dpZHRoIC8gMikgKyBpbmZvLmdldE9mZnNldFgoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwid2Fybi4gdW5rbm93biBvZmZzZXRQb2ludDpcIiArIChvZmZzZXRQb2ludCAmIDB4MDAwRikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSAoJHdpbmRvdy53aWR0aCgpIC8gMikgLSAoYm94X3dpZHRoIC8gMikgKyBpbmZvLmdldE9mZnNldFgoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChvZmZzZXRQb2ludCAmIDB4MDBGMCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRZLlRPUDpcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gMCArIGluZm8uZ2V0T2Zmc2V0WSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBPZmZzZXRZLkJPVFRPTTpcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gJHdpbmRvdy5oZWlnaHQoKSAtIGJveF9oZWlnaHQgKyBpbmZvLmdldE9mZnNldFkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgT2Zmc2V0WS5DRU5URVI6XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWSA9ICgkd2luZG93LmhlaWdodCgpIC8gMikgLSAoYm94X2hlaWdodCAvIDIpICsgaW5mby5nZXRPZmZzZXRZKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcIndhcm4uIHVua25vd24gb2Zmc2V0UG9pbnQ6XCIgKyAob2Zmc2V0UG9pbnQgJiAweDAwRjApKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gKCR3aW5kb3cuaGVpZ2h0KCkgLyAyKSAtIChib3hfaGVpZ2h0IC8gMikgKyBpbmZvLmdldE9mZnNldFkoKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g6KGo56S6XHJcbiAgICAgICAgICAgIGJveC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgXCJ0b3BcIjogcG9zWSxcclxuICAgICAgICAgICAgICAgIFwibGVmdFwiOiBwb3NYLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZGVsYXkoZHVyYXRpb24pXHJcbiAgICAgICAgICAgIC5mYWRlT3V0KDQwMCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBQcm9taXNlICAgICAgPSBDRFAuUHJvbWlzZTtcclxuICAgIGltcG9ydCBGcmFtZXdvcmsgICAgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5EaWFsb2ddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogSC9XIEJhY2sgS2V5IEhvb2sg6Zai5pWwXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCB0eXBlIERpYWxvZ0JhY2tLZXlIYW5kbGVyID0gKGV2ZW50PzogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBEaWFsb2dPcHRpb25zXHJcbiAgICAgKiAgICAgICAgICAgIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs+OCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIERpYWxvZ09wdGlvbnMgZXh0ZW5kcyBQb3B1cE9wdGlvbnMge1xyXG4gICAgICAgIHNyYz86IHN0cmluZzsgICAgICAgICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSB0ZW1wbGF0ZSDjg5XjgqHjgqTjg6vjga7jg5HjgrkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgICAgICB0aXRsZT86IHN0cmluZzsgICAgICAgICAgICAgICAgIC8vITwge1N0cmluZ30g44OA44Kk44Ki44Ot44Kw44K/44Kk44OI44OrICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB1bmRlZmluZWRcclxuICAgICAgICBtZXNzYWdlPzogc3RyaW5nOyAgICAgICAgICAgICAgIC8vITwge1N0cmluZ30g44Oh44Kk44Oz44Oh44OD44K744O844K4ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHVuZGVmaW5lZFxyXG4gICAgICAgIGlkUG9zaXRpdmU/OiBzdHJpbmc7ICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSBQb3NpdGl2ZSDjg5zjgr/jg7Pjga5JRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcImRsZy1idG4tcG9zaXRpdmVcIlxyXG4gICAgICAgIGlkTmVnYXRpdmU/OiBzdHJpbmc7ICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSBOYWdhdGl2ZSDjg5zjgr/jg7Pjga5JRCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiBcImRsZy1idG4tbmVnYXRpdmVcIlxyXG4gICAgICAgIGV2ZW50Pzogc3RyaW5nOyAgICAgICAgICAgICAgICAgLy8hPCB7U3RyaW5nfSBEaWFsb2cg44Kv44Op44K544GM566h55CG44GZ44KL44Kk44OZ44Oz44OIICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwidmNsaWNrXCJcclxuICAgICAgICBkZWZhdWx0QXV0b0Nsb3NlPzogYm9vbGVhbjsgICAgIC8vITwge0Jvb2xlYW59IGRhdGEtYXV0by1jbG9zZSDjgYzmjIflrprjgZXjgozjgabjgYTjgarjgYTloLTlkIjjga7ml6LlrprlgKQgICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgIGZvcmNlT3ZlcndyaXRlQWZ0ZXJDbG9zZT86IGJvb2xlYW47IC8vITwge0Jvb2xlYW59IGFmdGVyY2xvc2Ug44Kq44OX44K344On44Oz44KS5by35Yi25LiK5pu444GN44GZ44KL44Gf44KB44Gu6Kit5a6aICAgIGRlZmF1bHQ6IGZhbHNlXHJcbiAgICAgICAgbGFiZWxQb3NpdGl2ZT86IHN0cmluZzsgICAgICAgICAvLyE8IHtTdHJpbmd9IFBvc2l0aXZlIOODnOOCv+ODs+ODqeODmeODqyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJPS1wiXHJcbiAgICAgICAgbGFiZWxOZWdhdGl2ZT86IHN0cmluZzsgICAgICAgICAvLyE8IHtTdHJpbmd9IE5lZ2F0aXZlIOODnOOCv+ODs+ODqeODmeODqyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogXCJDYW5jZWxcIlxyXG4gICAgICAgIGJhY2tLZXk/OiBcImNsb3NlXCIgfCBcImRlbnlcIiB8IERpYWxvZ0JhY2tLZXlIYW5kbGVyOyAgLy8hPCBIL1cgYmFja0tleSDjga7mjK/jgovoiJ7jgYQgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6IFwiY2xvc2VcIlxyXG4gICAgICAgIHNjcm9sbEV2ZW50PzogXCJkZW55XCIgfCBcImFsbG93XCIgfCBcImFkanVzdFwiOyAgIC8vITwge1N0cmluZ30gc2Nyb2xs44Gu5oqR5q2i5pa55byPICAo4oC7IGFkanVzdCDjga/oqabpqJPnmoQpICAgICBkZWZhdWx0OiBcImRlbnlcIlxyXG4gICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zOyAgIC8vITwgRE9N5ouh5by144Kq44OX44K344On44OzLiBudWxsfHVuZGVmaW5lZCDjgafmi6HlvLXjgZfjgarjgYQgICAgICBkZWZhdWx0OiB7fVxyXG4gICAgICAgIFt4OiBzdHJpbmddOiBhbnk7ICAgICAgICAgICAgICAgLy8hPCBhbnkgZGlhbG9nIHRlbXBsYXRlIHBhcmFtZXRlcnMuXHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBEaWFsb2dcclxuICAgICAqIEBicmllZiDmsY7nlKjjg4DjgqTjgqLjg63jgrDjgq/jg6njgrlcclxuICAgICAqICAgICAgICBqUU0g44GuIHBvcHVwIHdpZGdldCDjgavjgojjgaPjgablrp/oo4VcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIERpYWxvZyB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3RlbXBsYXRlOiBUb29scy5KU1QgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX3NldHRpbmdzOiBEaWFsb2dPcHRpb25zID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF8kZGlhbG9nOiBKUXVlcnkgPSBudWxsO1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX2FjdGl2ZURpYWxvZzogRGlhbG9nID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzX29sZEJhY2tLZXlIYW5kbGVyOiAoZXZlbnQ/OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfZGVmYXVsdE9wdGlvbnM6IERpYWxvZ09wdGlvbnMgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGlkICAgICAge1N0cmluZ30gICAgICAgIFtpbl0g44OA44Kk44Ki44Ot44KwIERPTSBJRCDjgpLmjIflrpogZXgpICNkaWFsb2ctaG9nZVxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtEaWFsb2dPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBEaWFsb2dPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIC8vIERpYWxvZyDlhbHpgJroqK3lrprjga7liJ3mnJ/ljJZcclxuICAgICAgICAgICAgRGlhbG9nLmluaXRDb21tb25Db25kaXRpb24oKTtcclxuICAgICAgICAgICAgLy8g6Kit5a6a44KS5pu05pawXHJcbiAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQoe30sIERpYWxvZy5zX2RlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgLy8g44OA44Kk44Ki44Ot44Kw44OG44Oz44OX44Os44O844OI44KS5L2c5oiQXHJcbiAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gVG9vbHMuVGVtcGxhdGUuZ2V0SlNUKGlkLCB0aGlzLl9zZXR0aW5ncy5zcmMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDooajnpLpcclxuICAgICAgICAgKiDooajnpLrjgpLjgZfjgablp4vjgoHjgaYgRE9NIOOBjOacieWKueOBq+OBquOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0RpYWxvZ09wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzIChzcmMg44Gv54Sh6KaW44GV44KM44KLKVxyXG4gICAgICAgICAqIEByZXR1cm4g44OA44Kk44Ki44Ot44Kw44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc2hvdyhvcHRpb25zPzogRGlhbG9nT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRkb2N1bWVudCA9ICQoZG9jdW1lbnQpO1xyXG4gICAgICAgICAgICBjb25zdCAkYm9keSA9ICQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICBjb25zdCAkcGFnZSA9ICg8YW55PiRib2R5KS5wYWdlY29udGFpbmVyKFwiZ2V0QWN0aXZlUGFnZVwiKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9mY0hpZGRlbiA9IHtcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3dcIjogICAgIFwiaGlkZGVuXCIsXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXhcIjogICBcImhpZGRlblwiLFxyXG4gICAgICAgICAgICAgICAgXCJvdmVyZmxvdy15XCI6ICAgXCJoaWRkZW5cIixcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgY29uc3Qgb2ZjQm9keSA9IHsgLy8gYm9keSBvdmVyZmxvdyBjb250ZXh0XHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93XCI6ICAgICAkYm9keS5jc3MoXCJvdmVyZmxvd1wiKSxcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteFwiOiAgICRib2R5LmNzcyhcIm92ZXJmbG93LXhcIiksXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXlcIjogICAkYm9keS5jc3MoXCJvdmVyZmxvdy15XCIpLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRTY3JvbGxQb3MgPSAkYm9keS5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgY29uc3Qgb2ZjUGFnZSA9IHsgLy8gcGFnZSBvdmVyZmxvdyBjb250ZXh0XHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93XCI6ICAgICAkcGFnZS5jc3MoXCJvdmVyZmxvd1wiKSxcclxuICAgICAgICAgICAgICAgIFwib3ZlcmZsb3cteFwiOiAgICRwYWdlLmNzcyhcIm92ZXJmbG93LXhcIiksXHJcbiAgICAgICAgICAgICAgICBcIm92ZXJmbG93LXlcIjogICAkcGFnZS5jc3MoXCJvdmVyZmxvdy15XCIpLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsRXZlbnQgPSBcInNjcm9sbCB0b3VjaG1vdmUgbW91c2Vtb3ZlIE1TUG9pbnRlck1vdmVcIjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbEhhbmRlciA9IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJkZW55XCIgPT09IHRoaXMuX3NldHRpbmdzLnNjcm9sbEV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJhZGp1c3RcIiA9PT0gdGhpcy5fc2V0dGluZ3Muc2Nyb2xsRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkYm9keS5zY3JvbGxUb3AocGFyZW50U2Nyb2xsUG9zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIG9wdGlvbiDjgYzmjIflrprjgZXjgozjgabjgYTjgZ/loLTlkIjmm7TmlrBcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gb3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgdGhpcy5fc2V0dGluZ3MsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBhZnRlcmNsb3NlIOWHpueQhuOBryBEaWFsb2cg44Gu56C05qOE5Yem55CG44KS5a6f6KOF44GZ44KL44Gf44KB5Z+65pys55qE44Gr6Kit5a6a56aB5q2iICjlvLfliLbkuIrmm7jjgY3jg6Ljg7zjg4njgpLoqK3lrprkvb/nlKjlj68pXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5hZnRlcmNsb3NlICYmICF0aGlzLl9zZXR0aW5ncy5mb3JjZU92ZXJ3cml0ZUFmdGVyQ2xvc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImNhbm5vdCBhY2NlcHQgJ2FmdGVyY2xvc2UnIG9wdGlvbi4gcGxlYXNlIGluc3RlYWQgdXNpbmcgJ3BvcHVwYWZ0ZXJjbG9zZScgZXZlbnQuXCIpO1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3NldHRpbmdzLmFmdGVyY2xvc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHRpdGxlIOOBruacieeEoVxyXG4gICAgICAgICAgICAoPGFueT50aGlzLl9zZXR0aW5ncykuX3RpdGxlU3RhdGUgPSB0aGlzLl9zZXR0aW5ncy50aXRsZSA/IFwidWktaGFzLXRpdGxlXCIgOiBcInVpLW5vLXRpdGxlXCI7XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiB0ZW1wbGF0ZSDjgYvjgokgalF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiOOCkuS9nOaIkOOBl+OAgVxyXG4gICAgICAgICAgICAgKiA8Ym9keT4g55u05LiL44Gr6L+95YqgLlxyXG4gICAgICAgICAgICAgKiAkcGFnZSDjgafjga8gQmFja2JvbmUgZXZlbnQg44KS5Y+X44GR44KJ44KM44Gq44GE44GT44Go44Gr5rOo5oSPXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICB0aGlzLl8kZGlhbG9nID0gJCh0aGlzLl90ZW1wbGF0ZSh0aGlzLl9zZXR0aW5ncykpO1xyXG4gICAgICAgICAgICB0aGlzLl8kZGlhbG9nLmxvY2FsaXplKCk7XHJcbiAgICAgICAgICAgICRib2R5LmFwcGVuZCh0aGlzLl8kZGlhbG9nKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHRoZW1lIOOCkuino+axulxyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmVUaGVtZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fJGRpYWxvZ1xyXG4gICAgICAgICAgICAgICAgLm9uKFwicG9wdXBjcmVhdGVcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyDjgrnjgq/jg63jg7zjg6vjgpLmipHmraJcclxuICAgICAgICAgICAgICAgICAgICBpZiAoXCJhbGxvd1wiICE9PSB0aGlzLl9zZXR0aW5ncy5zY3JvbGxFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkZG9jdW1lbnQub24oc2Nyb2xsRXZlbnQsIHNjcm9sbEhhbmRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICRib2R5LmNzcyhvZmNIaWRkZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICRwYWdlLmNzcyhvZmNIaWRkZW4pO1xyXG4gICAgICAgICAgICAgICAgICAgIERpYWxvZy5yZWdpc3Rlcih0aGlzKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZW5oYW5jZVdpdGhpbigpO1xyXG5cclxuICAgICAgICAgICAgLy8gRE9NIOaLoeW8tVxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9zZXR0aW5ncy5kb21FeHRlbnNpb25PcHRpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBFeHRlbnNpb25NYW5hZ2VyLmFwcGx5RG9tRXh0ZW5zaW9uKHRoaXMuXyRkaWFsb2csIHRoaXMuX3NldHRpbmdzLmRvbUV4dGVuc2lvbk9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9uQmVmb3JlU2hvdygpXHJcbiAgICAgICAgICAgICAgICAuZG9uZSgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6KGo56S6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAucG9wdXAoJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uVG86IFwid2luZG93XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZnRlcmNsb3NlOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCwgdWk6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIOOCueOCr+ODreODvOODq+eKtuaFi+OCkuaIu+OBmVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRwYWdlLmNzcyhvZmNQYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkYm9keS5jc3Mob2ZjQm9keSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFwiYWxsb3dcIiAhPT0gdGhpcy5fc2V0dGluZ3Muc2Nyb2xsRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGRvY3VtZW50Lm9mZihzY3JvbGxFdmVudCwgc2Nyb2xsSGFuZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRGlhbG9nLnJlZ2lzdGVyKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZyA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCB0aGlzLl9zZXR0aW5ncykpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5wb3B1cChcIm9wZW5cIikub24odGhpcy5fc2V0dGluZ3MuZXZlbnQsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBcImRhdGEtYXV0by1jbG9zZT0nZmFsc2UnXCIg44GM5oyH5a6a44GV44KM44Gm44GE44KL6KaB57Sg44GvIGRpYWxvZyDjgpLplonjgZjjgarjgYRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhdXRvQ2xvc2UgPSAkKGV2ZW50LnRhcmdldCkuYXR0cihcImRhdGEtYXV0by1jbG9zZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudWxsID09IGF1dG9DbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF1dG9DbG9zZSA9IHRoaXMuX3NldHRpbmdzLmRlZmF1bHRBdXRvQ2xvc2UgPyBcInRydWVcIiA6IFwiZmFsc2VcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChcImZhbHNlXCIgPT09IGF1dG9DbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZmFpbCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiRGlhbG9nLnNob3coKSBmYWlsZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl8kZGlhbG9nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuXyRkaWFsb2cudHJpZ2dlcihcImVycm9yXCIsIGVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kZGlhbG9nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog57WC5LqGXHJcbiAgICAgICAgICog5Z+65pys55qE44Gr44Gv6Ieq5YuV44Gn6ZaJ44GY44KL44GM44CBXHJcbiAgICAgICAgICog6KGo56S65Lit44Gu44OA44Kk44Ki44Ot44Kw44KS44Kv44Op44Kk44Ki44Oz44OI5YG044GL44KJ6ZaJ44GY44KL44Oh44K944OD44OJXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNsb3NlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fJGRpYWxvZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGRpYWxvZy5wb3B1cChcImNsb3NlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OA44Kk44Ki44Ot44KwIGVsZW1lbnQg44KS5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIGdldCAkZWwoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRkaWFsb2c7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByb3RlY3RlZCBtZXRob2RzOiBPdmVycmlkZVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg4DjgqTjgqLjg63jgrDooajnpLrjga7nm7TliY1cclxuICAgICAgICAgKiBET00g44KS5pON5L2c44Gn44GN44KL44K/44Kk44Of44Oz44Kw44Gn5ZG844Gz5Ye644GV44KM44KLLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7SVByb21pc2VCYXNlfSBwcm9taXNlIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3RlY3RlZCBvbkJlZm9yZVNob3coKTogSVByb21pc2VCYXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZTx2b2lkPigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44OA44Kk44Ki44Ot44Kw44Gu5L2/55So44GZ44KLIFRoZW1lIOOCkuino+axulxyXG4gICAgICAgICAqIOS4jeimgeOBquWgtOWQiOOBr+OCquODvOODkOODvOODqeOCpOODieOBmeOCi+OBk+OBqOOCguWPr+iDvVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3RlY3RlZCByZXNvbHZlVGhlbWUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHF1ZXJ5VGhlbWUgPSAoKTogc3RyaW5nID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkKFwiLnVpLXBhZ2UtYWN0aXZlXCIpLmpxbURhdGEoXCJ0aGVtZVwiKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjYW5kaWRhdGVUaGVtZTogc3RyaW5nO1xyXG5cclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9zZXR0aW5ncy50aGVtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tVGhlbWUgPSB0aGlzLl8kZGlhbG9nLmpxbURhdGEoXCJ0aGVtZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmICghZG9tVGhlbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZXR0aW5ncy50aGVtZSA9IGNhbmRpZGF0ZVRoZW1lID0gcXVlcnlUaGVtZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3NldHRpbmdzLm92ZXJsYXlUaGVtZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZG9tT3ZlcmxheVRoZW1lID0gdGhpcy5fJGRpYWxvZy5qcW1EYXRhKFwib3ZlcmxheS10aGVtZVwiKTtcclxuICAgICAgICAgICAgICAgIGlmICghZG9tT3ZlcmxheVRoZW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3Mub3ZlcmxheVRoZW1lID0gY2FuZGlkYXRlVGhlbWUgfHwgcXVlcnlUaGVtZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyB0cmFuc2l0aW9uIOOBruabtOaWsFxyXG4gICAgICAgICAgICB0aGlzLl9zZXR0aW5ncy50cmFuc2l0aW9uID0gVGhlbWUucXVlcnlEaWFsb2dUcmFuc2l0aW9uKHRoaXMuX3NldHRpbmdzLnRyYW5zaXRpb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgc3RhdGljIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGlhbG9nIOOBruaXouWumuOCquODl+OCt+ODp+ODs+OCkuabtOaWsFxyXG4gICAgICAgICAqIOOBmeOBuuOBpuOBriBEaWFsb2cg44GM5L2/55So44GZ44KL5YWx6YCa6Kit5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7RGlhbG9nT3B0aW9uc30gW2luXSDjg4DjgqTjgqLjg63jgrDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIHNldERlZmF1bHRPcHRpb25zKG9wdGlvbnM6IERpYWxvZ09wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gRGlhbG9nIOWFsemAmuioreWumuOBruWIneacn+WMllxyXG4gICAgICAgICAgICBEaWFsb2cuaW5pdENvbW1vbkNvbmRpdGlvbigpO1xyXG4gICAgICAgICAgICAkLmV4dGVuZCh0cnVlLCBEaWFsb2cuc19kZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEg54++5ZyoIGFjdGl2ZSDjgarjg4DjgqTjgqLjg63jgrDjgajjgZfjgabnmbvpjLLjgZnjgotcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyByZWdpc3RlcihkaWFsb2c6IERpYWxvZyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBkaWFsb2cgJiYgbnVsbCAhPSBEaWFsb2cuc19hY3RpdmVEaWFsb2cpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcIm5ldyBkaWFsb2cgcHJvYyBpcyBjYWxsZWQgaW4gdGhlIHBhc3QgZGlhbG9nJ3Mgb25lLiB1c2Ugc2V0VGltZW91dCgpIGZvciBwb3N0IHByb2Nlc3MuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIERpYWxvZy5zX2FjdGl2ZURpYWxvZyA9IGRpYWxvZztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERpYWxvZyDlhbHpgJroqK3lrprjga7liJ3mnJ/ljJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBpbml0Q29tbW9uQ29uZGl0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBGcmFtZXdvcmsg44Gu5Yid5pyf5YyW5b6M44Gr5Yem55CG44GZ44KL5b+F6KaB44GM44GC44KLXHJcbiAgICAgICAgICAgIGlmICghRnJhbWV3b3JrLmlzSW5pdGlhbGl6ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiaW5pdENvbW1vbkNvbmRpdGlvbigpIHNob3VsZCBiZSBjYWxsZWQgYWZ0ZXIgRnJhbWV3b3JrLmluaXRpYWxpemVkLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gRGlhbG9nLnNfb2xkQmFja0tleUhhbmRsZXIpIHtcclxuICAgICAgICAgICAgICAgIC8vIEJhY2sgQnV0dG9uIEhhbmRsZXJcclxuICAgICAgICAgICAgICAgIERpYWxvZy5zX29sZEJhY2tLZXlIYW5kbGVyID0gQ0RQLnNldEJhY2tCdXR0b25IYW5kbGVyKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgQ0RQLnNldEJhY2tCdXR0b25IYW5kbGVyKERpYWxvZy5jdXN0b21CYWNrS2V5SGFuZGxlcik7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g5pei5a6a44Kq44OX44K344On44OzXHJcbiAgICAgICAgICAgICAgICBEaWFsb2cuc19kZWZhdWx0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBpZFBvc2l0aXZlOiAgICAgICAgICAgICBcImRsZy1idG4tcG9zaXRpdmVcIixcclxuICAgICAgICAgICAgICAgICAgICBpZE5lZ2F0aXZlOiAgICAgICAgICAgICBcImRsZy1idG4tbmVnYXRpdmVcIixcclxuICAgICAgICAgICAgICAgICAgICBldmVudDogICAgICAgICAgICAgICAgICBGcmFtZXdvcmsuZ2V0RGVmYXVsdENsaWNrRXZlbnQoKSxcclxuICAgICAgICAgICAgICAgICAgICBkaXNtaXNzaWJsZTogICAgICAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0QXV0b0Nsb3NlOiAgICAgICBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9uOiAgICAgICAgICAgICBcInBsYXRmb3JtLWRlZmF1bHRcIixcclxuICAgICAgICAgICAgICAgICAgICBsYWJlbFBvc2l0aXZlOiAgICAgICAgICBcIk9LXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxOZWdhdGl2ZTogICAgICAgICAgXCJDYW5jZWxcIixcclxuICAgICAgICAgICAgICAgICAgICBiYWNrS2V5OiAgICAgICAgICAgICAgICBcImNsb3NlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsRXZlbnQ6ICAgICAgICAgICAgXCJkZW55XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZG9tRXh0ZW5zaW9uT3B0aW9uczogICAge30sXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIL1cgQmFjayBCdXR0b24gSGFuZGxlclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGN1c3RvbUJhY2tLZXlIYW5kbGVyKGV2ZW50PzogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IERpYWxvZy5zX2FjdGl2ZURpYWxvZykge1xyXG4gICAgICAgICAgICAgICAgaWYgKFwiY2xvc2VcIiA9PT0gRGlhbG9nLnNfYWN0aXZlRGlhbG9nLl9zZXR0aW5ncy5iYWNrS2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgRGlhbG9nLnNfYWN0aXZlRGlhbG9nLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIERpYWxvZy5zX2FjdGl2ZURpYWxvZy5fc2V0dGluZ3MuYmFja0tleSkge1xyXG4gICAgICAgICAgICAgICAgICAgICg8RGlhbG9nQmFja0tleUhhbmRsZXI+RGlhbG9nLnNfYWN0aXZlRGlhbG9nLl9zZXR0aW5ncy5iYWNrS2V5KShldmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47IC8vIERpYWxvZyDjgYwgYWN0aXZlIOOBquWgtOWQiOOAgeW4uOOBq+aXouWumuOBruODj+ODs+ODieODqeOBq+OBr+a4oeOBleOBquOBhFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIERpYWxvZy5zX29sZEJhY2tLZXlIYW5kbGVyKGV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuRGlhbG9nQ29tbW9uc10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBbGVydFxyXG4gICAgICogYWxlcnQg44Oh44OD44K744O844K46KGo56S6XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgICBbaW5dIOihqOekuuaWh+Wtl+WIl1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zXSBbaW5dIOODgOOCpOOCouODreOCsOOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHJldHVybiB7alF1ZXJ5fSDjg4DjgqTjgqLjg63jgrDjga4gRE9NIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gYWxlcnQobWVzc2FnZTogc3RyaW5nLCBvcHRpb25zPzogRGlhbG9nT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBgXHJcbiAgICAgICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHQvdGVtcGxhdGVcIj5cclxuICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwidWktbW9kYWxcIiBkYXRhLXJvbGU9XCJwb3B1cFwiIGRhdGEtY29ybmVycz1cImZhbHNlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzPVwidWktdGl0bGUge3tfdGl0bGVTdGF0ZX19XCI+e3t0aXRsZX19PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ1aS1tZXNzYWdlXCI+e3ttZXNzYWdlfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLW1vZGFsLWZvb3RlciB1aS1ncmlkLXNvbG9cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInt7aWRQb3NpdGl2ZX19XCIgY2xhc3M9XCJ1aS1idG4gdWktYmxvY2stYSB1aS10ZXh0LWVtcGhhc2lzXCIgZGF0YS1hdXRvLWNsb3NlPVwidHJ1ZVwiPnt7bGFiZWxQb3NpdGl2ZX19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgIDwvc2NyaXB0PlxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgICAgIGNvbnN0IGRsZ0FsZXJ0ID0gbmV3IERpYWxvZyh0ZW1wbGF0ZSwgJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgc3JjOiBudWxsLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxyXG4gICAgICAgIH0sIG9wdGlvbnMpKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGRsZ0FsZXJ0LnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbmZpcm1cclxuICAgICAqIOeiuuiqjeODoeODg+OCu+ODvOOCuOihqOekulxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBtZXNzYWdlICAgW2luXSDooajnpLrmloflrZfliJdcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9uc10gW2luXSDjg4DjgqTjgqLjg63jgrDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqIEByZXR1cm4ge2pRdWVyeX0g44OA44Kk44Ki44Ot44Kw44GuIERPTSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNvbmZpcm0obWVzc2FnZTogc3RyaW5nLCBvcHRpb25zPzogRGlhbG9nT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBgXHJcbiAgICAgICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHQvdGVtcGxhdGVcIj5cclxuICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwidWktbW9kYWxcIiBkYXRhLXJvbGU9XCJwb3B1cFwiIGRhdGEtY29ybmVycz1cImZhbHNlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzPVwidWktdGl0bGUge3tfdGl0bGVTdGF0ZX19XCI+e3t0aXRsZX19PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ1aS1tZXNzYWdlXCI+e3ttZXNzYWdlfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLW1vZGFsLWZvb3RlciB1aS1ncmlkLWFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInt7aWROZWdhdGl2ZX19XCIgY2xhc3M9XCJ1aS1idG4gdWktYmxvY2stYVwiIGRhdGEtYXV0by1jbG9zZT1cInRydWVcIj57e2xhYmVsTmVnYXRpdmV9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwie3tpZFBvc2l0aXZlfX1cIiBjbGFzcz1cInVpLWJ0biB1aS1ibG9jay1iIHVpLXRleHQtZW1waGFzaXNcIiBkYXRhLWF1dG8tY2xvc2U9XCJ0cnVlXCI+e3tsYWJlbFBvc2l0aXZlfX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvc2VjdGlvbj5cclxuICAgICAgICAgICAgPC9zY3JpcHQ+XHJcbiAgICAgICAgYDtcclxuXHJcbiAgICAgICAgY29uc3QgZGxnQ29uZmlybSA9IG5ldyBEaWFsb2codGVtcGxhdGUsICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIHNyYzogbnVsbCxcclxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICB9LCBvcHRpb25zKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkbGdDb25maXJtLnNob3coKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgRGlhbG9nQ29tbW9uc09wdGlvbnNcclxuICAgICAqIEBicmllZiBwcm9tcHQg44Gu44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRGlhbG9nUHJvbXB0T3B0aW9ucyBleHRlbmRzIERpYWxvZ09wdGlvbnMge1xyXG4gICAgICAgIGV2ZW50T0s/OiBzdHJpbmc7IC8vITwgT0sg44Oc44K/44Oz5oq85LiL5pmC44GuIGV2ZW50OiBkZWZhdWx0OiBwcm9tcHRva1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIERpYWxvZ1Byb21wdFxyXG4gICAgICogQGJyaWVmIHByb21wdCDjg4DjgqTjgqLjg63jgrAgKOmdnuWFrOmWiylcclxuICAgICAqL1xyXG4gICAgY2xhc3MgRGlhbG9nUHJvbXB0IGV4dGVuZHMgRGlhbG9nIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfZXZlbnRPSzogc3RyaW5nO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgb3B0aW9ucz86IERpYWxvZ1Byb21wdE9wdGlvbnMpIHtcclxuICAgICAgICAgICAgc3VwZXIoaWQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLl9ldmVudE9LID0gb3B0aW9ucy5ldmVudE9LIHx8IFwicHJvbXB0b2tcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg4DjgqTjgqLjg63jgrDooajnpLrjga7nm7TliY1cclxuICAgICAgICBwcm90ZWN0ZWQgb25CZWZvcmVTaG93KCk6IElQcm9taXNlQmFzZTx2b2lkPiB7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsXHJcbiAgICAgICAgICAgICAgICAub24oXCJ2Y2xpY2tcIiwgXCIuY29tbWFuZC1wcm9tcHQtb2sgXCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGV4dCA9IHRoaXMuJGVsLmZpbmQoXCIjX3VpLXByb21wdFwiKS52YWwoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbC50cmlnZ2VyKHRoaXMuX2V2ZW50T0ssIHRleHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5vbkJlZm9yZVNob3coKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQcm9tcHRcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbWVzc2FnZSAgIFtpbl0g6KGo56S65paH5a2X5YiXXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnNdIFtpbl0g44OA44Kk44Ki44Ot44Kw44Kq44OX44K344On44OzXHJcbiAgICAgKiBAcmV0dXJuIHtqUXVlcnl9IOODgOOCpOOCouODreOCsOOBriBET00g44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBwcm9tcHQobWVzc2FnZTogc3RyaW5nLCBvcHRpb25zPzogRGlhbG9nUHJvbXB0T3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSBgXHJcbiAgICAgICAgICAgIDxzY3JpcHQgdHlwZT1cInRleHQvdGVtcGxhdGVcIj5cclxuICAgICAgICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwidWktbW9kYWxcIiBkYXRhLXJvbGU9XCJwb3B1cFwiIGRhdGEtY29ybmVycz1cImZhbHNlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzPVwidWktdGl0bGUge3tfdGl0bGVTdGF0ZX19XCI+e3t0aXRsZX19PC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9XCJ1aS1tZXNzYWdlXCI+e3ttZXNzYWdlfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJfdWktcHJvbXB0XCIgY2xhc3M9XCJ1aS1oaWRkZW4tYWNjZXNzaWJsZVwiPjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIG5hbWU9XCJfdWktcHJvbXB0XCIgaWQ9XCJfdWktcHJvbXB0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVpLW1vZGFsLWZvb3RlciB1aS1ncmlkLWFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBpZD1cInt7aWROZWdhdGl2ZX19XCIgY2xhc3M9XCJ1aS1idG4gdWktYmxvY2stYVwiIGRhdGEtYXV0by1jbG9zZT1cInRydWVcIj57e2xhYmVsTmVnYXRpdmV9fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPVwie3tpZFBvc2l0aXZlfX1cIiBjbGFzcz1cImNvbW1hbmQtcHJvbXB0LW9rIHVpLWJ0biB1aS1ibG9jay1iIHVpLXRleHQtZW1waGFzaXNcIiBkYXRhLWF1dG8tY2xvc2U9XCJmYWxzZVwiPnt7bGFiZWxQb3NpdGl2ZX19PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L3NlY3Rpb24+XHJcbiAgICAgICAgICAgIDwvc2NyaXB0PlxyXG4gICAgICAgIGA7XHJcblxyXG4gICAgICAgIGNvbnN0IGRsZ1Byb21wdCA9IG5ldyBEaWFsb2dQcm9tcHQodGVtcGxhdGUsICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgIHNyYzogbnVsbCxcclxuICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcclxuICAgICAgICB9LCBvcHRpb25zKSk7XHJcblxyXG4gICAgICAgIHJldHVybiBkbGdQcm9tcHQuc2hvdygpO1xyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBSb3V0ZXIgICAgICAgPSBDRFAuRnJhbWV3b3JrLlJvdXRlcjtcclxuICAgIGltcG9ydCBJUGFnZSAgICAgICAgPSBDRFAuRnJhbWV3b3JrLklQYWdlO1xyXG4gICAgaW1wb3J0IE1vZGVsICAgICAgICA9IENEUC5GcmFtZXdvcmsuTW9kZWw7XHJcbiAgICBpbXBvcnQgVmlldyAgICAgICAgID0gQ0RQLkZyYW1ld29yay5WaWV3O1xyXG4gICAgaW1wb3J0IFZpZXdPcHRpb25zICA9IENEUC5GcmFtZXdvcmsuVmlld09wdGlvbnM7XHJcbiAgICBpbXBvcnQgVGVtcGxhdGUgICAgID0gQ0RQLlRvb2xzLlRlbXBsYXRlO1xyXG4gICAgaW1wb3J0IEpTVCAgICAgICAgICA9IENEUC5Ub29scy5KU1Q7XHJcblxyXG4gICAgY29uc3QgVEFHOiBzdHJpbmcgPSBcIltDRFAuVUkuQmFzZUhlYWRlclZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBCYXNlSGVhZGVyVmlld09wdGlvbnNcclxuICAgICAqIEBicmllZiBCYXNlSGVhZGVyVmlldyDjgavmjIflrprjgZnjgovjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCYXNlSGVhZGVyVmlld09wdGlvbnM8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBWaWV3T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBiYXNlVGVtcGxhdGU/OiBKU1Q7ICAgICAgICAgICAgIC8vITwg5Zu65a6a44OY44OD44OA55SoIEphdmFTY3JpcHQg44OG44Oz44OX44Os44O844OILlxyXG4gICAgICAgIGJhY2tDb21tYW5kU2VsZWN0b3I/OiBzdHJpbmc7ICAgLy8hPCBcIuaIu+OCi1wi44Kz44Oe44Oz44OJ44K744Os44Kv44K/LiBkZWZhdWx0OiBcImNvbW1hbmQtYmFja1wiXHJcbiAgICAgICAgYmFja0NvbW1hbmRLaW5kPzogc3RyaW5nOyAgICAgICAvLyE8IFwi5oi744KLXCLjgrPjg57jg7Pjg4nnqK7liKUgKG9uQ29tbWFuZCDnrKwy5byV5pWwKS4gZGVmYXVsdDogXCJwYWdlYmFja1wiXHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBCYXNlSGVhZGVyVmlld1xyXG4gICAgICogQGJyaWVmIOWFsemAmuODmOODg+ODgOOCkuaTjeS9nOOBmeOCi+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgQmFzZUhlYWRlclZpZXc8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBWaWV3PFRNb2RlbD4ge1xyXG5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBzXyRoZWFkZXJCYXNlOiBKUXVlcnk7ICAgLy8hPCDjg5rjg7zjgrjlpJbjgavphY3nva7jgZXjgozjgovlhbHpgJrjg5jjg4Pjg4Djga7jg5njg7zjgrnpg6jlk4HnlKggalF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHNfcmVmQ291bnQgPSAwOyAgICAgICAgICAvLyE8IOWPgueFp+OCq+OCpuODs+ODiFxyXG4gICAgICAgIHByaXZhdGUgX3RlbXBsYXRlOiBKU1Q7XHJcbiAgICAgICAgcHJpdmF0ZSBfaGFzQmFja0luZGljYXRvcjogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB7SVBhZ2V9IF9vd25lciBbaW5dIOOCquODvOODiuODvOODmuODvOOCuOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX293bmVyOiBJUGFnZSwgcHJpdmF0ZSBfb3B0aW9ucz86IEJhc2VIZWFkZXJWaWV3T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKF9vcHRpb25zID0gJC5leHRlbmQoe1xyXG4gICAgICAgICAgICAgICAgZWw6IF9vd25lci4kcGFnZS5maW5kKFwiW2RhdGEtcm9sZT0naGVhZGVyJ11cIiksXHJcbiAgICAgICAgICAgICAgICBiYWNrQ29tbWFuZFNlbGVjdG9yOiBcIi5jb21tYW5kLWJhY2tcIixcclxuICAgICAgICAgICAgICAgIGJhY2tDb21tYW5kS2luZDogXCJwYWdlYmFja1wiLFxyXG4gICAgICAgICAgICB9LCBfb3B0aW9ucykpO1xyXG5cclxuICAgICAgICAgICAgLy8gdGVtcGxhdGUg6Kit5a6aXHJcbiAgICAgICAgICAgIGlmIChfb3B0aW9ucy5iYXNlVGVtcGxhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RlbXBsYXRlID0gX29wdGlvbnMuYmFzZVRlbXBsYXRlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBUZW1wbGF0ZS5nZXRKU1QoYFxyXG4gICAgICAgICAgICAgICAgICAgIDxzY3JpcHQgdHlwZT0ndGV4dC90ZW1wbGF0ZSc+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoZWFkZXIgY2xhc3M9J3VpLWhlYWRlci1iYXNlIHVpLWJvZHkte3t0aGVtZX19Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J3VpLWZpeGVkLWJhY2staW5kaWNhdG9yJz48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9oZWFkZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zY3JpcHQ+XHJcbiAgICAgICAgICAgICAgICBgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQmFja2JvbmUuVmlldyDnlKjjga7liJ3mnJ/ljJZcclxuICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50KHRoaXMuJGVsLCB0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5Yid5pyf5YyWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNyZWF0ZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVIZWFkZXJCYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmnInlirnljJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgYWN0aXZhdGUoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2hvd0luZGljYXRvcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog54Sh5Yq55YyWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGluYWN0aXZhdGUoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaGlkZUluZGljYXRvcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog56C05qOEXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHJlbGVhc2UoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVsZWFzZUhlYWRlckJhc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vISDlhbHpgJrjg5jjg4Pjg4Djga7jg5njg7zjgrnjgpLmupblgplcclxuICAgICAgICBwcml2YXRlIGNyZWF0ZUhlYWRlckJhc2UoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgLy8g5Zu65a6a44OY44OD44OA44Gu44Go44GN44Gr5pyJ5Yq55YyWXHJcbiAgICAgICAgICAgIGlmIChcImZpeGVkXCIgPT09IHRoaXMuX293bmVyLiRoZWFkZXIuanFtRGF0YShcInBvc2l0aW9uXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCA9PSBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSA9ICQodGhpcy5fdGVtcGxhdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGVtZTogdGhpcy5fb3duZXIuJHBhZ2UuanFtRGF0YShcInRoZW1lXCIpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfcmVmQ291bnQrKztcclxuICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UuYXBwZW5kVG8oJChkb2N1bWVudC5ib2R5KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQmFjayBJbmRpY2F0b3Ig44KS5oyB44Gj44Gm44GE44KL44GL5Yik5a6aXHJcbiAgICAgICAgICAgIGlmICgwIDwgdGhpcy4kZWwuZmluZChcIi51aS1iYWNrLWluZGljYXRvclwiKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hhc0JhY2tJbmRpY2F0b3IgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGluZGljYXRvciDjga7ooajnpLpcclxuICAgICAgICBwcml2YXRlIHNob3dJbmRpY2F0b3IoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgLy8gQmFjayBJbmRpY2F0b3Ig44KS5oyB44Gj44Gm44GE44Gq44GE5aC05ZCI6KGo56S644GX44Gq44GEXHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UgJiYgdGhpcy5faGFzQmFja0luZGljYXRvcikge1xyXG4gICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZS5maW5kKFwiLnVpLWZpeGVkLWJhY2staW5kaWNhdG9yXCIpLmFkZENsYXNzKFwic2hvd1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBpbmRpY2F0b3Ig44Gu6Z2e6KGo56S6XHJcbiAgICAgICAgcHJpdmF0ZSBoaWRlSW5kaWNhdG9yKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UpIHtcclxuICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UuZmluZChcIi51aS1maXhlZC1iYWNrLWluZGljYXRvclwiKS5yZW1vdmVDbGFzcyhcInNob3dcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YWx6YCa44OY44OD44OA44Gu44OZ44O844K544KS56C05qOEXHJcbiAgICAgICAgcHJpdmF0ZSByZWxlYXNlSGVhZGVyQmFzZSgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBCYXNlSGVhZGVyVmlldy5zXyRoZWFkZXJCYXNlKSB7XHJcbiAgICAgICAgICAgICAgICBCYXNlSGVhZGVyVmlldy5zX3JlZkNvdW50LS07XHJcbiAgICAgICAgICAgICAgICBpZiAoMCA9PT0gQmFzZUhlYWRlclZpZXcuc19yZWZDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2UucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgQmFzZUhlYWRlclZpZXcuc18kaGVhZGVyQmFzZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIEJhc2VIZWFkZXJWaWV3LnNfJGhlYWRlckJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBCYWNrYm9uZS5WaWV3XHJcblxyXG4gICAgICAgIC8vISBldmVudHMgYmluZGluZ1xyXG4gICAgICAgIGV2ZW50cygpOiBhbnkge1xyXG4gICAgICAgICAgICBjb25zdCBldmVudE1hcCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucykge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRNYXBbXCJ2Y2xpY2sgXCIgKyB0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kU2VsZWN0b3JdID0gdGhpcy5vbkNvbW1hbmRCYWNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBldmVudE1hcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBiYWNrIOOBruODj+ODs+ODieODqVxyXG4gICAgICAgIHByaXZhdGUgb25Db21tYW5kQmFjayhldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGxldCBoYW5kbGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vd25lcikge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlZCA9IHRoaXMuX293bmVyLm9uQ29tbWFuZChldmVudCwgdGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEtpbmQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghaGFuZGxlZCkge1xyXG4gICAgICAgICAgICAgICAgUm91dGVyLmJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBGcmFtZXdvcmsgPSBDRFAuRnJhbWV3b3JrO1xyXG5cclxuICAgIGNvbnN0IFRBRzogc3RyaW5nID0gXCJbQ0RQLlVJLkJhc2VQYWdlXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgQmFzZVBhZ2VPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgQmFzZVBhZ2Ug44Gr5oyH5a6a44GZ44KL44Kq44OX44K344On44Oz44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFzZVBhZ2VPcHRpb25zPFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuUGFnZUNvbnN0cnVjdE9wdGlvbnMsIEJhc2VIZWFkZXJWaWV3T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBiYXNlSGVhZGVyPzogbmV3IChvd25lcjogRnJhbWV3b3JrLklQYWdlLCBvcHRpb25zPzogQmFzZUhlYWRlclZpZXdPcHRpb25zPFRNb2RlbD4pID0+IEJhc2VIZWFkZXJWaWV3PFRNb2RlbD47ICAgLy8hPCBIZWFkZXIg5qmf6IO944KS5o+Q5L6b44GZ44KL5Z+65bqV44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgYmFja0NvbW1hbmRIYW5kbGVyPzogc3RyaW5nOyAgICAgICAgICAgICAgICAvLyE8IFwi5oi744KLXCIg44Kz44Oe44Oz44OJ44OP44Oz44OJ44Op44Oh44K944OD44OJ5ZCNLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogb25QYWdlQmFja1xyXG4gICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zOyAgLy8hPCBET03mi6HlvLXjgavmuKHjgZnjgqrjg5fjgrfjg6fjg7MuIG51bGx8dW5kZWZpbmVkIOOCkuaMh+WumuOBmeOCi+OBqOaLoeW8teOBl+OBquOBhCBkZWZhdWx0OiB7fVxyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgQmFzZVBhZ2VcclxuICAgICAqIEBicmllZiBIZWFkZXIg44KS5YKZ44GI44KLIFBhZ2Ug44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBCYXNlUGFnZTxUTW9kZWwgZXh0ZW5kcyBGcmFtZXdvcmsuTW9kZWwgPSBGcmFtZXdvcmsuTW9kZWw+IGV4dGVuZHMgRnJhbWV3b3JrLlBhZ2Uge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9iYXNlSGVhZGVyOiBCYXNlSGVhZGVyVmlldzxUTW9kZWw+OyAgICAvLyE8IOODmOODg+ODgOOCr+ODqeOCuVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHtTdHJpbmd9ICAgICAgICAgIHVybCAgICAgICBbaW5dIOODmuODvOOCuCBVUkxcclxuICAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgaWQgICAgICAgIFtpbl0g44Oa44O844K4IElEXHJcbiAgICAgICAgICogQHBhcmFtIHtCYXNlUGFnZU9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBwcml2YXRlIF9vcHRpb25zPzogQmFzZVBhZ2VPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIodXJsLCBpZCwgX29wdGlvbnMgPSAkLmV4dGVuZCh7XHJcbiAgICAgICAgICAgICAgICBiYXNlSGVhZGVyOiBCYXNlSGVhZGVyVmlldyxcclxuICAgICAgICAgICAgICAgIGJhY2tDb21tYW5kSGFuZGxlcjogXCJvblBhZ2VCYWNrXCIsXHJcbiAgICAgICAgICAgICAgICBiYWNrQ29tbWFuZEtpbmQ6IFwicGFnZWJhY2tcIixcclxuICAgICAgICAgICAgICAgIGRvbUV4dGVuc2lvbk9wdGlvbnM6IHt9LFxyXG4gICAgICAgICAgICB9LCBfb3B0aW9ucykpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBPdmVycmlkZTogRnJhbWV3b3JrIFBhZ2VcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVjcmVhdGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUNyZWF0ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLmJhc2VIZWFkZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jhc2VIZWFkZXIgPSBuZXcgdGhpcy5fb3B0aW9ucy5iYXNlSGVhZGVyKHRoaXMsIHRoaXMuX29wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlci5jcmVhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVDcmVhdGUoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VjcmVhdGVcIiDjgavlr77lv5xcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUluaXQoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9vcHRpb25zLmRvbUV4dGVuc2lvbk9wdGlvbnMpIHtcclxuICAgICAgICAgICAgICAgIEV4dGVuc2lvbk1hbmFnZXIuYXBwbHlEb21FeHRlbnNpb24odGhpcy4kcGFnZSwgdGhpcy5fb3B0aW9ucy5kb21FeHRlbnNpb25PcHRpb25zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VJbml0KGV2ZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmFzZUhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlci5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZUJlZm9yZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iYXNlSGVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyLmluYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VCZWZvcmVIaWRlKGV2ZW50LCBkYXRhKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VSZW1vdmUoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmFzZUhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFzZUhlYWRlci5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYXNlSGVhZGVyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzdXBlci5vblBhZ2VSZW1vdmUoZXZlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSC9XIEJhY2sgQnV0dG9uIOODj+ODs+ODieODqVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtICBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIGV2ZW50IG9iamVjdFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaXouWumuOBruWHpueQhuOCkuihjOOCj+OBquOBhCAvIGZhbHNlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgYZcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkhhcmR3YXJlQmFja0J1dHRvbihldmVudD86IEpRdWVyeS5FdmVudCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBsZXQgcmV0dmFsID0gc3VwZXIub25IYXJkd2FyZUJhY2tCdXR0b24oZXZlbnQpO1xyXG4gICAgICAgICAgICBpZiAoIXJldHZhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dmFsID0gdGhpcy5vbkNvbW1hbmQoZXZlbnQsIHRoaXMuX29wdGlvbnMuYmFja0NvbW1hbmRLaW5kKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0dmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBPdmVycmlkZTogQ3VzdG9tIEV2ZW50XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFwi5oi744KLXCIgZXZlbnQg55m66KGM5pmC44Gr44Kz44O844Or44GV44KM44KLXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgo/jgarjgYQgLyBmYWxzZTog5pei5a6a44Gu5Yem55CG44KS6KGM44GGXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25Db21tYW5kKGV2ZW50OiBKUXVlcnkuRXZlbnQsIGtpbmQ6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEtpbmQgPT09IGtpbmQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9vd25lciAmJiB0aGlzLl9vd25lclt0aGlzLl9vcHRpb25zLmJhY2tDb21tYW5kSGFuZGxlcl0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXJbdGhpcy5fb3B0aW9ucy5iYWNrQ29tbWFuZEhhbmRsZXJdKGV2ZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcbiAgICBpbXBvcnQgUHJvbWlzZSAgICAgID0gQ0RQLlByb21pc2U7XHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrICAgID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZVZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQYWdlVmlld0NvbnN0cnVjdE9wdGlvbnNcclxuICAgICAqIEBicmllZiBSb3V0ZXIg44G444Gu55m76Yyy5oOF5aCx44GoIEJhY2tib25lLlZpZXcg44G444Gu5Yid5pyf5YyW5oOF5aCx44KS5qC857SN44GZ44KL44Kk44Oz44K/44O844OV44Kn44Kk44K544Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgUGFnZVZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBCYXNlUGFnZU9wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgYmFzZVBhZ2U/OiBuZXcgKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogRnJhbWV3b3JrLlBhZ2VDb25zdHJ1Y3RPcHRpb25zKSA9PiBGcmFtZXdvcmsuUGFnZTsgICAgLy8hPCBQYWdlIOapn+iDveOCkuaPkOS+m+OBmeOCi+WfuuW6leOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgfVxyXG5cclxuICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXVzZS1iZWZvcmUtZGVjbGFyZSAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFBhZ2VDb250YWluZXJPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgUGFnZUNvbnRhaW5lciDjga7jgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBQYWdlQ29udGFpbmVyT3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBGcmFtZXdvcmsuTW9kZWwgPSBGcmFtZXdvcmsuTW9kZWw+IGV4dGVuZHMgRnJhbWV3b3JrLlZpZXdPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIG93bmVyOiBQYWdlVmlldztcclxuICAgICAgICAkZWw/OiBKUXVlcnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgUGFnZUNvbnRhaW5lclZpZXdcclxuICAgICAqIEBicmllZiBQYWdlVmlldyDjgajpgKPmkLrlj6/og73jgaog44Kz44Oz44OG44OK44OT44Ol44O844Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlQ29udGFpbmVyVmlldzxUTW9kZWwgZXh0ZW5kcyBGcmFtZXdvcmsuTW9kZWwgPSBGcmFtZXdvcmsuTW9kZWw+IGV4dGVuZHMgRnJhbWV3b3JrLlZpZXc8VE1vZGVsPiB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX293bmVyOiBQYWdlVmlldyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9uczogUGFnZUNvbnRhaW5lck9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5fb3duZXIgPSBvcHRpb25zLm93bmVyO1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy4kZWwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlcyA9ICg8YW55PnRoaXMpLmV2ZW50cyA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudChvcHRpb25zLiRlbCwgZGVsZWdhdGVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBzaG9ydCBjdXQgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEgT3duZXIg5Y+W5b6XXHJcbiAgICAgICAgZ2V0IG93bmVyKCk6IFBhZ2VWaWV3IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8qIHRzbGludDplbmFibGU6bm8tdXNlLWJlZm9yZS1kZWNsYXJlICovXHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQYWdlVmlld1xyXG4gICAgICogQGJyaWVmIENEUC5GcmFtZXdvcmsuUGFnZSDjgaggQmFja2JvbmUuVmlldyDjga7kuKHmlrnjga7mqZ/og73jgpLmj5DkvpvjgZnjgovjg5rjg7zjgrjjga7ln7rlupXjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VWaWV3PFRNb2RlbCBleHRlbmRzIEZyYW1ld29yay5Nb2RlbCA9IEZyYW1ld29yay5Nb2RlbD4gZXh0ZW5kcyBGcmFtZXdvcmsuVmlldzxUTW9kZWw+IGltcGxlbWVudHMgRnJhbWV3b3JrLklQYWdlLCBJU3RhdHVzTWFuYWdlciB7XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBfcGFnZU9wdGlvbnM6IFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+ID0gbnVsbDtcclxuICAgICAgICBwcm90ZWN0ZWQgX2Jhc2VQYWdlOiBGcmFtZXdvcmsuUGFnZSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfc3RhdHVzTWdyOiBTdGF0dXNNYW5hZ2VyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB1cmwgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgIFtpbl0g44Oa44O844K4IFVSTFxyXG4gICAgICAgICAqIEBwYXJhbSBpZCAgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgIFtpbl0g44Oa44O844K4IElEXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge1BhZ2VWaWV3Q29uc3RydWN0T3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3Rvcih1cmw6IHN0cmluZywgaWQ6IHN0cmluZywgb3B0aW9ucz86IFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gUGFnZVZpZXcg6Kit5a6aXHJcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VPcHRpb25zID0gJC5leHRlbmQoe30sIHsgb3duZXI6IHRoaXMgfSwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jhc2VQYWdlID0gdGhpcy5fcGFnZU9wdGlvbnMuYmFzZVBhZ2UgPyBuZXcgdGhpcy5fcGFnZU9wdGlvbnMuYmFzZVBhZ2UodXJsLCBpZCwgdGhpcy5fcGFnZU9wdGlvbnMpIDogbmV3IEJhc2VQYWdlKHVybCwgaWQsIHRoaXMuX3BhZ2VPcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFN0YXR1c01hbmFnZXJcclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzTWdyID0gbmV3IFN0YXR1c01hbmFnZXIoKTtcclxuICAgICAgICAgICAgLy8gQmFja2JvbmUuVmlldyDnlKjjga7liJ3mnJ/ljJZcclxuICAgICAgICAgICAgY29uc3QgZGVsZWdhdGVzID0gKDxhbnk+dGhpcykuZXZlbnRzID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQodGhpcy4kcGFnZSwgZGVsZWdhdGVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSVN0YXR1c01hbmFnZXIg54q25oWL566h55CGXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruOCpOODs+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyB7U3RyaW5nfSBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXR1c0FkZFJlZihzdGF0dXM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNNZ3Iuc3RhdHVzQWRkUmVmKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jg4fjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMge1N0cmluZ30gW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0dXNSZWxlYXNlKHN0YXR1czogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1c01nci5zdGF0dXNSZWxlYXNlKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlh6bnkIbjgrnjgrPjg7zjg5fmr47jgavnirbmhYvlpInmlbDjgpLoqK3lrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMgICB7U3RyaW5nfSAgIFtpbl0g54q25oWL6K2Y5Yil5a2QXHJcbiAgICAgICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn0gW2luXSDlh6bnkIbjgrPjg7zjg6vjg5Djg4Pjgq9cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0dXNTY29wZShzdGF0dXM6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzTWdyLnN0YXR1c1Njb3BlKHN0YXR1cywgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44Gf54q25oWL5Lit44Gn44GC44KL44GL56K66KqNXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdHVzIHtTdHJpbmd9ICAgW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDnirbmhYvlhoUgLyBmYWxzZTog54q25oWL5aSWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNTdGF0dXNJbihzdGF0dXM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzTWdyLmlzU3RhdHVzSW4oc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSVBhZ2Ugc3R1YiBzdHVmZi5cclxuXHJcbiAgICAgICAgZ2V0IGFjdGl2ZSgpOiBib29sZWFuICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLmFjdGl2ZTsgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHVybCgpOiBzdHJpbmcgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLnVybDsgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGlkKCk6IHN0cmluZyAgICAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlID8gdGhpcy5fYmFzZVBhZ2UuaWQgOiBudWxsOyB9XHJcbiAgICAgICAgZ2V0ICRwYWdlKCk6IEpRdWVyeSAgICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLiRwYWdlOyAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0ICRoZWFkZXIoKTogSlF1ZXJ5ICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLiRoZWFkZXI7ICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0ICRmb290ZXIoKTogSlF1ZXJ5ICAgICAgICAgICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLiRmb290ZXI7ICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGludGVudCgpOiBGcmFtZXdvcmsuSW50ZW50ICAgICAgICAgIHsgcmV0dXJuIHRoaXMuX2Jhc2VQYWdlLmludGVudDsgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgc2V0IGludGVudChuZXdJbnRlbnQ6IEZyYW1ld29yay5JbnRlbnQpIHsgdGhpcy5fYmFzZVBhZ2UuaW50ZW50ID0gbmV3SW50ZW50OyAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE9yaWVudGF0aW9uIOOBruWkieabtOOCkuWPl+S/oVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG5ld09yaWVudGF0aW9uIHtPcmllbnRhdGlvbn0gW2luXSBuZXcgb3JpZW50YXRpb24gY29kZS5cclxuICAgICAgICAgKi9cclxuICAgICAgICBvbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbjogRnJhbWV3b3JrLk9yaWVudGF0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIL1cgQmFjayBCdXR0b24g44OP44Oz44OJ44OpXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0gZXZlbnQgb2JqZWN0XHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5pei5a6a44Gu5Yem55CG44KS6KGM44KP44Gq44GEIC8gZmFsc2U6IOaXouWumuOBruWHpueQhuOCkuihjOOBhlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uSGFyZHdhcmVCYWNrQnV0dG9uKGV2ZW50PzogSlF1ZXJ5LkV2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJvdXRlciBcImJlZm9yZSByb3V0ZSBjaGFuZ2VcIiDjg4/jg7Pjg4njg6lcclxuICAgICAgICAgKiDjg5rjg7zjgrjpgbfnp7vnm7TliY3jgavpnZ7lkIzmnJ/lh6bnkIbjgpLooYzjgYbjgZPjgajjgYzlj6/og71cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0lQcm9taXNlQmFzZX0gUHJvbWlzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkJlZm9yZVJvdXRlQ2hhbmdlKCk6IElQcm9taXNlQmFzZTxhbnk+IHtcclxuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5rGO55So44Kz44Oe44Oz44OJ44KS5Y+X5L+hXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0gZXZlbnQgb2JqZWN0XHJcbiAgICAgICAgICogQHBhcmFtICBldmVudCB7a2luZH0gICAgICAgICAgICAgIFtpbl0gY29tbWFuZCBraW5kIHN0cmluZ1xyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaXouWumuOBruWHpueQhuOCkuihjOOCj+OBquOBhCAvIGZhbHNlOiDml6Llrprjga7lh6bnkIbjgpLooYzjgYZcclxuICAgICAgICAgKi9cclxuICAgICAgICBvbkNvbW1hbmQoZXZlbnQ/OiBKUXVlcnkuRXZlbnQsIGtpbmQ/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5pyA5Yid44GuIE9uUGFnZUluaXQoKSDjga7jgajjgY3jgavjga7jgb/jgrPjg7zjg6vjgZXjgozjgotcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBldmVudCB7SlF1ZXJ5LkV2ZW50fSBbaW5dIOOCpOODmeODs+ODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uSW5pdGlhbGl6ZShldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWJlZm9yZWNyZWF0ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlQmVmb3JlQ3JlYXRlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50KHRoaXMuJHBhZ2UsIHRydWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2VjcmVhdGVcIiAo5penOlwicGFnZWluaXRcIikg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VJbml0KGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gT3ZlcnJpZGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGpRTSBldmVudDogXCJwYWdlYmVmb3Jlc2hvd1wiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VCZWZvcmVTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIGRhdGEgIHtTaG93RXZlbnREYXRhfSAgICAgW2luXSDku5jliqDmg4XloLFcclxuICAgICAgICAgKi9cclxuICAgICAgICBvblBhZ2VTaG93KGV2ZW50OiBKUXVlcnkuRXZlbnQsIGRhdGE/OiBGcmFtZXdvcmsuU2hvd0V2ZW50RGF0YSk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBPdmVycmlkZVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVoaWRlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUJlZm9yZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZWNvbnRhaW5lcmhpZGVcIiAo5penOlwicGFnZWhpZGVcIikg44Gr5a++5b+cXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQge0pRdWVyeS5FdmVudH0gW2luXSDjgqTjg5njg7Pjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gZGF0YSAge0hpZGVFdmVudERhdGF9ICAgICBbaW5dIOS7mOWKoOaDheWgsVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uUGFnZUhpZGUoZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5IaWRlRXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIE92ZXJyaWRlXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBqUU0gZXZlbnQ6IFwicGFnZXJlbW92ZVwiIOOBq+WvvuW/nFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IHtKUXVlcnkuRXZlbnR9IFtpbl0g44Kk44OZ44Oz44OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgTW9kZWwgPSBDRFAuRnJhbWV3b3JrLk1vZGVsO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5QYWdlTGlzdFZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgUGFnZUxpc3RWaWV3IOOBuOOBruWIneacn+WMluaDheWgseOCkuagvOe0jeOBmeOCi+OCpOODs+OCv+ODvOODleOCp+OCpOOCueOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFBhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBMaXN0Vmlld09wdGlvbnMsIFBhZ2VWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBhdXRvRGVzdG9yeUVsZW1lbnQ/OiBib29sZWFuOyAgICAgICAgLy8hPCDjg5rjg7zjgrjpgbfnp7vliY3jgasgTGlzdCBFbGVtZW50IOOCkuegtOajhOOBmeOCi+WgtOWQiOOBryB0cnVlIOOCkuaMh+WumlxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIOS7ruaDs+ODquOCueODiOODk+ODpeODvOapn+iDveOCkuaMgeOBpCBQYWdlVmlldyDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VMaXN0VmlldzxUTW9kZWwgZXh0ZW5kcyBNb2RlbCA9IE1vZGVsPiBleHRlbmRzIFBhZ2VWaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJTGlzdFZpZXcge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9zY3JvbGxNZ3I6IFNjcm9sbE1hbmFnZXIgPSBudWxsOyAgICAvLyE8IHNjcm9sbCDjgrPjgqLjg63jgrjjg4Pjgq9cclxuICAgICAgICBwcml2YXRlIF9uZWVkUmVidWlsZDogYm9vbGVhbiA9IGZhbHNlOyAgICAgICAvLyE8IOODmuODvOOCuOihqOekuuaZguOBqyByZWJ1aWxkKCkg44KS44Kz44O844Or44GZ44KL44Gf44KB44Gu5YaF6YOo5aSJ5pWwXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdXJsICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIHRlbXBsYXRlIOOBq+S9v+eUqOOBmeOCiyBVUkxcclxuICAgICAgICAgKiBAcGFyYW0gaWQgICAgICB7U3RyaW5nfSAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwYWdlIOOBq+aMr+OCieOCjOOBnyBJRFxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHVybDogc3RyaW5nLCBpZDogc3RyaW5nLCBvcHRpb25zPzogUGFnZUxpc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHVybCwgaWQsICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgICAgICBhdXRvRGVzdG9yeUVsZW1lbnQ6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LCBvcHRpb25zKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nciA9IG5ldyBTY3JvbGxNYW5hZ2VyKG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHJlYnVpbGQoKSDjga7jgrnjgrHjgrjjg6Xjg7zjg6rjg7PjgrBcclxuICAgICAgICBwdWJsaWMgcmVzZXJ2ZVJlYnVpbGQoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX25lZWRSZWJ1aWxkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IFBhZ2VWaWV3XHJcblxyXG4gICAgICAgIC8vISBPcmllbnRhdGlvbiDjga7lpInmm7TmpJznn6VcclxuICAgICAgICBvbk9yaWVudGF0aW9uQ2hhbmdlZChuZXdPcmllbnRhdGlvbjogRnJhbWV3b3JrLk9yaWVudGF0aW9uKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zZXRCYXNlSGVpZ2h0KHRoaXMuZ2V0UGFnZUJhc2VIZWlnaHQoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Oa44O844K46YG356e755u05YmN44Kk44OZ44Oz44OI5Yem55CGXHJcbiAgICAgICAgb25CZWZvcmVSb3V0ZUNoYW5nZSgpOiBJUHJvbWlzZUJhc2U8YW55PiB7XHJcbiAgICAgICAgICAgIGlmICgoPFBhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPj50aGlzLl9wYWdlT3B0aW9ucykuYXV0b0Rlc3RvcnlFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5vbkJlZm9yZVJvdXRlQ2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgalFNIGV2ZW50OiBcInBhZ2ViZWZvcmVzaG93XCIg44Gr5a++5b+cXHJcbiAgICAgICAgb25QYWdlQmVmb3JlU2hvdyhldmVudDogSlF1ZXJ5LkV2ZW50LCBkYXRhPzogRnJhbWV3b3JrLlNob3dFdmVudERhdGEpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIub25QYWdlQmVmb3JlU2hvdyhldmVudCwgZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5pbml0aWFsaXplKHRoaXMuJHBhZ2UsIHRoaXMuZ2V0UGFnZUJhc2VIZWlnaHQoKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgalFNIGV2ZW50OiBcInBhZ2Vjb250YWluZXJzaG93XCIgKOaXpzpcInBhZ2VzaG93XCIpIOOBq+WvvuW/nFxyXG4gICAgICAgIG9uUGFnZVNob3coZXZlbnQ6IEpRdWVyeS5FdmVudCwgZGF0YT86IEZyYW1ld29yay5TaG93RXZlbnREYXRhKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uUGFnZVNob3coZXZlbnQsIGRhdGEpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3Iuc2V0QmFzZUhlaWdodCh0aGlzLmdldFBhZ2VCYXNlSGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbmVlZFJlYnVpbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVidWlsZCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbmVlZFJlYnVpbGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGpRTSBldmVudDogXCJwYWdlcmVtb3ZlXCIg44Gr5a++5b+cXHJcbiAgICAgICAgb25QYWdlUmVtb3ZlKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIub25QYWdlUmVtb3ZlKGV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9maWxlIOeuoeeQhlxyXG5cclxuICAgICAgICAvLyEg5Yid5pyf5YyW5riI44G/44GL5Yik5a6aXHJcbiAgICAgICAgaXNJbml0aWFsaXplZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5pc0luaXRpYWxpemVkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OX44Ot44OR44OG44Kj44KS5oyH5a6a44GX44Gm44CBTGlzdEl0ZW0g44KS566h55CGXHJcbiAgICAgICAgYWRkSXRlbShcclxuICAgICAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgICAgIGluaXRpYWxpemVyOiBuZXcgKG9wdGlvbnM/OiBhbnkpID0+IEJhc2VMaXN0SXRlbVZpZXcsXHJcbiAgICAgICAgICAgIGluZm86IGFueSxcclxuICAgICAgICAgICAgaW5zZXJ0VG8/OiBudW1iZXJcclxuICAgICAgICAgICAgKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FkZExpbmUobmV3IExpbmVQcm9maWxlKHRoaXMuX3Njcm9sbE1nciwgTWF0aC5mbG9vcihoZWlnaHQpLCBpbml0aWFsaXplciwgaW5mbyksIGluc2VydFRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ8gSXRlbSDjgpLliYrpmaRcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXIsIHNpemU/OiBudW1iZXIsIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXJbXSwgZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xyXG4gICAgICAgIHJlbW92ZUl0ZW0oaW5kZXg6IGFueSwgYXJnMj86IG51bWJlciwgYXJnMz86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVtb3ZlSXRlbShpbmRleCwgYXJnMiwgYXJnMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIEl0ZW0g44Gr6Kit5a6a44GX44Gf5oOF5aCx44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBudW1iZXIpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBKUXVlcnkuRXZlbnQpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmdldEl0ZW1JbmZvKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Ki44Kv44OG44Kj44OW44Oa44O844K444KS5pu05pawXHJcbiAgICAgICAgcmVmcmVzaCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlZnJlc2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmnKrjgqLjgrXjgqTjg7Pjg5rjg7zjgrjjgpLmp4vnr4lcclxuICAgICAgICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci51cGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5rjg7zjgrjjgqLjgrXjgqTjg7PjgpLlho3mp4vmiJBcclxuICAgICAgICByZWJ1aWxkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVidWlsZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeuoei9hOODh+ODvOOCv+OCkuegtOajhFxyXG4gICAgICAgIHJlbGVhc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9maWxlIEJhY2t1cCAvIFJlc3RvcmVcclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODkOODg+OCr+OCouODg+ODl1xyXG4gICAgICAgIGJhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODquOCueODiOOColxyXG4gICAgICAgIHJlc3RvcmUoa2V5OiBzdHJpbmcsIHJlYnVpbGQ6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJldHZhbCA9IHRoaXMuX3Njcm9sbE1nci5yZXN0b3JlKGtleSwgcmVidWlsZCk7XHJcbiAgICAgICAgICAgIGlmIChyZXR2YWwgJiYgIXJlYnVpbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzZXJ2ZVJlYnVpbGQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0dmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruacieeEoVxyXG4gICAgICAgIGhhc0JhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmhhc0JhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruegtOajhFxyXG4gICAgICAgIGNsZWFyQmFja3VwKGtleT86IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmNsZWFyQmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gr44Ki44Kv44K744K5XHJcbiAgICAgICAgZ2V0IGJhY2t1cERhdGEoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5iYWNrdXBEYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgU2Nyb2xsXHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgc2V0U2Nyb2xsSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldFNjcm9sbEhhbmRsZXIoaGFuZGxlciwgb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+e1guS6huOCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICBzZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldFNjcm9sbFN0b3BIYW5kbGVyKGhhbmRsZXIsIG9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3MoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRTY3JvbGxQb3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jga7mnIDlpKflgKTjgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3NNYXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRTY3JvbGxQb3NNYXgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNjcm9sbFRvKHBvcywgYW5pbWF0ZSwgdGltZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GV44KM44GfIExpc3RJdGVtVmlldyDjga7ooajnpLrjgpLkv53oqLxcclxuICAgICAgICBlbnN1cmVWaXNpYmxlKGluZGV4OiBudW1iZXIsIG9wdGlvbnM/OiBFbnN1cmVWaXNpYmxlT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuZW5zdXJlVmlzaWJsZShpbmRleCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9wZXJ0aWVzXHJcblxyXG4gICAgICAgIC8vISBjb3JlIGZyYW1ld29yayBhY2Nlc3NcclxuICAgICAgICBnZXQgY29yZSgpOiBJTGlzdFZpZXdGcmFtZXdvcmsge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgSW50ZXJuYWwgSS9GXHJcblxyXG4gICAgICAgIC8vISDnmbvpjLIgZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCi1xyXG4gICAgICAgIF9hZGRMaW5lKF9saW5lOiBhbnksIGluc2VydFRvPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5fYWRkTGluZShfbGluZSwgaW5zZXJ0VG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZDpcclxuXHJcbiAgICAgICAgLy8hIOODmuODvOOCuOOBruWfuua6luWApOOCkuWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgZ2V0UGFnZUJhc2VIZWlnaHQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuICQod2luZG93KS5oZWlnaHQoKSAtIHBhcnNlSW50KHRoaXMuJHBhZ2UuY3NzKFwicGFkZGluZy10b3BcIiksIDEwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IE1vZGVsID0gQ0RQLkZyYW1ld29yay5Nb2RlbDtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZUV4cGFuZGFibGVMaXN0Vmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgUGFnZUV4cGFuZGFibGVMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIOmWi+mWieODquOCueODiOODk+ODpeODvOapn+iDveOCkuaMgeOBpCBQYWdlVmlldyDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VFeHBhbmRhYmxlTGlzdFZpZXc8VE1vZGVsIGV4dGVuZHMgTW9kZWwgPSBNb2RlbD4gZXh0ZW5kcyBQYWdlTGlzdFZpZXc8VE1vZGVsPiBpbXBsZW1lbnRzIElFeHBhbmRhYmxlTGlzdFZpZXcge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9leHBhbmRNYW5hZ2VyOiBFeHBhbmRNYW5hZ2VyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB1cmwgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHBhZ2UgdGVtcGxhdGUg44Gr5L2/55So44GZ44KLIFVSTFxyXG4gICAgICAgICAqIEBwYXJhbSBpZCAgICAgIHtTdHJpbmd9ICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHBhZ2Ug44Gr5oyv44KJ44KM44GfIElEXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge1BhZ2VMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IodXJsOiBzdHJpbmcsIGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBQYWdlTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIodXJsLCBpZCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIgPSBuZXcgRXhwYW5kTWFuYWdlcih0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUV4cGFuZGFibGVMaXN0Vmlld1xyXG5cclxuICAgICAgICAvLyEg5paw6KaPIEdyb3VwUHJvZmlsZSDjgpLkvZzmiJBcclxuICAgICAgICBuZXdHcm91cChpZD86IHN0cmluZyk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLm5ld0dyb3VwKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnmbvpjLLmuIjjgb8gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0R3JvdXAoaWQ6IHN0cmluZyk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmdldEdyb3VwKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrKwx6ZqO5bGk44GuIEdyb3VwIOeZu+mMslxyXG4gICAgICAgIHJlZ2lzdGVyVG9wR3JvdXAodG9wR3JvdXA6IEdyb3VwUHJvZmlsZSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlZ2lzdGVyVG9wR3JvdXAodG9wR3JvdXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOesrDHpmo7lsaTjga4gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0VG9wR3JvdXBzKCk6IEdyb3VwUHJvZmlsZVtdIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuZ2V0VG9wR3JvdXBzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5bGV6ZaLICgx6ZqO5bGkKVxyXG4gICAgICAgIGV4cGFuZEFsbCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5leHBhbmRBbGwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgZnjgbnjgabjga7jgrDjg6vjg7zjg5fjgpLlj47mnZ8gKDHpmo7lsaQpXHJcbiAgICAgICAgY29sbGFwc2VBbGwoZGVsYXk/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5jb2xsYXBzZUFsbChkZWxheSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5bGV6ZaL5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNFeHBhbmRpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmlzRXhwYW5kaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5Y+O5p2f5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNDb2xsYXBzaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5pc0NvbGxhcHNpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDplovplonkuK3jgYvliKTlrppcclxuICAgICAgICBpc1N3aXRjaGluZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuaXNTd2l0Y2hpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBsYXlvdXQga2V5IOOCkuWPluW+l1xyXG4gICAgICAgIGdldCBsYXlvdXRLZXkoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIubGF5b3V0S2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGxheW91dCBrZXkg44KS6Kit5a6aXHJcbiAgICAgICAgc2V0IGxheW91dEtleShrZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLmxheW91dEtleSA9IGtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IFBhZ2VMaXN0Vmlld1xyXG5cclxuICAgICAgICAvLyEg44OH44O844K/44KS56C05qOEXHJcbiAgICAgICAgcmVsZWFzZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlbGVhc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg5Djg4Pjgq/jgqLjg4Pjg5dcclxuICAgICAgICBiYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuYmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44Oq44K544OI44KiXHJcbiAgICAgICAgcmVzdG9yZShrZXk6IHN0cmluZywgcmVidWlsZDogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIucmVzdG9yZShrZXksIHJlYnVpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKipcclxuICogalF1ZXJ5IHBsdWdpbiBkZWZpbml0aW9uXHJcbiAqL1xyXG5pbnRlcmZhY2UgSlF1ZXJ5IHtcclxuICAgIHJpcHBsZShvcHRpb25zPzogQ0RQLlVJLkRvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnk7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICBpbXBvcnQgRnJhbWV3b3JrID0gQ0RQLkZyYW1ld29yaztcclxuXHJcbiAgICAvLyEgalF1ZXJ5IHBsdWdpblxyXG4gICAgJC5mbi5yaXBwbGUgPSBmdW5jdGlvbiAob3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpIHtcclxuICAgICAgICBjb25zdCAkZWwgPSAkKHRoaXMpO1xyXG4gICAgICAgIHJldHVybiAkZWwub24oRnJhbWV3b3JrLlBhdGNoLnNfdmNsaWNrRXZlbnQsIGZ1bmN0aW9uIChldmVudDogSlF1ZXJ5LkV2ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1cmZhY2UgPSAkKHRoaXMpO1xyXG5cclxuICAgICAgICAgICAgLy8gY3JlYXRlIHN1cmZhY2UgaWYgaXQgZG9lc24ndCBleGlzdFxyXG4gICAgICAgICAgICBpZiAoc3VyZmFjZS5maW5kKFwiLnVpLXJpcHBsZS1pbmtcIikubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBzdXJmYWNlLnByZXBlbmQoXCI8ZGl2IGNsYXNzPSd1aS1yaXBwbGUtaW5rJz48L2Rpdj5cIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCBpbmsgPSBzdXJmYWNlLmZpbmQoXCIudWktcmlwcGxlLWlua1wiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIHN0b3AgdGhlIHByZXZpb3VzIGFuaW1hdGlvblxyXG4gICAgICAgICAgICBpbmsucmVtb3ZlQ2xhc3MoXCJ1aS1yaXBwbGUtYW5pbWF0ZVwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGluayBzaXplOlxyXG4gICAgICAgICAgICBpZiAoIWluay5oZWlnaHQoKSAmJiAhaW5rLndpZHRoKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGQgPSBNYXRoLm1heChzdXJmYWNlLm91dGVyV2lkdGgoKSwgc3VyZmFjZS5vdXRlckhlaWdodCgpKTtcclxuICAgICAgICAgICAgICAgIGluay5jc3MoeyBoZWlnaHQ6IGQsIHdpZHRoOiBkIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB4ID0gZXZlbnQucGFnZVggLSBzdXJmYWNlLm9mZnNldCgpLmxlZnQgLSAoaW5rLndpZHRoKCkgLyAyKTtcclxuICAgICAgICAgICAgY29uc3QgeSA9IGV2ZW50LnBhZ2VZIC0gc3VyZmFjZS5vZmZzZXQoKS50b3AgLSAoaW5rLmhlaWdodCgpIC8gMik7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByaXBwbGVDb2xvciA9IHN1cmZhY2UuZGF0YShcInJpcHBsZS1jb2xvclwiKTtcclxuXHJcbiAgICAgICAgICAgIC8vIGFuaW1hdGlvbiBlbmQgaGFuZGxlclxyXG4gICAgICAgICAgICBjb25zdCBBTklNQVRJT05fRU5EX0VWRU5UID0gXCJhbmltYXRpb25lbmQgd2Via2l0QW5pbWF0aW9uRW5kXCI7XHJcbiAgICAgICAgICAgIGluay5vbihBTklNQVRJT05fRU5EX0VWRU5ULCBmdW5jdGlvbiAoZXY6IEpRdWVyeS5FdmVudCkge1xyXG4gICAgICAgICAgICAgICAgaW5rLm9mZigpO1xyXG4gICAgICAgICAgICAgICAgaW5rLnJlbW92ZUNsYXNzKFwidWktcmlwcGxlLWFuaW1hdGVcIik7XHJcbiAgICAgICAgICAgICAgICBpbmsgPSBudWxsO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIHNldCB0aGUgcG9zaXRpb24gYW5kIGFkZCBjbGFzcyAuYW5pbWF0ZVxyXG4gICAgICAgICAgICBpbmsuY3NzKHtcclxuICAgICAgICAgICAgICAgIHRvcDogeSArIFwicHhcIixcclxuICAgICAgICAgICAgICAgIGxlZnQ6IHggKyBcInB4XCIsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiByaXBwbGVDb2xvclxyXG4gICAgICAgICAgICB9KS5hZGRDbGFzcyhcInVpLXJpcHBsZS1hbmltYXRlXCIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGVyaWFsIERlc2lnbiBSaXBwbGUg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlEb21FeHRlbnNpb24oJHVpOiBKUXVlcnksIG9wdGlvbnM/OiBEb21FeHRlbnNpb25PcHRpb25zKTogSlF1ZXJ5IHtcclxuICAgICAgICBjb25zdCBOT19SSVBQTEVfQ0xBU1MgPSBbXHJcbiAgICAgICAgICAgIFwiLnVpLXJpcHBsZS1ub25lXCIsXHJcbiAgICAgICAgICAgIFwiLnVpLWZsaXBzd2l0Y2gtb25cIixcclxuICAgICAgICAgICAgXCIudWktc2xpZGVyLWhhbmRsZVwiLFxyXG4gICAgICAgICAgICBcIi51aS1pbnB1dC1jbGVhclwiLFxyXG4gICAgICAgIF07XHJcblxyXG4gICAgICAgIGxldCBzZWxlY3RvciA9IFwiLnVpLWJ0blwiO1xyXG4gICAgICAgIGlmICgkdWkuaGFzQ2xhc3MoXCJ1aS1wYWdlXCIpKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdG9yID0gXCIudWktY29udGVudCAudWktYnRuXCI7IC8vIGhlYWRlciDjga/oh6rli5UgcmlwcGxlIOWMluWvvuixoeWkllxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJHVpLmZpbmQoc2VsZWN0b3IpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoKGluZGV4LCBlbGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoJGVsZW0uaXMoTk9fUklQUExFX0NMQVNTLmpvaW4oXCIsXCIpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5hZGRDbGFzcyhcInVpLXJpcHBsZVwiKTtcclxuXHJcbiAgICAgICAgLy8gcmlwcGxpZnlcclxuICAgICAgICAkdWkuZmluZChcIi51aS1yaXBwbGVcIikucmlwcGxlKCk7XHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlEb21FeHRlbnNpb24pO1xyXG59XHJcbiIsIi8qKlxyXG4gKiBqUXVlcnkgcGx1Z2luIGRlZmluaXRpb25cclxuICovXHJcbmludGVyZmFjZSBKUXVlcnkge1xyXG4gICAgc3Bpbm5lcihvcHRpb25zPzogQ0RQLlVJLkRvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnk7XHJcbn1cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkuRXh0ZW5zaW9uIHtcclxuXHJcbiAgICBpbXBvcnQgVGVtcGxhdGUgPSBDRFAuVG9vbHMuVGVtcGxhdGU7XHJcbiAgICBpbXBvcnQgSlNUICAgICAgPSBDRFAuVG9vbHMuSlNUO1xyXG5cclxuICAgIGxldCBfdGVtcGxhdGU6IEpTVDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIE1hdGVyaWFsIERlc2lnbiBTcGlubmVyIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHRhcmdldCAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR0YXJnZXQ6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGlmICghX3RlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIF90ZW1wbGF0ZSA9IFRlbXBsYXRlLmdldEpTVChgXHJcbiAgICAgICAgICAgICAgICA8c2NyaXB0IHR5cGU9XCJ0ZXh0L3RlbXBsYXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWJhc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXItZ2FwXCIge3tib3JkZXJUb3B9fT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInVpLXNwaW5uZXItaW5uZXItbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidWktc3Bpbm5lci1pbm5lci1oYWxmLWNpcmNsZVwiIHt7Ym9yZGVyfX0+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyLXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ1aS1zcGlubmVyLWlubmVyLWhhbGYtY2lyY2xlXCIge3tib3JkZXJ9fT48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8L3NjcmlwdD5cclxuICAgICAgICAgICAgYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBtYWtlVGVtcGxhdGVQYXJhbSA9IChjb2xvcjogc3RyaW5nKTogT2JqZWN0ID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGJvcmRlclRvcDogXCJzdHlsZT1ib3JkZXItdG9wLWNvbG9yOlwiICsgY29sb3IgKyBcIjtcIixcclxuICAgICAgICAgICAgICAgIGJvcmRlcjogXCJzdHlsZT1ib3JkZXItY29sb3I6XCIgKyBjb2xvciArIFwiO1wiLFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHNwaW5uZXJpZnkgPSAoZWxlbTogRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gJGVsZW0uZGF0YShcInNwaW5uZXItY29sb3JcIik7XHJcbiAgICAgICAgICAgIGxldCBwYXJhbSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChjb2xvcikge1xyXG4gICAgICAgICAgICAgICAgJGVsZW0uY3NzKHsgXCJiYWNrZ3JvdW5kLWNvbG9yXCI6IGNvbG9yIH0pO1xyXG4gICAgICAgICAgICAgICAgcGFyYW0gPSBtYWtlVGVtcGxhdGVQYXJhbShjb2xvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJGVsZW0uYXBwZW5kKF90ZW1wbGF0ZShwYXJhbSkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICR0YXJnZXQuZmluZChcIi51aS1zcGlubmVyLCAudWktaWNvbi1sb2FkaW5nXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKChpbmRleDogbnVtYmVyLCBlbGVtOiBFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzcGlubmVyaWZ5KGVsZW0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuICR0YXJnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy8hIGpRdWVyeSBwbHVnaW5cclxuICAgICQuZm4uc3Bpbm5lciA9IGZ1bmN0aW9uIChvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucykge1xyXG4gICAgICAgIHJldHVybiBhcHBseURvbUV4dGVuc2lvbigkKHRoaXMpLCBvcHRpb25zKTtcclxuICAgIH07XHJcblxyXG4gICAgLy8g55m76YyyXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGFwcGx5RG9tRXh0ZW5zaW9uKTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUZXh0IElucHV0IOeUqCBGbG9hdGluZyBMYWJlbCDmi6HlvLVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICAgICAgICR1aSAgICAgICBbaW5dIOaknOe0ouWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbk9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcHBseURvbUV4dGVuc2lvbigkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGNvbnN0IHVwZGF0ZSA9IChlbGVtOiBFbGVtZW50LCBmbG9hdGluZzogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkZWxlbSA9ICQoZWxlbSk7XHJcbiAgICAgICAgICAgIGlmIChmbG9hdGluZykge1xyXG4gICAgICAgICAgICAgICAgJGVsZW0uYWRkQ2xhc3MoXCJ1aS1mbG9hdC1sYWJlbC1mbG9hdGluZ1wiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRlbGVtLnJlbW92ZUNsYXNzKFwidWktZmxvYXQtbGFiZWwtZmxvYXRpbmdcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCBmbG9hdGluZ2lmeSA9IChlbGVtOiBFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gJChlbGVtKS5hdHRyKFwiZm9yXCIpO1xyXG4gICAgICAgICAgICBjb25zdCAkaW5wdXQgPSAkdWkuZmluZChcIiNcIiArIGlkKTtcclxuICAgICAgICAgICAgaWYgKFwic2VhcmNoXCIgPT09ICRpbnB1dC5qcW1EYXRhKFwidHlwZVwiKSkge1xyXG4gICAgICAgICAgICAgICAgJChlbGVtKS5hZGRDbGFzcyhcInVpLWZsb2F0LWxhYmVsLWhhcy1pY29uXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHVwZGF0ZShlbGVtLCAhISRpbnB1dC52YWwoKSk7XHJcbiAgICAgICAgICAgICRpbnB1dC5vbihcImtleXVwIGNoYW5nZSBpbnB1dCBmb2N1cyBibHVyIGN1dCBwYXN0ZVwiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlKGVsZW0sICEhJChldmVudC50YXJnZXQpLnZhbCgpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHVpLmZpbmQoXCJsYWJlbC51aS1mbG9hdC1sYWJlbCwgLnVpLWZsb2F0LWxhYmVsIGxhYmVsXCIpXHJcbiAgICAgICAgICAgIC5lYWNoKChpbmRleDogbnVtYmVyLCBlbGVtOiBFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdGluZ2lmeShlbGVtKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAkdWk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55m76YyyXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGFwcGx5RG9tRXh0ZW5zaW9uKTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgaW1wb3J0IEZyYW1ld29yayA9IENEUC5GcmFtZXdvcms7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBqUXVlcnkgTW9iaWxlIEZsaXAgU3dpdGNoIOaLoeW8tVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7alF1ZXJ5fSAgICAgICAgICAgICAgJHVpICAgICAgIFtpbl0g5qSc57Si5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7RG9tRXh0ZW5zaW9uT3B0aW9uc30gW29wdGlvbnNdIFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGFwcGx5RG9tRXh0ZW5zaW9uKCR1aTogSlF1ZXJ5LCBvcHRpb25zPzogRG9tRXh0ZW5zaW9uT3B0aW9ucyk6IEpRdWVyeSB7XHJcbiAgICAgICAgLypcclxuICAgICAgICAgKiBmbGlwc3dpdGNoIOOBq+e0kOOBpeOBjyBsYWJlbCDjga8gT1Mg44Gr44KI44Gj44GmIGV2ZW50IOeZuuihjOW9ouW8j+OBjOeVsOOBquOCi+OBn+OCgeODleODg+OCr+OBl+OBpueLrOiHquOCpOODmeODs+ODiOOBp+WvvuW/nOOBmeOCiy5cclxuICAgICAgICAgKiDjgb7jgZ8gZmxpcHN3aXRjaCDjga/lhoXpg6jjgacgY2xpY2sg44KS55m66KGM44GX44Gm44GE44KL44GM44CBdmNsaWNrIOOBq+WkieabtOOBmeOCiy5cclxuICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgY29uc3QgX2dldEFsbFN3aXRjaGVzID0gKCk6IEpRdWVyeSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiAkdWkuZmluZChcIi51aS1mbGlwc3dpdGNoXCIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IF9nZXRJbnB1dEZyb21Td2l0Y2ggPSAoJHN3aXRjaDogSlF1ZXJ5KTogSlF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gJHN3aXRjaC5maW5kKFwiaW5wdXRcIik7XHJcbiAgICAgICAgICAgIGlmICgkaW5wdXQubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJGlucHV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0ICRzZWxlY3QgPSAkc3dpdGNoLmZpbmQoXCJzZWxlY3RcIik7XHJcbiAgICAgICAgICAgIGlmICgkc2VsZWN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICRzZWxlY3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2NoYW5nZSA9ICgkaW5wdXQ6IEpRdWVyeSwgdG86IGJvb2xlYW4pOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgaWYgKCRpbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKFwiSU5QVVRcIiA9PT0gJGlucHV0WzBdLm5vZGVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0LnByb3AoXCJjaGVja2VkXCIsIHRvKS5mbGlwc3dpdGNoKFwicmVmcmVzaFwiKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoXCJTRUxFQ1RcIiA9PT0gJGlucHV0WzBdLm5vZGVOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGlucHV0LnZhbCh0byA/IFwib25cIiA6IFwib2ZmXCIpLmZsaXBzd2l0Y2goXCJyZWZyZXNoXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgX2dldExhYmVsc0Zyb21Td2l0Y2ggPSAoJHN3aXRjaDogSlF1ZXJ5KTogSlF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJGlucHV0ID0gX2dldElucHV0RnJvbVN3aXRjaCgkc3dpdGNoKTtcclxuICAgICAgICAgICAgaWYgKCRpbnB1dCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGFiZWxzID0gKDxhbnk+JGlucHV0WzBdKS5sYWJlbHM7XHJcbiAgICAgICAgICAgICAgICBpZiAobGFiZWxzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICQobGFiZWxzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gJCgpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IF9nZXRTd2l0Y2hGcm9tTGFiZWwgPSAoJGxhYmVsOiBKUXVlcnkpOiBKUXVlcnkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0gJGxhYmVsLmF0dHIoXCJmb3JcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBfZ2V0QWxsU3dpdGNoZXMoKS5maW5kKFwiW25hbWU9J1wiICsgbmFtZSArIFwiJ11cIik7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgX2dldEFsbFN3aXRjaGVzKClcclxuICAgICAgICAgICAgLm9uKFwidmNsaWNrIF9jaGFuZ2VfZmxpcHN3aWNoXCIsIChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkc3dpdGNoID0gJChldmVudC5jdXJyZW50VGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICR0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkaW5wdXQgPSBfZ2V0SW5wdXRGcm9tU3dpdGNoKCRzd2l0Y2gpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hhbmdlVG8gPSAhJHN3aXRjaC5oYXNDbGFzcyhcInVpLWZsaXBzd2l0Y2gtYWN0aXZlXCIpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICgkdGFyZ2V0Lmhhc0NsYXNzKFwidWktZmxpcHN3aXRjaC1pbnB1dFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9jaGFuZ2UoJGlucHV0LCBjaGFuZ2VUbyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCR0YXJnZXQuaGFzQ2xhc3MoXCJ1aS1mbGlwc3dpdGNoLW9uXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKEZyYW1ld29yay5QbGF0Zm9ybS5Nb2JpbGUgJiYgRnJhbWV3b3JrLlBhdGNoLmlzU3VwcG9ydGVkVmNsaWNrKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX2NoYW5nZSgkaW5wdXQsIGNoYW5nZVRvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5lYWNoKChpbmRleDogbnVtYmVyLCBmbGlwc3dpdGNoOiBFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBfZ2V0TGFiZWxzRnJvbVN3aXRjaCgkKGZsaXBzd2l0Y2gpKVxyXG4gICAgICAgICAgICAgICAgICAgIC5vbihcInZjbGlja1wiLCAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCAkc3dpdGNoID0gX2dldFN3aXRjaEZyb21MYWJlbCgkKGV2ZW50LnRhcmdldCkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoISRzd2l0Y2gucGFyZW50KCkuaGFzQ2xhc3MoXCJ1aS1zdGF0ZS1kaXNhYmxlZFwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN3aXRjaC50cmlnZ2VyKFwiX2NoYW5nZV9mbGlwc3dpY2hcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAkdWk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55m76YyyXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGFwcGx5RG9tRXh0ZW5zaW9uKTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBqUXVlcnkgTW9iaWxlIFNsaWRlciDmi6HlvLVcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0ge2pRdWVyeX0gICAgICAgICAgICAgICR1aSAgICAgICBbaW5dIOaknOe0ouWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge0RvbUV4dGVuc2lvbk9wdGlvbnN9IFtvcHRpb25zXSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhcHBseURvbUV4dGVuc2lvbigkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgICR1aS5maW5kKFwiLnVpLXNsaWRlci1pbnB1dFwiKVxyXG4gICAgICAgICAgICAub24oXCJzbGlkZXN0b3BcIiwgKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRoYW5kbGVzID0gJChldmVudC5jdXJyZW50VGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgICAgIC5wYXJlbnQoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5maW5kKFwiLnVpLXNsaWRlci1oYW5kbGVcIik7XHJcbiAgICAgICAgICAgICAgICAkaGFuZGxlcy5ibHVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiAkdWk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8g55m76YyyXHJcbiAgICBFeHRlbnNpb25NYW5hZ2VyLnJlZ2lzdGVyRG9tRXh0ZW5zaW9uKGFwcGx5RG9tRXh0ZW5zaW9uKTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJLkV4dGVuc2lvbiB7XHJcblxyXG4gICAgLy8hIGlTY3JvbGwuY2xpY2sgcGF0Y2hcclxuICAgIGNvbnN0IHBhdGNoX0lTY3JvbGxfdXRpbHNfY2xpY2sgPSBmdW5jdGlvbiAoZXZlbnQ6IEV2ZW50KTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0OiBhbnkgPSBldmVudC50YXJnZXQ7XHJcbiAgICAgICAgY29uc3QgZTogYW55ID0gZXZlbnQ7XHJcbiAgICAgICAgbGV0IGV2OiBNb3VzZUV2ZW50O1xyXG5cclxuICAgICAgICAvLyBbQ0RQIG1vZGlmaWVkXTogc2V0IHRhcmdldC5jbGllbnRYLlxyXG4gICAgICAgIGlmIChudWxsID09IHRhcmdldC5jbGllbnRYIHx8IG51bGwgPT0gdGFyZ2V0LmNsaWVudFkpIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gZS5wYWdlWCAmJiBudWxsICE9IGUucGFnZVkpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGllbnRYID0gZS5wYWdlWDtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGllbnRZID0gZS5wYWdlWTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChlLmNoYW5nZWRUb3VjaGVzICYmIGUuY2hhbmdlZFRvdWNoZXNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGllbnRYID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWDtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5jbGllbnRZID0gZS5jaGFuZ2VkVG91Y2hlc1swXS5wYWdlWTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCEoLyhTRUxFQ1R8SU5QVVR8VEVYVEFSRUEpL2kpLnRlc3QodGFyZ2V0LnRhZ05hbWUpKSB7XHJcbiAgICAgICAgICAgIGV2ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJNb3VzZUV2ZW50c1wiKTtcclxuICAgICAgICAgICAgZXYuaW5pdE1vdXNlRXZlbnQoXCJjbGlja1wiLCB0cnVlLCB0cnVlLCBlLnZpZXcsIDEsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuc2NyZWVuWCwgdGFyZ2V0LnNjcmVlblksIHRhcmdldC5jbGllbnRYLCB0YXJnZXQuY2xpZW50WSxcclxuICAgICAgICAgICAgICAgIGUuY3RybEtleSwgZS5hbHRLZXksIGUuc2hpZnRLZXksIGUubWV0YUtleSxcclxuICAgICAgICAgICAgICAgIDAsIG51bGwpO1xyXG5cclxuICAgICAgICAgICAgKDxhbnk+ZXYpLl9jb25zdHJ1Y3RlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGxldCBzX2FwcGxpZWQgPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIGlTY3JvbGwgUGF0Y2gg5ouh5by1XHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtqUXVlcnl9ICAgICAgICAgICAgICAkdWkgICAgICAgW2luXSDmpJzntKLlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtEb21FeHRlbnNpb25PcHRpb25zfSBbb3B0aW9uc10gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gYXBwbHlQYXRjaCgkdWk6IEpRdWVyeSwgb3B0aW9ucz86IERvbUV4dGVuc2lvbk9wdGlvbnMpOiBKUXVlcnkge1xyXG4gICAgICAgIGlmICghc19hcHBsaWVkICYmIGdsb2JhbC5JU2Nyb2xsICYmIGdsb2JhbC5JU2Nyb2xsLnV0aWxzKSB7XHJcbiAgICAgICAgICAgIGdsb2JhbC5JU2Nyb2xsLnV0aWxzLmNsaWNrID0gcGF0Y2hfSVNjcm9sbF91dGlsc19jbGljaztcclxuICAgICAgICAgICAgc19hcHBsaWVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuICR1aTtcclxuICAgIH1cclxuXHJcbiAgICAvLyDnmbvpjLJcclxuICAgIEV4dGVuc2lvbk1hbmFnZXIucmVnaXN0ZXJEb21FeHRlbnNpb24oYXBwbHlQYXRjaCk7XHJcbn1cclxuIiwiZGVjbGFyZSBtb2R1bGUgXCJjZHAudWkuanFtXCIge1xyXG4gICAgY29uc3QgVUk6IHR5cGVvZiBDRFAuVUk7XHJcbiAgICBleHBvcnQgPSBVSTtcclxufVxyXG4iXX0=