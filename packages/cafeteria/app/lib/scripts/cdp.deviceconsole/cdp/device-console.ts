import * as Backbone from "backbone";
import { Config } from "cdp";
import { Platform } from "cdp/framework";

const CSS_PREFIXES = ["-webkit-", ""];
const DOUBLE_TAP_POSITION_ALLOWANCE = 200;

/**
 * @class DeviceConsole
 * @brief 拡張コンソール出力 UI を作成, 管理するクラス
 */
export default class DeviceConsole implements Console {
    private static s_console: Console = null;
    private static s_instance: DeviceConsole = null;
    private static s_$display: JQuery = null;
    private static s_line: number = 1024;
    private static s_gestureStart: { translateY?: number; } = {};

    /**
     * 拡張コンソール出力を有効にする
     *
     * @param {String} selector [in] jQuery に指定可能なセレクタ
     */
    static show(selector: string = "cdp-device-console"): void {
        if (!DeviceConsole.visible()) {
            DeviceConsole.hide();

            if (!DeviceConsole.s_console) {
                DeviceConsole.s_console = window.console;
            }
            if (!DeviceConsole.s_instance) {
                DeviceConsole.s_instance = new DeviceConsole();
            }

            (<any>window).console = DeviceConsole.s_instance;

            if (!DeviceConsole.s_$display) {
                DeviceConsole.s_$display = $(
                    "<div id='" + selector + "'>" +
                    "<div class='screen'></div>" +
                    "<div class='clear'></div>" +
                    "<div class='close'></div>" +
                    "</div>"
                );
                DeviceConsole.s_$display.appendTo($(document.body));
                DeviceConsole.s_$display.find(".clear")
                    .on("vclick", () => {
                        if (DeviceConsole.visible()) {
                            DeviceConsole.clearMessage();
                        }
                    });
                DeviceConsole.s_$display.find(".close")
                    .on("vclick", () => {
                        if (DeviceConsole.visible()) {
                            DeviceConsole.hide();
                        }
                    });
                $(document).on("pagebeforeshow", () => {
                    if (DeviceConsole.visible()) {
                        DeviceConsole.s_$display.appendTo($(document.body));
                        DeviceConsole.s_$display.scrollTop(DeviceConsole.s_$display[0].scrollHeight);
                    }
                });
                DeviceConsole.bindGesture();
            } else {
                DeviceConsole.s_$display.css("visibility", "visible");
            }

            DeviceConsole.trigger("state-changed:show");
        }
    }

    /**
     * 拡張コンソール出力を無効にし、既定の振る舞いに戻す。
     *
     */
    static hide(): void {
        if (DeviceConsole.visible()) {
            if (DeviceConsole.s_console) {
                (<any>window).console = DeviceConsole.s_console;
            }
            if (DeviceConsole.s_$display) {
                DeviceConsole.s_$display.css("visibility", "hidden");
                DeviceConsole.clearMessage();
            }
            DeviceConsole.s_instance = null;
            DeviceConsole.trigger("state-changed:hide");
        }
    }

    /**
     * 拡張コンソール出力の有効/無効切り替え
     *
     * @param {String} selector [in] jQuery に指定可能なセレクタ
     */
    static toggle(selector: string = "pmo-device-console"): void {
        if (DeviceConsole.visible()) {
            DeviceConsole.hide();
        } else {
            DeviceConsole.show(selector);
        }
    }

    /**
     * 拡張コンソール出力を無効にし、完全にオブジェクトを破棄する。
     *
     * remove を呼ぶと、jquery.mobile のイベントを受けられなくなるかも。
     */
    static destroy(): void {
        DeviceConsole.hide();
        if (DeviceConsole.s_$display) {
            DeviceConsole.s_$display.data("hammer").destroy();
            DeviceConsole.s_$display.data("hammer", null).remove();
            DeviceConsole.s_$display = null;
        }
    }

    /**
     * 拡張コンソール出力の有効・無効判定
     *
     * @return {Boolean} true: 有効 / false: 無効
     */
    static visible(): boolean {
        return null != DeviceConsole.s_instance;
    }

    /**
     * 行数を指定する
     *
     * @param {Number} lines [in] 行数
     */
    static setLineNumber(line: number): void {
        DeviceConsole.s_line = line;
    }

    // 出力
    static output(message: string, kind?: string): void {
        // [iOS] DOM 操作による preventDefault を避けるための setTimeout 処理
        setTimeout(() => {
            if (DeviceConsole.s_$display) {
                const $screen = DeviceConsole.s_$display.find(".screen");
                if (DeviceConsole.s_line <= $screen.children().length) {
                    $screen.children().first().remove();
                }
                const tag = (null != kind) ? "<p class='" + kind + "'>" : "<p>";
                $screen.append(tag + message + "</p>");
                setTimeout(() => {
                    $screen.scrollTop($screen[0].scrollHeight);
                }, 1);
            }
        }, 1);
    }

