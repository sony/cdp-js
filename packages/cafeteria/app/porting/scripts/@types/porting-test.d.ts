// tsconfig の範囲内であれば、reference は不要
// <reference types="@cdp/mobile" />

// d.ts 無いで import を使用すると、global export されないので注意
// import { BasePageView } from "cdp/ui";

// porting は最終兵器. interface を定義して生 require() して使用し、interface の位置も固定する.
// 仕様を欲張らない

interface IPortingPageView extends CDP.UI.PageView {
}

interface IPortingFunction {
    sayHello(): void;
    doSomething(): boolean;
}
