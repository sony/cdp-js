import "../../src/scripts/cdp.ui.listview";

describe("TODO: suite", () => {
    let _testCaseFinished = false;
    beforeEach(() => {
        _testCaseFinished = false;
    });

    afterEach(() => {
        // noop.
    });

    it("TODO: case", () => {
        runs(() => {
            _testCaseFinished = true;
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "TODO: case", Infinity);
    });

});
