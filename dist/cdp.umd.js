(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jquery"), require("backbone"), require("underscore"));
	else if(typeof define === 'function' && define.amd)
		define(["jquery", "backbone", "underscore"], factory);
	else if(typeof exports === 'object')
		exports["CDP"] = factory(require("jquery"), require("backbone"), require("underscore"));
	else
		root["CDP"] = factory(root["jquery"], root["backbone"], root["underscore"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	(function webpackUniversalModuleDefinition(root, factory) {
		if(true)
			module.exports = factory(__webpack_require__(1), __webpack_require__(2), __webpack_require__(3));
		else if(typeof define === 'function' && define.amd)
			define(["jquery", "backbone", "underscore"], factory);
		else if(typeof exports === 'object')
			exports["CDP"] = factory(require("jquery"), require("backbone"), require("underscore"));
		else
			root["CDP"] = factory(root["jquery"], root["backbone"], root["underscore"]);
	})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__) {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// install a JSONP callback for chunk loading
	/******/ 	var parentJsonpFunction = window["webpackJsonpCDP"];
	/******/ 	window["webpackJsonpCDP"] = function webpackJsonpCallback(chunkIds, moreModules) {
	/******/ 		// add "moreModules" to the modules object,
	/******/ 		// then flag all "chunkIds" as loaded and fire callback
	/******/ 		var moduleId, chunkId, i = 0, callbacks = [];
	/******/ 		for(;i < chunkIds.length; i++) {
	/******/ 			chunkId = chunkIds[i];
	/******/ 			if(installedChunks[chunkId])
	/******/ 				callbacks.push.apply(callbacks, installedChunks[chunkId]);
	/******/ 			installedChunks[chunkId] = 0;
	/******/ 		}
	/******/ 		for(moduleId in moreModules) {
	/******/ 			modules[moduleId] = moreModules[moduleId];
	/******/ 		}
	/******/ 		if(parentJsonpFunction) parentJsonpFunction(chunkIds, moreModules);
	/******/ 		while(callbacks.length)
	/******/ 			callbacks.shift().call(null, __webpack_require__);

	/******/ 	};

	/******/ 	// The module cache
	/******/ 	var installedModules = {};

	/******/ 	// object to store loaded and loading chunks
	/******/ 	// "0" means "already loaded"
	/******/ 	// Array means "loading", array contains callbacks
	/******/ 	var installedChunks = {
	/******/ 		0:0
	/******/ 	};

	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {

	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;

	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};

	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;

	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}

	/******/ 	// This file contains only the entry chunk.
	/******/ 	// The chunk loading function for additional chunks
	/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
	/******/ 		// "0" is the signal for "already loaded"
	/******/ 		if(installedChunks[chunkId] === 0)
	/******/ 			return callback.call(null, __webpack_require__);

	/******/ 		// an array means "currently loading".
	/******/ 		if(installedChunks[chunkId] !== undefined) {
	/******/ 			installedChunks[chunkId].push(callback);
	/******/ 		} else {
	/******/ 			// start chunk loading
	/******/ 			installedChunks[chunkId] = [callback];
	/******/ 			var head = document.getElementsByTagName('head')[0];
	/******/ 			var script = document.createElement('script');
	/******/ 			script.type = 'text/javascript';
	/******/ 			script.charset = 'utf-8';
	/******/ 			script.async = true;

	/******/ 			script.src = __webpack_require__.p + "" + chunkId + ".cdp.umd.js";
	/******/ 			head.appendChild(script);
	/******/ 		}
	/******/ 	};

	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;

	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;

	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";

	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_0__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_1__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_2__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_3__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_4__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_5__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_6__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_7__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_8__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_9__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_10__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_11__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_12__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_13__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_14__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_15__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_16__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_17__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_18__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_19__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_LOCAL_MODULE_20__;var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global) {/*!
		 * cdp.js 1.0.0
		 *
		 * Date: 2017-01-11T19:12:47+0900
		 */
		(function(root, factory) {
		    if (true) {
		        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_LOCAL_MODULE_0__ = (function() {
		            return factory(root);
		        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));
		    } else if (typeof exports === "object") {
		        module.exports = factory(root);
		    } else {
		        factory(root);
		    }
		})(window, function(root) {
		    var TAG = "[CDP] ";
		    var CDP = root.CDP || (root.CDP = {});
		    var Patch = function() {
		        function Patch() {}
		        function _apply() {
		            if (null == root.console || null == root.console.error) {
		                _consolePatch();
		            }
		            if (typeof MSApp === "object") {
		                _nodePatch();
		            }
		        }
		        function _consolePatch() {
		            root.console = {
		                count: function() {},
		                groupEnd: function() {},
		                time: function() {},
		                timeEnd: function() {},
		                trace: function() {},
		                group: function() {},
		                dirxml: function() {},
		                debug: function() {},
		                groupCollapsed: function() {},
		                select: function() {},
		                info: function() {},
		                profile: function() {},
		                assert: function() {},
		                msIsIndependentlyComposed: function() {},
		                clear: function() {},
		                dir: function() {},
		                warn: function() {},
		                error: function() {},
		                log: function() {},
		                profileEnd: function() {}
		            };
		        }
		        function _nodePatch() {
		            var originalAppendChild = Node.prototype.appendChild;
		            Node.prototype.appendChild = function(node) {
		                var _this = this;
		                return MSApp.execUnsafeLocalFunction(function() {
		                    return originalAppendChild.call(_this, node);
		                });
		            };
		            var originalInsertBefore = Node.prototype.insertBefore;
		            Node.prototype.insertBefore = function(newElement, referenceElement) {
		                var _this = this;
		                return MSApp.execUnsafeLocalFunction(function() {
		                    return originalInsertBefore.call(_this, newElement, referenceElement);
		                });
		            };
		        }
		        Patch.apply = _apply;
		        return Patch;
		    }();
		    var _webRoot = function() {
		        var baseUrl = /(.+\/)[^\/]*#[^\/]+/.exec(location.href);
		        if (!baseUrl) {
		            baseUrl = /(.+\/)/.exec(location.href);
		        }
		        return baseUrl[1];
		    }();
		    function _init(options) {
		        setTimeout(function() {
		            try {
		                Patch.apply();
		                if (options && typeof options.success === "function") {
		                    options.success();
		                }
		            } catch (error) {
		                var msg = error && error.message ? error.message : "initialize failed.";
		                console.error(TAG + msg);
		                if (options && typeof options.fail === "function") {
		                    options.fail(error);
		                }
		            }
		        });
		    }
		    CDP.global = root;
		    CDP.initialize = _init;
		    CDP.webRoot = _webRoot;
		    return CDP;
		});

		(function(root, factory) {
		    if (true) {
		        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(1) ], __WEBPACK_LOCAL_MODULE_1__ = (function($) {
		            return factory(root.CDP || (root.CDP = {}), $);
		        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));
		    } else if (typeof exports === "object") {
		        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"));
		    } else {
		        factory(root.CDP || (root.CDP = {}), root.jQuery || root.$);
		    }
		})(window, function (CDP, $) {
		    var CDP;
		    (function(CDP) {
		        var TAG = "[CDP.Promise] ";
		        function makePromise(df, options) {
		            var extendOptions;
		            var cancel;
		            if ("function" === typeof options) {
		                cancel = options;
		            } else {
		                extendOptions = options;
		                if (extendOptions && extendOptions.cancelCallback) {
		                    cancel = extendOptions.cancelCallback;
		                } else {
		                    cancel = function() {};
		                }
		            }
		            var _abort = function(info) {
		                var detail = info ? info : {
		                    message: "abort"
		                };
		                if (null != this.dependency) {
		                    if (this.dependency.abort) {
		                        this.dependency.abort(detail);
		                    } else {
		                        console.error(TAG + "[call] dependency object doesn't have 'abort()' method.");
		                    }
		                    if (this.callReject && "pending" === this.state()) {
		                        cancel(detail);
		                        df.reject(detail);
		                    }
		                } else if ("pending" === this.state()) {
		                    cancel(detail);
		                    df.reject(detail);
		                }
		            };
		            var _dependOn = function(promise) {
		                var _this = this;
		                if (promise.abort) {
		                    this.dependency = promise;
		                    promise.always(function() {
		                        _this.dependency = null;
		                    });
		                } else {
		                    console.error(TAG + "[set] dependency object doesn't have 'abort()' method.");
		                }
		                return promise;
		            };
		            var target = $.extend({}, {
		                dependency: null,
		                callReject: false
		            }, extendOptions);
		            var promise = df.promise(target);
		            if (null == promise.abort) {
		                promise.abort = _abort.bind(promise);
		            }
		            if (null == promise.dependOn) {
		                promise.dependOn = _dependOn.bind(promise);
		            }
		            return promise;
		        }
		        CDP.makePromise = makePromise;
		        function wait() {
		            var deferreds = [];
		            for (var _i = 0; _i < arguments.length; _i++) {
		                deferreds[_i] = arguments[_i];
		            }
		            var _deferreds = [].concat.apply([], deferreds);
		            var df = $.Deferred();
		            var results = [];
		            var initialized = false;
		            var isFinished = function() {
		                if (!initialized) {
		                    return false;
		                } else {
		                    return !results.some(function(element) {
		                        return "pending" === element.status;
		                    });
		                }
		            };
		            _deferreds.forEach(function(deferred, index) {
		                results.push({
		                    status: "pending",
		                    args: null
		                });
		                deferred.then(function() {
		                    var args = [];
		                    for (var _i = 0; _i < arguments.length; _i++) {
		                        args[_i] = arguments[_i];
		                    }
		                    results[index].status = "resolved";
		                    results[index].args = args;
		                }, function() {
		                    var args = [];
		                    for (var _i = 0; _i < arguments.length; _i++) {
		                        args[_i] = arguments[_i];
		                    }
		                    results[index].status = "rejected";
		                    results[index].args = args;
		                }).always(function() {
		                    if (isFinished()) {
		                        df.resolve(results);
		                    }
		                });
		            });
		            initialized = true;
		            if (isFinished()) {
		                df.resolve(results);
		            }
		            return df.promise();
		        }
		        CDP.wait = wait;
		        var PromiseManager = function() {
		            function PromiseManager() {
		                this._pool = [];
		                this._id = 0;
		            }
		            PromiseManager.prototype.add = function(promise) {
		                var _this = this;
		                if (promise == null) {
		                    return null;
		                }
		                if (!promise.abort) {
		                    console.error(TAG + "[add] promise object doesn't have 'abort()' method.");
		                    return promise;
		                }
		                var cookie = {
		                    promise: promise,
		                    id: this._id++
		                };
		                this._pool.push(cookie);
		                promise.always(function() {
		                    _this._pool = _this._pool.filter(function(element) {
		                        if (element.id !== cookie.id) {
		                            return true;
		                        } else {
		                            return false;
		                        }
		                    });
		                });
		                return promise;
		            };
		            PromiseManager.prototype.cancel = function(info) {
		                var promises = this.promises();
		                promises.forEach(function(element) {
		                    if (element.abort) {
		                        element.abort(info);
		                    }
		                });
		                return wait.apply(null, promises);
		            };
		            PromiseManager.prototype.promises = function() {
		                return this._pool.map(function(element) {
		                    return element.promise;
		                });
		            };
		            return PromiseManager;
		        }();
		        CDP.PromiseManager = PromiseManager;
		    })(CDP || (CDP = {}));
		    return CDP;
		});

		(function(global, factory) {
		     true ? module.exports = factory() : typeof define === "function" && define.amd ? define("jqueryI18next", factory) : global.jqueryI18next = factory();
		})(window, function() {
		    "use strict";
		    var _extends = Object.assign || function(target) {
		        for (var i = 1; i < arguments.length; i++) {
		            var source = arguments[i];
		            for (var key in source) {
		                if (Object.prototype.hasOwnProperty.call(source, key)) {
		                    target[key] = source[key];
		                }
		            }
		        }
		        return target;
		    };
		    var defaults = {
		        tName: "t",
		        i18nName: "i18n",
		        handleName: "localize",
		        selectorAttr: "data-i18n",
		        targetAttr: "i18n-target",
		        optionsAttr: "i18n-options",
		        useOptionsAttr: false,
		        parseDefaultValueFromContent: true
		    };
		    function init(i18next, $) {
		        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		        options = _extends({}, defaults, options);
		        function parse(ele, key, opts) {
		            if (key.length === 0) return;
		            var attr = "text";
		            if (key.indexOf("[") === 0) {
		                var parts = key.split("]");
		                key = parts[1];
		                attr = parts[0].substr(1, parts[0].length - 1);
		            }
		            if (key.indexOf(";") === key.length - 1) {
		                key = key.substr(0, key.length - 2);
		            }
		            function extendDefault(o, val) {
		                if (!options.parseDefaultValueFromContent) return o;
		                return _extends({}, o, {
		                    defaultValue: val
		                });
		            }
		            if (attr === "html") {
		                ele.html(i18next.t(key, extendDefault(opts, ele.html())));
		            } else if (attr === "text") {
		                ele.text(i18next.t(key, extendDefault(opts, ele.text())));
		            } else if (attr === "prepend") {
		                ele.prepend(i18next.t(key, extendDefault(opts, ele.html())));
		            } else if (attr === "append") {
		                ele.append(i18next.t(key, extendDefault(opts, ele.html())));
		            } else if (attr.indexOf("data-") === 0) {
		                var dataAttr = attr.substr("data-".length);
		                var translated = i18next.t(key, extendDefault(opts, ele.data(dataAttr)));
		                ele.data(dataAttr, translated);
		                ele.attr(attr, translated);
		            } else {
		                ele.attr(attr, i18next.t(key, extendDefault(opts, ele.attr(attr))));
		            }
		        }
		        function localize(ele, opts) {
		            var key = ele.attr(options.selectorAttr);
		            if (!key && typeof key !== "undefined" && key !== false) key = ele.text() || ele.val();
		            if (!key) return;
		            var target = ele, targetSelector = ele.data(options.targetAttr);
		            if (targetSelector) target = ele.find(targetSelector) || ele;
		            if (!opts && options.useOptionsAttr === true) opts = ele.data(options.optionsAttr);
		            opts = opts || {};
		            if (key.indexOf(";") >= 0) {
		                var keys = key.split(";");
		                $.each(keys, function(m, k) {
		                    if (k !== "") parse(target, k, opts);
		                });
		            } else {
		                parse(target, key, opts);
		            }
		            if (options.useOptionsAttr === true) {
		                var clone = {};
		                clone = _extends({
		                    clone: clone
		                }, opts);
		                delete clone.lng;
		                ele.data(options.optionsAttr, clone);
		            }
		        }
		        function handle(opts) {
		            return this.each(function() {
		                localize($(this), opts);
		                var elements = $(this).find("[" + options.selectorAttr + "]");
		                elements.each(function() {
		                    localize($(this), opts);
		                });
		            });
		        }
		        $[options.tName] = i18next.t.bind(i18next);
		        $[options.i18nName] = i18next;
		        $.fn[options.handleName] = handle;
		    }
		    var index = {
		        init: init
		    };
		    return index;
		});

		(function(root, factory) {
		    if (true) {
		        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(1), __WEBPACK_LOCAL_MODULE_0__ ], __WEBPACK_LOCAL_MODULE_2__ = (function($, CDP) {
		            return factory($, CDP);
		        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));
		    } else if (typeof exports === "object") {
		        module.exports = factory(require("jquery"), require("cdp.core"));
		    } else {
		        factory(root.jQuery || root.$, root.CDP || (root.CDP = {}));
		    }
		})(window, function ($, CDP) {
		    var CDP;
		    (function(CDP) {
		        var TAG = "[CDP.i18n] ";
		        function initializeI18N(options) {
		            var df = $.Deferred();
		            var i18nSettings = options || {};
		            var i18nOptions = function(resources) {
		                if (resources) {
		                    for (var lng in resources) {
		                        if (resources.hasOwnProperty(lng)) {
		                            for (var ns in resources[lng]) {
		                                if (resources[lng].hasOwnProperty(ns)) {
		                                    resources[lng][ns] = getLocaleFallbackResource(resources[lng][ns]);
		                                }
		                            }
		                        }
		                    }
		                    i18nSettings.options.resources = resources;
		                    return i18nSettings.options;
		                } else {
		                    return i18nSettings.options;
		                }
		            }(i18nSettings.fallbackResources);
		            __webpack_require__.e/* require */(1, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [ __webpack_require__(5) ]; (function($18Next) {
		                __webpack_require__.e/* require */(2, function(__webpack_require__) { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [ __webpack_require__(6), __webpack_require__(22), __webpack_require__(23), __webpack_require__(24), __webpack_require__(25) ]; (function(i18next, Backend, Cache, PostProcessor, LanguageDetector) {
		                    i18next.use(Backend).use(Cache).use(PostProcessor).use(LanguageDetector).init(i18nOptions, function(error, t) {
		                        $18Next.init(i18next, $, {
		                            tName: "t",
		                            i18nName: "i18n",
		                            handleName: "localize",
		                            selectorAttr: "data-i18n",
		                            targetAttr: "i18n-target",
		                            optionsAttr: "i18n-options",
		                            useOptionsAttr: false,
		                            parseDefaultValueFromContent: true
		                        });
		                        if (i18next.options.resources && i18next.options.preload) {
		                            var _preload_1 = i18next.options.preload;
		                            var _resources_1 = i18next.options.resources;
		                            delete i18next.options.resources;
		                            delete i18next.options.preload;
		                            i18next.loadLanguages(_preload_1, function() {
		                                i18next.options.resources = _resources_1;
		                                i18next.options.preload = _preload_1;
		                                CDP.i18n = i18next;
		                                df.resolve();
		                            });
		                        } else {
		                            CDP.i18n = i18next;
		                            df.resolve();
		                        }
		                    });
		                }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));});
		            }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));});
		            return df.promise();
		        }
		        CDP.initializeI18N = initializeI18N;
		        function getLocaleFallbackResource(path) {
		            var json;
		            $.ajax({
		                url: toUrl(path),
		                method: "GET",
		                async: false,
		                dataType: "json",
		                success: function(data) {
		                    json = data;
		                },
		                error: function(data, status) {
		                    console.log(TAG + "ajax request failed. status: " + status);
		                }
		            });
		            return json;
		        }
		        function toUrl(path) {
		            if (!path && "/" !== path[0]) {
		                console.error(TAG + "invalid path. path: " + path);
		            } else {
		                return CDP.webRoot + path.slice(1);
		            }
		        }
		    })(CDP || (CDP = {}));
		    return CDP;
		});

		(function(global, factory) {
		     true ? module.exports = factory() : typeof define === "function" && define.amd ? define("i18next", factory) : global.i18next = factory();
		})(window, function () {
		    "use strict";
		    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
		        return typeof obj;
		    } : function(obj) {
		        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
		    };
		    var asyncGenerator = function() {
		        function AwaitValue(value) {
		            this.value = value;
		        }
		        function AsyncGenerator(gen) {
		            var front, back;
		            function send(key, arg) {
		                return new Promise(function(resolve, reject) {
		                    var request = {
		                        key: key,
		                        arg: arg,
		                        resolve: resolve,
		                        reject: reject,
		                        next: null
		                    };
		                    if (back) {
		                        back = back.next = request;
		                    } else {
		                        front = back = request;
		                        resume(key, arg);
		                    }
		                });
		            }
		            function resume(key, arg) {
		                try {
		                    var result = gen[key](arg);
		                    var value = result.value;
		                    if (value instanceof AwaitValue) {
		                        Promise.resolve(value.value).then(function(arg) {
		                            resume("next", arg);
		                        }, function(arg) {
		                            resume("throw", arg);
		                        });
		                    } else {
		                        settle(result.done ? "return" : "normal", result.value);
		                    }
		                } catch (err) {
		                    settle("throw", err);
		                }
		            }
		            function settle(type, value) {
		                switch (type) {
		                  case "return":
		                    front.resolve({
		                        value: value,
		                        done: true
		                    });
		                    break;

		                  case "throw":
		                    front.reject(value);
		                    break;

		                  default:
		                    front.resolve({
		                        value: value,
		                        done: false
		                    });
		                    break;
		                }
		                front = front.next;
		                if (front) {
		                    resume(front.key, front.arg);
		                } else {
		                    back = null;
		                }
		            }
		            this._invoke = send;
		            if (typeof gen.return !== "function") {
		                this.return = undefined;
		            }
		        }
		        if (typeof Symbol === "function" && Symbol.asyncIterator) {
		            AsyncGenerator.prototype[Symbol.asyncIterator] = function() {
		                return this;
		            };
		        }
		        AsyncGenerator.prototype.next = function(arg) {
		            return this._invoke("next", arg);
		        };
		        AsyncGenerator.prototype.throw = function(arg) {
		            return this._invoke("throw", arg);
		        };
		        AsyncGenerator.prototype.return = function(arg) {
		            return this._invoke("return", arg);
		        };
		        return {
		            wrap: function(fn) {
		                return function() {
		                    return new AsyncGenerator(fn.apply(this, arguments));
		                };
		            },
		            await: function(value) {
		                return new AwaitValue(value);
		            }
		        };
		    }();
		    var classCallCheck = function(instance, Constructor) {
		        if (!(instance instanceof Constructor)) {
		            throw new TypeError("Cannot call a class as a function");
		        }
		    };
		    var _extends = Object.assign || function(target) {
		        for (var i = 1; i < arguments.length; i++) {
		            var source = arguments[i];
		            for (var key in source) {
		                if (Object.prototype.hasOwnProperty.call(source, key)) {
		                    target[key] = source[key];
		                }
		            }
		        }
		        return target;
		    };
		    var get = function get(object, property, receiver) {
		        if (object === null) object = Function.prototype;
		        var desc = Object.getOwnPropertyDescriptor(object, property);
		        if (desc === undefined) {
		            var parent = Object.getPrototypeOf(object);
		            if (parent === null) {
		                return undefined;
		            } else {
		                return get(parent, property, receiver);
		            }
		        } else if ("value" in desc) {
		            return desc.value;
		        } else {
		            var getter = desc.get;
		            if (getter === undefined) {
		                return undefined;
		            }
		            return getter.call(receiver);
		        }
		    };
		    var inherits = function(subClass, superClass) {
		        if (typeof superClass !== "function" && superClass !== null) {
		            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
		        }
		        subClass.prototype = Object.create(superClass && superClass.prototype, {
		            constructor: {
		                value: subClass,
		                enumerable: false,
		                writable: true,
		                configurable: true
		            }
		        });
		        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
		    };
		    var possibleConstructorReturn = function(self, call) {
		        if (!self) {
		            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
		        }
		        return call && (typeof call === "object" || typeof call === "function") ? call : self;
		    };
		    var set = function set(object, property, value, receiver) {
		        var desc = Object.getOwnPropertyDescriptor(object, property);
		        if (desc === undefined) {
		            var parent = Object.getPrototypeOf(object);
		            if (parent !== null) {
		                set(parent, property, value, receiver);
		            }
		        } else if ("value" in desc && desc.writable) {
		            desc.value = value;
		        } else {
		            var setter = desc.set;
		            if (setter !== undefined) {
		                setter.call(receiver, value);
		            }
		        }
		        return value;
		    };
		    var slicedToArray = function() {
		        function sliceIterator(arr, i) {
		            var _arr = [];
		            var _n = true;
		            var _d = false;
		            var _e = undefined;
		            try {
		                for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
		                    _arr.push(_s.value);
		                    if (i && _arr.length === i) break;
		                }
		            } catch (err) {
		                _d = true;
		                _e = err;
		            } finally {
		                try {
		                    if (!_n && _i["return"]) _i["return"]();
		                } finally {
		                    if (_d) throw _e;
		                }
		            }
		            return _arr;
		        }
		        return function(arr, i) {
		            if (Array.isArray(arr)) {
		                return arr;
		            } else if (Symbol.iterator in Object(arr)) {
		                return sliceIterator(arr, i);
		            } else {
		                throw new TypeError("Invalid attempt to destructure non-iterable instance");
		            }
		        };
		    }();
		    var consoleLogger = {
		        type: "logger",
		        log: function log(args) {
		            this._output("log", args);
		        },
		        warn: function warn(args) {
		            this._output("warn", args);
		        },
		        error: function error(args) {
		            this._output("error", args);
		        },
		        _output: function _output(type, args) {
		            if (console && console[type]) console[type].apply(console, Array.prototype.slice.call(args));
		        }
		    };
		    var Logger = function() {
		        function Logger(concreteLogger) {
		            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		            classCallCheck(this, Logger);
		            this.init(concreteLogger, options);
		        }
		        Logger.prototype.init = function init(concreteLogger) {
		            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		            this.prefix = options.prefix || "i18next:";
		            this.logger = concreteLogger || consoleLogger;
		            this.options = options;
		            this.debug = options.debug === false ? false : true;
		        };
		        Logger.prototype.setDebug = function setDebug(bool) {
		            this.debug = bool;
		        };
		        Logger.prototype.log = function log() {
		            this.forward(arguments, "log", "", true);
		        };
		        Logger.prototype.warn = function warn() {
		            this.forward(arguments, "warn", "", true);
		        };
		        Logger.prototype.error = function error() {
		            this.forward(arguments, "error", "");
		        };
		        Logger.prototype.deprecate = function deprecate() {
		            this.forward(arguments, "warn", "WARNING DEPRECATED: ", true);
		        };
		        Logger.prototype.forward = function forward(args, lvl, prefix, debugOnly) {
		            if (debugOnly && !this.debug) return;
		            if (typeof args[0] === "string") args[0] = prefix + this.prefix + " " + args[0];
		            this.logger[lvl](args);
		        };
		        Logger.prototype.create = function create(moduleName) {
		            var sub = new Logger(this.logger, _extends({
		                prefix: this.prefix + ":" + moduleName + ":"
		            }, this.options));
		            return sub;
		        };
		        return Logger;
		    }();
		    var baseLogger = new Logger();
		    var EventEmitter = function() {
		        function EventEmitter() {
		            classCallCheck(this, EventEmitter);
		            this.observers = {};
		        }
		        EventEmitter.prototype.on = function on(events, listener) {
		            var _this = this;
		            events.split(" ").forEach(function(event) {
		                _this.observers[event] = _this.observers[event] || [];
		                _this.observers[event].push(listener);
		            });
		        };
		        EventEmitter.prototype.off = function off(event, listener) {
		            var _this2 = this;
		            if (!this.observers[event]) {
		                return;
		            }
		            this.observers[event].forEach(function() {
		                if (!listener) {
		                    delete _this2.observers[event];
		                } else {
		                    var index = _this2.observers[event].indexOf(listener);
		                    if (index > -1) {
		                        _this2.observers[event].splice(index, 1);
		                    }
		                }
		            });
		        };
		        EventEmitter.prototype.emit = function emit(event) {
		            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		                args[_key - 1] = arguments[_key];
		            }
		            if (this.observers[event]) {
		                this.observers[event].forEach(function(observer) {
		                    observer.apply(undefined, args);
		                });
		            }
		            if (this.observers["*"]) {
		                this.observers["*"].forEach(function(observer) {
		                    var _ref;
		                    observer.apply(observer, (_ref = [ event ]).concat.apply(_ref, args));
		                });
		            }
		        };
		        return EventEmitter;
		    }();
		    function makeString(object) {
		        if (object == null) return "";
		        return "" + object;
		    }
		    function copy(a, s, t) {
		        a.forEach(function(m) {
		            if (s[m]) t[m] = s[m];
		        });
		    }
		    function getLastOfPath(object, path, Empty) {
		        function cleanKey(key) {
		            return key && key.indexOf("###") > -1 ? key.replace(/###/g, ".") : key;
		        }
		        var stack = typeof path !== "string" ? [].concat(path) : path.split(".");
		        while (stack.length > 1) {
		            if (!object) return {};
		            var key = cleanKey(stack.shift());
		            if (!object[key] && Empty) object[key] = new Empty();
		            object = object[key];
		        }
		        if (!object) return {};
		        return {
		            obj: object,
		            k: cleanKey(stack.shift())
		        };
		    }
		    function setPath(object, path, newValue) {
		        var _getLastOfPath = getLastOfPath(object, path, Object), obj = _getLastOfPath.obj, k = _getLastOfPath.k;
		        obj[k] = newValue;
		    }
		    function pushPath(object, path, newValue, concat) {
		        var _getLastOfPath2 = getLastOfPath(object, path, Object), obj = _getLastOfPath2.obj, k = _getLastOfPath2.k;
		        obj[k] = obj[k] || [];
		        if (concat) obj[k] = obj[k].concat(newValue);
		        if (!concat) obj[k].push(newValue);
		    }
		    function getPath(object, path) {
		        var _getLastOfPath3 = getLastOfPath(object, path), obj = _getLastOfPath3.obj, k = _getLastOfPath3.k;
		        if (!obj) return undefined;
		        return obj[k];
		    }
		    function deepExtend(target, source, overwrite) {
		        for (var prop in source) {
		            if (prop in target) {
		                if (typeof target[prop] === "string" || target[prop] instanceof String || typeof source[prop] === "string" || source[prop] instanceof String) {
		                    if (overwrite) target[prop] = source[prop];
		                } else {
		                    deepExtend(target[prop], source[prop], overwrite);
		                }
		            } else {
		                target[prop] = source[prop];
		            }
		        }
		        return target;
		    }
		    function regexEscape(str) {
		        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
		    }
		    var _entityMap = {
		        "&": "&amp;",
		        "<": "&lt;",
		        ">": "&gt;",
		        '"': "&quot;",
		        "'": "&#39;",
		        "/": "&#x2F;"
		    };
		    function escape(data) {
		        if (typeof data === "string") {
		            return data.replace(/[&<>"'\/]/g, function(s) {
		                return _entityMap[s];
		            });
		        } else {
		            return data;
		        }
		    }
		    var ResourceStore = function(_EventEmitter) {
		        inherits(ResourceStore, _EventEmitter);
		        function ResourceStore() {
		            var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
		                ns: [ "translation" ],
		                defaultNS: "translation"
		            };
		            classCallCheck(this, ResourceStore);
		            var _this = possibleConstructorReturn(this, _EventEmitter.call(this));
		            _this.data = data;
		            _this.options = options;
		            return _this;
		        }
		        ResourceStore.prototype.addNamespaces = function addNamespaces(ns) {
		            if (this.options.ns.indexOf(ns) < 0) {
		                this.options.ns.push(ns);
		            }
		        };
		        ResourceStore.prototype.removeNamespaces = function removeNamespaces(ns) {
		            var index = this.options.ns.indexOf(ns);
		            if (index > -1) {
		                this.options.ns.splice(index, 1);
		            }
		        };
		        ResourceStore.prototype.getResource = function getResource(lng, ns, key) {
		            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
		            var keySeparator = options.keySeparator || this.options.keySeparator;
		            if (keySeparator === undefined) keySeparator = ".";
		            var path = [ lng, ns ];
		            if (key && typeof key !== "string") path = path.concat(key);
		            if (key && typeof key === "string") path = path.concat(keySeparator ? key.split(keySeparator) : key);
		            if (lng.indexOf(".") > -1) {
		                path = lng.split(".");
		            }
		            return getPath(this.data, path);
		        };
		        ResourceStore.prototype.addResource = function addResource(lng, ns, key, value) {
		            var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
		                silent: false
		            };
		            var keySeparator = this.options.keySeparator;
		            if (keySeparator === undefined) keySeparator = ".";
		            var path = [ lng, ns ];
		            if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);
		            if (lng.indexOf(".") > -1) {
		                path = lng.split(".");
		                value = ns;
		                ns = path[1];
		            }
		            this.addNamespaces(ns);
		            setPath(this.data, path, value);
		            if (!options.silent) this.emit("added", lng, ns, key, value);
		        };
		        ResourceStore.prototype.addResources = function addResources(lng, ns, resources) {
		            for (var m in resources) {
		                if (typeof resources[m] === "string") this.addResource(lng, ns, m, resources[m], {
		                    silent: true
		                });
		            }
		            this.emit("added", lng, ns, resources);
		        };
		        ResourceStore.prototype.addResourceBundle = function addResourceBundle(lng, ns, resources, deep, overwrite) {
		            var path = [ lng, ns ];
		            if (lng.indexOf(".") > -1) {
		                path = lng.split(".");
		                deep = resources;
		                resources = ns;
		                ns = path[1];
		            }
		            this.addNamespaces(ns);
		            var pack = getPath(this.data, path) || {};
		            if (deep) {
		                deepExtend(pack, resources, overwrite);
		            } else {
		                pack = _extends({}, pack, resources);
		            }
		            setPath(this.data, path, pack);
		            this.emit("added", lng, ns, resources);
		        };
		        ResourceStore.prototype.removeResourceBundle = function removeResourceBundle(lng, ns) {
		            if (this.hasResourceBundle(lng, ns)) {
		                delete this.data[lng][ns];
		            }
		            this.removeNamespaces(ns);
		            this.emit("removed", lng, ns);
		        };
		        ResourceStore.prototype.hasResourceBundle = function hasResourceBundle(lng, ns) {
		            return this.getResource(lng, ns) !== undefined;
		        };
		        ResourceStore.prototype.getResourceBundle = function getResourceBundle(lng, ns) {
		            if (!ns) ns = this.options.defaultNS;
		            if (this.options.compatibilityAPI === "v1") return _extends({}, this.getResource(lng, ns));
		            return this.getResource(lng, ns);
		        };
		        ResourceStore.prototype.toJSON = function toJSON() {
		            return this.data;
		        };
		        return ResourceStore;
		    }(EventEmitter);
		    var postProcessor = {
		        processors: {},
		        addPostProcessor: function addPostProcessor(module) {
		            this.processors[module.name] = module;
		        },
		        handle: function handle(processors, value, key, options, translator) {
		            var _this = this;
		            processors.forEach(function(processor) {
		                if (_this.processors[processor]) value = _this.processors[processor].process(value, key, options, translator);
		            });
		            return value;
		        }
		    };
		    function convertInterpolation(options) {
		        options.interpolation = {
		            unescapeSuffix: "HTML"
		        };
		        options.interpolation.prefix = options.interpolationPrefix || "__";
		        options.interpolation.suffix = options.interpolationSuffix || "__";
		        options.interpolation.escapeValue = options.escapeInterpolation || false;
		        options.interpolation.nestingPrefix = options.reusePrefix || "$t(";
		        options.interpolation.nestingSuffix = options.reuseSuffix || ")";
		        return options;
		    }
		    function convertAPIOptions(options) {
		        if (options.resStore) options.resources = options.resStore;
		        if (options.ns && options.ns.defaultNs) {
		            options.defaultNS = options.ns.defaultNs;
		            options.ns = options.ns.namespaces;
		        } else {
		            options.defaultNS = options.ns || "translation";
		        }
		        if (options.fallbackToDefaultNS && options.defaultNS) options.fallbackNS = options.defaultNS;
		        options.saveMissing = options.sendMissing;
		        options.saveMissingTo = options.sendMissingTo || "current";
		        options.returnNull = options.fallbackOnNull ? false : true;
		        options.returnEmptyString = options.fallbackOnEmpty ? false : true;
		        options.returnObjects = options.returnObjectTrees;
		        options.joinArrays = "\n";
		        options.returnedObjectHandler = options.objectTreeKeyHandler;
		        options.parseMissingKeyHandler = options.parseMissingKey;
		        options.appendNamespaceToMissingKey = true;
		        options.nsSeparator = options.nsseparator;
		        options.keySeparator = options.keyseparator;
		        if (options.shortcutFunction === "sprintf") {
		            options.overloadTranslationOptionHandler = function(args) {
		                var values = [];
		                for (var i = 1; i < args.length; i++) {
		                    values.push(args[i]);
		                }
		                return {
		                    postProcess: "sprintf",
		                    sprintf: values
		                };
		            };
		        }
		        options.whitelist = options.lngWhitelist;
		        options.preload = options.preload;
		        if (options.load === "current") options.load = "currentOnly";
		        if (options.load === "unspecific") options.load = "languageOnly";
		        options.backend = options.backend || {};
		        options.backend.loadPath = options.resGetPath || "locales/__lng__/__ns__.json";
		        options.backend.addPath = options.resPostPath || "locales/add/__lng__/__ns__";
		        options.backend.allowMultiLoading = options.dynamicLoad;
		        options.cache = options.cache || {};
		        options.cache.prefix = "res_";
		        options.cache.expirationTime = 7 * 24 * 60 * 60 * 1e3;
		        options.cache.enabled = options.useLocalStorage ? true : false;
		        options = convertInterpolation(options);
		        if (options.defaultVariables) options.interpolation.defaultVariables = options.defaultVariables;
		        return options;
		    }
		    function convertJSONOptions(options) {
		        options = convertInterpolation(options);
		        options.joinArrays = "\n";
		        return options;
		    }
		    function convertTOptions(options) {
		        if (options.interpolationPrefix || options.interpolationSuffix || options.escapeInterpolation) {
		            options = convertInterpolation(options);
		        }
		        options.nsSeparator = options.nsseparator;
		        options.keySeparator = options.keyseparator;
		        options.returnObjects = options.returnObjectTrees;
		        return options;
		    }
		    function appendBackwardsAPI(i18n) {
		        i18n.lng = function() {
		            baseLogger.deprecate("i18next.lng() can be replaced by i18next.language for detected language or i18next.languages for languages ordered by translation lookup.");
		            return i18n.services.languageUtils.toResolveHierarchy(i18n.language)[0];
		        };
		        i18n.preload = function(lngs, cb) {
		            baseLogger.deprecate("i18next.preload() can be replaced with i18next.loadLanguages()");
		            i18n.loadLanguages(lngs, cb);
		        };
		        i18n.setLng = function(lng, options, callback) {
		            baseLogger.deprecate("i18next.setLng() can be replaced with i18next.changeLanguage() or i18next.getFixedT() to get a translation function with fixed language or namespace.");
		            if (typeof options === "function") {
		                callback = options;
		                options = {};
		            }
		            if (!options) options = {};
		            if (options.fixLng === true) {
		                if (callback) return callback(null, i18n.getFixedT(lng));
		            }
		            i18n.changeLanguage(lng, callback);
		        };
		        i18n.addPostProcessor = function(name, fc) {
		            baseLogger.deprecate("i18next.addPostProcessor() can be replaced by i18next.use({ type: 'postProcessor', name: 'name', process: fc })");
		            i18n.use({
		                type: "postProcessor",
		                name: name,
		                process: fc
		            });
		        };
		    }
		    var Translator = function(_EventEmitter) {
		        inherits(Translator, _EventEmitter);
		        function Translator(services) {
		            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		            classCallCheck(this, Translator);
		            var _this = possibleConstructorReturn(this, _EventEmitter.call(this));
		            copy([ "resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector" ], services, _this);
		            _this.options = options;
		            _this.logger = baseLogger.create("translator");
		            return _this;
		        }
		        Translator.prototype.changeLanguage = function changeLanguage(lng) {
		            if (lng) this.language = lng;
		        };
		        Translator.prototype.exists = function exists(key) {
		            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
		                interpolation: {}
		            };
		            if (this.options.compatibilityAPI === "v1") {
		                options = convertTOptions(options);
		            }
		            return this.resolve(key, options) !== undefined;
		        };
		        Translator.prototype.extractFromKey = function extractFromKey(key, options) {
		            var nsSeparator = options.nsSeparator || this.options.nsSeparator;
		            if (nsSeparator === undefined) nsSeparator = ":";
		            var namespaces = options.ns || this.options.defaultNS;
		            if (nsSeparator && key.indexOf(nsSeparator) > -1) {
		                var parts = key.split(nsSeparator);
		                namespaces = parts[0];
		                key = parts[1];
		            }
		            if (typeof namespaces === "string") namespaces = [ namespaces ];
		            return {
		                key: key,
		                namespaces: namespaces
		            };
		        };
		        Translator.prototype.translate = function translate(keys) {
		            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		            if ((typeof options === "undefined" ? "undefined" : _typeof(options)) !== "object") {
		                options = this.options.overloadTranslationOptionHandler(arguments);
		            } else if (this.options.compatibilityAPI === "v1") {
		                options = convertTOptions(options);
		            }
		            if (keys === undefined || keys === null || keys === "") return "";
		            if (typeof keys === "number") keys = String(keys);
		            if (typeof keys === "string") keys = [ keys ];
		            var lng = options.lng || this.language;
		            if (lng && lng.toLowerCase() === "cimode") return keys[keys.length - 1];
		            var keySeparator = options.keySeparator || this.options.keySeparator || ".";
		            var _extractFromKey = this.extractFromKey(keys[keys.length - 1], options), key = _extractFromKey.key, namespaces = _extractFromKey.namespaces;
		            var namespace = namespaces[namespaces.length - 1];
		            var res = this.resolve(keys, options);
		            var resType = Object.prototype.toString.apply(res);
		            var noObject = [ "[object Number]", "[object Function]", "[object RegExp]" ];
		            var joinArrays = options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;
		            if (res && typeof res !== "string" && noObject.indexOf(resType) < 0 && !(joinArrays && resType === "[object Array]")) {
		                if (!options.returnObjects && !this.options.returnObjects) {
		                    this.logger.warn("accessing an object - but returnObjects options is not enabled!");
		                    return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(key, res, options) : "key '" + key + " (" + this.language + ")' returned an object instead of string.";
		                }
		                var copy$$1 = resType === "[object Array]" ? [] : {};
		                for (var m in res) {
		                    copy$$1[m] = this.translate("" + key + keySeparator + m, _extends({
		                        joinArrays: false,
		                        ns: namespaces
		                    }, options));
		                }
		                res = copy$$1;
		            } else if (joinArrays && resType === "[object Array]") {
		                res = res.join(joinArrays);
		                if (res) res = this.extendTranslation(res, key, options);
		            } else {
		                var usedDefault = false, usedKey = false;
		                if (!this.isValidLookup(res) && options.defaultValue !== undefined) {
		                    usedDefault = true;
		                    res = options.defaultValue;
		                }
		                if (!this.isValidLookup(res)) {
		                    usedKey = true;
		                    res = key;
		                }
		                if (usedKey || usedDefault) {
		                    this.logger.log("missingKey", lng, namespace, key, res);
		                    var lngs = [];
		                    var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
		                    if (this.options.saveMissingTo === "fallback" && fallbackLngs && fallbackLngs[0]) {
		                        for (var i = 0; i < fallbackLngs.length; i++) {
		                            lngs.push(fallbackLngs[i]);
		                        }
		                    } else if (this.options.saveMissingTo === "all") {
		                        lngs = this.languageUtils.toResolveHierarchy(options.lng || this.language);
		                    } else {
		                        lngs.push(options.lng || this.language);
		                    }
		                    if (this.options.saveMissing) {
		                        if (this.options.missingKeyHandler) {
		                            this.options.missingKeyHandler(lngs, namespace, key, res);
		                        } else if (this.backendConnector && this.backendConnector.saveMissing) {
		                            this.backendConnector.saveMissing(lngs, namespace, key, res);
		                        }
		                    }
		                    this.emit("missingKey", lngs, namespace, key, res);
		                }
		                res = this.extendTranslation(res, key, options);
		                if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = namespace + ":" + key;
		                if (usedKey && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(res);
		            }
		            return res;
		        };
		        Translator.prototype.extendTranslation = function extendTranslation(res, key, options) {
		            var _this2 = this;
		            if (options.interpolation) this.interpolator.init(_extends({}, options, {
		                interpolation: _extends({}, this.options.interpolation, options.interpolation)
		            }));
		            var data = options.replace && typeof options.replace !== "string" ? options.replace : options;
		            if (this.options.interpolation.defaultVariables) data = _extends({}, this.options.interpolation.defaultVariables, data);
		            res = this.interpolator.interpolate(res, data, this.language);
		            res = this.interpolator.nest(res, function() {
		                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		                    args[_key] = arguments[_key];
		                }
		                return _this2.translate.apply(_this2, args);
		            }, options);
		            if (options.interpolation) this.interpolator.reset();
		            var postProcess = options.postProcess || this.options.postProcess;
		            var postProcessorNames = typeof postProcess === "string" ? [ postProcess ] : postProcess;
		            if (res !== undefined && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
		                res = postProcessor.handle(postProcessorNames, res, key, options, this);
		            }
		            return res;
		        };
		        Translator.prototype.resolve = function resolve(keys) {
		            var _this3 = this;
		            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		            var found = void 0;
		            if (typeof keys === "string") keys = [ keys ];
		            keys.forEach(function(k) {
		                if (_this3.isValidLookup(found)) return;
		                var _extractFromKey2 = _this3.extractFromKey(k, options), key = _extractFromKey2.key, namespaces = _extractFromKey2.namespaces;
		                if (_this3.options.fallbackNS) namespaces = namespaces.concat(_this3.options.fallbackNS);
		                var needsPluralHandling = options.count !== undefined && typeof options.count !== "string";
		                var needsContextHandling = options.context !== undefined && typeof options.context === "string" && options.context !== "";
		                var codes = options.lngs ? options.lngs : _this3.languageUtils.toResolveHierarchy(options.lng || _this3.language);
		                namespaces.forEach(function(ns) {
		                    if (_this3.isValidLookup(found)) return;
		                    codes.forEach(function(code) {
		                        if (_this3.isValidLookup(found)) return;
		                        var finalKey = key;
		                        var finalKeys = [ finalKey ];
		                        var pluralSuffix = void 0;
		                        if (needsPluralHandling) pluralSuffix = _this3.pluralResolver.getSuffix(code, options.count);
		                        if (needsPluralHandling && needsContextHandling) finalKeys.push(finalKey + pluralSuffix);
		                        if (needsContextHandling) finalKeys.push(finalKey += "" + _this3.options.contextSeparator + options.context);
		                        if (needsPluralHandling) finalKeys.push(finalKey += pluralSuffix);
		                        var possibleKey = void 0;
		                        while (possibleKey = finalKeys.pop()) {
		                            if (_this3.isValidLookup(found)) continue;
		                            found = _this3.getResource(code, ns, possibleKey, options);
		                        }
		                    });
		                });
		            });
		            return found;
		        };
		        Translator.prototype.isValidLookup = function isValidLookup(res) {
		            return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === "");
		        };
		        Translator.prototype.getResource = function getResource(code, ns, key) {
		            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
		            return this.resourceStore.getResource(code, ns, key, options);
		        };
		        return Translator;
		    }(EventEmitter);
		    function capitalize(string) {
		        return string.charAt(0).toUpperCase() + string.slice(1);
		    }
		    var LanguageUtil = function() {
		        function LanguageUtil(options) {
		            classCallCheck(this, LanguageUtil);
		            this.options = options;
		            this.whitelist = this.options.whitelist || false;
		            this.logger = baseLogger.create("languageUtils");
		        }
		        LanguageUtil.prototype.getLanguagePartFromCode = function getLanguagePartFromCode(code) {
		            if (code.indexOf("-") < 0) return code;
		            var specialCases = [ "NB-NO", "NN-NO", "nb-NO", "nn-NO", "nb-no", "nn-no" ];
		            var p = code.split("-");
		            return this.formatLanguageCode(specialCases.indexOf(code) > -1 ? p[1].toLowerCase() : p[0]);
		        };
		        LanguageUtil.prototype.getScriptPartFromCode = function getScriptPartFromCode(code) {
		            if (code.indexOf("-") < 0) return null;
		            var p = code.split("-");
		            if (p.length === 2) return null;
		            p.pop();
		            return this.formatLanguageCode(p.join("-"));
		        };
		        LanguageUtil.prototype.getLanguagePartFromCode = function getLanguagePartFromCode(code) {
		            if (code.indexOf("-") < 0) return code;
		            var specialCases = [ "NB-NO", "NN-NO", "nb-NO", "nn-NO", "nb-no", "nn-no" ];
		            var p = code.split("-");
		            return this.formatLanguageCode(specialCases.indexOf(code) > -1 ? p[1].toLowerCase() : p[0]);
		        };
		        LanguageUtil.prototype.formatLanguageCode = function formatLanguageCode(code) {
		            if (typeof code === "string" && code.indexOf("-") > -1) {
		                var specialCases = [ "hans", "hant", "latn", "cyrl", "cans", "mong", "arab" ];
		                var p = code.split("-");
		                if (this.options.lowerCaseLng) {
		                    p = p.map(function(part) {
		                        return part.toLowerCase();
		                    });
		                } else if (p.length === 2) {
		                    p[0] = p[0].toLowerCase();
		                    p[1] = p[1].toUpperCase();
		                    if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
		                } else if (p.length === 3) {
		                    p[0] = p[0].toLowerCase();
		                    if (p[1].length === 2) p[1] = p[1].toUpperCase();
		                    if (p[0] !== "sgn" && p[2].length === 2) p[2] = p[2].toUpperCase();
		                    if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
		                    if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
		                }
		                return p.join("-");
		            } else {
		                return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
		            }
		        };
		        LanguageUtil.prototype.isWhitelisted = function isWhitelisted(code, exactMatch) {
		            if (this.options.load === "languageOnly" || this.options.nonExplicitWhitelist && !exactMatch) {
		                code = this.getLanguagePartFromCode(code);
		            }
		            return !this.whitelist || !this.whitelist.length || this.whitelist.indexOf(code) > -1 ? true : false;
		        };
		        LanguageUtil.prototype.getFallbackCodes = function getFallbackCodes(fallbacks, code) {
		            if (!fallbacks) return [];
		            if (typeof fallbacks === "string") fallbacks = [ fallbacks ];
		            if (Object.prototype.toString.apply(fallbacks) === "[object Array]") return fallbacks;
		            var found = fallbacks[code];
		            if (!found) found = fallbacks[this.getScriptPartFromCode(code)];
		            if (!found) found = fallbacks[this.formatLanguageCode(code)];
		            if (!found) found = fallbacks.default;
		            return found || [];
		        };
		        LanguageUtil.prototype.toResolveHierarchy = function toResolveHierarchy(code, fallbackCode) {
		            var _this = this;
		            var fallbackCodes = this.getFallbackCodes(fallbackCode || this.options.fallbackLng || [], code);
		            var codes = [];
		            var addCode = function addCode(code) {
		                var exactMatch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		                if (!code) return;
		                if (_this.isWhitelisted(code, exactMatch)) {
		                    codes.push(code);
		                } else {
		                    _this.logger.warn("rejecting non-whitelisted language code: " + code);
		                }
		            };
		            if (typeof code === "string" && code.indexOf("-") > -1) {
		                if (this.options.load !== "languageOnly") addCode(this.formatLanguageCode(code), true);
		                if (this.options.load !== "languageOnly" && this.options.load !== "currentOnly") addCode(this.getScriptPartFromCode(code), true);
		                if (this.options.load !== "currentOnly") addCode(this.getLanguagePartFromCode(code));
		            } else if (typeof code === "string") {
		                addCode(this.formatLanguageCode(code));
		            }
		            fallbackCodes.forEach(function(fc) {
		                if (codes.indexOf(fc) < 0) addCode(_this.formatLanguageCode(fc));
		            });
		            return codes;
		        };
		        return LanguageUtil;
		    }();
		    var sets = [ {
		        lngs: [ "ach", "ak", "am", "arn", "br", "fil", "gun", "ln", "mfe", "mg", "mi", "oc", "tg", "ti", "tr", "uz", "wa" ],
		        nr: [ 1, 2 ],
		        fc: 1
		    }, {
		        lngs: [ "af", "an", "ast", "az", "bg", "bn", "ca", "da", "de", "dev", "el", "en", "eo", "es", "es_ar", "et", "eu", "fi", "fo", "fur", "fy", "gl", "gu", "ha", "he", "hi", "hu", "hy", "ia", "it", "kn", "ku", "lb", "mai", "ml", "mn", "mr", "nah", "nap", "nb", "ne", "nl", "nn", "no", "nso", "pa", "pap", "pms", "ps", "pt", "pt_br", "rm", "sco", "se", "si", "so", "son", "sq", "sv", "sw", "ta", "te", "tk", "ur", "yo" ],
		        nr: [ 1, 2 ],
		        fc: 2
		    }, {
		        lngs: [ "ay", "bo", "cgg", "fa", "id", "ja", "jbo", "ka", "kk", "km", "ko", "ky", "lo", "ms", "sah", "su", "th", "tt", "ug", "vi", "wo", "zh" ],
		        nr: [ 1 ],
		        fc: 3
		    }, {
		        lngs: [ "be", "bs", "dz", "hr", "ru", "sr", "uk" ],
		        nr: [ 1, 2, 5 ],
		        fc: 4
		    }, {
		        lngs: [ "ar" ],
		        nr: [ 0, 1, 2, 3, 11, 100 ],
		        fc: 5
		    }, {
		        lngs: [ "cs", "sk" ],
		        nr: [ 1, 2, 5 ],
		        fc: 6
		    }, {
		        lngs: [ "csb", "pl" ],
		        nr: [ 1, 2, 5 ],
		        fc: 7
		    }, {
		        lngs: [ "cy" ],
		        nr: [ 1, 2, 3, 8 ],
		        fc: 8
		    }, {
		        lngs: [ "fr" ],
		        nr: [ 1, 2 ],
		        fc: 9
		    }, {
		        lngs: [ "ga" ],
		        nr: [ 1, 2, 3, 7, 11 ],
		        fc: 10
		    }, {
		        lngs: [ "gd" ],
		        nr: [ 1, 2, 3, 20 ],
		        fc: 11
		    }, {
		        lngs: [ "is" ],
		        nr: [ 1, 2 ],
		        fc: 12
		    }, {
		        lngs: [ "jv" ],
		        nr: [ 0, 1 ],
		        fc: 13
		    }, {
		        lngs: [ "kw" ],
		        nr: [ 1, 2, 3, 4 ],
		        fc: 14
		    }, {
		        lngs: [ "lt" ],
		        nr: [ 1, 2, 10 ],
		        fc: 15
		    }, {
		        lngs: [ "lv" ],
		        nr: [ 1, 2, 0 ],
		        fc: 16
		    }, {
		        lngs: [ "mk" ],
		        nr: [ 1, 2 ],
		        fc: 17
		    }, {
		        lngs: [ "mnk" ],
		        nr: [ 0, 1, 2 ],
		        fc: 18
		    }, {
		        lngs: [ "mt" ],
		        nr: [ 1, 2, 11, 20 ],
		        fc: 19
		    }, {
		        lngs: [ "or" ],
		        nr: [ 2, 1 ],
		        fc: 2
		    }, {
		        lngs: [ "ro" ],
		        nr: [ 1, 2, 20 ],
		        fc: 20
		    }, {
		        lngs: [ "sl" ],
		        nr: [ 5, 1, 2, 3 ],
		        fc: 21
		    } ];
		    var _rulesPluralsTypes = {
		        1: function _(n) {
		            return Number(n > 1);
		        },
		        2: function _(n) {
		            return Number(n != 1);
		        },
		        3: function _(n) {
		            return 0;
		        },
		        4: function _(n) {
		            return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
		        },
		        5: function _(n) {
		            return Number(n === 0 ? 0 : n == 1 ? 1 : n == 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
		        },
		        6: function _(n) {
		            return Number(n == 1 ? 0 : n >= 2 && n <= 4 ? 1 : 2);
		        },
		        7: function _(n) {
		            return Number(n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
		        },
		        8: function _(n) {
		            return Number(n == 1 ? 0 : n == 2 ? 1 : n != 8 && n != 11 ? 2 : 3);
		        },
		        9: function _(n) {
		            return Number(n >= 2);
		        },
		        10: function _(n) {
		            return Number(n == 1 ? 0 : n == 2 ? 1 : n < 7 ? 2 : n < 11 ? 3 : 4);
		        },
		        11: function _(n) {
		            return Number(n == 1 || n == 11 ? 0 : n == 2 || n == 12 ? 1 : n > 2 && n < 20 ? 2 : 3);
		        },
		        12: function _(n) {
		            return Number(n % 10 != 1 || n % 100 == 11);
		        },
		        13: function _(n) {
		            return Number(n !== 0);
		        },
		        14: function _(n) {
		            return Number(n == 1 ? 0 : n == 2 ? 1 : n == 3 ? 2 : 3);
		        },
		        15: function _(n) {
		            return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
		        },
		        16: function _(n) {
		            return Number(n % 10 == 1 && n % 100 != 11 ? 0 : n !== 0 ? 1 : 2);
		        },
		        17: function _(n) {
		            return Number(n == 1 || n % 10 == 1 ? 0 : 1);
		        },
		        18: function _(n) {
		            return Number(n == 0 ? 0 : n == 1 ? 1 : 2);
		        },
		        19: function _(n) {
		            return Number(n == 1 ? 0 : n === 0 || n % 100 > 1 && n % 100 < 11 ? 1 : n % 100 > 10 && n % 100 < 20 ? 2 : 3);
		        },
		        20: function _(n) {
		            return Number(n == 1 ? 0 : n === 0 || n % 100 > 0 && n % 100 < 20 ? 1 : 2);
		        },
		        21: function _(n) {
		            return Number(n % 100 == 1 ? 1 : n % 100 == 2 ? 2 : n % 100 == 3 || n % 100 == 4 ? 3 : 0);
		        }
		    };
		    function createRules() {
		        var l, rules = {};
		        sets.forEach(function(set$$1) {
		            set$$1.lngs.forEach(function(l) {
		                return rules[l] = {
		                    numbers: set$$1.nr,
		                    plurals: _rulesPluralsTypes[set$$1.fc]
		                };
		            });
		        });
		        return rules;
		    }
		    var PluralResolver = function() {
		        function PluralResolver(languageUtils) {
		            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		            classCallCheck(this, PluralResolver);
		            this.languageUtils = languageUtils;
		            this.options = options;
		            this.logger = baseLogger.create("pluralResolver");
		            this.rules = createRules();
		        }
		        PluralResolver.prototype.addRule = function addRule(lng, obj) {
		            this.rules[lng] = obj;
		        };
		        PluralResolver.prototype.getRule = function getRule(code) {
		            return this.rules[this.languageUtils.getLanguagePartFromCode(code)];
		        };
		        PluralResolver.prototype.needsPlural = function needsPlural(code) {
		            var rule = this.getRule(code);
		            return rule && rule.numbers.length <= 1 ? false : true;
		        };
		        PluralResolver.prototype.getSuffix = function getSuffix(code, count) {
		            var _this = this;
		            var rule = this.getRule(code);
		            if (rule) {
		                var _ret = function() {
		                    if (rule.numbers.length === 1) return {
		                        v: ""
		                    };
		                    var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
		                    var suffix = rule.numbers[idx];
		                    if (rule.numbers.length === 2 && rule.numbers[0] === 1) {
		                        if (suffix === 2) {
		                            suffix = "plural";
		                        } else if (suffix === 1) {
		                            suffix = "";
		                        }
		                    }
		                    var returnSuffix = function returnSuffix() {
		                        return _this.options.prepend && suffix.toString() ? _this.options.prepend + suffix.toString() : suffix.toString();
		                    };
		                    if (_this.options.compatibilityJSON === "v1") {
		                        if (suffix === 1) return {
		                            v: ""
		                        };
		                        if (typeof suffix === "number") return {
		                            v: "_plural_" + suffix.toString()
		                        };
		                        return {
		                            v: returnSuffix()
		                        };
		                    } else if (_this.options.compatibilityJSON === "v2" || rule.numbers.length === 2 && rule.numbers[0] === 1) {
		                        return {
		                            v: returnSuffix()
		                        };
		                    } else if (rule.numbers.length === 2 && rule.numbers[0] === 1) {
		                        return {
		                            v: returnSuffix()
		                        };
		                    }
		                    return {
		                        v: _this.options.prepend && idx.toString() ? _this.options.prepend + idx.toString() : idx.toString()
		                    };
		                }();
		                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
		            } else {
		                this.logger.warn("no plural rule found for: " + code);
		                return "";
		            }
		        };
		        return PluralResolver;
		    }();
		    var Interpolator = function() {
		        function Interpolator() {
		            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		            classCallCheck(this, Interpolator);
		            this.logger = baseLogger.create("interpolator");
		            this.init(options, true);
		        }
		        Interpolator.prototype.init = function init() {
		            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		            var reset = arguments[1];
		            if (reset) {
		                this.options = options;
		                this.format = options.interpolation && options.interpolation.format || function(value) {
		                    return value;
		                };
		                this.escape = options.interpolation && options.interpolation.escape || escape;
		            }
		            if (!options.interpolation) options.interpolation = {
		                escapeValue: true
		            };
		            var iOpts = options.interpolation;
		            this.escapeValue = iOpts.escapeValue !== undefined ? iOpts.escapeValue : true;
		            this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || "{{";
		            this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || "}}";
		            this.formatSeparator = iOpts.formatSeparator ? regexEscape(iOpts.formatSeparator) : iOpts.formatSeparator || ",";
		            this.unescapePrefix = iOpts.unescapeSuffix ? "" : iOpts.unescapePrefix || "-";
		            this.unescapeSuffix = this.unescapePrefix ? "" : iOpts.unescapeSuffix || "";
		            this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape("$t(");
		            this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(")");
		            this.resetRegExp();
		        };
		        Interpolator.prototype.reset = function reset() {
		            if (this.options) this.init(this.options);
		        };
		        Interpolator.prototype.resetRegExp = function resetRegExp() {
		            var regexpStr = this.prefix + "(.+?)" + this.suffix;
		            this.regexp = new RegExp(regexpStr, "g");
		            var regexpUnescapeStr = this.prefix + this.unescapePrefix + "(.+?)" + this.unescapeSuffix + this.suffix;
		            this.regexpUnescape = new RegExp(regexpUnescapeStr, "g");
		            var nestingRegexpStr = this.nestingPrefix + "(.+?)" + this.nestingSuffix;
		            this.nestingRegexp = new RegExp(nestingRegexpStr, "g");
		        };
		        Interpolator.prototype.interpolate = function interpolate(str, data, lng) {
		            var _this = this;
		            var match = void 0, value = void 0;
		            function regexSafe(val) {
		                return val.replace(/\$/g, "$$$$");
		            }
		            var handleFormat = function handleFormat(key) {
		                if (key.indexOf(_this.formatSeparator) < 0) return getPath(data, key);
		                var p = key.split(_this.formatSeparator);
		                var k = p.shift().trim();
		                var f = p.join(_this.formatSeparator).trim();
		                return _this.format(getPath(data, k), f, lng);
		            };
		            this.resetRegExp();
		            while (match = this.regexpUnescape.exec(str)) {
		                var _value = handleFormat(match[1].trim());
		                str = str.replace(match[0], _value);
		                this.regexpUnescape.lastIndex = 0;
		            }
		            while (match = this.regexp.exec(str)) {
		                value = handleFormat(match[1].trim());
		                if (typeof value !== "string") value = makeString(value);
		                if (!value) {
		                    this.logger.warn("missed to pass in variable " + match[1] + " for interpolating " + str);
		                    value = "";
		                }
		                value = this.escapeValue ? regexSafe(this.escape(value)) : regexSafe(value);
		                str = str.replace(match[0], value);
		                this.regexp.lastIndex = 0;
		            }
		            return str;
		        };
		        Interpolator.prototype.nest = function nest(str, fc) {
		            var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
		            var match = void 0, value = void 0;
		            var clonedOptions = JSON.parse(JSON.stringify(options));
		            clonedOptions.applyPostProcessor = false;
		            function regexSafe(val) {
		                return val.replace(/\$/g, "$$$$");
		            }
		            function handleHasOptions(key) {
		                if (key.indexOf(",") < 0) return key;
		                var p = key.split(",");
		                key = p.shift();
		                var optionsString = p.join(",");
		                optionsString = this.interpolate(optionsString, clonedOptions);
		                optionsString = optionsString.replace(/'/g, '"');
		                try {
		                    clonedOptions = JSON.parse(optionsString);
		                } catch (e) {
		                    this.logger.error("failed parsing options string in nesting for key " + key, e);
		                }
		                return key;
		            }
		            while (match = this.nestingRegexp.exec(str)) {
		                value = fc(handleHasOptions.call(this, match[1].trim()), clonedOptions);
		                if (typeof value !== "string") value = makeString(value);
		                if (!value) {
		                    this.logger.warn("missed to pass in variable " + match[1] + " for interpolating " + str);
		                    value = "";
		                }
		                value = this.escapeValue ? regexSafe(escape(value)) : regexSafe(value);
		                str = str.replace(match[0], value);
		                this.regexp.lastIndex = 0;
		            }
		            return str;
		        };
		        return Interpolator;
		    }();
		    function remove(arr, what) {
		        var found = arr.indexOf(what);
		        while (found !== -1) {
		            arr.splice(found, 1);
		            found = arr.indexOf(what);
		        }
		    }
		    var Connector = function(_EventEmitter) {
		        inherits(Connector, _EventEmitter);
		        function Connector(backend, store, services) {
		            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
		            classCallCheck(this, Connector);
		            var _this = possibleConstructorReturn(this, _EventEmitter.call(this));
		            _this.backend = backend;
		            _this.store = store;
		            _this.services = services;
		            _this.options = options;
		            _this.logger = baseLogger.create("backendConnector");
		            _this.state = {};
		            _this.queue = [];
		            _this.backend && _this.backend.init && _this.backend.init(services, options.backend, options);
		            return _this;
		        }
		        Connector.prototype.queueLoad = function queueLoad(languages, namespaces, callback) {
		            var _this2 = this;
		            var toLoad = [], pending = [], toLoadLanguages = [], toLoadNamespaces = [];
		            languages.forEach(function(lng) {
		                var hasAllNamespaces = true;
		                namespaces.forEach(function(ns) {
		                    var name = lng + "|" + ns;
		                    if (_this2.store.hasResourceBundle(lng, ns)) {
		                        _this2.state[name] = 2;
		                    } else if (_this2.state[name] < 0) {} else if (_this2.state[name] === 1) {
		                        if (pending.indexOf(name) < 0) pending.push(name);
		                    } else {
		                        _this2.state[name] = 1;
		                        hasAllNamespaces = false;
		                        if (pending.indexOf(name) < 0) pending.push(name);
		                        if (toLoad.indexOf(name) < 0) toLoad.push(name);
		                        if (toLoadNamespaces.indexOf(ns) < 0) toLoadNamespaces.push(ns);
		                    }
		                });
		                if (!hasAllNamespaces) toLoadLanguages.push(lng);
		            });
		            if (toLoad.length || pending.length) {
		                this.queue.push({
		                    pending: pending,
		                    loaded: {},
		                    errors: [],
		                    callback: callback
		                });
		            }
		            return {
		                toLoad: toLoad,
		                pending: pending,
		                toLoadLanguages: toLoadLanguages,
		                toLoadNamespaces: toLoadNamespaces
		            };
		        };
		        Connector.prototype.loaded = function loaded(name, err, data) {
		            var _this3 = this;
		            var _name$split = name.split("|"), _name$split2 = slicedToArray(_name$split, 2), lng = _name$split2[0], ns = _name$split2[1];
		            if (err) this.emit("failedLoading", lng, ns, err);
		            if (data) {
		                this.store.addResourceBundle(lng, ns, data);
		            }
		            this.state[name] = err ? -1 : 2;
		            this.queue.forEach(function(q) {
		                pushPath(q.loaded, [ lng ], ns);
		                remove(q.pending, name);
		                if (err) q.errors.push(err);
		                if (q.pending.length === 0 && !q.done) {
		                    _this3.emit("loaded", q.loaded);
		                    q.errors.length ? q.callback(q.errors) : q.callback();
		                    q.done = true;
		                }
		            });
		            this.queue = this.queue.filter(function(q) {
		                return !q.done;
		            });
		        };
		        Connector.prototype.read = function read(lng, ns, fcName, tried, wait, callback) {
		            var _this4 = this;
		            if (!tried) tried = 0;
		            if (!wait) wait = 250;
		            if (!lng.length) return callback(null, {});
		            this.backend[fcName](lng, ns, function(err, data) {
		                if (err && data && tried < 5) {
		                    setTimeout(function() {
		                        _this4.read.call(_this4, lng, ns, fcName, ++tried, wait * 2, callback);
		                    }, wait);
		                    return;
		                }
		                callback(err, data);
		            });
		        };
		        Connector.prototype.load = function load(languages, namespaces, callback) {
		            var _this5 = this;
		            if (!this.backend) {
		                this.logger.warn("No backend was added via i18next.use. Will not load resources.");
		                return callback && callback();
		            }
		            var options = _extends({}, this.backend.options, this.options.backend);
		            if (typeof languages === "string") languages = this.services.languageUtils.toResolveHierarchy(languages);
		            if (typeof namespaces === "string") namespaces = [ namespaces ];
		            var toLoad = this.queueLoad(languages, namespaces, callback);
		            if (!toLoad.toLoad.length) {
		                if (!toLoad.pending.length) callback();
		                return;
		            }
		            if (options.allowMultiLoading && this.backend.readMulti) {
		                this.read(toLoad.toLoadLanguages, toLoad.toLoadNamespaces, "readMulti", null, null, function(err, data) {
		                    if (err) _this5.logger.warn("loading namespaces " + toLoad.toLoadNamespaces.join(", ") + " for languages " + toLoad.toLoadLanguages.join(", ") + " via multiloading failed", err);
		                    if (!err && data) _this5.logger.log("loaded namespaces " + toLoad.toLoadNamespaces.join(", ") + " for languages " + toLoad.toLoadLanguages.join(", ") + " via multiloading", data);
		                    toLoad.toLoad.forEach(function(name) {
		                        var _name$split3 = name.split("|"), _name$split4 = slicedToArray(_name$split3, 2), l = _name$split4[0], n = _name$split4[1];
		                        var bundle = getPath(data, [ l, n ]);
		                        if (bundle) {
		                            _this5.loaded(name, err, bundle);
		                        } else {
		                            var _err = "loading namespace " + n + " for language " + l + " via multiloading failed";
		                            _this5.loaded(name, _err);
		                            _this5.logger.error(_err);
		                        }
		                    });
		                });
		            } else {
		                (function() {
		                    var readOne = function readOne(name) {
		                        var _this6 = this;
		                        var _name$split5 = name.split("|"), _name$split6 = slicedToArray(_name$split5, 2), lng = _name$split6[0], ns = _name$split6[1];
		                        this.read(lng, ns, "read", null, null, function(err, data) {
		                            if (err) _this6.logger.warn("loading namespace " + ns + " for language " + lng + " failed", err);
		                            if (!err && data) _this6.logger.log("loaded namespace " + ns + " for language " + lng, data);
		                            _this6.loaded(name, err, data);
		                        });
		                    };
		                    toLoad.toLoad.forEach(function(name) {
		                        readOne.call(_this5, name);
		                    });
		                })();
		            }
		        };
		        Connector.prototype.reload = function reload(languages, namespaces) {
		            var _this7 = this;
		            if (!this.backend) {
		                this.logger.warn("No backend was added via i18next.use. Will not load resources.");
		            }
		            var options = _extends({}, this.backend.options, this.options.backend);
		            if (typeof languages === "string") languages = this.services.languageUtils.toResolveHierarchy(languages);
		            if (typeof namespaces === "string") namespaces = [ namespaces ];
		            if (options.allowMultiLoading && this.backend.readMulti) {
		                this.read(languages, namespaces, "readMulti", null, null, function(err, data) {
		                    if (err) _this7.logger.warn("reloading namespaces " + namespaces.join(", ") + " for languages " + languages.join(", ") + " via multiloading failed", err);
		                    if (!err && data) _this7.logger.log("reloaded namespaces " + namespaces.join(", ") + " for languages " + languages.join(", ") + " via multiloading", data);
		                    languages.forEach(function(l) {
		                        namespaces.forEach(function(n) {
		                            var bundle = getPath(data, [ l, n ]);
		                            if (bundle) {
		                                _this7.loaded(l + "|" + n, err, bundle);
		                            } else {
		                                var _err2 = "reloading namespace " + n + " for language " + l + " via multiloading failed";
		                                _this7.loaded(l + "|" + n, _err2);
		                                _this7.logger.error(_err2);
		                            }
		                        });
		                    });
		                });
		            } else {
		                (function() {
		                    var readOne = function readOne(name) {
		                        var _this8 = this;
		                        var _name$split7 = name.split("|"), _name$split8 = slicedToArray(_name$split7, 2), lng = _name$split8[0], ns = _name$split8[1];
		                        this.read(lng, ns, "read", null, null, function(err, data) {
		                            if (err) _this8.logger.warn("reloading namespace " + ns + " for language " + lng + " failed", err);
		                            if (!err && data) _this8.logger.log("reloaded namespace " + ns + " for language " + lng, data);
		                            _this8.loaded(name, err, data);
		                        });
		                    };
		                    languages.forEach(function(l) {
		                        namespaces.forEach(function(n) {
		                            readOne.call(_this7, l + "|" + n);
		                        });
		                    });
		                })();
		            }
		        };
		        Connector.prototype.saveMissing = function saveMissing(languages, namespace, key, fallbackValue) {
		            if (this.backend && this.backend.create) this.backend.create(languages, namespace, key, fallbackValue);
		            if (!languages || !languages[0]) return;
		            this.store.addResource(languages[0], namespace, key, fallbackValue);
		        };
		        return Connector;
		    }(EventEmitter);
		    var Connector$1 = function(_EventEmitter) {
		        inherits(Connector, _EventEmitter);
		        function Connector(cache, store, services) {
		            var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
		            classCallCheck(this, Connector);
		            var _this = possibleConstructorReturn(this, _EventEmitter.call(this));
		            _this.cache = cache;
		            _this.store = store;
		            _this.services = services;
		            _this.options = options;
		            _this.logger = baseLogger.create("cacheConnector");
		            _this.cache && _this.cache.init && _this.cache.init(services, options.cache, options);
		            return _this;
		        }
		        Connector.prototype.load = function load(languages, namespaces, callback) {
		            var _this2 = this;
		            if (!this.cache) return callback && callback();
		            var options = _extends({}, this.cache.options, this.options.cache);
		            if (typeof languages === "string") languages = this.services.languageUtils.toResolveHierarchy(languages);
		            if (typeof namespaces === "string") namespaces = [ namespaces ];
		            if (options.enabled) {
		                this.cache.load(languages, function(err, data) {
		                    if (err) _this2.logger.error("loading languages " + languages.join(", ") + " from cache failed", err);
		                    if (data) {
		                        for (var l in data) {
		                            for (var n in data[l]) {
		                                if (n === "i18nStamp") continue;
		                                var bundle = data[l][n];
		                                if (bundle) _this2.store.addResourceBundle(l, n, bundle);
		                            }
		                        }
		                    }
		                    if (callback) callback();
		                });
		            } else {
		                if (callback) callback();
		            }
		        };
		        Connector.prototype.save = function save() {
		            if (this.cache && this.options.cache && this.options.cache.enabled) this.cache.save(this.store.data);
		        };
		        return Connector;
		    }(EventEmitter);
		    function get$1() {
		        return {
		            debug: false,
		            initImmediate: true,
		            ns: [ "translation" ],
		            defaultNS: [ "translation" ],
		            fallbackLng: [ "dev" ],
		            fallbackNS: false,
		            whitelist: false,
		            nonExplicitWhitelist: false,
		            load: "all",
		            preload: false,
		            keySeparator: ".",
		            nsSeparator: ":",
		            pluralSeparator: "_",
		            contextSeparator: "_",
		            saveMissing: false,
		            saveMissingTo: "fallback",
		            missingKeyHandler: false,
		            postProcess: false,
		            returnNull: true,
		            returnEmptyString: true,
		            returnObjects: false,
		            joinArrays: false,
		            returnedObjectHandler: function returnedObjectHandler() {},
		            parseMissingKeyHandler: false,
		            appendNamespaceToMissingKey: false,
		            overloadTranslationOptionHandler: function overloadTranslationOptionHandler(args) {
		                return {
		                    defaultValue: args[1]
		                };
		            },
		            interpolation: {
		                escapeValue: true,
		                format: function format(value, _format, lng) {
		                    return value;
		                },
		                prefix: "{{",
		                suffix: "}}",
		                formatSeparator: ",",
		                unescapePrefix: "-",
		                nestingPrefix: "$t(",
		                nestingSuffix: ")",
		                defaultVariables: undefined
		            }
		        };
		    }
		    function transformOptions(options) {
		        if (typeof options.ns === "string") options.ns = [ options.ns ];
		        if (typeof options.fallbackLng === "string") options.fallbackLng = [ options.fallbackLng ];
		        if (typeof options.fallbackNS === "string") options.fallbackNS = [ options.fallbackNS ];
		        if (options.whitelist && options.whitelist.indexOf("cimode") < 0) options.whitelist.push("cimode");
		        return options;
		    }
		    function noop() {}
		    var I18n = function(_EventEmitter) {
		        inherits(I18n, _EventEmitter);
		        function I18n() {
		            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		            var callback = arguments[1];
		            classCallCheck(this, I18n);
		            var _this = possibleConstructorReturn(this, _EventEmitter.call(this));
		            _this.options = transformOptions(options);
		            _this.services = {};
		            _this.logger = baseLogger;
		            _this.modules = {};
		            if (callback && !_this.isInitialized) _this.init(options, callback);
		            return _this;
		        }
		        I18n.prototype.init = function init(options, callback) {
		            var _this2 = this;
		            if (typeof options === "function") {
		                callback = options;
		                options = {};
		            }
		            if (!options) options = {};
		            if (options.compatibilityAPI === "v1") {
		                this.options = _extends({}, get$1(), transformOptions(convertAPIOptions(options)), {});
		            } else if (options.compatibilityJSON === "v1") {
		                this.options = _extends({}, get$1(), transformOptions(convertJSONOptions(options)), {});
		            } else {
		                this.options = _extends({}, get$1(), this.options, transformOptions(options));
		            }
		            if (!callback) callback = noop;
		            function createClassOnDemand(ClassOrObject) {
		                if (!ClassOrObject) return;
		                if (typeof ClassOrObject === "function") return new ClassOrObject();
		                return ClassOrObject;
		            }
		            if (!this.options.isClone) {
		                if (this.modules.logger) {
		                    baseLogger.init(createClassOnDemand(this.modules.logger), this.options);
		                } else {
		                    baseLogger.init(null, this.options);
		                }
		                var lu = new LanguageUtil(this.options);
		                this.store = new ResourceStore(this.options.resources, this.options);
		                var s = this.services;
		                s.logger = baseLogger;
		                s.resourceStore = this.store;
		                s.resourceStore.on("added removed", function(lng, ns) {
		                    s.cacheConnector.save();
		                });
		                s.languageUtils = lu;
		                s.pluralResolver = new PluralResolver(lu, {
		                    prepend: this.options.pluralSeparator,
		                    compatibilityJSON: this.options.compatibilityJSON
		                });
		                s.interpolator = new Interpolator(this.options);
		                s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
		                s.backendConnector.on("*", function(event) {
		                    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
		                        args[_key - 1] = arguments[_key];
		                    }
		                    _this2.emit.apply(_this2, [ event ].concat(args));
		                });
		                s.backendConnector.on("loaded", function(loaded) {
		                    s.cacheConnector.save();
		                });
		                s.cacheConnector = new Connector$1(createClassOnDemand(this.modules.cache), s.resourceStore, s, this.options);
		                s.cacheConnector.on("*", function(event) {
		                    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
		                        args[_key2 - 1] = arguments[_key2];
		                    }
		                    _this2.emit.apply(_this2, [ event ].concat(args));
		                });
		                if (this.modules.languageDetector) {
		                    s.languageDetector = createClassOnDemand(this.modules.languageDetector);
		                    s.languageDetector.init(s, this.options.detection, this.options);
		                }
		                this.translator = new Translator(this.services, this.options);
		                this.translator.on("*", function(event) {
		                    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
		                        args[_key3 - 1] = arguments[_key3];
		                    }
		                    _this2.emit.apply(_this2, [ event ].concat(args));
		                });
		            }
		            var storeApi = [ "getResource", "addResource", "addResources", "addResourceBundle", "removeResourceBundle", "hasResourceBundle", "getResourceBundle" ];
		            storeApi.forEach(function(fcName) {
		                _this2[fcName] = function() {
		                    return this.store[fcName].apply(this.store, arguments);
		                };
		            });
		            if (this.options.compatibilityAPI === "v1") appendBackwardsAPI(this);
		            var load = function load() {
		                _this2.changeLanguage(_this2.options.lng, function(err, t) {
		                    _this2.isInitialized = true;
		                    _this2.emit("initialized", _this2.options);
		                    _this2.logger.log("initialized", _this2.options);
		                    callback(err, t);
		                });
		            };
		            if (this.options.resources || !this.options.initImmediate) {
		                load();
		            } else {
		                setTimeout(load, 0);
		            }
		            return this;
		        };
		        I18n.prototype.loadResources = function loadResources(callback) {
		            var _this3 = this;
		            if (!callback) callback = noop;
		            if (!this.options.resources) {
		                var _ret = function() {
		                    if (_this3.language && _this3.language.toLowerCase() === "cimode") return {
		                        v: callback()
		                    };
		                    var toLoad = [];
		                    var append = function append(lng) {
		                        var lngs = _this3.services.languageUtils.toResolveHierarchy(lng);
		                        lngs.forEach(function(l) {
		                            if (toLoad.indexOf(l) < 0) toLoad.push(l);
		                        });
		                    };
		                    append(_this3.language);
		                    if (_this3.options.preload) {
		                        _this3.options.preload.forEach(function(l) {
		                            append(l);
		                        });
		                    }
		                    _this3.services.cacheConnector.load(toLoad, _this3.options.ns, function() {
		                        _this3.services.backendConnector.load(toLoad, _this3.options.ns, callback);
		                    });
		                }();
		                if ((typeof _ret === "undefined" ? "undefined" : _typeof(_ret)) === "object") return _ret.v;
		            } else {
		                callback(null);
		            }
		        };
		        I18n.prototype.reloadResources = function reloadResources(lngs, ns) {
		            if (!lngs) lngs = this.languages;
		            if (!ns) ns = this.options.ns;
		            this.services.backendConnector.reload(lngs, ns);
		        };
		        I18n.prototype.use = function use(module) {
		            if (module.type === "backend") {
		                this.modules.backend = module;
		            }
		            if (module.type === "cache") {
		                this.modules.cache = module;
		            }
		            if (module.type === "logger" || module.log && module.warn && module.warn) {
		                this.modules.logger = module;
		            }
		            if (module.type === "languageDetector") {
		                this.modules.languageDetector = module;
		            }
		            if (module.type === "postProcessor") {
		                postProcessor.addPostProcessor(module);
		            }
		            return this;
		        };
		        I18n.prototype.changeLanguage = function changeLanguage(lng, callback) {
		            var _this4 = this;
		            var done = function done(err) {
		                if (lng) {
		                    _this4.emit("languageChanged", lng);
		                    _this4.logger.log("languageChanged", lng);
		                }
		                if (callback) callback(err, function() {
		                    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
		                        args[_key4] = arguments[_key4];
		                    }
		                    return _this4.t.apply(_this4, args);
		                });
		            };
		            if (!lng && this.services.languageDetector) lng = this.services.languageDetector.detect();
		            if (lng) {
		                this.language = lng;
		                this.languages = this.services.languageUtils.toResolveHierarchy(lng);
		                this.translator.changeLanguage(lng);
		                if (this.services.languageDetector) this.services.languageDetector.cacheUserLanguage(lng);
		            }
		            this.loadResources(function(err) {
		                done(err);
		            });
		        };
		        I18n.prototype.getFixedT = function getFixedT(lng, ns) {
		            var _this5 = this;
		            var fixedT = function fixedT(key) {
		                var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		                var options = _extends({}, opts);
		                options.lng = options.lng || fixedT.lng;
		                options.ns = options.ns || fixedT.ns;
		                return _this5.t(key, options);
		            };
		            fixedT.lng = lng;
		            fixedT.ns = ns;
		            return fixedT;
		        };
		        I18n.prototype.t = function t() {
		            return this.translator && this.translator.translate.apply(this.translator, arguments);
		        };
		        I18n.prototype.exists = function exists() {
		            return this.translator && this.translator.exists.apply(this.translator, arguments);
		        };
		        I18n.prototype.setDefaultNamespace = function setDefaultNamespace(ns) {
		            this.options.defaultNS = ns;
		        };
		        I18n.prototype.loadNamespaces = function loadNamespaces(ns, callback) {
		            var _this6 = this;
		            if (!this.options.ns) return callback && callback();
		            if (typeof ns === "string") ns = [ ns ];
		            ns.forEach(function(n) {
		                if (_this6.options.ns.indexOf(n) < 0) _this6.options.ns.push(n);
		            });
		            this.loadResources(callback);
		        };
		        I18n.prototype.loadLanguages = function loadLanguages(lngs, callback) {
		            if (typeof lngs === "string") lngs = [ lngs ];
		            var preloaded = this.options.preload || [];
		            var newLngs = lngs.filter(function(lng) {
		                return preloaded.indexOf(lng) < 0;
		            });
		            if (!newLngs.length) return callback();
		            this.options.preload = preloaded.concat(newLngs);
		            this.loadResources(callback);
		        };
		        I18n.prototype.dir = function dir(lng) {
		            if (!lng) lng = this.language;
		            if (!lng) return "rtl";
		            var rtlLngs = [ "ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam" ];
		            return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) >= 0 ? "rtl" : "ltr";
		        };
		        I18n.prototype.createInstance = function createInstance() {
		            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		            var callback = arguments[1];
		            return new I18n(options, callback);
		        };
		        I18n.prototype.cloneInstance = function cloneInstance() {
		            var _this7 = this;
		            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		            var callback = arguments[1];
		            var clone = new I18n(_extends({}, options, this.options, {
		                isClone: true
		            }), callback);
		            var membersToCopy = [ "store", "services", "language" ];
		            membersToCopy.forEach(function(m) {
		                clone[m] = _this7[m];
		            });
		            clone.translator = new Translator(clone.services, clone.options);
		            clone.translator.on("*", function(event) {
		                for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
		                    args[_key5 - 1] = arguments[_key5];
		                }
		                clone.emit.apply(clone, [ event ].concat(args));
		            });
		            return clone;
		        };
		        return I18n;
		    }(EventEmitter);
		    var i18next$1 = new I18n();
		    return i18next$1;
		});

		(function(global, factory) {
		     true ? module.exports = factory() : typeof define === "function" && define.amd ? define("i18nextXHRBackend", factory) : global.i18nextXHRBackend = factory();
		})(window, function () {
		    "use strict";
		    var arr = [];
		    var each = arr.forEach;
		    var slice = arr.slice;
		    function defaults(obj) {
		        each.call(slice.call(arguments, 1), function(source) {
		            if (source) {
		                for (var prop in source) {
		                    if (obj[prop] === undefined) obj[prop] = source[prop];
		                }
		            }
		        });
		        return obj;
		    }
		    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
		        return typeof obj;
		    } : function(obj) {
		        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
		    };
		    function ajax(url, options, callback, data, cache) {
		        if (data && (typeof data === "undefined" ? "undefined" : _typeof(data)) === "object") {
		            var y = "", e = encodeURIComponent;
		            for (var m in data) {
		                y += "&" + e(m) + "=" + e(data[m]);
		            }
		            data = y.slice(1) + (!cache ? "&_t=" + new Date() : "");
		        }
		        try {
		            var x = new (XMLHttpRequest || ActiveXObject)("MSXML2.XMLHTTP.3.0");
		            x.open(data ? "POST" : "GET", url, 1);
		            if (!options.crossDomain) {
		                x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		            }
		            x.withCredentials = !!options.withCredentials;
		            if (data) {
		                x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		            }
		            var h = options.customHeaders;
		            if (h) {
		                for (var i in h) {
		                    x.setRequestHeader(i, h[i]);
		                }
		            }
		            x.onreadystatechange = function() {
		                x.readyState > 3 && callback && callback(x.responseText, x);
		            };
		            x.send(data);
		        } catch (e) {
		            console && console.log(e);
		        }
		    }
		    var _createClass = function() {
		        function defineProperties(target, props) {
		            for (var i = 0; i < props.length; i++) {
		                var descriptor = props[i];
		                descriptor.enumerable = descriptor.enumerable || false;
		                descriptor.configurable = true;
		                if ("value" in descriptor) descriptor.writable = true;
		                Object.defineProperty(target, descriptor.key, descriptor);
		            }
		        }
		        return function(Constructor, protoProps, staticProps) {
		            if (protoProps) defineProperties(Constructor.prototype, protoProps);
		            if (staticProps) defineProperties(Constructor, staticProps);
		            return Constructor;
		        };
		    }();
		    function _classCallCheck(instance, Constructor) {
		        if (!(instance instanceof Constructor)) {
		            throw new TypeError("Cannot call a class as a function");
		        }
		    }
		    function getDefaults() {
		        return {
		            loadPath: "/locales/{{lng}}/{{ns}}.json",
		            addPath: "locales/add/{{lng}}/{{ns}}",
		            allowMultiLoading: false,
		            parse: JSON.parse,
		            crossDomain: false,
		            ajax: ajax
		        };
		    }
		    var Backend = function() {
		        function Backend(services) {
		            var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		            _classCallCheck(this, Backend);
		            this.init(services, options);
		            this.type = "backend";
		        }
		        _createClass(Backend, [ {
		            key: "init",
		            value: function init(services) {
		                var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		                this.services = services;
		                this.options = defaults(options, this.options || {}, getDefaults());
		            }
		        }, {
		            key: "readMulti",
		            value: function readMulti(languages, namespaces, callback) {
		                var loadPath = this.options.loadPath;
		                if (typeof this.options.loadPath === "function") {
		                    loadPath = this.options.loadPath(languages, namespaces);
		                }
		                var url = this.services.interpolator.interpolate(loadPath, {
		                    lng: languages.join("+"),
		                    ns: namespaces.join("+")
		                });
		                this.loadUrl(url, callback);
		            }
		        }, {
		            key: "read",
		            value: function read(language, namespace, callback) {
		                var loadPath = this.options.loadPath;
		                if (typeof this.options.loadPath === "function") {
		                    loadPath = this.options.loadPath([ language ], [ namespace ]);
		                }
		                var url = this.services.interpolator.interpolate(loadPath, {
		                    lng: language,
		                    ns: namespace
		                });
		                this.loadUrl(url, callback);
		            }
		        }, {
		            key: "loadUrl",
		            value: function loadUrl(url, callback) {
		                var _this = this;
		                this.options.ajax(url, this.options, function(data, xhr) {
		                    if (xhr.status >= 500 && xhr.status < 600) return callback("failed loading " + url, true);
		                    if (xhr.status >= 400 && xhr.status < 500) return callback("failed loading " + url, false);
		                    var ret = void 0, err = void 0;
		                    try {
		                        ret = _this.options.parse(data, url);
		                    } catch (e) {
		                        err = "failed parsing " + url + " to json";
		                    }
		                    if (err) return callback(err, false);
		                    callback(null, ret);
		                });
		            }
		        }, {
		            key: "create",
		            value: function create(languages, namespace, key, fallbackValue) {
		                var _this2 = this;
		                if (typeof languages === "string") languages = [ languages ];
		                var payload = {};
		                payload[key] = fallbackValue || "";
		                languages.forEach(function(lng) {
		                    var url = _this2.services.interpolator.interpolate(_this2.options.addPath, {
		                        lng: lng,
		                        ns: namespace
		                    });
		                    _this2.options.ajax(url, _this2.options, function(data, xhr) {}, payload);
		                });
		            }
		        } ]);
		        return Backend;
		    }();
		    Backend.type = "backend";
		    return Backend;
		});

		(function(global, factory) {
		     true ? module.exports = factory() : typeof define === "function" && define.amd ? define("i18nextLocalStorageCache", factory) : global.i18nextLocalStorageCache = factory();
		})(window, function () {
		    "use strict";
		    var babelHelpers = {};
		    babelHelpers.classCallCheck = function(instance, Constructor) {
		        if (!(instance instanceof Constructor)) {
		            throw new TypeError("Cannot call a class as a function");
		        }
		    };
		    babelHelpers.createClass = function() {
		        function defineProperties(target, props) {
		            for (var i = 0; i < props.length; i++) {
		                var descriptor = props[i];
		                descriptor.enumerable = descriptor.enumerable || false;
		                descriptor.configurable = true;
		                if ("value" in descriptor) descriptor.writable = true;
		                Object.defineProperty(target, descriptor.key, descriptor);
		            }
		        }
		        return function(Constructor, protoProps, staticProps) {
		            if (protoProps) defineProperties(Constructor.prototype, protoProps);
		            if (staticProps) defineProperties(Constructor, staticProps);
		            return Constructor;
		        };
		    }();
		    babelHelpers;
		    var arr = [];
		    var each = arr.forEach;
		    var slice = arr.slice;
		    function defaults(obj) {
		        each.call(slice.call(arguments, 1), function(source) {
		            if (source) {
		                for (var prop in source) {
		                    if (obj[prop] === undefined) obj[prop] = source[prop];
		                }
		            }
		        });
		        return obj;
		    }
		    function debounce(func, wait, immediate) {
		        var timeout;
		        return function() {
		            var context = this, args = arguments;
		            var later = function later() {
		                timeout = null;
		                if (!immediate) func.apply(context, args);
		            };
		            var callNow = immediate && !timeout;
		            clearTimeout(timeout);
		            timeout = setTimeout(later, wait);
		            if (callNow) func.apply(context, args);
		        };
		    }
		    var storage = {
		        setItem: function setItem(key, value) {
		            if (window.localStorage) {
		                try {
		                    window.localStorage.setItem(key, value);
		                } catch (e) {}
		            }
		        },
		        getItem: function getItem(key, value) {
		            if (window.localStorage) {
		                try {
		                    return window.localStorage.getItem(key, value);
		                } catch (e) {
		                    return undefined;
		                }
		            }
		        }
		    };
		    function getDefaults() {
		        return {
		            enabled: false,
		            prefix: "i18next_res_",
		            expirationTime: 7 * 24 * 60 * 60 * 1e3
		        };
		    }
		    var Cache = function() {
		        function Cache(services) {
		            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		            babelHelpers.classCallCheck(this, Cache);
		            this.init(services, options);
		            this.type = "cache";
		            this.debouncedStore = debounce(this.store, 1e4);
		        }
		        babelHelpers.createClass(Cache, [ {
		            key: "init",
		            value: function init(services) {
		                var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		                this.services = services;
		                this.options = defaults(options, this.options || {}, getDefaults());
		            }
		        }, {
		            key: "load",
		            value: function load(lngs, callback) {
		                var _this = this;
		                var store = {}, nowMS = new Date().getTime();
		                if (window.localStorage) {
		                    (function() {
		                        var todo = lngs.length;
		                        lngs.forEach(function(lng) {
		                            var local = storage.getItem(_this.options.prefix + lng);
		                            if (local) {
		                                local = JSON.parse(local);
		                                if (local.i18nStamp && local.i18nStamp + _this.options.expirationTime > nowMS) {
		                                    store[lng] = local;
		                                }
		                            }
		                            todo--;
		                            if (todo === 0) callback(null, store);
		                        });
		                    })();
		                }
		            }
		        }, {
		            key: "store",
		            value: function store(_store) {
		                if (window.localStorage) {
		                    for (var m in _store) {
		                        _store[m].i18nStamp = new Date().getTime();
		                        storage.setItem(this.options.prefix + m, JSON.stringify(_store[m]));
		                    }
		                }
		                return;
		            }
		        }, {
		            key: "save",
		            value: function save(store) {
		                this.debouncedStore(store);
		                return;
		            }
		        } ]);
		        return Cache;
		    }();
		    Cache.type = "cache";
		    return Cache;
		});

		(function(global, factory) {
		     true ? module.exports = factory() : typeof define === "function" && define.amd ? define("i18nextSprintfPostProcessor", factory) : global.i18nextSprintfPostProcessor = factory();
		})(window, function () {
		    "use strict";
		    var babelHelpers = {};
		    babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
		        return typeof obj;
		    } : function(obj) {
		        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
		    };
		    babelHelpers;
		    var re = {
		        not_string: /[^s]/,
		        number: /[diefg]/,
		        json: /[j]/,
		        not_json: /[^j]/,
		        text: /^[^\x25]+/,
		        modulo: /^\x25{2}/,
		        placeholder: /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijosuxX])/,
		        key: /^([a-z_][a-z_\d]*)/i,
		        key_access: /^\.([a-z_][a-z_\d]*)/i,
		        index_access: /^\[(\d+)\]/,
		        sign: /^[\+\-]/
		    };
		    function sprintf() {
		        var key = arguments[0], cache = sprintf.cache;
		        if (!(cache[key] && cache.hasOwnProperty(key))) {
		            cache[key] = sprintf.parse(key);
		        }
		        return sprintf.format.call(null, cache[key], arguments);
		    }
		    sprintf.format = function(parse_tree, argv) {
		        var cursor = 1, tree_length = parse_tree.length, node_type = "", arg, output = [], i, k, match, pad, pad_character, pad_length, is_positive = true, sign = "";
		        for (i = 0; i < tree_length; i++) {
		            node_type = get_type(parse_tree[i]);
		            if (node_type === "string") {
		                output[output.length] = parse_tree[i];
		            } else if (node_type === "array") {
		                match = parse_tree[i];
		                if (match[2]) {
		                    arg = argv[cursor];
		                    for (k = 0; k < match[2].length; k++) {
		                        if (!arg.hasOwnProperty(match[2][k])) {
		                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]));
		                        }
		                        arg = arg[match[2][k]];
		                    }
		                } else if (match[1]) {
		                    arg = argv[match[1]];
		                } else {
		                    arg = argv[cursor++];
		                }
		                if (get_type(arg) == "function") {
		                    arg = arg();
		                }
		                if (re.not_string.test(match[8]) && re.not_json.test(match[8]) && get_type(arg) != "number" && isNaN(arg)) {
		                    throw new TypeError(sprintf("[sprintf] expecting number but found %s", get_type(arg)));
		                }
		                if (re.number.test(match[8])) {
		                    is_positive = arg >= 0;
		                }
		                switch (match[8]) {
		                  case "b":
		                    arg = arg.toString(2);
		                    break;

		                  case "c":
		                    arg = String.fromCharCode(arg);
		                    break;

		                  case "d":
		                  case "i":
		                    arg = parseInt(arg, 10);
		                    break;

		                  case "j":
		                    arg = JSON.stringify(arg, null, match[6] ? parseInt(match[6]) : 0);
		                    break;

		                  case "e":
		                    arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential();
		                    break;

		                  case "f":
		                    arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg);
		                    break;

		                  case "g":
		                    arg = match[7] ? parseFloat(arg).toPrecision(match[7]) : parseFloat(arg);
		                    break;

		                  case "o":
		                    arg = arg.toString(8);
		                    break;

		                  case "s":
		                    arg = (arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg;
		                    break;

		                  case "u":
		                    arg = arg >>> 0;
		                    break;

		                  case "x":
		                    arg = arg.toString(16);
		                    break;

		                  case "X":
		                    arg = arg.toString(16).toUpperCase();
		                    break;
		                }
		                if (re.json.test(match[8])) {
		                    output[output.length] = arg;
		                } else {
		                    if (re.number.test(match[8]) && (!is_positive || match[3])) {
		                        sign = is_positive ? "+" : "-";
		                        arg = arg.toString().replace(re.sign, "");
		                    } else {
		                        sign = "";
		                    }
		                    pad_character = match[4] ? match[4] === "0" ? "0" : match[4].charAt(1) : " ";
		                    pad_length = match[6] - (sign + arg).length;
		                    pad = match[6] ? pad_length > 0 ? str_repeat(pad_character, pad_length) : "" : "";
		                    output[output.length] = match[5] ? sign + arg + pad : pad_character === "0" ? sign + pad + arg : pad + sign + arg;
		                }
		            }
		        }
		        return output.join("");
		    };
		    sprintf.cache = {};
		    sprintf.parse = function(fmt) {
		        var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
		        while (_fmt) {
		            if ((match = re.text.exec(_fmt)) !== null) {
		                parse_tree[parse_tree.length] = match[0];
		            } else if ((match = re.modulo.exec(_fmt)) !== null) {
		                parse_tree[parse_tree.length] = "%";
		            } else if ((match = re.placeholder.exec(_fmt)) !== null) {
		                if (match[2]) {
		                    arg_names |= 1;
		                    var field_list = [], replacement_field = match[2], field_match = [];
		                    if ((field_match = re.key.exec(replacement_field)) !== null) {
		                        field_list[field_list.length] = field_match[1];
		                        while ((replacement_field = replacement_field.substring(field_match[0].length)) !== "") {
		                            if ((field_match = re.key_access.exec(replacement_field)) !== null) {
		                                field_list[field_list.length] = field_match[1];
		                            } else if ((field_match = re.index_access.exec(replacement_field)) !== null) {
		                                field_list[field_list.length] = field_match[1];
		                            } else {
		                                throw new SyntaxError("[sprintf] failed to parse named argument key");
		                            }
		                        }
		                    } else {
		                        throw new SyntaxError("[sprintf] failed to parse named argument key");
		                    }
		                    match[2] = field_list;
		                } else {
		                    arg_names |= 2;
		                }
		                if (arg_names === 3) {
		                    throw new Error("[sprintf] mixing positional and named placeholders is not (yet) supported");
		                }
		                parse_tree[parse_tree.length] = match;
		            } else {
		                throw new SyntaxError("[sprintf] unexpected placeholder");
		            }
		            _fmt = _fmt.substring(match[0].length);
		        }
		        return parse_tree;
		    };
		    function vsprintf(fmt, argv, _argv) {
		        _argv = (argv || []).slice(0);
		        _argv.splice(0, 0, fmt);
		        return sprintf.apply(null, _argv);
		    }
		    function get_type(variable) {
		        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
		    }
		    function str_repeat(input, multiplier) {
		        return Array(multiplier + 1).join(input);
		    }
		    var index = {
		        name: "sprintf",
		        type: "postProcessor",
		        process: function process(value, key, options) {
		            if (!options.sprintf) return value;
		            if (Object.prototype.toString.apply(options.sprintf) === "[object Array]") {
		                return vsprintf(value, options.sprintf);
		            } else if (babelHelpers.typeof(options.sprintf) === "object") {
		                return sprintf(value, options.sprintf);
		            }
		            return value;
		        },
		        overloadTranslationOptionHandler: function overloadTranslationOptionHandler(args) {
		            var values = [];
		            for (var i = 1; i < args.length; i++) {
		                values.push(args[i]);
		            }
		            return {
		                postProcess: "sprintf",
		                sprintf: values
		            };
		        }
		    };
		    return index;
		});

		(function(global, factory) {
		     true ? module.exports = factory() : typeof define === "function" && define.amd ? define("i18nextBrowserLanguageDetector", factory) : global.i18nextBrowserLanguageDetector = factory();
		})(window, function () {
		    "use strict";
		    var babelHelpers = {};
		    babelHelpers.classCallCheck = function(instance, Constructor) {
		        if (!(instance instanceof Constructor)) {
		            throw new TypeError("Cannot call a class as a function");
		        }
		    };
		    babelHelpers.createClass = function() {
		        function defineProperties(target, props) {
		            for (var i = 0; i < props.length; i++) {
		                var descriptor = props[i];
		                descriptor.enumerable = descriptor.enumerable || false;
		                descriptor.configurable = true;
		                if ("value" in descriptor) descriptor.writable = true;
		                Object.defineProperty(target, descriptor.key, descriptor);
		            }
		        }
		        return function(Constructor, protoProps, staticProps) {
		            if (protoProps) defineProperties(Constructor.prototype, protoProps);
		            if (staticProps) defineProperties(Constructor, staticProps);
		            return Constructor;
		        };
		    }();
		    babelHelpers;
		    var arr = [];
		    var each = arr.forEach;
		    var slice = arr.slice;
		    function defaults(obj) {
		        each.call(slice.call(arguments, 1), function(source) {
		            if (source) {
		                for (var prop in source) {
		                    if (obj[prop] === undefined) obj[prop] = source[prop];
		                }
		            }
		        });
		        return obj;
		    }
		    var cookie = {
		        create: function create(name, value, minutes, domain) {
		            var expires = void 0;
		            if (minutes) {
		                var date = new Date();
		                date.setTime(date.getTime() + minutes * 60 * 1e3);
		                expires = "; expires=" + date.toGMTString();
		            } else expires = "";
		            domain = domain ? "domain=" + domain + ";" : "";
		            document.cookie = name + "=" + value + expires + ";" + domain + "path=/";
		        },
		        read: function read(name) {
		            var nameEQ = name + "=";
		            var ca = document.cookie.split(";");
		            for (var i = 0; i < ca.length; i++) {
		                var c = ca[i];
		                while (c.charAt(0) === " ") {
		                    c = c.substring(1, c.length);
		                }
		                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		            }
		            return null;
		        },
		        remove: function remove(name) {
		            this.create(name, "", -1);
		        }
		    };
		    var cookie$1 = {
		        name: "cookie",
		        lookup: function lookup(options) {
		            var found = void 0;
		            if (options.lookupCookie && typeof document !== "undefined") {
		                var c = cookie.read(options.lookupCookie);
		                if (c) found = c;
		            }
		            return found;
		        },
		        cacheUserLanguage: function cacheUserLanguage(lng, options) {
		            if (options.lookupCookie && typeof document !== "undefined") {
		                cookie.create(options.lookupCookie, lng, options.cookieMinutes, options.cookieDomain);
		            }
		        }
		    };
		    var querystring = {
		        name: "querystring",
		        lookup: function lookup(options) {
		            var found = void 0;
		            if (typeof window !== "undefined") {
		                var query = window.location.search.substring(1);
		                var params = query.split("&");
		                for (var i = 0; i < params.length; i++) {
		                    var pos = params[i].indexOf("=");
		                    if (pos > 0) {
		                        var key = params[i].substring(0, pos);
		                        if (key === options.lookupQuerystring) {
		                            found = params[i].substring(pos + 1);
		                        }
		                    }
		                }
		            }
		            return found;
		        }
		    };
		    var hasLocalStorageSupport = void 0;
		    try {
		        hasLocalStorageSupport = window !== "undefined" && window.localStorage !== null;
		        var testKey = "i18next.translate.boo";
		        window.localStorage.setItem(testKey, "foo");
		        window.localStorage.removeItem(testKey);
		    } catch (e) {
		        hasLocalStorageSupport = false;
		    }
		    var localStorage = {
		        name: "localStorage",
		        lookup: function lookup(options) {
		            var found = void 0;
		            if (options.lookupLocalStorage && hasLocalStorageSupport) {
		                var lng = window.localStorage.getItem(options.lookupLocalStorage);
		                if (lng) found = lng;
		            }
		            return found;
		        },
		        cacheUserLanguage: function cacheUserLanguage(lng, options) {
		            if (options.lookupLocalStorage && hasLocalStorageSupport) {
		                window.localStorage.setItem(options.lookupLocalStorage, lng);
		            }
		        }
		    };
		    var navigator$1 = {
		        name: "navigator",
		        lookup: function lookup(options) {
		            var found = [];
		            if (typeof navigator !== "undefined") {
		                if (navigator.languages) {
		                    for (var i = 0; i < navigator.languages.length; i++) {
		                        found.push(navigator.languages[i]);
		                    }
		                }
		                if (navigator.userLanguage) {
		                    found.push(navigator.userLanguage);
		                }
		                if (navigator.language) {
		                    found.push(navigator.language);
		                }
		            }
		            return found.length > 0 ? found : undefined;
		        }
		    };
		    var htmlTag = {
		        name: "htmlTag",
		        lookup: function lookup(options) {
		            var found = void 0;
		            var htmlTag = options.htmlTag || (typeof document !== "undefined" ? document.documentElement : null);
		            if (htmlTag && typeof htmlTag.getAttribute === "function") {
		                found = htmlTag.getAttribute("lang");
		            }
		            return found;
		        }
		    };
		    function getDefaults() {
		        return {
		            order: [ "querystring", "cookie", "localStorage", "navigator", "htmlTag" ],
		            lookupQuerystring: "lng",
		            lookupCookie: "i18next",
		            lookupLocalStorage: "i18nextLng",
		            caches: [ "localStorage" ]
		        };
		    }
		    var Browser = function() {
		        function Browser(services) {
		            var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		            babelHelpers.classCallCheck(this, Browser);
		            this.type = "languageDetector";
		            this.detectors = {};
		            this.init(services, options);
		        }
		        babelHelpers.createClass(Browser, [ {
		            key: "init",
		            value: function init(services) {
		                var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
		                var i18nOptions = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
		                this.services = services;
		                this.options = defaults(options, this.options || {}, getDefaults());
		                this.i18nOptions = i18nOptions;
		                this.addDetector(cookie$1);
		                this.addDetector(querystring);
		                this.addDetector(localStorage);
		                this.addDetector(navigator$1);
		                this.addDetector(htmlTag);
		            }
		        }, {
		            key: "addDetector",
		            value: function addDetector(detector) {
		                this.detectors[detector.name] = detector;
		            }
		        }, {
		            key: "detect",
		            value: function detect(detectionOrder) {
		                var _this = this;
		                if (!detectionOrder) detectionOrder = this.options.order;
		                var detected = [];
		                detectionOrder.forEach(function(detectorName) {
		                    if (_this.detectors[detectorName]) {
		                        var lookup = _this.detectors[detectorName].lookup(_this.options);
		                        if (lookup && typeof lookup === "string") lookup = [ lookup ];
		                        if (lookup) detected = detected.concat(lookup);
		                    }
		                });
		                var found = void 0;
		                detected.forEach(function(lng) {
		                    if (found) return;
		                    var cleanedLng = _this.services.languageUtils.formatLanguageCode(lng);
		                    if (_this.services.languageUtils.isWhitelisted(cleanedLng)) found = cleanedLng;
		                });
		                return found || this.i18nOptions.fallbackLng[0];
		            }
		        }, {
		            key: "cacheUserLanguage",
		            value: function cacheUserLanguage(lng, caches) {
		                var _this2 = this;
		                if (!caches) caches = this.options.caches;
		                if (!caches) return;
		                caches.forEach(function(cacheName) {
		                    if (_this2.detectors[cacheName]) _this2.detectors[cacheName].cacheUserLanguage(lng, _this2.options);
		                });
		            }
		        } ]);
		        return Browser;
		    }();
		    Browser.type = "languageDetector";
		    return Browser;
		});

		(function(factory) {
		    if (true) {
		        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(1) ], __WEBPACK_LOCAL_MODULE_3__ = (function($) {
		            return factory($, window);
		        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));
		    } else if (typeof module === "object" && module.exports) {
		        module.exports = factory(require("jquery"), window);
		    } else {
		        factory(jQuery, window);
		    }
		})(function(jQuery, window) {
		    jQuery.migrateVersion = "3.0.1-pre";
		    (function() {
		        var log = window.console && window.console.log && function() {
		            window.console.log.apply(window.console, arguments);
		        }, rbadVersions = /^[12]\./;
		        if (!log) {
		            return;
		        }
		        if (!jQuery || rbadVersions.test(jQuery.fn.jquery)) {
		            log("JQMIGRATE: jQuery 3.0.0+ REQUIRED");
		        }
		        if (jQuery.migrateWarnings) {
		            log("JQMIGRATE: Migrate plugin loaded multiple times");
		        }
		        if (!jQuery.migrateMute) {
		            log("JQMIGRATE: Migrate is installed" + (jQuery.migrateMute ? "" : " with logging active") + ", version " + jQuery.migrateVersion);
		        }
		    })();
		    var warnedAbout = {};
		    jQuery.migrateWarnings = [];
		    if (jQuery.migrateTrace === undefined) {
		        jQuery.migrateTrace = true;
		    }
		    jQuery.migrateReset = function() {
		        warnedAbout = {};
		        jQuery.migrateWarnings.length = 0;
		    };
		    function migrateWarn(msg) {
		        var console = window.console;
		        if (!warnedAbout[msg]) {
		            warnedAbout[msg] = true;
		            jQuery.migrateWarnings.push(msg);
		            if (console && console.warn && !jQuery.migrateMute) {
		                console.warn("JQMIGRATE: " + msg);
		                if (jQuery.migrateTrace && console.trace) {
		                    console.trace();
		                }
		            }
		        }
		    }
		    function migrateWarnProp(obj, prop, value, msg) {
		        Object.defineProperty(obj, prop, {
		            configurable: true,
		            enumerable: true,
		            get: function() {
		                migrateWarn(msg);
		                return value;
		            },
		            set: function(newValue) {
		                migrateWarn(msg);
		                value = newValue;
		            }
		        });
		    }
		    function migrateWarnFunc(obj, prop, newFunc, msg) {
		        obj[prop] = function() {
		            migrateWarn(msg);
		            return newFunc.apply(this, arguments);
		        };
		    }
		    if (window.document.compatMode === "BackCompat") {
		        migrateWarn("jQuery is not compatible with Quirks Mode");
		    }
		    var oldInit = jQuery.fn.init, oldIsNumeric = jQuery.isNumeric, oldFind = jQuery.find, rattrHashTest = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/, rattrHashGlob = /\[(\s*[-\w]+\s*)([~|^$*]?=)\s*([-\w#]*?#[-\w#]*)\s*\]/g;
		    jQuery.fn.init = function(arg1) {
		        var args = Array.prototype.slice.call(arguments);
		        if (typeof arg1 === "string" && arg1 === "#") {
		            migrateWarn("jQuery( '#' ) is not a valid selector");
		            args[0] = [];
		        }
		        return oldInit.apply(this, args);
		    };
		    jQuery.fn.init.prototype = jQuery.fn;
		    jQuery.find = function(selector) {
		        var args = Array.prototype.slice.call(arguments);
		        if (typeof selector === "string" && rattrHashTest.test(selector)) {
		            try {
		                window.document.querySelector(selector);
		            } catch (err1) {
		                selector = selector.replace(rattrHashGlob, function(_, attr, op, value) {
		                    return "[" + attr + op + '"' + value + '"]';
		                });
		                try {
		                    window.document.querySelector(selector);
		                    migrateWarn("Attribute selector with '#' must be quoted: " + args[0]);
		                    args[0] = selector;
		                } catch (err2) {
		                    migrateWarn("Attribute selector with '#' was not fixed: " + args[0]);
		                }
		            }
		        }
		        return oldFind.apply(this, args);
		    };
		    var findProp;
		    for (findProp in oldFind) {
		        if (Object.prototype.hasOwnProperty.call(oldFind, findProp)) {
		            jQuery.find[findProp] = oldFind[findProp];
		        }
		    }
		    jQuery.fn.size = function() {
		        migrateWarn("jQuery.fn.size() is deprecated and removed; use the .length property");
		        return this.length;
		    };
		    jQuery.parseJSON = function() {
		        migrateWarn("jQuery.parseJSON is deprecated; use JSON.parse");
		        return JSON.parse.apply(null, arguments);
		    };
		    jQuery.isNumeric = function(val) {
		        function isNumeric2(obj) {
		            var realStringObj = obj && obj.toString();
		            return !jQuery.isArray(obj) && realStringObj - parseFloat(realStringObj) + 1 >= 0;
		        }
		        var newValue = oldIsNumeric(val), oldValue = isNumeric2(val);
		        if (newValue !== oldValue) {
		            migrateWarn("jQuery.isNumeric() should not be called on constructed objects");
		        }
		        return oldValue;
		    };
		    migrateWarnFunc(jQuery, "unique", jQuery.uniqueSort, "jQuery.unique is deprecated; use jQuery.uniqueSort");
		    migrateWarnProp(jQuery.expr, "filters", jQuery.expr.pseudos, "jQuery.expr.filters is deprecated; use jQuery.expr.pseudos");
		    migrateWarnProp(jQuery.expr, ":", jQuery.expr.pseudos, "jQuery.expr[':'] is deprecated; use jQuery.expr.pseudos");
		    var oldAjax = jQuery.ajax;
		    jQuery.ajax = function() {
		        var jQXHR = oldAjax.apply(this, arguments);
		        if (jQXHR.promise) {
		            migrateWarnFunc(jQXHR, "success", jQXHR.done, "jQXHR.success is deprecated and removed");
		            migrateWarnFunc(jQXHR, "error", jQXHR.fail, "jQXHR.error is deprecated and removed");
		            migrateWarnFunc(jQXHR, "complete", jQXHR.always, "jQXHR.complete is deprecated and removed");
		        }
		        return jQXHR;
		    };
		    var oldRemoveAttr = jQuery.fn.removeAttr, oldToggleClass = jQuery.fn.toggleClass, rmatchNonSpace = /\S+/g;
		    jQuery.fn.removeAttr = function(name) {
		        var self = this;
		        jQuery.each(name.match(rmatchNonSpace), function(i, attr) {
		            if (jQuery.expr.match.bool.test(attr)) {
		                migrateWarn("jQuery.fn.removeAttr no longer sets boolean properties: " + attr);
		                self.prop(attr, false);
		            }
		        });
		        return oldRemoveAttr.apply(this, arguments);
		    };
		    jQuery.fn.toggleClass = function(state) {
		        if (state !== undefined && typeof state !== "boolean") {
		            return oldToggleClass.apply(this, arguments);
		        }
		        migrateWarn("jQuery.fn.toggleClass( boolean ) is deprecated");
		        return this.each(function() {
		            var className = this.getAttribute && this.getAttribute("class") || "";
		            if (className) {
		                jQuery.data(this, "__className__", className);
		            }
		            if (this.setAttribute) {
		                this.setAttribute("class", className || state === false ? "" : jQuery.data(this, "__className__") || "");
		            }
		        });
		    };
		    var internalSwapCall = false;
		    if (jQuery.swap) {
		        jQuery.each([ "height", "width", "reliableMarginRight" ], function(_, name) {
		            var oldHook = jQuery.cssHooks[name] && jQuery.cssHooks[name].get;
		            if (oldHook) {
		                jQuery.cssHooks[name].get = function() {
		                    var ret;
		                    internalSwapCall = true;
		                    ret = oldHook.apply(this, arguments);
		                    internalSwapCall = false;
		                    return ret;
		                };
		            }
		        });
		    }
		    jQuery.swap = function(elem, options, callback, args) {
		        var ret, name, old = {};
		        if (!internalSwapCall) {
		            migrateWarn("jQuery.swap() is undocumented and deprecated");
		        }
		        for (name in options) {
		            old[name] = elem.style[name];
		            elem.style[name] = options[name];
		        }
		        ret = callback.apply(elem, args || []);
		        for (name in options) {
		            elem.style[name] = old[name];
		        }
		        return ret;
		    };
		    var oldData = jQuery.data;
		    jQuery.data = function(elem, name, value) {
		        var curData;
		        if (name && typeof name === "object" && arguments.length === 2) {
		            curData = jQuery.hasData(elem) && oldData.call(this, elem);
		            var sameKeys = {};
		            for (var key in name) {
		                if (key !== jQuery.camelCase(key)) {
		                    migrateWarn("jQuery.data() always sets/gets camelCased names: " + key);
		                    curData[key] = name[key];
		                } else {
		                    sameKeys[key] = name[key];
		                }
		            }
		            oldData.call(this, elem, sameKeys);
		            return name;
		        }
		        if (name && typeof name === "string" && name !== jQuery.camelCase(name)) {
		            curData = jQuery.hasData(elem) && oldData.call(this, elem);
		            if (curData && name in curData) {
		                migrateWarn("jQuery.data() always sets/gets camelCased names: " + name);
		                if (arguments.length > 2) {
		                    curData[name] = value;
		                }
		                return curData[name];
		            }
		        }
		        return oldData.apply(this, arguments);
		    };
		    var oldTweenRun = jQuery.Tween.prototype.run;
		    jQuery.Tween.prototype.run = function() {
		        if (jQuery.easing[this.easing].length > 1) {
		            migrateWarn("easing function " + '"jQuery.easing.' + this.easing.toString() + '" should use only first argument');
		            var oldEasing = jQuery.easing[this.easing];
		            jQuery.easing[this.easing] = function(percent) {
		                return oldEasing.call(jQuery.easing, percent, percent, 0, 1, 1);
		            }.bind(this);
		        }
		        oldTweenRun.apply(this, arguments);
		    };
		    jQuery.fx.interval = jQuery.fx.interval || 13;
		    if (window.requestAnimationFrame) {
		        migrateWarnProp(jQuery.fx, "interval", jQuery.fx.interval, "jQuery.fx.interval is deprecated");
		    }
		    var oldLoad = jQuery.fn.load, oldEventAdd = jQuery.event.add, originalFix = jQuery.event.fix;
		    jQuery.event.props = [];
		    jQuery.event.fixHooks = {};
		    migrateWarnProp(jQuery.event.props, "concat", jQuery.event.props.concat, "jQuery.event.props.concat() is deprecated and removed");
		    jQuery.event.fix = function(originalEvent) {
		        var event, type = originalEvent.type, fixHook = this.fixHooks[type], props = jQuery.event.props;
		        if (props.length) {
		            migrateWarn("jQuery.event.props are deprecated and removed: " + props.join());
		            while (props.length) {
		                jQuery.event.addProp(props.pop());
		            }
		        }
		        if (fixHook && !fixHook._migrated_) {
		            fixHook._migrated_ = true;
		            migrateWarn("jQuery.event.fixHooks are deprecated and removed: " + type);
		            if ((props = fixHook.props) && props.length) {
		                while (props.length) {
		                    jQuery.event.addProp(props.pop());
		                }
		            }
		        }
		        event = originalFix.call(this, originalEvent);
		        return fixHook && fixHook.filter ? fixHook.filter(event, originalEvent) : event;
		    };
		    jQuery.event.add = function(elem, types) {
		        if (elem === window && types === "load" && window.document.readyState === "complete") {
		            migrateWarn("jQuery(window).on('load'...) called after load event occurred");
		        }
		        return oldEventAdd.apply(this, arguments);
		    };
		    jQuery.each([ "load", "unload", "error" ], function(_, name) {
		        jQuery.fn[name] = function() {
		            var args = Array.prototype.slice.call(arguments, 0);
		            if (name === "load" && typeof args[0] === "string") {
		                return oldLoad.apply(this, args);
		            }
		            migrateWarn("jQuery.fn." + name + "() is deprecated");
		            args.splice(0, 0, name);
		            if (arguments.length) {
		                return this.on.apply(this, args);
		            }
		            this.triggerHandler.apply(this, args);
		            return this;
		        };
		    });
		    jQuery(function() {
		        jQuery(window.document).triggerHandler("ready");
		    });
		    jQuery.event.special.ready = {
		        setup: function() {
		            if (this === window.document) {
		                migrateWarn("'ready' event is deprecated");
		            }
		        }
		    };
		    jQuery.fn.extend({
		        bind: function(types, data, fn) {
		            migrateWarn("jQuery.fn.bind() is deprecated");
		            return this.on(types, null, data, fn);
		        },
		        unbind: function(types, fn) {
		            migrateWarn("jQuery.fn.unbind() is deprecated");
		            return this.off(types, null, fn);
		        },
		        delegate: function(selector, types, data, fn) {
		            migrateWarn("jQuery.fn.delegate() is deprecated");
		            return this.on(types, selector, data, fn);
		        },
		        undelegate: function(selector, types, fn) {
		            migrateWarn("jQuery.fn.undelegate() is deprecated");
		            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
		        }
		    });
		    var oldOffset = jQuery.fn.offset;
		    jQuery.fn.offset = function() {
		        var docElem, elem = this[0], origin = {
		            top: 0,
		            left: 0
		        };
		        if (!elem || !elem.nodeType) {
		            migrateWarn("jQuery.fn.offset() requires a valid DOM element");
		            return origin;
		        }
		        docElem = (elem.ownerDocument || window.document).documentElement;
		        if (!jQuery.contains(docElem, elem)) {
		            migrateWarn("jQuery.fn.offset() requires an element connected to a document");
		            return origin;
		        }
		        return oldOffset.apply(this, arguments);
		    };
		    var oldParam = jQuery.param;
		    jQuery.param = function(data, traditional) {
		        var ajaxTraditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
		        if (traditional === undefined && ajaxTraditional) {
		            migrateWarn("jQuery.param() no longer uses jQuery.ajaxSettings.traditional");
		            traditional = ajaxTraditional;
		        }
		        return oldParam.call(this, data, traditional);
		    };
		    var oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack;
		    jQuery.fn.andSelf = function() {
		        migrateWarn("jQuery.fn.andSelf() is deprecated and removed, use jQuery.fn.addBack()");
		        return oldSelf.apply(this, arguments);
		    };
		    var oldDeferred = jQuery.Deferred, tuples = [ [ "resolve", "done", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), "resolved" ], [ "reject", "fail", jQuery.Callbacks("once memory"), jQuery.Callbacks("once memory"), "rejected" ], [ "notify", "progress", jQuery.Callbacks("memory"), jQuery.Callbacks("memory") ] ];
		    jQuery.Deferred = function(func) {
		        var deferred = oldDeferred(), promise = deferred.promise();
		        deferred.pipe = promise.pipe = function() {
		            var fns = arguments;
		            migrateWarn("deferred.pipe() is deprecated");
		            return jQuery.Deferred(function(newDefer) {
		                jQuery.each(tuples, function(i, tuple) {
		                    var fn = jQuery.isFunction(fns[i]) && fns[i];
		                    deferred[tuple[1]](function() {
		                        var returned = fn && fn.apply(this, arguments);
		                        if (returned && jQuery.isFunction(returned.promise)) {
		                            returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
		                        } else {
		                            newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments);
		                        }
		                    });
		                });
		                fns = null;
		            }).promise();
		        };
		        if (func) {
		            func.call(deferred, deferred);
		        }
		        return deferred;
		    };
		    return jQuery;
		});

		(function(root, doc, factory) {
		    if (true) {
		        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(1) ], __WEBPACK_LOCAL_MODULE_4__ = (function($) {
		            factory($, root, doc);
		            return $.mobile;
		        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));
		    } else {
		        factory(root.jQuery, root, doc);
		    }
		})(window, document, function(jQuery, window, document, undefined) {
		    (function($) {
		        $.mobile = {};
		    })(jQuery);
		    (function($, undefined) {
		        var uuid = 0, runiqueId = /^ui-id-\d+$/;
		        $.ui = $.ui || {};
		        $.extend($.ui, {
		            version: "c0ab71056b936627e8a7821f03c044aec6280a40",
		            keyCode: {
		                BACKSPACE: 8,
		                COMMA: 188,
		                DELETE: 46,
		                DOWN: 40,
		                END: 35,
		                ENTER: 13,
		                ESCAPE: 27,
		                HOME: 36,
		                LEFT: 37,
		                PAGE_DOWN: 34,
		                PAGE_UP: 33,
		                PERIOD: 190,
		                RIGHT: 39,
		                SPACE: 32,
		                TAB: 9,
		                UP: 38
		            }
		        });
		        $.fn.extend({
		            focus: function(orig) {
		                return function(delay, fn) {
		                    return typeof delay === "number" ? this.each(function() {
		                        var elem = this;
		                        setTimeout(function() {
		                            $(elem).focus();
		                            if (fn) {
		                                fn.call(elem);
		                            }
		                        }, delay);
		                    }) : orig.apply(this, arguments);
		                };
		            }($.fn.focus),
		            scrollParent: function() {
		                var scrollParent;
		                if ($.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position"))) {
		                    scrollParent = this.parents().filter(function() {
		                        return /(relative|absolute|fixed)/.test($.css(this, "position")) && /(auto|scroll)/.test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
		                    }).eq(0);
		                } else {
		                    scrollParent = this.parents().filter(function() {
		                        return /(auto|scroll)/.test($.css(this, "overflow") + $.css(this, "overflow-y") + $.css(this, "overflow-x"));
		                    }).eq(0);
		                }
		                return /fixed/.test(this.css("position")) || !scrollParent.length ? $(this[0].ownerDocument || document) : scrollParent;
		            },
		            uniqueId: function() {
		                return this.each(function() {
		                    if (!this.id) {
		                        this.id = "ui-id-" + ++uuid;
		                    }
		                });
		            },
		            removeUniqueId: function() {
		                return this.each(function() {
		                    if (runiqueId.test(this.id)) {
		                        $(this).removeAttr("id");
		                    }
		                });
		            }
		        });
		        function focusable(element, isTabIndexNotNaN) {
		            var map, mapName, img, nodeName = element.nodeName.toLowerCase();
		            if ("area" === nodeName) {
		                map = element.parentNode;
		                mapName = map.name;
		                if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
		                    return false;
		                }
		                img = $("img[usemap=#" + mapName + "]")[0];
		                return !!img && visible(img);
		            }
		            return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" === nodeName ? element.href || isTabIndexNotNaN : isTabIndexNotNaN) && visible(element);
		        }
		        function visible(element) {
		            return $.expr.filters.visible(element) && !$(element).parents().addBack().filter(function() {
		                return $.css(this, "visibility") === "hidden";
		            }).length;
		        }
		        $.extend($.expr[":"], {
		            data: $.expr.createPseudo ? $.expr.createPseudo(function(dataName) {
		                return function(elem) {
		                    return !!$.data(elem, dataName);
		                };
		            }) : function(elem, i, match) {
		                return !!$.data(elem, match[3]);
		            },
		            focusable: function(element) {
		                return focusable(element, !isNaN($.attr(element, "tabindex")));
		            },
		            tabbable: function(element) {
		                var tabIndex = $.attr(element, "tabindex"), isTabIndexNaN = isNaN(tabIndex);
		                return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
		            }
		        });
		        if (!$("<a>").outerWidth(1).jquery) {
		            $.each([ "Width", "Height" ], function(i, name) {
		                var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ], type = name.toLowerCase(), orig = {
		                    innerWidth: $.fn.innerWidth,
		                    innerHeight: $.fn.innerHeight,
		                    outerWidth: $.fn.outerWidth,
		                    outerHeight: $.fn.outerHeight
		                };
		                function reduce(elem, size, border, margin) {
		                    $.each(side, function() {
		                        size -= parseFloat($.css(elem, "padding" + this)) || 0;
		                        if (border) {
		                            size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
		                        }
		                        if (margin) {
		                            size -= parseFloat($.css(elem, "margin" + this)) || 0;
		                        }
		                    });
		                    return size;
		                }
		                $.fn["inner" + name] = function(size) {
		                    if (size === undefined) {
		                        return orig["inner" + name].call(this);
		                    }
		                    return this.each(function() {
		                        $(this).css(type, reduce(this, size) + "px");
		                    });
		                };
		                $.fn["outer" + name] = function(size, margin) {
		                    if (typeof size !== "number") {
		                        return orig["outer" + name].call(this, size);
		                    }
		                    return this.each(function() {
		                        $(this).css(type, reduce(this, size, true, margin) + "px");
		                    });
		                };
		            });
		        }
		        if (!$.fn.addBack) {
		            $.fn.addBack = function(selector) {
		                return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
		            };
		        }
		        if ($("<a>").data("a-b", "a").removeData("a-b").data("a-b")) {
		            $.fn.removeData = function(removeData) {
		                return function(key) {
		                    if (arguments.length) {
		                        return removeData.call(this, $.camelCase(key));
		                    } else {
		                        return removeData.call(this);
		                    }
		                };
		            }($.fn.removeData);
		        }
		        $.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase());
		        $.support.selectstart = "onselectstart" in document.createElement("div");
		        $.fn.extend({
		            disableSelection: function() {
		                return this.bind(($.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function(event) {
		                    event.preventDefault();
		                });
		            },
		            enableSelection: function() {
		                return this.unbind(".ui-disableSelection");
		            },
		            zIndex: function(zIndex) {
		                if (zIndex !== undefined) {
		                    return this.css("zIndex", zIndex);
		                }
		                if (this.length) {
		                    var elem = $(this[0]), position, value;
		                    while (elem.length && elem[0] !== document) {
		                        position = elem.css("position");
		                        if (position === "absolute" || position === "relative" || position === "fixed") {
		                            value = parseInt(elem.css("zIndex"), 10);
		                            if (!isNaN(value) && value !== 0) {
		                                return value;
		                            }
		                        }
		                        elem = elem.parent();
		                    }
		                }
		                return 0;
		            }
		        });
		        $.ui.plugin = {
		            add: function(module, option, set) {
		                var i, proto = $.ui[module].prototype;
		                for (i in set) {
		                    proto.plugins[i] = proto.plugins[i] || [];
		                    proto.plugins[i].push([ option, set[i] ]);
		                }
		            },
		            call: function(instance, name, args, allowDisconnected) {
		                var i, set = instance.plugins[name];
		                if (!set) {
		                    return;
		                }
		                if (!allowDisconnected && (!instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11)) {
		                    return;
		                }
		                for (i = 0; i < set.length; i++) {
		                    if (instance.options[set[i][0]]) {
		                        set[i][1].apply(instance.element, args);
		                    }
		                }
		            }
		        };
		    })(jQuery);
		    (function($, window, undefined) {
		        var compensateToolbars = function(page, desiredHeight) {
		            var pageParent = page.parent(), toolbarsAffectingHeight = [], noPadders = function() {
		                var theElement = $(this), widgetOptions = $.mobile.toolbar && theElement.data("mobile-toolbar") ? theElement.toolbar("option") : {
		                    position: theElement.attr("data-" + $.mobile.ns + "position"),
		                    updatePagePadding: theElement.attr("data-" + $.mobile.ns + "update-page-padding") !== false
		                };
		                return !(widgetOptions.position === "fixed" && widgetOptions.updatePagePadding === true);
		            }, externalHeaders = pageParent.children(":jqmData(role='header')").filter(noPadders), internalHeaders = page.children(":jqmData(role='header')"), externalFooters = pageParent.children(":jqmData(role='footer')").filter(noPadders), internalFooters = page.children(":jqmData(role='footer')");
		            if (internalHeaders.length === 0 && externalHeaders.length > 0) {
		                toolbarsAffectingHeight = toolbarsAffectingHeight.concat(externalHeaders.toArray());
		            }
		            if (internalFooters.length === 0 && externalFooters.length > 0) {
		                toolbarsAffectingHeight = toolbarsAffectingHeight.concat(externalFooters.toArray());
		            }
		            $.each(toolbarsAffectingHeight, function(index, value) {
		                desiredHeight -= $(value).outerHeight();
		            });
		            return Math.max(0, desiredHeight);
		        };
		        $.extend($.mobile, {
		            window: $(window),
		            document: $(document),
		            keyCode: $.ui.keyCode,
		            behaviors: {},
		            silentScroll: function(ypos) {
		                if ($.type(ypos) !== "number") {
		                    ypos = $.mobile.defaultHomeScroll;
		                }
		                $.event.special.scrollstart.enabled = false;
		                setTimeout(function() {
		                    window.scrollTo(0, ypos);
		                    $.mobile.document.trigger("silentscroll", {
		                        x: 0,
		                        y: ypos
		                    });
		                }, 20);
		                setTimeout(function() {
		                    $.event.special.scrollstart.enabled = true;
		                }, 150);
		            },
		            getClosestBaseUrl: function(ele) {
		                var url = $(ele).closest(".ui-page").jqmData("url"), base = $.mobile.path.documentBase.hrefNoHash;
		                if (!$.mobile.dynamicBaseEnabled || !url || !$.mobile.path.isPath(url)) {
		                    url = base;
		                }
		                return $.mobile.path.makeUrlAbsolute(url, base);
		            },
		            removeActiveLinkClass: function(forceRemoval) {
		                if (!!$.mobile.activeClickedLink && (!$.mobile.activeClickedLink.closest("." + $.mobile.activePageClass).length || forceRemoval)) {
		                    $.mobile.activeClickedLink.removeClass($.mobile.activeBtnClass);
		                }
		                $.mobile.activeClickedLink = null;
		            },
		            getInheritedTheme: function(el, defaultTheme) {
		                var e = el[0], ltr = "", re = /ui-(bar|body|overlay)-([a-z])\b/, c, m;
		                while (e) {
		                    c = e.className || "";
		                    if (c && (m = re.exec(c)) && (ltr = m[2])) {
		                        break;
		                    }
		                    e = e.parentNode;
		                }
		                return ltr || defaultTheme || "a";
		            },
		            enhanceable: function(elements) {
		                return this.haveParents(elements, "enhance");
		            },
		            hijackable: function(elements) {
		                return this.haveParents(elements, "ajax");
		            },
		            haveParents: function(elements, attr) {
		                if (!$.mobile.ignoreContentEnabled) {
		                    return elements;
		                }
		                var count = elements.length, $newSet = $(), e, $element, excluded, i, c;
		                for (i = 0; i < count; i++) {
		                    $element = elements.eq(i);
		                    excluded = false;
		                    e = elements[i];
		                    while (e) {
		                        c = e.getAttribute ? e.getAttribute("data-" + $.mobile.ns + attr) : "";
		                        if (c === "false") {
		                            excluded = true;
		                            break;
		                        }
		                        e = e.parentNode;
		                    }
		                    if (!excluded) {
		                        $newSet = $newSet.add($element);
		                    }
		                }
		                return $newSet;
		            },
		            getScreenHeight: function() {
		                return window.innerHeight || $.mobile.window.height();
		            },
		            resetActivePageHeight: function(height) {
		                var page = $("." + $.mobile.activePageClass), pageHeight = page.height(), pageOuterHeight = page.outerHeight(true);
		                height = compensateToolbars(page, typeof height === "number" ? height : $.mobile.getScreenHeight());
		                page.css("min-height", "");
		                if (page.height() < height) {
		                    page.css("min-height", height - (pageOuterHeight - pageHeight));
		                }
		            },
		            loading: function() {
		                var loader = this.loading._widget || $($.mobile.loader.prototype.defaultHtml).loader(), returnValue = loader.loader.apply(loader, arguments);
		                this.loading._widget = loader;
		                return returnValue;
		            }
		        });
		        $.addDependents = function(elem, newDependents) {
		            var $elem = $(elem), dependents = $elem.jqmData("dependents") || $();
		            $elem.jqmData("dependents", $(dependents).add(newDependents));
		        };
		        $.fn.extend({
		            removeWithDependents: function() {
		                $.removeWithDependents(this);
		            },
		            enhanceWithin: function() {
		                var index, widgetElements = {}, keepNative = $.mobile.page.prototype.keepNativeSelector(), that = this;
		                if ($.mobile.nojs) {
		                    $.mobile.nojs(this);
		                }
		                if ($.mobile.links) {
		                    $.mobile.links(this);
		                }
		                if ($.mobile.degradeInputsWithin) {
		                    $.mobile.degradeInputsWithin(this);
		                }
		                if ($.fn.buttonMarkup) {
		                    this.find($.fn.buttonMarkup.initSelector).not(keepNative).jqmEnhanceable().buttonMarkup();
		                }
		                if ($.fn.fieldcontain) {
		                    this.find(":jqmData(role='fieldcontain')").not(keepNative).jqmEnhanceable().fieldcontain();
		                }
		                $.each($.mobile.widgets, function(name, constructor) {
		                    if (constructor.initSelector) {
		                        var elements = $.mobile.enhanceable(that.find(constructor.initSelector));
		                        if (elements.length > 0) {
		                            elements = elements.not(keepNative);
		                        }
		                        if (elements.length > 0) {
		                            widgetElements[constructor.prototype.widgetName] = elements;
		                        }
		                    }
		                });
		                for (index in widgetElements) {
		                    widgetElements[index][index]();
		                }
		                return this;
		            },
		            addDependents: function(newDependents) {
		                $.addDependents(this, newDependents);
		            },
		            getEncodedText: function() {
		                return $("<a>").text(this.text()).html();
		            },
		            jqmEnhanceable: function() {
		                return $.mobile.enhanceable(this);
		            },
		            jqmHijackable: function() {
		                return $.mobile.hijackable(this);
		            }
		        });
		        $.removeWithDependents = function(nativeElement) {
		            var element = $(nativeElement);
		            (element.jqmData("dependents") || $()).remove();
		            element.remove();
		        };
		        $.addDependents = function(nativeElement, newDependents) {
		            var element = $(nativeElement), dependents = element.jqmData("dependents") || $();
		            element.jqmData("dependents", $(dependents).add(newDependents));
		        };
		        $.find.matches = function(expr, set) {
		            return $.find(expr, null, null, set);
		        };
		        $.find.matchesSelector = function(node, expr) {
		            return $.find(expr, null, null, [ node ]).length > 0;
		        };
		    })(jQuery, this);
		    (function($, window, undefined) {
		        $.extend($.mobile, {
		            version: "1.4.5",
		            subPageUrlKey: "ui-page",
		            hideUrlBar: true,
		            keepNative: ":jqmData(role='none'), :jqmData(role='nojs')",
		            activePageClass: "ui-page-active",
		            activeBtnClass: "ui-btn-active",
		            focusClass: "ui-focus",
		            ajaxEnabled: true,
		            hashListeningEnabled: true,
		            linkBindingEnabled: true,
		            defaultPageTransition: "fade",
		            maxTransitionWidth: false,
		            minScrollBack: 0,
		            defaultDialogTransition: "pop",
		            pageLoadErrorMessage: "Error Loading Page",
		            pageLoadErrorMessageTheme: "a",
		            phonegapNavigationEnabled: false,
		            autoInitializePage: true,
		            pushStateEnabled: true,
		            ignoreContentEnabled: false,
		            buttonMarkup: {
		                hoverDelay: 200
		            },
		            dynamicBaseEnabled: true,
		            pageContainer: $(),
		            allowCrossDomainPages: false,
		            dialogHashKey: "&ui-state=dialog"
		        });
		    })(jQuery, this);
		    (function($, undefined) {
		        var uuid = 0, slice = Array.prototype.slice, _cleanData = $.cleanData;
		        $.cleanData = function(elems) {
		            for (var i = 0, elem; (elem = elems[i]) != null; i++) {
		                try {
		                    $(elem).triggerHandler("remove");
		                } catch (e) {}
		            }
		            _cleanData(elems);
		        };
		        $.widget = function(name, base, prototype) {
		            var fullName, existingConstructor, constructor, basePrototype, proxiedPrototype = {}, namespace = name.split(".")[0];
		            name = name.split(".")[1];
		            fullName = namespace + "-" + name;
		            if (!prototype) {
		                prototype = base;
		                base = $.Widget;
		            }
		            $.expr[":"][fullName.toLowerCase()] = function(elem) {
		                return !!$.data(elem, fullName);
		            };
		            $[namespace] = $[namespace] || {};
		            existingConstructor = $[namespace][name];
		            constructor = $[namespace][name] = function(options, element) {
		                if (!this._createWidget) {
		                    return new constructor(options, element);
		                }
		                if (arguments.length) {
		                    this._createWidget(options, element);
		                }
		            };
		            $.extend(constructor, existingConstructor, {
		                version: prototype.version,
		                _proto: $.extend({}, prototype),
		                _childConstructors: []
		            });
		            basePrototype = new base();
		            basePrototype.options = $.widget.extend({}, basePrototype.options);
		            $.each(prototype, function(prop, value) {
		                if (!$.isFunction(value)) {
		                    proxiedPrototype[prop] = value;
		                    return;
		                }
		                proxiedPrototype[prop] = function() {
		                    var _super = function() {
		                        return base.prototype[prop].apply(this, arguments);
		                    }, _superApply = function(args) {
		                        return base.prototype[prop].apply(this, args);
		                    };
		                    return function() {
		                        var __super = this._super, __superApply = this._superApply, returnValue;
		                        this._super = _super;
		                        this._superApply = _superApply;
		                        returnValue = value.apply(this, arguments);
		                        this._super = __super;
		                        this._superApply = __superApply;
		                        return returnValue;
		                    };
		                }();
		            });
		            constructor.prototype = $.widget.extend(basePrototype, {
		                widgetEventPrefix: existingConstructor ? basePrototype.widgetEventPrefix || name : name
		            }, proxiedPrototype, {
		                constructor: constructor,
		                namespace: namespace,
		                widgetName: name,
		                widgetFullName: fullName
		            });
		            if (existingConstructor) {
		                $.each(existingConstructor._childConstructors, function(i, child) {
		                    var childPrototype = child.prototype;
		                    $.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
		                });
		                delete existingConstructor._childConstructors;
		            } else {
		                base._childConstructors.push(constructor);
		            }
		            $.widget.bridge(name, constructor);
		            return constructor;
		        };
		        $.widget.extend = function(target) {
		            var input = slice.call(arguments, 1), inputIndex = 0, inputLength = input.length, key, value;
		            for (;inputIndex < inputLength; inputIndex++) {
		                for (key in input[inputIndex]) {
		                    value = input[inputIndex][key];
		                    if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
		                        if ($.isPlainObject(value)) {
		                            target[key] = $.isPlainObject(target[key]) ? $.widget.extend({}, target[key], value) : $.widget.extend({}, value);
		                        } else {
		                            target[key] = value;
		                        }
		                    }
		                }
		            }
		            return target;
		        };
		        $.widget.bridge = function(name, object) {
		            var fullName = object.prototype.widgetFullName || name;
		            $.fn[name] = function(options) {
		                var isMethodCall = typeof options === "string", args = slice.call(arguments, 1), returnValue = this;
		                options = !isMethodCall && args.length ? $.widget.extend.apply(null, [ options ].concat(args)) : options;
		                if (isMethodCall) {
		                    this.each(function() {
		                        var methodValue, instance = $.data(this, fullName);
		                        if (options === "instance") {
		                            returnValue = instance;
		                            return false;
		                        }
		                        if (!instance) {
		                            return $.error("cannot call methods on " + name + " prior to initialization; " + "attempted to call method '" + options + "'");
		                        }
		                        if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
		                            return $.error("no such method '" + options + "' for " + name + " widget instance");
		                        }
		                        methodValue = instance[options].apply(instance, args);
		                        if (methodValue !== instance && methodValue !== undefined) {
		                            returnValue = methodValue && methodValue.jquery ? returnValue.pushStack(methodValue.get()) : methodValue;
		                            return false;
		                        }
		                    });
		                } else {
		                    this.each(function() {
		                        var instance = $.data(this, fullName);
		                        if (instance) {
		                            instance.option(options || {})._init();
		                        } else {
		                            $.data(this, fullName, new object(options, this));
		                        }
		                    });
		                }
		                return returnValue;
		            };
		        };
		        $.Widget = function() {};
		        $.Widget._childConstructors = [];
		        $.Widget.prototype = {
		            widgetName: "widget",
		            widgetEventPrefix: "",
		            defaultElement: "<div>",
		            options: {
		                disabled: false,
		                create: null
		            },
		            _createWidget: function(options, element) {
		                element = $(element || this.defaultElement || this)[0];
		                this.element = $(element);
		                this.uuid = uuid++;
		                this.eventNamespace = "." + this.widgetName + this.uuid;
		                this.options = $.widget.extend({}, this.options, this._getCreateOptions(), options);
		                this.bindings = $();
		                this.hoverable = $();
		                this.focusable = $();
		                if (element !== this) {
		                    $.data(element, this.widgetFullName, this);
		                    this._on(true, this.element, {
		                        remove: function(event) {
		                            if (event.target === element) {
		                                this.destroy();
		                            }
		                        }
		                    });
		                    this.document = $(element.style ? element.ownerDocument : element.document || element);
		                    this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
		                }
		                this._create();
		                this._trigger("create", null, this._getCreateEventData());
		                this._init();
		            },
		            _getCreateOptions: $.noop,
		            _getCreateEventData: $.noop,
		            _create: $.noop,
		            _init: $.noop,
		            destroy: function() {
		                this._destroy();
		                this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData($.camelCase(this.widgetFullName));
		                this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled");
		                this.bindings.unbind(this.eventNamespace);
		                this.hoverable.removeClass("ui-state-hover");
		                this.focusable.removeClass("ui-state-focus");
		            },
		            _destroy: $.noop,
		            widget: function() {
		                return this.element;
		            },
		            option: function(key, value) {
		                var options = key, parts, curOption, i;
		                if (arguments.length === 0) {
		                    return $.widget.extend({}, this.options);
		                }
		                if (typeof key === "string") {
		                    options = {};
		                    parts = key.split(".");
		                    key = parts.shift();
		                    if (parts.length) {
		                        curOption = options[key] = $.widget.extend({}, this.options[key]);
		                        for (i = 0; i < parts.length - 1; i++) {
		                            curOption[parts[i]] = curOption[parts[i]] || {};
		                            curOption = curOption[parts[i]];
		                        }
		                        key = parts.pop();
		                        if (value === undefined) {
		                            return curOption[key] === undefined ? null : curOption[key];
		                        }
		                        curOption[key] = value;
		                    } else {
		                        if (value === undefined) {
		                            return this.options[key] === undefined ? null : this.options[key];
		                        }
		                        options[key] = value;
		                    }
		                }
		                this._setOptions(options);
		                return this;
		            },
		            _setOptions: function(options) {
		                var key;
		                for (key in options) {
		                    this._setOption(key, options[key]);
		                }
		                return this;
		            },
		            _setOption: function(key, value) {
		                this.options[key] = value;
		                if (key === "disabled") {
		                    this.widget().toggleClass(this.widgetFullName + "-disabled", !!value);
		                    this.hoverable.removeClass("ui-state-hover");
		                    this.focusable.removeClass("ui-state-focus");
		                }
		                return this;
		            },
		            enable: function() {
		                return this._setOptions({
		                    disabled: false
		                });
		            },
		            disable: function() {
		                return this._setOptions({
		                    disabled: true
		                });
		            },
		            _on: function(suppressDisabledCheck, element, handlers) {
		                var delegateElement, instance = this;
		                if (typeof suppressDisabledCheck !== "boolean") {
		                    handlers = element;
		                    element = suppressDisabledCheck;
		                    suppressDisabledCheck = false;
		                }
		                if (!handlers) {
		                    handlers = element;
		                    element = this.element;
		                    delegateElement = this.widget();
		                } else {
		                    element = delegateElement = $(element);
		                    this.bindings = this.bindings.add(element);
		                }
		                $.each(handlers, function(event, handler) {
		                    function handlerProxy() {
		                        if (!suppressDisabledCheck && (instance.options.disabled === true || $(this).hasClass("ui-state-disabled"))) {
		                            return;
		                        }
		                        return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
		                    }
		                    if (typeof handler !== "string") {
		                        handlerProxy.guid = handler.guid = handler.guid || handlerProxy.guid || $.guid++;
		                    }
		                    var match = event.match(/^(\w+)\s*(.*)$/), eventName = match[1] + instance.eventNamespace, selector = match[2];
		                    if (selector) {
		                        delegateElement.delegate(selector, eventName, handlerProxy);
		                    } else {
		                        element.bind(eventName, handlerProxy);
		                    }
		                });
		            },
		            _off: function(element, eventName) {
		                eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
		                element.unbind(eventName).undelegate(eventName);
		            },
		            _delay: function(handler, delay) {
		                function handlerProxy() {
		                    return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
		                }
		                var instance = this;
		                return setTimeout(handlerProxy, delay || 0);
		            },
		            _hoverable: function(element) {
		                this.hoverable = this.hoverable.add(element);
		                this._on(element, {
		                    mouseenter: function(event) {
		                        $(event.currentTarget).addClass("ui-state-hover");
		                    },
		                    mouseleave: function(event) {
		                        $(event.currentTarget).removeClass("ui-state-hover");
		                    }
		                });
		            },
		            _focusable: function(element) {
		                this.focusable = this.focusable.add(element);
		                this._on(element, {
		                    focusin: function(event) {
		                        $(event.currentTarget).addClass("ui-state-focus");
		                    },
		                    focusout: function(event) {
		                        $(event.currentTarget).removeClass("ui-state-focus");
		                    }
		                });
		            },
		            _trigger: function(type, event, data) {
		                var prop, orig, callback = this.options[type];
		                data = data || {};
		                event = $.Event(event);
		                event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();
		                event.target = this.element[0];
		                orig = event.originalEvent;
		                if (orig) {
		                    for (prop in orig) {
		                        if (!(prop in event)) {
		                            event[prop] = orig[prop];
		                        }
		                    }
		                }
		                this.element.trigger(event, data);
		                return !($.isFunction(callback) && callback.apply(this.element[0], [ event ].concat(data)) === false || event.isDefaultPrevented());
		            }
		        };
		        $.each({
		            show: "fadeIn",
		            hide: "fadeOut"
		        }, function(method, defaultEffect) {
		            $.Widget.prototype["_" + method] = function(element, options, callback) {
		                if (typeof options === "string") {
		                    options = {
		                        effect: options
		                    };
		                }
		                var hasOptions, effectName = !options ? method : options === true || typeof options === "number" ? defaultEffect : options.effect || defaultEffect;
		                options = options || {};
		                if (typeof options === "number") {
		                    options = {
		                        duration: options
		                    };
		                }
		                hasOptions = !$.isEmptyObject(options);
		                options.complete = callback;
		                if (options.delay) {
		                    element.delay(options.delay);
		                }
		                if (hasOptions && $.effects && $.effects.effect[effectName]) {
		                    element[method](options);
		                } else if (effectName !== method && element[effectName]) {
		                    element[effectName](options.duration, options.easing, callback);
		                } else {
		                    element.queue(function(next) {
		                        $(this)[method]();
		                        if (callback) {
		                            callback.call(element[0]);
		                        }
		                        next();
		                    });
		                }
		            };
		        });
		    })(jQuery);
		    (function($, window, undefined) {
		        var nsNormalizeDict = {}, oldFind = $.find, rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, jqmDataRE = /:jqmData\(([^)]*)\)/g;
		        $.extend($.mobile, {
		            ns: "",
		            getAttribute: function(element, key) {
		                var data;
		                element = element.jquery ? element[0] : element;
		                if (element && element.getAttribute) {
		                    data = element.getAttribute("data-" + $.mobile.ns + key);
		                }
		                try {
		                    data = data === "true" ? true : data === "false" ? false : data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? JSON.parse(data) : data;
		                } catch (err) {}
		                return data;
		            },
		            nsNormalizeDict: nsNormalizeDict,
		            nsNormalize: function(prop) {
		                return nsNormalizeDict[prop] || (nsNormalizeDict[prop] = $.camelCase($.mobile.ns + prop));
		            },
		            closestPageData: function($target) {
		                return $target.closest(":jqmData(role='page'), :jqmData(role='dialog')").data("mobile-page");
		            }
		        });
		        $.fn.jqmData = function(prop, value) {
		            var result;
		            if (typeof prop !== "undefined") {
		                if (prop) {
		                    prop = $.mobile.nsNormalize(prop);
		                }
		                if (arguments.length < 2 || value === undefined) {
		                    result = this.data(prop);
		                } else {
		                    result = this.data(prop, value);
		                }
		            }
		            return result;
		        };
		        $.jqmData = function(elem, prop, value) {
		            var result;
		            if (typeof prop !== "undefined") {
		                result = $.data(elem, prop ? $.mobile.nsNormalize(prop) : prop, value);
		            }
		            return result;
		        };
		        $.fn.jqmRemoveData = function(prop) {
		            return this.removeData($.mobile.nsNormalize(prop));
		        };
		        $.jqmRemoveData = function(elem, prop) {
		            return $.removeData(elem, $.mobile.nsNormalize(prop));
		        };
		        $.find = function(selector, context, ret, extra) {
		            if (selector.indexOf(":jqmData") > -1) {
		                selector = selector.replace(jqmDataRE, "[data-" + ($.mobile.ns || "") + "$1]");
		            }
		            return oldFind.call(this, selector, context, ret, extra);
		        };
		        $.extend($.find, oldFind);
		    })(jQuery, this);
		    (function($, undefined) {
		        var rcapitals = /[A-Z]/g, replaceFunction = function(c) {
		            return "-" + c.toLowerCase();
		        };
		        $.extend($.Widget.prototype, {
		            _getCreateOptions: function() {
		                var option, value, elem = this.element[0], options = {};
		                if (!$.mobile.getAttribute(elem, "defaults")) {
		                    for (option in this.options) {
		                        value = $.mobile.getAttribute(elem, option.replace(rcapitals, replaceFunction));
		                        if (value != null) {
		                            options[option] = value;
		                        }
		                    }
		                }
		                return options;
		            }
		        });
		        $.mobile.widget = $.Widget;
		    })(jQuery);
		    (function($) {
		        var loaderClass = "ui-loader", $html = $("html");
		        $.widget("mobile.loader", {
		            options: {
		                theme: "a",
		                textVisible: false,
		                html: "",
		                text: "loading"
		            },
		            defaultHtml: "<div class='" + loaderClass + "'>" + "<span class='ui-icon-loading'></span>" + "<h1></h1>" + "</div>",
		            fakeFixLoader: function() {
		                var activeBtn = $("." + $.mobile.activeBtnClass).first();
		                this.element.css({
		                    top: $.support.scrollTop && this.window.scrollTop() + this.window.height() / 2 || activeBtn.length && activeBtn.offset().top || 100
		                });
		            },
		            checkLoaderPosition: function() {
		                var offset = this.element.offset(), scrollTop = this.window.scrollTop(), screenHeight = $.mobile.getScreenHeight();
		                if (offset.top < scrollTop || offset.top - scrollTop > screenHeight) {
		                    this.element.addClass("ui-loader-fakefix");
		                    this.fakeFixLoader();
		                    this.window.unbind("scroll", this.checkLoaderPosition).bind("scroll", $.proxy(this.fakeFixLoader, this));
		                }
		            },
		            resetHtml: function() {
		                this.element.html($(this.defaultHtml).html());
		            },
		            show: function(theme, msgText, textonly) {
		                var textVisible, message, loadSettings;
		                this.resetHtml();
		                if ($.type(theme) === "object") {
		                    loadSettings = $.extend({}, this.options, theme);
		                    theme = loadSettings.theme;
		                } else {
		                    loadSettings = this.options;
		                    theme = theme || loadSettings.theme;
		                }
		                message = msgText || (loadSettings.text === false ? "" : loadSettings.text);
		                $html.addClass("ui-loading");
		                textVisible = loadSettings.textVisible;
		                this.element.attr("class", loaderClass + " ui-corner-all ui-body-" + theme + " ui-loader-" + (textVisible || msgText || theme.text ? "verbose" : "default") + (loadSettings.textonly || textonly ? " ui-loader-textonly" : ""));
		                if (loadSettings.html) {
		                    this.element.html(loadSettings.html);
		                } else {
		                    this.element.find("h1").text(message);
		                }
		                this.element.appendTo($.mobile.pagecontainer ? $(":mobile-pagecontainer") : $("body"));
		                this.checkLoaderPosition();
		                this.window.bind("scroll", $.proxy(this.checkLoaderPosition, this));
		            },
		            hide: function() {
		                $html.removeClass("ui-loading");
		                if (this.options.text) {
		                    this.element.removeClass("ui-loader-fakefix");
		                }
		                this.window.unbind("scroll", this.fakeFixLoader);
		                this.window.unbind("scroll", this.checkLoaderPosition);
		            }
		        });
		    })(jQuery, this);
		    (function($, window, undefined) {
		        "$:nomunge";
		        var str_hashchange = "hashchange", doc = document, fake_onhashchange, special = $.event.special, doc_mode = doc.documentMode, supports_onhashchange = "on" + str_hashchange in window && (doc_mode === undefined || doc_mode > 7);
		        function get_fragment(url) {
		            url = url || location.href;
		            return "#" + url.replace(/^[^#]*#?(.*)$/, "$1");
		        }
		        $.fn[str_hashchange] = function(fn) {
		            return fn ? this.bind(str_hashchange, fn) : this.trigger(str_hashchange);
		        };
		        $.fn[str_hashchange].delay = 50;
		        special[str_hashchange] = $.extend(special[str_hashchange], {
		            setup: function() {
		                if (supports_onhashchange) {
		                    return false;
		                }
		                $(fake_onhashchange.start);
		            },
		            teardown: function() {
		                if (supports_onhashchange) {
		                    return false;
		                }
		                $(fake_onhashchange.stop);
		            }
		        });
		        fake_onhashchange = function() {
		            var self = {}, timeout_id, last_hash = get_fragment(), fn_retval = function(val) {
		                return val;
		            }, history_set = fn_retval, history_get = fn_retval;
		            self.start = function() {
		                timeout_id || poll();
		            };
		            self.stop = function() {
		                timeout_id && clearTimeout(timeout_id);
		                timeout_id = undefined;
		            };
		            function poll() {
		                var hash = get_fragment(), history_hash = history_get(last_hash);
		                if (hash !== last_hash) {
		                    history_set(last_hash = hash, history_hash);
		                    $(window).trigger(str_hashchange);
		                } else if (history_hash !== last_hash) {
		                    location.href = location.href.replace(/#.*/, "") + history_hash;
		                }
		                timeout_id = setTimeout(poll, $.fn[str_hashchange].delay);
		            }
		            window.attachEvent && !window.addEventListener && !supports_onhashchange && function() {
		                var iframe, iframe_src;
		                self.start = function() {
		                    if (!iframe) {
		                        iframe_src = $.fn[str_hashchange].src;
		                        iframe_src = iframe_src && iframe_src + get_fragment();
		                        iframe = $('<iframe tabindex="-1" title="empty"/>').hide().one("load", function() {
		                            iframe_src || history_set(get_fragment());
		                            poll();
		                        }).attr("src", iframe_src || "javascript:0").insertAfter("body")[0].contentWindow;
		                        doc.onpropertychange = function() {
		                            try {
		                                if (event.propertyName === "title") {
		                                    iframe.document.title = doc.title;
		                                }
		                            } catch (e) {}
		                        };
		                    }
		                };
		                self.stop = fn_retval;
		                history_get = function() {
		                    return get_fragment(iframe.location.href);
		                };
		                history_set = function(hash, history_hash) {
		                    var iframe_doc = iframe.document, domain = $.fn[str_hashchange].domain;
		                    if (hash !== history_hash) {
		                        iframe_doc.title = doc.title;
		                        iframe_doc.open();
		                        domain && iframe_doc.write('<script>document.domain="' + domain + '"</script>');
		                        iframe_doc.close();
		                        iframe.location.hash = hash;
		                    }
		                };
		            }();
		            return self;
		        }();
		    })(jQuery, this);
		    (function($, undefined) {
		        window.matchMedia = window.matchMedia || function(doc, undefined) {
		            var bool, docElem = doc.documentElement, refNode = docElem.firstElementChild || docElem.firstChild, fakeBody = doc.createElement("body"), div = doc.createElement("div");
		            div.id = "mq-test-1";
		            div.style.cssText = "position:absolute;top:-100em";
		            fakeBody.style.background = "none";
		            fakeBody.appendChild(div);
		            return function(q) {
		                div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width: 42px; }</style>';
		                docElem.insertBefore(fakeBody, refNode);
		                bool = div.offsetWidth === 42;
		                docElem.removeChild(fakeBody);
		                return {
		                    matches: bool,
		                    media: q
		                };
		            };
		        }(document);
		        $.mobile.media = function(q) {
		            return window.matchMedia(q).matches;
		        };
		    })(jQuery);
		    (function($, undefined) {
		        var support = {
		            touch: "ontouchend" in document
		        };
		        $.mobile.support = $.mobile.support || {};
		        $.extend($.support, support);
		        $.extend($.mobile.support, support);
		    })(jQuery);
		    (function($, undefined) {
		        $.extend($.support, {
		            orientation: "orientation" in window && "onorientationchange" in window
		        });
		    })(jQuery);
		    (function($, undefined) {
		        function propExists(prop) {
		            var uc_prop = prop.charAt(0).toUpperCase() + prop.substr(1), props = (prop + " " + vendors.join(uc_prop + " ") + uc_prop).split(" "), v;
		            for (v in props) {
		                if (fbCSS[props[v]] !== undefined) {
		                    return true;
		                }
		            }
		        }
		        var fakeBody = $("<body>").prependTo("html"), fbCSS = fakeBody[0].style, vendors = [ "Webkit", "Moz", "O" ], webos = "palmGetResource" in window, operamini = window.operamini && {}.toString.call(window.operamini) === "[object OperaMini]", bb = window.blackberry && !propExists("-webkit-transform"), nokiaLTE7_3;
		        function inlineSVG() {
		            var w = window, svg = !!w.document.createElementNS && !!w.document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect && !(w.opera && navigator.userAgent.indexOf("Chrome") === -1), support = function(data) {
		                if (!(data && svg)) {
		                    $("html").addClass("ui-nosvg");
		                }
		            }, img = new w.Image();
		            img.onerror = function() {
		                support(false);
		            };
		            img.onload = function() {
		                support(img.width === 1 && img.height === 1);
		            };
		            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
		        }
		        function transform3dTest() {
		            var mqProp = "transform-3d", ret = $.mobile.media("(-" + vendors.join("-" + mqProp + "),(-") + "-" + mqProp + "),(" + mqProp + ")"), el, transforms, t;
		            if (ret) {
		                return !!ret;
		            }
		            el = document.createElement("div");
		            transforms = {
		                MozTransform: "-moz-transform",
		                transform: "transform"
		            };
		            fakeBody.append(el);
		            for (t in transforms) {
		                if (el.style[t] !== undefined) {
		                    el.style[t] = "translate3d( 100px, 1px, 1px )";
		                    ret = window.getComputedStyle(el).getPropertyValue(transforms[t]);
		                }
		            }
		            return !!ret && ret !== "none";
		        }
		        function baseTagTest() {
		            var fauxBase = location.protocol + "//" + location.host + location.pathname + "ui-dir/", base = $("head base"), fauxEle = null, href = "", link, rebase;
		            if (!base.length) {
		                base = fauxEle = $("<base>", {
		                    href: fauxBase
		                }).appendTo("head");
		            } else {
		                href = base.attr("href");
		            }
		            link = $("<a href='testurl' />").prependTo(fakeBody);
		            rebase = link[0].href;
		            base[0].href = href || location.pathname;
		            if (fauxEle) {
		                fauxEle.remove();
		            }
		            return rebase.indexOf(fauxBase) === 0;
		        }
		        function cssPointerEventsTest() {
		            var element = document.createElement("x"), documentElement = document.documentElement, getComputedStyle = window.getComputedStyle, supports;
		            if (!("pointerEvents" in element.style)) {
		                return false;
		            }
		            element.style.pointerEvents = "auto";
		            element.style.pointerEvents = "x";
		            documentElement.appendChild(element);
		            supports = getComputedStyle && getComputedStyle(element, "").pointerEvents === "auto";
		            documentElement.removeChild(element);
		            return !!supports;
		        }
		        function boundingRect() {
		            var div = document.createElement("div");
		            return typeof div.getBoundingClientRect !== "undefined";
		        }
		        $.extend($.mobile, {
		            browser: {}
		        });
		        $.mobile.browser.oldIE = function() {
		            var v = 3, div = document.createElement("div"), a = div.all || [];
		            do {
		                div.innerHTML = "<!--[if gt IE " + ++v + "]><br><![endif]-->";
		            } while (a[0]);
		            return v > 4 ? v : !v;
		        }();
		        function fixedPosition() {
		            var w = window, ua = navigator.userAgent, platform = navigator.platform, wkmatch = ua.match(/AppleWebKit\/([0-9]+)/), wkversion = !!wkmatch && wkmatch[1], ffmatch = ua.match(/Fennec\/([0-9]+)/), ffversion = !!ffmatch && ffmatch[1], operammobilematch = ua.match(/Opera Mobi\/([0-9]+)/), omversion = !!operammobilematch && operammobilematch[1];
		            if ((platform.indexOf("iPhone") > -1 || platform.indexOf("iPad") > -1 || platform.indexOf("iPod") > -1) && wkversion && wkversion < 534 || w.operamini && {}.toString.call(w.operamini) === "[object OperaMini]" || operammobilematch && omversion < 7458 || ua.indexOf("Android") > -1 && wkversion && wkversion < 533 || ffversion && ffversion < 6 || "palmGetResource" in window && wkversion && wkversion < 534 || ua.indexOf("MeeGo") > -1 && ua.indexOf("NokiaBrowser/8.5.0") > -1) {
		                return false;
		            }
		            return true;
		        }
		        $.extend($.support, {
		            pushState: "pushState" in history && "replaceState" in history && !(window.navigator.userAgent.indexOf("Firefox") >= 0 && window.top !== window) && window.navigator.userAgent.search(/CriOS/) === -1,
		            mediaquery: $.mobile.media("only all"),
		            cssPseudoElement: !!propExists("content"),
		            touchOverflow: !!propExists("overflowScrolling"),
		            cssTransform3d: transform3dTest(),
		            boxShadow: !!propExists("boxShadow") && !bb,
		            fixedPosition: fixedPosition(),
		            scrollTop: ("pageXOffset" in window || "scrollTop" in document.documentElement || "scrollTop" in fakeBody[0]) && !webos && !operamini,
		            dynamicBaseTag: baseTagTest(),
		            cssPointerEvents: cssPointerEventsTest(),
		            boundingRect: boundingRect(),
		            inlineSVG: inlineSVG
		        });
		        fakeBody.remove();
		        nokiaLTE7_3 = function() {
		            var ua = window.navigator.userAgent;
		            return ua.indexOf("Nokia") > -1 && (ua.indexOf("Symbian/3") > -1 || ua.indexOf("Series60/5") > -1) && ua.indexOf("AppleWebKit") > -1 && ua.match(/(BrowserNG|NokiaBrowser)\/7\.[0-3]/);
		        }();
		        $.mobile.gradeA = function() {
		            return ($.support.mediaquery && $.support.cssPseudoElement || $.mobile.browser.oldIE && $.mobile.browser.oldIE >= 8) && ($.support.boundingRect || $.fn.jquery.match(/1\.[0-7+]\.[0-9+]?/) !== null);
		        };
		        $.mobile.ajaxBlacklist = window.blackberry && !window.WebKitPoint || operamini || nokiaLTE7_3;
		        if (nokiaLTE7_3) {
		            $(function() {
		                $("head link[rel='stylesheet']").attr("rel", "alternate stylesheet").attr("rel", "stylesheet");
		            });
		        }
		        if (!$.support.boxShadow) {
		            $("html").addClass("ui-noboxshadow");
		        }
		    })(jQuery);
		    (function($, undefined) {
		        var $win = $.mobile.window, self, dummyFnToInitNavigate = function() {};
		        $.event.special.beforenavigate = {
		            setup: function() {
		                $win.on("navigate", dummyFnToInitNavigate);
		            },
		            teardown: function() {
		                $win.off("navigate", dummyFnToInitNavigate);
		            }
		        };
		        $.event.special.navigate = self = {
		            bound: false,
		            pushStateEnabled: true,
		            originalEventName: undefined,
		            isPushStateEnabled: function() {
		                return $.support.pushState && $.mobile.pushStateEnabled === true && this.isHashChangeEnabled();
		            },
		            isHashChangeEnabled: function() {
		                return $.mobile.hashListeningEnabled === true;
		            },
		            popstate: function(event) {
		                var newEvent = new $.Event("navigate"), beforeNavigate = new $.Event("beforenavigate"), state = event.originalEvent.state || {};
		                beforeNavigate.originalEvent = event;
		                $win.trigger(beforeNavigate);
		                if (beforeNavigate.isDefaultPrevented()) {
		                    return;
		                }
		                if (event.historyState) {
		                    $.extend(state, event.historyState);
		                }
		                newEvent.originalEvent = event;
		                setTimeout(function() {
		                    $win.trigger(newEvent, {
		                        state: state
		                    });
		                }, 0);
		            },
		            hashchange: function(event) {
		                var newEvent = new $.Event("navigate"), beforeNavigate = new $.Event("beforenavigate");
		                beforeNavigate.originalEvent = event;
		                $win.trigger(beforeNavigate);
		                if (beforeNavigate.isDefaultPrevented()) {
		                    return;
		                }
		                newEvent.originalEvent = event;
		                $win.trigger(newEvent, {
		                    state: event.hashchangeState || {}
		                });
		            },
		            setup: function() {
		                if (self.bound) {
		                    return;
		                }
		                self.bound = true;
		                if (self.isPushStateEnabled()) {
		                    self.originalEventName = "popstate";
		                    $win.bind("popstate.navigate", self.popstate);
		                } else if (self.isHashChangeEnabled()) {
		                    self.originalEventName = "hashchange";
		                    $win.bind("hashchange.navigate", self.hashchange);
		                }
		            }
		        };
		    })(jQuery);
		    (function($, undefined) {
		        var path, $base, dialogHashKey = "&ui-state=dialog";
		        $.mobile.path = path = {
		            uiStateKey: "&ui-state",
		            urlParseRE: /^\s*(((([^:\/#\?]+:)?(?:(\/\/)((?:(([^:@\/#\?]+)(?:\:([^:@\/#\?]+))?)@)?(([^:\/#\?\]\[]+|\[[^\/\]@#?]+\])(?:\:([0-9]+))?))?)?)?((\/?(?:[^\/\?#]+\/+)*)([^\?#]*)))?(\?[^#]+)?)(#.*)?/,
		            getLocation: function(url) {
		                var parsedUrl = this.parseUrl(url || location.href), uri = url ? parsedUrl : location, hash = parsedUrl.hash;
		                hash = hash === "#" ? "" : hash;
		                return uri.protocol + parsedUrl.doubleSlash + uri.host + (uri.protocol !== "" && uri.pathname.substring(0, 1) !== "/" ? "/" : "") + uri.pathname + uri.search + hash;
		            },
		            getDocumentUrl: function(asParsedObject) {
		                return asParsedObject ? $.extend({}, path.documentUrl) : path.documentUrl.href;
		            },
		            parseLocation: function() {
		                return this.parseUrl(this.getLocation());
		            },
		            parseUrl: function(url) {
		                if ($.type(url) === "object") {
		                    return url;
		                }
		                var matches = path.urlParseRE.exec(url || "") || [];
		                return {
		                    href: matches[0] || "",
		                    hrefNoHash: matches[1] || "",
		                    hrefNoSearch: matches[2] || "",
		                    domain: matches[3] || "",
		                    protocol: matches[4] || "",
		                    doubleSlash: matches[5] || "",
		                    authority: matches[6] || "",
		                    username: matches[8] || "",
		                    password: matches[9] || "",
		                    host: matches[10] || "",
		                    hostname: matches[11] || "",
		                    port: matches[12] || "",
		                    pathname: matches[13] || "",
		                    directory: matches[14] || "",
		                    filename: matches[15] || "",
		                    search: matches[16] || "",
		                    hash: matches[17] || ""
		                };
		            },
		            makePathAbsolute: function(relPath, absPath) {
		                var absStack, relStack, i, d;
		                if (relPath && relPath.charAt(0) === "/") {
		                    return relPath;
		                }
		                relPath = relPath || "";
		                absPath = absPath ? absPath.replace(/^\/|(\/[^\/]*|[^\/]+)$/g, "") : "";
		                absStack = absPath ? absPath.split("/") : [];
		                relStack = relPath.split("/");
		                for (i = 0; i < relStack.length; i++) {
		                    d = relStack[i];
		                    switch (d) {
		                      case ".":
		                        break;

		                      case "..":
		                        if (absStack.length) {
		                            absStack.pop();
		                        }
		                        break;

		                      default:
		                        absStack.push(d);
		                        break;
		                    }
		                }
		                return "/" + absStack.join("/");
		            },
		            isSameDomain: function(absUrl1, absUrl2) {
		                return path.parseUrl(absUrl1).domain.toLowerCase() === path.parseUrl(absUrl2).domain.toLowerCase();
		            },
		            isRelativeUrl: function(url) {
		                return path.parseUrl(url).protocol === "";
		            },
		            isAbsoluteUrl: function(url) {
		                return path.parseUrl(url).protocol !== "";
		            },
		            makeUrlAbsolute: function(relUrl, absUrl) {
		                if (!path.isRelativeUrl(relUrl)) {
		                    return relUrl;
		                }
		                if (absUrl === undefined) {
		                    absUrl = this.documentBase;
		                }
		                var relObj = path.parseUrl(relUrl), absObj = path.parseUrl(absUrl), protocol = relObj.protocol || absObj.protocol, doubleSlash = relObj.protocol ? relObj.doubleSlash : relObj.doubleSlash || absObj.doubleSlash, authority = relObj.authority || absObj.authority, hasPath = relObj.pathname !== "", pathname = path.makePathAbsolute(relObj.pathname || absObj.filename, absObj.pathname), search = relObj.search || !hasPath && absObj.search || "", hash = relObj.hash;
		                return protocol + doubleSlash + authority + pathname + search + hash;
		            },
		            addSearchParams: function(url, params) {
		                var u = path.parseUrl(url), p = typeof params === "object" ? $.param(params) : params, s = u.search || "?";
		                return u.hrefNoSearch + s + (s.charAt(s.length - 1) !== "?" ? "&" : "") + p + (u.hash || "");
		            },
		            convertUrlToDataUrl: function(absUrl) {
		                var result = absUrl, u = path.parseUrl(absUrl);
		                if (path.isEmbeddedPage(u)) {
		                    result = u.hash.split(dialogHashKey)[0].replace(/^#/, "").replace(/\?.*$/, "");
		                } else if (path.isSameDomain(u, this.documentBase)) {
		                    result = u.hrefNoHash.replace(this.documentBase.domain, "").split(dialogHashKey)[0];
		                }
		                return window.decodeURIComponent(result);
		            },
		            get: function(newPath) {
		                if (newPath === undefined) {
		                    newPath = path.parseLocation().hash;
		                }
		                return path.stripHash(newPath).replace(/[^\/]*\.[^\/*]+$/, "");
		            },
		            set: function(path) {
		                location.hash = path;
		            },
		            isPath: function(url) {
		                return /\//.test(url);
		            },
		            clean: function(url) {
		                return url.replace(this.documentBase.domain, "");
		            },
		            stripHash: function(url) {
		                return url.replace(/^#/, "");
		            },
		            stripQueryParams: function(url) {
		                return url.replace(/\?.*$/, "");
		            },
		            cleanHash: function(hash) {
		                return path.stripHash(hash.replace(/\?.*$/, "").replace(dialogHashKey, ""));
		            },
		            isHashValid: function(hash) {
		                return /^#[^#]+$/.test(hash);
		            },
		            isExternal: function(url) {
		                var u = path.parseUrl(url);
		                return !!(u.protocol && u.domain.toLowerCase() !== this.documentUrl.domain.toLowerCase());
		            },
		            hasProtocol: function(url) {
		                return /^(:?\w+:)/.test(url);
		            },
		            isEmbeddedPage: function(url) {
		                var u = path.parseUrl(url);
		                if (u.protocol !== "") {
		                    return !this.isPath(u.hash) && u.hash && (u.hrefNoHash === this.documentUrl.hrefNoHash || this.documentBaseDiffers && u.hrefNoHash === this.documentBase.hrefNoHash);
		                }
		                return /^#/.test(u.href);
		            },
		            squash: function(url, resolutionUrl) {
		                var href, cleanedUrl, search, stateIndex, docUrl, isPath = this.isPath(url), uri = this.parseUrl(url), preservedHash = uri.hash, uiState = "";
		                if (!resolutionUrl) {
		                    if (isPath) {
		                        resolutionUrl = path.getLocation();
		                    } else {
		                        docUrl = path.getDocumentUrl(true);
		                        if (path.isPath(docUrl.hash)) {
		                            resolutionUrl = path.squash(docUrl.href);
		                        } else {
		                            resolutionUrl = docUrl.href;
		                        }
		                    }
		                }
		                cleanedUrl = isPath ? path.stripHash(url) : url;
		                cleanedUrl = path.isPath(uri.hash) ? path.stripHash(uri.hash) : cleanedUrl;
		                stateIndex = cleanedUrl.indexOf(this.uiStateKey);
		                if (stateIndex > -1) {
		                    uiState = cleanedUrl.slice(stateIndex);
		                    cleanedUrl = cleanedUrl.slice(0, stateIndex);
		                }
		                href = path.makeUrlAbsolute(cleanedUrl, resolutionUrl);
		                search = this.parseUrl(href).search;
		                if (isPath) {
		                    if (path.isPath(preservedHash) || preservedHash.replace("#", "").indexOf(this.uiStateKey) === 0) {
		                        preservedHash = "";
		                    }
		                    if (uiState && preservedHash.indexOf(this.uiStateKey) === -1) {
		                        preservedHash += uiState;
		                    }
		                    if (preservedHash.indexOf("#") === -1 && preservedHash !== "") {
		                        preservedHash = "#" + preservedHash;
		                    }
		                    href = path.parseUrl(href);
		                    href = href.protocol + href.doubleSlash + href.host + href.pathname + search + preservedHash;
		                } else {
		                    href += href.indexOf("#") > -1 ? uiState : "#" + uiState;
		                }
		                return href;
		            },
		            isPreservableHash: function(hash) {
		                return hash.replace("#", "").indexOf(this.uiStateKey) === 0;
		            },
		            hashToSelector: function(hash) {
		                var hasHash = hash.substring(0, 1) === "#";
		                if (hasHash) {
		                    hash = hash.substring(1);
		                }
		                return (hasHash ? "#" : "") + hash.replace(/([!"#$%&'()*+,.\/:;<=>?@[\]^`{|}~])/g, "\\$1");
		            },
		            getFilePath: function(path) {
		                return path && path.split(dialogHashKey)[0];
		            },
		            isFirstPageUrl: function(url) {
		                var u = path.parseUrl(path.makeUrlAbsolute(url, this.documentBase)), samePath = u.hrefNoHash === this.documentUrl.hrefNoHash || this.documentBaseDiffers && u.hrefNoHash === this.documentBase.hrefNoHash, fp = $.mobile.firstPage, fpId = fp && fp[0] ? fp[0].id : undefined;
		                return samePath && (!u.hash || u.hash === "#" || fpId && u.hash.replace(/^#/, "") === fpId);
		            },
		            isPermittedCrossDomainRequest: function(docUrl, reqUrl) {
		                return $.mobile.allowCrossDomainPages && (docUrl.protocol === "file:" || docUrl.protocol === "content:") && reqUrl.search(/^https?:/) !== -1;
		            }
		        };
		        path.documentUrl = path.parseLocation();
		        $base = $("head").find("base");
		        path.documentBase = $base.length ? path.parseUrl(path.makeUrlAbsolute($base.attr("href"), path.documentUrl.href)) : path.documentUrl;
		        path.documentBaseDiffers = path.documentUrl.hrefNoHash !== path.documentBase.hrefNoHash;
		        path.getDocumentBase = function(asParsedObject) {
		            return asParsedObject ? $.extend({}, path.documentBase) : path.documentBase.href;
		        };
		        $.extend($.mobile, {
		            getDocumentUrl: path.getDocumentUrl,
		            getDocumentBase: path.getDocumentBase
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.mobile.History = function(stack, index) {
		            this.stack = stack || [];
		            this.activeIndex = index || 0;
		        };
		        $.extend($.mobile.History.prototype, {
		            getActive: function() {
		                return this.stack[this.activeIndex];
		            },
		            getLast: function() {
		                return this.stack[this.previousIndex];
		            },
		            getNext: function() {
		                return this.stack[this.activeIndex + 1];
		            },
		            getPrev: function() {
		                return this.stack[this.activeIndex - 1];
		            },
		            add: function(url, data) {
		                data = data || {};
		                if (this.getNext()) {
		                    this.clearForward();
		                }
		                if (data.hash && data.hash.indexOf("#") === -1) {
		                    data.hash = "#" + data.hash;
		                }
		                data.url = url;
		                this.stack.push(data);
		                this.activeIndex = this.stack.length - 1;
		            },
		            clearForward: function() {
		                this.stack = this.stack.slice(0, this.activeIndex + 1);
		            },
		            find: function(url, stack, earlyReturn) {
		                stack = stack || this.stack;
		                var entry, i, length = stack.length, index;
		                for (i = 0; i < length; i++) {
		                    entry = stack[i];
		                    if (decodeURIComponent(url) === decodeURIComponent(entry.url) || decodeURIComponent(url) === decodeURIComponent(entry.hash)) {
		                        index = i;
		                        if (earlyReturn) {
		                            return index;
		                        }
		                    }
		                }
		                return index;
		            },
		            closest: function(url) {
		                var closest, a = this.activeIndex;
		                closest = this.find(url, this.stack.slice(0, a));
		                if (closest === undefined) {
		                    closest = this.find(url, this.stack.slice(a), true);
		                    closest = closest === undefined ? closest : closest + a;
		                }
		                return closest;
		            },
		            direct: function(opts) {
		                var newActiveIndex = this.closest(opts.url), a = this.activeIndex;
		                if (newActiveIndex !== undefined) {
		                    this.activeIndex = newActiveIndex;
		                    this.previousIndex = a;
		                }
		                if (newActiveIndex < a) {
		                    (opts.present || opts.back || $.noop)(this.getActive(), "back");
		                } else if (newActiveIndex > a) {
		                    (opts.present || opts.forward || $.noop)(this.getActive(), "forward");
		                } else if (newActiveIndex === undefined && opts.missing) {
		                    opts.missing(this.getActive());
		                }
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        var path = $.mobile.path, initialHref = location.href;
		        $.mobile.Navigator = function(history) {
		            this.history = history;
		            this.ignoreInitialHashChange = true;
		            $.mobile.window.bind({
		                "popstate.history": $.proxy(this.popstate, this),
		                "hashchange.history": $.proxy(this.hashchange, this)
		            });
		        };
		        $.extend($.mobile.Navigator.prototype, {
		            squash: function(url, data) {
		                var state, href, hash = path.isPath(url) ? path.stripHash(url) : url;
		                href = path.squash(url);
		                state = $.extend({
		                    hash: hash,
		                    url: href
		                }, data);
		                window.history.replaceState(state, state.title || document.title, href);
		                return state;
		            },
		            hash: function(url, href) {
		                var parsed, loc, hash, resolved;
		                parsed = path.parseUrl(url);
		                loc = path.parseLocation();
		                if (loc.pathname + loc.search === parsed.pathname + parsed.search) {
		                    hash = parsed.hash ? parsed.hash : parsed.pathname + parsed.search;
		                } else if (path.isPath(url)) {
		                    resolved = path.parseUrl(href);
		                    hash = resolved.pathname + resolved.search + (path.isPreservableHash(resolved.hash) ? resolved.hash.replace("#", "") : "");
		                } else {
		                    hash = url;
		                }
		                return hash;
		            },
		            go: function(url, data, noEvents) {
		                var state, href, hash, popstateEvent, isPopStateEvent = $.event.special.navigate.isPushStateEnabled();
		                href = path.squash(url);
		                hash = this.hash(url, href);
		                if (noEvents && hash !== path.stripHash(path.parseLocation().hash)) {
		                    this.preventNextHashChange = noEvents;
		                }
		                this.preventHashAssignPopState = true;
		                window.location.hash = hash;
		                this.preventHashAssignPopState = false;
		                state = $.extend({
		                    url: href,
		                    hash: hash,
		                    title: document.title
		                }, data);
		                if (isPopStateEvent) {
		                    popstateEvent = new $.Event("popstate");
		                    popstateEvent.originalEvent = {
		                        type: "popstate",
		                        state: null
		                    };
		                    this.squash(url, state);
		                    if (!noEvents) {
		                        this.ignorePopState = true;
		                        $.mobile.window.trigger(popstateEvent);
		                    }
		                }
		                this.history.add(state.url, state);
		            },
		            popstate: function(event) {
		                var hash, state;
		                if (!$.event.special.navigate.isPushStateEnabled()) {
		                    return;
		                }
		                if (this.preventHashAssignPopState) {
		                    this.preventHashAssignPopState = false;
		                    event.stopImmediatePropagation();
		                    return;
		                }
		                if (this.ignorePopState) {
		                    this.ignorePopState = false;
		                    return;
		                }
		                if (!event.originalEvent.state && this.history.stack.length === 1 && this.ignoreInitialHashChange) {
		                    this.ignoreInitialHashChange = false;
		                    if (location.href === initialHref) {
		                        event.preventDefault();
		                        return;
		                    }
		                }
		                hash = path.parseLocation().hash;
		                if (!event.originalEvent.state && hash) {
		                    state = this.squash(hash);
		                    this.history.add(state.url, state);
		                    event.historyState = state;
		                    return;
		                }
		                this.history.direct({
		                    url: (event.originalEvent.state || {}).url || hash,
		                    present: function(historyEntry, direction) {
		                        event.historyState = $.extend({}, historyEntry);
		                        event.historyState.direction = direction;
		                    }
		                });
		            },
		            hashchange: function(event) {
		                var history, hash;
		                if (!$.event.special.navigate.isHashChangeEnabled() || $.event.special.navigate.isPushStateEnabled()) {
		                    return;
		                }
		                if (this.preventNextHashChange) {
		                    this.preventNextHashChange = false;
		                    event.stopImmediatePropagation();
		                    return;
		                }
		                history = this.history;
		                hash = path.parseLocation().hash;
		                this.history.direct({
		                    url: hash,
		                    present: function(historyEntry, direction) {
		                        event.hashchangeState = $.extend({}, historyEntry);
		                        event.hashchangeState.direction = direction;
		                    },
		                    missing: function() {
		                        history.add(hash, {
		                            hash: hash,
		                            title: document.title
		                        });
		                    }
		                });
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.mobile.navigate = function(url, data, noEvents) {
		            $.mobile.navigate.navigator.go(url, data, noEvents);
		        };
		        $.mobile.navigate.history = new $.mobile.History();
		        $.mobile.navigate.navigator = new $.mobile.Navigator($.mobile.navigate.history);
		        var loc = $.mobile.path.parseLocation();
		        $.mobile.navigate.history.add(loc.href, {
		            hash: loc.hash
		        });
		    })(jQuery);
		    (function($, undefined) {
		        var props = {
		            animation: {},
		            transition: {}
		        }, testElement = document.createElement("a"), vendorPrefixes = [ "", "webkit-", "moz-", "o-" ];
		        $.each([ "animation", "transition" ], function(i, test) {
		            var testName = i === 0 ? test + "-" + "name" : test;
		            $.each(vendorPrefixes, function(j, prefix) {
		                if (testElement.style[$.camelCase(prefix + testName)] !== undefined) {
		                    props[test]["prefix"] = prefix;
		                    return false;
		                }
		            });
		            props[test]["duration"] = $.camelCase(props[test]["prefix"] + test + "-" + "duration");
		            props[test]["event"] = $.camelCase(props[test]["prefix"] + test + "-" + "end");
		            if (props[test]["prefix"] === "") {
		                props[test]["event"] = props[test]["event"].toLowerCase();
		            }
		        });
		        $.support.cssTransitions = props["transition"]["prefix"] !== undefined;
		        $.support.cssAnimations = props["animation"]["prefix"] !== undefined;
		        $(testElement).remove();
		        $.fn.animationComplete = function(callback, type, fallbackTime) {
		            var timer, duration, that = this, eventBinding = function() {
		                clearTimeout(timer);
		                callback.apply(this, arguments);
		            }, animationType = !type || type === "animation" ? "animation" : "transition";
		            if ($.support.cssTransitions && animationType === "transition" || $.support.cssAnimations && animationType === "animation") {
		                if (fallbackTime === undefined) {
		                    if ($(this).context !== document) {
		                        duration = parseFloat($(this).css(props[animationType].duration)) * 3e3;
		                    }
		                    if (duration === 0 || duration === undefined || isNaN(duration)) {
		                        duration = $.fn.animationComplete.defaultDuration;
		                    }
		                }
		                timer = setTimeout(function() {
		                    $(that).off(props[animationType].event, eventBinding);
		                    callback.apply(that);
		                }, duration);
		                return $(this).one(props[animationType].event, eventBinding);
		            } else {
		                setTimeout($.proxy(callback, this), 0);
		                return $(this);
		            }
		        };
		        $.fn.animationComplete.defaultDuration = 1e3;
		    })(jQuery);
		    (function($, window, document, undefined) {
		        var dataPropertyName = "virtualMouseBindings", touchTargetPropertyName = "virtualTouchID", virtualEventNames = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "), touchEventProps = "clientX clientY pageX pageY screenX screenY".split(" "), mouseHookProps = $.event.mouseHooks ? $.event.mouseHooks.props : [], mouseEventProps = $.event.props.concat(mouseHookProps), activeDocHandlers = {}, resetTimerID = 0, startX = 0, startY = 0, didScroll = false, clickBlockList = [], blockMouseTriggers = false, blockTouchTriggers = false, eventCaptureSupported = "addEventListener" in document, $document = $(document), nextTouchID = 1, lastTouchID = 0, threshold, i;
		        $.vmouse = {
		            moveDistanceThreshold: 10,
		            clickDistanceThreshold: 10,
		            resetTimerDuration: 1500
		        };
		        function getNativeEvent(event) {
		            while (event && typeof event.originalEvent !== "undefined") {
		                event = event.originalEvent;
		            }
		            return event;
		        }
		        function createVirtualEvent(event, eventType) {
		            var t = event.type, oe, props, ne, prop, ct, touch, i, j, len;
		            event = $.Event(event);
		            event.type = eventType;
		            oe = event.originalEvent;
		            props = $.event.props;
		            if (t.search(/^(mouse|click)/) > -1) {
		                props = mouseEventProps;
		            }
		            if (oe) {
		                for (i = props.length, prop; i; ) {
		                    prop = props[--i];
		                    event[prop] = oe[prop];
		                }
		            }
		            if (t.search(/mouse(down|up)|click/) > -1 && !event.which) {
		                event.which = 1;
		            }
		            if (t.search(/^touch/) !== -1) {
		                ne = getNativeEvent(oe);
		                t = ne.touches;
		                ct = ne.changedTouches;
		                touch = t && t.length ? t[0] : ct && ct.length ? ct[0] : undefined;
		                if (touch) {
		                    for (j = 0, len = touchEventProps.length; j < len; j++) {
		                        prop = touchEventProps[j];
		                        event[prop] = touch[prop];
		                    }
		                }
		            }
		            return event;
		        }
		        function getVirtualBindingFlags(element) {
		            var flags = {}, b, k;
		            while (element) {
		                b = $.data(element, dataPropertyName);
		                for (k in b) {
		                    if (b[k]) {
		                        flags[k] = flags.hasVirtualBinding = true;
		                    }
		                }
		                element = element.parentNode;
		            }
		            return flags;
		        }
		        function getClosestElementWithVirtualBinding(element, eventType) {
		            var b;
		            while (element) {
		                b = $.data(element, dataPropertyName);
		                if (b && (!eventType || b[eventType])) {
		                    return element;
		                }
		                element = element.parentNode;
		            }
		            return null;
		        }
		        function enableTouchBindings() {
		            blockTouchTriggers = false;
		        }
		        function disableTouchBindings() {
		            blockTouchTriggers = true;
		        }
		        function enableMouseBindings() {
		            lastTouchID = 0;
		            clickBlockList.length = 0;
		            blockMouseTriggers = false;
		            disableTouchBindings();
		        }
		        function disableMouseBindings() {
		            enableTouchBindings();
		        }
		        function startResetTimer() {
		            clearResetTimer();
		            resetTimerID = setTimeout(function() {
		                resetTimerID = 0;
		                enableMouseBindings();
		            }, $.vmouse.resetTimerDuration);
		        }
		        function clearResetTimer() {
		            if (resetTimerID) {
		                clearTimeout(resetTimerID);
		                resetTimerID = 0;
		            }
		        }
		        function triggerVirtualEvent(eventType, event, flags) {
		            var ve;
		            if (flags && flags[eventType] || !flags && getClosestElementWithVirtualBinding(event.target, eventType)) {
		                ve = createVirtualEvent(event, eventType);
		                $(event.target).trigger(ve);
		            }
		            return ve;
		        }
		        function mouseEventCallback(event) {
		            var touchID = $.data(event.target, touchTargetPropertyName), ve;
		            if (!blockMouseTriggers && (!lastTouchID || lastTouchID !== touchID)) {
		                ve = triggerVirtualEvent("v" + event.type, event);
		                if (ve) {
		                    if (ve.isDefaultPrevented()) {
		                        event.preventDefault();
		                    }
		                    if (ve.isPropagationStopped()) {
		                        event.stopPropagation();
		                    }
		                    if (ve.isImmediatePropagationStopped()) {
		                        event.stopImmediatePropagation();
		                    }
		                }
		            }
		        }
		        function handleTouchStart(event) {
		            var touches = getNativeEvent(event).touches, target, flags, t;
		            if (touches && touches.length === 1) {
		                target = event.target;
		                flags = getVirtualBindingFlags(target);
		                if (flags.hasVirtualBinding) {
		                    lastTouchID = nextTouchID++;
		                    $.data(target, touchTargetPropertyName, lastTouchID);
		                    clearResetTimer();
		                    disableMouseBindings();
		                    didScroll = false;
		                    t = getNativeEvent(event).touches[0];
		                    startX = t.pageX;
		                    startY = t.pageY;
		                    triggerVirtualEvent("vmouseover", event, flags);
		                    triggerVirtualEvent("vmousedown", event, flags);
		                }
		            }
		        }
		        function handleScroll(event) {
		            if (blockTouchTriggers) {
		                return;
		            }
		            if (!didScroll) {
		                triggerVirtualEvent("vmousecancel", event, getVirtualBindingFlags(event.target));
		            }
		            didScroll = true;
		            startResetTimer();
		        }
		        function handleTouchMove(event) {
		            if (blockTouchTriggers) {
		                return;
		            }
		            var t = getNativeEvent(event).touches[0], didCancel = didScroll, moveThreshold = $.vmouse.moveDistanceThreshold, flags = getVirtualBindingFlags(event.target);
		            didScroll = didScroll || (Math.abs(t.pageX - startX) > moveThreshold || Math.abs(t.pageY - startY) > moveThreshold);
		            if (didScroll && !didCancel) {
		                triggerVirtualEvent("vmousecancel", event, flags);
		            }
		            triggerVirtualEvent("vmousemove", event, flags);
		            startResetTimer();
		        }
		        function handleTouchEnd(event) {
		            if (blockTouchTriggers) {
		                return;
		            }
		            disableTouchBindings();
		            var flags = getVirtualBindingFlags(event.target), ve, t;
		            triggerVirtualEvent("vmouseup", event, flags);
		            if (!didScroll) {
		                ve = triggerVirtualEvent("vclick", event, flags);
		                if (ve && ve.isDefaultPrevented()) {
		                    t = getNativeEvent(event).changedTouches[0];
		                    clickBlockList.push({
		                        touchID: lastTouchID,
		                        x: t.clientX,
		                        y: t.clientY
		                    });
		                    blockMouseTriggers = true;
		                }
		            }
		            triggerVirtualEvent("vmouseout", event, flags);
		            didScroll = false;
		            startResetTimer();
		        }
		        function hasVirtualBindings(ele) {
		            var bindings = $.data(ele, dataPropertyName), k;
		            if (bindings) {
		                for (k in bindings) {
		                    if (bindings[k]) {
		                        return true;
		                    }
		                }
		            }
		            return false;
		        }
		        function dummyMouseHandler() {}
		        function getSpecialEventObject(eventType) {
		            var realType = eventType.substr(1);
		            return {
		                setup: function() {
		                    if (!hasVirtualBindings(this)) {
		                        $.data(this, dataPropertyName, {});
		                    }
		                    var bindings = $.data(this, dataPropertyName);
		                    bindings[eventType] = true;
		                    activeDocHandlers[eventType] = (activeDocHandlers[eventType] || 0) + 1;
		                    if (activeDocHandlers[eventType] === 1) {
		                        $document.bind(realType, mouseEventCallback);
		                    }
		                    $(this).bind(realType, dummyMouseHandler);
		                    if (eventCaptureSupported) {
		                        activeDocHandlers["touchstart"] = (activeDocHandlers["touchstart"] || 0) + 1;
		                        if (activeDocHandlers["touchstart"] === 1) {
		                            $document.bind("touchstart", handleTouchStart).bind("touchend", handleTouchEnd).bind("touchmove", handleTouchMove).bind("scroll", handleScroll);
		                        }
		                    }
		                },
		                teardown: function() {
		                    --activeDocHandlers[eventType];
		                    if (!activeDocHandlers[eventType]) {
		                        $document.unbind(realType, mouseEventCallback);
		                    }
		                    if (eventCaptureSupported) {
		                        --activeDocHandlers["touchstart"];
		                        if (!activeDocHandlers["touchstart"]) {
		                            $document.unbind("touchstart", handleTouchStart).unbind("touchmove", handleTouchMove).unbind("touchend", handleTouchEnd).unbind("scroll", handleScroll);
		                        }
		                    }
		                    var $this = $(this), bindings = $.data(this, dataPropertyName);
		                    if (bindings) {
		                        bindings[eventType] = false;
		                    }
		                    $this.unbind(realType, dummyMouseHandler);
		                    if (!hasVirtualBindings(this)) {
		                        $this.removeData(dataPropertyName);
		                    }
		                }
		            };
		        }
		        for (i = 0; i < virtualEventNames.length; i++) {
		            $.event.special[virtualEventNames[i]] = getSpecialEventObject(virtualEventNames[i]);
		        }
		        if (eventCaptureSupported) {
		            document.addEventListener("click", function(e) {
		                var cnt = clickBlockList.length, target = e.target, x, y, ele, i, o, touchID;
		                if (cnt) {
		                    x = e.clientX;
		                    y = e.clientY;
		                    threshold = $.vmouse.clickDistanceThreshold;
		                    ele = target;
		                    while (ele) {
		                        for (i = 0; i < cnt; i++) {
		                            o = clickBlockList[i];
		                            touchID = 0;
		                            if (ele === target && Math.abs(o.x - x) < threshold && Math.abs(o.y - y) < threshold || $.data(ele, touchTargetPropertyName) === o.touchID) {
		                                e.preventDefault();
		                                e.stopPropagation();
		                                return;
		                            }
		                        }
		                        ele = ele.parentNode;
		                    }
		                }
		            }, true);
		        }
		    })(jQuery, window, document);
		    (function($, window, undefined) {
		        var $document = $(document), supportTouch = $.mobile.support.touch, scrollEvent = "touchmove scroll", touchStartEvent = supportTouch ? "touchstart" : "mousedown", touchStopEvent = supportTouch ? "touchend" : "mouseup", touchMoveEvent = supportTouch ? "touchmove" : "mousemove";
		        $.each(("touchstart touchmove touchend " + "tap taphold " + "swipe swipeleft swiperight " + "scrollstart scrollstop").split(" "), function(i, name) {
		            $.fn[name] = function(fn) {
		                return fn ? this.bind(name, fn) : this.trigger(name);
		            };
		            if ($.attrFn) {
		                $.attrFn[name] = true;
		            }
		        });
		        function triggerCustomEvent(obj, eventType, event, bubble) {
		            var originalType = event.type;
		            event.type = eventType;
		            if (bubble) {
		                $.event.trigger(event, undefined, obj);
		            } else {
		                $.event.dispatch.call(obj, event);
		            }
		            event.type = originalType;
		        }
		        $.event.special.scrollstart = {
		            enabled: true,
		            setup: function() {
		                var thisObject = this, $this = $(thisObject), scrolling, timer;
		                function trigger(event, state) {
		                    scrolling = state;
		                    triggerCustomEvent(thisObject, scrolling ? "scrollstart" : "scrollstop", event);
		                }
		                $this.bind(scrollEvent, function(event) {
		                    if (!$.event.special.scrollstart.enabled) {
		                        return;
		                    }
		                    if (!scrolling) {
		                        trigger(event, true);
		                    }
		                    clearTimeout(timer);
		                    timer = setTimeout(function() {
		                        trigger(event, false);
		                    }, 50);
		                });
		            },
		            teardown: function() {
		                $(this).unbind(scrollEvent);
		            }
		        };
		        $.event.special.tap = {
		            tapholdThreshold: 750,
		            emitTapOnTaphold: true,
		            setup: function() {
		                var thisObject = this, $this = $(thisObject), isTaphold = false;
		                $this.bind("vmousedown", function(event) {
		                    isTaphold = false;
		                    if (event.which && event.which !== 1) {
		                        return false;
		                    }
		                    var origTarget = event.target, timer;
		                    function clearTapTimer() {
		                        clearTimeout(timer);
		                    }
		                    function clearTapHandlers() {
		                        clearTapTimer();
		                        $this.unbind("vclick", clickHandler).unbind("vmouseup", clearTapTimer);
		                        $document.unbind("vmousecancel", clearTapHandlers);
		                    }
		                    function clickHandler(event) {
		                        clearTapHandlers();
		                        if (!isTaphold && origTarget === event.target) {
		                            triggerCustomEvent(thisObject, "tap", event);
		                        } else if (isTaphold) {
		                            event.preventDefault();
		                        }
		                    }
		                    $this.bind("vmouseup", clearTapTimer).bind("vclick", clickHandler);
		                    $document.bind("vmousecancel", clearTapHandlers);
		                    timer = setTimeout(function() {
		                        if (!$.event.special.tap.emitTapOnTaphold) {
		                            isTaphold = true;
		                        }
		                        triggerCustomEvent(thisObject, "taphold", $.Event("taphold", {
		                            target: origTarget
		                        }));
		                    }, $.event.special.tap.tapholdThreshold);
		                });
		            },
		            teardown: function() {
		                $(this).unbind("vmousedown").unbind("vclick").unbind("vmouseup");
		                $document.unbind("vmousecancel");
		            }
		        };
		        $.event.special.swipe = {
		            scrollSupressionThreshold: 30,
		            durationThreshold: 1e3,
		            horizontalDistanceThreshold: 30,
		            verticalDistanceThreshold: 30,
		            getLocation: function(event) {
		                var winPageX = window.pageXOffset, winPageY = window.pageYOffset, x = event.clientX, y = event.clientY;
		                if (event.pageY === 0 && Math.floor(y) > Math.floor(event.pageY) || event.pageX === 0 && Math.floor(x) > Math.floor(event.pageX)) {
		                    x = x - winPageX;
		                    y = y - winPageY;
		                } else if (y < event.pageY - winPageY || x < event.pageX - winPageX) {
		                    x = event.pageX - winPageX;
		                    y = event.pageY - winPageY;
		                }
		                return {
		                    x: x,
		                    y: y
		                };
		            },
		            start: function(event) {
		                var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event, location = $.event.special.swipe.getLocation(data);
		                return {
		                    time: new Date().getTime(),
		                    coords: [ location.x, location.y ],
		                    origin: $(event.target)
		                };
		            },
		            stop: function(event) {
		                var data = event.originalEvent.touches ? event.originalEvent.touches[0] : event, location = $.event.special.swipe.getLocation(data);
		                return {
		                    time: new Date().getTime(),
		                    coords: [ location.x, location.y ]
		                };
		            },
		            handleSwipe: function(start, stop, thisObject, origTarget) {
		                if (stop.time - start.time < $.event.special.swipe.durationThreshold && Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.horizontalDistanceThreshold && Math.abs(start.coords[1] - stop.coords[1]) < $.event.special.swipe.verticalDistanceThreshold) {
		                    var direction = start.coords[0] > stop.coords[0] ? "swipeleft" : "swiperight";
		                    triggerCustomEvent(thisObject, "swipe", $.Event("swipe", {
		                        target: origTarget,
		                        swipestart: start,
		                        swipestop: stop
		                    }), true);
		                    triggerCustomEvent(thisObject, direction, $.Event(direction, {
		                        target: origTarget,
		                        swipestart: start,
		                        swipestop: stop
		                    }), true);
		                    return true;
		                }
		                return false;
		            },
		            eventInProgress: false,
		            setup: function() {
		                var events, thisObject = this, $this = $(thisObject), context = {};
		                events = $.data(this, "mobile-events");
		                if (!events) {
		                    events = {
		                        length: 0
		                    };
		                    $.data(this, "mobile-events", events);
		                }
		                events.length++;
		                events.swipe = context;
		                context.start = function(event) {
		                    if ($.event.special.swipe.eventInProgress) {
		                        return;
		                    }
		                    $.event.special.swipe.eventInProgress = true;
		                    var stop, start = $.event.special.swipe.start(event), origTarget = event.target, emitted = false;
		                    context.move = function(event) {
		                        if (!start || event.isDefaultPrevented()) {
		                            return;
		                        }
		                        stop = $.event.special.swipe.stop(event);
		                        if (!emitted) {
		                            emitted = $.event.special.swipe.handleSwipe(start, stop, thisObject, origTarget);
		                            if (emitted) {
		                                $.event.special.swipe.eventInProgress = false;
		                            }
		                        }
		                        if (Math.abs(start.coords[0] - stop.coords[0]) > $.event.special.swipe.scrollSupressionThreshold) {
		                            event.preventDefault();
		                        }
		                    };
		                    context.stop = function() {
		                        emitted = true;
		                        $.event.special.swipe.eventInProgress = false;
		                        $document.off(touchMoveEvent, context.move);
		                        context.move = null;
		                    };
		                    $document.on(touchMoveEvent, context.move).one(touchStopEvent, context.stop);
		                };
		                $this.on(touchStartEvent, context.start);
		            },
		            teardown: function() {
		                var events, context;
		                events = $.data(this, "mobile-events");
		                if (events) {
		                    context = events.swipe;
		                    delete events.swipe;
		                    events.length--;
		                    if (events.length === 0) {
		                        $.removeData(this, "mobile-events");
		                    }
		                }
		                if (context) {
		                    if (context.start) {
		                        $(this).off(touchStartEvent, context.start);
		                    }
		                    if (context.move) {
		                        $document.off(touchMoveEvent, context.move);
		                    }
		                    if (context.stop) {
		                        $document.off(touchStopEvent, context.stop);
		                    }
		                }
		            }
		        };
		        $.each({
		            scrollstop: "scrollstart",
		            taphold: "tap",
		            swipeleft: "swipe.left",
		            swiperight: "swipe.right"
		        }, function(event, sourceEvent) {
		            $.event.special[event] = {
		                setup: function() {
		                    $(this).bind(sourceEvent, $.noop);
		                },
		                teardown: function() {
		                    $(this).unbind(sourceEvent);
		                }
		            };
		        });
		    })(jQuery, this);
		    (function($) {
		        $.event.special.throttledresize = {
		            setup: function() {
		                $(this).bind("resize", handler);
		            },
		            teardown: function() {
		                $(this).unbind("resize", handler);
		            }
		        };
		        var throttle = 250, handler = function() {
		            curr = new Date().getTime();
		            diff = curr - lastCall;
		            if (diff >= throttle) {
		                lastCall = curr;
		                $(this).trigger("throttledresize");
		            } else {
		                if (heldCall) {
		                    clearTimeout(heldCall);
		                }
		                heldCall = setTimeout(handler, throttle - diff);
		            }
		        }, lastCall = 0, heldCall, curr, diff;
		    })(jQuery);
		    (function($, window) {
		        var win = $(window), event_name = "orientationchange", get_orientation, last_orientation, initial_orientation_is_landscape, initial_orientation_is_default, portrait_map = {
		            "0": true,
		            "180": true
		        }, ww, wh, landscape_threshold;
		        if ($.support.orientation) {
		            ww = window.innerWidth || win.width();
		            wh = window.innerHeight || win.height();
		            landscape_threshold = 50;
		            initial_orientation_is_landscape = ww > wh && ww - wh > landscape_threshold;
		            initial_orientation_is_default = portrait_map[window.orientation];
		            if (initial_orientation_is_landscape && initial_orientation_is_default || !initial_orientation_is_landscape && !initial_orientation_is_default) {
		                portrait_map = {
		                    "-90": true,
		                    "90": true
		                };
		            }
		        }
		        $.event.special.orientationchange = $.extend({}, $.event.special.orientationchange, {
		            setup: function() {
		                if ($.support.orientation && !$.event.special.orientationchange.disabled) {
		                    return false;
		                }
		                last_orientation = get_orientation();
		                win.bind("throttledresize", handler);
		            },
		            teardown: function() {
		                if ($.support.orientation && !$.event.special.orientationchange.disabled) {
		                    return false;
		                }
		                win.unbind("throttledresize", handler);
		            },
		            add: function(handleObj) {
		                var old_handler = handleObj.handler;
		                handleObj.handler = function(event) {
		                    event.orientation = get_orientation();
		                    return old_handler.apply(this, arguments);
		                };
		            }
		        });
		        function handler() {
		            var orientation = get_orientation();
		            if (orientation !== last_orientation) {
		                last_orientation = orientation;
		                win.trigger(event_name);
		            }
		        }
		        $.event.special.orientationchange.orientation = get_orientation = function() {
		            var isPortrait = true, elem = document.documentElement;
		            if ($.support.orientation) {
		                isPortrait = portrait_map[window.orientation];
		            } else {
		                isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
		            }
		            return isPortrait ? "portrait" : "landscape";
		        };
		        $.fn[event_name] = function(fn) {
		            return fn ? this.bind(event_name, fn) : this.trigger(event_name);
		        };
		        if ($.attrFn) {
		            $.attrFn[event_name] = true;
		        }
		    })(jQuery, this);
		    (function($, undefined) {
		        var baseElement = $("head").children("base"), base = {
		            element: baseElement.length ? baseElement : $("<base>", {
		                href: $.mobile.path.documentBase.hrefNoHash
		            }).prependTo($("head")),
		            linkSelector: "[src], link[href], a[rel='external'], :jqmData(ajax='false'), a[target]",
		            set: function(href) {
		                if (!$.mobile.dynamicBaseEnabled) {
		                    return;
		                }
		                if ($.support.dynamicBaseTag) {
		                    base.element.attr("href", $.mobile.path.makeUrlAbsolute(href, $.mobile.path.documentBase));
		                }
		            },
		            rewrite: function(href, page) {
		                var newPath = $.mobile.path.get(href);
		                page.find(base.linkSelector).each(function(i, link) {
		                    var thisAttr = $(link).is("[href]") ? "href" : $(link).is("[src]") ? "src" : "action", theLocation = $.mobile.path.parseLocation(), thisUrl = $(link).attr(thisAttr);
		                    thisUrl = thisUrl.replace(theLocation.protocol + theLocation.doubleSlash + theLocation.host + theLocation.pathname, "");
		                    if (!/^(\w+:|#|\/)/.test(thisUrl)) {
		                        $(link).attr(thisAttr, newPath + thisUrl);
		                    }
		                });
		            },
		            reset: function() {
		                base.element.attr("href", $.mobile.path.documentBase.hrefNoSearch);
		            }
		        };
		        $.mobile.base = base;
		    })(jQuery);
		    (function($, undefined) {
		        $.mobile.widgets = {};
		        var originalWidget = $.widget, keepNativeFactoryDefault = $.mobile.keepNative;
		        $.widget = function(orig) {
		            return function() {
		                var constructor = orig.apply(this, arguments), name = constructor.prototype.widgetName;
		                constructor.initSelector = constructor.prototype.initSelector !== undefined ? constructor.prototype.initSelector : ":jqmData(role='" + name + "')";
		                $.mobile.widgets[name] = constructor;
		                return constructor;
		            };
		        }($.widget);
		        $.extend($.widget, originalWidget);
		        $.mobile.document.on("create", function(event) {
		            $(event.target).enhanceWithin();
		        });
		        $.widget("mobile.page", {
		            options: {
		                theme: "a",
		                domCache: false,
		                keepNativeDefault: $.mobile.keepNative,
		                contentTheme: null,
		                enhanced: false
		            },
		            _createWidget: function() {
		                $.Widget.prototype._createWidget.apply(this, arguments);
		                this._trigger("init");
		            },
		            _create: function() {
		                if (this._trigger("beforecreate") === false) {
		                    return false;
		                }
		                if (!this.options.enhanced) {
		                    this._enhance();
		                }
		                this._on(this.element, {
		                    pagebeforehide: "removeContainerBackground",
		                    pagebeforeshow: "_handlePageBeforeShow"
		                });
		                this.element.enhanceWithin();
		                if ($.mobile.getAttribute(this.element[0], "role") === "dialog" && $.mobile.dialog) {
		                    this.element.dialog();
		                }
		            },
		            _enhance: function() {
		                var attrPrefix = "data-" + $.mobile.ns, self = this;
		                if (this.options.role) {
		                    this.element.attr("data-" + $.mobile.ns + "role", this.options.role);
		                }
		                this.element.attr("tabindex", "0").addClass("ui-page ui-page-theme-" + this.options.theme);
		                this.element.find("[" + attrPrefix + "role='content']").each(function() {
		                    var $this = $(this), theme = this.getAttribute(attrPrefix + "theme") || undefined;
		                    self.options.contentTheme = theme || self.options.contentTheme || self.options.dialog && self.options.theme || self.element.jqmData("role") === "dialog" && self.options.theme;
		                    $this.addClass("ui-content");
		                    if (self.options.contentTheme) {
		                        $this.addClass("ui-body-" + self.options.contentTheme);
		                    }
		                    $this.attr("role", "main").addClass("ui-content");
		                });
		            },
		            bindRemove: function(callback) {
		                var page = this.element;
		                if (!page.data("mobile-page").options.domCache && page.is(":jqmData(external-page='true')")) {
		                    page.bind("pagehide.remove", callback || function(e, data) {
		                        if (!data.samePage) {
		                            var $this = $(this), prEvent = new $.Event("pageremove");
		                            $this.trigger(prEvent);
		                            if (!prEvent.isDefaultPrevented()) {
		                                $this.removeWithDependents();
		                            }
		                        }
		                    });
		                }
		            },
		            _setOptions: function(o) {
		                if (o.theme !== undefined) {
		                    this.element.removeClass("ui-page-theme-" + this.options.theme).addClass("ui-page-theme-" + o.theme);
		                }
		                if (o.contentTheme !== undefined) {
		                    this.element.find("[data-" + $.mobile.ns + "='content']").removeClass("ui-body-" + this.options.contentTheme).addClass("ui-body-" + o.contentTheme);
		                }
		            },
		            _handlePageBeforeShow: function() {
		                this.setContainerBackground();
		            },
		            removeContainerBackground: function() {
		                this.element.closest(":mobile-pagecontainer").pagecontainer({
		                    theme: "none"
		                });
		            },
		            setContainerBackground: function(theme) {
		                this.element.parent().pagecontainer({
		                    theme: theme || this.options.theme
		                });
		            },
		            keepNativeSelector: function() {
		                var options = this.options, keepNative = $.trim(options.keepNative || ""), globalValue = $.trim($.mobile.keepNative), optionValue = $.trim(options.keepNativeDefault), newDefault = keepNativeFactoryDefault === globalValue ? "" : globalValue, oldDefault = newDefault === "" ? optionValue : "";
		                return (keepNative ? [ keepNative ] : []).concat(newDefault ? [ newDefault ] : []).concat(oldDefault ? [ oldDefault ] : []).join(", ");
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.pagecontainer", {
		            options: {
		                theme: "a"
		            },
		            initSelector: false,
		            _create: function() {
		                this._trigger("beforecreate");
		                this.setLastScrollEnabled = true;
		                this._on(this.window, {
		                    navigate: "_disableRecordScroll",
		                    scrollstop: "_delayedRecordScroll"
		                });
		                this._on(this.window, {
		                    navigate: "_filterNavigateEvents"
		                });
		                this._on({
		                    pagechange: "_afterContentChange"
		                });
		                this.window.one("navigate", $.proxy(function() {
		                    this.setLastScrollEnabled = true;
		                }, this));
		            },
		            _setOptions: function(options) {
		                if (options.theme !== undefined && options.theme !== "none") {
		                    this.element.removeClass("ui-overlay-" + this.options.theme).addClass("ui-overlay-" + options.theme);
		                } else if (options.theme !== undefined) {
		                    this.element.removeClass("ui-overlay-" + this.options.theme);
		                }
		                this._super(options);
		            },
		            _disableRecordScroll: function() {
		                this.setLastScrollEnabled = false;
		            },
		            _enableRecordScroll: function() {
		                this.setLastScrollEnabled = true;
		            },
		            _afterContentChange: function() {
		                this.setLastScrollEnabled = true;
		                this._off(this.window, "scrollstop");
		                this._on(this.window, {
		                    scrollstop: "_delayedRecordScroll"
		                });
		            },
		            _recordScroll: function() {
		                if (!this.setLastScrollEnabled) {
		                    return;
		                }
		                var active = this._getActiveHistory(), currentScroll, minScroll, defaultScroll;
		                if (active) {
		                    currentScroll = this._getScroll();
		                    minScroll = this._getMinScroll();
		                    defaultScroll = this._getDefaultScroll();
		                    active.lastScroll = currentScroll < minScroll ? defaultScroll : currentScroll;
		                }
		            },
		            _delayedRecordScroll: function() {
		                setTimeout($.proxy(this, "_recordScroll"), 100);
		            },
		            _getScroll: function() {
		                return this.window.scrollTop();
		            },
		            _getMinScroll: function() {
		                return $.mobile.minScrollBack;
		            },
		            _getDefaultScroll: function() {
		                return $.mobile.defaultHomeScroll;
		            },
		            _filterNavigateEvents: function(e, data) {
		                var url;
		                if (e.originalEvent && e.originalEvent.isDefaultPrevented()) {
		                    return;
		                }
		                url = e.originalEvent.type.indexOf("hashchange") > -1 ? data.state.hash : data.state.url;
		                if (!url) {
		                    url = this._getHash();
		                }
		                if (!url || url === "#" || url.indexOf("#" + $.mobile.path.uiStateKey) === 0) {
		                    url = location.href;
		                }
		                this._handleNavigate(url, data.state);
		            },
		            _getHash: function() {
		                return $.mobile.path.parseLocation().hash;
		            },
		            getActivePage: function() {
		                return this.activePage;
		            },
		            _getInitialContent: function() {
		                return $.mobile.firstPage;
		            },
		            _getHistory: function() {
		                return $.mobile.navigate.history;
		            },
		            _getActiveHistory: function() {
		                return this._getHistory().getActive();
		            },
		            _getDocumentBase: function() {
		                return $.mobile.path.documentBase;
		            },
		            back: function() {
		                this.go(-1);
		            },
		            forward: function() {
		                this.go(1);
		            },
		            go: function(steps) {
		                if ($.mobile.hashListeningEnabled) {
		                    window.history.go(steps);
		                } else {
		                    var activeIndex = $.mobile.navigate.history.activeIndex, index = activeIndex + parseInt(steps, 10), url = $.mobile.navigate.history.stack[index].url, direction = steps >= 1 ? "forward" : "back";
		                    $.mobile.navigate.history.activeIndex = index;
		                    $.mobile.navigate.history.previousIndex = activeIndex;
		                    this.change(url, {
		                        direction: direction,
		                        changeHash: false,
		                        fromHashChange: true
		                    });
		                }
		            },
		            _handleDestination: function(to) {
		                var history;
		                if ($.type(to) === "string") {
		                    to = $.mobile.path.stripHash(to);
		                }
		                if (to) {
		                    history = this._getHistory();
		                    to = !$.mobile.path.isPath(to) ? $.mobile.path.makeUrlAbsolute("#" + to, this._getDocumentBase()) : to;
		                }
		                return to || this._getInitialContent();
		            },
		            _transitionFromHistory: function(direction, defaultTransition) {
		                var history = this._getHistory(), entry = direction === "back" ? history.getLast() : history.getActive();
		                return entry && entry.transition || defaultTransition;
		            },
		            _handleDialog: function(changePageOptions, data) {
		                var to, active, activeContent = this.getActivePage();
		                if (activeContent && !activeContent.data("mobile-dialog")) {
		                    if (data.direction === "back") {
		                        this.back();
		                    } else {
		                        this.forward();
		                    }
		                    return false;
		                } else {
		                    to = data.pageUrl;
		                    active = this._getActiveHistory();
		                    $.extend(changePageOptions, {
		                        role: active.role,
		                        transition: this._transitionFromHistory(data.direction, changePageOptions.transition),
		                        reverse: data.direction === "back"
		                    });
		                }
		                return to;
		            },
		            _handleNavigate: function(url, data) {
		                var to = $.mobile.path.stripHash(url), history = this._getHistory(), transition = history.stack.length === 0 ? "none" : this._transitionFromHistory(data.direction), changePageOptions = {
		                    changeHash: false,
		                    fromHashChange: true,
		                    reverse: data.direction === "back"
		                };
		                $.extend(changePageOptions, data, {
		                    transition: transition
		                });
		                if (history.activeIndex > 0 && to.indexOf($.mobile.dialogHashKey) > -1) {
		                    to = this._handleDialog(changePageOptions, data);
		                    if (to === false) {
		                        return;
		                    }
		                }
		                this._changeContent(this._handleDestination(to), changePageOptions);
		            },
		            _changeContent: function(to, opts) {
		                $.mobile.changePage(to, opts);
		            },
		            _getBase: function() {
		                return $.mobile.base;
		            },
		            _getNs: function() {
		                return $.mobile.ns;
		            },
		            _enhance: function(content, role) {
		                return content.page({
		                    role: role
		                });
		            },
		            _include: function(page, settings) {
		                page.appendTo(this.element);
		                this._enhance(page, settings.role);
		                page.page("bindRemove");
		            },
		            _find: function(absUrl) {
		                var fileUrl = this._createFileUrl(absUrl), dataUrl = this._createDataUrl(absUrl), page, initialContent = this._getInitialContent();
		                page = this.element.children("[data-" + this._getNs() + "url='" + $.mobile.path.hashToSelector(dataUrl) + "']");
		                if (page.length === 0 && dataUrl && !$.mobile.path.isPath(dataUrl)) {
		                    page = this.element.children($.mobile.path.hashToSelector("#" + dataUrl)).attr("data-" + this._getNs() + "url", dataUrl).jqmData("url", dataUrl);
		                }
		                if (page.length === 0 && $.mobile.path.isFirstPageUrl(fileUrl) && initialContent && initialContent.parent().length) {
		                    page = $(initialContent);
		                }
		                return page;
		            },
		            _getLoader: function() {
		                return $.mobile.loading();
		            },
		            _showLoading: function(delay, theme, msg, textonly) {
		                if (this._loadMsg) {
		                    return;
		                }
		                this._loadMsg = setTimeout($.proxy(function() {
		                    this._getLoader().loader("show", theme, msg, textonly);
		                    this._loadMsg = 0;
		                }, this), delay);
		            },
		            _hideLoading: function() {
		                clearTimeout(this._loadMsg);
		                this._loadMsg = 0;
		                this._getLoader().loader("hide");
		            },
		            _showError: function() {
		                this._hideLoading();
		                this._showLoading(0, $.mobile.pageLoadErrorMessageTheme, $.mobile.pageLoadErrorMessage, true);
		                setTimeout($.proxy(this, "_hideLoading"), 1500);
		            },
		            _parse: function(html, fileUrl) {
		                var page, all = $("<div></div>");
		                all.get(0).innerHTML = html;
		                page = all.find(":jqmData(role='page'), :jqmData(role='dialog')").first();
		                if (!page.length) {
		                    page = $("<div data-" + this._getNs() + "role='page'>" + (html.split(/<\/?body[^>]*>/gim)[1] || "") + "</div>");
		                }
		                page.attr("data-" + this._getNs() + "url", this._createDataUrl(fileUrl)).attr("data-" + this._getNs() + "external-page", true);
		                return page;
		            },
		            _setLoadedTitle: function(page, html) {
		                var newPageTitle = html.match(/<title[^>]*>([^<]*)/) && RegExp.$1;
		                if (newPageTitle && !page.jqmData("title")) {
		                    newPageTitle = $("<div>" + newPageTitle + "</div>").text();
		                    page.jqmData("title", newPageTitle);
		                }
		            },
		            _isRewritableBaseTag: function() {
		                return $.mobile.dynamicBaseEnabled && !$.support.dynamicBaseTag;
		            },
		            _createDataUrl: function(absoluteUrl) {
		                return $.mobile.path.convertUrlToDataUrl(absoluteUrl);
		            },
		            _createFileUrl: function(absoluteUrl) {
		                return $.mobile.path.getFilePath(absoluteUrl);
		            },
		            _triggerWithDeprecated: function(name, data, page) {
		                var deprecatedEvent = $.Event("page" + name), newEvent = $.Event(this.widgetName + name);
		                (page || this.element).trigger(deprecatedEvent, data);
		                this._trigger(name, newEvent, data);
		                return {
		                    deprecatedEvent: deprecatedEvent,
		                    event: newEvent
		                };
		            },
		            _loadSuccess: function(absUrl, triggerData, settings, deferred) {
		                var fileUrl = this._createFileUrl(absUrl);
		                return $.proxy(function(html, textStatus, xhr) {
		                    var content, pageElemRegex = new RegExp("(<[^>]+\\bdata-" + this._getNs() + "role=[\"']?page[\"']?[^>]*>)"), dataUrlRegex = new RegExp("\\bdata-" + this._getNs() + "url=[\"']?([^\"'>]*)[\"']?");
		                    if (pageElemRegex.test(html) && RegExp.$1 && dataUrlRegex.test(RegExp.$1) && RegExp.$1) {
		                        fileUrl = $.mobile.path.getFilePath($("<div>" + RegExp.$1 + "</div>").text());
		                        fileUrl = this.window[0].encodeURIComponent(fileUrl);
		                    }
		                    if (settings.prefetch === undefined) {
		                        this._getBase().set(fileUrl);
		                    }
		                    content = this._parse(html, fileUrl);
		                    this._setLoadedTitle(content, html);
		                    triggerData.xhr = xhr;
		                    triggerData.textStatus = textStatus;
		                    triggerData.page = content;
		                    triggerData.content = content;
		                    triggerData.toPage = content;
		                    if (this._triggerWithDeprecated("load", triggerData).event.isDefaultPrevented()) {
		                        return;
		                    }
		                    if (this._isRewritableBaseTag() && content) {
		                        this._getBase().rewrite(fileUrl, content);
		                    }
		                    this._include(content, settings);
		                    if (settings.showLoadMsg) {
		                        this._hideLoading();
		                    }
		                    deferred.resolve(absUrl, settings, content);
		                }, this);
		            },
		            _loadDefaults: {
		                type: "get",
		                data: undefined,
		                reloadPage: false,
		                reload: false,
		                role: undefined,
		                showLoadMsg: false,
		                loadMsgDelay: 50
		            },
		            load: function(url, options) {
		                var deferred = options && options.deferred || $.Deferred(), reloadOptionExtension = options && options.reload === undefined && options.reloadPage !== undefined ? {
		                    reload: options.reloadPage
		                } : {}, settings = $.extend({}, this._loadDefaults, options, reloadOptionExtension), content = null, absUrl = $.mobile.path.makeUrlAbsolute(url, this._findBaseWithDefault()), fileUrl, dataUrl, pblEvent, triggerData;
		                if (settings.data && settings.type === "get") {
		                    absUrl = $.mobile.path.addSearchParams(absUrl, settings.data);
		                    settings.data = undefined;
		                }
		                if (settings.data && settings.type === "post") {
		                    settings.reload = true;
		                }
		                fileUrl = this._createFileUrl(absUrl);
		                dataUrl = this._createDataUrl(absUrl);
		                content = this._find(absUrl);
		                if (content.length === 0 && $.mobile.path.isEmbeddedPage(fileUrl) && !$.mobile.path.isFirstPageUrl(fileUrl)) {
		                    deferred.reject(absUrl, settings);
		                    return deferred.promise();
		                }
		                this._getBase().reset();
		                if (content.length && !settings.reload) {
		                    this._enhance(content, settings.role);
		                    deferred.resolve(absUrl, settings, content);
		                    if (!settings.prefetch) {
		                        this._getBase().set(url);
		                    }
		                    return deferred.promise();
		                }
		                triggerData = {
		                    url: url,
		                    absUrl: absUrl,
		                    toPage: url,
		                    prevPage: options ? options.fromPage : undefined,
		                    dataUrl: dataUrl,
		                    deferred: deferred,
		                    options: settings
		                };
		                pblEvent = this._triggerWithDeprecated("beforeload", triggerData);
		                if (pblEvent.deprecatedEvent.isDefaultPrevented() || pblEvent.event.isDefaultPrevented()) {
		                    return deferred.promise();
		                }
		                if (settings.showLoadMsg) {
		                    this._showLoading(settings.loadMsgDelay);
		                }
		                if (settings.prefetch === undefined) {
		                    this._getBase().reset();
		                }
		                if (!($.mobile.allowCrossDomainPages || $.mobile.path.isSameDomain($.mobile.path.documentUrl, absUrl))) {
		                    deferred.reject(absUrl, settings);
		                    return deferred.promise();
		                }
		                $.ajax({
		                    url: fileUrl,
		                    type: settings.type,
		                    data: settings.data,
		                    contentType: settings.contentType,
		                    dataType: "html",
		                    success: this._loadSuccess(absUrl, triggerData, settings, deferred),
		                    error: this._loadError(absUrl, triggerData, settings, deferred)
		                });
		                return deferred.promise();
		            },
		            _loadError: function(absUrl, triggerData, settings, deferred) {
		                return $.proxy(function(xhr, textStatus, errorThrown) {
		                    this._getBase().set($.mobile.path.get());
		                    triggerData.xhr = xhr;
		                    triggerData.textStatus = textStatus;
		                    triggerData.errorThrown = errorThrown;
		                    var plfEvent = this._triggerWithDeprecated("loadfailed", triggerData);
		                    if (plfEvent.deprecatedEvent.isDefaultPrevented() || plfEvent.event.isDefaultPrevented()) {
		                        return;
		                    }
		                    if (settings.showLoadMsg) {
		                        this._showError();
		                    }
		                    deferred.reject(absUrl, settings);
		                }, this);
		            },
		            _getTransitionHandler: function(transition) {
		                transition = $.mobile._maybeDegradeTransition(transition);
		                return $.mobile.transitionHandlers[transition] || $.mobile.defaultTransitionHandler;
		            },
		            _triggerCssTransitionEvents: function(to, from, prefix) {
		                var samePage = false;
		                prefix = prefix || "";
		                if (from) {
		                    if (to[0] === from[0]) {
		                        samePage = true;
		                    }
		                    this._triggerWithDeprecated(prefix + "hide", {
		                        nextPage: to,
		                        toPage: to,
		                        prevPage: from,
		                        samePage: samePage
		                    }, from);
		                }
		                this._triggerWithDeprecated(prefix + "show", {
		                    prevPage: from || $(""),
		                    toPage: to
		                }, to);
		            },
		            _cssTransition: function(to, from, options) {
		                var transition = options.transition, reverse = options.reverse, deferred = options.deferred, TransitionHandler, promise;
		                this._triggerCssTransitionEvents(to, from, "before");
		                this._hideLoading();
		                TransitionHandler = this._getTransitionHandler(transition);
		                promise = new TransitionHandler(transition, reverse, to, from).transition();
		                promise.done($.proxy(function() {
		                    this._triggerCssTransitionEvents(to, from);
		                }, this));
		                promise.done(function() {
		                    deferred.resolve.apply(deferred, arguments);
		                });
		            },
		            _releaseTransitionLock: function() {
		                isPageTransitioning = false;
		                if (pageTransitionQueue.length > 0) {
		                    $.mobile.changePage.apply(null, pageTransitionQueue.pop());
		                }
		            },
		            _removeActiveLinkClass: function(force) {
		                $.mobile.removeActiveLinkClass(force);
		            },
		            _loadUrl: function(to, triggerData, settings) {
		                settings.target = to;
		                settings.deferred = $.Deferred();
		                this.load(to, settings);
		                settings.deferred.done($.proxy(function(url, options, content) {
		                    isPageTransitioning = false;
		                    options.absUrl = triggerData.absUrl;
		                    this.transition(content, triggerData, options);
		                }, this));
		                settings.deferred.fail($.proxy(function() {
		                    this._removeActiveLinkClass(true);
		                    this._releaseTransitionLock();
		                    this._triggerWithDeprecated("changefailed", triggerData);
		                }, this));
		            },
		            _triggerPageBeforeChange: function(to, triggerData, settings) {
		                var returnEvents;
		                triggerData.prevPage = this.activePage;
		                $.extend(triggerData, {
		                    toPage: to,
		                    options: settings
		                });
		                if ($.type(to) === "string") {
		                    triggerData.absUrl = $.mobile.path.makeUrlAbsolute(to, this._findBaseWithDefault());
		                } else {
		                    triggerData.absUrl = settings.absUrl;
		                }
		                returnEvents = this._triggerWithDeprecated("beforechange", triggerData);
		                if (returnEvents.event.isDefaultPrevented() || returnEvents.deprecatedEvent.isDefaultPrevented()) {
		                    return false;
		                }
		                return true;
		            },
		            change: function(to, options) {
		                if (isPageTransitioning) {
		                    pageTransitionQueue.unshift(arguments);
		                    return;
		                }
		                var settings = $.extend({}, $.mobile.changePage.defaults, options), triggerData = {};
		                settings.fromPage = settings.fromPage || this.activePage;
		                if (!this._triggerPageBeforeChange(to, triggerData, settings)) {
		                    return;
		                }
		                to = triggerData.toPage;
		                if ($.type(to) === "string") {
		                    isPageTransitioning = true;
		                    this._loadUrl(to, triggerData, settings);
		                } else {
		                    this.transition(to, triggerData, settings);
		                }
		            },
		            transition: function(toPage, triggerData, settings) {
		                var fromPage, url, pageUrl, fileUrl, active, activeIsInitialPage, historyDir, pageTitle, isDialog, alreadyThere, newPageTitle, params, cssTransitionDeferred, beforeTransition;
		                if (isPageTransitioning) {
		                    pageTransitionQueue.unshift([ toPage, settings ]);
		                    return;
		                }
		                if (!this._triggerPageBeforeChange(toPage, triggerData, settings)) {
		                    return;
		                }
		                triggerData.prevPage = settings.fromPage;
		                beforeTransition = this._triggerWithDeprecated("beforetransition", triggerData);
		                if (beforeTransition.deprecatedEvent.isDefaultPrevented() || beforeTransition.event.isDefaultPrevented()) {
		                    return;
		                }
		                isPageTransitioning = true;
		                if (toPage[0] === $.mobile.firstPage[0] && !settings.dataUrl) {
		                    settings.dataUrl = $.mobile.path.documentUrl.hrefNoHash;
		                }
		                fromPage = settings.fromPage;
		                url = settings.dataUrl && $.mobile.path.convertUrlToDataUrl(settings.dataUrl) || toPage.jqmData("url");
		                pageUrl = url;
		                fileUrl = $.mobile.path.getFilePath(url);
		                active = $.mobile.navigate.history.getActive();
		                activeIsInitialPage = $.mobile.navigate.history.activeIndex === 0;
		                historyDir = 0;
		                pageTitle = document.title;
		                isDialog = (settings.role === "dialog" || toPage.jqmData("role") === "dialog") && toPage.jqmData("dialog") !== true;
		                if (fromPage && fromPage[0] === toPage[0] && !settings.allowSamePageTransition) {
		                    isPageTransitioning = false;
		                    this._triggerWithDeprecated("transition", triggerData);
		                    this._triggerWithDeprecated("change", triggerData);
		                    if (settings.fromHashChange) {
		                        $.mobile.navigate.history.direct({
		                            url: url
		                        });
		                    }
		                    return;
		                }
		                toPage.page({
		                    role: settings.role
		                });
		                if (settings.fromHashChange) {
		                    historyDir = settings.direction === "back" ? -1 : 1;
		                }
		                try {
		                    if (document.activeElement && document.activeElement.nodeName.toLowerCase() !== "body") {
		                        $(document.activeElement).blur();
		                    } else {
		                        $("input:focus, textarea:focus, select:focus").blur();
		                    }
		                } catch (e) {}
		                alreadyThere = false;
		                if (isDialog && active) {
		                    if (active.url && active.url.indexOf($.mobile.dialogHashKey) > -1 && this.activePage && !this.activePage.hasClass("ui-dialog") && $.mobile.navigate.history.activeIndex > 0) {
		                        settings.changeHash = false;
		                        alreadyThere = true;
		                    }
		                    url = active.url || "";
		                    if (!alreadyThere && url.indexOf("#") > -1) {
		                        url += $.mobile.dialogHashKey;
		                    } else {
		                        url += "#" + $.mobile.dialogHashKey;
		                    }
		                }
		                newPageTitle = !active ? pageTitle : toPage.jqmData("title") || toPage.children(":jqmData(role='header')").find(".ui-title").text();
		                if (!!newPageTitle && pageTitle === document.title) {
		                    pageTitle = newPageTitle;
		                }
		                if (!toPage.jqmData("title")) {
		                    toPage.jqmData("title", pageTitle);
		                }
		                settings.transition = settings.transition || (historyDir && !activeIsInitialPage ? active.transition : undefined) || (isDialog ? $.mobile.defaultDialogTransition : $.mobile.defaultPageTransition);
		                if (!historyDir && alreadyThere) {
		                    $.mobile.navigate.history.getActive().pageUrl = pageUrl;
		                }
		                if (url && !settings.fromHashChange) {
		                    if (!$.mobile.path.isPath(url) && url.indexOf("#") < 0) {
		                        url = "#" + url;
		                    }
		                    params = {
		                        transition: settings.transition,
		                        title: pageTitle,
		                        pageUrl: pageUrl,
		                        role: settings.role
		                    };
		                    if (settings.changeHash !== false && $.mobile.hashListeningEnabled) {
		                        $.mobile.navigate(this.window[0].encodeURI(url), params, true);
		                    } else if (toPage[0] !== $.mobile.firstPage[0]) {
		                        $.mobile.navigate.history.add(url, params);
		                    }
		                }
		                document.title = pageTitle;
		                $.mobile.activePage = toPage;
		                this.activePage = toPage;
		                settings.reverse = settings.reverse || historyDir < 0;
		                cssTransitionDeferred = $.Deferred();
		                this._cssTransition(toPage, fromPage, {
		                    transition: settings.transition,
		                    reverse: settings.reverse,
		                    deferred: cssTransitionDeferred
		                });
		                cssTransitionDeferred.done($.proxy(function(name, reverse, $to, $from, alreadyFocused) {
		                    $.mobile.removeActiveLinkClass();
		                    if (settings.duplicateCachedPage) {
		                        settings.duplicateCachedPage.remove();
		                    }
		                    if (!alreadyFocused) {
		                        $.mobile.focusPage(toPage);
		                    }
		                    this._releaseTransitionLock();
		                    this._triggerWithDeprecated("transition", triggerData);
		                    this._triggerWithDeprecated("change", triggerData);
		                }, this));
		            },
		            _findBaseWithDefault: function() {
		                var closestBase = this.activePage && $.mobile.getClosestBaseUrl(this.activePage);
		                return closestBase || $.mobile.path.documentBase.hrefNoHash;
		            }
		        });
		        $.mobile.navreadyDeferred = $.Deferred();
		        var pageTransitionQueue = [], isPageTransitioning = false;
		    })(jQuery);
		    (function($, undefined) {
		        var domreadyDeferred = $.Deferred(), loadDeferred = $.Deferred(), pageIsFullyLoaded = function() {
		            loadDeferred.resolve();
		            loadDeferred = null;
		        }, documentUrl = $.mobile.path.documentUrl, $lastVClicked = null;
		        function findClosestLink(ele) {
		            while (ele) {
		                if (typeof ele.nodeName === "string" && ele.nodeName.toLowerCase() === "a") {
		                    break;
		                }
		                ele = ele.parentNode;
		            }
		            return ele;
		        }
		        $.mobile.loadPage = function(url, opts) {
		            var container;
		            opts = opts || {};
		            container = opts.pageContainer || $.mobile.pageContainer;
		            opts.deferred = $.Deferred();
		            container.pagecontainer("load", url, opts);
		            return opts.deferred.promise();
		        };
		        $.mobile.back = function() {
		            var nav = window.navigator;
		            if (this.phonegapNavigationEnabled && nav && nav.app && nav.app.backHistory) {
		                nav.app.backHistory();
		            } else {
		                $.mobile.pageContainer.pagecontainer("back");
		            }
		        };
		        $.mobile.focusPage = function(page) {
		            var autofocus = page.find("[autofocus]"), pageTitle = page.find(".ui-title:eq(0)");
		            if (autofocus.length) {
		                autofocus.focus();
		                return;
		            }
		            if (pageTitle.length) {
		                pageTitle.focus();
		            } else {
		                page.focus();
		            }
		        };
		        $.mobile._maybeDegradeTransition = $.mobile._maybeDegradeTransition || function(transition) {
		            return transition;
		        };
		        $.mobile.changePage = function(to, options) {
		            $.mobile.pageContainer.pagecontainer("change", to, options);
		        };
		        $.mobile.changePage.defaults = {
		            transition: undefined,
		            reverse: false,
		            changeHash: true,
		            fromHashChange: false,
		            role: undefined,
		            duplicateCachedPage: undefined,
		            pageContainer: undefined,
		            showLoadMsg: true,
		            dataUrl: undefined,
		            fromPage: undefined,
		            allowSamePageTransition: false
		        };
		        $.mobile._registerInternalEvents = function() {
		            var getAjaxFormData = function($form, calculateOnly) {
		                var url, ret = true, formData, vclickedName, method;
		                if (!$.mobile.ajaxEnabled || $form.is(":jqmData(ajax='false')") || !$form.jqmHijackable().length || $form.attr("target")) {
		                    return false;
		                }
		                url = $lastVClicked && $lastVClicked.attr("formaction") || $form.attr("action");
		                method = ($form.attr("method") || "get").toLowerCase();
		                if (!url) {
		                    url = $.mobile.getClosestBaseUrl($form);
		                    if (method === "get") {
		                        url = $.mobile.path.parseUrl(url).hrefNoSearch;
		                    }
		                    if (url === $.mobile.path.documentBase.hrefNoHash) {
		                        url = documentUrl.hrefNoSearch;
		                    }
		                }
		                url = $.mobile.path.makeUrlAbsolute(url, $.mobile.getClosestBaseUrl($form));
		                if ($.mobile.path.isExternal(url) && !$.mobile.path.isPermittedCrossDomainRequest(documentUrl, url)) {
		                    return false;
		                }
		                if (!calculateOnly) {
		                    formData = $form.serializeArray();
		                    if ($lastVClicked && $lastVClicked[0].form === $form[0]) {
		                        vclickedName = $lastVClicked.attr("name");
		                        if (vclickedName) {
		                            $.each(formData, function(key, value) {
		                                if (value.name === vclickedName) {
		                                    vclickedName = "";
		                                    return false;
		                                }
		                            });
		                            if (vclickedName) {
		                                formData.push({
		                                    name: vclickedName,
		                                    value: $lastVClicked.attr("value")
		                                });
		                            }
		                        }
		                    }
		                    ret = {
		                        url: url,
		                        options: {
		                            type: method,
		                            data: $.param(formData),
		                            transition: $form.jqmData("transition"),
		                            reverse: $form.jqmData("direction") === "reverse",
		                            reloadPage: true
		                        }
		                    };
		                }
		                return ret;
		            };
		            $.mobile.document.delegate("form", "submit", function(event) {
		                var formData;
		                if (!event.isDefaultPrevented()) {
		                    formData = getAjaxFormData($(this));
		                    if (formData) {
		                        $.mobile.changePage(formData.url, formData.options);
		                        event.preventDefault();
		                    }
		                }
		            });
		            $.mobile.document.bind("vclick", function(event) {
		                var $btn, btnEls, target = event.target, needClosest = false;
		                if (event.which > 1 || !$.mobile.linkBindingEnabled) {
		                    return;
		                }
		                $lastVClicked = $(target);
		                if ($.data(target, "mobile-button")) {
		                    if (!getAjaxFormData($(target).closest("form"), true)) {
		                        return;
		                    }
		                    if (target.parentNode) {
		                        target = target.parentNode;
		                    }
		                } else {
		                    target = findClosestLink(target);
		                    if (!(target && $.mobile.path.parseUrl(target.getAttribute("href") || "#").hash !== "#")) {
		                        return;
		                    }
		                    if (!$(target).jqmHijackable().length) {
		                        return;
		                    }
		                }
		                if (!!~target.className.indexOf("ui-link-inherit")) {
		                    if (target.parentNode) {
		                        btnEls = $.data(target.parentNode, "buttonElements");
		                    }
		                } else {
		                    btnEls = $.data(target, "buttonElements");
		                }
		                if (btnEls) {
		                    target = btnEls.outer;
		                } else {
		                    needClosest = true;
		                }
		                $btn = $(target);
		                if (needClosest) {
		                    $btn = $btn.closest(".ui-btn");
		                }
		                if ($btn.length > 0 && !$btn.hasClass("ui-state-disabled" || $btn.hasClass("ui-disabled"))) {
		                    $.mobile.removeActiveLinkClass(true);
		                    $.mobile.activeClickedLink = $btn;
		                    $.mobile.activeClickedLink.addClass($.mobile.activeBtnClass);
		                }
		            });
		            $.mobile.document.bind("click", function(event) {
		                if (!$.mobile.linkBindingEnabled || event.isDefaultPrevented()) {
		                    return;
		                }
		                var link = findClosestLink(event.target), $link = $(link), httpCleanup = function() {
		                    window.setTimeout(function() {
		                        $.mobile.removeActiveLinkClass(true);
		                    }, 200);
		                }, baseUrl, href, useDefaultUrlHandling, isExternal, transition, reverse, role;
		                if ($.mobile.activeClickedLink && $.mobile.activeClickedLink[0] === event.target.parentNode) {
		                    httpCleanup();
		                }
		                if (!link || event.which > 1 || !$link.jqmHijackable().length) {
		                    return;
		                }
		                if ($link.is(":jqmData(rel='back')")) {
		                    $.mobile.back();
		                    return false;
		                }
		                baseUrl = $.mobile.getClosestBaseUrl($link);
		                href = $.mobile.path.makeUrlAbsolute($link.attr("href") || "#", baseUrl);
		                if (!$.mobile.ajaxEnabled && !$.mobile.path.isEmbeddedPage(href)) {
		                    httpCleanup();
		                    return;
		                }
		                if (href.search("#") !== -1 && !($.mobile.path.isExternal(href) && $.mobile.path.isAbsoluteUrl(href))) {
		                    href = href.replace(/[^#]*#/, "");
		                    if (!href) {
		                        event.preventDefault();
		                        return;
		                    } else if ($.mobile.path.isPath(href)) {
		                        href = $.mobile.path.makeUrlAbsolute(href, baseUrl);
		                    } else {
		                        href = $.mobile.path.makeUrlAbsolute("#" + href, documentUrl.hrefNoHash);
		                    }
		                }
		                useDefaultUrlHandling = $link.is("[rel='external']") || $link.is(":jqmData(ajax='false')") || $link.is("[target]");
		                isExternal = useDefaultUrlHandling || $.mobile.path.isExternal(href) && !$.mobile.path.isPermittedCrossDomainRequest(documentUrl, href);
		                if (isExternal) {
		                    httpCleanup();
		                    return;
		                }
		                transition = $link.jqmData("transition");
		                reverse = $link.jqmData("direction") === "reverse" || $link.jqmData("back");
		                role = $link.attr("data-" + $.mobile.ns + "rel") || undefined;
		                $.mobile.changePage(href, {
		                    transition: transition,
		                    reverse: reverse,
		                    role: role,
		                    link: $link
		                });
		                event.preventDefault();
		            });
		            $.mobile.document.delegate(".ui-page", "pageshow.prefetch", function() {
		                var urls = [];
		                $(this).find("a:jqmData(prefetch)").each(function() {
		                    var $link = $(this), url = $link.attr("href");
		                    if (url && $.inArray(url, urls) === -1) {
		                        urls.push(url);
		                        $.mobile.loadPage(url, {
		                            role: $link.attr("data-" + $.mobile.ns + "rel"),
		                            prefetch: true
		                        });
		                    }
		                });
		            });
		            $.mobile.pageContainer.pagecontainer();
		            $.mobile.document.bind("pageshow", function() {
		                if (loadDeferred) {
		                    loadDeferred.done($.mobile.resetActivePageHeight);
		                } else {
		                    $.mobile.resetActivePageHeight();
		                }
		            });
		            $.mobile.window.bind("throttledresize", $.mobile.resetActivePageHeight);
		        };
		        $(function() {
		            domreadyDeferred.resolve();
		        });
		        if (document.readyState === "complete") {
		            pageIsFullyLoaded();
		        } else {
		            $.mobile.window.load(pageIsFullyLoaded);
		        }
		        $.when(domreadyDeferred, $.mobile.navreadyDeferred).done(function() {
		            $.mobile._registerInternalEvents();
		        });
		    })(jQuery);
		    (function($, window, undefined) {
		        $.mobile.Transition = function() {
		            this.init.apply(this, arguments);
		        };
		        $.extend($.mobile.Transition.prototype, {
		            toPreClass: " ui-page-pre-in",
		            init: function(name, reverse, $to, $from) {
		                $.extend(this, {
		                    name: name,
		                    reverse: reverse,
		                    $to: $to,
		                    $from: $from,
		                    deferred: new $.Deferred()
		                });
		            },
		            cleanFrom: function() {
		                this.$from.removeClass($.mobile.activePageClass + " out in reverse " + this.name).height("");
		            },
		            beforeDoneIn: function() {},
		            beforeDoneOut: function() {},
		            beforeStartOut: function() {},
		            doneIn: function() {
		                this.beforeDoneIn();
		                this.$to.removeClass("out in reverse " + this.name).height("");
		                this.toggleViewportClass();
		                if ($.mobile.window.scrollTop() !== this.toScroll) {
		                    this.scrollPage();
		                }
		                if (!this.sequential) {
		                    this.$to.addClass($.mobile.activePageClass);
		                }
		                this.deferred.resolve(this.name, this.reverse, this.$to, this.$from, true);
		            },
		            doneOut: function(screenHeight, reverseClass, none, preventFocus) {
		                this.beforeDoneOut();
		                this.startIn(screenHeight, reverseClass, none, preventFocus);
		            },
		            hideIn: function(callback) {
		                this.$to.css("z-index", -10);
		                callback.call(this);
		                this.$to.css("z-index", "");
		            },
		            scrollPage: function() {
		                $.event.special.scrollstart.enabled = false;
		                if ($.mobile.hideUrlBar || this.toScroll !== $.mobile.defaultHomeScroll) {
		                    window.scrollTo(0, this.toScroll);
		                }
		                setTimeout(function() {
		                    $.event.special.scrollstart.enabled = true;
		                }, 150);
		            },
		            startIn: function(screenHeight, reverseClass, none, preventFocus) {
		                this.hideIn(function() {
		                    this.$to.addClass($.mobile.activePageClass + this.toPreClass);
		                    if (!preventFocus) {
		                        $.mobile.focusPage(this.$to);
		                    }
		                    this.$to.height(screenHeight + this.toScroll);
		                    if (!none) {
		                        this.scrollPage();
		                    }
		                });
		                this.$to.removeClass(this.toPreClass).addClass(this.name + " in " + reverseClass);
		                if (!none) {
		                    this.$to.animationComplete($.proxy(function() {
		                        this.doneIn();
		                    }, this));
		                } else {
		                    this.doneIn();
		                }
		            },
		            startOut: function(screenHeight, reverseClass, none) {
		                this.beforeStartOut(screenHeight, reverseClass, none);
		                this.$from.height(screenHeight + $.mobile.window.scrollTop()).addClass(this.name + " out" + reverseClass);
		            },
		            toggleViewportClass: function() {
		                $.mobile.pageContainer.toggleClass("ui-mobile-viewport-transitioning viewport-" + this.name);
		            },
		            transition: function() {
		                var none, reverseClass = this.reverse ? " reverse" : "", screenHeight = $.mobile.getScreenHeight(), maxTransitionOverride = $.mobile.maxTransitionWidth !== false && $.mobile.window.width() > $.mobile.maxTransitionWidth;
		                this.toScroll = $.mobile.navigate.history.getActive().lastScroll || $.mobile.defaultHomeScroll;
		                none = !$.support.cssTransitions || !$.support.cssAnimations || maxTransitionOverride || !this.name || this.name === "none" || Math.max($.mobile.window.scrollTop(), this.toScroll) > $.mobile.getMaxScrollForTransition();
		                this.toggleViewportClass();
		                if (this.$from && !none) {
		                    this.startOut(screenHeight, reverseClass, none);
		                } else {
		                    this.doneOut(screenHeight, reverseClass, none, true);
		                }
		                return this.deferred.promise();
		            }
		        });
		    })(jQuery, this);
		    (function($) {
		        $.mobile.SerialTransition = function() {
		            this.init.apply(this, arguments);
		        };
		        $.extend($.mobile.SerialTransition.prototype, $.mobile.Transition.prototype, {
		            sequential: true,
		            beforeDoneOut: function() {
		                if (this.$from) {
		                    this.cleanFrom();
		                }
		            },
		            beforeStartOut: function(screenHeight, reverseClass, none) {
		                this.$from.animationComplete($.proxy(function() {
		                    this.doneOut(screenHeight, reverseClass, none);
		                }, this));
		            }
		        });
		    })(jQuery);
		    (function($) {
		        $.mobile.ConcurrentTransition = function() {
		            this.init.apply(this, arguments);
		        };
		        $.extend($.mobile.ConcurrentTransition.prototype, $.mobile.Transition.prototype, {
		            sequential: false,
		            beforeDoneIn: function() {
		                if (this.$from) {
		                    this.cleanFrom();
		                }
		            },
		            beforeStartOut: function(screenHeight, reverseClass, none) {
		                this.doneOut(screenHeight, reverseClass, none);
		            }
		        });
		    })(jQuery);
		    (function($) {
		        var defaultGetMaxScrollForTransition = function() {
		            return $.mobile.getScreenHeight() * 3;
		        };
		        $.mobile.transitionHandlers = {
		            sequential: $.mobile.SerialTransition,
		            simultaneous: $.mobile.ConcurrentTransition
		        };
		        $.mobile.defaultTransitionHandler = $.mobile.transitionHandlers.sequential;
		        $.mobile.transitionFallbacks = {};
		        $.mobile._maybeDegradeTransition = function(transition) {
		            if (transition && !$.support.cssTransform3d && $.mobile.transitionFallbacks[transition]) {
		                transition = $.mobile.transitionFallbacks[transition];
		            }
		            return transition;
		        };
		        $.mobile.getMaxScrollForTransition = $.mobile.getMaxScrollForTransition || defaultGetMaxScrollForTransition;
		    })(jQuery);
		    (function($, window, undefined) {
		        $.mobile.transitionFallbacks.flip = "fade";
		    })(jQuery, this);
		    (function($, window, undefined) {
		        $.mobile.transitionFallbacks.flow = "fade";
		    })(jQuery, this);
		    (function($, window, undefined) {
		        $.mobile.transitionFallbacks.pop = "fade";
		    })(jQuery, this);
		    (function($, window, undefined) {
		        $.mobile.transitionHandlers.slide = $.mobile.transitionHandlers.simultaneous;
		        $.mobile.transitionFallbacks.slide = "fade";
		    })(jQuery, this);
		    (function($, window, undefined) {
		        $.mobile.transitionFallbacks.slidedown = "fade";
		    })(jQuery, this);
		    (function($, window, undefined) {
		        $.mobile.transitionFallbacks.slidefade = "fade";
		    })(jQuery, this);
		    (function($, window, undefined) {
		        $.mobile.transitionFallbacks.slideup = "fade";
		    })(jQuery, this);
		    (function($, window, undefined) {
		        $.mobile.transitionFallbacks.turn = "fade";
		    })(jQuery, this);
		    (function($, undefined) {
		        $.mobile.degradeInputs = {
		            color: false,
		            date: false,
		            datetime: false,
		            "datetime-local": false,
		            email: false,
		            month: false,
		            number: false,
		            range: "number",
		            search: "text",
		            tel: false,
		            time: false,
		            url: false,
		            week: false
		        };
		        $.mobile.page.prototype.options.degradeInputs = $.mobile.degradeInputs;
		        $.mobile.degradeInputsWithin = function(target) {
		            target = $(target);
		            target.find("input").not($.mobile.page.prototype.keepNativeSelector()).each(function() {
		                var element = $(this), type = this.getAttribute("type"), optType = $.mobile.degradeInputs[type] || "text", html, hasType, findstr, repstr;
		                if ($.mobile.degradeInputs[type]) {
		                    html = $("<div>").html(element.clone()).html();
		                    hasType = html.indexOf(" type=") > -1;
		                    findstr = hasType ? /\s+type=["']?\w+['"]?/ : /\/?>/;
		                    repstr = ' type="' + optType + '" data-' + $.mobile.ns + 'type="' + type + '"' + (hasType ? "" : ">");
		                    element.replaceWith(html.replace(findstr, repstr));
		                }
		            });
		        };
		    })(jQuery);
		    (function($, window, undefined) {
		        $.widget("mobile.page", $.mobile.page, {
		            options: {
		                closeBtn: "left",
		                closeBtnText: "Close",
		                overlayTheme: "a",
		                corners: true,
		                dialog: false
		            },
		            _create: function() {
		                this._super();
		                if (this.options.dialog) {
		                    $.extend(this, {
		                        _inner: this.element.children(),
		                        _headerCloseButton: null
		                    });
		                    if (!this.options.enhanced) {
		                        this._setCloseBtn(this.options.closeBtn);
		                    }
		                }
		            },
		            _enhance: function() {
		                this._super();
		                if (this.options.dialog) {
		                    this.element.addClass("ui-dialog").wrapInner($("<div/>", {
		                        role: "dialog",
		                        class: "ui-dialog-contain ui-overlay-shadow" + (this.options.corners ? " ui-corner-all" : "")
		                    }));
		                }
		            },
		            _setOptions: function(options) {
		                var closeButtonLocation, closeButtonText, currentOpts = this.options;
		                if (options.corners !== undefined) {
		                    this._inner.toggleClass("ui-corner-all", !!options.corners);
		                }
		                if (options.overlayTheme !== undefined) {
		                    if ($.mobile.activePage[0] === this.element[0]) {
		                        currentOpts.overlayTheme = options.overlayTheme;
		                        this._handlePageBeforeShow();
		                    }
		                }
		                if (options.closeBtnText !== undefined) {
		                    closeButtonLocation = currentOpts.closeBtn;
		                    closeButtonText = options.closeBtnText;
		                }
		                if (options.closeBtn !== undefined) {
		                    closeButtonLocation = options.closeBtn;
		                }
		                if (closeButtonLocation) {
		                    this._setCloseBtn(closeButtonLocation, closeButtonText);
		                }
		                this._super(options);
		            },
		            _handlePageBeforeShow: function() {
		                if (this.options.overlayTheme && this.options.dialog) {
		                    this.removeContainerBackground();
		                    this.setContainerBackground(this.options.overlayTheme);
		                } else {
		                    this._super();
		                }
		            },
		            _setCloseBtn: function(location, text) {
		                var dst, btn = this._headerCloseButton;
		                location = "left" === location ? "left" : "right" === location ? "right" : "none";
		                if ("none" === location) {
		                    if (btn) {
		                        btn.remove();
		                        btn = null;
		                    }
		                } else if (btn) {
		                    btn.removeClass("ui-btn-left ui-btn-right").addClass("ui-btn-" + location);
		                    if (text) {
		                        btn.text(text);
		                    }
		                } else {
		                    dst = this._inner.find(":jqmData(role='header')").first();
		                    btn = $("<a></a>", {
		                        href: "#",
		                        class: "ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-" + location
		                    }).attr("data-" + $.mobile.ns + "rel", "back").text(text || this.options.closeBtnText || "").prependTo(dst);
		                }
		                this._headerCloseButton = btn;
		            }
		        });
		    })(jQuery, this);
		    (function($, window, undefined) {
		        $.widget("mobile.dialog", {
		            options: {
		                closeBtn: "left",
		                closeBtnText: "Close",
		                overlayTheme: "a",
		                corners: true
		            },
		            _handlePageBeforeShow: function() {
		                this._isCloseable = true;
		                if (this.options.overlayTheme) {
		                    this.element.page("removeContainerBackground").page("setContainerBackground", this.options.overlayTheme);
		                }
		            },
		            _handlePageBeforeHide: function() {
		                this._isCloseable = false;
		            },
		            _handleVClickSubmit: function(event) {
		                var attrs, $target = $(event.target).closest(event.type === "vclick" ? "a" : "form");
		                if ($target.length && !$target.jqmData("transition")) {
		                    attrs = {};
		                    attrs["data-" + $.mobile.ns + "transition"] = ($.mobile.navigate.history.getActive() || {})["transition"] || $.mobile.defaultDialogTransition;
		                    attrs["data-" + $.mobile.ns + "direction"] = "reverse";
		                    $target.attr(attrs);
		                }
		            },
		            _create: function() {
		                var elem = this.element, opts = this.options;
		                elem.addClass("ui-dialog").wrapInner($("<div/>", {
		                    role: "dialog",
		                    class: "ui-dialog-contain ui-overlay-shadow" + (!!opts.corners ? " ui-corner-all" : "")
		                }));
		                $.extend(this, {
		                    _isCloseable: false,
		                    _inner: elem.children(),
		                    _headerCloseButton: null
		                });
		                this._on(elem, {
		                    vclick: "_handleVClickSubmit",
		                    submit: "_handleVClickSubmit",
		                    pagebeforeshow: "_handlePageBeforeShow",
		                    pagebeforehide: "_handlePageBeforeHide"
		                });
		                this._setCloseBtn(opts.closeBtn);
		            },
		            _setOptions: function(options) {
		                var closeButtonLocation, closeButtonText, currentOpts = this.options;
		                if (options.corners !== undefined) {
		                    this._inner.toggleClass("ui-corner-all", !!options.corners);
		                }
		                if (options.overlayTheme !== undefined) {
		                    if ($.mobile.activePage[0] === this.element[0]) {
		                        currentOpts.overlayTheme = options.overlayTheme;
		                        this._handlePageBeforeShow();
		                    }
		                }
		                if (options.closeBtnText !== undefined) {
		                    closeButtonLocation = currentOpts.closeBtn;
		                    closeButtonText = options.closeBtnText;
		                }
		                if (options.closeBtn !== undefined) {
		                    closeButtonLocation = options.closeBtn;
		                }
		                if (closeButtonLocation) {
		                    this._setCloseBtn(closeButtonLocation, closeButtonText);
		                }
		                this._super(options);
		            },
		            _setCloseBtn: function(location, text) {
		                var dst, btn = this._headerCloseButton;
		                location = "left" === location ? "left" : "right" === location ? "right" : "none";
		                if ("none" === location) {
		                    if (btn) {
		                        btn.remove();
		                        btn = null;
		                    }
		                } else if (btn) {
		                    btn.removeClass("ui-btn-left ui-btn-right").addClass("ui-btn-" + location);
		                    if (text) {
		                        btn.text(text);
		                    }
		                } else {
		                    dst = this._inner.find(":jqmData(role='header')").first();
		                    btn = $("<a></a>", {
		                        role: "button",
		                        href: "#",
		                        class: "ui-btn ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-" + location
		                    }).text(text || this.options.closeBtnText || "").prependTo(dst);
		                    this._on(btn, {
		                        click: "close"
		                    });
		                }
		                this._headerCloseButton = btn;
		            },
		            close: function() {
		                var hist = $.mobile.navigate.history;
		                if (this._isCloseable) {
		                    this._isCloseable = false;
		                    if ($.mobile.hashListeningEnabled && hist.activeIndex > 0) {
		                        $.mobile.back();
		                    } else {
		                        $.mobile.pageContainer.pagecontainer("back");
		                    }
		                }
		            }
		        });
		    })(jQuery, this);
		    (function($, undefined) {
		        var rInitialLetter = /([A-Z])/g, iconposClass = function(iconpos) {
		            return "ui-btn-icon-" + (iconpos === null ? "left" : iconpos);
		        };
		        $.widget("mobile.collapsible", {
		            options: {
		                enhanced: false,
		                expandCueText: null,
		                collapseCueText: null,
		                collapsed: true,
		                heading: "h1,h2,h3,h4,h5,h6,legend",
		                collapsedIcon: null,
		                expandedIcon: null,
		                iconpos: null,
		                theme: null,
		                contentTheme: null,
		                inset: null,
		                corners: null,
		                mini: null
		            },
		            _create: function() {
		                var elem = this.element, ui = {
		                    accordion: elem.closest(":jqmData(role='collapsible-set')," + ":jqmData(role='collapsibleset')" + ($.mobile.collapsibleset ? ", :mobile-collapsibleset" : "")).addClass("ui-collapsible-set")
		                };
		                this._ui = ui;
		                this._renderedOptions = this._getOptions(this.options);
		                if (this.options.enhanced) {
		                    ui.heading = this.element.children(".ui-collapsible-heading");
		                    ui.content = ui.heading.next();
		                    ui.anchor = ui.heading.children();
		                    ui.status = ui.anchor.children(".ui-collapsible-heading-status");
		                } else {
		                    this._enhance(elem, ui);
		                }
		                this._on(ui.heading, {
		                    tap: function() {
		                        ui.heading.find("a").first().addClass($.mobile.activeBtnClass);
		                    },
		                    click: function(event) {
		                        this._handleExpandCollapse(!ui.heading.hasClass("ui-collapsible-heading-collapsed"));
		                        event.preventDefault();
		                        event.stopPropagation();
		                    }
		                });
		            },
		            _getOptions: function(options) {
		                var key, accordion = this._ui.accordion, accordionWidget = this._ui.accordionWidget;
		                options = $.extend({}, options);
		                if (accordion.length && !accordionWidget) {
		                    this._ui.accordionWidget = accordionWidget = accordion.data("mobile-collapsibleset");
		                }
		                for (key in options) {
		                    options[key] = options[key] != null ? options[key] : accordionWidget ? accordionWidget.options[key] : accordion.length ? $.mobile.getAttribute(accordion[0], key.replace(rInitialLetter, "-$1").toLowerCase()) : null;
		                    if (null == options[key]) {
		                        options[key] = $.mobile.collapsible.defaults[key];
		                    }
		                }
		                return options;
		            },
		            _themeClassFromOption: function(prefix, value) {
		                return value ? value === "none" ? "" : prefix + value : "";
		            },
		            _enhance: function(elem, ui) {
		                var iconclass, opts = this._renderedOptions, contentThemeClass = this._themeClassFromOption("ui-body-", opts.contentTheme);
		                elem.addClass("ui-collapsible " + (opts.inset ? "ui-collapsible-inset " : "") + (opts.inset && opts.corners ? "ui-corner-all " : "") + (contentThemeClass ? "ui-collapsible-themed-content " : ""));
		                ui.originalHeading = elem.children(this.options.heading).first(), ui.content = elem.wrapInner("<div " + "class='ui-collapsible-content " + contentThemeClass + "'></div>").children(".ui-collapsible-content"), 
		                ui.heading = ui.originalHeading;
		                if (ui.heading.is("legend")) {
		                    ui.heading = $("<div role='heading'>" + ui.heading.html() + "</div>");
		                    ui.placeholder = $("<div><!-- placeholder for legend --></div>").insertBefore(ui.originalHeading);
		                    ui.originalHeading.remove();
		                }
		                iconclass = opts.collapsed ? opts.collapsedIcon ? "ui-icon-" + opts.collapsedIcon : "" : opts.expandedIcon ? "ui-icon-" + opts.expandedIcon : "";
		                ui.status = $("<span class='ui-collapsible-heading-status'></span>");
		                ui.anchor = ui.heading.detach().addClass("ui-collapsible-heading").append(ui.status).wrapInner("<a href='#' class='ui-collapsible-heading-toggle'></a>").find("a").first().addClass("ui-btn " + (iconclass ? iconclass + " " : "") + (iconclass ? iconposClass(opts.iconpos) + " " : "") + this._themeClassFromOption("ui-btn-", opts.theme) + " " + (opts.mini ? "ui-mini " : ""));
		                ui.heading.insertBefore(ui.content);
		                this._handleExpandCollapse(this.options.collapsed);
		                return ui;
		            },
		            refresh: function() {
		                this._applyOptions(this.options);
		                this._renderedOptions = this._getOptions(this.options);
		            },
		            _applyOptions: function(options) {
		                var isCollapsed, newTheme, oldTheme, hasCorners, hasIcon, elem = this.element, currentOpts = this._renderedOptions, ui = this._ui, anchor = ui.anchor, status = ui.status, opts = this._getOptions(options);
		                if (options.collapsed !== undefined) {
		                    this._handleExpandCollapse(options.collapsed);
		                }
		                isCollapsed = elem.hasClass("ui-collapsible-collapsed");
		                if (isCollapsed) {
		                    if (opts.expandCueText !== undefined) {
		                        status.text(opts.expandCueText);
		                    }
		                } else {
		                    if (opts.collapseCueText !== undefined) {
		                        status.text(opts.collapseCueText);
		                    }
		                }
		                hasIcon = opts.collapsedIcon !== undefined ? opts.collapsedIcon !== false : currentOpts.collapsedIcon !== false;
		                if (!(opts.iconpos === undefined && opts.collapsedIcon === undefined && opts.expandedIcon === undefined)) {
		                    anchor.removeClass([ iconposClass(currentOpts.iconpos) ].concat(currentOpts.expandedIcon ? [ "ui-icon-" + currentOpts.expandedIcon ] : []).concat(currentOpts.collapsedIcon ? [ "ui-icon-" + currentOpts.collapsedIcon ] : []).join(" "));
		                    if (hasIcon) {
		                        anchor.addClass([ iconposClass(opts.iconpos !== undefined ? opts.iconpos : currentOpts.iconpos) ].concat(isCollapsed ? [ "ui-icon-" + (opts.collapsedIcon !== undefined ? opts.collapsedIcon : currentOpts.collapsedIcon) ] : [ "ui-icon-" + (opts.expandedIcon !== undefined ? opts.expandedIcon : currentOpts.expandedIcon) ]).join(" "));
		                    }
		                }
		                if (opts.theme !== undefined) {
		                    oldTheme = this._themeClassFromOption("ui-btn-", currentOpts.theme);
		                    newTheme = this._themeClassFromOption("ui-btn-", opts.theme);
		                    anchor.removeClass(oldTheme).addClass(newTheme);
		                }
		                if (opts.contentTheme !== undefined) {
		                    oldTheme = this._themeClassFromOption("ui-body-", currentOpts.contentTheme);
		                    newTheme = this._themeClassFromOption("ui-body-", opts.contentTheme);
		                    ui.content.removeClass(oldTheme).addClass(newTheme);
		                }
		                if (opts.inset !== undefined) {
		                    elem.toggleClass("ui-collapsible-inset", opts.inset);
		                    hasCorners = !!(opts.inset && (opts.corners || currentOpts.corners));
		                }
		                if (opts.corners !== undefined) {
		                    hasCorners = !!(opts.corners && (opts.inset || currentOpts.inset));
		                }
		                if (hasCorners !== undefined) {
		                    elem.toggleClass("ui-corner-all", hasCorners);
		                }
		                if (opts.mini !== undefined) {
		                    anchor.toggleClass("ui-mini", opts.mini);
		                }
		            },
		            _setOptions: function(options) {
		                this._applyOptions(options);
		                this._super(options);
		                this._renderedOptions = this._getOptions(this.options);
		            },
		            _handleExpandCollapse: function(isCollapse) {
		                var opts = this._renderedOptions, ui = this._ui;
		                ui.status.text(isCollapse ? opts.expandCueText : opts.collapseCueText);
		                ui.heading.toggleClass("ui-collapsible-heading-collapsed", isCollapse).find("a").first().toggleClass("ui-icon-" + opts.expandedIcon, !isCollapse).toggleClass("ui-icon-" + opts.collapsedIcon, isCollapse || opts.expandedIcon === opts.collapsedIcon).removeClass($.mobile.activeBtnClass);
		                this.element.toggleClass("ui-collapsible-collapsed", isCollapse);
		                ui.content.toggleClass("ui-collapsible-content-collapsed", isCollapse).attr("aria-hidden", isCollapse).trigger("updatelayout");
		                this.options.collapsed = isCollapse;
		                this._trigger(isCollapse ? "collapse" : "expand");
		            },
		            expand: function() {
		                this._handleExpandCollapse(false);
		            },
		            collapse: function() {
		                this._handleExpandCollapse(true);
		            },
		            _destroy: function() {
		                var ui = this._ui, opts = this.options;
		                if (opts.enhanced) {
		                    return;
		                }
		                if (ui.placeholder) {
		                    ui.originalHeading.insertBefore(ui.placeholder);
		                    ui.placeholder.remove();
		                    ui.heading.remove();
		                } else {
		                    ui.status.remove();
		                    ui.heading.removeClass("ui-collapsible-heading ui-collapsible-heading-collapsed").children().contents().unwrap();
		                }
		                ui.anchor.contents().unwrap();
		                ui.content.contents().unwrap();
		                this.element.removeClass("ui-collapsible ui-collapsible-collapsed " + "ui-collapsible-themed-content ui-collapsible-inset ui-corner-all");
		            }
		        });
		        $.mobile.collapsible.defaults = {
		            expandCueText: " click to expand contents",
		            collapseCueText: " click to collapse contents",
		            collapsedIcon: "plus",
		            contentTheme: "inherit",
		            expandedIcon: "minus",
		            iconpos: "left",
		            inset: true,
		            corners: true,
		            theme: "inherit",
		            mini: false
		        };
		    })(jQuery);
		    (function($, undefined) {
		        var uiScreenHiddenRegex = /\bui-screen-hidden\b/;
		        function noHiddenClass(elements) {
		            var index, length = elements.length, result = [];
		            for (index = 0; index < length; index++) {
		                if (!elements[index].className.match(uiScreenHiddenRegex)) {
		                    result.push(elements[index]);
		                }
		            }
		            return $(result);
		        }
		        $.mobile.behaviors.addFirstLastClasses = {
		            _getVisibles: function($els, create) {
		                var visibles;
		                if (create) {
		                    visibles = noHiddenClass($els);
		                } else {
		                    visibles = $els.filter(":visible");
		                    if (visibles.length === 0) {
		                        visibles = noHiddenClass($els);
		                    }
		                }
		                return visibles;
		            },
		            _addFirstLastClasses: function($els, $visibles, create) {
		                $els.removeClass("ui-first-child ui-last-child");
		                $visibles.eq(0).addClass("ui-first-child").end().last().addClass("ui-last-child");
		                if (!create) {
		                    this.element.trigger("updatelayout");
		                }
		            },
		            _removeFirstLastClasses: function($els) {
		                $els.removeClass("ui-first-child ui-last-child");
		            }
		        };
		    })(jQuery);
		    (function($, undefined) {
		        var childCollapsiblesSelector = ":mobile-collapsible, " + $.mobile.collapsible.initSelector;
		        $.widget("mobile.collapsibleset", $.extend({
		            initSelector: ":jqmData(role='collapsible-set'),:jqmData(role='collapsibleset')",
		            options: $.extend({
		                enhanced: false
		            }, $.mobile.collapsible.defaults),
		            _handleCollapsibleExpand: function(event) {
		                var closestCollapsible = $(event.target).closest(".ui-collapsible");
		                if (closestCollapsible.parent().is(":mobile-collapsibleset, :jqmData(role='collapsible-set')")) {
		                    closestCollapsible.siblings(".ui-collapsible:not(.ui-collapsible-collapsed)").collapsible("collapse");
		                }
		            },
		            _create: function() {
		                var elem = this.element, opts = this.options;
		                $.extend(this, {
		                    _classes: ""
		                });
		                if (!opts.enhanced) {
		                    elem.addClass("ui-collapsible-set " + this._themeClassFromOption("ui-group-theme-", opts.theme) + " " + (opts.corners && opts.inset ? "ui-corner-all " : ""));
		                    this.element.find($.mobile.collapsible.initSelector).collapsible();
		                }
		                this._on(elem, {
		                    collapsibleexpand: "_handleCollapsibleExpand"
		                });
		            },
		            _themeClassFromOption: function(prefix, value) {
		                return value ? value === "none" ? "" : prefix + value : "";
		            },
		            _init: function() {
		                this._refresh(true);
		                this.element.children(childCollapsiblesSelector).filter(":jqmData(collapsed='false')").collapsible("expand");
		            },
		            _setOptions: function(options) {
		                var ret, hasCorners, elem = this.element, themeClass = this._themeClassFromOption("ui-group-theme-", options.theme);
		                if (themeClass) {
		                    elem.removeClass(this._themeClassFromOption("ui-group-theme-", this.options.theme)).addClass(themeClass);
		                }
		                if (options.inset !== undefined) {
		                    hasCorners = !!(options.inset && (options.corners || this.options.corners));
		                }
		                if (options.corners !== undefined) {
		                    hasCorners = !!(options.corners && (options.inset || this.options.inset));
		                }
		                if (hasCorners !== undefined) {
		                    elem.toggleClass("ui-corner-all", hasCorners);
		                }
		                ret = this._super(options);
		                this.element.children(":mobile-collapsible").collapsible("refresh");
		                return ret;
		            },
		            _destroy: function() {
		                var el = this.element;
		                this._removeFirstLastClasses(el.children(childCollapsiblesSelector));
		                el.removeClass("ui-collapsible-set ui-corner-all " + this._themeClassFromOption("ui-group-theme-", this.options.theme)).children(":mobile-collapsible").collapsible("destroy");
		            },
		            _refresh: function(create) {
		                var collapsiblesInSet = this.element.children(childCollapsiblesSelector);
		                this.element.find($.mobile.collapsible.initSelector).not(".ui-collapsible").collapsible();
		                this._addFirstLastClasses(collapsiblesInSet, this._getVisibles(collapsiblesInSet, create), create);
		            },
		            refresh: function() {
		                this._refresh(false);
		            }
		        }, $.mobile.behaviors.addFirstLastClasses));
		    })(jQuery);
		    (function($, undefined) {
		        $.fn.fieldcontain = function() {
		            return this.addClass("ui-field-contain");
		        };
		    })(jQuery);
		    (function($, undefined) {
		        $.fn.grid = function(options) {
		            return this.each(function() {
		                var $this = $(this), o = $.extend({
		                    grid: null
		                }, options), $kids = $this.children(), gridCols = {
		                    solo: 1,
		                    a: 2,
		                    b: 3,
		                    c: 4,
		                    d: 5
		                }, grid = o.grid, iterator, letter;
		                if (!grid) {
		                    if ($kids.length <= 5) {
		                        for (letter in gridCols) {
		                            if (gridCols[letter] === $kids.length) {
		                                grid = letter;
		                            }
		                        }
		                    } else {
		                        grid = "a";
		                        $this.addClass("ui-grid-duo");
		                    }
		                }
		                iterator = gridCols[grid];
		                $this.addClass("ui-grid-" + grid);
		                $kids.filter(":nth-child(" + iterator + "n+1)").addClass("ui-block-a");
		                if (iterator > 1) {
		                    $kids.filter(":nth-child(" + iterator + "n+2)").addClass("ui-block-b");
		                }
		                if (iterator > 2) {
		                    $kids.filter(":nth-child(" + iterator + "n+3)").addClass("ui-block-c");
		                }
		                if (iterator > 3) {
		                    $kids.filter(":nth-child(" + iterator + "n+4)").addClass("ui-block-d");
		                }
		                if (iterator > 4) {
		                    $kids.filter(":nth-child(" + iterator + "n+5)").addClass("ui-block-e");
		                }
		            });
		        };
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.navbar", {
		            options: {
		                iconpos: "top",
		                grid: null
		            },
		            _create: function() {
		                var $navbar = this.element, $navbtns = $navbar.find("a, button"), iconpos = $navbtns.filter(":jqmData(icon)").length ? this.options.iconpos : undefined;
		                $navbar.addClass("ui-navbar").attr("role", "navigation").find("ul").jqmEnhanceable().grid({
		                    grid: this.options.grid
		                });
		                $navbtns.each(function() {
		                    var icon = $.mobile.getAttribute(this, "icon"), theme = $.mobile.getAttribute(this, "theme"), classes = "ui-btn";
		                    if (theme) {
		                        classes += " ui-btn-" + theme;
		                    }
		                    if (icon) {
		                        classes += " ui-icon-" + icon + " ui-btn-icon-" + iconpos;
		                    }
		                    $(this).addClass(classes);
		                });
		                $navbar.delegate("a", "vclick", function() {
		                    var activeBtn = $(this);
		                    if (!(activeBtn.hasClass("ui-state-disabled") || activeBtn.hasClass("ui-disabled") || activeBtn.hasClass($.mobile.activeBtnClass))) {
		                        $navbtns.removeClass($.mobile.activeBtnClass);
		                        activeBtn.addClass($.mobile.activeBtnClass);
		                        $(document).one("pagehide", function() {
		                            activeBtn.removeClass($.mobile.activeBtnClass);
		                        });
		                    }
		                });
		                $navbar.closest(".ui-page").bind("pagebeforeshow", function() {
		                    $navbtns.filter(".ui-state-persist").addClass($.mobile.activeBtnClass);
		                });
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        var getAttr = $.mobile.getAttribute;
		        $.widget("mobile.listview", $.extend({
		            options: {
		                theme: null,
		                countTheme: null,
		                dividerTheme: null,
		                icon: "carat-r",
		                splitIcon: "carat-r",
		                splitTheme: null,
		                corners: true,
		                shadow: true,
		                inset: false
		            },
		            _create: function() {
		                var t = this, listviewClasses = "";
		                listviewClasses += t.options.inset ? " ui-listview-inset" : "";
		                if (!!t.options.inset) {
		                    listviewClasses += t.options.corners ? " ui-corner-all" : "";
		                    listviewClasses += t.options.shadow ? " ui-shadow" : "";
		                }
		                t.element.addClass(" ui-listview" + listviewClasses);
		                t.refresh(true);
		            },
		            _findFirstElementByTagName: function(ele, nextProp, lcName, ucName) {
		                var dict = {};
		                dict[lcName] = dict[ucName] = true;
		                while (ele) {
		                    if (dict[ele.nodeName]) {
		                        return ele;
		                    }
		                    ele = ele[nextProp];
		                }
		                return null;
		            },
		            _addThumbClasses: function(containers) {
		                var i, img, len = containers.length;
		                for (i = 0; i < len; i++) {
		                    img = $(this._findFirstElementByTagName(containers[i].firstChild, "nextSibling", "img", "IMG"));
		                    if (img.length) {
		                        $(this._findFirstElementByTagName(img[0].parentNode, "parentNode", "li", "LI")).addClass(img.hasClass("ui-li-icon") ? "ui-li-has-icon" : "ui-li-has-thumb");
		                    }
		                }
		            },
		            _getChildrenByTagName: function(ele, lcName, ucName) {
		                var results = [], dict = {};
		                dict[lcName] = dict[ucName] = true;
		                ele = ele.firstChild;
		                while (ele) {
		                    if (dict[ele.nodeName]) {
		                        results.push(ele);
		                    }
		                    ele = ele.nextSibling;
		                }
		                return $(results);
		            },
		            _beforeListviewRefresh: $.noop,
		            _afterListviewRefresh: $.noop,
		            refresh: function(create) {
		                var buttonClass, pos, numli, item, itemClass, itemTheme, itemIcon, icon, a, isDivider, startCount, newStartCount, value, last, splittheme, splitThemeClass, spliticon, altButtonClass, dividerTheme, li, o = this.options, $list = this.element, ol = !!$.nodeName($list[0], "ol"), start = $list.attr("start"), itemClassDict = {}, countBubbles = $list.find(".ui-li-count"), countTheme = getAttr($list[0], "counttheme") || this.options.countTheme, countThemeClass = countTheme ? "ui-body-" + countTheme : "ui-body-inherit";
		                if (o.theme) {
		                    $list.addClass("ui-group-theme-" + o.theme);
		                }
		                if (ol && (start || start === 0)) {
		                    startCount = parseInt(start, 10) - 1;
		                    $list.css("counter-reset", "listnumbering " + startCount);
		                }
		                this._beforeListviewRefresh();
		                li = this._getChildrenByTagName($list[0], "li", "LI");
		                for (pos = 0, numli = li.length; pos < numli; pos++) {
		                    item = li.eq(pos);
		                    itemClass = "";
		                    if (create || item[0].className.search(/\bui-li-static\b|\bui-li-divider\b/) < 0) {
		                        a = this._getChildrenByTagName(item[0], "a", "A");
		                        isDivider = getAttr(item[0], "role") === "list-divider";
		                        value = item.attr("value");
		                        itemTheme = getAttr(item[0], "theme");
		                        if (a.length && a[0].className.search(/\bui-btn\b/) < 0 && !isDivider) {
		                            itemIcon = getAttr(item[0], "icon");
		                            icon = itemIcon === false ? false : itemIcon || o.icon;
		                            a.removeClass("ui-link");
		                            buttonClass = "ui-btn";
		                            if (itemTheme) {
		                                buttonClass += " ui-btn-" + itemTheme;
		                            }
		                            if (a.length > 1) {
		                                itemClass = "ui-li-has-alt";
		                                last = a.last();
		                                splittheme = getAttr(last[0], "theme") || o.splitTheme || getAttr(item[0], "theme", true);
		                                splitThemeClass = splittheme ? " ui-btn-" + splittheme : "";
		                                spliticon = getAttr(last[0], "icon") || getAttr(item[0], "icon") || o.splitIcon;
		                                altButtonClass = "ui-btn ui-btn-icon-notext ui-icon-" + spliticon + splitThemeClass;
		                                last.attr("title", $.trim(last.getEncodedText())).addClass(altButtonClass).empty();
		                                a = a.first();
		                            } else if (icon) {
		                                buttonClass += " ui-btn-icon-right ui-icon-" + icon;
		                            }
		                            a.addClass(buttonClass);
		                        } else if (isDivider) {
		                            dividerTheme = getAttr(item[0], "theme") || o.dividerTheme || o.theme;
		                            itemClass = "ui-li-divider ui-bar-" + (dividerTheme ? dividerTheme : "inherit");
		                            item.attr("role", "heading");
		                        } else if (a.length <= 0) {
		                            itemClass = "ui-li-static ui-body-" + (itemTheme ? itemTheme : "inherit");
		                        }
		                        if (ol && value) {
		                            newStartCount = parseInt(value, 10) - 1;
		                            item.css("counter-reset", "listnumbering " + newStartCount);
		                        }
		                    }
		                    if (!itemClassDict[itemClass]) {
		                        itemClassDict[itemClass] = [];
		                    }
		                    itemClassDict[itemClass].push(item[0]);
		                }
		                for (itemClass in itemClassDict) {
		                    $(itemClassDict[itemClass]).addClass(itemClass);
		                }
		                countBubbles.each(function() {
		                    $(this).closest("li").addClass("ui-li-has-count");
		                });
		                if (countThemeClass) {
		                    countBubbles.not("[class*='ui-body-']").addClass(countThemeClass);
		                }
		                this._addThumbClasses(li);
		                this._addThumbClasses(li.find(".ui-btn"));
		                this._afterListviewRefresh();
		                this._addFirstLastClasses(li, this._getVisibles(li, create), create);
		            }
		        }, $.mobile.behaviors.addFirstLastClasses));
		    })(jQuery);
		    (function($, undefined) {
		        function defaultAutodividersSelector(elt) {
		            var text = $.trim(elt.text()) || null;
		            if (!text) {
		                return null;
		            }
		            text = text.slice(0, 1).toUpperCase();
		            return text;
		        }
		        $.widget("mobile.listview", $.mobile.listview, {
		            options: {
		                autodividers: false,
		                autodividersSelector: defaultAutodividersSelector
		            },
		            _beforeListviewRefresh: function() {
		                if (this.options.autodividers) {
		                    this._replaceDividers();
		                    this._superApply(arguments);
		                }
		            },
		            _replaceDividers: function() {
		                var i, lis, li, dividerText, lastDividerText = null, list = this.element, divider;
		                list.children("li:jqmData(role='list-divider')").remove();
		                lis = list.children("li");
		                for (i = 0; i < lis.length; i++) {
		                    li = lis[i];
		                    dividerText = this.options.autodividersSelector($(li));
		                    if (dividerText && lastDividerText !== dividerText) {
		                        divider = document.createElement("li");
		                        divider.appendChild(document.createTextNode(dividerText));
		                        divider.setAttribute("data-" + $.mobile.ns + "role", "list-divider");
		                        li.parentNode.insertBefore(divider, li);
		                    }
		                    lastDividerText = dividerText;
		                }
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        var rdivider = /(^|\s)ui-li-divider($|\s)/, rhidden = /(^|\s)ui-screen-hidden($|\s)/;
		        $.widget("mobile.listview", $.mobile.listview, {
		            options: {
		                hideDividers: false
		            },
		            _afterListviewRefresh: function() {
		                var items, idx, item, hideDivider = true;
		                this._superApply(arguments);
		                if (this.options.hideDividers) {
		                    items = this._getChildrenByTagName(this.element[0], "li", "LI");
		                    for (idx = items.length - 1; idx > -1; idx--) {
		                        item = items[idx];
		                        if (item.className.match(rdivider)) {
		                            if (hideDivider) {
		                                item.className = item.className + " ui-screen-hidden";
		                            }
		                            hideDivider = true;
		                        } else {
		                            if (!item.className.match(rhidden)) {
		                                hideDivider = false;
		                            }
		                        }
		                    }
		                }
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.mobile.nojs = function(target) {
		            $(":jqmData(role='nojs')", target).addClass("ui-nojs");
		        };
		    })(jQuery);
		    (function($, undefined) {
		        $.mobile.behaviors.formReset = {
		            _handleFormReset: function() {
		                this._on(this.element.closest("form"), {
		                    reset: function() {
		                        this._delay("_reset");
		                    }
		                });
		            }
		        };
		    })(jQuery);
		    (function($, undefined) {
		        var escapeId = $.mobile.path.hashToSelector;
		        $.widget("mobile.checkboxradio", $.extend({
		            initSelector: "input:not( :jqmData(role='flipswitch' ) )[type='checkbox'],input[type='radio']:not( :jqmData(role='flipswitch' ))",
		            options: {
		                theme: "inherit",
		                mini: false,
		                wrapperClass: null,
		                enhanced: false,
		                iconpos: "left"
		            },
		            _create: function() {
		                var input = this.element, o = this.options, inheritAttr = function(input, dataAttr) {
		                    return input.jqmData(dataAttr) || input.closest("form, fieldset").jqmData(dataAttr);
		                }, label = this.options.enhanced ? {
		                    element: this.element.siblings("label"),
		                    isParent: false
		                } : this._findLabel(), inputtype = input[0].type, checkedClass = "ui-" + inputtype + "-on", uncheckedClass = "ui-" + inputtype + "-off";
		                if (inputtype !== "checkbox" && inputtype !== "radio") {
		                    return;
		                }
		                if (this.element[0].disabled) {
		                    this.options.disabled = true;
		                }
		                o.iconpos = inheritAttr(input, "iconpos") || label.element.attr("data-" + $.mobile.ns + "iconpos") || o.iconpos, 
		                o.mini = inheritAttr(input, "mini") || o.mini;
		                $.extend(this, {
		                    input: input,
		                    label: label.element,
		                    labelIsParent: label.isParent,
		                    inputtype: inputtype,
		                    checkedClass: checkedClass,
		                    uncheckedClass: uncheckedClass
		                });
		                if (!this.options.enhanced) {
		                    this._enhance();
		                }
		                this._on(label.element, {
		                    vmouseover: "_handleLabelVMouseOver",
		                    vclick: "_handleLabelVClick"
		                });
		                this._on(input, {
		                    vmousedown: "_cacheVals",
		                    vclick: "_handleInputVClick",
		                    focus: "_handleInputFocus",
		                    blur: "_handleInputBlur"
		                });
		                this._handleFormReset();
		                this.refresh();
		            },
		            _findLabel: function() {
		                var parentLabel, label, isParent, input = this.element, labelsList = input[0].labels;
		                if (labelsList && labelsList.length > 0) {
		                    label = $(labelsList[0]);
		                    isParent = $.contains(label[0], input[0]);
		                } else {
		                    parentLabel = input.closest("label");
		                    isParent = parentLabel.length > 0;
		                    label = isParent ? parentLabel : $(this.document[0].getElementsByTagName("label")).filter("[for='" + escapeId(input[0].id) + "']").first();
		                }
		                return {
		                    element: label,
		                    isParent: isParent
		                };
		            },
		            _enhance: function() {
		                this.label.addClass("ui-btn ui-corner-all");
		                if (this.labelIsParent) {
		                    this.input.add(this.label).wrapAll(this._wrapper());
		                } else {
		                    this.element.wrap(this._wrapper());
		                    this.element.parent().prepend(this.label);
		                }
		                this._setOptions({
		                    theme: this.options.theme,
		                    iconpos: this.options.iconpos,
		                    mini: this.options.mini
		                });
		            },
		            _wrapper: function() {
		                return $("<div class='" + (this.options.wrapperClass ? this.options.wrapperClass : "") + " ui-" + this.inputtype + (this.options.disabled ? " ui-state-disabled" : "") + "' ></div>");
		            },
		            _handleInputFocus: function() {
		                this.label.addClass($.mobile.focusClass);
		            },
		            _handleInputBlur: function() {
		                this.label.removeClass($.mobile.focusClass);
		            },
		            _handleInputVClick: function() {
		                this.element.prop("checked", this.element.is(":checked"));
		                this._getInputSet().not(this.element).prop("checked", false);
		                this._updateAll(true);
		            },
		            _handleLabelVMouseOver: function(event) {
		                if (this.label.parent().hasClass("ui-state-disabled")) {
		                    event.stopPropagation();
		                }
		            },
		            _handleLabelVClick: function(event) {
		                var input = this.element;
		                if (input.is(":disabled")) {
		                    event.preventDefault();
		                    return;
		                }
		                this._cacheVals();
		                input.prop("checked", this.inputtype === "radio" && true || !input.prop("checked"));
		                input.triggerHandler("click");
		                this._getInputSet().not(input).prop("checked", false);
		                this._updateAll();
		                return false;
		            },
		            _cacheVals: function() {
		                this._getInputSet().each(function() {
		                    $(this).attr("data-" + $.mobile.ns + "cacheVal", this.checked);
		                });
		            },
		            _getInputSet: function() {
		                var selector, formId, radio = this.element[0], name = radio.name, form = radio.form, doc = this.element.parents().last().get(0), radios = this.element;
		                if (name && this.inputtype === "radio" && doc) {
		                    selector = "input[type='radio'][name='" + escapeId(name) + "']";
		                    if (form) {
		                        formId = form.getAttribute("id");
		                        if (formId) {
		                            radios = $(selector + "[form='" + escapeId(formId) + "']", doc);
		                        }
		                        radios = $(form).find(selector).filter(function() {
		                            return this.form === form;
		                        }).add(radios);
		                    } else {
		                        radios = $(selector, doc).filter(function() {
		                            return !this.form;
		                        });
		                    }
		                }
		                return radios;
		            },
		            _updateAll: function(changeTriggered) {
		                var self = this;
		                this._getInputSet().each(function() {
		                    var $this = $(this);
		                    if ((this.checked || self.inputtype === "checkbox") && !changeTriggered) {
		                        $this.trigger("change");
		                    }
		                }).checkboxradio("refresh");
		            },
		            _reset: function() {
		                this.refresh();
		            },
		            _hasIcon: function() {
		                var controlgroup, controlgroupWidget, controlgroupConstructor = $.mobile.controlgroup;
		                if (controlgroupConstructor) {
		                    controlgroup = this.element.closest(":mobile-controlgroup," + controlgroupConstructor.prototype.initSelector);
		                    if (controlgroup.length > 0) {
		                        controlgroupWidget = $.data(controlgroup[0], "mobile-controlgroup");
		                        return (controlgroupWidget ? controlgroupWidget.options.type : controlgroup.attr("data-" + $.mobile.ns + "type")) !== "horizontal";
		                    }
		                }
		                return true;
		            },
		            refresh: function() {
		                var isChecked = this.element[0].checked, active = $.mobile.activeBtnClass, iconposClass = "ui-btn-icon-" + this.options.iconpos, addClasses = [], removeClasses = [];
		                if (this._hasIcon()) {
		                    removeClasses.push(active);
		                    addClasses.push(iconposClass);
		                } else {
		                    removeClasses.push(iconposClass);
		                    (isChecked ? addClasses : removeClasses).push(active);
		                }
		                if (isChecked) {
		                    addClasses.push(this.checkedClass);
		                    removeClasses.push(this.uncheckedClass);
		                } else {
		                    addClasses.push(this.uncheckedClass);
		                    removeClasses.push(this.checkedClass);
		                }
		                this.widget().toggleClass("ui-state-disabled", this.element.prop("disabled"));
		                this.label.addClass(addClasses.join(" ")).removeClass(removeClasses.join(" "));
		            },
		            widget: function() {
		                return this.label.parent();
		            },
		            _setOptions: function(options) {
		                var label = this.label, currentOptions = this.options, outer = this.widget(), hasIcon = this._hasIcon();
		                if (options.disabled !== undefined) {
		                    this.input.prop("disabled", !!options.disabled);
		                    outer.toggleClass("ui-state-disabled", !!options.disabled);
		                }
		                if (options.mini !== undefined) {
		                    outer.toggleClass("ui-mini", !!options.mini);
		                }
		                if (options.theme !== undefined) {
		                    label.removeClass("ui-btn-" + currentOptions.theme).addClass("ui-btn-" + options.theme);
		                }
		                if (options.wrapperClass !== undefined) {
		                    outer.removeClass(currentOptions.wrapperClass).addClass(options.wrapperClass);
		                }
		                if (options.iconpos !== undefined && hasIcon) {
		                    label.removeClass("ui-btn-icon-" + currentOptions.iconpos).addClass("ui-btn-icon-" + options.iconpos);
		                } else if (!hasIcon) {
		                    label.removeClass("ui-btn-icon-" + currentOptions.iconpos);
		                }
		                this._super(options);
		            }
		        }, $.mobile.behaviors.formReset));
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.button", {
		            initSelector: "input[type='button'], input[type='submit'], input[type='reset']",
		            options: {
		                theme: null,
		                icon: null,
		                iconpos: "left",
		                iconshadow: false,
		                corners: true,
		                shadow: true,
		                inline: null,
		                mini: null,
		                wrapperClass: null,
		                enhanced: false
		            },
		            _create: function() {
		                if (this.element.is(":disabled")) {
		                    this.options.disabled = true;
		                }
		                if (!this.options.enhanced) {
		                    this._enhance();
		                }
		                $.extend(this, {
		                    wrapper: this.element.parent()
		                });
		                this._on({
		                    focus: function() {
		                        this.widget().addClass($.mobile.focusClass);
		                    },
		                    blur: function() {
		                        this.widget().removeClass($.mobile.focusClass);
		                    }
		                });
		                this.refresh(true);
		            },
		            _enhance: function() {
		                this.element.wrap(this._button());
		            },
		            _button: function() {
		                var options = this.options, iconClasses = this._getIconClasses(this.options);
		                return $("<div class='ui-btn ui-input-btn" + (options.wrapperClass ? " " + options.wrapperClass : "") + (options.theme ? " ui-btn-" + options.theme : "") + (options.corners ? " ui-corner-all" : "") + (options.shadow ? " ui-shadow" : "") + (options.inline ? " ui-btn-inline" : "") + (options.mini ? " ui-mini" : "") + (options.disabled ? " ui-state-disabled" : "") + (iconClasses ? " " + iconClasses : "") + "' >" + this.element.val() + "</div>");
		            },
		            widget: function() {
		                return this.wrapper;
		            },
		            _destroy: function() {
		                this.element.insertBefore(this.wrapper);
		                this.wrapper.remove();
		            },
		            _getIconClasses: function(options) {
		                return options.icon ? "ui-icon-" + options.icon + (options.iconshadow ? " ui-shadow-icon" : "") + " ui-btn-icon-" + options.iconpos : "";
		            },
		            _setOptions: function(options) {
		                var outer = this.widget();
		                if (options.theme !== undefined) {
		                    outer.removeClass(this.options.theme).addClass("ui-btn-" + options.theme);
		                }
		                if (options.corners !== undefined) {
		                    outer.toggleClass("ui-corner-all", options.corners);
		                }
		                if (options.shadow !== undefined) {
		                    outer.toggleClass("ui-shadow", options.shadow);
		                }
		                if (options.inline !== undefined) {
		                    outer.toggleClass("ui-btn-inline", options.inline);
		                }
		                if (options.mini !== undefined) {
		                    outer.toggleClass("ui-mini", options.mini);
		                }
		                if (options.disabled !== undefined) {
		                    this.element.prop("disabled", options.disabled);
		                    outer.toggleClass("ui-state-disabled", options.disabled);
		                }
		                if (options.icon !== undefined || options.iconshadow !== undefined || options.iconpos !== undefined) {
		                    outer.removeClass(this._getIconClasses(this.options)).addClass(this._getIconClasses($.extend({}, this.options, options)));
		                }
		                this._super(options);
		            },
		            refresh: function(create) {
		                var originalElement, isDisabled = this.element.prop("disabled");
		                if (this.options.icon && this.options.iconpos === "notext" && this.element.attr("title")) {
		                    this.element.attr("title", this.element.val());
		                }
		                if (!create) {
		                    originalElement = this.element.detach();
		                    $(this.wrapper).text(this.element.val()).append(originalElement);
		                }
		                if (this.options.disabled !== isDisabled) {
		                    this._setOptions({
		                        disabled: isDisabled
		                    });
		                }
		            }
		        });
		    })(jQuery);
		    (function($) {
		        var meta = $("meta[name=viewport]"), initialContent = meta.attr("content"), disabledZoom = initialContent + ",maximum-scale=1, user-scalable=no", enabledZoom = initialContent + ",maximum-scale=10, user-scalable=yes", disabledInitially = /(user-scalable[\s]*=[\s]*no)|(maximum-scale[\s]*=[\s]*1)[$,\s]/.test(initialContent);
		        $.mobile.zoom = $.extend({}, {
		            enabled: !disabledInitially,
		            locked: false,
		            disable: function(lock) {
		                if (!disabledInitially && !$.mobile.zoom.locked) {
		                    meta.attr("content", disabledZoom);
		                    $.mobile.zoom.enabled = false;
		                    $.mobile.zoom.locked = lock || false;
		                }
		            },
		            enable: function(unlock) {
		                if (!disabledInitially && (!$.mobile.zoom.locked || unlock === true)) {
		                    meta.attr("content", enabledZoom);
		                    $.mobile.zoom.enabled = true;
		                    $.mobile.zoom.locked = false;
		                }
		            },
		            restore: function() {
		                if (!disabledInitially) {
		                    meta.attr("content", initialContent);
		                    $.mobile.zoom.enabled = true;
		                }
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.textinput", {
		            initSelector: "input[type='text']," + "input[type='search']," + ":jqmData(type='search')," + "input[type='number']," + ":jqmData(type='number')," + "input[type='password']," + "input[type='email']," + "input[type='url']," + "input[type='tel']," + "textarea," + "input[type='time']," + "input[type='date']," + "input[type='month']," + "input[type='week']," + "input[type='datetime']," + "input[type='datetime-local']," + "input[type='color']," + "input:not([type])," + "input[type='file']",
		            options: {
		                theme: null,
		                corners: true,
		                mini: false,
		                preventFocusZoom: /iPhone|iPad|iPod/.test(navigator.platform) && navigator.userAgent.indexOf("AppleWebKit") > -1,
		                wrapperClass: "",
		                enhanced: false
		            },
		            _create: function() {
		                var options = this.options, isSearch = this.element.is("[type='search'], :jqmData(type='search')"), isTextarea = this.element[0].tagName === "TEXTAREA", isRange = this.element.is("[data-" + ($.mobile.ns || "") + "type='range']"), inputNeedsWrap = (this.element.is("input") || this.element.is("[data-" + ($.mobile.ns || "") + "type='search']")) && !isRange;
		                if (this.element.prop("disabled")) {
		                    options.disabled = true;
		                }
		                $.extend(this, {
		                    classes: this._classesFromOptions(),
		                    isSearch: isSearch,
		                    isTextarea: isTextarea,
		                    isRange: isRange,
		                    inputNeedsWrap: inputNeedsWrap
		                });
		                this._autoCorrect();
		                if (!options.enhanced) {
		                    this._enhance();
		                }
		                this._on({
		                    focus: "_handleFocus",
		                    blur: "_handleBlur"
		                });
		            },
		            refresh: function() {
		                this.setOptions({
		                    disabled: this.element.is(":disabled")
		                });
		            },
		            _enhance: function() {
		                var elementClasses = [];
		                if (this.isTextarea) {
		                    elementClasses.push("ui-input-text");
		                }
		                if (this.isTextarea || this.isRange) {
		                    elementClasses.push("ui-shadow-inset");
		                }
		                if (this.inputNeedsWrap) {
		                    this.element.wrap(this._wrap());
		                } else {
		                    elementClasses = elementClasses.concat(this.classes);
		                }
		                this.element.addClass(elementClasses.join(" "));
		            },
		            widget: function() {
		                return this.inputNeedsWrap ? this.element.parent() : this.element;
		            },
		            _classesFromOptions: function() {
		                var options = this.options, classes = [];
		                classes.push("ui-body-" + (options.theme === null ? "inherit" : options.theme));
		                if (options.corners) {
		                    classes.push("ui-corner-all");
		                }
		                if (options.mini) {
		                    classes.push("ui-mini");
		                }
		                if (options.disabled) {
		                    classes.push("ui-state-disabled");
		                }
		                if (options.wrapperClass) {
		                    classes.push(options.wrapperClass);
		                }
		                return classes;
		            },
		            _wrap: function() {
		                return $("<div class='" + (this.isSearch ? "ui-input-search " : "ui-input-text ") + this.classes.join(" ") + " " + "ui-shadow-inset'></div>");
		            },
		            _autoCorrect: function() {
		                if (typeof this.element[0].autocorrect !== "undefined" && !$.support.touchOverflow) {
		                    this.element[0].setAttribute("autocorrect", "off");
		                    this.element[0].setAttribute("autocomplete", "off");
		                }
		            },
		            _handleBlur: function() {
		                this.widget().removeClass($.mobile.focusClass);
		                if (this.options.preventFocusZoom) {
		                    $.mobile.zoom.enable(true);
		                }
		            },
		            _handleFocus: function() {
		                if (this.options.preventFocusZoom) {
		                    $.mobile.zoom.disable(true);
		                }
		                this.widget().addClass($.mobile.focusClass);
		            },
		            _setOptions: function(options) {
		                var outer = this.widget();
		                this._super(options);
		                if (!(options.disabled === undefined && options.mini === undefined && options.corners === undefined && options.theme === undefined && options.wrapperClass === undefined)) {
		                    outer.removeClass(this.classes.join(" "));
		                    this.classes = this._classesFromOptions();
		                    outer.addClass(this.classes.join(" "));
		                }
		                if (options.disabled !== undefined) {
		                    this.element.prop("disabled", !!options.disabled);
		                }
		            },
		            _destroy: function() {
		                if (this.options.enhanced) {
		                    return;
		                }
		                if (this.inputNeedsWrap) {
		                    this.element.unwrap();
		                }
		                this.element.removeClass("ui-input-text " + this.classes.join(" "));
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.slider", $.extend({
		            initSelector: "input[type='range'], :jqmData(type='range'), :jqmData(role='slider')",
		            widgetEventPrefix: "slide",
		            options: {
		                theme: null,
		                trackTheme: null,
		                corners: true,
		                mini: false,
		                highlight: false
		            },
		            _create: function() {
		                var self = this, control = this.element, trackTheme = this.options.trackTheme || $.mobile.getAttribute(control[0], "theme"), trackThemeClass = trackTheme ? " ui-bar-" + trackTheme : " ui-bar-inherit", cornerClass = this.options.corners || control.jqmData("corners") ? " ui-corner-all" : "", miniClass = this.options.mini || control.jqmData("mini") ? " ui-mini" : "", cType = control[0].nodeName.toLowerCase(), isToggleSwitch = cType === "select", isRangeslider = control.parent().is(":jqmData(role='rangeslider')"), selectClass = isToggleSwitch ? "ui-slider-switch" : "", controlID = control.attr("id"), $label = $("[for='" + controlID + "']"), labelID = $label.attr("id") || controlID + "-label", min = !isToggleSwitch ? parseFloat(control.attr("min")) : 0, max = !isToggleSwitch ? parseFloat(control.attr("max")) : control.find("option").length - 1, step = window.parseFloat(control.attr("step") || 1), domHandle = document.createElement("a"), handle = $(domHandle), domSlider = document.createElement("div"), slider = $(domSlider), valuebg = this.options.highlight && !isToggleSwitch ? function() {
		                    var bg = document.createElement("div");
		                    bg.className = "ui-slider-bg " + $.mobile.activeBtnClass;
		                    return $(bg).prependTo(slider);
		                }() : false, options, wrapper, j, length, i, optionsCount, origTabIndex, side, activeClass, sliderImg;
		                $label.attr("id", labelID);
		                this.isToggleSwitch = isToggleSwitch;
		                domHandle.setAttribute("href", "#");
		                domSlider.setAttribute("role", "application");
		                domSlider.className = [ this.isToggleSwitch ? "ui-slider ui-slider-track ui-shadow-inset " : "ui-slider-track ui-shadow-inset ", selectClass, trackThemeClass, cornerClass, miniClass ].join("");
		                domHandle.className = "ui-slider-handle";
		                domSlider.appendChild(domHandle);
		                handle.attr({
		                    role: "slider",
		                    "aria-valuemin": min,
		                    "aria-valuemax": max,
		                    "aria-valuenow": this._value(),
		                    "aria-valuetext": this._value(),
		                    title: this._value(),
		                    "aria-labelledby": labelID
		                });
		                $.extend(this, {
		                    slider: slider,
		                    handle: handle,
		                    control: control,
		                    type: cType,
		                    step: step,
		                    max: max,
		                    min: min,
		                    valuebg: valuebg,
		                    isRangeslider: isRangeslider,
		                    dragging: false,
		                    beforeStart: null,
		                    userModified: false,
		                    mouseMoved: false
		                });
		                if (isToggleSwitch) {
		                    origTabIndex = control.attr("tabindex");
		                    if (origTabIndex) {
		                        handle.attr("tabindex", origTabIndex);
		                    }
		                    control.attr("tabindex", "-1").focus(function() {
		                        $(this).blur();
		                        handle.focus();
		                    });
		                    wrapper = document.createElement("div");
		                    wrapper.className = "ui-slider-inneroffset";
		                    for (j = 0, length = domSlider.childNodes.length; j < length; j++) {
		                        wrapper.appendChild(domSlider.childNodes[j]);
		                    }
		                    domSlider.appendChild(wrapper);
		                    handle.addClass("ui-slider-handle-snapping");
		                    options = control.find("option");
		                    for (i = 0, optionsCount = options.length; i < optionsCount; i++) {
		                        side = !i ? "b" : "a";
		                        activeClass = !i ? "" : " " + $.mobile.activeBtnClass;
		                        sliderImg = document.createElement("span");
		                        sliderImg.className = [ "ui-slider-label ui-slider-label-", side, activeClass ].join("");
		                        sliderImg.setAttribute("role", "img");
		                        sliderImg.appendChild(document.createTextNode(options[i].innerHTML));
		                        $(sliderImg).prependTo(slider);
		                    }
		                    self._labels = $(".ui-slider-label", slider);
		                }
		                control.addClass(isToggleSwitch ? "ui-slider-switch" : "ui-slider-input");
		                this._on(control, {
		                    change: "_controlChange",
		                    keyup: "_controlKeyup",
		                    blur: "_controlBlur",
		                    vmouseup: "_controlVMouseUp"
		                });
		                slider.bind("vmousedown", $.proxy(this._sliderVMouseDown, this)).bind("vclick", false);
		                this._on(document, {
		                    vmousemove: "_preventDocumentDrag"
		                });
		                this._on(slider.add(document), {
		                    vmouseup: "_sliderVMouseUp"
		                });
		                slider.insertAfter(control);
		                if (!isToggleSwitch && !isRangeslider) {
		                    wrapper = this.options.mini ? "<div class='ui-slider ui-mini'>" : "<div class='ui-slider'>";
		                    control.add(slider).wrapAll(wrapper);
		                }
		                this._on(this.handle, {
		                    vmousedown: "_handleVMouseDown",
		                    keydown: "_handleKeydown",
		                    keyup: "_handleKeyup"
		                });
		                this.handle.bind("vclick", false);
		                this._handleFormReset();
		                this.refresh(undefined, undefined, true);
		            },
		            _setOptions: function(options) {
		                if (options.theme !== undefined) {
		                    this._setTheme(options.theme);
		                }
		                if (options.trackTheme !== undefined) {
		                    this._setTrackTheme(options.trackTheme);
		                }
		                if (options.corners !== undefined) {
		                    this._setCorners(options.corners);
		                }
		                if (options.mini !== undefined) {
		                    this._setMini(options.mini);
		                }
		                if (options.highlight !== undefined) {
		                    this._setHighlight(options.highlight);
		                }
		                if (options.disabled !== undefined) {
		                    this._setDisabled(options.disabled);
		                }
		                this._super(options);
		            },
		            _controlChange: function(event) {
		                if (this._trigger("controlchange", event) === false) {
		                    return false;
		                }
		                if (!this.mouseMoved) {
		                    this.refresh(this._value(), true);
		                }
		            },
		            _controlKeyup: function() {
		                this.refresh(this._value(), true, true);
		            },
		            _controlBlur: function() {
		                this.refresh(this._value(), true);
		            },
		            _controlVMouseUp: function() {
		                this._checkedRefresh();
		            },
		            _handleVMouseDown: function() {
		                this.handle.focus();
		            },
		            _handleKeydown: function(event) {
		                var index = this._value();
		                if (this.options.disabled) {
		                    return;
		                }
		                switch (event.keyCode) {
		                  case $.mobile.keyCode.HOME:
		                  case $.mobile.keyCode.END:
		                  case $.mobile.keyCode.PAGE_UP:
		                  case $.mobile.keyCode.PAGE_DOWN:
		                  case $.mobile.keyCode.UP:
		                  case $.mobile.keyCode.RIGHT:
		                  case $.mobile.keyCode.DOWN:
		                  case $.mobile.keyCode.LEFT:
		                    event.preventDefault();
		                    if (!this._keySliding) {
		                        this._keySliding = true;
		                        this.handle.addClass("ui-state-active");
		                    }
		                    break;
		                }
		                switch (event.keyCode) {
		                  case $.mobile.keyCode.HOME:
		                    this.refresh(this.min);
		                    break;

		                  case $.mobile.keyCode.END:
		                    this.refresh(this.max);
		                    break;

		                  case $.mobile.keyCode.PAGE_UP:
		                  case $.mobile.keyCode.UP:
		                  case $.mobile.keyCode.RIGHT:
		                    this.refresh(index + this.step);
		                    break;

		                  case $.mobile.keyCode.PAGE_DOWN:
		                  case $.mobile.keyCode.DOWN:
		                  case $.mobile.keyCode.LEFT:
		                    this.refresh(index - this.step);
		                    break;
		                }
		            },
		            _handleKeyup: function() {
		                if (this._keySliding) {
		                    this._keySliding = false;
		                    this.handle.removeClass("ui-state-active");
		                }
		            },
		            _sliderVMouseDown: function(event) {
		                if (this.options.disabled || !(event.which === 1 || event.which === 0 || event.which === undefined)) {
		                    return false;
		                }
		                if (this._trigger("beforestart", event) === false) {
		                    return false;
		                }
		                this.dragging = true;
		                this.userModified = false;
		                this.mouseMoved = false;
		                if (this.isToggleSwitch) {
		                    this.beforeStart = this.element[0].selectedIndex;
		                }
		                this.refresh(event);
		                this._trigger("start");
		                return false;
		            },
		            _sliderVMouseUp: function() {
		                if (this.dragging) {
		                    this.dragging = false;
		                    if (this.isToggleSwitch) {
		                        this.handle.addClass("ui-slider-handle-snapping");
		                        if (this.mouseMoved) {
		                            if (this.userModified) {
		                                this.refresh(this.beforeStart === 0 ? 1 : 0);
		                            } else {
		                                this.refresh(this.beforeStart);
		                            }
		                        } else {
		                            this.refresh(this.beforeStart === 0 ? 1 : 0);
		                        }
		                    }
		                    this.mouseMoved = false;
		                    this._trigger("stop");
		                    return false;
		                }
		            },
		            _preventDocumentDrag: function(event) {
		                if (this._trigger("drag", event) === false) {
		                    return false;
		                }
		                if (this.dragging && !this.options.disabled) {
		                    this.mouseMoved = true;
		                    if (this.isToggleSwitch) {
		                        this.handle.removeClass("ui-slider-handle-snapping");
		                    }
		                    this.refresh(event);
		                    this.userModified = this.beforeStart !== this.element[0].selectedIndex;
		                    return false;
		                }
		            },
		            _checkedRefresh: function() {
		                if (this.value !== this._value()) {
		                    this.refresh(this._value());
		                }
		            },
		            _value: function() {
		                return this.isToggleSwitch ? this.element[0].selectedIndex : parseFloat(this.element.val());
		            },
		            _reset: function() {
		                this.refresh(undefined, false, true);
		            },
		            refresh: function(val, isfromControl, preventInputUpdate) {
		                var self = this, parentTheme = $.mobile.getAttribute(this.element[0], "theme"), theme = this.options.theme || parentTheme, themeClass = theme ? " ui-btn-" + theme : "", trackTheme = this.options.trackTheme || parentTheme, trackThemeClass = trackTheme ? " ui-bar-" + trackTheme : " ui-bar-inherit", cornerClass = this.options.corners ? " ui-corner-all" : "", miniClass = this.options.mini ? " ui-mini" : "", left, width, data, tol, pxStep, percent, control, isInput, optionElements, min, max, step, newval, valModStep, alignValue, percentPerStep, handlePercent, aPercent, bPercent, valueChanged;
		                self.slider[0].className = [ this.isToggleSwitch ? "ui-slider ui-slider-switch ui-slider-track ui-shadow-inset" : "ui-slider-track ui-shadow-inset", trackThemeClass, cornerClass, miniClass ].join("");
		                if (this.options.disabled || this.element.prop("disabled")) {
		                    this.disable();
		                }
		                this.value = this._value();
		                if (this.options.highlight && !this.isToggleSwitch && this.slider.find(".ui-slider-bg").length === 0) {
		                    this.valuebg = function() {
		                        var bg = document.createElement("div");
		                        bg.className = "ui-slider-bg " + $.mobile.activeBtnClass;
		                        return $(bg).prependTo(self.slider);
		                    }();
		                }
		                this.handle.addClass("ui-btn" + themeClass + " ui-shadow");
		                control = this.element;
		                isInput = !this.isToggleSwitch;
		                optionElements = isInput ? [] : control.find("option");
		                min = isInput ? parseFloat(control.attr("min")) : 0;
		                max = isInput ? parseFloat(control.attr("max")) : optionElements.length - 1;
		                step = isInput && parseFloat(control.attr("step")) > 0 ? parseFloat(control.attr("step")) : 1;
		                if (typeof val === "object") {
		                    data = val;
		                    tol = 8;
		                    left = this.slider.offset().left;
		                    width = this.slider.width();
		                    pxStep = width / ((max - min) / step);
		                    if (!this.dragging || data.pageX < left - tol || data.pageX > left + width + tol) {
		                        return;
		                    }
		                    if (pxStep > 1) {
		                        percent = (data.pageX - left) / width * 100;
		                    } else {
		                        percent = Math.round((data.pageX - left) / width * 100);
		                    }
		                } else {
		                    if (val == null) {
		                        val = isInput ? parseFloat(control.val() || 0) : control[0].selectedIndex;
		                    }
		                    percent = (parseFloat(val) - min) / (max - min) * 100;
		                }
		                if (isNaN(percent)) {
		                    return;
		                }
		                newval = percent / 100 * (max - min) + min;
		                valModStep = (newval - min) % step;
		                alignValue = newval - valModStep;
		                if (Math.abs(valModStep) * 2 >= step) {
		                    alignValue += valModStep > 0 ? step : -step;
		                }
		                percentPerStep = 100 / ((max - min) / step);
		                newval = parseFloat(alignValue.toFixed(5));
		                if (typeof pxStep === "undefined") {
		                    pxStep = width / ((max - min) / step);
		                }
		                if (pxStep > 1 && isInput) {
		                    percent = (newval - min) * percentPerStep * (1 / step);
		                }
		                if (percent < 0) {
		                    percent = 0;
		                }
		                if (percent > 100) {
		                    percent = 100;
		                }
		                if (newval < min) {
		                    newval = min;
		                }
		                if (newval > max) {
		                    newval = max;
		                }
		                this.handle.css("left", percent + "%");
		                this.handle[0].setAttribute("aria-valuenow", isInput ? newval : optionElements.eq(newval).attr("value"));
		                this.handle[0].setAttribute("aria-valuetext", isInput ? newval : optionElements.eq(newval).getEncodedText());
		                this.handle[0].setAttribute("title", isInput ? newval : optionElements.eq(newval).getEncodedText());
		                if (this.valuebg) {
		                    this.valuebg.css("width", percent + "%");
		                }
		                if (this._labels) {
		                    handlePercent = this.handle.width() / this.slider.width() * 100;
		                    aPercent = percent && handlePercent + (100 - handlePercent) * percent / 100;
		                    bPercent = percent === 100 ? 0 : Math.min(handlePercent + 100 - aPercent, 100);
		                    this._labels.each(function() {
		                        var ab = $(this).hasClass("ui-slider-label-a");
		                        $(this).width((ab ? aPercent : bPercent) + "%");
		                    });
		                }
		                if (!preventInputUpdate) {
		                    valueChanged = false;
		                    if (isInput) {
		                        valueChanged = parseFloat(control.val()) !== newval;
		                        control.val(newval);
		                    } else {
		                        valueChanged = control[0].selectedIndex !== newval;
		                        control[0].selectedIndex = newval;
		                    }
		                    if (this._trigger("beforechange", val) === false) {
		                        return false;
		                    }
		                    if (!isfromControl && valueChanged) {
		                        control.trigger("change");
		                    }
		                }
		            },
		            _setHighlight: function(value) {
		                value = !!value;
		                if (value) {
		                    this.options.highlight = !!value;
		                    this.refresh();
		                } else if (this.valuebg) {
		                    this.valuebg.remove();
		                    this.valuebg = false;
		                }
		            },
		            _setTheme: function(value) {
		                this.handle.removeClass("ui-btn-" + this.options.theme).addClass("ui-btn-" + value);
		                var currentTheme = this.options.theme ? this.options.theme : "inherit", newTheme = value ? value : "inherit";
		                this.control.removeClass("ui-body-" + currentTheme).addClass("ui-body-" + newTheme);
		            },
		            _setTrackTheme: function(value) {
		                var currentTrackTheme = this.options.trackTheme ? this.options.trackTheme : "inherit", newTrackTheme = value ? value : "inherit";
		                this.slider.removeClass("ui-body-" + currentTrackTheme).addClass("ui-body-" + newTrackTheme);
		            },
		            _setMini: function(value) {
		                value = !!value;
		                if (!this.isToggleSwitch && !this.isRangeslider) {
		                    this.slider.parent().toggleClass("ui-mini", value);
		                    this.element.toggleClass("ui-mini", value);
		                }
		                this.slider.toggleClass("ui-mini", value);
		            },
		            _setCorners: function(value) {
		                this.slider.toggleClass("ui-corner-all", value);
		                if (!this.isToggleSwitch) {
		                    this.control.toggleClass("ui-corner-all", value);
		                }
		            },
		            _setDisabled: function(value) {
		                value = !!value;
		                this.element.prop("disabled", value);
		                this.slider.toggleClass("ui-state-disabled", value).attr("aria-disabled", value);
		                this.element.toggleClass("ui-state-disabled", value);
		            }
		        }, $.mobile.behaviors.formReset));
		    })(jQuery);
		    (function($, undefined) {
		        var popup;
		        function getPopup() {
		            if (!popup) {
		                popup = $("<div></div>", {
		                    class: "ui-slider-popup ui-shadow ui-corner-all"
		                });
		            }
		            return popup.clone();
		        }
		        $.widget("mobile.slider", $.mobile.slider, {
		            options: {
		                popupEnabled: false,
		                showValue: false
		            },
		            _create: function() {
		                this._super();
		                $.extend(this, {
		                    _currentValue: null,
		                    _popup: null,
		                    _popupVisible: false
		                });
		                this._setOption("popupEnabled", this.options.popupEnabled);
		                this._on(this.handle, {
		                    vmousedown: "_showPopup"
		                });
		                this._on(this.slider.add(this.document), {
		                    vmouseup: "_hidePopup"
		                });
		                this._refresh();
		            },
		            _positionPopup: function() {
		                var dstOffset = this.handle.offset();
		                this._popup.offset({
		                    left: dstOffset.left + (this.handle.width() - this._popup.width()) / 2,
		                    top: dstOffset.top - this._popup.outerHeight() - 5
		                });
		            },
		            _setOption: function(key, value) {
		                this._super(key, value);
		                if (key === "showValue") {
		                    this.handle.html(value && !this.options.mini ? this._value() : "");
		                } else if (key === "popupEnabled") {
		                    if (value && !this._popup) {
		                        this._popup = getPopup().addClass("ui-body-" + (this.options.theme || "a")).hide().insertBefore(this.element);
		                    }
		                }
		            },
		            refresh: function() {
		                this._super.apply(this, arguments);
		                this._refresh();
		            },
		            _refresh: function() {
		                var o = this.options, newValue;
		                if (o.popupEnabled) {
		                    this.handle.removeAttr("title");
		                }
		                newValue = this._value();
		                if (newValue === this._currentValue) {
		                    return;
		                }
		                this._currentValue = newValue;
		                if (o.popupEnabled && this._popup) {
		                    this._positionPopup();
		                    this._popup.html(newValue);
		                }
		                if (o.showValue && !this.options.mini) {
		                    this.handle.html(newValue);
		                }
		            },
		            _showPopup: function() {
		                if (this.options.popupEnabled && !this._popupVisible) {
		                    this.handle.html("");
		                    this._popup.show();
		                    this._positionPopup();
		                    this._popupVisible = true;
		                }
		            },
		            _hidePopup: function() {
		                var o = this.options;
		                if (o.popupEnabled && this._popupVisible) {
		                    if (o.showValue && !o.mini) {
		                        this.handle.html(this._value());
		                    }
		                    this._popup.hide();
		                    this._popupVisible = false;
		                }
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.flipswitch", $.extend({
		            options: {
		                onText: "On",
		                offText: "Off",
		                theme: null,
		                enhanced: false,
		                wrapperClass: null,
		                corners: true,
		                mini: false
		            },
		            _create: function() {
		                if (!this.options.enhanced) {
		                    this._enhance();
		                } else {
		                    $.extend(this, {
		                        flipswitch: this.element.parent(),
		                        on: this.element.find(".ui-flipswitch-on").eq(0),
		                        off: this.element.find(".ui-flipswitch-off").eq(0),
		                        type: this.element.get(0).tagName
		                    });
		                }
		                this._handleFormReset();
		                this._originalTabIndex = this.element.attr("tabindex");
		                if (this._originalTabIndex != null) {
		                    this.on.attr("tabindex", this._originalTabIndex);
		                }
		                this.element.attr("tabindex", "-1");
		                this._on({
		                    focus: "_handleInputFocus"
		                });
		                if (this.element.is(":disabled")) {
		                    this._setOptions({
		                        disabled: true
		                    });
		                }
		                this._on(this.flipswitch, {
		                    click: "_toggle",
		                    swipeleft: "_left",
		                    swiperight: "_right"
		                });
		                this._on(this.on, {
		                    keydown: "_keydown"
		                });
		                this._on({
		                    change: "refresh"
		                });
		            },
		            _handleInputFocus: function() {
		                this.on.focus();
		            },
		            widget: function() {
		                return this.flipswitch;
		            },
		            _left: function() {
		                this.flipswitch.removeClass("ui-flipswitch-active");
		                if (this.type === "SELECT") {
		                    this.element.get(0).selectedIndex = 0;
		                } else {
		                    this.element.prop("checked", false);
		                }
		                this.element.trigger("change");
		            },
		            _right: function() {
		                this.flipswitch.addClass("ui-flipswitch-active");
		                if (this.type === "SELECT") {
		                    this.element.get(0).selectedIndex = 1;
		                } else {
		                    this.element.prop("checked", true);
		                }
		                this.element.trigger("change");
		            },
		            _enhance: function() {
		                var flipswitch = $("<div>"), options = this.options, element = this.element, theme = options.theme ? options.theme : "inherit", on = $("<a></a>", {
		                    href: "#"
		                }), off = $("<span></span>"), type = element.get(0).tagName, onText = type === "INPUT" ? options.onText : element.find("option").eq(1).text(), offText = type === "INPUT" ? options.offText : element.find("option").eq(0).text();
		                on.addClass("ui-flipswitch-on ui-btn ui-shadow ui-btn-inherit").text(onText);
		                off.addClass("ui-flipswitch-off").text(offText);
		                flipswitch.addClass("ui-flipswitch ui-shadow-inset " + "ui-bar-" + theme + " " + (options.wrapperClass ? options.wrapperClass : "") + " " + (element.is(":checked") || element.find("option").eq(1).is(":selected") ? "ui-flipswitch-active" : "") + (element.is(":disabled") ? " ui-state-disabled" : "") + (options.corners ? " ui-corner-all" : "") + (options.mini ? " ui-mini" : "")).append(on, off);
		                element.addClass("ui-flipswitch-input").after(flipswitch).appendTo(flipswitch);
		                $.extend(this, {
		                    flipswitch: flipswitch,
		                    on: on,
		                    off: off,
		                    type: type
		                });
		            },
		            _reset: function() {
		                this.refresh();
		            },
		            refresh: function() {
		                var direction, existingDirection = this.flipswitch.hasClass("ui-flipswitch-active") ? "_right" : "_left";
		                if (this.type === "SELECT") {
		                    direction = this.element.get(0).selectedIndex > 0 ? "_right" : "_left";
		                } else {
		                    direction = this.element.prop("checked") ? "_right" : "_left";
		                }
		                if (direction !== existingDirection) {
		                    this[direction]();
		                }
		            },
		            _toggle: function() {
		                var direction = this.flipswitch.hasClass("ui-flipswitch-active") ? "_left" : "_right";
		                this[direction]();
		            },
		            _keydown: function(e) {
		                if (e.which === $.mobile.keyCode.LEFT) {
		                    this._left();
		                } else if (e.which === $.mobile.keyCode.RIGHT) {
		                    this._right();
		                } else if (e.which === $.mobile.keyCode.SPACE) {
		                    this._toggle();
		                    e.preventDefault();
		                }
		            },
		            _setOptions: function(options) {
		                if (options.theme !== undefined) {
		                    var currentTheme = options.theme ? options.theme : "inherit", newTheme = options.theme ? options.theme : "inherit";
		                    this.widget().removeClass("ui-bar-" + currentTheme).addClass("ui-bar-" + newTheme);
		                }
		                if (options.onText !== undefined) {
		                    this.on.text(options.onText);
		                }
		                if (options.offText !== undefined) {
		                    this.off.text(options.offText);
		                }
		                if (options.disabled !== undefined) {
		                    this.widget().toggleClass("ui-state-disabled", options.disabled);
		                }
		                if (options.mini !== undefined) {
		                    this.widget().toggleClass("ui-mini", options.mini);
		                }
		                if (options.corners !== undefined) {
		                    this.widget().toggleClass("ui-corner-all", options.corners);
		                }
		                this._super(options);
		            },
		            _destroy: function() {
		                if (this.options.enhanced) {
		                    return;
		                }
		                if (this._originalTabIndex != null) {
		                    this.element.attr("tabindex", this._originalTabIndex);
		                } else {
		                    this.element.removeAttr("tabindex");
		                }
		                this.on.remove();
		                this.off.remove();
		                this.element.unwrap();
		                this.flipswitch.remove();
		                this.removeClass("ui-flipswitch-input");
		            }
		        }, $.mobile.behaviors.formReset));
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.rangeslider", $.extend({
		            options: {
		                theme: null,
		                trackTheme: null,
		                corners: true,
		                mini: false,
		                highlight: true
		            },
		            _create: function() {
		                var $el = this.element, elClass = this.options.mini ? "ui-rangeslider ui-mini" : "ui-rangeslider", _inputFirst = $el.find("input").first(), _inputLast = $el.find("input").last(), _label = $el.find("label").first(), _sliderWidgetFirst = $.data(_inputFirst.get(0), "mobile-slider") || $.data(_inputFirst.slider().get(0), "mobile-slider"), _sliderWidgetLast = $.data(_inputLast.get(0), "mobile-slider") || $.data(_inputLast.slider().get(0), "mobile-slider"), _sliderFirst = _sliderWidgetFirst.slider, _sliderLast = _sliderWidgetLast.slider, firstHandle = _sliderWidgetFirst.handle, _sliders = $("<div class='ui-rangeslider-sliders' />").appendTo($el);
		                _inputFirst.addClass("ui-rangeslider-first");
		                _inputLast.addClass("ui-rangeslider-last");
		                $el.addClass(elClass);
		                _sliderFirst.appendTo(_sliders);
		                _sliderLast.appendTo(_sliders);
		                _label.insertBefore($el);
		                firstHandle.prependTo(_sliderLast);
		                $.extend(this, {
		                    _inputFirst: _inputFirst,
		                    _inputLast: _inputLast,
		                    _sliderFirst: _sliderFirst,
		                    _sliderLast: _sliderLast,
		                    _label: _label,
		                    _targetVal: null,
		                    _sliderTarget: false,
		                    _sliders: _sliders,
		                    _proxy: false
		                });
		                this.refresh();
		                this._on(this.element.find("input.ui-slider-input"), {
		                    slidebeforestart: "_slidebeforestart",
		                    slidestop: "_slidestop",
		                    slidedrag: "_slidedrag",
		                    slidebeforechange: "_change",
		                    blur: "_change",
		                    keyup: "_change"
		                });
		                this._on({
		                    mousedown: "_change"
		                });
		                this._on(this.element.closest("form"), {
		                    reset: "_handleReset"
		                });
		                this._on(firstHandle, {
		                    vmousedown: "_dragFirstHandle"
		                });
		            },
		            _handleReset: function() {
		                var self = this;
		                setTimeout(function() {
		                    self._updateHighlight();
		                }, 0);
		            },
		            _dragFirstHandle: function(event) {
		                $.data(this._inputFirst.get(0), "mobile-slider").dragging = true;
		                $.data(this._inputFirst.get(0), "mobile-slider").refresh(event);
		                $.data(this._inputFirst.get(0), "mobile-slider")._trigger("start");
		                return false;
		            },
		            _slidedrag: function(event) {
		                var first = $(event.target).is(this._inputFirst), otherSlider = first ? this._inputLast : this._inputFirst;
		                this._sliderTarget = false;
		                if (this._proxy === "first" && first || this._proxy === "last" && !first) {
		                    $.data(otherSlider.get(0), "mobile-slider").dragging = true;
		                    $.data(otherSlider.get(0), "mobile-slider").refresh(event);
		                    return false;
		                }
		            },
		            _slidestop: function(event) {
		                var first = $(event.target).is(this._inputFirst);
		                this._proxy = false;
		                this.element.find("input").trigger("vmouseup");
		                this._sliderFirst.css("z-index", first ? 1 : "");
		            },
		            _slidebeforestart: function(event) {
		                this._sliderTarget = false;
		                if ($(event.originalEvent.target).hasClass("ui-slider-track")) {
		                    this._sliderTarget = true;
		                    this._targetVal = $(event.target).val();
		                }
		            },
		            _setOptions: function(options) {
		                if (options.theme !== undefined) {
		                    this._setTheme(options.theme);
		                }
		                if (options.trackTheme !== undefined) {
		                    this._setTrackTheme(options.trackTheme);
		                }
		                if (options.mini !== undefined) {
		                    this._setMini(options.mini);
		                }
		                if (options.highlight !== undefined) {
		                    this._setHighlight(options.highlight);
		                }
		                if (options.disabled !== undefined) {
		                    this._setDisabled(options.disabled);
		                }
		                this._super(options);
		                this.refresh();
		            },
		            refresh: function() {
		                var $el = this.element, o = this.options;
		                if (this._inputFirst.is(":disabled") || this._inputLast.is(":disabled")) {
		                    this.options.disabled = true;
		                }
		                $el.find("input").slider({
		                    theme: o.theme,
		                    trackTheme: o.trackTheme,
		                    disabled: o.disabled,
		                    corners: o.corners,
		                    mini: o.mini,
		                    highlight: o.highlight
		                }).slider("refresh");
		                this._updateHighlight();
		            },
		            _change: function(event) {
		                if (event.type === "keyup") {
		                    this._updateHighlight();
		                    return false;
		                }
		                var self = this, min = parseFloat(this._inputFirst.val(), 10), max = parseFloat(this._inputLast.val(), 10), first = $(event.target).hasClass("ui-rangeslider-first"), thisSlider = first ? this._inputFirst : this._inputLast, otherSlider = first ? this._inputLast : this._inputFirst;
		                if (this._inputFirst.val() > this._inputLast.val() && event.type === "mousedown" && !$(event.target).hasClass("ui-slider-handle")) {
		                    thisSlider.blur();
		                } else if (event.type === "mousedown") {
		                    return;
		                }
		                if (min > max && !this._sliderTarget) {
		                    thisSlider.val(first ? max : min).slider("refresh");
		                    this._trigger("normalize");
		                } else if (min > max) {
		                    thisSlider.val(this._targetVal).slider("refresh");
		                    setTimeout(function() {
		                        otherSlider.val(first ? min : max).slider("refresh");
		                        $.data(otherSlider.get(0), "mobile-slider").handle.focus();
		                        self._sliderFirst.css("z-index", first ? "" : 1);
		                        self._trigger("normalize");
		                    }, 0);
		                    this._proxy = first ? "first" : "last";
		                }
		                if (min === max) {
		                    $.data(thisSlider.get(0), "mobile-slider").handle.css("z-index", 1);
		                    $.data(otherSlider.get(0), "mobile-slider").handle.css("z-index", 0);
		                } else {
		                    $.data(otherSlider.get(0), "mobile-slider").handle.css("z-index", "");
		                    $.data(thisSlider.get(0), "mobile-slider").handle.css("z-index", "");
		                }
		                this._updateHighlight();
		                if (min >= max) {
		                    return false;
		                }
		            },
		            _updateHighlight: function() {
		                var min = parseInt($.data(this._inputFirst.get(0), "mobile-slider").handle.get(0).style.left, 10), max = parseInt($.data(this._inputLast.get(0), "mobile-slider").handle.get(0).style.left, 10), width = max - min;
		                this.element.find(".ui-slider-bg").css({
		                    "margin-left": min + "%",
		                    width: width + "%"
		                });
		            },
		            _setTheme: function(value) {
		                this._inputFirst.slider("option", "theme", value);
		                this._inputLast.slider("option", "theme", value);
		            },
		            _setTrackTheme: function(value) {
		                this._inputFirst.slider("option", "trackTheme", value);
		                this._inputLast.slider("option", "trackTheme", value);
		            },
		            _setMini: function(value) {
		                this._inputFirst.slider("option", "mini", value);
		                this._inputLast.slider("option", "mini", value);
		                this.element.toggleClass("ui-mini", !!value);
		            },
		            _setHighlight: function(value) {
		                this._inputFirst.slider("option", "highlight", value);
		                this._inputLast.slider("option", "highlight", value);
		            },
		            _setDisabled: function(value) {
		                this._inputFirst.prop("disabled", value);
		                this._inputLast.prop("disabled", value);
		            },
		            _destroy: function() {
		                this._label.prependTo(this.element);
		                this.element.removeClass("ui-rangeslider ui-mini");
		                this._inputFirst.after(this._sliderFirst);
		                this._inputLast.after(this._sliderLast);
		                this._sliders.remove();
		                this.element.find("input").removeClass("ui-rangeslider-first ui-rangeslider-last").slider("destroy");
		            }
		        }, $.mobile.behaviors.formReset));
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.textinput", $.mobile.textinput, {
		            options: {
		                clearBtn: false,
		                clearBtnText: "Clear text"
		            },
		            _create: function() {
		                this._super();
		                if (this.isSearch) {
		                    this.options.clearBtn = true;
		                }
		                if (!!this.options.clearBtn && this.inputNeedsWrap) {
		                    this._addClearBtn();
		                }
		            },
		            clearButton: function() {
		                return $("<a href='#' tabindex='-1' aria-hidden='true' " + "class='ui-input-clear ui-btn ui-icon-delete ui-btn-icon-notext ui-corner-all'>" + "</a>").attr("title", this.options.clearBtnText).text(this.options.clearBtnText);
		            },
		            _clearBtnClick: function(event) {
		                this.element.val("").focus().trigger("change");
		                this._clearBtn.addClass("ui-input-clear-hidden");
		                event.preventDefault();
		            },
		            _addClearBtn: function() {
		                if (!this.options.enhanced) {
		                    this._enhanceClear();
		                }
		                $.extend(this, {
		                    _clearBtn: this.widget().find("a.ui-input-clear")
		                });
		                this._bindClearEvents();
		                this._toggleClear();
		            },
		            _enhanceClear: function() {
		                this.clearButton().appendTo(this.widget());
		                this.widget().addClass("ui-input-has-clear");
		            },
		            _bindClearEvents: function() {
		                this._on(this._clearBtn, {
		                    click: "_clearBtnClick"
		                });
		                this._on({
		                    keyup: "_toggleClear",
		                    change: "_toggleClear",
		                    input: "_toggleClear",
		                    focus: "_toggleClear",
		                    blur: "_toggleClear",
		                    cut: "_toggleClear",
		                    paste: "_toggleClear"
		                });
		            },
		            _unbindClear: function() {
		                this._off(this._clearBtn, "click");
		                this._off(this.element, "keyup change input focus blur cut paste");
		            },
		            _setOptions: function(options) {
		                this._super(options);
		                if (options.clearBtn !== undefined && !this.element.is("textarea, :jqmData(type='range')")) {
		                    if (options.clearBtn) {
		                        this._addClearBtn();
		                    } else {
		                        this._destroyClear();
		                    }
		                }
		                if (options.clearBtnText !== undefined && this._clearBtn !== undefined) {
		                    this._clearBtn.text(options.clearBtnText).attr("title", options.clearBtnText);
		                }
		            },
		            _toggleClear: function() {
		                this._delay("_toggleClearClass", 0);
		            },
		            _toggleClearClass: function() {
		                this._clearBtn.toggleClass("ui-input-clear-hidden", !this.element.val());
		            },
		            _destroyClear: function() {
		                this.widget().removeClass("ui-input-has-clear");
		                this._unbindClear();
		                this._clearBtn.remove();
		            },
		            _destroy: function() {
		                this._super();
		                if (this.options.clearBtn) {
		                    this._destroyClear();
		                }
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.textinput", $.mobile.textinput, {
		            options: {
		                autogrow: true,
		                keyupTimeoutBuffer: 100
		            },
		            _create: function() {
		                this._super();
		                if (this.options.autogrow && this.isTextarea) {
		                    this._autogrow();
		                }
		            },
		            _autogrow: function() {
		                this.element.addClass("ui-textinput-autogrow");
		                this._on({
		                    keyup: "_timeout",
		                    change: "_timeout",
		                    input: "_timeout",
		                    paste: "_timeout"
		                });
		                this._on(true, this.document, {
		                    pageshow: "_handleShow",
		                    popupbeforeposition: "_handleShow",
		                    updatelayout: "_handleShow",
		                    panelopen: "_handleShow"
		                });
		            },
		            _handleShow: function(event) {
		                if ($.contains(event.target, this.element[0]) && this.element.is(":visible")) {
		                    if (event.type !== "popupbeforeposition") {
		                        this.element.addClass("ui-textinput-autogrow-resize").animationComplete($.proxy(function() {
		                            this.element.removeClass("ui-textinput-autogrow-resize");
		                        }, this), "transition");
		                    }
		                    this._prepareHeightUpdate();
		                }
		            },
		            _unbindAutogrow: function() {
		                this.element.removeClass("ui-textinput-autogrow");
		                this._off(this.element, "keyup change input paste");
		                this._off(this.document, "pageshow popupbeforeposition updatelayout panelopen");
		            },
		            keyupTimeout: null,
		            _prepareHeightUpdate: function(delay) {
		                if (this.keyupTimeout) {
		                    clearTimeout(this.keyupTimeout);
		                }
		                if (delay === undefined) {
		                    this._updateHeight();
		                } else {
		                    this.keyupTimeout = this._delay("_updateHeight", delay);
		                }
		            },
		            _timeout: function() {
		                this._prepareHeightUpdate(this.options.keyupTimeoutBuffer);
		            },
		            _updateHeight: function() {
		                var paddingTop, paddingBottom, paddingHeight, scrollHeight, clientHeight, borderTop, borderBottom, borderHeight, height, scrollTop = this.window.scrollTop();
		                this.keyupTimeout = 0;
		                if (!("onpage" in this.element[0])) {
		                    this.element.css({
		                        height: 0,
		                        "min-height": 0,
		                        "max-height": 0
		                    });
		                }
		                scrollHeight = this.element[0].scrollHeight;
		                clientHeight = this.element[0].clientHeight;
		                borderTop = parseFloat(this.element.css("border-top-width"));
		                borderBottom = parseFloat(this.element.css("border-bottom-width"));
		                borderHeight = borderTop + borderBottom;
		                height = scrollHeight + borderHeight + 15;
		                if (clientHeight === 0) {
		                    paddingTop = parseFloat(this.element.css("padding-top"));
		                    paddingBottom = parseFloat(this.element.css("padding-bottom"));
		                    paddingHeight = paddingTop + paddingBottom;
		                    height += paddingHeight;
		                }
		                this.element.css({
		                    height: height,
		                    "min-height": "",
		                    "max-height": ""
		                });
		                this.window.scrollTop(scrollTop);
		            },
		            refresh: function() {
		                if (this.options.autogrow && this.isTextarea) {
		                    this._updateHeight();
		                }
		            },
		            _setOptions: function(options) {
		                this._super(options);
		                if (options.autogrow !== undefined && this.isTextarea) {
		                    if (options.autogrow) {
		                        this._autogrow();
		                    } else {
		                        this._unbindAutogrow();
		                    }
		                }
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.selectmenu", $.extend({
		            initSelector: "select:not( :jqmData(role='slider')):not( :jqmData(role='flipswitch') )",
		            options: {
		                theme: null,
		                icon: "carat-d",
		                iconpos: "right",
		                inline: false,
		                corners: true,
		                shadow: true,
		                iconshadow: false,
		                overlayTheme: null,
		                dividerTheme: null,
		                hidePlaceholderMenuItems: true,
		                closeText: "Close",
		                nativeMenu: true,
		                preventFocusZoom: /iPhone|iPad|iPod/.test(navigator.platform) && navigator.userAgent.indexOf("AppleWebKit") > -1,
		                mini: false
		            },
		            _button: function() {
		                return $("<div/>");
		            },
		            _setDisabled: function(value) {
		                this.element.attr("disabled", value);
		                this.button.attr("aria-disabled", value);
		                return this._setOption("disabled", value);
		            },
		            _focusButton: function() {
		                var self = this;
		                setTimeout(function() {
		                    self.button.focus();
		                }, 40);
		            },
		            _selectOptions: function() {
		                return this.select.find("option");
		            },
		            _preExtension: function() {
		                var inline = this.options.inline || this.element.jqmData("inline"), mini = this.options.mini || this.element.jqmData("mini"), classes = "";
		                if (!!~this.element[0].className.indexOf("ui-btn-left")) {
		                    classes = " ui-btn-left";
		                }
		                if (!!~this.element[0].className.indexOf("ui-btn-right")) {
		                    classes = " ui-btn-right";
		                }
		                if (inline) {
		                    classes += " ui-btn-inline";
		                }
		                if (mini) {
		                    classes += " ui-mini";
		                }
		                this.select = this.element.removeClass("ui-btn-left ui-btn-right").wrap("<div class='ui-select" + classes + "'>");
		                this.selectId = this.select.attr("id") || "select-" + this.uuid;
		                this.buttonId = this.selectId + "-button";
		                this.label = $("label[for='" + this.selectId + "']");
		                this.isMultiple = this.select[0].multiple;
		            },
		            _destroy: function() {
		                var wrapper = this.element.parents(".ui-select");
		                if (wrapper.length > 0) {
		                    if (wrapper.is(".ui-btn-left, .ui-btn-right")) {
		                        this.element.addClass(wrapper.hasClass("ui-btn-left") ? "ui-btn-left" : "ui-btn-right");
		                    }
		                    this.element.insertAfter(wrapper);
		                    wrapper.remove();
		                }
		            },
		            _create: function() {
		                this._preExtension();
		                this.button = this._button();
		                var self = this, options = this.options, iconpos = options.icon ? options.iconpos || this.select.jqmData("iconpos") : false, button = this.button.insertBefore(this.select).attr("id", this.buttonId).addClass("ui-btn" + (options.icon ? " ui-icon-" + options.icon + " ui-btn-icon-" + iconpos + (options.iconshadow ? " ui-shadow-icon" : "") : "") + (options.theme ? " ui-btn-" + options.theme : "") + (options.corners ? " ui-corner-all" : "") + (options.shadow ? " ui-shadow" : ""));
		                this.setButtonText();
		                if (options.nativeMenu && window.opera && window.opera.version) {
		                    button.addClass("ui-select-nativeonly");
		                }
		                if (this.isMultiple) {
		                    this.buttonCount = $("<span>").addClass("ui-li-count ui-body-inherit").hide().appendTo(button.addClass("ui-li-has-count"));
		                }
		                if (options.disabled || this.element.attr("disabled")) {
		                    this.disable();
		                }
		                this.select.change(function() {
		                    self.refresh();
		                    if (!!options.nativeMenu) {
		                        self._delay(function() {
		                            self.select.blur();
		                        });
		                    }
		                });
		                this._handleFormReset();
		                this._on(this.button, {
		                    keydown: "_handleKeydown"
		                });
		                this.build();
		            },
		            build: function() {
		                var self = this;
		                this.select.appendTo(self.button).bind("vmousedown", function() {
		                    self.button.addClass($.mobile.activeBtnClass);
		                }).bind("focus", function() {
		                    self.button.addClass($.mobile.focusClass);
		                }).bind("blur", function() {
		                    self.button.removeClass($.mobile.focusClass);
		                }).bind("focus vmouseover", function() {
		                    self.button.trigger("vmouseover");
		                }).bind("vmousemove", function() {
		                    self.button.removeClass($.mobile.activeBtnClass);
		                }).bind("change blur vmouseout", function() {
		                    self.button.trigger("vmouseout").removeClass($.mobile.activeBtnClass);
		                });
		                self.button.bind("vmousedown", function() {
		                    if (self.options.preventFocusZoom) {
		                        $.mobile.zoom.disable(true);
		                    }
		                });
		                self.label.bind("click focus", function() {
		                    if (self.options.preventFocusZoom) {
		                        $.mobile.zoom.disable(true);
		                    }
		                });
		                self.select.bind("focus", function() {
		                    if (self.options.preventFocusZoom) {
		                        $.mobile.zoom.disable(true);
		                    }
		                });
		                self.button.bind("mouseup", function() {
		                    if (self.options.preventFocusZoom) {
		                        setTimeout(function() {
		                            $.mobile.zoom.enable(true);
		                        }, 0);
		                    }
		                });
		                self.select.bind("blur", function() {
		                    if (self.options.preventFocusZoom) {
		                        $.mobile.zoom.enable(true);
		                    }
		                });
		            },
		            selected: function() {
		                return this._selectOptions().filter(":selected");
		            },
		            selectedIndices: function() {
		                var self = this;
		                return this.selected().map(function() {
		                    return self._selectOptions().index(this);
		                }).get();
		            },
		            setButtonText: function() {
		                var self = this, selected = this.selected(), text = this.placeholder, span = $(document.createElement("span"));
		                this.button.children("span").not(".ui-li-count").remove().end().end().prepend(function() {
		                    if (selected.length) {
		                        text = selected.map(function() {
		                            return $(this).text();
		                        }).get().join(", ");
		                    } else {
		                        text = self.placeholder;
		                    }
		                    if (text) {
		                        span.text(text);
		                    } else {
		                        span.html("&#160;");
		                    }
		                    return span.addClass(self.select.attr("class")).addClass(selected.attr("class")).removeClass("ui-screen-hidden");
		                }());
		            },
		            setButtonCount: function() {
		                var selected = this.selected();
		                if (this.isMultiple) {
		                    this.buttonCount[selected.length > 1 ? "show" : "hide"]().text(selected.length);
		                }
		            },
		            _handleKeydown: function() {
		                this._delay("_refreshButton");
		            },
		            _reset: function() {
		                this.refresh();
		            },
		            _refreshButton: function() {
		                this.setButtonText();
		                this.setButtonCount();
		            },
		            refresh: function() {
		                this._refreshButton();
		            },
		            open: $.noop,
		            close: $.noop,
		            disable: function() {
		                this._setDisabled(true);
		                this.button.addClass("ui-state-disabled");
		            },
		            enable: function() {
		                this._setDisabled(false);
		                this.button.removeClass("ui-state-disabled");
		            }
		        }, $.mobile.behaviors.formReset));
		    })(jQuery);
		    (function($, undefined) {
		        $.mobile.links = function(target) {
		            $(target).find("a").jqmEnhanceable().filter(":jqmData(rel='popup')[href][href!='']").each(function() {
		                var element = this, idref = element.getAttribute("href").substring(1);
		                if (idref) {
		                    element.setAttribute("aria-haspopup", true);
		                    element.setAttribute("aria-owns", idref);
		                    element.setAttribute("aria-expanded", false);
		                }
		            }).end().not(".ui-btn, :jqmData(role='none'), :jqmData(role='nojs')").addClass("ui-link");
		        };
		    })(jQuery);
		    (function($, undefined) {
		        function fitSegmentInsideSegment(windowSize, segmentSize, offset, desired) {
		            var returnValue = desired;
		            if (windowSize < segmentSize) {
		                returnValue = offset + (windowSize - segmentSize) / 2;
		            } else {
		                returnValue = Math.min(Math.max(offset, desired - segmentSize / 2), offset + windowSize - segmentSize);
		            }
		            return returnValue;
		        }
		        function getWindowCoordinates(theWindow) {
		            return {
		                x: theWindow.scrollLeft(),
		                y: theWindow.scrollTop(),
		                cx: theWindow[0].innerWidth || theWindow.width(),
		                cy: theWindow[0].innerHeight || theWindow.height()
		            };
		        }
		        $.widget("mobile.popup", {
		            options: {
		                wrapperClass: null,
		                theme: null,
		                overlayTheme: null,
		                shadow: true,
		                corners: true,
		                transition: "none",
		                positionTo: "origin",
		                tolerance: null,
		                closeLinkSelector: "a:jqmData(rel='back')",
		                closeLinkEvents: "click.popup",
		                navigateEvents: "navigate.popup",
		                closeEvents: "navigate.popup pagebeforechange.popup",
		                dismissible: true,
		                enhanced: false,
		                history: !$.mobile.browser.oldIE
		            },
		            _handleDocumentVmousedown: function(theEvent) {
		                if (this._isOpen && $.contains(this._ui.container[0], theEvent.target)) {
		                    this._ignoreResizeEvents();
		                }
		            },
		            _create: function() {
		                var theElement = this.element, myId = theElement.attr("id"), currentOptions = this.options;
		                currentOptions.history = currentOptions.history && $.mobile.ajaxEnabled && $.mobile.hashListeningEnabled;
		                this._on(this.document, {
		                    vmousedown: "_handleDocumentVmousedown"
		                });
		                $.extend(this, {
		                    _scrollTop: 0,
		                    _page: theElement.closest(".ui-page"),
		                    _ui: null,
		                    _fallbackTransition: "",
		                    _currentTransition: false,
		                    _prerequisites: null,
		                    _isOpen: false,
		                    _tolerance: null,
		                    _resizeData: null,
		                    _ignoreResizeTo: 0,
		                    _orientationchangeInProgress: false
		                });
		                if (this._page.length === 0) {
		                    this._page = $("body");
		                }
		                if (currentOptions.enhanced) {
		                    this._ui = {
		                        container: theElement.parent(),
		                        screen: theElement.parent().prev(),
		                        placeholder: $(this.document[0].getElementById(myId + "-placeholder"))
		                    };
		                } else {
		                    this._ui = this._enhance(theElement, myId);
		                    this._applyTransition(currentOptions.transition);
		                }
		                this._setTolerance(currentOptions.tolerance)._ui.focusElement = this._ui.container;
		                this._on(this._ui.screen, {
		                    vclick: "_eatEventAndClose"
		                });
		                this._on(this.window, {
		                    orientationchange: $.proxy(this, "_handleWindowOrientationchange"),
		                    resize: $.proxy(this, "_handleWindowResize"),
		                    keyup: $.proxy(this, "_handleWindowKeyUp")
		                });
		                this._on(this.document, {
		                    focusin: "_handleDocumentFocusIn"
		                });
		            },
		            _enhance: function(theElement, myId) {
		                var currentOptions = this.options, wrapperClass = currentOptions.wrapperClass, ui = {
		                    screen: $("<div class='ui-screen-hidden ui-popup-screen " + this._themeClassFromOption("ui-overlay-", currentOptions.overlayTheme) + "'></div>"),
		                    placeholder: $("<div style='display: none;'><!-- placeholder --></div>"),
		                    container: $("<div class='ui-popup-container ui-popup-hidden ui-popup-truncate" + (wrapperClass ? " " + wrapperClass : "") + "'></div>")
		                }, fragment = this.document[0].createDocumentFragment();
		                fragment.appendChild(ui.screen[0]);
		                fragment.appendChild(ui.container[0]);
		                if (myId) {
		                    ui.screen.attr("id", myId + "-screen");
		                    ui.container.attr("id", myId + "-popup");
		                    ui.placeholder.attr("id", myId + "-placeholder").html("<!-- placeholder for " + myId + " -->");
		                }
		                this._page[0].appendChild(fragment);
		                ui.placeholder.insertAfter(theElement);
		                theElement.detach().addClass("ui-popup " + this._themeClassFromOption("ui-body-", currentOptions.theme) + " " + (currentOptions.shadow ? "ui-overlay-shadow " : "") + (currentOptions.corners ? "ui-corner-all " : "")).appendTo(ui.container);
		                return ui;
		            },
		            _eatEventAndClose: function(theEvent) {
		                theEvent.preventDefault();
		                theEvent.stopImmediatePropagation();
		                if (this.options.dismissible) {
		                    this.close();
		                }
		                return false;
		            },
		            _resizeScreen: function() {
		                var screen = this._ui.screen, popupHeight = this._ui.container.outerHeight(true), screenHeight = screen.removeAttr("style").height(), documentHeight = this.document.height() - 1;
		                if (screenHeight < documentHeight) {
		                    screen.height(documentHeight);
		                } else if (popupHeight > screenHeight) {
		                    screen.height(popupHeight);
		                }
		            },
		            _handleWindowKeyUp: function(theEvent) {
		                if (this._isOpen && theEvent.keyCode === $.mobile.keyCode.ESCAPE) {
		                    return this._eatEventAndClose(theEvent);
		                }
		            },
		            _expectResizeEvent: function() {
		                var windowCoordinates = getWindowCoordinates(this.window);
		                if (this._resizeData) {
		                    if (windowCoordinates.x === this._resizeData.windowCoordinates.x && windowCoordinates.y === this._resizeData.windowCoordinates.y && windowCoordinates.cx === this._resizeData.windowCoordinates.cx && windowCoordinates.cy === this._resizeData.windowCoordinates.cy) {
		                        return false;
		                    } else {
		                        clearTimeout(this._resizeData.timeoutId);
		                    }
		                }
		                this._resizeData = {
		                    timeoutId: this._delay("_resizeTimeout", 200),
		                    windowCoordinates: windowCoordinates
		                };
		                return true;
		            },
		            _resizeTimeout: function() {
		                if (this._isOpen) {
		                    if (!this._expectResizeEvent()) {
		                        if (this._ui.container.hasClass("ui-popup-hidden")) {
		                            this._ui.container.removeClass("ui-popup-hidden ui-popup-truncate");
		                            this.reposition({
		                                positionTo: "window"
		                            });
		                            this._ignoreResizeEvents();
		                        }
		                        this._resizeScreen();
		                        this._resizeData = null;
		                        this._orientationchangeInProgress = false;
		                    }
		                } else {
		                    this._resizeData = null;
		                    this._orientationchangeInProgress = false;
		                }
		            },
		            _stopIgnoringResizeEvents: function() {
		                this._ignoreResizeTo = 0;
		            },
		            _ignoreResizeEvents: function() {
		                if (this._ignoreResizeTo) {
		                    clearTimeout(this._ignoreResizeTo);
		                }
		                this._ignoreResizeTo = this._delay("_stopIgnoringResizeEvents", 1e3);
		            },
		            _handleWindowResize: function() {
		                if (this._isOpen && this._ignoreResizeTo === 0) {
		                    if ((this._expectResizeEvent() || this._orientationchangeInProgress) && !this._ui.container.hasClass("ui-popup-hidden")) {
		                        this._ui.container.addClass("ui-popup-hidden ui-popup-truncate").removeAttr("style");
		                    }
		                }
		            },
		            _handleWindowOrientationchange: function() {
		                if (!this._orientationchangeInProgress && this._isOpen && this._ignoreResizeTo === 0) {
		                    this._expectResizeEvent();
		                    this._orientationchangeInProgress = true;
		                }
		            },
		            _handleDocumentFocusIn: function(theEvent) {
		                var target, targetElement = theEvent.target, ui = this._ui;
		                if (!this._isOpen) {
		                    return;
		                }
		                if (targetElement !== ui.container[0]) {
		                    target = $(targetElement);
		                    if (!$.contains(ui.container[0], targetElement)) {
		                        $(this.document[0].activeElement).one("focus", $.proxy(function() {
		                            this._safelyBlur(targetElement);
		                        }, this));
		                        ui.focusElement.focus();
		                        theEvent.preventDefault();
		                        theEvent.stopImmediatePropagation();
		                        return false;
		                    } else if (ui.focusElement[0] === ui.container[0]) {
		                        ui.focusElement = target;
		                    }
		                }
		                this._ignoreResizeEvents();
		            },
		            _themeClassFromOption: function(prefix, value) {
		                return value ? value === "none" ? "" : prefix + value : prefix + "inherit";
		            },
		            _applyTransition: function(value) {
		                if (value) {
		                    this._ui.container.removeClass(this._fallbackTransition);
		                    if (value !== "none") {
		                        this._fallbackTransition = $.mobile._maybeDegradeTransition(value);
		                        if (this._fallbackTransition === "none") {
		                            this._fallbackTransition = "";
		                        }
		                        this._ui.container.addClass(this._fallbackTransition);
		                    }
		                }
		                return this;
		            },
		            _setOptions: function(newOptions) {
		                var currentOptions = this.options, theElement = this.element, screen = this._ui.screen;
		                if (newOptions.wrapperClass !== undefined) {
		                    this._ui.container.removeClass(currentOptions.wrapperClass).addClass(newOptions.wrapperClass);
		                }
		                if (newOptions.theme !== undefined) {
		                    theElement.removeClass(this._themeClassFromOption("ui-body-", currentOptions.theme)).addClass(this._themeClassFromOption("ui-body-", newOptions.theme));
		                }
		                if (newOptions.overlayTheme !== undefined) {
		                    screen.removeClass(this._themeClassFromOption("ui-overlay-", currentOptions.overlayTheme)).addClass(this._themeClassFromOption("ui-overlay-", newOptions.overlayTheme));
		                    if (this._isOpen) {
		                        screen.addClass("in");
		                    }
		                }
		                if (newOptions.shadow !== undefined) {
		                    theElement.toggleClass("ui-overlay-shadow", newOptions.shadow);
		                }
		                if (newOptions.corners !== undefined) {
		                    theElement.toggleClass("ui-corner-all", newOptions.corners);
		                }
		                if (newOptions.transition !== undefined) {
		                    if (!this._currentTransition) {
		                        this._applyTransition(newOptions.transition);
		                    }
		                }
		                if (newOptions.tolerance !== undefined) {
		                    this._setTolerance(newOptions.tolerance);
		                }
		                if (newOptions.disabled !== undefined) {
		                    if (newOptions.disabled) {
		                        this.close();
		                    }
		                }
		                return this._super(newOptions);
		            },
		            _setTolerance: function(value) {
		                var tol = {
		                    t: 30,
		                    r: 15,
		                    b: 30,
		                    l: 15
		                }, ar;
		                if (value !== undefined) {
		                    ar = String(value).split(",");
		                    $.each(ar, function(idx, val) {
		                        ar[idx] = parseInt(val, 10);
		                    });
		                    switch (ar.length) {
		                      case 1:
		                        if (!isNaN(ar[0])) {
		                            tol.t = tol.r = tol.b = tol.l = ar[0];
		                        }
		                        break;

		                      case 2:
		                        if (!isNaN(ar[0])) {
		                            tol.t = tol.b = ar[0];
		                        }
		                        if (!isNaN(ar[1])) {
		                            tol.l = tol.r = ar[1];
		                        }
		                        break;

		                      case 4:
		                        if (!isNaN(ar[0])) {
		                            tol.t = ar[0];
		                        }
		                        if (!isNaN(ar[1])) {
		                            tol.r = ar[1];
		                        }
		                        if (!isNaN(ar[2])) {
		                            tol.b = ar[2];
		                        }
		                        if (!isNaN(ar[3])) {
		                            tol.l = ar[3];
		                        }
		                        break;

		                      default:
		                        break;
		                    }
		                }
		                this._tolerance = tol;
		                return this;
		            },
		            _clampPopupWidth: function(infoOnly) {
		                var menuSize, windowCoordinates = getWindowCoordinates(this.window), rectangle = {
		                    x: this._tolerance.l,
		                    y: windowCoordinates.y + this._tolerance.t,
		                    cx: windowCoordinates.cx - this._tolerance.l - this._tolerance.r,
		                    cy: windowCoordinates.cy - this._tolerance.t - this._tolerance.b
		                };
		                if (!infoOnly) {
		                    this._ui.container.css("max-width", rectangle.cx);
		                }
		                menuSize = {
		                    cx: this._ui.container.outerWidth(true),
		                    cy: this._ui.container.outerHeight(true)
		                };
		                return {
		                    rc: rectangle,
		                    menuSize: menuSize
		                };
		            },
		            _calculateFinalLocation: function(desired, clampInfo) {
		                var returnValue, rectangle = clampInfo.rc, menuSize = clampInfo.menuSize;
		                returnValue = {
		                    left: fitSegmentInsideSegment(rectangle.cx, menuSize.cx, rectangle.x, desired.x),
		                    top: fitSegmentInsideSegment(rectangle.cy, menuSize.cy, rectangle.y, desired.y)
		                };
		                returnValue.top = Math.max(0, returnValue.top);
		                returnValue.top -= Math.min(returnValue.top, Math.max(0, returnValue.top + menuSize.cy - this.document.height()));
		                return returnValue;
		            },
		            _placementCoords: function(desired) {
		                return this._calculateFinalLocation(desired, this._clampPopupWidth());
		            },
		            _createPrerequisites: function(screenPrerequisite, containerPrerequisite, whenDone) {
		                var prerequisites, self = this;
		                prerequisites = {
		                    screen: $.Deferred(),
		                    container: $.Deferred()
		                };
		                prerequisites.screen.then(function() {
		                    if (prerequisites === self._prerequisites) {
		                        screenPrerequisite();
		                    }
		                });
		                prerequisites.container.then(function() {
		                    if (prerequisites === self._prerequisites) {
		                        containerPrerequisite();
		                    }
		                });
		                $.when(prerequisites.screen, prerequisites.container).done(function() {
		                    if (prerequisites === self._prerequisites) {
		                        self._prerequisites = null;
		                        whenDone();
		                    }
		                });
		                self._prerequisites = prerequisites;
		            },
		            _animate: function(args) {
		                this._ui.screen.removeClass(args.classToRemove).addClass(args.screenClassToAdd);
		                args.prerequisites.screen.resolve();
		                if (args.transition && args.transition !== "none") {
		                    if (args.applyTransition) {
		                        this._applyTransition(args.transition);
		                    }
		                    if (this._fallbackTransition) {
		                        this._ui.container.addClass(args.containerClassToAdd).removeClass(args.classToRemove).animationComplete($.proxy(args.prerequisites.container, "resolve"));
		                        return;
		                    }
		                }
		                this._ui.container.removeClass(args.classToRemove);
		                args.prerequisites.container.resolve();
		            },
		            _desiredCoords: function(openOptions) {
		                var offset, dst = null, windowCoordinates = getWindowCoordinates(this.window), x = openOptions.x, y = openOptions.y, pTo = openOptions.positionTo;
		                if (pTo && pTo !== "origin") {
		                    if (pTo === "window") {
		                        x = windowCoordinates.cx / 2 + windowCoordinates.x;
		                        y = windowCoordinates.cy / 2 + windowCoordinates.y;
		                    } else {
		                        try {
		                            dst = $(pTo);
		                        } catch (err) {
		                            dst = null;
		                        }
		                        if (dst) {
		                            dst.filter(":visible");
		                            if (dst.length === 0) {
		                                dst = null;
		                            }
		                        }
		                    }
		                }
		                if (dst) {
		                    offset = dst.offset();
		                    x = offset.left + dst.outerWidth() / 2;
		                    y = offset.top + dst.outerHeight() / 2;
		                }
		                if ($.type(x) !== "number" || isNaN(x)) {
		                    x = windowCoordinates.cx / 2 + windowCoordinates.x;
		                }
		                if ($.type(y) !== "number" || isNaN(y)) {
		                    y = windowCoordinates.cy / 2 + windowCoordinates.y;
		                }
		                return {
		                    x: x,
		                    y: y
		                };
		            },
		            _reposition: function(openOptions) {
		                openOptions = {
		                    x: openOptions.x,
		                    y: openOptions.y,
		                    positionTo: openOptions.positionTo
		                };
		                this._trigger("beforeposition", undefined, openOptions);
		                this._ui.container.offset(this._placementCoords(this._desiredCoords(openOptions)));
		            },
		            reposition: function(openOptions) {
		                if (this._isOpen) {
		                    this._reposition(openOptions);
		                }
		            },
		            _safelyBlur: function(currentElement) {
		                if (currentElement !== this.window[0] && currentElement.nodeName.toLowerCase() !== "body") {
		                    $(currentElement).blur();
		                }
		            },
		            _openPrerequisitesComplete: function() {
		                var id = this.element.attr("id"), firstFocus = this._ui.container.find(":focusable").first();
		                this._ui.container.addClass("ui-popup-active");
		                this._isOpen = true;
		                this._resizeScreen();
		                if (!$.contains(this._ui.container[0], this.document[0].activeElement)) {
		                    this._safelyBlur(this.document[0].activeElement);
		                }
		                if (firstFocus.length > 0) {
		                    this._ui.focusElement = firstFocus;
		                }
		                this._ignoreResizeEvents();
		                if (id) {
		                    this.document.find("[aria-haspopup='true'][aria-owns='" + id + "']").attr("aria-expanded", true);
		                }
		                this._trigger("afteropen");
		            },
		            _open: function(options) {
		                var openOptions = $.extend({}, this.options, options), androidBlacklist = function() {
		                    var ua = navigator.userAgent, wkmatch = ua.match(/AppleWebKit\/([0-9\.]+)/), wkversion = !!wkmatch && wkmatch[1], androidmatch = ua.match(/Android (\d+(?:\.\d+))/), andversion = !!androidmatch && androidmatch[1], chromematch = ua.indexOf("Chrome") > -1;
		                    if (androidmatch !== null && andversion === "4.0" && wkversion && wkversion > 534.13 && !chromematch) {
		                        return true;
		                    }
		                    return false;
		                }();
		                this._createPrerequisites($.noop, $.noop, $.proxy(this, "_openPrerequisitesComplete"));
		                this._currentTransition = openOptions.transition;
		                this._applyTransition(openOptions.transition);
		                this._ui.screen.removeClass("ui-screen-hidden");
		                this._ui.container.removeClass("ui-popup-truncate");
		                this._reposition(openOptions);
		                this._ui.container.removeClass("ui-popup-hidden");
		                if (this.options.overlayTheme && androidBlacklist) {
		                    this.element.closest(".ui-page").addClass("ui-popup-open");
		                }
		                this._animate({
		                    additionalCondition: true,
		                    transition: openOptions.transition,
		                    classToRemove: "",
		                    screenClassToAdd: "in",
		                    containerClassToAdd: "in",
		                    applyTransition: false,
		                    prerequisites: this._prerequisites
		                });
		            },
		            _closePrerequisiteScreen: function() {
		                this._ui.screen.removeClass("out").addClass("ui-screen-hidden");
		            },
		            _closePrerequisiteContainer: function() {
		                this._ui.container.removeClass("reverse out").addClass("ui-popup-hidden ui-popup-truncate").removeAttr("style");
		            },
		            _closePrerequisitesDone: function() {
		                var container = this._ui.container, id = this.element.attr("id");
		                $.mobile.popup.active = undefined;
		                $(":focus", container[0]).add(container[0]).blur();
		                if (id) {
		                    this.document.find("[aria-haspopup='true'][aria-owns='" + id + "']").attr("aria-expanded", false);
		                }
		                this._trigger("afterclose");
		            },
		            _close: function(immediate) {
		                this._ui.container.removeClass("ui-popup-active");
		                this._page.removeClass("ui-popup-open");
		                this._isOpen = false;
		                this._createPrerequisites($.proxy(this, "_closePrerequisiteScreen"), $.proxy(this, "_closePrerequisiteContainer"), $.proxy(this, "_closePrerequisitesDone"));
		                this._animate({
		                    additionalCondition: this._ui.screen.hasClass("in"),
		                    transition: immediate ? "none" : this._currentTransition,
		                    classToRemove: "in",
		                    screenClassToAdd: "out",
		                    containerClassToAdd: "reverse out",
		                    applyTransition: true,
		                    prerequisites: this._prerequisites
		                });
		            },
		            _unenhance: function() {
		                if (this.options.enhanced) {
		                    return;
		                }
		                this._setOptions({
		                    theme: $.mobile.popup.prototype.options.theme
		                });
		                this.element.detach().insertAfter(this._ui.placeholder).removeClass("ui-popup ui-overlay-shadow ui-corner-all ui-body-inherit");
		                this._ui.screen.remove();
		                this._ui.container.remove();
		                this._ui.placeholder.remove();
		            },
		            _destroy: function() {
		                if ($.mobile.popup.active === this) {
		                    this.element.one("popupafterclose", $.proxy(this, "_unenhance"));
		                    this.close();
		                } else {
		                    this._unenhance();
		                }
		                return this;
		            },
		            _closePopup: function(theEvent, data) {
		                var parsedDst, toUrl, currentOptions = this.options, immediate = false;
		                if (theEvent && theEvent.isDefaultPrevented() || $.mobile.popup.active !== this) {
		                    return;
		                }
		                window.scrollTo(0, this._scrollTop);
		                if (theEvent && theEvent.type === "pagebeforechange" && data) {
		                    if (typeof data.toPage === "string") {
		                        parsedDst = data.toPage;
		                    } else {
		                        parsedDst = data.toPage.jqmData("url");
		                    }
		                    parsedDst = $.mobile.path.parseUrl(parsedDst);
		                    toUrl = parsedDst.pathname + parsedDst.search + parsedDst.hash;
		                    if (this._myUrl !== $.mobile.path.makeUrlAbsolute(toUrl)) {
		                        immediate = true;
		                    } else {
		                        theEvent.preventDefault();
		                    }
		                }
		                this.window.off(currentOptions.closeEvents);
		                this.element.undelegate(currentOptions.closeLinkSelector, currentOptions.closeLinkEvents);
		                this._close(immediate);
		            },
		            _bindContainerClose: function() {
		                this.window.on(this.options.closeEvents, $.proxy(this, "_closePopup"));
		            },
		            widget: function() {
		                return this._ui.container;
		            },
		            open: function(options) {
		                var url, hashkey, activePage, currentIsDialog, hasHash, urlHistory, self = this, currentOptions = this.options;
		                if ($.mobile.popup.active || currentOptions.disabled) {
		                    return this;
		                }
		                $.mobile.popup.active = this;
		                this._scrollTop = this.window.scrollTop();
		                if (!currentOptions.history) {
		                    self._open(options);
		                    self._bindContainerClose();
		                    self.element.delegate(currentOptions.closeLinkSelector, currentOptions.closeLinkEvents, function(theEvent) {
		                        self.close();
		                        theEvent.preventDefault();
		                    });
		                    return this;
		                }
		                urlHistory = $.mobile.navigate.history;
		                hashkey = $.mobile.dialogHashKey;
		                activePage = $.mobile.activePage;
		                currentIsDialog = activePage ? activePage.hasClass("ui-dialog") : false;
		                this._myUrl = url = urlHistory.getActive().url;
		                hasHash = url.indexOf(hashkey) > -1 && !currentIsDialog && urlHistory.activeIndex > 0;
		                if (hasHash) {
		                    self._open(options);
		                    self._bindContainerClose();
		                    return this;
		                }
		                if (url.indexOf(hashkey) === -1 && !currentIsDialog) {
		                    url = url + (url.indexOf("#") > -1 ? hashkey : "#" + hashkey);
		                } else {
		                    url = $.mobile.path.parseLocation().hash + hashkey;
		                }
		                this.window.one("beforenavigate", function(theEvent) {
		                    theEvent.preventDefault();
		                    self._open(options);
		                    self._bindContainerClose();
		                });
		                this.urlAltered = true;
		                $.mobile.navigate(url, {
		                    role: "dialog"
		                });
		                return this;
		            },
		            close: function() {
		                if ($.mobile.popup.active !== this) {
		                    return this;
		                }
		                this._scrollTop = this.window.scrollTop();
		                if (this.options.history && this.urlAltered) {
		                    $.mobile.back();
		                    this.urlAltered = false;
		                } else {
		                    this._closePopup();
		                }
		                return this;
		            }
		        });
		        $.mobile.popup.handleLink = function($link) {
		            var offset, path = $.mobile.path, popup = $(path.hashToSelector(path.parseUrl($link.attr("href")).hash)).first();
		            if (popup.length > 0 && popup.data("mobile-popup")) {
		                offset = $link.offset();
		                popup.popup("open", {
		                    x: offset.left + $link.outerWidth() / 2,
		                    y: offset.top + $link.outerHeight() / 2,
		                    transition: $link.jqmData("transition"),
		                    positionTo: $link.jqmData("position-to")
		                });
		            }
		            setTimeout(function() {
		                $link.removeClass($.mobile.activeBtnClass);
		            }, 300);
		        };
		        $.mobile.document.on("pagebeforechange", function(theEvent, data) {
		            if (data.options.role === "popup") {
		                $.mobile.popup.handleLink(data.options.link);
		                theEvent.preventDefault();
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        var unfocusableItemSelector = ".ui-disabled,.ui-state-disabled,.ui-li-divider,.ui-screen-hidden,:jqmData(role='placeholder')", goToAdjacentItem = function(item, target, direction) {
		            var adjacent = item[direction + "All"]().not(unfocusableItemSelector).first();
		            if (adjacent.length) {
		                target.blur().attr("tabindex", "-1");
		                adjacent.find("a").first().focus();
		            }
		        };
		        $.widget("mobile.selectmenu", $.mobile.selectmenu, {
		            _create: function() {
		                var o = this.options;
		                o.nativeMenu = o.nativeMenu || this.element.parents(":jqmData(role='popup'),:mobile-popup").length > 0;
		                return this._super();
		            },
		            _handleSelectFocus: function() {
		                this.element.blur();
		                this.button.focus();
		            },
		            _handleKeydown: function(event) {
		                this._super(event);
		                this._handleButtonVclickKeydown(event);
		            },
		            _handleButtonVclickKeydown: function(event) {
		                if (this.options.disabled || this.isOpen || this.options.nativeMenu) {
		                    return;
		                }
		                if (event.type === "vclick" || event.keyCode && (event.keyCode === $.mobile.keyCode.ENTER || event.keyCode === $.mobile.keyCode.SPACE)) {
		                    this._decideFormat();
		                    if (this.menuType === "overlay") {
		                        this.button.attr("href", "#" + this.popupId).attr("data-" + ($.mobile.ns || "") + "rel", "popup");
		                    } else {
		                        this.button.attr("href", "#" + this.dialogId).attr("data-" + ($.mobile.ns || "") + "rel", "dialog");
		                    }
		                    this.isOpen = true;
		                }
		            },
		            _handleListFocus: function(e) {
		                var params = e.type === "focusin" ? {
		                    tabindex: "0",
		                    event: "vmouseover"
		                } : {
		                    tabindex: "-1",
		                    event: "vmouseout"
		                };
		                $(e.target).attr("tabindex", params.tabindex).trigger(params.event);
		            },
		            _handleListKeydown: function(event) {
		                var target = $(event.target), li = target.closest("li");
		                switch (event.keyCode) {
		                  case 38:
		                    goToAdjacentItem(li, target, "prev");
		                    return false;

		                  case 40:
		                    goToAdjacentItem(li, target, "next");
		                    return false;

		                  case 13:
		                  case 32:
		                    target.trigger("click");
		                    return false;
		                }
		            },
		            _handleMenuPageHide: function() {
		                this._delayedTrigger();
		                this.thisPage.page("bindRemove");
		            },
		            _handleHeaderCloseClick: function() {
		                if (this.menuType === "overlay") {
		                    this.close();
		                    return false;
		                }
		            },
		            _handleListItemClick: function(event) {
		                var listItem = $(event.target).closest("li"), oldIndex = this.select[0].selectedIndex, newIndex = $.mobile.getAttribute(listItem, "option-index"), option = this._selectOptions().eq(newIndex)[0];
		                option.selected = this.isMultiple ? !option.selected : true;
		                if (this.isMultiple) {
		                    listItem.find("a").toggleClass("ui-checkbox-on", option.selected).toggleClass("ui-checkbox-off", !option.selected);
		                }
		                if (!this.isMultiple && oldIndex !== newIndex) {
		                    this._triggerChange = true;
		                }
		                if (this.isMultiple) {
		                    this.select.trigger("change");
		                    this.list.find("li:not(.ui-li-divider)").eq(newIndex).find("a").first().focus();
		                } else {
		                    this.close();
		                }
		                event.preventDefault();
		            },
		            build: function() {
		                var selectId, popupId, dialogId, label, thisPage, isMultiple, menuId, themeAttr, overlayTheme, overlayThemeAttr, dividerThemeAttr, menuPage, listbox, list, header, headerTitle, menuPageContent, menuPageClose, headerClose, o = this.options;
		                if (o.nativeMenu) {
		                    return this._super();
		                }
		                selectId = this.selectId;
		                popupId = selectId + "-listbox";
		                dialogId = selectId + "-dialog";
		                label = this.label;
		                thisPage = this.element.closest(".ui-page");
		                isMultiple = this.element[0].multiple;
		                menuId = selectId + "-menu";
		                themeAttr = o.theme ? " data-" + $.mobile.ns + "theme='" + o.theme + "'" : "";
		                overlayTheme = o.overlayTheme || o.theme || null;
		                overlayThemeAttr = overlayTheme ? " data-" + $.mobile.ns + "overlay-theme='" + overlayTheme + "'" : "";
		                dividerThemeAttr = o.dividerTheme && isMultiple ? " data-" + $.mobile.ns + "divider-theme='" + o.dividerTheme + "'" : "";
		                menuPage = $("<div data-" + $.mobile.ns + "role='dialog' class='ui-selectmenu' id='" + dialogId + "'" + themeAttr + overlayThemeAttr + ">" + "<div data-" + $.mobile.ns + "role='header'>" + "<div class='ui-title'></div>" + "</div>" + "<div data-" + $.mobile.ns + "role='content'></div>" + "</div>");
		                listbox = $("<div" + themeAttr + overlayThemeAttr + " id='" + popupId + "' class='ui-selectmenu'></div>").insertAfter(this.select).popup();
		                list = $("<ul class='ui-selectmenu-list' id='" + menuId + "' role='listbox' aria-labelledby='" + this.buttonId + "'" + themeAttr + dividerThemeAttr + "></ul>").appendTo(listbox);
		                header = $("<div class='ui-header ui-bar-" + (o.theme ? o.theme : "inherit") + "'></div>").prependTo(listbox);
		                headerTitle = $("<h1 class='ui-title'></h1>").appendTo(header);
		                if (this.isMultiple) {
		                    headerClose = $("<a>", {
		                        role: "button",
		                        text: o.closeText,
		                        href: "#",
		                        class: "ui-btn ui-corner-all ui-btn-left ui-btn-icon-notext ui-icon-delete"
		                    }).appendTo(header);
		                }
		                $.extend(this, {
		                    selectId: selectId,
		                    menuId: menuId,
		                    popupId: popupId,
		                    dialogId: dialogId,
		                    thisPage: thisPage,
		                    menuPage: menuPage,
		                    label: label,
		                    isMultiple: isMultiple,
		                    theme: o.theme,
		                    listbox: listbox,
		                    list: list,
		                    header: header,
		                    headerTitle: headerTitle,
		                    headerClose: headerClose,
		                    menuPageContent: menuPageContent,
		                    menuPageClose: menuPageClose,
		                    placeholder: ""
		                });
		                this.refresh();
		                if (this._origTabIndex === undefined) {
		                    this._origTabIndex = this.select[0].getAttribute("tabindex") === null ? false : this.select.attr("tabindex");
		                }
		                this.select.attr("tabindex", "-1");
		                this._on(this.select, {
		                    focus: "_handleSelectFocus"
		                });
		                this._on(this.button, {
		                    vclick: "_handleButtonVclickKeydown"
		                });
		                this.list.attr("role", "listbox");
		                this._on(this.list, {
		                    focusin: "_handleListFocus",
		                    focusout: "_handleListFocus",
		                    keydown: "_handleListKeydown",
		                    "click li:not(.ui-disabled,.ui-state-disabled,.ui-li-divider)": "_handleListItemClick"
		                });
		                this._on(this.menuPage, {
		                    pagehide: "_handleMenuPageHide"
		                });
		                this._on(this.listbox, {
		                    popupafterclose: "_popupClosed"
		                });
		                if (this.isMultiple) {
		                    this._on(this.headerClose, {
		                        click: "_handleHeaderCloseClick"
		                    });
		                }
		                return this;
		            },
		            _popupClosed: function() {
		                this.close();
		                this._delayedTrigger();
		            },
		            _delayedTrigger: function() {
		                if (this._triggerChange) {
		                    this.element.trigger("change");
		                }
		                this._triggerChange = false;
		            },
		            _isRebuildRequired: function() {
		                var list = this.list.find("li"), options = this._selectOptions().not(".ui-screen-hidden");
		                return options.text() !== list.text();
		            },
		            selected: function() {
		                return this._selectOptions().filter(":selected:not( :jqmData(placeholder='true') )");
		            },
		            refresh: function(force) {
		                var self, indices;
		                if (this.options.nativeMenu) {
		                    return this._super(force);
		                }
		                self = this;
		                if (force || this._isRebuildRequired()) {
		                    self._buildList();
		                }
		                indices = this.selectedIndices();
		                self.setButtonText();
		                self.setButtonCount();
		                self.list.find("li:not(.ui-li-divider)").find("a").removeClass($.mobile.activeBtnClass).end().attr("aria-selected", false).each(function(i) {
		                    var item = $(this);
		                    if ($.inArray(i, indices) > -1) {
		                        item.attr("aria-selected", true);
		                        if (self.isMultiple) {
		                            item.find("a").removeClass("ui-checkbox-off").addClass("ui-checkbox-on");
		                        } else {
		                            if (item.hasClass("ui-screen-hidden")) {
		                                item.next().find("a").addClass($.mobile.activeBtnClass);
		                            } else {
		                                item.find("a").addClass($.mobile.activeBtnClass);
		                            }
		                        }
		                    } else if (self.isMultiple) {
		                        item.find("a").removeClass("ui-checkbox-on").addClass("ui-checkbox-off");
		                    }
		                });
		            },
		            close: function() {
		                if (this.options.disabled || !this.isOpen) {
		                    return;
		                }
		                var self = this;
		                if (self.menuType === "page") {
		                    self.menuPage.dialog("close");
		                    self.list.appendTo(self.listbox);
		                } else {
		                    self.listbox.popup("close");
		                }
		                self._focusButton();
		                self.isOpen = false;
		            },
		            open: function() {
		                this.button.click();
		            },
		            _focusMenuItem: function() {
		                var selector = this.list.find("a." + $.mobile.activeBtnClass);
		                if (selector.length === 0) {
		                    selector = this.list.find("li:not(" + unfocusableItemSelector + ") a.ui-btn");
		                }
		                selector.first().focus();
		            },
		            _decideFormat: function() {
		                var self = this, $window = this.window, selfListParent = self.list.parent(), menuHeight = selfListParent.outerHeight(), scrollTop = $window.scrollTop(), btnOffset = self.button.offset().top, screenHeight = $window.height();
		                if (menuHeight > screenHeight - 80 || !$.support.scrollTop) {
		                    self.menuPage.appendTo($.mobile.pageContainer).page();
		                    self.menuPageContent = self.menuPage.find(".ui-content");
		                    self.menuPageClose = self.menuPage.find(".ui-header a");
		                    self.thisPage.unbind("pagehide.remove");
		                    if (scrollTop === 0 && btnOffset > screenHeight) {
		                        self.thisPage.one("pagehide", function() {
		                            $(this).jqmData("lastScroll", btnOffset);
		                        });
		                    }
		                    self.menuPage.one({
		                        pageshow: $.proxy(this, "_focusMenuItem"),
		                        pagehide: $.proxy(this, "close")
		                    });
		                    self.menuType = "page";
		                    self.menuPageContent.append(self.list);
		                    self.menuPage.find("div .ui-title").text(self.label.getEncodedText() || self.placeholder);
		                } else {
		                    self.menuType = "overlay";
		                    self.listbox.one({
		                        popupafteropen: $.proxy(this, "_focusMenuItem")
		                    });
		                }
		            },
		            _buildList: function() {
		                var self = this, o = this.options, placeholder = this.placeholder, needPlaceholder = true, dataIcon = "false", $options, numOptions, select, dataPrefix = "data-" + $.mobile.ns, dataIndexAttr = dataPrefix + "option-index", dataIconAttr = dataPrefix + "icon", dataRoleAttr = dataPrefix + "role", dataPlaceholderAttr = dataPrefix + "placeholder", fragment = document.createDocumentFragment(), isPlaceholderItem = false, optGroup, i, option, $option, parent, text, anchor, classes, optLabel, divider, item;
		                self.list.empty().filter(".ui-listview").listview("destroy");
		                $options = this._selectOptions();
		                numOptions = $options.length;
		                select = this.select[0];
		                for (i = 0; i < numOptions; i++, isPlaceholderItem = false) {
		                    option = $options[i];
		                    $option = $(option);
		                    if ($option.hasClass("ui-screen-hidden")) {
		                        continue;
		                    }
		                    parent = option.parentNode;
		                    classes = [];
		                    text = $option.text();
		                    anchor = document.createElement("a");
		                    anchor.setAttribute("href", "#");
		                    anchor.appendChild(document.createTextNode(text));
		                    if (parent !== select && parent.nodeName.toLowerCase() === "optgroup") {
		                        optLabel = parent.getAttribute("label");
		                        if (optLabel !== optGroup) {
		                            divider = document.createElement("li");
		                            divider.setAttribute(dataRoleAttr, "list-divider");
		                            divider.setAttribute("role", "option");
		                            divider.setAttribute("tabindex", "-1");
		                            divider.appendChild(document.createTextNode(optLabel));
		                            fragment.appendChild(divider);
		                            optGroup = optLabel;
		                        }
		                    }
		                    if (needPlaceholder && (!option.getAttribute("value") || text.length === 0 || $option.jqmData("placeholder"))) {
		                        needPlaceholder = false;
		                        isPlaceholderItem = true;
		                        if (null === option.getAttribute(dataPlaceholderAttr)) {
		                            this._removePlaceholderAttr = true;
		                        }
		                        option.setAttribute(dataPlaceholderAttr, true);
		                        if (o.hidePlaceholderMenuItems) {
		                            classes.push("ui-screen-hidden");
		                        }
		                        if (placeholder !== text) {
		                            placeholder = self.placeholder = text;
		                        }
		                    }
		                    item = document.createElement("li");
		                    if (option.disabled) {
		                        classes.push("ui-state-disabled");
		                        item.setAttribute("aria-disabled", true);
		                    }
		                    item.setAttribute(dataIndexAttr, i);
		                    item.setAttribute(dataIconAttr, dataIcon);
		                    if (isPlaceholderItem) {
		                        item.setAttribute(dataPlaceholderAttr, true);
		                    }
		                    item.className = classes.join(" ");
		                    item.setAttribute("role", "option");
		                    anchor.setAttribute("tabindex", "-1");
		                    if (this.isMultiple) {
		                        $(anchor).addClass("ui-btn ui-checkbox-off ui-btn-icon-right");
		                    }
		                    item.appendChild(anchor);
		                    fragment.appendChild(item);
		                }
		                self.list[0].appendChild(fragment);
		                if (!this.isMultiple && !placeholder.length) {
		                    this.header.addClass("ui-screen-hidden");
		                } else {
		                    this.headerTitle.text(this.placeholder);
		                }
		                self.list.listview();
		            },
		            _button: function() {
		                return this.options.nativeMenu ? this._super() : $("<a>", {
		                    href: "#",
		                    role: "button",
		                    id: this.buttonId,
		                    "aria-haspopup": "true",
		                    "aria-owns": this.menuId
		                });
		            },
		            _destroy: function() {
		                if (!this.options.nativeMenu) {
		                    this.close();
		                    if (this._origTabIndex !== undefined) {
		                        if (this._origTabIndex !== false) {
		                            this.select.attr("tabindex", this._origTabIndex);
		                        } else {
		                            this.select.removeAttr("tabindex");
		                        }
		                    }
		                    if (this._removePlaceholderAttr) {
		                        this._selectOptions().removeAttr("data-" + $.mobile.ns + "placeholder");
		                    }
		                    this.listbox.remove();
		                    this.menuPage.remove();
		                }
		                this._super();
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        var reverseBoolOptionMap = {
		            "ui-shadow": "shadow",
		            "ui-corner-all": "corners",
		            "ui-btn-inline": "inline",
		            "ui-shadow-icon": "iconshadow",
		            "ui-mini": "mini"
		        }, getAttrFixed = function() {
		            var ret = $.mobile.getAttribute.apply(this, arguments);
		            return ret == null ? undefined : ret;
		        }, capitalLettersRE = /[A-Z]/g;
		        function optionsToClasses(options, existingClasses) {
		            var classes = existingClasses ? existingClasses : [];
		            classes.push("ui-btn");
		            if (options.theme) {
		                classes.push("ui-btn-" + options.theme);
		            }
		            if (options.icon) {
		                classes = classes.concat([ "ui-icon-" + options.icon, "ui-btn-icon-" + options.iconpos ]);
		                if (options.iconshadow) {
		                    classes.push("ui-shadow-icon");
		                }
		            }
		            if (options.inline) {
		                classes.push("ui-btn-inline");
		            }
		            if (options.shadow) {
		                classes.push("ui-shadow");
		            }
		            if (options.corners) {
		                classes.push("ui-corner-all");
		            }
		            if (options.mini) {
		                classes.push("ui-mini");
		            }
		            return classes;
		        }
		        function classNameToOptions(classes) {
		            var idx, map, unknownClass, alreadyEnhanced = false, noIcon = true, o = {
		                icon: "",
		                inline: false,
		                shadow: false,
		                corners: false,
		                iconshadow: false,
		                mini: false
		            }, unknownClasses = [];
		            classes = classes.split(" ");
		            for (idx = 0; idx < classes.length; idx++) {
		                unknownClass = true;
		                map = reverseBoolOptionMap[classes[idx]];
		                if (map !== undefined) {
		                    unknownClass = false;
		                    o[map] = true;
		                } else if (classes[idx].indexOf("ui-btn-icon-") === 0) {
		                    unknownClass = false;
		                    noIcon = false;
		                    o.iconpos = classes[idx].substring(12);
		                } else if (classes[idx].indexOf("ui-icon-") === 0) {
		                    unknownClass = false;
		                    o.icon = classes[idx].substring(8);
		                } else if (classes[idx].indexOf("ui-btn-") === 0 && classes[idx].length === 8) {
		                    unknownClass = false;
		                    o.theme = classes[idx].substring(7);
		                } else if (classes[idx] === "ui-btn") {
		                    unknownClass = false;
		                    alreadyEnhanced = true;
		                }
		                if (unknownClass) {
		                    unknownClasses.push(classes[idx]);
		                }
		            }
		            if (noIcon) {
		                o.icon = "";
		            }
		            return {
		                options: o,
		                unknownClasses: unknownClasses,
		                alreadyEnhanced: alreadyEnhanced
		            };
		        }
		        function camelCase2Hyphenated(c) {
		            return "-" + c.toLowerCase();
		        }
		        $.fn.buttonMarkup = function(options, overwriteClasses) {
		            var idx, data, el, retrievedOptions, optionKey, defaults = $.fn.buttonMarkup.defaults;
		            for (idx = 0; idx < this.length; idx++) {
		                el = this[idx];
		                data = overwriteClasses ? {
		                    alreadyEnhanced: false,
		                    unknownClasses: []
		                } : classNameToOptions(el.className);
		                retrievedOptions = $.extend({}, data.alreadyEnhanced ? data.options : {}, options);
		                if (!data.alreadyEnhanced) {
		                    for (optionKey in defaults) {
		                        if (retrievedOptions[optionKey] === undefined) {
		                            retrievedOptions[optionKey] = getAttrFixed(el, optionKey.replace(capitalLettersRE, camelCase2Hyphenated));
		                        }
		                    }
		                }
		                el.className = optionsToClasses($.extend({}, defaults, retrievedOptions), data.unknownClasses).join(" ");
		                if (el.tagName.toLowerCase() !== "button") {
		                    el.setAttribute("role", "button");
		                }
		            }
		            return this;
		        };
		        $.fn.buttonMarkup.defaults = {
		            icon: "",
		            iconpos: "left",
		            theme: null,
		            inline: false,
		            shadow: true,
		            corners: true,
		            iconshadow: false,
		            mini: false
		        };
		        $.extend($.fn.buttonMarkup, {
		            initSelector: "a:jqmData(role='button'), .ui-bar > a, .ui-bar > :jqmData(role='controlgroup') > a, button:not(:jqmData(role='navbar') button)"
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.controlgroup", $.extend({
		            options: {
		                enhanced: false,
		                theme: null,
		                shadow: false,
		                corners: true,
		                excludeInvisible: true,
		                type: "vertical",
		                mini: false
		            },
		            _create: function() {
		                var elem = this.element, opts = this.options, keepNative = $.mobile.page.prototype.keepNativeSelector();
		                if ($.fn.buttonMarkup) {
		                    this.element.find($.fn.buttonMarkup.initSelector).not(keepNative).buttonMarkup();
		                }
		                $.each(this._childWidgets, $.proxy(function(number, widgetName) {
		                    if ($.mobile[widgetName]) {
		                        this.element.find($.mobile[widgetName].initSelector).not(keepNative)[widgetName]();
		                    }
		                }, this));
		                $.extend(this, {
		                    _ui: null,
		                    _initialRefresh: true
		                });
		                if (opts.enhanced) {
		                    this._ui = {
		                        groupLegend: elem.children(".ui-controlgroup-label").children(),
		                        childWrapper: elem.children(".ui-controlgroup-controls")
		                    };
		                } else {
		                    this._ui = this._enhance();
		                }
		            },
		            _childWidgets: [ "checkboxradio", "selectmenu", "button" ],
		            _themeClassFromOption: function(value) {
		                return value ? value === "none" ? "" : "ui-group-theme-" + value : "";
		            },
		            _enhance: function() {
		                var elem = this.element, opts = this.options, ui = {
		                    groupLegend: elem.children("legend"),
		                    childWrapper: elem.addClass("ui-controlgroup " + "ui-controlgroup-" + (opts.type === "horizontal" ? "horizontal" : "vertical") + " " + this._themeClassFromOption(opts.theme) + " " + (opts.corners ? "ui-corner-all " : "") + (opts.mini ? "ui-mini " : "")).wrapInner("<div " + "class='ui-controlgroup-controls " + (opts.shadow === true ? "ui-shadow" : "") + "'></div>").children()
		                };
		                if (ui.groupLegend.length > 0) {
		                    $("<div role='heading' class='ui-controlgroup-label'></div>").append(ui.groupLegend).prependTo(elem);
		                }
		                return ui;
		            },
		            _init: function() {
		                this.refresh();
		            },
		            _setOptions: function(options) {
		                var callRefresh, returnValue, elem = this.element;
		                if (options.type !== undefined) {
		                    elem.removeClass("ui-controlgroup-horizontal ui-controlgroup-vertical").addClass("ui-controlgroup-" + (options.type === "horizontal" ? "horizontal" : "vertical"));
		                    callRefresh = true;
		                }
		                if (options.theme !== undefined) {
		                    elem.removeClass(this._themeClassFromOption(this.options.theme)).addClass(this._themeClassFromOption(options.theme));
		                }
		                if (options.corners !== undefined) {
		                    elem.toggleClass("ui-corner-all", options.corners);
		                }
		                if (options.mini !== undefined) {
		                    elem.toggleClass("ui-mini", options.mini);
		                }
		                if (options.shadow !== undefined) {
		                    this._ui.childWrapper.toggleClass("ui-shadow", options.shadow);
		                }
		                if (options.excludeInvisible !== undefined) {
		                    this.options.excludeInvisible = options.excludeInvisible;
		                    callRefresh = true;
		                }
		                returnValue = this._super(options);
		                if (callRefresh) {
		                    this.refresh();
		                }
		                return returnValue;
		            },
		            container: function() {
		                return this._ui.childWrapper;
		            },
		            refresh: function() {
		                var $el = this.container(), els = $el.find(".ui-btn").not(".ui-slider-handle"), create = this._initialRefresh;
		                if ($.mobile.checkboxradio) {
		                    $el.find(":mobile-checkboxradio").checkboxradio("refresh");
		                }
		                this._addFirstLastClasses(els, this.options.excludeInvisible ? this._getVisibles(els, create) : els, create);
		                this._initialRefresh = false;
		            },
		            _destroy: function() {
		                var ui, buttons, opts = this.options;
		                if (opts.enhanced) {
		                    return this;
		                }
		                ui = this._ui;
		                buttons = this.element.removeClass("ui-controlgroup " + "ui-controlgroup-horizontal ui-controlgroup-vertical ui-corner-all ui-mini " + this._themeClassFromOption(opts.theme)).find(".ui-btn").not(".ui-slider-handle");
		                this._removeFirstLastClasses(buttons);
		                ui.groupLegend.unwrap();
		                ui.childWrapper.children().unwrap();
		            }
		        }, $.mobile.behaviors.addFirstLastClasses));
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.toolbar", {
		            initSelector: ":jqmData(role='footer'), :jqmData(role='header')",
		            options: {
		                theme: null,
		                addBackBtn: false,
		                backBtnTheme: null,
		                backBtnText: "Back"
		            },
		            _create: function() {
		                var leftbtn, rightbtn, role = this.element.is(":jqmData(role='header')") ? "header" : "footer", page = this.element.closest(".ui-page");
		                if (page.length === 0) {
		                    page = false;
		                    this._on(this.document, {
		                        pageshow: "refresh"
		                    });
		                }
		                $.extend(this, {
		                    role: role,
		                    page: page,
		                    leftbtn: leftbtn,
		                    rightbtn: rightbtn
		                });
		                this.element.attr("role", role === "header" ? "banner" : "contentinfo").addClass("ui-" + role);
		                this.refresh();
		                this._setOptions(this.options);
		            },
		            _setOptions: function(o) {
		                if (o.addBackBtn !== undefined) {
		                    this._updateBackButton();
		                }
		                if (o.backBtnTheme != null) {
		                    this.element.find(".ui-toolbar-back-btn").addClass("ui-btn ui-btn-" + o.backBtnTheme);
		                }
		                if (o.backBtnText !== undefined) {
		                    this.element.find(".ui-toolbar-back-btn .ui-btn-text").text(o.backBtnText);
		                }
		                if (o.theme !== undefined) {
		                    var currentTheme = this.options.theme ? this.options.theme : "inherit", newTheme = o.theme ? o.theme : "inherit";
		                    this.element.removeClass("ui-bar-" + currentTheme).addClass("ui-bar-" + newTheme);
		                }
		                this._super(o);
		            },
		            refresh: function() {
		                if (this.role === "header") {
		                    this._addHeaderButtonClasses();
		                }
		                if (!this.page) {
		                    this._setRelative();
		                    if (this.role === "footer") {
		                        this.element.appendTo("body");
		                    } else if (this.role === "header") {
		                        this._updateBackButton();
		                    }
		                }
		                this._addHeadingClasses();
		                this._btnMarkup();
		            },
		            _setRelative: function() {
		                $("[data-" + $.mobile.ns + "role='page']").css({
		                    position: "relative"
		                });
		            },
		            _btnMarkup: function() {
		                this.element.children("a").filter(":not([data-" + $.mobile.ns + "role='none'])").attr("data-" + $.mobile.ns + "role", "button");
		                this.element.trigger("create");
		            },
		            _addHeaderButtonClasses: function() {
		                var headerAnchors = this.element.children("a, button");
		                this.leftbtn = headerAnchors.hasClass("ui-btn-left") && !headerAnchors.hasClass("ui-toolbar-back-btn");
		                this.rightbtn = headerAnchors.hasClass("ui-btn-right");
		                this.leftbtn = this.leftbtn || headerAnchors.eq(0).not(".ui-btn-right,.ui-toolbar-back-btn").addClass("ui-btn-left").length;
		                this.rightbtn = this.rightbtn || headerAnchors.eq(1).addClass("ui-btn-right").length;
		            },
		            _updateBackButton: function() {
		                var backButton, options = this.options, theme = options.backBtnTheme || options.theme;
		                backButton = this._backButton = this._backButton || {};
		                if (this.options.addBackBtn && this.role === "header" && $(".ui-page").length > 1 && (this.page ? this.page[0].getAttribute("data-" + $.mobile.ns + "url") !== $.mobile.path.stripHash(location.hash) : $.mobile.navigate && $.mobile.navigate.history && $.mobile.navigate.history.activeIndex > 0) && !this.leftbtn) {
		                    if (!backButton.attached) {
		                        this.backButton = backButton.element = (backButton.element || $("<a role='button' href='javascript:void(0);' " + "class='ui-btn ui-corner-all ui-shadow ui-btn-left " + (theme ? "ui-btn-" + theme + " " : "") + "ui-toolbar-back-btn ui-icon-carat-l ui-btn-icon-left' " + "data-" + $.mobile.ns + "rel='back'>" + options.backBtnText + "</a>")).prependTo(this.element);
		                        backButton.attached = true;
		                    }
		                } else if (backButton.element) {
		                    backButton.element.detach();
		                    backButton.attached = false;
		                }
		            },
		            _addHeadingClasses: function() {
		                this.element.children("h1, h2, h3, h4, h5, h6").addClass("ui-title").attr({
		                    role: "heading",
		                    "aria-level": "1"
		                });
		            },
		            _destroy: function() {
		                var currentTheme;
		                this.element.children("h1, h2, h3, h4, h5, h6").removeClass("ui-title").removeAttr("role").removeAttr("aria-level");
		                if (this.role === "header") {
		                    this.element.children("a, button").removeClass("ui-btn-left ui-btn-right ui-btn ui-shadow ui-corner-all");
		                    if (this.backButton) {
		                        this.backButton.remove();
		                    }
		                }
		                currentTheme = this.options.theme ? this.options.theme : "inherit";
		                this.element.removeClass("ui-bar-" + currentTheme);
		                this.element.removeClass("ui-" + this.role).removeAttr("role");
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.toolbar", $.mobile.toolbar, {
		            options: {
		                position: null,
		                visibleOnPageShow: true,
		                disablePageZoom: true,
		                transition: "slide",
		                fullscreen: false,
		                tapToggle: true,
		                tapToggleBlacklist: "a, button, input, select, textarea, .ui-header-fixed, .ui-footer-fixed, .ui-flipswitch, .ui-popup, .ui-panel, .ui-panel-dismiss-open",
		                hideDuringFocus: "input, textarea, select",
		                updatePagePadding: true,
		                trackPersistentToolbars: true,
		                supportBlacklist: function() {
		                    return !$.support.fixedPosition;
		                }
		            },
		            _create: function() {
		                this._super();
		                this.pagecontainer = $(":mobile-pagecontainer");
		                if (this.options.position === "fixed" && !this.options.supportBlacklist()) {
		                    this._makeFixed();
		                }
		            },
		            _makeFixed: function() {
		                this.element.addClass("ui-" + this.role + "-fixed");
		                this.updatePagePadding();
		                this._addTransitionClass();
		                this._bindPageEvents();
		                this._bindToggleHandlers();
		            },
		            _setOptions: function(o) {
		                if (o.position === "fixed" && this.options.position !== "fixed") {
		                    this._makeFixed();
		                }
		                if (this.options.position === "fixed" && !this.options.supportBlacklist()) {
		                    var $page = !!this.page ? this.page : $(".ui-page-active").length > 0 ? $(".ui-page-active") : $(".ui-page").eq(0);
		                    if (o.fullscreen !== undefined) {
		                        if (o.fullscreen) {
		                            this.element.addClass("ui-" + this.role + "-fullscreen");
		                            $page.addClass("ui-page-" + this.role + "-fullscreen");
		                        } else {
		                            this.element.removeClass("ui-" + this.role + "-fullscreen");
		                            $page.removeClass("ui-page-" + this.role + "-fullscreen").addClass("ui-page-" + this.role + "-fixed");
		                        }
		                    }
		                }
		                this._super(o);
		            },
		            _addTransitionClass: function() {
		                var tclass = this.options.transition;
		                if (tclass && tclass !== "none") {
		                    if (tclass === "slide") {
		                        tclass = this.element.hasClass("ui-header") ? "slidedown" : "slideup";
		                    }
		                    this.element.addClass(tclass);
		                }
		            },
		            _bindPageEvents: function() {
		                var page = !!this.page ? this.element.closest(".ui-page") : this.document;
		                this._on(page, {
		                    pagebeforeshow: "_handlePageBeforeShow",
		                    webkitAnimationStart: "_handleAnimationStart",
		                    animationstart: "_handleAnimationStart",
		                    updatelayout: "_handleAnimationStart",
		                    pageshow: "_handlePageShow",
		                    pagebeforehide: "_handlePageBeforeHide"
		                });
		            },
		            _handlePageBeforeShow: function() {
		                var o = this.options;
		                if (o.disablePageZoom) {
		                    $.mobile.zoom.disable(true);
		                }
		                if (!o.visibleOnPageShow) {
		                    this.hide(true);
		                }
		            },
		            _handleAnimationStart: function() {
		                if (this.options.updatePagePadding) {
		                    this.updatePagePadding(!!this.page ? this.page : ".ui-page-active");
		                }
		            },
		            _handlePageShow: function() {
		                this.updatePagePadding(!!this.page ? this.page : ".ui-page-active");
		                if (this.options.updatePagePadding) {
		                    this._on(this.window, {
		                        throttledresize: "updatePagePadding"
		                    });
		                }
		            },
		            _handlePageBeforeHide: function(e, ui) {
		                var o = this.options, thisFooter, thisHeader, nextFooter, nextHeader;
		                if (o.disablePageZoom) {
		                    $.mobile.zoom.enable(true);
		                }
		                if (o.updatePagePadding) {
		                    this._off(this.window, "throttledresize");
		                }
		                if (o.trackPersistentToolbars) {
		                    thisFooter = $(".ui-footer-fixed:jqmData(id)", this.page);
		                    thisHeader = $(".ui-header-fixed:jqmData(id)", this.page);
		                    nextFooter = thisFooter.length && ui.nextPage && $(".ui-footer-fixed:jqmData(id='" + thisFooter.jqmData("id") + "')", ui.nextPage) || $();
		                    nextHeader = thisHeader.length && ui.nextPage && $(".ui-header-fixed:jqmData(id='" + thisHeader.jqmData("id") + "')", ui.nextPage) || $();
		                    if (nextFooter.length || nextHeader.length) {
		                        nextFooter.add(nextHeader).appendTo($.mobile.pageContainer);
		                        ui.nextPage.one("pageshow", function() {
		                            nextHeader.prependTo(this);
		                            nextFooter.appendTo(this);
		                        });
		                    }
		                }
		            },
		            _visible: true,
		            updatePagePadding: function(tbPage) {
		                var $el = this.element, header = this.role === "header", pos = parseFloat($el.css(header ? "top" : "bottom"));
		                if (this.options.fullscreen) {
		                    return;
		                }
		                tbPage = tbPage && tbPage.type === undefined && tbPage || this.page || $el.closest(".ui-page");
		                tbPage = !!this.page ? this.page : ".ui-page-active";
		                $(tbPage).css("padding-" + (header ? "top" : "bottom"), $el.outerHeight() + pos);
		            },
		            _useTransition: function(notransition) {
		                var $win = this.window, $el = this.element, scroll = $win.scrollTop(), elHeight = $el.height(), pHeight = !!this.page ? $el.closest(".ui-page").height() : $(".ui-page-active").height(), viewportHeight = $.mobile.getScreenHeight();
		                return !notransition && (this.options.transition && this.options.transition !== "none" && (this.role === "header" && !this.options.fullscreen && scroll > elHeight || this.role === "footer" && !this.options.fullscreen && scroll + viewportHeight < pHeight - elHeight) || this.options.fullscreen);
		            },
		            show: function(notransition) {
		                var hideClass = "ui-fixed-hidden", $el = this.element;
		                if (this._useTransition(notransition)) {
		                    $el.removeClass("out " + hideClass).addClass("in").animationComplete(function() {
		                        $el.removeClass("in");
		                    });
		                } else {
		                    $el.removeClass(hideClass);
		                }
		                this._visible = true;
		            },
		            hide: function(notransition) {
		                var hideClass = "ui-fixed-hidden", $el = this.element, outclass = "out" + (this.options.transition === "slide" ? " reverse" : "");
		                if (this._useTransition(notransition)) {
		                    $el.addClass(outclass).removeClass("in").animationComplete(function() {
		                        $el.addClass(hideClass).removeClass(outclass);
		                    });
		                } else {
		                    $el.addClass(hideClass).removeClass(outclass);
		                }
		                this._visible = false;
		            },
		            toggle: function() {
		                this[this._visible ? "hide" : "show"]();
		            },
		            _bindToggleHandlers: function() {
		                var self = this, o = self.options, delayShow, delayHide, isVisible = true, page = !!this.page ? this.page : $(".ui-page");
		                page.bind("vclick", function(e) {
		                    if (o.tapToggle && !$(e.target).closest(o.tapToggleBlacklist).length) {
		                        self.toggle();
		                    }
		                }).bind("focusin focusout", function(e) {
		                    if (screen.width < 1025 && $(e.target).is(o.hideDuringFocus) && !$(e.target).closest(".ui-header-fixed, .ui-footer-fixed").length) {
		                        if (e.type === "focusout" && !isVisible) {
		                            isVisible = true;
		                            clearTimeout(delayHide);
		                            delayShow = setTimeout(function() {
		                                self.show();
		                            }, 0);
		                        } else if (e.type === "focusin" && !!isVisible) {
		                            clearTimeout(delayShow);
		                            isVisible = false;
		                            delayHide = setTimeout(function() {
		                                self.hide();
		                            }, 0);
		                        }
		                    }
		                });
		            },
		            _setRelative: function() {
		                if (this.options.position !== "fixed") {
		                    $("[data-" + $.mobile.ns + "role='page']").css({
		                        position: "relative"
		                    });
		                }
		            },
		            _destroy: function() {
		                var pageClasses, toolbarClasses, hasFixed, header, hasFullscreen, page = this.pagecontainer.pagecontainer("getActivePage");
		                this._super();
		                if (this.options.position === "fixed") {
		                    hasFixed = $("body>.ui-" + this.role + "-fixed").add(page.find(".ui-" + this.options.role + "-fixed")).not(this.element).length > 0;
		                    hasFullscreen = $("body>.ui-" + this.role + "-fixed").add(page.find(".ui-" + this.options.role + "-fullscreen")).not(this.element).length > 0;
		                    toolbarClasses = "ui-header-fixed ui-footer-fixed ui-header-fullscreen in out" + " ui-footer-fullscreen fade slidedown slideup ui-fixed-hidden";
		                    this.element.removeClass(toolbarClasses);
		                    if (!hasFullscreen) {
		                        pageClasses = "ui-page-" + this.role + "-fullscreen";
		                    }
		                    if (!hasFixed) {
		                        header = this.role === "header";
		                        pageClasses += " ui-page-" + this.role + "-fixed";
		                        page.css("padding-" + (header ? "top" : "bottom"), "");
		                    }
		                    page.removeClass(pageClasses);
		                }
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.toolbar", $.mobile.toolbar, {
		            _makeFixed: function() {
		                this._super();
		                this._workarounds();
		            },
		            _workarounds: function() {
		                var ua = navigator.userAgent, platform = navigator.platform, wkmatch = ua.match(/AppleWebKit\/([0-9]+)/), wkversion = !!wkmatch && wkmatch[1], os = null, self = this;
		                if (platform.indexOf("iPhone") > -1 || platform.indexOf("iPad") > -1 || platform.indexOf("iPod") > -1) {
		                    os = "ios";
		                } else if (ua.indexOf("Android") > -1) {
		                    os = "android";
		                } else {
		                    return;
		                }
		                if (os === "ios") {
		                    self._bindScrollWorkaround();
		                } else if (os === "android" && wkversion && wkversion < 534) {
		                    self._bindScrollWorkaround();
		                    self._bindListThumbWorkaround();
		                } else {
		                    return;
		                }
		            },
		            _viewportOffset: function() {
		                var $el = this.element, header = $el.hasClass("ui-header"), offset = Math.abs($el.offset().top - this.window.scrollTop());
		                if (!header) {
		                    offset = Math.round(offset - this.window.height() + $el.outerHeight()) - 60;
		                }
		                return offset;
		            },
		            _bindScrollWorkaround: function() {
		                var self = this;
		                this._on(this.window, {
		                    scrollstop: function() {
		                        var viewportOffset = self._viewportOffset();
		                        if (viewportOffset > 2 && self._visible) {
		                            self._triggerRedraw();
		                        }
		                    }
		                });
		            },
		            _bindListThumbWorkaround: function() {
		                this.element.closest(".ui-page").addClass("ui-android-2x-fixed");
		            },
		            _triggerRedraw: function() {
		                var paddingBottom = parseFloat($(".ui-page-active").css("padding-bottom"));
		                $(".ui-page-active").css("padding-bottom", paddingBottom + 1 + "px");
		                setTimeout(function() {
		                    $(".ui-page-active").css("padding-bottom", paddingBottom + "px");
		                }, 0);
		            },
		            destroy: function() {
		                this._super();
		                this.element.closest(".ui-page-active").removeClass("ui-android-2x-fix");
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        var ieHack = $.mobile.browser.oldIE && $.mobile.browser.oldIE <= 8, uiTemplate = $("<div class='ui-popup-arrow-guide'></div>" + "<div class='ui-popup-arrow-container" + (ieHack ? " ie" : "") + "'>" + "<div class='ui-popup-arrow'></div>" + "</div>");
		        function getArrow() {
		            var clone = uiTemplate.clone(), gd = clone.eq(0), ct = clone.eq(1), ar = ct.children();
		            return {
		                arEls: ct.add(gd),
		                gd: gd,
		                ct: ct,
		                ar: ar
		            };
		        }
		        $.widget("mobile.popup", $.mobile.popup, {
		            options: {
		                arrow: ""
		            },
		            _create: function() {
		                var ar, ret = this._super();
		                if (this.options.arrow) {
		                    this._ui.arrow = ar = this._addArrow();
		                }
		                return ret;
		            },
		            _addArrow: function() {
		                var theme, opts = this.options, ar = getArrow();
		                theme = this._themeClassFromOption("ui-body-", opts.theme);
		                ar.ar.addClass(theme + (opts.shadow ? " ui-overlay-shadow" : ""));
		                ar.arEls.hide().appendTo(this.element);
		                return ar;
		            },
		            _unenhance: function() {
		                var ar = this._ui.arrow;
		                if (ar) {
		                    ar.arEls.remove();
		                }
		                return this._super();
		            },
		            _tryAnArrow: function(p, dir, desired, s, best) {
		                var result, r, diff, desiredForArrow = {}, tip = {};
		                if (s.arFull[p.dimKey] > s.guideDims[p.dimKey]) {
		                    return best;
		                }
		                desiredForArrow[p.fst] = desired[p.fst] + (s.arHalf[p.oDimKey] + s.menuHalf[p.oDimKey]) * p.offsetFactor - s.contentBox[p.fst] + (s.clampInfo.menuSize[p.oDimKey] - s.contentBox[p.oDimKey]) * p.arrowOffsetFactor;
		                desiredForArrow[p.snd] = desired[p.snd];
		                result = s.result || this._calculateFinalLocation(desiredForArrow, s.clampInfo);
		                r = {
		                    x: result.left,
		                    y: result.top
		                };
		                tip[p.fst] = r[p.fst] + s.contentBox[p.fst] + p.tipOffset;
		                tip[p.snd] = Math.max(result[p.prop] + s.guideOffset[p.prop] + s.arHalf[p.dimKey], Math.min(result[p.prop] + s.guideOffset[p.prop] + s.guideDims[p.dimKey] - s.arHalf[p.dimKey], desired[p.snd]));
		                diff = Math.abs(desired.x - tip.x) + Math.abs(desired.y - tip.y);
		                if (!best || diff < best.diff) {
		                    tip[p.snd] -= s.arHalf[p.dimKey] + result[p.prop] + s.contentBox[p.snd];
		                    best = {
		                        dir: dir,
		                        diff: diff,
		                        result: result,
		                        posProp: p.prop,
		                        posVal: tip[p.snd]
		                    };
		                }
		                return best;
		            },
		            _getPlacementState: function(clamp) {
		                var offset, gdOffset, ar = this._ui.arrow, state = {
		                    clampInfo: this._clampPopupWidth(!clamp),
		                    arFull: {
		                        cx: ar.ct.width(),
		                        cy: ar.ct.height()
		                    },
		                    guideDims: {
		                        cx: ar.gd.width(),
		                        cy: ar.gd.height()
		                    },
		                    guideOffset: ar.gd.offset()
		                };
		                offset = this.element.offset();
		                ar.gd.css({
		                    left: 0,
		                    top: 0,
		                    right: 0,
		                    bottom: 0
		                });
		                gdOffset = ar.gd.offset();
		                state.contentBox = {
		                    x: gdOffset.left - offset.left,
		                    y: gdOffset.top - offset.top,
		                    cx: ar.gd.width(),
		                    cy: ar.gd.height()
		                };
		                ar.gd.removeAttr("style");
		                state.guideOffset = {
		                    left: state.guideOffset.left - offset.left,
		                    top: state.guideOffset.top - offset.top
		                };
		                state.arHalf = {
		                    cx: state.arFull.cx / 2,
		                    cy: state.arFull.cy / 2
		                };
		                state.menuHalf = {
		                    cx: state.clampInfo.menuSize.cx / 2,
		                    cy: state.clampInfo.menuSize.cy / 2
		                };
		                return state;
		            },
		            _placementCoords: function(desired) {
		                var state, best, params, elOffset, bgRef, optionValue = this.options.arrow, ar = this._ui.arrow;
		                if (!ar) {
		                    return this._super(desired);
		                }
		                ar.arEls.show();
		                bgRef = {};
		                state = this._getPlacementState(true);
		                params = {
		                    l: {
		                        fst: "x",
		                        snd: "y",
		                        prop: "top",
		                        dimKey: "cy",
		                        oDimKey: "cx",
		                        offsetFactor: 1,
		                        tipOffset: -state.arHalf.cx,
		                        arrowOffsetFactor: 0
		                    },
		                    r: {
		                        fst: "x",
		                        snd: "y",
		                        prop: "top",
		                        dimKey: "cy",
		                        oDimKey: "cx",
		                        offsetFactor: -1,
		                        tipOffset: state.arHalf.cx + state.contentBox.cx,
		                        arrowOffsetFactor: 1
		                    },
		                    b: {
		                        fst: "y",
		                        snd: "x",
		                        prop: "left",
		                        dimKey: "cx",
		                        oDimKey: "cy",
		                        offsetFactor: -1,
		                        tipOffset: state.arHalf.cy + state.contentBox.cy,
		                        arrowOffsetFactor: 1
		                    },
		                    t: {
		                        fst: "y",
		                        snd: "x",
		                        prop: "left",
		                        dimKey: "cx",
		                        oDimKey: "cy",
		                        offsetFactor: 1,
		                        tipOffset: -state.arHalf.cy,
		                        arrowOffsetFactor: 0
		                    }
		                };
		                $.each((optionValue === true ? "l,t,r,b" : optionValue).split(","), $.proxy(function(key, value) {
		                    best = this._tryAnArrow(params[value], value, desired, state, best);
		                }, this));
		                if (!best) {
		                    ar.arEls.hide();
		                    return this._super(desired);
		                }
		                ar.ct.removeClass("ui-popup-arrow-l ui-popup-arrow-t ui-popup-arrow-r ui-popup-arrow-b").addClass("ui-popup-arrow-" + best.dir).removeAttr("style").css(best.posProp, best.posVal).show();
		                if (!ieHack) {
		                    elOffset = this.element.offset();
		                    bgRef[params[best.dir].fst] = ar.ct.offset();
		                    bgRef[params[best.dir].snd] = {
		                        left: elOffset.left + state.contentBox.x,
		                        top: elOffset.top + state.contentBox.y
		                    };
		                }
		                return best.result;
		            },
		            _setOptions: function(opts) {
		                var newTheme, oldTheme = this.options.theme, ar = this._ui.arrow, ret = this._super(opts);
		                if (opts.arrow !== undefined) {
		                    if (!ar && opts.arrow) {
		                        this._ui.arrow = this._addArrow();
		                        return;
		                    } else if (ar && !opts.arrow) {
		                        ar.arEls.remove();
		                        this._ui.arrow = null;
		                    }
		                }
		                ar = this._ui.arrow;
		                if (ar) {
		                    if (opts.theme !== undefined) {
		                        oldTheme = this._themeClassFromOption("ui-body-", oldTheme);
		                        newTheme = this._themeClassFromOption("ui-body-", opts.theme);
		                        ar.ar.removeClass(oldTheme).addClass(newTheme);
		                    }
		                    if (opts.shadow !== undefined) {
		                        ar.ar.toggleClass("ui-overlay-shadow", opts.shadow);
		                    }
		                }
		                return ret;
		            },
		            _destroy: function() {
		                var ar = this._ui.arrow;
		                if (ar) {
		                    ar.arEls.remove();
		                }
		                return this._super();
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.panel", {
		            options: {
		                classes: {
		                    panel: "ui-panel",
		                    panelOpen: "ui-panel-open",
		                    panelClosed: "ui-panel-closed",
		                    panelFixed: "ui-panel-fixed",
		                    panelInner: "ui-panel-inner",
		                    modal: "ui-panel-dismiss",
		                    modalOpen: "ui-panel-dismiss-open",
		                    pageContainer: "ui-panel-page-container",
		                    pageWrapper: "ui-panel-wrapper",
		                    pageFixedToolbar: "ui-panel-fixed-toolbar",
		                    pageContentPrefix: "ui-panel-page-content",
		                    animate: "ui-panel-animate"
		                },
		                animate: true,
		                theme: null,
		                position: "left",
		                dismissible: true,
		                display: "reveal",
		                swipeClose: true,
		                positionFixed: false
		            },
		            _closeLink: null,
		            _parentPage: null,
		            _page: null,
		            _modal: null,
		            _panelInner: null,
		            _wrapper: null,
		            _fixedToolbars: null,
		            _create: function() {
		                var el = this.element, parentPage = el.closest(".ui-page, :jqmData(role='page')");
		                $.extend(this, {
		                    _closeLink: el.find(":jqmData(rel='close')"),
		                    _parentPage: parentPage.length > 0 ? parentPage : false,
		                    _openedPage: null,
		                    _page: this._getPage,
		                    _panelInner: this._getPanelInner(),
		                    _fixedToolbars: this._getFixedToolbars
		                });
		                if (this.options.display !== "overlay") {
		                    this._getWrapper();
		                }
		                this._addPanelClasses();
		                if ($.support.cssTransform3d && !!this.options.animate) {
		                    this.element.addClass(this.options.classes.animate);
		                }
		                this._bindUpdateLayout();
		                this._bindCloseEvents();
		                this._bindLinkListeners();
		                this._bindPageEvents();
		                if (!!this.options.dismissible) {
		                    this._createModal();
		                }
		                this._bindSwipeEvents();
		            },
		            _getPanelInner: function() {
		                var panelInner = this.element.find("." + this.options.classes.panelInner);
		                if (panelInner.length === 0) {
		                    panelInner = this.element.children().wrapAll("<div class='" + this.options.classes.panelInner + "' />").parent();
		                }
		                return panelInner;
		            },
		            _createModal: function() {
		                var self = this, target = self._parentPage ? self._parentPage.parent() : self.element.parent();
		                self._modal = $("<div class='" + self.options.classes.modal + "'></div>").on("mousedown", function() {
		                    self.close();
		                }).appendTo(target);
		            },
		            _getPage: function() {
		                var page = this._openedPage || this._parentPage || $("." + $.mobile.activePageClass);
		                return page;
		            },
		            _getWrapper: function() {
		                var wrapper = this._page().find("." + this.options.classes.pageWrapper);
		                if (wrapper.length === 0) {
		                    wrapper = this._page().children(".ui-header:not(.ui-header-fixed), .ui-content:not(.ui-popup), .ui-footer:not(.ui-footer-fixed)").wrapAll("<div class='" + this.options.classes.pageWrapper + "'></div>").parent();
		                }
		                this._wrapper = wrapper;
		            },
		            _getFixedToolbars: function() {
		                var extFixedToolbars = $("body").children(".ui-header-fixed, .ui-footer-fixed"), intFixedToolbars = this._page().find(".ui-header-fixed, .ui-footer-fixed"), fixedToolbars = extFixedToolbars.add(intFixedToolbars).addClass(this.options.classes.pageFixedToolbar);
		                return fixedToolbars;
		            },
		            _getPosDisplayClasses: function(prefix) {
		                return prefix + "-position-" + this.options.position + " " + prefix + "-display-" + this.options.display;
		            },
		            _getPanelClasses: function() {
		                var panelClasses = this.options.classes.panel + " " + this._getPosDisplayClasses(this.options.classes.panel) + " " + this.options.classes.panelClosed + " " + "ui-body-" + (this.options.theme ? this.options.theme : "inherit");
		                if (!!this.options.positionFixed) {
		                    panelClasses += " " + this.options.classes.panelFixed;
		                }
		                return panelClasses;
		            },
		            _addPanelClasses: function() {
		                this.element.addClass(this._getPanelClasses());
		            },
		            _handleCloseClick: function(event) {
		                if (!event.isDefaultPrevented()) {
		                    this.close();
		                }
		            },
		            _bindCloseEvents: function() {
		                this._on(this._closeLink, {
		                    click: "_handleCloseClick"
		                });
		                this._on({
		                    "click a:jqmData(ajax='false')": "_handleCloseClick"
		                });
		            },
		            _positionPanel: function(scrollToTop) {
		                var self = this, panelInnerHeight = self._panelInner.outerHeight(), expand = panelInnerHeight > $.mobile.getScreenHeight();
		                if (expand || !self.options.positionFixed) {
		                    if (expand) {
		                        self._unfixPanel();
		                        $.mobile.resetActivePageHeight(panelInnerHeight);
		                    }
		                    if (scrollToTop) {
		                        this.window[0].scrollTo(0, $.mobile.defaultHomeScroll);
		                    }
		                } else {
		                    self._fixPanel();
		                }
		            },
		            _bindFixListener: function() {
		                this._on($(window), {
		                    throttledresize: "_positionPanel"
		                });
		            },
		            _unbindFixListener: function() {
		                this._off($(window), "throttledresize");
		            },
		            _unfixPanel: function() {
		                if (!!this.options.positionFixed && $.support.fixedPosition) {
		                    this.element.removeClass(this.options.classes.panelFixed);
		                }
		            },
		            _fixPanel: function() {
		                if (!!this.options.positionFixed && $.support.fixedPosition) {
		                    this.element.addClass(this.options.classes.panelFixed);
		                }
		            },
		            _bindUpdateLayout: function() {
		                var self = this;
		                self.element.on("updatelayout", function() {
		                    if (self._open) {
		                        self._positionPanel();
		                    }
		                });
		            },
		            _bindLinkListeners: function() {
		                this._on("body", {
		                    "click a": "_handleClick"
		                });
		            },
		            _handleClick: function(e) {
		                var link, panelId = this.element.attr("id");
		                if (e.currentTarget.href.split("#")[1] === panelId && panelId !== undefined) {
		                    e.preventDefault();
		                    link = $(e.target);
		                    if (link.hasClass("ui-btn")) {
		                        link.addClass($.mobile.activeBtnClass);
		                        this.element.one("panelopen panelclose", function() {
		                            link.removeClass($.mobile.activeBtnClass);
		                        });
		                    }
		                    this.toggle();
		                }
		            },
		            _bindSwipeEvents: function() {
		                var self = this, area = self._modal ? self.element.add(self._modal) : self.element;
		                if (!!self.options.swipeClose) {
		                    if (self.options.position === "left") {
		                        area.on("swipeleft.panel", function() {
		                            self.close();
		                        });
		                    } else {
		                        area.on("swiperight.panel", function() {
		                            self.close();
		                        });
		                    }
		                }
		            },
		            _bindPageEvents: function() {
		                var self = this;
		                this.document.on("panelbeforeopen", function(e) {
		                    if (self._open && e.target !== self.element[0]) {
		                        self.close();
		                    }
		                }).on("keyup.panel", function(e) {
		                    if (e.keyCode === 27 && self._open) {
		                        self.close();
		                    }
		                });
		                if (!this._parentPage && this.options.display !== "overlay") {
		                    this._on(this.document, {
		                        pageshow: function() {
		                            this._openedPage = null;
		                            this._getWrapper();
		                        }
		                    });
		                }
		                if (self._parentPage) {
		                    this.document.on("pagehide", ":jqmData(role='page')", function() {
		                        if (self._open) {
		                            self.close(true);
		                        }
		                    });
		                } else {
		                    this.document.on("pagebeforehide", function() {
		                        if (self._open) {
		                            self.close(true);
		                        }
		                    });
		                }
		            },
		            _open: false,
		            _pageContentOpenClasses: null,
		            _modalOpenClasses: null,
		            open: function(immediate) {
		                if (!this._open) {
		                    var self = this, o = self.options, _openPanel = function() {
		                        self._off(self.document, "panelclose");
		                        self._page().jqmData("panel", "open");
		                        if ($.support.cssTransform3d && !!o.animate && o.display !== "overlay") {
		                            self._wrapper.addClass(o.classes.animate);
		                            self._fixedToolbars().addClass(o.classes.animate);
		                        }
		                        if (!immediate && $.support.cssTransform3d && !!o.animate) {
		                            (self._wrapper || self.element).animationComplete(complete, "transition");
		                        } else {
		                            setTimeout(complete, 0);
		                        }
		                        if (o.theme && o.display !== "overlay") {
		                            self._page().parent().addClass(o.classes.pageContainer + "-themed " + o.classes.pageContainer + "-" + o.theme);
		                        }
		                        self.element.removeClass(o.classes.panelClosed).addClass(o.classes.panelOpen);
		                        self._positionPanel(true);
		                        self._pageContentOpenClasses = self._getPosDisplayClasses(o.classes.pageContentPrefix);
		                        if (o.display !== "overlay") {
		                            self._page().parent().addClass(o.classes.pageContainer);
		                            self._wrapper.addClass(self._pageContentOpenClasses);
		                            self._fixedToolbars().addClass(self._pageContentOpenClasses);
		                        }
		                        self._modalOpenClasses = self._getPosDisplayClasses(o.classes.modal) + " " + o.classes.modalOpen;
		                        if (self._modal) {
		                            self._modal.addClass(self._modalOpenClasses).height(Math.max(self._modal.height(), self.document.height()));
		                        }
		                    }, complete = function() {
		                        if (!self._open) {
		                            return;
		                        }
		                        if (o.display !== "overlay") {
		                            self._wrapper.addClass(o.classes.pageContentPrefix + "-open");
		                            self._fixedToolbars().addClass(o.classes.pageContentPrefix + "-open");
		                        }
		                        self._bindFixListener();
		                        self._trigger("open");
		                        self._openedPage = self._page();
		                    };
		                    self._trigger("beforeopen");
		                    if (self._page().jqmData("panel") === "open") {
		                        self._on(self.document, {
		                            panelclose: _openPanel
		                        });
		                    } else {
		                        _openPanel();
		                    }
		                    self._open = true;
		                }
		            },
		            close: function(immediate) {
		                if (this._open) {
		                    var self = this, o = this.options, _closePanel = function() {
		                        self.element.removeClass(o.classes.panelOpen);
		                        if (o.display !== "overlay") {
		                            self._wrapper.removeClass(self._pageContentOpenClasses);
		                            self._fixedToolbars().removeClass(self._pageContentOpenClasses);
		                        }
		                        if (!immediate && $.support.cssTransform3d && !!o.animate) {
		                            (self._wrapper || self.element).animationComplete(complete, "transition");
		                        } else {
		                            setTimeout(complete, 0);
		                        }
		                        if (self._modal) {
		                            self._modal.removeClass(self._modalOpenClasses).height("");
		                        }
		                    }, complete = function() {
		                        if (o.theme && o.display !== "overlay") {
		                            self._page().parent().removeClass(o.classes.pageContainer + "-themed " + o.classes.pageContainer + "-" + o.theme);
		                        }
		                        self.element.addClass(o.classes.panelClosed);
		                        if (o.display !== "overlay") {
		                            self._page().parent().removeClass(o.classes.pageContainer);
		                            self._wrapper.removeClass(o.classes.pageContentPrefix + "-open");
		                            self._fixedToolbars().removeClass(o.classes.pageContentPrefix + "-open");
		                        }
		                        if ($.support.cssTransform3d && !!o.animate && o.display !== "overlay") {
		                            self._wrapper.removeClass(o.classes.animate);
		                            self._fixedToolbars().removeClass(o.classes.animate);
		                        }
		                        self._fixPanel();
		                        self._unbindFixListener();
		                        $.mobile.resetActivePageHeight();
		                        self._page().jqmRemoveData("panel");
		                        self._trigger("close");
		                        self._openedPage = null;
		                    };
		                    self._trigger("beforeclose");
		                    _closePanel();
		                    self._open = false;
		                }
		            },
		            toggle: function() {
		                this[this._open ? "close" : "open"]();
		            },
		            _destroy: function() {
		                var otherPanels, o = this.options, multiplePanels = $("body > :mobile-panel").length + $.mobile.activePage.find(":mobile-panel").length > 1;
		                if (o.display !== "overlay") {
		                    otherPanels = $("body > :mobile-panel").add($.mobile.activePage.find(":mobile-panel"));
		                    if (otherPanels.not(".ui-panel-display-overlay").not(this.element).length === 0) {
		                        this._wrapper.children().unwrap();
		                    }
		                    if (this._open) {
		                        this._fixedToolbars().removeClass(o.classes.pageContentPrefix + "-open");
		                        if ($.support.cssTransform3d && !!o.animate) {
		                            this._fixedToolbars().removeClass(o.classes.animate);
		                        }
		                        this._page().parent().removeClass(o.classes.pageContainer);
		                        if (o.theme) {
		                            this._page().parent().removeClass(o.classes.pageContainer + "-themed " + o.classes.pageContainer + "-" + o.theme);
		                        }
		                    }
		                }
		                if (!multiplePanels) {
		                    this.document.off("panelopen panelclose");
		                }
		                if (this._open) {
		                    this._page().jqmRemoveData("panel");
		                }
		                this._panelInner.children().unwrap();
		                this.element.removeClass([ this._getPanelClasses(), o.classes.panelOpen, o.classes.animate ].join(" ")).off("swipeleft.panel swiperight.panel").off("panelbeforeopen").off("panelhide").off("keyup.panel").off("updatelayout");
		                if (this._modal) {
		                    this._modal.remove();
		                }
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.table", {
		            options: {
		                classes: {
		                    table: "ui-table"
		                },
		                enhanced: false
		            },
		            _create: function() {
		                if (!this.options.enhanced) {
		                    this.element.addClass(this.options.classes.table);
		                }
		                $.extend(this, {
		                    headers: undefined,
		                    allHeaders: undefined
		                });
		                this._refresh(true);
		            },
		            _setHeaders: function() {
		                var trs = this.element.find("thead tr");
		                this.headers = this.element.find("tr:eq(0)").children();
		                this.allHeaders = this.headers.add(trs.children());
		            },
		            refresh: function() {
		                this._refresh();
		            },
		            rebuild: $.noop,
		            _refresh: function() {
		                var table = this.element, trs = table.find("thead tr");
		                this._setHeaders();
		                trs.each(function() {
		                    var columnCount = 0;
		                    $(this).children().each(function() {
		                        var span = parseInt(this.getAttribute("colspan"), 10), selector = ":nth-child(" + (columnCount + 1) + ")", j;
		                        this.setAttribute("data-" + $.mobile.ns + "colstart", columnCount + 1);
		                        if (span) {
		                            for (j = 0; j < span - 1; j++) {
		                                columnCount++;
		                                selector += ", :nth-child(" + (columnCount + 1) + ")";
		                            }
		                        }
		                        $(this).jqmData("cells", table.find("tr").not(trs.eq(0)).not(this).children(selector));
		                        columnCount++;
		                    });
		                });
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.table", $.mobile.table, {
		            options: {
		                mode: "columntoggle",
		                columnBtnTheme: null,
		                columnPopupTheme: null,
		                columnBtnText: "Columns...",
		                classes: $.extend($.mobile.table.prototype.options.classes, {
		                    popup: "ui-table-columntoggle-popup",
		                    columnBtn: "ui-table-columntoggle-btn",
		                    priorityPrefix: "ui-table-priority-",
		                    columnToggleTable: "ui-table-columntoggle"
		                })
		            },
		            _create: function() {
		                this._super();
		                if (this.options.mode !== "columntoggle") {
		                    return;
		                }
		                $.extend(this, {
		                    _menu: null
		                });
		                if (this.options.enhanced) {
		                    this._menu = $(this.document[0].getElementById(this._id() + "-popup")).children().first();
		                    this._addToggles(this._menu, true);
		                } else {
		                    this._menu = this._enhanceColToggle();
		                    this.element.addClass(this.options.classes.columnToggleTable);
		                }
		                this._setupEvents();
		                this._setToggleState();
		            },
		            _id: function() {
		                return this.element.attr("id") || this.widgetName + this.uuid;
		            },
		            _setupEvents: function() {
		                this._on(this.window, {
		                    throttledresize: "_setToggleState"
		                });
		                this._on(this._menu, {
		                    "change input": "_menuInputChange"
		                });
		            },
		            _addToggles: function(menu, keep) {
		                var inputs, checkboxIndex = 0, opts = this.options, container = menu.controlgroup("container");
		                if (keep) {
		                    inputs = menu.find("input");
		                } else {
		                    container.empty();
		                }
		                this.headers.not("td").each(function() {
		                    var input, cells, header = $(this), priority = $.mobile.getAttribute(this, "priority");
		                    if (priority) {
		                        cells = header.add(header.jqmData("cells"));
		                        cells.addClass(opts.classes.priorityPrefix + priority);
		                        input = (keep ? inputs.eq(checkboxIndex++) : $("<label><input type='checkbox' checked />" + (header.children("abbr").first().attr("title") || header.text()) + "</label>").appendTo(container).children(0).checkboxradio({
		                            theme: opts.columnPopupTheme
		                        })).jqmData("header", header).jqmData("cells", cells);
		                        header.jqmData("input", input);
		                    }
		                });
		                if (!keep) {
		                    menu.controlgroup("refresh");
		                }
		            },
		            _menuInputChange: function(evt) {
		                var input = $(evt.target), checked = input[0].checked;
		                input.jqmData("cells").toggleClass("ui-table-cell-hidden", !checked).toggleClass("ui-table-cell-visible", checked);
		            },
		            _unlockCells: function(cells) {
		                cells.removeClass("ui-table-cell-hidden ui-table-cell-visible");
		            },
		            _enhanceColToggle: function() {
		                var id, menuButton, popup, menu, table = this.element, opts = this.options, ns = $.mobile.ns, fragment = this.document[0].createDocumentFragment();
		                id = this._id() + "-popup";
		                menuButton = $("<a href='#" + id + "' " + "class='" + opts.classes.columnBtn + " ui-btn " + "ui-btn-" + (opts.columnBtnTheme || "a") + " ui-corner-all ui-shadow ui-mini' " + "data-" + ns + "rel='popup'>" + opts.columnBtnText + "</a>");
		                popup = $("<div class='" + opts.classes.popup + "' id='" + id + "'></div>");
		                menu = $("<fieldset></fieldset>").controlgroup();
		                this._addToggles(menu, false);
		                menu.appendTo(popup);
		                fragment.appendChild(popup[0]);
		                fragment.appendChild(menuButton[0]);
		                table.before(fragment);
		                popup.popup();
		                return menu;
		            },
		            rebuild: function() {
		                this._super();
		                if (this.options.mode === "columntoggle") {
		                    this._refresh(false);
		                }
		            },
		            _refresh: function(create) {
		                var headers, hiddenColumns, index;
		                this._super(create);
		                if (!create && this.options.mode === "columntoggle") {
		                    headers = this.headers;
		                    hiddenColumns = [];
		                    this._menu.find("input").each(function() {
		                        var input = $(this), header = input.jqmData("header"), index = headers.index(header[0]);
		                        if (index > -1 && !input.prop("checked")) {
		                            hiddenColumns.push(index);
		                        }
		                    });
		                    this._unlockCells(this.element.find(".ui-table-cell-hidden, " + ".ui-table-cell-visible"));
		                    this._addToggles(this._menu, create);
		                    for (index = hiddenColumns.length - 1; index > -1; index--) {
		                        headers.eq(hiddenColumns[index]).jqmData("input").prop("checked", false).checkboxradio("refresh").trigger("change");
		                    }
		                }
		            },
		            _setToggleState: function() {
		                this._menu.find("input").each(function() {
		                    var checkbox = $(this);
		                    this.checked = checkbox.jqmData("cells").eq(0).css("display") === "table-cell";
		                    checkbox.checkboxradio("refresh");
		                });
		            },
		            _destroy: function() {
		                this._super();
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        $.widget("mobile.table", $.mobile.table, {
		            options: {
		                mode: "reflow",
		                classes: $.extend($.mobile.table.prototype.options.classes, {
		                    reflowTable: "ui-table-reflow",
		                    cellLabels: "ui-table-cell-label"
		                })
		            },
		            _create: function() {
		                this._super();
		                if (this.options.mode !== "reflow") {
		                    return;
		                }
		                if (!this.options.enhanced) {
		                    this.element.addClass(this.options.classes.reflowTable);
		                    this._updateReflow();
		                }
		            },
		            rebuild: function() {
		                this._super();
		                if (this.options.mode === "reflow") {
		                    this._refresh(false);
		                }
		            },
		            _refresh: function(create) {
		                this._super(create);
		                if (!create && this.options.mode === "reflow") {
		                    this._updateReflow();
		                }
		            },
		            _updateReflow: function() {
		                var table = this, opts = this.options;
		                $(table.allHeaders.get().reverse()).each(function() {
		                    var cells = $(this).jqmData("cells"), colstart = $.mobile.getAttribute(this, "colstart"), hierarchyClass = cells.not(this).filter("thead th").length && " ui-table-cell-label-top", contents = $(this).clone().contents(), iteration, filter;
		                    if (contents.length > 0) {
		                        if (hierarchyClass) {
		                            iteration = parseInt(this.getAttribute("colspan"), 10);
		                            filter = "";
		                            if (iteration) {
		                                filter = "td:nth-child(" + iteration + "n + " + colstart + ")";
		                            }
		                            table._addLabels(cells.filter(filter), opts.classes.cellLabels + hierarchyClass, contents);
		                        } else {
		                            table._addLabels(cells, opts.classes.cellLabels, contents);
		                        }
		                    }
		                });
		            },
		            _addLabels: function(cells, label, contents) {
		                if (contents.length === 1 && contents[0].nodeName.toLowerCase() === "abbr") {
		                    contents = contents.eq(0).attr("title");
		                }
		                cells.not(":has(b." + label + ")").prepend($("<b class='" + label + "'></b>").append(contents));
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        var defaultFilterCallback = function(index, searchValue) {
		            return ("" + ($.mobile.getAttribute(this, "filtertext") || $(this).text())).toLowerCase().indexOf(searchValue) === -1;
		        };
		        $.widget("mobile.filterable", {
		            initSelector: ":jqmData(filter='true')",
		            options: {
		                filterReveal: false,
		                filterCallback: defaultFilterCallback,
		                enhanced: false,
		                input: null,
		                children: "> li, > option, > optgroup option, > tbody tr, > .ui-controlgroup-controls > .ui-btn, > .ui-controlgroup-controls > .ui-checkbox, > .ui-controlgroup-controls > .ui-radio"
		            },
		            _create: function() {
		                var opts = this.options;
		                $.extend(this, {
		                    _search: null,
		                    _timer: 0
		                });
		                this._setInput(opts.input);
		                if (!opts.enhanced) {
		                    this._filterItems((this._search && this._search.val() || "").toLowerCase());
		                }
		            },
		            _onKeyUp: function() {
		                var val, lastval, search = this._search;
		                if (search) {
		                    val = search.val().toLowerCase(), lastval = $.mobile.getAttribute(search[0], "lastval") + "";
		                    if (lastval && lastval === val) {
		                        return;
		                    }
		                    if (this._timer) {
		                        window.clearTimeout(this._timer);
		                        this._timer = 0;
		                    }
		                    this._timer = this._delay(function() {
		                        if (this._trigger("beforefilter", null, {
		                            input: search
		                        }) === false) {
		                            return false;
		                        }
		                        search[0].setAttribute("data-" + $.mobile.ns + "lastval", val);
		                        this._filterItems(val);
		                        this._timer = 0;
		                    }, 250);
		                }
		            },
		            _getFilterableItems: function() {
		                var elem = this.element, children = this.options.children, items = !children ? {
		                    length: 0
		                } : $.isFunction(children) ? children() : children.nodeName ? $(children) : children.jquery ? children : this.element.find(children);
		                if (items.length === 0) {
		                    items = elem.children();
		                }
		                return items;
		            },
		            _filterItems: function(val) {
		                var idx, callback, length, dst, show = [], hide = [], opts = this.options, filterItems = this._getFilterableItems();
		                if (val != null) {
		                    callback = opts.filterCallback || defaultFilterCallback;
		                    length = filterItems.length;
		                    for (idx = 0; idx < length; idx++) {
		                        dst = callback.call(filterItems[idx], idx, val) ? hide : show;
		                        dst.push(filterItems[idx]);
		                    }
		                }
		                if (hide.length === 0) {
		                    filterItems[opts.filterReveal && val.length === 0 ? "addClass" : "removeClass"]("ui-screen-hidden");
		                } else {
		                    $(hide).addClass("ui-screen-hidden");
		                    $(show).removeClass("ui-screen-hidden");
		                }
		                this._refreshChildWidget();
		                this._trigger("filter", null, {
		                    items: filterItems
		                });
		            },
		            _refreshChildWidget: function() {
		                var widget, idx, recognizedWidgets = [ "collapsibleset", "selectmenu", "controlgroup", "listview" ];
		                for (idx = recognizedWidgets.length - 1; idx > -1; idx--) {
		                    widget = recognizedWidgets[idx];
		                    if ($.mobile[widget]) {
		                        widget = this.element.data("mobile-" + widget);
		                        if (widget && $.isFunction(widget.refresh)) {
		                            widget.refresh();
		                        }
		                    }
		                }
		            },
		            _setInput: function(selector) {
		                var search = this._search;
		                if (this._timer) {
		                    window.clearTimeout(this._timer);
		                    this._timer = 0;
		                }
		                if (search) {
		                    this._off(search, "keyup change input");
		                    search = null;
		                }
		                if (selector) {
		                    search = selector.jquery ? selector : selector.nodeName ? $(selector) : this.document.find(selector);
		                    this._on(search, {
		                        keydown: "_onKeyDown",
		                        keypress: "_onKeyPress",
		                        keyup: "_onKeyUp",
		                        change: "_onKeyUp",
		                        input: "_onKeyUp"
		                    });
		                }
		                this._search = search;
		            },
		            _onKeyDown: function(event) {
		                if (event.keyCode === $.ui.keyCode.ENTER) {
		                    event.preventDefault();
		                    this._preventKeyPress = true;
		                }
		            },
		            _onKeyPress: function(event) {
		                if (this._preventKeyPress) {
		                    event.preventDefault();
		                    this._preventKeyPress = false;
		                }
		            },
		            _setOptions: function(options) {
		                var refilter = !(options.filterReveal === undefined && options.filterCallback === undefined && options.children === undefined);
		                this._super(options);
		                if (options.input !== undefined) {
		                    this._setInput(options.input);
		                    refilter = true;
		                }
		                if (refilter) {
		                    this.refresh();
		                }
		            },
		            _destroy: function() {
		                var opts = this.options, items = this._getFilterableItems();
		                if (opts.enhanced) {
		                    items.toggleClass("ui-screen-hidden", opts.filterReveal);
		                } else {
		                    items.removeClass("ui-screen-hidden");
		                }
		            },
		            refresh: function() {
		                if (this._timer) {
		                    window.clearTimeout(this._timer);
		                    this._timer = 0;
		                }
		                this._filterItems((this._search && this._search.val() || "").toLowerCase());
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        var replaceSetOptions = function(self, orig) {
		            return function(options) {
		                orig.call(this, options);
		                self._syncTextInputOptions(options);
		            };
		        }, rDividerListItem = /(^|\s)ui-li-divider(\s|$)/, origDefaultFilterCallback = $.mobile.filterable.prototype.options.filterCallback;
		        $.mobile.filterable.prototype.options.filterCallback = function(index, searchValue) {
		            return !this.className.match(rDividerListItem) && origDefaultFilterCallback.call(this, index, searchValue);
		        };
		        $.widget("mobile.filterable", $.mobile.filterable, {
		            options: {
		                filterPlaceholder: "Filter items...",
		                filterTheme: null
		            },
		            _create: function() {
		                var idx, widgetName, elem = this.element, recognizedWidgets = [ "collapsibleset", "selectmenu", "controlgroup", "listview" ], createHandlers = {};
		                this._super();
		                $.extend(this, {
		                    _widget: null
		                });
		                for (idx = recognizedWidgets.length - 1; idx > -1; idx--) {
		                    widgetName = recognizedWidgets[idx];
		                    if ($.mobile[widgetName]) {
		                        if (this._setWidget(elem.data("mobile-" + widgetName))) {
		                            break;
		                        } else {
		                            createHandlers[widgetName + "create"] = "_handleCreate";
		                        }
		                    }
		                }
		                if (!this._widget) {
		                    this._on(elem, createHandlers);
		                }
		            },
		            _handleCreate: function(evt) {
		                this._setWidget(this.element.data("mobile-" + evt.type.substring(0, evt.type.length - 6)));
		            },
		            _trigger: function(type, event, data) {
		                if (this._widget && this._widget.widgetFullName === "mobile-listview" && type === "beforefilter") {
		                    this._widget._trigger("beforefilter", event, data);
		                }
		                return this._super(type, event, data);
		            },
		            _setWidget: function(widget) {
		                if (!this._widget && widget) {
		                    this._widget = widget;
		                    this._widget._setOptions = replaceSetOptions(this, this._widget._setOptions);
		                }
		                if (!!this._widget) {
		                    this._syncTextInputOptions(this._widget.options);
		                    if (this._widget.widgetName === "listview") {
		                        this._widget.options.hideDividers = true;
		                        this._widget.element.listview("refresh");
		                    }
		                }
		                return !!this._widget;
		            },
		            _isSearchInternal: function() {
		                return this._search && this._search.jqmData("ui-filterable-" + this.uuid + "-internal");
		            },
		            _setInput: function(selector) {
		                var opts = this.options, updatePlaceholder = true, textinputOpts = {};
		                if (!selector) {
		                    if (this._isSearchInternal()) {
		                        return;
		                    } else {
		                        updatePlaceholder = false;
		                        selector = $("<input " + "data-" + $.mobile.ns + "type='search' " + "placeholder='" + opts.filterPlaceholder + "'></input>").jqmData("ui-filterable-" + this.uuid + "-internal", true);
		                        $("<form class='ui-filterable'></form>").append(selector).submit(function(evt) {
		                            evt.preventDefault();
		                            selector.blur();
		                        }).insertBefore(this.element);
		                        if ($.mobile.textinput) {
		                            if (this.options.filterTheme != null) {
		                                textinputOpts["theme"] = opts.filterTheme;
		                            }
		                            selector.textinput(textinputOpts);
		                        }
		                    }
		                }
		                this._super(selector);
		                if (this._isSearchInternal() && updatePlaceholder) {
		                    this._search.attr("placeholder", this.options.filterPlaceholder);
		                }
		            },
		            _setOptions: function(options) {
		                var ret = this._super(options);
		                if (options.filterPlaceholder !== undefined) {
		                    if (this._isSearchInternal()) {
		                        this._search.attr("placeholder", options.filterPlaceholder);
		                    }
		                }
		                if (options.filterTheme !== undefined && this._search && $.mobile.textinput) {
		                    this._search.textinput("option", "theme", options.filterTheme);
		                }
		                return ret;
		            },
		            _refreshChildWidget: function() {
		                this._refreshingChildWidget = true;
		                this._superApply(arguments);
		                this._refreshingChildWidget = false;
		            },
		            refresh: function() {
		                if (!this._refreshingChildWidget) {
		                    this._superApply(arguments);
		                }
		            },
		            _destroy: function() {
		                if (this._isSearchInternal()) {
		                    this._search.remove();
		                }
		                this._super();
		            },
		            _syncTextInputOptions: function(options) {
		                var idx, textinputOptions = {};
		                if (this._isSearchInternal() && $.mobile.textinput) {
		                    for (idx in $.mobile.textinput.prototype.options) {
		                        if (options[idx] !== undefined) {
		                            if (idx === "theme" && this.options.filterTheme != null) {
		                                textinputOptions[idx] = this.options.filterTheme;
		                            } else {
		                                textinputOptions[idx] = options[idx];
		                            }
		                        }
		                    }
		                    this._search.textinput("option", textinputOptions);
		                }
		            }
		        });
		        $.widget("mobile.listview", $.mobile.listview, {
		            options: {
		                filter: false
		            },
		            _create: function() {
		                if (this.options.filter === true && !this.element.data("mobile-filterable")) {
		                    this.element.filterable();
		                }
		                return this._super();
		            },
		            refresh: function() {
		                var filterable;
		                this._superApply(arguments);
		                if (this.options.filter === true) {
		                    filterable = this.element.data("mobile-filterable");
		                    if (filterable) {
		                        filterable.refresh();
		                    }
		                }
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {
		        var tabId = 0, rhash = /#.*$/;
		        function getNextTabId() {
		            return ++tabId;
		        }
		        function isLocal(anchor) {
		            return anchor.hash.length > 1 && decodeURIComponent(anchor.href.replace(rhash, "")) === decodeURIComponent(location.href.replace(rhash, ""));
		        }
		        $.widget("ui.tabs", {
		            version: "fadf2b312a05040436451c64bbfaf4814bc62c56",
		            delay: 300,
		            options: {
		                active: null,
		                collapsible: false,
		                event: "click",
		                heightStyle: "content",
		                hide: null,
		                show: null,
		                activate: null,
		                beforeActivate: null,
		                beforeLoad: null,
		                load: null
		            },
		            _create: function() {
		                var that = this, options = this.options;
		                this.running = false;
		                this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all").toggleClass("ui-tabs-collapsible", options.collapsible).delegate(".ui-tabs-nav > li", "mousedown" + this.eventNamespace, function(event) {
		                    if ($(this).is(".ui-state-disabled")) {
		                        event.preventDefault();
		                    }
		                }).delegate(".ui-tabs-anchor", "focus" + this.eventNamespace, function() {
		                    if ($(this).closest("li").is(".ui-state-disabled")) {
		                        this.blur();
		                    }
		                });
		                this._processTabs();
		                options.active = this._initialActive();
		                if ($.isArray(options.disabled)) {
		                    options.disabled = $.unique(options.disabled.concat($.map(this.tabs.filter(".ui-state-disabled"), function(li) {
		                        return that.tabs.index(li);
		                    }))).sort();
		                }
		                if (this.options.active !== false && this.anchors.length) {
		                    this.active = this._findActive(options.active);
		                } else {
		                    this.active = $();
		                }
		                this._refresh();
		                if (this.active.length) {
		                    this.load(options.active);
		                }
		            },
		            _initialActive: function() {
		                var active = this.options.active, collapsible = this.options.collapsible, locationHash = location.hash.substring(1);
		                if (active === null) {
		                    if (locationHash) {
		                        this.tabs.each(function(i, tab) {
		                            if ($(tab).attr("aria-controls") === locationHash) {
		                                active = i;
		                                return false;
		                            }
		                        });
		                    }
		                    if (active === null) {
		                        active = this.tabs.index(this.tabs.filter(".ui-tabs-active"));
		                    }
		                    if (active === null || active === -1) {
		                        active = this.tabs.length ? 0 : false;
		                    }
		                }
		                if (active !== false) {
		                    active = this.tabs.index(this.tabs.eq(active));
		                    if (active === -1) {
		                        active = collapsible ? false : 0;
		                    }
		                }
		                if (!collapsible && active === false && this.anchors.length) {
		                    active = 0;
		                }
		                return active;
		            },
		            _getCreateEventData: function() {
		                return {
		                    tab: this.active,
		                    panel: !this.active.length ? $() : this._getPanelForTab(this.active)
		                };
		            },
		            _tabKeydown: function(event) {
		                var focusedTab = $(this.document[0].activeElement).closest("li"), selectedIndex = this.tabs.index(focusedTab), goingForward = true;
		                if (this._handlePageNav(event)) {
		                    return;
		                }
		                switch (event.keyCode) {
		                  case $.ui.keyCode.RIGHT:
		                  case $.ui.keyCode.DOWN:
		                    selectedIndex++;
		                    break;

		                  case $.ui.keyCode.UP:
		                  case $.ui.keyCode.LEFT:
		                    goingForward = false;
		                    selectedIndex--;
		                    break;

		                  case $.ui.keyCode.END:
		                    selectedIndex = this.anchors.length - 1;
		                    break;

		                  case $.ui.keyCode.HOME:
		                    selectedIndex = 0;
		                    break;

		                  case $.ui.keyCode.SPACE:
		                    event.preventDefault();
		                    clearTimeout(this.activating);
		                    this._activate(selectedIndex);
		                    return;

		                  case $.ui.keyCode.ENTER:
		                    event.preventDefault();
		                    clearTimeout(this.activating);
		                    this._activate(selectedIndex === this.options.active ? false : selectedIndex);
		                    return;

		                  default:
		                    return;
		                }
		                event.preventDefault();
		                clearTimeout(this.activating);
		                selectedIndex = this._focusNextTab(selectedIndex, goingForward);
		                if (!event.ctrlKey) {
		                    focusedTab.attr("aria-selected", "false");
		                    this.tabs.eq(selectedIndex).attr("aria-selected", "true");
		                    this.activating = this._delay(function() {
		                        this.option("active", selectedIndex);
		                    }, this.delay);
		                }
		            },
		            _panelKeydown: function(event) {
		                if (this._handlePageNav(event)) {
		                    return;
		                }
		                if (event.ctrlKey && event.keyCode === $.ui.keyCode.UP) {
		                    event.preventDefault();
		                    this.active.focus();
		                }
		            },
		            _handlePageNav: function(event) {
		                if (event.altKey && event.keyCode === $.ui.keyCode.PAGE_UP) {
		                    this._activate(this._focusNextTab(this.options.active - 1, false));
		                    return true;
		                }
		                if (event.altKey && event.keyCode === $.ui.keyCode.PAGE_DOWN) {
		                    this._activate(this._focusNextTab(this.options.active + 1, true));
		                    return true;
		                }
		            },
		            _findNextTab: function(index, goingForward) {
		                var lastTabIndex = this.tabs.length - 1;
		                function constrain() {
		                    if (index > lastTabIndex) {
		                        index = 0;
		                    }
		                    if (index < 0) {
		                        index = lastTabIndex;
		                    }
		                    return index;
		                }
		                while ($.inArray(constrain(), this.options.disabled) !== -1) {
		                    index = goingForward ? index + 1 : index - 1;
		                }
		                return index;
		            },
		            _focusNextTab: function(index, goingForward) {
		                index = this._findNextTab(index, goingForward);
		                this.tabs.eq(index).focus();
		                return index;
		            },
		            _setOption: function(key, value) {
		                if (key === "active") {
		                    this._activate(value);
		                    return;
		                }
		                if (key === "disabled") {
		                    this._setupDisabled(value);
		                    return;
		                }
		                this._super(key, value);
		                if (key === "collapsible") {
		                    this.element.toggleClass("ui-tabs-collapsible", value);
		                    if (!value && this.options.active === false) {
		                        this._activate(0);
		                    }
		                }
		                if (key === "event") {
		                    this._setupEvents(value);
		                }
		                if (key === "heightStyle") {
		                    this._setupHeightStyle(value);
		                }
		            },
		            _tabId: function(tab) {
		                return tab.attr("aria-controls") || "ui-tabs-" + getNextTabId();
		            },
		            _sanitizeSelector: function(hash) {
		                return hash ? hash.replace(/[!"$%&'()*+,.\/:;<=>?@\[\]\^`{|}~]/g, "\\$&") : "";
		            },
		            refresh: function() {
		                var options = this.options, lis = this.tablist.children(":has(a[href])");
		                options.disabled = $.map(lis.filter(".ui-state-disabled"), function(tab) {
		                    return lis.index(tab);
		                });
		                this._processTabs();
		                if (options.active === false || !this.anchors.length) {
		                    options.active = false;
		                    this.active = $();
		                } else if (this.active.length && !$.contains(this.tablist[0], this.active[0])) {
		                    if (this.tabs.length === options.disabled.length) {
		                        options.active = false;
		                        this.active = $();
		                    } else {
		                        this._activate(this._findNextTab(Math.max(0, options.active - 1), false));
		                    }
		                } else {
		                    options.active = this.tabs.index(this.active);
		                }
		                this._refresh();
		            },
		            _refresh: function() {
		                this._setupDisabled(this.options.disabled);
		                this._setupEvents(this.options.event);
		                this._setupHeightStyle(this.options.heightStyle);
		                this.tabs.not(this.active).attr({
		                    "aria-selected": "false",
		                    tabIndex: -1
		                });
		                this.panels.not(this._getPanelForTab(this.active)).hide().attr({
		                    "aria-expanded": "false",
		                    "aria-hidden": "true"
		                });
		                if (!this.active.length) {
		                    this.tabs.eq(0).attr("tabIndex", 0);
		                } else {
		                    this.active.addClass("ui-tabs-active ui-state-active").attr({
		                        "aria-selected": "true",
		                        tabIndex: 0
		                    });
		                    this._getPanelForTab(this.active).show().attr({
		                        "aria-expanded": "true",
		                        "aria-hidden": "false"
		                    });
		                }
		            },
		            _processTabs: function() {
		                var that = this;
		                this.tablist = this._getList().addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").attr("role", "tablist");
		                this.tabs = this.tablist.find("> li:has(a[href])").addClass("ui-state-default ui-corner-top").attr({
		                    role: "tab",
		                    tabIndex: -1
		                });
		                this.anchors = this.tabs.map(function() {
		                    return $("a", this)[0];
		                }).addClass("ui-tabs-anchor").attr({
		                    role: "presentation",
		                    tabIndex: -1
		                });
		                this.panels = $();
		                this.anchors.each(function(i, anchor) {
		                    var selector, panel, panelId, anchorId = $(anchor).uniqueId().attr("id"), tab = $(anchor).closest("li"), originalAriaControls = tab.attr("aria-controls");
		                    if (isLocal(anchor)) {
		                        selector = anchor.hash;
		                        panel = that.element.find(that._sanitizeSelector(selector));
		                    } else {
		                        panelId = that._tabId(tab);
		                        selector = "#" + panelId;
		                        panel = that.element.find(selector);
		                        if (!panel.length) {
		                            panel = that._createPanel(panelId);
		                            panel.insertAfter(that.panels[i - 1] || that.tablist);
		                        }
		                        panel.attr("aria-live", "polite");
		                    }
		                    if (panel.length) {
		                        that.panels = that.panels.add(panel);
		                    }
		                    if (originalAriaControls) {
		                        tab.data("ui-tabs-aria-controls", originalAriaControls);
		                    }
		                    tab.attr({
		                        "aria-controls": selector.substring(1),
		                        "aria-labelledby": anchorId
		                    });
		                    panel.attr("aria-labelledby", anchorId);
		                });
		                this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").attr("role", "tabpanel");
		            },
		            _getList: function() {
		                return this.element.find("ol,ul").eq(0);
		            },
		            _createPanel: function(id) {
		                return $("<div>").attr("id", id).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").data("ui-tabs-destroy", true);
		            },
		            _setupDisabled: function(disabled) {
		                if ($.isArray(disabled)) {
		                    if (!disabled.length) {
		                        disabled = false;
		                    } else if (disabled.length === this.anchors.length) {
		                        disabled = true;
		                    }
		                }
		                for (var i = 0, li; li = this.tabs[i]; i++) {
		                    if (disabled === true || $.inArray(i, disabled) !== -1) {
		                        $(li).addClass("ui-state-disabled").attr("aria-disabled", "true");
		                    } else {
		                        $(li).removeClass("ui-state-disabled").removeAttr("aria-disabled");
		                    }
		                }
		                this.options.disabled = disabled;
		            },
		            _setupEvents: function(event) {
		                var events = {
		                    click: function(event) {
		                        event.preventDefault();
		                    }
		                };
		                if (event) {
		                    $.each(event.split(" "), function(index, eventName) {
		                        events[eventName] = "_eventHandler";
		                    });
		                }
		                this._off(this.anchors.add(this.tabs).add(this.panels));
		                this._on(this.anchors, events);
		                this._on(this.tabs, {
		                    keydown: "_tabKeydown"
		                });
		                this._on(this.panels, {
		                    keydown: "_panelKeydown"
		                });
		                this._focusable(this.tabs);
		                this._hoverable(this.tabs);
		            },
		            _setupHeightStyle: function(heightStyle) {
		                var maxHeight, parent = this.element.parent();
		                if (heightStyle === "fill") {
		                    maxHeight = parent.height();
		                    maxHeight -= this.element.outerHeight() - this.element.height();
		                    this.element.siblings(":visible").each(function() {
		                        var elem = $(this), position = elem.css("position");
		                        if (position === "absolute" || position === "fixed") {
		                            return;
		                        }
		                        maxHeight -= elem.outerHeight(true);
		                    });
		                    this.element.children().not(this.panels).each(function() {
		                        maxHeight -= $(this).outerHeight(true);
		                    });
		                    this.panels.each(function() {
		                        $(this).height(Math.max(0, maxHeight - $(this).innerHeight() + $(this).height()));
		                    }).css("overflow", "auto");
		                } else if (heightStyle === "auto") {
		                    maxHeight = 0;
		                    this.panels.each(function() {
		                        maxHeight = Math.max(maxHeight, $(this).height("").height());
		                    }).height(maxHeight);
		                }
		            },
		            _eventHandler: function(event) {
		                var options = this.options, active = this.active, anchor = $(event.currentTarget), tab = anchor.closest("li"), clickedIsActive = tab[0] === active[0], collapsing = clickedIsActive && options.collapsible, toShow = collapsing ? $() : this._getPanelForTab(tab), toHide = !active.length ? $() : this._getPanelForTab(active), eventData = {
		                    oldTab: active,
		                    oldPanel: toHide,
		                    newTab: collapsing ? $() : tab,
		                    newPanel: toShow
		                };
		                event.preventDefault();
		                if (tab.hasClass("ui-state-disabled") || tab.hasClass("ui-tabs-loading") || this.running || clickedIsActive && !options.collapsible || this._trigger("beforeActivate", event, eventData) === false) {
		                    return;
		                }
		                options.active = collapsing ? false : this.tabs.index(tab);
		                this.active = clickedIsActive ? $() : tab;
		                if (this.xhr) {
		                    this.xhr.abort();
		                }
		                if (!toHide.length && !toShow.length) {
		                    $.error("jQuery UI Tabs: Mismatching fragment identifier.");
		                }
		                if (toShow.length) {
		                    this.load(this.tabs.index(tab), event);
		                }
		                this._toggle(event, eventData);
		            },
		            _toggle: function(event, eventData) {
		                var that = this, toShow = eventData.newPanel, toHide = eventData.oldPanel;
		                this.running = true;
		                function complete() {
		                    that.running = false;
		                    that._trigger("activate", event, eventData);
		                }
		                function show() {
		                    eventData.newTab.closest("li").addClass("ui-tabs-active ui-state-active");
		                    if (toShow.length && that.options.show) {
		                        that._show(toShow, that.options.show, complete);
		                    } else {
		                        toShow.show();
		                        complete();
		                    }
		                }
		                if (toHide.length && this.options.hide) {
		                    this._hide(toHide, this.options.hide, function() {
		                        eventData.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
		                        show();
		                    });
		                } else {
		                    eventData.oldTab.closest("li").removeClass("ui-tabs-active ui-state-active");
		                    toHide.hide();
		                    show();
		                }
		                toHide.attr({
		                    "aria-expanded": "false",
		                    "aria-hidden": "true"
		                });
		                eventData.oldTab.attr("aria-selected", "false");
		                if (toShow.length && toHide.length) {
		                    eventData.oldTab.attr("tabIndex", -1);
		                } else if (toShow.length) {
		                    this.tabs.filter(function() {
		                        return $(this).attr("tabIndex") === 0;
		                    }).attr("tabIndex", -1);
		                }
		                toShow.attr({
		                    "aria-expanded": "true",
		                    "aria-hidden": "false"
		                });
		                eventData.newTab.attr({
		                    "aria-selected": "true",
		                    tabIndex: 0
		                });
		            },
		            _activate: function(index) {
		                var anchor, active = this._findActive(index);
		                if (active[0] === this.active[0]) {
		                    return;
		                }
		                if (!active.length) {
		                    active = this.active;
		                }
		                anchor = active.find(".ui-tabs-anchor")[0];
		                this._eventHandler({
		                    target: anchor,
		                    currentTarget: anchor,
		                    preventDefault: $.noop
		                });
		            },
		            _findActive: function(index) {
		                return index === false ? $() : this.tabs.eq(index);
		            },
		            _getIndex: function(index) {
		                if (typeof index === "string") {
		                    index = this.anchors.index(this.anchors.filter("[href$='" + index + "']"));
		                }
		                return index;
		            },
		            _destroy: function() {
		                if (this.xhr) {
		                    this.xhr.abort();
		                }
		                this.element.removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible");
		                this.tablist.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all").removeAttr("role");
		                this.anchors.removeClass("ui-tabs-anchor").removeAttr("role").removeAttr("tabIndex").removeUniqueId();
		                this.tabs.add(this.panels).each(function() {
		                    if ($.data(this, "ui-tabs-destroy")) {
		                        $(this).remove();
		                    } else {
		                        $(this).removeClass("ui-state-default ui-state-active ui-state-disabled " + "ui-corner-top ui-corner-bottom ui-widget-content ui-tabs-active ui-tabs-panel").removeAttr("tabIndex").removeAttr("aria-live").removeAttr("aria-busy").removeAttr("aria-selected").removeAttr("aria-labelledby").removeAttr("aria-hidden").removeAttr("aria-expanded").removeAttr("role");
		                    }
		                });
		                this.tabs.each(function() {
		                    var li = $(this), prev = li.data("ui-tabs-aria-controls");
		                    if (prev) {
		                        li.attr("aria-controls", prev).removeData("ui-tabs-aria-controls");
		                    } else {
		                        li.removeAttr("aria-controls");
		                    }
		                });
		                this.panels.show();
		                if (this.options.heightStyle !== "content") {
		                    this.panels.css("height", "");
		                }
		            },
		            enable: function(index) {
		                var disabled = this.options.disabled;
		                if (disabled === false) {
		                    return;
		                }
		                if (index === undefined) {
		                    disabled = false;
		                } else {
		                    index = this._getIndex(index);
		                    if ($.isArray(disabled)) {
		                        disabled = $.map(disabled, function(num) {
		                            return num !== index ? num : null;
		                        });
		                    } else {
		                        disabled = $.map(this.tabs, function(li, num) {
		                            return num !== index ? num : null;
		                        });
		                    }
		                }
		                this._setupDisabled(disabled);
		            },
		            disable: function(index) {
		                var disabled = this.options.disabled;
		                if (disabled === true) {
		                    return;
		                }
		                if (index === undefined) {
		                    disabled = true;
		                } else {
		                    index = this._getIndex(index);
		                    if ($.inArray(index, disabled) !== -1) {
		                        return;
		                    }
		                    if ($.isArray(disabled)) {
		                        disabled = $.merge([ index ], disabled).sort();
		                    } else {
		                        disabled = [ index ];
		                    }
		                }
		                this._setupDisabled(disabled);
		            },
		            load: function(index, event) {
		                index = this._getIndex(index);
		                var that = this, tab = this.tabs.eq(index), anchor = tab.find(".ui-tabs-anchor"), panel = this._getPanelForTab(tab), eventData = {
		                    tab: tab,
		                    panel: panel
		                };
		                if (isLocal(anchor[0])) {
		                    return;
		                }
		                this.xhr = $.ajax(this._ajaxSettings(anchor, event, eventData));
		                if (this.xhr && this.xhr.statusText !== "canceled") {
		                    tab.addClass("ui-tabs-loading");
		                    panel.attr("aria-busy", "true");
		                    this.xhr.success(function(response) {
		                        setTimeout(function() {
		                            panel.html(response);
		                            that._trigger("load", event, eventData);
		                        }, 1);
		                    }).complete(function(jqXHR, status) {
		                        setTimeout(function() {
		                            if (status === "abort") {
		                                that.panels.stop(false, true);
		                            }
		                            tab.removeClass("ui-tabs-loading");
		                            panel.removeAttr("aria-busy");
		                            if (jqXHR === that.xhr) {
		                                delete that.xhr;
		                            }
		                        }, 1);
		                    });
		                }
		            },
		            _ajaxSettings: function(anchor, event, eventData) {
		                var that = this;
		                return {
		                    url: anchor.attr("href"),
		                    beforeSend: function(jqXHR, settings) {
		                        return that._trigger("beforeLoad", event, $.extend({
		                            jqXHR: jqXHR,
		                            ajaxSettings: settings
		                        }, eventData));
		                    }
		                };
		            },
		            _getPanelForTab: function(tab) {
		                var id = $(tab).attr("aria-controls");
		                return this.element.find(this._sanitizeSelector("#" + id));
		            }
		        });
		    })(jQuery);
		    (function($, undefined) {})(jQuery);
		    (function($, window) {
		        $.mobile.iosorientationfixEnabled = true;
		        var ua = navigator.userAgent, zoom, evt, x, y, z, aig;
		        if (!(/iPhone|iPad|iPod/.test(navigator.platform) && /OS [1-5]_[0-9_]* like Mac OS X/i.test(ua) && ua.indexOf("AppleWebKit") > -1)) {
		            $.mobile.iosorientationfixEnabled = false;
		            return;
		        }
		        zoom = $.mobile.zoom;
		        function checkTilt(e) {
		            evt = e.originalEvent;
		            aig = evt.accelerationIncludingGravity;
		            x = Math.abs(aig.x);
		            y = Math.abs(aig.y);
		            z = Math.abs(aig.z);
		            if (!window.orientation && (x > 7 || (z > 6 && y < 8 || z < 8 && y > 6) && x > 5)) {
		                if (zoom.enabled) {
		                    zoom.disable();
		                }
		            } else if (!zoom.enabled) {
		                zoom.enable();
		            }
		        }
		        $.mobile.document.on("mobileinit", function() {
		            if ($.mobile.iosorientationfixEnabled) {
		                $.mobile.window.bind("orientationchange.iosorientationfix", zoom.enable).bind("devicemotion.iosorientationfix", checkTilt);
		            }
		        });
		    })(jQuery, this);
		    (function($, window, undefined) {
		        var $html = $("html"), $window = $.mobile.window;
		        function hideRenderingClass() {
		            $html.removeClass("ui-mobile-rendering");
		        }
		        $(window.document).trigger("mobileinit");
		        if (!$.mobile.gradeA()) {
		            return;
		        }
		        if ($.mobile.ajaxBlacklist) {
		            $.mobile.ajaxEnabled = false;
		        }
		        $html.addClass("ui-mobile ui-mobile-rendering");
		        setTimeout(hideRenderingClass, 5e3);
		        $.extend($.mobile, {
		            initializePage: function() {
		                var path = $.mobile.path, $pages = $(":jqmData(role='page'), :jqmData(role='dialog')"), hash = path.stripHash(path.stripQueryParams(path.parseLocation().hash)), theLocation = $.mobile.path.parseLocation(), hashPage = hash ? document.getElementById(hash) : undefined;
		                if (!$pages.length) {
		                    $pages = $("body").wrapInner("<div data-" + $.mobile.ns + "role='page'></div>").children(0);
		                }
		                $pages.each(function() {
		                    var $this = $(this);
		                    if (!$this[0].getAttribute("data-" + $.mobile.ns + "url")) {
		                        $this.attr("data-" + $.mobile.ns + "url", $this.attr("id") || path.convertUrlToDataUrl(theLocation.pathname + theLocation.search));
		                    }
		                });
		                $.mobile.firstPage = $pages.first();
		                $.mobile.pageContainer = $.mobile.firstPage.parent().addClass("ui-mobile-viewport").pagecontainer();
		                $.mobile.navreadyDeferred.resolve();
		                $window.trigger("pagecontainercreate");
		                $.mobile.loading("show");
		                hideRenderingClass();
		                if (!($.mobile.hashListeningEnabled && $.mobile.path.isHashValid(location.hash) && ($(hashPage).is(":jqmData(role='page')") || $.mobile.path.isPath(hash) || hash === $.mobile.dialogHashKey))) {
		                    if ($.event.special.navigate.isPushStateEnabled()) {
		                        $.mobile.navigate.navigator.squash(path.parseLocation().href);
		                    }
		                    $.mobile.changePage($.mobile.firstPage, {
		                        transition: "none",
		                        reverse: true,
		                        changeHash: false,
		                        fromHashChange: true
		                    });
		                } else {
		                    if (!$.event.special.navigate.isPushStateEnabled()) {
		                        $window.trigger("hashchange", [ true ]);
		                    } else {
		                        $.mobile.navigate.history.stack = [];
		                        $.mobile.navigate($.mobile.path.isPath(location.hash) ? location.hash : location.href);
		                    }
		                }
		            }
		        });
		        $(function() {
		            $.support.inlineSVG();
		            if ($.mobile.hideUrlBar) {
		                window.scrollTo(0, 1);
		            }
		            $.mobile.defaultHomeScroll = !$.support.scrollTop || $.mobile.window.scrollTop() === 1 ? 0 : 1;
		            if ($.mobile.autoInitializePage) {
		                $.mobile.initializePage();
		            }
		            if ($.mobile.hideUrlBar) {
		                $window.load($.mobile.silentScroll);
		            }
		            if (!$.support.cssPointerEvents) {
		                $.mobile.document.delegate(".ui-state-disabled,.ui-disabled", "vclick", function(e) {
		                    e.preventDefault();
		                    e.stopImmediatePropagation();
		                });
		            }
		        });
		    })(jQuery, this);
		});

		(function(root, factory) {
		    if (true) {
		        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __WEBPACK_LOCAL_MODULE_2__, __WEBPACK_LOCAL_MODULE_1__, __webpack_require__(2) ], __WEBPACK_LOCAL_MODULE_5__ = (function() {
		            return factory(root.CDP || (root.CDP = {}));
		        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));
		    } else {
		        factory(root.CDP || (root.CDP = {}));
		    }
		})(window, function(CDP) {
		    CDP.Framework = CDP.Framework || {};
		    var CDP;
		    (function(CDP) {
		        var Framework;
		        (function(Framework) {
		            Framework.Platform = function() {
		                var ua = navigator.userAgent.toLowerCase();
		                var majorVersion = function(browser) {
		                    var version = ua.match(new RegExp("(" + browser + ")( |/)([0-9]+)"));
		                    if (!version || version.length < 4) {
		                        return 0;
		                    }
		                    return parseInt(version[3], 10);
		                };
		                return {
		                    ltIE6: typeof window.addEventListener === "undefined" && typeof document.documentElement.style.maxHeight === "undefined",
		                    ltIE7: typeof window.addEventListener === "undefined" && typeof document.querySelectorAll === "undefined",
		                    ltIE8: typeof window.addEventListener === "undefined" && typeof document.getElementsByClassName === "undefined",
		                    ltIE9: document.uniqueID && typeof window.matchMedia === "undefined",
		                    gtIE10: document.uniqueID && window.matchMedia,
		                    Trident: document.uniqueID,
		                    Gecko: "MozAppearance" in document.documentElement.style,
		                    Presto: CDP.global.opera,
		                    Blink: CDP.global.chrome,
		                    Webkit: typeof CDP.global.chrome === "undefined" && "WebkitAppearance" in document.documentElement.style,
		                    Touch: typeof CDP.global.ontouchstart !== "undefined",
		                    Mobile: typeof CDP.global.orientation !== "undefined",
		                    ltAd4_4: typeof CDP.global.orientation !== "undefined" && (typeof CDP.global.EventSource === "undefined" || 30 > majorVersion("chrome")),
		                    Pointer: CDP.global.navigator.pointerEnabled,
		                    MSPoniter: CDP.global.navigator.msPointerEnabled,
		                    Android: ua.indexOf("android") !== -1,
		                    iOS: ua.indexOf("iphone") !== -1 || ua.indexOf("ipad") !== -1 || ua.indexOf("ipod") !== -1
		                };
		            }();
		        })(Framework = CDP.Framework || (CDP.Framework = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var Framework;
		        (function(Framework) {
		            var _vclickPatch = function() {
		                var jquery_on = $.fn.on, jquery_off = $.fn.off;
		                var custom_on = function(types, selector, data, fn, one) {
		                    if (typeof types === "string") {
		                        types = types.replace(/vclick/g, "click");
		                    }
		                    return _.bind(jquery_on, this)(types, selector, data, fn, one);
		                };
		                var custom_off = function(types, selector, fn) {
		                    if (typeof types === "string") {
		                        types = types.replace(/vclick/g, "click");
		                    }
		                    return _.bind(jquery_off, this)(types, selector, fn);
		                };
		                $.fn.on = custom_on;
		                $.fn.off = custom_off;
		            };
		            var Patch = function() {
		                function Patch() {}
		                Patch.apply = function() {
		                    if (!Patch.isSupportedVclick()) {
		                        _vclickPatch();
		                        Patch.s_vclickEvent = "click";
		                    }
		                };
		                Patch.isSupportedVclick = function() {
		                    if (Framework.Platform.Android && !Framework.Platform.ltAd4_4) {
		                        return false;
		                    }
		                    return true;
		                };
		                return Patch;
		            }();
		            Patch.s_vclickEvent = "vclick";
		            Framework.Patch = Patch;
		        })(Framework = CDP.Framework || (CDP.Framework = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var Framework;
		        (function(Framework) {
		            var Orientation;
		            (function(Orientation) {
		                Orientation[Orientation["PORTRAIT"] = 0] = "PORTRAIT";
		                Orientation[Orientation["LANDSCAPE"] = 1] = "LANDSCAPE";
		            })(Orientation = Framework.Orientation || (Framework.Orientation = {}));
		            function getOrientation() {
		                var $window = $(window);
		                return $window.width() < $window.height() ? Orientation.PORTRAIT : Orientation.LANDSCAPE;
		            }
		            Framework.getOrientation = getOrientation;
		        })(Framework = CDP.Framework || (CDP.Framework = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var Framework;
		        (function(Framework) {
		            function toUrl(path) {
		                if (null != path[0] && "/" === path[0]) {
		                    return CDP.webRoot + path.slice(1);
		                } else {
		                    return $.mobile.path.makeUrlAbsolute(path, getCurrentDocumentUrl());
		                }
		            }
		            Framework.toUrl = toUrl;
		            function getCurrentDocumentUrl() {
		                var $activePage = $("body").pagecontainer("getActivePage");
		                if (null == $activePage) {
		                    return $.mobile.path.documentBase.hrefNoHash;
		                }
		                var url = $.mobile.activePage.closest(".ui-page").jqmData("url"), base = $.mobile.path.documentBase.hrefNoHash;
		                if (!url || !$.mobile.path.isPath(url)) {
		                    url = base;
		                }
		                return $.mobile.path.makeUrlAbsolute(url, base);
		            }
		            var _beforeRouteChange = function() {
		                return $.Deferred().resolve().promise();
		            };
		            var _defaultBeforeRouteChange = _beforeRouteChange;
		            function setBeforeRouteChangeHandler(handler) {
		                if (null == handler) {
		                    return _beforeRouteChange;
		                } else {
		                    var oldHandler = _beforeRouteChange;
		                    _beforeRouteChange = handler;
		                    return oldHandler;
		                }
		            }
		            Framework.setBeforeRouteChangeHandler = setBeforeRouteChangeHandler;
		            var Router = function() {
		                function Router() {}
		                Router.initialize = function(options) {
		                    var $body = $("body");
		                    if (!!Router.s_router) {
		                        console.warn("logic error. initialize call twice.");
		                        return false;
		                    }
		                    Router.s_initOptions = $.extend({}, Router.s_defaultInitOptions, options);
		                    Router.s_loadUrl = _.bind(Backbone.history.loadUrl, Backbone.history);
		                    Backbone.history.loadUrl = Router.customLoadUrl;
		                    Router.s_router = new Backbone.Router();
		                    Router.s_router.on("route", Router.onRouteSucceeded);
		                    if (!$.mobile.hashListeningEnabled) {
		                        Router.s_back = _.bind($.mobile.back, $.mobile);
		                        $.mobile.back = Router.customJqmBack;
		                    }
		                    if (null == $.mobile.changePage) {
		                        $.mobile.changePage = function(to, options) {
		                            $body.pagecontainer("change", to, options);
		                        };
		                    }
		                    Router.bindEvents();
		                    Framework.setupEventHandlers();
		                    return true;
		                };
		                Router.register = function(route, page, top, callback) {
		                    if (top === void 0) {
		                        top = false;
		                    }
		                    var restart = Router.stop();
		                    var name = route + page;
		                    var context = {
		                        route: route,
		                        regexp: Router.s_router._routeToRegExp(route),
		                        page: page,
		                        top: top,
		                        callback: callback || function() {
		                            return false;
		                        }
		                    };
		                    if (Router.pushContext(name, context)) {
		                        Router.s_router.route(route, name, function() {});
		                    }
		                    if (restart) {
		                        Router.start({
		                            silent: true
		                        });
		                    }
		                    return Router;
		                };
		                Router.start = function(options) {
		                    if ($.mobile.hashListeningEnabled) {
		                        console.log("setting error. confict: $.mobile.hashListeningEnabled = true, cannot start.");
		                        return false;
		                    }
		                    return Backbone.history.start(options);
		                };
		                Router.stop = function() {
		                    var prevState = Backbone.History.started;
		                    Backbone.history.stop();
		                    return prevState;
		                };
		                Router.isRouting = function() {
		                    return Backbone.History.started;
		                };
		                Router.navigate = function(url, transition, reverse, options) {
		                    if (!!Router.s_lastNavigateInfo.inNavigation) {
		                        console.log("Router.navigate() called in navigation proc.");
		                        return;
		                    } else if (Router.initFirstPageIfNeeded(url)) {
		                        return;
		                    }
		                    var navOptions = $.extend({}, Router.s_defaultNavigateOptions, options);
		                    var notifyBeforeRouteChange = Router.s_lastNavigateInfo.calledBeforeRouteChange ? _defaultBeforeRouteChange : _beforeRouteChange;
		                    Router.s_lastNavigateInfo = {
		                        url: url,
		                        transition: transition,
		                        reverse: reverse,
		                        backDestination: navOptions.backDestination,
		                        noHashChange: navOptions.noHashChange,
		                        intent: navOptions.intent || {},
		                        positiveNavigate: true,
		                        calledBeforeRouteChange: true,
		                        inNavigation: true
		                    };
		                    notifyBeforeRouteChange().fail(function() {
		                        console.error("before route change call, failed.");
		                    }).always(function() {
		                        if (Router.isRouting() && !Router.s_lastNavigateInfo.noHashChange) {
		                            if (navOptions.subFlow) {
		                                switch (navOptions.subFlow.operation) {
		                                  case "begin":
		                                    Router.startSubFlow(navOptions.subFlow);
		                                    break;

		                                  case "end":
		                                    Router.finishSubFlow(navOptions);
		                                    return;

		                                  default:
		                                    console.warn("unknown subFlow.operation. operation: " + navOptions.subFlow.operation);
		                                    break;
		                                }
		                            }
		                            Router.s_router.navigate(url, navOptions);
		                        } else {
		                            if (navOptions.subFlow) {
		                                console.warn("subFlow only supported under routing and hash change condition.");
		                            }
		                            (function() {
		                                var fragment = Backbone.history.getFragment(url);
		                                var context;
		                                if (Router.s_lastNavigateInfo.noHashChange) {
		                                    context = _.find(Router.s_rootContexts, function(context) {
		                                        return context.regexp.test(fragment);
		                                    });
		                                } else {
		                                    context = _.findWhere(Router.s_rootContexts, {
		                                        route: fragment
		                                    });
		                                }
		                                if (context) {
		                                    url = context.page;
		                                }
		                            })();
		                            Router.changePage(url);
		                        }
		                    });
		                };
		                Router.navigateFromTop = function(to, transition, reverse, options) {
		                    var stack = Router.getJqmHistory().stack;
		                    var currentPage = stack[Router.getJqmHistory().activeIndex];
		                    var _transition = transition || currentPage.transition;
		                    var _reverse = null != reverse ? reverse : true;
		                    var destStacks = function() {
		                        if (!to) {
		                            return null;
		                        } else if ("string" === typeof to) {
		                            return [ {
		                                route: to
		                            } ];
		                        } else if (to instanceof Array) {
		                            return to;
		                        } else {
		                            return [ to ];
		                        }
		                    }();
		                    stack.forEach(function(value) {
		                        delete value[Router.SUBFLOW_PARAM];
		                    });
		                    stack[0][Router.SUBFLOW_PARAM] = {
		                        operation: "begin",
		                        destBase: stack[0].hash,
		                        destStacks: destStacks,
		                        additionalDistance: 0
		                    };
		                    Router.navigate(null, _transition, _reverse, $.extend({}, options, {
		                        subFlow: {
		                            operation: "end"
		                        }
		                    }));
		                };
		                Router.back = function() {
		                    if (!!Router.s_lastNavigateInfo.inNavigation) {
		                        console.log("Router.back() called in navigation proc.");
		                        return;
		                    } else if (Router.isTopPage()) {
		                        var app = navigator.app || {};
		                        if (!!app.exitApp) {
		                            app.exitApp();
		                            return;
		                        }
		                    }
		                    Router.s_lastNavigateInfo = {
		                        inNavigation: true,
		                        calledBeforeRouteChange: true
		                    };
		                    _beforeRouteChange().then(function() {
		                        $.mobile.back();
		                    }).fail(function() {
		                        console.error("before route change call, failed.");
		                        Router.s_lastNavigateInfo = {};
		                    });
		                };
		                Router.pushIntent = function(intent) {
		                    Router.s_lastIntent = $.extend(true, Router.s_lastIntent, intent);
		                };
		                Router.popIntent = function() {
		                    var intent = Router.s_lastIntent;
		                    Router.s_lastIntent = {};
		                    return intent;
		                };
		                Router.getQueryParameters = function() {
		                    if (Router.s_lastNavigateInfo.intent && Router.s_lastNavigateInfo.intent.params) {
		                        return Router.s_lastNavigateInfo.intent.params["queryParams"];
		                    } else {
		                        return null;
		                    }
		                };
		                Router.beginSubFlow = function(url, options, transition, reverse) {
		                    var opt = $.extend({}, options);
		                    opt.subFlow = opt.subFlow || {
		                        operation: "begin"
		                    };
		                    if ("begin" !== opt.subFlow.operation) {
		                        console.error("logic error. invalid subflow operation. [operation: " + opt.subFlow.operation + "]");
		                        return;
		                    }
		                    Router.navigate(url, transition, reverse, opt);
		                };
		                Router.commitSubFlow = function(transition, reverse) {
		                    Router.navigate(null, transition, reverse, {
		                        subFlow: {
		                            operation: "end"
		                        }
		                    });
		                };
		                Router.cancelSubFlow = function(transition, reverse) {
		                    var baseInfo = Router.detectSubFlowBaseInfo();
		                    baseInfo.subFlowParam.additionalDistance = 0;
		                    Router.navigate(null, transition, null != reverse ? reverse : true, {
		                        subFlow: {
		                            operation: "end",
		                            destStacks: null
		                        }
		                    });
		                };
		                Router.isInSubFlow = function() {
		                    var stack = Router.getJqmHistory().stack;
		                    var has = _.some(stack, function(value) {
		                        return !!value[Router.SUBFLOW_PARAM];
		                    });
		                    return has;
		                };
		                Router.fromHashChanged = function() {
		                    return Router.s_lastNavigateInfo.inNavigation && null == Router.s_lastNavigateInfo.positiveNavigate;
		                };
		                Router.registerPageStack = function(pageStack, withNavigate, options) {
		                    var newStacks = [];
		                    var failed = false;
		                    pageStack = pageStack instanceof Array ? pageStack : [ pageStack ];
		                    withNavigate = null == withNavigate ? false : withNavigate;
		                    (function() {
		                        var makeStack = function(info) {
		                            var url;
		                            var stack;
		                            var fragment = Backbone.history.getFragment(info.route);
		                            var context = _.find(Router.s_rootContexts, function(context) {
		                                return context.regexp.test(fragment);
		                            });
		                            if (!context) {
		                                console.warn("route is not registered. route: " + info.route);
		                                return null;
		                            } else {
		                                url = Router.pathToJqmDataUrl(context.page);
		                            }
		                            stack = {
		                                route: info.route,
		                                pageUrl: url,
		                                title: info.title,
		                                transition: info.transition,
		                                url: url
		                            };
		                            return stack;
		                        };
		                        for (var i = 0, n = pageStack.length; i < n; i++) {
		                            var stack = makeStack(pageStack[i]);
		                            if (!stack) {
		                                failed = true;
		                                break;
		                            } else {
		                                newStacks.push(stack);
		                            }
		                        }
		                    })();
		                    if (failed) {
		                        return false;
		                    }
		                    (function() {
		                        var restart = Router.stop();
		                        var silentLength = newStacks.length - 1;
		                        var finalIndex = newStacks.length - 1;
		                        Router.getJqmHistory().clearForward();
		                        for (var i = 0, n = silentLength; i < n; i++) {
		                            location.hash = newStacks[i].route;
		                            Router.getJqmHistory().stack.push(newStacks[i]);
		                            Router.getJqmHistory().activeIndex = Router.getJqmHistory().stack.length - 1;
		                        }
		                        if (withNavigate) {
		                            var transition = function() {
		                                if (null != Router.s_lastNavigateInfo.transition) {
		                                    return Router.s_lastNavigateInfo.transition;
		                                } else {
		                                    return newStacks[finalIndex].transition;
		                                }
		                            }();
		                            var reverse = function() {
		                                if (null != Router.s_lastNavigateInfo.reverse) {
		                                    return Router.s_lastNavigateInfo.reverse;
		                                } else {
		                                    return false;
		                                }
		                            }();
		                            restart = false;
		                            Router.start({
		                                silent: true
		                            });
		                            Router.navigate(newStacks[finalIndex].route, transition, reverse, options);
		                        } else {
		                            location.hash = newStacks[finalIndex].route;
		                            Router.getJqmHistory().stack.push(newStacks[finalIndex]);
		                            Router.getJqmHistory().activeIndex = Router.getJqmHistory().stack.length - 1;
		                        }
		                        if (restart) {
		                            Router.start({
		                                silent: true
		                            });
		                        }
		                    })();
		                    return true;
		                };
		                Router.getJqmHistory = function() {
		                    return $.mobile.navigate.history;
		                };
		                Router.customLoadUrl = function(fragment) {
		                    var handled = Router.s_loadUrl(fragment);
		                    if (!handled) {
		                        Router.onRouteFailed(fragment);
		                    }
		                    return handled;
		                };
		                Router.customJqmBack = function() {
		                    if (Router.isRouting()) {
		                        history.back();
		                    } else {
		                        Router.s_back();
		                    }
		                };
		                Router.bindEvents = function() {
		                    $(document).one("pagechange", function() {
		                        if (Router.s_initOptions.anchorVclick) {
		                            $(document).on("vclick", "[href]", function(event) {
		                                Router.onAnchorVclicked(event);
		                            });
		                        }
		                    }).on("pagebeforeshow", function(event) {
		                        if (null != Router.s_lastNavigateInfo.backDestination) {
		                            var active = Router.getJqmHistory().getActive();
		                            active[Router.BACK_DESTINATION_URL] = Router.s_lastNavigateInfo.backDestination;
		                        }
		                    }).on("pageshow", function(event) {
		                        var active = Router.getJqmHistory().getActive();
		                        if (active[Router.SUBFLOW_PARAM]) {
		                            delete active[Router.SUBFLOW_PARAM];
		                        }
		                    }).on("pagechange pagecontainerloadfailed", function(event) {
		                        Router.s_lastNavigateInfo = {};
		                    });
		                    CDP.setBackButtonHandler(Router.back);
		                };
		                Router.pushContext = function(name, context) {
		                    if (!!Router.s_rootContexts[name]) {
		                        console.log("logic error. route is already registered. name: " + name);
		                        return false;
		                    }
		                    Router.s_rootContexts[name] = context;
		                    return true;
		                };
		                Router.initFirstPageIfNeeded = function(url) {
		                    if (!$.mobile.autoInitializePage) {
		                        $(document).one("pagebeforechange", function(event, data) {
		                            data.toPage = Framework.toUrl(url);
		                        });
		                        $.mobile.initializePage();
		                        $.mobile.autoInitializePage = true;
		                        return true;
		                    }
		                    return false;
		                };
		                Router.isTopPage = function() {
		                    var fragment = Backbone.history.getFragment($.mobile.path.parseUrl(location.href).hash);
		                    var context = _.find(Router.s_rootContexts, function(context) {
		                        return context.regexp.test(fragment);
		                    });
		                    return null == context ? false : context.top;
		                };
		                Router.onAnchorVclicked = function(event) {
		                    if (Router.isJustBeforeVclicked()) {
		                        event.preventDefault();
		                        return false;
		                    }
		                    return Router.followAnchor(event);
		                };
		                Router.followAnchor = function(event) {
		                    var $target = $(event.currentTarget);
		                    var url = $target.jqmData("href") || $target.attr("href");
		                    var transition = $target.jqmData("transition");
		                    var direction = $target.jqmData("direction");
		                    var backDst = $target.attr(Router.DATA_BACK_DESTINATION);
		                    var noHashChange = $target.attr(Router.DATA_NO_HASH_CHANGE) ? $target.attr(Router.DATA_NO_HASH_CHANGE) === "true" : false;
		                    var noHrefHandle = $target.attr(Router.DATA_NO_VCLICK_HANDLE) ? $target.attr(Router.DATA_NO_VCLICK_HANDLE) === "true" : false;
		                    if (noHrefHandle || Router.needDefaultOperation(url)) {
		                        return true;
		                    }
		                    event.preventDefault();
		                    if (Router.isBackButtonClicked(event)) {
		                        Router.back();
		                    } else {
		                        Router.navigate(url, transition, !!direction, {
		                            noHashChange: noHashChange,
		                            backDestination: backDst
		                        });
		                    }
		                    return false;
		                };
		                Router.needDefaultOperation = function(url) {
		                    if (!url || "#" === url) {
		                        return true;
		                    } else if ("#" === url[0]) {
		                        return !Router.canResolveRoute(url);
		                    } else {
		                        return false;
		                    }
		                };
		                Router.canResolveRoute = function(url) {
		                    var fragment = Backbone.history.getFragment(url);
		                    return _.any(Backbone.history.handlers, function(handler) {
		                        if (handler.route.test(fragment)) {
		                            return true;
		                        }
		                    });
		                };
		                Router.isJustBeforeVclicked = function() {
		                    var isBefore = Date.now() - Router.s_lastClickedTime < Router.DELAY_TIME * 2;
		                    Router.s_lastClickedTime = Date.now();
		                    return isBefore;
		                };
		                Router.isBackButtonClicked = function(event) {
		                    if ($(event.currentTarget).jqmData("rel") === "back") {
		                        return true;
		                    } else {
		                        return false;
		                    }
		                };
		                Router.onRouteSucceeded = function(name) {
		                    var args = [];
		                    for (var _i = 1; _i < arguments.length; _i++) {
		                        args[_i - 1] = arguments[_i];
		                    }
		                    var context = Router.s_rootContexts[name];
		                    if (!!context) {
		                        var intent = {
		                            params: {
		                                queryParams: args
		                            }
		                        };
		                        Router.s_lastNavigateInfo.inNavigation = true;
		                        if (null != Router.s_lastNavigateInfo.intent) {
		                            intent.params = $.extend({}, intent.params, Router.s_lastNavigateInfo.intent.params || {});
		                        }
		                        Router.s_lastNavigateInfo.intent = $.extend({}, Router.s_lastNavigateInfo.intent, intent);
		                        var handled = context.callback(args);
		                        if (!handled) {
		                            Router.changePage(context.page);
		                        }
		                    }
		                };
		                Router.onRouteFailed = function(fragment) {
		                    Router.s_lastNavigateInfo.inNavigation = true;
		                    if (null == fragment) {
		                        fragment = Backbone.history.getFragment();
		                    }
		                    if (Router.s_lastNavigateInfo.positiveNavigate) {
		                        var context = Router.s_rootContexts[fragment];
		                        if (null == context) {
		                            context = {
		                                route: fragment,
		                                regexp: Router.s_router._routeToRegExp(fragment),
		                                page: Router.s_lastNavigateInfo.url,
		                                top: false,
		                                callback: null
		                            };
		                            Router.pushContext(fragment, context);
		                        }
		                    }
		                    var path = fragment;
		                    if (null != Router.s_rootContexts[fragment]) {
		                        path = Router.s_rootContexts[fragment].page;
		                    }
		                    Router.changePage(path);
		                };
		                Router.changePage = function(path) {
		                    var notifyBeforeRouteChange;
		                    if (!Router.s_lastNavigateInfo.positiveNavigate) {
		                        if (Router.s_lastNavigateInfo.inAdditionalBack) {
		                            Router.s_lastNavigateInfo.inAdditionalBack = false;
		                        } else {
		                            Router.decideDirection(path);
		                            var additional = Router.detectAdditionalBackDistance();
		                            if (0 < additional) {
		                                Router.s_lastNavigateInfo.inAdditionalBack = true;
		                                Router.getJqmHistory().activeIndex -= additional;
		                                history.go(-additional);
		                                return;
		                            }
		                        }
		                        var subFlowInfo = Router.detectSubFlowBaseInfo();
		                        if (subFlowInfo.isCurrent) {
		                            delete subFlowInfo.stack[Router.SUBFLOW_PARAM];
		                        }
		                    } else {
		                        Router.getJqmHistory().previousIndex = Router.getJqmHistory().activeIndex;
		                    }
		                    notifyBeforeRouteChange = Router.s_lastNavigateInfo.calledBeforeRouteChange ? _defaultBeforeRouteChange : _beforeRouteChange;
		                    notifyBeforeRouteChange().then(function() {
		                        if (Router.s_lastNavigateInfo.intent) {
		                            Router.pushIntent(Router.s_lastNavigateInfo.intent);
		                        }
		                        Router.treatUrlHistory();
		                        $.mobile.changePage(Framework.toUrl(path), {
		                            showLoadMsg: false,
		                            allowSamePageTransition: true,
		                            transition: Router.s_lastNavigateInfo.transition || "none",
		                            reverse: Router.s_lastNavigateInfo.reverse,
		                            fromHashChange: !Router.s_lastNavigateInfo.positiveNavigate,
		                            changeHash: !Router.s_lastNavigateInfo.noHashChange
		                        });
		                    }).fail(function() {
		                        console.error("before route change call, failed.");
		                        Router.s_lastNavigateInfo = {};
		                    });
		                };
		                Router.decideDirection = function(path) {
		                    var url = $.mobile.path.convertUrlToDataUrl(Framework.toUrl(path));
		                    if (null == Router.s_lastNavigateInfo.transition) {
		                        Router.s_lastNavigateInfo.transition = Router.getJqmHistory().getActive().transition;
		                    }
		                    Router.getJqmHistory().direct({
		                        url: url,
		                        present: function(newPage, direction) {
		                            switch (direction) {
		                              case "back":
		                                if (null == Router.s_lastNavigateInfo.reverse) {
		                                    Router.s_lastNavigateInfo.reverse = true;
		                                }
		                                break;

		                              case "forward":
		                                if (null == Router.s_lastNavigateInfo.transition) {
		                                    Router.s_lastNavigateInfo.transition = newPage.transition;
		                                }
		                                break;

		                              default:
		                                console.log("unknown direction: " + direction);
		                                break;
		                            }
		                        },
		                        missing: function() {
		                            if (1 === Router.getJqmHistory().activeIndex) {
		                                Router.getJqmHistory().previousIndex = 1;
		                                Router.getJqmHistory().activeIndex = 0;
		                                if (null == Router.s_lastNavigateInfo.reverse) {
		                                    Router.s_lastNavigateInfo.reverse = true;
		                                }
		                            } else if (0 !== Router.getJqmHistory().activeIndex) {
		                                console.log("unknown direction.");
		                            }
		                        }
		                    });
		                };
		                Router.detectAdditionalBackDistance = function() {
		                    var stack = Router.getJqmHistory().stack;
		                    var historyActiveIndex = Router.getJqmHistory().activeIndex;
		                    var previousIndex = Router.getJqmHistory().previousIndex;
		                    var i, backDst, distance, fragment, context, jqmDataUrl;
		                    if (!Router.s_lastNavigateInfo.reverse || null == previousIndex || !stack[previousIndex]) {
		                        return 0;
		                    }
		                    backDst = stack[previousIndex][Router.BACK_DESTINATION_URL];
		                    if (null == backDst) {
		                        return 0;
		                    }
		                    fragment = Backbone.history.getFragment(backDst);
		                    if ("" === fragment) {
		                        return historyActiveIndex;
		                    }
		                    context = _.find(Router.s_rootContexts, function(context) {
		                        return context.regexp.test(fragment);
		                    });
		                    if (null == context) {
		                        console.warn("back destination is not registered. back-dst: " + backDst);
		                        return 0;
		                    }
		                    jqmDataUrl = Router.pathToJqmDataUrl(context.page);
		                    for (i = historyActiveIndex, distance = 0; 0 <= i; i--, distance++) {
		                        if (jqmDataUrl === stack[i].pageUrl) {
		                            break;
		                        }
		                    }
		                    if (i < 0) {
		                        console.warn("back destination does not exist in history. back-dst: " + backDst);
		                        return 0;
		                    }
		                    return distance;
		                };
		                Router.startSubFlow = function(subFlowParam) {
		                    var active = Router.getJqmHistory().getActive();
		                    var param = subFlowParam;
		                    if (subFlowParam.destBase) {
		                        (function() {
		                            var distance = 0;
		                            var fragment = Backbone.history.getFragment(subFlowParam.destBase);
		                            var context = _.find(Router.s_rootContexts, function(context) {
		                                return context.regexp.test(fragment);
		                            });
		                            if (null == context) {
		                                console.warn("base destination is not registered. destBase: " + subFlowParam.destBase);
		                                return;
		                            }
		                            var jqmDataUrl = Router.pathToJqmDataUrl(context.page);
		                            var stack = Router.getJqmHistory().stack;
		                            for (var i = Router.getJqmHistory().activeIndex; 0 <= i; i--, distance++) {
		                                if (jqmDataUrl === stack[i].pageUrl) {
		                                    param.additionalDistance = distance;
		                                    break;
		                                }
		                            }
		                        })();
		                    } else {
		                        param.destBase = location.hash;
		                        param.additionalDistance = 0;
		                    }
		                    active[Router.SUBFLOW_PARAM] = param;
		                };
		                Router.finishSubFlow = function(options) {
		                    var navOptions = $.extend(true, {}, options);
		                    var baseInfo = Router.detectSubFlowBaseInfo();
		                    var param = $.extend({}, baseInfo.subFlowParam, navOptions.subFlow);
		                    var distance = baseInfo.distance;
		                    var stack = baseInfo.stack;
		                    var retry = 0;
		                    var NAVIGATE_INTERVAL = 100;
		                    var MAX_RETRY_COUNT = 10;
		                    var _navigate = function() {
		                        if (MAX_RETRY_COUNT <= retry) {
		                            console.error("reached navigate max retry count.");
		                            Router.s_lastNavigateInfo = {};
		                        } else if (param.destBase !== location.hash) {
		                            retry++;
		                            setTimeout(_navigate, NAVIGATE_INTERVAL);
		                        } else {
		                            Router.s_lastNavigateInfo.inNavigation = false;
		                            Router.registerPageStack(param.destStacks, true, navOptions);
		                        }
		                    };
		                    if (stack) {
		                        delete stack[Router.SUBFLOW_PARAM];
		                        Router.getJqmHistory().activeIndex -= distance;
		                        Router.getJqmHistory().clearForward();
		                        if (param.destStacks) {
		                            Router.stop();
		                            if (0 !== distance) {
		                                history.go(-distance);
		                            }
		                            delete navOptions.subFlow;
		                            setTimeout(_navigate, 0);
		                        } else {
		                            Router.s_lastNavigateInfo.positiveNavigate = false;
		                            history.go(-distance);
		                        }
		                    } else {
		                        console.warn("subFlow begin status does not exist in history.");
		                        Router.s_lastNavigateInfo = {};
		                    }
		                };
		                Router.detectSubFlowBaseInfo = function() {
		                    var stack = Router.getJqmHistory().stack;
		                    var historyActiveIndex = Router.getJqmHistory().activeIndex;
		                    var i, distance;
		                    var param = {};
		                    var target;
		                    for (i = historyActiveIndex, distance = 0; 0 <= i; i--, distance++) {
		                        if (stack[i][Router.SUBFLOW_PARAM]) {
		                            target = stack[i];
		                            param = stack[i][Router.SUBFLOW_PARAM];
		                            break;
		                        }
		                    }
		                    if (null == param.additionalDistance) {
		                        param.additionalDistance = 0;
		                    }
		                    return {
		                        stack: target,
		                        subFlowParam: param,
		                        distance: distance + param.additionalDistance,
		                        isCurrent: function() {
		                            if (target && 0 === distance) {
		                                return true;
		                            } else {
		                                return false;
		                            }
		                        }()
		                    };
		                };
		                Router.pathToJqmDataUrl = function(path) {
		                    var url = Framework.toUrl(path);
		                    var dataUrl = $.mobile.path.convertUrlToDataUrl(url);
		                    return dataUrl;
		                };
		                Router.treatUrlHistory = function() {
		                    if (Router.s_lastNavigateInfo.positiveNavigate || history.length < Router.getJqmHistory().stack.length) {
		                        Router.getJqmHistory().clearForward();
		                    }
		                };
		                return Router;
		            }();
		            Router.s_initOptions = {};
		            Router.s_router = null;
		            Router.s_rootContexts = {};
		            Router.s_lastNavigateInfo = {};
		            Router.s_lastClickedTime = null;
		            Router.s_lastIntent = {};
		            Router.s_loadUrl = null;
		            Router.s_back = null;
		            Router.DELAY_TIME = 200;
		            Router.DATA_BACK_DESTINATION = "data-back-dst";
		            Router.DATA_NO_HASH_CHANGE = "data-no-hash-change";
		            Router.DATA_NO_VCLICK_HANDLE = "data-no-vclick-handle";
		            Router.BACK_DESTINATION_URL = "backDstUrl";
		            Router.SUBFLOW_PARAM = "subFlowParam";
		            Router.s_defaultInitOptions = {
		                anchorVclick: true
		            };
		            Router.s_defaultNavigateOptions = {
		                trigger: true,
		                replace: false,
		                intent: null
		            };
		            Framework.Router = Router;
		        })(Framework = CDP.Framework || (CDP.Framework = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        function waitForDeviceReady() {
		            var df = $.Deferred();
		            if (!CDP.Framework.Platform.Mobile) {
		                setTimeout(function() {
		                    df.resolve();
		                }, 100);
		            } else {
		                if (null == CDP.global.cordova || null == CDP.global.cordova.exec) {
		                    $(document).one("deviceready", function() {
		                        df.resolve();
		                    });
		                } else {
		                    df.resolve();
		                }
		            }
		            return df.promise();
		        }
		        CDP.waitForDeviceReady = waitForDeviceReady;
		        var _defaultBackButtonHandler = null;
		        function setBackButtonHandler(handler) {
		            var oldHandler = _defaultBackButtonHandler;
		            _defaultBackButtonHandler = handler;
		            return oldHandler;
		        }
		        CDP.setBackButtonHandler = setBackButtonHandler;
		        (function() {
		            waitForDeviceReady().done(function() {
		                $(document).on("backbutton", function(event) {
		                    if (_defaultBackButtonHandler) {
		                        _defaultBackButtonHandler(event);
		                    }
		                });
		            });
		        })();
		        var Framework;
		        (function(Framework) {
		            var TAG = "[CDP.Framework] ";
		            var _initializedState = {
		                done: false,
		                calling: false
		            };
		            var _activePage = null;
		            var _orientationListenerHolder = {};
		            var _lastOrientation = null;
		            function initialize(options) {
		                var df = $.Deferred();
		                var config = getConfig(options);
		                if (_initializedState.calling) {
		                    console.warn(TAG + "cdp.framework.jqm is already initialized, ignored.");
		                    return df.resolve();
		                }
		                _initializedState.calling = true;
		                CDP.initialize({
		                    success: function() {
		                        if (config.applyPatch) {
		                            Framework.Patch.apply();
		                        }
		                        config.jquery();
		                        if (!isAMD()) {
		                            console.warn(TAG + "need to init for 'jquery.mobile', 'i18Next' and 'CDP.Framework.Router' manually, because cdp.framework depends on require.js.");
		                            _initializedState.done = true;
		                            return df.resolve();
		                        }
		                        $(document).on("mobileinit", function() {
		                            config.jquerymobile();
		                            CDP.initializeI18N(config.i18n).always(function(info) {
		                                $(document).one("pagebeforechange", function(event, data) {
		                                    data.options.showLoadMsg = false;
		                                }).on("pagebeforecreate", function(event) {
		                                    $(event.target).localize();
		                                });
		                                if (Framework.Router.initialize({
		                                    anchorVclick: config.anchorVclick
		                                })) {
		                                    _initializedState.done = true;
		                                    df.resolve();
		                                } else {
		                                    console.error(TAG + "error. CDP.Framework.Router.initialize() failed.");
		                                    _initializedState.calling = false;
		                                    df.reject();
		                                }
		                            });
		                        });
		                        {
		                            var jqueryMajor = ~~$.fn.jquery.split(".")[0];
		                            if (3 <= jqueryMajor) {
		                                if (4 <= jqueryMajor) {
		                                    console.warn(TAG + "jquery-migrate for 3.0.0+ in use.");
		                                }
		                                !/* require */(/* empty */function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [ __WEBPACK_LOCAL_MODULE_3__ ]; (function() {
		                                    !/* require */(/* empty */[ __WEBPACK_LOCAL_MODULE_4__ ]);
		                                }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}());
		                            } else {
		                                !/* require */(/* empty */[ __WEBPACK_LOCAL_MODULE_4__ ]);
		                            }
		                        }
		                    },
		                    fail: function(error) {
		                        console.error(TAG + "error. CDP.initialize() failed.");
		                        _initializedState.calling = false;
		                        df.reject();
		                    }
		                });
		                return df.promise();
		            }
		            Framework.initialize = initialize;
		            function isInitialized() {
		                return _initializedState.done;
		            }
		            Framework.isInitialized = isInitialized;
		            function registerOrientationChangedListener(key, listener) {
		                _orientationListenerHolder[key] = listener;
		            }
		            Framework.registerOrientationChangedListener = registerOrientationChangedListener;
		            function unregisterOrientationChangedListener(key) {
		                delete _orientationListenerHolder[key];
		            }
		            Framework.unregisterOrientationChangedListener = unregisterOrientationChangedListener;
		            function setupEventHandlers() {
		                (function() {
		                    var oldBackButtonHandler = CDP.setBackButtonHandler(null);
		                    var baseBackButtonHandler = function(event) {
		                        if (_activePage && _activePage.onHardwareBackButton(event)) {
		                            return;
		                        } else {
		                            oldBackButtonHandler(event);
		                        }
		                    };
		                    CDP.setBackButtonHandler(baseBackButtonHandler);
		                })();
		                (function() {
		                    var oldRouteChangeHandler = CDP.Framework.setBeforeRouteChangeHandler(null);
		                    var baseRouteChangeHandler = function() {
		                        if (_activePage) {
		                            return _activePage.onBeforeRouteChange();
		                        } else {
		                            return oldRouteChangeHandler();
		                        }
		                    };
		                    CDP.Framework.setBeforeRouteChangeHandler(baseRouteChangeHandler);
		                })();
		            }
		            Framework.setupEventHandlers = setupEventHandlers;
		            function setActivePage(page) {
		                _activePage = page;
		                if (_activePage) {
		                    _lastOrientation = Framework.getOrientation();
		                }
		            }
		            Framework.setActivePage = setActivePage;
		            function getDefaultClickEvent() {
		                return Framework.Patch.s_vclickEvent;
		            }
		            Framework.getDefaultClickEvent = getDefaultClickEvent;
		            function getConfig(options) {
		                var defConfig = {
		                    jquery: function() {
		                        $.support.cors = true;
		                        $.ajaxSetup({
		                            cache: false
		                        });
		                    },
		                    jquerymobile: function() {
		                        $.mobile.allowCrossDomainPages = true;
		                        $.mobile.defaultPageTransition = "none";
		                        $.mobile.hashListeningEnabled = false;
		                        $.mobile.pushStateEnabled = false;
		                    },
		                    i18n: {},
		                    applyPatch: true,
		                    anchorVclick: true
		                };
		                return $.extend({}, defConfig, CDP.global.Config, options);
		            }
		            function isAMD() {
		                return "function" === "function" && __webpack_require__(3);
		            }
		            $(window).on("resize", function(event) {
		                var newOrientation = Framework.getOrientation();
		                if (_lastOrientation !== newOrientation) {
		                    for (var key in _orientationListenerHolder) {
		                        _orientationListenerHolder[key].onOrientationChanged(newOrientation);
		                    }
		                    if (_activePage) {
		                        _activePage.onOrientationChanged(newOrientation);
		                    }
		                    _lastOrientation = newOrientation;
		                }
		            });
		        })(Framework = CDP.Framework || (CDP.Framework = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var Framework;
		        (function(Framework) {
		            var Page = function() {
		                function Page(_url, _id, options) {
		                    this._url = _url;
		                    this._id = _id;
		                    this.setup(options);
		                }
		                Object.defineProperty(Page.prototype, "active", {
		                    get: function() {
		                        return !!this._$page && this._$page.hasClass("ui-page-active");
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(Page.prototype, "url", {
		                    get: function() {
		                        return this._url;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(Page.prototype, "id", {
		                    get: function() {
		                        return this._id;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(Page.prototype, "$page", {
		                    get: function() {
		                        return this._$page;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(Page.prototype, "$header", {
		                    get: function() {
		                        return this._$header;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(Page.prototype, "$footer", {
		                    get: function() {
		                        return this._$footer;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(Page.prototype, "intent", {
		                    get: function() {
		                        return this._intent;
		                    },
		                    set: function(newIntent) {
		                        this._intent = newIntent;
		                        this._intent._update = true;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Page.prototype.onOrientationChanged = function(newOrientation) {
		                    if (this._owner) {
		                        this._owner.onOrientationChanged(newOrientation);
		                    }
		                };
		                Page.prototype.onHardwareBackButton = function(event) {
		                    if (this._owner) {
		                        return this._owner.onHardwareBackButton(event);
		                    } else {
		                        return false;
		                    }
		                };
		                Page.prototype.onBeforeRouteChange = function() {
		                    if (this._owner) {
		                        return this._owner.onBeforeRouteChange();
		                    } else {
		                        return $.Deferred().resolve().promise();
		                    }
		                };
		                Page.prototype.onCommand = function(event, kind) {
		                    if (this._owner) {
		                        this._owner.onCommand(event, kind);
		                    }
		                };
		                Page.prototype.onInitialize = function(event) {
		                    if (this._owner) {
		                        this._owner.onInitialize(event);
		                    }
		                };
		                Page.prototype.onPageBeforeCreate = function(event) {
		                    if (this._owner) {
		                        this._owner.onPageBeforeCreate(event);
		                    }
		                };
		                Page.prototype.onPageInit = function(event) {
		                    if (this._owner) {
		                        this._owner.onPageInit(event);
		                    }
		                };
		                Page.prototype.onPageBeforeShow = function(event, data) {
		                    if (this._owner) {
		                        this._owner.onPageBeforeShow(event, data);
		                    }
		                };
		                Page.prototype.onPageShow = function(event, data) {
		                    if (this._owner) {
		                        this._owner.onPageShow(event, data);
		                    }
		                };
		                Page.prototype.onPageBeforeHide = function(event, data) {
		                    if (this._owner) {
		                        this._owner.onPageBeforeHide(event, data);
		                    }
		                };
		                Page.prototype.onPageHide = function(event, data) {
		                    if (this._owner) {
		                        this._owner.onPageHide(event, data);
		                    }
		                };
		                Page.prototype.onPageRemove = function(event) {
		                    if (this._owner) {
		                        this._owner.onPageRemove(event);
		                    }
		                };
		                Page.prototype.setup = function(options) {
		                    var _this = this;
		                    this._initialized = false;
		                    this._intent = null;
		                    var selector = "#" + this._id;
		                    $(document).off("pagebeforecreate", selector).on("pagebeforecreate", selector, function(event) {
		                        _this._$page = $(selector).first();
		                        _this._$header = _this._$page.children(":jqmData(role=header)").first();
		                        _this._$footer = _this._$page.children(":jqmData(role=footer)").first();
		                        _this._$page.on("pagecreate", function(event) {
		                            _this.pageInit(event);
		                        }).on("pagebeforeshow", function(event, data) {
		                            _this.pageBeforeShow(event, data);
		                        }).on("pageshow", function(event, data) {
		                            _this.pageShow(event, data);
		                        }).on("pagebeforehide", function(event, data) {
		                            _this.pageBeforeHide(event, data);
		                        }).on("pagehide", function(event, data) {
		                            _this.pageHide(event, data);
		                        }).on("pageremove", function(event) {
		                            _this.pageRemove(event);
		                        });
		                        _this.pageBeforeCreate(event);
		                    });
		                    options = options || {};
		                    this._owner = options.owner;
		                    this._keepIntent = options.keepIntent;
		                    if (null == options.route) {
		                        options.route = this._id;
		                    }
		                    Framework.Router.register(options.route, this._url, options.top, options.callback);
		                };
		                Page.prototype.getDirection = function() {
		                    var activeIndex = Framework.Router.getJqmHistory().activeIndex;
		                    var prevIndex = Framework.Router.getJqmHistory().previousIndex;
		                    if (null == activeIndex || null == prevIndex) {
		                        return "unknown";
		                    } else if (prevIndex === activeIndex) {
		                        return "same";
		                    } else if (activeIndex < prevIndex) {
		                        return "back";
		                    } else {
		                        return "forward";
		                    }
		                };
		                Page.prototype.pageBeforeCreate = function(event) {
		                    this.onPageBeforeCreate(event);
		                };
		                Page.prototype.pageInit = function(event) {
		                    if (!this._initialized) {
		                        this.onInitialize(event);
		                        this._initialized = true;
		                    }
		                    this.onPageInit(event);
		                };
		                Page.prototype.pageBeforeShow = function(event, data) {
		                    Framework.setActivePage(this);
		                    this._intent = Framework.Router.popIntent();
		                    this.onPageBeforeShow(event, $.extend(data, {
		                        direction: this.getDirection()
		                    }));
		                };
		                Page.prototype.pageShow = function(event, data) {
		                    this.onPageShow(event, $.extend(data, {
		                        direction: this.getDirection()
		                    }));
		                };
		                Page.prototype.pageBeforeHide = function(event, data) {
		                    this.onPageBeforeHide(event, $.extend(data, {
		                        direction: this.getDirection()
		                    }));
		                    if (null != this._intent && (this._keepIntent || this._intent._update)) {
		                        delete this._intent._update;
		                        Framework.Router.pushIntent(this._intent);
		                    } else if (Framework.Router.fromHashChanged() && Framework.Router.isInSubFlow()) {
		                        Framework.Router.pushIntent(this._intent);
		                    }
		                    this._intent = null;
		                    Framework.setActivePage(null);
		                };
		                Page.prototype.pageHide = function(event, data) {
		                    this.onPageHide(event, $.extend(data, {
		                        direction: this.getDirection()
		                    }));
		                };
		                Page.prototype.pageRemove = function(event) {
		                    this.onPageRemove(event);
		                    this._$page.off();
		                    this._$page = null;
		                    this._$header.off();
		                    this._$header = null;
		                    this._$footer.off();
		                    this._$footer = null;
		                };
		                return Page;
		            }();
		            Framework.Page = Page;
		        })(Framework = CDP.Framework || (CDP.Framework = {}));
		    })(CDP || (CDP = {}));
		    return CDP.Framework;
		});

		(function(root, factory) {
		    if (true) {
		        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(1), __webpack_require__(4) ], __WEBPACK_LOCAL_MODULE_6__ = (function($, _) {
		            return factory(root.CDP || (root.CDP = {}), $, _);
		        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));
		    } else if (typeof exports === "object") {
		        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"), require("underscore"));
		    } else {
		        factory(root.CDP || (root.CDP = {}), root.jQuery || root.$, root._);
		    }
		})(window, function (CDP, $, _) {
		    CDP.Tools = CDP.Tools || {};
		    var CDP;
		    (function(CDP) {
		        var Tools;
		        (function(Tools) {
		            Tools.global = Tools.global || window;
		        })(Tools = CDP.Tools || (CDP.Tools = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var Tools;
		        (function(Tools) {
		            var TAG = "[CDP.Tools.Blob] ";
		            var Blob;
		            (function(Blob) {
		                function getBlobBuilder() {
		                    return Tools.global.BlobBuilder || Tools.global.WebKitBlobBuilder || Tools.global.MozBlobBuilder || Tools.global.MSBlobBuilder;
		                }
		                function arrayBufferToBlob(buf, mimeType) {
		                    var blob = null;
		                    var blobBuilderObject = getBlobBuilder();
		                    if (blobBuilderObject != null) {
		                        var blobBuilder = new blobBuilderObject();
		                        blobBuilder.append(buf);
		                        blob = blobBuilder.getBlob(mimeType);
		                    } else {
		                        blob = new Tools.global.Blob([ buf ], {
		                            type: mimeType
		                        });
		                    }
		                    return blob;
		                }
		                Blob.arrayBufferToBlob = arrayBufferToBlob;
		                function base64ToBlob(base64, mimeType) {
		                    var blob = null;
		                    var blobBuilderObject = getBlobBuilder();
		                    if (blobBuilderObject != null) {
		                        var blobBuilder = new blobBuilderObject();
		                        blobBuilder.append(base64ToArrayBuffer(base64));
		                        blob = blobBuilder.getBlob(mimeType);
		                    } else {
		                        blob = new Tools.global.Blob([ base64ToArrayBuffer(base64) ], {
		                            type: mimeType
		                        });
		                    }
		                    return blob;
		                }
		                Blob.base64ToBlob = base64ToBlob;
		                function base64ToArrayBuffer(base64) {
		                    var bytes = window.atob(base64);
		                    var arrayBuffer = new ArrayBuffer(bytes.length);
		                    var data = new Uint8Array(arrayBuffer);
		                    for (var i = 0, len = bytes.length; i < len; ++i) {
		                        data[i] = bytes.charCodeAt(i);
		                    }
		                    return arrayBuffer;
		                }
		                Blob.base64ToArrayBuffer = base64ToArrayBuffer;
		                function base64ToUint8Array(encoded) {
		                    var bytes = window.atob(encoded);
		                    var data = new Uint8Array(bytes.length);
		                    for (var i = 0, len = bytes.length; i < len; ++i) {
		                        data[i] = bytes.charCodeAt(i);
		                    }
		                    return data;
		                }
		                Blob.base64ToUint8Array = base64ToUint8Array;
		                function arrayBufferToBase64(arrayBuffer) {
		                    var bytes = new Uint8Array(arrayBuffer);
		                    return uint8ArrayToBase64(bytes);
		                }
		                Blob.arrayBufferToBase64 = arrayBufferToBase64;
		                function uint8ArrayToBase64(bytes) {
		                    var data = "";
		                    for (var i = 0, len = bytes.byteLength; i < len; ++i) {
		                        data += String.fromCharCode(bytes[i]);
		                    }
		                    return window.btoa(data);
		                }
		                Blob.uint8ArrayToBase64 = uint8ArrayToBase64;
		                Blob.URL = function() {
		                    return Tools.global.URL || Tools.global.webkitURL;
		                }();
		            })(Blob = Tools.Blob || (Tools.Blob = {}));
		        })(Tools = CDP.Tools || (CDP.Tools = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var Tools;
		        (function(Tools) {
		            var TAG = "[CDP.Tools.DateTime] ";
		            var DateTime = function() {
		                function DateTime() {}
		                DateTime.computeDate = function(base, addDays) {
		                    var dt = new Date(base.getTime());
		                    var baseSec = dt.getTime();
		                    var addSec = addDays * 864e5;
		                    var targetSec = baseSec + addSec;
		                    dt.setTime(targetSec);
		                    return dt;
		                };
		                DateTime.convertISOStringToDate = function(dateString) {
		                    var dateTime = dateString.split("T"), dateArray = dateTime[0].split("-"), timeArray, secArray, dateObject;
		                    if (dateTime[1]) {
		                        timeArray = dateTime[1].split(":");
		                        secArray = timeArray[2].split(".");
		                    }
		                    if (timeArray) {
		                        dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], secArray[0], secArray[1]);
		                    } else {
		                        if (dateArray[2]) {
		                            dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
		                        } else if (dateArray[1]) {
		                            dateObject = new Date(dateArray[0], dateArray[1] - 1);
		                        } else {
		                            dateObject = new Date(dateArray[0]);
		                        }
		                    }
		                    return dateObject;
		                };
		                DateTime.convertDateToISOString = function(date, target) {
		                    if (target === void 0) {
		                        target = "msec";
		                    }
		                    var isoDateString;
		                    switch (target) {
		                      case "year":
		                      case "month":
		                      case "date":
		                      case "hour":
		                      case "min":
		                      case "sec":
		                      case "msec":
		                        break;

		                      default:
		                        console.warn(TAG + "unknown target: " + target);
		                        target = "msec";
		                    }
		                    isoDateString = date.getFullYear();
		                    if ("year" === target) {
		                        return isoDateString;
		                    }
		                    isoDateString += "-" + DateTime.numberToDoubleDigitsString(date.getMonth() + 1);
		                    if ("month" === target) {
		                        return isoDateString;
		                    }
		                    isoDateString += "-" + DateTime.numberToDoubleDigitsString(date.getDate());
		                    if ("date" === target) {
		                        return isoDateString;
		                    }
		                    isoDateString += "T" + DateTime.numberToDoubleDigitsString(date.getHours());
		                    if ("hour" === target) {
		                        return isoDateString;
		                    }
		                    isoDateString += ":" + DateTime.numberToDoubleDigitsString(date.getMinutes());
		                    if ("min" === target) {
		                        return isoDateString;
		                    }
		                    isoDateString += ":" + DateTime.numberToDoubleDigitsString(date.getSeconds());
		                    if ("sec" === target) {
		                        return isoDateString;
		                    }
		                    isoDateString += "." + String((date.getMilliseconds() / 1e3).toFixed(3)).slice(2, 5);
		                    return isoDateString;
		                };
		                DateTime.convertFileSystemStringToDate = function(dateString) {
		                    var dateTime = dateString.split("T"), dateArray = dateTime[0].split("_"), timeArray, dateObject;
		                    if (dateTime[1]) {
		                        timeArray = dateTime[1].split("_");
		                    }
		                    if (timeArray) {
		                        dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], timeArray[0], timeArray[1], timeArray[2], timeArray[3]);
		                    } else {
		                        if (dateArray[2]) {
		                            dateObject = new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
		                        } else if (dateArray[1]) {
		                            dateObject = new Date(dateArray[0], dateArray[1] - 1);
		                        } else {
		                            dateObject = new Date(dateArray[0]);
		                        }
		                    }
		                    return dateObject;
		                };
		                DateTime.convertDateToFileSystemString = function(date, target) {
		                    if (target === void 0) {
		                        target = "msec";
		                    }
		                    var fileSystemString;
		                    switch (target) {
		                      case "year":
		                      case "month":
		                      case "date":
		                      case "hour":
		                      case "min":
		                      case "sec":
		                      case "msec":
		                        break;

		                      default:
		                        console.warn(TAG + "unknown target: " + target);
		                        target = "msec";
		                    }
		                    fileSystemString = date.getFullYear();
		                    if ("year" === target) {
		                        return fileSystemString;
		                    }
		                    fileSystemString += "_" + DateTime.numberToDoubleDigitsString(date.getMonth() + 1);
		                    if ("month" === target) {
		                        return fileSystemString;
		                    }
		                    fileSystemString += "_" + DateTime.numberToDoubleDigitsString(date.getDate());
		                    if ("date" === target) {
		                        return fileSystemString;
		                    }
		                    fileSystemString += "T" + DateTime.numberToDoubleDigitsString(date.getHours());
		                    if ("hour" === target) {
		                        return fileSystemString;
		                    }
		                    fileSystemString += "_" + DateTime.numberToDoubleDigitsString(date.getMinutes());
		                    if ("min" === target) {
		                        return fileSystemString;
		                    }
		                    fileSystemString += "_" + DateTime.numberToDoubleDigitsString(date.getSeconds());
		                    if ("sec" === target) {
		                        return fileSystemString;
		                    }
		                    fileSystemString += "_" + String((date.getMilliseconds() / 1e3).toFixed(3)).slice(2, 5);
		                    return fileSystemString;
		                };
		                DateTime.numberToDoubleDigitsString = function(num) {
		                    if (num < 0 || num > 100) {
		                        return null;
		                    }
		                    if (num < 10) {
		                        return "0" + num;
		                    }
		                    return "" + num;
		                };
		                return DateTime;
		            }();
		            Tools.DateTime = DateTime;
		        })(Tools = CDP.Tools || (CDP.Tools = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var Tools;
		        (function(Tools) {
		            var TAG = "[CDP.Tools.Functions] ";
		            function abs(x) {
		                return x >= 0 ? x : -x;
		            }
		            Tools.abs = abs;
		            function max(lhs, rhs) {
		                return lhs >= rhs ? lhs : rhs;
		            }
		            Tools.max = max;
		            function min(lhs, rhs) {
		                return lhs <= rhs ? lhs : rhs;
		            }
		            Tools.min = min;
		            function await(condition, msec) {
		                if (msec === void 0) {
		                    msec = 0;
		                }
		                var df = $.Deferred();
		                var proc = function() {
		                    if (!condition()) {
		                        setTimeout(proc, msec);
		                    } else {
		                        df.resolve();
		                    }
		                };
		                setTimeout(proc, msec);
		                return df.promise();
		            }
		            Tools.await = await;
		            function toZeroPadding(no, limit) {
		                var signed = "";
		                no = Number(no);
		                if (isNaN(no) || isNaN(limit) || limit <= 0) {
		                    return null;
		                }
		                if (no < 0) {
		                    no = Tools.abs(no);
		                    signed = "-";
		                }
		                return signed + (Array(limit).join("0") + no).slice(-limit);
		            }
		            Tools.toZeroPadding = toZeroPadding;
		            function inherit(subClass, superClass) {
		                var _prototype = subClass.prototype;
		                function _inherit() {
		                    this.constructor = subClass;
		                }
		                _inherit.prototype = superClass.prototype;
		                subClass.prototype = new _inherit();
		                $.extend(subClass.prototype, _prototype);
		            }
		            Tools.inherit = inherit;
		            function mixin(derived) {
		                var bases = [];
		                for (var _i = 1; _i < arguments.length; _i++) {
		                    bases[_i - 1] = arguments[_i];
		                }
		                bases.forEach(function(base) {
		                    Object.getOwnPropertyNames(base.prototype).forEach(function(name) {
		                        derived.prototype[name] = base.prototype[name];
		                    });
		                });
		            }
		            Tools.mixin = mixin;
		            function extend(protoProps, staticProps) {
		                var parent = this;
		                var child;
		                if (protoProps && protoProps.hasOwnProperty("constructor")) {
		                    child = protoProps.constructor;
		                } else {
		                    child = function() {
		                        return parent.apply(this, arguments);
		                    };
		                }
		                $.extend(child, parent, staticProps);
		                var Surrogate = function() {
		                    this.constructor = child;
		                };
		                Surrogate.prototype = parent.prototype;
		                child.prototype = new Surrogate();
		                if (protoProps) {
		                    $.extend(child.prototype, protoProps);
		                }
		                child.__super__ = parent.prototype;
		                return child;
		            }
		            Tools.extend = extend;
		            function getDevicePixcelRatio() {
		                var mediaQuery;
		                var is_firefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
		                if (null != window.devicePixelRatio && !is_firefox) {
		                    return window.devicePixelRatio;
		                } else if (window.matchMedia) {
		                    mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),                    (min--moz-device-pixel-ratio: 1.5),                    (-o-min-device-pixel-ratio: 3/2),                    (min-resolution: 1.5dppx)";
		                    if (window.matchMedia(mediaQuery).matches) {
		                        return 1.5;
		                    }
		                    mediaQuery = "(-webkit-min-device-pixel-ratio: 2),                    (min--moz-device-pixel-ratio: 2),                    (-o-min-device-pixel-ratio: 2/1),                    (min-resolution: 2dppx)";
		                    if (window.matchMedia(mediaQuery).matches) {
		                        return 2;
		                    }
		                    mediaQuery = "(-webkit-min-device-pixel-ratio: 0.75),                    (min--moz-device-pixel-ratio: 0.75),                    (-o-min-device-pixel-ratio: 3/4),                    (min-resolution: 0.75dppx)";
		                    if (window.matchMedia(mediaQuery).matches) {
		                        return .7;
		                    }
		                } else {
		                    return 1;
		                }
		            }
		            Tools.getDevicePixcelRatio = getDevicePixcelRatio;
		            function doWork(worker, msg) {
		                var df = $.Deferred();
		                if (!worker) {
		                    return df.reject("null argument");
		                }
		                var wk;
		                switch (typeof worker) {
		                  case "object":
		                    wk = worker;
		                    break;

		                  case "string":
		                    try {
		                        wk = new Worker(worker);
		                    } catch (ex) {
		                        console.error(TAG + ex);
		                        return df.reject(ex);
		                    }
		                    break;

		                  default:
		                    return df.reject("invalid type argument");
		                }
		                wk.onerror = function(error) {
		                    return df.reject(error);
		                };
		                wk.onmessage = function(event) {
		                    return df.resolve(event.data);
		                };
		                wk.postMessage(msg);
		                return df.promise();
		            }
		            Tools.doWork = doWork;
		        })(Tools = CDP.Tools || (CDP.Tools = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var Tools;
		        (function(Tools) {
		            var TAG = "[CDP.Tools.Template] ";
		            var Template = function() {
		                function Template() {}
		                Template.getTemplateElement = function(key, src) {
		                    var mapElement = Template.getElementMap();
		                    var $element = mapElement[key];
		                    try {
		                        if (!$element) {
		                            if (src) {
		                                var html = Template.findHtmlFromSource(src);
		                                $element = $(html).find(key);
		                            } else {
		                                $element = $(key);
		                            }
		                            if ($element <= 0) {
		                                throw "invalid [key, src] = [" + key + ", " + src + "]";
		                            }
		                            mapElement[key] = $element;
		                        }
		                    } catch (exception) {
		                        console.error(TAG + exception);
		                        return null;
		                    }
		                    return $element;
		                };
		                Template.empty = function() {
		                    Template._mapElement = null;
		                    Template._mapSource = null;
		                };
		                Template.getJST = function(key, src) {
		                    var $element = this.getTemplateElement(key, src);
		                    var template = null;
		                    var jst;
		                    if (null != Tools.global.Hogan) {
		                        template = Hogan.compile($element.text());
		                        jst = function(data) {
		                            return template.render(data);
		                        };
		                    } else {
		                        template = _.template($element.html());
		                        jst = function(data) {
		                            return template(data).replace(/\n|\t/g, "");
		                        };
		                    }
		                    return jst;
		                };
		                Template.getElementMap = function() {
		                    if (!Template._mapElement) {
		                        Template._mapElement = {};
		                    }
		                    return Template._mapElement;
		                };
		                Template.getSourceMap = function() {
		                    if (!Template._mapSource) {
		                        Template._mapSource = {};
		                    }
		                    return Template._mapSource;
		                };
		                Template.findHtmlFromSource = function(src) {
		                    var mapSource = Template.getSourceMap();
		                    var html = mapSource[src];
		                    if (!html) {
		                        $.ajax({
		                            url: src,
		                            method: "GET",
		                            async: false,
		                            dataType: "html",
		                            success: function(data) {
		                                html = data;
		                            },
		                            error: function(data, status) {
		                                throw "ajax request failed. status: " + status;
		                            }
		                        });
		                        mapSource[src] = html;
		                    }
		                    return html;
		                };
		                return Template;
		            }();
		            Tools.Template = Template;
		        })(Tools = CDP.Tools || (CDP.Tools = {}));
		    })(CDP || (CDP = {}));
		    return CDP.Tools;
		});

		(function(root, factory) {
		    if (true) {
		        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__(1), __webpack_require__(4), __webpack_require__(2) ], __WEBPACK_LOCAL_MODULE_7__ = (function($, _, Backbone) {
		            return factory(root.CDP || (root.CDP = {}), $, _, Backbone);
		        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));
		    } else if (typeof exports === "object") {
		        module.exports = factory(root.CDP || (root.CDP = {}), require("jquery"), require("underscore"), require("backbone"));
		    } else {
		        factory(root.CDP || (root.CDP = {}), root.$, root._, root.Backbone);
		    }
		})(window, function (CDP, $, _, Backbone) {
		    CDP.UI = CDP.UI || {};
		    var __extends = this && this.__extends || function(d, b) {
		        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		        function __() {
		            this.constructor = d;
		        }
		        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		    };
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var ListViewGlobalConfig;
		            (function(ListViewGlobalConfig) {
		                ListViewGlobalConfig.WRAPPER_CLASS = "listview-wrapper";
		                ListViewGlobalConfig.WRAPPER_SELECTOR = "." + ListViewGlobalConfig.WRAPPER_CLASS;
		                ListViewGlobalConfig.SCROLL_MAP_CLASS = "listview-scroll-map";
		                ListViewGlobalConfig.SCROLL_MAP_SELECTOR = "." + ListViewGlobalConfig.SCROLL_MAP_CLASS;
		                ListViewGlobalConfig.INACTIVE_CLASS = "inactive";
		                ListViewGlobalConfig.INACTIVE_CLASS_SELECTOR = "." + ListViewGlobalConfig.INACTIVE_CLASS;
		                ListViewGlobalConfig.RECYCLE_CLASS = "listview-recycle";
		                ListViewGlobalConfig.RECYCLE_CLASS_SELECTOR = "." + ListViewGlobalConfig.RECYCLE_CLASS;
		                ListViewGlobalConfig.LISTITEM_BASE_CLASS = "listview-item-base";
		                ListViewGlobalConfig.LISTITEM_BASE_CLASS_SELECTOR = "." + ListViewGlobalConfig.LISTITEM_BASE_CLASS;
		                ListViewGlobalConfig.DATA_PAGE_INDEX = "data-page-index";
		                ListViewGlobalConfig.DATA_CONTAINER_INDEX = "data-container-index";
		            })(ListViewGlobalConfig = UI.ListViewGlobalConfig || (UI.ListViewGlobalConfig = {}));
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var _Config = CDP.UI.ListViewGlobalConfig;
		            var _ToolCSS = CDP.UI._ListViewUtils;
		            var TAG = "[CDP.UI.LineProfile] ";
		            var LineProfile = function() {
		                function LineProfile(_owner, _height, _initializer, _info) {
		                    this._owner = _owner;
		                    this._height = _height;
		                    this._initializer = _initializer;
		                    this._info = _info;
		                    this._index = null;
		                    this._pageIndex = null;
		                    this._offset = null;
		                    this._$base = null;
		                    this._instance = null;
		                }
		                LineProfile.prototype.activate = function() {
		                    if (null == this._instance) {
		                        var options = void 0;
		                        this._$base = this.prepareBaseElement();
		                        options = $.extend({}, {
		                            el: this._$base,
		                            owner: this._owner,
		                            lineProfile: this
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
		                LineProfile.prototype.hide = function() {
		                    if (null == this._instance) {
		                        this.activate();
		                    }
		                    if ("hidden" !== this._$base.css("visibility")) {
		                        this._$base.css("visibility", "hidden");
		                    }
		                };
		                LineProfile.prototype.inactivate = function() {
		                    if (null != this._instance) {
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
		                LineProfile.prototype.refresh = function() {
		                    if (null != this._instance) {
		                        this._instance.render();
		                    }
		                };
		                LineProfile.prototype.isActive = function() {
		                    return null != this._instance;
		                };
		                LineProfile.prototype.updateHeight = function(newHeight, options) {
		                    var delta = newHeight - this._height;
		                    this._height = newHeight;
		                    this._owner.updateScrollMapHeight(delta);
		                    if (null != options && options.reflectAll) {
		                        this._owner.updateProfiles(this._index);
		                    }
		                };
		                LineProfile.prototype.resetDepth = function() {
		                    if (null != this._instance) {
		                        this._$base.css("z-index", this._owner.getListViewOptions().baseDepth);
		                    }
		                };
		                Object.defineProperty(LineProfile.prototype, "height", {
		                    get: function() {
		                        return this._height;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(LineProfile.prototype, "index", {
		                    get: function() {
		                        return this._index;
		                    },
		                    set: function(index) {
		                        this._index = index;
		                        if (null != this._$base) {
		                            this.updateIndex(this._$base);
		                        }
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(LineProfile.prototype, "pageIndex", {
		                    get: function() {
		                        return this._pageIndex;
		                    },
		                    set: function(index) {
		                        this._pageIndex = index;
		                        if (null != this._$base) {
		                            this.updatePageIndex(this._$base);
		                        }
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(LineProfile.prototype, "offset", {
		                    get: function() {
		                        return this._offset;
		                    },
		                    set: function(offset) {
		                        this._offset = offset;
		                        if (null != this._$base) {
		                            this.updateOffset(this._$base);
		                        }
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(LineProfile.prototype, "info", {
		                    get: function() {
		                        return this._info;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                LineProfile.prototype.prepareBaseElement = function() {
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
		                    } else {
		                        $base = $("<" + itemTagName + " class='" + _Config.LISTITEM_BASE_CLASS + "'></" + itemTagName + ">");
		                        $base.css("display", "none");
		                        $map.append($base);
		                    }
		                    if ($base.height() !== this._height) {
		                        $base.height(this._height);
		                    }
		                    this.updateIndex($base);
		                    this.updateOffset($base);
		                    return $base;
		                };
		                LineProfile.prototype.updateIndex = function($base) {
		                    if ($base.attr(_Config.DATA_CONTAINER_INDEX) !== this._index.toString()) {
		                        $base.attr(_Config.DATA_CONTAINER_INDEX, this._index.toString());
		                    }
		                };
		                LineProfile.prototype.updatePageIndex = function($base) {
		                    if ($base.attr(_Config.DATA_PAGE_INDEX) !== this._pageIndex.toString()) {
		                        $base.attr(_Config.DATA_PAGE_INDEX, this._pageIndex.toString());
		                    }
		                };
		                LineProfile.prototype.updateOffset = function($base) {
		                    var transform = {};
		                    if (this._owner.getListViewOptions().enableTransformOffset) {
		                        if (_ToolCSS.getCssMatrixValue($base, "translateY") !== this._offset) {
		                            for (var i = 0; i < _ToolCSS.cssPrefixes.length; i++) {
		                                transform[_ToolCSS.cssPrefixes[i] + "transform"] = "translate3d(0px," + this._offset + "px,0px)";
		                            }
		                            $base.css(transform);
		                        }
		                    } else {
		                        if (parseInt($base.css("top"), 10) !== this._offset) {
		                            $base.css("top", this._offset + "px");
		                        }
		                    }
		                };
		                return LineProfile;
		            }();
		            UI.LineProfile = LineProfile;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var TAG = "[CDP.UI.GroupProfile] ";
		            var GroupProfile = function() {
		                function GroupProfile(_id, _owner) {
		                    this._id = _id;
		                    this._owner = _owner;
		                    this._parent = null;
		                    this._children = [];
		                    this._expanded = false;
		                    this._status = "unregistered";
		                    this._mapLines = {};
		                }
		                GroupProfile.prototype.addItem = function(height, initializer, info, layoutKey) {
		                    var line;
		                    var options = $.extend({}, {
		                        groupProfile: this
		                    }, info);
		                    if (null == layoutKey) {
		                        layoutKey = GroupProfile.LAYOUT_KEY_DEFAULT;
		                    }
		                    if (null == this._mapLines[layoutKey]) {
		                        this._mapLines[layoutKey] = [];
		                    }
		                    line = new UI.LineProfile(this._owner.core, Math.floor(height), initializer, options);
		                    if ("registered" === this._status && (null == this._owner.layoutKey || layoutKey === this._owner.layoutKey)) {
		                        this._owner._addLine(line, this.getLastLineIndex() + 1);
		                        this._owner.update();
		                    }
		                    this._mapLines[layoutKey].push(line);
		                    return this;
		                };
		                GroupProfile.prototype.addChildren = function(target) {
		                    var _this = this;
		                    var children = target instanceof Array ? target : [ target ];
		                    children.forEach(function(child) {
		                        child.setParent(_this);
		                    });
		                    this._children = this._children.concat(children);
		                    return this;
		                };
		                GroupProfile.prototype.getParent = function() {
		                    return this._parent;
		                };
		                GroupProfile.prototype.getChildren = function() {
		                    return this._children;
		                };
		                GroupProfile.prototype.hasChildren = function(layoutKey) {
		                    if (this._children.length <= 0) {
		                        return false;
		                    } else if (null != layoutKey) {
		                        return this._children[0].hasLayoutKeyOf(layoutKey);
		                    } else {
		                        return true;
		                    }
		                };
		                GroupProfile.prototype.hasLayoutKeyOf = function(layoutKey) {
		                    if (null == layoutKey) {
		                        layoutKey = GroupProfile.LAYOUT_KEY_DEFAULT;
		                    }
		                    return null != this._mapLines[layoutKey];
		                };
		                GroupProfile.prototype.expand = function() {
		                    var _this = this;
		                    var lines = [];
		                    if (this._lines.length < 0) {
		                        console.warn(TAG + "this group has no lines.");
		                    } else if (!this.hasChildren()) {
		                        console.warn(TAG + "this group has no children.");
		                    } else if (!this.isExpanded()) {
		                        lines = this.queryOperationTarget("registered");
		                        this._expanded = true;
		                        if (0 < lines.length) {
		                            this._owner.statusScope("expanding", function() {
		                                _this._lines.forEach(function(line) {
		                                    line.refresh();
		                                });
		                                _this._owner._addLine(lines, _this.getLastLineIndex() + 1);
		                                _this._owner.update();
		                            });
		                        }
		                    }
		                };
		                GroupProfile.prototype.collapse = function(delay) {
		                    var _this = this;
		                    var lines = [];
		                    if (!this.hasChildren()) {
		                        console.warn(TAG + "this group has no children.");
		                    } else if (this.isExpanded()) {
		                        lines = this.queryOperationTarget("unregistered");
		                        this._expanded = false;
		                        if (0 < lines.length) {
		                            delay = null != delay ? delay : this._owner.core.getListViewOptions().animationDuration;
		                            this._owner.statusScope("collapsing", function() {
		                                _this._lines.forEach(function(line) {
		                                    line.refresh();
		                                });
		                                _this._owner.removeItem(lines[0].index, lines.length, delay);
		                                _this._owner.update();
		                            });
		                        }
		                    }
		                };
		                GroupProfile.prototype.ensureVisible = function(options) {
		                    if (0 < this._lines.length) {
		                        this._owner.ensureVisible(this._lines[0].index, options);
		                    } else if (null != options.callback) {
		                        options.callback();
		                    }
		                };
		                GroupProfile.prototype.toggle = function(delay) {
		                    if (this._expanded) {
		                        this.collapse(delay);
		                    } else {
		                        this.expand();
		                    }
		                };
		                GroupProfile.prototype.isExpanded = function() {
		                    return this._expanded;
		                };
		                GroupProfile.prototype.register = function(insertTo) {
		                    if (this._parent) {
		                        console.error(TAG + "logic error: 'register' method is acceptable only top group.");
		                    } else {
		                        this._owner._addLine(this.preprocess("registered"), insertTo);
		                    }
		                    return this;
		                };
		                GroupProfile.prototype.restore = function() {
		                    var lines = [];
		                    if (this._parent) {
		                        console.error(TAG + "logic error: 'restore' method is acceptable only top group.");
		                    } else if (this._lines) {
		                        if (this._expanded) {
		                            lines = this._lines.concat(this.queryOperationTarget("active"));
		                        } else {
		                            lines = this._lines;
		                        }
		                        this._owner._addLine(lines);
		                    }
		                    return this;
		                };
		                GroupProfile.prototype.getLastLineIndex = function(withActiveChildren) {
		                    var _this = this;
		                    if (withActiveChildren === void 0) {
		                        withActiveChildren = false;
		                    }
		                    var lines = function() {
		                        var lines;
		                        if (withActiveChildren) {
		                            lines = _this.queryOperationTarget("active");
		                        }
		                        if (null == lines || lines.length <= 0) {
		                            lines = _this._lines;
		                        }
		                        return lines;
		                    }();
		                    if (lines.length <= 0) {
		                        console.error(TAG + "logic error: this group is stil not registered.");
		                        return null;
		                    } else {
		                        return lines[lines.length - 1].index;
		                    }
		                };
		                Object.defineProperty(GroupProfile.prototype, "id", {
		                    get: function() {
		                        return this._id;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(GroupProfile.prototype, "status", {
		                    get: function() {
		                        return this._status;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                GroupProfile.prototype.setParent = function(parent) {
		                    this._parent = parent;
		                };
		                GroupProfile.prototype.preprocess = function(newStatus) {
		                    var lines = [];
		                    if (newStatus !== this._status && null != this._lines) {
		                        lines = this._lines;
		                    }
		                    this._status = newStatus;
		                    return lines;
		                };
		                GroupProfile.prototype.queryOperationTarget = function(operation) {
		                    var findTargets = function(group) {
		                        var lines = [];
		                        group._children.forEach(function(group) {
		                            switch (operation) {
		                              case "registered":
		                                lines = lines.concat(group.preprocess(operation));
		                                break;

		                              case "unregistered":
		                                lines = lines.concat(group.preprocess(operation));
		                                break;

		                              case "active":
		                                if (null != group._lines) {
		                                    lines = lines.concat(group._lines);
		                                }
		                                break;

		                              default:
		                                console.warn(TAG + "unknown operation: " + operation);
		                                return;
		                            }
		                            if (group.isExpanded()) {
		                                lines = lines.concat(findTargets(group));
		                            }
		                        });
		                        return lines;
		                    };
		                    return findTargets(this);
		                };
		                Object.defineProperty(GroupProfile.prototype, "_lines", {
		                    get: function() {
		                        var key = this._owner.layoutKey;
		                        if (null != key) {
		                            return this._mapLines[key];
		                        } else {
		                            return this._mapLines[GroupProfile.LAYOUT_KEY_DEFAULT];
		                        }
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                return GroupProfile;
		            }();
		            GroupProfile.LAYOUT_KEY_DEFAULT = "-layout-default";
		            UI.GroupProfile = GroupProfile;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            UI.global = CDP.global || window;
		            function composeViews(base, derives) {
		                var _composed = base;
		                var _derives = derives instanceof Array ? derives : [ derives ];
		                _derives.forEach(function(derive) {
		                    var seed = {};
		                    _.extendOwn(seed, derive.prototype);
		                    delete seed.constructor;
		                    _composed = _composed.extend(seed);
		                });
		                return _composed;
		            }
		            UI.composeViews = composeViews;
		            function deriveViews(derived, bases) {
		                var _composed;
		                var _bases = bases instanceof Array ? bases : [ bases ];
		                if (2 <= _bases.length) {
		                    _composed = composeViews(_bases[0], _bases.slice(1));
		                } else {
		                    _composed = _bases[0];
		                }
		                derived = composeViews(_composed, derived);
		            }
		            UI.deriveViews = deriveViews;
		            function mixinViews(derived, bases) {
		                var _bases = bases instanceof Array ? bases : [ bases ];
		                _bases.forEach(function(base) {
		                    Object.getOwnPropertyNames(base.prototype).forEach(function(name) {
		                        derived.prototype[name] = base.prototype[name];
		                    });
		                });
		            }
		            UI.mixinViews = mixinViews;
		            var _ListViewUtils;
		            (function(_ListViewUtils) {
		                _ListViewUtils.cssPrefixes = [ "-webkit-", "-moz-", "-ms-", "-o-", "" ];
		                _ListViewUtils.getCssMatrixValue = function(element, type) {
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
		                _ListViewUtils.transitionEnd = "transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd";
		                _ListViewUtils.setTransformsTransitions = function(element, prop, msec, timingFunction) {
		                    var $element = $(element);
		                    var transitions = {};
		                    var second = msec / 1e3 + "s";
		                    var animation = " " + second + " " + timingFunction;
		                    var transform = ", transform" + animation;
		                    for (var i = 0; i < _ListViewUtils.cssPrefixes.length; i++) {
		                        transitions[_ListViewUtils.cssPrefixes[i] + "transition"] = prop + animation + transform;
		                    }
		                    $element.css(transitions);
		                };
		                _ListViewUtils.clearTransitions = function(element) {
		                    var $element = $(element);
		                    $element.off(_ListViewUtils.transitionEnd);
		                    var transitions = {};
		                    for (var i = 0; i < _ListViewUtils.cssPrefixes.length; i++) {
		                        transitions[_ListViewUtils.cssPrefixes[i] + "transition"] = "";
		                    }
		                    $element.css(transitions);
		                };
		                _ListViewUtils.abs = function(x) {
		                    return x >= 0 ? x : -x;
		                };
		                _ListViewUtils.max = function(lhs, rhs) {
		                    return lhs >= rhs ? lhs : rhs;
		                };
		            })(_ListViewUtils = UI._ListViewUtils || (UI._ListViewUtils = {}));
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var TAG = "[CDP.UI.StatusManager] ";
		            var StatusManager = function() {
		                function StatusManager() {
		                    this._status = {};
		                }
		                StatusManager.prototype.statusAddRef = function(status) {
		                    if (!this._status[status]) {
		                        this._status[status] = 1;
		                    } else {
		                        this._status[status]++;
		                    }
		                    return this._status[status];
		                };
		                StatusManager.prototype.statusRelease = function(status) {
		                    var retval;
		                    if (!this._status[status]) {
		                        retval = 0;
		                    } else {
		                        this._status[status]--;
		                        retval = this._status[status];
		                        if (0 === retval) {
		                            delete this._status[status];
		                        }
		                    }
		                    return retval;
		                };
		                StatusManager.prototype.statusScope = function(status, callback) {
		                    this.statusAddRef(status);
		                    callback();
		                    this.statusRelease(status);
		                };
		                StatusManager.prototype.isStatusIn = function(status) {
		                    return !!this._status[status];
		                };
		                return StatusManager;
		            }();
		            UI.StatusManager = StatusManager;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var TAG = "[CDP.UI.PageProfile] ";
		            var PageProfile = function() {
		                function PageProfile() {
		                    this._index = 0;
		                    this._offset = 0;
		                    this._height = 0;
		                    this._lines = [];
		                    this._status = "inactive";
		                }
		                PageProfile.prototype.activate = function() {
		                    if ("active" !== this._status) {
		                        this._lines.forEach(function(line) {
		                            line.activate();
		                        });
		                    }
		                    this._status = "active";
		                };
		                PageProfile.prototype.hide = function() {
		                    if ("hidden" !== this._status) {
		                        this._lines.forEach(function(line) {
		                            line.hide();
		                        });
		                    }
		                    this._status = "hidden";
		                };
		                PageProfile.prototype.inactivate = function() {
		                    if ("inactive" !== this._status) {
		                        this._lines.forEach(function(line) {
		                            line.inactivate();
		                        });
		                    }
		                    this._status = "inactive";
		                };
		                PageProfile.prototype.push = function(line) {
		                    this._lines.push(line);
		                    this._height += line.height;
		                };
		                PageProfile.prototype.normalize = function() {
		                    var enableAll = _.every(this._lines, function(line) {
		                        return line.isActive();
		                    });
		                    if (!enableAll) {
		                        this._status = "inactive";
		                    }
		                };
		                PageProfile.prototype.getLineProfile = function(index) {
		                    if (0 <= index && index < this._lines.length) {
		                        return this._lines[index];
		                    } else {
		                        return null;
		                    }
		                };
		                PageProfile.prototype.getLineProfileFirst = function() {
		                    return this.getLineProfile(0);
		                };
		                PageProfile.prototype.getLineProfileLast = function() {
		                    return this.getLineProfile(this._lines.length - 1);
		                };
		                Object.defineProperty(PageProfile.prototype, "index", {
		                    get: function() {
		                        return this._index;
		                    },
		                    set: function(index) {
		                        this._index = index;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(PageProfile.prototype, "offset", {
		                    get: function() {
		                        return this._offset;
		                    },
		                    set: function(offset) {
		                        this._offset = offset;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(PageProfile.prototype, "height", {
		                    get: function() {
		                        return this._height;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(PageProfile.prototype, "status", {
		                    get: function() {
		                        return this._status;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                return PageProfile;
		            }();
		            UI.PageProfile = PageProfile;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var _Utils = CDP.UI._ListViewUtils;
		            var TAG = "[CDP.UI.ScrollerElement] ";
		            var ScrollerElement = function() {
		                function ScrollerElement(element, options) {
		                    this._$target = null;
		                    this._$scrollMap = null;
		                    this._listviewOptions = null;
		                    this._$target = $(element);
		                    this._listviewOptions = options;
		                }
		                ScrollerElement.prototype.getType = function() {
		                    return ScrollerElement.TYPE;
		                };
		                ScrollerElement.prototype.getPos = function() {
		                    return this._$target.scrollTop();
		                };
		                ScrollerElement.prototype.getPosMax = function() {
		                    if (null == this._$scrollMap) {
		                        this._$scrollMap = this._$target.children().first();
		                    }
		                    return _Utils.max(this._$scrollMap.height() - this._$target.height(), 0);
		                };
		                ScrollerElement.prototype.on = function(type, func) {
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
		                ScrollerElement.prototype.off = function(type, func) {
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
		                ScrollerElement.prototype.scrollTo = function(pos, animate, time) {
		                    if (!this._listviewOptions.enableAnimation || !animate) {
		                        this._$target.scrollTop(pos);
		                    } else {
		                        if (null == time) {
		                            time = this._listviewOptions.animationDuration;
		                        }
		                        this._$target.animate({
		                            scrollTop: pos
		                        }, time);
		                    }
		                };
		                ScrollerElement.prototype.update = function() {};
		                ScrollerElement.prototype.destroy = function() {
		                    this._$scrollMap = null;
		                    if (this._$target) {
		                        this._$target.off();
		                        this._$target = null;
		                    }
		                };
		                Object.defineProperty(ScrollerElement, "TYPE", {
		                    get: function() {
		                        return "element-overflow";
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                ScrollerElement.getFactory = function() {
		                    var factory = function(element, options) {
		                        return new ScrollerElement(element, options);
		                    };
		                    factory.type = ScrollerElement.TYPE;
		                    return factory;
		                };
		                return ScrollerElement;
		            }();
		            UI.ScrollerElement = ScrollerElement;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var _Utils = CDP.UI._ListViewUtils;
		            var TAG = "[CDP.UI.ScrollerNative] ";
		            var ScrollerNative = function() {
		                function ScrollerNative(options) {
		                    this._$body = null;
		                    this._$target = null;
		                    this._$scrollMap = null;
		                    this._listviewOptions = null;
		                    this._$target = $(document);
		                    this._$body = $("body");
		                    this._listviewOptions = options;
		                }
		                ScrollerNative.prototype.getType = function() {
		                    return ScrollerNative.TYPE;
		                };
		                ScrollerNative.prototype.getPos = function() {
		                    return this._$target.scrollTop();
		                };
		                ScrollerNative.prototype.getPosMax = function() {
		                    return _Utils.max(this._$target.height() - window.innerHeight, 0);
		                };
		                ScrollerNative.prototype.on = function(type, func) {
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
		                ScrollerNative.prototype.off = function(type, func) {
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
		                ScrollerNative.prototype.scrollTo = function(pos, animate, time) {
		                    if (!this._listviewOptions.enableAnimation || !animate) {
		                        this._$body.scrollTop(pos);
		                    } else {
		                        if (null == time) {
		                            time = this._listviewOptions.animationDuration;
		                        }
		                        this._$body.animate({
		                            scrollTop: pos
		                        }, time);
		                    }
		                };
		                ScrollerNative.prototype.update = function() {};
		                ScrollerNative.prototype.destroy = function() {
		                    this._$scrollMap = null;
		                    this._$target = null;
		                };
		                Object.defineProperty(ScrollerNative, "TYPE", {
		                    get: function() {
		                        return "native-scroll";
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                ScrollerNative.getFactory = function() {
		                    var factory = function(element, options) {
		                        return new ScrollerNative(options);
		                    };
		                    factory.type = ScrollerNative.TYPE;
		                    return factory;
		                };
		                return ScrollerNative;
		            }();
		            UI.ScrollerNative = ScrollerNative;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var _Config = CDP.UI.ListViewGlobalConfig;
		            var _Utils = CDP.UI._ListViewUtils;
		            var TAG = "[CDP.UI.ScrollerIScroll] ";
		            var ScrollerIScroll = function() {
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
		                    } else {
		                        console.error(TAG + "iscroll module doesn't load.");
		                    }
		                }
		                ScrollerIScroll.prototype.getType = function() {
		                    return ScrollerIScroll.TYPE;
		                };
		                ScrollerIScroll.prototype.getPos = function() {
		                    var pos = this._iscroll.getComputedPosition().y;
		                    if (_.isNaN(pos)) {
		                        pos = 0;
		                    } else {
		                        pos = -pos;
		                    }
		                    return pos;
		                };
		                ScrollerIScroll.prototype.getPosMax = function() {
		                    return _Utils.max(-this._iscroll.maxScrollY, 0);
		                };
		                ScrollerIScroll.prototype.on = function(type, func) {
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
		                ScrollerIScroll.prototype.off = function(type, func) {
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
		                ScrollerIScroll.prototype.scrollTo = function(pos, animate, time) {
		                    time = 0;
		                    if (this._listviewOptions.enableAnimation && animate) {
		                        time = time || this._listviewOptions.animationDuration;
		                    }
		                    this._iscroll.scrollTo(0, -pos, time);
		                };
		                ScrollerIScroll.prototype.update = function() {
		                    var _this = this;
		                    if (this._$owner) {
		                        (function() {
		                            var ownerHeight = _this._$owner.height();
		                            if (ownerHeight !== _this._$wrapper.height()) {
		                                _this._$wrapper.height(ownerHeight);
		                            }
		                        })();
		                        if (null != this._refreshTimerId) {
		                            clearTimeout(this._refreshTimerId);
		                        }
		                        var proc_1 = function() {
		                            if (_this._$scroller && _this._$scroller.height() !== _this._iscroll.scrollerHeight) {
		                                _this._iscroll.refresh();
		                                _this._refreshTimerId = setTimeout(proc_1, _this._listviewOptions.scrollMapRefreshInterval);
		                            } else {
		                                _this._refreshTimerId = null;
		                            }
		                        };
		                        this._iscroll.refresh();
		                        this._refreshTimerId = setTimeout(proc_1, this._listviewOptions.scrollMapRefreshInterval);
		                    }
		                };
		                ScrollerIScroll.prototype.destroy = function() {
		                    this._$scroller = null;
		                    this._$wrapper = null;
		                    this._iscroll.destroy();
		                    this._$owner = null;
		                };
		                Object.defineProperty(ScrollerIScroll, "TYPE", {
		                    get: function() {
		                        return "iscroll";
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                ScrollerIScroll.getFactory = function(options) {
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
		                        probeType: 2
		                    };
		                    var iscrollOptions = $.extend({}, defaultOpt, options);
		                    var factory = function(element, listviewOptions) {
		                        var $owner = $(element);
		                        var $map = $owner.find(_Config.SCROLL_MAP_SELECTOR);
		                        var $wrapper = $("<div class='" + _Config.WRAPPER_CLASS + "'></div>").css({
		                            position: "absolute",
		                            width: "100%",
		                            height: "100%",
		                            overflow: "hidden"
		                        });
		                        $map.wrap($wrapper);
		                        return new ScrollerIScroll($owner, _Config.WRAPPER_SELECTOR, iscrollOptions, listviewOptions);
		                    };
		                    factory.type = ScrollerIScroll.TYPE;
		                    return factory;
		                };
		                return ScrollerIScroll;
		            }();
		            UI.ScrollerIScroll = ScrollerIScroll;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var TAG = "[CDP.UI.ListItemView] ";
		            var ListItemView = function(_super) {
		                __extends(ListItemView, _super);
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
		                ListItemView.prototype.render = function() {
		                    console.warn(TAG + "need override 'render()' method.");
		                    return this;
		                };
		                ListItemView.prototype.getIndex = function() {
		                    return this._lineProfile.index;
		                };
		                ListItemView.prototype.getSpecifiedHeight = function() {
		                    return this._lineProfile.height;
		                };
		                ListItemView.prototype.hasChildNode = function() {
		                    if (!this.$el) {
		                        return false;
		                    } else {
		                        return 0 < this.$el.children().length;
		                    }
		                };
		                ListItemView.prototype.updateHeight = function(newHeight, options) {
		                    if (this.$el) {
		                        if (this.getSpecifiedHeight() !== newHeight) {
		                            this._lineProfile.updateHeight(newHeight, options);
		                            this.$el.height(newHeight);
		                        }
		                    }
		                    return this;
		                };
		                ListItemView.compose = function(derives, properties, classProperties) {
		                    var composed = UI.composeViews(ListItemView, derives);
		                    return composed.extend(properties, classProperties);
		                };
		                ListItemView.prototype.remove = function() {
		                    this.$el.find("figure").css("background-image", "none");
		                    this.$el.children().remove();
		                    this.$el.off();
		                    this.$el = null;
		                    this.stopListening();
		                    this._lineProfile = null;
		                    return this;
		                };
		                Object.defineProperty(ListItemView.prototype, "owner", {
		                    get: function() {
		                        return this._owner;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                return ListItemView;
		            }(Backbone.View);
		            UI.ListItemView = ListItemView;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var _Config = CDP.UI.ListViewGlobalConfig;
		            var _Utils = CDP.UI._ListViewUtils;
		            var TAG = "[CDP.UI.ScrollManager] ";
		            var ScrollManager = function() {
		                function ScrollManager(options) {
		                    var _this = this;
		                    this._$root = null;
		                    this._$map = null;
		                    this._mapHeight = 0;
		                    this._scroller = null;
		                    this._settings = null;
		                    this._active = true;
		                    this._scrollEventHandler = null;
		                    this._scrollStopEventHandler = null;
		                    this._baseHeight = 0;
		                    this._lines = [];
		                    this._pages = [];
		                    this._lastActivePageContext = {
		                        index: 0,
		                        from: 0,
		                        to: 0,
		                        pos: 0
		                    };
		                    this._backup = {};
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
		                        itemTagName: "div",
		                        removeItemWithTransition: true,
		                        useDummyInactiveScrollMap: false
		                    };
		                    this._settings = $.extend({}, defOptions, options);
		                    this._scrollEventHandler = function(event) {
		                        _this.onScroll(_this._scroller.getPos());
		                    };
		                    this._scrollStopEventHandler = function(event) {
		                        _this.onScrollStop(_this._scroller.getPos());
		                    };
		                }
		                ScrollManager.prototype.initialize = function($root, height) {
		                    if (this._$root) {
		                        this.destroy();
		                    }
		                    this._$root = $root;
		                    this._$map = $root.hasClass(_Config.SCROLL_MAP_CLASS) ? $root : $root.find(_Config.SCROLL_MAP_SELECTOR);
		                    if (this._$map.length <= 0) {
		                        this._$root = null;
		                        return false;
		                    }
		                    this._scroller = this.createScroller();
		                    this.setBaseHeight(height);
		                    this.setScrollerCondition();
		                    return true;
		                };
		                ScrollManager.prototype.destroy = function() {
		                    if (this._scroller) {
		                        this.resetScrollerCondition();
		                        this._scroller.destroy();
		                        this._scroller = null;
		                    }
		                    this.release();
		                    this._$map = null;
		                    this._$root = null;
		                };
		                ScrollManager.prototype.setBaseHeight = function(height) {
		                    this._baseHeight = height;
		                    if (this._baseHeight <= 0) {
		                        console.warn(TAG + "invalid base height: " + this._baseHeight);
		                    }
		                    if (this._scroller) {
		                        this._scroller.update();
		                    }
		                };
		                ScrollManager.prototype.setActiveState = function(active) {
		                    this._active = active;
		                    this.treatScrollPosition();
		                };
		                ScrollManager.prototype.isActive = function() {
		                    return this._active;
		                };
		                ScrollManager.prototype.getScrollerType = function() {
		                    return this._settings.scrollerFactory.type;
		                };
		                ScrollManager.prototype.treatScrollPosition = function() {
		                    var _this = this;
		                    var i;
		                    var transform = {};
		                    var updateOffset = function($target, offset) {
		                        offset = offset || _this._scroller.getPos() - _this._lastActivePageContext.pos;
		                        if (_Utils.getCssMatrixValue($target, "translateY") !== offset) {
		                            for (i = 0; i < _Utils.cssPrefixes.length; i++) {
		                                transform[_Utils.cssPrefixes[i] + "transform"] = "translate3d(0px," + offset + "px,0px)";
		                            }
		                            $target.css(transform);
		                            return $target;
		                        }
		                    };
		                    var clearOffset = function($target) {
		                        for (i = 0; i < _Utils.cssPrefixes.length; i++) {
		                            transform[_Utils.cssPrefixes[i] + "transform"] = "";
		                        }
		                        $target.css(transform);
		                        return $target;
		                    };
		                    if (this._active) {
		                        (function() {
		                            if (_this._scroller) {
		                                _this._scroller.scrollTo(_this._lastActivePageContext.pos, false, 0);
		                            }
		                            clearOffset(_this._$map).css("display", "block");
		                        })();
		                        if (this._settings.useDummyInactiveScrollMap) {
		                            this.prepareInactiveMap().remove();
		                        }
		                    } else {
		                        if (this._settings.useDummyInactiveScrollMap) {
		                            updateOffset(this.prepareInactiveMap());
		                        } else {
		                            updateOffset(this._$map);
		                        }
		                    }
		                };
		                ScrollManager.prototype.prepareInactiveMap = function() {
		                    var $parent = this._$map.parent();
		                    var $inactiveMap = $parent.find(_Config.INACTIVE_CLASS_SELECTOR);
		                    if ($inactiveMap.length <= 0) {
		                        var currentPageIndex_1 = this.getPageIndex();
		                        var $listItemViews = this._$map.clone().children().filter(function(index, element) {
		                            var pageIndex = ~~$(element).attr(_Config.DATA_PAGE_INDEX);
		                            if (currentPageIndex_1 - 1 <= pageIndex || pageIndex <= currentPageIndex_1 + 1) {
		                                return true;
		                            } else {
		                                return false;
		                            }
		                        });
		                        $inactiveMap = $("<section class='" + _Config.SCROLL_MAP_CLASS + " " + _Config.INACTIVE_CLASS + "'></section>").append($listItemViews).height(this._mapHeight);
		                        $parent.append($inactiveMap);
		                        this._$map.css("display", "none");
		                    }
		                    return $inactiveMap;
		                };
		                ScrollManager.prototype.isInitialized = function() {
		                    return !!this._$root;
		                };
		                ScrollManager.prototype.addItem = function(height, initializer, info, insertTo) {
		                    this._addLine(new UI.LineProfile(this, Math.floor(height), initializer, info), insertTo);
		                };
		                ScrollManager.prototype._addLine = function(_line, insertTo) {
		                    var i, n;
		                    var deltaHeight = 0;
		                    var lines = _line instanceof Array ? _line : [ _line ];
		                    var addTail = false;
		                    if (null == insertTo) {
		                        insertTo = this._lines.length;
		                    }
		                    if (insertTo === this._lines.length) {
		                        addTail = true;
		                    }
		                    for (i = 0, n = lines.length; i < n; i++) {
		                        deltaHeight += lines[i].height;
		                    }
		                    this.updateScrollMapHeight(deltaHeight);
		                    for (i = lines.length - 1; i >= 0; i--) {
		                        this._lines.splice(insertTo, 0, lines[i]);
		                    }
		                    if (!addTail) {
		                        if (0 === insertTo) {
		                            this.clearPage();
		                        } else if (null != this._lines[insertTo - 1].pageIndex) {
		                            this.clearPage(this._lines[insertTo - 1].pageIndex);
		                        }
		                    }
		                    this.updateProfiles(insertTo);
		                };
		                ScrollManager.prototype.removeItem = function(index, arg2, arg3) {
		                    if (index instanceof Array) {
		                        this._removeLines(index, arg2);
		                    } else {
		                        this._removeLine(index, arg2, arg3);
		                    }
		                };
		                ScrollManager.prototype._removeLine = function(index, size, delay) {
		                    var _this = this;
		                    if (null == size) {
		                        size = 1;
		                    }
		                    if (index < 0 || this._lines.length < index + size) {
		                        console.error(TAG + "logic error. removeItem(), invalid index: " + index);
		                        return;
		                    }
		                    delay = null != delay ? delay : 0;
		                    var delta = 0;
		                    var removed = [];
		                    var mapTransition = false;
		                    (function() {
		                        var line;
		                        for (var i = 0; i < size; i++) {
		                            line = _this._lines[index + i];
		                            delta += line.height;
		                            line.resetDepth();
		                            removed.push(line);
		                        }
		                        if (_this._settings.removeItemWithTransition && 0 < delay) {
		                            var current = _this.getScrollPos();
		                            var posMax = _this.getScrollPosMax() - delta;
		                            mapTransition = posMax < current;
		                        }
		                    })();
		                    (function() {
		                        if (mapTransition) {
		                            _this.setupScrollMapTransition(_this._$map, delay);
		                        }
		                        if (null != _this._lines[index].pageIndex) {
		                            _this.clearPage(_this._lines[index].pageIndex);
		                        }
		                        _this.updateScrollMapHeight(-delta);
		                        _this._lines.splice(index, size);
		                        _this.updateProfiles(index);
		                        setTimeout(function() {
		                            removed.forEach(function(line) {
		                                line.inactivate();
		                            });
		                        }, delay);
		                    })();
		                };
		                ScrollManager.prototype._removeLines = function(indexes, delay) {
		                    var _this = this;
		                    delay = null != delay ? delay : 0;
		                    for (var i = 0, n = indexes.length; i < n; i++) {
		                        if (i < 0 || this._lines.length < i) {
		                            console.error(TAG + "logic error. removeItem(), invalid index: " + i);
		                            return;
		                        }
		                    }
		                    var delta = 0;
		                    var removed = [];
		                    var mapTransition = false;
		                    (function() {
		                        var line;
		                        indexes.forEach(function(index) {
		                            line = _this._lines[index];
		                            delta += line.height;
		                            line.resetDepth();
		                            removed.push(line);
		                        });
		                        if (_this._settings.removeItemWithTransition && 0 < delay) {
		                            var current = _this.getScrollPos();
		                            var posMax = _this.getScrollPosMax() - delta;
		                            mapTransition = posMax < current;
		                        }
		                    })();
		                    (function() {
		                        if (mapTransition) {
		                            _this.setupScrollMapTransition(_this._$map, delay);
		                        }
		                        indexes.forEach(function(index) {
		                            if (null != _this._lines[index].pageIndex) {
		                                _this.clearPage(_this._lines[index].pageIndex);
		                            }
		                            _this._lines.splice(index, 1);
		                            _this.updateProfiles(index);
		                        });
		                        _this.updateScrollMapHeight(-delta);
		                        setTimeout(function() {
		                            removed.forEach(function(line) {
		                                line.inactivate();
		                            });
		                        }, delay);
		                    })();
		                };
		                ScrollManager.prototype.setupScrollMapTransition = function($map, delay) {
		                    var transitionEndHandler = function(event) {
		                        $map.off(_Utils.transitionEnd);
		                        _Utils.clearTransitions($map);
		                    };
		                    this._$map.on(_Utils.transitionEnd, transitionEndHandler);
		                    _Utils.setTransformsTransitions($map, "height", delay, "ease");
		                };
		                ScrollManager.prototype.getItemInfo = function(target) {
		                    var index;
		                    var parser = function($target) {
		                        if ($target.hasClass(_Config.LISTITEM_BASE_CLASS)) {
		                            return ~~$target.attr(_Config.DATA_CONTAINER_INDEX);
		                        } else if ($target.hasClass(_Config.SCROLL_MAP_CLASS) || $target.length <= 0) {
		                            console.warn(TAG + "cannot ditect line from event object.");
		                            return null;
		                        } else {
		                            return parser($target.parent());
		                        }
		                    };
		                    if (target instanceof $.Event) {
		                        index = parser($(target.currentTarget));
		                    } else if (typeof target === "number") {
		                        index = target;
		                    }
		                    if (null == index) {
		                        console.error(TAG + "logic error. unsupported arg type. type: " + typeof target);
		                        return null;
		                    } else if (index < 0 || this._lines.length <= index) {
		                        console.error(TAG + "logic error. invalid range. index: " + index);
		                        return null;
		                    }
		                    return this._lines[index].info;
		                };
		                ScrollManager.prototype.refresh = function() {
		                    var _this = this;
		                    var targets = {};
		                    var searchCount = this._settings.pagePrepareCount + this._settings.pagePreloadCount;
		                    var currentPageIndex = this.getPageIndex();
		                    var highPriorityIndex = [];
		                    var oldExsistPage = _.filter(this._pages, function(page) {
		                        return "inactive" !== page.status;
		                    });
		                    var changeState = function(index) {
		                        if (index === currentPageIndex) {
		                            targets[index] = "activate";
		                            highPriorityIndex.push(index);
		                        } else if (_Utils.abs(currentPageIndex - index) <= _this._settings.pagePrepareCount) {
		                            targets[index] = "activate";
		                        } else {
		                            if (_this._settings.enableHiddenPage) {
		                                targets[index] = "hide";
		                            } else {
		                                targets[index] = "activate";
		                            }
		                        }
		                        if (currentPageIndex + 1 === index || currentPageIndex - 1 === index) {
		                            highPriorityIndex.push(index);
		                        }
		                    };
		                    if (this._lines.length <= 0) {
		                        return;
		                    }
		                    (function() {
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
		                            for (i = 0, pageIndex = currentPageIndex + searchCount + 1; i < overflowPrev; i++, 
		                            pageIndex++) {
		                                if (_this._pages.length <= pageIndex) {
		                                    break;
		                                }
		                                changeState(pageIndex);
		                            }
		                        }
		                        if (0 < overflowNext) {
		                            for (i = 0, pageIndex = currentPageIndex - searchCount - 1; i < overflowNext; i++, 
		                            pageIndex--) {
		                                if (pageIndex < 0) {
		                                    break;
		                                }
		                                changeState(pageIndex);
		                            }
		                        }
		                    })();
		                    oldExsistPage.forEach(function(page) {
		                        var index = page.index;
		                        if (null == targets[index]) {
		                            page.inactivate();
		                        }
		                    });
		                    highPriorityIndex.sort(function(lhs, rhs) {
		                        if (lhs < rhs) {
		                            return -1;
		                        } else if (lhs > rhs) {
		                            return 1;
		                        } else {
		                            return 0;
		                        }
		                    }).forEach(function(index) {
		                        setTimeout(function() {
		                            if (_this.isInitialized()) {
		                                _this._pages[index] && _this._pages[index].activate();
		                            }
		                        }, 0);
		                    });
		                    _.each(targets, function(action, key) {
		                        setTimeout(function() {
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
		                    this.findRecycleElements().remove();
		                    this._lastActivePageContext.from = this._pages[currentPageIndex].getLineProfileFirst().index;
		                    this._lastActivePageContext.to = this._pages[currentPageIndex].getLineProfileLast().index;
		                    this._lastActivePageContext.index = currentPageIndex;
		                };
		                ScrollManager.prototype.update = function() {
		                    var index = this._pages.length;
		                    this.assignPage(index);
		                    this.refresh();
		                };
		                ScrollManager.prototype.rebuild = function() {
		                    this.clearPage();
		                    this.assignPage();
		                    this.refresh();
		                };
		                ScrollManager.prototype.release = function() {
		                    this._lines.forEach(function(line) {
		                        line.inactivate();
		                    });
		                    this._pages = [];
		                    this._lines = [];
		                    if (this._$map) {
		                        this._mapHeight = 0;
		                        this._$map.height(0);
		                    }
		                };
		                ScrollManager.prototype.backup = function(key) {
		                    if (null == this._backup[key]) {
		                        this._backup[key] = {
		                            lines: this._lines
		                        };
		                    }
		                    return true;
		                };
		                ScrollManager.prototype.restore = function(key, rebuild) {
		                    if (rebuild === void 0) {
		                        rebuild = true;
		                    }
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
		                ScrollManager.prototype.hasBackup = function(key) {
		                    if (null != this._backup[key]) {
		                        return true;
		                    } else {
		                        return false;
		                    }
		                };
		                ScrollManager.prototype.clearBackup = function(key) {
		                    if (null == key) {
		                        this._backup = {};
		                        return true;
		                    } else if (null != this._backup[key]) {
		                        delete this._backup[key];
		                        return true;
		                    } else {
		                        return false;
		                    }
		                };
		                Object.defineProperty(ScrollManager.prototype, "backupData", {
		                    get: function() {
		                        return this._backup;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                ScrollManager.prototype.setScrollHandler = function(handler, on) {
		                    if (this._scroller) {
		                        if (on) {
		                            this._scroller.on("scroll", handler);
		                        } else {
		                            this._scroller.off("scroll", handler);
		                        }
		                    }
		                };
		                ScrollManager.prototype.setScrollStopHandler = function(handler, on) {
		                    if (this._scroller) {
		                        if (on) {
		                            this._scroller.on("scrollstop", handler);
		                        } else {
		                            this._scroller.off("scrollstop", handler);
		                        }
		                    }
		                };
		                ScrollManager.prototype.getScrollPos = function() {
		                    return this._scroller ? this._scroller.getPos() : 0;
		                };
		                ScrollManager.prototype.getScrollPosMax = function() {
		                    return this._scroller ? this._scroller.getPosMax() : 0;
		                };
		                ScrollManager.prototype.scrollTo = function(pos, animate, time) {
		                    if (this._scroller) {
		                        if (pos < 0) {
		                            console.warn(TAG + "invalid position, too small. [pos: " + pos + "]");
		                            pos = 0;
		                        } else if (this._scroller.getPosMax() < pos) {
		                            console.warn(TAG + "invalid position, too big. [pos: " + pos + "]");
		                            pos = this._scroller.getPosMax();
		                        }
		                        this._lastActivePageContext.pos = pos;
		                        if (pos !== this._scroller.getPos()) {
		                            this._scroller.scrollTo(pos, animate, time);
		                        }
		                    }
		                };
		                ScrollManager.prototype.ensureVisible = function(index, options) {
		                    var _this = this;
		                    if (index < 0 || this._lines.length <= index) {
		                        console.warn(TAG + "ensureVisible(), invalid index, noop. [index: " + index + "]");
		                        return;
		                    } else if (!this._scroller) {
		                        console.warn(TAG + "scroller is not ready.");
		                        return;
		                    }
		                    (function() {
		                        var target = _this._lines[index];
		                        var defaultOptions = {
		                            partialOK: true,
		                            setTop: false,
		                            animate: _this._settings.enableAnimation,
		                            time: _this._settings.animationDuration,
		                            callback: function() {}
		                        };
		                        var operation = $.extend({}, defaultOptions, options);
		                        var currentScope = {
		                            from: _this._scroller.getPos(),
		                            to: _this._scroller.getPos() + _this._baseHeight
		                        };
		                        var targetScope = {
		                            from: target.offset,
		                            to: target.offset + target.height
		                        };
		                        var isInScope = function() {
		                            if (operation.partialOK) {
		                                if (targetScope.from <= currentScope.from) {
		                                    if (currentScope.from <= targetScope.to) {
		                                        return true;
		                                    } else {
		                                        return false;
		                                    }
		                                } else {
		                                    if (targetScope.from <= currentScope.to) {
		                                        return true;
		                                    } else {
		                                        return false;
		                                    }
		                                }
		                            } else {
		                                if (currentScope.from <= targetScope.from && targetScope.to <= currentScope.to) {
		                                    return true;
		                                } else {
		                                    return false;
		                                }
		                            }
		                        };
		                        var detectPosition = function() {
		                            if (targetScope.from < currentScope.from) {
		                                return targetScope.from;
		                            } else if (currentScope.from < targetScope.from) {
		                                return target.offset - target.height;
		                            } else {
		                                console.warn(TAG + "logic error.");
		                                return 0;
		                            }
		                        };
		                        var pos;
		                        if (operation.setTop) {
		                            pos = targetScope.from;
		                        } else if (isInScope()) {
		                            operation.callback();
		                            return;
		                        } else {
		                            pos = detectPosition();
		                        }
		                        if (pos < 0) {
		                            pos = 0;
		                        } else if (_this._scroller.getPosMax() < pos) {
		                            pos = _this._scroller.getPosMax();
		                        }
		                        setTimeout(operation.callback, operation.time);
		                        _this.scrollTo(pos, operation.animate, operation.time);
		                    })();
		                };
		                ScrollManager.prototype.getScrollMapHeight = function() {
		                    return this._$map ? this._mapHeight : 0;
		                };
		                ScrollManager.prototype.updateScrollMapHeight = function(delta) {
		                    if (this._$map) {
		                        this._mapHeight += delta;
		                        if (this._mapHeight < 0) {
		                            this._mapHeight = 0;
		                        }
		                        this._$map.height(this._mapHeight);
		                    }
		                };
		                ScrollManager.prototype.updateProfiles = function(from) {
		                    var i, n;
		                    var last;
		                    for (i = from, n = this._lines.length; i < n; i++) {
		                        if (0 < i) {
		                            last = this._lines[i - 1];
		                            this._lines[i].index = last.index + 1;
		                            this._lines[i].offset = last.offset + last.height;
		                        } else {
		                            this._lines[i].index = 0;
		                            this._lines[i].offset = 0;
		                        }
		                    }
		                };
		                ScrollManager.prototype.getScrollMapElement = function() {
		                    return this._$map || $("");
		                };
		                ScrollManager.prototype.findRecycleElements = function() {
		                    return this._$map ? this._$map.find(_Config.RECYCLE_CLASS_SELECTOR) : $("");
		                };
		                ScrollManager.prototype.getListViewOptions = function() {
		                    return this._settings;
		                };
		                ScrollManager.prototype.setScrollerCondition = function() {
		                    this._scroller.on("scroll", this._scrollEventHandler);
		                    this._scroller.on("scrollstop", this._scrollStopEventHandler);
		                };
		                ScrollManager.prototype.resetScrollerCondition = function() {
		                    this._scroller.off("scrollstop", this._scrollStopEventHandler);
		                    this._scroller.off("scroll", this._scrollEventHandler);
		                };
		                ScrollManager.prototype.createScroller = function() {
		                    return this._settings.scrollerFactory(this._$root[0], this._settings);
		                };
		                ScrollManager.prototype.getPageIndex = function() {
		                    var _this = this;
		                    var i, n;
		                    var page;
		                    var candidate;
		                    var scrollPos = this._scroller ? this._scroller.getPos() : 0;
		                    var scrollPosMax = this._scroller ? this._scroller.getPosMax() : 0;
		                    var scrollMapSize = function() {
		                        var lastPage = _this.getLastPage();
		                        if (null != lastPage) {
		                            return lastPage.offset + lastPage.height;
		                        } else {
		                            return _this._baseHeight;
		                        }
		                    }();
		                    var pos = function() {
		                        if (0 === scrollPosMax || scrollPosMax <= _this._baseHeight) {
		                            return 0;
		                        } else {
		                            return scrollPos * scrollMapSize / scrollPosMax;
		                        }
		                    }();
		                    var validRange = function(page) {
		                        if (null == page) {
		                            return false;
		                        } else if (page.offset <= pos && pos <= page.offset + page.height) {
		                            return true;
		                        } else {
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
		                    } else if (pos < page.offset) {
		                        for (i = candidate - 1; i >= 0; i--) {
		                            page = this._pages[i];
		                            if (validRange(page)) {
		                                return page.index;
		                            }
		                        }
		                        console.warn(TAG + "unknown page index.");
		                        return 0;
		                    } else {
		                        for (i = candidate + 1, n = this._pages.length; i < n; i++) {
		                            page = this._pages[i];
		                            if (validRange(page)) {
		                                return page.index;
		                            }
		                        }
		                        console.warn(TAG + "unknown page index.");
		                        return this.getLastPage().index;
		                    }
		                };
		                ScrollManager.prototype.onScroll = function(pos) {
		                    if (this._active && 0 < this._pages.length) {
		                        var currentPageIndex = this.getPageIndex();
		                        if (_Utils.abs(pos - this._lastActivePageContext.pos) < this._settings.scrollRefreshDistance) {
		                            if (this._lastActivePageContext.index !== currentPageIndex) {
		                                this.refresh();
		                            }
		                        }
		                        this._lastActivePageContext.pos = pos;
		                    }
		                };
		                ScrollManager.prototype.onScrollStop = function(pos) {
		                    if (this._active && 0 < this._pages.length) {
		                        var currentPageIndex = this.getPageIndex();
		                        if (this._lastActivePageContext.index !== currentPageIndex) {
		                            this.refresh();
		                        }
		                        this._lastActivePageContext.pos = pos;
		                    }
		                };
		                ScrollManager.prototype.getLastPage = function() {
		                    if (0 < this._pages.length) {
		                        return this._pages[this._pages.length - 1];
		                    } else {
		                        return null;
		                    }
		                };
		                ScrollManager.prototype.assignPage = function(from) {
		                    var _this = this;
		                    var i, n;
		                    if (null == from) {
		                        from = 0;
		                    } else {
		                        this.clearPage(from);
		                    }
		                    (function() {
		                        var lineIndex = 0;
		                        var lastPage = _this.getLastPage();
		                        var lastLine;
		                        var tempPage;
		                        if (null == lastPage) {
		                            lastPage = new UI.PageProfile();
		                            _this._pages.push(lastPage);
		                        } else {
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
		                ScrollManager.prototype.clearPage = function(from) {
		                    if (null == from) {
		                        from = 0;
		                    }
		                    this._pages = this._pages.slice(0, from);
		                };
		                return ScrollManager;
		            }();
		            UI.ScrollManager = ScrollManager;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var TAG = "[CDP.UI.ListView] ";
		            var ListView = function(_super) {
		                __extends(ListView, _super);
		                function ListView(options) {
		                    var _this = _super.call(this, options) || this;
		                    _this._scrollMgr = null;
		                    var opt = options || {};
		                    _this._scrollMgr = new UI.ScrollManager(options);
		                    if (opt.$el) {
		                        var delegates = _this.events ? true : false;
		                        _this.setElement(opt.$el, delegates);
		                    } else {
		                        var height = opt.initialHeight || _this.$el.height();
		                        _this._scrollMgr.initialize(_this.$el, height);
		                    }
		                    return _this;
		                }
		                ListView.prototype.setElement = function(element, delegate) {
		                    if (this._scrollMgr) {
		                        var $el = $(element);
		                        this._scrollMgr.destroy();
		                        this._scrollMgr.initialize($el, $el.height());
		                    }
		                    return _super.prototype.setElement.call(this, element, delegate);
		                };
		                ListView.prototype.remove = function() {
		                    this._scrollMgr.destroy();
		                    return _super.prototype.remove.call(this);
		                };
		                ListView.prototype.isInitialized = function() {
		                    return this._scrollMgr.isInitialized();
		                };
		                ListView.prototype.addItem = function(height, initializer, info, insertTo) {
		                    this._addLine(new UI.LineProfile(this._scrollMgr, Math.floor(height), initializer, info), insertTo);
		                };
		                ListView.prototype.removeItem = function(index, arg2, arg3) {
		                    this._scrollMgr.removeItem(index, arg2, arg3);
		                };
		                ListView.prototype.getItemInfo = function(target) {
		                    return this._scrollMgr.getItemInfo(target);
		                };
		                ListView.prototype.refresh = function() {
		                    this._scrollMgr.refresh();
		                };
		                ListView.prototype.update = function() {
		                    this._scrollMgr.update();
		                };
		                ListView.prototype.rebuild = function() {
		                    this._scrollMgr.rebuild();
		                };
		                ListView.prototype.release = function() {
		                    this._scrollMgr.release();
		                };
		                ListView.prototype.backup = function(key) {
		                    return this._scrollMgr.backup(key);
		                };
		                ListView.prototype.restore = function(key, rebuild) {
		                    if (rebuild === void 0) {
		                        rebuild = true;
		                    }
		                    return this._scrollMgr.restore(key, rebuild);
		                };
		                ListView.prototype.hasBackup = function(key) {
		                    return this._scrollMgr.hasBackup(key);
		                };
		                ListView.prototype.clearBackup = function(key) {
		                    return this._scrollMgr.clearBackup(key);
		                };
		                Object.defineProperty(ListView.prototype, "backupData", {
		                    get: function() {
		                        return this._scrollMgr ? this._scrollMgr.backupData : null;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                ListView.prototype.setScrollHandler = function(handler, on) {
		                    this._scrollMgr.setScrollHandler(handler, on);
		                };
		                ListView.prototype.setScrollStopHandler = function(handler, on) {
		                    this._scrollMgr.setScrollStopHandler(handler, on);
		                };
		                ListView.prototype.getScrollPos = function() {
		                    return this._scrollMgr.getScrollPos();
		                };
		                ListView.prototype.getScrollPosMax = function() {
		                    return this._scrollMgr.getScrollPosMax();
		                };
		                ListView.prototype.scrollTo = function(pos, animate, time) {
		                    this._scrollMgr.scrollTo(pos, animate, time);
		                };
		                ListView.prototype.ensureVisible = function(index, options) {
		                    this._scrollMgr.ensureVisible(index, options);
		                };
		                Object.defineProperty(ListView.prototype, "core", {
		                    get: function() {
		                        return this._scrollMgr;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                ListView.prototype._addLine = function(_line, insertTo) {
		                    this._scrollMgr._addLine(_line, insertTo);
		                };
		                ListView.compose = function(derives, properties, classProperties) {
		                    var composed = UI.composeViews(ListView, derives);
		                    return composed.extend(properties, classProperties);
		                };
		                return ListView;
		            }(Backbone.View);
		            UI.ListView = ListView;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var TAG = "[CDP.UI.GroupListItemView] ";
		            var GroupListItemView = function(_super) {
		                __extends(GroupListItemView, _super);
		                function GroupListItemView(options) {
		                    var _this = _super.call(this, options) || this;
		                    _this._groupProfile = null;
		                    _this._groupProfile = options.groupProfile;
		                    return _this;
		                }
		                GroupListItemView.prototype.isExpanded = function() {
		                    return this._groupProfile.isExpanded();
		                };
		                GroupListItemView.prototype.isExpanding = function() {
		                    return this.owner.isExpanding();
		                };
		                GroupListItemView.prototype.isCollapsing = function() {
		                    return this.owner.isCollapsing();
		                };
		                GroupListItemView.prototype.isSwitching = function() {
		                    return this.owner.isSwitching();
		                };
		                GroupListItemView.prototype.hasChildren = function(layoutKey) {
		                    return this._groupProfile.hasChildren(layoutKey);
		                };
		                return GroupListItemView;
		            }(UI.ListItemView);
		            UI.GroupListItemView = GroupListItemView;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var TAG = "[CDP.UI.ExpandManager] ";
		            var ExpandManager = function() {
		                function ExpandManager(owner) {
		                    this._owner = null;
		                    this._mapGroups = {};
		                    this._aryTopGroups = [];
		                    this._layoutKey = null;
		                    this._owner = owner;
		                }
		                ExpandManager.prototype.newGroup = function(id) {
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
		                ExpandManager.prototype.getGroup = function(id) {
		                    if (null == this._mapGroups[id]) {
		                        console.warn(TAG + "group id: " + id + " is not registered.");
		                        return null;
		                    }
		                    return this._mapGroups[id];
		                };
		                ExpandManager.prototype.registerTopGroup = function(topGroup) {
		                    var lastGroup;
		                    var insertTo;
		                    if ("registered" === topGroup.status) {
		                        topGroup.restore();
		                        return;
		                    }
		                    lastGroup = 0 < this._aryTopGroups.length ? this._aryTopGroups[this._aryTopGroups.length - 1] : null;
		                    insertTo = null != lastGroup ? lastGroup.getLastLineIndex(true) + 1 : 0;
		                    if (_.isNaN(insertTo)) {
		                        console.error(TAG + "logic error, 'insertTo' is NaN.");
		                        return;
		                    }
		                    this._aryTopGroups.push(topGroup);
		                    topGroup.register(insertTo);
		                };
		                ExpandManager.prototype.getTopGroups = function() {
		                    return this._aryTopGroups.slice(0);
		                };
		                ExpandManager.prototype.expandAll = function() {
		                    this._aryTopGroups.forEach(function(group) {
		                        if (group.hasChildren()) {
		                            group.expand();
		                        }
		                    });
		                };
		                ExpandManager.prototype.collapseAll = function(delay) {
		                    this._aryTopGroups.forEach(function(group) {
		                        if (group.hasChildren()) {
		                            group.collapse(delay);
		                        }
		                    });
		                };
		                ExpandManager.prototype.isExpanding = function() {
		                    return this._owner.isStatusIn("expanding");
		                };
		                ExpandManager.prototype.isCollapsing = function() {
		                    return this._owner.isStatusIn("collapsing");
		                };
		                ExpandManager.prototype.isSwitching = function() {
		                    return this.isExpanding() || this.isCollapsing();
		                };
		                ExpandManager.prototype.statusAddRef = function(status) {
		                    return this._owner.statusAddRef(status);
		                };
		                ExpandManager.prototype.statusRelease = function(status) {
		                    return this._owner.statusRelease(status);
		                };
		                ExpandManager.prototype.statusScope = function(status, callback) {
		                    this._owner.statusScope(status, callback);
		                };
		                ExpandManager.prototype.isStatusIn = function(status) {
		                    return this._owner.isStatusIn(status);
		                };
		                Object.defineProperty(ExpandManager.prototype, "layoutKey", {
		                    get: function() {
		                        return this._layoutKey;
		                    },
		                    set: function(key) {
		                        this._layoutKey = key;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                ExpandManager.prototype.release = function() {
		                    this._mapGroups = {};
		                    this._aryTopGroups = [];
		                };
		                ExpandManager.prototype.backup = function(key) {
		                    var _backup = this.backupData;
		                    if (null == _backup[key]) {
		                        _backup[key] = {
		                            map: this._mapGroups,
		                            tops: this._aryTopGroups
		                        };
		                    }
		                    return true;
		                };
		                ExpandManager.prototype.restore = function(key, rebuild) {
		                    if (rebuild === void 0) {
		                        rebuild = true;
		                    }
		                    var _backup = this.backupData;
		                    if (null == _backup[key]) {
		                        return false;
		                    }
		                    if (0 < this._aryTopGroups.length) {
		                        this.release();
		                    }
		                    this._mapGroups = _backup[key].map;
		                    this._aryTopGroups = _backup[key].tops;
		                    if (this._aryTopGroups.length <= 0 || !this._aryTopGroups[0].hasLayoutKeyOf(this.layoutKey)) {
		                        return false;
		                    }
		                    this._aryTopGroups.forEach(function(group) {
		                        group.restore();
		                    });
		                    if (rebuild) {
		                        this._owner.rebuild();
		                    }
		                    return true;
		                };
		                ExpandManager.prototype.hasBackup = function(key) {
		                    return this._owner.hasBackup(key);
		                };
		                ExpandManager.prototype.clearBackup = function(key) {
		                    return this._owner.clearBackup(key);
		                };
		                Object.defineProperty(ExpandManager.prototype, "backupData", {
		                    get: function() {
		                        return this._owner.backupData;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                return ExpandManager;
		            }();
		            UI.ExpandManager = ExpandManager;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var TAG = "[CDP.UI.ExpandableListView] ";
		            var ExpandableListView = function(_super) {
		                __extends(ExpandableListView, _super);
		                function ExpandableListView(options) {
		                    var _this = _super.call(this, options) || this;
		                    _this._statusMgr = null;
		                    _this._expandManager = null;
		                    _this._statusMgr = new UI.StatusManager();
		                    _this._expandManager = new UI.ExpandManager(_this);
		                    return _this;
		                }
		                ExpandableListView.prototype.newGroup = function(id) {
		                    return this._expandManager.newGroup(id);
		                };
		                ExpandableListView.prototype.getGroup = function(id) {
		                    return this._expandManager.getGroup(id);
		                };
		                ExpandableListView.prototype.registerTopGroup = function(topGroup) {
		                    this._expandManager.registerTopGroup(topGroup);
		                };
		                ExpandableListView.prototype.getTopGroups = function() {
		                    return this._expandManager.getTopGroups();
		                };
		                ExpandableListView.prototype.expandAll = function() {
		                    this._expandManager.expandAll();
		                };
		                ExpandableListView.prototype.collapseAll = function(delay) {
		                    this._expandManager.collapseAll(delay);
		                };
		                ExpandableListView.prototype.isExpanding = function() {
		                    return this._expandManager.isExpanding();
		                };
		                ExpandableListView.prototype.isCollapsing = function() {
		                    return this._expandManager.isCollapsing();
		                };
		                ExpandableListView.prototype.isSwitching = function() {
		                    return this._expandManager.isSwitching();
		                };
		                ExpandableListView.prototype.statusAddRef = function(status) {
		                    return this._statusMgr.statusAddRef(status);
		                };
		                ExpandableListView.prototype.statusRelease = function(status) {
		                    return this._statusMgr.statusRelease(status);
		                };
		                ExpandableListView.prototype.statusScope = function(status, callback) {
		                    this._statusMgr.statusScope(status, callback);
		                };
		                ExpandableListView.prototype.isStatusIn = function(status) {
		                    return this._statusMgr.isStatusIn(status);
		                };
		                Object.defineProperty(ExpandableListView.prototype, "layoutKey", {
		                    get: function() {
		                        return this._expandManager.layoutKey;
		                    },
		                    set: function(key) {
		                        this._expandManager.layoutKey = key;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                ExpandableListView.prototype.release = function() {
		                    _super.prototype.release.call(this);
		                    this._expandManager.release();
		                };
		                ExpandableListView.prototype.backup = function(key) {
		                    return this._expandManager.backup(key);
		                };
		                ExpandableListView.prototype.restore = function(key, rebuild) {
		                    if (rebuild === void 0) {
		                        rebuild = true;
		                    }
		                    return this._expandManager.restore(key, rebuild);
		                };
		                return ExpandableListView;
		            }(UI.ListView);
		            UI.ExpandableListView = ExpandableListView;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    return CDP.UI;
		});

		(function(root, factory) {
		    if (true) {
		        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __WEBPACK_LOCAL_MODULE_5__, __WEBPACK_LOCAL_MODULE_6__, __WEBPACK_LOCAL_MODULE_7__ ], __WEBPACK_LOCAL_MODULE_8__ = (function() {
		            return factory(root.CDP || (root.CDP = {}));
		        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));
		    } else {
		        factory(root.CDP || (root.CDP = {}));
		    }
		})(window, function (CDP) {
		    CDP.UI = CDP.UI || {};
		    var __extends = this && this.__extends || function(d, b) {
		        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		        function __() {
		            this.constructor = d;
		        }
		        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
		    };
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var TAG = "[CDP.UI.Toast] ";
		            var Toast;
		            (function(Toast) {
		                Toast.LENGTH_SHORT = 1500;
		                Toast.LENGTH_LONG = 4e3;
		                var OffsetX;
		                (function(OffsetX) {
		                    OffsetX[OffsetX["LEFT"] = 1] = "LEFT";
		                    OffsetX[OffsetX["RIGHT"] = 2] = "RIGHT";
		                    OffsetX[OffsetX["CENTER"] = 4] = "CENTER";
		                })(OffsetX = Toast.OffsetX || (Toast.OffsetX = {}));
		                var OffsetY;
		                (function(OffsetY) {
		                    OffsetY[OffsetY["TOP"] = 16] = "TOP";
		                    OffsetY[OffsetY["BOTTOM"] = 32] = "BOTTOM";
		                    OffsetY[OffsetY["CENTER"] = 64] = "CENTER";
		                })(OffsetY = Toast.OffsetY || (Toast.OffsetY = {}));
		                var StyleBuilderDefault = function() {
		                    function StyleBuilderDefault() {}
		                    StyleBuilderDefault.prototype.getClass = function() {
		                        return "ui-loader ui-overlay-shadow ui-corner-all";
		                    };
		                    StyleBuilderDefault.prototype.getStyle = function() {
		                        var style = {
		                            padding: "7px 25px 7px 25px",
		                            display: "block",
		                            "background-color": "#1d1d1d",
		                            "border-color": "#1b1b1b",
		                            color: "#fff",
		                            "text-shadow": "0 1px 0 #111",
		                            "font-weight": "bold",
		                            opacity: .8
		                        };
		                        return style;
		                    };
		                    StyleBuilderDefault.prototype.getOffsetPoint = function() {
		                        return OffsetX.CENTER | OffsetY.BOTTOM;
		                    };
		                    StyleBuilderDefault.prototype.getOffsetX = function() {
		                        return 0;
		                    };
		                    StyleBuilderDefault.prototype.getOffsetY = function() {
		                        return -75;
		                    };
		                    return StyleBuilderDefault;
		                }();
		                Toast.StyleBuilderDefault = StyleBuilderDefault;
		                function show(message, duration, style) {
		                    if (duration === void 0) {
		                        duration = Toast.LENGTH_SHORT;
		                    }
		                    var $mobile = $.mobile;
		                    var info = style || new StyleBuilderDefault();
		                    var setCSS = info.getStyle() ? true : false;
		                    var msg = message.replace(/\n/g, "<br/>");
		                    var html = "<div>" + msg + "</div>";
		                    var box = $(html).addClass(info.getClass());
		                    if (setCSS) {
		                        box.css(info.getStyle());
		                    }
		                    box.css({
		                        top: 0,
		                        left: 0
		                    }).appendTo($mobile.pageContainer);
		                    var offsetPoint = info.getOffsetPoint();
		                    var posX, posY;
		                    var $window = $(window);
		                    var box_width = box.width() + parseInt(box.css("padding-left"), 10) + parseInt(box.css("padding-right"), 10);
		                    var box_height = box.height() + parseInt(box.css("padding-top"), 10) + parseInt(box.css("padding-bottom"), 10);
		                    switch (offsetPoint & 15) {
		                      case OffsetX.LEFT:
		                        posX = 0 + info.getOffsetX();
		                        break;

		                      case OffsetX.RIGHT:
		                        posX = $window.width() - box_width + info.getOffsetX();
		                        break;

		                      case OffsetX.CENTER:
		                        posX = $window.width() / 2 - box_width / 2 + info.getOffsetX();
		                        break;

		                      default:
		                        console.warn(TAG + "warn. unknown offsetPoint:" + (offsetPoint & 15));
		                        posX = $window.width() / 2 - box_width / 2 + info.getOffsetX();
		                        break;
		                    }
		                    switch (offsetPoint & 240) {
		                      case OffsetY.TOP:
		                        posY = 0 + info.getOffsetY();
		                        break;

		                      case OffsetY.BOTTOM:
		                        posY = $window.height() - box_height + info.getOffsetY();
		                        break;

		                      case OffsetY.CENTER:
		                        posY = $window.height() / 2 - box_height / 2 + info.getOffsetY();
		                        break;

		                      default:
		                        console.warn(TAG + "warn. unknown offsetPoint:" + (offsetPoint & 240));
		                        posY = $window.height() / 2 - box_height / 2 + info.getOffsetY();
		                        break;
		                    }
		                    box.css({
		                        top: posY,
		                        left: posX
		                    }).delay(duration).fadeOut(400, function() {
		                        $(this).remove();
		                    });
		                }
		                Toast.show = show;
		            })(Toast = UI.Toast || (UI.Toast = {}));
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var Framework = CDP.Framework;
		            var TAG = "[CDP.UI.Dialog] ";
		            var Dialog = function() {
		                function Dialog(id, options) {
		                    this._template = null;
		                    this._settings = null;
		                    this._$dialog = null;
		                    Dialog.initCommonCondition();
		                    this._settings = $.extend({}, Dialog.s_defaultOptions, options);
		                    this._template = CDP.Tools.Template.getJST(id, this._settings.src);
		                }
		                Dialog.prototype.show = function(options) {
		                    var _this = this;
		                    var $document = $(document), $body = $("body"), $page = $body.pagecontainer("getActivePage");
		                    var ofcHidden = {
		                        overflow: "hidden",
		                        "overflow-x": "hidden",
		                        "overflow-y": "hidden"
		                    };
		                    var ofcBody = {
		                        overflow: $body.css("overflow"),
		                        "overflow-x": $body.css("overflow-x"),
		                        "overflow-y": $body.css("overflow-y")
		                    };
		                    var parentScrollPos = $body.scrollTop();
		                    var ofcPage = {
		                        overflow: $page.css("overflow"),
		                        "overflow-x": $page.css("overflow-x"),
		                        "overflow-y": $page.css("overflow-y")
		                    };
		                    var scrollEvent = "scroll touchmove mousemove MSPointerMove";
		                    var scrollHander = function(event) {
		                        if ("deny" === _this._settings.scrollEvent) {
		                            event.preventDefault();
		                        } else if ("adjust" === _this._settings.scrollEvent) {
		                            $body.scrollTop(parentScrollPos);
		                        }
		                    };
		                    if (null != options) {
		                        this._settings = $.extend({}, this._settings, options);
		                    }
		                    this._settings._header = this._settings.title ? "has-title" : "no-title";
		                    this._$dialog = $(this._template(this._settings));
		                    this._$dialog.localize();
		                    $body.append(this._$dialog);
		                    this.onBeforeShow().done(function() {
		                        _this._$dialog.popup({
		                            dismissible: _this._settings.dismissible,
		                            transition: _this._settings.transition,
		                            positionTo: "window",
		                            create: function(event, ui) {
		                                if ("allow" !== _this._settings.scrollEvent) {
		                                    $document.on(scrollEvent, scrollHander);
		                                }
		                                $body.css(ofcHidden);
		                                $page.css(ofcHidden);
		                                Dialog.register(_this);
		                            },
		                            afterclose: function(event, ui) {
		                                $page.css(ofcPage);
		                                $body.css(ofcBody);
		                                if ("allow" !== _this._settings.scrollEvent) {
		                                    $document.off(scrollEvent, scrollHander);
		                                }
		                                Dialog.register(null);
		                                _this._$dialog.remove();
		                                _this._$dialog = null;
		                            }
		                        }).popup("open").on(_this._settings.event, function(event) {
		                            event.preventDefault();
		                            var autoClose = $(event.target).attr("data-auto-close");
		                            if (null == autoClose) {
		                                autoClose = _this._settings.defaultAutoClose ? "true" : "false";
		                            }
		                            if ("false" === autoClose) {
		                                return;
		                            }
		                            _this.close();
		                        });
		                    }).fail(function(error) {
		                        console.error(TAG + "Dialog.show() failed.");
		                        if (_this._$dialog) {
		                            _this._$dialog.trigger("error", error);
		                        }
		                    });
		                    return this._$dialog;
		                };
		                Dialog.prototype.close = function() {
		                    if (this._$dialog) {
		                        this._$dialog.popup("close");
		                    }
		                };
		                Object.defineProperty(Dialog.prototype, "$el", {
		                    get: function() {
		                        return this._$dialog;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Dialog.prototype.onBeforeShow = function() {
		                    return $.Deferred().resolve();
		                };
		                Dialog.setDefaultOptions = function(options) {
		                    Dialog.initCommonCondition();
		                    $.extend(true, Dialog.s_defaultOptions, options);
		                };
		                Dialog.register = function(dialog) {
		                    if (null != dialog && null != Dialog.s_activeDialog) {
		                        console.warn(TAG + "new dialog proc is called in the past dialog's one. use setTimeout() for post process.");
		                    }
		                    Dialog.s_activeDialog = dialog;
		                };
		                Dialog.initCommonCondition = function() {
		                    if (!Framework.isInitialized()) {
		                        console.warn(TAG + "initCommonCondition() should be called after Framework.initialized.");
		                        return;
		                    }
		                    if (null == Dialog.s_oldBackKeyHandler) {
		                        Dialog.s_oldBackKeyHandler = CDP.setBackButtonHandler(null);
		                        CDP.setBackButtonHandler(Dialog.customBackKeyHandler);
		                        Dialog.s_defaultOptions = {
		                            idPositive: "dlg-btn-positive",
		                            idNegative: "dlg-btn-negative",
		                            event: Framework.getDefaultClickEvent(),
		                            dismissible: false,
		                            defaultAutoClose: false,
		                            transition: "pop",
		                            labelPositive: "OK",
		                            labelNegative: "Cancel",
		                            backKey: "close",
		                            scrollEvent: "deny"
		                        };
		                    }
		                };
		                Dialog.customBackKeyHandler = function(event) {
		                    if (null != Dialog.s_activeDialog) {
		                        if ("close" === Dialog.s_activeDialog._settings.backKey) {
		                            Dialog.s_activeDialog.close();
		                        } else if ("function" === typeof Dialog.s_activeDialog._settings.backKey) {
		                            Dialog.s_activeDialog._settings.backKey(event);
		                        }
		                        return;
		                    }
		                    Dialog.s_oldBackKeyHandler(event);
		                };
		                return Dialog;
		            }();
		            Dialog.s_activeDialog = null;
		            Dialog.s_oldBackKeyHandler = null;
		            Dialog.s_defaultOptions = null;
		            UI.Dialog = Dialog;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var Framework = CDP.Framework;
		            var TAG = "[CDP.UI.PageView] ";
		            var PageContainerView = function(_super) {
		                __extends(PageContainerView, _super);
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
		                    get: function() {
		                        return this._owner;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                return PageContainerView;
		            }(Backbone.View);
		            UI.PageContainerView = PageContainerView;
		            var PageView = function(_super) {
		                __extends(PageView, _super);
		                function PageView(url, id, options) {
		                    var _this = _super.call(this, options) || this;
		                    _this._pageOptions = null;
		                    _this._basePage = null;
		                    _this._statusMgr = null;
		                    _this._pageOptions = $.extend({}, {
		                        owner: _this
		                    }, options);
		                    _this._basePage = _this._pageOptions.basePage ? new _this._pageOptions.basePage(url, id, _this._pageOptions) : new Framework.Page(url, id, _this._pageOptions);
		                    _this._statusMgr = new UI.StatusManager();
		                    var delegates = _this.events ? true : false;
		                    _this.setElement(_this.$page, delegates);
		                    return _this;
		                }
		                PageView.prototype.statusAddRef = function(status) {
		                    return this._statusMgr.statusAddRef(status);
		                };
		                PageView.prototype.statusRelease = function(status) {
		                    return this._statusMgr.statusRelease(status);
		                };
		                PageView.prototype.statusScope = function(status, callback) {
		                    this._statusMgr.statusScope(status, callback);
		                };
		                PageView.prototype.isStatusIn = function(status) {
		                    return this._statusMgr.isStatusIn(status);
		                };
		                Object.defineProperty(PageView.prototype, "active", {
		                    get: function() {
		                        return this._basePage.active;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(PageView.prototype, "url", {
		                    get: function() {
		                        return this._basePage.url;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(PageView.prototype, "id", {
		                    get: function() {
		                        return this._basePage ? this._basePage.id : null;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(PageView.prototype, "$page", {
		                    get: function() {
		                        return this._basePage.$page;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(PageView.prototype, "$header", {
		                    get: function() {
		                        return this._basePage.$header;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(PageView.prototype, "$footer", {
		                    get: function() {
		                        return this._basePage.$footer;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                Object.defineProperty(PageView.prototype, "intent", {
		                    get: function() {
		                        return this._basePage.intent;
		                    },
		                    set: function(newIntent) {
		                        this._basePage.intent = newIntent;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                PageView.prototype.onOrientationChanged = function(newOrientation) {};
		                PageView.prototype.onHardwareBackButton = function(event) {
		                    return false;
		                };
		                PageView.prototype.onBeforeRouteChange = function() {
		                    return $.Deferred().resolve().promise();
		                };
		                PageView.prototype.onCommand = function(event, kind) {};
		                PageView.prototype.onInitialize = function(event) {};
		                PageView.prototype.onPageBeforeCreate = function(event) {
		                    this.setElement(this.$page, true);
		                };
		                PageView.prototype.onPageInit = function(event) {};
		                PageView.prototype.onPageBeforeShow = function(event, data) {};
		                PageView.prototype.onPageShow = function(event, data) {};
		                PageView.prototype.onPageBeforeHide = function(event, data) {};
		                PageView.prototype.onPageHide = function(event, data) {};
		                PageView.prototype.onPageRemove = function(event) {
		                    this.remove();
		                };
		                return PageView;
		            }(Backbone.View);
		            UI.PageView = PageView;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var TAG = "[CDP.UI.PageListView] ";
		            var PageListView = function(_super) {
		                __extends(PageListView, _super);
		                function PageListView(url, id, options) {
		                    var _this = _super.call(this, url, id, $.extend({}, {
		                        autoDestoryElement: false
		                    }, options)) || this;
		                    _this._scrollMgr = null;
		                    _this._needRebuild = false;
		                    _this._scrollMgr = new UI.ScrollManager(options);
		                    return _this;
		                }
		                PageListView.prototype.reserveRebuild = function() {
		                    this._needRebuild = true;
		                };
		                PageListView.prototype.onOrientationChanged = function(newOrientation) {
		                    this._scrollMgr.setBaseHeight(this.getPageBaseHeight());
		                };
		                PageListView.prototype.onBeforeRouteChange = function() {
		                    if (this._pageOptions.autoDestoryElement) {
		                        this._scrollMgr.destroy();
		                    }
		                    return _super.prototype.onBeforeRouteChange.call(this);
		                };
		                PageListView.prototype.onPageBeforeShow = function(event, data) {
		                    _super.prototype.onPageBeforeShow.call(this, event, data);
		                    this._scrollMgr.initialize(this.$page, this.getPageBaseHeight());
		                };
		                PageListView.prototype.onPageShow = function(event, data) {
		                    _super.prototype.onPageShow.call(this, event, data);
		                    this._scrollMgr.setBaseHeight(this.getPageBaseHeight());
		                    if (this._needRebuild) {
		                        this.rebuild();
		                        this._needRebuild = false;
		                    }
		                };
		                PageListView.prototype.onPageRemove = function(event) {
		                    _super.prototype.onPageRemove.call(this, event);
		                    this.release();
		                };
		                PageListView.prototype.isInitialized = function() {
		                    return this._scrollMgr.isInitialized();
		                };
		                PageListView.prototype.addItem = function(height, initializer, info, insertTo) {
		                    this._addLine(new UI.LineProfile(this._scrollMgr, Math.floor(height), initializer, info), insertTo);
		                };
		                PageListView.prototype.removeItem = function(index, arg2, arg3) {
		                    this._scrollMgr.removeItem(index, arg2, arg3);
		                };
		                PageListView.prototype.getItemInfo = function(target) {
		                    return this._scrollMgr.getItemInfo(target);
		                };
		                PageListView.prototype.refresh = function() {
		                    this._scrollMgr.refresh();
		                };
		                PageListView.prototype.update = function() {
		                    this._scrollMgr.update();
		                };
		                PageListView.prototype.rebuild = function() {
		                    this._scrollMgr.rebuild();
		                };
		                PageListView.prototype.release = function() {
		                    this._scrollMgr.release();
		                };
		                PageListView.prototype.backup = function(key) {
		                    return this._scrollMgr.backup(key);
		                };
		                PageListView.prototype.restore = function(key, rebuild) {
		                    if (rebuild === void 0) {
		                        rebuild = true;
		                    }
		                    var retval = this._scrollMgr.restore(key, rebuild);
		                    if (retval && !rebuild) {
		                        this.reserveRebuild();
		                    }
		                    return retval;
		                };
		                PageListView.prototype.hasBackup = function(key) {
		                    return this._scrollMgr.hasBackup(key);
		                };
		                PageListView.prototype.clearBackup = function(key) {
		                    return this._scrollMgr.clearBackup(key);
		                };
		                Object.defineProperty(PageListView.prototype, "backupData", {
		                    get: function() {
		                        return this._scrollMgr.backupData;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                PageListView.prototype.setScrollHandler = function(handler, on) {
		                    this._scrollMgr.setScrollHandler(handler, on);
		                };
		                PageListView.prototype.setScrollStopHandler = function(handler, on) {
		                    this._scrollMgr.setScrollStopHandler(handler, on);
		                };
		                PageListView.prototype.getScrollPos = function() {
		                    return this._scrollMgr.getScrollPos();
		                };
		                PageListView.prototype.getScrollPosMax = function() {
		                    return this._scrollMgr.getScrollPosMax();
		                };
		                PageListView.prototype.scrollTo = function(pos, animate, time) {
		                    this._scrollMgr.scrollTo(pos, animate, time);
		                };
		                PageListView.prototype.ensureVisible = function(index, options) {
		                    this._scrollMgr.ensureVisible(index, options);
		                };
		                Object.defineProperty(PageListView.prototype, "core", {
		                    get: function() {
		                        return this._scrollMgr;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                PageListView.prototype._addLine = function(_line, insertTo) {
		                    this._scrollMgr._addLine(_line, insertTo);
		                };
		                PageListView.prototype.getPageBaseHeight = function() {
		                    return $(window).height() - parseInt(this.$page.css("padding-top"), 10);
		                };
		                return PageListView;
		            }(UI.PageView);
		            UI.PageListView = PageListView;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    var CDP;
		    (function(CDP) {
		        var UI;
		        (function(UI) {
		            var TAG = "[CDP.UI.PageExpandableListView] ";
		            var PageExpandableListView = function(_super) {
		                __extends(PageExpandableListView, _super);
		                function PageExpandableListView(url, id, options) {
		                    var _this = _super.call(this, url, id, options) || this;
		                    _this._expandManager = null;
		                    _this._expandManager = new UI.ExpandManager(_this);
		                    return _this;
		                }
		                PageExpandableListView.prototype.newGroup = function(id) {
		                    return this._expandManager.newGroup(id);
		                };
		                PageExpandableListView.prototype.getGroup = function(id) {
		                    return this._expandManager.getGroup(id);
		                };
		                PageExpandableListView.prototype.registerTopGroup = function(topGroup) {
		                    this._expandManager.registerTopGroup(topGroup);
		                };
		                PageExpandableListView.prototype.getTopGroups = function() {
		                    return this._expandManager.getTopGroups();
		                };
		                PageExpandableListView.prototype.expandAll = function() {
		                    this._expandManager.expandAll();
		                };
		                PageExpandableListView.prototype.collapseAll = function(delay) {
		                    this._expandManager.collapseAll(delay);
		                };
		                PageExpandableListView.prototype.isExpanding = function() {
		                    return this._expandManager.isExpanding();
		                };
		                PageExpandableListView.prototype.isCollapsing = function() {
		                    return this._expandManager.isCollapsing();
		                };
		                PageExpandableListView.prototype.isSwitching = function() {
		                    return this._expandManager.isSwitching();
		                };
		                Object.defineProperty(PageExpandableListView.prototype, "layoutKey", {
		                    get: function() {
		                        return this._expandManager.layoutKey;
		                    },
		                    set: function(key) {
		                        this._expandManager.layoutKey = key;
		                    },
		                    enumerable: true,
		                    configurable: true
		                });
		                PageExpandableListView.prototype.release = function() {
		                    _super.prototype.release.call(this);
		                    this._expandManager.release();
		                };
		                PageExpandableListView.prototype.backup = function(key) {
		                    return this._expandManager.backup(key);
		                };
		                PageExpandableListView.prototype.restore = function(key, rebuild) {
		                    if (rebuild === void 0) {
		                        rebuild = true;
		                    }
		                    return this._expandManager.restore(key, rebuild);
		                };
		                return PageExpandableListView;
		            }(UI.PageListView);
		            UI.PageExpandableListView = PageExpandableListView;
		        })(UI = CDP.UI || (CDP.UI = {}));
		    })(CDP || (CDP = {}));
		    return CDP.UI;
		});

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_0__ ], __WEBPACK_LOCAL_MODULE_9__ = (function(require, exports, _core) {
		    "use strict";
		    exports.global = _core.global;
		    exports.initialize = _core.initialize;
		    exports.webRoot = _core.webRoot;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_1__ ], __WEBPACK_LOCAL_MODULE_10__ = (function(require, exports, _promise) {
		    "use strict";
		    exports.makePromise = _promise.makePromise;
		    exports.wait = _promise.wait;
		    exports.PromiseManager = _promise.PromiseManager;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_2__ ], __WEBPACK_LOCAL_MODULE_11__ = (function(require, exports, _i18n) {
		    "use strict";
		    exports.i18n = _i18n.i18n;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_5__ ], __WEBPACK_LOCAL_MODULE_12__ = (function(require, exports) {
		    "use strict";
		    exports.waitForDeviceReady = CDP.waitForDeviceReady;
		    exports.setBackButtonHandler = CDP.setBackButtonHandler;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_9__, __WEBPACK_LOCAL_MODULE_10__, __WEBPACK_LOCAL_MODULE_11__, __WEBPACK_LOCAL_MODULE_12__ ], __WEBPACK_LOCAL_MODULE_13__ = (function(require, exports, core_1, promise_1, i18n_1, framework_jqm_1) {
		    "use strict";
		    function __export(m) {
		        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
		    }
		    __export(core_1);
		    __export(promise_1);
		    __export(i18n_1);
		    __export(framework_jqm_1);
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_5__ ], __WEBPACK_LOCAL_MODULE_14__ = (function(require, exports, _framework) {
		    "use strict";
		    exports.Patch = _framework.Patch;
		    exports.Platform = _framework.Platform;
		    exports.getOrientation = _framework.getOrientation;
		    exports.toUrl = _framework.toUrl;
		    exports.setBeforeRouteChangeHandler = _framework.setBeforeRouteChangeHandler;
		    exports.Router = _framework.Router;
		    exports.initialize = _framework.initialize;
		    exports.isInitialized = _framework.isInitialized;
		    exports.registerOrientationChangedListener = _framework.registerOrientationChangedListener;
		    exports.unregisterOrientationChangedListener = _framework.unregisterOrientationChangedListener;
		    exports.setupEventHandlers = _framework.setupEventHandlers;
		    exports.setActivePage = _framework.setActivePage;
		    exports.getDefaultClickEvent = _framework.getDefaultClickEvent;
		    exports.Page = _framework.Page;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_14__ ], __WEBPACK_LOCAL_MODULE_15__ = (function(require, exports, jqm_1) {
		    "use strict";
		    function __export(m) {
		        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
		    }
		    __export(jqm_1);
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_6__ ], __WEBPACK_LOCAL_MODULE_16__ = (function(require, exports, _tools) {
		    "use strict";
		    var Blob;
		    (function(Blob) {
		        Blob.arrayBufferToBlob = _tools.Blob.arrayBufferToBlob;
		        Blob.base64ToBlob = _tools.Blob.base64ToBlob;
		        Blob.base64ToArrayBuffer = _tools.Blob.base64ToArrayBuffer;
		        Blob.base64ToUint8Array = _tools.Blob.base64ToUint8Array;
		        Blob.arrayBufferToBase64 = _tools.Blob.arrayBufferToBase64;
		        Blob.uint8ArrayToBase64 = _tools.Blob.uint8ArrayToBase64;
		        Blob.URL = _tools.Blob.URL;
		    })(Blob = exports.Blob || (exports.Blob = {}));
		    exports.DateTime = _tools.DateTime;
		    exports.abs = _tools.abs;
		    exports.max = _tools.max;
		    exports.min = _tools.min;
		    exports.await = _tools.await;
		    exports.toZeroPadding = _tools.toZeroPadding;
		    exports.inherit = _tools.inherit;
		    exports.mixin = _tools.mixin;
		    exports.extend = _tools.extend;
		    exports.getDevicePixcelRatio = _tools.getDevicePixcelRatio;
		    exports.doWork = _tools.doWork;
		    exports.Template = _tools.Template;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_16__ ], __WEBPACK_LOCAL_MODULE_17__ = (function(require, exports, tools_1) {
		    "use strict";
		    function __export(m) {
		        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
		    }
		    __export(tools_1);
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_7__ ], __WEBPACK_LOCAL_MODULE_18__ = (function(require, exports, _ui) {
		    "use strict";
		    exports.ListViewGlobalConfig = _ui.ListViewGlobalConfig;
		    exports.LineProfile = _ui.LineProfile;
		    exports.GroupProfile = _ui.GroupProfile;
		    exports.composeViews = _ui.composeViews;
		    exports.deriveViews = _ui.deriveViews;
		    exports.mixinViews = _ui.mixinViews;
		    exports.StatusManager = _ui.StatusManager;
		    exports.PageProfile = _ui.PageProfile;
		    exports.ScrollerElement = _ui.ScrollerElement;
		    exports.ScrollerNative = _ui.ScrollerNative;
		    exports.ScrollerIScroll = _ui.ScrollerIScroll;
		    exports.ListItemView = _ui.ListItemView;
		    exports.ScrollManager = _ui.ScrollManager;
		    exports.ListView = _ui.ListView;
		    exports.GroupListItemView = _ui.GroupListItemView;
		    exports.ExpandManager = _ui.ExpandManager;
		    exports.ExpandableListView = _ui.ExpandableListView;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_8__ ], __WEBPACK_LOCAL_MODULE_19__ = (function(require, exports, _ui) {
		    "use strict";
		    var Toast;
		    (function(Toast) {
		        Toast.LENGTH_SHORT = _ui.Toast.LENGTH_SHORT;
		        Toast.LENGTH_LONG = _ui.Toast.LENGTH_LONG;
		        Toast.StyleBuilderDefault = _ui.Toast.StyleBuilderDefault;
		        Toast.show = _ui.Toast.show;
		    })(Toast = exports.Toast || (exports.Toast = {}));
		    exports.Dialog = _ui.Dialog;
		    exports.PageContainerView = _ui.PageContainerView;
		    exports.PageView = _ui.PageView;
		    exports.PageListView = _ui.PageListView;
		    exports.PageExpandableListView = _ui.PageExpandableListView;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_18__, __WEBPACK_LOCAL_MODULE_19__ ], __WEBPACK_LOCAL_MODULE_20__ = (function(require, exports, listview_1, jqm_2) {
		    "use strict";
		    function __export(m) {
		        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
		    }
		    __export(listview_1);
		    __export(jqm_2);
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)));

		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [ __webpack_require__, exports, __WEBPACK_LOCAL_MODULE_13__, __WEBPACK_LOCAL_MODULE_15__, __WEBPACK_LOCAL_MODULE_17__, __WEBPACK_LOCAL_MODULE_20__ ], __WEBPACK_AMD_DEFINE_RESULT__ = function(require, exports, core_2, Framework, Tools, UI) {
		    "use strict";
		    function __export(m) {
		        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
		    }
		    __export(core_2);
		    exports.Framework = Framework;
		    exports.Tools = Tools;
		    exports.UI = UI;
		    exports.initialize = Framework.initialize;
		}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

	/***/ },
	/* 1 */
	/***/ function(module, exports) {

		module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

	/***/ },
	/* 2 */
	/***/ function(module, exports) {

		module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

	/***/ },
	/* 3 */
	/***/ function(module, exports) {

		/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {module.exports = __webpack_amd_options__;

		/* WEBPACK VAR INJECTION */}.call(exports, {}))

	/***/ },
	/* 4 */
	/***/ function(module, exports) {

		module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

	/***/ }
	/******/ ])
	});
	;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});
;