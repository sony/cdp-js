import {
    PromiseManager,
    toUrl,
} from "cdp/framework";
import {
    JST,
    getTemplate,
    ListItemView,
    ListItemViewOptions,
} from "cdp/ui";
import { handleErrorInfo } from "../../utils/error-defs";
import ImageContent from "../../model/image-content";

const TAG = "[view.tabviews-sample.LocalContentListItemView] ";

/**
 * @interface LocalContentListItemViewOptions
 * @brief LocalContentListItemView の構築オプション
 */
export interface LocalContentListItemViewOptions extends ListItemViewOptions<ImageContent> {
    models: ImageContent[];
}

//___________________________________________________________________________________________________________________//

/**
 * @class LocalContentListItemView
 * @brief ローカルフォトコンテンツ用 ListItemView
 */
export class LocalContentListItemView extends ListItemView<ImageContent> {

    private _prmsManager: PromiseManager;
    private _template: JST = null;
    private _models: ImageContent[] = [];

    /**
     * constructor
     *
     * @param options [in] オプション
     */
    constructor(options?: LocalContentListItemViewOptions) {
        super(options);
        this._prmsManager = new PromiseManager();
        this._template = getTemplate("#template-tabview-listitemview", toUrl("/templates/tabviews-sample/tabview-templates.html"));
        this._models = options.models || [];
        this.render();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: ListItemView

    // 描画
    render(): LocalContentListItemView {
        if (null != this.$el && !this.hasChildNode()) {
            const $line = $(this._template(this.makeTemplateParam()));
            $line.height(this.$el.height());
            $line.find(".ui-ripple").ripple();
            this.$el.append($line);
            this.updateThumbnail();
        }
        return this;
    }

    // 破棄
    remove(): LocalContentListItemView {
        this._prmsManager.cancel();
        return <LocalContentListItemView>super.remove();
    }

    ///////////////////////////////////////////////////////////////////////
    // private methods

    // template に設定する JSON オブジェクトを作成
    private makeTemplateParam(): object {
        return {
            items: this._models,
        };
    }

    // サムネイルの更新
    private updateThumbnail(): void {
        this._models.forEach((model: ImageContent) => {
            this._prmsManager.add(model.getThumbnail())
                .done((src: string) => {
                    this.$el
                        .find(`[data-content-key='${model.key}']`)
                        .children()
                        .each((index: number, element: Element) => {
                            const $target = $(element);
                            if ($target.hasClass("fade-in")) {
                                $target.removeClass("fade-in");
                            } else {
                                $target.css("background-image", `url('${src}')`);
                                $target.addClass("fade-in");
                            }
                        });
                })
                .fail((error) => {
                    handleErrorInfo(error);
                });
        });
    }
}
