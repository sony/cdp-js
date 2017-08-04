import "../../src/scripts/cdp.promise";

import IPromise     = CDP.IPromise;
import makePromise  = CDP.makePromise;
import Promise      = CDP.Promise;

const EXPECT_APPROXIMATION = 199; // 200 msec の 1つ手前

function resolve200(): IPromise<any> {
    const df = $.Deferred();
    const promise = CDP.makePromise(df);
    setTimeout(() => {
        df.resolve("resolve:200", "succeeded");
    }, 200);
    return promise;
}

function reject200(): IPromise<any> {
    const df = $.Deferred();
    const promise = CDP.makePromise(df);
    setTimeout(() => {
        df.reject("reject:200", "failed");
    }, 200);
    return promise;
}

function resolve50(): IPromise<any> {
    const df = $.Deferred();
    const promise = CDP.makePromise(df);
    setTimeout(() => {
        df.resolve("resolve:50", "succeeded");
    }, 50);
    return promise;
}

function resolve0(): IPromise<any> {
    const df = $.Deferred();
    const promise = CDP.makePromise(df);
    df.resolve("resolve:0", "succeeded");
    return promise;
}

function reject50(): IPromise<any> {
    const df = $.Deferred();
    const promise = CDP.makePromise(df);
    setTimeout(() => {
        df.reject("reject:50", "failed");
    }, 50);
    return promise;
}

function reject0(): IPromise<any> {
    const df = $.Deferred();
    const promise = CDP.makePromise(df);
    df.reject("reject:0", "failed");
    return promise;
}

