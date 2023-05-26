<!--suppress HtmlDeprecatedAttribute, HttpUrlsUsage -->

<div align="center">
  <p>
    <img src="https://s1.imagehub.cc/images/2023/03/07/a611060ac75cf0d48edacff319cc1666.png" alt="autojs6-documentation-banner_800×208_transparent" border="0" width="660"/>
  </p>

  <p>AutoJs6 项目文档</p>

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

### 说明

******

- 文档可能会随时更新
- 部分文档与实际代码行为可能存在出入
- 如有任何问题可在当前项目的 [议题 (Issues)](http://docs-project.autojs6.com/issues) 页面提交反馈

******

### 版本历史

******

[comment]: <> "Version history only shows last 3 versions"

## v1.1.4

<p style="font: bold 0.8em sans-serif; color: #888888">2023/05/26</p>

- `新增` [console.resetGlobalLogConfig](https://docs.autojs6.com/#/console?id=m-resetgloballogconfig) 文档
- `新增` [web.newWebSocket](https://docs.autojs6.com/#/web?id=m-newwebsocket) 文档
- `优化` 完善 [全能类型 (Omnipotent Types)](https://docs.autojs6.com/#/omniTypes) 章节
- `优化` 完善 [安卓 API 级别 (Android API Level)](https://docs.autojs6.com/#/apiLevel) 章节

## v1.1.3

<p style="font: bold 0.8em sans-serif; color: #888888">2023/04/29</p>

- `新增` [颜色类 (Color)](https://docs.autojs6.com/#/colorType) 文档
- `新增` [控制台 (Console)](https://docs.autojs6.com/#/console) 文档
- `新增` [标准化 (Standardization)](https://docs.autojs6.com/#/s13n) 文档
- `新增` [全能类型 (Omnipotent Types)](https://docs.autojs6.com/#/omniTypes) 文档
- `新增` [NoticeBuilder](https://docs.autojs6.com/#/noticeBuilderType) / [NoticeChannelOptions](https://docs.autojs6.com/#/noticeChannelOptionsType) / [NoticeOptions](https://docs.autojs6.com/#/noticeOptionsType) 等类型
- `新增` 示例代码区域增加 Copy 按钮以复制代码内容
- `新增` 文档中的图片内容支持点击以全屏方式查看
- `修复` 文档内容中部分图片资源丢失的问题
- `优化` 生成器根据 properties 文件自动获取 AutoJs6 版本信息
- `优化` 压缩本地 JavaScript 文件以提升页面加载速度
- `优化` 本地化字体文件避免网络条件不佳时影响页面加载速度
- `优化` 部分表格内容强制禁用自动断行以提升阅读体验
- `优化` 完善 [颜色 (Color)](https://docs.autojs6.com/#/color) 章节
- `优化` 完善 [消息通知 (Notice)](https://docs.autojs6.com/#/notice) 章节
- `优化` 完善 [光学字符识别 (OCR)](https://docs.autojs6.com/#/ocr) 章节

## v1.1.2

<p style="font: bold 0.8em sans-serif; color: #888888">2023/03/21</p>

- `新增` [光学字符识别 (OCR)](https://docs.autojs6.com/#/ocr) 文档
- `新增` [消息通知 (Notice)](https://docs.autojs6.com/#/notice) 文档
- `新增` [HttpRequestHeaders](https://docs.autojs6.com/#/httpRequestHeadersType) / [HttpResponseHeaders](https://docs.autojs6.com/#/httpResponseHeadersType) / [OpencvRect](https://docs.autojs6.com/#/opencvRectType) 等类型
- `新增` [通知渠道](https://docs.autojs6.com/#/glossaries?id=通知渠道) / [HTTP 标头](https://docs.autojs6.com/#/glossaries?id=HTTP-标头) / [MIME 类型](https://docs.autojs6.com/#/glossaries?id=MIME-类型) / [HTTP 请求方法](https://docs.autojs6.com/#/glossaries?id=HTTP-请求方法) 等术语
- `新增` [颜色 (Color)](https://docs.autojs6.com/#/color) 章节增加 [toColorStateList](https://docs.autojs6.com/#/color?id=m-tocolorstatelist) 及 [setPaintColor](https://docs.autojs6.com/#/color?id=m-setpaintcolor) 条目
- `修复` 文档更新日志条目中的链接无效的问题
- `优化` 完善 [疑难解答 (Q & A)](https://docs.autojs6.com/#/qa) 章节

##### 更多版本历史可参阅

* [CHANGELOG.md](http://docs-project.autojs6.com/blob/master/api/changelog.md)