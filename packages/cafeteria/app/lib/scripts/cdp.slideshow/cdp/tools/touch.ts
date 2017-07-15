/* tslint:disable:max-line-length quotemark forin one-line typedef */

import * as $ from "jquery";

const TAG = "[CDP.SlideShow.Touch] ";

/**
 * @brief touch event 拡張モジュール
 *        オリジナルは CDP UXTC touch.js モジュール。
 *        http://ghe.am.sony.com/cdp/touch-module
 *
 *        サポートするイベントは以下。jQuery.on() で使用可能。
 *         drag
 *         dragstart
 *         dragend
 *         swipe
 *         tap
 *         doubletap
 *         pinchstart
 *         pinchend
 *         pinchin
 *         pinchout
 *
 *        2014/04/25 時点
 *        ロジックはそのままだが、以下の点から PMO ソースとして扱う。
 *        - event 定義 "swipe" と "tap" が jQM と被る
 *        - 細かいパラメータ調整を行う可能性がある。
 *        PMO が落ち着いたら、CDP に porting するので、自由に編集可能。
 *        変更した場合、"[PMO]" とコメントを入れること推奨。
 */

// cdp.tools は cdp.core に依存しないため、独自にglobal を提供する
const global = Function("return this")();
let _eventPrefix = "cdp";
const _config = global.Config;    // global config object.

if (_config && typeof _config.namespace === "string") {
    _eventPrefix = _config.namespace + "_";
}

/**
 * タッチイベント名を解決する
 *
 * @param plane {String} [in] plane イベント名を指定. ex) "swipe"
 * @return {String} 実際に使用するイベント名
 */
export function touchEvent(plane: string): string {
    return _eventPrefix + plane;
}

//___________________________________________________________________________________________________________________//


// touch.js implementation scope.
export module Touch {// [PMO]
    // Check whether the browser is using MSPointers
    const _isMsPtr = window.navigator.msPointerEnabled;

    // The original events we'll be listening to
    const _origEvents = {
        start: 'touchstart mousedown',
        end: 'touchend mouseup',
        move: 'touchmove mousemove'
    };

    // Our custom events we'll be firing [PMO] add custom event name prefix.
    const _customEvents = {
        drag: _eventPrefix + 'drag',
        dragStart: _eventPrefix + 'dragstart',
        dragEnd: _eventPrefix + 'dragend',
        swipe: _eventPrefix + 'swipe',
        tap: _eventPrefix + 'tap',
        doubleTap: _eventPrefix + 'doubletap',
        pinchStart: _eventPrefix + 'pinchstart',
        pinchEnd: _eventPrefix + 'pinchend',
        pinchIn: _eventPrefix + 'pinchin',
        pinchOut: _eventPrefix + 'pinchout'
    };

    // Redefine our original events if the browser uses MSPointers [PMO] add mouse events.
    if (_isMsPtr) {
        _origEvents.start = 'MSPointerDown mousedown';
        _origEvents.end = 'MSPointerUp mouseup';
        _origEvents.move = 'MSPointerMove mousemove';
    }

    /**
     * [PMO]
     * Bind original events to target element to use touch object.
     * @param  {JQuery} element [in]
     *       This dom element receives origEvents
     *       and then sends customEvents to handlers which are bind by Touch module user.
     *
     * (注意) elementをwindowとした場合、windowの"touchstart"と"touchmove"に対して
     *        preventDefaultが呼ばれるため、他のタグのブラウザ機能も無効となる。
     */
    export function setTarget(element: JQuery): void {
        for (let evt in _customEvents) {
            // If we are in IE
            if (!evt) {
                evt = <any>window.event;
            }
            _bindToElement(_customEvents[evt], element);
        }
    }

    /**
     * [PMO]
     * Unbind original events from target element.
     * @param  {JQuery} element [in]
     *       This dom element receives origEvents
     *       and then sends customEvents to handlers which are bind by Touch module user.
     */
    export function removeTarget(element: JQuery): void {
        for (let evt in _origEvents) {
            // If we are in IE  // TODO: This part should be checked wheter correct or not.
            if (!evt) {
                evt = <any>window.event;
            }
            _unbindFromElement(_origEvents[evt], element);
        }
    }

    // [PMO]
    export function _bindToElement(customEvent, element) {
        _on(customEvent, element, function (e) {
            const args = [customEvent, Array.prototype.slice.call(arguments)];
            args[1].shift();
            $.prototype.trigger.apply($(e.target), args);
        });
    }

    // [PMO]
    function _unbindFromElement(customEvent, element) {
        // TODO: handler名を指定して、削除すべきかも
        $(element).unbind(customEvent);
    }


    //function _init() {
    //    for (let evt in _customEvents) {
    //        // If we are in IE
    //        if (!evt) {
    //            evt = <any>window.event;
    //        }

