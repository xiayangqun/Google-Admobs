# Google AdMob 扩展

## 简介

本扩展基于 [Cocos Store 上的原版插件](https://store.cocos.com/app/detail/5271) 进行二次开发，为 Cocos Creator 游戏提供 Google AdMob 广告集成方案。

### 主要改进

- **升级 AdMob SDK 版本**
  - Android: `play-services-ads:25.2.0`
  - iOS: `GoogleMobileAds 13.3.0`
- **优化 iOS 构建流程**
  - 使用 PlistBuddy 动态修改 Info.plist，不再替换整个文件
  - 自动从 project.pbxproj 读取正确的 Info.plist 路径
  - 自动配置 Xcode 项目（添加 framework、Swift 文件、设置 Swift 版本）
- **新增功能**
  - 支持移除 Xcode 26 不兼容的 `-Wl,-ld_classic` 链接器标志
  - 自动设置 Launch Screen File
  - 支持 UMP（用户消息平台）自动集成 GDPR 合规
- **代码优化**
  - 重构目录结构，更清晰的模块划分
  - 改进错误处理和日志输出

---

## 安装插件

**方式一：直接复制**

将插件放入 Cocos Creator 项目的 `extensions` 目录。

**方式二：开发者导入**

在 Cocos Creator 编辑器中，打开 `扩展管理器`，在 `导入扩展文件(.zip)` 旁的下拉菜单中选择 `开发者导入`，选择本插件项目目录即可。这会在 Cocos 项目的 `extensions` 目录中创建一个软链接，方便开发调试。

---

## 构建面板配置

### Android 配置

| 选项 | 说明 | 默认值 |
|------|------|--------|
| **启用** | 启用/禁用 AdMob 模块 | ✅ |
| **覆盖已存在的库文件** | 强制覆盖已存在的库文件 | ✅ |
| **应用 ID** | AdMob 应用 ID（必填） | - |
| **儿童定向广告请求** | 仅限 Google Play Families / 面向儿童版本 | ❌ |
| **最低 SDK 版本** | 运行应用所需的最低 Android SDK 版本 | 23 |
| **构建工具版本** | Android Build Tools 版本 | 35.0.1 |
| **AGP 版本** | Android Gradle Plugin 版本 | 8.1.0 |

### iOS 配置

| 选项 | 说明 | 默认值 |
|------|------|--------|
| **启用** | 启用/禁用 AdMob 模块 | ✅ |
| **覆盖已存在的库文件** | 强制覆盖已存在的库文件 | ✅ |
| **应用 ID** | AdMob 应用 ID（必填） | - |
| **移除链接器 -Wl,-ld_classic 标志** | Xcode 26（Apple Clang 17+）已移除经典链接器，启用此选项可自动移除 | ✅ |
| **模拟 EEA 地区** | 仅 iOS 调试，强制显示 GDPR 同意弹窗 | ❌ |
| **重置 UMP 同意状态** | 仅 iOS 调试，每次启动重置同意状态 | ❌ |
| **修改 AppDelegate** | 在 AppDelegate.mm 中添加 AdMob 初始化代码 | ✅ |

---

## TypeScript 接口使用

### 导入方式

```typescript
import { BannerClient } from 'db://admob/ads/client/BannerClient';
import { AppOpenAdClient } from 'db://admob/ads/client/AppOpenAdClient';
import { RewardedAdClient } from 'db://admob/ads/client/RewardedAdClient';
import { InterstitialAdClient } from 'db://admob/ads/client/InterstitialAdClient';
import { LoadAdError } from 'db://admob/ads/alias/TypeAlias';
import { BannerPaidEventNTF } from 'db://admob/proto/PaidEventNTF';
import { BannerSizeType } from 'db://admob/misc/BannerSizeType';
import { AdFormat, getTestAdUnitId } from 'db://admob/misc/TestUnitId';
```

### Banner 广告

```typescript
import { BannerClient } from 'db://admob/ads/client/BannerClient';
import { BannerSizeType } from 'db://admob/misc/BannerSizeType';
import { LoadAdError } from 'db://admob/ads/alias/TypeAlias';
import { BannerPaidEventNTF } from 'db://admob/proto/PaidEventNTF';

// 创建 Banner 客户端
const bannerClient = new BannerClient();

// 加载并显示 Banner
bannerClient.load("ca-app-pub-xxxxx/xxxxx", {
    onAdLoaded: () => {
        console.log("Banner 加载成功");
    },
    onAdFailedToLoad: (loadError: LoadAdError) => {
        console.log("Banner 加载失败:", loadError);
    },
    onAdClicked: () => {
        console.log("Banner 被点击");
    },
    onAdImpression: () => {
        console.log("Banner 展示");
    },
    onPaidEvent: (paidNTF: BannerPaidEventNTF) => {
        console.log("Banner 付费事件:", paidNTF);
    },
}, { type: BannerSizeType.Portrait });

// 控制显示/隐藏
bannerClient.show(true);   // 显示
bannerClient.show(false);  // 隐藏

// 销毁
bannerClient.destroy();
```

### 插页广告

```typescript
import { InterstitialAdClient } from 'db://admob/ads/client/InterstitialAdClient';

const interstitialClient = new InterstitialAdClient();

// 加载插页广告
interstitialClient.load("ca-app-pub-xxxxx/xxxxx", {
    onAdLoaded: () => {
        console.log("插页广告加载成功");
        // 显示广告
        interstitialClient.show();
    },
    onAdFailedToLoad: (loadAdError) => {
        console.log("插页广告加载失败:", loadAdError);
    },
    onAdDismissedFullScreenContent: () => {
        console.log("插页广告已关闭");
        interstitialClient.destroy();
    },
    onAdFailedToShowFullScreenContent: (adError) => {
        console.log("插页广告显示失败:", adError);
        interstitialClient.destroy();
    },
});
```

### 激励视频广告

```typescript
import { RewardedAdClient } from 'db://admob/ads/client/RewardedAdClient';

const rewardedClient = new RewardedAdClient();

// 加载激励视频
rewardedClient.load("ca-app-pub-xxxxx/xxxxx", {
    onAdLoaded: () => {
        console.log("激励视频加载成功");
        rewardedClient.show();
    },
    onAdFailedToLoad: (loadAdError) => {
        console.log("激励视频加载失败:", loadAdError);
    },
    onEarn: (rewardType, amount) => {
        console.log("用户获得奖励:", rewardType, amount);
        // 发放奖励
    },
    onAdDismissedFullScreenContent: () => {
        console.log("激励视频已关闭");
        rewardedClient.destroy();
    },
    onAdFailedToShowFullScreenContent: (adError) => {
        console.log("激励视频显示失败:", adError);
        rewardedClient.destroy();
    },
});
```

### App Open 广告

```typescript
import { AppOpenAdClient } from 'db://admob/ads/client/AppOpenAdClient';

const appOpenClient = new AppOpenAdClient();

// 加载 App Open 广告
appOpenClient.loadAd("ca-app-pub-xxxxx/xxxxx", {
    onAdLoaded: () => {
        console.log("App Open 广告加载成功");
        appOpenClient.show(() => {
            console.log("App Open 广告显示完成");
        });
    },
    onAdFailedToLoad: (loadAdError) => {
        console.log("App Open 广告加载失败:", loadAdError);
    },
    onShowAdComplete: (unitId) => {
        console.log("App Open 广告显示完成:", unitId);
    },
});
```

### UMP 管理器（GDPR 合规）

`UMPManager` 用于处理 GDPR 同意流程完成后的回调。在 EEA 地区，需要等待 UMP 流程完成后再加载广告。

```typescript
import { UMPManager } from 'db://admob/core/UMPManager';

// 注册 UMP 完成回调
UMPManager.instance.onCompleteOnce((result: boolean) => {
    if (result) {
        // 用户同意，可以加载广告
        console.log("UMP 完成，用户同意");
        loadAds();
    } else {
        // 用户拒绝或 UMP 不可用
        console.log("UMP 完成，用户拒绝或不可用");
    }
});
```

**UMPManager 特性：**
- 支持在 UMP 完成前注册回调 → 完成后自动触发
- 支持在 UMP 完成后注册回调 → 立即触发
- Android 无 UMP 时 → 注册后立即触发

---

## iOS 隐私合规（重要！）

### 1. ATT（App Tracking Transparency）- iOS 强制要求

从 iOS 14.5 开始，Apple 要求所有应用在访问设备的 IDFA（广告标识符）之前，必须先获得用户授权。

**配置步骤：**

1. 登录 [AdMob 后台](https://apps.admob.com)
2. 进入 **隐私权和消息** 页面
3. 点击 **创建消息**
4. 选择 **IDFA explainer message** 类型
5. 配置消息内容（解释为什么需要用户数据）
6. 发布消息

配置完成后，UMP SDK 会在应用启动时自动显示 IDFA explainer message，然后自动调用 iOS 系统的 ATT 弹窗。

**本插件不需要手动调用 ATT 接口**，由 UMP SDK 统一管理。

### 2. GDPR（欧盟地区合规）- EEA 地区要求

在欧洲经济区（EEA）展示广告时，需要先获得用户同意。Google 提供了 UMP（用户消息平台）来管理这个流程。

**配置步骤：**

1. 登录 [AdMob 后台](https://apps.admob.com)
2. 进入 **隐私权和消息** 页面
3. 点击 **创建消息**
4. 选择 **GDPR** 消息类型
5. 配置消息内容和样式
6. 发布消息

**UMP 流程（EEA 地区）：**
```
请求 UMP 同意信息 → 显示 GDPR 弹窗 → 显示 IDFA explainer → 自动调用 ATT 弹窗 → 初始化 AdMob
```

**UMP 流程（非 EEA 地区）：**
```
请求 UMP 同意信息 → 显示 IDFA explainer → 自动调用 ATT 弹窗 → 初始化 AdMob
```

### 3. 测试隐私合规

在构建面板中：
- **Simulate EEA Region**：模拟 EEA 地区，强制显示 GDPR 同意弹窗（仅用于调试）
- **Reset UMP Consent State**：每次启动重置同意状态（仅用于调试）

### 4. 常见错误

如果看到以下错误：
```
UMP consent info update failed: Failed to read publisher's account configuration
```

**这不是代码问题**，而是 AdMob 后台没有配置隐私消息。请按照上述步骤在 AdMob 后台配置 IDFA explainer message 和/或 GDPR 消息。

---

## 依赖说明

### Python 依赖（iOS 构建必需）

iOS 构建需要使用 Python 脚本配置 Xcode 项目，请确保已安装以下依赖：

```bash
pip install "pbxproj>=3.2.0,<5.0.0"
```

> 如果不安装此依赖，iOS 构建时 Xcode 项目配置（添加 framework、Swift 文件、设置 Swift 版本）将失败。

### npm 依赖

首次使用插件时，需要在插件目录下安装 npm 依赖：

```bash
cd extensions/Google\ AdMob
npm install
```

依赖列表：
- `fs-extra`：文件操作工具库

---

## 构建后自动操作

### Android

- 自动复制 `libadmob` 模块到构建目录
- 自动修改 `build.gradle` 和 `settings.gradle`
- 自动注入初始化代码到 `AppActivity.java`

### iOS

- 自动复制 AdMob 源码和 SDK 到构建目录
- 自动修改 `Info.plist`（添加 GADApplicationIdentifier、SKAdNetworkItems 等）
- 自动配置 Xcode 项目（添加 framework、Swift 文件、设置 Swift 版本为 6）
- 自动移除 `-Wl,-ld_classic`（Xcode 26 兼容性）
- 自动修改 `AppDelegate.mm` 注入初始化代码

---

## 注意事项

1. **Application Id 必须正确配置**：这是在 AdMob 后台创建的应用 ID
2. **不要使用测试 Unit Id 发布**：发布前请替换为正式的广告单元 ID
3. **iOS 需要配置隐私消息**：否则会看到 UMP 错误日志（不影响功能，但影响合规）
4. **Xcode 26 用户**：请确保勾选 "Remove -Wl,-ld_classic" 选项

---

## 版本历史

### v1.0.4（当前版本）
- 升级 Android AdMob SDK 到 25.2.0
- 升级 iOS AdMob SDK 到 13.3.0
- 优化 iOS plist 处理（使用 PlistBuddy）
- 添加 Xcode 26 兼容性（移除 -Wl,-ld_classic）
- 支持 UMP 自动集成 GDPR 合规
- 重构代码结构

### v1.0.3（原版）
- 基础 AdMob 集成
- 支持 Banner、插页、激励视频、原生广告

---

## 许可证

MIT License
