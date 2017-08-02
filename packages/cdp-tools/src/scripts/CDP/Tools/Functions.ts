/// <reference types="jquery" />

namespace CDP.Tools {

    import Promise = CDP.Promise;

    const TAG = "[CDP.Tools.Functions] ";

    /**
     * Math.abs よりも高速な abs
     */
    export function abs(x: number): number {
        return x >= 0 ? x : -x;
    }

    /**
     * Math.max よりも高速な max
     */
    export function max(lhs: number, rhs: number): number {
        return lhs >= rhs ? lhs : rhs;
    }

    /**
     * Math.min よりも高速な min
     */
    export function min(lhs: number, rhs: number): number {
        return lhs <= rhs ? lhs : rhs;
    }

    /**
     * 数値を 0 詰めして文字列を生成
     */
    export function toZeroPadding(no: number, limit: number): string {
        let signed = "";
        no = Number(no);

        if (isNaN(no) || isNaN(limit) || limit <= 0) {
            return null;
        }

        if (no < 0) {
            no = Tools.abs(no);
            signed = "-";
        }

        return signed + (Array(limit).join("0") + no).slice(-limit);
    }

    /**
     * 文字列のバイト数をカウント
     */
    export function getStringSize(src: string): number {
        return (Binary.newBlob([src], { type: "text/plain" })).size;
    }

    /**
     * 文字列をバイト制限して分割
     */
    export function toStringChunks(src: string, limit: number): string[] {

        const chunks = [];

        const setChunk = (input: string): string[] => {
            if (limit < getStringSize(input)) {
                const half = Math.floor(input.length / 2);
                const lhs = input.slice(0, half);
                const rhs = input.slice(half);
                return [lhs, rhs];
            } else {
                chunks.push(input);
                return [];
            }
        };

        const makeChunk = (work: string) => {
            const failures = setChunk(work);
            while (0 < failures.length) {
                makeChunk(failures.shift());
            }
        };

        makeChunk(src);

        return chunks;
    }

    /**
     * 多重継承のための実行時継承関数
     *
     * Sub Class 候補オブジェクトに対して Super Class 候補オブジェクトを直前の Super Class として挿入する。
     * prototype のみコピーする。
     * インスタンスメンバをコピーしたい場合、Super Class が疑似コンストラクタを提供する必要がある。
     * 詳細は cdp.tools.Functions.spec.ts を参照。
     *
     * @param subClass   {constructor} [in] オブジェクトの constructor を指定
     * @param superClass {constructor} [in] オブジェクトの constructor を指定
     */
    export function inherit(subClass: any, superClass: any): void {
        const _prototype = subClass.prototype;

        function _inherit() {
            this.constructor = subClass;
        }
        _inherit.prototype = superClass.prototype;
        subClass.prototype = new _inherit();

        $.extend(subClass.prototype, _prototype);
    }

    /**
     * mixin 関数
     *
     * TypeScript Official Site に載っている mixin 関数
     * http://www.typescriptlang.org/Handbook#mixins
     * 既に定義されているオブジェクトから、新規にオブジェクトを合成する。
     *
     * @param derived {constructor}    [in] 合成されるオブジェクトの constructor を指定
     * @param bases   {constructor...} [in] 合成元オブジェクトの constructor を指定 (可変引数)
     */
    export function mixin(derived: any, ...bases: any[]): void {
        bases.forEach((base) => {
            Object.getOwnPropertyNames(base.prototype).forEach(name => {
                derived.prototype[name] = base.prototype[name];
            });
        });
    }

    /**
     * \~english
     * Helper function to correctly set up the prototype chain, for subclasses.
     * The function behavior is same as extend() function of Backbone.js.
     *
     * @param protoProps  {Object} [in] set prototype properties as object.
     * @param staticProps {Object} [in] set static properties as object.
     * @return {Object} subclass constructor.
     *
     * \~japanese
     * クラス継承のためのヘルパー関数
     * Backbone.js extend() 関数と同等
     *
     * @param protoProps  {Object} [in] prototype properties をオブジェクトで指定
     * @param staticProps {Object} [in] static properties をオブジェクトで指定
     * @return {Object} サブクラスのコンストラクタ
     */
    export function extend(protoProps: object, staticProps?: object): object {
        const parent = this;
        let child;

        if (protoProps && protoProps.hasOwnProperty("constructor")) {
            child = protoProps.constructor;
        } else {
            child = function () {
                return parent.apply(this, arguments);
            };
        }

        $.extend(child, parent, staticProps);

        const Surrogate = function () {
            this.constructor = child;
        };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate;

        if (protoProps) {
            $.extend(child.prototype, protoProps);
        }

        child.__super__ = parent.prototype;

        return child;
    }

