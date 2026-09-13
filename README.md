<!--suppress HtmlDeprecatedAttribute, HttpUrlsUsage -->

<div align="center">
  <p>
    <img src="https://s1.imagehub.cc/images/2023/03/07/a611060ac75cf0d48edacff319cc1666.png" alt="autojs6-documentation-banner_800×208_transparent" border="0" width="660"/>
  </p>

  <p>AutoJs6 应用文档</p>

  <p>
    <a href="http://docs-project.autojs6.com/blob/master/project.json"><img alt="Version name" src="https://img.shields.io/badge/dynamic/json?color=1283C3&label=version&query=%24.versionName&url=https%3A%2F%2Fraw.githubusercontent.com%2FSuperMonster003%2FAutoJs6-Documentation%2Fmaster%2Fproject.json"/></a>
    <a href="http://docs-project.autojs6.com/issues"><img alt="GitHub closed issues" src="https://img.shields.io/github/issues/SuperMonster003/AutoJs6-Documentation?color=009688"/></a>
    <a href="http://docs-project.autojs6.com/commit/f7389a70ffc7bac4406cd0b19a1e6341d6e50238"><img alt="Created" src="https://img.shields.io/date/1657941168?color=2e7d32&label=created"/></a>
    <br>
    <a href="http://docs-project.autojs6.com/find/master"><img alt="GitHub Code Size" src="https://img.shields.io/github/languages/code-size/SuperMonster003/AutoJs6-Documentation?color=795548"/></a>
    <a href="http://docs-project.autojs6.com/blob/master/LICENSE"><img alt="GitHub License" src="https://img.shields.io/github/license/SuperMonster003/AutoJs6-Documentation?color=534BAE"/></a>
    <a href="https://www.jetbrains.com/?from=Ant-Forest"><img alt="JetBrains supporter" src="https://img.shields.io/badge/supporter-JetBrains-ee4677"/></a>
  </p>
</div>

******

### 简介

******

