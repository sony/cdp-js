import {
    Platform,
    Orientation,
    getOrientation,
} from "cdp/framework";
import {
    min,
    max,
    getDevicePixcelRatio,
} from "cdp/tools";

const TAG = "[pmo.utils.metrics] ";

/**
 * @file Metrics
 * @brief 画面情報のユーティリティ
 */

/**
 * @enum DisplayType
 */
export enum DisplayType {
    PHONE_PORT = 0,
    PHONE_LAND,
    TABLET_PORT,
    TABLET_LAND,
}

/**
 * @interface Side
 */
export interface Side {
    short: number;  // 短辺
    long: number;   // 長辺
}

/**
 * @interface OrientationMetrics
 */
export interface OrientationMetrics {
    portrait: number;
    landscape: number;
}

//___________________________________________________________________________________________________________________//

// display
let _displaySide: Side = null;

//! display 情報設定
export function setDisplaySide(short: number, long: number): void {
    _displaySide = {
        short: short,
        long: long,
    };
}

/**
 * Display の辺の長さを取得
 * Status Bar 含む
 *
 * @return {Object} window side info.
 */
export function getDisplaySide(): Side {
    if (_displaySide) {
        return _displaySide;
    }

    // [NOTE] テスト実装
    const side = getWindowSide();
    let statusBar: number = 0;

    if (Platform.Android) {
        switch (getDevicePixcelRatio()) {
            case 0.75:
                statusBar = 19;
                break;
            case 1:
                statusBar = 25;
                break;
            case 1.5:
                statusBar = 38;
                break;
            case 2:
                statusBar = 50;
                break;
            default:
                statusBar = 50;
                break;
        }
    }

    if (Orientation.PORTRAIT === getOrientation()) {
        side.short += statusBar;
    } else {
        side.long += statusBar;
    }
    return side;
}

/**
 * Window の辺の長さを取得
 * Status Bar の高さを考慮していないことに注意
 *
 * @return {Object} window side info.
 */
export function getWindowSide(): Side {
    const $window = $(window);
    return {
        short: min($window.width(), $window.height()),
        long: max($window.width(), $window.height()),
    };
}

/**
 * 基準となる Window 幅を取得
 *
 * @return {Object} window side info.
 */
export function getWindowBaseWidth(): OrientationMetrics {
    let statusBarHeight = 0;
    const displaySide = getDisplaySide();
    const windowSide = getWindowSide();

    if (windowSide.short < displaySide.short) {
        statusBarHeight = displaySide.short - windowSide.short;
    } else if (windowSide.long < displaySide.long) {
        statusBarHeight = displaySide.long - windowSide.long;
    }

    if (Orientation.PORTRAIT === getOrientation()) {
        return {
            portrait: windowSide.short,
            landscape: windowSide.long + statusBarHeight,
        };
    } else {
        return {
            portrait: windowSide.short + statusBarHeight,
            landscape: windowSide.long,
        };
    }
}

/**
 * Tabletの判定
 *
 * @return {Boolean} true: tablet / false: phone
 */
export function isTablet(): boolean {
    const $window = $(window);
    const shortSize = min($window.width(), $window.height());
    return shortSize >= 600;

}

/**
 * Orientation の取得
 *
 * @return {Number} Orientation Code.
 */
export function getDisplayType(): DisplayType {
    const orientation = getOrientation();
    if (isTablet()) {
        if (Orientation.PORTRAIT === orientation) {
            return DisplayType.TABLET_PORT;
        } else {
            return DisplayType.TABLET_LAND;
        }
    } else {
        if (Orientation.PORTRAIT === orientation) {
            return DisplayType.PHONE_PORT;
        } else {
            return DisplayType.PHONE_LAND;
        }
    }
}
