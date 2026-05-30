module.exports = {
    title: "Cocos Google Admob Extension.",
    ruleTest_msg:
        "The filled text does not meet the rules, please enter 'cocos'",

    options: {
        enterCocos: "Please Enter cocos ",

        remoteAddress: "RemoteAddress",

        selectTest: "Select Options",
        selectTestOption1: "option （1）",
        selectTestOption2: "option （2）",
        objectTest: "Object Options Example",
        arrayTest: "Array Options Example",
        complexTestNumber: "Number",
        complexTestBoolean: "Boolean",
        complexTestString: "String"
    },

    description: "A single example about Cocos Build Plugin",

    enableAdMob: {
        title: "EnableAdMob",
        tip: "Enable or disable the admob module, this will copy or replace some files in {build/YourbuildNam} and {project/native}"
    },

    applicationId: {
        title: "Application Id",
        placeholder: "Please enter your Application Id ..",
        tip: "The applicationId configured in the Google Mobile Ad official website (https://apps.admob.com/v2/home)."
    },

    warn: {
        title: "Note：",
        content: `Please do not use the test unitIds when you decide to publish your application on shelf.`,
    },

    overwriteLibrary: {
        title: "Force overwrite the libadmob library",
        tip: "Force overwrite the files in the built proj/libadmob from the extension's template.",
    },

    enableChildDirectedTreatment: {
        title: "Child-directed ad requests",
        tip: "Android only: when enabled, AdMob is configured for child-directed treatment and max ad content rating G before initialization. Use only for Google Play Families / child-directed builds.",
    },

    minSdkVersion: {
        title: "Min SDK Version",
        tip: "The minimum Android SDK version required to run the application (e.g., 23 for Android 6.0).",
    },

    buildToolsVersion: {
        title: "Build Tools Version",
        placeholder: "e.g., 35.0.1",
        tip: "The Android Build Tools version used for compilation. Use 35.0.1 or higher for compileSdk 35.",
    },

    agpVersion: {
        title: "AGP Version",
        placeholder: "e.g., 8.1.0",
        tip: "The Android Gradle Plugin version. Use 8.1.0 or higher for compileSdk 35.",
    },

    simulateEEA: {
        title: "Simulate EEA Region",
        tip: "[iOS Debug Only] Force the device to appear as if it is in the EEA region for testing GDPR consent dialogs. Do not enable this in production builds.",
    },

    umpReset: {
        title: "Reset UMP Consent State",
        tip: "[iOS Debug Only] Reset the user's UMP consent choice every time the app launches. Useful for testing the consent flow repeatedly.",
    },

    modifyAppActivity:{
        title: "Modify AppActivity",
        tip: "This option will modify the AppActivity.java, add code include the entry function and import of libadmob to the AppActivity",
    },

    modifyAppDelegate: {
        title: "Modify AppDelegate",
        tip: "Add AdMob initialization code to AppDelegate.mm (#import AdServiceHub.h and initAdService call).",
    },

    overwriteXcodeproj: {
        title: "Overwrite Xcode Project",
        tip: "Use the .xcodeproj from build-templates/ios/proj/ to overwrite the generated project (executes last, overrides all previous modifications).",
    },

    removeLdClassic: {
        title: "Remove -Wl,-ld_classic from Linker Flags",
        tip: "Xcode 26 (Apple Clang 17+) removed the classic linker. If '-Wl,-ld_classic' is present in Other Linker Flags, the build will fail. Enable this option to automatically remove it after build.",
    },

};
