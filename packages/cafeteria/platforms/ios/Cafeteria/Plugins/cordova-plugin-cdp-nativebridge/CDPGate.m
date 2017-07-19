/**
 * @file CDPGate.m
 * @brief Implementation file for CDP NativeBridge Gate class.
 */

#import "CDPGate.h"
#import "CDPNativeBridgeMsgUtils.h"

@implementation CDPGate {
    CDPMethodContext* _currentContext;
    NSMutableDictionary* _cancelableTask;
}

#define TAG @"[CDPGate][Native]"

//////////////////////////////////////////////////////
// Initialzier

/**
 * initializer
 *
 * @param plugin [in] plugin instance
 */
- (id)initWithPlugin:(CDVPlugin*)plugin
{
    self = [super init];
    if (self) {
        self.plugin = plugin;
        self.viewController = plugin.viewController;
        self.commandDelegate = plugin.commandDelegate;
        _currentContext = nil;
        _cancelableTask = [@{} mutableCopy];
    }
    return self;
}

//////////////////////////////////////////////////////
// public methods: execTask

/**
 * invoke instance method.
 *
 * @param context [in] method context object
 * @return message object
 */
- (NSDictionary*) invokeWithContext:(CDPMethodContext*)context;
{
    if (context.compatible) {
        return [self invokeAsCordovaCompatibleWithContext:context];
    } else {
        return [self invokeAsNativeBridgeGateWithContext:context];
    }
}

/**
 * get mehtod context object.
 * this method is accessible only from method entry thread.
 * helper function
 *
 * @return method context object.
 */
- (CDPMethodContext*) getContext
{
    return [self getContextWithSendResultStatus:NO];
}

/**
 * get mehtod context object.
 * this method is accessible only from method entry thread.
 *
 * @param  autoSendResult [in] if YES set, sendPluginResult fired automatically
 * @return method context object.
 */
- (CDPMethodContext*) getContextWithSendResultStatus:(BOOL)autoSendResult
{
    @synchronized (self) {
        if (_currentContext && [[self getCurrentThreadId] isEqualToString:_currentContext.threadId]) {
            _currentContext.needSendResult = autoSendResult;
            return _currentContext;
        } else {
            NSLog(@"%@ Calling getContextWithSendResultStatus is permitted only from method entry thread.", TAG);
            return nil;
        }
    }
}

/**
 * return params.
 * this method semantic is return statement.
 * this method is accessible only from method called thread.
 *
 * @param [in] returned parameter.
 */
- (void) returnParams:(NSObject*)params
{
    @synchronized (self) {
        if (_currentContext && [[self getCurrentThreadId] isEqualToString:_currentContext.threadId]) {
            _currentContext.needSendResult = NO;
            [CDPNativeBridgeMsgUtils sendSuccessResultWithContext:_currentContext
                                                andResult:[CDPNativeBridgeMsgUtils makeMessageWithTaskId:_currentContext.taskId andParams:@[params]]];
        } else {
            NSLog(@"%@ Calling returnParams is permitted only from method entry thread.", TAG);
        }
    }
}

/**
 * notify params.
 * helper function.
 * keepCallback set as YES automatically.
 *
 * @param context [in] method context object.
 */
- (void) notifyParams:(const CDPMethodContext*)context
{
    [self notifyParams:context withParams:nil];
}

/**
 * notify params.
 * helper function.
 * keepCallback set as YES automatically.
 *
 * @param context [in] method context object.
 * @param params  [in] notified params.
 */
- (void) notifyParams:(const CDPMethodContext*)context withParams:(NSArray*)params
{
    [self notifyParams:context withParams:params keepCallback:YES];
}

/**
 * notify params.
 *
 * @param context      [in] method context object.
 * @param params       [in] notified params.
 * @param keepCallback [in] notified params.
 */
- (void) notifyParams:(const CDPMethodContext*)context withParams:(NSArray*)params keepCallback:(BOOL)keepCallback
{
    if (!context) {
        NSLog(@"%@ Invalid context object.", TAG);
        return;
    }
    
    NSInteger resultCode = keepCallback ? CDP_NATIVEBRIDGE_SUCCESS_PROGRESS : CDP_NATIVEBRIDGE_SUCCESS_OK;
    NSDictionary* message = [CDPNativeBridgeMsgUtils makeMessageWithCode:resultCode andMessage:nil andTaskId:context.taskId andParams:params];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
    [result setKeepCallbackAsBool:keepCallback];
    [self.commandDelegate sendPluginResult:result callbackId:context.callbackId];
}

/**
 * resolve params.
 * helper function.
 *
 * @param context [in] method context object.
 */
- (void) resolveParams:(const CDPMethodContext*)context
{
    [self resolveParams:context withParams:nil];
}

/**
 * resolve params.
 *
 * @param context [in] method context object.
 * @param params  [in] notified params.
 */
- (void) resolveParams:(const CDPMethodContext*)context withParams:(NSArray*)params
{
    if (!context) {
        NSLog(@"%@ Invalid context object.", TAG);
        return;
    }

    NSDictionary* message = [CDPNativeBridgeMsgUtils makeMessageWithTaskId:context.taskId andParams:params];
    [CDPNativeBridgeMsgUtils sendSuccessResultWithContext:context andResult:message];
}

/**
 * reject params.
 * helper function.
 *
 * @param context [in] method context object.
 */
- (void) rejectParams:(const CDPMethodContext*)context
{
    [self rejectParams:context withParams:nil];
}

/**
 * reject params.
 * helper function.
 *
 * @param context [in] method context object.
 * @param params  [in] notified params.
 */
