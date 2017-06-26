import "../../src/scripts/cdp.i18n";

describe("CDP.i18n", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("can initializeI18N", (done) => {
        expect(CDP).toBeDefined();
        CDP.initializeI18N({
            fallbackResources: {
            },
            options: {
            },
        })
            .then(() => {
                expect("OK").toBe("OK");
                done();
            });
    });

    it("TODO", () => {
        expect("TODO").toEqual("TODO");
    });
});
