/// <reference path="../../@types/jquery.mobile.d.ts" />
/* tslint:disable:max-line-length no-string-literal */

namespace CDP.Framework {

    import Promise = CDP.Promise;

    const TAG = "[CDP.Framework.Router] ";

    ///////////////////////////////////////////////////////////////////////
    // closure methods

    /**
     * @en Convert path to URL. <br>
     *     If the path starts from "/", the function translate the path as child folder of "web root". <br>
     *     Otherwise, it interprets as relative path from current page. <br>
     *     [Note] This behavior go along with jQM, NOT with require.toUrl().
     *
     * @ja path を URL に変換 <br>
     *     "/" から始まるものは web root から、それ以外は現在のページから絶対パスURLに変換する。 <br>
     *     jQM の挙動にあわせており、require.toUrl() と異なるので注意。
     *
     * @param path
     *  - `en` set relative path from [[webRoot]], or relative path from current scirpt owner html (It doesn't start from "/").
     *  - `ja` [[webRoot]] からの相対パス, もしくはカレントスクリプトを走らせている HTML からの相対パス ("/" なし).
     */
    export function toUrl(path: string): string {
        if (null != path[0] && "/" === path[0]) {
            return CDP.toUrl(path);
        } else {
            return $.mobile.path.makeUrlAbsolute(path, getCurrentDocumentUrl());
        }
    }

    /**
     * @en Get current document url.
     * @ja 現在表示しているドキュメントの URL を取得
     *
     * @internal
     */
    function getCurrentDocumentUrl(): string {
        const $activePage = (<any>$("body")).pagecontainer("getActivePage");
        if (null == $activePage) {
            return $.mobile.path.documentBase.hrefNoHash;
        }

        const base = $.mobile.path.documentBase.hrefNoHash;
        let url = $.mobile.activePage.closest(".ui-page").jqmData("url");

        if (!url || !$.mobile.path.isPath(url)) {
            url = base;
        }

        return $.mobile.path.makeUrlAbsolute(url, base);
    }

    /**
     * @en Default "before route change" handler.
     * @ja 既定の "before route change" ハンドラ
     *
     * @internal
     */
    let _beforeRouteChange = (): IPromiseBase<any> => {
        return Promise.resolve();
    };

    // default "before route change" hanndler
    const _defaultBeforeRouteChange = _beforeRouteChange;

