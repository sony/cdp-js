import { ErrorUtils } from "cdp/framework";
import {
    TabHostView,
    TabHostViewConstructOptions,
    TabViewContextOptions,
    ScrollerElement,
    Toast,
} from "cdp/ui";
import { handleErrorInfo } from "../../utils/error-defs";
import LocalContent from "../../model/local-content";
import { LocalContentCollection } from "../../model/local-content-collection";
import { ImageListView } from "./tab-image-listview";
import { TextileListView } from "./tab-textile-listview";
import { StaticView } from "./tab-static-view";

const TAG = "[view.tabviews-sample.SwipeableTabHostView] ";

/**
 * @class SwipeableTabHostViewConstructionOptions
 * @brief SwipeableTabHostView の構築オプション
 */
export interface SwipeableTabHostViewConstructionOptions extends TabHostViewConstructOptions<LocalContent> {
    localContentCollection: LocalContentCollection;
    textileCollection: LocalContentCollection;
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
                    ctor: ImageListView,
                    options: {
                        collection: options.localContentCollection,
                        scrollerFactory: ScrollerElement.getFactory(),
                        initialHeight: (options && options.initialHeight) ? options.initialHeight : undefined,
                    },
                },
                {
                    ctor: TextileListView,
                    options: {
                        collection: options.textileCollection,
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
    onContentSelected(target: LocalContent, kind: string): void {
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
