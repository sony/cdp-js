/* tslint:disable:no-bitwise */

namespace CDP.UI {

    const TAG = "[CDP.UI.Toast] ";

    /**
     * @class Toast
     * @brief Android SDK の Toast クラスのように自動消滅するメッセージ出力ユーティリティ
     *        入れ子の関係を実現するために module で実装
     */
    export module Toast {

        // 表示時間の定義
        export let LENGTH_SHORT = 1500;   //!< 短い:1500 msec
        export let LENGTH_LONG  = 4000;   //!< 長い:4000 msec

        //! @enum オフセットの基準
        export enum OffsetX {
            LEFT    = 0x0001,
            RIGHT   = 0x0002,
            CENTER  = 0x0004,
        }

        //! @enum オフセットの基準
        export enum OffsetY {
            TOP     = 0x0010,
            BOTTOM  = 0x0020,
            CENTER  = 0x0040,
        }

        /**
         * @interface StyleBuilder
         * @brief     スタイル変更時に使用するインターフェイス
         *            css にスタイルを逃がす場合、独自の class を設定し、getStyle は null を返すこと。
         */
        export interface StyleBuilder {
            //! class attribute に設定する文字列を取得
            getClass(): string;
            //! style attribute に設定する JSON オブジェクトを取得
            getStyle(): any;
            //! オフセットの基準位置を取得
            getOffsetPoint(): number;
            //! X 座標のオフセット値を取得
            getOffsetX(): number;
            //! Y 座標のオフセット値を取得
            getOffsetY(): number;
        }

        /**
         * @class StyleBuilderDefault
         * @brief スタイル変更時に使用する既定の構造体オブジェクト
         */
        export class StyleBuilderDefault implements StyleBuilder {

            //! class attribute に設定する文字列を取得
            getClass(): string {
                return "ui-loader ui-overlay-shadow ui-corner-all";
            }

            //! style attribute に設定する JSON オブジェクトを取得
            getStyle(): any {
                const style = {
                    "padding":          "7px 25px 7px 25px",
                    "display":          "block",
                    "background-color": "#1d1d1d",
                    "border-color":     "#1b1b1b",
                    "color":            "#fff",
                    "text-shadow":      "0 1px 0 #111",
                    "font-weight":      "bold",
                    "opacity":          0.8,
                };
                return style;
            }

            //! オフセットの基準位置を取得
            getOffsetPoint(): number {
                return OffsetX.CENTER | OffsetY.BOTTOM;
            }

            //! X 座標のオフセット値を取得
            getOffsetX(): number {
                return 0;
            }

            //! Y 座標のオフセット値を取得
            getOffsetY(): number {
                return -75;
            }
        }

        /**
         * Toast 表示
         *
         * @param message  [in] メッセージ
         * @param duration [in] 表示時間を設定 (msec) default: LENGTH_SHORT
         * @param style    [in] スタイル変更する場合には派生クラスオブジェクトを指定
         */
        export function show(message: string, duration: number = Toast.LENGTH_SHORT, style?: StyleBuilder): void {
            const $mobile = $.mobile;
            const info = style || new StyleBuilderDefault();
            const setCSS = info.getStyle() ? true : false;

            // 改行コードは <br/> に置換する
            const msg = message.replace(/\n/g, "<br/>");

            // メッセージ element の動的生成
            const html = "<div>" + msg + "</div>";
            const box = $(html).addClass(info.getClass());
            if (setCSS) {
                box.css(info.getStyle());
            }

            // 自動改行されてもよいように、基点を設定してから追加
            box.css({
                "top": 0,
                "left": 0,
            }).appendTo($mobile.pageContainer);

            // 配置位置の決定
            const offsetPoint = info.getOffsetPoint();
            const $window = $(window);
            let posX, posY;

            const box_width = box.width() + parseInt(box.css("padding-left"), 10) + parseInt(box.css("padding-right"), 10);
            const box_height = box.height() + parseInt(box.css("padding-top"), 10) + parseInt(box.css("padding-bottom"), 10);

            switch (offsetPoint & 0x000F) {
                case OffsetX.LEFT:
                    posX = 0 + info.getOffsetX();
                    break;
                case OffsetX.RIGHT:
                    posX = $window.width() - box_width + info.getOffsetX();
                    break;
                case OffsetX.CENTER:
                    posX = ($window.width() / 2) - (box_width / 2) + info.getOffsetX();
                    break;
                default:
                    console.warn(TAG + "warn. unknown offsetPoint:" + (offsetPoint & 0x000F));
                    posX = ($window.width() / 2) - (box_width / 2) + info.getOffsetX();
                    break;
            }

            switch (offsetPoint & 0x00F0) {
                case OffsetY.TOP:
                    posY = 0 + info.getOffsetY();
                    break;
                case OffsetY.BOTTOM:
                    posY = $window.height() - box_height + info.getOffsetY();
                    break;
                case OffsetY.CENTER:
                    posY = ($window.height() / 2) - (box_height / 2) + info.getOffsetY();
                    break;
                default:
                    console.warn(TAG + "warn. unknown offsetPoint:" + (offsetPoint & 0x00F0));
                    posY = ($window.height() / 2) - (box_height / 2) + info.getOffsetY();
                    break;
            }

            // 表示
            box.css({
                "top": posY,
                "left": posX,
            })
            .delay(duration)
            .fadeOut(400, function () {
                $(this).remove();
            });
        }
    }
}
