import * as Framework from "cdp/framework";
import PictureList from "../../app/scripts/model/picture-list";

describe("PictureList", () => {
    let _toUrlOrg;
    let collection: PictureList = null;

    function toUrl(path: string): string {
        const result = /([\s\S]+)(tests\/runner\/index.mustache)/.exec(location.href);
        const root = result[1] + "app/";
        return root + path;
    }

    beforeEach(() => {
        _toUrlOrg = Framework.toUrl;
        (<any>Framework).toUrl = toUrl;
        collection = new PictureList();
    });

    afterEach(() => {
        collection = null;
        (<any>Framework).toUrl = _toUrlOrg;
    });

    it("can new", () => {
        expect(new PictureList()).not.toBe(null);
    });

    it("can fetch", (done) => {
        collection.setTargetKind("animal");
        collection.fetch({
            success: () => {
                expect(collection.length).toEqual(3);
                expect(collection.at(0).get("name")).toEqual("コアラ");
                expect(collection.at(1).get("name")).toEqual("クラゲ");
                expect(collection.at(2).get("name")).toEqual("ペンギン達");
                done();
            },
            error: () => {
                expect("THIS FLOW IS ").toEqual("BUG!");
                done();
            },
        });
    });
});
