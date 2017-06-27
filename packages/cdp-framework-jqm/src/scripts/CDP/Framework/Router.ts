/// <reference path="../../@types/jquery.mobile.d.ts" />
/* tslint:disable:max-line-length no-string-literal */

namespace CDP.Framework {

    import Promise = CDP.Promise;

    ///////////////////////////////////////////////////////////////////////
    // closure methods

    /**
     * \~english
     * Convert path to URL.
     * If the path starts from "/", the function translate the path as child folder of "web root".
     * Otherwise, it interprets as relative path from current page.
     * [Note] This behavior go along with jQM, NOT with require.toUrl().
     *
     * @param path {String} [in] path string
     *
     * \~japanese
     * path を URL に変換
     * "/" から始まるものは web root から、それ以外は現在のページから絶対パスURLに変換する。
     * jQM の挙動にあわせており、require.toUrl() と異なるので注意。
     *
     * @param path {String} [in] パスを指定。
     */
    export function toUrl(path: string): string {
        if (null != path[0] && "/" === path[0]) {
            return CDP.webRoot + path.slice(1);
        } else {
            return $.mobile.path.makeUrlAbsolute(path, getCurrentDocumentUrl());
        }
    }

    /**
     * \~english
     * Get current document url.
     *
     * @private
     *
     * \~japanese
     * 現在表示しているドキュメントの URL を取得
     *
     * @private
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
     * \~english
     * Default "before route change" handler.
     *
     * @private
     *
     * \~japanese
     * 既定の "before route change" ハンドラ
     *
     * @private
     */
    let _beforeRouteChange = (): IPromiseBase<any> => {
        return Promise.resolve();
    };

    // default "before route change" hanndler
    const _defaultBeforeRouteChange = _beforeRouteChange;

    /**
     * \~english
     * Setup "before route change" handler.
     *
     * @param  {Function} handler function.
     * @return {Function} old handler function.
     *
     * \~japanese
     * "before route change" ハンドラ設定
     *
     * @param  {Function} handler 指定.
     * @return {Function} 以前の handler.
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
     * \~english
     * @interface InitOptions
     * @brief initialize option definition.
     * @private
     *
     * \~japanese
     * @interface InitOptions
     * @brief 初期化オプション
     * @private
     */
    interface InitOptions {
        anchorVclick?: boolean;    //!< 暗黙の anchor vclick をサポート
    }

    /**
     * \~english
     * @interface RouteContext
     * @brief Management info for page.
     *        This interface role is not same as Backbone.Router.routes.
     *        Using for resolving relation a known fragment value and a page path.
     * @private
     *
     * \~japanese
     * @interface RouteContext
     * @brief ページ管理情報
     *        Backbone.Router.routes と同じ役割ではない。
     *        遷移したことがあるフラグメント値とページのパスの解決に使用される。
     * @private
     */
    interface RouteContext {
        route: string;
        regexp: RegExp;
        page: string;
        top: boolean;
        callback: (...args: any[]) => boolean;
    }

    /**
     * \~english
     * @interface NavigateInfo
     * @brief Stored additional info interface on navigate.
     * @private
     *
     * \~japanese
     * @interface NavigateInfo
     * @brief ページ遷移に関する付加情報を格納するインターフェイス
     * @private
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
     * \~english
     * @interface SubFlowParamEx
     * @brief Extened SubFlowParam interface in Framework use.
     * @private
     *
     * \~japanese
     * @interface SubFlowParamEx
     * @brief Framework が使用する SubFlowParam 拡張インターフェイス
     * @private
     */
    interface SubFlowParamEx extends SubFlowParam {
        additionalDistance?: number;
    }

    //___________________________________________________________________________________________________________________//

