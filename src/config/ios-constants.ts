/**
 * iOS Platform Constants
 */

export class iOSConstants {
    /**
     * iOS native engine path
     */
    static readonly NativePath = `${Editor.Project.path}/native/engine/ios`;

    /**
     * AdMob source directory name in build output
     */
    static readonly AdmobDirName = "admob";

    /**
     * SDK directory name
     */
    static readonly SdkDirName = "sdk";

    /**
     * Swift placeholder file name
     */
    static readonly SwiftPlaceholderFile = "GoogleMobileAdsPlaceholder.swift";

    /**
     * Required Swift version for AdMob SDK
     */
    static readonly SwiftVersion = "6";

    /**
     * Required linker flags
     */
    static readonly LinkerFlags = ["-ObjC"];
}
