# 文档更新日志 (Changelog)

## v6.8.0

- `更新` [通用应用 (App)](app), [Shell](shell), [Shizuku](shizuku) 与 [ShellProcess](shellProcessType) 页的运行时支持表: Node.js 主线程与 Worker 现在提供 app 的成员 (含双开辅助函数, getInstalledPackages / getApkInfo / getAppByAlias 与 sendLocalBroadcastSync), shell 与 shizuku 的成员, 19 个全局按键与手势函数 (Home / KeyCode / Tap 等) 以及 ShellProcess 的成员; Bun 的对应成员需授权 app.control / shell.control / shell.root / shell.shizuku; app.autojs 待补

- `新增` [语音 (Speech)](speech) 的离线分析 speech.diarize (说话人分离: 谁在何时说话, 可按已注册的声纹认人), speech.detectLanguage (语种识别) 与 speech.tag (音频标签) 及其 Async 形态, 以及说话人识别 speech.speaker (注册, 验证, 辨认, 列出与删除声纹); 模型目录补上 3-Macaw Speech 1.3.0 的说话人, 分割, 语种识别与音频标签模型, [SpeechModelInfo](speechModelInfoType) 的模型类别增加 speaker, segment, langid 与 tagger

- `更新` [颜色 (Color)](color), [Color (颜色类)](colorType), [文件 (Files)](files), [压缩文件 (Zip)](zip), [存储 (Storages)](storages), [Storage (存储类)](storageType), [媒体信息 (MediaInfo)](mediainfo), [电子书对象 (EpubBook)](epubBookType), [MIME](mime), [记录器 (Recorder)](recorder), [全局对象 (Global)](global) 与 [工具 (Util)](util) 页的运行时支持表: Node.js 主线程与 Worker 现在提供 colors / Color, files (含全局 open), zip, mime, recorder, storages (含 names / all 与 Storage#size) 与 mediainfo, 以及全局 dayjs / pangu / cheerio / i18n 与 Worker 中的 axios; util.toRegularAndCall / toRegularAndApply 标为 "宿主已废弃"

- `新增` [脚本库 (Bundled Libraries)](bundledLibraries), 说明 axios, cheerio, dayjs, i18n, pangu, lodash 与 Node.js 兼容模块改由 Bundled Libraries 插件提供 (不再随 AutoJs6 安装包提供), 插件的安装与逐库开关, 以及插件不可用时 require 与全局对象抛出的错误, 并注明用 AutoJs6 打包的应用暂不包含这些库; 模块, 全局对象, 国际化与文本间距页同步更新

- `更新` 其余有脚本 API 的模块页与对象类型页顶部新增运行时支持表 (连同此前的 13 页共 83 页, 覆盖全部 69 个模块与 43 种返回对象), 列出 Rhino, Node.js 主线程, Node.js Worker 与 Bun 中各 API 的入口, 状态与授权; 模块页的表下列出本页说明的返回对象, 对象有独立类型页时 (如 [控件节点 (UiObject)](uiObjectType), [应用枚举类 (App)](appType)) 表格放在类型页; [全局对象 (Global)](global) 页的表并入 species

- `修复` [应用枚举类 (App)](appType) 的实例方法 openSettings 改为实际提供的 launchSettings (AutoJs6 中不存在 openSettings)

- `新增` [颜色 (Color)](color) 的 colors.rgba / hsva / hsla 补充 (components, alpha) 重载: 三个分量组成的数组与单独给出的 alpha 分量

- `更新` [拼音 (Pinyin)](pinyin) 页顶部新增运行时支持表; [工具 (Util)](util), [全局对象 (Global)](global), [标准化 (Standardization)](s13n), [单位转换 (Converter)](cvt), [格式化 (Formatter)](fmt), [JavaScript 对象扩展 (Jsox)](jsox), [Mathx](mathx), [Arrayx](arrayx) 与 [Numberx](numberx) 页的运行时支持表补上 Bun 列: Bun 客户端的 host.util, host.species, host.global, host.s13n, host.cvt / host.fmt, host.jsox (mathx / arrayx / numberx) 与 host.pinyin 的 STYLE_* / MODE_* 常量

- `更新` [工具 (Util)](util), [全局对象 (Global)](global), [标准化 (Standardization)](s13n), [单位转换 (Converter)](cvt), [格式化 (Formatter)](fmt), [JavaScript 对象扩展 (Jsox)](jsox), [Mathx](mathx), [Arrayx](arrayx) 与 [Numberx](numberx) 页顶部新增运行时支持表, 列出 Node.js 主线程与 Worker 中 autojs6:util, species, autojs6:global, s13n, cvt / fmt, jsox 等入口的支持情况

- `更新` 为返回对象与模块原型补上成员说明: [对话框 (Dialogs)](dialogs) 中 Dialog 的其余方法 (标题与视图, 按钮, 列表, 进度, 复选框, 状态, android.app.Dialog 方法分组列出); [任务 (Tasks)](tasks) 中 TimedTask 与 IntentTask 的属性及读写方法; [引擎 (Engines)](engines) 中 ScriptExecution 的 isFinished 与 Agent 运行信息, ScriptEngine 的 getTag, setTag, getUncaughtException 与 getBackingSourcePath; 控件节点的 summary, isSimilar 与已弃用的 brother, 控件集合的 contains, iterator 与 isSimilar, 选择器的 toStringReadable; [AutoJs6](autojs) 的 themeColor 实例成员; [Color](colorType) 的 argb, rgb, rgba, hsv, hsva, hsl, hsla 简写与 toStringReadable; [悬浮窗 (Floaty)](floaty) 的 findView, requestFocus 与 disableFocus; [图像 (Image)](image) 中 Mat 的 release, isReleased 与 convertTo, MatchingResult#findMax; Flow 的 4 个事件等待步骤; 文本文件对象的 getPath; ZIP 对象的 toStringReadable; 控制台构建器的 exitOnCloseTimeout 与 contentTextColors; 以及 crypto.fromHex, events.removeToastObserver, events.removeNotificationObserver, util.class, util.getClassName 与 util.className

- `修复` [选择器 (UiSelector)](uiSelectorType) 中不存在的 contentValid 条目改为实际提供的 contentInvalid (控件内容无效状态选择器)

- `更新` [图像 (Image)](image) 与 [文件 (Files)](files) 页的运行时支持表计入以 Java 对象为原型的模块成员 (如 files.isFile), 并在表下列出本页说明的返回对象 (如 Mat, MatchingResult), 每个对象一行

- `更新` 为此前只在表格或正文中顺带提到的 API 补上独立条目 (标题, 签名, 参数与示例): [邮件 (Mail)](mail) 中经默认客户端调用的 48 个方法 (如 mail.fetch 与 mail.fetchAsync), [流程 (Flow)](flow) 的 15 个工具集起点与 4 个事件等待起点 (如 flow.smartClick, flow.waitForToast), 以及别名 waitAsync, wait.async, clickWait, clickBoundsWait, clickWhenStable, clickBoundsWhenStable, waitForGone, flow.delay; [文本转语音 (TTS)](tts) 的 speakTask, enqueueTask, synthesizeToFile, synthesizeTask, synthesisTask, stopAll 与 config; [全局对象 (Global)](global) 的全小写 toastverbose, toastlog, toastinfo, toastwarn 与 toasterror; [Mathx](mathx) 的 random 与已弃用的 randFloat; [自动化 (Automator)](automator) 的 automator.headsethook

- `更新` [语音 (Speech)](speech) 的模型目录补上 3-Macaw Speech 1.2.0 与 1.3.0 新增的模型 (法语, 俄语, 韩语, 西班牙语与八语识别, Kokoro v1.0 多语言及阿拉伯语, 韩语等合成声音), 并说明离线识别类型 offline-transducer 与 Kokoro v1.0 的说话人划分

- `更新` [语音 (Speech)](speech) 的 punctuation 选项补全说明: 模型自带标点 (SenseVoice) 时保留, 流式模型的结果由 3-Macaw Speech 中已安装的标点模型补上标点 (1.2.0 起, 中文与英文), 设为 false 去掉所有标点

- `新增` API 文档: Node.js/Bun/Worker 的 ai.agent 任务控制与事件, 注册脚本上下文和结果回传, 以及打包应用的独立授权

- `新增` Node.js, Bun 和 Worker 的 AI 文本生成, 流式结果, 模型目录与持久会话, 以及独立签名应用在 3-Stone AI 中的逐应用确认与撤销授权

- `新增` Node.js, Bun 与 Worker 的 Flow within/scope 范围继承, 罗盘导航和结果投影, 以及 press/swipe/gesture/gestures 手势重载

- `新增` [内存 (Memory)](memory), 说明脚本读取 AutoJs6 进程内存诊断数据的 memory 模块: 内存快照, 强制回收, 已结束未回收的脚本运行时, hprof 堆转储 (正式版本需开启 "允许脚本导出 hprof") 与 LeakCanary 监视

- `更新` [WebSocket](webSocketType) 补全 exitOnClose 的说明: 脚本结束时只处理该脚本自己的连接, 调用过 exitOnClose 的连接优雅关闭, 其余连接立即断开

- `新增` Node.js, Bun 及 Worker 的 flow 异步链与条件/稳定性等待, 支持分支取消, 单步骤重试及宿主界面快照; Node.js, Bun 及 Worker 的 Flow 高级点击, 滚动, 输入, 列表采集与真实事件等待, 支持监听就绪, 快照校验和取消

- `更新` [语音 (Speech)](speech) 的 recognize, recognizeAsync 与 detectVoice 说明 WAV 以外的音频文件: 插件声明 audioDecode 功能时 (3-Macaw Speech 1.2.0 起) 接受 MP3, AAC, Ogg, FLAC, AMR 等设备能解码的格式与视频文件的音轨, 以及相应的 UNSUPPORTED_FORMAT 原因

- `新增` Node.js/Bun/Worker 的 speech 语音识别与模型管理接口, 支持 WAV/PCM, 听写与唤醒会话, 模型安装/导入, 语音合成和取消清理

- `新增` Node.js/Bun/Worker 的文字转语音接口, 支持引擎与音色查询, 朗读, 静音任务, 音频文件合成和任务事件

- `新增` [语音 (Speech)](speech) 与 [SpeechSession](speechSessionType), [SpeechWakeSession](speechWakeSessionType), [SpeechRecognitionResult](speechRecognitionResultType), [SpeechModelInfo](speechModelInfoType), 说明 3-Macaw Speech 插件提供的麦克风听写, 文件与 PCM 识别, 语音活动检测, 唤醒词, 合成与模型管理, 模型目录与许可, 后台收音与唤醒会话的临时接管, 错误代码与上限, 以及数字助理, 系统语音输入, 系统识别服务与 VOICE_COMMAND 入口契约; [TTS](tts) 增加 "使用 3-Macaw Speech 引擎" 一节, [插件 (Plugins)](plugins) 增加提供脚本模块的插件列表

- `新增` Node.js/Bun/Worker 的 Java 回调代理, 子类生成和 JAR/DEX 加载, 支持 Promise 返回值, 父类调用及执行结束清理

- `新增` Node.js/Bun/Worker 的 Java/Android 对象互操作, 支持公开构造器和成员, 数组, 精确 long 值, 显式重载及应用 Context 句柄

- `新增` Node.js/Bun 的 Android 对象辅助接口及 Worker 封装, 支持 Paint, ColorStateList, 主题色和 FileProvider URI
- `新增` Node.js/Bun 的持久日历与 IntentTask API, 支持每日, 每周, 每月, 每年, 一次性, 倒计时和广播任务

- `新增` Bun 与 Node.js Worker 的设备控制和对话框 API, 支持亮度, 音量和独立窗口清理

- `新增` Bun 与 Node.js Worker 的宿主事件和通知 API, 支持独立订阅与通知清理

- `新增` Bun, Node.js 及 Worker 的宿主 Shell API, 支持流式输入输出, Shizuku 授权与进程清理

- `修复` shell/shizuku 进程接口的类型声明与补全缺漏, 包含事件参数及管道 Shell 构造器

- `新增` Bun 与 Node.js Worker 的传感器采样及订阅 API, 支持取消和监听器自动释放

- `新增` Node.js Worker 与 Bun 的 database/sqlite API, 支持参数化查询, 事务和数据库持久化

- `新增` Bun 文件与持久化存储 API, 支持独立授权的宿主文件读写及 Node.js 存储互通

- `新增` Shell 流式进程: shell.spawn/shizuku.spawn 与 ShellProcess, 兼容 Auto.js Pro 的 Shell 选项构造方法 (支持 adb/pty) 及其流方法, $shell.setDefaultOptions/checkAccess/isRootAvailable 与 shell 函数的 adb 选项

- `新增` Bun 无障碍, 应用操作与剪贴板 API 对齐 Node.js 对应接口, 支持独立授权和打包应用

- `新增` Node.js/Bun 的 WebView 屏幕共享适配, 前台服务后台录音及原生后台摄像头录像, 包括 Node Worker 封装

- `新增` WebView getUserMedia/MediaRecorder 流式音视频, 支持等待网页 Promise, 显式申请 Android 媒体权限及 Worker 生命周期管理

- `新增` [文件 (Files)](files#m-batchrename) 的 files.batchRename, 说明 Batch Rename 插件提供的批量重命名: 方案预览与逐项排除, 执行, 撤销, 历史批次的查询与清理, 不访问文件的名称试算, 命名预设, 选项与替换变量 (计数器, 日期时间, 随机值, 照片元数据, 汉字转拼音), 冲突策略, 结果对象及错误代码

- `新增` [相册 (Gallery)](gallery) 与 [GalleryViewSession](galleryViewSessionType), 说明 3-Maple Image 插件提供的选图, 查看器会话, 编辑与无界面转换, 文件由 AutoJs6 读写的边界, 照片访问权限与错误代码

- `更新` [API 参考](documentation) 补齐 Files 与 RootAutomator 成员, 颜色结果容器, WebView 上下文和可选参数重载, 校正字节追加与滑动参数, 同步坐标缩放说明, 说明 setScaleBases 失败时不修改或占用基数, 以及基数 setter 的整数转换规则

- `新增` [3-Block Compose 设计器 (Compose Designer)](composeDesigner), 说明 3-Block Compose 插件内置可视化设计器的入口与工程文件, 编辑页的画布 / 大纲 / 属性 / 组件面板与草稿, 可识别的脚本子集与往返规则, 与 AutoJs6 编辑器的双向交接以及当前限制
- `更新` [AutoJs4 运行时 (AutoJs4 Runtime)](autojs4Runtime) 增加 "对照模式" 小节, 说明 "使用 AutoJs4 运行并对照" 的两次运行, 结果页摘要与差异标记, 以及 issue 模板的复制
- `新增` [AutoJs4 运行时 (AutoJs4 Runtime)](autojs4Runtime), 说明 AutoJs4 Runtime 插件的用途, 安装与权限, 文件管理器 "使用 AutoJs4 运行" 入口, 日志回传与任务停止, 运行限制以及差异反馈方式
- `更新` [设备 (Device)](device) 的 getAndroidId(useSystemId) 重载, 说明通过 Shizuku/Root 获取运行应用所属 Android 用户的系统值, 失败抛出异常及 Android 8.0 以前忽略参数的行为

- `新增` [Terminal](terminal), [TerminalSession](terminalSessionType), [TerminalOpenOptions](terminalOpenOptionsType) 与 [TerminalError](terminalErrorType), 说明 3-Shell Terminal 插件依赖, 同步和异步会话管理, 输出事件, npm 脚本, 权限与生命周期
- `新增` [颜色 (Color)](color) 的 OKLab / OKLCH 转换 (oklab, oklch, toOklab, toOklch), ensureContrast, harmony, tones, derive, nightVariant, simulate 与 extract 条目, 以及 [ColorDetectionAlgorithm](dataTypes#colordetectionalgorithm) 的 `oklab` 算法
- `新增` [颜色 (Color)](color) 的 colors.theme 主题色控制条目 (get, set, reset, libraries, activate, deactivate, next, state, current), 说明脚本修改的合并, 历史来源与撤销, 以及智能颜色库的 "脚本状态" 状态源与 "脚本启动" 换组时机

<p style="font: bold 0.8em sans-serif; color: #888888">2026/10/05</p>

- `更新` [安装器 (Installer)](https://docs.autojs6.com/#/installer) 的高级安装选项, optimizing 阶段及所有权/手动编译观察结果, 补充本地签名门禁, 包名/共享 UID 黑名单和选中分包的权限预览边界

- `更新` [安装器 (Installer)](https://docs.autojs6.com/#/installer) 的持久默认边界: Dhizuku API 26-33, Root 独立 system 身份与 user 0, 按模式选择自动授权, 本地配置回执和未确认写入语义

- `更新` AI Agent 1.2.0 开发版本的 mcp 工具组, 默认关闭, 服务器配置与工具选择, 逐服务器风险和远端取消边界
- `更新` AI Agent 1.1.0 开发版本的 script_dynamic 工具组, 默认关闭, 每份源码单独确认, 私有步骤记录与保存登记脚本的流程

- `更新` AI Agent 1.0.0 的 Android, 宿主构建与 3-Stone AI 模型运行条件, 区分插件附着与完整任务 API, 说明模型可用性和当前观察能力
- `更新` AI Agent 构建号 60 的全局设置与预算合并规则, 区分初始默认值和协议硬上限, 说明工具组与审慎模式只能由预设及单次参数进一步收紧
- `新增` [电子书 (EPUB)](https://docs.autojs6.com/#/epub), [EpubBook](https://docs.autojs6.com/#/epubBookType), [EpubReaderSession](https://docs.autojs6.com/#/epubReaderSessionType) 与 [EpubLocator](https://docs.autojs6.com/#/epubLocatorType) 文档, 覆盖 Readium EPUB Reader 插件的元数据, 目录, 正文提取, 封面与资源导出, 全文搜索, 阅读器会话事件与控制, 阅读偏好, 位置对象与错误代码
- `更新` [电子书 (EPUB)](https://docs.autojs6.com/#/epub) 增加高亮与笔记: [EpubBook#annotations](https://docs.autojs6.com/#/epubBookType?id=m-annotations) 与便捷层 `epub.annotations` 读取阅读器为一本书保存的高亮与笔记 (Readium EPUB Reader 插件 1.1.0, EPUB 契约版本 2), [EpubReaderSession](https://docs.autojs6.com/#/epubReaderSessionType) 增加 `highlight` 事件 (`action` 为 `added` / `updated` / `removed`), [EpubLocator](https://docs.autojs6.com/#/epubLocatorType) 的携带位置随之补充
- `新增` [邮件 (Mail)](https://docs.autojs6.com/#/mail), [MailClient](https://docs.autojs6.com/#/mailClientType), [MailMessage](https://docs.autojs6.com/#/mailMessageType), [MailAccountOptions](https://docs.autojs6.com/#/mailAccountOptionsType) 与 [MailSearchQuery](https://docs.autojs6.com/#/mailSearchQueryType) 文档, 覆盖 Angus Mail 插件的 IMAP / POP3 / SMTP 收发, 搜索, 附件, 标记, 文件夹, 新邮件监听, 账户选项, 服务商预设与错误代码
- `更新` [邮件 (Mail)](https://docs.autojs6.com/#/mail) 增加 "邮件到达时运行脚本" 示例: Angus Mail 插件 1.1.0 的后台守望与 AutoJs6 定时任务 "邮件到达时" (邮件契约版本 2), 脚本经 `engines.myEngine().execArgv.mail` 读取守望名, 账户别名, 文件夹, 信封与到达时间
- `更新` [邮件 (Mail)](https://docs.autojs6.com/#/mail) 的 `mail.accounts.list()` 条目增加可选 `oauth` 对象: Angus Mail 插件 1.2.0 在设置页经浏览器以 Google / Microsoft 账号登录的账户的登录状态 (`provider`, `authorizedAt`, `expiresAt`, `needsReauth`), 令牌本身不出现
- `更新` Flow 坐标点击系列, maxAttempts 默认 0 的无限尝试语义, 以及异常的任务调用栈和控制台输出
- `更新` Flow 可选步骤 `whenPresent`, 有界循环 `repeatUntil`, 链式候选查找与点击, 集合稳定性及 `snapshot` 快照选项, 并校正 `stableFor` 的默认值为 0
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
