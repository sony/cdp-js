import {
    makePromise,
    Model,
    Collection,
} from "cdp/framework";
import {
    LocalContentProvider,
    TextileProvider,
    Content,
    ContentList,
} from "cafeteria.images";
import LocalContent from "./local-content";

const TAG = "[model.LocalContentCollection] ";

/**
 * @interface LocalContentsFetchOptions
 * @brief LocalContentCollection に指定可能な fetch オプション
 */
export interface LocalContentsFetchOptions extends Backbone.CollectionFetchOptions {
    queryIndex?: number;    // 取得開始 Index を指定 default: 0
    queryLimit?: number;    // 1回の query で制限する 取得コンテンツ数 default: 48
    autoFetch?: boolean;    // 自動全取得する場合は true
}

/**
 * @interface LocalContentResponse
 * @brief LocalContentCollection.fetch() のレスポンスインターフェイス
 */
export interface LocalContentResponse extends ContentList {
    models?: LocalContent[];    // 更新差分の LocalContent配列
}

//___________________________________________________________________________________________________________________//

interface IProvider {
    sync(method: string, collection: Collection<Model>, options?: Backbone.PersistenceOptions): JQueryXHR;
}

/**
 * @class LocalContentCollection
 * @brief LocalContent を格納する Backbone.Collection クラス
 */
export class LocalContentCollection extends Collection<LocalContent> {

    // Collection に Model の型情報を指定
    model = LocalContent;

    private _totalContentCount: number;
    private _provider: IProvider;

    constructor(kind: "localcontent"|"textile") {
        super();
        switch (kind) {
            case "localcontent":
                this._provider = LocalContentProvider;
                break;
            case "textile":
            default:
                this._provider = TextileProvider;
                break;
        }
    }

    ///////////////////////////////////////////////////////////////////////
    // accesser

    // トータル数を取得 (fetch 前であれば undefined)
    public get totalCount(): number {
        return this._totalContentCount;
    }

    ///////////////////////////////////////////////////////////////////////
    // Override: Backbone.Collection

    /**
     * parse
     */
    parse(resp: ContentList): Content[] {
        return resp.contents;
    }

    /**
     * fetch
     */
    fetch(options?: LocalContentsFetchOptions): JQueryXHR {
        const df = $.Deferred();
        const promise = makePromise(df);

        const opt = $.extend({}, { remove: false }, options);

        opt.success = (self: LocalContentCollection, resp: ContentList, fetchOptions: LocalContentsFetchOptions) => {
            if (resp) {
                this._totalContentCount = resp.totalContentCount;
                (<LocalContentResponse>resp).models = this.slice(this.length - resp.contents.length);
                df.notify(resp);
            }
            if (opt.autoFetch && (this._totalContentCount !== this.length)) {
                promise.dependOn(super.fetch($.extend({}, opt, { queryIndex: this.length })));
            } else {
                df.resolve(resp);
            }
        };

        // first fetch
        return <any>promise.dependOn(super.fetch(opt));
    }

    /**
     * sync
     * NativeBridge.LocalContentProvider からのコンテンツ供給
     */
    sync(...args: any[]): JQueryXHR {
        return this._provider.sync(args[0], args[1], args[2]);
    }
}
