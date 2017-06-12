/*!
 * @cdp/mobile patch.d.ts 
 */

interface IScroll {
}

declare module "iscroll" {
    let _IScroll: IScroll;
    export { _IScroll as IScroll };
}

declare module "hogan" {
    let _Hogan: any;
    export { _Hogan as Hogan };
}

/*
// jquerymobile
interface PopupOptions {
    // [CDP modified]: add inteface.
    x?: number | string;
    y?: number | string;
    dismissible?: boolean;
    create?: (event: JQueryEventObject, ui: any) => any;
    afterclose?: (event: JQueryEventObject, ui: any) => any;
}

interface ChangePageOptions {
    // [CDP modified]: add inteface.
    fromHashChange?: boolean;
}

interface JQueryMobilePath {
    // [CDP modified]: add inteface.
    isPath(url: string): boolean;
    convertUrlToDataUrl(url: string): string;
    documentBase: any;
}

interface JQueryMobile extends JQueryMobileOptions {
    // [CDP modified]: add inteface.
    back(): void;
    navigate: any;
}

interface JQuery {
    // [CDP modified]: add inteface.
    page(command?: any, ...args: any[]): any;
    jqmData(key: string): any;
    jqmData(key: string, value: any): JQuery;
    jqmRemoveData(key: string): JQuery;
    one(events: string, handler: (eventObject: JQueryEventObject, data: any) => any): JQuery;
}

interface JQueryStatic {
    // [CDP modified]: add inteface.
    migrateMute: boolean;   // jquery-migrate
}
*/
