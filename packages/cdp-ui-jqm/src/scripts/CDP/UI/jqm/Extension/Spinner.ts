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

    // jQuery plugin
    $.fn.spinner = function (options?: DomExtensionOptions | "refresh") {
        if ("string" === typeof options) {
            return refresh($(this));
        } else {
            return spinnerify($(this), options);
        }
    };

    function spinnerify($target: JQuery, options?: DomExtensionOptions): JQuery {
        if ($target.length <= 0) {
            return $target;
        }

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

        const makeTemplateParam = (clr: string): object => {
            return {
                borderTop: "style=border-top-color:" + clr + ";",
                border: "style=border-color:" + clr + ";",
            };
        };

        const color = $target.data("spinner-color");
        let param = null;
        if (color) {
            $target.css({ "background-color": color });
            param = makeTemplateParam(color);
        }
        $target.append(_template(param));

        return refresh($target);
    }

    // iOS 10.2+ SVG SMIL アニメーションが 2回目以降動かない問題の対策
    // data:image/svg+xml;<cache bust string>;base64,... とすることで data-url にも cache busting が有効になる
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
                    } else {
                        dataUrl = null;
                    }
                }
            }
            if (valid(dataUrl)) {
                $target.css(PREFIX[i] + "mask-image", dataUrl);
            }
        }

        return $target;
    }

    /**
     * Material Design Spinner 拡張
     *
     * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
     * @param {DomExtensionOptions} [options] [in] オプション
     */
    function applyDomExtension($ui: JQuery, options?: DomExtensionOptions): JQuery {
        $ui.find(".ui-spinner, .ui-icon-loading")
            .each((index: number, elem: Element) => {
                $(elem).spinner(options);
            });
        return $ui;
    }

    // 登録
    ExtensionManager.registerDomExtension(applyDomExtension);
}
