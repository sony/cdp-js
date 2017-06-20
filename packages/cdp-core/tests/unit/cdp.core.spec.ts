/// <reference path="../../external/include/external.d.ts" />
/// <reference path="../../src/scripts/cdp.core.d.ts" />

namespace Test {

    describe("cdp.core spec", () => {
        let _testCaseFinished = false;

        beforeEach(() => {
            _testCaseFinished = false;
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
            expect(CDP.webRoot).toEqual("http://localhost:7357/");
        });

        it("check Config", () => {
            expect(CDP.Config).not.toBeNull();
            expect(CDP.Config.DEBUG).toBeTruthy();
        });

        it("has initialize", () => {
            expect(CDP.initialize).not.toBeNull();
            expect(typeof CDP.initialize).toEqual("function");
        });

        it("check initialize", () => {
            runs(() => {
                CDP.initialize({
                    success: () => {
                        _testCaseFinished = true;
                    },
                    fail: (error) => {
                        _testCaseFinished = true;
                        throw {
                            message: "CDP.initialize(), failed.",
                        };
                    }
                });
            });

            waitsFor(() => {
                return _testCaseFinished;
            }, "CDP.initialize()", 200);
        });

    });
}
