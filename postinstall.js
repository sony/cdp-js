(function () {
    try {
        // call deploy proc
        require('cdp-external-module-deployer').deploy();
    } catch (error) {
        // noop.
    }
}());