    /**
     * \~english
     * @class Router
     * @brief Router class for adjusting jQueryMobile functions and Backbone.Router functions.
     *        Even if Backbone.Router does not start routing, natigate() method works good with jQM framework.
     *
     * \~japanese
     * @class Router
     * @brief jQueryMobile と Backbone.Router を調停する Router クラス
     *        ルーティングを開始していない場合にも、navigate() は jQM フレームワークを使用して機能する。
     */
    export class Router {

        private static s_initOptions: InitOptions = {};
        private static s_router: Backbone.Router = null;
        private static s_rootContexts: Object = {};
        private static s_lastNavigateInfo: NavigateInfo = {};
        private static s_lastClickedTime: number = null;
        private static s_lastIntent: Intent = {};
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
        };

        private static s_defaultNavigateOptions: NavigateOptions = {
            trigger: true,
            replace: false,
            intent: null,
        };

        ///////////////////////////////////////////////////////////////////////
        // public static methods

        /**
         * \~english
         * for initialize Router. this function is called in framework.
         *
         * @return {Boolean} true: succeeded / false: failed.
         *
         * \~japanese
         * 初期化
         * この関数はフレームワーク内部で使用される。
         *
         * @param  options {Object} [in] オプション
         * @return {Boolean} 成否
         */
        public static initialize(options: any): boolean {
            const $body = $("body");
            if (!!Router.s_router) {
                console.warn("logic error. initialize call twice.");
                return false;
            }

            Router.s_initOptions = $.extend({}, Router.s_defaultInitOptions, options);

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
            Framework.setupEventHandlers();

            return true;
        }

        /**
         * \~english
         * Register to Router.
         *
         * @param route    {String}   [in] route string, it can be regular expression.
         * @param page     {String}   [in] page template path.
         * @param top      {Boolean}  [in] set "true" if application's top view. (optional)
         * @param callback {Function} [in] callback for custom page transition. If you don't want to trigger jQM.changePage(), return true by this callback. (optional)
         * @return {Router} Router instance.
         *
         * \~japanese
         * 登録
         *
         * @param route    {String}   [in] ルーティング文字列 / 正規表現
         * @param page     {String}   [in] page template path. イベント名にも使用される
         * @param top      {Boolean}  [in] Top ページの場合は true を指定 (任意)
         * @param callback {Function} [in] 遷移を自身で管理する場合に指定し、戻り値を true に設定すると changePage をコールしない (任意)
         * @return {Router} インスタンス。ただし method chain をしたい場合は、any cast が必要。
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
                Router.start({ silent: true });
            }

            return Router;
        }

        /**
         * \~english
         * Start listening hash change.
         * It should be called after register().
         *
         * @param options {Object} [in] options object for Backbone.History.
         *
         * \~japanese
         * 履歴監視の開始
         * 登録完了後に呼び出す。
         *
         * @param options {Object} [in] Backbone.History にわたるオプション
         */
        public static start(options?: RouterOptions): boolean {
            if (false !== options.pageConstruct) {
                Framework.constructPages();
            }
            if ($.mobile.hashListeningEnabled) {
                console.log("setting error. confict: $.mobile.hashListeningEnabled = true, cannot start.");
                return false;
            }
            return Backbone.history.start(options);
        }

        /**
         * \~english
         * Stop listening hash change.
         *
         * @return {Boolean} previous status.
         *
         * \~japanese
         * 履歴監視の終了
         *
         * @return {Boolean} 以前の開始状態を返却
         */
        public static stop(): boolean {
            const prevState = (<any>Backbone.History).started;
            Backbone.history.stop();
            return prevState;
        }

        /**
         * \~english
         * Check routing status.
         *
         * @return {Boolean} true: routing / false: not routing
         *
         * \~japanese
         * ルーティングを開始しているか判定
         *
         * @return {Boolean} true: 有効 / false: 無効
         */
        public static isRouting(): boolean {
            return (<any>Backbone.History).started;
        }

