namespace CDP.UI.Extension {

    import Framework = CDP.Framework;

    /**
     * jQuery Mobile Flip Switch 拡張
     *
     * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
     * @param {DomExtensionOptions} [options] [in] オプション
     */
    function applyDomExtension($ui: JQuery, options?: DomExtensionOptions): JQuery {
        /*
         * flipswitch に紐づく label は OS によって event 発行形式が異なるためフックして独自イベントで対応する.
         * また flipswitch は内部で click を発行しているが、vclick に変更する.
         */

        const _getAllSwitches = (): JQuery => {
            return $ui.find(".ui-flipswitch");
        };

        const _getInputFromSwitch = ($switch: JQuery): JQuery => {
            const $input = $switch.find("input");
            if ($input.length) {
                return $input;
            }
            const $select = $switch.find("select");
            if ($select.length) {
                return $select;
            }
            return null;
        };

        const _change = ($input: JQuery, to: boolean): void => {
            if ($input) {
                if ("INPUT" === $input[0].nodeName) {
                    $input.prop("checked", to).flipswitch("refresh");
                } else if ("SELECT" === $input[0].nodeName) {
                    $input.val(to ? "on" : "off").flipswitch("refresh");
                }
            }
        };

        const _getLabelsFromSwitch = ($switch: JQuery): JQuery => {
            const $input = _getInputFromSwitch($switch);
            if ($input) {
                const labels = (<any>$input[0]).labels;
                if (labels) {
                    return $(labels);
                }
            }
            return $();
        };

        const _getSwitchFromLabel = ($label: JQuery): JQuery => {
            const name = $label.attr("for");
            return _getAllSwitches().find("[name='" + name + "']");
        };

        _getAllSwitches()
            .on("vclick _change_flipswich", (event: JQuery.Event) => {
                const $switch = $(event.currentTarget);
                const $target = $(event.target);
                const $input = _getInputFromSwitch($switch);
                const changeTo = !$switch.hasClass("ui-flipswitch-active");

                if ($target.hasClass("ui-flipswitch-input")) {
                    _change($input, changeTo);
                } else if ($target.hasClass("ui-flipswitch-on")) {
                    if (Framework.Platform.Mobile && Framework.Patch.isSupportedVclick()) {
                        _change($input, changeTo);
                        event.preventDefault();
                    }
                }
            })
            .each((index: number, flipswitch: Element) => {
                _getLabelsFromSwitch($(flipswitch))
                    .on("vclick", (event: JQuery.Event) => {
                        const $switch = _getSwitchFromLabel($(event.target));
                        if (!$switch.parent().hasClass("ui-state-disabled")) {
                            $switch.trigger("_change_flipswich");
                        }
                        event.preventDefault();
                    });
            });

        return $ui;
    }

    // 登録
    ExtensionManager.registerDomExtension(applyDomExtension);
}