- (void) rejectParams:(const CDPMethodContext*)context withParams:(NSArray*)params
{
    [self rejectParams:context withParams:params andCode:CDP_NATIVEBRIDGE_ERROR_FAIL andMessage:nil];
}

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
           andMessage:(NSString*)errorMsg
{
    if (!context) {
        NSLog(@"%@ Invalid context object.", TAG);
        return;
    }
    
    NSDictionary* message = [CDPNativeBridgeMsgUtils makeMessageWithCode:errorCode andMessage:errorMsg andTaskId:context.taskId andParams:params];
    [CDPNativeBridgeMsgUtils sendErrorResultWithContext:context andResult:message];
}

//////////////////////////////////////////////////////
// public methods: cancelTask

/**
 * cancel
 * this method call from NativeBridge framework.
 *
 * @param context [in] method context.
 */
- (void) cancel:(const CDPMethodContext*)context
{
    [self setCancelState:context.taskId];
    [self onCancel:context.taskId];
}

/**
 * set as cancelable task by method context.
 *
 * @param context [in] method context object.
 */
- (void) setCancelable:(const CDPMethodContext*)context
{
    @synchronized (self) {
        _cancelableTask[context.taskId] = @NO;
    }
}

/**
 * remove cancelable task by method context.
 *
 * @param context [in] method context object.
 */
- (void) removeCancelable:(const CDPMethodContext*)context
{
    @synchronized (self) {
        [_cancelableTask removeObjectForKey:context.taskId];
    }
}

/**
 * check canceled task by method context.
 *
 * @param context [in] method context object.
 */
- (BOOL) isCanceled:(const CDPMethodContext*)context
{
    @synchronized (self) {
        return [_cancelableTask[context.taskId] boolValue];
    }
}

/**
 * cancel event handler.
 * override method.
 *
 * @param taskId [in] task ID.
 */
- (void) onCancel:(NSString*)taskId
{
    // override
}

//////////////////////////////////////////////////////
// public methods: disposeTask

/**
 * dispose
 * this method call from NativeBridge framework.
 */
- (void) dispose
{
    _plugin = nil;
    _viewController = nil;
    _commandDelegate = nil;
}

//////////////////////////////////////////////////////
// private methods

/**
 * compatible invoke instance method.
 *
 * @param context [in] method context object
 * @return message object
 */
- (NSDictionary*) invokeAsCordovaCompatibleWithContext:(const CDPMethodContext*)context
{
    NSString* methodName = [NSString stringWithFormat:@"%@:", context.methodName];
    SEL normalSelector = NSSelectorFromString(methodName);
    if ([self respondsToSelector:normalSelector]) {
        // disable warning: (this is safe way.)
        // http://captainshadow.hatenablog.com/entry/20121114/1352834276
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
        [self performSelector:normalSelector withObject:context];
#pragma clang diagnostic pop
        return nil;
    } else {
        return [CDPNativeBridgeMsgUtils makeMessageWithCode:CDP_NATIVEBRIDGE_ERROR_METHOD_NOT_FOUND
                                          andMessage:[NSString stringWithFormat:@"%@ method not found. method: %@", TAG, context.methodName]
                                           andTaskId:context.taskId];
    }
}

/**
 * Native Bridge extended invoke instance method.
 *
 * @param context [in] method context object
 * @return message object
 */
- (NSDictionary*) invokeAsNativeBridgeGateWithContext:(CDPMethodContext*)context
{
    NSArray* args = context.arguments;
    SEL selector = NSSelectorFromString([self buildMethodSelectorStringFrom:context.methodName andArgs:args]);
    if ([self respondsToSelector:selector]) {
        NSMethodSignature* signature = [self methodSignatureForSelector:selector];
        NSInvocation* invocation = [NSInvocation invocationWithMethodSignature:signature];
        [invocation retainArguments];
        [invocation setSelector:selector];

        for (int i = 0; i < [args count]; i++) {
            id arg = args[i];
            if ([NSStringFromClass([arg class]) isEqualToString:@"__NSCFBoolean"]) {
                BOOL argBool = [args[i] boolValue];
                [invocation setArgument:&argBool atIndex:i + 2];
            } else {
                [invocation setArgument:&arg atIndex:i + 2];
                
            }
        }
        
        @synchronized (self) {
            _currentContext = context;
            [invocation invokeWithTarget:self];
            if (_currentContext.needSendResult) {
                [CDPNativeBridgeMsgUtils sendSuccessResultWithContext:context andTaskId:context.taskId];
            }
            _currentContext = nil;
        }
        return nil;
    } else {
        return [CDPNativeBridgeMsgUtils makeMessageWithCode:CDP_NATIVEBRIDGE_ERROR_METHOD_NOT_FOUND
                                          andMessage:[NSString stringWithFormat:@"%@ method not found. method: %@", TAG, context.methodName]
                                           andTaskId:context.taskId];
    }
}

/**
 * build selector string.
 *
 * @param method  [in] method name
 * @param args    [in] arguments
 * @return selector string
 */
- (NSString*) buildMethodSelectorStringFrom:(NSString*)method andArgs:(NSArray*)args
{
    NSString* selector = method;
    for (int i = 0; i < [args count]; i++) {
        selector = [selector stringByAppendingString:@":"];
    }
    return selector;
}

/**
 * get current thread id string
 */
- (NSString*) getCurrentThreadId
{
    return [NSString stringWithFormat:@"%@", [NSThread currentThread]];
}

/**
 * set cancel state for context
 */
- (void) setCancelState:(NSString*)taskId
{
    @synchronized (self) {
        if (!taskId) {
            for (id key in [_cancelableTask keyEnumerator]) {
                _cancelableTask[key] = @YES;
            }
        } else {
            _cancelableTask[taskId] = @YES;
        }
    }
}

@end