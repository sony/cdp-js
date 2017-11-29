import "../../src/scripts/cdp.tools";

import ProgressCounter = CDP.Tools.ProgressCounter;

const DEFAULT_TIMEOUT = 100;

describe("Tools.ProgressCounter", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("constructor()", () => {
        const counter = new ProgressCounter();
        const result = counter.compute(0);
        expect(result).not.toBeNull();
        expect(result.remainTime).toBe(Infinity);
    });

    it("reset()", (done) => {
        const counter = new ProgressCounter();
        setTimeout(() => {
            const resultBefore = counter.compute(0);
            expect(resultBefore).not.toBeNull();
            expect(resultBefore.passTime).toBeGreaterThan(DEFAULT_TIMEOUT);
            counter.reset();
            const resultAfter = counter.compute(0);
            expect(resultAfter).not.toBeNull();
            expect(resultAfter.passTime).toBeLessThan(DEFAULT_TIMEOUT);
            done();
        }, DEFAULT_TIMEOUT);
    });

    it("compute()", () => {
        const counter = new ProgressCounter();
        const result50 = counter.compute(50);
        expect(result50).not.toBeNull();
        expect(result50.passTime).toBe(result50.remainTime);
        const result100 = counter.compute(100);
        expect(result100).not.toBeNull();
        expect(result100.remainTime).toBe(0);
    });

    it("options.max:10", () => {
        const options = { max: 10 };
        const counter = new ProgressCounter(options);
        const result = counter.compute(10);
        expect(result).not.toBeNull();
        expect(result.remainTime).toBe(0);
    });

    it("options.max:1000", () => {
        const options = { max: 1000 };
        const counter = new ProgressCounter(options);
        const result = counter.compute(1000);
        expect(result).not.toBeNull();
        expect(result.remainTime).toBe(0);
    });

    it("options.allowIncrementRemain", (done) => {
        const options = { allowIncrementRemain: true };
        const counter = new ProgressCounter(options);
        const resultBefore = counter.compute(50);
        expect(resultBefore).not.toBeNull();
        setTimeout(() => {
            const resultAfter = counter.compute(50);
            expect(resultAfter).not.toBeNull();
            expect(resultAfter.remainTime).toBeGreaterThan(resultBefore.remainTime);
            done();
        }, DEFAULT_TIMEOUT);
    });
});
