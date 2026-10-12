# AutoJs4 运行时 (AutoJs4 Runtime)

<!-- type=misc -->

AutoJs4 运行时是一个独立安装的 AutoJs6 插件 ([AutoJs6-Plugin-AutoJs4-Runtime](https://github.com/SuperMonster003/AutoJs6-Plugin-AutoJs4-Runtime)), 它内嵌 [AutoJs4](https://github.com/SuperMonster003/AutoJs4) 的脚本引擎 (Auto.js 4.1.1 Alpha2 的克隆, Rhino 1.7.7.2, OpenCV 3.4.3), 使 AutoJs6 的文件管理器可以用 AutoJs4 引擎运行一个脚本并对照结果, 无需另外安装 AutoJs4. 本页面自 AutoJs6 6.8.0 (构建 5334) 起适用.

本页面不是脚本 API. AutoJs4 运行时没有新增任何全局对象或模块, 脚本内容不需要为它做任何修改.

---

## 用途

AutoJs4 是 AutoJs6 的行为基准: 除少数特定情况外, 能在 AutoJs4 正常运行的脚本, 在 AutoJs6 上也应正常运行且效果与结果完全一致. 当一个脚本在 AutoJs6 上的表现与预期不同时, 可以用 "使用 AutoJs4 运行" 在同一台设备上立即得到 AutoJs4 的结果:

- 两者一致: 问题通常出在脚本本身或设备环境, 与 AutoJs6 的改动无关.
- AutoJs4 正常而 AutoJs6 异常: 这是最值得反馈的情形, 见 [差异反馈](#差异反馈).
- AutoJs4 异常而 AutoJs6 正常: 通常是 AutoJs6 已修复的旧问题, 不需要反馈.

---

## 安装与启用

1. 在插件中心的官方插件库安装 AutoJs4 Runtime, 并确认其处于启用状态. 插件按 ABI 拆分发布 (`arm64-v8a`, `armeabi-v7a`, `x86_64`, `x86`), 也提供包含全部 ABI 的 `universal` 包; 需要 Android 7.0 (API 24) 或更高版本.
2. 在插件中心打开插件的设置页 (条目中的 "打开插件"), 按脚本需要授予下列权限. 这些权限属于插件自身, 与 AutoJs6 已获得的权限相互独立:
   - 存储权限: 读取脚本文件与脚本访问的文件 (插件沿用 AutoJs4 的 `targetSdk 28` 与传统外部存储模型).
   - 悬浮窗: 脚本使用 `floaty`, `console.show()` 或 AutoJs4 的对话框时需要.
   - 无障碍服务: 脚本使用控件操作 (`click`, `text().findOne()` 等) 时需要, 在系统设置中为 "AutoJs4 Runtime" 单独开启.
   - 忽略电池优化与 Root 状态: 设置页提供状态显示与跳转, 按需处理.

插件未安装时, 文件管理器的对应菜单位置显示 "安装 AutoJs4 Runtime", 点击后跳转插件中心; 插件已安装但被禁用或协议不兼容时, 点击 "使用 AutoJs4 运行" 会提示启用或升级.

---

## 入口

在 AutoJs6 文件管理器中打开以下对象的 "更多" 菜单, 选择 "使用 AutoJs4 运行":

| 对象 | 运行方式 |
| --- | --- |
| `.js` 文件 | 以文件所在目录为工作目录运行; `"ui";` 脚本在插件进程内打开 AutoJs4 自己的脚本界面 |
| `.auto` 文件 | 由 AutoJs4 的 Root 录制回放引擎执行, 需要 Root 权限 |
| 含 `project.json` 的项目文件夹 | 读取 `main` 作为入口, 以项目目录为工作目录, 遵循 `features`; `main` 缺失或不存在时拒绝运行并提示 |

"使用 AutoJs4 运行" 与 "使用 AutoJs4 运行并对照" 都是显式操作. 普通的运行按钮, 定时任务, 快捷方式, 外部意图与打包应用仍由 AutoJs6 自己的引擎执行, 扩展名或文件头指令不会把脚本自动交给 AutoJs4.

---

## 运行方式

- 脚本在插件自己的进程中由 AutoJs4 引擎执行, 不进入 AutoJs6 进程; AutoJs6 只负责发现插件, 发起请求, 接收日志与结束状态.
- 任务出现在 AutoJs6 的任务面板中, 图标与普通脚本相同; 任务面板的停止按钮, 音量键停止与 "停止全部" 都能结束 AutoJs4 任务.
- AutoJs4 的控制台输出会逐行回到 AutoJs6 控制台, 保持原有级别, 并加上 `[AutoJs4] ` 前缀. 脚本异常以 AutoJs4 的格式打印, 任务按异常结束.
- 插件设置中的 "显示 AutoJs4 控制台窗口" 默认关闭; 开启后 `console.show()` 同时在插件进程显示 AutoJs4 原有的浮动控制台, 便于对照视觉效果.
- 插件进程意外退出时, AutoJs6 以 "AutoJs4 运行时意外退出" 结束任务.

```js
/* 保存为任意 .js 文件, 分别用运行按钮与 "使用 AutoJs4 运行" 执行, 对照控制台输出. */
console.log("engine package: " + context.getPackageName());
console.log("device: " + device.brand + " " + device.model + " (API " + device.sdkInt + ")");
toast("hello");
```

AutoJs6 运行时第一行输出 `org.autojs.autojs6`, AutoJs4 运行时输出插件包名 `io.github.supermonster003.autojs6.plugin.autojs4.runtime`, 以此确认脚本由哪个引擎执行.

---

## 对照模式

文件管理器中 `.js` 文件与项目文件夹的 "更多" 菜单另有 "使用 AutoJs4 运行并对照": AutoJs6 先用自己的引擎运行目标, 结束后再经 AutoJs4 Runtime 运行一次, 两次运行回到 AutoJs6 控制台的输出 (去掉 "开始运行" / "运行结束" 等起止行与 `[AutoJs4]` 前缀) 逐行对比后在结果页显示:

- 摘要: 目标路径, 两次输出是否一致 (差异行数), 两次运行各自的用时, 以及运行失败或超时的提示.
- 差异: 以 `-` 标记只在 AutoJs6 输出中出现的行, 以 `+` 标记只在 AutoJs4 输出中出现的行, 其余为相同行.
- "复制为 issue 模板": 把脚本路径, AutoJs6 与插件版本, 设备与 Android 版本, 两次完整输出及差异整理为 Markdown 复制到剪贴板, 可直接粘贴到 issue.

每次运行最多等待 120 秒, 超时的运行会被强制停止并在摘要中标明. 对照期间显示进度对话框, 需要交互的脚本 (对话框, 输入) 仍会按各自引擎的方式弹出界面. 随机值, 时间戳与并发日志次序等本身不稳定的输出会被计为差异, 判读时需自行排除.

---

## 限制

- 不共享权限: 插件的无障碍服务, 悬浮窗, 存储与截图权限都需要单独授予, 不继承 AutoJs6 的授权; Shizuku 不可用于 AutoJs4 引擎.
- 不改变 AutoJs4: 插件原样编译 AutoJs4 的引擎模块, 不修补其脚本语义. `armeabi-v7a` 使用 AutoJs4 原版 OpenCV 3.4.3 原生库; 64 位设备使用同一 OpenCV 版本的重编库; `x86` 与 AutoJs4 一样不含 OpenCV.
- 不参与编辑: 代码补全, 高亮与文档仍以 AutoJs6 为准, AutoJs4 引擎只用于运行.
- 不用于打包: 打包应用 (inrt) 不包含 AutoJs4 引擎.
- 并发上限: 同时最多运行 16 个 AutoJs4 脚本.

---

## com.stardust 兼容类

Auto.js 4 的 Java 类位于 `com.stardust` 包 (如 `com.stardust.pio.PFiles`, `com.stardust.autojs.runtime.api.Files`, `com.stardust.automator.UiObject`), 旧脚本可能直接以这些名字调用静态方法, 构造对象或做 `instanceof` 判断. 自 6.8.0 起, AutoJs6 不再内置这些类的副本, 而是在脚本解析类名时把 `com.stardust` 名字映射到 AutoJs6 的同名实现; 脚本写 `com.stardust.autojs.runtime.api.Files` 得到的就是 `org.autojs.autojs.runtime.api.Files`, 因而 `runtime.files instanceof com.stardust.autojs.runtime.api.Files` 成立, `new com.stardust.pio.PFile(path)` 得到的是 AutoJs6 的 PFile.

- 完整映射 (218 个类): 旧副本中脚本能触及的静态成员, 构造器与实例成员在 AutoJs6 的同名类上都存在, 参数类型按脚本可见的方式兼容 (数值互换, `Object` 对函数等). 包括 `runtime.api` 下的 Files, Images, Device, Dialogs, Events, Threads, Timers, Engines, Shell 等, `pio` 下的 PFiles, PFile 及文本 / 二进制文件类, `core.image` 下的 ImageWrapper, Colors, ColorFinder, ColorDetector, TemplateMatching, `util` 下的 ScreenMetrics, UiHandler, TextUtils, MapBuilder, IntentExtras 等工具类, 以及引擎, 执行, 脚本源等内部类.
- 部分映射 (90 个类): AutoJs6 的同名类覆盖了大部分而非全部成员, 如 UiObject, UiSelector, UiObjectCollection, ScriptRuntime, ConsoleImpl, GlobalConsole, ProjectConfig, 引擎入口类与布局膨胀相关的类; 缺少的成员以 "方法不存在" 报错. 其中 5 个工具类映射到改名后的 AutoJs6 类 (`com.stardust.util.ClipboardUtil` 对应 `ClipboardUtils`, `IntentUtil` 对应 `IntentUtils`, `UnderuseExecutors` 对应 `UnderUseExecutors`, `SdkVersionUtil` 对应 `SdkVersionUtils`, `MimeTypes` 对应 `MimeTypesUtils`), `importClass` 定义的全局名是 AutoJs6 的名字.
- 不再提供 (46 个类): 没有 AutoJs6 对应物的内部类与工具类 (如 `com.stardust.util.Nath`, `com.stardust.automator.UiGlobalSelector`), 脚本写这些名字时得到的是空的包对象.
- 映射只作用于脚本中的类名解析 (`Packages`, 顶层 `com`, `importClass`, `importPackage`); `java.lang.Class.forName("com.stardust...")` 这类按 JVM 类名的查找不受影响, 会抛出 ClassNotFoundException.

完整清单与每个部分映射类缺少的成员见 AutoJs6 仓库的 `docs/dev/stardust-compat-inventory.md`. 这是 AutoJs6 宿主的行为, 与是否安装本插件无关; 用 AutoJs4 引擎运行时, 脚本看到的仍是 AutoJs4 自己的 `com.stardust` 类.

---

## 差异反馈

发现 "AutoJs4 正常而 AutoJs6 异常" 的差异时, 请先排除下列已知的 "特定情况", 再向 [AutoJs6 的 issue 跟踪器](http://issues.autojs6.com) 反馈:

- 包名不同: AutoJs4 为 `org.autojs.autojs4` (插件内为其自身包名), AutoJs6 为 `org.autojs.autojs6`, 依赖包名的脚本行为必然不同.
- Rhino 版本差异带来的语法与内置对象差异 (ES6+ 特性在 AutoJs4 不可用).
- 已在 AutoJs6 中被明确移除或替换的功能 (如 AutoJs4 的打包插件机制).
- `targetSdk 28` 与 AutoJs6 的 `targetSdk` 不同所带来的存储, 后台与权限模型差异.

反馈时请附上: 脚本 (或最小复现片段), 两次运行的控制台输出 (AutoJs4 的输出带 `[AutoJs4]` 前缀), 设备型号与 Android 版本, AutoJs6 与插件的版本号.

---

## 相关链接

- [AutoJs6-Plugin-AutoJs4-Runtime](https://github.com/SuperMonster003/AutoJs6-Plugin-AutoJs4-Runtime): 插件仓库, 含 README 与发行历史.
- [AutoJs4](https://github.com/SuperMonster003/AutoJs4): 被内嵌的引擎项目.
- [AutoJs4-Documentation](https://github.com/SuperMonster003/AutoJs4-Documentation): Auto.js 4.1.0 文档的克隆, 是本文档的参考基准.
- [AutoJs4 Runtime 协议 V1](https://github.com/SuperMonster003/AutoJs6/blob/master/docs/dev/autojs4-runtime-protocol-v1.md): 宿主与插件之间的契约.
