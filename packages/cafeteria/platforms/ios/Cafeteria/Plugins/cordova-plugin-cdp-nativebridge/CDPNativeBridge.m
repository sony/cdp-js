/**
 * @file CDPNativeBridge.m
 * @brief Implementation file for CDP NativeBridge class.
 */

#import "CDPNativeBridge.h"
#import "CDPMethodContext.h"
#import "CDPGate.h"
#import "CDPNativeBridgeMsgUtils.h"

@implementation CDPNativeBridge {
    NSMutableDictionary* _gates;
}

#define TAG @"[CDPNativeBridge][Native]"

//////////////////////////////////////////////////////
// Initialzier

- (void)pluginInitialize
{
    _gates = [@{} mutableCopy];
}

//////////////////////////////////////////////////////
// Plugin I/F

- (void) execTask:(CDVInvokedUrlCommand *)command
{
    CDPMethodContext* context = [[CDPMethodContext alloc] initWithPlugin:self andCommand:command];
    
    if (!context.className) {
        NSString* errorMsg = [NSString stringWithFormat:@"%@ the function is not supported on ios.", TAG];
        [CDPNativeBridgeMsgUtils sendErrorResultWithContext:context andTaskId:context.taskId andCode:CDP_NATIVEBRIDGE_ERROR_NOT_SUPPORT andMessage:errorMsg];
    } else {
        CDPGate* gate = [self getGateClassFromObjectId:context.objectId andClassName:context.className];
        if (!gate) {
            NSString* errorMsg = [NSString stringWithFormat:@"%@ class not found. class: %@", TAG, context.class];
            [CDPNativeBridgeMsgUtils sendErrorResultWithContext:context andTaskId:context.taskId andCode:CDP_NATIVEBRIDGE_ERROR_CLASS_NOT_FOUND andMessage:errorMsg];
        } else {
            NSDictionary* errorResult = [gate invokeWithContext:context];
            if (errorResult) {
                [CDPNativeBridgeMsgUtils sendErrorResultWithContext:context andResult:errorResult];
            }
        }
    }
}

- (void) cancelTask:(CDVInvokedUrlCommand *)command
{
    [self cancelProc:command];
}

- (void) disposeTask:(CDVInvokedUrlCommand *)command
{
    NSString* objectId = [self cancelProc:command];
    if (objectId) {
        [_gates[objectId] dispose];
        [_gates removeObjectForKey:objectId];
    }
}

//////////////////////////////////////////////////////
// private methods

//! get CDPGate class from cache.
- (CDPGate*) getGateClassFromObjectId:(NSString*)objectId andClassName:(NSString*)className
{
    CDPGate* gate = _gates[objectId];
    if (!gate) {
        gate = [self createGateClassFromClassName:className];
        if (gate) {
            _gates[objectId] = gate;
        }
    }
    return gate;
}

//! create CDPGate class by class name.
- (CDPGate*) createGateClassFromClassName:(NSString*)className
{
    id obj = [[NSClassFromString(className) alloc] initWithPlugin:self];
    if (![obj isKindOfClass:[CDPGate class]]) {
        obj = nil;
        NSLog(@"%@ %@ class is not CDPGate class.", TAG, className);
    }
    return obj;
}

//! cancel process
- (NSString*) cancelProc:(CDVInvokedUrlCommand *)command
{
    NSString* objectId = nil;
    
    CDPMethodContext* context = [[CDPMethodContext alloc] initWithPlugin:self andCommand:command];
    
    if (!context.className) {
        NSString* errorMsg = [NSString stringWithFormat:@"%@ the function is not supported on ios.", TAG];
        [CDPNativeBridgeMsgUtils sendErrorResultWithContext:context andTaskId:context.taskId andCode:CDP_NATIVEBRIDGE_ERROR_NOT_SUPPORT andMessage:errorMsg];
    } else {
        CDPGate* gate = [self getGateClassFromObjectId:context.objectId andClassName:context.className];
        if (!gate) {
            NSString* errorMsg = [NSString stringWithFormat:@"%@ class not found. class: %@", TAG, context.class];
            [CDPNativeBridgeMsgUtils sendErrorResultWithContext:context andTaskId:context.taskId andCode:CDP_NATIVEBRIDGE_ERROR_CLASS_NOT_FOUND andMessage:errorMsg];
        } else {
            [gate cancel:context];
            [CDPNativeBridgeMsgUtils sendSuccessResultWithContext:context andResult:[CDPNativeBridgeMsgUtils makeMessageWithTaskId:nil]];
            objectId = context.objectId;
        }
    }

    return objectId;
}

@end