    //        _bindToWindow(_customEvents[evt]);
    //    }
    //}

    //function _bindToWindow(customEvent) {
    //    _on(customEvent, $(window), function (e) {
    //        const args = [customEvent, Array.prototype.slice.call(arguments)];
    //        args[1].shift();
    //        $.prototype.trigger.apply($(e.target), args);
    //    });
    //}

    function _on(event, element, callback) {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        let startPinchX1 = 0;
        let startPinchX2 = 0;
        let startPinchY1 = 0;
        let startPinchY2 = 0;

        let tapCount = 0;
        const tapWait = 200;
        const doubleTapWait = 300;
        const tapAllowedOffset = 5;

        let isTouching = false;
        let isPinching = false;
        let isTapWaiting = false;
        let isWaitingDoubleTap = false;

        const updateStartPinchCoordinates = function (e) {
            startPinchX1 = e.originalEvent.touches[0].pageX;
            startPinchX2 = e.originalEvent.touches[1].pageX;
            startPinchY1 = e.originalEvent.touches[0].pageY;
            startPinchY2 = e.originalEvent.touches[1].pageY;
        };

        const getSwipeInfo = function (coordinates) {
            let swipeValue: any = false;    // [PMO] add annotation for typescript.
            let swipeOffset = 0;

            if (coordinates.offsetY < coordinates.offsetX) {
                swipeOffset = coordinates.offsetX;
                if (coordinates.startX > coordinates.endX) {
                    swipeValue = 'swipeleft';
                } else if (coordinates.startX < coordinates.endX) {
                    swipeValue = 'swiperight';
                }
            } else {
                swipeOffset = coordinates.offsetY;
                if (coordinates.startY > coordinates.endY) {
                    swipeValue = 'swipeup';
                } else if (coordinates.startY < coordinates.endY) {
                    swipeValue = 'swipedown';
                }
            }

            return {
                swipeValue: swipeValue,
                swipeOffset: swipeOffset
            };
        };

        _bindEvent({
            genericEvent: _origEvents.end,
            customEvent: event,
            element: element,
            handler: function (e) {
                // Detect pinchend
                if (e.originalEvent.touches && e.originalEvent.touches.length !== 2) {
                    if (isPinching && event === _customEvents.pinchEnd) {
                        callback(e);
                    }
                    isPinching = false;
                }

                // Detect swipe, dragend, doubletap, tap
                if ((e.originalEvent.touches && e.originalEvent.touches.length === 0) || !e.originalEvent.touches) {
                    endX = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.originalEvent.pageX;
                    endY = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageY : e.originalEvent.pageY;
                    isTouching = false;

                    // Distance between when a pointer started touching the screen and end touching
                    const newOffsetX = Math.abs(endX - startX);
                    const newOffsetY = Math.abs(endY - startY);

                    const swipeInfo = getSwipeInfo({
                        offsetX: newOffsetX,
                        offsetY: newOffsetY,
                        startX: startX,
                        startY: startY,
                        endX: endX,
                        endY: endY
                    });

                    // Detect swipe
                    if (swipeInfo.swipeValue && event === _customEvents.swipe) {
                        callback(e, swipeInfo.swipeValue, Math.abs(swipeInfo.swipeOffset));
                    }
                    // Detect dragend
                    else if (event === _customEvents.dragEnd) {
                        callback(e, endX, endY, newOffsetX, newOffsetY);
                        // Detect doubletap
                    } else if (tapCount === 2 && isWaitingDoubleTap && event === _customEvents.doubleTap) {
                        isWaitingDoubleTap = false;
                        tapCount = 0;
                        callback(e, endX, endY);
                        // Detect tap
                    } else if (isTapWaiting && event === _customEvents.tap && Math.abs(newOffsetX) <= tapAllowedOffset &&
                        Math.abs(newOffsetY) <= tapAllowedOffset && e.button !== 1 && e.button !== 2) {
                        isTapWaiting = false;
                        callback(e, endX, endY);
                    }
                }
            }
        });

        _bindEvent({
            genericEvent: _origEvents.move,
            customEvent: event,
            element: element,
            handler: function (e) {
                e.preventDefault();  // [PMO] In kitkat device, "touchend" event is not comming if preventDefault is not called in handlers for "touchstart" and "touchmove"
                if (isTouching) {
                    const touchX = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageX : e.originalEvent.pageX;
                    const touchY = e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0].pageY : e.originalEvent.pageY;

                    // Detect drag
                    if (event === _customEvents.drag) {
                        if ((e.originalEvent.changedTouches && e.originalEvent.changedTouches.length === 1) && (e.originalEvent.touches && e.originalEvent.touches.length === 1) || !e.originalEvent.changedTouches) {
                            callback(e, touchX, touchY, touchX - startX, touchY - startY);
                        }
                    }
                }

                // Detect pinch
                if (e.originalEvent.touches && isPinching && (event === _customEvents.pinchIn || event === _customEvents.pinchOut) && e.originalEvent.touches.length === 2) {
                    const endPinchX1 = e.originalEvent.touches[0].pageX;
                    const endPinchX2 = e.originalEvent.touches[1].pageX;
                    const endPinchY1 = e.originalEvent.touches[0].pageY;
                    const endPinchY2 = e.originalEvent.touches[1].pageY;

                    // Get drag distance for each touch using pythagorean theorem
                    const touchADistance = Math.round(Math.sqrt(((endPinchX1 - startPinchX1) * (endPinchX1 - startPinchX1)) + ((endPinchY1 - startPinchY1) * (endPinchY1 - startPinchY1))));
                    const touchBDistance = Math.round(Math.sqrt(((endPinchX2 - startPinchX2) * (endPinchX2 - startPinchX2)) + ((endPinchY2 - startPinchY2) * (endPinchY2 - startPinchY2))));

                    // Get finger distance for start and end using pythagorean theorem
                    const startDistance = Math.round(Math.sqrt(((startPinchX2 - startPinchX1) * (startPinchX2 - startPinchX1)) + ((startPinchY2 - startPinchY1) * (startPinchY2 - startPinchY1))));
                    const endDistance = Math.round(Math.sqrt(((endPinchX2 - endPinchX1) * (endPinchX2 - endPinchX1)) + ((endPinchY2 - endPinchY1) * (endPinchY2 - endPinchY1))));

                    // Determine type of pinch
                    const dragDistance = touchADistance > touchBDistance ? touchADistance : touchBDistance;
                    let pinchType: any = startDistance > endDistance ? _customEvents.pinchIn : _customEvents.pinchOut;

                    if (startDistance === endDistance) {
                        pinchType = false;
                    }

                    if (pinchType && pinchType === _customEvents.pinchOut && event === _customEvents.pinchOut) {
                        callback(e, dragDistance);
                    } else if (pinchType && pinchType === _customEvents.pinchIn && event === _customEvents.pinchIn) {
                        callback(e, dragDistance);
                    }
                }
            }
        });

