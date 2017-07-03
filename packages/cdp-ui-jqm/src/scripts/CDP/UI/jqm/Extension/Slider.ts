namespace CDP.UI.Extension {

    /**
     * jQuery Mobile Slider 拡張
     *
     * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
     * @param {DomExtensionOptions} [options] [in] オプション
     */
    function applyDomExtension($ui: JQuery, options?: DomExtensionOptions): JQuery {
        $ui.find(".ui-slider-input")
            .on("slidestop", (event: JQuery.Event) => {
                const $handles = $(event.currentTarget)
                    .parent()
                    .find(".ui-slider-handle");
                $handles.blur();
            });
        return $ui;
    }

    // 登録
    ExtensionManager.registerDomExtension(applyDomExtension);
}
