cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "cordova-plugin-cdp-nativebridge.NativeBridge",
        "file": "plugins/cordova-plugin-cdp-nativebridge/www/cdp.plugin.nativebridge.js",
        "pluginId": "cordova-plugin-cdp-nativebridge",
        "clobbers": [
            "CDP.Plugin.NativeBridge"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-cdp-nativebridge": "1.1.0",
    "cordova-plugin-whitelist": "1.3.2"
};
// BOTTOM OF METADATA
});