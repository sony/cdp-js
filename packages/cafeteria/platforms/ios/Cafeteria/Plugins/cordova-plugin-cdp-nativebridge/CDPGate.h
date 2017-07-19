/**
 * @file CDPGate.h
 * @brief Interface definition file for CDP NativeBridge Gate class.
 */

#import <Foundation/Foundation.h>
#import "CDPMethodContext.h"

@interface CDPGate : NSObject

@property (nonatomic, weak) CDVPlugin* plugin;
@property (nonatomic, weak) UIViewController* viewController;
@property (nonatomic, weak) id <CDVCommandDelegate> commandDelegate;

//////////////////////////////////////////////////////
// Initialzier

/**
 * initializer
 *
 * @param plugin [in] plugin instance
 */
- (id)initWithPlugin:(CDVPlugin*)plugin;

//////////////////////////////////////////////////////
// public methods: execTask

/**
 * invoke instance method.
 *
 * @param context [in] method context object
 * @return message object
 */
- (NSDictionary*) invokeWithContext:(CDPMethodContext*)context;

/**
 * get mehtod context object.
 * this method is accessible only from method entry thread.
 * helper function
 *
 * @return method context object.
 */
- (CDPMethodContext*) getContext;

/**
 * get mehtod context object.
 * this method is accessible only from method entry thread.
 *
 * @param  autoSendResult [in] if YES set, sendPluginResult fired automatically
 * @return method context object.
 */
- (CDPMethodContext*) getContextWithSendResultStatus:(BOOL)autoSendResult;

/**
 * return params.
 * this method semantic is return statement.
 * this method is accessible only from method entry thread.
 *
 * @param params [in] returned parameter.
 */
- (void) returnParams:(NSObject*)params;

/**
 * notify params.
 * helper function.
 * keepCallback set as YES automatically.
 *
 * @param context [in] method context object.
 */
- (void) notifyParams:(const CDPMethodContext*)context;

/**
 * notify params.
 * helper function.
 * keepCallback set as YES automatically.
 *
 * @param context [in] method context object.
 * @param params  [in] notified params.
 */
- (void) notifyParams:(const CDPMethodContext*)context withParams:(NSArray*)params;

/**
 * notify params.
 *
 * @param context      [in] method context object.
 * @param params       [in] notified params.
 * @param keepCallback [in] notified params.
 */
- (void) notifyParams:(const CDPMethodContext*)context withParams:(NSArray*)params keepCallback:(BOOL)keepCallback;

/**
 * resolve params.
 * helper function.
 *
 * @param context [in] method context object.
 */
- (void) resolveParams:(const CDPMethodContext*)context;

/**
 * resolve params.
 *
 * @param context [in] method context object.
 * @param params  [in] notified params.
 */
- (void) resolveParams:(const CDPMethodContext*)context withParams:(NSArray*)params;

/**
 * reject params.
 * helper function.
 *
 * @param context [in] method context object.
 */
- (void) rejectParams:(const CDPMethodContext*)context;

/**
 * reject params.
 * helper function.
 *
 * @param context [in] method context object.
 * @param params  [in] notified params.
 */
- (void) rejectParams:(const CDPMethodContext*)context withParams:(NSArray*)params;

/**
 * reject params.
 *
 * @param context   [in] method context object.
 * @param params    [in] notified params.
 * @param errorCode [in] error code.
 * @param errorMsg  [in] error message.
 */
- (void) rejectParams:(const CDPMethodContext*)context
           withParams:(NSArray*)params
              andCode:(NSInteger)errorCode
           andMessage:(NSString*)errorMsg;

//////////////////////////////////////////////////////
// public methods: cancelTask

/**
 * cancel
 * this method call from NativeBridge framework.
 *
 * @param context [in] method context.
 */
- (void) cancel:(const CDPMethodContext*)context;

/**
 * set as cancelable task by method context.
 *
 * @param context [in] method context object.
 */
- (void) setCancelable:(const CDPMethodContext*)context;

/**
 * remove cancelable task by method context.
 *
 * @param context [in] method context object.
 */
- (void) removeCancelable:(const CDPMethodContext*)context;

/**
 * check canceled task by method context.
 *
 * @param context [in] method context object.
 */
- (BOOL) isCanceled:(const CDPMethodContext*)context;

/**
 * cancel event handler.
 * override method.
 *
 * @param taskId [in] task ID.
 */
- (void) onCancel:(NSString*)taskId;

//////////////////////////////////////////////////////
// public methods: disposeTask

/**
 * dispose
 * this method call from NativeBridge framework.
 */
- (void) dispose;

@end
