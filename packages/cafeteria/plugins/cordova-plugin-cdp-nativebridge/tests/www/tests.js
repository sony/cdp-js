/*!
 * tests.js 1.0.1
 *
 * Date: 2016-03-23T21:32:53
 */



var NativeBridge = CDP.Plugin.NativeBridge;
exports.defineAutoTests = function () {
    describe("NativeBridge object existance check", function () {
        it("CDP.Plugin.NativeBridge", function () {
            expect(CDP.Plugin.NativeBridge).toBeDefined();
        });
    });
    describe("NativeBridge instance check", function () {
        it("can new NativeBridge", function () {
            var instance = new NativeBridge({
                name: "Hoge",
                android: { packageInfo: "com.sony.cdp.nativebridge.cordova.Hoge" },
                ios: { packageInfo: "CDVNBHoge" }
            });
            expect(instance).not.toBeNull();
        });
        it("support miss new", function () {
            var instance = NativeBridge({
                name: "Hoge",
                android: { packageInfo: "com.sony.cdp.nativebridge.cordova.Hoge" },
                ios: { packageInfo: "CDVNBHoge" }
            });
            expect(instance).not.toBeNull();
            expect(instance instanceof NativeBridge).toBe(true);
        });
        it("different instance", function () {
            var inst1 = new NativeBridge({
                name: "Hoge",
                android: { packageInfo: "com.sony.cdp.nativebridge.cordova.Hoge" },
                ios: { packageInfo: "CDVNBHoge" }
            });
            var inst2 = new NativeBridge({
                name: "Hoge",
                android: { packageInfo: "com.sony.cdp.nativebridge.cordova.Hoge" },
                ios: { packageInfo: "CDVNBHoge" }
            });
            expect(inst1).not.toBeNull();
            expect(inst1._objectId).toBeDefined();
            expect(inst2).not.toBeNull();
            expect(inst2._objectId).toBeDefined();
            expect(inst1._objectId).not.toEqual(inst2._objectId);
        });
    });
    describe("Class not found check", function () {
        var value;
        var taskId;
        var callbacks;
        beforeEach(function (done) {
            callbacks = {
                win: function (arg) {
                    done();
                },
                fail: function (err) {
                    value = err;
                    done();
                }
            };
            spyOn(callbacks, "win").and.callThrough();
            spyOn(callbacks, "fail").and.callThrough();
            var instance = new CDP.Plugin.NativeBridge({
                name: "Hoge",
                android: { packageInfo: "com.sony.cdp.nativebridge.cordova.Hoge" },
                ios: { packageInfo: "CDVNBHoge" }
            });
            taskId = instance.exec(callbacks.win, callbacks.fail, "foo", [1, false, "test"]);
        });
        it("to have been called", function () {
            expect(callbacks.win).not.toHaveBeenCalled();
            expect(callbacks.fail).toHaveBeenCalled();
        });
        it("check return value", function () {
            expect(value).toBeDefined();
            expect(value.code).toBe(NativeBridge.ERROR_CLASS_NOT_FOUND);
            expect(value.message.match(/class not found./)).toBeDefined();
            expect(value.taskId).toBe(taskId);
        });
    });
    describe("Simple method call check", function () {
        var value;
        var taskId;
        var callbacks;
        beforeEach(function (done) {
            callbacks = {
                win: function (arg) {
                    value = arg;
                    done();
                },
                fail: function (err) {
                    done();
                }
            };
            spyOn(callbacks, "win").and.callThrough();
            spyOn(callbacks, "fail").and.callThrough();
            var instance = new CDP.Plugin.NativeBridge({
                name: "SimpleGate",
                android: { packageInfo: "com.sony.cdp.sample.SimpleGate" },
                ios: { packageInfo: "SMPSimpleGate" }
            });
            taskId = instance.exec(callbacks.win, callbacks.fail, "coolMethod", [1, false, "test", { ok: true }]);
        });
        it("to have been called", function () {
            expect(callbacks.win).toHaveBeenCalled();
            expect(callbacks.fail).not.toHaveBeenCalled();
        });
        it("check return value", function () {
            expect(value).toBeDefined();
            expect(value.code).toBe(NativeBridge.SUCCESS_OK);
            expect(value.message).not.toBeDefined();
            expect(value.taskId).toBe(taskId);
            expect(value.params).toBeDefined();
            expect(value.params.length).toBe(1);
            expect(value.params[0]).toBe("arg1: 1, arg2: false, arg3: test, 日本語でOK: true");
        });
    });
    describe("Void method call check", function () {
        var value;
        var taskId;
        var callbacks;
        beforeEach(function (done) {
            callbacks = {
                win: function (arg) {
                    value = arg;
                    done();
                },
                fail: function (err) {
                    done();
                }
            };
            spyOn(callbacks, "win").and.callThrough();
            spyOn(callbacks, "fail").and.callThrough();
            var instance = new CDP.Plugin.NativeBridge({
                name: "SimpleGate",
                android: { packageInfo: "com.sony.cdp.sample.SimpleGate" },
                ios: { packageInfo: "SMPSimpleGate" }
            });
            taskId = instance.exec(callbacks.win, callbacks.fail, "voidMethod");
        });
        it("to have been called", function () {
            expect(callbacks.win).toHaveBeenCalled();
            expect(callbacks.fail).not.toHaveBeenCalled();
        });
        it("check return value", function () {
            expect(value).toBeDefined();
            expect(value.code).toBe(NativeBridge.SUCCESS_OK);
            expect(value.message).not.toBeDefined();
            expect(value.taskId).toBe(taskId);
            expect(value.params).not.toBeDefined();
        });
    });
    describe("Cordova compatible method call check", function () {
        var value;
        var taskId;
        var callbacks;
        beforeEach(function (done) {
            callbacks = {
                win: function (arg) {
                    value = arg;
                    done();
                },
                fail: function (err) {
                    done();
                }
            };
            spyOn(callbacks, "win").and.callThrough();
            spyOn(callbacks, "fail").and.callThrough();
            var instance = new CDP.Plugin.NativeBridge({
                name: "SimpleGate",
                android: { packageInfo: "com.sony.cdp.sample.SimpleGate" },
                ios: { packageInfo: "SMPSimpleGate" }
            });
            taskId = instance.exec(callbacks.win, callbacks.fail, "compatibleCheck", [1, false, "test", { ok: true }], { compatible: true });
        });
        it("to have been called", function () {
            expect(callbacks.win).toHaveBeenCalled();
            expect(callbacks.fail).not.toHaveBeenCalled();
        });
        it("check return value", function () {
            expect(value).toBeDefined();
            expect(value.length).toBe(2);
            expect(value[0]).toBe(taskId);
            expect(value[1].arg1).toBe(1);
            expect(value[1].arg2).toBe(false);
            expect(value[1].arg3).toBe("test");
            expect(value[1].arg4).toBeDefined();
            expect(value[1].arg4.ok).toBe(true);
        });
    });
    describe("Method not found check", function () {
        var value;
        var taskId;
        var callbacks;
        beforeEach(function (done) {
            callbacks = {
                win: function (arg) {
                    done();
                },
                fail: function (err) {
                    value = err;
                    done();
                }
            };
            spyOn(callbacks, "win").and.callThrough();
            spyOn(callbacks, "fail").and.callThrough();
            var instance = new CDP.Plugin.NativeBridge({
                name: "SimpleGate",
                android: { packageInfo: "com.sony.cdp.sample.SimpleGate" },
                ios: { packageInfo: "SMPSimpleGate" }
            });
            taskId = instance.exec(callbacks.win, callbacks.fail, "notFoundCheck", [1, false, "test", { ok: true }]);
        });
        it("to have been called", function () {
            expect(callbacks.win).not.toHaveBeenCalled();
            expect(callbacks.fail).toHaveBeenCalled();
        });
        it("check return value", function () {
            expect(value).toBeDefined();
            expect(value.code).toBe(NativeBridge.ERROR_METHOD_NOT_FOUND);
            expect(value.message.match(/method not found./)).toBeDefined();
            expect(value.taskId).toBe(taskId);
        });
    });
    describe("Function not supported check", function () {
        var value;
        var taskId;
        var callbacks;
        beforeEach(function (done) {
            callbacks = {
                win: function (arg) {
                    done();
                },
                fail: function (err) {
                    value = err;
                    done();
                }
            };
            spyOn(callbacks, "win").and.callThrough();
            spyOn(callbacks, "fail").and.callThrough();
            var instance = new CDP.Plugin.NativeBridge({
                name: "SimpleGate",
            });
            taskId = instance.exec(callbacks.win, callbacks.fail, "notSupported", [1, false, "test", { ok: true }]);
        });
        it("to have been called", function () {
            expect(callbacks.win).not.toHaveBeenCalled();
            expect(callbacks.fail).toHaveBeenCalled();
        });
        it("check return value", function () {
            expect(value).toBeDefined();
            expect(value.code).toBe(NativeBridge.ERROR_NOT_SUPPORT);
            expect(value.message.match(/not supported/)).toBeDefined();
            expect(value.taskId).toBe(taskId);
        });
    });
    describe("Invalid arg check", function () {
        var value;
        var taskId;
        var callbacks;
        beforeEach(function (done) {
            callbacks = {
                win: function (arg) {
                    done();
                },
                fail: function (err) {
                    value = err;
                    done();
                }
            };
            spyOn(callbacks, "win").and.callThrough();
            spyOn(callbacks, "fail").and.callThrough();
            var instance = new CDP.Plugin.NativeBridge({
                name: "SimpleGate",
                android: { packageInfo: "com.sony.cdp.sample.SimpleGate" },
                ios: { packageInfo: "SMPSimpleGate" }
            });
            taskId = instance.exec(callbacks.win, callbacks.fail, "coolMethod", [null, false, "test", { ok: true }]);
        });
        it("to have been called", function () {
            expect(callbacks.win).not.toHaveBeenCalled();
            expect(callbacks.fail).toHaveBeenCalled();
        });
        it("check return value", function () {
            expect(value).toBeDefined();
            expect(value.code).toBe(NativeBridge.ERROR_INVALID_ARG);
            expect(value.taskId).toBe(taskId);
        });
    });
    describe("Thread method call check", function () {
        var value;
        var taskId;
        var callbacks;
        beforeEach(function (done) {
            value = [];
            callbacks = {
                win: function (arg) {
                    value.push(arg);
                    if (3 === value.length) {
                        done();
                    }
                },
                fail: function (err) {
                    done();
                }
            };
            spyOn(callbacks, "win").and.callThrough();
            spyOn(callbacks, "fail").and.callThrough();
            var instance = new CDP.Plugin.NativeBridge({
                name: "SimpleGate",
                android: { packageInfo: "com.sony.cdp.sample.SimpleGate" },
                ios: { packageInfo: "SMPSimpleGate" }
            });
            taskId = instance.exec(callbacks.win, callbacks.fail, "threadMethod", [1, false, "test", { ok: true }]);
        });
        it("to have been called", function () {
            expect(callbacks.win).toHaveBeenCalled();
            expect(callbacks.fail).not.toHaveBeenCalled();
        });
        it("check return value", function () {
            expect(value).toBeDefined();
            expect(value.length).toBe(3);
            expect(value[0].code).toBe(NativeBridge.SUCCESS_PROGRESS);
            expect(value[0].params).toBeDefined();
            expect(value[0].params.length).toBe(2);
            expect(value[0].params[0]).toBe(1);
            expect(value[0].params[1]).toBe(false);
            expect(value[1].code).toBe(NativeBridge.SUCCESS_PROGRESS);
            expect(value[1].params).toBeDefined();
            expect(value[1].params.length).toBe(2);
            expect(value[1].params[0]).toBe("test");
            expect(value[1].params[1].ok).toBeDefined();
            expect(value[1].params[1].ok).toBe(true);
            expect(value[2].code).toBe(NativeBridge.SUCCESS_OK);
            expect(value[2].taskId).toBe(taskId);
            expect(value[2].params).toBeDefined();
            expect(value[2].params.length).toBe(1);
            expect(value[2].params[0]).toBe("arg1: 1, arg2: false, arg3: test, 日本語でOK: true");
        });
    });
    describe("Cancel call check", function () {
        var value;
        var taskId;
        var error;
        var callbacks;
        beforeEach(function (done) {
            value = [];
            callbacks = {
                win: function (arg) {
                    value.push(arg);
                },
                fail: function (err) {
                    error = err;
                    done();
                }
            };
            spyOn(callbacks, "win").and.callThrough();
            spyOn(callbacks, "fail").and.callThrough();
            var instance = new CDP.Plugin.NativeBridge({
                name: "SimpleGate",
                android: { packageInfo: "com.sony.cdp.sample.SimpleGate" },
                ios: { packageInfo: "SMPSimpleGate" }
            });
            taskId = instance.exec(callbacks.win, callbacks.fail, "progressMethod");
            setTimeout(function () {
                instance.cancel(taskId);
            }, 500);
        });
        it("check return value", function () {
            expect(value).toBeDefined();
            expect(value.length).toBeGreaterThan(3);
            expect(error).toBeDefined();
            expect(error.code).toBe(NativeBridge.ERROR_CANCEL);
        });
    });
    describe("Cancel all check", function () {
        var value;
        var taskId;
        var error;
        var callbacks;
        beforeEach(function (done) {
            value = [];
            callbacks = {
                win: function (arg) {
                    value.push(arg);
                },
                fail: function (err) {
                    error = err;
                    done();
                }
            };
            spyOn(callbacks, "win").and.callThrough();
            spyOn(callbacks, "fail").and.callThrough();
            var instance = new CDP.Plugin.NativeBridge({
                name: "SimpleGate",
                android: { packageInfo: "com.sony.cdp.sample.SimpleGate" },
                ios: { packageInfo: "SMPSimpleGate" }
            });
            taskId = instance.exec(callbacks.win, callbacks.fail, "progressMethod");
            setTimeout(function () {
                instance.cancel(null);
            }, 500);
        });
        it("check return value", function () {
            expect(value).toBeDefined();
            expect(value.length).toBeGreaterThan(3);
            expect(error).toBeDefined();
            expect(error.code).toBe(NativeBridge.ERROR_CANCEL);
        });
    });
    describe("Dispose call check", function () {
        var value = [];
        var taskId;
        var error = {};
        var errorHandlers, disposeCallbacks, callbacks;
        beforeEach(function (done) {
            var disposed = false;
            var instance = new CDP.Plugin.NativeBridge({
                name: "SimpleGate",
                android: { packageInfo: "com.sony.cdp.sample.SimpleGate" },
                ios: { packageInfo: "SMPSimpleGate" }
            });
            errorHandlers = {
                win: function (arg) {
                    done();
                },
                fail: function (err) {
                    error.dispose = err;
                    if (null != error.cancel && null != error.dispose) {
                        done();
                    }
                }
            };
            disposeCallbacks = {
                win: function (arg) {
                    instance.exec(errorHandlers.win, errorHandlers.fail, "progressMethod");
                },
                fail: function (err) {
                    done();
                }
            };
            callbacks = {
                win: function (arg) {
                    if (5 === value.length && !disposed) {
                        disposed = true;
                        instance.dispose(null, disposeCallbacks.win, disposeCallbacks.fail);
                    }
                    else if (value.length < 5) {
                        value.push(arg);
                    }
                },
                fail: function (err) {
                    error.cancel = err;
                    if (null != error.cancel && null != error.dispose) {
                        done();
                    }
                }
            };
            taskId = instance.exec(callbacks.win, callbacks.fail, "progressMethod");
        });
        it("check return value", function () {
            expect(value).toBeDefined();
            expect(value.length).toBe(5);
            expect(error.cancel).toBeDefined();
            expect(error.cancel.code).toBe(NativeBridge.ERROR_CANCEL);
            expect(error.dispose).toBeDefined();
            expect(error.dispose.code).toBe(NativeBridge.ERROR_INVALID_OPERATION);
        });
    });
};
