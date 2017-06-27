/* tslint:disable:max-line-length */

namespace CDP.Tools {

    const TAG = "[CDP.Tools.DateTime] ";

    /**
     * @class DateTime
     * @brief 時刻操作のユーティリティクラス
     */
    export class DateTime {

        ///////////////////////////////////////////////////////////////////////
        // public static method

        /**
         * 基点となる日付から、n日後、n日前を算出
         *
         * @param base    {Date}   [in] 基準日
         * @param addDays {Number} [in] 加算日. マイナス指定でn日前も設定可能
         * @return {Date} 日付オブジェクト
         */
        public static computeDate(base: Date, addDays: number): Date {
            const dt = new Date(base.getTime());
            const baseSec = dt.getTime();
            const addSec = addDays * 86400000;    //日数 * 1日のミリ秒数
            const targetSec = baseSec + addSec;
            dt.setTime(targetSec);
            return dt;
        }

        /**
         * Convert string to date object
         *
         * @param {String} date string ex) YYYY-MM-DDTHH:mm:SS.SSS
         * @return {Object} date object
         */
        public static convertISOStringToDate(dateString: string): Date {
            const dateTime = dateString.split("T"),
                dateArray = dateTime[0].split("-");
            let timeArray, secArray, dateObject;

            if (dateTime[1]) {
                timeArray = dateTime[1].split(":");
                secArray = timeArray[2].split(".");
            }

            if (timeArray) {
                dateObject = new Date(<any>dateArray[0], <any>dateArray[1] - 1, <any>dateArray[2],
                    <any>timeArray[0], <any>timeArray[1], <any>secArray[0], <any>secArray[1]);
            } else {
                if (dateArray[2]) {
                    dateObject = new Date(<any>dateArray[0], <any>dateArray[1] - 1, <any>dateArray[2]);
                } else if (dateArray[1]) {
                    dateObject = new Date(<any>dateArray[0], <any>dateArray[1] - 1);
                } else {
                    dateObject = new Date(<any>dateArray[0]);
                }
            }

            return dateObject;
        }

        /**
         *  Convert a date object into a string in PMOAPI recorded_date format(the ISO 8601 Extended Format)
         *
         * @param date   {Date}   [in] date object
         * @param target {String} [in] {year | month | date | hour | min | sec | msec }
         * @return {String}
         */
        public static convertDateToISOString(date: Date, target: string = "msec"): string {
            let isoDateString;

            switch (target) {
                case "year":
                case "month":
                case "date":
                case "hour":
                case "min":
                case "sec":
                case "msec":
                    break;
                default:
                    console.warn(TAG + "unknown target: " + target);
                    target = "msec";
            }

            isoDateString = date.getFullYear();
            if ("year" === target) {
                return isoDateString;
            }

            isoDateString += ("-" + DateTime.numberToDoubleDigitsString(date.getMonth() + 1));
            if ("month" === target) {
                return isoDateString;
            }

            isoDateString += ("-" + DateTime.numberToDoubleDigitsString(date.getDate()));
            if ("date" === target) {
                return isoDateString;
            }

            isoDateString += ("T" + DateTime.numberToDoubleDigitsString(date.getHours()));
            if ("hour" === target) {
                return isoDateString;
            }

            isoDateString += (":" + DateTime.numberToDoubleDigitsString(date.getMinutes()));
            if ("min" === target) {
                return isoDateString;
            }

            isoDateString += (":" + DateTime.numberToDoubleDigitsString(date.getSeconds()));
            if ("sec" === target) {
                return isoDateString;
            }

            isoDateString += ("." + String((date.getMilliseconds() / 1000).toFixed(3)).slice(2, 5));
            return isoDateString;
        }


        /**
         * Convert file system compatible string to date object
         *
         * @param {String} date string ex) yyyy_MM_ddTHH_mm_ss_SSS
         * @return {Object} date object
         */
        public static convertFileSystemStringToDate(dateString: string): Date {
            const dateTime = dateString.split("T"),
                dateArray = dateTime[0].split("_");
            let timeArray, dateObject;

            if (dateTime[1]) {
                timeArray = dateTime[1].split("_");
            }

            if (timeArray) {
                dateObject = new Date(<any>dateArray[0], <any>dateArray[1] - 1, <any>dateArray[2],
                    <any>timeArray[0], <any>timeArray[1], <any>timeArray[2], <any>timeArray[3]);
            } else {
                if (dateArray[2]) {
                    dateObject = new Date(<any>dateArray[0], <any>dateArray[1] - 1, <any>dateArray[2]);
                } else if (dateArray[1]) {
                    dateObject = new Date(<any>dateArray[0], <any>dateArray[1] - 1);
                } else {
                    dateObject = new Date(<any>dateArray[0]);
                }
            }

            return dateObject;
        }

        /**
         *  Convert a date object into a string in file system compatible format(yyyy_MM_ddTHH_mm_ss_SSS)
         *
         * @param date   {Date}   [in] date object
         * @param target {String} [in] {year | month | date | hour | min | sec | msec }
         * @return {String}
         */
        public static convertDateToFileSystemString(date: Date, target: string = "msec"): string {
            let fileSystemString;

            switch (target) {
                case "year":
                case "month":
                case "date":
                case "hour":
                case "min":
                case "sec":
                case "msec":
                    break;
                default:
                    console.warn(TAG + "unknown target: " + target);
                    target = "msec";
            }

            fileSystemString = date.getFullYear();
            if ("year" === target) {
                return fileSystemString;
            }

            fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getMonth() + 1));
            if ("month" === target) {
                return fileSystemString;
            }

            fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getDate()));
            if ("date" === target) {
                return fileSystemString;
            }

            fileSystemString += ("T" + DateTime.numberToDoubleDigitsString(date.getHours()));
            if ("hour" === target) {
                return fileSystemString;
            }

            fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getMinutes()));
            if ("min" === target) {
                return fileSystemString;
            }

            fileSystemString += ("_" + DateTime.numberToDoubleDigitsString(date.getSeconds()));
            if ("sec" === target) {
                return fileSystemString;
            }

            fileSystemString += ("_" + String((date.getMilliseconds() / 1000).toFixed(3)).slice(2, 5));
            return fileSystemString;
        }

        ///////////////////////////////////////////////////////////////////////
        // private static method

        /**
         * Convert num to string(double digits)
         *
         * @param  {Number} number (0 <number < 100)
         * @return {String} double digits string
         */
        private static numberToDoubleDigitsString(num: number): string {
            if (num < 0 || num > 100) {
                return null;
            }
            if (num < 10) {
                return "0" + num;
            }
            return "" + num;
        }
    }
}
