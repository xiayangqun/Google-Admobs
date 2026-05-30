/****************************************************************************
 Copyright (c) 2023-2024 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You
shall not use Cocos Creator software for developing other software or tools
that's used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to
you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/
#import <GoogleMobileAds/GoogleMobileAds.h>
#import <UserMessagingPlatform/UserMessagingPlatform.h>

#import "AdServiceHub.h"

#import "core/Bridge.h"
#import "core/Codec.h"
#import "core/Route.h"
#import "VersionREQ.h"
#import "UMPCompleteNTF.h"

#import "service/AppOpenAdService.h"
#import "service/BannerService.h"
#import "service/InterstitialService.h"
#import "service/RewardedAdService.h"
#import "service/RewardedInterstitialAdService.h"
#import "service/NativeService.h"

@interface AdServiceHub()

@property (nonatomic, strong) Bridge *bridge;
@property (nonatomic, strong) Codec *codec;

@property (nonatomic, strong) AppOpenAdService *appOpenAdService;
@property (nonatomic, strong) BannerService *bannerService;
@property (nonatomic, strong) InterstitialService *interstitialService;
@property (nonatomic, strong) RewardedAdService *rewardedAdService;
@property (nonatomic, strong) RewardedInterstitialAdService *rewardedInterstitialAdService;
@property (nonatomic, strong) NativeService *nativeService;

@property (nonatomic, assign) BOOL umpCompleted;
@property (nonatomic, assign) BOOL umpResult;

@end

@implementation AdServiceHub

static AdServiceHub *sharedInstance = nil;

+ (instancetype)sharedInstance {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        sharedInstance = [[super allocWithZone:NULL] init];
    });
    return sharedInstance;
}

+ (id)allocWithZone:(struct _NSZone *)zone {
    return [AdServiceHub sharedInstance];
}

+ (id)copyWithZone:(struct _NSZone *)zone {
    return [AdServiceHub sharedInstance];
}

- (void)initAdService {
    // 从 Info.plist 读取配置
    NSBundle *bundle = [NSBundle mainBundle];
    NSString *path = [bundle pathForResource:@"Info" ofType:@"plist"];
    NSDictionary *plistDict = [NSDictionary dictionaryWithContentsOfFile:path];
    BOOL simulateEEA = [plistDict[@"AdMobSimulateEEA"] boolValue];
    BOOL umpReset = [plistDict[@"AdMobUMPReset"] boolValue];
    
    // 如果设置了重置，清除 UMP 同意状态
    if (umpReset) {
        [UMPConsentInformation.sharedInstance reset];
    }
    
    // 准备 UMP 请求参数
    UMPRequestParameters *parameters = [[UMPRequestParameters alloc] init];
    
    if (simulateEEA) {
        UMPDebugSettings *debugSettings = [[UMPDebugSettings alloc] init];
        debugSettings.geography = UMPDebugGeographyEEA;
        // 设置测试设备标识符（支持从 Info.plist 读取，未配置则自动获取设备 ID）
        NSString *testDeviceID = plistDict[@"UMPTestDeviceID"];
        if (!testDeviceID || testDeviceID.length == 0) {
            // 使用设备真实的 Vendor ID，UMP SDK 才能识别这台设备
            testDeviceID = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
        }
        debugSettings.testDeviceIdentifiers = @[testDeviceID];
        NSLog(@"[AdMob] UMP Debug mode enabled. testDeviceID: %@", testDeviceID);
        parameters.debugSettings = debugSettings;
    }
    
    __weak typeof(self) wself = self;
    
    // 请求 UMP 同意信息更新
    [UMPConsentInformation.sharedInstance 
        requestConsentInfoUpdateWithParameters:parameters
                             completionHandler:^(NSError *_Nullable error) {
        
        if (error) {
            NSLog(@"UMP consent info update failed: %@", error);
        }
        
        // 获取当前顶层的 view controller
        UIViewController *rootViewController = [wself getTopViewController];
        
        // 如果需要显示同意弹窗，则显示
        [UMPConsentForm loadAndPresentIfRequiredFromViewController:rootViewController
                                                  completionHandler:^(NSError *_Nullable formError) {
            if (formError) {
                NSLog(@"UMP form presentation failed: %@", formError);
            }
            
            // UMP 流程完成（包括自动调用 ATT），直接初始化 AdMob
            dispatch_async(dispatch_get_main_queue(), ^{
                [wself initializeAdMob];
            });
        }];
    }];
}

- (UIViewController *)getTopViewController {
    UIViewController *rootViewController = [self getRootViewController];
    // 递归查找最顶层的 presentedViewController
    while (rootViewController.presentedViewController) {
        rootViewController = rootViewController.presentedViewController;
    }
    return rootViewController;
}

- (UIViewController *)getRootViewController {
    NSSet<UIScene *> *connectedScenes = UIApplication.sharedApplication.connectedScenes;
    for (UIScene *scene in connectedScenes) {
        if ([scene isKindOfClass:[UIWindowScene class]]) {
            UIWindowScene *windowScene = (UIWindowScene *)scene;
            if (windowScene.activationState == UISceneActivationStateForegroundActive) {
                UIWindow *keyWindow = windowScene.windows.firstObject;
                return keyWindow.rootViewController;
            }
        }
    }
    return nil;
}

- (void)initializeAdMob {
    // Initialize Google Mobile Ads SDK.
    [GADMobileAds.sharedInstance startWithCompletionHandler:nil];
    
    self.codec = [[Codec alloc] init];
    self.bridge = [[Bridge alloc] initWithCodec:self.codec];
    
    __weak typeof(self) wself = self;
    [self.bridge.route on:[VersionREQ class].description type:[VersionREQ class] messageHandler:^(id arg) {
        VersionREQ *req = (VersionREQ *)arg;
        wself.extensionVersion = req.engineVersion;
        
        // 如果 UMP 在 JS 就绪前已完成，补发完成事件
        if (wself.umpCompleted) {
            [wself sendUMPCompleteEvent];
        }
    }];
    
    self.appOpenAdService = [[AppOpenAdService alloc] initWithBridge:self.bridge];
    self.bannerService = [[BannerService alloc] initWithBridge:self.bridge];
    self.interstitialService = [[InterstitialService alloc] initWithBridge:self.bridge];
    self.rewardedAdService = [[RewardedAdService alloc] initWithBridge:self.bridge];
    self.rewardedInterstitialAdService = [[RewardedInterstitialAdService alloc] initWithBridge:self.bridge];
    self.nativeService = [[NativeService alloc] initWithBridge:self.bridge];
    
    // UMP 就绪后立刻发送完成事件（同时保留 VersionREQ handler 中的补发逻辑）
    self.umpResult = UMPConsentInformation.sharedInstance.canRequestAds;
    self.umpCompleted = YES;
    [self sendUMPCompleteEvent];
}

- (void)sendUMPCompleteEvent {
    UMPCompleteNTF *ntf = [[UMPCompleteNTF alloc] initWithUnitId:@"" status:@"success" result:self.umpResult];
    [self.bridge sendToScript:[UMPCompleteNTF class].description src:ntf];
}

@end