- [AutoJs6](http://project.autojs6.com) 应用文档
- 克隆 (Clone) 自 [hyb1996/AutoJs-Docs](https://github.com/hyb1996/AutoJs-Docs/)
- 模板 / 样式 / Generator 来自 [Node.js](https://github.com/nodejs/node/tree/master/doc/)

******

### 阅读

******

* [点此阅读 (网页版)](https://docs.autojs6.com)

******

### 开发与发布

******

`api/*.md` 是在线与离线文档的唯一内容源.
在线 Docsify 站点是随 `master` 更新的滚动文档; `project.json` 中的
`targetAutoJs6Version` 用于固定可复现的离线 HTML 版本.

编辑完成后, 执行一条命令即可全量生成离线 HTML, 应用离线插件的规范化规则,
并安全同步到 `AutoJs6-Plugin-Offline-Docs`. 同步成功后, 两个项目的
`versionName` 会与 `targetAutoJs6Version` 对齐, 各自的
`versionCode` / `VERSION_BUILD` 增加 1:

```powershell
generator\auto-generate-for-autojs6.bat
```

离线插件的本机路径配置位于不纳入版本控制的
`generator/local-config.json`. 配置示例见
`generator/local-config.example.json`.

在线站点由 `.github/workflows/pages.yml` 直接将 `api/` 部署到 GitHub Pages.
在仓库 Pages Settings 中将 Source 一次性改为 `GitHub Actions` 后,
日常只需提交并推送 `master`, 不再同步或提交 `gh-pages`.
自定义域名仍由 Pages Settings 中的 `docs.autojs6.com` 管理.
上述脚本只更新两个本地工作树, 不会代替版本控制操作: 在线文档提交到
本仓库 `master`; 离线文档还需在 `AutoJs6-Plugin-Offline-Docs` 中审查,
提交并按该插件的流程发版.

更多生成, 检查, 增量构建和插件校验命令参阅
[`generator/README.md`](generator/README.md).

******

### 说明

******

- 文档可能会随时更新
- 部分文档与实际代码行为可能存在出入
- 如有任何问题可在当前项目的 [议题 (Issues)](http://docs-project.autojs6.com/issues) 页面提交反馈
- 如需快速了解文档的常见问题, 可参阅 [疑难解答](https://docs.autojs6.com/#/qa) 章节

******

### 进度

******

- 基于 `Auto.js 4.1.0` 文档修改完善, [部署进度](https://docs.autojs6.com/#/progress) 可能相对缓慢

******

### 版本历史

******

[comment]: <> "Version history only shows last 3 versions"

## v6.8.0

<p style="font: bold 0.8em sans-serif; color: #888888">2026/09/13</p>

- `更新` `runtime.requestPermissions` 的本地网络权限名称, Android 17 / targetSdk 37 条件, 异步授权与重试及插件权限边界
- `新增` `device.pageSize` 只读属性文档, 说明以字节返回当前系统的内存页大小及 4 KB / 16 KB 用例
- `更新` OCR 默认按已安装且启用的插件自动选择引擎, 补充动态 mode 读取, tap 重置, 单次调用选项与空状态说明
- `新增` 流程 (Flow), 工具集, 事件驱动等待, 字符串选择器语法, 节点等待与诊断等无障碍自动化 API 文档
- `更新` 按 AutoJs6 6.8.0 无障碍自动化重构修订自动化, 全局对象, 选择器, 控件节点与控件集合章节
- `新增` AI, TTS, Power Manager, Settings, Work Manager, SysProps, SQLite, Zip 等 16 个模块文档
- `更新` 根据 AutoJs6 6.8.0 Augmentable API 修订模块签名, 重载, 默认值, 版本和运行条件
- `更新` 补充双开应用, 异步截图, 引擎事件, OCR Rapid 模式和插件运行条件
- `更新` 刷新引擎 API 文档, 补充 Python Runtime 插件的文件启动和失败关闭行为
- `优化` 统一 API 参考格式, 内部类型链接和存疑内容处理
- `优化` 全量生成离线 HTML, JSON 和纯本地搜索索引

## v1.1.8

<p style="font: bold 0.8em sans-serif; color: #888888">2023/12/01</p>

- `新增` [中文转换 (OpenCC)](https://docs.autojs6.com/#/opencc) 文档
- `新增` [OpenCCConversion](https://docs.autojs6.com/#/openCCConversionType) 类型
- `新增` [选择器](https://docs.autojs6.com/#/uiSelectorType) 章节增加 [plus](https://docs.autojs6.com/#/uiObjectType?id=m-plus) / [append](https://docs.autojs6.com/#/uiObjectType?id=m-append) 条目
- `新增` [控制台 (Console)](https://docs.autojs6.com/#/console) 章节增加 [setTouchable](https://docs.autojs6.com/#/console?id=m-settouchable) 条目
- `新增` [ConsoleBuildOptions](https://docs.autojs6.com/#/consoleBuildOptionsType) 章节增加 [touchable](https://docs.autojs6.com/#/consoleBuildOptionsType?id=p-touchable) 条目
- `优化` [光学字符识别 (OCR)](https://docs.autojs6.com/#/ocr) 章节增加 Paddle 工作模式使用提示
- `优化` 完善 [Shizuku](https://docs.autojs6.com/#/shizuku) 章节
- `优化` 完善 [选择器](https://docs.autojs6.com/#/uiSelectorType) 章节

## v1.1.7

<p style="font: bold 0.8em sans-serif; color: #888888">2023/10/30</p>

- `新增` [Shizuku](https://docs.autojs6.com/#/shizuku) 文档
- `新增` [WebSocket](https://docs.autojs6.com/#/websocketType) 文档
- `新增` [条码 (Barcode)](https://docs.autojs6.com/#/barcode) 文档
- `新增` [二维码 (QR Code)](https://docs.autojs6.com/#/qrcode) 文档
- `优化` 完善 [颜色 (Color)](https://docs.autojs6.com/#/color) 章节
- `优化` 完善 [光学字符识别 (OCR)](https://docs.autojs6.com/#/ocr) 章节

##### 更多版本历史可参阅

- [CHANGELOG.md](http://docs-project.autojs6.com/blob/master/api/changelog.md)
