import * as Backbone from "backbone";
import Picture from "../../app/scripts/model/picture";

describe("Picture", () => {
    let model: Picture = null;
    let defaultSync: any = Backbone.sync;

    function nullSync(): JQueryPromise<any> {
        return $.Deferred().resolve();
    }

    beforeEach(() => {
        (<any>Backbone).sync = nullSync;
        model = new Picture();
    });

    afterEach(() => {
        model = null;
        (<any>Backbone).sync = defaultSync;
    });

    it("can new", () => {
        expect(new Picture()).not.toBe(null);
    });

    it("check setter and getter", () => {
        expect(model.get("date")).not.toBeNull();
        expect(model.get("name")).toEqual("");
        expect(model.get("kind")).toEqual("");
        expect(model.get("src")).toEqual("");
        expect(model.get("desc")).toEqual("");

        model.set("name", "hoge");
        model.set("kind", "test");
        model.set("src", "a:\\test.com");
        model.set("desc", "This is Test.");

        expect(model.get("name")).toEqual("hoge");
        expect(model.get("kind")).toEqual("test");
        expect(model.get("src")).toEqual("a:\\test.com");
        expect(model.get("desc")).toEqual("This is Test.");

        const model2 = new Picture({
            name: "fuga_name",
            kind: "fuga_kind",
            src: "fuga_src",
            desc: "fuga_desc",
        });
        expect(model2.get("date")).not.toBeNull();
        expect(model2.get("name")).toEqual("fuga_name");
        expect(model2.get("kind")).toEqual("fuga_kind");
        expect(model2.get("src")).toEqual("fuga_src");
        expect(model2.get("desc")).toEqual("fuga_desc");
    });

    it("check validater", () => {
        expect(model.save()).toBeFalsy();
        model.set("name", "hoge");
        expect(model.save()).toBeTruthy();
    });
});
