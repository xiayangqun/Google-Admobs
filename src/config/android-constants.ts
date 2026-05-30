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

import * as path from 'path';

// 插件根目录（dist/config/ -> 根目录）
const PLUGIN_ROOT = path.resolve(__dirname, '../..');

export class AndroidConstants {

    /**
     * @en
     * The native path of this project.
     */
    static readonly NativePath = `${Editor.Project.path}/native/engine/android`;

    /**
     * @en
     * the build.gradle path in project.
     */
    static readonly AppBuildGradle = `${AndroidConstants.NativePath}/app/build.gradle`;

    /**
     * @en
     * Android directory of the extension
     */
    static readonly AndroidPath = path.join(PLUGIN_ROOT, 'android');

    /**
     * @en
     * the gradle template files in extension.
     */
    static readonly AdmobTemplateGradlePath = path.join(AndroidConstants.AndroidPath, 'gradle', 'app-dependencies.gradle');

    /**
     * @en
     * The name of the android JAVA library.
     */
    static readonly AdmobLibName = "libadmob";

    /**
     * @en
     * the source path of the java lib.
     */
    static readonly AdmobLibSrcPath = path.join(AndroidConstants.AndroidPath, 'libadmob');

    /**
     * @en
     * The destination relative path of the java library.
     */
    static readonly AdmobLibDestPath = `/proj/${AndroidConstants.AdmobLibName}`;

    /**
     * @en
     * The final destination path of the libadmob's AndroidManifest.xml.
     */
    static readonly AdmobDestManifestPath = `${AndroidConstants.AdmobLibDestPath}/AndroidManifest.xml`;

    /**
     * @en
     * Setting.gradle.
     */
    static readonly SettingGradle = `settings.gradle`;

    /**
     * @en
     * The template of the setting.gradle in admob extension.
     */
    static readonly AdmobTemplateSettingGradle = path.join(AndroidConstants.AndroidPath, 'gradle', 'settings-module.gradle');

    /**
     * @en
     * Java templates directory
     */
    static readonly JavaPath = path.join(AndroidConstants.AndroidPath, 'java');

    /**
     * @en
     * Code template to insert into the AppActivity.java in the build project.
     */
    static readonly AppActivityTemplateInitPath = path.join(AndroidConstants.JavaPath, 'Init.java');

    /**
     * @en
     * Keycode where do the extension find the exact place to insert the template code in the AppActivity's onCreate method.
     */
    static readonly AppActivityKeyCodeTemplateInitPath = path.join(AndroidConstants.JavaPath, 'Init_keyCode.java');

    /**
     * @en
     * Code template to insert into the AppActivity.java in the build project.
     */
    static readonly AppActivityTemplateDestroyPath = path.join(AndroidConstants.JavaPath, 'Destroy.java');

    /**
     * @en
     * Keycode where do the extension find the exact place to insert the template code in the AppActivity's onCreate method.
     */
    static readonly AppActivityKeyCodeTemplateDestroyPath = path.join(AndroidConstants.JavaPath, 'Destroy_keyCode.java');

    /**
     * @en
     * Import template path
     */
    static readonly ImportTemplatePath = path.join(AndroidConstants.JavaPath, 'Import.java');

    /**
     * @en
     * Import key code template path
     */
    static readonly ImportKeyCodeTemplatePath = path.join(AndroidConstants.JavaPath, 'Import_keyCode.java');

    /**
     * @en
     * Native templates library name
     */
    static readonly GoogleNativeAdTemplateLibName = `nativetemplates`;

    /**
     * @en
     * Native templates source path
     */
    static readonly GoogleNativeAdTemplatePath = path.join(AndroidConstants.AndroidPath, 'nativetemplates');

    /**
     * @en
     * Native templates destination path
     */
    static readonly GoogleNativeTemplateLibPath = `/proj/${AndroidConstants.GoogleNativeAdTemplateLibName}`;
}
