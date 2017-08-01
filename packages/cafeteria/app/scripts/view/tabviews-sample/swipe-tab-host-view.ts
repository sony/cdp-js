import { ErrorUtils } from "cdp/framework";
import {
    TabHostView,
    TabHostViewConstructOptions,
    TabViewContextOptions,
    ScrollerElement,
    Toast,
} from "cdp/ui";
import { handleErrorInfo } from "../../utils/error-defs";
import ImageContent from "../../model/image-content";
import { ImageContentCollection } from "../../model/image-content-collection";
import { LocalContentListView } from "./tab-local-content-listview";
import { AssetsContentListView } from "./tab-assets-content-listview";
import { StaticView } from "./tab-static-view";

const TAG = "[view.tabviews-sample.SwipeableTabHostView] ";

/**
 * @class SwipeableTabHostViewConstructionOptions
 * @brief SwipeableTabHostView の構築オプション
 */
export interface SwipeableTabHostViewConstructionOptions extends TabHostViewConstructOptions<ImageContent> {
    localContentCollection: ImageContentCollection;
    assetsContentCollection: ImageContentCollection;
    $staticRoot: JQuery;
}

type OptionsBase = { tabContexts: TabViewContextOptions };

/**
 * @class SwipeableTabHostView
 * @brief スワイプ可能な TabHostView クラス
 */
export class SwipeableTabHostView extends TabHostView {
    /**
     * constructor
     */
    constructor(options: SwipeableTabHostViewConstructionOptions) {
        super($.extend(<OptionsBase>{
            tabContexts: [
                {
                    ctor: LocalContentListView,
                    options: {
                        collection: options.localContentCollection,
                        scrollerFactory: ScrollerElement.getFactory(),
                        initialHeight: (options && options.initialHeight) ? options.initialHeight : undefined,
                    },
                },
                {
                    ctor: AssetsContentListView,
                    options: {
                        collection: options.assetsContentCollection,
                        scrollerFactory: ScrollerElement.getFactory(),
                        initialHeight: (options && options.initialHeight) ? options.initialHeight : undefined,
                    },
                },
                {
                    ctor: StaticView,
                    options: {
                        $el: options.$staticRoot,
                    },
                },
            ],
        }, options));
    }

    // コンテンツの選択時に呼ばれる
    onContentSelected(target: ImageContent, kind: string): void {
        if (target) {
            Toast.show(`${kind}: ${target.key}`);
        } else {
            handleErrorInfo(ErrorUtils.makeErrorInfo(
                ErrorUtils.RESULT_CODE.FAILED,
                TAG,
                "unexpected error. targetModel is null."
            ));
        }
    }
}
