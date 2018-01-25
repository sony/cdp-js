/*!
 * cdp.ui.listview.js 2.1.0
 *
 * Date: 2018-01-25T06:31:05.602Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(["jquery", "underscore", "backbone"], function ($, _, Backbone) { return factory(root.CDP || (root.CDP = {}), $, _, Backbone); }); } else if (typeof exports === "object") { module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"), require("underscore"), require("backbone")); } else { factory(root.CDP || (root.CDP = {}), root.$, root._, root.Backbone); } }(((this || 0).self || global), function (CDP, $, _, Backbone) { CDP.UI = CDP.UI || {};
/// <reference types="jquery" />
/// <reference types="backbone" />
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
            ListViewGlobalConfig.WRAPPER_CLASS = "ui-listview-wrapper";
            ListViewGlobalConfig.WRAPPER_SELECTOR = "." + ListViewGlobalConfig.WRAPPER_CLASS;
            ListViewGlobalConfig.SCROLL_MAP_CLASS = "ui-listview-scroll-map";
            ListViewGlobalConfig.SCROLL_MAP_SELECTOR = "." + ListViewGlobalConfig.SCROLL_MAP_CLASS;
            ListViewGlobalConfig.INACTIVE_CLASS = "inactive";
            ListViewGlobalConfig.INACTIVE_CLASS_SELECTOR = "." + ListViewGlobalConfig.INACTIVE_CLASS;
            ListViewGlobalConfig.RECYCLE_CLASS = "ui-listview-recycle";
            ListViewGlobalConfig.RECYCLE_CLASS_SELECTOR = "." + ListViewGlobalConfig.RECYCLE_CLASS;
            ListViewGlobalConfig.LISTITEM_BASE_CLASS = "ui-listview-item-base";
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
        // cdp.ui.listview は cdp.core に依存しないため、独自にglobal を提供する
        /*jshint evil:true */
        UI.global = CDP.global || Function("return this")();
        /*jshint evil:false */
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
        var StatusManager = /** @class */ (function () {
            function StatusManager() {
                this._status = {}; //!< statusScope() に使用される状態管理オブジェクト
            }
            ///////////////////////////////////////////////////////////////////////
            // Implements: IStatusManager
            //! 状態変数の参照カウントのインクリメント
            StatusManager.prototype.statusAddRef = function (status) {
                if (!this._status[status]) {
                    this._status[status] = 1;
                }
                else {
                    this._status[status]++;
                }
                return this._status[status];
            };
            //! 状態変数の参照カウントのデクリメント
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
            //! 処理スコープ毎に状態変数を設定
            StatusManager.prototype.statusScope = function (status, callback) {
                var _this = this;
                this.statusAddRef(status);
                var promise = callback();
                if (!promise) {
                    this.statusRelease(status);
                }
                else {
                    promise.then(function () {
                        _this.statusRelease(status);
                    }, function () {
                        _this.statusRelease(status);
                    });
                }
            };
            //! 指定した状態中であるか確認
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
        var _Config = CDP.UI.ListViewGlobalConfig;
        var _ToolCSS = CDP.UI._ListViewUtils;
        var TAG = "[CDP.UI.LineProfile] ";
        /**
         * @class LineProfile
         * @brief 1 ラインに関するプロファイルクラス
         *        framework が使用する
         */
        var LineProfile = /** @class */ (function () {
            /**
             * constructor
             *
             * @param _owner       {IListViewFramework} [in] 管理者である IListViewFramework インスタンス
             * @param _height      {Number}             [in] 初期の高さ
             * @param _initializer {Function}           [in] ListItemView 派生クラスのコンストラクタ
             * @param _info        {Object}             [in] ListItemView コンストラクタに渡されるオプション
             */
            function LineProfile(_owner, _height, _initializer, _info) {
                this._owner = _owner;
                this._height = _height;
                this._initializer = _initializer;
                this._info = _info;
                this._index = null; //!< global index
                this._pageIndex = null; //!< 所属する page index
                this._offset = null; //!< global offset
                this._$base = null; //!< 土台となる DOM インスタンスを格納
                this._instance = null; //!< ListItemView インスタンスを格納
            }
            ///////////////////////////////////////////////////////////////////////
            // public methods
            //! 有効化
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
            //! 不可視化
            LineProfile.prototype.hide = function () {
                if (null == this._instance) {
                    this.activate();
                }
                if ("hidden" !== this._$base.css("visibility")) {
                    this._$base.css("visibility", "hidden");
                }
            };
            //! 無効化
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
            //! 更新
            LineProfile.prototype.refresh = function () {
                if (null != this._instance) {
                    this._instance.render();
                }
            };
            //! 有効無効判定
            LineProfile.prototype.isActive = function () {
                return null != this._instance;
            };
            //! 高さ情報の更新. ListItemView からコールされる。
            LineProfile.prototype.updateHeight = function (newHeight, options) {
                var delta = newHeight - this._height;
                this._height = newHeight;
                this._owner.updateScrollMapHeight(delta);
                if (null != options && options.reflectAll) {
                    this._owner.updateProfiles(this._index);
                }
            };
            //! z-index のリセット. ScrollManager.removeItem() からコールされる。
            LineProfile.prototype.resetDepth = function () {
                if (null != this._instance) {
                    this._$base.css("z-index", this._owner.getListViewOptions().baseDepth);
                }
            };
            Object.defineProperty(LineProfile.prototype, "height", {
                ///////////////////////////////////////////////////////////////////////
                // getter/setter methods
                //! getter: ラインの高さ
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LineProfile.prototype, "index", {
                //! getter: global index
                get: function () {
                    return this._index;
                },
                //! setter: global index
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
                //! getter: 所属ページ index
                get: function () {
                    return this._pageIndex;
                },
                //! setter: 所属ページ index
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
                //! getter: line offset
                get: function () {
                    return this._offset;
                },
                //! setter: line offset
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
                //! getter: info
                get: function () {
                    return this._info;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // private methods
            //! Base jQuery オブジェクトの生成
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
            //! global index の更新
            LineProfile.prototype.updateIndex = function ($base) {
                if ($base.attr(_Config.DATA_CONTAINER_INDEX) !== this._index.toString()) {
                    $base.attr(_Config.DATA_CONTAINER_INDEX, this._index.toString());
                }
            };
            //! page index の更新
            LineProfile.prototype.updatePageIndex = function ($base) {
                if ($base.attr(_Config.DATA_PAGE_INDEX) !== this._pageIndex.toString()) {
                    $base.attr(_Config.DATA_PAGE_INDEX, this._pageIndex.toString());
                }
            };
            //! offset の更新
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
        var TAG = "[CDP.UI.PageProfile] ";
        /**
         * @class PageProfile
         * @brief 1 ページに関するプロファイルクラス
         *        framework が使用する
         *        本クラスでは直接 DOM を操作してはいけない
         */
        var PageProfile = /** @class */ (function () {
            function PageProfile() {
                this._index = 0; //!< page index
                this._offset = 0; //!< page の Top からのオフセット
                this._height = 0; //!< page の高さ
                this._lines = []; //!< page 内で管理される LineProfile
                this._status = "inactive"; //!< page の状態 [ inactive | hidden | active ]
            }
            ///////////////////////////////////////////////////////////////////////
            // public methods
            //! 有効化
            PageProfile.prototype.activate = function () {
                if ("active" !== this._status) {
                    this._lines.forEach(function (line) {
                        line.activate();
                    });
                }
                this._status = "active";
            };
            //! 無可視化
            PageProfile.prototype.hide = function () {
                if ("hidden" !== this._status) {
                    this._lines.forEach(function (line) {
                        line.hide();
                    });
                }
                this._status = "hidden";
            };
            //! 無効化
            PageProfile.prototype.inactivate = function () {
                if ("inactive" !== this._status) {
                    this._lines.forEach(function (line) {
                        line.inactivate();
                    });
                }
                this._status = "inactive";
            };
            //! LineProfile を設定
            PageProfile.prototype.push = function (line) {
                this._lines.push(line);
                this._height += line.height;
            };
            //! 配下の LineProfile すべてが有効でない場合、Page ステータスを無効にする
            PageProfile.prototype.normalize = function () {
                var enableAll = _.every(this._lines, function (line) {
                    return line.isActive();
                });
                if (!enableAll) {
                    this._status = "inactive";
                }
            };
            //! LineProfile を取得
            PageProfile.prototype.getLineProfile = function (index) {
                if (0 <= index && index < this._lines.length) {
                    return this._lines[index];
                }
                else {
                    return null;
                }
            };
            //! 最初の LineProfile を取得
            PageProfile.prototype.getLineProfileFirst = function () {
                return this.getLineProfile(0);
            };
            //! 最後の LineProfile を取得
            PageProfile.prototype.getLineProfileLast = function () {
                return this.getLineProfile(this._lines.length - 1);
            };
            Object.defineProperty(PageProfile.prototype, "index", {
                ///////////////////////////////////////////////////////////////////////
                // getter/setter methods
                //! getter: page index
                get: function () {
                    return this._index;
                },
                //! setter: page index
                set: function (index) {
                    this._index = index;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageProfile.prototype, "offset", {
                //! getter: page offset
                get: function () {
                    return this._offset;
                },
                //! setter: page offset
                set: function (offset) {
                    this._offset = offset;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageProfile.prototype, "height", {
                //! getter: 実際にページに割り当てられている高さ
                get: function () {
                    return this._height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PageProfile.prototype, "status", {
                //! getter: 状態取得
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
        var TAG = "[CDP.UI.GroupProfile] ";
        /**
         * @class GroupProfile
         * @brief ラインをグループ管理するプロファイルクラス
         *        本クラスでは直接 DOM を操作してはいけない
         */
        var GroupProfile = /** @class */ (function () {
            /**
             * constructor
             *
             * @param _id    {String}             [in] GroupProfile の ID
             * @param _owner {ExpandableListView} [in] 管理者である ExpandableListView インスタンス
             */
            function GroupProfile(_id, _owner) {
                this._id = _id;
                this._owner = _owner;
                this._parent = null; //!< 親 GroupProfile インスタンス
                this._children = []; //!< 子 GroupProfile インスタンス
                this._expanded = false; //!< 開閉情報
                this._status = "unregistered"; //!< _owner への登録状態 [ unregistered | registered ]
                this._mapLines = {}; //!< 自身が管轄する LineProfile を key とともに格納
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
                    var _lines;
                    if (withActiveChildren) {
                        _lines = _this.queryOperationTarget("active");
                    }
                    if (null == lines || lines.length <= 0) {
                        _lines = _this._lines;
                    }
                    return _lines;
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
                    group._children.forEach(function (child) {
                        switch (operation) {
                            case "registered":
                                lines = lines.concat(child.preprocess(operation));
                                break;
                            case "unregistered":
                                lines = lines.concat(child.preprocess(operation));
                                break;
                            case "active":
                                if (null != child._lines) {
                                    lines = lines.concat(child._lines);
                                }
                                break;
                            default:
                                console.warn(TAG + "unknown operation: " + operation);
                                return;
                        }
                        if (child.isExpanded()) {
                            lines = lines.concat(findTargets(child));
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
        var _Utils = CDP.UI._ListViewUtils;
        var TAG = "[CDP.UI.ScrollerElement] ";
        /**
         * @class ScrollerElement
         * @brief HTMLElement の Scroller クラス
         */
        var ScrollerElement = /** @class */ (function () {
            function ScrollerElement(element, options) {
                this._$target = null;
                this._$scrollMap = null;
                this._listviewOptions = null;
                this._$target = $(element);
                this._listviewOptions = options;
            }
            //! Scroller の型を取得
            ScrollerElement.prototype.getType = function () {
                return ScrollerElement.TYPE;
            };
            //! position 取得
            ScrollerElement.prototype.getPos = function () {
                return this._$target.scrollTop();
            };
            //! position の最大値を取得
            ScrollerElement.prototype.getPosMax = function () {
                if (null == this._$scrollMap) {
                    this._$scrollMap = this._$target.children().first();
                }
                return _Utils.max(this._$scrollMap.height() - this._$target.height(), 0);
            };
            //! イベント登録
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
            //! イベント登録解除
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
            //! スクロール位置を指定
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
            //! Scroller の状態更新
            ScrollerElement.prototype.update = function () {
                // noop.
            };
            //! Scroller の破棄
            ScrollerElement.prototype.destroy = function () {
                this._$scrollMap = null;
                if (this._$target) {
                    this._$target.off();
                    this._$target = null;
                }
            };
            Object.defineProperty(ScrollerElement, "TYPE", {
                //! タイプ定義
                get: function () {
                    return "element-overflow";
                },
                enumerable: true,
                configurable: true
            });
            //! factory 取得
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
        var ScrollerNative = /** @class */ (function () {
            //! constructor
            function ScrollerNative(options) {
                this._$body = null;
                this._$target = null;
                this._listviewOptions = null;
                this._$target = $(document);
                this._$body = $("body");
                this._listviewOptions = options;
            }
            //! Scroller の型を取得
            ScrollerNative.prototype.getType = function () {
                return ScrollerNative.TYPE;
            };
            //! position 取得
            ScrollerNative.prototype.getPos = function () {
                return this._$target.scrollTop();
            };
            //! position の最大値を取得
            ScrollerNative.prototype.getPosMax = function () {
                return _Utils.max(this._$target.height() - window.innerHeight, 0);
            };
            //! イベント登録
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
            //! イベント登録解除
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
            //! スクロール位置を指定
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
            //! Scroller の状態更新
            ScrollerNative.prototype.update = function () {
                // noop.
            };
            //! Scroller の破棄
            ScrollerNative.prototype.destroy = function () {
                this._$target = null;
            };
            Object.defineProperty(ScrollerNative, "TYPE", {
                //! タイプ定義
                get: function () {
                    return "native-scroll";
                },
                enumerable: true,
                configurable: true
            });
            //! factory 取得
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
        var ScrollerIScroll = /** @class */ (function () {
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
            //! Scroller の型を取得
            ScrollerIScroll.prototype.getType = function () {
                return ScrollerIScroll.TYPE;
            };
            //! position 取得
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
            //! position の最大値を取得
            ScrollerIScroll.prototype.getPosMax = function () {
                return _Utils.max(-this._iscroll.maxScrollY, 0);
            };
            //! イベント登録
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
            //! イベント登録解除
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
            //! スクロール位置を指定
            ScrollerIScroll.prototype.scrollTo = function (pos, animate, time) {
                time = 0;
                if (this._listviewOptions.enableAnimation && animate) {
                    time = time || this._listviewOptions.animationDuration;
                }
                this._iscroll.scrollTo(0, -pos, time);
            };
            //! Scroller の状態更新
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
            //! Scroller の破棄
            ScrollerIScroll.prototype.destroy = function () {
                this._$scroller = null;
                this._$wrapper = null;
                this._iscroll.destroy();
                this._$owner = null;
            };
            Object.defineProperty(ScrollerIScroll, "TYPE", {
                //! タイプ定義
                get: function () {
                    return "iscroll";
                },
                enumerable: true,
                configurable: true
            });
            //! factory 取得
            ScrollerIScroll.getFactory = function (options) {
                var defaultOpt = {
                    scrollX: false,
                    bounce: false,
                    tap: true,
                    click: true,
                    mouseWheel: true,
                    scrollbars: true,
                    interactiveScrollbars: true,
                    shrinkScrollbars: "scale",
                    fadeScrollbars: true,
                    preventDefault: false,
                    disablePointer: true,
                    disableMouse: false,
                    disableTouch: false,
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
        var TAG = "[CDP.UI.ListItemView] ";
        /**
         * @class ListItemView
         * @brief ListView が扱う ListItem コンテナクラス
         */
        var ListItemView = /** @class */ (function (_super) {
            __extends(ListItemView, _super);
            /**
             * constructor
             */
            function ListItemView(options) {
                var _this = _super.call(this, options) || this;
                _this._owner = null;
                _this._lineProfile = null;
                _this._owner = options.owner;
                if (options.$el) {
                    var delegates = _this.events ? true : false;
                    _this.setElement(options.$el, delegates);
                }
                _this._lineProfile = options.lineProfile;
                return _this;
            }
            ///////////////////////////////////////////////////////////////////////
            // Implements: ListItemView
            //! 描画: framework から呼び出されるため、オーバーライド必須
            ListItemView.prototype.render = function () {
                console.warn(TAG + "need override 'render()' method.");
                return this;
            };
            //! 自身の Line インデックスを取得
            ListItemView.prototype.getIndex = function () {
                return this._lineProfile.index;
            };
            //! 自身に指定された高さを取得
            ListItemView.prototype.getSpecifiedHeight = function () {
                return this._lineProfile.height;
            };
            //! child node が存在するか判定
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
            //! 開放
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
                //! Owner 取得
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
        var ScrollManager = /** @class */ (function () {
            /**
             * constructor
             *
             * @param _$root  {JQuery} [in] 管理対象のルートエレメント
             * @param options {ListViewOptions} [in] オプション
             */
            function ScrollManager(options) {
                var _this = this;
                this._$root = null; //!< Scroll 対象のルートオブジェクト
                this._$map = null; //!< Scroll Map element を格納
                this._mapHeight = 0; //!< Scroll Map の高さを格納 (_$map の状態に依存させない)
                this._scroller = null; //!< Scroll に使用する IScroller インスタンス
                this._settings = null; //!< ScrollManager オプションを格納
                this._active = true; //!< UI 表示中は true に指定
                this._scrollEventHandler = null; //!< Scroll Event Handler
                this._scrollStopEventHandler = null; //!< Scroll Stop Event Handler
                this._baseHeight = 0; //!< 高さの基準値
                this._lines = []; //!< 管理下にある LineProfile 配列
                this._pages = []; //!< 管理下にある PageProfile 配列
                //! 最新の表示領域情報を格納 (Scroll 中の更新処理に使用)
                this._lastActivePageContext = {
                    index: 0,
                    from: 0,
                    to: 0,
                    pos: 0,
                };
                this._backup = {}; //!< データの backup 領域. key と _lines を格納。派生クラスで拡張可能。
                // ListViewOptions 既定値
                var defOptions = {
                    scrollerFactory: UI.ScrollerElement.getFactory(),
                    enableHiddenPage: false,
                    enableTransformOffset: false,
                    scrollMapRefreshInterval: 200,
                    scrollRefreshDistance: 200,
                    pagePrepareCount: 3,
                    pagePreloadCount: 1,
                    enableAnimation: true,
                    animationDuration: 0,
                    baseDepth: "auto",
                    itemTagName: "li",
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
            //! 内部オブジェクトの初期化
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
            //! 内部オブジェクトの破棄
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
            //! ページの基準値を取得
            ScrollManager.prototype.setBaseHeight = function (height) {
                this._baseHeight = height;
                if (this._baseHeight <= 0) {
                    console.warn(TAG + "invalid base height: " + this._baseHeight);
                }
                if (this._scroller) {
                    this._scroller.update();
                }
            };
            //! active 状態設定
            ScrollManager.prototype.setActiveState = function (active) {
                this._active = active;
                this.treatScrollPosition();
            };
            //! active 状態判定
            ScrollManager.prototype.isActive = function () {
                return this._active;
            };
            //! scroller の種類を取得
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
                var updateOffset = function ($target) {
                    var offset = (_this._scroller.getPos() - _this._lastActivePageContext.pos);
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
                else if (this._scroller) {
                    if (this._settings.useDummyInactiveScrollMap) {
                        updateOffset(this.prepareInactiveMap());
                    }
                    else {
                        updateOffset(this._$map);
                    }
                }
            };
            //! inactive 用 Map の生成
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
            //! 初期化済みか判定
            ScrollManager.prototype.isInitialized = function () {
                return !!this._$root;
            };
            //! プロパティを指定して、LineProfile を管理
            ScrollManager.prototype.addItem = function (height, initializer, info, insertTo) {
                this._addLine(new UI.LineProfile(this, Math.floor(height), initializer, info), insertTo);
            };
            //! プロパティを指定して、LineProfile を管理. 登録 framework が使用する
            ScrollManager.prototype._addLine = function (_line, insertTo) {
                var lines = (_line instanceof Array) ? _line : [_line];
                var i, n;
                var deltaHeight = 0;
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
            ScrollManager.prototype.removeItem = function (index, arg2, arg3) {
                if (index instanceof Array) {
                    this._removeLines(index, arg2);
                }
                else {
                    this._removeLine(index, arg2, arg3);
                }
            };
            //! 指定した LineProfile を削除: 連続 index 版
            ScrollManager.prototype._removeLine = function (index, size, delay) {
                var _this = this;
                if (null == size) {
                    size = 1;
                }
                if (index < 0 || this._lines.length < index + size) {
                    console.error(TAG + "logic error. removeItem(), invalid index: " + index);
                    return;
                }
                delay = (null != delay) ? delay : 0;
                var removed = [];
                var delta = 0;
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
                        _this.setupScrollMapTransition(_this._$map, delay);
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
            //! 指定した LineProfile を削除: random access 版
            ScrollManager.prototype._removeLines = function (indexes, delay) {
                var _this = this;
                delay = (null != delay) ? delay : 0;
                for (var i = 0, n = indexes.length; i < n; i++) {
                    if (i < 0 || this._lines.length < i) {
                        console.error(TAG + "logic error. removeItem(), invalid index: " + i);
                        return;
                    }
                }
                var removed = [];
                var delta = 0;
                var mapTransition = false;
                // 削除候補と変化量の算出
                (function () {
                    var line;
                    indexes.forEach(function (index) {
                        line = _this._lines[index];
                        delta += line.height;
                        // 削除要素の z-index の初期化
                        line.resetDepth();
                        removed.push(line);
                    });
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
                        _this.setupScrollMapTransition(_this._$map, delay);
                    }
                    indexes.forEach(function (index) {
                        // page 設定の解除
                        if (null != _this._lines[index].pageIndex) {
                            _this.clearPage(_this._lines[index].pageIndex);
                        }
                        // 配列から削除
                        _this._lines.splice(index, 1);
                        // offset の再計算
                        _this.updateProfiles(index);
                    });
                    // スクロール領域の更新
                    _this.updateScrollMapHeight(-delta);
                    // 遅延削除
                    setTimeout(function () {
                        removed.forEach(function (line) {
                            line.inactivate();
                        });
                    }, delay);
                })();
            };
            //! scroll map のトランジション設定
            ScrollManager.prototype.setupScrollMapTransition = function ($map, delay) {
                var transitionEndHandler = function (event) {
                    $map.off(_Utils.transitionEnd);
                    _Utils.clearTransitions($map);
                };
                this._$map.on(_Utils.transitionEnd, transitionEndHandler);
                _Utils.setTransformsTransitions($map, "height", delay, "ease");
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
            //! アクティブページを更新
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
                this._lastActivePageContext.from = this._pages[currentPageIndex].getLineProfileFirst() ?
                    this._pages[currentPageIndex].getLineProfileFirst().index : 0;
                this._lastActivePageContext.to = this._pages[currentPageIndex].getLineProfileLast() ?
                    this._pages[currentPageIndex].getLineProfileLast().index : 0;
                this._lastActivePageContext.index = currentPageIndex;
            };
            //! 未アサインページを構築
            ScrollManager.prototype.update = function () {
                var index = this._pages.length;
                this.assignPage(index);
                this.refresh();
            };
            //! ページアサインを再構成
            ScrollManager.prototype.rebuild = function () {
                this.clearPage();
                this.assignPage();
                this.refresh();
            };
            //! 管轄データを破棄
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
            //! 内部データをバックアップ
            ScrollManager.prototype.backup = function (key) {
                if (null == this._backup[key]) {
                    this._backup[key] = {
                        lines: this._lines,
                    };
                }
                return true;
            };
            //! 内部データをリストア
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
            //! バックアップデータの有無
            ScrollManager.prototype.hasBackup = function (key) {
                if (null != this._backup[key]) {
                    return true;
                }
                else {
                    return false;
                }
            };
            //! バックアップデータの破棄
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
                //! バックアップデータにアクセス
                get: function () {
                    return this._backup;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Scroll
            //! スクロールイベントハンドラ設定/解除
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
            //! スクロール終了イベントハンドラ設定/解除
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
            //! スクロール位置を取得
            ScrollManager.prototype.getScrollPos = function () {
                return this._scroller ? this._scroller.getPos() : 0;
            };
            //! スクロール位置の最大値を取得
            ScrollManager.prototype.getScrollPosMax = function () {
                return this._scroller ? this._scroller.getPosMax() : 0;
            };
            //! スクロール位置を指定
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
            //! 指定された ListItemView の表示を保証
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
            //! Scroll Map の高さを取得
            ScrollManager.prototype.getScrollMapHeight = function () {
                return this._$map ? this._mapHeight : 0;
            };
            //! Scroll Map の高さを更新. framework が使用する.
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
            //! 内部 Profile の更新. framework が使用する.
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
            //! Scroll Map Element を取得. framework が使用する.
            ScrollManager.prototype.getScrollMapElement = function () {
                return this._$map || $("");
            };
            //! リサイクル可能な Element を取得. framework が使用する.
            ScrollManager.prototype.findRecycleElements = function () {
                return this._$map ? this._$map.find(_Config.RECYCLE_CLASS_SELECTOR) : $("");
            };
            //! ListViewOptions を取得. framework が使用する.
            ScrollManager.prototype.getListViewOptions = function () {
                return this._settings;
            };
            ///////////////////////////////////////////////////////////////////////
            // private method:
            //! Scroller 用環境設定
            ScrollManager.prototype.setScrollerCondition = function () {
                this._scroller.on("scroll", this._scrollEventHandler);
                this._scroller.on("scrollstop", this._scrollStopEventHandler);
            };
            //! Scroller 用環境破棄
            ScrollManager.prototype.resetScrollerCondition = function () {
                this._scroller.off("scrollstop", this._scrollStopEventHandler);
                this._scroller.off("scroll", this._scrollEventHandler);
            };
            //! 既定の Scroller オブジェクトの作成
            ScrollManager.prototype.createScroller = function () {
                return this._settings.scrollerFactory(this._$root[0], this._settings);
            };
            //! 現在の Page Index を取得
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
                var validRange = function (_page) {
                    if (null == _page) {
                        return false;
                    }
                    else if (_page.offset <= pos && pos <= _page.offset + _page.height) {
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
                    return this._pages.length - 1;
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
            //! 最後のページを取得
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
        var ListView = /** @class */ (function (_super) {
            __extends(ListView, _super);
            /**
             * constructor
             *
             * @param options {ListViewConstructOptions} [in] オプション
             */
            function ListView(options) {
                var _this = _super.call(this, options) || this;
                _this._scrollMgr = null; //!< scroll コアロジック
                var opt = options || {};
                _this._scrollMgr = new UI.ScrollManager(options);
                if (opt.$el) {
                    var delegates = _this.events ? true : false;
                    _this.setElement(opt.$el, delegates);
                }
                else {
                    var height = opt.initialHeight || _this.$el.height();
                    _this._scrollMgr.initialize(_this.$el, height);
                }
                return _this;
            }
            ListView.prototype.setElement = function (element, delegate) {
                if (this._scrollMgr) {
                    var $el = $(element);
                    this._scrollMgr.destroy();
                    this._scrollMgr.initialize($el, $el.height());
                }
                return _super.prototype.setElement.call(this, element, delegate);
            };
            //! 破棄
            ListView.prototype.remove = function () {
                this._scrollMgr.destroy();
                return _super.prototype.remove.call(this);
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Profile 管理
            //! 初期化済みか判定
            ListView.prototype.isInitialized = function () {
                return this._scrollMgr.isInitialized();
            };
            //! プロパティを指定して、LineProfile を管理
            ListView.prototype.addItem = function (height, initializer, info, insertTo) {
                this._addLine(new UI.LineProfile(this._scrollMgr, Math.floor(height), initializer, info), insertTo);
            };
            ListView.prototype.removeItem = function (index, arg2, arg3) {
                this._scrollMgr.removeItem(index, arg2, arg3);
            };
            ListView.prototype.getItemInfo = function (target) {
                return this._scrollMgr.getItemInfo(target);
            };
            //! アクティブページを更新
            ListView.prototype.refresh = function () {
                this._scrollMgr.refresh();
            };
            //! 未アサインページを構築
            ListView.prototype.update = function () {
                this._scrollMgr.update();
            };
            //! ページアサインを再構成
            ListView.prototype.rebuild = function () {
                this._scrollMgr.rebuild();
            };
            //! 管轄データを破棄
            ListView.prototype.release = function () {
                this._scrollMgr.release();
            };
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Profile Backup / Restore
            //! 内部データをバックアップ
            ListView.prototype.backup = function (key) {
                return this._scrollMgr.backup(key);
            };
            //! 内部データをリストア
            ListView.prototype.restore = function (key, rebuild) {
                if (rebuild === void 0) { rebuild = true; }
                return this._scrollMgr.restore(key, rebuild);
            };
            //! バックアップデータの有無
            ListView.prototype.hasBackup = function (key) {
                return this._scrollMgr.hasBackup(key);
            };
            //! バックアップデータの破棄
            ListView.prototype.clearBackup = function (key) {
                return this._scrollMgr.clearBackup(key);
            };
            Object.defineProperty(ListView.prototype, "backupData", {
                //! バックアップデータにアクセス
                get: function () {
                    return this._scrollMgr ? this._scrollMgr.backupData : null;
                },
                enumerable: true,
                configurable: true
            });
            ///////////////////////////////////////////////////////////////////////
            // Implements: IListView Scroll
            //! スクロールイベントハンドラ設定/解除
            ListView.prototype.setScrollHandler = function (handler, on) {
                this._scrollMgr.setScrollHandler(handler, on);
            };
            //! スクロール終了イベントハンドラ設定/解除
            ListView.prototype.setScrollStopHandler = function (handler, on) {
                this._scrollMgr.setScrollStopHandler(handler, on);
            };
            //! スクロール位置を取得
            ListView.prototype.getScrollPos = function () {
                return this._scrollMgr.getScrollPos();
            };
            //! スクロール位置の最大値を取得
            ListView.prototype.getScrollPosMax = function () {
                return this._scrollMgr.getScrollPosMax();
            };
            //! スクロール位置を指定
            ListView.prototype.scrollTo = function (pos, animate, time) {
                this._scrollMgr.scrollTo(pos, animate, time);
            };
            //! 指定された ListItemView の表示を保証
            ListView.prototype.ensureVisible = function (index, options) {
                this._scrollMgr.ensureVisible(index, options);
            };
            Object.defineProperty(ListView.prototype, "core", {
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
        var GroupListItemView = /** @class */ (function (_super) {
            __extends(GroupListItemView, _super);
            /**
             * constructor
             *
             * @param options {GroupLineViewOptions} [in] オプション
             */
            function GroupListItemView(options) {
                var _this = _super.call(this, options) || this;
                _this._groupProfile = null; //!< 管轄の GroupProfile
                _this._groupProfile = options.groupProfile;
                return _this;
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
            //! 展開中か判定
            GroupListItemView.prototype.isExpanding = function () {
                return this.owner.isExpanding();
            };
            //! 収束中か判定
            GroupListItemView.prototype.isCollapsing = function () {
                return this.owner.isCollapsing();
            };
            //! 開閉中か判定
            GroupListItemView.prototype.isSwitching = function () {
                return this.owner.isSwitching();
            };
            //! 子 Group を持っているか判定
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
        var ExpandManager = /** @class */ (function () {
            /**
             * constructor
             *
             * @param owner {BaseExpandableListView} [in] 親View のインスタンス
             */
            function ExpandManager(owner) {
                this._owner = null;
                this._mapGroups = {}; //!< {id, GroupProfile} の map
                this._aryTopGroups = []; //!< 第1階層 GroupProfile を格納
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
            //! すべてのグループを展開 (1階層)
            ExpandManager.prototype.expandAll = function () {
                this._aryTopGroups.forEach(function (group) {
                    if (group.hasChildren()) {
                        group.expand();
                    }
                });
            };
            //! すべてのグループを収束 (1階層)
            ExpandManager.prototype.collapseAll = function (delay) {
                this._aryTopGroups.forEach(function (group) {
                    if (group.hasChildren()) {
                        group.collapse(delay);
                    }
                });
            };
            //! 展開中か判定
            ExpandManager.prototype.isExpanding = function () {
                return this._owner.isStatusIn("expanding");
            };
            //! 収束中か判定
            ExpandManager.prototype.isCollapsing = function () {
                return this._owner.isStatusIn("collapsing");
            };
            //! 開閉中か判定
            ExpandManager.prototype.isSwitching = function () {
                return this.isExpanding() || this.isCollapsing();
            };
            //! 状態変数の参照カウントのインクリメント
            ExpandManager.prototype.statusAddRef = function (status) {
                return this._owner.statusAddRef(status);
            };
            //! 状態変数の参照カウントのデクリメント
            ExpandManager.prototype.statusRelease = function (status) {
                return this._owner.statusRelease(status);
            };
            //! 処理スコープ毎に状態変数を設定
            ExpandManager.prototype.statusScope = function (status, callback) {
                this._owner.statusScope(status, callback);
            };
            //! 指定した状態中であるか確認
            ExpandManager.prototype.isStatusIn = function (status) {
                return this._owner.isStatusIn(status);
            };
            Object.defineProperty(ExpandManager.prototype, "layoutKey", {
                //! layout key を取得
                get: function () {
                    return this._layoutKey;
                },
                //! layout key を設定
                set: function (key) {
                    this._layoutKey = key;
                },
                enumerable: true,
                configurable: true
            });
            //! データを破棄
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
            //! バックアップデータの有無
            ExpandManager.prototype.hasBackup = function (key) {
                return this._owner.hasBackup(key);
            };
            //! バックアップデータの破棄
            ExpandManager.prototype.clearBackup = function (key) {
                return this._owner.clearBackup(key);
            };
            Object.defineProperty(ExpandManager.prototype, "backupData", {
                //! バックアップデータにアクセス
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
        var ExpandableListView = /** @class */ (function (_super) {
            __extends(ExpandableListView, _super);
            /**
             * constructor
             *
             * @param options {ListViewConstructOptions} [in] オプション
             */
            function ExpandableListView(options) {
                var _this = _super.call(this, options) || this;
                _this._statusMgr = null;
                _this._expandManager = null;
                _this._statusMgr = new UI.StatusManager();
                _this._expandManager = new UI.ExpandManager(_this);
                return _this;
            }
            ///////////////////////////////////////////////////////////////////////
            // Implements: IExpandableListView
            //! 新規 GroupProfile を作成
            ExpandableListView.prototype.newGroup = function (id) {
                return this._expandManager.newGroup(id);
            };
            //! 登録済み Group を取得
            ExpandableListView.prototype.getGroup = function (id) {
                return this._expandManager.getGroup(id);
            };
            //! 第1階層の Group 登録
            ExpandableListView.prototype.registerTopGroup = function (topGroup) {
                this._expandManager.registerTopGroup(topGroup);
            };
            //! 第1階層の Group を取得
            ExpandableListView.prototype.getTopGroups = function () {
                return this._expandManager.getTopGroups();
            };
            //! すべてのグループを展開 (1階層)
            ExpandableListView.prototype.expandAll = function () {
                this._expandManager.expandAll();
            };
            //! すべてのグループを収束 (1階層)
            ExpandableListView.prototype.collapseAll = function (delay) {
                this._expandManager.collapseAll(delay);
            };
            //! 展開中か判定
            ExpandableListView.prototype.isExpanding = function () {
                return this._expandManager.isExpanding();
            };
            //! 収束中か判定
            ExpandableListView.prototype.isCollapsing = function () {
                return this._expandManager.isCollapsing();
            };
            //! 開閉中か判定
            ExpandableListView.prototype.isSwitching = function () {
                return this._expandManager.isSwitching();
            };
            //! 状態変数の参照カウントのインクリメント
            ExpandableListView.prototype.statusAddRef = function (status) {
                return this._statusMgr.statusAddRef(status);
            };
            //! 状態変数の参照カウントのデクリメント
            ExpandableListView.prototype.statusRelease = function (status) {
                return this._statusMgr.statusRelease(status);
            };
            //! 処理スコープ毎に状態変数を設定
            ExpandableListView.prototype.statusScope = function (status, callback) {
                this._statusMgr.statusScope(status, callback);
            };
            //! 指定した状態中であるか確認
            ExpandableListView.prototype.isStatusIn = function (status) {
                return this._statusMgr.isStatusIn(status);
            };
            Object.defineProperty(ExpandableListView.prototype, "layoutKey", {
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
            // Override: ListView
            //! データを破棄
            ExpandableListView.prototype.release = function () {
                _super.prototype.release.call(this);
                this._expandManager.release();
            };
            //! 内部データをバックアップ
            ExpandableListView.prototype.backup = function (key) {
                return this._expandManager.backup(key);
            };
            //! 内部データをリストア
            ExpandableListView.prototype.restore = function (key, rebuild) {
                if (rebuild === void 0) { rebuild = true; }
                return this._expandManager.restore(key, rebuild);
            };
            return ExpandableListView;
        }(UI.ListView));
        UI.ExpandableListView = ExpandableListView;
    })(UI = CDP.UI || (CDP.UI = {}));
})(CDP || (CDP = {}));

return CDP.UI; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvSW50ZXJmYWNlcy50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvQ29uZmlnLnRzIiwiY2RwOi8vL0NEUC9VSS9saXN0dmlldy9VdGlscy50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvU3RhdHVzTWFuYWdlci50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvTGluZVByb2ZpbGUudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L1BhZ2VQcm9maWxlLnRzIiwiY2RwOi8vL0NEUC9VSS9saXN0dmlldy9Hcm91cFByb2ZpbGUudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L1Njcm9sbGVyRWxlbWVudC50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvU2Nyb2xsZXJOYXRpdmUudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L1Njcm9sbGVySVNjcm9sbC50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvTGlzdEl0ZW1WaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9saXN0dmlldy9TY3JvbGxNYW5hZ2VyLnRzIiwiY2RwOi8vL0NEUC9VSS9saXN0dmlldy9MaXN0Vmlldy50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvR3JvdXBMaXN0SXRlbVZpZXcudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L0V4cGFuZE1hbmFnZXIudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L0V4cGFuZGFibGVMaXN0Vmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnQ0FBZ0M7QUFDaEMsa0NBQWtDO0FDRGxDLElBQVUsR0FBRyxDQW1CWjtBQW5CRCxXQUFVLEdBQUc7SUFBQyxNQUFFLENBbUJmO0lBbkJhLGFBQUU7UUFDWjs7O1dBR0c7UUFDSCxJQUFjLG9CQUFvQixDQWFqQztRQWJELFdBQWMsb0JBQW9CO1lBQ25CLGtDQUFhLEdBQWtCLHFCQUFxQixDQUFDO1lBQ3JELHFDQUFnQixHQUFl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cXVlcnlcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSB0eXBlcz1cImJhY2tib25lXCIgLz5cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBMaXN0Vmlld09wdGlvbnNcclxuICAgICAqIEBicmllZiBMaXN0VmlldyDjga7liJ3mnJ/ljJbmg4XloLHjgpLmoLzntI3jgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBMaXN0Vmlld09wdGlvbnMge1xyXG4gICAgICAgIC8vISDkvb/nlKjjgZnjgosgSVNjcm9sbGVyIOOCkuWkieabtOOBmeOCi+WgtOWQiOOBq+aMh+WumiAgW2RlZmF1bHQ6IFNjcm9sbGVyTmF0aXZlLmdldEZhY3RvcnkoKV1cclxuICAgICAgICBzY3JvbGxlckZhY3Rvcnk/OiAoZWxlbWVudDogYW55LCBvcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpID0+IElTY3JvbGxlcjtcclxuICAgICAgICBlbmFibGVIaWRkZW5QYWdlPzogYm9vbGVhbjsgICAgICAgICAvLyE8IHBsZWxvYWQg5a++6LGh44KSIHZpc2liaWxpdHk6IFwiaGlkZGVuXCIg44Gr44GZ44KL5aC05ZCI44GvIHRydWUuICAgICAgICAgICAgICAgIFtkZWZhdWx0OiBmYWxzZV1cclxuICAgICAgICBlbmFibGVUcmFuc2Zvcm1PZmZzZXQ/OiBib29sZWFuOyAgICAvLyE8IGxpc3QgaXRlbSDjga4gb2Zmc2V0IOOCkiB0cmFuc2Zvcm0g44Gn6Kit5a6a44GZ44KLICjjgYLjgb7jgorjgojjgY/jgarjgYQpICAgICAgICAgIFtkZWZhdWx0OiBmYWxzZV1cclxuICAgICAgICBzY3JvbGxNYXBSZWZyZXNoSW50ZXJ2YWw/OiBudW1iZXI7ICAvLyE8IHNjcm9sbCBtYXAg6aCY5Z+f44Gu5pu05paw56K66KqN6ZaT6ZqULiBpc2Nyb2xsIOetieOAgemdniBET00g5pON5L2c5pmC44Gr5L2/55SoICAgICAgICBbZGVmYXVsdDogMjAwXVxyXG4gICAgICAgIHNjcm9sbFJlZnJlc2hEaXN0YW5jZT86IG51bWJlcjsgICAgIC8vITwgTGlzdFZpZXcg5pu05paw5Yem55CG44KS6KGM44GGIHNjcm9sbCDnp7vli5Xph48gKOOCouODq+OCtOODquOCuuODoOimi+ebtOOBl+OCguimlumHjikgICAgICBbZGVmYXVsdDogMjAwXVxyXG4gICAgICAgIHBhZ2VQcmVwYXJlQ291bnQ/OiBudW1iZXI7ICAgICAgICAgIC8vITwg6KGo56S66aCY5Z+f5aSW44Gn5a6M5YWo44Gq54q25oWL44Gn6L+95Yqg44GV44KM44KLIHBhZ2Ug5pWwICjliY3mlrnjg7vlvozmlrnlkIjjgo/jgZvjgaYgMuWAjSkgICBbZGVmYXVsdDogM11cclxuICAgICAgICBwYWdlUHJlbG9hZENvdW50PzogbnVtYmVyOyAgICAgICAgICAvLyE8IOihqOekuumgmOWfn+WkluOBpyBoaWRkZW4g54q25oWL44Gn6L+95Yqg44GV44KM44KLIHBhZ2Ug5pWwICjliY3mlrnjg7vlvozmlrnlkIjjgo/jgZvjgaYgMuWAjSkgW2RlZmF1bHQ6IDFdXHJcbiAgICAgICAgZW5hYmxlQW5pbWF0aW9uPzogYm9vbGVhbjsgICAgICAgICAgLy8hPCDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PjgpLmnInlirnjgavjgZnjgovloLTlkIjjga8gdHJ1ZS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkZWZhdWx0OiB0cnVlXVxyXG4gICAgICAgIGFuaW1hdGlvbkR1cmF0aW9uPzogbnVtYmVyOyAgICAgICAgIC8vITwg44Ki44OL44Oh44O844K344On44Oz44Gu6LK744KE44GZ5pmC6ZaTIChtc2VjKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZGVmYXVsdDogMF1cclxuICAgICAgICBiYXNlRGVwdGg/OiBzdHJpbmc7ICAgICAgICAgICAgICAgICAvLyE8IOWfuua6luOBqOOBmeOCiyB6LWluZGV4LiBcImNvbGxhcHNlXCIg5pmC44Gu44Ki44OL44Oh44O844K344On44Oz5pmC44Gr5L2/55SoICAgICAgICAgICAgIFtkZWZhdWx0OiBhdXRvXVxyXG4gICAgICAgIGl0ZW1UYWdOYW1lPzogc3RyaW5nOyAgICAgICAgICAgICAgIC8vITwgTGlzdEl0ZW1WaWV3IOOBjOS9v+eUqOOBmeOCi+OCv+OCsOWQjSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2RlZmF1bHQ6IGxpXVxyXG4gICAgICAgIHJlbW92ZUl0ZW1XaXRoVHJhbnNpdGlvbj86IGJvb2xlYW47IC8vITwgcmVtb3ZlSXRlbSgpIOaZguOBq+W/heimgeOBq+W/nOOBmOOBpuiHquWLleOBpyB0cmFuc2l0aW9uIOOCkuOBi+OBkeOCi+WgtOWQiOOBryB0cnVlICAgIFtkZWZhdWx0OiB0cnVlXVxyXG4gICAgICAgIC8vISDpnZ7jgqLjgq/jg4bjgqPjg5bjgaogc2Nyb2xsIG1hcCDjgavlr77jgZfjgaYgRHVtbXkg44KS5L2/55So44GZ44KL5aC05ZCI44GvIHRydWUuIChmbGlwc25hcCDliIfjgormm7/jgYjmmYLnrYkuIOWKueaenOOBr+OBguOBvuOCiuOBquOBlykgIFtkZWZhdWx0OiBmYWxzZV1cclxuICAgICAgICB1c2VEdW1teUluYWN0aXZlU2Nyb2xsTWFwPzogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJTGlzdFZpZXdGcmFtZXdvcmtcclxuICAgICAqIEBicmllZiBMaXN0VmlldyBGcmFtZXdvcmsg44GM5L2/55So44GZ44KL44Kk44Oz44K/44O844OV44Kn44Kk44K55a6a576pXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUxpc3RWaWV3RnJhbWV3b3JrIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTY3JvbGwgTWFwIOOBrumrmOOBleOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfSDnj77lnKjjga7pq5jjgZUgW3B4XVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldFNjcm9sbE1hcEhlaWdodCgpOiBudW1iZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNjcm9sbCBNYXAg44Gu6auY44GV44KS5pu05pawXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGVsdGUge051bWJlcn0gW2luXSDlpInljJbph4/jgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICB1cGRhdGVTY3JvbGxNYXBIZWlnaHQoZGVsdGE6IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWGhemDqCBQcm9maWxlIOOBruabtOaWsFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGZyb20ge051bWJlcn0gW2luXSDmm7TmlrDplovlp4vjgqTjg7Pjg4fjg4Pjgq/jgrnjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICB1cGRhdGVQcm9maWxlcyhmcm9tOiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTY3JvbGwgTWFwIEVsZW1lbnQg44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtqUXVlcnl9IHNjcm9sbCBtYXAgZWxlbWVudFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldFNjcm9sbE1hcEVsZW1lbnQoKTogSlF1ZXJ5O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg6rjgrXjgqTjgq/jg6vlj6/og73jgaogRWxlbWVudCDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge2pRdWVyeX0gcmVjeWNsZSBlbGVtZW50c1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZpbmRSZWN5Y2xlRWxlbWVudHMoKTogSlF1ZXJ5O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBMaXN0Vmlld09wdGlvbnMg44KS5Y+W5b6XXHJcbiAgICAgICAgICog44GZ44G544Gm44Gu44OX44Ot44OR44OG44Kj44Ki44Kv44K744K544KS5L+d6Ki844GZ44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtMaXN0Vmlld09wdGlvbnN9IG9wdGlvbiDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRMaXN0Vmlld09wdGlvbnMoKTogTGlzdFZpZXdPcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElTY3JvbGxlclxyXG4gICAgICogQGJyaWVmIFNjcm9sbGVyIOOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTY3JvbGxlciB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2Nyb2xsZXIg44Gu5Z6L5oOF5aCx44KS5Y+W5b6XXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0VHlwZSgpOiBzdHJpbmc7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBvc2l0aW9uIOWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfSA6IHBvc2l0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0UG9zKCk6IG51bWJlcjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcG9zaXRpb24g44Gu5pyA5aSn5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IDogcG9zaXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRQb3NNYXgoKTogbnVtYmVyO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqTjg5njg7Pjg4jnmbvpjLJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB0eXBlIHtTdHJpbmd9ICAgW2luXSBldmVudCDlkI1cclxuICAgICAgICAgKiBAcGFyYW0gZnVuYyB7RnVuY3Rpb259IFtpbl0gZXZlbnQgaGFuZGxlclxyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0gOiBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9uKHR5cGU6IHN0cmluZywgZnVuYzogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqTjg5njg7Pjg4jnmbvpjLLop6PpmaRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB0eXBlIHtTdHJpbmd9ICAgW2luXSBldmVudCDlkI1cclxuICAgICAgICAgKiBAcGFyYW0gZnVuYyB7RnVuY3Rpb259IFtpbl0gZXZlbnQgaGFuZGxlclxyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0gOiBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9mZih0eXBlOiBzdHJpbmcsIGZ1bmM6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44K544Kv44Ot44O844Or5L2N572u44KS5oyH5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcG9zICAgICB7TnVtYmVyfSAgW2luXSDjgrnjgq/jg63jg7zjg6vkvY3nva4gKDAgLSBwb3NNYXgpXHJcbiAgICAgICAgICogQHBhcmFtIGFuaW1hdGUge0Jvb2xlYW59IFtpbl0g44Ki44OL44Oh44O844K344On44Oz44Gu5pyJ54ShXHJcbiAgICAgICAgICogQHBhcmFtIHRpbWUgICAge051bWJlcn0gIFtpbl0g44Ki44OL44Oh44O844K344On44Oz44Gr6LK744KE44GZ5pmC6ZaTIFttc2VjXVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNjcm9sbFRvKHBvczogbnVtYmVyLCBhbmltYXRlPzogYm9vbGVhbiwgdGltZT86IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNjcm9sbGVyIOOBrueKtuaFi+abtOaWsFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHVwZGF0ZSgpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTY3JvbGxlciDjga7noLTmo4RcclxuICAgICAgICAgKi9cclxuICAgICAgICBkZXN0cm95KCk6IHZvaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSVNjcm9sbGFibGVcclxuICAgICAqIEBicmllZiBTY3JvbGwg44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVNjcm9sbGFibGUge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCueOCr+ODreODvOODq+OCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBoYW5kbGVyIHtGdW5jdGlvbn0gW2luXSDjg4/jg7Pjg4njg6nplqLmlbBcclxuICAgICAgICAgKiBAcGFyYW0gb24gICAgICB7Qm9vbGVhbn0gIFtpbl0gdHJ1ZTog6Kit5a6aIC8gZmFsc2U6IOino+mZpFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNldFNjcm9sbEhhbmRsZXIoaGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQsIG9uOiBib29sZWFuKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44K544Kv44Ot44O844Or57WC5LqG44Kk44OZ44Oz44OI44OP44Oz44OJ44Op6Kit5a6aL+ino+mZpFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGhhbmRsZXIge0Z1bmN0aW9ufSBbaW5dIOODj+ODs+ODieODqemWouaVsFxyXG4gICAgICAgICAqIEBwYXJhbSBvbiAgICAgIHtCb29sZWFufSAgW2luXSB0cnVlOiDoqK3lrpogLyBmYWxzZTog6Kej6ZmkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2V0U2Nyb2xsU3RvcEhhbmRsZXIoaGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQsIG9uOiBib29sZWFuKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44K544Kv44Ot44O844Or5L2N572u44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IDogcG9zaXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRTY3JvbGxQb3MoKTogbnVtYmVyO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrnjgq/jg63jg7zjg6vkvY3nva7jga7mnIDlpKflgKTjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0gOiBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldFNjcm9sbFBvc01heCgpOiBudW1iZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCueOCr+ODreODvOODq+S9jee9ruOCkuaMh+WumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHBvcyAgICAge051bWJlcn0gIFtpbl0g44K544Kv44Ot44O844Or5L2N572uICgwIC0gcG9zTWF4KVxyXG4gICAgICAgICAqIEBwYXJhbSBhbmltYXRlIHtCb29sZWFufSBbaW5dIOOCouODi+ODoeODvOOCt+ODp+ODs+OBruacieeEoVxyXG4gICAgICAgICAqIEBwYXJhbSB0aW1lICAgIHtOdW1iZXJ9ICBbaW5dIOOCouODi+ODoeODvOOCt+ODp+ODs+OBq+iyu+OChOOBmeaZgumWkyBbbXNlY11cclxuICAgICAgICAgKi9cclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmjIflrprjgZXjgozjgZ8gTGlzdEl0ZW1WaWV3IOOBruihqOekuuOCkuS/neiovFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGluZGV4ICAge051bWJlcn0gICAgICAgICAgICAgICBbaW5dIExpc3RJdGVtVmlldyDjga7jgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7RW5zdXJlVmlzaWJsZU9wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZW5zdXJlVmlzaWJsZShpbmRleDogbnVtYmVyLCBvcHRpb25zPzogRW5zdXJlVmlzaWJsZU9wdGlvbnMpOiB2b2lkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElCYWNrdXBSZXN0b3JlXHJcbiAgICAgKiBAYnJpZWYgQmFja3VwL1Jlc3RvcmUg44Gu44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUJhY2t1cFJlc3RvcmUge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWGhemDqOODh+ODvOOCv+OCkuODkOODg+OCr+OCouODg+ODl1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGtleSB7U3RyaW5nfSBbaW5dIOODkOODg+OCr+OCouODg+ODl+OCreODvOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaIkOWKnyAvIGZhbHNlOiDlpLHmlZdcclxuICAgICAgICAgKi9cclxuICAgICAgICBiYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlhoXpg6jjg4fjg7zjgr/jgpLjg6rjgrnjg4jjgqJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBrZXkgICAgIHtTdHJpbmd9ICBbaW5dIOODkOODg+OCr+OCouODg+ODl+OCreODvOOCkuaMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSByZWJ1aWxkIHtCb29sZWFufSBbaW5dIHJlYnVpbGQg44KS5a6f6KGM44GZ44KL5aC05ZCI44GvIHRydWUg44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5oiQ5YqfIC8gZmFsc2U6IOWkseaVl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJlc3RvcmUoa2V5OiBzdHJpbmcsIHJlYnVpbGQ6IGJvb2xlYW4pOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7mnInnhKFcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBrZXkge1N0cmluZ30gW2luXSDjg5Djg4Pjgq/jgqLjg4Pjg5fjgq3jg7zjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDmnIkgLyBmYWxzZTog54ShXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaGFzQmFja3VwKGtleTogc3RyaW5nKTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gu56C05qOEXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ga2V5IHtTdHJpbmd9IFtpbl0g44OQ44OD44Kv44Ki44OD44OX44Kt44O844KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5oiQ5YqfIC8gZmFsc2U6IOWkseaVl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNsZWFyQmFja3VwKGtleT86IHN0cmluZyk6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBq+OCouOCr+OCu+OCuVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7YW55fSDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBiYWNrdXBEYXRhOiBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICBleHBvcnQgdHlwZSBWaWV3Q29uc3RydWN0b3IgPSBuZXcgKG9wdGlvbnM/OiBCYWNrYm9uZS5WaWV3T3B0aW9uczxCYWNrYm9uZS5Nb2RlbD4pID0+IEJhY2tib25lLlZpZXc8QmFja2JvbmUuTW9kZWw+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJQ29tcG9zYWJsZVZpZXdcclxuICAgICAqIEBicmllZiBJQ29tcG9zYWJsZVZpZXdTdGF0aWMg44Gu44OX44Ot44Kt44K344Kk44Oz44K/44O844OV44Kn44Kk44K5IChleHBlcmltZW50YWwpXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUNvbXBvc2FibGVWaWV3IHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSUNvbXBvc2FibGVWaWV3U3RhdGljXHJcbiAgICAgKiBAYnJpZWYgVmlldyBjb21wb3NlIOOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElDb21wb3NhYmxlVmlld1N0YXRpYyB7XHJcbiAgICAgICAgbmV3ICgpOiBJQ29tcG9zYWJsZVZpZXc7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44GZ44Gn44Gr5a6a576p44GV44KM44GfIEJhY2tib25lLlZpZXcg44KS5Z+65bqV44Kv44Op44K544Gr6Kit5a6a44GX44CBZXh0ZW5kIOOCkuWun+ihjOOBmeOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRlcml2ZXMgICAgICAgICB7QmFja2JvbmUuVmlld3xCYWNrYm9uZS5WaWV3W119IFtpbl0g5ZCI5oiQ5YWD44GuIFZpZXcg44Kv44Op44K5XHJcbiAgICAgICAgICogQHBhcmFtIHByb3BlcnRpZXMgICAgICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgIFtpbl0gcHJvdG90eXBlIOODl+ODreODkeODhuOCo1xyXG4gICAgICAgICAqIEBwYXJhbSBjbGFzc1Byb3BlcnRpZXMge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHN0YXRpYyDjg5fjg63jg5Hjg4bjgqNcclxuICAgICAgICAgKiBAcmV0dXJuIHtCYWNrYm9uZS5WaWV3fEJhY2tib25lLlZpZXdbXX0g5paw6KaP44Gr55Sf5oiQ44GV44KM44GfIFZpZXcg44Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29tcG9zZShkZXJpdmVzOiBWaWV3Q29uc3RydWN0b3IgfCBWaWV3Q29uc3RydWN0b3JbXSwgcHJvcGVydGllczogYW55LCBjbGFzc1Byb3BlcnRpZXM/OiBhbnkpOiBWaWV3Q29uc3RydWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgVXBkYXRlSGVpZ2h0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIElMaXN0SXRlbVZpZXcudXBkYXRlSGVpZ2h0KCkg44Gr5rih44Gb44KL44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVXBkYXRlSGVpZ2h0T3B0aW9ucyB7XHJcbiAgICAgICAgcmVmbGVjdEFsbD86IGJvb2xlYW47ICAgIC8vITwgbGluZSDjga7pq5jjgZXmm7TmlrDmmYLjgavlvbHpn7/jgZnjgovjgZnjgbnjgabjga4gTGluZVByb2ZpbGUg44Gu5YaN6KiI566X44KS6KGM44GG5aC05ZCI44GvIHRydWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSUxpc3RJdGVtVmlld1xyXG4gICAgICogQGJyaWVmICAgICBMaXN0VmlldyDjga4gMeihjOWIhuOCkuani+aIkOOBmeOCiyBDaGlsZCBWaWV3IOOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElMaXN0SXRlbVZpZXcge1xyXG4gICAgICAgIC8vISDoh6rouqvjga4gTGluZSDjgqTjg7Pjg4fjg4Pjgq/jgrnjgpLlj5blvpdcclxuICAgICAgICBnZXRJbmRleCgpOiBudW1iZXI7XHJcbiAgICAgICAgLy8hIOiHqui6q+OBq+aMh+WumuOBleOCjOOBn+mrmOOBleOCkuWPluW+l1xyXG4gICAgICAgIGdldFNwZWNpZmllZEhlaWdodCgpOiBudW1iZXI7XHJcbiAgICAgICAgLy8hIGNoaWxkIG5vZGUg44GM5a2Y5Zyo44GZ44KL44GL5Yik5a6aXHJcbiAgICAgICAgaGFzQ2hpbGROb2RlKCk6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOmrmOOBleOCkuabtOaWsFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG5ld0hlaWdodCB7TnVtYmVyfSAgICAgICAgICAgICAgW2luXSDmlrDjgZfjgYTpq5jjgZVcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyAgIHtVcGRhdGVIZWlnaHRPcHRpb25zfSBbaW5dIGxpbmUg44Gu6auY44GV5pu05paw5pmC44Gr5b2x6Z+/44GZ44KL44GZ44G544Gm44GuIExpbmVQcm9maWxlIOOBruWGjeioiOeul+OCkuihjOOBhuWgtOWQiOOBryB7IHJlZmxlY3RBbGw6IHRydWUgfVxyXG4gICAgICAgICAqIEByZXR1cm4ge0lMaXN0SXRlbVZpZXd9IOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHVwZGF0ZUhlaWdodChuZXdIZWlnaHQ6IG51bWJlciwgb3B0aW9ucz86IFVwZGF0ZUhlaWdodE9wdGlvbnMpOiBJTGlzdEl0ZW1WaWV3O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBCYXNlTGlzdEl0ZW1WaWV3XHJcbiAgICAgKiBAYnJpZWYgICAgIElMaXN0SXRlbVZpZXcg44GuIGFsaWFzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFzZUxpc3RJdGVtVmlldyBleHRlbmRzIElMaXN0SXRlbVZpZXcsIEJhY2tib25lLlZpZXc8QmFja2JvbmUuTW9kZWw+IHsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBFbnN1cmVWaXNpYmxlT3B0aW9uc1xyXG4gICAgICogQGJyaWVmIElMaXN0Vmlldy5lbnN1cmVWaXNpYmxlKCkg44Gr5rih44Gb44KL44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRW5zdXJlVmlzaWJsZU9wdGlvbnMge1xyXG4gICAgICAgIHBhcnRpYWxPSz86IGJvb2xlYW47ICAgIC8vITwg6YOo5YiG55qE6KGo56S644KS6Kix5Y+v44GZ44KL5aC05ZCIIHRydWUsIGRlZmF1bHQ6IHRydWUuXHJcbiAgICAgICAgc2V0VG9wPzogYm9vbGVhbjsgICAgICAgLy8hPCDlvLfliLbnmoTjgavjgrnjgq/jg63jg7zjg6vpoJjln5/jga7kuIrpg6jjgavnp7vli5XjgZnjgovloLTlkIggdHJ1ZSwgZGVmYXVsdDogZmFsc2UuXHJcbiAgICAgICAgYW5pbWF0ZT86IGJvb2xlYW47ICAgICAgLy8hPCDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PjgZnjgovloLTlkIggdHJ1ZS4gZGVmYXVsdDogTGlzdFZpZXdPcHRpb25zLmVuYWJsZUFuaW1hdGlvbiDjga7oqK3lrprjgajlkIzmnJ9cclxuICAgICAgICB0aW1lPzogbnVtYmVyOyAgICAgICAgICAvLyE8IOOCouODi+ODoeODvOOCt+ODp+ODs+OBq+iyu+OChOOBmeaZgumWkyBbbXNlY11cclxuICAgICAgICBjYWxsYmFjaz86ICgpID0+IHZvaWQ7ICAvLyE8IOOCouODi+ODoeODvOOCt+ODp+ODs+e1guS6huOBruOCv+OCpOODn+ODs+OCsOOBp+OCs+ODvOODq+OBleOCjOOCiy4gKOeWkeS8vOeahClcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSUxpc3RWaWV3XHJcbiAgICAgKiBAYnJpZWYgTGlzdFZpZXcg44Gu44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUxpc3RWaWV3IGV4dGVuZHMgSVNjcm9sbGFibGUsIElCYWNrdXBSZXN0b3JlIHtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBQcm9maWxlIOeuoeeQhlxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDliJ3mnJ/ljJbmuIjjgb/jgYvliKTlrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOWIneacn+WMlua4iOOBvyAvIGZhbHNlOiDmnKrliJ3mnJ/ljJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBpc0luaXRpYWxpemVkKCk6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEl0ZW0g55m76YyyXHJcbiAgICAgICAgICog44OX44Ot44OR44OG44Kj44KS5oyH5a6a44GX44Gm44CBTGlzdEl0ZW0g44KS566h55CGXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gaGVpZ2h0ICAgICAge051bWJlcn0gICBbaW5dIOODqeOCpOODs+OBrumrmOOBlVxyXG4gICAgICAgICAqIEBwYXJhbSBpbml0aWFsaXplciB7RnVuY3Rpb259IFtpbl0gTGlzdEl0ZW1WaWV3IOa0vueUn+OCr+ODqeOCueOBruOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gICAgICAgICAqIEBwYXJhbSBpbmZvICAgICAgICB7T2JqZWN0fSAgIFtpbl0gaW5pdGlhbGl6ZXIg44Gr5rih44GV44KM44KL44Kq44OX44K344On44Oz5byV5pWwXHJcbiAgICAgICAgICogQHBhcmFtIGluc2VydFRvICAgIHtOdW1iZXJ9ICAgW2luXSDjg6njgqTjg7Pjga7mjL/lhaXkvY3nva7jgpLjgqTjg7Pjg4fjg4Pjgq/jgrnjgafmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBhZGRJdGVtKGhlaWdodDogbnVtYmVyLCBpbml0aWFsaXplcjogbmV3IChvcHRpb25zPzogYW55KSA9PiBCYXNlTGlzdEl0ZW1WaWV3LCBpbmZvOiBhbnksIGluc2VydFRvPzogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44GfIEl0ZW0g44KS5YmK6ZmkXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gaW5kZXgge051bWJlcnxOdW1iZXJbXX0gW2luXSDop6PpmaTplovlp4vjga7jgqTjg7Pjg4fjg4Pjgq/jgrnjgpLmjIflrpouIOmFjeWIl+eJiOOBryByZXZlcnNlIGluZGV4IOOCkuaMh+WumuOBmeOCi+OBu+OBhuOBjOWKueeOh+eahFxyXG4gICAgICAgICAqIEBwYXJhbSBzaXplICB7TnVtYmVyfSAgICAgICAgICBbaW5dIOino+mZpOOBmeOCi+ODqeOCpOODs+OBrue3j+aVsC4g5pei5a6aOiAxXHJcbiAgICAgICAgICogQHBhcmFtIGRlbGF5IHtOdW1iZXJ9ICAgICAgICAgIFtpbl0g5a6f6Zqb44Gr6KaB57Sg44KS5YmK6Zmk44GZ44KLIGRlbGF5IHRpbWUg5pei5a6aOiAwICjljbPmmYLliYrpmaQpXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogbnVtYmVyLCBzaXplPzogbnVtYmVyLCBkZWxheT86IG51bWJlcik6IHZvaWQ7XHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogbnVtYmVyW10sIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44GfIEl0ZW0g44Gr6Kit5a6a44GX44Gf5oOF5aCx44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IHtOdW1iZXJ8SlF1ZXJ5LkV2ZW50fSBbaW5dIOitmOWIpeWtkC4gW2luZGV4IHwgZXZlbnQgb2JqZWN0XVxyXG4gICAgICAgICAqIEByZXR1cm4ge09iamVjdH0gX2FkZExpbmUoKSDjgavmjIflrprjgZfjgZ8gaW5mbyDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRJdGVtSW5mbyh0YXJnZXQ6IG51bWJlcik6IGFueTtcclxuICAgICAgICBnZXRJdGVtSW5mbyh0YXJnZXQ6IEpRdWVyeS5FdmVudCk6IGFueTtcclxuXHJcbiAgICAgICAgLy8hIOOCouOCr+ODhuOCo+ODluODmuODvOOCuOOCkuabtOaWsFxyXG4gICAgICAgIHJlZnJlc2goKTogdm9pZDtcclxuICAgICAgICAvLyEg5pyq44Ki44K144Kk44Oz44Oa44O844K444KS5qeL56+JXHJcbiAgICAgICAgdXBkYXRlKCk6IHZvaWQ7XHJcbiAgICAgICAgLy8hIOODmuODvOOCuOOCouOCteOCpOODs+OCkuWGjeani+aIkFxyXG4gICAgICAgIHJlYnVpbGQoKTogdm9pZDtcclxuICAgICAgICAvLyEg566h6L2E44OH44O844K/44KS56C05qOEXHJcbiAgICAgICAgcmVsZWFzZSgpOiB2b2lkO1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIFByb3BlcnRpZXM6XHJcblxyXG4gICAgICAgIC8vISBjb3JlIGZyYW1ld29yayBhY2Nlc3NcclxuICAgICAgICBjb3JlOiBJTGlzdFZpZXdGcmFtZXdvcms7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIExpc3RWaWV3IOOBruOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElMaXN0VmlldyB7XHJcbiAgICAgICAgLy8hIOeZu+mMsiBmcmFtZXdvcmsg44GM5L2/55So44GZ44KLXHJcbiAgICAgICAgX2FkZExpbmU/KF9saW5lOiBMaW5lUHJvZmlsZSwgaW5zZXJ0VG8/OiBudW1iZXIpOiB2b2lkO1xyXG4gICAgICAgIF9hZGRMaW5lPyhfbGluZTogTGluZVByb2ZpbGVbXSwgaW5zZXJ0VG8/OiBudW1iZXIpOiB2b2lkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBCYXNlTGlzdFZpZXdcclxuICAgICAqIEBicmllZiAgICAgSUxpc3RWaWV3IOOBriBhbGlhc1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJhc2VMaXN0VmlldyBleHRlbmRzIElMaXN0VmlldywgQmFja2JvbmUuVmlldzxCYWNrYm9uZS5Nb2RlbD4geyB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSVN0YXR1c01hbmFnZXJcclxuICAgICAqIEBicmllZiDnirbmhYvnrqHnkIbjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3RhdHVzTWFuYWdlciB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog54q25oWL5aSJ5pWw44Gu5Y+C54Wn44Kr44Km44Oz44OI44Gu44Kk44Oz44Kv44Oq44Oh44Oz44OIXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdHVzIHtTdHJpbmd9IFtpbl0g54q25oWL6K2Y5Yil5a2QXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdHVzQWRkUmVmKHN0YXR1czogc3RyaW5nKTogbnVtYmVyO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jg4fjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMge1N0cmluZ30gW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0dXNSZWxlYXNlKHN0YXR1czogc3RyaW5nKTogbnVtYmVyO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlh6bnkIbjgrnjgrPjg7zjg5fmr47jgavnirbmhYvlpInmlbDjgpLoqK3lrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMgICB7U3RyaW5nfSAgIFtpbl0g54q25oWL6K2Y5Yil5a2QXHJcbiAgICAgICAgICogQHBhcmFtIGNhbGxiYWNrIHtGdW5jdGlvbn0gW2luXSDlh6bnkIbjgrPjg7zjg6vjg5Djg4Pjgq9cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0dXNTY29wZShzdGF0dXM6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmjIflrprjgZfjgZ/nirbmhYvkuK3jgafjgYLjgovjgYvnorroqo1cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMge1N0cmluZ30gICBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOeKtuaFi+WGhSAvIGZhbHNlOiDnirbmhYvlpJZcclxuICAgICAgICAgKi9cclxuICAgICAgICBpc1N0YXR1c0luKHN0YXR1czogc3RyaW5nKTogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJRXhwYW5kTWFuYWdlclxyXG4gICAgICogQGJyaWVmIOmWi+mWieeuoeeQhuOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElFeHBhbmRNYW5hZ2VyIGV4dGVuZHMgSUJhY2t1cFJlc3RvcmUsIElTdGF0dXNNYW5hZ2VyIHtcclxuICAgICAgICBsYXlvdXRLZXk6IHN0cmluZzsgICAgLy8gbGF5b3V0IGtleSAocG9ydHJhdGUvbGFuZHNjYXBl44GU44Go44GrIGxheW91dOaDheWgseOBq+OCouOCr+OCu+OCuSlcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5paw6KaPIEdyb3VwUHJvZmlsZSDjgpLkvZzmiJBcclxuICAgICAgICAgKiDnmbvpjLLmuIjjgb/jga7loLTlkIjjga/jgZ3jga7jgqrjg5bjgrjjgqfjgq/jg4jjgpLov5TljbRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJtYSBpZCB7U3RyaW5nfSBbaW5dIOaWsOimj+OBq+S9nOaIkOOBmeOCiyBHcm91cCBJRCDjgpLmjIflrpouIOaMh+WumuOBl+OBquOBhOWgtOWQiOOBr+iHquWLleWJsuOCiuaMr+OCilxyXG4gICAgICAgICAqIEByZXR1cm4ge0dyb3VwUHJvZmlsZX0gR3JvdXBQcm9maWxlIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG5ld0dyb3VwKGlkPzogc3RyaW5nKTogR3JvdXBQcm9maWxlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnmbvpjLLmuIjjgb8gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFybWEgaWQge1N0cmluZ30gW2luXSDlj5blvpfjgZnjgosgR3JvdXAgSUQg44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiB7R3JvdXBQcm9maWxlfSBHcm91cFByb2ZpbGUg44Kk44Oz44K544K/44Oz44K5IC8gbnVsbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldEdyb3VwKGlkOiBzdHJpbmcpOiBHcm91cFByb2ZpbGU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOesrDHpmo7lsaTjga4gR3JvdXAg55m76YyyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdG9wR3JvdXAge0dyb3VwUHJvZmlsZX0gW2luXSDmp4vnr4nmuIjjgb8gR3JvdXBQcm9maWxlIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJlZ2lzdGVyVG9wR3JvdXAodG9wR3JvdXA6IEdyb3VwUHJvZmlsZSk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOesrDHpmo7lsaTjga4gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgICog44Kz44OU44O86YWN5YiX44GM6L+U44GV44KM44KL44Gf44KB44CB44Kv44Op44Kk44Ki44Oz44OI44Gv44Kt44Oj44OD44K344Ol5LiN5Y+vXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtHcm91cFByb2ZpbGVbXX0gR3JvdXBQcm9maWxlIOmFjeWIl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldFRvcEdyb3VwcygpOiBHcm91cFByb2ZpbGVbXTtcclxuXHJcbiAgICAgICAgLy8hIOOBmeOBueOBpuOBruOCsOODq+ODvOODl+OCkuWxlemWiyAoMemajuWxpClcclxuICAgICAgICBleHBhbmRBbGwoKTogdm9pZDtcclxuXHJcbiAgICAgICAgLy8hIOOBmeOBueOBpuOBruOCsOODq+ODvOODl+OCkuWPjuadnyAoMemajuWxpClcclxuICAgICAgICBjb2xsYXBzZUFsbChkZWxheT86IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8vISDlsZXplovkuK3jgYvliKTlrppcclxuICAgICAgICBpc0V4cGFuZGluZygpOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvLyEg5Y+O5p2f5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNDb2xsYXBzaW5nKCk6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8vISDplovplonkuK3jgYvliKTlrppcclxuICAgICAgICBpc1N3aXRjaGluZygpOiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEV4cGFuZGFibGVMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIOmWi+mWieODquOCueODiOODk+ODpeODvOOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElFeHBhbmRhYmxlTGlzdFZpZXcgZXh0ZW5kcyBJTGlzdFZpZXcsIElFeHBhbmRNYW5hZ2VyIHsgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBCYXNlRXhwYW5kYWJsZUxpc3RWaWV3XHJcbiAgICAgKiBAYnJpZWYgICAgIElFeHBhbmRhYmxlTGlzdFZpZXcg44GuIGFsaWFzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFzZUV4cGFuZGFibGVMaXN0VmlldyBleHRlbmRzIElFeHBhbmRhYmxlTGlzdFZpZXcsIEJhY2tib25lLlZpZXc8QmFja2JvbmUuTW9kZWw+IHsgfVxyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcImNkcC51aS5saXN0dmlld1wiIHtcclxuICAgIGNvbnN0IFVJOiB0eXBlb2YgQ0RQLlVJO1xyXG4gICAgZXhwb3J0ID0gVUk7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBMaXN0Vmlld0dsb2JhbENvbmZpZ1xyXG4gICAgICogQGJyaWVmIGNkcC51aS5saXN0dmlldyDjga4gZ2xvYmFsIGNvbmZpbmdcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IG1vZHVsZSBMaXN0Vmlld0dsb2JhbENvbmZpZyB7XHJcbiAgICAgICAgZXhwb3J0IGxldCBXUkFQUEVSX0NMQVNTICAgICAgICAgICAgICAgID0gXCJ1aS1saXN0dmlldy13cmFwcGVyXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBXUkFQUEVSX1NFTEVDVE9SICAgICAgICAgICAgID0gXCIuXCIgKyBXUkFQUEVSX0NMQVNTO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0NST0xMX01BUF9DTEFTUyAgICAgICAgICAgICA9IFwidWktbGlzdHZpZXctc2Nyb2xsLW1hcFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgU0NST0xMX01BUF9TRUxFQ1RPUiAgICAgICAgICA9IFwiLlwiICsgU0NST0xMX01BUF9DTEFTUztcclxuICAgICAgICBleHBvcnQgbGV0IElOQUNUSVZFX0NMQVNTICAgICAgICAgICAgICAgPSBcImluYWN0aXZlXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBJTkFDVElWRV9DTEFTU19TRUxFQ1RPUiAgICAgID0gXCIuXCIgKyBJTkFDVElWRV9DTEFTUztcclxuICAgICAgICBleHBvcnQgbGV0IFJFQ1lDTEVfQ0xBU1MgICAgICAgICAgICAgICAgPSBcInVpLWxpc3R2aWV3LXJlY3ljbGVcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFJFQ1lDTEVfQ0xBU1NfU0VMRUNUT1IgICAgICAgPSBcIi5cIiArIFJFQ1lDTEVfQ0xBU1M7XHJcbiAgICAgICAgZXhwb3J0IGxldCBMSVNUSVRFTV9CQVNFX0NMQVNTICAgICAgICAgID0gXCJ1aS1saXN0dmlldy1pdGVtLWJhc2VcIjtcclxuICAgICAgICBleHBvcnQgbGV0IExJU1RJVEVNX0JBU0VfQ0xBU1NfU0VMRUNUT1IgPSBcIi5cIiArIExJU1RJVEVNX0JBU0VfQ0xBU1M7XHJcbiAgICAgICAgZXhwb3J0IGxldCBEQVRBX1BBR0VfSU5ERVggICAgICAgICAgICAgID0gXCJkYXRhLXBhZ2UtaW5kZXhcIjtcclxuICAgICAgICBleHBvcnQgbGV0IERBVEFfQ09OVEFJTkVSX0lOREVYICAgICAgICAgPSBcImRhdGEtY29udGFpbmVyLWluZGV4XCI7XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgLy8gY2RwLnVpLmxpc3R2aWV3IOOBryBjZHAuY29yZSDjgavkvp3lrZjjgZfjgarjgYTjgZ/jgoHjgIHni6zoh6rjgatnbG9iYWwg44KS5o+Q5L6b44GZ44KLXHJcbiAgICAvKmpzaGludCBldmlsOnRydWUgKi9cclxuICAgIGV4cG9ydCBjb25zdCBnbG9iYWwgPSAoPGFueT5DRFApLmdsb2JhbCB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XHJcbiAgICAvKmpzaGludCBldmlsOmZhbHNlICovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCYWNrYm9uZS5WaWV3IOOBruaWsOimj+WQiOaIkFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBiYXNlICAgIHtCYWNrYm9uZS5WaWV3fSAgICAgICAgICAgICAgICAgW2luXSBwcm90b3R5cGUgY2hhaW4g5pyA5LiL5L2N44GuIFZpZXcg44Kv44Op44K5XHJcbiAgICAgKiBAcGFyYW0gZGVyaXZlcyB7QmFja2JvbmUuVmlld3xCYWNrYm9uZS5WaWV3W119IFtpbl0g5rS+55Sf44GV44KM44KL44GuIFZpZXcg44Kv44Op44K5XHJcbiAgICAgKiBAcmV0dXJuIHtCYWNrYm9uZS5WaWV3fEJhY2tib25lLlZpZXdbXX0g5paw6KaP44Gr55Sf5oiQ44GV44KM44GfIFZpZXcg44Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjb21wb3NlVmlld3MoYmFzZTogVmlld0NvbnN0cnVjdG9yLCBkZXJpdmVzOiBWaWV3Q29uc3RydWN0b3IgfCBWaWV3Q29uc3RydWN0b3JbXSk6IFZpZXdDb25zdHJ1Y3RvciB7XHJcbiAgICAgICAgbGV0IF9jb21wb3NlZCA9IGJhc2U7XHJcbiAgICAgICAgY29uc3QgX2Rlcml2ZXMgPSA8Vmlld0NvbnN0cnVjdG9yW10+KGRlcml2ZXMgaW5zdGFuY2VvZiBBcnJheSA/IGRlcml2ZXMgOiBbZGVyaXZlc10pO1xyXG4gICAgICAgIF9kZXJpdmVzLmZvckVhY2goKGRlcml2ZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBzZWVkID0ge307XHJcbiAgICAgICAgICAgIF8uZXh0ZW5kT3duKHNlZWQsIGRlcml2ZS5wcm90b3R5cGUpO1xyXG4gICAgICAgICAgICBkZWxldGUgc2VlZC5jb25zdHJ1Y3RvcjtcclxuICAgICAgICAgICAgX2NvbXBvc2VkID0gKDxhbnk+X2NvbXBvc2VkKS5leHRlbmQoc2VlZCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIF9jb21wb3NlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJhY2tib25lLlZpZXcg44Gu5ZCI5oiQXHJcbiAgICAgKiBwcm90b3R5cGUgY2hhaW4g44KS5L2c44KL5ZCI5oiQXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRlcml2ZWQge0JhY2tib25lLlZpZXd9ICAgICAgICAgICAgICAgICBbaW5dIHByb3RvdHlwZSBjaGFpbiDmnIDkuIrkvY3jga4gVmlldyDjgq/jg6njgrlcclxuICAgICAqIEBwYXJhbSBiYXNlcyAgIHtCYWNrYm9uZS5WaWV3fEJhY2tib25lLlZpZXdbXX0gW2luXSDlkIjmiJDlhYPjga5WaWV3IOOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZGVyaXZlVmlld3MoZGVyaXZlZDogVmlld0NvbnN0cnVjdG9yLCBiYXNlczogVmlld0NvbnN0cnVjdG9yIHwgVmlld0NvbnN0cnVjdG9yW10pOiB2b2lkIHtcclxuICAgICAgICBsZXQgX2NvbXBvc2VkOiBWaWV3Q29uc3RydWN0b3I7XHJcbiAgICAgICAgY29uc3QgX2Jhc2VzID0gPFZpZXdDb25zdHJ1Y3RvcltdPihiYXNlcyBpbnN0YW5jZW9mIEFycmF5ID8gYmFzZXMgOiBbYmFzZXNdKTtcclxuICAgICAgICBpZiAoMiA8PSBfYmFzZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIF9jb21wb3NlZCA9IGNvbXBvc2VWaWV3cyhfYmFzZXNbMF0sIF9iYXNlcy5zbGljZSgxKSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgX2NvbXBvc2VkID0gX2Jhc2VzWzBdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZXJpdmVkID0gY29tcG9zZVZpZXdzKF9jb21wb3NlZCwgZGVyaXZlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCYWNrYm9uZS5WaWV3IOOBruWQiOaIkFxyXG4gICAgICogcHJvdG90eXBlIGNoYWluIOOCkuS9nOOCieOBquOBhOWQiOaIkFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZXJpdmVkIHtCYWNrYm9uZS5WaWV3fSAgICAgICAgICAgICAgICAgW2luXSDlhYPjgajjgarjgosgVmlldyDjgq/jg6njgrlcclxuICAgICAqIEBwYXJhbSBiYXNlcyAgIHtCYWNrYm9uZS5WaWV3fEJhY2tib25lLlZpZXdbXX0gW2luXSDlkIjmiJDlhYPjga5WaWV3IOOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gbWl4aW5WaWV3cyhkZXJpdmVkOiBWaWV3Q29uc3RydWN0b3IsIGJhc2VzOiBWaWV3Q29uc3RydWN0b3IgfCBWaWV3Q29uc3RydWN0b3JbXSk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IF9iYXNlcyA9IDxWaWV3Q29uc3RydWN0b3JbXT4oYmFzZXMgaW5zdGFuY2VvZiBBcnJheSA/IGJhc2VzIDogW2Jhc2VzXSk7XHJcbiAgICAgICAgX2Jhc2VzLmZvckVhY2goKGJhc2UpID0+IHtcclxuICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoYmFzZS5wcm90b3R5cGUpLmZvckVhY2gobmFtZSA9PiB7XHJcbiAgICAgICAgICAgICAgICBkZXJpdmVkLnByb3RvdHlwZVtuYW1lXSA9IGJhc2UucHJvdG90eXBlW25hbWVdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIF9MaXN0Vmlld1V0aWxzXHJcbiAgICAgKiBAYnJpZWYg5YaF6YOo44Gn5L2/55So44GZ44KL5L6/5Yip6Zai5pWwXHJcbiAgICAgKiAgICAgICAgVG9vbHMg44GL44KJ44Gu5pyA5L2O6ZmQ44Gu5rWB55SoXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBtb2R1bGUgX0xpc3RWaWV3VXRpbHMge1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjc3Mg44GuIHZlbmRlciDmi6HlvLUgcHJlZml4IOOCkui/lOOBmVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9IHByZWZpeFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBjb25zdCBjc3NQcmVmaXhlcyA9IFtcIi13ZWJraXQtXCIsIFwiLW1vei1cIiwgXCItbXMtXCIsIFwiLW8tXCIsIFwiXCJdO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjc3Mg44GuIG1hdHJpeCDjga7lgKTjgpLlj5blvpcuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZWxlbWVudCB7alF1ZXJ5fSBbaW5dIOWvvuixoeOBriBqUXVlcnkg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHBhcmFtIHR5cGUgICAge1N0cmluZ30gW2luXSBtYXRyaXggdHlwZSBzdHJpbmcgW3RyYW5zbGF0ZVggfCB0cmFuc2xhdGVZIHwgc2NhbGVYIHwgc2NhbGVZXVxyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0gdmFsdWVcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgY29uc3QgZ2V0Q3NzTWF0cml4VmFsdWUgPSAoZWxlbWVudDogSlF1ZXJ5LCB0eXBlOiBzdHJpbmcpOiBudW1iZXIgPT4ge1xyXG4gICAgICAgICAgICBsZXQgdHJhbnNYID0gMDtcclxuICAgICAgICAgICAgbGV0IHRyYW5zWSA9IDA7XHJcbiAgICAgICAgICAgIGxldCBzY2FsZVggPSAwO1xyXG4gICAgICAgICAgICBsZXQgc2NhbGVZID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjc3NQcmVmaXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IG1hdHJpeCA9ICQoZWxlbWVudCkuY3NzKGNzc1ByZWZpeGVzW2ldICsgXCJ0cmFuc2Zvcm1cIik7XHJcbiAgICAgICAgICAgICAgICBpZiAobWF0cml4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaXMzZE1hdHJpeCA9IG1hdHJpeC5pbmRleE9mKFwiM2RcIikgIT09IC0xID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeCA9IG1hdHJpeC5yZXBsYWNlKFwibWF0cml4M2RcIiwgXCJcIikucmVwbGFjZShcIm1hdHJpeFwiLCBcIlwiKS5yZXBsYWNlKC9bXlxcZC4sLV0vZywgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYXJyID0gbWF0cml4LnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc1ggPSBOdW1iZXIoYXJyW2lzM2RNYXRyaXggPyAxMiA6IDRdKTtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc1kgPSBOdW1iZXIoYXJyW2lzM2RNYXRyaXggPyAxMyA6IDVdKTtcclxuICAgICAgICAgICAgICAgICAgICBzY2FsZVggPSBOdW1iZXIoYXJyWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICBzY2FsZVkgPSBOdW1iZXIoYXJyW2lzM2RNYXRyaXggPyA1IDogM10pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInRyYW5zbGF0ZVhcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNOYU4odHJhbnNYKSA/IDAgOiB0cmFuc1g7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwidHJhbnNsYXRlWVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc05hTih0cmFuc1kpID8gMCA6IHRyYW5zWTtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY2FsZVhcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNOYU4oc2NhbGVYKSA/IDEgOiBzY2FsZVg7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2NhbGVZXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzTmFOKHNjYWxlWSkgPyAxIDogc2NhbGVZO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFwidHJhbnNpdGlvbmVuZFwiIOOBruOCpOODmeODs+ODiOWQjemFjeWIl+OCkui/lOOBmVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9IHRyYW5zaXRpb25lbmQg44Kk44OZ44Oz44OI5ZCNXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IHRyYW5zaXRpb25FbmQgPSBcInRyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCBNU1RyYW5zaXRpb25FbmRcIjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdHJhbnNpdGlvbiDoqK3lrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnRcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgY29uc3Qgc2V0VHJhbnNmb3Jtc1RyYW5zaXRpb25zID0gKGVsZW1lbnQ6IEpRdWVyeSwgcHJvcDogc3RyaW5nLCBtc2VjOiBudW1iZXIsIHRpbWluZ0Z1bmN0aW9uOiBzdHJpbmcpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2l0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICBjb25zdCBzZWNvbmQgPSAobXNlYyAvIDEwMDApICsgXCJzXCI7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuaW1hdGlvbiA9IFwiIFwiICsgc2Vjb25kICsgXCIgXCIgKyB0aW1pbmdGdW5jdGlvbjtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gXCIsIHRyYW5zZm9ybVwiICsgYW5pbWF0aW9uO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjc3NQcmVmaXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbnNbY3NzUHJlZml4ZXNbaV0gKyBcInRyYW5zaXRpb25cIl0gPSBwcm9wICsgYW5pbWF0aW9uICsgdHJhbnNmb3JtO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkZWxlbWVudC5jc3ModHJhbnNpdGlvbnMpO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiB0cmFuc2l0aW9uIOioreWumuOBruWJiumZpFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBjb25zdCBjbGVhclRyYW5zaXRpb25zID0gKGVsZW1lbnQ6IEpRdWVyeSk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9ICQoZWxlbWVudCk7XHJcblxyXG4gICAgICAgICAgICAkZWxlbWVudC5vZmYodHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zaXRpb25zID0ge307XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3NzUHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zW2Nzc1ByZWZpeGVzW2ldICsgXCJ0cmFuc2l0aW9uXCJdID0gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJGVsZW1lbnQuY3NzKHRyYW5zaXRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYXRoLmFicyDjgojjgorjgoLpq5jpgJ/jgaogYWJzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IGFicyA9ICh4OiBudW1iZXIpOiBudW1iZXIgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4geCA+PSAwID8geCA6IC14O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1hdGgubWF4IOOCiOOCiuOCgumrmOmAn+OBqiBtYXhcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgY29uc3QgbWF4ID0gKGxoczogbnVtYmVyLCByaHM6IG51bWJlcik6IG51bWJlciA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBsaHMgPj0gcmhzID8gbGhzIDogcmhzO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlN0YXR1c01hbmFnZXJdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFN0YXR1c01hbmFnZXJcclxuICAgICAqIEBicmllZiBVSSDnlKjnirbmhYvnrqHnkIbjgq/jg6njgrlcclxuICAgICAqICAgICAgICBTdGF0dXNNYW5hZ2VyIOOBruOCpOODs+OCueOCv+ODs+OCueOBlOOBqOOBq+S7u+aEj+OBrueKtuaFi+euoeeQhuOBjOOBp+OBjeOCi1xyXG4gICAgICpcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFN0YXR1c01hbmFnZXIgaW1wbGVtZW50cyBJU3RhdHVzTWFuYWdlciB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3N0YXR1czogYW55ID0ge307ICAgIC8vITwgc3RhdHVzU2NvcGUoKSDjgavkvb/nlKjjgZXjgozjgovnirbmhYvnrqHnkIbjgqrjg5bjgrjjgqfjgq/jg4hcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJU3RhdHVzTWFuYWdlclxyXG5cclxuICAgICAgICAvLyEg54q25oWL5aSJ5pWw44Gu5Y+C54Wn44Kr44Km44Oz44OI44Gu44Kk44Oz44Kv44Oq44Oh44Oz44OIXHJcbiAgICAgICAgcHVibGljIHN0YXR1c0FkZFJlZihzdGF0dXM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fc3RhdHVzW3N0YXR1c10pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c1tzdGF0dXNdID0gMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c1tzdGF0dXNdKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1c1tzdGF0dXNdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruODh+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgIHB1YmxpYyBzdGF0dXNSZWxlYXNlKHN0YXR1czogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgbGV0IHJldHZhbDogbnVtYmVyO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3N0YXR1c1tzdGF0dXNdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR2YWwgPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzW3N0YXR1c10tLTtcclxuICAgICAgICAgICAgICAgIHJldHZhbCA9IHRoaXMuX3N0YXR1c1tzdGF0dXNdO1xyXG4gICAgICAgICAgICAgICAgaWYgKDAgPT09IHJldHZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9zdGF0dXNbc3RhdHVzXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmV0dmFsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWHpueQhuOCueOCs+ODvOODl+avjuOBq+eKtuaFi+WkieaVsOOCkuioreWumlxyXG4gICAgICAgIHB1YmxpYyBzdGF0dXNTY29wZShzdGF0dXM6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQgfCBQcm9taXNlPGFueT4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0dXNBZGRSZWYoc3RhdHVzKTtcclxuICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIGlmICghcHJvbWlzZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNSZWxlYXNlKHN0YXR1cyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c1JlbGVhc2Uoc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNSZWxlYXNlKHN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBl+OBn+eKtuaFi+S4reOBp+OBguOCi+OBi+eiuuiqjVxyXG4gICAgICAgIHB1YmxpYyBpc1N0YXR1c0luKHN0YXR1czogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhIXRoaXMuX3N0YXR1c1tzdGF0dXNdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgX0NvbmZpZyA9IENEUC5VSS5MaXN0Vmlld0dsb2JhbENvbmZpZztcclxuICAgIGltcG9ydCBfVG9vbENTUyA9IENEUC5VSS5fTGlzdFZpZXdVdGlscztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuTGluZVByb2ZpbGVdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIExpbmVQcm9maWxlXHJcbiAgICAgKiBAYnJpZWYgMSDjg6njgqTjg7PjgavplqLjgZnjgovjg5fjg63jg5XjgqHjgqTjg6vjgq/jg6njgrlcclxuICAgICAqICAgICAgICBmcmFtZXdvcmsg44GM5L2/55So44GZ44KLXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBMaW5lUHJvZmlsZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBfaW5kZXg6IG51bWJlciA9IG51bGw7ICAgICAgICAgICAgICAvLyE8IGdsb2JhbCBpbmRleFxyXG4gICAgICAgIHByaXZhdGUgX3BhZ2VJbmRleDogbnVtYmVyID0gbnVsbDsgICAgICAgICAgLy8hPCDmiYDlsZ7jgZnjgosgcGFnZSBpbmRleFxyXG4gICAgICAgIHByaXZhdGUgX29mZnNldDogbnVtYmVyID0gbnVsbDsgICAgICAgICAgICAgLy8hPCBnbG9iYWwgb2Zmc2V0XHJcbiAgICAgICAgcHJpdmF0ZSBfJGJhc2U6IEpRdWVyeSA9IG51bGw7ICAgICAgICAgICAgICAvLyE8IOWcn+WPsOOBqOOBquOCiyBET00g44Kk44Oz44K544K/44Oz44K544KS5qC857SNXHJcbiAgICAgICAgcHJpdmF0ZSBfaW5zdGFuY2U6IEJhc2VMaXN0SXRlbVZpZXcgPSBudWxsOyAvLyE8IExpc3RJdGVtVmlldyDjgqTjg7Pjgrnjgr/jg7PjgrnjgpLmoLzntI1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBfb3duZXIgICAgICAge0lMaXN0Vmlld0ZyYW1ld29ya30gW2luXSDnrqHnkIbogIXjgafjgYLjgosgSUxpc3RWaWV3RnJhbWV3b3JrIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqIEBwYXJhbSBfaGVpZ2h0ICAgICAge051bWJlcn0gICAgICAgICAgICAgW2luXSDliJ3mnJ/jga7pq5jjgZVcclxuICAgICAgICAgKiBAcGFyYW0gX2luaXRpYWxpemVyIHtGdW5jdGlvbn0gICAgICAgICAgIFtpbl0gTGlzdEl0ZW1WaWV3IOa0vueUn+OCr+ODqeOCueOBruOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gICAgICAgICAqIEBwYXJhbSBfaW5mbyAgICAgICAge09iamVjdH0gICAgICAgICAgICAgW2luXSBMaXN0SXRlbVZpZXcg44Kz44Oz44K544OI44Op44Kv44K/44Gr5rih44GV44KM44KL44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgICAgIHByaXZhdGUgX293bmVyOiBJTGlzdFZpZXdGcmFtZXdvcmssXHJcbiAgICAgICAgICAgIHByaXZhdGUgX2hlaWdodDogbnVtYmVyLFxyXG4gICAgICAgICAgICBwcml2YXRlIF9pbml0aWFsaXplcjogbmV3IChvcHRpb25zPzogYW55KSA9PiBCYXNlTGlzdEl0ZW1WaWV3LFxyXG4gICAgICAgICAgICBwcml2YXRlIF9pbmZvOiBhbnkpIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8hIOacieWKueWMllxyXG4gICAgICAgIHB1YmxpYyBhY3RpdmF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gdGhpcy5faW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIGxldCBvcHRpb25zO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGJhc2UgPSB0aGlzLnByZXBhcmVCYXNlRWxlbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWw6IHRoaXMuXyRiYXNlLFxyXG4gICAgICAgICAgICAgICAgICAgIG93bmVyOiB0aGlzLl9vd25lcixcclxuICAgICAgICAgICAgICAgICAgICBsaW5lUHJvZmlsZTogdGhpcyxcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuX2luZm8pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgdGhpcy5faW5pdGlhbGl6ZXIob3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoXCJub25lXCIgPT09IHRoaXMuXyRiYXNlLmNzcyhcImRpc3BsYXlcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kYmFzZS5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlSW5kZXgodGhpcy5fJGJhc2UpO1xyXG4gICAgICAgICAgICBpZiAoXCJ2aXNpYmxlXCIgIT09IHRoaXMuXyRiYXNlLmNzcyhcInZpc2liaWxpdHlcIikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRiYXNlLmNzcyhcInZpc2liaWxpdHlcIiwgXCJ2aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5LiN5Y+v6KaW5YyWXHJcbiAgICAgICAgcHVibGljIGhpZGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKFwiaGlkZGVuXCIgIT09IHRoaXMuXyRiYXNlLmNzcyhcInZpc2liaWxpdHlcIikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRiYXNlLmNzcyhcInZpc2liaWxpdHlcIiwgXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnhKHlirnljJZcclxuICAgICAgICBwdWJsaWMgaW5hY3RpdmF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5faW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIC8vIHhwZXJpYSBBWCBKZWxseSBCZWFuICg0LjEuMinjgavjgabjgIEgaGlkZGVuIGVsZW1lbnQg44Gu5YmK6Zmk44Gn44Oh44Oi44Oq44O844Oq44O844Kv44GZ44KL44Gf44KB5Y+v6KaW5YyW44GZ44KL44CCXHJcbiAgICAgICAgICAgICAgICBpZiAoXCJ2aXNpYmxlXCIgIT09IHRoaXMuXyRiYXNlLmNzcyhcInZpc2liaWxpdHlcIikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kYmFzZS5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwidmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGJhc2UuYWRkQ2xhc3MoX0NvbmZpZy5SRUNZQ0xFX0NMQVNTKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRiYXNlLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGJhc2UgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5pu05pawXHJcbiAgICAgICAgcHVibGljIHJlZnJlc2goKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnN0YW5jZS5yZW5kZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOacieWKueeEoeWKueWIpOWumlxyXG4gICAgICAgIHB1YmxpYyBpc0FjdGl2ZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGwgIT0gdGhpcy5faW5zdGFuY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg6auY44GV5oOF5aCx44Gu5pu05pawLiBMaXN0SXRlbVZpZXcg44GL44KJ44Kz44O844Or44GV44KM44KL44CCXHJcbiAgICAgICAgcHVibGljIHVwZGF0ZUhlaWdodChuZXdIZWlnaHQ6IG51bWJlciwgb3B0aW9ucz86IFVwZGF0ZUhlaWdodE9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBuZXdIZWlnaHQgLSB0aGlzLl9oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodCA9IG5ld0hlaWdodDtcclxuICAgICAgICAgICAgdGhpcy5fb3duZXIudXBkYXRlU2Nyb2xsTWFwSGVpZ2h0KGRlbHRhKTtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gb3B0aW9ucyAmJiBvcHRpb25zLnJlZmxlY3RBbGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLnVwZGF0ZVByb2ZpbGVzKHRoaXMuX2luZGV4KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHotaW5kZXgg44Gu44Oq44K744OD44OILiBTY3JvbGxNYW5hZ2VyLnJlbW92ZUl0ZW0oKSDjgYvjgonjgrPjg7zjg6vjgZXjgozjgovjgIJcclxuICAgICAgICBwdWJsaWMgcmVzZXREZXB0aCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5faW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRiYXNlLmNzcyhcInotaW5kZXhcIiwgdGhpcy5fb3duZXIuZ2V0TGlzdFZpZXdPcHRpb25zKCkuYmFzZURlcHRoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBnZXR0ZXIvc2V0dGVyIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8hIGdldHRlcjog44Op44Kk44Oz44Gu6auY44GVXHJcbiAgICAgICAgcHVibGljIGdldCBoZWlnaHQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBnZXR0ZXI6IGdsb2JhbCBpbmRleFxyXG4gICAgICAgIHB1YmxpYyBnZXQgaW5kZXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHNldHRlcjogZ2xvYmFsIGluZGV4XHJcbiAgICAgICAgcHVibGljIHNldCBpbmRleChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuXyRiYXNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUluZGV4KHRoaXMuXyRiYXNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGdldHRlcjog5omA5bGe44Oa44O844K4IGluZGV4XHJcbiAgICAgICAgcHVibGljIGdldCBwYWdlSW5kZXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2VJbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBzZXR0ZXI6IOaJgOWxnuODmuODvOOCuCBpbmRleFxyXG4gICAgICAgIHB1YmxpYyBzZXQgcGFnZUluZGV4KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFnZUluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuXyRiYXNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VJbmRleCh0aGlzLl8kYmFzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBnZXR0ZXI6IGxpbmUgb2Zmc2V0XHJcbiAgICAgICAgcHVibGljIGdldCBvZmZzZXQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBzZXR0ZXI6IGxpbmUgb2Zmc2V0XHJcbiAgICAgICAgcHVibGljIHNldCBvZmZzZXQob2Zmc2V0OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gb2Zmc2V0O1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl8kYmFzZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVPZmZzZXQodGhpcy5fJGJhc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgZ2V0dGVyOiBpbmZvXHJcbiAgICAgICAgcHVibGljIGdldCBpbmZvKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbmZvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8hIEJhc2UgalF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiOOBrueUn+aIkFxyXG4gICAgICAgIHByaXZhdGUgcHJlcGFyZUJhc2VFbGVtZW50KCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIGxldCAkYmFzZTogSlF1ZXJ5O1xyXG4gICAgICAgICAgICBjb25zdCAkbWFwID0gdGhpcy5fb3duZXIuZ2V0U2Nyb2xsTWFwRWxlbWVudCgpO1xyXG4gICAgICAgICAgICBjb25zdCAkcmVjeWNsZSA9IHRoaXMuX293bmVyLmZpbmRSZWN5Y2xlRWxlbWVudHMoKS5maXJzdCgpO1xyXG4gICAgICAgICAgICBjb25zdCBpdGVtVGFnTmFtZSA9IHRoaXMuX293bmVyLmdldExpc3RWaWV3T3B0aW9ucygpLml0ZW1UYWdOYW1lO1xyXG5cclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fJGJhc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInRoaXMuXyRiYXNlIGlzIG5vdCBudWxsLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl8kYmFzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKDAgPCAkcmVjeWNsZS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICRiYXNlID0gJHJlY3ljbGU7XHJcbiAgICAgICAgICAgICAgICAkYmFzZS5yZW1vdmVBdHRyKFwiei1pbmRleFwiKTtcclxuICAgICAgICAgICAgICAgICRiYXNlLnJlbW92ZUNsYXNzKF9Db25maWcuUkVDWUNMRV9DTEFTUyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkYmFzZSA9ICQoXCI8XCIgKyBpdGVtVGFnTmFtZSArIFwiIGNsYXNzPSdcIiArIF9Db25maWcuTElTVElURU1fQkFTRV9DTEFTUyArIFwiJz48L1wiICsgaXRlbVRhZ05hbWUgKyBcIj5cIik7XHJcbiAgICAgICAgICAgICAgICAkYmFzZS5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcclxuICAgICAgICAgICAgICAgICRtYXAuYXBwZW5kKCRiYXNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g6auY44GV44Gu5pu05pawXHJcbiAgICAgICAgICAgIGlmICgkYmFzZS5oZWlnaHQoKSAhPT0gdGhpcy5faGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAkYmFzZS5oZWlnaHQodGhpcy5faGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gaW5kZXgg44Gu6Kit5a6aXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSW5kZXgoJGJhc2UpO1xyXG4gICAgICAgICAgICAvLyBvZmZzZXQg44Gu5pu05pawXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlT2Zmc2V0KCRiYXNlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkYmFzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBnbG9iYWwgaW5kZXgg44Gu5pu05pawXHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVJbmRleCgkYmFzZTogSlF1ZXJ5KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICgkYmFzZS5hdHRyKF9Db25maWcuREFUQV9DT05UQUlORVJfSU5ERVgpICE9PSB0aGlzLl9pbmRleC50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICAgICAgICAkYmFzZS5hdHRyKF9Db25maWcuREFUQV9DT05UQUlORVJfSU5ERVgsIHRoaXMuX2luZGV4LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgcGFnZSBpbmRleCDjga7mm7TmlrBcclxuICAgICAgICBwcml2YXRlIHVwZGF0ZVBhZ2VJbmRleCgkYmFzZTogSlF1ZXJ5KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICgkYmFzZS5hdHRyKF9Db25maWcuREFUQV9QQUdFX0lOREVYKSAhPT0gdGhpcy5fcGFnZUluZGV4LnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgICAgICRiYXNlLmF0dHIoX0NvbmZpZy5EQVRBX1BBR0VfSU5ERVgsIHRoaXMuX3BhZ2VJbmRleC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIG9mZnNldCDjga7mm7TmlrBcclxuICAgICAgICBwcml2YXRlIHVwZGF0ZU9mZnNldCgkYmFzZTogSlF1ZXJ5KTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fb3duZXIuZ2V0TGlzdFZpZXdPcHRpb25zKCkuZW5hYmxlVHJhbnNmb3JtT2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoX1Rvb2xDU1MuZ2V0Q3NzTWF0cml4VmFsdWUoJGJhc2UsIFwidHJhbnNsYXRlWVwiKSAhPT0gdGhpcy5fb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfVG9vbENTUy5jc3NQcmVmaXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1bX1Rvb2xDU1MuY3NzUHJlZml4ZXNbaV0gKyBcInRyYW5zZm9ybVwiXSA9IFwidHJhbnNsYXRlM2QoMHB4LFwiICsgdGhpcy5fb2Zmc2V0ICsgXCJweCwwcHgpXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICRiYXNlLmNzcyh0cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhcnNlSW50KCRiYXNlLmNzcyhcInRvcFwiKSwgMTApICE9PSB0aGlzLl9vZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkYmFzZS5jc3MoXCJ0b3BcIiwgdGhpcy5fb2Zmc2V0ICsgXCJweFwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuUGFnZVByb2ZpbGVdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhZ2VQcm9maWxlXHJcbiAgICAgKiBAYnJpZWYgMSDjg5rjg7zjgrjjgavplqLjgZnjgovjg5fjg63jg5XjgqHjgqTjg6vjgq/jg6njgrlcclxuICAgICAqICAgICAgICBmcmFtZXdvcmsg44GM5L2/55So44GZ44KLXHJcbiAgICAgKiAgICAgICAg5pys44Kv44Op44K544Gn44Gv55u05o6lIERPTSDjgpLmk43kvZzjgZfjgabjga/jgYTjgZHjgarjgYRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2VQcm9maWxlIHtcclxuICAgICAgICBwcml2YXRlIF9pbmRleDogbnVtYmVyID0gMDsgICAgICAgICAgICAgLy8hPCBwYWdlIGluZGV4XHJcbiAgICAgICAgcHJpdmF0ZSBfb2Zmc2V0OiBudW1iZXIgPSAwOyAgICAgICAgICAgIC8vITwgcGFnZSDjga4gVG9wIOOBi+OCieOBruOCquODleOCu+ODg+ODiFxyXG4gICAgICAgIHByaXZhdGUgX2hlaWdodDogbnVtYmVyID0gMDsgICAgICAgICAgICAvLyE8IHBhZ2Ug44Gu6auY44GVXHJcbiAgICAgICAgcHJpdmF0ZSBfbGluZXM6IExpbmVQcm9maWxlW10gPSBbXTsgICAgIC8vITwgcGFnZSDlhoXjgafnrqHnkIbjgZXjgozjgosgTGluZVByb2ZpbGVcclxuICAgICAgICBwcml2YXRlIF9zdGF0dXM6IHN0cmluZyA9IFwiaW5hY3RpdmVcIjsgICAvLyE8IHBhZ2Ug44Gu54q25oWLIFsgaW5hY3RpdmUgfCBoaWRkZW4gfCBhY3RpdmUgXVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vISDmnInlirnljJZcclxuICAgICAgICBwdWJsaWMgYWN0aXZhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChcImFjdGl2ZVwiICE9PSB0aGlzLl9zdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzLmZvckVhY2goKGxpbmU6IExpbmVQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZS5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzID0gXCJhY3RpdmVcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnhKHlj6/oppbljJZcclxuICAgICAgICBwdWJsaWMgaGlkZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKFwiaGlkZGVuXCIgIT09IHRoaXMuX3N0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZXMuZm9yRWFjaCgobGluZTogTGluZVByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1cyA9IFwiaGlkZGVuXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg54Sh5Yq55YyWXHJcbiAgICAgICAgcHVibGljIGluYWN0aXZhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChcImluYWN0aXZlXCIgIT09IHRoaXMuX3N0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZXMuZm9yRWFjaCgobGluZTogTGluZVByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lLmluYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1cyA9IFwiaW5hY3RpdmVcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBMaW5lUHJvZmlsZSDjgpLoqK3lrppcclxuICAgICAgICBwdWJsaWMgcHVzaChsaW5lOiBMaW5lUHJvZmlsZSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9saW5lcy5wdXNoKGxpbmUpO1xyXG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQgKz0gbGluZS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg6YWN5LiL44GuIExpbmVQcm9maWxlIOOBmeOBueOBpuOBjOacieWKueOBp+OBquOBhOWgtOWQiOOAgVBhZ2Ug44K544OG44O844K/44K544KS54Sh5Yq544Gr44GZ44KLXHJcbiAgICAgICAgcHVibGljIG5vcm1hbGl6ZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgZW5hYmxlQWxsID0gXy5ldmVyeSh0aGlzLl9saW5lcywgKGxpbmU6IExpbmVQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGluZS5pc0FjdGl2ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgaWYgKCFlbmFibGVBbGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1cyA9IFwiaW5hY3RpdmVcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIExpbmVQcm9maWxlIOOCkuWPluW+l1xyXG4gICAgICAgIHB1YmxpYyBnZXRMaW5lUHJvZmlsZShpbmRleDogbnVtYmVyKTogTGluZVByb2ZpbGUge1xyXG4gICAgICAgICAgICBpZiAoMCA8PSBpbmRleCAmJiBpbmRleCA8IHRoaXMuX2xpbmVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpbmVzW2luZGV4XTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5pyA5Yid44GuIExpbmVQcm9maWxlIOOCkuWPluW+l1xyXG4gICAgICAgIHB1YmxpYyBnZXRMaW5lUHJvZmlsZUZpcnN0KCk6IExpbmVQcm9maWxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TGluZVByb2ZpbGUoMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5pyA5b6M44GuIExpbmVQcm9maWxlIOOCkuWPluW+l1xyXG4gICAgICAgIHB1YmxpYyBnZXRMaW5lUHJvZmlsZUxhc3QoKTogTGluZVByb2ZpbGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRMaW5lUHJvZmlsZSh0aGlzLl9saW5lcy5sZW5ndGggLSAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gZ2V0dGVyL3NldHRlciBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vISBnZXR0ZXI6IHBhZ2UgaW5kZXhcclxuICAgICAgICBwdWJsaWMgZ2V0IGluZGV4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBzZXR0ZXI6IHBhZ2UgaW5kZXhcclxuICAgICAgICBwdWJsaWMgc2V0IGluZGV4KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5kZXggPSBpbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBnZXR0ZXI6IHBhZ2Ugb2Zmc2V0XHJcbiAgICAgICAgcHVibGljIGdldCBvZmZzZXQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX29mZnNldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBzZXR0ZXI6IHBhZ2Ugb2Zmc2V0XHJcbiAgICAgICAgcHVibGljIHNldCBvZmZzZXQob2Zmc2V0OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fb2Zmc2V0ID0gb2Zmc2V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGdldHRlcjog5a6f6Zqb44Gr44Oa44O844K444Gr5Ymy44KK5b2T44Gm44KJ44KM44Gm44GE44KL6auY44GVXHJcbiAgICAgICAgcHVibGljIGdldCBoZWlnaHQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBnZXR0ZXI6IOeKtuaFi+WPluW+l1xyXG4gICAgICAgIHB1YmxpYyBnZXQgc3RhdHVzKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5Hcm91cFByb2ZpbGVdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIEdyb3VwUHJvZmlsZVxyXG4gICAgICogQGJyaWVmIOODqeOCpOODs+OCkuOCsOODq+ODvOODl+euoeeQhuOBmeOCi+ODl+ODreODleOCoeOCpOODq+OCr+ODqeOCuVxyXG4gICAgICogICAgICAgIOacrOOCr+ODqeOCueOBp+OBr+ebtOaOpSBET00g44KS5pON5L2c44GX44Gm44Gv44GE44GR44Gq44GEXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgIHByaXZhdGUgX3BhcmVudDogR3JvdXBQcm9maWxlID0gbnVsbDsgICAgICAgLy8hPCDopqogR3JvdXBQcm9maWxlIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgIHByaXZhdGUgX2NoaWxkcmVuOiBHcm91cFByb2ZpbGVbXSA9IFtdOyAgICAgLy8hPCDlrZAgR3JvdXBQcm9maWxlIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgIHByaXZhdGUgX2V4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7ICAgICAgICAgLy8hPCDplovplonmg4XloLFcclxuICAgICAgICBwcml2YXRlIF9zdGF0dXM6IHN0cmluZyA9IFwidW5yZWdpc3RlcmVkXCI7ICAgLy8hPCBfb3duZXIg44G444Gu55m76Yyy54q25oWLIFsgdW5yZWdpc3RlcmVkIHwgcmVnaXN0ZXJlZCBdXHJcbiAgICAgICAgcHJpdmF0ZSBfbWFwTGluZXMgPSB7fTsgICAgICAgICAgICAgICAgICAgICAvLyE8IOiHqui6q+OBjOeuoei9hOOBmeOCiyBMaW5lUHJvZmlsZSDjgpIga2V5IOOBqOOBqOOCguOBq+agvOe0jVxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIExBWU9VVF9LRVlfREVGQVVMVCA9IFwiLWxheW91dC1kZWZhdWx0XCI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gX2lkICAgIHtTdHJpbmd9ICAgICAgICAgICAgIFtpbl0gR3JvdXBQcm9maWxlIOOBriBJRFxyXG4gICAgICAgICAqIEBwYXJhbSBfb3duZXIge0V4cGFuZGFibGVMaXN0Vmlld30gW2luXSDnrqHnkIbogIXjgafjgYLjgosgRXhwYW5kYWJsZUxpc3RWaWV3IOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2lkOiBzdHJpbmcsIHByaXZhdGUgX293bmVyOiBCYXNlRXhwYW5kYWJsZUxpc3RWaWV3KSB7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5pysIEdyb3VwUHJvZmlsZSDjgYznrqHnkIbjgZnjgosgTGlzdCDjgpLkvZzmiJDjgZfjgabnmbvpjLJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBoZWlnaHQgICAgICB7TnVtYmVyfSAgIFtpbl0g44Op44Kk44Oz44Gu6auY44GVXHJcbiAgICAgICAgICogQHBhcmFtIGluaXRpYWxpemVyIHtGdW5jdGlvbn0gW2luXSBMaXN0SXRlbVZpZXcg5rS+55Sf44Kv44Op44K544Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgICAgICogQHBhcmFtIGluZm8gICAgICAgIHtPYmplY3R9ICAgW2luXSBpbml0aWFsaXplciDjgavmuKHjgZXjgozjgovjgqrjg5fjgrfjg6fjg7PlvJXmlbBcclxuICAgICAgICAgKiBAcGFyYW0gbGF5b3V0S2V5ICAge1N0cmluZ30gICBbaW5dIGxheW91dCDmr47jgavkvb/nlKjjgZnjgovorZjliKXlrZAgKOOCquODl+OCt+ODp+ODiuODqylcclxuICAgICAgICAgKiBAcmV0dXJuIHtHcm91cFByb2ZpbGV9IOacrOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBhZGRJdGVtKFxyXG4gICAgICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICAgICAgaW5pdGlhbGl6ZXI6IG5ldyAob3B0aW9ucz86IGFueSkgPT4gQmFzZUxpc3RJdGVtVmlldyxcclxuICAgICAgICAgICAgaW5mbzogYW55LFxyXG4gICAgICAgICAgICBsYXlvdXRLZXk/OiBzdHJpbmdcclxuICAgICAgICApOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICBsZXQgbGluZTogTGluZVByb2ZpbGU7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgeyBncm91cFByb2ZpbGU6IHRoaXMgfSwgaW5mbyk7XHJcblxyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBsYXlvdXRLZXkpIHtcclxuICAgICAgICAgICAgICAgIGxheW91dEtleSA9IEdyb3VwUHJvZmlsZS5MQVlPVVRfS0VZX0RFRkFVTFQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gdGhpcy5fbWFwTGluZXNbbGF5b3V0S2V5XSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwTGluZXNbbGF5b3V0S2V5XSA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsaW5lID0gbmV3IExpbmVQcm9maWxlKHRoaXMuX293bmVyLmNvcmUsIE1hdGguZmxvb3IoaGVpZ2h0KSwgaW5pdGlhbGl6ZXIsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8gX293bmVyIOOBrueuoeeQhuS4i+OBq+OBguOCi+OBqOOBjeOBr+mAn+OChOOBi+OBq+i/veWKoFxyXG4gICAgICAgICAgICBpZiAoKFwicmVnaXN0ZXJlZFwiID09PSB0aGlzLl9zdGF0dXMpICYmXHJcbiAgICAgICAgICAgICAgICAobnVsbCA9PSB0aGlzLl9vd25lci5sYXlvdXRLZXkgfHwgbGF5b3V0S2V5ID09PSB0aGlzLl9vd25lci5sYXlvdXRLZXkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vd25lci5fYWRkTGluZShsaW5lLCB0aGlzLmdldExhc3RMaW5lSW5kZXgoKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3duZXIudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbWFwTGluZXNbbGF5b3V0S2V5XS5wdXNoKGxpbmUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWtkCBHcm91cCDjgpLov73liqBcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQge0dyb3VwUHJvZmlsZXxHcm91cFByb2ZpbGVbXX0gW2luXSBHcm91cFByb2ZpbGUg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICogQHJldHVybiB7R3JvdXBQcm9maWxlfSDmnKzjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGRyZW4odGFyZ2V0OiBHcm91cFByb2ZpbGUpOiBHcm91cFByb2ZpbGU7XHJcbiAgICAgICAgcHVibGljIGFkZENoaWxkcmVuKHRhcmdldDogR3JvdXBQcm9maWxlW10pOiBHcm91cFByb2ZpbGU7XHJcbiAgICAgICAgcHVibGljIGFkZENoaWxkcmVuKHRhcmdldDogYW55KTogR3JvdXBQcm9maWxlIHtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW46IEdyb3VwUHJvZmlsZVtdID0gKHRhcmdldCBpbnN0YW5jZW9mIEFycmF5KSA/IHRhcmdldCA6IFt0YXJnZXRdO1xyXG4gICAgICAgICAgICBjaGlsZHJlbi5mb3JFYWNoKChjaGlsZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hpbGQuc2V0UGFyZW50KHRoaXMpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSB0aGlzLl9jaGlsZHJlbi5jb25jYXQoY2hpbGRyZW4pO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOimqiBHcm91cFByb2ZpbGUg44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtHcm91cFByb2ZpbGV9IEdyb3VwUHJvZmlsZSDopqog44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGdldFBhcmVudCgpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5a2QIEdyb3VwUHJvZmlsZSDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0dyb3VwUHJvZmlsZVtdfSBHcm91cFByb2ZpbGUg5a2QIOOCpOODs+OCueOCv+ODs+OCuemFjeWIl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbigpOiBHcm91cFByb2ZpbGVbXSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWtkCBHcm91cCDjgpLmjIHjgaPjgabjgYTjgovjgYvliKTlrppcclxuICAgICAgICAgKiBsYXlvdXRLZXkg44GM5oyH5a6a44GV44KM44KM44Gw44CBbGF5b3V0IOOBrueKtuaFi+OBvuOBp+WIpOWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGxheW91dEtleSB7U3RyaW5nfSBbaW5dIGxheW91dCDmr47jgavkvb/nlKjjgZnjgovorZjliKXlrZAgKOOCquODl+OCt+ODp+ODiuODqylcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDmnIksIGZhbHNlOiDnhKFcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgaGFzQ2hpbGRyZW4obGF5b3V0S2V5Pzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jaGlsZHJlbi5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG51bGwgIT0gbGF5b3V0S2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW5bMF0uaGFzTGF5b3V0S2V5T2YobGF5b3V0S2V5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBsYXlvdXQg44Gu54q25oWL44KS5Yik5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gbGF5b3V0S2V5IHtTdHJpbmd9IFtpbl0gbGF5b3V0IOavjuOBq+S9v+eUqOOBmeOCi+itmOWIpeWtkFxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaciSwgZmFsc2U6IOeEoVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBoYXNMYXlvdXRLZXlPZihsYXlvdXRLZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBsYXlvdXRLZXkpIHtcclxuICAgICAgICAgICAgICAgIGxheW91dEtleSA9IEdyb3VwUHJvZmlsZS5MQVlPVVRfS0VZX0RFRkFVTFQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIChudWxsICE9IHRoaXMuX21hcExpbmVzW2xheW91dEtleV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kw44Or44O844OX5bGV6ZaLXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGV4cGFuZCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGxpbmVzOiBMaW5lUHJvZmlsZVtdID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9saW5lcy5sZW5ndGggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ0aGlzIGdyb3VwIGhhcyBubyBsaW5lcy5cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaGFzQ2hpbGRyZW4oKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidGhpcyBncm91cCBoYXMgbm8gY2hpbGRyZW4uXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmlzRXhwYW5kZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgbGluZXMgPSB0aGlzLnF1ZXJ5T3BlcmF0aW9uVGFyZ2V0KFwicmVnaXN0ZXJlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2V4cGFuZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmICgwIDwgbGluZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3duZXIuc3RhdHVzU2NvcGUoXCJleHBhbmRpbmdcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDoh6rouqvjgpLmm7TmlrBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGluZXMuZm9yRWFjaCgobGluZTogTGluZVByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6YWN5LiL44KS5pu05pawXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLl9hZGRMaW5lKGxpbmVzLCB0aGlzLmdldExhc3RMaW5lSW5kZXgoKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vd25lci51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kw44Or44O844OX5Y+O5p2fXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGVsYXkge051bWJlcn0gW2luXSDopoHntKDliYrpmaTjgavosrvjgoTjgZnpgYXlu7bmmYLplpMuIOaXouWumjogYW5pbWF0aW9uRHVyYXRpb24g5YCkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGNvbGxhcHNlKGRlbGF5PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBsaW5lczogTGluZVByb2ZpbGVbXSA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFzQ2hpbGRyZW4oKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidGhpcyBncm91cCBoYXMgbm8gY2hpbGRyZW4uXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNFeHBhbmRlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICBsaW5lcyA9IHRoaXMucXVlcnlPcGVyYXRpb25UYXJnZXQoXCJ1bnJlZ2lzdGVyZWRcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9leHBhbmRlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgaWYgKDAgPCBsaW5lcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxheSA9IChudWxsICE9IGRlbGF5KSA/IGRlbGF5IDogdGhpcy5fb3duZXIuY29yZS5nZXRMaXN0Vmlld09wdGlvbnMoKS5hbmltYXRpb25EdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vd25lci5zdGF0dXNTY29wZShcImNvbGxhcHNpbmdcIiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDoh6rouqvjgpLmm7TmlrBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGluZXMuZm9yRWFjaCgobGluZTogTGluZVByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6YWN5LiL44KS5pu05pawXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLnJlbW92ZUl0ZW0obGluZXNbMF0uaW5kZXgsIGxpbmVzLmxlbmd0aCwgZGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vd25lci51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6Ieq6Lqr44KS44Oq44K544OI44Gu5Y+v6KaW6aCY5Z+f44Gr6KGo56S6XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7RW5zdXJlVmlzaWJsZU9wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZW5zdXJlVmlzaWJsZShvcHRpb25zPzogRW5zdXJlVmlzaWJsZU9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKDAgPCB0aGlzLl9saW5lcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLmVuc3VyZVZpc2libGUodGhpcy5fbGluZXNbMF0uaW5kZXgsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG51bGwgIT0gb3B0aW9ucy5jYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgb3B0aW9ucy5jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDplovplonjga7jg4jjgrDjg6tcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkZWxheSB7TnVtYmVyfSBbaW5dIGNvbGxhcHNlIOOBruimgee0oOWJiumZpOOBq+iyu+OChOOBmemBheW7tuaZgumWky4g5pei5a6aOiBhbmltYXRpb25EdXJhdGlvbiDlgKRcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgdG9nZ2xlKGRlbGF5PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9leHBhbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xsYXBzZShkZWxheSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmV4cGFuZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlsZXplovnirbmhYvjgpLliKTlrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOWxlemWiywgZmFsc2U65Y+O5p2fXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGlzRXhwYW5kZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRlZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGxpc3QgdmlldyDjgbjnmbvpjLJcclxuICAgICAgICAgKiBUb3AgR3JvdXAg44Gu44G/55m76Yyy5Y+v6IO9XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gaW5zZXJ0VG8ge051bWJlcn0g5oy/5YWl5L2N572u44KSIGluZGV4IOOBp+aMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm4ge0dyb3VwUHJvZmlsZX0g5pys44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHJlZ2lzdGVyKGluc2VydFRvOiBudW1iZXIpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwibG9naWMgZXJyb3I6ICdyZWdpc3RlcicgbWV0aG9kIGlzIGFjY2VwdGFibGUgb25seSB0b3AgZ3JvdXAuXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3duZXIuX2FkZExpbmUodGhpcy5wcmVwcm9jZXNzKFwicmVnaXN0ZXJlZFwiKSwgaW5zZXJ0VG8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogbGlzdCB2aWV3IOOBuOW+qeWFg1xyXG4gICAgICAgICAqIFRvcCBHcm91cCDjga7jgb/nmbvpjLLlj6/og71cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0dyb3VwUHJvZmlsZX0g5pys44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHJlc3RvcmUoKTogR3JvdXBQcm9maWxlIHtcclxuICAgICAgICAgICAgbGV0IGxpbmVzOiBMaW5lUHJvZmlsZVtdID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJsb2dpYyBlcnJvcjogJ3Jlc3RvcmUnIG1ldGhvZCBpcyBhY2NlcHRhYmxlIG9ubHkgdG9wIGdyb3VwLlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9saW5lcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZXMgPSB0aGlzLl9saW5lcy5jb25jYXQodGhpcy5xdWVyeU9wZXJhdGlvblRhcmdldChcImFjdGl2ZVwiKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzID0gdGhpcy5fbGluZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vd25lci5fYWRkTGluZShsaW5lcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDphY3kuIvjga7mnIDlvozjga4gbGluZSBpbmRleCDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB3aXRoQWN0aXZlQ2hpbGRyZW4ge0Jvb2xlYW59IFtpbl0g55m76Yyy5riI44G/44Gu5a2QIEdyb3VwUHJvZmlsZSDjgpLlkKvjgoHjgabmpJzntKLjgZnjgovloLTlkIjjga8gdHJ1ZSDjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGluZGV4LiDjgqjjg6njg7zjga7loLTlkIjjga8gbnVsbC5cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgZ2V0TGFzdExpbmVJbmRleCh3aXRoQWN0aXZlQ2hpbGRyZW46IGJvb2xlYW4gPSBmYWxzZSk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzOiBMaW5lUHJvZmlsZVtdID0gKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBfbGluZXM6IExpbmVQcm9maWxlW107XHJcbiAgICAgICAgICAgICAgICBpZiAod2l0aEFjdGl2ZUNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2xpbmVzID0gdGhpcy5xdWVyeU9wZXJhdGlvblRhcmdldChcImFjdGl2ZVwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChudWxsID09IGxpbmVzIHx8IGxpbmVzLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2xpbmVzID0gdGhpcy5fbGluZXM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2xpbmVzO1xyXG4gICAgICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGxpbmVzLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwibG9naWMgZXJyb3I6IHRoaXMgZ3JvdXAgaXMgc3RpbCBub3QgcmVnaXN0ZXJlZC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsaW5lc1tsaW5lcy5sZW5ndGggLSAxXS5pbmRleDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSUQg44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IOWJsuOCiuaMr+OCieOCjOOBnyBJRFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldCBpZCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrnjg4bjg7zjgr/jgrnjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30g44K544OG44O844K/44K55paH5a2X5YiXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0IHN0YXR1cygpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZFxyXG5cclxuICAgICAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6KaqIEdyb3VwIOaMh+WumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHBhcmVudCB7R3JvdXBQcm9maWxlfSBbaW5dIOimqiBHcm91cFByb2ZpbGUg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRQYXJlbnQocGFyZW50OiBHcm91cFByb2ZpbGUpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyogdHNsaW50OmVuYWJsZTpuby11bnVzZWQtdmFyaWFibGUgKi9cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcmVnaXN0ZXIgLyB1bnJlZ2lzdGVyIOOBruWJjeWHpueQhlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG5ld1N0YXR1cyB7U3RyaW5nfSBbaW5dIOaWsOOCueODhuODvOOCv+OCueaWh+Wtl+WIl1xyXG4gICAgICAgICAqIEByZXR1cm4ge0xpbmVQcm9maWxlW119IOabtOaWsOOBmeOBueOBjSBMaW5lUHJvZmlsZSDjga7phY3liJdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHByZXByb2Nlc3MobmV3U3RhdHVzOiBzdHJpbmcpOiBMaW5lUHJvZmlsZVtdIHtcclxuICAgICAgICAgICAgbGV0IGxpbmVzOiBMaW5lUHJvZmlsZVtdID0gW107XHJcbiAgICAgICAgICAgIGlmIChuZXdTdGF0dXMgIT09IHRoaXMuX3N0YXR1cyAmJiBudWxsICE9IHRoaXMuX2xpbmVzKSB7XHJcbiAgICAgICAgICAgICAgICBsaW5lcyA9IHRoaXMuX2xpbmVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1cyA9IG5ld1N0YXR1cztcclxuICAgICAgICAgICAgcmV0dXJuIGxpbmVzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5pON5L2c5a++6LGh44GuIExpbmVQcm9maWxlIOmFjeWIl+OCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG5ld1N0YXR1cyB7U3RyaW5nfSBbaW5dIOaWsOOCueODhuODvOOCv+OCueaWh+Wtl+WIl1xyXG4gICAgICAgICAqIEByZXR1cm4ge0xpbmVQcm9maWxlW119IOaTjeS9nOWvvuixoeOBriBMaW5lUHJvZmlsZSDjga7phY3liJdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHF1ZXJ5T3BlcmF0aW9uVGFyZ2V0KG9wZXJhdGlvbjogc3RyaW5nKTogTGluZVByb2ZpbGVbXSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZpbmRUYXJnZXRzID0gKGdyb3VwOiBHcm91cFByb2ZpbGUpOiBMaW5lUHJvZmlsZVtdID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBsaW5lczogTGluZVByb2ZpbGVbXSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAuX2NoaWxkcmVuLmZvckVhY2goKGNoaWxkOiBHcm91cFByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwicmVnaXN0ZXJlZFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMgPSBsaW5lcy5jb25jYXQoY2hpbGQucHJlcHJvY2VzcyhvcGVyYXRpb24pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwidW5yZWdpc3RlcmVkXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IGxpbmVzLmNvbmNhdChjaGlsZC5wcmVwcm9jZXNzKG9wZXJhdGlvbikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJhY3RpdmVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChudWxsICE9IGNoaWxkLl9saW5lcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzID0gbGluZXMuY29uY2F0KGNoaWxkLl9saW5lcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVua25vd24gb3BlcmF0aW9uOiBcIiArIG9wZXJhdGlvbik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZC5pc0V4cGFuZGVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMgPSBsaW5lcy5jb25jYXQoZmluZFRhcmdldHMoY2hpbGQpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsaW5lcztcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgcmV0dXJuIGZpbmRUYXJnZXRzKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6Ieq6Lqr44Gu566h55CG44GZ44KL44Ki44Kv44OG44Kj44OW44GqIExpbmVQcm9maWUg44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtMaW5lUHJvZmlsZVtdfSBMaW5lUHJvZmllIOmFjeWIl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgZ2V0IF9saW5lcygpOiBMaW5lUHJvZmlsZVtdIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5fb3duZXIubGF5b3V0S2V5O1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXBMaW5lc1trZXldO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcExpbmVzW0dyb3VwUHJvZmlsZS5MQVlPVVRfS0VZX0RFRkFVTFRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBfVXRpbHMgPSBDRFAuVUkuX0xpc3RWaWV3VXRpbHM7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlNjcm9sbGVyRWxlbWVudF0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgU2Nyb2xsZXJFbGVtZW50XHJcbiAgICAgKiBAYnJpZWYgSFRNTEVsZW1lbnQg44GuIFNjcm9sbGVyIOOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgU2Nyb2xsZXJFbGVtZW50IGltcGxlbWVudHMgSVNjcm9sbGVyIHtcclxuICAgICAgICBwcml2YXRlIF8kdGFyZ2V0OiBKUXVlcnkgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgXyRzY3JvbGxNYXA6IEpRdWVyeSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfbGlzdHZpZXdPcHRpb25zOiBMaXN0Vmlld09wdGlvbnMgPSBudWxsO1xyXG5cclxuICAgICAgICAvLyEgY29uc3RydWN0b3JcclxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBzdHJpbmcsIG9wdGlvbnM6IExpc3RWaWV3T3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoZWxlbWVudDogSFRNTEVsZW1lbnQsIG9wdGlvbnM6IExpc3RWaWV3T3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoZWxlbWVudDogYW55LCBvcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5fJHRhcmdldCA9ICQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3R2aWV3T3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgU2Nyb2xsZXIg44Gu5Z6L44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gU2Nyb2xsZXJFbGVtZW50LlRZUEU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgcG9zaXRpb24g5Y+W5b6XXHJcbiAgICAgICAgZ2V0UG9zKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kdGFyZ2V0LnNjcm9sbFRvcCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHBvc2l0aW9uIOOBruacgOWkp+WApOOCkuWPluW+l1xyXG4gICAgICAgIGdldFBvc01heCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl8kc2Nyb2xsTWFwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kc2Nyb2xsTWFwID0gdGhpcy5fJHRhcmdldC5jaGlsZHJlbigpLmZpcnN0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIF9VdGlscy5tYXgodGhpcy5fJHNjcm9sbE1hcC5oZWlnaHQoKSAtIHRoaXMuXyR0YXJnZXQuaGVpZ2h0KCksIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCpOODmeODs+ODiOeZu+mMslxyXG4gICAgICAgIG9uKHR5cGU6IHN0cmluZywgZnVuYzogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJHRhcmdldC5vbihcInNjcm9sbFwiLCBmdW5jKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxzdG9wXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJHRhcmdldC5vbihcInNjcm9sbHN0b3BcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVuc3VwcG9ydGVkIHR5cGU6IFwiICsgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgqTjg5njg7Pjg4jnmbvpjLLop6PpmaRcclxuICAgICAgICBvZmYodHlwZTogc3RyaW5nLCBmdW5jOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kdGFyZ2V0Lm9mZihcInNjcm9sbFwiLCBmdW5jKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxzdG9wXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJHRhcmdldC5vZmYoXCJzY3JvbGxzdG9wXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bnN1cHBvcnRlZCB0eXBlOiBcIiArIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5oyH5a6aXHJcbiAgICAgICAgc2Nyb2xsVG8ocG9zOiBudW1iZXIsIGFuaW1hdGU/OiBib29sZWFuLCB0aW1lPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fbGlzdHZpZXdPcHRpb25zLmVuYWJsZUFuaW1hdGlvbiB8fCAhYW5pbWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJHRhcmdldC5zY3JvbGxUb3AocG9zKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsID09IHRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lID0gdGhpcy5fbGlzdHZpZXdPcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fJHRhcmdldC5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IHBvc1xyXG4gICAgICAgICAgICAgICAgfSwgdGltZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGxlciDjga7nirbmhYvmm7TmlrBcclxuICAgICAgICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIC8vIG5vb3AuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgU2Nyb2xsZXIg44Gu56C05qOEXHJcbiAgICAgICAgZGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fJHNjcm9sbE1hcCA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl8kdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kdGFyZ2V0Lm9mZigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJHRhcmdldCA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgr/jgqTjg5flrprnvqlcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldCBUWVBFKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImVsZW1lbnQtb3ZlcmZsb3dcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBmYWN0b3J5IOWPluW+l1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0RmFjdG9yeSgpOiAoZWxlbWVudDogYW55LCBvcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpID0+IElTY3JvbGxlciB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZhY3RvcnkgPSAoZWxlbWVudDogYW55LCBvcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpOiBJU2Nyb2xsZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTY3JvbGxlckVsZW1lbnQoZWxlbWVudCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIHNldCB0eXBlIHNpZ25hdHVyZS5cclxuICAgICAgICAgICAgKDxhbnk+ZmFjdG9yeSkudHlwZSA9IFNjcm9sbGVyRWxlbWVudC5UWVBFO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IF9VdGlscyA9IENEUC5VSS5fTGlzdFZpZXdVdGlscztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuU2Nyb2xsZXJOYXRpdmVdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFNjcm9sbGVyTmF0aXZlXHJcbiAgICAgKiBAYnJpZWYgQnJvd3NlciBOYXRpdmUg44GuIFNjcm9sbGVyIOOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgU2Nyb2xsZXJOYXRpdmUgaW1wbGVtZW50cyBJU2Nyb2xsZXIge1xyXG4gICAgICAgIHByaXZhdGUgXyRib2R5OiBKUXVlcnkgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgXyR0YXJnZXQ6IEpRdWVyeSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfbGlzdHZpZXdPcHRpb25zOiBMaXN0Vmlld09wdGlvbnMgPSBudWxsO1xyXG5cclxuICAgICAgICAvLyEgY29uc3RydWN0b3JcclxuICAgICAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpIHtcclxuICAgICAgICAgICAgdGhpcy5fJHRhcmdldCA9ICQoZG9jdW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl8kYm9keSA9ICQoXCJib2R5XCIpO1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0dmlld09wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbGVyIOOBruWei+OCkuWPluW+l1xyXG4gICAgICAgIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFNjcm9sbGVyTmF0aXZlLlRZUEU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgcG9zaXRpb24g5Y+W5b6XXHJcbiAgICAgICAgZ2V0UG9zKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kdGFyZ2V0LnNjcm9sbFRvcCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHBvc2l0aW9uIOOBruacgOWkp+WApOOCkuWPluW+l1xyXG4gICAgICAgIGdldFBvc01heCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gX1V0aWxzLm1heCh0aGlzLl8kdGFyZ2V0LmhlaWdodCgpIC0gd2luZG93LmlubmVySGVpZ2h0LCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgqTjg5njg7Pjg4jnmbvpjLJcclxuICAgICAgICBvbih0eXBlOiBzdHJpbmcsIGZ1bmM6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjcm9sbFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQub24oXCJzY3JvbGxcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsc3RvcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vbihcInNjcm9sbHN0b3BcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVuc3VwcG9ydGVkIHR5cGU6IFwiICsgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgqTjg5njg7Pjg4jnmbvpjLLop6PpmaRcclxuICAgICAgICBvZmYodHlwZTogc3RyaW5nLCBmdW5jOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kdGFyZ2V0Lm9mZihcInNjcm9sbFwiLCBmdW5jKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxzdG9wXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgJCh3aW5kb3cpLm9mZihcInNjcm9sbHN0b3BcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVuc3VwcG9ydGVkIHR5cGU6IFwiICsgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9saXN0dmlld09wdGlvbnMuZW5hYmxlQW5pbWF0aW9uIHx8ICFhbmltYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kYm9keS5zY3JvbGxUb3AocG9zKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsID09IHRpbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aW1lID0gdGhpcy5fbGlzdHZpZXdPcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGJvZHkuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBwb3NcclxuICAgICAgICAgICAgICAgIH0sIHRpbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgU2Nyb2xsZXIg44Gu54q25oWL5pu05pawXHJcbiAgICAgICAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBub29wLlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbGVyIOOBruegtOajhFxyXG4gICAgICAgIGRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCv+OCpOODl+Wumue+qVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFRZUEUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibmF0aXZlLXNjcm9sbFwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGZhY3Rvcnkg5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRGYWN0b3J5KCk6IChlbGVtZW50OiBhbnksIG9wdGlvbnM6IExpc3RWaWV3T3B0aW9ucykgPT4gSVNjcm9sbGVyIHtcclxuICAgICAgICAgICAgY29uc3QgZmFjdG9yeSA9IChlbGVtZW50OiBhbnksIG9wdGlvbnM6IExpc3RWaWV3T3B0aW9ucyk6IElTY3JvbGxlciA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNjcm9sbGVyTmF0aXZlKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBzZXQgdHlwZSBzaWduYXR1cmUuXHJcbiAgICAgICAgICAgICg8YW55PmZhY3RvcnkpLnR5cGUgPSBTY3JvbGxlck5hdGl2ZS5UWVBFO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gZm9yIG5vbiBpc2Nyb2xsIHVzZXIuIGNkcC51aS5saXN0dmlldy5kLnRzIGludGVybmFsIGRlZmluaXRpb24uXHJcbmludGVyZmFjZSBJU2Nyb2xsT3B0aW9ucyB7XHJcbiAgICBbeDogc3RyaW5nXTogYW55O1xyXG4gICAgcHJvYmVUeXBlPzogbnVtYmVyOyAvLyBbY2FsbSA6MSA8IDIgPCAzOiBhZ2dyZXNzaXZlXVxyXG59XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgX0NvbmZpZyAgPSBDRFAuVUkuTGlzdFZpZXdHbG9iYWxDb25maWc7XHJcbiAgICBpbXBvcnQgX1V0aWxzICAgPSBDRFAuVUkuX0xpc3RWaWV3VXRpbHM7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlNjcm9sbGVySVNjcm9sbF0gXCI7XHJcblxyXG4gICAgaW50ZXJmYWNlIElTY3JvbGxFeCBleHRlbmRzIElTY3JvbGwge1xyXG4gICAgICAgIG9uOiAodHlwZTogc3RyaW5nLCBmbjogKGV2ZW50OiBhbnkpID0+IHZvaWQpID0+IHZvaWQ7XHJcbiAgICAgICAgb2ZmOiAodHlwZTogc3RyaW5nLCBmbjogKGV2ZW50OiBhbnkpID0+IHZvaWQpID0+IHZvaWQ7XHJcbiAgICAgICAgd3JhcHBlcjogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgc2Nyb2xsZXI6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIHNjcm9sbGVyV2lkdGg6IG51bWJlcjtcclxuICAgICAgICBzY3JvbGxlckhlaWdodDogbnVtYmVyO1xyXG4gICAgICAgIG1heFNjcm9sbFg6IG51bWJlcjtcclxuICAgICAgICBtYXhTY3JvbGxZOiBudW1iZXI7XHJcbiAgICAgICAgZ2V0Q29tcHV0ZWRQb3NpdGlvbigpOiBhbnk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgU2Nyb2xsZXJJU2Nyb2xsXHJcbiAgICAgKiBAYnJpZWYgaVNjcm9sbCDjgpLkvb/nlKjjgZfjgZ8gU2Nyb2xsZXIg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBTY3JvbGxlcklTY3JvbGwgaW1wbGVtZW50cyBJU2Nyb2xsZXIge1xyXG4gICAgICAgIHByaXZhdGUgXyRvd25lcjogSlF1ZXJ5ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF9pc2Nyb2xsOiBJU2Nyb2xsRXggPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX3JlZnJlc2hUaW1lcklkOiBudW1iZXIgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgXyR3cmFwcGVyOiBKUXVlcnkgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgXyRzY3JvbGxlcjogSlF1ZXJ5ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF9saXN0dmlld09wdGlvbnM6IExpc3RWaWV3T3B0aW9ucyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vISBjb25zdHJ1Y3RvclxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCRvd25lcjogSlF1ZXJ5LCBlbGVtZW50OiBzdHJpbmcsIGlzY3JvbGxPcHRpb25zOiBJU2Nyb2xsT3B0aW9ucywgbGlzdHZpZXdPcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCRvd25lcjogSlF1ZXJ5LCBlbGVtZW50OiBIVE1MRWxlbWVudCwgaXNjcm9sbE9wdGlvbnM6IElTY3JvbGxPcHRpb25zLCBsaXN0dmlld09wdGlvbnM6IExpc3RWaWV3T3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoJG93bmVyOiBKUXVlcnksIGVsZW1lbnQ6IGFueSwgaXNjcm9sbE9wdGlvbnM6IElTY3JvbGxPcHRpb25zLCBsaXN0dmlld09wdGlvbnM6IExpc3RWaWV3T3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBnbG9iYWwuSVNjcm9sbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJG93bmVyID0gJG93bmVyO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNjcm9sbCA9IDxJU2Nyb2xsRXg+bmV3IElTY3JvbGwoZWxlbWVudCwgaXNjcm9sbE9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJHdyYXBwZXIgPSAkKHRoaXMuX2lzY3JvbGwud3JhcHBlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kc2Nyb2xsZXIgPSAkKHRoaXMuX2lzY3JvbGwuc2Nyb2xsZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGlzdHZpZXdPcHRpb25zID0gbGlzdHZpZXdPcHRpb25zO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImlzY3JvbGwgbW9kdWxlIGRvZXNuJ3QgbG9hZC5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGxlciDjga7lnovjgpLlj5blvpdcclxuICAgICAgICBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBTY3JvbGxlcklTY3JvbGwuVFlQRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBwb3NpdGlvbiDlj5blvpdcclxuICAgICAgICBnZXRQb3MoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgbGV0IHBvcyA9IHRoaXMuX2lzY3JvbGwuZ2V0Q29tcHV0ZWRQb3NpdGlvbigpLnk7XHJcbiAgICAgICAgICAgIGlmIChfLmlzTmFOKHBvcykpIHtcclxuICAgICAgICAgICAgICAgIHBvcyA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBwb3MgPSAtcG9zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwb3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgcG9zaXRpb24g44Gu5pyA5aSn5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0UG9zTWF4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiBfVXRpbHMubWF4KC10aGlzLl9pc2Nyb2xsLm1heFNjcm9sbFksIDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCpOODmeODs+ODiOeZu+mMslxyXG4gICAgICAgIG9uKHR5cGU6IHN0cmluZywgZnVuYzogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNjcm9sbC5vbihcInNjcm9sbFwiLCBmdW5jKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxzdG9wXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNjcm9sbC5vbihcInNjcm9sbEVuZFwiLCBmdW5jKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5zdXBwb3J0ZWQgdHlwZTogXCIgKyB0eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCpOODmeODs+ODiOeZu+mMsuino+mZpFxyXG4gICAgICAgIG9mZih0eXBlOiBzdHJpbmcsIGZ1bmM6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjcm9sbFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzY3JvbGwub2ZmKFwic2Nyb2xsXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjcm9sbHN0b3BcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc2Nyb2xsLm9uKFwic2Nyb2xsRW5kXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bnN1cHBvcnRlZCB0eXBlOiBcIiArIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5oyH5a6aXHJcbiAgICAgICAgc2Nyb2xsVG8ocG9zOiBudW1iZXIsIGFuaW1hdGU/OiBib29sZWFuLCB0aW1lPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRpbWUgPSAwO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbGlzdHZpZXdPcHRpb25zLmVuYWJsZUFuaW1hdGlvbiAmJiBhbmltYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aW1lID0gdGltZSB8fCB0aGlzLl9saXN0dmlld09wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb247XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5faXNjcm9sbC5zY3JvbGxUbygwLCAtcG9zLCB0aW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGxlciDjga7nirbmhYvmm7TmlrBcclxuICAgICAgICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl8kb3duZXIpIHtcclxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB3cmFwcGVyXHJcbiAgICAgICAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG93bmVySGVpZ2h0ID0gdGhpcy5fJG93bmVyLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvd25lckhlaWdodCAhPT0gdGhpcy5fJHdyYXBwZXIuaGVpZ2h0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fJHdyYXBwZXIuaGVpZ2h0KG93bmVySGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX3JlZnJlc2hUaW1lcklkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuX3JlZnJlc2hUaW1lcklkKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9jID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl8kc2Nyb2xsZXIgJiYgdGhpcy5fJHNjcm9sbGVyLmhlaWdodCgpICE9PSB0aGlzLl9pc2Nyb2xsLnNjcm9sbGVySGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzY3JvbGwucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGltZXJJZCA9IHNldFRpbWVvdXQocHJvYywgdGhpcy5fbGlzdHZpZXdPcHRpb25zLnNjcm9sbE1hcFJlZnJlc2hJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVmcmVzaFRpbWVySWQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNjcm9sbC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGltZXJJZCA9IHNldFRpbWVvdXQocHJvYywgdGhpcy5fbGlzdHZpZXdPcHRpb25zLnNjcm9sbE1hcFJlZnJlc2hJbnRlcnZhbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGxlciDjga7noLTmo4RcclxuICAgICAgICBkZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl8kc2Nyb2xsZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl8kd3JhcHBlciA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzY3JvbGwuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl8kb3duZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCv+OCpOODl+Wumue+qVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFRZUEUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiaXNjcm9sbFwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGZhY3Rvcnkg5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRGYWN0b3J5KG9wdGlvbnM/OiBJU2Nyb2xsT3B0aW9ucyk6IChlbGVtZW50OiBhbnksIG9wdGlvbnM6IExpc3RWaWV3T3B0aW9ucykgPT4gSVNjcm9sbGVyIHtcclxuICAgICAgICAgICAgY29uc3QgZGVmYXVsdE9wdCA9IHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFg6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgYm91bmNlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHRhcDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNsaWNrOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbW91c2VXaGVlbDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNjcm9sbGJhcnM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBpbnRlcmFjdGl2ZVNjcm9sbGJhcnM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzaHJpbmtTY3JvbGxiYXJzOiBcInNjYWxlXCIsXHJcbiAgICAgICAgICAgICAgICBmYWRlU2Nyb2xsYmFyczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHByZXZlbnREZWZhdWx0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVQb2ludGVyOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZU1vdXNlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVUb3VjaDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwcm9iZVR5cGU6IDIsXHJcbi8vICAgICAgICAgICAgICAgZXZlbnRQYXNzdGhyb3VnaDogdHJ1ZSxcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGlzY3JvbGxPcHRpb25zID0gJC5leHRlbmQoe30sIGRlZmF1bHRPcHQsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZmFjdG9yeSA9IChlbGVtZW50OiBhbnksIGxpc3R2aWV3T3B0aW9uczogTGlzdFZpZXdPcHRpb25zKTogSVNjcm9sbGVyID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRvd25lciA9ICQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkbWFwID0gJG93bmVyLmZpbmQoX0NvbmZpZy5TQ1JPTExfTUFQX1NFTEVDVE9SKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICR3cmFwcGVyID0gJChcIjxkaXYgY2xhc3M9J1wiICsgX0NvbmZpZy5XUkFQUEVSX0NMQVNTICsgXCInPjwvZGl2PlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jc3Moe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogXCJhYnNvbHV0ZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aWR0aDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93OiBcImhpZGRlblwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJG1hcC53cmFwKCR3cmFwcGVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU2Nyb2xsZXJJU2Nyb2xsKCRvd25lciwgX0NvbmZpZy5XUkFQUEVSX1NFTEVDVE9SLCBpc2Nyb2xsT3B0aW9ucywgbGlzdHZpZXdPcHRpb25zKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gc2V0IHR5cGUgc2lnbmF0dXJlLlxyXG4gICAgICAgICAgICAoPGFueT5mYWN0b3J5KS50eXBlID0gU2Nyb2xsZXJJU2Nyb2xsLlRZUEU7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZmFjdG9yeTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkxpc3RJdGVtVmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIExpc3RJdGVtVmlld09wdGlvbnNcclxuICAgICAqIEBicmllZiBMaXN0SXRlbVZpZXcg44Gu44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTGlzdEl0ZW1WaWV3T3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBCYWNrYm9uZS5Nb2RlbCA9IEJhY2tib25lLk1vZGVsPlxyXG4gICAgICAgIGV4dGVuZHMgQmFja2JvbmUuVmlld09wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgb3duZXI6IEJhc2VMaXN0VmlldztcclxuICAgICAgICAkZWw/OiBKUXVlcnk7XHJcbiAgICAgICAgbGluZVByb2ZpbGU6IExpbmVQcm9maWxlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIExpc3RJdGVtVmlld1xyXG4gICAgICogQGJyaWVmIExpc3RWaWV3IOOBjOaJseOBhiBMaXN0SXRlbSDjgrPjg7Pjg4bjg4rjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIExpc3RJdGVtVmlldzxUTW9kZWwgZXh0ZW5kcyBCYWNrYm9uZS5Nb2RlbCA9IEJhY2tib25lLk1vZGVsPlxyXG4gICAgICAgIGV4dGVuZHMgQmFja2JvbmUuVmlldzxUTW9kZWw+IGltcGxlbWVudHMgSUxpc3RJdGVtVmlldywgSUNvbXBvc2FibGVWaWV3IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfb3duZXI6IEJhc2VMaXN0VmlldyA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfbGluZVByb2ZpbGU6IExpbmVQcm9maWxlID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBMaXN0SXRlbVZpZXdPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX293bmVyID0gb3B0aW9ucy5vd25lcjtcclxuICAgICAgICAgICAgaWYgKG9wdGlvbnMuJGVsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZXMgPSAoPGFueT50aGlzKS5ldmVudHMgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQob3B0aW9ucy4kZWwsIGRlbGVnYXRlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbGluZVByb2ZpbGUgPSBvcHRpb25zLmxpbmVQcm9maWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBMaXN0SXRlbVZpZXdcclxuXHJcbiAgICAgICAgLy8hIOaPj+eUuzogZnJhbWV3b3JrIOOBi+OCieWRvOOBs+WHuuOBleOCjOOCi+OBn+OCgeOAgeOCquODvOODkOODvOODqeOCpOODieW/hemgiFxyXG4gICAgICAgIHJlbmRlcigpOiBMaXN0SXRlbVZpZXc8VE1vZGVsPiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcIm5lZWQgb3ZlcnJpZGUgJ3JlbmRlcigpJyBtZXRob2QuXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDoh6rouqvjga4gTGluZSDjgqTjg7Pjg4fjg4Pjgq/jgrnjgpLlj5blvpdcclxuICAgICAgICBnZXRJbmRleCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGluZVByb2ZpbGUuaW5kZXg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg6Ieq6Lqr44Gr5oyH5a6a44GV44KM44Gf6auY44GV44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U3BlY2lmaWVkSGVpZ2h0KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9saW5lUHJvZmlsZS5oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgY2hpbGQgbm9kZSDjgYzlrZjlnKjjgZnjgovjgYvliKTlrppcclxuICAgICAgICBoYXNDaGlsZE5vZGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy4kZWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwIDwgdGhpcy4kZWwuY2hpbGRyZW4oKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOmrmOOBleOCkuabtOaWsFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG5ld0hlaWdodCB7TnVtYmVyfSAgICAgICAgICAgICAgW2luXSDmlrDjgZfjgYTpq5jjgZVcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyAgIHtVcGRhdGVIZWlnaHRPcHRpb25zfSBbaW5dIGxpbmUg44Gu6auY44GV5pu05paw5pmC44Gr5b2x6Z+/44GZ44KL44GZ44G544Gm44GuIExpbmVQcm9maWxlIOOBruWGjeioiOeul+OCkuihjOOBhuWgtOWQiOOBryB7IHJlZmxlY3RBbGw6IHRydWUgfVxyXG4gICAgICAgICAqIEByZXR1cm4ge0xpc3RJdGVtVmlld30g44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdXBkYXRlSGVpZ2h0KG5ld0hlaWdodDogbnVtYmVyLCBvcHRpb25zPzogVXBkYXRlSGVpZ2h0T3B0aW9ucyk6IExpc3RJdGVtVmlldzxUTW9kZWw+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuJGVsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5nZXRTcGVjaWZpZWRIZWlnaHQoKSAhPT0gbmV3SGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGluZVByb2ZpbGUudXBkYXRlSGVpZ2h0KG5ld0hlaWdodCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kZWwuaGVpZ2h0KG5ld0hlaWdodCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElDb21wb3NhYmxlVmlld1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgZnjgafjgavlrprnvqnjgZXjgozjgZ8gQmFja2JvbmUuVmlldyDjgpLln7rlupXjgq/jg6njgrnjgavoqK3lrprjgZfjgIFleHRlbmQg44KS5a6f6KGM44GZ44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGVyaXZlcyAgICAgICAgIHtCYWNrYm9uZS5WaWV3fEJhY2tib25lLlZpZXdbXX0gW2luXSDlkIjmiJDlhYPjga4gVmlldyDjgq/jg6njgrlcclxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydGllcyAgICAgIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwcm90b3R5cGUg44OX44Ot44OR44OG44KjXHJcbiAgICAgICAgICogQHBhcmFtIGNsYXNzUHJvcGVydGllcyB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgIFtpbl0gc3RhdGljIOODl+ODreODkeODhuOCo1xyXG4gICAgICAgICAqIEByZXR1cm4ge0JhY2tib25lLlZpZXd8QmFja2JvbmUuVmlld1tdfSDmlrDopo/jgavnlJ/miJDjgZXjgozjgZ8gVmlldyDjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgY29tcG9zZShkZXJpdmVzOiBWaWV3Q29uc3RydWN0b3IgfCBWaWV3Q29uc3RydWN0b3JbXSwgcHJvcGVydGllczogYW55LCBjbGFzc1Byb3BlcnRpZXM/OiBhbnkpOiBWaWV3Q29uc3RydWN0b3Ige1xyXG4gICAgICAgICAgICBjb25zdCBjb21wb3NlZDogYW55ID0gY29tcG9zZVZpZXdzKExpc3RJdGVtVmlldywgZGVyaXZlcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb3NlZC5leHRlbmQocHJvcGVydGllcywgY2xhc3NQcm9wZXJ0aWVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IEJhY2tib25lLlZpZXdcclxuXHJcbiAgICAgICAgLy8hIOmWi+aUvlxyXG4gICAgICAgIHJlbW92ZSgpOiBMaXN0SXRlbVZpZXc8VE1vZGVsPiB7XHJcbiAgICAgICAgICAgIC8vIHhwZXJpYSBBWCBKZWxseSBCZWFuICg0LjEuMinjgavjgabjgIHjg6Hjg6Ljg6rjg7zjg6rjg7zjgq/jgpLou73muJvjgZXjgZvjgovlirnmnpxcclxuICAgICAgICAgICAgdGhpcy4kZWwuZmluZChcImZpZ3VyZVwiKS5jc3MoXCJiYWNrZ3JvdW5kLWltYWdlXCIsIFwibm9uZVwiKTtcclxuICAgICAgICAgICAgLy8gdGhpcy4kZWwg44Gv5YaN5Yip55So44GZ44KL44Gf44KB56C05qOE44GX44Gq44GEXHJcbiAgICAgICAgICAgIHRoaXMuJGVsLmNoaWxkcmVuKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsLm9mZigpO1xyXG4gICAgICAgICAgICB0aGlzLiRlbCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuc3RvcExpc3RlbmluZygpO1xyXG4gICAgICAgICAgICB0aGlzLl9saW5lUHJvZmlsZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBzaG9ydCBjdXQgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEgT3duZXIg5Y+W5b6XXHJcbiAgICAgICAgZ2V0IG93bmVyKCk6IEJhc2VMaXN0VmlldyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bm8tYml0d2lzZSBuby11bnVzZWQtZXhwcmVzc2lvbiAqL1xyXG4vKiBqc2hpbnQgLVcwMzAgKi8gIC8vIGZvciBcIkV4cGVjdGVkIGFuIGFzc2lnbm1lbnQgb3IgZnVuY3Rpb24gY2FsbCBhbmQgaW5zdGVhZCBzYXcgYW4gZXhwcmVzc2lvblwiXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgX0NvbmZpZyAgPSBDRFAuVUkuTGlzdFZpZXdHbG9iYWxDb25maWc7XHJcbiAgICBpbXBvcnQgX1V0aWxzICAgPSBDRFAuVUkuX0xpc3RWaWV3VXRpbHM7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlNjcm9sbE1hbmFnZXJdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFNjcm9sbE1hbmFnZXJcclxuICAgICAqIEBicmllZiDjg6Hjg6Ljg6rnrqHnkIbjgpLooYzjgYbjgrnjgq/jg63jg7zjg6vlh6bnkIbjga7jgrPjgqLjg63jgrjjg4Pjgq/lrp/oo4Xjgq/jg6njgrlcclxuICAgICAqICAgICAgICDmnKzjgq/jg6njgrnjga8gSUxpc3RWaWV3IOOCpOODs+OCv+ODvOODleOCp+OCpOOCueOCkuaMgeOBoSBET00g44Gr44Ki44Kv44K744K544GZ44KL44GM44CBQmFja2JvbmUuVmlldyDjgpLntpnmib/jgZfjgarjgYRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFNjcm9sbE1hbmFnZXIgaW1wbGVtZW50cyBJTGlzdFZpZXdGcmFtZXdvcmssIElTY3JvbGxhYmxlLCBJQmFja3VwUmVzdG9yZSB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgXyRyb290OiBKUXVlcnkgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyE8IFNjcm9sbCDlr77osaHjga7jg6vjg7zjg4jjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICBwcml2YXRlIF8kbWFwOiBKUXVlcnkgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8hPCBTY3JvbGwgTWFwIGVsZW1lbnQg44KS5qC857SNXHJcbiAgICAgICAgcHJpdmF0ZSBfbWFwSGVpZ2h0OiBudW1iZXIgPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vITwgU2Nyb2xsIE1hcCDjga7pq5jjgZXjgpLmoLzntI0gKF8kbWFwIOOBrueKtuaFi+OBq+S+neWtmOOBleOBm+OBquOBhClcclxuICAgICAgICBwcml2YXRlIF9zY3JvbGxlcjogSVNjcm9sbGVyID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8hPCBTY3JvbGwg44Gr5L2/55So44GZ44KLIElTY3JvbGxlciDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICBwcml2YXRlIF9zZXR0aW5nczogTGlzdFZpZXdPcHRpb25zID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8hPCBTY3JvbGxNYW5hZ2VyIOOCquODl+OCt+ODp+ODs+OCkuagvOe0jVxyXG4gICAgICAgIHByaXZhdGUgX2FjdGl2ZSA9IHRydWU7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyE8IFVJIOihqOekuuS4reOBryB0cnVlIOOBq+aMh+WumlxyXG4gICAgICAgIHByaXZhdGUgX3Njcm9sbEV2ZW50SGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQgPSBudWxsOyAgICAgICAgICAvLyE8IFNjcm9sbCBFdmVudCBIYW5kbGVyXHJcbiAgICAgICAgcHJpdmF0ZSBfc2Nyb2xsU3RvcEV2ZW50SGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQgPSBudWxsOyAgICAgIC8vITwgU2Nyb2xsIFN0b3AgRXZlbnQgSGFuZGxlclxyXG4gICAgICAgIHByaXZhdGUgX2Jhc2VIZWlnaHQ6IG51bWJlciA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyE8IOmrmOOBleOBruWfuua6luWApFxyXG4gICAgICAgIHByaXZhdGUgX2xpbmVzOiBMaW5lUHJvZmlsZVtdID0gW107ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyE8IOeuoeeQhuS4i+OBq+OBguOCiyBMaW5lUHJvZmlsZSDphY3liJdcclxuICAgICAgICBwcml2YXRlIF9wYWdlczogUGFnZVByb2ZpbGVbXSA9IFtdOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8hPCDnrqHnkIbkuIvjgavjgYLjgosgUGFnZVByb2ZpbGUg6YWN5YiXXHJcbiAgICAgICAgLy8hIOacgOaWsOOBruihqOekuumgmOWfn+aDheWgseOCkuagvOe0jSAoU2Nyb2xsIOS4reOBruabtOaWsOWHpueQhuOBq+S9v+eUqClcclxuICAgICAgICBwcml2YXRlIF9sYXN0QWN0aXZlUGFnZUNvbnRleHQgPSB7XHJcbiAgICAgICAgICAgIGluZGV4OiAwLFxyXG4gICAgICAgICAgICBmcm9tOiAwLFxyXG4gICAgICAgICAgICB0bzogMCxcclxuICAgICAgICAgICAgcG9zOiAwLCAgICAvLyBzY3JvbGwgcG9zaXRpb25cclxuICAgICAgICB9O1xyXG4gICAgICAgIHByb3RlY3RlZCBfYmFja3VwID0ge307ICAgIC8vITwg44OH44O844K/44GuIGJhY2t1cCDpoJjln58uIGtleSDjgaggX2xpbmVzIOOCkuagvOe0jeOAgua0vueUn+OCr+ODqeOCueOBp+aLoeW8teWPr+iDveOAglxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIF8kcm9vdCAge0pRdWVyeX0gW2luXSDnrqHnkIblr77osaHjga7jg6vjg7zjg4jjgqjjg6zjg6Hjg7Pjg4hcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7TGlzdFZpZXdPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBMaXN0Vmlld09wdGlvbnMpIHtcclxuICAgICAgICAgICAgLy8gTGlzdFZpZXdPcHRpb25zIOaXouWumuWApFxyXG4gICAgICAgICAgICBjb25zdCBkZWZPcHRpb25zOiBMaXN0Vmlld09wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxlckZhY3Rvcnk6IFNjcm9sbGVyRWxlbWVudC5nZXRGYWN0b3J5KCksXHJcbiAgICAgICAgICAgICAgICBlbmFibGVIaWRkZW5QYWdlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGVuYWJsZVRyYW5zZm9ybU9mZnNldDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxNYXBSZWZyZXNoSW50ZXJ2YWw6IDIwMCxcclxuICAgICAgICAgICAgICAgIHNjcm9sbFJlZnJlc2hEaXN0YW5jZTogMjAwLFxyXG4gICAgICAgICAgICAgICAgcGFnZVByZXBhcmVDb3VudDogMyxcclxuICAgICAgICAgICAgICAgIHBhZ2VQcmVsb2FkQ291bnQ6IDEsXHJcbiAgICAgICAgICAgICAgICBlbmFibGVBbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgICAgICAgICBhbmltYXRpb25EdXJhdGlvbjogMCxcclxuICAgICAgICAgICAgICAgIGJhc2VEZXB0aDogXCJhdXRvXCIsXHJcbiAgICAgICAgICAgICAgICBpdGVtVGFnTmFtZTogXCJsaVwiLFxyXG4gICAgICAgICAgICAgICAgcmVtb3ZlSXRlbVdpdGhUcmFuc2l0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgdXNlRHVtbXlJbmFjdGl2ZVNjcm9sbE1hcDogZmFsc2UsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyDoqK3lrprmoLzntI1cclxuICAgICAgICAgICAgdGhpcy5fc2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgZGVmT3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAvLyDjgrnjgq/jg63jg7zjg6vjgqTjg5njg7Pjg4hcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsRXZlbnRIYW5kbGVyID0gKGV2ZW50OiBKUXVlcnkuRXZlbnQpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TY3JvbGwodGhpcy5fc2Nyb2xsZXIuZ2V0UG9zKCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyDjgrnjgq/jg63jg7zjg6vlgZzmraLjgqTjg5njg7Pjg4hcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsU3RvcEV2ZW50SGFuZGxlciA9IChldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2Nyb2xsU3RvcCh0aGlzLl9zY3JvbGxlci5nZXRQb3MoKSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RcclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOOCquODluOCuOOCp+OCr+ODiOOBruWIneacn+WMllxyXG4gICAgICAgIHB1YmxpYyBpbml0aWFsaXplKCRyb290OiBKUXVlcnksIGhlaWdodDogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIC8vIOaXouOBq+ani+evieOBleOCjOOBpuOBhOOBn+WgtOWQiOOBr+egtOajhFxyXG4gICAgICAgICAgICBpZiAodGhpcy5fJHJvb3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl8kcm9vdCA9ICRyb290O1xyXG4gICAgICAgICAgICB0aGlzLl8kbWFwID0gJHJvb3QuaGFzQ2xhc3MoX0NvbmZpZy5TQ1JPTExfTUFQX0NMQVNTKSA/ICRyb290IDogJHJvb3QuZmluZChfQ29uZmlnLlNDUk9MTF9NQVBfU0VMRUNUT1IpO1xyXG4gICAgICAgICAgICAvLyBfJG1hcCDjgYznhKHjgYTloLTlkIjjga/liJ3mnJ/ljJbjgZfjgarjgYRcclxuICAgICAgICAgICAgaWYgKHRoaXMuXyRtYXAubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRyb290ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIgPSB0aGlzLmNyZWF0ZVNjcm9sbGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0QmFzZUhlaWdodChoZWlnaHQpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFNjcm9sbGVyQ29uZGl0aW9uKCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjgqrjg5bjgrjjgqfjgq/jg4jjga7noLTmo4RcclxuICAgICAgICBwdWJsaWMgZGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Njcm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0U2Nyb2xsZXJDb25kaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5fJG1hcCA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuXyRyb290ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5rjg7zjgrjjga7ln7rmupblgKTjgpLlj5blvpdcclxuICAgICAgICBwdWJsaWMgc2V0QmFzZUhlaWdodChoZWlnaHQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9iYXNlSGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmFzZUhlaWdodCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJpbnZhbGlkIGJhc2UgaGVpZ2h0OiBcIiArIHRoaXMuX2Jhc2VIZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY3JvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBhY3RpdmUg54q25oWL6Kit5a6aXHJcbiAgICAgICAgcHVibGljIHNldEFjdGl2ZVN0YXRlKGFjdGl2ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9hY3RpdmUgPSBhY3RpdmU7XHJcbiAgICAgICAgICAgIHRoaXMudHJlYXRTY3JvbGxQb3NpdGlvbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGFjdGl2ZSDnirbmhYvliKTlrppcclxuICAgICAgICBwdWJsaWMgaXNBY3RpdmUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hY3RpdmU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgc2Nyb2xsZXIg44Gu56iu6aGe44KS5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIGdldFNjcm9sbGVyVHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gKDxhbnk+dGhpcy5fc2V0dGluZ3Muc2Nyb2xsZXJGYWN0b3J5KS50eXBlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog54q25oWL44Gr5b+c44GY44Gf44K544Kv44Ot44O844Or5L2N572u44Gu5L+d5a2YL+W+qeWFg1xyXG4gICAgICAgICAqIGNkcC51aS5mcy5qczogUGFnZVRhYkxpc3RWaWV3IOOBjOWun+mok+eahOOBq+S9v+eUqFxyXG4gICAgICAgICAqIFRPRE86IOKAu2lzY3JvbGwg44Gv5pyq5a++5b+cXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHRyZWF0U2Nyb2xsUG9zaXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBpOiBudW1iZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IHt9O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdXBkYXRlT2Zmc2V0ID0gKCR0YXJnZXQ6IEpRdWVyeSk6IEpRdWVyeSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvZmZzZXQgPSAodGhpcy5fc2Nyb2xsZXIuZ2V0UG9zKCkgLSB0aGlzLl9sYXN0QWN0aXZlUGFnZUNvbnRleHQucG9zKTtcclxuICAgICAgICAgICAgICAgIGlmIChfVXRpbHMuZ2V0Q3NzTWF0cml4VmFsdWUoJHRhcmdldCwgXCJ0cmFuc2xhdGVZXCIpICE9PSBvZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgX1V0aWxzLmNzc1ByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVtfVXRpbHMuY3NzUHJlZml4ZXNbaV0gKyBcInRyYW5zZm9ybVwiXSA9IFwidHJhbnNsYXRlM2QoMHB4LFwiICsgb2Zmc2V0ICsgXCJweCwwcHgpXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICR0YXJnZXQuY3NzKHRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICR0YXJnZXQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjbGVhck9mZnNldCA9ICgkdGFyZ2V0OiBKUXVlcnkpOiBKUXVlcnkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IF9VdGlscy5jc3NQcmVmaXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVtfVXRpbHMuY3NzUHJlZml4ZXNbaV0gKyBcInRyYW5zZm9ybVwiXSA9IFwiXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAkdGFyZ2V0LmNzcyh0cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICR0YXJnZXQ7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDku6XkuIvjga7jgrnjgrPjg7zjg5fjga7lh6bnkIbjgavlr77jgZfjgabnlLvpnaLmm7TmlrDjgpIx5Zue44Gr44Gn44GN44Gq44GE44Gf44KB44CBSkIsIElDUyDjgafjga/jgaHjgonjgaTjgY3jgYznmbrnlJ/jgZnjgovjgIJLaXRrYXQg5Lul6ZmN44Gv6Imv5aW944CCXHJcbiAgICAgICAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zY3JvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxlci5zY3JvbGxUbyh0aGlzLl9sYXN0QWN0aXZlUGFnZUNvbnRleHQucG9zLCBmYWxzZSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyT2Zmc2V0KHRoaXMuXyRtYXApLmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcclxuICAgICAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MudXNlRHVtbXlJbmFjdGl2ZVNjcm9sbE1hcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJlcGFyZUluYWN0aXZlTWFwKCkucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fc2Nyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy51c2VEdW1teUluYWN0aXZlU2Nyb2xsTWFwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2Zmc2V0KHRoaXMucHJlcGFyZUluYWN0aXZlTWFwKCkpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVPZmZzZXQodGhpcy5fJG1hcCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBpbmFjdGl2ZSDnlKggTWFwIOOBrueUn+aIkFxyXG4gICAgICAgIHByaXZhdGUgcHJlcGFyZUluYWN0aXZlTWFwKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRwYXJlbnQgPSB0aGlzLl8kbWFwLnBhcmVudCgpO1xyXG4gICAgICAgICAgICBsZXQgJGluYWN0aXZlTWFwID0gJHBhcmVudC5maW5kKF9Db25maWcuSU5BQ1RJVkVfQ0xBU1NfU0VMRUNUT1IpO1xyXG4gICAgICAgICAgICBpZiAoJGluYWN0aXZlTWFwLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UGFnZUluZGV4ID0gdGhpcy5nZXRQYWdlSW5kZXgoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRsaXN0SXRlbVZpZXdzID0gdGhpcy5fJG1hcC5jbG9uZSgpLmNoaWxkcmVuKCkuZmlsdGVyKChpbmRleDogbnVtYmVyLCBlbGVtZW50OiBIVE1MRWxlbWVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhZ2VJbmRleCA9IH5+JChlbGVtZW50KS5hdHRyKF9Db25maWcuREFUQV9QQUdFX0lOREVYKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFBhZ2VJbmRleCAtIDEgPD0gcGFnZUluZGV4IHx8IHBhZ2VJbmRleCA8PSBjdXJyZW50UGFnZUluZGV4ICsgMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkaW5hY3RpdmVNYXAgPSAkKFwiPHNlY3Rpb24gY2xhc3M9J1wiICsgX0NvbmZpZy5TQ1JPTExfTUFQX0NMQVNTICsgXCIgXCIgKyBfQ29uZmlnLklOQUNUSVZFX0NMQVNTICsgXCInPjwvc2VjdGlvbj5cIilcclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kKCRsaXN0SXRlbVZpZXdzKVxyXG4gICAgICAgICAgICAgICAgICAgIC5oZWlnaHQodGhpcy5fbWFwSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgICRwYXJlbnQuYXBwZW5kKCRpbmFjdGl2ZU1hcCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kbWFwLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAkaW5hY3RpdmVNYXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyDjg5fjg63jg5XjgqHjgqTjg6vnrqHnkIZcclxuXHJcbiAgICAgICAgLy8hIOWIneacn+WMlua4iOOBv+OBi+WIpOWumlxyXG4gICAgICAgIGlzSW5pdGlhbGl6ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhIXRoaXMuXyRyb290O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODl+ODreODkeODhuOCo+OCkuaMh+WumuOBl+OBpuOAgUxpbmVQcm9maWxlIOOCkueuoeeQhlxyXG4gICAgICAgIGFkZEl0ZW0oXHJcbiAgICAgICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgICAgICBpbml0aWFsaXplcjogbmV3IChvcHRpb25zPzogYW55KSA9PiBCYXNlTGlzdEl0ZW1WaWV3LFxyXG4gICAgICAgICAgICBpbmZvOiBhbnksXHJcbiAgICAgICAgICAgIGluc2VydFRvPzogbnVtYmVyXHJcbiAgICAgICAgKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FkZExpbmUobmV3IExpbmVQcm9maWxlKHRoaXMsIE1hdGguZmxvb3IoaGVpZ2h0KSwgaW5pdGlhbGl6ZXIsIGluZm8pLCBpbnNlcnRUbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OX44Ot44OR44OG44Kj44KS5oyH5a6a44GX44Gm44CBTGluZVByb2ZpbGUg44KS566h55CGLiDnmbvpjLIgZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCi1xyXG4gICAgICAgIHB1YmxpYyBfYWRkTGluZShfbGluZTogYW55LCBpbnNlcnRUbz86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zdCBsaW5lczogTGluZVByb2ZpbGVbXSA9IChfbGluZSBpbnN0YW5jZW9mIEFycmF5KSA/IDxMaW5lUHJvZmlsZVtdPl9saW5lIDogW19saW5lXTtcclxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciwgbjogbnVtYmVyO1xyXG4gICAgICAgICAgICBsZXQgZGVsdGFIZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICBsZXQgYWRkVGFpbCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gaW5zZXJ0VG8pIHtcclxuICAgICAgICAgICAgICAgIGluc2VydFRvID0gdGhpcy5fbGluZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5zZXJ0VG8gPT09IHRoaXMuX2xpbmVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgYWRkVGFpbCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHNjcm9sbCBtYXAg44Gu5pu05pawXHJcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIG4gPSBsaW5lcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGRlbHRhSGVpZ2h0ICs9IGxpbmVzW2ldLmhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbE1hcEhlaWdodChkZWx0YUhlaWdodCk7XHJcblxyXG4gICAgICAgICAgICAvLyDmjL/lhaVcclxuICAgICAgICAgICAgZm9yIChpID0gbGluZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzLnNwbGljZShpbnNlcnRUbywgMCwgbGluZXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBwYWdlIOioreWumuOBruino+mZpFxyXG4gICAgICAgICAgICBpZiAoIWFkZFRhaWwpIHtcclxuICAgICAgICAgICAgICAgIGlmICgwID09PSBpbnNlcnRUbykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJQYWdlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG51bGwgIT0gdGhpcy5fbGluZXNbaW5zZXJ0VG8gLSAxXS5wYWdlSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUGFnZSh0aGlzLl9saW5lc1tpbnNlcnRUbyAtIDFdLnBhZ2VJbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIG9mZnNldCDjga7lho3oqIjnrpdcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9maWxlcyhpbnNlcnRUbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIEl0ZW0g44KS5YmK6ZmkXHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogbnVtYmVyLCBzaXplPzogbnVtYmVyLCBkZWxheT86IG51bWJlcik6IHZvaWQ7XHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogbnVtYmVyW10sIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBhbnksIGFyZzI/OiBudW1iZXIsIGFyZzM/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUxpbmVzKGluZGV4LCBhcmcyKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZUxpbmUoaW5kZXgsIGFyZzIsIGFyZzMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIExpbmVQcm9maWxlIOOCkuWJiumZpDog6YCj57aaIGluZGV4IOeJiFxyXG4gICAgICAgIHB1YmxpYyBfcmVtb3ZlTGluZShpbmRleDogbnVtYmVyLCBzaXplPzogbnVtYmVyLCBkZWxheT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBzaXplKSB7XHJcbiAgICAgICAgICAgICAgICBzaXplID0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwIHx8IHRoaXMuX2xpbmVzLmxlbmd0aCA8IGluZGV4ICsgc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImxvZ2ljIGVycm9yLiByZW1vdmVJdGVtKCksIGludmFsaWQgaW5kZXg6IFwiICsgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkZWxheSA9IChudWxsICE9IGRlbGF5KSA/IGRlbGF5IDogMDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQ6IExpbmVQcm9maWxlW10gPSBbXTtcclxuICAgICAgICAgICAgbGV0IGRlbHRhID0gMDtcclxuICAgICAgICAgICAgbGV0IG1hcFRyYW5zaXRpb24gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIOWJiumZpOWAmeijnOOBqOWkieWMlumHj+OBrueul+WHulxyXG4gICAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpbmU6IExpbmVQcm9maWxlO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gdGhpcy5fbGluZXNbaW5kZXggKyBpXTtcclxuICAgICAgICAgICAgICAgICAgICBkZWx0YSArPSBsaW5lLmhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAvLyDliYrpmaTopoHntKDjga4gei1pbmRleCDjga7liJ3mnJ/ljJZcclxuICAgICAgICAgICAgICAgICAgICBsaW5lLnJlc2V0RGVwdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVkLnB1c2gobGluZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyDoh6rli5XoqK3lrprjg7vliYrpmaTpgYXlu7bmmYLplpPjgYzoqK3lrprjgZXjgozjgYvjgaTjgIHjgrnjgq/jg63jg7zjg6vjg53jgrjjgrfjg6fjg7PjgavlpInmm7TjgYzjgYLjgovloLTlkIjjga8gdHJhbnNpdGlvbiDoqK3lrppcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5yZW1vdmVJdGVtV2l0aFRyYW5zaXRpb24gJiYgKDAgPCBkZWxheSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5nZXRTY3JvbGxQb3MoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3NNYXggPSB0aGlzLmdldFNjcm9sbFBvc01heCgpIC0gZGVsdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwVHJhbnNpdGlvbiA9IChwb3NNYXggPCBjdXJyZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOabtOaWsFxyXG4gICAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gdHJhbnNpdGlvbiDoqK3lrppcclxuICAgICAgICAgICAgICAgIGlmIChtYXBUcmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR1cFNjcm9sbE1hcFRyYW5zaXRpb24odGhpcy5fJG1hcCwgZGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gcGFnZSDoqK3lrprjga7op6PpmaRcclxuICAgICAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX2xpbmVzW2luZGV4XS5wYWdlSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUGFnZSh0aGlzLl9saW5lc1tpbmRleF0ucGFnZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIOOCueOCr+ODreODvOODq+mgmOWfn+OBruabtOaWsFxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTY3JvbGxNYXBIZWlnaHQoLWRlbHRhKTtcclxuICAgICAgICAgICAgICAgIC8vIOmFjeWIl+OBi+OCieWJiumZpFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZXMuc3BsaWNlKGluZGV4LCBzaXplKTtcclxuICAgICAgICAgICAgICAgIC8vIG9mZnNldCDjga7lho3oqIjnrpdcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvZmlsZXMoaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgLy8g6YGF5bu25YmK6ZmkXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVkLmZvckVhY2goKGxpbmUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5pbmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCBkZWxheSk7XHJcbiAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIExpbmVQcm9maWxlIOOCkuWJiumZpDogcmFuZG9tIGFjY2VzcyDniYhcclxuICAgICAgICBwdWJsaWMgX3JlbW92ZUxpbmVzKGluZGV4ZXM6IG51bWJlcltdLCBkZWxheT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBkZWxheSA9IChudWxsICE9IGRlbGF5KSA/IGRlbGF5IDogMDtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBuID0gaW5kZXhlcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgMCB8fCB0aGlzLl9saW5lcy5sZW5ndGggPCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImxvZ2ljIGVycm9yLiByZW1vdmVJdGVtKCksIGludmFsaWQgaW5kZXg6IFwiICsgaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZW1vdmVkOiBMaW5lUHJvZmlsZVtdID0gW107XHJcbiAgICAgICAgICAgIGxldCBkZWx0YSA9IDA7XHJcbiAgICAgICAgICAgIGxldCBtYXBUcmFuc2l0aW9uID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvLyDliYrpmaTlgJnoo5zjgajlpInljJbph4/jga7nrpflh7pcclxuICAgICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBsaW5lOiBMaW5lUHJvZmlsZTtcclxuICAgICAgICAgICAgICAgIGluZGV4ZXMuZm9yRWFjaCgoaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSB0aGlzLl9saW5lc1tpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsdGEgKz0gbGluZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5YmK6Zmk6KaB57Sg44GuIHotaW5kZXgg44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICAgICAgICAgICAgbGluZS5yZXNldERlcHRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKGxpbmUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyDoh6rli5XoqK3lrprjg7vliYrpmaTpgYXlu7bmmYLplpPjgYzoqK3lrprjgZXjgozjgYvjgaTjgIHjgrnjgq/jg63jg7zjg6vjg53jgrjjgrfjg6fjg7PjgavlpInmm7TjgYzjgYLjgovloLTlkIjjga8gdHJhbnNpdGlvbiDoqK3lrppcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5yZW1vdmVJdGVtV2l0aFRyYW5zaXRpb24gJiYgKDAgPCBkZWxheSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5nZXRTY3JvbGxQb3MoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3NNYXggPSB0aGlzLmdldFNjcm9sbFBvc01heCgpIC0gZGVsdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwVHJhbnNpdGlvbiA9IChwb3NNYXggPCBjdXJyZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOabtOaWsFxyXG4gICAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gdHJhbnNpdGlvbiDoqK3lrppcclxuICAgICAgICAgICAgICAgIGlmIChtYXBUcmFuc2l0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXR1cFNjcm9sbE1hcFRyYW5zaXRpb24odGhpcy5fJG1hcCwgZGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaW5kZXhlcy5mb3JFYWNoKChpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcGFnZSDoqK3lrprjga7op6PpmaRcclxuICAgICAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9saW5lc1tpbmRleF0ucGFnZUluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJQYWdlKHRoaXMuX2xpbmVzW2luZGV4XS5wYWdlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyDphY3liJfjgYvjgonliYrpmaRcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW5lcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG9mZnNldCDjga7lho3oqIjnrpdcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2ZpbGVzKGluZGV4KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8g44K544Kv44Ot44O844Or6aCY5Z+f44Gu5pu05pawXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbE1hcEhlaWdodCgtZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgLy8g6YGF5bu25YmK6ZmkXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVkLmZvckVhY2goKGxpbmUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5pbmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCBkZWxheSk7XHJcbiAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgc2Nyb2xsIG1hcCDjga7jg4jjg6njg7Pjgrjjgrfjg6fjg7PoqK3lrppcclxuICAgICAgICBwcml2YXRlIHNldHVwU2Nyb2xsTWFwVHJhbnNpdGlvbigkbWFwOiBKUXVlcnksIGRlbGF5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNpdGlvbkVuZEhhbmRsZXIgPSAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgJG1hcC5vZmYoX1V0aWxzLnRyYW5zaXRpb25FbmQpO1xyXG4gICAgICAgICAgICAgICAgX1V0aWxzLmNsZWFyVHJhbnNpdGlvbnMoJG1hcCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuXyRtYXAub24oX1V0aWxzLnRyYW5zaXRpb25FbmQsIHRyYW5zaXRpb25FbmRIYW5kbGVyKTtcclxuICAgICAgICAgICAgX1V0aWxzLnNldFRyYW5zZm9ybXNUcmFuc2l0aW9ucygkbWFwLCBcImhlaWdodFwiLCBkZWxheSwgXCJlYXNlXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBl+OBnyBJdGVtIOOBq+ioreWumuOBl+OBn+aDheWgseOCkuWPluW+l1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogbnVtYmVyKTogYW55O1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogSlF1ZXJ5LkV2ZW50KTogYW55O1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogYW55KTogYW55IHtcclxuICAgICAgICAgICAgbGV0IGluZGV4OiBudW1iZXI7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXJzZXIgPSAoJHRhcmdldDogSlF1ZXJ5KTogbnVtYmVyID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICgkdGFyZ2V0Lmhhc0NsYXNzKF9Db25maWcuTElTVElURU1fQkFTRV9DTEFTUykpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gfn4kdGFyZ2V0LmF0dHIoX0NvbmZpZy5EQVRBX0NPTlRBSU5FUl9JTkRFWCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCR0YXJnZXQuaGFzQ2xhc3MoX0NvbmZpZy5TQ1JPTExfTUFQX0NMQVNTKSB8fCAkdGFyZ2V0Lmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiY2Fubm90IGRpdGVjdCBsaW5lIGZyb20gZXZlbnQgb2JqZWN0LlwiKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlcigkdGFyZ2V0LnBhcmVudCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0YXJnZXQgaW5zdGFuY2VvZiAkLkV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IHBhcnNlcigkKHRhcmdldC5jdXJyZW50VGFyZ2V0KSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldCA9PT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChudWxsID09IGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwibG9naWMgZXJyb3IuIHVuc3VwcG9ydGVkIGFyZyB0eXBlLiB0eXBlOiBcIiArIHR5cGVvZiB0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5kZXggPCAwIHx8IHRoaXMuX2xpbmVzLmxlbmd0aCA8PSBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImxvZ2ljIGVycm9yLiBpbnZhbGlkIHJhbmdlLiBpbmRleDogXCIgKyBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpbmVzW2luZGV4XS5pbmZvO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCouOCr+ODhuOCo+ODluODmuODvOOCuOOCkuabtOaWsFxyXG4gICAgICAgIHJlZnJlc2goKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldHM6IGFueSA9IHt9O1xyXG4gICAgICAgICAgICBjb25zdCBzZWFyY2hDb3VudCA9IHRoaXMuX3NldHRpbmdzLnBhZ2VQcmVwYXJlQ291bnQgKyB0aGlzLl9zZXR0aW5ncy5wYWdlUHJlbG9hZENvdW50O1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyZW50UGFnZUluZGV4ID0gdGhpcy5nZXRQYWdlSW5kZXgoKTtcclxuICAgICAgICAgICAgY29uc3QgaGlnaFByaW9yaXR5SW5kZXg6IG51bWJlcltdID0gW107XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvbGRFeHNpc3RQYWdlID0gXy5maWx0ZXIodGhpcy5fcGFnZXMsIChwYWdlOiBQYWdlUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiaW5hY3RpdmVcIiAhPT0gcGFnZS5zdGF0dXM7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY2hhbmdlU3RhdGUgPSAoaW5kZXg6IG51bWJlcik6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZGV4ID09PSBjdXJyZW50UGFnZUluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0c1tpbmRleF0gPSBcImFjdGl2YXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgaGlnaFByaW9yaXR5SW5kZXgucHVzaChpbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKF9VdGlscy5hYnMoY3VycmVudFBhZ2VJbmRleCAtIGluZGV4KSA8PSB0aGlzLl9zZXR0aW5ncy5wYWdlUHJlcGFyZUNvdW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0c1tpbmRleF0gPSBcImFjdGl2YXRlXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zZXR0aW5ncy5lbmFibGVIaWRkZW5QYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHNbaW5kZXhdID0gXCJoaWRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0c1tpbmRleF0gPSBcImFjdGl2YXRlXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gY3VycmVudCBwYWdlIOOBriDliY3lvozjga8gaGlnaCBwcmlvcml0eSDjgavjgZnjgotcclxuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UGFnZUluZGV4ICsgMSA9PT0gaW5kZXggfHwgY3VycmVudFBhZ2VJbmRleCAtIDEgPT09IGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGlnaFByaW9yaXR5SW5kZXgucHVzaChpbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAvLyDlr77osaHnhKHjgZdcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2xpbmVzLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGFnZUluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIGxldCBvdmVyZmxvd1ByZXYgPSAwLCBvdmVyZmxvd05leHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmVnaW5JbmRleCA9IGN1cnJlbnRQYWdlSW5kZXggLSBzZWFyY2hDb3VudDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVuZEluZGV4ID0gY3VycmVudFBhZ2VJbmRleCArIHNlYXJjaENvdW50O1xyXG4gICAgICAgICAgICAgICAgZm9yIChwYWdlSW5kZXggPSBiZWdpbkluZGV4OyBwYWdlSW5kZXggPD0gZW5kSW5kZXg7IHBhZ2VJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhZ2VJbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3dQcmV2Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fcGFnZXMubGVuZ3RoIDw9IHBhZ2VJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvd05leHQrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNoYW5nZVN0YXRlKHBhZ2VJbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKDAgPCBvdmVyZmxvd1ByZXYpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBwYWdlSW5kZXggPSBjdXJyZW50UGFnZUluZGV4ICsgc2VhcmNoQ291bnQgKyAxOyBpIDwgb3ZlcmZsb3dQcmV2OyBpKysgLCBwYWdlSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fcGFnZXMubGVuZ3RoIDw9IHBhZ2VJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlU3RhdGUocGFnZUluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKDAgPCBvdmVyZmxvd05leHQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBwYWdlSW5kZXggPSBjdXJyZW50UGFnZUluZGV4IC0gc2VhcmNoQ291bnQgLSAxOyBpIDwgb3ZlcmZsb3dOZXh0OyBpKysgLCBwYWdlSW5kZXgtLSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocGFnZUluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlU3RhdGUocGFnZUluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgICAgICAvLyDkuI3opoHjgavjgarjgaPjgZ8gcGFnZSDjga4gaW5hY3RpdmF0ZVxyXG4gICAgICAgICAgICBvbGRFeHNpc3RQYWdlLmZvckVhY2goKHBhZ2U6IFBhZ2VQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHBhZ2UuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCA9PSB0YXJnZXRzW2luZGV4XSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2UuaW5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIOWEquWFiCBwYWdlIOOBriBhY3RpdmF0ZVxyXG4gICAgICAgICAgICBoaWdoUHJpb3JpdHlJbmRleFxyXG4gICAgICAgICAgICAgICAgLnNvcnQoKGxoczogbnVtYmVyLCByaHM6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsaHMgPCByaHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGhzID4gcmhzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgoaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2VzW2luZGV4XSAmJiB0aGlzLl9wYWdlc1tpbmRleF0uYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyDjgZ3jga7jgbvjgYvjga4gcGFnZSDjga4g54q25oWL5aSJ5pu0XHJcbiAgICAgICAgICAgIF8uZWFjaCh0YXJnZXRzLCAoYWN0aW9uOiBzdHJpbmcsIGtleTogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0luaXRpYWxpemVkKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB+fmtleTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChhY3Rpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJhY3RpdmF0ZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2VzW2luZGV4XSAmJiB0aGlzLl9wYWdlc1tpbmRleF0uYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJoaWRlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFnZXNbaW5kZXhdICYmIHRoaXMuX3BhZ2VzW2luZGV4XS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaW5hY3RpdmF0ZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVuZXhwZWN0ZWQgb3BlcmF0aW9uOiBpbmFjdGl2YXRlXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmtub3duIG9wZXJhdGlvbjogXCIgKyB0YXJnZXRzW2tleV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8g5pu05paw5b6M44Gr5L2/55So44GX44Gq44GL44Gj44GfIERPTSDjgpLliYrpmaRcclxuICAgICAgICAgICAgdGhpcy5maW5kUmVjeWNsZUVsZW1lbnRzKCkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9sYXN0QWN0aXZlUGFnZUNvbnRleHQuZnJvbSA9IHRoaXMuX3BhZ2VzW2N1cnJlbnRQYWdlSW5kZXhdLmdldExpbmVQcm9maWxlRmlyc3QoKSA/XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYWdlc1tjdXJyZW50UGFnZUluZGV4XS5nZXRMaW5lUHJvZmlsZUZpcnN0KCkuaW5kZXggOiAwO1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0QWN0aXZlUGFnZUNvbnRleHQudG8gPSB0aGlzLl9wYWdlc1tjdXJyZW50UGFnZUluZGV4XS5nZXRMaW5lUHJvZmlsZUxhc3QoKSA/XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYWdlc1tjdXJyZW50UGFnZUluZGV4XS5nZXRMaW5lUHJvZmlsZUxhc3QoKS5pbmRleCA6IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RBY3RpdmVQYWdlQ29udGV4dC5pbmRleCA9IGN1cnJlbnRQYWdlSW5kZXg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5pyq44Ki44K144Kk44Oz44Oa44O844K444KS5qeL56+JXHJcbiAgICAgICAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3BhZ2VzLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy5hc3NpZ25QYWdlKGluZGV4KTtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Oa44O844K444Ki44K144Kk44Oz44KS5YaN5qeL5oiQXHJcbiAgICAgICAgcmVidWlsZCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5jbGVhclBhZ2UoKTtcclxuICAgICAgICAgICAgdGhpcy5hc3NpZ25QYWdlKCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeuoei9hOODh+ODvOOCv+OCkuegtOajhFxyXG4gICAgICAgIHJlbGVhc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpbmVzLmZvckVhY2goKGxpbmU6IExpbmVQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsaW5lLmluYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuX2xpbmVzID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl8kbWFwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBIZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJG1hcC5oZWlnaHQoMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IEJhY2t1cCAvIFJlc3RvcmVcclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODkOODg+OCr+OCouODg+ODl1xyXG4gICAgICAgIGJhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9iYWNrdXBba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFja3VwW2tleV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZXM6IHRoaXMuX2xpbmVzLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg6rjgrnjg4jjgqJcclxuICAgICAgICByZXN0b3JlKGtleTogc3RyaW5nLCByZWJ1aWxkOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9iYWNrdXBba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgwIDwgdGhpcy5fbGluZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fYWRkTGluZSh0aGlzLl9iYWNrdXBba2V5XS5saW5lcyk7XHJcblxyXG4gICAgICAgICAgICBpZiAocmVidWlsZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWJ1aWxkKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruacieeEoVxyXG4gICAgICAgIGhhc0JhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9iYWNrdXBba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7noLTmo4RcclxuICAgICAgICBjbGVhckJhY2t1cChrZXk/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYWNrdXAgPSB7fTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG51bGwgIT0gdGhpcy5fYmFja3VwW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9iYWNrdXBba2V5XTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gr44Ki44Kv44K744K5XHJcbiAgICAgICAgZ2V0IGJhY2t1cERhdGEoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JhY2t1cDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IFNjcm9sbFxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or44Kk44OZ44Oz44OI44OP44Oz44OJ44Op6Kit5a6aL+ino+mZpFxyXG4gICAgICAgIHNldFNjcm9sbEhhbmRsZXIoaGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQsIG9uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY3JvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIub24oXCJzY3JvbGxcIiwgaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLm9mZihcInNjcm9sbFwiLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+e1guS6huOCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICBzZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Njcm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxlci5vbihcInNjcm9sbHN0b3BcIiwgaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLm9mZihcInNjcm9sbHN0b3BcIiwgaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3MoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbGVyID8gdGhpcy5fc2Nyb2xsZXIuZ2V0UG9zKCkgOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+S9jee9ruOBruacgOWkp+WApOOCkuWPluW+l1xyXG4gICAgICAgIGdldFNjcm9sbFBvc01heCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsZXIgPyB0aGlzLl9zY3JvbGxlci5nZXRQb3NNYXgoKSA6IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5oyH5a6aXHJcbiAgICAgICAgc2Nyb2xsVG8ocG9zOiBudW1iZXIsIGFuaW1hdGU/OiBib29sZWFuLCB0aW1lPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY3JvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJpbnZhbGlkIHBvc2l0aW9uLCB0b28gc21hbGwuIFtwb3M6IFwiICsgcG9zICsgXCJdXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3Njcm9sbGVyLmdldFBvc01heCgpIDwgcG9zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiaW52YWxpZCBwb3NpdGlvbiwgdG9vIGJpZy4gW3BvczogXCIgKyBwb3MgKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gdGhpcy5fc2Nyb2xsZXIuZ2V0UG9zTWF4KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBwb3Mg44Gu44G/5YWI6aeG44GR44Gm5pu05pawXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0QWN0aXZlUGFnZUNvbnRleHQucG9zID0gcG9zO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcyAhPT0gdGhpcy5fc2Nyb2xsZXIuZ2V0UG9zKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxlci5zY3JvbGxUbyhwb3MsIGFuaW1hdGUsIHRpbWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GV44KM44GfIExpc3RJdGVtVmlldyDjga7ooajnpLrjgpLkv53oqLxcclxuICAgICAgICBlbnN1cmVWaXNpYmxlKGluZGV4OiBudW1iZXIsIG9wdGlvbnM/OiBFbnN1cmVWaXNpYmxlT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwIHx8IHRoaXMuX2xpbmVzLmxlbmd0aCA8PSBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiZW5zdXJlVmlzaWJsZSgpLCBpbnZhbGlkIGluZGV4LCBub29wLiBbaW5kZXg6IFwiICsgaW5kZXggKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuX3Njcm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJzY3JvbGxlciBpcyBub3QgcmVhZHkuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcy5fbGluZXNbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRPcHRpb25zOiBFbnN1cmVWaXNpYmxlT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWFsT0s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VG9wOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBhbmltYXRlOiB0aGlzLl9zZXR0aW5ncy5lbmFibGVBbmltYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZTogdGhpcy5fc2V0dGluZ3MuYW5pbWF0aW9uRHVyYXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6ICgpOiB2b2lkID0+IHsgLyogbm9vcCAqLyB9LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbjogRW5zdXJlVmlzaWJsZU9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRTY29wZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBmcm9tOiB0aGlzLl9zY3JvbGxlci5nZXRQb3MoKSxcclxuICAgICAgICAgICAgICAgICAgICB0bzogdGhpcy5fc2Nyb2xsZXIuZ2V0UG9zKCkgKyB0aGlzLl9iYXNlSGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldFNjb3BlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZyb206IHRhcmdldC5vZmZzZXQsXHJcbiAgICAgICAgICAgICAgICAgICAgdG86IHRhcmdldC5vZmZzZXQgKyB0YXJnZXQuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc0luU2NvcGUgPSAoKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5wYXJ0aWFsT0spIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFNjb3BlLmZyb20gPD0gY3VycmVudFNjb3BlLmZyb20pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2NvcGUuZnJvbSA8PSB0YXJnZXRTY29wZS50bykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0U2NvcGUuZnJvbSA8PSBjdXJyZW50U2NvcGUudG8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTY29wZS5mcm9tIDw9IHRhcmdldFNjb3BlLmZyb20gJiYgdGFyZ2V0U2NvcGUudG8gPD0gY3VycmVudFNjb3BlLnRvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgZGV0ZWN0UG9zaXRpb24gPSAoKTogbnVtYmVyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0U2NvcGUuZnJvbSA8IGN1cnJlbnRTY29wZS5mcm9tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRTY29wZS5mcm9tO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY3VycmVudFNjb3BlLmZyb20gPCB0YXJnZXRTY29wZS5mcm9tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQub2Zmc2V0IC0gdGFyZ2V0LmhlaWdodDsgLy8gYm90dG9tIOWQiOOCj+OBm+OBr+aDheWgseS4jei2s+OBq+OCiOOCiuS4jeWPr1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImxvZ2ljIGVycm9yLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgcG9zOiBudW1iZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG9wZXJhdGlvbi5zZXRUb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSB0YXJnZXRTY29wZS5mcm9tO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0luU2NvcGUoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG5vb3AuXHJcbiAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9uLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSBkZXRlY3RQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIOijnOato1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcyA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9zY3JvbGxlci5nZXRQb3NNYXgoKSA8IHBvcykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHRoaXMuX3Njcm9sbGVyLmdldFBvc01heCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQob3BlcmF0aW9uLmNhbGxiYWNrLCBvcGVyYXRpb24udGltZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvKHBvcywgb3BlcmF0aW9uLmFuaW1hdGUsIG9wZXJhdGlvbi50aW1lKTtcclxuICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gaW1wbGVtZW50czogSUxpc3RWaWV3RnJhbWV3b3JrOlxyXG5cclxuICAgICAgICAvLyEgU2Nyb2xsIE1hcCDjga7pq5jjgZXjgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxNYXBIZWlnaHQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRtYXAgPyB0aGlzLl9tYXBIZWlnaHQgOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbCBNYXAg44Gu6auY44GV44KS5pu05pawLiBmcmFtZXdvcmsg44GM5L2/55So44GZ44KLLlxyXG4gICAgICAgIHVwZGF0ZVNjcm9sbE1hcEhlaWdodChkZWx0YTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl8kbWFwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBIZWlnaHQgKz0gZGVsdGE7XHJcbiAgICAgICAgICAgICAgICAvLyBmb3IgZmFpbCBzYWZlLlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX21hcEhlaWdodCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXBIZWlnaHQgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fJG1hcC5oZWlnaHQodGhpcy5fbWFwSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWGhemDqCBQcm9maWxlIOOBruabtOaWsC4gZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCiy5cclxuICAgICAgICB1cGRhdGVQcm9maWxlcyhmcm9tOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciwgbjogbnVtYmVyO1xyXG4gICAgICAgICAgICBsZXQgbGFzdDogTGluZVByb2ZpbGU7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IGZyb20sIG4gPSB0aGlzLl9saW5lcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICgwIDwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3QgPSB0aGlzLl9saW5lc1tpIC0gMV07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGluZXNbaV0uaW5kZXggPSBsYXN0LmluZGV4ICsgMTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW5lc1tpXS5vZmZzZXQgPSBsYXN0Lm9mZnNldCArIGxhc3QuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW5lc1tpXS5pbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGluZXNbaV0ub2Zmc2V0ID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbCBNYXAgRWxlbWVudCDjgpLlj5blvpcuIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgosuXHJcbiAgICAgICAgZ2V0U2Nyb2xsTWFwRWxlbWVudCgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJG1hcCB8fCAkKFwiXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODquOCteOCpOOCr+ODq+WPr+iDveOBqiBFbGVtZW50IOOCkuWPluW+ly4gZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCiy5cclxuICAgICAgICBmaW5kUmVjeWNsZUVsZW1lbnRzKCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kbWFwID8gdGhpcy5fJG1hcC5maW5kKF9Db25maWcuUkVDWUNMRV9DTEFTU19TRUxFQ1RPUikgOiAkKFwiXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIExpc3RWaWV3T3B0aW9ucyDjgpLlj5blvpcuIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgosuXHJcbiAgICAgICAgZ2V0TGlzdFZpZXdPcHRpb25zKCk6IExpc3RWaWV3T3B0aW9ucyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXR0aW5ncztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBtZXRob2Q6XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGxlciDnlKjnkrDlooPoqK3lrppcclxuICAgICAgICBwcml2YXRlIHNldFNjcm9sbGVyQ29uZGl0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxlci5vbihcInNjcm9sbFwiLCB0aGlzLl9zY3JvbGxFdmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxlci5vbihcInNjcm9sbHN0b3BcIiwgdGhpcy5fc2Nyb2xsU3RvcEV2ZW50SGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgU2Nyb2xsZXIg55So55Kw5aKD56C05qOEXHJcbiAgICAgICAgcHJpdmF0ZSByZXNldFNjcm9sbGVyQ29uZGl0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxlci5vZmYoXCJzY3JvbGxzdG9wXCIsIHRoaXMuX3Njcm9sbFN0b3BFdmVudEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxlci5vZmYoXCJzY3JvbGxcIiwgdGhpcy5fc2Nyb2xsRXZlbnRIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDml6Llrprjga4gU2Nyb2xsZXIg44Kq44OW44K444Kn44Kv44OI44Gu5L2c5oiQXHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVTY3JvbGxlcigpOiBJU2Nyb2xsZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3Muc2Nyb2xsZXJGYWN0b3J5KHRoaXMuXyRyb290WzBdLCB0aGlzLl9zZXR0aW5ncyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg54++5Zyo44GuIFBhZ2UgSW5kZXgg44KS5Y+W5b6XXHJcbiAgICAgICAgcHJpdmF0ZSBnZXRQYWdlSW5kZXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciwgbjogbnVtYmVyO1xyXG4gICAgICAgICAgICBsZXQgcGFnZTogUGFnZVByb2ZpbGU7XHJcbiAgICAgICAgICAgIGxldCBjYW5kaWRhdGU6IG51bWJlcjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFBvcyA9IHRoaXMuX3Njcm9sbGVyID8gdGhpcy5fc2Nyb2xsZXIuZ2V0UG9zKCkgOiAwO1xyXG4gICAgICAgICAgICBjb25zdCBzY3JvbGxQb3NNYXggPSB0aGlzLl9zY3JvbGxlciA/IHRoaXMuX3Njcm9sbGVyLmdldFBvc01heCgpIDogMDtcclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsTWFwU2l6ZSA9ICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsYXN0UGFnZSA9IHRoaXMuZ2V0TGFzdFBhZ2UoKTtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsICE9IGxhc3RQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RQYWdlLm9mZnNldCArIGxhc3RQYWdlLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Jhc2VIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwb3MgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKDAgPT09IHNjcm9sbFBvc01heCB8fCBzY3JvbGxQb3NNYXggPD0gdGhpcy5fYmFzZUhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2Nyb2xsUG9zICogc2Nyb2xsTWFwU2l6ZSAvIHNjcm9sbFBvc01heDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHZhbGlkUmFuZ2UgPSAoX3BhZ2U6IFBhZ2VQcm9maWxlKTogYm9vbGVhbiA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCA9PSBfcGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoX3BhZ2Uub2Zmc2V0IDw9IHBvcyAmJiBwb3MgPD0gX3BhZ2Uub2Zmc2V0ICsgX3BhZ2UuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9iYXNlSGVpZ2h0IDw9IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJpbnZhbGlkIGJhc2UgaGVpZ2h0OiBcIiArIHRoaXMuX2Jhc2VIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNhbmRpZGF0ZSA9IE1hdGguZmxvb3IocG9zIC8gdGhpcy5fYmFzZUhlaWdodCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9wYWdlcy5sZW5ndGggPD0gY2FuZGlkYXRlKSB7XHJcbiAgICAgICAgICAgICAgICBjYW5kaWRhdGUgPSB0aGlzLl9wYWdlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBwYWdlID0gdGhpcy5fcGFnZXNbY2FuZGlkYXRlXTtcclxuICAgICAgICAgICAgaWYgKHZhbGlkUmFuZ2UocGFnZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYWdlLmluZGV4O1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBvcyA8IHBhZ2Uub2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBjYW5kaWRhdGUgLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2UgPSB0aGlzLl9wYWdlc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRSYW5nZShwYWdlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmtub3duIHBhZ2UgaW5kZXguXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBjYW5kaWRhdGUgKyAxLCBuID0gdGhpcy5fcGFnZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZSA9IHRoaXMuX3BhZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZFJhbmdlKHBhZ2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYWdlLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVua25vd24gcGFnZSBpbmRleC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFnZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44K544Kv44Ot44O844Or44Kk44OZ44Oz44OIXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcG9zIHtOdW1iZXJ9IFtpbl0g44K544Kv44Ot44O844Or44Od44K444K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBvblNjcm9sbChwb3M6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlICYmIDAgPCB0aGlzLl9wYWdlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYWdlSW5kZXggPSB0aGlzLmdldFBhZ2VJbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzog6Kq/5pW0XHJcbiAgICAgICAgICAgICAgICBpZiAoX1V0aWxzLmFicyhwb3MgLSB0aGlzLl9sYXN0QWN0aXZlUGFnZUNvbnRleHQucG9zKSA8IHRoaXMuX3NldHRpbmdzLnNjcm9sbFJlZnJlc2hEaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9sYXN0QWN0aXZlUGFnZUNvbnRleHQuaW5kZXggIT09IGN1cnJlbnRQYWdlSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LnBvcyA9IHBvcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44K544Kv44Ot44O844Or5YGc5q2i44Kk44OZ44Oz44OIXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcG9zIHtOdW1iZXJ9IFtpbl0g44K544Kv44Ot44O844Or44Od44K444K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBvblNjcm9sbFN0b3AocG9zOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZSAmJiAwIDwgdGhpcy5fcGFnZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UGFnZUluZGV4ID0gdGhpcy5nZXRQYWdlSW5kZXgoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9sYXN0QWN0aXZlUGFnZUNvbnRleHQuaW5kZXggIT09IGN1cnJlbnRQYWdlSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RBY3RpdmVQYWdlQ29udGV4dC5wb3MgPSBwb3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmnIDlvozjga7jg5rjg7zjgrjjgpLlj5blvpdcclxuICAgICAgICBwcml2YXRlIGdldExhc3RQYWdlKCk6IFBhZ2VQcm9maWxlIHtcclxuICAgICAgICAgICAgaWYgKDAgPCB0aGlzLl9wYWdlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlc1t0aGlzLl9wYWdlcy5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg5rjg7zjgrjljLrliIbjga7jgqLjgrXjgqTjg7NcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBmcm9tIHtOdW1iZXJ9IFtpbl0gcGFnZSBpbmRleCDjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIGFzc2lnblBhZ2UoZnJvbT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyLCBuOiBudW1iZXI7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IGZyb20pIHtcclxuICAgICAgICAgICAgICAgIGZyb20gPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhclBhZ2UoZnJvbSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGluZUluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgIGxldCBsYXN0UGFnZSA9IHRoaXMuZ2V0TGFzdFBhZ2UoKTtcclxuICAgICAgICAgICAgICAgIGxldCBsYXN0TGluZTogTGluZVByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcFBhZ2U6IFBhZ2VQcm9maWxlO1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgPT0gbGFzdFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZSA9IG5ldyBQYWdlUHJvZmlsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2VzLnB1c2gobGFzdFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0TGluZSA9IGxhc3RQYWdlLmdldExpbmVQcm9maWxlTGFzdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChudWxsICE9IGxhc3RMaW5lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVJbmRleCA9IGxhc3RMaW5lLmluZGV4ICsgMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgYXNpZ25lZSA9IHRoaXMuX2xpbmVzLnNsaWNlKGxpbmVJbmRleCk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwLCBuID0gYXNpZ25lZS5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fYmFzZUhlaWdodCA8PSBsYXN0UGFnZS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2Uubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBQYWdlID0gbGFzdFBhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBQYWdlID0gbmV3IFBhZ2VQcm9maWxlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBQYWdlLmluZGV4ID0gbGFzdFBhZ2UuaW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wUGFnZS5vZmZzZXQgPSBsYXN0UGFnZS5vZmZzZXQgKyBsYXN0UGFnZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlID0gdGVtcFBhZ2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2VzLnB1c2gobGFzdFBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBhc2lnbmVlW2ldLnBhZ2VJbmRleCA9IGxhc3RQYWdlLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlLnB1c2goYXNpZ25lZVtpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0UGFnZS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY3JvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIudXBkYXRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODmuODvOOCuOWMuuWIhuOBruino+mZpFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGZyb20ge051bWJlcn0gW2luXSBwYWdlIGluZGV4IOOCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgY2xlYXJQYWdlKGZyb20/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gZnJvbSkge1xyXG4gICAgICAgICAgICAgICAgZnJvbSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fcGFnZXMgPSB0aGlzLl9wYWdlcy5zbGljZSgwLCBmcm9tKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkxpc3RWaWV3XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgTGlzdFZpZXcg44G444Gu5Yid5pyf5YyW5oOF5aCx44KS5qC857SN44GZ44KL44Kk44Oz44K/44O844OV44Kn44Kk44K544Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbCBleHRlbmRzIEJhY2tib25lLk1vZGVsID0gQmFja2JvbmUuTW9kZWw+XHJcbiAgICAgICAgZXh0ZW5kcyBMaXN0Vmlld09wdGlvbnMsIEJhY2tib25lLlZpZXdPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgICRlbD86IEpRdWVyeTtcclxuICAgICAgICBpbml0aWFsSGVpZ2h0PzogbnVtYmVyOyAgICAvLyE8IOmrmOOBleOBruWIneacn+WApFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIExpc3RWaWV3XHJcbiAgICAgKiBAYnJpZWYg44Oh44Oi44Oq566h55CG5qmf6IO944KS5o+Q5L6b44GZ44KL5Luu5oOz44Oq44K544OI44OT44Ol44O844Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBMaXN0VmlldzxUTW9kZWwgZXh0ZW5kcyBCYWNrYm9uZS5Nb2RlbCA9IEJhY2tib25lLk1vZGVsPlxyXG4gICAgICAgIGV4dGVuZHMgQmFja2JvbmUuVmlldzxUTW9kZWw+IGltcGxlbWVudHMgSUxpc3RWaWV3LCBJQ29tcG9zYWJsZVZpZXcge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9zY3JvbGxNZ3I6IFNjcm9sbE1hbmFnZXIgPSBudWxsOyAgICAvLyE8IHNjcm9sbCDjgrPjgqLjg63jgrjjg4Pjgq9cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9ucz86IExpc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBjb25zdCBvcHQgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IgPSBuZXcgU2Nyb2xsTWFuYWdlcihvcHRpb25zKTtcclxuICAgICAgICAgICAgaWYgKG9wdC4kZWwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlcyA9ICg8YW55PnRoaXMpLmV2ZW50cyA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudChvcHQuJGVsLCBkZWxlZ2F0ZXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gb3B0LmluaXRpYWxIZWlnaHQgfHwgdGhpcy4kZWwuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuaW5pdGlhbGl6ZSh0aGlzLiRlbCwgaGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBPdmVycmlkZTogQmFja2JvbmUuVmlld1xyXG5cclxuICAgICAgICAvLyEg5a++6LGhIGVsZW1lbnQg44Gu6Kit5a6aXHJcbiAgICAgICAgc2V0RWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCwgZGVsZWdhdGU/OiBib29sZWFuKTogQmFja2JvbmUuVmlldzxUTW9kZWw+O1xyXG4gICAgICAgIHNldEVsZW1lbnQoZWxlbWVudDogSlF1ZXJ5LCBkZWxlZ2F0ZT86IGJvb2xlYW4pOiBCYWNrYm9uZS5WaWV3PFRNb2RlbD47XHJcbiAgICAgICAgc2V0RWxlbWVudChlbGVtZW50OiBhbnksIGRlbGVnYXRlPzogYm9vbGVhbik6IEJhY2tib25lLlZpZXc8VE1vZGVsPiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY3JvbGxNZ3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRlbCA9ICQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLmluaXRpYWxpemUoJGVsLCAkZWwuaGVpZ2h0KCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5zZXRFbGVtZW50KGVsZW1lbnQsIGRlbGVnYXRlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnoLTmo4RcclxuICAgICAgICByZW1vdmUoKTogQmFja2JvbmUuVmlldzxUTW9kZWw+IHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgUHJvZmlsZSDnrqHnkIZcclxuXHJcbiAgICAgICAgLy8hIOWIneacn+WMlua4iOOBv+OBi+WIpOWumlxyXG4gICAgICAgIGlzSW5pdGlhbGl6ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuaXNJbml0aWFsaXplZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODl+ODreODkeODhuOCo+OCkuaMh+WumuOBl+OBpuOAgUxpbmVQcm9maWxlIOOCkueuoeeQhlxyXG4gICAgICAgIGFkZEl0ZW0oXHJcbiAgICAgICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgICAgICBpbml0aWFsaXplcjogbmV3IChvcHRpb25zPzogYW55KSA9PiBCYXNlTGlzdEl0ZW1WaWV3LFxyXG4gICAgICAgICAgICBpbmZvOiBhbnksXHJcbiAgICAgICAgICAgIGluc2VydFRvPzogbnVtYmVyXHJcbiAgICAgICAgKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FkZExpbmUobmV3IExpbmVQcm9maWxlKHRoaXMuX3Njcm9sbE1nciwgTWF0aC5mbG9vcihoZWlnaHQpLCBpbml0aWFsaXplciwgaW5mbyksIGluc2VydFRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ8gSXRlbSDjgpLliYrpmaRcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXIsIHNpemU/OiBudW1iZXIsIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXJbXSwgZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xyXG4gICAgICAgIHJlbW92ZUl0ZW0oaW5kZXg6IGFueSwgYXJnMj86IG51bWJlciwgYXJnMz86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVtb3ZlSXRlbShpbmRleCwgYXJnMiwgYXJnMyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIEl0ZW0g44Gr6Kit5a6a44GX44Gf5oOF5aCx44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBudW1iZXIpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBKUXVlcnkuRXZlbnQpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmdldEl0ZW1JbmZvKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Ki44Kv44OG44Kj44OW44Oa44O844K444KS5pu05pawXHJcbiAgICAgICAgcmVmcmVzaCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlZnJlc2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmnKrjgqLjgrXjgqTjg7Pjg5rjg7zjgrjjgpLmp4vnr4lcclxuICAgICAgICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci51cGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5rjg7zjgrjjgqLjgrXjgqTjg7PjgpLlho3mp4vmiJBcclxuICAgICAgICByZWJ1aWxkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVidWlsZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeuoei9hOODh+ODvOOCv+OCkuegtOajhFxyXG4gICAgICAgIHJlbGVhc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9maWxlIEJhY2t1cCAvIFJlc3RvcmVcclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODkOODg+OCr+OCouODg+ODl1xyXG4gICAgICAgIGJhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODquOCueODiOOColxyXG4gICAgICAgIHJlc3RvcmUoa2V5OiBzdHJpbmcsIHJlYnVpbGQ6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IucmVzdG9yZShrZXksIHJlYnVpbGQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruacieeEoVxyXG4gICAgICAgIGhhc0JhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmhhc0JhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruegtOajhFxyXG4gICAgICAgIGNsZWFyQmFja3VwKGtleT86IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmNsZWFyQmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gr44Ki44Kv44K744K5XHJcbiAgICAgICAgZ2V0IGJhY2t1cERhdGEoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nciA/IHRoaXMuX3Njcm9sbE1nci5iYWNrdXBEYXRhIDogbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IFNjcm9sbFxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or44Kk44OZ44Oz44OI44OP44Oz44OJ44Op6Kit5a6aL+ino+mZpFxyXG4gICAgICAgIHNldFNjcm9sbEhhbmRsZXIoaGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQsIG9uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zZXRTY3JvbGxIYW5kbGVyKGhhbmRsZXIsIG9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vntYLkuobjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgc2V0U2Nyb2xsU3RvcEhhbmRsZXIoaGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQsIG9uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyLCBvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuZ2V0U2Nyb2xsUG9zKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44Gu5pyA5aSn5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zTWF4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuZ2V0U2Nyb2xsUG9zTWF4KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5oyH5a6aXHJcbiAgICAgICAgc2Nyb2xsVG8ocG9zOiBudW1iZXIsIGFuaW1hdGU/OiBib29sZWFuLCB0aW1lPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5zY3JvbGxUbyhwb3MsIGFuaW1hdGUsIHRpbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBleOCjOOBnyBMaXN0SXRlbVZpZXcg44Gu6KGo56S644KS5L+d6Ki8XHJcbiAgICAgICAgZW5zdXJlVmlzaWJsZShpbmRleDogbnVtYmVyLCBvcHRpb25zPzogRW5zdXJlVmlzaWJsZU9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLmVuc3VyZVZpc2libGUoaW5kZXgsIG9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgUHJvcGVydGllc1xyXG5cclxuICAgICAgICAvLyEgY29yZSBmcmFtZXdvcmsgYWNjZXNzXHJcbiAgICAgICAgZ2V0IGNvcmUoKTogSUxpc3RWaWV3RnJhbWV3b3JrIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1ncjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IEludGVybmFsIEkvRlxyXG5cclxuICAgICAgICAvLyEg55m76YyyIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgotcclxuICAgICAgICBfYWRkTGluZShfbGluZTogYW55LCBpbnNlcnRUbz86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuX2FkZExpbmUoX2xpbmUsIGluc2VydFRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUNvbXBvc2FibGVWaWV3XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOBmeOBp+OBq+Wumue+qeOBleOCjOOBnyBCYWNrYm9uZS5WaWV3IOOCkuWfuuW6leOCr+ODqeOCueOBq+ioreWumuOBl+OAgWV4dGVuZCDjgpLlrp/ooYzjgZnjgovjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkZXJpdmVzICAgICAgICAge0JhY2tib25lLlZpZXd8QmFja2JvbmUuVmlld1tdfSBbaW5dIOWQiOaIkOWFg+OBriBWaWV3IOOCr+ODqeOCuVxyXG4gICAgICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgICAge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHByb3RvdHlwZSDjg5fjg63jg5Hjg4bjgqNcclxuICAgICAgICAgKiBAcGFyYW0gY2xhc3NQcm9wZXJ0aWVzIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgW2luXSBzdGF0aWMg44OX44Ot44OR44OG44KjXHJcbiAgICAgICAgICogQHJldHVybiB7QmFja2JvbmUuVmlld3xCYWNrYm9uZS5WaWV3W119IOaWsOimj+OBq+eUn+aIkOOBleOCjOOBnyBWaWV3IOOBruOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBjb21wb3NlKGRlcml2ZXM6IFZpZXdDb25zdHJ1Y3RvciB8IFZpZXdDb25zdHJ1Y3RvcltdLCBwcm9wZXJ0aWVzOiBhbnksIGNsYXNzUHJvcGVydGllcz86IGFueSk6IFZpZXdDb25zdHJ1Y3RvciB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvc2VkOiBhbnkgPSBjb21wb3NlVmlld3MoTGlzdFZpZXcsIGRlcml2ZXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZWQuZXh0ZW5kKHByb3BlcnRpZXMsIGNsYXNzUHJvcGVydGllcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5Hcm91cExpc3RJdGVtVmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEdyb3VwTGlzdEl0ZW1WaWV3T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIEdyb3VwTGlzdEl0ZW1WaWV3IOOBruOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEdyb3VwTGlzdEl0ZW1WaWV3T3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBCYWNrYm9uZS5Nb2RlbCA9IEJhY2tib25lLk1vZGVsPiBleHRlbmRzIExpc3RJdGVtVmlld09wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgZ3JvdXBQcm9maWxlPzogR3JvdXBQcm9maWxlOyAgICAvLyE8IEdyb3VwUHJvZmlsZSDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBHcm91cExpc3RJdGVtVmlld1xyXG4gICAgICogQGJyaWVmIEV4cGFuZGFibGVMaXN0VmlldyDjgYzmibHjgYYgTGlzdEl0ZW0g44Kz44Oz44OG44OK44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBHcm91cExpc3RJdGVtVmlldzxUTW9kZWwgZXh0ZW5kcyBCYWNrYm9uZS5Nb2RlbCA9IEJhY2tib25lLk1vZGVsPiBleHRlbmRzIExpc3RJdGVtVmlldzxUTW9kZWw+IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfZ3JvdXBQcm9maWxlOiBHcm91cFByb2ZpbGUgPSBudWxsOyAgICAvLyE8IOeuoei9hOOBriBHcm91cFByb2ZpbGVcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtHcm91cExpbmVWaWV3T3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBHcm91cExpc3RJdGVtVmlld09wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5fZ3JvdXBQcm9maWxlID0gb3B0aW9ucy5ncm91cFByb2ZpbGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByb3RlY3RlZCBtZXRob2RzXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWxlemWi+eKtuaFi+OCkuWIpOWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5bGV6ZaLLCBmYWxzZTrlj47mnZ9cclxuICAgICAgICAgKi9cclxuICAgICAgICBwcm90ZWN0ZWQgaXNFeHBhbmRlZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwUHJvZmlsZS5pc0V4cGFuZGVkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5bGV6ZaL5Lit44GL5Yik5a6aXHJcbiAgICAgICAgcHJvdGVjdGVkIGlzRXhwYW5kaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKDxCYXNlRXhwYW5kYWJsZUxpc3RWaWV3PnRoaXMub3duZXIpLmlzRXhwYW5kaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5Y+O5p2f5Lit44GL5Yik5a6aXHJcbiAgICAgICAgcHJvdGVjdGVkIGlzQ29sbGFwc2luZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICg8QmFzZUV4cGFuZGFibGVMaXN0Vmlldz50aGlzLm93bmVyKS5pc0NvbGxhcHNpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDplovplonkuK3jgYvliKTlrppcclxuICAgICAgICBwcm90ZWN0ZWQgaXNTd2l0Y2hpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoPEJhc2VFeHBhbmRhYmxlTGlzdFZpZXc+dGhpcy5vd25lcikuaXNTd2l0Y2hpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlrZAgR3JvdXAg44KS5oyB44Gj44Gm44GE44KL44GL5Yik5a6aXHJcbiAgICAgICAgcHJvdGVjdGVkIGhhc0NoaWxkcmVuKGxheW91dEtleT86IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ3JvdXBQcm9maWxlLmhhc0NoaWxkcmVuKGxheW91dEtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2UgKi9cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5FeHBhbmRNYW5hZ2VyXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBFeHBhbmRNYW5hZ2VyXHJcbiAgICAgKiBAYnJpZWYg6ZaL6ZaJ54q25oWL566h55CG44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBFeHBhbmRNYW5hZ2VyIGltcGxlbWVudHMgSUV4cGFuZE1hbmFnZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9vd25lcjogQmFzZUV4cGFuZGFibGVMaXN0VmlldyA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfbWFwR3JvdXBzOiBPYmplY3QgPSB7fTsgICAgICAgICAgICAgICAgLy8hPCB7aWQsIEdyb3VwUHJvZmlsZX0g44GuIG1hcFxyXG4gICAgICAgIHByaXZhdGUgX2FyeVRvcEdyb3VwczogR3JvdXBQcm9maWxlW10gPSBbXTsgICAgIC8vITwg56ysMemajuWxpCBHcm91cFByb2ZpbGUg44KS5qC857SNXHJcbiAgICAgICAgcHJpdmF0ZSBfbGF5b3V0S2V5OiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG93bmVyIHtCYXNlRXhwYW5kYWJsZUxpc3RWaWV3fSBbaW5dIOimqlZpZXcg44Gu44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3duZXI6IEJhc2VFeHBhbmRhYmxlTGlzdFZpZXcpIHtcclxuICAgICAgICAgICAgdGhpcy5fb3duZXIgPSBvd25lcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUV4cGFuZE1hbmFnZXJcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5paw6KaPIEdyb3VwUHJvZmlsZSDjgpLkvZzmiJBcclxuICAgICAgICAgKiDnmbvpjLLmuIjjgb/jga7loLTlkIjjga/jgZ3jga7jgqrjg5bjgrjjgqfjgq/jg4jjgpLov5TljbRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJtYSBpZCB7U3RyaW5nfSBbaW5dIOaWsOimj+OBq+S9nOaIkOOBmeOCiyBHcm91cCBJRCDjgpLmjIflrpouIOaMh+WumuOBl+OBquOBhOWgtOWQiOOBr+iHquWLleWJsuOCiuaMr+OCilxyXG4gICAgICAgICAqIEByZXR1cm4ge0dyb3VwUHJvZmlsZX0gR3JvdXBQcm9maWxlIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG5ld0dyb3VwKGlkPzogc3RyaW5nKTogR3JvdXBQcm9maWxlIHtcclxuICAgICAgICAgICAgbGV0IGdyb3VwOiBHcm91cFByb2ZpbGU7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IGlkKSB7XHJcbiAgICAgICAgICAgICAgICBpZCA9IFwiZ3JvdXAtaWQ6XCIgKyAoXCIwMDAwXCIgKyAoTWF0aC5yYW5kb20oKSAqIE1hdGgucG93KDM2LCA0KSA8PCAwKS50b1N0cmluZygzNikpLnNsaWNlKC00KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9tYXBHcm91cHNbaWRdKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFwR3JvdXBzW2lkXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBncm91cCA9IG5ldyBHcm91cFByb2ZpbGUoaWQsIHRoaXMuX293bmVyKTtcclxuICAgICAgICAgICAgdGhpcy5fbWFwR3JvdXBzW2lkXSA9IGdyb3VwO1xyXG4gICAgICAgICAgICByZXR1cm4gZ3JvdXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnmbvpjLLmuIjjgb8gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFybWEgaWQge1N0cmluZ30gW2luXSDlj5blvpfjgZnjgosgR3JvdXAgSUQg44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiB7R3JvdXBQcm9maWxlfSBHcm91cFByb2ZpbGUg44Kk44Oz44K544K/44Oz44K5IC8gbnVsbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldEdyb3VwKGlkOiBzdHJpbmcpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9tYXBHcm91cHNbaWRdKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJncm91cCBpZDogXCIgKyBpZCArIFwiIGlzIG5vdCByZWdpc3RlcmVkLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXBHcm91cHNbaWRdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog56ysMemajuWxpOOBriBHcm91cCDnmbvpjLJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB0b3BHcm91cCB7R3JvdXBQcm9maWxlfSBbaW5dIOani+eviea4iOOBvyBHcm91cFByb2ZpbGUg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVnaXN0ZXJUb3BHcm91cCh0b3BHcm91cDogR3JvdXBQcm9maWxlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBsYXN0R3JvdXA6IEdyb3VwUHJvZmlsZTtcclxuICAgICAgICAgICAgbGV0IGluc2VydFRvOiBudW1iZXI7XHJcblxyXG4gICAgICAgICAgICAvLyDjgZnjgafjgavnmbvpjLLmuIjjgb/jga7loLTlkIjjga8gcmVzdG9yZSDjgZfjgaYgbGF5b3V0IOOCreODvOOBlOOBqOOBq+W+qeWFg+OBmeOCi+OAglxyXG4gICAgICAgICAgICBpZiAoXCJyZWdpc3RlcmVkXCIgPT09IHRvcEdyb3VwLnN0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogb3JpZW50YXRpb24gY2hhbmdlZCDmmYLjga4gbGF5b3V0IOOCreODvOWkieabtOWvvuW/nOOBoOOBjOOAgeOCreODvOOBq+WkieabtOOBjOeEoeOBhOOBqOOBjeOBr+S4jeWFt+WQiOOBqOOBquOCi+OAglxyXG4gICAgICAgICAgICAgICAgLy8g44GT44GuIEFQSSDjgavlrp/oo4XjgYzlv4XopoHjgYvjgoLlkKvjgoHjgabopovnm7TjgZfjgYzlv4XopoFcclxuICAgICAgICAgICAgICAgIHRvcEdyb3VwLnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGFzdEdyb3VwID0gKDAgPCB0aGlzLl9hcnlUb3BHcm91cHMubGVuZ3RoKSA/IHRoaXMuX2FyeVRvcEdyb3Vwc1t0aGlzLl9hcnlUb3BHcm91cHMubGVuZ3RoIC0gMV0gOiBudWxsO1xyXG4gICAgICAgICAgICBpbnNlcnRUbyA9IChudWxsICE9IGxhc3RHcm91cCkgPyBsYXN0R3JvdXAuZ2V0TGFzdExpbmVJbmRleCh0cnVlKSArIDEgOiAwO1xyXG4gICAgICAgICAgICBpZiAoXy5pc05hTihpbnNlcnRUbykpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJsb2dpYyBlcnJvciwgJ2luc2VydFRvJyBpcyBOYU4uXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9hcnlUb3BHcm91cHMucHVzaCh0b3BHcm91cCk7XHJcbiAgICAgICAgICAgIHRvcEdyb3VwLnJlZ2lzdGVyKGluc2VydFRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOesrDHpmo7lsaTjga4gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgICog44Kz44OU44O86YWN5YiX44GM6L+U44GV44KM44KL44Gf44KB44CB44Kv44Op44Kk44Ki44Oz44OI44Gv44Kt44Oj44OD44K344Ol5LiN5Y+vXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtHcm91cFByb2ZpbGVbXX0gR3JvdXBQcm9maWxlIOmFjeWIl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldFRvcEdyb3VwcygpOiBHcm91cFByb2ZpbGVbXSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hcnlUb3BHcm91cHMuc2xpY2UoMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5bGV6ZaLICgx6ZqO5bGkKVxyXG4gICAgICAgIGV4cGFuZEFsbCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fYXJ5VG9wR3JvdXBzLmZvckVhY2goKGdyb3VwOiBHcm91cFByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChncm91cC5oYXNDaGlsZHJlbigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuZXhwYW5kKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOBmeOBueOBpuOBruOCsOODq+ODvOODl+OCkuWPjuadnyAoMemajuWxpClcclxuICAgICAgICBjb2xsYXBzZUFsbChkZWxheT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9hcnlUb3BHcm91cHMuZm9yRWFjaCgoZ3JvdXA6IEdyb3VwUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwLmhhc0NoaWxkcmVuKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5jb2xsYXBzZShkZWxheSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWxlemWi+S4reOBi+WIpOWumlxyXG4gICAgICAgIGlzRXhwYW5kaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXIuaXNTdGF0dXNJbihcImV4cGFuZGluZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlj47mnZ/kuK3jgYvliKTlrppcclxuICAgICAgICBpc0NvbGxhcHNpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lci5pc1N0YXR1c0luKFwiY29sbGFwc2luZ1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDplovplonkuK3jgYvliKTlrppcclxuICAgICAgICBpc1N3aXRjaGluZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNFeHBhbmRpbmcoKSB8fCB0aGlzLmlzQ29sbGFwc2luZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruOCpOODs+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgIHN0YXR1c0FkZFJlZihzdGF0dXM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lci5zdGF0dXNBZGRSZWYoc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jg4fjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICBzdGF0dXNSZWxlYXNlKHN0YXR1czogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyLnN0YXR1c1JlbGVhc2Uoc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlh6bnkIbjgrnjgrPjg7zjg5fmr47jgavnirbmhYvlpInmlbDjgpLoqK3lrppcclxuICAgICAgICBzdGF0dXNTY29wZShzdGF0dXM6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fb3duZXIuc3RhdHVzU2NvcGUoc3RhdHVzLCBjYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44Gf54q25oWL5Lit44Gn44GC44KL44GL56K66KqNXHJcbiAgICAgICAgaXNTdGF0dXNJbihzdGF0dXM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXIuaXNTdGF0dXNJbihzdGF0dXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGxheW91dCBrZXkg44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0IGxheW91dEtleSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGF5b3V0S2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGxheW91dCBrZXkg44KS6Kit5a6aXHJcbiAgICAgICAgc2V0IGxheW91dEtleShrZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9sYXlvdXRLZXkgPSBrZXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OH44O844K/44KS56C05qOEXHJcbiAgICAgICAgcmVsZWFzZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fbWFwR3JvdXBzID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuX2FyeVRvcEdyb3VwcyA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRlczogSUJhY2t1cFJlc3RvcmVcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5YaF6YOo44OH44O844K/44KS44OQ44OD44Kv44Ki44OD44OXXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ga2V5IHtTdHJpbmd9IFtpbl0g44OQ44OD44Kv44Ki44OD44OX44Kt44O844KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5oiQ5YqfIC8gZmFsc2U6IOWkseaVl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBjb25zdCBfYmFja3VwID0gdGhpcy5iYWNrdXBEYXRhO1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBfYmFja3VwW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIF9iYWNrdXBba2V5XSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBtYXA6IHRoaXMuX21hcEdyb3VwcyxcclxuICAgICAgICAgICAgICAgICAgICB0b3BzOiB0aGlzLl9hcnlUb3BHcm91cHMsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5YaF6YOo44OH44O844K/44KS44Oq44K544OI44KiXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ga2V5ICAgICB7U3RyaW5nfSAgW2luXSDjg5Djg4Pjgq/jgqLjg4Pjg5fjgq3jg7zjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gcmVidWlsZCB7Qm9vbGVhbn0gW2luXSByZWJ1aWxkIOOCkuWun+ihjOOBmeOCi+WgtOWQiOOBryB0cnVlIOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaIkOWKnyAvIGZhbHNlOiDlpLHmlZdcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXN0b3JlKGtleTogc3RyaW5nLCByZWJ1aWxkOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBjb25zdCBfYmFja3VwID0gdGhpcy5iYWNrdXBEYXRhO1xyXG5cclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gX2JhY2t1cFtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKDAgPCB0aGlzLl9hcnlUb3BHcm91cHMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fbWFwR3JvdXBzID0gX2JhY2t1cFtrZXldLm1hcDtcclxuICAgICAgICAgICAgdGhpcy5fYXJ5VG9wR3JvdXBzID0gX2JhY2t1cFtrZXldLnRvcHM7XHJcblxyXG4gICAgICAgICAgICAvLyBsYXlvdXQg5oOF5aCx44Gu56K66KqNXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hcnlUb3BHcm91cHMubGVuZ3RoIDw9IDAgfHwgIXRoaXMuX2FyeVRvcEdyb3Vwc1swXS5oYXNMYXlvdXRLZXlPZih0aGlzLmxheW91dEtleSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g5bGV6ZaL44GX44Gm44GE44KL44KC44Gu44KS55m76YyyXHJcbiAgICAgICAgICAgIHRoaXMuX2FyeVRvcEdyb3Vwcy5mb3JFYWNoKChncm91cDogR3JvdXBQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBncm91cC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8g5YaN5qeL56+J44Gu5LqI57SEXHJcbiAgICAgICAgICAgIGlmIChyZWJ1aWxkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vd25lci5yZWJ1aWxkKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruacieeEoVxyXG4gICAgICAgIGhhc0JhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXIuaGFzQmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gu56C05qOEXHJcbiAgICAgICAgY2xlYXJCYWNrdXAoa2V5Pzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lci5jbGVhckJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBq+OCouOCr+OCu+OCuVxyXG4gICAgICAgIGdldCBiYWNrdXBEYXRhKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lci5iYWNrdXBEYXRhO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuRXhwYW5kYWJsZUxpc3RWaWV3XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBFeHBhbmRhYmxlTGlzdFZpZXdcclxuICAgICAqIEBicmllZiDplovplonmqZ/og73jgpLlgpnjgYjjgZ/ku67mg7Pjg6rjgrnjg4jjg5Pjg6Xjg7zjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEV4cGFuZGFibGVMaXN0VmlldzxUTW9kZWwgZXh0ZW5kcyBCYWNrYm9uZS5Nb2RlbCA9IEJhY2tib25lLk1vZGVsPlxyXG4gICAgICAgIGV4dGVuZHMgTGlzdFZpZXc8VE1vZGVsPiBpbXBsZW1lbnRzIElFeHBhbmRhYmxlTGlzdFZpZXcge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9zdGF0dXNNZ3I6IFN0YXR1c01hbmFnZXIgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX2V4cGFuZE1hbmFnZXI6IEV4cGFuZE1hbmFnZXIgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0xpc3RWaWV3Q29uc3RydWN0T3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihvcHRpb25zPzogTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1c01nciA9IG5ldyBTdGF0dXNNYW5hZ2VyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIgPSBuZXcgRXhwYW5kTWFuYWdlcih0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUV4cGFuZGFibGVMaXN0Vmlld1xyXG5cclxuICAgICAgICAvLyEg5paw6KaPIEdyb3VwUHJvZmlsZSDjgpLkvZzmiJBcclxuICAgICAgICBuZXdHcm91cChpZD86IHN0cmluZyk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLm5ld0dyb3VwKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnmbvpjLLmuIjjgb8gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0R3JvdXAoaWQ6IHN0cmluZyk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmdldEdyb3VwKGlkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrKwx6ZqO5bGk44GuIEdyb3VwIOeZu+mMslxyXG4gICAgICAgIHJlZ2lzdGVyVG9wR3JvdXAodG9wR3JvdXA6IEdyb3VwUHJvZmlsZSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlZ2lzdGVyVG9wR3JvdXAodG9wR3JvdXApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOesrDHpmo7lsaTjga4gR3JvdXAg44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0VG9wR3JvdXBzKCk6IEdyb3VwUHJvZmlsZVtdIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuZ2V0VG9wR3JvdXBzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5bGV6ZaLICgx6ZqO5bGkKVxyXG4gICAgICAgIGV4cGFuZEFsbCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5leHBhbmRBbGwoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgZnjgbnjgabjga7jgrDjg6vjg7zjg5fjgpLlj47mnZ8gKDHpmo7lsaQpXHJcbiAgICAgICAgY29sbGFwc2VBbGwoZGVsYXk/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5jb2xsYXBzZUFsbChkZWxheSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5bGV6ZaL5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNFeHBhbmRpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmlzRXhwYW5kaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5Y+O5p2f5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNDb2xsYXBzaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5pc0NvbGxhcHNpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDplovplonkuK3jgYvliKTlrppcclxuICAgICAgICBpc1N3aXRjaGluZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuaXNTd2l0Y2hpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jgqTjg7Pjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICBzdGF0dXNBZGRSZWYoc3RhdHVzOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzTWdyLnN0YXR1c0FkZFJlZihzdGF0dXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruODh+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgIHN0YXR1c1JlbGVhc2Uoc3RhdHVzOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzTWdyLnN0YXR1c1JlbGVhc2Uoc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlh6bnkIbjgrnjgrPjg7zjg5fmr47jgavnirbmhYvlpInmlbDjgpLoqK3lrppcclxuICAgICAgICBzdGF0dXNTY29wZShzdGF0dXM6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzTWdyLnN0YXR1c1Njb3BlKHN0YXR1cywgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBl+OBn+eKtuaFi+S4reOBp+OBguOCi+OBi+eiuuiqjVxyXG4gICAgICAgIGlzU3RhdHVzSW4oc3RhdHVzOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1c01nci5pc1N0YXR1c0luKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgbGF5b3V0IGtleSDjgpLlj5blvpdcclxuICAgICAgICBnZXQgbGF5b3V0S2V5KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmxheW91dEtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBsYXlvdXQga2V5IOOCkuioreWumlxyXG4gICAgICAgIHNldCBsYXlvdXRLZXkoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5sYXlvdXRLZXkgPSBrZXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBMaXN0Vmlld1xyXG5cclxuICAgICAgICAvLyEg44OH44O844K/44KS56C05qOEXHJcbiAgICAgICAgcmVsZWFzZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3VwZXIucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlbGVhc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg5Djg4Pjgq/jgqLjg4Pjg5dcclxuICAgICAgICBiYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuYmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44Oq44K544OI44KiXHJcbiAgICAgICAgcmVzdG9yZShrZXk6IHN0cmluZywgcmVidWlsZDogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIucmVzdG9yZShrZXksIHJlYnVpbGQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=