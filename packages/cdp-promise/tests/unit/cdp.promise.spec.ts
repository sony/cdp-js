import IPromise = CDP.IPromise;
import makePromise = CDP.makePromise;
import Promise = CDP.Promise;

let EXPECT_APPROXIMATION = 199; // 200 msec の 1つ手前

function resolve200(): IPromise<any> {
    let df = $.Deferred();
    let promise = CDP.makePromise(df);
    setTimeout(() => {
        df.resolve("resolve:200", "succeeded");
    }, 200);
    return promise;
}

function reject200(): IPromise<any> {
    let df = $.Deferred();
    let promise = CDP.makePromise(df);
    setTimeout(() => {
        df.reject("reject:200", "failed");
    }, 200);
    return promise;
}

function resolve50(): IPromise<any> {
    let df = $.Deferred();
    let promise = CDP.makePromise(df);
    setTimeout(() => {
        df.resolve("resolve:50", "succeeded");
    }, 50);
    return promise;
}

function reject50(): IPromise<any> {
    let df = $.Deferred();
    let promise = CDP.makePromise(df);
    setTimeout(() => {
        df.reject("reject:50", "failed");
    }, 50);
    return promise;
}

describe("CDP.wait", () => {
    let _testCaseFinished = false;
    beforeEach(() => {
        _testCaseFinished = false;
    });

    afterEach(() => {
        // noop.
    });

    it("CDP.wait(resolve:200)", () => {
        runs(() => {
            let startTime = new Date();
            let promise = resolve200();
            CDP.wait(promise)
                .done((result: any[]) => {
                    let duration = new Date().getTime() - startTime.getTime();
                    expect(duration).toBeGreaterThan(EXPECT_APPROXIMATION);
                    expect(result.length).toBe(1);
                    expect(result[0].status).toEqual("resolved");
                    expect(result[0].args).not.toBeNull();
                    expect(result[0].args.length).toBe(2);
                    expect(result[0].args[0]).toEqual("resolve:200");
                    expect(result[0].args[1]).toEqual("succeeded");
                    _testCaseFinished = true;
                });
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "CDP.wait(resolve:200)", Infinity);
    });

    it("CDP.wait(reject:200)", () => {
        runs(() => {
            let startTime = new Date();
            let promise = reject200();
            CDP.wait(promise)
                .done((result: any[]) => {
                    let duration = new Date().getTime() - startTime.getTime();
                    expect(duration).toBeGreaterThan(EXPECT_APPROXIMATION);
                    expect(result.length).toBe(1);
                    expect(result[0].status).toEqual("rejected");
                    expect(result[0].args).not.toBeNull();
                    expect(result[0].args.length).toBe(2);
                    expect(result[0].args[0]).toEqual("reject:200");
                    expect(result[0].args[1]).toEqual("failed");
                    _testCaseFinished = true;
                });
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "CDP.wait(reject:200)", Infinity);
    });

    it("CDP.wait(resolve:50, reject:200)", () => {
        runs(() => {
            let startTime = new Date();
            let promise1 = resolve50();
            let promise2 = reject200();
            CDP.wait(promise1, promise2)
                .done((result: any[]) => {
                    let duration = new Date().getTime() - startTime.getTime();
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
                    _testCaseFinished = true;
                });
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "CDP.wait(resolve:50, reject:200)", Infinity);
    });

    it("CDP.wait(resolve:50, reject:200, resolve:200, reject:50)", () => {
        runs(() => {
            let startTime = new Date();
            let promise1 = resolve50();
            let promise2 = reject200();
            let promise3 = resolve200();
            let promise4 = reject50();
            CDP.wait(promise1, promise2, promise3, promise4)
                .done((result: any[]) => {
                    let duration = new Date().getTime() - startTime.getTime();
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
                    _testCaseFinished = true;
                });
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "CDP.wait(resolve:50, reject:200, resolve:200, reject:50)", Infinity);
    });

    it("CDP.wait.apply(null, [resolve:50, reject:200, resolve:200, reject:50])", () => {
        runs(() => {
            let startTime = new Date();
            let promises = [];
            promises.push(resolve50());
            promises.push(reject200());
            promises.push(resolve200());
            promises.push(reject50());
            CDP.wait.apply(null, promises)
                .done((result: any[]) => {
                    let duration = new Date().getTime() - startTime.getTime();
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
                    _testCaseFinished = true;
                });
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "CDP.wait.apply(null, [resolve:50, reject:200, resolve:200, reject:50])", Infinity);
    });


    it("CDP.wait([resolve:50, reject:200, resolve:200, reject:50])", () => {
        runs(() => {
            let startTime = new Date();
            let promises = [];
            promises.push(resolve50());
            promises.push(reject200());
            promises.push(resolve200());
            promises.push(reject50());
            CDP.wait(promises)
                .done((result: any[]) => {
                    let duration = new Date().getTime() - startTime.getTime();
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
                    _testCaseFinished = true;
                });
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "CDP.wait([resolve:50, reject:200, resolve:200, reject:50])", Infinity);
    });
});

describe("CDP.makePromise", () => {
    let _testCaseFinished = false;
    beforeEach(() => {
        _testCaseFinished = false;
    });

    afterEach(() => {
        // noop.
    });

    it("makePromise(df)", () => {
        runs(() => {
            let df = $.Deferred();
            let promise = makePromise(df);

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
                    _testCaseFinished = true;
                });
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "makePromise(df)", 300);
    });

    it("makePromise(df, cancelCallback)", () => {
        runs(() => {
            let canceler = (args: number, detail: any) => {
                expect(args).toBe(100);
                expect(detail).not.toBeNull();
                expect(detail.message).toEqual("custom info");
            };

            let df = $.Deferred();

            // if you want to use custom args, "bind" is available.
            let promise = makePromise(df, canceler.bind(null/*context*/, 100));

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
                    _testCaseFinished = true;
                });
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "makePromise(df, cancelCallback)", 300);
    });

    it("makePromise(df, MakePromiseOptions)", () => {
        runs(() => {
            let df = $.Deferred();
            let promise = makePromise(df, {
                // custom abort
                abort: function (info?: any): void {
                    // custom detail
                    let detail = $.extend({ message: "abort" }, info);
                    // custom canceler
                    let _cancel = () => {
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
                    _testCaseFinished = true;
                });
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "makePromise(df, Object)", 300);
    });

    it("makePromise(df, MakePromiseOptions2)", () => {
        let callCheck = 0;
        runs(() => {
            let dependence = makePromise($.Deferred());

            let canceler = (detail: any) => {
                expect(detail).not.toBeNull();
                expect(detail.message).toEqual("custom info");
                callCheck++;
            };

            let df = $.Deferred();
            let promise = makePromise(df, {
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
                });
        });

        waitsFor(() => {
            return 3 === callCheck;
        }, "makePromise(df, Object)", 300);
    });
});


describe("CDP.IPromise.dependOn", () => {
    let _testCaseFinished = false;
    beforeEach(() => {
        _testCaseFinished = false;
    });

    afterEach(() => {
        // noop.
    });

    it("dependOn(IPromise)", () => {
        let dependency = (): CDP.IPromise<string> => {
            let df = $.Deferred();
            let promise = makePromise(df);

            setTimeout(() => {
                df.resolve("done");
            }, 1000);

            return promise;
        };

        runs(() => {
            let df = $.Deferred<void>();
            let promise = makePromise(df);
            promise.dependOn(dependency())
                .then((message) => {
                    expect(message).toEqual("THIS FLOW IS BUG.");
                })
                .fail((error) => {
                    expect(error).not.toBeNull();
                    expect(error.message).toEqual("abort");
                })
                .always(() => {
                    _testCaseFinished = true;
                });
            promise.abort();
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "dependOn(IPromise)", 300);
    });

    it("dependOn(jqXHR)", () => {
        let dependency = (): JQueryXHR => {
            let xhr: JQueryXHR = $.ajax({
                url: "https://raw.githubusercontent.com/jquery/jquery/master/package.json",
                type: "GET",
                dataType: "json",
            });
            return xhr;
        };

        runs(() => {
            let df = $.Deferred<void>();
            let promise = makePromise(df);
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
                    _testCaseFinished = true;
                });
            promise.abort({ message: "custom info" });
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "dependOn(jqXHR)", 2300);
    });
});

describe("CDP.Promise es6 compatibility", () => {
    let _testCaseFinished = false;
    beforeEach(() => {
        _testCaseFinished = false;
    });

    afterEach(() => {
        // noop.
    });

    it("new Promise(resolve, reject)", () => {
        runs(() => {
            new Promise((resolve, reject, dependOn) => {
                expect(dependOn).toBeDefined();
                resolve("CHECK!");
            })
                .then((msg) => {
                    expect(msg).toEqual("CHECK!");
                })
                .always(() => {
                    _testCaseFinished = true;
                });
        });

        waitsFor(() => {
            return _testCaseFinished;
        }, "dependOn(IPromise)", 300);
    });
});
