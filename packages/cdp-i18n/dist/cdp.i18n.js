/*!
 * cdp.i18n.js 2.2.0
 *
 * Date: 2018-01-25T06:27:27.243Z
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
})(typeof self !== 'undefined' ? self : this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) { if (true) { !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(2), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_RESULT__ = (function ($, CDP) { return factory($, CDP); }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
                __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); } else { factory(root.jQuery || root.$, root.CDP || (root.CDP = {})); } }(this, function ($, CDP) {
var CDP;
(function (CDP) {
    // @internal Error code offset definition of `cdp-i18n`.
    var RESULT_CODE_BASE;
    (function (RESULT_CODE_BASE) {
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_I18N_DECLARERATION"] = 0] = "CDP_I18N_DECLARERATION";
        RESULT_CODE_BASE[RESULT_CODE_BASE["CDP_I18N"] = 3 * CDP._MODULE_RESULT_CODE_RANGE_CDP] = "CDP_I18N";
    })(RESULT_CODE_BASE = CDP.RESULT_CODE_BASE || (CDP.RESULT_CODE_BASE = {}));
    ///////////////////////////////////////////////////////////////////////
    // module error declaration:
    // @internal cdp.i18n 内のローカルコードオフセット値
    var LOCAL_CODE_BASE;
    (function (LOCAL_CODE_BASE) {
        LOCAL_CODE_BASE[LOCAL_CODE_BASE["I18N"] = 0] = "I18N";
    })(LOCAL_CODE_BASE || (LOCAL_CODE_BASE = {}));
    /* tslint:disable:max-line-length */
    // Error code definition of `cdp-i18n`.
    var RESULT_CODE;
    (function (RESULT_CODE) {
        RESULT_CODE[RESULT_CODE["ERROR_CDP_I18N_DECLARATION"] = 0] = "ERROR_CDP_I18N_DECLARATION";
        /** `en` [[CDP.initializeI18N]]() failer code. <br> `ja` [[CDP.initializeI18N]]() のエラーコード */
        RESULT_CODE[RESULT_CODE["ERROR_CDP_I18N_INITIALIZE_FAILED"] = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.CDP_I18N, LOCAL_CODE_BASE.I18N + 1, "i18n initialize failed.")] = "ERROR_CDP_I18N_INITIALIZE_FAILED";
    })(RESULT_CODE = CDP.RESULT_CODE || (CDP.RESULT_CODE = {}));
    /* tslint:enable:max-line-length */
})(CDP || (CDP = {}));

