import "../../src/scripts/cdp.tools";

import Binary = CDP.Tools.Binary;

describe("Tools.Binary", () => {
    beforeEach(() => {
        // noop.
    });

    afterEach(() => {
        // noop.
    });

    it("newBlob()", () => {
        const blob = Binary.newBlob();
        expect(blob).toBeDefined();
        expect(blob.size).toBe(0);
        expect(blob.type).toBe("");
    });

    it("newBlob(blobParts)", () => {
        const parts = ['<a id="a"><b id="b">hey!</b></a>']; // tslint:disable-line:quotemark
        const blob = new Blob(parts);
        expect(blob).toBeDefined();
        expect(blob.size).toBeGreaterThan(0);
        expect(blob.type).toBe("");
    });

    it("newBlob(blobParts, options)", () => {
        const parts = ['<a id="a"><b id="b">hey!</b></a>']; // tslint:disable-line:quotemark
        const type = "text/html";
        const blob = new Blob(parts, { type });
        expect(blob).toBeDefined();
        expect(blob.size).toBeGreaterThan(0);
        expect(blob.type).toBe(type);
    });

    it("blobURL", () => {
        expect(Binary.blobURL).toBeDefined();
    });

    it("Blob <=> ArrayBuffer", (done) => {
        // from ArrayBuffer to Blob
        const array = new Uint8Array([0, 1, 2, 3]);
        const buffer = array.buffer;
        const type = "application/octet-stream";
        const blob = Binary.arrayBufferToBlob(buffer, type);
        expect(blob).toBeDefined();
        expect(blob.size).toBe(buffer.byteLength);
        expect(blob.type).toBe(type);

        // from Blob to ArrayBuffer
        Binary.readBlobAsArrayBuffer(blob)
            .then((retval) => {
                const result = new Uint8Array(retval);
                expect(result).toEqual(array);
                done();
            })
            .catch((reason) => {
                console.error(reason);
                expect(null).toBe("THIS FLOW IS BUG.");
            });
    });

    it("Blob <=> Uint8Array", (done) => {
        // from Uint8Array to Blob
        const array = new Uint8Array([0, 1, 2, 3]);
        const type = "application/octet-stream";
        const blob = Binary.uint8ArrayToBlob(array, type);
        expect(blob).toBeDefined();
        expect(blob.size).toBe(array.byteLength);
        expect(blob.type).toBe(type);

        // from Blob to Uint8Array
        Binary.readBlobAsUint8Array(blob)
            .then((retval) => {
                expect(retval).toEqual(array);
                done();
            })
            .catch((reason) => {
                console.error(reason);
                expect(null).toBe("THIS FLOW IS BUG.");
            });
    });

    it("Blob <=> dataURL", (done) => {
        // from dataURL to Blob
        const text = "Hello, CDP!";
        const type = "text/plain";
        const dataURL = Binary.textToDataURL(text, type);
        const blob = Binary.dataURLToBlob(dataURL);
        expect(blob).toBeDefined();
        expect(blob.type).toBe(type);

        // from Blob to DataUrl
        Binary.readBlobAsDataURL(blob)
            .then((retval) => {
                expect(retval).toEqual(dataURL);
                done();
            })
            .catch((reason) => {
                console.error(reason);
                expect(null).toBe("THIS FLOW IS BUG.");
            });
    });

    it("Blob <=> Base64", (done) => {
        // from Base64 to Blob
        const text = "Hello, CDP!";
        const base64 = Binary.textToBase64(text);
        const type = "text/plain";
        const blob = Binary.base64ToBlob(base64, type);
        expect(blob).toBeDefined();
        expect(blob.type).toBe(type);

        // from Blob to Base64
        Binary.readBlobAsBase64(blob)
            .then((retval) => {
                expect(retval).toEqual(base64);
                done();
            })
            .catch((reason) => {
                console.error(reason);
                expect(null).toBe("THIS FLOW IS BUG.");
            });
    });

    it("Blob <=> Text", (done) => {
        // from Text to Blob
        const text = "Hello, CDP!";
        const type = "text/plain";
        const blob = Binary.textToBlob(text, type);
        expect(blob).toBeDefined();
        expect(blob.type).toBe(type);

        // from Blob to Text
        Binary.readBlobAsText(blob)
            .then((retval) => {
                expect(retval).toEqual(text);
                done();
            })
            .catch((reason) => {
                console.error(reason);
                expect(null).toBe("THIS FLOW IS BUG.");
            });
    });

    it("ArrayBuffer => dataURL => text", () => {
        const text = "Hello, CDP!";
        const buffer = Binary.textToArrayBuffer(text);
        const dataURL = Binary.arrayBufferToDataURL(buffer);
        const result = Binary.dataURLToText(dataURL);
        expect(result).toBe(text);
    });

    it("ArrayBuffer <= dataURL <= text", () => {
        const text = "Hello, CDP!";
        const dataURL = Binary.textToDataURL(text);
        const buffer = Binary.dataURLToArrayBuffer(dataURL);
        const result = Binary.arrayBufferToText(buffer);
        expect(result).toBe(text);
    });
});
