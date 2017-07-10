import CheckModel from "../../app/scripts/model/sample-model";
import { MainView } from "../../app/scripts/view/main-view";


describe("test sample", () => {
    beforeEach(() => {
        // TODO:
    });
    afterEach(() => {
        // TODO:
    });

    it("cool method", () => {
        expect(CheckModel.coolMethod("World.")).toBe("Hello cool World.");
    });

    it("async template", (done) => {
        setTimeout(() => {
            expect(CheckModel.coolMethod("async test.")).toBe("Hello cool async test.");
            done();
        });
    });

    it("check external", () => {
        expect($).not.toBeUndefined();
    });

    it("check MainView", () => {
        expect(MainView).not.toBeUndefined();
    });
});
