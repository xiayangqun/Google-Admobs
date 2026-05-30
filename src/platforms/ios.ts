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

import { IBuildResult } from "../../@types";
import { PACKAGE_NAME, configs } from "../builder";
import { AdmobOption } from "../types";
import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as path from 'path';
import { execSync } from 'child_process';
import { ITaskOptions } from "../build-hooks";
import { PlistUtils } from "../utils/plist";
import { SKADNETWORK_IDS } from "../config/skadnetwork-ids";

const TAG = "[BuildTaskiOS]";

// 插件根目录
const PLUGIN_ROOT = path.resolve(__dirname, '../..');

export class BuildTaskiOS {

    /**
     * iOS 源代码目录（AdMob 业务代码）
     */
    static readonly SourcePath = path.join(PLUGIN_ROOT, 'ios', 'source');

    /**
     * iOS SDK 目录（xcframework）
     */
    static readonly SdkPath = path.join(PLUGIN_ROOT, 'ios', 'sdk');

    /**
     * iOS cmake 配置目录
     */
    static readonly CmakePath = path.join(PLUGIN_ROOT, 'ios', 'cmake');

    /**
     * Native engine iOS path
     */
    static readonly NativePath = `${Editor.Project.path}/native/engine/ios`;

    /**
     * 使用 PlistBuddy 修改构建输出的 plist（而不是替换整个文件）
     * 只添加/修改 AdMob 需要的 key
     */
    modifyPlist(options: ITaskOptions, buildResult: IBuildResult) {
        console.log(TAG, 'modifyPlist', 'start');

        const adMobOption = options.packages[PACKAGE_NAME] as AdmobOption;
        const applicationId = adMobOption.applicationId;

        // 【关键】从 project.pbxproj 读取 Xcode 实际使用的 Info.plist 路径
        const plistPath = this.findInfoPlistFromPbxproj(buildResult);

        if (!plistPath || !fs.existsSync(plistPath)) {
            console.error(TAG, 'modifyPlist', `Info.plist not found from pbxproj`);
            return;
        }

        console.log(TAG, 'modifyPlist', `Modifying: ${plistPath}`);

        // 1. GADApplicationIdentifier（必填）
        PlistUtils.setString(plistPath, 'GADApplicationIdentifier', applicationId);
        console.log(TAG, 'modifyPlist', 'Set GADApplicationIdentifier');

        // 2. SKAdNetworkItems（数组）
        PlistUtils.setSKAdNetworkItems(plistPath, SKADNETWORK_IDS);
        console.log(TAG, 'modifyPlist', `Set SKAdNetworkItems (${SKADNETWORK_IDS.length} items)`);

        // 3. NSUserTrackingUsageDescription（ATT 追踪描述）
        PlistUtils.setString(plistPath, 'NSUserTrackingUsageDescription',
            'This identifier will be used to deliver personalized ads to you.');
        console.log(TAG, 'modifyPlist', 'Set NSUserTrackingUsageDescription');

        // 4. AdMob 调试选项
        PlistUtils.setBool(plistPath, 'AdMobSimulateEEA', adMobOption.simulateEEA || false);
        PlistUtils.setBool(plistPath, 'AdMobUMPReset', adMobOption.umpReset || false);
        PlistUtils.setBool(plistPath, 'GADNativeAdValidatorEnabled', false);

        console.log(TAG, 'modifyPlist', 'end');
    }

