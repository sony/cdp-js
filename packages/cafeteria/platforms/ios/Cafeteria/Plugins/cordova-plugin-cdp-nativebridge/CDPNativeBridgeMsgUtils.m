/**
 * @file CDPNativeBridgeMsgUtils.m
 * @brief Implementation file for CDP NativeBridge plugin message utility class.
 */

#import "CDPNativeBridgeMsgUtils.h"

#if !defined(_countof) && !defined(__cplusplus)
#define _countof(a) (sizeof(a) / sizeof(a[0]))
#endif

@implementation CDPNativeBridgeMsgUtils

//////////////////////////////////////////////////////
// class methods

/**
 * make params array
 * helper function
 *
 * @param params... [in] params, require nil termination.
 * @return params array object
 */
+ (NSArray*) makeParams:(NSObject*)params, ...NS_REQUIRES_NIL_TERMINATION
{
    NSMutableArray* paramsInfo = nil;
    if (params) {
        va_list args;
        va_start(args, params);

        paramsInfo = [@[params] mutableCopy];   // set with first parameter
        id param;
        while ((param = va_arg(args, id))) {
            [paramsInfo addObject:param];
        }

        va_end(args);
    }
    
    return paramsInfo;
}

/**
 * make return message object
 *
 * @param code    [in] result code
 * @param message [in] message string
 * @param taskId  [in] task ID
 * @param params  [in] return parameters
 * @return message object
 */
+ (NSDictionary*) makeMessageWithCode:(NSInteger)code
                            andMessage:(NSString*)message
                             andTaskId:(NSString*)taskId
                             andParams:(NSArray*)params
{
    NSMutableDictionary* result = [@{} mutableCopy];
    
    NSString* name = [CDPNativeBridgeMsgUtils resultCode2String:code]
    ? [self resultCode2String:code] : [NSString stringWithFormat:@"ERROR_CUSTOM:0x%x", (int)code];
    
    result[@"code"] = [NSNumber numberWithInteger:code];
    result[@"name"] = name;
    if (message) {
        result[@"message"] = message;
    }
    if (taskId) {
        result[@"taskId"] = taskId;
    }
    if (params && 0 < [params count]) {
        result[@"params"] = params;
    }
    
    return result;
}

/**
 * make return message object
 *
 * @param code      [in] result code
 * @param message   [in] message string
 * @param taskId    [in] task ID
 * @return message object
 */
+ (NSDictionary*) makeMessageWithCode:(NSInteger)code
                            andMessage:(NSString*)message
                             andTaskId:(NSString*)taskId
{
    return [self makeMessageWithCode:code andMessage:message andTaskId:taskId andParams:nil];
}

/**
 * make return message object
 * helper function
 *
 * @param message   [in] message string
 * @param taskId    [in] task ID
 * @return message object
 */
+ (NSDictionary*) makeMessageWithMessage:(NSString*)message
                                andTaskId:(NSString*)taskId
{
    return [self makeMessageWithMessage:message andTaskId:taskId andParams:nil];
}

/**
 * make return message object
 * helper function
 *
 * @param message [in] message string
 * @param taskId  [in] task ID
 * @param params  [in] return parameters
 * @return message object
 */
+ (NSDictionary*) makeMessageWithMessage:(NSString*)message
                                andTaskId:(NSString*)taskId
                                andParams:(NSArray*)params
{
    return [self makeMessageWithCode:CDP_NATIVEBRIDGE_SUCCESS_OK andMessage:message andTaskId:taskId andParams:params];
}

/**
 * make return message object
 * helper function
 *
 * @param taskId    [in] task ID
 * @return message object
 */
+ (NSDictionary*) makeMessageWithTaskId:(NSString*)taskId
{
    return [self makeMessageWithTaskId:taskId andParams:nil];
}

/**
 * make return message object
 * helper function
 *
 * @param taskId [in] task ID
 * @param params [in] return parameters
 * @return message object
 */
+ (NSDictionary*) makeMessageWithTaskId:(NSString*)taskId
                               andParams:(NSArray*)params
{
    return [self makeMessageWithCode:CDP_NATIVEBRIDGE_SUCCESS_OK andMessage:nil andTaskId:taskId andParams:params];
}

/**
 * send success result
 *
 * @param context [in] method context object
 * @param result  [in] result message object
 */
+ (void) sendSuccessResultWithContext:(const CDPMethodContext*)context andResult:(NSDictionary*)result
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:result];
    [context.commandDelegate sendPluginResult:pluginResult callbackId:context.callbackId];
}

/**
 * send success result
 * helper function
 *
 * @param context [in] method context object
 * @param taskId  [in] task ID
 */
+ (void) sendSuccessResultWithContext:(const CDPMethodContext*)context andTaskId:(NSString*)taskId
{
    [self sendSuccessResultWithContext:context andResult:[self makeMessageWithTaskId:taskId andParams:nil]];
}

/**
 * send error result
 *
 * @param context [in] method context object
 * @param taskId  [in] task ID
 * @param code    [in] result code
 * @param message [in] message string
 */
+ (void) sendErrorResultWithContext:(const CDPMethodContext*)context
                          andTaskId:(NSString*)taskId
                            andCode:(NSInteger)code
                         andMessage:(NSString*)message
{
    [self sendErrorResultWithContext:context andResult:[self makeMessageWithCode:code andMessage:message andTaskId:taskId]];
}

/**
 * send error result
 *
 * @param context [in] method context object
 * @param result  [in] result message object
 */
+ (void) sendErrorResultWithContext:(const CDPMethodContext*)context andResult:(NSDictionary*)result
{
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:result];
    [context.commandDelegate sendPluginResult:pluginResult callbackId:context.callbackId];
}

//////////////////////////////////////////////////////
// private class methods

+ (NSString*) resultCode2String:(NSInteger)code
{
    @synchronized (self) {
        static struct {
            int code;
            const char* const msg;
        } _tbl[] = {
            { CDP_NATIVEBRIDGE_SUCCESS_OK,                "SUCCESS_OK"              },
            { CDP_NATIVEBRIDGE_SUCCESS_PROGRESS,          "SUCCESS_PROGRESS"        },
            { CDP_NATIVEBRIDGE_ERROR_FAIL,                "ERROR_FAIL"              },
            { CDP_NATIVEBRIDGE_ERROR_CANCEL,              "ERROR_CANCEL"            },
            { CDP_NATIVEBRIDGE_ERROR_INVALID_ARG,         "ERROR_INVALID_ARG"       },
            { CDP_NATIVEBRIDGE_ERROR_NOT_IMPLEMENT,       "ERROR_NOT_IMPLEMENT"     },
            { CDP_NATIVEBRIDGE_ERROR_NOT_SUPPORT,         "ERROR_NOT_SUPPORT"       },
            { CDP_NATIVEBRIDGE_ERROR_INVALID_OPERATION,   "ERROR_INVALID_OPERATION" },
            { CDP_NATIVEBRIDGE_ERROR_CLASS_NOT_FOUND,     "ERROR_CLASS_NOT_FOUND"   },
            { CDP_NATIVEBRIDGE_ERROR_METHOD_NOT_FOUND,    "ERROR_METHOD_NOT_FOUND"  },
        };
        
        for (int i = 0; i < _countof(_tbl); i++) {
            if ((int)code == _tbl[i].code) {
                return [NSString stringWithCString:_tbl[i].msg encoding:NSUTF8StringEncoding];
            }
        }
        return nil;
    }
}

@end