describe("CDP.wait", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("CDP.wait(resolve:200)", (done) => {
        const startTime = new Date();
        const promise = resolve200();
        CDP.wait(promise)
            .done((result: any[]) => {
                const duration = new Date().getTime() - startTime.getTime();
                expect(duration).toBeGreaterThan(EXPECT_APPROXIMATION);
                expect(result.length).toBe(1);
                expect(result[0].status).toEqual("resolved");
                expect(result[0].args).not.toBeNull();
                expect(result[0].args.length).toBe(2);
                expect(result[0].args[0]).toEqual("resolve:200");
                expect(result[0].args[1]).toEqual("succeeded");
                done();
            });
    });

    it("CDP.wait(reject:200)", (done) => {
        const startTime = new Date();
        const promise = reject200();
        CDP.wait(promise)
            .done((result: any[]) => {
                const duration = new Date().getTime() - startTime.getTime();
                expect(duration).toBeGreaterThan(EXPECT_APPROXIMATION);
                expect(result.length).toBe(1);
                expect(result[0].status).toEqual("rejected");
                expect(result[0].args).not.toBeNull();
                expect(result[0].args.length).toBe(2);
                expect(result[0].args[0]).toEqual("reject:200");
                expect(result[0].args[1]).toEqual("failed");
                done();
            });
    });

    it("CDP.wait(resolve:50, reject:200)", (done) => {
        const startTime = new Date();
        const promise1 = resolve50();
        const promise2 = reject200();
        CDP.wait(promise1, promise2)
            .done((result: any[]) => {
                const duration = new Date().getTime() - startTime.getTime();
                expect(duration).toBeGreaterThan(EXPECT_APPROXIMATION);
                expect(result.length).toBe(2);
                expect(result[0].status).toEqual("resolved");
                expect(result[0].args).not.toBeNull();
                expect(result[0].args.length).toBe(2);
                expect(result[0].args[0]).toEqual("resolve:50");
                expect(result[0].args[1]).toEqual("succeeded");
                expect(result[1].status).toEqual("rejected");
                expect(result[1].args).not.toBeNull();
                expect(result[1].args.length).toBe(2);
                expect(result[1].args[0]).toEqual("reject:200");
                expect(result[1].args[1]).toEqual("failed");
                done();
            });
    });

    it("CDP.wait(resolve:50, reject:200, resolve:200, reject:50)", (done) => {
        const startTime = new Date();
        const promise1 = resolve50();
        const promise2 = reject200();
        const promise3 = resolve200();
        const promise4 = reject50();
        CDP.wait(promise1, promise2, promise3, promise4)
            .done((result: any[]) => {
                const duration = new Date().getTime() - startTime.getTime();
                expect(duration).toBeGreaterThan(EXPECT_APPROXIMATION);
                expect(result.length).toBe(4);
                expect(result[0].status).toEqual("resolved");
                expect(result[0].args).not.toBeNull();
                expect(result[0].args.length).toBe(2);
                expect(result[0].args[0]).toEqual("resolve:50");
                expect(result[0].args[1]).toEqual("succeeded");
                expect(result[1].status).toEqual("rejected");
                expect(result[1].args).not.toBeNull();
                expect(result[1].args.length).toBe(2);
                expect(result[1].args[0]).toEqual("reject:200");
                expect(result[1].args[1]).toEqual("failed");
                expect(result[2].status).toEqual("resolved");
                expect(result[2].args).not.toBeNull();
                expect(result[2].args.length).toBe(2);
                expect(result[2].args[0]).toEqual("resolve:200");
                expect(result[2].args[1]).toEqual("succeeded");
                expect(result[3].status).toEqual("rejected");
                expect(result[3].args).not.toBeNull();
                expect(result[3].args.length).toBe(2);
                expect(result[3].args[0]).toEqual("reject:50");
                expect(result[3].args[1]).toEqual("failed");
                done();
            });
    });

    it("CDP.wait.apply(null, [resolve:50, reject:200, resolve:200, reject:50])", (done) => {
        const startTime = new Date();
        const promises = [];
        promises.push(resolve50());
        promises.push(reject200());
        promises.push(resolve200());
        promises.push(reject50());
        CDP.wait.apply(null, promises)
            .done((result: any[]) => {
                const duration = new Date().getTime() - startTime.getTime();
                expect(duration).toBeGreaterThan(EXPECT_APPROXIMATION);
                expect(result.length).toBe(4);
                expect(result[0].status).toEqual("resolved");
                expect(result[0].args).not.toBeNull();
                expect(result[0].args.length).toBe(2);
                expect(result[0].args[0]).toEqual("resolve:50");
                expect(result[0].args[1]).toEqual("succeeded");
                expect(result[1].status).toEqual("rejected");
                expect(result[1].args).not.toBeNull();
                expect(result[1].args.length).toBe(2);
                expect(result[1].args[0]).toEqual("reject:200");
                expect(result[1].args[1]).toEqual("failed");
                expect(result[2].status).toEqual("resolved");
                expect(result[2].args).not.toBeNull();
                expect(result[2].args.length).toBe(2);
                expect(result[2].args[0]).toEqual("resolve:200");
                expect(result[2].args[1]).toEqual("succeeded");
                expect(result[3].status).toEqual("rejected");
                expect(result[3].args).not.toBeNull();
                expect(result[3].args.length).toBe(2);
                expect(result[3].args[0]).toEqual("reject:50");
                expect(result[3].args[1]).toEqual("failed");
                done();
            });
    });


    it("CDP.wait([resolve:50, reject:200, resolve:200, reject:50])", (done) => {
        const startTime = new Date();
        const promises = [];
        promises.push(resolve50());
        promises.push(reject200());
        promises.push(resolve200());
        promises.push(reject50());
        CDP.wait(promises)
            .done((result: any[]) => {
                const duration = new Date().getTime() - startTime.getTime();
                expect(duration).toBeGreaterThan(EXPECT_APPROXIMATION);
                expect(result.length).toBe(4);
                expect(result[0].status).toEqual("resolved");
                expect(result[0].args).not.toBeNull();
                expect(result[0].args.length).toBe(2);
                expect(result[0].args[0]).toEqual("resolve:50");
                expect(result[0].args[1]).toEqual("succeeded");
                expect(result[1].status).toEqual("rejected");
                expect(result[1].args).not.toBeNull();
                expect(result[1].args.length).toBe(2);
                expect(result[1].args[0]).toEqual("reject:200");
                expect(result[1].args[1]).toEqual("failed");
                expect(result[2].status).toEqual("resolved");
                expect(result[2].args).not.toBeNull();
                expect(result[2].args.length).toBe(2);
                expect(result[2].args[0]).toEqual("resolve:200");
                expect(result[2].args[1]).toEqual("succeeded");
                expect(result[3].status).toEqual("rejected");
                expect(result[3].args).not.toBeNull();
                expect(result[3].args.length).toBe(2);
                expect(result[3].args[0]).toEqual("reject:50");
                expect(result[3].args[1]).toEqual("failed");
                done();
            });
    });

    it("CDP.wait(already resolved)", (done) => {
        const promises = [];
        promises.push(resolve0());
        promises.push(reject0());
        CDP.wait(promises)
            .done((result: any[]) => {
                expect(result[0].status).toEqual("resolved");
                expect(result[0].args).not.toBeNull();
                expect(result[0].args.length).toBe(2);
                expect(result[0].args[0]).toEqual("resolve:0");
                expect(result[0].args[1]).toEqual("succeeded");
                expect(result[1].status).toEqual("rejected");
                expect(result[1].args).not.toBeNull();
                expect(result[1].args.length).toBe(2);
                expect(result[1].args[0]).toEqual("reject:0");
                expect(result[1].args[1]).toEqual("failed");
                done();
            });
    });
});

