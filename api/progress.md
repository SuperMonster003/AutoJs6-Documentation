# 文档部署进度 (Progress)

2026-10-16 Android XML 属性 (UI Android Attributes): 新增页面, 说明原生 Android XML 布局中属性的应用顺序 (处理器, 创建期属性, 公开方法, 布局参数), 取值转换与书写顺序, 不支持与未知属性的跳过与警告, 命名空间与 AppCompat 别名, Material 组件的主题补齐, ConstraintLayout 辅助类, 以及 110 个视图类与 11 个容器的属性表 (由 AutoJs6 的 .python/generate_android_attrs.py --docs 从属性表与 API 37 覆盖矩阵生成, 勿手改). [UI](ui) 新增 "工程资源" 一节 (res 目录位置, 资源类型, vector 矢量图, 限定符目录与选取规则, 样式与主题), 修订 "布局转换模式"; [UI Attributes](uiAttributes) 补充 RelativeLayout 的 layout_toStartOf / layout_toEndOf / layout_alignBaseline, scrollbars 与 requiresFadingEdge 的 none 及关闭语义, 修正 style 的查找范围. 依据为 AutoJs6 6.8.0 本地提交 (宿主路线图 docs/dev/android-xml-attributes-roadmap.md A1 - A9) 与 2026-10-16 在 API 24 / 30 / 33 / 35 / 37 模拟器上的设备测试, 此条不表示官方发布.

2026-10-15 文件 (Files) 批量重命名: 新增 files.batchRename 条目组 (由 Batch Rename 插件提供), 覆盖 plan, apply, undo, history, isAvailable 及异步形态, 选项与替换变量 (计数器, 日期时间, 随机值), 冲突策略, 方案, 结果, 撤销结果与历史对象, 以及 BatchRenameError 错误代码. 依据为 AutoJs6 6.8.0 源码 (files.batchRename 与宿主执行器), Batch Rename 插件的引擎源码, 以及 2026-10-15 在 OnePlus OPD2413 (API 35) 上运行全部示例的结果.

2026-10-15 相册 (Gallery) 新增: 覆盖 3-Maple Image 插件 (3.4.0 及以上) 提供的 gallery 全局对象, 包括选图 (pick, 单选 / 多选, maxCount, mimeTypes, 返回的图片对象与权限处理), 查看器 (view / viewAsync 与 GalleryViewSession 的属性, close 与事件), 编辑 (edit 的输出位置, overwrite 与保存对话框初始值), 无界面转换 (convert 的格式, 质量, 无损, 目标大小, 尺寸模式, 背景色与 EXIF 选项), 可用性探测, 文件由 AutoJs6 读写的边界, 以及 GalleryError 错误代码与各项上限. 依据为 AutoJs6 6.8.0 源码 (宿主提交 902141102), JVM 测试, 插件提交 835bee9 与 2026-10-15 在 API 30 / API 24 模拟器上的插件契约测试; 插件 3.4.0 尚未发布, 此条不表示官方发布.

2026-10-15 API 覆盖核查补齐: 根据当前 Augmentable 注册与原型实现补充 Files 的继承成员, RootAutomator 构造和实例方法, auto.waitFor 超时, 颜色分量与 Java float[] 结果容器重载, WebView 上下文, Numberx.parseFloat 可选基数, Console 数组颜色与无参构建, flow.of 无参起点. 校正 appendBytes 和 RootAutomator.swipe 参数, cX/cY/cXy/cYx 的统一显式模式, 三参数形式, 有限数值和基数校验, 交叉比例 width/height 与横屏行为. 同时说明基数 setter 的整数转换, 以及 setScaleBases 失败时不修改或占用任一方向的行为. 核查覆盖成员名称和本轮确认的调用形式, 不据此宣称全部运行条件或设备行为已完成验证.

