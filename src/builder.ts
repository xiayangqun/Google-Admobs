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
import { BuildPlugin } from '../@types';

export const PACKAGE_NAME = 'admob';

export const load: BuildPlugin.load = function () {
    console.debug(`[${PACKAGE_NAME}] builder load`);
};

export const unload: BuildPlugin.Unload = function () {
    console.debug(`[${PACKAGE_NAME}] builder unload`);
};

// ==================== 公共配置项 ====================

const commonOptions = {
    enableAdMob: {
        label: `i18n:${PACKAGE_NAME}.enableAdMob.title`,
        description: `i18n:${PACKAGE_NAME}.enableAdMob.tip`,
        default: true,
        render: {
            ui: 'ui-checkbox',
        },
    },
    overwriteLibrary: {
        label: `i18n:${PACKAGE_NAME}.overwriteLibrary.title`,
        description: `i18n:${PACKAGE_NAME}.overwriteLibrary.tip`,
        default: true,
        render: {
            ui: 'ui-checkbox',
        },
    },
    applicationId: {
        label: `i18n:${PACKAGE_NAME}.applicationId.title`,
        description: `i18n:${PACKAGE_NAME}.applicationId.tip`,
        default: '',
        render: {
            ui: 'ui-input',
            attributes: {
                placeholder: `i18n:${PACKAGE_NAME}.applicationId.placeholder`,
            },
        },
        verifyRules: ['required'],
    },
};

// ==================== 构建配置 ====================

export const configs: BuildPlugin.Configs = {
    'android': {
        hooks: './build-hooks',
        doc: 'editor/publish/custom-build-plugin.html',
        options: {
            ...commonOptions,

            enableChildDirectedTreatment: {
                label: `i18n:${PACKAGE_NAME}.enableChildDirectedTreatment.title`,
                description: `i18n:${PACKAGE_NAME}.enableChildDirectedTreatment.tip`,
                default: false,
                render: {
                    ui: 'ui-checkbox',
                },
            },

            minSdkVersion: {
                label: `i18n:${PACKAGE_NAME}.minSdkVersion.title`,
                description: `i18n:${PACKAGE_NAME}.minSdkVersion.tip`,
                default: 23,
                render: {
                    ui: 'ui-num-input',
                    attributes: {
                        step: 1,
                        min: 21,
                    },
                },
            },

            buildToolsVersion: {
                label: `i18n:${PACKAGE_NAME}.buildToolsVersion.title`,
                description: `i18n:${PACKAGE_NAME}.buildToolsVersion.tip`,
                default: '35.0.1',
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: `i18n:${PACKAGE_NAME}.buildToolsVersion.placeholder`,
                    },
                },
            },

            agpVersion: {
                label: `i18n:${PACKAGE_NAME}.agpVersion.title`,
                description: `i18n:${PACKAGE_NAME}.agpVersion.tip`,
                default: '8.1.0',
                render: {
                    ui: 'ui-input',
                    attributes: {
                        placeholder: `i18n:${PACKAGE_NAME}.agpVersion.placeholder`,
                    },
                },
            },

            warn: {
                label: `i18n:${PACKAGE_NAME}.warn.title`,
                default: `i18n:${PACKAGE_NAME}.warn.content`,
                render: {
                    ui: 'ui-label',
                },
            },
        },
    },
    'ios': {
        hooks: './build-hooks',
        doc: 'editor/publish/custom-build-plugin.html',
        options: {
            ...commonOptions,

            removeLdClassic: {
                label: `i18n:${PACKAGE_NAME}.removeLdClassic.title`,
                description: `i18n:${PACKAGE_NAME}.removeLdClassic.tip`,
                default: true,
                render: {
                    ui: 'ui-checkbox',
                },
            },

            simulateEEA: {
                label: `i18n:${PACKAGE_NAME}.simulateEEA.title`,
                description: `i18n:${PACKAGE_NAME}.simulateEEA.tip`,
                default: false,
                render: {
                    ui: 'ui-checkbox',
                },
            },

            umpReset: {
                label: `i18n:${PACKAGE_NAME}.umpReset.title`,
                description: `i18n:${PACKAGE_NAME}.umpReset.tip`,
                default: false,
                render: {
                    ui: 'ui-checkbox',
                },
            },

            modifyAppDelegate: {
                label: `i18n:${PACKAGE_NAME}.modifyAppDelegate.title`,
                description: `i18n:${PACKAGE_NAME}.modifyAppDelegate.tip`,
                default: true,
                render: {
                    ui: 'ui-checkbox',
                },
            },

            warn: {
                label: `i18n:${PACKAGE_NAME}.warn.title`,
                default: `i18n:${PACKAGE_NAME}.warn.content`,
                render: {
                    ui: 'ui-label',
                },
            },
        },
    },
};

export const assetHandlers: BuildPlugin.AssetHandlers = './asset-handlers';
