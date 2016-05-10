import Backbone = require("backbone");
import { toZeroPadding } from "cdp/tools";

/**
 * @class ListItemModel
 * @brief リスト要素を構成する Backbone.Model クラス
 */
export class ListItemModel extends Backbone.Model {

    private static s_uniqueId = 0;

    //! constructor
    constructor(attributes?: any) {
        super($.extend({}, { devId: ListItemModel.makeDevId() }, attributes), null);
    }

    //! returns default value.
    defaults() {
        return {
            devId: "devId:none",
            index: null,
            height: 0,
        };
    }

    //! devId factory mehtod.
    private static makeDevId(): string {
        let devId = "devId:" + toZeroPadding(ListItemModel.s_uniqueId, 8);
        ListItemModel.s_uniqueId++;
        return devId;
    }
}


//___________________________________________________________________________________________________________________//


/**
 * @class ListItemCollection
 * @brief ListItemModel を格納する Backbone.Collection クラス
 */
export class ListItemCollection extends Backbone.Collection<ListItemModel> {
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
        let df = $.Deferred();
        let reset = options ? options.reset : false;

        setTimeout(() => {
            let startIndex = reset ? 0 : this.models.length;
            let oldModels: ListItemModel[] = reset ? [] : this.models;
            let models: ListItemModel[] = [];
            let model: ListItemModel;
            let opt = $.extend({}, { addedModels: reset || this.comparator ? null : models }, options);

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