describe("CDP.race", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("CDP.race(resolve:50, reject:200)", (done) => {
        const promises = [];
        promises.push(resolve50());
        promises.push(reject200());
        CDP.race(promises)
            .done((result: any[]) => {
                expect(result.length).toBe(2);
                expect(result[0]).toEqual("resolve:50");
                expect(result[1]).toEqual("succeeded");
                done();
            });
    });

    it("CDP.race(reject:200, resolve:50)", (done) => {
        const promises = [];
        promises.push(reject200());
        promises.push(resolve50());
        CDP.race(promises)
            .done((result: any[]) => {
                expect(result.length).toBe(2);
                expect(result[0]).toEqual("resolve:50");
                expect(result[1]).toEqual("succeeded");
                done();
            });
    });

    it("CDP.race(reject:50, resolve:200)", (done) => {
        const promises = [];
        promises.push(reject50());
        promises.push(resolve200());
        CDP.race(promises)
            .fail((result: any[]) => {
                expect(result.length).toBe(2);
                expect(result[0]).toEqual("reject:50");
                expect(result[1]).toEqual("failed");
                done();
            });
    });

    it("CDP.race(resolve:200, reject:50)", (done) => {
        const promises = [];
        promises.push(resolve200());
        promises.push(reject50());
        CDP.race(promises)
            .fail((result: any[]) => {
                expect(result.length).toBe(2);
                expect(result[0]).toEqual("reject:50");
                expect(result[1]).toEqual("failed");
                done();
            });
    });

    it("CDP.race(already resolved)", (done) => {
        const promises = [];
        promises.push(resolve0());
        promises.push(reject0());
        CDP.race(promises)
            .done((result: any[]) => {
                expect(result.length).toBe(2);
                expect(result[0]).toEqual("resolve:0");
                expect(result[1]).toEqual("succeeded");
                done();
            });
    });

    it("CDP.race(already rejected)", (done) => {
        const promises = [];
        promises.push(reject0());
        promises.push(resolve0());
        CDP.race(promises)
            .fail((result: any[]) => {
                expect(result.length).toBe(2);
                expect(result[0]).toEqual("reject:0");
                expect(result[1]).toEqual("failed");
                done();
            });
    });
});

