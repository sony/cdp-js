/*!
 * cdp.core.js 2.0.0
 *
 * Date: 2017-07-24T05:02:39.680Z
 */
(function (root, factory) { if (typeof define === "function" && define.amd) { define(function () { return factory(root.CDP || (root.CDP = {})); }); } else if (typeof exports === "object") { module.exports = factory(root.CDP || (root.CDP = {})); } else { factory(root.CDP || (root.CDP = {})); } }(((this || 0).self || global), function (CDP) {
var CDP;
(function (CDP) {
    var TAG = "[CDP] ";
    /**
     * システムの global オブジェクトにアクセス
     * 通常は Window オブジェクトとなる
     */
    CDP.global = Function("return this")();
    /**
     * Web root location にアクセス
     */
    CDP.webRoot = (function () {
        if (CDP.global.location) {
            var baseUrl = /(.+\/)[^/]*#[^/]+/.exec(CDP.global.location.href);
            if (!baseUrl) {
                baseUrl = /(.+\/)/.exec(CDP.global.location.href);
            }
            return baseUrl[1];
        }
    })();
    /**
     * Config オブジェクトにアクセス
     */
    CDP.Config = CDP.Config || CDP.global.Config || {};
    /**
     * core の初期化
     */
    function initialize(options) {
        setTimeout(function () {
            try {
                CDP.Patch.apply();
                if (options && typeof options.success === "function") {
                    options.success();
                }
            }
            catch (error) {
                var msg = (error && error.message) ? error.message : "initialize failed.";
                console.error(TAG + msg);
                if (options && typeof options.fail === "function") {
                    options.fail(error);
                }
            }
        });
    }
    CDP.initialize = initialize;
})(CDP || (CDP = {}));
var CDP;
(function (CDP) {
    var TAG = "[CDP.Patch] ";
    /**
     * @class Patch
     * @brief 実行環境用 Patch 適用ユーティリティクラス
     */
    var Patch = (function () {
        function Patch() {
        }
        ///////////////////////////////////////////////////////////////////////
        // public static methods:
        /**
         * パッチの適用
         */
        Patch.apply = function () {
            Patch.consolePatch();
            Patch.nodePatch();
        };
        ///////////////////////////////////////////////////////////////////////
        // private static methods:
        // console 用 patch
        Patch.consolePatch = function () {
            if (null == CDP.global.console || null == CDP.global.console.error) {
                CDP.global.console = {
                    count: function () { },
                    groupEnd: function () { },
                    time: function () { },
                    timeEnd: function () { },
                    trace: function () { },
                    group: function () { },
                    dirxml: function () { },
                    debug: function () { },
                    groupCollapsed: function () { },
                    select: function () { },
                    info: function () { },
                    profile: function () { },
                    assert: function () { },
                    msIsIndependentlyComposed: function () { },
                    clear: function () { },
                    dir: function () { },
                    warn: function () { },
                    error: function () { },
                    log: function () { },
                    profileEnd: function () { }
                };
            }
        };
        // WinRT 用 patch
        Patch.nodePatch = function () {
            if ("object" === typeof MSApp) {
                var _MSApp_1 = MSApp;
                var originalAppendChild_1 = Node.prototype.appendChild;
                Node.prototype.appendChild = function (node) {
                    var self = this;
                    return _MSApp_1.execUnsafeLocalFunction(function () {
                        return originalAppendChild_1.call(self, node);
                    });
                };
                var originalInsertBefore_1 = Node.prototype.insertBefore;
                Node.prototype.insertBefore = function (newElement, referenceElement) {
                    var self = this;
                    return _MSApp_1.execUnsafeLocalFunction(function () {
                        return originalInsertBefore_1.call(self, newElement, referenceElement);
                    });
                };
            }
        };
        return Patch;
    }());
    CDP.Patch = Patch;
})(CDP || (CDP = {}));

return CDP; }));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNkcDovLy9DRFAvQ29yZS50cyIsImNkcDovLy9DRFAvUGF0Y2gudHMiLCJjZHA6Ly8vQ0RQL0Vycm9yRGVmcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFVLEdBQUcsQ0F5RFo7QUF6REQsV0FBVSxHQUFHO0lBRVQsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDO0lBRXJCOzs7T0FHRztJQUNVLFVBQU0sR0FBUSxRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQztJQUdyRDs7T0FFRztJQUNVLFdBQU8sR0FBVyxDQUFDO1FBQzVCLEVBQUUsQ0FBQyxDQUFDLFVBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQUksT0FBTyxHQUFHLG1CQUFtQixDQUFDLElBQUksQ0FBQyxVQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdELEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztnQkFDWCxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xELENBQUM7WUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLENBQUM7SUFDTCxDQUFDLENBQUMsRUFBRSxDQUFDO0lBRUw7O09BRUc7SUFDVSxVQUFNLEdBQVEsR0FBRyxDQUFDLE1BQU0sSUFBSSxVQUFNLENBQUMsTUFBTSxJQUFJLEVBQUUsQ0FBQztJQVc3RDs7T0FFRztJQUNILG9CQUEyQixPQUF5QjtRQUNoRCxVQUFVLENBQUM7WUFDUCxJQUFJLENBQUM7Z0JBQ0QsU0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNkLEVBQUUsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDbkQsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO2dCQUN0QixDQUFD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QUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUM7Z0JBRUYsSUFBTSxzQkFBb0IsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztnQkFDekQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsVUFBVSxVQUFlLEVBQUUsZ0JBQXNCO29CQUMzRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUM7b0JBQ2xCLE1BQU0sQ0FBQyxRQUFNLENBQUMsdUJBQXVCLENBQUM7d0JBQ2xDLE1BQU0sQ0FBQyxzQkFBb0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO29CQUN6RSxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUM7WUFDTixDQUFDO1FBQ0wsQ0FBQztRQUNMLFlBQUM7SUFBRCxDQUFDO0lBakVZLFNBQUssUUFpRWpCO0FBQ0wsQ0FBQyxFQTFFUyxHQUFHLEtBQUgsR0FBRyxRQTBFWiIsInNvdXJjZXNDb250ZW50IjpbIm5hbWVzcGFjZSBDRFAge1xyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUF0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrfjgrnjg4bjg6Djga4gZ2xvYmFsIOOCquODluOCuOOCp+OCr+ODiOOBq+OCouOCr+OCu+OCuVxyXG4gICAgICog6YCa5bi444GvIFdpbmRvdyDjgqrjg5bjgrjjgqfjgq/jg4jjgajjgarjgotcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGNvbnN0IGdsb2JhbDogYW55ID0gRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdlYiByb290IGxvY2F0aW9uIOOBq+OCouOCr+OCu+OCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3Qgd2ViUm9vdDogc3RyaW5nID0gKCgpID0+IHtcclxuICAgICAgICBpZiAoZ2xvYmFsLmxvY2F0aW9uKSB7XHJcbiAgICAgICAgICAgIGxldCBiYXNlVXJsID0gLyguK1xcLylbXi9dKiNbXi9dKy8uZXhlYyhnbG9iYWwubG9jYXRpb24uaHJlZik7XHJcbiAgICAgICAgICAgIGlmICghYmFzZVVybCkge1xyXG4gICAgICAgICAgICAgICAgYmFzZVVybCA9IC8oLitcXC8pLy5leGVjKGdsb2JhbC5sb2NhdGlvbi5ocmVmKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmFzZVVybFsxXTtcclxuICAgICAgICB9XHJcbiAgICB9KSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uZmlnIOOCquODluOCuOOCp+OCr+ODiOOBq+OCouOCr+OCu+OCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY29uc3QgQ29uZmlnOiBhbnkgPSBDRFAuQ29uZmlnIHx8IGdsb2JhbC5Db25maWcgfHwge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDliJ3mnJ/ljJbjgqrjg5fjgrfjg6fjg7PjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrlcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBDb3JlSW5pdE9wdGlvbnMge1xyXG4gICAgICAgIHN1Y2Nlc3M/OiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIGZhaWw/OiAoZXJyb3I/OiBhbnkpID0+IHZvaWQ7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogY29yZSDjga7liJ3mnJ/ljJZcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemUob3B0aW9ucz86IENvcmVJbml0T3B0aW9ucyk6IHZvaWQge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgUGF0Y2guYXBwbHkoKTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zLnN1Y2Nlc3MgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbXNnID0gKGVycm9yICYmIGVycm9yLm1lc3NhZ2UpID8gZXJyb3IubWVzc2FnZSA6IFwiaW5pdGlhbGl6ZSBmYWlsZWQuXCI7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIG1zZyk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucy5mYWlsID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvcHRpb25zLmZhaWwoZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwiY2RwLmNvcmVcIiB7XHJcbiAgICBleHBvcnQgPSBDRFA7XHJcbn1cclxuIiwibmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgY29uc3QgVEFHOiBzdHJpbmcgPSBcIltDRFAuUGF0Y2hdIFwiO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGNsYXNzIFBhdGNoXHJcbiAgICAgKiBAYnJpZWYg5a6f6KGM55Kw5aKD55SoIFBhdGNoIOmBqeeUqOODpuODvOODhuOCo+ODquODhuOCo+OCr+ODqeOCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgY2xhc3MgUGF0Y2gge1xyXG4gICAgICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbiAgICAgICAgLy8gcHVibGljIHN0YXRpYyBtZXRob2RzOlxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg5Hjg4Pjg4Hjga7pgannlKhcclxuICAgICAgICAgKi9cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGFwcGx5KCk6IHZvaWQge1xyXG4gICAgICAgICAgICBQYXRjaC5jb25zb2xlUGF0Y2goKTtcclxuICAgICAgICAgICAgUGF0Y2gubm9kZVBhdGNoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4gICAgICAgIC8vIHByaXZhdGUgc3RhdGljIG1ldGhvZHM6XHJcblxyXG4gICAgICAgIC8vIGNvbnNvbGUg55SoIHBhdGNoXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgY29uc29sZVBhdGNoKCk6IHZvaWQge1xyXG4gICAgICAgICAgICBpZiAobnVsbCA9PSBnbG9iYWwuY29uc29sZSB8fCBudWxsID09IGdsb2JhbC5jb25zb2xlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBnbG9iYWwuY29uc29sZSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBjb3VudDogICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VwRW5kOiAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZTogICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lRW5kOiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHRyYWNlOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXA6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBkaXJ4bWw6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnOiAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBDb2xsYXBzZWQ6ICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Q6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGluZm86ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgcHJvZmlsZTogICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQ6ICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG1zSXNJbmRlcGVuZGVudGx5Q29tcG9zZWQ6ICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXI6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBkaXI6ICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHdhcm46ICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3I6ICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgLyogZHVtbXkgKi8gfSxcclxuICAgICAgICAgICAgICAgICAgICBsb2c6ICAgICAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkgeyAvKiBkdW1teSAqLyB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHByb2ZpbGVFbmQ6ICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7IC8qIGR1bW15ICovIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdpblJUIOeUqCBwYXRjaFxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG5vZGVQYXRjaCgpOiB2b2lkIHtcclxuICAgICAgICAgICAgaWYgKFwib2JqZWN0XCIgPT09IHR5cGVvZiBNU0FwcCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgX01TQXBwOiBhbnkgPSBNU0FwcDtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBvcmlnaW5hbEFwcGVuZENoaWxkID0gTm9kZS5wcm90b3R5cGUuYXBwZW5kQ2hpbGQ7XHJcbiAgICAgICAgICAgICAgICBOb2RlLnByb3RvdHlwZS5hcHBlbmRDaGlsZCA9IGZ1bmN0aW9uIChub2RlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gX01TQXBwLmV4ZWNVbnNhZmVMb2NhbEZ1bmN0aW9uKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsQXBwZW5kQ2hpbGQuY2FsbChzZWxmLCBub2RlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxJbnNlcnRCZWZvcmUgPSBOb2RlLnByb3RvdHlwZS5pbnNlcnRCZWZvcmU7XHJcbiAgICAgICAgICAgICAgICBOb2RlLnByb3RvdHlwZS5pbnNlcnRCZWZvcmUgPSBmdW5jdGlvbiAobmV3RWxlbWVudDogYW55LCByZWZlcmVuY2VFbGVtZW50OiBOb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIF9NU0FwcC5leGVjVW5zYWZlTG9jYWxGdW5jdGlvbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEluc2VydEJlZm9yZS5jYWxsKHNlbGYsIG5ld0VsZW1lbnQsIHJlZmVyZW5jZUVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJuYW1lc3BhY2UgQ0RQIHtcclxufVxyXG4iXX0=