/*!
 * @cdp/mobile patch.d.ts 
 */

///////////////////////////////////////////////////////////////////////
// hogan.js:

declare module "hogan" {
    const _Hogan: any;
    export { _Hogan as Hogan };
}

///////////////////////////////////////////////////////////////////////
// iscroll.js:

interface IScroll {}
declare module "iscroll" {
    const _IScroll: IScroll;
    export { _IScroll as IScroll };
}

///////////////////////////////////////////////////////////////////////
// flipsnap.js:

interface IFlipsnap {}
declare module "flipsnap" {
    const _Flipsnap: IFlipsnap;
    export { _Flipsnap as Flipsnap };
}
