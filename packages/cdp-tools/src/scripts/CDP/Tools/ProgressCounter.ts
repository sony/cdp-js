namespace CDP.Tools {

    const TAG = "[CDP.Tools.ProgressCounter] ";

    /**
     * @interface ProgressCounterOptions
     * @brief ProgressCounter に指定するオプション
     */
    export interface ProgressCounterOptions {
        max?: number;                       // 進捗値の最大値 既定: 100
        allowIncrementRemain?: boolean;     // 残り推定時間が増えてよい場合には true 既定: false
    }

    /**
     * @interface ProgressCounterResult
     * @brief 進捗の時間を持つインターフェイス
     *        単位は [msec]
     */
    export interface ProgressCounterResult {
        passTime: number;       // 経過時間
        remainTime: number;     // 残り推定時間
    }

    /**
     * @class ProgressCounter
     * @brief 進捗の時間を扱うユーティリティクラス
     */
    export class ProgressCounter {

        private _settings: {
            max: number;
            beginTime: number;
            allowIncrementeRemain: boolean;
            lastRemainTime: number;
        };

        /**
         * constructor
         *
         * @param [options] オプション
         */
        constructor(options?: ProgressCounterOptions) {
            this.reset(options);
        }

        /**
         * 開始時間を初期化
         */
        public reset(options?: ProgressCounterOptions): void {
            this._settings = {
                ...{
                    max: 100,
                    beginTime: Date.now(),
                    allowIncrementeRemain: false,
                    lastRemainTime: Infinity,
                }
                , ...<any>options
            };
        }

        /**
         * 経過時間と推定残り時間を取得する
         * 進捗値が 0 の場合は、推定残り時間に Infinity を返す
         *
         * @param   progress [in] 進捗値
         * @returns 経過時間と推定残り時間 [msec]
         */
        public compute(progress: number): ProgressCounterResult {
            const passTime = Date.now() - this._settings.beginTime;
            let remainTime = Infinity;
            if (null != progress && 0 !== progress) {
                remainTime = passTime * this._settings.max / progress - passTime;
            }
            if (this._settings.allowIncrementeRemain || (remainTime < this._settings.lastRemainTime)) {
                this._settings.lastRemainTime = remainTime;
            } else {
                remainTime = this._settings.lastRemainTime;
            }

            return { passTime, remainTime };
        }
    }
}
