import { Model, Collection } from "cdp/framework";
import { toZeroPadding } from "cdp/tools";

const TAG = "[model.listview-sample..ListItemModel] ";

/**
 * @class ListItemModel
 * @brief リスト要素を構成する Backbone.Model クラス
 */
export class ListItemModel extends Model {

    private static s_uniqueId = 0;

    //! constructor
    constructor(attributes?: any) {
        super($.extend({}, { devId: ListItemModel.makeDevId() }, attributes), null);
    }

    //! returns default value.
    defaults(): any {
        return {
            devId: "devId:none",
            index: null,
            height: 0,
        };
    }

    //! devId factory mehtod.
    private static makeDevId(): string {
        const devId = "devId:" + toZeroPadding(ListItemModel.s_uniqueId, 8);
        ListItemModel.s_uniqueId++;
        return devId;
    }
}

//___________________________________________________________________________________________________________________//

/**
 * @class ListItemCollection
 * @brief ListItemModel を格納する Backbone.Collection クラス
 */
export class ListItemCollection extends Collection<ListItemModel> {
    // Backbone.Collection に対象の Model の型を与える。
    model = ListItemModel;

    private static s_baseItemHeight = 100;

    //! constructor
    constructor(model?: ListItemModel[]) {
        super(model);
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.Collection

    fetch(options?: Backbone.CollectionFetchOptions): JQueryXHR {
        const df = $.Deferred();
        const reset = options ? options.reset : false;

        setTimeout(() => {
            const startIndex = reset ? 0 : this.models.length;
            const oldModels: ListItemModel[] = reset ? [] : this.models;
            const models: ListItemModel[] = [];
            let model: ListItemModel;
            const opt = $.extend({}, { addedModels: reset || this.comparator ? null : models }, options);

            for (let i = 0; i < 100; i++) {
                model = new ListItemModel({
                    index: startIndex + i,
                    height: ListItemCollection.s_baseItemHeight,
                });
                models.push(model);
            }
            this.reset(oldModels.concat(models), opt);
            df.resolve();
        });

        return <JQueryXHR>df.promise();
    }
}
