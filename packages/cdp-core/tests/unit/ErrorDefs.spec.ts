import "../../src/scripts/cdp.core";

describe("ErrorDefs", () => {
    const cause = CDP.ensureErrorInfo("I am cause error.");

    enum RESULT_CODE_BASE {
        TEST = 1 * CDP.MODULE_RESULT_CODE_RANGE,
    }
    CDP.ASSIGN_RESULT_CODE_BASE(RESULT_CODE_BASE);

    enum LOCAL_CODE_BASE {
        SPEC = 0,
    }

    enum RESULT_CODE {
        ERROR_SPEC_TEST = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.TEST, LOCAL_CODE_BASE.SPEC + 1, "raw test error message"),
    }
    CDP.ASSIGN_RESULT_CODE(RESULT_CODE);

    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("makeErrorInfo()", () => {
        const errorInfo = CDP.makeErrorInfo(RESULT_CODE.ERROR_SPEC_TEST, "[ErrorDefs.spec]", "override error message", cause);
        expect(errorInfo instanceof Error).toBeTruthy();
        expect(errorInfo.code).toBe(-1001);
        expect(errorInfo.name).toBe("[ErrorDefs.spec]ERROR_SPEC_TEST: ");
        expect(errorInfo.message).toBe("override error message");
        expect(errorInfo.cause).not.toBeNull();
        expect(errorInfo.cause.message).toBe("I am cause error.");

        const errorInfo2 = CDP.makeErrorInfo(RESULT_CODE.ERROR_SPEC_TEST);
        expect(errorInfo2 instanceof Error).toBeTruthy();
        expect(errorInfo2.code).toBe(-1001);
        expect(errorInfo2.name).toBe("ERROR_SPEC_TEST: ");
        expect(errorInfo2.message).toBe("raw test error message");
        expect(errorInfo2.cause).toBeUndefined();
    });

    it("makeCanceledErrorInfo()", () => {
        const errorInfo = CDP.makeCanceledErrorInfo("[ErrorDefs.spec]", cause);
        expect(errorInfo instanceof Error).toBeTruthy();
        expect(errorInfo.code).toBe(1);
        expect(errorInfo.name).toBe("[ErrorDefs.spec]CANCELED: ");
        expect(errorInfo.message).toBe("abort");
        expect(errorInfo.cause).not.toBeNull();
        expect(errorInfo.cause.message).toBe("I am cause error.");

        const errorInfo2 = CDP.makeCanceledErrorInfo();
        expect(errorInfo2 instanceof Error).toBeTruthy();
        expect(errorInfo2.code).toBe(1);
        expect(errorInfo2.name).toBe("CANCELED: ");
        expect(errorInfo2.message).toBe("abort");
        expect(errorInfo2.cause).toBeUndefined();
    });

    it("isCanceledError()", () => {
        const errorInfo = CDP.makeErrorInfo(RESULT_CODE.ERROR_SPEC_TEST);
        expect(CDP.isCanceledError(errorInfo)).toBeFalsy();
        expect(CDP.isCanceledError("error")).toBeFalsy();

        const canceledInfo = CDP.makeCanceledErrorInfo();
        expect(CDP.isCanceledError(canceledInfo)).toBeTruthy();
        expect(CDP.isCanceledError("abort")).toBeTruthy();
    });

    it("ensureErrorInfo()", () => {
        const base = CDP.makeErrorInfo(RESULT_CODE.ERROR_SPEC_TEST, "[ErrorDefs.spec]", "override error message", cause);
        const errorInfo1 = CDP.ensureErrorInfo(base);
        expect(base === errorInfo1).toBeTruthy();

        const cancel = CDP.makeCanceledErrorInfo();
        const errorInfo2 = CDP.ensureErrorInfo(cancel);
        expect(cancel === errorInfo2).toBeTruthy();

        const error = new Error("general error");
        const errorInfo3 = CDP.ensureErrorInfo(error);
        expect(errorInfo3 instanceof Error).toBeTruthy();
        expect(errorInfo3.name).toBe("Error");
        expect(errorInfo3.message).toBe("general error");
        expect(errorInfo3.code).toBe(-1);

        const errorInfo4 = CDP.ensureErrorInfo("error!");
        expect(errorInfo4.name).toBe("Unknown Error: ");
        expect(errorInfo4.message).toBe("error!");
        expect(errorInfo4.code).toBe(-1);

        const errorInfo5 = CDP.ensureErrorInfo("abort");
        expect(errorInfo5.name).toBe("CANCELED: ");
        expect(errorInfo5.message).toBe("abort");
        expect(errorInfo5.code).toBe(1);

        const errorInfo6 = CDP.ensureErrorInfo(-1002);
        expect(errorInfo6.name).toBe("Unknown Error: ");
        expect(errorInfo6.message).toBe("unknown error occured.");
        expect(errorInfo6.code).toBe(-1);
        expect(errorInfo6.cause).not.toBeUndefined();
        expect(errorInfo6.cause.name).toBe("Unknown Error: ");
        expect(errorInfo6.cause.message).toBe("Please check the error code.");
        expect((<CDP.ErrorInfo>errorInfo6.cause).code).toBe(-1002);

        const errorInfo7 = CDP.ensureErrorInfo({ prop: "hoge" });
        expect(errorInfo7.name).toBe("Unknown Error: ");
        expect(errorInfo7.message).toBe("unknown error occured.");
        expect(errorInfo7.code).toBe(-1);
        expect((<any>errorInfo7).prop).toBe("hoge");

        const errorInfo8 = CDP.ensureErrorInfo();
        expect(errorInfo8.name).toBe("Unknown Error: ");
        expect(errorInfo8.message).toBe("unknown error occured.");
        expect(errorInfo8.code).toBe(-1);
    });

    it("RESULT_CODE judge helper", () => {
        expect(CDP.SUCCEEDED(1)).toBeTruthy();
        expect(CDP.SUCCEEDED(0)).toBeTruthy();
        expect(CDP.SUCCEEDED(-1)).toBeFalsy();
        expect(CDP.FAILED(1)).toBeFalsy();
        expect(CDP.FAILED(0)).toBeFalsy();
        expect(CDP.FAILED(-1)).toBeTruthy();
    });

    it("RESULT_CODE declaration", () => {
        const sc1 = CDP.DECLARE_SUCCESS_CODE(RESULT_CODE_BASE.TEST, LOCAL_CODE_BASE.SPEC + 1);
        expect(CDP.SUCCEEDED(sc1)).toBeTruthy();
        expect(sc1).toBe(1001);
        const sc2 = CDP.DECLARE_SUCCESS_CODE("TEST", LOCAL_CODE_BASE.SPEC + 2);
        expect(CDP.SUCCEEDED(sc2)).toBeTruthy();
        expect(sc2).toBe(1002);

        const ec1 = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.TEST, LOCAL_CODE_BASE.SPEC + 2);
        expect(CDP.FAILED(ec1)).toBeTruthy();
        expect(ec1).toBe(-1002);
        const ec2 = CDP.DECLARE_ERROR_CODE("TEST", LOCAL_CODE_BASE.SPEC + 3);
        expect(CDP.FAILED(ec2)).toBeTruthy();
        expect(ec2).toBe(-1003);
    });

    it("RESULT_CODE declaration failer", () => {
        const ec1 = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.TEST, -1);
        expect(ec1).toBeUndefined();
        const ec2 = CDP.DECLARE_ERROR_CODE(RESULT_CODE_BASE.TEST, 1001);
        expect(ec2).toBeUndefined();

        const ei = CDP.makeErrorInfo(-2001);
        expect(ei instanceof Error).toBeTruthy();
        expect(ei.code).toBe(-2001);
        expect(ei.name).toBe("Unknown Error: ");
        expect(ei.message).toBe("unregistered result code. [RESULT_CODE: -2001]");
    });
});
