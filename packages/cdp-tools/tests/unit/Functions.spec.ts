import "../../src/scripts/cdp.tools";

import Tools = CDP.Tools;

class InheritSuperClass {
    private _memberA: string = undefined;

    constructor() {
        this.setup();
    }

    // インスタンスメンバ反映用疑似コンストラクタ
    setup() {
        this._memberA = "methodA";
    }

    methodA(): string {
        return this._memberA;
    }

    /* tslint:disable:no-unused-variable */
    private methodB(): string {
        return "methodB";
    }
    /* tslint:enable:no-unused-variable */
}

class InheritSubClass {
    private _memberB: string = "methodC";

    constructor() {
        if (!!(<any>this).setup) {
            (<any>this).setup();
        }
    }

    methodC(): string {
        return this._memberB;
    }

    /* tslint:disable:no-unused-variable */
    private methodD(): string {
        return "methodD";
    }
    /* tslint:enable:no-unused-variable */
}

class MixInSrcA {
    _memberA: string;
    public methodA(): string {
        return this._memberA;
    }
}

class MixInSrcB {
    _memberB: string;
    public methodB(): string {
        return this._memberB;
    }
}

class MixInDerived implements MixInSrcA, MixInSrcB {
    _memberA: string = "derived_memberA";
    _memberB: string = "derived_memberB";
    public methodA: () => string;
    public methodB: () => string;
}
const Functions = Tools;

describe("Tools.Functions", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("abs()", () => {
        expect(Functions.abs(-10)).toEqual(10);
        expect(Functions.abs(0)).toEqual(0);
        expect(Functions.abs(10)).toEqual(10);
        expect(Functions.abs(-10.01)).toEqual(10.01);
        expect(Functions.abs(10.01)).toEqual(10.01);
        expect(Functions.abs(-10 / 3)).toBeCloseTo(3.333, 0.4);
        expect(Functions.abs(10 / 3)).toBeCloseTo(3.333, 0.4);
        expect(Functions.abs(-Infinity)).toEqual(Infinity);
        expect(Functions.abs(Infinity)).toEqual(Infinity);
        expect(Functions.abs(NaN)).toBeNaN();
    });

    it("max()", () => {
        expect(Functions.max(-10, 0)).toEqual(0);
        expect(Functions.max(0, 10)).toEqual(10);
        expect(Functions.max(10, 10)).toEqual(10);
        expect(Functions.max(NaN, 10)).toEqual(10);
        expect(Functions.max(10, NaN)).toBeNaN();
        expect(Functions.max(Infinity, 10)).toEqual(Infinity);
        expect(Functions.max(-Infinity, 10)).toEqual(10);
        expect(Functions.max(10, Infinity)).toEqual(Infinity);
        expect(Functions.max(10, -Infinity)).toEqual(10);
    });

    it("min()", () => {
        expect(Functions.min(-10, 0)).toEqual(-10);
        expect(Functions.min(0, 10)).toEqual(0);
        expect(Functions.min(10, 10)).toEqual(10);
        expect(Functions.min(NaN, 10)).toEqual(10);
        expect(Functions.min(10, NaN)).toBeNaN();
        expect(Functions.min(Infinity, 10)).toEqual(10);
        expect(Functions.min(-Infinity, 10)).toEqual(-Infinity);
        expect(Functions.min(10, Infinity)).toEqual(10);
        expect(Functions.min(10, -Infinity)).toEqual(-Infinity);
    });

    it("toZeroPadding()", () => {
        expect(Functions.toZeroPadding(1, 2)).toEqual("01");
        expect(Functions.toZeroPadding(2, 3)).toEqual("002");
        expect(Functions.toZeroPadding(30, 3)).toEqual("030");
        expect(Functions.toZeroPadding(400, 3)).toEqual("400");
        expect(Functions.toZeroPadding(560, 2)).toEqual("60");
        expect(Functions.toZeroPadding(789, 2)).toEqual("89");
        expect(Functions.toZeroPadding(-1, 2)).toEqual("-01");
        expect(Functions.toZeroPadding(-1, 3)).toEqual("-001");
        expect(Functions.toZeroPadding(-123, 4)).toEqual("-0123");
        expect(Functions.toZeroPadding(1, 1)).toEqual("1");
        expect(Functions.toZeroPadding(1, 0)).toBeNull();
        expect(Functions.toZeroPadding(1, -1)).toBeNull();
        expect(Functions.toZeroPadding(NaN, 2)).toBeNull();
        expect(Functions.toZeroPadding(1, NaN)).toBeNull();
    });

    it("toStringChunks()", () => {
        const src = "0123456789";
        const chunks = Functions.toStringChunks(src, 2);

        expect(chunks.length).toEqual(6);
        expect(chunks[0]).toEqual("01");
        expect(chunks[1]).toEqual("2");
        expect(chunks[2]).toEqual("34");
        expect(chunks[3]).toEqual("56");
        expect(chunks[4]).toEqual("7");
        expect(chunks[5]).toEqual("89");
    });

    it("inherit()", () => {
        const dstOrg = <any>new InheritSubClass();
        expect(dstOrg._memberA).toBeUndefined();
        expect(dstOrg._memberB).toEqual("methodC");
        expect(dstOrg.methodA).toBeUndefined();
        expect(dstOrg.methodB).toBeUndefined();
        expect(dstOrg.methodC).not.toBeUndefined();
        expect(dstOrg.methodD).not.toBeUndefined();

        (() => {
            Functions.inherit(InheritSubClass, InheritSuperClass);
            const inherited = <any>new InheritSubClass();
            expect(inherited._memberA).toEqual("methodA");
            expect(inherited._memberB).toEqual("methodC");
            expect(inherited.methodA()).toEqual("methodA");
            expect(inherited.methodB()).toEqual("methodB");
            expect(inherited.methodC()).toEqual("methodC");
            expect(inherited.methodD()).toEqual("methodD");
        })();
    });

    it("mixin()", () => {
        const derived = <any>new MixInDerived();
        expect(derived._memberA).toEqual("derived_memberA");
        expect(derived._memberB).toEqual("derived_memberB");
        expect(derived.methodA).toBeUndefined();
        expect(derived.methodB).toBeUndefined();

        (() => {
            Functions.mixin(MixInDerived, MixInSrcA, MixInSrcB);
            const mixined = <any>new MixInDerived();
            expect(mixined._memberA).toEqual("derived_memberA");
            expect(mixined._memberB).toEqual("derived_memberB");
            expect(mixined.methodA()).toEqual("derived_memberA");
            expect(mixined.methodB()).toEqual("derived_memberB");
        })();
    });
});