2026-10-13 3-Block Compose 设计器 (Compose Designer): 新增插件设计器说明页, 覆盖设计器的三个入口 (启动器, AutoJs6 编辑器菜单, 文件管理器), 私有目录工程与导入 / 导出 / 外部文档 / 草稿 / 外部修改规则, 编辑页各区域与属性三态, 只解释顶层 compose.state 声明与唯一挂载调用的脚本子集及拒绝打开的情形, 固定生成格式与往返不动点, 四个去向与 AutoJs6 编辑器的反向交接, 以及不运行脚本, 弹层卡片化, Image / AndroidView 占位等限制. 页面不是脚本 API. 需要 3-Block Compose 1.2.0 本地开发预览; 编辑器菜单入口需要宿主提交 db7e6a1734 之后的 AutoJs6 6.8.0 构建; 插件仓库尚未发布, 此条不表示官方发布. 同日 [3-Block Compose](compose) 模块页开头的适用版本由 1.1.0 改为 1.2.0 本地开发预览, 与正文的 TSX 可用条件一致. 设计器页的编辑页一节补充横竖屏布局: 竖屏画布在上, 横屏或平板上画布在左. 其后设计器页按 3-Block Compose 1.3.0 本地开发预览更新: 画布拖放按容器排列方向显示插入线并放到指针位置, 修饰链拖动排序, 打开状态的弹层画在画布内 (不再是内联卡片), Image 的 @drawable 与按工程选择的图片目录, AndroidView 保留尺寸并显示 view 源码的占位, 导入来源的写回与重新导入, 每次编辑只重组变化的节点; 新增 "预览状态与交互预览" 一节, 说明状态面板, 交互预览中会回写预览值的控件, 以及与真实运行的差异 (不执行事件处理函数与渲染函数, 表达式不随预览值重算, 预览值不写回脚本). 再其后按 1.4.0 本地开发预览新增 "TSX 工程" 一节: 新建或导入 .tsx 工程, 经 TypeScript Engine 0.7.0 或更高版本的语法树解析服务读取 (不做类型检查, 不编译, 不执行), JSX 中可识别的标签, 属性, 文本与 Fragment, 按源码保留与拒绝打开的写法, TSX 生成格式, TypeScript 语法的事件函数检查, 以工程文件运行, 以及缺少 TypeScript Engine 时的只读打开; 入口, 工程与文件, 去向与限制各节同步注明 .tsx.

2026-10-12 AutoJs4 运行时对照模式: 补充 "使用 AutoJs4 运行并对照" 的两次运行流程, 起止行与前缀的剔除规则, 结果页的摘要, 差异标记与 issue 模板复制, 以及 120 秒超时和不稳定输出的判读提示. 需要宿主 6.8.0 开发版 (对照功能提交后的构建) 与 AutoJs4 Runtime 1.0.0; 在 XQ-AT72 (Android 12) 上验证结果页.

2026-10-12 AutoJs4 运行时 (AutoJs4 Runtime): 新增插件说明页, 覆盖 AutoJs4 Runtime 插件的用途 (以 Auto.js 4.1.1 Alpha2 引擎对照运行结果), 安装与独立权限, 文件管理器 "使用 AutoJs4 运行" 对 .js / .auto / 项目文件夹的入口, 日志前缀与任务停止, 运行限制及差异反馈方式. 页面不是脚本 API, 不新增全局对象. 需要宿主 6.8.0 / 5334 与 AutoJs4 Runtime 插件; 插件仓库尚未发布, 此条不表示官方发布.

2026-10-12 Device Android ID 重载: 补充 device.getAndroidId(useSystemId), 无参/false 的应用 ID 语义, Android 8.0+ 上 Shizuku 优先与 Root 后备的系统值读取, 运行应用所属 Android 用户范围, 权限或读取失败抛出异常, 以及旧系统忽略参数的行为.

2026-10-08 Compose UI F6 本地配套: 补充 compose.memo 的渲染期调用限制, 渲染函数与外层片段作用域, key 或调用次序匹配, 函数字面量来源, 依赖值与 state 版本比较, 失败帧/拒绝帧的记录规则, 256 项依赖及每次渲染 5000 次调用上限, 并在 state 与 render 节提示大型树的局部更新用法. 需要宿主 6.8.0 / 5323, 不改变 Compose UI 插件要求. 源码与设备验证, 全站生成及离线同步以统一交付记录为准, 此条不表示官方发布.

2026-10-07 Compose UI F4 本地配套: 补充契约 V2 追加的 25 个节点, 导航与分段子项限制, 必填插槽, 日期 UTC 语义, 时间/选择/搜索事件, 分页与网格滚动, Tooltip 及下拉刷新. 冻结 V1 和 F2 目录保留, V2 属性和事件表由实际目录单独生成并校验. 本轮源码和设备验证, 全站生成及离线同步以统一交付记录为准, 此条不表示官方发布.

