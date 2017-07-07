((global) => {
    const frameworks = ["cdp"];
    if (null != global.orientation) {
        frameworks.push("cordova");
    }
    require(frameworks, (CDP) => {
        CDP.initialize()
            .done(() => {
                // start application
                require(["app"], (app) => app.main());
            });
    });
})(this);
