namespace CDP.UI.Extension {

    /**
     * Text Input 用 Floating Label 拡張
     *
     * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
     * @param {DomExtensionOptions} [options] [in] オプション
     */
    function applyDomExtension($ui: JQuery, options?: DomExtensionOptions): JQuery {
        const update = (elem: Element, floating: boolean) => {
            const $elem = $(elem);
            if (floating) {
                $elem.addClass("ui-float-label-floating");
            } else {
                $elem.removeClass("ui-float-label-floating");
            }
        };

        const floatingify = (elem: Element) => {
            const id = $(elem).attr("for");
            const $input = $ui.find("#" + id);
            if ("search" === $input.jqmData("type")) {
                $(elem).addClass("ui-float-label-has-icon");
            }
            update(elem, !!$input.val());
            $input.on("keyup change input focus blur cut paste", (event: JQuery.Event) => {
                update(elem, !!$(event.target).val());
            });
        };

        $ui.find("label.ui-float-label, .ui-float-label label")
            .each((index: number, elem: Element) => {
                floatingify(elem);
            });

        return $ui;
    }

    // 登録
    ExtensionManager.registerDomExtension(applyDomExtension);
}
