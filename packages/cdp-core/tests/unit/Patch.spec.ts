import "../../src/scripts/cdp.core";

describe("Patch", () => {
    const _console = window.console;
    const _MSApp = (<any>window).MSApp;

    beforeEach(() => {
        (<any>window).console = {};
        (<any>window).MSApp = {
            execUnsafeLocalFunction: (callback: Function) => { return callback(); },
        };
    });

    afterEach(() => {
        (<any>window).console = _console;
        (<any>window).MSApp = _MSApp;
    });

    it("check consolePatch", () => {
        expect(console).not.toBeUndefined();
        expect(console.log).toBeUndefined();
        expect(console.dir).toBeUndefined();
        expect(console.warn).toBeUndefined();
        expect(console.error).toBeUndefined();
        (<any>CDP.Patch).consolePatch();
        expect(console.log).not.toBeNull();
        expect(console.dir).not.toBeNull();
        expect(console.warn).not.toBeNull();
        expect(console.error).not.toBeNull();

        /* tslint:disable: no-console */
        expect(console.count()).toBeUndefined();
        expect(console.groupEnd()).toBeUndefined();
        expect(console.time()).toBeUndefined();
        expect(console.timeEnd()).toBeUndefined();
        expect(console.trace()).toBeUndefined();
        expect(console.group()).toBeUndefined();
        expect(console.dirxml(null)).toBeUndefined();
        expect(console.debug()).toBeUndefined();
        expect(console.groupCollapsed()).toBeUndefined();
        expect(console.select(null)).toBeUndefined();
        expect(console.info()).toBeUndefined();
        expect(console.profile()).toBeUndefined();
        expect(console.assert()).toBeUndefined();
        expect(console.msIsIndependentlyComposed(null)).toBeUndefined();
        expect(console.clear()).toBeUndefined();
        expect(console.dir()).toBeUndefined();
        expect(console.warn()).toBeUndefined();
        expect(console.error()).toBeUndefined();
        expect(console.log()).toBeUndefined();
        expect(console.profileEnd()).toBeUndefined();
        /* tslint:enable: no-console */
    });

    it("check nodePatch", () => {
        spyOn(Node.prototype, "appendChild").and.callFake((node: string) => {
            expect(node).toBe("appendChild:node");
        });
        spyOn(Node.prototype, "insertBefore").and.callFake((newElement: string, referenceElement: string) => {
            expect(newElement).toBe("insertBefore:newElement");
            expect(referenceElement).toBe("insertBefore:referenceElement");
        });

        (<any>CDP.Patch).nodePatch();
        const div = document.createElement("div");
        div.appendChild(<any>"appendChild:node");
        div.insertBefore(<any>"insertBefore:newElement", <any>"insertBefore:referenceElement");
    });
});
