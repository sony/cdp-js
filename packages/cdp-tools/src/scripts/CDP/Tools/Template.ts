/// <reference types="jquery" />
/// <reference types="underscore" />

namespace CDP.Tools {

    const TAG = "[CDP.Tools.Template] ";

    /**
     * @interface JST
     * @brief コンパイル済み テンプレート格納インターフェイス
     */
    export interface JST {
        (data?: any): string;
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @class Template
     * @brief template script を管理するユーティリティクラス
     */
    export class Template {

        static _mapElement: any;    //!< キーと JQuery Element の Map オブジェクト
        static _mapSource: any;     //!< URL と ソースファイル(HTML) の Map オブジェクト

        ///////////////////////////////////////////////////////////////////////
        // 公開メソッド

        /**
         * 指定した id, class 名, Tag 名をキーにテンプレートの JQuery Element を取得する。
         *
         * @param {String}  key     [in] id, class, tag を表す文字列
         * @param {String}  [src]   [in] 外部 html を指定する場合は url を設定
         * @param {Boolean} [cache] [in] src html をキャッシュする場合は true. src が指定されているときのみ有効
         * @return template が格納されている JQuery Element
         */
        static getTemplateElement(key: string, src: string = null, cache: boolean = true): JQuery {
            const mapElement = Template.getElementMap();
            let $element = mapElement[key];

            try {
                if (!$element) {
                    if (src) {
                        const html = Template.findHtmlFromSource(src);
                        $element = $(html).find(key);
                    } else {
                        $element = $(key);
                    }
                    // 要素の検証
                    if ($element <= 0) {
                        throw ("invalid [key, src] = [" + key + ", " + src + "]");
                    }
                    if (src && cache) {
                        mapElement[key] = $element;
                    }
                }
            } catch (exception) {
                console.error(TAG + exception);
                return null;
            }

            return $element;
        }

        /**
         * Map オブジェクトの削除
         * 明示的にキャッシュを開放する場合は本メソッドをコールする
         */
        static empty(): void {
            Template._mapElement = null;
            Template._mapSource = null;
        }

        /**
         * 指定した id, class 名, Tag 名をキーに JST を取得する。
         *
         * @param {String | jQuery} key     [in] id, class, tag を表す文字列 または テンプレート文字列, または jQuery オブジェクト
         * @param {String}          [src]   [in] 外部 html を指定する場合は url を設定
         * @param {Boolean}         [cache] [in] src html をキャッシュする場合は true. src が指定されているときのみ有効
         * @return コンパイルされた JST オブジェクト
         */
        static getJST(key: JQuery): JST;
        static getJST(key: string, src?: string, cache?: boolean): JST;
        static getJST(key: any, src?: string, cache?: boolean): JST {
            let template: any = null;
            let jst: JST;
            let $element: JQuery;
            if (key instanceof jQuery) {
                $element = key;
            } else {
                $element = this.getTemplateElement(key, src, cache);
            }
            if (null != global.Hogan) {
                template = Hogan.compile($element.text());
                jst = function (data?: any): string {
                    return template.render(data);
                };
            } else {
                template = _.template($element.html());
                jst = function (data?: any): string {
                    // 改行とタブは削除する
                    return template(data).replace(/\n|\t/g, "");
                };
            }
            return jst;
        }

        ///////////////////////////////////////////////////////////////////////
        // 内部メソッド

        //! Element Map オブジェクトの取得
        private static getElementMap(): any {
            if (!Template._mapElement) {
                Template._mapElement = {};
            }
            return Template._mapElement;
        }

        //! URL Map オブジェクトの取得
        private static getSourceMap(): any {
            if (!Template._mapSource) {
                Template._mapSource = {};
            }
            return Template._mapSource;
        }

        //! URL Map から HTML を検索. 失敗した場合は undefined が返る
        private static findHtmlFromSource(src: string): string {
            const mapSource = Template.getSourceMap();
            let html = mapSource[src];

            if (!html) {
                $.ajax({
                    url: src,
                    method: "GET",
                    async: false,
                    dataType: "html",
                    success: (data: any) => {
                        html = data;
                    },
                    error: (data: any, status: string) => {
                        throw ("ajax request failed. status: " + status);
                    }
                });
                // キャッシュに格納
                mapSource[src] = html;
            }
            return html;
        }
    }
}