    /**
     * @en Setup "before route change" handler.
     * @ja "before route change" ハンドラ設定
     *
     * @internal
     *
     * @param
     *  - `en` handler function.
     *  - `ja` handler 指定.
     * @returns
     *  - `en` old handler function.
     *  - `ja` 以前の handler.
     */
    export function setBeforeRouteChangeHandler(handler: () => IPromiseBase<any>): () => IPromiseBase<any> {
        if (null == handler) {
            return _beforeRouteChange;
        } else {
            const oldHandler = _beforeRouteChange;
            _beforeRouteChange = handler;
            return oldHandler;
        }
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @en initialize option definition.
     * @ja 初期化オプション
     *
     * @internal
     */
    export interface InitOptions {
        /**
         * @en true: supports implicit anchor "vclick".
         * @ja true: 暗黙の anchor vclick をサポート
         */
        anchorVclick?: boolean;

        /**
         * @en judge the transition is first page's.
         * @ja 初期ページトランジションであるか判定
         */
        firstPageTransition?: boolean;
    }

    /**
     * @en Management info for page. <br>
     *     This interface role is not same as Backbone.Router.routes. <br>
     *     Using for resolving relation a known fragment value and a page path.
     *
     * @ja ページ管理情報 <br>
     *     Backbone.Router.routes と同じ役割ではない。 <br>
     *     遷移したことがあるフラグメント値とページのパスの解決に使用される。
     *
     * @internal
     */
    interface RouteContext {
        route: string;
        regexp: RegExp;
        page: string;
        top: boolean;
        callback: (...args: any[]) => boolean;
    }

    /**
     * @en Stored additional info interface on navigate.
     * @ja ページ遷移に関する付加情報を格納するインターフェイス
     *
     * @internal
     */
    interface NavigateInfo {
        url?: string;
        transition?: string;
        reverse?: boolean;
        backDestination?: string;
        noHashChange?: boolean;
        intent?: Intent;
        // status params
        positiveNavigate?: boolean;
        calledBeforeRouteChange?: boolean;
        inNavigation?: boolean;
        inAdditionalBack?: boolean;
    }

    /**
     * @en Extened SubFlowParam interface in Framework use.
     * @ja Framework が使用する SubFlowParam 拡張インターフェイス
     *
     * @internal
     */
    interface SubFlowParamEx extends SubFlowParam {
        additionalDistance?: number;
    }

    //___________________________________________________________________________________________________________________//

    /**
     * @en Router class for adjusting jQueryMobile functions and Backbone.Router functions. <br>
     *     Even if Backbone.Router does not start routing, natigate() method works good with jQM framework.
     *
     * @ja jQueryMobile と Backbone.Router を調停する Router クラス <br>
     *     ルーティングを開始していない場合にも、navigate() は jQM フレームワークを使用して機能する。
     */
    export class Router {

        private static s_initOptions: InitOptions = {};
        private static s_router: Backbone.Router = null;
        private static s_rootContexts: Object = {};
        private static s_lastNavigateInfo: NavigateInfo = {};
        private static s_lastClickedTime: number = null;
        private static s_lastIntent: Intent = {};
        private static s_firstChangePage: boolean = true;
        private static s_loadUrl: (fragment: string) => boolean = null;
        private static s_back: () => void = null;
        private static DELAY_TIME = 200;        // TBD: 暫定値
        private static DATA_BACK_DESTINATION = "data-back-dst";
        private static DATA_NO_HASH_CHANGE = "data-no-hash-change";
        private static DATA_NO_VCLICK_HANDLE = "data-no-vclick-handle";
        private static BACK_DESTINATION_URL = "backDstUrl";
        private static SUBFLOW_PARAM = "subFlowParam";

        private static s_defaultInitOptions: InitOptions = {
            anchorVclick: true,
            firstPageTransition: false,
        };

        private static s_defaultNavigateOptions: NavigateOptions = {
            trigger: true,
            replace: false,
            intent: null,
        };

        ///////////////////////////////////////////////////////////////////////
        // public static methods

        /**
         * @en for initialize Router. this function is called in framework.
         * @ja この関数はフレームワーク内部で使用される。
         *
         * @internal
         *
         * @param  options
         *  - `en` init options
         *  - `ja` 初期化オプション
         * @returns
         *  - `en` true: succeeded / false: failed.
         *  - `ja` true: 成功 / 失敗
         */
        public static _initialize(options: InitOptions): boolean {
            const $body = $("body");
            if (!!Router.s_router) {
                console.warn(TAG + "logic error. initialize call twice.");
                return false;
            }

            Router.s_initOptions = $.extend({}, Router.s_defaultInitOptions, options);
            if (Router.s_initOptions.firstPageTransition) {
                Router.s_firstChangePage = false;
            }

            // Backbone.Router が、route を解決できなかった場合にも通知を捕捉するためのコールバックを設定
            Router.s_loadUrl = _.bind(Backbone.history.loadUrl, Backbone.history);
            Backbone.history.loadUrl = Router.customLoadUrl;
            Router.s_router = new Backbone.Router();
            Router.s_router.on("route", Router.onRouteSucceeded);

            // Backbone.Router を使用している場合、$.mobile.back() の挙動をブラウザの[戻る]に統一
            if (!$.mobile.hashListeningEnabled) {
                Router.s_back = _.bind($.mobile.back, $.mobile);
                $.mobile.back = Router.customJqmBack;
            }

            // changePage をサポート
            if (null == $.mobile.changePage) {
                $.mobile.changePage = (to: any, opt?: ChangePageOptions): void => {
                    (<any>$body).pagecontainer("change", to, opt);
                };
            }

            Router.bindEvents();
            // Framework のイベントハンドラを更新
            Framework._setupEventHandlers();

            return true;
        }

        /**
         * @en Register to Router.
         * @ja Router への登録.
         *
         * @param route
         *  - `en` route string, it can be regular expression.
         *  - `ja` ルーティング文字列 / 正規表現
         * @param page
         *  - `en` page template path.
         *  - `ja` page template path. イベント名にも使用される
         * @param top
         *  - `en` set "true" if application's top view. (optional)
         *  - `ja` Top ページの場合は true を指定 (任意)
         * @param callback
         *  - `en` callback for custom page transition. If you don't want to trigger jQM.changePage(), return true by this callback. (optional)
         *  - `ja` 遷移を自身で管理する場合に指定し、戻り値を true に設定すると changePage をコールしない (任意)
         * @returns
         *  - `en` Router instance.
         *  - `ja` インスタンス。ただし method chain をしたい場合は、any cast が必要。
         */
        public static register(route: string, page: string, top: boolean = false, callback?: (...args: any[]) => boolean): Router {
            // Backbone.Router への登録は history の停止が必要
            const restart = Router.stop();

            const name = route + page;
            const context: RouteContext = {
                route: route,
                regexp: (<any>Router.s_router)._routeToRegExp(route),
                page: page,
                top: top,
                callback: callback || function () { return false; }
            };

            if (Router.pushContext(name, context)) {
                Router.s_router.route(route, name, () => {/* noop */ });
            }

            if (restart) {
                // 再開時は再読み込みしない。
                Router.start({ silent: true, pageConstruct: false });
            }

            return Router;
        }

        /**
         * @en Start listening hash change. <br>
         *     It should be called after register().
         *
         * @ja 履歴監視の開始 <br>
         *     登録完了後にクライアントが呼ぶことでページ遷移が開始される。
         *
         * @param options
         *  - `en` options object for Backbone.History.
         *  - `ja` Backbone.History にわたるオプション
         */
        public static start(options?: RouterOptions): void {
            const opt = $.extend({ pageConstruct: true }, options);
            if (opt.pageConstruct) {
                Framework.constructPages();
            }
            if ($.mobile.hashListeningEnabled) {
                console.error(TAG + "setting error. confict: $.mobile.hashListeningEnabled = true, cannot start.");
                return;
            }
            Backbone.history.start(opt);
        }

        /**
         * @en Stop listening hash change.
         * @ja 履歴監視の停止
         *
         * @returns
         *  - `en` previous status.
         *  - `ja` 以前の開始状態を返却
         */
        public static stop(): boolean {
            const prevState = (<any>Backbone.History).started;
            Backbone.history.stop();
            return prevState;
        }

        /**
         * @en Check routing status.
         * @ja ルーティングを開始しているか判定
         *
         * @returns
         *  - `en` true: routing / false: not routing
         *  - `en` true: 有効 / false: 無効
         */
        public static isRouting(): boolean {
            return (<any>Backbone.History).started;
        }

        /**
         * @en URL navigation.
         * @ja URL遷移
         *
         * @param url
         *  - `en` set a navigate URL. (relative path / absolute path / fragment)
         *  - `ja` 遷移 URL を指定 (相対パス/絶対パス/フラグメント)
         * @param transition
         *  - `en` set a transition string.
         *  - `ja` transition に使用する effect を指定
         * @param reverse
         *  - `en` set a direction string for transition. true:reverse / false:nomal
         *  - `ja` transition に使用する direction を指定 true:reverse/false:通常
         * @param options
         *  - `en` set a options object for Backbone.Router.navigate().
         *  - `ja` Backbone.Router.navigate() に渡されるオプション
         */
        public static navigate(url: string, transition?: string, reverse?: boolean, options?: NavigateOptions): void {
            if (!!Router.s_lastNavigateInfo.inNavigation) {
                // すでに Navigation 中であれば抑止
                console.warn(TAG + "Router.navigate() called in navigation proc.");
                return;
            } else if (Router.initFirstPageIfNeeded(url)) { // autoInitializePage が指定されていないとき
                return;
            }

            const navOptions: NavigateOptions = $.extend({}, Router.s_defaultNavigateOptions, options);

            // ページ遷移開始通知. Sub Flow にてすでにコールされている場合は既定の何もしないコールバックを使用する.
            const notifyBeforeRouteChange = Router.s_lastNavigateInfo.calledBeforeRouteChange ? _defaultBeforeRouteChange : _beforeRouteChange;

            Router.s_lastNavigateInfo = {
                url: url,
                transition: transition,
                reverse: reverse,
                backDestination: navOptions.backDestination,
                noHashChange: navOptions.noHashChange,
                intent: navOptions.intent || {},
                positiveNavigate: true,
                calledBeforeRouteChange: true,
                inNavigation: true,
            };

            // ページ遷移開始通知
            notifyBeforeRouteChange()
                .fail(() => {
                    // beforeRouteChange() が失敗した場合、致命的な不具合となるため、error 記録のみにして先に進む。
                    console.error(TAG + "before route change call, failed.");
                })
                .always(() => {
                    if (Router.isRouting() && !Router.s_lastNavigateInfo.noHashChange) {
                        if (navOptions.subFlow) {
                            switch (navOptions.subFlow.operation) {
                                case "begin":
                                    Router.startSubFlow(navOptions.subFlow);
                                    break;
                                case "end":
                                    Router.finishSubFlow(navOptions);
                                    return; // navigation は呼ばない
                                default:
                                    console.warn(TAG + "unknown subFlow.operation. operation: " + navOptions.subFlow.operation);
                                    break;
                            }
                        }
                        const result = Backbone.history.navigate(url, navOptions);
                        // Backbone.history.loadUrl() がコールされなかった場合, navigation 終了
                        if (!result || "string" === typeof result) {
                            Router.s_lastNavigateInfo.inNavigation = false;
                        }
                    } else {
                        if (navOptions.subFlow) {
                            console.warn(TAG + "subFlow only supported under routing and hash change condition.");
                        }
                        const fragment = Backbone.history.getFragment(url);
                        let context: RouteContext;
                        if (Router.s_lastNavigateInfo.noHashChange) {
                            // noHashChange が指定されたとき
                            context = <RouteContext>_.find(<any>Router.s_rootContexts, (ctx: any) => {
                                return ctx.regexp.test(fragment);
                            });
                        } else {
                            // Backbone.Router が有効でないとき
                            context = <RouteContext>_.findWhere(<any>Router.s_rootContexts, { route: fragment });
                        }
                        if (context) {
                            url = context.page;
                        }
                        Router.changePage(url);
                    }
                });
        }

        /**
         * @en Navigate from Top Page. <br>
         *     If SubFlow set up, the param is cleared.
         *
         * @ja トップページからの画面遷移 <br>
         *     SubFlow が指定されていた場合はクリアされる
         * @param to
         *  - `en` set a navigate URL or PageStackOptions object or array.
         *  - `ja` 遷移 URL / PageStackOptions オブジェクト/配列
         * @param transition
         *  - `en` set a transition string
         *  - `ja` transition に使用する effect を指定
         * @param reverse
         *  - `en` set a direction string for transition. true:reverse / false:nomal
         *  - `ja` transition に使用する direction を指定 true:reverse/false:通常
         * @param options
         *  - `en` set a options object for Backbone.Router.navigate().
         *  - `ja` Backbone.Router.navigate() に渡されるオプション
         */
        public static navigateFromTop(
            to?: string | PageStack | PageStack[],
            transition?: string,
            reverse?: boolean,
            options?: NavigateOptions
        ): void {
            const stack = Router._getJqmHistory().stack;
            const currentPage = stack[Router._getJqmHistory().activeIndex];
            const _transition = transition || currentPage.transition;
            const _reverse = (null != reverse) ? reverse : true;
            const destStacks: PageStack[] = ((): PageStack[] => {
                if (!to) {
                    return null;
                } else if ("string" === typeof to) {
                    return <PageStack[]>[{ route: to }];
                } else if (to instanceof Array) {
                    return to;
                } else {
                    return <PageStack[]>[to];
                }
            })();

            // 指定された SubFlow を削除
            stack.forEach((value) => {
                delete value[Router.SUBFLOW_PARAM];
            });

            // 初期ページに SubFlow パラメータを指定
            stack[0][Router.SUBFLOW_PARAM] = {
                operation: "begin",
                destBase: stack[0].hash,    // 初期ページのハッシュ
                destStacks: destStacks,
                additionalDistance: 0,
            };

            Router.navigate(null, _transition, _reverse, $.extend({}, options, {
                subFlow: {
                    operation: "end",
                }
            }));
        }

        /**
         * @ en Back to previous history. <br>
         *      It's same as browser back button's behaviour. <br>
         *      [Note] If set the jQM: data-rel="back", work as well.
         *
         * @ja 履歴を戻る <br>
         *     ブラウザの戻るボタンと同じ挙動。 <br>
         *     jQM: data-rel="back" を指定しても同じであることに注意。
         */
        public static back(): void {
            if (!!Router.s_lastNavigateInfo.inNavigation) {
                // すでに Navigation 中であれば抑止
                console.warn(TAG + "Router.back() called in navigation proc.");
                return;
            } else if (Router.isTopPage()) {
                // Top ページに指定されていれば終了
                const app = (<any>navigator).app || {};
                if (!!app.exitApp) {
                    app.exitApp();    // note: never exit on iOS
                    return;
                }
            }

            Router.s_lastNavigateInfo = {
                inNavigation: true,
                calledBeforeRouteChange: true,
            };

            // ページ遷移開始通知
            _beforeRouteChange()
                .then(() => {
                    $.mobile.back();
                })
                .fail(() => {
                    console.error("before route change call, failed.");
                    Router.s_lastNavigateInfo = {};
                });
        }

        /**
         * @en Store Intent object by framwork.
         * @ja Intent を格納。 フレームワークが使用する。
         *
         * @internal
         */
        public static _pushIntent(intent: Intent): void {
            Router.s_lastIntent = $.extend(true, Router.s_lastIntent, intent);
        }

        /**
         * @en Get Intent object by framework.
         * @ja Intent を取得。フレームワークが使用する。
         *
         * @internal
         */
        public static _popIntent(): Intent {
            const intent = Router.s_lastIntent;
            Router.s_lastIntent = {};
            return intent;
        }

        /**
         * @en Get query parameters. <br>
         *     It can be accessed during "pagebeforecreate" to "pagechange".
         * @ja query parameter に指定された引数の取得 <br>
         *     ページ遷移中にのみアクセス可能 (pagebeforecreate ～ pagechange)
         */
        public static getQueryParameters(): any {
            if (Router.s_lastNavigateInfo.intent && Router.s_lastNavigateInfo.intent.params) {
                return Router.s_lastNavigateInfo.intent.params["queryParams"];
            } else {
                return null;
            }
        }

        /**
         * @en Begin sub flow transaction.
         * @ja sub flow トランザクションの開始
         *
         * @param url
         *  - `en` set a navigate URL. (relative path / absolute path / fragment)
         *  - `ja` 遷移 URL を指定 (相対パス/絶対パス/フラグメント)
         * @param options
         *  - `en` set a options object for Backbone.Router.navigate().
         *  - `ja` Backbone.Router.navigate() に渡されるオプション
         * @param transition
         *  - `en` set a transition string
         *  - `ja` transition に使用する effect を指定
         * @param reverse
         *  - `en` set a direction string for transition. true:reverse / false:nomal
         *  - `ja` transition に使用する direction を指定 true:reverse/false:通常
         */
        public static beginSubFlow(url: string, options: NavigateOptions, transition?: string, reverse?: boolean): void {
            const opt: NavigateOptions = $.extend({}, options);
            opt.subFlow = opt.subFlow || { operation: "begin" };
            if ("begin" !== opt.subFlow.operation) {
                console.error(TAG + "logic error. invalid subflow operation. [operation: " + opt.subFlow.operation + "]");
                return;
            }
            Router.navigate(url, transition, reverse, opt);
        }

        /**
         * @en Commit sub flow transaction.
         * @ja sub flow トランザクションの終了
         *
         * @param transition
         * - `en` set a transition string
         * - `ja` transition に使用する effect を指定
         * @param reverse
         * - `en` set a direction string for transition. true:reverse / false:nomal
         * - `ja` transition に使用する direction を指定 true:reverse/false:通常
         */
        public static commitSubFlow(transition?: string, reverse?: boolean): void {
            Router.navigate(null, transition, reverse, {
                subFlow: {
                    operation: "end",
                }
            });
        }

        /**
         * @en Cancel sub flow transaction.
         * @ja sub flow トランザクションのキャンセル
         *
         * @param transition
         *  - `en` set a transition string
         *  - `ja` transition に使用する effect を指定
         * @param reverse
         *  - `en` set a direction string for transition. true:reverse[default] / false:nomal
         *  - `ja` transition に使用する direction を指定 true:reverse[既定]/false:通常
         */
        public static cancelSubFlow(transition?: string, reverse?: boolean): void {
            // 起点のページに戻る
            const baseInfo = Router.detectSubFlowBaseInfo();
            baseInfo.subFlowParam.additionalDistance = 0;
            Router.navigate(null, transition,
                (null != reverse) ? reverse : true,
                {
                    subFlow: {
                        operation: "end",
                        destStacks: null,
                    }
                });
        }

        /**
         * @en Check in sub flow.
         * @ja sub flow 内であるか判定
         */
        public static isInSubFlow(): boolean {
            const stack = Router._getJqmHistory().stack;
            const has = _.some(stack, (value) => {
                return !!value[Router.SUBFLOW_PARAM];
            });
            return has;
        }

        /**
         * @en Check from hash changed navigation.
         * @ja Hash 変更によって Navigate が起こったか判定. "pagechange" が発生するまでに判定可能
         */
        public static fromHashChanged(): boolean {
            // positiveNavigate = false は含めない
            return Router.s_lastNavigateInfo.inNavigation && (null == Router.s_lastNavigateInfo.positiveNavigate);
        }

        /**
         * @en Register page stack. <br>
         *     Set registered route(s) to add to page stack on the basis of the present stack position.
         *
         * @ja ページスタック登録 <br>
         *     登録済みの route を指定して、現在の位置を基点にページスタックに登録
         *
         * @param pageStack
         *  - `en` PageStackOptions object or array.
         *  - `ja` PageStackOptions オブジェクト/配列
         * @param withNavigate
         *  - `en` true: with navigate final stack. (default) / false: not navigate.
         *  - `ja` true: 最後のスタックに対してページ遷移する. (default) / false: ページ遷移しない.
         * @param options
         *  - `en` set a options object for Backbone.Router.navigate().
         *  - `ja` Backbone.Router.navigate() に渡されるオプション
         * @returns
         *  - `en` true: succeeded / false: failed
         *  - `ja` true: 成功 / false: 失敗。
         */
        public static registerPageStack(pageStack: PageStack, withNavigate?: boolean, options?: NavigateOptions): boolean;
        public static registerPageStack(pageStack: PageStack[], withNavigate?: boolean, options?: NavigateOptions): boolean;
        public static registerPageStack(pageStack: any, withNavigate?: boolean, options?: NavigateOptions): boolean {
            const newStacks = [];
            let failed = false;

            pageStack = (pageStack instanceof Array) ? pageStack : [pageStack];
            withNavigate = (null == withNavigate) ? false : withNavigate;

            (() => {
                const makeStack = (info: PageStack): any => {
                    let url: string;

                    const fragment = Backbone.history.getFragment(info.route);
                    const context = <RouteContext>_.find(<any>Router.s_rootContexts, (ctx: any) => {
                        return ctx.regexp.test(fragment);
                    });
                    if (!context) {
                        console.warn(TAG + "route is not registered. route: " + info.route);
                        return null;
                    } else {
                        url = Router.pathToJqmDataUrl(context.page);
                    }

                    const stack = {
                        route: info.route,
                        pageUrl: url,
                        title: info.title,
                        transition: info.transition,
                        url: url,
                    };
                    return stack;
                };

                for (let i = 0, n = pageStack.length; i < n; i++) {
                    const stack = makeStack(pageStack[i]);
                    if (!stack) {
                        failed = true;
                        break;
                    } else {
                        newStacks.push(stack);
                    }
                }
            })();

            if (failed) {
                return false;
            }

            (() => {
                // Router の停止
                let restart = Router.stop();
                const silentLength = newStacks.length - 1;
                const finalIndex = newStacks.length - 1;

                Router._getJqmHistory().clearForward();

                for (let i = 0, n = silentLength; i < n; i++) {
                    location.hash = newStacks[i].route;
                    Router._getJqmHistory().stack.push(newStacks[i]);
                    Router._getJqmHistory().activeIndex = Router._getJqmHistory().stack.length - 1;
                }

                // final stack with navigate
                if (withNavigate) {
                    const transition = (() => {
                        if (null != Router.s_lastNavigateInfo.transition) {
                            return Router.s_lastNavigateInfo.transition;
                        } else {
                            return newStacks[finalIndex].transition;
                        }
                    })();

                    const reverse = (() => {
                        if (null != Router.s_lastNavigateInfo.reverse) {
                            return Router.s_lastNavigateInfo.reverse;
                        } else {
                            return false;
                        }
                    })();

                    restart = false;
                    Router.start({ silent: true });
                    Router.navigate(newStacks[finalIndex].route, transition, reverse, options);
                } else {
                    location.hash = newStacks[finalIndex].route;
                    Router._getJqmHistory().stack.push(newStacks[finalIndex]);
                    Router._getJqmHistory().activeIndex = Router._getJqmHistory().stack.length - 1;
                }

                // Router の再開
                if (restart) {
                    Router.start({ silent: true });
                }
            })();

            return true;
        }

        /**
         * @en Get jQM's history object
         * @ja jQM の History オブジェクトの取得
         *
         * @internal
         */
        public static _getJqmHistory(): any {
            return $.mobile.navigate.history;
        }

        ///////////////////////////////////////////////////////////////////////
        // private static methods

        /**
         * @en Override: Backbone.History.loadUrl().
         * @ja Backbone.History.loadUrl() のオーバーライド
         */
        private static customLoadUrl(fragment: string): boolean {
            const handled = Router.s_loadUrl(fragment);
            if (!handled) {
                Router.onRouteFailed(fragment);
            }
            return true;
        }

        /**
         * @en Override: $.mobile.back().
         *  - fail safe processing. <br>
         *    If using Backbone's Router, <br>
         *    this class unuses history object of jQuery Mobile 1.4, <br>
         *    and standardize as browser back button's behaviour. (jQM 1.3 comparable)
         *
         * @ja $.mobile.back() のオーバーライド
         *  - [TBD] fail safe 処理 <br>
         *    Backbone の Router を使用している場合、 <br>
         *    jQuery Mobile 1.4 以降の内部の History 管理は使用せずに <br>
         *    1.3 相当のブラウザの[戻る]の挙動に統一する。
         */
        private static customJqmBack(): void {
            if (Router.isRouting()) {
                history.back();
            } else {
                // jQM 既定処理
                Router.s_back();
            }
        }

        /**
         * \~english
         * Bind events.
         *
         * @private
         *
         * \~japanese
         * イベントバインド
         *
         * @private
         */
        private static bindEvents(): void {
            $(document)
                .one("pagechange", () => {
                    if (Router.s_initOptions.anchorVclick) {
                        // anchor vclick
                        $(document).on("vclick", "[href]", (event: JQuery.Event) => {
                            Router.onAnchorVclicked(event);
                        });
                    }
                })
                .on("pagebeforeshow", (event: JQuery.Event) => {
                    // "data-back-dst" を page に設定
                    if (null != Router.s_lastNavigateInfo.backDestination) {
                        const active: Object = Router._getJqmHistory().getActive();
                        active[Router.BACK_DESTINATION_URL] = Router.s_lastNavigateInfo.backDestination;
                    }
                })
                .on("pageshow", (event: JQuery.Event) => {
                    const active: Object = Router._getJqmHistory().getActive();
                    if (active[Router.SUBFLOW_PARAM]) {
                        delete active[Router.SUBFLOW_PARAM];
                    }
                })
                .on("pagechange pagecontainerloadfailed", (event: JQuery.Event) => {
                    Router.s_lastNavigateInfo = {};
                })
                ;

            // back key assign
            CDP.setBackButtonHandler(Router.back);
        }

        /**
         * @en Store the RootContext.
         * @ja RootContext の格納
         *
         * @param name
         *  - `en` name of route
         *  - `ja` route 名
         * @param context
         *  - `en` context object
         *  - `ja` context オブジェクト
         * @returns
         *  - `en` true: succeeded / false: already registered
         *  - `ja` true: 登録成功 / false: すでに登録されている
         */
        private static pushContext(name: string, context: RouteContext): boolean {
            if (!!Router.s_rootContexts[name]) {
                console.error(TAG + "logic error. route is already registered. name: " + name);
                return false;
            }
            Router.s_rootContexts[name] = context;
            return true;
        }

        /**
         * @en Check if $.mobile.initializePage() is called or not, and call it if needed.
         * @ja  $.mobile.initializePage() が呼ばれているか確認し、必要なら初期化する。
         *
         * @param url
         *  - `en` set a navigate URL. (relative path / absolute path / fragment)
         *  - `ja` 遷移 URL を指定 (相対パス/絶対パス/フラグメント)
         */
        private static initFirstPageIfNeeded(url: string): boolean {
            if (!$.mobile.autoInitializePage) {
                $(document).one("pagebeforechange", (event: JQuery.Event, data: any) => {
                    data.toPage = Framework.toUrl(url);
                });
                $.mobile.initializePage();
                $.mobile.autoInitializePage = true;
                return true;
            }
            return false;
        }

        /**
         * @en Check for current page is top.
         * @ja 現在のページが top に指定されているか判定
         *
         * @returns
         *  - `en` true: top page / false: not top page
         *  - `ja` true: top 指定 / false: top ではない
         */
        private static isTopPage(): boolean {
            const fragment = Backbone.history.getFragment($.mobile.path.parseUrl(location.href).hash);
            const context = <RouteContext>_.find(<any>Router.s_rootContexts, (ctx: any) => {
                return ctx.regexp.test(fragment);
            });
            return (null == context) ? false : context.top;
        }

        /**
         * @en Called when anchor received "vclick" event.
         * @ja anchor が vclick されたときにコールされる
         *
         * @returns
         *  - `en` true: need default processing / false: need custom processing
         *  - `ja` true: default 処理 / false: カスタム処理
         */
        private static onAnchorVclicked(event: JQuery.Event): boolean {
            if (Router.isJustBeforeVclicked()) {
                event.preventDefault();
                return false;
            }
            return Router.followAnchor(event);
        }

        /**
         * @en Anchor processing.
         * @ja anchor 処理
         */
        private static followAnchor(event: JQuery.Event): boolean {
            const $target = $(event.currentTarget);
            const url: string = $target.jqmData("href") || $target.attr("href");
            const transition: string = $target.jqmData("transition");
            const direction: string = $target.jqmData("direction");
            const backDst: any = $target.attr(Router.DATA_BACK_DESTINATION);
            const noHashChange: boolean = $target.attr(Router.DATA_NO_HASH_CHANGE) ?
                $target.attr(Router.DATA_NO_HASH_CHANGE) === "true" : false;
            const noHrefHandle: boolean = $target.attr(Router.DATA_NO_VCLICK_HANDLE) ?
                $target.attr(Router.DATA_NO_VCLICK_HANDLE) === "true" : false;

            /*
             * - 明示的にハンドルしない指定がある場合
             * - jQM のフラグメントの場合
             * 既定の処理を行う
             */
            if (noHrefHandle || Router.needDefaultOperation(url)) {
                return true;
            }

            // custom behavier
            event.preventDefault();

            if (Router.isBackButtonClicked(event)) {
                Router.back();
            } else {
                Router.navigate(url, transition, !!direction, { noHashChange: noHashChange, backDestination: backDst });
            }

            return false;
        }

        /**
         * @en Check default processing needed.
         * @ja 既定の処理を行わせるか判定
         *
         * @param  url
         *  - `en` url string
         *  - `ja` url 文字列
         * @returns
         *  - `en` true: need default processing / false: need not
         *  - `ja` true: 既定の処理が必要 / false: 不要
         */
        private static needDefaultOperation(url: string): boolean {
            if (!url || ("#" === url)) {
                return true;
            } else if ("#" === url[0]) {
                return !Router.canResolveRoute(url);
            } else {
                return false;
            }
        }

        /**
         * @en Check status of Backbone.Router if they can resolve route.
         * @ja Backbone.Router が route を解決可能か判定
         *
         * @param  url
         *  - `en` url string
         *  - `ja` url 文字列
         * @returns
         *  - `en` true: can resolve / false: can not
         *  - `ja` true: 解決可能 / false: 解決不可
         */
        private static canResolveRoute(url: string): boolean {
            const fragment = Backbone.history.getFragment(url);
            return _.any(Backbone.history.handlers, function (handler: any) {
                if (handler.route.test(fragment)) {
                    return true;
                }
            });
        }

        /**
         * @en Check "vclick" fired at the last minute.
         * @ja 直前に vclick が呼ばれたか判定
         */
        private static isJustBeforeVclicked(): boolean {
            const isBefore = (Date.now() - Router.s_lastClickedTime) < Router.DELAY_TIME * 2;
            Router.s_lastClickedTime = Date.now();
            return isBefore;
        }

        /**
         * @en Check back button clicked.
         * @ja Back Button がクリックされたか判定
         */
        private static isBackButtonClicked(event: JQuery.Event): boolean {
            if ($(event.currentTarget).jqmData("rel") === "back") {
                return true;
            } else {
                return false;
            }
        }

        /**
         * @en It called on succeed routing triggered by changing hash.
         * @ja ハッシュ値が変更され、ルーティングが成功したときにコールされる
         *
         * @param name
         *  - `en` name of route
         *  - `ja` route 名。page の値が渡る。
         * @param args
         *  - `en` array of paramter
         *  - `ja` パラメータ配列。
         */
        private static onRouteSucceeded(name: string, ...args: any[]): void {
            const context = <RouteContext>Router.s_rootContexts[name];
            if (!!context) {
                const intent = { params: { queryParams: args } };
                Router.s_lastNavigateInfo.inNavigation = true;
                if (null != Router.s_lastNavigateInfo.intent) {
                    intent.params = $.extend({}, intent.params, Router.s_lastNavigateInfo.intent.params || {});
                }
                Router.s_lastNavigateInfo.intent = $.extend({}, Router.s_lastNavigateInfo.intent, intent);
                const handled = context.callback(args);
                if (!handled) {
                    Router.changePage(context.page);
                }
            }
        }

        /**
         * @en It called on failed routing triggered by changing hash.
         * @ja ハッシュ値が変更され、ルーティングが失敗したときにコールされる
         *
         * @param name
         *  - `en` name of route
         *  - `ja` route 名。page の値が渡る。
         * @param args
         *  - `en` array of paramters
         *  - `ja` パラメータ配列。
         */
        private static onRouteFailed(fragment: string): void {
            Router.s_lastNavigateInfo.inNavigation = true;
            if (null == fragment) {
                fragment = Backbone.history.getFragment();
            }

            // route が解決できなかったものを管理下に
            if (Router.s_lastNavigateInfo.positiveNavigate) {
                let context = <RouteContext>Router.s_rootContexts[fragment];
                if (null == context) {
                    context = {
                        route: fragment,
                        regexp: (<any>Router.s_router)._routeToRegExp(fragment),
                        page: Router.s_lastNavigateInfo.url,
                        top: false,
                        callback: null,
                    };
                    Router.pushContext(fragment, context);
                }
            }

            // fragment から path を解決
            let path = fragment;
            if (null != Router.s_rootContexts[fragment]) {
                path = Router.s_rootContexts[fragment].page;
            }

            Router.changePage(path);
        }

        /**
         * @en This function just calls jQuery Mobile's navigation method.
         * @ja jQuery Mobile によるページ遷移指定
         *
         * @param path
         *  - `en` to page path
         *  - `ja` 遷移先パスを指定
         */
        private static changePage(path: string): void {
            let notifyBeforeRouteChange: () => IPromiseBase<any>;

            // data-rel="back", ブラウザボタン, H/W Back Key が押下されたとき
            if (!Router.s_lastNavigateInfo.positiveNavigate) {
                if (Router.s_lastNavigateInfo.inAdditionalBack) {
                    Router.s_lastNavigateInfo.inAdditionalBack = false;
                } else {
                    Router.decideDirection(path);
                    // 指定先に戻るか判定
                    const additional = Router.detectAdditionalBackDistance();
                    if (0 < additional) {
                        // 2回目以降の hash change には反応させない.
                        Router.s_lastNavigateInfo.inAdditionalBack = true;
                        Router._getJqmHistory().activeIndex -= additional;
                        history.go(-additional);
                        return;
                    }
                }

                // 遷移先が subflow 開始点である場合、param を削除
                const subFlowInfo = Router.detectSubFlowBaseInfo();
                if (subFlowInfo.isCurrent) {
                    delete subFlowInfo.stack[Router.SUBFLOW_PARAM];
                }
            } else {
                // 能動的遷移の場合 previousIndex を更新
                Router._getJqmHistory().previousIndex = Router._getJqmHistory().activeIndex;
            }

            // ページ遷移開始通知. すでにコールされている場合は既定の何もしないコールバックを使用する.
            notifyBeforeRouteChange = Router.s_lastNavigateInfo.calledBeforeRouteChange ? _defaultBeforeRouteChange : _beforeRouteChange;

            notifyBeforeRouteChange()
                .then(() => {
                    // 付加情報
                    if (Router.s_lastNavigateInfo.intent) {
                        Router._pushIntent(Router.s_lastNavigateInfo.intent);
                    }

                    Router.treatUrlHistory();

                    const pageTransition = (() => {
                        if (Router.s_lastNavigateInfo.transition) {
                            return Router.s_lastNavigateInfo.transition;
                        } else if (Router.s_firstChangePage) {
                            Router.s_firstChangePage = false;
                            return "none";  // splash からの遷移
                        } else {
                            return $.mobile.defaultPageTransition;
                        }
                    })();

                    $.mobile.changePage(Framework.toUrl(path), {
                        showLoadMsg: false,
                        allowSamePageTransition: true,
                        transition: pageTransition,
                        reverse: Router.s_lastNavigateInfo.reverse,
                        fromHashChange: !Router.s_lastNavigateInfo.positiveNavigate,
                        changeHash: !Router.s_lastNavigateInfo.noHashChange,
                    });
                })
                .fail(() => {
                    console.error(TAG + "before route change call, failed.");
                    Router.s_lastNavigateInfo = {};
                });
        }

        /**
         * @en Decide direction parameter. <br>
         *     It's as same as jQM internal implement. (imperfection)
         *
         * @ja direction の判定 <br>
         *     jQM の内部実装と等価 (不完全)
         *
         * @param path
         *  - `en` to page path
         *  - `ja` 遷移先パスを指定
         */
        private static decideDirection(path: string): void {
            const url = $.mobile.path.convertUrlToDataUrl(Framework.toUrl(path));

            if (null == Router.s_lastNavigateInfo.transition) {
                Router.s_lastNavigateInfo.transition = Router._getJqmHistory().getActive().transition;
            }

            Router._getJqmHistory().direct({
                url: url,
                present: function (newPage: any, direction: string) {
                    switch (direction) {
                        case "back":
                            if (null == Router.s_lastNavigateInfo.reverse) {
                                Router.s_lastNavigateInfo.reverse = true;
                            }
                            break;
                        case "forward":
                            if (null == Router.s_lastNavigateInfo.transition) {
                                Router.s_lastNavigateInfo.transition = newPage.transition;
                            }
                            break;
                        default:
                            console.warn(TAG + "unknown direction: " + direction);
                            break;
                    }
                },
                missing: () => {
                    // 初期ページ URL は判定できない。正常系。
                    if (1 === Router._getJqmHistory().activeIndex) {
                        Router._getJqmHistory().previousIndex = 1;
                        Router._getJqmHistory().activeIndex = 0;
                        if (null == Router.s_lastNavigateInfo.reverse) {
                            Router.s_lastNavigateInfo.reverse = true;
                        }
                    } else if (0 !== Router._getJqmHistory().activeIndex) {
                        console.warn(TAG + "unknown direction.");
                    }
                }
            });
        }

        /**
         * @en Return additional back distance count when back destination set. (const function)
         * @ja 戻り先が指定されているとき、追加の Back 数を返す。(この関数は Router の状態を変更しない。)
         *
         * @returns
         *  - `en` count of additiona back distance.
         *  - `ja`追加で Back に必要な距離.
         */
        private static detectAdditionalBackDistance(): number {
            const stack = Router._getJqmHistory().stack;
            const historyActiveIndex = Router._getJqmHistory().activeIndex;    // decideDirection() の Router._getJqmHistory().direct() によって、history の activeIndex はすでに変わっている
            const previousIndex = Router._getJqmHistory().previousIndex;       // [戻る]が押下された場合に値が入る
            let i, backDst, distance, fragment, context, jqmDataUrl;

            // check "operation". [戻る]および clearForward() されていない状況をチェック
            if (!Router.s_lastNavigateInfo.reverse || null == previousIndex || !stack[previousIndex]) {
                return 0;
            }

            // "backDst exists". [戻り先]が指定されているかチェック
            backDst = stack[previousIndex][Router.BACK_DESTINATION_URL];
            if ((null == backDst)) {
                return 0;
            }

            fragment = Backbone.history.getFragment(backDst);

            // 初期ページ
            if ("" === fragment) {
                return historyActiveIndex;
            }

            // rootContext から path を逆引き
            context = <RouteContext>_.find(<any>Router.s_rootContexts, (ctx: any) => {
                return ctx.regexp.test(fragment);
            });
            if (null == context) {
                console.warn(TAG + "back destination is not registered. back-dst: " + backDst);
                return 0;
            }

            // dataUrl を元に jQM History を検索
            jqmDataUrl = Router.pathToJqmDataUrl(context.page);
            for (i = historyActiveIndex, distance = 0; 0 <= i; i-- , distance++) {
                if (jqmDataUrl === stack[i].pageUrl) {
                    break;
                }
            }
            if (i < 0) {
                console.warn(TAG + "back destination does not exist in history. back-dst: " + backDst);
                return 0;
            }

            return distance;
        }

        /**
         * @en Start sub flow. <br>
         *     Attach SubFlowParam to jqm history stack object.
         *
         * @ja Sub Flow の開始 <br>
         *     SubFlowParam を jqm history stack にアタッチ
         *
         * @param subFlowParam
         *  - `en` Sub Flow parameter.
         *  - `ja` Sub Flow パラメータ
         */
        private static startSubFlow(subFlowParam: SubFlowParam): void {
            const active = Router._getJqmHistory().getActive();
            const param = <SubFlowParamEx>subFlowParam;
            if (subFlowParam.destBase) {
                let distance = 0;
                const fragment = Backbone.history.getFragment(subFlowParam.destBase);
                const context = <RouteContext>_.find(<any>Router.s_rootContexts, (ctx: any) => {
                    return ctx.regexp.test(fragment);
                });
                if (null == context) {
                    console.warn(TAG + "base destination is not registered. destBase: " + subFlowParam.destBase);
                    return;
                }

                // dataUrl を元に jQM History を検索
                const jqmDataUrl = Router.pathToJqmDataUrl(context.page);
                const stack = Router._getJqmHistory().stack;
                for (let i = Router._getJqmHistory().activeIndex; 0 <= i; i-- , distance++) {
                    if (jqmDataUrl === stack[i].pageUrl) {
                        param.additionalDistance = distance;
                        break;
                    }
                }
            } else {
                param.destBase = location.hash;
                param.additionalDistance = 0;
            }

            active[Router.SUBFLOW_PARAM] = param;
        }

        /**
         * @en End sub flow <br>
         *     navigate and delete SubFlowParam from jqm history stack object.
         *
         * @ja Sub Flow の終了 <br>
         *     遷移と SubFlowParam を jqm history stack から削除
         *
         * @param navOptions
         *  - `en` Sub Flow parameter.
         *  - `ja` Sub Flow パラメータ
         */
        private static finishSubFlow(options: NavigateOptions): void {
            const navOptions: NavigateOptions = $.extend(true, {}, options);
            const baseInfo = Router.detectSubFlowBaseInfo();
            // "end" 時に更新されたものを上書き
            const param: SubFlowParam = $.extend({}, baseInfo.subFlowParam, navOptions.subFlow);
            const distance = baseInfo.distance;
            const stack = baseInfo.stack;
            let retry = 0;
            const NAVIGATE_INTERVAL = 100;
            const MAX_RETRY_COUNT = 10;

            // hash 変更が完了した後に navigate を実行
            const _navigate = () => {
                if (MAX_RETRY_COUNT <= retry) {
                    console.error(TAG + "reached navigate max retry count.");
                    Router.s_lastNavigateInfo = {};
                } else if (param.destBase !== location.hash) {
                    retry++;
                    setTimeout(_navigate, NAVIGATE_INTERVAL);
                } else {
                    Router.s_lastNavigateInfo.inNavigation = false;
                    Router.registerPageStack(param.destStacks, true, navOptions);
                }
            };

            if (stack) {
                delete stack[Router.SUBFLOW_PARAM];

                Router._getJqmHistory().activeIndex -= distance;
                Router._getJqmHistory().clearForward();

                if (param.destStacks) {
                    Router.stop();
                    // iOS 環境において index.html より history.go(0) が発生するとリロードが発生する.
                    // その後画面遷移を控えるため, 履歴を戻る必要があるときにのみ限定する.
                    if (0 !== distance) {
                        history.go(-distance);
                    }
                    delete navOptions.subFlow;    // subFlow プロパティの破棄
                    setTimeout(_navigate, 0);
                } else {
                    Router.s_lastNavigateInfo.positiveNavigate = false;
                    history.go(-distance);
                }
            } else {
                console.warn(TAG + "subFlow begin status does not exist in history.");
                Router.s_lastNavigateInfo = {};
            }
        }

        /**
         * @en Return destination Sub Flow information. (const function)
         * @ja Sub Flow 情報を返却 (この関数は Router の状態を変更しない。)
         *
         * @returns
         *  - `en` sub flow info.
         *  - `ja` Sub Flow 情報.
         */
        private static detectSubFlowBaseInfo(): any {
            const stack = Router._getJqmHistory().stack;
            const historyActiveIndex = Router._getJqmHistory().activeIndex;
            let i: number, distance: number;
            let param: SubFlowParamEx = <SubFlowParamEx>{};
            let target: Object;

            for (i = historyActiveIndex, distance = 0; 0 <= i; i-- , distance++) {
                if (stack[i][Router.SUBFLOW_PARAM]) {
                    target = stack[i];
                    param = <SubFlowParamEx>stack[i][Router.SUBFLOW_PARAM];
                    break;
                }
            }

            if (null == param.additionalDistance) {
                param.additionalDistance = 0;
            }

            return {
                stack: target,
                subFlowParam: param,
                distance: distance + param.additionalDistance,
                isCurrent: (() => {
                    if (target && 0 === distance) {
                        return true;
                    } else {
                        return false;
                    }
                })(),
            };
        }

        /**
         * @en Convert path to jQM dataUrl.
         * @ja パスを jQM dataUrl に変換
         *
         * @returns jQM data url.
         */
        private static pathToJqmDataUrl(path: string): string {
            const url = Framework.toUrl(path);
            const dataUrl = $.mobile.path.convertUrlToDataUrl(url);
            return dataUrl;
        }

        /**
         * @en Update jQM urlHistory by window.history object. <br>
         *     To be natural browsing history behavior, application needs to update jQM urlHistory <br>
         *     when clicking back or next button of browser. (imperfection for decideDirection())
         *
         * @ja ブラウザの履歴に基づき jQM urlHistory を更新 <br>
         *     [戻る]/[進む]が押下された後、ページ遷移されるとき、jQM urlHistory を更新する。(decideDirection() により不完全)
         */
        private static treatUrlHistory(): void {
            if (Router.s_lastNavigateInfo.positiveNavigate || history.length < Router._getJqmHistory().stack.length) {
                Router._getJqmHistory().clearForward();
            }
        }
    }
}
