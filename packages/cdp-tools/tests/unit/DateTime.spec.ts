import "../../src/scripts/cdp.tools";

import DateTime = CDP.Tools.DateTime;

describe("Tools.DateTime", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("convertISOStringToDate(2013-07-08T20:43:49.806)", () => {
        const iso = "2013-07-08T20:43:49.806";
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getFullYear()).toBe(2013);
        expect(date.getMonth()).toBe(6);
        expect(date.getDate()).toBe(8);
        expect(date.getHours()).toBe(20);
        expect(date.getMinutes()).toBe(43);
        expect(date.getSeconds()).toBe(49);
        expect(date.getMilliseconds()).toBe(806);
    });

    it("convertISOStringToDate(2013-07-08)", () => {
        const iso = "2013-07-08";
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getFullYear()).toBe(2013);
        expect(date.getMonth()).toBe(6);
        expect(date.getDate()).toBe(8);
        expect(date.getHours()).toBe(0);
        expect(date.getMinutes()).toBe(0);
        expect(date.getSeconds()).toBe(0);
        expect(date.getMilliseconds()).toBe(0);
    });

    it("convertISOStringToDate(2013-07)", () => {
        const iso = "2013-07";
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getFullYear()).toBe(2013);
        expect(date.getMonth()).toBe(6);
        expect(date.getDate()).toBe(1);
    });

    it("convertISOStringToDate(2013)", () => {
        const iso = "2013";
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getFullYear()).toBe(2013);
        expect(date.getMonth()).toBe(0);
        expect(date.getDate()).toBe(1);
    });

    it("convertDateToISOString()", () => {
        const iso = "2013-07-08T20:43:49.806";
        const date = DateTime.convertISOStringToDate(iso);
        const conv = DateTime.convertDateToISOString(date);
        expect(conv).toBe(iso);
    });

    it("convertDateToISOString(2013-07)", () => {
        const iso = "2013-07-08T20:43:49.806";
        const date = DateTime.convertISOStringToDate(iso);
        const conv = DateTime.convertDateToISOString(date, "month");
        expect(conv).toBe("2013-07");
    });

    it("convertFileSystemStringToDate(2013_07_08T20_43_49_806)", () => {
        const iso = "2013_07_08T20_43_49_806";
        const date = DateTime.convertFileSystemStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getFullYear()).toBe(2013);
        expect(date.getMonth()).toBe(6);
        expect(date.getDate()).toBe(8);
        expect(date.getHours()).toBe(20);
        expect(date.getMinutes()).toBe(43);
        expect(date.getSeconds()).toBe(49);
        expect(date.getMilliseconds()).toBe(806);
    });

    it("convertDateToFileSystemString()", () => {
        const iso = "2013-07-08T20:43:49.806";
        const date = DateTime.convertISOStringToDate(iso);
        const conv = DateTime.convertDateToFileSystemString(date);
        expect(conv).toBe("2013_07_08T20_43_49_806");
    });

    it("computeDate()", () => {
        const iso = "2013-07-08T20:43:49.806";
        const base = DateTime.convertISOStringToDate(iso);
        let date = DateTime.computeDate(base, 24);
        expect(date.getMonth()).toBe(7);
        expect(date.getDate()).toBe(1);
        date = DateTime.computeDate(base, -24);
        expect(date.getMonth()).toBe(5);
        expect(date.getDate()).toBe(14);
    });
});
