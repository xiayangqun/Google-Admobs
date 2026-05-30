# Google AdMob Extension

## Introduction

This extension is based on the [original plugin on Cocos Store](https://store.cocos.com/app/detail/5271) and has been further developed to provide a Google AdMob ad integration solution for Cocos Creator games.

### Key Improvements

- **Upgraded AdMob SDK versions**
  - Android: `play-services-ads:25.2.0`
  - iOS: `GoogleMobileAds 13.3.0`
- **Optimized iOS build process**
  - Uses PlistBuddy to dynamically modify Info.plist instead of replacing the entire file
  - Automatically reads the correct Info.plist path from project.pbxproj
  - Automatically configures Xcode project (adds frameworks, Swift files, sets Swift version)
- **New features**
  - Support for removing Xcode 26 incompatible `-Wl,-ld_classic` linker flag
  - Automatic UMP (User Messaging Platform) integration for GDPR compliance
- **Code optimization**
  - Refactored directory structure for clearer module organization
  - Improved error handling and logging

---

## Installation

**Method 1: Direct Copy**

Place the plugin into the `extensions` directory of your Cocos Creator project.

**Method 2: Developer Import**

In the Cocos Creator editor, open `Extension Manager`, click the dropdown menu next to `Import Extension File (.zip)` and select `Developer Import`, then choose this plugin project directory. This will create a symbolic link in the Cocos project's `extensions` directory, which is convenient for development and debugging.

---

## Build Panel Configuration

### Android Configuration

| Option | Description | Default |
|--------|-------------|---------|
| **Enable AdMob** | Enable/disable the AdMob module | ✅ |
| **Overwrite existing library** | Force overwrite existing library files | ✅ |
| **Application ID** | AdMob application ID (required) | - |
| **Child-directed ad requests** | Only for Google Play Families / child-directed builds | ❌ |
| **Min SDK Version** | Minimum Android SDK version required | 23 |
| **Build Tools Version** | Android Build Tools version | 35.0.1 |
| **AGP Version** | Android Gradle Plugin version | 8.1.0 |

### iOS Configuration

| Option | Description | Default |
|--------|-------------|---------|
| **Enable AdMob** | Enable/disable the AdMob module | ✅ |
| **Overwrite existing library** | Force overwrite existing library files | ✅ |
| **Application ID** | AdMob application ID (required) | - |
| **Remove -Wl,-ld_classic linker flag** | Xcode 26 (Apple Clang 17+) removed the classic linker, enable this to automatically remove it | ✅ |
| **Simulate EEA region** | iOS debug only, force display GDPR consent dialog | ❌ |
| **Reset UMP consent state** | iOS debug only, reset consent state on each launch | ❌ |
| **Modify AppDelegate** | Add AdMob initialization code to AppDelegate.mm | ✅ |

---

## TypeScript API Usage

### Import

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

### Banner Ad

```typescript
import { BannerClient } from 'db://admob/ads/client/BannerClient';
import { BannerSizeType } from 'db://admob/misc/BannerSizeType';
import { LoadAdError } from 'db://admob/ads/alias/TypeAlias';
import { BannerPaidEventNTF } from 'db://admob/proto/PaidEventNTF';

// Create Banner client
const bannerClient = new BannerClient();

// Load and show Banner
bannerClient.load("ca-app-pub-xxxxx/xxxxx", {
    onAdLoaded: () => {
        console.log("Banner loaded successfully");
    },
    onAdFailedToLoad: (loadError: LoadAdError) => {
        console.log("Banner failed to load:", loadError);
    },
    onAdClicked: () => {
        console.log("Banner clicked");
    },
    onAdImpression: () => {
        console.log("Banner impression");
    },
    onPaidEvent: (paidNTF: BannerPaidEventNTF) => {
        console.log("Banner paid event:", paidNTF);
    },
}, { type: BannerSizeType.Portrait });

// Show/Hide
bannerClient.show(true);   // Show
bannerClient.show(false);  // Hide

// Destroy
bannerClient.destroy();
```

### Interstitial Ad

```typescript
import { InterstitialAdClient } from 'db://admob/ads/client/InterstitialAdClient';

const interstitialClient = new InterstitialAdClient();

// Load interstitial ad
interstitialClient.load("ca-app-pub-xxxxx/xxxxx", {
    onAdLoaded: () => {
        console.log("Interstitial loaded successfully");
        // Show the ad
        interstitialClient.show();
    },
    onAdFailedToLoad: (loadAdError) => {
        console.log("Interstitial failed to load:", loadAdError);
    },
    onAdDismissedFullScreenContent: () => {
        console.log("Interstitial dismissed");
        interstitialClient.destroy();
    },
    onAdFailedToShowFullScreenContent: (adError) => {
        console.log("Interstitial failed to show:", adError);
        interstitialClient.destroy();
    },
});
```

### Rewarded Ad

```typescript
import { RewardedAdClient } from 'db://admob/ads/client/RewardedAdClient';

const rewardedClient = new RewardedAdClient();

// Load rewarded ad
rewardedClient.load("ca-app-pub-xxxxx/xxxxx", {
    onAdLoaded: () => {
        console.log("Rewarded ad loaded successfully");
        rewardedClient.show();
    },
    onAdFailedToLoad: (loadAdError) => {
        console.log("Rewarded ad failed to load:", loadAdError);
    },
    onEarn: (rewardType, amount) => {
        console.log("User earned reward:", rewardType, amount);
        // Grant reward to user
    },
    onAdDismissedFullScreenContent: () => {
        console.log("Rewarded ad dismissed");
        rewardedClient.destroy();
    },
    onAdFailedToShowFullScreenContent: (adError) => {
        console.log("Rewarded ad failed to show:", adError);
        rewardedClient.destroy();
    },
});
```

### App Open Ad

```typescript
import { AppOpenAdClient } from 'db://admob/ads/client/AppOpenAdClient';

const appOpenClient = new AppOpenAdClient();

// Load App Open ad
appOpenClient.loadAd("ca-app-pub-xxxxx/xxxxx", {
    onAdLoaded: () => {
        console.log("App Open ad loaded successfully");
        appOpenClient.show(() => {
            console.log("App Open ad show complete");
        });
    },
    onAdFailedToLoad: (loadAdError) => {
        console.log("App Open ad failed to load:", loadAdError);
    },
    onShowAdComplete: (unitId) => {
        console.log("App Open ad show complete:", unitId);
    },
});
```

### UMP Manager (GDPR Compliance)

`UMPManager` is used to handle callbacks after the GDPR consent flow completes. In EEA regions, you need to wait for the UMP flow to complete before loading ads.

```typescript
import { UMPManager } from 'db://admob/core/UMPManager';

// Register UMP completion callback
UMPManager.instance.onCompleteOnce((result: boolean) => {
    if (result) {
        // User consented, can load ads
        console.log("UMP complete, user consented");
        loadAds();
    } else {
        // User denied or UMP not available
        console.log("UMP complete, user denied or not available");
    }
});
```

**UMPManager Features:**
- Register callback before UMP completes → triggers automatically after completion
- Register callback after UMP completes → triggers immediately
- Android without UMP → triggers immediately upon registration

---

## iOS Privacy Compliance (Important!)

### 1. ATT (App Tracking Transparency) - iOS Requirement

Starting from iOS 14.5, Apple requires all apps to obtain user authorization before accessing the device's IDFA (Identifier for Advertisers).

**Configuration steps:**

1. Log in to [AdMob Console](https://apps.admob.com)
2. Go to **Privacy & messaging** page
3. Click **Create message**
4. Select **IDFA explainer message** type
5. Configure the message content (explain why user data is needed)
6. Publish the message

Once configured, the UMP SDK will automatically display the IDFA explainer message at app launch, then automatically invoke the iOS system ATT dialog.

**This plugin does not require manual ATT API calls** - it is managed by the UMP SDK.

### 2. GDPR (EU Region Compliance) - EEA Region Requirement

When displaying ads in the European Economic Area (EEA), user consent is required first. Google provides the UMP (User Messaging Platform) to manage this flow.

**Configuration steps:**

1. Log in to [AdMob Console](https://apps.admob.com)
2. Go to **Privacy & messaging** page
3. Click **Create message**
4. Select **GDPR** message type
5. Configure the message content and style
6. Publish the message

**UMP flow (EEA region):**
```
Request UMP consent info → Show GDPR dialog → Show IDFA explainer → Auto invoke ATT dialog → Initialize AdMob
```

**UMP flow (Non-EEA region):**
```
Request UMP consent info → Show IDFA explainer → Auto invoke ATT dialog → Initialize AdMob
```

### 3. Testing Privacy Compliance

In the build panel:
- **Simulate EEA region**: Simulate EEA region, force display GDPR consent dialog (debug only)
- **Reset UMP consent state**: Reset consent state on each launch (debug only)

### 4. Common Errors

If you see the following error:
```
UMP consent info update failed: Failed to read publisher's account configuration
```

**This is not a code issue** - it means privacy messages are not configured in the AdMob console. Please follow the steps above to configure IDFA explainer message and/or GDPR message in the AdMob console.

---

## Post-Build Automatic Operations

### Android

- Automatically copies `libadmob` module to build directory
- Automatically modifies `build.gradle` and `settings.gradle`
- Automatically injects initialization code into `AppActivity.java`

### iOS

- Automatically copies AdMob source code and SDK to build directory
- Automatically modifies `Info.plist` (adds GADApplicationIdentifier, SKAdNetworkItems, etc.)
- Automatically configures Xcode project (adds frameworks, Swift files, sets Swift version to 6)
- Automatically removes `-Wl,-ld_classic` (Xcode 26 compatibility)
- Automatically modifies `AppDelegate.mm` to inject initialization code

---

## Dependencies

### Python Dependency (Required for iOS builds)

iOS builds require a Python script to configure the Xcode project. Please ensure the following dependency is installed:

```bash
pip install "pbxproj>=3.2.0,<5.0.0"
```

> Without this dependency, iOS build Xcode project configuration (adding frameworks, Swift files, setting Swift version) will fail.

### npm Dependencies

When first using the plugin, you need to install npm dependencies in the plugin directory:

```bash
cd extensions/Google\ AdMob
npm install
```

Dependencies:
- `fs-extra`: File operation utility library

---

## Notes

1. **Application ID must be correctly configured**: This is the app ID created in the AdMob console
2. **Do not use test Unit IDs for release**: Replace with production ad unit IDs before publishing
3. **iOS requires privacy message configuration**: Otherwise you will see UMP error logs (does not affect functionality, but affects compliance)
4. **Xcode 26 users**: Make sure to check "Remove -Wl,-ld_classic" option

---

## Version History

### v1.0.4 (Current)
- Upgraded Android AdMob SDK to 25.2.0
- Upgraded iOS AdMob SDK to 13.3.0
- Optimized iOS plist handling (using PlistBuddy)
- Added Xcode 26 compatibility (removed -Wl,-ld_classic)
- Support for UMP automatic GDPR compliance integration
- Refactored code structure

### v1.0.3 (Original)
- Basic AdMob integration
- Support for Banner, Interstitial, Rewarded, Native ads

---

## License

MIT License
