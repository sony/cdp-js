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
         * @param base   {Date}   [in] 基準日
         * @param add    {Number} [in] 加算日. マイナス指定でn日前も設定可能
         * @param target {String} [in] { year | month | date | hour | min | sec | msec }
         * @return {Date} 日付オブジェクト
         */
        public static computeDate(base: Date, add: number, target: string = "date"): Date {
            const date = new Date(base.getTime());

            switch (target) {
                case "year":
                    date.setUTCFullYear(base.getUTCFullYear() + add);
                    break;
                case "month":
                    date.setUTCMonth(base.getUTCMonth() + add);
                    break;
                case "date":
                    date.setUTCDate(base.getUTCDate() + add);
                    break;
                case "hour":
                    date.setUTCHours(base.getUTCHours() + add);
                    break;
                case "min":
                    date.setUTCMinutes(base.getUTCMinutes() + add);
                    break;
                case "sec":
                    date.setUTCSeconds(base.getUTCSeconds() + add);
                    break;
                case "msec":
                    date.setUTCMilliseconds(base.getUTCMilliseconds() + add);
                    break;
                default:
                    console.warn(TAG + "unknown target: " + target);
                    date.setUTCDate(base.getUTCDate() + add);
            }

            return date;
        }

        /**
         * Convert string to date object
         *
         * @param {String} date string ex) YYYY-MM-DDTHH:mm:ss.sssZ
         * @return {Object} date object
         */
        public static convertISOStringToDate(dateString: string): Date {
            return new Date(dateString);
        }

        /**
         * Convert date object into string (the ISO 8601 Extended Format)
         *
         * @param date   {Date}   [in] date object
         * @param target {String} [in] { year | month | date | min | sec | msec | tz }
         * @return {String} date string
         */
        public static convertDateToISOString(date: Date, target: string = "tz"): string {
            const isoDateString = date.toISOString();

            let offset = 0;
            if (27 === isoDateString.length) {  // ±YYYYYY-MM-DDTHH:mm:ss.sssZ
                offset = 3;
            }

            switch (target) {
                case "year":
                    return isoDateString.substr(0, offset + 4);
                case "month":
                    return isoDateString.substr(0, offset + 7);
                case "date":
                    return isoDateString.substr(0, offset + 10);
                case "min":
                    return isoDateString.substr(0, offset + 16);
                case "sec":
                    return isoDateString.substr(0, offset + 19);
                case "msec":
                    return isoDateString.substr(0, offset + 23);
                case "tz":
                    return isoDateString;
                default:
                    console.warn(TAG + "unknown target: " + target);
                    return isoDateString;
                }
        }

        /**
         * Convert file system compatible string to date object
         *
         * @param {String} date string ex) YYYY_MM_DDTHH_mm_ss_sss
         * @return {Object} date object
         */
        public static convertFileSystemStringToDate(dateString: string): Date {
            const dateTime = dateString.split("T");
            let isoDateString = dateTime[0].replace(/_/g, "-");

            if (dateTime[1]) {
                const timeArray = dateTime[1].split("_");
                let timeString = "T";

                if (timeArray.length < 4) {
                    timeString += timeArray.join(":");
                } else {
                    timeString += timeArray.slice(0, 3).join(":");
                    timeString += "." + timeArray[3];
                }

                isoDateString += timeString;
            }

            return new Date(isoDateString);
        }

        /**
         * Convert date object into string in file system compatible format (YYYY_MM_DDTHH_mm_ss_sss)
         *
         * @param date   {Date}   [in] date object
         * @param target {String} [in] { year | month | date | min | sec | msec | tz }
         * @return {String} file system compatible string
         */
        public static convertDateToFileSystemString(date: Date, target: string = "tz"): string {
            const isoDateString = DateTime.convertDateToISOString(date, target);
            const  fileSystemString = isoDateString.replace(/[-:.]/g, "_");
            return fileSystemString;
        }
    }
}
