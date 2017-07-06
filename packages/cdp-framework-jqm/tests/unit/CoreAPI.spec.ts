import "../../src/scripts/cdp.framework.jqm";

import Framework = CDP.Framework;

describe("CoreAPI spec", () => {
    beforeEach(() => {
        // noop.
    });
    afterEach(() => {
        // noop.
    });

    it("initialize check", (done) => {
        Framework.initialize({
            i18n: {
                fallbackResources: {},
                options: {},
            }
        })
            .then(() => {
                expect("SUCCEEDED").toEqual("SUCCEEDED");
                done();
            });
    });
});