2026-10-07 Compose UI F3 本地配套: 补充 compose.dialog 的独立对话框与底部弹层, alert / bottomSheet 选项, cancelable 的返回键/外部点击/滑动约束, 非 UI 悬浮权限和保活, 共享会话限制及关闭回调. 对话框返回原有 ComposeSession, 支持 TSX 和 AndroidView 内容; dialogs 模块增加双向参阅. 源码和声明的实际验收, 全站生成及离线同步由本轮统一记录, 此条不表示官方发布.

2026-10-07 Compose UI F2 本地配套: 补充 XML `<compose>` 与 `compose.attach`, AndroidView 的实际 View / 同步 Context 工厂, getter 与替换规则, 多容器会话和原有 XML / Compose 直接混域限制. 保留冻结 V1 目录, 互操作属性表单独生成. 配套源码与声明正在本轮验收, 全站生成和离线同步以统一交付记录为准; 此条不表示官方发布.

2026-10-07 Color 感知色彩与主题色控制: 同步宿主 6.8.0 的 OKLab / OKLCH 转换, ensureContrast, harmony, tones, derive, nightVariant, simulate 与 extract, ColorDetectionAlgorithm 新增 oklab, 以及 colors.theme 的主题色读写, 颜色库列表, 智能颜色库激活, 换组与脚本状态. 说明脚本修改的 500 毫秒合并, 历史来源与撤销规则, 示例结果在 API 37 模拟器上逐项核对.

2026-10-04 Compose UI F1 TSX 本地配套: 模块页补充宿主 5319, Compose UI 1.1.0 与 TypeScript Engine 0.6.4 的可用条件, 成员工厂与命名空间标签, Fragment 根/插槽规则, 真实 ref/事件语义及 XML 混域拒绝. 普通 JavaScript 工厂最低宿主 5316 保持不变. 已核对真实声明层与 TypeScript 编译输出; 设备交互验收, 全站生成与离线同步由本轮统一完成, 当前条目不表示官方发布.

2026-10-03 Compose UI V1 参考: 补齐模块, 节点, 响应式状态, 修饰链, 主题, 会话和悬浮窗类型页, 以及 29 个节点组件与 Snackbar 命令说明. 组件表直接投影实际冻结目录的 30 项与 114 个规范属性, 补充输入类型, 快捷属性顺序, 父作用域, 插槽, 事件参数和主题替换/继承边界. 当前仍需匹配的本地宿主构建及 Compose UI 插件, 无 JSX/TSX 或独立 compose.dialog API. 全站生成与离线同步由本轮统一验收, 不据文档源完成度宣称官方发布.

2026-10-03 Compose UI 打包应用: 按实际 APK Builder / INRT 实现补充独立插件依赖, 应用与运行时版本区别, 各应用独立的启用/授权记录, 类型化错误和 XML 提示示例. API 37.1 / 16 KB 页模拟器已验证真实生成的 x86_64 应用在插件已安装/未安装两种条件下的行为, 应用 versionCode 为 1; 同一产物在两种条件下均完成连续启动验证. 完整 API 参考和离线插件同步保留至后续阶段.

2026-10-03 Compose UI 无障碍: 核实 testTag 原样 ID, id/idContains/idMatches 匹配, text/desc 子节点与 Button 点击祖先规则. API 24 x86 与 API 35 x86_64 模拟器使用真实内置无障碍服务和宿主 Rhino 选择器验证通过; 当前为配套宿主的本地预览能力. 本页仅覆盖无障碍与选择器, 完整组件与方法参考仍在补充.

2026-10-02 Installer 来源配置: 同步宿主 5312+ 的 V3 source-profiles 协商, 首个来源/包名前缀匹配规则, 局部默认值及显式覆盖. installer/installReason/packageSource 接受 null 重置, 其他 null 仍拒绝. 说明处理开始快照, 确认与重试边界, 会话级选项, sourceDeleteRequested 和批量共享来源保护. 文档及声明同步不代表远端发布.

2026-10-02 Installer P9 本轮同步: 覆盖宿主 5308+ 的五项高级安装选项, V3 能力协商, optimizing 阶段及 updateOwner/dexopt 观察值, 区分省略与显式 false/none. 说明权限授予, 更新所有权, 手动编译的系统边界, 本地签名门禁, 不可覆盖的包名/共享 UID 黑名单和选中分包的声明权限预览. 本轮不包含按来源配置文件, 不代表插件全部 P9 条目或远端发布完成.

