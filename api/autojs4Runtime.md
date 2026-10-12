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

"使用 AutoJs4 运行" 是显式操作. 普通的运行按钮, 定时任务, 快捷方式, 外部意图与打包应用仍由 AutoJs6 自己的引擎执行, 扩展名或文件头指令不会把脚本自动交给 AutoJs4.

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

## 限制

- 不共享权限: 插件的无障碍服务, 悬浮窗, 存储与截图权限都需要单独授予, 不继承 AutoJs6 的授权; Shizuku 不可用于 AutoJs4 引擎.
- 不改变 AutoJs4: 插件原样编译 AutoJs4 的引擎模块, 不修补其脚本语义. `armeabi-v7a` 使用 AutoJs4 原版 OpenCV 3.4.3 原生库; 64 位设备使用同一 OpenCV 版本的重编库; `x86` 与 AutoJs4 一样不含 OpenCV.
- 不参与编辑: 代码补全, 高亮与文档仍以 AutoJs6 为准, AutoJs4 引擎只用于运行.
- 不用于打包: 打包应用 (inrt) 不包含 AutoJs4 引擎.
- 并发上限: 同时最多运行 16 个 AutoJs4 脚本.

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
