import "../../src/scripts/cdp.tools";

import Template = CDP.Tools.Template;
import toUrl = CDP.toUrl;

// WebRoot is "/tests/runner"
const src = "/../unit/Template.spec.html";

describe("Tools.Template", () => {
    beforeEach(() => {
        Template.empty();
    });

    afterEach(() => {
        // noop.
    });

    it("getTemplateElement()", () => {
        const el = Template.getTemplateElement("#template-test", toUrl(src));
        expect(!!el).toBeTruthy();
        expect(!!el[0]).toBeTruthy();
        expect(el[0].id).toBe("template-test");
    });

    it("getTemplateElement(): invalid element", () => {
        const el = Template.getTemplateElement("#template-test-invalid", toUrl(src));
        expect(!!el).toBeTruthy();
        expect(!!el[0]).toBeFalsy();
    });

    it("getTemplateElement(): invalid url", () => {
        const el = Template.getTemplateElement("#template-test", "invalid-url");
        expect(!!el).toBeTruthy();
        expect(!!el[0]).toBeFalsy();
    });

    it("getTemplateElement() => getJST(key)", () => {
        const tmplEl = Template.getTemplateElement("#template-test", toUrl(src));
        const jst = Template.getJST(tmplEl);
        const el = $(jst({ message: "test message" }));
        expect(!!el).toBeTruthy();
        expect(!!el[0]).toBeTruthy();
        expect(el[0].className).toBe("template-test-message");
        expect(el[0].textContent).toBe("test message");
    });

    it("getJST(key, src)", () => {
        const jst = Template.getJST("#template-test", toUrl(src));
        const el = $(jst({ message: "test message" }));
        expect(!!el).toBeTruthy();
        expect(!!el[0]).toBeTruthy();
        expect(el[0].className).toBe("template-test-message");
        expect(el[0].textContent).toBe("test message");
    });

    it("getJST(key, src): invalid element", () => {
        const jst = Template.getJST("#template-test-invalid", toUrl(src));
        const el = $(jst({ message: "test message" }));
        expect(!!el).toBeTruthy();
        expect(!!el[0]).toBeFalsy();
    });

    it("getJST(key, src): invalid url", () => {
        const jst = Template.getJST("#template-test", "invalid-url");
        const el = $(jst({ message: "test message" }));
        expect(!!el).toBeTruthy();
        expect(!!el[0]).toBeFalsy();
    });

});