describe("CDP.makePromise", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("makePromise(df)", (done) => {
        const df = $.Deferred();
        const promise = makePromise(df);

        setTimeout(() => {
            promise.abort();
        });

        promise
            .done((detail, message) => {
                expect(detail).toEqual("SHOULD NOT BE CALLED.");
                expect(message).toEqual("THIS FLOW IS BUG.");
            })
            .fail((detail, message) => {
                expect(detail).not.toBeNull();
                expect(detail.message).toEqual("abort");
                expect(message).toBeUndefined();
            })
            .always(() => {
                done();
            });
    });

    it("makePromise(df, cancelCallback)", (done) => {
        const canceler = (args: number, detail: any) => {
            expect(args).toBe(100);
            expect(detail).not.toBeNull();
            expect(detail.message).toEqual("abort");
            expect(detail.param).toEqual("custom info");
        };

        const df = $.Deferred();

        // if you want to use custom args, "bind" is available.
        const promise = makePromise(df, canceler.bind(null/*context*/, 100));

        setTimeout(() => {
            promise.abort({ param: "custom info" });
        });

        promise
            .done((detail, message) => {
                expect(detail).toEqual("SHOULD NOT BE CALLED.");
                expect(message).toEqual("THIS FLOW IS BUG.");
            })
            .fail((detail, message) => {
                expect(detail).not.toBeNull();
                expect(detail.message).toEqual("abort");
                expect(detail.param).toEqual("custom info");
                expect(message).toBeUndefined();
            })
            .always(() => {
                done();
            });
    });

    it("makePromise() custom abort(originalMessage)", (done) => {
        const df = $.Deferred();

        // if you want to use custom args, "bind" is available.
        const promise = makePromise(df);

        setTimeout(() => {
            promise.abort({ message: "custom info" });
        });

        promise
            .done((detail, message) => {
                expect(detail).toEqual("SHOULD NOT BE CALLED.");
                expect(message).toEqual("THIS FLOW IS BUG.");
            })
            .fail((detail, message) => {
                expect(detail).not.toBeNull();
                expect(detail.message).toEqual("abort");
                expect(detail.originalMessage).toEqual("custom info");
                expect(message).toBeUndefined();
            })
            .always(() => {
                done();
            });
    });

    it("makePromise(df, MakePromiseOptions)", (done) => {
        const df = $.Deferred();
        const promise = makePromise(df, {
            // custom abort
            abort: function (info?: any): void {
                // custom detail
                const detail = $.extend({ message: "abort" }, info);
                // custom canceler
                const _cancel = () => {
                    df.reject(detail, "from custom abort");
                };
                if (null != this.dependency) {
                    if (this.dependency.abort) {
                        this.dependency.abort(detail);
                    }
                    if (this.callReject && "pending" === this.state()) {
                        _cancel();
                    }
                } else if ("pending" === this.state()) {
                    _cancel();
                }
            }
        });

        setTimeout(() => {
            promise.abort({ param: "custom info" });
        });

        promise
            .done((detail, message) => {
                expect(detail).toEqual("SHOULD NOT BE CALLED.");
                expect(message).toEqual("THIS FLOW IS BUG.");
            })
            .fail((detail, message) => {
                expect(detail).not.toBeNull();
                expect(detail.message).toEqual("abort");
                expect(detail.param).toEqual("custom info");
                expect(message).toEqual("from custom abort");
            })
            .always(() => {
                done();
            });
    });

    it("makePromise(df, MakePromiseOptions2)", (done) => {
        let callCheck = 0;
        const dependence = makePromise($.Deferred());

        const canceler = (detail: any) => {
            expect(detail).not.toBeNull();
            expect(detail.message).toEqual("abort");
            expect(detail.param).toEqual("custom info");
            callCheck++;
        };

        const df = $.Deferred();
        const promise = makePromise(df, {
            dependency: dependence,
            callReject: true,
            cancelCallback: canceler,
        });

        dependence
            .fail((detail) => {
                expect(detail).not.toBeNull();
                expect(detail.message).toEqual("abort");
                expect(detail.param).toEqual("custom info");
                callCheck++;
            });

        setTimeout(() => {
            promise.abort({ param: "custom info" });
        });

        promise
            .done((detail) => {
                expect(detail).toEqual("SHOULD NOT BE CALLED.");
            })
            .fail((detail) => {
                expect(detail).not.toBeNull();
                expect(detail.message).toEqual("abort");
                expect(detail.param).toEqual("custom info");
            })
            .always(() => {
                callCheck++;
                if (3 === callCheck) {
                    done();
                }
            });
    });

    it("makePromise() with error case", () => {
        const invalid = $.Deferred().promise();
        const df = $.Deferred();

        spyOn(console, "error").and.callFake((message) => {
            expect(message).toEqual("[CDP.Promise] [call] dependency object doesn't have 'abort()' method.");
        });

        const promise = makePromise(df, { dependency: <any>invalid });
        promise.abort();
    });
});

describe("CDP.IPromise.dependOn", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("dependOn(IPromise)", (done) => {
        const dependency = (): CDP.IPromise<string> => {
            const _df = $.Deferred();
            const _promise = makePromise(_df);

            setTimeout(() => {
                _df.resolve("done");
            }, 1000);

            return _promise;
        };

        const df = $.Deferred<void>();
        const promise = makePromise(df);
        promise.dependOn(dependency())
            .then((message) => {
                expect(message).toEqual("THIS FLOW IS BUG.");
            })
            .fail((error) => {
                expect(error).not.toBeNull();
                expect(error.message).toEqual("abort");
            })
            .always(() => {
                done();
            });

        promise.abort();
    });

    it("dependOn(jqXHR)", (done) => {
        const dependency = (): JQueryXHR => {
            const xhr: JQueryXHR = $.ajax({
                url: "https://raw.githubusercontent.com/jquery/jquery/master/package.json",
                type: "GET",
                dataType: "json",
            });
            return xhr;
        };

        const df = $.Deferred<void>();
        const promise = makePromise(df);
        promise.dependOn(dependency())
            .then((message) => {
                expect(message).toEqual("THIS FLOW IS BUG.");
            })
            .fail((xhr, error) => {
                expect(xhr).not.toBeNull();
                expect(xhr.status).toEqual(0);
                expect(error).not.toBeNull();
                expect(error.message).toEqual("abort");
                expect(error.param).toEqual("custom info");
            })
            .always(() => {
                done();
            });
        promise.abort({ param: "custom info" });
    });

    it("dependOn() with error case", () => {
        const invalid = $.Deferred().promise();
        const df = $.Deferred();
        const promise = makePromise(df);
        spyOn(console, "error").and.callFake((message) => {
            expect(message).toEqual("[CDP.Promise] [set] dependency object doesn't have 'abort()' method.");
        });
        promise.dependOn(<any>invalid);
    });

});

