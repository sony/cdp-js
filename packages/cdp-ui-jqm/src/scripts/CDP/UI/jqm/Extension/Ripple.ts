/**
 * jQuery plugin definition
 */
interface JQuery {
    ripple(options?: CDP.UI.DomExtensionOptions): JQuery;
}

namespace CDP.UI.Extension {

    import Framework = CDP.Framework;

    // jQuery plugin
    $.fn.ripple = function (options?: DomExtensionOptions): JQuery {
        const $el = $(this);
        if ($el.length <= 0) {
            return $el;
        }
        return $el.on(Framework.Patch.s_vclickEvent, function (event: JQuery.Event) {
            const surface = $(this);

            // create surface if it doesn't exist
            if (surface.find(".ui-ripple-ink").length === 0) {
                surface.prepend("<div class='ui-ripple-ink'></div>");
            }

            let ink = surface.find(".ui-ripple-ink");

            // stop the previous animation
            ink.removeClass("ui-ripple-animate");

            // ink size:
            if (!ink.height() && !ink.width()) {
                const d = Math.max(surface.outerWidth(), surface.outerHeight());
                ink.css({ height: d, width: d });
            }

            const x = event.pageX - surface.offset().left - (ink.width() / 2);
            const y = event.pageY - surface.offset().top - (ink.height() / 2);

            const rippleColor = surface.data("ripple-color");

            // animation end handler
            const ANIMATION_END_EVENT = "animationend webkitAnimationEnd";
            ink.on(ANIMATION_END_EVENT, function (ev: JQuery.Event) {
                ink.off();
                ink.removeClass("ui-ripple-animate");
                ink = null;
            });

            // set the position and add class .animate
            ink.css({
                top: y + "px",
                left: x + "px",
                background: rippleColor
            }).addClass("ui-ripple-animate");
        });
    };

    /**
     * Material Design Ripple 拡張
     *
     * @param {jQuery}              $ui       [in] 検索対象の jQuery オブジェクト
     * @param {DomExtensionOptions} [options] [in] オプション
     */
    function applyDomExtension($ui: JQuery, options?: DomExtensionOptions): JQuery {
        const NO_RIPPLE_CLASS = [
            ".ui-ripple-none",
            ".ui-flipswitch-on",
            ".ui-slider-handle",
            ".ui-input-clear",
        ];

        let selector = ".ui-btn";
        if ($ui.hasClass("ui-page")) {
            selector = ".ui-content .ui-btn"; // header は自動 ripple 化対象外
        }

        $ui.find(selector)
            .filter((index, elem) => {
                const $elem = $(elem);
                if ($elem.is(NO_RIPPLE_CLASS.join(","))) {
                    return false;
                } else {
                    return true;
                }
            })
            .addClass("ui-ripple");

        // ripplify
        $ui.find(".ui-ripple")
            .each((index: number, elem: Element) => {
                $(elem).ripple(options);
            });
        return $ui;
    }

    // 登録
    ExtensionManager.registerDomExtension(applyDomExtension);
}
