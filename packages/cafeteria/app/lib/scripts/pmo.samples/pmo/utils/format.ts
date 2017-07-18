import { DateTime } from "cdp/tools";

const TAG = "[pmo.utils.format] ";

/**
 * @class Format
 * @brief ローカライズが必要なフォーマットユーティリティクラス
 */
export class Format {

    ///////////////////////////////////////////////////////////////////////
    // public static method

    /**
     * 日付文字列へ変換
     */
    public static date2string(dateTime: string): string;
    public static date2string(dateTime: Date): string;
    public static date2string(dateTime: any): string {
        let date;
        if (typeof dateTime === "string") {
            date = DateTime.convertISOStringToDate(dateTime);
        } else {
            date = dateTime;
        }

        return $.t("advanced.pmo.app.yearMonthDate", {
            year: date.getFullYear().toString(),
            month: $.t("app.utility.month.index", { context: date.getMonth().toString() }),
            date: date.getDate(),
        });
    }
}
