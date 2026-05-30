module.exports = {
    title: "Cocos Creator 谷歌 AdMobile 插件",
    ruleTest_msg: "填写字段不满足规则，请输入 'cocos'",
    options: {
        enterCocos: "请输入 'cocos' 字符 ",
        remoteAddress: "资源服务地址",
        selectTest: "select 选项测试",
        selectTestOption1: "选项 （1）",
        selectTestOption2: "选项 （2）",
        objectTest: "Object 复合类型配置示例",
        arrayTest: "Array 复合类型配置示例",
        complexTestNumber: "Number",
        complexTestBoolean: "Boolean",
        complexTestString: "String"
    },
    description: "构建插件的一个简单示例",

    enableAdMob: {
        title: "启用",
        tip: "启用或禁用 admob，启用后会导出扩展 template 目录内的文件到您的build和 project/native 目录内。"
    },
    applicationId: {
        title: "应用 ID ",
        placeholder: "请输入您的 Application Id ..",
        tip: "在 admob 后台配置的 applicationId",
    },
    warn: {
        title: "注意：",
        content: `默认采用的是测试用 unitId，在发布到正式环境时请务必将这些 unitId 修改为正式 Id`,
    },
    overwriteLibrary: {
        title: "覆盖已存在的库文件",
        tip: "覆盖已有的库文件，这个操作会覆盖 ${build/your build/proj/libadmob} 内的文件。",
    },

    enableChildDirectedTreatment: {
        title: "儿童定向广告请求",
        tip: "仅 Android：勾选后会在 AdMob 初始化前设置面向儿童处理，并将广告内容分级限制为 G。仅 Google Play Families / 面向儿童版本启用。",
    },

    minSdkVersion: {
        title: "最低 SDK 版本",
        tip: "运行应用所需的最低 Android SDK 版本（例如 23 对应 Android 6.0）。",
    },

    buildToolsVersion: {
        title: "构建工具版本",
        placeholder: "例如：35.0.1",
        tip: "用于编译的 Android Build Tools 版本。如果使用 compileSdk 35，建议使用 35.0.1 或更高版本。",
    },

    agpVersion: {
        title: "AGP 版本",
        placeholder: "例如：8.1.0",
        tip: "Android Gradle Plugin 版本。如果使用 compileSdk 35，建议使用 8.1.0 或更高版本。",
    },

    simulateEEA: {
        title: "模拟 EEA 地区",
        tip: "[仅 iOS 调试] 强制设备模拟位于 EEA 地区，用于测试 GDPR 同意弹窗。请勿在正式构建中启用。",
    },

    umpReset: {
        title: "重置 UMP 同意状态",
        tip: "[仅 iOS 调试] 每次启动应用时重置用户的 UMP 同意选择。适用于反复测试同意流程。",
    },

    modifyAppActivity:{
        title: "修改 AppActivity",
        tip: "该选项会修改 AppActivity.java 内的文件，包含：引用 libadmob 的库文件，增加入口函数，如取消，则需要手动添加。",
    },

    modifyAppDelegate: {
        title: "修改 AppDelegate",
        tip: "在 AppDelegate.mm 中添加 AdMob 初始化代码（#import AdServiceHub.h 和 initAdService 调用）。",
    },

    overwriteXcodeproj: {
        title: "覆盖 Xcode 项目",
        tip: "使用 build-templates/ios/proj/ 目录下的 .xcodeproj 覆盖生成的项目（最后执行，会覆盖之前所有修改）。",
    },

    removeLdClassic: {
        title: "移除链接器 -Wl,-ld_classic 标志",
        tip: "Xcode 26（Apple Clang 17+）已移除经典链接器。如果 Other Linker Flags 中存在 '-Wl,-ld_classic'，将导致编译失败。启用此选项可自动移除。",
    },

};
