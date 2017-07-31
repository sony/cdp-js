import {
    TabView,
    TabViewConstructionOptions,
    TabHostView,
    toUrl,
    getTemplate,
} from "cdp/ui";

const TAG = "[view.tabviews-sample.StaticView] ";

/**
 * @class StaticView
 * @brief TabView 用静的 View クラス.
 */
export class StaticView extends TabView {

    /**
     * constructor
     */
    constructor(options: TabViewConstructionOptions) {
        super(options);
    }

    ///////////////////////////////////////////////////////////////////////
    // Implements: TabView Events.

    // Scroller の初期化時にコールされる
    onInitialize(host: TabHostView, $root: JQuery): void {
        super.onInitialize(host, $root);
        this.render();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    // 描画
    render(): StaticView {
        if (this.$el) {
            const $template = $(
                getTemplate(
                    "#template-tabview-staticview",
                    toUrl("/templates/tabviews-sample/tabview-templates.html")
                )()
            );
            $template
                .localize()
                .appendTo(this.$el);
        }
        return this;
    }
}