describe("CDP.PromiseManager", () => {
    let _prmsManager: CDP.PromiseManager;

    beforeEach(() => {
        _prmsManager = new CDP.PromiseManager();
    });

    afterEach(() => {
        _prmsManager = null;
    });

    it("new", () => {
        expect(_prmsManager).not.toBeNull();
    });

    it("add(), & promises()", () => {
        const promise1 = resolve50();
        const promise2 = resolve0();
        const promise3 = reject200();
        expect(_prmsManager.add(promise1)).toEqual(promise1);
        expect(_prmsManager.add(promise2)).toEqual(promise2);
        expect(_prmsManager.add(promise3)).toEqual(promise3);

        const promises = _prmsManager.promises();
        expect(promises[0]).toEqual(promise1);
        expect(promises[1]).toEqual(promise3);
    });

    it("add(), special case", () => {
        expect(_prmsManager.add(null)).toBeNull();
        let invalid: CDP.IPromise<any>;
        expect(_prmsManager.add(invalid)).toBeNull();
        invalid = <any>$.Deferred().promise();
        spyOn(console, "error").and.callFake((message) => {
            expect(message).toEqual("[CDP.Promise] [add] promise object doesn't have 'abort()' method.");
        });
        expect(_prmsManager.add(invalid)).toEqual(invalid);
    });

    it("cancel()", (done) => {
        const promise1 = resolve200();
        const promise2 = reject200();
        const promise3 = resolve200();
        expect(_prmsManager.add(promise1)).toEqual(promise1);
        expect(_prmsManager.add(promise2)).toEqual(promise2);
        expect(_prmsManager.add(promise3)).toEqual(promise3);

        const callcheck = [false, false, false];

        promise1
            .catch((error) => {
                callcheck[0] = true;
                expect(error.message).toEqual("abort");
            });

        promise2
            .catch((error) => {
                callcheck[1] = true;
                expect(error.message).toEqual("abort");
            });

        promise3
            .catch((error) => {
                callcheck[2] = true;
                expect(error.message).toEqual("abort");
            });

        setTimeout(() => {
            _prmsManager.cancel()
                .done(() => {
                    expect(promise1.state()).toEqual("rejected");
                    expect(callcheck[0]).toBeTruthy();
                    expect(promise2.state()).toEqual("rejected");
                    expect(callcheck[1]).toBeTruthy();
                    expect(promise3.state()).toEqual("rejected");
                    expect(callcheck[2]).toBeTruthy();
                    done();
                });
        });
    });
});