    /**
     * DPI 取得
     */
    export function getDevicePixcelRatio(): number {
        let mediaQuery;
        const is_firefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
        if (null != window.devicePixelRatio && !is_firefox) {
            return window.devicePixelRatio;
        } else if (window.matchMedia) {
            mediaQuery =
                "(-webkit-min-device-pixel-ratio: 1.5),\
                    (min--moz-device-pixel-ratio: 1.5),\
                    (-o-min-device-pixel-ratio: 3/2),\
                    (min-resolution: 1.5dppx)";
            if (window.matchMedia(mediaQuery).matches) {
                return 1.5;
            }
            mediaQuery =
                "(-webkit-min-device-pixel-ratio: 2),\
                    (min--moz-device-pixel-ratio: 2),\
                    (-o-min-device-pixel-ratio: 2/1),\
                    (min-resolution: 2dppx)";
            if (window.matchMedia(mediaQuery).matches) {
                return 2;
            }
            mediaQuery =
                "(-webkit-min-device-pixel-ratio: 0.75),\
                    (min--moz-device-pixel-ratio: 0.75),\
                    (-o-min-device-pixel-ratio: 3/4),\
                    (min-resolution: 0.75dppx)";
            if (window.matchMedia(mediaQuery).matches) {
                return 0.7;
            }
        } else {
            return 1;
        }
    }

    // Canvas element のキャッシュ
    let s_canvasFactory: HTMLCanvasElement;

    // キャッシュ済みの Canvas を取得する
    export function getCanvas(): HTMLCanvasElement {
        s_canvasFactory = s_canvasFactory || document.createElement("canvas");
        return <HTMLCanvasElement>s_canvasFactory.cloneNode(false);
    }

    /**
     * 画像リソースのロード完了を保証
     * ブラウザ既定のプログレッシブロードを走らせないため.
     *
     * @param  {String} url [in] url (data-url)
     * @return {IPromise<string>} 表示可能な url
     */
    export function ensureImageLoaded(url: string): IPromise<string> {
        let img = new Image();

        const destroy = () => {
            if (img) {
                img.src = "";   // 読み込み停止
                img = null;
            }
        };

        return new Promise((resolve, reject) => {
            img.onload = (event: Event) => {
                destroy();
                resolve(url);
            };

            img.onerror = (event: Event) => {
                destroy();
                reject(makeErrorInfo(
                    RESULT_CODE.ERROR_CDP_TOOLS_IMAGE_LOAD_FAILED,
                    TAG,
                    "image load failed. [url: " + url + "]"
                ));
            };

            img.src = url;

        }, destroy);
    }

    /**
     * 画像のリサイズ
     * 指定した長辺の長さにアスペクト比を維持してリサイズを行う
     * longSideLength より小さな場合はオリジナルサイズで data-url を返却する
     *
     * @param  {String} src            [in] image に指定するソース
     * @param  {Number} longSideLength [in] リサイズに使用する長辺の最大値を指定
     * @return {IPromise<string>} base64 data url を返却
     */
    export function resizeImage(src: string, longSideLength: number): IPromise<string> {
        let img = new Image();

        const destroy = () => {
            if (img) {
                img.src = "";   // 読み込み停止
                img = null;
            }
        };

        return new Promise((resolve, reject) => {
            img.onload = (event: Event) => {
                const canvas = getCanvas();
                const ih = img.height, iw = img.width, ia = ih / iw;
                let cw: number, ch: number;

                if (iw === 0 || 0 === ia) { // 念のため不正な画像をガード
                    reject(makeErrorInfo(
                        RESULT_CODE.ERROR_CDP_TOOLS_INVALID_IMAGE,
                        TAG,
                        "invalid image. [src: " + src + "]"
                    ));
                } else {
                    if (longSideLength <= 0) {
                        longSideLength = (ia < 1) ? iw : ih;
                    }
                    if (ia < 1) {
                        cw = (longSideLength < iw) ? longSideLength : iw;
                        ch = Math.round(cw * ia);
                    } else {
                        ch = (longSideLength < ih) ? longSideLength : ih;
                        cw = Math.round(ch / ia);
                    }

                    canvas.width = cw;
                    canvas.height = ch;
                    canvas.getContext("2d").drawImage(img, 0, 0, cw, ch);

                    resolve(canvas.toDataURL());
                }

                destroy();
            };

            img.onerror = (event: Event) => {
                destroy();
                reject(makeErrorInfo(
                    RESULT_CODE.ERROR_CDP_TOOLS_IMAGE_LOAD_FAILED,
                    TAG,
                    "image load failed. [src: " + src + "]"
                ));
            };

            img.src = src;
        });
    }
}