    /**
     * 复制 AdMob 资源到构建目录
     */
    copyAdmobResources(options: ITaskOptions, buildResult: IBuildResult) {
        console.log(TAG, 'copyAdmobResources', 'start');

        const adMobOption = options.packages[PACKAGE_NAME] as AdmobOption;
        const overwriteLibrary = adMobOption.overwriteLibrary;

        // 1. 复制 AdMob 源代码（不含 SDK）
        const sourceDest = `${buildResult.dest}/proj/admob`;
        fse.copySync(BuildTaskiOS.SourcePath, sourceDest, { recursive: true, overwrite: overwriteLibrary });
        console.log(TAG, 'copyAdmobResources', `Copied source to ${sourceDest}`);

        // 2. 复制 SDK（xcframework + swift 文件）
        const sdkDest = `${buildResult.dest}/proj/admob/sdk`;
        fse.copySync(BuildTaskiOS.SdkPath, sdkDest, { recursive: true, overwrite: overwriteLibrary });
        console.log(TAG, 'copyAdmobResources', `Copied SDK to ${sdkDest}`);

        // 3. 复制 cmake 配置到 native 目录
        const postCmakeSrc = path.join(BuildTaskiOS.CmakePath, 'Post-admob.cmake');
        const preCmakeSrc = path.join(BuildTaskiOS.CmakePath, 'Pre-admob.cmake');
        const postCmakeDest = `${BuildTaskiOS.NativePath}/Post-admob.cmake`;
        const preCmakeDest = `${BuildTaskiOS.NativePath}/Pre-admob.cmake`;

        fse.copySync(postCmakeSrc, postCmakeDest, { overwrite: overwriteLibrary });
        fse.copySync(preCmakeSrc, preCmakeDest, { overwrite: overwriteLibrary });
        console.log(TAG, 'copyAdmobResources', 'Copied cmake files');

        console.log(TAG, 'copyAdmobResources', 'end');
    }