        _bindEvent({
            genericEvent: _origEvents.start,
            customEvent: event,
            element: element,
            handler: function (e) {
                //                        e.preventDefault(); // [PMO] In kitkat device, "touchend" event is not comming if preventDefault is not called in handlers for "touchstart" and "touchmove"
                if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length !== 2) {
                    // Detect pinchend
                    if (isPinching && event === _customEvents.pinchEnd) {
                        callback(e);
                    }
                    isPinching = false;
                }

                if (e.originalEvent && e.originalEvent.touches && e.originalEvent.touches.length === 2) {
                    isPinching = true;

                    // Detect pinchstart
                    if (event === _customEvents.pinchStart) {
                        callback(e);
                    }

                    updateStartPinchCoordinates(e);

                } else if (e.originalEvent) {
                    startX = e.originalEvent.touches ? e.originalEvent.touches[0].pageX : e.originalEvent.pageX;
                    startY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.originalEvent.pageY;

                    isTouching = true;

                    // Detect dragstart
                    if ((e.originalEvent.touches && event === _customEvents.dragStart && (e.originalEvent.touches.length === 1)) || event === _customEvents.dragStart && !e.originalEvent.touches) {
                        callback(e, startX, startY);
                        // Set start flags for doubletap
                    } else if ((e.originalEvent.touches && event === _customEvents.doubleTap && (e.originalEvent.touches.length === 1)) || event === _customEvents.doubleTap && !e.originalEvent.touches) {
                        if (!isWaitingDoubleTap) {
                            setTimeout(function () {
                                isWaitingDoubleTap = false;
                                tapCount = 0;
                            }, doubleTapWait);
                        }
                        isWaitingDoubleTap = true;
                        tapCount++;
                        // Set start flags for tap
                    } else if ((e.originalEvent.touches && event === _customEvents.tap && (e.originalEvent.touches.length === 1)) || event === _customEvents.tap && !e.originalEvent.touches) {
                        if (!isTapWaiting) {
                            setTimeout(function () {
                                isTapWaiting = false;
                            }, tapWait);
                        }
                        isTapWaiting = true;
                    }
                } else {
                    callback(e);
                }
            }
        });
    }

    function _bindEvent(config) {
        const genericEvent = config.genericEvent;
        const customEvent = config.customEvent;
        const element = config.element;
        const handler = config.handler;

        const events = element.events || {};
        if (!events[customEvent]) { events[customEvent] = []; }
        events[customEvent].push({
            handler: handler,
            genericEvent: genericEvent
        });
        element.events = events;

        $(element).bind(genericEvent, handler);
    }
}
