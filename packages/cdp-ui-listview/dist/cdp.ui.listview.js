/*!
 * cdp.ui.listview.js 2.1.0
 *
 * Date: 2018-04-23T06:44:20.760Z
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvSW50ZXJmYWNlcy50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvQ29uZmlnLnRzIiwiY2RwOi8vL0NEUC9VSS9saXN0dmlldy9VdGlscy50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvU3RhdHVzTWFuYWdlci50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvTGluZVByb2ZpbGUudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L1BhZ2VQcm9maWxlLnRzIiwiY2RwOi8vL0NEUC9VSS9saXN0dmlldy9Hcm91cFByb2ZpbGUudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L1Njcm9sbGVyRWxlbWVudC50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvU2Nyb2xsZXJOYXRpdmUudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L1Njcm9sbGVySVNjcm9sbC50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvTGlzdEl0ZW1WaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9saXN0dmlldy9TY3JvbGxNYW5hZ2VyLnRzIiwiY2RwOi8vL0NEUC9VSS9saXN0dmlldy9MaXN0Vmlldy50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvR3JvdXBMaXN0SXRlbVZpZXcudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L0V4cGFuZE1hbmFnZXIudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L0V4cGFuZGFibGVMaXN0Vmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnQ0FBZ0M7QUFDaEMsa0NBQWtDO0FDRGxDLElBQVUsR0FBRyxDQW1CWjtBQW5CRCxXQUFVLEdBQUc7SUFBQyxNQUFFLENBbUJmO0lBbkJhLGFBQUU7UUFDWjs7O1dBR0c7UUFDSCxJQUFjLG9CQUFvQixDQWFqQztRQWJELFdBQWMsb0JBQW9CO1lBQ25CLGtDQUFhLEdBQWtCLHFCQUFxQixDQUFDO1lBQ3JELHFDQUFnQixHQUFl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QU0sR0FBTixVQUFPLEdBQVc7Z0JBQ2QsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQyxDQUFDO1lBRUQsY0FBYztZQUNkLG9DQUFPLEdBQVAsVUFBUSxHQUFXLEVBQUUsT0FBdUI7Z0JBQXZCLHdDQUF1QjtnQkFDeEMsT0FBTyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDckQsQ0FBQztZQUNMLHlCQUFDO1FBQUQsQ0FBQyxDQWhIVyxXQUFRLEdBZ0huQjtRQWpIWSxxQkFBa0IscUJBaUg5QjtJQUNMLENBQUMsRUExSGEsRUFBRSxHQUFGLE1BQUUsS0FBRixNQUFFLFFBMEhmO0FBQUQsQ0FBQyxFQTFIUyxHQUFHLEtBQUgsR0FBRyxRQTBIWiIsInNvdXJjZXNDb250ZW50IjpbIi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwianF1ZXJ5XCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJiYWNrYm9uZVwiIC8+XHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgTGlzdFZpZXdPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgTGlzdFZpZXcg44Gu5Yid5pyf5YyW5oOF5aCx44KS5qC857SN44GZ44KL44Kk44Oz44K/44O844OV44Kn44Kk44K544Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgTGlzdFZpZXdPcHRpb25zIHtcclxuICAgICAgICAvLyEg5L2/55So44GZ44KLIElTY3JvbGxlciDjgpLlpInmm7TjgZnjgovloLTlkIjjgavmjIflrpogIFtkZWZhdWx0OiBTY3JvbGxlck5hdGl2ZS5nZXRGYWN0b3J5KCldXHJcbiAgICAgICAgc2Nyb2xsZXJGYWN0b3J5PzogKGVsZW1lbnQ6IGFueSwgb3B0aW9uczogTGlzdFZpZXdPcHRpb25zKSA9PiBJU2Nyb2xsZXI7XHJcbiAgICAgICAgZW5hYmxlSGlkZGVuUGFnZT86IGJvb2xlYW47ICAgICAgICAgLy8hPCBwbGVsb2FkIOWvvuixoeOCkiB2aXNpYmlsaXR5OiBcImhpZGRlblwiIOOBq+OBmeOCi+WgtOWQiOOBryB0cnVlLiAgICAgICAgICAgICAgICBbZGVmYXVsdDogZmFsc2VdXHJcbiAgICAgICAgZW5hYmxlVHJhbnNmb3JtT2Zmc2V0PzogYm9vbGVhbjsgICAgLy8hPCBsaXN0IGl0ZW0g44GuIG9mZnNldCDjgpIgdHJhbnNmb3JtIOOBp+ioreWumuOBmeOCiyAo44GC44G+44KK44KI44GP44Gq44GEKSAgICAgICAgICBbZGVmYXVsdDogZmFsc2VdXHJcbiAgICAgICAgc2Nyb2xsTWFwUmVmcmVzaEludGVydmFsPzogbnVtYmVyOyAgLy8hPCBzY3JvbGwgbWFwIOmgmOWfn+OBruabtOaWsOeiuuiqjemWk+malC4gaXNjcm9sbCDnrYnjgIHpnZ4gRE9NIOaTjeS9nOaZguOBq+S9v+eUqCAgICAgICAgW2RlZmF1bHQ6IDIwMF1cclxuICAgICAgICBzY3JvbGxSZWZyZXNoRGlzdGFuY2U/OiBudW1iZXI7ICAgICAvLyE8IExpc3RWaWV3IOabtOaWsOWHpueQhuOCkuihjOOBhiBzY3JvbGwg56e75YuV6YePICjjgqLjg6vjgrTjg6rjgrrjg6Dopovnm7TjgZfjgoLoppbph44pICAgICAgW2RlZmF1bHQ6IDIwMF1cclxuICAgICAgICBwYWdlUHJlcGFyZUNvdW50PzogbnVtYmVyOyAgICAgICAgICAvLyE8IOihqOekuumgmOWfn+WkluOBp+WujOWFqOOBqueKtuaFi+OBp+i/veWKoOOBleOCjOOCiyBwYWdlIOaVsCAo5YmN5pa544O75b6M5pa55ZCI44KP44Gb44GmIDLlgI0pICAgW2RlZmF1bHQ6IDNdXHJcbiAgICAgICAgcGFnZVByZWxvYWRDb3VudD86IG51bWJlcjsgICAgICAgICAgLy8hPCDooajnpLrpoJjln5/lpJbjgacgaGlkZGVuIOeKtuaFi+OBp+i/veWKoOOBleOCjOOCiyBwYWdlIOaVsCAo5YmN5pa544O75b6M5pa55ZCI44KP44Gb44GmIDLlgI0pIFtkZWZhdWx0OiAxXVxyXG4gICAgICAgIGVuYWJsZUFuaW1hdGlvbj86IGJvb2xlYW47ICAgICAgICAgIC8vITwg44Ki44OL44Oh44O844K344On44Oz44KS5pyJ5Yq544Gr44GZ44KL5aC05ZCI44GvIHRydWUuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZGVmYXVsdDogdHJ1ZV1cclxuICAgICAgICBhbmltYXRpb25EdXJhdGlvbj86IG51bWJlcjsgICAgICAgICAvLyE8IOOCouODi+ODoeODvOOCt+ODp+ODs+OBruiyu+OChOOBmeaZgumWkyAobXNlYykgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2RlZmF1bHQ6IDBdXHJcbiAgICAgICAgYmFzZURlcHRoPzogc3RyaW5nOyAgICAgICAgICAgICAgICAgLy8hPCDln7rmupbjgajjgZnjgosgei1pbmRleC4gXCJjb2xsYXBzZVwiIOaZguOBruOCouODi+ODoeODvOOCt+ODp+ODs+aZguOBq+S9v+eUqCAgICAgICAgICAgICBbZGVmYXVsdDogYXV0b11cclxuICAgICAgICBpdGVtVGFnTmFtZT86IHN0cmluZzsgICAgICAgICAgICAgICAvLyE8IExpc3RJdGVtVmlldyDjgYzkvb/nlKjjgZnjgovjgr/jgrDlkI0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkZWZhdWx0OiBsaV1cclxuICAgICAgICByZW1vdmVJdGVtV2l0aFRyYW5zaXRpb24/OiBib29sZWFuOyAvLyE8IHJlbW92ZUl0ZW0oKSDmmYLjgavlv4XopoHjgavlv5zjgZjjgaboh6rli5XjgacgdHJhbnNpdGlvbiDjgpLjgYvjgZHjgovloLTlkIjjga8gdHJ1ZSAgICBbZGVmYXVsdDogdHJ1ZV1cclxuICAgICAgICAvLyEg6Z2e44Ki44Kv44OG44Kj44OW44GqIHNjcm9sbCBtYXAg44Gr5a++44GX44GmIER1bW15IOOCkuS9v+eUqOOBmeOCi+WgtOWQiOOBryB0cnVlLiAoZmxpcHNuYXAg5YiH44KK5pu/44GI5pmC562JLiDlirnmnpzjga/jgYLjgb7jgorjgarjgZcpICBbZGVmYXVsdDogZmFsc2VdXHJcbiAgICAgICAgdXNlRHVtbXlJbmFjdGl2ZVNjcm9sbE1hcD86IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSUxpc3RWaWV3RnJhbWV3b3JrXHJcbiAgICAgKiBAYnJpZWYgTGlzdFZpZXcgRnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCi+OCpOODs+OCv+ODvOODleOCp+OCpOOCueWumue+qVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElMaXN0Vmlld0ZyYW1ld29yayB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2Nyb2xsIE1hcCDjga7pq5jjgZXjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0g54++5Zyo44Gu6auY44GVIFtweF1cclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRTY3JvbGxNYXBIZWlnaHQoKTogbnVtYmVyO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTY3JvbGwgTWFwIOOBrumrmOOBleOCkuabtOaWsFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRlbHRlIHtOdW1iZXJ9IFtpbl0g5aSJ5YyW6YeP44KS5oyH5a6aXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdXBkYXRlU2Nyb2xsTWFwSGVpZ2h0KGRlbHRhOiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlhoXpg6ggUHJvZmlsZSDjga7mm7TmlrBcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBmcm9tIHtOdW1iZXJ9IFtpbl0g5pu05paw6ZaL5aeL44Kk44Oz44OH44OD44Kv44K544KS5oyH5a6aXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdXBkYXRlUHJvZmlsZXMoZnJvbTogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2Nyb2xsIE1hcCBFbGVtZW50IOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7alF1ZXJ5fSBzY3JvbGwgbWFwIGVsZW1lbnRcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRTY3JvbGxNYXBFbGVtZW50KCk6IEpRdWVyeTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Oq44K144Kk44Kv44Or5Y+v6IO944GqIEVsZW1lbnQg44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtqUXVlcnl9IHJlY3ljbGUgZWxlbWVudHNcclxuICAgICAgICAgKi9cclxuICAgICAgICBmaW5kUmVjeWNsZUVsZW1lbnRzKCk6IEpRdWVyeTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTGlzdFZpZXdPcHRpb25zIOOCkuWPluW+l1xyXG4gICAgICAgICAqIOOBmeOBueOBpuOBruODl+ODreODkeODhuOCo+OCouOCr+OCu+OCueOCkuS/neiovOOBmeOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7TGlzdFZpZXdPcHRpb25zfSBvcHRpb24g44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0TGlzdFZpZXdPcHRpb25zKCk6IExpc3RWaWV3T3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJU2Nyb2xsZXJcclxuICAgICAqIEBicmllZiBTY3JvbGxlciDjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU2Nyb2xsZXIge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNjcm9sbGVyIOOBruWei+aDheWgseOCkuWPluW+l1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldFR5cGUoKTogc3RyaW5nO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwb3NpdGlvbiDlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0gOiBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldFBvcygpOiBudW1iZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHBvc2l0aW9uIOOBruacgOWkp+WApOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfSA6IHBvc2l0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0UG9zTWF4KCk6IG51bWJlcjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kk44OZ44Oz44OI55m76YyyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdHlwZSB7U3RyaW5nfSAgIFtpbl0gZXZlbnQg5ZCNXHJcbiAgICAgICAgICogQHBhcmFtIGZ1bmMge0Z1bmN0aW9ufSBbaW5dIGV2ZW50IGhhbmRsZXJcclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IDogcG9zaXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBvbih0eXBlOiBzdHJpbmcsIGZ1bmM6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kk44OZ44Oz44OI55m76Yyy6Kej6ZmkXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdHlwZSB7U3RyaW5nfSAgIFtpbl0gZXZlbnQg5ZCNXHJcbiAgICAgICAgICogQHBhcmFtIGZ1bmMge0Z1bmN0aW9ufSBbaW5dIGV2ZW50IGhhbmRsZXJcclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IDogcG9zaXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBvZmYodHlwZTogc3RyaW5nLCBmdW5jOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCueOCr+ODreODvOODq+S9jee9ruOCkuaMh+WumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHBvcyAgICAge051bWJlcn0gIFtpbl0g44K544Kv44Ot44O844Or5L2N572uICgwIC0gcG9zTWF4KVxyXG4gICAgICAgICAqIEBwYXJhbSBhbmltYXRlIHtCb29sZWFufSBbaW5dIOOCouODi+ODoeODvOOCt+ODp+ODs+OBruacieeEoVxyXG4gICAgICAgICAqIEBwYXJhbSB0aW1lICAgIHtOdW1iZXJ9ICBbaW5dIOOCouODi+ODoeODvOOCt+ODp+ODs+OBq+iyu+OChOOBmeaZgumWkyBbbXNlY11cclxuICAgICAgICAgKi9cclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTY3JvbGxlciDjga7nirbmhYvmm7TmlrBcclxuICAgICAgICAgKi9cclxuICAgICAgICB1cGRhdGUoKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2Nyb2xsZXIg44Gu56C05qOEXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZGVzdHJveSgpOiB2b2lkO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElTY3JvbGxhYmxlXHJcbiAgICAgKiBAYnJpZWYgU2Nyb2xsIOOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTY3JvbGxhYmxlIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrnjgq/jg63jg7zjg6vjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gaGFuZGxlciB7RnVuY3Rpb259IFtpbl0g44OP44Oz44OJ44Op6Zai5pWwXHJcbiAgICAgICAgICogQHBhcmFtIG9uICAgICAge0Jvb2xlYW59ICBbaW5dIHRydWU6IOioreWumiAvIGZhbHNlOiDop6PpmaRcclxuICAgICAgICAgKi9cclxuICAgICAgICBzZXRTY3JvbGxIYW5kbGVyKGhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkLCBvbjogYm9vbGVhbik6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCueOCr+ODreODvOODq+e1guS6huOCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBoYW5kbGVyIHtGdW5jdGlvbn0gW2luXSDjg4/jg7Pjg4njg6nplqLmlbBcclxuICAgICAgICAgKiBAcGFyYW0gb24gICAgICB7Qm9vbGVhbn0gIFtpbl0gdHJ1ZTog6Kit5a6aIC8gZmFsc2U6IOino+mZpFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNldFNjcm9sbFN0b3BIYW5kbGVyKGhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkLCBvbjogYm9vbGVhbik6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCueOCr+ODreODvOODq+S9jee9ruOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfSA6IHBvc2l0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zKCk6IG51bWJlcjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44K544Kv44Ot44O844Or5L2N572u44Gu5pyA5aSn5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IDogcG9zaXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRTY3JvbGxQb3NNYXgoKTogbnVtYmVyO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBwb3MgICAgIHtOdW1iZXJ9ICBbaW5dIOOCueOCr+ODreODvOODq+S9jee9riAoMCAtIHBvc01heClcclxuICAgICAgICAgKiBAcGFyYW0gYW5pbWF0ZSB7Qm9vbGVhbn0gW2luXSDjgqLjg4vjg6Hjg7zjgrfjg6fjg7Pjga7mnInnhKFcclxuICAgICAgICAgKiBAcGFyYW0gdGltZSAgICB7TnVtYmVyfSAgW2luXSDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PjgavosrvjgoTjgZnmmYLplpMgW21zZWNdXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2Nyb2xsVG8ocG9zOiBudW1iZXIsIGFuaW1hdGU/OiBib29sZWFuLCB0aW1lPzogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GV44KM44GfIExpc3RJdGVtVmlldyDjga7ooajnpLrjgpLkv53oqLxcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBpbmRleCAgIHtOdW1iZXJ9ICAgICAgICAgICAgICAgW2luXSBMaXN0SXRlbVZpZXcg44Gu44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0Vuc3VyZVZpc2libGVPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGVuc3VyZVZpc2libGUoaW5kZXg6IG51bWJlciwgb3B0aW9ucz86IEVuc3VyZVZpc2libGVPcHRpb25zKTogdm9pZDtcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJQmFja3VwUmVzdG9yZVxyXG4gICAgICogQGJyaWVmIEJhY2t1cC9SZXN0b3JlIOOBruOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElCYWNrdXBSZXN0b3JlIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlhoXpg6jjg4fjg7zjgr/jgpLjg5Djg4Pjgq/jgqLjg4Pjg5dcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBrZXkge1N0cmluZ30gW2luXSDjg5Djg4Pjgq/jgqLjg4Pjg5fjgq3jg7zjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDmiJDlip8gLyBmYWxzZTog5aSx5pWXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYmFja3VwKGtleTogc3RyaW5nKTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5YaF6YOo44OH44O844K/44KS44Oq44K544OI44KiXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ga2V5ICAgICB7U3RyaW5nfSAgW2luXSDjg5Djg4Pjgq/jgqLjg4Pjg5fjgq3jg7zjgpLmjIflrppcclxuICAgICAgICAgKiBAcGFyYW0gcmVidWlsZCB7Qm9vbGVhbn0gW2luXSByZWJ1aWxkIOOCkuWun+ihjOOBmeOCi+WgtOWQiOOBryB0cnVlIOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaIkOWKnyAvIGZhbHNlOiDlpLHmlZdcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXN0b3JlKGtleTogc3RyaW5nLCByZWJ1aWxkOiBib29sZWFuKTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gu5pyJ54ShXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ga2V5IHtTdHJpbmd9IFtpbl0g44OQ44OD44Kv44Ki44OD44OX44Kt44O844KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5pyJIC8gZmFsc2U6IOeEoVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGhhc0JhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruegtOajhFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGtleSB7U3RyaW5nfSBbaW5dIOODkOODg+OCr+OCouODg+ODl+OCreODvOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaIkOWKnyAvIGZhbHNlOiDlpLHmlZdcclxuICAgICAgICAgKi9cclxuICAgICAgICBjbGVhckJhY2t1cChrZXk/OiBzdHJpbmcpOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jgavjgqLjgq/jgrvjgrlcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge2FueX0g44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYmFja3VwRGF0YTogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgZXhwb3J0IHR5cGUgVmlld0NvbnN0cnVjdG9yID0gbmV3IChvcHRpb25zPzogQmFja2JvbmUuVmlld09wdGlvbnM8QmFja2JvbmUuTW9kZWw+KSA9PiBCYWNrYm9uZS5WaWV3PEJhY2tib25lLk1vZGVsPjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSUNvbXBvc2FibGVWaWV3XHJcbiAgICAgKiBAYnJpZWYgSUNvbXBvc2FibGVWaWV3U3RhdGljIOOBruODl+ODreOCreOCt+OCpOODs+OCv+ODvOODleOCp+OCpOOCuSAoZXhwZXJpbWVudGFsKVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElDb21wb3NhYmxlVmlldyB7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElDb21wb3NhYmxlVmlld1N0YXRpY1xyXG4gICAgICogQGJyaWVmIFZpZXcgY29tcG9zZSDjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQ29tcG9zYWJsZVZpZXdTdGF0aWMge1xyXG4gICAgICAgIG5ldyAoKTogSUNvbXBvc2FibGVWaWV3O1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOBmeOBp+OBq+Wumue+qeOBleOCjOOBnyBCYWNrYm9uZS5WaWV3IOOCkuWfuuW6leOCr+ODqeOCueOBq+ioreWumuOBl+OAgWV4dGVuZCDjgpLlrp/ooYzjgZnjgovjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkZXJpdmVzICAgICAgICAge0JhY2tib25lLlZpZXd8QmFja2JvbmUuVmlld1tdfSBbaW5dIOWQiOaIkOWFg+OBriBWaWV3IOOCr+ODqeOCuVxyXG4gICAgICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgICAge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHByb3RvdHlwZSDjg5fjg63jg5Hjg4bjgqNcclxuICAgICAgICAgKiBAcGFyYW0gY2xhc3NQcm9wZXJ0aWVzIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgW2luXSBzdGF0aWMg44OX44Ot44OR44OG44KjXHJcbiAgICAgICAgICogQHJldHVybiB7QmFja2JvbmUuVmlld3xCYWNrYm9uZS5WaWV3W119IOaWsOimj+OBq+eUn+aIkOOBleOCjOOBnyBWaWV3IOOBruOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbXBvc2UoZGVyaXZlczogVmlld0NvbnN0cnVjdG9yIHwgVmlld0NvbnN0cnVjdG9yW10sIHByb3BlcnRpZXM6IGFueSwgY2xhc3NQcm9wZXJ0aWVzPzogYW55KTogVmlld0NvbnN0cnVjdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIFVwZGF0ZUhlaWdodE9wdGlvbnNcclxuICAgICAqIEBicmllZiBJTGlzdEl0ZW1WaWV3LnVwZGF0ZUhlaWdodCgpIOOBq+a4oeOBm+OCi+OCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFVwZGF0ZUhlaWdodE9wdGlvbnMge1xyXG4gICAgICAgIHJlZmxlY3RBbGw/OiBib29sZWFuOyAgICAvLyE8IGxpbmUg44Gu6auY44GV5pu05paw5pmC44Gr5b2x6Z+/44GZ44KL44GZ44G544Gm44GuIExpbmVQcm9maWxlIOOBruWGjeioiOeul+OCkuihjOOBhuWgtOWQiOOBryB0cnVlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElMaXN0SXRlbVZpZXdcclxuICAgICAqIEBicmllZiAgICAgTGlzdFZpZXcg44GuIDHooYzliIbjgpLmp4vmiJDjgZnjgosgQ2hpbGQgVmlldyDjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTGlzdEl0ZW1WaWV3IHtcclxuICAgICAgICAvLyEg6Ieq6Lqr44GuIExpbmUg44Kk44Oz44OH44OD44Kv44K544KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0SW5kZXgoKTogbnVtYmVyO1xyXG4gICAgICAgIC8vISDoh6rouqvjgavmjIflrprjgZXjgozjgZ/pq5jjgZXjgpLlj5blvpdcclxuICAgICAgICBnZXRTcGVjaWZpZWRIZWlnaHQoKTogbnVtYmVyO1xyXG4gICAgICAgIC8vISBjaGlsZCBub2RlIOOBjOWtmOWcqOOBmeOCi+OBi+WIpOWumlxyXG4gICAgICAgIGhhc0NoaWxkTm9kZSgpOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDpq5jjgZXjgpLmm7TmlrBcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBuZXdIZWlnaHQge051bWJlcn0gICAgICAgICAgICAgIFtpbl0g5paw44GX44GE6auY44GVXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgICB7VXBkYXRlSGVpZ2h0T3B0aW9uc30gW2luXSBsaW5lIOOBrumrmOOBleabtOaWsOaZguOBq+W9semfv+OBmeOCi+OBmeOBueOBpuOBriBMaW5lUHJvZmlsZSDjga7lho3oqIjnrpfjgpLooYzjgYbloLTlkIjjga8geyByZWZsZWN0QWxsOiB0cnVlIH1cclxuICAgICAgICAgKiBAcmV0dXJuIHtJTGlzdEl0ZW1WaWV3fSDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICB1cGRhdGVIZWlnaHQobmV3SGVpZ2h0OiBudW1iZXIsIG9wdGlvbnM/OiBVcGRhdGVIZWlnaHRPcHRpb25zKTogSUxpc3RJdGVtVmlldztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgQmFzZUxpc3RJdGVtVmlld1xyXG4gICAgICogQGJyaWVmICAgICBJTGlzdEl0ZW1WaWV3IOOBriBhbGlhc1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJhc2VMaXN0SXRlbVZpZXcgZXh0ZW5kcyBJTGlzdEl0ZW1WaWV3LCBCYWNrYm9uZS5WaWV3PEJhY2tib25lLk1vZGVsPiB7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgRW5zdXJlVmlzaWJsZU9wdGlvbnNcclxuICAgICAqIEBicmllZiBJTGlzdFZpZXcuZW5zdXJlVmlzaWJsZSgpIOOBq+a4oeOBm+OCi+OCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEVuc3VyZVZpc2libGVPcHRpb25zIHtcclxuICAgICAgICBwYXJ0aWFsT0s/OiBib29sZWFuOyAgICAvLyE8IOmDqOWIhueahOihqOekuuOCkuioseWPr+OBmeOCi+WgtOWQiCB0cnVlLCBkZWZhdWx0OiB0cnVlLlxyXG4gICAgICAgIHNldFRvcD86IGJvb2xlYW47ICAgICAgIC8vITwg5by35Yi255qE44Gr44K544Kv44Ot44O844Or6aCY5Z+f44Gu5LiK6YOo44Gr56e75YuV44GZ44KL5aC05ZCIIHRydWUsIGRlZmF1bHQ6IGZhbHNlLlxyXG4gICAgICAgIGFuaW1hdGU/OiBib29sZWFuOyAgICAgIC8vITwg44Ki44OL44Oh44O844K344On44Oz44GZ44KL5aC05ZCIIHRydWUuIGRlZmF1bHQ6IExpc3RWaWV3T3B0aW9ucy5lbmFibGVBbmltYXRpb24g44Gu6Kit5a6a44Go5ZCM5pyfXHJcbiAgICAgICAgdGltZT86IG51bWJlcjsgICAgICAgICAgLy8hPCDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PjgavosrvjgoTjgZnmmYLplpMgW21zZWNdXHJcbiAgICAgICAgY2FsbGJhY2s/OiAoKSA9PiB2b2lkOyAgLy8hPCDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PntYLkuobjga7jgr/jgqTjg5/jg7PjgrDjgafjgrPjg7zjg6vjgZXjgozjgosuICjnlpHkvLznmoQpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIExpc3RWaWV3IOOBruOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElMaXN0VmlldyBleHRlbmRzIElTY3JvbGxhYmxlLCBJQmFja3VwUmVzdG9yZSB7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gUHJvZmlsZSDnrqHnkIZcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5Yid5pyf5YyW5riI44G/44GL5Yik5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDliJ3mnJ/ljJbmuIjjgb8gLyBmYWxzZTog5pyq5Yid5pyf5YyWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNJbml0aWFsaXplZCgpOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJdGVtIOeZu+mMslxyXG4gICAgICAgICAqIOODl+ODreODkeODhuOCo+OCkuaMh+WumuOBl+OBpuOAgUxpc3RJdGVtIOOCkueuoeeQhlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGhlaWdodCAgICAgIHtOdW1iZXJ9ICAgW2luXSDjg6njgqTjg7Pjga7pq5jjgZVcclxuICAgICAgICAgKiBAcGFyYW0gaW5pdGlhbGl6ZXIge0Z1bmN0aW9ufSBbaW5dIExpc3RJdGVtVmlldyDmtL7nlJ/jgq/jg6njgrnjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAgICAgKiBAcGFyYW0gaW5mbyAgICAgICAge09iamVjdH0gICBbaW5dIGluaXRpYWxpemVyIOOBq+a4oeOBleOCjOOCi+OCquODl+OCt+ODp+ODs+W8leaVsFxyXG4gICAgICAgICAqIEBwYXJhbSBpbnNlcnRUbyAgICB7TnVtYmVyfSAgIFtpbl0g44Op44Kk44Oz44Gu5oy/5YWl5L2N572u44KS44Kk44Oz44OH44OD44Kv44K544Gn5oyH5a6aXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYWRkSXRlbShoZWlnaHQ6IG51bWJlciwgaW5pdGlhbGl6ZXI6IG5ldyAob3B0aW9ucz86IGFueSkgPT4gQmFzZUxpc3RJdGVtVmlldywgaW5mbzogYW55LCBpbnNlcnRUbz86IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBnyBJdGVtIOOCkuWJiumZpFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGluZGV4IHtOdW1iZXJ8TnVtYmVyW119IFtpbl0g6Kej6Zmk6ZaL5aeL44Gu44Kk44Oz44OH44OD44Kv44K544KS5oyH5a6aLiDphY3liJfniYjjga8gcmV2ZXJzZSBpbmRleCDjgpLmjIflrprjgZnjgovjgbvjgYbjgYzlirnnjofnmoRcclxuICAgICAgICAgKiBAcGFyYW0gc2l6ZSAge051bWJlcn0gICAgICAgICAgW2luXSDop6PpmaTjgZnjgovjg6njgqTjg7Pjga7nt4/mlbAuIOaXouWumjogMVxyXG4gICAgICAgICAqIEBwYXJhbSBkZWxheSB7TnVtYmVyfSAgICAgICAgICBbaW5dIOWun+mam+OBq+imgee0oOOCkuWJiumZpOOBmeOCiyBkZWxheSB0aW1lIOaXouWumjogMCAo5Y2z5pmC5YmK6ZmkKVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJlbW92ZUl0ZW0oaW5kZXg6IG51bWJlciwgc2l6ZT86IG51bWJlciwgZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xyXG4gICAgICAgIHJlbW92ZUl0ZW0oaW5kZXg6IG51bWJlcltdLCBkZWxheT86IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBnyBJdGVtIOOBq+ioreWumuOBl+OBn+aDheWgseOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHRhcmdldCB7TnVtYmVyfEpRdWVyeS5FdmVudH0gW2luXSDorZjliKXlrZAuIFtpbmRleCB8IGV2ZW50IG9iamVjdF1cclxuICAgICAgICAgKiBAcmV0dXJuIHtPYmplY3R9IF9hZGRMaW5lKCkg44Gr5oyH5a6a44GX44GfIGluZm8g44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBudW1iZXIpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBKUXVlcnkuRXZlbnQpOiBhbnk7XHJcblxyXG4gICAgICAgIC8vISDjgqLjgq/jg4bjgqPjg5bjg5rjg7zjgrjjgpLmm7TmlrBcclxuICAgICAgICByZWZyZXNoKCk6IHZvaWQ7XHJcbiAgICAgICAgLy8hIOacquOCouOCteOCpOODs+ODmuODvOOCuOOCkuani+eviVxyXG4gICAgICAgIHVwZGF0ZSgpOiB2b2lkO1xyXG4gICAgICAgIC8vISDjg5rjg7zjgrjjgqLjgrXjgqTjg7PjgpLlho3mp4vmiJBcclxuICAgICAgICByZWJ1aWxkKCk6IHZvaWQ7XHJcbiAgICAgICAgLy8hIOeuoei9hOODh+ODvOOCv+OCkuegtOajhFxyXG4gICAgICAgIHJlbGVhc2UoKTogdm9pZDtcclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBQcm9wZXJ0aWVzOlxyXG5cclxuICAgICAgICAvLyEgY29yZSBmcmFtZXdvcmsgYWNjZXNzXHJcbiAgICAgICAgY29yZTogSUxpc3RWaWV3RnJhbWV3b3JrO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJTGlzdFZpZXdcclxuICAgICAqIEBicmllZiBMaXN0VmlldyDjga7jgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTGlzdFZpZXcge1xyXG4gICAgICAgIC8vISDnmbvpjLIgZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCi1xyXG4gICAgICAgIF9hZGRMaW5lPyhfbGluZTogTGluZVByb2ZpbGUsIGluc2VydFRvPzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICBfYWRkTGluZT8oX2xpbmU6IExpbmVQcm9maWxlW10sIGluc2VydFRvPzogbnVtYmVyKTogdm9pZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgQmFzZUxpc3RWaWV3XHJcbiAgICAgKiBAYnJpZWYgICAgIElMaXN0VmlldyDjga4gYWxpYXNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCYXNlTGlzdFZpZXcgZXh0ZW5kcyBJTGlzdFZpZXcsIEJhY2tib25lLlZpZXc8QmFja2JvbmUuTW9kZWw+IHsgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElTdGF0dXNNYW5hZ2VyXHJcbiAgICAgKiBAYnJpZWYg54q25oWL566h55CG44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVN0YXR1c01hbmFnZXIge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruOCpOODs+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyB7U3RyaW5nfSBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXR1c0FkZFJlZihzdGF0dXM6IHN0cmluZyk6IG51bWJlcjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog54q25oWL5aSJ5pWw44Gu5Y+C54Wn44Kr44Km44Oz44OI44Gu44OH44Kv44Oq44Oh44Oz44OIXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdHVzIHtTdHJpbmd9IFtpbl0g54q25oWL6K2Y5Yil5a2QXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdHVzUmVsZWFzZShzdGF0dXM6IHN0cmluZyk6IG51bWJlcjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5Yem55CG44K544Kz44O844OX5q+O44Gr54q25oWL5aSJ5pWw44KS6Kit5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdHVzICAge1N0cmluZ30gICBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqIEBwYXJhbSBjYWxsYmFjayB7RnVuY3Rpb259IFtpbl0g5Yem55CG44Kz44O844Or44OQ44OD44KvXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdHVzU2NvcGUoc3RhdHVzOiBzdHJpbmcsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5oyH5a6a44GX44Gf54q25oWL5Lit44Gn44GC44KL44GL56K66KqNXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gc3RhdHVzIHtTdHJpbmd9ICAgW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDnirbmhYvlhoUgLyBmYWxzZTog54q25oWL5aSWXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaXNTdGF0dXNJbihzdGF0dXM6IHN0cmluZyk6IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSUV4cGFuZE1hbmFnZXJcclxuICAgICAqIEBicmllZiDplovplonnrqHnkIbjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJRXhwYW5kTWFuYWdlciBleHRlbmRzIElCYWNrdXBSZXN0b3JlLCBJU3RhdHVzTWFuYWdlciB7XHJcbiAgICAgICAgbGF5b3V0S2V5OiBzdHJpbmc7ICAgIC8vIGxheW91dCBrZXkgKHBvcnRyYXRlL2xhbmRzY2FwZeOBlOOBqOOBqyBsYXlvdXTmg4XloLHjgavjgqLjgq/jgrvjgrkpXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaWsOimjyBHcm91cFByb2ZpbGUg44KS5L2c5oiQXHJcbiAgICAgICAgICog55m76Yyy5riI44G/44Gu5aC05ZCI44Gv44Gd44Gu44Kq44OW44K444Kn44Kv44OI44KS6L+U5Y20XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFybWEgaWQge1N0cmluZ30gW2luXSDmlrDopo/jgavkvZzmiJDjgZnjgosgR3JvdXAgSUQg44KS5oyH5a6aLiDmjIflrprjgZfjgarjgYTloLTlkIjjga/oh6rli5XlibLjgormjK/jgopcclxuICAgICAgICAgKiBAcmV0dXJuIHtHcm91cFByb2ZpbGV9IEdyb3VwUHJvZmlsZSDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBuZXdHcm91cChpZD86IHN0cmluZyk6IEdyb3VwUHJvZmlsZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog55m76Yyy5riI44G/IEdyb3VwIOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcm1hIGlkIHtTdHJpbmd9IFtpbl0g5Y+W5b6X44GZ44KLIEdyb3VwIElEIOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm4ge0dyb3VwUHJvZmlsZX0gR3JvdXBQcm9maWxlIOOCpOODs+OCueOCv+ODs+OCuSAvIG51bGxcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRHcm91cChpZDogc3RyaW5nKTogR3JvdXBQcm9maWxlO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnrKwx6ZqO5bGk44GuIEdyb3VwIOeZu+mMslxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHRvcEdyb3VwIHtHcm91cFByb2ZpbGV9IFtpbl0g5qeL56+J5riI44G/IEdyb3VwUHJvZmlsZSDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICByZWdpc3RlclRvcEdyb3VwKHRvcEdyb3VwOiBHcm91cFByb2ZpbGUpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnrKwx6ZqO5bGk44GuIEdyb3VwIOOCkuWPluW+l1xyXG4gICAgICAgICAqIOOCs+ODlOODvOmFjeWIl+OBjOi/lOOBleOCjOOCi+OBn+OCgeOAgeOCr+ODqeOCpOOCouODs+ODiOOBr+OCreODo+ODg+OCt+ODpeS4jeWPr1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7R3JvdXBQcm9maWxlW119IEdyb3VwUHJvZmlsZSDphY3liJdcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRUb3BHcm91cHMoKTogR3JvdXBQcm9maWxlW107XHJcblxyXG4gICAgICAgIC8vISDjgZnjgbnjgabjga7jgrDjg6vjg7zjg5fjgpLlsZXplosgKDHpmo7lsaQpXHJcbiAgICAgICAgZXhwYW5kQWxsKCk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8vISDjgZnjgbnjgabjga7jgrDjg6vjg7zjg5fjgpLlj47mnZ8gKDHpmo7lsaQpXHJcbiAgICAgICAgY29sbGFwc2VBbGwoZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgICAgICAvLyEg5bGV6ZaL5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNFeHBhbmRpbmcoKTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLy8hIOWPjuadn+S4reOBi+WIpOWumlxyXG4gICAgICAgIGlzQ29sbGFwc2luZygpOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvLyEg6ZaL6ZaJ5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNTd2l0Y2hpbmcoKTogYm9vbGVhbjtcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBFeHBhbmRhYmxlTGlzdFZpZXdcclxuICAgICAqIEBicmllZiDplovplonjg6rjgrnjg4jjg5Pjg6Xjg7zjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJRXhwYW5kYWJsZUxpc3RWaWV3IGV4dGVuZHMgSUxpc3RWaWV3LCBJRXhwYW5kTWFuYWdlciB7IH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgQmFzZUV4cGFuZGFibGVMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmICAgICBJRXhwYW5kYWJsZUxpc3RWaWV3IOOBriBhbGlhc1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEJhc2VFeHBhbmRhYmxlTGlzdFZpZXcgZXh0ZW5kcyBJRXhwYW5kYWJsZUxpc3RWaWV3LCBCYWNrYm9uZS5WaWV3PEJhY2tib25lLk1vZGVsPiB7IH1cclxufVxyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCJjZHAudWkubGlzdHZpZXdcIiB7XHJcbiAgICBjb25zdCBVSTogdHlwZW9mIENEUC5VSTtcclxuICAgIGV4cG9ydCA9IFVJO1xyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgTGlzdFZpZXdHbG9iYWxDb25maWdcclxuICAgICAqIEBicmllZiBjZHAudWkubGlzdHZpZXcg44GuIGdsb2JhbCBjb25maW5nXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBtb2R1bGUgTGlzdFZpZXdHbG9iYWxDb25maWcge1xyXG4gICAgICAgIGV4cG9ydCBsZXQgV1JBUFBFUl9DTEFTUyAgICAgICAgICAgICAgICA9IFwidWktbGlzdHZpZXctd3JhcHBlclwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgV1JBUFBFUl9TRUxFQ1RPUiAgICAgICAgICAgICA9IFwiLlwiICsgV1JBUFBFUl9DTEFTUztcclxuICAgICAgICBleHBvcnQgbGV0IFNDUk9MTF9NQVBfQ0xBU1MgICAgICAgICAgICAgPSBcInVpLWxpc3R2aWV3LXNjcm9sbC1tYXBcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFNDUk9MTF9NQVBfU0VMRUNUT1IgICAgICAgICAgPSBcIi5cIiArIFNDUk9MTF9NQVBfQ0xBU1M7XHJcbiAgICAgICAgZXhwb3J0IGxldCBJTkFDVElWRV9DTEFTUyAgICAgICAgICAgICAgID0gXCJpbmFjdGl2ZVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU5BQ1RJVkVfQ0xBU1NfU0VMRUNUT1IgICAgICA9IFwiLlwiICsgSU5BQ1RJVkVfQ0xBU1M7XHJcbiAgICAgICAgZXhwb3J0IGxldCBSRUNZQ0xFX0NMQVNTICAgICAgICAgICAgICAgID0gXCJ1aS1saXN0dmlldy1yZWN5Y2xlXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBSRUNZQ0xFX0NMQVNTX1NFTEVDVE9SICAgICAgID0gXCIuXCIgKyBSRUNZQ0xFX0NMQVNTO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTElTVElURU1fQkFTRV9DTEFTUyAgICAgICAgICA9IFwidWktbGlzdHZpZXctaXRlbS1iYXNlXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBMSVNUSVRFTV9CQVNFX0NMQVNTX1NFTEVDVE9SID0gXCIuXCIgKyBMSVNUSVRFTV9CQVNFX0NMQVNTO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgREFUQV9QQUdFX0lOREVYICAgICAgICAgICAgICA9IFwiZGF0YS1wYWdlLWluZGV4XCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBEQVRBX0NPTlRBSU5FUl9JTkRFWCAgICAgICAgID0gXCJkYXRhLWNvbnRhaW5lci1pbmRleFwiO1xyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIC8vIGNkcC51aS5saXN0dmlldyDjga8gY2RwLmNvcmUg44Gr5L6d5a2Y44GX44Gq44GE44Gf44KB44CB54us6Ieq44GrZ2xvYmFsIOOCkuaPkOS+m+OBmeOCi1xyXG4gICAgLypqc2hpbnQgZXZpbDp0cnVlICovXHJcbiAgICBleHBvcnQgY29uc3QgZ2xvYmFsID0gKDxhbnk+Q0RQKS5nbG9iYWwgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xyXG4gICAgLypqc2hpbnQgZXZpbDpmYWxzZSAqL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmFja2JvbmUuVmlldyDjga7mlrDopo/lkIjmiJBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYmFzZSAgICB7QmFja2JvbmUuVmlld30gICAgICAgICAgICAgICAgIFtpbl0gcHJvdG90eXBlIGNoYWluIOacgOS4i+S9jeOBriBWaWV3IOOCr+ODqeOCuVxyXG4gICAgICogQHBhcmFtIGRlcml2ZXMge0JhY2tib25lLlZpZXd8QmFja2JvbmUuVmlld1tdfSBbaW5dIOa0vueUn+OBleOCjOOCi+OBriBWaWV3IOOCr+ODqeOCuVxyXG4gICAgICogQHJldHVybiB7QmFja2JvbmUuVmlld3xCYWNrYm9uZS5WaWV3W119IOaWsOimj+OBq+eUn+aIkOOBleOCjOOBnyBWaWV3IOOBruOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gY29tcG9zZVZpZXdzKGJhc2U6IFZpZXdDb25zdHJ1Y3RvciwgZGVyaXZlczogVmlld0NvbnN0cnVjdG9yIHwgVmlld0NvbnN0cnVjdG9yW10pOiBWaWV3Q29uc3RydWN0b3Ige1xyXG4gICAgICAgIGxldCBfY29tcG9zZWQgPSBiYXNlO1xyXG4gICAgICAgIGNvbnN0IF9kZXJpdmVzID0gPFZpZXdDb25zdHJ1Y3RvcltdPihkZXJpdmVzIGluc3RhbmNlb2YgQXJyYXkgPyBkZXJpdmVzIDogW2Rlcml2ZXNdKTtcclxuICAgICAgICBfZGVyaXZlcy5mb3JFYWNoKChkZXJpdmUpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgc2VlZCA9IHt9O1xyXG4gICAgICAgICAgICBfLmV4dGVuZE93bihzZWVkLCBkZXJpdmUucHJvdG90eXBlKTtcclxuICAgICAgICAgICAgZGVsZXRlIHNlZWQuY29uc3RydWN0b3I7XHJcbiAgICAgICAgICAgIF9jb21wb3NlZCA9ICg8YW55Pl9jb21wb3NlZCkuZXh0ZW5kKHNlZWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBfY29tcG9zZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCYWNrYm9uZS5WaWV3IOOBruWQiOaIkFxyXG4gICAgICogcHJvdG90eXBlIGNoYWluIOOCkuS9nOOCi+WQiOaIkFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkZXJpdmVkIHtCYWNrYm9uZS5WaWV3fSAgICAgICAgICAgICAgICAgW2luXSBwcm90b3R5cGUgY2hhaW4g5pyA5LiK5L2N44GuIFZpZXcg44Kv44Op44K5XHJcbiAgICAgKiBAcGFyYW0gYmFzZXMgICB7QmFja2JvbmUuVmlld3xCYWNrYm9uZS5WaWV3W119IFtpbl0g5ZCI5oiQ5YWD44GuVmlldyDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRlcml2ZVZpZXdzKGRlcml2ZWQ6IFZpZXdDb25zdHJ1Y3RvciwgYmFzZXM6IFZpZXdDb25zdHJ1Y3RvciB8IFZpZXdDb25zdHJ1Y3RvcltdKTogdm9pZCB7XHJcbiAgICAgICAgbGV0IF9jb21wb3NlZDogVmlld0NvbnN0cnVjdG9yO1xyXG4gICAgICAgIGNvbnN0IF9iYXNlcyA9IDxWaWV3Q29uc3RydWN0b3JbXT4oYmFzZXMgaW5zdGFuY2VvZiBBcnJheSA/IGJhc2VzIDogW2Jhc2VzXSk7XHJcbiAgICAgICAgaWYgKDIgPD0gX2Jhc2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBfY29tcG9zZWQgPSBjb21wb3NlVmlld3MoX2Jhc2VzWzBdLCBfYmFzZXMuc2xpY2UoMSkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIF9jb21wb3NlZCA9IF9iYXNlc1swXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVyaXZlZCA9IGNvbXBvc2VWaWV3cyhfY29tcG9zZWQsIGRlcml2ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmFja2JvbmUuVmlldyDjga7lkIjmiJBcclxuICAgICAqIHByb3RvdHlwZSBjaGFpbiDjgpLkvZzjgonjgarjgYTlkIjmiJBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGVyaXZlZCB7QmFja2JvbmUuVmlld30gICAgICAgICAgICAgICAgIFtpbl0g5YWD44Go44Gq44KLIFZpZXcg44Kv44Op44K5XHJcbiAgICAgKiBAcGFyYW0gYmFzZXMgICB7QmFja2JvbmUuVmlld3xCYWNrYm9uZS5WaWV3W119IFtpbl0g5ZCI5oiQ5YWD44GuVmlldyDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG1peGluVmlld3MoZGVyaXZlZDogVmlld0NvbnN0cnVjdG9yLCBiYXNlczogVmlld0NvbnN0cnVjdG9yIHwgVmlld0NvbnN0cnVjdG9yW10pOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBfYmFzZXMgPSA8Vmlld0NvbnN0cnVjdG9yW10+KGJhc2VzIGluc3RhbmNlb2YgQXJyYXkgPyBiYXNlcyA6IFtiYXNlc10pO1xyXG4gICAgICAgIF9iYXNlcy5mb3JFYWNoKChiYXNlKSA9PiB7XHJcbiAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGJhc2UucHJvdG90eXBlKS5mb3JFYWNoKG5hbWUgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVyaXZlZC5wcm90b3R5cGVbbmFtZV0gPSBiYXNlLnByb3RvdHlwZVtuYW1lXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBfTGlzdFZpZXdVdGlsc1xyXG4gICAgICogQGJyaWVmIOWGhemDqOOBp+S9v+eUqOOBmeOCi+S+v+WIqemWouaVsFxyXG4gICAgICogICAgICAgIFRvb2xzIOOBi+OCieOBruacgOS9jumZkOOBrua1geeUqFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbW9kdWxlIF9MaXN0Vmlld1V0aWxzIHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY3NzIOOBriB2ZW5kZXIg5ouh5by1IHByZWZpeCDjgpLov5TjgZlcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fSBwcmVmaXhcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgY29uc3QgY3NzUHJlZml4ZXMgPSBbXCItd2Via2l0LVwiLCBcIi1tb3otXCIsIFwiLW1zLVwiLCBcIi1vLVwiLCBcIlwiXTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY3NzIOOBriBtYXRyaXgg44Gu5YCk44KS5Y+W5b6XLlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGVsZW1lbnQge2pRdWVyeX0gW2luXSDlr77osaHjga4galF1ZXJ5IOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSB0eXBlICAgIHtTdHJpbmd9IFtpbl0gbWF0cml4IHR5cGUgc3RyaW5nIFt0cmFuc2xhdGVYIHwgdHJhbnNsYXRlWSB8IHNjYWxlWCB8IHNjYWxlWV1cclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IHZhbHVlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IGdldENzc01hdHJpeFZhbHVlID0gKGVsZW1lbnQ6IEpRdWVyeSwgdHlwZTogc3RyaW5nKTogbnVtYmVyID0+IHtcclxuICAgICAgICAgICAgbGV0IHRyYW5zWCA9IDA7XHJcbiAgICAgICAgICAgIGxldCB0cmFuc1kgPSAwO1xyXG4gICAgICAgICAgICBsZXQgc2NhbGVYID0gMDtcclxuICAgICAgICAgICAgbGV0IHNjYWxlWSA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3NzUHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxldCBtYXRyaXggPSAkKGVsZW1lbnQpLmNzcyhjc3NQcmVmaXhlc1tpXSArIFwidHJhbnNmb3JtXCIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG1hdHJpeCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzM2RNYXRyaXggPSBtYXRyaXguaW5kZXhPZihcIjNkXCIpICE9PSAtMSA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXggPSBtYXRyaXgucmVwbGFjZShcIm1hdHJpeDNkXCIsIFwiXCIpLnJlcGxhY2UoXCJtYXRyaXhcIiwgXCJcIikucmVwbGFjZSgvW15cXGQuLC1dL2csIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGFyciA9IG1hdHJpeC5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNYID0gTnVtYmVyKGFycltpczNkTWF0cml4ID8gMTIgOiA0XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNZID0gTnVtYmVyKGFycltpczNkTWF0cml4ID8gMTMgOiA1XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVYID0gTnVtYmVyKGFyclswXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVZID0gTnVtYmVyKGFycltpczNkTWF0cml4ID8gNSA6IDNdKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ0cmFuc2xhdGVYXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzTmFOKHRyYW5zWCkgPyAwIDogdHJhbnNYO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInRyYW5zbGF0ZVlcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNOYU4odHJhbnNZKSA/IDAgOiB0cmFuc1k7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2NhbGVYXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzTmFOKHNjYWxlWCkgPyAxIDogc2NhbGVYO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjYWxlWVwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc05hTihzY2FsZVkpID8gMSA6IHNjYWxlWTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBcInRyYW5zaXRpb25lbmRcIiDjga7jgqTjg5njg7Pjg4jlkI3phY3liJfjgpLov5TjgZlcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0FycmF5fSB0cmFuc2l0aW9uZW5kIOOCpOODmeODs+ODiOWQjVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBjb25zdCB0cmFuc2l0aW9uRW5kID0gXCJ0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQgTVNUcmFuc2l0aW9uRW5kXCI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHRyYW5zaXRpb24g6Kit5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IHNldFRyYW5zZm9ybXNUcmFuc2l0aW9ucyA9IChlbGVtZW50OiBKUXVlcnksIHByb3A6IHN0cmluZywgbXNlYzogbnVtYmVyLCB0aW1pbmdGdW5jdGlvbjogc3RyaW5nKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gJChlbGVtZW50KTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNpdGlvbnMgPSB7fTtcclxuICAgICAgICAgICAgY29uc3Qgc2Vjb25kID0gKG1zZWMgLyAxMDAwKSArIFwic1wiO1xyXG4gICAgICAgICAgICBjb25zdCBhbmltYXRpb24gPSBcIiBcIiArIHNlY29uZCArIFwiIFwiICsgdGltaW5nRnVuY3Rpb247XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IFwiLCB0cmFuc2Zvcm1cIiArIGFuaW1hdGlvbjtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3NzUHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zW2Nzc1ByZWZpeGVzW2ldICsgXCJ0cmFuc2l0aW9uXCJdID0gcHJvcCArIGFuaW1hdGlvbiArIHRyYW5zZm9ybTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJGVsZW1lbnQuY3NzKHRyYW5zaXRpb25zKTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdHJhbnNpdGlvbiDoqK3lrprjga7liYrpmaRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGVsZW1lbnRcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgY29uc3QgY2xlYXJUcmFuc2l0aW9ucyA9IChlbGVtZW50OiBKUXVlcnkpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgY29uc3QgJGVsZW1lbnQgPSAkKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICAgICAgJGVsZW1lbnQub2ZmKHRyYW5zaXRpb25FbmQpO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2l0aW9ucyA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNzc1ByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uc1tjc3NQcmVmaXhlc1tpXSArIFwidHJhbnNpdGlvblwiXSA9IFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRlbGVtZW50LmNzcyh0cmFuc2l0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWF0aC5hYnMg44KI44KK44KC6auY6YCf44GqIGFic1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBjb25zdCBhYnMgPSAoeDogbnVtYmVyKTogbnVtYmVyID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHggPj0gMCA/IHggOiAteDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBNYXRoLm1heCDjgojjgorjgoLpq5jpgJ/jgaogbWF4XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IG1heCA9IChsaHM6IG51bWJlciwgcmhzOiBudW1iZXIpOiBudW1iZXIgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbGhzID49IHJocyA/IGxocyA6IHJocztcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5TdGF0dXNNYW5hZ2VyXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBTdGF0dXNNYW5hZ2VyXHJcbiAgICAgKiBAYnJpZWYgVUkg55So54q25oWL566h55CG44Kv44Op44K5XHJcbiAgICAgKiAgICAgICAgU3RhdHVzTWFuYWdlciDjga7jgqTjg7Pjgrnjgr/jg7PjgrnjgZTjgajjgavku7vmhI/jga7nirbmhYvnrqHnkIbjgYzjgafjgY3jgotcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBTdGF0dXNNYW5hZ2VyIGltcGxlbWVudHMgSVN0YXR1c01hbmFnZXIge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9zdGF0dXM6IGFueSA9IHt9OyAgICAvLyE8IHN0YXR1c1Njb3BlKCkg44Gr5L2/55So44GV44KM44KL54q25oWL566h55CG44Kq44OW44K444Kn44Kv44OIXHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSVN0YXR1c01hbmFnZXJcclxuXHJcbiAgICAgICAgLy8hIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruOCpOODs+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgIHB1YmxpYyBzdGF0dXNBZGRSZWYoc3RhdHVzOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3N0YXR1c1tzdGF0dXNdKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNbc3RhdHVzXSA9IDE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNbc3RhdHVzXSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNbc3RhdHVzXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jg4fjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICBwdWJsaWMgc3RhdHVzUmVsZWFzZShzdGF0dXM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGxldCByZXR2YWw6IG51bWJlcjtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9zdGF0dXNbc3RhdHVzXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dmFsID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c1tzdGF0dXNdLS07XHJcbiAgICAgICAgICAgICAgICByZXR2YWwgPSB0aGlzLl9zdGF0dXNbc3RhdHVzXTtcclxuICAgICAgICAgICAgICAgIGlmICgwID09PSByZXR2YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fc3RhdHVzW3N0YXR1c107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJldHZhbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlh6bnkIbjgrnjgrPjg7zjg5fmr47jgavnirbmhYvlpInmlbDjgpLoqK3lrppcclxuICAgICAgICBwdWJsaWMgc3RhdHVzU2NvcGUoc3RhdHVzOiBzdHJpbmcsIGNhbGxiYWNrOiAoKSA9PiB2b2lkIHwgUHJvbWlzZTxhbnk+KTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdHVzQWRkUmVmKHN0YXR1cyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSBjYWxsYmFjaygpO1xyXG4gICAgICAgICAgICBpZiAoIXByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzUmVsZWFzZShzdGF0dXMpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcHJvbWlzZS50aGVuKFxyXG4gICAgICAgICAgICAgICAgICAgICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGF0dXNSZWxlYXNlKHN0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzUmVsZWFzZShzdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ/nirbmhYvkuK3jgafjgYLjgovjgYvnorroqo1cclxuICAgICAgICBwdWJsaWMgaXNTdGF0dXNJbihzdGF0dXM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gISF0aGlzLl9zdGF0dXNbc3RhdHVzXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IF9Db25maWcgPSBDRFAuVUkuTGlzdFZpZXdHbG9iYWxDb25maWc7XHJcbiAgICBpbXBvcnQgX1Rvb2xDU1MgPSBDRFAuVUkuX0xpc3RWaWV3VXRpbHM7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkxpbmVQcm9maWxlXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBMaW5lUHJvZmlsZVxyXG4gICAgICogQGJyaWVmIDEg44Op44Kk44Oz44Gr6Zai44GZ44KL44OX44Ot44OV44Kh44Kk44Or44Kv44Op44K5XHJcbiAgICAgKiAgICAgICAgZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCi1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgTGluZVByb2ZpbGUge1xyXG4gICAgICAgIHByaXZhdGUgX2luZGV4OiBudW1iZXIgPSBudWxsOyAgICAgICAgICAgICAgLy8hPCBnbG9iYWwgaW5kZXhcclxuICAgICAgICBwcml2YXRlIF9wYWdlSW5kZXg6IG51bWJlciA9IG51bGw7ICAgICAgICAgIC8vITwg5omA5bGe44GZ44KLIHBhZ2UgaW5kZXhcclxuICAgICAgICBwcml2YXRlIF9vZmZzZXQ6IG51bWJlciA9IG51bGw7ICAgICAgICAgICAgIC8vITwgZ2xvYmFsIG9mZnNldFxyXG4gICAgICAgIHByaXZhdGUgXyRiYXNlOiBKUXVlcnkgPSBudWxsOyAgICAgICAgICAgICAgLy8hPCDlnJ/lj7DjgajjgarjgosgRE9NIOOCpOODs+OCueOCv+ODs+OCueOCkuagvOe0jVxyXG4gICAgICAgIHByaXZhdGUgX2luc3RhbmNlOiBCYXNlTGlzdEl0ZW1WaWV3ID0gbnVsbDsgLy8hPCBMaXN0SXRlbVZpZXcg44Kk44Oz44K544K/44Oz44K544KS5qC857SNXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gX293bmVyICAgICAgIHtJTGlzdFZpZXdGcmFtZXdvcmt9IFtpbl0g566h55CG6ICF44Gn44GC44KLIElMaXN0Vmlld0ZyYW1ld29yayDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKiBAcGFyYW0gX2hlaWdodCAgICAgIHtOdW1iZXJ9ICAgICAgICAgICAgIFtpbl0g5Yid5pyf44Gu6auY44GVXHJcbiAgICAgICAgICogQHBhcmFtIF9pbml0aWFsaXplciB7RnVuY3Rpb259ICAgICAgICAgICBbaW5dIExpc3RJdGVtVmlldyDmtL7nlJ/jgq/jg6njgrnjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAgICAgKiBAcGFyYW0gX2luZm8gICAgICAgIHtPYmplY3R9ICAgICAgICAgICAgIFtpbl0gTGlzdEl0ZW1WaWV3IOOCs+ODs+OCueODiOODqeOCr+OCv+OBq+a4oeOBleOCjOOCi+OCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgICAgICBwcml2YXRlIF9vd25lcjogSUxpc3RWaWV3RnJhbWV3b3JrLFxyXG4gICAgICAgICAgICBwcml2YXRlIF9oZWlnaHQ6IG51bWJlcixcclxuICAgICAgICAgICAgcHJpdmF0ZSBfaW5pdGlhbGl6ZXI6IG5ldyAob3B0aW9ucz86IGFueSkgPT4gQmFzZUxpc3RJdGVtVmlldyxcclxuICAgICAgICAgICAgcHJpdmF0ZSBfaW5mbzogYW55KSB7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHB1YmxpYyBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vISDmnInlirnljJZcclxuICAgICAgICBwdWJsaWMgYWN0aXZhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgb3B0aW9ucztcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRiYXNlID0gdGhpcy5wcmVwYXJlQmFzZUVsZW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsOiB0aGlzLl8kYmFzZSxcclxuICAgICAgICAgICAgICAgICAgICBvd25lcjogdGhpcy5fb3duZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgbGluZVByb2ZpbGU6IHRoaXMsXHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzLl9pbmZvKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlID0gbmV3IHRoaXMuX2luaXRpYWxpemVyKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKFwibm9uZVwiID09PSB0aGlzLl8kYmFzZS5jc3MoXCJkaXNwbGF5XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGJhc2UuY3NzKFwiZGlzcGxheVwiLCBcImJsb2NrXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnZUluZGV4KHRoaXMuXyRiYXNlKTtcclxuICAgICAgICAgICAgaWYgKFwidmlzaWJsZVwiICE9PSB0aGlzLl8kYmFzZS5jc3MoXCJ2aXNpYmlsaXR5XCIpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kYmFzZS5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwidmlzaWJsZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOS4jeWPr+imluWMllxyXG4gICAgICAgIHB1YmxpYyBoaWRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChcImhpZGRlblwiICE9PSB0aGlzLl8kYmFzZS5jc3MoXCJ2aXNpYmlsaXR5XCIpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kYmFzZS5jc3MoXCJ2aXNpYmlsaXR5XCIsIFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg54Sh5Yq55YyWXHJcbiAgICAgICAgcHVibGljIGluYWN0aXZhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB4cGVyaWEgQVggSmVsbHkgQmVhbiAoNC4xLjIp44Gr44Gm44CBIGhpZGRlbiBlbGVtZW50IOOBruWJiumZpOOBp+ODoeODouODquODvOODquODvOOCr+OBmeOCi+OBn+OCgeWPr+imluWMluOBmeOCi+OAglxyXG4gICAgICAgICAgICAgICAgaWYgKFwidmlzaWJsZVwiICE9PSB0aGlzLl8kYmFzZS5jc3MoXCJ2aXNpYmlsaXR5XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJGJhc2UuY3NzKFwidmlzaWJpbGl0eVwiLCBcInZpc2libGVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnN0YW5jZS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRiYXNlLmFkZENsYXNzKF9Db25maWcuUkVDWUNMRV9DTEFTUyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kYmFzZS5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRiYXNlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOabtOaWsFxyXG4gICAgICAgIHB1YmxpYyByZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmnInlirnnhKHlirnliKTlrppcclxuICAgICAgICBwdWJsaWMgaXNBY3RpdmUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsICE9IHRoaXMuX2luc3RhbmNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOmrmOOBleaDheWgseOBruabtOaWsC4gTGlzdEl0ZW1WaWV3IOOBi+OCieOCs+ODvOODq+OBleOCjOOCi+OAglxyXG4gICAgICAgIHB1YmxpYyB1cGRhdGVIZWlnaHQobmV3SGVpZ2h0OiBudW1iZXIsIG9wdGlvbnM/OiBVcGRhdGVIZWlnaHRPcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gbmV3SGVpZ2h0IC0gdGhpcy5faGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQgPSBuZXdIZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMuX293bmVyLnVwZGF0ZVNjcm9sbE1hcEhlaWdodChkZWx0YSk7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IG9wdGlvbnMgJiYgb3B0aW9ucy5yZWZsZWN0QWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vd25lci51cGRhdGVQcm9maWxlcyh0aGlzLl9pbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISB6LWluZGV4IOOBruODquOCu+ODg+ODiC4gU2Nyb2xsTWFuYWdlci5yZW1vdmVJdGVtKCkg44GL44KJ44Kz44O844Or44GV44KM44KL44CCXHJcbiAgICAgICAgcHVibGljIHJlc2V0RGVwdGgoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX2luc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kYmFzZS5jc3MoXCJ6LWluZGV4XCIsIHRoaXMuX293bmVyLmdldExpc3RWaWV3T3B0aW9ucygpLmJhc2VEZXB0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gZ2V0dGVyL3NldHRlciBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vISBnZXR0ZXI6IOODqeOCpOODs+OBrumrmOOBlVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGVpZ2h0KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgZ2V0dGVyOiBnbG9iYWwgaW5kZXhcclxuICAgICAgICBwdWJsaWMgZ2V0IGluZGV4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBzZXR0ZXI6IGdsb2JhbCBpbmRleFxyXG4gICAgICAgIHB1YmxpYyBzZXQgaW5kZXgoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9pbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl8kYmFzZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJbmRleCh0aGlzLl8kYmFzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBnZXR0ZXI6IOaJgOWxnuODmuODvOOCuCBpbmRleFxyXG4gICAgICAgIHB1YmxpYyBnZXQgcGFnZUluZGV4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlSW5kZXg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgc2V0dGVyOiDmiYDlsZ7jg5rjg7zjgrggaW5kZXhcclxuICAgICAgICBwdWJsaWMgc2V0IHBhZ2VJbmRleChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VJbmRleCA9IGluZGV4O1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl8kYmFzZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlSW5kZXgodGhpcy5fJGJhc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgZ2V0dGVyOiBsaW5lIG9mZnNldFxyXG4gICAgICAgIHB1YmxpYyBnZXQgb2Zmc2V0KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgc2V0dGVyOiBsaW5lIG9mZnNldFxyXG4gICAgICAgIHB1YmxpYyBzZXQgb2Zmc2V0KG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IG9mZnNldDtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fJGJhc2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlT2Zmc2V0KHRoaXMuXyRiYXNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGdldHRlcjogaW5mb1xyXG4gICAgICAgIHB1YmxpYyBnZXQgaW5mbygpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5mbztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vISBCYXNlIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4jjga7nlJ/miJBcclxuICAgICAgICBwcml2YXRlIHByZXBhcmVCYXNlRWxlbWVudCgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICBsZXQgJGJhc2U6IEpRdWVyeTtcclxuICAgICAgICAgICAgY29uc3QgJG1hcCA9IHRoaXMuX293bmVyLmdldFNjcm9sbE1hcEVsZW1lbnQoKTtcclxuICAgICAgICAgICAgY29uc3QgJHJlY3ljbGUgPSB0aGlzLl9vd25lci5maW5kUmVjeWNsZUVsZW1lbnRzKCkuZmlyc3QoKTtcclxuICAgICAgICAgICAgY29uc3QgaXRlbVRhZ05hbWUgPSB0aGlzLl9vd25lci5nZXRMaXN0Vmlld09wdGlvbnMoKS5pdGVtVGFnTmFtZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuXyRiYXNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ0aGlzLl8kYmFzZSBpcyBub3QgbnVsbC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fJGJhc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgwIDwgJHJlY3ljbGUubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAkYmFzZSA9ICRyZWN5Y2xlO1xyXG4gICAgICAgICAgICAgICAgJGJhc2UucmVtb3ZlQXR0cihcInotaW5kZXhcIik7XHJcbiAgICAgICAgICAgICAgICAkYmFzZS5yZW1vdmVDbGFzcyhfQ29uZmlnLlJFQ1lDTEVfQ0xBU1MpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGJhc2UgPSAkKFwiPFwiICsgaXRlbVRhZ05hbWUgKyBcIiBjbGFzcz0nXCIgKyBfQ29uZmlnLkxJU1RJVEVNX0JBU0VfQ0xBU1MgKyBcIic+PC9cIiArIGl0ZW1UYWdOYW1lICsgXCI+XCIpO1xyXG4gICAgICAgICAgICAgICAgJGJhc2UuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcbiAgICAgICAgICAgICAgICAkbWFwLmFwcGVuZCgkYmFzZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOmrmOOBleOBruabtOaWsFxyXG4gICAgICAgICAgICBpZiAoJGJhc2UuaGVpZ2h0KCkgIT09IHRoaXMuX2hlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgJGJhc2UuaGVpZ2h0KHRoaXMuX2hlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIGluZGV4IOOBruioreWumlxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUluZGV4KCRiYXNlKTtcclxuICAgICAgICAgICAgLy8gb2Zmc2V0IOOBruabtOaWsFxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZU9mZnNldCgkYmFzZSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGJhc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgZ2xvYmFsIGluZGV4IOOBruabtOaWsFxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlSW5kZXgoJGJhc2U6IEpRdWVyeSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoJGJhc2UuYXR0cihfQ29uZmlnLkRBVEFfQ09OVEFJTkVSX0lOREVYKSAhPT0gdGhpcy5faW5kZXgudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgJGJhc2UuYXR0cihfQ29uZmlnLkRBVEFfQ09OVEFJTkVSX0lOREVYLCB0aGlzLl9pbmRleC50b1N0cmluZygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHBhZ2UgaW5kZXgg44Gu5pu05pawXHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVQYWdlSW5kZXgoJGJhc2U6IEpRdWVyeSk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoJGJhc2UuYXR0cihfQ29uZmlnLkRBVEFfUEFHRV9JTkRFWCkgIT09IHRoaXMuX3BhZ2VJbmRleC50b1N0cmluZygpKSB7XHJcbiAgICAgICAgICAgICAgICAkYmFzZS5hdHRyKF9Db25maWcuREFUQV9QQUdFX0lOREVYLCB0aGlzLl9wYWdlSW5kZXgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBvZmZzZXQg44Gu5pu05pawXHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVPZmZzZXQoJGJhc2U6IEpRdWVyeSk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSB7fTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX293bmVyLmdldExpc3RWaWV3T3B0aW9ucygpLmVuYWJsZVRyYW5zZm9ybU9mZnNldCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKF9Ub29sQ1NTLmdldENzc01hdHJpeFZhbHVlKCRiYXNlLCBcInRyYW5zbGF0ZVlcIikgIT09IHRoaXMuX29mZnNldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX1Rvb2xDU1MuY3NzUHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJhbnNmb3JtW19Ub29sQ1NTLmNzc1ByZWZpeGVzW2ldICsgXCJ0cmFuc2Zvcm1cIl0gPSBcInRyYW5zbGF0ZTNkKDBweCxcIiArIHRoaXMuX29mZnNldCArIFwicHgsMHB4KVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkYmFzZS5jc3ModHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJzZUludCgkYmFzZS5jc3MoXCJ0b3BcIiksIDEwKSAhPT0gdGhpcy5fb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGJhc2UuY3NzKFwidG9wXCIsIHRoaXMuX29mZnNldCArIFwicHhcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlBhZ2VQcm9maWxlXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQYWdlUHJvZmlsZVxyXG4gICAgICogQGJyaWVmIDEg44Oa44O844K444Gr6Zai44GZ44KL44OX44Ot44OV44Kh44Kk44Or44Kv44Op44K5XHJcbiAgICAgKiAgICAgICAgZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCi1xyXG4gICAgICogICAgICAgIOacrOOCr+ODqeOCueOBp+OBr+ebtOaOpSBET00g44KS5pON5L2c44GX44Gm44Gv44GE44GR44Gq44GEXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlUHJvZmlsZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBfaW5kZXg6IG51bWJlciA9IDA7ICAgICAgICAgICAgIC8vITwgcGFnZSBpbmRleFxyXG4gICAgICAgIHByaXZhdGUgX29mZnNldDogbnVtYmVyID0gMDsgICAgICAgICAgICAvLyE8IHBhZ2Ug44GuIFRvcCDjgYvjgonjga7jgqrjg5Xjgrvjg4Pjg4hcclxuICAgICAgICBwcml2YXRlIF9oZWlnaHQ6IG51bWJlciA9IDA7ICAgICAgICAgICAgLy8hPCBwYWdlIOOBrumrmOOBlVxyXG4gICAgICAgIHByaXZhdGUgX2xpbmVzOiBMaW5lUHJvZmlsZVtdID0gW107ICAgICAvLyE8IHBhZ2Ug5YaF44Gn566h55CG44GV44KM44KLIExpbmVQcm9maWxlXHJcbiAgICAgICAgcHJpdmF0ZSBfc3RhdHVzOiBzdHJpbmcgPSBcImluYWN0aXZlXCI7ICAgLy8hPCBwYWdlIOOBrueKtuaFiyBbIGluYWN0aXZlIHwgaGlkZGVuIHwgYWN0aXZlIF1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEg5pyJ5Yq55YyWXHJcbiAgICAgICAgcHVibGljIGFjdGl2YXRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoXCJhY3RpdmVcIiAhPT0gdGhpcy5fc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saW5lcy5mb3JFYWNoKChsaW5lOiBMaW5lUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmUuYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1cyA9IFwiYWN0aXZlXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg54Sh5Y+v6KaW5YyWXHJcbiAgICAgICAgcHVibGljIGhpZGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChcImhpZGRlblwiICE9PSB0aGlzLl9zdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzLmZvckVhY2goKGxpbmU6IExpbmVQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZS5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9zdGF0dXMgPSBcImhpZGRlblwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeEoeWKueWMllxyXG4gICAgICAgIHB1YmxpYyBpbmFjdGl2YXRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoXCJpbmFjdGl2ZVwiICE9PSB0aGlzLl9zdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzLmZvckVhY2goKGxpbmU6IExpbmVQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZS5pbmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9zdGF0dXMgPSBcImluYWN0aXZlXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgTGluZVByb2ZpbGUg44KS6Kit5a6aXHJcbiAgICAgICAgcHVibGljIHB1c2gobGluZTogTGluZVByb2ZpbGUpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fbGluZXMucHVzaChsaW5lKTtcclxuICAgICAgICAgICAgdGhpcy5faGVpZ2h0ICs9IGxpbmUuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOmFjeS4i+OBriBMaW5lUHJvZmlsZSDjgZnjgbnjgabjgYzmnInlirnjgafjgarjgYTloLTlkIjjgIFQYWdlIOOCueODhuODvOOCv+OCueOCkueEoeWKueOBq+OBmeOCi1xyXG4gICAgICAgIHB1YmxpYyBub3JtYWxpemUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVuYWJsZUFsbCA9IF8uZXZlcnkodGhpcy5fbGluZXMsIChsaW5lOiBMaW5lUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbmUuaXNBY3RpdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmICghZW5hYmxlQWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXMgPSBcImluYWN0aXZlXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBMaW5lUHJvZmlsZSDjgpLlj5blvpdcclxuICAgICAgICBwdWJsaWMgZ2V0TGluZVByb2ZpbGUoaW5kZXg6IG51bWJlcik6IExpbmVQcm9maWxlIHtcclxuICAgICAgICAgICAgaWYgKDAgPD0gaW5kZXggJiYgaW5kZXggPCB0aGlzLl9saW5lcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9saW5lc1tpbmRleF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOacgOWIneOBriBMaW5lUHJvZmlsZSDjgpLlj5blvpdcclxuICAgICAgICBwdWJsaWMgZ2V0TGluZVByb2ZpbGVGaXJzdCgpOiBMaW5lUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldExpbmVQcm9maWxlKDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOacgOW+jOOBriBMaW5lUHJvZmlsZSDjgpLlj5blvpdcclxuICAgICAgICBwdWJsaWMgZ2V0TGluZVByb2ZpbGVMYXN0KCk6IExpbmVQcm9maWxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TGluZVByb2ZpbGUodGhpcy5fbGluZXMubGVuZ3RoIC0gMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIGdldHRlci9zZXR0ZXIgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEgZ2V0dGVyOiBwYWdlIGluZGV4XHJcbiAgICAgICAgcHVibGljIGdldCBpbmRleCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5kZXg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgc2V0dGVyOiBwYWdlIGluZGV4XHJcbiAgICAgICAgcHVibGljIHNldCBpbmRleChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgZ2V0dGVyOiBwYWdlIG9mZnNldFxyXG4gICAgICAgIHB1YmxpYyBnZXQgb2Zmc2V0KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vZmZzZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgc2V0dGVyOiBwYWdlIG9mZnNldFxyXG4gICAgICAgIHB1YmxpYyBzZXQgb2Zmc2V0KG9mZnNldDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29mZnNldCA9IG9mZnNldDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBnZXR0ZXI6IOWun+mam+OBq+ODmuODvOOCuOOBq+WJsuOCiuW9k+OBpuOCieOCjOOBpuOBhOOCi+mrmOOBlVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGVpZ2h0KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgZ2V0dGVyOiDnirbmhYvlj5blvpdcclxuICAgICAgICBwdWJsaWMgZ2V0IHN0YXR1cygpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuR3JvdXBQcm9maWxlXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBHcm91cFByb2ZpbGVcclxuICAgICAqIEBicmllZiDjg6njgqTjg7PjgpLjgrDjg6vjg7zjg5fnrqHnkIbjgZnjgovjg5fjg63jg5XjgqHjgqTjg6vjgq/jg6njgrlcclxuICAgICAqICAgICAgICDmnKzjgq/jg6njgrnjgafjga/nm7TmjqUgRE9NIOOCkuaTjeS9nOOBl+OBpuOBr+OBhOOBkeOBquOBhFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgR3JvdXBQcm9maWxlIHtcclxuICAgICAgICBwcml2YXRlIF9wYXJlbnQ6IEdyb3VwUHJvZmlsZSA9IG51bGw7ICAgICAgIC8vITwg6KaqIEdyb3VwUHJvZmlsZSDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICBwcml2YXRlIF9jaGlsZHJlbjogR3JvdXBQcm9maWxlW10gPSBbXTsgICAgIC8vITwg5a2QIEdyb3VwUHJvZmlsZSDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICBwcml2YXRlIF9leHBhbmRlZDogYm9vbGVhbiA9IGZhbHNlOyAgICAgICAgIC8vITwg6ZaL6ZaJ5oOF5aCxXHJcbiAgICAgICAgcHJpdmF0ZSBfc3RhdHVzOiBzdHJpbmcgPSBcInVucmVnaXN0ZXJlZFwiOyAgIC8vITwgX293bmVyIOOBuOOBrueZu+mMsueKtuaFiyBbIHVucmVnaXN0ZXJlZCB8IHJlZ2lzdGVyZWQgXVxyXG4gICAgICAgIHByaXZhdGUgX21hcExpbmVzID0ge307ICAgICAgICAgICAgICAgICAgICAgLy8hPCDoh6rouqvjgYznrqHovYTjgZnjgosgTGluZVByb2ZpbGUg44KSIGtleSDjgajjgajjgoLjgavmoLzntI1cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBMQVlPVVRfS0VZX0RFRkFVTFQgPSBcIi1sYXlvdXQtZGVmYXVsdFwiO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIF9pZCAgICB7U3RyaW5nfSAgICAgICAgICAgICBbaW5dIEdyb3VwUHJvZmlsZSDjga4gSURcclxuICAgICAgICAgKiBAcGFyYW0gX293bmVyIHtFeHBhbmRhYmxlTGlzdFZpZXd9IFtpbl0g566h55CG6ICF44Gn44GC44KLIEV4cGFuZGFibGVMaXN0VmlldyDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9pZDogc3RyaW5nLCBwcml2YXRlIF9vd25lcjogQmFzZUV4cGFuZGFibGVMaXN0Vmlldykge1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOacrCBHcm91cFByb2ZpbGUg44GM566h55CG44GZ44KLIExpc3Qg44KS5L2c5oiQ44GX44Gm55m76YyyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gaGVpZ2h0ICAgICAge051bWJlcn0gICBbaW5dIOODqeOCpOODs+OBrumrmOOBlVxyXG4gICAgICAgICAqIEBwYXJhbSBpbml0aWFsaXplciB7RnVuY3Rpb259IFtpbl0gTGlzdEl0ZW1WaWV3IOa0vueUn+OCr+ODqeOCueOBruOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gICAgICAgICAqIEBwYXJhbSBpbmZvICAgICAgICB7T2JqZWN0fSAgIFtpbl0gaW5pdGlhbGl6ZXIg44Gr5rih44GV44KM44KL44Kq44OX44K344On44Oz5byV5pWwXHJcbiAgICAgICAgICogQHBhcmFtIGxheW91dEtleSAgIHtTdHJpbmd9ICAgW2luXSBsYXlvdXQg5q+O44Gr5L2/55So44GZ44KL6K2Y5Yil5a2QICjjgqrjg5fjgrfjg6fjg4rjg6spXHJcbiAgICAgICAgICogQHJldHVybiB7R3JvdXBQcm9maWxlfSDmnKzjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgYWRkSXRlbShcclxuICAgICAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgICAgIGluaXRpYWxpemVyOiBuZXcgKG9wdGlvbnM/OiBhbnkpID0+IEJhc2VMaXN0SXRlbVZpZXcsXHJcbiAgICAgICAgICAgIGluZm86IGFueSxcclxuICAgICAgICAgICAgbGF5b3V0S2V5Pzogc3RyaW5nXHJcbiAgICAgICAgKTogR3JvdXBQcm9maWxlIHtcclxuICAgICAgICAgICAgbGV0IGxpbmU6IExpbmVQcm9maWxlO1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb25zID0gJC5leHRlbmQoe30sIHsgZ3JvdXBQcm9maWxlOiB0aGlzIH0sIGluZm8pO1xyXG5cclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gbGF5b3V0S2V5KSB7XHJcbiAgICAgICAgICAgICAgICBsYXlvdXRLZXkgPSBHcm91cFByb2ZpbGUuTEFZT1VUX0tFWV9ERUZBVUxUO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHRoaXMuX21hcExpbmVzW2xheW91dEtleV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcExpbmVzW2xheW91dEtleV0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGluZSA9IG5ldyBMaW5lUHJvZmlsZSh0aGlzLl9vd25lci5jb3JlLCBNYXRoLmZsb29yKGhlaWdodCksIGluaXRpYWxpemVyLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIC8vIF9vd25lciDjga7nrqHnkIbkuIvjgavjgYLjgovjgajjgY3jga/pgJ/jgoTjgYvjgavov73liqBcclxuICAgICAgICAgICAgaWYgKChcInJlZ2lzdGVyZWRcIiA9PT0gdGhpcy5fc3RhdHVzKSAmJlxyXG4gICAgICAgICAgICAgICAgKG51bGwgPT0gdGhpcy5fb3duZXIubGF5b3V0S2V5IHx8IGxheW91dEtleSA9PT0gdGhpcy5fb3duZXIubGF5b3V0S2V5KSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3duZXIuX2FkZExpbmUobGluZSwgdGhpcy5nZXRMYXN0TGluZUluZGV4KCkgKyAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX21hcExpbmVzW2xheW91dEtleV0ucHVzaChsaW5lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlrZAgR3JvdXAg44KS6L+95YqgXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdGFyZ2V0IHtHcm91cFByb2ZpbGV8R3JvdXBQcm9maWxlW119IFtpbl0gR3JvdXBQcm9maWxlIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqIEByZXR1cm4ge0dyb3VwUHJvZmlsZX0g5pys44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGFkZENoaWxkcmVuKHRhcmdldDogR3JvdXBQcm9maWxlKTogR3JvdXBQcm9maWxlO1xyXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZHJlbih0YXJnZXQ6IEdyb3VwUHJvZmlsZVtdKTogR3JvdXBQcm9maWxlO1xyXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZHJlbih0YXJnZXQ6IGFueSk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuOiBHcm91cFByb2ZpbGVbXSA9ICh0YXJnZXQgaW5zdGFuY2VvZiBBcnJheSkgPyB0YXJnZXQgOiBbdGFyZ2V0XTtcclxuICAgICAgICAgICAgY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoaWxkLnNldFBhcmVudCh0aGlzKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuID0gdGhpcy5fY2hpbGRyZW4uY29uY2F0KGNoaWxkcmVuKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDopqogR3JvdXBQcm9maWxlIOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7R3JvdXBQcm9maWxlfSBHcm91cFByb2ZpbGUg6KaqIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBnZXRQYXJlbnQoKTogR3JvdXBQcm9maWxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWtkCBHcm91cFByb2ZpbGUg44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtHcm91cFByb2ZpbGVbXX0gR3JvdXBQcm9maWxlIOWtkCDjgqTjg7Pjgrnjgr/jg7PjgrnphY3liJdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW4oKTogR3JvdXBQcm9maWxlW10ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlrZAgR3JvdXAg44KS5oyB44Gj44Gm44GE44KL44GL5Yik5a6aXHJcbiAgICAgICAgICogbGF5b3V0S2V5IOOBjOaMh+WumuOBleOCjOOCjOOBsOOAgWxheW91dCDjga7nirbmhYvjgb7jgafliKTlrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBsYXlvdXRLZXkge1N0cmluZ30gW2luXSBsYXlvdXQg5q+O44Gr5L2/55So44GZ44KL6K2Y5Yil5a2QICjjgqrjg5fjgrfjg6fjg4rjg6spXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5pyJLCBmYWxzZTog54ShXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGhhc0NoaWxkcmVuKGxheW91dEtleT86IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY2hpbGRyZW4ubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChudWxsICE9IGxheW91dEtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuWzBdLmhhc0xheW91dEtleU9mKGxheW91dEtleSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogbGF5b3V0IOOBrueKtuaFi+OCkuWIpOWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGxheW91dEtleSB7U3RyaW5nfSBbaW5dIGxheW91dCDmr47jgavkvb/nlKjjgZnjgovorZjliKXlrZBcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDmnIksIGZhbHNlOiDnhKFcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgaGFzTGF5b3V0S2V5T2YobGF5b3V0S2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gbGF5b3V0S2V5KSB7XHJcbiAgICAgICAgICAgICAgICBsYXlvdXRLZXkgPSBHcm91cFByb2ZpbGUuTEFZT1VUX0tFWV9ERUZBVUxUO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAobnVsbCAhPSB0aGlzLl9tYXBMaW5lc1tsYXlvdXRLZXldKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCsOODq+ODvOODl+WxlemWi1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBleHBhbmQoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBsaW5lczogTGluZVByb2ZpbGVbXSA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbGluZXMubGVuZ3RoIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidGhpcyBncm91cCBoYXMgbm8gbGluZXMuXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmhhc0NoaWxkcmVuKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInRoaXMgZ3JvdXAgaGFzIG5vIGNoaWxkcmVuLlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5pc0V4cGFuZGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIGxpbmVzID0gdGhpcy5xdWVyeU9wZXJhdGlvblRhcmdldChcInJlZ2lzdGVyZWRcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9leHBhbmRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoMCA8IGxpbmVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLnN0YXR1c1Njb3BlKFwiZXhwYW5kaW5nXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6Ieq6Lqr44KS5pu05pawXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzLmZvckVhY2goKGxpbmU6IExpbmVQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOmFjeS4i+OCkuabtOaWsFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vd25lci5fYWRkTGluZShsaW5lcywgdGhpcy5nZXRMYXN0TGluZUluZGV4KCkgKyAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3duZXIudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCsOODq+ODvOODl+WPjuadn1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRlbGF5IHtOdW1iZXJ9IFtpbl0g6KaB57Sg5YmK6Zmk44Gr6LK744KE44GZ6YGF5bu25pmC6ZaTLiDml6Llrpo6IGFuaW1hdGlvbkR1cmF0aW9uIOWApFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBjb2xsYXBzZShkZWxheT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbGluZXM6IExpbmVQcm9maWxlW10gPSBbXTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc0NoaWxkcmVuKCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInRoaXMgZ3JvdXAgaGFzIG5vIGNoaWxkcmVuLlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzRXhwYW5kZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgbGluZXMgPSB0aGlzLnF1ZXJ5T3BlcmF0aW9uVGFyZ2V0KFwidW5yZWdpc3RlcmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZXhwYW5kZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGlmICgwIDwgbGluZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsYXkgPSAobnVsbCAhPSBkZWxheSkgPyBkZWxheSA6IHRoaXMuX293bmVyLmNvcmUuZ2V0TGlzdFZpZXdPcHRpb25zKCkuYW5pbWF0aW9uRHVyYXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3duZXIuc3RhdHVzU2NvcGUoXCJjb2xsYXBzaW5nXCIsICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8g6Ieq6Lqr44KS5pu05pawXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzLmZvckVhY2goKGxpbmU6IExpbmVQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOmFjeS4i+OCkuabtOaWsFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9vd25lci5yZW1vdmVJdGVtKGxpbmVzWzBdLmluZGV4LCBsaW5lcy5sZW5ndGgsIGRlbGF5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3duZXIudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOiHqui6q+OCkuODquOCueODiOOBruWPr+imlumgmOWfn+OBq+ihqOekulxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0Vuc3VyZVZpc2libGVPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGVuc3VyZVZpc2libGUob3B0aW9ucz86IEVuc3VyZVZpc2libGVPcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICgwIDwgdGhpcy5fbGluZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vd25lci5lbnN1cmVWaXNpYmxlKHRoaXMuX2xpbmVzWzBdLmluZGV4LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChudWxsICE9IG9wdGlvbnMuY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMuY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6ZaL6ZaJ44Gu44OI44Kw44OrXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGVsYXkge051bWJlcn0gW2luXSBjb2xsYXBzZSDjga7opoHntKDliYrpmaTjgavosrvjgoTjgZnpgYXlu7bmmYLplpMuIOaXouWumjogYW5pbWF0aW9uRHVyYXRpb24g5YCkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIHRvZ2dsZShkZWxheT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fZXhwYW5kZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sbGFwc2UoZGVsYXkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5leHBhbmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5bGV6ZaL54q25oWL44KS5Yik5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDlsZXplossIGZhbHNlOuWPjuadn1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBpc0V4cGFuZGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kZWQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBsaXN0IHZpZXcg44G455m76YyyXHJcbiAgICAgICAgICogVG9wIEdyb3VwIOOBruOBv+eZu+mMsuWPr+iDvVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGluc2VydFRvIHtOdW1iZXJ9IOaMv+WFpeS9jee9ruOCkiBpbmRleCDjgafmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJuIHtHcm91cFByb2ZpbGV9IOacrOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyByZWdpc3RlcihpbnNlcnRUbzogbnVtYmVyKTogR3JvdXBQcm9maWxlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImxvZ2ljIGVycm9yOiAncmVnaXN0ZXInIG1ldGhvZCBpcyBhY2NlcHRhYmxlIG9ubHkgdG9wIGdyb3VwLlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLl9hZGRMaW5lKHRoaXMucHJlcHJvY2VzcyhcInJlZ2lzdGVyZWRcIiksIGluc2VydFRvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGxpc3QgdmlldyDjgbjlvqnlhYNcclxuICAgICAgICAgKiBUb3AgR3JvdXAg44Gu44G/55m76Yyy5Y+v6IO9XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtHcm91cFByb2ZpbGV9IOacrOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyByZXN0b3JlKCk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5lczogTGluZVByb2ZpbGVbXSA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwibG9naWMgZXJyb3I6ICdyZXN0b3JlJyBtZXRob2QgaXMgYWNjZXB0YWJsZSBvbmx5IHRvcCBncm91cC5cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fbGluZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9leHBhbmRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzID0gdGhpcy5fbGluZXMuY29uY2F0KHRoaXMucXVlcnlPcGVyYXRpb25UYXJnZXQoXCJhY3RpdmVcIikpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IHRoaXMuX2xpbmVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3duZXIuX2FkZExpbmUobGluZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6YWN5LiL44Gu5pyA5b6M44GuIGxpbmUgaW5kZXgg44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gd2l0aEFjdGl2ZUNoaWxkcmVuIHtCb29sZWFufSBbaW5dIOeZu+mMsua4iOOBv+OBruWtkCBHcm91cFByb2ZpbGUg44KS5ZCr44KB44Gm5qSc57Si44GZ44KL5aC05ZCI44GvIHRydWUg44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfSBpbmRleC4g44Ko44Op44O844Gu5aC05ZCI44GvIG51bGwuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGdldExhc3RMaW5lSW5kZXgod2l0aEFjdGl2ZUNoaWxkcmVuOiBib29sZWFuID0gZmFsc2UpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBjb25zdCBsaW5lczogTGluZVByb2ZpbGVbXSA9ICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgX2xpbmVzOiBMaW5lUHJvZmlsZVtdO1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpdGhBY3RpdmVDaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIF9saW5lcyA9IHRoaXMucXVlcnlPcGVyYXRpb25UYXJnZXQoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCA9PSBsaW5lcyB8fCBsaW5lcy5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIF9saW5lcyA9IHRoaXMuX2xpbmVzO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIF9saW5lcztcclxuICAgICAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChsaW5lcy5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImxvZ2ljIGVycm9yOiB0aGlzIGdyb3VwIGlzIHN0aWwgbm90IHJlZ2lzdGVyZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGluZXNbbGluZXMubGVuZ3RoIC0gMV0uaW5kZXg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIElEIOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSDlibLjgormjK/jgonjgozjgZ8gSURcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXQgaWQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44K544OG44O844K/44K544KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtTdHJpbmd9IOOCueODhuODvOOCv+OCueaWh+Wtl+WIl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldCBzdGF0dXMoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1cztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJpdmF0ZSBtZXRob2RcclxuXHJcbiAgICAgICAgLyogdHNsaW50OmRpc2FibGU6bm8tdW51c2VkLXZhcmlhYmxlICovXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOimqiBHcm91cCDmjIflrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBwYXJlbnQge0dyb3VwUHJvZmlsZX0gW2luXSDopqogR3JvdXBQcm9maWxlIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgc2V0UGFyZW50KHBhcmVudDogR3JvdXBQcm9maWxlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHRzbGludDplbmFibGU6bm8tdW51c2VkLXZhcmlhYmxlICovXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHJlZ2lzdGVyIC8gdW5yZWdpc3RlciDjga7liY3lh6bnkIZcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBuZXdTdGF0dXMge1N0cmluZ30gW2luXSDmlrDjgrnjg4bjg7zjgr/jgrnmloflrZfliJdcclxuICAgICAgICAgKiBAcmV0dXJuIHtMaW5lUHJvZmlsZVtdfSDmm7TmlrDjgZnjgbnjgY0gTGluZVByb2ZpbGUg44Gu6YWN5YiXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBwcmVwcm9jZXNzKG5ld1N0YXR1czogc3RyaW5nKTogTGluZVByb2ZpbGVbXSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5lczogTGluZVByb2ZpbGVbXSA9IFtdO1xyXG4gICAgICAgICAgICBpZiAobmV3U3RhdHVzICE9PSB0aGlzLl9zdGF0dXMgJiYgbnVsbCAhPSB0aGlzLl9saW5lcykge1xyXG4gICAgICAgICAgICAgICAgbGluZXMgPSB0aGlzLl9saW5lcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9zdGF0dXMgPSBuZXdTdGF0dXM7XHJcbiAgICAgICAgICAgIHJldHVybiBsaW5lcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaTjeS9nOWvvuixoeOBriBMaW5lUHJvZmlsZSDphY3liJfjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBuZXdTdGF0dXMge1N0cmluZ30gW2luXSDmlrDjgrnjg4bjg7zjgr/jgrnmloflrZfliJdcclxuICAgICAgICAgKiBAcmV0dXJuIHtMaW5lUHJvZmlsZVtdfSDmk43kvZzlr77osaHjga4gTGluZVByb2ZpbGUg44Gu6YWN5YiXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBxdWVyeU9wZXJhdGlvblRhcmdldChvcGVyYXRpb246IHN0cmluZyk6IExpbmVQcm9maWxlW10ge1xyXG4gICAgICAgICAgICBjb25zdCBmaW5kVGFyZ2V0cyA9IChncm91cDogR3JvdXBQcm9maWxlKTogTGluZVByb2ZpbGVbXSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGluZXM6IExpbmVQcm9maWxlW10gPSBbXTtcclxuICAgICAgICAgICAgICAgIGdyb3VwLl9jaGlsZHJlbi5mb3JFYWNoKChjaGlsZDogR3JvdXBQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChvcGVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInJlZ2lzdGVyZWRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzID0gbGluZXMuY29uY2F0KGNoaWxkLnByZXByb2Nlc3Mob3BlcmF0aW9uKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcInVucmVnaXN0ZXJlZFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMgPSBsaW5lcy5jb25jYXQoY2hpbGQucHJlcHJvY2VzcyhvcGVyYXRpb24pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYWN0aXZlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSBjaGlsZC5fbGluZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IGxpbmVzLmNvbmNhdChjaGlsZC5fbGluZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmtub3duIG9wZXJhdGlvbjogXCIgKyBvcGVyYXRpb24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGQuaXNFeHBhbmRlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzID0gbGluZXMuY29uY2F0KGZpbmRUYXJnZXRzKGNoaWxkKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGluZXM7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBmaW5kVGFyZ2V0cyh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOiHqui6q+OBrueuoeeQhuOBmeOCi+OCouOCr+ODhuOCo+ODluOBqiBMaW5lUHJvZmllIOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7TGluZVByb2ZpbGVbXX0gTGluZVByb2ZpZSDphY3liJdcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIGdldCBfbGluZXMoKTogTGluZVByb2ZpbGVbXSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IHRoaXMuX293bmVyLmxheW91dEtleTtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0ga2V5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFwTGluZXNba2V5XTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXBMaW5lc1tHcm91cFByb2ZpbGUuTEFZT1VUX0tFWV9ERUZBVUxUXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgX1V0aWxzID0gQ0RQLlVJLl9MaXN0Vmlld1V0aWxzO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5TY3JvbGxlckVsZW1lbnRdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFNjcm9sbGVyRWxlbWVudFxyXG4gICAgICogQGJyaWVmIEhUTUxFbGVtZW50IOOBriBTY3JvbGxlciDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFNjcm9sbGVyRWxlbWVudCBpbXBsZW1lbnRzIElTY3JvbGxlciB7XHJcbiAgICAgICAgcHJpdmF0ZSBfJHRhcmdldDogSlF1ZXJ5ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF8kc2Nyb2xsTWFwOiBKUXVlcnkgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX2xpc3R2aWV3T3B0aW9uczogTGlzdFZpZXdPcHRpb25zID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8hIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgY29uc3RydWN0b3IoZWxlbWVudDogc3RyaW5nLCBvcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBvcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IGFueSwgb3B0aW9uczogTGlzdFZpZXdPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQgPSAkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLl9saXN0dmlld09wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbGVyIOOBruWei+OCkuWPluW+l1xyXG4gICAgICAgIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFNjcm9sbGVyRWxlbWVudC5UWVBFO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHBvc2l0aW9uIOWPluW+l1xyXG4gICAgICAgIGdldFBvcygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJHRhcmdldC5zY3JvbGxUb3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBwb3NpdGlvbiDjga7mnIDlpKflgKTjgpLlj5blvpdcclxuICAgICAgICBnZXRQb3NNYXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gdGhpcy5fJHNjcm9sbE1hcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJHNjcm9sbE1hcCA9IHRoaXMuXyR0YXJnZXQuY2hpbGRyZW4oKS5maXJzdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBfVXRpbHMubWF4KHRoaXMuXyRzY3JvbGxNYXAuaGVpZ2h0KCkgLSB0aGlzLl8kdGFyZ2V0LmhlaWdodCgpLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgqTjg5njg7Pjg4jnmbvpjLJcclxuICAgICAgICBvbih0eXBlOiBzdHJpbmcsIGZ1bmM6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjcm9sbFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQub24oXCJzY3JvbGxcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsc3RvcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQub24oXCJzY3JvbGxzdG9wXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bnN1cHBvcnRlZCB0eXBlOiBcIiArIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Kk44OZ44Oz44OI55m76Yyy6Kej6ZmkXHJcbiAgICAgICAgb2ZmKHR5cGU6IHN0cmluZywgZnVuYzogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJHRhcmdldC5vZmYoXCJzY3JvbGxcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsc3RvcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQub2ZmKFwic2Nyb2xsc3RvcFwiLCBmdW5jKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5zdXBwb3J0ZWQgdHlwZTogXCIgKyB0eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+S9jee9ruOCkuaMh+WumlxyXG4gICAgICAgIHNjcm9sbFRvKHBvczogbnVtYmVyLCBhbmltYXRlPzogYm9vbGVhbiwgdGltZT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2xpc3R2aWV3T3B0aW9ucy5lbmFibGVBbmltYXRpb24gfHwgIWFuaW1hdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQuc2Nyb2xsVG9wKHBvcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCA9PSB0aW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZSA9IHRoaXMuX2xpc3R2aWV3T3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQuYW5pbWF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG9wOiBwb3NcclxuICAgICAgICAgICAgICAgIH0sIHRpbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgU2Nyb2xsZXIg44Gu54q25oWL5pu05pawXHJcbiAgICAgICAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICAvLyBub29wLlxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbGVyIOOBruegtOajhFxyXG4gICAgICAgIGRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRzY3JvbGxNYXAgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fJHRhcmdldCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJHRhcmdldC5vZmYoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K/44Kk44OX5a6a576pXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXQgVFlQRSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJlbGVtZW50LW92ZXJmbG93XCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgZmFjdG9yeSDlj5blvpdcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldEZhY3RvcnkoKTogKGVsZW1lbnQ6IGFueSwgb3B0aW9uczogTGlzdFZpZXdPcHRpb25zKSA9PiBJU2Nyb2xsZXIge1xyXG4gICAgICAgICAgICBjb25zdCBmYWN0b3J5ID0gKGVsZW1lbnQ6IGFueSwgb3B0aW9uczogTGlzdFZpZXdPcHRpb25zKTogSVNjcm9sbGVyID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU2Nyb2xsZXJFbGVtZW50KGVsZW1lbnQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBzZXQgdHlwZSBzaWduYXR1cmUuXHJcbiAgICAgICAgICAgICg8YW55PmZhY3RvcnkpLnR5cGUgPSBTY3JvbGxlckVsZW1lbnQuVFlQRTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBfVXRpbHMgPSBDRFAuVUkuX0xpc3RWaWV3VXRpbHM7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLlNjcm9sbGVyTmF0aXZlXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBTY3JvbGxlck5hdGl2ZVxyXG4gICAgICogQGJyaWVmIEJyb3dzZXIgTmF0aXZlIOOBriBTY3JvbGxlciDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFNjcm9sbGVyTmF0aXZlIGltcGxlbWVudHMgSVNjcm9sbGVyIHtcclxuICAgICAgICBwcml2YXRlIF8kYm9keTogSlF1ZXJ5ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF8kdGFyZ2V0OiBKUXVlcnkgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX2xpc3R2aWV3T3B0aW9uczogTGlzdFZpZXdPcHRpb25zID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8hIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9uczogTGlzdFZpZXdPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQgPSAkKGRvY3VtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5fJGJvZHkgPSAkKFwiYm9keVwiKTtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdHZpZXdPcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGxlciDjga7lnovjgpLlj5blvpdcclxuICAgICAgICBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBTY3JvbGxlck5hdGl2ZS5UWVBFO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHBvc2l0aW9uIOWPluW+l1xyXG4gICAgICAgIGdldFBvcygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJHRhcmdldC5zY3JvbGxUb3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBwb3NpdGlvbiDjga7mnIDlpKflgKTjgpLlj5blvpdcclxuICAgICAgICBnZXRQb3NNYXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9VdGlscy5tYXgodGhpcy5fJHRhcmdldC5oZWlnaHQoKSAtIHdpbmRvdy5pbm5lckhlaWdodCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Kk44OZ44Oz44OI55m76YyyXHJcbiAgICAgICAgb24odHlwZTogc3RyaW5nLCBmdW5jOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kdGFyZ2V0Lm9uKFwic2Nyb2xsXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjcm9sbHN0b3BcIjpcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oXCJzY3JvbGxzdG9wXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bnN1cHBvcnRlZCB0eXBlOiBcIiArIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Kk44OZ44Oz44OI55m76Yyy6Kej6ZmkXHJcbiAgICAgICAgb2ZmKHR5cGU6IHN0cmluZywgZnVuYzogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJHRhcmdldC5vZmYoXCJzY3JvbGxcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsc3RvcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJzY3JvbGxzdG9wXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bnN1cHBvcnRlZCB0eXBlOiBcIiArIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5oyH5a6aXHJcbiAgICAgICAgc2Nyb2xsVG8ocG9zOiBudW1iZXIsIGFuaW1hdGU/OiBib29sZWFuLCB0aW1lPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fbGlzdHZpZXdPcHRpb25zLmVuYWJsZUFuaW1hdGlvbiB8fCAhYW5pbWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGJvZHkuc2Nyb2xsVG9wKHBvcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCA9PSB0aW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZSA9IHRoaXMuX2xpc3R2aWV3T3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuXyRib2R5LmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogcG9zXHJcbiAgICAgICAgICAgICAgICB9LCB0aW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbGVyIOOBrueKtuaFi+abtOaWsFxyXG4gICAgICAgIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gbm9vcC5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGxlciDjga7noLTmo4RcclxuICAgICAgICBkZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl8kdGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgr/jgqTjg5flrprnvqlcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldCBUWVBFKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIm5hdGl2ZS1zY3JvbGxcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBmYWN0b3J5IOWPluW+l1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0RmFjdG9yeSgpOiAoZWxlbWVudDogYW55LCBvcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpID0+IElTY3JvbGxlciB7XHJcbiAgICAgICAgICAgIGNvbnN0IGZhY3RvcnkgPSAoZWxlbWVudDogYW55LCBvcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpOiBJU2Nyb2xsZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTY3JvbGxlck5hdGl2ZShvcHRpb25zKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gc2V0IHR5cGUgc2lnbmF0dXJlLlxyXG4gICAgICAgICAgICAoPGFueT5mYWN0b3J5KS50eXBlID0gU2Nyb2xsZXJOYXRpdmUuVFlQRTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vIGZvciBub24gaXNjcm9sbCB1c2VyLiBjZHAudWkubGlzdHZpZXcuZC50cyBpbnRlcm5hbCBkZWZpbml0aW9uLlxyXG5pbnRlcmZhY2UgSVNjcm9sbE9wdGlvbnMge1xyXG4gICAgW3g6IHN0cmluZ106IGFueTtcclxuICAgIHByb2JlVHlwZT86IG51bWJlcjsgLy8gW2NhbG0gOjEgPCAyIDwgMzogYWdncmVzc2l2ZV1cclxufVxyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IF9Db25maWcgID0gQ0RQLlVJLkxpc3RWaWV3R2xvYmFsQ29uZmlnO1xyXG4gICAgaW1wb3J0IF9VdGlscyAgID0gQ0RQLlVJLl9MaXN0Vmlld1V0aWxzO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5TY3JvbGxlcklTY3JvbGxdIFwiO1xyXG5cclxuICAgIGludGVyZmFjZSBJU2Nyb2xsRXggZXh0ZW5kcyBJU2Nyb2xsIHtcclxuICAgICAgICBvbjogKHR5cGU6IHN0cmluZywgZm46IChldmVudDogYW55KSA9PiB2b2lkKSA9PiB2b2lkO1xyXG4gICAgICAgIG9mZjogKHR5cGU6IHN0cmluZywgZm46IChldmVudDogYW55KSA9PiB2b2lkKSA9PiB2b2lkO1xyXG4gICAgICAgIHdyYXBwZXI6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIHNjcm9sbGVyOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBzY3JvbGxlcldpZHRoOiBudW1iZXI7XHJcbiAgICAgICAgc2Nyb2xsZXJIZWlnaHQ6IG51bWJlcjtcclxuICAgICAgICBtYXhTY3JvbGxYOiBudW1iZXI7XHJcbiAgICAgICAgbWF4U2Nyb2xsWTogbnVtYmVyO1xyXG4gICAgICAgIGdldENvbXB1dGVkUG9zaXRpb24oKTogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFNjcm9sbGVySVNjcm9sbFxyXG4gICAgICogQGJyaWVmIGlTY3JvbGwg44KS5L2/55So44GX44GfIFNjcm9sbGVyIOOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgU2Nyb2xsZXJJU2Nyb2xsIGltcGxlbWVudHMgSVNjcm9sbGVyIHtcclxuICAgICAgICBwcml2YXRlIF8kb3duZXI6IEpRdWVyeSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfaXNjcm9sbDogSVNjcm9sbEV4ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF9yZWZyZXNoVGltZXJJZDogbnVtYmVyID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF8kd3JhcHBlcjogSlF1ZXJ5ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF8kc2Nyb2xsZXI6IEpRdWVyeSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfbGlzdHZpZXdPcHRpb25zOiBMaXN0Vmlld09wdGlvbnMgPSBudWxsO1xyXG5cclxuICAgICAgICAvLyEgY29uc3RydWN0b3JcclxuICAgICAgICBjb25zdHJ1Y3Rvcigkb3duZXI6IEpRdWVyeSwgZWxlbWVudDogc3RyaW5nLCBpc2Nyb2xsT3B0aW9uczogSVNjcm9sbE9wdGlvbnMsIGxpc3R2aWV3T3B0aW9uczogTGlzdFZpZXdPcHRpb25zKTtcclxuICAgICAgICBjb25zdHJ1Y3Rvcigkb3duZXI6IEpRdWVyeSwgZWxlbWVudDogSFRNTEVsZW1lbnQsIGlzY3JvbGxPcHRpb25zOiBJU2Nyb2xsT3B0aW9ucywgbGlzdHZpZXdPcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCRvd25lcjogSlF1ZXJ5LCBlbGVtZW50OiBhbnksIGlzY3JvbGxPcHRpb25zOiBJU2Nyb2xsT3B0aW9ucywgbGlzdHZpZXdPcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gZ2xvYmFsLklTY3JvbGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRvd25lciA9ICRvd25lcjtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2lzY3JvbGwgPSA8SVNjcm9sbEV4Pm5ldyBJU2Nyb2xsKGVsZW1lbnQsIGlzY3JvbGxPcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyR3cmFwcGVyID0gJCh0aGlzLl9pc2Nyb2xsLndyYXBwZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJHNjcm9sbGVyID0gJCh0aGlzLl9pc2Nyb2xsLnNjcm9sbGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpc3R2aWV3T3B0aW9ucyA9IGxpc3R2aWV3T3B0aW9ucztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJpc2Nyb2xsIG1vZHVsZSBkb2Vzbid0IGxvYWQuXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgU2Nyb2xsZXIg44Gu5Z6L44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gU2Nyb2xsZXJJU2Nyb2xsLlRZUEU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgcG9zaXRpb24g5Y+W5b6XXHJcbiAgICAgICAgZ2V0UG9zKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGxldCBwb3MgPSB0aGlzLl9pc2Nyb2xsLmdldENvbXB1dGVkUG9zaXRpb24oKS55O1xyXG4gICAgICAgICAgICBpZiAoXy5pc05hTihwb3MpKSB7XHJcbiAgICAgICAgICAgICAgICBwb3MgPSAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcG9zID0gLXBvcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcG9zO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHBvc2l0aW9uIOOBruacgOWkp+WApOOCkuWPluW+l1xyXG4gICAgICAgIGdldFBvc01heCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gX1V0aWxzLm1heCgtdGhpcy5faXNjcm9sbC5tYXhTY3JvbGxZLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgqTjg5njg7Pjg4jnmbvpjLJcclxuICAgICAgICBvbih0eXBlOiBzdHJpbmcsIGZ1bmM6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjcm9sbFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzY3JvbGwub24oXCJzY3JvbGxcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsc3RvcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzY3JvbGwub24oXCJzY3JvbGxFbmRcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVuc3VwcG9ydGVkIHR5cGU6IFwiICsgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgqTjg5njg7Pjg4jnmbvpjLLop6PpmaRcclxuICAgICAgICBvZmYodHlwZTogc3RyaW5nLCBmdW5jOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc2Nyb2xsLm9mZihcInNjcm9sbFwiLCBmdW5jKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxzdG9wXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNjcm9sbC5vbihcInNjcm9sbEVuZFwiLCBmdW5jKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5zdXBwb3J0ZWQgdHlwZTogXCIgKyB0eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+S9jee9ruOCkuaMh+WumlxyXG4gICAgICAgIHNjcm9sbFRvKHBvczogbnVtYmVyLCBhbmltYXRlPzogYm9vbGVhbiwgdGltZT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aW1lID0gMDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2xpc3R2aWV3T3B0aW9ucy5lbmFibGVBbmltYXRpb24gJiYgYW5pbWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGltZSA9IHRpbWUgfHwgdGhpcy5fbGlzdHZpZXdPcHRpb25zLmFuaW1hdGlvbkR1cmF0aW9uO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2lzY3JvbGwuc2Nyb2xsVG8oMCwgLXBvcywgdGltZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgU2Nyb2xsZXIg44Gu54q25oWL5pu05pawXHJcbiAgICAgICAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fJG93bmVyKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgd3JhcHBlclxyXG4gICAgICAgICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBvd25lckhlaWdodCA9IHRoaXMuXyRvd25lci5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3duZXJIZWlnaHQgIT09IHRoaXMuXyR3cmFwcGVyLmhlaWdodCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuXyR3cmFwcGVyLmhlaWdodChvd25lckhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9yZWZyZXNoVGltZXJJZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLl9yZWZyZXNoVGltZXJJZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcHJvYyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fJHNjcm9sbGVyICYmIHRoaXMuXyRzY3JvbGxlci5oZWlnaHQoKSAhPT0gdGhpcy5faXNjcm9sbC5zY3JvbGxlckhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc2Nyb2xsLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVmcmVzaFRpbWVySWQgPSBzZXRUaW1lb3V0KHByb2MsIHRoaXMuX2xpc3R2aWV3T3B0aW9ucy5zY3JvbGxNYXBSZWZyZXNoSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlZnJlc2hUaW1lcklkID0gbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX2lzY3JvbGwucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVmcmVzaFRpbWVySWQgPSBzZXRUaW1lb3V0KHByb2MsIHRoaXMuX2xpc3R2aWV3T3B0aW9ucy5zY3JvbGxNYXBSZWZyZXNoSW50ZXJ2YWwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgU2Nyb2xsZXIg44Gu56C05qOEXHJcbiAgICAgICAgZGVzdHJveSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fJHNjcm9sbGVyID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fJHdyYXBwZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9pc2Nyb2xsLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5fJG93bmVyID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgr/jgqTjg5flrprnvqlcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldCBUWVBFKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImlzY3JvbGxcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBmYWN0b3J5IOWPluW+l1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0RmFjdG9yeShvcHRpb25zPzogSVNjcm9sbE9wdGlvbnMpOiAoZWxlbWVudDogYW55LCBvcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpID0+IElTY3JvbGxlciB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlZmF1bHRPcHQgPSB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxYOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGJvdW5jZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0YXA6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBjbGljazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG1vdXNlV2hlZWw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxiYXJzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgaW50ZXJhY3RpdmVTY3JvbGxiYXJzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2hyaW5rU2Nyb2xsYmFyczogXCJzY2FsZVwiLFxyXG4gICAgICAgICAgICAgICAgZmFkZVNjcm9sbGJhcnM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBwcmV2ZW50RGVmYXVsdDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlUG9pbnRlcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGRpc2FibGVNb3VzZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlVG91Y2g6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcHJvYmVUeXBlOiAyLFxyXG4vLyAgICAgICAgICAgICAgIGV2ZW50UGFzc3Rocm91Z2g6IHRydWUsXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBjb25zdCBpc2Nyb2xsT3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0T3B0LCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZhY3RvcnkgPSAoZWxlbWVudDogYW55LCBsaXN0dmlld09wdGlvbnM6IExpc3RWaWV3T3B0aW9ucyk6IElTY3JvbGxlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkb3duZXIgPSAkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJG1hcCA9ICRvd25lci5maW5kKF9Db25maWcuU0NST0xMX01BUF9TRUxFQ1RPUik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkd3JhcHBlciA9ICQoXCI8ZGl2IGNsYXNzPSdcIiArIF9Db25maWcuV1JBUFBFUl9DTEFTUyArIFwiJz48L2Rpdj5cIilcclxuICAgICAgICAgICAgICAgICAgICAuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IFwiYWJzb2x1dGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvdzogXCJoaWRkZW5cIixcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICRtYXAud3JhcCgkd3JhcHBlcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNjcm9sbGVySVNjcm9sbCgkb3duZXIsIF9Db25maWcuV1JBUFBFUl9TRUxFQ1RPUiwgaXNjcm9sbE9wdGlvbnMsIGxpc3R2aWV3T3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIHNldCB0eXBlIHNpZ25hdHVyZS5cclxuICAgICAgICAgICAgKDxhbnk+ZmFjdG9yeSkudHlwZSA9IFNjcm9sbGVySVNjcm9sbC5UWVBFO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhY3Rvcnk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5MaXN0SXRlbVZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBMaXN0SXRlbVZpZXdPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgTGlzdEl0ZW1WaWV3IOOBruOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIExpc3RJdGVtVmlld09wdGlvbnM8VE1vZGVsIGV4dGVuZHMgQmFja2JvbmUuTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbD5cclxuICAgICAgICBleHRlbmRzIEJhY2tib25lLlZpZXdPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIG93bmVyOiBCYXNlTGlzdFZpZXc7XHJcbiAgICAgICAgJGVsPzogSlF1ZXJ5O1xyXG4gICAgICAgIGxpbmVQcm9maWxlOiBMaW5lUHJvZmlsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBMaXN0SXRlbVZpZXdcclxuICAgICAqIEBicmllZiBMaXN0VmlldyDjgYzmibHjgYYgTGlzdEl0ZW0g44Kz44Oz44OG44OK44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBMaXN0SXRlbVZpZXc8VE1vZGVsIGV4dGVuZHMgQmFja2JvbmUuTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbD5cclxuICAgICAgICBleHRlbmRzIEJhY2tib25lLlZpZXc8VE1vZGVsPiBpbXBsZW1lbnRzIElMaXN0SXRlbVZpZXcsIElDb21wb3NhYmxlVmlldyB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX293bmVyOiBCYXNlTGlzdFZpZXcgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX2xpbmVQcm9maWxlOiBMaW5lUHJvZmlsZSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9uczogTGlzdEl0ZW1WaWV3T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLl9vd25lciA9IG9wdGlvbnMub3duZXI7XHJcbiAgICAgICAgICAgIGlmIChvcHRpb25zLiRlbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVsZWdhdGVzID0gKDxhbnk+dGhpcykuZXZlbnRzID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50KG9wdGlvbnMuJGVsLCBkZWxlZ2F0ZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2xpbmVQcm9maWxlID0gb3B0aW9ucy5saW5lUHJvZmlsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogTGlzdEl0ZW1WaWV3XHJcblxyXG4gICAgICAgIC8vISDmj4/nlLs6IGZyYW1ld29yayDjgYvjgonlkbzjgbPlh7rjgZXjgozjgovjgZ/jgoHjgIHjgqrjg7zjg5Djg7zjg6njgqTjg4nlv4XpoIhcclxuICAgICAgICByZW5kZXIoKTogTGlzdEl0ZW1WaWV3PFRNb2RlbD4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJuZWVkIG92ZXJyaWRlICdyZW5kZXIoKScgbWV0aG9kLlwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg6Ieq6Lqr44GuIExpbmUg44Kk44Oz44OH44OD44Kv44K544KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0SW5kZXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpbmVQcm9maWxlLmluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOiHqui6q+OBq+aMh+WumuOBleOCjOOBn+mrmOOBleOCkuWPluW+l1xyXG4gICAgICAgIGdldFNwZWNpZmllZEhlaWdodCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGluZVByb2ZpbGUuaGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGNoaWxkIG5vZGUg44GM5a2Y5Zyo44GZ44KL44GL5Yik5a6aXHJcbiAgICAgICAgaGFzQ2hpbGROb2RlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuJGVsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMCA8IHRoaXMuJGVsLmNoaWxkcmVuKCkubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDpq5jjgZXjgpLmm7TmlrBcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBuZXdIZWlnaHQge051bWJlcn0gICAgICAgICAgICAgIFtpbl0g5paw44GX44GE6auY44GVXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMgICB7VXBkYXRlSGVpZ2h0T3B0aW9uc30gW2luXSBsaW5lIOOBrumrmOOBleabtOaWsOaZguOBq+W9semfv+OBmeOCi+OBmeOBueOBpuOBriBMaW5lUHJvZmlsZSDjga7lho3oqIjnrpfjgpLooYzjgYbloLTlkIjjga8geyByZWZsZWN0QWxsOiB0cnVlIH1cclxuICAgICAgICAgKiBAcmV0dXJuIHtMaXN0SXRlbVZpZXd9IOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHVwZGF0ZUhlaWdodChuZXdIZWlnaHQ6IG51bWJlciwgb3B0aW9ucz86IFVwZGF0ZUhlaWdodE9wdGlvbnMpOiBMaXN0SXRlbVZpZXc8VE1vZGVsPiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLiRlbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0U3BlY2lmaWVkSGVpZ2h0KCkgIT09IG5ld0hlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVQcm9maWxlLnVwZGF0ZUhlaWdodChuZXdIZWlnaHQsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJGVsLmhlaWdodChuZXdIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJQ29tcG9zYWJsZVZpZXdcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44GZ44Gn44Gr5a6a576p44GV44KM44GfIEJhY2tib25lLlZpZXcg44KS5Z+65bqV44Kv44Op44K544Gr6Kit5a6a44GX44CBZXh0ZW5kIOOCkuWun+ihjOOBmeOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRlcml2ZXMgICAgICAgICB7QmFja2JvbmUuVmlld3xCYWNrYm9uZS5WaWV3W119IFtpbl0g5ZCI5oiQ5YWD44GuIFZpZXcg44Kv44Op44K5XHJcbiAgICAgICAgICogQHBhcmFtIHByb3BlcnRpZXMgICAgICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgIFtpbl0gcHJvdG90eXBlIOODl+ODreODkeODhuOCo1xyXG4gICAgICAgICAqIEBwYXJhbSBjbGFzc1Byb3BlcnRpZXMge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHN0YXRpYyDjg5fjg63jg5Hjg4bjgqNcclxuICAgICAgICAgKiBAcmV0dXJuIHtCYWNrYm9uZS5WaWV3fEJhY2tib25lLlZpZXdbXX0g5paw6KaP44Gr55Sf5oiQ44GV44KM44GfIFZpZXcg44Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGNvbXBvc2UoZGVyaXZlczogVmlld0NvbnN0cnVjdG9yIHwgVmlld0NvbnN0cnVjdG9yW10sIHByb3BlcnRpZXM6IGFueSwgY2xhc3NQcm9wZXJ0aWVzPzogYW55KTogVmlld0NvbnN0cnVjdG9yIHtcclxuICAgICAgICAgICAgY29uc3QgY29tcG9zZWQ6IGFueSA9IGNvbXBvc2VWaWV3cyhMaXN0SXRlbVZpZXcsIGRlcml2ZXMpO1xyXG4gICAgICAgICAgICByZXR1cm4gY29tcG9zZWQuZXh0ZW5kKHByb3BlcnRpZXMsIGNsYXNzUHJvcGVydGllcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBCYWNrYm9uZS5WaWV3XHJcblxyXG4gICAgICAgIC8vISDplovmlL5cclxuICAgICAgICByZW1vdmUoKTogTGlzdEl0ZW1WaWV3PFRNb2RlbD4ge1xyXG4gICAgICAgICAgICAvLyB4cGVyaWEgQVggSmVsbHkgQmVhbiAoNC4xLjIp44Gr44Gm44CB44Oh44Oi44Oq44O844Oq44O844Kv44KS6Lu95rib44GV44Gb44KL5Yq55p6cXHJcbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoXCJmaWd1cmVcIikuY3NzKFwiYmFja2dyb3VuZC1pbWFnZVwiLCBcIm5vbmVcIik7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuJGVsIOOBr+WGjeWIqeeUqOOBmeOCi+OBn+OCgeegtOajhOOBl+OBquOBhFxyXG4gICAgICAgICAgICB0aGlzLiRlbC5jaGlsZHJlbigpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLiRlbC5vZmYoKTtcclxuICAgICAgICAgICAgdGhpcy4kZWwgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLnN0b3BMaXN0ZW5pbmcoKTtcclxuICAgICAgICAgICAgdGhpcy5fbGluZVByb2ZpbGUgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gc2hvcnQgY3V0IG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8hIE93bmVyIOWPluW+l1xyXG4gICAgICAgIGdldCBvd25lcigpOiBCYXNlTGlzdFZpZXcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8qIHRzbGludDpkaXNhYmxlOm5vLWJpdHdpc2Ugbm8tdW51c2VkLWV4cHJlc3Npb24gKi9cclxuLyoganNoaW50IC1XMDMwICovICAvLyBmb3IgXCJFeHBlY3RlZCBhbiBhc3NpZ25tZW50IG9yIGZ1bmN0aW9uIGNhbGwgYW5kIGluc3RlYWQgc2F3IGFuIGV4cHJlc3Npb25cIlxyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IF9Db25maWcgID0gQ0RQLlVJLkxpc3RWaWV3R2xvYmFsQ29uZmlnO1xyXG4gICAgaW1wb3J0IF9VdGlscyAgID0gQ0RQLlVJLl9MaXN0Vmlld1V0aWxzO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5TY3JvbGxNYW5hZ2VyXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBTY3JvbGxNYW5hZ2VyXHJcbiAgICAgKiBAYnJpZWYg44Oh44Oi44Oq566h55CG44KS6KGM44GG44K544Kv44Ot44O844Or5Yem55CG44Gu44Kz44Ki44Ot44K444OD44Kv5a6f6KOF44Kv44Op44K5XHJcbiAgICAgKiAgICAgICAg5pys44Kv44Op44K544GvIElMaXN0VmlldyDjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnjgpLmjIHjgaEgRE9NIOOBq+OCouOCr+OCu+OCueOBmeOCi+OBjOOAgUJhY2tib25lLlZpZXcg44KS57aZ5om/44GX44Gq44GEXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBTY3JvbGxNYW5hZ2VyIGltcGxlbWVudHMgSUxpc3RWaWV3RnJhbWV3b3JrLCBJU2Nyb2xsYWJsZSwgSUJhY2t1cFJlc3RvcmUge1xyXG5cclxuICAgICAgICBwcml2YXRlIF8kcm9vdDogSlF1ZXJ5ID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8hPCBTY3JvbGwg5a++6LGh44Gu44Or44O844OI44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgcHJpdmF0ZSBfJG1hcDogSlF1ZXJ5ID0gbnVsbDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vITwgU2Nyb2xsIE1hcCBlbGVtZW50IOOCkuagvOe0jVxyXG4gICAgICAgIHByaXZhdGUgX21hcEhlaWdodDogbnVtYmVyID0gMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyE8IFNjcm9sbCBNYXAg44Gu6auY44GV44KS5qC857SNIChfJG1hcCDjga7nirbmhYvjgavkvp3lrZjjgZXjgZvjgarjgYQpXHJcbiAgICAgICAgcHJpdmF0ZSBfc2Nyb2xsZXI6IElTY3JvbGxlciA9IG51bGw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vITwgU2Nyb2xsIOOBq+S9v+eUqOOBmeOCiyBJU2Nyb2xsZXIg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgcHJpdmF0ZSBfc2V0dGluZ3M6IExpc3RWaWV3T3B0aW9ucyA9IG51bGw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vITwgU2Nyb2xsTWFuYWdlciDjgqrjg5fjgrfjg6fjg7PjgpLmoLzntI1cclxuICAgICAgICBwcml2YXRlIF9hY3RpdmUgPSB0cnVlOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8hPCBVSSDooajnpLrkuK3jga8gdHJ1ZSDjgavmjIflrppcclxuICAgICAgICBwcml2YXRlIF9zY3JvbGxFdmVudEhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkID0gbnVsbDsgICAgICAgICAgLy8hPCBTY3JvbGwgRXZlbnQgSGFuZGxlclxyXG4gICAgICAgIHByaXZhdGUgX3Njcm9sbFN0b3BFdmVudEhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkID0gbnVsbDsgICAgICAvLyE8IFNjcm9sbCBTdG9wIEV2ZW50IEhhbmRsZXJcclxuICAgICAgICBwcml2YXRlIF9iYXNlSGVpZ2h0OiBudW1iZXIgPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8hPCDpq5jjgZXjga7ln7rmupblgKRcclxuICAgICAgICBwcml2YXRlIF9saW5lczogTGluZVByb2ZpbGVbXSA9IFtdOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8hPCDnrqHnkIbkuIvjgavjgYLjgosgTGluZVByb2ZpbGUg6YWN5YiXXHJcbiAgICAgICAgcHJpdmF0ZSBfcGFnZXM6IFBhZ2VQcm9maWxlW10gPSBbXTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vITwg566h55CG5LiL44Gr44GC44KLIFBhZ2VQcm9maWxlIOmFjeWIl1xyXG4gICAgICAgIC8vISDmnIDmlrDjga7ooajnpLrpoJjln5/mg4XloLHjgpLmoLzntI0gKFNjcm9sbCDkuK3jga7mm7TmlrDlh6bnkIbjgavkvb/nlKgpXHJcbiAgICAgICAgcHJpdmF0ZSBfbGFzdEFjdGl2ZVBhZ2VDb250ZXh0ID0ge1xyXG4gICAgICAgICAgICBpbmRleDogMCxcclxuICAgICAgICAgICAgZnJvbTogMCxcclxuICAgICAgICAgICAgdG86IDAsXHJcbiAgICAgICAgICAgIHBvczogMCwgICAgLy8gc2Nyb2xsIHBvc2l0aW9uXHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcm90ZWN0ZWQgX2JhY2t1cCA9IHt9OyAgICAvLyE8IOODh+ODvOOCv+OBriBiYWNrdXAg6aCY5Z+fLiBrZXkg44GoIF9saW5lcyDjgpLmoLzntI3jgILmtL7nlJ/jgq/jg6njgrnjgafmi6HlvLXlj6/og73jgIJcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBfJHJvb3QgIHtKUXVlcnl9IFtpbl0g566h55CG5a++6LGh44Gu44Or44O844OI44Ko44Os44Oh44Oz44OIXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0xpc3RWaWV3T3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihvcHRpb25zPzogTGlzdFZpZXdPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIC8vIExpc3RWaWV3T3B0aW9ucyDml6LlrprlgKRcclxuICAgICAgICAgICAgY29uc3QgZGVmT3B0aW9uczogTGlzdFZpZXdPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsZXJGYWN0b3J5OiBTY3JvbGxlckVsZW1lbnQuZ2V0RmFjdG9yeSgpLFxyXG4gICAgICAgICAgICAgICAgZW5hYmxlSGlkZGVuUGFnZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBlbmFibGVUcmFuc2Zvcm1PZmZzZXQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsTWFwUmVmcmVzaEludGVydmFsOiAyMDAsXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxSZWZyZXNoRGlzdGFuY2U6IDIwMCxcclxuICAgICAgICAgICAgICAgIHBhZ2VQcmVwYXJlQ291bnQ6IDMsXHJcbiAgICAgICAgICAgICAgICBwYWdlUHJlbG9hZENvdW50OiAxLFxyXG4gICAgICAgICAgICAgICAgZW5hYmxlQW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uRHVyYXRpb246IDAsXHJcbiAgICAgICAgICAgICAgICBiYXNlRGVwdGg6IFwiYXV0b1wiLFxyXG4gICAgICAgICAgICAgICAgaXRlbVRhZ05hbWU6IFwibGlcIixcclxuICAgICAgICAgICAgICAgIHJlbW92ZUl0ZW1XaXRoVHJhbnNpdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHVzZUR1bW15SW5hY3RpdmVTY3JvbGxNYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8g6Kit5a6a5qC857SNXHJcbiAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZk9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8g44K544Kv44Ot44O844Or44Kk44OZ44Oz44OIXHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbEV2ZW50SGFuZGxlciA9IChldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2Nyb2xsKHRoaXMuX3Njcm9sbGVyLmdldFBvcygpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8g44K544Kv44Ot44O844Or5YGc5q2i44Kk44OZ44Oz44OIXHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbFN0b3BFdmVudEhhbmRsZXIgPSAoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblNjcm9sbFN0b3AodGhpcy5fc2Nyb2xsZXIuZ2V0UG9zKCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kXHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjgqrjg5bjgrjjgqfjgq/jg4jjga7liJ3mnJ/ljJZcclxuICAgICAgICBwdWJsaWMgaW5pdGlhbGl6ZSgkcm9vdDogSlF1ZXJ5LCBoZWlnaHQ6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICAvLyDml6Ljgavmp4vnr4njgZXjgozjgabjgYTjgZ/loLTlkIjjga/noLTmo4RcclxuICAgICAgICAgICAgaWYgKHRoaXMuXyRyb290KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fJHJvb3QgPSAkcm9vdDtcclxuICAgICAgICAgICAgdGhpcy5fJG1hcCA9ICRyb290Lmhhc0NsYXNzKF9Db25maWcuU0NST0xMX01BUF9DTEFTUykgPyAkcm9vdCA6ICRyb290LmZpbmQoX0NvbmZpZy5TQ1JPTExfTUFQX1NFTEVDVE9SKTtcclxuICAgICAgICAgICAgLy8gXyRtYXAg44GM54Sh44GE5aC05ZCI44Gv5Yid5pyf5YyW44GX44Gq44GEXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl8kbWFwLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kcm9vdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyID0gdGhpcy5jcmVhdGVTY3JvbGxlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEJhc2VIZWlnaHQoaGVpZ2h0KTtcclxuICAgICAgICAgICAgdGhpcy5zZXRTY3JvbGxlckNvbmRpdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44Kq44OW44K444Kn44Kv44OI44Gu56C05qOEXHJcbiAgICAgICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY3JvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldFNjcm9sbGVyQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxlciA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuXyRtYXAgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl8kcm9vdCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Oa44O844K444Gu5Z+65rqW5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIHNldEJhc2VIZWlnaHQoaGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fYmFzZUhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Jhc2VIZWlnaHQgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiaW52YWxpZCBiYXNlIGhlaWdodDogXCIgKyB0aGlzLl9iYXNlSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2Nyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgYWN0aXZlIOeKtuaFi+ioreWumlxyXG4gICAgICAgIHB1YmxpYyBzZXRBY3RpdmVTdGF0ZShhY3RpdmU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fYWN0aXZlID0gYWN0aXZlO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWF0U2Nyb2xsUG9zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBhY3RpdmUg54q25oWL5Yik5a6aXHJcbiAgICAgICAgcHVibGljIGlzQWN0aXZlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHNjcm9sbGVyIOOBrueorumhnuOCkuWPluW+l1xyXG4gICAgICAgIHB1YmxpYyBnZXRTY3JvbGxlclR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuICg8YW55PnRoaXMuX3NldHRpbmdzLnNjcm9sbGVyRmFjdG9yeSkudHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeKtuaFi+OBq+W/nOOBmOOBn+OCueOCr+ODreODvOODq+S9jee9ruOBruS/neWtmC/lvqnlhYNcclxuICAgICAgICAgKiBjZHAudWkuZnMuanM6IFBhZ2VUYWJMaXN0VmlldyDjgYzlrp/pqJPnmoTjgavkvb/nlKhcclxuICAgICAgICAgKiBUT0RPOiDigLtpc2Nyb2xsIOOBr+acquWvvuW/nFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyB0cmVhdFNjcm9sbFBvc2l0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZU9mZnNldCA9ICgkdGFyZ2V0OiBKUXVlcnkpOiBKUXVlcnkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gKHRoaXMuX3Njcm9sbGVyLmdldFBvcygpIC0gdGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LnBvcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoX1V0aWxzLmdldENzc01hdHJpeFZhbHVlKCR0YXJnZXQsIFwidHJhbnNsYXRlWVwiKSAhPT0gb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IF9VdGlscy5jc3NQcmVmaXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1bX1V0aWxzLmNzc1ByZWZpeGVzW2ldICsgXCJ0cmFuc2Zvcm1cIl0gPSBcInRyYW5zbGF0ZTNkKDBweCxcIiArIG9mZnNldCArIFwicHgsMHB4KVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0LmNzcyh0cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkdGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY2xlYXJPZmZzZXQgPSAoJHRhcmdldDogSlF1ZXJ5KTogSlF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBfVXRpbHMuY3NzUHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1bX1V0aWxzLmNzc1ByZWZpeGVzW2ldICsgXCJ0cmFuc2Zvcm1cIl0gPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJHRhcmdldC5jc3ModHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkdGFyZ2V0O1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgLy8g5Lul5LiL44Gu44K544Kz44O844OX44Gu5Yem55CG44Gr5a++44GX44Gm55S76Z2i5pu05paw44KSMeWbnuOBq+OBp+OBjeOBquOBhOOBn+OCgeOAgUpCLCBJQ1Mg44Gn44Gv44Gh44KJ44Gk44GN44GM55m655Sf44GZ44KL44CCS2l0a2F0IOS7pemZjeOBr+iJr+WlveOAglxyXG4gICAgICAgICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2Nyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIuc2Nyb2xsVG8odGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LnBvcywgZmFsc2UsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjbGVhck9mZnNldCh0aGlzLl8kbWFwKS5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XHJcbiAgICAgICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLnVzZUR1bW15SW5hY3RpdmVTY3JvbGxNYXApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXBhcmVJbmFjdGl2ZU1hcCgpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3Njcm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MudXNlRHVtbXlJbmFjdGl2ZVNjcm9sbE1hcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9mZnNldCh0aGlzLnByZXBhcmVJbmFjdGl2ZU1hcCgpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlT2Zmc2V0KHRoaXMuXyRtYXApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgaW5hY3RpdmUg55SoIE1hcCDjga7nlJ/miJBcclxuICAgICAgICBwcml2YXRlIHByZXBhcmVJbmFjdGl2ZU1hcCgpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICBjb25zdCAkcGFyZW50ID0gdGhpcy5fJG1hcC5wYXJlbnQoKTtcclxuICAgICAgICAgICAgbGV0ICRpbmFjdGl2ZU1hcCA9ICRwYXJlbnQuZmluZChfQ29uZmlnLklOQUNUSVZFX0NMQVNTX1NFTEVDVE9SKTtcclxuICAgICAgICAgICAgaWYgKCRpbmFjdGl2ZU1hcC5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFBhZ2VJbmRleCA9IHRoaXMuZ2V0UGFnZUluZGV4KCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkbGlzdEl0ZW1WaWV3cyA9IHRoaXMuXyRtYXAuY2xvbmUoKS5jaGlsZHJlbigpLmZpbHRlcigoaW5kZXg6IG51bWJlciwgZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYWdlSW5kZXggPSB+fiQoZWxlbWVudCkuYXR0cihfQ29uZmlnLkRBVEFfUEFHRV9JTkRFWCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRQYWdlSW5kZXggLSAxIDw9IHBhZ2VJbmRleCB8fCBwYWdlSW5kZXggPD0gY3VycmVudFBhZ2VJbmRleCArIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgJGluYWN0aXZlTWFwID0gJChcIjxzZWN0aW9uIGNsYXNzPSdcIiArIF9Db25maWcuU0NST0xMX01BUF9DTEFTUyArIFwiIFwiICsgX0NvbmZpZy5JTkFDVElWRV9DTEFTUyArIFwiJz48L3NlY3Rpb24+XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmFwcGVuZCgkbGlzdEl0ZW1WaWV3cylcclxuICAgICAgICAgICAgICAgICAgICAuaGVpZ2h0KHRoaXMuX21hcEhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICAkcGFyZW50LmFwcGVuZCgkaW5hY3RpdmVNYXApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJG1hcC5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gJGluYWN0aXZlTWFwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcg44OX44Ot44OV44Kh44Kk44Or566h55CGXHJcblxyXG4gICAgICAgIC8vISDliJ3mnJ/ljJbmuIjjgb/jgYvliKTlrppcclxuICAgICAgICBpc0luaXRpYWxpemVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gISF0aGlzLl8kcm9vdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5fjg63jg5Hjg4bjgqPjgpLmjIflrprjgZfjgabjgIFMaW5lUHJvZmlsZSDjgpLnrqHnkIZcclxuICAgICAgICBhZGRJdGVtKFxyXG4gICAgICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICAgICAgaW5pdGlhbGl6ZXI6IG5ldyAob3B0aW9ucz86IGFueSkgPT4gQmFzZUxpc3RJdGVtVmlldyxcclxuICAgICAgICAgICAgaW5mbzogYW55LFxyXG4gICAgICAgICAgICBpbnNlcnRUbz86IG51bWJlclxyXG4gICAgICAgICk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9hZGRMaW5lKG5ldyBMaW5lUHJvZmlsZSh0aGlzLCBNYXRoLmZsb29yKGhlaWdodCksIGluaXRpYWxpemVyLCBpbmZvKSwgaW5zZXJ0VG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODl+ODreODkeODhuOCo+OCkuaMh+WumuOBl+OBpuOAgUxpbmVQcm9maWxlIOOCkueuoeeQhi4g55m76YyyIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgotcclxuICAgICAgICBwdWJsaWMgX2FkZExpbmUoX2xpbmU6IGFueSwgaW5zZXJ0VG8/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgbGluZXM6IExpbmVQcm9maWxlW10gPSAoX2xpbmUgaW5zdGFuY2VvZiBBcnJheSkgPyA8TGluZVByb2ZpbGVbXT5fbGluZSA6IFtfbGluZV07XHJcbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIsIG46IG51bWJlcjtcclxuICAgICAgICAgICAgbGV0IGRlbHRhSGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgbGV0IGFkZFRhaWwgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmIChudWxsID09IGluc2VydFRvKSB7XHJcbiAgICAgICAgICAgICAgICBpbnNlcnRUbyA9IHRoaXMuX2xpbmVzLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGluc2VydFRvID09PSB0aGlzLl9saW5lcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGFkZFRhaWwgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBzY3JvbGwgbWFwIOOBruabtOaWsFxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwLCBuID0gbGluZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBkZWx0YUhlaWdodCArPSBsaW5lc1tpXS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTY3JvbGxNYXBIZWlnaHQoZGVsdGFIZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgLy8g5oy/5YWlXHJcbiAgICAgICAgICAgIGZvciAoaSA9IGxpbmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saW5lcy5zcGxpY2UoaW5zZXJ0VG8sIDAsIGxpbmVzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gcGFnZSDoqK3lrprjga7op6PpmaRcclxuICAgICAgICAgICAgaWYgKCFhZGRUYWlsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoMCA9PT0gaW5zZXJ0VG8pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUGFnZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChudWxsICE9IHRoaXMuX2xpbmVzW2luc2VydFRvIC0gMV0ucGFnZUluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclBhZ2UodGhpcy5fbGluZXNbaW5zZXJ0VG8gLSAxXS5wYWdlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBvZmZzZXQg44Gu5YaN6KiI566XXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvZmlsZXMoaW5zZXJ0VG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBl+OBnyBJdGVtIOOCkuWJiumZpFxyXG4gICAgICAgIHJlbW92ZUl0ZW0oaW5kZXg6IG51bWJlciwgc2l6ZT86IG51bWJlciwgZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xyXG4gICAgICAgIHJlbW92ZUl0ZW0oaW5kZXg6IG51bWJlcltdLCBkZWxheT86IG51bWJlcik6IHZvaWQ7XHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogYW55LCBhcmcyPzogbnVtYmVyLCBhcmczPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVMaW5lcyhpbmRleCwgYXJnMik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVMaW5lKGluZGV4LCBhcmcyLCBhcmczKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBl+OBnyBMaW5lUHJvZmlsZSDjgpLliYrpmaQ6IOmAo+e2miBpbmRleCDniYhcclxuICAgICAgICBwdWJsaWMgX3JlbW92ZUxpbmUoaW5kZXg6IG51bWJlciwgc2l6ZT86IG51bWJlciwgZGVsYXk/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gc2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgc2l6ZSA9IDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCB0aGlzLl9saW5lcy5sZW5ndGggPCBpbmRleCArIHNpemUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJsb2dpYyBlcnJvci4gcmVtb3ZlSXRlbSgpLCBpbnZhbGlkIGluZGV4OiBcIiArIGluZGV4KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGVsYXkgPSAobnVsbCAhPSBkZWxheSkgPyBkZWxheSA6IDA7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZW1vdmVkOiBMaW5lUHJvZmlsZVtdID0gW107XHJcbiAgICAgICAgICAgIGxldCBkZWx0YSA9IDA7XHJcbiAgICAgICAgICAgIGxldCBtYXBUcmFuc2l0aW9uID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvLyDliYrpmaTlgJnoo5zjgajlpInljJbph4/jga7nrpflh7pcclxuICAgICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBsaW5lOiBMaW5lUHJvZmlsZTtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IHRoaXMuX2xpbmVzW2luZGV4ICsgaV07XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsdGEgKz0gbGluZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5YmK6Zmk6KaB57Sg44GuIHotaW5kZXgg44Gu5Yid5pyf5YyWXHJcbiAgICAgICAgICAgICAgICAgICAgbGluZS5yZXNldERlcHRoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZC5wdXNoKGxpbmUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8g6Ieq5YuV6Kit5a6a44O75YmK6Zmk6YGF5bu25pmC6ZaT44GM6Kit5a6a44GV44KM44GL44Gk44CB44K544Kv44Ot44O844Or44Od44K444K344On44Oz44Gr5aSJ5pu044GM44GC44KL5aC05ZCI44GvIHRyYW5zaXRpb24g6Kit5a6aXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MucmVtb3ZlSXRlbVdpdGhUcmFuc2l0aW9uICYmICgwIDwgZGVsYXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuZ2V0U2Nyb2xsUG9zKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zTWF4ID0gdGhpcy5nZXRTY3JvbGxQb3NNYXgoKSAtIGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcFRyYW5zaXRpb24gPSAocG9zTWF4IDwgY3VycmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgICAgICAvLyDmm7TmlrBcclxuICAgICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIHRyYW5zaXRpb24g6Kit5a6aXHJcbiAgICAgICAgICAgICAgICBpZiAobWFwVHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dXBTY3JvbGxNYXBUcmFuc2l0aW9uKHRoaXMuXyRtYXAsIGRlbGF5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHBhZ2Ug6Kit5a6a44Gu6Kej6ZmkXHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9saW5lc1tpbmRleF0ucGFnZUluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclBhZ2UodGhpcy5fbGluZXNbaW5kZXhdLnBhZ2VJbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyDjgrnjgq/jg63jg7zjg6vpoJjln5/jga7mm7TmlrBcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsTWFwSGVpZ2h0KC1kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICAvLyDphY3liJfjgYvjgonliYrpmaRcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzLnNwbGljZShpbmRleCwgc2l6ZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBvZmZzZXQg44Gu5YaN6KiI566XXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2ZpbGVzKGluZGV4KTtcclxuICAgICAgICAgICAgICAgIC8vIOmBheW7tuWJiumZpFxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZC5mb3JFYWNoKChsaW5lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuaW5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSwgZGVsYXkpO1xyXG4gICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBl+OBnyBMaW5lUHJvZmlsZSDjgpLliYrpmaQ6IHJhbmRvbSBhY2Nlc3Mg54mIXHJcbiAgICAgICAgcHVibGljIF9yZW1vdmVMaW5lcyhpbmRleGVzOiBudW1iZXJbXSwgZGVsYXk/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgZGVsYXkgPSAobnVsbCAhPSBkZWxheSkgPyBkZWxheSA6IDA7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgbiA9IGluZGV4ZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IDAgfHwgdGhpcy5fbGluZXMubGVuZ3RoIDwgaSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJsb2dpYyBlcnJvci4gcmVtb3ZlSXRlbSgpLCBpbnZhbGlkIGluZGV4OiBcIiArIGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZDogTGluZVByb2ZpbGVbXSA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgZGVsdGEgPSAwO1xyXG4gICAgICAgICAgICBsZXQgbWFwVHJhbnNpdGlvbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLy8g5YmK6Zmk5YCZ6KOc44Go5aSJ5YyW6YeP44Gu566X5Ye6XHJcbiAgICAgICAgICAgICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGluZTogTGluZVByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICBpbmRleGVzLmZvckVhY2goKGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gdGhpcy5fbGluZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbHRhICs9IGxpbmUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWJiumZpOimgee0oOOBriB6LWluZGV4IOOBruWIneacn+WMllxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmUucmVzZXREZXB0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWQucHVzaChsaW5lKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgLy8g6Ieq5YuV6Kit5a6a44O75YmK6Zmk6YGF5bu25pmC6ZaT44GM6Kit5a6a44GV44KM44GL44Gk44CB44K544Kv44Ot44O844Or44Od44K444K344On44Oz44Gr5aSJ5pu044GM44GC44KL5aC05ZCI44GvIHRyYW5zaXRpb24g6Kit5a6aXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MucmVtb3ZlSXRlbVdpdGhUcmFuc2l0aW9uICYmICgwIDwgZGVsYXkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuZ2V0U2Nyb2xsUG9zKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zTWF4ID0gdGhpcy5nZXRTY3JvbGxQb3NNYXgoKSAtIGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcFRyYW5zaXRpb24gPSAocG9zTWF4IDwgY3VycmVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgICAgICAvLyDmm7TmlrBcclxuICAgICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIHRyYW5zaXRpb24g6Kit5a6aXHJcbiAgICAgICAgICAgICAgICBpZiAobWFwVHJhbnNpdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0dXBTY3JvbGxNYXBUcmFuc2l0aW9uKHRoaXMuXyRtYXAsIGRlbGF5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGluZGV4ZXMuZm9yRWFjaCgoaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHBhZ2Ug6Kit5a6a44Gu6Kej6ZmkXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fbGluZXNbaW5kZXhdLnBhZ2VJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUGFnZSh0aGlzLl9saW5lc1tpbmRleF0ucGFnZUluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8g6YWN5YiX44GL44KJ5YmK6ZmkXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGluZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBvZmZzZXQg44Gu5YaN6KiI566XXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9maWxlcyhpbmRleCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIOOCueOCr+ODreODvOODq+mgmOWfn+OBruabtOaWsFxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVTY3JvbGxNYXBIZWlnaHQoLWRlbHRhKTtcclxuICAgICAgICAgICAgICAgIC8vIOmBheW7tuWJiumZpFxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVtb3ZlZC5mb3JFYWNoKChsaW5lKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUuaW5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSwgZGVsYXkpO1xyXG4gICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHNjcm9sbCBtYXAg44Gu44OI44Op44Oz44K444K344On44Oz6Kit5a6aXHJcbiAgICAgICAgcHJpdmF0ZSBzZXR1cFNjcm9sbE1hcFRyYW5zaXRpb24oJG1hcDogSlF1ZXJ5LCBkZWxheTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zaXRpb25FbmRIYW5kbGVyID0gKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgICAgICRtYXAub2ZmKF9VdGlscy50cmFuc2l0aW9uRW5kKTtcclxuICAgICAgICAgICAgICAgIF9VdGlscy5jbGVhclRyYW5zaXRpb25zKCRtYXApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLl8kbWFwLm9uKF9VdGlscy50cmFuc2l0aW9uRW5kLCB0cmFuc2l0aW9uRW5kSGFuZGxlcik7XHJcbiAgICAgICAgICAgIF9VdGlscy5zZXRUcmFuc2Zvcm1zVHJhbnNpdGlvbnMoJG1hcCwgXCJoZWlnaHRcIiwgZGVsYXksIFwiZWFzZVwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ8gSXRlbSDjgavoqK3lrprjgZfjgZ/mg4XloLHjgpLlj5blvpdcclxuICAgICAgICBnZXRJdGVtSW5mbyh0YXJnZXQ6IG51bWJlcik6IGFueTtcclxuICAgICAgICBnZXRJdGVtSW5mbyh0YXJnZXQ6IEpRdWVyeS5FdmVudCk6IGFueTtcclxuICAgICAgICBnZXRJdGVtSW5mbyh0YXJnZXQ6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGxldCBpbmRleDogbnVtYmVyO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcGFyc2VyID0gKCR0YXJnZXQ6IEpRdWVyeSk6IG51bWJlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoJHRhcmdldC5oYXNDbGFzcyhfQ29uZmlnLkxJU1RJVEVNX0JBU0VfQ0xBU1MpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIH5+JHRhcmdldC5hdHRyKF9Db25maWcuREFUQV9DT05UQUlORVJfSU5ERVgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICgkdGFyZ2V0Lmhhc0NsYXNzKF9Db25maWcuU0NST0xMX01BUF9DTEFTUykgfHwgJHRhcmdldC5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImNhbm5vdCBkaXRlY3QgbGluZSBmcm9tIGV2ZW50IG9iamVjdC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwYXJzZXIoJHRhcmdldC5wYXJlbnQoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0IGluc3RhbmNlb2YgJC5FdmVudCkge1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSBwYXJzZXIoJCh0YXJnZXQuY3VycmVudFRhcmdldCkpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXQgPT09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gdGFyZ2V0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImxvZ2ljIGVycm9yLiB1bnN1cHBvcnRlZCBhcmcgdHlwZS4gdHlwZTogXCIgKyB0eXBlb2YgdGFyZ2V0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGluZGV4IDwgMCB8fCB0aGlzLl9saW5lcy5sZW5ndGggPD0gaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJsb2dpYyBlcnJvci4gaW52YWxpZCByYW5nZS4gaW5kZXg6IFwiICsgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9saW5lc1tpbmRleF0uaW5mbztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgqLjgq/jg4bjgqPjg5bjg5rjg7zjgrjjgpLmm7TmlrBcclxuICAgICAgICByZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXRzOiBhbnkgPSB7fTtcclxuICAgICAgICAgICAgY29uc3Qgc2VhcmNoQ291bnQgPSB0aGlzLl9zZXR0aW5ncy5wYWdlUHJlcGFyZUNvdW50ICsgdGhpcy5fc2V0dGluZ3MucGFnZVByZWxvYWRDb3VudDtcclxuICAgICAgICAgICAgY29uc3QgY3VycmVudFBhZ2VJbmRleCA9IHRoaXMuZ2V0UGFnZUluZGV4KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGhpZ2hQcmlvcml0eUluZGV4OiBudW1iZXJbXSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb2xkRXhzaXN0UGFnZSA9IF8uZmlsdGVyKHRoaXMuX3BhZ2VzLCAocGFnZTogUGFnZVByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcImluYWN0aXZlXCIgIT09IHBhZ2Uuc3RhdHVzO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZVN0YXRlID0gKGluZGV4OiBudW1iZXIpOiB2b2lkID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChpbmRleCA9PT0gY3VycmVudFBhZ2VJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldHNbaW5kZXhdID0gXCJhY3RpdmF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hQcmlvcml0eUluZGV4LnB1c2goaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChfVXRpbHMuYWJzKGN1cnJlbnRQYWdlSW5kZXggLSBpbmRleCkgPD0gdGhpcy5fc2V0dGluZ3MucGFnZVByZXBhcmVDb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldHNbaW5kZXhdID0gXCJhY3RpdmF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2V0dGluZ3MuZW5hYmxlSGlkZGVuUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzW2luZGV4XSA9IFwiaGlkZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldHNbaW5kZXhdID0gXCJhY3RpdmF0ZVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGN1cnJlbnQgcGFnZSDjga4g5YmN5b6M44GvIGhpZ2ggcHJpb3JpdHkg44Gr44GZ44KLXHJcbiAgICAgICAgICAgICAgICBpZiAoY3VycmVudFBhZ2VJbmRleCArIDEgPT09IGluZGV4IHx8IGN1cnJlbnRQYWdlSW5kZXggLSAxID09PSBpbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhpZ2hQcmlvcml0eUluZGV4LnB1c2goaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8g5a++6LGh54Sh44GXXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9saW5lcy5sZW5ndGggPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhZ2VJbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgb3ZlcmZsb3dQcmV2ID0gMCwgb3ZlcmZsb3dOZXh0ID0gMDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJlZ2luSW5kZXggPSBjdXJyZW50UGFnZUluZGV4IC0gc2VhcmNoQ291bnQ7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBlbmRJbmRleCA9IGN1cnJlbnRQYWdlSW5kZXggKyBzZWFyY2hDb3VudDtcclxuICAgICAgICAgICAgICAgIGZvciAocGFnZUluZGV4ID0gYmVnaW5JbmRleDsgcGFnZUluZGV4IDw9IGVuZEluZGV4OyBwYWdlSW5kZXgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYWdlSW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93UHJldisrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhZ2VzLmxlbmd0aCA8PSBwYWdlSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3dOZXh0Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTdGF0ZShwYWdlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgwIDwgb3ZlcmZsb3dQcmV2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMCwgcGFnZUluZGV4ID0gY3VycmVudFBhZ2VJbmRleCArIHNlYXJjaENvdW50ICsgMTsgaSA8IG92ZXJmbG93UHJldjsgaSsrICwgcGFnZUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3BhZ2VzLmxlbmd0aCA8PSBwYWdlSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVN0YXRlKHBhZ2VJbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICgwIDwgb3ZlcmZsb3dOZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMCwgcGFnZUluZGV4ID0gY3VycmVudFBhZ2VJbmRleCAtIHNlYXJjaENvdW50IC0gMTsgaSA8IG92ZXJmbG93TmV4dDsgaSsrICwgcGFnZUluZGV4LS0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhZ2VJbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZVN0YXRlKHBhZ2VJbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICAgICAgLy8g5LiN6KaB44Gr44Gq44Gj44GfIHBhZ2Ug44GuIGluYWN0aXZhdGVcclxuICAgICAgICAgICAgb2xkRXhzaXN0UGFnZS5mb3JFYWNoKChwYWdlOiBQYWdlUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBwYWdlLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgPT0gdGFyZ2V0c1tpbmRleF0pIHtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlLmluYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyDlhKrlhYggcGFnZSDjga4gYWN0aXZhdGVcclxuICAgICAgICAgICAgaGlnaFByaW9yaXR5SW5kZXhcclxuICAgICAgICAgICAgICAgIC5zb3J0KChsaHM6IG51bWJlciwgcmhzOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobGhzIDwgcmhzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxocyA+IHJocykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYWdlc1tpbmRleF0gJiYgdGhpcy5fcGFnZXNbaW5kZXhdLmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8g44Gd44Gu44G744GL44GuIHBhZ2Ug44GuIOeKtuaFi+WkieabtFxyXG4gICAgICAgICAgICBfLmVhY2godGFyZ2V0cywgKGFjdGlvbjogc3RyaW5nLCBrZXk6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNJbml0aWFsaXplZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gfn5rZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoYWN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYWN0aXZhdGVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYWdlc1tpbmRleF0gJiYgdGhpcy5fcGFnZXNbaW5kZXhdLmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFwiaGlkZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2VzW2luZGV4XSAmJiB0aGlzLl9wYWdlc1tpbmRleF0uaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImluYWN0aXZhdGVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmV4cGVjdGVkIG9wZXJhdGlvbjogaW5hY3RpdmF0ZVwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5rbm93biBvcGVyYXRpb246IFwiICsgdGFyZ2V0c1trZXldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIOabtOaWsOW+jOOBq+S9v+eUqOOBl+OBquOBi+OBo+OBnyBET00g44KS5YmK6ZmkXHJcbiAgICAgICAgICAgIHRoaXMuZmluZFJlY3ljbGVFbGVtZW50cygpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LmZyb20gPSB0aGlzLl9wYWdlc1tjdXJyZW50UGFnZUluZGV4XS5nZXRMaW5lUHJvZmlsZUZpcnN0KCkgP1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFnZXNbY3VycmVudFBhZ2VJbmRleF0uZ2V0TGluZVByb2ZpbGVGaXJzdCgpLmluZGV4IDogMDtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LnRvID0gdGhpcy5fcGFnZXNbY3VycmVudFBhZ2VJbmRleF0uZ2V0TGluZVByb2ZpbGVMYXN0KCkgP1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFnZXNbY3VycmVudFBhZ2VJbmRleF0uZ2V0TGluZVByb2ZpbGVMYXN0KCkuaW5kZXggOiAwO1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0QWN0aXZlUGFnZUNvbnRleHQuaW5kZXggPSBjdXJyZW50UGFnZUluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOacquOCouOCteOCpOODs+ODmuODvOOCuOOCkuani+eviVxyXG4gICAgICAgIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9wYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMuYXNzaWduUGFnZShpbmRleCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODmuODvOOCuOOCouOCteOCpOODs+OCkuWGjeani+aIkFxyXG4gICAgICAgIHJlYnVpbGQoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXJQYWdlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYXNzaWduUGFnZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrqHovYTjg4fjg7zjgr/jgpLnoLTmo4RcclxuICAgICAgICByZWxlYXNlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9saW5lcy5mb3JFYWNoKChsaW5lOiBMaW5lUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGluZS5pbmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9wYWdlcyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLl9saW5lcyA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fJG1hcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwSGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRtYXAuaGVpZ2h0KDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBCYWNrdXAgLyBSZXN0b3JlXHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg5Djg4Pjgq/jgqLjg4Pjg5dcclxuICAgICAgICBiYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gdGhpcy5fYmFja3VwW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2JhY2t1cFtrZXldID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVzOiB0aGlzLl9saW5lcyxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44Oq44K544OI44KiXHJcbiAgICAgICAgcmVzdG9yZShrZXk6IHN0cmluZywgcmVidWlsZDogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gdGhpcy5fYmFja3VwW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoMCA8IHRoaXMuX2xpbmVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2FkZExpbmUodGhpcy5fYmFja3VwW2tleV0ubGluZXMpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlYnVpbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVidWlsZCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7mnInnhKFcclxuICAgICAgICBoYXNCYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fYmFja3VwW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gu56C05qOEXHJcbiAgICAgICAgY2xlYXJCYWNrdXAoa2V5Pzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IGtleSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmFja3VwID0ge307XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChudWxsICE9IHRoaXMuX2JhY2t1cFtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fYmFja3VwW2tleV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBq+OCouOCr+OCu+OCuVxyXG4gICAgICAgIGdldCBiYWNrdXBEYXRhKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYWNrdXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBTY3JvbGxcclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+OCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICBzZXRTY3JvbGxIYW5kbGVyKGhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkLCBvbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2Nyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLm9uKFwic2Nyb2xsXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxlci5vZmYoXCJzY3JvbGxcIiwgaGFuZGxlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vntYLkuobjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgc2V0U2Nyb2xsU3RvcEhhbmRsZXIoaGFuZGxlcjogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQsIG9uOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY3JvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIub24oXCJzY3JvbGxzdG9wXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxlci5vZmYoXCJzY3JvbGxzdG9wXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxlciA/IHRoaXMuX3Njcm9sbGVyLmdldFBvcygpIDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jga7mnIDlpKflgKTjgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3NNYXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbGVyID8gdGhpcy5fc2Nyb2xsZXIuZ2V0UG9zTWF4KCkgOiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+S9jee9ruOCkuaMh+WumlxyXG4gICAgICAgIHNjcm9sbFRvKHBvczogbnVtYmVyLCBhbmltYXRlPzogYm9vbGVhbiwgdGltZT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2Nyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChwb3MgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiaW52YWxpZCBwb3NpdGlvbiwgdG9vIHNtYWxsLiBbcG9zOiBcIiArIHBvcyArIFwiXVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9zY3JvbGxlci5nZXRQb3NNYXgoKSA8IHBvcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImludmFsaWQgcG9zaXRpb24sIHRvbyBiaWcuIFtwb3M6IFwiICsgcG9zICsgXCJdXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHRoaXMuX3Njcm9sbGVyLmdldFBvc01heCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gcG9zIOOBruOBv+WFiOmnhuOBkeOBpuabtOaWsFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LnBvcyA9IHBvcztcclxuICAgICAgICAgICAgICAgIGlmIChwb3MgIT09IHRoaXMuX3Njcm9sbGVyLmdldFBvcygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIuc2Nyb2xsVG8ocG9zLCBhbmltYXRlLCB0aW1lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBleOCjOOBnyBMaXN0SXRlbVZpZXcg44Gu6KGo56S644KS5L+d6Ki8XHJcbiAgICAgICAgZW5zdXJlVmlzaWJsZShpbmRleDogbnVtYmVyLCBvcHRpb25zPzogRW5zdXJlVmlzaWJsZU9wdGlvbnMpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCB0aGlzLl9saW5lcy5sZW5ndGggPD0gaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImVuc3VyZVZpc2libGUoKSwgaW52YWxpZCBpbmRleCwgbm9vcC4gW2luZGV4OiBcIiArIGluZGV4ICsgXCJdXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLl9zY3JvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwic2Nyb2xsZXIgaXMgbm90IHJlYWR5LlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuX2xpbmVzW2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0T3B0aW9uczogRW5zdXJlVmlzaWJsZU9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFydGlhbE9LOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRvcDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZTogdGhpcy5fc2V0dGluZ3MuZW5hYmxlQW5pbWF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpbWU6IHRoaXMuX3NldHRpbmdzLmFuaW1hdGlvbkR1cmF0aW9uLFxyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAoKTogdm9pZCA9PiB7IC8qIG5vb3AgKi8gfSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcGVyYXRpb246IEVuc3VyZVZpc2libGVPcHRpb25zID0gJC5leHRlbmQoe30sIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50U2NvcGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogdGhpcy5fc2Nyb2xsZXIuZ2V0UG9zKCksXHJcbiAgICAgICAgICAgICAgICAgICAgdG86IHRoaXMuX3Njcm9sbGVyLmdldFBvcygpICsgdGhpcy5fYmFzZUhlaWdodCxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRTY29wZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBmcm9tOiB0YXJnZXQub2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgIHRvOiB0YXJnZXQub2Zmc2V0ICsgdGFyZ2V0LmhlaWdodCxcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaXNJblNjb3BlID0gKCk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb24ucGFydGlhbE9LKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRTY29wZS5mcm9tIDw9IGN1cnJlbnRTY29wZS5mcm9tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFNjb3BlLmZyb20gPD0gdGFyZ2V0U2NvcGUudG8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFNjb3BlLmZyb20gPD0gY3VycmVudFNjb3BlLnRvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2NvcGUuZnJvbSA8PSB0YXJnZXRTY29wZS5mcm9tICYmIHRhcmdldFNjb3BlLnRvIDw9IGN1cnJlbnRTY29wZS50bykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGRldGVjdFBvc2l0aW9uID0gKCk6IG51bWJlciA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRhcmdldFNjb3BlLmZyb20gPCBjdXJyZW50U2NvcGUuZnJvbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0U2NvcGUuZnJvbTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1cnJlbnRTY29wZS5mcm9tIDwgdGFyZ2V0U2NvcGUuZnJvbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0Lm9mZnNldCAtIHRhcmdldC5oZWlnaHQ7IC8vIGJvdHRvbSDlkIjjgo/jgZvjga/mg4XloLHkuI3otrPjgavjgojjgorkuI3lj69cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJsb2dpYyBlcnJvci5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgbGV0IHBvczogbnVtYmVyO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChvcGVyYXRpb24uc2V0VG9wKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gdGFyZ2V0U2NvcGUuZnJvbTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNJblNjb3BlKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBub29wLlxyXG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbi5jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gZGV0ZWN0UG9zaXRpb24oKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyDoo5zmraNcclxuICAgICAgICAgICAgICAgIGlmIChwb3MgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gMDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fc2Nyb2xsZXIuZ2V0UG9zTWF4KCkgPCBwb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSB0aGlzLl9zY3JvbGxlci5nZXRQb3NNYXgoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KG9wZXJhdGlvbi5jYWxsYmFjaywgb3BlcmF0aW9uLnRpbWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUbyhwb3MsIG9wZXJhdGlvbi5hbmltYXRlLCBvcGVyYXRpb24udGltZSk7XHJcbiAgICAgICAgICAgIH0pKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIGltcGxlbWVudHM6IElMaXN0Vmlld0ZyYW1ld29yazpcclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbCBNYXAg44Gu6auY44GV44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsTWFwSGVpZ2h0KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kbWFwID8gdGhpcy5fbWFwSGVpZ2h0IDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGwgTWFwIOOBrumrmOOBleOCkuabtOaWsC4gZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCiy5cclxuICAgICAgICB1cGRhdGVTY3JvbGxNYXBIZWlnaHQoZGVsdGE6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fJG1hcCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwSGVpZ2h0ICs9IGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgLy8gZm9yIGZhaWwgc2FmZS5cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tYXBIZWlnaHQgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWFwSGVpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuXyRtYXAuaGVpZ2h0KHRoaXMuX21hcEhlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6ggUHJvZmlsZSDjga7mm7TmlrAuIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgosuXHJcbiAgICAgICAgdXBkYXRlUHJvZmlsZXMoZnJvbTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIsIG46IG51bWJlcjtcclxuICAgICAgICAgICAgbGV0IGxhc3Q6IExpbmVQcm9maWxlO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSBmcm9tLCBuID0gdGhpcy5fbGluZXMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoMCA8IGkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0ID0gdGhpcy5fbGluZXNbaSAtIDFdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzW2ldLmluZGV4ID0gbGFzdC5pbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGluZXNbaV0ub2Zmc2V0ID0gbGFzdC5vZmZzZXQgKyBsYXN0LmhlaWdodDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbGluZXNbaV0uaW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzW2ldLm9mZnNldCA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGwgTWFwIEVsZW1lbnQg44KS5Y+W5b6XLiBmcmFtZXdvcmsg44GM5L2/55So44GZ44KLLlxyXG4gICAgICAgIGdldFNjcm9sbE1hcEVsZW1lbnQoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRtYXAgfHwgJChcIlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg6rjgrXjgqTjgq/jg6vlj6/og73jgaogRWxlbWVudCDjgpLlj5blvpcuIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgosuXHJcbiAgICAgICAgZmluZFJlY3ljbGVFbGVtZW50cygpOiBKUXVlcnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJG1hcCA/IHRoaXMuXyRtYXAuZmluZChfQ29uZmlnLlJFQ1lDTEVfQ0xBU1NfU0VMRUNUT1IpIDogJChcIlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBMaXN0Vmlld09wdGlvbnMg44KS5Y+W5b6XLiBmcmFtZXdvcmsg44GM5L2/55So44GZ44KLLlxyXG4gICAgICAgIGdldExpc3RWaWV3T3B0aW9ucygpOiBMaXN0Vmlld09wdGlvbnMge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2V0dGluZ3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kOlxyXG5cclxuICAgICAgICAvLyEgU2Nyb2xsZXIg55So55Kw5aKD6Kit5a6aXHJcbiAgICAgICAgcHJpdmF0ZSBzZXRTY3JvbGxlckNvbmRpdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIub24oXCJzY3JvbGxcIiwgdGhpcy5fc2Nyb2xsRXZlbnRIYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIub24oXCJzY3JvbGxzdG9wXCIsIHRoaXMuX3Njcm9sbFN0b3BFdmVudEhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbGVyIOeUqOeSsOWig+egtOajhFxyXG4gICAgICAgIHByaXZhdGUgcmVzZXRTY3JvbGxlckNvbmRpdGlvbigpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIub2ZmKFwic2Nyb2xsc3RvcFwiLCB0aGlzLl9zY3JvbGxTdG9wRXZlbnRIYW5kbGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIub2ZmKFwic2Nyb2xsXCIsIHRoaXMuX3Njcm9sbEV2ZW50SGFuZGxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5pei5a6a44GuIFNjcm9sbGVyIOOCquODluOCuOOCp+OCr+ODiOOBruS9nOaIkFxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlU2Nyb2xsZXIoKTogSVNjcm9sbGVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldHRpbmdzLnNjcm9sbGVyRmFjdG9yeSh0aGlzLl8kcm9vdFswXSwgdGhpcy5fc2V0dGluZ3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOePvuWcqOOBriBQYWdlIEluZGV4IOOCkuWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgZ2V0UGFnZUluZGV4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIsIG46IG51bWJlcjtcclxuICAgICAgICAgICAgbGV0IHBhZ2U6IFBhZ2VQcm9maWxlO1xyXG4gICAgICAgICAgICBsZXQgY2FuZGlkYXRlOiBudW1iZXI7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBzY3JvbGxQb3MgPSB0aGlzLl9zY3JvbGxlciA/IHRoaXMuX3Njcm9sbGVyLmdldFBvcygpIDogMDtcclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsUG9zTWF4ID0gdGhpcy5fc2Nyb2xsZXIgPyB0aGlzLl9zY3JvbGxlci5nZXRQb3NNYXgoKSA6IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbE1hcFNpemUgPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGFzdFBhZ2UgPSB0aGlzLmdldExhc3RQYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSBsYXN0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0UGFnZS5vZmZzZXQgKyBsYXN0UGFnZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9iYXNlSGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcG9zID0gKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICgwID09PSBzY3JvbGxQb3NNYXggfHwgc2Nyb2xsUG9zTWF4IDw9IHRoaXMuX2Jhc2VIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjcm9sbFBvcyAqIHNjcm9sbE1hcFNpemUgLyBzY3JvbGxQb3NNYXg7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB2YWxpZFJhbmdlID0gKF9wYWdlOiBQYWdlUHJvZmlsZSk6IGJvb2xlYW4gPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgPT0gX3BhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKF9wYWdlLm9mZnNldCA8PSBwb3MgJiYgcG9zIDw9IF9wYWdlLm9mZnNldCArIF9wYWdlLmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYmFzZUhlaWdodCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiaW52YWxpZCBiYXNlIGhlaWdodDogXCIgKyB0aGlzLl9iYXNlSGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjYW5kaWRhdGUgPSBNYXRoLmZsb29yKHBvcyAvIHRoaXMuX2Jhc2VIZWlnaHQpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcGFnZXMubGVuZ3RoIDw9IGNhbmRpZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgY2FuZGlkYXRlID0gdGhpcy5fcGFnZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcGFnZSA9IHRoaXMuX3BhZ2VzW2NhbmRpZGF0ZV07XHJcbiAgICAgICAgICAgIGlmICh2YWxpZFJhbmdlKHBhZ2UpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS5pbmRleDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChwb3MgPCBwYWdlLm9mZnNldCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gY2FuZGlkYXRlIC0gMTsgaSA+PSAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlID0gdGhpcy5fcGFnZXNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkUmFuZ2UocGFnZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5rbm93biBwYWdlIGluZGV4LlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gY2FuZGlkYXRlICsgMSwgbiA9IHRoaXMuX3BhZ2VzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2UgPSB0aGlzLl9wYWdlc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRSYW5nZShwYWdlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFnZS5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bmtub3duIHBhZ2UgaW5kZXguXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2VzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCueOCr+ODreODvOODq+OCpOODmeODs+ODiFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHBvcyB7TnVtYmVyfSBbaW5dIOOCueOCr+ODreODvOODq+ODneOCuOOCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgb25TY3JvbGwocG9zOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZSAmJiAwIDwgdGhpcy5fcGFnZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50UGFnZUluZGV4ID0gdGhpcy5nZXRQYWdlSW5kZXgoKTtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IOiqv+aVtFxyXG4gICAgICAgICAgICAgICAgaWYgKF9VdGlscy5hYnMocG9zIC0gdGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LnBvcykgPCB0aGlzLl9zZXR0aW5ncy5zY3JvbGxSZWZyZXNoRGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LmluZGV4ICE9PSBjdXJyZW50UGFnZUluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RBY3RpdmVQYWdlQ29udGV4dC5wb3MgPSBwb3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCueOCr+ODreODvOODq+WBnOatouOCpOODmeODs+ODiFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHBvcyB7TnVtYmVyfSBbaW5dIOOCueOCr+ODreODvOODq+ODneOCuOOCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgb25TY3JvbGxTdG9wKHBvczogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmUgJiYgMCA8IHRoaXMuX3BhZ2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFBhZ2VJbmRleCA9IHRoaXMuZ2V0UGFnZUluZGV4KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LmluZGV4ICE9PSBjdXJyZW50UGFnZUluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0QWN0aXZlUGFnZUNvbnRleHQucG9zID0gcG9zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5pyA5b6M44Gu44Oa44O844K444KS5Y+W5b6XXHJcbiAgICAgICAgcHJpdmF0ZSBnZXRMYXN0UGFnZSgpOiBQYWdlUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIGlmICgwIDwgdGhpcy5fcGFnZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFnZXNbdGhpcy5fcGFnZXMubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Oa44O844K45Yy65YiG44Gu44Ki44K144Kk44OzXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZnJvbSB7TnVtYmVyfSBbaW5dIHBhZ2UgaW5kZXgg44KS5oyH5a6aXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBhc3NpZ25QYWdlKGZyb20/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGk6IG51bWJlciwgbjogbnVtYmVyO1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBmcm9tKSB7XHJcbiAgICAgICAgICAgICAgICBmcm9tID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJQYWdlKGZyb20pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpbmVJbmRleCA9IDA7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGFzdFBhZ2UgPSB0aGlzLmdldExhc3RQYWdlKCk7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGFzdExpbmU6IExpbmVQcm9maWxlO1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlbXBQYWdlOiBQYWdlUHJvZmlsZTtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsID09IGxhc3RQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2UgPSBuZXcgUGFnZVByb2ZpbGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYWdlcy5wdXNoKGxhc3RQYWdlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdExpbmUgPSBsYXN0UGFnZS5nZXRMaW5lUHJvZmlsZUxhc3QoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobnVsbCAhPSBsYXN0TGluZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lSW5kZXggPSBsYXN0TGluZS5pbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGFzaWduZWUgPSB0aGlzLl9saW5lcy5zbGljZShsaW5lSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMCwgbiA9IGFzaWduZWUubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2Jhc2VIZWlnaHQgPD0gbGFzdFBhZ2UuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wUGFnZSA9IGxhc3RQYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wUGFnZSA9IG5ldyBQYWdlUHJvZmlsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wUGFnZS5pbmRleCA9IGxhc3RQYWdlLmluZGV4ICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcFBhZ2Uub2Zmc2V0ID0gbGFzdFBhZ2Uub2Zmc2V0ICsgbGFzdFBhZ2UuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZSA9IHRlbXBQYWdlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYWdlcy5wdXNoKGxhc3RQYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYXNpZ25lZVtpXS5wYWdlSW5kZXggPSBsYXN0UGFnZS5pbmRleDtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZS5wdXNoKGFzaWduZWVbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGFzdFBhZ2Uubm9ybWFsaXplKCk7XHJcbiAgICAgICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2Nyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg5rjg7zjgrjljLrliIbjga7op6PpmaRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBmcm9tIHtOdW1iZXJ9IFtpbl0gcGFnZSBpbmRleCDjgpLmjIflrppcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIGNsZWFyUGFnZShmcm9tPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IGZyb20pIHtcclxuICAgICAgICAgICAgICAgIGZyb20gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VzID0gdGhpcy5fcGFnZXMuc2xpY2UoMCwgZnJvbSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5MaXN0Vmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIExpc3RWaWV3Q29uc3RydWN0T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIExpc3RWaWV3IOOBuOOBruWIneacn+WMluaDheWgseOCkuagvOe0jeOBmeOCi+OCpOODs+OCv+ODvOODleOCp+OCpOOCueOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIExpc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWwgZXh0ZW5kcyBCYWNrYm9uZS5Nb2RlbCA9IEJhY2tib25lLk1vZGVsPlxyXG4gICAgICAgIGV4dGVuZHMgTGlzdFZpZXdPcHRpb25zLCBCYWNrYm9uZS5WaWV3T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICAkZWw/OiBKUXVlcnk7XHJcbiAgICAgICAgaW5pdGlhbEhlaWdodD86IG51bWJlcjsgICAgLy8hPCDpq5jjgZXjga7liJ3mnJ/lgKRcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIOODoeODouODqueuoeeQhuapn+iDveOCkuaPkOS+m+OBmeOCi+S7ruaDs+ODquOCueODiOODk+ODpeODvOOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgTGlzdFZpZXc8VE1vZGVsIGV4dGVuZHMgQmFja2JvbmUuTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbD5cclxuICAgICAgICBleHRlbmRzIEJhY2tib25lLlZpZXc8VE1vZGVsPiBpbXBsZW1lbnRzIElMaXN0VmlldywgSUNvbXBvc2FibGVWaWV3IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc2Nyb2xsTWdyOiBTY3JvbGxNYW5hZ2VyID0gbnVsbDsgICAgLy8hPCBzY3JvbGwg44Kz44Ki44Ot44K444OD44KvXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7TGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICAgICAgY29uc3Qgb3B0ID0gb3B0aW9ucyB8fCB7fTtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyID0gbmV3IFNjcm9sbE1hbmFnZXIob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGlmIChvcHQuJGVsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZXMgPSAoPGFueT50aGlzKS5ldmVudHMgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVsZW1lbnQob3B0LiRlbCwgZGVsZWdhdGVzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IG9wdC5pbml0aWFsSGVpZ2h0IHx8IHRoaXMuJGVsLmhlaWdodCgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLmluaXRpYWxpemUodGhpcy4kZWwsIGhlaWdodCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IEJhY2tib25lLlZpZXdcclxuXHJcbiAgICAgICAgLy8hIOWvvuixoSBlbGVtZW50IOOBruioreWumlxyXG4gICAgICAgIHNldEVsZW1lbnQoZWxlbWVudDogSFRNTEVsZW1lbnQsIGRlbGVnYXRlPzogYm9vbGVhbik6IEJhY2tib25lLlZpZXc8VE1vZGVsPjtcclxuICAgICAgICBzZXRFbGVtZW50KGVsZW1lbnQ6IEpRdWVyeSwgZGVsZWdhdGU/OiBib29sZWFuKTogQmFja2JvbmUuVmlldzxUTW9kZWw+O1xyXG4gICAgICAgIHNldEVsZW1lbnQoZWxlbWVudDogYW55LCBkZWxlZ2F0ZT86IGJvb2xlYW4pOiBCYWNrYm9uZS5WaWV3PFRNb2RlbD4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2Nyb2xsTWdyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCAkZWwgPSAkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5pbml0aWFsaXplKCRlbCwgJGVsLmhlaWdodCgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuc2V0RWxlbWVudChlbGVtZW50LCBkZWxlZ2F0ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg56C05qOEXHJcbiAgICAgICAgcmVtb3ZlKCk6IEJhY2tib25lLlZpZXc8VE1vZGVsPiB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IFByb2ZpbGUg566h55CGXHJcblxyXG4gICAgICAgIC8vISDliJ3mnJ/ljJbmuIjjgb/jgYvliKTlrppcclxuICAgICAgICBpc0luaXRpYWxpemVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmlzSW5pdGlhbGl6ZWQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5fjg63jg5Hjg4bjgqPjgpLmjIflrprjgZfjgabjgIFMaW5lUHJvZmlsZSDjgpLnrqHnkIZcclxuICAgICAgICBhZGRJdGVtKFxyXG4gICAgICAgICAgICBoZWlnaHQ6IG51bWJlcixcclxuICAgICAgICAgICAgaW5pdGlhbGl6ZXI6IG5ldyAob3B0aW9ucz86IGFueSkgPT4gQmFzZUxpc3RJdGVtVmlldyxcclxuICAgICAgICAgICAgaW5mbzogYW55LFxyXG4gICAgICAgICAgICBpbnNlcnRUbz86IG51bWJlclxyXG4gICAgICAgICk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9hZGRMaW5lKG5ldyBMaW5lUHJvZmlsZSh0aGlzLl9zY3JvbGxNZ3IsIE1hdGguZmxvb3IoaGVpZ2h0KSwgaW5pdGlhbGl6ZXIsIGluZm8pLCBpbnNlcnRUbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIEl0ZW0g44KS5YmK6ZmkXHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogbnVtYmVyLCBzaXplPzogbnVtYmVyLCBkZWxheT86IG51bWJlcik6IHZvaWQ7XHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogbnVtYmVyW10sIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBhbnksIGFyZzI/OiBudW1iZXIsIGFyZzM/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlbW92ZUl0ZW0oaW5kZXgsIGFyZzIsIGFyZzMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBl+OBnyBJdGVtIOOBq+ioreWumuOBl+OBn+aDheWgseOCkuWPluW+l1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogbnVtYmVyKTogYW55O1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogSlF1ZXJ5LkV2ZW50KTogYW55O1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogYW55KTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRJdGVtSW5mbyh0YXJnZXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCouOCr+ODhuOCo+ODluODmuODvOOCuOOCkuabtOaWsFxyXG4gICAgICAgIHJlZnJlc2goKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5yZWZyZXNoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5pyq44Ki44K144Kk44Oz44Oa44O844K444KS5qeL56+JXHJcbiAgICAgICAgdXBkYXRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Oa44O844K444Ki44K144Kk44Oz44KS5YaN5qeL5oiQXHJcbiAgICAgICAgcmVidWlsZCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlYnVpbGQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrqHovYTjg4fjg7zjgr/jgpLnoLTmo4RcclxuICAgICAgICByZWxlYXNlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVsZWFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgUHJvZmlsZSBCYWNrdXAgLyBSZXN0b3JlXHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg5Djg4Pjgq/jgqLjg4Pjg5dcclxuICAgICAgICBiYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5iYWNrdXAoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg6rjgrnjg4jjgqJcclxuICAgICAgICByZXN0b3JlKGtleTogc3RyaW5nLCByZWJ1aWxkOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLnJlc3RvcmUoa2V5LCByZWJ1aWxkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7mnInnhKFcclxuICAgICAgICBoYXNCYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5oYXNCYWNrdXAoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7noLTmo4RcclxuICAgICAgICBjbGVhckJhY2t1cChrZXk/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5jbGVhckJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBq+OCouOCr+OCu+OCuVxyXG4gICAgICAgIGdldCBiYWNrdXBEYXRhKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IgPyB0aGlzLl9zY3JvbGxNZ3IuYmFja3VwRGF0YSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBTY3JvbGxcclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+OCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICBzZXRTY3JvbGxIYW5kbGVyKGhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkLCBvbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3Iuc2V0U2Nyb2xsSGFuZGxlcihoYW5kbGVyLCBvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or57WC5LqG44Kk44OZ44Oz44OI44OP44Oz44OJ44Op6Kit5a6aL+ino+mZpFxyXG4gICAgICAgIHNldFNjcm9sbFN0b3BIYW5kbGVyKGhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkLCBvbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3Iuc2V0U2Nyb2xsU3RvcEhhbmRsZXIoaGFuZGxlciwgb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+S9jee9ruOCkuWPluW+l1xyXG4gICAgICAgIGdldFNjcm9sbFBvcygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmdldFNjcm9sbFBvcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+S9jee9ruOBruacgOWkp+WApOOCkuWPluW+l1xyXG4gICAgICAgIGdldFNjcm9sbFBvc01heCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyLmdldFNjcm9sbFBvc01heCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+S9jee9ruOCkuaMh+WumlxyXG4gICAgICAgIHNjcm9sbFRvKHBvczogbnVtYmVyLCBhbmltYXRlPzogYm9vbGVhbiwgdGltZT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3Iuc2Nyb2xsVG8ocG9zLCBhbmltYXRlLCB0aW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZXjgozjgZ8gTGlzdEl0ZW1WaWV3IOOBruihqOekuuOCkuS/neiovFxyXG4gICAgICAgIGVuc3VyZVZpc2libGUoaW5kZXg6IG51bWJlciwgb3B0aW9ucz86IEVuc3VyZVZpc2libGVPcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5lbnN1cmVWaXNpYmxlKGluZGV4LCBvcHRpb25zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IFByb3BlcnRpZXNcclxuXHJcbiAgICAgICAgLy8hIGNvcmUgZnJhbWV3b3JrIGFjY2Vzc1xyXG4gICAgICAgIGdldCBjb3JlKCk6IElMaXN0Vmlld0ZyYW1ld29yayB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBJbnRlcm5hbCBJL0ZcclxuXHJcbiAgICAgICAgLy8hIOeZu+mMsiBmcmFtZXdvcmsg44GM5L2/55So44GZ44KLXHJcbiAgICAgICAgX2FkZExpbmUoX2xpbmU6IGFueSwgaW5zZXJ0VG8/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLl9hZGRMaW5lKF9saW5lLCBpbnNlcnRUbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElDb21wb3NhYmxlVmlld1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgZnjgafjgavlrprnvqnjgZXjgozjgZ8gQmFja2JvbmUuVmlldyDjgpLln7rlupXjgq/jg6njgrnjgavoqK3lrprjgZfjgIFleHRlbmQg44KS5a6f6KGM44GZ44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGVyaXZlcyAgICAgICAgIHtCYWNrYm9uZS5WaWV3fEJhY2tib25lLlZpZXdbXX0gW2luXSDlkIjmiJDlhYPjga4gVmlldyDjgq/jg6njgrlcclxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydGllcyAgICAgIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwcm90b3R5cGUg44OX44Ot44OR44OG44KjXHJcbiAgICAgICAgICogQHBhcmFtIGNsYXNzUHJvcGVydGllcyB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgIFtpbl0gc3RhdGljIOODl+ODreODkeODhuOCo1xyXG4gICAgICAgICAqIEByZXR1cm4ge0JhY2tib25lLlZpZXd8QmFja2JvbmUuVmlld1tdfSDmlrDopo/jgavnlJ/miJDjgZXjgozjgZ8gVmlldyDjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0aWMgY29tcG9zZShkZXJpdmVzOiBWaWV3Q29uc3RydWN0b3IgfCBWaWV3Q29uc3RydWN0b3JbXSwgcHJvcGVydGllczogYW55LCBjbGFzc1Byb3BlcnRpZXM/OiBhbnkpOiBWaWV3Q29uc3RydWN0b3Ige1xyXG4gICAgICAgICAgICBjb25zdCBjb21wb3NlZDogYW55ID0gY29tcG9zZVZpZXdzKExpc3RWaWV3LCBkZXJpdmVzKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2VkLmV4dGVuZChwcm9wZXJ0aWVzLCBjbGFzc1Byb3BlcnRpZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuR3JvdXBMaXN0SXRlbVZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBHcm91cExpc3RJdGVtVmlld09wdGlvbnNcclxuICAgICAqIEBicmllZiBHcm91cExpc3RJdGVtVmlldyDjga7jgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBHcm91cExpc3RJdGVtVmlld09wdGlvbnM8VE1vZGVsIGV4dGVuZHMgQmFja2JvbmUuTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbD4gZXh0ZW5kcyBMaXN0SXRlbVZpZXdPcHRpb25zPFRNb2RlbD4ge1xyXG4gICAgICAgIGdyb3VwUHJvZmlsZT86IEdyb3VwUHJvZmlsZTsgICAgLy8hPCBHcm91cFByb2ZpbGUg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgR3JvdXBMaXN0SXRlbVZpZXdcclxuICAgICAqIEBicmllZiBFeHBhbmRhYmxlTGlzdFZpZXcg44GM5omx44GGIExpc3RJdGVtIOOCs+ODs+ODhuODiuOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgR3JvdXBMaXN0SXRlbVZpZXc8VE1vZGVsIGV4dGVuZHMgQmFja2JvbmUuTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbD4gZXh0ZW5kcyBMaXN0SXRlbVZpZXc8VE1vZGVsPiB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX2dyb3VwUHJvZmlsZTogR3JvdXBQcm9maWxlID0gbnVsbDsgICAgLy8hPCDnrqHovYTjga4gR3JvdXBQcm9maWxlXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7R3JvdXBMaW5lVmlld09wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9uczogR3JvdXBMaXN0SXRlbVZpZXdPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2dyb3VwUHJvZmlsZSA9IG9wdGlvbnMuZ3JvdXBQcm9maWxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcm90ZWN0ZWQgbWV0aG9kc1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlsZXplovnirbmhYvjgpLliKTlrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOWxlemWiywgZmFsc2U65Y+O5p2fXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJvdGVjdGVkIGlzRXhwYW5kZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncm91cFByb2ZpbGUuaXNFeHBhbmRlZCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWxlemWi+S4reOBi+WIpOWumlxyXG4gICAgICAgIHByb3RlY3RlZCBpc0V4cGFuZGluZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICg8QmFzZUV4cGFuZGFibGVMaXN0Vmlldz50aGlzLm93bmVyKS5pc0V4cGFuZGluZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWPjuadn+S4reOBi+WIpOWumlxyXG4gICAgICAgIHByb3RlY3RlZCBpc0NvbGxhcHNpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoPEJhc2VFeHBhbmRhYmxlTGlzdFZpZXc+dGhpcy5vd25lcikuaXNDb2xsYXBzaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg6ZaL6ZaJ5Lit44GL5Yik5a6aXHJcbiAgICAgICAgcHJvdGVjdGVkIGlzU3dpdGNoaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKDxCYXNlRXhwYW5kYWJsZUxpc3RWaWV3PnRoaXMub3duZXIpLmlzU3dpdGNoaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5a2QIEdyb3VwIOOCkuaMgeOBo+OBpuOBhOOCi+OBi+WIpOWumlxyXG4gICAgICAgIHByb3RlY3RlZCBoYXNDaGlsZHJlbihsYXlvdXRLZXk/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwUHJvZmlsZS5oYXNDaGlsZHJlbihsYXlvdXRLZXkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlICovXHJcblxyXG5uYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuRXhwYW5kTWFuYWdlcl0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgRXhwYW5kTWFuYWdlclxyXG4gICAgICogQGJyaWVmIOmWi+mWieeKtuaFi+euoeeQhuOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgRXhwYW5kTWFuYWdlciBpbXBsZW1lbnRzIElFeHBhbmRNYW5hZ2VyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfb3duZXI6IEJhc2VFeHBhbmRhYmxlTGlzdFZpZXcgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX21hcEdyb3VwczogT2JqZWN0ID0ge307ICAgICAgICAgICAgICAgIC8vITwge2lkLCBHcm91cFByb2ZpbGV9IOOBriBtYXBcclxuICAgICAgICBwcml2YXRlIF9hcnlUb3BHcm91cHM6IEdyb3VwUHJvZmlsZVtdID0gW107ICAgICAvLyE8IOesrDHpmo7lsaQgR3JvdXBQcm9maWxlIOOCkuagvOe0jVxyXG4gICAgICAgIHByaXZhdGUgX2xheW91dEtleTogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvd25lciB7QmFzZUV4cGFuZGFibGVMaXN0Vmlld30gW2luXSDopqpWaWV3IOOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG93bmVyOiBCYXNlRXhwYW5kYWJsZUxpc3RWaWV3KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX293bmVyID0gb3duZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElFeHBhbmRNYW5hZ2VyXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaWsOimjyBHcm91cFByb2ZpbGUg44KS5L2c5oiQXHJcbiAgICAgICAgICog55m76Yyy5riI44G/44Gu5aC05ZCI44Gv44Gd44Gu44Kq44OW44K444Kn44Kv44OI44KS6L+U5Y20XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFybWEgaWQge1N0cmluZ30gW2luXSDmlrDopo/jgavkvZzmiJDjgZnjgosgR3JvdXAgSUQg44KS5oyH5a6aLiDmjIflrprjgZfjgarjgYTloLTlkIjjga/oh6rli5XlibLjgormjK/jgopcclxuICAgICAgICAgKiBAcmV0dXJuIHtHcm91cFByb2ZpbGV9IEdyb3VwUHJvZmlsZSDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBuZXdHcm91cChpZD86IHN0cmluZyk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIGxldCBncm91cDogR3JvdXBQcm9maWxlO1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBpZCkge1xyXG4gICAgICAgICAgICAgICAgaWQgPSBcImdyb3VwLWlkOlwiICsgKFwiMDAwMFwiICsgKE1hdGgucmFuZG9tKCkgKiBNYXRoLnBvdygzNiwgNCkgPDwgMCkudG9TdHJpbmcoMzYpKS5zbGljZSgtNCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fbWFwR3JvdXBzW2lkXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcEdyb3Vwc1tpZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZ3JvdXAgPSBuZXcgR3JvdXBQcm9maWxlKGlkLCB0aGlzLl9vd25lcik7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcEdyb3Vwc1tpZF0gPSBncm91cDtcclxuICAgICAgICAgICAgcmV0dXJuIGdyb3VwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog55m76Yyy5riI44G/IEdyb3VwIOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcm1hIGlkIHtTdHJpbmd9IFtpbl0g5Y+W5b6X44GZ44KLIEdyb3VwIElEIOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm4ge0dyb3VwUHJvZmlsZX0gR3JvdXBQcm9maWxlIOOCpOODs+OCueOCv+ODs+OCuSAvIG51bGxcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRHcm91cChpZDogc3RyaW5nKTogR3JvdXBQcm9maWxlIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gdGhpcy5fbWFwR3JvdXBzW2lkXSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiZ3JvdXAgaWQ6IFwiICsgaWQgKyBcIiBpcyBub3QgcmVnaXN0ZXJlZC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFwR3JvdXBzW2lkXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOesrDHpmo7lsaTjga4gR3JvdXAg55m76YyyXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gdG9wR3JvdXAge0dyb3VwUHJvZmlsZX0gW2luXSDmp4vnr4nmuIjjgb8gR3JvdXBQcm9maWxlIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJlZ2lzdGVyVG9wR3JvdXAodG9wR3JvdXA6IEdyb3VwUHJvZmlsZSk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbGFzdEdyb3VwOiBHcm91cFByb2ZpbGU7XHJcbiAgICAgICAgICAgIGxldCBpbnNlcnRUbzogbnVtYmVyO1xyXG5cclxuICAgICAgICAgICAgLy8g44GZ44Gn44Gr55m76Yyy5riI44G/44Gu5aC05ZCI44GvIHJlc3RvcmUg44GX44GmIGxheW91dCDjgq3jg7zjgZTjgajjgavlvqnlhYPjgZnjgovjgIJcclxuICAgICAgICAgICAgaWYgKFwicmVnaXN0ZXJlZFwiID09PSB0b3BHcm91cC5zdGF0dXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IG9yaWVudGF0aW9uIGNoYW5nZWQg5pmC44GuIGxheW91dCDjgq3jg7zlpInmm7Tlr77lv5zjgaDjgYzjgIHjgq3jg7zjgavlpInmm7TjgYznhKHjgYTjgajjgY3jga/kuI3lhbflkIjjgajjgarjgovjgIJcclxuICAgICAgICAgICAgICAgIC8vIOOBk+OBriBBUEkg44Gr5a6f6KOF44GM5b+F6KaB44GL44KC5ZCr44KB44Gm6KaL55u044GX44GM5b+F6KaBXHJcbiAgICAgICAgICAgICAgICB0b3BHcm91cC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxhc3RHcm91cCA9ICgwIDwgdGhpcy5fYXJ5VG9wR3JvdXBzLmxlbmd0aCkgPyB0aGlzLl9hcnlUb3BHcm91cHNbdGhpcy5fYXJ5VG9wR3JvdXBzLmxlbmd0aCAtIDFdIDogbnVsbDtcclxuICAgICAgICAgICAgaW5zZXJ0VG8gPSAobnVsbCAhPSBsYXN0R3JvdXApID8gbGFzdEdyb3VwLmdldExhc3RMaW5lSW5kZXgodHJ1ZSkgKyAxIDogMDtcclxuICAgICAgICAgICAgaWYgKF8uaXNOYU4oaW5zZXJ0VG8pKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwibG9naWMgZXJyb3IsICdpbnNlcnRUbycgaXMgTmFOLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fYXJ5VG9wR3JvdXBzLnB1c2godG9wR3JvdXApO1xyXG4gICAgICAgICAgICB0b3BHcm91cC5yZWdpc3RlcihpbnNlcnRUbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnrKwx6ZqO5bGk44GuIEdyb3VwIOOCkuWPluW+l1xyXG4gICAgICAgICAqIOOCs+ODlOODvOmFjeWIl+OBjOi/lOOBleOCjOOCi+OBn+OCgeOAgeOCr+ODqeOCpOOCouODs+ODiOOBr+OCreODo+ODg+OCt+ODpeS4jeWPr1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7R3JvdXBQcm9maWxlW119IEdyb3VwUHJvZmlsZSDphY3liJdcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRUb3BHcm91cHMoKTogR3JvdXBQcm9maWxlW10ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYXJ5VG9wR3JvdXBzLnNsaWNlKDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOBmeOBueOBpuOBruOCsOODq+ODvOODl+OCkuWxlemWiyAoMemajuWxpClcclxuICAgICAgICBleHBhbmRBbGwoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FyeVRvcEdyb3Vwcy5mb3JFYWNoKChncm91cDogR3JvdXBQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAuaGFzQ2hpbGRyZW4oKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLmV4cGFuZCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgZnjgbnjgabjga7jgrDjg6vjg7zjg5fjgpLlj47mnZ8gKDHpmo7lsaQpXHJcbiAgICAgICAgY29sbGFwc2VBbGwoZGVsYXk/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fYXJ5VG9wR3JvdXBzLmZvckVhY2goKGdyb3VwOiBHcm91cFByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChncm91cC5oYXNDaGlsZHJlbigpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXAuY29sbGFwc2UoZGVsYXkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlsZXplovkuK3jgYvliKTlrppcclxuICAgICAgICBpc0V4cGFuZGluZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyLmlzU3RhdHVzSW4oXCJleHBhbmRpbmdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5Y+O5p2f5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNDb2xsYXBzaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXIuaXNTdGF0dXNJbihcImNvbGxhcHNpbmdcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg6ZaL6ZaJ5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNTd2l0Y2hpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzRXhwYW5kaW5nKCkgfHwgdGhpcy5pc0NvbGxhcHNpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jgqTjg7Pjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICBzdGF0dXNBZGRSZWYoc3RhdHVzOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXIuc3RhdHVzQWRkUmVmKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg54q25oWL5aSJ5pWw44Gu5Y+C54Wn44Kr44Km44Oz44OI44Gu44OH44Kv44Oq44Oh44Oz44OIXHJcbiAgICAgICAgc3RhdHVzUmVsZWFzZShzdGF0dXM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lci5zdGF0dXNSZWxlYXNlKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5Yem55CG44K544Kz44O844OX5q+O44Gr54q25oWL5aSJ5pWw44KS6Kit5a6aXHJcbiAgICAgICAgc3RhdHVzU2NvcGUoc3RhdHVzOiBzdHJpbmcsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX293bmVyLnN0YXR1c1Njb3BlKHN0YXR1cywgY2FsbGJhY2spO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBl+OBn+eKtuaFi+S4reOBp+OBguOCi+OBi+eiuuiqjVxyXG4gICAgICAgIGlzU3RhdHVzSW4oc3RhdHVzOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyLmlzU3RhdHVzSW4oc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBsYXlvdXQga2V5IOOCkuWPluW+l1xyXG4gICAgICAgIGdldCBsYXlvdXRLZXkoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xheW91dEtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBsYXlvdXQga2V5IOOCkuioreWumlxyXG4gICAgICAgIHNldCBsYXlvdXRLZXkoa2V5OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGF5b3V0S2V5ID0ga2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODh+ODvOOCv+OCkuegtOajhFxyXG4gICAgICAgIHJlbGVhc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hcEdyb3VwcyA9IHt9O1xyXG4gICAgICAgICAgICB0aGlzLl9hcnlUb3BHcm91cHMgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50ZXM6IElCYWNrdXBSZXN0b3JlXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWGhemDqOODh+ODvOOCv+OCkuODkOODg+OCr+OCouODg+ODl1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGtleSB7U3RyaW5nfSBbaW5dIOODkOODg+OCr+OCouODg+ODl+OCreODvOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaIkOWKnyAvIGZhbHNlOiDlpLHmlZdcclxuICAgICAgICAgKi9cclxuICAgICAgICBiYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgY29uc3QgX2JhY2t1cCA9IHRoaXMuYmFja3VwRGF0YTtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gX2JhY2t1cFtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICBfYmFja3VwW2tleV0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWFwOiB0aGlzLl9tYXBHcm91cHMsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9wczogdGhpcy5fYXJ5VG9wR3JvdXBzLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWGhemDqOODh+ODvOOCv+OCkuODquOCueODiOOColxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGtleSAgICAge1N0cmluZ30gIFtpbl0g44OQ44OD44Kv44Ki44OD44OX44Kt44O844KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIHJlYnVpbGQge0Jvb2xlYW59IFtpbl0gcmVidWlsZCDjgpLlrp/ooYzjgZnjgovloLTlkIjjga8gdHJ1ZSDjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDmiJDlip8gLyBmYWxzZTog5aSx5pWXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVzdG9yZShrZXk6IHN0cmluZywgcmVidWlsZDogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgY29uc3QgX2JhY2t1cCA9IHRoaXMuYmFja3VwRGF0YTtcclxuXHJcbiAgICAgICAgICAgIGlmIChudWxsID09IF9iYWNrdXBba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgwIDwgdGhpcy5fYXJ5VG9wR3JvdXBzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX21hcEdyb3VwcyA9IF9iYWNrdXBba2V5XS5tYXA7XHJcbiAgICAgICAgICAgIHRoaXMuX2FyeVRvcEdyb3VwcyA9IF9iYWNrdXBba2V5XS50b3BzO1xyXG5cclxuICAgICAgICAgICAgLy8gbGF5b3V0IOaDheWgseOBrueiuuiqjVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fYXJ5VG9wR3JvdXBzLmxlbmd0aCA8PSAwIHx8ICF0aGlzLl9hcnlUb3BHcm91cHNbMF0uaGFzTGF5b3V0S2V5T2YodGhpcy5sYXlvdXRLZXkpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIOWxlemWi+OBl+OBpuOBhOOCi+OCguOBruOCkueZu+mMslxyXG4gICAgICAgICAgICB0aGlzLl9hcnlUb3BHcm91cHMuZm9yRWFjaCgoZ3JvdXA6IEdyb3VwUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZ3JvdXAucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIOWGjeani+evieOBruS6iOe0hFxyXG4gICAgICAgICAgICBpZiAocmVidWlsZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3duZXIucmVidWlsZCgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7mnInnhKFcclxuICAgICAgICBoYXNCYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyLmhhc0JhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruegtOajhFxyXG4gICAgICAgIGNsZWFyQmFja3VwKGtleT86IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXIuY2xlYXJCYWNrdXAoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jgavjgqLjgq/jgrvjgrlcclxuICAgICAgICBnZXQgYmFja3VwRGF0YSgpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXIuYmFja3VwRGF0YTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkV4cGFuZGFibGVMaXN0Vmlld10gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgRXhwYW5kYWJsZUxpc3RWaWV3XHJcbiAgICAgKiBAYnJpZWYg6ZaL6ZaJ5qmf6IO944KS5YKZ44GI44Gf5Luu5oOz44Oq44K544OI44OT44Ol44O844Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBFeHBhbmRhYmxlTGlzdFZpZXc8VE1vZGVsIGV4dGVuZHMgQmFja2JvbmUuTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbD5cclxuICAgICAgICBleHRlbmRzIExpc3RWaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJRXhwYW5kYWJsZUxpc3RWaWV3IHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc3RhdHVzTWdyOiBTdGF0dXNNYW5hZ2VyID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF9leHBhbmRNYW5hZ2VyOiBFeHBhbmRNYW5hZ2VyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9ucz86IExpc3RWaWV3Q29uc3RydWN0T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF0dXNNZ3IgPSBuZXcgU3RhdHVzTWFuYWdlcigpO1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyID0gbmV3IEV4cGFuZE1hbmFnZXIodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElFeHBhbmRhYmxlTGlzdFZpZXdcclxuXHJcbiAgICAgICAgLy8hIOaWsOimjyBHcm91cFByb2ZpbGUg44KS5L2c5oiQXHJcbiAgICAgICAgbmV3R3JvdXAoaWQ/OiBzdHJpbmcpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5uZXdHcm91cChpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg55m76Yyy5riI44G/IEdyb3VwIOOCkuWPluW+l1xyXG4gICAgICAgIGdldEdyb3VwKGlkOiBzdHJpbmcpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5nZXRHcm91cChpZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg56ysMemajuWxpOOBriBHcm91cCDnmbvpjLJcclxuICAgICAgICByZWdpc3RlclRvcEdyb3VwKHRvcEdyb3VwOiBHcm91cFByb2ZpbGUpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5yZWdpc3RlclRvcEdyb3VwKHRvcEdyb3VwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnrKwx6ZqO5bGk44GuIEdyb3VwIOOCkuWPluW+l1xyXG4gICAgICAgIGdldFRvcEdyb3VwcygpOiBHcm91cFByb2ZpbGVbXSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmdldFRvcEdyb3VwcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOBmeOBueOBpuOBruOCsOODq+ODvOODl+OCkuWxlemWiyAoMemajuWxpClcclxuICAgICAgICBleHBhbmRBbGwoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIuZXhwYW5kQWxsKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5Y+O5p2fICgx6ZqO5bGkKVxyXG4gICAgICAgIGNvbGxhcHNlQWxsKGRlbGF5PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIuY29sbGFwc2VBbGwoZGVsYXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWxlemWi+S4reOBi+WIpOWumlxyXG4gICAgICAgIGlzRXhwYW5kaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5pc0V4cGFuZGluZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWPjuadn+S4reOBi+WIpOWumlxyXG4gICAgICAgIGlzQ29sbGFwc2luZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuaXNDb2xsYXBzaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg6ZaL6ZaJ5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNTd2l0Y2hpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmlzU3dpdGNoaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg54q25oWL5aSJ5pWw44Gu5Y+C54Wn44Kr44Km44Oz44OI44Gu44Kk44Oz44Kv44Oq44Oh44Oz44OIXHJcbiAgICAgICAgc3RhdHVzQWRkUmVmKHN0YXR1czogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1c01nci5zdGF0dXNBZGRSZWYoc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jg4fjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICBzdGF0dXNSZWxlYXNlKHN0YXR1czogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1c01nci5zdGF0dXNSZWxlYXNlKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5Yem55CG44K544Kz44O844OX5q+O44Gr54q25oWL5aSJ5pWw44KS6Kit5a6aXHJcbiAgICAgICAgc3RhdHVzU2NvcGUoc3RhdHVzOiBzdHJpbmcsIGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1c01nci5zdGF0dXNTY29wZShzdGF0dXMsIGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ/nirbmhYvkuK3jgafjgYLjgovjgYvnorroqo1cclxuICAgICAgICBpc1N0YXR1c0luKHN0YXR1czogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNNZ3IuaXNTdGF0dXNJbihzdGF0dXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGxheW91dCBrZXkg44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0IGxheW91dEtleSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5sYXlvdXRLZXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgbGF5b3V0IGtleSDjgpLoqK3lrppcclxuICAgICAgICBzZXQgbGF5b3V0S2V5KGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIubGF5b3V0S2V5ID0ga2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBPdmVycmlkZTogTGlzdFZpZXdcclxuXHJcbiAgICAgICAgLy8hIOODh+ODvOOCv+OCkuegtOajhFxyXG4gICAgICAgIHJlbGVhc2UoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN1cGVyLnJlbGVhc2UoKTtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlci5yZWxlYXNlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44OQ44OD44Kv44Ki44OD44OXXHJcbiAgICAgICAgYmFja3VwKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmJhY2t1cChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODquOCueODiOOColxyXG4gICAgICAgIHJlc3RvcmUoa2V5OiBzdHJpbmcsIHJlYnVpbGQ6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLnJlc3RvcmUoa2V5LCByZWJ1aWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19
