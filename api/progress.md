# 文档部署进度 (Progress)

本表覆盖 `toc.md` 与 `sidebar.md` 中的全部站内页面. 外部项目链接不计入部署进度.

2026-09-12 OCR 增量更新: 同步动态自动选择, 插件启停热切换, mode/tap 重置规则与单次调用选项.

2026-09-10 MediaInfo 增量更新: 同步流序号, 流计数, InfoKind 与 Complete name 原始路径语义.

本次源码核查基线:

- AutoJs6 版本: `6.8.0 Alpha7`.
- AutoJs6 源码提交: `505ce33d1d75c2cf692253e8dc25926b11fca42c`.
- 核查日期: `2026-07-26`.
- 核查范围: `ScriptRuntime.augment()` 注册表, Augmentable API, 运行时原型对象, `assets/modules` JavaScript 模块, UI 动态布局器及属性处理器.

历史页面最初以 Auto.js 4.1.1 Alpha2 文档为基础. 当前完成度只按上述 AutoJs6 源码基线及可验证行为评估.

标记含义:

- `√` - API 页面已覆盖当前公开成员并具备基础完整度, 或非 API 页面已满足当前用途.
- `> N%` - 已核实内容超过预估比例, 但仍有成员, 类型, 运行条件或说明需要补充.
- `< N%` - 已核实内容少于预估比例.

无法从源码确定预期语义的成员不作猜测, 统一记录在 [Suspicious - 存疑内容](suspicious). 这些已明确隔离的条目不降低其他页面的完成标记.

