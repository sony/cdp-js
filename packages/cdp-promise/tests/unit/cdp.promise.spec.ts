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

function reject50(): IPromise<any> {
    const df = $.Deferred();
    const promise = CDP.makePromise(df);
    setTimeout(() => {
        df.reject("reject:50", "failed");
    }, 50);
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
            expect(detail.message).toEqual("custom info");
        };

        const df = $.Deferred();

        // if you want to use custom args, "bind" is available.
        const promise = makePromise(df, canceler.bind(null/*context*/, 100));

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
                expect(detail.message).toEqual("custom info");
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
            promise.abort({ message: "custom info" });
        });

        promise
            .done((detail, message) => {
                expect(detail).toEqual("SHOULD NOT BE CALLED.");
                expect(message).toEqual("THIS FLOW IS BUG.");
            })
            .fail((detail, message) => {
                expect(detail).not.toBeNull();
                expect(detail.message).toEqual("custom info");
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
            expect(detail.message).toEqual("custom info");
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
                expect(detail.message).toEqual("custom info");
                callCheck++;
            });

        setTimeout(() => {
            promise.abort({ message: "custom info" });
        });

        promise
            .done((detail) => {
                expect(detail).toEqual("SHOULD NOT BE CALLED.");
            })
            .fail((detail) => {
                expect(detail).not.toBeNull();
                expect(detail.message).toEqual("custom info");
            })
            .always(() => {
                callCheck++;
                if (3 === callCheck) {
                    done();
                }
            });
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
                expect(error.message).toEqual("custom info");
            })
            .always(() => {
                done();
            });
        promise.abort({ message: "custom info" });
    });
});

describe("CDP.Promise es6 compatibility", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("new Promise(resolve, reject)", (done) => {
        new Promise((resolve, reject, dependOn) => {
            expect(dependOn).toBeDefined();
            resolve("CHECK!");
        })
            .then((msg) => {
                expect(msg).toEqual("CHECK!");
            })
            .always(() => {
                done();
            });
    });
});
