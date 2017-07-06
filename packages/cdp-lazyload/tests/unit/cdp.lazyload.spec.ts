/// <reference path="_dev.dependencies.d.ts" />

import "../../built/cdp.lazyload";

describe("cdp.lazyload spec", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("check amd", () => {
        expect(CDP.isAMD).not.toBeNull();
        expect(typeof CDP.isAMD).toEqual("function");
        expect(CDP.isAMD()).toBeTruthy();
    });

    it("check lazyload", () => {
        expect("TODO").not.toBeNull();
    });
});