    /**
     * 修改 AppDelegate.mm 注入 AdMob 初始化代码
     */
    modifyAppDelegate(options: ITaskOptions, buildResult: IBuildResult) {
        console.log(TAG, 'modifyAppDelegate', 'start');

        const appDelegatePath = this.findAppDelegate(buildResult);
        if (!appDelegatePath) {
            console.error(TAG, 'modifyAppDelegate', 'AppDelegate.mm not found');
            return;
        }

        console.log(TAG, 'modifyAppDelegate', `Found: ${appDelegatePath}`);

        let content = fs.readFileSync(appDelegatePath, 'utf8');
        let modified = false;

        // 1. 添加 #import "AdServiceHub.h"
        const importStatement = '#import "AdServiceHub.h"';
        if (!content.includes(importStatement)) {
            const importRegex = /(#import\s+.+\n)/g;
            let lastMatch: RegExpExecArray | null = null;
            let match: RegExpExecArray | null;
            while ((match = importRegex.exec(content)) !== null) {
                lastMatch = match;
            }
            if (lastMatch) {
                const insertPos = lastMatch.index + lastMatch[0].length;
                content = content.slice(0, insertPos) + importStatement + '\n' + content.slice(insertPos);
                modified = true;
                console.log(TAG, 'modifyAppDelegate', 'Added import statement');
            }
        }

        // 2. 添加 [[AdServiceHub sharedInstance] initAdService];
        const initStatement = '    [[AdServiceHub sharedInstance] initAdService];';
        if (!content.includes(initStatement.trim())) {
            const returnRegex = /(\[appDelegateBridge\s+application:application\s+didFinishLaunchingWithOptions:launchOptions\];\n)/;
            const match = content.match(returnRegex);
            if (match) {
                const insertPos = match.index! + match[0].length;
                content = content.slice(0, insertPos) + initStatement + '\n' + content.slice(insertPos);
                modified = true;
                console.log(TAG, 'modifyAppDelegate', 'Added initAdService call');
            }
        }

        if (modified) {
            fs.writeFileSync(appDelegatePath, content, 'utf8');
            console.log(TAG, 'modifyAppDelegate', 'File modified successfully');
        } else {
            console.log(TAG, 'modifyAppDelegate', 'No modifications needed');
        }

        console.log(TAG, 'modifyAppDelegate', 'end');
    }

    /**
     * 配置 Xcode 项目（添加 framework、Swift 文件、设置 Swift 版本）
     */
    configureXcodeProject(options: ITaskOptions, buildResult: IBuildResult) {
        console.log(TAG, 'configureXcodeProject', 'start');

        const pbxprojPath = this.findPbxproj(buildResult);
        if (!pbxprojPath) {
            console.error(TAG, 'configureXcodeProject', 'project.pbxproj not found');
            return;
        }

        // SDK 目录（已复制到构建目录）
        const sdkDir = `${buildResult.dest}/proj/admob/sdk`;

        // 项目名（从构建选项获取）
        const projectName = (options as any).projectName || (options as any).outputName || '';

        // 脚本路径
        const scriptPath = path.join(PLUGIN_ROOT, 'scripts', 'configure_xcode_for_admob.py');

        if (!fs.existsSync(scriptPath)) {
            console.error(TAG, 'configureXcodeProject', `Script not found: ${scriptPath}`);
            return;
        }

        // 构建命令
        let cmd = `python3 "${scriptPath}" "${pbxprojPath}" "${sdkDir}"`;
        if (projectName) {
            cmd += ` --project-name "${projectName}"`;
        }

        console.log(TAG, 'configureXcodeProject', `Executing: ${cmd}`);

        try {
            execSync(cmd, { stdio: 'inherit', cwd: path.dirname(scriptPath) });
            console.log(TAG, 'configureXcodeProject', 'Configuration completed');
        } catch (err) {
            console.error(TAG, 'configureXcodeProject', 'Configuration failed:', err);
            console.error(TAG, 'configureXcodeProject', 'Please install Python dependencies: pip install pbxproj>=3.2.0');
        }

        console.log(TAG, 'configureXcodeProject', 'end');
    }

    /**
     * 在 onAfterBuild 阶段执行
     * 此时 Xcode 项目已完全生成
     */
    onAfterBuild(options: ITaskOptions, buildResult: IBuildResult) {
        console.log(TAG, 'onAfterBuild', 'start');

        const adMobOption = options.packages[PACKAGE_NAME] as AdmobOption;
        if (!adMobOption.enableAdMob) {
            console.log(TAG, 'onAfterBuild', 'AdMob disabled, skipping');
            return;
        }

        // 1. 用 PlistBuddy 修改 plist（而不是替换）
        this.modifyPlist(options, buildResult);

        // 2. 配置 Xcode 项目
        this.configureXcodeProject(options, buildResult);

        // 3. 移除 -Wl,-ld_classic（Xcode 26 兼容性）
        if (adMobOption.removeLdClassic) {
            this.removeLdClassicFromLinkerFlags(buildResult);
        }

        console.log(TAG, 'onAfterBuild', 'end');
    }

    /**
     * 在 onAfterCompressSettings 阶段执行
     * 此时 CMake 已生成
     */
    executePostBuildTasks(options: ITaskOptions, buildResult: IBuildResult) {
        console.log(TAG, 'executePostBuildTasks', 'start');

        const adMobOption = options.packages[PACKAGE_NAME] as AdmobOption;
        if (!adMobOption.enableAdMob) {
            console.log(TAG, 'executePostBuildTasks', 'AdMob disabled, skipping');
            return;
        }

        // 1. 复制 AdMob 资源
        this.copyAdmobResources(options, buildResult);

        // 2. 修改 AppDelegate
        if (adMobOption.modifyAppDelegate) {
            this.modifyAppDelegate(options, buildResult);
        } else {
            console.log(TAG, 'executePostBuildTasks', 'modifyAppDelegate skipped (disabled)');
        }

        console.log(TAG, 'executePostBuildTasks', 'end');
    }

    // ==================== Helper Methods ====================

    private findAppDelegate(buildResult: IBuildResult): string | null {
        const possiblePaths = [
            `${buildResult.dest}/proj/Classes/AppDelegate.mm`,
            `${buildResult.dest}/proj/AppDelegate.mm`,
            `${BuildTaskiOS.NativePath}/AppDelegate.mm`,
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                return p;
            }
        }
        return null;
    }

