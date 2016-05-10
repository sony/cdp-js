namespace TestApp {
    let setup = (callback: Function): void => {
        var global = global || window;
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
