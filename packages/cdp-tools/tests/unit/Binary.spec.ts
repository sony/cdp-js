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
        const size = 8;
        const type = "application/octet-stream";
        const buffer = new ArrayBuffer(size);
        const blob = Binary.arrayBufferToBlob(buffer, type);
        expect(blob).toBeDefined();
        expect(blob.size).toBe(size);
        expect(blob.type).toBe(type);

        // from Blob to ArrayBuffer
        Binary.readBlobAsArrayBuffer(blob)
            .then((retval) => {
                expect(retval).toEqual(buffer);
                done();
            })
            .catch((reason) => {
                console.error(reason);
                expect(null).toBe("THIS FLOW IS BUG.");
            });
    });

    it("Blob <=> Uint8Array", (done) => {
        // from Uint8Array to Blob
        const arr = new Uint8Array([0, 1, 2, 3]);
        const type = "application/octet-stream";
        const blob = Binary.uint8ArrayToBlob(arr, type);
        expect(blob).toBeDefined();
        expect(blob.size).toBe(arr.byteLength);
        expect(blob.type).toBe(type);

        // from Blob to Uint8Array
        Binary.readBlobAsUint8Array(blob)
            .then((retval) => {
                expect(retval).toEqual(arr);
                done();
            })
            .catch((reason) => {
                console.error(reason);
                expect(null).toBe("THIS FLOW IS BUG.");
            });
    });

    it("Blob <=> DataUrl", (done) => {
        // from DataUrl to Blob
        const dataURL = "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==";  // "Hello, World!
        const blob = Binary.dataURLToBlob(dataURL);
        expect(blob).toBeDefined();
        expect(blob.type).toBe("text/plain");

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
        const str = "Hello%2C%20World!";    // escaped "Hello, World!"
        const base64 = window.btoa(str);
        const mimeType = "text/plain";
        const blob = Binary.base64ToBlob(base64, mimeType);
        expect(blob).toBeDefined();
        expect(blob.type).toBe(mimeType);

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
        const text = "Hello, World!";
        const mimeType = "text/plain";
        const blob = Binary.textToBlob(text, mimeType);
        expect(blob).toBeDefined();
        expect(blob.type).toBe(mimeType);

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
});
