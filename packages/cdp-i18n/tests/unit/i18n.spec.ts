import "../../src/scripts/cdp.i18n";

describe("CDP.i18n", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("can initializeI18N(null)", (done) => {
        expect(CDP).toBeDefined();
        CDP.initializeI18N()
            .then(() => {
                expect("OK").toBe("OK");
                done();
            });
    });

    it("can initializeI18N(empty)", (done) => {
        expect(CDP).toBeDefined();
        CDP.initializeI18N({
            fallbackResources: {
            },
            options: {
            },
        })
            .then(() => {
                expect("OK").toBe("OK");
                done();
            });
    });

    it("can initializeI18N(fallbackResources)", (done) => {
        expect(CDP).toBeDefined();
        CDP.initializeI18N({
            fallbackResources: {
                en: {
                    messages: "/res/messages.en-US.json",
                },
                ja: {
                    messages: "/res/messages.ja-JP.json",
                },
            },
        })
            .then(() => {
                expect("OK").toBe("OK");
                done();
            });
    });

    it("can initializeI18N(error)", (done) => {
        expect(CDP).toBeDefined();
        CDP.initializeI18N({
            fallbackResources: {
                fr: {
                    messages: "/res/messages.fr-FR.json",
                },
            },
        })
            .then(() => {
                expect("THIS FLOW IS").toBe("BUG.");
                done();
            })
            .catch((reason: CDP.ErrorInfo) => {
                expect(reason.code).toBe(CDP.RESULT_CODE.ERROR_CDP_I18N_INITIALIZE_FAILED);
                done();
            });
    });

    it("can initializeI18N(boilerplate)", (done) => {
        expect(CDP).toBeDefined();
        CDP.initializeI18N({
            fallbackResources: {
                en: {
                    messages: "/res/messages.en-US.json",
                },
                ja: {
                    messages: "/res/messages.ja-JP.json",
                },
            },
            options: {
                preload: [
                    "en-US",
                    "ja-JP",
                ],
                fallbackLng: "en-US",
                ns: "messages",
                defaultNS: "messages",
                backend: {
                    loadPath: "res/{{ns}}.{{lng}}.json",
                },
                detection: {
                    order: ["cookie", "navigator"],
                    caches: false,
                },
                cache: {
                    enable: false,
                },
            },
        })
            .then(() => {
                /* tslint:disable:no-string-literal */
                expect("OK").toBe("OK");
                expect(CDP.i18n.options.preload[0]).toEqual("en-US");
                expect(CDP.i18n.options.preload[1]).toEqual("ja-JP");
                expect(CDP.i18n.options.resources["en-US"]).toBeDefined();
                expect(CDP.i18n.options.resources["en"]).toBeDefined();
                expect(CDP.i18n.options.resources["en-US"]).toBeDefined();
                expect(CDP.i18n.options.resources["ja"]).toBeDefined();
                expect(CDP.i18n.options.resources["ja-JP"]).toBeDefined();
                expect((<any>CDP.i18n).translator.resourceStore.data["en"]).toBeDefined();
                expect((<any>CDP.i18n).translator.resourceStore.data["en-US"]).toBeDefined();
                expect((<any>CDP.i18n).translator.resourceStore.data["ja"]).toBeDefined();
                expect((<any>CDP.i18n).translator.resourceStore.data["ja-JP"]).toBeDefined();
                done();
                /* tslint:enable:no-string-literal */
            });
    });
});
