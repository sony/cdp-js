/*!
 * cdp.i18n.js 2.0.0
 *
 * Date: 2017-08-02T07:12:55.658Z
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
            url: CDP.toUrl(path),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBiMjI2ZTI1Y2M5MzlmZGZmNmU2YSIsImNkcDovLy9DRFAvaTE4bi50cyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvIHtcInJvb3RcIjpcImpRdWVyeVwiLFwiY29tbW9uanNcIjpcImpxdWVyeVwiLFwiY29tbW9uanMyXCI6XCJqcXVlcnlcIixcImFtZFwiOlwianF1ZXJ5XCJ9Iiwid2VicGFjazovLy9leHRlcm5hbC8ge1wicm9vdFwiOlwiQ0RQXCIsXCJjb21tb25qc1wiOlwiY2RwLmNvcmVcIixcImNvbW1vbmpzMlwiOlwiY2RwLmNvcmVcIixcImFtZFwiOlwiY2RwLmNvcmVcIn0iLCJ3ZWJwYWNrOi8vL2V4dGVybmFsLyB7XCJyb290XCI6XCJDRFBcIixcImNvbW1vbmpzXCI6XCJjZHAucHJvbWlzZVwiLFwiY29tbW9uanMyXCI6XCJjZHAucHJvbWlzZVwiLFwiYW1kXCI6XCJjZHAucHJvbWlzZVwifSIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvaTE4bmV4dC9zY3JpcHRzL2pxdWVyeS1pMThuZXh0LmpzIiwid2VicGFjazovLy9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvaTE4bmV4dC5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwvaTE4bmV4dC9zY3JpcHRzL2kxOG5leHRYSFJCYWNrZW5kLmpzIiwid2VicGFjazovLy9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvaTE4bmV4dExvY2FsU3RvcmFnZUNhY2hlLmpzIiwid2VicGFjazovLy9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvaTE4bmV4dFNwcmludGZQb3N0UHJvY2Vzc29yLmpzIiwid2VicGFjazovLy9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvaTE4bmV4dEJyb3dzZXJMYW5ndWFnZURldGVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztB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O0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLGFBQWEsdUlBQXVJLEdBQUcsbWJBQW1iLEdBQUcsZ0tBQWdLLEdBQUcseUVBQXlFLEdBQUcsaURBQWlELEdBQUcsMkNBQTJDLEdBQUcsNENBQTRDLEdBQUcsd0NBQXdDLEdBQUcsa0NBQWtDLEdBQUcsNkNBQTZDLEdBQUcsMENBQTBDLEdBQUcsbUNBQW1DLEdBQUcsbUNBQW1DLEdBQUcseUNBQXlDLEdBQUcsdUNBQXVDLEdBQUcsc0NBQXNDLEdBQUcsbUNBQW1DLEdBQUcsdUNBQXVDLEdBQUcsMkNBQTJDLEdBQUcsa0NBQWtDLEdBQUcsdUNBQXVDLEdBQUcseUNBQXlDOztBQUUzakQ7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsK0NBQStDOztBQUUvQztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0Es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QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsbUNBQW1DLDBCQUEwQixnQkFBZ0I7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQSxL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QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0RUFBNEU7QUFDNUU7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDhFQUE4RTtBQUM5RSxrRkFBa0Y7O0FBRWxGO0FBQ0EsMkRBQTJEO0FBQzNEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLO0FBQ0w7QUFDQSxHQUFHOztBQUVIOztBQUVBOztBQUVBLENBQUMsRyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcImpxdWVyeVwiKSwgcmVxdWlyZShcImNkcC5jb3JlXCIpLCByZXF1aXJlKFwiY2RwLnByb21pc2VcIikpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW1wianF1ZXJ5XCIsIFwiY2RwLmNvcmVcIiwgXCJjZHAucHJvbWlzZVwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJDRFBcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJqcXVlcnlcIiksIHJlcXVpcmUoXCJjZHAuY29yZVwiKSwgcmVxdWlyZShcImNkcC5wcm9taXNlXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJDRFBcIl0gPSBmYWN0b3J5KHJvb3RbXCJqUXVlcnlcIl0sIHJvb3RbXCJDRFBcIl0sIHJvb3RbXCJDRFBcIl0pO1xufSkodGhpcywgZnVuY3Rpb24oX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMl9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzNfXykge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiMjI2ZTI1Y2M5MzlmZGZmNmU2YSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9AdHlwZXMvaTE4bmV4dC5kLnRzXCIgLz5cclxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcbm5hbWVzcGFjZSBDRFAge1xyXG5cclxuICAgIGltcG9ydCBQcm9taXNlID0gQ0RQLlByb21pc2U7XHJcbiAgICBpbXBvcnQgSTE4bmV4dCA9IGkxOG5leHQuaTE4bjtcclxuXHJcbiAgICBleHBvcnQgbmFtZXNwYWNlIEkxOE4ge1xyXG4gICAgICAgIGV4cG9ydCB0eXBlIEkxOG4gPSBJMThuZXh0LmkxOG47XHJcbiAgICAgICAgZXhwb3J0IHR5cGUgT3B0aW9ucyA9IEkxOG5leHQuSW5pdE9wdGlvbnMgJiB7IFtrZXlzOiBzdHJpbmddOiBhbnkgfTtcclxuICAgICAgICBleHBvcnQgdHlwZSBUcmFuc2xhdGlvbk9wdGlvbnMgPSBJMThuZXh0LlRyYW5zbGF0aW9uT3B0aW9ucztcclxuICAgICAgICBleHBvcnQgdHlwZSBUcmFuc2xhdGlvbkZ1bmN0aW9uID0gSTE4bmV4dC5UcmFuc2xhdGlvbkZ1bmN0aW9uO1xyXG4gICAgICAgIGV4cG9ydCB0eXBlIEludGVycG9sYXRpb25PcHRpb25zID0gSTE4bmV4dC5JbnRlcnBvbGF0aW9uT3B0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBUQUcgPSBcIltDRFAuaTE4bl0gXCI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBpMThuZXh0IOOBuOOBruODgOOCpOODrOOCr+ODiOOCouOCr+OCu+OCuVxyXG4gICAgICovXHJcbiAgICBleHBvcnQgbGV0IGkxOG46IEkxOE4uSTE4bjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBpbnRlcmZhY2UgSTE4TlNldHRpbmdzXHJcbiAgICAgKiBAYnJpZWYg44Ot44O844Kr44Op44Kk44K66Kit5a6a55So44Kq44OX44K344On44OzXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSTE4TlNldHRpbmdzIHtcclxuICAgICAgICBmYWxsYmFja1Jlc291cmNlcz86IHsgW2xuZzogc3RyaW5nXTogeyBbbnM6IHN0cmluZ106IHN0cmluZyB9IH07XHJcbiAgICAgICAgcHJlbG9hZD86IHN0cmluZ1tdO1xyXG4gICAgICAgIG9wdGlvbnM/OiBJMThOLk9wdGlvbnM7XHJcbiAgICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogXFx+ZW5nbGlzaFxyXG4gICAgICogaW5pdGlhbGl6ZSBpMThuZXh0LlxyXG4gICAgICpcclxuICAgICAqIFxcfmphcGFuZXNlXHJcbiAgICAgKiBpMThuZXh0IOOBruWIneacn+WMllxyXG4gICAgICpcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcmV0dXJucyBJUHJvbWlzZUJhc2Ug44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplSTE4TihzZXR0aW5ncz86IEkxOE5TZXR0aW5ncyk6IElQcm9taXNlQmFzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaTE4blNldHRpbmdzOiBJMThOU2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGkxOG5PcHRpb25zOiBJMThOLk9wdGlvbnMgPSAoKHJlc291cmNlczogeyBbbG5nOiBzdHJpbmddOiB7IFtuczogc3RyaW5nXTogc3RyaW5nIH0gfSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc291cmNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbG5nIGluIHJlc291cmNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VzLmhhc093blByb3BlcnR5KGxuZykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbnMgaW4gcmVzb3VyY2VzW2xuZ10pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VzW2xuZ10uaGFzT3duUHJvcGVydHkobnMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc291cmNlc1tsbmddW25zXSA9IGdldExvY2FsZUZhbGxiYWNrUmVzb3VyY2UocmVzb3VyY2VzW2xuZ11bbnNdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaTE4blNldHRpbmdzLm9wdGlvbnMucmVzb3VyY2VzID0gPGFueT5yZXNvdXJjZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGkxOG5TZXR0aW5ncy5vcHRpb25zO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTE4blNldHRpbmdzLm9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pKGkxOG5TZXR0aW5ncy5mYWxsYmFja1Jlc291cmNlcyk7XHJcblxyXG4gICAgICAgICAgICByZXF1aXJlKFtcImpxdWVyeUkxOG5leHRcIl0sICgkMThOZXh0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmUoW1xyXG4gICAgICAgICAgICAgICAgICAgIFwiaTE4bmV4dFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaTE4bmV4dFhIUkJhY2tlbmRcIixcclxuICAgICAgICAgICAgICAgICAgICBcImkxOG5leHRMb2NhbFN0b3JhZ2VDYWNoZVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFwiaTE4bmV4dFNwcmludGZQb3N0UHJvY2Vzc29yXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJpMThuZXh0QnJvd3Nlckxhbmd1YWdlRGV0ZWN0b3JcIixcclxuICAgICAgICAgICAgICAgIF0sIChpMThuZXh0OiBJMThOLkkxOG5cclxuICAgICAgICAgICAgICAgICAgICAsIEJhY2tlbmQ6IGFueVxyXG4gICAgICAgICAgICAgICAgICAgICwgQ2FjaGU6IGFueVxyXG4gICAgICAgICAgICAgICAgICAgICwgUG9zdFByb2Nlc3NvcjogYW55XHJcbiAgICAgICAgICAgICAgICAgICAgLCBMYW5ndWFnZURldGVjdG9yOiBhbnlcclxuICAgICAgICAgICAgICAgICkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpMThuZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXNlKEJhY2tlbmQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXNlKENhY2hlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVzZShQb3N0UHJvY2Vzc29yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnVzZShMYW5ndWFnZURldGVjdG9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluaXQoaTE4bk9wdGlvbnMsIChlcnJvcjogYW55LCB0OiBJMThOLlRyYW5zbGF0aW9uRnVuY3Rpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkMThOZXh0LmluaXQoaTE4bmV4dCwgJCwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0TmFtZTogXCJ0XCIsICAgICAgICAgICAgICAgICAgICAgICAgIC8vIC0tPiBhcHBlbmRzICQudCA9IGkxOG5leHQudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpMThuTmFtZTogXCJpMThuXCIsICAgICAgICAgICAgICAgICAgIC8vIC0tPiBhcHBlbmRzICQuaTE4biA9IGkxOG5leHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTmFtZTogXCJsb2NhbGl6ZVwiLCAgICAgICAgICAgICAvLyAtLT4gYXBwZW5kcyAkKHNlbGVjdG9yKS5sb2NhbGl6ZShvcHRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JBdHRyOiBcImRhdGEtaTE4blwiLCAgICAgICAgICAvLyBzZWxlY3RvciBmb3IgdHJhbnNsYXRpbmcgZWxlbWVudHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QXR0cjogXCJpMThuLXRhcmdldFwiLCAgICAgICAgICAvLyBkYXRhLSgpIGF0dHJpYnV0ZSB0byBncmFiIHRhcmdldCBlbGVtZW50IHRvIHRyYW5zbGF0ZSAoaWYgZGlmZnJlbnQgdGhlbiBpdHNlbGYpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnNBdHRyOiBcImkxOG4tb3B0aW9uc1wiLCAgICAgICAgLy8gZGF0YS0oKSBhdHRyaWJ1dGUgdGhhdCBjb250YWlucyBvcHRpb25zLCB3aWxsIGxvYWQvc2V0IGlmIHVzZU9wdGlvbnNBdHRyID0gdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VPcHRpb25zQXR0cjogZmFsc2UsICAgICAgICAgICAgICAvLyBubyB1c2Ugb3B0aW9uc0F0dHJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VEZWZhdWx0VmFsdWVGcm9tQ29udGVudDogdHJ1ZSAgLy8gcGFyc2VzIGRlZmF1bHQgdmFsdWVzIGZyb20gY29udGVudCBlbGUudmFsIG9yIGVsZS50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaTE4bmV4dCAzLjQuMTogcmVzb3VyY2VzIOOBjOaMh+WumuOBleOCjOOCi+OBqCBwcmVsb2FkIOOBjOiqreOBv+i+vOOBvuOCjOOBquOBhOOBn+OCgeOAgeWGjeiqreOBv+i+vOOBv+WHpueQhuOCkuihjOOBhi5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaTE4bmV4dC5vcHRpb25zLnJlc291cmNlcyAmJiBpMThuZXh0Lm9wdGlvbnMucHJlbG9hZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvcHRpb25zIOOBi+OCieODl+ODreODkeODhuOCo+OCkuS4gOaXpuWJiumZpC5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX3ByZWxvYWQgICA9IGkxOG5leHQub3B0aW9ucy5wcmVsb2FkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfcmVzb3VyY2VzID0gaTE4bmV4dC5vcHRpb25zLnJlc291cmNlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGkxOG5leHQub3B0aW9ucy5yZXNvdXJjZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBpMThuZXh0Lm9wdGlvbnMucHJlbG9hZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaTE4bmV4dC5sb2FkTGFuZ3VhZ2VzKF9wcmVsb2FkLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvcHRpb25zIOOCkuWFg+OBq+aIu+OBmVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaTE4bmV4dC5vcHRpb25zLnJlc291cmNlcyA9IF9yZXNvdXJjZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpMThuZXh0Lm9wdGlvbnMucHJlbG9hZCA9IF9wcmVsb2FkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ0RQLmkxOG4gPSBpMThuZXh0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDRFAuaTE4biA9IGkxOG5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBcXH5lbmdsaXNoXHJcbiAgICAgKiBnZXQgc3RyaW5nIHJlc291cmNlIGZvciBmYWxsYmFjay5cclxuICAgICAqXHJcbiAgICAgKiBcXH5qYXBhbmVzZVxyXG4gICAgICogRmFsbGJhY2sg55So44Ot44O844Kr44Op44Kk44K644Oq44K944O844K544Gu5Y+W5b6XXHJcbiAgICAgKlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqIEByZXR1cm5zIGZhbGJha2Mg44Oq44K944O844K544Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldExvY2FsZUZhbGxiYWNrUmVzb3VyY2UocGF0aDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICBsZXQganNvbjogSlNPTjtcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IENEUC50b1VybChwYXRoKSxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGE6IEpTT04pID0+IHtcclxuICAgICAgICAgICAgICAgIGpzb24gPSBkYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogKHhocjogSlF1ZXJ5WEhSLCBzdGF0dXM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihUQUcgKyBcImFqYXggcmVxdWVzdCBmYWlsZWQuIHN0YXR1czogXCIgKyBzdGF0dXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGpzb247XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXHJcbi8vIGpxdWVyeS1pMThuZXh0IGV4dGVuc2lvbnNcclxuXHJcbmludGVyZmFjZSBKUXVlcnlTdGF0aWMge1xyXG4gICAgaTE4bjogQ0RQLkkxOE4uSTE4bjtcclxuICAgIHQ6IChrZXk6IHN0cmluZywgb3B0aW9ucz86IENEUC5JMThOLk9wdGlvbnMpID0+IHN0cmluZztcclxufVxyXG5cclxuaW50ZXJmYWNlIEpRdWVyeSB7XHJcbiAgICBsb2NhbGl6ZTogKG9wdGlvbnM/OiBDRFAuSTE4Ti5UcmFuc2xhdGlvbk9wdGlvbnMpID0+IEpRdWVyeTtcclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8gY2RwLmkxOG4gZGVjbGFyYXRpb25cclxuXHJcbmRlY2xhcmUgbW9kdWxlIFwiY2RwLmkxOG5cIiB7XHJcbiAgICBleHBvcnQgPSBDRFA7XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGNkcDovLy9DRFAvaTE4bi50cyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8xX187XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wicm9vdFwiOlwialF1ZXJ5XCIsXCJjb21tb25qc1wiOlwianF1ZXJ5XCIsXCJjb21tb25qczJcIjpcImpxdWVyeVwiLFwiYW1kXCI6XCJqcXVlcnlcIn1cbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzJfXztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJyb290XCI6XCJDRFBcIixcImNvbW1vbmpzXCI6XCJjZHAuY29yZVwiLFwiY29tbW9uanMyXCI6XCJjZHAuY29yZVwiLFwiYW1kXCI6XCJjZHAuY29yZVwifVxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfM19fO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcInJvb3RcIjpcIkNEUFwiLFwiY29tbW9uanNcIjpcImNkcC5wcm9taXNlXCIsXCJjb21tb25qczJcIjpcImNkcC5wcm9taXNlXCIsXCJhbWRcIjpcImNkcC5wcm9taXNlXCJ9XG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbC5qcXVlcnlJMThuZXh0ID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9O1xuXG52YXIgZGVmYXVsdHMgPSB7XG4gIHROYW1lOiAndCcsXG4gIGkxOG5OYW1lOiAnaTE4bicsXG4gIGhhbmRsZU5hbWU6ICdsb2NhbGl6ZScsXG4gIHNlbGVjdG9yQXR0cjogJ2RhdGEtaTE4bicsXG4gIHRhcmdldEF0dHI6ICdpMThuLXRhcmdldCcsXG4gIG9wdGlvbnNBdHRyOiAnaTE4bi1vcHRpb25zJyxcbiAgdXNlT3B0aW9uc0F0dHI6IGZhbHNlLFxuICBwYXJzZURlZmF1bHRWYWx1ZUZyb21Db250ZW50OiB0cnVlXG59O1xuXG5mdW5jdGlvbiBpbml0KGkxOG5leHQsICQpIHtcbiAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuXG5cbiAgb3B0aW9ucyA9IF9leHRlbmRzKHt9LCBkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgZnVuY3Rpb24gcGFyc2UoZWxlLCBrZXksIG9wdHMpIHtcbiAgICBpZiAoa2V5Lmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXG4gICAgdmFyIGF0dHIgPSAndGV4dCc7XG5cbiAgICBpZiAoa2V5LmluZGV4T2YoJ1snKSA9PT0gMCkge1xuICAgICAgdmFyIHBhcnRzID0ga2V5LnNwbGl0KCddJyk7XG4gICAgICBrZXkgPSBwYXJ0c1sxXTtcbiAgICAgIGF0dHIgPSBwYXJ0c1swXS5zdWJzdHIoMSwgcGFydHNbMF0ubGVuZ3RoIC0gMSk7XG4gICAgfVxuXG4gICAgaWYgKGtleS5pbmRleE9mKCc7JykgPT09IGtleS5sZW5ndGggLSAxKSB7XG4gICAgICBrZXkgPSBrZXkuc3Vic3RyKDAsIGtleS5sZW5ndGggLSAyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBleHRlbmREZWZhdWx0KG8sIHZhbCkge1xuICAgICAgaWYgKCFvcHRpb25zLnBhcnNlRGVmYXVsdFZhbHVlRnJvbUNvbnRlbnQpIHJldHVybiBvO1xuICAgICAgcmV0dXJuIF9leHRlbmRzKHt9LCBvLCB7IGRlZmF1bHRWYWx1ZTogdmFsIH0pO1xuICAgIH1cblxuICAgIGlmIChhdHRyID09PSAnaHRtbCcpIHtcbiAgICAgIGVsZS5odG1sKGkxOG5leHQudChrZXksIGV4dGVuZERlZmF1bHQob3B0cywgZWxlLmh0bWwoKSkpKTtcbiAgICB9IGVsc2UgaWYgKGF0dHIgPT09ICd0ZXh0Jykge1xuICAgICAgZWxlLnRleHQoaTE4bmV4dC50KGtleSwgZXh0ZW5kRGVmYXVsdChvcHRzLCBlbGUudGV4dCgpKSkpO1xuICAgIH0gZWxzZSBpZiAoYXR0ciA9PT0gJ3ByZXBlbmQnKSB7XG4gICAgICBlbGUucHJlcGVuZChpMThuZXh0LnQoa2V5LCBleHRlbmREZWZhdWx0KG9wdHMsIGVsZS5odG1sKCkpKSk7XG4gICAgfSBlbHNlIGlmIChhdHRyID09PSAnYXBwZW5kJykge1xuICAgICAgZWxlLmFwcGVuZChpMThuZXh0LnQoa2V5LCBleHRlbmREZWZhdWx0KG9wdHMsIGVsZS5odG1sKCkpKSk7XG4gICAgfSBlbHNlIGlmIChhdHRyLmluZGV4T2YoJ2RhdGEtJykgPT09IDApIHtcbiAgICAgIHZhciBkYXRhQXR0ciA9IGF0dHIuc3Vic3RyKCdkYXRhLScubGVuZ3RoKTtcbiAgICAgIHZhciB0cmFuc2xhdGVkID0gaTE4bmV4dC50KGtleSwgZXh0ZW5kRGVmYXVsdChvcHRzLCBlbGUuZGF0YShkYXRhQXR0cikpKTtcblxuICAgICAgLy8gd2UgY2hhbmdlIGludG8gdGhlIGRhdGEgY2FjaGVcbiAgICAgIGVsZS5kYXRhKGRhdGFBdHRyLCB0cmFuc2xhdGVkKTtcbiAgICAgIC8vIHdlIGNoYW5nZSBpbnRvIHRoZSBkb21cbiAgICAgIGVsZS5hdHRyKGF0dHIsIHRyYW5zbGF0ZWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGUuYXR0cihhdHRyLCBpMThuZXh0LnQoa2V5LCBleHRlbmREZWZhdWx0KG9wdHMsIGVsZS5hdHRyKGF0dHIpKSkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGxvY2FsaXplKGVsZSwgb3B0cykge1xuICAgIHZhciBrZXkgPSBlbGUuYXR0cihvcHRpb25zLnNlbGVjdG9yQXR0cik7XG4gICAgaWYgKCFrZXkgJiYgdHlwZW9mIGtleSAhPT0gJ3VuZGVmaW5lZCcgJiYga2V5ICE9PSBmYWxzZSkga2V5ID0gZWxlLnRleHQoKSB8fCBlbGUudmFsKCk7XG4gICAgaWYgKCFrZXkpIHJldHVybjtcblxuICAgIHZhciB0YXJnZXQgPSBlbGUsXG4gICAgICAgIHRhcmdldFNlbGVjdG9yID0gZWxlLmRhdGEob3B0aW9ucy50YXJnZXRBdHRyKTtcblxuICAgIGlmICh0YXJnZXRTZWxlY3RvcikgdGFyZ2V0ID0gZWxlLmZpbmQodGFyZ2V0U2VsZWN0b3IpIHx8IGVsZTtcblxuICAgIGlmICghb3B0cyAmJiBvcHRpb25zLnVzZU9wdGlvbnNBdHRyID09PSB0cnVlKSBvcHRzID0gZWxlLmRhdGEob3B0aW9ucy5vcHRpb25zQXR0cik7XG5cbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcblxuICAgIGlmIChrZXkuaW5kZXhPZignOycpID49IDApIHtcbiAgICAgIHZhciBrZXlzID0ga2V5LnNwbGl0KCc7Jyk7XG5cbiAgICAgICQuZWFjaChrZXlzLCBmdW5jdGlvbiAobSwgaykge1xuICAgICAgICBpZiAoayAhPT0gJycpIHBhcnNlKHRhcmdldCwgaywgb3B0cyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyc2UodGFyZ2V0LCBrZXksIG9wdHMpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnVzZU9wdGlvbnNBdHRyID09PSB0cnVlKSB7XG4gICAgICB2YXIgY2xvbmUgPSB7fTtcbiAgICAgIGNsb25lID0gX2V4dGVuZHMoeyBjbG9uZTogY2xvbmUgfSwgb3B0cyk7XG5cbiAgICAgIGRlbGV0ZSBjbG9uZS5sbmc7XG4gICAgICBlbGUuZGF0YShvcHRpb25zLm9wdGlvbnNBdHRyLCBjbG9uZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlKG9wdHMpIHtcbiAgICByZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGxvY2FsaXplIGVsZW1lbnQgaXRzZWxmXG4gICAgICBsb2NhbGl6ZSgkKHRoaXMpLCBvcHRzKTtcblxuICAgICAgLy8gbG9jYWxpemUgY2hpbGRyZW5cbiAgICAgIHZhciBlbGVtZW50cyA9ICQodGhpcykuZmluZCgnWycgKyBvcHRpb25zLnNlbGVjdG9yQXR0ciArICddJyk7XG4gICAgICBlbGVtZW50cy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbG9jYWxpemUoJCh0aGlzKSwgb3B0cyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyAkLnQgJC5pMThuIHNob3J0Y3V0XG4gICRbb3B0aW9ucy50TmFtZV0gPSBpMThuZXh0LnQuYmluZChpMThuZXh0KTtcbiAgJFtvcHRpb25zLmkxOG5OYW1lXSA9IGkxOG5leHQ7XG5cbiAgLy8gc2VsZWN0b3IgZnVuY3Rpb24gJChteVNlbGVjdG9yKS5sb2NhbGl6ZShvcHRzKTtcbiAgJC5mbltvcHRpb25zLmhhbmRsZU5hbWVdID0gaGFuZGxlO1xufVxuXG52YXIgaW5kZXggPSB7XG4gIGluaXQ6IGluaXRcbn07XG5cbnJldHVybiBpbmRleDtcblxufSkpKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2V4dGVybmFsL2kxOG5leHQvc2NyaXB0cy9qcXVlcnktaTE4bmV4dC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwuaTE4bmV4dCA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmo7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbn07XG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIGNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cblxuXG5cblxuXG5cblxuXG52YXIgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxuXG5cbnZhciBpbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbn07XG5cblxuXG5cblxuXG5cblxuXG5cblxudmFyIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4gPSBmdW5jdGlvbiAoc2VsZiwgY2FsbCkge1xuICBpZiAoIXNlbGYpIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjtcbn07XG5cblxuXG5cblxudmFyIHNsaWNlZFRvQXJyYXkgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIHNsaWNlSXRlcmF0b3IoYXJyLCBpKSB7XG4gICAgdmFyIF9hcnIgPSBbXTtcbiAgICB2YXIgX24gPSB0cnVlO1xuICAgIHZhciBfZCA9IGZhbHNlO1xuICAgIHZhciBfZSA9IHVuZGVmaW5lZDtcblxuICAgIHRyeSB7XG4gICAgICBmb3IgKHZhciBfaSA9IGFycltTeW1ib2wuaXRlcmF0b3JdKCksIF9zOyAhKF9uID0gKF9zID0gX2kubmV4dCgpKS5kb25lKTsgX24gPSB0cnVlKSB7XG4gICAgICAgIF9hcnIucHVzaChfcy52YWx1ZSk7XG5cbiAgICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgX2QgPSB0cnVlO1xuICAgICAgX2UgPSBlcnI7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICghX24gJiYgX2lbXCJyZXR1cm5cIl0pIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBpZiAoX2QpIHRocm93IF9lO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBfYXJyO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChhcnIsIGkpIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSB7XG4gICAgICByZXR1cm4gYXJyO1xuICAgIH0gZWxzZSBpZiAoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChhcnIpKSB7XG4gICAgICByZXR1cm4gc2xpY2VJdGVyYXRvcihhcnIsIGkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKTtcbiAgICB9XG4gIH07XG59KCk7XG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciB0b0NvbnN1bWFibGVBcnJheSA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBhcnIyID0gQXJyYXkoYXJyLmxlbmd0aCk7IGkgPCBhcnIubGVuZ3RoOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG5cbiAgICByZXR1cm4gYXJyMjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShhcnIpO1xuICB9XG59O1xuXG52YXIgY29uc29sZUxvZ2dlciA9IHtcbiAgdHlwZTogJ2xvZ2dlcicsXG5cbiAgbG9nOiBmdW5jdGlvbiBsb2coYXJncykge1xuICAgIHRoaXMub3V0cHV0KCdsb2cnLCBhcmdzKTtcbiAgfSxcbiAgd2FybjogZnVuY3Rpb24gd2FybihhcmdzKSB7XG4gICAgdGhpcy5vdXRwdXQoJ3dhcm4nLCBhcmdzKTtcbiAgfSxcbiAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKGFyZ3MpIHtcbiAgICB0aGlzLm91dHB1dCgnZXJyb3InLCBhcmdzKTtcbiAgfSxcbiAgb3V0cHV0OiBmdW5jdGlvbiBvdXRwdXQodHlwZSwgYXJncykge1xuICAgIHZhciBfY29uc29sZTtcblxuICAgIC8qIGVzbGludCBuby1jb25zb2xlOiAwICovXG4gICAgaWYgKGNvbnNvbGUgJiYgY29uc29sZVt0eXBlXSkgKF9jb25zb2xlID0gY29uc29sZSlbdHlwZV0uYXBwbHkoX2NvbnNvbGUsIHRvQ29uc3VtYWJsZUFycmF5KGFyZ3MpKTtcbiAgfVxufTtcblxudmFyIExvZ2dlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTG9nZ2VyKGNvbmNyZXRlTG9nZ2VyKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIExvZ2dlcik7XG5cbiAgICB0aGlzLmluaXQoY29uY3JldGVMb2dnZXIsIG9wdGlvbnMpO1xuICB9XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gaW5pdChjb25jcmV0ZUxvZ2dlcikge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIHRoaXMucHJlZml4ID0gb3B0aW9ucy5wcmVmaXggfHwgJ2kxOG5leHQ6JztcbiAgICB0aGlzLmxvZ2dlciA9IGNvbmNyZXRlTG9nZ2VyIHx8IGNvbnNvbGVMb2dnZXI7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICB0aGlzLmRlYnVnID0gb3B0aW9ucy5kZWJ1ZztcbiAgfTtcblxuICBMb2dnZXIucHJvdG90eXBlLnNldERlYnVnID0gZnVuY3Rpb24gc2V0RGVidWcoYm9vbCkge1xuICAgIHRoaXMuZGVidWcgPSBib29sO1xuICB9O1xuXG4gIExvZ2dlci5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24gbG9nKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmZvcndhcmQoYXJncywgJ2xvZycsICcnLCB0cnVlKTtcbiAgfTtcblxuICBMb2dnZXIucHJvdG90eXBlLndhcm4gPSBmdW5jdGlvbiB3YXJuKCkge1xuICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICBhcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZm9yd2FyZChhcmdzLCAnd2FybicsICcnLCB0cnVlKTtcbiAgfTtcblxuICBMb2dnZXIucHJvdG90eXBlLmVycm9yID0gZnVuY3Rpb24gZXJyb3IoKSB7XG4gICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjMpLCBfa2V5MyA9IDA7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgIGFyZ3NbX2tleTNdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5mb3J3YXJkKGFyZ3MsICdlcnJvcicsICcnKTtcbiAgfTtcblxuICBMb2dnZXIucHJvdG90eXBlLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uIGRlcHJlY2F0ZSgpIHtcbiAgICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuNCksIF9rZXk0ID0gMDsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgICAgYXJnc1tfa2V5NF0gPSBhcmd1bWVudHNbX2tleTRdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmZvcndhcmQoYXJncywgJ3dhcm4nLCAnV0FSTklORyBERVBSRUNBVEVEOiAnLCB0cnVlKTtcbiAgfTtcblxuICBMb2dnZXIucHJvdG90eXBlLmZvcndhcmQgPSBmdW5jdGlvbiBmb3J3YXJkKGFyZ3MsIGx2bCwgcHJlZml4LCBkZWJ1Z09ubHkpIHtcbiAgICBpZiAoZGVidWdPbmx5ICYmICF0aGlzLmRlYnVnKSByZXR1cm4gbnVsbDtcbiAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnKSBhcmdzWzBdID0gJycgKyBwcmVmaXggKyB0aGlzLnByZWZpeCArICcgJyArIGFyZ3NbMF07XG4gICAgcmV0dXJuIHRoaXMubG9nZ2VyW2x2bF0oYXJncyk7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUobW9kdWxlTmFtZSkge1xuICAgIHJldHVybiBuZXcgTG9nZ2VyKHRoaXMubG9nZ2VyLCBfZXh0ZW5kcyh7IHByZWZpeDogdGhpcy5wcmVmaXggKyAnOicgKyBtb2R1bGVOYW1lICsgJzonIH0sIHRoaXMub3B0aW9ucykpO1xuICB9O1xuXG4gIHJldHVybiBMb2dnZXI7XG59KCk7XG5cbnZhciBiYXNlTG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuXG52YXIgRXZlbnRFbWl0dGVyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgRXZlbnRFbWl0dGVyKTtcblxuICAgIHRoaXMub2JzZXJ2ZXJzID0ge307XG4gIH1cblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gb24oZXZlbnRzLCBsaXN0ZW5lcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBldmVudHMuc3BsaXQoJyAnKS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgX3RoaXMub2JzZXJ2ZXJzW2V2ZW50XSA9IF90aGlzLm9ic2VydmVyc1tldmVudF0gfHwgW107XG4gICAgICBfdGhpcy5vYnNlcnZlcnNbZXZlbnRdLnB1c2gobGlzdGVuZXIpO1xuICAgIH0pO1xuICB9O1xuXG4gIEV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gZnVuY3Rpb24gb2ZmKGV2ZW50LCBsaXN0ZW5lcikge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgaWYgKCF0aGlzLm9ic2VydmVyc1tldmVudF0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLm9ic2VydmVyc1tldmVudF0uZm9yRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWxpc3RlbmVyKSB7XG4gICAgICAgIGRlbGV0ZSBfdGhpczIub2JzZXJ2ZXJzW2V2ZW50XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBpbmRleCA9IF90aGlzMi5vYnNlcnZlcnNbZXZlbnRdLmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgIF90aGlzMi5vYnNlcnZlcnNbZXZlbnRdLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2ZW50KSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vYnNlcnZlcnNbZXZlbnRdKSB7XG4gICAgICB2YXIgY2xvbmVkID0gW10uY29uY2F0KHRoaXMub2JzZXJ2ZXJzW2V2ZW50XSk7XG4gICAgICBjbG9uZWQuZm9yRWFjaChmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgICAgb2JzZXJ2ZXIuYXBwbHkodW5kZWZpbmVkLCBhcmdzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm9ic2VydmVyc1snKiddKSB7XG4gICAgICB2YXIgX2Nsb25lZCA9IFtdLmNvbmNhdCh0aGlzLm9ic2VydmVyc1snKiddKTtcbiAgICAgIF9jbG9uZWQuZm9yRWFjaChmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICAgICAgdmFyIF9yZWY7XG5cbiAgICAgICAgb2JzZXJ2ZXIuYXBwbHkob2JzZXJ2ZXIsIChfcmVmID0gW2V2ZW50XSkuY29uY2F0LmFwcGx5KF9yZWYsIGFyZ3MpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gRXZlbnRFbWl0dGVyO1xufSgpO1xuXG5mdW5jdGlvbiBtYWtlU3RyaW5nKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09IG51bGwpIHJldHVybiAnJztcbiAgLyogZXNsaW50IHByZWZlci10ZW1wbGF0ZTogMCAqL1xuICByZXR1cm4gJycgKyBvYmplY3Q7XG59XG5cbmZ1bmN0aW9uIGNvcHkoYSwgcywgdCkge1xuICBhLmZvckVhY2goZnVuY3Rpb24gKG0pIHtcbiAgICBpZiAoc1ttXSkgdFttXSA9IHNbbV07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRMYXN0T2ZQYXRoKG9iamVjdCwgcGF0aCwgRW1wdHkpIHtcbiAgZnVuY3Rpb24gY2xlYW5LZXkoa2V5KSB7XG4gICAgcmV0dXJuIGtleSAmJiBrZXkuaW5kZXhPZignIyMjJykgPiAtMSA/IGtleS5yZXBsYWNlKC8jIyMvZywgJy4nKSA6IGtleTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbk5vdFRyYXZlcnNlRGVlcGVyKCkge1xuICAgIHJldHVybiAhb2JqZWN0IHx8IHR5cGVvZiBvYmplY3QgPT09ICdzdHJpbmcnO1xuICB9XG5cbiAgdmFyIHN0YWNrID0gdHlwZW9mIHBhdGggIT09ICdzdHJpbmcnID8gW10uY29uY2F0KHBhdGgpIDogcGF0aC5zcGxpdCgnLicpO1xuICB3aGlsZSAoc3RhY2subGVuZ3RoID4gMSkge1xuICAgIGlmIChjYW5Ob3RUcmF2ZXJzZURlZXBlcigpKSByZXR1cm4ge307XG5cbiAgICB2YXIga2V5ID0gY2xlYW5LZXkoc3RhY2suc2hpZnQoKSk7XG4gICAgaWYgKCFvYmplY3Rba2V5XSAmJiBFbXB0eSkgb2JqZWN0W2tleV0gPSBuZXcgRW1wdHkoKTtcbiAgICBvYmplY3QgPSBvYmplY3Rba2V5XTtcbiAgfVxuXG4gIGlmIChjYW5Ob3RUcmF2ZXJzZURlZXBlcigpKSByZXR1cm4ge307XG4gIHJldHVybiB7XG4gICAgb2JqOiBvYmplY3QsXG4gICAgazogY2xlYW5LZXkoc3RhY2suc2hpZnQoKSlcbiAgfTtcbn1cblxuZnVuY3Rpb24gc2V0UGF0aChvYmplY3QsIHBhdGgsIG5ld1ZhbHVlKSB7XG4gIHZhciBfZ2V0TGFzdE9mUGF0aCA9IGdldExhc3RPZlBhdGgob2JqZWN0LCBwYXRoLCBPYmplY3QpLFxuICAgICAgb2JqID0gX2dldExhc3RPZlBhdGgub2JqLFxuICAgICAgayA9IF9nZXRMYXN0T2ZQYXRoLms7XG5cbiAgb2JqW2tdID0gbmV3VmFsdWU7XG59XG5cbmZ1bmN0aW9uIHB1c2hQYXRoKG9iamVjdCwgcGF0aCwgbmV3VmFsdWUsIGNvbmNhdCkge1xuICB2YXIgX2dldExhc3RPZlBhdGgyID0gZ2V0TGFzdE9mUGF0aChvYmplY3QsIHBhdGgsIE9iamVjdCksXG4gICAgICBvYmogPSBfZ2V0TGFzdE9mUGF0aDIub2JqLFxuICAgICAgayA9IF9nZXRMYXN0T2ZQYXRoMi5rO1xuXG4gIG9ialtrXSA9IG9ialtrXSB8fCBbXTtcbiAgaWYgKGNvbmNhdCkgb2JqW2tdID0gb2JqW2tdLmNvbmNhdChuZXdWYWx1ZSk7XG4gIGlmICghY29uY2F0KSBvYmpba10ucHVzaChuZXdWYWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGdldFBhdGgob2JqZWN0LCBwYXRoKSB7XG4gIHZhciBfZ2V0TGFzdE9mUGF0aDMgPSBnZXRMYXN0T2ZQYXRoKG9iamVjdCwgcGF0aCksXG4gICAgICBvYmogPSBfZ2V0TGFzdE9mUGF0aDMub2JqLFxuICAgICAgayA9IF9nZXRMYXN0T2ZQYXRoMy5rO1xuXG4gIGlmICghb2JqKSByZXR1cm4gdW5kZWZpbmVkO1xuICByZXR1cm4gb2JqW2tdO1xufVxuXG5mdW5jdGlvbiBkZWVwRXh0ZW5kKHRhcmdldCwgc291cmNlLCBvdmVyd3JpdGUpIHtcbiAgLyogZXNsaW50IG5vLXJlc3RyaWN0ZWQtc3ludGF4OiAwICovXG4gIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgaWYgKHByb3AgaW4gdGFyZ2V0KSB7XG4gICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgbGVhZiBzdHJpbmcgaW4gdGFyZ2V0IG9yIHNvdXJjZSB0aGVuIHJlcGxhY2Ugd2l0aCBzb3VyY2Ugb3Igc2tpcCBkZXBlbmRpbmcgb24gdGhlICdvdmVyd3JpdGUnIHN3aXRjaFxuICAgICAgaWYgKHR5cGVvZiB0YXJnZXRbcHJvcF0gPT09ICdzdHJpbmcnIHx8IHRhcmdldFtwcm9wXSBpbnN0YW5jZW9mIFN0cmluZyB8fCB0eXBlb2Ygc291cmNlW3Byb3BdID09PSAnc3RyaW5nJyB8fCBzb3VyY2VbcHJvcF0gaW5zdGFuY2VvZiBTdHJpbmcpIHtcbiAgICAgICAgaWYgKG92ZXJ3cml0ZSkgdGFyZ2V0W3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVlcEV4dGVuZCh0YXJnZXRbcHJvcF0sIHNvdXJjZVtwcm9wXSwgb3ZlcndyaXRlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0W3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5mdW5jdGlvbiByZWdleEVzY2FwZShzdHIpIHtcbiAgLyogZXNsaW50IG5vLXVzZWxlc3MtZXNjYXBlOiAwICovXG4gIHJldHVybiBzdHIucmVwbGFjZSgvW1xcLVxcW1xcXVxcL1xce1xcfVxcKFxcKVxcKlxcK1xcP1xcLlxcXFxcXF5cXCRcXHxdL2csICdcXFxcJCYnKTtcbn1cblxuLyogZXNsaW50LWRpc2FibGUgKi9cbnZhciBfZW50aXR5TWFwID0ge1xuICBcIiZcIjogXCImYW1wO1wiLFxuICBcIjxcIjogXCImbHQ7XCIsXG4gIFwiPlwiOiBcIiZndDtcIixcbiAgJ1wiJzogJyZxdW90OycsXG4gIFwiJ1wiOiAnJiMzOTsnLFxuICBcIi9cIjogJyYjeDJGOydcbn07XG4vKiBlc2xpbnQtZW5hYmxlICovXG5cbmZ1bmN0aW9uIGVzY2FwZShkYXRhKSB7XG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZGF0YS5yZXBsYWNlKC9bJjw+XCInXFwvXS9nLCBmdW5jdGlvbiAocykge1xuICAgICAgcmV0dXJuIF9lbnRpdHlNYXBbc107XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn1cblxudmFyIFJlc291cmNlU3RvcmUgPSBmdW5jdGlvbiAoX0V2ZW50RW1pdHRlcikge1xuICBpbmhlcml0cyhSZXNvdXJjZVN0b3JlLCBfRXZlbnRFbWl0dGVyKTtcblxuICBmdW5jdGlvbiBSZXNvdXJjZVN0b3JlKCkge1xuICAgIHZhciBkYXRhID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogeyBuczogWyd0cmFuc2xhdGlvbiddLCBkZWZhdWx0TlM6ICd0cmFuc2xhdGlvbicgfTtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBSZXNvdXJjZVN0b3JlKTtcblxuICAgIHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0V2ZW50RW1pdHRlci5jYWxsKHRoaXMpKTtcblxuICAgIF90aGlzLmRhdGEgPSBkYXRhO1xuICAgIF90aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIFJlc291cmNlU3RvcmUucHJvdG90eXBlLmFkZE5hbWVzcGFjZXMgPSBmdW5jdGlvbiBhZGROYW1lc3BhY2VzKG5zKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5ucy5pbmRleE9mKG5zKSA8IDApIHtcbiAgICAgIHRoaXMub3B0aW9ucy5ucy5wdXNoKG5zKTtcbiAgICB9XG4gIH07XG5cbiAgUmVzb3VyY2VTdG9yZS5wcm90b3R5cGUucmVtb3ZlTmFtZXNwYWNlcyA9IGZ1bmN0aW9uIHJlbW92ZU5hbWVzcGFjZXMobnMpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLm9wdGlvbnMubnMuaW5kZXhPZihucyk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRoaXMub3B0aW9ucy5ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfTtcblxuICBSZXNvdXJjZVN0b3JlLnByb3RvdHlwZS5nZXRSZXNvdXJjZSA9IGZ1bmN0aW9uIGdldFJlc291cmNlKGxuZywgbnMsIGtleSkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiB7fTtcblxuICAgIHZhciBrZXlTZXBhcmF0b3IgPSBvcHRpb25zLmtleVNlcGFyYXRvciB8fCB0aGlzLm9wdGlvbnMua2V5U2VwYXJhdG9yO1xuICAgIGlmIChrZXlTZXBhcmF0b3IgPT09IHVuZGVmaW5lZCkga2V5U2VwYXJhdG9yID0gJy4nO1xuXG4gICAgdmFyIHBhdGggPSBbbG5nLCBuc107XG4gICAgaWYgKGtleSAmJiB0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykgcGF0aCA9IHBhdGguY29uY2F0KGtleSk7XG4gICAgaWYgKGtleSAmJiB0eXBlb2Yga2V5ID09PSAnc3RyaW5nJykgcGF0aCA9IHBhdGguY29uY2F0KGtleVNlcGFyYXRvciA/IGtleS5zcGxpdChrZXlTZXBhcmF0b3IpIDoga2V5KTtcblxuICAgIGlmIChsbmcuaW5kZXhPZignLicpID4gLTEpIHtcbiAgICAgIHBhdGggPSBsbmcuc3BsaXQoJy4nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0UGF0aCh0aGlzLmRhdGEsIHBhdGgpO1xuICB9O1xuXG4gIFJlc291cmNlU3RvcmUucHJvdG90eXBlLmFkZFJlc291cmNlID0gZnVuY3Rpb24gYWRkUmVzb3VyY2UobG5nLCBucywga2V5LCB2YWx1ZSkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDQgJiYgYXJndW1lbnRzWzRdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbNF0gOiB7IHNpbGVudDogZmFsc2UgfTtcblxuICAgIHZhciBrZXlTZXBhcmF0b3IgPSB0aGlzLm9wdGlvbnMua2V5U2VwYXJhdG9yO1xuICAgIGlmIChrZXlTZXBhcmF0b3IgPT09IHVuZGVmaW5lZCkga2V5U2VwYXJhdG9yID0gJy4nO1xuXG4gICAgdmFyIHBhdGggPSBbbG5nLCBuc107XG4gICAgaWYgKGtleSkgcGF0aCA9IHBhdGguY29uY2F0KGtleVNlcGFyYXRvciA/IGtleS5zcGxpdChrZXlTZXBhcmF0b3IpIDoga2V5KTtcblxuICAgIGlmIChsbmcuaW5kZXhPZignLicpID4gLTEpIHtcbiAgICAgIHBhdGggPSBsbmcuc3BsaXQoJy4nKTtcbiAgICAgIHZhbHVlID0gbnM7XG4gICAgICBucyA9IHBhdGhbMV07XG4gICAgfVxuXG4gICAgdGhpcy5hZGROYW1lc3BhY2VzKG5zKTtcblxuICAgIHNldFBhdGgodGhpcy5kYXRhLCBwYXRoLCB2YWx1ZSk7XG5cbiAgICBpZiAoIW9wdGlvbnMuc2lsZW50KSB0aGlzLmVtaXQoJ2FkZGVkJywgbG5nLCBucywga2V5LCB2YWx1ZSk7XG4gIH07XG5cbiAgUmVzb3VyY2VTdG9yZS5wcm90b3R5cGUuYWRkUmVzb3VyY2VzID0gZnVuY3Rpb24gYWRkUmVzb3VyY2VzKGxuZywgbnMsIHJlc291cmNlcykge1xuICAgIC8qIGVzbGludCBuby1yZXN0cmljdGVkLXN5bnRheDogMCAqL1xuICAgIGZvciAodmFyIG0gaW4gcmVzb3VyY2VzKSB7XG4gICAgICBpZiAodHlwZW9mIHJlc291cmNlc1ttXSA9PT0gJ3N0cmluZycpIHRoaXMuYWRkUmVzb3VyY2UobG5nLCBucywgbSwgcmVzb3VyY2VzW21dLCB7IHNpbGVudDogdHJ1ZSB9KTtcbiAgICB9XG4gICAgdGhpcy5lbWl0KCdhZGRlZCcsIGxuZywgbnMsIHJlc291cmNlcyk7XG4gIH07XG5cbiAgUmVzb3VyY2VTdG9yZS5wcm90b3R5cGUuYWRkUmVzb3VyY2VCdW5kbGUgPSBmdW5jdGlvbiBhZGRSZXNvdXJjZUJ1bmRsZShsbmcsIG5zLCByZXNvdXJjZXMsIGRlZXAsIG92ZXJ3cml0ZSkge1xuICAgIHZhciBwYXRoID0gW2xuZywgbnNdO1xuICAgIGlmIChsbmcuaW5kZXhPZignLicpID4gLTEpIHtcbiAgICAgIHBhdGggPSBsbmcuc3BsaXQoJy4nKTtcbiAgICAgIGRlZXAgPSByZXNvdXJjZXM7XG4gICAgICByZXNvdXJjZXMgPSBucztcbiAgICAgIG5zID0gcGF0aFsxXTtcbiAgICB9XG5cbiAgICB0aGlzLmFkZE5hbWVzcGFjZXMobnMpO1xuXG4gICAgdmFyIHBhY2sgPSBnZXRQYXRoKHRoaXMuZGF0YSwgcGF0aCkgfHwge307XG5cbiAgICBpZiAoZGVlcCkge1xuICAgICAgZGVlcEV4dGVuZChwYWNrLCByZXNvdXJjZXMsIG92ZXJ3cml0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhY2sgPSBfZXh0ZW5kcyh7fSwgcGFjaywgcmVzb3VyY2VzKTtcbiAgICB9XG5cbiAgICBzZXRQYXRoKHRoaXMuZGF0YSwgcGF0aCwgcGFjayk7XG5cbiAgICB0aGlzLmVtaXQoJ2FkZGVkJywgbG5nLCBucywgcmVzb3VyY2VzKTtcbiAgfTtcblxuICBSZXNvdXJjZVN0b3JlLnByb3RvdHlwZS5yZW1vdmVSZXNvdXJjZUJ1bmRsZSA9IGZ1bmN0aW9uIHJlbW92ZVJlc291cmNlQnVuZGxlKGxuZywgbnMpIHtcbiAgICBpZiAodGhpcy5oYXNSZXNvdXJjZUJ1bmRsZShsbmcsIG5zKSkge1xuICAgICAgZGVsZXRlIHRoaXMuZGF0YVtsbmddW25zXTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVOYW1lc3BhY2VzKG5zKTtcblxuICAgIHRoaXMuZW1pdCgncmVtb3ZlZCcsIGxuZywgbnMpO1xuICB9O1xuXG4gIFJlc291cmNlU3RvcmUucHJvdG90eXBlLmhhc1Jlc291cmNlQnVuZGxlID0gZnVuY3Rpb24gaGFzUmVzb3VyY2VCdW5kbGUobG5nLCBucykge1xuICAgIHJldHVybiB0aGlzLmdldFJlc291cmNlKGxuZywgbnMpICE9PSB1bmRlZmluZWQ7XG4gIH07XG5cbiAgUmVzb3VyY2VTdG9yZS5wcm90b3R5cGUuZ2V0UmVzb3VyY2VCdW5kbGUgPSBmdW5jdGlvbiBnZXRSZXNvdXJjZUJ1bmRsZShsbmcsIG5zKSB7XG4gICAgaWYgKCFucykgbnMgPSB0aGlzLm9wdGlvbnMuZGVmYXVsdE5TO1xuXG4gICAgLy8gQ09NUEFUSUJJTElUWTogcmVtb3ZlIGV4dGVuZCBpbiB2Mi4xLjBcbiAgICBpZiAodGhpcy5vcHRpb25zLmNvbXBhdGliaWxpdHlBUEkgPT09ICd2MScpIHJldHVybiBfZXh0ZW5kcyh7fSwgdGhpcy5nZXRSZXNvdXJjZShsbmcsIG5zKSk7XG5cbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShsbmcsIG5zKTtcbiAgfTtcblxuICBSZXNvdXJjZVN0b3JlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgfTtcblxuICByZXR1cm4gUmVzb3VyY2VTdG9yZTtcbn0oRXZlbnRFbWl0dGVyKTtcblxudmFyIHBvc3RQcm9jZXNzb3IgPSB7XG5cbiAgcHJvY2Vzc29yczoge30sXG5cbiAgYWRkUG9zdFByb2Nlc3NvcjogZnVuY3Rpb24gYWRkUG9zdFByb2Nlc3Nvcihtb2R1bGUpIHtcbiAgICB0aGlzLnByb2Nlc3NvcnNbbW9kdWxlLm5hbWVdID0gbW9kdWxlO1xuICB9LFxuICBoYW5kbGU6IGZ1bmN0aW9uIGhhbmRsZShwcm9jZXNzb3JzLCB2YWx1ZSwga2V5LCBvcHRpb25zLCB0cmFuc2xhdG9yKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHByb2Nlc3NvcnMuZm9yRWFjaChmdW5jdGlvbiAocHJvY2Vzc29yKSB7XG4gICAgICBpZiAoX3RoaXMucHJvY2Vzc29yc1twcm9jZXNzb3JdKSB2YWx1ZSA9IF90aGlzLnByb2Nlc3NvcnNbcHJvY2Vzc29yXS5wcm9jZXNzKHZhbHVlLCBrZXksIG9wdGlvbnMsIHRyYW5zbGF0b3IpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG59O1xuXG4vKiBlc2xpbnQgbm8tcGFyYW0tcmVhc3NpZ246IDAgKi9cbmZ1bmN0aW9uIGNvbnZlcnRJbnRlcnBvbGF0aW9uKG9wdGlvbnMpIHtcblxuICBvcHRpb25zLmludGVycG9sYXRpb24gPSB7XG4gICAgdW5lc2NhcGVTdWZmaXg6ICdIVE1MJ1xuICB9O1xuXG4gIG9wdGlvbnMuaW50ZXJwb2xhdGlvbi5wcmVmaXggPSBvcHRpb25zLmludGVycG9sYXRpb25QcmVmaXggfHwgJ19fJztcbiAgb3B0aW9ucy5pbnRlcnBvbGF0aW9uLnN1ZmZpeCA9IG9wdGlvbnMuaW50ZXJwb2xhdGlvblN1ZmZpeCB8fCAnX18nO1xuICBvcHRpb25zLmludGVycG9sYXRpb24uZXNjYXBlVmFsdWUgPSBvcHRpb25zLmVzY2FwZUludGVycG9sYXRpb24gfHwgZmFsc2U7XG5cbiAgb3B0aW9ucy5pbnRlcnBvbGF0aW9uLm5lc3RpbmdQcmVmaXggPSBvcHRpb25zLnJldXNlUHJlZml4IHx8ICckdCgnO1xuICBvcHRpb25zLmludGVycG9sYXRpb24ubmVzdGluZ1N1ZmZpeCA9IG9wdGlvbnMucmV1c2VTdWZmaXggfHwgJyknO1xuXG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0QVBJT3B0aW9ucyhvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLnJlc1N0b3JlKSBvcHRpb25zLnJlc291cmNlcyA9IG9wdGlvbnMucmVzU3RvcmU7XG5cbiAgaWYgKG9wdGlvbnMubnMgJiYgb3B0aW9ucy5ucy5kZWZhdWx0TnMpIHtcbiAgICBvcHRpb25zLmRlZmF1bHROUyA9IG9wdGlvbnMubnMuZGVmYXVsdE5zO1xuICAgIG9wdGlvbnMubnMgPSBvcHRpb25zLm5zLm5hbWVzcGFjZXM7XG4gIH0gZWxzZSB7XG4gICAgb3B0aW9ucy5kZWZhdWx0TlMgPSBvcHRpb25zLm5zIHx8ICd0cmFuc2xhdGlvbic7XG4gIH1cblxuICBpZiAob3B0aW9ucy5mYWxsYmFja1RvRGVmYXVsdE5TICYmIG9wdGlvbnMuZGVmYXVsdE5TKSBvcHRpb25zLmZhbGxiYWNrTlMgPSBvcHRpb25zLmRlZmF1bHROUztcblxuICBvcHRpb25zLnNhdmVNaXNzaW5nID0gb3B0aW9ucy5zZW5kTWlzc2luZztcbiAgb3B0aW9ucy5zYXZlTWlzc2luZ1RvID0gb3B0aW9ucy5zZW5kTWlzc2luZ1RvIHx8ICdjdXJyZW50JztcbiAgb3B0aW9ucy5yZXR1cm5OdWxsID0gIW9wdGlvbnMuZmFsbGJhY2tPbk51bGw7XG4gIG9wdGlvbnMucmV0dXJuRW1wdHlTdHJpbmcgPSAhb3B0aW9ucy5mYWxsYmFja09uRW1wdHk7XG4gIG9wdGlvbnMucmV0dXJuT2JqZWN0cyA9IG9wdGlvbnMucmV0dXJuT2JqZWN0VHJlZXM7XG4gIG9wdGlvbnMuam9pbkFycmF5cyA9ICdcXG4nO1xuXG4gIG9wdGlvbnMucmV0dXJuZWRPYmplY3RIYW5kbGVyID0gb3B0aW9ucy5vYmplY3RUcmVlS2V5SGFuZGxlcjtcbiAgb3B0aW9ucy5wYXJzZU1pc3NpbmdLZXlIYW5kbGVyID0gb3B0aW9ucy5wYXJzZU1pc3NpbmdLZXk7XG4gIG9wdGlvbnMuYXBwZW5kTmFtZXNwYWNlVG9NaXNzaW5nS2V5ID0gdHJ1ZTtcblxuICBvcHRpb25zLm5zU2VwYXJhdG9yID0gb3B0aW9ucy5uc3NlcGFyYXRvciB8fCAnOic7XG4gIG9wdGlvbnMua2V5U2VwYXJhdG9yID0gb3B0aW9ucy5rZXlzZXBhcmF0b3IgfHwgJy4nO1xuXG4gIGlmIChvcHRpb25zLnNob3J0Y3V0RnVuY3Rpb24gPT09ICdzcHJpbnRmJykge1xuICAgIG9wdGlvbnMub3ZlcmxvYWRUcmFuc2xhdGlvbk9wdGlvbkhhbmRsZXIgPSBmdW5jdGlvbiBoYW5kbGUoYXJncykge1xuICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFsdWVzLnB1c2goYXJnc1tpXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHBvc3RQcm9jZXNzOiAnc3ByaW50ZicsXG4gICAgICAgIHNwcmludGY6IHZhbHVlc1xuICAgICAgfTtcbiAgICB9O1xuICB9XG5cbiAgb3B0aW9ucy53aGl0ZWxpc3QgPSBvcHRpb25zLmxuZ1doaXRlbGlzdDtcbiAgb3B0aW9ucy5wcmVsb2FkID0gb3B0aW9ucy5wcmVsb2FkO1xuICBpZiAob3B0aW9ucy5sb2FkID09PSAnY3VycmVudCcpIG9wdGlvbnMubG9hZCA9ICdjdXJyZW50T25seSc7XG4gIGlmIChvcHRpb25zLmxvYWQgPT09ICd1bnNwZWNpZmljJykgb3B0aW9ucy5sb2FkID0gJ2xhbmd1YWdlT25seSc7XG5cbiAgLy8gYmFja2VuZFxuICBvcHRpb25zLmJhY2tlbmQgPSBvcHRpb25zLmJhY2tlbmQgfHwge307XG4gIG9wdGlvbnMuYmFja2VuZC5sb2FkUGF0aCA9IG9wdGlvbnMucmVzR2V0UGF0aCB8fCAnbG9jYWxlcy9fX2xuZ19fL19fbnNfXy5qc29uJztcbiAgb3B0aW9ucy5iYWNrZW5kLmFkZFBhdGggPSBvcHRpb25zLnJlc1Bvc3RQYXRoIHx8ICdsb2NhbGVzL2FkZC9fX2xuZ19fL19fbnNfXyc7XG4gIG9wdGlvbnMuYmFja2VuZC5hbGxvd011bHRpTG9hZGluZyA9IG9wdGlvbnMuZHluYW1pY0xvYWQ7XG5cbiAgLy8gY2FjaGVcbiAgb3B0aW9ucy5jYWNoZSA9IG9wdGlvbnMuY2FjaGUgfHwge307XG4gIG9wdGlvbnMuY2FjaGUucHJlZml4ID0gJ3Jlc18nO1xuICBvcHRpb25zLmNhY2hlLmV4cGlyYXRpb25UaW1lID0gNyAqIDI0ICogNjAgKiA2MCAqIDEwMDA7XG4gIG9wdGlvbnMuY2FjaGUuZW5hYmxlZCA9IG9wdGlvbnMudXNlTG9jYWxTdG9yYWdlO1xuXG4gIG9wdGlvbnMgPSBjb252ZXJ0SW50ZXJwb2xhdGlvbihvcHRpb25zKTtcbiAgaWYgKG9wdGlvbnMuZGVmYXVsdFZhcmlhYmxlcykgb3B0aW9ucy5pbnRlcnBvbGF0aW9uLmRlZmF1bHRWYXJpYWJsZXMgPSBvcHRpb25zLmRlZmF1bHRWYXJpYWJsZXM7XG5cbiAgLy8gQ09NUEFUSUJJTElUWTogZGVwcmVjYXRpb25cbiAgLy8gaWYgKG9wdGlvbnMuZ2V0QXN5bmMgPT09IGZhbHNlKSB0aHJvdyBkZXByZWNhdGlvbiBlcnJvclxuXG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0SlNPTk9wdGlvbnMob3B0aW9ucykge1xuICBvcHRpb25zID0gY29udmVydEludGVycG9sYXRpb24ob3B0aW9ucyk7XG4gIG9wdGlvbnMuam9pbkFycmF5cyA9ICdcXG4nO1xuXG4gIHJldHVybiBvcHRpb25zO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VE9wdGlvbnMob3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5pbnRlcnBvbGF0aW9uUHJlZml4IHx8IG9wdGlvbnMuaW50ZXJwb2xhdGlvblN1ZmZpeCB8fCBvcHRpb25zLmVzY2FwZUludGVycG9sYXRpb24gIT09IHVuZGVmaW5lZCkge1xuICAgIG9wdGlvbnMgPSBjb252ZXJ0SW50ZXJwb2xhdGlvbihvcHRpb25zKTtcbiAgfVxuXG4gIG9wdGlvbnMubnNTZXBhcmF0b3IgPSBvcHRpb25zLm5zc2VwYXJhdG9yO1xuICBvcHRpb25zLmtleVNlcGFyYXRvciA9IG9wdGlvbnMua2V5c2VwYXJhdG9yO1xuXG4gIG9wdGlvbnMucmV0dXJuT2JqZWN0cyA9IG9wdGlvbnMucmV0dXJuT2JqZWN0VHJlZXM7XG5cbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZEJhY2t3YXJkc0FQSShpMThuKSB7XG4gIGkxOG4ubG5nID0gZnVuY3Rpb24gKCkge1xuICAgIGJhc2VMb2dnZXIuZGVwcmVjYXRlKCdpMThuZXh0LmxuZygpIGNhbiBiZSByZXBsYWNlZCBieSBpMThuZXh0Lmxhbmd1YWdlIGZvciBkZXRlY3RlZCBsYW5ndWFnZSBvciBpMThuZXh0Lmxhbmd1YWdlcyBmb3IgbGFuZ3VhZ2VzIG9yZGVyZWQgYnkgdHJhbnNsYXRpb24gbG9va3VwLicpO1xuICAgIHJldHVybiBpMThuLnNlcnZpY2VzLmxhbmd1YWdlVXRpbHMudG9SZXNvbHZlSGllcmFyY2h5KGkxOG4ubGFuZ3VhZ2UpWzBdO1xuICB9O1xuXG4gIGkxOG4ucHJlbG9hZCA9IGZ1bmN0aW9uIChsbmdzLCBjYikge1xuICAgIGJhc2VMb2dnZXIuZGVwcmVjYXRlKCdpMThuZXh0LnByZWxvYWQoKSBjYW4gYmUgcmVwbGFjZWQgd2l0aCBpMThuZXh0LmxvYWRMYW5ndWFnZXMoKScpO1xuICAgIGkxOG4ubG9hZExhbmd1YWdlcyhsbmdzLCBjYik7XG4gIH07XG5cbiAgaTE4bi5zZXRMbmcgPSBmdW5jdGlvbiAobG5nLCBvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIGJhc2VMb2dnZXIuZGVwcmVjYXRlKCdpMThuZXh0LnNldExuZygpIGNhbiBiZSByZXBsYWNlZCB3aXRoIGkxOG5leHQuY2hhbmdlTGFuZ3VhZ2UoKSBvciBpMThuZXh0LmdldEZpeGVkVCgpIHRvIGdldCBhIHRyYW5zbGF0aW9uIGZ1bmN0aW9uIHdpdGggZml4ZWQgbGFuZ3VhZ2Ugb3IgbmFtZXNwYWNlLicpO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICAgIGlmIChvcHRpb25zLmZpeExuZyA9PT0gdHJ1ZSkge1xuICAgICAgaWYgKGNhbGxiYWNrKSByZXR1cm4gY2FsbGJhY2sobnVsbCwgaTE4bi5nZXRGaXhlZFQobG5nKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGkxOG4uY2hhbmdlTGFuZ3VhZ2UobG5nLCBjYWxsYmFjayk7XG4gIH07XG5cbiAgaTE4bi5hZGRQb3N0UHJvY2Vzc29yID0gZnVuY3Rpb24gKG5hbWUsIGZjKSB7XG4gICAgYmFzZUxvZ2dlci5kZXByZWNhdGUoJ2kxOG5leHQuYWRkUG9zdFByb2Nlc3NvcigpIGNhbiBiZSByZXBsYWNlZCBieSBpMThuZXh0LnVzZSh7IHR5cGU6IFxcJ3Bvc3RQcm9jZXNzb3JcXCcsIG5hbWU6IFxcJ25hbWVcXCcsIHByb2Nlc3M6IGZjIH0pJyk7XG4gICAgaTE4bi51c2Uoe1xuICAgICAgdHlwZTogJ3Bvc3RQcm9jZXNzb3InLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHByb2Nlc3M6IGZjXG4gICAgfSk7XG4gIH07XG59XG5cbnZhciBUcmFuc2xhdG9yID0gZnVuY3Rpb24gKF9FdmVudEVtaXR0ZXIpIHtcbiAgaW5oZXJpdHMoVHJhbnNsYXRvciwgX0V2ZW50RW1pdHRlcik7XG5cbiAgZnVuY3Rpb24gVHJhbnNsYXRvcihzZXJ2aWNlcykge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBUcmFuc2xhdG9yKTtcblxuICAgIHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0V2ZW50RW1pdHRlci5jYWxsKHRoaXMpKTtcblxuICAgIGNvcHkoWydyZXNvdXJjZVN0b3JlJywgJ2xhbmd1YWdlVXRpbHMnLCAncGx1cmFsUmVzb2x2ZXInLCAnaW50ZXJwb2xhdG9yJywgJ2JhY2tlbmRDb25uZWN0b3InXSwgc2VydmljZXMsIF90aGlzKTtcblxuICAgIF90aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIF90aGlzLmxvZ2dlciA9IGJhc2VMb2dnZXIuY3JlYXRlKCd0cmFuc2xhdG9yJyk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgVHJhbnNsYXRvci5wcm90b3R5cGUuY2hhbmdlTGFuZ3VhZ2UgPSBmdW5jdGlvbiBjaGFuZ2VMYW5ndWFnZShsbmcpIHtcbiAgICBpZiAobG5nKSB0aGlzLmxhbmd1YWdlID0gbG5nO1xuICB9O1xuXG4gIFRyYW5zbGF0b3IucHJvdG90eXBlLmV4aXN0cyA9IGZ1bmN0aW9uIGV4aXN0cyhrZXkpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogeyBpbnRlcnBvbGF0aW9uOiB7fSB9O1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb21wYXRpYmlsaXR5QVBJID09PSAndjEnKSB7XG4gICAgICBvcHRpb25zID0gY29udmVydFRPcHRpb25zKG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJlc29sdmUoa2V5LCBvcHRpb25zKSAhPT0gdW5kZWZpbmVkO1xuICB9O1xuXG4gIFRyYW5zbGF0b3IucHJvdG90eXBlLmV4dHJhY3RGcm9tS2V5ID0gZnVuY3Rpb24gZXh0cmFjdEZyb21LZXkoa2V5LCBvcHRpb25zKSB7XG4gICAgdmFyIG5zU2VwYXJhdG9yID0gb3B0aW9ucy5uc1NlcGFyYXRvciB8fCB0aGlzLm9wdGlvbnMubnNTZXBhcmF0b3I7XG4gICAgaWYgKG5zU2VwYXJhdG9yID09PSB1bmRlZmluZWQpIG5zU2VwYXJhdG9yID0gJzonO1xuICAgIHZhciBrZXlTZXBhcmF0b3IgPSBvcHRpb25zLmtleVNlcGFyYXRvciB8fCB0aGlzLm9wdGlvbnMua2V5U2VwYXJhdG9yIHx8ICcuJztcblxuICAgIHZhciBuYW1lc3BhY2VzID0gb3B0aW9ucy5ucyB8fCB0aGlzLm9wdGlvbnMuZGVmYXVsdE5TO1xuICAgIGlmIChuc1NlcGFyYXRvciAmJiBrZXkuaW5kZXhPZihuc1NlcGFyYXRvcikgPiAtMSkge1xuICAgICAgdmFyIHBhcnRzID0ga2V5LnNwbGl0KG5zU2VwYXJhdG9yKTtcbiAgICAgIGlmIChuc1NlcGFyYXRvciAhPT0ga2V5U2VwYXJhdG9yIHx8IG5zU2VwYXJhdG9yID09PSBrZXlTZXBhcmF0b3IgJiYgdGhpcy5vcHRpb25zLm5zLmluZGV4T2YocGFydHNbMF0pID4gLTEpIG5hbWVzcGFjZXMgPSBwYXJ0cy5zaGlmdCgpO1xuICAgICAga2V5ID0gcGFydHMuam9pbihrZXlTZXBhcmF0b3IpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIG5hbWVzcGFjZXMgPT09ICdzdHJpbmcnKSBuYW1lc3BhY2VzID0gW25hbWVzcGFjZXNdO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGtleToga2V5LFxuICAgICAgbmFtZXNwYWNlczogbmFtZXNwYWNlc1xuICAgIH07XG4gIH07XG5cbiAgVHJhbnNsYXRvci5wcm90b3R5cGUudHJhbnNsYXRlID0gZnVuY3Rpb24gdHJhbnNsYXRlKGtleXMpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICBpZiAoKHR5cGVvZiBvcHRpb25zID09PSAndW5kZWZpbmVkJyA/ICd1bmRlZmluZWQnIDogX3R5cGVvZihvcHRpb25zKSkgIT09ICdvYmplY3QnKSB7XG4gICAgICAvKiBlc2xpbnQgcHJlZmVyLXJlc3QtcGFyYW1zOiAwICovXG4gICAgICBvcHRpb25zID0gdGhpcy5vcHRpb25zLm92ZXJsb2FkVHJhbnNsYXRpb25PcHRpb25IYW5kbGVyKGFyZ3VtZW50cyk7XG4gICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuY29tcGF0aWJpbGl0eUFQSSA9PT0gJ3YxJykge1xuICAgICAgb3B0aW9ucyA9IGNvbnZlcnRUT3B0aW9ucyhvcHRpb25zKTtcbiAgICB9XG5cbiAgICAvLyBub24gdmFsaWQga2V5cyBoYW5kbGluZ1xuICAgIGlmIChrZXlzID09PSB1bmRlZmluZWQgfHwga2V5cyA9PT0gbnVsbCB8fCBrZXlzID09PSAnJykgcmV0dXJuICcnO1xuICAgIGlmICh0eXBlb2Yga2V5cyA9PT0gJ251bWJlcicpIGtleXMgPSBTdHJpbmcoa2V5cyk7XG4gICAgaWYgKHR5cGVvZiBrZXlzID09PSAnc3RyaW5nJykga2V5cyA9IFtrZXlzXTtcblxuICAgIC8vIHNlcGFyYXRvcnNcbiAgICB2YXIga2V5U2VwYXJhdG9yID0gb3B0aW9ucy5rZXlTZXBhcmF0b3IgfHwgdGhpcy5vcHRpb25zLmtleVNlcGFyYXRvciB8fCAnLic7XG5cbiAgICAvLyBnZXQgbmFtZXNwYWNlKHMpXG5cbiAgICB2YXIgX2V4dHJhY3RGcm9tS2V5ID0gdGhpcy5leHRyYWN0RnJvbUtleShrZXlzW2tleXMubGVuZ3RoIC0gMV0sIG9wdGlvbnMpLFxuICAgICAgICBrZXkgPSBfZXh0cmFjdEZyb21LZXkua2V5LFxuICAgICAgICBuYW1lc3BhY2VzID0gX2V4dHJhY3RGcm9tS2V5Lm5hbWVzcGFjZXM7XG5cbiAgICB2YXIgbmFtZXNwYWNlID0gbmFtZXNwYWNlc1tuYW1lc3BhY2VzLmxlbmd0aCAtIDFdO1xuXG4gICAgLy8gcmV0dXJuIGtleSBvbiBDSU1vZGVcbiAgICB2YXIgbG5nID0gb3B0aW9ucy5sbmcgfHwgdGhpcy5sYW5ndWFnZTtcbiAgICB2YXIgYXBwZW5kTmFtZXNwYWNlVG9DSU1vZGUgPSBvcHRpb25zLmFwcGVuZE5hbWVzcGFjZVRvQ0lNb2RlIHx8IHRoaXMub3B0aW9ucy5hcHBlbmROYW1lc3BhY2VUb0NJTW9kZTtcbiAgICBpZiAobG5nICYmIGxuZy50b0xvd2VyQ2FzZSgpID09PSAnY2ltb2RlJykge1xuICAgICAgaWYgKGFwcGVuZE5hbWVzcGFjZVRvQ0lNb2RlKSB7XG4gICAgICAgIHZhciBuc1NlcGFyYXRvciA9IG9wdGlvbnMubnNTZXBhcmF0b3IgfHwgdGhpcy5vcHRpb25zLm5zU2VwYXJhdG9yO1xuICAgICAgICByZXR1cm4gbmFtZXNwYWNlICsgbnNTZXBhcmF0b3IgKyBrZXk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuXG4gICAgLy8gcmVzb2x2ZSBmcm9tIHN0b3JlXG4gICAgdmFyIHJlcyA9IHRoaXMucmVzb2x2ZShrZXlzLCBvcHRpb25zKTtcblxuICAgIHZhciByZXNUeXBlID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseShyZXMpO1xuICAgIHZhciBub09iamVjdCA9IFsnW29iamVjdCBOdW1iZXJdJywgJ1tvYmplY3QgRnVuY3Rpb25dJywgJ1tvYmplY3QgUmVnRXhwXSddO1xuICAgIHZhciBqb2luQXJyYXlzID0gb3B0aW9ucy5qb2luQXJyYXlzICE9PSB1bmRlZmluZWQgPyBvcHRpb25zLmpvaW5BcnJheXMgOiB0aGlzLm9wdGlvbnMuam9pbkFycmF5cztcblxuICAgIC8vIG9iamVjdFxuICAgIGlmIChyZXMgJiYgdHlwZW9mIHJlcyAhPT0gJ3N0cmluZycgJiYgbm9PYmplY3QuaW5kZXhPZihyZXNUeXBlKSA8IDAgJiYgIShqb2luQXJyYXlzICYmIHJlc1R5cGUgPT09ICdbb2JqZWN0IEFycmF5XScpKSB7XG4gICAgICBpZiAoIW9wdGlvbnMucmV0dXJuT2JqZWN0cyAmJiAhdGhpcy5vcHRpb25zLnJldHVybk9iamVjdHMpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIud2FybignYWNjZXNzaW5nIGFuIG9iamVjdCAtIGJ1dCByZXR1cm5PYmplY3RzIG9wdGlvbnMgaXMgbm90IGVuYWJsZWQhJyk7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucmV0dXJuZWRPYmplY3RIYW5kbGVyID8gdGhpcy5vcHRpb25zLnJldHVybmVkT2JqZWN0SGFuZGxlcihrZXksIHJlcywgb3B0aW9ucykgOiAna2V5IFxcJycgKyBrZXkgKyAnICgnICsgdGhpcy5sYW5ndWFnZSArICcpXFwnIHJldHVybmVkIGFuIG9iamVjdCBpbnN0ZWFkIG9mIHN0cmluZy4nO1xuICAgICAgfVxuXG4gICAgICAvLyBpZiB3ZSBnb3QgYSBzZXBhcmF0b3Igd2UgbG9vcCBvdmVyIGNoaWxkcmVuIC0gZWxzZSB3ZSBqdXN0IHJldHVybiBvYmplY3QgYXMgaXNcbiAgICAgIC8vIGFzIGhhdmluZyBpdCBzZXQgdG8gZmFsc2UgbWVhbnMgbm8gaGllcmFyY2h5IHNvIG5vIGxvb2t1cCBmb3IgbmVzdGVkIHZhbHVlc1xuICAgICAgaWYgKG9wdGlvbnMua2V5U2VwYXJhdG9yIHx8IHRoaXMub3B0aW9ucy5rZXlTZXBhcmF0b3IpIHtcbiAgICAgICAgdmFyIGNvcHkkJDEgPSByZXNUeXBlID09PSAnW29iamVjdCBBcnJheV0nID8gW10gOiB7fTsgLy8gYXBwbHkgY2hpbGQgdHJhbnNsYXRpb24gb24gYSBjb3B5XG5cbiAgICAgICAgLyogZXNsaW50IG5vLXJlc3RyaWN0ZWQtc3ludGF4OiAwICovXG4gICAgICAgIGZvciAodmFyIG0gaW4gcmVzKSB7XG4gICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChyZXMsIG0pKSB7XG4gICAgICAgICAgICBjb3B5JCQxW21dID0gdGhpcy50cmFuc2xhdGUoJycgKyBrZXkgKyBrZXlTZXBhcmF0b3IgKyBtLCBfZXh0ZW5kcyh7fSwgb3B0aW9ucywgeyBqb2luQXJyYXlzOiBmYWxzZSwgbnM6IG5hbWVzcGFjZXMgfSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXMgPSBjb3B5JCQxO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoam9pbkFycmF5cyAmJiByZXNUeXBlID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAvLyBhcnJheSBzcGVjaWFsIHRyZWF0bWVudFxuICAgICAgcmVzID0gcmVzLmpvaW4oam9pbkFycmF5cyk7XG4gICAgICBpZiAocmVzKSByZXMgPSB0aGlzLmV4dGVuZFRyYW5zbGF0aW9uKHJlcywga2V5LCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3RyaW5nLCBlbXB0eSBvciBudWxsXG4gICAgICB2YXIgdXNlZERlZmF1bHQgPSBmYWxzZTtcbiAgICAgIHZhciB1c2VkS2V5ID0gZmFsc2U7XG5cbiAgICAgIC8vIGZhbGxiYWNrIHZhbHVlXG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZExvb2t1cChyZXMpICYmIG9wdGlvbnMuZGVmYXVsdFZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdXNlZERlZmF1bHQgPSB0cnVlO1xuICAgICAgICByZXMgPSBvcHRpb25zLmRlZmF1bHRWYWx1ZTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5pc1ZhbGlkTG9va3VwKHJlcykpIHtcbiAgICAgICAgdXNlZEtleSA9IHRydWU7XG4gICAgICAgIHJlcyA9IGtleTtcbiAgICAgIH1cblxuICAgICAgLy8gc2F2ZSBtaXNzaW5nXG4gICAgICBpZiAodXNlZEtleSB8fCB1c2VkRGVmYXVsdCkge1xuICAgICAgICB0aGlzLmxvZ2dlci5sb2coJ21pc3NpbmdLZXknLCBsbmcsIG5hbWVzcGFjZSwga2V5LCByZXMpO1xuXG4gICAgICAgIHZhciBsbmdzID0gW107XG4gICAgICAgIHZhciBmYWxsYmFja0xuZ3MgPSB0aGlzLmxhbmd1YWdlVXRpbHMuZ2V0RmFsbGJhY2tDb2Rlcyh0aGlzLm9wdGlvbnMuZmFsbGJhY2tMbmcsIG9wdGlvbnMubG5nIHx8IHRoaXMubGFuZ3VhZ2UpO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNhdmVNaXNzaW5nVG8gPT09ICdmYWxsYmFjaycgJiYgZmFsbGJhY2tMbmdzICYmIGZhbGxiYWNrTG5nc1swXSkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmFsbGJhY2tMbmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsbmdzLnB1c2goZmFsbGJhY2tMbmdzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5vcHRpb25zLnNhdmVNaXNzaW5nVG8gPT09ICdhbGwnKSB7XG4gICAgICAgICAgbG5ncyA9IHRoaXMubGFuZ3VhZ2VVdGlscy50b1Jlc29sdmVIaWVyYXJjaHkob3B0aW9ucy5sbmcgfHwgdGhpcy5sYW5ndWFnZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG5ncy5wdXNoKG9wdGlvbnMubG5nIHx8IHRoaXMubGFuZ3VhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zYXZlTWlzc2luZykge1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMubWlzc2luZ0tleUhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5taXNzaW5nS2V5SGFuZGxlcihsbmdzLCBuYW1lc3BhY2UsIGtleSwgcmVzKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuYmFja2VuZENvbm5lY3RvciAmJiB0aGlzLmJhY2tlbmRDb25uZWN0b3Iuc2F2ZU1pc3NpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuYmFja2VuZENvbm5lY3Rvci5zYXZlTWlzc2luZyhsbmdzLCBuYW1lc3BhY2UsIGtleSwgcmVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVtaXQoJ21pc3NpbmdLZXknLCBsbmdzLCBuYW1lc3BhY2UsIGtleSwgcmVzKTtcbiAgICAgIH1cblxuICAgICAgLy8gZXh0ZW5kXG4gICAgICByZXMgPSB0aGlzLmV4dGVuZFRyYW5zbGF0aW9uKHJlcywga2V5LCBvcHRpb25zKTtcblxuICAgICAgLy8gYXBwZW5kIG5hbWVzcGFjZSBpZiBzdGlsbCBrZXlcbiAgICAgIGlmICh1c2VkS2V5ICYmIHJlcyA9PT0ga2V5ICYmIHRoaXMub3B0aW9ucy5hcHBlbmROYW1lc3BhY2VUb01pc3NpbmdLZXkpIHJlcyA9IG5hbWVzcGFjZSArICc6JyArIGtleTtcblxuICAgICAgLy8gcGFyc2VNaXNzaW5nS2V5SGFuZGxlclxuICAgICAgaWYgKHVzZWRLZXkgJiYgdGhpcy5vcHRpb25zLnBhcnNlTWlzc2luZ0tleUhhbmRsZXIpIHJlcyA9IHRoaXMub3B0aW9ucy5wYXJzZU1pc3NpbmdLZXlIYW5kbGVyKHJlcyk7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJuXG4gICAgcmV0dXJuIHJlcztcbiAgfTtcblxuICBUcmFuc2xhdG9yLnByb3RvdHlwZS5leHRlbmRUcmFuc2xhdGlvbiA9IGZ1bmN0aW9uIGV4dGVuZFRyYW5zbGF0aW9uKHJlcywga2V5LCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICBpZiAob3B0aW9ucy5pbnRlcnBvbGF0aW9uKSB0aGlzLmludGVycG9sYXRvci5pbml0KF9leHRlbmRzKHt9LCBvcHRpb25zLCB7IGludGVycG9sYXRpb246IF9leHRlbmRzKHt9LCB0aGlzLm9wdGlvbnMuaW50ZXJwb2xhdGlvbiwgb3B0aW9ucy5pbnRlcnBvbGF0aW9uKSB9KSk7XG5cbiAgICAvLyBpbnRlcnBvbGF0ZVxuICAgIHZhciBkYXRhID0gb3B0aW9ucy5yZXBsYWNlICYmIHR5cGVvZiBvcHRpb25zLnJlcGxhY2UgIT09ICdzdHJpbmcnID8gb3B0aW9ucy5yZXBsYWNlIDogb3B0aW9ucztcbiAgICBpZiAodGhpcy5vcHRpb25zLmludGVycG9sYXRpb24uZGVmYXVsdFZhcmlhYmxlcykgZGF0YSA9IF9leHRlbmRzKHt9LCB0aGlzLm9wdGlvbnMuaW50ZXJwb2xhdGlvbi5kZWZhdWx0VmFyaWFibGVzLCBkYXRhKTtcbiAgICByZXMgPSB0aGlzLmludGVycG9sYXRvci5pbnRlcnBvbGF0ZShyZXMsIGRhdGEsIG9wdGlvbnMubG5nIHx8IHRoaXMubGFuZ3VhZ2UpO1xuXG4gICAgLy8gbmVzdGluZ1xuICAgIGlmIChvcHRpb25zLm5lc3QgIT09IGZhbHNlKSByZXMgPSB0aGlzLmludGVycG9sYXRvci5uZXN0KHJlcywgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzMi50cmFuc2xhdGUuYXBwbHkoX3RoaXMyLCBhcmd1bWVudHMpO1xuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgaWYgKG9wdGlvbnMuaW50ZXJwb2xhdGlvbikgdGhpcy5pbnRlcnBvbGF0b3IucmVzZXQoKTtcblxuICAgIC8vIHBvc3QgcHJvY2Vzc1xuICAgIHZhciBwb3N0UHJvY2VzcyA9IG9wdGlvbnMucG9zdFByb2Nlc3MgfHwgdGhpcy5vcHRpb25zLnBvc3RQcm9jZXNzO1xuICAgIHZhciBwb3N0UHJvY2Vzc29yTmFtZXMgPSB0eXBlb2YgcG9zdFByb2Nlc3MgPT09ICdzdHJpbmcnID8gW3Bvc3RQcm9jZXNzXSA6IHBvc3RQcm9jZXNzO1xuXG4gICAgaWYgKHJlcyAhPT0gdW5kZWZpbmVkICYmIHBvc3RQcm9jZXNzb3JOYW1lcyAmJiBwb3N0UHJvY2Vzc29yTmFtZXMubGVuZ3RoICYmIG9wdGlvbnMuYXBwbHlQb3N0UHJvY2Vzc29yICE9PSBmYWxzZSkge1xuICAgICAgcmVzID0gcG9zdFByb2Nlc3Nvci5oYW5kbGUocG9zdFByb2Nlc3Nvck5hbWVzLCByZXMsIGtleSwgb3B0aW9ucywgdGhpcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcztcbiAgfTtcblxuICBUcmFuc2xhdG9yLnByb3RvdHlwZS5yZXNvbHZlID0gZnVuY3Rpb24gcmVzb2x2ZShrZXlzKSB7XG4gICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICB2YXIgZm91bmQgPSB2b2lkIDA7XG5cbiAgICBpZiAodHlwZW9mIGtleXMgPT09ICdzdHJpbmcnKSBrZXlzID0gW2tleXNdO1xuXG4gICAgLy8gZm9yRWFjaCBwb3NzaWJsZSBrZXlcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgIGlmIChfdGhpczMuaXNWYWxpZExvb2t1cChmb3VuZCkpIHJldHVybjtcblxuICAgICAgdmFyIGV4dHJhY3RlZCA9IF90aGlzMy5leHRyYWN0RnJvbUtleShrLCBvcHRpb25zKTtcbiAgICAgIHZhciBrZXkgPSBleHRyYWN0ZWQua2V5O1xuICAgICAgdmFyIG5hbWVzcGFjZXMgPSBleHRyYWN0ZWQubmFtZXNwYWNlcztcbiAgICAgIGlmIChfdGhpczMub3B0aW9ucy5mYWxsYmFja05TKSBuYW1lc3BhY2VzID0gbmFtZXNwYWNlcy5jb25jYXQoX3RoaXMzLm9wdGlvbnMuZmFsbGJhY2tOUyk7XG5cbiAgICAgIHZhciBuZWVkc1BsdXJhbEhhbmRsaW5nID0gb3B0aW9ucy5jb3VudCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvcHRpb25zLmNvdW50ICE9PSAnc3RyaW5nJztcbiAgICAgIHZhciBuZWVkc0NvbnRleHRIYW5kbGluZyA9IG9wdGlvbnMuY29udGV4dCAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvcHRpb25zLmNvbnRleHQgPT09ICdzdHJpbmcnICYmIG9wdGlvbnMuY29udGV4dCAhPT0gJyc7XG5cbiAgICAgIHZhciBjb2RlcyA9IG9wdGlvbnMubG5ncyA/IG9wdGlvbnMubG5ncyA6IF90aGlzMy5sYW5ndWFnZVV0aWxzLnRvUmVzb2x2ZUhpZXJhcmNoeShvcHRpb25zLmxuZyB8fCBfdGhpczMubGFuZ3VhZ2UpO1xuXG4gICAgICBuYW1lc3BhY2VzLmZvckVhY2goZnVuY3Rpb24gKG5zKSB7XG4gICAgICAgIGlmIChfdGhpczMuaXNWYWxpZExvb2t1cChmb3VuZCkpIHJldHVybjtcblxuICAgICAgICBjb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChjb2RlKSB7XG4gICAgICAgICAgaWYgKF90aGlzMy5pc1ZhbGlkTG9va3VwKGZvdW5kKSkgcmV0dXJuO1xuXG4gICAgICAgICAgdmFyIGZpbmFsS2V5ID0ga2V5O1xuICAgICAgICAgIHZhciBmaW5hbEtleXMgPSBbZmluYWxLZXldO1xuXG4gICAgICAgICAgdmFyIHBsdXJhbFN1ZmZpeCA9IHZvaWQgMDtcbiAgICAgICAgICBpZiAobmVlZHNQbHVyYWxIYW5kbGluZykgcGx1cmFsU3VmZml4ID0gX3RoaXMzLnBsdXJhbFJlc29sdmVyLmdldFN1ZmZpeChjb2RlLCBvcHRpb25zLmNvdW50KTtcblxuICAgICAgICAgIC8vIGZhbGxiYWNrIGZvciBwbHVyYWwgaWYgY29udGV4dCBub3QgZm91bmRcbiAgICAgICAgICBpZiAobmVlZHNQbHVyYWxIYW5kbGluZyAmJiBuZWVkc0NvbnRleHRIYW5kbGluZykgZmluYWxLZXlzLnB1c2goZmluYWxLZXkgKyBwbHVyYWxTdWZmaXgpO1xuXG4gICAgICAgICAgLy8gZ2V0IGtleSBmb3IgY29udGV4dCBpZiBuZWVkZWRcbiAgICAgICAgICBpZiAobmVlZHNDb250ZXh0SGFuZGxpbmcpIGZpbmFsS2V5cy5wdXNoKGZpbmFsS2V5ICs9ICcnICsgX3RoaXMzLm9wdGlvbnMuY29udGV4dFNlcGFyYXRvciArIG9wdGlvbnMuY29udGV4dCk7XG5cbiAgICAgICAgICAvLyBnZXQga2V5IGZvciBwbHVyYWwgaWYgbmVlZGVkXG4gICAgICAgICAgaWYgKG5lZWRzUGx1cmFsSGFuZGxpbmcpIGZpbmFsS2V5cy5wdXNoKGZpbmFsS2V5ICs9IHBsdXJhbFN1ZmZpeCk7XG5cbiAgICAgICAgICAvLyBpdGVyYXRlIG92ZXIgZmluYWxLZXlzIHN0YXJ0aW5nIHdpdGggbW9zdCBzcGVjaWZpYyBwbHVyYWxrZXkgKC0+IGNvbnRleHRrZXkgb25seSkgLT4gc2luZ3VsYXJrZXkgb25seVxuICAgICAgICAgIHZhciBwb3NzaWJsZUtleSA9IHZvaWQgMDtcbiAgICAgICAgICAvKiBlc2xpbnQgbm8tY29uZC1hc3NpZ246IDAgKi9cbiAgICAgICAgICB3aGlsZSAocG9zc2libGVLZXkgPSBmaW5hbEtleXMucG9wKCkpIHtcbiAgICAgICAgICAgIGlmICghX3RoaXMzLmlzVmFsaWRMb29rdXAoZm91bmQpKSB7XG4gICAgICAgICAgICAgIGZvdW5kID0gX3RoaXMzLmdldFJlc291cmNlKGNvZGUsIG5zLCBwb3NzaWJsZUtleSwgb3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGZvdW5kO1xuICB9O1xuXG4gIFRyYW5zbGF0b3IucHJvdG90eXBlLmlzVmFsaWRMb29rdXAgPSBmdW5jdGlvbiBpc1ZhbGlkTG9va3VwKHJlcykge1xuICAgIHJldHVybiByZXMgIT09IHVuZGVmaW5lZCAmJiAhKCF0aGlzLm9wdGlvbnMucmV0dXJuTnVsbCAmJiByZXMgPT09IG51bGwpICYmICEoIXRoaXMub3B0aW9ucy5yZXR1cm5FbXB0eVN0cmluZyAmJiByZXMgPT09ICcnKTtcbiAgfTtcblxuICBUcmFuc2xhdG9yLnByb3RvdHlwZS5nZXRSZXNvdXJjZSA9IGZ1bmN0aW9uIGdldFJlc291cmNlKGNvZGUsIG5zLCBrZXkpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDoge307XG5cbiAgICByZXR1cm4gdGhpcy5yZXNvdXJjZVN0b3JlLmdldFJlc291cmNlKGNvZGUsIG5zLCBrZXksIG9wdGlvbnMpO1xuICB9O1xuXG4gIHJldHVybiBUcmFuc2xhdG9yO1xufShFdmVudEVtaXR0ZXIpO1xuXG5mdW5jdGlvbiBjYXBpdGFsaXplKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnNsaWNlKDEpO1xufVxuXG52YXIgTGFuZ3VhZ2VVdGlsID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBMYW5ndWFnZVV0aWwob3B0aW9ucykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIExhbmd1YWdlVXRpbCk7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgdGhpcy53aGl0ZWxpc3QgPSB0aGlzLm9wdGlvbnMud2hpdGVsaXN0IHx8IGZhbHNlO1xuICAgIHRoaXMubG9nZ2VyID0gYmFzZUxvZ2dlci5jcmVhdGUoJ2xhbmd1YWdlVXRpbHMnKTtcbiAgfVxuXG4gIExhbmd1YWdlVXRpbC5wcm90b3R5cGUuZ2V0U2NyaXB0UGFydEZyb21Db2RlID0gZnVuY3Rpb24gZ2V0U2NyaXB0UGFydEZyb21Db2RlKGNvZGUpIHtcbiAgICBpZiAoIWNvZGUgfHwgY29kZS5pbmRleE9mKCctJykgPCAwKSByZXR1cm4gbnVsbDtcblxuICAgIHZhciBwID0gY29kZS5zcGxpdCgnLScpO1xuICAgIGlmIChwLmxlbmd0aCA9PT0gMikgcmV0dXJuIG51bGw7XG4gICAgcC5wb3AoKTtcbiAgICByZXR1cm4gdGhpcy5mb3JtYXRMYW5ndWFnZUNvZGUocC5qb2luKCctJykpO1xuICB9O1xuXG4gIExhbmd1YWdlVXRpbC5wcm90b3R5cGUuZ2V0TGFuZ3VhZ2VQYXJ0RnJvbUNvZGUgPSBmdW5jdGlvbiBnZXRMYW5ndWFnZVBhcnRGcm9tQ29kZShjb2RlKSB7XG4gICAgaWYgKCFjb2RlIHx8IGNvZGUuaW5kZXhPZignLScpIDwgMCkgcmV0dXJuIGNvZGU7XG5cbiAgICB2YXIgcCA9IGNvZGUuc3BsaXQoJy0nKTtcbiAgICByZXR1cm4gdGhpcy5mb3JtYXRMYW5ndWFnZUNvZGUocFswXSk7XG4gIH07XG5cbiAgTGFuZ3VhZ2VVdGlsLnByb3RvdHlwZS5mb3JtYXRMYW5ndWFnZUNvZGUgPSBmdW5jdGlvbiBmb3JtYXRMYW5ndWFnZUNvZGUoY29kZSkge1xuICAgIC8vIGh0dHA6Ly93d3cuaWFuYS5vcmcvYXNzaWdubWVudHMvbGFuZ3VhZ2UtdGFncy9sYW5ndWFnZS10YWdzLnhodG1sXG4gICAgaWYgKHR5cGVvZiBjb2RlID09PSAnc3RyaW5nJyAmJiBjb2RlLmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgICB2YXIgc3BlY2lhbENhc2VzID0gWydoYW5zJywgJ2hhbnQnLCAnbGF0bicsICdjeXJsJywgJ2NhbnMnLCAnbW9uZycsICdhcmFiJ107XG4gICAgICB2YXIgcCA9IGNvZGUuc3BsaXQoJy0nKTtcblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5sb3dlckNhc2VMbmcpIHtcbiAgICAgICAgcCA9IHAubWFwKGZ1bmN0aW9uIChwYXJ0KSB7XG4gICAgICAgICAgcmV0dXJuIHBhcnQudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHAubGVuZ3RoID09PSAyKSB7XG4gICAgICAgIHBbMF0gPSBwWzBdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHBbMV0gPSBwWzFdLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgaWYgKHNwZWNpYWxDYXNlcy5pbmRleE9mKHBbMV0udG9Mb3dlckNhc2UoKSkgPiAtMSkgcFsxXSA9IGNhcGl0YWxpemUocFsxXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH0gZWxzZSBpZiAocC5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgcFswXSA9IHBbMF0udG9Mb3dlckNhc2UoKTtcblxuICAgICAgICAvLyBpZiBsZW5naHQgMiBndWVzcyBpdCdzIGEgY291bnRyeVxuICAgICAgICBpZiAocFsxXS5sZW5ndGggPT09IDIpIHBbMV0gPSBwWzFdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIGlmIChwWzBdICE9PSAnc2duJyAmJiBwWzJdLmxlbmd0aCA9PT0gMikgcFsyXSA9IHBbMl0udG9VcHBlckNhc2UoKTtcblxuICAgICAgICBpZiAoc3BlY2lhbENhc2VzLmluZGV4T2YocFsxXS50b0xvd2VyQ2FzZSgpKSA+IC0xKSBwWzFdID0gY2FwaXRhbGl6ZShwWzFdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgICBpZiAoc3BlY2lhbENhc2VzLmluZGV4T2YocFsyXS50b0xvd2VyQ2FzZSgpKSA+IC0xKSBwWzJdID0gY2FwaXRhbGl6ZShwWzJdLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcC5qb2luKCctJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jbGVhbkNvZGUgfHwgdGhpcy5vcHRpb25zLmxvd2VyQ2FzZUxuZyA/IGNvZGUudG9Mb3dlckNhc2UoKSA6IGNvZGU7XG4gIH07XG5cbiAgTGFuZ3VhZ2VVdGlsLnByb3RvdHlwZS5pc1doaXRlbGlzdGVkID0gZnVuY3Rpb24gaXNXaGl0ZWxpc3RlZChjb2RlKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5sb2FkID09PSAnbGFuZ3VhZ2VPbmx5JyB8fCB0aGlzLm9wdGlvbnMubm9uRXhwbGljaXRXaGl0ZWxpc3QpIHtcbiAgICAgIGNvZGUgPSB0aGlzLmdldExhbmd1YWdlUGFydEZyb21Db2RlKGNvZGUpO1xuICAgIH1cbiAgICByZXR1cm4gIXRoaXMud2hpdGVsaXN0IHx8ICF0aGlzLndoaXRlbGlzdC5sZW5ndGggfHwgdGhpcy53aGl0ZWxpc3QuaW5kZXhPZihjb2RlKSA+IC0xO1xuICB9O1xuXG4gIExhbmd1YWdlVXRpbC5wcm90b3R5cGUuZ2V0RmFsbGJhY2tDb2RlcyA9IGZ1bmN0aW9uIGdldEZhbGxiYWNrQ29kZXMoZmFsbGJhY2tzLCBjb2RlKSB7XG4gICAgaWYgKCFmYWxsYmFja3MpIHJldHVybiBbXTtcbiAgICBpZiAodHlwZW9mIGZhbGxiYWNrcyA9PT0gJ3N0cmluZycpIGZhbGxiYWNrcyA9IFtmYWxsYmFja3NdO1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KGZhbGxiYWNrcykgPT09ICdbb2JqZWN0IEFycmF5XScpIHJldHVybiBmYWxsYmFja3M7XG5cbiAgICBpZiAoIWNvZGUpIHJldHVybiBmYWxsYmFja3MuZGVmYXVsdCB8fCBbXTtcblxuICAgIC8vIGFzdW1lIHdlIGhhdmUgYW4gb2JqZWN0IGRlZmluaW5nIGZhbGxiYWNrc1xuICAgIHZhciBmb3VuZCA9IGZhbGxiYWNrc1tjb2RlXTtcbiAgICBpZiAoIWZvdW5kKSBmb3VuZCA9IGZhbGxiYWNrc1t0aGlzLmdldFNjcmlwdFBhcnRGcm9tQ29kZShjb2RlKV07XG4gICAgaWYgKCFmb3VuZCkgZm91bmQgPSBmYWxsYmFja3NbdGhpcy5mb3JtYXRMYW5ndWFnZUNvZGUoY29kZSldO1xuICAgIGlmICghZm91bmQpIGZvdW5kID0gZmFsbGJhY2tzLmRlZmF1bHQ7XG5cbiAgICByZXR1cm4gZm91bmQgfHwgW107XG4gIH07XG5cbiAgTGFuZ3VhZ2VVdGlsLnByb3RvdHlwZS50b1Jlc29sdmVIaWVyYXJjaHkgPSBmdW5jdGlvbiB0b1Jlc29sdmVIaWVyYXJjaHkoY29kZSwgZmFsbGJhY2tDb2RlKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBmYWxsYmFja0NvZGVzID0gdGhpcy5nZXRGYWxsYmFja0NvZGVzKGZhbGxiYWNrQ29kZSB8fCB0aGlzLm9wdGlvbnMuZmFsbGJhY2tMbmcgfHwgW10sIGNvZGUpO1xuXG4gICAgdmFyIGNvZGVzID0gW107XG4gICAgdmFyIGFkZENvZGUgPSBmdW5jdGlvbiBhZGRDb2RlKGMpIHtcbiAgICAgIGlmICghYykgcmV0dXJuO1xuICAgICAgaWYgKF90aGlzLmlzV2hpdGVsaXN0ZWQoYykpIHtcbiAgICAgICAgY29kZXMucHVzaChjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLmxvZ2dlci53YXJuKCdyZWplY3Rpbmcgbm9uLXdoaXRlbGlzdGVkIGxhbmd1YWdlIGNvZGU6ICcgKyBjKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHR5cGVvZiBjb2RlID09PSAnc3RyaW5nJyAmJiBjb2RlLmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmxvYWQgIT09ICdsYW5ndWFnZU9ubHknKSBhZGRDb2RlKHRoaXMuZm9ybWF0TGFuZ3VhZ2VDb2RlKGNvZGUpKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubG9hZCAhPT0gJ2xhbmd1YWdlT25seScgJiYgdGhpcy5vcHRpb25zLmxvYWQgIT09ICdjdXJyZW50T25seScpIGFkZENvZGUodGhpcy5nZXRTY3JpcHRQYXJ0RnJvbUNvZGUoY29kZSkpO1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5sb2FkICE9PSAnY3VycmVudE9ubHknKSBhZGRDb2RlKHRoaXMuZ2V0TGFuZ3VhZ2VQYXJ0RnJvbUNvZGUoY29kZSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGNvZGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBhZGRDb2RlKHRoaXMuZm9ybWF0TGFuZ3VhZ2VDb2RlKGNvZGUpKTtcbiAgICB9XG5cbiAgICBmYWxsYmFja0NvZGVzLmZvckVhY2goZnVuY3Rpb24gKGZjKSB7XG4gICAgICBpZiAoY29kZXMuaW5kZXhPZihmYykgPCAwKSBhZGRDb2RlKF90aGlzLmZvcm1hdExhbmd1YWdlQ29kZShmYykpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGNvZGVzO1xuICB9O1xuXG4gIHJldHVybiBMYW5ndWFnZVV0aWw7XG59KCk7XG5cbi8vIGRlZmluaXRpb24gaHR0cDovL3RyYW5zbGF0ZS5zb3VyY2Vmb3JnZS5uZXQvd2lraS9sMTBuL3BsdXJhbGZvcm1zXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xudmFyIHNldHMgPSBbeyBsbmdzOiBbJ2FjaCcsICdhaycsICdhbScsICdhcm4nLCAnYnInLCAnZmlsJywgJ2d1bicsICdsbicsICdtZmUnLCAnbWcnLCAnbWknLCAnb2MnLCAndGcnLCAndGknLCAndHInLCAndXonLCAnd2EnXSwgbnI6IFsxLCAyXSwgZmM6IDEgfSwgeyBsbmdzOiBbJ2FmJywgJ2FuJywgJ2FzdCcsICdheicsICdiZycsICdibicsICdjYScsICdkYScsICdkZScsICdkZXYnLCAnZWwnLCAnZW4nLCAnZW8nLCAnZXMnLCAnZXNfYXInLCAnZXQnLCAnZXUnLCAnZmknLCAnZm8nLCAnZnVyJywgJ2Z5JywgJ2dsJywgJ2d1JywgJ2hhJywgJ2hlJywgJ2hpJywgJ2h1JywgJ2h5JywgJ2lhJywgJ2l0JywgJ2tuJywgJ2t1JywgJ2xiJywgJ21haScsICdtbCcsICdtbicsICdtcicsICduYWgnLCAnbmFwJywgJ25iJywgJ25lJywgJ25sJywgJ25uJywgJ25vJywgJ25zbycsICdwYScsICdwYXAnLCAncG1zJywgJ3BzJywgJ3B0JywgJ3B0X2JyJywgJ3JtJywgJ3NjbycsICdzZScsICdzaScsICdzbycsICdzb24nLCAnc3EnLCAnc3YnLCAnc3cnLCAndGEnLCAndGUnLCAndGsnLCAndXInLCAneW8nXSwgbnI6IFsxLCAyXSwgZmM6IDIgfSwgeyBsbmdzOiBbJ2F5JywgJ2JvJywgJ2NnZycsICdmYScsICdpZCcsICdqYScsICdqYm8nLCAna2EnLCAna2snLCAna20nLCAna28nLCAna3knLCAnbG8nLCAnbXMnLCAnc2FoJywgJ3N1JywgJ3RoJywgJ3R0JywgJ3VnJywgJ3ZpJywgJ3dvJywgJ3poJ10sIG5yOiBbMV0sIGZjOiAzIH0sIHsgbG5nczogWydiZScsICdicycsICdkeicsICdocicsICdydScsICdzcicsICd1ayddLCBucjogWzEsIDIsIDVdLCBmYzogNCB9LCB7IGxuZ3M6IFsnYXInXSwgbnI6IFswLCAxLCAyLCAzLCAxMSwgMTAwXSwgZmM6IDUgfSwgeyBsbmdzOiBbJ2NzJywgJ3NrJ10sIG5yOiBbMSwgMiwgNV0sIGZjOiA2IH0sIHsgbG5nczogWydjc2InLCAncGwnXSwgbnI6IFsxLCAyLCA1XSwgZmM6IDcgfSwgeyBsbmdzOiBbJ2N5J10sIG5yOiBbMSwgMiwgMywgOF0sIGZjOiA4IH0sIHsgbG5nczogWydmciddLCBucjogWzEsIDJdLCBmYzogOSB9LCB7IGxuZ3M6IFsnZ2EnXSwgbnI6IFsxLCAyLCAzLCA3LCAxMV0sIGZjOiAxMCB9LCB7IGxuZ3M6IFsnZ2QnXSwgbnI6IFsxLCAyLCAzLCAyMF0sIGZjOiAxMSB9LCB7IGxuZ3M6IFsnaXMnXSwgbnI6IFsxLCAyXSwgZmM6IDEyIH0sIHsgbG5nczogWydqdiddLCBucjogWzAsIDFdLCBmYzogMTMgfSwgeyBsbmdzOiBbJ2t3J10sIG5yOiBbMSwgMiwgMywgNF0sIGZjOiAxNCB9LCB7IGxuZ3M6IFsnbHQnXSwgbnI6IFsxLCAyLCAxMF0sIGZjOiAxNSB9LCB7IGxuZ3M6IFsnbHYnXSwgbnI6IFsxLCAyLCAwXSwgZmM6IDE2IH0sIHsgbG5nczogWydtayddLCBucjogWzEsIDJdLCBmYzogMTcgfSwgeyBsbmdzOiBbJ21uayddLCBucjogWzAsIDEsIDJdLCBmYzogMTggfSwgeyBsbmdzOiBbJ210J10sIG5yOiBbMSwgMiwgMTEsIDIwXSwgZmM6IDE5IH0sIHsgbG5nczogWydvciddLCBucjogWzIsIDFdLCBmYzogMiB9LCB7IGxuZ3M6IFsncm8nXSwgbnI6IFsxLCAyLCAyMF0sIGZjOiAyMCB9LCB7IGxuZ3M6IFsnc2wnXSwgbnI6IFs1LCAxLCAyLCAzXSwgZmM6IDIxIH1dO1xuXG52YXIgX3J1bGVzUGx1cmFsc1R5cGVzID0ge1xuICAxOiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPiAxKTtcbiAgfSxcbiAgMjogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuICE9IDEpO1xuICB9LFxuICAzOiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gMDtcbiAgfSxcbiAgNDogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuICUgMTAgPT0gMSAmJiBuICUgMTAwICE9IDExID8gMCA6IG4gJSAxMCA+PSAyICYmIG4gJSAxMCA8PSA0ICYmIChuICUgMTAwIDwgMTAgfHwgbiAlIDEwMCA+PSAyMCkgPyAxIDogMik7XG4gIH0sXG4gIDU6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PT0gMCA/IDAgOiBuID09IDEgPyAxIDogbiA9PSAyID8gMiA6IG4gJSAxMDAgPj0gMyAmJiBuICUgMTAwIDw9IDEwID8gMyA6IG4gJSAxMDAgPj0gMTEgPyA0IDogNSk7XG4gIH0sXG4gIDY6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PSAxID8gMCA6IG4gPj0gMiAmJiBuIDw9IDQgPyAxIDogMik7XG4gIH0sXG4gIDc6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PSAxID8gMCA6IG4gJSAxMCA+PSAyICYmIG4gJSAxMCA8PSA0ICYmIChuICUgMTAwIDwgMTAgfHwgbiAlIDEwMCA+PSAyMCkgPyAxIDogMik7XG4gIH0sXG4gIDg6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PSAxID8gMCA6IG4gPT0gMiA/IDEgOiBuICE9IDggJiYgbiAhPSAxMSA/IDIgOiAzKTtcbiAgfSxcbiAgOTogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuID49IDIpO1xuICB9LFxuICAxMDogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuID09IDEgPyAwIDogbiA9PSAyID8gMSA6IG4gPCA3ID8gMiA6IG4gPCAxMSA/IDMgOiA0KTtcbiAgfSxcbiAgMTE6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PSAxIHx8IG4gPT0gMTEgPyAwIDogbiA9PSAyIHx8IG4gPT0gMTIgPyAxIDogbiA+IDIgJiYgbiA8IDIwID8gMiA6IDMpO1xuICB9LFxuICAxMjogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuICUgMTAgIT0gMSB8fCBuICUgMTAwID09IDExKTtcbiAgfSxcbiAgMTM6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiAhPT0gMCk7XG4gIH0sXG4gIDE0OiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSA/IDAgOiBuID09IDIgPyAxIDogbiA9PSAzID8gMiA6IDMpO1xuICB9LFxuICAxNTogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuICUgMTAgPT0gMSAmJiBuICUgMTAwICE9IDExID8gMCA6IG4gJSAxMCA+PSAyICYmIChuICUgMTAwIDwgMTAgfHwgbiAlIDEwMCA+PSAyMCkgPyAxIDogMik7XG4gIH0sXG4gIDE2OiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gJSAxMCA9PSAxICYmIG4gJSAxMDAgIT0gMTEgPyAwIDogbiAhPT0gMCA/IDEgOiAyKTtcbiAgfSxcbiAgMTc6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PSAxIHx8IG4gJSAxMCA9PSAxID8gMCA6IDEpO1xuICB9LFxuICAxODogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuID09IDAgPyAwIDogbiA9PSAxID8gMSA6IDIpO1xuICB9LFxuICAxOTogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuID09IDEgPyAwIDogbiA9PT0gMCB8fCBuICUgMTAwID4gMSAmJiBuICUgMTAwIDwgMTEgPyAxIDogbiAlIDEwMCA+IDEwICYmIG4gJSAxMDAgPCAyMCA/IDIgOiAzKTtcbiAgfSxcbiAgMjA6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PSAxID8gMCA6IG4gPT09IDAgfHwgbiAlIDEwMCA+IDAgJiYgbiAlIDEwMCA8IDIwID8gMSA6IDIpO1xuICB9LFxuICAyMTogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuICUgMTAwID09IDEgPyAxIDogbiAlIDEwMCA9PSAyID8gMiA6IG4gJSAxMDAgPT0gMyB8fCBuICUgMTAwID09IDQgPyAzIDogMCk7XG4gIH1cbn07XG4vKiBlc2xpbnQtZW5hYmxlICovXG5cbmZ1bmN0aW9uIGNyZWF0ZVJ1bGVzKCkge1xuICB2YXIgcnVsZXMgPSB7fTtcbiAgc2V0cy5mb3JFYWNoKGZ1bmN0aW9uIChzZXQkJDEpIHtcbiAgICBzZXQkJDEubG5ncy5mb3JFYWNoKGZ1bmN0aW9uIChsKSB7XG4gICAgICBydWxlc1tsXSA9IHtcbiAgICAgICAgbnVtYmVyczogc2V0JCQxLm5yLFxuICAgICAgICBwbHVyYWxzOiBfcnVsZXNQbHVyYWxzVHlwZXNbc2V0JCQxLmZjXVxuICAgICAgfTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBydWxlcztcbn1cblxudmFyIFBsdXJhbFJlc29sdmVyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBQbHVyYWxSZXNvbHZlcihsYW5ndWFnZVV0aWxzKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFBsdXJhbFJlc29sdmVyKTtcblxuICAgIHRoaXMubGFuZ3VhZ2VVdGlscyA9IGxhbmd1YWdlVXRpbHM7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMubG9nZ2VyID0gYmFzZUxvZ2dlci5jcmVhdGUoJ3BsdXJhbFJlc29sdmVyJyk7XG5cbiAgICB0aGlzLnJ1bGVzID0gY3JlYXRlUnVsZXMoKTtcbiAgfVxuXG4gIFBsdXJhbFJlc29sdmVyLnByb3RvdHlwZS5hZGRSdWxlID0gZnVuY3Rpb24gYWRkUnVsZShsbmcsIG9iaikge1xuICAgIHRoaXMucnVsZXNbbG5nXSA9IG9iajtcbiAgfTtcblxuICBQbHVyYWxSZXNvbHZlci5wcm90b3R5cGUuZ2V0UnVsZSA9IGZ1bmN0aW9uIGdldFJ1bGUoY29kZSkge1xuICAgIHJldHVybiB0aGlzLnJ1bGVzW3RoaXMubGFuZ3VhZ2VVdGlscy5nZXRMYW5ndWFnZVBhcnRGcm9tQ29kZShjb2RlKV07XG4gIH07XG5cbiAgUGx1cmFsUmVzb2x2ZXIucHJvdG90eXBlLm5lZWRzUGx1cmFsID0gZnVuY3Rpb24gbmVlZHNQbHVyYWwoY29kZSkge1xuICAgIHZhciBydWxlID0gdGhpcy5nZXRSdWxlKGNvZGUpO1xuXG4gICAgcmV0dXJuIHJ1bGUgJiYgcnVsZS5udW1iZXJzLmxlbmd0aCA+IDE7XG4gIH07XG5cbiAgUGx1cmFsUmVzb2x2ZXIucHJvdG90eXBlLmdldFN1ZmZpeCA9IGZ1bmN0aW9uIGdldFN1ZmZpeChjb2RlLCBjb3VudCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcnVsZSA9IHRoaXMuZ2V0UnVsZShjb2RlKTtcblxuICAgIGlmIChydWxlKSB7XG4gICAgICBpZiAocnVsZS5udW1iZXJzLmxlbmd0aCA9PT0gMSkgcmV0dXJuICcnOyAvLyBvbmx5IHNpbmd1bGFyXG5cbiAgICAgIHZhciBpZHggPSBydWxlLm5vQWJzID8gcnVsZS5wbHVyYWxzKGNvdW50KSA6IHJ1bGUucGx1cmFscyhNYXRoLmFicyhjb3VudCkpO1xuICAgICAgdmFyIHN1ZmZpeCA9IHJ1bGUubnVtYmVyc1tpZHhdO1xuXG4gICAgICAvLyBzcGVjaWFsIHRyZWF0bWVudCBmb3IgbG5ncyBvbmx5IGhhdmluZyBzaW5ndWxhciBhbmQgcGx1cmFsXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNpbXBsaWZ5UGx1cmFsU3VmZml4ICYmIHJ1bGUubnVtYmVycy5sZW5ndGggPT09IDIgJiYgcnVsZS5udW1iZXJzWzBdID09PSAxKSB7XG4gICAgICAgIGlmIChzdWZmaXggPT09IDIpIHtcbiAgICAgICAgICBzdWZmaXggPSAncGx1cmFsJztcbiAgICAgICAgfSBlbHNlIGlmIChzdWZmaXggPT09IDEpIHtcbiAgICAgICAgICBzdWZmaXggPSAnJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgcmV0dXJuU3VmZml4ID0gZnVuY3Rpb24gcmV0dXJuU3VmZml4KCkge1xuICAgICAgICByZXR1cm4gX3RoaXMub3B0aW9ucy5wcmVwZW5kICYmIHN1ZmZpeC50b1N0cmluZygpID8gX3RoaXMub3B0aW9ucy5wcmVwZW5kICsgc3VmZml4LnRvU3RyaW5nKCkgOiBzdWZmaXgudG9TdHJpbmcoKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIENPTVBBVElCSUxJVFkgSlNPTlxuICAgICAgLy8gdjFcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcGF0aWJpbGl0eUpTT04gPT09ICd2MScpIHtcbiAgICAgICAgaWYgKHN1ZmZpeCA9PT0gMSkgcmV0dXJuICcnO1xuICAgICAgICBpZiAodHlwZW9mIHN1ZmZpeCA9PT0gJ251bWJlcicpIHJldHVybiAnX3BsdXJhbF8nICsgc3VmZml4LnRvU3RyaW5nKCk7XG4gICAgICAgIHJldHVybiByZXR1cm5TdWZmaXgoKTtcbiAgICAgIH0gZWxzZSBpZiAoIC8qIHYyICovdGhpcy5vcHRpb25zLmNvbXBhdGliaWxpdHlKU09OID09PSAndjInIHx8IHJ1bGUubnVtYmVycy5sZW5ndGggPT09IDIgJiYgcnVsZS5udW1iZXJzWzBdID09PSAxKSB7XG4gICAgICAgIHJldHVybiByZXR1cm5TdWZmaXgoKTtcbiAgICAgIH0gZWxzZSBpZiAoIC8qIHYzIC0gZ2V0dGV4dCBpbmRleCAqL3J1bGUubnVtYmVycy5sZW5ndGggPT09IDIgJiYgcnVsZS5udW1iZXJzWzBdID09PSAxKSB7XG4gICAgICAgIHJldHVybiByZXR1cm5TdWZmaXgoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucHJlcGVuZCAmJiBpZHgudG9TdHJpbmcoKSA/IHRoaXMub3B0aW9ucy5wcmVwZW5kICsgaWR4LnRvU3RyaW5nKCkgOiBpZHgudG9TdHJpbmcoKTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ2dlci53YXJuKCdubyBwbHVyYWwgcnVsZSBmb3VuZCBmb3I6ICcgKyBjb2RlKTtcbiAgICByZXR1cm4gJyc7XG4gIH07XG5cbiAgcmV0dXJuIFBsdXJhbFJlc29sdmVyO1xufSgpO1xuXG52YXIgSW50ZXJwb2xhdG9yID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBJbnRlcnBvbGF0b3IoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIEludGVycG9sYXRvcik7XG5cbiAgICB0aGlzLmxvZ2dlciA9IGJhc2VMb2dnZXIuY3JlYXRlKCdpbnRlcnBvbGF0b3InKTtcblxuICAgIHRoaXMuaW5pdChvcHRpb25zLCB0cnVlKTtcbiAgfVxuXG4gIC8qIGVzbGludCBuby1wYXJhbS1yZWFzc2lnbjogMCAqL1xuXG5cbiAgSW50ZXJwb2xhdG9yLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gICAgdmFyIHJlc2V0ID0gYXJndW1lbnRzWzFdO1xuXG4gICAgaWYgKHJlc2V0KSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgdGhpcy5mb3JtYXQgPSBvcHRpb25zLmludGVycG9sYXRpb24gJiYgb3B0aW9ucy5pbnRlcnBvbGF0aW9uLmZvcm1hdCB8fCBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfTtcbiAgICAgIHRoaXMuZXNjYXBlID0gb3B0aW9ucy5pbnRlcnBvbGF0aW9uICYmIG9wdGlvbnMuaW50ZXJwb2xhdGlvbi5lc2NhcGUgfHwgZXNjYXBlO1xuICAgIH1cbiAgICBpZiAoIW9wdGlvbnMuaW50ZXJwb2xhdGlvbikgb3B0aW9ucy5pbnRlcnBvbGF0aW9uID0geyBlc2NhcGVWYWx1ZTogdHJ1ZSB9O1xuXG4gICAgdmFyIGlPcHRzID0gb3B0aW9ucy5pbnRlcnBvbGF0aW9uO1xuXG4gICAgdGhpcy5lc2NhcGVWYWx1ZSA9IGlPcHRzLmVzY2FwZVZhbHVlICE9PSB1bmRlZmluZWQgPyBpT3B0cy5lc2NhcGVWYWx1ZSA6IHRydWU7XG5cbiAgICB0aGlzLnByZWZpeCA9IGlPcHRzLnByZWZpeCA/IHJlZ2V4RXNjYXBlKGlPcHRzLnByZWZpeCkgOiBpT3B0cy5wcmVmaXhFc2NhcGVkIHx8ICd7eyc7XG4gICAgdGhpcy5zdWZmaXggPSBpT3B0cy5zdWZmaXggPyByZWdleEVzY2FwZShpT3B0cy5zdWZmaXgpIDogaU9wdHMuc3VmZml4RXNjYXBlZCB8fCAnfX0nO1xuXG4gICAgdGhpcy5mb3JtYXRTZXBhcmF0b3IgPSBpT3B0cy5mb3JtYXRTZXBhcmF0b3IgPyBpT3B0cy5mb3JtYXRTZXBhcmF0b3IgOiBpT3B0cy5mb3JtYXRTZXBhcmF0b3IgfHwgJywnO1xuXG4gICAgdGhpcy51bmVzY2FwZVByZWZpeCA9IGlPcHRzLnVuZXNjYXBlU3VmZml4ID8gJycgOiBpT3B0cy51bmVzY2FwZVByZWZpeCB8fCAnLSc7XG4gICAgdGhpcy51bmVzY2FwZVN1ZmZpeCA9IHRoaXMudW5lc2NhcGVQcmVmaXggPyAnJyA6IGlPcHRzLnVuZXNjYXBlU3VmZml4IHx8ICcnO1xuXG4gICAgdGhpcy5uZXN0aW5nUHJlZml4ID0gaU9wdHMubmVzdGluZ1ByZWZpeCA/IHJlZ2V4RXNjYXBlKGlPcHRzLm5lc3RpbmdQcmVmaXgpIDogaU9wdHMubmVzdGluZ1ByZWZpeEVzY2FwZWQgfHwgcmVnZXhFc2NhcGUoJyR0KCcpO1xuICAgIHRoaXMubmVzdGluZ1N1ZmZpeCA9IGlPcHRzLm5lc3RpbmdTdWZmaXggPyByZWdleEVzY2FwZShpT3B0cy5uZXN0aW5nU3VmZml4KSA6IGlPcHRzLm5lc3RpbmdTdWZmaXhFc2NhcGVkIHx8IHJlZ2V4RXNjYXBlKCcpJyk7XG5cbiAgICAvLyB0aGUgcmVnZXhwXG4gICAgdGhpcy5yZXNldFJlZ0V4cCgpO1xuICB9O1xuXG4gIEludGVycG9sYXRvci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiByZXNldCgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zKSB0aGlzLmluaXQodGhpcy5vcHRpb25zKTtcbiAgfTtcblxuICBJbnRlcnBvbGF0b3IucHJvdG90eXBlLnJlc2V0UmVnRXhwID0gZnVuY3Rpb24gcmVzZXRSZWdFeHAoKSB7XG4gICAgLy8gdGhlIHJlZ2V4cFxuICAgIHZhciByZWdleHBTdHIgPSB0aGlzLnByZWZpeCArICcoLis/KScgKyB0aGlzLnN1ZmZpeDtcbiAgICB0aGlzLnJlZ2V4cCA9IG5ldyBSZWdFeHAocmVnZXhwU3RyLCAnZycpO1xuXG4gICAgdmFyIHJlZ2V4cFVuZXNjYXBlU3RyID0gJycgKyB0aGlzLnByZWZpeCArIHRoaXMudW5lc2NhcGVQcmVmaXggKyAnKC4rPyknICsgdGhpcy51bmVzY2FwZVN1ZmZpeCArIHRoaXMuc3VmZml4O1xuICAgIHRoaXMucmVnZXhwVW5lc2NhcGUgPSBuZXcgUmVnRXhwKHJlZ2V4cFVuZXNjYXBlU3RyLCAnZycpO1xuXG4gICAgdmFyIG5lc3RpbmdSZWdleHBTdHIgPSB0aGlzLm5lc3RpbmdQcmVmaXggKyAnKC4rPyknICsgdGhpcy5uZXN0aW5nU3VmZml4O1xuICAgIHRoaXMubmVzdGluZ1JlZ2V4cCA9IG5ldyBSZWdFeHAobmVzdGluZ1JlZ2V4cFN0ciwgJ2cnKTtcbiAgfTtcblxuICBJbnRlcnBvbGF0b3IucHJvdG90eXBlLmludGVycG9sYXRlID0gZnVuY3Rpb24gaW50ZXJwb2xhdGUoc3RyLCBkYXRhLCBsbmcpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIG1hdGNoID0gdm9pZCAwO1xuICAgIHZhciB2YWx1ZSA9IHZvaWQgMDtcblxuICAgIGZ1bmN0aW9uIHJlZ2V4U2FmZSh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwucmVwbGFjZSgvXFwkL2csICckJCQkJyk7XG4gICAgfVxuXG4gICAgdmFyIGhhbmRsZUZvcm1hdCA9IGZ1bmN0aW9uIGhhbmRsZUZvcm1hdChrZXkpIHtcbiAgICAgIGlmIChrZXkuaW5kZXhPZihfdGhpcy5mb3JtYXRTZXBhcmF0b3IpIDwgMCkgcmV0dXJuIGdldFBhdGgoZGF0YSwga2V5KTtcblxuICAgICAgdmFyIHAgPSBrZXkuc3BsaXQoX3RoaXMuZm9ybWF0U2VwYXJhdG9yKTtcbiAgICAgIHZhciBrID0gcC5zaGlmdCgpLnRyaW0oKTtcbiAgICAgIHZhciBmID0gcC5qb2luKF90aGlzLmZvcm1hdFNlcGFyYXRvcikudHJpbSgpO1xuXG4gICAgICByZXR1cm4gX3RoaXMuZm9ybWF0KGdldFBhdGgoZGF0YSwgayksIGYsIGxuZyk7XG4gICAgfTtcblxuICAgIHRoaXMucmVzZXRSZWdFeHAoKTtcblxuICAgIC8vIHVuZXNjYXBlIGlmIGhhcyB1bmVzY2FwZVByZWZpeC9TdWZmaXhcbiAgICAvKiBlc2xpbnQgbm8tY29uZC1hc3NpZ246IDAgKi9cbiAgICB3aGlsZSAobWF0Y2ggPSB0aGlzLnJlZ2V4cFVuZXNjYXBlLmV4ZWMoc3RyKSkge1xuICAgICAgdmFsdWUgPSBoYW5kbGVGb3JtYXQobWF0Y2hbMV0udHJpbSgpKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG1hdGNoWzBdLCB2YWx1ZSk7XG4gICAgICB0aGlzLnJlZ2V4cFVuZXNjYXBlLmxhc3RJbmRleCA9IDA7XG4gICAgfVxuXG4gICAgLy8gcmVndWxhciBlc2NhcGUgb24gZGVtYW5kXG4gICAgd2hpbGUgKG1hdGNoID0gdGhpcy5yZWdleHAuZXhlYyhzdHIpKSB7XG4gICAgICB2YWx1ZSA9IGhhbmRsZUZvcm1hdChtYXRjaFsxXS50cmltKCkpO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHZhbHVlID0gbWFrZVN0cmluZyh2YWx1ZSk7XG4gICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLndhcm4oJ21pc3NlZCB0byBwYXNzIGluIHZhcmlhYmxlICcgKyBtYXRjaFsxXSArICcgZm9yIGludGVycG9sYXRpbmcgJyArIHN0cik7XG4gICAgICAgIHZhbHVlID0gJyc7XG4gICAgICB9XG4gICAgICB2YWx1ZSA9IHRoaXMuZXNjYXBlVmFsdWUgPyByZWdleFNhZmUodGhpcy5lc2NhcGUodmFsdWUpKSA6IHJlZ2V4U2FmZSh2YWx1ZSk7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZShtYXRjaFswXSwgdmFsdWUpO1xuICAgICAgdGhpcy5yZWdleHAubGFzdEluZGV4ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbiAgfTtcblxuICBJbnRlcnBvbGF0b3IucHJvdG90eXBlLm5lc3QgPSBmdW5jdGlvbiBuZXN0KHN0ciwgZmMpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cbiAgICB2YXIgbWF0Y2ggPSB2b2lkIDA7XG4gICAgdmFyIHZhbHVlID0gdm9pZCAwO1xuXG4gICAgdmFyIGNsb25lZE9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgb3B0aW9ucyk7XG4gICAgY2xvbmVkT3B0aW9ucy5hcHBseVBvc3RQcm9jZXNzb3IgPSBmYWxzZTsgLy8gYXZvaWQgcG9zdCBwcm9jZXNzaW5nIG9uIG5lc3RlZCBsb29rdXBcblxuICAgIC8vIGlmIHZhbHVlIGlzIHNvbWV0aGluZyBsaWtlIFwibXlLZXlcIjogXCJsb3JlbSAkKGFub3RoZXJLZXksIHsgXCJjb3VudFwiOiB7e2FWYWx1ZUluT3B0aW9uc319IH0pXCJcbiAgICBmdW5jdGlvbiBoYW5kbGVIYXNPcHRpb25zKGtleSkge1xuICAgICAgaWYgKGtleS5pbmRleE9mKCcsJykgPCAwKSByZXR1cm4ga2V5O1xuXG4gICAgICB2YXIgcCA9IGtleS5zcGxpdCgnLCcpO1xuICAgICAga2V5ID0gcC5zaGlmdCgpO1xuICAgICAgdmFyIG9wdGlvbnNTdHJpbmcgPSBwLmpvaW4oJywnKTtcbiAgICAgIG9wdGlvbnNTdHJpbmcgPSB0aGlzLmludGVycG9sYXRlKG9wdGlvbnNTdHJpbmcsIGNsb25lZE9wdGlvbnMpO1xuICAgICAgb3B0aW9uc1N0cmluZyA9IG9wdGlvbnNTdHJpbmcucmVwbGFjZSgvJy9nLCAnXCInKTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgY2xvbmVkT3B0aW9ucyA9IEpTT04ucGFyc2Uob3B0aW9uc1N0cmluZyk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmVycm9yKCdmYWlsZWQgcGFyc2luZyBvcHRpb25zIHN0cmluZyBpbiBuZXN0aW5nIGZvciBrZXkgJyArIGtleSwgZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuXG4gICAgLy8gcmVndWxhciBlc2NhcGUgb24gZGVtYW5kXG4gICAgd2hpbGUgKG1hdGNoID0gdGhpcy5uZXN0aW5nUmVnZXhwLmV4ZWMoc3RyKSkge1xuICAgICAgdmFsdWUgPSBmYyhoYW5kbGVIYXNPcHRpb25zLmNhbGwodGhpcywgbWF0Y2hbMV0udHJpbSgpKSwgY2xvbmVkT3B0aW9ucyk7XG5cbiAgICAgIC8vIGlzIG9ubHkgdGhlIG5lc3Rpbmcga2V5IChrZXkxID0gJyQoa2V5MiknKSByZXR1cm4gdGhlIHZhbHVlIHdpdGhvdXQgc3RyaW5naWZ5XG4gICAgICBpZiAodmFsdWUgJiYgbWF0Y2hbMF0gPT09IHN0ciAmJiB0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSByZXR1cm4gdmFsdWU7XG5cbiAgICAgIC8vIG5vIHN0cmluZyB0byBpbmNsdWRlIG9yIGVtcHR5XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykgdmFsdWUgPSBtYWtlU3RyaW5nKHZhbHVlKTtcbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIud2FybignbWlzc2VkIHRvIHJlc29sdmUgJyArIG1hdGNoWzFdICsgJyBmb3IgbmVzdGluZyAnICsgc3RyKTtcbiAgICAgICAgdmFsdWUgPSAnJztcbiAgICAgIH1cbiAgICAgIC8vIE5lc3RlZCBrZXlzIHNob3VsZCBub3QgYmUgZXNjYXBlZCBieSBkZWZhdWx0ICM4NTRcbiAgICAgIC8vIHZhbHVlID0gdGhpcy5lc2NhcGVWYWx1ZSA/IHJlZ2V4U2FmZSh1dGlscy5lc2NhcGUodmFsdWUpKSA6IHJlZ2V4U2FmZSh2YWx1ZSk7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZShtYXRjaFswXSwgdmFsdWUpO1xuICAgICAgdGhpcy5yZWdleHAubGFzdEluZGV4ID0gMDtcbiAgICB9XG4gICAgcmV0dXJuIHN0cjtcbiAgfTtcblxuICByZXR1cm4gSW50ZXJwb2xhdG9yO1xufSgpO1xuXG5mdW5jdGlvbiByZW1vdmUoYXJyLCB3aGF0KSB7XG4gIHZhciBmb3VuZCA9IGFyci5pbmRleE9mKHdoYXQpO1xuXG4gIHdoaWxlIChmb3VuZCAhPT0gLTEpIHtcbiAgICBhcnIuc3BsaWNlKGZvdW5kLCAxKTtcbiAgICBmb3VuZCA9IGFyci5pbmRleE9mKHdoYXQpO1xuICB9XG59XG5cbnZhciBDb25uZWN0b3IgPSBmdW5jdGlvbiAoX0V2ZW50RW1pdHRlcikge1xuICBpbmhlcml0cyhDb25uZWN0b3IsIF9FdmVudEVtaXR0ZXIpO1xuXG4gIGZ1bmN0aW9uIENvbm5lY3RvcihiYWNrZW5kLCBzdG9yZSwgc2VydmljZXMpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDoge307XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29ubmVjdG9yKTtcblxuICAgIHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0V2ZW50RW1pdHRlci5jYWxsKHRoaXMpKTtcblxuICAgIF90aGlzLmJhY2tlbmQgPSBiYWNrZW5kO1xuICAgIF90aGlzLnN0b3JlID0gc3RvcmU7XG4gICAgX3RoaXMuc2VydmljZXMgPSBzZXJ2aWNlcztcbiAgICBfdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICBfdGhpcy5sb2dnZXIgPSBiYXNlTG9nZ2VyLmNyZWF0ZSgnYmFja2VuZENvbm5lY3RvcicpO1xuXG4gICAgX3RoaXMuc3RhdGUgPSB7fTtcbiAgICBfdGhpcy5xdWV1ZSA9IFtdO1xuXG4gICAgaWYgKF90aGlzLmJhY2tlbmQgJiYgX3RoaXMuYmFja2VuZC5pbml0KSB7XG4gICAgICBfdGhpcy5iYWNrZW5kLmluaXQoc2VydmljZXMsIG9wdGlvbnMuYmFja2VuZCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIENvbm5lY3Rvci5wcm90b3R5cGUucXVldWVMb2FkID0gZnVuY3Rpb24gcXVldWVMb2FkKGxhbmd1YWdlcywgbmFtZXNwYWNlcywgY2FsbGJhY2spIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIC8vIGZpbmQgd2hhdCBuZWVkcyB0byBiZSBsb2FkZWRcbiAgICB2YXIgdG9Mb2FkID0gW107XG4gICAgdmFyIHBlbmRpbmcgPSBbXTtcbiAgICB2YXIgdG9Mb2FkTGFuZ3VhZ2VzID0gW107XG4gICAgdmFyIHRvTG9hZE5hbWVzcGFjZXMgPSBbXTtcblxuICAgIGxhbmd1YWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChsbmcpIHtcbiAgICAgIHZhciBoYXNBbGxOYW1lc3BhY2VzID0gdHJ1ZTtcblxuICAgICAgbmFtZXNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChucykge1xuICAgICAgICB2YXIgbmFtZSA9IGxuZyArICd8JyArIG5zO1xuXG4gICAgICAgIGlmIChfdGhpczIuc3RvcmUuaGFzUmVzb3VyY2VCdW5kbGUobG5nLCBucykpIHtcbiAgICAgICAgICBfdGhpczIuc3RhdGVbbmFtZV0gPSAyOyAvLyBsb2FkZWRcbiAgICAgICAgfSBlbHNlIGlmIChfdGhpczIuc3RhdGVbbmFtZV0gPCAwKSB7XG4gICAgICAgICAgLy8gbm90aGluZyB0byBkbyBmb3IgZXJyXG4gICAgICAgIH0gZWxzZSBpZiAoX3RoaXMyLnN0YXRlW25hbWVdID09PSAxKSB7XG4gICAgICAgICAgaWYgKHBlbmRpbmcuaW5kZXhPZihuYW1lKSA8IDApIHBlbmRpbmcucHVzaChuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpczIuc3RhdGVbbmFtZV0gPSAxOyAvLyBwZW5kaW5nXG5cbiAgICAgICAgICBoYXNBbGxOYW1lc3BhY2VzID0gZmFsc2U7XG5cbiAgICAgICAgICBpZiAocGVuZGluZy5pbmRleE9mKG5hbWUpIDwgMCkgcGVuZGluZy5wdXNoKG5hbWUpO1xuICAgICAgICAgIGlmICh0b0xvYWQuaW5kZXhPZihuYW1lKSA8IDApIHRvTG9hZC5wdXNoKG5hbWUpO1xuICAgICAgICAgIGlmICh0b0xvYWROYW1lc3BhY2VzLmluZGV4T2YobnMpIDwgMCkgdG9Mb2FkTmFtZXNwYWNlcy5wdXNoKG5zKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghaGFzQWxsTmFtZXNwYWNlcykgdG9Mb2FkTGFuZ3VhZ2VzLnB1c2gobG5nKTtcbiAgICB9KTtcblxuICAgIGlmICh0b0xvYWQubGVuZ3RoIHx8IHBlbmRpbmcubGVuZ3RoKSB7XG4gICAgICB0aGlzLnF1ZXVlLnB1c2goe1xuICAgICAgICBwZW5kaW5nOiBwZW5kaW5nLFxuICAgICAgICBsb2FkZWQ6IHt9LFxuICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0b0xvYWQ6IHRvTG9hZCxcbiAgICAgIHBlbmRpbmc6IHBlbmRpbmcsXG4gICAgICB0b0xvYWRMYW5ndWFnZXM6IHRvTG9hZExhbmd1YWdlcyxcbiAgICAgIHRvTG9hZE5hbWVzcGFjZXM6IHRvTG9hZE5hbWVzcGFjZXNcbiAgICB9O1xuICB9O1xuXG4gIENvbm5lY3Rvci5wcm90b3R5cGUubG9hZGVkID0gZnVuY3Rpb24gbG9hZGVkKG5hbWUsIGVyciwgZGF0YSkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgdmFyIF9uYW1lJHNwbGl0ID0gbmFtZS5zcGxpdCgnfCcpLFxuICAgICAgICBfbmFtZSRzcGxpdDIgPSBzbGljZWRUb0FycmF5KF9uYW1lJHNwbGl0LCAyKSxcbiAgICAgICAgbG5nID0gX25hbWUkc3BsaXQyWzBdLFxuICAgICAgICBucyA9IF9uYW1lJHNwbGl0MlsxXTtcblxuICAgIGlmIChlcnIpIHRoaXMuZW1pdCgnZmFpbGVkTG9hZGluZycsIGxuZywgbnMsIGVycik7XG5cbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5zdG9yZS5hZGRSZXNvdXJjZUJ1bmRsZShsbmcsIG5zLCBkYXRhKTtcbiAgICB9XG5cbiAgICAvLyBzZXQgbG9hZGVkXG4gICAgdGhpcy5zdGF0ZVtuYW1lXSA9IGVyciA/IC0xIDogMjtcblxuICAgIC8vIGNhbGxiYWNrIGlmIHJlYWR5XG4gICAgdGhpcy5xdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uIChxKSB7XG4gICAgICBwdXNoUGF0aChxLmxvYWRlZCwgW2xuZ10sIG5zKTtcbiAgICAgIHJlbW92ZShxLnBlbmRpbmcsIG5hbWUpO1xuXG4gICAgICBpZiAoZXJyKSBxLmVycm9ycy5wdXNoKGVycik7XG5cbiAgICAgIGlmIChxLnBlbmRpbmcubGVuZ3RoID09PSAwICYmICFxLmRvbmUpIHtcbiAgICAgICAgX3RoaXMzLmVtaXQoJ2xvYWRlZCcsIHEubG9hZGVkKTtcbiAgICAgICAgLyogZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOiAwICovXG4gICAgICAgIHEuZG9uZSA9IHRydWU7XG4gICAgICAgIGlmIChxLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBxLmNhbGxiYWNrKHEuZXJyb3JzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBxLmNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIHJlbW92ZSBkb25lIGxvYWQgcmVxdWVzdHNcbiAgICB0aGlzLnF1ZXVlID0gdGhpcy5xdWV1ZS5maWx0ZXIoZnVuY3Rpb24gKHEpIHtcbiAgICAgIHJldHVybiAhcS5kb25lO1xuICAgIH0pO1xuICB9O1xuXG4gIENvbm5lY3Rvci5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uIHJlYWQobG5nLCBucywgZmNOYW1lKSB7XG4gICAgdmFyIHRyaWVkID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAwO1xuXG4gICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICB2YXIgd2FpdCA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogMjUwO1xuICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1s1XTtcblxuICAgIGlmICghbG5nLmxlbmd0aCkgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHt9KTsgLy8gbm90aW5nIHRvIGxvYWRcblxuICAgIHJldHVybiB0aGlzLmJhY2tlbmRbZmNOYW1lXShsbmcsIG5zLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICBpZiAoZXJyICYmIGRhdGEgLyogPSByZXRyeUZsYWcgKi8gJiYgdHJpZWQgPCA1KSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzNC5yZWFkLmNhbGwoX3RoaXM0LCBsbmcsIG5zLCBmY05hbWUsIHRyaWVkICsgMSwgd2FpdCAqIDIsIGNhbGxiYWNrKTtcbiAgICAgICAgfSwgd2FpdCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyogZXNsaW50IGNvbnNpc3RlbnQtcmV0dXJuOiAwICovXG5cblxuICBDb25uZWN0b3IucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiBsb2FkKGxhbmd1YWdlcywgbmFtZXNwYWNlcywgY2FsbGJhY2spIHtcbiAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgIGlmICghdGhpcy5iYWNrZW5kKSB7XG4gICAgICB0aGlzLmxvZ2dlci53YXJuKCdObyBiYWNrZW5kIHdhcyBhZGRlZCB2aWEgaTE4bmV4dC51c2UuIFdpbGwgbm90IGxvYWQgcmVzb3VyY2VzLicpO1xuICAgICAgcmV0dXJuIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgfVxuICAgIHZhciBvcHRpb25zID0gX2V4dGVuZHMoe30sIHRoaXMuYmFja2VuZC5vcHRpb25zLCB0aGlzLm9wdGlvbnMuYmFja2VuZCk7XG5cbiAgICBpZiAodHlwZW9mIGxhbmd1YWdlcyA9PT0gJ3N0cmluZycpIGxhbmd1YWdlcyA9IHRoaXMuc2VydmljZXMubGFuZ3VhZ2VVdGlscy50b1Jlc29sdmVIaWVyYXJjaHkobGFuZ3VhZ2VzKTtcbiAgICBpZiAodHlwZW9mIG5hbWVzcGFjZXMgPT09ICdzdHJpbmcnKSBuYW1lc3BhY2VzID0gW25hbWVzcGFjZXNdO1xuXG4gICAgdmFyIHRvTG9hZCA9IHRoaXMucXVldWVMb2FkKGxhbmd1YWdlcywgbmFtZXNwYWNlcywgY2FsbGJhY2spO1xuICAgIGlmICghdG9Mb2FkLnRvTG9hZC5sZW5ndGgpIHtcbiAgICAgIGlmICghdG9Mb2FkLnBlbmRpbmcubGVuZ3RoKSBjYWxsYmFjaygpOyAvLyBub3RoaW5nIHRvIGxvYWQgYW5kIG5vIHBlbmRpbmdzLi4uY2FsbGJhY2sgbm93XG4gICAgICByZXR1cm4gbnVsbDsgLy8gcGVuZGluZ3Mgd2lsbCB0cmlnZ2VyIGNhbGxiYWNrXG4gICAgfVxuXG4gICAgLy8gbG9hZCB3aXRoIG11bHRpLWxvYWRcbiAgICBpZiAob3B0aW9ucy5hbGxvd011bHRpTG9hZGluZyAmJiB0aGlzLmJhY2tlbmQucmVhZE11bHRpKSB7XG4gICAgICB0aGlzLnJlYWQodG9Mb2FkLnRvTG9hZExhbmd1YWdlcywgdG9Mb2FkLnRvTG9hZE5hbWVzcGFjZXMsICdyZWFkTXVsdGknLCBudWxsLCBudWxsLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmIChlcnIpIF90aGlzNS5sb2dnZXIud2FybignbG9hZGluZyBuYW1lc3BhY2VzICcgKyB0b0xvYWQudG9Mb2FkTmFtZXNwYWNlcy5qb2luKCcsICcpICsgJyBmb3IgbGFuZ3VhZ2VzICcgKyB0b0xvYWQudG9Mb2FkTGFuZ3VhZ2VzLmpvaW4oJywgJykgKyAnIHZpYSBtdWx0aWxvYWRpbmcgZmFpbGVkJywgZXJyKTtcbiAgICAgICAgaWYgKCFlcnIgJiYgZGF0YSkgX3RoaXM1LmxvZ2dlci5sb2coJ3N1Y2Nlc3NmdWxseSBsb2FkZWQgbmFtZXNwYWNlcyAnICsgdG9Mb2FkLnRvTG9hZE5hbWVzcGFjZXMuam9pbignLCAnKSArICcgZm9yIGxhbmd1YWdlcyAnICsgdG9Mb2FkLnRvTG9hZExhbmd1YWdlcy5qb2luKCcsICcpICsgJyB2aWEgbXVsdGlsb2FkaW5nJywgZGF0YSk7XG5cbiAgICAgICAgdG9Mb2FkLnRvTG9hZC5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgdmFyIF9uYW1lJHNwbGl0MyA9IG5hbWUuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgICAgX25hbWUkc3BsaXQ0ID0gc2xpY2VkVG9BcnJheShfbmFtZSRzcGxpdDMsIDIpLFxuICAgICAgICAgICAgICBsID0gX25hbWUkc3BsaXQ0WzBdLFxuICAgICAgICAgICAgICBuID0gX25hbWUkc3BsaXQ0WzFdO1xuXG4gICAgICAgICAgdmFyIGJ1bmRsZSA9IGdldFBhdGgoZGF0YSwgW2wsIG5dKTtcbiAgICAgICAgICBpZiAoYnVuZGxlKSB7XG4gICAgICAgICAgICBfdGhpczUubG9hZGVkKG5hbWUsIGVyciwgYnVuZGxlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGVycm9yID0gJ2xvYWRpbmcgbmFtZXNwYWNlICcgKyBuICsgJyBmb3IgbGFuZ3VhZ2UgJyArIGwgKyAnIHZpYSBtdWx0aWxvYWRpbmcgZmFpbGVkJztcbiAgICAgICAgICAgIF90aGlzNS5sb2FkZWQobmFtZSwgZXJyb3IpO1xuICAgICAgICAgICAgX3RoaXM1LmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b0xvYWQudG9Mb2FkLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgX3RoaXM1LmxvYWRPbmUobmFtZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgQ29ubmVjdG9yLnByb3RvdHlwZS5yZWxvYWQgPSBmdW5jdGlvbiByZWxvYWQobGFuZ3VhZ2VzLCBuYW1lc3BhY2VzKSB7XG4gICAgdmFyIF90aGlzNiA9IHRoaXM7XG5cbiAgICBpZiAoIXRoaXMuYmFja2VuZCkge1xuICAgICAgdGhpcy5sb2dnZXIud2FybignTm8gYmFja2VuZCB3YXMgYWRkZWQgdmlhIGkxOG5leHQudXNlLiBXaWxsIG5vdCBsb2FkIHJlc291cmNlcy4nKTtcbiAgICB9XG4gICAgdmFyIG9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgdGhpcy5iYWNrZW5kLm9wdGlvbnMsIHRoaXMub3B0aW9ucy5iYWNrZW5kKTtcblxuICAgIGlmICh0eXBlb2YgbGFuZ3VhZ2VzID09PSAnc3RyaW5nJykgbGFuZ3VhZ2VzID0gdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZVV0aWxzLnRvUmVzb2x2ZUhpZXJhcmNoeShsYW5ndWFnZXMpO1xuICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlcyA9PT0gJ3N0cmluZycpIG5hbWVzcGFjZXMgPSBbbmFtZXNwYWNlc107XG5cbiAgICAvLyBsb2FkIHdpdGggbXVsdGktbG9hZFxuICAgIGlmIChvcHRpb25zLmFsbG93TXVsdGlMb2FkaW5nICYmIHRoaXMuYmFja2VuZC5yZWFkTXVsdGkpIHtcbiAgICAgIHRoaXMucmVhZChsYW5ndWFnZXMsIG5hbWVzcGFjZXMsICdyZWFkTXVsdGknLCBudWxsLCBudWxsLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmIChlcnIpIF90aGlzNi5sb2dnZXIud2FybigncmVsb2FkaW5nIG5hbWVzcGFjZXMgJyArIG5hbWVzcGFjZXMuam9pbignLCAnKSArICcgZm9yIGxhbmd1YWdlcyAnICsgbGFuZ3VhZ2VzLmpvaW4oJywgJykgKyAnIHZpYSBtdWx0aWxvYWRpbmcgZmFpbGVkJywgZXJyKTtcbiAgICAgICAgaWYgKCFlcnIgJiYgZGF0YSkgX3RoaXM2LmxvZ2dlci5sb2coJ3N1Y2Nlc3NmdWxseSByZWxvYWRlZCBuYW1lc3BhY2VzICcgKyBuYW1lc3BhY2VzLmpvaW4oJywgJykgKyAnIGZvciBsYW5ndWFnZXMgJyArIGxhbmd1YWdlcy5qb2luKCcsICcpICsgJyB2aWEgbXVsdGlsb2FkaW5nJywgZGF0YSk7XG5cbiAgICAgICAgbGFuZ3VhZ2VzLmZvckVhY2goZnVuY3Rpb24gKGwpIHtcbiAgICAgICAgICBuYW1lc3BhY2VzLmZvckVhY2goZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgICAgIHZhciBidW5kbGUgPSBnZXRQYXRoKGRhdGEsIFtsLCBuXSk7XG4gICAgICAgICAgICBpZiAoYnVuZGxlKSB7XG4gICAgICAgICAgICAgIF90aGlzNi5sb2FkZWQobCArICd8JyArIG4sIGVyciwgYnVuZGxlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciBlcnJvciA9ICdyZWxvYWRpbmcgbmFtZXNwYWNlICcgKyBuICsgJyBmb3IgbGFuZ3VhZ2UgJyArIGwgKyAnIHZpYSBtdWx0aWxvYWRpbmcgZmFpbGVkJztcbiAgICAgICAgICAgICAgX3RoaXM2LmxvYWRlZChsICsgJ3wnICsgbiwgZXJyb3IpO1xuICAgICAgICAgICAgICBfdGhpczYubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFuZ3VhZ2VzLmZvckVhY2goZnVuY3Rpb24gKGwpIHtcbiAgICAgICAgbmFtZXNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgICAgX3RoaXM2LmxvYWRPbmUobCArICd8JyArIG4sICdyZScpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBDb25uZWN0b3IucHJvdG90eXBlLmxvYWRPbmUgPSBmdW5jdGlvbiBsb2FkT25lKG5hbWUpIHtcbiAgICB2YXIgX3RoaXM3ID0gdGhpcztcblxuICAgIHZhciBwcmVmaXggPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICcnO1xuXG4gICAgdmFyIF9uYW1lJHNwbGl0NSA9IG5hbWUuc3BsaXQoJ3wnKSxcbiAgICAgICAgX25hbWUkc3BsaXQ2ID0gc2xpY2VkVG9BcnJheShfbmFtZSRzcGxpdDUsIDIpLFxuICAgICAgICBsbmcgPSBfbmFtZSRzcGxpdDZbMF0sXG4gICAgICAgIG5zID0gX25hbWUkc3BsaXQ2WzFdO1xuXG4gICAgdGhpcy5yZWFkKGxuZywgbnMsICdyZWFkJywgbnVsbCwgbnVsbCwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgaWYgKGVycikgX3RoaXM3LmxvZ2dlci53YXJuKHByZWZpeCArICdsb2FkaW5nIG5hbWVzcGFjZSAnICsgbnMgKyAnIGZvciBsYW5ndWFnZSAnICsgbG5nICsgJyBmYWlsZWQnLCBlcnIpO1xuICAgICAgaWYgKCFlcnIgJiYgZGF0YSkgX3RoaXM3LmxvZ2dlci5sb2cocHJlZml4ICsgJ2xvYWRlZCBuYW1lc3BhY2UgJyArIG5zICsgJyBmb3IgbGFuZ3VhZ2UgJyArIGxuZywgZGF0YSk7XG5cbiAgICAgIF90aGlzNy5sb2FkZWQobmFtZSwgZXJyLCBkYXRhKTtcbiAgICB9KTtcbiAgfTtcblxuICBDb25uZWN0b3IucHJvdG90eXBlLnNhdmVNaXNzaW5nID0gZnVuY3Rpb24gc2F2ZU1pc3NpbmcobGFuZ3VhZ2VzLCBuYW1lc3BhY2UsIGtleSwgZmFsbGJhY2tWYWx1ZSkge1xuICAgIGlmICh0aGlzLmJhY2tlbmQgJiYgdGhpcy5iYWNrZW5kLmNyZWF0ZSkgdGhpcy5iYWNrZW5kLmNyZWF0ZShsYW5ndWFnZXMsIG5hbWVzcGFjZSwga2V5LCBmYWxsYmFja1ZhbHVlKTtcblxuICAgIC8vIHdyaXRlIHRvIHN0b3JlIHRvIGF2b2lkIHJlc2VuZGluZ1xuICAgIGlmICghbGFuZ3VhZ2VzIHx8ICFsYW5ndWFnZXNbMF0pIHJldHVybjtcbiAgICB0aGlzLnN0b3JlLmFkZFJlc291cmNlKGxhbmd1YWdlc1swXSwgbmFtZXNwYWNlLCBrZXksIGZhbGxiYWNrVmFsdWUpO1xuICB9O1xuXG4gIHJldHVybiBDb25uZWN0b3I7XG59KEV2ZW50RW1pdHRlcik7XG5cbnZhciBDb25uZWN0b3IkMSA9IGZ1bmN0aW9uIChfRXZlbnRFbWl0dGVyKSB7XG4gIGluaGVyaXRzKENvbm5lY3RvciwgX0V2ZW50RW1pdHRlcik7XG5cbiAgZnVuY3Rpb24gQ29ubmVjdG9yKGNhY2hlLCBzdG9yZSwgc2VydmljZXMpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDoge307XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgQ29ubmVjdG9yKTtcblxuICAgIHZhciBfdGhpcyA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX0V2ZW50RW1pdHRlci5jYWxsKHRoaXMpKTtcblxuICAgIF90aGlzLmNhY2hlID0gY2FjaGU7XG4gICAgX3RoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICBfdGhpcy5zZXJ2aWNlcyA9IHNlcnZpY2VzO1xuICAgIF90aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIF90aGlzLmxvZ2dlciA9IGJhc2VMb2dnZXIuY3JlYXRlKCdjYWNoZUNvbm5lY3RvcicpO1xuXG4gICAgaWYgKF90aGlzLmNhY2hlICYmIF90aGlzLmNhY2hlLmluaXQpIF90aGlzLmNhY2hlLmluaXQoc2VydmljZXMsIG9wdGlvbnMuY2FjaGUsIG9wdGlvbnMpO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIC8qIGVzbGludCBjb25zaXN0ZW50LXJldHVybjogMCAqL1xuXG5cbiAgQ29ubmVjdG9yLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gbG9hZChsYW5ndWFnZXMsIG5hbWVzcGFjZXMsIGNhbGxiYWNrKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICBpZiAoIXRoaXMuY2FjaGUpIHJldHVybiBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuICAgIHZhciBvcHRpb25zID0gX2V4dGVuZHMoe30sIHRoaXMuY2FjaGUub3B0aW9ucywgdGhpcy5vcHRpb25zLmNhY2hlKTtcblxuICAgIHZhciBsb2FkTG5ncyA9IHR5cGVvZiBsYW5ndWFnZXMgPT09ICdzdHJpbmcnID8gdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZVV0aWxzLnRvUmVzb2x2ZUhpZXJhcmNoeShsYW5ndWFnZXMpIDogbGFuZ3VhZ2VzO1xuXG4gICAgaWYgKG9wdGlvbnMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5jYWNoZS5sb2FkKGxvYWRMbmdzLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmIChlcnIpIF90aGlzMi5sb2dnZXIuZXJyb3IoJ2xvYWRpbmcgbGFuZ3VhZ2VzICcgKyBsb2FkTG5ncy5qb2luKCcsICcpICsgJyBmcm9tIGNhY2hlIGZhaWxlZCcsIGVycik7XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgLyogZXNsaW50IG5vLXJlc3RyaWN0ZWQtc3ludGF4OiAwICovXG4gICAgICAgICAgZm9yICh2YXIgbCBpbiBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGwpKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIG4gaW4gZGF0YVtsXSkge1xuICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGF0YVtsXSwgbikpIHtcbiAgICAgICAgICAgICAgICAgIGlmIChuICE9PSAnaTE4blN0YW1wJykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYnVuZGxlID0gZGF0YVtsXVtuXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJ1bmRsZSkgX3RoaXMyLnN0b3JlLmFkZFJlc291cmNlQnVuZGxlKGwsIG4sIGJ1bmRsZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9O1xuXG4gIENvbm5lY3Rvci5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uIHNhdmUoKSB7XG4gICAgaWYgKHRoaXMuY2FjaGUgJiYgdGhpcy5vcHRpb25zLmNhY2hlICYmIHRoaXMub3B0aW9ucy5jYWNoZS5lbmFibGVkKSB0aGlzLmNhY2hlLnNhdmUodGhpcy5zdG9yZS5kYXRhKTtcbiAgfTtcblxuICByZXR1cm4gQ29ubmVjdG9yO1xufShFdmVudEVtaXR0ZXIpO1xuXG5mdW5jdGlvbiBnZXQkMSgpIHtcbiAgcmV0dXJuIHtcbiAgICBkZWJ1ZzogZmFsc2UsXG4gICAgaW5pdEltbWVkaWF0ZTogdHJ1ZSxcblxuICAgIG5zOiBbJ3RyYW5zbGF0aW9uJ10sXG4gICAgZGVmYXVsdE5TOiBbJ3RyYW5zbGF0aW9uJ10sXG4gICAgZmFsbGJhY2tMbmc6IFsnZGV2J10sXG4gICAgZmFsbGJhY2tOUzogZmFsc2UsIC8vIHN0cmluZyBvciBhcnJheSBvZiBuYW1lc3BhY2VzXG5cbiAgICB3aGl0ZWxpc3Q6IGZhbHNlLCAvLyBhcnJheSB3aXRoIHdoaXRlbGlzdGVkIGxhbmd1YWdlc1xuICAgIG5vbkV4cGxpY2l0V2hpdGVsaXN0OiBmYWxzZSxcbiAgICBsb2FkOiAnYWxsJywgLy8gfCBjdXJyZW50T25seSB8IGxhbmd1YWdlT25seVxuICAgIHByZWxvYWQ6IGZhbHNlLCAvLyBhcnJheSB3aXRoIHByZWxvYWQgbGFuZ3VhZ2VzXG5cbiAgICBzaW1wbGlmeVBsdXJhbFN1ZmZpeDogdHJ1ZSxcbiAgICBrZXlTZXBhcmF0b3I6ICcuJyxcbiAgICBuc1NlcGFyYXRvcjogJzonLFxuICAgIHBsdXJhbFNlcGFyYXRvcjogJ18nLFxuICAgIGNvbnRleHRTZXBhcmF0b3I6ICdfJyxcblxuICAgIHNhdmVNaXNzaW5nOiBmYWxzZSwgLy8gZW5hYmxlIHRvIHNlbmQgbWlzc2luZyB2YWx1ZXNcbiAgICBzYXZlTWlzc2luZ1RvOiAnZmFsbGJhY2snLCAvLyAnY3VycmVudCcgfHwgJ2FsbCdcbiAgICBtaXNzaW5nS2V5SGFuZGxlcjogZmFsc2UsIC8vIGZ1bmN0aW9uKGxuZywgbnMsIGtleSwgZmFsbGJhY2tWYWx1ZSkgLT4gb3ZlcnJpZGUgaWYgcHJlZmVyIG9uIGhhbmRsaW5nXG5cbiAgICBwb3N0UHJvY2VzczogZmFsc2UsIC8vIHN0cmluZyBvciBhcnJheSBvZiBwb3N0UHJvY2Vzc29yIG5hbWVzXG4gICAgcmV0dXJuTnVsbDogdHJ1ZSwgLy8gYWxsb3dzIG51bGwgdmFsdWUgYXMgdmFsaWQgdHJhbnNsYXRpb25cbiAgICByZXR1cm5FbXB0eVN0cmluZzogdHJ1ZSwgLy8gYWxsb3dzIGVtcHR5IHN0cmluZyB2YWx1ZSBhcyB2YWxpZCB0cmFuc2xhdGlvblxuICAgIHJldHVybk9iamVjdHM6IGZhbHNlLFxuICAgIGpvaW5BcnJheXM6IGZhbHNlLCAvLyBvciBzdHJpbmcgdG8gam9pbiBhcnJheVxuICAgIHJldHVybmVkT2JqZWN0SGFuZGxlcjogZnVuY3Rpb24gcmV0dXJuZWRPYmplY3RIYW5kbGVyKCkge30sIC8vIGZ1bmN0aW9uKGtleSwgdmFsdWUsIG9wdGlvbnMpIHRyaWdnZXJlZCBpZiBrZXkgcmV0dXJucyBvYmplY3QgYnV0IHJldHVybk9iamVjdHMgaXMgc2V0IHRvIGZhbHNlXG4gICAgcGFyc2VNaXNzaW5nS2V5SGFuZGxlcjogZmFsc2UsIC8vIGZ1bmN0aW9uKGtleSkgcGFyc2VkIGEga2V5IHRoYXQgd2FzIG5vdCBmb3VuZCBpbiB0KCkgYmVmb3JlIHJldHVybmluZ1xuICAgIGFwcGVuZE5hbWVzcGFjZVRvTWlzc2luZ0tleTogZmFsc2UsXG4gICAgYXBwZW5kTmFtZXNwYWNlVG9DSU1vZGU6IGZhbHNlLFxuICAgIG92ZXJsb2FkVHJhbnNsYXRpb25PcHRpb25IYW5kbGVyOiBmdW5jdGlvbiBoYW5kbGUoYXJncykge1xuICAgICAgcmV0dXJuIHsgZGVmYXVsdFZhbHVlOiBhcmdzWzFdIH07XG4gICAgfSxcblxuICAgIGludGVycG9sYXRpb246IHtcbiAgICAgIGVzY2FwZVZhbHVlOiB0cnVlLFxuICAgICAgZm9ybWF0OiBmdW5jdGlvbiBmb3JtYXQodmFsdWUsIF9mb3JtYXQsIGxuZykge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9LFxuICAgICAgcHJlZml4OiAne3snLFxuICAgICAgc3VmZml4OiAnfX0nLFxuICAgICAgZm9ybWF0U2VwYXJhdG9yOiAnLCcsXG4gICAgICAvLyBwcmVmaXhFc2NhcGVkOiAne3snLFxuICAgICAgLy8gc3VmZml4RXNjYXBlZDogJ319JyxcbiAgICAgIC8vIHVuZXNjYXBlU3VmZml4OiAnJyxcbiAgICAgIHVuZXNjYXBlUHJlZml4OiAnLScsXG5cbiAgICAgIG5lc3RpbmdQcmVmaXg6ICckdCgnLFxuICAgICAgbmVzdGluZ1N1ZmZpeDogJyknLFxuICAgICAgLy8gbmVzdGluZ1ByZWZpeEVzY2FwZWQ6ICckdCgnLFxuICAgICAgLy8gbmVzdGluZ1N1ZmZpeEVzY2FwZWQ6ICcpJyxcbiAgICAgIGRlZmF1bHRWYXJpYWJsZXM6IHVuZGVmaW5lZCAvLyBvYmplY3QgdGhhdCBjYW4gaGF2ZSB2YWx1ZXMgdG8gaW50ZXJwb2xhdGUgb24gLSBleHRlbmRzIHBhc3NlZCBpbiBpbnRlcnBvbGF0aW9uIGRhdGFcbiAgICB9XG4gIH07XG59XG5cbi8qIGVzbGludCBuby1wYXJhbS1yZWFzc2lnbjogMCAqL1xuZnVuY3Rpb24gdHJhbnNmb3JtT3B0aW9ucyhvcHRpb25zKSB7XG4gIC8vIGNyZWF0ZSBuYW1lc3BhY2Ugb2JqZWN0IGlmIG5hbWVzcGFjZSBpcyBwYXNzZWQgaW4gYXMgc3RyaW5nXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5ucyA9PT0gJ3N0cmluZycpIG9wdGlvbnMubnMgPSBbb3B0aW9ucy5uc107XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5mYWxsYmFja0xuZyA9PT0gJ3N0cmluZycpIG9wdGlvbnMuZmFsbGJhY2tMbmcgPSBbb3B0aW9ucy5mYWxsYmFja0xuZ107XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5mYWxsYmFja05TID09PSAnc3RyaW5nJykgb3B0aW9ucy5mYWxsYmFja05TID0gW29wdGlvbnMuZmFsbGJhY2tOU107XG5cbiAgLy8gZXh0ZW5kIHdoaXRlbGlzdCB3aXRoIGNpbW9kZVxuICBpZiAob3B0aW9ucy53aGl0ZWxpc3QgJiYgb3B0aW9ucy53aGl0ZWxpc3QuaW5kZXhPZignY2ltb2RlJykgPCAwKSBvcHRpb25zLndoaXRlbGlzdC5wdXNoKCdjaW1vZGUnKTtcblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnZhciBJMThuID0gZnVuY3Rpb24gKF9FdmVudEVtaXR0ZXIpIHtcbiAgaW5oZXJpdHMoSTE4biwgX0V2ZW50RW1pdHRlcik7XG5cbiAgZnVuY3Rpb24gSTE4bigpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzWzFdO1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIEkxOG4pO1xuXG4gICAgdmFyIF90aGlzID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfRXZlbnRFbWl0dGVyLmNhbGwodGhpcykpO1xuXG4gICAgX3RoaXMub3B0aW9ucyA9IHRyYW5zZm9ybU9wdGlvbnMob3B0aW9ucyk7XG4gICAgX3RoaXMuc2VydmljZXMgPSB7fTtcbiAgICBfdGhpcy5sb2dnZXIgPSBiYXNlTG9nZ2VyO1xuICAgIF90aGlzLm1vZHVsZXMgPSB7IGV4dGVybmFsOiBbXSB9O1xuXG4gICAgaWYgKGNhbGxiYWNrICYmICFfdGhpcy5pc0luaXRpYWxpemVkICYmICFvcHRpb25zLmlzQ2xvbmUpIHtcbiAgICAgIHZhciBfcmV0O1xuXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaTE4bmV4dC9pMThuZXh0L2lzc3Vlcy84NzlcbiAgICAgIGlmICghX3RoaXMub3B0aW9ucy5pbml0SW1tZWRpYXRlKSByZXR1cm4gX3JldCA9IF90aGlzLmluaXQob3B0aW9ucywgY2FsbGJhY2spLCBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKF90aGlzLCBfcmV0KTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5pbml0KG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBJMThuLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gaW5pdChvcHRpb25zLCBjYWxsYmFjaykge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gICAgaWYgKG9wdGlvbnMuY29tcGF0aWJpbGl0eUFQSSA9PT0gJ3YxJykge1xuICAgICAgdGhpcy5vcHRpb25zID0gX2V4dGVuZHMoe30sIGdldCQxKCksIHRyYW5zZm9ybU9wdGlvbnMoY29udmVydEFQSU9wdGlvbnMob3B0aW9ucykpLCB7fSk7XG4gICAgfSBlbHNlIGlmIChvcHRpb25zLmNvbXBhdGliaWxpdHlKU09OID09PSAndjEnKSB7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgZ2V0JDEoKSwgdHJhbnNmb3JtT3B0aW9ucyhjb252ZXJ0SlNPTk9wdGlvbnMob3B0aW9ucykpLCB7fSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IF9leHRlbmRzKHt9LCBnZXQkMSgpLCB0aGlzLm9wdGlvbnMsIHRyYW5zZm9ybU9wdGlvbnMob3B0aW9ucykpO1xuICAgIH1cbiAgICB0aGlzLmZvcm1hdCA9IHRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLmZvcm1hdDtcbiAgICBpZiAoIWNhbGxiYWNrKSBjYWxsYmFjayA9IG5vb3A7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVDbGFzc09uRGVtYW5kKENsYXNzT3JPYmplY3QpIHtcbiAgICAgIGlmICghQ2xhc3NPck9iamVjdCkgcmV0dXJuIG51bGw7XG4gICAgICBpZiAodHlwZW9mIENsYXNzT3JPYmplY3QgPT09ICdmdW5jdGlvbicpIHJldHVybiBuZXcgQ2xhc3NPck9iamVjdCgpO1xuICAgICAgcmV0dXJuIENsYXNzT3JPYmplY3Q7XG4gICAgfVxuXG4gICAgLy8gaW5pdCBzZXJ2aWNlc1xuICAgIGlmICghdGhpcy5vcHRpb25zLmlzQ2xvbmUpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZXMubG9nZ2VyKSB7XG4gICAgICAgIGJhc2VMb2dnZXIuaW5pdChjcmVhdGVDbGFzc09uRGVtYW5kKHRoaXMubW9kdWxlcy5sb2dnZXIpLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFzZUxvZ2dlci5pbml0KG51bGwsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBsdSA9IG5ldyBMYW5ndWFnZVV0aWwodGhpcy5vcHRpb25zKTtcbiAgICAgIHRoaXMuc3RvcmUgPSBuZXcgUmVzb3VyY2VTdG9yZSh0aGlzLm9wdGlvbnMucmVzb3VyY2VzLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICB2YXIgcyA9IHRoaXMuc2VydmljZXM7XG4gICAgICBzLmxvZ2dlciA9IGJhc2VMb2dnZXI7XG4gICAgICBzLnJlc291cmNlU3RvcmUgPSB0aGlzLnN0b3JlO1xuICAgICAgcy5yZXNvdXJjZVN0b3JlLm9uKCdhZGRlZCByZW1vdmVkJywgZnVuY3Rpb24gKGxuZywgbnMpIHtcbiAgICAgICAgcy5jYWNoZUNvbm5lY3Rvci5zYXZlKCk7XG4gICAgICB9KTtcbiAgICAgIHMubGFuZ3VhZ2VVdGlscyA9IGx1O1xuICAgICAgcy5wbHVyYWxSZXNvbHZlciA9IG5ldyBQbHVyYWxSZXNvbHZlcihsdSwgeyBwcmVwZW5kOiB0aGlzLm9wdGlvbnMucGx1cmFsU2VwYXJhdG9yLCBjb21wYXRpYmlsaXR5SlNPTjogdGhpcy5vcHRpb25zLmNvbXBhdGliaWxpdHlKU09OLCBzaW1wbGlmeVBsdXJhbFN1ZmZpeDogdGhpcy5vcHRpb25zLnNpbXBsaWZ5UGx1cmFsU3VmZml4IH0pO1xuICAgICAgcy5pbnRlcnBvbGF0b3IgPSBuZXcgSW50ZXJwb2xhdG9yKHRoaXMub3B0aW9ucyk7XG5cbiAgICAgIHMuYmFja2VuZENvbm5lY3RvciA9IG5ldyBDb25uZWN0b3IoY3JlYXRlQ2xhc3NPbkRlbWFuZCh0aGlzLm1vZHVsZXMuYmFja2VuZCksIHMucmVzb3VyY2VTdG9yZSwgcywgdGhpcy5vcHRpb25zKTtcbiAgICAgIC8vIHBpcGUgZXZlbnRzIGZyb20gYmFja2VuZENvbm5lY3RvclxuICAgICAgcy5iYWNrZW5kQ29ubmVjdG9yLm9uKCcqJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMyLmVtaXQuYXBwbHkoX3RoaXMyLCBbZXZlbnRdLmNvbmNhdChhcmdzKSk7XG4gICAgICB9KTtcblxuICAgICAgcy5iYWNrZW5kQ29ubmVjdG9yLm9uKCdsb2FkZWQnLCBmdW5jdGlvbiAobG9hZGVkKSB7XG4gICAgICAgIHMuY2FjaGVDb25uZWN0b3Iuc2F2ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIHMuY2FjaGVDb25uZWN0b3IgPSBuZXcgQ29ubmVjdG9yJDEoY3JlYXRlQ2xhc3NPbkRlbWFuZCh0aGlzLm1vZHVsZXMuY2FjaGUpLCBzLnJlc291cmNlU3RvcmUsIHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAvLyBwaXBlIGV2ZW50cyBmcm9tIGJhY2tlbmRDb25uZWN0b3JcbiAgICAgIHMuY2FjaGVDb25uZWN0b3Iub24oJyonLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczIuZW1pdC5hcHBseShfdGhpczIsIFtldmVudF0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5tb2R1bGVzLmxhbmd1YWdlRGV0ZWN0b3IpIHtcbiAgICAgICAgcy5sYW5ndWFnZURldGVjdG9yID0gY3JlYXRlQ2xhc3NPbkRlbWFuZCh0aGlzLm1vZHVsZXMubGFuZ3VhZ2VEZXRlY3Rvcik7XG4gICAgICAgIHMubGFuZ3VhZ2VEZXRlY3Rvci5pbml0KHMsIHRoaXMub3B0aW9ucy5kZXRlY3Rpb24sIHRoaXMub3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJhbnNsYXRvciA9IG5ldyBUcmFuc2xhdG9yKHRoaXMuc2VydmljZXMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAvLyBwaXBlIGV2ZW50cyBmcm9tIHRyYW5zbGF0b3JcbiAgICAgIHRoaXMudHJhbnNsYXRvci5vbignKicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICAgICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMi5lbWl0LmFwcGx5KF90aGlzMiwgW2V2ZW50XS5jb25jYXQoYXJncykpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubW9kdWxlcy5leHRlcm5hbC5mb3JFYWNoKGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIGlmIChtLmluaXQpIG0uaW5pdChfdGhpczIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gYXBwZW5kIGFwaVxuICAgIHZhciBzdG9yZUFwaSA9IFsnZ2V0UmVzb3VyY2UnLCAnYWRkUmVzb3VyY2UnLCAnYWRkUmVzb3VyY2VzJywgJ2FkZFJlc291cmNlQnVuZGxlJywgJ3JlbW92ZVJlc291cmNlQnVuZGxlJywgJ2hhc1Jlc291cmNlQnVuZGxlJywgJ2dldFJlc291cmNlQnVuZGxlJ107XG4gICAgc3RvcmVBcGkuZm9yRWFjaChmdW5jdGlvbiAoZmNOYW1lKSB7XG4gICAgICBfdGhpczJbZmNOYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9zdG9yZTtcblxuICAgICAgICByZXR1cm4gKF9zdG9yZSA9IF90aGlzMi5zdG9yZSlbZmNOYW1lXS5hcHBseShfc3RvcmUsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgLy8gQ09NUEFUSUJJTElUWTogcmVtb3ZlIHRoaXNcbiAgICBpZiAodGhpcy5vcHRpb25zLmNvbXBhdGliaWxpdHlBUEkgPT09ICd2MScpIGFwcGVuZEJhY2t3YXJkc0FQSSh0aGlzKTtcblxuICAgIHZhciBsb2FkID0gZnVuY3Rpb24gbG9hZCgpIHtcbiAgICAgIF90aGlzMi5jaGFuZ2VMYW5ndWFnZShfdGhpczIub3B0aW9ucy5sbmcsIGZ1bmN0aW9uIChlcnIsIHQpIHtcbiAgICAgICAgX3RoaXMyLmlzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgICBfdGhpczIubG9nZ2VyLmxvZygnaW5pdGlhbGl6ZWQnLCBfdGhpczIub3B0aW9ucyk7XG4gICAgICAgIF90aGlzMi5lbWl0KCdpbml0aWFsaXplZCcsIF90aGlzMi5vcHRpb25zKTtcblxuICAgICAgICBjYWxsYmFjayhlcnIsIHQpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmICh0aGlzLm9wdGlvbnMucmVzb3VyY2VzIHx8ICF0aGlzLm9wdGlvbnMuaW5pdEltbWVkaWF0ZSkge1xuICAgICAgbG9hZCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRUaW1lb3V0KGxvYWQsIDApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIC8qIGVzbGludCBjb25zaXN0ZW50LXJldHVybjogMCAqL1xuXG5cbiAgSTE4bi5wcm90b3R5cGUubG9hZFJlc291cmNlcyA9IGZ1bmN0aW9uIGxvYWRSZXNvdXJjZXMoKSB7XG4gICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IG5vb3A7XG5cbiAgICBpZiAoIXRoaXMub3B0aW9ucy5yZXNvdXJjZXMpIHtcbiAgICAgIGlmICh0aGlzLmxhbmd1YWdlICYmIHRoaXMubGFuZ3VhZ2UudG9Mb3dlckNhc2UoKSA9PT0gJ2NpbW9kZScpIHJldHVybiBjYWxsYmFjaygpOyAvLyBhdm9pZCBsb2FkaW5nIHJlc291cmNlcyBmb3IgY2ltb2RlXG5cbiAgICAgIHZhciB0b0xvYWQgPSBbXTtcblxuICAgICAgdmFyIGFwcGVuZCA9IGZ1bmN0aW9uIGFwcGVuZChsbmcpIHtcbiAgICAgICAgaWYgKCFsbmcpIHJldHVybjtcbiAgICAgICAgdmFyIGxuZ3MgPSBfdGhpczMuc2VydmljZXMubGFuZ3VhZ2VVdGlscy50b1Jlc29sdmVIaWVyYXJjaHkobG5nKTtcbiAgICAgICAgbG5ncy5mb3JFYWNoKGZ1bmN0aW9uIChsKSB7XG4gICAgICAgICAgaWYgKHRvTG9hZC5pbmRleE9mKGwpIDwgMCkgdG9Mb2FkLnB1c2gobCk7XG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgaWYgKCF0aGlzLmxhbmd1YWdlKSB7XG4gICAgICAgIC8vIGF0IGxlYXN0IGxvYWQgZmFsbGJhY2tzIGluIHRoaXMgY2FzZVxuICAgICAgICB2YXIgZmFsbGJhY2tzID0gdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZVV0aWxzLmdldEZhbGxiYWNrQ29kZXModGhpcy5vcHRpb25zLmZhbGxiYWNrTG5nKTtcbiAgICAgICAgZmFsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24gKGwpIHtcbiAgICAgICAgICByZXR1cm4gYXBwZW5kKGwpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGVuZCh0aGlzLmxhbmd1YWdlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5wcmVsb2FkKSB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5wcmVsb2FkLmZvckVhY2goZnVuY3Rpb24gKGwpIHtcbiAgICAgICAgICByZXR1cm4gYXBwZW5kKGwpO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zZXJ2aWNlcy5jYWNoZUNvbm5lY3Rvci5sb2FkKHRvTG9hZCwgdGhpcy5vcHRpb25zLm5zLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzMy5zZXJ2aWNlcy5iYWNrZW5kQ29ubmVjdG9yLmxvYWQodG9Mb2FkLCBfdGhpczMub3B0aW9ucy5ucywgY2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKG51bGwpO1xuICAgIH1cbiAgfTtcblxuICBJMThuLnByb3RvdHlwZS5yZWxvYWRSZXNvdXJjZXMgPSBmdW5jdGlvbiByZWxvYWRSZXNvdXJjZXMobG5ncywgbnMpIHtcbiAgICBpZiAoIWxuZ3MpIGxuZ3MgPSB0aGlzLmxhbmd1YWdlcztcbiAgICBpZiAoIW5zKSBucyA9IHRoaXMub3B0aW9ucy5ucztcbiAgICB0aGlzLnNlcnZpY2VzLmJhY2tlbmRDb25uZWN0b3IucmVsb2FkKGxuZ3MsIG5zKTtcbiAgfTtcblxuICBJMThuLnByb3RvdHlwZS51c2UgPSBmdW5jdGlvbiB1c2UobW9kdWxlKSB7XG4gICAgaWYgKG1vZHVsZS50eXBlID09PSAnYmFja2VuZCcpIHtcbiAgICAgIHRoaXMubW9kdWxlcy5iYWNrZW5kID0gbW9kdWxlO1xuICAgIH1cblxuICAgIGlmIChtb2R1bGUudHlwZSA9PT0gJ2NhY2hlJykge1xuICAgICAgdGhpcy5tb2R1bGVzLmNhY2hlID0gbW9kdWxlO1xuICAgIH1cblxuICAgIGlmIChtb2R1bGUudHlwZSA9PT0gJ2xvZ2dlcicgfHwgbW9kdWxlLmxvZyAmJiBtb2R1bGUud2FybiAmJiBtb2R1bGUuZXJyb3IpIHtcbiAgICAgIHRoaXMubW9kdWxlcy5sb2dnZXIgPSBtb2R1bGU7XG4gICAgfVxuXG4gICAgaWYgKG1vZHVsZS50eXBlID09PSAnbGFuZ3VhZ2VEZXRlY3RvcicpIHtcbiAgICAgIHRoaXMubW9kdWxlcy5sYW5ndWFnZURldGVjdG9yID0gbW9kdWxlO1xuICAgIH1cblxuICAgIGlmIChtb2R1bGUudHlwZSA9PT0gJ3Bvc3RQcm9jZXNzb3InKSB7XG4gICAgICBwb3N0UHJvY2Vzc29yLmFkZFBvc3RQcm9jZXNzb3IobW9kdWxlKTtcbiAgICB9XG5cbiAgICBpZiAobW9kdWxlLnR5cGUgPT09ICczcmRQYXJ0eScpIHtcbiAgICAgIHRoaXMubW9kdWxlcy5leHRlcm5hbC5wdXNoKG1vZHVsZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUuY2hhbmdlTGFuZ3VhZ2UgPSBmdW5jdGlvbiBjaGFuZ2VMYW5ndWFnZShsbmcsIGNhbGxiYWNrKSB7XG4gICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICB2YXIgZG9uZSA9IGZ1bmN0aW9uIGRvbmUoZXJyLCBsKSB7XG4gICAgICBpZiAobCkge1xuICAgICAgICBfdGhpczQuZW1pdCgnbGFuZ3VhZ2VDaGFuZ2VkJywgbCk7XG4gICAgICAgIF90aGlzNC5sb2dnZXIubG9nKCdsYW5ndWFnZUNoYW5nZWQnLCBsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjayhlcnIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzNC50LmFwcGx5KF90aGlzNCwgYXJndW1lbnRzKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgc2V0TG5nID0gZnVuY3Rpb24gc2V0TG5nKGwpIHtcbiAgICAgIGlmIChsKSB7XG4gICAgICAgIF90aGlzNC5sYW5ndWFnZSA9IGw7XG4gICAgICAgIF90aGlzNC5sYW5ndWFnZXMgPSBfdGhpczQuc2VydmljZXMubGFuZ3VhZ2VVdGlscy50b1Jlc29sdmVIaWVyYXJjaHkobCk7XG5cbiAgICAgICAgX3RoaXM0LnRyYW5zbGF0b3IuY2hhbmdlTGFuZ3VhZ2UobCk7XG5cbiAgICAgICAgaWYgKF90aGlzNC5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yKSBfdGhpczQuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3Rvci5jYWNoZVVzZXJMYW5ndWFnZShsKTtcbiAgICAgIH1cblxuICAgICAgX3RoaXM0LmxvYWRSZXNvdXJjZXMoZnVuY3Rpb24gKGVycikge1xuICAgICAgICBkb25lKGVyciwgbCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgaWYgKCFsbmcgJiYgdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yICYmICF0aGlzLnNlcnZpY2VzLmxhbmd1YWdlRGV0ZWN0b3IuYXN5bmMpIHtcbiAgICAgIHNldExuZyh0aGlzLnNlcnZpY2VzLmxhbmd1YWdlRGV0ZWN0b3IuZGV0ZWN0KCkpO1xuICAgIH0gZWxzZSBpZiAoIWxuZyAmJiB0aGlzLnNlcnZpY2VzLmxhbmd1YWdlRGV0ZWN0b3IgJiYgdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yLmFzeW5jKSB7XG4gICAgICB0aGlzLnNlcnZpY2VzLmxhbmd1YWdlRGV0ZWN0b3IuZGV0ZWN0KHNldExuZyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldExuZyhsbmcpO1xuICAgIH1cbiAgfTtcblxuICBJMThuLnByb3RvdHlwZS5nZXRGaXhlZFQgPSBmdW5jdGlvbiBnZXRGaXhlZFQobG5nLCBucykge1xuICAgIHZhciBfdGhpczUgPSB0aGlzO1xuXG4gICAgdmFyIGZpeGVkVCA9IGZ1bmN0aW9uIGZpeGVkVChrZXkpIHtcbiAgICAgIHZhciBvcHRzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgICAgdmFyIG9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgb3B0cyk7XG4gICAgICBvcHRpb25zLmxuZyA9IG9wdGlvbnMubG5nIHx8IGZpeGVkVC5sbmc7XG4gICAgICBvcHRpb25zLmxuZ3MgPSBvcHRpb25zLmxuZ3MgfHwgZml4ZWRULmxuZ3M7XG4gICAgICBvcHRpb25zLm5zID0gb3B0aW9ucy5ucyB8fCBmaXhlZFQubnM7XG4gICAgICByZXR1cm4gX3RoaXM1LnQoa2V5LCBvcHRpb25zKTtcbiAgICB9O1xuICAgIGlmICh0eXBlb2YgbG5nID09PSAnc3RyaW5nJykge1xuICAgICAgZml4ZWRULmxuZyA9IGxuZztcbiAgICB9IGVsc2Uge1xuICAgICAgZml4ZWRULmxuZ3MgPSBsbmc7XG4gICAgfVxuICAgIGZpeGVkVC5ucyA9IG5zO1xuICAgIHJldHVybiBmaXhlZFQ7XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUudCA9IGZ1bmN0aW9uIHQoKSB7XG4gICAgdmFyIF90cmFuc2xhdG9yO1xuXG4gICAgcmV0dXJuIHRoaXMudHJhbnNsYXRvciAmJiAoX3RyYW5zbGF0b3IgPSB0aGlzLnRyYW5zbGF0b3IpLnRyYW5zbGF0ZS5hcHBseShfdHJhbnNsYXRvciwgYXJndW1lbnRzKTtcbiAgfTtcblxuICBJMThuLnByb3RvdHlwZS5leGlzdHMgPSBmdW5jdGlvbiBleGlzdHMoKSB7XG4gICAgdmFyIF90cmFuc2xhdG9yMjtcblxuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0b3IgJiYgKF90cmFuc2xhdG9yMiA9IHRoaXMudHJhbnNsYXRvcikuZXhpc3RzLmFwcGx5KF90cmFuc2xhdG9yMiwgYXJndW1lbnRzKTtcbiAgfTtcblxuICBJMThuLnByb3RvdHlwZS5zZXREZWZhdWx0TmFtZXNwYWNlID0gZnVuY3Rpb24gc2V0RGVmYXVsdE5hbWVzcGFjZShucykge1xuICAgIHRoaXMub3B0aW9ucy5kZWZhdWx0TlMgPSBucztcbiAgfTtcblxuICBJMThuLnByb3RvdHlwZS5sb2FkTmFtZXNwYWNlcyA9IGZ1bmN0aW9uIGxvYWROYW1lc3BhY2VzKG5zLCBjYWxsYmFjaykge1xuICAgIHZhciBfdGhpczYgPSB0aGlzO1xuXG4gICAgaWYgKCF0aGlzLm9wdGlvbnMubnMpIHJldHVybiBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuICAgIGlmICh0eXBlb2YgbnMgPT09ICdzdHJpbmcnKSBucyA9IFtuc107XG5cbiAgICBucy5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICBpZiAoX3RoaXM2Lm9wdGlvbnMubnMuaW5kZXhPZihuKSA8IDApIF90aGlzNi5vcHRpb25zLm5zLnB1c2gobik7XG4gICAgfSk7XG5cbiAgICB0aGlzLmxvYWRSZXNvdXJjZXMoY2FsbGJhY2spO1xuICB9O1xuXG4gIEkxOG4ucHJvdG90eXBlLmxvYWRMYW5ndWFnZXMgPSBmdW5jdGlvbiBsb2FkTGFuZ3VhZ2VzKGxuZ3MsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHR5cGVvZiBsbmdzID09PSAnc3RyaW5nJykgbG5ncyA9IFtsbmdzXTtcbiAgICB2YXIgcHJlbG9hZGVkID0gdGhpcy5vcHRpb25zLnByZWxvYWQgfHwgW107XG5cbiAgICB2YXIgbmV3TG5ncyA9IGxuZ3MuZmlsdGVyKGZ1bmN0aW9uIChsbmcpIHtcbiAgICAgIHJldHVybiBwcmVsb2FkZWQuaW5kZXhPZihsbmcpIDwgMDtcbiAgICB9KTtcbiAgICAvLyBFeGl0IGVhcmx5IGlmIGFsbCBnaXZlbiBsYW5ndWFnZXMgYXJlIGFscmVhZHkgcHJlbG9hZGVkXG4gICAgaWYgKCFuZXdMbmdzLmxlbmd0aCkgcmV0dXJuIGNhbGxiYWNrKCk7XG5cbiAgICB0aGlzLm9wdGlvbnMucHJlbG9hZCA9IHByZWxvYWRlZC5jb25jYXQobmV3TG5ncyk7XG4gICAgdGhpcy5sb2FkUmVzb3VyY2VzKGNhbGxiYWNrKTtcbiAgfTtcblxuICBJMThuLnByb3RvdHlwZS5kaXIgPSBmdW5jdGlvbiBkaXIobG5nKSB7XG4gICAgaWYgKCFsbmcpIGxuZyA9IHRoaXMubGFuZ3VhZ2VzICYmIHRoaXMubGFuZ3VhZ2VzLmxlbmd0aCA+IDAgPyB0aGlzLmxhbmd1YWdlc1swXSA6IHRoaXMubGFuZ3VhZ2U7XG4gICAgaWYgKCFsbmcpIHJldHVybiAncnRsJztcblxuICAgIHZhciBydGxMbmdzID0gWydhcicsICdzaHUnLCAnc3FyJywgJ3NzaCcsICd4YWEnLCAneWhkJywgJ3l1ZCcsICdhYW8nLCAnYWJoJywgJ2FidicsICdhY20nLCAnYWNxJywgJ2FjdycsICdhY3gnLCAnYWN5JywgJ2FkZicsICdhZHMnLCAnYWViJywgJ2FlYycsICdhZmInLCAnYWpwJywgJ2FwYycsICdhcGQnLCAnYXJiJywgJ2FycScsICdhcnMnLCAnYXJ5JywgJ2FyeicsICdhdXonLCAnYXZsJywgJ2F5aCcsICdheWwnLCAnYXluJywgJ2F5cCcsICdiYnonLCAncGdhJywgJ2hlJywgJ2l3JywgJ3BzJywgJ3BidCcsICdwYnUnLCAncHN0JywgJ3BycCcsICdwcmQnLCAndXInLCAneWRkJywgJ3lkcycsICd5aWgnLCAnamknLCAneWknLCAnaGJvJywgJ21lbicsICd4bW4nLCAnZmEnLCAnanByJywgJ3BlbycsICdwZXMnLCAncHJzJywgJ2R2JywgJ3NhbSddO1xuXG4gICAgcmV0dXJuIHJ0bExuZ3MuaW5kZXhPZih0aGlzLnNlcnZpY2VzLmxhbmd1YWdlVXRpbHMuZ2V0TGFuZ3VhZ2VQYXJ0RnJvbUNvZGUobG5nKSkgPj0gMCA/ICdydGwnIDogJ2x0cic7XG4gIH07XG5cbiAgLyogZXNsaW50IGNsYXNzLW1ldGhvZHMtdXNlLXRoaXM6IDAgKi9cblxuXG4gIEkxOG4ucHJvdG90eXBlLmNyZWF0ZUluc3RhbmNlID0gZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2UoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1sxXTtcblxuICAgIHJldHVybiBuZXcgSTE4bihvcHRpb25zLCBjYWxsYmFjayk7XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUuY2xvbmVJbnN0YW5jZSA9IGZ1bmN0aW9uIGNsb25lSW5zdGFuY2UoKSB7XG4gICAgdmFyIF90aGlzNyA9IHRoaXM7XG5cbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBub29wO1xuXG4gICAgdmFyIG1lcmdlZE9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgdGhpcy5vcHRpb25zLCBvcHRpb25zLCB7IGlzQ2xvbmU6IHRydWUgfSk7XG4gICAgdmFyIGNsb25lID0gbmV3IEkxOG4obWVyZ2VkT3B0aW9ucywgY2FsbGJhY2spO1xuICAgIHZhciBtZW1iZXJzVG9Db3B5ID0gWydzdG9yZScsICdzZXJ2aWNlcycsICdsYW5ndWFnZSddO1xuICAgIG1lbWJlcnNUb0NvcHkuZm9yRWFjaChmdW5jdGlvbiAobSkge1xuICAgICAgY2xvbmVbbV0gPSBfdGhpczdbbV07XG4gICAgfSk7XG4gICAgY2xvbmUudHJhbnNsYXRvciA9IG5ldyBUcmFuc2xhdG9yKGNsb25lLnNlcnZpY2VzLCBjbG9uZS5vcHRpb25zKTtcbiAgICBjbG9uZS50cmFuc2xhdG9yLm9uKCcqJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuNCA+IDEgPyBfbGVuNCAtIDEgOiAwKSwgX2tleTQgPSAxOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAgICAgIGFyZ3NbX2tleTQgLSAxXSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gICAgICB9XG5cbiAgICAgIGNsb25lLmVtaXQuYXBwbHkoY2xvbmUsIFtldmVudF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9KTtcbiAgICBjbG9uZS5pbml0KG1lcmdlZE9wdGlvbnMsIGNhbGxiYWNrKTtcblxuICAgIHJldHVybiBjbG9uZTtcbiAgfTtcblxuICByZXR1cm4gSTE4bjtcbn0oRXZlbnRFbWl0dGVyKTtcblxudmFyIGkxOG5leHQgPSBuZXcgSTE4bigpO1xuXG5yZXR1cm4gaTE4bmV4dDtcblxufSkpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZXh0ZXJuYWwvaTE4bmV4dC9zY3JpcHRzL2kxOG5leHQuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsLmkxOG5leHRYSFJCYWNrZW5kID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXJyID0gW107XG52YXIgZWFjaCA9IGFyci5mb3JFYWNoO1xudmFyIHNsaWNlID0gYXJyLnNsaWNlO1xuXG5mdW5jdGlvbiBkZWZhdWx0cyhvYmopIHtcbiAgZWFjaC5jYWxsKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChvYmpbcHJvcF0gPT09IHVuZGVmaW5lZCkgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZnVuY3Rpb24gYWRkUXVlcnlTdHJpbmcodXJsLCBwYXJhbXMpIHtcbiAgaWYgKHBhcmFtcyAmJiAodHlwZW9mIHBhcmFtcyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGFyYW1zKSkgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIHF1ZXJ5U3RyaW5nID0gJycsXG4gICAgICAgIGUgPSBlbmNvZGVVUklDb21wb25lbnQ7XG5cbiAgICAvLyBNdXN0IGVuY29kZSBkYXRhXG4gICAgZm9yICh2YXIgcGFyYW1OYW1lIGluIHBhcmFtcykge1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyYnICsgZShwYXJhbU5hbWUpICsgJz0nICsgZShwYXJhbXNbcGFyYW1OYW1lXSk7XG4gICAgfVxuXG4gICAgaWYgKCFxdWVyeVN0cmluZykge1xuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICB1cmwgPSB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSAhPT0gLTEgPyAnJicgOiAnPycpICsgcXVlcnlTdHJpbmcuc2xpY2UoMSk7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuXG4vLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9YZW9uY3Jvc3MvNzY2MzI3M1xuZnVuY3Rpb24gYWpheCh1cmwsIG9wdGlvbnMsIGNhbGxiYWNrLCBkYXRhLCBjYWNoZSkge1xuXG4gIGlmIChkYXRhICYmICh0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoZGF0YSkpID09PSAnb2JqZWN0Jykge1xuICAgIGlmICghY2FjaGUpIHtcbiAgICAgIGRhdGFbJ190J10gPSBuZXcgRGF0ZSgpO1xuICAgIH1cbiAgICAvLyBVUkwgZW5jb2RlZCBmb3JtIGRhdGEgbXVzdCBiZSBpbiBxdWVyeXN0cmluZyBmb3JtYXRcbiAgICBkYXRhID0gYWRkUXVlcnlTdHJpbmcoJycsIGRhdGEpLnNsaWNlKDEpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMucXVlcnlTdHJpbmdQYXJhbXMpIHtcbiAgICB1cmwgPSBhZGRRdWVyeVN0cmluZyh1cmwsIG9wdGlvbnMucXVlcnlTdHJpbmdQYXJhbXMpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICB2YXIgeDtcbiAgICBpZiAoWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgIHggPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeCA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNU1hNTDIuWE1MSFRUUC4zLjAnKTtcbiAgICB9XG4gICAgeC5vcGVuKGRhdGEgPyAnUE9TVCcgOiAnR0VUJywgdXJsLCAxKTtcbiAgICBpZiAoIW9wdGlvbnMuY3Jvc3NEb21haW4pIHtcbiAgICAgIHguc2V0UmVxdWVzdEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpO1xuICAgIH1cbiAgICB4LndpdGhDcmVkZW50aWFscyA9ICEhb3B0aW9ucy53aXRoQ3JlZGVudGlhbHM7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHguc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuICAgIH1cbiAgICB2YXIgaCA9IG9wdGlvbnMuY3VzdG9tSGVhZGVycztcbiAgICBpZiAoaCkge1xuICAgICAgZm9yICh2YXIgaSBpbiBoKSB7XG4gICAgICAgIHguc2V0UmVxdWVzdEhlYWRlcihpLCBoW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgeC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB4LnJlYWR5U3RhdGUgPiAzICYmIGNhbGxiYWNrICYmIGNhbGxiYWNrKHgucmVzcG9uc2VUZXh0LCB4KTtcbiAgICB9O1xuICAgIHguc2VuZChkYXRhKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2coZSk7XG4gIH1cbn1cblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdHMoKSB7XG4gIHJldHVybiB7XG4gICAgbG9hZFBhdGg6ICcvbG9jYWxlcy97e2xuZ319L3t7bnN9fS5qc29uJyxcbiAgICBhZGRQYXRoOiAnbG9jYWxlcy9hZGQve3tsbmd9fS97e25zfX0nLFxuICAgIGFsbG93TXVsdGlMb2FkaW5nOiBmYWxzZSxcbiAgICBwYXJzZTogSlNPTi5wYXJzZSxcbiAgICBjcm9zc0RvbWFpbjogZmFsc2UsXG4gICAgYWpheDogYWpheFxuICB9O1xufVxuXG52YXIgQmFja2VuZCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQmFja2VuZChzZXJ2aWNlcykge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBCYWNrZW5kKTtcblxuICAgIHRoaXMuaW5pdChzZXJ2aWNlcywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnR5cGUgPSAnYmFja2VuZCc7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQmFja2VuZCwgW3tcbiAgICBrZXk6ICdpbml0JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaW5pdChzZXJ2aWNlcykge1xuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgICB0aGlzLnNlcnZpY2VzID0gc2VydmljZXM7XG4gICAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0cyhvcHRpb25zLCB0aGlzLm9wdGlvbnMgfHwge30sIGdldERlZmF1bHRzKCkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3JlYWRNdWx0aScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlYWRNdWx0aShsYW5ndWFnZXMsIG5hbWVzcGFjZXMsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgbG9hZFBhdGggPSB0aGlzLm9wdGlvbnMubG9hZFBhdGg7XG4gICAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5sb2FkUGF0aCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBsb2FkUGF0aCA9IHRoaXMub3B0aW9ucy5sb2FkUGF0aChsYW5ndWFnZXMsIG5hbWVzcGFjZXMpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdXJsID0gdGhpcy5zZXJ2aWNlcy5pbnRlcnBvbGF0b3IuaW50ZXJwb2xhdGUobG9hZFBhdGgsIHsgbG5nOiBsYW5ndWFnZXMuam9pbignKycpLCBuczogbmFtZXNwYWNlcy5qb2luKCcrJykgfSk7XG5cbiAgICAgIHRoaXMubG9hZFVybCh1cmwsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdyZWFkJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gcmVhZChsYW5ndWFnZSwgbmFtZXNwYWNlLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGxvYWRQYXRoID0gdGhpcy5vcHRpb25zLmxvYWRQYXRoO1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMubG9hZFBhdGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbG9hZFBhdGggPSB0aGlzLm9wdGlvbnMubG9hZFBhdGgoW2xhbmd1YWdlXSwgW25hbWVzcGFjZV0pO1xuICAgICAgfVxuXG4gICAgICB2YXIgdXJsID0gdGhpcy5zZXJ2aWNlcy5pbnRlcnBvbGF0b3IuaW50ZXJwb2xhdGUobG9hZFBhdGgsIHsgbG5nOiBsYW5ndWFnZSwgbnM6IG5hbWVzcGFjZSB9KTtcblxuICAgICAgdGhpcy5sb2FkVXJsKHVybCwgY2FsbGJhY2spO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2xvYWRVcmwnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsb2FkVXJsKHVybCwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHRoaXMub3B0aW9ucy5hamF4KHVybCwgdGhpcy5vcHRpb25zLCBmdW5jdGlvbiAoZGF0YSwgeGhyKSB7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID49IDUwMCAmJiB4aHIuc3RhdHVzIDwgNjAwKSByZXR1cm4gY2FsbGJhY2soJ2ZhaWxlZCBsb2FkaW5nICcgKyB1cmwsIHRydWUgLyogcmV0cnkgKi8pO1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSA0MDAgJiYgeGhyLnN0YXR1cyA8IDUwMCkgcmV0dXJuIGNhbGxiYWNrKCdmYWlsZWQgbG9hZGluZyAnICsgdXJsLCBmYWxzZSAvKiBubyByZXRyeSAqLyk7XG5cbiAgICAgICAgdmFyIHJldCA9IHZvaWQgMCxcbiAgICAgICAgICAgIGVyciA9IHZvaWQgMDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXQgPSBfdGhpcy5vcHRpb25zLnBhcnNlKGRhdGEsIHVybCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBlcnIgPSAnZmFpbGVkIHBhcnNpbmcgJyArIHVybCArICcgdG8ganNvbic7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycikgcmV0dXJuIGNhbGxiYWNrKGVyciwgZmFsc2UpO1xuICAgICAgICBjYWxsYmFjayhudWxsLCByZXQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnY3JlYXRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gY3JlYXRlKGxhbmd1YWdlcywgbmFtZXNwYWNlLCBrZXksIGZhbGxiYWNrVmFsdWUpIHtcbiAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICBpZiAodHlwZW9mIGxhbmd1YWdlcyA9PT0gJ3N0cmluZycpIGxhbmd1YWdlcyA9IFtsYW5ndWFnZXNdO1xuXG4gICAgICB2YXIgcGF5bG9hZCA9IHt9O1xuICAgICAgcGF5bG9hZFtrZXldID0gZmFsbGJhY2tWYWx1ZSB8fCAnJztcblxuICAgICAgbGFuZ3VhZ2VzLmZvckVhY2goZnVuY3Rpb24gKGxuZykge1xuICAgICAgICB2YXIgdXJsID0gX3RoaXMyLnNlcnZpY2VzLmludGVycG9sYXRvci5pbnRlcnBvbGF0ZShfdGhpczIub3B0aW9ucy5hZGRQYXRoLCB7IGxuZzogbG5nLCBuczogbmFtZXNwYWNlIH0pO1xuXG4gICAgICAgIF90aGlzMi5vcHRpb25zLmFqYXgodXJsLCBfdGhpczIub3B0aW9ucywgZnVuY3Rpb24gKGRhdGEsIHhocikge1xuICAgICAgICAgIC8vY29uc3Qgc3RhdHVzQ29kZSA9IHhoci5zdGF0dXMudG9TdHJpbmcoKTtcbiAgICAgICAgICAvLyBUT0RPOiBpZiBzdGF0dXNDb2RlID09PSA0eHggZG8gbG9nXG4gICAgICAgIH0sIHBheWxvYWQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEJhY2tlbmQ7XG59KCk7XG5cbkJhY2tlbmQudHlwZSA9ICdiYWNrZW5kJztcblxucmV0dXJuIEJhY2tlbmQ7XG5cbn0pKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2V4dGVybmFsL2kxOG5leHQvc2NyaXB0cy9pMThuZXh0WEhSQmFja2VuZC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG5cdHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG5cdChnbG9iYWwuaTE4bmV4dExvY2FsU3RvcmFnZUNhY2hlID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXJyID0gW107XG52YXIgZWFjaCA9IGFyci5mb3JFYWNoO1xudmFyIHNsaWNlID0gYXJyLnNsaWNlO1xuXG5mdW5jdGlvbiBkZWZhdWx0cyhvYmopIHtcbiAgZWFjaC5jYWxsKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChvYmpbcHJvcF0gPT09IHVuZGVmaW5lZCkgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5cblxuXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBpbW1lZGlhdGUpIHtcbiAgdmFyIHRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNvbnRleHQgPSB0aGlzLFxuICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uIGxhdGVyKCkge1xuICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICBpZiAoIWltbWVkaWF0ZSkgZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICB9O1xuICAgIHZhciBjYWxsTm93ID0gaW1tZWRpYXRlICYmICF0aW1lb3V0O1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgd2FpdCk7XG4gICAgaWYgKGNhbGxOb3cpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gIH07XG59XG5cbnZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbnZhciBzdG9yYWdlID0ge1xuICBzZXRJdGVtOiBmdW5jdGlvbiBzZXRJdGVtKGtleSwgdmFsdWUpIHtcbiAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBmLmxvZygnZmFpbGVkIHRvIHNldCB2YWx1ZSBmb3Iga2V5IFwiJyArIGtleSArICdcIiB0byBsb2NhbFN0b3JhZ2UuJyk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBnZXRJdGVtOiBmdW5jdGlvbiBnZXRJdGVtKGtleSwgdmFsdWUpIHtcbiAgICBpZiAod2luZG93LmxvY2FsU3RvcmFnZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gZi5sb2coJ2ZhaWxlZCB0byBnZXQgdmFsdWUgZm9yIGtleSBcIicgKyBrZXkgKyAnXCIgZnJvbSBsb2NhbFN0b3JhZ2UuJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGdldERlZmF1bHRzKCkge1xuICByZXR1cm4ge1xuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIHByZWZpeDogJ2kxOG5leHRfcmVzXycsXG4gICAgZXhwaXJhdGlvblRpbWU6IDcgKiAyNCAqIDYwICogNjAgKiAxMDAwLFxuICAgIHZlcnNpb25zOiB7fVxuICB9O1xufVxuXG52YXIgQ2FjaGUgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENhY2hlKHNlcnZpY2VzKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENhY2hlKTtcblxuICAgIHRoaXMuaW5pdChzZXJ2aWNlcywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLnR5cGUgPSAnY2FjaGUnO1xuICAgIHRoaXMuZGVib3VuY2VkU3RvcmUgPSBkZWJvdW5jZSh0aGlzLnN0b3JlLCAxMDAwMCk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ2FjaGUsIFt7XG4gICAga2V5OiAnaW5pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQoc2VydmljZXMpIHtcbiAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgICAgdGhpcy5zZXJ2aWNlcyA9IHNlcnZpY2VzO1xuICAgICAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHMob3B0aW9ucywgdGhpcy5vcHRpb25zIHx8IHt9LCBnZXREZWZhdWx0cygpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdsb2FkJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZChsbmdzLCBjYWxsYmFjaykge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgdmFyIHN0b3JlID0ge307XG4gICAgICB2YXIgbm93TVMgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgaWYgKCF3aW5kb3cubG9jYWxTdG9yYWdlIHx8ICFsbmdzLmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgbnVsbCk7XG4gICAgICB9XG5cbiAgICAgIHZhciB0b2RvID0gbG5ncy5sZW5ndGg7XG5cbiAgICAgIGxuZ3MuZm9yRWFjaChmdW5jdGlvbiAobG5nKSB7XG4gICAgICAgIHZhciBsb2NhbCA9IHN0b3JhZ2UuZ2V0SXRlbShfdGhpcy5vcHRpb25zLnByZWZpeCArIGxuZyk7XG5cbiAgICAgICAgaWYgKGxvY2FsKSB7XG4gICAgICAgICAgbG9jYWwgPSBKU09OLnBhcnNlKGxvY2FsKTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgLy8gZXhwaXJhdGlvbiBmaWVsZCBpcyBtYW5kYXRvcnksIGFuZCBzaG91bGQgbm90IGJlIGV4cGlyZWRcbiAgICAgICAgICBsb2NhbC5pMThuU3RhbXAgJiYgbG9jYWwuaTE4blN0YW1wICsgX3RoaXMub3B0aW9ucy5leHBpcmF0aW9uVGltZSA+IG5vd01TICYmXG5cbiAgICAgICAgICAvLyB0aGVyZSBzaG91bGQgYmUgbm8gbGFuZ3VhZ2UgdmVyc2lvbiBzZXQsIG9yIGlmIGl0IGlzLCBpdCBzaG91bGQgbWF0Y2ggdGhlIG9uZSBpbiB0cmFuc2xhdGlvblxuICAgICAgICAgIF90aGlzLm9wdGlvbnMudmVyc2lvbnNbbG5nXSA9PT0gbG9jYWwuaTE4blZlcnNpb24pIHtcbiAgICAgICAgICAgIGRlbGV0ZSBsb2NhbC5pMThuVmVyc2lvbjtcbiAgICAgICAgICAgIHN0b3JlW2xuZ10gPSBsb2NhbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0b2RvIC09IDE7XG4gICAgICAgIGlmICh0b2RvID09PSAwKSB7XG4gICAgICAgICAgY2FsbGJhY2sobnVsbCwgc3RvcmUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc3RvcmUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdG9yZShzdG9yZVBhcmFtKSB7XG4gICAgICB2YXIgc3RvcmUgPSBzdG9yZVBhcmFtO1xuICAgICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgICAgZm9yICh2YXIgbSBpbiBzdG9yZSkge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICAgICAgICAvLyB0aW1lc3RhbXBcbiAgICAgICAgICBzdG9yZVttXS5pMThuU3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgICAgICAgIC8vIGxhbmd1YWdlIHZlcnNpb24gKGlmIHNldClcbiAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLnZlcnNpb25zW21dKSB7XG4gICAgICAgICAgICBzdG9yZVttXS5pMThuVmVyc2lvbiA9IHRoaXMub3B0aW9ucy52ZXJzaW9uc1ttXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBzYXZlXG4gICAgICAgICAgc3RvcmFnZS5zZXRJdGVtKHRoaXMub3B0aW9ucy5wcmVmaXggKyBtLCBKU09OLnN0cmluZ2lmeShzdG9yZVttXSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc2F2ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNhdmUoc3RvcmUpIHtcbiAgICAgIHRoaXMuZGVib3VuY2VkU3RvcmUoc3RvcmUpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDYWNoZTtcbn0oKTtcblxuQ2FjaGUudHlwZSA9ICdjYWNoZSc7XG5cbnJldHVybiBDYWNoZTtcblxufSkpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZXh0ZXJuYWwvaTE4bmV4dC9zY3JpcHRzL2kxOG5leHRMb2NhbFN0b3JhZ2VDYWNoZS5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICAgIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoJ2kxOG5leHRTcHJpbnRmUG9zdFByb2Nlc3NvcicsIGZhY3RvcnkpIDpcbiAgICAoZ2xvYmFsLmkxOG5leHRTcHJpbnRmUG9zdFByb2Nlc3NvciA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGJhYmVsSGVscGVycyA9IHt9O1xuICAgIGJhYmVsSGVscGVycy50eXBlb2YgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICAgIH0gOiBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xuICAgIH07XG4gICAgYmFiZWxIZWxwZXJzO1xuXG4gICAgdmFyIHJlID0ge1xuICAgICAgICBub3Rfc3RyaW5nOiAvW15zXS8sXG4gICAgICAgIG51bWJlcjogL1tkaWVmZ10vLFxuICAgICAgICBqc29uOiAvW2pdLyxcbiAgICAgICAgbm90X2pzb246IC9bXmpdLyxcbiAgICAgICAgdGV4dDogL15bXlxceDI1XSsvLFxuICAgICAgICBtb2R1bG86IC9eXFx4MjV7Mn0vLFxuICAgICAgICBwbGFjZWhvbGRlcjogL15cXHgyNSg/OihbMS05XVxcZCopXFwkfFxcKChbXlxcKV0rKVxcKSk/KFxcKyk/KDB8J1teJF0pPygtKT8oXFxkKyk/KD86XFwuKFxcZCspKT8oW2ItZ2lqb3N1eFhdKS8sXG4gICAgICAgIGtleTogL14oW2Etel9dW2Etel9cXGRdKikvaSxcbiAgICAgICAga2V5X2FjY2VzczogL15cXC4oW2Etel9dW2Etel9cXGRdKikvaSxcbiAgICAgICAgaW5kZXhfYWNjZXNzOiAvXlxcWyhcXGQrKVxcXS8sXG4gICAgICAgIHNpZ246IC9eW1xcK1xcLV0vXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHNwcmludGYoKSB7XG4gICAgICAgIHZhciBrZXkgPSBhcmd1bWVudHNbMF0sXG4gICAgICAgICAgICBjYWNoZSA9IHNwcmludGYuY2FjaGU7XG4gICAgICAgIGlmICghKGNhY2hlW2tleV0gJiYgY2FjaGUuaGFzT3duUHJvcGVydHkoa2V5KSkpIHtcbiAgICAgICAgICAgIGNhY2hlW2tleV0gPSBzcHJpbnRmLnBhcnNlKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwcmludGYuZm9ybWF0LmNhbGwobnVsbCwgY2FjaGVba2V5XSwgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBzcHJpbnRmLmZvcm1hdCA9IGZ1bmN0aW9uIChwYXJzZV90cmVlLCBhcmd2KSB7XG4gICAgICAgIHZhciBjdXJzb3IgPSAxLFxuICAgICAgICAgICAgdHJlZV9sZW5ndGggPSBwYXJzZV90cmVlLmxlbmd0aCxcbiAgICAgICAgICAgIG5vZGVfdHlwZSA9IFwiXCIsXG4gICAgICAgICAgICBhcmcsXG4gICAgICAgICAgICBvdXRwdXQgPSBbXSxcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBrLFxuICAgICAgICAgICAgbWF0Y2gsXG4gICAgICAgICAgICBwYWQsXG4gICAgICAgICAgICBwYWRfY2hhcmFjdGVyLFxuICAgICAgICAgICAgcGFkX2xlbmd0aCxcbiAgICAgICAgICAgIGlzX3Bvc2l0aXZlID0gdHJ1ZSxcbiAgICAgICAgICAgIHNpZ24gPSBcIlwiO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdHJlZV9sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbm9kZV90eXBlID0gZ2V0X3R5cGUocGFyc2VfdHJlZVtpXSk7XG4gICAgICAgICAgICBpZiAobm9kZV90eXBlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0W291dHB1dC5sZW5ndGhdID0gcGFyc2VfdHJlZVtpXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9kZV90eXBlID09PSBcImFycmF5XCIpIHtcbiAgICAgICAgICAgICAgICBtYXRjaCA9IHBhcnNlX3RyZWVbaV07IC8vIGNvbnZlbmllbmNlIHB1cnBvc2VzIG9ubHlcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMl0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8ga2V5d29yZCBhcmd1bWVudFxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcl07XG4gICAgICAgICAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBtYXRjaFsyXS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFhcmcuaGFzT3duUHJvcGVydHkobWF0Y2hbMl1ba10pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHNwcmludGYoXCJbc3ByaW50Zl0gcHJvcGVydHkgJyVzJyBkb2VzIG5vdCBleGlzdFwiLCBtYXRjaFsyXVtrXSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnW21hdGNoWzJdW2tdXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobWF0Y2hbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcG9zaXRpb25hbCBhcmd1bWVudCAoZXhwbGljaXQpXG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ3ZbbWF0Y2hbMV1dO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGltcGxpY2l0KVxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W2N1cnNvcisrXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoZ2V0X3R5cGUoYXJnKSA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlLm5vdF9zdHJpbmcudGVzdChtYXRjaFs4XSkgJiYgcmUubm90X2pzb24udGVzdChtYXRjaFs4XSkgJiYgZ2V0X3R5cGUoYXJnKSAhPSBcIm51bWJlclwiICYmIGlzTmFOKGFyZykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzcHJpbnRmKFwiW3NwcmludGZdIGV4cGVjdGluZyBudW1iZXIgYnV0IGZvdW5kICVzXCIsIGdldF90eXBlKGFyZykpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmUubnVtYmVyLnRlc3QobWF0Y2hbOF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIGlzX3Bvc2l0aXZlID0gYXJnID49IDA7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChtYXRjaFs4XSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJjXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGFyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImRcIjpcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImlcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IHBhcnNlSW50KGFyZywgMTApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJqXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBKU09OLnN0cmluZ2lmeShhcmcsIG51bGwsIG1hdGNoWzZdID8gcGFyc2VJbnQobWF0Y2hbNl0pIDogMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IG1hdGNoWzddID8gYXJnLnRvRXhwb25lbnRpYWwobWF0Y2hbN10pIDogYXJnLnRvRXhwb25lbnRpYWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiZlwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gbWF0Y2hbN10gPyBwYXJzZUZsb2F0KGFyZykudG9GaXhlZChtYXRjaFs3XSkgOiBwYXJzZUZsb2F0KGFyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImdcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IG1hdGNoWzddID8gcGFyc2VGbG9hdChhcmcpLnRvUHJlY2lzaW9uKG1hdGNoWzddKSA6IHBhcnNlRmxvYXQoYXJnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwib1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKDgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJzXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSAoYXJnID0gU3RyaW5nKGFyZykpICYmIG1hdGNoWzddID8gYXJnLnN1YnN0cmluZygwLCBtYXRjaFs3XSkgOiBhcmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInVcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZyA+Pj4gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwieFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiWFwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChyZS5qc29uLnRlc3QobWF0Y2hbOF0pKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFtvdXRwdXQubGVuZ3RoXSA9IGFyZztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmUubnVtYmVyLnRlc3QobWF0Y2hbOF0pICYmICghaXNfcG9zaXRpdmUgfHwgbWF0Y2hbM10pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduID0gaXNfcG9zaXRpdmUgPyBcIitcIiA6IFwiLVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJnLnRvU3RyaW5nKCkucmVwbGFjZShyZS5zaWduLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ24gPSBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhZF9jaGFyYWN0ZXIgPSBtYXRjaFs0XSA/IG1hdGNoWzRdID09PSBcIjBcIiA/IFwiMFwiIDogbWF0Y2hbNF0uY2hhckF0KDEpIDogXCIgXCI7XG4gICAgICAgICAgICAgICAgICAgIHBhZF9sZW5ndGggPSBtYXRjaFs2XSAtIChzaWduICsgYXJnKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIHBhZCA9IG1hdGNoWzZdID8gcGFkX2xlbmd0aCA+IDAgPyBzdHJfcmVwZWF0KHBhZF9jaGFyYWN0ZXIsIHBhZF9sZW5ndGgpIDogXCJcIiA6IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dFtvdXRwdXQubGVuZ3RoXSA9IG1hdGNoWzVdID8gc2lnbiArIGFyZyArIHBhZCA6IHBhZF9jaGFyYWN0ZXIgPT09IFwiMFwiID8gc2lnbiArIHBhZCArIGFyZyA6IHBhZCArIHNpZ24gKyBhcmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQuam9pbihcIlwiKTtcbiAgICB9O1xuXG4gICAgc3ByaW50Zi5jYWNoZSA9IHt9O1xuXG4gICAgc3ByaW50Zi5wYXJzZSA9IGZ1bmN0aW9uIChmbXQpIHtcbiAgICAgICAgdmFyIF9mbXQgPSBmbXQsXG4gICAgICAgICAgICBtYXRjaCA9IFtdLFxuICAgICAgICAgICAgcGFyc2VfdHJlZSA9IFtdLFxuICAgICAgICAgICAgYXJnX25hbWVzID0gMDtcbiAgICAgICAgd2hpbGUgKF9mbXQpIHtcbiAgICAgICAgICAgIGlmICgobWF0Y2ggPSByZS50ZXh0LmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZVtwYXJzZV90cmVlLmxlbmd0aF0gPSBtYXRjaFswXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKG1hdGNoID0gcmUubW9kdWxvLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcGFyc2VfdHJlZVtwYXJzZV90cmVlLmxlbmd0aF0gPSBcIiVcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoKG1hdGNoID0gcmUucGxhY2Vob2xkZXIuZXhlYyhfZm10KSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2hbMl0pIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnX25hbWVzIHw9IDE7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWVsZF9saXN0ID0gW10sXG4gICAgICAgICAgICAgICAgICAgICAgICByZXBsYWNlbWVudF9maWVsZCA9IG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRfbWF0Y2ggPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IHJlLmtleS5leGVjKHJlcGxhY2VtZW50X2ZpZWxkKSkgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3RbZmllbGRfbGlzdC5sZW5ndGhdID0gZmllbGRfbWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAoKHJlcGxhY2VtZW50X2ZpZWxkID0gcmVwbGFjZW1lbnRfZmllbGQuc3Vic3RyaW5nKGZpZWxkX21hdGNoWzBdLmxlbmd0aCkpICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChmaWVsZF9tYXRjaCA9IHJlLmtleV9hY2Nlc3MuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3RbZmllbGRfbGlzdC5sZW5ndGhdID0gZmllbGRfbWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICgoZmllbGRfbWF0Y2ggPSByZS5pbmRleF9hY2Nlc3MuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX2xpc3RbZmllbGRfbGlzdC5sZW5ndGhdID0gZmllbGRfbWF0Y2hbMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiW3NwcmludGZdIGZhaWxlZCB0byBwYXJzZSBuYW1lZCBhcmd1bWVudCBrZXlcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFwiW3NwcmludGZdIGZhaWxlZCB0byBwYXJzZSBuYW1lZCBhcmd1bWVudCBrZXlcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hbMl0gPSBmaWVsZF9saXN0O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYXJnX25hbWVzID09PSAzKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIltzcHJpbnRmXSBtaXhpbmcgcG9zaXRpb25hbCBhbmQgbmFtZWQgcGxhY2Vob2xkZXJzIGlzIG5vdCAoeWV0KSBzdXBwb3J0ZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWVbcGFyc2VfdHJlZS5sZW5ndGhdID0gbWF0Y2g7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIltzcHJpbnRmXSB1bmV4cGVjdGVkIHBsYWNlaG9sZGVyXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgX2ZtdCA9IF9mbXQuc3Vic3RyaW5nKG1hdGNoWzBdLmxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcnNlX3RyZWU7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHZzcHJpbnRmKGZtdCwgYXJndiwgX2FyZ3YpIHtcbiAgICAgICAgX2FyZ3YgPSAoYXJndiB8fCBbXSkuc2xpY2UoMCk7XG4gICAgICAgIF9hcmd2LnNwbGljZSgwLCAwLCBmbXQpO1xuICAgICAgICByZXR1cm4gc3ByaW50Zi5hcHBseShudWxsLCBfYXJndik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaGVscGVyc1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldF90eXBlKHZhcmlhYmxlKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFyaWFibGUpLnNsaWNlKDgsIC0xKS50b0xvd2VyQ2FzZSgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHN0cl9yZXBlYXQoaW5wdXQsIG11bHRpcGxpZXIpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5KG11bHRpcGxpZXIgKyAxKS5qb2luKGlucHV0KTtcbiAgICB9XG5cbiAgICB2YXIgaW5kZXggPSB7XG4gICAgICBuYW1lOiAnc3ByaW50ZicsXG4gICAgICB0eXBlOiAncG9zdFByb2Nlc3NvcicsXG5cbiAgICAgIHByb2Nlc3M6IGZ1bmN0aW9uIHByb2Nlc3ModmFsdWUsIGtleSwgb3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMuc3ByaW50ZikgcmV0dXJuIHZhbHVlO1xuXG4gICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KG9wdGlvbnMuc3ByaW50ZikgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgICAgICByZXR1cm4gdnNwcmludGYodmFsdWUsIG9wdGlvbnMuc3ByaW50Zik7XG4gICAgICAgIH0gZWxzZSBpZiAoYmFiZWxIZWxwZXJzLnR5cGVvZihvcHRpb25zLnNwcmludGYpID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHJldHVybiBzcHJpbnRmKHZhbHVlLCBvcHRpb25zLnNwcmludGYpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSxcbiAgICAgIG92ZXJsb2FkVHJhbnNsYXRpb25PcHRpb25IYW5kbGVyOiBmdW5jdGlvbiBvdmVybG9hZFRyYW5zbGF0aW9uT3B0aW9uSGFuZGxlcihhcmdzKSB7XG4gICAgICAgIHZhciB2YWx1ZXMgPSBbXTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YWx1ZXMucHVzaChhcmdzW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcG9zdFByb2Nlc3M6ICdzcHJpbnRmJyxcbiAgICAgICAgICBzcHJpbnRmOiB2YWx1ZXNcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIGluZGV4O1xuXG59KSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvaTE4bmV4dFNwcmludGZQb3N0UHJvY2Vzc29yLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbC5pMThuZXh0QnJvd3Nlckxhbmd1YWdlRGV0ZWN0b3IgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCBmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICB2YXIgYmFiZWxIZWxwZXJzID0ge307XG5cbiAgYmFiZWxIZWxwZXJzLmNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgfTtcblxuICBiYWJlbEhlbHBlcnMuY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgICB9O1xuICB9KCk7XG5cbiAgYmFiZWxIZWxwZXJzO1xuXG4gIHZhciBhcnIgPSBbXTtcbiAgdmFyIGVhY2ggPSBhcnIuZm9yRWFjaDtcbiAgdmFyIHNsaWNlID0gYXJyLnNsaWNlO1xuXG4gIGZ1bmN0aW9uIGRlZmF1bHRzKG9iaikge1xuICAgIGVhY2guY2FsbChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBpZiAob2JqW3Byb3BdID09PSB1bmRlZmluZWQpIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH1cblxuICB2YXIgY29va2llID0ge1xuICAgIGNyZWF0ZTogZnVuY3Rpb24gY3JlYXRlKG5hbWUsIHZhbHVlLCBtaW51dGVzLCBkb21haW4pIHtcbiAgICAgIHZhciBleHBpcmVzID0gdm9pZCAwO1xuICAgICAgaWYgKG1pbnV0ZXMpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyBtaW51dGVzICogNjAgKiAxMDAwKTtcbiAgICAgICAgZXhwaXJlcyA9ICc7IGV4cGlyZXM9JyArIGRhdGUudG9HTVRTdHJpbmcoKTtcbiAgICAgIH0gZWxzZSBleHBpcmVzID0gJyc7XG4gICAgICBkb21haW4gPSBkb21haW4gPyAnZG9tYWluPScgKyBkb21haW4gKyAnOycgOiAnJztcbiAgICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyAnPScgKyB2YWx1ZSArIGV4cGlyZXMgKyAnOycgKyBkb21haW4gKyAncGF0aD0vJztcbiAgICB9LFxuXG4gICAgcmVhZDogZnVuY3Rpb24gcmVhZChuYW1lKSB7XG4gICAgICB2YXIgbmFtZUVRID0gbmFtZSArICc9JztcbiAgICAgIHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgYyA9IGNhW2ldO1xuICAgICAgICB3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykge1xuICAgICAgICAgIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XG4gICAgICAgIH1pZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9LFxuXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUobmFtZSkge1xuICAgICAgdGhpcy5jcmVhdGUobmFtZSwgJycsIC0xKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGNvb2tpZSQxID0ge1xuICAgIG5hbWU6ICdjb29raWUnLFxuXG4gICAgbG9va3VwOiBmdW5jdGlvbiBsb29rdXAob3B0aW9ucykge1xuICAgICAgdmFyIGZvdW5kID0gdm9pZCAwO1xuXG4gICAgICBpZiAob3B0aW9ucy5sb29rdXBDb29raWUgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgYyA9IGNvb2tpZS5yZWFkKG9wdGlvbnMubG9va3VwQ29va2llKTtcbiAgICAgICAgaWYgKGMpIGZvdW5kID0gYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZvdW5kO1xuICAgIH0sXG4gICAgY2FjaGVVc2VyTGFuZ3VhZ2U6IGZ1bmN0aW9uIGNhY2hlVXNlckxhbmd1YWdlKGxuZywgb3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMubG9va3VwQ29va2llICYmIHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgY29va2llLmNyZWF0ZShvcHRpb25zLmxvb2t1cENvb2tpZSwgbG5nLCBvcHRpb25zLmNvb2tpZU1pbnV0ZXMsIG9wdGlvbnMuY29va2llRG9tYWluKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIHF1ZXJ5c3RyaW5nID0ge1xuICAgIG5hbWU6ICdxdWVyeXN0cmluZycsXG5cbiAgICBsb29rdXA6IGZ1bmN0aW9uIGxvb2t1cChvcHRpb25zKSB7XG4gICAgICB2YXIgZm91bmQgPSB2b2lkIDA7XG5cbiAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgcXVlcnkgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoLnN1YnN0cmluZygxKTtcbiAgICAgICAgdmFyIHBhcmFtcyA9IHF1ZXJ5LnNwbGl0KCcmJyk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFyYW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHBvcyA9IHBhcmFtc1tpXS5pbmRleE9mKCc9Jyk7XG4gICAgICAgICAgaWYgKHBvcyA+IDApIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBwYXJhbXNbaV0uc3Vic3RyaW5nKDAsIHBvcyk7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSBvcHRpb25zLmxvb2t1cFF1ZXJ5c3RyaW5nKSB7XG4gICAgICAgICAgICAgIGZvdW5kID0gcGFyYW1zW2ldLnN1YnN0cmluZyhwb3MgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZvdW5kO1xuICAgIH1cbiAgfTtcblxuICB2YXIgaGFzTG9jYWxTdG9yYWdlU3VwcG9ydCA9IHZvaWQgMDtcbiAgdHJ5IHtcbiAgICBoYXNMb2NhbFN0b3JhZ2VTdXBwb3J0ID0gd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cubG9jYWxTdG9yYWdlICE9PSBudWxsO1xuICAgIHZhciB0ZXN0S2V5ID0gJ2kxOG5leHQudHJhbnNsYXRlLmJvbyc7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKHRlc3RLZXksICdmb28nKTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0odGVzdEtleSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBoYXNMb2NhbFN0b3JhZ2VTdXBwb3J0ID0gZmFsc2U7XG4gIH1cblxuICB2YXIgbG9jYWxTdG9yYWdlID0ge1xuICAgIG5hbWU6ICdsb2NhbFN0b3JhZ2UnLFxuXG4gICAgbG9va3VwOiBmdW5jdGlvbiBsb29rdXAob3B0aW9ucykge1xuICAgICAgdmFyIGZvdW5kID0gdm9pZCAwO1xuXG4gICAgICBpZiAob3B0aW9ucy5sb29rdXBMb2NhbFN0b3JhZ2UgJiYgaGFzTG9jYWxTdG9yYWdlU3VwcG9ydCkge1xuICAgICAgICB2YXIgbG5nID0gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKG9wdGlvbnMubG9va3VwTG9jYWxTdG9yYWdlKTtcbiAgICAgICAgaWYgKGxuZykgZm91bmQgPSBsbmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmb3VuZDtcbiAgICB9LFxuICAgIGNhY2hlVXNlckxhbmd1YWdlOiBmdW5jdGlvbiBjYWNoZVVzZXJMYW5ndWFnZShsbmcsIG9wdGlvbnMpIHtcbiAgICAgIGlmIChvcHRpb25zLmxvb2t1cExvY2FsU3RvcmFnZSAmJiBoYXNMb2NhbFN0b3JhZ2VTdXBwb3J0KSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShvcHRpb25zLmxvb2t1cExvY2FsU3RvcmFnZSwgbG5nKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdmFyIG5hdmlnYXRvciQxID0ge1xuICAgIG5hbWU6ICduYXZpZ2F0b3InLFxuXG4gICAgbG9va3VwOiBmdW5jdGlvbiBsb29rdXAob3B0aW9ucykge1xuICAgICAgdmFyIGZvdW5kID0gW107XG5cbiAgICAgIGlmICh0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBpZiAobmF2aWdhdG9yLmxhbmd1YWdlcykge1xuICAgICAgICAgIC8vIGNocm9tZSBvbmx5OyBub3QgYW4gYXJyYXksIHNvIGNhbid0IHVzZSAucHVzaC5hcHBseSBpbnN0ZWFkIG9mIGl0ZXJhdGluZ1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmF2aWdhdG9yLmxhbmd1YWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm91bmQucHVzaChuYXZpZ2F0b3IubGFuZ3VhZ2VzW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hdmlnYXRvci51c2VyTGFuZ3VhZ2UpIHtcbiAgICAgICAgICBmb3VuZC5wdXNoKG5hdmlnYXRvci51c2VyTGFuZ3VhZ2UpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChuYXZpZ2F0b3IubGFuZ3VhZ2UpIHtcbiAgICAgICAgICBmb3VuZC5wdXNoKG5hdmlnYXRvci5sYW5ndWFnZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZvdW5kLmxlbmd0aCA+IDAgPyBmb3VuZCA6IHVuZGVmaW5lZDtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGh0bWxUYWcgPSB7XG4gICAgbmFtZTogJ2h0bWxUYWcnLFxuXG4gICAgbG9va3VwOiBmdW5jdGlvbiBsb29rdXAob3B0aW9ucykge1xuICAgICAgdmFyIGZvdW5kID0gdm9pZCAwO1xuICAgICAgdmFyIGh0bWxUYWcgPSBvcHRpb25zLmh0bWxUYWcgfHwgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgPyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgOiBudWxsKTtcblxuICAgICAgaWYgKGh0bWxUYWcgJiYgdHlwZW9mIGh0bWxUYWcuZ2V0QXR0cmlidXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGZvdW5kID0gaHRtbFRhZy5nZXRBdHRyaWJ1dGUoJ2xhbmcnKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZvdW5kO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBnZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3JkZXI6IFsncXVlcnlzdHJpbmcnLCAnY29va2llJywgJ2xvY2FsU3RvcmFnZScsICduYXZpZ2F0b3InLCAnaHRtbFRhZyddLFxuICAgICAgbG9va3VwUXVlcnlzdHJpbmc6ICdsbmcnLFxuICAgICAgbG9va3VwQ29va2llOiAnaTE4bmV4dCcsXG4gICAgICBsb29rdXBMb2NhbFN0b3JhZ2U6ICdpMThuZXh0TG5nJyxcblxuICAgICAgLy8gY2FjaGUgdXNlciBsYW5ndWFnZVxuICAgICAgY2FjaGVzOiBbJ2xvY2FsU3RvcmFnZSddLFxuICAgICAgZXhjbHVkZUNhY2hlRm9yOiBbJ2NpbW9kZSddXG4gICAgICAvL2Nvb2tpZU1pbnV0ZXM6IDEwLFxuICAgICAgLy9jb29raWVEb21haW46ICdteURvbWFpbidcbiAgICB9O1xuICB9XG5cbiAgdmFyIEJyb3dzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQnJvd3NlcihzZXJ2aWNlcykge1xuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcbiAgICAgIGJhYmVsSGVscGVycy5jbGFzc0NhbGxDaGVjayh0aGlzLCBCcm93c2VyKTtcblxuICAgICAgdGhpcy50eXBlID0gJ2xhbmd1YWdlRGV0ZWN0b3InO1xuICAgICAgdGhpcy5kZXRlY3RvcnMgPSB7fTtcblxuICAgICAgdGhpcy5pbml0KHNlcnZpY2VzLCBvcHRpb25zKTtcbiAgICB9XG5cbiAgICBiYWJlbEhlbHBlcnMuY3JlYXRlQ2xhc3MoQnJvd3NlciwgW3tcbiAgICAgIGtleTogJ2luaXQnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQoc2VydmljZXMpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDEgfHwgYXJndW1lbnRzWzFdID09PSB1bmRlZmluZWQgPyB7fSA6IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgdmFyIGkxOG5PcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA8PSAyIHx8IGFyZ3VtZW50c1syXSA9PT0gdW5kZWZpbmVkID8ge30gOiBhcmd1bWVudHNbMl07XG5cbiAgICAgICAgdGhpcy5zZXJ2aWNlcyA9IHNlcnZpY2VzO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBkZWZhdWx0cyhvcHRpb25zLCB0aGlzLm9wdGlvbnMgfHwge30sIGdldERlZmF1bHRzKCkpO1xuICAgICAgICB0aGlzLmkxOG5PcHRpb25zID0gaTE4bk9wdGlvbnM7XG5cbiAgICAgICAgdGhpcy5hZGREZXRlY3Rvcihjb29raWUkMSk7XG4gICAgICAgIHRoaXMuYWRkRGV0ZWN0b3IocXVlcnlzdHJpbmcpO1xuICAgICAgICB0aGlzLmFkZERldGVjdG9yKGxvY2FsU3RvcmFnZSk7XG4gICAgICAgIHRoaXMuYWRkRGV0ZWN0b3IobmF2aWdhdG9yJDEpO1xuICAgICAgICB0aGlzLmFkZERldGVjdG9yKGh0bWxUYWcpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2FkZERldGVjdG9yJyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBhZGREZXRlY3RvcihkZXRlY3Rvcikge1xuICAgICAgICB0aGlzLmRldGVjdG9yc1tkZXRlY3Rvci5uYW1lXSA9IGRldGVjdG9yO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogJ2RldGVjdCcsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gZGV0ZWN0KGRldGVjdGlvbk9yZGVyKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFkZXRlY3Rpb25PcmRlcikgZGV0ZWN0aW9uT3JkZXIgPSB0aGlzLm9wdGlvbnMub3JkZXI7XG5cbiAgICAgICAgdmFyIGRldGVjdGVkID0gW107XG4gICAgICAgIGRldGVjdGlvbk9yZGVyLmZvckVhY2goZnVuY3Rpb24gKGRldGVjdG9yTmFtZSkge1xuICAgICAgICAgIGlmIChfdGhpcy5kZXRlY3RvcnNbZGV0ZWN0b3JOYW1lXSkge1xuICAgICAgICAgICAgdmFyIGxvb2t1cCA9IF90aGlzLmRldGVjdG9yc1tkZXRlY3Rvck5hbWVdLmxvb2t1cChfdGhpcy5vcHRpb25zKTtcbiAgICAgICAgICAgIGlmIChsb29rdXAgJiYgdHlwZW9mIGxvb2t1cCA9PT0gJ3N0cmluZycpIGxvb2t1cCA9IFtsb29rdXBdO1xuICAgICAgICAgICAgaWYgKGxvb2t1cCkgZGV0ZWN0ZWQgPSBkZXRlY3RlZC5jb25jYXQobG9va3VwKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBmb3VuZCA9IHZvaWQgMDtcbiAgICAgICAgZGV0ZWN0ZWQuZm9yRWFjaChmdW5jdGlvbiAobG5nKSB7XG4gICAgICAgICAgaWYgKGZvdW5kKSByZXR1cm47XG4gICAgICAgICAgdmFyIGNsZWFuZWRMbmcgPSBfdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZVV0aWxzLmZvcm1hdExhbmd1YWdlQ29kZShsbmcpO1xuICAgICAgICAgIGlmIChfdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZVV0aWxzLmlzV2hpdGVsaXN0ZWQoY2xlYW5lZExuZykpIGZvdW5kID0gY2xlYW5lZExuZztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZvdW5kIHx8IHRoaXMuaTE4bk9wdGlvbnMuZmFsbGJhY2tMbmdbMF07XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnY2FjaGVVc2VyTGFuZ3VhZ2UnLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGNhY2hlVXNlckxhbmd1YWdlKGxuZywgY2FjaGVzKSB7XG4gICAgICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgICAgIGlmICghY2FjaGVzKSBjYWNoZXMgPSB0aGlzLm9wdGlvbnMuY2FjaGVzO1xuICAgICAgICBpZiAoIWNhY2hlcykgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmV4Y2x1ZGVDYWNoZUZvciAmJiB0aGlzLm9wdGlvbnMuZXhjbHVkZUNhY2hlRm9yLmluZGV4T2YobG5nKSA+IC0xKSByZXR1cm47XG4gICAgICAgIGNhY2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChjYWNoZU5hbWUpIHtcbiAgICAgICAgICBpZiAoX3RoaXMyLmRldGVjdG9yc1tjYWNoZU5hbWVdKSBfdGhpczIuZGV0ZWN0b3JzW2NhY2hlTmFtZV0uY2FjaGVVc2VyTGFuZ3VhZ2UobG5nLCBfdGhpczIub3B0aW9ucyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1dKTtcbiAgICByZXR1cm4gQnJvd3NlcjtcbiAgfSgpO1xuXG4gIEJyb3dzZXIudHlwZSA9ICdsYW5ndWFnZURldGVjdG9yJztcblxuICByZXR1cm4gQnJvd3NlcjtcblxufSkpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZXh0ZXJuYWwvaTE4bmV4dC9zY3JpcHRzL2kxOG5leHRCcm93c2VyTGFuZ3VhZ2VEZXRlY3Rvci5qc1xuLy8gbW9kdWxlIGlkID0gOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXX0=