describe("CDP.Promise es6 compatibility", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("new Promise(resolve)", (done) => {
        new Promise((resolve) => {
            resolve("CHECK!");
        })
            .then((msg) => {
                expect(msg).toEqual("CHECK!");
            })
            .catch((reason) => {
                expect(reason).toEqual("THIS FLOW IS BUG!");
            })
            .then(() => { // always
                done();
            });
    });

    it("new Promise(resolve, reject)", (done) => {
        new Promise((resolve, reject, dependOn) => {
            expect(dependOn).toBeDefined();
            reject("ERROR!");
        })
            .then((msg) => {
                expect(msg).toEqual("THIS FLOW IS BUG!");
            })
            .catch((reason) => {
                expect(reason).toEqual("ERROR!");
            })
            .then(() => { // always
                done();
            });
    });

    it("new Promise(resolve, reject, dependOn)", (done) => {
        new Promise((resolve, reject, dependOn) => {
            expect(dependOn).toBeDefined();
            dependOn(resolve50())
                .then((info) => {
                    expect(info).toEqual("resolve:50");
                    return info;
                })
                .then((info) => {
                    resolve("okok:" + info);
                });
        })
            .then((msg) => {
                expect(msg).toEqual("okok:resolve:50");
            })
            .catch((reason) => {
                expect(reason).toEqual("THIS FLOW IS BUG!");
            })
            .then(() => { // always
                done();
            });
    });

    it("new Promise(resolve, reject, dependOn) cancel", (done) => {
        let callcheck = false;

        const dependee = resolve200();
        dependee.catch((reason) => {
            expect(reason).not.toBeNull();
            expect(reason.message).toEqual("abort");
            callcheck = true;
        });

        const promise = new Promise((resolve, reject, dependOn) => {
            dependOn(dependee)
                .then((info) => {
                    expect(info).toEqual("THIS FLOW IS BUG!");
                })
                .then((info) => {
                    resolve("DOES NOT CALL");
                })
                .catch((reason) => {
                    reject(reason);
                });
        });

        promise
            .then((msg) => {
                expect(msg).toEqual("THIS FLOW IS BUG!");
            })
            .catch((reason) => {
                expect(reason).not.toBeNull();
                expect(reason.message).toEqual("abort");
                expect(callcheck).toBeTruthy();
            })
            .then(() => { // always
                done();
            });

        // call cancel
        promise.abort();
    });

    it("Promise.resolve()", (done) => {
        Promise.resolve()
            .then((msg) => {
                expect(msg).toBeUndefined();
            })
            .catch((reason) => {
                expect(reason).toEqual("THIS FLOW IS BUG!");
            })
            .then(() => { // always
                done();
            });
    });

    it("Promise.resolve(msg)", (done) => {
        Promise.resolve("ok")
            .then((msg) => {
                expect(msg).toEqual("ok");
            })
            .catch((reason) => {
                expect(reason).toEqual("THIS FLOW IS BUG!");
            })
            .then(() => { // always
                done();
            });
    });

    it("Promise.reject()", (done) => {
        Promise.reject()
            .then((msg) => {
                expect(msg).toEqual("THIS FLOW IS BUG!");
            })
            .catch((reason) => {
                expect(reason).toBeUndefined();
            })
            .then(() => { // always
                done();
            });
    });

    it("Promise.reject(msg)", (done) => {
        Promise.reject("ng")
            .then((msg) => {
                expect(msg).toEqual("THIS FLOW IS BUG!");
            })
            .catch((reason) => {
                expect(reason).toEqual("ng");
            })
            .then(() => { // always
                done();
            });
    });

    it("Promise.all([resolve:50, resolve:200])", (done) => {
        let callchceck = false;
        Promise.all([resolve50(), resolve200()])
            .then(() => {
                callchceck = true;
            })
            .catch((reason) => {
                expect(reason).toEqual("THIS FLOW IS BUG!");
            })
            .then(() => { // always
                expect(callchceck).toBeTruthy();
                done();
            });
    });

    it("Promise.all([resolve:50, reject:200])", (done) => {
        let callchceck = false;
        Promise.all([resolve50(), reject200()])
            .then((msg) => {
                expect(<any>msg).toEqual("THIS FLOW IS BUG!");
            })
            .catch((reason) => {
                callchceck = true;
            })
            .then(() => { // always
                expect(callchceck).toBeTruthy();
                done();
            });
    });

    it("Promise.wait([resolve:50, reject:200])", (done) => {
        const startTime = new Date();
        const promise1 = resolve50();
        const promise2 = reject200();
        Promise.wait([promise1, promise2])
            .done((result: any[]) => {
                const duration = new Date().getTime() - startTime.getTime();
                expect(duration).toBeGreaterThan(EXPECT_APPROXIMATION);
                expect(result.length).toBe(2);
                expect(result[0].status).toEqual("resolved");
                expect(result[0].args).not.toBeNull();
                expect(result[0].args.length).toBe(2);
                expect(result[0].args[0]).toEqual("resolve:50");
                expect(result[0].args[1]).toEqual("succeeded");
                expect(result[1].status).toEqual("rejected");
                expect(result[1].args).not.toBeNull();
                expect(result[1].args.length).toBe(2);
                expect(result[1].args[0]).toEqual("reject:200");
                expect(result[1].args[1]).toEqual("failed");
                done();
            });
    });

    it("Promise.race([resolve:50, reject:200])", (done) => {
        Promise.race([resolve50(), reject200()])
            .done((result: any[]) => {
                expect(result.length).toBe(2);
                expect(result[0]).toEqual("resolve:50");
                expect(result[1]).toEqual("succeeded");
                done();
            });
    });
});
