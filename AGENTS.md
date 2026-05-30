# Google AdMob Extension

## 工作范围

- **当前是中文工作环境。**
- **只以下几个目录工作**
1. 此文件根目录
2. ../build/android
3. ../build/ios

## 这是什么

- 一个 **Cocos Creator 插件**，在构建阶段注入 AdMob 广告 SDK。

## 功能

- 为 Cocos Creator 游戏提供方便快捷的 AdMob 广告 SDK 接入功能。
- 同时支持 **iOS** 和 **Android** 平台。
- 构建时通过构建钩子（`dist/builder.js`）自动注入原生广告模板代码。

## 构建

- 修改 `source/` 后，在此目录下运行 `npm run build` 或 `tsc` 编译到 `dist/`。
- 开发时使用 `tsc -w` 进入监听模式。