    // message の破棄
    static clearMessage(): void {
        if (DeviceConsole.s_$display) {
            DeviceConsole.s_$display.find("p").remove();
        }
    }

    //___________________________________________________________________________________________________________________//

    get memory(): any {
        if (DeviceConsole.s_console) {
            return DeviceConsole.s_console;
        }
    }

    count(countTitle?: string): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.count(countTitle);
        }
    }

    groupEnd(): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.groupEnd();
        }
    }

    time(timerName?: string): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.time(timerName);
        }
    }

    timeEnd(timerName?: string): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.timeEnd(timerName);
        }
    }

    timeStamp(label?: string): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.timeStamp(label);
        }
    }

    timeline(label?: string): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.timeline(label);
        }
    }

    timelineEnd(label?: string): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.timelineEnd(label);
        }
    }

    trace(): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.trace();
        }
    }

    group(groupTitle?: string): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.group(groupTitle);
        }
    }

    dirxml(value: any): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.dirxml(value);
        }
    }

    debug(message?: string, ...optionalParams: any[]): void {
        if (DeviceConsole.s_console) {
            if (0 < optionalParams.length) {
                DeviceConsole.s_console.debug(message, optionalParams);
            } else {
                DeviceConsole.s_console.debug(message);
            }
        }
        DeviceConsole.output("[debug]" + message, "debug");
    }

    groupCollapsed(groupTitle?: string): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.groupCollapsed(groupTitle);
        }
    }

    select(element: Element): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.select(element);
        }
    }

    info(message?: any, ...optionalParams: any[]): void {
        if (DeviceConsole.s_console) {
            if (0 < optionalParams.length) {
                DeviceConsole.s_console.info(message, optionalParams);
            } else {
                DeviceConsole.s_console.info(message);
            }
        }
        DeviceConsole.output("[info]" + message, "info");
    }

    profile(reportName?: string): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.profile(reportName);
        }
    }

    assert(test?: boolean, message?: string, ...optionalParams: any[]): void {
        if (DeviceConsole.s_console) {
            if (0 < optionalParams.length) {
                DeviceConsole.s_console.assert(test, message, optionalParams);
            } else {
                DeviceConsole.s_console.assert(test, message);
            }
        }
        DeviceConsole.output("[assert]" + message, "assert");
    }

    msIsIndependentlyComposed(element: Element): boolean {
        if (DeviceConsole.s_console) {
            return DeviceConsole.s_console.msIsIndependentlyComposed(element);
        }
        return false;
    }

    clear(): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.clear();
        }
    }

    dir(value?: any, ...optionalParams: any[]): void {
        if (DeviceConsole.s_console) {
            if (0 < optionalParams.length) {
                DeviceConsole.s_console.dir(value, optionalParams);
            } else {
                DeviceConsole.s_console.dir(value);
            }
        }
    }

    warn(message?: any, ...optionalParams: any[]): void {
        if (DeviceConsole.s_console) {
            if (0 < optionalParams.length) {
                DeviceConsole.s_console.warn(message, optionalParams);
            } else {
                DeviceConsole.s_console.warn(message);
            }
        }
        DeviceConsole.output("[warn]" + message, "warn");
    }

    error(message?: any, ...optionalParams: any[]): void {
        if (DeviceConsole.s_console) {
            if (0 < optionalParams.length) {
                DeviceConsole.s_console.error(message, optionalParams);
            } else {
                DeviceConsole.s_console.error(message);
            }
        }
        DeviceConsole.output("[error]" + message, "error");
    }

    exception(message?: string, ...optionalParams: any[]): void {
        if (DeviceConsole.s_console) {
            if (0 < optionalParams.length) {
                DeviceConsole.s_console.exception(message, optionalParams);
            } else {
                DeviceConsole.s_console.exception(message);
            }
        }
        DeviceConsole.output(message);
    }

    log(message?: any, ...optionalParams: any[]): void {
        if (DeviceConsole.s_console) {
            if (0 < optionalParams.length) {
                DeviceConsole.s_console.log(message, optionalParams);
            } else {
                DeviceConsole.s_console.log(message);
            }
        }
        DeviceConsole.output(message);
    }

    markTimeline(label?: string): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.markTimeline(label);
        }
    }

    profileEnd(): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.profileEnd();
        }
    }

    table(...data: any[]): void {
        if (DeviceConsole.s_console) {
            DeviceConsole.s_console.table(data);
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // private static methods

    private static bindGesture(): void {
        /*
         * コンソールを Long Tap することで、移動可能.
         * 当初、2本指タッチでコンソールを移動させようと試みたが、以下のバグにより Hammer 2.0.8 時点では不可
         * Multitouch panning not working https://github.com/hammerjs/hammer.js/issues/767
         */
        DeviceConsole.s_$display
            .hammer({
                recognizers: [
                    [Hammer.Tap, { event: "doubletap", taps: 2, posThreshold: DOUBLE_TAP_POSITION_ALLOWANCE }],
                    [Hammer.Pan, { pointers: 1, threshold: 0, direction: Hammer.DIRECTION_HORIZONTAL }, ["doubletap"]],
                ],
            })
            .on("taphold", (event: JQuery.Event) => {
                if (Config.DEBUG) { console.log("event:taphold"); }
                DeviceConsole.onDragBegin();
            })
            .on("doubletap", (event: JQuery.Event) => {
                if (Config.DEBUG) { console.log("event:doubletap"); }
                DeviceConsole.onResetPosition();
            })
//          .on("panstart", (event: JQuery.Event) => {
//              event.preventDefault();
//          })
            .on("panmove", (event: JQuery.Event) => {
                if (Config.DEBUG) { console.log("event:panmove"); }
                DeviceConsole.onDrag((<any>event).gesture.deltaY);
            })
            .on("panend", (event: JQuery.Event) => {
                if (Config.DEBUG) { console.log("event:panend"); }
                DeviceConsole.onDragEnd();
            })
            ;

    }

    private static onDragBegin(): void {
        const cssMatrixValue = ($element: JQuery, kind: string) => {
            let transX = 0;
            let transY = 0;
            let scaleX = 0;
            let scaleY = 0;
            for (let i = 0; i < CSS_PREFIXES.length; i++) {
                let matrix = $element.css(CSS_PREFIXES[i] + "transform");
                if (matrix) {
                    const is3dMatrix = matrix.indexOf("3d") !== -1 ? true : false;
                    matrix = matrix.replace("matrix3d", "").replace("matrix", "").replace(/[^\d.,-]/g, "");
                    const arr = matrix.split(",");
                    transX = Number(arr[is3dMatrix ? 12 : 4]);
                    transY = Number(arr[is3dMatrix ? 13 : 5]);
                    scaleX = Number(arr[0]);
                    scaleY = Number(arr[is3dMatrix ? 5 : 3]);
                    break;
                }
            }
            switch (kind) {
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

        DeviceConsole.s_gestureStart = {
            translateY: cssMatrixValue(DeviceConsole.s_$display, "translateY"),
        };

        DeviceConsole.s_$display.addClass("drag");
    }

    private static onDrag(delta: number): void {
        if (null != DeviceConsole.s_gestureStart.translateY && DeviceConsole.s_$display) {
            const value = DeviceConsole.s_gestureStart.translateY + delta;
            const transform = {};
            for (let i = 0; i < CSS_PREFIXES.length; i++) {
                transform[CSS_PREFIXES[i] + "transform"] = "translateY(" + value + "px)";
            }
            DeviceConsole.s_$display.css(transform);
        }
    }

    private static onDragEnd(): void {
        if (DeviceConsole.s_$display) {
            DeviceConsole.s_$display.removeClass("drag");
        }
        DeviceConsole.s_gestureStart = {};
    }

    private static onResetPosition(): void {
        let $display = DeviceConsole.s_$display;
        DeviceConsole.s_$display
            .on("transitionend webkitTransitionEnd", () => {
                if ($display) {
                    $display.removeClass("reset");
                    $display = null;
                }
            })
            .addClass("reset");

        const transform = {};
        for (let i = 0; i < CSS_PREFIXES.length; i++) {
            transform[CSS_PREFIXES[i] + "transform"] = "translateY(0px)";
        }
        DeviceConsole.s_$display.css(transform);
    }

    ///////////////////////////////////////////////////////////////////////
    // Mixin: Backbone.Events

    static on: (eventName: string, callback?: Function, context?: any) => any;
    static off: (eventName?: string, callback?: Function, context?: any) => any;
    static trigger: (eventName: string, ...args: any[]) => any;
    static bind: (eventName: string, callback: Function, context?: any) => any;
    static unbind: (eventName?: string, callback?: Function, context?: any) => any;

    static once: (events: string, callback: Function, context?: any) => any;
    static listenTo: (object: any, events: string, callback: Function) => any;
    static listenToOnce: (object: any, events: string, callback: Function) => any;
    static stopListening: (object?: any, events?: string, callback?: Function) => any;
}

//___________________________________________________________________________________________________________________//

// mixin : Backbone.Events
$.extend(DeviceConsole, Backbone.Events);

// set environment
if (Platform.Android) {
    $("html").addClass("require-touch-action-disable");
}