/* tslint:disable:max-line-length */
var CDP;
(function (CDP) {
    var Promise = CDP.Promise;
    var TAG = "[CDP.i18n] ";
    /**
     * @en initialize i18next. <br>
     *     It'll be usually called from framework.
     * @ja i18next の初期化 <br>
     *     通常は Framework が呼び出す。
     */
    function initializeI18N(settings) {
        return new Promise(function (resolve, reject) {
            var i18nSettings = settings || {};
            i18nSettings.options = i18nSettings.options || {};
            try {
                var i18nOptions_1 = (function (resources) {
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
                new Promise(function(resolve) { resolve(); }).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [__webpack_require__(4)]; ((function ($18Next) {
                    new Promise(function(resolve) { resolve(); }).then(function() { var __WEBPACK_AMD_REQUIRE_ARRAY__ = [
                        __webpack_require__(5),
                        __webpack_require__(6),
                        __webpack_require__(7),
                        __webpack_require__(8),
                        __webpack_require__(9),
                    ]; ((function (i18next, Backend, Cache, PostProcessor, LanguageDetector) {
                        i18next
                            .use(Backend)
                            .use(Cache)
                            .use(PostProcessor)
                            .use(LanguageDetector)
                            .init(i18nOptions_1, function (error, t) {
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
                    }).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}).catch(__webpack_require__.oe);
                }).apply(null, __WEBPACK_AMD_REQUIRE_ARRAY__));}).catch(__webpack_require__.oe);
            }
            catch (e) {
                return reject(e);
            }
        });
    }
    CDP.initializeI18N = initializeI18N;
    /**
     * @es get string resource for fallback.
     * @js Fallback 用ローカライズリソースの取得
     *
     * @internal
     * @returns
     *   - `en` fallback resource object
     *   - `ja` fallback リソースオブジェクト
     */
    function getLocaleFallbackResource(path) {
        var json;
        var error;
        $.ajax({
            url: CDP.toUrl(path),
            method: "GET",
            async: false,
            dataType: "json",
            success: function (data) {
                json = data;
            },
            error: function (xhr, status) {
                error = CDP.makeErrorInfo(CDP.RESULT_CODE.ERROR_CDP_I18N_INITIALIZE_FAILED, TAG, "ajax request failed. status: " + status);
            }
        });
        if (null != error) {
            throw error;
        }
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
        // .trim(): Trim the comma-separated parameters on the data-i18n attribute.
        if (k !== '') parse(target, k.trim(), opts);
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

  function ResourceStore(data) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { ns: ['translation'], defaultNS: 'translation' };
    classCallCheck(this, ResourceStore);

    var _this = possibleConstructorReturn(this, _EventEmitter.call(this));

    _this.data = data || {};
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

    var resolved = this.resolve(key, options);
    return resolved && resolved.res !== undefined;
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
    var _this2 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
      /* eslint prefer-rest-params: 0 */
      options = this.options.overloadTranslationOptionHandler(arguments);
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
    var resolved = this.resolve(keys, options);
    var res = resolved && resolved.res;
    var usedKey = resolved && resolved.usedKey || key;

    var resType = Object.prototype.toString.apply(res);
    var noObject = ['[object Number]', '[object Function]', '[object RegExp]'];
    var joinArrays = options.joinArrays !== undefined ? options.joinArrays : this.options.joinArrays;

    // object
    var handleAsObject = typeof res !== 'string' && typeof res !== 'boolean' && typeof res !== 'number';
    if (res && handleAsObject && noObject.indexOf(resType) < 0 && !(joinArrays && resType === '[object Array]')) {
      if (!options.returnObjects && !this.options.returnObjects) {
        this.logger.warn('accessing an object - but returnObjects options is not enabled!');
        return this.options.returnedObjectHandler ? this.options.returnedObjectHandler(usedKey, res, options) : 'key \'' + key + ' (' + this.language + ')\' returned an object instead of string.';
      }

      // if we got a separator we loop over children - else we just return object as is
      // as having it set to false means no hierarchy so no lookup for nested values
      if (options.keySeparator || this.options.keySeparator) {
        var copy$$1 = resType === '[object Array]' ? [] : {}; // apply child translation on a copy

        /* eslint no-restricted-syntax: 0 */
        for (var m in res) {
          if (Object.prototype.hasOwnProperty.call(res, m)) {
            copy$$1[m] = this.translate('' + usedKey + keySeparator + m, _extends({}, options, { joinArrays: false, ns: namespaces }));
          }
        }
        res = copy$$1;
      }
    } else if (joinArrays && resType === '[object Array]') {
      // array special treatment
      res = res.join(joinArrays);
      if (res) res = this.extendTranslation(res, keys, options);
    } else {
      // string, empty or null
      var usedDefault = false;
      var _usedKey = false;

      // fallback value
      if (!this.isValidLookup(res) && options.defaultValue !== undefined) {
        usedDefault = true;
        res = options.defaultValue;
      }
      if (!this.isValidLookup(res)) {
        _usedKey = true;
        res = key;
      }

      // save missing
      var updateMissing = options.defaultValue && options.defaultValue !== res && this.options.updateMissing;
      if (_usedKey || usedDefault || updateMissing) {
        this.logger.log(updateMissing ? 'updateKey' : 'missingKey', lng, namespace, key, updateMissing ? options.defaultValue : res);

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

        var send = function send(l, k) {
          if (_this2.options.missingKeyHandler) {
            _this2.options.missingKeyHandler(l, namespace, k, updateMissing ? options.defaultValue : res, updateMissing);
          } else if (_this2.backendConnector && _this2.backendConnector.saveMissing) {
            _this2.backendConnector.saveMissing(l, namespace, k, updateMissing ? options.defaultValue : res, updateMissing);
          }
          _this2.emit('missingKey', l, namespace, k, res);
        };

        if (this.options.saveMissing) {
          if (this.options.saveMissingPlurals && options.count) {
            lngs.forEach(function (l) {
              var plurals = _this2.pluralResolver.getPluralFormsOfKey(l, key);

              plurals.forEach(function (p) {
                return send([l], p);
              });
            });
          } else {
            send(lngs, key);
          }
        }
      }

      // extend
      res = this.extendTranslation(res, keys, options);

      // append namespace if still key
      if (_usedKey && res === key && this.options.appendNamespaceToMissingKey) res = namespace + ':' + key;

      // parseMissingKeyHandler
      if (_usedKey && this.options.parseMissingKeyHandler) res = this.options.parseMissingKeyHandler(res);
    }

    // return
    return res;
  };

  Translator.prototype.extendTranslation = function extendTranslation(res, key, options) {
    var _this3 = this;

    if (options.interpolation) this.interpolator.init(_extends({}, options, { interpolation: _extends({}, this.options.interpolation, options.interpolation) }));

    // interpolate
    var data = options.replace && typeof options.replace !== 'string' ? options.replace : options;
    if (this.options.interpolation.defaultVariables) data = _extends({}, this.options.interpolation.defaultVariables, data);
    res = this.interpolator.interpolate(res, data, options.lng || this.language);

    // nesting
    if (options.nest !== false) res = this.interpolator.nest(res, function () {
      return _this3.translate.apply(_this3, arguments);
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
    var _this4 = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var found = void 0;
    var usedKey = void 0;

    if (typeof keys === 'string') keys = [keys];

    // forEach possible key
    keys.forEach(function (k) {
      if (_this4.isValidLookup(found)) return;
      var extracted = _this4.extractFromKey(k, options);
      var key = extracted.key;
      usedKey = key;
      var namespaces = extracted.namespaces;
      if (_this4.options.fallbackNS) namespaces = namespaces.concat(_this4.options.fallbackNS);

      var needsPluralHandling = options.count !== undefined && typeof options.count !== 'string';
      var needsContextHandling = options.context !== undefined && typeof options.context === 'string' && options.context !== '';

      var codes = options.lngs ? options.lngs : _this4.languageUtils.toResolveHierarchy(options.lng || _this4.language);

      namespaces.forEach(function (ns) {
        if (_this4.isValidLookup(found)) return;

        codes.forEach(function (code) {
          if (_this4.isValidLookup(found)) return;

          var finalKey = key;
          var finalKeys = [finalKey];

          var pluralSuffix = void 0;
          if (needsPluralHandling) pluralSuffix = _this4.pluralResolver.getSuffix(code, options.count);

          // fallback for plural if context not found
          if (needsPluralHandling && needsContextHandling) finalKeys.push(finalKey + pluralSuffix);

          // get key for context if needed
          if (needsContextHandling) finalKeys.push(finalKey += '' + _this4.options.contextSeparator + options.context);

          // get key for plural if needed
          if (needsPluralHandling) finalKeys.push(finalKey += pluralSuffix);

          // iterate over finalKeys starting with most specific pluralkey (-> contextkey only) -> singularkey only
          var possibleKey = void 0;
          /* eslint no-cond-assign: 0 */
          while (possibleKey = finalKeys.pop()) {
            if (!_this4.isValidLookup(found)) {
              found = _this4.getResource(code, ns, possibleKey, options);
            }
          }
        });
      });
    });

    return { res: found, usedKey: usedKey };
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
var sets = [{ lngs: ['ach', 'ak', 'am', 'arn', 'br', 'fil', 'gun', 'ln', 'mfe', 'mg', 'mi', 'oc', 'pt', 'pt-BR', 'tg', 'ti', 'tr', 'uz', 'wa'], nr: [1, 2], fc: 1 }, { lngs: ['af', 'an', 'ast', 'az', 'bg', 'bn', 'ca', 'da', 'de', 'dev', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fi', 'fo', 'fur', 'fy', 'gl', 'gu', 'ha', 'he', 'hi', 'hu', 'hy', 'ia', 'it', 'kn', 'ku', 'lb', 'mai', 'ml', 'mn', 'mr', 'nah', 'nap', 'nb', 'ne', 'nl', 'nn', 'no', 'nso', 'pa', 'pap', 'pms', 'ps', 'pt-PT', 'rm', 'sco', 'se', 'si', 'so', 'son', 'sq', 'sv', 'sw', 'ta', 'te', 'tk', 'ur', 'yo'], nr: [1, 2], fc: 2 }, { lngs: ['ay', 'bo', 'cgg', 'fa', 'id', 'ja', 'jbo', 'ka', 'kk', 'km', 'ko', 'ky', 'lo', 'ms', 'sah', 'su', 'th', 'tt', 'ug', 'vi', 'wo', 'zh'], nr: [1], fc: 3 }, { lngs: ['be', 'bs', 'dz', 'hr', 'ru', 'sr', 'uk'], nr: [1, 2, 5], fc: 4 }, { lngs: ['ar'], nr: [0, 1, 2, 3, 11, 100], fc: 5 }, { lngs: ['cs', 'sk'], nr: [1, 2, 5], fc: 6 }, { lngs: ['csb', 'pl'], nr: [1, 2, 5], fc: 7 }, { lngs: ['cy'], nr: [1, 2, 3, 8], fc: 8 }, { lngs: ['fr'], nr: [1, 2], fc: 9 }, { lngs: ['ga'], nr: [1, 2, 3, 7, 11], fc: 10 }, { lngs: ['gd'], nr: [1, 2, 3, 20], fc: 11 }, { lngs: ['is'], nr: [1, 2], fc: 12 }, { lngs: ['jv'], nr: [0, 1], fc: 13 }, { lngs: ['kw'], nr: [1, 2, 3, 4], fc: 14 }, { lngs: ['lt'], nr: [1, 2, 10], fc: 15 }, { lngs: ['lv'], nr: [1, 2, 0], fc: 16 }, { lngs: ['mk'], nr: [1, 2], fc: 17 }, { lngs: ['mnk'], nr: [0, 1, 2], fc: 18 }, { lngs: ['mt'], nr: [1, 2, 11, 20], fc: 19 }, { lngs: ['or'], nr: [2, 1], fc: 2 }, { lngs: ['ro'], nr: [1, 2, 20], fc: 20 }, { lngs: ['sl'], nr: [5, 1, 2, 3], fc: 21 }];

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
    return this.rules[code] || this.rules[this.languageUtils.getLanguagePartFromCode(code)];
  };

  PluralResolver.prototype.needsPlural = function needsPlural(code) {
    var rule = this.getRule(code);

    return rule && rule.numbers.length > 1;
  };

  PluralResolver.prototype.getPluralFormsOfKey = function getPluralFormsOfKey(code, key) {
    var _this = this;

    var ret = [];

    var rule = this.getRule(code);

    rule.numbers.forEach(function (n) {
      var suffix = _this.getSuffix(code, n);
      ret.push('' + key + suffix);
    });

    return ret;
  };

  PluralResolver.prototype.getSuffix = function getSuffix(code, count) {
    var _this2 = this;

    var rule = this.getRule(code);

    if (rule) {
      // if (rule.numbers.length === 1) return ''; // only singular

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
        return _this2.options.prepend && suffix.toString() ? _this2.options.prepend + suffix.toString() : suffix.toString();
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

    this.maxReplaces = iOpts.maxReplaces ? iOpts.maxReplaces : 1000;

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
    var replaces = void 0;

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

    replaces = 0;
    // unescape if has unescapePrefix/Suffix
    /* eslint no-cond-assign: 0 */
    while (match = this.regexpUnescape.exec(str)) {
      value = handleFormat(match[1].trim());
      str = str.replace(match[0], value);
      this.regexpUnescape.lastIndex = 0;
      replaces++;
      if (replaces >= this.maxReplaces) {
        break;
      }
    }

    replaces = 0;
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
      replaces++;
      if (replaces >= this.maxReplaces) {
        break;
      }
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
    function handleHasOptions(key, inheritedOptions) {
      if (key.indexOf(',') < 0) return key;

      var p = key.split(',');
      key = p.shift();
      var optionsString = p.join(',');
      optionsString = this.interpolate(optionsString, clonedOptions);
      optionsString = optionsString.replace(/'/g, '"');

      try {
        clonedOptions = JSON.parse(optionsString);

        if (inheritedOptions) clonedOptions = _extends({}, inheritedOptions, clonedOptions);
      } catch (e) {
        this.logger.error('failed parsing options string in nesting for key ' + key, e);
      }

      return key;
    }

    // regular escape on demand
    while (match = this.nestingRegexp.exec(str)) {
      value = fc(handleHasOptions.call(this, match[1].trim(), clonedOptions), clonedOptions);

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
    _this.languageUtils = services.languageUtils;
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

    if (typeof languages === 'string') languages = this.languageUtils.toResolveHierarchy(languages);
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

    if (typeof languages === 'string') languages = this.languageUtils.toResolveHierarchy(languages);
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

  Connector.prototype.saveMissing = function saveMissing(languages, namespace, key, fallbackValue, isUpdate) {
    if (this.backend && this.backend.create) this.backend.create(languages, namespace, key, fallbackValue, null /* unused callback */, { isUpdate: isUpdate });

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
    updateMissing: false, // enable to update default values if different from translated value (only useful on initial development, or when keeping code as source of truth)
    saveMissingTo: 'fallback', // 'current' || 'all'
    saveMissingPlurals: true, // will save all forms not only singular key
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
      // defaultVariables: undefined // object that can have values to interpolate on - extends passed in interpolation data
      maxReplaces: 1000 // max replaces to prevent endless loop
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

  I18n.prototype.init = function init() {
    var _this2 = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var callback = arguments[1];

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }
    this.options = _extends({}, get$1(), this.options, transformOptions(options));

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
      _this4.translator.changeLanguage(l);

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
        if (!_this4.translator.language) _this4.translator.changeLanguage(l);

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

    var fixedT = function fixedT(key, opts) {
      for (var _len4 = arguments.length, rest = Array(_len4 > 2 ? _len4 - 2 : 0), _key4 = 2; _key4 < _len4; _key4++) {
        rest[_key4 - 2] = arguments[_key4];
      }

      var options = _extends({}, opts);
      if ((typeof opts === 'undefined' ? 'undefined' : _typeof(opts)) !== 'object') {
        options = _this5.options.overloadTranslationOptionHandler([key, opts].concat(rest));
      }

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
    var clone = new I18n(mergedOptions);
    var membersToCopy = ['store', 'services', 'language'];
    membersToCopy.forEach(function (m) {
      clone[m] = _this7[m];
    });
    clone.translator = new Translator(clone.services, clone.options);
    clone.translator.on('*', function (event) {
      for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
        args[_key5 - 1] = arguments[_key5];
      }

      clone.emit.apply(clone, [event].concat(args));
    });
    clone.init(mergedOptions, callback);
    clone.translator.options = clone.options; // sync options

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
    if (x.overrideMimeType) {
      x.overrideMimeType("application/json");
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
    addPath: '/locales/add/{{lng}}/{{ns}}',
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

  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      _classCallCheck(this, Browser);

      this.type = 'languageDetector';
      this.detectors = {};

      this.init(services, options);
    }

    _createClass(Browser, [{
      key: 'init',
      value: function init(services) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var i18nOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCBmN2UxNTJjYzBlMjZkNTg2ZTdhYSIsImNkcDovLy9DRFAvRXJyb3JEZWZzLnRzIiwiY2RwOi8vL0NEUC9pMThuLnRzIiwid2VicGFjazovLy9leHRlcm5hbCB7XCJyb290XCI6XCJqUXVlcnlcIixcImNvbW1vbmpzXCI6XCJqcXVlcnlcIixcImNvbW1vbmpzMlwiOlwianF1ZXJ5XCIsXCJhbWRcIjpcImpxdWVyeVwifSIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwge1wicm9vdFwiOlwiQ0RQXCIsXCJjb21tb25qc1wiOlwiY2RwLmNvcmVcIixcImNvbW1vbmpzMlwiOlwiY2RwLmNvcmVcIixcImFtZFwiOlwiY2RwLmNvcmVcIn0iLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIHtcInJvb3RcIjpcIkNEUFwiLFwiY29tbW9uanNcIjpcImNkcC5wcm9taXNlXCIsXCJjb21tb25qczJcIjpcImNkcC5wcm9taXNlXCIsXCJhbWRcIjpcImNkcC5wcm9taXNlXCJ9Iiwid2VicGFjazovLy9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvanF1ZXJ5LWkxOG5leHQuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsL2kxOG5leHQvc2NyaXB0cy9pMThuZXh0LmpzIiwid2VicGFjazovLy9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvaTE4bmV4dFhIUkJhY2tlbmQuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsL2kxOG5leHQvc2NyaXB0cy9pMThuZXh0TG9jYWxTdG9yYWdlQ2FjaGUuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsL2kxOG5leHQvc2NyaXB0cy9pMThuZXh0U3ByaW50ZlBvc3RQcm9jZXNzb3IuanMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsL2kxOG5leHQvc2NyaXB0cy9pMThuZXh0QnJvd3Nlckxhbmd1YWdlRGV0ZWN0b3IuanMiXSwibmFtZXMi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QUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esa0RBQWtEOztBQUVsRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlEOztBQUV6RDs7QUFFQTs7QUFFQSx1RkFBdUY7QUFDdkYsdUZBQXVGOztBQUV2Rjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxLQUFLOztBQUVMO0FBQ0EsR0FBRzs7QUFFSDs7QUFFQTs7QUFFQSxDQUFDLEciLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJqcXVlcnlcIiksIHJlcXVpcmUoXCJjZHAuY29yZVwiKSwgcmVxdWlyZShcImNkcC5wcm9taXNlXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcImpxdWVyeVwiLCBcImNkcC5jb3JlXCIsIFwiY2RwLnByb21pc2VcIl0sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiQ0RQXCJdID0gZmFjdG9yeShyZXF1aXJlKFwianF1ZXJ5XCIpLCByZXF1aXJlKFwiY2RwLmNvcmVcIiksIHJlcXVpcmUoXCJjZHAucHJvbWlzZVwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiQ0RQXCJdID0gZmFjdG9yeShyb290W1wialF1ZXJ5XCJdLCByb290W1wiQ0RQXCJdLCByb290W1wiQ0RQXCJdKTtcbn0pKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyA/IHNlbGYgOiB0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXywgX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8yX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfM19fKSB7XG5yZXR1cm4gXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGY3ZTE1MmNjMGUyNmQ1ODZlN2FhIiwibmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgLy8gQGludGVybmFsIEVycm9yIGNvZGUgb2Zmc2V0IGRlZmluaXRpb24gb2YgYGNkcC1pMThuYC5cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFX0JBU0Uge1xyXG4gICAgICAgIENEUF9JMThOX0RFQ0xBUkVSQVRJT04gPSAwLCAvLyBUUzI0MzIg5a++562WXHJcbiAgICAgICAgQ0RQX0kxOE4gPSAzICogX01PRFVMRV9SRVNVTFRfQ09ERV9SQU5HRV9DRFAsXHJcbiAgICB9XHJcblxyXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuICAgIC8vIG1vZHVsZSBlcnJvciBkZWNsYXJhdGlvbjpcclxuXHJcbiAgICAvLyBAaW50ZXJuYWwgY2RwLmkxOG4g5YaF44Gu44Ot44O844Kr44Or44Kz44O844OJ44Kq44OV44K744OD44OI5YCkXHJcbiAgICBlbnVtIExPQ0FMX0NPREVfQkFTRSB7XHJcbiAgICAgICAgSTE4TiA9IDAsXHJcbiAgICB9XHJcblxyXG4gICAgLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXHJcbiAgICAvLyBFcnJvciBjb2RlIGRlZmluaXRpb24gb2YgYGNkcC1pMThuYC5cclxuICAgIGV4cG9ydCBlbnVtIFJFU1VMVF9DT0RFIHtcclxuICAgICAgICBFUlJPUl9DRFBfSTE4Tl9ERUNMQVJBVElPTiA9IDAsIC8vIFRTMjQzMiDlr77nrZZcclxuICAgICAgICAvKiogYGVuYCBbW0NEUC5pbml0aWFsaXplSTE4Tl1dKCkgZmFpbGVyIGNvZGUuIDxicj4gYGphYCBbW0NEUC5pbml0aWFsaXplSTE4Tl1dKCkg44Gu44Ko44Op44O844Kz44O844OJICovXHJcbiAgICAgICAgRVJST1JfQ0RQX0kxOE5fSU5JVElBTElaRV9GQUlMRUQgPSBERUNMQVJFX0VSUk9SX0NPREUoUkVTVUxUX0NPREVfQkFTRS5DRFBfSTE4TiwgTE9DQUxfQ09ERV9CQVNFLkkxOE4gKyAxLCBcImkxOG4gaW5pdGlhbGl6ZSBmYWlsZWQuXCIpLFxyXG4gICAgfVxyXG4gICAgLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gY2RwOi8vL0NEUC9FcnJvckRlZnMudHMiLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vQHR5cGVzL2kxOG5leHQuZC50c1wiIC8+XHJcbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xyXG5cclxubmFtZXNwYWNlIENEUCB7XHJcblxyXG4gICAgaW1wb3J0IFByb21pc2UgPSBDRFAuUHJvbWlzZTtcclxuICAgIGltcG9ydCBJMThuZXh0ID0gaTE4bmV4dC5pMThuO1xyXG5cclxuICAgIGV4cG9ydCBuYW1lc3BhY2UgSTE4TiB7XHJcbiAgICAgICAgZXhwb3J0IHR5cGUgSTE4biA9IEkxOG5leHQuaTE4bjtcclxuICAgICAgICBleHBvcnQgdHlwZSBPcHRpb25zID0gSTE4bmV4dC5Jbml0T3B0aW9ucyAmIHsgW2tleXM6IHN0cmluZ106IGFueSB9O1xyXG4gICAgICAgIGV4cG9ydCB0eXBlIFRyYW5zbGF0aW9uT3B0aW9ucyA9IEkxOG5leHQuVHJhbnNsYXRpb25PcHRpb25zO1xyXG4gICAgICAgIGV4cG9ydCB0eXBlIFRyYW5zbGF0aW9uRnVuY3Rpb24gPSBJMThuZXh0LlRyYW5zbGF0aW9uRnVuY3Rpb247XHJcbiAgICAgICAgZXhwb3J0IHR5cGUgSW50ZXJwb2xhdGlvbk9wdGlvbnMgPSBJMThuZXh0LkludGVycG9sYXRpb25PcHRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IFRBRyA9IFwiW0NEUC5pMThuXSBcIjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBEaXJlY3QgYWNjZXNzb3IgZm9yIGkxOG5leHQgb2JqZWN0LlxyXG4gICAgICogQGphIGkxOG5leHQg44G444Gu44OA44Kk44Os44Kv44OI44Ki44Kv44K744K5XHJcbiAgICAgKi9cclxuICAgIGV4cG9ydCBsZXQgaTE4bjogSTE4Ti5JMThuO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE9wdGlvbnMgaW50ZXJmYWNlIGZvciBsb2NhbGl6ZSBzZXR0aW5nc1xyXG4gICAgICogQGphIOODreODvOOCq+ODqeOCpOOCuuioreWumueUqOOCquODl+OCt+ODp+ODs1xyXG4gICAgICovXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEkxOE5TZXR0aW5ncyB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQGVzIGZhbGxiYWNrIHN0cmluZyByZXNvdXJjZSBzZXR0aW5nIHdoZW4gYXV0b21hdGljIHJlc29sdXRpb24gZmFpbGVkLlxyXG4gICAgICAgICAqIEBqYSDoh6rli5Xop6PmsbrjgafjgY3jgarjgYvjgaPjgZ/jgajjgY3jgavkvb/nlKjjgZnjgovjg6rjgr3jg7zjgrlcclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIEBleGFtcGxlIDxicj5cclxuICAgICAgICAgKlxyXG4gICAgICAgICAqIGBgYHRzXHJcbiAgICAgICAgICogIGVuOiB7XHJcbiAgICAgICAgICogICAgICBtZXNzYWdlczogXCIvcmVzL2xvY2FsZXMvbWVzc2FnZXMuZW4tVVMuanNvblwiLFxyXG4gICAgICAgICAqICB9LFxyXG4gICAgICAgICAqICBqYToge1xyXG4gICAgICAgICAqICAgICAgbWVzc2FnZXM6IFwiL3Jlcy9sb2NhbGVzL21lc3NhZ2VzLmphLUpQLmpzb25cIixcclxuICAgICAgICAgKiAgfSxcclxuICAgICAgICAgKiBgYGBcclxuICAgICAgICAgKi9cclxuICAgICAgICBmYWxsYmFja1Jlc291cmNlcz86IHsgW2xuZzogc3RyaW5nXTogeyBbbnM6IHN0cmluZ106IHN0cmluZyB9IH07XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEBlcyBzZXQgcHJlbG9hZCByZXNvdXJjZSBuYW1lXHJcbiAgICAgICAgICogQGphIHByZWxvYWQg44GZ44KL44Oq44K944O844K55oyH5a6aXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAZXhhbXBsZSA8YnI+XHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBgYGB0c1xyXG4gICAgICAgICAqICBwcmVsb2FkOiBbXHJcbiAgICAgICAgICogICAgICBcImVuLVVTXCIsXHJcbiAgICAgICAgICogICAgICBcImphLUpQXCIsXHJcbiAgICAgICAgICogIF0sXHJcbiAgICAgICAgICogYGBgXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJlbG9hZD86IHN0cmluZ1tdO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBAZXMgaTE4bmV4dCByYXcgb3B0aW9uc1xyXG4gICAgICAgICAqIEBqYSBpMThuZXh0IOOBjOaPkOS+m+OBmeOCi+OCquODl+OCt+ODp+ODs1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIG9wdGlvbnM/OiBJMThOLk9wdGlvbnM7XHJcbiAgICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGluaXRpYWxpemUgaTE4bmV4dC4gPGJyPlxyXG4gICAgICogICAgIEl0J2xsIGJlIHVzdWFsbHkgY2FsbGVkIGZyb20gZnJhbWV3b3JrLlxyXG4gICAgICogQGphIGkxOG5leHQg44Gu5Yid5pyf5YyWIDxicj5cclxuICAgICAqICAgICDpgJrluLjjga8gRnJhbWV3b3JrIOOBjOWRvOOBs+WHuuOBmeOAglxyXG4gICAgICovXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZUkxOE4oc2V0dGluZ3M/OiBJMThOU2V0dGluZ3MpOiBJUHJvbWlzZUJhc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaTE4blNldHRpbmdzOiBJMThOU2V0dGluZ3MgPSBzZXR0aW5ncyB8fCB7fTtcclxuICAgICAgICAgICAgaTE4blNldHRpbmdzLm9wdGlvbnMgPSBpMThuU2V0dGluZ3Mub3B0aW9ucyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpMThuT3B0aW9uczogSTE4Ti5PcHRpb25zID0gKChyZXNvdXJjZXM6IHsgW2xuZzogc3RyaW5nXTogeyBbbnM6IHN0cmluZ106IHN0cmluZyB9IH0pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgbG5nIGluIHJlc291cmNlcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc291cmNlcy5oYXNPd25Qcm9wZXJ0eShsbmcpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBucyBpbiByZXNvdXJjZXNbbG5nXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzb3VyY2VzW2xuZ10uaGFzT3duUHJvcGVydHkobnMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvdXJjZXNbbG5nXVtuc10gPSBnZXRMb2NhbGVGYWxsYmFja1Jlc291cmNlKHJlc291cmNlc1tsbmddW25zXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaTE4blNldHRpbmdzLm9wdGlvbnMucmVzb3VyY2VzID0gPGFueT5yZXNvdXJjZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBpMThuU2V0dGluZ3Mub3B0aW9ucztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTE4blNldHRpbmdzLm9wdGlvbnM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkoaTE4blNldHRpbmdzLmZhbGxiYWNrUmVzb3VyY2VzKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlKFtcImpxdWVyeUkxOG5leHRcIl0sICgkMThOZXh0OiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlKFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpMThuZXh0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaTE4bmV4dFhIUkJhY2tlbmRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpMThuZXh0TG9jYWxTdG9yYWdlQ2FjaGVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpMThuZXh0U3ByaW50ZlBvc3RQcm9jZXNzb3JcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpMThuZXh0QnJvd3Nlckxhbmd1YWdlRGV0ZWN0b3JcIixcclxuICAgICAgICAgICAgICAgICAgICBdLCAoaTE4bmV4dDogSTE4Ti5JMThuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICwgQmFja2VuZDogYW55XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICwgQ2FjaGU6IGFueVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAsIFBvc3RQcm9jZXNzb3I6IGFueVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAsIExhbmd1YWdlRGV0ZWN0b3I6IGFueVxyXG4gICAgICAgICAgICAgICAgICAgICkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaTE4bmV4dFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51c2UoQmFja2VuZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXNlKENhY2hlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC51c2UoUG9zdFByb2Nlc3NvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudXNlKExhbmd1YWdlRGV0ZWN0b3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLmluaXQoaTE4bk9wdGlvbnMsIChlcnJvcjogYW55LCB0OiBJMThOLlRyYW5zbGF0aW9uRnVuY3Rpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJDE4TmV4dC5pbml0KGkxOG5leHQsICQsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHROYW1lOiBcInRcIiwgICAgICAgICAgICAgICAgICAgICAgICAgLy8gLS0+IGFwcGVuZHMgJC50ID0gaTE4bmV4dC50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpMThuTmFtZTogXCJpMThuXCIsICAgICAgICAgICAgICAgICAgIC8vIC0tPiBhcHBlbmRzICQuaTE4biA9IGkxOG5leHRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZU5hbWU6IFwibG9jYWxpemVcIiwgICAgICAgICAgICAgLy8gLS0+IGFwcGVuZHMgJChzZWxlY3RvcikubG9jYWxpemUob3B0cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RvckF0dHI6IFwiZGF0YS1pMThuXCIsICAgICAgICAgIC8vIHNlbGVjdG9yIGZvciB0cmFuc2xhdGluZyBlbGVtZW50c1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0QXR0cjogXCJpMThuLXRhcmdldFwiLCAgICAgICAgICAvLyBkYXRhLSgpIGF0dHJpYnV0ZSB0byBncmFiIHRhcmdldCBlbGVtZW50IHRvIHRyYW5zbGF0ZSAoaWYgZGlmZnJlbnQgdGhlbiBpdHNlbGYpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRpb25zQXR0cjogXCJpMThuLW9wdGlvbnNcIiwgICAgICAgIC8vIGRhdGEtKCkgYXR0cmlidXRlIHRoYXQgY29udGFpbnMgb3B0aW9ucywgd2lsbCBsb2FkL3NldCBpZiB1c2VPcHRpb25zQXR0ciA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZU9wdGlvbnNBdHRyOiBmYWxzZSwgICAgICAgICAgICAgIC8vIG5vIHVzZSBvcHRpb25zQXR0clxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VEZWZhdWx0VmFsdWVGcm9tQ29udGVudDogdHJ1ZSAgLy8gcGFyc2VzIGRlZmF1bHQgdmFsdWVzIGZyb20gY29udGVudCBlbGUudmFsIG9yIGVsZS50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpMThuZXh0IDMuNC4xOiByZXNvdXJjZXMg44GM5oyH5a6a44GV44KM44KL44GoIHByZWxvYWQg44GM6Kqt44G/6L6844G+44KM44Gq44GE44Gf44KB44CB5YaN6Kqt44G/6L6844G/5Yem55CG44KS6KGM44GGLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaTE4bmV4dC5vcHRpb25zLnJlc291cmNlcyAmJiBpMThuZXh0Lm9wdGlvbnMucHJlbG9hZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3B0aW9ucyDjgYvjgonjg5fjg63jg5Hjg4bjgqPjgpLkuIDml6bliYrpmaQuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBfcHJlbG9hZCA9IGkxOG5leHQub3B0aW9ucy5wcmVsb2FkO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgX3Jlc291cmNlcyA9IGkxOG5leHQub3B0aW9ucy5yZXNvdXJjZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgaTE4bmV4dC5vcHRpb25zLnJlc291cmNlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBpMThuZXh0Lm9wdGlvbnMucHJlbG9hZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkxOG5leHQubG9hZExhbmd1YWdlcyhfcHJlbG9hZCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9wdGlvbnMg44KS5YWD44Gr5oi744GZXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaTE4bmV4dC5vcHRpb25zLnJlc291cmNlcyA9IF9yZXNvdXJjZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaTE4bmV4dC5vcHRpb25zLnByZWxvYWQgPSBfcHJlbG9hZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDRFAuaTE4biA9IGkxOG5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBDRFAuaTE4biA9IGkxOG5leHQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVzIGdldCBzdHJpbmcgcmVzb3VyY2UgZm9yIGZhbGxiYWNrLlxyXG4gICAgICogQGpzIEZhbGxiYWNrIOeUqOODreODvOOCq+ODqeOCpOOCuuODquOCveODvOOCueOBruWPluW+l1xyXG4gICAgICpcclxuICAgICAqIEBpbnRlcm5hbFxyXG4gICAgICogQHJldHVybnNcclxuICAgICAqICAgLSBgZW5gIGZhbGxiYWNrIHJlc291cmNlIG9iamVjdFxyXG4gICAgICogICAtIGBqYWAgZmFsbGJhY2sg44Oq44K944O844K544Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldExvY2FsZUZhbGxiYWNrUmVzb3VyY2UocGF0aDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICBsZXQganNvbjogSlNPTjtcclxuICAgICAgICBsZXQgZXJyb3I6IEVycm9ySW5mbztcclxuICAgICAgICAkLmFqYXgoe1xyXG4gICAgICAgICAgICB1cmw6IENEUC50b1VybChwYXRoKSxcclxuICAgICAgICAgICAgbWV0aG9kOiBcIkdFVFwiLFxyXG4gICAgICAgICAgICBhc3luYzogZmFsc2UsXHJcbiAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcclxuICAgICAgICAgICAgc3VjY2VzczogKGRhdGE6IEpTT04pID0+IHtcclxuICAgICAgICAgICAgICAgIGpzb24gPSBkYXRhO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlcnJvcjogKHhocjogSlF1ZXJ5WEhSLCBzdGF0dXM6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBtYWtlRXJyb3JJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIFJFU1VMVF9DT0RFLkVSUk9SX0NEUF9JMThOX0lOSVRJQUxJWkVfRkFJTEVELFxyXG4gICAgICAgICAgICAgICAgICAgIFRBRyxcclxuICAgICAgICAgICAgICAgICAgICBcImFqYXggcmVxdWVzdCBmYWlsZWQuIHN0YXR1czogXCIgKyBzdGF0dXNcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKG51bGwgIT0gZXJyb3IpIHtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ganNvbjtcclxuICAgIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cclxuLy8ganF1ZXJ5LWkxOG5leHQgZXh0ZW5zaW9uc1xyXG5cclxuaW50ZXJmYWNlIEpRdWVyeVN0YXRpYyB7XHJcbiAgICBpMThuOiBDRFAuSTE4Ti5JMThuO1xyXG4gICAgdDogKGtleTogc3RyaW5nLCBvcHRpb25zPzogQ0RQLkkxOE4uT3B0aW9ucykgPT4gc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSlF1ZXJ5IHtcclxuICAgIGxvY2FsaXplOiAob3B0aW9ucz86IENEUC5JMThOLlRyYW5zbGF0aW9uT3B0aW9ucykgPT4gSlF1ZXJ5O1xyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xyXG4vLyBjZHAuaTE4biBkZWNsYXJhdGlvblxyXG5cclxuZGVjbGFyZSBtb2R1bGUgXCJjZHAuaTE4blwiIHtcclxuICAgIGV4cG9ydCA9IENEUDtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gY2RwOi8vL0NEUC9pMThuLnRzIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFXzFfXztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCB7XCJyb290XCI6XCJqUXVlcnlcIixcImNvbW1vbmpzXCI6XCJqcXVlcnlcIixcImNvbW1vbmpzMlwiOlwianF1ZXJ5XCIsXCJhbWRcIjpcImpxdWVyeVwifVxuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfMl9fO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIHtcInJvb3RcIjpcIkNEUFwiLFwiY29tbW9uanNcIjpcImNkcC5jb3JlXCIsXCJjb21tb25qczJcIjpcImNkcC5jb3JlXCIsXCJhbWRcIjpcImNkcC5jb3JlXCJ9XG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV8zX187XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwge1wicm9vdFwiOlwiQ0RQXCIsXCJjb21tb25qc1wiOlwiY2RwLnByb21pc2VcIixcImNvbW1vbmpzMlwiOlwiY2RwLnByb21pc2VcIixcImFtZFwiOlwiY2RwLnByb21pc2VcIn1cbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsLmpxdWVyeUkxOG5leHQgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbnZhciBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldOyBmb3IgKHZhciBrZXkgaW4gc291cmNlKSB7IGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7IHRhcmdldFtrZXldID0gc291cmNlW2tleV07IH0gfSB9IHJldHVybiB0YXJnZXQ7IH07XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgdE5hbWU6ICd0JyxcbiAgaTE4bk5hbWU6ICdpMThuJyxcbiAgaGFuZGxlTmFtZTogJ2xvY2FsaXplJyxcbiAgc2VsZWN0b3JBdHRyOiAnZGF0YS1pMThuJyxcbiAgdGFyZ2V0QXR0cjogJ2kxOG4tdGFyZ2V0JyxcbiAgb3B0aW9uc0F0dHI6ICdpMThuLW9wdGlvbnMnLFxuICB1c2VPcHRpb25zQXR0cjogZmFsc2UsXG4gIHBhcnNlRGVmYXVsdFZhbHVlRnJvbUNvbnRlbnQ6IHRydWVcbn07XG5cbmZ1bmN0aW9uIGluaXQoaTE4bmV4dCwgJCkge1xuICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cblxuICBvcHRpb25zID0gX2V4dGVuZHMoe30sIGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICBmdW5jdGlvbiBwYXJzZShlbGUsIGtleSwgb3B0cykge1xuICAgIGlmIChrZXkubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICB2YXIgYXR0ciA9ICd0ZXh0JztcblxuICAgIGlmIChrZXkuaW5kZXhPZignWycpID09PSAwKSB7XG4gICAgICB2YXIgcGFydHMgPSBrZXkuc3BsaXQoJ10nKTtcbiAgICAgIGtleSA9IHBhcnRzWzFdO1xuICAgICAgYXR0ciA9IHBhcnRzWzBdLnN1YnN0cigxLCBwYXJ0c1swXS5sZW5ndGggLSAxKTtcbiAgICB9XG5cbiAgICBpZiAoa2V5LmluZGV4T2YoJzsnKSA9PT0ga2V5Lmxlbmd0aCAtIDEpIHtcbiAgICAgIGtleSA9IGtleS5zdWJzdHIoMCwga2V5Lmxlbmd0aCAtIDIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4dGVuZERlZmF1bHQobywgdmFsKSB7XG4gICAgICBpZiAoIW9wdGlvbnMucGFyc2VEZWZhdWx0VmFsdWVGcm9tQ29udGVudCkgcmV0dXJuIG87XG4gICAgICByZXR1cm4gX2V4dGVuZHMoe30sIG8sIHsgZGVmYXVsdFZhbHVlOiB2YWwgfSk7XG4gICAgfVxuXG4gICAgaWYgKGF0dHIgPT09ICdodG1sJykge1xuICAgICAgZWxlLmh0bWwoaTE4bmV4dC50KGtleSwgZXh0ZW5kRGVmYXVsdChvcHRzLCBlbGUuaHRtbCgpKSkpO1xuICAgIH0gZWxzZSBpZiAoYXR0ciA9PT0gJ3RleHQnKSB7XG4gICAgICBlbGUudGV4dChpMThuZXh0LnQoa2V5LCBleHRlbmREZWZhdWx0KG9wdHMsIGVsZS50ZXh0KCkpKSk7XG4gICAgfSBlbHNlIGlmIChhdHRyID09PSAncHJlcGVuZCcpIHtcbiAgICAgIGVsZS5wcmVwZW5kKGkxOG5leHQudChrZXksIGV4dGVuZERlZmF1bHQob3B0cywgZWxlLmh0bWwoKSkpKTtcbiAgICB9IGVsc2UgaWYgKGF0dHIgPT09ICdhcHBlbmQnKSB7XG4gICAgICBlbGUuYXBwZW5kKGkxOG5leHQudChrZXksIGV4dGVuZERlZmF1bHQob3B0cywgZWxlLmh0bWwoKSkpKTtcbiAgICB9IGVsc2UgaWYgKGF0dHIuaW5kZXhPZignZGF0YS0nKSA9PT0gMCkge1xuICAgICAgdmFyIGRhdGFBdHRyID0gYXR0ci5zdWJzdHIoJ2RhdGEtJy5sZW5ndGgpO1xuICAgICAgdmFyIHRyYW5zbGF0ZWQgPSBpMThuZXh0LnQoa2V5LCBleHRlbmREZWZhdWx0KG9wdHMsIGVsZS5kYXRhKGRhdGFBdHRyKSkpO1xuXG4gICAgICAvLyB3ZSBjaGFuZ2UgaW50byB0aGUgZGF0YSBjYWNoZVxuICAgICAgZWxlLmRhdGEoZGF0YUF0dHIsIHRyYW5zbGF0ZWQpO1xuICAgICAgLy8gd2UgY2hhbmdlIGludG8gdGhlIGRvbVxuICAgICAgZWxlLmF0dHIoYXR0ciwgdHJhbnNsYXRlZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZS5hdHRyKGF0dHIsIGkxOG5leHQudChrZXksIGV4dGVuZERlZmF1bHQob3B0cywgZWxlLmF0dHIoYXR0cikpKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbG9jYWxpemUoZWxlLCBvcHRzKSB7XG4gICAgdmFyIGtleSA9IGVsZS5hdHRyKG9wdGlvbnMuc2VsZWN0b3JBdHRyKTtcbiAgICBpZiAoIWtleSAmJiB0eXBlb2Yga2V5ICE9PSAndW5kZWZpbmVkJyAmJiBrZXkgIT09IGZhbHNlKSBrZXkgPSBlbGUudGV4dCgpIHx8IGVsZS52YWwoKTtcbiAgICBpZiAoIWtleSkgcmV0dXJuO1xuXG4gICAgdmFyIHRhcmdldCA9IGVsZSxcbiAgICAgICAgdGFyZ2V0U2VsZWN0b3IgPSBlbGUuZGF0YShvcHRpb25zLnRhcmdldEF0dHIpO1xuXG4gICAgaWYgKHRhcmdldFNlbGVjdG9yKSB0YXJnZXQgPSBlbGUuZmluZCh0YXJnZXRTZWxlY3RvcikgfHwgZWxlO1xuXG4gICAgaWYgKCFvcHRzICYmIG9wdGlvbnMudXNlT3B0aW9uc0F0dHIgPT09IHRydWUpIG9wdHMgPSBlbGUuZGF0YShvcHRpb25zLm9wdGlvbnNBdHRyKTtcblxuICAgIG9wdHMgPSBvcHRzIHx8IHt9O1xuXG4gICAgaWYgKGtleS5pbmRleE9mKCc7JykgPj0gMCkge1xuICAgICAgdmFyIGtleXMgPSBrZXkuc3BsaXQoJzsnKTtcblxuICAgICAgJC5lYWNoKGtleXMsIGZ1bmN0aW9uIChtLCBrKSB7XG4gICAgICAgIC8vIC50cmltKCk6IFRyaW0gdGhlIGNvbW1hLXNlcGFyYXRlZCBwYXJhbWV0ZXJzIG9uIHRoZSBkYXRhLWkxOG4gYXR0cmlidXRlLlxuICAgICAgICBpZiAoayAhPT0gJycpIHBhcnNlKHRhcmdldCwgay50cmltKCksIG9wdHMpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhcnNlKHRhcmdldCwga2V5LCBvcHRzKTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy51c2VPcHRpb25zQXR0ciA9PT0gdHJ1ZSkge1xuICAgICAgdmFyIGNsb25lID0ge307XG4gICAgICBjbG9uZSA9IF9leHRlbmRzKHsgY2xvbmU6IGNsb25lIH0sIG9wdHMpO1xuXG4gICAgICBkZWxldGUgY2xvbmUubG5nO1xuICAgICAgZWxlLmRhdGEob3B0aW9ucy5vcHRpb25zQXR0ciwgY2xvbmUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZShvcHRzKSB7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBsb2NhbGl6ZSBlbGVtZW50IGl0c2VsZlxuICAgICAgbG9jYWxpemUoJCh0aGlzKSwgb3B0cyk7XG5cbiAgICAgIC8vIGxvY2FsaXplIGNoaWxkcmVuXG4gICAgICB2YXIgZWxlbWVudHMgPSAkKHRoaXMpLmZpbmQoJ1snICsgb3B0aW9ucy5zZWxlY3RvckF0dHIgKyAnXScpO1xuICAgICAgZWxlbWVudHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvY2FsaXplKCQodGhpcyksIG9wdHMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gJC50ICQuaTE4biBzaG9ydGN1dFxuICAkW29wdGlvbnMudE5hbWVdID0gaTE4bmV4dC50LmJpbmQoaTE4bmV4dCk7XG4gICRbb3B0aW9ucy5pMThuTmFtZV0gPSBpMThuZXh0O1xuXG4gIC8vIHNlbGVjdG9yIGZ1bmN0aW9uICQobXlTZWxlY3RvcikubG9jYWxpemUob3B0cyk7XG4gICQuZm5bb3B0aW9ucy5oYW5kbGVOYW1lXSA9IGhhbmRsZTtcbn1cblxudmFyIGluZGV4ID0ge1xuICBpbml0OiBpbml0XG59O1xuXG5yZXR1cm4gaW5kZXg7XG5cbn0pKSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvanF1ZXJ5LWkxOG5leHQuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLmkxOG5leHQgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBjbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59O1xuXG5cblxuXG5cblxuXG5cblxudmFyIF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoc291cmNlLCBrZXkpKSB7XG4gICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn07XG5cblxuXG52YXIgaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuID0gZnVuY3Rpb24gKHNlbGYsIGNhbGwpIHtcbiAgaWYgKCFzZWxmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG59O1xuXG5cblxuXG5cbnZhciBzbGljZWRUb0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBzbGljZUl0ZXJhdG9yKGFyciwgaSkge1xuICAgIHZhciBfYXJyID0gW107XG4gICAgdmFyIF9uID0gdHJ1ZTtcbiAgICB2YXIgX2QgPSBmYWxzZTtcbiAgICB2YXIgX2UgPSB1bmRlZmluZWQ7XG5cbiAgICB0cnkge1xuICAgICAgZm9yICh2YXIgX2kgPSBhcnJbU3ltYm9sLml0ZXJhdG9yXSgpLCBfczsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgICBfYXJyLnB1c2goX3MudmFsdWUpO1xuXG4gICAgICAgIGlmIChpICYmIF9hcnIubGVuZ3RoID09PSBpKSBicmVhaztcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIF9kID0gdHJ1ZTtcbiAgICAgIF9lID0gZXJyO1xuICAgIH0gZmluYWxseSB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdKSBfaVtcInJldHVyblwiXSgpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgaWYgKF9kKSB0aHJvdyBfZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gX2FycjtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoYXJyLCBpKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgcmV0dXJuIGFycjtcbiAgICB9IGVsc2UgaWYgKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QoYXJyKSkge1xuICAgICAgcmV0dXJuIHNsaWNlSXRlcmF0b3IoYXJyLCBpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIik7XG4gICAgfVxuICB9O1xufSgpO1xuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgdG9Db25zdW1hYmxlQXJyYXkgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IEFycmF5KGFyci5sZW5ndGgpOyBpIDwgYXJyLmxlbmd0aDsgaSsrKSBhcnIyW2ldID0gYXJyW2ldO1xuXG4gICAgcmV0dXJuIGFycjI7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oYXJyKTtcbiAgfVxufTtcblxudmFyIGNvbnNvbGVMb2dnZXIgPSB7XG4gIHR5cGU6ICdsb2dnZXInLFxuXG4gIGxvZzogZnVuY3Rpb24gbG9nKGFyZ3MpIHtcbiAgICB0aGlzLm91dHB1dCgnbG9nJywgYXJncyk7XG4gIH0sXG4gIHdhcm46IGZ1bmN0aW9uIHdhcm4oYXJncykge1xuICAgIHRoaXMub3V0cHV0KCd3YXJuJywgYXJncyk7XG4gIH0sXG4gIGVycm9yOiBmdW5jdGlvbiBlcnJvcihhcmdzKSB7XG4gICAgdGhpcy5vdXRwdXQoJ2Vycm9yJywgYXJncyk7XG4gIH0sXG4gIG91dHB1dDogZnVuY3Rpb24gb3V0cHV0KHR5cGUsIGFyZ3MpIHtcbiAgICB2YXIgX2NvbnNvbGU7XG5cbiAgICAvKiBlc2xpbnQgbm8tY29uc29sZTogMCAqL1xuICAgIGlmIChjb25zb2xlICYmIGNvbnNvbGVbdHlwZV0pIChfY29uc29sZSA9IGNvbnNvbGUpW3R5cGVdLmFwcGx5KF9jb25zb2xlLCB0b0NvbnN1bWFibGVBcnJheShhcmdzKSk7XG4gIH1cbn07XG5cbnZhciBMb2dnZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIExvZ2dlcihjb25jcmV0ZUxvZ2dlcikge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBMb2dnZXIpO1xuXG4gICAgdGhpcy5pbml0KGNvbmNyZXRlTG9nZ2VyLCBvcHRpb25zKTtcbiAgfVxuXG4gIExvZ2dlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIGluaXQoY29uY3JldGVMb2dnZXIpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICB0aGlzLnByZWZpeCA9IG9wdGlvbnMucHJlZml4IHx8ICdpMThuZXh0Oic7XG4gICAgdGhpcy5sb2dnZXIgPSBjb25jcmV0ZUxvZ2dlciB8fCBjb25zb2xlTG9nZ2VyO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy5kZWJ1ZyA9IG9wdGlvbnMuZGVidWc7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5zZXREZWJ1ZyA9IGZ1bmN0aW9uIHNldERlYnVnKGJvb2wpIHtcbiAgICB0aGlzLmRlYnVnID0gYm9vbDtcbiAgfTtcblxuICBMb2dnZXIucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uIGxvZygpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5mb3J3YXJkKGFyZ3MsICdsb2cnLCAnJywgdHJ1ZSk7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS53YXJuID0gZnVuY3Rpb24gd2FybigpIHtcbiAgICBmb3IgKHZhciBfbGVuMiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMiksIF9rZXkyID0gMDsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgYXJnc1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmZvcndhcmQoYXJncywgJ3dhcm4nLCAnJywgdHJ1ZSk7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5lcnJvciA9IGZ1bmN0aW9uIGVycm9yKCkge1xuICAgIGZvciAodmFyIF9sZW4zID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4zKSwgX2tleTMgPSAwOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICBhcmdzW19rZXkzXSA9IGFyZ3VtZW50c1tfa2V5M107XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZm9yd2FyZChhcmdzLCAnZXJyb3InLCAnJyk7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5kZXByZWNhdGUgPSBmdW5jdGlvbiBkZXByZWNhdGUoKSB7XG4gICAgZm9yICh2YXIgX2xlbjQgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjQpLCBfa2V5NCA9IDA7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICAgIGFyZ3NbX2tleTRdID0gYXJndW1lbnRzW19rZXk0XTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5mb3J3YXJkKGFyZ3MsICd3YXJuJywgJ1dBUk5JTkcgREVQUkVDQVRFRDogJywgdHJ1ZSk7XG4gIH07XG5cbiAgTG9nZ2VyLnByb3RvdHlwZS5mb3J3YXJkID0gZnVuY3Rpb24gZm9yd2FyZChhcmdzLCBsdmwsIHByZWZpeCwgZGVidWdPbmx5KSB7XG4gICAgaWYgKGRlYnVnT25seSAmJiAhdGhpcy5kZWJ1ZykgcmV0dXJuIG51bGw7XG4gICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnc3RyaW5nJykgYXJnc1swXSA9ICcnICsgcHJlZml4ICsgdGhpcy5wcmVmaXggKyAnICcgKyBhcmdzWzBdO1xuICAgIHJldHVybiB0aGlzLmxvZ2dlcltsdmxdKGFyZ3MpO1xuICB9O1xuXG4gIExvZ2dlci5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKG1vZHVsZU5hbWUpIHtcbiAgICByZXR1cm4gbmV3IExvZ2dlcih0aGlzLmxvZ2dlciwgX2V4dGVuZHMoeyBwcmVmaXg6IHRoaXMucHJlZml4ICsgJzonICsgbW9kdWxlTmFtZSArICc6JyB9LCB0aGlzLm9wdGlvbnMpKTtcbiAgfTtcblxuICByZXR1cm4gTG9nZ2VyO1xufSgpO1xuXG52YXIgYmFzZUxvZ2dlciA9IG5ldyBMb2dnZXIoKTtcblxudmFyIEV2ZW50RW1pdHRlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIEV2ZW50RW1pdHRlcik7XG5cbiAgICB0aGlzLm9ic2VydmVycyA9IHt9O1xuICB9XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IGZ1bmN0aW9uIG9uKGV2ZW50cywgbGlzdGVuZXIpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgZXZlbnRzLnNwbGl0KCcgJykuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIF90aGlzLm9ic2VydmVyc1tldmVudF0gPSBfdGhpcy5vYnNlcnZlcnNbZXZlbnRdIHx8IFtdO1xuICAgICAgX3RoaXMub2JzZXJ2ZXJzW2V2ZW50XS5wdXNoKGxpc3RlbmVyKTtcbiAgICB9KTtcbiAgfTtcblxuICBFdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uIG9mZihldmVudCwgbGlzdGVuZXIpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIGlmICghdGhpcy5vYnNlcnZlcnNbZXZlbnRdKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5vYnNlcnZlcnNbZXZlbnRdLmZvckVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFsaXN0ZW5lcikge1xuICAgICAgICBkZWxldGUgX3RoaXMyLm9ic2VydmVyc1tldmVudF07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgaW5kZXggPSBfdGhpczIub2JzZXJ2ZXJzW2V2ZW50XS5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICBfdGhpczIub2JzZXJ2ZXJzW2V2ZW50XS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdChldmVudCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5IC0gMV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub2JzZXJ2ZXJzW2V2ZW50XSkge1xuICAgICAgdmFyIGNsb25lZCA9IFtdLmNvbmNhdCh0aGlzLm9ic2VydmVyc1tldmVudF0pO1xuICAgICAgY2xvbmVkLmZvckVhY2goZnVuY3Rpb24gKG9ic2VydmVyKSB7XG4gICAgICAgIG9ic2VydmVyLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5vYnNlcnZlcnNbJyonXSkge1xuICAgICAgdmFyIF9jbG9uZWQgPSBbXS5jb25jYXQodGhpcy5vYnNlcnZlcnNbJyonXSk7XG4gICAgICBfY2xvbmVkLmZvckVhY2goZnVuY3Rpb24gKG9ic2VydmVyKSB7XG4gICAgICAgIHZhciBfcmVmO1xuXG4gICAgICAgIG9ic2VydmVyLmFwcGx5KG9ic2VydmVyLCAoX3JlZiA9IFtldmVudF0pLmNvbmNhdC5hcHBseShfcmVmLCBhcmdzKSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbn0oKTtcblxuZnVuY3Rpb24gbWFrZVN0cmluZyhvYmplY3QpIHtcbiAgaWYgKG9iamVjdCA9PSBudWxsKSByZXR1cm4gJyc7XG4gIC8qIGVzbGludCBwcmVmZXItdGVtcGxhdGU6IDAgKi9cbiAgcmV0dXJuICcnICsgb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBjb3B5KGEsIHMsIHQpIHtcbiAgYS5mb3JFYWNoKGZ1bmN0aW9uIChtKSB7XG4gICAgaWYgKHNbbV0pIHRbbV0gPSBzW21dO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0TGFzdE9mUGF0aChvYmplY3QsIHBhdGgsIEVtcHR5KSB7XG4gIGZ1bmN0aW9uIGNsZWFuS2V5KGtleSkge1xuICAgIHJldHVybiBrZXkgJiYga2V5LmluZGV4T2YoJyMjIycpID4gLTEgPyBrZXkucmVwbGFjZSgvIyMjL2csICcuJykgOiBrZXk7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5Ob3RUcmF2ZXJzZURlZXBlcigpIHtcbiAgICByZXR1cm4gIW9iamVjdCB8fCB0eXBlb2Ygb2JqZWN0ID09PSAnc3RyaW5nJztcbiAgfVxuXG4gIHZhciBzdGFjayA9IHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJyA/IFtdLmNvbmNhdChwYXRoKSA6IHBhdGguc3BsaXQoJy4nKTtcbiAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDEpIHtcbiAgICBpZiAoY2FuTm90VHJhdmVyc2VEZWVwZXIoKSkgcmV0dXJuIHt9O1xuXG4gICAgdmFyIGtleSA9IGNsZWFuS2V5KHN0YWNrLnNoaWZ0KCkpO1xuICAgIGlmICghb2JqZWN0W2tleV0gJiYgRW1wdHkpIG9iamVjdFtrZXldID0gbmV3IEVtcHR5KCk7XG4gICAgb2JqZWN0ID0gb2JqZWN0W2tleV07XG4gIH1cblxuICBpZiAoY2FuTm90VHJhdmVyc2VEZWVwZXIoKSkgcmV0dXJuIHt9O1xuICByZXR1cm4ge1xuICAgIG9iajogb2JqZWN0LFxuICAgIGs6IGNsZWFuS2V5KHN0YWNrLnNoaWZ0KCkpXG4gIH07XG59XG5cbmZ1bmN0aW9uIHNldFBhdGgob2JqZWN0LCBwYXRoLCBuZXdWYWx1ZSkge1xuICB2YXIgX2dldExhc3RPZlBhdGggPSBnZXRMYXN0T2ZQYXRoKG9iamVjdCwgcGF0aCwgT2JqZWN0KSxcbiAgICAgIG9iaiA9IF9nZXRMYXN0T2ZQYXRoLm9iaixcbiAgICAgIGsgPSBfZ2V0TGFzdE9mUGF0aC5rO1xuXG4gIG9ialtrXSA9IG5ld1ZhbHVlO1xufVxuXG5mdW5jdGlvbiBwdXNoUGF0aChvYmplY3QsIHBhdGgsIG5ld1ZhbHVlLCBjb25jYXQpIHtcbiAgdmFyIF9nZXRMYXN0T2ZQYXRoMiA9IGdldExhc3RPZlBhdGgob2JqZWN0LCBwYXRoLCBPYmplY3QpLFxuICAgICAgb2JqID0gX2dldExhc3RPZlBhdGgyLm9iaixcbiAgICAgIGsgPSBfZ2V0TGFzdE9mUGF0aDIuaztcblxuICBvYmpba10gPSBvYmpba10gfHwgW107XG4gIGlmIChjb25jYXQpIG9ialtrXSA9IG9ialtrXS5jb25jYXQobmV3VmFsdWUpO1xuICBpZiAoIWNvbmNhdCkgb2JqW2tdLnB1c2gobmV3VmFsdWUpO1xufVxuXG5mdW5jdGlvbiBnZXRQYXRoKG9iamVjdCwgcGF0aCkge1xuICB2YXIgX2dldExhc3RPZlBhdGgzID0gZ2V0TGFzdE9mUGF0aChvYmplY3QsIHBhdGgpLFxuICAgICAgb2JqID0gX2dldExhc3RPZlBhdGgzLm9iaixcbiAgICAgIGsgPSBfZ2V0TGFzdE9mUGF0aDMuaztcblxuICBpZiAoIW9iaikgcmV0dXJuIHVuZGVmaW5lZDtcbiAgcmV0dXJuIG9ialtrXTtcbn1cblxuZnVuY3Rpb24gZGVlcEV4dGVuZCh0YXJnZXQsIHNvdXJjZSwgb3ZlcndyaXRlKSB7XG4gIC8qIGVzbGludCBuby1yZXN0cmljdGVkLXN5bnRheDogMCAqL1xuICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgIGlmIChwcm9wIGluIHRhcmdldCkge1xuICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIGxlYWYgc3RyaW5nIGluIHRhcmdldCBvciBzb3VyY2UgdGhlbiByZXBsYWNlIHdpdGggc291cmNlIG9yIHNraXAgZGVwZW5kaW5nIG9uIHRoZSAnb3ZlcndyaXRlJyBzd2l0Y2hcbiAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W3Byb3BdID09PSAnc3RyaW5nJyB8fCB0YXJnZXRbcHJvcF0gaW5zdGFuY2VvZiBTdHJpbmcgfHwgdHlwZW9mIHNvdXJjZVtwcm9wXSA9PT0gJ3N0cmluZycgfHwgc291cmNlW3Byb3BdIGluc3RhbmNlb2YgU3RyaW5nKSB7XG4gICAgICAgIGlmIChvdmVyd3JpdGUpIHRhcmdldFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlZXBFeHRlbmQodGFyZ2V0W3Byb3BdLCBzb3VyY2VbcHJvcF0sIG92ZXJ3cml0ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldFtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuZnVuY3Rpb24gcmVnZXhFc2NhcGUoc3RyKSB7XG4gIC8qIGVzbGludCBuby11c2VsZXNzLWVzY2FwZTogMCAqL1xuICByZXR1cm4gc3RyLnJlcGxhY2UoL1tcXC1cXFtcXF1cXC9cXHtcXH1cXChcXClcXCpcXCtcXD9cXC5cXFxcXFxeXFwkXFx8XS9nLCAnXFxcXCQmJyk7XG59XG5cbi8qIGVzbGludC1kaXNhYmxlICovXG52YXIgX2VudGl0eU1hcCA9IHtcbiAgXCImXCI6IFwiJmFtcDtcIixcbiAgXCI8XCI6IFwiJmx0O1wiLFxuICBcIj5cIjogXCImZ3Q7XCIsXG4gICdcIic6ICcmcXVvdDsnLFxuICBcIidcIjogJyYjMzk7JyxcbiAgXCIvXCI6ICcmI3gyRjsnXG59O1xuLyogZXNsaW50LWVuYWJsZSAqL1xuXG5mdW5jdGlvbiBlc2NhcGUoZGF0YSkge1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGRhdGEucmVwbGFjZSgvWyY8PlwiJ1xcL10vZywgZnVuY3Rpb24gKHMpIHtcbiAgICAgIHJldHVybiBfZW50aXR5TWFwW3NdO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGRhdGE7XG59XG5cbnZhciBSZXNvdXJjZVN0b3JlID0gZnVuY3Rpb24gKF9FdmVudEVtaXR0ZXIpIHtcbiAgaW5oZXJpdHMoUmVzb3VyY2VTdG9yZSwgX0V2ZW50RW1pdHRlcik7XG5cbiAgZnVuY3Rpb24gUmVzb3VyY2VTdG9yZShkYXRhKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHsgbnM6IFsndHJhbnNsYXRpb24nXSwgZGVmYXVsdE5TOiAndHJhbnNsYXRpb24nIH07XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgUmVzb3VyY2VTdG9yZSk7XG5cbiAgICB2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9FdmVudEVtaXR0ZXIuY2FsbCh0aGlzKSk7XG5cbiAgICBfdGhpcy5kYXRhID0gZGF0YSB8fCB7fTtcbiAgICBfdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBSZXNvdXJjZVN0b3JlLnByb3RvdHlwZS5hZGROYW1lc3BhY2VzID0gZnVuY3Rpb24gYWRkTmFtZXNwYWNlcyhucykge1xuICAgIGlmICh0aGlzLm9wdGlvbnMubnMuaW5kZXhPZihucykgPCAwKSB7XG4gICAgICB0aGlzLm9wdGlvbnMubnMucHVzaChucyk7XG4gICAgfVxuICB9O1xuXG4gIFJlc291cmNlU3RvcmUucHJvdG90eXBlLnJlbW92ZU5hbWVzcGFjZXMgPSBmdW5jdGlvbiByZW1vdmVOYW1lc3BhY2VzKG5zKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5vcHRpb25zLm5zLmluZGV4T2YobnMpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICB0aGlzLm9wdGlvbnMubnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH07XG5cbiAgUmVzb3VyY2VTdG9yZS5wcm90b3R5cGUuZ2V0UmVzb3VyY2UgPSBmdW5jdGlvbiBnZXRSZXNvdXJjZShsbmcsIG5zLCBrZXkpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAzICYmIGFyZ3VtZW50c1szXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzNdIDoge307XG5cbiAgICB2YXIga2V5U2VwYXJhdG9yID0gb3B0aW9ucy5rZXlTZXBhcmF0b3IgfHwgdGhpcy5vcHRpb25zLmtleVNlcGFyYXRvcjtcbiAgICBpZiAoa2V5U2VwYXJhdG9yID09PSB1bmRlZmluZWQpIGtleVNlcGFyYXRvciA9ICcuJztcblxuICAgIHZhciBwYXRoID0gW2xuZywgbnNdO1xuICAgIGlmIChrZXkgJiYgdHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHBhdGggPSBwYXRoLmNvbmNhdChrZXkpO1xuICAgIGlmIChrZXkgJiYgdHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHBhdGggPSBwYXRoLmNvbmNhdChrZXlTZXBhcmF0b3IgPyBrZXkuc3BsaXQoa2V5U2VwYXJhdG9yKSA6IGtleSk7XG5cbiAgICBpZiAobG5nLmluZGV4T2YoJy4nKSA+IC0xKSB7XG4gICAgICBwYXRoID0gbG5nLnNwbGl0KCcuJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldFBhdGgodGhpcy5kYXRhLCBwYXRoKTtcbiAgfTtcblxuICBSZXNvdXJjZVN0b3JlLnByb3RvdHlwZS5hZGRSZXNvdXJjZSA9IGZ1bmN0aW9uIGFkZFJlc291cmNlKGxuZywgbnMsIGtleSwgdmFsdWUpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogeyBzaWxlbnQ6IGZhbHNlIH07XG5cbiAgICB2YXIga2V5U2VwYXJhdG9yID0gdGhpcy5vcHRpb25zLmtleVNlcGFyYXRvcjtcbiAgICBpZiAoa2V5U2VwYXJhdG9yID09PSB1bmRlZmluZWQpIGtleVNlcGFyYXRvciA9ICcuJztcblxuICAgIHZhciBwYXRoID0gW2xuZywgbnNdO1xuICAgIGlmIChrZXkpIHBhdGggPSBwYXRoLmNvbmNhdChrZXlTZXBhcmF0b3IgPyBrZXkuc3BsaXQoa2V5U2VwYXJhdG9yKSA6IGtleSk7XG5cbiAgICBpZiAobG5nLmluZGV4T2YoJy4nKSA+IC0xKSB7XG4gICAgICBwYXRoID0gbG5nLnNwbGl0KCcuJyk7XG4gICAgICB2YWx1ZSA9IG5zO1xuICAgICAgbnMgPSBwYXRoWzFdO1xuICAgIH1cblxuICAgIHRoaXMuYWRkTmFtZXNwYWNlcyhucyk7XG5cbiAgICBzZXRQYXRoKHRoaXMuZGF0YSwgcGF0aCwgdmFsdWUpO1xuXG4gICAgaWYgKCFvcHRpb25zLnNpbGVudCkgdGhpcy5lbWl0KCdhZGRlZCcsIGxuZywgbnMsIGtleSwgdmFsdWUpO1xuICB9O1xuXG4gIFJlc291cmNlU3RvcmUucHJvdG90eXBlLmFkZFJlc291cmNlcyA9IGZ1bmN0aW9uIGFkZFJlc291cmNlcyhsbmcsIG5zLCByZXNvdXJjZXMpIHtcbiAgICAvKiBlc2xpbnQgbm8tcmVzdHJpY3RlZC1zeW50YXg6IDAgKi9cbiAgICBmb3IgKHZhciBtIGluIHJlc291cmNlcykge1xuICAgICAgaWYgKHR5cGVvZiByZXNvdXJjZXNbbV0gPT09ICdzdHJpbmcnKSB0aGlzLmFkZFJlc291cmNlKGxuZywgbnMsIG0sIHJlc291cmNlc1ttXSwgeyBzaWxlbnQ6IHRydWUgfSk7XG4gICAgfVxuICAgIHRoaXMuZW1pdCgnYWRkZWQnLCBsbmcsIG5zLCByZXNvdXJjZXMpO1xuICB9O1xuXG4gIFJlc291cmNlU3RvcmUucHJvdG90eXBlLmFkZFJlc291cmNlQnVuZGxlID0gZnVuY3Rpb24gYWRkUmVzb3VyY2VCdW5kbGUobG5nLCBucywgcmVzb3VyY2VzLCBkZWVwLCBvdmVyd3JpdGUpIHtcbiAgICB2YXIgcGF0aCA9IFtsbmcsIG5zXTtcbiAgICBpZiAobG5nLmluZGV4T2YoJy4nKSA+IC0xKSB7XG4gICAgICBwYXRoID0gbG5nLnNwbGl0KCcuJyk7XG4gICAgICBkZWVwID0gcmVzb3VyY2VzO1xuICAgICAgcmVzb3VyY2VzID0gbnM7XG4gICAgICBucyA9IHBhdGhbMV07XG4gICAgfVxuXG4gICAgdGhpcy5hZGROYW1lc3BhY2VzKG5zKTtcblxuICAgIHZhciBwYWNrID0gZ2V0UGF0aCh0aGlzLmRhdGEsIHBhdGgpIHx8IHt9O1xuXG4gICAgaWYgKGRlZXApIHtcbiAgICAgIGRlZXBFeHRlbmQocGFjaywgcmVzb3VyY2VzLCBvdmVyd3JpdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYWNrID0gX2V4dGVuZHMoe30sIHBhY2ssIHJlc291cmNlcyk7XG4gICAgfVxuXG4gICAgc2V0UGF0aCh0aGlzLmRhdGEsIHBhdGgsIHBhY2spO1xuXG4gICAgdGhpcy5lbWl0KCdhZGRlZCcsIGxuZywgbnMsIHJlc291cmNlcyk7XG4gIH07XG5cbiAgUmVzb3VyY2VTdG9yZS5wcm90b3R5cGUucmVtb3ZlUmVzb3VyY2VCdW5kbGUgPSBmdW5jdGlvbiByZW1vdmVSZXNvdXJjZUJ1bmRsZShsbmcsIG5zKSB7XG4gICAgaWYgKHRoaXMuaGFzUmVzb3VyY2VCdW5kbGUobG5nLCBucykpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmRhdGFbbG5nXVtuc107XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlTmFtZXNwYWNlcyhucyk7XG5cbiAgICB0aGlzLmVtaXQoJ3JlbW92ZWQnLCBsbmcsIG5zKTtcbiAgfTtcblxuICBSZXNvdXJjZVN0b3JlLnByb3RvdHlwZS5oYXNSZXNvdXJjZUJ1bmRsZSA9IGZ1bmN0aW9uIGhhc1Jlc291cmNlQnVuZGxlKGxuZywgbnMpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRSZXNvdXJjZShsbmcsIG5zKSAhPT0gdW5kZWZpbmVkO1xuICB9O1xuXG4gIFJlc291cmNlU3RvcmUucHJvdG90eXBlLmdldFJlc291cmNlQnVuZGxlID0gZnVuY3Rpb24gZ2V0UmVzb3VyY2VCdW5kbGUobG5nLCBucykge1xuICAgIGlmICghbnMpIG5zID0gdGhpcy5vcHRpb25zLmRlZmF1bHROUztcblxuICAgIC8vIENPTVBBVElCSUxJVFk6IHJlbW92ZSBleHRlbmQgaW4gdjIuMS4wXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb21wYXRpYmlsaXR5QVBJID09PSAndjEnKSByZXR1cm4gX2V4dGVuZHMoe30sIHRoaXMuZ2V0UmVzb3VyY2UobG5nLCBucykpO1xuXG4gICAgcmV0dXJuIHRoaXMuZ2V0UmVzb3VyY2UobG5nLCBucyk7XG4gIH07XG5cbiAgUmVzb3VyY2VTdG9yZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OKCkge1xuICAgIHJldHVybiB0aGlzLmRhdGE7XG4gIH07XG5cbiAgcmV0dXJuIFJlc291cmNlU3RvcmU7XG59KEV2ZW50RW1pdHRlcik7XG5cbnZhciBwb3N0UHJvY2Vzc29yID0ge1xuXG4gIHByb2Nlc3NvcnM6IHt9LFxuXG4gIGFkZFBvc3RQcm9jZXNzb3I6IGZ1bmN0aW9uIGFkZFBvc3RQcm9jZXNzb3IobW9kdWxlKSB7XG4gICAgdGhpcy5wcm9jZXNzb3JzW21vZHVsZS5uYW1lXSA9IG1vZHVsZTtcbiAgfSxcbiAgaGFuZGxlOiBmdW5jdGlvbiBoYW5kbGUocHJvY2Vzc29ycywgdmFsdWUsIGtleSwgb3B0aW9ucywgdHJhbnNsYXRvcikge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBwcm9jZXNzb3JzLmZvckVhY2goZnVuY3Rpb24gKHByb2Nlc3Nvcikge1xuICAgICAgaWYgKF90aGlzLnByb2Nlc3NvcnNbcHJvY2Vzc29yXSkgdmFsdWUgPSBfdGhpcy5wcm9jZXNzb3JzW3Byb2Nlc3Nvcl0ucHJvY2Vzcyh2YWx1ZSwga2V5LCBvcHRpb25zLCB0cmFuc2xhdG9yKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxufTtcblxudmFyIFRyYW5zbGF0b3IgPSBmdW5jdGlvbiAoX0V2ZW50RW1pdHRlcikge1xuICBpbmhlcml0cyhUcmFuc2xhdG9yLCBfRXZlbnRFbWl0dGVyKTtcblxuICBmdW5jdGlvbiBUcmFuc2xhdG9yKHNlcnZpY2VzKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFRyYW5zbGF0b3IpO1xuXG4gICAgdmFyIF90aGlzID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfRXZlbnRFbWl0dGVyLmNhbGwodGhpcykpO1xuXG4gICAgY29weShbJ3Jlc291cmNlU3RvcmUnLCAnbGFuZ3VhZ2VVdGlscycsICdwbHVyYWxSZXNvbHZlcicsICdpbnRlcnBvbGF0b3InLCAnYmFja2VuZENvbm5lY3RvciddLCBzZXJ2aWNlcywgX3RoaXMpO1xuXG4gICAgX3RoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgX3RoaXMubG9nZ2VyID0gYmFzZUxvZ2dlci5jcmVhdGUoJ3RyYW5zbGF0b3InKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBUcmFuc2xhdG9yLnByb3RvdHlwZS5jaGFuZ2VMYW5ndWFnZSA9IGZ1bmN0aW9uIGNoYW5nZUxhbmd1YWdlKGxuZykge1xuICAgIGlmIChsbmcpIHRoaXMubGFuZ3VhZ2UgPSBsbmc7XG4gIH07XG5cbiAgVHJhbnNsYXRvci5wcm90b3R5cGUuZXhpc3RzID0gZnVuY3Rpb24gZXhpc3RzKGtleSkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7IGludGVycG9sYXRpb246IHt9IH07XG5cbiAgICB2YXIgcmVzb2x2ZWQgPSB0aGlzLnJlc29sdmUoa2V5LCBvcHRpb25zKTtcbiAgICByZXR1cm4gcmVzb2x2ZWQgJiYgcmVzb2x2ZWQucmVzICE9PSB1bmRlZmluZWQ7XG4gIH07XG5cbiAgVHJhbnNsYXRvci5wcm90b3R5cGUuZXh0cmFjdEZyb21LZXkgPSBmdW5jdGlvbiBleHRyYWN0RnJvbUtleShrZXksIG9wdGlvbnMpIHtcbiAgICB2YXIgbnNTZXBhcmF0b3IgPSBvcHRpb25zLm5zU2VwYXJhdG9yIHx8IHRoaXMub3B0aW9ucy5uc1NlcGFyYXRvcjtcbiAgICBpZiAobnNTZXBhcmF0b3IgPT09IHVuZGVmaW5lZCkgbnNTZXBhcmF0b3IgPSAnOic7XG4gICAgdmFyIGtleVNlcGFyYXRvciA9IG9wdGlvbnMua2V5U2VwYXJhdG9yIHx8IHRoaXMub3B0aW9ucy5rZXlTZXBhcmF0b3IgfHwgJy4nO1xuXG4gICAgdmFyIG5hbWVzcGFjZXMgPSBvcHRpb25zLm5zIHx8IHRoaXMub3B0aW9ucy5kZWZhdWx0TlM7XG4gICAgaWYgKG5zU2VwYXJhdG9yICYmIGtleS5pbmRleE9mKG5zU2VwYXJhdG9yKSA+IC0xKSB7XG4gICAgICB2YXIgcGFydHMgPSBrZXkuc3BsaXQobnNTZXBhcmF0b3IpO1xuICAgICAgaWYgKG5zU2VwYXJhdG9yICE9PSBrZXlTZXBhcmF0b3IgfHwgbnNTZXBhcmF0b3IgPT09IGtleVNlcGFyYXRvciAmJiB0aGlzLm9wdGlvbnMubnMuaW5kZXhPZihwYXJ0c1swXSkgPiAtMSkgbmFtZXNwYWNlcyA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgICBrZXkgPSBwYXJ0cy5qb2luKGtleVNlcGFyYXRvcik7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlcyA9PT0gJ3N0cmluZycpIG5hbWVzcGFjZXMgPSBbbmFtZXNwYWNlc107XG5cbiAgICByZXR1cm4ge1xuICAgICAga2V5OiBrZXksXG4gICAgICBuYW1lc3BhY2VzOiBuYW1lc3BhY2VzXG4gICAgfTtcbiAgfTtcblxuICBUcmFuc2xhdG9yLnByb3RvdHlwZS50cmFuc2xhdGUgPSBmdW5jdGlvbiB0cmFuc2xhdGUoa2V5cykge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgaWYgKCh0eXBlb2Ygb3B0aW9ucyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yob3B0aW9ucykpICE9PSAnb2JqZWN0Jykge1xuICAgICAgLyogZXNsaW50IHByZWZlci1yZXN0LXBhcmFtczogMCAqL1xuICAgICAgb3B0aW9ucyA9IHRoaXMub3B0aW9ucy5vdmVybG9hZFRyYW5zbGF0aW9uT3B0aW9uSGFuZGxlcihhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIC8vIG5vbiB2YWxpZCBrZXlzIGhhbmRsaW5nXG4gICAgaWYgKGtleXMgPT09IHVuZGVmaW5lZCB8fCBrZXlzID09PSBudWxsIHx8IGtleXMgPT09ICcnKSByZXR1cm4gJyc7XG4gICAgaWYgKHR5cGVvZiBrZXlzID09PSAnbnVtYmVyJykga2V5cyA9IFN0cmluZyhrZXlzKTtcbiAgICBpZiAodHlwZW9mIGtleXMgPT09ICdzdHJpbmcnKSBrZXlzID0gW2tleXNdO1xuXG4gICAgLy8gc2VwYXJhdG9yc1xuICAgIHZhciBrZXlTZXBhcmF0b3IgPSBvcHRpb25zLmtleVNlcGFyYXRvciB8fCB0aGlzLm9wdGlvbnMua2V5U2VwYXJhdG9yIHx8ICcuJztcblxuICAgIC8vIGdldCBuYW1lc3BhY2UocylcblxuICAgIHZhciBfZXh0cmFjdEZyb21LZXkgPSB0aGlzLmV4dHJhY3RGcm9tS2V5KGtleXNba2V5cy5sZW5ndGggLSAxXSwgb3B0aW9ucyksXG4gICAgICAgIGtleSA9IF9leHRyYWN0RnJvbUtleS5rZXksXG4gICAgICAgIG5hbWVzcGFjZXMgPSBfZXh0cmFjdEZyb21LZXkubmFtZXNwYWNlcztcblxuICAgIHZhciBuYW1lc3BhY2UgPSBuYW1lc3BhY2VzW25hbWVzcGFjZXMubGVuZ3RoIC0gMV07XG5cbiAgICAvLyByZXR1cm4ga2V5IG9uIENJTW9kZVxuICAgIHZhciBsbmcgPSBvcHRpb25zLmxuZyB8fCB0aGlzLmxhbmd1YWdlO1xuICAgIHZhciBhcHBlbmROYW1lc3BhY2VUb0NJTW9kZSA9IG9wdGlvbnMuYXBwZW5kTmFtZXNwYWNlVG9DSU1vZGUgfHwgdGhpcy5vcHRpb25zLmFwcGVuZE5hbWVzcGFjZVRvQ0lNb2RlO1xuICAgIGlmIChsbmcgJiYgbG5nLnRvTG93ZXJDYXNlKCkgPT09ICdjaW1vZGUnKSB7XG4gICAgICBpZiAoYXBwZW5kTmFtZXNwYWNlVG9DSU1vZGUpIHtcbiAgICAgICAgdmFyIG5zU2VwYXJhdG9yID0gb3B0aW9ucy5uc1NlcGFyYXRvciB8fCB0aGlzLm9wdGlvbnMubnNTZXBhcmF0b3I7XG4gICAgICAgIHJldHVybiBuYW1lc3BhY2UgKyBuc1NlcGFyYXRvciArIGtleTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG5cbiAgICAvLyByZXNvbHZlIGZyb20gc3RvcmVcbiAgICB2YXIgcmVzb2x2ZWQgPSB0aGlzLnJlc29sdmUoa2V5cywgb3B0aW9ucyk7XG4gICAgdmFyIHJlcyA9IHJlc29sdmVkICYmIHJlc29sdmVkLnJlcztcbiAgICB2YXIgdXNlZEtleSA9IHJlc29sdmVkICYmIHJlc29sdmVkLnVzZWRLZXkgfHwga2V5O1xuXG4gICAgdmFyIHJlc1R5cGUgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHJlcyk7XG4gICAgdmFyIG5vT2JqZWN0ID0gWydbb2JqZWN0IE51bWJlcl0nLCAnW29iamVjdCBGdW5jdGlvbl0nLCAnW29iamVjdCBSZWdFeHBdJ107XG4gICAgdmFyIGpvaW5BcnJheXMgPSBvcHRpb25zLmpvaW5BcnJheXMgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMuam9pbkFycmF5cyA6IHRoaXMub3B0aW9ucy5qb2luQXJyYXlzO1xuXG4gICAgLy8gb2JqZWN0XG4gICAgdmFyIGhhbmRsZUFzT2JqZWN0ID0gdHlwZW9mIHJlcyAhPT0gJ3N0cmluZycgJiYgdHlwZW9mIHJlcyAhPT0gJ2Jvb2xlYW4nICYmIHR5cGVvZiByZXMgIT09ICdudW1iZXInO1xuICAgIGlmIChyZXMgJiYgaGFuZGxlQXNPYmplY3QgJiYgbm9PYmplY3QuaW5kZXhPZihyZXNUeXBlKSA8IDAgJiYgIShqb2luQXJyYXlzICYmIHJlc1R5cGUgPT09ICdbb2JqZWN0IEFycmF5XScpKSB7XG4gICAgICBpZiAoIW9wdGlvbnMucmV0dXJuT2JqZWN0cyAmJiAhdGhpcy5vcHRpb25zLnJldHVybk9iamVjdHMpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIud2FybignYWNjZXNzaW5nIGFuIG9iamVjdCAtIGJ1dCByZXR1cm5PYmplY3RzIG9wdGlvbnMgaXMgbm90IGVuYWJsZWQhJyk7XG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMucmV0dXJuZWRPYmplY3RIYW5kbGVyID8gdGhpcy5vcHRpb25zLnJldHVybmVkT2JqZWN0SGFuZGxlcih1c2VkS2V5LCByZXMsIG9wdGlvbnMpIDogJ2tleSBcXCcnICsga2V5ICsgJyAoJyArIHRoaXMubGFuZ3VhZ2UgKyAnKVxcJyByZXR1cm5lZCBhbiBvYmplY3QgaW5zdGVhZCBvZiBzdHJpbmcuJztcbiAgICAgIH1cblxuICAgICAgLy8gaWYgd2UgZ290IGEgc2VwYXJhdG9yIHdlIGxvb3Agb3ZlciBjaGlsZHJlbiAtIGVsc2Ugd2UganVzdCByZXR1cm4gb2JqZWN0IGFzIGlzXG4gICAgICAvLyBhcyBoYXZpbmcgaXQgc2V0IHRvIGZhbHNlIG1lYW5zIG5vIGhpZXJhcmNoeSBzbyBubyBsb29rdXAgZm9yIG5lc3RlZCB2YWx1ZXNcbiAgICAgIGlmIChvcHRpb25zLmtleVNlcGFyYXRvciB8fCB0aGlzLm9wdGlvbnMua2V5U2VwYXJhdG9yKSB7XG4gICAgICAgIHZhciBjb3B5JCQxID0gcmVzVHlwZSA9PT0gJ1tvYmplY3QgQXJyYXldJyA/IFtdIDoge307IC8vIGFwcGx5IGNoaWxkIHRyYW5zbGF0aW9uIG9uIGEgY29weVxuXG4gICAgICAgIC8qIGVzbGludCBuby1yZXN0cmljdGVkLXN5bnRheDogMCAqL1xuICAgICAgICBmb3IgKHZhciBtIGluIHJlcykge1xuICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocmVzLCBtKSkge1xuICAgICAgICAgICAgY29weSQkMVttXSA9IHRoaXMudHJhbnNsYXRlKCcnICsgdXNlZEtleSArIGtleVNlcGFyYXRvciArIG0sIF9leHRlbmRzKHt9LCBvcHRpb25zLCB7IGpvaW5BcnJheXM6IGZhbHNlLCBuczogbmFtZXNwYWNlcyB9KSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlcyA9IGNvcHkkJDE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChqb2luQXJyYXlzICYmIHJlc1R5cGUgPT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIC8vIGFycmF5IHNwZWNpYWwgdHJlYXRtZW50XG4gICAgICByZXMgPSByZXMuam9pbihqb2luQXJyYXlzKTtcbiAgICAgIGlmIChyZXMpIHJlcyA9IHRoaXMuZXh0ZW5kVHJhbnNsYXRpb24ocmVzLCBrZXlzLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gc3RyaW5nLCBlbXB0eSBvciBudWxsXG4gICAgICB2YXIgdXNlZERlZmF1bHQgPSBmYWxzZTtcbiAgICAgIHZhciBfdXNlZEtleSA9IGZhbHNlO1xuXG4gICAgICAvLyBmYWxsYmFjayB2YWx1ZVxuICAgICAgaWYgKCF0aGlzLmlzVmFsaWRMb29rdXAocmVzKSAmJiBvcHRpb25zLmRlZmF1bHRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHVzZWREZWZhdWx0ID0gdHJ1ZTtcbiAgICAgICAgcmVzID0gb3B0aW9ucy5kZWZhdWx0VmFsdWU7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZExvb2t1cChyZXMpKSB7XG4gICAgICAgIF91c2VkS2V5ID0gdHJ1ZTtcbiAgICAgICAgcmVzID0ga2V5O1xuICAgICAgfVxuXG4gICAgICAvLyBzYXZlIG1pc3NpbmdcbiAgICAgIHZhciB1cGRhdGVNaXNzaW5nID0gb3B0aW9ucy5kZWZhdWx0VmFsdWUgJiYgb3B0aW9ucy5kZWZhdWx0VmFsdWUgIT09IHJlcyAmJiB0aGlzLm9wdGlvbnMudXBkYXRlTWlzc2luZztcbiAgICAgIGlmIChfdXNlZEtleSB8fCB1c2VkRGVmYXVsdCB8fCB1cGRhdGVNaXNzaW5nKSB7XG4gICAgICAgIHRoaXMubG9nZ2VyLmxvZyh1cGRhdGVNaXNzaW5nID8gJ3VwZGF0ZUtleScgOiAnbWlzc2luZ0tleScsIGxuZywgbmFtZXNwYWNlLCBrZXksIHVwZGF0ZU1pc3NpbmcgPyBvcHRpb25zLmRlZmF1bHRWYWx1ZSA6IHJlcyk7XG5cbiAgICAgICAgdmFyIGxuZ3MgPSBbXTtcbiAgICAgICAgdmFyIGZhbGxiYWNrTG5ncyA9IHRoaXMubGFuZ3VhZ2VVdGlscy5nZXRGYWxsYmFja0NvZGVzKHRoaXMub3B0aW9ucy5mYWxsYmFja0xuZywgb3B0aW9ucy5sbmcgfHwgdGhpcy5sYW5ndWFnZSk7XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2F2ZU1pc3NpbmdUbyA9PT0gJ2ZhbGxiYWNrJyAmJiBmYWxsYmFja0xuZ3MgJiYgZmFsbGJhY2tMbmdzWzBdKSB7XG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmYWxsYmFja0xuZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxuZ3MucHVzaChmYWxsYmFja0xuZ3NbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9wdGlvbnMuc2F2ZU1pc3NpbmdUbyA9PT0gJ2FsbCcpIHtcbiAgICAgICAgICBsbmdzID0gdGhpcy5sYW5ndWFnZVV0aWxzLnRvUmVzb2x2ZUhpZXJhcmNoeShvcHRpb25zLmxuZyB8fCB0aGlzLmxhbmd1YWdlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsbmdzLnB1c2gob3B0aW9ucy5sbmcgfHwgdGhpcy5sYW5ndWFnZSk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VuZCA9IGZ1bmN0aW9uIHNlbmQobCwgaykge1xuICAgICAgICAgIGlmIChfdGhpczIub3B0aW9ucy5taXNzaW5nS2V5SGFuZGxlcikge1xuICAgICAgICAgICAgX3RoaXMyLm9wdGlvbnMubWlzc2luZ0tleUhhbmRsZXIobCwgbmFtZXNwYWNlLCBrLCB1cGRhdGVNaXNzaW5nID8gb3B0aW9ucy5kZWZhdWx0VmFsdWUgOiByZXMsIHVwZGF0ZU1pc3NpbmcpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoX3RoaXMyLmJhY2tlbmRDb25uZWN0b3IgJiYgX3RoaXMyLmJhY2tlbmRDb25uZWN0b3Iuc2F2ZU1pc3NpbmcpIHtcbiAgICAgICAgICAgIF90aGlzMi5iYWNrZW5kQ29ubmVjdG9yLnNhdmVNaXNzaW5nKGwsIG5hbWVzcGFjZSwgaywgdXBkYXRlTWlzc2luZyA/IG9wdGlvbnMuZGVmYXVsdFZhbHVlIDogcmVzLCB1cGRhdGVNaXNzaW5nKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgX3RoaXMyLmVtaXQoJ21pc3NpbmdLZXknLCBsLCBuYW1lc3BhY2UsIGssIHJlcyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zYXZlTWlzc2luZykge1xuICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuc2F2ZU1pc3NpbmdQbHVyYWxzICYmIG9wdGlvbnMuY291bnQpIHtcbiAgICAgICAgICAgIGxuZ3MuZm9yRWFjaChmdW5jdGlvbiAobCkge1xuICAgICAgICAgICAgICB2YXIgcGx1cmFscyA9IF90aGlzMi5wbHVyYWxSZXNvbHZlci5nZXRQbHVyYWxGb3Jtc09mS2V5KGwsIGtleSk7XG5cbiAgICAgICAgICAgICAgcGx1cmFscy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbmQoW2xdLCBwKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc2VuZChsbmdzLCBrZXkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBleHRlbmRcbiAgICAgIHJlcyA9IHRoaXMuZXh0ZW5kVHJhbnNsYXRpb24ocmVzLCBrZXlzLCBvcHRpb25zKTtcblxuICAgICAgLy8gYXBwZW5kIG5hbWVzcGFjZSBpZiBzdGlsbCBrZXlcbiAgICAgIGlmIChfdXNlZEtleSAmJiByZXMgPT09IGtleSAmJiB0aGlzLm9wdGlvbnMuYXBwZW5kTmFtZXNwYWNlVG9NaXNzaW5nS2V5KSByZXMgPSBuYW1lc3BhY2UgKyAnOicgKyBrZXk7XG5cbiAgICAgIC8vIHBhcnNlTWlzc2luZ0tleUhhbmRsZXJcbiAgICAgIGlmIChfdXNlZEtleSAmJiB0aGlzLm9wdGlvbnMucGFyc2VNaXNzaW5nS2V5SGFuZGxlcikgcmVzID0gdGhpcy5vcHRpb25zLnBhcnNlTWlzc2luZ0tleUhhbmRsZXIocmVzKTtcbiAgICB9XG5cbiAgICAvLyByZXR1cm5cbiAgICByZXR1cm4gcmVzO1xuICB9O1xuXG4gIFRyYW5zbGF0b3IucHJvdG90eXBlLmV4dGVuZFRyYW5zbGF0aW9uID0gZnVuY3Rpb24gZXh0ZW5kVHJhbnNsYXRpb24ocmVzLCBrZXksIG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIGlmIChvcHRpb25zLmludGVycG9sYXRpb24pIHRoaXMuaW50ZXJwb2xhdG9yLmluaXQoX2V4dGVuZHMoe30sIG9wdGlvbnMsIHsgaW50ZXJwb2xhdGlvbjogX2V4dGVuZHMoe30sIHRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLCBvcHRpb25zLmludGVycG9sYXRpb24pIH0pKTtcblxuICAgIC8vIGludGVycG9sYXRlXG4gICAgdmFyIGRhdGEgPSBvcHRpb25zLnJlcGxhY2UgJiYgdHlwZW9mIG9wdGlvbnMucmVwbGFjZSAhPT0gJ3N0cmluZycgPyBvcHRpb25zLnJlcGxhY2UgOiBvcHRpb25zO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuaW50ZXJwb2xhdGlvbi5kZWZhdWx0VmFyaWFibGVzKSBkYXRhID0gX2V4dGVuZHMoe30sIHRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLmRlZmF1bHRWYXJpYWJsZXMsIGRhdGEpO1xuICAgIHJlcyA9IHRoaXMuaW50ZXJwb2xhdG9yLmludGVycG9sYXRlKHJlcywgZGF0YSwgb3B0aW9ucy5sbmcgfHwgdGhpcy5sYW5ndWFnZSk7XG5cbiAgICAvLyBuZXN0aW5nXG4gICAgaWYgKG9wdGlvbnMubmVzdCAhPT0gZmFsc2UpIHJlcyA9IHRoaXMuaW50ZXJwb2xhdG9yLm5lc3QocmVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gX3RoaXMzLnRyYW5zbGF0ZS5hcHBseShfdGhpczMsIGFyZ3VtZW50cyk7XG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBpZiAob3B0aW9ucy5pbnRlcnBvbGF0aW9uKSB0aGlzLmludGVycG9sYXRvci5yZXNldCgpO1xuXG4gICAgLy8gcG9zdCBwcm9jZXNzXG4gICAgdmFyIHBvc3RQcm9jZXNzID0gb3B0aW9ucy5wb3N0UHJvY2VzcyB8fCB0aGlzLm9wdGlvbnMucG9zdFByb2Nlc3M7XG4gICAgdmFyIHBvc3RQcm9jZXNzb3JOYW1lcyA9IHR5cGVvZiBwb3N0UHJvY2VzcyA9PT0gJ3N0cmluZycgPyBbcG9zdFByb2Nlc3NdIDogcG9zdFByb2Nlc3M7XG5cbiAgICBpZiAocmVzICE9PSB1bmRlZmluZWQgJiYgcG9zdFByb2Nlc3Nvck5hbWVzICYmIHBvc3RQcm9jZXNzb3JOYW1lcy5sZW5ndGggJiYgb3B0aW9ucy5hcHBseVBvc3RQcm9jZXNzb3IgIT09IGZhbHNlKSB7XG4gICAgICByZXMgPSBwb3N0UHJvY2Vzc29yLmhhbmRsZShwb3N0UHJvY2Vzc29yTmFtZXMsIHJlcywga2V5LCBvcHRpb25zLCB0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzO1xuICB9O1xuXG4gIFRyYW5zbGF0b3IucHJvdG90eXBlLnJlc29sdmUgPSBmdW5jdGlvbiByZXNvbHZlKGtleXMpIHtcbiAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIHZhciBmb3VuZCA9IHZvaWQgMDtcbiAgICB2YXIgdXNlZEtleSA9IHZvaWQgMDtcblxuICAgIGlmICh0eXBlb2Yga2V5cyA9PT0gJ3N0cmluZycpIGtleXMgPSBba2V5c107XG5cbiAgICAvLyBmb3JFYWNoIHBvc3NpYmxlIGtleVxuICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgaWYgKF90aGlzNC5pc1ZhbGlkTG9va3VwKGZvdW5kKSkgcmV0dXJuO1xuICAgICAgdmFyIGV4dHJhY3RlZCA9IF90aGlzNC5leHRyYWN0RnJvbUtleShrLCBvcHRpb25zKTtcbiAgICAgIHZhciBrZXkgPSBleHRyYWN0ZWQua2V5O1xuICAgICAgdXNlZEtleSA9IGtleTtcbiAgICAgIHZhciBuYW1lc3BhY2VzID0gZXh0cmFjdGVkLm5hbWVzcGFjZXM7XG4gICAgICBpZiAoX3RoaXM0Lm9wdGlvbnMuZmFsbGJhY2tOUykgbmFtZXNwYWNlcyA9IG5hbWVzcGFjZXMuY29uY2F0KF90aGlzNC5vcHRpb25zLmZhbGxiYWNrTlMpO1xuXG4gICAgICB2YXIgbmVlZHNQbHVyYWxIYW5kbGluZyA9IG9wdGlvbnMuY291bnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5jb3VudCAhPT0gJ3N0cmluZyc7XG4gICAgICB2YXIgbmVlZHNDb250ZXh0SGFuZGxpbmcgPSBvcHRpb25zLmNvbnRleHQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5jb250ZXh0ID09PSAnc3RyaW5nJyAmJiBvcHRpb25zLmNvbnRleHQgIT09ICcnO1xuXG4gICAgICB2YXIgY29kZXMgPSBvcHRpb25zLmxuZ3MgPyBvcHRpb25zLmxuZ3MgOiBfdGhpczQubGFuZ3VhZ2VVdGlscy50b1Jlc29sdmVIaWVyYXJjaHkob3B0aW9ucy5sbmcgfHwgX3RoaXM0Lmxhbmd1YWdlKTtcblxuICAgICAgbmFtZXNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChucykge1xuICAgICAgICBpZiAoX3RoaXM0LmlzVmFsaWRMb29rdXAoZm91bmQpKSByZXR1cm47XG5cbiAgICAgICAgY29kZXMuZm9yRWFjaChmdW5jdGlvbiAoY29kZSkge1xuICAgICAgICAgIGlmIChfdGhpczQuaXNWYWxpZExvb2t1cChmb3VuZCkpIHJldHVybjtcblxuICAgICAgICAgIHZhciBmaW5hbEtleSA9IGtleTtcbiAgICAgICAgICB2YXIgZmluYWxLZXlzID0gW2ZpbmFsS2V5XTtcblxuICAgICAgICAgIHZhciBwbHVyYWxTdWZmaXggPSB2b2lkIDA7XG4gICAgICAgICAgaWYgKG5lZWRzUGx1cmFsSGFuZGxpbmcpIHBsdXJhbFN1ZmZpeCA9IF90aGlzNC5wbHVyYWxSZXNvbHZlci5nZXRTdWZmaXgoY29kZSwgb3B0aW9ucy5jb3VudCk7XG5cbiAgICAgICAgICAvLyBmYWxsYmFjayBmb3IgcGx1cmFsIGlmIGNvbnRleHQgbm90IGZvdW5kXG4gICAgICAgICAgaWYgKG5lZWRzUGx1cmFsSGFuZGxpbmcgJiYgbmVlZHNDb250ZXh0SGFuZGxpbmcpIGZpbmFsS2V5cy5wdXNoKGZpbmFsS2V5ICsgcGx1cmFsU3VmZml4KTtcblxuICAgICAgICAgIC8vIGdldCBrZXkgZm9yIGNvbnRleHQgaWYgbmVlZGVkXG4gICAgICAgICAgaWYgKG5lZWRzQ29udGV4dEhhbmRsaW5nKSBmaW5hbEtleXMucHVzaChmaW5hbEtleSArPSAnJyArIF90aGlzNC5vcHRpb25zLmNvbnRleHRTZXBhcmF0b3IgKyBvcHRpb25zLmNvbnRleHQpO1xuXG4gICAgICAgICAgLy8gZ2V0IGtleSBmb3IgcGx1cmFsIGlmIG5lZWRlZFxuICAgICAgICAgIGlmIChuZWVkc1BsdXJhbEhhbmRsaW5nKSBmaW5hbEtleXMucHVzaChmaW5hbEtleSArPSBwbHVyYWxTdWZmaXgpO1xuXG4gICAgICAgICAgLy8gaXRlcmF0ZSBvdmVyIGZpbmFsS2V5cyBzdGFydGluZyB3aXRoIG1vc3Qgc3BlY2lmaWMgcGx1cmFsa2V5ICgtPiBjb250ZXh0a2V5IG9ubHkpIC0+IHNpbmd1bGFya2V5IG9ubHlcbiAgICAgICAgICB2YXIgcG9zc2libGVLZXkgPSB2b2lkIDA7XG4gICAgICAgICAgLyogZXNsaW50IG5vLWNvbmQtYXNzaWduOiAwICovXG4gICAgICAgICAgd2hpbGUgKHBvc3NpYmxlS2V5ID0gZmluYWxLZXlzLnBvcCgpKSB7XG4gICAgICAgICAgICBpZiAoIV90aGlzNC5pc1ZhbGlkTG9va3VwKGZvdW5kKSkge1xuICAgICAgICAgICAgICBmb3VuZCA9IF90aGlzNC5nZXRSZXNvdXJjZShjb2RlLCBucywgcG9zc2libGVLZXksIG9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7IHJlczogZm91bmQsIHVzZWRLZXk6IHVzZWRLZXkgfTtcbiAgfTtcblxuICBUcmFuc2xhdG9yLnByb3RvdHlwZS5pc1ZhbGlkTG9va3VwID0gZnVuY3Rpb24gaXNWYWxpZExvb2t1cChyZXMpIHtcbiAgICByZXR1cm4gcmVzICE9PSB1bmRlZmluZWQgJiYgISghdGhpcy5vcHRpb25zLnJldHVybk51bGwgJiYgcmVzID09PSBudWxsKSAmJiAhKCF0aGlzLm9wdGlvbnMucmV0dXJuRW1wdHlTdHJpbmcgJiYgcmVzID09PSAnJyk7XG4gIH07XG5cbiAgVHJhbnNsYXRvci5wcm90b3R5cGUuZ2V0UmVzb3VyY2UgPSBmdW5jdGlvbiBnZXRSZXNvdXJjZShjb2RlLCBucywga2V5KSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IHt9O1xuXG4gICAgcmV0dXJuIHRoaXMucmVzb3VyY2VTdG9yZS5nZXRSZXNvdXJjZShjb2RlLCBucywga2V5LCBvcHRpb25zKTtcbiAgfTtcblxuICByZXR1cm4gVHJhbnNsYXRvcjtcbn0oRXZlbnRFbWl0dGVyKTtcblxuZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZy5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0cmluZy5zbGljZSgxKTtcbn1cblxudmFyIExhbmd1YWdlVXRpbCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTGFuZ3VhZ2VVdGlsKG9wdGlvbnMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBMYW5ndWFnZVV0aWwpO1xuXG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMud2hpdGVsaXN0ID0gdGhpcy5vcHRpb25zLndoaXRlbGlzdCB8fCBmYWxzZTtcbiAgICB0aGlzLmxvZ2dlciA9IGJhc2VMb2dnZXIuY3JlYXRlKCdsYW5ndWFnZVV0aWxzJyk7XG4gIH1cblxuICBMYW5ndWFnZVV0aWwucHJvdG90eXBlLmdldFNjcmlwdFBhcnRGcm9tQ29kZSA9IGZ1bmN0aW9uIGdldFNjcmlwdFBhcnRGcm9tQ29kZShjb2RlKSB7XG4gICAgaWYgKCFjb2RlIHx8IGNvZGUuaW5kZXhPZignLScpIDwgMCkgcmV0dXJuIG51bGw7XG5cbiAgICB2YXIgcCA9IGNvZGUuc3BsaXQoJy0nKTtcbiAgICBpZiAocC5sZW5ndGggPT09IDIpIHJldHVybiBudWxsO1xuICAgIHAucG9wKCk7XG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0TGFuZ3VhZ2VDb2RlKHAuam9pbignLScpKTtcbiAgfTtcblxuICBMYW5ndWFnZVV0aWwucHJvdG90eXBlLmdldExhbmd1YWdlUGFydEZyb21Db2RlID0gZnVuY3Rpb24gZ2V0TGFuZ3VhZ2VQYXJ0RnJvbUNvZGUoY29kZSkge1xuICAgIGlmICghY29kZSB8fCBjb2RlLmluZGV4T2YoJy0nKSA8IDApIHJldHVybiBjb2RlO1xuXG4gICAgdmFyIHAgPSBjb2RlLnNwbGl0KCctJyk7XG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0TGFuZ3VhZ2VDb2RlKHBbMF0pO1xuICB9O1xuXG4gIExhbmd1YWdlVXRpbC5wcm90b3R5cGUuZm9ybWF0TGFuZ3VhZ2VDb2RlID0gZnVuY3Rpb24gZm9ybWF0TGFuZ3VhZ2VDb2RlKGNvZGUpIHtcbiAgICAvLyBodHRwOi8vd3d3LmlhbmEub3JnL2Fzc2lnbm1lbnRzL2xhbmd1YWdlLXRhZ3MvbGFuZ3VhZ2UtdGFncy54aHRtbFxuICAgIGlmICh0eXBlb2YgY29kZSA9PT0gJ3N0cmluZycgJiYgY29kZS5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgdmFyIHNwZWNpYWxDYXNlcyA9IFsnaGFucycsICdoYW50JywgJ2xhdG4nLCAnY3lybCcsICdjYW5zJywgJ21vbmcnLCAnYXJhYiddO1xuICAgICAgdmFyIHAgPSBjb2RlLnNwbGl0KCctJyk7XG5cbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubG93ZXJDYXNlTG5nKSB7XG4gICAgICAgIHAgPSBwLm1hcChmdW5jdGlvbiAocGFydCkge1xuICAgICAgICAgIHJldHVybiBwYXJ0LnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmIChwLmxlbmd0aCA9PT0gMikge1xuICAgICAgICBwWzBdID0gcFswXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBwWzFdID0gcFsxXS50b1VwcGVyQ2FzZSgpO1xuXG4gICAgICAgIGlmIChzcGVjaWFsQ2FzZXMuaW5kZXhPZihwWzFdLnRvTG93ZXJDYXNlKCkpID4gLTEpIHBbMV0gPSBjYXBpdGFsaXplKHBbMV0udG9Mb3dlckNhc2UoKSk7XG4gICAgICB9IGVsc2UgaWYgKHAubGVuZ3RoID09PSAzKSB7XG4gICAgICAgIHBbMF0gPSBwWzBdLnRvTG93ZXJDYXNlKCk7XG5cbiAgICAgICAgLy8gaWYgbGVuZ2h0IDIgZ3Vlc3MgaXQncyBhIGNvdW50cnlcbiAgICAgICAgaWYgKHBbMV0ubGVuZ3RoID09PSAyKSBwWzFdID0gcFsxXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBpZiAocFswXSAhPT0gJ3NnbicgJiYgcFsyXS5sZW5ndGggPT09IDIpIHBbMl0gPSBwWzJdLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgaWYgKHNwZWNpYWxDYXNlcy5pbmRleE9mKHBbMV0udG9Mb3dlckNhc2UoKSkgPiAtMSkgcFsxXSA9IGNhcGl0YWxpemUocFsxXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgICAgaWYgKHNwZWNpYWxDYXNlcy5pbmRleE9mKHBbMl0udG9Mb3dlckNhc2UoKSkgPiAtMSkgcFsyXSA9IGNhcGl0YWxpemUocFsyXS50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHAuam9pbignLScpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuY2xlYW5Db2RlIHx8IHRoaXMub3B0aW9ucy5sb3dlckNhc2VMbmcgPyBjb2RlLnRvTG93ZXJDYXNlKCkgOiBjb2RlO1xuICB9O1xuXG4gIExhbmd1YWdlVXRpbC5wcm90b3R5cGUuaXNXaGl0ZWxpc3RlZCA9IGZ1bmN0aW9uIGlzV2hpdGVsaXN0ZWQoY29kZSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMubG9hZCA9PT0gJ2xhbmd1YWdlT25seScgfHwgdGhpcy5vcHRpb25zLm5vbkV4cGxpY2l0V2hpdGVsaXN0KSB7XG4gICAgICBjb2RlID0gdGhpcy5nZXRMYW5ndWFnZVBhcnRGcm9tQ29kZShjb2RlKTtcbiAgICB9XG4gICAgcmV0dXJuICF0aGlzLndoaXRlbGlzdCB8fCAhdGhpcy53aGl0ZWxpc3QubGVuZ3RoIHx8IHRoaXMud2hpdGVsaXN0LmluZGV4T2YoY29kZSkgPiAtMTtcbiAgfTtcblxuICBMYW5ndWFnZVV0aWwucHJvdG90eXBlLmdldEZhbGxiYWNrQ29kZXMgPSBmdW5jdGlvbiBnZXRGYWxsYmFja0NvZGVzKGZhbGxiYWNrcywgY29kZSkge1xuICAgIGlmICghZmFsbGJhY2tzKSByZXR1cm4gW107XG4gICAgaWYgKHR5cGVvZiBmYWxsYmFja3MgPT09ICdzdHJpbmcnKSBmYWxsYmFja3MgPSBbZmFsbGJhY2tzXTtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseShmYWxsYmFja3MpID09PSAnW29iamVjdCBBcnJheV0nKSByZXR1cm4gZmFsbGJhY2tzO1xuXG4gICAgaWYgKCFjb2RlKSByZXR1cm4gZmFsbGJhY2tzLmRlZmF1bHQgfHwgW107XG5cbiAgICAvLyBhc3VtZSB3ZSBoYXZlIGFuIG9iamVjdCBkZWZpbmluZyBmYWxsYmFja3NcbiAgICB2YXIgZm91bmQgPSBmYWxsYmFja3NbY29kZV07XG4gICAgaWYgKCFmb3VuZCkgZm91bmQgPSBmYWxsYmFja3NbdGhpcy5nZXRTY3JpcHRQYXJ0RnJvbUNvZGUoY29kZSldO1xuICAgIGlmICghZm91bmQpIGZvdW5kID0gZmFsbGJhY2tzW3RoaXMuZm9ybWF0TGFuZ3VhZ2VDb2RlKGNvZGUpXTtcbiAgICBpZiAoIWZvdW5kKSBmb3VuZCA9IGZhbGxiYWNrcy5kZWZhdWx0O1xuXG4gICAgcmV0dXJuIGZvdW5kIHx8IFtdO1xuICB9O1xuXG4gIExhbmd1YWdlVXRpbC5wcm90b3R5cGUudG9SZXNvbHZlSGllcmFyY2h5ID0gZnVuY3Rpb24gdG9SZXNvbHZlSGllcmFyY2h5KGNvZGUsIGZhbGxiYWNrQ29kZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgZmFsbGJhY2tDb2RlcyA9IHRoaXMuZ2V0RmFsbGJhY2tDb2RlcyhmYWxsYmFja0NvZGUgfHwgdGhpcy5vcHRpb25zLmZhbGxiYWNrTG5nIHx8IFtdLCBjb2RlKTtcblxuICAgIHZhciBjb2RlcyA9IFtdO1xuICAgIHZhciBhZGRDb2RlID0gZnVuY3Rpb24gYWRkQ29kZShjKSB7XG4gICAgICBpZiAoIWMpIHJldHVybjtcbiAgICAgIGlmIChfdGhpcy5pc1doaXRlbGlzdGVkKGMpKSB7XG4gICAgICAgIGNvZGVzLnB1c2goYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfdGhpcy5sb2dnZXIud2FybigncmVqZWN0aW5nIG5vbi13aGl0ZWxpc3RlZCBsYW5ndWFnZSBjb2RlOiAnICsgYyk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgY29kZSA9PT0gJ3N0cmluZycgJiYgY29kZS5pbmRleE9mKCctJykgPiAtMSkge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5sb2FkICE9PSAnbGFuZ3VhZ2VPbmx5JykgYWRkQ29kZSh0aGlzLmZvcm1hdExhbmd1YWdlQ29kZShjb2RlKSk7XG4gICAgICBpZiAodGhpcy5vcHRpb25zLmxvYWQgIT09ICdsYW5ndWFnZU9ubHknICYmIHRoaXMub3B0aW9ucy5sb2FkICE9PSAnY3VycmVudE9ubHknKSBhZGRDb2RlKHRoaXMuZ2V0U2NyaXB0UGFydEZyb21Db2RlKGNvZGUpKTtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMubG9hZCAhPT0gJ2N1cnJlbnRPbmx5JykgYWRkQ29kZSh0aGlzLmdldExhbmd1YWdlUGFydEZyb21Db2RlKGNvZGUpKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjb2RlID09PSAnc3RyaW5nJykge1xuICAgICAgYWRkQ29kZSh0aGlzLmZvcm1hdExhbmd1YWdlQ29kZShjb2RlKSk7XG4gICAgfVxuXG4gICAgZmFsbGJhY2tDb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChmYykge1xuICAgICAgaWYgKGNvZGVzLmluZGV4T2YoZmMpIDwgMCkgYWRkQ29kZShfdGhpcy5mb3JtYXRMYW5ndWFnZUNvZGUoZmMpKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBjb2RlcztcbiAgfTtcblxuICByZXR1cm4gTGFuZ3VhZ2VVdGlsO1xufSgpO1xuXG4vLyBkZWZpbml0aW9uIGh0dHA6Ly90cmFuc2xhdGUuc291cmNlZm9yZ2UubmV0L3dpa2kvbDEwbi9wbHVyYWxmb3Jtc1xuLyogZXNsaW50LWRpc2FibGUgKi9cbnZhciBzZXRzID0gW3sgbG5nczogWydhY2gnLCAnYWsnLCAnYW0nLCAnYXJuJywgJ2JyJywgJ2ZpbCcsICdndW4nLCAnbG4nLCAnbWZlJywgJ21nJywgJ21pJywgJ29jJywgJ3B0JywgJ3B0LUJSJywgJ3RnJywgJ3RpJywgJ3RyJywgJ3V6JywgJ3dhJ10sIG5yOiBbMSwgMl0sIGZjOiAxIH0sIHsgbG5nczogWydhZicsICdhbicsICdhc3QnLCAnYXonLCAnYmcnLCAnYm4nLCAnY2EnLCAnZGEnLCAnZGUnLCAnZGV2JywgJ2VsJywgJ2VuJywgJ2VvJywgJ2VzJywgJ2V0JywgJ2V1JywgJ2ZpJywgJ2ZvJywgJ2Z1cicsICdmeScsICdnbCcsICdndScsICdoYScsICdoZScsICdoaScsICdodScsICdoeScsICdpYScsICdpdCcsICdrbicsICdrdScsICdsYicsICdtYWknLCAnbWwnLCAnbW4nLCAnbXInLCAnbmFoJywgJ25hcCcsICduYicsICduZScsICdubCcsICdubicsICdubycsICduc28nLCAncGEnLCAncGFwJywgJ3BtcycsICdwcycsICdwdC1QVCcsICdybScsICdzY28nLCAnc2UnLCAnc2knLCAnc28nLCAnc29uJywgJ3NxJywgJ3N2JywgJ3N3JywgJ3RhJywgJ3RlJywgJ3RrJywgJ3VyJywgJ3lvJ10sIG5yOiBbMSwgMl0sIGZjOiAyIH0sIHsgbG5nczogWydheScsICdibycsICdjZ2cnLCAnZmEnLCAnaWQnLCAnamEnLCAnamJvJywgJ2thJywgJ2trJywgJ2ttJywgJ2tvJywgJ2t5JywgJ2xvJywgJ21zJywgJ3NhaCcsICdzdScsICd0aCcsICd0dCcsICd1ZycsICd2aScsICd3bycsICd6aCddLCBucjogWzFdLCBmYzogMyB9LCB7IGxuZ3M6IFsnYmUnLCAnYnMnLCAnZHonLCAnaHInLCAncnUnLCAnc3InLCAndWsnXSwgbnI6IFsxLCAyLCA1XSwgZmM6IDQgfSwgeyBsbmdzOiBbJ2FyJ10sIG5yOiBbMCwgMSwgMiwgMywgMTEsIDEwMF0sIGZjOiA1IH0sIHsgbG5nczogWydjcycsICdzayddLCBucjogWzEsIDIsIDVdLCBmYzogNiB9LCB7IGxuZ3M6IFsnY3NiJywgJ3BsJ10sIG5yOiBbMSwgMiwgNV0sIGZjOiA3IH0sIHsgbG5nczogWydjeSddLCBucjogWzEsIDIsIDMsIDhdLCBmYzogOCB9LCB7IGxuZ3M6IFsnZnInXSwgbnI6IFsxLCAyXSwgZmM6IDkgfSwgeyBsbmdzOiBbJ2dhJ10sIG5yOiBbMSwgMiwgMywgNywgMTFdLCBmYzogMTAgfSwgeyBsbmdzOiBbJ2dkJ10sIG5yOiBbMSwgMiwgMywgMjBdLCBmYzogMTEgfSwgeyBsbmdzOiBbJ2lzJ10sIG5yOiBbMSwgMl0sIGZjOiAxMiB9LCB7IGxuZ3M6IFsnanYnXSwgbnI6IFswLCAxXSwgZmM6IDEzIH0sIHsgbG5nczogWydrdyddLCBucjogWzEsIDIsIDMsIDRdLCBmYzogMTQgfSwgeyBsbmdzOiBbJ2x0J10sIG5yOiBbMSwgMiwgMTBdLCBmYzogMTUgfSwgeyBsbmdzOiBbJ2x2J10sIG5yOiBbMSwgMiwgMF0sIGZjOiAxNiB9LCB7IGxuZ3M6IFsnbWsnXSwgbnI6IFsxLCAyXSwgZmM6IDE3IH0sIHsgbG5nczogWydtbmsnXSwgbnI6IFswLCAxLCAyXSwgZmM6IDE4IH0sIHsgbG5nczogWydtdCddLCBucjogWzEsIDIsIDExLCAyMF0sIGZjOiAxOSB9LCB7IGxuZ3M6IFsnb3InXSwgbnI6IFsyLCAxXSwgZmM6IDIgfSwgeyBsbmdzOiBbJ3JvJ10sIG5yOiBbMSwgMiwgMjBdLCBmYzogMjAgfSwgeyBsbmdzOiBbJ3NsJ10sIG5yOiBbNSwgMSwgMiwgM10sIGZjOiAyMSB9XTtcblxudmFyIF9ydWxlc1BsdXJhbHNUeXBlcyA9IHtcbiAgMTogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuID4gMSk7XG4gIH0sXG4gIDI6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiAhPSAxKTtcbiAgfSxcbiAgMzogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIDA7XG4gIH0sXG4gIDQ6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiAlIDEwID09IDEgJiYgbiAlIDEwMCAhPSAxMSA/IDAgOiBuICUgMTAgPj0gMiAmJiBuICUgMTAgPD0gNCAmJiAobiAlIDEwMCA8IDEwIHx8IG4gJSAxMDAgPj0gMjApID8gMSA6IDIpO1xuICB9LFxuICA1OiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT09IDAgPyAwIDogbiA9PSAxID8gMSA6IG4gPT0gMiA/IDIgOiBuICUgMTAwID49IDMgJiYgbiAlIDEwMCA8PSAxMCA/IDMgOiBuICUgMTAwID49IDExID8gNCA6IDUpO1xuICB9LFxuICA2OiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSA/IDAgOiBuID49IDIgJiYgbiA8PSA0ID8gMSA6IDIpO1xuICB9LFxuICA3OiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSA/IDAgOiBuICUgMTAgPj0gMiAmJiBuICUgMTAgPD0gNCAmJiAobiAlIDEwMCA8IDEwIHx8IG4gJSAxMDAgPj0gMjApID8gMSA6IDIpO1xuICB9LFxuICA4OiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSA/IDAgOiBuID09IDIgPyAxIDogbiAhPSA4ICYmIG4gIT0gMTEgPyAyIDogMyk7XG4gIH0sXG4gIDk6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA+PSAyKTtcbiAgfSxcbiAgMTA6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PSAxID8gMCA6IG4gPT0gMiA/IDEgOiBuIDwgNyA/IDIgOiBuIDwgMTEgPyAzIDogNCk7XG4gIH0sXG4gIDExOiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSB8fCBuID09IDExID8gMCA6IG4gPT0gMiB8fCBuID09IDEyID8gMSA6IG4gPiAyICYmIG4gPCAyMCA/IDIgOiAzKTtcbiAgfSxcbiAgMTI6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiAlIDEwICE9IDEgfHwgbiAlIDEwMCA9PSAxMSk7XG4gIH0sXG4gIDEzOiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gIT09IDApO1xuICB9LFxuICAxNDogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuID09IDEgPyAwIDogbiA9PSAyID8gMSA6IG4gPT0gMyA/IDIgOiAzKTtcbiAgfSxcbiAgMTU6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiAlIDEwID09IDEgJiYgbiAlIDEwMCAhPSAxMSA/IDAgOiBuICUgMTAgPj0gMiAmJiAobiAlIDEwMCA8IDEwIHx8IG4gJSAxMDAgPj0gMjApID8gMSA6IDIpO1xuICB9LFxuICAxNjogZnVuY3Rpb24gXyhuKSB7XG4gICAgcmV0dXJuIE51bWJlcihuICUgMTAgPT0gMSAmJiBuICUgMTAwICE9IDExID8gMCA6IG4gIT09IDAgPyAxIDogMik7XG4gIH0sXG4gIDE3OiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSB8fCBuICUgMTAgPT0gMSA/IDAgOiAxKTtcbiAgfSxcbiAgMTg6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PSAwID8gMCA6IG4gPT0gMSA/IDEgOiAyKTtcbiAgfSxcbiAgMTk6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiA9PSAxID8gMCA6IG4gPT09IDAgfHwgbiAlIDEwMCA+IDEgJiYgbiAlIDEwMCA8IDExID8gMSA6IG4gJSAxMDAgPiAxMCAmJiBuICUgMTAwIDwgMjAgPyAyIDogMyk7XG4gIH0sXG4gIDIwOiBmdW5jdGlvbiBfKG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4gPT0gMSA/IDAgOiBuID09PSAwIHx8IG4gJSAxMDAgPiAwICYmIG4gJSAxMDAgPCAyMCA/IDEgOiAyKTtcbiAgfSxcbiAgMjE6IGZ1bmN0aW9uIF8obikge1xuICAgIHJldHVybiBOdW1iZXIobiAlIDEwMCA9PSAxID8gMSA6IG4gJSAxMDAgPT0gMiA/IDIgOiBuICUgMTAwID09IDMgfHwgbiAlIDEwMCA9PSA0ID8gMyA6IDApO1xuICB9XG59O1xuLyogZXNsaW50LWVuYWJsZSAqL1xuXG5mdW5jdGlvbiBjcmVhdGVSdWxlcygpIHtcbiAgdmFyIHJ1bGVzID0ge307XG4gIHNldHMuZm9yRWFjaChmdW5jdGlvbiAoc2V0JCQxKSB7XG4gICAgc2V0JCQxLmxuZ3MuZm9yRWFjaChmdW5jdGlvbiAobCkge1xuICAgICAgcnVsZXNbbF0gPSB7XG4gICAgICAgIG51bWJlcnM6IHNldCQkMS5ucixcbiAgICAgICAgcGx1cmFsczogX3J1bGVzUGx1cmFsc1R5cGVzW3NldCQkMS5mY11cbiAgICAgIH07XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gcnVsZXM7XG59XG5cbnZhciBQbHVyYWxSZXNvbHZlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUGx1cmFsUmVzb2x2ZXIobGFuZ3VhZ2VVdGlscykge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBQbHVyYWxSZXNvbHZlcik7XG5cbiAgICB0aGlzLmxhbmd1YWdlVXRpbHMgPSBsYW5ndWFnZVV0aWxzO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLmxvZ2dlciA9IGJhc2VMb2dnZXIuY3JlYXRlKCdwbHVyYWxSZXNvbHZlcicpO1xuXG4gICAgdGhpcy5ydWxlcyA9IGNyZWF0ZVJ1bGVzKCk7XG4gIH1cblxuICBQbHVyYWxSZXNvbHZlci5wcm90b3R5cGUuYWRkUnVsZSA9IGZ1bmN0aW9uIGFkZFJ1bGUobG5nLCBvYmopIHtcbiAgICB0aGlzLnJ1bGVzW2xuZ10gPSBvYmo7XG4gIH07XG5cbiAgUGx1cmFsUmVzb2x2ZXIucHJvdG90eXBlLmdldFJ1bGUgPSBmdW5jdGlvbiBnZXRSdWxlKGNvZGUpIHtcbiAgICByZXR1cm4gdGhpcy5ydWxlc1tjb2RlXSB8fCB0aGlzLnJ1bGVzW3RoaXMubGFuZ3VhZ2VVdGlscy5nZXRMYW5ndWFnZVBhcnRGcm9tQ29kZShjb2RlKV07XG4gIH07XG5cbiAgUGx1cmFsUmVzb2x2ZXIucHJvdG90eXBlLm5lZWRzUGx1cmFsID0gZnVuY3Rpb24gbmVlZHNQbHVyYWwoY29kZSkge1xuICAgIHZhciBydWxlID0gdGhpcy5nZXRSdWxlKGNvZGUpO1xuXG4gICAgcmV0dXJuIHJ1bGUgJiYgcnVsZS5udW1iZXJzLmxlbmd0aCA+IDE7XG4gIH07XG5cbiAgUGx1cmFsUmVzb2x2ZXIucHJvdG90eXBlLmdldFBsdXJhbEZvcm1zT2ZLZXkgPSBmdW5jdGlvbiBnZXRQbHVyYWxGb3Jtc09mS2V5KGNvZGUsIGtleSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcmV0ID0gW107XG5cbiAgICB2YXIgcnVsZSA9IHRoaXMuZ2V0UnVsZShjb2RlKTtcblxuICAgIHJ1bGUubnVtYmVycy5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICB2YXIgc3VmZml4ID0gX3RoaXMuZ2V0U3VmZml4KGNvZGUsIG4pO1xuICAgICAgcmV0LnB1c2goJycgKyBrZXkgKyBzdWZmaXgpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBQbHVyYWxSZXNvbHZlci5wcm90b3R5cGUuZ2V0U3VmZml4ID0gZnVuY3Rpb24gZ2V0U3VmZml4KGNvZGUsIGNvdW50KSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB2YXIgcnVsZSA9IHRoaXMuZ2V0UnVsZShjb2RlKTtcblxuICAgIGlmIChydWxlKSB7XG4gICAgICAvLyBpZiAocnVsZS5udW1iZXJzLmxlbmd0aCA9PT0gMSkgcmV0dXJuICcnOyAvLyBvbmx5IHNpbmd1bGFyXG5cbiAgICAgIHZhciBpZHggPSBydWxlLm5vQWJzID8gcnVsZS5wbHVyYWxzKGNvdW50KSA6IHJ1bGUucGx1cmFscyhNYXRoLmFicyhjb3VudCkpO1xuICAgICAgdmFyIHN1ZmZpeCA9IHJ1bGUubnVtYmVyc1tpZHhdO1xuXG4gICAgICAvLyBzcGVjaWFsIHRyZWF0bWVudCBmb3IgbG5ncyBvbmx5IGhhdmluZyBzaW5ndWxhciBhbmQgcGx1cmFsXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnNpbXBsaWZ5UGx1cmFsU3VmZml4ICYmIHJ1bGUubnVtYmVycy5sZW5ndGggPT09IDIgJiYgcnVsZS5udW1iZXJzWzBdID09PSAxKSB7XG4gICAgICAgIGlmIChzdWZmaXggPT09IDIpIHtcbiAgICAgICAgICBzdWZmaXggPSAncGx1cmFsJztcbiAgICAgICAgfSBlbHNlIGlmIChzdWZmaXggPT09IDEpIHtcbiAgICAgICAgICBzdWZmaXggPSAnJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgcmV0dXJuU3VmZml4ID0gZnVuY3Rpb24gcmV0dXJuU3VmZml4KCkge1xuICAgICAgICByZXR1cm4gX3RoaXMyLm9wdGlvbnMucHJlcGVuZCAmJiBzdWZmaXgudG9TdHJpbmcoKSA/IF90aGlzMi5vcHRpb25zLnByZXBlbmQgKyBzdWZmaXgudG9TdHJpbmcoKSA6IHN1ZmZpeC50b1N0cmluZygpO1xuICAgICAgfTtcblxuICAgICAgLy8gQ09NUEFUSUJJTElUWSBKU09OXG4gICAgICAvLyB2MVxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jb21wYXRpYmlsaXR5SlNPTiA9PT0gJ3YxJykge1xuICAgICAgICBpZiAoc3VmZml4ID09PSAxKSByZXR1cm4gJyc7XG4gICAgICAgIGlmICh0eXBlb2Ygc3VmZml4ID09PSAnbnVtYmVyJykgcmV0dXJuICdfcGx1cmFsXycgKyBzdWZmaXgudG9TdHJpbmcoKTtcbiAgICAgICAgcmV0dXJuIHJldHVyblN1ZmZpeCgpO1xuICAgICAgfSBlbHNlIGlmICggLyogdjIgKi90aGlzLm9wdGlvbnMuY29tcGF0aWJpbGl0eUpTT04gPT09ICd2MicgfHwgcnVsZS5udW1iZXJzLmxlbmd0aCA9PT0gMiAmJiBydWxlLm51bWJlcnNbMF0gPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHJldHVyblN1ZmZpeCgpO1xuICAgICAgfSBlbHNlIGlmICggLyogdjMgLSBnZXR0ZXh0IGluZGV4ICovcnVsZS5udW1iZXJzLmxlbmd0aCA9PT0gMiAmJiBydWxlLm51bWJlcnNbMF0gPT09IDEpIHtcbiAgICAgICAgcmV0dXJuIHJldHVyblN1ZmZpeCgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5wcmVwZW5kICYmIGlkeC50b1N0cmluZygpID8gdGhpcy5vcHRpb25zLnByZXBlbmQgKyBpZHgudG9TdHJpbmcoKSA6IGlkeC50b1N0cmluZygpO1xuICAgIH1cblxuICAgIHRoaXMubG9nZ2VyLndhcm4oJ25vIHBsdXJhbCBydWxlIGZvdW5kIGZvcjogJyArIGNvZGUpO1xuICAgIHJldHVybiAnJztcbiAgfTtcblxuICByZXR1cm4gUGx1cmFsUmVzb2x2ZXI7XG59KCk7XG5cbnZhciBJbnRlcnBvbGF0b3IgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEludGVycG9sYXRvcigpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgSW50ZXJwb2xhdG9yKTtcblxuICAgIHRoaXMubG9nZ2VyID0gYmFzZUxvZ2dlci5jcmVhdGUoJ2ludGVycG9sYXRvcicpO1xuXG4gICAgdGhpcy5pbml0KG9wdGlvbnMsIHRydWUpO1xuICB9XG5cbiAgLyogZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOiAwICovXG5cblxuICBJbnRlcnBvbGF0b3IucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICB2YXIgcmVzZXQgPSBhcmd1bWVudHNbMV07XG5cbiAgICBpZiAocmVzZXQpIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICB0aGlzLmZvcm1hdCA9IG9wdGlvbnMuaW50ZXJwb2xhdGlvbiAmJiBvcHRpb25zLmludGVycG9sYXRpb24uZm9ybWF0IHx8IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9O1xuICAgICAgdGhpcy5lc2NhcGUgPSBvcHRpb25zLmludGVycG9sYXRpb24gJiYgb3B0aW9ucy5pbnRlcnBvbGF0aW9uLmVzY2FwZSB8fCBlc2NhcGU7XG4gICAgfVxuICAgIGlmICghb3B0aW9ucy5pbnRlcnBvbGF0aW9uKSBvcHRpb25zLmludGVycG9sYXRpb24gPSB7IGVzY2FwZVZhbHVlOiB0cnVlIH07XG5cbiAgICB2YXIgaU9wdHMgPSBvcHRpb25zLmludGVycG9sYXRpb247XG5cbiAgICB0aGlzLmVzY2FwZVZhbHVlID0gaU9wdHMuZXNjYXBlVmFsdWUgIT09IHVuZGVmaW5lZCA/IGlPcHRzLmVzY2FwZVZhbHVlIDogdHJ1ZTtcblxuICAgIHRoaXMucHJlZml4ID0gaU9wdHMucHJlZml4ID8gcmVnZXhFc2NhcGUoaU9wdHMucHJlZml4KSA6IGlPcHRzLnByZWZpeEVzY2FwZWQgfHwgJ3t7JztcbiAgICB0aGlzLnN1ZmZpeCA9IGlPcHRzLnN1ZmZpeCA/IHJlZ2V4RXNjYXBlKGlPcHRzLnN1ZmZpeCkgOiBpT3B0cy5zdWZmaXhFc2NhcGVkIHx8ICd9fSc7XG5cbiAgICB0aGlzLmZvcm1hdFNlcGFyYXRvciA9IGlPcHRzLmZvcm1hdFNlcGFyYXRvciA/IGlPcHRzLmZvcm1hdFNlcGFyYXRvciA6IGlPcHRzLmZvcm1hdFNlcGFyYXRvciB8fCAnLCc7XG5cbiAgICB0aGlzLnVuZXNjYXBlUHJlZml4ID0gaU9wdHMudW5lc2NhcGVTdWZmaXggPyAnJyA6IGlPcHRzLnVuZXNjYXBlUHJlZml4IHx8ICctJztcbiAgICB0aGlzLnVuZXNjYXBlU3VmZml4ID0gdGhpcy51bmVzY2FwZVByZWZpeCA/ICcnIDogaU9wdHMudW5lc2NhcGVTdWZmaXggfHwgJyc7XG5cbiAgICB0aGlzLm5lc3RpbmdQcmVmaXggPSBpT3B0cy5uZXN0aW5nUHJlZml4ID8gcmVnZXhFc2NhcGUoaU9wdHMubmVzdGluZ1ByZWZpeCkgOiBpT3B0cy5uZXN0aW5nUHJlZml4RXNjYXBlZCB8fCByZWdleEVzY2FwZSgnJHQoJyk7XG4gICAgdGhpcy5uZXN0aW5nU3VmZml4ID0gaU9wdHMubmVzdGluZ1N1ZmZpeCA/IHJlZ2V4RXNjYXBlKGlPcHRzLm5lc3RpbmdTdWZmaXgpIDogaU9wdHMubmVzdGluZ1N1ZmZpeEVzY2FwZWQgfHwgcmVnZXhFc2NhcGUoJyknKTtcblxuICAgIHRoaXMubWF4UmVwbGFjZXMgPSBpT3B0cy5tYXhSZXBsYWNlcyA/IGlPcHRzLm1heFJlcGxhY2VzIDogMTAwMDtcblxuICAgIC8vIHRoZSByZWdleHBcbiAgICB0aGlzLnJlc2V0UmVnRXhwKCk7XG4gIH07XG5cbiAgSW50ZXJwb2xhdG9yLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMpIHRoaXMuaW5pdCh0aGlzLm9wdGlvbnMpO1xuICB9O1xuXG4gIEludGVycG9sYXRvci5wcm90b3R5cGUucmVzZXRSZWdFeHAgPSBmdW5jdGlvbiByZXNldFJlZ0V4cCgpIHtcbiAgICAvLyB0aGUgcmVnZXhwXG4gICAgdmFyIHJlZ2V4cFN0ciA9IHRoaXMucHJlZml4ICsgJyguKz8pJyArIHRoaXMuc3VmZml4O1xuICAgIHRoaXMucmVnZXhwID0gbmV3IFJlZ0V4cChyZWdleHBTdHIsICdnJyk7XG5cbiAgICB2YXIgcmVnZXhwVW5lc2NhcGVTdHIgPSAnJyArIHRoaXMucHJlZml4ICsgdGhpcy51bmVzY2FwZVByZWZpeCArICcoLis/KScgKyB0aGlzLnVuZXNjYXBlU3VmZml4ICsgdGhpcy5zdWZmaXg7XG4gICAgdGhpcy5yZWdleHBVbmVzY2FwZSA9IG5ldyBSZWdFeHAocmVnZXhwVW5lc2NhcGVTdHIsICdnJyk7XG5cbiAgICB2YXIgbmVzdGluZ1JlZ2V4cFN0ciA9IHRoaXMubmVzdGluZ1ByZWZpeCArICcoLis/KScgKyB0aGlzLm5lc3RpbmdTdWZmaXg7XG4gICAgdGhpcy5uZXN0aW5nUmVnZXhwID0gbmV3IFJlZ0V4cChuZXN0aW5nUmVnZXhwU3RyLCAnZycpO1xuICB9O1xuXG4gIEludGVycG9sYXRvci5wcm90b3R5cGUuaW50ZXJwb2xhdGUgPSBmdW5jdGlvbiBpbnRlcnBvbGF0ZShzdHIsIGRhdGEsIGxuZykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgbWF0Y2ggPSB2b2lkIDA7XG4gICAgdmFyIHZhbHVlID0gdm9pZCAwO1xuICAgIHZhciByZXBsYWNlcyA9IHZvaWQgMDtcblxuICAgIGZ1bmN0aW9uIHJlZ2V4U2FmZSh2YWwpIHtcbiAgICAgIHJldHVybiB2YWwucmVwbGFjZSgvXFwkL2csICckJCQkJyk7XG4gICAgfVxuXG4gICAgdmFyIGhhbmRsZUZvcm1hdCA9IGZ1bmN0aW9uIGhhbmRsZUZvcm1hdChrZXkpIHtcbiAgICAgIGlmIChrZXkuaW5kZXhPZihfdGhpcy5mb3JtYXRTZXBhcmF0b3IpIDwgMCkgcmV0dXJuIGdldFBhdGgoZGF0YSwga2V5KTtcblxuICAgICAgdmFyIHAgPSBrZXkuc3BsaXQoX3RoaXMuZm9ybWF0U2VwYXJhdG9yKTtcbiAgICAgIHZhciBrID0gcC5zaGlmdCgpLnRyaW0oKTtcbiAgICAgIHZhciBmID0gcC5qb2luKF90aGlzLmZvcm1hdFNlcGFyYXRvcikudHJpbSgpO1xuXG4gICAgICByZXR1cm4gX3RoaXMuZm9ybWF0KGdldFBhdGgoZGF0YSwgayksIGYsIGxuZyk7XG4gICAgfTtcblxuICAgIHRoaXMucmVzZXRSZWdFeHAoKTtcblxuICAgIHJlcGxhY2VzID0gMDtcbiAgICAvLyB1bmVzY2FwZSBpZiBoYXMgdW5lc2NhcGVQcmVmaXgvU3VmZml4XG4gICAgLyogZXNsaW50IG5vLWNvbmQtYXNzaWduOiAwICovXG4gICAgd2hpbGUgKG1hdGNoID0gdGhpcy5yZWdleHBVbmVzY2FwZS5leGVjKHN0cikpIHtcbiAgICAgIHZhbHVlID0gaGFuZGxlRm9ybWF0KG1hdGNoWzFdLnRyaW0oKSk7XG4gICAgICBzdHIgPSBzdHIucmVwbGFjZShtYXRjaFswXSwgdmFsdWUpO1xuICAgICAgdGhpcy5yZWdleHBVbmVzY2FwZS5sYXN0SW5kZXggPSAwO1xuICAgICAgcmVwbGFjZXMrKztcbiAgICAgIGlmIChyZXBsYWNlcyA+PSB0aGlzLm1heFJlcGxhY2VzKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJlcGxhY2VzID0gMDtcbiAgICAvLyByZWd1bGFyIGVzY2FwZSBvbiBkZW1hbmRcbiAgICB3aGlsZSAobWF0Y2ggPSB0aGlzLnJlZ2V4cC5leGVjKHN0cikpIHtcbiAgICAgIHZhbHVlID0gaGFuZGxlRm9ybWF0KG1hdGNoWzFdLnRyaW0oKSk7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykgdmFsdWUgPSBtYWtlU3RyaW5nKHZhbHVlKTtcbiAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIud2FybignbWlzc2VkIHRvIHBhc3MgaW4gdmFyaWFibGUgJyArIG1hdGNoWzFdICsgJyBmb3IgaW50ZXJwb2xhdGluZyAnICsgc3RyKTtcbiAgICAgICAgdmFsdWUgPSAnJztcbiAgICAgIH1cbiAgICAgIHZhbHVlID0gdGhpcy5lc2NhcGVWYWx1ZSA/IHJlZ2V4U2FmZSh0aGlzLmVzY2FwZSh2YWx1ZSkpIDogcmVnZXhTYWZlKHZhbHVlKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG1hdGNoWzBdLCB2YWx1ZSk7XG4gICAgICB0aGlzLnJlZ2V4cC5sYXN0SW5kZXggPSAwO1xuICAgICAgcmVwbGFjZXMrKztcbiAgICAgIGlmIChyZXBsYWNlcyA+PSB0aGlzLm1heFJlcGxhY2VzKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9O1xuXG4gIEludGVycG9sYXRvci5wcm90b3R5cGUubmVzdCA9IGZ1bmN0aW9uIG5lc3Qoc3RyLCBmYykge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcblxuICAgIHZhciBtYXRjaCA9IHZvaWQgMDtcbiAgICB2YXIgdmFsdWUgPSB2b2lkIDA7XG5cbiAgICB2YXIgY2xvbmVkT3B0aW9ucyA9IF9leHRlbmRzKHt9LCBvcHRpb25zKTtcbiAgICBjbG9uZWRPcHRpb25zLmFwcGx5UG9zdFByb2Nlc3NvciA9IGZhbHNlOyAvLyBhdm9pZCBwb3N0IHByb2Nlc3Npbmcgb24gbmVzdGVkIGxvb2t1cFxuXG4gICAgLy8gaWYgdmFsdWUgaXMgc29tZXRoaW5nIGxpa2UgXCJteUtleVwiOiBcImxvcmVtICQoYW5vdGhlcktleSwgeyBcImNvdW50XCI6IHt7YVZhbHVlSW5PcHRpb25zfX0gfSlcIlxuICAgIGZ1bmN0aW9uIGhhbmRsZUhhc09wdGlvbnMoa2V5LCBpbmhlcml0ZWRPcHRpb25zKSB7XG4gICAgICBpZiAoa2V5LmluZGV4T2YoJywnKSA8IDApIHJldHVybiBrZXk7XG5cbiAgICAgIHZhciBwID0ga2V5LnNwbGl0KCcsJyk7XG4gICAgICBrZXkgPSBwLnNoaWZ0KCk7XG4gICAgICB2YXIgb3B0aW9uc1N0cmluZyA9IHAuam9pbignLCcpO1xuICAgICAgb3B0aW9uc1N0cmluZyA9IHRoaXMuaW50ZXJwb2xhdGUob3B0aW9uc1N0cmluZywgY2xvbmVkT3B0aW9ucyk7XG4gICAgICBvcHRpb25zU3RyaW5nID0gb3B0aW9uc1N0cmluZy5yZXBsYWNlKC8nL2csICdcIicpO1xuXG4gICAgICB0cnkge1xuICAgICAgICBjbG9uZWRPcHRpb25zID0gSlNPTi5wYXJzZShvcHRpb25zU3RyaW5nKTtcblxuICAgICAgICBpZiAoaW5oZXJpdGVkT3B0aW9ucykgY2xvbmVkT3B0aW9ucyA9IF9leHRlbmRzKHt9LCBpbmhlcml0ZWRPcHRpb25zLCBjbG9uZWRPcHRpb25zKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5sb2dnZXIuZXJyb3IoJ2ZhaWxlZCBwYXJzaW5nIG9wdGlvbnMgc3RyaW5nIGluIG5lc3RpbmcgZm9yIGtleSAnICsga2V5LCBlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGtleTtcbiAgICB9XG5cbiAgICAvLyByZWd1bGFyIGVzY2FwZSBvbiBkZW1hbmRcbiAgICB3aGlsZSAobWF0Y2ggPSB0aGlzLm5lc3RpbmdSZWdleHAuZXhlYyhzdHIpKSB7XG4gICAgICB2YWx1ZSA9IGZjKGhhbmRsZUhhc09wdGlvbnMuY2FsbCh0aGlzLCBtYXRjaFsxXS50cmltKCksIGNsb25lZE9wdGlvbnMpLCBjbG9uZWRPcHRpb25zKTtcblxuICAgICAgLy8gaXMgb25seSB0aGUgbmVzdGluZyBrZXkgKGtleTEgPSAnJChrZXkyKScpIHJldHVybiB0aGUgdmFsdWUgd2l0aG91dCBzdHJpbmdpZnlcbiAgICAgIGlmICh2YWx1ZSAmJiBtYXRjaFswXSA9PT0gc3RyICYmIHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHJldHVybiB2YWx1ZTtcblxuICAgICAgLy8gbm8gc3RyaW5nIHRvIGluY2x1ZGUgb3IgZW1wdHlcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB2YWx1ZSA9IG1ha2VTdHJpbmcodmFsdWUpO1xuICAgICAgaWYgKCF2YWx1ZSkge1xuICAgICAgICB0aGlzLmxvZ2dlci53YXJuKCdtaXNzZWQgdG8gcmVzb2x2ZSAnICsgbWF0Y2hbMV0gKyAnIGZvciBuZXN0aW5nICcgKyBzdHIpO1xuICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgfVxuICAgICAgLy8gTmVzdGVkIGtleXMgc2hvdWxkIG5vdCBiZSBlc2NhcGVkIGJ5IGRlZmF1bHQgIzg1NFxuICAgICAgLy8gdmFsdWUgPSB0aGlzLmVzY2FwZVZhbHVlID8gcmVnZXhTYWZlKHV0aWxzLmVzY2FwZSh2YWx1ZSkpIDogcmVnZXhTYWZlKHZhbHVlKTtcbiAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKG1hdGNoWzBdLCB2YWx1ZSk7XG4gICAgICB0aGlzLnJlZ2V4cC5sYXN0SW5kZXggPSAwO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9O1xuXG4gIHJldHVybiBJbnRlcnBvbGF0b3I7XG59KCk7XG5cbmZ1bmN0aW9uIHJlbW92ZShhcnIsIHdoYXQpIHtcbiAgdmFyIGZvdW5kID0gYXJyLmluZGV4T2Yod2hhdCk7XG5cbiAgd2hpbGUgKGZvdW5kICE9PSAtMSkge1xuICAgIGFyci5zcGxpY2UoZm91bmQsIDEpO1xuICAgIGZvdW5kID0gYXJyLmluZGV4T2Yod2hhdCk7XG4gIH1cbn1cblxudmFyIENvbm5lY3RvciA9IGZ1bmN0aW9uIChfRXZlbnRFbWl0dGVyKSB7XG4gIGluaGVyaXRzKENvbm5lY3RvciwgX0V2ZW50RW1pdHRlcik7XG5cbiAgZnVuY3Rpb24gQ29ubmVjdG9yKGJhY2tlbmQsIHN0b3JlLCBzZXJ2aWNlcykge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiB7fTtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBDb25uZWN0b3IpO1xuXG4gICAgdmFyIF90aGlzID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfRXZlbnRFbWl0dGVyLmNhbGwodGhpcykpO1xuXG4gICAgX3RoaXMuYmFja2VuZCA9IGJhY2tlbmQ7XG4gICAgX3RoaXMuc3RvcmUgPSBzdG9yZTtcbiAgICBfdGhpcy5sYW5ndWFnZVV0aWxzID0gc2VydmljZXMubGFuZ3VhZ2VVdGlscztcbiAgICBfdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICBfdGhpcy5sb2dnZXIgPSBiYXNlTG9nZ2VyLmNyZWF0ZSgnYmFja2VuZENvbm5lY3RvcicpO1xuXG4gICAgX3RoaXMuc3RhdGUgPSB7fTtcbiAgICBfdGhpcy5xdWV1ZSA9IFtdO1xuXG4gICAgaWYgKF90aGlzLmJhY2tlbmQgJiYgX3RoaXMuYmFja2VuZC5pbml0KSB7XG4gICAgICBfdGhpcy5iYWNrZW5kLmluaXQoc2VydmljZXMsIG9wdGlvbnMuYmFja2VuZCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIENvbm5lY3Rvci5wcm90b3R5cGUucXVldWVMb2FkID0gZnVuY3Rpb24gcXVldWVMb2FkKGxhbmd1YWdlcywgbmFtZXNwYWNlcywgY2FsbGJhY2spIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIC8vIGZpbmQgd2hhdCBuZWVkcyB0byBiZSBsb2FkZWRcbiAgICB2YXIgdG9Mb2FkID0gW107XG4gICAgdmFyIHBlbmRpbmcgPSBbXTtcbiAgICB2YXIgdG9Mb2FkTGFuZ3VhZ2VzID0gW107XG4gICAgdmFyIHRvTG9hZE5hbWVzcGFjZXMgPSBbXTtcblxuICAgIGxhbmd1YWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChsbmcpIHtcbiAgICAgIHZhciBoYXNBbGxOYW1lc3BhY2VzID0gdHJ1ZTtcblxuICAgICAgbmFtZXNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChucykge1xuICAgICAgICB2YXIgbmFtZSA9IGxuZyArICd8JyArIG5zO1xuXG4gICAgICAgIGlmIChfdGhpczIuc3RvcmUuaGFzUmVzb3VyY2VCdW5kbGUobG5nLCBucykpIHtcbiAgICAgICAgICBfdGhpczIuc3RhdGVbbmFtZV0gPSAyOyAvLyBsb2FkZWRcbiAgICAgICAgfSBlbHNlIGlmIChfdGhpczIuc3RhdGVbbmFtZV0gPCAwKSB7XG4gICAgICAgICAgLy8gbm90aGluZyB0byBkbyBmb3IgZXJyXG4gICAgICAgIH0gZWxzZSBpZiAoX3RoaXMyLnN0YXRlW25hbWVdID09PSAxKSB7XG4gICAgICAgICAgaWYgKHBlbmRpbmcuaW5kZXhPZihuYW1lKSA8IDApIHBlbmRpbmcucHVzaChuYW1lKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpczIuc3RhdGVbbmFtZV0gPSAxOyAvLyBwZW5kaW5nXG5cbiAgICAgICAgICBoYXNBbGxOYW1lc3BhY2VzID0gZmFsc2U7XG5cbiAgICAgICAgICBpZiAocGVuZGluZy5pbmRleE9mKG5hbWUpIDwgMCkgcGVuZGluZy5wdXNoKG5hbWUpO1xuICAgICAgICAgIGlmICh0b0xvYWQuaW5kZXhPZihuYW1lKSA8IDApIHRvTG9hZC5wdXNoKG5hbWUpO1xuICAgICAgICAgIGlmICh0b0xvYWROYW1lc3BhY2VzLmluZGV4T2YobnMpIDwgMCkgdG9Mb2FkTmFtZXNwYWNlcy5wdXNoKG5zKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghaGFzQWxsTmFtZXNwYWNlcykgdG9Mb2FkTGFuZ3VhZ2VzLnB1c2gobG5nKTtcbiAgICB9KTtcblxuICAgIGlmICh0b0xvYWQubGVuZ3RoIHx8IHBlbmRpbmcubGVuZ3RoKSB7XG4gICAgICB0aGlzLnF1ZXVlLnB1c2goe1xuICAgICAgICBwZW5kaW5nOiBwZW5kaW5nLFxuICAgICAgICBsb2FkZWQ6IHt9LFxuICAgICAgICBlcnJvcnM6IFtdLFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2tcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICB0b0xvYWQ6IHRvTG9hZCxcbiAgICAgIHBlbmRpbmc6IHBlbmRpbmcsXG4gICAgICB0b0xvYWRMYW5ndWFnZXM6IHRvTG9hZExhbmd1YWdlcyxcbiAgICAgIHRvTG9hZE5hbWVzcGFjZXM6IHRvTG9hZE5hbWVzcGFjZXNcbiAgICB9O1xuICB9O1xuXG4gIENvbm5lY3Rvci5wcm90b3R5cGUubG9hZGVkID0gZnVuY3Rpb24gbG9hZGVkKG5hbWUsIGVyciwgZGF0YSkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgdmFyIF9uYW1lJHNwbGl0ID0gbmFtZS5zcGxpdCgnfCcpLFxuICAgICAgICBfbmFtZSRzcGxpdDIgPSBzbGljZWRUb0FycmF5KF9uYW1lJHNwbGl0LCAyKSxcbiAgICAgICAgbG5nID0gX25hbWUkc3BsaXQyWzBdLFxuICAgICAgICBucyA9IF9uYW1lJHNwbGl0MlsxXTtcblxuICAgIGlmIChlcnIpIHRoaXMuZW1pdCgnZmFpbGVkTG9hZGluZycsIGxuZywgbnMsIGVycik7XG5cbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5zdG9yZS5hZGRSZXNvdXJjZUJ1bmRsZShsbmcsIG5zLCBkYXRhKTtcbiAgICB9XG5cbiAgICAvLyBzZXQgbG9hZGVkXG4gICAgdGhpcy5zdGF0ZVtuYW1lXSA9IGVyciA/IC0xIDogMjtcblxuICAgIC8vIGNhbGxiYWNrIGlmIHJlYWR5XG4gICAgdGhpcy5xdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uIChxKSB7XG4gICAgICBwdXNoUGF0aChxLmxvYWRlZCwgW2xuZ10sIG5zKTtcbiAgICAgIHJlbW92ZShxLnBlbmRpbmcsIG5hbWUpO1xuXG4gICAgICBpZiAoZXJyKSBxLmVycm9ycy5wdXNoKGVycik7XG5cbiAgICAgIGlmIChxLnBlbmRpbmcubGVuZ3RoID09PSAwICYmICFxLmRvbmUpIHtcbiAgICAgICAgX3RoaXMzLmVtaXQoJ2xvYWRlZCcsIHEubG9hZGVkKTtcbiAgICAgICAgLyogZXNsaW50IG5vLXBhcmFtLXJlYXNzaWduOiAwICovXG4gICAgICAgIHEuZG9uZSA9IHRydWU7XG4gICAgICAgIGlmIChxLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICBxLmNhbGxiYWNrKHEuZXJyb3JzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBxLmNhbGxiYWNrKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIHJlbW92ZSBkb25lIGxvYWQgcmVxdWVzdHNcbiAgICB0aGlzLnF1ZXVlID0gdGhpcy5xdWV1ZS5maWx0ZXIoZnVuY3Rpb24gKHEpIHtcbiAgICAgIHJldHVybiAhcS5kb25lO1xuICAgIH0pO1xuICB9O1xuXG4gIENvbm5lY3Rvci5wcm90b3R5cGUucmVhZCA9IGZ1bmN0aW9uIHJlYWQobG5nLCBucywgZmNOYW1lKSB7XG4gICAgdmFyIHRyaWVkID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiAwO1xuXG4gICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICB2YXIgd2FpdCA9IGFyZ3VtZW50cy5sZW5ndGggPiA0ICYmIGFyZ3VtZW50c1s0XSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzRdIDogMjUwO1xuICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50c1s1XTtcblxuICAgIGlmICghbG5nLmxlbmd0aCkgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHt9KTsgLy8gbm90aW5nIHRvIGxvYWRcblxuICAgIHJldHVybiB0aGlzLmJhY2tlbmRbZmNOYW1lXShsbmcsIG5zLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICBpZiAoZXJyICYmIGRhdGEgLyogPSByZXRyeUZsYWcgKi8gJiYgdHJpZWQgPCA1KSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIF90aGlzNC5yZWFkLmNhbGwoX3RoaXM0LCBsbmcsIG5zLCBmY05hbWUsIHRyaWVkICsgMSwgd2FpdCAqIDIsIGNhbGxiYWNrKTtcbiAgICAgICAgfSwgd2FpdCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrKGVyciwgZGF0YSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLyogZXNsaW50IGNvbnNpc3RlbnQtcmV0dXJuOiAwICovXG5cblxuICBDb25uZWN0b3IucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiBsb2FkKGxhbmd1YWdlcywgbmFtZXNwYWNlcywgY2FsbGJhY2spIHtcbiAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgIGlmICghdGhpcy5iYWNrZW5kKSB7XG4gICAgICB0aGlzLmxvZ2dlci53YXJuKCdObyBiYWNrZW5kIHdhcyBhZGRlZCB2aWEgaTE4bmV4dC51c2UuIFdpbGwgbm90IGxvYWQgcmVzb3VyY2VzLicpO1xuICAgICAgcmV0dXJuIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgfVxuICAgIHZhciBvcHRpb25zID0gX2V4dGVuZHMoe30sIHRoaXMuYmFja2VuZC5vcHRpb25zLCB0aGlzLm9wdGlvbnMuYmFja2VuZCk7XG5cbiAgICBpZiAodHlwZW9mIGxhbmd1YWdlcyA9PT0gJ3N0cmluZycpIGxhbmd1YWdlcyA9IHRoaXMubGFuZ3VhZ2VVdGlscy50b1Jlc29sdmVIaWVyYXJjaHkobGFuZ3VhZ2VzKTtcbiAgICBpZiAodHlwZW9mIG5hbWVzcGFjZXMgPT09ICdzdHJpbmcnKSBuYW1lc3BhY2VzID0gW25hbWVzcGFjZXNdO1xuXG4gICAgdmFyIHRvTG9hZCA9IHRoaXMucXVldWVMb2FkKGxhbmd1YWdlcywgbmFtZXNwYWNlcywgY2FsbGJhY2spO1xuICAgIGlmICghdG9Mb2FkLnRvTG9hZC5sZW5ndGgpIHtcbiAgICAgIGlmICghdG9Mb2FkLnBlbmRpbmcubGVuZ3RoKSBjYWxsYmFjaygpOyAvLyBub3RoaW5nIHRvIGxvYWQgYW5kIG5vIHBlbmRpbmdzLi4uY2FsbGJhY2sgbm93XG4gICAgICByZXR1cm4gbnVsbDsgLy8gcGVuZGluZ3Mgd2lsbCB0cmlnZ2VyIGNhbGxiYWNrXG4gICAgfVxuXG4gICAgLy8gbG9hZCB3aXRoIG11bHRpLWxvYWRcbiAgICBpZiAob3B0aW9ucy5hbGxvd011bHRpTG9hZGluZyAmJiB0aGlzLmJhY2tlbmQucmVhZE11bHRpKSB7XG4gICAgICB0aGlzLnJlYWQodG9Mb2FkLnRvTG9hZExhbmd1YWdlcywgdG9Mb2FkLnRvTG9hZE5hbWVzcGFjZXMsICdyZWFkTXVsdGknLCBudWxsLCBudWxsLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmIChlcnIpIF90aGlzNS5sb2dnZXIud2FybignbG9hZGluZyBuYW1lc3BhY2VzICcgKyB0b0xvYWQudG9Mb2FkTmFtZXNwYWNlcy5qb2luKCcsICcpICsgJyBmb3IgbGFuZ3VhZ2VzICcgKyB0b0xvYWQudG9Mb2FkTGFuZ3VhZ2VzLmpvaW4oJywgJykgKyAnIHZpYSBtdWx0aWxvYWRpbmcgZmFpbGVkJywgZXJyKTtcbiAgICAgICAgaWYgKCFlcnIgJiYgZGF0YSkgX3RoaXM1LmxvZ2dlci5sb2coJ3N1Y2Nlc3NmdWxseSBsb2FkZWQgbmFtZXNwYWNlcyAnICsgdG9Mb2FkLnRvTG9hZE5hbWVzcGFjZXMuam9pbignLCAnKSArICcgZm9yIGxhbmd1YWdlcyAnICsgdG9Mb2FkLnRvTG9hZExhbmd1YWdlcy5qb2luKCcsICcpICsgJyB2aWEgbXVsdGlsb2FkaW5nJywgZGF0YSk7XG5cbiAgICAgICAgdG9Mb2FkLnRvTG9hZC5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgdmFyIF9uYW1lJHNwbGl0MyA9IG5hbWUuc3BsaXQoJ3wnKSxcbiAgICAgICAgICAgICAgX25hbWUkc3BsaXQ0ID0gc2xpY2VkVG9BcnJheShfbmFtZSRzcGxpdDMsIDIpLFxuICAgICAgICAgICAgICBsID0gX25hbWUkc3BsaXQ0WzBdLFxuICAgICAgICAgICAgICBuID0gX25hbWUkc3BsaXQ0WzFdO1xuXG4gICAgICAgICAgdmFyIGJ1bmRsZSA9IGdldFBhdGgoZGF0YSwgW2wsIG5dKTtcbiAgICAgICAgICBpZiAoYnVuZGxlKSB7XG4gICAgICAgICAgICBfdGhpczUubG9hZGVkKG5hbWUsIGVyciwgYnVuZGxlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGVycm9yID0gJ2xvYWRpbmcgbmFtZXNwYWNlICcgKyBuICsgJyBmb3IgbGFuZ3VhZ2UgJyArIGwgKyAnIHZpYSBtdWx0aWxvYWRpbmcgZmFpbGVkJztcbiAgICAgICAgICAgIF90aGlzNS5sb2FkZWQobmFtZSwgZXJyb3IpO1xuICAgICAgICAgICAgX3RoaXM1LmxvZ2dlci5lcnJvcihlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0b0xvYWQudG9Mb2FkLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgX3RoaXM1LmxvYWRPbmUobmFtZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgQ29ubmVjdG9yLnByb3RvdHlwZS5yZWxvYWQgPSBmdW5jdGlvbiByZWxvYWQobGFuZ3VhZ2VzLCBuYW1lc3BhY2VzKSB7XG4gICAgdmFyIF90aGlzNiA9IHRoaXM7XG5cbiAgICBpZiAoIXRoaXMuYmFja2VuZCkge1xuICAgICAgdGhpcy5sb2dnZXIud2FybignTm8gYmFja2VuZCB3YXMgYWRkZWQgdmlhIGkxOG5leHQudXNlLiBXaWxsIG5vdCBsb2FkIHJlc291cmNlcy4nKTtcbiAgICB9XG4gICAgdmFyIG9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgdGhpcy5iYWNrZW5kLm9wdGlvbnMsIHRoaXMub3B0aW9ucy5iYWNrZW5kKTtcblxuICAgIGlmICh0eXBlb2YgbGFuZ3VhZ2VzID09PSAnc3RyaW5nJykgbGFuZ3VhZ2VzID0gdGhpcy5sYW5ndWFnZVV0aWxzLnRvUmVzb2x2ZUhpZXJhcmNoeShsYW5ndWFnZXMpO1xuICAgIGlmICh0eXBlb2YgbmFtZXNwYWNlcyA9PT0gJ3N0cmluZycpIG5hbWVzcGFjZXMgPSBbbmFtZXNwYWNlc107XG5cbiAgICAvLyBsb2FkIHdpdGggbXVsdGktbG9hZFxuICAgIGlmIChvcHRpb25zLmFsbG93TXVsdGlMb2FkaW5nICYmIHRoaXMuYmFja2VuZC5yZWFkTXVsdGkpIHtcbiAgICAgIHRoaXMucmVhZChsYW5ndWFnZXMsIG5hbWVzcGFjZXMsICdyZWFkTXVsdGknLCBudWxsLCBudWxsLCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgIGlmIChlcnIpIF90aGlzNi5sb2dnZXIud2FybigncmVsb2FkaW5nIG5hbWVzcGFjZXMgJyArIG5hbWVzcGFjZXMuam9pbignLCAnKSArICcgZm9yIGxhbmd1YWdlcyAnICsgbGFuZ3VhZ2VzLmpvaW4oJywgJykgKyAnIHZpYSBtdWx0aWxvYWRpbmcgZmFpbGVkJywgZXJyKTtcbiAgICAgICAgaWYgKCFlcnIgJiYgZGF0YSkgX3RoaXM2LmxvZ2dlci5sb2coJ3N1Y2Nlc3NmdWxseSByZWxvYWRlZCBuYW1lc3BhY2VzICcgKyBuYW1lc3BhY2VzLmpvaW4oJywgJykgKyAnIGZvciBsYW5ndWFnZXMgJyArIGxhbmd1YWdlcy5qb2luKCcsICcpICsgJyB2aWEgbXVsdGlsb2FkaW5nJywgZGF0YSk7XG5cbiAgICAgICAgbGFuZ3VhZ2VzLmZvckVhY2goZnVuY3Rpb24gKGwpIHtcbiAgICAgICAgICBuYW1lc3BhY2VzLmZvckVhY2goZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgICAgIHZhciBidW5kbGUgPSBnZXRQYXRoKGRhdGEsIFtsLCBuXSk7XG4gICAgICAgICAgICBpZiAoYnVuZGxlKSB7XG4gICAgICAgICAgICAgIF90aGlzNi5sb2FkZWQobCArICd8JyArIG4sIGVyciwgYnVuZGxlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciBlcnJvciA9ICdyZWxvYWRpbmcgbmFtZXNwYWNlICcgKyBuICsgJyBmb3IgbGFuZ3VhZ2UgJyArIGwgKyAnIHZpYSBtdWx0aWxvYWRpbmcgZmFpbGVkJztcbiAgICAgICAgICAgICAgX3RoaXM2LmxvYWRlZChsICsgJ3wnICsgbiwgZXJyb3IpO1xuICAgICAgICAgICAgICBfdGhpczYubG9nZ2VyLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGFuZ3VhZ2VzLmZvckVhY2goZnVuY3Rpb24gKGwpIHtcbiAgICAgICAgbmFtZXNwYWNlcy5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgICAgX3RoaXM2LmxvYWRPbmUobCArICd8JyArIG4sICdyZScpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBDb25uZWN0b3IucHJvdG90eXBlLmxvYWRPbmUgPSBmdW5jdGlvbiBsb2FkT25lKG5hbWUpIHtcbiAgICB2YXIgX3RoaXM3ID0gdGhpcztcblxuICAgIHZhciBwcmVmaXggPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6ICcnO1xuXG4gICAgdmFyIF9uYW1lJHNwbGl0NSA9IG5hbWUuc3BsaXQoJ3wnKSxcbiAgICAgICAgX25hbWUkc3BsaXQ2ID0gc2xpY2VkVG9BcnJheShfbmFtZSRzcGxpdDUsIDIpLFxuICAgICAgICBsbmcgPSBfbmFtZSRzcGxpdDZbMF0sXG4gICAgICAgIG5zID0gX25hbWUkc3BsaXQ2WzFdO1xuXG4gICAgdGhpcy5yZWFkKGxuZywgbnMsICdyZWFkJywgbnVsbCwgbnVsbCwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgaWYgKGVycikgX3RoaXM3LmxvZ2dlci53YXJuKHByZWZpeCArICdsb2FkaW5nIG5hbWVzcGFjZSAnICsgbnMgKyAnIGZvciBsYW5ndWFnZSAnICsgbG5nICsgJyBmYWlsZWQnLCBlcnIpO1xuICAgICAgaWYgKCFlcnIgJiYgZGF0YSkgX3RoaXM3LmxvZ2dlci5sb2cocHJlZml4ICsgJ2xvYWRlZCBuYW1lc3BhY2UgJyArIG5zICsgJyBmb3IgbGFuZ3VhZ2UgJyArIGxuZywgZGF0YSk7XG5cbiAgICAgIF90aGlzNy5sb2FkZWQobmFtZSwgZXJyLCBkYXRhKTtcbiAgICB9KTtcbiAgfTtcblxuICBDb25uZWN0b3IucHJvdG90eXBlLnNhdmVNaXNzaW5nID0gZnVuY3Rpb24gc2F2ZU1pc3NpbmcobGFuZ3VhZ2VzLCBuYW1lc3BhY2UsIGtleSwgZmFsbGJhY2tWYWx1ZSwgaXNVcGRhdGUpIHtcbiAgICBpZiAodGhpcy5iYWNrZW5kICYmIHRoaXMuYmFja2VuZC5jcmVhdGUpIHRoaXMuYmFja2VuZC5jcmVhdGUobGFuZ3VhZ2VzLCBuYW1lc3BhY2UsIGtleSwgZmFsbGJhY2tWYWx1ZSwgbnVsbCAvKiB1bnVzZWQgY2FsbGJhY2sgKi8sIHsgaXNVcGRhdGU6IGlzVXBkYXRlIH0pO1xuXG4gICAgLy8gd3JpdGUgdG8gc3RvcmUgdG8gYXZvaWQgcmVzZW5kaW5nXG4gICAgaWYgKCFsYW5ndWFnZXMgfHwgIWxhbmd1YWdlc1swXSkgcmV0dXJuO1xuICAgIHRoaXMuc3RvcmUuYWRkUmVzb3VyY2UobGFuZ3VhZ2VzWzBdLCBuYW1lc3BhY2UsIGtleSwgZmFsbGJhY2tWYWx1ZSk7XG4gIH07XG5cbiAgcmV0dXJuIENvbm5lY3Rvcjtcbn0oRXZlbnRFbWl0dGVyKTtcblxudmFyIENvbm5lY3RvciQxID0gZnVuY3Rpb24gKF9FdmVudEVtaXR0ZXIpIHtcbiAgaW5oZXJpdHMoQ29ubmVjdG9yLCBfRXZlbnRFbWl0dGVyKTtcblxuICBmdW5jdGlvbiBDb25uZWN0b3IoY2FjaGUsIHN0b3JlLCBzZXJ2aWNlcykge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgJiYgYXJndW1lbnRzWzNdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbM10gOiB7fTtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBDb25uZWN0b3IpO1xuXG4gICAgdmFyIF90aGlzID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfRXZlbnRFbWl0dGVyLmNhbGwodGhpcykpO1xuXG4gICAgX3RoaXMuY2FjaGUgPSBjYWNoZTtcbiAgICBfdGhpcy5zdG9yZSA9IHN0b3JlO1xuICAgIF90aGlzLnNlcnZpY2VzID0gc2VydmljZXM7XG4gICAgX3RoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgX3RoaXMubG9nZ2VyID0gYmFzZUxvZ2dlci5jcmVhdGUoJ2NhY2hlQ29ubmVjdG9yJyk7XG5cbiAgICBpZiAoX3RoaXMuY2FjaGUgJiYgX3RoaXMuY2FjaGUuaW5pdCkgX3RoaXMuY2FjaGUuaW5pdChzZXJ2aWNlcywgb3B0aW9ucy5jYWNoZSwgb3B0aW9ucyk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgLyogZXNsaW50IGNvbnNpc3RlbnQtcmV0dXJuOiAwICovXG5cblxuICBDb25uZWN0b3IucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiBsb2FkKGxhbmd1YWdlcywgbmFtZXNwYWNlcywgY2FsbGJhY2spIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIGlmICghdGhpcy5jYWNoZSkgcmV0dXJuIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG4gICAgdmFyIG9wdGlvbnMgPSBfZXh0ZW5kcyh7fSwgdGhpcy5jYWNoZS5vcHRpb25zLCB0aGlzLm9wdGlvbnMuY2FjaGUpO1xuXG4gICAgdmFyIGxvYWRMbmdzID0gdHlwZW9mIGxhbmd1YWdlcyA9PT0gJ3N0cmluZycgPyB0aGlzLnNlcnZpY2VzLmxhbmd1YWdlVXRpbHMudG9SZXNvbHZlSGllcmFyY2h5KGxhbmd1YWdlcykgOiBsYW5ndWFnZXM7XG5cbiAgICBpZiAob3B0aW9ucy5lbmFibGVkKSB7XG4gICAgICB0aGlzLmNhY2hlLmxvYWQobG9hZExuZ3MsIGZ1bmN0aW9uIChlcnIsIGRhdGEpIHtcbiAgICAgICAgaWYgKGVycikgX3RoaXMyLmxvZ2dlci5lcnJvcignbG9hZGluZyBsYW5ndWFnZXMgJyArIGxvYWRMbmdzLmpvaW4oJywgJykgKyAnIGZyb20gY2FjaGUgZmFpbGVkJywgZXJyKTtcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAvKiBlc2xpbnQgbm8tcmVzdHJpY3RlZC1zeW50YXg6IDAgKi9cbiAgICAgICAgICBmb3IgKHZhciBsIGluIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZGF0YSwgbCkpIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgbiBpbiBkYXRhW2xdKSB7XG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChkYXRhW2xdLCBuKSkge1xuICAgICAgICAgICAgICAgICAgaWYgKG4gIT09ICdpMThuU3RhbXAnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBidW5kbGUgPSBkYXRhW2xdW25dO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYnVuZGxlKSBfdGhpczIuc3RvcmUuYWRkUmVzb3VyY2VCdW5kbGUobCwgbiwgYnVuZGxlKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2soKTtcbiAgICB9XG4gIH07XG5cbiAgQ29ubmVjdG9yLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24gc2F2ZSgpIHtcbiAgICBpZiAodGhpcy5jYWNoZSAmJiB0aGlzLm9wdGlvbnMuY2FjaGUgJiYgdGhpcy5vcHRpb25zLmNhY2hlLmVuYWJsZWQpIHRoaXMuY2FjaGUuc2F2ZSh0aGlzLnN0b3JlLmRhdGEpO1xuICB9O1xuXG4gIHJldHVybiBDb25uZWN0b3I7XG59KEV2ZW50RW1pdHRlcik7XG5cbmZ1bmN0aW9uIGdldCQxKCkge1xuICByZXR1cm4ge1xuICAgIGRlYnVnOiBmYWxzZSxcbiAgICBpbml0SW1tZWRpYXRlOiB0cnVlLFxuXG4gICAgbnM6IFsndHJhbnNsYXRpb24nXSxcbiAgICBkZWZhdWx0TlM6IFsndHJhbnNsYXRpb24nXSxcbiAgICBmYWxsYmFja0xuZzogWydkZXYnXSxcbiAgICBmYWxsYmFja05TOiBmYWxzZSwgLy8gc3RyaW5nIG9yIGFycmF5IG9mIG5hbWVzcGFjZXNcblxuICAgIHdoaXRlbGlzdDogZmFsc2UsIC8vIGFycmF5IHdpdGggd2hpdGVsaXN0ZWQgbGFuZ3VhZ2VzXG4gICAgbm9uRXhwbGljaXRXaGl0ZWxpc3Q6IGZhbHNlLFxuICAgIGxvYWQ6ICdhbGwnLCAvLyB8IGN1cnJlbnRPbmx5IHwgbGFuZ3VhZ2VPbmx5XG4gICAgcHJlbG9hZDogZmFsc2UsIC8vIGFycmF5IHdpdGggcHJlbG9hZCBsYW5ndWFnZXNcblxuICAgIHNpbXBsaWZ5UGx1cmFsU3VmZml4OiB0cnVlLFxuICAgIGtleVNlcGFyYXRvcjogJy4nLFxuICAgIG5zU2VwYXJhdG9yOiAnOicsXG4gICAgcGx1cmFsU2VwYXJhdG9yOiAnXycsXG4gICAgY29udGV4dFNlcGFyYXRvcjogJ18nLFxuXG4gICAgc2F2ZU1pc3Npbmc6IGZhbHNlLCAvLyBlbmFibGUgdG8gc2VuZCBtaXNzaW5nIHZhbHVlc1xuICAgIHVwZGF0ZU1pc3Npbmc6IGZhbHNlLCAvLyBlbmFibGUgdG8gdXBkYXRlIGRlZmF1bHQgdmFsdWVzIGlmIGRpZmZlcmVudCBmcm9tIHRyYW5zbGF0ZWQgdmFsdWUgKG9ubHkgdXNlZnVsIG9uIGluaXRpYWwgZGV2ZWxvcG1lbnQsIG9yIHdoZW4ga2VlcGluZyBjb2RlIGFzIHNvdXJjZSBvZiB0cnV0aClcbiAgICBzYXZlTWlzc2luZ1RvOiAnZmFsbGJhY2snLCAvLyAnY3VycmVudCcgfHwgJ2FsbCdcbiAgICBzYXZlTWlzc2luZ1BsdXJhbHM6IHRydWUsIC8vIHdpbGwgc2F2ZSBhbGwgZm9ybXMgbm90IG9ubHkgc2luZ3VsYXIga2V5XG4gICAgbWlzc2luZ0tleUhhbmRsZXI6IGZhbHNlLCAvLyBmdW5jdGlvbihsbmcsIG5zLCBrZXksIGZhbGxiYWNrVmFsdWUpIC0+IG92ZXJyaWRlIGlmIHByZWZlciBvbiBoYW5kbGluZ1xuXG4gICAgcG9zdFByb2Nlc3M6IGZhbHNlLCAvLyBzdHJpbmcgb3IgYXJyYXkgb2YgcG9zdFByb2Nlc3NvciBuYW1lc1xuICAgIHJldHVybk51bGw6IHRydWUsIC8vIGFsbG93cyBudWxsIHZhbHVlIGFzIHZhbGlkIHRyYW5zbGF0aW9uXG4gICAgcmV0dXJuRW1wdHlTdHJpbmc6IHRydWUsIC8vIGFsbG93cyBlbXB0eSBzdHJpbmcgdmFsdWUgYXMgdmFsaWQgdHJhbnNsYXRpb25cbiAgICByZXR1cm5PYmplY3RzOiBmYWxzZSxcbiAgICBqb2luQXJyYXlzOiBmYWxzZSwgLy8gb3Igc3RyaW5nIHRvIGpvaW4gYXJyYXlcbiAgICByZXR1cm5lZE9iamVjdEhhbmRsZXI6IGZ1bmN0aW9uIHJldHVybmVkT2JqZWN0SGFuZGxlcigpIHt9LCAvLyBmdW5jdGlvbihrZXksIHZhbHVlLCBvcHRpb25zKSB0cmlnZ2VyZWQgaWYga2V5IHJldHVybnMgb2JqZWN0IGJ1dCByZXR1cm5PYmplY3RzIGlzIHNldCB0byBmYWxzZVxuICAgIHBhcnNlTWlzc2luZ0tleUhhbmRsZXI6IGZhbHNlLCAvLyBmdW5jdGlvbihrZXkpIHBhcnNlZCBhIGtleSB0aGF0IHdhcyBub3QgZm91bmQgaW4gdCgpIGJlZm9yZSByZXR1cm5pbmdcbiAgICBhcHBlbmROYW1lc3BhY2VUb01pc3NpbmdLZXk6IGZhbHNlLFxuICAgIGFwcGVuZE5hbWVzcGFjZVRvQ0lNb2RlOiBmYWxzZSxcbiAgICBvdmVybG9hZFRyYW5zbGF0aW9uT3B0aW9uSGFuZGxlcjogZnVuY3Rpb24gaGFuZGxlKGFyZ3MpIHtcbiAgICAgIHJldHVybiB7IGRlZmF1bHRWYWx1ZTogYXJnc1sxXSB9O1xuICAgIH0sXG5cbiAgICBpbnRlcnBvbGF0aW9uOiB7XG4gICAgICBlc2NhcGVWYWx1ZTogdHJ1ZSxcbiAgICAgIGZvcm1hdDogZnVuY3Rpb24gZm9ybWF0KHZhbHVlLCBfZm9ybWF0LCBsbmcpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSxcbiAgICAgIHByZWZpeDogJ3t7JyxcbiAgICAgIHN1ZmZpeDogJ319JyxcbiAgICAgIGZvcm1hdFNlcGFyYXRvcjogJywnLFxuICAgICAgLy8gcHJlZml4RXNjYXBlZDogJ3t7JyxcbiAgICAgIC8vIHN1ZmZpeEVzY2FwZWQ6ICd9fScsXG4gICAgICAvLyB1bmVzY2FwZVN1ZmZpeDogJycsXG4gICAgICB1bmVzY2FwZVByZWZpeDogJy0nLFxuXG4gICAgICBuZXN0aW5nUHJlZml4OiAnJHQoJyxcbiAgICAgIG5lc3RpbmdTdWZmaXg6ICcpJyxcbiAgICAgIC8vIG5lc3RpbmdQcmVmaXhFc2NhcGVkOiAnJHQoJyxcbiAgICAgIC8vIG5lc3RpbmdTdWZmaXhFc2NhcGVkOiAnKScsXG4gICAgICAvLyBkZWZhdWx0VmFyaWFibGVzOiB1bmRlZmluZWQgLy8gb2JqZWN0IHRoYXQgY2FuIGhhdmUgdmFsdWVzIHRvIGludGVycG9sYXRlIG9uIC0gZXh0ZW5kcyBwYXNzZWQgaW4gaW50ZXJwb2xhdGlvbiBkYXRhXG4gICAgICBtYXhSZXBsYWNlczogMTAwMCAvLyBtYXggcmVwbGFjZXMgdG8gcHJldmVudCBlbmRsZXNzIGxvb3BcbiAgICB9XG4gIH07XG59XG5cbi8qIGVzbGludCBuby1wYXJhbS1yZWFzc2lnbjogMCAqL1xuZnVuY3Rpb24gdHJhbnNmb3JtT3B0aW9ucyhvcHRpb25zKSB7XG4gIC8vIGNyZWF0ZSBuYW1lc3BhY2Ugb2JqZWN0IGlmIG5hbWVzcGFjZSBpcyBwYXNzZWQgaW4gYXMgc3RyaW5nXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5ucyA9PT0gJ3N0cmluZycpIG9wdGlvbnMubnMgPSBbb3B0aW9ucy5uc107XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5mYWxsYmFja0xuZyA9PT0gJ3N0cmluZycpIG9wdGlvbnMuZmFsbGJhY2tMbmcgPSBbb3B0aW9ucy5mYWxsYmFja0xuZ107XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5mYWxsYmFja05TID09PSAnc3RyaW5nJykgb3B0aW9ucy5mYWxsYmFja05TID0gW29wdGlvbnMuZmFsbGJhY2tOU107XG5cbiAgLy8gZXh0ZW5kIHdoaXRlbGlzdCB3aXRoIGNpbW9kZVxuICBpZiAob3B0aW9ucy53aGl0ZWxpc3QgJiYgb3B0aW9ucy53aGl0ZWxpc3QuaW5kZXhPZignY2ltb2RlJykgPCAwKSBvcHRpb25zLndoaXRlbGlzdC5wdXNoKCdjaW1vZGUnKTtcblxuICByZXR1cm4gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnZhciBJMThuID0gZnVuY3Rpb24gKF9FdmVudEVtaXR0ZXIpIHtcbiAgaW5oZXJpdHMoSTE4biwgX0V2ZW50RW1pdHRlcik7XG5cbiAgZnVuY3Rpb24gSTE4bigpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDoge307XG4gICAgdmFyIGNhbGxiYWNrID0gYXJndW1lbnRzWzFdO1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIEkxOG4pO1xuXG4gICAgdmFyIF90aGlzID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfRXZlbnRFbWl0dGVyLmNhbGwodGhpcykpO1xuXG4gICAgX3RoaXMub3B0aW9ucyA9IHRyYW5zZm9ybU9wdGlvbnMob3B0aW9ucyk7XG4gICAgX3RoaXMuc2VydmljZXMgPSB7fTtcbiAgICBfdGhpcy5sb2dnZXIgPSBiYXNlTG9nZ2VyO1xuICAgIF90aGlzLm1vZHVsZXMgPSB7IGV4dGVybmFsOiBbXSB9O1xuXG4gICAgaWYgKGNhbGxiYWNrICYmICFfdGhpcy5pc0luaXRpYWxpemVkICYmICFvcHRpb25zLmlzQ2xvbmUpIHtcbiAgICAgIHZhciBfcmV0O1xuXG4gICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vaTE4bmV4dC9pMThuZXh0L2lzc3Vlcy84NzlcbiAgICAgIGlmICghX3RoaXMub3B0aW9ucy5pbml0SW1tZWRpYXRlKSByZXR1cm4gX3JldCA9IF90aGlzLmluaXQob3B0aW9ucywgY2FsbGJhY2spLCBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKF90aGlzLCBfcmV0KTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5pbml0KG9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICAgIH0sIDApO1xuICAgIH1cbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICBJMThuLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbMV07XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG4gICAgdGhpcy5vcHRpb25zID0gX2V4dGVuZHMoe30sIGdldCQxKCksIHRoaXMub3B0aW9ucywgdHJhbnNmb3JtT3B0aW9ucyhvcHRpb25zKSk7XG5cbiAgICB0aGlzLmZvcm1hdCA9IHRoaXMub3B0aW9ucy5pbnRlcnBvbGF0aW9uLmZvcm1hdDtcbiAgICBpZiAoIWNhbGxiYWNrKSBjYWxsYmFjayA9IG5vb3A7XG5cbiAgICBmdW5jdGlvbiBjcmVhdGVDbGFzc09uRGVtYW5kKENsYXNzT3JPYmplY3QpIHtcbiAgICAgIGlmICghQ2xhc3NPck9iamVjdCkgcmV0dXJuIG51bGw7XG4gICAgICBpZiAodHlwZW9mIENsYXNzT3JPYmplY3QgPT09ICdmdW5jdGlvbicpIHJldHVybiBuZXcgQ2xhc3NPck9iamVjdCgpO1xuICAgICAgcmV0dXJuIENsYXNzT3JPYmplY3Q7XG4gICAgfVxuXG4gICAgLy8gaW5pdCBzZXJ2aWNlc1xuICAgIGlmICghdGhpcy5vcHRpb25zLmlzQ2xvbmUpIHtcbiAgICAgIGlmICh0aGlzLm1vZHVsZXMubG9nZ2VyKSB7XG4gICAgICAgIGJhc2VMb2dnZXIuaW5pdChjcmVhdGVDbGFzc09uRGVtYW5kKHRoaXMubW9kdWxlcy5sb2dnZXIpLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYmFzZUxvZ2dlci5pbml0KG51bGwsIHRoaXMub3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHZhciBsdSA9IG5ldyBMYW5ndWFnZVV0aWwodGhpcy5vcHRpb25zKTtcbiAgICAgIHRoaXMuc3RvcmUgPSBuZXcgUmVzb3VyY2VTdG9yZSh0aGlzLm9wdGlvbnMucmVzb3VyY2VzLCB0aGlzLm9wdGlvbnMpO1xuXG4gICAgICB2YXIgcyA9IHRoaXMuc2VydmljZXM7XG4gICAgICBzLmxvZ2dlciA9IGJhc2VMb2dnZXI7XG4gICAgICBzLnJlc291cmNlU3RvcmUgPSB0aGlzLnN0b3JlO1xuICAgICAgcy5yZXNvdXJjZVN0b3JlLm9uKCdhZGRlZCByZW1vdmVkJywgZnVuY3Rpb24gKGxuZywgbnMpIHtcbiAgICAgICAgcy5jYWNoZUNvbm5lY3Rvci5zYXZlKCk7XG4gICAgICB9KTtcbiAgICAgIHMubGFuZ3VhZ2VVdGlscyA9IGx1O1xuICAgICAgcy5wbHVyYWxSZXNvbHZlciA9IG5ldyBQbHVyYWxSZXNvbHZlcihsdSwgeyBwcmVwZW5kOiB0aGlzLm9wdGlvbnMucGx1cmFsU2VwYXJhdG9yLCBjb21wYXRpYmlsaXR5SlNPTjogdGhpcy5vcHRpb25zLmNvbXBhdGliaWxpdHlKU09OLCBzaW1wbGlmeVBsdXJhbFN1ZmZpeDogdGhpcy5vcHRpb25zLnNpbXBsaWZ5UGx1cmFsU3VmZml4IH0pO1xuICAgICAgcy5pbnRlcnBvbGF0b3IgPSBuZXcgSW50ZXJwb2xhdG9yKHRoaXMub3B0aW9ucyk7XG5cbiAgICAgIHMuYmFja2VuZENvbm5lY3RvciA9IG5ldyBDb25uZWN0b3IoY3JlYXRlQ2xhc3NPbkRlbWFuZCh0aGlzLm1vZHVsZXMuYmFja2VuZCksIHMucmVzb3VyY2VTdG9yZSwgcywgdGhpcy5vcHRpb25zKTtcbiAgICAgIC8vIHBpcGUgZXZlbnRzIGZyb20gYmFja2VuZENvbm5lY3RvclxuICAgICAgcy5iYWNrZW5kQ29ubmVjdG9yLm9uKCcqJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMyLmVtaXQuYXBwbHkoX3RoaXMyLCBbZXZlbnRdLmNvbmNhdChhcmdzKSk7XG4gICAgICB9KTtcblxuICAgICAgcy5iYWNrZW5kQ29ubmVjdG9yLm9uKCdsb2FkZWQnLCBmdW5jdGlvbiAobG9hZGVkKSB7XG4gICAgICAgIHMuY2FjaGVDb25uZWN0b3Iuc2F2ZSgpO1xuICAgICAgfSk7XG5cbiAgICAgIHMuY2FjaGVDb25uZWN0b3IgPSBuZXcgQ29ubmVjdG9yJDEoY3JlYXRlQ2xhc3NPbkRlbWFuZCh0aGlzLm1vZHVsZXMuY2FjaGUpLCBzLnJlc291cmNlU3RvcmUsIHMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAvLyBwaXBlIGV2ZW50cyBmcm9tIGJhY2tlbmRDb25uZWN0b3JcbiAgICAgIHMuY2FjaGVDb25uZWN0b3Iub24oJyonLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbjIgPiAxID8gX2xlbjIgLSAxIDogMCksIF9rZXkyID0gMTsgX2tleTIgPCBfbGVuMjsgX2tleTIrKykge1xuICAgICAgICAgIGFyZ3NbX2tleTIgLSAxXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpczIuZW1pdC5hcHBseShfdGhpczIsIFtldmVudF0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5tb2R1bGVzLmxhbmd1YWdlRGV0ZWN0b3IpIHtcbiAgICAgICAgcy5sYW5ndWFnZURldGVjdG9yID0gY3JlYXRlQ2xhc3NPbkRlbWFuZCh0aGlzLm1vZHVsZXMubGFuZ3VhZ2VEZXRlY3Rvcik7XG4gICAgICAgIHMubGFuZ3VhZ2VEZXRlY3Rvci5pbml0KHMsIHRoaXMub3B0aW9ucy5kZXRlY3Rpb24sIHRoaXMub3B0aW9ucyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudHJhbnNsYXRvciA9IG5ldyBUcmFuc2xhdG9yKHRoaXMuc2VydmljZXMsIHRoaXMub3B0aW9ucyk7XG4gICAgICAvLyBwaXBlIGV2ZW50cyBmcm9tIHRyYW5zbGF0b3JcbiAgICAgIHRoaXMudHJhbnNsYXRvci5vbignKicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuMyA+IDEgPyBfbGVuMyAtIDEgOiAwKSwgX2tleTMgPSAxOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICAgICAgYXJnc1tfa2V5MyAtIDFdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICAgICAgfVxuXG4gICAgICAgIF90aGlzMi5lbWl0LmFwcGx5KF90aGlzMiwgW2V2ZW50XS5jb25jYXQoYXJncykpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMubW9kdWxlcy5leHRlcm5hbC5mb3JFYWNoKGZ1bmN0aW9uIChtKSB7XG4gICAgICAgIGlmIChtLmluaXQpIG0uaW5pdChfdGhpczIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gYXBwZW5kIGFwaVxuICAgIHZhciBzdG9yZUFwaSA9IFsnZ2V0UmVzb3VyY2UnLCAnYWRkUmVzb3VyY2UnLCAnYWRkUmVzb3VyY2VzJywgJ2FkZFJlc291cmNlQnVuZGxlJywgJ3JlbW92ZVJlc291cmNlQnVuZGxlJywgJ2hhc1Jlc291cmNlQnVuZGxlJywgJ2dldFJlc291cmNlQnVuZGxlJ107XG4gICAgc3RvcmVBcGkuZm9yRWFjaChmdW5jdGlvbiAoZmNOYW1lKSB7XG4gICAgICBfdGhpczJbZmNOYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9zdG9yZTtcblxuICAgICAgICByZXR1cm4gKF9zdG9yZSA9IF90aGlzMi5zdG9yZSlbZmNOYW1lXS5hcHBseShfc3RvcmUsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgdmFyIGxvYWQgPSBmdW5jdGlvbiBsb2FkKCkge1xuICAgICAgX3RoaXMyLmNoYW5nZUxhbmd1YWdlKF90aGlzMi5vcHRpb25zLmxuZywgZnVuY3Rpb24gKGVyciwgdCkge1xuICAgICAgICBfdGhpczIuaXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIF90aGlzMi5sb2dnZXIubG9nKCdpbml0aWFsaXplZCcsIF90aGlzMi5vcHRpb25zKTtcbiAgICAgICAgX3RoaXMyLmVtaXQoJ2luaXRpYWxpemVkJywgX3RoaXMyLm9wdGlvbnMpO1xuXG4gICAgICAgIGNhbGxiYWNrKGVyciwgdCk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5yZXNvdXJjZXMgfHwgIXRoaXMub3B0aW9ucy5pbml0SW1tZWRpYXRlKSB7XG4gICAgICBsb2FkKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNldFRpbWVvdXQobG9hZCwgMCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLyogZXNsaW50IGNvbnNpc3RlbnQtcmV0dXJuOiAwICovXG5cblxuICBJMThuLnByb3RvdHlwZS5sb2FkUmVzb3VyY2VzID0gZnVuY3Rpb24gbG9hZFJlc291cmNlcygpIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIGFyZ3VtZW50c1swXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzBdIDogbm9vcDtcblxuICAgIGlmICghdGhpcy5vcHRpb25zLnJlc291cmNlcykge1xuICAgICAgaWYgKHRoaXMubGFuZ3VhZ2UgJiYgdGhpcy5sYW5ndWFnZS50b0xvd2VyQ2FzZSgpID09PSAnY2ltb2RlJykgcmV0dXJuIGNhbGxiYWNrKCk7IC8vIGF2b2lkIGxvYWRpbmcgcmVzb3VyY2VzIGZvciBjaW1vZGVcblxuICAgICAgdmFyIHRvTG9hZCA9IFtdO1xuXG4gICAgICB2YXIgYXBwZW5kID0gZnVuY3Rpb24gYXBwZW5kKGxuZykge1xuICAgICAgICBpZiAoIWxuZykgcmV0dXJuO1xuICAgICAgICB2YXIgbG5ncyA9IF90aGlzMy5zZXJ2aWNlcy5sYW5ndWFnZVV0aWxzLnRvUmVzb2x2ZUhpZXJhcmNoeShsbmcpO1xuICAgICAgICBsbmdzLmZvckVhY2goZnVuY3Rpb24gKGwpIHtcbiAgICAgICAgICBpZiAodG9Mb2FkLmluZGV4T2YobCkgPCAwKSB0b0xvYWQucHVzaChsKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoIXRoaXMubGFuZ3VhZ2UpIHtcbiAgICAgICAgLy8gYXQgbGVhc3QgbG9hZCBmYWxsYmFja3MgaW4gdGhpcyBjYXNlXG4gICAgICAgIHZhciBmYWxsYmFja3MgPSB0aGlzLnNlcnZpY2VzLmxhbmd1YWdlVXRpbHMuZ2V0RmFsbGJhY2tDb2Rlcyh0aGlzLm9wdGlvbnMuZmFsbGJhY2tMbmcpO1xuICAgICAgICBmYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbiAobCkge1xuICAgICAgICAgIHJldHVybiBhcHBlbmQobCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwZW5kKHRoaXMubGFuZ3VhZ2UpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5vcHRpb25zLnByZWxvYWQpIHtcbiAgICAgICAgdGhpcy5vcHRpb25zLnByZWxvYWQuZm9yRWFjaChmdW5jdGlvbiAobCkge1xuICAgICAgICAgIHJldHVybiBhcHBlbmQobCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNlcnZpY2VzLmNhY2hlQ29ubmVjdG9yLmxvYWQodG9Mb2FkLCB0aGlzLm9wdGlvbnMubnMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgX3RoaXMzLnNlcnZpY2VzLmJhY2tlbmRDb25uZWN0b3IubG9hZCh0b0xvYWQsIF90aGlzMy5vcHRpb25zLm5zLCBjYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgfVxuICB9O1xuXG4gIEkxOG4ucHJvdG90eXBlLnJlbG9hZFJlc291cmNlcyA9IGZ1bmN0aW9uIHJlbG9hZFJlc291cmNlcyhsbmdzLCBucykge1xuICAgIGlmICghbG5ncykgbG5ncyA9IHRoaXMubGFuZ3VhZ2VzO1xuICAgIGlmICghbnMpIG5zID0gdGhpcy5vcHRpb25zLm5zO1xuICAgIHRoaXMuc2VydmljZXMuYmFja2VuZENvbm5lY3Rvci5yZWxvYWQobG5ncywgbnMpO1xuICB9O1xuXG4gIEkxOG4ucHJvdG90eXBlLnVzZSA9IGZ1bmN0aW9uIHVzZShtb2R1bGUpIHtcbiAgICBpZiAobW9kdWxlLnR5cGUgPT09ICdiYWNrZW5kJykge1xuICAgICAgdGhpcy5tb2R1bGVzLmJhY2tlbmQgPSBtb2R1bGU7XG4gICAgfVxuXG4gICAgaWYgKG1vZHVsZS50eXBlID09PSAnY2FjaGUnKSB7XG4gICAgICB0aGlzLm1vZHVsZXMuY2FjaGUgPSBtb2R1bGU7XG4gICAgfVxuXG4gICAgaWYgKG1vZHVsZS50eXBlID09PSAnbG9nZ2VyJyB8fCBtb2R1bGUubG9nICYmIG1vZHVsZS53YXJuICYmIG1vZHVsZS5lcnJvcikge1xuICAgICAgdGhpcy5tb2R1bGVzLmxvZ2dlciA9IG1vZHVsZTtcbiAgICB9XG5cbiAgICBpZiAobW9kdWxlLnR5cGUgPT09ICdsYW5ndWFnZURldGVjdG9yJykge1xuICAgICAgdGhpcy5tb2R1bGVzLmxhbmd1YWdlRGV0ZWN0b3IgPSBtb2R1bGU7XG4gICAgfVxuXG4gICAgaWYgKG1vZHVsZS50eXBlID09PSAncG9zdFByb2Nlc3NvcicpIHtcbiAgICAgIHBvc3RQcm9jZXNzb3IuYWRkUG9zdFByb2Nlc3Nvcihtb2R1bGUpO1xuICAgIH1cblxuICAgIGlmIChtb2R1bGUudHlwZSA9PT0gJzNyZFBhcnR5Jykge1xuICAgICAgdGhpcy5tb2R1bGVzLmV4dGVybmFsLnB1c2gobW9kdWxlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBJMThuLnByb3RvdHlwZS5jaGFuZ2VMYW5ndWFnZSA9IGZ1bmN0aW9uIGNoYW5nZUxhbmd1YWdlKGxuZywgY2FsbGJhY2spIHtcbiAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgIHZhciBkb25lID0gZnVuY3Rpb24gZG9uZShlcnIsIGwpIHtcbiAgICAgIF90aGlzNC50cmFuc2xhdG9yLmNoYW5nZUxhbmd1YWdlKGwpO1xuXG4gICAgICBpZiAobCkge1xuICAgICAgICBfdGhpczQuZW1pdCgnbGFuZ3VhZ2VDaGFuZ2VkJywgbCk7XG4gICAgICAgIF90aGlzNC5sb2dnZXIubG9nKCdsYW5ndWFnZUNoYW5nZWQnLCBsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjayhlcnIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzNC50LmFwcGx5KF90aGlzNCwgYXJndW1lbnRzKTtcbiAgICAgIH0pO1xuICAgIH07XG5cbiAgICB2YXIgc2V0TG5nID0gZnVuY3Rpb24gc2V0TG5nKGwpIHtcbiAgICAgIGlmIChsKSB7XG4gICAgICAgIF90aGlzNC5sYW5ndWFnZSA9IGw7XG4gICAgICAgIF90aGlzNC5sYW5ndWFnZXMgPSBfdGhpczQuc2VydmljZXMubGFuZ3VhZ2VVdGlscy50b1Jlc29sdmVIaWVyYXJjaHkobCk7XG4gICAgICAgIGlmICghX3RoaXM0LnRyYW5zbGF0b3IubGFuZ3VhZ2UpIF90aGlzNC50cmFuc2xhdG9yLmNoYW5nZUxhbmd1YWdlKGwpO1xuXG4gICAgICAgIGlmIChfdGhpczQuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3RvcikgX3RoaXM0LnNlcnZpY2VzLmxhbmd1YWdlRGV0ZWN0b3IuY2FjaGVVc2VyTGFuZ3VhZ2UobCk7XG4gICAgICB9XG5cbiAgICAgIF90aGlzNC5sb2FkUmVzb3VyY2VzKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgZG9uZShlcnIsIGwpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmICghbG5nICYmIHRoaXMuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3RvciAmJiAhdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yLmFzeW5jKSB7XG4gICAgICBzZXRMbmcodGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yLmRldGVjdCgpKTtcbiAgICB9IGVsc2UgaWYgKCFsbmcgJiYgdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yICYmIHRoaXMuc2VydmljZXMubGFuZ3VhZ2VEZXRlY3Rvci5hc3luYykge1xuICAgICAgdGhpcy5zZXJ2aWNlcy5sYW5ndWFnZURldGVjdG9yLmRldGVjdChzZXRMbmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZXRMbmcobG5nKTtcbiAgICB9XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUuZ2V0Rml4ZWRUID0gZnVuY3Rpb24gZ2V0Rml4ZWRUKGxuZywgbnMpIHtcbiAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgIHZhciBmaXhlZFQgPSBmdW5jdGlvbiBmaXhlZFQoa2V5LCBvcHRzKSB7XG4gICAgICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIHJlc3QgPSBBcnJheShfbGVuNCA+IDIgPyBfbGVuNCAtIDIgOiAwKSwgX2tleTQgPSAyOyBfa2V5NCA8IF9sZW40OyBfa2V5NCsrKSB7XG4gICAgICAgIHJlc3RbX2tleTQgLSAyXSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gICAgICB9XG5cbiAgICAgIHZhciBvcHRpb25zID0gX2V4dGVuZHMoe30sIG9wdHMpO1xuICAgICAgaWYgKCh0eXBlb2Ygb3B0cyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2Yob3B0cykpICE9PSAnb2JqZWN0Jykge1xuICAgICAgICBvcHRpb25zID0gX3RoaXM1Lm9wdGlvbnMub3ZlcmxvYWRUcmFuc2xhdGlvbk9wdGlvbkhhbmRsZXIoW2tleSwgb3B0c10uY29uY2F0KHJlc3QpKTtcbiAgICAgIH1cblxuICAgICAgb3B0aW9ucy5sbmcgPSBvcHRpb25zLmxuZyB8fCBmaXhlZFQubG5nO1xuICAgICAgb3B0aW9ucy5sbmdzID0gb3B0aW9ucy5sbmdzIHx8IGZpeGVkVC5sbmdzO1xuICAgICAgb3B0aW9ucy5ucyA9IG9wdGlvbnMubnMgfHwgZml4ZWRULm5zO1xuICAgICAgcmV0dXJuIF90aGlzNS50KGtleSwgb3B0aW9ucyk7XG4gICAgfTtcbiAgICBpZiAodHlwZW9mIGxuZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGZpeGVkVC5sbmcgPSBsbmc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpeGVkVC5sbmdzID0gbG5nO1xuICAgIH1cbiAgICBmaXhlZFQubnMgPSBucztcbiAgICByZXR1cm4gZml4ZWRUO1xuICB9O1xuXG4gIEkxOG4ucHJvdG90eXBlLnQgPSBmdW5jdGlvbiB0KCkge1xuICAgIHZhciBfdHJhbnNsYXRvcjtcblxuICAgIHJldHVybiB0aGlzLnRyYW5zbGF0b3IgJiYgKF90cmFuc2xhdG9yID0gdGhpcy50cmFuc2xhdG9yKS50cmFuc2xhdGUuYXBwbHkoX3RyYW5zbGF0b3IsIGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUuZXhpc3RzID0gZnVuY3Rpb24gZXhpc3RzKCkge1xuICAgIHZhciBfdHJhbnNsYXRvcjI7XG5cbiAgICByZXR1cm4gdGhpcy50cmFuc2xhdG9yICYmIChfdHJhbnNsYXRvcjIgPSB0aGlzLnRyYW5zbGF0b3IpLmV4aXN0cy5hcHBseShfdHJhbnNsYXRvcjIsIGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUuc2V0RGVmYXVsdE5hbWVzcGFjZSA9IGZ1bmN0aW9uIHNldERlZmF1bHROYW1lc3BhY2UobnMpIHtcbiAgICB0aGlzLm9wdGlvbnMuZGVmYXVsdE5TID0gbnM7XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUubG9hZE5hbWVzcGFjZXMgPSBmdW5jdGlvbiBsb2FkTmFtZXNwYWNlcyhucywgY2FsbGJhY2spIHtcbiAgICB2YXIgX3RoaXM2ID0gdGhpcztcblxuICAgIGlmICghdGhpcy5vcHRpb25zLm5zKSByZXR1cm4gY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICBpZiAodHlwZW9mIG5zID09PSAnc3RyaW5nJykgbnMgPSBbbnNdO1xuXG4gICAgbnMuZm9yRWFjaChmdW5jdGlvbiAobikge1xuICAgICAgaWYgKF90aGlzNi5vcHRpb25zLm5zLmluZGV4T2YobikgPCAwKSBfdGhpczYub3B0aW9ucy5ucy5wdXNoKG4pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5sb2FkUmVzb3VyY2VzKGNhbGxiYWNrKTtcbiAgfTtcblxuICBJMThuLnByb3RvdHlwZS5sb2FkTGFuZ3VhZ2VzID0gZnVuY3Rpb24gbG9hZExhbmd1YWdlcyhsbmdzLCBjYWxsYmFjaykge1xuICAgIGlmICh0eXBlb2YgbG5ncyA9PT0gJ3N0cmluZycpIGxuZ3MgPSBbbG5nc107XG4gICAgdmFyIHByZWxvYWRlZCA9IHRoaXMub3B0aW9ucy5wcmVsb2FkIHx8IFtdO1xuXG4gICAgdmFyIG5ld0xuZ3MgPSBsbmdzLmZpbHRlcihmdW5jdGlvbiAobG5nKSB7XG4gICAgICByZXR1cm4gcHJlbG9hZGVkLmluZGV4T2YobG5nKSA8IDA7XG4gICAgfSk7XG4gICAgLy8gRXhpdCBlYXJseSBpZiBhbGwgZ2l2ZW4gbGFuZ3VhZ2VzIGFyZSBhbHJlYWR5IHByZWxvYWRlZFxuICAgIGlmICghbmV3TG5ncy5sZW5ndGgpIHJldHVybiBjYWxsYmFjaygpO1xuXG4gICAgdGhpcy5vcHRpb25zLnByZWxvYWQgPSBwcmVsb2FkZWQuY29uY2F0KG5ld0xuZ3MpO1xuICAgIHRoaXMubG9hZFJlc291cmNlcyhjYWxsYmFjayk7XG4gIH07XG5cbiAgSTE4bi5wcm90b3R5cGUuZGlyID0gZnVuY3Rpb24gZGlyKGxuZykge1xuICAgIGlmICghbG5nKSBsbmcgPSB0aGlzLmxhbmd1YWdlcyAmJiB0aGlzLmxhbmd1YWdlcy5sZW5ndGggPiAwID8gdGhpcy5sYW5ndWFnZXNbMF0gOiB0aGlzLmxhbmd1YWdlO1xuICAgIGlmICghbG5nKSByZXR1cm4gJ3J0bCc7XG5cbiAgICB2YXIgcnRsTG5ncyA9IFsnYXInLCAnc2h1JywgJ3NxcicsICdzc2gnLCAneGFhJywgJ3loZCcsICd5dWQnLCAnYWFvJywgJ2FiaCcsICdhYnYnLCAnYWNtJywgJ2FjcScsICdhY3cnLCAnYWN4JywgJ2FjeScsICdhZGYnLCAnYWRzJywgJ2FlYicsICdhZWMnLCAnYWZiJywgJ2FqcCcsICdhcGMnLCAnYXBkJywgJ2FyYicsICdhcnEnLCAnYXJzJywgJ2FyeScsICdhcnonLCAnYXV6JywgJ2F2bCcsICdheWgnLCAnYXlsJywgJ2F5bicsICdheXAnLCAnYmJ6JywgJ3BnYScsICdoZScsICdpdycsICdwcycsICdwYnQnLCAncGJ1JywgJ3BzdCcsICdwcnAnLCAncHJkJywgJ3VyJywgJ3lkZCcsICd5ZHMnLCAneWloJywgJ2ppJywgJ3lpJywgJ2hibycsICdtZW4nLCAneG1uJywgJ2ZhJywgJ2pwcicsICdwZW8nLCAncGVzJywgJ3BycycsICdkdicsICdzYW0nXTtcblxuICAgIHJldHVybiBydGxMbmdzLmluZGV4T2YodGhpcy5zZXJ2aWNlcy5sYW5ndWFnZVV0aWxzLmdldExhbmd1YWdlUGFydEZyb21Db2RlKGxuZykpID49IDAgPyAncnRsJyA6ICdsdHInO1xuICB9O1xuXG4gIC8qIGVzbGludCBjbGFzcy1tZXRob2RzLXVzZS10aGlzOiAwICovXG5cblxuICBJMThuLnByb3RvdHlwZS5jcmVhdGVJbnN0YW5jZSA9IGZ1bmN0aW9uIGNyZWF0ZUluc3RhbmNlKCkge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICB2YXIgY2FsbGJhY2sgPSBhcmd1bWVudHNbMV07XG5cbiAgICByZXR1cm4gbmV3IEkxOG4ob3B0aW9ucywgY2FsbGJhY2spO1xuICB9O1xuXG4gIEkxOG4ucHJvdG90eXBlLmNsb25lSW5zdGFuY2UgPSBmdW5jdGlvbiBjbG9uZUluc3RhbmNlKCkge1xuICAgIHZhciBfdGhpczcgPSB0aGlzO1xuXG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIHZhciBjYWxsYmFjayA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogbm9vcDtcblxuICAgIHZhciBtZXJnZWRPcHRpb25zID0gX2V4dGVuZHMoe30sIHRoaXMub3B0aW9ucywgb3B0aW9ucywgeyBpc0Nsb25lOiB0cnVlIH0pO1xuICAgIHZhciBjbG9uZSA9IG5ldyBJMThuKG1lcmdlZE9wdGlvbnMpO1xuICAgIHZhciBtZW1iZXJzVG9Db3B5ID0gWydzdG9yZScsICdzZXJ2aWNlcycsICdsYW5ndWFnZSddO1xuICAgIG1lbWJlcnNUb0NvcHkuZm9yRWFjaChmdW5jdGlvbiAobSkge1xuICAgICAgY2xvbmVbbV0gPSBfdGhpczdbbV07XG4gICAgfSk7XG4gICAgY2xvbmUudHJhbnNsYXRvciA9IG5ldyBUcmFuc2xhdG9yKGNsb25lLnNlcnZpY2VzLCBjbG9uZS5vcHRpb25zKTtcbiAgICBjbG9uZS50cmFuc2xhdG9yLm9uKCcqJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBmb3IgKHZhciBfbGVuNSA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuNSA+IDEgPyBfbGVuNSAtIDEgOiAwKSwgX2tleTUgPSAxOyBfa2V5NSA8IF9sZW41OyBfa2V5NSsrKSB7XG4gICAgICAgIGFyZ3NbX2tleTUgLSAxXSA9IGFyZ3VtZW50c1tfa2V5NV07XG4gICAgICB9XG5cbiAgICAgIGNsb25lLmVtaXQuYXBwbHkoY2xvbmUsIFtldmVudF0uY29uY2F0KGFyZ3MpKTtcbiAgICB9KTtcbiAgICBjbG9uZS5pbml0KG1lcmdlZE9wdGlvbnMsIGNhbGxiYWNrKTtcbiAgICBjbG9uZS50cmFuc2xhdG9yLm9wdGlvbnMgPSBjbG9uZS5vcHRpb25zOyAvLyBzeW5jIG9wdGlvbnNcblxuICAgIHJldHVybiBjbG9uZTtcbiAgfTtcblxuICByZXR1cm4gSTE4bjtcbn0oRXZlbnRFbWl0dGVyKTtcblxudmFyIGkxOG5leHQgPSBuZXcgSTE4bigpO1xuXG5yZXR1cm4gaTE4bmV4dDtcblxufSkpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZXh0ZXJuYWwvaTE4bmV4dC9zY3JpcHRzL2kxOG5leHQuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuICAoZ2xvYmFsLmkxOG5leHRYSFJCYWNrZW5kID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG52YXIgYXJyID0gW107XG52YXIgZWFjaCA9IGFyci5mb3JFYWNoO1xudmFyIHNsaWNlID0gYXJyLnNsaWNlO1xuXG5mdW5jdGlvbiBkZWZhdWx0cyhvYmopIHtcbiAgZWFjaC5jYWxsKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgIGZvciAodmFyIHByb3AgaW4gc291cmNlKSB7XG4gICAgICAgIGlmIChvYmpbcHJvcF0gPT09IHVuZGVmaW5lZCkgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvYmo7XG59XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTtcblxuZnVuY3Rpb24gYWRkUXVlcnlTdHJpbmcodXJsLCBwYXJhbXMpIHtcbiAgaWYgKHBhcmFtcyAmJiAodHlwZW9mIHBhcmFtcyA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YocGFyYW1zKSkgPT09ICdvYmplY3QnKSB7XG4gICAgdmFyIHF1ZXJ5U3RyaW5nID0gJycsXG4gICAgICAgIGUgPSBlbmNvZGVVUklDb21wb25lbnQ7XG5cbiAgICAvLyBNdXN0IGVuY29kZSBkYXRhXG4gICAgZm9yICh2YXIgcGFyYW1OYW1lIGluIHBhcmFtcykge1xuICAgICAgcXVlcnlTdHJpbmcgKz0gJyYnICsgZShwYXJhbU5hbWUpICsgJz0nICsgZShwYXJhbXNbcGFyYW1OYW1lXSk7XG4gICAgfVxuXG4gICAgaWYgKCFxdWVyeVN0cmluZykge1xuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICB1cmwgPSB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSAhPT0gLTEgPyAnJicgOiAnPycpICsgcXVlcnlTdHJpbmcuc2xpY2UoMSk7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuXG4vLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9YZW9uY3Jvc3MvNzY2MzI3M1xuZnVuY3Rpb24gYWpheCh1cmwsIG9wdGlvbnMsIGNhbGxiYWNrLCBkYXRhLCBjYWNoZSkge1xuXG4gIGlmIChkYXRhICYmICh0eXBlb2YgZGF0YSA9PT0gJ3VuZGVmaW5lZCcgPyAndW5kZWZpbmVkJyA6IF90eXBlb2YoZGF0YSkpID09PSAnb2JqZWN0Jykge1xuICAgIGlmICghY2FjaGUpIHtcbiAgICAgIGRhdGFbJ190J10gPSBuZXcgRGF0ZSgpO1xuICAgIH1cbiAgICAvLyBVUkwgZW5jb2RlZCBmb3JtIGRhdGEgbXVzdCBiZSBpbiBxdWVyeXN0cmluZyBmb3JtYXRcbiAgICBkYXRhID0gYWRkUXVlcnlTdHJpbmcoJycsIGRhdGEpLnNsaWNlKDEpO1xuICB9XG5cbiAgaWYgKG9wdGlvbnMucXVlcnlTdHJpbmdQYXJhbXMpIHtcbiAgICB1cmwgPSBhZGRRdWVyeVN0cmluZyh1cmwsIG9wdGlvbnMucXVlcnlTdHJpbmdQYXJhbXMpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICB2YXIgeDtcbiAgICBpZiAoWE1MSHR0cFJlcXVlc3QpIHtcbiAgICAgIHggPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeCA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNU1hNTDIuWE1MSFRUUC4zLjAnKTtcbiAgICB9XG4gICAgeC5vcGVuKGRhdGEgPyAnUE9TVCcgOiAnR0VUJywgdXJsLCAxKTtcbiAgICBpZiAoIW9wdGlvbnMuY3Jvc3NEb21haW4pIHtcbiAgICAgIHguc2V0UmVxdWVzdEhlYWRlcignWC1SZXF1ZXN0ZWQtV2l0aCcsICdYTUxIdHRwUmVxdWVzdCcpO1xuICAgIH1cbiAgICB4LndpdGhDcmVkZW50aWFscyA9ICEhb3B0aW9ucy53aXRoQ3JlZGVudGlhbHM7XG4gICAgaWYgKGRhdGEpIHtcbiAgICAgIHguc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC10eXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xuICAgIH1cbiAgICBpZiAoeC5vdmVycmlkZU1pbWVUeXBlKSB7XG4gICAgICB4Lm92ZXJyaWRlTWltZVR5cGUoXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgIH1cbiAgICB2YXIgaCA9IG9wdGlvbnMuY3VzdG9tSGVhZGVycztcbiAgICBpZiAoaCkge1xuICAgICAgZm9yICh2YXIgaSBpbiBoKSB7XG4gICAgICAgIHguc2V0UmVxdWVzdEhlYWRlcihpLCBoW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgeC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB4LnJlYWR5U3RhdGUgPiAzICYmIGNhbGxiYWNrICYmIGNhbGxiYWNrKHgucmVzcG9uc2VUZXh0LCB4KTtcbiAgICB9O1xuICAgIHguc2VuZChkYXRhKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUgJiYgY29uc29sZS5sb2coZSk7XG4gIH1cbn1cblxudmFyIF9jcmVhdGVDbGFzcyA9IGZ1bmN0aW9uICgpIHsgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9IHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH07IH0oKTtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gZ2V0RGVmYXVsdHMoKSB7XG4gIHJldHVybiB7XG4gICAgbG9hZFBhdGg6ICcvbG9jYWxlcy97e2xuZ319L3t7bnN9fS5qc29uJyxcbiAgICBhZGRQYXRoOiAnL2xvY2FsZXMvYWRkL3t7bG5nfX0ve3tuc319JyxcbiAgICBhbGxvd011bHRpTG9hZGluZzogZmFsc2UsXG4gICAgcGFyc2U6IEpTT04ucGFyc2UsXG4gICAgY3Jvc3NEb21haW46IGZhbHNlLFxuICAgIGFqYXg6IGFqYXhcbiAgfTtcbn1cblxudmFyIEJhY2tlbmQgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEJhY2tlbmQoc2VydmljZXMpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQmFja2VuZCk7XG5cbiAgICB0aGlzLmluaXQoc2VydmljZXMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy50eXBlID0gJ2JhY2tlbmQnO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEJhY2tlbmQsIFt7XG4gICAga2V5OiAnaW5pdCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGluaXQoc2VydmljZXMpIHtcbiAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgICAgdGhpcy5zZXJ2aWNlcyA9IHNlcnZpY2VzO1xuICAgICAgdGhpcy5vcHRpb25zID0gZGVmYXVsdHMob3B0aW9ucywgdGhpcy5vcHRpb25zIHx8IHt9LCBnZXREZWZhdWx0cygpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdyZWFkTXVsdGknLFxuICAgIHZhbHVlOiBmdW5jdGlvbiByZWFkTXVsdGkobGFuZ3VhZ2VzLCBuYW1lc3BhY2VzLCBjYWxsYmFjaykge1xuICAgICAgdmFyIGxvYWRQYXRoID0gdGhpcy5vcHRpb25zLmxvYWRQYXRoO1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMubG9hZFBhdGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgbG9hZFBhdGggPSB0aGlzLm9wdGlvbnMubG9hZFBhdGgobGFuZ3VhZ2VzLCBuYW1lc3BhY2VzKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHVybCA9IHRoaXMuc2VydmljZXMuaW50ZXJwb2xhdG9yLmludGVycG9sYXRlKGxvYWRQYXRoLCB7IGxuZzogbGFuZ3VhZ2VzLmpvaW4oJysnKSwgbnM6IG5hbWVzcGFjZXMuam9pbignKycpIH0pO1xuXG4gICAgICB0aGlzLmxvYWRVcmwodXJsLCBjYWxsYmFjayk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAncmVhZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHJlYWQobGFuZ3VhZ2UsIG5hbWVzcGFjZSwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBsb2FkUGF0aCA9IHRoaXMub3B0aW9ucy5sb2FkUGF0aDtcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5vcHRpb25zLmxvYWRQYXRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGxvYWRQYXRoID0gdGhpcy5vcHRpb25zLmxvYWRQYXRoKFtsYW5ndWFnZV0sIFtuYW1lc3BhY2VdKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHVybCA9IHRoaXMuc2VydmljZXMuaW50ZXJwb2xhdG9yLmludGVycG9sYXRlKGxvYWRQYXRoLCB7IGxuZzogbGFuZ3VhZ2UsIG5zOiBuYW1lc3BhY2UgfSk7XG5cbiAgICAgIHRoaXMubG9hZFVybCh1cmwsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdsb2FkVXJsJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gbG9hZFVybCh1cmwsIGNhbGxiYWNrKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICB0aGlzLm9wdGlvbnMuYWpheCh1cmwsIHRoaXMub3B0aW9ucywgZnVuY3Rpb24gKGRhdGEsIHhocikge1xuICAgICAgICBpZiAoeGhyLnN0YXR1cyA+PSA1MDAgJiYgeGhyLnN0YXR1cyA8IDYwMCkgcmV0dXJuIGNhbGxiYWNrKCdmYWlsZWQgbG9hZGluZyAnICsgdXJsLCB0cnVlIC8qIHJldHJ5ICovKTtcbiAgICAgICAgaWYgKHhoci5zdGF0dXMgPj0gNDAwICYmIHhoci5zdGF0dXMgPCA1MDApIHJldHVybiBjYWxsYmFjaygnZmFpbGVkIGxvYWRpbmcgJyArIHVybCwgZmFsc2UgLyogbm8gcmV0cnkgKi8pO1xuXG4gICAgICAgIHZhciByZXQgPSB2b2lkIDAsXG4gICAgICAgICAgICBlcnIgPSB2b2lkIDA7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0ID0gX3RoaXMub3B0aW9ucy5wYXJzZShkYXRhLCB1cmwpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZXJyID0gJ2ZhaWxlZCBwYXJzaW5nICcgKyB1cmwgKyAnIHRvIGpzb24nO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnIpIHJldHVybiBjYWxsYmFjayhlcnIsIGZhbHNlKTtcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmV0KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2NyZWF0ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGNyZWF0ZShsYW5ndWFnZXMsIG5hbWVzcGFjZSwga2V5LCBmYWxsYmFja1ZhbHVlKSB7XG4gICAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgICAgaWYgKHR5cGVvZiBsYW5ndWFnZXMgPT09ICdzdHJpbmcnKSBsYW5ndWFnZXMgPSBbbGFuZ3VhZ2VzXTtcblxuICAgICAgdmFyIHBheWxvYWQgPSB7fTtcbiAgICAgIHBheWxvYWRba2V5XSA9IGZhbGxiYWNrVmFsdWUgfHwgJyc7XG5cbiAgICAgIGxhbmd1YWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChsbmcpIHtcbiAgICAgICAgdmFyIHVybCA9IF90aGlzMi5zZXJ2aWNlcy5pbnRlcnBvbGF0b3IuaW50ZXJwb2xhdGUoX3RoaXMyLm9wdGlvbnMuYWRkUGF0aCwgeyBsbmc6IGxuZywgbnM6IG5hbWVzcGFjZSB9KTtcblxuICAgICAgICBfdGhpczIub3B0aW9ucy5hamF4KHVybCwgX3RoaXMyLm9wdGlvbnMsIGZ1bmN0aW9uIChkYXRhLCB4aHIpIHtcbiAgICAgICAgICAvL2NvbnN0IHN0YXR1c0NvZGUgPSB4aHIuc3RhdHVzLnRvU3RyaW5nKCk7XG4gICAgICAgICAgLy8gVE9ETzogaWYgc3RhdHVzQ29kZSA9PT0gNHh4IGRvIGxvZ1xuICAgICAgICB9LCBwYXlsb2FkKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBCYWNrZW5kO1xufSgpO1xuXG5CYWNrZW5kLnR5cGUgPSAnYmFja2VuZCc7XG5cbnJldHVybiBCYWNrZW5kO1xuXG59KSkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9leHRlcm5hbC9pMThuZXh0L3NjcmlwdHMvaTE4bmV4dFhIUkJhY2tlbmQuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcblx0dHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoZmFjdG9yeSkgOlxuXHQoZ2xvYmFsLmkxOG5leHRMb2NhbFN0b3JhZ2VDYWNoZSA9IGZhY3RvcnkoKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxudmFyIGFyciA9IFtdO1xudmFyIGVhY2ggPSBhcnIuZm9yRWFjaDtcbnZhciBzbGljZSA9IGFyci5zbGljZTtcblxuZnVuY3Rpb24gZGVmYXVsdHMob2JqKSB7XG4gIGVhY2guY2FsbChzbGljZS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICBpZiAoc291cmNlKSB7XG4gICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICBpZiAob2JqW3Byb3BdID09PSB1bmRlZmluZWQpIG9ialtwcm9wXSA9IHNvdXJjZVtwcm9wXTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb2JqO1xufVxuXG5cblxuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgaW1tZWRpYXRlKSB7XG4gIHZhciB0aW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBjb250ZXh0ID0gdGhpcyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiBsYXRlcigpIHtcbiAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgaWYgKCFpbW1lZGlhdGUpIGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgfTtcbiAgICB2YXIgY2FsbE5vdyA9IGltbWVkaWF0ZSAmJiAhdGltZW91dDtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgIGlmIChjYWxsTm93KSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICB9O1xufVxuXG52YXIgX2NyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkgeyBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH0gcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfTsgfSgpO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG52YXIgc3RvcmFnZSA9IHtcbiAgc2V0SXRlbTogZnVuY3Rpb24gc2V0SXRlbShrZXksIHZhbHVlKSB7XG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gZi5sb2coJ2ZhaWxlZCB0byBzZXQgdmFsdWUgZm9yIGtleSBcIicgKyBrZXkgKyAnXCIgdG8gbG9jYWxTdG9yYWdlLicpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZ2V0SXRlbTogZnVuY3Rpb24gZ2V0SXRlbShrZXksIHZhbHVlKSB7XG4gICAgaWYgKHdpbmRvdy5sb2NhbFN0b3JhZ2UpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGYubG9nKCdmYWlsZWQgdG8gZ2V0IHZhbHVlIGZvciBrZXkgXCInICsga2V5ICsgJ1wiIGZyb20gbG9jYWxTdG9yYWdlLicpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59O1xuXG5mdW5jdGlvbiBnZXREZWZhdWx0cygpIHtcbiAgcmV0dXJuIHtcbiAgICBlbmFibGVkOiBmYWxzZSxcbiAgICBwcmVmaXg6ICdpMThuZXh0X3Jlc18nLFxuICAgIGV4cGlyYXRpb25UaW1lOiA3ICogMjQgKiA2MCAqIDYwICogMTAwMCxcbiAgICB2ZXJzaW9uczoge31cbiAgfTtcbn1cblxudmFyIENhY2hlID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDYWNoZShzZXJ2aWNlcykge1xuICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcblxuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDYWNoZSk7XG5cbiAgICB0aGlzLmluaXQoc2VydmljZXMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy50eXBlID0gJ2NhY2hlJztcbiAgICB0aGlzLmRlYm91bmNlZFN0b3JlID0gZGVib3VuY2UodGhpcy5zdG9yZSwgMTAwMDApO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENhY2hlLCBbe1xuICAgIGtleTogJ2luaXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KHNlcnZpY2VzKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG5cbiAgICAgIHRoaXMuc2VydmljZXMgPSBzZXJ2aWNlcztcbiAgICAgIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzKG9wdGlvbnMsIHRoaXMub3B0aW9ucyB8fCB7fSwgZ2V0RGVmYXVsdHMoKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnbG9hZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxvYWQobG5ncywgY2FsbGJhY2spIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgIHZhciBzdG9yZSA9IHt9O1xuICAgICAgdmFyIG5vd01TID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgIGlmICghd2luZG93LmxvY2FsU3RvcmFnZSB8fCAhbG5ncy5sZW5ndGgpIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIG51bGwpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdG9kbyA9IGxuZ3MubGVuZ3RoO1xuXG4gICAgICBsbmdzLmZvckVhY2goZnVuY3Rpb24gKGxuZykge1xuICAgICAgICB2YXIgbG9jYWwgPSBzdG9yYWdlLmdldEl0ZW0oX3RoaXMub3B0aW9ucy5wcmVmaXggKyBsbmcpO1xuXG4gICAgICAgIGlmIChsb2NhbCkge1xuICAgICAgICAgIGxvY2FsID0gSlNPTi5wYXJzZShsb2NhbCk7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgIC8vIGV4cGlyYXRpb24gZmllbGQgaXMgbWFuZGF0b3J5LCBhbmQgc2hvdWxkIG5vdCBiZSBleHBpcmVkXG4gICAgICAgICAgbG9jYWwuaTE4blN0YW1wICYmIGxvY2FsLmkxOG5TdGFtcCArIF90aGlzLm9wdGlvbnMuZXhwaXJhdGlvblRpbWUgPiBub3dNUyAmJlxuXG4gICAgICAgICAgLy8gdGhlcmUgc2hvdWxkIGJlIG5vIGxhbmd1YWdlIHZlcnNpb24gc2V0LCBvciBpZiBpdCBpcywgaXQgc2hvdWxkIG1hdGNoIHRoZSBvbmUgaW4gdHJhbnNsYXRpb25cbiAgICAgICAgICBfdGhpcy5vcHRpb25zLnZlcnNpb25zW2xuZ10gPT09IGxvY2FsLmkxOG5WZXJzaW9uKSB7XG4gICAgICAgICAgICBkZWxldGUgbG9jYWwuaTE4blZlcnNpb247XG4gICAgICAgICAgICBzdG9yZVtsbmddID0gbG9jYWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdG9kbyAtPSAxO1xuICAgICAgICBpZiAodG9kbyA9PT0gMCkge1xuICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHN0b3JlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3N0b3JlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RvcmUoc3RvcmVQYXJhbSkge1xuICAgICAgdmFyIHN0b3JlID0gc3RvcmVQYXJhbTtcbiAgICAgIGlmICh3aW5kb3cubG9jYWxTdG9yYWdlKSB7XG4gICAgICAgIGZvciAodmFyIG0gaW4gc3RvcmUpIHtcbiAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgICAgICAgLy8gdGltZXN0YW1wXG4gICAgICAgICAgc3RvcmVbbV0uaTE4blN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAgICAgICAvLyBsYW5ndWFnZSB2ZXJzaW9uIChpZiBzZXQpXG4gICAgICAgICAgaWYgKHRoaXMub3B0aW9ucy52ZXJzaW9uc1ttXSkge1xuICAgICAgICAgICAgc3RvcmVbbV0uaTE4blZlcnNpb24gPSB0aGlzLm9wdGlvbnMudmVyc2lvbnNbbV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gc2F2ZVxuICAgICAgICAgIHN0b3JhZ2Uuc2V0SXRlbSh0aGlzLm9wdGlvbnMucHJlZml4ICsgbSwgSlNPTi5zdHJpbmdpZnkoc3RvcmVbbV0pKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3NhdmUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzYXZlKHN0b3JlKSB7XG4gICAgICB0aGlzLmRlYm91bmNlZFN0b3JlKHN0b3JlKTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ2FjaGU7XG59KCk7XG5cbkNhY2hlLnR5cGUgPSAnY2FjaGUnO1xuXG5yZXR1cm4gQ2FjaGU7XG5cbn0pKSk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2V4dGVybmFsL2kxOG5leHQvc2NyaXB0cy9pMThuZXh0TG9jYWxTdG9yYWdlQ2FjaGUuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gICAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKCdpMThuZXh0U3ByaW50ZlBvc3RQcm9jZXNzb3InLCBmYWN0b3J5KSA6XG4gICAgKGdsb2JhbC5pMThuZXh0U3ByaW50ZlBvc3RQcm9jZXNzb3IgPSBmYWN0b3J5KCkpO1xufSh0aGlzLCBmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBiYWJlbEhlbHBlcnMgPSB7fTtcbiAgICBiYWJlbEhlbHBlcnMudHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iajtcbiAgICB9IDogZnVuY3Rpb24gKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajtcbiAgICB9O1xuICAgIGJhYmVsSGVscGVycztcblxuICAgIHZhciByZSA9IHtcbiAgICAgICAgbm90X3N0cmluZzogL1tec10vLFxuICAgICAgICBudW1iZXI6IC9bZGllZmddLyxcbiAgICAgICAganNvbjogL1tqXS8sXG4gICAgICAgIG5vdF9qc29uOiAvW15qXS8sXG4gICAgICAgIHRleHQ6IC9eW15cXHgyNV0rLyxcbiAgICAgICAgbW9kdWxvOiAvXlxceDI1ezJ9LyxcbiAgICAgICAgcGxhY2Vob2xkZXI6IC9eXFx4MjUoPzooWzEtOV1cXGQqKVxcJHxcXCgoW15cXCldKylcXCkpPyhcXCspPygwfCdbXiRdKT8oLSk/KFxcZCspPyg/OlxcLihcXGQrKSk/KFtiLWdpam9zdXhYXSkvLFxuICAgICAgICBrZXk6IC9eKFthLXpfXVthLXpfXFxkXSopL2ksXG4gICAgICAgIGtleV9hY2Nlc3M6IC9eXFwuKFthLXpfXVthLXpfXFxkXSopL2ksXG4gICAgICAgIGluZGV4X2FjY2VzczogL15cXFsoXFxkKylcXF0vLFxuICAgICAgICBzaWduOiAvXltcXCtcXC1dL1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBzcHJpbnRmKCkge1xuICAgICAgICB2YXIga2V5ID0gYXJndW1lbnRzWzBdLFxuICAgICAgICAgICAgY2FjaGUgPSBzcHJpbnRmLmNhY2hlO1xuICAgICAgICBpZiAoIShjYWNoZVtrZXldICYmIGNhY2hlLmhhc093blByb3BlcnR5KGtleSkpKSB7XG4gICAgICAgICAgICBjYWNoZVtrZXldID0gc3ByaW50Zi5wYXJzZShrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzcHJpbnRmLmZvcm1hdC5jYWxsKG51bGwsIGNhY2hlW2tleV0sIGFyZ3VtZW50cyk7XG4gICAgfVxuXG4gICAgc3ByaW50Zi5mb3JtYXQgPSBmdW5jdGlvbiAocGFyc2VfdHJlZSwgYXJndikge1xuICAgICAgICB2YXIgY3Vyc29yID0gMSxcbiAgICAgICAgICAgIHRyZWVfbGVuZ3RoID0gcGFyc2VfdHJlZS5sZW5ndGgsXG4gICAgICAgICAgICBub2RlX3R5cGUgPSBcIlwiLFxuICAgICAgICAgICAgYXJnLFxuICAgICAgICAgICAgb3V0cHV0ID0gW10sXG4gICAgICAgICAgICBpLFxuICAgICAgICAgICAgayxcbiAgICAgICAgICAgIG1hdGNoLFxuICAgICAgICAgICAgcGFkLFxuICAgICAgICAgICAgcGFkX2NoYXJhY3RlcixcbiAgICAgICAgICAgIHBhZF9sZW5ndGgsXG4gICAgICAgICAgICBpc19wb3NpdGl2ZSA9IHRydWUsXG4gICAgICAgICAgICBzaWduID0gXCJcIjtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHRyZWVfbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIG5vZGVfdHlwZSA9IGdldF90eXBlKHBhcnNlX3RyZWVbaV0pO1xuICAgICAgICAgICAgaWYgKG5vZGVfdHlwZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICAgIG91dHB1dFtvdXRwdXQubGVuZ3RoXSA9IHBhcnNlX3RyZWVbaV07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vZGVfdHlwZSA9PT0gXCJhcnJheVwiKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBwYXJzZV90cmVlW2ldOyAvLyBjb252ZW5pZW5jZSBwdXJwb3NlcyBvbmx5XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGtleXdvcmQgYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3JdO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgbWF0Y2hbMl0ubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYXJnLmhhc093blByb3BlcnR5KG1hdGNoWzJdW2tdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihzcHJpbnRmKFwiW3NwcmludGZdIHByb3BlcnR5ICclcycgZG9lcyBub3QgZXhpc3RcIiwgbWF0Y2hbMl1ba10pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZ1ttYXRjaFsyXVtrXV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1hdGNoWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHBvc2l0aW9uYWwgYXJndW1lbnQgKGV4cGxpY2l0KVxuICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmd2W21hdGNoWzFdXTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBwb3NpdGlvbmFsIGFyZ3VtZW50IChpbXBsaWNpdClcbiAgICAgICAgICAgICAgICAgICAgYXJnID0gYXJndltjdXJzb3IrK107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGdldF90eXBlKGFyZykgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChyZS5ub3Rfc3RyaW5nLnRlc3QobWF0Y2hbOF0pICYmIHJlLm5vdF9qc29uLnRlc3QobWF0Y2hbOF0pICYmIGdldF90eXBlKGFyZykgIT0gXCJudW1iZXJcIiAmJiBpc05hTihhcmcpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3Ioc3ByaW50ZihcIltzcHJpbnRmXSBleHBlY3RpbmcgbnVtYmVyIGJ1dCBmb3VuZCAlc1wiLCBnZXRfdHlwZShhcmcpKSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlLm51bWJlci50ZXN0KG1hdGNoWzhdKSkge1xuICAgICAgICAgICAgICAgICAgICBpc19wb3NpdGl2ZSA9IGFyZyA+PSAwO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHN3aXRjaCAobWF0Y2hbOF0pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImJcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiY1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gU3RyaW5nLmZyb21DaGFyQ29kZShhcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJkXCI6XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJpXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBwYXJzZUludChhcmcsIDEwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwialwiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gSlNPTi5zdHJpbmdpZnkoYXJnLCBudWxsLCBtYXRjaFs2XSA/IHBhcnNlSW50KG1hdGNoWzZdKSA6IDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJlXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBtYXRjaFs3XSA/IGFyZy50b0V4cG9uZW50aWFsKG1hdGNoWzddKSA6IGFyZy50b0V4cG9uZW50aWFsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcImZcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IG1hdGNoWzddID8gcGFyc2VGbG9hdChhcmcpLnRvRml4ZWQobWF0Y2hbN10pIDogcGFyc2VGbG9hdChhcmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJnXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBtYXRjaFs3XSA/IHBhcnNlRmxvYXQoYXJnKS50b1ByZWNpc2lvbihtYXRjaFs3XSkgOiBwYXJzZUZsb2F0KGFyZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIm9cIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZyg4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwic1wiOlxuICAgICAgICAgICAgICAgICAgICAgICAgYXJnID0gKGFyZyA9IFN0cmluZyhhcmcpKSAmJiBtYXRjaFs3XSA/IGFyZy5zdWJzdHJpbmcoMCwgbWF0Y2hbN10pIDogYXJnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgXCJ1XCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmcgPSBhcmcgPj4+IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInhcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygxNik7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcIlhcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocmUuanNvbi50ZXN0KG1hdGNoWzhdKSkge1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRbb3V0cHV0Lmxlbmd0aF0gPSBhcmc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlLm51bWJlci50ZXN0KG1hdGNoWzhdKSAmJiAoIWlzX3Bvc2l0aXZlIHx8IG1hdGNoWzNdKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2lnbiA9IGlzX3Bvc2l0aXZlID8gXCIrXCIgOiBcIi1cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZyA9IGFyZy50b1N0cmluZygpLnJlcGxhY2UocmUuc2lnbiwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWduID0gXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYWRfY2hhcmFjdGVyID0gbWF0Y2hbNF0gPyBtYXRjaFs0XSA9PT0gXCIwXCIgPyBcIjBcIiA6IG1hdGNoWzRdLmNoYXJBdCgxKSA6IFwiIFwiO1xuICAgICAgICAgICAgICAgICAgICBwYWRfbGVuZ3RoID0gbWF0Y2hbNl0gLSAoc2lnbiArIGFyZykubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBwYWQgPSBtYXRjaFs2XSA/IHBhZF9sZW5ndGggPiAwID8gc3RyX3JlcGVhdChwYWRfY2hhcmFjdGVyLCBwYWRfbGVuZ3RoKSA6IFwiXCIgOiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICBvdXRwdXRbb3V0cHV0Lmxlbmd0aF0gPSBtYXRjaFs1XSA/IHNpZ24gKyBhcmcgKyBwYWQgOiBwYWRfY2hhcmFjdGVyID09PSBcIjBcIiA/IHNpZ24gKyBwYWQgKyBhcmcgOiBwYWQgKyBzaWduICsgYXJnO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0cHV0LmpvaW4oXCJcIik7XG4gICAgfTtcblxuICAgIHNwcmludGYuY2FjaGUgPSB7fTtcblxuICAgIHNwcmludGYucGFyc2UgPSBmdW5jdGlvbiAoZm10KSB7XG4gICAgICAgIHZhciBfZm10ID0gZm10LFxuICAgICAgICAgICAgbWF0Y2ggPSBbXSxcbiAgICAgICAgICAgIHBhcnNlX3RyZWUgPSBbXSxcbiAgICAgICAgICAgIGFyZ19uYW1lcyA9IDA7XG4gICAgICAgIHdoaWxlIChfZm10KSB7XG4gICAgICAgICAgICBpZiAoKG1hdGNoID0gcmUudGV4dC5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWVbcGFyc2VfdHJlZS5sZW5ndGhdID0gbWF0Y2hbMF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKChtYXRjaCA9IHJlLm1vZHVsby5leGVjKF9mbXQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHBhcnNlX3RyZWVbcGFyc2VfdHJlZS5sZW5ndGhdID0gXCIlXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKChtYXRjaCA9IHJlLnBsYWNlaG9sZGVyLmV4ZWMoX2ZtdCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoWzJdKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ19uYW1lcyB8PSAxO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZmllbGRfbGlzdCA9IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwbGFjZW1lbnRfZmllbGQgPSBtYXRjaFsyXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkX21hdGNoID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSByZS5rZXkuZXhlYyhyZXBsYWNlbWVudF9maWVsZCkpICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0W2ZpZWxkX2xpc3QubGVuZ3RoXSA9IGZpZWxkX21hdGNoWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKChyZXBsYWNlbWVudF9maWVsZCA9IHJlcGxhY2VtZW50X2ZpZWxkLnN1YnN0cmluZyhmaWVsZF9tYXRjaFswXS5sZW5ndGgpKSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoZmllbGRfbWF0Y2ggPSByZS5rZXlfYWNjZXNzLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0W2ZpZWxkX2xpc3QubGVuZ3RoXSA9IGZpZWxkX21hdGNoWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoKGZpZWxkX21hdGNoID0gcmUuaW5kZXhfYWNjZXNzLmV4ZWMocmVwbGFjZW1lbnRfZmllbGQpKSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmaWVsZF9saXN0W2ZpZWxkX2xpc3QubGVuZ3RoXSA9IGZpZWxkX21hdGNoWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIltzcHJpbnRmXSBmYWlsZWQgdG8gcGFyc2UgbmFtZWQgYXJndW1lbnQga2V5XCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBTeW50YXhFcnJvcihcIltzcHJpbnRmXSBmYWlsZWQgdG8gcGFyc2UgbmFtZWQgYXJndW1lbnQga2V5XCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIG1hdGNoWzJdID0gZmllbGRfbGlzdDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhcmdfbmFtZXMgfD0gMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGFyZ19uYW1lcyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJbc3ByaW50Zl0gbWl4aW5nIHBvc2l0aW9uYWwgYW5kIG5hbWVkIHBsYWNlaG9sZGVycyBpcyBub3QgKHlldCkgc3VwcG9ydGVkXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwYXJzZV90cmVlW3BhcnNlX3RyZWUubGVuZ3RoXSA9IG1hdGNoO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJbc3ByaW50Zl0gdW5leHBlY3RlZCBwbGFjZWhvbGRlclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF9mbXQgPSBfZm10LnN1YnN0cmluZyhtYXRjaFswXS5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJzZV90cmVlO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiB2c3ByaW50ZihmbXQsIGFyZ3YsIF9hcmd2KSB7XG4gICAgICAgIF9hcmd2ID0gKGFyZ3YgfHwgW10pLnNsaWNlKDApO1xuICAgICAgICBfYXJndi5zcGxpY2UoMCwgMCwgZm10KTtcbiAgICAgICAgcmV0dXJuIHNwcmludGYuYXBwbHkobnVsbCwgX2FyZ3YpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGhlbHBlcnNcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBnZXRfdHlwZSh2YXJpYWJsZSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhcmlhYmxlKS5zbGljZSg4LCAtMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzdHJfcmVwZWF0KGlucHV0LCBtdWx0aXBsaWVyKSB7XG4gICAgICAgIHJldHVybiBBcnJheShtdWx0aXBsaWVyICsgMSkuam9pbihpbnB1dCk7XG4gICAgfVxuXG4gICAgdmFyIGluZGV4ID0ge1xuICAgICAgbmFtZTogJ3NwcmludGYnLFxuICAgICAgdHlwZTogJ3Bvc3RQcm9jZXNzb3InLFxuXG4gICAgICBwcm9jZXNzOiBmdW5jdGlvbiBwcm9jZXNzKHZhbHVlLCBrZXksIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKCFvcHRpb25zLnNwcmludGYpIHJldHVybiB2YWx1ZTtcblxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5hcHBseShvcHRpb25zLnNwcmludGYpID09PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgcmV0dXJuIHZzcHJpbnRmKHZhbHVlLCBvcHRpb25zLnNwcmludGYpO1xuICAgICAgICB9IGVsc2UgaWYgKGJhYmVsSGVscGVycy50eXBlb2Yob3B0aW9ucy5zcHJpbnRmKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICByZXR1cm4gc3ByaW50Zih2YWx1ZSwgb3B0aW9ucy5zcHJpbnRmKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBvdmVybG9hZFRyYW5zbGF0aW9uT3B0aW9uSGFuZGxlcjogZnVuY3Rpb24gb3ZlcmxvYWRUcmFuc2xhdGlvbk9wdGlvbkhhbmRsZXIoYXJncykge1xuICAgICAgICB2YXIgdmFsdWVzID0gW107XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFsdWVzLnB1c2goYXJnc1tpXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHBvc3RQcm9jZXNzOiAnc3ByaW50ZicsXG4gICAgICAgICAgc3ByaW50ZjogdmFsdWVzXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBpbmRleDtcblxufSkpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vZXh0ZXJuYWwvaTE4bmV4dC9zY3JpcHRzL2kxOG5leHRTcHJpbnRmUG9zdFByb2Nlc3Nvci5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIoZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuICB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XG4gIChnbG9iYWwuaTE4bmV4dEJyb3dzZXJMYW5ndWFnZURldGVjdG9yID0gZmFjdG9yeSgpKTtcbn0odGhpcywgZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGFyciA9IFtdO1xuICB2YXIgZWFjaCA9IGFyci5mb3JFYWNoO1xuICB2YXIgc2xpY2UgPSBhcnIuc2xpY2U7XG5cbiAgZnVuY3Rpb24gZGVmYXVsdHMob2JqKSB7XG4gICAgZWFjaC5jYWxsKHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IgKHZhciBwcm9wIGluIHNvdXJjZSkge1xuICAgICAgICAgIGlmIChvYmpbcHJvcF0gPT09IHVuZGVmaW5lZCkgb2JqW3Byb3BdID0gc291cmNlW3Byb3BdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIHZhciBjb29raWUgPSB7XG4gICAgY3JlYXRlOiBmdW5jdGlvbiBjcmVhdGUobmFtZSwgdmFsdWUsIG1pbnV0ZXMsIGRvbWFpbikge1xuICAgICAgdmFyIGV4cGlyZXMgPSB2b2lkIDA7XG4gICAgICBpZiAobWludXRlcykge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIG1pbnV0ZXMgKiA2MCAqIDEwMDApO1xuICAgICAgICBleHBpcmVzID0gJzsgZXhwaXJlcz0nICsgZGF0ZS50b0dNVFN0cmluZygpO1xuICAgICAgfSBlbHNlIGV4cGlyZXMgPSAnJztcbiAgICAgIGRvbWFpbiA9IGRvbWFpbiA/ICdkb21haW49JyArIGRvbWFpbiArICc7JyA6ICcnO1xuICAgICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArICc9JyArIHZhbHVlICsgZXhwaXJlcyArICc7JyArIGRvbWFpbiArICdwYXRoPS8nO1xuICAgIH0sXG5cbiAgICByZWFkOiBmdW5jdGlvbiByZWFkKG5hbWUpIHtcbiAgICAgIHZhciBuYW1lRVEgPSBuYW1lICsgJz0nO1xuICAgICAgdmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBjID0gY2FbaV07XG4gICAgICAgIHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSB7XG4gICAgICAgICAgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcbiAgICAgICAgfWlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShuYW1lKSB7XG4gICAgICB0aGlzLmNyZWF0ZShuYW1lLCAnJywgLTEpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgY29va2llJDEgPSB7XG4gICAgbmFtZTogJ2Nvb2tpZScsXG5cbiAgICBsb29rdXA6IGZ1bmN0aW9uIGxvb2t1cChvcHRpb25zKSB7XG4gICAgICB2YXIgZm91bmQgPSB2b2lkIDA7XG5cbiAgICAgIGlmIChvcHRpb25zLmxvb2t1cENvb2tpZSAmJiB0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBjID0gY29va2llLnJlYWQob3B0aW9ucy5sb29rdXBDb29raWUpO1xuICAgICAgICBpZiAoYykgZm91bmQgPSBjO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm91bmQ7XG4gICAgfSxcbiAgICBjYWNoZVVzZXJMYW5ndWFnZTogZnVuY3Rpb24gY2FjaGVVc2VyTGFuZ3VhZ2UobG5nLCBvcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9ucy5sb29rdXBDb29raWUgJiYgdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb29raWUuY3JlYXRlKG9wdGlvbnMubG9va3VwQ29va2llLCBsbmcsIG9wdGlvbnMuY29va2llTWludXRlcywgb3B0aW9ucy5jb29raWVEb21haW4pO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgcXVlcnlzdHJpbmcgPSB7XG4gICAgbmFtZTogJ3F1ZXJ5c3RyaW5nJyxcblxuICAgIGxvb2t1cDogZnVuY3Rpb24gbG9va3VwKG9wdGlvbnMpIHtcbiAgICAgIHZhciBmb3VuZCA9IHZvaWQgMDtcblxuICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhciBxdWVyeSA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpO1xuICAgICAgICB2YXIgcGFyYW1zID0gcXVlcnkuc3BsaXQoJyYnKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJhbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgcG9zID0gcGFyYW1zW2ldLmluZGV4T2YoJz0nKTtcbiAgICAgICAgICBpZiAocG9zID4gMCkge1xuICAgICAgICAgICAgdmFyIGtleSA9IHBhcmFtc1tpXS5zdWJzdHJpbmcoMCwgcG9zKTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09IG9wdGlvbnMubG9va3VwUXVlcnlzdHJpbmcpIHtcbiAgICAgICAgICAgICAgZm91bmQgPSBwYXJhbXNbaV0uc3Vic3RyaW5nKHBvcyArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm91bmQ7XG4gICAgfVxuICB9O1xuXG4gIHZhciBoYXNMb2NhbFN0b3JhZ2VTdXBwb3J0ID0gdm9pZCAwO1xuICB0cnkge1xuICAgIGhhc0xvY2FsU3RvcmFnZVN1cHBvcnQgPSB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UgIT09IG51bGw7XG4gICAgdmFyIHRlc3RLZXkgPSAnaTE4bmV4dC50cmFuc2xhdGUuYm9vJztcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0odGVzdEtleSwgJ2ZvbycpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSh0ZXN0S2V5KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGhhc0xvY2FsU3RvcmFnZVN1cHBvcnQgPSBmYWxzZTtcbiAgfVxuXG4gIHZhciBsb2NhbFN0b3JhZ2UgPSB7XG4gICAgbmFtZTogJ2xvY2FsU3RvcmFnZScsXG5cbiAgICBsb29rdXA6IGZ1bmN0aW9uIGxvb2t1cChvcHRpb25zKSB7XG4gICAgICB2YXIgZm91bmQgPSB2b2lkIDA7XG5cbiAgICAgIGlmIChvcHRpb25zLmxvb2t1cExvY2FsU3RvcmFnZSAmJiBoYXNMb2NhbFN0b3JhZ2VTdXBwb3J0KSB7XG4gICAgICAgIHZhciBsbmcgPSB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0ob3B0aW9ucy5sb29rdXBMb2NhbFN0b3JhZ2UpO1xuICAgICAgICBpZiAobG5nKSBmb3VuZCA9IGxuZztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZvdW5kO1xuICAgIH0sXG4gICAgY2FjaGVVc2VyTGFuZ3VhZ2U6IGZ1bmN0aW9uIGNhY2hlVXNlckxhbmd1YWdlKGxuZywgb3B0aW9ucykge1xuICAgICAgaWYgKG9wdGlvbnMubG9va3VwTG9jYWxTdG9yYWdlICYmIGhhc0xvY2FsU3RvcmFnZVN1cHBvcnQpIHtcbiAgICAgICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKG9wdGlvbnMubG9va3VwTG9jYWxTdG9yYWdlLCBsbmcpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgbmF2aWdhdG9yJDEgPSB7XG4gICAgbmFtZTogJ25hdmlnYXRvcicsXG5cbiAgICBsb29rdXA6IGZ1bmN0aW9uIGxvb2t1cChvcHRpb25zKSB7XG4gICAgICB2YXIgZm91bmQgPSBbXTtcblxuICAgICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGlmIChuYXZpZ2F0b3IubGFuZ3VhZ2VzKSB7XG4gICAgICAgICAgLy8gY2hyb21lIG9ubHk7IG5vdCBhbiBhcnJheSwgc28gY2FuJ3QgdXNlIC5wdXNoLmFwcGx5IGluc3RlYWQgb2YgaXRlcmF0aW5nXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXZpZ2F0b3IubGFuZ3VhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3VuZC5wdXNoKG5hdmlnYXRvci5sYW5ndWFnZXNbaV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAobmF2aWdhdG9yLnVzZXJMYW5ndWFnZSkge1xuICAgICAgICAgIGZvdW5kLnB1c2gobmF2aWdhdG9yLnVzZXJMYW5ndWFnZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5hdmlnYXRvci5sYW5ndWFnZSkge1xuICAgICAgICAgIGZvdW5kLnB1c2gobmF2aWdhdG9yLmxhbmd1YWdlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm91bmQubGVuZ3RoID4gMCA/IGZvdW5kIDogdW5kZWZpbmVkO1xuICAgIH1cbiAgfTtcblxuICB2YXIgaHRtbFRhZyA9IHtcbiAgICBuYW1lOiAnaHRtbFRhZycsXG5cbiAgICBsb29rdXA6IGZ1bmN0aW9uIGxvb2t1cChvcHRpb25zKSB7XG4gICAgICB2YXIgZm91bmQgPSB2b2lkIDA7XG4gICAgICB2YXIgaHRtbFRhZyA9IG9wdGlvbnMuaHRtbFRhZyB8fCAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyA/IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCA6IG51bGwpO1xuXG4gICAgICBpZiAoaHRtbFRhZyAmJiB0eXBlb2YgaHRtbFRhZy5nZXRBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgZm91bmQgPSBodG1sVGFnLmdldEF0dHJpYnV0ZSgnbGFuZycpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZm91bmQ7XG4gICAgfVxuICB9O1xuXG4gIHZhciBfY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfSByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9OyB9KCk7XG5cbiAgZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuICBmdW5jdGlvbiBnZXREZWZhdWx0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3JkZXI6IFsncXVlcnlzdHJpbmcnLCAnY29va2llJywgJ2xvY2FsU3RvcmFnZScsICduYXZpZ2F0b3InLCAnaHRtbFRhZyddLFxuICAgICAgbG9va3VwUXVlcnlzdHJpbmc6ICdsbmcnLFxuICAgICAgbG9va3VwQ29va2llOiAnaTE4bmV4dCcsXG4gICAgICBsb29rdXBMb2NhbFN0b3JhZ2U6ICdpMThuZXh0TG5nJyxcblxuICAgICAgLy8gY2FjaGUgdXNlciBsYW5ndWFnZVxuICAgICAgY2FjaGVzOiBbJ2xvY2FsU3RvcmFnZSddLFxuICAgICAgZXhjbHVkZUNhY2hlRm9yOiBbJ2NpbW9kZSddXG4gICAgICAvL2Nvb2tpZU1pbnV0ZXM6IDEwLFxuICAgICAgLy9jb29raWVEb21haW46ICdteURvbWFpbidcbiAgICB9O1xuICB9XG5cbiAgdmFyIEJyb3dzZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQnJvd3NlcihzZXJ2aWNlcykge1xuICAgICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuXG4gICAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgQnJvd3Nlcik7XG5cbiAgICAgIHRoaXMudHlwZSA9ICdsYW5ndWFnZURldGVjdG9yJztcbiAgICAgIHRoaXMuZGV0ZWN0b3JzID0ge307XG5cbiAgICAgIHRoaXMuaW5pdChzZXJ2aWNlcywgb3B0aW9ucyk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKEJyb3dzZXIsIFt7XG4gICAgICBrZXk6ICdpbml0JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBpbml0KHNlcnZpY2VzKSB7XG4gICAgICAgIHZhciBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgICAgICAgdmFyIGkxOG5PcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiB7fTtcblxuICAgICAgICB0aGlzLnNlcnZpY2VzID0gc2VydmljZXM7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGRlZmF1bHRzKG9wdGlvbnMsIHRoaXMub3B0aW9ucyB8fCB7fSwgZ2V0RGVmYXVsdHMoKSk7XG4gICAgICAgIHRoaXMuaTE4bk9wdGlvbnMgPSBpMThuT3B0aW9ucztcblxuICAgICAgICB0aGlzLmFkZERldGVjdG9yKGNvb2tpZSQxKTtcbiAgICAgICAgdGhpcy5hZGREZXRlY3RvcihxdWVyeXN0cmluZyk7XG4gICAgICAgIHRoaXMuYWRkRGV0ZWN0b3IobG9jYWxTdG9yYWdlKTtcbiAgICAgICAgdGhpcy5hZGREZXRlY3RvcihuYXZpZ2F0b3IkMSk7XG4gICAgICAgIHRoaXMuYWRkRGV0ZWN0b3IoaHRtbFRhZyk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnYWRkRGV0ZWN0b3InLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIGFkZERldGVjdG9yKGRldGVjdG9yKSB7XG4gICAgICAgIHRoaXMuZGV0ZWN0b3JzW2RldGVjdG9yLm5hbWVdID0gZGV0ZWN0b3I7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiAnZGV0ZWN0JyxcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBkZXRlY3QoZGV0ZWN0aW9uT3JkZXIpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICBpZiAoIWRldGVjdGlvbk9yZGVyKSBkZXRlY3Rpb25PcmRlciA9IHRoaXMub3B0aW9ucy5vcmRlcjtcblxuICAgICAgICB2YXIgZGV0ZWN0ZWQgPSBbXTtcbiAgICAgICAgZGV0ZWN0aW9uT3JkZXIuZm9yRWFjaChmdW5jdGlvbiAoZGV0ZWN0b3JOYW1lKSB7XG4gICAgICAgICAgaWYgKF90aGlzLmRldGVjdG9yc1tkZXRlY3Rvck5hbWVdKSB7XG4gICAgICAgICAgICB2YXIgbG9va3VwID0gX3RoaXMuZGV0ZWN0b3JzW2RldGVjdG9yTmFtZV0ubG9va3VwKF90aGlzLm9wdGlvbnMpO1xuICAgICAgICAgICAgaWYgKGxvb2t1cCAmJiB0eXBlb2YgbG9va3VwID09PSAnc3RyaW5nJykgbG9va3VwID0gW2xvb2t1cF07XG4gICAgICAgICAgICBpZiAobG9va3VwKSBkZXRlY3RlZCA9IGRldGVjdGVkLmNvbmNhdChsb29rdXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGZvdW5kID0gdm9pZCAwO1xuICAgICAgICBkZXRlY3RlZC5mb3JFYWNoKGZ1bmN0aW9uIChsbmcpIHtcbiAgICAgICAgICBpZiAoZm91bmQpIHJldHVybjtcbiAgICAgICAgICB2YXIgY2xlYW5lZExuZyA9IF90aGlzLnNlcnZpY2VzLmxhbmd1YWdlVXRpbHMuZm9ybWF0TGFuZ3VhZ2VDb2RlKGxuZyk7XG4gICAgICAgICAgaWYgKF90aGlzLnNlcnZpY2VzLmxhbmd1YWdlVXRpbHMuaXNXaGl0ZWxpc3RlZChjbGVhbmVkTG5nKSkgZm91bmQgPSBjbGVhbmVkTG5nO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZm91bmQgfHwgdGhpcy5pMThuT3B0aW9ucy5mYWxsYmFja0xuZ1swXTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6ICdjYWNoZVVzZXJMYW5ndWFnZScsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gY2FjaGVVc2VyTGFuZ3VhZ2UobG5nLCBjYWNoZXMpIHtcbiAgICAgICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICAgICAgaWYgKCFjYWNoZXMpIGNhY2hlcyA9IHRoaXMub3B0aW9ucy5jYWNoZXM7XG4gICAgICAgIGlmICghY2FjaGVzKSByZXR1cm47XG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZXhjbHVkZUNhY2hlRm9yICYmIHRoaXMub3B0aW9ucy5leGNsdWRlQ2FjaGVGb3IuaW5kZXhPZihsbmcpID4gLTEpIHJldHVybjtcbiAgICAgICAgY2FjaGVzLmZvckVhY2goZnVuY3Rpb24gKGNhY2hlTmFtZSkge1xuICAgICAgICAgIGlmIChfdGhpczIuZGV0ZWN0b3JzW2NhY2hlTmFtZV0pIF90aGlzMi5kZXRlY3RvcnNbY2FjaGVOYW1lXS5jYWNoZVVzZXJMYW5ndWFnZShsbmcsIF90aGlzMi5vcHRpb25zKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEJyb3dzZXI7XG4gIH0oKTtcblxuICBCcm93c2VyLnR5cGUgPSAnbGFuZ3VhZ2VEZXRlY3Rvcic7XG5cbiAgcmV0dXJuIEJyb3dzZXI7XG5cbn0pKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2V4dGVybmFsL2kxOG5leHQvc2NyaXB0cy9pMThuZXh0QnJvd3Nlckxhbmd1YWdlRGV0ZWN0b3IuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl19