namespace TestApp {
    let setup = (callback: Function): void => {
        /*jshint evil:true */
        const global = Function("return this")();
        /*jshint evil:false */
        if (null != global.orientation) {
            require(["cordova"], () => {
                callback();
            });
        } else {
          setTimeout(() => {
            callback();
          });
        }
    };

    setup(() => {
        require(["cdp"], (CDP) => {
            CDP.initialize().done(() => {
                require(["app"], (app: any) => {
                    app.main();
                });
            });
        });
    });
}
