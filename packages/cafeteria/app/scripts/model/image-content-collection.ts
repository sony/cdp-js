import {
    makePromise,
    Model,
    Collection,
} from "cdp/framework";
import {
    LocalContentProvider,
    AssetsContentProvider,
    Content,
    ContentList,
} from "cafeteria.images";
import ImageContent from "./image-content";

const TAG = "[model.LocalContentCollection] ";

/**
 * @interface ImageContentsFetchOptions
 * @brief ImageContentCollection に指定可能な fetch オプション
 */
export interface ImageContentsFetchOptions extends Backbone.CollectionFetchOptions {
    queryIndex?: number;    // 取得開始 Index を指定 default: 0
    queryLimit?: number;    // 1回の query で制限する 取得コンテンツ数 default: 48
    autoFetch?: boolean;    // 自動全取得する場合は true
}

/**
 * @interface ImageContentResponse
 * @brief ImageContentCollection.fetch() のレスポンスインターフェイス
 */
export interface ImageContentResponse extends ContentList {
    models?: ImageContent[];    // 更新差分の LocalContent配列
}

//___________________________________________________________________________________________________________________//

interface IProvider {
    sync(method: string, collection: Collection<Model>, options?: Backbone.PersistenceOptions): JQueryXHR;
}

/**
 * @class ImageContentCollection
 * @brief ImageContent を格納する Backbone.Collection クラス
 */
export class ImageContentCollection extends Collection<ImageContent> {

    // Collection に Model の型情報を指定
    model = ImageContent;

    private _totalContentCount: number;
    private _provider: IProvider;

    constructor(kind: "local" |"assets") {
        super();
        switch (kind) {
            case "local":
                this._provider = LocalContentProvider;
                break;
            case "assets":
            default:
                this._provider = AssetsContentProvider;
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
    fetch(options?: ImageContentsFetchOptions): JQueryXHR {
        const df = $.Deferred();
        const promise = makePromise(df);

        const opt = $.extend({}, { remove: false }, options);

        opt.success = (self: ImageContentCollection, resp: ContentList, fetchOptions: ImageContentsFetchOptions) => {
            if (resp) {
                this._totalContentCount = resp.totalContentCount;
                (<ImageContentResponse>resp).models = this.slice(this.length - resp.contents.length);
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
     * Provider からのコンテンツ供給
     */
    sync(...args: any[]): JQueryXHR {
        return this._provider.sync(args[0], args[1], args[2]);
    }
}
