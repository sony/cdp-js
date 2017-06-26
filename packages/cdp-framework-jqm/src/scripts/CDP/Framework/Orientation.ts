namespace CDP.Framework {
    /**
     * @enum Orientation
     */
    export enum Orientation {
        PORTRAIT = 0,
        LANDSCAPE = 1,
    }

    /**
     * \~english
     * Get Orientation enum code
     *
     * @return {Number} Orientation Code.
     *
     * \~japanese
     * Orientation の取得
     *
     * @return {Number} Orientation Code.
     */
    export function getOrientation(): Orientation {
        let $window = $(window);
        return ($window.width() < $window.height()) ? Orientation.PORTRAIT : Orientation.LANDSCAPE;
    }
}
