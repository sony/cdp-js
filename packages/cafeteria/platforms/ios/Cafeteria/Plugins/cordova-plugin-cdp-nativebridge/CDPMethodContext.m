/**
 * @file CDPMethodContext.m
 * @brief Implementation file for CDP NativeBridge Gate Context class.
 */

#import "CDPMethodContext.h"

@implementation CDPMethodContext {
    NSString* _objectId;
    NSString* _taskId;
    BOOL _compatible;
    NSString* _threadId;
    BOOL _needSendResult;
}

/**
 * initializer
 *
 * @param plugin    [in] plugin instance
 * @param command   [in] command object
 */
- (id)initWithPlugin:(const CDVPlugin*)plugin andCommand:(const CDVInvokedUrlCommand*)command
{
    NSDictionary* execInfo = command.arguments[0];
    NSArray* methodArgs = [self methodArguments:command.arguments];
    
    self = [super initWithArguments:methodArgs
                         callbackId:command.callbackId
                          className:[self isNull:execInfo[@"feature"][@"ios"][@"packageInfo"]] ? nil : execInfo[@"feature"][@"ios"][@"packageInfo"]
                         methodName:[self isNull:execInfo[@"method"]] ? nil : execInfo[@"method"]];
    if (self) {
        self.commandDelegate = plugin.commandDelegate;
        _objectId = execInfo[@"objectId"];
        _taskId = [self isNull:execInfo[@"taskId"]] ? nil : execInfo[@"taskId"];
        _compatible = [self isNull:execInfo[@"compatible"]] ? NO : [execInfo[@"compatible"] boolValue];
        _threadId = [NSString stringWithFormat:@"%@", [NSThread currentThread]];
        _needSendResult = YES;
    }
    return self;
}

//////////////////////////////////////////////////////
// private methods

//! slice method arguments.
- (NSArray*) methodArguments:(NSArray*)rawArgs
{
    if (1 < [rawArgs count]) {
        NSRange range;
        range.location = 1;
        range.length = [rawArgs count] - 1;
        return [rawArgs subarrayWithRange:range];
    } else {
        return @[];
    }
}

//! slice method arguments.
- (BOOL) isNull:(id)object
{
    return [NSStringFromClass([object class]) isEqualToString:@"NSNull"];
}

@end
