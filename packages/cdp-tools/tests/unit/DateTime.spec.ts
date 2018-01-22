import "../../src/scripts/cdp.tools";

import DateTime = CDP.Tools.DateTime;

describe("Tools.DateTime", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("convertISOStringToDate(2013-07-08T20:43:49.806Z)", () => {
        const iso = "2013-07-08T20:43:49.806Z";
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getUTCFullYear()).toBe(2013);
        expect(date.getUTCMonth()).toBe(6);
        expect(date.getUTCDate()).toBe(8);
        expect(date.getUTCHours()).toBe(20);
        expect(date.getUTCMinutes()).toBe(43);
        expect(date.getUTCSeconds()).toBe(49);
        expect(date.getUTCMilliseconds()).toBe(806);
    });

    it("convertISOStringToDate(2013-07-08T20:43:49.806)", () => {
        const iso = "2013-07-08T20:43:49.806";
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getUTCFullYear()).toBe(2013);
        expect(date.getUTCMonth()).toBe(6);
        expect(date.getUTCDate()).toBe(8);
        expect(date.getUTCHours()).toBe(20);
        expect(date.getUTCMinutes()).toBe(43);
        expect(date.getUTCSeconds()).toBe(49);
        expect(date.getUTCMilliseconds()).toBe(806);
    });

    it("convertISOStringToDate(2013-07-08T20:43:49)", () => {
        const iso = "2013-07-08T20:43:49";
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getUTCFullYear()).toBe(2013);
        expect(date.getUTCMonth()).toBe(6);
        expect(date.getUTCDate()).toBe(8);
        expect(date.getUTCHours()).toBe(20);
        expect(date.getUTCMinutes()).toBe(43);
        expect(date.getUTCSeconds()).toBe(49);
        expect(date.getUTCMilliseconds()).toBe(0);
    });

    it("convertISOStringToDate(2013-07-08T20:43)", () => {
        const iso = "2013-07-08T20:43";
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getUTCFullYear()).toBe(2013);
        expect(date.getUTCMonth()).toBe(6);
        expect(date.getUTCDate()).toBe(8);
        expect(date.getUTCHours()).toBe(20);
        expect(date.getUTCMinutes()).toBe(43);
        expect(date.getUTCSeconds()).toBe(0);
        expect(date.getUTCMilliseconds()).toBe(0);
    });

    it("convertISOStringToDate(2013-07-08)", () => {
        const iso = "2013-07-08";
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getUTCFullYear()).toBe(2013);
        expect(date.getUTCMonth()).toBe(6);
        expect(date.getUTCDate()).toBe(8);
        expect(date.getUTCHours()).toBe(0);
        expect(date.getUTCMinutes()).toBe(0);
        expect(date.getUTCSeconds()).toBe(0);
        expect(date.getUTCMilliseconds()).toBe(0);
    });

    it("convertISOStringToDate(2013-07)", () => {
        const iso = "2013-07";
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getUTCFullYear()).toBe(2013);
        expect(date.getUTCMonth()).toBe(6);
        expect(date.getUTCDate()).toBe(1);
        expect(date.getUTCHours()).toBe(0);
        expect(date.getUTCMinutes()).toBe(0);
        expect(date.getUTCSeconds()).toBe(0);
        expect(date.getUTCMilliseconds()).toBe(0);
    });

    it("convertISOStringToDate(2013)", () => {
        const iso = "2013";
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getUTCFullYear()).toBe(2013);
        expect(date.getUTCMonth()).toBe(0);
        expect(date.getUTCDate()).toBe(1);
        expect(date.getUTCHours()).toBe(0);
        expect(date.getUTCMinutes()).toBe(0);
        expect(date.getUTCSeconds()).toBe(0);
        expect(date.getUTCMilliseconds()).toBe(0);
    });

    it("convertISOStringToDate(2013-07-08T20:43:49.806+09:00)", () => {
        const iso = "2013-07-08T20:43:49.806+09:00"; // 2013-07-08T11:43:49.806Z
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getUTCFullYear()).toBe(2013);
        expect(date.getUTCMonth()).toBe(6);
        expect(date.getUTCDate()).toBe(8);
        expect(date.getUTCHours()).toBe(11);
        expect(date.getUTCMinutes()).toBe(43);
        expect(date.getUTCSeconds()).toBe(49);
        expect(date.getUTCMilliseconds()).toBe(806);
    });

    it("convertISOStringToDate(-002013-07-08T20:43:49.806Z)", () => {
        const iso = "-002013-07-08T20:43:49.806Z";
        const date = DateTime.convertISOStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getUTCFullYear()).toBe(-2013);
        expect(date.getUTCMonth()).toBe(6);
        expect(date.getUTCDate()).toBe(8);
        expect(date.getUTCHours()).toBe(20);
        expect(date.getUTCMinutes()).toBe(43);
        expect(date.getUTCSeconds()).toBe(49);
        expect(date.getUTCMilliseconds()).toBe(806);
    });

    it("convertDateToISOString(2013-07-08T20:43:49.806Z)", () => {
        const iso = "2013-07-08T20:43:49.806Z";
        const date = DateTime.convertISOStringToDate(iso);
        let conv = DateTime.convertDateToISOString(date);
        expect(conv).toBe("2013-07-08T20:43:49.806Z");
        conv = DateTime.convertDateToISOString(date, "msec");
        expect(conv).toBe("2013-07-08T20:43:49.806");
        conv = DateTime.convertDateToISOString(date, "sec");
        expect(conv).toBe("2013-07-08T20:43:49");
        conv = DateTime.convertDateToISOString(date, "min");
        expect(conv).toBe("2013-07-08T20:43");
        conv = DateTime.convertDateToISOString(date, "date");
        expect(conv).toBe("2013-07-08");
        conv = DateTime.convertDateToISOString(date, "month");
        expect(conv).toBe("2013-07");
        conv = DateTime.convertDateToISOString(date, "year");
        expect(conv).toBe("2013");
        conv = DateTime.convertDateToISOString(date, "unknown"/* tz */);
        expect(conv).toBe("2013-07-08T20:43:49.806Z");
    });

    it("convertDateToISOString(2013-07-08T20:43:49.806+09:00)", () => {
        const iso = "2013-07-08T20:43:49.806+09:00"; // 2013-07-08T11:43:49.806Z
        const date = DateTime.convertISOStringToDate(iso);
        const conv = DateTime.convertDateToISOString(date);
        expect(conv).toBe("2013-07-08T11:43:49.806Z");
    });

    it("convertDateToISOString(-002013-07-08T20:43:49.806Z)", () => {
        const iso = "-002013-07-08T20:43:49.806Z";
        const date = DateTime.convertISOStringToDate(iso);
        const conv = DateTime.convertDateToISOString(date);
        expect(conv).toBe(iso);
    });

    it("convertFileSystemStringToDate(2013_07_08T20_43_49_806)", () => {
        const iso = "2013_07_08T20_43_49_806";
        const date = DateTime.convertFileSystemStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getUTCFullYear()).toBe(2013);
        expect(date.getUTCMonth()).toBe(6);
        expect(date.getUTCDate()).toBe(8);
        expect(date.getUTCHours()).toBe(20);
        expect(date.getUTCMinutes()).toBe(43);
        expect(date.getUTCSeconds()).toBe(49);
        expect(date.getUTCMilliseconds()).toBe(806);
    });

    it("convertFileSystemStringToDate(2013_07_08T20_43)", () => {
        const iso = "2013_07_08T20_43";
        const date = DateTime.convertFileSystemStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getUTCFullYear()).toBe(2013);
        expect(date.getUTCMonth()).toBe(6);
        expect(date.getUTCDate()).toBe(8);
        expect(date.getUTCHours()).toBe(20);
        expect(date.getUTCMinutes()).toBe(43);
        expect(date.getUTCSeconds()).toBe(0);
        expect(date.getUTCMilliseconds()).toBe(0);
    });

    it("convertFileSystemStringToDate(2013_07_08)", () => {
        const iso = "2013_07_08";
        const date = DateTime.convertFileSystemStringToDate(iso);
        expect(date).not.toBeNull();
        expect(date.getUTCFullYear()).toBe(2013);
        expect(date.getUTCMonth()).toBe(6);
        expect(date.getUTCDate()).toBe(8);
        expect(date.getUTCHours()).toBe(0);
        expect(date.getUTCMinutes()).toBe(0);
        expect(date.getUTCSeconds()).toBe(0);
        expect(date.getUTCMilliseconds()).toBe(0);
    });

    it("convertDateToFileSystemString()", () => {
        const iso = "2013-07-08T20:43:49.806Z";
        const date = DateTime.convertISOStringToDate(iso);
        let conv = DateTime.convertDateToFileSystemString(date /* msec */);
        expect(conv).toBe("2013_07_08T20_43_49_806");
        conv = DateTime.convertDateToFileSystemString(date, "sec");
        expect(conv).toBe("2013_07_08T20_43_49");
        conv = DateTime.convertDateToFileSystemString(date, "min");
        expect(conv).toBe("2013_07_08T20_43");
        conv = DateTime.convertDateToFileSystemString(date, "date");
        expect(conv).toBe("2013_07_08");
        conv = DateTime.convertDateToFileSystemString(date, "month");
        expect(conv).toBe("2013_07");
        conv = DateTime.convertDateToFileSystemString(date, "year");
        expect(conv).toBe("2013");
    });

    it("computeDate()", () => {
        const iso = "2013-07-08T20:43:49.806Z";
        const base = DateTime.convertISOStringToDate(iso);
        let date = DateTime.computeDate(base, 2, "year");
        expect(date.getUTCFullYear()).toBe(2015);
        date = DateTime.computeDate(base, -4, "month");
        expect(date.getUTCMonth()).toBe(2);
        date = DateTime.computeDate(base, 8 /* date */);
        expect(date.getUTCDate()).toBe(16);
        date = DateTime.computeDate(base, -16, "hour");
        expect(date.getUTCHours()).toBe(4);
        date = DateTime.computeDate(base, 32, "min");
        expect(date.getUTCHours()).toBe(21);
        expect(date.getUTCMinutes()).toBe(15);
        date = DateTime.computeDate(base, -64, "sec");
        expect(date.getUTCMinutes()).toBe(42);
        expect(date.getUTCSeconds()).toBe(45);
        date = DateTime.computeDate(base, 128, "msec");
        expect(date.getUTCMilliseconds()).toBe(934);
        date = DateTime.computeDate(base, 8, "unknown" /* date */);
        expect(date.getUTCDate()).toBe(16);
    });
});