| 章节 | 部署进度 |
| --- | :---: |
| [Overview - 综述](overview) | √ |
| [About - 关于文档](documentation) | √ |
| [Progress - 文档部署进度](progress) | √ |
| [Changelog - 文档更新日志](changelog) | √ |
| [Manual - AutoJs6 使用手册](manual) | &lt; 10% |
| [Q & A - 疑难解答](qa) | √ |
| [Suspicious - 存疑内容](suspicious) | √ |
| [AI - 人工智能](ai) | √ |
| [App - 通用应用](app) | &gt; 80% |
| [AutoJs6 - 本体应用](autojs) | √ |
| [Automator - 自动化](automator) | &gt; 80% |
| [Barcode - 条码](barcode) | √ |
| [Base64](base64) | √ |
| [Canvas - 画布](canvas) | √ |
| [Color - 颜色](color) | √ |
| [Console - 控制台](console) | √ |
| [Continuation - 续体](continuation) | √ |
| [Converter - 单位转换](cvt) | √ |
| [Crypto - 密文](crypto) | √ |
| [Device - 设备](device) | √ |
| [Dialogs - 对话框](dialogs) | &gt; 80% |
| [E4X](e4x) | √ |
| [Engines - 引擎](engines) | √ |
| [Events - 事件监听](events) | &gt; 80% |
| [Files - 文件](files) | &gt; 80% |
| [Floaty - 悬浮窗](floaty) | &gt; 70% |
| [Flow - 流程](flow) | √ |
| [Formatter - 格式化](fmt) | √ |
| [Global - 全局对象](global) | √ |
| [HTTP](http) | √ |
| [Images - 图像](image) | √ |
| [Internationalization - 国际化](i18n) | √ |
| [Jsox - JavaScript 对象扩展](jsox) | √ |
| [Keys - 按键](keys) | √ |
| [Media - 多媒体](media) | √ |
| [MediaInfo - 媒体信息](mediainfo) | √ |
| [MIME - 媒体类型](mime) | √ |
| [Module - 模块](modules) | √ |
| [Nano ID - 随机 ID](nanoid) | √ |
| [Notice - 消息通知](notice) | √ |
| [OCR - 光学字符识别](ocr) | √ |
| [OpenCC - 中文转换](opencc) | √ |
| [Pinyin - 拼音](pinyin) | √ |
| [Pinyin4j](pinyin4j) | √ |
| [Plugins - 插件](plugins) | √ |
| [PowerManager - 电源管理](powerManager) | √ |
| [QR Code - 二维码](qrcode) | √ |
| [Recorder - 记录器](recorder) | √ |
| [Sensors - 传感器](sensors) | √ |
| [Settings - 应用设置](settings) | √ |
| [Shell](shell) | √ |
| [Shizuku](shizuku) | √ |
| [SQLite - 数据库](sqlite) | √ |
| [Standardization - 标准化](s13n) | √ |
| [Storages - 存储](storages) | √ |
| [Sysprops - 系统属性](sysprops) | √ |
| [Tasks - 任务](tasks) | √ |
| [Threads - 线程](threads) | √ |
| [Timers - 定时器](timers) | √ |
| [Toast - 消息浮动框](toast) | √ |
| [TTS - 文本转语音](tts) | √ |
| [UI - 用户界面](ui) | √ |
| [UI Attributes - UI 布局属性](uiAttributes) | √ |
| [Util - 工具](util) | √ |
| [Web - 万维网](web) | &gt; 80% |
| [WorkManager - 计划任务兼容接口](workManager) | √ |
| [YOLO - 目标检测](yolo) | √ |
| [Zip - 压缩文件](zip) | √ |
| [UiSelector - 选择器](uiSelectorType) | √ |
| [UiObject - 控件节点](uiObjectType) | √ |
| [UiObjectCollection - 控件集合](uiObjectCollectionType) | √ |
| [UiObjectActions - 控件节点行为](uiObjectActionsType) | √ |
| [Flow - 流程对象](flowType) | √ |
| [FlowError - 流程错误](flowErrorType) | √ |
| [WebSocket](webSocketType) | &gt; 70% |
| [EventEmitter - 事件发射器](eventEmitterType) | √ |
| [ImageWrapper - 包装图像类](imageWrapperType) | √ |
| [App - 应用枚举类](appType) | √ |
| [Color - 颜色类](colorType) | √ |
| [Version - 版本工具类](versionType) | √ |
| [Polyfill - 代码填泥](polyfill) | √ |
| [Arrayx - Array 扩展](arrayx) | √ |
| [Numberx - Number 扩展](numberx) | √ |
| [Mathx - Math 扩展](mathx) | √ |
| [Exceptions - 异常](exceptions) | √ |
| [Intent - 意图](intentType) | &lt; 10% |
| [Runtime - 运行时](runtime) | √ |
| [Context - 上下文](context) | √ |
| [Activity - 活动](activity) | √ |
| [Scripting Java - 脚本化 Java](scriptingJava) | √ |
| [Android API Level - 安卓 API 级别](apiLevel) | √ |
| [Color Table - 颜色列表](colorTable) | √ |
| [Glossaries - 术语](glossaries) | &gt; 80% |
| [HttpHeader - HTTP 标头](httpHeaderGlossary) | √ |
| [HttpRequestMethods - HTTP 请求方法](httpRequestMethodsGlossary) | √ |
| [MimeType - MIME 类型](mimeTypeGlossary) | √ |
| [NotificationChannel - 通知渠道](notificationChannelGlossary) | √ |
| [Data Types - 数据类型](dataTypes) | &gt; 80% |
| [Omnipotent Types - 全能类型](omniTypes) | √ |
| [Storage - 存储类](storageType) | √ |
| [AndroidBundle](androidBundleType) | √ |
| [AndroidRect](androidRectType) | √ |
| [CryptoCipherOptions](cryptoCipherOptionsType) | √ |
| [CryptoKey](cryptoKeyType) | √ |
| [CryptoKeyPair](cryptoKeyPairType) | √ |
| [ConsoleBuildOptions](consoleBuildOptionsType) | √ |
| [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) | √ |
| [HttpRequestHeaders](httpRequestHeadersType) | √ |
| [HttpResponseBody](httpResponseBodyType) | √ |
| [HttpResponseHeaders](httpResponseHeadersType) | √ |
| [HttpResponse](httpResponseType) | √ |
| [InjectableWebClient](injectableWebClientType) | √ |
| [InjectableWebView](injectableWebViewType) | √ |
| [NoticeOptions](noticeOptionsType) | √ |
| [NoticeChannelOptions](noticeChannelOptionsType) | √ |
| [NoticePresetConfiguration](noticePresetConfigurationType) | √ |
| [NoticeBuilder](noticeBuilderType) | √ |
| [Okhttp3HttpUrl](okhttp3HttpUrlType) | &lt; 10% |
| [OcrOptions](ocrOptionsType) | √ |
| [Okhttp3Request](okhttp3RequestType) | &gt; 10% |
| [OpenCVPoint](opencvPointType) | √ |
| [OpenCVRect](opencvRectType) | √ |
| [OpenCVSize](opencvSizeType) | √ |
| [OpenCCConversion](openCCConversionType) | √ |