    private findPbxproj(buildResult: IBuildResult): string | null {
        const projDir = `${buildResult.dest}/proj`;
        if (!fs.existsSync(projDir)) return null;

        const entries = fs.readdirSync(projDir);
        const xcodeproj = entries.find(e => e.endsWith('.xcodeproj'));

        if (xcodeproj) {
            const pbxproj = `${projDir}/${xcodeproj}/project.pbxproj`;
            if (fs.existsSync(pbxproj)) return pbxproj;
        }

        return null;
    }

    /**
     * 从 project.pbxproj 中读取 INFOPLIST_FILE 路径
     * 这样可以正确获取 Xcode 实际使用的 Info.plist，而不是硬编码路径
     */
    private findInfoPlistFromPbxproj(buildResult: IBuildResult): string | null {
        const pbxprojPath = this.findPbxproj(buildResult);
        if (!pbxprojPath) {
            console.error(TAG, 'findInfoPlistFromPbxproj', 'project.pbxproj not found');
            return null;
        }

        try {
            const content = fs.readFileSync(pbxprojPath, 'utf8');

            // 匹配 INFOPLIST_FILE = "xxx";
            const match = content.match(/INFOPLIST_FILE\s*=\s*"([^"]+)"/);
            if (match && match[1]) {
                const plistPath = match[1];
                // 如果是绝对路径直接返回
                if (path.isAbsolute(plistPath)) {
                    return plistPath;
                }
                // 相对路径相对于 .xcodeproj 所在目录的父目录
                const projDir = path.dirname(path.dirname(pbxprojPath));
                return path.resolve(projDir, plistPath);
            }
        } catch (err) {
            console.error(TAG, 'findInfoPlistFromPbxproj', 'Failed to read pbxproj:', err);
        }

        return null;
    }

    /**
     * 从 project.pbxproj 中移除 -Wl,-ld_classic 标志
     * Xcode 26 (Apple Clang 17+) 已移除经典链接器，保留此标志会导致构建失败
     */
    private removeLdClassicFromLinkerFlags(buildResult: IBuildResult) {
        console.log(TAG, 'removeLdClassicFromLinkerFlags', 'start');

        const pbxprojPath = this.findPbxproj(buildResult);
        if (!pbxprojPath) {
            console.error(TAG, 'removeLdClassicFromLinkerFlags', 'project.pbxproj not found');
            return;
        }

        try {
            let content = fs.readFileSync(pbxprojPath, 'utf8');
            let modified = false;

            // 实际格式示例：
            // "-ObjC '-Wl,-ld_classic' -Wl,-headerpad_max_install_names"
            // 需要移除 '-Wl,-ld_classic' 部分（包括单引号）
            const patterns = [
                /\s*'-Wl,-ld_classic'/g,    // 带单引号的形式
                /\s*"-Wl,-ld_classic"/g,    // 带双引号的形式
                /\s*-Wl,-ld_classic/g,      // 无引号的形式
            ];

            for (const pattern of patterns) {
                if (pattern.test(content)) {
                    content = content.replace(pattern, '');
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(pbxprojPath, content, 'utf8');
                console.log(TAG, 'removeLdClassicFromLinkerFlags', 'Removed -Wl,-ld_classic from linker flags');
            } else {
                console.log(TAG, 'removeLdClassicFromLinkerFlags', '-Wl,-ld_classic not found, no changes needed');
            }
        } catch (err) {
            console.error(TAG, 'removeLdClassicFromLinkerFlags', 'Failed:', err);
        }

        console.log(TAG, 'removeLdClassicFromLinkerFlags', 'end');
    }
}

/**
 * The global instance of the buildTask.
 */
export const buildTaskiOS = {
    ios: new BuildTaskiOS(),
};
