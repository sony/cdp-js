import "../../src/scripts/cdp.core";

describe("cdp.core spec", () => {
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
                throw {
                    message: "CDP.initialize(), failed.",
                };
            }
        });
    });
});
