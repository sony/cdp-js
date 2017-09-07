namespace CDP.Framework {

    /**
     * @en Orientation code
     * @ja orientation 識別子
     */
    export enum Orientation {
        PORTRAIT = 0,
        LANDSCAPE = 1,
    }

    /**
     * @en Get Orientation enum code
     * @ja Orientation の取得
     */
    export function getOrientation(): Orientation {
        const $window = $(window);
        return ($window.width() < $window.height()) ? Orientation.PORTRAIT : Orientation.LANDSCAPE;
    }
}
