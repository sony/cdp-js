import "../../src/scripts/cdp.core";

describe("Core", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("check root object", () => {
        expect(CDP).not.toBeNull();
    });

    it("check global", () => {
        expect(CDP.global).not.toBeNull();
        expect(CDP.global).toBe(window);
    });

    it("check webRoot", () => {
        expect(/^http:\/\/localhost:7357\//.test(CDP.webRoot)).toBeTruthy();
    });

    it("check toUrl", () => {
        expect(CDP.toUrl).not.toBeNull();
        const regexp = new RegExp("^http:\\/\\/localhost:7357\\/\\d+\\/tests\\/runner\\/res\\/data\\/collection.json$");
        const path1 = "/res/data/collection.json";
        expect(regexp.test(CDP.toUrl(path1))).toBeTruthy();
        const path2 = "res/data/collection.json";
        expect(regexp.test(CDP.toUrl(path2))).toBeTruthy();
        const regexpNul = new RegExp("^http:\\/\\/localhost:7357\\/\\d+\\/tests\\/runner\\/$");
        expect(regexpNul.test(CDP.toUrl(null))).toBeTruthy();
    });

    describe("special case", () => {
        const _webRoot = CDP.webRoot;
        beforeEach(() => {
            (<any>CDP).webRoot = null;
        });

        afterEach(() => {
            (<any>CDP).webRoot = _webRoot;
        });

        it("toUrl special case", () => {
            const path1 = "/res/data/collection.json";
            expect(CDP.toUrl(path1)).toBe("res/data/collection.json");
            const path2 = "res/data/collection.json";
            expect(CDP.toUrl(path2)).toBe("res/data/collection.json");
        });
    });

    it("check Config", () => {
        expect(CDP.Config).not.toBeNull();
        expect(CDP.Config.DEBUG).toBeTruthy();
    });

    it("has initialize", () => {
        expect(CDP.initialize).not.toBeNull();
        expect(typeof CDP.initialize).toEqual("function");
    });

    it("check initialize", (done) => {
        CDP.initialize({
            success: () => {
                expect("CDP.initialize() success").not.toBeNull();
                done();
            },
            fail: (error) => {
                expect(error).toBe("THIS FLOW IS BUG");
                done();
            }
        });
    });

    it("check initialize fail", (done) => {
        spyOn(CDP.Patch, "apply").and.callFake(() => {
            throw "!! FAKE PATCH FAILER !!";
        });
        CDP.initialize({
            success: () => {
                expect("CDP.initialize() success").toBe("THIS FLOW IS BUG");
                done();
            },
            fail: (error: CDP.ErrorInfo) => {
                expect(error).not.toBeNull();
                expect(error.code).toBe(CDP.RESULT_CODE.ERROR_CDP_INITIALIZE_FAILED);
                expect(error.message).toBe("!! FAKE PATCH FAILER !!");
                expect(error.cause).not.toBeNull();
                expect(error.cause.message).toBe("!! FAKE PATCH FAILER !!");
                done();
            }
        });
    });
});
