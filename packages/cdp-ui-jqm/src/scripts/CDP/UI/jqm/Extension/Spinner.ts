/**
 * jQuery plugin definition
 */
interface JQuery {
    spinner(options?: CDP.UI.DomExtensionOptions | "refresh"): JQuery;
}

namespace CDP.UI.Extension {

    import Template = CDP.Tools.Template;
    import JST      = CDP.Tools.JST;

    let _template: JST;

    /**
     * Material Design Spinner 拡張
     *
     * @param {jQuery}              $target   [in] 検索対象の jQuery オブジェクト
     * @param {DomExtensionOptions} [options] [in] オプション
     */
    function applyDomExtension($target: JQuery, options?: DomExtensionOptions): JQuery {
        if (!_template) {
            _template = Template.getJST(`
                <script type="text/template">
                    <span class="ui-spinner-base">
                        <span class="ui-spinner-inner">
                            <span class="ui-spinner-inner-gap" {{borderTop}}></span>
                            <span class="ui-spinner-inner-left">
                                <span class="ui-spinner-inner-half-circle" {{border}}></span>
                            </span>
                            <span class="ui-spinner-inner-right">
                                <span class="ui-spinner-inner-half-circle" {{border}}></span>
                            </span>
                        </span>
                    </span>
                </script>
            `);
        }

        const makeTemplateParam = (color: string): Object => {
            return {
                borderTop: "style=border-top-color:" + color + ";",
                border: "style=border-color:" + color + ";",
            };
        };

        const spinnerify = (elem: Element) => {
            const $elem = $(elem);
            const color = $elem.data("spinner-color");
            let param = null;
            if (color) {
                $elem.css({ "background-color": color });
                param = makeTemplateParam(color);
            }
            $elem.append(_template(param));
            refresh($elem);
        };

        $target.find(".ui-spinner, .ui-icon-loading")
            .each((index: number, elem: Element) => {
                spinnerify(elem);
            });

        return $target;
    }

    // iOS 10.2+ SVG SMIL アニメーションが 2回目以降動かない問題の対策
    // data:image/svg+xml;<cache bust string>;base,... とすることで data-url にもcache busting が有効になる
    function refresh($target: JQuery): JQuery {
        const PREFIX = ["-webkit-", ""];

        const valid = (prop) => {
            return (prop && "none" !== prop);
        };

        let dataUrl: string;
        for (let i = 0, n = PREFIX.length; i < n; i++) {
            if (!valid(dataUrl)) {
                dataUrl = $target.css(PREFIX[i] + "mask-image");
                if (valid(dataUrl)) {
                    // iOS では url(data***); 内に '"' は入らない
                    const match = dataUrl.match(/(url\(data:image\/svg\+xml;)([\s\S]*)?(base64,[\s\S]*\))/);
                    if (match) {
                        dataUrl = `${match[1]}bust=${Date.now().toString(36)};${match[3]}`;
                    }
                }
            }
            if (valid(dataUrl)) {
                $target.css(PREFIX[i] + "mask-image", dataUrl);
            }
        }

        return $target;
    }

    //! jQuery plugin
    $.fn.spinner = function (options?: DomExtensionOptions | "refresh") {
        if ("string" === typeof options) {
            return refresh($(this));
        } else {
            return applyDomExtension($(this), options);
        }
    };

    // 登録
    ExtensionManager.registerDomExtension(applyDomExtension);
}
