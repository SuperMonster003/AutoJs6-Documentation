# 文档更新日志 (Changelog)

## v6.8.0

<p style="font: bold 0.8em sans-serif; color: #888888">2026/09/13</p>

- `新增` [文本间距 (Pangu)](https://docs.autojs6.com/#/pangu) 文档, 覆盖内置 pangu.js 10.1.0 的全局对象, 文本排版, 间距检查及运行环境

- `更新` [HTTP](https://docs.autojs6.com/#/http) 与 [HttpRequestBuilderOptions](https://docs.autojs6.com/#/httpRequestBuilderOptionsType) 的 `isInsecure` / `insecure` 请求范围, 共享客户端配置及证书信任, CT, ECH 和本地网络权限的区别

- `更新` [多媒体](https://docs.autojs6.com/#/media), [设备](https://docs.autojs6.com/#/device), [TTS](https://docs.autojs6.com/#/tts) 和 [设置](https://docs.autojs6.com/#/settings) 的 Android 17 后台音频运行条件, 静默抑制, 可见界面恢复操作及引擎进程边界
- `修复` 离线同步器将插件独立发行版本覆盖为文档内容版本的问题, 保留插件版本并继续核对 contentVersion 和 provenance

- `更新` [运行时](https://docs.autojs6.com/#/runtime) 的本地网络权限名称, Android 17 / targetSdk 37 条件, 异步授权与重试及原生 Socket / MQTT 和插件权限边界

- `新增` [设备](https://docs.autojs6.com/#/device) 的 `pageSize` 只读属性, 说明当前系统页大小的字节单位及 4 KB / 16 KB 用例
- `更新` [OCR](https://docs.autojs6.com/#/ocr) 的动态自动选择, 插件启停热切换, mode/tap 重置规则及单次调用选项
- `更新` [MediaInfo](https://docs.autojs6.com/#/mediainfo) 增加 streamNumber 多流查询, countGet 流计数, infoKind 单位与说明查询, 能力协商及 Complete name 原始路径语义
- `新增` [流程 (Flow)](https://docs.autojs6.com/#/flow), [Flow](https://docs.autojs6.com/#/flowType) 与 [FlowError](https://docs.autojs6.com/#/flowErrorType) 文档, 覆盖异步等待与动作链, 全局起点函数, 等待选项与错误对象
- `新增` [自动化](https://docs.autojs6.com/#/automator) 章节增加工具集 (smartClick, clickIfExists, clickAny, findAny, scrollUntil, typeInto, dismissPopups, collectList, launchAndWait, backUntil, backToApp, toggle, retry), 事件驱动等待 (waitForIdle, waitForEvent, waitForToast, waitForNotification) 以及 auto 的 wait, findWindows, findWindowRoots, explain, dump, stats 条目
- `新增` [选择器](https://docs.autojs6.com/#/uiSelectorType) 章节增加 select(syntax) 字符串选择器语法, find(max) 与 findIterator 条目; [控件节点](https://docs.autojs6.com/#/uiObjectType) 章节增加 isStale, waitUntilGone, waitForStable, fingerprint, toJSON, dumpSubtree, contentInvalid, contextClickable, multiLine, dismissable 条目; [控件集合](https://docs.autojs6.com/#/uiObjectCollectionType) 章节增加 at, first, last, nonNull, slice 与 performActionEach 等逐个执行条目
- `新增` [全局对象](https://docs.autojs6.com/#/global) 章节增加 waitAsync, waitThenClick, waitForStable, waitForStableThenClick, waitForVisible, waitForHidden, clickWhenStableAfter 条目
- `更新` 按 AutoJs6 6.8.0 无障碍自动化重构修订 automator.isServiceRunning 语义, auto.setFlags (appWindowsFallback, eventAssistedPolling), auto.registerEvent 过滤选项, auto.setWindowFilter 对象形式与 auto.state 的 adoptedByEvent, 罗盘 k 段返回 null 的行为, xxxContains 字面匹配, 控件集合的数组包装方式, 并标注可能永久阻塞的方法
- `新增` [AI](https://docs.autojs6.com/#/ai), [TTS](https://docs.autojs6.com/#/tts), [电源管理](https://docs.autojs6.com/#/powerManager), [应用设置](https://docs.autojs6.com/#/settings), [持久化任务](https://docs.autojs6.com/#/workManager) 和 [系统属性](https://docs.autojs6.com/#/sysprops) 文档
- `新增` [YOLO 目标检测](https://docs.autojs6.com/#/yolo) 文档
- `新增` [Converter](https://docs.autojs6.com/#/cvt), [Formatter](https://docs.autojs6.com/#/fmt), [Jsox](https://docs.autojs6.com/#/jsox), [MediaInfo](https://docs.autojs6.com/#/mediainfo), [MIME](https://docs.autojs6.com/#/mime), [NanoID](https://docs.autojs6.com/#/nanoid), [Pinyin](https://docs.autojs6.com/#/pinyin), [Pinyin4j](https://docs.autojs6.com/#/pinyin4j), [SQLite](https://docs.autojs6.com/#/sqlite) 和 [Zip](https://docs.autojs6.com/#/zip) 文档
- `更新` 根据 AutoJs6 6.8.0 Augmentable API 修订全局对象, 应用, 自动化, 设备, 引擎, 图像, HTTP, 任务, UI 和工具模块的签名, 重载, 默认值及运行条件
- `更新` 补充双开应用, 异步截图, 引擎生命周期事件, WorkManager 兼容接口, OCR Rapid 模式和 WebSocket 字节串等现行 API
- `更新` 刷新 [引擎](https://docs.autojs6.com/#/engines) API, 说明本地 Python 文件通过独立 Python Runtime 插件启动, 且失败时不会回退到 JavaScript
- `更新` 标明条码, 二维码, OCR, OpenCC 和 OpenCV 相关功能的插件运行条件
- `更新` 完成条码, 二维码, 记录器, 上下文, Shell 和运行时章节, 并按 AutoJs6 6.8.0 源码修订签名, 返回值及运行条件
- `优化` 统一 Markdown API 参考格式, 内部类型链接和版本标签, 并将无法从源码确认的旧内容移入 [存疑内容](https://docs.autojs6.com/#/suspicious)
- `优化` 统一 CJK 文本与英文, 数字, 行内代码, 链接及 ASCII 符号混排时的空格
- `优化` 全量生成离线 HTML, JSON 和本地搜索索引, 增加可重复的内容 freshness 检查
- `修复` 聚合页中名称互为前缀的 Markdown include 可能被错误替换的问题

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

## v1.1.6

<p style="font: bold 0.8em sans-serif; color: #888888">2023/07/21</p>

- `优化` 完善 [控件节点](https://docs.autojs6.com/#/uiObjectType) 章节

## v1.1.5

<p style="font: bold 0.8em sans-serif; color: #888888">2023/07/06</p>

- `新增` [密文 (Crypto)](https://docs.autojs6.com/#/crypto) 文档
- `新增` [CryptoCipherOptions](https://docs.autojs6.com/#/cryptoCipherOptionsType) / [CryptoKey](https://docs.autojs6.com/#/cryptoKeyType) / [CryptoKeyPair](https://docs.autojs6.com/#/cryptoKeyPairType) 等类型
- `修复` floaty 模块 widht 拼写失误 _[`issue #1`](http://docs-project.autojs6.com/issues/1)_
- `优化` 完善 [Base64](https://docs.autojs6.com/#/base64) 章节
- `优化` 完善 [颜色 (Color)](https://docs.autojs6.com/#/color) 章节

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
- `新增` [HttpRequestHeaders](https://docs.autojs6.com/#/httpRequestHeadersType) / [HttpResponseHeaders](https://docs.autojs6.com/#/httpResponseHeadersType) / [OpenCVRect](https://docs.autojs6.com/#/opencvRectType) 等类型
- `新增` [通知渠道](https://docs.autojs6.com/#/glossaries?id=通知渠道) / [HTTP 标头](https://docs.autojs6.com/#/glossaries?id=HTTP-标头) / [MIME 类型](https://docs.autojs6.com/#/glossaries?id=MIME-类型) / [HTTP 请求方法](https://docs.autojs6.com/#/glossaries?id=HTTP-请求方法) 等术语
- `新增` [颜色 (Color)](https://docs.autojs6.com/#/color) 章节增加 [toColorStateList](https://docs.autojs6.com/#/color?id=m-tocolorstatelist) 及 [setPaintColor](https://docs.autojs6.com/#/color?id=m-setpaintcolor) 条目
- `修复` 文档更新日志条目中的链接无效的问题
- `优化` 完善 [疑难解答 (Q & A)](https://docs.autojs6.com/#/qa) 章节

## v1.1.1

<p style="font: bold 0.8em sans-serif; color: #888888">2023/03/02</p>

- `新增` [Base64](https://docs.autojs6.com/#/base64) 文档
- `新增` [活动 (Activity)](https://docs.autojs6.com/#/activity) 文档
- `新增` [插件 (Plugins)](https://docs.autojs6.com/#/plugins) 文档
- `新增` [存储 (Storages)](https://docs.autojs6.com/#/storages) 文档
- `新增` [万维网 (Web)](https://docs.autojs6.com/#/web) 文档
- `新增` [global.species](https://docs.autojs6.com/#/global?id=m-species) 文档
- `新增` [术语](https://docs.autojs6.com/#/glossaries) 章节增加 [阈值](https://docs.autojs6.com/#/glossaries?id=阈值) / [注入](https://docs.autojs6.com/#/glossaries?id=注入) 等条目
- `新增` [数据类型](https://docs.autojs6.com/#/dataTypes) 章节增加 [Storage](https://docs.autojs6.com/#/storageType) / [ColorDetectionAlgorithm](https://docs.autojs6.com/#/dataTypes?id=colordetectionalgorithm) / [InjectableWebView](https://docs.autojs6.com/#/injectableWebViewType) 等类型
- `修复` 示例代码中与美元符号 ($) 相关内容可能出现占位符替换失败的问题
- `优化` 完善 [颜色 (Color)](https://docs.autojs6.com/#/color) 章节

## v1.1.0

<p style="font: bold 0.8em sans-serif; color: #888888">2023/01/21</p>

- `新增` [AutoJs6 本体应用](https://docs.autojs6.com/#/autojs) 文档
- `新增` [颜色列表 (Color Table)](https://docs.autojs6.com/#/colorTable) 文档
- `新增` [版本工具类 (Version)](https://docs.autojs6.com/#/versionType) 文档
- `新增` [数据类型](https://docs.autojs6.com/#/dataTypes) 章节增加 [RootMode](https://docs.autojs6.com/#/dataTypes?id=rootmode) / [ColorInt](https://docs.autojs6.com/#/dataTypes?id=colorint) / [IntRange](https://docs.autojs6.com/#/dataTypes?id=intrange) 等类型
- `新增` [global.R](https://docs.autojs6.com/#/global?id=p-r) 文档
- `新增` [Numberx.clampTo](https://docs.autojs6.com/#/numberx?id=m-clampto) / [Numberx.parseAny](https://docs.autojs6.com/#/numberx?id=m-parseany) 文档
- `优化` 完善 [颜色 (Color)](https://docs.autojs6.com/#/color) 章节

## v1.0.6

<p style="font: bold 0.8em sans-serif; color: #888888">2022/12/18</p>

- `新增` [版本工具类 (Version)](https://docs.autojs6.com/#/versionType) 文档
- `新增` [global.existsAll](https://docs.autojs6.com/#/global?id=m-existsall) / [global.existsOne](https://docs.autojs6.com/#/global?id=m-existsone) 文档

## v1.0.5

<p style="font: bold 0.8em sans-serif; color: #888888">2022/12/16</p>

- `新增` [global.cX](https://docs.autojs6.com/#/global?id=m-cx) / [global.cY](https://docs.autojs6.com/#/global?id=m-cy) 等相关文档

## v1.0.4

<p style="font: bold 0.8em sans-serif; color: #888888">2022/12/04</p>

- `新增` [global.exit(e)](https://docs.autojs6.com/#/global?id=exite) 文档
- `新增` [Numberx.check](https://docs.autojs6.com/#/numberx?id=m-check) 文档

## v1.0.3

<p style="font: bold 0.8em sans-serif; color: #888888">2022/12/02</p>

- `优化` App 文档去除右上角 Repo 区域防止遮挡文档内容
- `优化` [选择器](https://docs.autojs6.com/#/uiSelectorType) 章节完善选择器行为相关内容
- `优化` 完善 [UiSelector#paste](https://docs.autojs6.com/#/uiSelectorType?id=m-paste) 方法相关内容

## v1.0.2

<p style="font: bold 0.8em sans-serif; color: #888888">2022/12/01</p>

- `新增` 夜间模式主题适配
- `新增` [E4X](https://docs.autojs6.com/#/e4x) / [术语](https://docs.autojs6.com/#/glossaries) / [异常](https://docs.autojs6.com/#/exceptions) / [数据类型](https://docs.autojs6.com/#/dataTypes) / [选择器](https://docs.autojs6.com/#/uiSelectorType) / [控件节点](https://docs.autojs6.com/#/uiObjectType) / [控件集合](https://docs.autojs6.com/#/uiObjectCollectionType) 等条目
- `修复` 章节标题可能显示不全的问题
- `修复` 代码区域滑动时导致页面滑动的问题
- `修复` App 文档无法跳转到其他章节的问题
- `优化` 重新部署文档结构并统一样式 (暂未全部完成)
- `优化` 完善 [脚本化 Java](https://docs.autojs6.com/#/scriptingJava) 章节
- `优化` 支持 Java 等语言的语法高亮 (有限支持)
- `优化` 去除章节标题的锚点标记
- `优化` Web 文档封面适配夜间模式
