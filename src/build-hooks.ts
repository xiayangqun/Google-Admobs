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
import { IBuildTaskOption, BuildHook, IBuildResult } from '../@types';
import { buildTaskAndroid } from './platforms/android';
import { buildTaskiOS } from './platforms/ios';

interface IOptions {
    enableAdMob: boolean;
    overwriteLibrary: boolean;
    applicationId: string;
    enableChildDirectedTreatment: boolean;
    minSdkVersion: number;
    buildToolsVersion: string;
    agpVersion: string;
    simulateEEA: boolean;
    umpReset: boolean;
    modifyAppDelegate: boolean;
    overwriteXcodeproj: boolean;
}

const PACKAGE_NAME = 'admob';

export interface ITaskOptions extends IBuildTaskOption {
    packages: {
        'admob': IOptions;
    };
}

function log(...arg: any[]) {
    return console.log(`[${PACKAGE_NAME}] `, ...arg);
}

export const throwError: BuildHook.throwError = true;

export const load: BuildHook.load = async function () {
    log('Load admob extension in builder.');
};

export const onBeforeBuild: BuildHook.onBeforeBuild = async function (options: ITaskOptions, result: IBuildResult) {
    log('onBeforeBuild');
};

export const onBeforeCompressSettings: BuildHook.onBeforeCompressSettings = async function (options: ITaskOptions, result: IBuildResult) {
    log('onBeforeCompressSettings');
};

export const onAfterCompressSettings: BuildHook.onAfterCompressSettings = async function (options: ITaskOptions, result: IBuildResult) {
    log('onAfterCompressSettings');
    // iOS 需要在 CMake 生成后执行资源复制
    if (options.platform === "ios") {
        buildTaskiOS.ios.executePostBuildTasks(options, result);
    }
};

export const onAfterBuild: BuildHook.onAfterBuild = async function (options: ITaskOptions, result: IBuildResult) {
    log('onAfterBuild');
    if (options.platform === "ios") {
        // iOS 需要在 Xcode 项目生成后执行 plist 修改和 Xcode 配置
        buildTaskiOS.ios.onAfterBuild(options, result);
    }
    if (options.platform === "android") {
        buildTaskAndroid.android.executePostBuildTasks(options, result);
    }
};

export const unload: BuildHook.unload = async function () {
    log('Unload admob extension in builder.');
};

export const onError: BuildHook.onError = async function (options, result) {
    log('onError');
};

export const onBeforeMake: BuildHook.onBeforeMake = async function (root, options) {
    log('onBeforeMake');
};

export const onAfterMake: BuildHook.onAfterMake = async function (root, options) {
    log('onAfterMake');
};