2026-10-02 Installer P8 边界校正: 按最终生产实现补充 Dhizuku 持久默认 API 26-33 与 API 34+ 写前拒绝, Root 独立 system 身份和 user 0 限制, persistent 的 auto 身份筛选及失败不回退. 说明 isDefault 只检查当前解析, persistentConfigured 是宿主 5307 起可解码的本地回执, 不新增脚本状态属性. 区分未确认写入与回滚保证, 设备范围以插件证据为准.

2026-10-02 Installer P8: 同步宿主 5306 的 Dhizuku 授权名称, notification 安装交互, NOTIFICATION_UNAVAILABLE 错误与 setDefault 的 preferred/persistent 模式. 明确 V1/V2 能力协商, Dhizuku API 26+/设备或工作资料所有者/当前用户限制, 不支持的安装标志与保留数据, 通知模式不用于卸载及持久项关闭后的布尔语义. 插件远端发布仍延迟, 设备验收范围由插件路线图独立记录.

2026-10-01 安装器 (Installer): 按宿主源码补充 installer / $installer 的同步, Async 和会话 API, 来源与分包形态, 授权查询, 用户列表, 默认安装器, 结果和错误类型. 明确插件探测, 短等待超时, 来源删除和脚本退出的取消边界; 对应手工声明提供单项与批量结果的类型关联.

2026-09-29 3-Stove Agent 按需连接: 插件中心统一启用状态, 官方首次安装自动启用且尊重后续禁用; run/get 在脚本工作线程等待首次连接, list/presets/catalog 异步连接, status 只读且 detached 不等同于禁用. 去除抽屉开关指引并更新插件名称, 最低宿主和当前观察能力, 保持无开机自启与无任务重放. 无公开方法签名变化.

2026-09-26 AI Agent 1.2.0 开发配套: 同步默认关闭的 mcp 工具组, 服务器和工具选择, 逐服务器风险, Schema 准入, 远端执行与取消边界. 公开 tools 仍为组选择, 不接受令牌或服务器地址, 不新增 JavaScript 方法.

2026-09-26 AI Agent 1.1.0 开发配套: 同步默认关闭的 script_dynamic 工具组, 每份源码单独确认, 私有步骤源码记录与系统文件选择器保存登记脚本的流程. 保留 script 组与动态脚本权限的区别; 模型工具不增加公开 JavaScript 方法.

2026-09-25 AI Agent 1.0.0 发布配套: 核对完整任务 API 的宿主构建要求, 3-Stone AI 模型来源与文本/OCR 观察范围, 补充插件使用说明入口. 无新增 JavaScript 方法或选项字段.

2026-09-24 AI Agent 设置: 同步插件 1.0.0 / 构建号 60 的全局工具组, 默认预算与审慎模式. 区分初始预算和协议硬上限, 明确全局/预设/单次参数交集及入队快照. 无新增 JavaScript 方法或选项字段.

2026-09-24 AI Agent 记忆: 同步插件 1.0.0 / 构建号 57 的逐条确认写入, 作用域隔离, 记忆管理与 JSON 导入/导出; 明确 memory: false 只关闭自动注入, memory 工具组控制查询/提议. 无新增 JavaScript 方法.

2026-09-24 AI Agent 预设: 同步插件 1.0.0 / 构建号 56 的命名预设与默认选择, 入队快照, 模型目录标注, 工具/预算/确认/脚本目录收紧规则, 固定上下文合并及记忆范围. 公开脚本签名与宿主构建要求保持不变.

2026-09-24 AI Agent 任务 API: 同步 run/create/get/list/catalog/presets/status, AgentRun 事件/Promise/join, 脚本归属与 detached, 交互承接方和预算边界; 保留 result/context 执行通道. 对应宿主 6.8.0 / 5293.

2026-09-23 AI Agent 执行通道: 同步 ai.agent.result/context, JSON 结果上限, 显式 null, 独立上下文快照与单文件和项目示例. 任务创建与控制 API 仍未开放.

