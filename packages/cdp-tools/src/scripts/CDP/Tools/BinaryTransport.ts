/**
 * @file  BinaryTransport.ts
 * @brief jQuery ajax transport for making binary data type requests.
 *
 *        original: https://github.com/henrya/js-jquery/blob/master/BinaryTransport/jquery.binarytransport.js
 *        author:   Henry Algus <henryalgus@gmail.com>
 */
namespace CDP.Tools {
    // Support file protocol. (as same as official way)
    const xhrSuccessStatus = {
        0: 200,
        1223: 204
    };

    $.ajaxTransport("+binary", (options: JQuery.AjaxSettings, originalOptions: JQuery.AjaxSettings, jqXHR: JQueryXHR) => {
        if (global.FormData &&
            ((options.dataType && (options.dataType === "binary")) ||
            (options.data && ((global.ArrayBuffer && options.data instanceof ArrayBuffer) ||
            (global.Blob && options.data instanceof global.Blob))))) {
            let abortCallback: () => void;
            return {
                send: function (headers: JQuery.PlainObject, callback: JQuery.Transport.SuccessCallback) {
                    // setup all variables
                    const xhr = new XMLHttpRequest();
                    const url = options.url;
                    const type = options.type;
                    const async = options.async || true;

                    // blob or arraybuffer. Default is blob
                    const dataType = (<any>options).responseType || "blob";
                    const data = options.data || null;
                    const username = options.username || null;
                    const password = options.password || null;

                    const _callback: JQuery.Transport.SuccessCallback = callback || (() => { /* noop */ });

                    // succeeded handler
                    xhr.addEventListener("load", () => {
                        const _data = {};
                        _data[options.dataType] = xhr.response;
                        _callback(
                            xhrSuccessStatus[xhr.status] || xhr.status,
                            <JQuery.Ajax.TextStatus>xhr.statusText,
                            _data,
                            xhr.getAllResponseHeaders()
                        );
                    });

                    // error handler
                    xhr.addEventListener("error", () => {
                        const _data = {};
                        _data[options.dataType] = xhr.response;
                        // make callback and send data
                        _callback(
                            xhr.status,
                            <JQuery.Ajax.TextStatus>xhr.statusText,
                            _data,
                            xhr.getAllResponseHeaders()
                        );
                    });

                    // abort handler
                    xhr.addEventListener("abort", () => {
                        const _data = {};
                        _data[options.dataType] = xhr.response;
                        // make callback and send data
                        _callback(
                            xhr.status,
                            <JQuery.Ajax.TextStatus>xhr.statusText,
                            _data,
                            xhr.getAllResponseHeaders()
                        );
                    });

                    // abort callback
                    abortCallback = () => {
                        xhr.abort();
                    };

                    xhr.open(type, url, async, username, password);

                    // setup custom headers
                    for (const i in headers) {
                        if (headers.hasOwnProperty(i)) {
                            xhr.setRequestHeader(i, headers[i]);
                        }
                    }

                    xhr.responseType = dataType;
                    xhr.send(data);
                },
                abort: () => {
                    if (abortCallback) {
                        abortCallback();
                    }
                }
            };
        }
    });
}
