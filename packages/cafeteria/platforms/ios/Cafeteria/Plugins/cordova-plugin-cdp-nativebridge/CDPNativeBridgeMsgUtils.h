/**
 * @file CDPNativeBridgeMsgUtils.h
 * @brief Interface definition file for CDP NativeBridge message utility class.
 */

#import <Foundation/Foundation.h>
#import "CDPMethodContext.h"

static const NSInteger CDP_NATIVEBRIDGE_SUCCESS_OK                = 0x0000;
static const NSInteger CDP_NATIVEBRIDGE_SUCCESS_PROGRESS          = 0x0001;
static const NSInteger CDP_NATIVEBRIDGE_ERROR_FAIL                = 0x0002;
static const NSInteger CDP_NATIVEBRIDGE_ERROR_CANCEL              = 0x0003;
static const NSInteger CDP_NATIVEBRIDGE_ERROR_INVALID_ARG         = 0x0004;
static const NSInteger CDP_NATIVEBRIDGE_ERROR_NOT_IMPLEMENT       = 0x0005;
static const NSInteger CDP_NATIVEBRIDGE_ERROR_NOT_SUPPORT         = 0x0006;
static const NSInteger CDP_NATIVEBRIDGE_ERROR_INVALID_OPERATION   = 0x0007;
static const NSInteger CDP_NATIVEBRIDGE_ERROR_CLASS_NOT_FOUND     = 0x0008;
static const NSInteger CDP_NATIVEBRIDGE_ERROR_METHOD_NOT_FOUND    = 0x0009;

@interface CDPNativeBridgeMsgUtils : NSObject

//////////////////////////////////////////////////////
// class methods

/**
 * make params array
 * helper function
 *
 * @param params... [in] params, require nil termination.
 * @return params array object
 */
+ (NSArray*) makeParams:(NSObject*)params, ...NS_REQUIRES_NIL_TERMINATION;

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
                             andParams:(NSArray*)params;

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
                             andTaskId:(NSString*)taskId;

/**
 * make return message object
 * helper function
 *
 * @param message   [in] message string
 * @param taskId    [in] task ID
 * @return message object
 */
+ (NSDictionary*) makeMessageWithMessage:(NSString*)message
                                andTaskId:(NSString*)taskId;

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
                                andParams:(NSArray*)params;

/**
 * make return message object
 * helper function
 *
 * @param taskId    [in] task ID
 * @return message object
 */
+ (NSDictionary*) makeMessageWithTaskId:(NSString*)taskId;

/**
 * make return message object
 * helper function
 *
 * @param taskId [in] task ID
 * @param params [in] return parameters
 * @return message object
 */
+ (NSDictionary*) makeMessageWithTaskId:(NSString*)taskId
                               andParams:(NSArray*)params;

/**
 * send success result
 *
 * @param context [in] method context object
 * @param result  [in] result message object
 */
+ (void) sendSuccessResultWithContext:(const CDPMethodContext*)context andResult:(NSDictionary*)result;

/**
 * send success result
 * helper function
 *
 * @param context [in] method context object
 * @param taskId  [in] task ID
 */
+ (void) sendSuccessResultWithContext:(const CDPMethodContext*)context andTaskId:(NSString*)taskId;

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
                         andMessage:(NSString*)message;

/**
 * send error result
 *
 * @param context [in] method context object
 * @param result  [in] result message object
 */
+ (void) sendErrorResultWithContext:(const CDPMethodContext*)context andResult:(NSDictionary*)result;

@end
