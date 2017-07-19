import {
    toUrl,
    View,
    PageContainerView,
    PageContainerViewOptions,
    Toast,
} from "cdp/ui";

const TAG = "[pmo.view.dashboard.AdView] ";

/**
 * @class AdView
 * @brief 広告 View 構成クラス
 *
 *        [注意]
 *        #dashboard-contents-area が覆いかぶさるため、このクラスでは DOM event は直接受け取れない。
 *        Dashboard 側から trigger() でメソッドを呼んでもらう構造になっている。
 */
export default class AdView extends PageContainerView {

    /**
     * constructor
     */
    constructor(options?: PageContainerViewOptions) {
        super(options);
        this.on("scrolled", this.onScroll);
        this.on("clicked", this.onClicked);
        this.render();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.View

    // 描画
    render(): View {
        const src = toUrl("/res/data/sample/image/pmo/dummy/idx_mainvisual_a7.png");
        this.$el.css("background-image", "url(" + src + ")");
        return this;
    }

    ///////////////////////////////////////////////////////////////////////
    // Event Handler

    /**
     * スクロールが発生した場合にコールされる
     * View.Dashboard が呼び出す。
     *
     * @param ratio {Number} [in] 50 - 100 の値
     */
    public onScroll(ratio: number): void {
        console.log(TAG + "ratio: " + ratio + "%");
    }

    // click ハンドラ
    private onClicked(): void {
        const url = "http://www.sony.jp/ichigan/";
        Toast.show("外部リンク: " + url);
    }
}
