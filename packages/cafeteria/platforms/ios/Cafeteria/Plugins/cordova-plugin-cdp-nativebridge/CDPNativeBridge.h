/**
 * @file CDPNativeBridge.h
 * @brief Interface definition file for CDP NativeBridge class.
 */

#import <Cordova/CDV.h>

@interface CDPNativeBridge : CDVPlugin

//////////////////////////////////////////////////////
// Plugin I/F

/**
 * standard execute task method entry.
 *
 * @param command [in] cordova invoked command pointer.
 */
- (void) execTask:  (CDVInvokedUrlCommand*)command;

/**
 * cancel task entry.
 *
 * @param command [in] cordova invoked command pointer.
 */
- (void) cancelTask:  (CDVInvokedUrlCommand*)command;

/**
 * dispose task entry.
 *
 * @param command [in] cordova invoked command pointer.
 */
- (void) disposeTask:  (CDVInvokedUrlCommand*)command;

@end
