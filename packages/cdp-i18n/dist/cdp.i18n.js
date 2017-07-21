/*!
 * cdp.i18n.js 2.0.0
 *
 * Date: 2017-07-21T12:42:32.800Z
 */

(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory(require("jquery"), require("cdp.core"), require("cdp.promise"));
    else if(typeof define === 'function' && define.amd)
        define(["jquery", "cdp.core", "cdp.promise"], factory);
    else if(typeof exports === 'object')
        exports["CDP"] = factory(require("jquery"), require("cdp.core"), require("cdp.promise"));
    else
        root["CDP"] = factory(root["jQuery"], root["CDP"], root["CDP"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
return /******/ (function(modules) { // webpackBootstrap
/******/     // The module cache
/******/     var installedModules = {};
/******/
/******/     // The require function
/******/     function __webpack_require__(moduleId) {
/******/
/******/         // Check if module is in cache
/******/         if(installedModules[moduleId]) {
/******/             return installedModules[moduleId].exports;
/******/         }
/******/         // Create a new module (and put it into the cache)
/******/         var module = installedModules[moduleId] = {
/******/             i: moduleId,
/******/             l: false,
/******/             exports: {}
/******/         };
/******/
/******/         // Execute the module function
/******/         modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/         // Flag the module as loaded
/******/         module.l = true;
/******/
/******/         // Return the exports of the module
/******/         return module.exports;
/******/     }
/******/
/******/
/******/     // expose the modules object (__webpack_modules__)
/******/     __webpack_require__.m = modules;
/******/
/******/     // expose the module cache
/******/     __webpack_require__.c = installedModules;
/******/
/******/     // define getter function for harmony exports
/******/     __webpack_require__.d = function(exports, name, getter) {
/******/         if(!__webpack_require__.o(exports, name)) {
/******/             Object.defineProperty(exports, name, {
/******/                 configurable: false,
/******/                 enumerable: true,
/******/                 get: getter
/******/             });
/******/         }
/******/     };
/******/
/******/     // getDefaultExport function for compatibility with non-harmony modules
/******/     __webpack_require__.n = function(module) {
/******/         var getter = module && module.__esModule ?
/******/             function getDefault() { return module['default']; } :
/******/             function getModuleExports() { return module; };
/******/         __webpack_require__.d(getter, 'a', getter);
/******/         return getter;
/******/     };
/******/
/******/     // Object.prototype.hasOwnProperty.call
/******/     __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/     // __webpack_public_path__
/******/     __webpack_require__.p = "";
/******/
/******/     // Load entry module and return exports
/******/     return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) { if (true) { !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = function ($, CDP) { return factory($, CDP); }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
                __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); } else { factory(root.jQuery || root.$, root.CDP || (root.CDP = {})); } }(this, function ($, CDP) {

/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var Promise = CDP.Promise;
    var TAG = "[CDP.i18n] ";
    /**
     * \~english
     * initialize i18next.
     *
     * \~japanese
     * i18next の初期化
     *
     * @private
     * @returns IPromiseBase オブジェクト
     */
    function initializeI18N(settings) {
        return new Promise(function (resolve) {
            var i18nSettings = settings || {};
            var i18nOptions = (function (resources) {
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
                }
                else {
                    return i18nSettings.options;
                }
            })(i18nSettings.fallbackResources);
            new Promise(function(resolve) { resolve(); }).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(4)]; (function ($18Next) {
                new Promise(function(resolve) { resolve(); }).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [
                    __webpack_require__(5),
                    __webpack_require__(6),
                    __webpack_require__(7),
                    __webpack_require__(8),
                    __webpack_require__(9),
                ]; (function (i18next, Backend, Cache, PostProcessor, LanguageDetector) {
                    i18next
                        .use(Backend)
                        .use(Cache)
                        .use(PostProcessor)
                        .use(LanguageDetector)
                        .init(i18nOptions, function (error, t) {
                        $18Next.init(i18next, $, {
                            tName: "t",
                            i18nName: "i18n",
                            handleName: "localize",
                            selectorAttr: "data-i18n",
                            targetAttr: "i18n-target",
                            optionsAttr: "i18n-options",
                            useOptionsAttr: false,
                            parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
                        });
                        // i18next 3.4.1: resources が指定されると preload が読み込まれないため、再読み込み処理を行う.
                        if (i18next.options.resources && i18next.options.preload) {
                            // options からプロパティを一旦削除.
                            var _preload_1 = i18next.options.preload;
                            var _resources_1 = i18next.options.resources;
                            delete i18next.options.resources;
                            delete i18next.options.preload;
                            i18next.loadLanguages(_preload_1, function () {
                                // options を元に戻す
                                i18next.options.resources = _resources_1;
                                i18next.options.preload = _preload_1;
                                CDP.i18n = i18next;
                                resolve();
                            });
                        }
                        else {
                            CDP.i18n = i18next;
                            resolve();
                        }
                    });
                }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}).catch(__webpack_require__.oe);
            }.apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}).catch(__webpack_require__.oe);
        });
    }
    CDP.initializeI18N = initializeI18N;
    /**
     * \~english
     * get string resource for fallback.
     *
     * \~japanese
     * Fallback 用ローカライズリソースの取得
     *
     * @private
     * @returns falbakc リソースオブジェクト
     */
    function getLocaleFallbackResource(path) {
        var json;
        $.ajax({
            url: toUrl(path),
            method: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                json = data;
            },
            error: function (xhr, status) {
                console.error(TAG + "ajax request failed. status: " + status);
            }
        });
        return json;
    }
    /**
     * \~english
     * Convert path to URL.
     *
     * @param path [in] path string
     *
     * \~japanese
     * path を URL に変換
     *
     * @param path [in] パスを指定。
     */
    function toUrl(path) {
        if (!path && "/" !== path[0]) {
            console.error(TAG + "invalid path. path: " + path);
        }
        else {
            return CDP.webRoot + path.slice(1);
        }
    }
})(CDP || (CDP = {}));

return CDP; }));


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.jqueryI18next = factory());
}(this, (function () { 'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaults = {
  tName: 't',
  i18nName: 'i18n',
  handleName: 'localize',
  selectorAttr: 'data-i18n',
  targetAttr: 'i18n-target',
  optionsAttr: 'i18n-options',
  useOptionsAttr: false,
  parseDefaultValueFromContent: true
};

function init(i18next, $) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


  options = _extends({}, defaults, options);

  function parse(ele, key, opts) {
    if (key.length === 0) return;

    var attr = 'text';

    if (key.indexOf('[') === 0) {
      var parts = key.split(']');
      key = parts[1];
      attr = parts[0].substr(1, parts[0].length - 1);
    }

    if (key.indexOf(';') === key.length - 1) {
      key = key.substr(0, key.length - 2);
    }

    function extendDefault(o, val) {
      if (!options.parseDefaultValueFromContent) return o;
      return _extends({}, o, { defaultValue: val });
    }

    if (attr === 'html') {
      ele.html(i18next.t(key, extendDefault(opts, ele.html())));
    } else if (attr === 'text') {
      ele.text(i18next.t(key, extendDefault(opts, ele.text())));
    } else if (attr === 'prepend') {
      ele.prepend(i18next.t(key, extendDefault(opts, ele.html())));
    } else if (attr === 'append') {
      ele.append(i18next.t(key, extendDefault(opts, ele.html())));
    } else if (attr.indexOf('data-') === 0) {
      var dataAttr = attr.substr('data-'.length);
      var translated = i18next.t(key, extendDefault(opts, ele.data(dataAttr)));

      // we change into the data cache
      ele.data(dataAttr, translated);
      // we change into the dom
      ele.attr(attr, translated);
    } else {
      ele.attr(attr, i18next.t(key, extendDefault(opts, ele.attr(attr))));
    }
  }

  function localize(ele, opts) {
    var key = ele.attr(options.selectorAttr);
    if (!key && typeof key !== 'undefined' && key !== false) key = ele.text() || ele.val();
    if (!key) return;

    var target = ele,
        targetSelector = ele.data(options.targetAttr);

    if (targetSelector) target = ele.find(targetSelector) || ele;

    if (!opts && options.useOptionsAttr === true) opts = ele.data(options.optionsAttr);

    opts = opts || {};

    if (key.indexOf(';') >= 0) {
      var keys = key.split(';');

      $.each(keys, function (m, k) {
        if (k !== '') parse(target, k, opts);
      });
    } else {
      parse(target, key, opts);
    }

    if (options.useOptionsAttr === true) {
      var clone = {};
      clone = _extends({ clone: clone }, opts);

      delete clone.lng;
      ele.data(options.optionsAttr, clone);
    }
  }

  function handle(opts) {
    return this.each(function () {
      // localize element itself
      localize($(this), opts);

      // localize children
      var elements = $(this).find('[' + options.selectorAttr + ']');
      elements.each(function () {
        localize($(this), opts);
      });
    });
  };

  // $.t $.i18n shortcut
  $[options.tName] = i18next.t.bind(i18next);
  $[options.i18nName] = i18next;

  // selector function $(mySelector).localize(opts);
  $.fn[options.handleName] = handle;
}

var index = {
  init: init
};

return index;

})));

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
     true ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.i18next = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var _extends = Object.assign || function (target) {
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



var inherits = function (subClass, superClass) {
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











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
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

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var consoleLogger = {
  type: 'logger',

  log: function log(args) {
    this.output('log', args);
  },
  warn: function warn(args) {
    this.output('warn', args);
  },
  error: function error(args) {
    this.output('error', args);
  },
  output: function output(type, args) {
    var _console;

    /* eslint no-console: 0 */
    if (console && console[type]) (_console = console)[type].apply(_console, toConsumableArray(args));
  }
};

var Logger = function () {
  function Logger(concreteLogger) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Logger);

    this.init(concreteLogger, options);
  }

  Logger.prototype.init = function init(concreteLogger) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    this.prefix = options.prefix || 'i18next:';
    this.logger = concreteLogger || consoleLogger;
    this.options = options;
    this.debug = options.debug;
  };

  Logger.prototype.setDebug = function setDebug(bool) {
    this.debug = bool;
  };

  Logger.prototype.log = function log() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return this.forward(args, 'log', '', true);
  };

  Logger.prototype.warn = function warn() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return this.forward(args, 'warn', '', true);
  };

  Logger.prototype.error = function error() {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return this.forward(args, 'error', '');
  };

  Logger.prototype.deprecate = function deprecate() {
    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return this.forward(args, 'warn', 'WARNING DEPRECATED: ', true);
  };

  Logger.prototype.forward = function forward(args, lvl, prefix, debugOnly) {
    if (debugOnly && !this.debug) return null;
    if (typeof args[0] === 'string') args[0] = '' + prefix + this.prefix + ' ' + args[0];
    return this.logger[lvl](args);
  };

  Logger.prototype.create = function create(moduleName) {
    return new Logger(this.logger, _extends({ prefix: this.prefix + ':' + moduleName + ':' }, this.options));
  };

  return Logger;
}();

var baseLogger = new Logger();

var EventEmitter = function () {
  function EventEmitter() {
    classCallCheck(this, EventEmitter);

    this.observers = {};
  }

  EventEmitter.prototype.on = function on(events, listener) {
    var _this = this;

    events.split(' ').forEach(function (event) {
      _this.observers[event] = _this.observers[event] || [];
      _this.observers[event].push(listener);
    });
  };

  EventEmitter.prototype.off = function off(event, listener) {
    var _this2 = this;

    if (!this.observers[event]) {
      return;
    }

    this.observers[event].forEach(function () {
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
      var cloned = [].concat(this.observers[event]);
      cloned.forEach(function (observer) {
        observer.apply(undefined, args);
      });
    }

    if (this.observers['*']) {
      var _cloned = [].concat(this.observers['*']);
      _cloned.forEach(function (observer) {
        var _ref;

        observer.apply(observer, (_ref = [event]).concat.apply(_ref, args));
      });
    }
  };

  return EventEmitter;
}();

function makeString(object) {
  if (object == null) return '';
  /* eslint prefer-template: 0 */
  return '' + object;
}

function copy(a, s, t) {
  a.forEach(function (m) {
    if (s[m]) t[m] = s[m];
  });
}

function getLastOfPath(object, path, Empty) {
  function cleanKey(key) {
    return key && key.indexOf('###') > -1 ? key.replace(/###/g, '.') : key;
  }

  function canNotTraverseDeeper() {
    return !object || typeof object === 'string';
  }

  var stack = typeof path !== 'string' ? [].concat(path) : path.split('.');
  while (stack.length > 1) {
    if (canNotTraverseDeeper()) return {};

    var key = cleanKey(stack.shift());
    if (!object[key] && Empty) object[key] = new Empty();
    object = object[key];
  }

  if (canNotTraverseDeeper()) return {};
  return {
    obj: object,
    k: cleanKey(stack.shift())
  };
}

function setPath(object, path, newValue) {
  var _getLastOfPath = getLastOfPath(object, path, Object),
      obj = _getLastOfPath.obj,
      k = _getLastOfPath.k;

  obj[k] = newValue;
}

function pushPath(object, path, newValue, concat) {
  var _getLastOfPath2 = getLastOfPath(object, path, Object),
      obj = _getLastOfPath2.obj,
      k = _getLastOfPath2.k;

  obj[k] = obj[k] || [];
  if (concat) obj[k] = obj[k].concat(newValue);
  if (!concat) obj[k].push(newValue);
}

function getPath(object, path) {
  var _getLastOfPath3 = getLastOfPath(object, path),
      obj = _getLastOfPath3.obj,
      k = _getLastOfPath3.k;

  if (!obj) return undefined;
  return obj[k];
}

function deepExtend(target, source, overwrite) {
  /* eslint no-restricted-syntax: 0 */
  for (var prop in source) {
    if (prop in target) {
      // If we reached a leaf string in target or source then replace with source or skip depending on the 'overwrite' switch
      if (typeof target[prop] === 'string' || target[prop] instanceof String || typeof source[prop] === 'string' || source[prop] instanceof String) {
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
  /* eslint no-useless-escape: 0 */
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

/* eslint-disable */
var _entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};
/* eslint-enable */

function escape(data) {
  if (typeof data === 'string') {
    return data.replace(/[&<>"'\/]/g, function (s) {
      return _entityMap[s];
    });
  }

  return data;
}

var ResourceStore = function (_EventEmitter) {
  inherits(ResourceStore, _EventEmitter);

  function ResourceStore() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { ns: ['translation'], defaultNS: 'translation' };
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
    if (keySeparator === undefined) keySeparator = '.';

    var path = [lng, ns];
    if (key && typeof key !== 'string') path = path.concat(key);
    if (key && typeof key === 'string') path = path.concat(keySeparator ? key.split(keySeparator) : key);

    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
    }

    return getPath(this.data, path);
  };

  ResourceStore.prototype.addResource = function addResource(lng, ns, key, value) {
    var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : { silent: false };

    var keySeparator = this.options.keySeparator;
    if (keySeparator === undefined) keySeparator = '.';

    var path = [lng, ns];
    if (key) path = path.concat(keySeparator ? key.split(keySeparator) : key);

    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
      value = ns;
      ns = path[1];
    }

    this.addNamespaces(ns);

    setPath(this.data, path, value);

    if (!options.silent) this.emit('added', lng, ns, key, value);
  };

  ResourceStore.prototype.addResources = function addResources(lng, ns, resources) {
    /* eslint no-restricted-syntax: 0 */
    for (var m in resources) {
      if (typeof resources[m] === 'string') this.addResource(lng, ns, m, resources[m], { silent: true });
    }
    this.emit('added', lng, ns, resources);
  };

  ResourceStore.prototype.addResourceBundle = function addResourceBundle(lng, ns, resources, deep, overwrite) {
    var path = [lng, ns];
    if (lng.indexOf('.') > -1) {
      path = lng.split('.');
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

    this.emit('added', lng, ns, resources);
  };

  ResourceStore.prototype.removeResourceBundle = function removeResourceBundle(lng, ns) {
    if (this.hasResourceBundle(lng, ns)) {
      delete this.data[lng][ns];
    }
    this.removeNamespaces(ns);

    this.emit('removed', lng, ns);
  };

  ResourceStore.prototype.hasResourceBundle = function hasResourceBundle(lng, ns) {
    return this.getResource(lng, ns) !== undefined;
  };

  ResourceStore.prototype.getResourceBundle = function getResourceBundle(lng, ns) {
    if (!ns) ns = this.options.defaultNS;

    // COMPATIBILITY: remove extend in v2.1.0
    if (this.options.compatibilityAPI === 'v1') return _extends({}, this.getResource(lng, ns));

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

    processors.forEach(function (processor) {
      if (_this.processors[processor]) value = _this.processors[processor].process(value, key, options, translator);
    });

    return value;
  }
};

/* eslint no-param-reassign: 0 */
function convertInterpolation(options) {

  options.interpolation = {
    unescapeSuffix: 'HTML'
  };

  options.interpolation.prefix = options.interpolationPrefix || '__';
  options.interpolation.suffix = options.interpolationSuffix || '__';
  options.interpolation.escapeValue = options.escapeInterpolation || false;

  options.interpolation.nestingPrefix = options.reusePrefix || '$t(';
  options.interpolation.nestingSuffix = options.reuseSuffix || ')';

  return options;
}

function convertAPIOptions(options) {
  if (options.resStore) options.resources = options.resStore;

  if (options.ns && options.ns.defaultNs) {
    options.defaultNS = options.ns.defaultNs;
    options.ns = options.ns.namespaces;
  } else {
    options.defaultNS = options.ns || 'translation';
  }

  if (options.fallbackToDefaultNS && options.defaultNS) options.fallbackNS = options.defaultNS;

  options.saveMissing = options.sendMissing;
  options.saveMissingTo = options.sendMissingTo || 'current';
  options.returnNull = !options.fallbackOnNull;
  options.returnEmptyString = !options.fallbackOnEmpty;
  options.returnObjects = options.returnObjectTrees;
  options.joinArrays = '\n';

  options.returnedObjectHandler = options.objectTreeKeyHandler;
  options.parseMissingKeyHandler = options.parseMissingKey;
  options.appendNamespaceToMissingKey = true;

  options.nsSeparator = options.nsseparator || ':';
  options.keySeparator = options.keyseparator || '.';

  if (options.shortcutFunction === 'sprintf') {
    options.overloadTranslationOptionHandler = function handle(args) {
      var values = [];

      for (var i = 1; i < args.length; i++) {
        values.push(args[i]);
      }

      return {
        postProcess: 'sprintf',
        sprintf: values
      };
    };
  }

  options.whitelist = options.lngWhitelist;
  options.preload = options.preload;
  if (options.load === 'current') options.load = 'currentOnly';
  if (options.load === 'unspecific') options.load = 'languageOnly';

  // backend
  options.backend = options.backend || {};
  options.backend.loadPath = options.resGetPath || 'locales/__lng__/__ns__.json';
  options.backend.addPath = options.resPostPath || 'locales/add/__lng__/__ns__';
  options.backend.allowMultiLoading = options.dynamicLoad;

  // cache
  options.cache = options.cache || {};
  options.cache.prefix = 'res_';
  options.cache.expirationTime = 7 * 24 * 60 * 60 * 1000;
  options.cache.enabled = options.useLocalStorage;

  options = convertInterpolation(options);
  if (options.defaultVariables) options.interpolation.defaultVariables = options.defaultVariables;

  // COMPATIBILITY: deprecation
  // if (options.getAsync === false) throw deprecation error

  return options;
}

function convertJSONOptions(options) {
  options = convertInterpolation(options);
  options.joinArrays = '\n';

  return options;
}

function convertTOptions(options) {
  if (options.interpolationPrefix || options.interpolationSuffix || options.escapeInterpolation !== undefined) {
    options = convertInterpolation(options);
  }

  options.nsSeparator = options.nsseparator;
  options.keySeparator = options.keyseparator;

  options.returnObjects = options.returnObjectTrees;

  return options;
}

function appendBackwardsAPI(i18n) {
  i18n.lng = function () {
    baseLogger.deprecate('i18next.lng() can be replaced by i18next.language for detected language or i18next.languages for languages ordered by translation lookup.');
    return i18n.services.languageUtils.toResolveHierarchy(i18n.language)[0];
  };

  i18n.preload = function (lngs, cb) {
    baseLogger.deprecate('i18next.preload() can be replaced with i18next.loadLanguages()');
    i18n.loadLanguages(lngs, cb);
  };

  i18n.setLng = function (lng, options, callback) {
    baseLogger.deprecate('i18next.setLng() can be replaced with i18next.changeLanguage() or i18next.getFixedT() to get a translation function with fixed language or namespace.');
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (!options) options = {};

    if (options.fixLng === true) {
      if (callback) return callback(null, i18n.getFixedT(lng));
    }

    return i18n.changeLanguage(lng, callback);
  };

  i18n.addPostProcessor = function (name, fc) {
    baseLogger.deprecate('i18next.addPostProcessor() can be replaced by i18next.use({ type: \'postProcessor\', name: \'name\', process: fc })');
    i18n.use({
      type: 'postProcessor',
      name: name,
      process: fc
    });
  };
}

var Translator = function (_EventEmitter) {
  inherits(Translator, _EventEmitter);

  function Translator(services) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, Translator);

    var _this = possibleConstructorReturn(this, _EventEmitter.call(this));

    copy(['resourceStore', 'languageUtils', 'pluralResolver', 'interpolator', 'backendConnector'], services, _this);

    _this.options = options;
    _this.logger = baseLogger.create('translator');
    return _this;
  }

  Translator.prototype.changeLanguage = function changeLanguage(lng) {
    if (lng) this.language = lng;
  };

  Translator.prototype.exists = function exists(key) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { interpolation: {} };

    if (this.options.compatibilityAPI === 'v1') {
      options = convertTOptions(options);
    }

    return this.resolve(key, options) !== undefined;
  };

  Translator.prototype.extractFromKey = function extractFromKey(key, options) {
    var nsSeparator = options.nsSeparator || this.options.nsSeparator;
    if (nsSeparator === undefined) nsSeparator = ':';
    var keySeparator = options.keySeparator || this.options.keySeparator || '.';

    var namespaces = options.ns || this.options.defaultNS;
    if (nsSeparator && key.indexOf(nsSeparator) > -1) {
      var parts = key.split(nsSeparator);
      if (nsSeparator !== keySeparator || nsSeparator === keySeparator && this.options.ns.indexOf(parts[0]) > -1) namespaces = parts.shift();
      key = parts.join(keySeparator);
    }
    if (typeof namespaces === 'string') namespaces = [namespaces];

    return {
      key: key,
      namespaces: namespaces
    };
  };

  Translator.prototype.translate = function translate(keys) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
      /* eslint prefer-rest-params: 0 */
      options = this.options.overloadTranslationOptionHandler(arguments);
    } else if (this.options.compatibilityAPI === 'v1') {
      options = convertTOptions(options);
    }

    // non valid keys handling
    if (keys === undefined || keys === null || keys === '') return '';
    if (typeof keys === 'number') keys = String(keys);
    if (typeof keys === 'string') keys = [keys];

    // separators
    var keySeparator = options.keySeparator || this.options.keySeparator || '.';

    // get namespace(s)

    var _extractFromKey = this.extractFromKey(keys[keys.length - 1], options),
        key = _extractFromKey.key,
        namespaces = _extractFromKey.namespaces;

    var namespace = namespaces[namespaces.length - 1];

    // return key on CIMode
    var lng = options.lng || this.language;
    var appendNamespaceToCIMode = options.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if (lng && lng.toLowerCase() === 'cimode') {
      if (appendNamespaceToCIMode) {
        var nsSeparator = options.nsSeparator || this.options.nsSeparator;
        return namespace + nsSeparator + key;
      }

      return key;
    }

    // resolve from store
    var res = this.resolve(keys, options);

    var resType = Object.prototype.toString.apply(res);
    var noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
    var joinArrays = options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;

    // object
    if (res && typeof res !== 'string' && noObject.indexOf(resType) < 0 && !(joinArrays && resType === '[object Array]')) {
      if (!options.returnObjects && !this.options.returnObjects) {
        this.logger.warn('accessing an object - but returnObjects options is not enabled!');
        return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(key, res, options) : 'key \'' + key + ' (' + this.language + ')\' returned an object instead of string.';
      }

      // if we got a separator we loop over children - else we just return object as is
      // as having it set to false means no hierarchy so no lookup for nested values
      if (options.keySeparator || this.options.keySeparator) {
        var copy$$1 = resType === '[object Array]' ? [] : {}; // apply child translation on a copy

        /* eslint no-restricted-syntax: 0 */
        for (var m in res) {
          if (Object.prototype.hasOwnProperty.call(res, m)) {
            copy$$1[m] = this.translate('' + key + keySeparator + m, _extends({}, options, { joinArrays: false, ns: namespaces }));
          }
        }
        res = copy$$1;
      }
    } else if (joinArrays && resType === '[object Array]') {
      // array special treatment
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, key, options);
    } else {
      // string, empty or null
      var usedDefault = false;
      var usedKey = false;

      // fallback value
      if (!this.isValidLookup(res) && options.defaultValue !== undefined) {
        usedDefault = true;
        res = options.defaultValue;
      }
      if (!this.isValidLookup(res)) {
        usedKey = true;
        res = key;
      }

      // save missing
      if (usedKey || usedDefault) {
        this.logger.log('missingKey', lng, namespace, key, res);

        var lngs = [];
        var fallbackLngs = this.languageUtils.getFallbackCodes(this.options.fallbackLng, options.lng || this.language);
        if (this.options.saveMissingTo === 'fallback' && fallbackLngs && fallbackLngs[0]) {
          for (var i = 0; i < fallbackLngs.length; i++) {
            lngs.push(fallbackLngs[i]);
          }
        } else if (this.options.saveMissingTo === 'all') {
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

        this.emit('missingKey', lngs, namespace, key, res);
      }

      // extend
      res = this.extendTranslation(res, key, options);

      // append namespace if still key
      if (usedKey && res === key && this.options.appendNamespaceToMissingKey) res = namespace + ':' + key;

      // parseMissingKeyHandler
      if (usedKey && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(res);
    }

    // return
    return res;
  };

  Translator.prototype.extendTranslation = function extendTranslation(res, key, options) {
    var _this2 = this;

    if (options.interpolation) this.interpolator.init(_extends({}, options, { interpolation: _extends({}, this.options.interpolation, options.interpolation) }));

    // interpolate
    var data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
    if (this.options.interpolation.defaultVariables) data = _extends({}, this.options.interpolation.defaultVariables, data);
    res = this.interpolator.interpolate(res, data, options.lng || this.language);

    // nesting
    if (options.nest !== false) res = this.interpolator.nest(res, function () {
      return _this2.translate.apply(_this2, arguments);
    }, options);

    if (options.interpolation) this.interpolator.reset();

    // post process
    var postProcess = options.postProcess || this.options.postProcess;
    var postProcessorNames = typeof postProcess === 'string' ? [postProcess] : postProcess;

    if (res !== undefined && postProcessorNames && postProcessorNames.length && options.applyPostProcessor !== false) {
      res = postProcessor.handle(postProcessorNames, res, key, options, this);
    }

    return res;
  };

  Translator.prototype.resolve = function resolve(keys) {
    var _this3 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var found = void 0;

    if (typeof keys === 'string') keys = [keys];

    // forEach possible key
    keys.forEach(function (k) {
      if (_this3.isValidLookup(found)) return;

      var extracted = _this3.extractFromKey(k, options);
      var key = extracted.key;
      var namespaces = extracted.namespaces;
      if (_this3.options.fallbackNS) namespaces = namespaces.concat(_this3.options.fallbackNS);

      var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
      var needsContextHandling = options.context !== undefined && typeof options.context === 'string' && options.context !== '';

      var codes = options.lngs ? options.lngs : _this3.languageUtils.toResolveHierarchy(options.lng || _this3.language);

      namespaces.forEach(function (ns) {
        if (_this3.isValidLookup(found)) return;

        codes.forEach(function (code) {
          if (_this3.isValidLookup(found)) return;

          var finalKey = key;
          var finalKeys = [finalKey];

          var pluralSuffix = void 0;
          if (needsPluralHandling) pluralSuffix = _this3.pluralResolver.getSuffix(code, options.count);

          // fallback for plural if context not found
          if (needsPluralHandling && needsContextHandling) finalKeys.push(finalKey + pluralSuffix);

          // get key for context if needed
          if (needsContextHandling) finalKeys.push(finalKey += '' + _this3.options.contextSeparator + options.context);

          // get key for plural if needed
          if (needsPluralHandling) finalKeys.push(finalKey += pluralSuffix);

          // iterate over finalKeys starting with most specific pluralkey (-> contextkey only) -> singularkey only
          var possibleKey = void 0;
          /* eslint no-cond-assign: 0 */
          while (possibleKey = finalKeys.pop()) {
            if (!_this3.isValidLookup(found)) {
              found = _this3.getResource(code, ns, possibleKey, options);
            }
          }
        });
      });
    });

    return found;
  };

  Translator.prototype.isValidLookup = function isValidLookup(res) {
    return res !== undefined && !(!this.options.returnNull && res === null) && !(!this.options.returnEmptyString && res === '');
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

var LanguageUtil = function () {
  function LanguageUtil(options) {
    classCallCheck(this, LanguageUtil);

    this.options = options;

    this.whitelist = this.options.whitelist || false;
    this.logger = baseLogger.create('languageUtils');
  }

  LanguageUtil.prototype.getScriptPartFromCode = function getScriptPartFromCode(code) {
    if (!code || code.indexOf('-') < 0) return null;

    var p = code.split('-');
    if (p.length === 2) return null;
    p.pop();
    return this.formatLanguageCode(p.join('-'));
  };

  LanguageUtil.prototype.getLanguagePartFromCode = function getLanguagePartFromCode(code) {
    if (!code || code.indexOf('-') < 0) return code;

    var p = code.split('-');
    return this.formatLanguageCode(p[0]);
  };

  LanguageUtil.prototype.formatLanguageCode = function formatLanguageCode(code) {
    // http://www.iana.org/assignments/language-tags/language-tags.xhtml
    if (typeof code === 'string' && code.indexOf('-') > -1) {
      var specialCases = ['hans', 'hant', 'latn', 'cyrl', 'cans', 'mong', 'arab'];
      var p = code.split('-');

      if (this.options.lowerCaseLng) {
        p = p.map(function (part) {
          return part.toLowerCase();
        });
      } else if (p.length === 2) {
        p[0] = p[0].toLowerCase();
        p[1] = p[1].toUpperCase();

        if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
      } else if (p.length === 3) {
        p[0] = p[0].toLowerCase();

        // if lenght 2 guess it's a country
        if (p[1].length === 2) p[1] = p[1].toUpperCase();
        if (p[0] !== 'sgn' && p[2].length === 2) p[2] = p[2].toUpperCase();

        if (specialCases.indexOf(p[1].toLowerCase()) > -1) p[1] = capitalize(p[1].toLowerCase());
        if (specialCases.indexOf(p[2].toLowerCase()) > -1) p[2] = capitalize(p[2].toLowerCase());
      }

      return p.join('-');
    }

    return this.options.cleanCode || this.options.lowerCaseLng ? code.toLowerCase() : code;
  };

  LanguageUtil.prototype.isWhitelisted = function isWhitelisted(code) {
    if (this.options.load === 'languageOnly' || this.options.nonExplicitWhitelist) {
      code = this.getLanguagePartFromCode(code);
    }
    return !this.whitelist || !this.whitelist.length || this.whitelist.indexOf(code) > -1;
  };

  LanguageUtil.prototype.getFallbackCodes = function getFallbackCodes(fallbacks, code) {
    if (!fallbacks) return [];
    if (typeof fallbacks === 'string') fallbacks = [fallbacks];
    if (Object.prototype.toString.apply(fallbacks) === '[object Array]') return fallbacks;

    if (!code) return fallbacks.default || [];

    // asume we have an object defining fallbacks
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
    var addCode = function addCode(c) {
      if (!c) return;
      if (_this.isWhitelisted(c)) {
        codes.push(c);
      } else {
        _this.logger.warn('rejecting non-whitelisted language code: ' + c);
      }
    };

    if (typeof code === 'string' && code.indexOf('-') > -1) {
      if (this.options.load !== 'languageOnly') addCode(this.formatLanguageCode(code));
      if (this.options.load !== 'languageOnly' && this.options.load !== 'currentOnly') addCode(this.getScriptPartFromCode(code));
      if (this.options.load !== 'currentOnly') addCode(this.getLanguagePartFromCode(code));
    } else if (typeof code === 'string') {
      addCode(this.formatLanguageCode(code));
    }

    fallbackCodes.forEach(function (fc) {
      if (codes.indexOf(fc) < 0) addCode(_this.formatLanguageCode(fc));
    });

    return codes;
  };

  return LanguageUtil;
}();

// definition http://translate.sourceforge.net/wiki/l10n/pluralforms
/* eslint-disable */
var sets = [{ lngs: ['ach', 'ak', 'am', 'arn', 'br', 'fil', 'gun', 'ln', 'mfe', 'mg', 'mi', 'oc', 'tg', 'ti', 'tr', 'uz', 'wa'], nr: [1, 2], fc: 1 }, { lngs: ['af', 'an', 'ast', 'az', 'bg', 'bn', 'ca', 'da', 'de', 'dev', 'el', 'en', 'eo', 'es', 'es_ar', 'et', 'eu', 'fi', 'fo', 'fur', 'fy', 'gl', 'gu', 'ha', 'he', 'hi', 'hu', 'hy', 'ia', 'it', 'kn', 'ku', 'lb', 'mai', 'ml', 'mn', 'mr', 'nah', 'nap', 'nb', 'ne', 'nl', 'nn', 'no', 'nso', 'pa', 'pap', 'pms', 'ps', 'pt', 'pt_br', 'rm', 'sco', 'se', 'si', 'so', 'son', 'sq', 'sv', 'sw', 'ta', 'te', 'tk', 'ur', 'yo'], nr: [1, 2], fc: 2 }, { lngs: ['ay', 'bo', 'cgg', 'fa', 'id', 'ja', 'jbo', 'ka', 'kk', 'km', 'ko', 'ky', 'lo', 'ms', 'sah', 'su', 'th', 'tt', 'ug', 'vi', 'wo', 'zh'], nr: [1], fc: 3 }, { lngs: ['be', 'bs', 'dz', 'hr', 'ru', 'sr', 'uk'], nr: [1, 2, 5], fc: 4 }, { lngs: ['ar'], nr: [0, 1, 2, 3, 11, 100], fc: 5 }, { lngs: ['cs', 'sk'], nr: [1, 2, 5], fc: 6 }, { lngs: ['csb', 'pl'], nr: [1, 2, 5], fc: 7 }, { lngs: ['cy'], nr: [1, 2, 3, 8], fc: 8 }, { lngs: ['fr'], nr: [1, 2], fc: 9 }, { lngs: ['ga'], nr: [1, 2, 3, 7, 11], fc: 10 }, { lngs: ['gd'], nr: [1, 2, 3, 20], fc: 11 }, { lngs: ['is'], nr: [1, 2], fc: 12 }, { lngs: ['jv'], nr: [0, 1], fc: 13 }, { lngs: ['kw'], nr: [1, 2, 3, 4], fc: 14 }, { lngs: ['lt'], nr: [1, 2, 10], fc: 15 }, { lngs: ['lv'], nr: [1, 2, 0], fc: 16 }, { lngs: ['mk'], nr: [1, 2], fc: 17 }, { lngs: ['mnk'], nr: [0, 1, 2], fc: 18 }, { lngs: ['mt'], nr: [1, 2, 11, 20], fc: 19 }, { lngs: ['or'], nr: [2, 1], fc: 2 }, { lngs: ['ro'], nr: [1, 2, 20], fc: 20 }, { lngs: ['sl'], nr: [5, 1, 2, 3], fc: 21 }];

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
/* eslint-enable */

function createRules() {
  var rules = {};
  sets.forEach(function (set$$1) {
    set$$1.lngs.forEach(function (l) {
      rules[l] = {
        numbers: set$$1.nr,
        plurals: _rulesPluralsTypes[set$$1.fc]
      };
    });
  });
  return rules;
}

var PluralResolver = function () {
  function PluralResolver(languageUtils) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    classCallCheck(this, PluralResolver);

    this.languageUtils = languageUtils;
    this.options = options;

    this.logger = baseLogger.create('pluralResolver');

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

    return rule && rule.numbers.length > 1;
  };

  PluralResolver.prototype.getSuffix = function getSuffix(code, count) {
    var _this = this;

    var rule = this.getRule(code);

    if (rule) {
      if (rule.numbers.length === 1) return ''; // only singular

      var idx = rule.noAbs ? rule.plurals(count) : rule.plurals(Math.abs(count));
      var suffix = rule.numbers[idx];

      // special treatment for lngs only having singular and plural
      if (this.options.simplifyPluralSuffix && rule.numbers.length === 2 && rule.numbers[0] === 1) {
        if (suffix === 2) {
          suffix = 'plural';
        } else if (suffix === 1) {
          suffix = '';
        }
      }

      var returnSuffix = function returnSuffix() {
        return _this.options.prepend && suffix.toString() ? _this.options.prepend + suffix.toString() : suffix.toString();
      };

      // COMPATIBILITY JSON
      // v1
      if (this.options.compatibilityJSON === 'v1') {
        if (suffix === 1) return '';
        if (typeof suffix === 'number') return '_plural_' + suffix.toString();
        return returnSuffix();
      } else if ( /* v2 */this.options.compatibilityJSON === 'v2' || rule.numbers.length === 2 && rule.numbers[0] === 1) {
        return returnSuffix();
      } else if ( /* v3 - gettext index */rule.numbers.length === 2 && rule.numbers[0] === 1) {
        return returnSuffix();
      }
      return this.options.prepend && idx.toString() ? this.options.prepend + idx.toString() : idx.toString();
    }

    this.logger.warn('no plural rule found for: ' + code);
    return '';
  };

  return PluralResolver;
}();

var Interpolator = function () {
  function Interpolator() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    classCallCheck(this, Interpolator);

    this.logger = baseLogger.create('interpolator');

    this.init(options, true);
  }

  /* eslint no-param-reassign: 0 */


  Interpolator.prototype.init = function init() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var reset = arguments[1];

    if (reset) {
      this.options = options;
      this.format = options.interpolation && options.interpolation.format || function (value) {
        return value;
      };
      this.escape = options.interpolation && options.interpolation.escape || escape;
    }
    if (!options.interpolation) options.interpolation = { escapeValue: true };

    var iOpts = options.interpolation;

    this.escapeValue = iOpts.escapeValue !== undefined ? iOpts.escapeValue : true;

    this.prefix = iOpts.prefix ? regexEscape(iOpts.prefix) : iOpts.prefixEscaped || '{{';
    this.suffix = iOpts.suffix ? regexEscape(iOpts.suffix) : iOpts.suffixEscaped || '}}';

    this.formatSeparator = iOpts.formatSeparator ? iOpts.formatSeparator : iOpts.formatSeparator || ',';

    this.unescapePrefix = iOpts.unescapeSuffix ? '' : iOpts.unescapePrefix || '-';
    this.unescapeSuffix = this.unescapePrefix ? '' : iOpts.unescapeSuffix || '';

    this.nestingPrefix = iOpts.nestingPrefix ? regexEscape(iOpts.nestingPrefix) : iOpts.nestingPrefixEscaped || regexEscape('$t(');
    this.nestingSuffix = iOpts.nestingSuffix ? regexEscape(iOpts.nestingSuffix) : iOpts.nestingSuffixEscaped || regexEscape(')');

    // the regexp
    this.resetRegExp();
  };

  Interpolator.prototype.reset = function reset() {
    if (this.options) this.init(this.options);
  };

  Interpolator.prototype.resetRegExp = function resetRegExp() {
    // the regexp
    var regexpStr = this.prefix + '(.+?)' + this.suffix;
    this.regexp = new RegExp(regexpStr, 'g');

    var regexpUnescapeStr = '' + this.prefix + this.unescapePrefix + '(.+?)' + this.unescapeSuffix + this.suffix;
    this.regexpUnescape = new RegExp(regexpUnescapeStr, 'g');

    var nestingRegexpStr = this.nestingPrefix + '(.+?)' + this.nestingSuffix;
    this.nestingRegexp = new RegExp(nestingRegexpStr, 'g');
  };

  Interpolator.prototype.interpolate = function interpolate(str, data, lng) {
    var _this = this;

    var match = void 0;
    var value = void 0;

    function regexSafe(val) {
      return val.replace(/\$/g, '$$$$');
    }

    var handleFormat = function handleFormat(key) {
      if (key.indexOf(_this.formatSeparator) < 0) return getPath(data, key);

      var p = key.split(_this.formatSeparator);
      var k = p.shift().trim();
      var f = p.join(_this.formatSeparator).trim();

      return _this.format(getPath(data, k), f, lng);
    };

    this.resetRegExp();

    // unescape if has unescapePrefix/Suffix
    /* eslint no-cond-assign: 0 */
    while (match = this.regexpUnescape.exec(str)) {
      value = handleFormat(match[1].trim());
      str = str.replace(match[0], value);
      this.regexpUnescape.lastIndex = 0;
    }

    // regular escape on demand
    while (match = this.regexp.exec(str)) {
      value = handleFormat(match[1].trim());
      if (typeof value !== 'string') value = makeString(value);
      if (!value) {
        this.logger.warn('missed to pass in variable ' + match[1] + ' for interpolating ' + str);
        value = '';
      }
      value = this.escapeValue ? regexSafe(this.escape(value)) : regexSafe(value);
      str = str.replace(match[0], value);
      this.regexp.lastIndex = 0;
    }
    return str;
  };

  Interpolator.prototype.nest = function nest(str, fc) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var match = void 0;
    var value = void 0;

    var clonedOptions = _extends({}, options);
    clonedOptions.applyPostProcessor = false; // avoid post processing on nested lookup

    // if value is something like "myKey": "lorem $(anotherKey, { "count": {{aValueInOptions}} })"
    function handleHasOptions(key) {
      if (key.indexOf(',') < 0) return key;

      var p = key.split(',');
      key = p.shift();
      var optionsString = p.join(',');
      optionsString = this.interpolate(optionsString, clonedOptions);
      optionsString = optionsString.replace(/'/g, '"');

      try {
        clonedOptions = JSON.parse(optionsString);
      } catch (e) {
        this.logger.error('failed parsing options string in nesting for key ' + key, e);
      }

      return key;
    }

    // regular escape on demand
    while (match = this.nestingRegexp.exec(str)) {
      value = fc(handleHasOptions.call(this, match[1].trim()), clonedOptions);

      // is only the nesting key (key1 = '$(key2)') return the value without stringify
      if (value && match[0] === str && typeof value !== 'string') return value;

      // no string to include or empty
      if (typeof value !== 'string') value = makeString(value);
      if (!value) {
        this.logger.warn('missed to resolve ' + match[1] + ' for nesting ' + str);
        value = '';
      }
      // Nested keys should not be escaped by default #854
      // value = this.escapeValue ? regexSafe(utils.escape(value)) : regexSafe(value);
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

var Connector = function (_EventEmitter) {
  inherits(Connector, _EventEmitter);

  function Connector(backend, store, services) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    classCallCheck(this, Connector);

    var _this = possibleConstructorReturn(this, _EventEmitter.call(this));

    _this.backend = backend;
    _this.store = store;
    _this.services = services;
    _this.options = options;
    _this.logger = baseLogger.create('backendConnector');

    _this.state = {};
    _this.queue = [];

    if (_this.backend && _this.backend.init) {
      _this.backend.init(services, options.backend, options);
    }
    return _this;
  }

  Connector.prototype.queueLoad = function queueLoad(languages, namespaces, callback) {
    var _this2 = this;

    // find what needs to be loaded
    var toLoad = [];
    var pending = [];
    var toLoadLanguages = [];
    var toLoadNamespaces = [];

    languages.forEach(function (lng) {
      var hasAllNamespaces = true;

      namespaces.forEach(function (ns) {
        var name = lng + '|' + ns;

        if (_this2.store.hasResourceBundle(lng, ns)) {
          _this2.state[name] = 2; // loaded
        } else if (_this2.state[name] < 0) {
          // nothing to do for err
        } else if (_this2.state[name] === 1) {
          if (pending.indexOf(name) < 0) pending.push(name);
        } else {
          _this2.state[name] = 1; // pending

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

    var _name$split = name.split('|'),
        _name$split2 = slicedToArray(_name$split, 2),
        lng = _name$split2[0],
        ns = _name$split2[1];

    if (err) this.emit('failedLoading', lng, ns, err);

    if (data) {
      this.store.addResourceBundle(lng, ns, data);
    }

    // set loaded
    this.state[name] = err ? -1 : 2;

    // callback if ready
    this.queue.forEach(function (q) {
      pushPath(q.loaded, [lng], ns);
      remove(q.pending, name);

      if (err) q.errors.push(err);

      if (q.pending.length === 0 && !q.done) {
        _this3.emit('loaded', q.loaded);
        /* eslint no-param-reassign: 0 */
        q.done = true;
        if (q.errors.length) {
          q.callback(q.errors);
        } else {
          q.callback();
        }
      }
    });

    // remove done load requests
    this.queue = this.queue.filter(function (q) {
      return !q.done;
    });
  };

  Connector.prototype.read = function read(lng, ns, fcName) {
    var tried = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

    var _this4 = this;

    var wait = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 250;
    var callback = arguments[5];

    if (!lng.length) return callback(null, {}); // noting to load

    return this.backend[fcName](lng, ns, function (err, data) {
      if (err && data /* = retryFlag */ && tried < 5) {
        setTimeout(function () {
          _this4.read.call(_this4, lng, ns, fcName, tried + 1, wait * 2, callback);
        }, wait);
        return;
      }
      callback(err, data);
    });
  };

  /* eslint consistent-return: 0 */


  Connector.prototype.load = function load(languages, namespaces, callback) {
    var _this5 = this;

    if (!this.backend) {
      this.logger.warn('No backend was added via i18next.use. Will not load resources.');
      return callback && callback();
    }
    var options = _extends({}, this.backend.options, this.options.backend);

    if (typeof languages === 'string') languages = this.services.languageUtils.toResolveHierarchy(languages);
    if (typeof namespaces === 'string') namespaces = [namespaces];

    var toLoad = this.queueLoad(languages, namespaces, callback);
    if (!toLoad.toLoad.length) {
      if (!toLoad.pending.length) callback(); // nothing to load and no pendings...callback now
      return null; // pendings will trigger callback
    }

    // load with multi-load
    if (options.allowMultiLoading && this.backend.readMulti) {
      this.read(toLoad.toLoadLanguages, toLoad.toLoadNamespaces, 'readMulti', null, null, function (err, data) {
        if (err) _this5.logger.warn('loading namespaces ' + toLoad.toLoadNamespaces.join(', ') + ' for languages ' + toLoad.toLoadLanguages.join(', ') + ' via multiloading failed', err);
        if (!err && data) _this5.logger.log('successfully loaded namespaces ' + toLoad.toLoadNamespaces.join(', ') + ' for languages ' + toLoad.toLoadLanguages.join(', ') + ' via multiloading', data);

        toLoad.toLoad.forEach(function (name) {
          var _name$split3 = name.split('|'),
              _name$split4 = slicedToArray(_name$split3, 2),
              l = _name$split4[0],
              n = _name$split4[1];

          var bundle = getPath(data, [l, n]);
          if (bundle) {
            _this5.loaded(name, err, bundle);
          } else {
            var error = 'loading namespace ' + n + ' for language ' + l + ' via multiloading failed';
            _this5.loaded(name, error);
            _this5.logger.error(error);
          }
        });
      });
    } else {
      toLoad.toLoad.forEach(function (name) {
        _this5.loadOne(name);
      });
    }
  };

  Connector.prototype.reload = function reload(languages, namespaces) {
    var _this6 = this;

    if (!this.backend) {
      this.logger.warn('No backend was added via i18next.use. Will not load resources.');
    }
    var options = _extends({}, this.backend.options, this.options.backend);

    if (typeof languages === 'string') languages = this.services.languageUtils.toResolveHierarchy(languages);
    if (typeof namespaces === 'string') namespaces = [namespaces];

    // load with multi-load
    if (options.allowMultiLoading && this.backend.readMulti) {
      this.read(languages, namespaces, 'readMulti', null, null, function (err, data) {
        if (err) _this6.logger.warn('reloading namespaces ' + namespaces.join(', ') + ' for languages ' + languages.join(', ') + ' via multiloading failed', err);
        if (!err && data) _this6.logger.log('successfully reloaded namespaces ' + namespaces.join(', ') + ' for languages ' + languages.join(', ') + ' via multiloading', data);

        languages.forEach(function (l) {
          namespaces.forEach(function (n) {
            var bundle = getPath(data, [l, n]);
            if (bundle) {
              _this6.loaded(l + '|' + n, err, bundle);
            } else {
              var error = 'reloading namespace ' + n + ' for language ' + l + ' via multiloading failed';
              _this6.loaded(l + '|' + n, error);
              _this6.logger.error(error);
            }
          });
        });
      });
    } else {
      languages.forEach(function (l) {
        namespaces.forEach(function (n) {
          _this6.loadOne(l + '|' + n, 're');
        });
      });
    }
  };

  Connector.prototype.loadOne = function loadOne(name) {
    var _this7 = this;

    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    var _name$split5 = name.split('|'),
        _name$split6 = slicedToArray(_name$split5, 2),
        lng = _name$split6[0],
        ns = _name$split6[1];

    this.read(lng, ns, 'read', null, null, function (err, data) {
      if (err) _this7.logger.warn(prefix + 'loading namespace ' + ns + ' for language ' + lng + ' failed', err);
      if (!err && data) _this7.logger.log(prefix + 'loaded namespace ' + ns + ' for language ' + lng, data);

      _this7.loaded(name, err, data);
    });
  };

  Connector.prototype.saveMissing = function saveMissing(languages, namespace, key, fallbackValue) {
    if (this.backend && this.backend.create) this.backend.create(languages, namespace, key, fallbackValue);

    // write to store to avoid resending
    if (!languages || !languages[0]) return;
    this.store.addResource(languages[0], namespace, key, fallbackValue);
  };

  return Connector;
}(EventEmitter);

var Connector$1 = function (_EventEmitter) {
  inherits(Connector, _EventEmitter);

  function Connector(cache, store, services) {
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    classCallCheck(this, Connector);

    var _this = possibleConstructorReturn(this, _EventEmitter.call(this));

    _this.cache = cache;
    _this.store = store;
    _this.services = services;
    _this.options = options;
    _this.logger = baseLogger.create('cacheConnector');

    if (_this.cache && _this.cache.init) _this.cache.init(services, options.cache, options);
    return _this;
  }

  /* eslint consistent-return: 0 */


  Connector.prototype.load = function load(languages, namespaces, callback) {
    var _this2 = this;

    if (!this.cache) return callback && callback();
    var options = _extends({}, this.cache.options, this.options.cache);

    var loadLngs = typeof languages === 'string' ? this.services.languageUtils.toResolveHierarchy(languages) : languages;

    if (options.enabled) {
      this.cache.load(loadLngs, function (err, data) {
        if (err) _this2.logger.error('loading languages ' + loadLngs.join(', ') + ' from cache failed', err);
        if (data) {
          /* eslint no-restricted-syntax: 0 */
          for (var l in data) {
            if (Object.prototype.hasOwnProperty.call(data, l)) {
              for (var n in data[l]) {
                if (Object.prototype.hasOwnProperty.call(data[l], n)) {
                  if (n !== 'i18nStamp') {
                    var bundle = data[l][n];
                    if (bundle) _this2.store.addResourceBundle(l, n, bundle);
                  }
                }
              }
            }
          }
        }
        if (callback) callback();
      });
    } else if (callback) {
      callback();
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

    ns: ['translation'],
    defaultNS: ['translation'],
    fallbackLng: ['dev'],
    fallbackNS: false, // string or array of namespaces

    whitelist: false, // array with whitelisted languages
    nonExplicitWhitelist: false,
    load: 'all', // | currentOnly | languageOnly
    preload: false, // array with preload languages

    simplifyPluralSuffix: true,
    keySeparator: '.',
    nsSeparator: ':',
    pluralSeparator: '_',
    contextSeparator: '_',

    saveMissing: false, // enable to send missing values
    saveMissingTo: 'fallback', // 'current' || 'all'
    missingKeyHandler: false, // function(lng, ns, key, fallbackValue) -> override if prefer on handling

    postProcess: false, // string or array of postProcessor names
    returnNull: true, // allows null value as valid translation
    returnEmptyString: true, // allows empty string value as valid translation
    returnObjects: false,
    joinArrays: false, // or string to join array
    returnedObjectHandler: function returnedObjectHandler() {}, // function(key, value, options) triggered if key returns object but returnObjects is set to false
    parseMissingKeyHandler: false, // function(key) parsed a key that was not found in t() before returning
    appendNamespaceToMissingKey: false,
    appendNamespaceToCIMode: false,
    overloadTranslationOptionHandler: function handle(args) {
      return { defaultValue: args[1] };
    },

    interpolation: {
      escapeValue: true,
      format: function format(value, _format, lng) {
        return value;
      },
      prefix: '{{',
      suffix: '}}',
      formatSeparator: ',',
      // prefixEscaped: '{{',
      // suffixEscaped: '}}',
      // unescapeSuffix: '',
      unescapePrefix: '-',

      nestingPrefix: '$t(',
      nestingSuffix: ')',
      // nestingPrefixEscaped: '$t(',
      // nestingSuffixEscaped: ')',
      defaultVariables: undefined // object that can have values to interpolate on - extends passed in interpolation data
    }
  };
}

/* eslint no-param-reassign: 0 */
function transformOptions(options) {
  // create namespace object if namespace is passed in as string
  if (typeof options.ns === 'string') options.ns = [options.ns];
  if (typeof options.fallbackLng === 'string') options.fallbackLng = [options.fallbackLng];
  if (typeof options.fallbackNS === 'string') options.fallbackNS = [options.fallbackNS];

  // extend whitelist with cimode
  if (options.whitelist && options.whitelist.indexOf('cimode') < 0) options.whitelist.push('cimode');

  return options;
}

function noop() {}

var I18n = function (_EventEmitter) {
  inherits(I18n, _EventEmitter);

  function I18n() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments[1];
    classCallCheck(this, I18n);

    var _this = possibleConstructorReturn(this, _EventEmitter.call(this));

    _this.options = transformOptions(options);
    _this.services = {};
    _this.logger = baseLogger;
    _this.modules = { external: [] };

    if (callback && !_this.isInitialized && !options.isClone) {
      var _ret;

      // https://github.com/i18next/i18next/issues/879
      if (!_this.options.initImmediate) return _ret = _this.init(options, callback), possibleConstructorReturn(_this, _ret);
      setTimeout(function () {
        _this.init(options, callback);
      }, 0);
    }
    return _this;
  }

  I18n.prototype.init = function init(options, callback) {
    var _this2 = this;

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    if (!options) options = {};

    if (options.compatibilityAPI === 'v1') {
      this.options = _extends({}, get$1(), transformOptions(convertAPIOptions(options)), {});
    } else if (options.compatibilityJSON === 'v1') {
      this.options = _extends({}, get$1(), transformOptions(convertJSONOptions(options)), {});
    } else {
      this.options = _extends({}, get$1(), this.options, transformOptions(options));
    }
    this.format = this.options.interpolation.format;
    if (!callback) callback = noop;

    function createClassOnDemand(ClassOrObject) {
      if (!ClassOrObject) return null;
      if (typeof ClassOrObject === 'function') return new ClassOrObject();
      return ClassOrObject;
    }

    // init services
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
      s.resourceStore.on('added removed', function (lng, ns) {
        s.cacheConnector.save();
      });
      s.languageUtils = lu;
      s.pluralResolver = new PluralResolver(lu, { prepend: this.options.pluralSeparator, compatibilityJSON: this.options.compatibilityJSON, simplifyPluralSuffix: this.options.simplifyPluralSuffix });
      s.interpolator = new Interpolator(this.options);

      s.backendConnector = new Connector(createClassOnDemand(this.modules.backend), s.resourceStore, s, this.options);
      // pipe events from backendConnector
      s.backendConnector.on('*', function (event) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        _this2.emit.apply(_this2, [event].concat(args));
      });

      s.backendConnector.on('loaded', function (loaded) {
        s.cacheConnector.save();
      });

      s.cacheConnector = new Connector$1(createClassOnDemand(this.modules.cache), s.resourceStore, s, this.options);
      // pipe events from backendConnector
      s.cacheConnector.on('*', function (event) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        _this2.emit.apply(_this2, [event].concat(args));
      });

      if (this.modules.languageDetector) {
        s.languageDetector = createClassOnDemand(this.modules.languageDetector);
        s.languageDetector.init(s, this.options.detection, this.options);
      }

      this.translator = new Translator(this.services, this.options);
      // pipe events from translator
      this.translator.on('*', function (event) {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        _this2.emit.apply(_this2, [event].concat(args));
      });

      this.modules.external.forEach(function (m) {
        if (m.init) m.init(_this2);
      });
    }

    // append api
    var storeApi = ['getResource', 'addResource', 'addResources', 'addResourceBundle', 'removeResourceBundle', 'hasResourceBundle', 'getResourceBundle'];
    storeApi.forEach(function (fcName) {
      _this2[fcName] = function () {
        var _store;

        return (_store = _this2.store)[fcName].apply(_store, arguments);
      };
    });

    // COMPATIBILITY: remove this
    if (this.options.compatibilityAPI === 'v1') appendBackwardsAPI(this);

    var load = function load() {
      _this2.changeLanguage(_this2.options.lng, function (err, t) {
        _this2.isInitialized = true;
        _this2.logger.log('initialized', _this2.options);
        _this2.emit('initialized', _this2.options);

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

  /* eslint consistent-return: 0 */


  I18n.prototype.loadResources = function loadResources() {
    var _this3 = this;

    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    if (!this.options.resources) {
      if (this.language && this.language.toLowerCase() === 'cimode') return callback(); // avoid loading resources for cimode

      var toLoad = [];

      var append = function append(lng) {
        if (!lng) return;
        var lngs = _this3.services.languageUtils.toResolveHierarchy(lng);
        lngs.forEach(function (l) {
          if (toLoad.indexOf(l) < 0) toLoad.push(l);
        });
      };

      if (!this.language) {
        // at least load fallbacks in this case
        var fallbacks = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
        fallbacks.forEach(function (l) {
          return append(l);
        });
      } else {
        append(this.language);
      }

      if (this.options.preload) {
        this.options.preload.forEach(function (l) {
          return append(l);
        });
      }

      this.services.cacheConnector.load(toLoad, this.options.ns, function () {
        _this3.services.backendConnector.load(toLoad, _this3.options.ns, callback);
      });
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
    if (module.type === 'backend') {
      this.modules.backend = module;
    }

    if (module.type === 'cache') {
      this.modules.cache = module;
    }

    if (module.type === 'logger' || module.log && module.warn && module.error) {
      this.modules.logger = module;
    }

    if (module.type === 'languageDetector') {
      this.modules.languageDetector = module;
    }

    if (module.type === 'postProcessor') {
      postProcessor.addPostProcessor(module);
    }

    if (module.type === '3rdParty') {
      this.modules.external.push(module);
    }

    return this;
  };

  I18n.prototype.changeLanguage = function changeLanguage(lng, callback) {
    var _this4 = this;

    var done = function done(err, l) {
      if (l) {
        _this4.emit('languageChanged', l);
        _this4.logger.log('languageChanged', l);
      }

      if (callback) callback(err, function () {
        return _this4.t.apply(_this4, arguments);
      });
    };

    var setLng = function setLng(l) {
      if (l) {
        _this4.language = l;
        _this4.languages = _this4.services.languageUtils.toResolveHierarchy(l);

        _this4.translator.changeLanguage(l);

        if (_this4.services.languageDetector) _this4.services.languageDetector.cacheUserLanguage(l);
      }

      _this4.loadResources(function (err) {
        done(err, l);
      });
    };

    if (!lng && this.services.languageDetector && !this.services.languageDetector.async) {
      setLng(this.services.languageDetector.detect());
    } else if (!lng && this.services.languageDetector && this.services.languageDetector.async) {
      this.services.languageDetector.detect(setLng);
    } else {
      setLng(lng);
    }
  };

  I18n.prototype.getFixedT = function getFixedT(lng, ns) {
    var _this5 = this;

    var fixedT = function fixedT(key) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var options = _extends({}, opts);
      options.lng = options.lng || fixedT.lng;
      options.lngs = options.lngs || fixedT.lngs;
      options.ns = options.ns || fixedT.ns;
      return _this5.t(key, options);
    };
    if (typeof lng === 'string') {
      fixedT.lng = lng;
    } else {
      fixedT.lngs = lng;
    }
    fixedT.ns = ns;
    return fixedT;
  };

  I18n.prototype.t = function t() {
    var _translator;

    return this.translator && (_translator = this.translator).translate.apply(_translator, arguments);
  };

  I18n.prototype.exists = function exists() {
    var _translator2;

    return this.translator && (_translator2 = this.translator).exists.apply(_translator2, arguments);
  };

  I18n.prototype.setDefaultNamespace = function setDefaultNamespace(ns) {
    this.options.defaultNS = ns;
  };

  I18n.prototype.loadNamespaces = function loadNamespaces(ns, callback) {
    var _this6 = this;

    if (!this.options.ns) return callback && callback();
    if (typeof ns === 'string') ns = [ns];

    ns.forEach(function (n) {
      if (_this6.options.ns.indexOf(n) < 0) _this6.options.ns.push(n);
    });

    this.loadResources(callback);
  };

  I18n.prototype.loadLanguages = function loadLanguages(lngs, callback) {
    if (typeof lngs === 'string') lngs = [lngs];
    var preloaded = this.options.preload || [];

    var newLngs = lngs.filter(function (lng) {
      return preloaded.indexOf(lng) < 0;
    });
    // Exit early if all given languages are already preloaded
    if (!newLngs.length) return callback();

    this.options.preload = preloaded.concat(newLngs);
    this.loadResources(callback);
  };

  I18n.prototype.dir = function dir(lng) {
    if (!lng) lng = this.languages && this.languages.length > 0 ? this.languages[0] : this.language;
    if (!lng) return 'rtl';

    var rtlLngs = ['ar', 'shu', 'sqr', 'ssh', 'xaa', 'yhd', 'yud', 'aao', 'abh', 'abv', 'acm', 'acq', 'acw', 'acx', 'acy', 'adf', 'ads', 'aeb', 'aec', 'afb', 'ajp', 'apc', 'apd', 'arb', 'arq', 'ars', 'ary', 'arz', 'auz', 'avl', 'ayh', 'ayl', 'ayn', 'ayp', 'bbz', 'pga', 'he', 'iw', 'ps', 'pbt', 'pbu', 'pst', 'prp', 'prd', 'ur', 'ydd', 'yds', 'yih', 'ji', 'yi', 'hbo', 'men', 'xmn', 'fa', 'jpr', 'peo', 'pes', 'prs', 'dv', 'sam'];

    return rtlLngs.indexOf(this.services.languageUtils.getLanguagePartFromCode(lng)) >= 0 ? 'rtl' : 'ltr';
  };

  /* eslint class-methods-use-this: 0 */


  I18n.prototype.createInstance = function createInstance() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments[1];

    return new I18n(options, callback);
  };

  I18n.prototype.cloneInstance = function cloneInstance() {
    var _this7 = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

    var mergedOptions = _extends({}, this.options, options, { isClone: true });
    var clone = new I18n(mergedOptions, callback);
    var membersToCopy = ['store', 'services', 'language'];
    membersToCopy.forEach(function (m) {
      clone[m] = _this7[m];
    });
    clone.translator = new Translator(clone.services, clone.options);
    clone.translator.on('*', function (event) {
      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      clone.emit.apply(clone, [event].concat(args));
    });
    clone.init(mergedOptions, callback);

    return clone;
  };

  return I18n;
}(EventEmitter);

var i18next = new I18n();

return i18next;

})));


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.i18nextXHRBackend = factory());
}(this, (function () { 'use strict';

var arr = [];
var each = arr.forEach;
var slice = arr.slice;

function defaults(obj) {
  each.call(slice.call(arguments, 1), function (source) {
    if (source) {
      for (var prop in source) {
        if (obj[prop] === undefined) obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function addQueryString(url, params) {
  if (params && (typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
    var queryString = '',
        e = encodeURIComponent;

    // Must encode data
    for (var paramName in params) {
      queryString += '&' + e(paramName) + '=' + e(params[paramName]);
    }

    if (!queryString) {
      return url;
    }

    url = url + (url.indexOf('?') !== -1 ? '&' : '?') + queryString.slice(1);
  }

  return url;
}

// https://gist.github.com/Xeoncross/7663273
function ajax(url, options, callback, data, cache) {

  if (data && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
    if (!cache) {
      data['_t'] = new Date();
    }
    // URL encoded form data must be in querystring format
    data = addQueryString('', data).slice(1);
  }

  if (options.queryStringParams) {
    url = addQueryString(url, options.queryStringParams);
  }

  try {
    var x;
    if (XMLHttpRequest) {
      x = new XMLHttpRequest();
    } else {
      x = new ActiveXObject('MSXML2.XMLHTTP.3.0');
    }
    x.open(data ? 'POST' : 'GET', url, 1);
    if (!options.crossDomain) {
      x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }
    x.withCredentials = !!options.withCredentials;
    if (data) {
      x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    }
    var h = options.customHeaders;
    if (h) {
      for (var i in h) {
        x.setRequestHeader(i, h[i]);
      }
    }
    x.onreadystatechange = function () {
      x.readyState > 3 && callback && callback(x.responseText, x);
    };
    x.send(data);
  } catch (e) {
    console && console.log(e);
  }
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getDefaults() {
  return {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    addPath: 'locales/add/{{lng}}/{{ns}}',
    allowMultiLoading: false,
    parse: JSON.parse,
    crossDomain: false,
    ajax: ajax
  };
}

var Backend = function () {
  function Backend(services) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Backend);

    this.init(services, options);

    this.type = 'backend';
  }

  _createClass(Backend, [{
    key: 'init',
    value: function init(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.services = services;
      this.options = defaults(options, this.options || {}, getDefaults());
    }
  }, {
    key: 'readMulti',
    value: function readMulti(languages, namespaces, callback) {
      var loadPath = this.options.loadPath;
      if (typeof this.options.loadPath === 'function') {
        loadPath = this.options.loadPath(languages, namespaces);
      }

      var url = this.services.interpolator.interpolate(loadPath, { lng: languages.join('+'), ns: namespaces.join('+') });

      this.loadUrl(url, callback);
    }
  }, {
    key: 'read',
    value: function read(language, namespace, callback) {
      var loadPath = this.options.loadPath;
      if (typeof this.options.loadPath === 'function') {
        loadPath = this.options.loadPath([language], [namespace]);
      }

      var url = this.services.interpolator.interpolate(loadPath, { lng: language, ns: namespace });

      this.loadUrl(url, callback);
    }
  }, {
    key: 'loadUrl',
    value: function loadUrl(url, callback) {
      var _this = this;

      this.options.ajax(url, this.options, function (data, xhr) {
        if (xhr.status >= 500 && xhr.status < 600) return callback('failed loading ' + url, true /* retry */);
        if (xhr.status >= 400 && xhr.status < 500) return callback('failed loading ' + url, false /* no retry */);

        var ret = void 0,
            err = void 0;
        try {
          ret = _this.options.parse(data, url);
        } catch (e) {
          err = 'failed parsing ' + url + ' to json';
        }
        if (err) return callback(err, false);
        callback(null, ret);
      });
    }
  }, {
    key: 'create',
    value: function create(languages, namespace, key, fallbackValue) {
      var _this2 = this;

      if (typeof languages === 'string') languages = [languages];

      var payload = {};
      payload[key] = fallbackValue || '';

      languages.forEach(function (lng) {
        var url = _this2.services.interpolator.interpolate(_this2.options.addPath, { lng: lng, ns: namespace });

        _this2.options.ajax(url, _this2.options, function (data, xhr) {
          //const statusCode = xhr.status.toString();
          // TODO: if statusCode === 4xx do log
        }, payload);
      });
    }
  }]);

  return Backend;
}();

Backend.type = 'backend';

return Backend;

})));


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
     true ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.i18nextLocalStorageCache = factory());
}(this, (function () { 'use strict';

var arr = [];
var each = arr.forEach;
var slice = arr.slice;

function defaults(obj) {
  each.call(slice.call(arguments, 1), function (source) {
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
  return function () {
    var context = this,
        args = arguments;
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var storage = {
  setItem: function setItem(key, value) {
    if (window.localStorage) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        // f.log('failed to set value for key "' + key + '" to localStorage.');
      }
    }
  },
  getItem: function getItem(key, value) {
    if (window.localStorage) {
      try {
        return window.localStorage.getItem(key, value);
      } catch (e) {
        // f.log('failed to get value for key "' + key + '" from localStorage.');
      }
    }
    return undefined;
  }
};

function getDefaults() {
  return {
    enabled: false,
    prefix: 'i18next_res_',
    expirationTime: 7 * 24 * 60 * 60 * 1000,
    versions: {}
  };
}

var Cache = function () {
  function Cache(services) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Cache);

    this.init(services, options);

    this.type = 'cache';
    this.debouncedStore = debounce(this.store, 10000);
  }

  _createClass(Cache, [{
    key: 'init',
    value: function init(services) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      this.services = services;
      this.options = defaults(options, this.options || {}, getDefaults());
    }
  }, {
    key: 'load',
    value: function load(lngs, callback) {
      var _this = this;

      var store = {};
      var nowMS = new Date().getTime();

      if (!window.localStorage || !lngs.length) {
        return callback(null, null);
      }

      var todo = lngs.length;

      lngs.forEach(function (lng) {
        var local = storage.getItem(_this.options.prefix + lng);

        if (local) {
          local = JSON.parse(local);
          if (
          // expiration field is mandatory, and should not be expired
          local.i18nStamp && local.i18nStamp + _this.options.expirationTime > nowMS &&

          // there should be no language version set, or if it is, it should match the one in translation
          _this.options.versions[lng] === local.i18nVersion) {
            delete local.i18nVersion;
            store[lng] = local;
          }
        }

        todo -= 1;
        if (todo === 0) {
          callback(null, store);
        }
      });
      return undefined;
    }
  }, {
    key: 'store',
    value: function store(storeParam) {
      var store = storeParam;
      if (window.localStorage) {
        for (var m in store) {
          // eslint-disable-line
          // timestamp
          store[m].i18nStamp = new Date().getTime();

          // language version (if set)
          if (this.options.versions[m]) {
            store[m].i18nVersion = this.options.versions[m];
          }

          // save
          storage.setItem(this.options.prefix + m, JSON.stringify(store[m]));
        }
      }
    }
  }, {
    key: 'save',
    value: function save(store) {
      this.debouncedStore(store);
    }
  }]);

  return Cache;
}();

Cache.type = 'cache';

return Cache;

})));


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
     true ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define('i18nextSprintfPostProcessor', factory) :
    (global.i18nextSprintfPostProcessor = factory());
}(this, function () { 'use strict';

    var babelHelpers = {};
    babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
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
        var key = arguments[0],
            cache = sprintf.cache;
        if (!(cache[key] && cache.hasOwnProperty(key))) {
            cache[key] = sprintf.parse(key);
        }
        return sprintf.format.call(null, cache[key], arguments);
    }

    sprintf.format = function (parse_tree, argv) {
        var cursor = 1,
            tree_length = parse_tree.length,
            node_type = "",
            arg,
            output = [],
            i,
            k,
            match,
            pad,
            pad_character,
            pad_length,
            is_positive = true,
            sign = "";
        for (i = 0; i < tree_length; i++) {
            node_type = get_type(parse_tree[i]);
            if (node_type === "string") {
                output[output.length] = parse_tree[i];
            } else if (node_type === "array") {
                match = parse_tree[i]; // convenience purposes only
                if (match[2]) {
                    // keyword argument
                    arg = argv[cursor];
                    for (k = 0; k < match[2].length; k++) {
                        if (!arg.hasOwnProperty(match[2][k])) {
                            throw new Error(sprintf("[sprintf] property '%s' does not exist", match[2][k]));
                        }
                        arg = arg[match[2][k]];
                    }
                } else if (match[1]) {
                    // positional argument (explicit)
                    arg = argv[match[1]];
                } else {
                    // positional argument (implicit)
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

    sprintf.parse = function (fmt) {
        var _fmt = fmt,
            match = [],
            parse_tree = [],
            arg_names = 0;
        while (_fmt) {
            if ((match = re.text.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = match[0];
            } else if ((match = re.modulo.exec(_fmt)) !== null) {
                parse_tree[parse_tree.length] = "%";
            } else if ((match = re.placeholder.exec(_fmt)) !== null) {
                if (match[2]) {
                    arg_names |= 1;
                    var field_list = [],
                        replacement_field = match[2],
                        field_match = [];
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

    /**
     * helpers
     */
    function get_type(variable) {
        return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }

    function str_repeat(input, multiplier) {
        return Array(multiplier + 1).join(input);
    }

    var index = {
      name: 'sprintf',
      type: 'postProcessor',

      process: function process(value, key, options) {
        if (!options.sprintf) return value;

        if (Object.prototype.toString.apply(options.sprintf) === '[object Array]') {
          return vsprintf(value, options.sprintf);
        } else if (babelHelpers.typeof(options.sprintf) === 'object') {
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
          postProcess: 'sprintf',
          sprintf: values
        };
      }
    };

    return index;

}));

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

(function (global, factory) {
   true ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.i18nextBrowserLanguageDetector = factory());
}(this, function () { 'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
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
    each.call(slice.call(arguments, 1), function (source) {
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
        date.setTime(date.getTime() + minutes * 60 * 1000);
        expires = '; expires=' + date.toGMTString();
      } else expires = '';
      domain = domain ? 'domain=' + domain + ';' : '';
      document.cookie = name + '=' + value + expires + ';' + domain + 'path=/';
    },

    read: function read(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1, c.length);
        }if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    },

    remove: function remove(name) {
      this.create(name, '', -1);
    }
  };

  var cookie$1 = {
    name: 'cookie',

    lookup: function lookup(options) {
      var found = void 0;

      if (options.lookupCookie && typeof document !== 'undefined') {
        var c = cookie.read(options.lookupCookie);
        if (c) found = c;
      }

      return found;
    },
    cacheUserLanguage: function cacheUserLanguage(lng, options) {
      if (options.lookupCookie && typeof document !== 'undefined') {
        cookie.create(options.lookupCookie, lng, options.cookieMinutes, options.cookieDomain);
      }
    }
  };

  var querystring = {
    name: 'querystring',

    lookup: function lookup(options) {
      var found = void 0;

      if (typeof window !== 'undefined') {
        var query = window.location.search.substring(1);
        var params = query.split('&');
        for (var i = 0; i < params.length; i++) {
          var pos = params[i].indexOf('=');
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
    hasLocalStorageSupport = window !== 'undefined' && window.localStorage !== null;
    var testKey = 'i18next.translate.boo';
    window.localStorage.setItem(testKey, 'foo');
    window.localStorage.removeItem(testKey);
  } catch (e) {
    hasLocalStorageSupport = false;
  }

  var localStorage = {
    name: 'localStorage',

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
    name: 'navigator',

    lookup: function lookup(options) {
      var found = [];

      if (typeof navigator !== 'undefined') {
        if (navigator.languages) {
          // chrome only; not an array, so can't use .push.apply instead of iterating
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
    name: 'htmlTag',

    lookup: function lookup(options) {
      var found = void 0;
      var htmlTag = options.htmlTag || (typeof document !== 'undefined' ? document.documentElement : null);

      if (htmlTag && typeof htmlTag.getAttribute === 'function') {
        found = htmlTag.getAttribute('lang');
      }

      return found;
    }
  };

  function getDefaults() {
    return {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',

      // cache user language
      caches: ['localStorage'],
      excludeCacheFor: ['cimode']
      //cookieMinutes: 10,
      //cookieDomain: 'myDomain'
    };
  }

  var Browser = function () {
    function Browser(services) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
      babelHelpers.classCallCheck(this, Browser);

      this.type = 'languageDetector';
      this.detectors = {};

      this.init(services, options);
    }

    babelHelpers.createClass(Browser, [{
      key: 'init',
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
      key: 'addDetector',
      value: function addDetector(detector) {
        this.detectors[detector.name] = detector;
      }
    }, {
      key: 'detect',
      value: function detect(detectionOrder) {
        var _this = this;

        if (!detectionOrder) detectionOrder = this.options.order;

        var detected = [];
        detectionOrder.forEach(function (detectorName) {
          if (_this.detectors[detectorName]) {
            var lookup = _this.detectors[detectorName].lookup(_this.options);
            if (lookup && typeof lookup === 'string') lookup = [lookup];
            if (lookup) detected = detected.concat(lookup);
          }
        });

        var found = void 0;
        detected.forEach(function (lng) {
          if (found) return;
          var cleanedLng = _this.services.languageUtils.formatLanguageCode(lng);
          if (_this.services.languageUtils.isWhitelisted(cleanedLng)) found = cleanedLng;
        });

        return found || this.i18nOptions.fallbackLng[0];
      }
    }, {
      key: 'cacheUserLanguage',
      value: function cacheUserLanguage(lng, caches) {
        var _this2 = this;

        if (!caches) caches = this.options.caches;
        if (!caches) return;
        if (this.options.excludeCacheFor && this.options.excludeCacheFor.indexOf(lng) > -1) return;
        caches.forEach(function (cacheName) {
          if (_this2.detectors[cacheName]) _this2.detectors[cacheName].cacheUserLanguage(lng, _this2.options);
        });
      }
    }]);
    return Browser;
  }();

  Browser.type = 'languageDetector';

  return Browser;

}));

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCA4YTlhOWI4OTIyMjFhMjQwYTEwMCIsImNkcDovLy9DRFAvaTE4bi50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvIHtcInJvb3RcIjpcImpRdWVyeVwiLFwiY29tbW9uanNcIjpcImpxdWVyeVwiLFwiY29tbW9uanMyXCI6XCJqcXVlcnlcIixcImFtZFwiOlwianF1ZXJ5XCJ9Iiwid2VicGFjazovLy9leHRlcm5hbC8ge1wicm9vdFwiOlwiQ0RQXCIsXCJjb21tb25qc1wiOlwiY2RwLmNvcmVcIixcImNvbW1vbmpzMlwiOlwiY2RwLmNvcmVcIixcImFtZFwiOlwiY2RwLmNvcmVcIn0iLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyB7XCJyb290XCI6XCJDRFBcIixcImNvbW1vbmpzXCI6XCJjZHAucHJvbWlzZVwiLFwiY29tbW9uanMyXCI6XCJjZHAucHJvbWlzZVwiLFwiYW1kXCI6XCJjZHAucHJvbWlzZVwifSIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvaTE4bmV4dC9zY3JpcHRzL2pxdWVyeS1pMThuZXh0LmpzIiwid2VicGFjazovLy9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvaTE4bmV4dC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvaTE4bmV4dC9zY3JpcHRzL2kxOG5leHRYSFJCYWNrZW5kLmpzIiwid2VicGFjazovLy9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvaTE4bmV4dExvY2FsU3RvcmFnZUNhY2hlLmpzIiwid2VicGFjazovLy9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvaTE4bmV4dFNwcmludGZQb3N0UHJvY2Vzc29yLmpzIiwid2VicGFjazovLy9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvaTE4bmV4dEJyb3dzZXJMYW5ndWFnZURldGVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztB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TztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQSxzRkFBc0YsYUFBYTtBQUNuRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUNBQWlDLEVBQUU7QUFDbkM7O0FBRUE7QUFDQTtBQUNBLGFBQWE7QUFDYixZQUFZO0FBQ1osWUFBWTtBQUNaLGNBQWM7QUFDZCxhQUFhO0FBQ2IsY0FBYztBQUNkO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1RkFBdUY7QUFDdkY7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNB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VztBQUNYO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsaUVBQWlFLFlBQVksMkJBQTJCLHNEQUFzRDs7QUFFOUo7QUFDQTtBQUNBLHVFQUF1RTtBQUN2RTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1AsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FB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QUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsaUNBQWlDO0FBQ2pDLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVCxpQ0FBaUM7O0FBRWpDOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLDZDQUE2QyxFQUFFOztBQUUvQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FB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bml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKFwianF1ZXJ5XCIpLCByZXF1aXJlKFwiY2RwLmNvcmVcIiksIHJlcXVpcmUoXCJjZHAucHJvbWlzZVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJqcXVlcnlcIiwgXCJjZHAuY29yZVwiLCBcImNkcC5wcm9taXNlXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkNEUFwiXSA9IGZhY3RvcnkocmVxdWlyZShcImpxdWVyeVwiKSwgcmVxdWlyZShcImNkcC5jb3JlXCIpLCByZXF1aXJlKFwiY2RwLnByb21pc2VcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkNEUFwiXSA9IGZhY3Rvcnkocm9vdFtcImpRdWVyeVwiXSwgcm9vdFtcIkNEUFwiXSwgcm9vdFtcIkNEUFwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfM19fKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDhhOWE5Yjg5MjIyMWEyNDBhMTAwIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL0B0eXBlcy9pMThuZXh0LmQudHNcIiAvPlxyXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxubmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgaW1wb3J0IFByb21pc2UgPSBDRFAuUHJvbWlzZTtcclxuICAgIGltcG9ydCBJMThuZXh0ID0gaTE4bmV4dC5pMThuO1xyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgSTE4TiB7XHJcbiAgICAgICAgZXhwb3J0IHR5cGUgSTE4biA9IEkxOG5leHQuaTE4bjtcclxuICAgICAgICBleHBvcnQgdHlwZSBPcHRpb25zID0gSTE4bmV4dC5Jbml0T3B0aW9ucyAmIHsgW2tleXM6IHN0cmluZ106IGFueSB9O1xyXG4gICAgICAgIGV4cG9ydCB0eXBlIFRyYW5zbGF0aW9uT3B0aW9ucyA9IEkxOG5leHQuVHJhbnNsYXRpb25PcHRpb25zO1xyXG4gICAgICAgIGV4cG9ydCB0eXBlIFRyYW5zbGF0aW9uRnVuY3Rpb24gPSBJMThuZXh0LlRyYW5zbGF0aW9uRnVuY3Rpb247XHJcbiAgICAgICAgZXhwb3J0IHR5cGUgSW50ZXJwb2xhdGlvbk9wdGlvbnMgPSBJMThuZXh0LkludGVycG9sYXRpb25PcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5pMThuXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIGkxOG5leHQg44G444Gu44OA44Kk44Os44Kv44OI44Ki44Kv44K744K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgaTE4bjogSTE4Ti5JMThuO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGludGVyZmFjZSBJMThOU2V0dGluZ3NcclxuICAgICAqIEBicmllZiDjg63jg7zjgqvjg6njgqTjgrroqK3lrprnlKjjgqrjg5fjgrfjg6fjg7NcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJMThOU2V0dGluZ3Mge1xyXG4gICAgICAgIGZhbGxiYWNrUmVzb3VyY2VzPzogeyBbbG5nOiBzdHJpbmddOiB7IFtuczogc3RyaW5nXTogc3RyaW5nIH0gfTtcclxuICAgICAgICBwcmVsb2FkPzogc3RyaW5nW107XHJcbiAgICAgICAgb3B0aW9ucz86IEkxOE4uT3B0aW9ucztcclxuICAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBpbml0aWFsaXplIGkxOG5leHQuXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIGkxOG5leHQg44Gu5Yid5pyf5YyWXHJcbiAgICAgKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEByZXR1cm5zIElQcm9taXNlQmFzZSDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVJMThOKHNldHRpbmdzPzogSTE4TlNldHRpbmdzKTogSVByb21pc2VCYXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBpMThuU2V0dGluZ3M6IEkxOE5TZXR0aW5ncyA9IHNldHRpbmdzIHx8IHt9O1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaTE4bk9wdGlvbnM6IEkxOE4uT3B0aW9ucyA9ICgocmVzb3VyY2VzOiB7IFtsbmc6IHN0cmluZ106IHsgW25zOiBzdHJpbmddOiBzdHJpbmcgfSB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBsbmcgaW4gcmVzb3VyY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZXMuaGFzT3duUHJvcGVydHkobG5nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBucyBpbiByZXNvdXJjZXNbbG5nXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNvdXJjZXNbbG5nXS5oYXNPd25Qcm9wZXJ0eShucykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb3VyY2VzW2xuZ11bbnNdID0gZ2V0TG9jYWxlRmFsbGJhY2tSZXNvdXJjZShyZXNvdXJjZXNbbG5nXVtuc10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpMThuU2V0dGluZ3Mub3B0aW9ucy5yZXNvdXJjZXMgPSA8YW55PnJlc291cmNlcztcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTE4blNldHRpbmdzLm9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpMThuU2V0dGluZ3Mub3B0aW9ucztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSkoaTE4blNldHRpbmdzLmZhbGxiYWNrUmVzb3VyY2VzKTtcclxuXHJcbiAgICAgICAgICAgIHJlcXVpcmUoW1wianF1ZXJ5STE4bmV4dFwiXSwgKCQxOE5leHQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZShbXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpMThuZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpMThuZXh0WEhSQmFja2VuZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaTE4bmV4dExvY2FsU3RvcmFnZUNhY2hlXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpMThuZXh0U3ByaW50ZlBvc3RQcm9jZXNzb3JcIixcclxuICAgICAgICAgICAgICAgICAgICBcImkxOG5leHRCcm93c2VyTGFuZ3VhZ2VEZXRlY3RvclwiLFxyXG4gICAgICAgICAgICAgICAgXSwgKGkxOG5leHQ6IEkxOE4uSTE4blxyXG4gICAgICAgICAgICAgICAgICAgICwgQmFja2VuZDogYW55XHJcbiAgICAgICAgICAgICAgICAgICAgLCBDYWNoZTogYW55XHJcbiAgICAgICAgICAgICAgICAgICAgLCBQb3N0UHJvY2Vzc29yOiBhbnlcclxuICAgICAgICAgICAgICAgICAgICAsIExhbmd1YWdlRGV0ZWN0b3I6IGFueVxyXG4gICAgICAgICAgICAgICAgKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGkxOG5leHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51c2UoQmFja2VuZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51c2UoQ2FjaGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXNlKFBvc3RQcm9jZXNzb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXNlKExhbmd1YWdlRGV0ZWN0b3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuaW5pdChpMThuT3B0aW9ucywgKGVycm9yOiBhbnksIHQ6IEkxOE4uVHJhbnNsYXRpb25GdW5jdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQxOE5leHQuaW5pdChpMThuZXh0LCAkLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHROYW1lOiBcInRcIiwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLS0+IGFwcGVuZHMgJC50ID0gaTE4bmV4dC50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkxOG5OYW1lOiBcImkxOG5cIiwgICAgICAgICAgICAgICAgICAgLy8gLS0+IGFwcGVuZHMgJC5pMThuID0gaTE4bmV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVOYW1lOiBcImxvY2FsaXplXCIsICAgICAgICAgICAgIC8vIC0tPiBhcHBlbmRzICQoc2VsZWN0b3IpLmxvY2FsaXplKG9wdHMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvckF0dHI6IFwiZGF0YS1pMThuXCIsICAgICAgICAgIC8vIHNlbGVjdG9yIGZvciB0cmFuc2xhdGluZyBlbGVtZW50c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRBdHRyOiBcImkxOG4tdGFyZ2V0XCIsICAgICAgICAgIC8vIGRhdGEtKCkgYXR0cmlidXRlIHRvIGdyYWIgdGFyZ2V0IGVsZW1lbnQgdG8gdHJhbnNsYXRlIChpZiBkaWZmcmVudCB0aGVuIGl0c2VsZilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uc0F0dHI6IFwiaTE4bi1vcHRpb25zXCIsICAgICAgICAvLyBkYXRhLSgpIGF0dHJpYnV0ZSB0aGF0IGNvbnRhaW5zIG9wdGlvbnMsIHdpbGwgbG9hZC9zZXQgaWYgdXNlT3B0aW9uc0F0dHIgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZU9wdGlvbnNBdHRyOiBmYWxzZSwgICAgICAgICAgICAgIC8vIG5vIHVzZSBvcHRpb25zQXR0clxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYXJzZURlZmF1bHRWYWx1ZUZyb21Db250ZW50OiB0cnVlICAvLyBwYXJzZXMgZGVmYXVsdCB2YWx1ZXMgZnJvbSBjb250ZW50IGVsZS52YWwgb3IgZWxlLnRleHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpMThuZXh0IDMuNC4xOiByZXNvdXJjZXMg44GM5oyH5a6a44GV44KM44KL44GoIHByZWxvYWQg44GM6Kqt44G/6L6844G+44KM44Gq44GE44Gf44KB44CB5YaN6Kqt44G/6L6844G/5Yem55CG44KS6KGM44GGLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpMThuZXh0Lm9wdGlvbnMucmVzb3VyY2VzICYmIGkxOG5leHQub3B0aW9ucy5wcmVsb2FkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9wdGlvbnMg44GL44KJ44OX44Ot44OR44OG44Kj44KS5LiA5pem5YmK6ZmkLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfcHJlbG9hZCAgID0gaTE4bmV4dC5vcHRpb25zLnByZWxvYWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IF9yZXNvdXJjZXMgPSBpMThuZXh0Lm9wdGlvbnMucmVzb3VyY2VzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgaTE4bmV4dC5vcHRpb25zLnJlc291cmNlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGkxOG5leHQub3B0aW9ucy5wcmVsb2FkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpMThuZXh0LmxvYWRMYW5ndWFnZXMoX3ByZWxvYWQsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9wdGlvbnMg44KS5YWD44Gr5oi744GZXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpMThuZXh0Lm9wdGlvbnMucmVzb3VyY2VzID0gX3Jlc291cmNlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkxOG5leHQub3B0aW9ucy5wcmVsb2FkID0gX3ByZWxvYWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDRFAuaTE4biA9IGkxOG5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENEUC5pMThuID0gaTE4bmV4dDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFxcfmVuZ2xpc2hcclxuICAgICAqIGdldCBzdHJpbmcgcmVzb3VyY2UgZm9yIGZhbGxiYWNrLlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBGYWxsYmFjayDnlKjjg63jg7zjgqvjg6njgqTjgrrjg6rjgr3jg7zjgrnjga7lj5blvpdcclxuICAgICAqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHJldHVybnMgZmFsYmFrYyDjg6rjgr3jg7zjgrnjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0TG9jYWxlRmFsbGJhY2tSZXNvdXJjZShwYXRoOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgIGxldCBqc29uOiBKU09OO1xyXG4gICAgICAgICQuYWpheCh7XHJcbiAgICAgICAgICAgIHVybDogdG9VcmwocGF0aCksXHJcbiAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcclxuICAgICAgICAgICAgYXN5bmM6IGZhbHNlLFxyXG4gICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChkYXRhOiBKU09OKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBqc29uID0gZGF0YTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZXJyb3I6ICh4aHI6IEpRdWVyeVhIUiwgc3RhdHVzOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoVEFHICsgXCJhamF4IHJlcXVlc3QgZmFpbGVkLiBzdGF0dXM6IFwiICsgc3RhdHVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBqc29uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogQ29udmVydCBwYXRoIHRvIFVSTC5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGF0aCBbaW5dIHBhdGggc3RyaW5nXHJcbiAgICAgKlxyXG4gICAgICogXFx+amFwYW5lc2VcclxuICAgICAqIHBhdGgg44KSIFVSTCDjgavlpInmj5tcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGF0aCBbaW5dIOODkeOCueOCkuaMh+WumuOAglxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB0b1VybChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgIGlmICghcGF0aCAmJiBcIi9cIiAhPT0gcGF0aFswXSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFRBRyArIFwiaW52YWxpZCBwYXRoLiBwYXRoOiBcIiArIHBhdGgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBDRFAud2ViUm9vdCArIHBhdGguc2xpY2UoMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBqcXVlcnktaTE4bmV4dCBleHRlbnNpb25zXHJcblxyXG5pbnRlcmZhY2UgSlF1ZXJ5U3RhdGljIHtcclxuICAgIGkxOG46IENEUC5JMThOLkkxOG47XHJcbiAgICB0OiAoa2V5OiBzdHJpbmcsIG9wdGlvbnM/OiBDRFAuSTE4Ti5PcHRpb25zKSA9PiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBKUXVlcnkge1xyXG4gICAgbG9jYWxpemU6IChvcHRpb25zPzogQ0RQLkkxOE4uVHJhbnNsYXRpb25PcHRpb25zKSA9PiBKUXVlcnk7XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIGNkcC5pMThuIGRlY2xhcmF0aW9uXHJcblxyXG5kZWNsYXJlIG1vZHVsZSBcImNkcC5pMThuXCIge1xyXG4gICAgZXhwb3J0ID0gQ0RQO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBjZHA6Ly8vQ0RQL2kxOG4udHMiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMV9fO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcInJvb3RcIjpcImpRdWVyeVwiLFwiY29tbW9uanNcIjpcImpxdWVyeVwiLFwiY29tbW9uanMyXCI6XCJqcXVlcnlcIixcImFtZFwiOlwianF1ZXJ5XCJ9XG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX187XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wicm9vdFwiOlwiQ0RQXCIsXCJjb21tb25qc1wiOlwiY2RwLmNvcmVcIixcImNvbW1vbmpzMlwiOlwiY2RwLmNvcmVcIixcImFtZFwiOlwiY2RwLmNvcmVcIn1cbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzNfXztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJyb290XCI6XCJDRFBcIixcImNvbW1vbmpzXCI6XCJjZHAucHJvbWlzZVwiLFwiY29tbW9uanMyXCI6XCJjZHAucHJvbWlzZVwiLFwiYW1kXCI6XCJjZHAucHJvbWlzZVwifVxuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwuanF1ZXJ5STE4bmV4dCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTtcblxudmFyIGRlZmF1bHRzID0ge1xuICB0TmFtZTogJ3QnLFxuICBpMThuTmFtZTogJ2kxOG4nLFxuICBoYW5kbGVOYW1lOiAnbG9jYWxpemUnLFxuICBzZWxlY3RvckF0dHI6ICdkYXRhLWkxOG4nLFxuICB0YXJnZXRBdHRyOiAnaTE4bi10YXJnZXQnLFxuICBvcHRpb25zQXR0cjogJ2kxOG4tb3B0aW9ucycsXG4gIHVzZU9wdGlvbnNBdHRyOiBmYWxzZSxcbiAgcGFyc2VEZWZhdWx0VmFsdWVGcm9tQ29udGVudDogdHJ1ZVxufTtcblxuZnVuY3Rpb24gaW5pdChpMThuZXh0LCAkKSB7XG4gIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcblxuXG4gIG9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gIGZ1bmN0aW9uIHBhcnNlKGVsZSwga2V5LCBvcHRzKSB7XG4gICAgaWYgKGtleS5sZW5ndGggPT09IDApIHJldHVybjtcblxuICAgIHZhciBhdHRyID0gJ3RleHQnO1xuXG4gICAgaWYgKGtleS5pbmRleE9mKCdbJykgPT09IDApIHtcbiAgICAgIHZhciBwYXJ0cyA9IGtleS5zcGxpdCgnXScpO1xuICAgICAga2V5ID0gcGFydHNbMV07XG4gICAgICBhdHRyID0gcGFydHNbMF0uc3Vic3RyKDEsIHBhcnRzWzBdLmxlbmd0aCAtIDEpO1xuICAgIH1cblxuICAgIGlmIChrZXkuaW5kZXhPZignOycpID09PSBrZXkubGVuZ3RoIC0gMSkge1xuICAgICAga2V5ID0ga2V5LnN1YnN0cigwLCBrZXkubGVuZ3RoIC0gMik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZXh0ZW5kRGVmYXVsdChvLCB2YWwpIHtcbiAgICAgIGlmICghb3B0aW9ucy5wYXJzZURlZmF1bHRWYWx1ZUZyb21Db250ZW50KSByZXR1cm4gbztcbiAgICAgIHJldHVybiBfZXh0ZW5kcyh7fSwgbywgeyBkZWZhdWx0VmFsdWU6IHZhbCB9KTtcbiAgICB9XG5cbiAgICBpZiAoYXR0ciA9PT0gJ2h0bWwnKSB7XG4gICAgICBlbGUuaHRtbChpMThuZXh0LnQoa2V5LCBleHRlbmREZWZhdWx0KG9wdHMsIGVsZS5odG1sKCkpKSk7XG4gICAgfSBlbHNlIGlmIChhdHRyID09PSAndGV4dCcpIHtcbiAgICAgIGVsZS50ZXh0KGkxOG5leHQudChrZXksIGV4dGVuZERlZmF1bHQob3B0cywgZWxlLnRleHQoKSkpKTtcbiAgICB9IGVsc2UgaWYgKGF0dHIgPT09ICdwcmVwZW5kJykge1xuICAgICAgZWxlLnByZXBlbmQoaTE4bmV4dC50KGtleSwgZXh0ZW5kRGVmYXVsdChvcHRzLCBlbGUuaHRtbCgpKSkpO1xuICAgIH0gZWxzZSBpZiAoYXR0ciA9PT0gJ2FwcGVuZCcpIHtcbiAgICAgIGVsZS5hcHBlbmQoaTE4bmV4dC50KGtleSwgZXh0ZW5kRGVmYXVsdChvcHRzLCBlbGUuaHRtbCgpKSkpO1xuICAgIH0gZWxzZSBpZiAoYXR0ci5pbmRleE9mKCdkYXRhLScpID09PSAwKSB7XG4gICAgICB2YXIgZGF0YUF0dHIgPSBhdHRyLnN1YnN0cignZGF0YS0nLmxlbmd0aCk7XG4gICAgICB2YXIgdHJhbnNsYXRlZCA9IGkxOG5leHQudChrZXksIGV4dGVuZERlZmF1bHQob3B0cywgZWxlLmRhdGEoZGF0YUF0dHIpKSk7XG5cbiAgICAgIC8vIHdlIGNoYW5nZSBpbnRvIHRoZSBkYXRhIGNhY2hlXG4gICAgICBlbGUuZGF0YShkYXRhQXR0ciwgdHJhbnNsYXRlZCk7XG4gICAgICAvLyB3ZSBjaGFuZ2UgaW50byB0aGUgZG9tXG4gICAgICBlbGUuYXR0cihhdHRyLCB0cmFuc2xhdGVkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlLmF0dHIoYXR0ciwgaTE4bmV4dC50KGtleSwgZXh0ZW5kRGVmYXVsdChvcHRzLCBlbGUuYXR0cihhdHRyKSkpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBsb2NhbGl6ZShlbGUsIG9wdHMpIHtcbiAgICB2YXIga2V5ID0gZWxlLmF0dHIob3B0aW9ucy5zZWxlY3RvckF0dHIpO1xuICAgIGlmICgha2V5ICYmIHR5cGVvZiBrZXkgIT09ICd1bmRlZmluZWQnICYmIGtleSAhPT0gZmFsc2UpIGtleSA9IGVsZS50ZXh0KCkgfHwgZWxlLnZhbCgpO1xuICAgIGlmICgha2V5KSByZXR1cm47XG5cbiAgICB2YXIgdGFyZ2V0ID0gZWxlLFxuICAgICAgICB0YXJnZXRTZWxlY3RvciA9IGVsZS5kYXRhKG9wdGlvbnMudGFyZ2V0QXR0cik7XG5cbiAgICBpZiAodGFyZ2V0U2VsZWN0b3IpIHRhcmdldCA9IGVsZS5maW5kKHRhcmdldFNlbGVjdG9yKSB8fCBlbGU7XG5cbiAgICBpZiAoIW9wdHMgJiYgb3B0aW9ucy51c2VPcHRpb25zQXR0ciA9PT0gdHJ1ZSkgb3B0cyA9IGVsZS5kYXRhKG9wdGlvbnMub3B0aW9uc0F0dHIpO1xuXG4gICAgb3B0cyA9IG9wdHMgfHwge307XG5cbiAgICBpZiAoa2V5LmluZGV4T2YoJzsnKSA+PSAwKSB7XG4gICAgICB2YXIga2V5cyA9IGtleS5zcGxpdCgnOycpO1xuXG4gICAgICAkLmVhY2goa2V5cywgZnVuY3Rpb24gKG0sIGspIHtcbiAgICAgICAgaWYgKGsgIT09ICcnKSBwYXJzZSh0YXJnZXQsIGssIG9wdHMpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnNlKHRhcmdldCwga2V5LCBvcHRzKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51c2VPcHRpb25zQXR0ciA9PT0gdHJ1ZSkge1xuICAgICAgdmFyIGNsb25lID0ge307XG4gICAgICBjbG9uZSA9IF9leHRlbmRzKHsgY2xvbmU6IGNsb25lIH0sIG9wdHMpO1xuXG4gICAgICBkZWxldGUgY2xvbmUubG5nO1xuICAgICAgZWxlLmRhdGEob3B0aW9ucy5vcHRpb25zQXR0ciwgY2xvbmUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZShvcHRzKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBsb2NhbGl6ZSBlbGVtZW50IGl0c2VsZlxuICAgICAgbG9jYWxpemUoJCh0aGlzKSwgb3B0cyk7XG5cbiAgICAgIC8vIGxvY2FsaXplIGNoaWxkcmVuXG4gICAgICB2YXIgZWxlbWVudHMgPSAkKHRoaXMpLmZpbmQoJ1snICsgb3B0aW9ucy5zZWxlY3RvckF0dHIgKyAnXScpO1xuICAgICAgZWxlbWVudHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvY2FsaXplKCQodGhpcyksIG9wdHMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gJC50ICQuaTE4biBzaG9ydGN1dFxuICAkW29wdGlvbnMudE5hbWVdID0gaTE4bmV4dC50LmJpbmQoaTE4bmV4dCk7XG4gICRbb3B0aW9ucy5pMThuTmFtZV0gPSBpMThuZXh0O1xuXG4gIC8vIHNlbGVjdG9yIGZ1bmN0aW9uICQobXlTZWxlY3RvcikubG9jYWxpemUob3B0cyk7XG4gICQuZm5bb3B0aW9ucy5oYW5kbGVOYW1lXSA9IGhhbmRsZTtcbn1cblxudmFyIGluZGV4ID0ge1xuICBpbml0OiBpbml0XG59O1xuXG5yZXR1cm4gaW5kZXg7XG5cbn0pKSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvanF1ZXJ5LWkxOG5leHQuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLmkxOG5leHQgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBjbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59O1xuXG5cblxuXG5cblxuXG5cblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cblxuXG52YXIgaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuID0gZnVuY3Rpb24gKHNlbGYsIGNhbGwpIHtcbiAgaWYgKCFzZWxmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG59O1xuXG5cblxuXG5cbnZhciBzbGljZWRUb0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkge1xuICAgIHZhciBfYXJyID0gW107XG4gICAgdmFyIF9uID0gdHJ1ZTtcbiAgICB2YXIgX2QgPSBmYWxzZTtcbiAgICB2YXIgX2UgPSB1bmRlZmluZWQ7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgICBfYXJyLnB1c2goX3MudmFsdWUpO1xuXG4gICAgICAgIGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhaztcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIF9kID0gdHJ1ZTtcbiAgICAgIF9lID0gZXJyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdKSBfaVtcInJldHVyblwiXSgpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKF9kKSB0aHJvdyBfZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gX2FycjtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoYXJyLCBpKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgcmV0dXJuIGFycjtcbiAgICB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkge1xuICAgICAgcmV0dXJuIHNsaWNlSXRlcmF0b3IoYXJyLCBpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7XG4gICAgfVxuICB9O1xufSgpO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgdG9Db25zdW1hYmxlQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gICAgcmV0dXJuIGFycjI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oYXJyKTtcbiAgfVxufTtcblxudmFyIGNvbnNvbGVMb2dnZXIgPSB7XG4gIHR5cGU6ICdsb2dnZXInLFxuXG4gIGxvZzogZnVuY3Rpb24gbG9nKGFyZ3MpIHtcbiAgICB0aGlzLm91dHB1dCgnbG9nJywgYXJncyk7XG4gIH0sXG4gIHdhcm46IGZ1bmN0aW9uIHdhcm4oYXJncykge1xuICAgIHRoaXMub3V0cHV0KCd3YXJuJywgYXJncyk7XG4gIH0sXG4gIGVycm9yOiBmdW5jdGlvbiBlcnJvcihhcmdzKSB7XG4gICAgdGhpcy5vdXRwdXQoJ2Vycm9yJywgYXJncyk7XG4gIH0sXG4gIG91dHB1dDogZnVuY3Rpb24gb3V0cHV0KHR5cGUsIGFyZ3MpIHtcbiAgICB2YXIgX2NvbnNvbGU7XG5cbiAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGVbdHlwZV0pIChfY29uc29sZSA9IGNvbnNvbGUpW3R5cGVdLmFwcGx5KF9jb25zb2xlLCB0b0NvbnN1bWFibGVBcnJheShhcmdzKSk7XG4gIH1cbn07XG5cbnZhciBMb2dnZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIExvZ2dlcihjb25jcmV0ZUxvZ2dlcikge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBMb2dnZXIpO1xuXG4gICAgdGhpcy5pbml0KGNvbmNyZXRlTG9nZ2VyLCBvcHRpb25zKTtcbiAgfVxuXG4gIExvZ2dlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIGluaXQoY29uY3JldGVMb2dnZXIpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICB0aGlzLnByZWZpeCA9IG9wdGlvbnMucHJlZml4IHx8ICdpMThuZXh0Oic7XG4gICAgdGhpcy5sb2dnZXIgPSBjb25jcmV0ZUxvZ2dlciB8fCBjb25zb2xlTG9nZ2VyO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5kZWJ1ZyA9IG9wdGlvbnMuZGVidWc7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5zZXREZWJ1ZyA9IGZ1bmN0aW9uIHNldERlYnVnKGJvb2wpIHtcbiAgICB0aGlzLmRlYnVnID0gYm9vbDtcbiAgfTtcblxuICBMb2dnZXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uIGxvZygpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5mb3J3YXJkKGFyZ3MsICdsb2cnLCAnJywgdHJ1ZSk7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS53YXJuID0gZnVuY3Rpb24gd2FybigpIHtcbiAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgYXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmZvcndhcmQoYXJncywgJ3dhcm4nLCAnJywgdHJ1ZSk7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKCkge1xuICAgIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4zKSwgX2tleTMgPSAwOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICBhcmdzW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZm9yd2FyZChhcmdzLCAnZXJyb3InLCAnJyk7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5kZXByZWNhdGUgPSBmdW5jdGlvbiBkZXByZWNhdGUoKSB7XG4gICAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjQpLCBfa2V5NCA9IDA7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICAgIGFyZ3NbX2tleTRdID0gYXJndW1lbnRzW19rZXk0XTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5mb3J3YXJkKGFyZ3MsICd3YXJuJywgJ1dBUk5JTkcgREVQUkVDQVRFRDogJywgdHJ1ZSk7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5mb3J3YXJkID0gZnVuY3Rpb24gZm9yd2FyZChhcmdzLCBsdmwsIHByZWZpeCwgZGVidWdPbmx5KSB7XG4gICAgaWYgKGRlYnVnT25seSAmJiAhdGhpcy5kZWJ1ZykgcmV0dXJuIG51bGw7XG4gICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJykgYXJnc1swXSA9ICcnICsgcHJlZml4ICsgdGhpcy5wcmVmaXggKyAnICcgKyBhcmdzWzBdO1xuICAgIHJldHVybiB0aGlzLmxvZ2dlcltsdmxdKGFyZ3MpO1xuICB9O1xuXG4gIExvZ2dlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKG1vZHVsZU5hbWUpIHtcbiAgICByZXR1cm4gbmV3IExvZ2dlcih0aGlzLmxvZ2dlciwgX2V4dGVuZHMoeyBwcmVmaXg6IHRoaXMucHJlZml4ICsgJzonICsgbW9kdWxlTmFtZSArICc6JyB9LCB0aGlzLm9wdGlvbnMpKTtcbiAgfTtcblxuICByZXR1cm4gTG9nZ2VyO1xufSgpO1xuXG52YXIgYmFzZUxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcblxudmFyIEV2ZW50RW1pdHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIEV2ZW50RW1pdHRlcik7XG5cbiAgICB0aGlzLm9ic2VydmVycyA9IHt9O1xuICB9XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50cywgbGlzdGVuZXIpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgZXZlbnRzLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIF90aGlzLm9ic2VydmVyc1tldmVudF0gPSBfdGhpcy5vYnNlcnZlcnNbZXZlbnRdIHx8IFtdO1xuICAgICAgX3RoaXMub2JzZXJ2ZXJzW2V2ZW50XS5wdXNoKGxpc3RlbmVyKTtcbiAgICB9KTtcbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIG9mZihldmVudCwgbGlzdGVuZXIpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIGlmICghdGhpcy5vYnNlcnZlcnNbZXZlbnRdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5vYnNlcnZlcnNbZXZlbnRdLmZvckVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFsaXN0ZW5lcikge1xuICAgICAgICBkZWxldGUgX3RoaXMyLm9ic2VydmVyc1tldmVudF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaW5kZXggPSBfdGhpczIub2JzZXJ2ZXJzW2V2ZW50XS5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICBfdGhpczIub2JzZXJ2ZXJzW2V2ZW50XS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdChldmVudCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub2JzZXJ2ZXJzW2V2ZW50XSkge1xuICAgICAgdmFyIGNsb25lZCA9IFtdLmNvbmNhdCh0aGlzLm9ic2VydmVyc1tldmVudF0pO1xuICAgICAgY2xvbmVkLmZvckVhY2goZnVuY3Rpb24gKG9ic2VydmVyKSB7XG4gICAgICAgIG9ic2VydmVyLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vYnNlcnZlcnNbJyonXSkge1xuICAgICAgdmFyIF9jbG9uZWQgPSBbXS5jb25jYXQodGhpcy5vYnNlcnZlcnNbJyonXSk7XG4gICAgICBfY2xvbmVkLmZvckVhY2goZnVuY3Rpb24gKG9ic2VydmVyKSB7XG4gICAgICAgIHZhciBfcmVmO1xuXG4gICAgICAgIG9ic2VydmVyLmFwcGx5KG9ic2VydmVyLCAoX3JlZiA9IFtldmVudF0pLmNvbmNhdC5hcHBseShfcmVmLCBhcmdzKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbn0oKTtcblxuZnVuY3Rpb24gbWFrZVN0cmluZyhvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gJyc7XG4gIC8qIGVzbGludCBwcmVmZXItdGVtcGxhdGU6IDAgKi9cbiAgcmV0dXJuICcnICsgb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBjb3B5KGEsIHMsIHQpIHtcbiAgYS5mb3JFYWNoKGZ1bmN0aW9uIChtKSB7XG4gICAgaWYgKHNbbV0pIHRbbV0gPSBzW21dO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0TGFzdE9mUGF0aChvYmplY3QsIHBhdGgsIEVtcHR5KSB7XG4gIGZ1bmN0aW9uIGNsZWFuS2V5KGtleSkge1xuICAgIHJldHVybiBrZXkgJiYga2V5LmluZGV4T2YoJyMjIycpID4gLTEgPyBrZXkucmVwbGFjZSgvIyMjL2csICcuJykgOiBrZXk7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5Ob3RUcmF2ZXJzZURlZXBlcigpIHtcbiAgICByZXR1cm4gIW9iamVjdCB8fCB0eXBlb2Ygb2JqZWN0ID09PSAnc3RyaW5nJztcbiAgfVxuXG4gIHZhciBzdGFjayA9IHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJyA/IFtdLmNvbmNhdChwYXRoKSA6IHBhdGguc3BsaXQoJy4nKTtcbiAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDEpIHtcbiAgICBpZiAoY2FuTm90VHJhdmVyc2VEZWVwZXIoKSkgcmV0dXJuIHt9O1xuXG4gICAgdmFyIGtleSA9IGNsZWFuS2V5KHN0YWNrLnNoaWZ0KCkpO1xuICAgIGlmICghb2JqZWN0W2tleV0gJiYgRW1wdHkpIG9iamVjdFtrZXldID0gbmV3IEVtcHR5KCk7XG4gICAgb2JqZWN0ID0gb2JqZWN0W2tleV07XG4gIH1cblxuICBpZiAoY2FuTm90VHJhdmVyc2VEZWVwZXIoKSkgcmV0dXJuIHt9O1xuICByZXR1cm4ge1xuICAgIG9iajogb2JqZWN0LFxuICAgIGs6IGNsZWFuS2V5KHN0YWNrLnNoaWZ0KCkpXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldFBhdGgob2JqZWN0LCBwYXRoLCBuZXdWYWx1ZSkge1xuICB2YXIgX2dldExhc3RPZlBhdGggPSBnZXRMYXN0T2ZQYXRoKG9iamVjdCwgcGF0aCwgT2JqZWN0KSxcbiAgICAgIG9iaiA9IF9nZXRMYXN0T2ZQYXRoLm9iaixcbiAgICAgIGsgPSBfZ2V0TGFzdE9mUGF0aC5rO1xuXG4gIG9ialtrXSA9IG5ld1ZhbHVlO1xufVxuXG5mdW5jdGlvbiBwdXNoUGF0aChvYmplY3QsIHBhdGgsIG5ld1ZhbHVlLCBjb25jYXQpIHtcbiAgdmFyIF9nZXRMYXN0T2ZQYXRoMiA9IGdldExhc3RPZlBhdGgob2JqZWN0LCBwYXRoLCBPYmplY3QpLFxuICAgICAgb2JqID0gX2dldExhc3RPZlBhdGgyLm9iaixcbiAgICAgIGsgPSBfZ2V0TGFzdE9mUGF0aDIuaztcblxuICBvYmpba10gPSBvYmpba10gfHwgW107XG4gIGlmIChjb25jYXQpIG9ialtrXSA9IG9ialtrXS5jb25jYXQobmV3VmFsdWUpO1xuICBpZiAoIWNvbmNhdCkgb2JqW2tdLnB1c2gobmV3VmFsdWUpO1xufVxuXG5mdW5jdGlvbiBnZXRQYXRoKG9iamVjdCwgcGF0aCkge1xuICB2YXIgX2dldExhc3RPZlBhdGgzID0gZ2V0TGFzdE9mUGF0aChvYmplY3QsIHBhdGgpLFxuICAgICAgb2JqID0gX2dldExhc3RPZlBhdGgzLm9iaixcbiAgICAgIGsgPSBfZ2V0TGFzdE9mUGF0aDMuaztcblxuICBpZiAoIW9iaikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgcmV0dXJuIG9ialtrXTtcbn1cblxuZnVuY3Rpb24gZGVlcEV4dGVuZCh0YXJnZXQsIHNvdXJjZSwgb3ZlcndyaXRlKSB7XG4gIC8qIGVzbGludCBuby1yZXN0cmljdGVkLXN5bnRheDogMCAqL1xuICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgIGlmIChwcm9wIGluIHRhcmdldCkge1xuICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIGxlYWYgc3RyaW5nIGluIHRhcmdldCBvciBzb3VyY2UgdGhlbiByZXBsYWNlIHdpdGggc291cmNlIG9yIHNraXAgZGVwZW5kaW5nIG9uIHRoZSAnb3ZlcndyaXRlJyBzd2l0Y2hcbiAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W3Byb3BdID09PSAnc3RyaW5nJyB8fCB0YXJnZXRbcHJvcF0gaW5zdGFuY2VvZiBTdHJpbmcgfHwgdHlwZW9mIHNvdXJjZVtwcm9wXSA9PT0gJ3N0cmluZycgfHwgc291cmNlW3Byb3BdIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICAgIGlmIChvdmVyd3JpdGUpIHRhcmdldFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlZXBFeHRlbmQodGFyZ2V0W3Byb3BdLCBzb3VyY2VbcHJvcF0sIG92ZXJ3cml0ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gcmVnZXhFc2NhcGUoc3RyKSB7XG4gIC8qIGVzbGludCBuby11c2VsZXNzLWVzY2FwZTogMCAqL1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCAnXFxcXCQmJyk7XG59XG5cbi8qIGVzbGludC1kaXNhYmxlICovXG52YXIgX2VudGl0eU1hcCA9IHtcbiAgXCImXCI6IFwiJmFtcDtcIixcbiAgXCI8XCI6IFwiJmx0O1wiLFxuICBcIj5cIjogXCImZ3Q7XCIsXG4gICdcIic6ICcmcXVvdDsnLFxuICBcIidcIjogJyYjMzk7JyxcbiAgXCIvXCI6ICcmI3gyRjsnXG59O1xuLyogZXNsaW50LWVuYWJsZSAqL1xuXG5mdW5jdGlvbiBlc2NhcGUoZGF0YSkge1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGRhdGEucmVwbGFjZSgvWyY8PlwiJ1xcL10vZywgZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBfZW50aXR5TWFwW3NdO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbnZhciBSZXNvdXJjZVN0b3JlID0gZnVuY3Rpb24gKF9FdmVudEVtaXR0ZXIpIHtcbiAgaW5oZXJpdHMoUmVzb3VyY2VTdG9yZSwgX0V2ZW50RW1pdHRlcik7XG5cbiAgZnVuY3Rpb24gUmVzb3VyY2VTdG9yZSgpIHtcbiAgICB2YXIgZGF0YSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHsgbnM6IFsndHJhbnNsYXRpb24nXSwgZGVmYXVsdE5TOiAndHJhbnNsYXRpb24nIH07XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgUmVzb3VyY2VTdG9yZSk7XG5cbiAgICB2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9FdmVudEVtaXR0ZXIuY2FsbCh0aGlzKSk7XG5cbiAgICBfdGhpcy5kYXRhID0gZGF0YTtcbiAgICBfdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBSZXNvdXJjZVN0b3JlLnByb3RvdHlwZS5hZGROYW1lc3BhY2VzID0gZnVuY3Rpb24gYWRkTmFtZXNwYWNlcyhucykge1xuICAgIGlmICh0aGlzLm9wdGlvbnMubnMuaW5kZXhPZihucykgPCAwKSB7XG4gICAgICB0aGlzLm9wdGlvbnMubnMucHVzaChucyk7XG4gICAgfVxuICB9O1xuXG4gIFJlc291cmNlU3RvcmUucHJvdG90eXBlLnJlbW92ZU5hbWVzcGFjZXMgPSBmdW5jdGlvbiByZW1vdmVOYW1lc3BhY2VzKG5zKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5vcHRpb25zLm5zLmluZGV4T2YobnMpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLm9wdGlvbnMubnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH07XG5cbiAgUmVzb3VyY2VTdG9yZS5wcm90b3R5cGUuZ2V0UmVzb3VyY2UgPSBmdW5jdGlvbiBnZXRSZXNvdXJjZShsbmcsIG5zLCBrZXkpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDoge307XG5cbiAgICB2YXIga2V5U2VwYXJhdG9yID0gb3B0aW9ucy5rZXlTZXBhcmF0b3IgfHwgdGhpcy5vcHRpb25zLmtleVNlcGFyYXRvcjtcbiAgICBpZiAoa2V5U2VwYXJhdG9yID09PSB1bmRlZmluZWQpIGtleVNlcGFyYXRvciA9ICcuJztcblxuICAgIHZhciBwYXRoID0gW2xuZywgbnNdO1xuICAgIGlmIChrZXkgJiYgdHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHBhdGggPSBwYXRoLmNvbmNhdChrZXkpO1xuICAgIGlmIChrZXkgJiYgdHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHBhdGggPSBwYXRoLmNvbmNhdChrZXlTZXBhcmF0b3IgPyBrZXkuc3BsaXQoa2V5U2VwYXJhdG9yKSA6IGtleSk7XG5cbiAgICBpZiAobG5nLmluZGV4T2YoJy4nKSA+IC0xKSB7XG4gICAgICBwYXRoID0gbG5nLnNwbGl0KCcuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldFBhdGgodGhpcy5kYXRhLCBwYXRoKTtcbiAgfTtcblxuICBSZXNvdXJjZVN0b3JlLnByb3RvdHlwZS5hZGRSZXNvdXJjZSA9IGZ1bmN0aW9uIGFkZFJlc291cmNlKGxuZywgbnMsIGtleSwgdmFsdWUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogeyBzaWxlbnQ6IGZhbHNlIH07XG5cbiAgICB2YXIga2V5U2VwYXJhdG9yID0gdGhpcy5vcHRpb25zLmtleVNlcGFyYXRvcjtcbiAgICBpZiAoa2V5U2VwYXJhdG9yID09PSB1bmRlZmluZWQpIGtleVNlcGFyYXRvciA9ICcuJztcblxuICAgIHZhciBwYXRoID0gW2xuZywgbnNdO1xuICAgIGlmIChrZXkpIHBhdGggPSBwYXRoLmNvbmNhdChrZXlTZXBhcmF0b3IgPyBrZXkuc3BsaXQoa2V5U2VwYXJhdG9yKSA6IGtleSk7XG5cbiAgICBpZiAobG5nLmluZGV4T2YoJy4nKSA+IC0xKSB7XG4gICAgICBwYXRoID0gbG5nLnNwbGl0KCcuJyk7XG4gICAgICB2YWx1ZSA9IG5zO1xuICAgICAgbnMgPSBwYXRoWzFdO1xuICAgIH1cblxuICAgIHRoaXMuYWRkTmFtZXNwYWNlcyhucyk7XG5cbiAgICBzZXRQYXRoKHRoaXMuZGF0YSwgcGF0aCwgdmFsdWUpO1xuXG4gICAgaWYgKCFvcHRpb25zLnNpbGVudCkgdGhpcy5lbWl0KCdhZGRlZCcsIGxuZywgbnMsIGtleSwgdmFsdWUpO1xuICB9O1xuXG4gIFJlc291cmNlU3RvcmUucHJvdG90eXBlLmFkZFJlc291cmNlcyA9IGZ1bmN0aW9uIGFkZFJlc291cmNlcyhsbmcsIG5zLCByZXNvdXJjZXMpIHtcbiAgICAvKiBlc2xpbnQgbm8tcmVzdHJpY3RlZC1zeW50YXg6IDAgKi9cbiAgICBmb3IgKHZhciBtIGluIHJlc291cmNlcykge1xuICAgICAgaWYgKHR5cGVvZiByZXNvdXJjZXNbbV0gPT09ICdzdHJpbmcnKSB0aGlzLmFkZFJlc291cmNlKGxuZywgbnMsIG0sIHJlc291cmNlc1ttXSwgeyBzaWxlbnQ6IHRydWUgfSk7XG4gICAgfVxuICAgIHRoaXMuZW1pdCgnYWRkZWQnLCBsbmcsIG5zLCByZXNvdXJjZXMpO1xuICB9O1xuXG4gIFJlc291cmNlU3RvcmUucHJvdG90eXBlLmFkZFJlc291cmNlQnVuZGxlID0gZnVuY3Rpb24gYWRkUmVzb3VyY2VCdW5kbGUobG5nLCBucywgcmVzb3VyY2VzLCBkZWVwLCBvdmVyd3JpdGUpIHtcbiAgICB2YXIgcGF0aCA9IFtsbmcsIG5zXTtcbiAgICBpZiAobG5nLmluZGV4T2YoJy4nKSA+IC0xKSB7XG4gICAgICBwYXRoID0gbG5nLnNwbGl0KCcuJyk7XG4gICAgICBkZWVwID0gcmVzb3VyY2VzO1xuICAgICAgcmVzb3VyY2VzID0gbnM7XG4gICAgICBucyA9IHBhdGhbMV07XG4gICAgfVxuXG4gICAgdGhpcy5hZGROYW1lc3BhY2VzKG5zKTtcblxuICAgIHZhciBwYWNrID0gZ2V0UGF0aCh0aGlzLmRhdGEsIHBhdGgpIHx8IHt9O1xuXG4gICAgaWYgKGRlZXApIHtcbiAgICAgIGRlZXBFeHRlbmQocGFjaywgcmVzb3VyY2VzLCBvdmVyd3JpdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYWNrID0gX2V4dGVuZHMoe30sIHBhY2ssIHJlc291cmNlcyk7XG4gICAgfVxuXG4gICAgc2V0UGF0aCh0aGlzLmRhdGEsIHBhdGgsIHBhY2spO1xuXG4gICAgdGhpcy5lbWl0KCdhZGRlZCcsIGxuZywgbnMsIHJlc291cmNlcyk7XG4gIH07XG5cbiAgUmVzb3VyY2VTdG9yZS5wcm90b3R5cGUucmVtb3ZlUmVzb3VyY2VCdW5kbGUgPSBmdW5jdGlvbiByZW1vdmVSZXNvdXJjZUJ1bmRsZShsbmcsIG5zKSB7XG4gICAgaWYgKHRoaXMuaGFzUmVzb3VyY2VCdW5kbGUobG5nLCBucykpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmRhdGFbbG5nXVtuc107XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlTmFtZXNwYWNlcyhucyk7XG5cbiAgICB0aGlzLmVtaXQoJ3JlbW92ZWQnLCBsbmcsIG5zKTtcbiAgfTtcblxuICBSZXNvdXJjZVN0b3JlLnByb3RvdHlwZS5oYXNSZXNvdXJjZUJ1bmRsZSA9IGZ1bmN0aW9uIGhhc1Jlc291cmNlQnVuZGxlKGxuZywgbnMpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShsbmcsIG5zKSAhPT0gdW5kZWZpbmVkO1xuICB9O1xuXG4gIFJlc291cmNlU3RvcmUucHJvdG90eXBlLmdldFJlc291cmNlQnVuZGxlID0gZnVuY3Rpb24gZ2V0UmVzb3VyY2VCdW5kbGUobG5nLCBucykge1xuICAgIGlmICghbnMpIG5zID0gdGhpcy5vcHRpb25zLmRlZmF1bHROUztcblxuICAgIC8vIENPTVBBVElCSUxJVFk6IHJlbW92ZSBleHRlbmQgaW4gdjIuMS4wXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb21wYXRpYmlsaXR5QVBJID09PSAndjEnKSByZXR1cm4gX2V4dGVuZHMoe30sIHRoaXMuZ2V0UmVzb3VyY2UobG5nLCBucykpO1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UobG5nLCBucyk7XG4gIH07XG5cbiAgUmVzb3VyY2VTdG9yZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGE7XG4gIH07XG5cbiAgcmV0dXJuIFJlc291cmNlU3RvcmU7XG59KEV2ZW50RW1pdHRlcik7XG5cbnZhciBwb3N0UHJvY2Vzc29yID0ge1xuXG4gIHByb2Nlc3NvcnM6IHt9LFxuXG4gIGFkZFBvc3RQcm9jZXNzb3I6IGZ1bmN0aW9uIGFkZFBvc3RQcm9jZXNzb3IobW9kdWxlKSB7XG4gICAgdGhpcy5wcm9jZXNzb3JzW21vZHVsZS5uYW1lXSA9IG1vZHVsZTtcbiAgfSxcbiAgaGFuZGxlOiBmdW5jdGlvbiBoYW5kbGUocHJvY2Vzc29ycywgdmFsdWUsIGtleSwgb3B0aW9ucywgdHJhbnNsYXRvcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBwcm9jZXNzb3JzLmZvckVhY2goZnVuY3Rpb24gKHByb2Nlc3Nvcikge1xuICAgICAgaWYgKF90aGlzLnByb2Nlc3NvcnNbcHJvY2Vzc29yXSkgdmFsdWUgPSBfdGhpcy5wcm9jZXNzb3JzW3Byb2Nlc3Nvcl0ucHJvY2Vzcyh2YWx1ZSwga2V5LCBvcHRpb25zLCB0cmFuc2xhdG9yKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufTtcblxuLyogZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOiAwICovXG5mdW5jdGlvbiBjb252ZXJ0SW50ZXJwb2xhdGlvbihvcHRpb25zKSB7XG5cbiAgb3B0aW9ucy5pbnRlcnBvbGF0aW9uID0ge1xuICAgIHVuZXNjYXBlU3VmZml4OiAnSFRNTCdcbiAgfTtcblxuICBvcHRpb25zLmludGVycG9sYXRpb24ucHJlZml4ID0gb3B0aW9ucy5pbnRlcnBvbGF0aW9uUHJlZml4IHx8ICdfXyc7XG4gIG9wdGlvbnMuaW50ZXJwb2xhdGlvbi5zdWZmaXggPSBvcHRpb25zLmludGVycG9sYXRpb25TdWZmaXggfHwgJ19fJztcbiAgb3B0aW9ucy5pbnRlcnBvbGF0aW9uLmVzY2FwZVZhbHVlID0gb3B0aW9ucy5lc2NhcGVJbnRlcnBvbGF0aW9uIHx8IGZhbHNlO1xuXG4gIG9wdGlvbnMuaW50ZXJwb2xhdGlvbi5uZXN0aW5nUHJlZml4ID0gb3B0aW9ucy5yZXVzZVByZWZpeCB8fCAnJHQoJztcbiAgb3B0aW9ucy5pbnRlcnBvbGF0aW9uLm5lc3RpbmdTdWZmaXggPSBvcHRpb25zLnJldXNlU3VmZml4IHx8ICcpJztcblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gY29udmVydEFQSU9wdGlvbnMob3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5yZXNTdG9yZSkgb3B0aW9ucy5yZXNvdXJjZXMgPSBvcHRpb25zLnJlc1N0b3JlO1xuXG4gIGlmIChvcHRpb25zLm5zICYmIG9wdGlvbnMubnMuZGVmYXVsdE5zKSB7XG4gICAgb3B0aW9ucy5kZWZhdWx0TlMgPSBvcHRpb25zLm5zLmRlZmF1bHROcztcbiAgICBvcHRpb25zLm5zID0gb3B0aW9ucy5ucy5uYW1lc3BhY2VzO1xuICB9IGVsc2Uge1xuICAgIG9wdGlvbnMuZGVmYXVsdE5TID0gb3B0aW9ucy5ucyB8fCAndHJhbnNsYXRpb24nO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMuZmFsbGJhY2tUb0RlZmF1bHROUyAmJiBvcHRpb25zLmRlZmF1bHROUykgb3B0aW9ucy5mYWxsYmFja05TID0gb3B0aW9ucy5kZWZhdWx0TlM7XG5cbiAgb3B0aW9ucy5zYXZlTWlzc2luZyA9IG9wdGlvbnMuc2VuZE1pc3Npbmc7XG4gIG9wdGlvbnMuc2F2ZU1pc3NpbmdUbyA9IG9wdGlvbnMuc2VuZE1pc3NpbmdUbyB8fCAnY3VycmVudCc7XG4gIG9wdGlvbnMucmV0dXJuTnVsbCA9ICFvcHRpb25zLmZhbGxiYWNrT25OdWxsO1xuICBvcHRpb25zLnJldHVybkVtcHR5U3RyaW5nID0gIW9wdGlvbnMuZmFsbGJhY2tPbkVtcHR5O1xuICBvcHRpb25zLnJldHVybk9iamVjdHMgPSBvcHRpb25zLnJldHVybk9iamVjdFRyZWVzO1xuICBvcHRpb25zLmpvaW5BcnJheXMgPSAnXFxuJztcblxuICBvcHRpb25zLnJldHVybmVkT2JqZWN0SGFuZGxlciA9IG9wdGlvbnMub2JqZWN0VHJlZUtleUhhbmRsZXI7XG4gIG9wdGlvbnMucGFyc2VNaXNzaW5nS2V5SGFuZGxlciA9IG9wdGlvbnMucGFyc2VNaXNzaW5nS2V5O1xuICBvcHRpb25zLmFwcGVuZE5hbWVzcGFjZVRvTWlzc2luZ0tleSA9IHRydWU7XG5cbiAgb3B0aW9ucy5uc1NlcGFyYXRvciA9IG9wdGlvbnMubnNzZXBhcmF0b3IgfHwgJzonO1xuICBvcHRpb25zLmtleVNlcGFyYXRvciA9IG9wdGlvbnMua2V5c2VwYXJhdG9yIHx8ICcuJztcblxuICBpZiAob3B0aW9ucy5zaG9ydGN1dEZ1bmN0aW9uID09PSAnc3ByaW50ZicpIHtcbiAgICBvcHRpb25zLm92ZXJsb2FkVHJhbnNsYXRpb25PcHRpb25IYW5kbGVyID0gZnVuY3Rpb24gaGFuZGxlKGFyZ3MpIHtcbiAgICAgIHZhciB2YWx1ZXMgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbHVlcy5wdXNoKGFyZ3NbaV0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBwb3N0UHJvY2VzczogJ3NwcmludGYnLFxuICAgICAgICBzcHJpbnRmOiB2YWx1ZXNcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuXG4gIG9wdGlvbnMud2hpdGVsaXN0ID0gb3B0aW9ucy5sbmdXaGl0ZWxpc3Q7XG4gIG9wdGlvbnMucHJlbG9hZCA9IG9wdGlvbnMucHJlbG9hZDtcbiAgaWYgKG9wdGlvbnMubG9hZCA9PT0gJ2N1cnJlbnQnKSBvcHRpb25zLmxvYWQgPSAnY3VycmVudE9ubHknO1xuICBpZiAob3B0aW9ucy5sb2FkID09PSAndW5zcGVjaWZpYycpIG9wdGlvbnMubG9hZCA9ICdsYW5ndWFnZU9ubHknO1xuXG4gIC8vIGJhY2tlbmRcbiAgb3B0aW9ucy5iYWNrZW5kID0gb3B0aW9ucy5iYWNrZW5kIHx8IHt9O1xuICBvcHRpb25zLmJhY2tlbmQubG9hZFBhdGggPSBvcHRpb25zLnJlc0dldFBhdGggfHwgJ2xvY2FsZXMvX19sbmdfXy9fX25zX18uanNvbic7XG4gIG9wdGlvbnMuYmFja2VuZC5hZGRQYXRoID0gb3B0aW9ucy5yZXNQb3N0UGF0aCB8fCAnbG9jYWxlcy9hZGQvX19sbmdfXy9fX25zX18nO1xuICBvcHRpb25zLmJhY2tlbmQuYWxsb3dNdWx0aUxvYWRpbmcgPSBvcHRpb25zLmR5bmFtaWNMb2FkO1xuXG4gIC8vIGNhY2hlXG4gIG9wdGlvbnMuY2FjaGUgPSBvcHRpb25zLmNhY2hlIHx8IHt9O1xuICBvcHRpb25zLmNhY2hlLnByZWZpeCA9ICdyZXNfJztcbiAgb3B0aW9ucy5jYWNoZS5leHBpcmF0aW9uVGltZSA9IDcgKiAyNCAqIDYwICogNjAgKiAxMDAwO1xuICBvcHRpb25zLmNhY2hlLmVuYWJsZWQgPSBvcHRpb25zLnVzZUxvY2FsU3RvcmFnZTtcblxuICBvcHRpb25zID0gY29udmVydEludGVycG9sYXRpb24ob3B0aW9ucyk7XG4gIGlmIChvcHRpb25zLmRlZmF1bHRWYXJpYWJsZXMpIG9wdGlvbnMuaW50ZXJwb2xhdGlvbi5kZWZhdWx0VmFyaWFibGVzID0gb3B0aW9ucy5kZWZhdWx0VmFyaWFibGVzO1xuXG4gIC8vIENPTVBBVElCSUxJVFk6IGRlcHJlY2F0aW9uXG4gIC8vIGlmIChvcHRpb25zLmdldEFzeW5jID09PSBmYWxzZSkgdGhyb3cgZGVwcmVjYXRpb24gZXJyb3JcblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gY29udmVydEpTT05PcHRpb25zKG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IGNvbnZlcnRJbnRlcnBvbGF0aW9uKG9wdGlvbnMpO1xuICBvcHRpb25zLmpvaW5BcnJheXMgPSAnXFxuJztcblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gY29udmVydFRPcHRpb25zKG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMuaW50ZXJwb2xhdGlvblByZWZpeCB8fCBvcHRpb25zLmludGVycG9sYXRpb25TdWZmaXggfHwgb3B0aW9ucy5lc2NhcGVJbnRlcnBvbGF0aW9uICE9PSB1bmRlZmluZWQpIHtcbiAgICBvcHRpb25zID0gY29udmVydEludGVycG9sYXRpb24ob3B0aW9ucyk7XG4gIH1cblxuICBvcHRpb25zLm5zU2VwYXJhdG9yID0gb3B0aW9ucy5uc3NlcGFyYXRvcjtcbiAgb3B0aW9ucy5rZXlTZXBhcmF0b3IgPSBvcHRpb25zLmtleXNlcGFyYXRvcjtcblxuICBvcHRpb25zLnJldHVybk9iamVjdHMgPSBvcHRpb25zLnJldHVybk9iamVjdFRyZWVzO1xuXG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5mdW5jdGlvbiBhcHBlbmRCYWNrd2FyZHNBUEkoaTE4bikge1xuICBpMThuLmxuZyA9IGZ1bmN0aW9uICgpIHtcbiAgICBiYXNlTG9nZ2VyLmRlcHJlY2F0ZSgnaTE4bmV4dC5sbmcoKSBjYW4gYmUgcmVwbGFjZWQgYnkgaTE4bmV4dC5sYW5ndWFnZSBmb3IgZGV0ZWN0ZWQgbGFuZ3VhZ2Ugb3IgaTE4bmV4dC5sYW5ndWFnZXMgZm9yIGxhbmd1YWdlcyBvcmRlcmVkIGJ5IHRyYW5zbGF0aW9uIGxvb2t1cC4nKTtcbiAgICByZXR1cm4gaTE4bi5zZXJ2aWNlcy5sYW5ndWFnZVV0aWxzLnRvUmVzb2x2ZUhpZXJhcmNoeShpMThuLmxhbmd1YWdlKVswXTtcbiAgfTtcblxuICBpMThuLnByZWxvYWQgPSBmdW5jdGlvbiAobG5ncywgY2IpIHtcbiAgICBiYXNlTG9nZ2VyLmRlcHJlY2F0ZSgnaTE4bmV4dC5wcmVsb2FkKCkgY2FuIGJlIHJlcGxhY2VkIHdpdGggaTE4bmV4dC5sb2FkTGFuZ3VhZ2VzKCknKTtcbiAgICBpMThuLmxvYWRMYW5ndWFnZXMobG5ncywgY2IpO1xuICB9O1xuXG4gIGkxOG4uc2V0TG5nID0gZnVuY3Rpb24gKGxuZywgb3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICBiYXNlTG9nZ2VyLmRlcHJlY2F0ZSgnaTE4bmV4dC5zZXRMbmcoKSBjYW4gYmUgcmVwbGFjZWQgd2l0aCBpMThuZXh0LmNoYW5nZUxhbmd1YWdlKCkgb3IgaTE4bmV4dC5nZXRGaXhlZFQoKSB0byBnZXQgYSB0cmFuc2xhdGlvbiBmdW5jdGlvbiB3aXRoIGZpeGVkIGxhbmd1YWdlIG9yIG5hbWVzcGFjZS4nKTtcbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG5cbiAgICBpZiAob3B0aW9ucy5maXhMbmcgPT09IHRydWUpIHtcbiAgICAgIGlmIChjYWxsYmFjaykgcmV0dXJuIGNhbGxiYWNrKG51bGwsIGkxOG4uZ2V0Rml4ZWRUKGxuZykpO1xuICAgIH1cblxuICAgIHJldHVybiBpMThuLmNoYW5nZUxhbmd1YWdlKGxuZywgY2FsbGJhY2spO1xuICB9O1xuXG4gIGkxOG4uYWRkUG9zdFByb2Nlc3NvciA9IGZ1bmN0aW9uIChuYW1lLCBmYykge1xuICAgIGJhc2VMb2dnZXIuZGVwcmVjYXRlKCdpMThuZXh0LmFkZFBvc3RQcm9jZXNzb3IoKSBjYW4gYmUgcmVwbGFjZWQgYnkgaTE4bmV4dC51c2UoeyB0eXBlOiBcXCdwb3N0UHJvY2Vzc29yXFwnLCBuYW1lOiBcXCduYW1lXFwnLCBwcm9jZXNzOiBmYyB9KScpO1xuICAgIGkxOG4udXNlKHtcbiAgICAgIHR5cGU6ICdwb3N0UHJvY2Vzc29yJyxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICBwcm9jZXNzOiBmY1xuICAgIH0pO1xuICB9O1xufVxuXG52YXIgVHJhbnNsYXRvciA9IGZ1bmN0aW9uIChfRXZlbnRFbWl0dGVyKSB7XG4gIGluaGVyaXRzKFRyYW5zbGF0b3IsIF9FdmVudEVtaXR0ZXIpO1xuXG4gIGZ1bmN0aW9uIFRyYW5zbGF0b3Ioc2VydmljZXMpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgVHJhbnNsYXRvcik7XG5cbiAgICB2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9FdmVudEVtaXR0ZXIuY2FsbCh0aGlzKSk7XG5cbiAgICBjb3B5KFsncmVzb3VyY2VTdG9yZScsICdsYW5ndWFnZVV0aWxzJywgJ3BsdXJhbFJlc29sdmVyJywgJ2ludGVycG9sYXRvcicsICdiYWNrZW5kQ29ubmVjdG9yJ10sIHNlcnZpY2VzLCBfdGhpcyk7XG5cbiAgICBfdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICBfdGhpcy5sb2dnZXIgPSBiYXNlTG9nZ2VyLmNyZWF0ZSgndHJhbnNsYXRvcicpO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIFRyYW5zbGF0b3IucHJvdG90eXBlLmNoYW5nZUxhbmd1YWdlID0gZnVuY3Rpb24gY2hhbmdlTGFuZ3VhZ2UobG5nKSB7XG4gICAgaWYgKGxuZykgdGhpcy5sYW5ndWFnZSA9IGxuZztcbiAgfTtcblxuICBUcmFuc2xhdG9yLnByb3RvdHlwZS5leGlzdHMgPSBmdW5jdGlvbiBleGlzdHMoa2V5KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHsgaW50ZXJwb2xhdGlvbjoge30gfTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcGF0aWJpbGl0eUFQSSA9PT0gJ3YxJykge1xuICAgICAgb3B0aW9ucyA9IGNvbnZlcnRUT3B0aW9ucyhvcHRpb25zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5yZXNvbHZlKGtleSwgb3B0aW9ucykgIT09IHVuZGVmaW5lZDtcbiAgfTtcblxuICBUcmFuc2xhdG9yLnByb3RvdHlwZS5leHRyYWN0RnJvbUtleSA9IGZ1bmN0aW9uIGV4dHJhY3RGcm9tS2V5KGtleSwgb3B0aW9ucykge1xuICAgIHZhciBuc1NlcGFyYXRvciA9IG9wdGlvbnMubnNTZXBhcmF0b3IgfHwgdGhpcy5vcHRpb25zLm5zU2VwYXJhdG9yO1xuICAgIGlmIChuc1NlcGFyYXRvciA9PT0gdW5kZWZpbmVkKSBuc1NlcGFyYXRvciA9ICc6JztcbiAgICB2YXIga2V5U2VwYXJhdG9yID0gb3B0aW9ucy5rZXlTZXBhcmF0b3IgfHwgdGhpcy5vcHRpb25zLmtleVNlcGFyYXRvciB8fCAnLic7XG5cbiAgICB2YXIgbmFtZXNwYWNlcyA9IG9wdGlvbnMubnMgfHwgdGhpcy5vcHRpb25zLmRlZmF1bHROUztcbiAgICBpZiAobnNTZXBhcmF0b3IgJiYga2V5LmluZGV4T2YobnNTZXBhcmF0b3IpID4gLTEpIHtcbiAgICAgIHZhciBwYXJ0cyA9IGtleS5zcGxpdChuc1NlcGFyYXRvcik7XG4gICAgICBpZiAobnNTZXBhcmF0b3IgIT09IGtleVNlcGFyYXRvciB8fCBuc1NlcGFyYXRvciA9PT0ga2V5U2VwYXJhdG9yICYmIHRoaXMub3B0aW9ucy5ucy5pbmRleE9mKHBhcnRzWzBdKSA+IC0xKSBuYW1lc3BhY2VzID0gcGFydHMuc2hpZnQoKTtcbiAgICAgIGtleSA9IHBhcnRzLmpvaW4oa2V5U2VwYXJhdG9yKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBuYW1lc3BhY2VzID09PSAnc3RyaW5nJykgbmFtZXNwYWNlcyA9IFtuYW1lc3BhY2VzXTtcblxuICAgIHJldHVybiB7XG4gICAgICBrZXk6IGtleSxcbiAgICAgIG5hbWVzcGFjZXM6IG5hbWVzcGFjZXNcbiAgICB9O1xuICB9O1xuXG4gIFRyYW5zbGF0b3IucHJvdG90eXBlLnRyYW5zbGF0ZSA9IGZ1bmN0aW9uIHRyYW5zbGF0ZShrZXlzKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgaWYgKCh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yob3B0aW9ucykpICE9PSAnb2JqZWN0Jykge1xuICAgICAgLyogZXNsaW50IHByZWZlci1yZXN0LXBhcmFtczogMCAqL1xuICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucy5vdmVybG9hZFRyYW5zbGF0aW9uT3B0aW9uSGFuZGxlcihhcmd1bWVudHMpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLmNvbXBhdGliaWxpdHlBUEkgPT09ICd2MScpIHtcbiAgICAgIG9wdGlvbnMgPSBjb252ZXJ0VE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gbm9uIHZhbGlkIGtleXMgaGFuZGxpbmdcbiAgICBpZiAoa2V5cyA9PT0gdW5kZWZpbmVkIHx8IGtleXMgPT09IG51bGwgfHwga2V5cyA9PT0gJycpIHJldHVybiAnJztcbiAgICBpZiAodHlwZW9mIGtleXMgPT09ICdudW1iZXInKSBrZXlzID0gU3RyaW5nKGtleXMpO1xuICAgIGlmICh0eXBlb2Yga2V5cyA9PT0gJ3N0cmluZycpIGtleXMgPSBba2V5c107XG5cbiAgICAvLyBzZXBhcmF0b3JzXG4gICAgdmFyIGtleVNlcGFyYXRvciA9IG9wdGlvbnMua2V5U2VwYXJhdG9yIHx8IHRoaXMub3B0aW9ucy5rZXlTZXBhcmF0b3IgfHwgJy4nO1xuXG4gICAgLy8gZ2V0IG5hbWVzcGFjZShzKVxuXG4gICAgdmFyIF9leHRyYWN0RnJvbUtleSA9IHRoaXMuZXh0cmFjdEZyb21LZXkoa2V5c1trZXlzLmxlbmd0aCAtIDFdLCBvcHRpb25zKSxcbiAgICAgICAga2V5ID0gX2V4dHJhY3RGcm9tS2V5LmtleSxcbiAgICAgICAgbmFtZXNwYWNlcyA9IF9leHRyYWN0RnJvbUtleS5uYW1lc3BhY2VzO1xuXG4gICAgdmFyIG5hbWVzcGFjZSA9IG5hbWVzcGFjZXNbbmFtZXNwYWNlcy5sZW5ndGggLSAxXTtcblxuICAgIC8vIHJldHVybiBrZXkgb24gQ0lNb2RlXG4gICAgdmFyIGxuZyA9IG9wdGlvbnMubG5nIHx8IHRoaXMubGFuZ3VhZ2U7XG4gICAgdmFyIGFwcGVuZE5hbWVzcGFjZVRvQ0lNb2RlID0gb3B0aW9ucy5hcHBlbmROYW1lc3BhY2VUb0NJTW9kZSB8fCB0aGlzLm9wdGlvbnMuYXBwZW5kTmFtZXNwYWNlVG9DSU1vZGU7XG4gICAgaWYgKGxuZyAmJiBsbmcudG9Mb3dlckNhc2UoKSA9PT0gJ2NpbW9kZScpIHtcbiAgICAgIGlmIChhcHBlbmROYW1lc3BhY2VUb0NJTW9kZSkge1xuICAgICAgICB2YXIgbnNTZXBhcmF0b3IgPSBvcHRpb25zLm5zU2VwYXJhdG9yIHx8IHRoaXMub3B0aW9ucy5uc1NlcGFyYXRvcjtcbiAgICAgICAgcmV0dXJuIG5hbWVzcGFjZSArIG5zU2VwYXJhdG9yICsga2V5O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIC8vIHJlc29sdmUgZnJvbSBzdG9yZVxuICAgIHZhciByZXMgPSB0aGlzLnJlc29sdmUoa2V5cywgb3B0aW9ucyk7XG5cbiAgICB2YXIgcmVzVHlwZSA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkocmVzKTtcbiAgICB2YXIgbm9PYmplY3QgPSBbJ1tvYmplY3QgTnVtYmVyXScsICdbb2JqZWN0IEZ1bmN0aW9uXScsICdbb2JqZWN0IFJlZ0V4cF0nXTtcbiAgICB2YXIgam9pbkFycmF5cyA9IG9wdGlvbnMuam9pbkFycmF5cyAhPT0gdW5kZWZpbmVkID8gb3B0aW9ucy5qb2luQXJyYXlzIDogdGhpcy5vcHRpb25zLmpvaW5BcnJheXM7XG5cbiAgICAvLyBvYmplY3RcbiAgICBpZiAocmVzICYmIHR5cGVvZiByZXMgIT09ICdzdHJpbmcnICYmIG5vT2JqZWN0LmluZGV4T2YocmVzVHlwZSkgPCAwICYmICEoam9pbkFycmF5cyAmJiByZXNUeXBlID09PSAnW29iamVjdCBBcnJheV0nKSkge1xuICAgICAgaWYgKCFvcHRpb25zLnJldHVybk9iamVjdHMgJiYgIXRoaXMub3B0aW9ucy5yZXR1cm5PYmplY3RzKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ2FjY2Vzc2luZyBhbiBvYmplY3QgLSBidXQgcmV0dXJuT2JqZWN0cyBvcHRpb25zIGlzIG5vdCBlbmFibGVkIScpO1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnJldHVybmVkT2JqZWN0SGFuZGxlciA/IHRoaXMub3B0aW9ucy5yZXR1cm5lZE9iamVjdEhhbmRsZXIoa2V5LCByZXMsIG9wdGlvbnMpIDogJ2tleSBcXCcnICsga2V5ICsgJyAoJyArIHRoaXMubGFuZ3VhZ2UgKyAnKVxcJyByZXR1cm5lZCBhbiBvYmplY3QgaW5zdGVhZCBvZiBzdHJpbmcuJztcbiAgICAgIH1cblxuICAgICAgLy8gaWYgd2UgZ290IGEgc2VwYXJhdG9yIHdlIGxvb3Agb3ZlciBjaGlsZHJlbiAtIGVsc2Ugd2UganVzdCByZXR1cm4gb2JqZWN0IGFzIGlzXG4gICAgICAvLyBhcyBoYXZpbmcgaXQgc2V0IHRvIGZhbHNlIG1lYW5zIG5vIGhpZXJhcmNoeSBzbyBubyBsb29rdXAgZm9yIG5lc3RlZCB2YWx1ZXNcbiAgICAgIGlmIChvcHRpb25zLmtleVNlcGFyYXRvciB8fCB0aGlzLm9wdGlvbnMua2V5U2VwYXJhdG9yKSB7XG4gICAgICAgIHZhciBjb3B5JCQxID0gcmVzVHlwZSA9PT0gJ1tvYmplY3QgQXJyYXldJyA/IFtdIDoge307IC8vIGFwcGx5IGNoaWxkIHRyYW5zbGF0aW9uIG9uIGEgY29weVxuXG4gICAgICAgIC8qIGVzbGludCBuby1yZXN0cmljdGVkLXN5bnRheDogMCAqL1xuICAgICAgICBmb3IgKHZhciBtIGluIHJlcykge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzLCBtKSkge1xuICAgICAgICAgICAgY29weSQkMVttXSA9IHRoaXMudHJhbnNsYXRlKCcnICsga2V5ICsga2V5U2VwYXJhdG9yICsgbSwgX2V4dGVuZHMoe30sIG9wdGlvbnMsIHsgam9pbkFycmF5czogZmFsc2UsIG5zOiBuYW1lc3BhY2VzIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVzID0gY29weSQkMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGpvaW5BcnJheXMgJiYgcmVzVHlwZSA9PT0gJ1tvYmplY3QgQXJyYXldJykge1xuICAgICAgLy8gYXJyYXkgc3BlY2lhbCB0cmVhdG1lbnRcbiAgICAgIHJlcyA9IHJlcy5qb2luKGpvaW5BcnJheXMpO1xuICAgICAgaWYgKHJlcykgcmVzID0gdGhpcy5leHRlbmRUcmFuc2xhdGlvbihyZXMsIGtleSwgb3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHN0cmluZywgZW1wdHkgb3IgbnVsbFxuICAgICAgdmFyIHVzZWREZWZhdWx0ID0gZmFsc2U7XG4gICAgICB2YXIgdXNlZEtleSA9IGZhbHNlO1xuXG4gICAgICAvLyBmYWxsYmFjayB2YWx1ZVxuICAgICAgaWYgKCF0aGlzLmlzVmFsaWRMb29rdXAocmVzKSAmJiBvcHRpb25zLmRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHVzZWREZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgcmVzID0gb3B0aW9ucy5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZExvb2t1cChyZXMpKSB7XG4gICAgICAgIHVzZWRLZXkgPSB0cnVlO1xuICAgICAgICByZXMgPSBrZXk7XG4gICAgICB9XG5cbiAgICAgIC8vIHNhdmUgbWlzc2luZ1xuICAgICAgaWYgKHVzZWRLZXkgfHwgdXNlZERlZmF1bHQpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIubG9nKCdtaXNzaW5nS2V5JywgbG5nLCBuYW1lc3BhY2UsIGtleSwgcmVzKTtcblxuICAgICAgICB2YXIgbG5ncyA9IFtdO1xuICAgICAgICB2YXIgZmFsbGJhY2tMbmdzID0gdGhpcy5sYW5ndWFnZVV0aWxzLmdldEZhbGxiYWNrQ29kZXModGhpcy5vcHRpb25zLmZhbGxiYWNrTG5nLCBvcHRpb25zLmxuZyB8fCB0aGlzLmxhbmd1YWdlKTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zYXZlTWlzc2luZ1RvID09PSAnZmFsbGJhY2snICYmIGZhbGxiYWNrTG5ncyAmJiBmYWxsYmFja0xuZ3NbMF0pIHtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZhbGxiYWNrTG5ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbG5ncy5wdXNoKGZhbGxiYWNrTG5nc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5zYXZlTWlzc2luZ1RvID09PSAnYWxsJykge1xuICAgICAgICAgIGxuZ3MgPSB0aGlzLmxhbmd1YWdlVXRpbHMudG9SZXNvbHZlSGllcmFyY2h5KG9wdGlvbnMubG5nIHx8IHRoaXMubGFuZ3VhZ2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxuZ3MucHVzaChvcHRpb25zLmxuZyB8fCB0aGlzLmxhbmd1YWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2F2ZU1pc3NpbmcpIHtcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLm1pc3NpbmdLZXlIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLm9wdGlvbnMubWlzc2luZ0tleUhhbmRsZXIobG5ncywgbmFtZXNwYWNlLCBrZXksIHJlcyk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmJhY2tlbmRDb25uZWN0b3IgJiYgdGhpcy5iYWNrZW5kQ29ubmVjdG9yLnNhdmVNaXNzaW5nKSB7XG4gICAgICAgICAgICB0aGlzLmJhY2tlbmRDb25uZWN0b3Iuc2F2ZU1pc3NpbmcobG5ncywgbmFtZXNwYWNlLCBrZXksIHJlcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbWl0KCdtaXNzaW5nS2V5JywgbG5ncywgbmFtZXNwYWNlLCBrZXksIHJlcyk7XG4gICAgICB9XG5cbiAgICAgIC8vIGV4dGVuZFxuICAgICAgcmVzID0gdGhpcy5leHRlbmRUcmFuc2xhdGlvbihyZXMsIGtleSwgb3B0aW9ucyk7XG5cbiAgICAgIC8vIGFwcGVuZCBuYW1lc3BhY2UgaWYgc3RpbGwga2V5XG4gICAgICBpZiAodXNlZEtleSAmJiByZXMgPT09IGtleSAmJiB0aGlzLm9wdGlvbnMuYXBwZW5kTmFtZXNwYWNlVG9NaXNzaW5nS2V5KSByZXMgPSBuYW1lc3BhY2UgKyAnOicgKyBrZXk7XG5cbiAgICAgIC8vIHBhcnNlTWlzc2luZ0tleUhhbmRsZXJcbiAgICAgIGlmICh1c2VkS2V5ICYmIHRoaXMub3B0aW9ucy5wYXJzZU1pc3NpbmdLZXlIYW5kbGVyKSByZXMgPSB0aGlzLm9wdGlvbnMucGFyc2VNaXNzaW5nS2V5SGFuZGxlcihyZXMpO1xuICAgIH1cblxuICAgIC8vIHJldHVyblxuICAgIHJldHVybiByZXM7XG4gIH07XG5cbiAgVHJhbnNsYXRvci5wcm90b3R5cGUuZXh0ZW5kVHJhbnNsYXRpb24gPSBmdW5jdGlvbiBleHRlbmRUcmFuc2xhdGlvbihyZXMsIGtleSwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgaWYgKG9wdGlvbnMuaW50ZXJwb2xhdGlvbikgdGhpcy5pbnRlcnBvbGF0b3IuaW5pdChfZXh0ZW5kcyh7fSwgb3B0aW9ucywgeyBpbnRlcnBvbGF0aW9uOiBfZXh0ZW5kcyh7fSwgdGhpcy5vcHRpb25zLmludGVycG9sYXRpb24sIG9wdGlvbnMuaW50ZXJwb2xhdGlvbikgfSkpO1xuXG4gICAgLy8gaW50ZXJwb2xhdGVcbiAgICB2YXIgZGF0YSA9IG9wdGlvbnMucmVwbGFjZSAmJiB0eXBlb2Ygb3B0aW9ucy5yZXBsYWNlICE9PSAnc3RyaW5nJyA/IG9wdGlvbnMucmVwbGFjZSA6IG9wdGlvbnM7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLmRlZmF1bHRWYXJpYWJsZXMpIGRhdGEgPSBfZXh0ZW5kcyh7fSwgdGhpcy5vcHRpb25zLmludGVycG9sYXRpb24uZGVmYXVsdFZhcmlhYmxlcywgZGF0YSk7XG4gICAgcmVzID0gdGhpcy5pbnRlcnBvbGF0b3IuaW50ZXJwb2xhdGUocmVzLCBkYXRhLCBvcHRpb25zLmxuZyB8fCB0aGlzLmxhbmd1YWdlKTtcblxuICAgIC8vIG5lc3RpbmdcbiAgICBpZiAob3B0aW9ucy5uZXN0ICE9PSBmYWxzZSkgcmVzID0gdGhpcy5pbnRlcnBvbGF0b3IubmVzdChyZXMsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBfdGhpczIudHJhbnNsYXRlLmFwcGx5KF90aGlzMiwgYXJndW1lbnRzKTtcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIGlmIChvcHRpb25zLmludGVycG9sYXRpb24pIHRoaXMuaW50ZXJwb2xhdG9yLnJlc2V0KCk7XG5cbiAgICAvLyBwb3N0IHByb2Nlc3NcbiAgICB2YXIgcG9zdFByb2Nlc3MgPSBvcHRpb25zLnBvc3RQcm9jZXNzIHx8IHRoaXMub3B0aW9ucy5wb3N0UHJvY2VzcztcbiAgICB2YXIgcG9zdFByb2Nlc3Nvck5hbWVzID0gdHlwZW9mIHBvc3RQcm9jZXNzID09PSAnc3RyaW5nJyA/IFtwb3N0UHJvY2Vzc10gOiBwb3N0UHJvY2VzcztcblxuICAgIGlmIChyZXMgIT09IHVuZGVmaW5lZCAmJiBwb3N0UHJvY2Vzc29yTmFtZXMgJiYgcG9zdFByb2Nlc3Nvck5hbWVzLmxlbmd0aCAmJiBvcHRpb25zLmFwcGx5UG9zdFByb2Nlc3NvciAhPT0gZmFsc2UpIHtcbiAgICAgIHJlcyA9IHBvc3RQcm9jZXNzb3IuaGFuZGxlKHBvc3RQcm9jZXNzb3JOYW1lcywgcmVzLCBrZXksIG9wdGlvbnMsIHRoaXMpO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH07XG5cbiAgVHJhbnNsYXRvci5wcm90b3R5cGUucmVzb2x2ZSA9IGZ1bmN0aW9uIHJlc29sdmUoa2V5cykge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgdmFyIGZvdW5kID0gdm9pZCAwO1xuXG4gICAgaWYgKHR5cGVvZiBrZXlzID09PSAnc3RyaW5nJykga2V5cyA9IFtrZXlzXTtcblxuICAgIC8vIGZvckVhY2ggcG9zc2libGUga2V5XG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7XG4gICAgICBpZiAoX3RoaXMzLmlzVmFsaWRMb29rdXAoZm91bmQpKSByZXR1cm47XG5cbiAgICAgIHZhciBleHRyYWN0ZWQgPSBfdGhpczMuZXh0cmFjdEZyb21LZXkoaywgb3B0aW9ucyk7XG4gICAgICB2YXIga2V5ID0gZXh0cmFjdGVkLmtleTtcbiAgICAgIHZhciBuYW1lc3BhY2VzID0gZXh0cmFjdGVkLm5hbWVzcGFjZXM7XG4gICAgICBpZiAoX3RoaXMzLm9wdGlvbnMuZmFsbGJhY2tOUykgbmFtZXNwYWNlcyA9IG5hbWVzcGFjZXMuY29uY2F0KF90aGlzMy5vcHRpb25zLmZhbGxiYWNrTlMpO1xuXG4gICAgICB2YXIgbmVlZHNQbHVyYWxIYW5kbGluZyA9IG9wdGlvbnMuY291bnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5jb3VudCAhPT0gJ3N0cmluZyc7XG4gICAgICB2YXIgbmVlZHNDb250ZXh0SGFuZGxpbmcgPSBvcHRpb25zLmNvbnRleHQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5jb250ZXh0ID09PSAnc3RyaW5nJyAmJiBvcHRpb25zLmNvbnRleHQgIT09ICcnO1xuXG4gICAgICB2YXIgY29kZXMgPSBvcHRpb25zLmxuZ3MgPyBvcHRpb25zLmxuZ3MgOiBfdGhpczMubGFuZ3VhZ2VVdGlscy50b1Jlc29sdmVIaWVyYXJjaHkob3B0aW9ucy5sbmcgfHwgX3RoaXMzLmxhbmd1YWdlKTtcblxuICAgICAgbmFtZXNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChucykge1xuICAgICAgICBpZiAoX3RoaXMzLmlzVmFsaWRMb29rdXAoZm91bmQpKSByZXR1cm47XG5cbiAgICAgICAgY29kZXMuZm9yRWFjaChmdW5jdGlvbiAoY29kZSkge1xuICAgICAgICAgIGlmIChfdGhpczMuaXNWYWxpZExvb2t1cChmb3VuZCkpIHJldHVybjtcblxuICAgICAgICAgIHZhciBmaW5hbEtleSA9IGtleTtcbiAgICAgICAgICB2YXIgZmluYWxLZXlzID0gW2ZpbmFsS2V5XTtcblxuICAgICAgICAgIHZhciBwbHVyYWxTdWZmaXggPSB2b2lkIDA7XG4gICAgICAgICAgaWYgKG5lZWRzUGx1cmFsSGFuZGxpbmcpIHBsdXJhbFN1ZmZpeCA9IF90aGlzMy5wbHVyYWxSZXNvbHZlci5nZXRTdWZmaXgoY29kZSwgb3B0aW9ucy5jb3VudCk7XG5cbiAgICAgICAgICAvLyBmYWxsYmFjayBmb3IgcGx1cmFsIGlmIGNvbnRleHQgbm90IGZvdW5kXG4gICAgICAgICAgaWYgKG5lZWRzUGx1cmFsSGFuZGxpbmcgJiYgbmVlZHNDb250ZXh0SGFuZGxpbmcpIGZpbmFsS2V5cy5wdXNoKGZpbmFsS2V5ICsgcGx1cmFsU3VmZml4KTtcblxuICAgICAgICAgIC8vIGdldCBrZXkgZm9yIGNvbnRleHQgaWYgbmVlZGVkXG4gICAgICAgICAgaWYgKG5lZWRzQ29udGV4dEhhbmRsaW5nKSBmaW5hbEtleXMucHVzaChmaW5hbEtleSArPSAnJyArIF90aGlzMy5vcHRpb25zLmNvbnRleHRTZXBhcmF0b3IgKyBvcHRpb25zLmNvbnRleHQpO1xuXG4gICAgICAgICAgLy8gZ2V0IGtleSBmb3IgcGx1cmFsIGlmIG5lZWRlZFxuICAgICAgICAgIGlmIChuZWVkc1BsdXJhbEhhbmRsaW5nKSBmaW5hbEtleXMucHVzaChmaW5hbEtleSArPSBwbHVyYWxTdWZmaXgpO1xuXG4gICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIGZpbmFsS2V5cyBzdGFydGluZyB3aXRoIG1vc3Qgc3BlY2lmaWMgcGx1cmFsa2V5ICgtPiBjb250ZXh0a2V5IG9ubHkpIC0+IHNpbmd1bGFya2V5IG9ubHlcbiAgICAgICAgICB2YXIgcG9zc2libGVLZXkgPSB2b2lkIDA7XG4gICAgICAgICAgLyogZXNsaW50IG5vLWNvbmQtYXNzaWduOiAwICovXG4gICAgICAgICAgd2hpbGUgKHBvc3NpYmxlS2V5ID0gZmluYWxLZXlzLnBvcCgpKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzMy5pc1ZhbGlkTG9va3VwKGZvdW5kKSkge1xuICAgICAgICAgICAgICBmb3VuZCA9IF90aGlzMy5nZXRSZXNvdXJjZShjb2RlLCBucywgcG9zc2libGVLZXksIG9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBmb3VuZDtcbiAgfTtcblxuICBUcmFuc2xhdG9yLnByb3RvdHlwZS5pc1ZhbGlkTG9va3VwID0gZnVuY3Rpb24gaXNWYWxpZExvb2t1cChyZXMpIHtcbiAgICByZXR1cm4gcmVzICE9PSB1bmRlZmluZWQgJiYgISghdGhpcy5vcHRpb25zLnJldHVybk51bGwgJiYgcmVzID09PSBudWxsKSAmJiAhKCF0aGlzLm9wdGlvbnMucmV0dXJuRW1wdHlTdHJpbmcgJiYgcmVzID09PSAnJyk7XG4gIH07XG5cbiAgVHJhbnNsYXRvci5wcm90b3R5cGUuZ2V0UmVzb3VyY2UgPSBmdW5jdGlvbiBnZXRSZXNvdXJjZShjb2RlLCBucywga2V5KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTdG9yZS5nZXRSZXNvdXJjZShjb2RlLCBucywga2V5LCBvcHRpb25zKTtcbiAgfTtcblxuICByZXR1cm4gVHJhbnNsYXRvcjtcbn0oRXZlbnRFbWl0dGVyKTtcblxuZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcbn1cblxudmFyIExhbmd1YWdlVXRpbCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTGFuZ3VhZ2VVdGlsKG9wdGlvbnMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBMYW5ndWFnZVV0aWwpO1xuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMud2hpdGVsaXN0ID0gdGhpcy5vcHRpb25zLndoaXRlbGlzdCB8fCBmYWxzZTtcbiAgICB0aGlzLmxvZ2dlciA9IGJhc2VMb2dnZXIuY3JlYXRlKCdsYW5ndWFnZVV0aWxzJyk7XG4gIH1cblxuICBMYW5ndWFnZVV0aWwucHJvdG90eXBlLmdldFNjcmlwdFBhcnRGcm9tQ29kZSA9IGZ1bmN0aW9uIGdldFNjcmlwdFBhcnRGcm9tQ29kZShjb2RlKSB7XG4gICAgaWYgKCFjb2RlIHx8IGNvZGUuaW5kZXhPZignLScpIDwgMCkgcmV0dXJuIG51bGw7XG5cbiAgICB2YXIgcCA9IGNvZGUuc3BsaXQoJy0nKTtcbiAgICBpZiAocC5sZW5ndGggPT09IDIpIHJldHVybiBudWxsO1xuICAgIHAucG9wKCk7XG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0TGFuZ3VhZ2VDb2RlKHAuam9pbignLScpKTtcbiAgfTtcblxuICBMYW5ndWFnZVV0aWwucHJvdG90eXBlLmdldExhbmd1YWdlUGFydEZyb21Db2RlID0gZnVuY3Rpb24gZ2V0TGFuZ3VhZ2VQYXJ0RnJvbUNvZGUoY29kZSkge1xuICAgIGlmICghY29kZSB8fCBjb2RlLmluZGV4T2YoJy0nKSA8IDApIHJldHVybiBjb2RlO1xuXG4gICAgdmFyIHAgPSBjb2RlLnNwbGl0KCctJyk7XG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0TGFuZ3VhZ2VDb2RlKHBbMF0pO1xuICB9O1xuXG4gIExhbmd1YWdlVXRpbC5wcm90b3R5cGUuZm9ybWF0TGFuZ3VhZ2VDb2RlID0gZnVuY3Rpb24gZm9ybWF0TGFuZ3VhZ2VDb2RlKGNvZGUpIHtcbiAgICAvLyBodHRwOi8vd3d3LmlhbmEub3JnL2Fzc2lnbm1lbnRzL2xhbmd1YWdlLXRhZ3MvbGFuZ3VhZ2UtdGFncy54aHRtbFxuICAgIGlmICh0eXBlb2YgY29kZSA9PT0gJ3N0cmluZycgJiYgY29kZS5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgdmFyIHNwZWNpYWxDYXNlcyA9IFsnaGFucycsICdoYW50JywgJ2xhdG4nLCAnY3lybCcsICdjYW5zJywgJ21vbmcnLCAnYXJhYiddO1xuICAgICAgdmFyIHAgPSBjb2RlLnNwbGl0KCctJyk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubG93ZXJDYXNlTG5nKSB7XG4gICAgICAgIHAgPSBwLm1hcChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICAgIHJldHVybiBwYXJ0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChwLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBwWzBdID0gcFswXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBwWzFdID0gcFsxXS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgIGlmIChzcGVjaWFsQ2FzZXMuaW5kZXhPZihwWzFdLnRvTG93ZXJDYXNlKCkpID4gLTEpIHBbMV0gPSBjYXBpdGFsaXplKHBbMV0udG9Mb3dlckNhc2UoKSk7XG4gICAgICB9IGVsc2UgaWYgKHAubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIHBbMF0gPSBwWzBdLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgLy8gaWYgbGVuZ2h0IDIgZ3Vlc3MgaXQncyBhIGNvdW50cnlcbiAgICAgICAgaWYgKHBbMV0ubGVuZ3RoID09PSAyKSBwWzFdID0gcFsxXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBpZiAocFswXSAhPT0gJ3NnbicgJiYgcFsyXS5sZW5ndGggPT09IDIpIHBbMl0gPSBwWzJdLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgaWYgKHNwZWNpYWxDYXNlcy5pbmRleE9mKHBbMV0udG9Mb3dlckNhc2UoKSkgPiAtMSkgcFsxXSA9IGNhcGl0YWxpemUocFsxXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgaWYgKHNwZWNpYWxDYXNlcy5pbmRleE9mKHBbMl0udG9Mb3dlckNhc2UoKSkgPiAtMSkgcFsyXSA9IGNhcGl0YWxpemUocFsyXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHAuam9pbignLScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY2xlYW5Db2RlIHx8IHRoaXMub3B0aW9ucy5sb3dlckNhc2VMbmcgPyBjb2RlLnRvTG93ZXJDYXNlKCkgOiBjb2RlO1xuICB9O1xuXG4gIExhbmd1YWdlVXRpbC5wcm90b3R5cGUuaXNXaGl0ZWxpc3RlZCA9IGZ1bmN0aW9uIGlzV2hpdGVsaXN0ZWQoY29kZSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMubG9hZCA9PT0gJ2xhbmd1YWdlT25seScgfHwgdGhpcy5vcHRpb25zLm5vbkV4cGxpY2l0V2hpdGVsaXN0KSB7XG4gICAgICBjb2RlID0gdGhpcy5nZXRMYW5ndWFnZVBhcnRGcm9tQ29kZShjb2RlKTtcbiAgICB9XG4gICAgcmV0dXJuICF0aGlzLndoaXRlbGlzdCB8fCAhdGhpcy53aGl0ZWxpc3QubGVuZ3RoIHx8IHRoaXMud2hpdGVsaXN0LmluZGV4T2YoY29kZSkgPiAtMTtcbiAgfTtcblxuICBMYW5ndWFnZVV0aWwucHJvdG90eXBlLmdldEZhbGxiYWNrQ29kZXMgPSBmdW5jdGlvbiBnZXRGYWxsYmFja0NvZGVzKGZhbGxiYWNrcywgY29kZSkge1xuICAgIGlmICghZmFsbGJhY2tzKSByZXR1cm4gW107XG4gICAgaWYgKHR5cGVvZiBmYWxsYmFja3MgPT09ICdzdHJpbmcnKSBmYWxsYmFja3MgPSBbZmFsbGJhY2tzXTtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseShmYWxsYmFja3MpID09PSAnW29iamVjdCBBcnJheV0nKSByZXR1cm4gZmFsbGJhY2tzO1xuXG4gICAgaWYgKCFjb2RlKSByZXR1cm4gZmFsbGJhY2tzLmRlZmF1bHQgfHwgW107XG5cbiAgICAvLyBhc3VtZSB3ZSBoYXZlIGFuIG9iamVjdCBkZWZpbmluZyBmYWxsYmFja3NcbiAgICB2YXIgZm91bmQgPSBmYWxsYmFja3NbY29kZV07XG4gICAgaWYgKCFmb3VuZCkgZm91bmQgPSBmYWxsYmFja3NbdGhpcy5nZXRTY3JpcHRQYXJ0RnJvbUNvZGUoY29kZSldO1xuICAgIGlmICghZm91bmQpIGZvdW5kID0gZmFsbGJhY2tzW3RoaXMuZm9ybWF0TGFuZ3VhZ2VDb2RlKGNvZGUpXTtcbiAgICBpZiAoIWZvdW5kKSBmb3VuZCA9IGZhbGxiYWNrcy5kZWZhdWx0O1xuXG4gICAgcmV0dXJuIGZvdW5kIHx8IFtdO1xuICB9O1xuXG4gIExhbmd1YWdlVXRpbC5wcm90b3R5cGUudG9SZXNvbHZlSGllcmFyY2h5ID0gZnVuY3Rpb24gdG9SZXNvbHZlSGllcmFyY2h5KGNvZGUsIGZhbGxiYWNrQ29kZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgZmFsbGJhY2tDb2RlcyA9IHRoaXMuZ2V0RmFsbGJhY2tDb2RlcyhmYWxsYmFja0NvZGUgfHwgdGhpcy5vcHRpb25zLmZhbGxiYWNrTG5nIHx8IFtdLCBjb2RlKTtcblxuICAgIHZhciBjb2RlcyA9IFtdO1xuICAgIHZhciBhZGRDb2RlID0gZnVuY3Rpb24gYWRkQ29kZShjKSB7XG4gICAgICBpZiAoIWMpIHJldHVybjtcbiAgICAgIGlmIChfdGhpcy5pc1doaXRlbGlzdGVkKGMpKSB7XG4gICAgICAgIGNvZGVzLnB1c2goYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfdGhpcy5sb2dnZXIud2FybigncmVqZWN0aW5nIG5vbi13aGl0ZWxpc3RlZCBsYW5ndWFnZSBjb2RlOiAnICsgYyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgY29kZSA9PT0gJ3N0cmluZycgJiYgY29kZS5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5sb2FkICE9PSAnbGFuZ3VhZ2VPbmx5JykgYWRkQ29kZSh0aGlzLmZvcm1hdExhbmd1YWdlQ29kZShjb2RlKSk7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmxvYWQgIT09ICdsYW5ndWFnZU9ubHknICYmIHRoaXMub3B0aW9ucy5sb2FkICE9PSAnY3VycmVudE9ubHknKSBhZGRDb2RlKHRoaXMuZ2V0U2NyaXB0UGFydEZyb21Db2RlKGNvZGUpKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubG9hZCAhPT0gJ2N1cnJlbnRPbmx5JykgYWRkQ29kZSh0aGlzLmdldExhbmd1YWdlUGFydEZyb21Db2RlKGNvZGUpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb2RlID09PSAnc3RyaW5nJykge1xuICAgICAgYWRkQ29kZSh0aGlzLmZvcm1hdExhbmd1YWdlQ29kZShjb2RlKSk7XG4gICAgfVxuXG4gICAgZmFsbGJhY2tDb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChmYykge1xuICAgICAgaWYgKGNvZGVzLmluZGV4T2YoZmMpIDwgMCkgYWRkQ29kZShfdGhpcy5mb3JtYXRMYW5ndWFnZUNvZGUoZmMpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb2RlcztcbiAgfTtcblxuICByZXR1cm4gTGFuZ3VhZ2VVdGlsO1xufSgpO1xuXG4vLyBkZWZpbml0aW9uIGh0dHA6Ly90cmFuc2xhdGUuc291cmNlZm9yZ2UubmV0L3dpa2kvbDEwbi9wbHVyYWxmb3Jtc1xuLyogZXNsaW50LWRpc2FibGUgKi9cbnZhciBzZXRzID0gW3sgbG5nczogWydhY2gnLCAnYWsnLCAnYW0nLCAnYXJuJywgJ2JyJywgJ2ZpbCcsICdndW4nLCAnbG4nLCAnbWZlJywgJ21nJywgJ21pJywgJ29jJywgJ3RnJywgJ3RpJywgJ3RyJywgJ3V6JywgJ3dhJ10sIG5yOiBbMSwgMl0sIGZjOiAxIH0sIHsgbG5nczogWydhZicsICdhbicsICdhc3QnLCAnYXonLCAnYmcnLCAnYm4nLCAnY2EnLCAnZGEnLCAnZGUnLCAnZGV2JywgJ2VsJywgJ2VuJywgJ2VvJywgJ2VzJywgJ2VzX2FyJywgJ2V0JywgJ2V1JywgJ2ZpJywgJ2ZvJywgJ2Z1cicsICdmeScsICdnbCcsICdndScsICdoYScsICdoZScsICdoaScsICdodScsICdoeScsICdpYScsICdpdCcsICdrbicsICdrdScsICdsYicsICdtYWknLCAnbWwnLCAnbW4nLCAnbXInLCAnbmFoJywgJ25hcCcsICduYicsICduZScsICdubCcsICdubicsICdubycsICduc28nLCAncGEnLCAncGFwJywgJ3BtcycsICdwcycsICdwdCcsICdwdF9icicsICdybScsICdzY28nLCAnc2UnLCAnc2knLCAnc28nLCAnc29uJywgJ3NxJywgJ3N2JywgJ3N3JywgJ3RhJywgJ3RlJywgJ3RrJywgJ3VyJywgJ3lvJ10sIG5yOiBbMSwgMl0sIGZjOiAyIH0sIHsgbG5nczogWydheScsICdibycsICdjZ2cnLCAnZmEnLCAnaWQnLCAnamEnLCAnamJvJywgJ2thJywgJ2trJywgJ2ttJywgJ2tvJywgJ2t5JywgJ2xvJywgJ21zJywgJ3NhaCcsICdzdScsICd0aCcsICd0dCcsICd1ZycsICd2aScsICd3bycsICd6aCddLCBucjogWzFdLCBmYzogMyB9LCB7IGxuZ3M6IFsnYmUnLCAnYnMnLCAnZHonLCAnaHInLCAncnUnLCAnc3InLCAndWsnXSwgbnI6IFsxLCAyLCA1XSwgZmM6IDQgfSwgeyBsbmdzOiBbJ2FyJ10sIG5yOiBbMCwgMSwgMiwgMywgMTEsIDEwMF0sIGZjOiA1IH0sIHsgbG5nczogWydjcycsICdzayddLCBucjogWzEsIDIsIDVdLCBmYzogNiB9LCB7IGxuZ3M6IFsnY3NiJywgJ3BsJ10sIG5yOiBbMSwgMiwgNV0sIGZjOiA3IH0sIHsgbG5nczogWydjeSddLCBucjogWzEsIDIsIDMsIDhdLCBmYzogOCB9LCB7IGxuZ3M6IFsnZnInXSwgbnI6IFsxLCAyXSwgZmM6IDkgfSwgeyBsbmdzOiBbJ2dhJ10sIG5yOiBbMSwgMiwgMywgNywgMTFdLCBmYzogMTAgfSwgeyBsbmdzOiBbJ2dkJ10sIG5yOiBbMSwgMiwgMywgMjBdLCBmYzogMTEgfSwgeyBsbmdzOiBbJ2lzJ10sIG5yOiBbMSwgMl0sIGZjOiAxMiB9LCB7IGxuZ3M6IFsnanYnXSwgbnI6IFswLCAxXSwgZmM6IDEzIH0sIHsgbG5nczogWydrdyddLCBucjogWzEsIDIsIDMsIDRdLCBmYzogMTQgfSwgeyBsbmdzOiBbJ2x0J10sIG5yOiBbMSwgMiwgMTBdLCBmYzogMTUgfSwgeyBsbmdzOiBbJ2x2J10sIG5yOiBbMSwgMiwgMF0sIGZjOiAxNiB9LCB7IGxuZ3M6IFsnbWsnXSwgbnI6IFsxLCAyXSwgZmM6IDE3IH0sIHsgbG5nczogWydtbmsnXSwgbnI6IFswLCAxLCAyXSwgZmM6IDE4IH0sIHsgbG5nczogWydtdCddLCBucjogWzEsIDIsIDExLCAyMF0sIGZjOiAxOSB9LCB7IGxuZ3M6IFsnb3InXSwgbnI6IFsyLCAxXSwgZmM6IDIgfSwgeyBsbmdzOiBbJ3JvJ10sIG5yOiBbMSwgMiwgMjBdLCBmYzogMjAgfSwgeyBsbmdzOiBbJ3NsJ10sIG5yOiBbNSwgMSwgMiwgM10sIGZjOiAyMSB9XTtcblxudmFyIF9ydWxlc1BsdXJhbHNUeXBlcyA9IHtcbiAgMTogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuID4gMSk7XG4gIH0sXG4gIDI6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiAhPSAxKTtcbiAgfSxcbiAgMzogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0sXG4gIDQ6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiAlIDEwID09IDEgJiYgbiAlIDEwMCAhPSAxMSA/IDAgOiBuICUgMTAgPj0gMiAmJiBuICUgMTAgPD0gNCAmJiAobiAlIDEwMCA8IDEwIHx8IG4gJSAxMDAgPj0gMjApID8gMSA6IDIpO1xuICB9LFxuICA1OiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT09IDAgPyAwIDogbiA9PSAxID8gMSA6IG4gPT0gMiA/IDIgOiBuICUgMTAwID49IDMgJiYgbiAlIDEwMCA8PSAxMCA/IDMgOiBuICUgMTAwID49IDExID8gNCA6IDUpO1xuICB9LFxuICA2OiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSA/IDAgOiBuID49IDIgJiYgbiA8PSA0ID8gMSA6IDIpO1xuICB9LFxuICA3OiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSA/IDAgOiBuICUgMTAgPj0gMiAmJiBuICUgMTAgPD0gNCAmJiAobiAlIDEwMCA8IDEwIHx8IG4gJSAxMDAgPj0gMjApID8gMSA6IDIpO1xuICB9LFxuICA4OiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSA/IDAgOiBuID09IDIgPyAxIDogbiAhPSA4ICYmIG4gIT0gMTEgPyAyIDogMyk7XG4gIH0sXG4gIDk6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA+PSAyKTtcbiAgfSxcbiAgMTA6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PSAxID8gMCA6IG4gPT0gMiA/IDEgOiBuIDwgNyA/IDIgOiBuIDwgMTEgPyAzIDogNCk7XG4gIH0sXG4gIDExOiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSB8fCBuID09IDExID8gMCA6IG4gPT0gMiB8fCBuID09IDEyID8gMSA6IG4gPiAyICYmIG4gPCAyMCA/IDIgOiAzKTtcbiAgfSxcbiAgMTI6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiAlIDEwICE9IDEgfHwgbiAlIDEwMCA9PSAxMSk7XG4gIH0sXG4gIDEzOiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gIT09IDApO1xuICB9LFxuICAxNDogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuID09IDEgPyAwIDogbiA9PSAyID8gMSA6IG4gPT0gMyA/IDIgOiAzKTtcbiAgfSxcbiAgMTU6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiAlIDEwID09IDEgJiYgbiAlIDEwMCAhPSAxMSA/IDAgOiBuICUgMTAgPj0gMiAmJiAobiAlIDEwMCA8IDEwIHx8IG4gJSAxMDAgPj0gMjApID8gMSA6IDIpO1xuICB9LFxuICAxNjogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuICUgMTAgPT0gMSAmJiBuICUgMTAwICE9IDExID8gMCA6IG4gIT09IDAgPyAxIDogMik7XG4gIH0sXG4gIDE3OiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSB8fCBuICUgMTAgPT0gMSA/IDAgOiAxKTtcbiAgfSxcbiAgMTg6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PSAwID8gMCA6IG4gPT0gMSA/IDEgOiAyKTtcbiAgfSxcbiAgMTk6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PSAxID8gMCA6IG4gPT09IDAgfHwgbiAlIDEwMCA+IDEgJiYgbiAlIDEwMCA8IDExID8gMSA6IG4gJSAxMDAgPiAxMCAmJiBuICUgMTAwIDwgMjAgPyAyIDogMyk7XG4gIH0sXG4gIDIwOiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSA/IDAgOiBuID09PSAwIHx8IG4gJSAxMDAgPiAwICYmIG4gJSAxMDAgPCAyMCA/IDEgOiAyKTtcbiAgfSxcbiAgMjE6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiAlIDEwMCA9PSAxID8gMSA6IG4gJSAxMDAgPT0gMiA/IDIgOiBuICUgMTAwID09IDMgfHwgbiAlIDEwMCA9PSA0ID8gMyA6IDApO1xuICB9XG59O1xuLyogZXNsaW50LWVuYWJsZSAqL1xuXG5mdW5jdGlvbiBjcmVhdGVSdWxlcygpIHtcbiAgdmFyIHJ1bGVzID0ge307XG4gIHNldHMuZm9yRWFjaChmdW5jdGlvbiAoc2V0JCQxKSB7XG4gICAgc2V0JCQxLmxuZ3MuZm9yRWFjaChmdW5jdGlvbiAobCkge1xuICAgICAgcnVsZXNbbF0gPSB7XG4gICAgICAgIG51bWJlcnM6IHNldCQkMS5ucixcbiAgICAgICAgcGx1cmFsczogX3J1bGVzUGx1cmFsc1R5cGVzW3NldCQkMS5mY11cbiAgICAgIH07XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gcnVsZXM7XG59XG5cbnZhciBQbHVyYWxSZXNvbHZlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUGx1cmFsUmVzb2x2ZXIobGFuZ3VhZ2VVdGlscykge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBQbHVyYWxSZXNvbHZlcik7XG5cbiAgICB0aGlzLmxhbmd1YWdlVXRpbHMgPSBsYW5ndWFnZVV0aWxzO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLmxvZ2dlciA9IGJhc2VMb2dnZXIuY3JlYXRlKCdwbHVyYWxSZXNvbHZlcicpO1xuXG4gICAgdGhpcy5ydWxlcyA9IGNyZWF0ZVJ1bGVzKCk7XG4gIH1cblxuICBQbHVyYWxSZXNvbHZlci5wcm90b3R5cGUuYWRkUnVsZSA9IGZ1bmN0aW9uIGFkZFJ1bGUobG5nLCBvYmopIHtcbiAgICB0aGlzLnJ1bGVzW2xuZ10gPSBvYmo7XG4gIH07XG5cbiAgUGx1cmFsUmVzb2x2ZXIucHJvdG90eXBlLmdldFJ1bGUgPSBmdW5jdGlvbiBnZXRSdWxlKGNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5ydWxlc1t0aGlzLmxhbmd1YWdlVXRpbHMuZ2V0TGFuZ3VhZ2VQYXJ0RnJvbUNvZGUoY29kZSldO1xuICB9O1xuXG4gIFBsdXJhbFJlc29sdmVyLnByb3RvdHlwZS5uZWVkc1BsdXJhbCA9IGZ1bmN0aW9uIG5lZWRzUGx1cmFsKGNvZGUpIHtcbiAgICB2YXIgcnVsZSA9IHRoaXMuZ2V0UnVsZShjb2RlKTtcblxuICAgIHJldHVybiBydWxlICYmIHJ1bGUubnVtYmVycy5sZW5ndGggPiAxO1xuICB9O1xuXG4gIFBsdXJhbFJlc29sdmVyLnByb3RvdHlwZS5nZXRTdWZmaXggPSBmdW5jdGlvbiBnZXRTdWZmaXgoY29kZSwgY291bnQpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHJ1bGUgPSB0aGlzLmdldFJ1bGUoY29kZSk7XG5cbiAgICBpZiAocnVsZSkge1xuICAgICAgaWYgKHJ1bGUubnVtYmVycy5sZW5ndGggPT09IDEpIHJldHVybiAnJzsgLy8gb25seSBzaW5ndWxhclxuXG4gICAgICB2YXIgaWR4ID0gcnVsZS5ub0FicyA/IHJ1bGUucGx1cmFscyhjb3VudCkgOiBydWxlLnBsdXJhbHMoTWF0aC5hYnMoY291bnQpKTtcbiAgICAgIHZhciBzdWZmaXggPSBydWxlLm51bWJlcnNbaWR4XTtcblxuICAgICAgLy8gc3BlY2lhbCB0cmVhdG1lbnQgZm9yIGxuZ3Mgb25seSBoYXZpbmcgc2luZ3VsYXIgYW5kIHBsdXJhbFxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaW1wbGlmeVBsdXJhbFN1ZmZpeCAmJiBydWxlLm51bWJlcnMubGVuZ3RoID09PSAyICYmIHJ1bGUubnVtYmVyc1swXSA9PT0gMSkge1xuICAgICAgICBpZiAoc3VmZml4ID09PSAyKSB7XG4gICAgICAgICAgc3VmZml4ID0gJ3BsdXJhbCc7XG4gICAgICAgIH0gZWxzZSBpZiAoc3VmZml4ID09PSAxKSB7XG4gICAgICAgICAgc3VmZml4ID0gJyc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHJldHVyblN1ZmZpeCA9IGZ1bmN0aW9uIHJldHVyblN1ZmZpeCgpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLm9wdGlvbnMucHJlcGVuZCAmJiBzdWZmaXgudG9TdHJpbmcoKSA/IF90aGlzLm9wdGlvbnMucHJlcGVuZCArIHN1ZmZpeC50b1N0cmluZygpIDogc3VmZml4LnRvU3RyaW5nKCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBDT01QQVRJQklMSVRZIEpTT05cbiAgICAgIC8vIHYxXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmNvbXBhdGliaWxpdHlKU09OID09PSAndjEnKSB7XG4gICAgICAgIGlmIChzdWZmaXggPT09IDEpIHJldHVybiAnJztcbiAgICAgICAgaWYgKHR5cGVvZiBzdWZmaXggPT09ICdudW1iZXInKSByZXR1cm4gJ19wbHVyYWxfJyArIHN1ZmZpeC50b1N0cmluZygpO1xuICAgICAgICByZXR1cm4gcmV0dXJuU3VmZml4KCk7XG4gICAgICB9IGVsc2UgaWYgKCAvKiB2MiAqL3RoaXMub3B0aW9ucy5jb21wYXRpYmlsaXR5SlNPTiA9PT0gJ3YyJyB8fCBydWxlLm51bWJlcnMubGVuZ3RoID09PSAyICYmIHJ1bGUubnVtYmVyc1swXSA9PT0gMSkge1xuICAgICAgICByZXR1cm4gcmV0dXJuU3VmZml4KCk7XG4gICAgICB9IGVsc2UgaWYgKCAvKiB2MyAtIGdldHRleHQgaW5kZXggKi9ydWxlLm51bWJlcnMubGVuZ3RoID09PSAyICYmIHJ1bGUubnVtYmVyc1swXSA9PT0gMSkge1xuICAgICAgICByZXR1cm4gcmV0dXJuU3VmZml4KCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLnByZXBlbmQgJiYgaWR4LnRvU3RyaW5nKCkgPyB0aGlzLm9wdGlvbnMucHJlcGVuZCArIGlkeC50b1N0cmluZygpIDogaWR4LnRvU3RyaW5nKCk7XG4gICAgfVxuXG4gICAgdGhpcy5sb2dnZXIud2Fybignbm8gcGx1cmFsIHJ1bGUgZm91bmQgZm9yOiAnICsgY29kZSk7XG4gICAgcmV0dXJuICcnO1xuICB9O1xuXG4gIHJldHVybiBQbHVyYWxSZXNvbHZlcjtcbn0oKTtcblxudmFyIEludGVycG9sYXRvciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gSW50ZXJwb2xhdG9yKCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBJbnRlcnBvbGF0b3IpO1xuXG4gICAgdGhpcy5sb2dnZXIgPSBiYXNlTG9nZ2VyLmNyZWF0ZSgnaW50ZXJwb2xhdG9yJyk7XG5cbiAgICB0aGlzLmluaXQob3B0aW9ucywgdHJ1ZSk7XG4gIH1cblxuICAvKiBlc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246IDAgKi9cblxuXG4gIEludGVycG9sYXRvci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciByZXNldCA9IGFyZ3VtZW50c1sxXTtcblxuICAgIGlmIChyZXNldCkge1xuICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgIHRoaXMuZm9ybWF0ID0gb3B0aW9ucy5pbnRlcnBvbGF0aW9uICYmIG9wdGlvbnMuaW50ZXJwb2xhdGlvbi5mb3JtYXQgfHwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH07XG4gICAgICB0aGlzLmVzY2FwZSA9IG9wdGlvbnMuaW50ZXJwb2xhdGlvbiAmJiBvcHRpb25zLmludGVycG9sYXRpb24uZXNjYXBlIHx8IGVzY2FwZTtcbiAgICB9XG4gICAgaWYgKCFvcHRpb25zLmludGVycG9sYXRpb24pIG9wdGlvbnMuaW50ZXJwb2xhdGlvbiA9IHsgZXNjYXBlVmFsdWU6IHRydWUgfTtcblxuICAgIHZhciBpT3B0cyA9IG9wdGlvbnMuaW50ZXJwb2xhdGlvbjtcblxuICAgIHRoaXMuZXNjYXBlVmFsdWUgPSBpT3B0cy5lc2NhcGVWYWx1ZSAhPT0gdW5kZWZpbmVkID8gaU9wdHMuZXNjYXBlVmFsdWUgOiB0cnVlO1xuXG4gICAgdGhpcy5wcmVmaXggPSBpT3B0cy5wcmVmaXggPyByZWdleEVzY2FwZShpT3B0cy5wcmVmaXgpIDogaU9wdHMucHJlZml4RXNjYXBlZCB8fCAne3snO1xuICAgIHRoaXMuc3VmZml4ID0gaU9wdHMuc3VmZml4ID8gcmVnZXhFc2NhcGUoaU9wdHMuc3VmZml4KSA6IGlPcHRzLnN1ZmZpeEVzY2FwZWQgfHwgJ319JztcblxuICAgIHRoaXMuZm9ybWF0U2VwYXJhdG9yID0gaU9wdHMuZm9ybWF0U2VwYXJhdG9yID8gaU9wdHMuZm9ybWF0U2VwYXJhdG9yIDogaU9wdHMuZm9ybWF0U2VwYXJhdG9yIHx8ICcsJztcblxuICAgIHRoaXMudW5lc2NhcGVQcmVmaXggPSBpT3B0cy51bmVzY2FwZVN1ZmZpeCA/ICcnIDogaU9wdHMudW5lc2NhcGVQcmVmaXggfHwgJy0nO1xuICAgIHRoaXMudW5lc2NhcGVTdWZmaXggPSB0aGlzLnVuZXNjYXBlUHJlZml4ID8gJycgOiBpT3B0cy51bmVzY2FwZVN1ZmZpeCB8fCAnJztcblxuICAgIHRoaXMubmVzdGluZ1ByZWZpeCA9IGlPcHRzLm5lc3RpbmdQcmVmaXggPyByZWdleEVzY2FwZShpT3B0cy5uZXN0aW5nUHJlZml4KSA6IGlPcHRzLm5lc3RpbmdQcmVmaXhFc2NhcGVkIHx8IHJlZ2V4RXNjYXBlKCckdCgnKTtcbiAgICB0aGlzLm5lc3RpbmdTdWZmaXggPSBpT3B0cy5uZXN0aW5nU3VmZml4ID8gcmVnZXhFc2NhcGUoaU9wdHMubmVzdGluZ1N1ZmZpeCkgOiBpT3B0cy5uZXN0aW5nU3VmZml4RXNjYXBlZCB8fCByZWdleEVzY2FwZSgnKScpO1xuXG4gICAgLy8gdGhlIHJlZ2V4cFxuICAgIHRoaXMucmVzZXRSZWdFeHAoKTtcbiAgfTtcblxuICBJbnRlcnBvbGF0b3IucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucykgdGhpcy5pbml0KHRoaXMub3B0aW9ucyk7XG4gIH07XG5cbiAgSW50ZXJwb2xhdG9yLnByb3RvdHlwZS5yZXNldFJlZ0V4cCA9IGZ1bmN0aW9uIHJlc2V0UmVnRXhwKCkge1xuICAgIC8vIHRoZSByZWdleHBcbiAgICB2YXIgcmVnZXhwU3RyID0gdGhpcy5wcmVmaXggKyAnKC4rPyknICsgdGhpcy5zdWZmaXg7XG4gICAgdGhpcy5yZWdleHAgPSBuZXcgUmVnRXhwKHJlZ2V4cFN0ciwgJ2cnKTtcblxuICAgIHZhciByZWdleHBVbmVzY2FwZVN0ciA9ICcnICsgdGhpcy5wcmVmaXggKyB0aGlzLnVuZXNjYXBlUHJlZml4ICsgJyguKz8pJyArIHRoaXMudW5lc2NhcGVTdWZmaXggKyB0aGlzLnN1ZmZpeDtcbiAgICB0aGlzLnJlZ2V4cFVuZXNjYXBlID0gbmV3IFJlZ0V4cChyZWdleHBVbmVzY2FwZVN0ciwgJ2cnKTtcblxuICAgIHZhciBuZXN0aW5nUmVnZXhwU3RyID0gdGhpcy5uZXN0aW5nUHJlZml4ICsgJyguKz8pJyArIHRoaXMubmVzdGluZ1N1ZmZpeDtcbiAgICB0aGlzLm5lc3RpbmdSZWdleHAgPSBuZXcgUmVnRXhwKG5lc3RpbmdSZWdleHBTdHIsICdnJyk7XG4gIH07XG5cbiAgSW50ZXJwb2xhdG9yLnByb3RvdHlwZS5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uIGludGVycG9sYXRlKHN0ciwgZGF0YSwgbG5nKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBtYXRjaCA9IHZvaWQgMDtcbiAgICB2YXIgdmFsdWUgPSB2b2lkIDA7XG5cbiAgICBmdW5jdGlvbiByZWdleFNhZmUodmFsKSB7XG4gICAgICByZXR1cm4gdmFsLnJlcGxhY2UoL1xcJC9nLCAnJCQkJCcpO1xuICAgIH1cblxuICAgIHZhciBoYW5kbGVGb3JtYXQgPSBmdW5jdGlvbiBoYW5kbGVGb3JtYXQoa2V5KSB7XG4gICAgICBpZiAoa2V5LmluZGV4T2YoX3RoaXMuZm9ybWF0U2VwYXJhdG9yKSA8IDApIHJldHVybiBnZXRQYXRoKGRhdGEsIGtleSk7XG5cbiAgICAgIHZhciBwID0ga2V5LnNwbGl0KF90aGlzLmZvcm1hdFNlcGFyYXRvcik7XG4gICAgICB2YXIgayA9IHAuc2hpZnQoKS50cmltKCk7XG4gICAgICB2YXIgZiA9IHAuam9pbihfdGhpcy5mb3JtYXRTZXBhcmF0b3IpLnRyaW0oKTtcblxuICAgICAgcmV0dXJuIF90aGlzLmZvcm1hdChnZXRQYXRoKGRhdGEsIGspLCBmLCBsbmcpO1xuICAgIH07XG5cbiAgICB0aGlzLnJlc2V0UmVnRXhwKCk7XG5cbiAgICAvLyB1bmVzY2FwZSBpZiBoYXMgdW5lc2NhcGVQcmVmaXgvU3VmZml4XG4gICAgLyogZXNsaW50IG5vLWNvbmQtYXNzaWduOiAwICovXG4gICAgd2hpbGUgKG1hdGNoID0gdGhpcy5yZWdleHBVbmVzY2FwZS5leGVjKHN0cikpIHtcbiAgICAgIHZhbHVlID0gaGFuZGxlRm9ybWF0KG1hdGNoWzFdLnRyaW0oKSk7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZShtYXRjaFswXSwgdmFsdWUpO1xuICAgICAgdGhpcy5yZWdleHBVbmVzY2FwZS5sYXN0SW5kZXggPSAwO1xuICAgIH1cblxuICAgIC8vIHJlZ3VsYXIgZXNjYXBlIG9uIGRlbWFuZFxuICAgIHdoaWxlIChtYXRjaCA9IHRoaXMucmVnZXhwLmV4ZWMoc3RyKSkge1xuICAgICAgdmFsdWUgPSBoYW5kbGVGb3JtYXQobWF0Y2hbMV0udHJpbSgpKTtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB2YWx1ZSA9IG1ha2VTdHJpbmcodmFsdWUpO1xuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci53YXJuKCdtaXNzZWQgdG8gcGFzcyBpbiB2YXJpYWJsZSAnICsgbWF0Y2hbMV0gKyAnIGZvciBpbnRlcnBvbGF0aW5nICcgKyBzdHIpO1xuICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgfVxuICAgICAgdmFsdWUgPSB0aGlzLmVzY2FwZVZhbHVlID8gcmVnZXhTYWZlKHRoaXMuZXNjYXBlKHZhbHVlKSkgOiByZWdleFNhZmUodmFsdWUpO1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2UobWF0Y2hbMF0sIHZhbHVlKTtcbiAgICAgIHRoaXMucmVnZXhwLmxhc3RJbmRleCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH07XG5cbiAgSW50ZXJwb2xhdG9yLnByb3RvdHlwZS5uZXN0ID0gZnVuY3Rpb24gbmVzdChzdHIsIGZjKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG4gICAgdmFyIG1hdGNoID0gdm9pZCAwO1xuICAgIHZhciB2YWx1ZSA9IHZvaWQgMDtcblxuICAgIHZhciBjbG9uZWRPcHRpb25zID0gX2V4dGVuZHMoe30sIG9wdGlvbnMpO1xuICAgIGNsb25lZE9wdGlvbnMuYXBwbHlQb3N0UHJvY2Vzc29yID0gZmFsc2U7IC8vIGF2b2lkIHBvc3QgcHJvY2Vzc2luZyBvbiBuZXN0ZWQgbG9va3VwXG5cbiAgICAvLyBpZiB2YWx1ZSBpcyBzb21ldGhpbmcgbGlrZSBcIm15S2V5XCI6IFwibG9yZW0gJChhbm90aGVyS2V5LCB7IFwiY291bnRcIjoge3thVmFsdWVJbk9wdGlvbnN9fSB9KVwiXG4gICAgZnVuY3Rpb24gaGFuZGxlSGFzT3B0aW9ucyhrZXkpIHtcbiAgICAgIGlmIChrZXkuaW5kZXhPZignLCcpIDwgMCkgcmV0dXJuIGtleTtcblxuICAgICAgdmFyIHAgPSBrZXkuc3BsaXQoJywnKTtcbiAgICAgIGtleSA9IHAuc2hpZnQoKTtcbiAgICAgIHZhciBvcHRpb25zU3RyaW5nID0gcC5qb2luKCcsJyk7XG4gICAgICBvcHRpb25zU3RyaW5nID0gdGhpcy5pbnRlcnBvbGF0ZShvcHRpb25zU3RyaW5nLCBjbG9uZWRPcHRpb25zKTtcbiAgICAgIG9wdGlvbnNTdHJpbmcgPSBvcHRpb25zU3RyaW5nLnJlcGxhY2UoLycvZywgJ1wiJyk7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGNsb25lZE9wdGlvbnMgPSBKU09OLnBhcnNlKG9wdGlvbnNTdHJpbmcpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci5lcnJvcignZmFpbGVkIHBhcnNpbmcgb3B0aW9ucyBzdHJpbmcgaW4gbmVzdGluZyBmb3Iga2V5ICcgKyBrZXksIGUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIC8vIHJlZ3VsYXIgZXNjYXBlIG9uIGRlbWFuZFxuICAgIHdoaWxlIChtYXRjaCA9IHRoaXMubmVzdGluZ1JlZ2V4cC5leGVjKHN0cikpIHtcbiAgICAgIHZhbHVlID0gZmMoaGFuZGxlSGFzT3B0aW9ucy5jYWxsKHRoaXMsIG1hdGNoWzFdLnRyaW0oKSksIGNsb25lZE9wdGlvbnMpO1xuXG4gICAgICAvLyBpcyBvbmx5IHRoZSBuZXN0aW5nIGtleSAoa2V5MSA9ICckKGtleTIpJykgcmV0dXJuIHRoZSB2YWx1ZSB3aXRob3V0IHN0cmluZ2lmeVxuICAgICAgaWYgKHZhbHVlICYmIG1hdGNoWzBdID09PSBzdHIgJiYgdHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykgcmV0dXJuIHZhbHVlO1xuXG4gICAgICAvLyBubyBzdHJpbmcgdG8gaW5jbHVkZSBvciBlbXB0eVxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHZhbHVlID0gbWFrZVN0cmluZyh2YWx1ZSk7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ21pc3NlZCB0byByZXNvbHZlICcgKyBtYXRjaFsxXSArICcgZm9yIG5lc3RpbmcgJyArIHN0cik7XG4gICAgICAgIHZhbHVlID0gJyc7XG4gICAgICB9XG4gICAgICAvLyBOZXN0ZWQga2V5cyBzaG91bGQgbm90IGJlIGVzY2FwZWQgYnkgZGVmYXVsdCAjODU0XG4gICAgICAvLyB2YWx1ZSA9IHRoaXMuZXNjYXBlVmFsdWUgPyByZWdleFNhZmUodXRpbHMuZXNjYXBlKHZhbHVlKSkgOiByZWdleFNhZmUodmFsdWUpO1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2UobWF0Y2hbMF0sIHZhbHVlKTtcbiAgICAgIHRoaXMucmVnZXhwLmxhc3RJbmRleCA9IDA7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG4gIH07XG5cbiAgcmV0dXJuIEludGVycG9sYXRvcjtcbn0oKTtcblxuZnVuY3Rpb24gcmVtb3ZlKGFyciwgd2hhdCkge1xuICB2YXIgZm91bmQgPSBhcnIuaW5kZXhPZih3aGF0KTtcblxuICB3aGlsZSAoZm91bmQgIT09IC0xKSB7XG4gICAgYXJyLnNwbGljZShmb3VuZCwgMSk7XG4gICAgZm91bmQgPSBhcnIuaW5kZXhPZih3aGF0KTtcbiAgfVxufVxuXG52YXIgQ29ubmVjdG9yID0gZnVuY3Rpb24gKF9FdmVudEVtaXR0ZXIpIHtcbiAgaW5oZXJpdHMoQ29ubmVjdG9yLCBfRXZlbnRFbWl0dGVyKTtcblxuICBmdW5jdGlvbiBDb25uZWN0b3IoYmFja2VuZCwgc3RvcmUsIHNlcnZpY2VzKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IHt9O1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIENvbm5lY3Rvcik7XG5cbiAgICB2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9FdmVudEVtaXR0ZXIuY2FsbCh0aGlzKSk7XG5cbiAgICBfdGhpcy5iYWNrZW5kID0gYmFja2VuZDtcbiAgICBfdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgIF90aGlzLnNlcnZpY2VzID0gc2VydmljZXM7XG4gICAgX3RoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgX3RoaXMubG9nZ2VyID0gYmFzZUxvZ2dlci5jcmVhdGUoJ2JhY2tlbmRDb25uZWN0b3InKTtcblxuICAgIF90aGlzLnN0YXRlID0ge307XG4gICAgX3RoaXMucXVldWUgPSBbXTtcblxuICAgIGlmIChfdGhpcy5iYWNrZW5kICYmIF90aGlzLmJhY2tlbmQuaW5pdCkge1xuICAgICAgX3RoaXMuYmFja2VuZC5pbml0KHNlcnZpY2VzLCBvcHRpb25zLmJhY2tlbmQsIG9wdGlvbnMpO1xuICAgIH1cbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBDb25uZWN0b3IucHJvdG90eXBlLnF1ZXVlTG9hZCA9IGZ1bmN0aW9uIHF1ZXVlTG9hZChsYW5ndWFnZXMsIG5hbWVzcGFjZXMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAvLyBmaW5kIHdoYXQgbmVlZHMgdG8gYmUgbG9hZGVkXG4gICAgdmFyIHRvTG9hZCA9IFtdO1xuICAgIHZhciBwZW5kaW5nID0gW107XG4gICAgdmFyIHRvTG9hZExhbmd1YWdlcyA9IFtdO1xuICAgIHZhciB0b0xvYWROYW1lc3BhY2VzID0gW107XG5cbiAgICBsYW5ndWFnZXMuZm9yRWFjaChmdW5jdGlvbiAobG5nKSB7XG4gICAgICB2YXIgaGFzQWxsTmFtZXNwYWNlcyA9IHRydWU7XG5cbiAgICAgIG5hbWVzcGFjZXMuZm9yRWFjaChmdW5jdGlvbiAobnMpIHtcbiAgICAgICAgdmFyIG5hbWUgPSBsbmcgKyAnfCcgKyBucztcblxuICAgICAgICBpZiAoX3RoaXMyLnN0b3JlLmhhc1Jlc291cmNlQnVuZGxlKGxuZywgbnMpKSB7XG4gICAgICAgICAgX3RoaXMyLnN0YXRlW25hbWVdID0gMjsgLy8gbG9hZGVkXG4gICAgICAgIH0gZWxzZSBpZiAoX3RoaXMyLnN0YXRlW25hbWVdIDwgMCkge1xuICAgICAgICAgIC8vIG5vdGhpbmcgdG8gZG8gZm9yIGVyclxuICAgICAgICB9IGVsc2UgaWYgKF90aGlzMi5zdGF0ZVtuYW1lXSA9PT0gMSkge1xuICAgICAgICAgIGlmIChwZW5kaW5nLmluZGV4T2YobmFtZSkgPCAwKSBwZW5kaW5nLnB1c2gobmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgX3RoaXMyLnN0YXRlW25hbWVdID0gMTsgLy8gcGVuZGluZ1xuXG4gICAgICAgICAgaGFzQWxsTmFtZXNwYWNlcyA9IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKHBlbmRpbmcuaW5kZXhPZihuYW1lKSA8IDApIHBlbmRpbmcucHVzaChuYW1lKTtcbiAgICAgICAgICBpZiAodG9Mb2FkLmluZGV4T2YobmFtZSkgPCAwKSB0b0xvYWQucHVzaChuYW1lKTtcbiAgICAgICAgICBpZiAodG9Mb2FkTmFtZXNwYWNlcy5pbmRleE9mKG5zKSA8IDApIHRvTG9hZE5hbWVzcGFjZXMucHVzaChucyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIWhhc0FsbE5hbWVzcGFjZXMpIHRvTG9hZExhbmd1YWdlcy5wdXNoKGxuZyk7XG4gICAgfSk7XG5cbiAgICBpZiAodG9Mb2FkLmxlbmd0aCB8fCBwZW5kaW5nLmxlbmd0aCkge1xuICAgICAgdGhpcy5xdWV1ZS5wdXNoKHtcbiAgICAgICAgcGVuZGluZzogcGVuZGluZyxcbiAgICAgICAgbG9hZGVkOiB7fSxcbiAgICAgICAgZXJyb3JzOiBbXSxcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdG9Mb2FkOiB0b0xvYWQsXG4gICAgICBwZW5kaW5nOiBwZW5kaW5nLFxuICAgICAgdG9Mb2FkTGFuZ3VhZ2VzOiB0b0xvYWRMYW5ndWFnZXMsXG4gICAgICB0b0xvYWROYW1lc3BhY2VzOiB0b0xvYWROYW1lc3BhY2VzXG4gICAgfTtcbiAgfTtcblxuICBDb25uZWN0b3IucHJvdG90eXBlLmxvYWRlZCA9IGZ1bmN0aW9uIGxvYWRlZChuYW1lLCBlcnIsIGRhdGEpIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIHZhciBfbmFtZSRzcGxpdCA9IG5hbWUuc3BsaXQoJ3wnKSxcbiAgICAgICAgX25hbWUkc3BsaXQyID0gc2xpY2VkVG9BcnJheShfbmFtZSRzcGxpdCwgMiksXG4gICAgICAgIGxuZyA9IF9uYW1lJHNwbGl0MlswXSxcbiAgICAgICAgbnMgPSBfbmFtZSRzcGxpdDJbMV07XG5cbiAgICBpZiAoZXJyKSB0aGlzLmVtaXQoJ2ZhaWxlZExvYWRpbmcnLCBsbmcsIG5zLCBlcnIpO1xuXG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHRoaXMuc3RvcmUuYWRkUmVzb3VyY2VCdW5kbGUobG5nLCBucywgZGF0YSk7XG4gICAgfVxuXG4gICAgLy8gc2V0IGxvYWRlZFxuICAgIHRoaXMuc3RhdGVbbmFtZV0gPSBlcnIgPyAtMSA6IDI7XG5cbiAgICAvLyBjYWxsYmFjayBpZiByZWFkeVxuICAgIHRoaXMucXVldWUuZm9yRWFjaChmdW5jdGlvbiAocSkge1xuICAgICAgcHVzaFBhdGgocS5sb2FkZWQsIFtsbmddLCBucyk7XG4gICAgICByZW1vdmUocS5wZW5kaW5nLCBuYW1lKTtcblxuICAgICAgaWYgKGVycikgcS5lcnJvcnMucHVzaChlcnIpO1xuXG4gICAgICBpZiAocS5wZW5kaW5nLmxlbmd0aCA9PT0gMCAmJiAhcS5kb25lKSB7XG4gICAgICAgIF90aGlzMy5lbWl0KCdsb2FkZWQnLCBxLmxvYWRlZCk7XG4gICAgICAgIC8qIGVzbGludCBuby1wYXJhbS1yZWFzc2lnbjogMCAqL1xuICAgICAgICBxLmRvbmUgPSB0cnVlO1xuICAgICAgICBpZiAocS5lcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgcS5jYWxsYmFjayhxLmVycm9ycyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcS5jYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyByZW1vdmUgZG9uZSBsb2FkIHJlcXVlc3RzXG4gICAgdGhpcy5xdWV1ZSA9IHRoaXMucXVldWUuZmlsdGVyKGZ1bmN0aW9uIChxKSB7XG4gICAgICByZXR1cm4gIXEuZG9uZTtcbiAgICB9KTtcbiAgfTtcblxuICBDb25uZWN0b3IucHJvdG90eXBlLnJlYWQgPSBmdW5jdGlvbiByZWFkKGxuZywgbnMsIGZjTmFtZSkge1xuICAgIHZhciB0cmllZCA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDogMDtcblxuICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgdmFyIHdhaXQgPSBhcmd1bWVudHMubGVuZ3RoID4gNCAmJiBhcmd1bWVudHNbNF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1s0XSA6IDI1MDtcbiAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbNV07XG5cbiAgICBpZiAoIWxuZy5sZW5ndGgpIHJldHVybiBjYWxsYmFjayhudWxsLCB7fSk7IC8vIG5vdGluZyB0byBsb2FkXG5cbiAgICByZXR1cm4gdGhpcy5iYWNrZW5kW2ZjTmFtZV0obG5nLCBucywgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgaWYgKGVyciAmJiBkYXRhIC8qID0gcmV0cnlGbGFnICovICYmIHRyaWVkIDwgNSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBfdGhpczQucmVhZC5jYWxsKF90aGlzNCwgbG5nLCBucywgZmNOYW1lLCB0cmllZCArIDEsIHdhaXQgKiAyLCBjYWxsYmFjayk7XG4gICAgICAgIH0sIHdhaXQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjYWxsYmFjayhlcnIsIGRhdGEpO1xuICAgIH0pO1xuICB9O1xuXG4gIC8qIGVzbGludCBjb25zaXN0ZW50LXJldHVybjogMCAqL1xuXG5cbiAgQ29ubmVjdG9yLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gbG9hZChsYW5ndWFnZXMsIG5hbWVzcGFjZXMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIF90aGlzNSA9IHRoaXM7XG5cbiAgICBpZiAoIXRoaXMuYmFja2VuZCkge1xuICAgICAgdGhpcy5sb2dnZXIud2FybignTm8gYmFja2VuZCB3YXMgYWRkZWQgdmlhIGkxOG5leHQudXNlLiBXaWxsIG5vdCBsb2FkIHJlc291cmNlcy4nKTtcbiAgICAgIHJldHVybiBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuICAgIH1cbiAgICB2YXIgb3B0aW9ucyA9IF9leHRlbmRzKHt9LCB0aGlzLmJhY2tlbmQub3B0aW9ucywgdGhpcy5vcHRpb25zLmJhY2tlbmQpO1xuXG4gICAgaWYgKHR5cGVvZiBsYW5ndWFnZXMgPT09ICdzdHJpbmcnKSBsYW5ndWFnZXMgPSB0aGlzLnNlcnZpY2VzLmxhbmd1YWdlVXRpbHMudG9SZXNvbHZlSGllcmFyY2h5KGxhbmd1YWdlcyk7XG4gICAgaWYgKHR5cGVvZiBuYW1lc3BhY2VzID09PSAnc3RyaW5nJykgbmFtZXNwYWNlcyA9IFtuYW1lc3BhY2VzXTtcblxuICAgIHZhciB0b0xvYWQgPSB0aGlzLnF1ZXVlTG9hZChsYW5ndWFnZXMsIG5hbWVzcGFjZXMsIGNhbGxiYWNrKTtcbiAgICBpZiAoIXRvTG9hZC50b0xvYWQubGVuZ3RoKSB7XG4gICAgICBpZiAoIXRvTG9hZC5wZW5kaW5nLmxlbmd0aCkgY2FsbGJhY2soKTsgLy8gbm90aGluZyB0byBsb2FkIGFuZCBubyBwZW5kaW5ncy4uLmNhbGxiYWNrIG5vd1xuICAgICAgcmV0dXJuIG51bGw7IC8vIHBlbmRpbmdzIHdpbGwgdHJpZ2dlciBjYWxsYmFja1xuICAgIH1cblxuICAgIC8vIGxvYWQgd2l0aCBtdWx0aS1sb2FkXG4gICAgaWYgKG9wdGlvbnMuYWxsb3dNdWx0aUxvYWRpbmcgJiYgdGhpcy5iYWNrZW5kLnJlYWRNdWx0aSkge1xuICAgICAgdGhpcy5yZWFkKHRvTG9hZC50b0xvYWRMYW5ndWFnZXMsIHRvTG9hZC50b0xvYWROYW1lc3BhY2VzLCAncmVhZE11bHRpJywgbnVsbCwgbnVsbCwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICBpZiAoZXJyKSBfdGhpczUubG9nZ2VyLndhcm4oJ2xvYWRpbmcgbmFtZXNwYWNlcyAnICsgdG9Mb2FkLnRvTG9hZE5hbWVzcGFjZXMuam9pbignLCAnKSArICcgZm9yIGxhbmd1YWdlcyAnICsgdG9Mb2FkLnRvTG9hZExhbmd1YWdlcy5qb2luKCcsICcpICsgJyB2aWEgbXVsdGlsb2FkaW5nIGZhaWxlZCcsIGVycik7XG4gICAgICAgIGlmICghZXJyICYmIGRhdGEpIF90aGlzNS5sb2dnZXIubG9nKCdzdWNjZXNzZnVsbHkgbG9hZGVkIG5hbWVzcGFjZXMgJyArIHRvTG9hZC50b0xvYWROYW1lc3BhY2VzLmpvaW4oJywgJykgKyAnIGZvciBsYW5ndWFnZXMgJyArIHRvTG9hZC50b0xvYWRMYW5ndWFnZXMuam9pbignLCAnKSArICcgdmlhIG11bHRpbG9hZGluZycsIGRhdGEpO1xuXG4gICAgICAgIHRvTG9hZC50b0xvYWQuZm9yRWFjaChmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgIHZhciBfbmFtZSRzcGxpdDMgPSBuYW1lLnNwbGl0KCd8JyksXG4gICAgICAgICAgICAgIF9uYW1lJHNwbGl0NCA9IHNsaWNlZFRvQXJyYXkoX25hbWUkc3BsaXQzLCAyKSxcbiAgICAgICAgICAgICAgbCA9IF9uYW1lJHNwbGl0NFswXSxcbiAgICAgICAgICAgICAgbiA9IF9uYW1lJHNwbGl0NFsxXTtcblxuICAgICAgICAgIHZhciBidW5kbGUgPSBnZXRQYXRoKGRhdGEsIFtsLCBuXSk7XG4gICAgICAgICAgaWYgKGJ1bmRsZSkge1xuICAgICAgICAgICAgX3RoaXM1LmxvYWRlZChuYW1lLCBlcnIsIGJ1bmRsZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBlcnJvciA9ICdsb2FkaW5nIG5hbWVzcGFjZSAnICsgbiArICcgZm9yIGxhbmd1YWdlICcgKyBsICsgJyB2aWEgbXVsdGlsb2FkaW5nIGZhaWxlZCc7XG4gICAgICAgICAgICBfdGhpczUubG9hZGVkKG5hbWUsIGVycm9yKTtcbiAgICAgICAgICAgIF90aGlzNS5sb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdG9Mb2FkLnRvTG9hZC5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIF90aGlzNS5sb2FkT25lKG5hbWUpO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIENvbm5lY3Rvci5wcm90b3R5cGUucmVsb2FkID0gZnVuY3Rpb24gcmVsb2FkKGxhbmd1YWdlcywgbmFtZXNwYWNlcykge1xuICAgIHZhciBfdGhpczYgPSB0aGlzO1xuXG4gICAgaWYgKCF0aGlzLmJhY2tlbmQpIHtcbiAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ05vIGJhY2tlbmQgd2FzIGFkZGVkIHZpYSBpMThuZXh0LnVzZS4gV2lsbCBub3QgbG9hZCByZXNvdXJjZXMuJyk7XG4gICAgfVxuICAgIHZhciBvcHRpb25zID0gX2V4dGVuZHMoe30sIHRoaXMuYmFja2VuZC5vcHRpb25zLCB0aGlzLm9wdGlvbnMuYmFja2VuZCk7XG5cbiAgICBpZiAodHlwZW9mIGxhbmd1YWdlcyA9PT0gJ3N0cmluZycpIGxhbmd1YWdlcyA9IHRoaXMuc2VydmljZXMubGFuZ3VhZ2VVdGlscy50b1Jlc29sdmVIaWVyYXJjaHkobGFuZ3VhZ2VzKTtcbiAgICBpZiAodHlwZW9mIG5hbWVzcGFjZXMgPT09ICdzdHJpbmcnKSBuYW1lc3BhY2VzID0gW25hbWVzcGFjZXNdO1xuXG4gICAgLy8gbG9hZCB3aXRoIG11bHRpLWxvYWRcbiAgICBpZiAob3B0aW9ucy5hbGxvd011bHRpTG9hZGluZyAmJiB0aGlzLmJhY2tlbmQucmVhZE11bHRpKSB7XG4gICAgICB0aGlzLnJlYWQobGFuZ3VhZ2VzLCBuYW1lc3BhY2VzLCAncmVhZE11bHRpJywgbnVsbCwgbnVsbCwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICBpZiAoZXJyKSBfdGhpczYubG9nZ2VyLndhcm4oJ3JlbG9hZGluZyBuYW1lc3BhY2VzICcgKyBuYW1lc3BhY2VzLmpvaW4oJywgJykgKyAnIGZvciBsYW5ndWFnZXMgJyArIGxhbmd1YWdlcy5qb2luKCcsICcpICsgJyB2aWEgbXVsdGlsb2FkaW5nIGZhaWxlZCcsIGVycik7XG4gICAgICAgIGlmICghZXJyICYmIGRhdGEpIF90aGlzNi5sb2dnZXIubG9nKCdzdWNjZXNzZnVsbHkgcmVsb2FkZWQgbmFtZXNwYWNlcyAnICsgbmFtZXNwYWNlcy5qb2luKCcsICcpICsgJyBmb3IgbGFuZ3VhZ2VzICcgKyBsYW5ndWFnZXMuam9pbignLCAnKSArICcgdmlhIG11bHRpbG9hZGluZycsIGRhdGEpO1xuXG4gICAgICAgIGxhbmd1YWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChsKSB7XG4gICAgICAgICAgbmFtZXNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgICAgICB2YXIgYnVuZGxlID0gZ2V0UGF0aChkYXRhLCBbbCwgbl0pO1xuICAgICAgICAgICAgaWYgKGJ1bmRsZSkge1xuICAgICAgICAgICAgICBfdGhpczYubG9hZGVkKGwgKyAnfCcgKyBuLCBlcnIsIGJ1bmRsZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgZXJyb3IgPSAncmVsb2FkaW5nIG5hbWVzcGFjZSAnICsgbiArICcgZm9yIGxhbmd1YWdlICcgKyBsICsgJyB2aWEgbXVsdGlsb2FkaW5nIGZhaWxlZCc7XG4gICAgICAgICAgICAgIF90aGlzNi5sb2FkZWQobCArICd8JyArIG4sIGVycm9yKTtcbiAgICAgICAgICAgICAgX3RoaXM2LmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxhbmd1YWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChsKSB7XG4gICAgICAgIG5hbWVzcGFjZXMuZm9yRWFjaChmdW5jdGlvbiAobikge1xuICAgICAgICAgIF90aGlzNi5sb2FkT25lKGwgKyAnfCcgKyBuLCAncmUnKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgQ29ubmVjdG9yLnByb3RvdHlwZS5sb2FkT25lID0gZnVuY3Rpb24gbG9hZE9uZShuYW1lKSB7XG4gICAgdmFyIF90aGlzNyA9IHRoaXM7XG5cbiAgICB2YXIgcHJlZml4ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAnJztcblxuICAgIHZhciBfbmFtZSRzcGxpdDUgPSBuYW1lLnNwbGl0KCd8JyksXG4gICAgICAgIF9uYW1lJHNwbGl0NiA9IHNsaWNlZFRvQXJyYXkoX25hbWUkc3BsaXQ1LCAyKSxcbiAgICAgICAgbG5nID0gX25hbWUkc3BsaXQ2WzBdLFxuICAgICAgICBucyA9IF9uYW1lJHNwbGl0NlsxXTtcblxuICAgIHRoaXMucmVhZChsbmcsIG5zLCAncmVhZCcsIG51bGwsIG51bGwsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgIGlmIChlcnIpIF90aGlzNy5sb2dnZXIud2FybihwcmVmaXggKyAnbG9hZGluZyBuYW1lc3BhY2UgJyArIG5zICsgJyBmb3IgbGFuZ3VhZ2UgJyArIGxuZyArICcgZmFpbGVkJywgZXJyKTtcbiAgICAgIGlmICghZXJyICYmIGRhdGEpIF90aGlzNy5sb2dnZXIubG9nKHByZWZpeCArICdsb2FkZWQgbmFtZXNwYWNlICcgKyBucyArICcgZm9yIGxhbmd1YWdlICcgKyBsbmcsIGRhdGEpO1xuXG4gICAgICBfdGhpczcubG9hZGVkKG5hbWUsIGVyciwgZGF0YSk7XG4gICAgfSk7XG4gIH07XG5cbiAgQ29ubmVjdG9yLnByb3RvdHlwZS5zYXZlTWlzc2luZyA9IGZ1bmN0aW9uIHNhdmVNaXNzaW5nKGxhbmd1YWdlcywgbmFtZXNwYWNlLCBrZXksIGZhbGxiYWNrVmFsdWUpIHtcbiAgICBpZiAodGhpcy5iYWNrZW5kICYmIHRoaXMuYmFja2VuZC5jcmVhdGUpIHRoaXMuYmFja2VuZC5jcmVhdGUobGFuZ3VhZ2VzLCBuYW1lc3BhY2UsIGtleSwgZmFsbGJhY2tWYWx1ZSk7XG5cbiAgICAvLyB3cml0ZSB0byBzdG9yZSB0byBhdm9pZCByZXNlbmRpbmdcbiAgICBpZiAoIWxhbmd1YWdlcyB8fCAhbGFuZ3VhZ2VzWzBdKSByZXR1cm47XG4gICAgdGhpcy5zdG9yZS5hZGRSZXNvdXJjZShsYW5ndWFnZXNbMF0sIG5hbWVzcGFjZSwga2V5LCBmYWxsYmFja1ZhbHVlKTtcbiAgfTtcblxuICByZXR1cm4gQ29ubmVjdG9yO1xufShFdmVudEVtaXR0ZXIpO1xuXG52YXIgQ29ubmVjdG9yJDEgPSBmdW5jdGlvbiAoX0V2ZW50RW1pdHRlcikge1xuICBpbmhlcml0cyhDb25uZWN0b3IsIF9FdmVudEVtaXR0ZXIpO1xuXG4gIGZ1bmN0aW9uIENvbm5lY3RvcihjYWNoZSwgc3RvcmUsIHNlcnZpY2VzKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IHt9O1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIENvbm5lY3Rvcik7XG5cbiAgICB2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9FdmVudEVtaXR0ZXIuY2FsbCh0aGlzKSk7XG5cbiAgICBfdGhpcy5jYWNoZSA9IGNhY2hlO1xuICAgIF90aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgX3RoaXMuc2VydmljZXMgPSBzZXJ2aWNlcztcbiAgICBfdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICBfdGhpcy5sb2dnZXIgPSBiYXNlTG9nZ2VyLmNyZWF0ZSgnY2FjaGVDb25uZWN0b3InKTtcblxuICAgIGlmIChfdGhpcy5jYWNoZSAmJiBfdGhpcy5jYWNoZS5pbml0KSBfdGhpcy5jYWNoZS5pbml0KHNlcnZpY2VzLCBvcHRpb25zLmNhY2hlLCBvcHRpb25zKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICAvKiBlc2xpbnQgY29uc2lzdGVudC1yZXR1cm46IDAgKi9cblxuXG4gIENvbm5lY3Rvci5wcm90b3R5cGUubG9hZCA9IGZ1bmN0aW9uIGxvYWQobGFuZ3VhZ2VzLCBuYW1lc3BhY2VzLCBjYWxsYmFjaykge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgaWYgKCF0aGlzLmNhY2hlKSByZXR1cm4gY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICB2YXIgb3B0aW9ucyA9IF9leHRlbmRzKHt9LCB0aGlzLmNhY2hlLm9wdGlvbnMsIHRoaXMub3B0aW9ucy5jYWNoZSk7XG5cbiAgICB2YXIgbG9hZExuZ3MgPSB0eXBlb2YgbGFuZ3VhZ2VzID09PSAnc3RyaW5nJyA/IHRoaXMuc2VydmljZXMubGFuZ3VhZ2VVdGlscy50b1Jlc29sdmVIaWVyYXJjaHkobGFuZ3VhZ2VzKSA6IGxhbmd1YWdlcztcblxuICAgIGlmIChvcHRpb25zLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuY2FjaGUubG9hZChsb2FkTG5ncywgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgICBpZiAoZXJyKSBfdGhpczIubG9nZ2VyLmVycm9yKCdsb2FkaW5nIGxhbmd1YWdlcyAnICsgbG9hZExuZ3Muam9pbignLCAnKSArICcgZnJvbSBjYWNoZSBmYWlsZWQnLCBlcnIpO1xuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIC8qIGVzbGludCBuby1yZXN0cmljdGVkLXN5bnRheDogMCAqL1xuICAgICAgICAgIGZvciAodmFyIGwgaW4gZGF0YSkge1xuICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkYXRhLCBsKSkge1xuICAgICAgICAgICAgICBmb3IgKHZhciBuIGluIGRhdGFbbF0pIHtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGFbbF0sIG4pKSB7XG4gICAgICAgICAgICAgICAgICBpZiAobiAhPT0gJ2kxOG5TdGFtcCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGJ1bmRsZSA9IGRhdGFbbF1bbl07XG4gICAgICAgICAgICAgICAgICAgIGlmIChidW5kbGUpIF90aGlzMi5zdG9yZS5hZGRSZXNvdXJjZUJ1bmRsZShsLCBuLCBidW5kbGUpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FsbGJhY2spIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cbiAgfTtcblxuICBDb25uZWN0b3IucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiBzYXZlKCkge1xuICAgIGlmICh0aGlzLmNhY2hlICYmIHRoaXMub3B0aW9ucy5jYWNoZSAmJiB0aGlzLm9wdGlvbnMuY2FjaGUuZW5hYmxlZCkgdGhpcy5jYWNoZS5zYXZlKHRoaXMuc3RvcmUuZGF0YSk7XG4gIH07XG5cbiAgcmV0dXJuIENvbm5lY3Rvcjtcbn0oRXZlbnRFbWl0dGVyKTtcblxuZnVuY3Rpb24gZ2V0JDEoKSB7XG4gIHJldHVybiB7XG4gICAgZGVidWc6IGZhbHNlLFxuICAgIGluaXRJbW1lZGlhdGU6IHRydWUsXG5cbiAgICBuczogWyd0cmFuc2xhdGlvbiddLFxuICAgIGRlZmF1bHROUzogWyd0cmFuc2xhdGlvbiddLFxuICAgIGZhbGxiYWNrTG5nOiBbJ2RldiddLFxuICAgIGZhbGxiYWNrTlM6IGZhbHNlLCAvLyBzdHJpbmcgb3IgYXJyYXkgb2YgbmFtZXNwYWNlc1xuXG4gICAgd2hpdGVsaXN0OiBmYWxzZSwgLy8gYXJyYXkgd2l0aCB3aGl0ZWxpc3RlZCBsYW5ndWFnZXNcbiAgICBub25FeHBsaWNpdFdoaXRlbGlzdDogZmFsc2UsXG4gICAgbG9hZDogJ2FsbCcsIC8vIHwgY3VycmVudE9ubHkgfCBsYW5ndWFnZU9ubHlcbiAgICBwcmVsb2FkOiBmYWxzZSwgLy8gYXJyYXkgd2l0aCBwcmVsb2FkIGxhbmd1YWdlc1xuXG4gICAgc2ltcGxpZnlQbHVyYWxTdWZmaXg6IHRydWUsXG4gICAga2V5U2VwYXJhdG9yOiAnLicsXG4gICAgbnNTZXBhcmF0b3I6ICc6JyxcbiAgICBwbHVyYWxTZXBhcmF0b3I6ICdfJyxcbiAgICBjb250ZXh0U2VwYXJhdG9yOiAnXycsXG5cbiAgICBzYXZlTWlzc2luZzogZmFsc2UsIC8vIGVuYWJsZSB0byBzZW5kIG1pc3NpbmcgdmFsdWVzXG4gICAgc2F2ZU1pc3NpbmdUbzogJ2ZhbGxiYWNrJywgLy8gJ2N1cnJlbnQnIHx8ICdhbGwnXG4gICAgbWlzc2luZ0tleUhhbmRsZXI6IGZhbHNlLCAvLyBmdW5jdGlvbihsbmcsIG5zLCBrZXksIGZhbGxiYWNrVmFsdWUpIC0+IG92ZXJyaWRlIGlmIHByZWZlciBvbiBoYW5kbGluZ1xuXG4gICAgcG9zdFByb2Nlc3M6IGZhbHNlLCAvLyBzdHJpbmcgb3IgYXJyYXkgb2YgcG9zdFByb2Nlc3NvciBuYW1lc1xuICAgIHJldHVybk51bGw6IHRydWUsIC8vIGFsbG93cyBudWxsIHZhbHVlIGFzIHZhbGlkIHRyYW5zbGF0aW9uXG4gICAgcmV0dXJuRW1wdHlTdHJpbmc6IHRydWUsIC8vIGFsbG93cyBlbXB0eSBzdHJpbmcgdmFsdWUgYXMgdmFsaWQgdHJhbnNsYXRpb25cbiAgICByZXR1cm5PYmplY3RzOiBmYWxzZSxcbiAgICBqb2luQXJyYXlzOiBmYWxzZSwgLy8gb3Igc3RyaW5nIHRvIGpvaW4gYXJyYXlcbiAgICByZXR1cm5lZE9iamVjdEhhbmRsZXI6IGZ1bmN0aW9uIHJldHVybmVkT2JqZWN0SGFuZGxlcigpIHt9LCAvLyBmdW5jdGlvbihrZXksIHZhbHVlLCBvcHRpb25zKSB0cmlnZ2VyZWQgaWYga2V5IHJldHVybnMgb2JqZWN0IGJ1dCByZXR1cm5PYmplY3RzIGlzIHNldCB0byBmYWxzZVxuICAgIHBhcnNlTWlzc2luZ0tleUhhbmRsZXI6IGZhbHNlLCAvLyBmdW5jdGlvbihrZXkpIHBhcnNlZCBhIGtleSB0aGF0IHdhcyBub3QgZm91bmQgaW4gdCgpIGJlZm9yZSByZXR1cm5pbmdcbiAgICBhcHBlbmROYW1lc3BhY2VUb01pc3NpbmdLZXk6IGZhbHNlLFxuICAgIGFwcGVuZE5hbWVzcGFjZVRvQ0lNb2RlOiBmYWxzZSxcbiAgICBvdmVybG9hZFRyYW5zbGF0aW9uT3B0aW9uSGFuZGxlcjogZnVuY3Rpb24gaGFuZGxlKGFyZ3MpIHtcbiAgICAgIHJldHVybiB7IGRlZmF1bHRWYWx1ZTogYXJnc1sxXSB9O1xuICAgIH0sXG5cbiAgICBpbnRlcnBvbGF0aW9uOiB7XG4gICAgICBlc2NhcGVWYWx1ZTogdHJ1ZSxcbiAgICAgIGZvcm1hdDogZnVuY3Rpb24gZm9ybWF0KHZhbHVlLCBfZm9ybWF0LCBsbmcpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSxcbiAgICAgIHByZWZpeDogJ3t7JyxcbiAgICAgIHN1ZmZpeDogJ319JyxcbiAgICAgIGZvcm1hdFNlcGFyYXRvcjogJywnLFxuICAgICAgLy8gcHJlZml4RXNjYXBlZDogJ3t7JyxcbiAgICAgIC8vIHN1ZmZpeEVzY2FwZWQ6ICd9fScsXG4gICAgICAvLyB1bmVzY2FwZVN1ZmZpeDogJycsXG4gICAgICB1bmVzY2FwZVByZWZpeDogJy0nLFxuXG4gICAgICBuZXN0aW5nUHJlZml4OiAnJHQoJyxcbiAgICAgIG5lc3RpbmdTdWZmaXg6ICcpJyxcbiAgICAgIC8vIG5lc3RpbmdQcmVmaXhFc2NhcGVkOiAnJHQoJyxcbiAgICAgIC8vIG5lc3RpbmdTdWZmaXhFc2NhcGVkOiAnKScsXG4gICAgICBkZWZhdWx0VmFyaWFibGVzOiB1bmRlZmluZWQgLy8gb2JqZWN0IHRoYXQgY2FuIGhhdmUgdmFsdWVzIHRvIGludGVycG9sYXRlIG9uIC0gZXh0ZW5kcyBwYXNzZWQgaW4gaW50ZXJwb2xhdGlvbiBkYXRhXG4gICAgfVxuICB9O1xufVxuXG4vKiBlc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246IDAgKi9cbmZ1bmN0aW9uIHRyYW5zZm9ybU9wdGlvbnMob3B0aW9ucykge1xuICAvLyBjcmVhdGUgbmFtZXNwYWNlIG9iamVjdCBpZiBuYW1lc3BhY2UgaXMgcGFzc2VkIGluIGFzIHN0cmluZ1xuICBpZiAodHlwZW9mIG9wdGlvbnMubnMgPT09ICdzdHJpbmcnKSBvcHRpb25zLm5zID0gW29wdGlvbnMubnNdO1xuICBpZiAodHlwZW9mIG9wdGlvbnMuZmFsbGJhY2tMbmcgPT09ICdzdHJpbmcnKSBvcHRpb25zLmZhbGxiYWNrTG5nID0gW29wdGlvbnMuZmFsbGJhY2tMbmddO1xuICBpZiAodHlwZW9mIG9wdGlvbnMuZmFsbGJhY2tOUyA9PT0gJ3N0cmluZycpIG9wdGlvbnMuZmFsbGJhY2tOUyA9IFtvcHRpb25zLmZhbGxiYWNrTlNdO1xuXG4gIC8vIGV4dGVuZCB3aGl0ZWxpc3Qgd2l0aCBjaW1vZGVcbiAgaWYgKG9wdGlvbnMud2hpdGVsaXN0ICYmIG9wdGlvbnMud2hpdGVsaXN0LmluZGV4T2YoJ2NpbW9kZScpIDwgMCkgb3B0aW9ucy53aGl0ZWxpc3QucHVzaCgnY2ltb2RlJyk7XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG52YXIgSTE4biA9IGZ1bmN0aW9uIChfRXZlbnRFbWl0dGVyKSB7XG4gIGluaGVyaXRzKEkxOG4sIF9FdmVudEVtaXR0ZXIpO1xuXG4gIGZ1bmN0aW9uIEkxOG4oKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1sxXTtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBJMThuKTtcblxuICAgIHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0V2ZW50RW1pdHRlci5jYWxsKHRoaXMpKTtcblxuICAgIF90aGlzLm9wdGlvbnMgPSB0cmFuc2Zvcm1PcHRpb25zKG9wdGlvbnMpO1xuICAgIF90aGlzLnNlcnZpY2VzID0ge307XG4gICAgX3RoaXMubG9nZ2VyID0gYmFzZUxvZ2dlcjtcbiAgICBfdGhpcy5tb2R1bGVzID0geyBleHRlcm5hbDogW10gfTtcblxuICAgIGlmIChjYWxsYmFjayAmJiAhX3RoaXMuaXNJbml0aWFsaXplZCAmJiAhb3B0aW9ucy5pc0Nsb25lKSB7XG4gICAgICB2YXIgX3JldDtcblxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2kxOG5leHQvaTE4bmV4dC9pc3N1ZXMvODc5XG4gICAgICBpZiAoIV90aGlzLm9wdGlvbnMuaW5pdEltbWVkaWF0ZSkgcmV0dXJuIF9yZXQgPSBfdGhpcy5pbml0KG9wdGlvbnMsIGNhbGxiYWNrKSwgcG9zc2libGVDb25zdHJ1Y3RvclJldHVybihfdGhpcywgX3JldCk7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMuaW5pdChvcHRpb25zLCBjYWxsYmFjayk7XG4gICAgICB9LCAwKTtcbiAgICB9XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgSTE4bi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIGluaXQob3B0aW9ucywgY2FsbGJhY2spIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICAgIGlmIChvcHRpb25zLmNvbXBhdGliaWxpdHlBUEkgPT09ICd2MScpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF9leHRlbmRzKHt9LCBnZXQkMSgpLCB0cmFuc2Zvcm1PcHRpb25zKGNvbnZlcnRBUElPcHRpb25zKG9wdGlvbnMpKSwge30pO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5jb21wYXRpYmlsaXR5SlNPTiA9PT0gJ3YxJykge1xuICAgICAgdGhpcy5vcHRpb25zID0gX2V4dGVuZHMoe30sIGdldCQxKCksIHRyYW5zZm9ybU9wdGlvbnMoY29udmVydEpTT05PcHRpb25zKG9wdGlvbnMpKSwge30pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgZ2V0JDEoKSwgdGhpcy5vcHRpb25zLCB0cmFuc2Zvcm1PcHRpb25zKG9wdGlvbnMpKTtcbiAgICB9XG4gICAgdGhpcy5mb3JtYXQgPSB0aGlzLm9wdGlvbnMuaW50ZXJwb2xhdGlvbi5mb3JtYXQ7XG4gICAgaWYgKCFjYWxsYmFjaykgY2FsbGJhY2sgPSBub29wO1xuXG4gICAgZnVuY3Rpb24gY3JlYXRlQ2xhc3NPbkRlbWFuZChDbGFzc09yT2JqZWN0KSB7XG4gICAgICBpZiAoIUNsYXNzT3JPYmplY3QpIHJldHVybiBudWxsO1xuICAgICAgaWYgKHR5cGVvZiBDbGFzc09yT2JqZWN0ID09PSAnZnVuY3Rpb24nKSByZXR1cm4gbmV3IENsYXNzT3JPYmplY3QoKTtcbiAgICAgIHJldHVybiBDbGFzc09yT2JqZWN0O1xuICAgIH1cblxuICAgIC8vIGluaXQgc2VydmljZXNcbiAgICBpZiAoIXRoaXMub3B0aW9ucy5pc0Nsb25lKSB7XG4gICAgICBpZiAodGhpcy5tb2R1bGVzLmxvZ2dlcikge1xuICAgICAgICBiYXNlTG9nZ2VyLmluaXQoY3JlYXRlQ2xhc3NPbkRlbWFuZCh0aGlzLm1vZHVsZXMubG9nZ2VyKSwgdGhpcy5vcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJhc2VMb2dnZXIuaW5pdChudWxsLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICB2YXIgbHUgPSBuZXcgTGFuZ3VhZ2VVdGlsKHRoaXMub3B0aW9ucyk7XG4gICAgICB0aGlzLnN0b3JlID0gbmV3IFJlc291cmNlU3RvcmUodGhpcy5vcHRpb25zLnJlc291cmNlcywgdGhpcy5vcHRpb25zKTtcblxuICAgICAgdmFyIHMgPSB0aGlzLnNlcnZpY2VzO1xuICAgICAgcy5sb2dnZXIgPSBiYXNlTG9nZ2VyO1xuICAgICAgcy5yZXNvdXJjZVN0b3JlID0gdGhpcy5zdG9yZTtcbiAgICAgIHMucmVzb3VyY2VTdG9yZS5vbignYWRkZWQgcmVtb3ZlZCcsIGZ1bmN0aW9uIChsbmcsIG5zKSB7XG4gICAgICAgIHMuY2FjaGVDb25uZWN0b3Iuc2F2ZSgpO1xuICAgICAgfSk7XG4gICAgICBzLmxhbmd1YWdlVXRpbHMgPSBsdTtcbiAgICAgIHMucGx1cmFsUmVzb2x2ZXIgPSBuZXcgUGx1cmFsUmVzb2x2ZXIobHUsIHsgcHJlcGVuZDogdGhpcy5vcHRpb25zLnBsdXJhbFNlcGFyYXRvciwgY29tcGF0aWJpbGl0eUpTT046IHRoaXMub3B0aW9ucy5jb21wYXRpYmlsaXR5SlNPTiwgc2ltcGxpZnlQbHVyYWxTdWZmaXg6IHRoaXMub3B0aW9ucy5zaW1wbGlmeVBsdXJhbFN1ZmZpeCB9KTtcbiAgICAgIHMuaW50ZXJwb2xhdG9yID0gbmV3IEludGVycG9sYXRvcih0aGlzLm9wdGlvbnMpO1xuXG4gICAgICBzLmJhY2tlbmRDb25uZWN0b3IgPSBuZXcgQ29ubmVjdG9yKGNyZWF0ZUNsYXNzT25EZW1hbmQodGhpcy5tb2R1bGVzLmJhY2tlbmQpLCBzLnJlc291cmNlU3RvcmUsIHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAvLyBwaXBlIGV2ZW50cyBmcm9tIGJhY2tlbmRDb25uZWN0b3JcbiAgICAgIHMuYmFja2VuZENvbm5lY3Rvci5vbignKicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4gPiAxID8gX2xlbiAtIDEgOiAwKSwgX2tleSA9IDE7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMi5lbWl0LmFwcGx5KF90aGlzMiwgW2V2ZW50XS5jb25jYXQoYXJncykpO1xuICAgICAgfSk7XG5cbiAgICAgIHMuYmFja2VuZENvbm5lY3Rvci5vbignbG9hZGVkJywgZnVuY3Rpb24gKGxvYWRlZCkge1xuICAgICAgICBzLmNhY2hlQ29ubmVjdG9yLnNhdmUoKTtcbiAgICAgIH0pO1xuXG4gICAgICBzLmNhY2hlQ29ubmVjdG9yID0gbmV3IENvbm5lY3RvciQxKGNyZWF0ZUNsYXNzT25EZW1hbmQodGhpcy5tb2R1bGVzLmNhY2hlKSwgcy5yZXNvdXJjZVN0b3JlLCBzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgLy8gcGlwZSBldmVudHMgZnJvbSBiYWNrZW5kQ29ubmVjdG9yXG4gICAgICBzLmNhY2hlQ29ubmVjdG9yLm9uKCcqJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMSA/IF9sZW4yIC0gMSA6IDApLCBfa2V5MiA9IDE7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgICBhcmdzW19rZXkyIC0gMV0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMyLmVtaXQuYXBwbHkoX3RoaXMyLCBbZXZlbnRdLmNvbmNhdChhcmdzKSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKHRoaXMubW9kdWxlcy5sYW5ndWFnZURldGVjdG9yKSB7XG4gICAgICAgIHMubGFuZ3VhZ2VEZXRlY3RvciA9IGNyZWF0ZUNsYXNzT25EZW1hbmQodGhpcy5tb2R1bGVzLmxhbmd1YWdlRGV0ZWN0b3IpO1xuICAgICAgICBzLmxhbmd1YWdlRGV0ZWN0b3IuaW5pdChzLCB0aGlzLm9wdGlvbnMuZGV0ZWN0aW9uLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRyYW5zbGF0b3IgPSBuZXcgVHJhbnNsYXRvcih0aGlzLnNlcnZpY2VzLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgLy8gcGlwZSBldmVudHMgZnJvbSB0cmFuc2xhdG9yXG4gICAgICB0aGlzLnRyYW5zbGF0b3Iub24oJyonLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMgPiAxID8gX2xlbjMgLSAxIDogMCksIF9rZXkzID0gMTsgX2tleTMgPCBfbGVuMzsgX2tleTMrKykge1xuICAgICAgICAgIGFyZ3NbX2tleTMgLSAxXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczIuZW1pdC5hcHBseShfdGhpczIsIFtldmVudF0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLm1vZHVsZXMuZXh0ZXJuYWwuZm9yRWFjaChmdW5jdGlvbiAobSkge1xuICAgICAgICBpZiAobS5pbml0KSBtLmluaXQoX3RoaXMyKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGFwcGVuZCBhcGlcbiAgICB2YXIgc3RvcmVBcGkgPSBbJ2dldFJlc291cmNlJywgJ2FkZFJlc291cmNlJywgJ2FkZFJlc291cmNlcycsICdhZGRSZXNvdXJjZUJ1bmRsZScsICdyZW1vdmVSZXNvdXJjZUJ1bmRsZScsICdoYXNSZXNvdXJjZUJ1bmRsZScsICdnZXRSZXNvdXJjZUJ1bmRsZSddO1xuICAgIHN0b3JlQXBpLmZvckVhY2goZnVuY3Rpb24gKGZjTmFtZSkge1xuICAgICAgX3RoaXMyW2ZjTmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfc3RvcmU7XG5cbiAgICAgICAgcmV0dXJuIChfc3RvcmUgPSBfdGhpczIuc3RvcmUpW2ZjTmFtZV0uYXBwbHkoX3N0b3JlLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9KTtcblxuICAgIC8vIENPTVBBVElCSUxJVFk6IHJlbW92ZSB0aGlzXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb21wYXRpYmlsaXR5QVBJID09PSAndjEnKSBhcHBlbmRCYWNrd2FyZHNBUEkodGhpcyk7XG5cbiAgICB2YXIgbG9hZCA9IGZ1bmN0aW9uIGxvYWQoKSB7XG4gICAgICBfdGhpczIuY2hhbmdlTGFuZ3VhZ2UoX3RoaXMyLm9wdGlvbnMubG5nLCBmdW5jdGlvbiAoZXJyLCB0KSB7XG4gICAgICAgIF90aGlzMi5pc0luaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgX3RoaXMyLmxvZ2dlci5sb2coJ2luaXRpYWxpemVkJywgX3RoaXMyLm9wdGlvbnMpO1xuICAgICAgICBfdGhpczIuZW1pdCgnaW5pdGlhbGl6ZWQnLCBfdGhpczIub3B0aW9ucyk7XG5cbiAgICAgICAgY2FsbGJhY2soZXJyLCB0KTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLnJlc291cmNlcyB8fCAhdGhpcy5vcHRpb25zLmluaXRJbW1lZGlhdGUpIHtcbiAgICAgIGxvYWQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0VGltZW91dChsb2FkLCAwKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvKiBlc2xpbnQgY29uc2lzdGVudC1yZXR1cm46IDAgKi9cblxuXG4gIEkxOG4ucHJvdG90eXBlLmxvYWRSZXNvdXJjZXMgPSBmdW5jdGlvbiBsb2FkUmVzb3VyY2VzKCkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiBub29wO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMucmVzb3VyY2VzKSB7XG4gICAgICBpZiAodGhpcy5sYW5ndWFnZSAmJiB0aGlzLmxhbmd1YWdlLnRvTG93ZXJDYXNlKCkgPT09ICdjaW1vZGUnKSByZXR1cm4gY2FsbGJhY2soKTsgLy8gYXZvaWQgbG9hZGluZyByZXNvdXJjZXMgZm9yIGNpbW9kZVxuXG4gICAgICB2YXIgdG9Mb2FkID0gW107XG5cbiAgICAgIHZhciBhcHBlbmQgPSBmdW5jdGlvbiBhcHBlbmQobG5nKSB7XG4gICAgICAgIGlmICghbG5nKSByZXR1cm47XG4gICAgICAgIHZhciBsbmdzID0gX3RoaXMzLnNlcnZpY2VzLmxhbmd1YWdlVXRpbHMudG9SZXNvbHZlSGllcmFyY2h5KGxuZyk7XG4gICAgICAgIGxuZ3MuZm9yRWFjaChmdW5jdGlvbiAobCkge1xuICAgICAgICAgIGlmICh0b0xvYWQuaW5kZXhPZihsKSA8IDApIHRvTG9hZC5wdXNoKGwpO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGlmICghdGhpcy5sYW5ndWFnZSkge1xuICAgICAgICAvLyBhdCBsZWFzdCBsb2FkIGZhbGxiYWNrcyBpbiB0aGlzIGNhc2VcbiAgICAgICAgdmFyIGZhbGxiYWNrcyA9IHRoaXMuc2VydmljZXMubGFuZ3VhZ2VVdGlscy5nZXRGYWxsYmFja0NvZGVzKHRoaXMub3B0aW9ucy5mYWxsYmFja0xuZyk7XG4gICAgICAgIGZhbGxiYWNrcy5mb3JFYWNoKGZ1bmN0aW9uIChsKSB7XG4gICAgICAgICAgcmV0dXJuIGFwcGVuZChsKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcHBlbmQodGhpcy5sYW5ndWFnZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMucHJlbG9hZCkge1xuICAgICAgICB0aGlzLm9wdGlvbnMucHJlbG9hZC5mb3JFYWNoKGZ1bmN0aW9uIChsKSB7XG4gICAgICAgICAgcmV0dXJuIGFwcGVuZChsKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2VydmljZXMuY2FjaGVDb25uZWN0b3IubG9hZCh0b0xvYWQsIHRoaXMub3B0aW9ucy5ucywgZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpczMuc2VydmljZXMuYmFja2VuZENvbm5lY3Rvci5sb2FkKHRvTG9hZCwgX3RoaXMzLm9wdGlvbnMubnMsIGNhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBjYWxsYmFjayhudWxsKTtcbiAgICB9XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUucmVsb2FkUmVzb3VyY2VzID0gZnVuY3Rpb24gcmVsb2FkUmVzb3VyY2VzKGxuZ3MsIG5zKSB7XG4gICAgaWYgKCFsbmdzKSBsbmdzID0gdGhpcy5sYW5ndWFnZXM7XG4gICAgaWYgKCFucykgbnMgPSB0aGlzLm9wdGlvbnMubnM7XG4gICAgdGhpcy5zZXJ2aWNlcy5iYWNrZW5kQ29ubmVjdG9yLnJlbG9hZChsbmdzLCBucyk7XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUudXNlID0gZnVuY3Rpb24gdXNlKG1vZHVsZSkge1xuICAgIGlmIChtb2R1bGUudHlwZSA9PT0gJ2JhY2tlbmQnKSB7XG4gICAgICB0aGlzLm1vZHVsZXMuYmFja2VuZCA9IG1vZHVsZTtcbiAgICB9XG5cbiAgICBpZiAobW9kdWxlLnR5cGUgPT09ICdjYWNoZScpIHtcbiAgICAgIHRoaXMubW9kdWxlcy5jYWNoZSA9IG1vZHVsZTtcbiAgICB9XG5cbiAgICBpZiAobW9kdWxlLnR5cGUgPT09ICdsb2dnZXInIHx8IG1vZHVsZS5sb2cgJiYgbW9kdWxlLndhcm4gJiYgbW9kdWxlLmVycm9yKSB7XG4gICAgICB0aGlzLm1vZHVsZXMubG9nZ2VyID0gbW9kdWxlO1xuICAgIH1cblxuICAgIGlmIChtb2R1bGUudHlwZSA9PT0gJ2xhbmd1YWdlRGV0ZWN0b3InKSB7XG4gICAgICB0aGlzLm1vZHVsZXMubGFuZ3VhZ2VEZXRlY3RvciA9IG1vZHVsZTtcbiAgICB9XG5cbiAgICBpZiAobW9kdWxlLnR5cGUgPT09ICdwb3N0UHJvY2Vzc29yJykge1xuICAgICAgcG9zdFByb2Nlc3Nvci5hZGRQb3N0UHJvY2Vzc29yKG1vZHVsZSk7XG4gICAgfVxuXG4gICAgaWYgKG1vZHVsZS50eXBlID09PSAnM3JkUGFydHknKSB7XG4gICAgICB0aGlzLm1vZHVsZXMuZXh0ZXJuYWwucHVzaChtb2R1bGUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEkxOG4ucHJvdG90eXBlLmNoYW5nZUxhbmd1YWdlID0gZnVuY3Rpb24gY2hhbmdlTGFuZ3VhZ2UobG5nLCBjYWxsYmFjaykge1xuICAgIHZhciBfdGhpczQgPSB0aGlzO1xuXG4gICAgdmFyIGRvbmUgPSBmdW5jdGlvbiBkb25lKGVyciwgbCkge1xuICAgICAgaWYgKGwpIHtcbiAgICAgICAgX3RoaXM0LmVtaXQoJ2xhbmd1YWdlQ2hhbmdlZCcsIGwpO1xuICAgICAgICBfdGhpczQubG9nZ2VyLmxvZygnbGFuZ3VhZ2VDaGFuZ2VkJywgbCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soZXJyLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBfdGhpczQudC5hcHBseShfdGhpczQsIGFyZ3VtZW50cyk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIHNldExuZyA9IGZ1bmN0aW9uIHNldExuZyhsKSB7XG4gICAgICBpZiAobCkge1xuICAgICAgICBfdGhpczQubGFuZ3VhZ2UgPSBsO1xuICAgICAgICBfdGhpczQubGFuZ3VhZ2VzID0gX3RoaXM0LnNlcnZpY2VzLmxhbmd1YWdlVXRpbHMudG9SZXNvbHZlSGllcmFyY2h5KGwpO1xuXG4gICAgICAgIF90aGlzNC50cmFuc2xhdG9yLmNoYW5nZUxhbmd1YWdlKGwpO1xuXG4gICAgICAgIGlmIChfdGhpczQuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3RvcikgX3RoaXM0LnNlcnZpY2VzLmxhbmd1YWdlRGV0ZWN0b3IuY2FjaGVVc2VyTGFuZ3VhZ2UobCk7XG4gICAgICB9XG5cbiAgICAgIF90aGlzNC5sb2FkUmVzb3VyY2VzKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgZG9uZShlcnIsIGwpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmICghbG5nICYmIHRoaXMuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3RvciAmJiAhdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yLmFzeW5jKSB7XG4gICAgICBzZXRMbmcodGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yLmRldGVjdCgpKTtcbiAgICB9IGVsc2UgaWYgKCFsbmcgJiYgdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yICYmIHRoaXMuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3Rvci5hc3luYykge1xuICAgICAgdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yLmRldGVjdChzZXRMbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRMbmcobG5nKTtcbiAgICB9XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUuZ2V0Rml4ZWRUID0gZnVuY3Rpb24gZ2V0Rml4ZWRUKGxuZywgbnMpIHtcbiAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgIHZhciBmaXhlZFQgPSBmdW5jdGlvbiBmaXhlZFQoa2V5KSB7XG4gICAgICB2YXIgb3B0cyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICAgIHZhciBvcHRpb25zID0gX2V4dGVuZHMoe30sIG9wdHMpO1xuICAgICAgb3B0aW9ucy5sbmcgPSBvcHRpb25zLmxuZyB8fCBmaXhlZFQubG5nO1xuICAgICAgb3B0aW9ucy5sbmdzID0gb3B0aW9ucy5sbmdzIHx8IGZpeGVkVC5sbmdzO1xuICAgICAgb3B0aW9ucy5ucyA9IG9wdGlvbnMubnMgfHwgZml4ZWRULm5zO1xuICAgICAgcmV0dXJuIF90aGlzNS50KGtleSwgb3B0aW9ucyk7XG4gICAgfTtcbiAgICBpZiAodHlwZW9mIGxuZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGZpeGVkVC5sbmcgPSBsbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpeGVkVC5sbmdzID0gbG5nO1xuICAgIH1cbiAgICBmaXhlZFQubnMgPSBucztcbiAgICByZXR1cm4gZml4ZWRUO1xuICB9O1xuXG4gIEkxOG4ucHJvdG90eXBlLnQgPSBmdW5jdGlvbiB0KCkge1xuICAgIHZhciBfdHJhbnNsYXRvcjtcblxuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0b3IgJiYgKF90cmFuc2xhdG9yID0gdGhpcy50cmFuc2xhdG9yKS50cmFuc2xhdGUuYXBwbHkoX3RyYW5zbGF0b3IsIGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUuZXhpc3RzID0gZnVuY3Rpb24gZXhpc3RzKCkge1xuICAgIHZhciBfdHJhbnNsYXRvcjI7XG5cbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdG9yICYmIChfdHJhbnNsYXRvcjIgPSB0aGlzLnRyYW5zbGF0b3IpLmV4aXN0cy5hcHBseShfdHJhbnNsYXRvcjIsIGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUuc2V0RGVmYXVsdE5hbWVzcGFjZSA9IGZ1bmN0aW9uIHNldERlZmF1bHROYW1lc3BhY2UobnMpIHtcbiAgICB0aGlzLm9wdGlvbnMuZGVmYXVsdE5TID0gbnM7XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUubG9hZE5hbWVzcGFjZXMgPSBmdW5jdGlvbiBsb2FkTmFtZXNwYWNlcyhucywgY2FsbGJhY2spIHtcbiAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgIGlmICghdGhpcy5vcHRpb25zLm5zKSByZXR1cm4gY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICBpZiAodHlwZW9mIG5zID09PSAnc3RyaW5nJykgbnMgPSBbbnNdO1xuXG4gICAgbnMuZm9yRWFjaChmdW5jdGlvbiAobikge1xuICAgICAgaWYgKF90aGlzNi5vcHRpb25zLm5zLmluZGV4T2YobikgPCAwKSBfdGhpczYub3B0aW9ucy5ucy5wdXNoKG4pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5sb2FkUmVzb3VyY2VzKGNhbGxiYWNrKTtcbiAgfTtcblxuICBJMThuLnByb3RvdHlwZS5sb2FkTGFuZ3VhZ2VzID0gZnVuY3Rpb24gbG9hZExhbmd1YWdlcyhsbmdzLCBjYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2YgbG5ncyA9PT0gJ3N0cmluZycpIGxuZ3MgPSBbbG5nc107XG4gICAgdmFyIHByZWxvYWRlZCA9IHRoaXMub3B0aW9ucy5wcmVsb2FkIHx8IFtdO1xuXG4gICAgdmFyIG5ld0xuZ3MgPSBsbmdzLmZpbHRlcihmdW5jdGlvbiAobG5nKSB7XG4gICAgICByZXR1cm4gcHJlbG9hZGVkLmluZGV4T2YobG5nKSA8IDA7XG4gICAgfSk7XG4gICAgLy8gRXhpdCBlYXJseSBpZiBhbGwgZ2l2ZW4gbGFuZ3VhZ2VzIGFyZSBhbHJlYWR5IHByZWxvYWRlZFxuICAgIGlmICghbmV3TG5ncy5sZW5ndGgpIHJldHVybiBjYWxsYmFjaygpO1xuXG4gICAgdGhpcy5vcHRpb25zLnByZWxvYWQgPSBwcmVsb2FkZWQuY29uY2F0KG5ld0xuZ3MpO1xuICAgIHRoaXMubG9hZFJlc291cmNlcyhjYWxsYmFjayk7XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUuZGlyID0gZnVuY3Rpb24gZGlyKGxuZykge1xuICAgIGlmICghbG5nKSBsbmcgPSB0aGlzLmxhbmd1YWdlcyAmJiB0aGlzLmxhbmd1YWdlcy5sZW5ndGggPiAwID8gdGhpcy5sYW5ndWFnZXNbMF0gOiB0aGlzLmxhbmd1YWdlO1xuICAgIGlmICghbG5nKSByZXR1cm4gJ3J0bCc7XG5cbiAgICB2YXIgcnRsTG5ncyA9IFsnYXInLCAnc2h1JywgJ3NxcicsICdzc2gnLCAneGFhJywgJ3loZCcsICd5dWQnLCAnYWFvJywgJ2FiaCcsICdhYnYnLCAnYWNtJywgJ2FjcScsICdhY3cnLCAnYWN4JywgJ2FjeScsICdhZGYnLCAnYWRzJywgJ2FlYicsICdhZWMnLCAnYWZiJywgJ2FqcCcsICdhcGMnLCAnYXBkJywgJ2FyYicsICdhcnEnLCAnYXJzJywgJ2FyeScsICdhcnonLCAnYXV6JywgJ2F2bCcsICdheWgnLCAnYXlsJywgJ2F5bicsICdheXAnLCAnYmJ6JywgJ3BnYScsICdoZScsICdpdycsICdwcycsICdwYnQnLCAncGJ1JywgJ3BzdCcsICdwcnAnLCAncHJkJywgJ3VyJywgJ3lkZCcsICd5ZHMnLCAneWloJywgJ2ppJywgJ3lpJywgJ2hibycsICdtZW4nLCAneG1uJywgJ2ZhJywgJ2pwcicsICdwZW8nLCAncGVzJywgJ3BycycsICdkdicsICdzYW0nXTtcblxuICAgIHJldHVybiBydGxMbmdzLmluZGV4T2YodGhpcy5zZXJ2aWNlcy5sYW5ndWFnZVV0aWxzLmdldExhbmd1YWdlUGFydEZyb21Db2RlKGxuZykpID49IDAgPyAncnRsJyA6ICdsdHInO1xuICB9O1xuXG4gIC8qIGVzbGludCBjbGFzcy1tZXRob2RzLXVzZS10aGlzOiAwICovXG5cblxuICBJMThuLnByb3RvdHlwZS5jcmVhdGVJbnN0YW5jZSA9IGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbMV07XG5cbiAgICByZXR1cm4gbmV3IEkxOG4ob3B0aW9ucywgY2FsbGJhY2spO1xuICB9O1xuXG4gIEkxOG4ucHJvdG90eXBlLmNsb25lSW5zdGFuY2UgPSBmdW5jdGlvbiBjbG9uZUluc3RhbmNlKCkge1xuICAgIHZhciBfdGhpczcgPSB0aGlzO1xuXG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbm9vcDtcblxuICAgIHZhciBtZXJnZWRPcHRpb25zID0gX2V4dGVuZHMoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucywgeyBpc0Nsb25lOiB0cnVlIH0pO1xuICAgIHZhciBjbG9uZSA9IG5ldyBJMThuKG1lcmdlZE9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICB2YXIgbWVtYmVyc1RvQ29weSA9IFsnc3RvcmUnLCAnc2VydmljZXMnLCAnbGFuZ3VhZ2UnXTtcbiAgICBtZW1iZXJzVG9Db3B5LmZvckVhY2goZnVuY3Rpb24gKG0pIHtcbiAgICAgIGNsb25lW21dID0gX3RoaXM3W21dO1xuICAgIH0pO1xuICAgIGNsb25lLnRyYW5zbGF0b3IgPSBuZXcgVHJhbnNsYXRvcihjbG9uZS5zZXJ2aWNlcywgY2xvbmUub3B0aW9ucyk7XG4gICAgY2xvbmUudHJhbnNsYXRvci5vbignKicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjQgPiAxID8gX2xlbjQgLSAxIDogMCksIF9rZXk0ID0gMTsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgICAgICBhcmdzW19rZXk0IC0gMV0gPSBhcmd1bWVudHNbX2tleTRdO1xuICAgICAgfVxuXG4gICAgICBjbG9uZS5lbWl0LmFwcGx5KGNsb25lLCBbZXZlbnRdLmNvbmNhdChhcmdzKSk7XG4gICAgfSk7XG4gICAgY2xvbmUuaW5pdChtZXJnZWRPcHRpb25zLCBjYWxsYmFjayk7XG5cbiAgICByZXR1cm4gY2xvbmU7XG4gIH07XG5cbiAgcmV0dXJuIEkxOG47XG59KEV2ZW50RW1pdHRlcik7XG5cbnZhciBpMThuZXh0ID0gbmV3IEkxOG4oKTtcblxucmV0dXJuIGkxOG5leHQ7XG5cbn0pKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2V4dGVybmFsL2kxOG5leHQvc2NyaXB0cy9pMThuZXh0LmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbC5pMThuZXh0WEhSQmFja2VuZCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxudmFyIGFyciA9IFtdO1xudmFyIGVhY2ggPSBhcnIuZm9yRWFjaDtcbnZhciBzbGljZSA9IGFyci5zbGljZTtcblxuZnVuY3Rpb24gZGVmYXVsdHMob2JqKSB7XG4gIGVhY2guY2FsbChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICBpZiAoc291cmNlKSB7XG4gICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICBpZiAob2JqW3Byb3BdID09PSB1bmRlZmluZWQpIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIGFkZFF1ZXJ5U3RyaW5nKHVybCwgcGFyYW1zKSB7XG4gIGlmIChwYXJhbXMgJiYgKHR5cGVvZiBwYXJhbXMgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKHBhcmFtcykpID09PSAnb2JqZWN0Jykge1xuICAgIHZhciBxdWVyeVN0cmluZyA9ICcnLFxuICAgICAgICBlID0gZW5jb2RlVVJJQ29tcG9uZW50O1xuXG4gICAgLy8gTXVzdCBlbmNvZGUgZGF0YVxuICAgIGZvciAodmFyIHBhcmFtTmFtZSBpbiBwYXJhbXMpIHtcbiAgICAgIHF1ZXJ5U3RyaW5nICs9ICcmJyArIGUocGFyYW1OYW1lKSArICc9JyArIGUocGFyYW1zW3BhcmFtTmFtZV0pO1xuICAgIH1cblxuICAgIGlmICghcXVlcnlTdHJpbmcpIHtcbiAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgdXJsID0gdXJsICsgKHVybC5pbmRleE9mKCc/JykgIT09IC0xID8gJyYnIDogJz8nKSArIHF1ZXJ5U3RyaW5nLnNsaWNlKDEpO1xuICB9XG5cbiAgcmV0dXJuIHVybDtcbn1cblxuLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vWGVvbmNyb3NzLzc2NjMyNzNcbmZ1bmN0aW9uIGFqYXgodXJsLCBvcHRpb25zLCBjYWxsYmFjaywgZGF0YSwgY2FjaGUpIHtcblxuICBpZiAoZGF0YSAmJiAodHlwZW9mIGRhdGEgPT09ICd1bmRlZmluZWQnID8gJ3VuZGVmaW5lZCcgOiBfdHlwZW9mKGRhdGEpKSA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAoIWNhY2hlKSB7XG4gICAgICBkYXRhWydfdCddID0gbmV3IERhdGUoKTtcbiAgICB9XG4gICAgLy8gVVJMIGVuY29kZWQgZm9ybSBkYXRhIG11c3QgYmUgaW4gcXVlcnlzdHJpbmcgZm9ybWF0XG4gICAgZGF0YSA9IGFkZFF1ZXJ5U3RyaW5nKCcnLCBkYXRhKS5zbGljZSgxKTtcbiAgfVxuXG4gIGlmIChvcHRpb25zLnF1ZXJ5U3RyaW5nUGFyYW1zKSB7XG4gICAgdXJsID0gYWRkUXVlcnlTdHJpbmcodXJsLCBvcHRpb25zLnF1ZXJ5U3RyaW5nUGFyYW1zKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgdmFyIHg7XG4gICAgaWYgKFhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICB4ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHggPSBuZXcgQWN0aXZlWE9iamVjdCgnTVNYTUwyLlhNTEhUVFAuMy4wJyk7XG4gICAgfVxuICAgIHgub3BlbihkYXRhID8gJ1BPU1QnIDogJ0dFVCcsIHVybCwgMSk7XG4gICAgaWYgKCFvcHRpb25zLmNyb3NzRG9tYWluKSB7XG4gICAgICB4LnNldFJlcXVlc3RIZWFkZXIoJ1gtUmVxdWVzdGVkLVdpdGgnLCAnWE1MSHR0cFJlcXVlc3QnKTtcbiAgICB9XG4gICAgeC53aXRoQ3JlZGVudGlhbHMgPSAhIW9wdGlvbnMud2l0aENyZWRlbnRpYWxzO1xuICAgIGlmIChkYXRhKSB7XG4gICAgICB4LnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcbiAgICB9XG4gICAgdmFyIGggPSBvcHRpb25zLmN1c3RvbUhlYWRlcnM7XG4gICAgaWYgKGgpIHtcbiAgICAgIGZvciAodmFyIGkgaW4gaCkge1xuICAgICAgICB4LnNldFJlcXVlc3RIZWFkZXIoaSwgaFtpXSk7XG4gICAgICB9XG4gICAgfVxuICAgIHgub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgeC5yZWFkeVN0YXRlID4gMyAmJiBjYWxsYmFjayAmJiBjYWxsYmFjayh4LnJlc3BvbnNlVGV4dCwgeCk7XG4gICAgfTtcbiAgICB4LnNlbmQoZGF0YSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlICYmIGNvbnNvbGUubG9nKGUpO1xuICB9XG59XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRzKCkge1xuICByZXR1cm4ge1xuICAgIGxvYWRQYXRoOiAnL2xvY2FsZXMve3tsbmd9fS97e25zfX0uanNvbicsXG4gICAgYWRkUGF0aDogJ2xvY2FsZXMvYWRkL3t7bG5nfX0ve3tuc319JyxcbiAgICBhbGxvd011bHRpTG9hZGluZzogZmFsc2UsXG4gICAgcGFyc2U6IEpTT04ucGFyc2UsXG4gICAgY3Jvc3NEb21haW46IGZhbHNlLFxuICAgIGFqYXg6IGFqYXhcbiAgfTtcbn1cblxudmFyIEJhY2tlbmQgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEJhY2tlbmQoc2VydmljZXMpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQmFja2VuZCk7XG5cbiAgICB0aGlzLmluaXQoc2VydmljZXMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy50eXBlID0gJ2JhY2tlbmQnO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEJhY2tlbmQsIFt7XG4gICAga2V5OiAnaW5pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQoc2VydmljZXMpIHtcbiAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgICAgdGhpcy5zZXJ2aWNlcyA9IHNlcnZpY2VzO1xuICAgICAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHMob3B0aW9ucywgdGhpcy5vcHRpb25zIHx8IHt9LCBnZXREZWZhdWx0cygpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdyZWFkTXVsdGknLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWFkTXVsdGkobGFuZ3VhZ2VzLCBuYW1lc3BhY2VzLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGxvYWRQYXRoID0gdGhpcy5vcHRpb25zLmxvYWRQYXRoO1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMubG9hZFBhdGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbG9hZFBhdGggPSB0aGlzLm9wdGlvbnMubG9hZFBhdGgobGFuZ3VhZ2VzLCBuYW1lc3BhY2VzKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHVybCA9IHRoaXMuc2VydmljZXMuaW50ZXJwb2xhdG9yLmludGVycG9sYXRlKGxvYWRQYXRoLCB7IGxuZzogbGFuZ3VhZ2VzLmpvaW4oJysnKSwgbnM6IG5hbWVzcGFjZXMuam9pbignKycpIH0pO1xuXG4gICAgICB0aGlzLmxvYWRVcmwodXJsLCBjYWxsYmFjayk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVhZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlYWQobGFuZ3VhZ2UsIG5hbWVzcGFjZSwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBsb2FkUGF0aCA9IHRoaXMub3B0aW9ucy5sb2FkUGF0aDtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmxvYWRQYXRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxvYWRQYXRoID0gdGhpcy5vcHRpb25zLmxvYWRQYXRoKFtsYW5ndWFnZV0sIFtuYW1lc3BhY2VdKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHVybCA9IHRoaXMuc2VydmljZXMuaW50ZXJwb2xhdG9yLmludGVycG9sYXRlKGxvYWRQYXRoLCB7IGxuZzogbGFuZ3VhZ2UsIG5zOiBuYW1lc3BhY2UgfSk7XG5cbiAgICAgIHRoaXMubG9hZFVybCh1cmwsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdsb2FkVXJsJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZFVybCh1cmwsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuYWpheCh1cmwsIHRoaXMub3B0aW9ucywgZnVuY3Rpb24gKGRhdGEsIHhocikge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSA1MDAgJiYgeGhyLnN0YXR1cyA8IDYwMCkgcmV0dXJuIGNhbGxiYWNrKCdmYWlsZWQgbG9hZGluZyAnICsgdXJsLCB0cnVlIC8qIHJldHJ5ICovKTtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gNDAwICYmIHhoci5zdGF0dXMgPCA1MDApIHJldHVybiBjYWxsYmFjaygnZmFpbGVkIGxvYWRpbmcgJyArIHVybCwgZmFsc2UgLyogbm8gcmV0cnkgKi8pO1xuXG4gICAgICAgIHZhciByZXQgPSB2b2lkIDAsXG4gICAgICAgICAgICBlcnIgPSB2b2lkIDA7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0ID0gX3RoaXMub3B0aW9ucy5wYXJzZShkYXRhLCB1cmwpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZXJyID0gJ2ZhaWxlZCBwYXJzaW5nICcgKyB1cmwgKyAnIHRvIGpzb24nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIsIGZhbHNlKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmV0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2NyZWF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZShsYW5ndWFnZXMsIG5hbWVzcGFjZSwga2V5LCBmYWxsYmFja1ZhbHVlKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgaWYgKHR5cGVvZiBsYW5ndWFnZXMgPT09ICdzdHJpbmcnKSBsYW5ndWFnZXMgPSBbbGFuZ3VhZ2VzXTtcblxuICAgICAgdmFyIHBheWxvYWQgPSB7fTtcbiAgICAgIHBheWxvYWRba2V5XSA9IGZhbGxiYWNrVmFsdWUgfHwgJyc7XG5cbiAgICAgIGxhbmd1YWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChsbmcpIHtcbiAgICAgICAgdmFyIHVybCA9IF90aGlzMi5zZXJ2aWNlcy5pbnRlcnBvbGF0b3IuaW50ZXJwb2xhdGUoX3RoaXMyLm9wdGlvbnMuYWRkUGF0aCwgeyBsbmc6IGxuZywgbnM6IG5hbWVzcGFjZSB9KTtcblxuICAgICAgICBfdGhpczIub3B0aW9ucy5hamF4KHVybCwgX3RoaXMyLm9wdGlvbnMsIGZ1bmN0aW9uIChkYXRhLCB4aHIpIHtcbiAgICAgICAgICAvL2NvbnN0IHN0YXR1c0NvZGUgPSB4aHIuc3RhdHVzLnRvU3RyaW5nKCk7XG4gICAgICAgICAgLy8gVE9ETzogaWYgc3RhdHVzQ29kZSA9PT0gNHh4IGRvIGxvZ1xuICAgICAgICB9LCBwYXlsb2FkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBCYWNrZW5kO1xufSgpO1xuXG5CYWNrZW5kLnR5cGUgPSAnYmFja2VuZCc7XG5cbnJldHVybiBCYWNrZW5kO1xuXG59KSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvaTE4bmV4dFhIUkJhY2tlbmQuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLmkxOG5leHRMb2NhbFN0b3JhZ2VDYWNoZSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxudmFyIGFyciA9IFtdO1xudmFyIGVhY2ggPSBhcnIuZm9yRWFjaDtcbnZhciBzbGljZSA9IGFyci5zbGljZTtcblxuZnVuY3Rpb24gZGVmYXVsdHMob2JqKSB7XG4gIGVhY2guY2FsbChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICBpZiAoc291cmNlKSB7XG4gICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICBpZiAob2JqW3Byb3BdID09PSB1bmRlZmluZWQpIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuXG5cblxuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gIHZhciB0aW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiBsYXRlcigpIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbiAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICB9O1xufVxuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgc3RvcmFnZSA9IHtcbiAgc2V0SXRlbTogZnVuY3Rpb24gc2V0SXRlbShrZXksIHZhbHVlKSB7XG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gZi5sb2coJ2ZhaWxlZCB0byBzZXQgdmFsdWUgZm9yIGtleSBcIicgKyBrZXkgKyAnXCIgdG8gbG9jYWxTdG9yYWdlLicpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZ2V0SXRlbTogZnVuY3Rpb24gZ2V0SXRlbShrZXksIHZhbHVlKSB7XG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGYubG9nKCdmYWlsZWQgdG8gZ2V0IHZhbHVlIGZvciBrZXkgXCInICsga2V5ICsgJ1wiIGZyb20gbG9jYWxTdG9yYWdlLicpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59O1xuXG5mdW5jdGlvbiBnZXREZWZhdWx0cygpIHtcbiAgcmV0dXJuIHtcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgICBwcmVmaXg6ICdpMThuZXh0X3Jlc18nLFxuICAgIGV4cGlyYXRpb25UaW1lOiA3ICogMjQgKiA2MCAqIDYwICogMTAwMCxcbiAgICB2ZXJzaW9uczoge31cbiAgfTtcbn1cblxudmFyIENhY2hlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDYWNoZShzZXJ2aWNlcykge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDYWNoZSk7XG5cbiAgICB0aGlzLmluaXQoc2VydmljZXMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy50eXBlID0gJ2NhY2hlJztcbiAgICB0aGlzLmRlYm91bmNlZFN0b3JlID0gZGVib3VuY2UodGhpcy5zdG9yZSwgMTAwMDApO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENhY2hlLCBbe1xuICAgIGtleTogJ2luaXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KHNlcnZpY2VzKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICAgIHRoaXMuc2VydmljZXMgPSBzZXJ2aWNlcztcbiAgICAgIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzKG9wdGlvbnMsIHRoaXMub3B0aW9ucyB8fCB7fSwgZ2V0RGVmYXVsdHMoKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnbG9hZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxvYWQobG5ncywgY2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBzdG9yZSA9IHt9O1xuICAgICAgdmFyIG5vd01TID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgIGlmICghd2luZG93LmxvY2FsU3RvcmFnZSB8fCAhbG5ncy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIG51bGwpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdG9kbyA9IGxuZ3MubGVuZ3RoO1xuXG4gICAgICBsbmdzLmZvckVhY2goZnVuY3Rpb24gKGxuZykge1xuICAgICAgICB2YXIgbG9jYWwgPSBzdG9yYWdlLmdldEl0ZW0oX3RoaXMub3B0aW9ucy5wcmVmaXggKyBsbmcpO1xuXG4gICAgICAgIGlmIChsb2NhbCkge1xuICAgICAgICAgIGxvY2FsID0gSlNPTi5wYXJzZShsb2NhbCk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgIC8vIGV4cGlyYXRpb24gZmllbGQgaXMgbWFuZGF0b3J5LCBhbmQgc2hvdWxkIG5vdCBiZSBleHBpcmVkXG4gICAgICAgICAgbG9jYWwuaTE4blN0YW1wICYmIGxvY2FsLmkxOG5TdGFtcCArIF90aGlzLm9wdGlvbnMuZXhwaXJhdGlvblRpbWUgPiBub3dNUyAmJlxuXG4gICAgICAgICAgLy8gdGhlcmUgc2hvdWxkIGJlIG5vIGxhbmd1YWdlIHZlcnNpb24gc2V0LCBvciBpZiBpdCBpcywgaXQgc2hvdWxkIG1hdGNoIHRoZSBvbmUgaW4gdHJhbnNsYXRpb25cbiAgICAgICAgICBfdGhpcy5vcHRpb25zLnZlcnNpb25zW2xuZ10gPT09IGxvY2FsLmkxOG5WZXJzaW9uKSB7XG4gICAgICAgICAgICBkZWxldGUgbG9jYWwuaTE4blZlcnNpb247XG4gICAgICAgICAgICBzdG9yZVtsbmddID0gbG9jYWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdG9kbyAtPSAxO1xuICAgICAgICBpZiAodG9kbyA9PT0gMCkge1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHN0b3JlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3N0b3JlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcmUoc3RvcmVQYXJhbSkge1xuICAgICAgdmFyIHN0b3JlID0gc3RvcmVQYXJhbTtcbiAgICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlKSB7XG4gICAgICAgIGZvciAodmFyIG0gaW4gc3RvcmUpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgICAgLy8gdGltZXN0YW1wXG4gICAgICAgICAgc3RvcmVbbV0uaTE4blN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgICAvLyBsYW5ndWFnZSB2ZXJzaW9uIChpZiBzZXQpXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy52ZXJzaW9uc1ttXSkge1xuICAgICAgICAgICAgc3RvcmVbbV0uaTE4blZlcnNpb24gPSB0aGlzLm9wdGlvbnMudmVyc2lvbnNbbV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc2F2ZVxuICAgICAgICAgIHN0b3JhZ2Uuc2V0SXRlbSh0aGlzLm9wdGlvbnMucHJlZml4ICsgbSwgSlNPTi5zdHJpbmdpZnkoc3RvcmVbbV0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3NhdmUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzYXZlKHN0b3JlKSB7XG4gICAgICB0aGlzLmRlYm91bmNlZFN0b3JlKHN0b3JlKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ2FjaGU7XG59KCk7XG5cbkNhY2hlLnR5cGUgPSAnY2FjaGUnO1xuXG5yZXR1cm4gQ2FjaGU7XG5cbn0pKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2V4dGVybmFsL2kxOG5leHQvc2NyaXB0cy9pMThuZXh0TG9jYWxTdG9yYWdlQ2FjaGUuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKCdpMThuZXh0U3ByaW50ZlBvc3RQcm9jZXNzb3InLCBmYWN0b3J5KSA6XG4gICAgKGdsb2JhbC5pMThuZXh0U3ByaW50ZlBvc3RQcm9jZXNzb3IgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCBmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBiYWJlbEhlbHBlcnMgPSB7fTtcbiAgICBiYWJlbEhlbHBlcnMudHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9IDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuICAgIGJhYmVsSGVscGVycztcblxuICAgIHZhciByZSA9IHtcbiAgICAgICAgbm90X3N0cmluZzogL1tec10vLFxuICAgICAgICBudW1iZXI6IC9bZGllZmddLyxcbiAgICAgICAganNvbjogL1tqXS8sXG4gICAgICAgIG5vdF9qc29uOiAvW15qXS8sXG4gICAgICAgIHRleHQ6IC9eW15cXHgyNV0rLyxcbiAgICAgICAgbW9kdWxvOiAvXlxceDI1ezJ9LyxcbiAgICAgICAgcGxhY2Vob2xkZXI6IC9eXFx4MjUoPzooWzEtOV1cXGQqKVxcJHxcXCgoW15cXCldKylcXCkpPyhcXCspPygwfCdbXiRdKT8oLSk/KFxcZCspPyg/OlxcLihcXGQrKSk/KFtiLWdpam9zdXhYXSkvLFxuICAgICAgICBrZXk6IC9eKFthLXpfXVthLXpfXFxkXSopL2ksXG4gICAgICAgIGtleV9hY2Nlc3M6IC9eXFwuKFthLXpfXVthLXpfXFxkXSopL2ksXG4gICAgICAgIGluZGV4X2FjY2VzczogL15cXFsoXFxkKylcXF0vLFxuICAgICAgICBzaWduOiAvXltcXCtcXC1dL1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBzcHJpbnRmKCkge1xuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzBdLFxuICAgICAgICAgICAgY2FjaGUgPSBzcHJpbnRmLmNhY2hlO1xuICAgICAgICBpZiAoIShjYWNoZVtrZXldICYmIGNhY2hlLmhhc093blByb3BlcnR5KGtleSkpKSB7XG4gICAgICAgICAgICBjYWNoZVtrZXldID0gc3ByaW50Zi5wYXJzZShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcHJpbnRmLmZvcm1hdC5jYWxsKG51bGwsIGNhY2hlW2tleV0sIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgc3ByaW50Zi5mb3JtYXQgPSBmdW5jdGlvbiAocGFyc2VfdHJlZSwgYXJndikge1xuICAgICAgICB2YXIgY3Vyc29yID0gMSxcbiAgICAgICAgICAgIHRyZWVfbGVuZ3RoID0gcGFyc2VfdHJlZS5sZW5ndGgsXG4gICAgICAgICAgICBub2RlX3R5cGUgPSBcIlwiLFxuICAgICAgICAgICAgYXJnLFxuICAgICAgICAgICAgb3V0cHV0ID0gW10sXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgayxcbiAgICAgICAgICAgIG1hdGNoLFxuICAgICAgICAgICAgcGFkLFxuICAgICAgICAgICAgcGFkX2NoYXJhY3RlcixcbiAgICAgICAgICAgIHBhZF9sZW5ndGgsXG4gICAgICAgICAgICBpc19wb3NpdGl2ZSA9IHRydWUsXG4gICAgICAgICAgICBzaWduID0gXCJcIjtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRyZWVfbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG5vZGVfdHlwZSA9IGdldF90eXBlKHBhcnNlX3RyZWVbaV0pO1xuICAgICAgICAgICAgaWYgKG5vZGVfdHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIG91dHB1dFtvdXRwdXQubGVuZ3RoXSA9IHBhcnNlX3RyZWVbaV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGVfdHlwZSA9PT0gXCJhcnJheVwiKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBwYXJzZV90cmVlW2ldOyAvLyBjb252ZW5pZW5jZSBwdXJwb3NlcyBvbmx5XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGtleXdvcmQgYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3JdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbWF0Y2hbMl0ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYXJnLmhhc093blByb3BlcnR5KG1hdGNoWzJdW2tdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzcHJpbnRmKFwiW3NwcmludGZdIHByb3BlcnR5ICclcycgZG9lcyBub3QgZXhpc3RcIiwgbWF0Y2hbMl1ba10pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ1ttYXRjaFsyXVtrXV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGV4cGxpY2l0KVxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W21hdGNoWzFdXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChpbXBsaWNpdClcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3IrK107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGdldF90eXBlKGFyZykgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZS5ub3Rfc3RyaW5nLnRlc3QobWF0Y2hbOF0pICYmIHJlLm5vdF9qc29uLnRlc3QobWF0Y2hbOF0pICYmIGdldF90eXBlKGFyZykgIT0gXCJudW1iZXJcIiAmJiBpc05hTihhcmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3Ioc3ByaW50ZihcIltzcHJpbnRmXSBleHBlY3RpbmcgbnVtYmVyIGJ1dCBmb3VuZCAlc1wiLCBnZXRfdHlwZShhcmcpKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlLm51bWJlci50ZXN0KG1hdGNoWzhdKSkge1xuICAgICAgICAgICAgICAgICAgICBpc19wb3NpdGl2ZSA9IGFyZyA+PSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN3aXRjaCAobWF0Y2hbOF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImJcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gU3RyaW5nLmZyb21DaGFyQ29kZShhcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJkXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwYXJzZUludChhcmcsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwialwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gSlNPTi5zdHJpbmdpZnkoYXJnLCBudWxsLCBtYXRjaFs2XSA/IHBhcnNlSW50KG1hdGNoWzZdKSA6IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBtYXRjaFs3XSA/IGFyZy50b0V4cG9uZW50aWFsKG1hdGNoWzddKSA6IGFyZy50b0V4cG9uZW50aWFsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImZcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IG1hdGNoWzddID8gcGFyc2VGbG9hdChhcmcpLnRvRml4ZWQobWF0Y2hbN10pIDogcGFyc2VGbG9hdChhcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJnXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBtYXRjaFs3XSA/IHBhcnNlRmxvYXQoYXJnKS50b1ByZWNpc2lvbihtYXRjaFs3XSkgOiBwYXJzZUZsb2F0KGFyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm9cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZyg4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKGFyZyA9IFN0cmluZyhhcmcpKSAmJiBtYXRjaFs3XSA/IGFyZy5zdWJzdHJpbmcoMCwgbWF0Y2hbN10pIDogYXJnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ1XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcgPj4+IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInhcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygxNik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlhcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmUuanNvbi50ZXN0KG1hdGNoWzhdKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRbb3V0cHV0Lmxlbmd0aF0gPSBhcmc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlLm51bWJlci50ZXN0KG1hdGNoWzhdKSAmJiAoIWlzX3Bvc2l0aXZlIHx8IG1hdGNoWzNdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9IGlzX3Bvc2l0aXZlID8gXCIrXCIgOiBcIi1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygpLnJlcGxhY2UocmUuc2lnbiwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYWRfY2hhcmFjdGVyID0gbWF0Y2hbNF0gPyBtYXRjaFs0XSA9PT0gXCIwXCIgPyBcIjBcIiA6IG1hdGNoWzRdLmNoYXJBdCgxKSA6IFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICBwYWRfbGVuZ3RoID0gbWF0Y2hbNl0gLSAoc2lnbiArIGFyZykubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBwYWQgPSBtYXRjaFs2XSA/IHBhZF9sZW5ndGggPiAwID8gc3RyX3JlcGVhdChwYWRfY2hhcmFjdGVyLCBwYWRfbGVuZ3RoKSA6IFwiXCIgOiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRbb3V0cHV0Lmxlbmd0aF0gPSBtYXRjaFs1XSA/IHNpZ24gKyBhcmcgKyBwYWQgOiBwYWRfY2hhcmFjdGVyID09PSBcIjBcIiA/IHNpZ24gKyBwYWQgKyBhcmcgOiBwYWQgKyBzaWduICsgYXJnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0LmpvaW4oXCJcIik7XG4gICAgfTtcblxuICAgIHNwcmludGYuY2FjaGUgPSB7fTtcblxuICAgIHNwcmludGYucGFyc2UgPSBmdW5jdGlvbiAoZm10KSB7XG4gICAgICAgIHZhciBfZm10ID0gZm10LFxuICAgICAgICAgICAgbWF0Y2ggPSBbXSxcbiAgICAgICAgICAgIHBhcnNlX3RyZWUgPSBbXSxcbiAgICAgICAgICAgIGFyZ19uYW1lcyA9IDA7XG4gICAgICAgIHdoaWxlIChfZm10KSB7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gcmUudGV4dC5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWVbcGFyc2VfdHJlZS5sZW5ndGhdID0gbWF0Y2hbMF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKChtYXRjaCA9IHJlLm1vZHVsby5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWVbcGFyc2VfdHJlZS5sZW5ndGhdID0gXCIlXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKChtYXRjaCA9IHJlLnBsYWNlaG9sZGVyLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAxO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGRfbGlzdCA9IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGFjZW1lbnRfZmllbGQgPSBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX21hdGNoID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSByZS5rZXkuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0W2ZpZWxkX2xpc3QubGVuZ3RoXSA9IGZpZWxkX21hdGNoWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChyZXBsYWNlbWVudF9maWVsZCA9IHJlcGxhY2VtZW50X2ZpZWxkLnN1YnN0cmluZyhmaWVsZF9tYXRjaFswXS5sZW5ndGgpKSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSByZS5rZXlfYWNjZXNzLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0W2ZpZWxkX2xpc3QubGVuZ3RoXSA9IGZpZWxkX21hdGNoWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKGZpZWxkX21hdGNoID0gcmUuaW5kZXhfYWNjZXNzLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0W2ZpZWxkX2xpc3QubGVuZ3RoXSA9IGZpZWxkX21hdGNoWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIltzcHJpbnRmXSBmYWlsZWQgdG8gcGFyc2UgbmFtZWQgYXJndW1lbnQga2V5XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIltzcHJpbnRmXSBmYWlsZWQgdG8gcGFyc2UgbmFtZWQgYXJndW1lbnQga2V5XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoWzJdID0gZmllbGRfbGlzdDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcmdfbmFtZXMgfD0gMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFyZ19uYW1lcyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJbc3ByaW50Zl0gbWl4aW5nIHBvc2l0aW9uYWwgYW5kIG5hbWVkIHBsYWNlaG9sZGVycyBpcyBub3QgKHlldCkgc3VwcG9ydGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlW3BhcnNlX3RyZWUubGVuZ3RoXSA9IG1hdGNoO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJbc3ByaW50Zl0gdW5leHBlY3RlZCBwbGFjZWhvbGRlclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9mbXQgPSBfZm10LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJzZV90cmVlO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiB2c3ByaW50ZihmbXQsIGFyZ3YsIF9hcmd2KSB7XG4gICAgICAgIF9hcmd2ID0gKGFyZ3YgfHwgW10pLnNsaWNlKDApO1xuICAgICAgICBfYXJndi5zcGxpY2UoMCwgMCwgZm10KTtcbiAgICAgICAgcmV0dXJuIHNwcmludGYuYXBwbHkobnVsbCwgX2FyZ3YpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGhlbHBlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRfdHlwZSh2YXJpYWJsZSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdHJfcmVwZWF0KGlucHV0LCBtdWx0aXBsaWVyKSB7XG4gICAgICAgIHJldHVybiBBcnJheShtdWx0aXBsaWVyICsgMSkuam9pbihpbnB1dCk7XG4gICAgfVxuXG4gICAgdmFyIGluZGV4ID0ge1xuICAgICAgbmFtZTogJ3NwcmludGYnLFxuICAgICAgdHlwZTogJ3Bvc3RQcm9jZXNzb3InLFxuXG4gICAgICBwcm9jZXNzOiBmdW5jdGlvbiBwcm9jZXNzKHZhbHVlLCBrZXksIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zLnNwcmludGYpIHJldHVybiB2YWx1ZTtcblxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseShvcHRpb25zLnNwcmludGYpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgcmV0dXJuIHZzcHJpbnRmKHZhbHVlLCBvcHRpb25zLnNwcmludGYpO1xuICAgICAgICB9IGVsc2UgaWYgKGJhYmVsSGVscGVycy50eXBlb2Yob3B0aW9ucy5zcHJpbnRmKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICByZXR1cm4gc3ByaW50Zih2YWx1ZSwgb3B0aW9ucy5zcHJpbnRmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBvdmVybG9hZFRyYW5zbGF0aW9uT3B0aW9uSGFuZGxlcjogZnVuY3Rpb24gb3ZlcmxvYWRUcmFuc2xhdGlvbk9wdGlvbkhhbmRsZXIoYXJncykge1xuICAgICAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFsdWVzLnB1c2goYXJnc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHBvc3RQcm9jZXNzOiAnc3ByaW50ZicsXG4gICAgICAgICAgc3ByaW50ZjogdmFsdWVzXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBpbmRleDtcblxufSkpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZXh0ZXJuYWwvaTE4bmV4dC9zY3JpcHRzL2kxOG5leHRTcHJpbnRmUG9zdFByb2Nlc3Nvci5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwuaTE4bmV4dEJyb3dzZXJMYW5ndWFnZURldGVjdG9yID0gZmFjdG9yeSgpKTtcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGJhYmVsSGVscGVycyA9IHt9O1xuXG4gIGJhYmVsSGVscGVycy5jbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgICB9XG4gIH07XG5cbiAgYmFiZWxIZWxwZXJzLmNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gICAgfTtcbiAgfSgpO1xuXG4gIGJhYmVsSGVscGVycztcblxuICB2YXIgYXJyID0gW107XG4gIHZhciBlYWNoID0gYXJyLmZvckVhY2g7XG4gIHZhciBzbGljZSA9IGFyci5zbGljZTtcblxuICBmdW5jdGlvbiBkZWZhdWx0cyhvYmopIHtcbiAgICBlYWNoLmNhbGwoc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICBpZiAoc291cmNlKSB7XG4gICAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PT0gdW5kZWZpbmVkKSBvYmpbcHJvcF0gPSBzb3VyY2VbcHJvcF07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIGNvb2tpZSA9IHtcbiAgICBjcmVhdGU6IGZ1bmN0aW9uIGNyZWF0ZShuYW1lLCB2YWx1ZSwgbWludXRlcywgZG9tYWluKSB7XG4gICAgICB2YXIgZXhwaXJlcyA9IHZvaWQgMDtcbiAgICAgIGlmIChtaW51dGVzKSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoKTtcbiAgICAgICAgZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgbWludXRlcyAqIDYwICogMTAwMCk7XG4gICAgICAgIGV4cGlyZXMgPSAnOyBleHBpcmVzPScgKyBkYXRlLnRvR01UU3RyaW5nKCk7XG4gICAgICB9IGVsc2UgZXhwaXJlcyA9ICcnO1xuICAgICAgZG9tYWluID0gZG9tYWluID8gJ2RvbWFpbj0nICsgZG9tYWluICsgJzsnIDogJyc7XG4gICAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgJz0nICsgdmFsdWUgKyBleHBpcmVzICsgJzsnICsgZG9tYWluICsgJ3BhdGg9Lyc7XG4gICAgfSxcblxuICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQobmFtZSkge1xuICAgICAgdmFyIG5hbWVFUSA9IG5hbWUgKyAnPSc7XG4gICAgICB2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGMgPSBjYVtpXTtcbiAgICAgICAgd2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIHtcbiAgICAgICAgICBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xuICAgICAgICB9aWYgKGMuaW5kZXhPZihuYW1lRVEpID09PSAwKSByZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSxcblxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKG5hbWUpIHtcbiAgICAgIHRoaXMuY3JlYXRlKG5hbWUsICcnLCAtMSk7XG4gICAgfVxuICB9O1xuXG4gIHZhciBjb29raWUkMSA9IHtcbiAgICBuYW1lOiAnY29va2llJyxcblxuICAgIGxvb2t1cDogZnVuY3Rpb24gbG9va3VwKG9wdGlvbnMpIHtcbiAgICAgIHZhciBmb3VuZCA9IHZvaWQgMDtcblxuICAgICAgaWYgKG9wdGlvbnMubG9va3VwQ29va2llICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFyIGMgPSBjb29raWUucmVhZChvcHRpb25zLmxvb2t1cENvb2tpZSk7XG4gICAgICAgIGlmIChjKSBmb3VuZCA9IGM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmb3VuZDtcbiAgICB9LFxuICAgIGNhY2hlVXNlckxhbmd1YWdlOiBmdW5jdGlvbiBjYWNoZVVzZXJMYW5ndWFnZShsbmcsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLmxvb2t1cENvb2tpZSAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvb2tpZS5jcmVhdGUob3B0aW9ucy5sb29rdXBDb29raWUsIGxuZywgb3B0aW9ucy5jb29raWVNaW51dGVzLCBvcHRpb25zLmNvb2tpZURvbWFpbik7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHZhciBxdWVyeXN0cmluZyA9IHtcbiAgICBuYW1lOiAncXVlcnlzdHJpbmcnLFxuXG4gICAgbG9va3VwOiBmdW5jdGlvbiBsb29rdXAob3B0aW9ucykge1xuICAgICAgdmFyIGZvdW5kID0gdm9pZCAwO1xuXG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7XG4gICAgICAgIHZhciBwYXJhbXMgPSBxdWVyeS5zcGxpdCgnJicpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcmFtcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBwb3MgPSBwYXJhbXNbaV0uaW5kZXhPZignPScpO1xuICAgICAgICAgIGlmIChwb3MgPiAwKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gcGFyYW1zW2ldLnN1YnN0cmluZygwLCBwb3MpO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gb3B0aW9ucy5sb29rdXBRdWVyeXN0cmluZykge1xuICAgICAgICAgICAgICBmb3VuZCA9IHBhcmFtc1tpXS5zdWJzdHJpbmcocG9zICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmb3VuZDtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGhhc0xvY2FsU3RvcmFnZVN1cHBvcnQgPSB2b2lkIDA7XG4gIHRyeSB7XG4gICAgaGFzTG9jYWxTdG9yYWdlU3VwcG9ydCA9IHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmxvY2FsU3RvcmFnZSAhPT0gbnVsbDtcbiAgICB2YXIgdGVzdEtleSA9ICdpMThuZXh0LnRyYW5zbGF0ZS5ib28nO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbSh0ZXN0S2V5LCAnZm9vJyk7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRlc3RLZXkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaGFzTG9jYWxTdG9yYWdlU3VwcG9ydCA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIGxvY2FsU3RvcmFnZSA9IHtcbiAgICBuYW1lOiAnbG9jYWxTdG9yYWdlJyxcblxuICAgIGxvb2t1cDogZnVuY3Rpb24gbG9va3VwKG9wdGlvbnMpIHtcbiAgICAgIHZhciBmb3VuZCA9IHZvaWQgMDtcblxuICAgICAgaWYgKG9wdGlvbnMubG9va3VwTG9jYWxTdG9yYWdlICYmIGhhc0xvY2FsU3RvcmFnZVN1cHBvcnQpIHtcbiAgICAgICAgdmFyIGxuZyA9IHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShvcHRpb25zLmxvb2t1cExvY2FsU3RvcmFnZSk7XG4gICAgICAgIGlmIChsbmcpIGZvdW5kID0gbG5nO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm91bmQ7XG4gICAgfSxcbiAgICBjYWNoZVVzZXJMYW5ndWFnZTogZnVuY3Rpb24gY2FjaGVVc2VyTGFuZ3VhZ2UobG5nLCBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy5sb29rdXBMb2NhbFN0b3JhZ2UgJiYgaGFzTG9jYWxTdG9yYWdlU3VwcG9ydCkge1xuICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0ob3B0aW9ucy5sb29rdXBMb2NhbFN0b3JhZ2UsIGxuZyk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHZhciBuYXZpZ2F0b3IkMSA9IHtcbiAgICBuYW1lOiAnbmF2aWdhdG9yJyxcblxuICAgIGxvb2t1cDogZnVuY3Rpb24gbG9va3VwKG9wdGlvbnMpIHtcbiAgICAgIHZhciBmb3VuZCA9IFtdO1xuXG4gICAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgaWYgKG5hdmlnYXRvci5sYW5ndWFnZXMpIHtcbiAgICAgICAgICAvLyBjaHJvbWUgb25seTsgbm90IGFuIGFycmF5LCBzbyBjYW4ndCB1c2UgLnB1c2guYXBwbHkgaW5zdGVhZCBvZiBpdGVyYXRpbmdcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hdmlnYXRvci5sYW5ndWFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGZvdW5kLnB1c2gobmF2aWdhdG9yLmxhbmd1YWdlc1tpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChuYXZpZ2F0b3IudXNlckxhbmd1YWdlKSB7XG4gICAgICAgICAgZm91bmQucHVzaChuYXZpZ2F0b3IudXNlckxhbmd1YWdlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobmF2aWdhdG9yLmxhbmd1YWdlKSB7XG4gICAgICAgICAgZm91bmQucHVzaChuYXZpZ2F0b3IubGFuZ3VhZ2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmb3VuZC5sZW5ndGggPiAwID8gZm91bmQgOiB1bmRlZmluZWQ7XG4gICAgfVxuICB9O1xuXG4gIHZhciBodG1sVGFnID0ge1xuICAgIG5hbWU6ICdodG1sVGFnJyxcblxuICAgIGxvb2t1cDogZnVuY3Rpb24gbG9va3VwKG9wdGlvbnMpIHtcbiAgICAgIHZhciBmb3VuZCA9IHZvaWQgMDtcbiAgICAgIHZhciBodG1sVGFnID0gb3B0aW9ucy5odG1sVGFnIHx8ICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnID8gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IDogbnVsbCk7XG5cbiAgICAgIGlmIChodG1sVGFnICYmIHR5cGVvZiBodG1sVGFnLmdldEF0dHJpYnV0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBmb3VuZCA9IGh0bWxUYWcuZ2V0QXR0cmlidXRlKCdsYW5nJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmb3VuZDtcbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2V0RGVmYXVsdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9yZGVyOiBbJ3F1ZXJ5c3RyaW5nJywgJ2Nvb2tpZScsICdsb2NhbFN0b3JhZ2UnLCAnbmF2aWdhdG9yJywgJ2h0bWxUYWcnXSxcbiAgICAgIGxvb2t1cFF1ZXJ5c3RyaW5nOiAnbG5nJyxcbiAgICAgIGxvb2t1cENvb2tpZTogJ2kxOG5leHQnLFxuICAgICAgbG9va3VwTG9jYWxTdG9yYWdlOiAnaTE4bmV4dExuZycsXG5cbiAgICAgIC8vIGNhY2hlIHVzZXIgbGFuZ3VhZ2VcbiAgICAgIGNhY2hlczogWydsb2NhbFN0b3JhZ2UnXSxcbiAgICAgIGV4Y2x1ZGVDYWNoZUZvcjogWydjaW1vZGUnXVxuICAgICAgLy9jb29raWVNaW51dGVzOiAxMCxcbiAgICAgIC8vY29va2llRG9tYWluOiAnbXlEb21haW4nXG4gICAgfTtcbiAgfVxuXG4gIHZhciBCcm93c2VyID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEJyb3dzZXIoc2VydmljZXMpIHtcbiAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG4gICAgICBiYWJlbEhlbHBlcnMuY2xhc3NDYWxsQ2hlY2sodGhpcywgQnJvd3Nlcik7XG5cbiAgICAgIHRoaXMudHlwZSA9ICdsYW5ndWFnZURldGVjdG9yJztcbiAgICAgIHRoaXMuZGV0ZWN0b3JzID0ge307XG5cbiAgICAgIHRoaXMuaW5pdChzZXJ2aWNlcywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgYmFiZWxIZWxwZXJzLmNyZWF0ZUNsYXNzKEJyb3dzZXIsIFt7XG4gICAgICBrZXk6ICdpbml0JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KHNlcnZpY2VzKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMV07XG4gICAgICAgIHZhciBpMThuT3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMiB8fCBhcmd1bWVudHNbMl0gPT09IHVuZGVmaW5lZCA/IHt9IDogYXJndW1lbnRzWzJdO1xuXG4gICAgICAgIHRoaXMuc2VydmljZXMgPSBzZXJ2aWNlcztcbiAgICAgICAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHMob3B0aW9ucywgdGhpcy5vcHRpb25zIHx8IHt9LCBnZXREZWZhdWx0cygpKTtcbiAgICAgICAgdGhpcy5pMThuT3B0aW9ucyA9IGkxOG5PcHRpb25zO1xuXG4gICAgICAgIHRoaXMuYWRkRGV0ZWN0b3IoY29va2llJDEpO1xuICAgICAgICB0aGlzLmFkZERldGVjdG9yKHF1ZXJ5c3RyaW5nKTtcbiAgICAgICAgdGhpcy5hZGREZXRlY3Rvcihsb2NhbFN0b3JhZ2UpO1xuICAgICAgICB0aGlzLmFkZERldGVjdG9yKG5hdmlnYXRvciQxKTtcbiAgICAgICAgdGhpcy5hZGREZXRlY3RvcihodG1sVGFnKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdhZGREZXRlY3RvcicsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gYWRkRGV0ZWN0b3IoZGV0ZWN0b3IpIHtcbiAgICAgICAgdGhpcy5kZXRlY3RvcnNbZGV0ZWN0b3IubmFtZV0gPSBkZXRlY3RvcjtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdkZXRlY3QnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGRldGVjdChkZXRlY3Rpb25PcmRlcikge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGlmICghZGV0ZWN0aW9uT3JkZXIpIGRldGVjdGlvbk9yZGVyID0gdGhpcy5vcHRpb25zLm9yZGVyO1xuXG4gICAgICAgIHZhciBkZXRlY3RlZCA9IFtdO1xuICAgICAgICBkZXRlY3Rpb25PcmRlci5mb3JFYWNoKGZ1bmN0aW9uIChkZXRlY3Rvck5hbWUpIHtcbiAgICAgICAgICBpZiAoX3RoaXMuZGV0ZWN0b3JzW2RldGVjdG9yTmFtZV0pIHtcbiAgICAgICAgICAgIHZhciBsb29rdXAgPSBfdGhpcy5kZXRlY3RvcnNbZGV0ZWN0b3JOYW1lXS5sb29rdXAoX3RoaXMub3B0aW9ucyk7XG4gICAgICAgICAgICBpZiAobG9va3VwICYmIHR5cGVvZiBsb29rdXAgPT09ICdzdHJpbmcnKSBsb29rdXAgPSBbbG9va3VwXTtcbiAgICAgICAgICAgIGlmIChsb29rdXApIGRldGVjdGVkID0gZGV0ZWN0ZWQuY29uY2F0KGxvb2t1cCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgZm91bmQgPSB2b2lkIDA7XG4gICAgICAgIGRldGVjdGVkLmZvckVhY2goZnVuY3Rpb24gKGxuZykge1xuICAgICAgICAgIGlmIChmb3VuZCkgcmV0dXJuO1xuICAgICAgICAgIHZhciBjbGVhbmVkTG5nID0gX3RoaXMuc2VydmljZXMubGFuZ3VhZ2VVdGlscy5mb3JtYXRMYW5ndWFnZUNvZGUobG5nKTtcbiAgICAgICAgICBpZiAoX3RoaXMuc2VydmljZXMubGFuZ3VhZ2VVdGlscy5pc1doaXRlbGlzdGVkKGNsZWFuZWRMbmcpKSBmb3VuZCA9IGNsZWFuZWRMbmc7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmb3VuZCB8fCB0aGlzLmkxOG5PcHRpb25zLmZhbGxiYWNrTG5nWzBdO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2NhY2hlVXNlckxhbmd1YWdlJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBjYWNoZVVzZXJMYW5ndWFnZShsbmcsIGNhY2hlcykge1xuICAgICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgICBpZiAoIWNhY2hlcykgY2FjaGVzID0gdGhpcy5vcHRpb25zLmNhY2hlcztcbiAgICAgICAgaWYgKCFjYWNoZXMpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5leGNsdWRlQ2FjaGVGb3IgJiYgdGhpcy5vcHRpb25zLmV4Y2x1ZGVDYWNoZUZvci5pbmRleE9mKGxuZykgPiAtMSkgcmV0dXJuO1xuICAgICAgICBjYWNoZXMuZm9yRWFjaChmdW5jdGlvbiAoY2FjaGVOYW1lKSB7XG4gICAgICAgICAgaWYgKF90aGlzMi5kZXRlY3RvcnNbY2FjaGVOYW1lXSkgX3RoaXMyLmRldGVjdG9yc1tjYWNoZU5hbWVdLmNhY2hlVXNlckxhbmd1YWdlKGxuZywgX3RoaXMyLm9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XSk7XG4gICAgcmV0dXJuIEJyb3dzZXI7XG4gIH0oKTtcblxuICBCcm93c2VyLnR5cGUgPSAnbGFuZ3VhZ2VEZXRlY3Rvcic7XG5cbiAgcmV0dXJuIEJyb3dzZXI7XG5cbn0pKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2V4dGVybmFsL2kxOG5leHQvc2NyaXB0cy9pMThuZXh0QnJvd3Nlckxhbmd1YWdlRGV0ZWN0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl19