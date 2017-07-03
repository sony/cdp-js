/**
 * jQuery plugin definition
 */
interface JQuery {
    spinner(options?: CDP.UI.DomExtensionOptions): JQuery;
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
        };

        $target.find(".ui-spinner, .ui-icon-loading")
            .each((index: number, elem: Element) => {
                spinnerify(elem);
            });

        return $target;
    }

    //! jQuery plugin
    $.fn.spinner = function (options?: DomExtensionOptions) {
        return applyDomExtension($(this), options);
    };

    // 登録
    ExtensionManager.registerDomExtension(applyDomExtension);
}
