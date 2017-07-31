/*!
 * cdp.ui.listview.js 2.0.0
 *
 * Date: 2017-07-31T02:20:36.153Z
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
        var StatusManager = (function () {
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
        var LineProfile = (function () {
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
        var PageProfile = (function () {
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
        var ScrollerElement = (function () {
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
        var ScrollerNative = (function () {
            //! constructor
            function ScrollerNative(options) {
                this._$body = null;
                this._$target = null;
                this._$scrollMap = null;
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
                this._$scrollMap = null;
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
        var ListItemView = (function (_super) {
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
        var ScrollManager = (function () {
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
        var ListView = (function (_super) {
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
        var GroupListItemView = (function (_super) {
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
        var ExpandManager = (function () {
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
        var ExpandableListView = (function (_super) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvSW50ZXJmYWNlcy50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvQ29uZmlnLnRzIiwiY2RwOi8vL0NEUC9VSS9saXN0dmlldy9VdGlscy50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvU3RhdHVzTWFuYWdlci50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvTGluZVByb2ZpbGUudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L1BhZ2VQcm9maWxlLnRzIiwiY2RwOi8vL0NEUC9VSS9saXN0dmlldy9Hcm91cFByb2ZpbGUudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L1Njcm9sbGVyRWxlbWVudC50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvU2Nyb2xsZXJOYXRpdmUudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L1Njcm9sbGVySVNjcm9sbC50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvTGlzdEl0ZW1WaWV3LnRzIiwiY2RwOi8vL0NEUC9VSS9saXN0dmlldy9TY3JvbGxNYW5hZ2VyLnRzIiwiY2RwOi8vL0NEUC9VSS9saXN0dmlldy9MaXN0Vmlldy50cyIsImNkcDovLy9DRFAvVUkvbGlzdHZpZXcvR3JvdXBMaXN0SXRlbVZpZXcudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L0V4cGFuZE1hbmFnZXIudHMiLCJjZHA6Ly8vQ0RQL1VJL2xpc3R2aWV3L0V4cGFuZGFibGVMaXN0Vmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxnQ0FBZ0M7QUFDaEMsa0NBQWtDO0FDRGxDLElBQVUsR0FBRyxDQW1CWjtBQW5CRCxXQUFVLEdBQUc7SUFBQyxNQUFFLENBbUJmO0lBbkJhLGFBQUU7UUFDWjs7O1dBR0c7UUFDSCxJQUFjLG9CQUFvQixDQWFqQztRQWJELFdBQWMsb0JBQW9CO1lBQ25CLGtDQUFhLEdBQWtCLHFCQUFxQixDQUFDO1lBQ3JELHFDQUFnQixHQUFl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QVcsRUFBRSxPQUF1QjtnQkFBdkIsd0NBQXVCO2dCQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3JELENBQUM7WUFDTCx5QkFBQztRQUFELENBQUMsQ0FoSFcsV0FBUSxHQWdIbkI7UUFqSFkscUJBQWtCLHFCQWlIOUI7SUFDTCxDQUFDLEVBMUhhLEVBQUUsR0FBRixNQUFFLEtBQUYsTUFBRSxRQTBIZjtBQUFELENBQUMsRUExSFMsR0FBRyxLQUFILEdBQUcsUUEwSFoiLCJzb3VyY2VzQ29udGVudCI6WyIvLy8gPHJlZmVyZW5jZSB0eXBlcz1cImpxdWVyeVwiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwiYmFja2JvbmVcIiAvPlxyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIExpc3RWaWV3T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIExpc3RWaWV3IOOBruWIneacn+WMluaDheWgseOCkuagvOe0jeOBmeOCi+OCpOODs+OCv+ODvOODleOCp+OCpOOCueOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIExpc3RWaWV3T3B0aW9ucyB7XHJcbiAgICAgICAgLy8hIOS9v+eUqOOBmeOCiyBJU2Nyb2xsZXIg44KS5aSJ5pu044GZ44KL5aC05ZCI44Gr5oyH5a6aICBbZGVmYXVsdDogU2Nyb2xsZXJOYXRpdmUuZ2V0RmFjdG9yeSgpXVxyXG4gICAgICAgIHNjcm9sbGVyRmFjdG9yeT86IChlbGVtZW50OiBhbnksIG9wdGlvbnM6IExpc3RWaWV3T3B0aW9ucykgPT4gSVNjcm9sbGVyO1xyXG4gICAgICAgIGVuYWJsZUhpZGRlblBhZ2U/OiBib29sZWFuOyAgICAgICAgIC8vITwgcGxlbG9hZCDlr77osaHjgpIgdmlzaWJpbGl0eTogXCJoaWRkZW5cIiDjgavjgZnjgovloLTlkIjjga8gdHJ1ZS4gICAgICAgICAgICAgICAgW2RlZmF1bHQ6IGZhbHNlXVxyXG4gICAgICAgIGVuYWJsZVRyYW5zZm9ybU9mZnNldD86IGJvb2xlYW47ICAgIC8vITwgbGlzdCBpdGVtIOOBriBvZmZzZXQg44KSIHRyYW5zZm9ybSDjgafoqK3lrprjgZnjgosgKOOBguOBvuOCiuOCiOOBj+OBquOBhCkgICAgICAgICAgW2RlZmF1bHQ6IGZhbHNlXVxyXG4gICAgICAgIHNjcm9sbE1hcFJlZnJlc2hJbnRlcnZhbD86IG51bWJlcjsgIC8vITwgc2Nyb2xsIG1hcCDpoJjln5/jga7mm7TmlrDnorroqo3plpPpmpQuIGlzY3JvbGwg562J44CB6Z2eIERPTSDmk43kvZzmmYLjgavkvb/nlKggICAgICAgIFtkZWZhdWx0OiAyMDBdXHJcbiAgICAgICAgc2Nyb2xsUmVmcmVzaERpc3RhbmNlPzogbnVtYmVyOyAgICAgLy8hPCBMaXN0VmlldyDmm7TmlrDlh6bnkIbjgpLooYzjgYYgc2Nyb2xsIOenu+WLlemHjyAo44Ki44Or44K044Oq44K644Og6KaL55u044GX44KC6KaW6YeOKSAgICAgIFtkZWZhdWx0OiAyMDBdXHJcbiAgICAgICAgcGFnZVByZXBhcmVDb3VudD86IG51bWJlcjsgICAgICAgICAgLy8hPCDooajnpLrpoJjln5/lpJbjgaflrozlhajjgarnirbmhYvjgafov73liqDjgZXjgozjgosgcGFnZSDmlbAgKOWJjeaWueODu+W+jOaWueWQiOOCj+OBm+OBpiAy5YCNKSAgIFtkZWZhdWx0OiAzXVxyXG4gICAgICAgIHBhZ2VQcmVsb2FkQ291bnQ/OiBudW1iZXI7ICAgICAgICAgIC8vITwg6KGo56S66aCY5Z+f5aSW44GnIGhpZGRlbiDnirbmhYvjgafov73liqDjgZXjgozjgosgcGFnZSDmlbAgKOWJjeaWueODu+W+jOaWueWQiOOCj+OBm+OBpiAy5YCNKSBbZGVmYXVsdDogMV1cclxuICAgICAgICBlbmFibGVBbmltYXRpb24/OiBib29sZWFuOyAgICAgICAgICAvLyE8IOOCouODi+ODoeODvOOCt+ODp+ODs+OCkuacieWKueOBq+OBmeOCi+WgtOWQiOOBryB0cnVlLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2RlZmF1bHQ6IHRydWVdXHJcbiAgICAgICAgYW5pbWF0aW9uRHVyYXRpb24/OiBudW1iZXI7ICAgICAgICAgLy8hPCDjgqLjg4vjg6Hjg7zjgrfjg6fjg7Pjga7osrvjgoTjgZnmmYLplpMgKG1zZWMpICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtkZWZhdWx0OiAwXVxyXG4gICAgICAgIGJhc2VEZXB0aD86IHN0cmluZzsgICAgICAgICAgICAgICAgIC8vITwg5Z+65rqW44Go44GZ44KLIHotaW5kZXguIFwiY29sbGFwc2VcIiDmmYLjga7jgqLjg4vjg6Hjg7zjgrfjg6fjg7PmmYLjgavkvb/nlKggICAgICAgICAgICAgW2RlZmF1bHQ6IGF1dG9dXHJcbiAgICAgICAgaXRlbVRhZ05hbWU/OiBzdHJpbmc7ICAgICAgICAgICAgICAgLy8hPCBMaXN0SXRlbVZpZXcg44GM5L2/55So44GZ44KL44K/44Kw5ZCNICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbZGVmYXVsdDogbGldXHJcbiAgICAgICAgcmVtb3ZlSXRlbVdpdGhUcmFuc2l0aW9uPzogYm9vbGVhbjsgLy8hPCByZW1vdmVJdGVtKCkg5pmC44Gr5b+F6KaB44Gr5b+c44GY44Gm6Ieq5YuV44GnIHRyYW5zaXRpb24g44KS44GL44GR44KL5aC05ZCI44GvIHRydWUgICAgW2RlZmF1bHQ6IHRydWVdXHJcbiAgICAgICAgLy8hIOmdnuOCouOCr+ODhuOCo+ODluOBqiBzY3JvbGwgbWFwIOOBq+WvvuOBl+OBpiBEdW1teSDjgpLkvb/nlKjjgZnjgovloLTlkIjjga8gdHJ1ZS4gKGZsaXBzbmFwIOWIh+OCiuabv+OBiOaZguetiS4g5Yq55p6c44Gv44GC44G+44KK44Gq44GXKSAgW2RlZmF1bHQ6IGZhbHNlXVxyXG4gICAgICAgIHVzZUR1bW15SW5hY3RpdmVTY3JvbGxNYXA/OiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElMaXN0Vmlld0ZyYW1ld29ya1xyXG4gICAgICogQGJyaWVmIExpc3RWaWV3IEZyYW1ld29yayDjgYzkvb/nlKjjgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnlrprnvqlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTGlzdFZpZXdGcmFtZXdvcmsge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNjcm9sbCBNYXAg44Gu6auY44GV44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IOePvuWcqOOBrumrmOOBlSBbcHhdXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0U2Nyb2xsTWFwSGVpZ2h0KCk6IG51bWJlcjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2Nyb2xsIE1hcCDjga7pq5jjgZXjgpLmm7TmlrBcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkZWx0ZSB7TnVtYmVyfSBbaW5dIOWkieWMlumHj+OCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHVwZGF0ZVNjcm9sbE1hcEhlaWdodChkZWx0YTogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5YaF6YOoIFByb2ZpbGUg44Gu5pu05pawXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZnJvbSB7TnVtYmVyfSBbaW5dIOabtOaWsOmWi+Wni+OCpOODs+ODh+ODg+OCr+OCueOCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHVwZGF0ZVByb2ZpbGVzKGZyb206IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNjcm9sbCBNYXAgRWxlbWVudCDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge2pRdWVyeX0gc2Nyb2xsIG1hcCBlbGVtZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0U2Nyb2xsTWFwRWxlbWVudCgpOiBKUXVlcnk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODquOCteOCpOOCr+ODq+WPr+iDveOBqiBFbGVtZW50IOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7alF1ZXJ5fSByZWN5Y2xlIGVsZW1lbnRzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZmluZFJlY3ljbGVFbGVtZW50cygpOiBKUXVlcnk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExpc3RWaWV3T3B0aW9ucyDjgpLlj5blvpdcclxuICAgICAgICAgKiDjgZnjgbnjgabjga7jg5fjg63jg5Hjg4bjgqPjgqLjgq/jgrvjgrnjgpLkv53oqLzjgZnjgovjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0xpc3RWaWV3T3B0aW9uc30gb3B0aW9uIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldExpc3RWaWV3T3B0aW9ucygpOiBMaXN0Vmlld09wdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSVNjcm9sbGVyXHJcbiAgICAgKiBAYnJpZWYgU2Nyb2xsZXIg44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVNjcm9sbGVyIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTY3JvbGxlciDjga7lnovmg4XloLHjgpLlj5blvpdcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRUeXBlKCk6IHN0cmluZztcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcG9zaXRpb24g5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IDogcG9zaXRpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXRQb3MoKTogbnVtYmVyO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwb3NpdGlvbiDjga7mnIDlpKflgKTjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0gOiBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldFBvc01heCgpOiBudW1iZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCpOODmeODs+ODiOeZu+mMslxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHR5cGUge1N0cmluZ30gICBbaW5dIGV2ZW50IOWQjVxyXG4gICAgICAgICAqIEBwYXJhbSBmdW5jIHtGdW5jdGlvbn0gW2luXSBldmVudCBoYW5kbGVyXHJcbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfSA6IHBvc2l0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb24odHlwZTogc3RyaW5nLCBmdW5jOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCpOODmeODs+ODiOeZu+mMsuino+mZpFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHR5cGUge1N0cmluZ30gICBbaW5dIGV2ZW50IOWQjVxyXG4gICAgICAgICAqIEBwYXJhbSBmdW5jIHtGdW5jdGlvbn0gW2luXSBldmVudCBoYW5kbGVyXHJcbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfSA6IHBvc2l0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgb2ZmKHR5cGU6IHN0cmluZywgZnVuYzogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBwb3MgICAgIHtOdW1iZXJ9ICBbaW5dIOOCueOCr+ODreODvOODq+S9jee9riAoMCAtIHBvc01heClcclxuICAgICAgICAgKiBAcGFyYW0gYW5pbWF0ZSB7Qm9vbGVhbn0gW2luXSDjgqLjg4vjg6Hjg7zjgrfjg6fjg7Pjga7mnInnhKFcclxuICAgICAgICAgKiBAcGFyYW0gdGltZSAgICB7TnVtYmVyfSAgW2luXSDjgqLjg4vjg6Hjg7zjgrfjg6fjg7PjgavosrvjgoTjgZnmmYLplpMgW21zZWNdXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2Nyb2xsVG8ocG9zOiBudW1iZXIsIGFuaW1hdGU/OiBib29sZWFuLCB0aW1lPzogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2Nyb2xsZXIg44Gu54q25oWL5pu05pawXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdXBkYXRlKCk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFNjcm9sbGVyIOOBruegtOajhFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGRlc3Ryb3koKTogdm9pZDtcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJU2Nyb2xsYWJsZVxyXG4gICAgICogQGJyaWVmIFNjcm9sbCDjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU2Nyb2xsYWJsZSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44K544Kv44Ot44O844Or44Kk44OZ44Oz44OI44OP44Oz44OJ44Op6Kit5a6aL+ino+mZpFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGhhbmRsZXIge0Z1bmN0aW9ufSBbaW5dIOODj+ODs+ODieODqemWouaVsFxyXG4gICAgICAgICAqIEBwYXJhbSBvbiAgICAgIHtCb29sZWFufSAgW2luXSB0cnVlOiDoqK3lrpogLyBmYWxzZTog6Kej6ZmkXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc2V0U2Nyb2xsSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrnjgq/jg63jg7zjg6vntYLkuobjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gaGFuZGxlciB7RnVuY3Rpb259IFtpbl0g44OP44Oz44OJ44Op6Zai5pWwXHJcbiAgICAgICAgICogQHBhcmFtIG9uICAgICAge0Jvb2xlYW59ICBbaW5dIHRydWU6IOioreWumiAvIGZhbHNlOiDop6PpmaRcclxuICAgICAgICAgKi9cclxuICAgICAgICBzZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0gOiBwb3NpdGlvblxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldFNjcm9sbFBvcygpOiBudW1iZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCueOCr+ODreODvOODq+S9jee9ruOBruacgOWkp+WApOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfSA6IHBvc2l0aW9uXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zTWF4KCk6IG51bWJlcjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44K544Kv44Ot44O844Or5L2N572u44KS5oyH5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcG9zICAgICB7TnVtYmVyfSAgW2luXSDjgrnjgq/jg63jg7zjg6vkvY3nva4gKDAgLSBwb3NNYXgpXHJcbiAgICAgICAgICogQHBhcmFtIGFuaW1hdGUge0Jvb2xlYW59IFtpbl0g44Ki44OL44Oh44O844K344On44Oz44Gu5pyJ54ShXHJcbiAgICAgICAgICogQHBhcmFtIHRpbWUgICAge051bWJlcn0gIFtpbl0g44Ki44OL44Oh44O844K344On44Oz44Gr6LK744KE44GZ5pmC6ZaTIFttc2VjXVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHNjcm9sbFRvKHBvczogbnVtYmVyLCBhbmltYXRlPzogYm9vbGVhbiwgdGltZT86IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaMh+WumuOBleOCjOOBnyBMaXN0SXRlbVZpZXcg44Gu6KGo56S644KS5L+d6Ki8XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gaW5kZXggICB7TnVtYmVyfSAgICAgICAgICAgICAgIFtpbl0gTGlzdEl0ZW1WaWV3IOOBruOCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtFbnN1cmVWaXNpYmxlT3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBlbnN1cmVWaXNpYmxlKGluZGV4OiBudW1iZXIsIG9wdGlvbnM/OiBFbnN1cmVWaXNpYmxlT3B0aW9ucyk6IHZvaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSUJhY2t1cFJlc3RvcmVcclxuICAgICAqIEBicmllZiBCYWNrdXAvUmVzdG9yZSDjga7jgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQmFja3VwUmVzdG9yZSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5YaF6YOo44OH44O844K/44KS44OQ44OD44Kv44Ki44OD44OXXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ga2V5IHtTdHJpbmd9IFtpbl0g44OQ44OD44Kv44Ki44OD44OX44Kt44O844KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5oiQ5YqfIC8gZmFsc2U6IOWkseaVl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWGhemDqOODh+ODvOOCv+OCkuODquOCueODiOOColxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGtleSAgICAge1N0cmluZ30gIFtpbl0g44OQ44OD44Kv44Ki44OD44OX44Kt44O844KS5oyH5a6aXHJcbiAgICAgICAgICogQHBhcmFtIHJlYnVpbGQge0Jvb2xlYW59IFtpbl0gcmVidWlsZCDjgpLlrp/ooYzjgZnjgovloLTlkIjjga8gdHJ1ZSDjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDmiJDlip8gLyBmYWxzZTog5aSx5pWXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVzdG9yZShrZXk6IHN0cmluZywgcmVidWlsZDogYm9vbGVhbik6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruacieeEoVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGtleSB7U3RyaW5nfSBbaW5dIOODkOODg+OCr+OCouODg+ODl+OCreODvOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaciSAvIGZhbHNlOiDnhKFcclxuICAgICAgICAgKi9cclxuICAgICAgICBoYXNCYWNrdXAoa2V5OiBzdHJpbmcpOiBib29sZWFuO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7noLTmo4RcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBrZXkge1N0cmluZ30gW2luXSDjg5Djg4Pjgq/jgqLjg4Pjg5fjgq3jg7zjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDmiJDlip8gLyBmYWxzZTog5aSx5pWXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY2xlYXJCYWNrdXAoa2V5Pzogc3RyaW5nKTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gr44Ki44Kv44K744K5XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHthbnl9IOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGJhY2t1cERhdGE6IGFueTtcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIGV4cG9ydCB0eXBlIFZpZXdDb25zdHJ1Y3RvciA9IG5ldyAob3B0aW9ucz86IEJhY2tib25lLlZpZXdPcHRpb25zPEJhY2tib25lLk1vZGVsPikgPT4gQmFja2JvbmUuVmlldzxCYWNrYm9uZS5Nb2RlbD47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElDb21wb3NhYmxlVmlld1xyXG4gICAgICogQGJyaWVmIElDb21wb3NhYmxlVmlld1N0YXRpYyDjga7jg5fjg63jgq3jgrfjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrkgKGV4cGVyaW1lbnRhbClcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJQ29tcG9zYWJsZVZpZXcge1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJQ29tcG9zYWJsZVZpZXdTdGF0aWNcclxuICAgICAqIEBicmllZiBWaWV3IGNvbXBvc2Ug44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUNvbXBvc2FibGVWaWV3U3RhdGljIHtcclxuICAgICAgICBuZXcgKCk6IElDb21wb3NhYmxlVmlldztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgZnjgafjgavlrprnvqnjgZXjgozjgZ8gQmFja2JvbmUuVmlldyDjgpLln7rlupXjgq/jg6njgrnjgavoqK3lrprjgZfjgIFleHRlbmQg44KS5a6f6KGM44GZ44KL44CCXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZGVyaXZlcyAgICAgICAgIHtCYWNrYm9uZS5WaWV3fEJhY2tib25lLlZpZXdbXX0gW2luXSDlkIjmiJDlhYPjga4gVmlldyDjgq/jg6njgrlcclxuICAgICAgICAgKiBAcGFyYW0gcHJvcGVydGllcyAgICAgIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgW2luXSBwcm90b3R5cGUg44OX44Ot44OR44OG44KjXHJcbiAgICAgICAgICogQHBhcmFtIGNsYXNzUHJvcGVydGllcyB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgIFtpbl0gc3RhdGljIOODl+ODreODkeODhuOCo1xyXG4gICAgICAgICAqIEByZXR1cm4ge0JhY2tib25lLlZpZXd8QmFja2JvbmUuVmlld1tdfSDmlrDopo/jgavnlJ/miJDjgZXjgozjgZ8gVmlldyDjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAgICAgKi9cclxuICAgICAgICBjb21wb3NlKGRlcml2ZXM6IFZpZXdDb25zdHJ1Y3RvciB8IFZpZXdDb25zdHJ1Y3RvcltdLCBwcm9wZXJ0aWVzOiBhbnksIGNsYXNzUHJvcGVydGllcz86IGFueSk6IFZpZXdDb25zdHJ1Y3RvcjtcclxuICAgIH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBVcGRhdGVIZWlnaHRPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgSUxpc3RJdGVtVmlldy51cGRhdGVIZWlnaHQoKSDjgavmuKHjgZvjgovjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBVcGRhdGVIZWlnaHRPcHRpb25zIHtcclxuICAgICAgICByZWZsZWN0QWxsPzogYm9vbGVhbjsgICAgLy8hPCBsaW5lIOOBrumrmOOBleabtOaWsOaZguOBq+W9semfv+OBmeOCi+OBmeOBueOBpuOBriBMaW5lUHJvZmlsZSDjga7lho3oqIjnrpfjgpLooYzjgYbloLTlkIjjga8gdHJ1ZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJTGlzdEl0ZW1WaWV3XHJcbiAgICAgKiBAYnJpZWYgICAgIExpc3RWaWV3IOOBriAx6KGM5YiG44KS5qeL5oiQ44GZ44KLIENoaWxkIFZpZXcg44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUxpc3RJdGVtVmlldyB7XHJcbiAgICAgICAgLy8hIOiHqui6q+OBriBMaW5lIOOCpOODs+ODh+ODg+OCr+OCueOCkuWPluW+l1xyXG4gICAgICAgIGdldEluZGV4KCk6IG51bWJlcjtcclxuICAgICAgICAvLyEg6Ieq6Lqr44Gr5oyH5a6a44GV44KM44Gf6auY44GV44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U3BlY2lmaWVkSGVpZ2h0KCk6IG51bWJlcjtcclxuICAgICAgICAvLyEgY2hpbGQgbm9kZSDjgYzlrZjlnKjjgZnjgovjgYvliKTlrppcclxuICAgICAgICBoYXNDaGlsZE5vZGUoKTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6auY44GV44KS5pu05pawXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gbmV3SGVpZ2h0IHtOdW1iZXJ9ICAgICAgICAgICAgICBbaW5dIOaWsOOBl+OBhOmrmOOBlVxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zICAge1VwZGF0ZUhlaWdodE9wdGlvbnN9IFtpbl0gbGluZSDjga7pq5jjgZXmm7TmlrDmmYLjgavlvbHpn7/jgZnjgovjgZnjgbnjgabjga4gTGluZVByb2ZpbGUg44Gu5YaN6KiI566X44KS6KGM44GG5aC05ZCI44GvIHsgcmVmbGVjdEFsbDogdHJ1ZSB9XHJcbiAgICAgICAgICogQHJldHVybiB7SUxpc3RJdGVtVmlld30g44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdXBkYXRlSGVpZ2h0KG5ld0hlaWdodDogbnVtYmVyLCBvcHRpb25zPzogVXBkYXRlSGVpZ2h0T3B0aW9ucyk6IElMaXN0SXRlbVZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEJhc2VMaXN0SXRlbVZpZXdcclxuICAgICAqIEBicmllZiAgICAgSUxpc3RJdGVtVmlldyDjga4gYWxpYXNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCYXNlTGlzdEl0ZW1WaWV3IGV4dGVuZHMgSUxpc3RJdGVtVmlldywgQmFja2JvbmUuVmlldzxCYWNrYm9uZS5Nb2RlbD4geyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEVuc3VyZVZpc2libGVPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgSUxpc3RWaWV3LmVuc3VyZVZpc2libGUoKSDjgavmuKHjgZvjgovjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBFbnN1cmVWaXNpYmxlT3B0aW9ucyB7XHJcbiAgICAgICAgcGFydGlhbE9LPzogYm9vbGVhbjsgICAgLy8hPCDpg6jliIbnmoTooajnpLrjgpLoqLHlj6/jgZnjgovloLTlkIggdHJ1ZSwgZGVmYXVsdDogdHJ1ZS5cclxuICAgICAgICBzZXRUb3A/OiBib29sZWFuOyAgICAgICAvLyE8IOW8t+WItueahOOBq+OCueOCr+ODreODvOODq+mgmOWfn+OBruS4iumDqOOBq+enu+WLleOBmeOCi+WgtOWQiCB0cnVlLCBkZWZhdWx0OiBmYWxzZS5cclxuICAgICAgICBhbmltYXRlPzogYm9vbGVhbjsgICAgICAvLyE8IOOCouODi+ODoeODvOOCt+ODp+ODs+OBmeOCi+WgtOWQiCB0cnVlLiBkZWZhdWx0OiBMaXN0Vmlld09wdGlvbnMuZW5hYmxlQW5pbWF0aW9uIOOBruioreWumuOBqOWQjOacn1xyXG4gICAgICAgIHRpbWU/OiBudW1iZXI7ICAgICAgICAgIC8vITwg44Ki44OL44Oh44O844K344On44Oz44Gr6LK744KE44GZ5pmC6ZaTIFttc2VjXVxyXG4gICAgICAgIGNhbGxiYWNrPzogKCkgPT4gdm9pZDsgIC8vITwg44Ki44OL44Oh44O844K344On44Oz57WC5LqG44Gu44K/44Kk44Of44Oz44Kw44Gn44Kz44O844Or44GV44KM44KLLiAo55aR5Ly855qEKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJTGlzdFZpZXdcclxuICAgICAqIEBicmllZiBMaXN0VmlldyDjga7jgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTGlzdFZpZXcgZXh0ZW5kcyBJU2Nyb2xsYWJsZSwgSUJhY2t1cFJlc3RvcmUge1xyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIFByb2ZpbGUg566h55CGXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWIneacn+WMlua4iOOBv+OBi+WIpOWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5Yid5pyf5YyW5riI44G/IC8gZmFsc2U6IOacquWIneacn+WMllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzSW5pdGlhbGl6ZWQoKTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogSXRlbSDnmbvpjLJcclxuICAgICAgICAgKiDjg5fjg63jg5Hjg4bjgqPjgpLmjIflrprjgZfjgabjgIFMaXN0SXRlbSDjgpLnrqHnkIZcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBoZWlnaHQgICAgICB7TnVtYmVyfSAgIFtpbl0g44Op44Kk44Oz44Gu6auY44GVXHJcbiAgICAgICAgICogQHBhcmFtIGluaXRpYWxpemVyIHtGdW5jdGlvbn0gW2luXSBMaXN0SXRlbVZpZXcg5rS+55Sf44Kv44Op44K544Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgICAgICogQHBhcmFtIGluZm8gICAgICAgIHtPYmplY3R9ICAgW2luXSBpbml0aWFsaXplciDjgavmuKHjgZXjgozjgovjgqrjg5fjgrfjg6fjg7PlvJXmlbBcclxuICAgICAgICAgKiBAcGFyYW0gaW5zZXJ0VG8gICAge051bWJlcn0gICBbaW5dIOODqeOCpOODs+OBruaMv+WFpeS9jee9ruOCkuOCpOODs+ODh+ODg+OCr+OCueOBp+aMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGFkZEl0ZW0oaGVpZ2h0OiBudW1iZXIsIGluaXRpYWxpemVyOiBuZXcgKG9wdGlvbnM/OiBhbnkpID0+IEJhc2VMaXN0SXRlbVZpZXcsIGluZm86IGFueSwgaW5zZXJ0VG8/OiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmjIflrprjgZfjgZ8gSXRlbSDjgpLliYrpmaRcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBpbmRleCB7TnVtYmVyfE51bWJlcltdfSBbaW5dIOino+mZpOmWi+Wni+OBruOCpOODs+ODh+ODg+OCr+OCueOCkuaMh+Wumi4g6YWN5YiX54mI44GvIHJldmVyc2UgaW5kZXgg44KS5oyH5a6a44GZ44KL44G744GG44GM5Yq5546H55qEXHJcbiAgICAgICAgICogQHBhcmFtIHNpemUgIHtOdW1iZXJ9ICAgICAgICAgIFtpbl0g6Kej6Zmk44GZ44KL44Op44Kk44Oz44Gu57eP5pWwLiDml6Llrpo6IDFcclxuICAgICAgICAgKiBAcGFyYW0gZGVsYXkge051bWJlcn0gICAgICAgICAgW2luXSDlrp/pmpvjgavopoHntKDjgpLliYrpmaTjgZnjgosgZGVsYXkgdGltZSDml6Llrpo6IDAgKOWNs+aZguWJiumZpClcclxuICAgICAgICAgKi9cclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXIsIHNpemU/OiBudW1iZXIsIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXJbXSwgZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmjIflrprjgZfjgZ8gSXRlbSDjgavoqK3lrprjgZfjgZ/mg4XloLHjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB0YXJnZXQge051bWJlcnxKUXVlcnkuRXZlbnR9IFtpbl0g6K2Y5Yil5a2QLiBbaW5kZXggfCBldmVudCBvYmplY3RdXHJcbiAgICAgICAgICogQHJldHVybiB7T2JqZWN0fSBfYWRkTGluZSgpIOOBq+aMh+WumuOBl+OBnyBpbmZvIOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogbnVtYmVyKTogYW55O1xyXG4gICAgICAgIGdldEl0ZW1JbmZvKHRhcmdldDogSlF1ZXJ5LkV2ZW50KTogYW55O1xyXG5cclxuICAgICAgICAvLyEg44Ki44Kv44OG44Kj44OW44Oa44O844K444KS5pu05pawXHJcbiAgICAgICAgcmVmcmVzaCgpOiB2b2lkO1xyXG4gICAgICAgIC8vISDmnKrjgqLjgrXjgqTjg7Pjg5rjg7zjgrjjgpLmp4vnr4lcclxuICAgICAgICB1cGRhdGUoKTogdm9pZDtcclxuICAgICAgICAvLyEg44Oa44O844K444Ki44K144Kk44Oz44KS5YaN5qeL5oiQXHJcbiAgICAgICAgcmVidWlsZCgpOiB2b2lkO1xyXG4gICAgICAgIC8vISDnrqHovYTjg4fjg7zjgr/jgpLnoLTmo4RcclxuICAgICAgICByZWxlYXNlKCk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gUHJvcGVydGllczpcclxuXHJcbiAgICAgICAgLy8hIGNvcmUgZnJhbWV3b3JrIGFjY2Vzc1xyXG4gICAgICAgIGNvcmU6IElMaXN0Vmlld0ZyYW1ld29yaztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSUxpc3RWaWV3XHJcbiAgICAgKiBAYnJpZWYgTGlzdFZpZXcg44Gu44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUxpc3RWaWV3IHtcclxuICAgICAgICAvLyEg55m76YyyIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgotcclxuICAgICAgICBfYWRkTGluZT8oX2xpbmU6IExpbmVQcm9maWxlLCBpbnNlcnRUbz86IG51bWJlcik6IHZvaWQ7XHJcbiAgICAgICAgX2FkZExpbmU/KF9saW5lOiBMaW5lUHJvZmlsZVtdLCBpbnNlcnRUbz86IG51bWJlcik6IHZvaWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEJhc2VMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmICAgICBJTGlzdFZpZXcg44GuIGFsaWFzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQmFzZUxpc3RWaWV3IGV4dGVuZHMgSUxpc3RWaWV3LCBCYWNrYm9uZS5WaWV3PEJhY2tib25lLk1vZGVsPiB7IH1cclxuXHJcbiAgICAvL19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX18vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJU3RhdHVzTWFuYWdlclxyXG4gICAgICogQGJyaWVmIOeKtuaFi+euoeeQhuOCpOODs+OCv+ODvOODleOCp+OCpOOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdGF0dXNNYW5hZ2VyIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jgqTjg7Pjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBzdGF0dXMge1N0cmluZ30gW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKi9cclxuICAgICAgICBzdGF0dXNBZGRSZWYoc3RhdHVzOiBzdHJpbmcpOiBudW1iZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruODh+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyB7U3RyaW5nfSBbaW5dIOeKtuaFi+itmOWIpeWtkFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXR1c1JlbGVhc2Uoc3RhdHVzOiBzdHJpbmcpOiBudW1iZXI7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWHpueQhuOCueOCs+ODvOODl+avjuOBq+eKtuaFi+WkieaVsOOCkuioreWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyAgIHtTdHJpbmd9ICAgW2luXSDnirbmhYvorZjliKXlrZBcclxuICAgICAgICAgKiBAcGFyYW0gY2FsbGJhY2sge0Z1bmN0aW9ufSBbaW5dIOWHpueQhuOCs+ODvOODq+ODkOODg+OCr1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXR1c1Njb3BlKHN0YXR1czogc3RyaW5nLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQ7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaMh+WumuOBl+OBn+eKtuaFi+S4reOBp+OBguOCi+OBi+eiuuiqjVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHN0YXR1cyB7U3RyaW5nfSAgIFtpbl0g54q25oWL6K2Y5Yil5a2QXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog54q25oWL5YaFIC8gZmFsc2U6IOeKtuaFi+WkllxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzU3RhdHVzSW4oc3RhdHVzOiBzdHJpbmcpOiBib29sZWFuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIElFeHBhbmRNYW5hZ2VyXHJcbiAgICAgKiBAYnJpZWYg6ZaL6ZaJ566h55CG44Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUV4cGFuZE1hbmFnZXIgZXh0ZW5kcyBJQmFja3VwUmVzdG9yZSwgSVN0YXR1c01hbmFnZXIge1xyXG4gICAgICAgIGxheW91dEtleTogc3RyaW5nOyAgICAvLyBsYXlvdXQga2V5IChwb3J0cmF0ZS9sYW5kc2NhcGXjgZTjgajjgasgbGF5b3V05oOF5aCx44Gr44Ki44Kv44K744K5KVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmlrDopo8gR3JvdXBQcm9maWxlIOOCkuS9nOaIkFxyXG4gICAgICAgICAqIOeZu+mMsua4iOOBv+OBruWgtOWQiOOBr+OBneOBruOCquODluOCuOOCp+OCr+ODiOOCkui/lOWNtFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcm1hIGlkIHtTdHJpbmd9IFtpbl0g5paw6KaP44Gr5L2c5oiQ44GZ44KLIEdyb3VwIElEIOOCkuaMh+Wumi4g5oyH5a6a44GX44Gq44GE5aC05ZCI44Gv6Ieq5YuV5Ymy44KK5oyv44KKXHJcbiAgICAgICAgICogQHJldHVybiB7R3JvdXBQcm9maWxlfSBHcm91cFByb2ZpbGUg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbmV3R3JvdXAoaWQ/OiBzdHJpbmcpOiBHcm91cFByb2ZpbGU7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeZu+mMsua4iOOBvyBHcm91cCDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJtYSBpZCB7U3RyaW5nfSBbaW5dIOWPluW+l+OBmeOCiyBHcm91cCBJRCDjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJuIHtHcm91cFByb2ZpbGV9IEdyb3VwUHJvZmlsZSDjgqTjg7Pjgrnjgr/jg7PjgrkgLyBudWxsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0R3JvdXAoaWQ6IHN0cmluZyk6IEdyb3VwUHJvZmlsZTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog56ysMemajuWxpOOBriBHcm91cCDnmbvpjLJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSB0b3BHcm91cCB7R3JvdXBQcm9maWxlfSBbaW5dIOani+eviea4iOOBvyBHcm91cFByb2ZpbGUg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVnaXN0ZXJUb3BHcm91cCh0b3BHcm91cDogR3JvdXBQcm9maWxlKTogdm9pZDtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog56ysMemajuWxpOOBriBHcm91cCDjgpLlj5blvpdcclxuICAgICAgICAgKiDjgrPjg5Tjg7zphY3liJfjgYzov5TjgZXjgozjgovjgZ/jgoHjgIHjgq/jg6njgqTjgqLjg7Pjg4jjga/jgq3jg6Pjg4Pjgrfjg6XkuI3lj69cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0dyb3VwUHJvZmlsZVtdfSBHcm91cFByb2ZpbGUg6YWN5YiXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0VG9wR3JvdXBzKCk6IEdyb3VwUHJvZmlsZVtdO1xyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5bGV6ZaLICgx6ZqO5bGkKVxyXG4gICAgICAgIGV4cGFuZEFsbCgpOiB2b2lkO1xyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5Y+O5p2fICgx6ZqO5bGkKVxyXG4gICAgICAgIGNvbGxhcHNlQWxsKGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICAgICAgLy8hIOWxlemWi+S4reOBi+WIpOWumlxyXG4gICAgICAgIGlzRXhwYW5kaW5nKCk6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIC8vISDlj47mnZ/kuK3jgYvliKTlrppcclxuICAgICAgICBpc0NvbGxhcHNpbmcoKTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgLy8hIOmWi+mWieS4reOBi+WIpOWumlxyXG4gICAgICAgIGlzU3dpdGNoaW5nKCk6IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgLy9fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgRXhwYW5kYWJsZUxpc3RWaWV3XHJcbiAgICAgKiBAYnJpZWYg6ZaL6ZaJ44Oq44K544OI44OT44Ol44O844Kk44Oz44K/44O844OV44Kn44Kk44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSUV4cGFuZGFibGVMaXN0VmlldyBleHRlbmRzIElMaXN0VmlldywgSUV4cGFuZE1hbmFnZXIgeyB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaW50ZXJmYWNlIEJhc2VFeHBhbmRhYmxlTGlzdFZpZXdcclxuICAgICAqIEBicmllZiAgICAgSUV4cGFuZGFibGVMaXN0VmlldyDjga4gYWxpYXNcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBCYXNlRXhwYW5kYWJsZUxpc3RWaWV3IGV4dGVuZHMgSUV4cGFuZGFibGVMaXN0VmlldywgQmFja2JvbmUuVmlldzxCYWNrYm9uZS5Nb2RlbD4geyB9XHJcbn1cclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwiY2RwLnVpLmxpc3R2aWV3XCIge1xyXG4gICAgY29uc3QgVUk6IHR5cGVvZiBDRFAuVUk7XHJcbiAgICBleHBvcnQgPSBVSTtcclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIExpc3RWaWV3R2xvYmFsQ29uZmlnXHJcbiAgICAgKiBAYnJpZWYgY2RwLnVpLmxpc3R2aWV3IOOBriBnbG9iYWwgY29uZmluZ1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgbW9kdWxlIExpc3RWaWV3R2xvYmFsQ29uZmlnIHtcclxuICAgICAgICBleHBvcnQgbGV0IFdSQVBQRVJfQ0xBU1MgICAgICAgICAgICAgICAgPSBcInVpLWxpc3R2aWV3LXdyYXBwZXJcIjtcclxuICAgICAgICBleHBvcnQgbGV0IFdSQVBQRVJfU0VMRUNUT1IgICAgICAgICAgICAgPSBcIi5cIiArIFdSQVBQRVJfQ0xBU1M7XHJcbiAgICAgICAgZXhwb3J0IGxldCBTQ1JPTExfTUFQX0NMQVNTICAgICAgICAgICAgID0gXCJ1aS1saXN0dmlldy1zY3JvbGwtbWFwXCI7XHJcbiAgICAgICAgZXhwb3J0IGxldCBTQ1JPTExfTUFQX1NFTEVDVE9SICAgICAgICAgID0gXCIuXCIgKyBTQ1JPTExfTUFQX0NMQVNTO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgSU5BQ1RJVkVfQ0xBU1MgICAgICAgICAgICAgICA9IFwiaW5hY3RpdmVcIjtcclxuICAgICAgICBleHBvcnQgbGV0IElOQUNUSVZFX0NMQVNTX1NFTEVDVE9SICAgICAgPSBcIi5cIiArIElOQUNUSVZFX0NMQVNTO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUkVDWUNMRV9DTEFTUyAgICAgICAgICAgICAgICA9IFwidWktbGlzdHZpZXctcmVjeWNsZVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgUkVDWUNMRV9DTEFTU19TRUxFQ1RPUiAgICAgICA9IFwiLlwiICsgUkVDWUNMRV9DTEFTUztcclxuICAgICAgICBleHBvcnQgbGV0IExJU1RJVEVNX0JBU0VfQ0xBU1MgICAgICAgICAgPSBcInVpLWxpc3R2aWV3LWl0ZW0tYmFzZVwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgTElTVElURU1fQkFTRV9DTEFTU19TRUxFQ1RPUiA9IFwiLlwiICsgTElTVElURU1fQkFTRV9DTEFTUztcclxuICAgICAgICBleHBvcnQgbGV0IERBVEFfUEFHRV9JTkRFWCAgICAgICAgICAgICAgPSBcImRhdGEtcGFnZS1pbmRleFwiO1xyXG4gICAgICAgIGV4cG9ydCBsZXQgREFUQV9DT05UQUlORVJfSU5ERVggICAgICAgICA9IFwiZGF0YS1jb250YWluZXItaW5kZXhcIjtcclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICAvLyBjZHAudWkubGlzdHZpZXcg44GvIGNkcC5jb3JlIOOBq+S+neWtmOOBl+OBquOBhOOBn+OCgeOAgeeLrOiHquOBq2dsb2JhbCDjgpLmj5DkvpvjgZnjgotcclxuICAgIC8qanNoaW50IGV2aWw6dHJ1ZSAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGdsb2JhbCA9ICg8YW55PkNEUCkuZ2xvYmFsIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcclxuICAgIC8qanNoaW50IGV2aWw6ZmFsc2UgKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJhY2tib25lLlZpZXcg44Gu5paw6KaP5ZCI5oiQXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGJhc2UgICAge0JhY2tib25lLlZpZXd9ICAgICAgICAgICAgICAgICBbaW5dIHByb3RvdHlwZSBjaGFpbiDmnIDkuIvkvY3jga4gVmlldyDjgq/jg6njgrlcclxuICAgICAqIEBwYXJhbSBkZXJpdmVzIHtCYWNrYm9uZS5WaWV3fEJhY2tib25lLlZpZXdbXX0gW2luXSDmtL7nlJ/jgZXjgozjgovjga4gVmlldyDjgq/jg6njgrlcclxuICAgICAqIEByZXR1cm4ge0JhY2tib25lLlZpZXd8QmFja2JvbmUuVmlld1tdfSDmlrDopo/jgavnlJ/miJDjgZXjgozjgZ8gVmlldyDjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNvbXBvc2VWaWV3cyhiYXNlOiBWaWV3Q29uc3RydWN0b3IsIGRlcml2ZXM6IFZpZXdDb25zdHJ1Y3RvciB8IFZpZXdDb25zdHJ1Y3RvcltdKTogVmlld0NvbnN0cnVjdG9yIHtcclxuICAgICAgICBsZXQgX2NvbXBvc2VkID0gYmFzZTtcclxuICAgICAgICBjb25zdCBfZGVyaXZlcyA9IDxWaWV3Q29uc3RydWN0b3JbXT4oZGVyaXZlcyBpbnN0YW5jZW9mIEFycmF5ID8gZGVyaXZlcyA6IFtkZXJpdmVzXSk7XHJcbiAgICAgICAgX2Rlcml2ZXMuZm9yRWFjaCgoZGVyaXZlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNlZWQgPSB7fTtcclxuICAgICAgICAgICAgXy5leHRlbmRPd24oc2VlZCwgZGVyaXZlLnByb3RvdHlwZSk7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBzZWVkLmNvbnN0cnVjdG9yO1xyXG4gICAgICAgICAgICBfY29tcG9zZWQgPSAoPGFueT5fY29tcG9zZWQpLmV4dGVuZChzZWVkKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gX2NvbXBvc2VkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQmFja2JvbmUuVmlldyDjga7lkIjmiJBcclxuICAgICAqIHByb3RvdHlwZSBjaGFpbiDjgpLkvZzjgovlkIjmiJBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gZGVyaXZlZCB7QmFja2JvbmUuVmlld30gICAgICAgICAgICAgICAgIFtpbl0gcHJvdG90eXBlIGNoYWluIOacgOS4iuS9jeOBriBWaWV3IOOCr+ODqeOCuVxyXG4gICAgICogQHBhcmFtIGJhc2VzICAge0JhY2tib25lLlZpZXd8QmFja2JvbmUuVmlld1tdfSBbaW5dIOWQiOaIkOWFg+OBrlZpZXcg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZXJpdmVWaWV3cyhkZXJpdmVkOiBWaWV3Q29uc3RydWN0b3IsIGJhc2VzOiBWaWV3Q29uc3RydWN0b3IgfCBWaWV3Q29uc3RydWN0b3JbXSk6IHZvaWQge1xyXG4gICAgICAgIGxldCBfY29tcG9zZWQ6IFZpZXdDb25zdHJ1Y3RvcjtcclxuICAgICAgICBjb25zdCBfYmFzZXMgPSA8Vmlld0NvbnN0cnVjdG9yW10+KGJhc2VzIGluc3RhbmNlb2YgQXJyYXkgPyBiYXNlcyA6IFtiYXNlc10pO1xyXG4gICAgICAgIGlmICgyIDw9IF9iYXNlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgX2NvbXBvc2VkID0gY29tcG9zZVZpZXdzKF9iYXNlc1swXSwgX2Jhc2VzLnNsaWNlKDEpKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBfY29tcG9zZWQgPSBfYmFzZXNbMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlcml2ZWQgPSBjb21wb3NlVmlld3MoX2NvbXBvc2VkLCBkZXJpdmVkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJhY2tib25lLlZpZXcg44Gu5ZCI5oiQXHJcbiAgICAgKiBwcm90b3R5cGUgY2hhaW4g44KS5L2c44KJ44Gq44GE5ZCI5oiQXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGRlcml2ZWQge0JhY2tib25lLlZpZXd9ICAgICAgICAgICAgICAgICBbaW5dIOWFg+OBqOOBquOCiyBWaWV3IOOCr+ODqeOCuVxyXG4gICAgICogQHBhcmFtIGJhc2VzICAge0JhY2tib25lLlZpZXd8QmFja2JvbmUuVmlld1tdfSBbaW5dIOWQiOaIkOWFg+OBrlZpZXcg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBtaXhpblZpZXdzKGRlcml2ZWQ6IFZpZXdDb25zdHJ1Y3RvciwgYmFzZXM6IFZpZXdDb25zdHJ1Y3RvciB8IFZpZXdDb25zdHJ1Y3RvcltdKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgX2Jhc2VzID0gPFZpZXdDb25zdHJ1Y3RvcltdPihiYXNlcyBpbnN0YW5jZW9mIEFycmF5ID8gYmFzZXMgOiBbYmFzZXNdKTtcclxuICAgICAgICBfYmFzZXMuZm9yRWFjaCgoYmFzZSkgPT4ge1xyXG4gICAgICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlLnByb3RvdHlwZSkuZm9yRWFjaChuYW1lID0+IHtcclxuICAgICAgICAgICAgICAgIGRlcml2ZWQucHJvdG90eXBlW25hbWVdID0gYmFzZS5wcm90b3R5cGVbbmFtZV07XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fX19fXy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgX0xpc3RWaWV3VXRpbHNcclxuICAgICAqIEBicmllZiDlhoXpg6jjgafkvb/nlKjjgZnjgovkvr/liKnplqLmlbBcclxuICAgICAqICAgICAgICBUb29scyDjgYvjgonjga7mnIDkvY7pmZDjga7mtYHnlKhcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IG1vZHVsZSBfTGlzdFZpZXdVdGlscyB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNzcyDjga4gdmVuZGVyIOaLoeW8tSBwcmVmaXgg44KS6L+U44GZXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX0gcHJlZml4XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IGNzc1ByZWZpeGVzID0gW1wiLXdlYmtpdC1cIiwgXCItbW96LVwiLCBcIi1tcy1cIiwgXCItby1cIiwgXCJcIl07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNzcyDjga4gbWF0cml4IOOBruWApOOCkuWPluW+ly5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBlbGVtZW50IHtqUXVlcnl9IFtpbl0g5a++6LGh44GuIGpRdWVyeSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAcGFyYW0gdHlwZSAgICB7U3RyaW5nfSBbaW5dIG1hdHJpeCB0eXBlIHN0cmluZyBbdHJhbnNsYXRlWCB8IHRyYW5zbGF0ZVkgfCBzY2FsZVggfCBzY2FsZVldXHJcbiAgICAgICAgICogQHJldHVybiB7TnVtYmVyfSB2YWx1ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBjb25zdCBnZXRDc3NNYXRyaXhWYWx1ZSA9IChlbGVtZW50OiBKUXVlcnksIHR5cGU6IHN0cmluZyk6IG51bWJlciA9PiB7XHJcbiAgICAgICAgICAgIGxldCB0cmFuc1ggPSAwO1xyXG4gICAgICAgICAgICBsZXQgdHJhbnNZID0gMDtcclxuICAgICAgICAgICAgbGV0IHNjYWxlWCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBzY2FsZVkgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNzc1ByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbWF0cml4ID0gJChlbGVtZW50KS5jc3MoY3NzUHJlZml4ZXNbaV0gKyBcInRyYW5zZm9ybVwiKTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXRyaXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpczNkTWF0cml4ID0gbWF0cml4LmluZGV4T2YoXCIzZFwiKSAhPT0gLTEgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4ID0gbWF0cml4LnJlcGxhY2UoXCJtYXRyaXgzZFwiLCBcIlwiKS5yZXBsYWNlKFwibWF0cml4XCIsIFwiXCIpLnJlcGxhY2UoL1teXFxkLiwtXS9nLCBcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhcnIgPSBtYXRyaXguc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zWCA9IE51bWJlcihhcnJbaXMzZE1hdHJpeCA/IDEyIDogNF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHRyYW5zWSA9IE51bWJlcihhcnJbaXMzZE1hdHJpeCA/IDEzIDogNV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlWCA9IE51bWJlcihhcnJbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlWSA9IE51bWJlcihhcnJbaXMzZE1hdHJpeCA/IDUgOiAzXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwidHJhbnNsYXRlWFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc05hTih0cmFuc1gpID8gMCA6IHRyYW5zWDtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJ0cmFuc2xhdGVZXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlzTmFOKHRyYW5zWSkgPyAwIDogdHJhbnNZO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjYWxlWFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpc05hTihzY2FsZVgpID8gMSA6IHNjYWxlWDtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY2FsZVlcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaXNOYU4oc2NhbGVZKSA/IDEgOiBzY2FsZVk7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogXCJ0cmFuc2l0aW9uZW5kXCIg44Gu44Kk44OZ44Oz44OI5ZCN6YWN5YiX44KS6L+U44GZXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtBcnJheX0gdHJhbnNpdGlvbmVuZCDjgqTjg5njg7Pjg4jlkI1cclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgY29uc3QgdHJhbnNpdGlvbkVuZCA9IFwidHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kIE1TVHJhbnNpdGlvbkVuZFwiO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiB0cmFuc2l0aW9uIOioreWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZWxlbWVudFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBjb25zdCBzZXRUcmFuc2Zvcm1zVHJhbnNpdGlvbnMgPSAoZWxlbWVudDogSlF1ZXJ5LCBwcm9wOiBzdHJpbmcsIG1zZWM6IG51bWJlciwgdGltaW5nRnVuY3Rpb246IHN0cmluZyk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCAkZWxlbWVudCA9ICQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zaXRpb25zID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IHNlY29uZCA9IChtc2VjIC8gMTAwMCkgKyBcInNcIjtcclxuICAgICAgICAgICAgY29uc3QgYW5pbWF0aW9uID0gXCIgXCIgKyBzZWNvbmQgKyBcIiBcIiArIHRpbWluZ0Z1bmN0aW9uO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBcIiwgdHJhbnNmb3JtXCIgKyBhbmltYXRpb247XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNzc1ByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uc1tjc3NQcmVmaXhlc1tpXSArIFwidHJhbnNpdGlvblwiXSA9IHByb3AgKyBhbmltYXRpb24gKyB0cmFuc2Zvcm07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRlbGVtZW50LmNzcyh0cmFuc2l0aW9ucyk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHRyYW5zaXRpb24g6Kit5a6a44Gu5YmK6ZmkXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZXhwb3J0IGNvbnN0IGNsZWFyVHJhbnNpdGlvbnMgPSAoZWxlbWVudDogSlF1ZXJ5KTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0ICRlbGVtZW50ID0gJChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgICRlbGVtZW50Lm9mZih0cmFuc2l0aW9uRW5kKTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNpdGlvbnMgPSB7fTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjc3NQcmVmaXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbnNbY3NzUHJlZml4ZXNbaV0gKyBcInRyYW5zaXRpb25cIl0gPSBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkZWxlbWVudC5jc3ModHJhbnNpdGlvbnMpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIE1hdGguYWJzIOOCiOOCiuOCgumrmOmAn+OBqiBhYnNcclxuICAgICAgICAgKi9cclxuICAgICAgICBleHBvcnQgY29uc3QgYWJzID0gKHg6IG51bWJlcik6IG51bWJlciA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB4ID49IDAgPyB4IDogLXg7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWF0aC5tYXgg44KI44KK44KC6auY6YCf44GqIG1heFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGV4cG9ydCBjb25zdCBtYXggPSAobGhzOiBudW1iZXIsIHJoczogbnVtYmVyKTogbnVtYmVyID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGxocyA+PSByaHMgPyBsaHMgOiByaHM7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuU3RhdHVzTWFuYWdlcl0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgU3RhdHVzTWFuYWdlclxyXG4gICAgICogQGJyaWVmIFVJIOeUqOeKtuaFi+euoeeQhuOCr+ODqeOCuVxyXG4gICAgICogICAgICAgIFN0YXR1c01hbmFnZXIg44Gu44Kk44Oz44K544K/44Oz44K544GU44Go44Gr5Lu75oSP44Gu54q25oWL566h55CG44GM44Gn44GN44KLXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgU3RhdHVzTWFuYWdlciBpbXBsZW1lbnRzIElTdGF0dXNNYW5hZ2VyIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfc3RhdHVzOiBhbnkgPSB7fTsgICAgLy8hPCBzdGF0dXNTY29wZSgpIOOBq+S9v+eUqOOBleOCjOOCi+eKtuaFi+euoeeQhuOCquODluOCuOOCp+OCr+ODiFxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElTdGF0dXNNYW5hZ2VyXHJcblxyXG4gICAgICAgIC8vISDnirbmhYvlpInmlbDjga7lj4Lnhafjgqvjgqbjg7Pjg4jjga7jgqTjg7Pjgq/jg6rjg6Hjg7Pjg4hcclxuICAgICAgICBwdWJsaWMgc3RhdHVzQWRkUmVmKHN0YXR1czogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9zdGF0dXNbc3RhdHVzXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzW3N0YXR1c10gPSAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzW3N0YXR1c10rKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzW3N0YXR1c107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg54q25oWL5aSJ5pWw44Gu5Y+C54Wn44Kr44Km44Oz44OI44Gu44OH44Kv44Oq44Oh44Oz44OIXHJcbiAgICAgICAgcHVibGljIHN0YXR1c1JlbGVhc2Uoc3RhdHVzOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBsZXQgcmV0dmFsOiBudW1iZXI7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fc3RhdHVzW3N0YXR1c10pIHtcclxuICAgICAgICAgICAgICAgIHJldHZhbCA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNbc3RhdHVzXS0tO1xyXG4gICAgICAgICAgICAgICAgcmV0dmFsID0gdGhpcy5fc3RhdHVzW3N0YXR1c107XHJcbiAgICAgICAgICAgICAgICBpZiAoMCA9PT0gcmV0dmFsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3N0YXR1c1tzdGF0dXNdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXR2YWw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5Yem55CG44K544Kz44O844OX5q+O44Gr54q25oWL5aSJ5pWw44KS6Kit5a6aXHJcbiAgICAgICAgcHVibGljIHN0YXR1c1Njb3BlKHN0YXR1czogc3RyaW5nLCBjYWxsYmFjazogKCkgPT4gdm9pZCB8IFByb21pc2U8YW55Pik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXR1c0FkZFJlZihzdGF0dXMpO1xyXG4gICAgICAgICAgICBjb25zdCBwcm9taXNlID0gY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgaWYgKCFwcm9taXNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c1JlbGVhc2Uoc3RhdHVzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHByb21pc2UudGhlbihcclxuICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhdHVzUmVsZWFzZShzdGF0dXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXR1c1JlbGVhc2Uoc3RhdHVzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44Gf54q25oWL5Lit44Gn44GC44KL44GL56K66KqNXHJcbiAgICAgICAgcHVibGljIGlzU3RhdHVzSW4oc3RhdHVzOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5fc3RhdHVzW3N0YXR1c107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBfQ29uZmlnID0gQ0RQLlVJLkxpc3RWaWV3R2xvYmFsQ29uZmlnO1xyXG4gICAgaW1wb3J0IF9Ub29sQ1NTID0gQ0RQLlVJLl9MaXN0Vmlld1V0aWxzO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5MaW5lUHJvZmlsZV0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgTGluZVByb2ZpbGVcclxuICAgICAqIEBicmllZiAxIOODqeOCpOODs+OBq+mWouOBmeOCi+ODl+ODreODleOCoeOCpOODq+OCr+ODqeOCuVxyXG4gICAgICogICAgICAgIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgotcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIExpbmVQcm9maWxlIHtcclxuICAgICAgICBwcml2YXRlIF9pbmRleDogbnVtYmVyID0gbnVsbDsgICAgICAgICAgICAgIC8vITwgZ2xvYmFsIGluZGV4XHJcbiAgICAgICAgcHJpdmF0ZSBfcGFnZUluZGV4OiBudW1iZXIgPSBudWxsOyAgICAgICAgICAvLyE8IOaJgOWxnuOBmeOCiyBwYWdlIGluZGV4XHJcbiAgICAgICAgcHJpdmF0ZSBfb2Zmc2V0OiBudW1iZXIgPSBudWxsOyAgICAgICAgICAgICAvLyE8IGdsb2JhbCBvZmZzZXRcclxuICAgICAgICBwcml2YXRlIF8kYmFzZTogSlF1ZXJ5ID0gbnVsbDsgICAgICAgICAgICAgIC8vITwg5Zyf5Y+w44Go44Gq44KLIERPTSDjgqTjg7Pjgrnjgr/jg7PjgrnjgpLmoLzntI1cclxuICAgICAgICBwcml2YXRlIF9pbnN0YW5jZTogQmFzZUxpc3RJdGVtVmlldyA9IG51bGw7IC8vITwgTGlzdEl0ZW1WaWV3IOOCpOODs+OCueOCv+ODs+OCueOCkuagvOe0jVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIF9vd25lciAgICAgICB7SUxpc3RWaWV3RnJhbWV3b3JrfSBbaW5dIOeuoeeQhuiAheOBp+OBguOCiyBJTGlzdFZpZXdGcmFtZXdvcmsg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICogQHBhcmFtIF9oZWlnaHQgICAgICB7TnVtYmVyfSAgICAgICAgICAgICBbaW5dIOWIneacn+OBrumrmOOBlVxyXG4gICAgICAgICAqIEBwYXJhbSBfaW5pdGlhbGl6ZXIge0Z1bmN0aW9ufSAgICAgICAgICAgW2luXSBMaXN0SXRlbVZpZXcg5rS+55Sf44Kv44Op44K544Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgICAgICogQHBhcmFtIF9pbmZvICAgICAgICB7T2JqZWN0fSAgICAgICAgICAgICBbaW5dIExpc3RJdGVtVmlldyDjgrPjg7Pjgrnjg4jjg6njgq/jgr/jgavmuKHjgZXjgozjgovjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICAgICAgcHJpdmF0ZSBfb3duZXI6IElMaXN0Vmlld0ZyYW1ld29yayxcclxuICAgICAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgICAgIHByaXZhdGUgX2luaXRpYWxpemVyOiBuZXcgKG9wdGlvbnM/OiBhbnkpID0+IEJhc2VMaXN0SXRlbVZpZXcsXHJcbiAgICAgICAgICAgIHByaXZhdGUgX2luZm86IGFueSkge1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEg5pyJ5Yq55YyWXHJcbiAgICAgICAgcHVibGljIGFjdGl2YXRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IG9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kYmFzZSA9IHRoaXMucHJlcGFyZUJhc2VFbGVtZW50KCk7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoe30sIHtcclxuICAgICAgICAgICAgICAgICAgICBlbDogdGhpcy5fJGJhc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgb3duZXI6IHRoaXMuX293bmVyLFxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmVQcm9maWxlOiB0aGlzLFxyXG4gICAgICAgICAgICAgICAgfSwgdGhpcy5faW5mbyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyB0aGlzLl9pbml0aWFsaXplcihvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgIGlmIChcIm5vbmVcIiA9PT0gdGhpcy5fJGJhc2UuY3NzKFwiZGlzcGxheVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyRiYXNlLmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VJbmRleCh0aGlzLl8kYmFzZSk7XHJcbiAgICAgICAgICAgIGlmIChcInZpc2libGVcIiAhPT0gdGhpcy5fJGJhc2UuY3NzKFwidmlzaWJpbGl0eVwiKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGJhc2UuY3NzKFwidmlzaWJpbGl0eVwiLCBcInZpc2libGVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDkuI3lj6/oppbljJZcclxuICAgICAgICBwdWJsaWMgaGlkZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gdGhpcy5faW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoXCJoaWRkZW5cIiAhPT0gdGhpcy5fJGJhc2UuY3NzKFwidmlzaWJpbGl0eVwiKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGJhc2UuY3NzKFwidmlzaWJpbGl0eVwiLCBcImhpZGRlblwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeEoeWKueWMllxyXG4gICAgICAgIHB1YmxpYyBpbmFjdGl2YXRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgLy8geHBlcmlhIEFYIEplbGx5IEJlYW4gKDQuMS4yKeOBq+OBpuOAgSBoaWRkZW4gZWxlbWVudCDjga7liYrpmaTjgafjg6Hjg6Ljg6rjg7zjg6rjg7zjgq/jgZnjgovjgZ/jgoHlj6/oppbljJbjgZnjgovjgIJcclxuICAgICAgICAgICAgICAgIGlmIChcInZpc2libGVcIiAhPT0gdGhpcy5fJGJhc2UuY3NzKFwidmlzaWJpbGl0eVwiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyRiYXNlLmNzcyhcInZpc2liaWxpdHlcIiwgXCJ2aXNpYmxlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kYmFzZS5hZGRDbGFzcyhfQ29uZmlnLlJFQ1lDTEVfQ0xBU1MpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGJhc2UuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kYmFzZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmm7TmlrBcclxuICAgICAgICBwdWJsaWMgcmVmcmVzaCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5faW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2luc3RhbmNlLnJlbmRlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5pyJ5Yq554Sh5Yq55Yik5a6aXHJcbiAgICAgICAgcHVibGljIGlzQWN0aXZlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbCAhPSB0aGlzLl9pbnN0YW5jZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDpq5jjgZXmg4XloLHjga7mm7TmlrAuIExpc3RJdGVtVmlldyDjgYvjgonjgrPjg7zjg6vjgZXjgozjgovjgIJcclxuICAgICAgICBwdWJsaWMgdXBkYXRlSGVpZ2h0KG5ld0hlaWdodDogbnVtYmVyLCBvcHRpb25zPzogVXBkYXRlSGVpZ2h0T3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zdCBkZWx0YSA9IG5ld0hlaWdodCAtIHRoaXMuX2hlaWdodDtcclxuICAgICAgICAgICAgdGhpcy5faGVpZ2h0ID0gbmV3SGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLl9vd25lci51cGRhdGVTY3JvbGxNYXBIZWlnaHQoZGVsdGEpO1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSBvcHRpb25zICYmIG9wdGlvbnMucmVmbGVjdEFsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3duZXIudXBkYXRlUHJvZmlsZXModGhpcy5faW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgei1pbmRleCDjga7jg6rjgrvjg4Pjg4guIFNjcm9sbE1hbmFnZXIucmVtb3ZlSXRlbSgpIOOBi+OCieOCs+ODvOODq+OBleOCjOOCi+OAglxyXG4gICAgICAgIHB1YmxpYyByZXNldERlcHRoKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl9pbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGJhc2UuY3NzKFwiei1pbmRleFwiLCB0aGlzLl9vd25lci5nZXRMaXN0Vmlld09wdGlvbnMoKS5iYXNlRGVwdGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIGdldHRlci9zZXR0ZXIgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEgZ2V0dGVyOiDjg6njgqTjg7Pjga7pq5jjgZVcclxuICAgICAgICBwdWJsaWMgZ2V0IGhlaWdodCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGdldHRlcjogZ2xvYmFsIGluZGV4XHJcbiAgICAgICAgcHVibGljIGdldCBpbmRleCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faW5kZXg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgc2V0dGVyOiBnbG9iYWwgaW5kZXhcclxuICAgICAgICBwdWJsaWMgc2V0IGluZGV4KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5faW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fJGJhc2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSW5kZXgodGhpcy5fJGJhc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgZ2V0dGVyOiDmiYDlsZ7jg5rjg7zjgrggaW5kZXhcclxuICAgICAgICBwdWJsaWMgZ2V0IHBhZ2VJbmRleCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFnZUluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHNldHRlcjog5omA5bGe44Oa44O844K4IGluZGV4XHJcbiAgICAgICAgcHVibGljIHNldCBwYWdlSW5kZXgoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9wYWdlSW5kZXggPSBpbmRleDtcclxuICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fJGJhc2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnZUluZGV4KHRoaXMuXyRiYXNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGdldHRlcjogbGluZSBvZmZzZXRcclxuICAgICAgICBwdWJsaWMgZ2V0IG9mZnNldCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHNldHRlcjogbGluZSBvZmZzZXRcclxuICAgICAgICBwdWJsaWMgc2V0IG9mZnNldChvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9vZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuXyRiYXNlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZU9mZnNldCh0aGlzLl8kYmFzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBnZXR0ZXI6IGluZm9cclxuICAgICAgICBwdWJsaWMgZ2V0IGluZm8oKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luZm87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kc1xyXG5cclxuICAgICAgICAvLyEgQmFzZSBqUXVlcnkg44Kq44OW44K444Kn44Kv44OI44Gu55Sf5oiQXHJcbiAgICAgICAgcHJpdmF0ZSBwcmVwYXJlQmFzZUVsZW1lbnQoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgbGV0ICRiYXNlOiBKUXVlcnk7XHJcbiAgICAgICAgICAgIGNvbnN0ICRtYXAgPSB0aGlzLl9vd25lci5nZXRTY3JvbGxNYXBFbGVtZW50KCk7XHJcbiAgICAgICAgICAgIGNvbnN0ICRyZWN5Y2xlID0gdGhpcy5fb3duZXIuZmluZFJlY3ljbGVFbGVtZW50cygpLmZpcnN0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGl0ZW1UYWdOYW1lID0gdGhpcy5fb3duZXIuZ2V0TGlzdFZpZXdPcHRpb25zKCkuaXRlbVRhZ05hbWU7XHJcblxyXG4gICAgICAgICAgICBpZiAobnVsbCAhPSB0aGlzLl8kYmFzZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidGhpcy5fJGJhc2UgaXMgbm90IG51bGwuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRiYXNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoMCA8ICRyZWN5Y2xlLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgJGJhc2UgPSAkcmVjeWNsZTtcclxuICAgICAgICAgICAgICAgICRiYXNlLnJlbW92ZUF0dHIoXCJ6LWluZGV4XCIpO1xyXG4gICAgICAgICAgICAgICAgJGJhc2UucmVtb3ZlQ2xhc3MoX0NvbmZpZy5SRUNZQ0xFX0NMQVNTKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRiYXNlID0gJChcIjxcIiArIGl0ZW1UYWdOYW1lICsgXCIgY2xhc3M9J1wiICsgX0NvbmZpZy5MSVNUSVRFTV9CQVNFX0NMQVNTICsgXCInPjwvXCIgKyBpdGVtVGFnTmFtZSArIFwiPlwiKTtcclxuICAgICAgICAgICAgICAgICRiYXNlLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xyXG4gICAgICAgICAgICAgICAgJG1hcC5hcHBlbmQoJGJhc2UpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDpq5jjgZXjga7mm7TmlrBcclxuICAgICAgICAgICAgaWYgKCRiYXNlLmhlaWdodCgpICE9PSB0aGlzLl9oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICRiYXNlLmhlaWdodCh0aGlzLl9oZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBpbmRleCDjga7oqK3lrppcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVJbmRleCgkYmFzZSk7XHJcbiAgICAgICAgICAgIC8vIG9mZnNldCDjga7mm7TmlrBcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVPZmZzZXQoJGJhc2UpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuICRiYXNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGdsb2JhbCBpbmRleCDjga7mm7TmlrBcclxuICAgICAgICBwcml2YXRlIHVwZGF0ZUluZGV4KCRiYXNlOiBKUXVlcnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCRiYXNlLmF0dHIoX0NvbmZpZy5EQVRBX0NPTlRBSU5FUl9JTkRFWCkgIT09IHRoaXMuX2luZGV4LnRvU3RyaW5nKCkpIHtcclxuICAgICAgICAgICAgICAgICRiYXNlLmF0dHIoX0NvbmZpZy5EQVRBX0NPTlRBSU5FUl9JTkRFWCwgdGhpcy5faW5kZXgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBwYWdlIGluZGV4IOOBruabtOaWsFxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlUGFnZUluZGV4KCRiYXNlOiBKUXVlcnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCRiYXNlLmF0dHIoX0NvbmZpZy5EQVRBX1BBR0VfSU5ERVgpICE9PSB0aGlzLl9wYWdlSW5kZXgudG9TdHJpbmcoKSkge1xyXG4gICAgICAgICAgICAgICAgJGJhc2UuYXR0cihfQ29uZmlnLkRBVEFfUEFHRV9JTkRFWCwgdGhpcy5fcGFnZUluZGV4LnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgb2Zmc2V0IOOBruabtOaWsFxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlT2Zmc2V0KCRiYXNlOiBKUXVlcnkpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0ge307XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9vd25lci5nZXRMaXN0Vmlld09wdGlvbnMoKS5lbmFibGVUcmFuc2Zvcm1PZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChfVG9vbENTUy5nZXRDc3NNYXRyaXhWYWx1ZSgkYmFzZSwgXCJ0cmFuc2xhdGVZXCIpICE9PSB0aGlzLl9vZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF9Ub29sQ1NTLmNzc1ByZWZpeGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zZm9ybVtfVG9vbENTUy5jc3NQcmVmaXhlc1tpXSArIFwidHJhbnNmb3JtXCJdID0gXCJ0cmFuc2xhdGUzZCgwcHgsXCIgKyB0aGlzLl9vZmZzZXQgKyBcInB4LDBweClcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgJGJhc2UuY3NzKHRyYW5zZm9ybSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFyc2VJbnQoJGJhc2UuY3NzKFwidG9wXCIpLCAxMCkgIT09IHRoaXMuX29mZnNldCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRiYXNlLmNzcyhcInRvcFwiLCB0aGlzLl9vZmZzZXQgKyBcInB4XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5QYWdlUHJvZmlsZV0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgUGFnZVByb2ZpbGVcclxuICAgICAqIEBicmllZiAxIOODmuODvOOCuOOBq+mWouOBmeOCi+ODl+ODreODleOCoeOCpOODq+OCr+ODqeOCuVxyXG4gICAgICogICAgICAgIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgotcclxuICAgICAqICAgICAgICDmnKzjgq/jg6njgrnjgafjga/nm7TmjqUgRE9NIOOCkuaTjeS9nOOBl+OBpuOBr+OBhOOBkeOBquOBhFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUGFnZVByb2ZpbGUge1xyXG4gICAgICAgIHByaXZhdGUgX2luZGV4OiBudW1iZXIgPSAwOyAgICAgICAgICAgICAvLyE8IHBhZ2UgaW5kZXhcclxuICAgICAgICBwcml2YXRlIF9vZmZzZXQ6IG51bWJlciA9IDA7ICAgICAgICAgICAgLy8hPCBwYWdlIOOBriBUb3Ag44GL44KJ44Gu44Kq44OV44K744OD44OIXHJcbiAgICAgICAgcHJpdmF0ZSBfaGVpZ2h0OiBudW1iZXIgPSAwOyAgICAgICAgICAgIC8vITwgcGFnZSDjga7pq5jjgZVcclxuICAgICAgICBwcml2YXRlIF9saW5lczogTGluZVByb2ZpbGVbXSA9IFtdOyAgICAgLy8hPCBwYWdlIOWGheOBp+euoeeQhuOBleOCjOOCiyBMaW5lUHJvZmlsZVxyXG4gICAgICAgIHByaXZhdGUgX3N0YXR1czogc3RyaW5nID0gXCJpbmFjdGl2ZVwiOyAgIC8vITwgcGFnZSDjga7nirbmhYsgWyBpbmFjdGl2ZSB8IGhpZGRlbiB8IGFjdGl2ZSBdXHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8hIOacieWKueWMllxyXG4gICAgICAgIHB1YmxpYyBhY3RpdmF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKFwiYWN0aXZlXCIgIT09IHRoaXMuX3N0YXR1cykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZXMuZm9yRWFjaCgobGluZTogTGluZVByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lLmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9zdGF0dXMgPSBcImFjdGl2ZVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeEoeWPr+imluWMllxyXG4gICAgICAgIHB1YmxpYyBoaWRlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoXCJoaWRkZW5cIiAhPT0gdGhpcy5fc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saW5lcy5mb3JFYWNoKChsaW5lOiBMaW5lUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmUuaGlkZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzID0gXCJoaWRkZW5cIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnhKHlirnljJZcclxuICAgICAgICBwdWJsaWMgaW5hY3RpdmF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKFwiaW5hY3RpdmVcIiAhPT0gdGhpcy5fc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saW5lcy5mb3JFYWNoKChsaW5lOiBMaW5lUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmUuaW5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzID0gXCJpbmFjdGl2ZVwiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIExpbmVQcm9maWxlIOOCkuioreWumlxyXG4gICAgICAgIHB1YmxpYyBwdXNoKGxpbmU6IExpbmVQcm9maWxlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpbmVzLnB1c2gobGluZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodCArPSBsaW5lLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDphY3kuIvjga4gTGluZVByb2ZpbGUg44GZ44G544Gm44GM5pyJ5Yq544Gn44Gq44GE5aC05ZCI44CBUGFnZSDjgrnjg4bjg7zjgr/jgrnjgpLnhKHlirnjgavjgZnjgotcclxuICAgICAgICBwdWJsaWMgbm9ybWFsaXplKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zdCBlbmFibGVBbGwgPSBfLmV2ZXJ5KHRoaXMuX2xpbmVzLCAobGluZTogTGluZVByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsaW5lLmlzQWN0aXZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoIWVuYWJsZUFsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzID0gXCJpbmFjdGl2ZVwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgTGluZVByb2ZpbGUg44KS5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIGdldExpbmVQcm9maWxlKGluZGV4OiBudW1iZXIpOiBMaW5lUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIGlmICgwIDw9IGluZGV4ICYmIGluZGV4IDwgdGhpcy5fbGluZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbGluZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmnIDliJ3jga4gTGluZVByb2ZpbGUg44KS5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIGdldExpbmVQcm9maWxlRmlyc3QoKTogTGluZVByb2ZpbGUge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRMaW5lUHJvZmlsZSgwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmnIDlvozjga4gTGluZVByb2ZpbGUg44KS5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIGdldExpbmVQcm9maWxlTGFzdCgpOiBMaW5lUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldExpbmVQcm9maWxlKHRoaXMuX2xpbmVzLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBnZXR0ZXIvc2V0dGVyIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLy8hIGdldHRlcjogcGFnZSBpbmRleFxyXG4gICAgICAgIHB1YmxpYyBnZXQgaW5kZXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2luZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHNldHRlcjogcGFnZSBpbmRleFxyXG4gICAgICAgIHB1YmxpYyBzZXQgaW5kZXgoaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9pbmRleCA9IGluZGV4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGdldHRlcjogcGFnZSBvZmZzZXRcclxuICAgICAgICBwdWJsaWMgZ2V0IG9mZnNldCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb2Zmc2V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHNldHRlcjogcGFnZSBvZmZzZXRcclxuICAgICAgICBwdWJsaWMgc2V0IG9mZnNldChvZmZzZXQ6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9vZmZzZXQgPSBvZmZzZXQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgZ2V0dGVyOiDlrp/pmpvjgavjg5rjg7zjgrjjgavlibLjgorlvZPjgabjgonjgozjgabjgYTjgovpq5jjgZVcclxuICAgICAgICBwdWJsaWMgZ2V0IGhlaWdodCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGdldHRlcjog54q25oWL5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIGdldCBzdGF0dXMoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXR1cztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkdyb3VwUHJvZmlsZV0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgR3JvdXBQcm9maWxlXHJcbiAgICAgKiBAYnJpZWYg44Op44Kk44Oz44KS44Kw44Or44O844OX566h55CG44GZ44KL44OX44Ot44OV44Kh44Kk44Or44Kv44Op44K5XHJcbiAgICAgKiAgICAgICAg5pys44Kv44Op44K544Gn44Gv55u05o6lIERPTSDjgpLmk43kvZzjgZfjgabjga/jgYTjgZHjgarjgYRcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBfcGFyZW50OiBHcm91cFByb2ZpbGUgPSBudWxsOyAgICAgICAvLyE8IOimqiBHcm91cFByb2ZpbGUg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgcHJpdmF0ZSBfY2hpbGRyZW46IEdyb3VwUHJvZmlsZVtdID0gW107ICAgICAvLyE8IOWtkCBHcm91cFByb2ZpbGUg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgcHJpdmF0ZSBfZXhwYW5kZWQ6IGJvb2xlYW4gPSBmYWxzZTsgICAgICAgICAvLyE8IOmWi+mWieaDheWgsVxyXG4gICAgICAgIHByaXZhdGUgX3N0YXR1czogc3RyaW5nID0gXCJ1bnJlZ2lzdGVyZWRcIjsgICAvLyE8IF9vd25lciDjgbjjga7nmbvpjLLnirbmhYsgWyB1bnJlZ2lzdGVyZWQgfCByZWdpc3RlcmVkIF1cclxuICAgICAgICBwcml2YXRlIF9tYXBMaW5lcyA9IHt9OyAgICAgICAgICAgICAgICAgICAgIC8vITwg6Ieq6Lqr44GM566h6L2E44GZ44KLIExpbmVQcm9maWxlIOOCkiBrZXkg44Go44Go44KC44Gr5qC857SNXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgTEFZT1VUX0tFWV9ERUZBVUxUID0gXCItbGF5b3V0LWRlZmF1bHRcIjtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY29uc3RydWN0b3JcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBfaWQgICAge1N0cmluZ30gICAgICAgICAgICAgW2luXSBHcm91cFByb2ZpbGUg44GuIElEXHJcbiAgICAgICAgICogQHBhcmFtIF9vd25lciB7RXhwYW5kYWJsZUxpc3RWaWV3fSBbaW5dIOeuoeeQhuiAheOBp+OBguOCiyBFeHBhbmRhYmxlTGlzdFZpZXcg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3IocHJpdmF0ZSBfaWQ6IHN0cmluZywgcHJpdmF0ZSBfb3duZXI6IEJhc2VFeHBhbmRhYmxlTGlzdFZpZXcpIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIG1ldGhvZFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmnKwgR3JvdXBQcm9maWxlIOOBjOeuoeeQhuOBmeOCiyBMaXN0IOOCkuS9nOaIkOOBl+OBpueZu+mMslxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGhlaWdodCAgICAgIHtOdW1iZXJ9ICAgW2luXSDjg6njgqTjg7Pjga7pq5jjgZVcclxuICAgICAgICAgKiBAcGFyYW0gaW5pdGlhbGl6ZXIge0Z1bmN0aW9ufSBbaW5dIExpc3RJdGVtVmlldyDmtL7nlJ/jgq/jg6njgrnjga7jgrPjg7Pjgrnjg4jjg6njgq/jgr9cclxuICAgICAgICAgKiBAcGFyYW0gaW5mbyAgICAgICAge09iamVjdH0gICBbaW5dIGluaXRpYWxpemVyIOOBq+a4oeOBleOCjOOCi+OCquODl+OCt+ODp+ODs+W8leaVsFxyXG4gICAgICAgICAqIEBwYXJhbSBsYXlvdXRLZXkgICB7U3RyaW5nfSAgIFtpbl0gbGF5b3V0IOavjuOBq+S9v+eUqOOBmeOCi+itmOWIpeWtkCAo44Kq44OX44K344On44OK44OrKVxyXG4gICAgICAgICAqIEByZXR1cm4ge0dyb3VwUHJvZmlsZX0g5pys44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGFkZEl0ZW0oXHJcbiAgICAgICAgICAgIGhlaWdodDogbnVtYmVyLFxyXG4gICAgICAgICAgICBpbml0aWFsaXplcjogbmV3IChvcHRpb25zPzogYW55KSA9PiBCYXNlTGlzdEl0ZW1WaWV3LFxyXG4gICAgICAgICAgICBpbmZvOiBhbnksXHJcbiAgICAgICAgICAgIGxheW91dEtleT86IHN0cmluZ1xyXG4gICAgICAgICk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIGxldCBsaW5lOiBMaW5lUHJvZmlsZTtcclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCB7IGdyb3VwUHJvZmlsZTogdGhpcyB9LCBpbmZvKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChudWxsID09IGxheW91dEtleSkge1xyXG4gICAgICAgICAgICAgICAgbGF5b3V0S2V5ID0gR3JvdXBQcm9maWxlLkxBWU9VVF9LRVlfREVGQVVMVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSB0aGlzLl9tYXBMaW5lc1tsYXlvdXRLZXldKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBMaW5lc1tsYXlvdXRLZXldID0gW107XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxpbmUgPSBuZXcgTGluZVByb2ZpbGUodGhpcy5fb3duZXIuY29yZSwgTWF0aC5mbG9vcihoZWlnaHQpLCBpbml0aWFsaXplciwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAvLyBfb3duZXIg44Gu566h55CG5LiL44Gr44GC44KL44Go44GN44Gv6YCf44KE44GL44Gr6L+95YqgXHJcbiAgICAgICAgICAgIGlmICgoXCJyZWdpc3RlcmVkXCIgPT09IHRoaXMuX3N0YXR1cykgJiZcclxuICAgICAgICAgICAgICAgIChudWxsID09IHRoaXMuX293bmVyLmxheW91dEtleSB8fCBsYXlvdXRLZXkgPT09IHRoaXMuX293bmVyLmxheW91dEtleSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLl9hZGRMaW5lKGxpbmUsIHRoaXMuZ2V0TGFzdExpbmVJbmRleCgpICsgMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vd25lci51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9tYXBMaW5lc1tsYXlvdXRLZXldLnB1c2gobGluZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5a2QIEdyb3VwIOOCkui/veWKoFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHRhcmdldCB7R3JvdXBQcm9maWxlfEdyb3VwUHJvZmlsZVtdfSBbaW5dIEdyb3VwUHJvZmlsZSDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKiBAcmV0dXJuIHtHcm91cFByb2ZpbGV9IOacrOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBhZGRDaGlsZHJlbih0YXJnZXQ6IEdyb3VwUHJvZmlsZSk6IEdyb3VwUHJvZmlsZTtcclxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGRyZW4odGFyZ2V0OiBHcm91cFByb2ZpbGVbXSk6IEdyb3VwUHJvZmlsZTtcclxuICAgICAgICBwdWJsaWMgYWRkQ2hpbGRyZW4odGFyZ2V0OiBhbnkpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZHJlbjogR3JvdXBQcm9maWxlW10gPSAodGFyZ2V0IGluc3RhbmNlb2YgQXJyYXkpID8gdGFyZ2V0IDogW3RhcmdldF07XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLmZvckVhY2goKGNoaWxkKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGlsZC5zZXRQYXJlbnQodGhpcyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IHRoaXMuX2NoaWxkcmVuLmNvbmNhdChjaGlsZHJlbik7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6KaqIEdyb3VwUHJvZmlsZSDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0dyb3VwUHJvZmlsZX0gR3JvdXBQcm9maWxlIOimqiDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgZ2V0UGFyZW50KCk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlrZAgR3JvdXBQcm9maWxlIOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7R3JvdXBQcm9maWxlW119IEdyb3VwUHJvZmlsZSDlrZAg44Kk44Oz44K544K/44Oz44K56YWN5YiXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGdldENoaWxkcmVuKCk6IEdyb3VwUHJvZmlsZVtdIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5a2QIEdyb3VwIOOCkuaMgeOBo+OBpuOBhOOCi+OBi+WIpOWumlxyXG4gICAgICAgICAqIGxheW91dEtleSDjgYzmjIflrprjgZXjgozjgozjgbDjgIFsYXlvdXQg44Gu54q25oWL44G+44Gn5Yik5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gbGF5b3V0S2V5IHtTdHJpbmd9IFtpbl0gbGF5b3V0IOavjuOBq+S9v+eUqOOBmeOCi+itmOWIpeWtkCAo44Kq44OX44K344On44OK44OrKVxyXG4gICAgICAgICAqIEByZXR1cm4ge0Jvb2xlYW59IHRydWU6IOaciSwgZmFsc2U6IOeEoVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBoYXNDaGlsZHJlbihsYXlvdXRLZXk/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NoaWxkcmVuLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobnVsbCAhPSBsYXlvdXRLZXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlblswXS5oYXNMYXlvdXRLZXlPZihsYXlvdXRLZXkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGxheW91dCDjga7nirbmhYvjgpLliKTlrppcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBsYXlvdXRLZXkge1N0cmluZ30gW2luXSBsYXlvdXQg5q+O44Gr5L2/55So44GZ44KL6K2Y5Yil5a2QXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5pyJLCBmYWxzZTog54ShXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHVibGljIGhhc0xheW91dEtleU9mKGxheW91dEtleTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IGxheW91dEtleSkge1xyXG4gICAgICAgICAgICAgICAgbGF5b3V0S2V5ID0gR3JvdXBQcm9maWxlLkxBWU9VVF9LRVlfREVGQVVMVDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gKG51bGwgIT0gdGhpcy5fbWFwTGluZXNbbGF5b3V0S2V5XSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrDjg6vjg7zjg5flsZXplotcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgZXhwYW5kKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgbGluZXM6IExpbmVQcm9maWxlW10gPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2xpbmVzLmxlbmd0aCA8IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInRoaXMgZ3JvdXAgaGFzIG5vIGxpbmVzLlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5oYXNDaGlsZHJlbigpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ0aGlzIGdyb3VwIGhhcyBubyBjaGlsZHJlbi5cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRoaXMuaXNFeHBhbmRlZCgpKSB7XHJcbiAgICAgICAgICAgICAgICBsaW5lcyA9IHRoaXMucXVlcnlPcGVyYXRpb25UYXJnZXQoXCJyZWdpc3RlcmVkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZXhwYW5kZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKDAgPCBsaW5lcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9vd25lci5zdGF0dXNTY29wZShcImV4cGFuZGluZ1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiHqui6q+OCkuabtOaWsFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW5lcy5mb3JFYWNoKChsaW5lOiBMaW5lUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDphY3kuIvjgpLmm7TmlrBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3duZXIuX2FkZExpbmUobGluZXMsIHRoaXMuZ2V0TGFzdExpbmVJbmRleCgpICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrDjg6vjg7zjg5flj47mnZ9cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkZWxheSB7TnVtYmVyfSBbaW5dIOimgee0oOWJiumZpOOBq+iyu+OChOOBmemBheW7tuaZgumWky4g5pei5a6aOiBhbmltYXRpb25EdXJhdGlvbiDlgKRcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgY29sbGFwc2UoZGVsYXk/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGxpbmVzOiBMaW5lUHJvZmlsZVtdID0gW107XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5oYXNDaGlsZHJlbigpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ0aGlzIGdyb3VwIGhhcyBubyBjaGlsZHJlbi5cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0V4cGFuZGVkKCkpIHtcclxuICAgICAgICAgICAgICAgIGxpbmVzID0gdGhpcy5xdWVyeU9wZXJhdGlvblRhcmdldChcInVucmVnaXN0ZXJlZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2V4cGFuZGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBpZiAoMCA8IGxpbmVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGF5ID0gKG51bGwgIT0gZGVsYXkpID8gZGVsYXkgOiB0aGlzLl9vd25lci5jb3JlLmdldExpc3RWaWV3T3B0aW9ucygpLmFuaW1hdGlvbkR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLnN0YXR1c1Njb3BlKFwiY29sbGFwc2luZ1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOiHqui6q+OCkuabtOaWsFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW5lcy5mb3JFYWNoKChsaW5lOiBMaW5lUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZS5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDphY3kuIvjgpLmm7TmlrBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fb3duZXIucmVtb3ZlSXRlbShsaW5lc1swXS5pbmRleCwgbGluZXMubGVuZ3RoLCBkZWxheSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDoh6rouqvjgpLjg6rjgrnjg4jjga7lj6/oppbpoJjln5/jgavooajnpLpcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtFbnN1cmVWaXNpYmxlT3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBlbnN1cmVWaXNpYmxlKG9wdGlvbnM/OiBFbnN1cmVWaXNpYmxlT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoMCA8IHRoaXMuX2xpbmVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb3duZXIuZW5zdXJlVmlzaWJsZSh0aGlzLl9saW5lc1swXS5pbmRleCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobnVsbCAhPSBvcHRpb25zLmNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOmWi+mWieOBruODiOOCsOODq1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRlbGF5IHtOdW1iZXJ9IFtpbl0gY29sbGFwc2Ug44Gu6KaB57Sg5YmK6Zmk44Gr6LK744KE44GZ6YGF5bu25pmC6ZaTLiDml6Llrpo6IGFuaW1hdGlvbkR1cmF0aW9uIOWApFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyB0b2dnbGUoZGVsYXk/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2V4cGFuZGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbGxhcHNlKGRlbGF5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXhwYW5kKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWxlemWi+eKtuaFi+OCkuWIpOWumlxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5bGV6ZaLLCBmYWxzZTrlj47mnZ9cclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgaXNFeHBhbmRlZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZGVkO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogbGlzdCB2aWV3IOOBuOeZu+mMslxyXG4gICAgICAgICAqIFRvcCBHcm91cCDjga7jgb/nmbvpjLLlj6/og71cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBpbnNlcnRUbyB7TnVtYmVyfSDmjL/lhaXkvY3nva7jgpIgaW5kZXgg44Gn5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiB7R3JvdXBQcm9maWxlfSDmnKzjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgcmVnaXN0ZXIoaW5zZXJ0VG86IG51bWJlcik6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9wYXJlbnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJsb2dpYyBlcnJvcjogJ3JlZ2lzdGVyJyBtZXRob2QgaXMgYWNjZXB0YWJsZSBvbmx5IHRvcCBncm91cC5cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9vd25lci5fYWRkTGluZSh0aGlzLnByZXByb2Nlc3MoXCJyZWdpc3RlcmVkXCIpLCBpbnNlcnRUbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBsaXN0IHZpZXcg44G45b6p5YWDXHJcbiAgICAgICAgICogVG9wIEdyb3VwIOOBruOBv+eZu+mMsuWPr+iDvVxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7R3JvdXBQcm9maWxlfSDmnKzjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgcmVzdG9yZSgpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICBsZXQgbGluZXM6IExpbmVQcm9maWxlW10gPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImxvZ2ljIGVycm9yOiAncmVzdG9yZScgbWV0aG9kIGlzIGFjY2VwdGFibGUgb25seSB0b3AgZ3JvdXAuXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2xpbmVzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZXhwYW5kZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IHRoaXMuX2xpbmVzLmNvbmNhdCh0aGlzLnF1ZXJ5T3BlcmF0aW9uVGFyZ2V0KFwiYWN0aXZlXCIpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZXMgPSB0aGlzLl9saW5lcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLl9hZGRMaW5lKGxpbmVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOmFjeS4i+OBruacgOW+jOOBriBsaW5lIGluZGV4IOOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHdpdGhBY3RpdmVDaGlsZHJlbiB7Qm9vbGVhbn0gW2luXSDnmbvpjLLmuIjjgb/jga7lrZAgR3JvdXBQcm9maWxlIOOCkuWQq+OCgeOBpuaknOe0ouOBmeOCi+WgtOWQiOOBryB0cnVlIOOCkuaMh+WumlxyXG4gICAgICAgICAqIEByZXR1cm4ge051bWJlcn0gaW5kZXguIOOCqOODqeODvOOBruWgtOWQiOOBryBudWxsLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyBnZXRMYXN0TGluZUluZGV4KHdpdGhBY3RpdmVDaGlsZHJlbjogYm9vbGVhbiA9IGZhbHNlKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgY29uc3QgbGluZXM6IExpbmVQcm9maWxlW10gPSAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IF9saW5lczogTGluZVByb2ZpbGVbXTtcclxuICAgICAgICAgICAgICAgIGlmICh3aXRoQWN0aXZlQ2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBfbGluZXMgPSB0aGlzLnF1ZXJ5T3BlcmF0aW9uVGFyZ2V0KFwiYWN0aXZlXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgPT0gbGluZXMgfHwgbGluZXMubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBfbGluZXMgPSB0aGlzLl9saW5lcztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBfbGluZXM7XHJcbiAgICAgICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAobGluZXMubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJsb2dpYyBlcnJvcjogdGhpcyBncm91cCBpcyBzdGlsIG5vdCByZWdpc3RlcmVkLlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdLmluZGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJRCDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge1N0cmluZ30g5Ymy44KK5oyv44KJ44KM44GfIElEXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0IGlkKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pZDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCueODhuODvOOCv+OCueOCkuWPluW+l1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHJldHVybiB7U3RyaW5nfSDjgrnjg4bjg7zjgr/jgrnmloflrZfliJdcclxuICAgICAgICAgKi9cclxuICAgICAgICBnZXQgc3RhdHVzKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgbWV0aG9kXHJcblxyXG4gICAgICAgIC8qIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC12YXJpYWJsZSAqL1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDopqogR3JvdXAg5oyH5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gcGFyZW50IHtHcm91cFByb2ZpbGV9IFtpbl0g6KaqIEdyb3VwUHJvZmlsZSDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIHNldFBhcmVudChwYXJlbnQ6IEdyb3VwUHJvZmlsZSk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiB0c2xpbnQ6ZW5hYmxlOm5vLXVudXNlZC12YXJpYWJsZSAqL1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiByZWdpc3RlciAvIHVucmVnaXN0ZXIg44Gu5YmN5Yem55CGXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gbmV3U3RhdHVzIHtTdHJpbmd9IFtpbl0g5paw44K544OG44O844K/44K55paH5a2X5YiXXHJcbiAgICAgICAgICogQHJldHVybiB7TGluZVByb2ZpbGVbXX0g5pu05paw44GZ44G544GNIExpbmVQcm9maWxlIOOBrumFjeWIl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgcHJlcHJvY2VzcyhuZXdTdGF0dXM6IHN0cmluZyk6IExpbmVQcm9maWxlW10ge1xyXG4gICAgICAgICAgICBsZXQgbGluZXM6IExpbmVQcm9maWxlW10gPSBbXTtcclxuICAgICAgICAgICAgaWYgKG5ld1N0YXR1cyAhPT0gdGhpcy5fc3RhdHVzICYmIG51bGwgIT0gdGhpcy5fbGluZXMpIHtcclxuICAgICAgICAgICAgICAgIGxpbmVzID0gdGhpcy5fbGluZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzID0gbmV3U3RhdHVzO1xyXG4gICAgICAgICAgICByZXR1cm4gbGluZXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmk43kvZzlr77osaHjga4gTGluZVByb2ZpbGUg6YWN5YiX44KS5Y+W5b6XXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gbmV3U3RhdHVzIHtTdHJpbmd9IFtpbl0g5paw44K544OG44O844K/44K55paH5a2X5YiXXHJcbiAgICAgICAgICogQHJldHVybiB7TGluZVByb2ZpbGVbXX0g5pON5L2c5a++6LGh44GuIExpbmVQcm9maWxlIOOBrumFjeWIl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgcXVlcnlPcGVyYXRpb25UYXJnZXQob3BlcmF0aW9uOiBzdHJpbmcpOiBMaW5lUHJvZmlsZVtdIHtcclxuICAgICAgICAgICAgY29uc3QgZmluZFRhcmdldHMgPSAoZ3JvdXA6IEdyb3VwUHJvZmlsZSk6IExpbmVQcm9maWxlW10gPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpbmVzOiBMaW5lUHJvZmlsZVtdID0gW107XHJcbiAgICAgICAgICAgICAgICBncm91cC5fY2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQ6IEdyb3VwUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAob3BlcmF0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJyZWdpc3RlcmVkXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IGxpbmVzLmNvbmNhdChjaGlsZC5wcmVwcm9jZXNzKG9wZXJhdGlvbikpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ1bnJlZ2lzdGVyZWRcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVzID0gbGluZXMuY29uY2F0KGNoaWxkLnByZXByb2Nlc3Mob3BlcmF0aW9uKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImFjdGl2ZVwiOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gY2hpbGQuX2xpbmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGluZXMgPSBsaW5lcy5jb25jYXQoY2hpbGQuX2xpbmVzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5rbm93biBvcGVyYXRpb246IFwiICsgb3BlcmF0aW9uKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkLmlzRXhwYW5kZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lcyA9IGxpbmVzLmNvbmNhdChmaW5kVGFyZ2V0cyhjaGlsZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbmVzO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gZmluZFRhcmdldHModGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDoh6rouqvjga7nrqHnkIbjgZnjgovjgqLjgq/jg4bjgqPjg5bjgaogTGluZVByb2ZpZSDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0xpbmVQcm9maWxlW119IExpbmVQcm9maWUg6YWN5YiXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBnZXQgX2xpbmVzKCk6IExpbmVQcm9maWxlW10ge1xyXG4gICAgICAgICAgICBjb25zdCBrZXkgPSB0aGlzLl9vd25lci5sYXlvdXRLZXk7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IGtleSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcExpbmVzW2tleV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fbWFwTGluZXNbR3JvdXBQcm9maWxlLkxBWU9VVF9LRVlfREVGQVVMVF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgaW1wb3J0IF9VdGlscyA9IENEUC5VSS5fTGlzdFZpZXdVdGlscztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuU2Nyb2xsZXJFbGVtZW50XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBTY3JvbGxlckVsZW1lbnRcclxuICAgICAqIEBicmllZiBIVE1MRWxlbWVudCDjga4gU2Nyb2xsZXIg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBTY3JvbGxlckVsZW1lbnQgaW1wbGVtZW50cyBJU2Nyb2xsZXIge1xyXG4gICAgICAgIHByaXZhdGUgXyR0YXJnZXQ6IEpRdWVyeSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfJHNjcm9sbE1hcDogSlF1ZXJ5ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF9saXN0dmlld09wdGlvbnM6IExpc3RWaWV3T3B0aW9ucyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vISBjb25zdHJ1Y3RvclxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQ6IHN0cmluZywgb3B0aW9uczogTGlzdFZpZXdPcHRpb25zKTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBIVE1MRWxlbWVudCwgb3B0aW9uczogTGlzdFZpZXdPcHRpb25zKTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBhbnksIG9wdGlvbnM6IExpc3RWaWV3T3B0aW9ucykge1xyXG4gICAgICAgICAgICB0aGlzLl8kdGFyZ2V0ID0gJChlbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdHZpZXdPcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGxlciDjga7lnovjgpLlj5blvpdcclxuICAgICAgICBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBTY3JvbGxlckVsZW1lbnQuVFlQRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBwb3NpdGlvbiDlj5blvpdcclxuICAgICAgICBnZXRQb3MoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyR0YXJnZXQuc2Nyb2xsVG9wKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgcG9zaXRpb24g44Gu5pyA5aSn5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0UG9zTWF4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHRoaXMuXyRzY3JvbGxNYXApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRzY3JvbGxNYXAgPSB0aGlzLl8kdGFyZ2V0LmNoaWxkcmVuKCkuZmlyc3QoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gX1V0aWxzLm1heCh0aGlzLl8kc2Nyb2xsTWFwLmhlaWdodCgpIC0gdGhpcy5fJHRhcmdldC5oZWlnaHQoKSwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Kk44OZ44Oz44OI55m76YyyXHJcbiAgICAgICAgb24odHlwZTogc3RyaW5nLCBmdW5jOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kdGFyZ2V0Lm9uKFwic2Nyb2xsXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjcm9sbHN0b3BcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kdGFyZ2V0Lm9uKFwic2Nyb2xsc3RvcFwiLCBmdW5jKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5zdXBwb3J0ZWQgdHlwZTogXCIgKyB0eXBlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCpOODmeODs+ODiOeZu+mMsuino+mZpFxyXG4gICAgICAgIG9mZih0eXBlOiBzdHJpbmcsIGZ1bmM6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjcm9sbFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQub2ZmKFwic2Nyb2xsXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjcm9sbHN0b3BcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kdGFyZ2V0Lm9mZihcInNjcm9sbHN0b3BcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVuc3VwcG9ydGVkIHR5cGU6IFwiICsgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9saXN0dmlld09wdGlvbnMuZW5hYmxlQW5pbWF0aW9uIHx8ICFhbmltYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kdGFyZ2V0LnNjcm9sbFRvcChwb3MpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgPT0gdGltZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRpbWUgPSB0aGlzLl9saXN0dmlld09wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb247XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kdGFyZ2V0LmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogcG9zXHJcbiAgICAgICAgICAgICAgICB9LCB0aW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbGVyIOOBrueKtuaFi+abtOaWsFxyXG4gICAgICAgIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gbm9vcC5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGxlciDjga7noLTmo4RcclxuICAgICAgICBkZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl8kc2Nyb2xsTWFwID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuXyR0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQub2ZmKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kdGFyZ2V0ID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCv+OCpOODl+Wumue+qVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0IFRZUEUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiZWxlbWVudC1vdmVyZmxvd1wiO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGZhY3Rvcnkg5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRGYWN0b3J5KCk6IChlbGVtZW50OiBhbnksIG9wdGlvbnM6IExpc3RWaWV3T3B0aW9ucykgPT4gSVNjcm9sbGVyIHtcclxuICAgICAgICAgICAgY29uc3QgZmFjdG9yeSA9IChlbGVtZW50OiBhbnksIG9wdGlvbnM6IExpc3RWaWV3T3B0aW9ucyk6IElTY3JvbGxlciA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNjcm9sbGVyRWxlbWVudChlbGVtZW50LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8gc2V0IHR5cGUgc2lnbmF0dXJlLlxyXG4gICAgICAgICAgICAoPGFueT5mYWN0b3J5KS50eXBlID0gU2Nyb2xsZXJFbGVtZW50LlRZUEU7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3J5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBpbXBvcnQgX1V0aWxzID0gQ0RQLlVJLl9MaXN0Vmlld1V0aWxzO1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5TY3JvbGxlck5hdGl2ZV0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgU2Nyb2xsZXJOYXRpdmVcclxuICAgICAqIEBicmllZiBCcm93c2VyIE5hdGl2ZSDjga4gU2Nyb2xsZXIg44Kv44Op44K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBjbGFzcyBTY3JvbGxlck5hdGl2ZSBpbXBsZW1lbnRzIElTY3JvbGxlciB7XHJcbiAgICAgICAgcHJpdmF0ZSBfJGJvZHk6IEpRdWVyeSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfJHRhcmdldDogSlF1ZXJ5ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF8kc2Nyb2xsTWFwOiBKUXVlcnkgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX2xpc3R2aWV3T3B0aW9uczogTGlzdFZpZXdPcHRpb25zID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8hIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9uczogTGlzdFZpZXdPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHRoaXMuXyR0YXJnZXQgPSAkKGRvY3VtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5fJGJvZHkgPSAkKFwiYm9keVwiKTtcclxuICAgICAgICAgICAgdGhpcy5fbGlzdHZpZXdPcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGxlciDjga7lnovjgpLlj5blvpdcclxuICAgICAgICBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBTY3JvbGxlck5hdGl2ZS5UWVBFO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHBvc2l0aW9uIOWPluW+l1xyXG4gICAgICAgIGdldFBvcygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJHRhcmdldC5zY3JvbGxUb3AoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBwb3NpdGlvbiDjga7mnIDlpKflgKTjgpLlj5blvpdcclxuICAgICAgICBnZXRQb3NNYXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9VdGlscy5tYXgodGhpcy5fJHRhcmdldC5oZWlnaHQoKSAtIHdpbmRvdy5pbm5lckhlaWdodCwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Kk44OZ44Oz44OI55m76YyyXHJcbiAgICAgICAgb24odHlwZTogc3RyaW5nLCBmdW5jOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl8kdGFyZ2V0Lm9uKFwic2Nyb2xsXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjcm9sbHN0b3BcIjpcclxuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykub24oXCJzY3JvbGxzdG9wXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bnN1cHBvcnRlZCB0eXBlOiBcIiArIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Kk44OZ44Oz44OI55m76Yyy6Kej6ZmkXHJcbiAgICAgICAgb2ZmKHR5cGU6IHN0cmluZywgZnVuYzogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fJHRhcmdldC5vZmYoXCJzY3JvbGxcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsc3RvcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5vZmYoXCJzY3JvbGxzdG9wXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bnN1cHBvcnRlZCB0eXBlOiBcIiArIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44KS5oyH5a6aXHJcbiAgICAgICAgc2Nyb2xsVG8ocG9zOiBudW1iZXIsIGFuaW1hdGU/OiBib29sZWFuLCB0aW1lPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fbGlzdHZpZXdPcHRpb25zLmVuYWJsZUFuaW1hdGlvbiB8fCAhYW5pbWF0ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fJGJvZHkuc2Nyb2xsVG9wKHBvcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCA9PSB0aW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGltZSA9IHRoaXMuX2xpc3R2aWV3T3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuXyRib2R5LmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogcG9zXHJcbiAgICAgICAgICAgICAgICB9LCB0aW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbGVyIOOBrueKtuaFi+abtOaWsFxyXG4gICAgICAgIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgLy8gbm9vcC5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGxlciDjga7noLTmo4RcclxuICAgICAgICBkZXN0cm95KCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl8kc2Nyb2xsTWFwID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fJHRhcmdldCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K/44Kk44OX5a6a576pXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXQgVFlQRSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJuYXRpdmUtc2Nyb2xsXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgZmFjdG9yeSDlj5blvpdcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldEZhY3RvcnkoKTogKGVsZW1lbnQ6IGFueSwgb3B0aW9uczogTGlzdFZpZXdPcHRpb25zKSA9PiBJU2Nyb2xsZXIge1xyXG4gICAgICAgICAgICBjb25zdCBmYWN0b3J5ID0gKGVsZW1lbnQ6IGFueSwgb3B0aW9uczogTGlzdFZpZXdPcHRpb25zKTogSVNjcm9sbGVyID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU2Nyb2xsZXJOYXRpdmUob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIC8vIHNldCB0eXBlIHNpZ25hdHVyZS5cclxuICAgICAgICAgICAgKDxhbnk+ZmFjdG9yeSkudHlwZSA9IFNjcm9sbGVyTmF0aXZlLlRZUEU7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3J5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLyBmb3Igbm9uIGlzY3JvbGwgdXNlci4gY2RwLnVpLmxpc3R2aWV3LmQudHMgaW50ZXJuYWwgZGVmaW5pdGlvbi5cclxuaW50ZXJmYWNlIElTY3JvbGxPcHRpb25zIHtcclxuICAgIFt4OiBzdHJpbmddOiBhbnk7XHJcbiAgICBwcm9iZVR5cGU/OiBudW1iZXI7IC8vIFtjYWxtIDoxIDwgMiA8IDM6IGFnZ3Jlc3NpdmVdXHJcbn1cclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBfQ29uZmlnICA9IENEUC5VSS5MaXN0Vmlld0dsb2JhbENvbmZpZztcclxuICAgIGltcG9ydCBfVXRpbHMgICA9IENEUC5VSS5fTGlzdFZpZXdVdGlscztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuU2Nyb2xsZXJJU2Nyb2xsXSBcIjtcclxuXHJcbiAgICBpbnRlcmZhY2UgSVNjcm9sbEV4IGV4dGVuZHMgSVNjcm9sbCB7XHJcbiAgICAgICAgb246ICh0eXBlOiBzdHJpbmcsIGZuOiAoZXZlbnQ6IGFueSkgPT4gdm9pZCkgPT4gdm9pZDtcclxuICAgICAgICBvZmY6ICh0eXBlOiBzdHJpbmcsIGZuOiAoZXZlbnQ6IGFueSkgPT4gdm9pZCkgPT4gdm9pZDtcclxuICAgICAgICB3cmFwcGVyOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBzY3JvbGxlcjogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgc2Nyb2xsZXJXaWR0aDogbnVtYmVyO1xyXG4gICAgICAgIHNjcm9sbGVySGVpZ2h0OiBudW1iZXI7XHJcbiAgICAgICAgbWF4U2Nyb2xsWDogbnVtYmVyO1xyXG4gICAgICAgIG1heFNjcm9sbFk6IG51bWJlcjtcclxuICAgICAgICBnZXRDb21wdXRlZFBvc2l0aW9uKCk6IGFueTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBTY3JvbGxlcklTY3JvbGxcclxuICAgICAqIEBicmllZiBpU2Nyb2xsIOOCkuS9v+eUqOOBl+OBnyBTY3JvbGxlciDjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIFNjcm9sbGVySVNjcm9sbCBpbXBsZW1lbnRzIElTY3JvbGxlciB7XHJcbiAgICAgICAgcHJpdmF0ZSBfJG93bmVyOiBKUXVlcnkgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX2lzY3JvbGw6IElTY3JvbGxFeCA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfcmVmcmVzaFRpbWVySWQ6IG51bWJlciA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfJHdyYXBwZXI6IEpRdWVyeSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfJHNjcm9sbGVyOiBKUXVlcnkgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgX2xpc3R2aWV3T3B0aW9uczogTGlzdFZpZXdPcHRpb25zID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8hIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgY29uc3RydWN0b3IoJG93bmVyOiBKUXVlcnksIGVsZW1lbnQ6IHN0cmluZywgaXNjcm9sbE9wdGlvbnM6IElTY3JvbGxPcHRpb25zLCBsaXN0dmlld09wdGlvbnM6IExpc3RWaWV3T3B0aW9ucyk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoJG93bmVyOiBKUXVlcnksIGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBpc2Nyb2xsT3B0aW9uczogSVNjcm9sbE9wdGlvbnMsIGxpc3R2aWV3T3B0aW9uczogTGlzdFZpZXdPcHRpb25zKTtcclxuICAgICAgICBjb25zdHJ1Y3Rvcigkb3duZXI6IEpRdWVyeSwgZWxlbWVudDogYW55LCBpc2Nyb2xsT3B0aW9uczogSVNjcm9sbE9wdGlvbnMsIGxpc3R2aWV3T3B0aW9uczogTGlzdFZpZXdPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IGdsb2JhbC5JU2Nyb2xsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kb3duZXIgPSAkb3duZXI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc2Nyb2xsID0gPElTY3JvbGxFeD5uZXcgSVNjcm9sbChlbGVtZW50LCBpc2Nyb2xsT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kd3JhcHBlciA9ICQodGhpcy5faXNjcm9sbC53cmFwcGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRzY3JvbGxlciA9ICQodGhpcy5faXNjcm9sbC5zY3JvbGxlcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0dmlld09wdGlvbnMgPSBsaXN0dmlld09wdGlvbnM7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiaXNjcm9sbCBtb2R1bGUgZG9lc24ndCBsb2FkLlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbGVyIOOBruWei+OCkuWPluW+l1xyXG4gICAgICAgIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFNjcm9sbGVySVNjcm9sbC5UWVBFO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHBvc2l0aW9uIOWPluW+l1xyXG4gICAgICAgIGdldFBvcygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBsZXQgcG9zID0gdGhpcy5faXNjcm9sbC5nZXRDb21wdXRlZFBvc2l0aW9uKCkueTtcclxuICAgICAgICAgICAgaWYgKF8uaXNOYU4ocG9zKSkge1xyXG4gICAgICAgICAgICAgICAgcG9zID0gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHBvcyA9IC1wb3M7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHBvcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBwb3NpdGlvbiDjga7mnIDlpKflgKTjgpLlj5blvpdcclxuICAgICAgICBnZXRQb3NNYXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9VdGlscy5tYXgoLXRoaXMuX2lzY3JvbGwubWF4U2Nyb2xsWSwgMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Kk44OZ44Oz44OI55m76YyyXHJcbiAgICAgICAgb24odHlwZTogc3RyaW5nLCBmdW5jOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzY3JvbGxcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc2Nyb2xsLm9uKFwic2Nyb2xsXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcInNjcm9sbHN0b3BcIjpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc2Nyb2xsLm9uKFwic2Nyb2xsRW5kXCIsIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJ1bnN1cHBvcnRlZCB0eXBlOiBcIiArIHR5cGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Kk44OZ44Oz44OI55m76Yyy6Kej6ZmkXHJcbiAgICAgICAgb2ZmKHR5cGU6IHN0cmluZywgZnVuYzogKGV2ZW50OiBKUXVlcnkuRXZlbnQpID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNjcm9sbC5vZmYoXCJzY3JvbGxcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic2Nyb2xsc3RvcFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2lzY3JvbGwub24oXCJzY3JvbGxFbmRcIiwgZnVuYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVuc3VwcG9ydGVkIHR5cGU6IFwiICsgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGltZSA9IDA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9saXN0dmlld09wdGlvbnMuZW5hYmxlQW5pbWF0aW9uICYmIGFuaW1hdGUpIHtcclxuICAgICAgICAgICAgICAgIHRpbWUgPSB0aW1lIHx8IHRoaXMuX2xpc3R2aWV3T3B0aW9ucy5hbmltYXRpb25EdXJhdGlvbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pc2Nyb2xsLnNjcm9sbFRvKDAsIC1wb3MsIHRpbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbGVyIOOBrueKtuaFi+abtOaWsFxyXG4gICAgICAgIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuXyRvd25lcikge1xyXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHdyYXBwZXJcclxuICAgICAgICAgICAgICAgICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3duZXJIZWlnaHQgPSB0aGlzLl8kb3duZXIuaGVpZ2h0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG93bmVySGVpZ2h0ICE9PSB0aGlzLl8kd3JhcHBlci5oZWlnaHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl8kd3JhcHBlci5oZWlnaHQob3duZXJIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fcmVmcmVzaFRpbWVySWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5fcmVmcmVzaFRpbWVySWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHByb2MgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuXyRzY3JvbGxlciAmJiB0aGlzLl8kc2Nyb2xsZXIuaGVpZ2h0KCkgIT09IHRoaXMuX2lzY3JvbGwuc2Nyb2xsZXJIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faXNjcm9sbC5yZWZyZXNoKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlZnJlc2hUaW1lcklkID0gc2V0VGltZW91dChwcm9jLCB0aGlzLl9saXN0dmlld09wdGlvbnMuc2Nyb2xsTWFwUmVmcmVzaEludGVydmFsKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZWZyZXNoVGltZXJJZCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pc2Nyb2xsLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlZnJlc2hUaW1lcklkID0gc2V0VGltZW91dChwcm9jLCB0aGlzLl9saXN0dmlld09wdGlvbnMuc2Nyb2xsTWFwUmVmcmVzaEludGVydmFsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbGVyIOOBruegtOajhFxyXG4gICAgICAgIGRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuXyRzY3JvbGxlciA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuXyR3cmFwcGVyID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5faXNjcm9sbC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuXyRvd25lciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K/44Kk44OX5a6a576pXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXQgVFlQRSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJpc2Nyb2xsXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgZmFjdG9yeSDlj5blvpdcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldEZhY3Rvcnkob3B0aW9ucz86IElTY3JvbGxPcHRpb25zKTogKGVsZW1lbnQ6IGFueSwgb3B0aW9uczogTGlzdFZpZXdPcHRpb25zKSA9PiBJU2Nyb2xsZXIge1xyXG4gICAgICAgICAgICBjb25zdCBkZWZhdWx0T3B0ID0ge1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsWDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBib3VuY2U6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdGFwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgY2xpY2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtb3VzZVdoZWVsOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsYmFyczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGludGVyYWN0aXZlU2Nyb2xsYmFyczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNocmlua1Njcm9sbGJhcnM6IFwic2NhbGVcIixcclxuICAgICAgICAgICAgICAgIGZhZGVTY3JvbGxiYXJzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcHJldmVudERlZmF1bHQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZVBvaW50ZXI6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBkaXNhYmxlTW91c2U6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgZGlzYWJsZVRvdWNoOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHByb2JlVHlwZTogMixcclxuLy8gICAgICAgICAgICAgICBldmVudFBhc3N0aHJvdWdoOiB0cnVlLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaXNjcm9sbE9wdGlvbnMgPSAkLmV4dGVuZCh7fSwgZGVmYXVsdE9wdCwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmYWN0b3J5ID0gKGVsZW1lbnQ6IGFueSwgbGlzdHZpZXdPcHRpb25zOiBMaXN0Vmlld09wdGlvbnMpOiBJU2Nyb2xsZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJG93bmVyID0gJChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0ICRtYXAgPSAkb3duZXIuZmluZChfQ29uZmlnLlNDUk9MTF9NQVBfU0VMRUNUT1IpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJHdyYXBwZXIgPSAkKFwiPGRpdiBjbGFzcz0nXCIgKyBfQ29uZmlnLldSQVBQRVJfQ0xBU1MgKyBcIic+PC9kaXY+XCIpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNzcyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3ZlcmZsb3c6IFwiaGlkZGVuXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAkbWFwLndyYXAoJHdyYXBwZXIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTY3JvbGxlcklTY3JvbGwoJG93bmVyLCBfQ29uZmlnLldSQVBQRVJfU0VMRUNUT1IsIGlzY3JvbGxPcHRpb25zLCBsaXN0dmlld09wdGlvbnMpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAvLyBzZXQgdHlwZSBzaWduYXR1cmUuXHJcbiAgICAgICAgICAgICg8YW55PmZhY3RvcnkpLnR5cGUgPSBTY3JvbGxlcklTY3JvbGwuVFlQRTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWN0b3J5O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuTGlzdEl0ZW1WaWV3XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgTGlzdEl0ZW1WaWV3T3B0aW9uc1xyXG4gICAgICogQGJyaWVmIExpc3RJdGVtVmlldyDjga7jgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBMaXN0SXRlbVZpZXdPcHRpb25zPFRNb2RlbCBleHRlbmRzIEJhY2tib25lLk1vZGVsID0gQmFja2JvbmUuTW9kZWw+XHJcbiAgICAgICAgZXh0ZW5kcyBCYWNrYm9uZS5WaWV3T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBvd25lcjogQmFzZUxpc3RWaWV3O1xyXG4gICAgICAgICRlbD86IEpRdWVyeTtcclxuICAgICAgICBsaW5lUHJvZmlsZTogTGluZVByb2ZpbGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgTGlzdEl0ZW1WaWV3XHJcbiAgICAgKiBAYnJpZWYgTGlzdFZpZXcg44GM5omx44GGIExpc3RJdGVtIOOCs+ODs+ODhuODiuOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgTGlzdEl0ZW1WaWV3PFRNb2RlbCBleHRlbmRzIEJhY2tib25lLk1vZGVsID0gQmFja2JvbmUuTW9kZWw+XHJcbiAgICAgICAgZXh0ZW5kcyBCYWNrYm9uZS5WaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJTGlzdEl0ZW1WaWV3LCBJQ29tcG9zYWJsZVZpZXcge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9vd25lcjogQmFzZUxpc3RWaWV3ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF9saW5lUHJvZmlsZTogTGluZVByb2ZpbGUgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IExpc3RJdGVtVmlld09wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5fb3duZXIgPSBvcHRpb25zLm93bmVyO1xyXG4gICAgICAgICAgICBpZiAob3B0aW9ucy4kZWwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlcyA9ICg8YW55PnRoaXMpLmV2ZW50cyA/IHRydWUgOiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RWxlbWVudChvcHRpb25zLiRlbCwgZGVsZWdhdGVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9saW5lUHJvZmlsZSA9IG9wdGlvbnMubGluZVByb2ZpbGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IExpc3RJdGVtVmlld1xyXG5cclxuICAgICAgICAvLyEg5o+P55S7OiBmcmFtZXdvcmsg44GL44KJ5ZG844Gz5Ye644GV44KM44KL44Gf44KB44CB44Kq44O844OQ44O844Op44Kk44OJ5b+F6aCIXHJcbiAgICAgICAgcmVuZGVyKCk6IExpc3RJdGVtVmlldzxUTW9kZWw+IHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwibmVlZCBvdmVycmlkZSAncmVuZGVyKCknIG1ldGhvZC5cIik7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOiHqui6q+OBriBMaW5lIOOCpOODs+ODh+ODg+OCr+OCueOCkuWPluW+l1xyXG4gICAgICAgIGdldEluZGV4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9saW5lUHJvZmlsZS5pbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDoh6rouqvjgavmjIflrprjgZXjgozjgZ/pq5jjgZXjgpLlj5blvpdcclxuICAgICAgICBnZXRTcGVjaWZpZWRIZWlnaHQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2xpbmVQcm9maWxlLmhlaWdodDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBjaGlsZCBub2RlIOOBjOWtmOWcqOOBmeOCi+OBi+WIpOWumlxyXG4gICAgICAgIGhhc0NoaWxkTm9kZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLiRlbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDAgPCB0aGlzLiRlbC5jaGlsZHJlbigpLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6auY44GV44KS5pu05pawXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gbmV3SGVpZ2h0IHtOdW1iZXJ9ICAgICAgICAgICAgICBbaW5dIOaWsOOBl+OBhOmrmOOBlVxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zICAge1VwZGF0ZUhlaWdodE9wdGlvbnN9IFtpbl0gbGluZSDjga7pq5jjgZXmm7TmlrDmmYLjgavlvbHpn7/jgZnjgovjgZnjgbnjgabjga4gTGluZVByb2ZpbGUg44Gu5YaN6KiI566X44KS6KGM44GG5aC05ZCI44GvIHsgcmVmbGVjdEFsbDogdHJ1ZSB9XHJcbiAgICAgICAgICogQHJldHVybiB7TGlzdEl0ZW1WaWV3fSDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICB1cGRhdGVIZWlnaHQobmV3SGVpZ2h0OiBudW1iZXIsIG9wdGlvbnM/OiBVcGRhdGVIZWlnaHRPcHRpb25zKTogTGlzdEl0ZW1WaWV3PFRNb2RlbD4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy4kZWwpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdldFNwZWNpZmllZEhlaWdodCgpICE9PSBuZXdIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW5lUHJvZmlsZS51cGRhdGVIZWlnaHQobmV3SGVpZ2h0LCBvcHRpb25zKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLiRlbC5oZWlnaHQobmV3SGVpZ2h0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUNvbXBvc2FibGVWaWV3XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOBmeOBp+OBq+Wumue+qeOBleOCjOOBnyBCYWNrYm9uZS5WaWV3IOOCkuWfuuW6leOCr+ODqeOCueOBq+ioreWumuOBl+OAgWV4dGVuZCDjgpLlrp/ooYzjgZnjgovjgIJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBkZXJpdmVzICAgICAgICAge0JhY2tib25lLlZpZXd8QmFja2JvbmUuVmlld1tdfSBbaW5dIOWQiOaIkOWFg+OBriBWaWV3IOOCr+ODqeOCuVxyXG4gICAgICAgICAqIEBwYXJhbSBwcm9wZXJ0aWVzICAgICAge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHByb3RvdHlwZSDjg5fjg63jg5Hjg4bjgqNcclxuICAgICAgICAgKiBAcGFyYW0gY2xhc3NQcm9wZXJ0aWVzIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgICAgW2luXSBzdGF0aWMg44OX44Ot44OR44OG44KjXHJcbiAgICAgICAgICogQHJldHVybiB7QmFja2JvbmUuVmlld3xCYWNrYm9uZS5WaWV3W119IOaWsOimj+OBq+eUn+aIkOOBleOCjOOBnyBWaWV3IOOBruOCs+ODs+OCueODiOODqeOCr+OCv1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHN0YXRpYyBjb21wb3NlKGRlcml2ZXM6IFZpZXdDb25zdHJ1Y3RvciB8IFZpZXdDb25zdHJ1Y3RvcltdLCBwcm9wZXJ0aWVzOiBhbnksIGNsYXNzUHJvcGVydGllcz86IGFueSk6IFZpZXdDb25zdHJ1Y3RvciB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXBvc2VkOiBhbnkgPSBjb21wb3NlVmlld3MoTGlzdEl0ZW1WaWV3LCBkZXJpdmVzKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbXBvc2VkLmV4dGVuZChwcm9wZXJ0aWVzLCBjbGFzc1Byb3BlcnRpZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBPdmVycmlkZTogQmFja2JvbmUuVmlld1xyXG5cclxuICAgICAgICAvLyEg6ZaL5pS+XHJcbiAgICAgICAgcmVtb3ZlKCk6IExpc3RJdGVtVmlldzxUTW9kZWw+IHtcclxuICAgICAgICAgICAgLy8geHBlcmlhIEFYIEplbGx5IEJlYW4gKDQuMS4yKeOBq+OBpuOAgeODoeODouODquODvOODquODvOOCr+OCkui7vea4m+OBleOBm+OCi+WKueaenFxyXG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKFwiZmlndXJlXCIpLmNzcyhcImJhY2tncm91bmQtaW1hZ2VcIiwgXCJub25lXCIpO1xyXG4gICAgICAgICAgICAvLyB0aGlzLiRlbCDjga/lho3liKnnlKjjgZnjgovjgZ/jgoHnoLTmo4TjgZfjgarjgYRcclxuICAgICAgICAgICAgdGhpcy4kZWwuY2hpbGRyZW4oKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgdGhpcy4kZWwub2ZmKCk7XHJcbiAgICAgICAgICAgIHRoaXMuJGVsID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5zdG9wTGlzdGVuaW5nKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpbmVQcm9maWxlID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHNob3J0IGN1dCBtZXRob2RzXHJcblxyXG4gICAgICAgIC8vISBPd25lciDlj5blvpdcclxuICAgICAgICBnZXQgb3duZXIoKTogQmFzZUxpc3RWaWV3IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvKiB0c2xpbnQ6ZGlzYWJsZTpuby1iaXR3aXNlIG5vLXVudXNlZC1leHByZXNzaW9uICovXHJcbi8qIGpzaGludCAtVzAzMCAqLyAgLy8gZm9yIFwiRXhwZWN0ZWQgYW4gYXNzaWdubWVudCBvciBmdW5jdGlvbiBjYWxsIGFuZCBpbnN0ZWFkIHNhdyBhbiBleHByZXNzaW9uXCJcclxuXHJcbm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGltcG9ydCBfQ29uZmlnICA9IENEUC5VSS5MaXN0Vmlld0dsb2JhbENvbmZpZztcclxuICAgIGltcG9ydCBfVXRpbHMgICA9IENEUC5VSS5fTGlzdFZpZXdVdGlscztcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuU2Nyb2xsTWFuYWdlcl0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgU2Nyb2xsTWFuYWdlclxyXG4gICAgICogQGJyaWVmIOODoeODouODqueuoeeQhuOCkuihjOOBhuOCueOCr+ODreODvOODq+WHpueQhuOBruOCs+OCouODreOCuOODg+OCr+Wun+ijheOCr+ODqeOCuVxyXG4gICAgICogICAgICAgIOacrOOCr+ODqeOCueOBryBJTGlzdFZpZXcg44Kk44Oz44K/44O844OV44Kn44Kk44K544KS5oyB44GhIERPTSDjgavjgqLjgq/jgrvjgrnjgZnjgovjgYzjgIFCYWNrYm9uZS5WaWV3IOOCkue2meaJv+OBl+OBquOBhFxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgU2Nyb2xsTWFuYWdlciBpbXBsZW1lbnRzIElMaXN0Vmlld0ZyYW1ld29yaywgSVNjcm9sbGFibGUsIElCYWNrdXBSZXN0b3JlIHtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBfJHJvb3Q6IEpRdWVyeSA9IG51bGw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vITwgU2Nyb2xsIOWvvuixoeOBruODq+ODvOODiOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgIHByaXZhdGUgXyRtYXA6IEpRdWVyeSA9IG51bGw7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyE8IFNjcm9sbCBNYXAgZWxlbWVudCDjgpLmoLzntI1cclxuICAgICAgICBwcml2YXRlIF9tYXBIZWlnaHQ6IG51bWJlciA9IDA7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8hPCBTY3JvbGwgTWFwIOOBrumrmOOBleOCkuagvOe0jSAoXyRtYXAg44Gu54q25oWL44Gr5L6d5a2Y44GV44Gb44Gq44GEKVxyXG4gICAgICAgIHByaXZhdGUgX3Njcm9sbGVyOiBJU2Nyb2xsZXIgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyE8IFNjcm9sbCDjgavkvb/nlKjjgZnjgosgSVNjcm9sbGVyIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgIHByaXZhdGUgX3NldHRpbmdzOiBMaXN0Vmlld09wdGlvbnMgPSBudWxsOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyE8IFNjcm9sbE1hbmFnZXIg44Kq44OX44K344On44Oz44KS5qC857SNXHJcbiAgICAgICAgcHJpdmF0ZSBfYWN0aXZlID0gdHJ1ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vITwgVUkg6KGo56S65Lit44GvIHRydWUg44Gr5oyH5a6aXHJcbiAgICAgICAgcHJpdmF0ZSBfc2Nyb2xsRXZlbnRIYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCA9IG51bGw7ICAgICAgICAgIC8vITwgU2Nyb2xsIEV2ZW50IEhhbmRsZXJcclxuICAgICAgICBwcml2YXRlIF9zY3JvbGxTdG9wRXZlbnRIYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCA9IG51bGw7ICAgICAgLy8hPCBTY3JvbGwgU3RvcCBFdmVudCBIYW5kbGVyXHJcbiAgICAgICAgcHJpdmF0ZSBfYmFzZUhlaWdodDogbnVtYmVyID0gMDsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vITwg6auY44GV44Gu5Z+65rqW5YCkXHJcbiAgICAgICAgcHJpdmF0ZSBfbGluZXM6IExpbmVQcm9maWxlW10gPSBbXTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vITwg566h55CG5LiL44Gr44GC44KLIExpbmVQcm9maWxlIOmFjeWIl1xyXG4gICAgICAgIHByaXZhdGUgX3BhZ2VzOiBQYWdlUHJvZmlsZVtdID0gW107ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyE8IOeuoeeQhuS4i+OBq+OBguOCiyBQYWdlUHJvZmlsZSDphY3liJdcclxuICAgICAgICAvLyEg5pyA5paw44Gu6KGo56S66aCY5Z+f5oOF5aCx44KS5qC857SNIChTY3JvbGwg5Lit44Gu5pu05paw5Yem55CG44Gr5L2/55SoKVxyXG4gICAgICAgIHByaXZhdGUgX2xhc3RBY3RpdmVQYWdlQ29udGV4dCA9IHtcclxuICAgICAgICAgICAgaW5kZXg6IDAsXHJcbiAgICAgICAgICAgIGZyb206IDAsXHJcbiAgICAgICAgICAgIHRvOiAwLFxyXG4gICAgICAgICAgICBwb3M6IDAsICAgIC8vIHNjcm9sbCBwb3NpdGlvblxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHJvdGVjdGVkIF9iYWNrdXAgPSB7fTsgICAgLy8hPCDjg4fjg7zjgr/jga4gYmFja3VwIOmgmOWfny4ga2V5IOOBqCBfbGluZXMg44KS5qC857SN44CC5rS+55Sf44Kv44Op44K544Gn5ouh5by15Y+v6IO944CCXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gXyRyb290ICB7SlF1ZXJ5fSBbaW5dIOeuoeeQhuWvvuixoeOBruODq+ODvOODiOOCqOODrOODoeODs+ODiFxyXG4gICAgICAgICAqIEBwYXJhbSBvcHRpb25zIHtMaXN0Vmlld09wdGlvbnN9IFtpbl0g44Kq44OX44K344On44OzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc3RydWN0b3Iob3B0aW9ucz86IExpc3RWaWV3T3B0aW9ucykge1xyXG4gICAgICAgICAgICAvLyBMaXN0Vmlld09wdGlvbnMg5pei5a6a5YCkXHJcbiAgICAgICAgICAgIGNvbnN0IGRlZk9wdGlvbnM6IExpc3RWaWV3T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbGVyRmFjdG9yeTogU2Nyb2xsZXJOYXRpdmUuZ2V0RmFjdG9yeSgpLFxyXG4gICAgICAgICAgICAgICAgZW5hYmxlSGlkZGVuUGFnZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBlbmFibGVUcmFuc2Zvcm1PZmZzZXQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsTWFwUmVmcmVzaEludGVydmFsOiAyMDAsXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxSZWZyZXNoRGlzdGFuY2U6IDIwMCxcclxuICAgICAgICAgICAgICAgIHBhZ2VQcmVwYXJlQ291bnQ6IDMsXHJcbiAgICAgICAgICAgICAgICBwYWdlUHJlbG9hZENvdW50OiAxLFxyXG4gICAgICAgICAgICAgICAgZW5hYmxlQW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYW5pbWF0aW9uRHVyYXRpb246IDAsXHJcbiAgICAgICAgICAgICAgICBiYXNlRGVwdGg6IFwiYXV0b1wiLFxyXG4gICAgICAgICAgICAgICAgaXRlbVRhZ05hbWU6IFwibGlcIixcclxuICAgICAgICAgICAgICAgIHJlbW92ZUl0ZW1XaXRoVHJhbnNpdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHVzZUR1bW15SW5hY3RpdmVTY3JvbGxNYXA6IGZhbHNlLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLy8g6Kit5a6a5qC857SNXHJcbiAgICAgICAgICAgIHRoaXMuX3NldHRpbmdzID0gJC5leHRlbmQoe30sIGRlZk9wdGlvbnMsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgLy8g44K544Kv44Ot44O844Or44Kk44OZ44Oz44OIXHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbEV2ZW50SGFuZGxlciA9IChldmVudDogSlF1ZXJ5LkV2ZW50KTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2Nyb2xsKHRoaXMuX3Njcm9sbGVyLmdldFBvcygpKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgLy8g44K544Kv44Ot44O844Or5YGc5q2i44Kk44OZ44Oz44OIXHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbFN0b3BFdmVudEhhbmRsZXIgPSAoZXZlbnQ6IEpRdWVyeS5FdmVudCk6IHZvaWQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblNjcm9sbFN0b3AodGhpcy5fc2Nyb2xsZXIuZ2V0UG9zKCkpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwdWJsaWMgbWV0aG9kXHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjgqrjg5bjgrjjgqfjgq/jg4jjga7liJ3mnJ/ljJZcclxuICAgICAgICBwdWJsaWMgaW5pdGlhbGl6ZSgkcm9vdDogSlF1ZXJ5LCBoZWlnaHQ6IG51bWJlcik6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICAvLyDml6Ljgavmp4vnr4njgZXjgozjgabjgYTjgZ/loLTlkIjjga/noLTmo4RcclxuICAgICAgICAgICAgaWYgKHRoaXMuXyRyb290KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fJHJvb3QgPSAkcm9vdDtcclxuICAgICAgICAgICAgdGhpcy5fJG1hcCA9ICRyb290Lmhhc0NsYXNzKF9Db25maWcuU0NST0xMX01BUF9DTEFTUykgPyAkcm9vdCA6ICRyb290LmZpbmQoX0NvbmZpZy5TQ1JPTExfTUFQX1NFTEVDVE9SKTtcclxuICAgICAgICAgICAgLy8gXyRtYXAg44GM54Sh44GE5aC05ZCI44Gv5Yid5pyf5YyW44GX44Gq44GEXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl8kbWFwLmxlbmd0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kcm9vdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyID0gdGhpcy5jcmVhdGVTY3JvbGxlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEJhc2VIZWlnaHQoaGVpZ2h0KTtcclxuICAgICAgICAgICAgdGhpcy5zZXRTY3JvbGxlckNvbmRpdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44Kq44OW44K444Kn44Kv44OI44Gu56C05qOEXHJcbiAgICAgICAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY3JvbGxlcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldFNjcm9sbGVyQ29uZGl0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxlciA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuXyRtYXAgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl8kcm9vdCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Oa44O844K444Gu5Z+65rqW5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgcHVibGljIHNldEJhc2VIZWlnaHQoaGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fYmFzZUhlaWdodCA9IGhlaWdodDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Jhc2VIZWlnaHQgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwiaW52YWxpZCBiYXNlIGhlaWdodDogXCIgKyB0aGlzLl9iYXNlSGVpZ2h0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2Nyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgYWN0aXZlIOeKtuaFi+ioreWumlxyXG4gICAgICAgIHB1YmxpYyBzZXRBY3RpdmVTdGF0ZShhY3RpdmU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fYWN0aXZlID0gYWN0aXZlO1xyXG4gICAgICAgICAgICB0aGlzLnRyZWF0U2Nyb2xsUG9zaXRpb24oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBhY3RpdmUg54q25oWL5Yik5a6aXHJcbiAgICAgICAgcHVibGljIGlzQWN0aXZlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIHNjcm9sbGVyIOOBrueorumhnuOCkuWPluW+l1xyXG4gICAgICAgIHB1YmxpYyBnZXRTY3JvbGxlclR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuICg8YW55PnRoaXMuX3NldHRpbmdzLnNjcm9sbGVyRmFjdG9yeSkudHlwZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeKtuaFi+OBq+W/nOOBmOOBn+OCueOCr+ODreODvOODq+S9jee9ruOBruS/neWtmC/lvqnlhYNcclxuICAgICAgICAgKiBjZHAudWkuZnMuanM6IFBhZ2VUYWJMaXN0VmlldyDjgYzlrp/pqJPnmoTjgavkvb/nlKhcclxuICAgICAgICAgKiBUT0RPOiDigLtpc2Nyb2xsIOOBr+acquWvvuW/nFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHB1YmxpYyB0cmVhdFNjcm9sbFBvc2l0aW9uKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVwZGF0ZU9mZnNldCA9ICgkdGFyZ2V0OiBKUXVlcnksIG9mZnNldD86IG51bWJlcik6IEpRdWVyeSA9PiB7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgPSBvZmZzZXQgfHwgKHRoaXMuX3Njcm9sbGVyLmdldFBvcygpIC0gdGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LnBvcyk7XHJcbiAgICAgICAgICAgICAgICBpZiAoX1V0aWxzLmdldENzc01hdHJpeFZhbHVlKCR0YXJnZXQsIFwidHJhbnNsYXRlWVwiKSAhPT0gb2Zmc2V0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IF9VdGlscy5jc3NQcmVmaXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1bX1V0aWxzLmNzc1ByZWZpeGVzW2ldICsgXCJ0cmFuc2Zvcm1cIl0gPSBcInRyYW5zbGF0ZTNkKDBweCxcIiArIG9mZnNldCArIFwicHgsMHB4KVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAkdGFyZ2V0LmNzcyh0cmFuc2Zvcm0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAkdGFyZ2V0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY2xlYXJPZmZzZXQgPSAoJHRhcmdldDogSlF1ZXJ5KTogSlF1ZXJ5ID0+IHtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBfVXRpbHMuY3NzUHJlZml4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmFuc2Zvcm1bX1V0aWxzLmNzc1ByZWZpeGVzW2ldICsgXCJ0cmFuc2Zvcm1cIl0gPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgJHRhcmdldC5jc3ModHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAkdGFyZ2V0O1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FjdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgLy8g5Lul5LiL44Gu44K544Kz44O844OX44Gu5Yem55CG44Gr5a++44GX44Gm55S76Z2i5pu05paw44KSMeWbnuOBq+OBp+OBjeOBquOBhOOBn+OCgeOAgUpCLCBJQ1Mg44Gn44Gv44Gh44KJ44Gk44GN44GM55m655Sf44GZ44KL44CCS2l0a2F0IOS7pemZjeOBr+iJr+WlveOAglxyXG4gICAgICAgICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc2Nyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIuc2Nyb2xsVG8odGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LnBvcywgZmFsc2UsIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjbGVhck9mZnNldCh0aGlzLl8kbWFwKS5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XHJcbiAgICAgICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLnVzZUR1bW15SW5hY3RpdmVTY3JvbGxNYXApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByZXBhcmVJbmFjdGl2ZU1hcCgpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLnVzZUR1bW15SW5hY3RpdmVTY3JvbGxNYXApIHtcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVPZmZzZXQodGhpcy5wcmVwYXJlSW5hY3RpdmVNYXAoKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZU9mZnNldCh0aGlzLl8kbWFwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGluYWN0aXZlIOeUqCBNYXAg44Gu55Sf5oiQXHJcbiAgICAgICAgcHJpdmF0ZSBwcmVwYXJlSW5hY3RpdmVNYXAoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgY29uc3QgJHBhcmVudCA9IHRoaXMuXyRtYXAucGFyZW50KCk7XHJcbiAgICAgICAgICAgIGxldCAkaW5hY3RpdmVNYXAgPSAkcGFyZW50LmZpbmQoX0NvbmZpZy5JTkFDVElWRV9DTEFTU19TRUxFQ1RPUik7XHJcbiAgICAgICAgICAgIGlmICgkaW5hY3RpdmVNYXAubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYWdlSW5kZXggPSB0aGlzLmdldFBhZ2VJbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGxpc3RJdGVtVmlld3MgPSB0aGlzLl8kbWFwLmNsb25lKCkuY2hpbGRyZW4oKS5maWx0ZXIoKGluZGV4OiBudW1iZXIsIGVsZW1lbnQ6IEhUTUxFbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFnZUluZGV4ID0gfn4kKGVsZW1lbnQpLmF0dHIoX0NvbmZpZy5EQVRBX1BBR0VfSU5ERVgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50UGFnZUluZGV4IC0gMSA8PSBwYWdlSW5kZXggfHwgcGFnZUluZGV4IDw9IGN1cnJlbnRQYWdlSW5kZXggKyAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICRpbmFjdGl2ZU1hcCA9ICQoXCI8c2VjdGlvbiBjbGFzcz0nXCIgKyBfQ29uZmlnLlNDUk9MTF9NQVBfQ0xBU1MgKyBcIiBcIiArIF9Db25maWcuSU5BQ1RJVkVfQ0xBU1MgKyBcIic+PC9zZWN0aW9uPlwiKVxyXG4gICAgICAgICAgICAgICAgICAgIC5hcHBlbmQoJGxpc3RJdGVtVmlld3MpXHJcbiAgICAgICAgICAgICAgICAgICAgLmhlaWdodCh0aGlzLl9tYXBIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgJHBhcmVudC5hcHBlbmQoJGluYWN0aXZlTWFwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuXyRtYXAuY3NzKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICRpbmFjdGl2ZU1hcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IOODl+ODreODleOCoeOCpOODq+euoeeQhlxyXG5cclxuICAgICAgICAvLyEg5Yid5pyf5YyW5riI44G/44GL5Yik5a6aXHJcbiAgICAgICAgaXNJbml0aWFsaXplZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICEhdGhpcy5fJHJvb3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OX44Ot44OR44OG44Kj44KS5oyH5a6a44GX44Gm44CBTGluZVByb2ZpbGUg44KS566h55CGXHJcbiAgICAgICAgYWRkSXRlbShcclxuICAgICAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgICAgIGluaXRpYWxpemVyOiBuZXcgKG9wdGlvbnM/OiBhbnkpID0+IEJhc2VMaXN0SXRlbVZpZXcsXHJcbiAgICAgICAgICAgIGluZm86IGFueSxcclxuICAgICAgICAgICAgaW5zZXJ0VG8/OiBudW1iZXJcclxuICAgICAgICApOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fYWRkTGluZShuZXcgTGluZVByb2ZpbGUodGhpcywgTWF0aC5mbG9vcihoZWlnaHQpLCBpbml0aWFsaXplciwgaW5mbyksIGluc2VydFRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5fjg63jg5Hjg4bjgqPjgpLmjIflrprjgZfjgabjgIFMaW5lUHJvZmlsZSDjgpLnrqHnkIYuIOeZu+mMsiBmcmFtZXdvcmsg44GM5L2/55So44GZ44KLXHJcbiAgICAgICAgcHVibGljIF9hZGRMaW5lKF9saW5lOiBhbnksIGluc2VydFRvPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmVzOiBMaW5lUHJvZmlsZVtdID0gKF9saW5lIGluc3RhbmNlb2YgQXJyYXkpID8gPExpbmVQcm9maWxlW10+X2xpbmUgOiBbX2xpbmVdO1xyXG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyLCBuOiBudW1iZXI7XHJcbiAgICAgICAgICAgIGxldCBkZWx0YUhlaWdodCA9IDA7XHJcbiAgICAgICAgICAgIGxldCBhZGRUYWlsID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBpbnNlcnRUbykge1xyXG4gICAgICAgICAgICAgICAgaW5zZXJ0VG8gPSB0aGlzLl9saW5lcy5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpbnNlcnRUbyA9PT0gdGhpcy5fbGluZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBhZGRUYWlsID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gc2Nyb2xsIG1hcCDjga7mm7TmlrBcclxuICAgICAgICAgICAgZm9yIChpID0gMCwgbiA9IGxpbmVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZGVsdGFIZWlnaHQgKz0gbGluZXNbaV0uaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsTWFwSGVpZ2h0KGRlbHRhSGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIOaMv+WFpVxyXG4gICAgICAgICAgICBmb3IgKGkgPSBsaW5lcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGluZXMuc3BsaWNlKGluc2VydFRvLCAwLCBsaW5lc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHBhZ2Ug6Kit5a6a44Gu6Kej6ZmkXHJcbiAgICAgICAgICAgIGlmICghYWRkVGFpbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKDAgPT09IGluc2VydFRvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclBhZ2UoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobnVsbCAhPSB0aGlzLl9saW5lc1tpbnNlcnRUbyAtIDFdLnBhZ2VJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJQYWdlKHRoaXMuX2xpbmVzW2luc2VydFRvIC0gMV0ucGFnZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gb2Zmc2V0IOOBruWGjeioiOeul1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb2ZpbGVzKGluc2VydFRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ8gSXRlbSDjgpLliYrpmaRcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXIsIHNpemU/OiBudW1iZXIsIGRlbGF5PzogbnVtYmVyKTogdm9pZDtcclxuICAgICAgICByZW1vdmVJdGVtKGluZGV4OiBudW1iZXJbXSwgZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xyXG4gICAgICAgIHJlbW92ZUl0ZW0oaW5kZXg6IGFueSwgYXJnMj86IG51bWJlciwgYXJnMz86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlTGluZXMoaW5kZXgsIGFyZzIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlTGluZShpbmRleCwgYXJnMiwgYXJnMyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ8gTGluZVByb2ZpbGUg44KS5YmK6ZmkOiDpgKPntpogaW5kZXgg54mIXHJcbiAgICAgICAgcHVibGljIF9yZW1vdmVMaW5lKGluZGV4OiBudW1iZXIsIHNpemU/OiBudW1iZXIsIGRlbGF5PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHNpemUpIHtcclxuICAgICAgICAgICAgICAgIHNpemUgPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgdGhpcy5fbGluZXMubGVuZ3RoIDwgaW5kZXggKyBzaXplKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwibG9naWMgZXJyb3IuIHJlbW92ZUl0ZW0oKSwgaW52YWxpZCBpbmRleDogXCIgKyBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRlbGF5ID0gKG51bGwgIT0gZGVsYXkpID8gZGVsYXkgOiAwO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZDogTGluZVByb2ZpbGVbXSA9IFtdO1xyXG4gICAgICAgICAgICBsZXQgZGVsdGEgPSAwO1xyXG4gICAgICAgICAgICBsZXQgbWFwVHJhbnNpdGlvbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgLy8g5YmK6Zmk5YCZ6KOc44Go5aSJ5YyW6YeP44Gu566X5Ye6XHJcbiAgICAgICAgICAgICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBsZXQgbGluZTogTGluZVByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSB0aGlzLl9saW5lc1tpbmRleCArIGldO1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbHRhICs9IGxpbmUuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIOWJiumZpOimgee0oOOBriB6LWluZGV4IOOBruWIneacn+WMllxyXG4gICAgICAgICAgICAgICAgICAgIGxpbmUucmVzZXREZXB0aCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWQucHVzaChsaW5lKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIOiHquWLleioreWumuODu+WJiumZpOmBheW7tuaZgumWk+OBjOioreWumuOBleOCjOOBi+OBpOOAgeOCueOCr+ODreODvOODq+ODneOCuOOCt+ODp+ODs+OBq+WkieabtOOBjOOBguOCi+WgtOWQiOOBryB0cmFuc2l0aW9uIOioreWumlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLnJlbW92ZUl0ZW1XaXRoVHJhbnNpdGlvbiAmJiAoMCA8IGRlbGF5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmdldFNjcm9sbFBvcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc01heCA9IHRoaXMuZ2V0U2Nyb2xsUG9zTWF4KCkgLSBkZWx0YTtcclxuICAgICAgICAgICAgICAgICAgICBtYXBUcmFuc2l0aW9uID0gKHBvc01heCA8IGN1cnJlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICAgICAgLy8g5pu05pawXHJcbiAgICAgICAgICAgICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyB0cmFuc2l0aW9uIOioreWumlxyXG4gICAgICAgICAgICAgICAgaWYgKG1hcFRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHVwU2Nyb2xsTWFwVHJhbnNpdGlvbih0aGlzLl8kbWFwLCBkZWxheSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBwYWdlIOioreWumuOBruino+mZpFxyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gdGhpcy5fbGluZXNbaW5kZXhdLnBhZ2VJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJQYWdlKHRoaXMuX2xpbmVzW2luZGV4XS5wYWdlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8g44K544Kv44Ot44O844Or6aCY5Z+f44Gu5pu05pawXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVNjcm9sbE1hcEhlaWdodCgtZGVsdGEpO1xyXG4gICAgICAgICAgICAgICAgLy8g6YWN5YiX44GL44KJ5YmK6ZmkXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saW5lcy5zcGxpY2UoaW5kZXgsIHNpemUpO1xyXG4gICAgICAgICAgICAgICAgLy8gb2Zmc2V0IOOBruWGjeioiOeul1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9maWxlcyhpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAvLyDpgYXlu7bliYrpmaRcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWQuZm9yRWFjaCgobGluZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmluYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sIGRlbGF5KTtcclxuICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ8gTGluZVByb2ZpbGUg44KS5YmK6ZmkOiByYW5kb20gYWNjZXNzIOeJiFxyXG4gICAgICAgIHB1YmxpYyBfcmVtb3ZlTGluZXMoaW5kZXhlczogbnVtYmVyW10sIGRlbGF5PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGRlbGF5ID0gKG51bGwgIT0gZGVsYXkpID8gZGVsYXkgOiAwO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSBpbmRleGVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPCAwIHx8IHRoaXMuX2xpbmVzLmxlbmd0aCA8IGkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwibG9naWMgZXJyb3IuIHJlbW92ZUl0ZW0oKSwgaW52YWxpZCBpbmRleDogXCIgKyBpKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZWQ6IExpbmVQcm9maWxlW10gPSBbXTtcclxuICAgICAgICAgICAgbGV0IGRlbHRhID0gMDtcclxuICAgICAgICAgICAgbGV0IG1hcFRyYW5zaXRpb24gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIOWJiumZpOWAmeijnOOBqOWkieWMlumHj+OBrueul+WHulxyXG4gICAgICAgICAgICAoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IGxpbmU6IExpbmVQcm9maWxlO1xyXG4gICAgICAgICAgICAgICAgaW5kZXhlcy5mb3JFYWNoKChpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IHRoaXMuX2xpbmVzW2luZGV4XTtcclxuICAgICAgICAgICAgICAgICAgICBkZWx0YSArPSBsaW5lLmhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAvLyDliYrpmaTopoHntKDjga4gei1pbmRleCDjga7liJ3mnJ/ljJZcclxuICAgICAgICAgICAgICAgICAgICBsaW5lLnJlc2V0RGVwdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVkLnB1c2gobGluZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIOiHquWLleioreWumuODu+WJiumZpOmBheW7tuaZgumWk+OBjOioreWumuOBleOCjOOBi+OBpOOAgeOCueOCr+ODreODvOODq+ODneOCuOOCt+ODp+ODs+OBq+WkieabtOOBjOOBguOCi+WgtOWQiOOBryB0cmFuc2l0aW9uIOioreWumlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLnJlbW92ZUl0ZW1XaXRoVHJhbnNpdGlvbiAmJiAoMCA8IGRlbGF5KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnQgPSB0aGlzLmdldFNjcm9sbFBvcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc01heCA9IHRoaXMuZ2V0U2Nyb2xsUG9zTWF4KCkgLSBkZWx0YTtcclxuICAgICAgICAgICAgICAgICAgICBtYXBUcmFuc2l0aW9uID0gKHBvc01heCA8IGN1cnJlbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICAgICAgLy8g5pu05pawXHJcbiAgICAgICAgICAgICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyB0cmFuc2l0aW9uIOioreWumlxyXG4gICAgICAgICAgICAgICAgaWYgKG1hcFRyYW5zaXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldHVwU2Nyb2xsTWFwVHJhbnNpdGlvbih0aGlzLl8kbWFwLCBkZWxheSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpbmRleGVzLmZvckVhY2goKGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBwYWdlIOioreWumuOBruino+mZpFxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX2xpbmVzW2luZGV4XS5wYWdlSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jbGVhclBhZ2UodGhpcy5fbGluZXNbaW5kZXhdLnBhZ2VJbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIOmFjeWIl+OBi+OCieWJiumZpFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb2Zmc2V0IOOBruWGjeioiOeul1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvZmlsZXMoaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAvLyDjgrnjgq/jg63jg7zjg6vpoJjln5/jga7mm7TmlrBcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlU2Nyb2xsTWFwSGVpZ2h0KC1kZWx0YSk7XHJcbiAgICAgICAgICAgICAgICAvLyDpgYXlu7bliYrpmaRcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZWQuZm9yRWFjaCgobGluZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLmluYWN0aXZhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0sIGRlbGF5KTtcclxuICAgICAgICAgICAgfSkoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBzY3JvbGwgbWFwIOOBruODiOODqeODs+OCuOOCt+ODp+ODs+ioreWumlxyXG4gICAgICAgIHByaXZhdGUgc2V0dXBTY3JvbGxNYXBUcmFuc2l0aW9uKCRtYXA6IEpRdWVyeSwgZGVsYXk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2l0aW9uRW5kSGFuZGxlciA9IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAkbWFwLm9mZihfVXRpbHMudHJhbnNpdGlvbkVuZCk7XHJcbiAgICAgICAgICAgICAgICBfVXRpbHMuY2xlYXJUcmFuc2l0aW9ucygkbWFwKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5fJG1hcC5vbihfVXRpbHMudHJhbnNpdGlvbkVuZCwgdHJhbnNpdGlvbkVuZEhhbmRsZXIpO1xyXG4gICAgICAgICAgICBfVXRpbHMuc2V0VHJhbnNmb3Jtc1RyYW5zaXRpb25zKCRtYXAsIFwiaGVpZ2h0XCIsIGRlbGF5LCBcImVhc2VcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44GfIEl0ZW0g44Gr6Kit5a6a44GX44Gf5oOF5aCx44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBudW1iZXIpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBKUXVlcnkuRXZlbnQpOiBhbnk7XHJcbiAgICAgICAgZ2V0SXRlbUluZm8odGFyZ2V0OiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXg6IG51bWJlcjtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBhcnNlciA9ICgkdGFyZ2V0OiBKUXVlcnkpOiBudW1iZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKCR0YXJnZXQuaGFzQ2xhc3MoX0NvbmZpZy5MSVNUSVRFTV9CQVNFX0NMQVNTKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB+fiR0YXJnZXQuYXR0cihfQ29uZmlnLkRBVEFfQ09OVEFJTkVSX0lOREVYKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoJHRhcmdldC5oYXNDbGFzcyhfQ29uZmlnLlNDUk9MTF9NQVBfQ0xBU1MpIHx8ICR0YXJnZXQubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJjYW5ub3QgZGl0ZWN0IGxpbmUgZnJvbSBldmVudCBvYmplY3QuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcGFyc2VyKCR0YXJnZXQucGFyZW50KCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mICQuRXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gcGFyc2VyKCQodGFyZ2V0LmN1cnJlbnRUYXJnZXQpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0ID09PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IHRhcmdldDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJsb2dpYyBlcnJvci4gdW5zdXBwb3J0ZWQgYXJnIHR5cGUuIHR5cGU6IFwiICsgdHlwZW9mIHRhcmdldCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChpbmRleCA8IDAgfHwgdGhpcy5fbGluZXMubGVuZ3RoIDw9IGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwibG9naWMgZXJyb3IuIGludmFsaWQgcmFuZ2UuIGluZGV4OiBcIiArIGluZGV4KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fbGluZXNbaW5kZXhdLmluZm87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Ki44Kv44OG44Kj44OW44Oa44O844K444KS5pu05pawXHJcbiAgICAgICAgcmVmcmVzaCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgY29uc3QgdGFyZ2V0czogYW55ID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IHNlYXJjaENvdW50ID0gdGhpcy5fc2V0dGluZ3MucGFnZVByZXBhcmVDb3VudCArIHRoaXMuX3NldHRpbmdzLnBhZ2VQcmVsb2FkQ291bnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYWdlSW5kZXggPSB0aGlzLmdldFBhZ2VJbmRleCgpO1xyXG4gICAgICAgICAgICBjb25zdCBoaWdoUHJpb3JpdHlJbmRleDogbnVtYmVyW10gPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9sZEV4c2lzdFBhZ2UgPSBfLmZpbHRlcih0aGlzLl9wYWdlcywgKHBhZ2U6IFBhZ2VQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJpbmFjdGl2ZVwiICE9PSBwYWdlLnN0YXR1cztcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjaGFuZ2VTdGF0ZSA9IChpbmRleDogbnVtYmVyKTogdm9pZCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IGN1cnJlbnRQYWdlSW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRzW2luZGV4XSA9IFwiYWN0aXZhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICBoaWdoUHJpb3JpdHlJbmRleC5wdXNoKGluZGV4KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoX1V0aWxzLmFicyhjdXJyZW50UGFnZUluZGV4IC0gaW5kZXgpIDw9IHRoaXMuX3NldHRpbmdzLnBhZ2VQcmVwYXJlQ291bnQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRzW2luZGV4XSA9IFwiYWN0aXZhdGVcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3NldHRpbmdzLmVuYWJsZUhpZGRlblBhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0c1tpbmRleF0gPSBcImhpZGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRzW2luZGV4XSA9IFwiYWN0aXZhdGVcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBjdXJyZW50IHBhZ2Ug44GuIOWJjeW+jOOBryBoaWdoIHByaW9yaXR5IOOBq+OBmeOCi1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRQYWdlSW5kZXggKyAxID09PSBpbmRleCB8fCBjdXJyZW50UGFnZUluZGV4IC0gMSA9PT0gaW5kZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBoaWdoUHJpb3JpdHlJbmRleC5wdXNoKGluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIC8vIOWvvuixoeeEoeOBl1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbGluZXMubGVuZ3RoIDw9IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICAgICAgICAgIGxldCBwYWdlSW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IG92ZXJmbG93UHJldiA9IDAsIG92ZXJmbG93TmV4dCA9IDA7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiZWdpbkluZGV4ID0gY3VycmVudFBhZ2VJbmRleCAtIHNlYXJjaENvdW50O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZW5kSW5kZXggPSBjdXJyZW50UGFnZUluZGV4ICsgc2VhcmNoQ291bnQ7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHBhZ2VJbmRleCA9IGJlZ2luSW5kZXg7IHBhZ2VJbmRleCA8PSBlbmRJbmRleDsgcGFnZUluZGV4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFnZUluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdmVyZmxvd1ByZXYrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wYWdlcy5sZW5ndGggPD0gcGFnZUluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG92ZXJmbG93TmV4dCsrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY2hhbmdlU3RhdGUocGFnZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoMCA8IG92ZXJmbG93UHJldikge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIHBhZ2VJbmRleCA9IGN1cnJlbnRQYWdlSW5kZXggKyBzZWFyY2hDb3VudCArIDE7IGkgPCBvdmVyZmxvd1ByZXY7IGkrKyAsIHBhZ2VJbmRleCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9wYWdlcy5sZW5ndGggPD0gcGFnZUluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTdGF0ZShwYWdlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoMCA8IG92ZXJmbG93TmV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIHBhZ2VJbmRleCA9IGN1cnJlbnRQYWdlSW5kZXggLSBzZWFyY2hDb3VudCAtIDE7IGkgPCBvdmVyZmxvd05leHQ7IGkrKyAsIHBhZ2VJbmRleC0tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwYWdlSW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VTdGF0ZShwYWdlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIOS4jeimgeOBq+OBquOBo+OBnyBwYWdlIOOBriBpbmFjdGl2YXRlXHJcbiAgICAgICAgICAgIG9sZEV4c2lzdFBhZ2UuZm9yRWFjaCgocGFnZTogUGFnZVByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gcGFnZS5pbmRleDtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsID09IHRhcmdldHNbaW5kZXhdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZS5pbmFjdGl2YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8g5YSq5YWIIHBhZ2Ug44GuIGFjdGl2YXRlXHJcbiAgICAgICAgICAgIGhpZ2hQcmlvcml0eUluZGV4XHJcbiAgICAgICAgICAgICAgICAuc29ydCgobGhzOiBudW1iZXIsIHJoczogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxocyA8IHJocykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsaHMgPiByaHMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFnZXNbaW5kZXhdICYmIHRoaXMuX3BhZ2VzW2luZGV4XS5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSwgMCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIOOBneOBruOBu+OBi+OBriBwYWdlIOOBriDnirbmhYvlpInmm7RcclxuICAgICAgICAgICAgXy5lYWNoKHRhcmdldHMsIChhY3Rpb246IHN0cmluZywga2V5OiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IH5+a2V5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2ggKGFjdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImFjdGl2YXRlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFnZXNbaW5kZXhdICYmIHRoaXMuX3BhZ2VzW2luZGV4XS5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBcImhpZGVcIjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9wYWdlc1tpbmRleF0gJiYgdGhpcy5fcGFnZXNbaW5kZXhdLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpbmFjdGl2YXRlXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5leHBlY3RlZCBvcGVyYXRpb246IGluYWN0aXZhdGVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVua25vd24gb3BlcmF0aW9uOiBcIiArIHRhcmdldHNba2V5XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyDmm7TmlrDlvozjgavkvb/nlKjjgZfjgarjgYvjgaPjgZ8gRE9NIOOCkuWJiumZpFxyXG4gICAgICAgICAgICB0aGlzLmZpbmRSZWN5Y2xlRWxlbWVudHMoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RBY3RpdmVQYWdlQ29udGV4dC5mcm9tID0gdGhpcy5fcGFnZXNbY3VycmVudFBhZ2VJbmRleF0uZ2V0TGluZVByb2ZpbGVGaXJzdCgpID9cclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2VzW2N1cnJlbnRQYWdlSW5kZXhdLmdldExpbmVQcm9maWxlRmlyc3QoKS5pbmRleCA6IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX2xhc3RBY3RpdmVQYWdlQ29udGV4dC50byA9IHRoaXMuX3BhZ2VzW2N1cnJlbnRQYWdlSW5kZXhdLmdldExpbmVQcm9maWxlTGFzdCgpID9cclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhZ2VzW2N1cnJlbnRQYWdlSW5kZXhdLmdldExpbmVQcm9maWxlTGFzdCgpLmluZGV4IDogMDtcclxuICAgICAgICAgICAgdGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LmluZGV4ID0gY3VycmVudFBhZ2VJbmRleDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmnKrjgqLjgrXjgqTjg7Pjg5rjg7zjgrjjgpLmp4vnr4lcclxuICAgICAgICB1cGRhdGUoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fcGFnZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLmFzc2lnblBhZ2UoaW5kZXgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5rjg7zjgrjjgqLjgrXjgqTjg7PjgpLlho3mp4vmiJBcclxuICAgICAgICByZWJ1aWxkKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyUGFnZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmFzc2lnblBhZ2UoKTtcclxuICAgICAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg566h6L2E44OH44O844K/44KS56C05qOEXHJcbiAgICAgICAgcmVsZWFzZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fbGluZXMuZm9yRWFjaCgobGluZTogTGluZVByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGxpbmUuaW5hY3RpdmF0ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fcGFnZXMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5fbGluZXMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuXyRtYXApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcEhlaWdodCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kbWFwLmhlaWdodCgwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgQmFja3VwIC8gUmVzdG9yZVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44OQ44OD44Kv44Ki44OD44OXXHJcbiAgICAgICAgYmFja3VwKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHRoaXMuX2JhY2t1cFtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9iYWNrdXBba2V5XSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5lczogdGhpcy5fbGluZXMsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODquOCueODiOOColxyXG4gICAgICAgIHJlc3RvcmUoa2V5OiBzdHJpbmcsIHJlYnVpbGQ6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHRoaXMuX2JhY2t1cFtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKDAgPCB0aGlzLl9saW5lcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9hZGRMaW5lKHRoaXMuX2JhY2t1cFtrZXldLmxpbmVzKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChyZWJ1aWxkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlYnVpbGQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gu5pyJ54ShXHJcbiAgICAgICAgaGFzQmFja3VwKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX2JhY2t1cFtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODkOODg+OCr+OCouODg+ODl+ODh+ODvOOCv+OBruegtOajhFxyXG4gICAgICAgIGNsZWFyQmFja3VwKGtleT86IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2JhY2t1cCA9IHt9O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobnVsbCAhPSB0aGlzLl9iYWNrdXBba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2JhY2t1cFtrZXldO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jgavjgqLjgq/jgrvjgrlcclxuICAgICAgICBnZXQgYmFja3VwRGF0YSgpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYmFja3VwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgU2Nyb2xsXHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgc2V0U2Nyb2xsSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Njcm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob24pIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxlci5vbihcInNjcm9sbFwiLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIub2ZmKFwic2Nyb2xsXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or57WC5LqG44Kk44OZ44Oz44OI44OP44Oz44OJ44Op6Kit5a6aL+ino+mZpFxyXG4gICAgICAgIHNldFNjcm9sbFN0b3BIYW5kbGVyKGhhbmRsZXI6IChldmVudDogSlF1ZXJ5LkV2ZW50KSA9PiB2b2lkLCBvbjogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2Nyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLm9uKFwic2Nyb2xsc3RvcFwiLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsZXIub2ZmKFwic2Nyb2xsc3RvcFwiLCBoYW5kbGVyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+S9jee9ruOCkuWPluW+l1xyXG4gICAgICAgIGdldFNjcm9sbFBvcygpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsZXIgPyB0aGlzLl9zY3JvbGxlci5nZXRQb3MoKSA6IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44K544Kv44Ot44O844Or5L2N572u44Gu5pyA5aSn5YCk44KS5Y+W5b6XXHJcbiAgICAgICAgZ2V0U2Nyb2xsUG9zTWF4KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxlciA/IHRoaXMuX3Njcm9sbGVyLmdldFBvc01heCgpIDogMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Njcm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocG9zIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImludmFsaWQgcG9zaXRpb24sIHRvbyBzbWFsbC4gW3BvczogXCIgKyBwb3MgKyBcIl1cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gMDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fc2Nyb2xsZXIuZ2V0UG9zTWF4KCkgPCBwb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJpbnZhbGlkIHBvc2l0aW9uLCB0b28gYmlnLiBbcG9zOiBcIiArIHBvcyArIFwiXVwiKTtcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSB0aGlzLl9zY3JvbGxlci5nZXRQb3NNYXgoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHBvcyDjga7jgb/lhYjpp4bjgZHjgabmm7TmlrBcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xhc3RBY3RpdmVQYWdlQ29udGV4dC5wb3MgPSBwb3M7XHJcbiAgICAgICAgICAgICAgICBpZiAocG9zICE9PSB0aGlzLl9zY3JvbGxlci5nZXRQb3MoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLnNjcm9sbFRvKHBvcywgYW5pbWF0ZSwgdGltZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZXjgozjgZ8gTGlzdEl0ZW1WaWV3IOOBruihqOekuuOCkuS/neiovFxyXG4gICAgICAgIGVuc3VyZVZpc2libGUoaW5kZXg6IG51bWJlciwgb3B0aW9ucz86IEVuc3VyZVZpc2libGVPcHRpb25zKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDAgfHwgdGhpcy5fbGluZXMubGVuZ3RoIDw9IGluZGV4KSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oVEFHICsgXCJlbnN1cmVWaXNpYmxlKCksIGludmFsaWQgaW5kZXgsIG5vb3AuIFtpbmRleDogXCIgKyBpbmRleCArIFwiXVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICghdGhpcy5fc2Nyb2xsZXIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInNjcm9sbGVyIGlzIG5vdCByZWFkeS5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLl9saW5lc1tpbmRleF07XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdE9wdGlvbnM6IEVuc3VyZVZpc2libGVPcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpYWxPSzogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBzZXRUb3A6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGFuaW1hdGU6IHRoaXMuX3NldHRpbmdzLmVuYWJsZUFuaW1hdGlvbixcclxuICAgICAgICAgICAgICAgICAgICB0aW1lOiB0aGlzLl9zZXR0aW5ncy5hbmltYXRpb25EdXJhdGlvbixcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogKCk6IHZvaWQgPT4geyAvKiBub29wICovIH0sXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3BlcmF0aW9uOiBFbnN1cmVWaXNpYmxlT3B0aW9ucyA9ICQuZXh0ZW5kKHt9LCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFNjb3BlID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGZyb206IHRoaXMuX3Njcm9sbGVyLmdldFBvcygpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvOiB0aGlzLl9zY3JvbGxlci5nZXRQb3MoKSArIHRoaXMuX2Jhc2VIZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0U2NvcGUgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogdGFyZ2V0Lm9mZnNldCxcclxuICAgICAgICAgICAgICAgICAgICB0bzogdGFyZ2V0Lm9mZnNldCArIHRhcmdldC5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzSW5TY29wZSA9ICgpOiBib29sZWFuID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uLnBhcnRpYWxPSykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGFyZ2V0U2NvcGUuZnJvbSA8PSBjdXJyZW50U2NvcGUuZnJvbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTY29wZS5mcm9tIDw9IHRhcmdldFNjb3BlLnRvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRTY29wZS5mcm9tIDw9IGN1cnJlbnRTY29wZS50bykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFNjb3BlLmZyb20gPD0gdGFyZ2V0U2NvcGUuZnJvbSAmJiB0YXJnZXRTY29wZS50byA8PSBjdXJyZW50U2NvcGUudG8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZXRlY3RQb3NpdGlvbiA9ICgpOiBudW1iZXIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0YXJnZXRTY29wZS5mcm9tIDwgY3VycmVudFNjb3BlLmZyb20pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldFNjb3BlLmZyb207XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjdXJyZW50U2NvcGUuZnJvbSA8IHRhcmdldFNjb3BlLmZyb20pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldC5vZmZzZXQgLSB0YXJnZXQuaGVpZ2h0OyAvLyBib3R0b20g5ZCI44KP44Gb44Gv5oOF5aCx5LiN6Laz44Gr44KI44KK5LiN5Y+vXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwibG9naWMgZXJyb3IuXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIGxldCBwb3M6IG51bWJlcjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uLnNldFRvcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHRhcmdldFNjb3BlLmZyb207XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGlzSW5TY29wZSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gbm9vcC5cclxuICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb24uY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IGRldGVjdFBvc2l0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8g6KOc5q2jXHJcbiAgICAgICAgICAgICAgICBpZiAocG9zIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3Njcm9sbGVyLmdldFBvc01heCgpIDwgcG9zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gdGhpcy5fc2Nyb2xsZXIuZ2V0UG9zTWF4KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChvcGVyYXRpb24uY2FsbGJhY2ssIG9wZXJhdGlvbi50aW1lKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8ocG9zLCBvcGVyYXRpb24uYW5pbWF0ZSwgb3BlcmF0aW9uLnRpbWUpO1xyXG4gICAgICAgICAgICB9KSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBpbXBsZW1lbnRzOiBJTGlzdFZpZXdGcmFtZXdvcms6XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGwgTWFwIOOBrumrmOOBleOCkuWPluW+l1xyXG4gICAgICAgIGdldFNjcm9sbE1hcEhlaWdodCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fJG1hcCA/IHRoaXMuX21hcEhlaWdodCA6IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgU2Nyb2xsIE1hcCDjga7pq5jjgZXjgpLmm7TmlrAuIGZyYW1ld29yayDjgYzkvb/nlKjjgZnjgosuXHJcbiAgICAgICAgdXBkYXRlU2Nyb2xsTWFwSGVpZ2h0KGRlbHRhOiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuXyRtYXApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hcEhlaWdodCArPSBkZWx0YTtcclxuICAgICAgICAgICAgICAgIC8vIGZvciBmYWlsIHNhZmUuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWFwSGVpZ2h0IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21hcEhlaWdodCA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl8kbWFwLmhlaWdodCh0aGlzLl9tYXBIZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOoIFByb2ZpbGUg44Gu5pu05pawLiBmcmFtZXdvcmsg44GM5L2/55So44GZ44KLLlxyXG4gICAgICAgIHVwZGF0ZVByb2ZpbGVzKGZyb206IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyLCBuOiBudW1iZXI7XHJcbiAgICAgICAgICAgIGxldCBsYXN0OiBMaW5lUHJvZmlsZTtcclxuICAgICAgICAgICAgZm9yIChpID0gZnJvbSwgbiA9IHRoaXMuX2xpbmVzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKDAgPCBpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdCA9IHRoaXMuX2xpbmVzW2kgLSAxXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW5lc1tpXS5pbmRleCA9IGxhc3QuaW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzW2ldLm9mZnNldCA9IGxhc3Qub2Zmc2V0ICsgbGFzdC5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2xpbmVzW2ldLmluZGV4ID0gMDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9saW5lc1tpXS5vZmZzZXQgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgU2Nyb2xsIE1hcCBFbGVtZW50IOOCkuWPluW+ly4gZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCiy5cclxuICAgICAgICBnZXRTY3JvbGxNYXBFbGVtZW50KCk6IEpRdWVyeSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl8kbWFwIHx8ICQoXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44Oq44K144Kk44Kv44Or5Y+v6IO944GqIEVsZW1lbnQg44KS5Y+W5b6XLiBmcmFtZXdvcmsg44GM5L2/55So44GZ44KLLlxyXG4gICAgICAgIGZpbmRSZWN5Y2xlRWxlbWVudHMoKTogSlF1ZXJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuXyRtYXAgPyB0aGlzLl8kbWFwLmZpbmQoX0NvbmZpZy5SRUNZQ0xFX0NMQVNTX1NFTEVDVE9SKSA6ICQoXCJcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgTGlzdFZpZXdPcHRpb25zIOOCkuWPluW+ly4gZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCiy5cclxuICAgICAgICBnZXRMaXN0Vmlld09wdGlvbnMoKTogTGlzdFZpZXdPcHRpb25zIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NldHRpbmdzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBwcml2YXRlIG1ldGhvZDpcclxuXHJcbiAgICAgICAgLy8hIFNjcm9sbGVyIOeUqOeSsOWig+ioreWumlxyXG4gICAgICAgIHByaXZhdGUgc2V0U2Nyb2xsZXJDb25kaXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLm9uKFwic2Nyb2xsXCIsIHRoaXMuX3Njcm9sbEV2ZW50SGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLm9uKFwic2Nyb2xsc3RvcFwiLCB0aGlzLl9zY3JvbGxTdG9wRXZlbnRIYW5kbGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBTY3JvbGxlciDnlKjnkrDlooPnoLTmo4RcclxuICAgICAgICBwcml2YXRlIHJlc2V0U2Nyb2xsZXJDb25kaXRpb24oKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLm9mZihcInNjcm9sbHN0b3BcIiwgdGhpcy5fc2Nyb2xsU3RvcEV2ZW50SGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGVyLm9mZihcInNjcm9sbFwiLCB0aGlzLl9zY3JvbGxFdmVudEhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaXouWumuOBriBTY3JvbGxlciDjgqrjg5bjgrjjgqfjgq/jg4jjga7kvZzmiJBcclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVNjcm9sbGVyKCk6IElTY3JvbGxlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zZXR0aW5ncy5zY3JvbGxlckZhY3RvcnkodGhpcy5fJHJvb3RbMF0sIHRoaXMuX3NldHRpbmdzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDnj77lnKjjga4gUGFnZSBJbmRleCDjgpLlj5blvpdcclxuICAgICAgICBwcml2YXRlIGdldFBhZ2VJbmRleCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICBsZXQgaTogbnVtYmVyLCBuOiBudW1iZXI7XHJcbiAgICAgICAgICAgIGxldCBwYWdlOiBQYWdlUHJvZmlsZTtcclxuICAgICAgICAgICAgbGV0IGNhbmRpZGF0ZTogbnVtYmVyO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsUG9zID0gdGhpcy5fc2Nyb2xsZXIgPyB0aGlzLl9zY3JvbGxlci5nZXRQb3MoKSA6IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFBvc01heCA9IHRoaXMuX3Njcm9sbGVyID8gdGhpcy5fc2Nyb2xsZXIuZ2V0UG9zTWF4KCkgOiAwO1xyXG4gICAgICAgICAgICBjb25zdCBzY3JvbGxNYXBTaXplID0gKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RQYWdlID0gdGhpcy5nZXRMYXN0UGFnZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gbGFzdFBhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFBhZ2Uub2Zmc2V0ICsgbGFzdFBhZ2UuaGVpZ2h0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fYmFzZUhlaWdodDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9ICgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoMCA9PT0gc2Nyb2xsUG9zTWF4IHx8IHNjcm9sbFBvc01heCA8PSB0aGlzLl9iYXNlSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY3JvbGxQb3MgKiBzY3JvbGxNYXBTaXplIC8gc2Nyb2xsUG9zTWF4O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdmFsaWRSYW5nZSA9IChfcGFnZTogUGFnZVByb2ZpbGUpOiBib29sZWFuID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChudWxsID09IF9wYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChfcGFnZS5vZmZzZXQgPD0gcG9zICYmIHBvcyA8PSBfcGFnZS5vZmZzZXQgKyBfcGFnZS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2Jhc2VIZWlnaHQgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImludmFsaWQgYmFzZSBoZWlnaHQ6IFwiICsgdGhpcy5fYmFzZUhlaWdodCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FuZGlkYXRlID0gTWF0aC5mbG9vcihwb3MgLyB0aGlzLl9iYXNlSGVpZ2h0KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3BhZ2VzLmxlbmd0aCA8PSBjYW5kaWRhdGUpIHtcclxuICAgICAgICAgICAgICAgIGNhbmRpZGF0ZSA9IHRoaXMuX3BhZ2VzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHBhZ2UgPSB0aGlzLl9wYWdlc1tjYW5kaWRhdGVdO1xyXG4gICAgICAgICAgICBpZiAodmFsaWRSYW5nZShwYWdlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UuaW5kZXg7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAocG9zIDwgcGFnZS5vZmZzZXQpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IGNhbmRpZGF0ZSAtIDE7IGkgPj0gMDsgaS0tKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZSA9IHRoaXMuX3BhZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZFJhbmdlKHBhZ2UpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwYWdlLmluZGV4O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcInVua25vd24gcGFnZSBpbmRleC5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IGNhbmRpZGF0ZSArIDEsIG4gPSB0aGlzLl9wYWdlcy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlID0gdGhpcy5fcGFnZXNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkUmFuZ2UocGFnZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhZ2UuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFRBRyArIFwidW5rbm93biBwYWdlIGluZGV4LlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9wYWdlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrnjgq/jg63jg7zjg6vjgqTjg5njg7Pjg4hcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBwb3Mge051bWJlcn0gW2luXSDjgrnjgq/jg63jg7zjg6vjg53jgrjjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIG9uU2Nyb2xsKHBvczogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9hY3RpdmUgJiYgMCA8IHRoaXMuX3BhZ2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudFBhZ2VJbmRleCA9IHRoaXMuZ2V0UGFnZUluZGV4KCk7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiDoqr/mlbRcclxuICAgICAgICAgICAgICAgIGlmIChfVXRpbHMuYWJzKHBvcyAtIHRoaXMuX2xhc3RBY3RpdmVQYWdlQ29udGV4dC5wb3MpIDwgdGhpcy5fc2V0dGluZ3Muc2Nyb2xsUmVmcmVzaERpc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xhc3RBY3RpdmVQYWdlQ29udGV4dC5pbmRleCAhPT0gY3VycmVudFBhZ2VJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9sYXN0QWN0aXZlUGFnZUNvbnRleHQucG9zID0gcG9zO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrnjgq/jg63jg7zjg6vlgZzmraLjgqTjg5njg7Pjg4hcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBwb3Mge051bWJlcn0gW2luXSDjgrnjgq/jg63jg7zjg6vjg53jgrjjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcml2YXRlIG9uU2Nyb2xsU3RvcChwb3M6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fYWN0aXZlICYmIDAgPCB0aGlzLl9wYWdlcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYWdlSW5kZXggPSB0aGlzLmdldFBhZ2VJbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2xhc3RBY3RpdmVQYWdlQ29udGV4dC5pbmRleCAhPT0gY3VycmVudFBhZ2VJbmRleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdEFjdGl2ZVBhZ2VDb250ZXh0LnBvcyA9IHBvcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOacgOW+jOOBruODmuODvOOCuOOCkuWPluW+l1xyXG4gICAgICAgIHByaXZhdGUgZ2V0TGFzdFBhZ2UoKTogUGFnZVByb2ZpbGUge1xyXG4gICAgICAgICAgICBpZiAoMCA8IHRoaXMuX3BhZ2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2VzW3RoaXMuX3BhZ2VzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODmuODvOOCuOWMuuWIhuOBruOCouOCteOCpOODs1xyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGZyb20ge051bWJlcn0gW2luXSBwYWdlIGluZGV4IOOCkuaMh+WumlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByaXZhdGUgYXNzaWduUGFnZShmcm9tPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIGxldCBpOiBudW1iZXIsIG46IG51bWJlcjtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gZnJvbSkge1xyXG4gICAgICAgICAgICAgICAgZnJvbSA9IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFyUGFnZShmcm9tKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIGxldCBsaW5lSW5kZXggPSAwO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxhc3RQYWdlID0gdGhpcy5nZXRMYXN0UGFnZSgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGxhc3RMaW5lOiBMaW5lUHJvZmlsZTtcclxuICAgICAgICAgICAgICAgIGxldCB0ZW1wUGFnZTogUGFnZVByb2ZpbGU7XHJcbiAgICAgICAgICAgICAgICBpZiAobnVsbCA9PSBsYXN0UGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RQYWdlID0gbmV3IFBhZ2VQcm9maWxlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFnZXMucHVzaChsYXN0UGFnZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RMaW5lID0gbGFzdFBhZ2UuZ2V0TGluZVByb2ZpbGVMYXN0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG51bGwgIT0gbGFzdExpbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZUluZGV4ID0gbGFzdExpbmUuaW5kZXggKyAxO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBhc2lnbmVlID0gdGhpcy5fbGluZXMuc2xpY2UobGluZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIG4gPSBhc2lnbmVlLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9iYXNlSGVpZ2h0IDw9IGxhc3RQYWdlLmhlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0UGFnZS5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcFBhZ2UgPSBsYXN0UGFnZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcFBhZ2UgPSBuZXcgUGFnZVByb2ZpbGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcFBhZ2UuaW5kZXggPSBsYXN0UGFnZS5pbmRleCArIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBQYWdlLm9mZnNldCA9IGxhc3RQYWdlLm9mZnNldCArIGxhc3RQYWdlLmhlaWdodDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2UgPSB0ZW1wUGFnZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFnZXMucHVzaChsYXN0UGFnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGFzaWduZWVbaV0ucGFnZUluZGV4ID0gbGFzdFBhZ2UuaW5kZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFBhZ2UucHVzaChhc2lnbmVlW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxhc3RQYWdlLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICB9KSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Njcm9sbGVyKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxlci51cGRhdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Oa44O844K45Yy65YiG44Gu6Kej6ZmkXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gZnJvbSB7TnVtYmVyfSBbaW5dIHBhZ2UgaW5kZXgg44KS5oyH5a6aXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJpdmF0ZSBjbGVhclBhZ2UoZnJvbT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBmcm9tKSB7XHJcbiAgICAgICAgICAgICAgICBmcm9tID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9wYWdlcyA9IHRoaXMuX3BhZ2VzLnNsaWNlKDAsIGZyb20pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQLlVJIHtcclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuVUkuTGlzdFZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnNcclxuICAgICAqIEBicmllZiBMaXN0VmlldyDjgbjjga7liJ3mnJ/ljJbmg4XloLHjgpLmoLzntI3jgZnjgovjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsIGV4dGVuZHMgQmFja2JvbmUuTW9kZWwgPSBCYWNrYm9uZS5Nb2RlbD5cclxuICAgICAgICBleHRlbmRzIExpc3RWaWV3T3B0aW9ucywgQmFja2JvbmUuVmlld09wdGlvbnM8VE1vZGVsPiB7XHJcbiAgICAgICAgJGVsPzogSlF1ZXJ5O1xyXG4gICAgICAgIGluaXRpYWxIZWlnaHQ/OiBudW1iZXI7ICAgIC8vITwg6auY44GV44Gu5Yid5pyf5YCkXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAY2xhc3MgTGlzdFZpZXdcclxuICAgICAqIEBicmllZiDjg6Hjg6Ljg6rnrqHnkIbmqZ/og73jgpLmj5DkvpvjgZnjgovku67mg7Pjg6rjgrnjg4jjg5Pjg6Xjg7zjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIExpc3RWaWV3PFRNb2RlbCBleHRlbmRzIEJhY2tib25lLk1vZGVsID0gQmFja2JvbmUuTW9kZWw+XHJcbiAgICAgICAgZXh0ZW5kcyBCYWNrYm9uZS5WaWV3PFRNb2RlbD4gaW1wbGVtZW50cyBJTGlzdFZpZXcsIElDb21wb3NhYmxlVmlldyB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3Njcm9sbE1ncjogU2Nyb2xsTWFuYWdlciA9IG51bGw7ICAgIC8vITwgc2Nyb2xsIOOCs+OCouODreOCuOODg+OCr1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0xpc3RWaWV3Q29uc3RydWN0T3B0aW9uc30gW2luXSDjgqrjg5fjgrfjg6fjg7NcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3RvcihvcHRpb25zPzogTGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zPFRNb2RlbD4pIHtcclxuICAgICAgICAgICAgc3VwZXIob3B0aW9ucyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdCA9IG9wdGlvbnMgfHwge307XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nciA9IG5ldyBTY3JvbGxNYW5hZ2VyKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICBpZiAob3B0LiRlbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVsZWdhdGVzID0gKDxhbnk+dGhpcykuZXZlbnRzID8gdHJ1ZSA6IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRFbGVtZW50KG9wdC4kZWwsIGRlbGVnYXRlcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBvcHQuaW5pdGlhbEhlaWdodCB8fCB0aGlzLiRlbC5oZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5pbml0aWFsaXplKHRoaXMuJGVsLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIE92ZXJyaWRlOiBCYWNrYm9uZS5WaWV3XHJcblxyXG4gICAgICAgIC8vISDlr77osaEgZWxlbWVudCDjga7oqK3lrppcclxuICAgICAgICBzZXRFbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50LCBkZWxlZ2F0ZT86IGJvb2xlYW4pOiBCYWNrYm9uZS5WaWV3PFRNb2RlbD47XHJcbiAgICAgICAgc2V0RWxlbWVudChlbGVtZW50OiBKUXVlcnksIGRlbGVnYXRlPzogYm9vbGVhbik6IEJhY2tib25lLlZpZXc8VE1vZGVsPjtcclxuICAgICAgICBzZXRFbGVtZW50KGVsZW1lbnQ6IGFueSwgZGVsZWdhdGU/OiBib29sZWFuKTogQmFja2JvbmUuVmlldzxUTW9kZWw+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Njcm9sbE1ncikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgJGVsID0gJChlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuaW5pdGlhbGl6ZSgkZWwsICRlbC5oZWlnaHQoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnNldEVsZW1lbnQoZWxlbWVudCwgZGVsZWdhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOegtOajhFxyXG4gICAgICAgIHJlbW92ZSgpOiBCYWNrYm9uZS5WaWV3PFRNb2RlbD4ge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIucmVtb3ZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9maWxlIOeuoeeQhlxyXG5cclxuICAgICAgICAvLyEg5Yid5pyf5YyW5riI44G/44GL5Yik5a6aXHJcbiAgICAgICAgaXNJbml0aWFsaXplZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5pc0luaXRpYWxpemVkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OX44Ot44OR44OG44Kj44KS5oyH5a6a44GX44Gm44CBTGluZVByb2ZpbGUg44KS566h55CGXHJcbiAgICAgICAgYWRkSXRlbShcclxuICAgICAgICAgICAgaGVpZ2h0OiBudW1iZXIsXHJcbiAgICAgICAgICAgIGluaXRpYWxpemVyOiBuZXcgKG9wdGlvbnM/OiBhbnkpID0+IEJhc2VMaXN0SXRlbVZpZXcsXHJcbiAgICAgICAgICAgIGluZm86IGFueSxcclxuICAgICAgICAgICAgaW5zZXJ0VG8/OiBudW1iZXJcclxuICAgICAgICApOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fYWRkTGluZShuZXcgTGluZVByb2ZpbGUodGhpcy5fc2Nyb2xsTWdyLCBNYXRoLmZsb29yKGhlaWdodCksIGluaXRpYWxpemVyLCBpbmZvKSwgaW5zZXJ0VG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOaMh+WumuOBl+OBnyBJdGVtIOOCkuWJiumZpFxyXG4gICAgICAgIHJlbW92ZUl0ZW0oaW5kZXg6IG51bWJlciwgc2l6ZT86IG51bWJlciwgZGVsYXk/OiBudW1iZXIpOiB2b2lkO1xyXG4gICAgICAgIHJlbW92ZUl0ZW0oaW5kZXg6IG51bWJlcltdLCBkZWxheT86IG51bWJlcik6IHZvaWQ7XHJcbiAgICAgICAgcmVtb3ZlSXRlbShpbmRleDogYW55LCBhcmcyPzogbnVtYmVyLCBhcmczPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5yZW1vdmVJdGVtKGluZGV4LCBhcmcyLCBhcmczKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ8gSXRlbSDjgavoqK3lrprjgZfjgZ/mg4XloLHjgpLlj5blvpdcclxuICAgICAgICBnZXRJdGVtSW5mbyh0YXJnZXQ6IG51bWJlcik6IGFueTtcclxuICAgICAgICBnZXRJdGVtSW5mbyh0YXJnZXQ6IEpRdWVyeS5FdmVudCk6IGFueTtcclxuICAgICAgICBnZXRJdGVtSW5mbyh0YXJnZXQ6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuZ2V0SXRlbUluZm8odGFyZ2V0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgqLjgq/jg4bjgqPjg5bjg5rjg7zjgrjjgpLmm7TmlrBcclxuICAgICAgICByZWZyZXNoKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IucmVmcmVzaCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOacquOCouOCteOCpOODs+ODmuODvOOCuOOCkuani+eviVxyXG4gICAgICAgIHVwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnVwZGF0ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOODmuODvOOCuOOCouOCteOCpOODs+OCkuWGjeani+aIkFxyXG4gICAgICAgIHJlYnVpbGQoKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5yZWJ1aWxkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg566h6L2E44OH44O844K/44KS56C05qOEXHJcbiAgICAgICAgcmVsZWFzZSgpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnJlbGVhc2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gSW1wbGVtZW50czogSUxpc3RWaWV3IFByb2ZpbGUgQmFja3VwIC8gUmVzdG9yZVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44OQ44OD44Kv44Ki44OD44OXXHJcbiAgICAgICAgYmFja3VwKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuYmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5YaF6YOo44OH44O844K/44KS44Oq44K544OI44KiXHJcbiAgICAgICAgcmVzdG9yZShrZXk6IHN0cmluZywgcmVidWlsZDogYm9vbGVhbiA9IHRydWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5yZXN0b3JlKGtleSwgcmVidWlsZCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gu5pyJ54ShXHJcbiAgICAgICAgaGFzQmFja3VwKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuaGFzQmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gu56C05qOEXHJcbiAgICAgICAgY2xlYXJCYWNrdXAoa2V5Pzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxNZ3IuY2xlYXJCYWNrdXAoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jgavjgqLjgq/jgrvjgrlcclxuICAgICAgICBnZXQgYmFja3VwRGF0YSgpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyID8gdGhpcy5fc2Nyb2xsTWdyLmJhY2t1cERhdGEgOiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgU2Nyb2xsXHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6noqK3lrpov6Kej6ZmkXHJcbiAgICAgICAgc2V0U2Nyb2xsSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldFNjcm9sbEhhbmRsZXIoaGFuZGxlciwgb24pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOCueOCr+ODreODvOODq+e1guS6huOCpOODmeODs+ODiOODj+ODs+ODieODqeioreWumi/op6PpmaRcclxuICAgICAgICBzZXRTY3JvbGxTdG9wSGFuZGxlcihoYW5kbGVyOiAoZXZlbnQ6IEpRdWVyeS5FdmVudCkgPT4gdm9pZCwgb246IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNldFNjcm9sbFN0b3BIYW5kbGVyKGhhbmRsZXIsIG9uKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3MoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRTY3JvbGxQb3MoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jga7mnIDlpKflgKTjgpLlj5blvpdcclxuICAgICAgICBnZXRTY3JvbGxQb3NNYXgoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbE1nci5nZXRTY3JvbGxQb3NNYXgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgrnjgq/jg63jg7zjg6vkvY3nva7jgpLmjIflrppcclxuICAgICAgICBzY3JvbGxUbyhwb3M6IG51bWJlciwgYW5pbWF0ZT86IGJvb2xlYW4sIHRpbWU/OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsTWdyLnNjcm9sbFRvKHBvcywgYW5pbWF0ZSwgdGltZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GV44KM44GfIExpc3RJdGVtVmlldyDjga7ooajnpLrjgpLkv53oqLxcclxuICAgICAgICBlbnN1cmVWaXNpYmxlKGluZGV4OiBudW1iZXIsIG9wdGlvbnM/OiBFbnN1cmVWaXNpYmxlT3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxNZ3IuZW5zdXJlVmlzaWJsZShpbmRleCwgb3B0aW9ucyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudHM6IElMaXN0VmlldyBQcm9wZXJ0aWVzXHJcblxyXG4gICAgICAgIC8vISBjb3JlIGZyYW1ld29yayBhY2Nlc3NcclxuICAgICAgICBnZXQgY29yZSgpOiBJTGlzdFZpZXdGcmFtZXdvcmsge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsTWdyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJTGlzdFZpZXcgSW50ZXJuYWwgSS9GXHJcblxyXG4gICAgICAgIC8vISDnmbvpjLIgZnJhbWV3b3JrIOOBjOS9v+eUqOOBmeOCi1xyXG4gICAgICAgIF9hZGRMaW5lKF9saW5lOiBhbnksIGluc2VydFRvPzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbE1nci5fYWRkTGluZShfbGluZSwgaW5zZXJ0VG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJQ29tcG9zYWJsZVZpZXdcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44GZ44Gn44Gr5a6a576p44GV44KM44GfIEJhY2tib25lLlZpZXcg44KS5Z+65bqV44Kv44Op44K544Gr6Kit5a6a44GX44CBZXh0ZW5kIOOCkuWun+ihjOOBmeOCi+OAglxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIGRlcml2ZXMgICAgICAgICB7QmFja2JvbmUuVmlld3xCYWNrYm9uZS5WaWV3W119IFtpbl0g5ZCI5oiQ5YWD44GuIFZpZXcg44Kv44Op44K5XHJcbiAgICAgICAgICogQHBhcmFtIHByb3BlcnRpZXMgICAgICB7T2JqZWN0fSAgICAgICAgICAgICAgICAgICAgICAgIFtpbl0gcHJvdG90eXBlIOODl+ODreODkeODhuOCo1xyXG4gICAgICAgICAqIEBwYXJhbSBjbGFzc1Byb3BlcnRpZXMge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAgICBbaW5dIHN0YXRpYyDjg5fjg63jg5Hjg4bjgqNcclxuICAgICAgICAgKiBAcmV0dXJuIHtCYWNrYm9uZS5WaWV3fEJhY2tib25lLlZpZXdbXX0g5paw6KaP44Gr55Sf5oiQ44GV44KM44GfIFZpZXcg44Gu44Kz44Oz44K544OI44Op44Kv44K/XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgc3RhdGljIGNvbXBvc2UoZGVyaXZlczogVmlld0NvbnN0cnVjdG9yIHwgVmlld0NvbnN0cnVjdG9yW10sIHByb3BlcnRpZXM6IGFueSwgY2xhc3NQcm9wZXJ0aWVzPzogYW55KTogVmlld0NvbnN0cnVjdG9yIHtcclxuICAgICAgICAgICAgY29uc3QgY29tcG9zZWQ6IGFueSA9IGNvbXBvc2VWaWV3cyhMaXN0VmlldywgZGVyaXZlcyk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb21wb3NlZC5leHRlbmQocHJvcGVydGllcywgY2xhc3NQcm9wZXJ0aWVzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkdyb3VwTGlzdEl0ZW1WaWV3XSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgR3JvdXBMaXN0SXRlbVZpZXdPcHRpb25zXHJcbiAgICAgKiBAYnJpZWYgR3JvdXBMaXN0SXRlbVZpZXcg44Gu44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgR3JvdXBMaXN0SXRlbVZpZXdPcHRpb25zPFRNb2RlbCBleHRlbmRzIEJhY2tib25lLk1vZGVsID0gQmFja2JvbmUuTW9kZWw+IGV4dGVuZHMgTGlzdEl0ZW1WaWV3T3B0aW9uczxUTW9kZWw+IHtcclxuICAgICAgICBncm91cFByb2ZpbGU/OiBHcm91cFByb2ZpbGU7ICAgIC8vITwgR3JvdXBQcm9maWxlIOOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIEdyb3VwTGlzdEl0ZW1WaWV3XHJcbiAgICAgKiBAYnJpZWYgRXhwYW5kYWJsZUxpc3RWaWV3IOOBjOaJseOBhiBMaXN0SXRlbSDjgrPjg7Pjg4bjg4rjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEdyb3VwTGlzdEl0ZW1WaWV3PFRNb2RlbCBleHRlbmRzIEJhY2tib25lLk1vZGVsID0gQmFja2JvbmUuTW9kZWw+IGV4dGVuZHMgTGlzdEl0ZW1WaWV3PFRNb2RlbD4ge1xyXG5cclxuICAgICAgICBwcml2YXRlIF9ncm91cFByb2ZpbGU6IEdyb3VwUHJvZmlsZSA9IG51bGw7ICAgIC8vITwg566h6L2E44GuIEdyb3VwUHJvZmlsZVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBjb25zdHJ1Y3RvclxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIG9wdGlvbnMge0dyb3VwTGluZVZpZXdPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM6IEdyb3VwTGlzdEl0ZW1WaWV3T3B0aW9uczxUTW9kZWw+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLl9ncm91cFByb2ZpbGUgPSBvcHRpb25zLmdyb3VwUHJvZmlsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHJvdGVjdGVkIG1ldGhvZHNcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5bGV6ZaL54q25oWL44KS5Yik5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDlsZXplossIGZhbHNlOuWPjuadn1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3RlY3RlZCBpc0V4cGFuZGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ3JvdXBQcm9maWxlLmlzRXhwYW5kZWQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlsZXplovkuK3jgYvliKTlrppcclxuICAgICAgICBwcm90ZWN0ZWQgaXNFeHBhbmRpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoPEJhc2VFeHBhbmRhYmxlTGlzdFZpZXc+dGhpcy5vd25lcikuaXNFeHBhbmRpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlj47mnZ/kuK3jgYvliKTlrppcclxuICAgICAgICBwcm90ZWN0ZWQgaXNDb2xsYXBzaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKDxCYXNlRXhwYW5kYWJsZUxpc3RWaWV3PnRoaXMub3duZXIpLmlzQ29sbGFwc2luZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOmWi+mWieS4reOBi+WIpOWumlxyXG4gICAgICAgIHByb3RlY3RlZCBpc1N3aXRjaGluZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICg8QmFzZUV4cGFuZGFibGVMaXN0Vmlldz50aGlzLm93bmVyKS5pc1N3aXRjaGluZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWtkCBHcm91cCDjgpLmjIHjgaPjgabjgYTjgovjgYvliKTlrppcclxuICAgICAgICBwcm90ZWN0ZWQgaGFzQ2hpbGRyZW4obGF5b3V0S2V5Pzogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ncm91cFByb2ZpbGUuaGFzQ2hpbGRyZW4obGF5b3V0S2V5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLyogdHNsaW50OmRpc2FibGU6bm8tYml0d2lzZSAqL1xyXG5cclxubmFtZXNwYWNlIENEUC5VSSB7XHJcblxyXG4gICAgY29uc3QgVEFHID0gXCJbQ0RQLlVJLkV4cGFuZE1hbmFnZXJdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIEV4cGFuZE1hbmFnZXJcclxuICAgICAqIEBicmllZiDplovplonnirbmhYvnrqHnkIbjgq/jg6njgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNsYXNzIEV4cGFuZE1hbmFnZXIgaW1wbGVtZW50cyBJRXhwYW5kTWFuYWdlciB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX293bmVyOiBCYXNlRXhwYW5kYWJsZUxpc3RWaWV3ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIF9tYXBHcm91cHM6IE9iamVjdCA9IHt9OyAgICAgICAgICAgICAgICAvLyE8IHtpZCwgR3JvdXBQcm9maWxlfSDjga4gbWFwXHJcbiAgICAgICAgcHJpdmF0ZSBfYXJ5VG9wR3JvdXBzOiBHcm91cFByb2ZpbGVbXSA9IFtdOyAgICAgLy8hPCDnrKwx6ZqO5bGkIEdyb3VwUHJvZmlsZSDjgpLmoLzntI1cclxuICAgICAgICBwcml2YXRlIF9sYXlvdXRLZXk6IHN0cmluZyA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3duZXIge0Jhc2VFeHBhbmRhYmxlTGlzdFZpZXd9IFtpbl0g6KaqVmlldyDjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICBjb25zdHJ1Y3Rvcihvd25lcjogQmFzZUV4cGFuZGFibGVMaXN0Vmlldykge1xyXG4gICAgICAgICAgICB0aGlzLl9vd25lciA9IG93bmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJRXhwYW5kTWFuYWdlclxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDmlrDopo8gR3JvdXBQcm9maWxlIOOCkuS9nOaIkFxyXG4gICAgICAgICAqIOeZu+mMsua4iOOBv+OBruWgtOWQiOOBr+OBneOBruOCquODluOCuOOCp+OCr+ODiOOCkui/lOWNtFxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcm1hIGlkIHtTdHJpbmd9IFtpbl0g5paw6KaP44Gr5L2c5oiQ44GZ44KLIEdyb3VwIElEIOOCkuaMh+Wumi4g5oyH5a6a44GX44Gq44GE5aC05ZCI44Gv6Ieq5YuV5Ymy44KK5oyv44KKXHJcbiAgICAgICAgICogQHJldHVybiB7R3JvdXBQcm9maWxlfSBHcm91cFByb2ZpbGUg44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbmV3R3JvdXAoaWQ/OiBzdHJpbmcpOiBHcm91cFByb2ZpbGUge1xyXG4gICAgICAgICAgICBsZXQgZ3JvdXA6IEdyb3VwUHJvZmlsZTtcclxuICAgICAgICAgICAgaWYgKG51bGwgPT0gaWQpIHtcclxuICAgICAgICAgICAgICAgIGlkID0gXCJncm91cC1pZDpcIiArIChcIjAwMDBcIiArIChNYXRoLnJhbmRvbSgpICogTWF0aC5wb3coMzYsIDQpIDw8IDApLnRvU3RyaW5nKDM2KSkuc2xpY2UoLTQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChudWxsICE9IHRoaXMuX21hcEdyb3Vwc1tpZF0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9tYXBHcm91cHNbaWRdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdyb3VwID0gbmV3IEdyb3VwUHJvZmlsZShpZCwgdGhpcy5fb3duZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9tYXBHcm91cHNbaWRdID0gZ3JvdXA7XHJcbiAgICAgICAgICAgIHJldHVybiBncm91cDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOeZu+mMsua4iOOBvyBHcm91cCDjgpLlj5blvpdcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJtYSBpZCB7U3RyaW5nfSBbaW5dIOWPluW+l+OBmeOCiyBHcm91cCBJRCDjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJuIHtHcm91cFByb2ZpbGV9IEdyb3VwUHJvZmlsZSDjgqTjg7Pjgrnjgr/jg7PjgrkgLyBudWxsXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0R3JvdXAoaWQ6IHN0cmluZyk6IEdyb3VwUHJvZmlsZSB7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IHRoaXMuX21hcEdyb3Vwc1tpZF0pIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihUQUcgKyBcImdyb3VwIGlkOiBcIiArIGlkICsgXCIgaXMgbm90IHJlZ2lzdGVyZWQuXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX21hcEdyb3Vwc1tpZF07XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDnrKwx6ZqO5bGk44GuIEdyb3VwIOeZu+mMslxyXG4gICAgICAgICAqXHJcbiAgICAgICAgICogQHBhcmFtIHRvcEdyb3VwIHtHcm91cFByb2ZpbGV9IFtpbl0g5qeL56+J5riI44G/IEdyb3VwUHJvZmlsZSDjgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKi9cclxuICAgICAgICByZWdpc3RlclRvcEdyb3VwKHRvcEdyb3VwOiBHcm91cFByb2ZpbGUpOiB2b2lkIHtcclxuICAgICAgICAgICAgbGV0IGxhc3RHcm91cDogR3JvdXBQcm9maWxlO1xyXG4gICAgICAgICAgICBsZXQgaW5zZXJ0VG86IG51bWJlcjtcclxuXHJcbiAgICAgICAgICAgIC8vIOOBmeOBp+OBq+eZu+mMsua4iOOBv+OBruWgtOWQiOOBryByZXN0b3JlIOOBl+OBpiBsYXlvdXQg44Kt44O844GU44Go44Gr5b6p5YWD44GZ44KL44CCXHJcbiAgICAgICAgICAgIGlmIChcInJlZ2lzdGVyZWRcIiA9PT0gdG9wR3JvdXAuc3RhdHVzKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBvcmllbnRhdGlvbiBjaGFuZ2VkIOaZguOBriBsYXlvdXQg44Kt44O85aSJ5pu05a++5b+c44Gg44GM44CB44Kt44O844Gr5aSJ5pu044GM54Sh44GE44Go44GN44Gv5LiN5YW35ZCI44Go44Gq44KL44CCXHJcbiAgICAgICAgICAgICAgICAvLyDjgZPjga4gQVBJIOOBq+Wun+ijheOBjOW/heimgeOBi+OCguWQq+OCgeOBpuimi+ebtOOBl+OBjOW/heimgVxyXG4gICAgICAgICAgICAgICAgdG9wR3JvdXAucmVzdG9yZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBsYXN0R3JvdXAgPSAoMCA8IHRoaXMuX2FyeVRvcEdyb3Vwcy5sZW5ndGgpID8gdGhpcy5fYXJ5VG9wR3JvdXBzW3RoaXMuX2FyeVRvcEdyb3Vwcy5sZW5ndGggLSAxXSA6IG51bGw7XHJcbiAgICAgICAgICAgIGluc2VydFRvID0gKG51bGwgIT0gbGFzdEdyb3VwKSA/IGxhc3RHcm91cC5nZXRMYXN0TGluZUluZGV4KHRydWUpICsgMSA6IDA7XHJcbiAgICAgICAgICAgIGlmIChfLmlzTmFOKGluc2VydFRvKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImxvZ2ljIGVycm9yLCAnaW5zZXJ0VG8nIGlzIE5hTi5cIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2FyeVRvcEdyb3Vwcy5wdXNoKHRvcEdyb3VwKTtcclxuICAgICAgICAgICAgdG9wR3JvdXAucmVnaXN0ZXIoaW5zZXJ0VG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog56ysMemajuWxpOOBriBHcm91cCDjgpLlj5blvpdcclxuICAgICAgICAgKiDjgrPjg5Tjg7zphY3liJfjgYzov5TjgZXjgozjgovjgZ/jgoHjgIHjgq/jg6njgqTjgqLjg7Pjg4jjga/jgq3jg6Pjg4Pjgrfjg6XkuI3lj69cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEByZXR1cm4ge0dyb3VwUHJvZmlsZVtdfSBHcm91cFByb2ZpbGUg6YWN5YiXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZ2V0VG9wR3JvdXBzKCk6IEdyb3VwUHJvZmlsZVtdIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FyeVRvcEdyb3Vwcy5zbGljZSgwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgZnjgbnjgabjga7jgrDjg6vjg7zjg5fjgpLlsZXplosgKDHpmo7lsaQpXHJcbiAgICAgICAgZXhwYW5kQWxsKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9hcnlUb3BHcm91cHMuZm9yRWFjaCgoZ3JvdXA6IEdyb3VwUHJvZmlsZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGdyb3VwLmhhc0NoaWxkcmVuKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBncm91cC5leHBhbmQoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44GZ44G544Gm44Gu44Kw44Or44O844OX44KS5Y+O5p2fICgx6ZqO5bGkKVxyXG4gICAgICAgIGNvbGxhcHNlQWxsKGRlbGF5PzogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2FyeVRvcEdyb3Vwcy5mb3JFYWNoKChncm91cDogR3JvdXBQcm9maWxlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZ3JvdXAuaGFzQ2hpbGRyZW4oKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwLmNvbGxhcHNlKGRlbGF5KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5bGV6ZaL5Lit44GL5Yik5a6aXHJcbiAgICAgICAgaXNFeHBhbmRpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lci5pc1N0YXR1c0luKFwiZXhwYW5kaW5nXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWPjuadn+S4reOBi+WIpOWumlxyXG4gICAgICAgIGlzQ29sbGFwc2luZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyLmlzU3RhdHVzSW4oXCJjb2xsYXBzaW5nXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOmWi+mWieS4reOBi+WIpOWumlxyXG4gICAgICAgIGlzU3dpdGNoaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pc0V4cGFuZGluZygpIHx8IHRoaXMuaXNDb2xsYXBzaW5nKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg54q25oWL5aSJ5pWw44Gu5Y+C54Wn44Kr44Km44Oz44OI44Gu44Kk44Oz44Kv44Oq44Oh44Oz44OIXHJcbiAgICAgICAgc3RhdHVzQWRkUmVmKHN0YXR1czogc3RyaW5nKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyLnN0YXR1c0FkZFJlZihzdGF0dXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruODh+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgIHN0YXR1c1JlbGVhc2Uoc3RhdHVzOiBzdHJpbmcpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3duZXIuc3RhdHVzUmVsZWFzZShzdGF0dXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWHpueQhuOCueOCs+ODvOODl+avjuOBq+eKtuaFi+WkieaVsOOCkuioreWumlxyXG4gICAgICAgIHN0YXR1c1Njb3BlKHN0YXR1czogc3RyaW5nLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9vd25lci5zdGF0dXNTY29wZShzdGF0dXMsIGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDmjIflrprjgZfjgZ/nirbmhYvkuK3jgafjgYLjgovjgYvnorroqo1cclxuICAgICAgICBpc1N0YXR1c0luKHN0YXR1czogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lci5pc1N0YXR1c0luKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgbGF5b3V0IGtleSDjgpLlj5blvpdcclxuICAgICAgICBnZXQgbGF5b3V0S2V5KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9sYXlvdXRLZXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEgbGF5b3V0IGtleSDjgpLoqK3lrppcclxuICAgICAgICBzZXQgbGF5b3V0S2V5KGtleTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xheW91dEtleSA9IGtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg4fjg7zjgr/jgpLnoLTmo4RcclxuICAgICAgICByZWxlYXNlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXBHcm91cHMgPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5fYXJ5VG9wR3JvdXBzID0gW107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIEltcGxlbWVudGVzOiBJQmFja3VwUmVzdG9yZVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlhoXpg6jjg4fjg7zjgr/jgpLjg5Djg4Pjgq/jgqLjg4Pjg5dcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBrZXkge1N0cmluZ30gW2luXSDjg5Djg4Pjgq/jgqLjg4Pjg5fjgq3jg7zjgpLmjIflrppcclxuICAgICAgICAgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlOiDmiJDlip8gLyBmYWxzZTog5aSx5pWXXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgYmFja3VwKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGNvbnN0IF9iYWNrdXAgPSB0aGlzLmJhY2t1cERhdGE7XHJcbiAgICAgICAgICAgIGlmIChudWxsID09IF9iYWNrdXBba2V5XSkge1xyXG4gICAgICAgICAgICAgICAgX2JhY2t1cFtrZXldID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hcDogdGhpcy5fbWFwR3JvdXBzLFxyXG4gICAgICAgICAgICAgICAgICAgIHRvcHM6IHRoaXMuX2FyeVRvcEdyb3VwcyxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlhoXpg6jjg4fjg7zjgr/jgpLjg6rjgrnjg4jjgqJcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBwYXJhbSBrZXkgICAgIHtTdHJpbmd9ICBbaW5dIOODkOODg+OCr+OCouODg+ODl+OCreODvOOCkuaMh+WumlxyXG4gICAgICAgICAqIEBwYXJhbSByZWJ1aWxkIHtCb29sZWFufSBbaW5dIHJlYnVpbGQg44KS5a6f6KGM44GZ44KL5aC05ZCI44GvIHRydWUg44KS5oyH5a6aXHJcbiAgICAgICAgICogQHJldHVybiB7Qm9vbGVhbn0gdHJ1ZTog5oiQ5YqfIC8gZmFsc2U6IOWkseaVl1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJlc3RvcmUoa2V5OiBzdHJpbmcsIHJlYnVpbGQ6IGJvb2xlYW4gPSB0cnVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGNvbnN0IF9iYWNrdXAgPSB0aGlzLmJhY2t1cERhdGE7XHJcblxyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBfYmFja3VwW2tleV0pIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoMCA8IHRoaXMuX2FyeVRvcEdyb3Vwcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVsZWFzZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9tYXBHcm91cHMgPSBfYmFja3VwW2tleV0ubWFwO1xyXG4gICAgICAgICAgICB0aGlzLl9hcnlUb3BHcm91cHMgPSBfYmFja3VwW2tleV0udG9wcztcclxuXHJcbiAgICAgICAgICAgIC8vIGxheW91dCDmg4XloLHjga7norroqo1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FyeVRvcEdyb3Vwcy5sZW5ndGggPD0gMCB8fCAhdGhpcy5fYXJ5VG9wR3JvdXBzWzBdLmhhc0xheW91dEtleU9mKHRoaXMubGF5b3V0S2V5KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyDlsZXplovjgZfjgabjgYTjgovjgoLjga7jgpLnmbvpjLJcclxuICAgICAgICAgICAgdGhpcy5fYXJ5VG9wR3JvdXBzLmZvckVhY2goKGdyb3VwOiBHcm91cFByb2ZpbGUpID0+IHtcclxuICAgICAgICAgICAgICAgIGdyb3VwLnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyDlho3mp4vnr4njga7kuojntIRcclxuICAgICAgICAgICAgaWYgKHJlYnVpbGQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX293bmVyLnJlYnVpbGQoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gu5pyJ54ShXHJcbiAgICAgICAgaGFzQmFja3VwKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vd25lci5oYXNCYWNrdXAoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjg5Djg4Pjgq/jgqLjg4Pjg5fjg4fjg7zjgr/jga7noLTmo4RcclxuICAgICAgICBjbGVhckJhY2t1cChrZXk/OiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyLmNsZWFyQmFja3VwKGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg44OQ44OD44Kv44Ki44OD44OX44OH44O844K/44Gr44Ki44Kv44K744K5XHJcbiAgICAgICAgZ2V0IGJhY2t1cERhdGEoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX293bmVyLmJhY2t1cERhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsIm5hbWVzcGFjZSBDRFAuVUkge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5VSS5FeHBhbmRhYmxlTGlzdFZpZXddIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIEV4cGFuZGFibGVMaXN0Vmlld1xyXG4gICAgICogQGJyaWVmIOmWi+mWieapn+iDveOCkuWCmeOBiOOBn+S7ruaDs+ODquOCueODiOODk+ODpeODvOOCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgRXhwYW5kYWJsZUxpc3RWaWV3PFRNb2RlbCBleHRlbmRzIEJhY2tib25lLk1vZGVsID0gQmFja2JvbmUuTW9kZWw+XHJcbiAgICAgICAgZXh0ZW5kcyBMaXN0VmlldzxUTW9kZWw+IGltcGxlbWVudHMgSUV4cGFuZGFibGVMaXN0VmlldyB7XHJcblxyXG4gICAgICAgIHByaXZhdGUgX3N0YXR1c01ncjogU3RhdHVzTWFuYWdlciA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBfZXhwYW5kTWFuYWdlcjogRXhwYW5kTWFuYWdlciA9IG51bGw7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGNvbnN0cnVjdG9yXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0gb3B0aW9ucyB7TGlzdFZpZXdDb25zdHJ1Y3RPcHRpb25zfSBbaW5dIOOCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnM/OiBMaXN0Vmlld0NvbnN0cnVjdE9wdGlvbnM8VE1vZGVsPikge1xyXG4gICAgICAgICAgICBzdXBlcihvcHRpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5fc3RhdHVzTWdyID0gbmV3IFN0YXR1c01hbmFnZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5fZXhwYW5kTWFuYWdlciA9IG5ldyBFeHBhbmRNYW5hZ2VyKHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgICAgICAvLyBJbXBsZW1lbnRzOiBJRXhwYW5kYWJsZUxpc3RWaWV3XHJcblxyXG4gICAgICAgIC8vISDmlrDopo8gR3JvdXBQcm9maWxlIOOCkuS9nOaIkFxyXG4gICAgICAgIG5ld0dyb3VwKGlkPzogc3RyaW5nKTogR3JvdXBQcm9maWxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIubmV3R3JvdXAoaWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeZu+mMsua4iOOBvyBHcm91cCDjgpLlj5blvpdcclxuICAgICAgICBnZXRHcm91cChpZDogc3RyaW5nKTogR3JvdXBQcm9maWxlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuZ2V0R3JvdXAoaWQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOesrDHpmo7lsaTjga4gR3JvdXAg55m76YyyXHJcbiAgICAgICAgcmVnaXN0ZXJUb3BHcm91cCh0b3BHcm91cDogR3JvdXBQcm9maWxlKTogdm9pZCB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIucmVnaXN0ZXJUb3BHcm91cCh0b3BHcm91cCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg56ysMemajuWxpOOBriBHcm91cCDjgpLlj5blvpdcclxuICAgICAgICBnZXRUb3BHcm91cHMoKTogR3JvdXBQcm9maWxlW10ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5nZXRUb3BHcm91cHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDjgZnjgbnjgabjga7jgrDjg6vjg7zjg5fjgpLlsZXplosgKDHpmo7lsaQpXHJcbiAgICAgICAgZXhwYW5kQWxsKCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLmV4cGFuZEFsbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOOBmeOBueOBpuOBruOCsOODq+ODvOODl+OCkuWPjuadnyAoMemajuWxpClcclxuICAgICAgICBjb2xsYXBzZUFsbChkZWxheT86IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLmNvbGxhcHNlQWxsKGRlbGF5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlsZXplovkuK3jgYvliKTlrppcclxuICAgICAgICBpc0V4cGFuZGluZygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIuaXNFeHBhbmRpbmcoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlj47mnZ/kuK3jgYvliKTlrppcclxuICAgICAgICBpc0NvbGxhcHNpbmcoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9leHBhbmRNYW5hZ2VyLmlzQ29sbGFwc2luZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOmWi+mWieS4reOBi+WIpOWumlxyXG4gICAgICAgIGlzU3dpdGNoaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5pc1N3aXRjaGluZygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOeKtuaFi+WkieaVsOOBruWPgueFp+OCq+OCpuODs+ODiOOBruOCpOODs+OCr+ODquODoeODs+ODiFxyXG4gICAgICAgIHN0YXR1c0FkZFJlZihzdGF0dXM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNNZ3Iuc3RhdHVzQWRkUmVmKHN0YXR1cyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg54q25oWL5aSJ5pWw44Gu5Y+C54Wn44Kr44Km44Oz44OI44Gu44OH44Kv44Oq44Oh44Oz44OIXHJcbiAgICAgICAgc3RhdHVzUmVsZWFzZShzdGF0dXM6IHN0cmluZyk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXNNZ3Iuc3RhdHVzUmVsZWFzZShzdGF0dXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWHpueQhuOCueOCs+ODvOODl+avjuOBq+eKtuaFi+WkieaVsOOCkuioreWumlxyXG4gICAgICAgIHN0YXR1c1Njb3BlKHN0YXR1czogc3RyaW5nLCBjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGF0dXNNZ3Iuc3RhdHVzU2NvcGUoc3RhdHVzLCBjYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyEg5oyH5a6a44GX44Gf54q25oWL5Lit44Gn44GC44KL44GL56K66KqNXHJcbiAgICAgICAgaXNTdGF0dXNJbihzdGF0dXM6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdHVzTWdyLmlzU3RhdHVzSW4oc3RhdHVzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISBsYXlvdXQga2V5IOOCkuWPluW+l1xyXG4gICAgICAgIGdldCBsYXlvdXRLZXkoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2V4cGFuZE1hbmFnZXIubGF5b3V0S2V5O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIGxheW91dCBrZXkg44KS6Kit5a6aXHJcbiAgICAgICAgc2V0IGxheW91dEtleShrZXk6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9leHBhbmRNYW5hZ2VyLmxheW91dEtleSA9IGtleTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gT3ZlcnJpZGU6IExpc3RWaWV3XHJcblxyXG4gICAgICAgIC8vISDjg4fjg7zjgr/jgpLnoLTmo4RcclxuICAgICAgICByZWxlYXNlKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBzdXBlci5yZWxlYXNlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2V4cGFuZE1hbmFnZXIucmVsZWFzZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8hIOWGhemDqOODh+ODvOOCv+OCkuODkOODg+OCr+OCouODg+ODl1xyXG4gICAgICAgIGJhY2t1cChrZXk6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5iYWNrdXAoa2V5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vISDlhoXpg6jjg4fjg7zjgr/jgpLjg6rjgrnjg4jjgqJcclxuICAgICAgICByZXN0b3JlKGtleTogc3RyaW5nLCByZWJ1aWxkOiBib29sZWFuID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXhwYW5kTWFuYWdlci5yZXN0b3JlKGtleSwgcmVidWlsZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==