        /**
         * \~english
         * URL navigation.
         *
         * @param url        {String}          [in] set a navigate URL. (relative path / absolute path / fragment)
         * @param transition {String}          [in] set a transition string (optional)
         * @param reverse    {Boolean}         [in] set a direction string for transition. true:reverse / false:nomal (optional)
         * @param options    {NavigateOptions} [in] set a options object for Backbone.Router.navigate(). (optional)
         *
         * \~japanese
         * URL遷移
         *
         * @param url        {String}          [in] 遷移 URL を指定 (相対パス/絶対パス/フラグメント)
         * @param transition {String}          [in] transition に使用する effect を指定 (任意)
         * @param reverse    {Boolean}         [in] transition に使用する direction を指定 true:reverse/false:通常 (任意)
         * @param options    {NavigateOptions} [in] Backbone.Router.navigate() に渡されるオプション (任意)
         */
        public static navigate(url: string, transition?: string, reverse?: boolean, options?: NavigateOptions): void {
            if (!!Router.s_lastNavigateInfo.inNavigation) {
                // すでに Navigation 中であれば抑止
                console.log("Router.navigate() called in navigation proc.");
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
                    console.error("before route change call, failed.");
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
                                    console.warn("unknown subFlow.operation. operation: " + navOptions.subFlow.operation);
                                    break;
                            }
                        }
                        Router.s_router.navigate(url, navOptions);
                    } else {
                        if (navOptions.subFlow) {
                            console.warn("subFlow only supported under routing and hash change condition.");
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
         * \~english
         * Navigate from Top Page.
         * If SubFlow set up, the param is cleared.
         *
         * @param to         {String|PageStack|PageStack[]} [in] set a navigate URL or PageStackOptions object or array.
         * @param transition {String}                       [in] set a transition string (optional)
         * @param reverse    {Boolean}                      [in] set a direction string for transition. true:reverse / false:nomal (optional)
         * @param options    {NavigateOptions}              [in] set a options object for Backbone.Router.navigate(). (optional)
         *
         * \~japanese
         * トップページからの画面遷移
         * SubFlow が指定されていた場合はクリアされる
         *
         * @param to         {String|PageStack|PageStack[]} [in] 遷移 URL / PageStackOptions オブジェクト/配列
         * @param transition {String}                       [in] transition に使用する effect を指定 (任意)
         * @param reverse    {Boolean}                      [in] transition に使用する direction を指定 true:reverse/false:通常 (任意)
         * @param options    {NavigateOptions}              [in] Backbone.Router.navigate() に渡されるオプション (任意)
         */
        public static navigateFromTop(
            to?: string | PageStack | PageStack[],
            transition?: string,
            reverse?: boolean,
            options?: NavigateOptions
        ): void {
            const stack = Router.getJqmHistory().stack;
            const currentPage = stack[Router.getJqmHistory().activeIndex];
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
         * \~english
         * Back to previous history.
         * It's same as browser back button's behaviour.
         * [Note] If set the jQM: data-rel="back", work as well.
         *
         * \~japanese
         * 履歴を戻る
         * ブラウザの戻るボタンと同じ挙動。
         * jQM: data-rel="back" を指定しても同じであることに注意。
         */
        public static back(): void {
            if (!!Router.s_lastNavigateInfo.inNavigation) {
                // すでに Navigation 中であれば抑止
                console.log("Router.back() called in navigation proc.");
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
         * \~english
         * Store Intent object.
         *
         * \~japanese
         * Intent を格納
         */
        public static pushIntent(intent: Intent): void {
            Router.s_lastIntent = $.extend(true, Router.s_lastIntent, intent);
        }

        /**
         * \~english
         * Get Intent object.
         *
         * \~japanese
         * Intent を取得
         */
        public static popIntent(): Intent {
            const intent = Router.s_lastIntent;
            Router.s_lastIntent = {};
            return intent;
        }

        /**
         * \~english
         * Get query parameters.
         *
         * \~japanese
         * query parameter に指定された引数の取得
         * ページ遷移中にのみアクセス可能 (pagebeforecreate ～ pagechange)
         */
        public static getQueryParameters(): any {
            if (Router.s_lastNavigateInfo.intent && Router.s_lastNavigateInfo.intent.params) {
                return Router.s_lastNavigateInfo.intent.params["queryParams"];
            } else {
                return null;
            }
        }

        /**
         * \~english
         * Begin sub flow transaction.
         *
         * @param url        {String}          [in] set a navigate URL. (relative path / absolute path / fragment)
         * @param options    {NavigateOptions} [in] set a options object for Backbone.Router.navigate(). (optional)
         * @param transition {String}          [in] set a transition string (optional)
         * @param reverse    {Boolean}         [in] set a direction string for transition. true:reverse / false:nomal (optional)
         *
         * \~japanese
         * sub flow トランザクションの開始.
         * navigate() の 糖衣構文
         *
         * @param url        {String}          [in] 遷移 URL を指定 (相対パス/絶対パス/フラグメント)
         * @param options    {NavigateOptions} [in] Backbone.Router.navigate() に渡されるオプション (任意)
         * @param transition {String}          [in] transition に使用する effect を指定 (任意)
         * @param reverse    {Boolean}         [in] transition に使用する direction を指定 true:reverse/false:通常 (任意)
         */
        public static beginSubFlow(url: string, options: NavigateOptions, transition?: string, reverse?: boolean): void {
            const opt: NavigateOptions = $.extend({}, options);
            opt.subFlow = opt.subFlow || { operation: "begin" };
            if ("begin" !== opt.subFlow.operation) {
                console.error("logic error. invalid subflow operation. [operation: " + opt.subFlow.operation + "]");
                return;
            }
            Router.navigate(url, transition, reverse, opt);
        }

        /**
         * \~english
         * Commit sub flow transaction.
         *
         * @param transition {String}  [in] set a transition string (optional)
         * @param reverse    {Boolean} [in] set a direction string for transition. true:reverse / false:nomal (optional)
         *
         * \~japanese
         * sub flow トランザクションの終了.
         * navigate() の 糖衣構文
         *
         * @param transition {String}  [in] transition に使用する effect を指定 (任意)
         * @param reverse    {Boolean} [in] transition に使用する direction を指定 true:reverse/false:通常 (任意)
         */
        public static commitSubFlow(transition?: string, reverse?: boolean): void {
            Router.navigate(null, transition, reverse, {
                subFlow: {
                    operation: "end",
                }
            });
        }

        /**
         * \~english
         * Cancel sub flow transaction.
         *
         * @param transition {String}  [in] set a transition string (optional)
         * @param reverse    {Boolean} [in] set a direction string for transition. true:reverse[default] / false:nomal (optional)
         *
         * \~japanese
         * sub flow トランザクションのキャンセル.
         * navigate() の 糖衣構文
         *
         * @param transition {String}  [in] transition に使用する effect を指定 (任意)
         * @param reverse    {Boolean} [in] transition に使用する direction を指定 true:reverse[既定]/false:通常 (任意)
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
         * \~english
         * Check in sub flow.
         *
         * \~japanese
         * sub flow 内であるか判定
         */
        public static isInSubFlow(): boolean {
            const stack = Router.getJqmHistory().stack;
            const has = _.some(stack, (value) => {
                return !!value[Router.SUBFLOW_PARAM];
            });
            return has;
        }

        /**
         * \~english
         * Check from hash changed navigation.
         *
         * \~japanese
         * Hash 変更によって Navigate が起こったか判定
         * "pagechange" が発生するまでに判定可能
         */
        public static fromHashChanged(): boolean {
            // positiveNavigate = false は含めない
            return Router.s_lastNavigateInfo.inNavigation && (null == Router.s_lastNavigateInfo.positiveNavigate);
        }

        /**
         * \~english
         * Register page stack.
         * Set registered route(s) to add to page stack on the basis of the present stack position.
         *
         * @param pageStack    {PageStack|PageStack[]}   [in] PageStackOptions object or array.
         * @param withNavigate {Boolean}                 [in] true: with navigate final stack. (default) / false: not navigate.
         * @param options      {NavigateOptions}         [in] set a options object for Backbone.Router.navigate().(optional)
         * @return {Boolean} true: succeeded / false: failed
         *
         * \~japanese
         * ページスタック登録
         * 登録済みの route を指定して、現在の位置を基点にページスタックに登録
         *
         * @param pageStack    {PageStack|PageStack[]}   [in] PageStackOptions オブジェクト/配列
         * @param withNavigate {Boolean}                 [in] true: 最後のスタックに対してページ遷移する. (default) / false: ページ遷移しない.
         * @param options      {NavigateOptions}         [in] Backbone.Router.navigate() に渡されるオプション (任意)
         * @return {Boolean} true: 成功 / false: 失敗。
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
                        console.warn("route is not registered. route: " + info.route);
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

                Router.getJqmHistory().clearForward();

                for (let i = 0, n = silentLength; i < n; i++) {
                    location.hash = newStacks[i].route;
                    Router.getJqmHistory().stack.push(newStacks[i]);
                    Router.getJqmHistory().activeIndex = Router.getJqmHistory().stack.length - 1;
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
                    Router.getJqmHistory().stack.push(newStacks[finalIndex]);
                    Router.getJqmHistory().activeIndex = Router.getJqmHistory().stack.length - 1;
                }

                // Router の再開
                if (restart) {
                    Router.start({ silent: true });
                }
            })();

            return true;
        }

        /**
         * \~english
         * Get jQM's history object
         *
         * \~japanese
         * jQM の History オブジェクトの取得
         *
         */
        public static getJqmHistory(): any {
            return $.mobile.navigate.history;
        }

        ///////////////////////////////////////////////////////////////////////
        // private static methods

        /**
         * \~english
         * Override: Backbone.History.loadUrl().
         *
         * @private
         *
         * \~japanese
         * Backbone.History.loadUrl() のオーバーライド
         *
         * @private
         */
        private static customLoadUrl(fragment: string): boolean {
            const handled = Router.s_loadUrl(fragment);
            if (!handled) {
                Router.onRouteFailed(fragment);
            }
            return handled;
        }

        /**
         * \~english
         * Override: $.mobile.back().
         *
         * fail safe processing.
         *  If using Backbone's Router,
         *  this class unuses history object of jQuery Mobile 1.4,
         *  and standardize as browser back button's behaviour. (jQM 1.3 comparable)
         *
         * @private
         *
         * \~japanese
         * $.mobile.back() のオーバーライド
         *
         * [TBD] fail safe 処理
         *  Backbone の Router を使用している場合、
         *  jQuery Mobile 1.4 以降の内部の History 管理は使用せずに
         *  1.3 相当のブラウザの[戻る]の挙動に統一する。
         *
         * @private
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
                        const active: Object = Router.getJqmHistory().getActive();
                        active[Router.BACK_DESTINATION_URL] = Router.s_lastNavigateInfo.backDestination;
                    }
                })
                .on("pageshow", (event: JQuery.Event) => {
                    const active: Object = Router.getJqmHistory().getActive();
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
         * \~english
         * Store the RootContext.
         *
         * @private
         * @param name    {String}       [in] name of route
         * @param context {RouteContext} [in] context object
         * @return true: succeeded / false: already registered
         *
         * \~japanese
         * RootContext の格納
         *
         * @private
         * @param name    {String}       [in] route 名
         * @param context {RouteContext} [in] context オブジェクト
         * @return true: 登録成功 / false: すでに登録されている
         */
        private static pushContext(name: string, context: RouteContext): boolean {
            if (!!Router.s_rootContexts[name]) {
                console.log("logic error. route is already registered. name: " + name);
                return false;
            }
            Router.s_rootContexts[name] = context;
            return true;
        }

        /**
         * \~english
         * Check if $.mobile.initializePage() is called or not, and call it if needed.
         *
         * @private
         * @param url {String}  [in] set a navigate URL. (relative path / absolute path / fragment)
         *
         * \~japanese
         * $.mobile.initializePage() が呼ばれているか確認し、必要なら初期化する。
         *
         * @private
         * @param url {String} [in] 遷移 URL を指定 (相対パス/絶対パス/フラグメント)
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
         * \~english
         * Check for current page is top.
         *
         * @private
         * @return true: top page / false: not top page
         *
         * \~japanese
         * 現在のページが top に指定されているか判定
         *
         * @private
         * @return true: top 指定 / false: top ではない
         */
        private static isTopPage(): boolean {
            const fragment = Backbone.history.getFragment($.mobile.path.parseUrl(location.href).hash);
            const context = <RouteContext>_.find(<any>Router.s_rootContexts, (ctx: any) => {
                return ctx.regexp.test(fragment);
            });
            return (null == context) ? false : context.top;
        }

        /**
         * \~english
         * Called when anchor received "vclick" event.
         *
         * @private
         * @return true: need default processing / false: need custom processing
         *
         * \~japanese
         * anchor が vclick されたときにコールされる
         *
         * @private
         * @return true: default 処理 / false: カスタム処理
         */
        private static onAnchorVclicked(event: JQuery.Event): boolean {
            if (Router.isJustBeforeVclicked()) {
                event.preventDefault();
                return false;
            }
            return Router.followAnchor(event);
        }

        /**
         * \~english
         * Anchor processing.
         *
         * @private
         *
         * \~japanese
         * anchor 処理
         *
         * @private
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
         * \~english
         * Check default processing needed.
         *
         * @private
         * @param  url {String} [in] url string
         * @return true: need default processing / false: need not
         *
         * \~japanese
         * 既定の処理を行わせるか判定
         *
         * @private
         * @param  url {String} [in] url 文字列
         * @return true: 既定の処理が必要 / false: 不要
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
         * \~english
         * Check status of Backbone.Router if they can resolve route.
         *
         * @private
         * @param  url {String} [in] url 文字列
         * @return true: can resolve / false: can not
         *
         * \~japanese
         * Backbone.Router が route を解決可能か判定
         *
         * @private
         * @param  url {String} [in] url 文字列
         * @return true: 解決可能 / false: 解決不可
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
         * \~english
         * Check "vclick" fired at the last minute.
         *
         * @private
         *
         * \~japanese
         * 直前に vclick が呼ばれたか判定
         *
         * @private
         */
        private static isJustBeforeVclicked(): boolean {
            const isBefore = (Date.now() - Router.s_lastClickedTime) < Router.DELAY_TIME * 2;
            Router.s_lastClickedTime = Date.now();
            return isBefore;
        }

        /**
         * \~english
         * Check back button clicked.
         *
         * @private
         *
         * \~japanese
         * Back Button がクリックされたか判定
         *
         * @private
         */
        private static isBackButtonClicked(event: JQuery.Event): boolean {
            if ($(event.currentTarget).jqmData("rel") === "back") {
                return true;
            } else {
                return false;
            }
        }

        /**
         * \~english
         * It called on succeed routing triggered by changing hash.
         *
         * @private
         * @param name {String} [in] name of route
         * @param args {Array}  [in] array of paramter
         *
         * \~japanese
         * ハッシュ値が変更され、ルーティングが成功したときにコールされる
         *
         * @private
         * @param name {String} [in] route 名。page の値が渡る。
         * @param args {Array}  [in] パラメータ配列。
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
         * \~english
         * It called on failed routing triggered by changing hash.
         *
         * @private
         * @param name {String} [in] name of route
         * @param args {Array}  [in] array of paramter
         *
         * \~japanese
         * ハッシュ値が変更され、ルーティングが失敗したときにコールされる
         *
         * @private
         * @param name {String} [in] route 名。page の値が渡る。
         * @param args {Array}  [in] パラメータ配列。
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
         * \~english
         * This function just calls jQuery Mobile's navigation method.
         *
         * @private
         * @param path {String} [in] to page path
         *
         * \~japanese
         * jQuery Mobile によるページ遷移指定
         *
         * @private
         * @param path {String} [in] 遷移先パスを指定
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
                        Router.getJqmHistory().activeIndex -= additional;
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
                Router.getJqmHistory().previousIndex = Router.getJqmHistory().activeIndex;
            }

            // ページ遷移開始通知. すでにコールされている場合は既定の何もしないコールバックを使用する.
            notifyBeforeRouteChange = Router.s_lastNavigateInfo.calledBeforeRouteChange ? _defaultBeforeRouteChange : _beforeRouteChange;

            notifyBeforeRouteChange()
                .then(() => {
                    // 付加情報
                    if (Router.s_lastNavigateInfo.intent) {
                        Router.pushIntent(Router.s_lastNavigateInfo.intent);
                    }

                    Router.treatUrlHistory();

                    $.mobile.changePage(Framework.toUrl(path), {
                        showLoadMsg: false,
                        allowSamePageTransition: true,
                        transition: Router.s_lastNavigateInfo.transition || "none",
                        reverse: Router.s_lastNavigateInfo.reverse,
                        fromHashChange: !Router.s_lastNavigateInfo.positiveNavigate,
                        changeHash: !Router.s_lastNavigateInfo.noHashChange,
                    });
                })
                .fail(() => {
                    console.error("before route change call, failed.");
                    Router.s_lastNavigateInfo = {};
                });
        }

        /**
         * \~english
         * Decide direction parameter.
         * It's as same as jQM internal implement. (imperfection)
         *
         * @private
         * @param path {String} [in] to page path
         *
         * \~japanese
         * direction の判定
         * jQM の内部実装と等価 (不完全)
         *
         * @private
         * @param path {String} [in] 遷移先パスを指定
         */
        private static decideDirection(path: string): void {
            const url = $.mobile.path.convertUrlToDataUrl(Framework.toUrl(path));

            if (null == Router.s_lastNavigateInfo.transition) {
                Router.s_lastNavigateInfo.transition = Router.getJqmHistory().getActive().transition;
            }

            Router.getJqmHistory().direct({
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
                            console.log("unknown direction: " + direction);
                            break;
                    }
                },
                missing: () => {
                    // 初期ページ URL は判定できない。正常系。
                    if (1 === Router.getJqmHistory().activeIndex) {
                        Router.getJqmHistory().previousIndex = 1;
                        Router.getJqmHistory().activeIndex = 0;
                        if (null == Router.s_lastNavigateInfo.reverse) {
                            Router.s_lastNavigateInfo.reverse = true;
                        }
                    } else if (0 !== Router.getJqmHistory().activeIndex) {
                        console.log("unknown direction.");
                    }
                }
            });
        }

        /**
         * \~english
         * Return additional back distance count when back destination set.
         * (const function)
         *
         * @private
         * @return {Number} count of additiona back distance.
         *
         * \~japanese
         * 戻り先が指定されているとき、追加の Back 数を返します。
         * (この関数は Router の状態を変更しません。)
         *
         * @private
         * @return {String} 追加で Back に必要な距離.
         */
        private static detectAdditionalBackDistance(): number {
            const stack = Router.getJqmHistory().stack;
            const historyActiveIndex = Router.getJqmHistory().activeIndex;    // decideDirection() の Router.getJqmHistory().direct() によって、history の activeIndex はすでに変わっている
            const previousIndex = Router.getJqmHistory().previousIndex;       // [戻る]が押下された場合に値が入る
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
                console.warn("back destination is not registered. back-dst: " + backDst);
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
                console.warn("back destination does not exist in history. back-dst: " + backDst);
                return 0;
            }

            return distance;
        }

        /**
         * \~english
         * Start sub flow
         * Attach SubFlowParam to jqm history stack object.
         *
         * @param subFlowParam {SubFlowParam} [in] Sub Flow parameter
         *
         * \~japanese
         * Sub Flow の開始
         * SubFlowParam を jqm history stack にアタッチ
         *
         * @param subFlowParam {SubFlowParam} [in] Sub Flow パラメータ
         */
        private static startSubFlow(subFlowParam: SubFlowParam): void {
            const active = Router.getJqmHistory().getActive();
            const param = <SubFlowParamEx>subFlowParam;
            if (subFlowParam.destBase) {
                let distance = 0;
                const fragment = Backbone.history.getFragment(subFlowParam.destBase);
                const context = <RouteContext>_.find(<any>Router.s_rootContexts, (ctx: any) => {
                    return ctx.regexp.test(fragment);
                });
                if (null == context) {
                    console.warn("base destination is not registered. destBase: " + subFlowParam.destBase);
                    return;
                }

                // dataUrl を元に jQM History を検索
                const jqmDataUrl = Router.pathToJqmDataUrl(context.page);
                const stack = Router.getJqmHistory().stack;
                for (let i = Router.getJqmHistory().activeIndex; 0 <= i; i-- , distance++) {
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
         * \~english
         * End sub flow
         * navigate and delete SubFlowParam from jqm history stack object.
         *
         * @param navOptions {NavigateOptions} [in] Sub Flow parameter
         *
         * \~japanese
         * Sub Flow の終了
         * 遷移と SubFlowParam を jqm history stack から削除
         *
         * @param navOptions {NavigateOptions} [in] Sub Flow パラメータ
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
                    console.error("reached navigate max retry count.");
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

                Router.getJqmHistory().activeIndex -= distance;
                Router.getJqmHistory().clearForward();

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
                console.warn("subFlow begin status does not exist in history.");
                Router.s_lastNavigateInfo = {};
            }
        }

        /**
         * \~english
         * Return destination Sub Flow information.
         * (const function)
         *
         * @private
         * @return {Object} sub flow info.
         *
         * \~japanese
         * Sub Flow 情報を返却
         * (この関数は Router の状態を変更しません。)
         *
         * @private
         * @return {Object} Sub Flow 情報.
         */
        private static detectSubFlowBaseInfo(): any {
            const stack = Router.getJqmHistory().stack;
            const historyActiveIndex = Router.getJqmHistory().activeIndex;
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
         * \~english
         * Convert path to jQM dataUrl.
         *
         * @private
         * @return {String} jQM data url.
         *
         * \~japanese
         * パスを jQM dataUrl に変換
         *
         * @private
         * @return {String} jQM data url.
         */
        private static pathToJqmDataUrl(path: string): string {
            const url = Framework.toUrl(path);
            const dataUrl = $.mobile.path.convertUrlToDataUrl(url);
            return dataUrl;
        }

        /**
         * \~english
         * Update jQM urlHistory by window.history object.
         * To be natural browsing history behavior, application needs to update jQM urlHistory
         * when clicking back or next button of browser. (imperfection for decideDirection())
         *
         * @private
         *
         * \~japanese
         * ブラウザの履歴に基づき jQM urlHistory を更新
         * [戻る]/[進む]が押下された後、ページ遷移されるとき、jQM urlHistory を更新する。(decideDirection() により不完全)
         *
         * @private
         */
        private static treatUrlHistory(): void {
            if (Router.s_lastNavigateInfo.positiveNavigate || history.length < Router.getJqmHistory().stack.length) {
                Router.getJqmHistory().clearForward();
            }
        }
    }
}
