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
            const dateValue = this.convertISOStringToDateValue(dateString);
            return new Date(dateValue);
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

            // need offset if extended format (±YYYYYY-MM-DDTHH:mm:ss.sssZ)
            const offset = 27 === isoDateString.length ? 3 : 0;

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
            const dateValue = this.convertFileSystemStringToDateValue(dateString);
            return new Date(dateValue);
        }

        /**
         * Convert date object into string in file system compatible format (YYYY_MM_DDTHH_mm_ss_sss)
         *
         * @param date   {Date}   [in] date object
         * @param target {String} [in] { year | month | date | min | sec | msec }
         * @return {String} file system compatible string
         */
        public static convertDateToFileSystemString(date: Date, target: string = "msec"): string {
            const isoDateString = DateTime.convertDateToISOString(date, target);
            const fileSystemString = isoDateString.replace(/[-:.]/g, "_");
            return fileSystemString;
        }

        /**
         * Convert ISO string to value of date (milliseconds)
         *
         * @param isoString {String} [in] date string
         * @return {Number} value of date (ms)
         */
        private static convertISOStringToDateValue(isoString: string): number {
            const reYear = /(\d{4}|[-+]\d{6})/;
            const reMonth = /(\d{2})/;
            const reDay = /(\d{2})/;
            const reDate = new RegExp(`${reYear.source}(?:-${reMonth.source}(?:-${reDay.source})*)*`);

            const reHours = /(\d{2})/;
            const reMinutes = /(\d{2})/;
            const reSeconds = /(\d{2})/;
            const reMs = /(\d{3})/;
            const reTime = new RegExp(`T${reHours.source}:${reMinutes.source}(?::${reSeconds.source}(?:\.${reMs.source})*)*`);

            const reTz  = /(Z|[-+]\d{2}:\d{2})/;
            const reISOString = new RegExp(`^${reDate.source}(?:${reTime.source}(?:${reTz.source})*)*$`);

            const result = reISOString.exec(isoString);
            if (null == result) {
                // invalid ISO string
                return NaN;
            }

            const year = parseInt(result[1], 10);
            const month = parseInt(result[2], 10) - 1 || 0;
            const date = parseInt(result[3], 10) || 1;
            let hours = parseInt(result[4], 10) || 0;
            let minutes = parseInt(result[5], 10) || 0;
            const seconds = parseInt(result[6], 10) || 0;
            const ms = parseInt(result[7], 10) || 0;

            if (result[8]) {
                // timezone offset
                switch (result[8][0]) {
                    case "Z":
                        break;
                    case "-":
                    case "+":
                        // ±HH:mm
                        hours -= parseInt(result[8].substr(1, 2), 10) || 0;
                        minutes -= parseInt(result[8].substr(4, 2), 10) || 0;
                        break;
                    default:
                        console.warn("invalid timezone in ISO string");
                }
            }

            return Date.UTC(year, month, date, hours, minutes, seconds, ms);
        }

        /**
         * Convert file system compatible string to to value of date (milliseconds)
         *
         * @param dateString {String} [in] date string (YYYY_MM_DDTHH_mm_ss_sss)
         * @return {String} converted string
         */
        private static convertFileSystemStringToDateValue(dateString: string): number {
            const reYear = /(\d{4}|[-+]\d{6})/;
            const reMonth = /(\d{2})/;
            const reDay = /(\d{2})/;
            const reDate = new RegExp(`${reYear.source}(?:_${reMonth.source}(?:_${reDay.source})*)*`);

            const reHours = /(\d{2})/;
            const reMinutes = /(\d{2})/;
            const reSeconds = /(\d{2})/;
            const reMs = /(\d{3})/;
            const reTime = new RegExp(`T${reHours.source}_${reMinutes.source}(?:_${reSeconds.source}(?:_${reMs.source})*)*`);

            const reFileSystemString = new RegExp(`^${reDate.source}(?:${reTime.source})*$`);

            const result = reFileSystemString.exec(dateString);
            if (null == result) {
                // invalid file system string
                return NaN;
            }

            const year = parseInt(result[1], 10);
            const month = parseInt(result[2], 10) - 1 || 0;
            const date = parseInt(result[3], 10) || 1;
            const hours = parseInt(result[4], 10) || 0;
            const minutes = parseInt(result[5], 10) || 0;
            const seconds = parseInt(result[6], 10) || 0;
            const ms = parseInt(result[7], 10) || 0;

            return Date.UTC(year, month, date, hours, minutes, seconds, ms);
        }
    }
}