2026-09-21 电子书 (EPUB) 新增: 覆盖 Readium EPUB Reader 插件提供的 epub 全局对象 (打开书籍, 便捷层, 阅读器会话与可用性探测), EpubBook 的元数据, 目录, 阅读顺序, 正文提取, 封面与资源导出及全文搜索, EpubReaderSession 的事件, 控制方法与阅读偏好, EpubLocator 位置对象, 以及 EpubError 错误代码与各项上限. 依据为 AutoJs6 6.8.0 源码, JVM 测试与 2026-09-21 在 API 33 / API 37 模拟器上的脚本 smoke.

2026-09-20 邮件 (Mail) 新增: 覆盖 Angus Mail 插件提供的 mail 全局对象, MailClient 的收发, 搜索, 附件, 标记, 文件夹与监听方法, MailMessage / MailAttachment / MailAddress / MailSendMessage 对象, MailAccountOptions 账户选项与服务商预设, MailSearchQuery 查询条件, 以及 MailError 错误代码与各项上限. 服务商行为差异按 2026-09-18 至 2026-09-20 的真实账户矩阵记录.

2026-09-16 分支整合: 同步 Console 输入与显示配置, UI 控制台视图, Images 模板与特征匹配, 图像统计和 Color 扩展方法. AI 分支的早期接口说明已由主分支统一插件目标接口覆盖, 合并时保留与当前源码一致的说明. 同步修正图片保存方法的跨页链接并全量生成离线文档与搜索索引.

2026-09-16 Flow 坐标点击与诊断更新: 同步 clickBounds 等待, 延时和工具集系列, maxAttempts 默认 0 表示不限尝试次数, 以及 console.error 自动显示异步任务方法, 文件和行号. 验证依据为源码, Rhino 异常传播单元测试与声明 smoke 检查; 未执行医院应用真机挂号.

2026-09-16 Flow 增量更新: 链式 clickIfExists / clickAny / findAny, whenPresent 可选分支, repeatUntil 有界循环, 集合稳定比较与 snapshot 投影. 明确回调线程, 子流程取消, 错误传播和 stableFor 的实际默认值 0.

2026-09-13 Pangu 增量更新: 覆盖内置 pangu.js 10.1.0 的全局对象, 文本间距处理, 间距检查与运行环境.

本表覆盖 `toc.md` 与 `sidebar.md` 中的全部站内页面. 外部项目链接不计入部署进度.

2026-09-14 打包存储增量更新: QA 补充 `launchConfig.requiresSharedStorage` 默认值, 私有文件与共享路径的适用范围, 拒绝授权, 设置返回, 隐藏桌面入口恢复及开机启动规则. 旧安装迁移和实体机矩阵继续由宿主 SDK 37 Roadmap 跟踪.

2026-09-13 HTTP 增量更新: `isInsecure` / `insecure` 自 6.8.0 起仅对当前请求生效, 常规客户端选项仍可共享; 区分证书信任, CT, ECH 和本地网络权限. 当前验证基于受控 TLS 夹具, 不表示企业代理或真实 ECH 协商已经验收.

2026-09-14 Media3 增量更新: Media 同步音乐前台服务, 单一播放所有权, 工作线程同步准备, 系统媒体控制, 退出清理与打包权限要求. Node 音量桥和 TTS 仍各自保留原有运行条件; 真机可听性及完整定时 / 开机链继续由宿主 Roadmap 跟踪.

2026-09-13 后台音频增量更新: Media / Device 说明 Android 17 运行条件, 静默抑制与可见界面恢复操作; TTS 区分宿主和实际引擎进程; Settings 区分偏好开关, 服务状态和播放资格. 设备适配证据由宿主 SDK 37 Roadmap 单独维护, 本说明不表示所有定时 / 开机 / TTS 场景已验收.

2026-09-13 Runtime 增量更新: 补充 `requestPermissions` 的本地网络权限名称, Android 17 / targetSdk 37 条件, 异步授权与重试, 原生 Socket / MQTT 异常及插件权限边界.

