/**
 * @file CafeteriaMisc.m
 * @brief アプリケーション仕様を実現する上で雑多なNative処理を実現するクラス.
 */

#import <UIKit/UIKit.h>
#import "../Plugins/cordova-plugin-cdp-nativebridge/CDPGate.h"
#import "../Plugins/cordova-plugin-cdp-nativebridge/CDPNativeBridgeMsgUtils.h"
#import "../Classes/MainViewController.h"

#define TAG @"[Native][CafeteriaMisc]"

enum CAFETERIA_MISC_STATUSBAR_STYLE {
    CAFETERIA_MISC_STATUSBAR_STYLE_DEFAULT         = 0,
    CAFETERIA_MISC_STATUSBAR_STYLE_LIGHT_CONTENT   = 1,
};

// this class is instantiated by refrection. need not the header file.
@interface CafeteriaMisc : CDPGate
@end

@implementation CafeteriaMisc

/**
 * UUID を生成して文字列で返却
 */
- (void)generateUUID
{
    [self returnParams:[[NSUUID UUID] UUIDString]];
}

/**
 * ステータスバーの色変更
 *
 * @param styleId [in] CAFETERIA_MISC_STATUSBAR_STYLE
 */
- (void)changeStatusBarColor:(NSNumber*)styleId
{
    MainViewController* viewController = (MainViewController*)self.viewController;
    
    switch ([styleId intValue]) {
        case CAFETERIA_MISC_STATUSBAR_STYLE_DEFAULT:
            viewController.statusBarStyle = UIStatusBarStyleDefault;
            break;
        case CAFETERIA_MISC_STATUSBAR_STYLE_LIGHT_CONTENT:
            viewController.statusBarStyle = UIStatusBarStyleLightContent;
            break;
        default:
            NSLog(@"Unknown status bar style: %@", styleId);
            viewController.statusBarStyle = UIStatusBarStyleDefault;
            break;
    }
    
    [viewController setNeedsStatusBarAppearanceUpdate];
}

@end
