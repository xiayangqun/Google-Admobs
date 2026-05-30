/*
 Copyright (c) 2023-2024 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * @en
 * AdmobOption, used to store the configurations in the build panel.
 * After the build process completed, the custom options will be passed through the `onAfterBuild` method in the `hook.js`.
 * The options can be fetched using `options.packages[PACKAGE_NAME]` 
 */
export interface AdmobOption {
    /**
     * @en
     * The applicationId configured in the google mobile adk administrator website.
     * Visit https://apps.admob.com/v2/home to create your own application.
     */
    applicationId?: string;

    /**
     * @en
     * Enable or disable the admob extension.
     * Once enabled, some files will be replaced by the template in this extension.
     */
    enableAdMob?: boolean;

    /**
     * @en
     * Overwrite all the files exported in the built project by the file in the extension templates.
     */
    overwriteLibrary?: boolean;

    /**
     * @en
     * Configure Android ad requests as child-directed and restrict ad content rating to G.
     * Enable this only for Google Play Families / child-directed builds.
     */
    enableChildDirectedTreatment?: boolean;

    /**
     * @en
     * The minimum Android SDK version required to run the application.
     */
    minSdkVersion?: number;

    /**
     * @en
     * The Android Build Tools version used for compilation.
     */
    buildToolsVersion?: string;

    /**
     * @en
     * The Android Gradle Plugin version used for compilation.
     */
    agpVersion?: string;

    /**
     * @en
     * Simulate EEA region for UMP testing. Only available on iOS.
     * When enabled, the app will always show GDPR consent dialog on startup.
     */
    simulateEEA?: boolean;

    /**
     * @en
     * Reset UMP consent state on every app launch. Only available on iOS.
     * When enabled, the user's previous consent choice will be cleared.
     */
    umpReset?: boolean;

    /**
     * @en
     * Modify AppDelegate.mm to add AdMob initialization code.
     * Adds #import "AdServiceHub.h" and [[AdServiceHub sharedInstance] initAdService]; after each build.
     * Only available on iOS.
     */
    modifyAppDelegate?: boolean;

    /**
     * @en
     * Remove '-Wl,-ld_classic' from Other Linker Flags.
     * Xcode 26 (Apple Clang 17+) removed the classic linker, so this flag causes build failure.
     * Only available on iOS.
     */
    removeLdClassic?: boolean;
}
