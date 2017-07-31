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
import Textile from "../../model/local-content";

const TAG = "[view.tabviews-sample.TextileListItemView] ";

/**
 * @interface TextileListItemViewOptions
 * @brief TextileListItemViewOptions の構築オプション
 */
export interface TextileListItemViewOptions extends ListItemViewOptions<Textile> {
    models: Textile[];
}

//___________________________________________________________________________________________________________________//

/**
 * @class TextileListItemView
 * @brief テキスタイル用 ListItemView
 */
export class TextileListItemView extends ListItemView<Textile> {

    private _prmsManager: PromiseManager;
    private _template: JST = null;
    private _models: Textile[] = [];

    /**
     * constructor
     *
     * @param options {SelectTextileListItemViewOptions} [in] オプション
     */
    constructor(options?: TextileListItemViewOptions) {
        super(options);
        this._prmsManager = new PromiseManager();
        this._template = getTemplate("#template-tabview-listitemview", toUrl("/templates/tabviews-sample/tabview-templates.html"));
        this._models = options.models || [];
        this.render();
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: ListItemView

    // 描画
    render(): TextileListItemView {
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
    remove(): TextileListItemView {
        this._prmsManager.cancel();
        return <TextileListItemView>super.remove();
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
        this._models.forEach((model: Textile) => {
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