2026-09-13 Device 增量更新: 补充 `device.pageSize` 的只读数值契约, 字节单位, `$device` 别名及 4 KB / 16 KB 用例.

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
| [3-Block Compose](compose) | √ |
| [Console - 控制台](console) | √ |
| [Continuation - 续体](continuation) | √ |
| [Converter - 单位转换](cvt) | √ |
| [Crypto - 密文](crypto) | √ |
| [Device - 设备](device) | √ |
| [Dialogs - 对话框](dialogs) | &gt; 80% |
| [E4X](e4x) | √ |
| [EPUB - 电子书](epub) | √ |
| [Engines - 引擎](engines) | √ |
| [Events - 事件监听](events) | &gt; 80% |
| [Files - 文件](files) | &gt; 80% |
| [Floaty - 悬浮窗](floaty) | &gt; 70% |
| [Flow - 流程](flow) | √ |
| [Formatter - 格式化](fmt) | √ |
| [Gallery - 相册](gallery) | √ |
| [Global - 全局对象](global) | √ |
| [HTTP](http) | √ |
| [Images - 图像](image) | √ |
| [Installer - 安装器](installer) | √ |
| [Internationalization - 国际化](i18n) | √ |
| [Jsox - JavaScript 对象扩展](jsox) | √ |
| [Keys - 按键](keys) | √ |
| [Mail - 邮件](mail) | √ |
| [Media - 多媒体](media) | √ |
| [MediaInfo - 媒体信息](mediainfo) | √ |
| [MIME - 媒体类型](mime) | √ |
| [Module - 模块](modules) | √ |
| [Nano ID - 随机 ID](nanoid) | √ |
| [Notice - 消息通知](notice) | √ |
| [OCR - 光学字符识别](ocr) | √ |
| [OpenCC - 中文转换](opencc) | √ |
| [Pangu - 文本间距](pangu) | √ |
| [Pinyin - 拼音](pinyin) | √ |
| [Pinyin4j](pinyin4j) | √ |
| [Plugins - 插件](plugins) | √ |
| [PowerManager - 电源管理](powerManager) | √ |
| [QR Code - 二维码](qrcode) | √ |
| [Recorder - 记录器](recorder) | √ |
| [Sensors - 传感器](sensors) | √ |
| [Settings - 应用设置](settings) | √ |
| [Terminal](terminal) | 已完成 |
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
| [UI Android Attributes - Android XML 属性](uiAndroidAttributes) | √ |
| [Util - 工具](util) | √ |
| [Web - 万维网](web) | &gt; 80% |
| [WorkManager - 计划任务兼容接口](workManager) | √ |
| [YOLO - 目标检测](yolo) | √ |
| [Zip - 压缩文件](zip) | √ |
| [UiSelector - 选择器](uiSelectorType) | √ |
| [UiObject - 控件节点](uiObjectType) | √ |
| [UiObjectCollection - 控件集合](uiObjectCollectionType) | √ |
| [UiObjectActions - 控件节点行为](uiObjectActionsType) | √ |
| [ComposeNode - Compose 节点](composeNodeType) | √ |
| [ComposeState - Compose 状态](composeStateType) | √ |
| [ComposeModifier - Compose 修饰链](composeModifierType) | √ |
| [ComposeTheme - Compose 主题](composeThemeType) | √ |
| [ComposeSession - Compose 会话](composeSessionType) | √ |
| [ComposeFloatyWindow - Compose 悬浮窗](composeFloatyWindowType) | √ |
| [Compose 组件目录](composeComponents) | √ |
| [EpubBook - 电子书对象](epubBookType) | √ |
| [EpubReaderSession - 阅读器会话](epubReaderSessionType) | √ |
| [Flow - 流程对象](flowType) | √ |
| [FlowError - 流程错误](flowErrorType) | √ |
| [GalleryViewSession - 查看器会话](galleryViewSessionType) | √ |
| [MailClient - 邮件客户端](mailClientType) | √ |
| [MailMessage - 邮件消息](mailMessageType) | √ |
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
| [EpubLocator](epubLocatorType) | √ |
| [HttpRequestBuilderOptions](httpRequestBuilderOptionsType) | √ |
| [HttpRequestHeaders](httpRequestHeadersType) | √ |
| [HttpResponseBody](httpResponseBodyType) | √ |
| [HttpResponseHeaders](httpResponseHeadersType) | √ |
| [HttpResponse](httpResponseType) | √ |
| [InjectableWebClient](injectableWebClientType) | √ |
| [InjectableWebView](injectableWebViewType) | √ |
| [MailAccountOptions](mailAccountOptionsType) | √ |
| [MailSearchQuery](mailSearchQueryType) | √ |
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
