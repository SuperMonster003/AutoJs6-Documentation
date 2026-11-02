# ImGui

<!-- runtime-support:begin imgui -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `imgui` | - | - | - |
| 状态 | 已支持 588 项 | 不适用 588 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 588 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 588 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

由 ImGui 插件提供的即时模式界面: 把 [Dear ImGui](https://github.com/ocornut/imgui) 绘制到悬浮窗或 Activity 中, 适合调试面板, 参数调节器, 运行状态 HUD 等轻量界面.

imgui 只能在 Rhino 引擎中调用. **Node.js 与 Bun 没有 imgui 模块**, 这两个运行时用 [engines.execScript](engines#m-execscript) 启动一段 Rhino 脚本来打开窗口, 写法见 [在 Node.js / Bun 中使用](#在-node-js-bun-中使用).

本页内容对应 ImGui 插件 1.18.0 (versionCode 58), 插件内置 Dear ImGui 1.92.9. 插件要求 AutoJs6 6.8.0 (versionCode 5935) 或以上, Android 7.0 (API 24) 或以上, 设备支持 OpenGL ES 3.0.

## 快速开始

在插件中心启用 ImGui 插件后, 脚本直接使用全局对象 `imgui`, 不需要 `plugins.load`. 首次打开悬浮窗时需要授予 AutoJs6 悬浮窗权限.

```js
let enabled = imgui.ref(true);
let volume = imgui.ref(0.5);

imgui.createWindow(function (ui, session) {
    ui.withWindow('面板', null, ui.WindowFlags.NoCollapse, function () {
        ui.text('Dear ImGui ' + ui.version());
        ui.toggle('启用', enabled);
        ui.sliderFloat('音量', volume, 0, 1, '%.2f');
        if (ui.button('关闭')) {
            session.close();
        }
    });
}, { width: 320, height: 220, theme: imgui.Themes.ModernDark });
```

[createWindow](#m-createwindow) 打开一个会话, 之后插件按帧率反复调用传入的渲染回调. 回调中的 `ui` 就是 `imgui` 对象, `session` 是 [ImguiSession](imguiSessionType).

即时模式的控件没有句柄: 每一帧都要重新调用 `ui.button(...)`, 不调用就不显示, 它的返回值告诉你这一帧是否被点按. 状态放在脚本自己的变量里, 需要写回的控件用 [可变值](#mutablevalue).

内置 10 个可运行的示例, 用 [runExample](#m-runexample) 打开, 用 [getExampleSource](#m-getexamplesource) 读取源码:

```js
console.log(imgui.listExamples().join(', '));
imgui.runExample('widget-overview', { autoCloseMs: 3000 });
```

| 示例 | 内容 |
| --- | --- |
| `widget-overview` | 常用控件总览 |
| `parameter-panel` | 参数面板 |
| `log-hud` | 日志窗口 |
| `data-table-demo` | 数据表格 |
| `theme-gallery` | 主题 |
| `error-handling` | 错误处理 |
| `background-task` | 后台任务与取消 |
| `large-list` | 十万行列表与多选 |
| `texture-refresh` | 纹理更新 |
| `multi-window` | 一个会话里的多个窗口 |

## 会话, Surface 与根窗口

| 名称 | 含义 | 数量 |
| --- | --- | --- |
| 会话 ([ImguiSession](imguiSessionType)) | `createWindow`, `launchFloaty`, `launch`, `launchPrivileged` 的返回值 | 同一时间一个 |
| Surface | 会话绘制的 Android 视图或图层 | 每个会话一个 |
| 根窗口 | 由 [begin](#m-begin) 或 [withWindow](#m-withwindow) 打开的 ImGui 窗口, 有自己的标题栏 | 每个会话任意多个 |

AutoJs6 进程里只有一个原生渲染器. 同一脚本新建会话时, 旧会话以 `closeReason` 为 `replaced` 关闭; 其他脚本新建会话时会接管渲染器, 原会话以 `native-context-replaced` 关闭. 屏幕上不能同时有两个 ImGui 悬浮窗, Dear ImGui 的 Docking 与 Multi-Viewport 也没有开放. 需要多个面板时, 在同一个会话里提交多个根窗口:

```js
let logOpen = imgui.ref(true);

imgui.launchFloaty(function (ui) {
    ui.setNextWindowPos(ui.dp(8), ui.dp(8), ui.Cond.FirstUseEver);
    ui.setNextWindowSize(ui.dp(240), ui.dp(160), ui.Cond.FirstUseEver);
    ui.withWindow('控制', null, 0, function () {
        ui.checkbox('显示日志', logOpen);
    });

    if (logOpen.value) {
        ui.setNextWindowPos(ui.dp(8), ui.dp(176), ui.Cond.FirstUseEver);
        ui.setNextWindowSize(ui.dp(240), ui.dp(160), ui.Cond.FirstUseEver);
        ui.withWindow('日志', logOpen, 0, function () {
            ui.text('第二个窗口');
        });
    }
}, { width: 256, height: 344, contentAutoResize: false });
```

`createWindow` 的 `width` 和 `height` 是 Surface 的尺寸, 不是根窗口的尺寸. Surface 会裁剪所有根窗口, 要留够根窗口的位置和用户拖动的范围. 根窗口按名称识别, `'Log##left'` 与 `'Log##right'` 是两个都显示 "Log" 的窗口.

三种窗口模式的差别:

| | 悬浮窗 ([launchFloaty](#m-launchfloaty)) | Activity ([launch](#m-launch)) | 特权层 ([launchPrivileged](#m-launchprivileged)) |
| --- | --- | --- | --- |
| Surface | 在 `x`, `y` 处, `width` x `height` dp, 不超过屏幕 | 整个处于 resumed 状态的 AutoJs6 Activity, `width`, `height`, `x`, `y` 不起作用 | 全屏图层, `width`, `height`, `x`, `y` 不起作用 |
| 根窗口以外的触摸 | 按 `touchMode` 处理 | Activity 接收 | 下层应用接收, 图层只观察 |
| 根窗口上的触摸 | 只到窗口 | 只到窗口 | 窗口和下层应用都收到 |
| `session.collapse()` | 收起到小按钮 | 同左 | 抛出 Error |
| 需要 | 悬浮窗权限 | AutoJs6 有前台 Activity | Shizuku 或 Root, 不需要悬浮窗权限 |

特权层只支持指针输入: 没有按键事件, 注入的指针事件 (`addMousePosEvent` 等) 被忽略, 没有双指捏合, 不能收起, 没有独立的 Android 按钮, 渲染回调内调用 `capture` 会抛出异常. 文本框会打开 AutoJs6 的临时输入框 (需要悬浮窗权限), 输入期间图层隐藏, 文字写到光标处.

## 调用时机

本页每个函数都标有调用时机:

| 标记 | 含义 |
| --- | --- |
| `帧内` | 必须在渲染回调中 (或回调调用的函数里) 同步调用, 否则抛出异常. 一帧的调用要留在打开这一帧的线程上 |
| `会话期` | 需要有活动会话, 不要求在帧内 |
| `脚本线程` | 在创建会话的脚本线程上, 帧外调用 |
| `任何时候` | 不需要会话 |

高层组件 ([logWindow](#m-logwindow), [toast](#m-toast) 等) 由插件在渲染回调之后绘制, 创建和修改它们不需要在帧内.

## 单位

- Android 窗口的几何量 (`createWindow` 的选项, [ImguiSession](imguiSessionType) 的字段, 事件载荷) 单位是 dp.
- 帧内的坐标和尺寸 (位置, 绘制列表, 控件尺寸) 单位是 px, 用 [dp](#m-dp) 换算: `ui.dp(320)`. 反向换算用 [px](#m-px).
- 个别成员有其他单位时会单独写明.

## 线程与回调

一个会话的全部脚本回调都运行在调用 `createWindow` 的脚本线程上: 渲染回调, 高层组件的绘制, 会话事件, 悬浮按钮回调和对话框结果依次运行, 不会同时运行, 所以它们可以不加锁地共享界面状态.

| 回调 | 线程 | 说明 |
| --- | --- | --- |
| 渲染回调 | 脚本线程 | 由补偿定时误差的定时器调度 |
| 高层组件 | 脚本线程 | 在帧内绘制, 位于渲染回调之后 |
| 会话事件 | 脚本线程 | Android UI 线程上发生的事件 (Surface, 拖动, 显示变化, 返回键) 转发到脚本线程, 在两帧之间运行. 脚本线程上发生的事件 (例如 `session.setPosition`) 立即运行 |
| 悬浮按钮 `onClick` / `onMoved` | 脚本线程 | 由收到触摸的 UI 线程转发 |
| 对话框结果 | 脚本线程 | 在关闭对话框的那一帧内解决, Promise 的后续也在同一线程 |
| 触摸, 输入法, 按键 | Android UI 线程 | 不是脚本回调, 进入输入队列, 脚本线程在下一帧开始前取走 |
| `threads.start` | 工作线程 | 不能调用 imgui, 也不能改动可变值或渲染回调读取的对象 |

回调不要阻塞. 回调阻塞时整个会话停止绘制, 不处理输入, 也不运行其他事件. 回调里只改状态, 延迟用 `setTimeout` / `setInterval` (它们也在脚本线程上), 耗时工作放到工作线程. `createWindow({ debug: true })` 时, 运行超过 250 ms 的渲染回调会打印一条 `console.warn`, 最多每 10 秒一次.

工作线程把结果放进线程安全的队列, 由脚本线程取出:

```js
let inbox = new java.util.concurrent.ConcurrentLinkedQueue();
let state = { progress: 0, done: false };

threads.start(function () {
    for (let step = 1; step <= 100; step += 1) {
        sleep(10); // 实际工作.
        inbox.offer(JSON.stringify({ progress: step / 100 }));
    }
    inbox.offer(JSON.stringify({ done: true }));
});

// 与渲染回调一样运行在脚本线程上.
let pump = setInterval(function () {
    let message;
    while ((message = inbox.poll()) !== null) {
        let update = JSON.parse(String(message));
        if (update.done) {
            state.done = true;
        } else {
            state.progress = update.progress;
        }
    }
}, 100);

let session = imgui.createWindow(function (ui) {
    ui.withWindow('任务', null, 0, function () {
        ui.progressBar(state.progress);
        ui.text(state.done ? '完成' : '进行中...');
    });
});
session.on('closed', function () {
    clearInterval(pump);
});
```

## 错误

- 参数类型错误, 为 NaN 或超出范围时抛出 TypeError 或 RangeError, 错误信息写明函数和参数.
- 渲染回调抛出异常时: 有 `error` 监听器则跳过这一帧余下的部分, 会话继续; 没有则会话以 `closeReason` 为 `render-error` 关闭. 事件回调抛出的异常也触发 `error` 事件, 详见 [SessionErrorEvent](imguiSessionType#sessionerrorevent).
- `begin` 与 `end` 这类成对调用缺了一半时, Dear ImGui 会在帧末恢复, `debug` 模式下打印警告.

## 限制

固定的上限可从 [Limits](#p-limits) 读取, 不要在脚本里写死数字.

| 项目 | 上限 | 超出时 |
| --- | --- | --- |
| `inputText` / `inputTextMultiline` 容量 | 65536 字节 | RangeError |
| `combo` / `listBox` 项数 | 512 | RangeError, 不会截断. 大列表用 `beginCombo` 或 `beginListBox` 加 [listClipper](#m-listclipper) |
| 输入队列 | 2048 个事件 | 丢弃最旧的事件 |
| 附加字体 | 16 个 | `createWindow` 拒绝 |
| 绘制列表的点数 | 每次 4096 个 | 拒绝 |
| 路径圆弧 | 每次 16 圈 | RangeError |
| 拖放载荷 | JSON 65536 字节, 类型名 32 字节 | RangeError |
| 编码后的纹理来源 | 128 MiB | 解码前拒绝 |
| 解码后的纹理面积 | 3200 万像素 | 上传前拒绝 |

内置 CJK 字体有 8284 个码位: 常用简体中文 (GB 2312 的 6763 个汉字), 假名和 CJK 标点. 繁体专用字, 生僻字和韩文音节显示为 `?`. `createWindow({ systemCjkFont: true })` 让 Android 按需绘制缺少的字符. 超出 BMP 的字符无法显示.

Android 10 起系统限制读取剪贴板, 详见 [getClipboardText](#m-getclipboardtext).

## 在 Node.js / Bun 中使用

imgui 只能在 Rhino 引擎中调用. 控件函数要在帧内同步返回结果 (例如 `if (ui.button('确定'))`), 一帧的调用必须留在打开该帧的线程上, 而 Node.js 与 Bun 的宿主调用都返回 Promise, ImGui 插件本身也运行在 Rhino 中, 所以这两个运行时 (含 Worker) 没有 imgui 模块.

需要窗口时, 用 [engines.execScript](engines#m-execscript) 启动一段 Rhino 脚本来打开窗口. 帧回调在这段脚本中运行, 写法与普通 Rhino 脚本相同, 两个脚本用 [events.broadcast](events#events-broadcast-脚本间广播) 通信.

Node.js:

```js
"nodejs";

let engines = require('engines');
let events = require('autojs6:events');

let panel = String.raw`"rhino";
let progress = 0;
let session = imgui.createWindow(function (ui) {
    ui.withWindow(engines.myEngine().execArgv.title, null, 0, function () {
        ui.progressBar(progress);
        if (ui.button('取消')) {
            events.broadcast.emit('panel.cancel');
        }
    });
}, { width: 280, height: 140 });
session.on('closed', function () {
    events.broadcast.emit('panel.closed');
});
events.broadcast.on('panel.progress', function (value) {
    progress = value;
});
events.broadcast.on('panel.close', function () {
    session.close();
});
// createWindow 在窗口就绪后才返回, 监听器也已注册.
events.broadcast.emit('panel.ready');
`;

(async () => {
    let cancelled = false;
    let ready = new Promise(resolve => events.broadcast.once('panel.ready', resolve));
    let closed = new Promise(resolve => events.broadcast.once('panel.closed', resolve));
    events.broadcast.on('panel.cancel', () => cancelled = true);
    // emit 在订阅生效后才发送, 所以之后启动的面板不会错过 panel.ready.
    await events.broadcast.emit('panel.starting');

    await engines.execScript('panel', panel, { arguments: { title: '任务进度' } });
    await ready;
    for (let step = 1; step <= 5 && !cancelled; step += 1) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 实际工作.
        await events.broadcast.emit('panel.progress', step / 5);
    }
    await events.broadcast.emit('panel.close');
    await closed;
    events.broadcast.removeAllListeners();
    console.log(cancelled ? '已取消' : '已完成');
})();
```

Bun 只有开头不同, 其余代码相同:

```js
"bun";

let { createHostClient } = await import(process.env.AUTOJS6_HOST_CLIENT_MODULE);
let { engines, events } = await createHostClient();
```

运行前的准备:

- 在插件中心启用 ImGui 插件, 并授予 AutoJs6 悬浮窗权限.
- Node.js 项目在 project.json 的 `node.permissions` 中声明 `engines`, `engines.exec` 和 `events`.
- Bun 在插件中心开启 `engines.control`, `engines.exec` 和 `events.observe`, 打包项目在 `bun.hostCapabilities` 中声明.

行为说明:

| 事项 | 行为 |
| --- | --- |
| 启动 | `execScript` 在 Rhino 脚本启动后即返回, 该脚本是独立的执行, 可在 `engines.all()` 中看到. `timeoutMs` 只限制启动调用, 不限制窗口的运行时长 |
| 就绪 | `createWindow` 在窗口就绪后才返回, 此时 `ready` 事件已经触发过, 之后用 `session.on` 注册的监听器收不到它. 所以示例在注册完监听器后直接广播 `panel.ready` |
| 传参 | `arguments` 的值只能是字符串, 数字, 布尔值或 `null`, 在 Rhino 脚本中用 `engines.myEngine().execArgv` 读取. 值为对象时调用被拒绝 |
| 广播的值 | 字符串, 数字, 布尔值, `null`, 对象和数组在两个方向上都可以直接传, 到达后是接收方自己的值. 函数, `undefined` 和循环引用的规则见 [events.broadcast](events#m-emit) |
| 结束 | 主脚本结束时窗口不会关闭, Rhino 脚本继续运行, 所以主脚本退出前要发送关闭广播. 窗口关闭后 Rhino 脚本自行结束. 广播监听器会让主脚本保持运行, 所以示例最后移除全部监听器 |
| 多个窗口 | AutoJs6 进程只有一个渲染器, 其他脚本打开新窗口时会接管它, 当前窗口随之关闭. 需要多个窗口时, 在同一段 Rhino 脚本中创建多个根窗口 |

# 窗口与生命周期

打开和关闭会话, 以及作用于当前活动会话的快捷函数. 这些快捷函数的返回值是会话本身, 没有活动会话时抛出 Error (错误信息如 `imgui.setSecure: no active session`). 也可以直接调用 [ImguiSession](imguiSessionType) 上的同名方法.

## [m] createWindow

### imgui.createWindow(renderCallback, options?)

**`脚本线程`**

- **renderCallback** { [RenderCallback](imgui#rendercallback) } - 绘制一帧的函数, 参数为 `ui` 和 `session`. 不要在其中阻塞.
- **[ options ]** { [WindowOptions](imgui#windowoptions) } - 窗口选项, 参阅 [WindowOptions](#windowoptions).
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) } - 新建的会话.

打开一个窗口会话并返回 [ImguiSession](imguiSessionType). 在脚本线程上, 帧外调用. 同一脚本引擎只有一个会话, 新会话会关闭旧会话.

函数在窗口就绪后才返回. `ready` 事件在返回之前同步触发, 要接收它请用 `options.onReady` 或 `options.events`. 插件 1.18.0 及更早版本中, 返回之后才注册的 `session.on('ready', ...)` 收不到这个事件, 这些版本请用 `createWindow` 的 `onReady` / `events` 选项.

脚本没有其他事情可做时, 窗口存续期间脚本引擎保持运行, 窗口关闭后脚本结束.

```js
let session = imgui.createWindow(function (ui) {
    ui.withWindow('状态', null, 0, function () {
        ui.text('帧率: ' + ui.framerate().toFixed(1));
    });
}, {
    width: 280,
    height: 160,
    onReady: function (event) {
        console.log('窗口就绪: ' + event.width + ' x ' + event.height + ' dp');
    },
    onClosed: function (event) {
        console.log('窗口关闭: ' + event.reason);
    },
});
session.setPosition(16, 96);
```

## [m] launchFloaty

### imgui.launchFloaty(renderCallback, options?)

**`脚本线程`**

- **renderCallback** { [RenderCallback](imgui#rendercallback) } - 绘制一帧的回调, 在脚本线程上运行.
- **[ options ]** { [WindowOptions](imgui#windowoptions) } - 窗口选项, 参阅 [WindowOptions](#windowoptions).
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) } - 新建的会话.

以 `mode: 'overlay'` 调用 [createWindow](#m-createwindow): 透明悬浮窗. 需要 AutoJs6 的悬浮窗权限.

## [m] launch

### imgui.launch(renderCallback, options?)

**`脚本线程`**

- **renderCallback** { [RenderCallback](imgui#rendercallback) } - 绘制一帧的回调, 在脚本线程上运行.
- **[ options ]** { [WindowOptions](imgui#windowoptions) } - 窗口选项, 参阅 [WindowOptions](#windowoptions).
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) } - 新建的会话.

以 `mode: 'activity'` 调用 [createWindow](#m-createwindow): 在当前处于 resumed 状态的 AutoJs6 Activity 中全屏绘制. 脚本需要脱离前台 Activity 继续渲染时用 [launchFloaty](#m-launchfloaty).

Android 重建这个 Activity (显示密度或字体大小改变) 时, 会话以 `closeReason` 为 `configuration-changed` 关闭, 需要时在 `closed` 监听器里重新创建. 返回键见 [back](imguiSessionType#sessionbackevent) 事件.

## [m] launchPrivileged

### imgui.launchPrivileged(renderCallback, options?)

**`脚本线程`**

- **renderCallback** { [RenderCallback](imgui#rendercallback) } - 绘制一帧的回调, 在脚本线程上运行.
- **[ options ]** { [WindowOptions](imgui#windowoptions) } - 窗口选项, `backend` 选择启动方式, 参阅 [WindowOptions](#windowoptions).
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) } - 新建的会话.

以 `mode: 'privileged'` 调用 [createWindow](#m-createwindow): 经 AutoJs6 已配置的 Shizuku 或 Root 启动全屏的特权图层. 不需要悬浮窗权限, 下层应用会收到每一次触摸. 限制见 [会话, Surface 与根窗口](#会话-surface-与根窗口).

用 [getBackendCapabilities](#m-getbackendcapabilities) 判断设备是否可用. OEM 的 SurfaceControl 或 SELinux 策略仍可能拒绝启动.

## [m] closeWindow

### imgui.closeWindow()

**`任何时候`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭活动会话, 没有活动会话时什么也不做.

## [m] addButtonEx

### imgui.addButtonEx(label, callback, options?)

**`会话期`**

- **label** { [any](dataTypes#any) } - 按钮文字.
- **callback** { [Function](dataTypes#function) } - 点按时在脚本线程上调用.
- **[ options ]** { [FloatingButtonOptions](imguiFloatingButtonType#floatingbuttonoptions) } - 按钮选项, 参阅 [FloatingButtonOptions](imguiFloatingButtonType#floatingbuttonoptions).
- <ins>**returns**</ins> { [ImguiFloatingButton](imguiFloatingButtonType) }

在活动会话上添加一个独立的 Android 悬浮按钮, 等同 [session.addButtonEx](imguiSessionType#m-addbuttonex).

## [m] setTouchable

### imgui.setTouchable(touchMode)

**`会话期`**

- **touchMode** { [TouchMode](imgui#p-touchmode) | [boolean](dataTypes#boolean) } - [TouchMode](#p-touchmode) 的值. `true` 相当于 `Touchable`, `false` 相当于 `Passthrough`.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

等同 [session.setTouchable](imguiSessionType#m-settouchable), 改变悬浮窗接收哪些触摸.

## [m] setMoreTouch

### imgui.setMoreTouch(enabled)

**`会话期`**

- **enabled** { [boolean](dataTypes#boolean) } - 是否开启.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

等同 [session.setMoreTouch](imguiSessionType#m-setmoretouch), 让窗口上的触摸同时到达下层应用.

## [m] setGlobalAlpha

### imgui.setGlobalAlpha(alpha)

**`会话期`**

- **alpha** { [number](dataTypes#number) } - 不透明度, `0..1`.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

等同 [session.setAlpha](imguiSessionType#m-setalpha), 设置整个窗口的不透明度. 这是 Android 窗口的属性, 与 Dear ImGui 的样式变量 `Alpha` 无关.

## [m] setSecure

### imgui.setSecure(secure)

**`会话期`**

- **secure** { [boolean](dataTypes#boolean) } - 是否开启 `FLAG_SECURE`.
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

等同 [session.setSecure](imguiSessionType#m-setsecure), 开关 `FLAG_SECURE`, 开启后窗口不出现在截图中.

## [m] collapseWindow

### imgui.collapseWindow()

**`会话期`**

- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

等同 [session.collapse](imguiSessionType#m-collapse), 把整个 Surface 收起到小按钮. 特权层抛出 Error. 要折叠单个根窗口用 [setNextWindowCollapsed](#m-setnextwindowcollapsed).

## [m] expandWindow

### imgui.expandWindow()

**`会话期`**

- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) }

等同 [session.expand](imguiSessionType#m-expand), 从小按钮恢复.

## [m] getComponent

### imgui.getComponent(type, id)

**`会话期`**

- **type** { [string](dataTypes#string) } - 组件类型: `logWindow`, `toast`, `dialog`, `statsOverlay` 或 `dataTable`.
- **id** { [string](dataTypes#string) } - 组件 ID.
- <ins>**returns**</ins> { [ImguiComponent](imguiComponentType) | [null](dataTypes#null) } - 没有这个组件时返回 `null`.

读取活动会话的高层组件, 等同 [session.getComponent](imguiSessionType#m-getcomponent). 没有活动会话时抛出 Error.

# 高层组件与对话框

会话托管的现成组件, 由插件在渲染回调之后绘制, 不需要在帧内调用, 也不需要自己维护 `begin` / `end`. 组件的共同成员见 [ImguiComponent](imguiComponentType). 这些函数作用于活动会话, [ImguiSession](imguiSessionType) 上有同名方法.

对话框返回 [ImguiDialogPromise](imguiDialogPromiseType), 下一帧打开, 结果在脚本线程上解决.

```js
imgui.createWindow(function (ui) {
    ui.withWindow('任务', null, 0, function () {
        ui.text('组件在窗口之外绘制');
    });
}, { width: 360, height: 320 });

let log = imgui.logWindow('运行日志', { height: 160 });
log.info('开始');
imgui.toast('已连接', 1500);
imgui.confirm('继续', '要继续吗?').then(function (accepted) {
    log.info(accepted ? '确定' : '取消');
});
```

## [m] logWindow

### imgui.logWindow(id?, options?)

**`会话期`**

- **[ id = 'default' ]** { [string](dataTypes#string) } - 组件 ID.
- **[ options ]** { [LogWindowOptions](imguiLogWindowType#logwindowoptions) } - 选项, 参阅 [LogWindowOptions](imguiLogWindowType#logwindowoptions).
- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

返回这个 ID 的日志窗口, 第一次调用时创建. 等同 [session.logWindow](imguiSessionType#m-logwindow).

## [m] toast

### imgui.toast(text, duration?, options?)

**`会话期`**

- **text** { [any](dataTypes#any) } - 消息文字.
- **[ duration = 2500 ]** { [number](dataTypes#number) | [ToastOptions](imguiToastType#toastoptions) } - 显示时长, 单位 ms, `0` 表示一直显示到关闭. 也可以直接传选项对象.
- **[ options ]** { [ToastOptions](imguiToastType#toastoptions) } - 选项, 参阅 [ToastOptions](imguiToastType#toastoptions).
- <ins>**returns**</ins> { [ImguiToast](imguiToastType) }

显示一条短消息, 等同 [session.toast](imguiSessionType#m-toast). 使用已显示消息的 `id` 时更新那条消息.

## [m] alert

### imgui.alert(title, message, options?)

**`会话期`** **`Overload 1/2`**

- **title** { [string](dataTypes#string) } - 标题.
- **message** { [string](dataTypes#string) } - 正文.
- **[ options ]** { [DialogOptions](imguiDialogType#dialogoptions) } - 选项, 参阅 [DialogOptions](imguiDialogType#dialogoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

### imgui.alert(message, options?)

**`会话期`** **`Overload 2/2`**

- **message** { [any](dataTypes#any) } - 正文.
- **[ options ]** { [DialogOptions](imguiDialogType#dialogoptions) } - 选项, 参阅 [DialogOptions](imguiDialogType#dialogoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

打开带确定按钮的模态消息. 结果: 点确定为 `true`, 对话框被关闭为 `false`.

## [m] confirm

### imgui.confirm(title, message, options?)

**`会话期`** **`Overload 1/2`**

- **title** { [string](dataTypes#string) } - 标题.
- **message** { [string](dataTypes#string) } - 正文.
- **[ options ]** { [DialogOptions](imguiDialogType#dialogoptions) } - 选项, 参阅 [DialogOptions](imguiDialogType#dialogoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

### imgui.confirm(message, options?)

**`会话期`** **`Overload 2/2`**

- **message** { [any](dataTypes#any) } - 正文.
- **[ options ]** { [DialogOptions](imguiDialogType#dialogoptions) } - 选项, 参阅 [DialogOptions](imguiDialogType#dialogoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

打开带确定和取消按钮的模态询问. 结果: 点确定为 `true`, 点取消或对话框被关闭为 `false`.

## [m] singleChoice

### imgui.singleChoice(title, items, selected?, options?)

**`会话期`** **`Overload 1/3`**

- **title** { [string](dataTypes#string) } - 标题.
- **items** { [any](dataTypes#any)[] } - 列表项, 每项用 `String()` 显示, 带 `label` 属性时显示该属性.
- **[ selected = -1 ]** { [number](dataTypes#number) | [null](dataTypes#null) } - 初始选中的索引.
- **[ options ]** { [SingleChoiceOptions](imguiDialogType#singlechoiceoptions) } - 选项, 参阅 [SingleChoiceOptions](imguiDialogType#singlechoiceoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

### imgui.singleChoice(items, selected?, options?)

**`会话期`** **`Overload 2/3`**

- **items** { [any](dataTypes#any)[] } - 列表项, 每项用 `String()` 显示, 带 `label` 属性时显示该属性.
- **[ selected = -1 ]** { [number](dataTypes#number) | [null](dataTypes#null) } - 初始选中的索引.
- **[ options ]** { [SingleChoiceOptions](imguiDialogType#singlechoiceoptions) } - 选项, 参阅 [SingleChoiceOptions](imguiDialogType#singlechoiceoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

### imgui.singleChoice(items, options)

**`会话期`** **`Overload 3/3`**

- **items** { [any](dataTypes#any)[] } - 列表项, 每项用 `String()` 显示, 带 `label` 属性时显示该属性.
- **options** { [SingleChoiceOptions](imguiDialogType#singlechoiceoptions) } - 选项, 参阅 [SingleChoiceOptions](imguiDialogType#singlechoiceoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

打开模态列表, 选一行. 结果: 所选行的索引, 取消或对话框被关闭时为 `-1`.

## [m] multiChoice

### imgui.multiChoice(title, items, selected?, options?)

**`会话期`** **`Overload 1/3`**

- **title** { [string](dataTypes#string) } - 标题.
- **items** { [any](dataTypes#any)[] } - 列表项, 每项用 `String()` 显示, 带 `label` 属性时显示该属性.
- **[ selected ]** { [number](dataTypes#number)[] | [boolean](dataTypes#boolean)[] | [null](dataTypes#null) } - 初始选中的索引, 或每项一个布尔值.
- **[ options ]** { [MultiChoiceOptions](imguiDialogType#multichoiceoptions) } - 选项, 参阅 [MultiChoiceOptions](imguiDialogType#multichoiceoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

### imgui.multiChoice(items, selected?, options?)

**`会话期`** **`Overload 2/3`**

- **items** { [any](dataTypes#any)[] } - 列表项, 每项用 `String()` 显示, 带 `label` 属性时显示该属性.
- **[ selected ]** { [number](dataTypes#number)[] | [boolean](dataTypes#boolean)[] | [null](dataTypes#null) } - 初始选中的索引, 或每项一个布尔值.
- **[ options ]** { [MultiChoiceOptions](imguiDialogType#multichoiceoptions) } - 选项, 参阅 [MultiChoiceOptions](imguiDialogType#multichoiceoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

### imgui.multiChoice(items, options)

**`会话期`** **`Overload 3/3`**

- **items** { [any](dataTypes#any)[] } - 列表项, 每项用 `String()` 显示, 带 `label` 属性时显示该属性.
- **options** { [MultiChoiceOptions](imguiDialogType#multichoiceoptions) } - 选项, 参阅 [MultiChoiceOptions](imguiDialogType#multichoiceoptions).
- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

打开模态的复选列表. 结果: 勾选行的索引数组, 取消或对话框被关闭时为 `null`.

## [m] statsOverlay

### imgui.statsOverlay(id?, options?)

**`会话期`**

- **[ id = 'default' ]** { [string](dataTypes#string) | [StatsOverlayOptions](imguiStatsOverlayType#statsoverlayoptions) } - 组件 ID, 也可以直接传选项对象.
- **[ options ]** { [StatsOverlayOptions](imguiStatsOverlayType#statsoverlayoptions) } - 选项, 参阅 [StatsOverlayOptions](imguiStatsOverlayType#statsoverlayoptions).
- <ins>**returns**</ins> { [ImguiStatsOverlay](imguiStatsOverlayType) }

返回这个 ID 的帧率覆盖层, 第一次调用时创建. 等同 [session.statsOverlay](imguiSessionType#m-statsoverlay).

## [m] dataTable

### imgui.dataTable(id, headers, rows, options?)

**`会话期`**

- **id** { [string](dataTypes#string) } - 组件 ID.
- **headers** { [DataTableHeaderLike](imguiDataTableType#datatableheader)[] } - 列定义, 参阅 [DataTableHeader](imguiDataTableType#datatableheader).
- **rows** { [any](dataTypes#any)[] } - 初始的行.
- **[ options ]** { [DataTableOptions](imguiDataTableType#datatableoptions) } - 选项, 参阅 [DataTableOptions](imguiDataTableType#datatableoptions).
- <ins>**returns**</ins> { [ImguiDataTable](imguiDataTableType) }

返回这个 ID 的表格窗口, 第一次调用时创建. 等同 [session.dataTable](imguiSessionType#m-datatable).

# 帧内容器

成对调用的容器: `begin*` 打开, `end*` 关闭. 除 [begin](#m-begin) 与 [beginChild](#m-beginchild) 外, 只有 `begin*` 返回 `true` 时才调用对应的 `end*`. [with* 作用域](#with-作用域) 替你配对, 异常时也能正确关闭, 一般优先用它们.

## 根窗口

根窗口有标题栏, 用户可以拖动标题栏移动, 拖动角落改变大小. 标题栏的箭头把窗口折叠到标题栏, 此时 `begin` 返回 `false`, `end` 仍然要调用.

关闭按钮本身不隐藏窗口. 布尔值变为 `false` 后仍然提交的窗口还在屏幕上, 所以先判断它:

```js
let open = imgui.ref(true);

imgui.createWindow(function (ui) {
    if (open.value) {
        ui.withWindow('工具', open, 0, function () {
            ui.text('点按标题栏的 x');
        });
    } else {
        ui.withWindow('主窗口', null, 0, function () {
            if (ui.button('打开工具窗口')) {
                open.value = true;
            }
        });
    }
}, { width: 280, height: 200 });
```

点按根窗口时它获得焦点并移到最前面. 渲染回调中的调用顺序只决定首次的层次. `WindowFlags.NoBringToFrontOnFocus` 让窗口点按后留在原位, `WindowFlags.NoFocusOnAppearing` 让新窗口不抢焦点. 文本输入和注入的按键发给有焦点的窗口.

## [m] begin

### imgui.begin(name, open?, flags?)

**`帧内`**

- **name** { [string](dataTypes#string) } - 窗口名称, 同时是窗口的 ID. 同一帧用相同名称会追加到同一个窗口.
- **[ open ]** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) } - 可变布尔值, 非空时显示关闭按钮. 不要关闭按钮时传 `null`.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [WindowFlags](#p-windowflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 窗口未折叠且可见时为 `true`.

打开根窗口. 无论返回什么, 都要调用 [end](#m-end).

## [m] end

### imgui.end()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭 [begin](#m-begin) 打开的窗口.

## [m] beginChild

### imgui.beginChild(id, width?, height?, borders?, flags?)

**`帧内`**

- **id** { [string](dataTypes#string) } - 子窗口的 ID.
- **[ width = 0 ]** { [number](dataTypes#number) } - 宽度, 单位 px, `0` 填满剩余空间.
- **[ height = 0 ]** { [number](dataTypes#number) } - 高度, 单位 px, `0` 填满剩余空间.
- **[ borders ]** { [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 布尔值表示是否显示边框, 数字为 [ChildFlags](#p-childflags) 的组合.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [WindowFlags](#p-windowflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 子窗口可见时为 `true`.

打开子窗口. 无论返回什么, 都要调用 [endChild](#m-endchild).

## [m] endChild

### imgui.endChild()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭 [beginChild](#m-beginchild) 打开的子窗口.

## [m] setNextWindowPos

### imgui.setNextWindowPos(x, y, condition?, pivotX?, pivotY?)

**`帧内`**

- **x** { [number](dataTypes#number) } - 相对 Surface 的横坐标, 单位 px.
- **y** { [number](dataTypes#number) } - 相对 Surface 的纵坐标, 单位 px.
- **[ condition = 0 ]** { [number](dataTypes#number) } - [Cond](#p-cond) 的值, `0` 相当于 `Always`.
- **[ pivotX = 0 ]** { [number](dataTypes#number) } - 窗口内作为定位点的横向比例, `0..1`.
- **[ pivotY = 0 ]** { [number](dataTypes#number) } - 窗口内作为定位点的纵向比例, `0..1`.
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置下一个 `begin` 的窗口位置. `Cond.FirstUseEver` 只设置一次, 之后交给用户; `Cond.Always` 每帧固定, 用户不能再移动它. 关闭会话后位置不保留, 除非用 `iniPath` 选项保存.

## [m] setNextWindowSize

### imgui.setNextWindowSize(width, height, condition?)

**`帧内`**

- **width** { [number](dataTypes#number) } - 宽度, 单位 px, `0` 按内容适配这一边.
- **height** { [number](dataTypes#number) } - 高度, 单位 px, `0` 按内容适配这一边.
- **[ condition = 0 ]** { [number](dataTypes#number) } - [Cond](#p-cond) 的值, `0` 相当于 `Always`.
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置下一个 `begin` 的窗口大小.

## [m] setNextWindowSizeConstraints

### imgui.setNextWindowSizeConstraints(minWidth, minHeight, maxWidth, maxHeight)

**`帧内`**

- **minWidth** { [number](dataTypes#number) } - 最小宽度, 单位 px.
- **minHeight** { [number](dataTypes#number) } - 最小高度, 单位 px.
- **maxWidth** { [number](dataTypes#number) } - 最大宽度, 单位 px.
- **maxHeight** { [number](dataTypes#number) } - 最大高度, 单位 px.
- <ins>**returns**</ins> { [void](dataTypes#void) }

限制下一个窗口的大小. 某一边传 `-1` 时保持这一边的当前大小.

## [m] setNextWindowBgAlpha

### imgui.setNextWindowBgAlpha(alpha)

**`帧内`**

- **alpha** { [number](dataTypes#number) } - 不透明度, `0..1`.
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置下一个窗口背景的不透明度.

## [m] setNextWindowFocus

### imgui.setNextWindowFocus()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

让这一帧下一个根窗口 (`begin` 或 `withWindow`) 获得焦点并移到最前面. 只调用一次: 每帧都调用会不断从用户那里抢走焦点. 带 `NoBringToFrontOnFocus` 的窗口获得焦点但位置不变, 模态弹窗保持在它上方.

## [m] setNextWindowCollapsed

### imgui.setNextWindowCollapsed(collapsed, condition?)

**`帧内`**

- **collapsed** { [boolean](dataTypes#boolean) } - 是否折叠.
- **[ condition = 0 ]** { [number](dataTypes#number) } - [Cond](#p-cond) 的值. `Always` (`0`, 默认) 每次调用都生效, 所以每帧调用会盖过标题栏的箭头; `Once` 每个会话一次; `Appearing` 在窗口每次出现时; `FirstUseEver` 只对没有保存设置的窗口.
- <ins>**returns**</ins> { [void](dataTypes#void) }

折叠或展开这一帧下一个根窗口. `WindowFlags.NoCollapse` 只去掉箭头, 不影响这个调用.

## 标签页

```js
imgui.createWindow(function (ui) {
    ui.withWindow('设置', null, 0, function () {
        ui.withTabBar('tabs', 0, function () {
            ui.withTabItem('常规', null, 0, function () {
                ui.text('常规设置');
            });
            ui.withTabItem('高级', null, 0, function () {
                ui.text('高级设置');
            });
        });
    });
}, { width: 280, height: 180 });
```

## [m] beginTabBar

### imgui.beginTabBar(id, flags?)

**`帧内`**

- **id** { [string](dataTypes#string) } - 标签栏的 ID.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [TabBarFlags](#p-tabbarflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 标签栏可见时为 `true`.

打开标签栏. 返回 `true` 时调用 [endTabBar](#m-endtabbar).

## [m] endTabBar

### imgui.endTabBar()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭标签栏.

## [m] beginTabItem

### imgui.beginTabItem(label, open?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **[ open ]** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) } - 可变布尔值, 非空时显示关闭按钮. 不要时传 `null`.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [TabItemFlags](#p-tabitemflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 标签被选中时为 `true`.

打开一个标签. 这个标签被选中时返回 `true`, 此时调用 [endTabItem](#m-endtabitem).

## [m] endTabItem

### imgui.endTabItem()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭标签.

## 树与折叠

## [m] collapsingHeader

### imgui.collapsingHeader(label, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [TreeNodeFlags](#p-treenodeflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 展开时为 `true`.

绘制折叠标题. 展开时返回 `true`, 不需要配对的结束调用.

## [m] treeNode

### imgui.treeNode(label)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 节点展开时为 `true`.

绘制树节点. 返回 `true` 时调用 [treePop](#m-treepop).

## [m] treeNodeEx

### imgui.treeNodeEx(label, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [TreeNodeFlags](#p-treenodeflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 节点展开时为 `true`.

带标志的 [treeNode](#m-treenode).

## [m] treePop

### imgui.treePop()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭树节点.

## 列表, 下拉框与长列表

`combo` 和 `listBox` 最多 512 项. 更大的数据用 `beginCombo` / `beginListBox` / 子窗口加 [listClipper](#m-listclipper), 每帧的开销只取决于可见行数.

```js
let allItems = [];
for (let i = 0; i < 5000; i += 1) {
    allItems.push('行 ' + i);
}
let selected = 0;

imgui.createWindow(function (ui) {
    ui.withWindow('列表', null, 0, function () {
        if (ui.beginCombo('行', allItems[selected])) {
            // includeItems 让选中的行保持提交, 弹出时才能滚动到它.
            ui.listClipper(allItems.length, { includeItems: [selected] }, function (start, end) {
                for (let i = start; i < end; i += 1) {
                    if (ui.selectable(allItems[i] + '##' + i, i === selected)) {
                        selected = i;
                    }
                    if (i === selected && ui.isWindowAppearing()) {
                        ui.setScrollHereY(0.5);
                    }
                }
            });
            ui.endCombo();
        }
    });
}, { width: 300, height: 240 });
```

## [m] beginListBox

### imgui.beginListBox(label, width?, height?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **[ width = 0 ]** { [number](dataTypes#number) } - 宽度, 单位 px.
- **[ height = 0 ]** { [number](dataTypes#number) } - 高度, 单位 px.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 列表框可见时为 `true`.

打开列表框. 返回 `true` 时调用 [endListBox](#m-endlistbox).

## [m] endListBox

### imgui.endListBox()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭列表框.

## [m] beginCombo

### imgui.beginCombo(label, preview?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **[ preview ]** { [any](dataTypes#any) } - 未展开时显示的文字.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [ComboFlags](#p-comboflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 下拉框弹出时为 `true`.

打开内容不限的下拉框. 弹出时返回 `true`, 此时调用 [endCombo](#m-endcombo).

## [m] endCombo

### imgui.endCombo()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭下拉框.

## [m] listClipper

### imgui.listClipper(itemCount, callback)

**`帧内`** **`Overload 1/2`**

- **itemCount** { [number](dataTypes#number) } - 总行数.
- **callback** { [Function](dataTypes#function) } - 绘制一段可见行, 参数为 `start` 和 `end`.
- <ins>**returns**</ins> { [void](dataTypes#void) }

### imgui.listClipper(itemCount, options, callback)

**`帧内`** **`Overload 2/2`**

- **itemCount** { [number](dataTypes#number) } - 总行数.
- **options** { [ListClipperOptions](imgui#listclipperoptions) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 选项, 参阅 [ListClipperOptions](#listclipperoptions).
- **callback** { [Function](dataTypes#function) } - 绘制一段可见行, 参数为 `start` 和 `end`.
- <ins>**returns**</ins> { [void](dataTypes#void) }

只提交长列表的可见行 (Dear ImGui 的 ListClipper). 回调按可见范围运行一次或多次, 绘制 `start <= i < end` 的行. 回调抛出异常时也会正确结束.

## [m] beginMultiSelect

### imgui.beginMultiSelect(flags?, selectionSize?, itemsCount?)

**`帧内`**

- **[ flags = 0 ]** { [number](dataTypes#number) } - [MultiSelectFlags](#p-multiselectflags) 的组合.
- **[ selectionSize = -1 ]** { [number](dataTypes#number) } - 已选中的项数, 未知时 `-1`. 为 `0` 时 `ClearOnEscape` 不占用 Escape 键.
- **[ itemsCount = -1 ]** { [number](dataTypes#number) } - 总项数, 未知时 `-1`. 用 `selectionStorage` 全选时需要它.
- <ins>**returns**</ins> { [ImguiMultiSelectIO](imguiMultiSelectIOType) } - 本帧的请求, 其中只有 `setAll`.

开始多选作用域: 点按选中, Ctrl+点按切换, Shift+点按选范围, Ctrl+A 全选, 范围可以跨越没有提交的行.

Dear ImGui 不保存选择. 在提交行之前应用本函数结果的 `requests`, 提交行之后应用 [endMultiSelect](#m-endmultiselect) 结果的 `requests`, 用 [selectionStorage](#m-selectionstorage) 最方便. 作用域内每个可选项之前调用 [setNextItemSelectionUserData](#m-setnextitemselectionuserdata). 配合 `listClipper` 时传 `includeItems: [io.rangeSrcItem, io.navIdItem]`. 同一窗口的两个作用域要用不同的 ID ([pushId](#m-pushid)), 用到 `ClearOnClickVoid` 或框选时再加 `ScopeRect`.

手机没有 Ctrl 和 Shift, 可以用 [addKeyEvent](#m-addkeyevent) 按住 `Key.ModCtrl`, 或者用 `checkbox` 行加 `NoAutoSelect | NoAutoClear`.

```js
let allItems = [];
for (let i = 0; i < 1000; i += 1) {
    allItems.push('行 ' + i);
}
let selection = imgui.selectionStorage();

imgui.createWindow(function (ui) {
    ui.withWindow('多选', null, 0, function () {
        ui.text('已选 ' + selection.size + ' 行');
        ui.withChild('rows', 0, 0, true, 0, function () {
            let scope = ui.beginMultiSelect(ui.MultiSelectFlags.ClearOnEscape, selection.size, allItems.length);
            selection.apply(scope);
            ui.listClipper(allItems.length, { includeItems: [scope.rangeSrcItem, scope.navIdItem] }, function (start, end) {
                for (let i = start; i < end; i += 1) {
                    ui.setNextItemSelectionUserData(i);
                    ui.selectable(allItems[i] + '##' + i, selection.has(i));
                }
            });
            selection.apply(ui.endMultiSelect());
        });
    });
}, { width: 300, height: 300 });
```

## [m] endMultiSelect

### imgui.endMultiSelect(rangeSrcReset?)

**`帧内`**

- **[ rangeSrcReset ]** { [boolean](dataTypes#boolean) } - 忘记 Shift 的锚点, 删除选中项之后使用.
- <ins>**returns**</ins> { [ImguiMultiSelectIO](imguiMultiSelectIOType) } - 行上报的请求.

结束 [beginMultiSelect](#m-beginmultiselect) 的作用域. 必须在同一窗口内调用, 否则抛出 IllegalStateException. 窗口结束时仍未关闭的作用域会被自动关闭.

## [m] selectionStorage

### imgui.selectionStorage()

**`任何时候`**

- <ins>**returns**</ins> { [ImguiSelectionStorage](imguiSelectionStorageType) } - 新建的选择.

创建空的选择, 内部是 JavaScript 的 `Set`. 不需要会话, 可以比窗口活得更久. 范围按 ID 加 1 遍历, 所以 ID 要是连续的行索引.

## [m] setNextItemSelectionUserData

### imgui.setNextItemSelectionUserData(id)

**`帧内`**

- **id** { [number](dataTypes#number) } - 从 `0` 到 `2^53 - 1` 的整数.
- <ins>**returns**</ins> { [void](dataTypes#void) }

给下一项指定它在多选作用域内的 ID, 通常是行索引.

## [m] isItemToggledSelection

### imgui.isItemToggledSelection()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 选择状态改变时为 `true`.

在多选作用域内, 上一项的选择状态是否在这一帧改变. 在作用域外抛出 IllegalStateException.

## 弹窗

弹窗由 [openPopup](#m-openpopup) 打开, 由 [beginPopup](#m-beginpopup) 绘制. 长按 (相当于右键) 打开上下文弹窗.

```js
let lastChoice = '无';

imgui.createWindow(function (ui) {
    ui.withWindow('弹窗', null, 0, function () {
        if (ui.button('选择')) {
            ui.openPopup('menu');
        }
        ui.text('上次: ' + lastChoice);
        ui.withPopup('menu', 0, function () {
            ['复制', '删除'].forEach(function (label) {
                if (ui.selectable(label)) {
                    lastChoice = label;
                }
            });
        });
    });
}, { width: 260, height: 180 });
```

## [m] openPopup

### imgui.openPopup(id, flags?)

**`帧内`**

- **id** { [string](dataTypes#string) } - 弹窗的 ID.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [PopupFlags](#p-popupflags) 的组合.
- <ins>**returns**</ins> { [void](dataTypes#void) }

标记打开这个 ID 的弹窗, 从下一次 `beginPopup` 起显示.

## [m] beginPopup

### imgui.beginPopup(id, flags?)

**`帧内`**

- **id** { [string](dataTypes#string) } - 弹窗的 ID.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [WindowFlags](#p-windowflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 弹窗打开时为 `true`.

弹窗打开时绘制它, 此时返回 `true`, 要调用 [endPopup](#m-endpopup).

## [m] beginPopupModal

### imgui.beginPopupModal(name, open?, flags?)

**`帧内`**

- **name** { [string](dataTypes#string) } - 弹窗名称, 显示在标题栏.
- **[ open ]** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) } - 可变布尔值, 非空时显示关闭按钮. 不要时传 `null`.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [WindowFlags](#p-windowflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 弹窗打开时为 `true`.

绘制模态弹窗, 它挡住所有窗口的输入.

## [m] beginPopupContextItem

### imgui.beginPopupContextItem(id?, flags?)

**`帧内`**

- **[ id ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 弹窗的 ID, 省略时用上一项的 ID.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [PopupFlags](#p-popupflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 弹窗打开时为 `true`.

长按上一项时打开弹窗.

## [m] beginPopupContextWindow

### imgui.beginPopupContextWindow(id?, flags?)

**`帧内`**

- **[ id ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 弹窗的 ID, 省略时用窗口的 ID.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [PopupFlags](#p-popupflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 弹窗打开时为 `true`.

长按当前窗口时打开弹窗.

## [m] endPopup

### imgui.endPopup()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭 `beginPopup` 一类函数打开的绘制作用域.

## [m] closeCurrentPopup

### imgui.closeCurrentPopup()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭当前代码所在的弹窗.

## [m] isPopupOpen

### imgui.isPopupOpen(id, flags?)

**`帧内`**

- **id** { [string](dataTypes#string) } - 弹窗的 ID.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [PopupFlags](#p-popupflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 弹窗打开时为 `true`.

弹窗是否打开.

## 菜单与工具提示

## [m] beginMenuBar

### imgui.beginMenuBar()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 菜单栏可见时为 `true`.

打开带 `WindowFlags.MenuBar` 的窗口的菜单栏. 返回 `true` 时调用 [endMenuBar](#m-endmenubar).

## [m] endMenuBar

### imgui.endMenuBar()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭菜单栏.

## [m] beginMenu

### imgui.beginMenu(label, enabled?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 菜单名.
- **[ enabled = true ]** { [boolean](dataTypes#boolean) } - 是否可用.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 菜单展开时为 `true`.

打开菜单. 返回 `true` 时调用 [endMenu](#m-endmenu).

## [m] endMenu

### imgui.endMenu()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭菜单.

## [m] menuItem

### imgui.menuItem(label, shortcut?, selected?, enabled?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 菜单项文字.
- **[ shortcut ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 右侧显示的快捷键文字, 只用于显示.
- **[ selected ]** { [MutableValue](imgui#mutablevalue) | [boolean](dataTypes#boolean) } - 布尔值或可变布尔值, 为真时显示勾号. 传可变值时点按会切换它.
- **[ enabled = true ]** { [boolean](dataTypes#boolean) } - 是否可用.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 这一帧被点按时为 `true`.

绘制菜单项.

## [m] setTooltip

### imgui.setTooltip(text)

**`帧内`**

- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- <ins>**returns**</ins> { [void](dataTypes#void) }

本帧显示工具提示.

## [m] setItemTooltip

### imgui.setItemTooltip(text)

**`帧内`**

- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- <ins>**returns**</ins> { [void](dataTypes#void) }

指针在上一项上方时显示工具提示.

## [m] beginTooltip

### imgui.beginTooltip()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 工具提示已打开时为 `true`.

打开内容不限的工具提示. 返回 `true` 时调用 [endTooltip](#m-endtooltip).

## [m] beginItemTooltip

### imgui.beginItemTooltip()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 工具提示已打开时为 `true`.

指针在上一项上方时打开工具提示. 返回 `true` 时调用 [endTooltip](#m-endtooltip).

## [m] endTooltip

### imgui.endTooltip()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭工具提示.

## 表格

调用顺序: `beginTable`, 若干 `tableSetupColumn`, 可选的 `tableSetupScrollFreeze`, `tableHeadersRow`, 然后逐行 `tableNextRow` 与 `tableNextColumn`, 最后 `endTable`. 需要现成的增删改界面时用 [dataTable](#m-datatable).

```js
let rows = [['苹果', 3], ['香蕉', 5], ['樱桃', 12]];

imgui.createWindow(function (ui) {
    ui.withWindow('表格', null, 0, function () {
        let flags = ui.TableFlags.Borders | ui.TableFlags.RowBg | ui.TableFlags.Sortable;
        ui.withTable('fruits', 2, flags, undefined, undefined, function () {
            ui.tableSetupColumn('名称');
            ui.tableSetupColumn('数量');
            let sort = ui.tableGetSortSpecs();
            if (sort !== null && sort.specsDirty && sort.specs.length > 0) {
                let spec = sort.specs[0];
                let order = spec.sortDirection === ui.SortDirection.Ascending ? 1 : -1;
                rows.sort(function (a, b) {
                    let left = a[spec.columnIndex];
                    let right = b[spec.columnIndex];
                    return (left < right ? -1 : left > right ? 1 : 0) * order;
                });
            }
            ui.tableHeadersRow();
            rows.forEach(function (row) {
                ui.tableNextRow();
                row.forEach(function (cell) {
                    ui.tableNextColumn();
                    ui.text(cell);
                });
            });
        });
    });
}, { width: 300, height: 220 });
```

## [m] beginTable

### imgui.beginTable(id, columns, flags?, outerWidth?, outerHeight?)

**`帧内`**

- **id** { [string](dataTypes#string) } - 表格的 ID.
- **columns** { [number](dataTypes#number) } - 列数, 至少 1.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [TableFlags](#p-tableflags) 的组合.
- **[ outerWidth = 0 ]** { [number](dataTypes#number) } - 外部宽度, 单位 px.
- **[ outerHeight = 0 ]** { [number](dataTypes#number) } - 外部高度, 单位 px.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 表格可见时为 `true`.

打开表格. 返回 `true` 时调用 [endTable](#m-endtable).

## [m] endTable

### imgui.endTable()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭表格.

## [m] tableNextRow

### imgui.tableNextRow(rowFlags?, minRowHeight?)

**`帧内`**

- **[ rowFlags = 0 ]** { [number](dataTypes#number) } - [TableRowFlags](#p-tablerowflags) 的组合.
- **[ minRowHeight = 0 ]** { [number](dataTypes#number) } - 最小行高, 单位 px.
- <ins>**returns**</ins> { [void](dataTypes#void) }

开始新的一行.

## [m] tableNextColumn

### imgui.tableNextColumn()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 单元格可见时为 `true`.

移到下一个单元格.

## [m] tableSetColumnIndex

### imgui.tableSetColumnIndex(columnIndex)

**`帧内`**

- **columnIndex** { [number](dataTypes#number) } - 列索引.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 单元格可见时为 `true`.

移到本行的某一列.

## [m] tableSetupColumn

### imgui.tableSetupColumn(label, flags?, initWidthOrWeight?, userId?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 列标题.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [TableColumnFlags](#p-tablecolumnflags) 的组合.
- **[ initWidthOrWeight = 0 ]** { [number](dataTypes#number) } - 初始宽度 (px) 或拉伸权重.
- **[ userId = 0 ]** { [number](dataTypes#number) } - 在 [tableGetSortSpecs](#m-tablegetsortspecs) 中作为 `columnUserId` 返回.
- <ins>**returns**</ins> { [void](dataTypes#void) }

声明一列.

## [m] tableGetSortSpecs

### imgui.tableGetSortSpecs()

**`帧内`**

- <ins>**returns**</ins> { [TableSortSpecs](imgui#tablesortspecs) | [null](dataTypes#null) } - 参阅 [TableSortSpecs](#tablesortspecs).

读取当前表格的排序规格, 表格没有 `TableFlags.Sortable` 时返回 `null`. 在 `tableSetupColumn` 之后调用, `specsDirty` 为 `true` 时重新排序. 读取时会清除 `specsDirty`, 所以它只在用户点列标题的那一帧 (以及第一帧) 为 `true`.

## [m] tableSetupScrollFreeze

### imgui.tableSetupScrollFreeze(columns, rows)

**`帧内`**

- **columns** { [number](dataTypes#number) } - 冻结的列数.
- **rows** { [number](dataTypes#number) } - 冻结的行数.
- <ins>**returns**</ins> { [void](dataTypes#void) }

滚动时保持若干列和行可见.

## [m] tableHeadersRow

### imgui.tableHeadersRow()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

按 `tableSetupColumn` 的声明绘制标题行.

## [m] tableSetBgColor

### imgui.tableSetBgColor(target, color, columnIndex?)

**`帧内`** **`Overload 1/2`**

- **target** { [number](dataTypes#number) } - [TableBgTarget](#p-tablebgtarget) 的值.
- **color** { [Color](imgui#color) } - 颜色.
- **[ columnIndex = -1 ]** { [number](dataTypes#number) } - 列索引, `-1` 表示当前列.
- <ins>**returns**</ins> { [void](dataTypes#void) }

### imgui.tableSetBgColor(target, red, green, blue, alpha?, columnIndex?)

**`帧内`** **`Overload 2/2`**

- **target** { [number](dataTypes#number) } - [TableBgTarget](#p-tablebgtarget) 的值.
- **red** { [number](dataTypes#number) } - 红色分量.
- **green** { [number](dataTypes#number) } - 绿色分量.
- **blue** { [number](dataTypes#number) } - 蓝色分量.
- **[ alpha ]** { [number](dataTypes#number) } - 不透明度分量.
- **[ columnIndex = -1 ]** { [number](dataTypes#number) } - 列索引, `-1` 表示当前列.
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置行或单元格的背景色.

# with* 作用域

把成对的 `begin*` / `end*` 包成一个函数: 条件满足时运行 `body`, 结束时替你调用 `end*`, `body` 抛出异常时也不例外. 带条件的作用域返回 `body` 是否运行过. 都在帧内调用.

```js
imgui.createWindow(function (ui) {
    ui.withWindow('作用域', null, 0, function () {
        ui.withTreeNode('详情', function () {
            ui.text('节点展开时才运行');
        });
        ui.withDisabled(true, function () {
            ui.button('不可用');
        });
        ui.withGroup(function () {
            ui.text('第一行');
            ui.text('第二行');
        });
        ui.withItemTooltip(function () {
            ui.text('指针在这个组上方时显示');
        });
    });
}, { width: 280, height: 220 });
```

## [m] withWindow

### imgui.withWindow(name, open, flags, body)

**`帧内`**

- **name** { [string](dataTypes#string) } - 窗口名称, 同时是窗口的 ID. 同一帧用相同名称会追加到同一个窗口.
- **open** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 可变布尔值, 非空时显示关闭按钮. 不要时传 `null`.
- **flags** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - [WindowFlags](#p-windowflags) 的组合.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

在根窗口内运行 `body`. 窗口折叠时跳过 `body`, 并且仍然调用 `end`.

## [m] withChild

### imgui.withChild(id, width, height, borders, flags, body)

**`帧内`**

- **id** { [string](dataTypes#string) } - 子窗口的 ID.
- **width** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - 宽度, 单位 px, `0` 填满剩余空间.
- **height** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - 高度, 单位 px, `0` 填满剩余空间.
- **borders** { [boolean](dataTypes#boolean) | [number](dataTypes#number) | [undefined](dataTypes#undefined) } - 布尔值表示是否显示边框, 数字为 [ChildFlags](#p-childflags) 的组合.
- **flags** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - [WindowFlags](#p-windowflags) 的组合.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

在子窗口内运行 `body`. 参数同 [beginChild](#m-beginchild).

## [m] withTreeNode

### imgui.withTreeNode(label, body)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

树节点展开时运行 `body`.

## [m] withTabBar

### imgui.withTabBar(id, flags, body)

**`帧内`**

- **id** { [string](dataTypes#string) } - 标签栏的 ID.
- **flags** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - [TabBarFlags](#p-tabbarflags) 的组合.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

在标签栏内运行 `body`.

## [m] withTabItem

### imgui.withTabItem(label, open, flags, body)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **open** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 可变布尔值, 非空时显示关闭按钮. 不要时传 `null`.
- **flags** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - [TabItemFlags](#p-tabitemflags) 的组合.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

标签被选中时运行 `body`.

## [m] withTable

### imgui.withTable(id, columns, flags, outerWidth, outerHeight, body)

**`帧内`**

- **id** { [string](dataTypes#string) } - 表格的 ID.
- **columns** { [number](dataTypes#number) } - 列数.
- **flags** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - [TableFlags](#p-tableflags) 的组合.
- **outerWidth** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - 外部宽度, 单位 px.
- **outerHeight** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - 外部高度, 单位 px.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

在表格内运行 `body`.

## [m] withPopup

### imgui.withPopup(id, flags, body)

**`帧内`**

- **id** { [string](dataTypes#string) } - 弹窗的 ID.
- **flags** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - [WindowFlags](#p-windowflags) 的组合.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

弹窗打开时运行 `body`.

## [m] withPopupModal

### imgui.withPopupModal(name, open, flags, body)

**`帧内`**

- **name** { [string](dataTypes#string) } - 窗口名称, 同时是窗口的 ID. 同一帧用相同名称会追加到同一个窗口.
- **open** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 可变布尔值, 非空时显示关闭按钮. 不要时传 `null`.
- **flags** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - [WindowFlags](#p-windowflags) 的组合.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

模态弹窗打开时运行 `body`.

## [m] withContextItem

### imgui.withContextItem(id, flags, body)

**`帧内`** **`Overload 1/3`**

- **id** { [string](dataTypes#string) | [null](dataTypes#null) } - 弹窗的 ID, 可为 `null`.
- **flags** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - [PopupFlags](#p-popupflags) 的组合.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

### imgui.withContextItem(id, body)

**`帧内`** **`Overload 2/3`**

- **id** { [string](dataTypes#string) | [null](dataTypes#null) } - 弹窗的 ID, 可为 `null`.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

### imgui.withContextItem(body)

**`帧内`** **`Overload 3/3`**

- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

在长按上一项打开的弹窗内运行 `body`.

## [m] withContextWindow

### imgui.withContextWindow(id, flags, body)

**`帧内`** **`Overload 1/3`**

- **id** { [string](dataTypes#string) | [null](dataTypes#null) } - 弹窗的 ID, 可为 `null`.
- **flags** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - [PopupFlags](#p-popupflags) 的组合.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

### imgui.withContextWindow(id, body)

**`帧内`** **`Overload 2/3`**

- **id** { [string](dataTypes#string) | [null](dataTypes#null) } - 弹窗的 ID, 可为 `null`.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

### imgui.withContextWindow(body)

**`帧内`** **`Overload 3/3`**

- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

在长按当前窗口打开的弹窗内运行 `body`.

## [m] withTooltip

### imgui.withTooltip(body)

**`帧内`**

- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

在工具提示内运行 `body`.

## [m] withItemTooltip

### imgui.withItemTooltip(body)

**`帧内`**

- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

指针在上一项上方时, 在工具提示内运行 `body`.

## [m] withMenuBar

### imgui.withMenuBar(body)

**`帧内`**

- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

在菜单栏内运行 `body`.

## [m] withMenu

### imgui.withMenu(label, enabled, body)

**`帧内`**

- **label** { [string](dataTypes#string) } - 菜单名.
- **enabled** { [boolean](dataTypes#boolean) | [undefined](dataTypes#undefined) } - 是否可用.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

菜单展开时运行 `body`.

## [m] withListBox

### imgui.withListBox(label, width, height, body)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **width** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - 宽度, 单位 px.
- **height** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - 高度, 单位 px.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

在列表框内运行 `body`.

## [m] withCombo

### imgui.withCombo(label, preview, flags, body)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **preview** { [any](dataTypes#any) } - 未展开时显示的文字.
- **flags** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - [ComboFlags](#p-comboflags) 的组合.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

下拉框弹出时运行 `body`.

## [m] withDragDropSource

### imgui.withDragDropSource(flags, body)

**`帧内`** **`Overload 1/2`**

- **flags** { [number](dataTypes#number) | [undefined](dataTypes#undefined) } - [DragDropFlags](#p-dragdropflags) 的组合.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

### imgui.withDragDropSource(body)

**`帧内`** **`Overload 2/2`**

- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

上一项被拖动时运行 `body`, 位于 `beginDragDropSource` 与 `endDragDropSource` 之间. 在 `body` 里调用 [setDragDropPayload](#m-setdragdroppayload).

## [m] withDragDropTarget

### imgui.withDragDropTarget(body)

**`帧内`**

- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - `body` 运行过时为 `true`.

载荷悬停在上一项上方时运行 `body`, 位于 `beginDragDropTarget` 与 `endDragDropTarget` 之间. 在 `body` 里调用 [acceptDragDropPayload](#m-acceptdragdroppayload).

## [m] withGroup

### imgui.withGroup(body)

**`帧内`**

- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [void](dataTypes#void) }

在组内运行 `body`.

## [m] withDisabled

### imgui.withDisabled(disabled, body)

**`帧内`**

- **disabled** { [boolean](dataTypes#boolean) } - 是否禁用.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [void](dataTypes#void) }

第一个参数为真时, `body` 中的控件变灰且不可操作.

## [m] withId

### imgui.withId(id, body)

**`帧内`**

- **id** { [string](dataTypes#string) | [number](dataTypes#number) } - 字符串或数字.
- **body** { [FrameBody](imgui#framebody) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [void](dataTypes#void) }

压入 ID 后运行 `body`.

## [m] withFont

### imgui.withFont(font, fontSize, body)

**`帧内`** **`Overload 1/2`**

- **font** { [number](dataTypes#number) | [string](dataTypes#string) } - [Fonts](#p-fonts) 的值或 `fonts` 选项里的字体名.
- **fontSize** { [number](dataTypes#number) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 字体大小, 单位 px. `0` 或 `null` 保持当前大小.
- **body** { [Function](dataTypes#function) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [any](dataTypes#any) | [undefined](dataTypes#undefined) } - `body` 的返回值.

### imgui.withFont(font, body)

**`帧内`** **`Overload 2/2`**

- **font** { [number](dataTypes#number) | [string](dataTypes#string) } - [Fonts](#p-fonts) 的值或 `fonts` 选项里的字体名.
- **body** { [Function](dataTypes#function) } - 作用域内运行的函数.
- <ins>**returns**</ins> { [any](dataTypes#any) | [undefined](dataTypes#undefined) } - `body` 的返回值.

使用某个字体运行 `body`.

# 控件

控件都在帧内调用. 有状态的控件接受 [可变值](#mutablevalue), 由用户操作写回, 并在值改变的那一帧返回 `true`. 手机上单指点按相当于左键, 长按相当于右键.

文本函数把值用 `String()` 转换后原样显示, `%` 没有特殊含义, 字符串用 JavaScript 拼好再传入.

```js
let name = imgui.ref('AutoJs6');
let count = imgui.ref(3);
let ratio = imgui.ref(0.5);
let color = imgui.ref([0.25, 0.55, 0.9]);
let level = imgui.ref(1);
let position = imgui.floats([0, 0]);

imgui.createWindow(function (ui) {
    ui.withWindow('控件', null, 0, function () {
        ui.textColored('#4FC3F7', '彩色文本');
        ui.inputText('名称', name, 64);
        ui.inputInt('数量', count);
        ui.sliderFloat('比例', ratio, 0, 1);
        ui.dragFloat2('位置', position, 0.5);
        ui.colorEdit3('颜色', color);
        ui.combo('等级', level, ['低', '中', '高']);
        ui.progressBar(ratio.value);
    });
}, { width: 340, height: 340 });
```

## 文本

## [m] text

### imgui.text(value)

**`帧内`**

- **value** { [any](dataTypes#any) } - 要显示的值.
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制文本.

## [m] textWrapped

### imgui.textWrapped(value)

**`帧内`**

- **value** { [any](dataTypes#any) } - 要显示的值.
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制在窗口右边界换行的文本.

## [m] textColored

### imgui.textColored(color, value)

**`帧内`** **`Overload 1/2`**

- **color** { [Color](imgui#color) } - 颜色.
- **value** { [any](dataTypes#any) } - 要显示的值.
- <ins>**returns**</ins> { [void](dataTypes#void) }

### imgui.textColored(red, green, blue, alpha, value)

**`帧内`** **`Overload 2/2`**

- **red** { [number](dataTypes#number) } - 红色分量.
- **green** { [number](dataTypes#number) } - 绿色分量.
- **blue** { [number](dataTypes#number) } - 蓝色分量.
- **alpha** { [number](dataTypes#number) } - 不透明度分量.
- **value** { [any](dataTypes#any) } - 要显示的值.
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制彩色文本.

## [m] textDisabled

### imgui.textDisabled(text)

**`帧内`**

- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- <ins>**returns**</ins> { [void](dataTypes#void) }

用禁用色绘制文本.

## [m] bullet

### imgui.bullet()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制圆点, 下一项留在同一行.

## [m] bulletText

### imgui.bulletText(text)

**`帧内`**

- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制带圆点的文本.

## [m] labelText

### imgui.labelText(label, text)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- <ins>**returns**</ins> { [void](dataTypes#void) }

以控件的布局绘制文本, 右边是标签.

## [m] separatorText

### imgui.separatorText(label)

**`帧内`**

- **label** { [string](dataTypes#string) } - 分隔线上的文字.
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制嵌有文字的分隔线.

## 按钮与选择

## [m] button

### imgui.button(label, width?, height?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 按钮文字.
- **[ width = 0 ]** { [number](dataTypes#number) } - 宽度, 单位 px, `0` 按文字适配.
- **[ height = 0 ]** { [number](dataTypes#number) } - 高度, 单位 px, `0` 按文字适配.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 这一帧被点按时为 `true`.

绘制按钮.

## [m] smallButton

### imgui.smallButton(label)

**`帧内`**

- **label** { [string](dataTypes#string) } - 按钮文字.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 这一帧被点按时为 `true`.

绘制没有框架内边距的按钮.

## [m] arrowButton

### imgui.arrowButton(id, direction)

**`帧内`**

- **id** { [string](dataTypes#string) } - ID 字符串, 在当前窗口内唯一.
- **direction** { [number](dataTypes#number) } - [Dir](#p-dir) 的值.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 这一帧被点按时为 `true`.

绘制带箭头的方形按钮.

## [m] invisibleButton

### imgui.invisibleButton(id, width, height, flags?)

**`帧内`**

- **id** { [string](dataTypes#string) } - ID 字符串, 在当前窗口内唯一.
- **width** { [number](dataTypes#number) } - 宽度, 单位 px, 大于 0.
- **height** { [number](dataTypes#number) } - 高度, 单位 px, 大于 0.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [ButtonFlags](#p-buttonflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 这一帧被点按时为 `true`.

保留一块可触摸的不可见区域, 常用于配合绘制列表做自绘控件.

## [m] checkbox

### imgui.checkbox(label, value)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变布尔值.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制复选框.

## [m] toggle

### imgui.toggle(label, value)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变布尔值.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制移动端风格的开关.

## [m] toggleSwitch

### imgui.toggleSwitch(label, value)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变布尔值.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

与 [toggle](#m-toggle) 相同.

## [m] radioButton

### imgui.radioButton(label, value, buttonValue)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变数值.
- **buttonValue** { [number](dataTypes#number) } - 这个按钮代表的值.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 这一帧被点按时为 `true`.

绘制单选按钮, 点按时把 `value` 设为 `buttonValue`.

## [m] selectable

### imgui.selectable(label, selected?, flags?, width?, height?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **[ selected = false ]** { [boolean](dataTypes#boolean) } - 是否高亮显示.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [SelectableFlags](#p-selectableflags) 的组合.
- **[ width = 0 ]** { [number](dataTypes#number) } - 宽度, 单位 px.
- **[ height = 0 ]** { [number](dataTypes#number) } - 高度, 单位 px.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 这一帧被点按时为 `true`.

绘制可选择的行.

## [m] combo

### imgui.combo(label, currentItem, items, popupHeight?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **currentItem** { [MutableValue](imgui#mutablevalue) } - 可变数值, 当前选中的索引.
- **items** { [any](dataTypes#any)[] } - 选项.
- **[ popupHeight = -1 ]** { [number](dataTypes#number) } - 弹出列表的最大高度, 单位 px, `-1` 为默认.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 选择改变时为 `true`.

绘制下拉框. 项数上限是 `Limits.SelectionMaxItems`.

## [m] listBox

### imgui.listBox(label, currentItem, items, heightInItems?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **currentItem** { [MutableValue](imgui#mutablevalue) } - 可变数值, 当前选中的索引.
- **items** { [any](dataTypes#any)[] } - 选项.
- **[ heightInItems = -1 ]** { [number](dataTypes#number) } - 显示的行数, `-1` 为默认.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 选择改变时为 `true`.

绘制列表. 项数上限是 `Limits.SelectionMaxItems`.

## [m] progressBar

### imgui.progressBar(fraction, width?, height?, overlay?)

**`帧内`**

- **fraction** { [number](dataTypes#number) } - 进度, `0..1`.
- **[ width = -1 ]** { [number](dataTypes#number) } - 宽度, 单位 px, `-1` 填满.
- **[ height = 0 ]** { [number](dataTypes#number) } - 高度, 单位 px, `0` 为框架高度.
- **[ overlay ]** { [string](dataTypes#string) } - 叠加的文字, 省略时显示百分比.
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制进度条.

## 滑块

`format` 是 printf 风格的显示格式, `flags` 是 [SliderFlags](#p-sliderflags) 的组合.

## [m] sliderFloat

### imgui.sliderFloat(label, value, min, max, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变数值.
- **min** { [number](dataTypes#number) } - 下限.
- **max** { [number](dataTypes#number) } - 上限.
- **[ format = '%.3f' ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制浮点滑块.

## [m] sliderInt

### imgui.sliderInt(label, value, min, max, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变数值.
- **min** { [number](dataTypes#number) } - 下限.
- **max** { [number](dataTypes#number) } - 上限.
- **[ format = '%d' ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制整数滑块.

## [m] sliderAngle

### imgui.sliderAngle(label, value, degreesMin?, degreesMax?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变数值, 单位弧度.
- **[ degreesMin = -360 ]** { [number](dataTypes#number) } - 下限, 单位度.
- **[ degreesMax = 360 ]** { [number](dataTypes#number) } - 上限, 单位度.
- **[ format = '%.0f deg' ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制角度滑块. `value` 的单位是弧度, 上下限和显示的值是角度.

## [m] vSliderFloat

### imgui.vSliderFloat(label, width, height, value, min, max, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **width** { [number](dataTypes#number) } - 宽度, 单位 px.
- **height** { [number](dataTypes#number) } - 高度, 单位 px.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变数值.
- **min** { [number](dataTypes#number) } - 下限.
- **max** { [number](dataTypes#number) } - 上限.
- **[ format = '%.3f' ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制竖直的浮点滑块.

## [m] vSliderInt

### imgui.vSliderInt(label, width, height, value, min, max, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **width** { [number](dataTypes#number) } - 宽度, 单位 px.
- **height** { [number](dataTypes#number) } - 高度, 单位 px.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变数值.
- **min** { [number](dataTypes#number) } - 下限.
- **max** { [number](dataTypes#number) } - 上限.
- **[ format = '%d' ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制竖直的整数滑块.

## [m] sliderFloat2

### imgui.sliderFloat2(label, value, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ min ]** { [number](dataTypes#number) } - 下限.
- **[ max ]** { [number](dataTypes#number) } - 上限.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

双分量浮点滑块. 多分量控件的 `value` 是 `imgui.floats([...])`, `imgui.ints([...])` 或 `{ value: [...] }`, 数字个数不少于分量数, 用户编辑时写回. 其他参数与单分量形式相同.

## [m] sliderFloat3

### imgui.sliderFloat3(label, value, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ min ]** { [number](dataTypes#number) } - 下限.
- **[ max ]** { [number](dataTypes#number) } - 上限.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

三分量浮点滑块, 参阅 [sliderFloat2](#m-sliderfloat2).

## [m] sliderFloat4

### imgui.sliderFloat4(label, value, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ min ]** { [number](dataTypes#number) } - 下限.
- **[ max ]** { [number](dataTypes#number) } - 上限.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

四分量浮点滑块, 参阅 [sliderFloat2](#m-sliderfloat2).

## [m] sliderInt2

### imgui.sliderInt2(label, value, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ min ]** { [number](dataTypes#number) } - 下限.
- **[ max ]** { [number](dataTypes#number) } - 上限.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

双分量整数滑块, 参阅 [sliderFloat2](#m-sliderfloat2).

## [m] sliderInt3

### imgui.sliderInt3(label, value, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ min ]** { [number](dataTypes#number) } - 下限.
- **[ max ]** { [number](dataTypes#number) } - 上限.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

三分量整数滑块, 参阅 [sliderFloat2](#m-sliderfloat2).

## [m] sliderInt4

### imgui.sliderInt4(label, value, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ min ]** { [number](dataTypes#number) } - 下限.
- **[ max ]** { [number](dataTypes#number) } - 上限.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

四分量整数滑块, 参阅 [sliderFloat2](#m-sliderfloat2).

## 拖动框

按住拖动改变数值的字段. `min` 等于 `max` (默认) 时没有限制. `flags` 是 [SliderFlags](#p-sliderflags) 的组合.

## [m] dragFloat

### imgui.dragFloat(label, value, speed?, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变数值.
- **[ speed = 1 ]** { [number](dataTypes#number) } - 拖动一个像素改变的量.
- **[ min = 0 ]** { [number](dataTypes#number) } - 下限.
- **[ max = 0 ]** { [number](dataTypes#number) } - 上限.
- **[ format = '%.3f' ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制浮点拖动框.

## [m] dragInt

### imgui.dragInt(label, value, speed?, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变数值.
- **[ speed = 1 ]** { [number](dataTypes#number) } - 拖动一个像素改变的量.
- **[ min = 0 ]** { [number](dataTypes#number) } - 下限.
- **[ max = 0 ]** { [number](dataTypes#number) } - 上限.
- **[ format = '%d' ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制整数拖动框.

## [m] dragFloat2

### imgui.dragFloat2(label, value, speed?, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ speed ]** { [number](dataTypes#number) } - 拖动一个像素改变的量.
- **[ min ]** { [number](dataTypes#number) } - 下限.
- **[ max ]** { [number](dataTypes#number) } - 上限.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

双分量浮点拖动框. `value` 的写法参阅 [sliderFloat2](#m-sliderfloat2).

## [m] dragFloat3

### imgui.dragFloat3(label, value, speed?, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ speed ]** { [number](dataTypes#number) } - 拖动一个像素改变的量.
- **[ min ]** { [number](dataTypes#number) } - 下限.
- **[ max ]** { [number](dataTypes#number) } - 上限.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

三分量浮点拖动框, 参阅 [dragFloat2](#m-dragfloat2).

## [m] dragFloat4

### imgui.dragFloat4(label, value, speed?, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ speed ]** { [number](dataTypes#number) } - 拖动一个像素改变的量.
- **[ min ]** { [number](dataTypes#number) } - 下限.
- **[ max ]** { [number](dataTypes#number) } - 上限.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

四分量浮点拖动框, 参阅 [dragFloat2](#m-dragfloat2).

## [m] dragInt2

### imgui.dragInt2(label, value, speed?, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ speed ]** { [number](dataTypes#number) } - 拖动一个像素改变的量.
- **[ min ]** { [number](dataTypes#number) } - 下限.
- **[ max ]** { [number](dataTypes#number) } - 上限.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

双分量整数拖动框, 参阅 [dragFloat2](#m-dragfloat2).

## [m] dragInt3

### imgui.dragInt3(label, value, speed?, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ speed ]** { [number](dataTypes#number) } - 拖动一个像素改变的量.
- **[ min ]** { [number](dataTypes#number) } - 下限.
- **[ max ]** { [number](dataTypes#number) } - 上限.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

三分量整数拖动框, 参阅 [dragFloat2](#m-dragfloat2).

## [m] dragInt4

### imgui.dragInt4(label, value, speed?, min?, max?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ speed ]** { [number](dataTypes#number) } - 拖动一个像素改变的量.
- **[ min ]** { [number](dataTypes#number) } - 下限.
- **[ max ]** { [number](dataTypes#number) } - 上限.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

四分量整数拖动框, 参阅 [dragFloat2](#m-dragfloat2).

## [m] dragFloatRange2

### imgui.dragFloatRange2(label, currentMin, currentMax, speed?, min?, max?, format?, formatMax?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **currentMin** { [MutableValue](imgui#mutablevalue) } - 可变数值, 下端.
- **currentMax** { [MutableValue](imgui#mutablevalue) } - 可变数值, 上端.
- **[ speed = 1 ]** { [number](dataTypes#number) } - 拖动一个像素改变的量.
- **[ min = 0 ]** { [number](dataTypes#number) } - 下限.
- **[ max = 0 ]** { [number](dataTypes#number) } - 上限.
- **[ format = '%.3f' ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ formatMax ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 上端的格式, 默认与 `format` 相同.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制一对上下限拖动框.

## [m] dragIntRange2

### imgui.dragIntRange2(label, currentMin, currentMax, speed?, min?, max?, format?, formatMax?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **currentMin** { [MutableValue](imgui#mutablevalue) } - 可变数值, 下端.
- **currentMax** { [MutableValue](imgui#mutablevalue) } - 可变数值, 上端.
- **[ speed = 1 ]** { [number](dataTypes#number) } - 拖动一个像素改变的量.
- **[ min = 0 ]** { [number](dataTypes#number) } - 下限.
- **[ max = 0 ]** { [number](dataTypes#number) } - 上限.
- **[ format = '%d' ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ formatMax ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 上端的格式, 默认与 `format` 相同.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

[dragFloatRange2](#m-dragfloatrange2) 的整数形式.

## 输入框

聚焦后自动唤起系统输入法, 支持中文组合输入. `maxLength` 是字节容量, 包含结尾的空字符, 所以 256 最多放 255 个 ASCII 字符, CJK 字符更少. 容量上限是 `Limits.InputTextMaxBytes`, `createWindow({ ime: false })` 关闭输入法.

## [m] inputText

### imgui.inputText(label, value, maxLength?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变字符串.
- **[ maxLength ]** { [number](dataTypes#number) } - 容量, 单位字节, 从 2 到 65536.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [InputTextFlags](#p-inputtextflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制单行文本框.

## [m] inputTextMultiline

### imgui.inputTextMultiline(label, value, maxLength?, width?, height?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变字符串.
- **[ maxLength ]** { [number](dataTypes#number) } - 容量, 单位字节, 从 2 到 65536.
- **[ width = 0 ]** { [number](dataTypes#number) } - 宽度, 单位 px.
- **[ height = 0 ]** { [number](dataTypes#number) } - 高度, 单位 px.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [InputTextFlags](#p-inputtextflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制多行文本框.

## [m] inputInt

### imgui.inputInt(label, value, step?, stepFast?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变数值.
- **[ step = 1 ]** { [number](dataTypes#number) } - 步进按钮的增量.
- **[ stepFast = 100 ]** { [number](dataTypes#number) } - 长按步进按钮的增量.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [InputTextFlags](#p-inputtextflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制带步进按钮的整数框.

## [m] inputFloat

### imgui.inputFloat(label, value, step?, stepFast?, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) } - 可变数值.
- **[ step = 0 ]** { [number](dataTypes#number) } - 步进按钮的增量.
- **[ stepFast = 0 ]** { [number](dataTypes#number) } - 长按步进按钮的增量.
- **[ format = '%.3f' ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [InputTextFlags](#p-inputtextflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制数值框. `step` 为 `0` 时不显示步进按钮.

## [m] inputFloat2

### imgui.inputFloat2(label, value, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - [InputTextFlags](#p-inputtextflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

双分量浮点框, 没有步进按钮. `value` 的写法参阅 [sliderFloat2](#m-sliderfloat2).

## [m] inputFloat3

### imgui.inputFloat3(label, value, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - [InputTextFlags](#p-inputtextflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

三分量浮点框, 参阅 [inputFloat2](#m-inputfloat2).

## [m] inputFloat4

### imgui.inputFloat4(label, value, format?, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ format ]** { [string](dataTypes#string) } - printf 风格的显示格式.
- **[ flags ]** { [number](dataTypes#number) } - [InputTextFlags](#p-inputtextflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

四分量浮点框, 参阅 [inputFloat2](#m-inputfloat2).

## [m] inputInt2

### imgui.inputInt2(label, value, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ flags ]** { [number](dataTypes#number) } - [InputTextFlags](#p-inputtextflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

双分量整数框, 参阅 [inputFloat2](#m-inputfloat2).

## [m] inputInt3

### imgui.inputInt3(label, value, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ flags ]** { [number](dataTypes#number) } - [InputTextFlags](#p-inputtextflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

三分量整数框, 参阅 [inputFloat2](#m-inputfloat2).

## [m] inputInt4

### imgui.inputInt4(label, value, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [NumberArrayValue](imgui#numberarrayvalue) } - 可变数值数组.
- **[ flags ]** { [number](dataTypes#number) } - [InputTextFlags](#p-inputtextflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

四分量整数框, 参阅 [inputFloat2](#m-inputfloat2).

## 颜色

`value` 可以是 `{ value: [...] }`, `imgui.ref([...])` 或 `imgui.floats([...])`, 分量范围 `0..1`. `flags` 是 [ColorEditFlags](#p-coloreditflags) 的组合.

## [m] colorEdit3

### imgui.colorEdit3(label, value, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) | [NativeArray](imgui#nativearray) } - 可变数组, 3 个数.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制 RGB 编辑器.

## [m] colorEdit4

### imgui.colorEdit4(label, value, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) | [NativeArray](imgui#nativearray) } - 可变数组, 4 个数.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制 RGBA 编辑器.

## [m] colorPicker3

### imgui.colorPicker3(label, value, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) | [NativeArray](imgui#nativearray) } - 可变数组, 3 个数.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制 RGB 拾色器.

## [m] colorPicker4

### imgui.colorPicker4(label, value, flags?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **value** { [MutableValue](imgui#mutablevalue) | [NativeArray](imgui#nativearray) } - 可变数组, 4 个数.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 值改变时为 `true`.

绘制 RGBA 拾色器.

## [m] colorButton

### imgui.colorButton(id, color, flags?, width?, height?)

**`帧内`** **`Overload 1/3`**

- **id** { [string](dataTypes#string) } - ID 字符串, 在当前窗口内唯一.
- **color** { [Color](imgui#color) } - 颜色.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- **[ width ]** { [number](dataTypes#number) } - 宽度, 单位 px.
- **[ height ]** { [number](dataTypes#number) } - 高度, 单位 px.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 这一帧被点按时为 `true`.

### imgui.colorButton(id, color, options)

**`帧内`** **`Overload 2/3`**

- **id** { [string](dataTypes#string) } - ID 字符串, 在当前窗口内唯一.
- **color** { [Color](imgui#color) } - 颜色.
- **options** { [Object](dataTypes#object) } - 选项 `flags`, `width`, `height`.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 这一帧被点按时为 `true`.

### imgui.colorButton(id, red, green, blue, alpha?, flags?, width?, height?)

**`帧内`** **`Overload 3/3`**

- **id** { [string](dataTypes#string) } - ID 字符串, 在当前窗口内唯一.
- **red** { [number](dataTypes#number) } - 红色分量.
- **green** { [number](dataTypes#number) } - 绿色分量.
- **blue** { [number](dataTypes#number) } - 蓝色分量.
- **[ alpha ]** { [number](dataTypes#number) } - 不透明度分量.
- **[ flags = 0 ]** { [number](dataTypes#number) } - 标志位, 用 `|` 组合.
- **[ width ]** { [number](dataTypes#number) } - 宽度, 单位 px.
- **[ height ]** { [number](dataTypes#number) } - 高度, 单位 px.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 这一帧被点按时为 `true`.

绘制色块按钮.

## 图表与图像

## [m] plotLines

### imgui.plotLines(label, values, options?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **values** { [number](dataTypes#number)[] | [NativeArray](imgui#nativearray) } - 数值数组.
- **[ options ]** { [PlotOptions](imgui#plotoptions) } - 选项, 参阅 [PlotOptions](#plotoptions).
- <ins>**returns**</ins> { [void](dataTypes#void) }

把数值绘制成折线图.

## [m] plotHistogram

### imgui.plotHistogram(label, values, options?)

**`帧内`**

- **label** { [string](dataTypes#string) } - 标签, 同时是控件在当前窗口内的 ID. `##` 之后的部分只参与 ID, 不显示, 例如 `'确定##1'`.
- **values** { [number](dataTypes#number)[] | [NativeArray](imgui#nativearray) } - 数值数组.
- **[ options ]** { [PlotOptions](imgui#plotoptions) } - 选项, 参阅 [PlotOptions](#plotoptions).
- <ins>**returns**</ins> { [void](dataTypes#void) }

把数值绘制成柱状图.

## [m] image

### imgui.image(texture, width?, height?, options?)

**`帧内`**

- **texture** { [ImguiTexture](imguiTextureType) } - 由 [createTexture](imgui#m-createtexture) 创建的纹理.
- **[ width ]** { [number](dataTypes#number) | [ImageOptions](imguiTextureType#imageoptions) } - 宽度, 单位 px, 默认为纹理宽度. 也可以直接传选项对象.
- **[ height ]** { [number](dataTypes#number) } - 高度, 单位 px, 默认为纹理高度.
- **[ options ]** { [ImageOptions](imguiTextureType#imageoptions) } - 选项, 参阅 [ImageOptions](imguiTextureType#imageoptions).
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制纹理.

## [m] imageButton

### imgui.imageButton(id, texture, width?, height?, options?)

**`帧内`**

- **id** { [string](dataTypes#string) } - ID 字符串, 在当前窗口内唯一.
- **texture** { [ImguiTexture](imguiTextureType) } - 由 [createTexture](imgui#m-createtexture) 创建的纹理.
- **[ width ]** { [number](dataTypes#number) | [ImageOptions](imguiTextureType#imageoptions) } - 宽度, 单位 px, 默认为纹理宽度. 也可以直接传选项对象.
- **[ height ]** { [number](dataTypes#number) } - 高度, 单位 px, 默认为纹理高度.
- **[ options ]** { [ImageOptions](imguiTextureType#imageoptions) } - 选项, 参阅 [ImageOptions](imguiTextureType#imageoptions).
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 这一帧被点按时为 `true`.

把纹理绘制成按钮.

# 布局

## [m] sameLine

### imgui.sameLine(offsetFromStartX?, spacing?)

**`帧内`**

- **[ offsetFromStartX = 0 ]** { [number](dataTypes#number) } - 距窗口左侧的位置, 单位 px, `0` 紧随上一项.
- **[ spacing = -1 ]** { [number](dataTypes#number) } - 与上一项的间距, 单位 px, `-1` 用样式的间距.
- <ins>**returns**</ins> { [void](dataTypes#void) }

让下一项留在这一行.

## [m] separator

### imgui.separator()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制分隔线.

## [m] spacing

### imgui.spacing()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

增加竖直间距.

## [m] newLine

### imgui.newLine()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

结束本行, 或增加一个空行.

## [m] dummy

### imgui.dummy(width, height)

**`帧内`**

- **width** { [number](dataTypes#number) } - 宽度, 单位 px.
- **height** { [number](dataTypes#number) } - 高度, 单位 px.
- <ins>**returns**</ins> { [void](dataTypes#void) }

保留一块空白项.

## [m] indent

### imgui.indent(width?)

**`帧内`**

- **[ width = 0 ]** { [number](dataTypes#number) } - 缩进量, 单位 px, `0` 用样式的缩进.
- <ins>**returns**</ins> { [void](dataTypes#void) }

让之后的项右移.

## [m] unindent

### imgui.unindent(width?)

**`帧内`**

- **[ width = 0 ]** { [number](dataTypes#number) } - 缩进量, 单位 px, `0` 用样式的缩进.
- <ins>**returns**</ins> { [void](dataTypes#void) }

撤销 [indent](#m-indent).

## [m] alignTextToFramePadding

### imgui.alignTextToFramePadding()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

让本行的文本与带框架的控件对齐.

## [m] setNextItemWidth

### imgui.setNextItemWidth(width)

**`帧内`**

- **width** { [number](dataTypes#number) } - 宽度, 单位 px.
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置下一项的宽度. 负数表示在右侧留出这么多空间.

## [m] pushItemWidth

### imgui.pushItemWidth(width)

**`帧内`**

- **width** { [number](dataTypes#number) } - 宽度, 单位 px.
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置之后各项的宽度, 直到 [popItemWidth](#m-popitemwidth).

## [m] popItemWidth

### imgui.popItemWidth()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

撤销 [pushItemWidth](#m-pushitemwidth).

## [m] getCursorPos

### imgui.getCursorPos()

**`帧内`**

- <ins>**returns**</ins> { [Vec2](imgui#vec2) } - 单位 px.

读取布局光标, 相对窗口.

## [m] setCursorPos

### imgui.setCursorPos(x, y)

**`帧内`**

- **x** { [number](dataTypes#number) } - 横坐标, 单位 px.
- **y** { [number](dataTypes#number) } - 纵坐标, 单位 px.
- <ins>**returns**</ins> { [void](dataTypes#void) }

移动布局光标, 相对窗口.

## [m] beginGroup

### imgui.beginGroup()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

把之后的项当作一个整体, 直到 [endGroup](#m-endgroup). 之后的查询函数作用于整个组.

## [m] endGroup

### imgui.endGroup()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

结束组.

## [m] beginDisabled

### imgui.beginDisabled(disabled?)

**`帧内`**

- **[ disabled = true ]** { [boolean](dataTypes#boolean) } - 是否禁用.
- <ins>**returns**</ins> { [void](dataTypes#void) }

让之后的项变灰且不可操作, 直到 [endDisabled](#m-enddisabled).

## [m] endDisabled

### imgui.endDisabled()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

撤销 [beginDisabled](#m-begindisabled).

## [m] setScrollX

### imgui.setScrollX(value)

**`帧内`**

- **value** { [number](dataTypes#number) } - 滚动量, 单位 px.
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置横向滚动量.

## [m] setScrollY

### imgui.setScrollY(value)

**`帧内`**

- **value** { [number](dataTypes#number) } - 滚动量, 单位 px.
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置纵向滚动量.

## [m] setScrollHereX

### imgui.setScrollHereX(centerRatio?)

**`帧内`**

- **[ centerRatio = 0.5 ]** { [number](dataTypes#number) } - 位置, `0` 为左侧, `1` 为右侧.
- <ins>**returns**</ins> { [void](dataTypes#void) }

把光标滚动到窗口内的某个位置.

## [m] setScrollHereY

### imgui.setScrollHereY(centerRatio?)

**`帧内`**

- **[ centerRatio = 0.5 ]** { [number](dataTypes#number) } - 位置, `0` 为顶部, `1` 为底部.
- <ins>**returns**</ins> { [void](dataTypes#void) }

把光标滚动到窗口内的某个位置.

## [m] setKeyboardFocusHere

### imgui.setKeyboardFocusHere(offset?)

**`帧内`**

- **[ offset = 0 ]** { [number](dataTypes#number) } - 目标项相对下一项的偏移.
- <ins>**returns**</ins> { [void](dataTypes#void) }

让下一项获得键盘焦点.

## [m] pushClipRect

### imgui.pushClipRect(minimum, maximum, intersectWithCurrent?)

**`帧内`**

- **minimum** { [Point](imgui#point) } - 左上角, 单位 px.
- **maximum** { [Point](imgui#point) } - 右下角, 单位 px.
- **[ intersectWithCurrent = true ]** { [boolean](dataTypes#boolean) } - 是否与当前裁剪矩形取交集.
- <ins>**returns**</ins> { [void](dataTypes#void) }

裁剪当前窗口的绘制, 命中测试和控件剔除, 直到 [popClipRect](#m-popcliprect). 坐标与绘制列表相同, 是帧内 px. 绘制列表的 [pushClipRect](imguiDrawListType#m-pushcliprect) 只影响绘制.

## [m] popClipRect

### imgui.popClipRect()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

撤销 [pushClipRect](#m-pushcliprect). 这一帧当前窗口没有对应的 `pushClipRect` 时抛出 Error.

# 绘制列表与纹理

[ImguiDrawList](imguiDrawListType) 在帧内自由绘制, 坐标单位 px. 三个层次: 当前窗口 (在窗口的项之上), 前景 (所有窗口之上), 背景 (所有窗口之下). [ImguiTexture](imguiTextureType) 把图像加载到 GPU, 由 [image](#m-image), [imageButton](#m-imagebutton) 和绘制列表使用.

```js
imgui.createWindow(function (ui) {
    ui.withWindow('绘制', null, 0, function () {
        let draw = ui.getWindowDrawList();
        let origin = ui.getWindowPos();
        let x = origin[0];
        let y = origin[1];
        draw.addRectFilled([x + 20, y + 60], [x + 180, y + 140], '#335C8A', 8)
            .addCircle([x + 100, y + 100], 30, '#FFFFFF', 0, 2)
            .addText([x + 30, y + 150], '#FFC107', 'DrawList');
        draw.pathClear()
            .pathLineTo([x + 200, y + 60])
            .pathLineTo([x + 260, y + 140])
            .pathLineTo([x + 200, y + 140])
            .pathStroke('#66BB6A', 2, ui.DrawFlags.Closed);
    });
}, { width: 320, height: 240 });
```

## [m] getWindowDrawList

### imgui.getWindowDrawList()

**`帧内`**

- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

当前窗口的绘制列表, 绘制在窗口的项之上.

## [m] getForegroundDrawList

### imgui.getForegroundDrawList()

**`帧内`**

- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

所有窗口之上的绘制列表.

## [m] getBackgroundDrawList

### imgui.getBackgroundDrawList()

**`帧内`**

- <ins>**returns**</ins> { [ImguiDrawList](imguiDrawListType) }

所有窗口之下的绘制列表.

## [m] createTexture

### imgui.createTexture(source, options?)

**`会话期`**

- **source** { [TextureSource](imgui#texturesource) } - 图像来源, 参阅 [TextureSource](#texturesource).
- **[ options ]** { [TextureOptions](imguiTextureType#textureoptions) | [number](dataTypes#number) } - 选项, 参阅 [TextureOptions](imguiTextureType#textureoptions), 或 [TextureFlags](#p-textureflags) 的组合.
- <ins>**returns**</ins> { [ImguiTexture](imguiTextureType) }

把图像加载为纹理, 会话关闭时自动释放. 在脚本线程上, 会话运行时调用, 通常在渲染回调首次运行时创建.

## [m] destroyTexture

### imgui.destroyTexture(texture)

**`脚本线程`**

- **texture** { [ImguiTexture](imguiTextureType) } - 由 [createTexture](imgui#m-createtexture) 创建的纹理.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 已经释放过时为 `false`.

释放纹理.

## [m] colorU32

### imgui.colorU32(red, green?, blue?, alpha?)

**`任何时候`**

- **red** { [number](dataTypes#number) | [Color](imgui#color) } - 红色分量 (`0..1`) 或一个完整的 [Color](#color).
- **[ green ]** { [number](dataTypes#number) } - 绿色分量.
- **[ blue ]** { [number](dataTypes#number) } - 蓝色分量.
- **[ alpha ]** { [number](dataTypes#number) } - 不透明度分量.
- <ins>**returns**</ins> { [number](dataTypes#number) } - 打包后的整数.

把颜色打包成 Dear ImGui 的 `0xAABBGGRR` 整数.

# 拖放

在一个项上按住拖动, 放到另一个项上. 载荷按 JSON 复制, 拖动期间每帧序列化一次, 所以传索引或键, 不要传大对象.

```js
let items = ['甲', '乙', '丙'];
let dropped = '无';

imgui.createWindow(function (ui) {
    ui.withWindow('拖放', null, 0, function () {
        items.forEach(function (item, index) {
            ui.button(item);
            ui.withDragDropSource(function () {
                ui.setDragDropPayload('item', index);
                ui.text('拖动 ' + item);
            });
        });
        ui.button('放到这里');
        ui.withDragDropTarget(function () {
            let payload = ui.acceptDragDropPayload('item');
            if (payload !== null) {
                dropped = items[payload.data];
            }
        });
        ui.text('放下: ' + dropped);
    });
}, { width: 260, height: 260 });
```

## [m] beginDragDropSource

### imgui.beginDragDropSource(flags?)

**`帧内`**

- **[ flags = 0 ]** { [number](dataTypes#number) } - [DragDropFlags](#p-dragdropflags) 的组合. 没有 ID 的项 (例如文本) 需要 `SourceAllowNullID`.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 正在拖动时为 `true`.

在一个项之后调用, 这一项被拖动时返回 `true`. 然后调用 [setDragDropPayload](#m-setdragdroppayload) 和 [endDragDropSource](#m-enddragdropsource), 其间绘制的内容显示在预览工具提示中.

## [m] setDragDropPayload

### imgui.setDragDropPayload(type, data, condition?)

**`帧内`**

- **type** { [string](dataTypes#string) } - 数据种类, 1 到 32 个 UTF-8 字节, 不能以 `_` 开头.
- **data** { [any](dataTypes#any) } - 字符串, 数字或可以 JSON 序列化的值, JSON 不超过 `Limits.DragDropPayloadMaxBytes`.
- **[ condition = api.Cond.Always ]** { [number](dataTypes#number) } - `Cond.Always` 每帧更新数据, `Cond.Once` 只设置一次.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 上一帧已有目标接受载荷时为 `true`.

设置载荷.

## [m] endDragDropSource

### imgui.endDragDropSource()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭 [beginDragDropSource](#m-begindragdropsource).

## [m] beginDragDropTarget

### imgui.beginDragDropTarget()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 载荷悬停时为 `true`.

在一个项之后调用, 载荷悬停在这一项上方时返回 `true`. 然后调用 [acceptDragDropPayload](#m-acceptdragdroppayload) 和 [endDragDropTarget](#m-enddragdroptarget).

## [m] acceptDragDropPayload

### imgui.acceptDragDropPayload(type, flags?)

**`帧内`**

- **type** { [string](dataTypes#string) } - 数据种类.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [DragDropFlags](#p-dragdropflags) 的组合. `AcceptBeforeDelivery` 在松手之前也返回载荷, 见它的 `delivery` 字段.
- <ins>**returns**</ins> { [DragDropPayload](imgui#dragdroppayload) | [null](dataTypes#null) } - 没有放下时为 `null`.

这一种类的载荷放到这里时返回它. `'_COL3F'` 和 `'_COL4F'` 接受从颜色控件拖来的颜色.

## [m] endDragDropTarget

### imgui.endDragDropTarget()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭 [beginDragDropTarget](#m-begindragdroptarget).

## [m] getDragDropPayload

### imgui.getDragDropPayload()

**`会话期`**

- <ins>**returns**</ins> { [DragDropPayload](imgui#dragdroppayload) | [null](dataTypes#null) } - 没有拖动时为 `null`.

读取正在进行的拖动的载荷.

# 样式, 主题, 字体与 ID 栈

`push*` 与 `pop*` 成对调用, 都在帧内. `setTheme`, `setStyleProperties` 等在会话期调用, 改变之后的所有帧.

```js
imgui.createWindow(function (ui) {
    ui.withWindow('样式', null, 0, function () {
        ui.pushStyleColor(ui.Col.Button, '#2E7D32');
        ui.pushStyleVar(ui.StyleVar.FrameRounding, ui.dp(8));
        ui.button('绿色圆角按钮');
        ui.popStyleVar();
        ui.popStyleColor();
        ui.button('默认按钮');

        ['A', 'B'].forEach(function (id) {
            ui.withId(id, function () {
                ui.button('同名按钮');
            });
        });
        ui.withFont(ui.Fonts.Icons, function () {
            ui.text(ui.icon('Star'));
        });
    });
}, { width: 280, height: 240, theme: imgui.Themes.CyanDusk, appearance: imgui.Appearance.Rounded });
imgui.setStyleProperties({ itemSpacing: [8, 6], colors: { WindowBg: '#102030' } });
```

## [m] setTheme

### imgui.setTheme(name)

**`会话期`**

- **name** { [ThemeName](imgui#p-themes) | [string](dataTypes#string) } - [Themes](#p-themes) 的值或名称.
- <ins>**returns**</ins> { [ThemeName](imgui#p-themes) } - 主题的规范名称.

应用主题.

## [m] setStyleProperties

### imgui.setStyleProperties(properties)

**`会话期`**

- **properties** { [StyleProperties](imgui#styleproperties) } - 参阅 [StyleProperties](#styleproperties).
- <ins>**returns**</ins> { [imgui](imgui) } - API 对象本身.

批量设置样式尺寸和颜色.

## [m] setStyleColor

### imgui.setStyleColor(index, color)

**`会话期`** **`Overload 1/2`**

- **index** { [number](dataTypes#number) | [string](dataTypes#string) } - [Col](#p-col) 的值或名称.
- **color** { [Color](imgui#color) } - 颜色.
- <ins>**returns**</ins> { [imgui](imgui) } - API 对象本身.

### imgui.setStyleColor(index, red, green, blue, alpha?)

**`会话期`** **`Overload 2/2`**

- **index** { [number](dataTypes#number) | [string](dataTypes#string) } - [Col](#p-col) 的值或名称.
- **red** { [number](dataTypes#number) } - 红色分量.
- **green** { [number](dataTypes#number) } - 绿色分量.
- **blue** { [number](dataTypes#number) } - 蓝色分量.
- **[ alpha ]** { [number](dataTypes#number) } - 不透明度分量.
- <ins>**returns**</ins> { [imgui](imgui) } - API 对象本身.

设置一个样式颜色, 对之后的帧持续生效.

## [m] pushStyleColor

### imgui.pushStyleColor(index, color)

**`帧内`** **`Overload 1/2`**

- **index** { [number](dataTypes#number) | [string](dataTypes#string) } - [Col](#p-col) 的值或名称.
- **color** { [Color](imgui#color) } - 颜色.
- <ins>**returns**</ins> { [void](dataTypes#void) }

### imgui.pushStyleColor(index, red, green, blue, alpha?)

**`帧内`** **`Overload 2/2`**

- **index** { [number](dataTypes#number) | [string](dataTypes#string) } - [Col](#p-col) 的值或名称.
- **red** { [number](dataTypes#number) } - 红色分量.
- **green** { [number](dataTypes#number) } - 绿色分量.
- **blue** { [number](dataTypes#number) } - 蓝色分量.
- **[ alpha ]** { [number](dataTypes#number) } - 不透明度分量.
- <ins>**returns**</ins> { [void](dataTypes#void) }

临时改变一个样式颜色, 直到 [popStyleColor](#m-popstylecolor).

## [m] popStyleColor

### imgui.popStyleColor(count?)

**`帧内`**

- **[ count = 1 ]** { [number](dataTypes#number) } - 次数.
- <ins>**returns**</ins> { [void](dataTypes#void) }

撤销 `count` 次 [pushStyleColor](#m-pushstylecolor).

## [m] pushStyleVar

### imgui.pushStyleVar(index, x, y?)

**`帧内`**

- **index** { [number](dataTypes#number) | [string](dataTypes#string) } - [StyleVar](#p-stylevar) 的值或名称.
- **x** { [number](dataTypes#number) | [Point](imgui#point) } - 数值, 或双分量变量的 [Point](#point).
- **[ y ]** { [number](dataTypes#number) } - 双分量变量的第二个分量.
- <ins>**returns**</ins> { [void](dataTypes#void) }

临时改变一个样式变量, 直到 [popStyleVar](#m-popstylevar). 长度单位 px.

## [m] popStyleVar

### imgui.popStyleVar(count?)

**`帧内`**

- **[ count = 1 ]** { [number](dataTypes#number) } - 次数.
- <ins>**returns**</ins> { [void](dataTypes#void) }

撤销 `count` 次 [pushStyleVar](#m-pushstylevar).

## [m] styleColorsDark

### imgui.styleColorsDark()

**`会话期`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

应用 Dear ImGui 的深色配色.

## [m] styleColorsLight

### imgui.styleColorsLight()

**`会话期`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

应用 Dear ImGui 的浅色配色.

## [m] styleColorsClassic

### imgui.styleColorsClassic()

**`会话期`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

应用 Dear ImGui 的经典配色.

## [m] setWindowFontScale

### imgui.setWindowFontScale(scale)

**`帧内`**

- **scale** { [number](dataTypes#number) } - 缩放比例, `0.25..4`.
- <ins>**returns**</ins> { [void](dataTypes#void) }

缩放当前窗口的文字.

## [m] pushFont

### imgui.pushFont(font, fontSize?)

**`帧内`**

- **font** { [number](dataTypes#number) | [string](dataTypes#string) } - [Fonts](#p-fonts) 的值或 `fonts` 选项里的字体名.
- **[ fontSize = 0 ]** { [number](dataTypes#number) } - 字体大小, 单位 px, `0` 保持当前大小.
- <ins>**returns**</ins> { [number](dataTypes#number) } - 压入的字体索引.

使用某个字体, 直到 [popFont](#m-popfont).

## [m] popFont

### imgui.popFont()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

撤销 [pushFont](#m-pushfont).

## [m] pushId

### imgui.pushId(id)

**`帧内`**

- **id** { [string](dataTypes#string) | [number](dataTypes#number) } - 字符串或数字.
- <ins>**returns**</ins> { [void](dataTypes#void) }

给之后的项追加 ID, 直到 [popId](#m-popid). 循环绘制同名控件时用它区分.

## [m] popId

### imgui.popId()

**`帧内`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

撤销 [pushId](#m-pushid).

# 输入与事件

窗口运行时查询指针和键盘, 或向窗口注入输入. 手机上的触摸等同左键. 注入的事件走与手指相同的输入队列, 从下一帧起生效, 只到达 Dear ImGui, 不影响窗口下方的应用, 特权层忽略它们.

`key` 是 [Key](#p-key) 或 [Mod](#p-mod) 的值, `keyChord` 是组合键, 例如 `ui.Mod.Ctrl | ui.Key.S`. 不是这两类的值抛出 RangeError.

## [m] getMousePos

### imgui.getMousePos()

**`会话期`**

- <ins>**returns**</ins> { [Vec2](imgui#vec2) } - 单位 px.

读取指针位置.

## [m] isMouseDown

### imgui.isMouseDown(button?)

**`会话期`**

- **[ button ]** { [number](dataTypes#number) } - [MouseButton](#p-mousebutton) 的值, 默认为左键.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

指针按键是否按住.

## [m] isMouseClicked

### imgui.isMouseClicked(button?, repeat?)

**`会话期`**

- **[ button ]** { [number](dataTypes#number) } - [MouseButton](#p-mousebutton) 的值, 默认为左键.
- **[ repeat ]** { [boolean](dataTypes#boolean) } - 按住时是否也算.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

指针按键是否在这一帧按下.

## [m] isMouseDoubleClicked

### imgui.isMouseDoubleClicked(button?)

**`会话期`**

- **[ button ]** { [number](dataTypes#number) } - [MouseButton](#p-mousebutton) 的值, 默认为左键.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

指针按键是否在这一帧双击.

## [m] isMouseReleased

### imgui.isMouseReleased(button?)

**`会话期`**

- **[ button ]** { [number](dataTypes#number) } - [MouseButton](#p-mousebutton) 的值, 默认为左键.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

指针按键是否在这一帧抬起.

## [m] isMouseDragging

### imgui.isMouseDragging(button?, lockThreshold?)

**`会话期`**

- **[ button ]** { [number](dataTypes#number) } - [MouseButton](#p-mousebutton) 的值, 默认为左键.
- **[ lockThreshold = -1 ]** { [number](dataTypes#number) } - 判定拖动的距离, 单位 px, `-1` 为默认.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

指针按键是否正在拖动.

## [m] getMouseDragDelta

### imgui.getMouseDragDelta(button?, lockThreshold?)

**`会话期`**

- **[ button ]** { [number](dataTypes#number) } - [MouseButton](#p-mousebutton) 的值, 默认为左键.
- **[ lockThreshold = -1 ]** { [number](dataTypes#number) } - 判定拖动的距离, 单位 px, `-1` 为默认.
- <ins>**returns**</ins> { [Vec2](imgui#vec2) } - 单位 px.

读取拖动的距离.

## [m] resetMouseDragDelta

### imgui.resetMouseDragDelta(button?)

**`会话期`**

- **[ button ]** { [number](dataTypes#number) } - [MouseButton](#p-mousebutton) 的值, 默认为左键.
- <ins>**returns**</ins> { [void](dataTypes#void) }

从当前位置重新计算拖动距离.

## [m] wantCaptureMouse

### imgui.wantCaptureMouse()

**`会话期`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

Dear ImGui 是否正在使用指针.

## [m] wantTextInput

### imgui.wantTextInput()

**`会话期`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

是否有文本框处于焦点.

## [m] isKeyDown

### imgui.isKeyDown(key)

**`会话期`**

- **key** { [number](dataTypes#number) } - 按键, [Key](#p-key) 或 [Mod](#p-mod) 的值.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

按键是否按住.

## [m] isKeyPressed

### imgui.isKeyPressed(key, repeat?)

**`帧内`**

- **key** { [number](dataTypes#number) } - 按键, [Key](#p-key) 或 [Mod](#p-mod) 的值.
- **[ repeat = true ]** { [boolean](dataTypes#boolean) } - 按住期间的重复是否也算.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

按键是否按下.

## [m] isKeyReleased

### imgui.isKeyReleased(key)

**`会话期`**

- **key** { [number](dataTypes#number) } - 按键, [Key](#p-key) 或 [Mod](#p-mod) 的值.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

按键是否在这一帧抬起.

## [m] getKeyPressedAmount

### imgui.getKeyPressedAmount(key, repeatDelay, rate)

**`帧内`**

- **key** { [number](dataTypes#number) } - 按键, [Key](#p-key) 或 [Mod](#p-mod) 的值.
- **repeatDelay** { [number](dataTypes#number) } - 重复延迟, 单位秒.
- **rate** { [number](dataTypes#number) } - 重复间隔, 单位秒.
- <ins>**returns**</ins> { [number](dataTypes#number) }

按住的键在这一帧重复了多少次.

## [m] getKeyName

### imgui.getKeyName(key)

**`帧内`**

- **key** { [number](dataTypes#number) } - 按键, [Key](#p-key) 或 [Mod](#p-mod) 的值.
- <ins>**returns**</ins> { [string](dataTypes#string) }

按键的英文名, `Key.None` 为 `'None'`. 只用于显示和调试, 不要保存.

## [m] isKeyChordPressed

### imgui.isKeyChordPressed(keyChord)

**`帧内`**

- **keyChord** { [number](dataTypes#number) } - 按键与修饰键的组合, 例如 `ui.Mod.Ctrl | ui.Key.S`.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

组合键是否按下, 不检查焦点. 一般用 [shortcut](#m-shortcut).

## [m] shortcut

### imgui.shortcut(keyChord, flags?)

**`帧内`**

- **keyChord** { [number](dataTypes#number) } - 按键与修饰键的组合, 例如 `ui.Mod.Ctrl | ui.Key.S`.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [InputFlags](#p-inputflags): `Repeat` 与一种路由, 例如 `RouteGlobal`.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

组合键是否按下, 并且这段代码可以响应它. 默认由有焦点的窗口接收.

## [m] setNextItemShortcut

### imgui.setNextItemShortcut(keyChord, flags?)

**`帧内`**

- **keyChord** { [number](dataTypes#number) } - 按键与修饰键的组合, 例如 `ui.Mod.Ctrl | ui.Key.S`.
- **[ flags = 0 ]** { [number](dataTypes#number) } - [InputFlags](#p-inputflags), 也可以用 `Tooltip`.
- <ins>**returns**</ins> { [void](dataTypes#void) }

让下一项响应组合键, 如同被激活.

## [m] addInputCharacters

### imgui.addInputCharacters(text)

**`会话期`**

- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- <ins>**returns**</ins> { [void](dataTypes#void) }

把文本排入输入队列, 发给有焦点的文本框.

## [m] addKeyEvent

### imgui.addKeyEvent(key, down)

**`会话期`**

- **key** { [number](dataTypes#number) } - 按键, [Key](#p-key) 或 [Mod](#p-mod) 的值.
- **down** { [boolean](dataTypes#boolean) } - 按下为 `true`, 抬起为 `false`.
- <ins>**returns**</ins> { [void](dataTypes#void) }

排入一次按键变化.

## [m] sendKey

### imgui.sendKey(key)

**`会话期`**

- **key** { [number](dataTypes#number) } - 按键, [Key](#p-key) 或 [Mod](#p-mod) 的值.
- <ins>**returns**</ins> { [void](dataTypes#void) }

排入一次按下和抬起.

## [m] addMouseWheel

### imgui.addMouseWheel(wheelX?, wheelY?)

**`会话期`**

- **[ wheelX = 0 ]** { [number](dataTypes#number) } - 横向步数.
- **[ wheelY = 0 ]** { [number](dataTypes#number) } - 纵向步数.
- <ins>**returns**</ins> { [void](dataTypes#void) }

排入滚轮步数.

## [m] addMousePosEvent

### imgui.addMousePosEvent(x, y)

**`会话期`**

- **x** { [number](dataTypes#number) } - 横坐标, 单位 px.
- **y** { [number](dataTypes#number) } - 纵坐标, 单位 px.
- <ins>**returns**</ins> { [void](dataTypes#void) }

注入下一帧的指针位置, 算作触摸输入. 坐标是帧内 px, 不是 dp. 位置变化和按键变化在不同的帧生效, 顺序与调用顺序相同, 所以按下之前要先有一帧在那个位置.

## [m] addMouseButtonEvent

### imgui.addMouseButtonEvent(button, down)

**`会话期`**

- **button** { [number](dataTypes#number) } - [MouseButton](#p-mousebutton): `0` 左, `1` 右, `2` 中, 最大 `4`.
- **down** { [boolean](dataTypes#boolean) } - 按下为 `true`, 抬起为 `false`.
- <ins>**returns**</ins> { [void](dataTypes#void) }

注入下一帧的指针按键变化, 参阅 [addMousePosEvent](#m-addmouseposevent).

# 项目与窗口查询

"上一项" 指刚提交的控件.

```js
imgui.createWindow(function (ui) {
    ui.withWindow('查询', null, 0, function () {
        ui.button('按住我');
        let held = ui.isItemActive();
        ui.text(held ? '按住中' : '未按住');
        let size = ui.calcTextSize('文字');
        ui.text('文字 ' + size[0].toFixed(0) + ' x ' + size[1].toFixed(0) + ' px');
        let space = ui.getContentRegionAvail();
        ui.text('剩余 ' + space[0].toFixed(0) + ' x ' + space[1].toFixed(0) + ' px');
    });
}, { width: 280, height: 200 });
```

## [m] isItemClicked

### imgui.isItemClicked(mouseButton?)

**`帧内`**

- **[ mouseButton ]** { [number](dataTypes#number) } - [MouseButton](#p-mousebutton) 的值, 默认为左键.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

上一项是否在这一帧被点击.

## [m] isItemHovered

### imgui.isItemHovered(flags?)

**`帧内`**

- **[ flags = 0 ]** { [number](dataTypes#number) } - [HoveredFlags](#p-hoveredflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

指针是否在上一项上方.

## [m] isItemActive

### imgui.isItemActive()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

上一项是否正被按住或编辑.

## [m] isItemEdited

### imgui.isItemEdited()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

上一项的值是否在这一帧改变.

## [m] isItemActivated

### imgui.isItemActivated()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

上一项是否在这一帧变为活动.

## [m] isItemDeactivated

### imgui.isItemDeactivated()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

上一项是否在这一帧结束活动.

## [m] isItemDeactivatedAfterEdit

### imgui.isItemDeactivatedAfterEdit()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

上一项是否在这一帧结束活动, 并且活动期间值有改变.

## [m] isItemFocused

### imgui.isItemFocused()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

上一项是否有键盘焦点.

## [m] isItemVisible

### imgui.isItemVisible()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

上一项是否没有被裁剪.

## [m] isAnyItemHovered

### imgui.isAnyItemHovered()

**`会话期`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

指针是否在某一项上方.

## [m] isAnyItemActive

### imgui.isAnyItemActive()

**`会话期`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

是否有项正被按住或编辑.

## [m] isWindowHovered

### imgui.isWindowHovered(flags?)

**`帧内`**

- **[ flags = 0 ]** { [number](dataTypes#number) } - [HoveredFlags](#p-hoveredflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

指针是否在当前窗口上方.

## [m] isWindowFocused

### imgui.isWindowFocused(flags?)

**`帧内`**

- **[ flags = 0 ]** { [number](dataTypes#number) } - [FocusedFlags](#p-focusedflags) 的组合.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

当前窗口是否有焦点. 用 `FocusedFlags` 可以扩大到子窗口或任意窗口.

## [m] isWindowCollapsed

### imgui.isWindowCollapsed()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

当前窗口是否折叠到标题栏.

## [m] isWindowAppearing

### imgui.isWindowAppearing()

**`帧内`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

当前窗口是否在这一帧出现.

## [m] getWindowPos

### imgui.getWindowPos()

**`帧内`**

- <ins>**returns**</ins> { [Vec2](imgui#vec2) } - 单位 px.

当前窗口的位置.

## [m] getWindowSize

### imgui.getWindowSize()

**`帧内`**

- <ins>**returns**</ins> { [Vec2](imgui#vec2) } - 单位 px.

当前窗口的大小.

## [m] getContentRegionAvail

### imgui.getContentRegionAvail()

**`帧内`**

- <ins>**returns**</ins> { [Vec2](imgui#vec2) } - 单位 px.

当前窗口的剩余空间.

## [m] getScrollX

### imgui.getScrollX()

**`帧内`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

当前窗口的横向滚动量, 单位 px.

## [m] getScrollY

### imgui.getScrollY()

**`帧内`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

当前窗口的纵向滚动量, 单位 px.

## [m] getScrollMaxX

### imgui.getScrollMaxX()

**`帧内`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

最大横向滚动量, 单位 px.

## [m] getScrollMaxY

### imgui.getScrollMaxY()

**`帧内`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

最大纵向滚动量, 单位 px.

## [m] calcTextSize

### imgui.calcTextSize(text, wrapWidth?)

**`帧内`**

- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- **[ wrapWidth = -1 ]** { [number](dataTypes#number) } - 换行宽度, 单位 px, `-1` 不换行.
- <ins>**returns**</ins> { [Vec2](imgui#vec2) } - 单位 px.

用当前字体计算文本大小.

## [m] getFrameHeight

### imgui.getFrameHeight()

**`帧内`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

带框架控件的高度, 单位 px.

## [m] getFrameHeightWithSpacing

### imgui.getFrameHeightWithSpacing()

**`帧内`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

带框架控件的高度加到下一行的间距, 单位 px.

## [m] getTextLineHeight

### imgui.getTextLineHeight()

**`帧内`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

一行文本的高度, 单位 px.

## [m] getTextLineHeightWithSpacing

### imgui.getTextLineHeightWithSpacing()

**`帧内`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

一行文本的高度加到下一行的间距, 单位 px.

## [m] framerate

### imgui.framerate()

**`会话期`**

- <ins>**returns**</ins> { [number](dataTypes#number) }

每秒帧数, 是 Dear ImGui 的滑动平均值.

# 调试与统计窗口

Dear ImGui 自带的工具窗口. 每次调用绘制一次窗口. 传入可变布尔值时窗口有关闭按钮, 点按后值变为 `false`, 所以只在它为真时调用. `createWindow({ debug: true })` 会自动显示 Metrics 和 Debug Log 窗口.

## [m] showDemoWindow

### imgui.showDemoWindow(open?)

**`帧内`**

- **[ open ]** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) } - 可变布尔值.
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制 Dear ImGui 的演示窗口.

## [m] showMetricsWindow

### imgui.showMetricsWindow(open?)

**`帧内`**

- **[ open ]** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) } - 可变布尔值.
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制 Metrics 窗口.

## [m] showDebugLogWindow

### imgui.showDebugLogWindow(open?)

**`帧内`**

- **[ open ]** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) } - 可变布尔值.
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制 Debug Log 窗口.

## [m] showIdStackToolWindow

### imgui.showIdStackToolWindow(open?)

**`帧内`**

- **[ open ]** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) } - 可变布尔值.
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制 ID Stack Tool 窗口.

## [m] showStyleEditor

### imgui.showStyleEditor(open?)

**`帧内`**

- **[ open ]** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) } - 可变布尔值.
- <ins>**returns**</ins> { [void](dataTypes#void) }

在自己的窗口 "Dear ImGui Style Editor" 中绘制样式编辑器.

## [m] showAboutWindow

### imgui.showAboutWindow(open?)

**`帧内`**

- **[ open ]** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) } - 可变布尔值.
- <ins>**returns**</ins> { [void](dataTypes#void) }

绘制 About 窗口.

## [m] showUserGuide

### imgui.showUserGuide(open?)

**`帧内`**

- **[ open ]** { [MutableValue](imgui#mutablevalue) | [null](dataTypes#null) } - 可变布尔值.
- <ins>**returns**</ins> { [void](dataTypes#void) }

在自己的窗口 "Dear ImGui User Guide" 中绘制用户指南.

# 值引用

有状态的控件要把修改写回去, 所以它们接受 [可变值](#mutablevalue) 而不是普通的数. 这些函数不需要会话. 一般用 [ref](#m-ref), Java 数组形式用于兼容.

## [m] ref

### imgui.ref(value)

**`任何时候`**

- **value** { [any](dataTypes#any) } - 初始值.
- <ins>**returns**</ins> { [ValueRef](imgui#valueref) }

创建普通的可变引用 `{ value }`. 也可以直接写 `{ value: x }`.

## [m] bool

### imgui.bool(value?)

**`任何时候`**

- **[ value = false ]** { [boolean](dataTypes#boolean) } - 初始值.
- <ins>**returns**</ins> { [IndexedRef](imgui#indexedref) }

创建单元素 Java 数组形式的可变布尔值, 用 `[0]` 读取.

## [m] int

### imgui.int(value?)

**`任何时候`**

- **[ value = 0 ]** { [number](dataTypes#number) } - 初始值.
- <ins>**returns**</ins> { [IndexedRef](imgui#indexedref) }

创建单元素 Java 数组形式的可变整数.

## [m] float

### imgui.float(value?)

**`任何时候`**

- **[ value = 0 ]** { [number](dataTypes#number) } - 初始值.
- <ins>**returns**</ins> { [IndexedRef](imgui#indexedref) }

创建单元素 Java 数组形式的可变浮点数.

## [m] string

### imgui.string(value?)

**`任何时候`**

- **[ value = '' ]** { [any](dataTypes#any) } - 初始值.
- <ins>**returns**</ins> { [IndexedRef](imgui#indexedref) }

创建单元素 Java 数组形式的可变字符串.

## [m] floats

### imgui.floats(values?)

**`任何时候`**

- **[ values ]** { [number](dataTypes#number)[] } - 初始内容.
- <ins>**returns**</ins> { [NativeArray](imgui#nativearray) }

创建 Java float 数组, 用于 `plotLines` 和多分量控件.

## [m] ints

### imgui.ints(values?)

**`任何时候`**

- **[ values ]** { [number](dataTypes#number)[] } - 初始内容.
- <ins>**returns**</ins> { [NativeArray](imgui#nativearray) }

创建 Java int 数组, 用于 `dragInt2` 至 `dragInt4`, `sliderInt2` 至 `sliderInt4`, `inputInt2` 至 `inputInt4`. 数值会被取整.

## [m] bytes

### imgui.bytes(values?)

**`任何时候`**

- **[ values ]** { [number](dataTypes#number)[] } - 初始内容.
- <ins>**returns**</ins> { [NativeArray](imgui#nativearray) }

创建 Java byte 数组.

## [m] strings

### imgui.strings(values?)

**`任何时候`**

- **[ values ]** { [any](dataTypes#any)[] } - 初始内容.
- <ins>**returns**</ins> { [NativeArray](imgui#nativearray) }

创建 Java String 数组.

# 信息与工具

## [m] version

### imgui.version()

**`任何时候`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

Dear ImGui 的版本.

## [p] density

**`READONLY`**

- { [number](dataTypes#number) }

显示密度 (每 dp 的 px 数). 有活动会话时取它的密度, 否则取屏幕的密度. 任何时候可读.

## [m] dp

### imgui.dp(value)

**`任何时候`**

- **value** { [number](dataTypes#number) } - 长度, 单位 dp.
- <ins>**returns**</ins> { [number](dataTypes#number) } - 长度, 单位 px.

把 dp 换算为 px, 例如 `ui.setNextWindowSize(ui.dp(320), ui.dp(240))`.

## [m] px

### imgui.px(value)

**`任何时候`**

- **value** { [number](dataTypes#number) } - 长度, 单位 px.
- <ins>**returns**</ins> { [number](dataTypes#number) } - 长度, 单位 dp.

把 px 换算为 dp.

## [m] icon

### imgui.icon(name, label?)

**`任何时候`**

- **name** { [string](dataTypes#string) } - [Icons](#p-icons) 的成员名.
- **[ label ]** { [any](dataTypes#any) } - 图标后的文字.
- <ins>**returns**</ins> { [string](dataTypes#string) }

返回图标字符, 后面跟 `label`. 用 `Icons` 字体显示.

## [m] getClipboardText

### imgui.getClipboardText()

**`任何时候`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

读取 Android 剪贴板的文本, 与 AutoJs6 的 `getClip` 相同. 没有文本时为空字符串.

Android 10 起, 只有默认输入法和有输入焦点的应用能读取剪贴板, 脚本在后台时得到空值或旧值. AutoJs6 的前台 Activity, `imgui.launch`, 或键盘已打开的悬浮窗文本框有焦点, 普通悬浮窗没有. 特权层的 Ctrl+C / Ctrl+V 只在它的进程内有效.

## [m] setClipboardText

### imgui.setClipboardText(text)

**`任何时候`**

- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置 Android 剪贴板的文本, 与 AutoJs6 的 `setClip` 相同.

## [m] getBackendCapabilities

### imgui.getBackendCapabilities()

**`任何时候`**

- <ins>**returns**</ins> { [BackendCapabilities](imgui#backendcapabilities) } - 参阅 [BackendCapabilities](#backendcapabilities).

查询设备支持哪些能力, 不打开窗口, 也不执行提权操作.

## [m] listExamples

### imgui.listExamples()

**`任何时候`**

- <ins>**returns**</ins> { [string](dataTypes#string)[] }

内置示例的名称.

## [m] getExampleSource

### imgui.getExampleSource(name)

**`任何时候`**

- **name** { [string](dataTypes#string) } - 示例名称.
- <ins>**returns**</ins> { [string](dataTypes#string) }

读取内置示例的源码.

## [m] runExample

### imgui.runExample(name, options?)

**`脚本线程`**

- **name** { [string](dataTypes#string) } - 示例名称.
- **[ options ]** { [ExampleOptions](imgui#exampleoptions) } - 选项, 参阅 [ExampleOptions](#exampleoptions).
- <ins>**returns**</ins> { [ImguiSession](imguiSessionType) } - 示例的会话.

运行内置示例, 在脚本线程上帧外调用.

# 常量

常量组挂在 `imgui` 和 `ui` 上, 标志组的值用 `|` 组合, 例如 `ui.WindowFlags.NoMove | ui.WindowFlags.NoResize`. 组名对应 Dear ImGui 的枚举: `WindowFlags.NoMove` 就是 `ImGuiWindowFlags_NoMove`, 含义见 Dear ImGui 的 [imgui.h](https://github.com/ocornut/imgui/blob/master/imgui.h). 下面列出各组的成员名.

## [p] Limits

**`READONLY`**

- { [Object](dataTypes#object) }

固定的上限.

| 成员 | 值 | 含义 |
| --- | --- | --- |
| `InputTextMaxBytes` | 65536 | 文本框的最大容量, 单位字节 |
| `SelectionMaxItems` | 512 | `combo` 与 `listBox` 的最大项数 |
| `InputQueueCapacity` | 2048 | 输入队列的容量, 超出时丢弃最旧的事件 |
| `DragDropPayloadMaxBytes` | 65536 | 拖放载荷的最大长度, 单位 JSON 字节 |

## [p] BackendStatus

**`READONLY`**

- { [Object](dataTypes#object) }

[BackendCapabilities](#backendcapabilities) 中 `status` 的值.

| 成员 | 值 | 含义 |
| --- | --- | --- |
| `Available` | `'available'` | 可用且受支持 |
| `Experimental` | `'experimental'` | 可用, 但可能改变 |
| `Unavailable` | `'unavailable'` | 这台设备不能用 |
| `Deferred` | `'deferred'` | 尚未实现 |

## [p] Cond

**`READONLY`**

- { [Object](dataTypes#object) }

`setNextWindowPos` 等函数何时生效.

成员 (5): `None`, `Always`, `Once`, `FirstUseEver`, `Appearing`

## [p] WindowFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[begin](#m-begin) 与 [withWindow](#m-withwindow) 的标志.

成员 (23): `None`, `NoTitleBar`, `NoResize`, `NoMove`, `NoScrollbar`, `NoScrollWithMouse`, `NoCollapse`, `AlwaysAutoResize`, `NoBackground`, `NoSavedSettings`, `NoMouseInputs`, `MenuBar`, `HorizontalScrollbar`, `NoFocusOnAppearing`, `NoBringToFrontOnFocus`, `AlwaysVerticalScrollbar`, `AlwaysHorizontalScrollbar`, `NoNavInputs`, `NoNavFocus`, `UnsavedDocument`, `NoNav`, `NoDecoration`, `NoInputs`

## [p] ChildFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[beginChild](#m-beginchild) 的标志.

成员 (10): `None`, `Borders`, `AlwaysUseWindowPadding`, `ResizeX`, `ResizeY`, `AutoResizeX`, `AutoResizeY`, `AlwaysAutoResize`, `FrameStyle`, `NavFlattened`

## [p] InputTextFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[inputText](#m-inputtext) 等函数的标志. 依赖回调的标志没有开放.

成员 (18): `None`, `CharsDecimal`, `CharsHexadecimal`, `CharsScientific`, `CharsUppercase`, `CharsNoBlank`, `AllowTabInput`, `EnterReturnsTrue`, `EscapeClearsAll`, `CtrlEnterForNewLine`, `ReadOnly`, `Password`, `AlwaysOverwrite`, `AutoSelectAll`, `NoHorizontalScroll`, `NoUndoRedo`, `ElideLeft`, `WordWrap`

## [p] SliderFlags

**`READONLY`**

- { [Object](dataTypes#object) }

滑块和拖动框的标志.

成员 (10): `None`, `Logarithmic`, `NoRoundToFormat`, `NoInput`, `WrapAround`, `ClampOnInput`, `ClampZeroRange`, `NoSpeedTweaks`, `ColorMarkers`, `AlwaysClamp`

## [p] TreeNodeFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[treeNodeEx](#m-treenodeex) 与 [collapsingHeader](#m-collapsingheader) 的标志.

成员 (19): `None`, `Selected`, `Framed`, `AllowOverlap`, `NoTreePushOnOpen`, `NoAutoOpenOnLog`, `DefaultOpen`, `OpenOnDoubleClick`, `OpenOnArrow`, `Leaf`, `Bullet`, `FramePadding`, `SpanAvailWidth`, `SpanFullWidth`, `SpanLabelWidth`, `SpanAllColumns`, `LabelSpanAllColumns`, `NavLeftJumpsToParent`, `CollapsingHeader`

## [p] SelectableFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[selectable](#m-selectable) 的标志.

成员 (8): `None`, `NoAutoClosePopups`, `SpanAllColumns`, `AllowDoubleClick`, `Disabled`, `AllowOverlap`, `Highlight`, `SelectOnNav`

## [p] TabBarFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[beginTabBar](#m-begintabbar) 的标志.

成员 (11): `None`, `Reorderable`, `AutoSelectNewTabs`, `TabListPopupButton`, `NoCloseWithMiddleMouseButton`, `NoTabListScrollingButtons`, `NoTooltip`, `DrawSelectedOverline`, `FittingPolicyMixed`, `FittingPolicyShrink`, `FittingPolicyScroll`

## [p] TabItemFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[beginTabItem](#m-begintabitem) 的标志.

成员 (10): `None`, `UnsavedDocument`, `SetSelected`, `NoCloseWithMiddleMouseButton`, `NoPushId`, `NoTooltip`, `NoReorder`, `Leading`, `Trailing`, `NoAssumedClosure`

## [p] MouseButton

**`READONLY`**

- { [Object](dataTypes#object) }

指针按键. 单指点按是 `Left`, 长按是 `Right`.

成员 (3): `Left`, `Right`, `Middle`

## [p] ComboFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[beginCombo](#m-begincombo) 的标志.

成员 (9): `None`, `PopupAlignLeft`, `HeightSmall`, `HeightRegular`, `HeightLarge`, `HeightLargest`, `NoArrowButton`, `NoPreview`, `WidthFitPreview`

## [p] PopupFlags

**`READONLY`**

- { [Object](dataTypes#object) }

弹窗函数的标志.

成员 (10): `None`, `MouseButtonLeft`, `MouseButtonRight`, `MouseButtonMiddle`, `NoReopen`, `NoOpenOverExistingPopup`, `NoOpenOverItems`, `AnyPopupId`, `AnyPopupLevel`, `AnyPopup`

## [p] HoveredFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[isItemHovered](#m-isitemhovered) 与 [isWindowHovered](#m-iswindowhovered) 的标志.

成员 (20): `None`, `ChildWindows`, `RootWindow`, `AnyWindow`, `NoPopupHierarchy`, `AllowWhenBlockedByPopup`, `AllowWhenBlockedByActiveItem`, `AllowWhenOverlappedByItem`, `AllowWhenOverlappedByWindow`, `AllowWhenDisabled`, `NoNavOverride`, `AllowWhenOverlapped`, `RectOnly`, `RootAndChildWindows`, `ForTooltip`, `Stationary`, `DelayNone`, `DelayShort`, `DelayNormal`, `NoSharedDelay`

## [p] FocusedFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[isWindowFocused](#m-iswindowfocused) 的标志.

成员 (6): `None`, `ChildWindows`, `RootWindow`, `AnyWindow`, `NoPopupHierarchy`, `RootAndChildWindows`

## [p] ColorEditFlags

**`READONLY`**

- { [Object](dataTypes#object) }

颜色控件的标志.

成员 (27): `None`, `NoAlpha`, `NoPicker`, `NoOptions`, `NoSmallPreview`, `NoInputs`, `NoTooltip`, `NoLabel`, `NoSidePreview`, `NoDragDrop`, `NoBorder`, `NoColorMarkers`, `AlphaOpaque`, `AlphaNoBg`, `AlphaPreviewHalf`, `AlphaBar`, `HDR`, `DisplayRGB`, `DisplayHSV`, `DisplayHex`, `Uint8`, `Float`, `PickerHueBar`, `PickerHueWheel`, `PickerNoRotate`, `InputRGB`, `InputHSV`

## [p] TableFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[beginTable](#m-begintable) 的标志.

成员 (36): `None`, `Resizable`, `Reorderable`, `Hideable`, `Sortable`, `NoSavedSettings`, `ContextMenuInBody`, `RowBg`, `BordersInnerH`, `BordersOuterH`, `BordersInnerV`, `BordersOuterV`, `BordersH`, `BordersV`, `BordersInner`, `BordersOuter`, `Borders`, `NoBordersInBody`, `NoBordersInBodyUntilResize`, `SizingFixedFit`, `SizingFixedSame`, `SizingStretchProp`, `SizingStretchSame`, `NoHostExtendX`, `NoHostExtendY`, `NoKeepColumnsVisible`, `PreciseWidths`, `NoClip`, `PadOuterX`, `NoPadOuterX`, `NoPadInnerX`, `ScrollX`, `ScrollY`, `SortMulti`, `SortTristate`, `HighlightHoveredColumn`

## [p] TableColumnFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[tableSetupColumn](#m-tablesetupcolumn) 的标志.

成员 (24): `None`, `Disabled`, `DefaultHide`, `DefaultSort`, `WidthStretch`, `WidthFixed`, `NoResize`, `NoReorder`, `NoHide`, `NoClip`, `NoSort`, `NoSortAscending`, `NoSortDescending`, `NoHeaderLabel`, `NoHeaderWidth`, `PreferSortAscending`, `PreferSortDescending`, `IndentEnable`, `IndentDisable`, `AngledHeader`, `IsEnabled`, `IsVisible`, `IsSorted`, `IsHovered`

## [p] TableRowFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[tableNextRow](#m-tablenextrow) 的标志.

成员 (2): `None`, `Headers`

## [p] TableBgTarget

**`READONLY`**

- { [Object](dataTypes#object) }

[tableSetBgColor](#m-tablesetbgcolor) 的目标.

成员 (4): `None`, `RowBg0`, `RowBg1`, `CellBg`

## [p] SortDirection

**`READONLY`**

- { [Object](dataTypes#object) }

[TableColumnSortSpecs](#tablecolumnsortspecs) 的 `sortDirection`.

成员 (3): `None`, `Ascending`, `Descending`

## [p] Col

**`READONLY`**

- { [Object](dataTypes#object) }

样式颜色, 用于 [pushStyleColor](#m-pushstylecolor) 与 [setStyleColor](#m-setstylecolor).

成员 (61): `Text`, `TextDisabled`, `WindowBg`, `ChildBg`, `PopupBg`, `Border`, `BorderShadow`, `FrameBg`, `FrameBgHovered`, `FrameBgActive`, `TitleBg`, `TitleBgActive`, `TitleBgCollapsed`, `MenuBarBg`, `ScrollbarBg`, `ScrollbarGrab`, `ScrollbarGrabHovered`, `ScrollbarGrabActive`, `CheckMark`, `CheckboxSelectedBg`, `SliderGrab`, `SliderGrabActive`, `Button`, `ButtonHovered`, `ButtonActive`, `Header`, `HeaderHovered`, `HeaderActive`, `Separator`, `SeparatorHovered`, `SeparatorActive`, `ResizeGrip`, `ResizeGripHovered`, `ResizeGripActive`, `InputTextCursor`, `TabHovered`, `Tab`, `TabSelected`, `TabSelectedOverline`, `TabDimmed`, `TabDimmedSelected`, `TabDimmedSelectedOverline`, `PlotLines`, `PlotLinesHovered`, `PlotHistogram`, `PlotHistogramHovered`, `TableHeaderBg`, `TableBorderStrong`, `TableBorderLight`, `TableRowBg`, `TableRowBgAlt`, `TextLink`, `TextSelectedBg`, `TreeLines`, `DragDropTarget`, `DragDropTargetBg`, `UnsavedMarker`, `NavCursor`, `NavWindowingHighlight`, `NavWindowingDimBg`, `ModalWindowDimBg`

## [p] StyleVar

**`READONLY`**

- { [Object](dataTypes#object) }

样式变量, 用于 [pushStyleVar](#m-pushstylevar) 与 [setStyleProperties](#m-setstyleproperties).

成员 (44): `Alpha`, `DisabledAlpha`, `WindowPadding`, `WindowRounding`, `WindowBorderSize`, `WindowMinSize`, `WindowTitleAlign`, `ChildRounding`, `ChildBorderSize`, `PopupRounding`, `PopupBorderSize`, `FramePadding`, `FrameRounding`, `FrameBorderSize`, `ItemSpacing`, `ItemInnerSpacing`, `IndentSpacing`, `CellPadding`, `ScrollbarSize`, `ScrollbarRounding`, `ScrollbarPadding`, `GrabMinSize`, `GrabRounding`, `ImageRounding`, `ImageBorderSize`, `TabRounding`, `TabBorderSize`, `TabMinWidthBase`, `TabMinWidthShrink`, `TabBarBorderSize`, `TabBarOverlineSize`, `TableAngledHeadersAngle`, `TableAngledHeadersTextAlign`, `TreeLinesSize`, `TreeLinesRounding`, `MenuItemRounding`, `SelectableRounding`, `DragDropTargetRounding`, `ButtonTextAlign`, `SelectableTextAlign`, `SeparatorSize`, `SeparatorTextBorderSize`, `SeparatorTextAlign`, `SeparatorTextPadding`

## [p] Themes

**`READONLY`**

- { [Object](dataTypes#object) }

主题名, 用于 [setTheme](#m-settheme) 与 `theme` 选项.

| 成员 | 值 |
| --- | --- |
| `Dark` | `'dark'` |
| `Light` | `'light'` |
| `Classic` | `'classic'` |
| `Pink` | `'pink'` |
| `Blue` | `'blue'` |
| `ModernDark` | `'modern-dark'` |
| `CyanDusk` | `'cyan-dusk'` |
| `OrangeDark` | `'orange-dark'` |
| `CrystalClear` | `'crystal-clear'` |
| `VibrantNight` | `'vibrant-night'` |
| `PurpleDream` | `'purple-dream'` |

## [p] Appearance

**`READONLY`**

- { [Object](dataTypes#object) }

外观预设: 圆角, 边框和阴影的组合.

| 成员 | 值 |
| --- | --- |
| `Flat` | `'flat'` |
| `Rounded` | `'rounded'` |
| `Card` | `'card'` |

## [p] Fonts

**`READONLY`**

- { [Object](dataTypes#object) }

每个会话都有的字体.

成员 (3): `Default`, `CjkFallback`, `Icons`

## [p] TextureFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[createTexture](#m-createtexture) 的标志.

成员 (4): `None`, `Nearest`, `Repeat`, `Mipmaps`

## [p] DrawListLayer

**`READONLY`**

- { [Object](dataTypes#object) }

绘制列表的层次.

成员 (3): `Window`, `Foreground`, `Background`

## [p] DrawFlags

**`READONLY`**

- { [Object](dataTypes#object) }

绘制列表函数的标志.

成员 (12): `None`, `RoundCornersTopLeft`, `RoundCornersTopRight`, `RoundCornersBottomLeft`, `RoundCornersBottomRight`, `RoundCornersNone`, `RoundCornersAll`, `RoundCornersTop`, `RoundCornersBottom`, `RoundCornersLeft`, `RoundCornersRight`, `Closed`

## [p] TouchMode

**`READONLY`**

- { [Object](dataTypes#object) }

悬浮窗接收哪些触摸.

| 成员 | 值 | 含义 |
| --- | --- | --- |
| `Touchable` | `'touchable'` | 整个 Surface 接收触摸, 触摸空白处可以移动悬浮窗 |
| `Passthrough` | `'passthrough'` | 触摸全部穿透到下层应用 |
| `Auto` | `'auto'` | 只有根窗口接收触摸, 其余穿透. 这是悬浮窗的默认值, 最多 64 个矩形, 在没有手指按下时刷新 |

## [p] WindowMode

**`READONLY`**

- { [Object](dataTypes#object) }

会话绘制的位置.

| 成员 | 值 |
| --- | --- |
| `Overlay` | `'overlay'` |
| `Activity` | `'activity'` |
| `Privileged` | `'privileged'` |

## [p] LogLevel

**`READONLY`**

- { [Object](dataTypes#object) }

日志和消息的等级.

| 成员 | 值 |
| --- | --- |
| `Log` | `'log'` |
| `Debug` | `'debug'` |
| `Info` | `'info'` |
| `Warn` | `'warn'` |
| `Error` | `'error'` |

## [p] ToastPosition

**`READONLY`**

- { [Object](dataTypes#object) }

组件的锚点: 屏幕的角, 边或中心.

| 成员 | 值 |
| --- | --- |
| `TopLeft` | `'top-left'` |
| `TopCenter` | `'top-center'` |
| `TopRight` | `'top-right'` |
| `Center` | `'center'` |
| `BottomLeft` | `'bottom-left'` |
| `BottomCenter` | `'bottom-center'` |
| `BottomRight` | `'bottom-right'` |

## [p] Icons

**`READONLY`**

- { [Object](dataTypes#object) }

Material 图标, 值是 `Icons` 字体里的字符. 用 [icon](#m-icon) 取得, 或用 `Fonts.Icons` 字体显示.

成员 (38): `Error`, `Warning`, `Pause`, `Play`, `Stop`, `Add`, `Copy`, `Save`, `Download`, `Upload`, `Edit`, `ArrowBack`, `ArrowForward`, `Check`, `ChevronLeft`, `ChevronRight`, `Close`, `ExpandLess`, `ExpandMore`, `Menu`, `MoreHoriz`, `MoreVert`, `Refresh`, `Person`, `Star`, `BugReport`, `Code`, `Delete`, `DoneAll`, `Favorite`, `Home`, `Info`, `Lock`, `LockOpen`, `Search`, `Settings`, `Visibility`, `VisibilityOff`

## [p] Dir

**`READONLY`**

- { [Object](dataTypes#object) }

方向, 用于 [arrowButton](#m-arrowbutton).

成员 (5): `None`, `Left`, `Right`, `Up`, `Down`

## [p] ButtonFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[invisibleButton](#m-invisiblebutton) 的标志.

成员 (5): `None`, `MouseButtonLeft`, `MouseButtonRight`, `MouseButtonMiddle`, `EnableNav`

## [p] Key

**`READONLY`**

- { [Object](dataTypes#object) }

键盘按键. 数字键 0 到 9 是 `Digit0` 到 `Digit9`. `ModCtrl` 等与 `Mod.Ctrl` 等的值相同.

成员 (125): `None`, `Tab`, `LeftArrow`, `RightArrow`, `UpArrow`, `DownArrow`, `PageUp`, `PageDown`, `Home`, `End`, `Insert`, `Delete`, `Backspace`, `Space`, `Enter`, `Escape`, `LeftCtrl`, `LeftShift`, `LeftAlt`, `LeftSuper`, `RightCtrl`, `RightShift`, `RightAlt`, `RightSuper`, `Menu`, `Digit0`, `Digit1`, `Digit2`, `Digit3`, `Digit4`, `Digit5`, `Digit6`, `Digit7`, `Digit8`, `Digit9`, `A`, `B`, `C`, `D`, `E`, `F`, `G`, `H`, `I`, `J`, `K`, `L`, `M`, `N`, `O`, `P`, `Q`, `R`, `S`, `T`, `U`, `V`, `W`, `X`, `Y`, `Z`, `F1`, `F2`, `F3`, `F4`, `F5`, `F6`, `F7`, `F8`, `F9`, `F10`, `F11`, `F12`, `F13`, `F14`, `F15`, `F16`, `F17`, `F18`, `F19`, `F20`, `F21`, `F22`, `F23`, `F24`, `Apostrophe`, `Comma`, `Minus`, `Period`, `Slash`, `Semicolon`, `Equal`, `LeftBracket`, `Backslash`, `RightBracket`, `GraveAccent`, `CapsLock`, `ScrollLock`, `NumLock`, `PrintScreen`, `Pause`, `Keypad0`, `Keypad1`, `Keypad2`, `Keypad3`, `Keypad4`, `Keypad5`, `Keypad6`, `Keypad7`, `Keypad8`, `Keypad9`, `KeypadDecimal`, `KeypadDivide`, `KeypadMultiply`, `KeypadSubtract`, `KeypadAdd`, `KeypadEnter`, `KeypadEqual`, `AppBack`, `AppForward`, `Oem102`, `ModCtrl`, `ModShift`, `ModAlt`, `ModSuper`

## [p] Mod

**`READONLY`**

- { [Object](dataTypes#object) }

修饰键位, 用 `|` 与按键组成组合键: `ui.Mod.Ctrl | ui.Key.S`.

成员 (5): `None`, `Ctrl`, `Shift`, `Alt`, `Super`

## [p] InputFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[shortcut](#m-shortcut) 与 [setNextItemShortcut](#m-setnextitemshortcut) 的标志.

成员 (11): `None`, `Repeat`, `RouteActive`, `RouteFocused`, `RouteGlobal`, `RouteAlways`, `RouteOverFocused`, `RouteOverActive`, `RouteUnlessBgFocused`, `RouteFromRootWindow`, `Tooltip`

## [p] DragDropFlags

**`READONLY`**

- { [Object](dataTypes#object) }

拖放函数的标志.

成员 (14): `None`, `SourceNoPreviewTooltip`, `SourceNoDisableHover`, `SourceNoHoldToOpenOthers`, `SourceAllowNullID`, `SourceExtern`, `PayloadAutoExpire`, `PayloadNoCrossContext`, `PayloadNoCrossProcess`, `AcceptBeforeDelivery`, `AcceptNoDrawDefaultRect`, `AcceptNoPreviewTooltip`, `AcceptDrawAsHovered`, `AcceptPeekOnly`

## [p] MultiSelectFlags

**`READONLY`**

- { [Object](dataTypes#object) }

[beginMultiSelect](#m-beginmultiselect) 的标志. 没有 `NoSelectAll` 时 Ctrl+A 全选. `ClearOnEscape` 和框选类标志默认关闭.

成员 (19): `None`, `SingleSelect`, `NoSelectAll`, `NoRangeSelect`, `NoAutoSelect`, `NoAutoClear`, `NoAutoClearOnReselect`, `BoxSelect1d`, `BoxSelect2d`, `BoxSelectNoScroll`, `ClearOnEscape`, `ClearOnClickVoid`, `ScopeWindow`, `ScopeRect`, `SelectOnAuto`, `SelectOnClickAlways`, `SelectOnClickRelease`, `NavWrapX`, `NoSelectOnRightClick`

# 数据类型

## MutableValue

可变值, 控件读取它并写回修改. 有两种形式:

- [ValueRef](#valueref): `imgui.ref(x)` 或普通的 `{ value: x }` 对象, 读写 `.value`.
- [IndexedRef](#indexedref): `imgui.bool`, `imgui.int`, `imgui.float`, `imgui.string` 返回的单元素 Java 数组, 读写 `[0]`.

## NumberArrayValue

可变数值数组, 用于多分量控件: `imgui.floats([...])`, `imgui.ints([...])` 或 `{ value: [...] }`.

## ValueRef

普通的可变引用, 只有一个 `value` 属性.

## IndexedRef

单元素 Java 数组, 成员 `[0]` 是当前值, `length` 总是 1.

## NativeArray

`floats`, `ints`, `bytes`, `strings` 返回的 Java 数组, 用索引访问, 有 `length`.

## Vec2

`getWindowPos` 等函数返回的两元素 Java float 数组: `[0]` 是 x 或宽度, `[1]` 是 y 或高度, 单位 px (另有说明的除外).

## Point

位置或尺寸的写法: `[x, y]`, `{ x, y }`, 或 `getWindowPos` 等函数的返回值.

## Color

颜色有四种写法:

- 打包的 32 位整数, Dear ImGui 的 `0xAABBGGRR` 顺序, 即 [colorU32](#m-coloru32) 的返回值.
- 数组 `[r, g, b]` 或 `[r, g, b, a]`.
- 对象 `{ r, g, b, a }`, `a` 可以省略.
- 字符串 `'#rgb'`, `'#rgba'`, `'#rrggbb'` 或 `'#rrggbbaa'`.

数组和对象的分量是 `0..1`, 大于 1 的分量按 `0..255` 读取, 不透明度默认为 1. 接受颜色的函数也接受按位置传入的分量 `(r, g, b, a)`. 无效的颜色抛出 TypeError 或 RangeError.

## TextureSource

图像来源: 文件路径 (相对路径按 `files.path` 解析), 编码后的图像字节 (`number[]`, Java `byte[]`, ArrayBuffer, 类型化数组, ByteBuffer, InputStream), `android.graphics.Bitmap`, 或 AutoJs6 的图像 (`images.read`, `images.captureScreen` 等的返回值).

## RenderCallback

渲染回调 `(ui, session) => void`, 在脚本线程上绘制一帧. `ui` 是 API 对象 (与 `imgui` 相同), `session` 是 [ImguiSession](imguiSessionType).

## FrameBody

[with* 作用域](#with-作用域) 的函数体 `() => void`, 在脚本线程的帧内运行.

## WindowOptions

[createWindow](#m-createwindow) 的选项. Android 窗口的尺寸和位置单位是 dp (1 dp = `imgui.density` px), 帧内坐标仍是 px. 类型错误, NaN 或超出范围时抛出 TypeError 或 RangeError, 写明选项名.

此外接受 [StyleVar](#p-stylevar) 成员的小驼峰名称作为样式尺寸, 例如 `windowRounding: 8`, 写法与 [StyleProperties](#styleproperties) 相同.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `mode` | [WindowMode](imgui#p-windowmode) | 绘制位置, 默认 `'overlay'`. |
| `backend` | [string](dataTypes#string) | 特权层的启动方式, `auto` 优先用可用的宿主 Shizuku 服务. |
| `privilegedBackend` | [string](dataTypes#string) | `backend` 的别名, 只在 `mode` 为 `'privileged'` 时读取. |
| `startupTimeout` | [number](dataTypes#number) | 特权子进程的启动期限, 单位 ms, `1..15000`, 默认 10000. |
| `rotation` | `0` 或 `90` 或 `180` 或 `270` | 触摸坐标的旋转角度, 省略时从屏幕推断. |
| `width` | [number](dataTypes#number) | 悬浮窗宽度, 单位 dp, 至少 1, 默认 360, 不超过屏幕. |
| `w` | [number](dataTypes#number) | `width` 的别名. |
| `height` | [number](dataTypes#number) | 悬浮窗高度, 单位 dp, 至少 1, 默认 420, 不超过屏幕. |
| `h` | [number](dataTypes#number) | `height` 的别名. |
| `x` | [number](dataTypes#number) | 左边缘, 单位 dp, 限制在屏幕内. 默认距屏幕右边 12 dp. |
| `y` | [number](dataTypes#number) | 上边缘, 单位 dp, 限制在屏幕内. 默认距屏幕底边 72 dp. |
| `fps` | [number](dataTypes#number) | 展开时的帧率, `15..120`, 默认 60. |
| `collapsedFps` | [number](dataTypes#number) | 收起时的帧率, `1..15`, 默认 5. |
| `idleFps` | [number](dataTypes#number) | 无输入 `idleDelay` 毫秒后的帧率, `0..120`, 默认 10, `0` 保持全速. 有输入时立刻恢复 `fps`. 靠帧驱动的动画需要设为 0, 或运行时调用 `session.setIdleFps(0)`. |
| `idleDelay` | [number](dataTypes#number) | 进入空闲帧率之前的无输入时间, 单位 ms, `100..3600000`, 默认 3000. |
| `movable` | [boolean](dataTypes#boolean) | 是否允许触摸悬浮窗空白处移动它 (`TouchMode.Touchable`), 默认 `true`. |
| `fontPath` | [string](dataTypes#string) | 默认字体的文件, 默认为内置字体. |
| `fontSize` | [number](dataTypes#number) | 默认字体大小, 单位 dp, `8..64`, 默认 16. |
| `fonts` | ([string](dataTypes#string) 或 [FontDefinition](imgui#fontdefinition))[] | 附加字体, 最多 16 个, 参阅 [FontDefinition](#fontdefinition). |
| `systemCjkFont` | [boolean](dataTypes#boolean) | 让 Android 绘制 `fontPath` 与 `fonts` 缺少的 CJK 字符, 默认 `false`. 每个字形在首次使用时绘制, 不在内存中保留字体文件. |
| `pinchZoom` | [boolean](dataTypes#boolean) | 允许双指改变会话的字体缩放, 默认 `false`. 双指距离变化 24 dp 后滚动转为捏合, 直到抬起. 特权层不可用. 结果见 `session.fontScale` 或 `fontScaleChanged` 事件. |
| `iniPath` | [string](dataTypes#string) 或 [boolean](dataTypes#boolean) 或 [null](dataTypes#null) | 保存窗口位置的位置: 路径, 或 `true` 表示 `./imgui.ini`. 默认关闭. |
| `ime` | [boolean](dataTypes#boolean) | 文本输入, 默认 `true`. 悬浮窗和 Activity 接入系统输入法. 特权层打开临时输入框 (需要悬浮窗权限), 输入期间隐藏图层. `false` 都关闭. |
| `fling` | [boolean](dataTypes#boolean) | 是否惯性滚动, 默认 `true`. |
| `flingFriction` | [number](dataTypes#number) | 惯性减速度, `0.5..30`, 默认 5.5. |
| `flingMinVelocity` | [number](dataTypes#number) | 最低惯性速度, 单位 dp/s, 默认 80. |
| `flingMaxVelocity` | [number](dataTypes#number) | 最高惯性速度, 单位 dp/s, 默认 8000. |
| `dragThreshold` | [number](dataTypes#number) | 触摸移动多远才算拖动, 单位 dp, 默认 10. |
| `longPressAsRightClick` | [boolean](dataTypes#boolean) | 是否把长按当作右键, 默认 `true`. |
| `longPressDuration` | [number](dataTypes#number) | 长按时长, 单位 ms, `250..2000`, 默认为系统的长按时长. |
| `longPressSlop` | [number](dataTypes#number) | 长按期间允许移动的距离, 单位 dp, 默认 10. |
| `moreTouch` | [boolean](dataTypes#boolean) | 让窗口上的触摸同时到达下层应用, 默认 `false`. |
| `touchMode` | [TouchMode](imgui#p-touchmode) 或 [boolean](dataTypes#boolean) | 悬浮窗接收哪些触摸. `true` 为 `Touchable`, `false` 为 `Passthrough`, 悬浮窗默认 `Auto`. |
| `touchable` | [TouchMode](imgui#p-touchmode) 或 [boolean](dataTypes#boolean) | 没有 `touchMode` 时使用. |
| `alpha` | [number](dataTypes#number) | 窗口不透明度, `0..1`, 默认 1. |
| `secure` | [boolean](dataTypes#boolean) | `FLAG_SECURE`: 窗口不出现在截图中, 默认 `false`. |
| `immersive` | [boolean](dataTypes#boolean) | Activity 模式下隐藏系统栏, 默认 `true`. |
| `responsive` | [boolean](dataTypes#boolean) | 跟随显示尺寸变化, 默认 `true`. |
| `contentAutoResize` | [boolean](dataTypes#boolean) | 让悬浮窗跟随 `AlwaysAutoResize` 根窗口的大小, 默认 `true`. 这个调整作用于整个 Surface. |
| `autoResize` | [boolean](dataTypes#boolean) | `false` 时也关闭 `contentAutoResize`. |
| `contentPadding` | [number](dataTypes#number) | `contentAutoResize` 时内容四周的留白, 单位 dp, 默认 8. |
| `contentMinWidth` | [number](dataTypes#number) | 自动调整的最小宽度, 单位 dp, 默认 48. |
| `contentMinHeight` | [number](dataTypes#number) | 自动调整的最小高度, 单位 dp, 默认 48. |
| `contentMaxWidth` | [number](dataTypes#number) | 自动调整的最大宽度, 单位 dp, 默认为屏幕宽度. |
| `contentMaxHeight` | [number](dataTypes#number) | 自动调整的最大高度, 单位 dp, 默认为屏幕高度. |
| `theme` | [ThemeName](imgui#p-themes) | 初始主题, 默认 `'dark'`. |
| `appearance` | [AppearanceName](imgui#p-appearance) | 圆角, 边框和阴影的预设. |
| `rounding` | [number](dataTypes#number) | 窗口, 框架, 弹窗等的圆角, 单位 dp. |
| `borderSize` | [number](dataTypes#number) | 窗口, 框架和弹窗的边框宽度, 单位 dp. |
| `style` | [StyleProperties](imgui#styleproperties) | 初始的样式尺寸和颜色. |
| `styleProperties` | [StyleProperties](imgui#styleproperties) | 在 `style` 之后应用. |
| `shadow` | [boolean](dataTypes#boolean) 或 [number](dataTypes#number) 或 [Color](imgui#color) | 窗口阴影: 布尔值, 不透明度 `0..1` 或颜色. |
| `shadowColor` | [Color](imgui#color) | 阴影颜色, 优先于 `shadow`. |
| `collapseButton` | [boolean](dataTypes#boolean) 或 [FloatingButtonOptions](imguiFloatingButtonType#floatingbuttonoptions) | `collapse` 时显示的悬浮按钮, 除特权层外默认开启. 也可以传 [FloatingButtonOptions](imguiFloatingButtonType#floatingbuttonoptions). |
| `collapseLabel` | [string](dataTypes#string) | 这个按钮的文字, 默认 `'IM'`. |
| `debug` | [boolean](dataTypes#boolean) | 调试模式: Dear ImGui 能恢复的用法错误 (例如 begin 没有 end) 和失败的断言用 `console.warn` 打印并写入 logcat, 显示 Metrics 和 Debug Log 窗口. 窗口要足够大. 运行超过 250 ms 的渲染回调也打印 `console.warn`, 最多每 10 秒一次. |
| `events` | [Object](dataTypes#object) | 会话事件监听器, 按事件名. |
| `onError` | [SessionEventListener](imguiSessionType#事件) | `error` 事件的监听器. |
| `onMoved` | [SessionEventListener](imguiSessionType#事件) | `moved` 事件的监听器. |
| `onResized` | [SessionEventListener](imguiSessionType#事件) | `resized` 事件的监听器. |
| `onReady` | [SessionEventListener](imguiSessionType#事件) | `ready` 事件的监听器. |
| `onSurfaceRestored` | [SessionEventListener](imguiSessionType#事件) | `surfaceRestored` 事件的监听器. |
| `onCollapsed` | [SessionEventListener](imguiSessionType#事件) | `collapsed` 事件的监听器. |
| `onExpanded` | [SessionEventListener](imguiSessionType#事件) | `expanded` 事件的监听器. |
| `onClosed` | [SessionEventListener](imguiSessionType#事件) | `closed` 事件的监听器. |
| `onConfigurationChanged` | [SessionEventListener](imguiSessionType#事件) | `configurationChanged` 事件的监听器. |
| `onTouchableChanged` | [SessionEventListener](imguiSessionType#事件) | `touchableChanged` 事件的监听器. |
| `onMoreTouchChanged` | [SessionEventListener](imguiSessionType#事件) | `moreTouchChanged` 事件的监听器. |
| `onAlphaChanged` | [SessionEventListener](imguiSessionType#事件) | `alphaChanged` 事件的监听器. |
| `onSecureChanged` | [SessionEventListener](imguiSessionType#事件) | `secureChanged` 事件的监听器. |
| `onIdle` | [SessionEventListener](imguiSessionType#事件) | `idle` 事件的监听器. |
| `onActive` | [SessionEventListener](imguiSessionType#事件) | `active` 事件的监听器. |
| `onBack` | [SessionEventListener](imguiSessionType#事件) | `back` 事件 (Activity 模式) 的监听器. |
| `onFontScaleChanged` | [SessionEventListener](imguiSessionType#事件) | `fontScaleChanged` 事件的监听器. |

## FontDefinition

`fonts` 选项的元素, 也可以直接写字符串.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `id` | [string](dataTypes#string) | 用于 `session.fonts`, `pushFont` 等的名称. |
| `name` | [string](dataTypes#string) | 没有 `id` 时使用. 默认依次为 `font1`, `font2`. |
| `path` | [string](dataTypes#string) | 字体文件路径. |
| `asset` | [string](dataTypes#string) | 插件 APK 内 assets 的路径, 代替 `path`. |
| `size` | [number](dataTypes#number) | 字体大小, 单位 dp, `8..128`, 默认为默认字体大小. |

## StyleProperties

[setStyleProperties](#m-setstyleproperties) 与 `style` 选项的参数. 此外接受 [StyleVar](#p-stylevar) 成员的小驼峰名称作为样式尺寸: 数值, 或双分量变量的 [Point](#point) (数值同时设置两个分量). 长度单位 dp, `Alpha`, `DisabledAlpha` 和对齐是比例.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `colors` | [Object](dataTypes#object) | 按 [Col](#p-col) 成员名指定的颜色, 首字母大小写均可. |

## PlotOptions

[plotLines](#m-plotlines) 与 [plotHistogram](#m-plothistogram) 的选项.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `valuesOffset` | [number](dataTypes#number) | 绘图起始的索引 (循环), 默认 0. |
| `offset` | [number](dataTypes#number) | 已废弃. 1.10.0 及更早版本读取的名称, 没有 `valuesOffset` 时使用. |
| `overlay` | [string](dataTypes#string) | 叠加在图上的文字. |
| `scaleMin` | [number](dataTypes#number) | 图的下界, 默认为最小值. |
| `scaleMax` | [number](dataTypes#number) | 图的上界, 默认为最大值. |
| `width` | [number](dataTypes#number) | 宽度, 单位 px, `0` 适配项宽. |
| `height` | [number](dataTypes#number) | 高度, 单位 px, `0` 为一个框架高度. |
| `stride` | [number](dataTypes#number) | 每隔 `stride` 个值取一个, 默认 1. 单位是值, 不是字节. |

## ListClipperOptions

[listClipper](#m-listclipper) 的选项.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `itemHeight` | [number](dataTypes#number) | 行高, 单位 px. 省略时测量第一行. 给出时必须大于 0. |
| `includeItems` | [number](dataTypes#number)[] | 总是提交的行索引, 例如选中或有焦点的行. 超出范围的索引被忽略. |

## TableSortSpecs

[tableGetSortSpecs](#m-tablegetsortspecs) 的返回值.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `specsDirty` | [boolean](dataTypes#boolean) | 上次读取之后规格是否改变, 为 `true` 时重新排序. |
| `specs` | [TableColumnSortSpecs](imgui#tablecolumnsortspecs)[] | 通常只有一项. `TableFlags.SortMulti` 时可能有多项, `TableFlags.SortTristate` 时可能没有. |

## TableColumnSortSpecs

排序顺序中的一列.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `columnIndex` | [number](dataTypes#number) | 列索引. |
| `columnUserId` | [number](dataTypes#number) | `tableSetupColumn` 的 `userId`, 默认 0. |
| `sortDirection` | [number](dataTypes#number) | `SortDirection.Ascending` 或 `SortDirection.Descending`. |
| `sortOrder` | [number](dataTypes#number) | 多列排序时这一项的位次, 第一项为 0. |

## DragDropPayload

[acceptDragDropPayload](#m-acceptdragdroppayload) 与 [getDragDropPayload](#m-getdragdroppayload) 的返回值.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | [string](dataTypes#string) | `setDragDropPayload` 的 `type`, 或 Dear ImGui 的类型, 例如 `'_COL4F'`. |
| `data` | [any](dataTypes#any) | 数据的副本, 相当于 `JSON.parse(JSON.stringify(data))`. 颜色控件的颜色是 `[r, g, b]` 或 `[r, g, b, a]`, 其他 Dear ImGui 类型为 `null`. |
| `preview` | [boolean](dataTypes#boolean) | 目标正被悬停 (只有 `AcceptBeforeDelivery` 时可见). |
| `delivery` | [boolean](dataTypes#boolean) | 指针已在目标上松开. |

## SelectionRequest

选择的一次变化, 应用到已选中的 ID 上. `selectionStorage().apply` 替你完成.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `type` | `'setAll'` 或 `'setRange'` | `'setAll'`: 清空, `selected` 为真时全选. `'setRange'`: 把 `rangeFirstItem` 到 `rangeLastItem` 设为 `selected`. |
| `selected` | [boolean](dataTypes#boolean) | 要设置的状态. |
| `rangeFirstItem` | [number](dataTypes#number) | 范围的第一个 ID, `setAll` 时为 -1. 不大于 `rangeLastItem`. |
| `rangeLastItem` | [number](dataTypes#number) | 范围的最后一个 ID (含), `setAll` 时为 -1. |
| `rangeDirection` | [number](dataTypes#number) | 从 `rangeFirstItem` 选到 `rangeLastItem` 时为 1, 反向为 -1, `setAll` 时为 0. |

## ExampleOptions

[runExample](#m-runexample) 的选项.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `activity` | [boolean](dataTypes#boolean) | 用 `imgui.launch` 打开, 而不是 `imgui.launchFloaty`. |
| `width` | [number](dataTypes#number) | Surface 宽度, 单位 dp. |
| `height` | [number](dataTypes#number) | Surface 高度, 单位 dp. |
| `x` | [number](dataTypes#number) | 左边缘, 单位 dp. |
| `y` | [number](dataTypes#number) | 上边缘, 单位 dp. |
| `fps` | [number](dataTypes#number) | 帧率. |
| `theme` | [ThemeName](imgui#p-themes) | 初始主题. |
| `autoCloseMs` | [number](dataTypes#number) | 过这么多毫秒后关闭示例, `0` 或省略时不关闭. |
| `debug` | [boolean](dataTypes#boolean) | `error-handling` 示例: 调试模式, 默认 `true`. |
| `autoStart` | [boolean](dataTypes#boolean) | `background-task` 示例: 立刻开始任务. |
| `multiSelect` | [boolean](dataTypes#boolean) | `large-list` 示例: 以多选模式开始. |

## BackendCapabilities

[getBackendCapabilities](#m-getbackendcapabilities) 的返回值. 各项都有 `status` ([BackendStatus](#p-backendstatus)) 与 `productionReady` (是否用于生产).

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `schemaVersion` | [number](dataTypes#number) | 这个结构的版本. |
| `sdk` | [number](dataTypes#number) | 设备的 Android SDK 级别. |
| `window` | [Object](dataTypes#object) | 悬浮窗和 Activity 窗口. 另有 `requiresOverlayPermission`: 悬浮窗是否需要悬浮窗权限. |
| `splitTouch` | [Object](dataTypes#object) | 把一次触摸同时分给窗口和下层应用. |
| `privileged` | [Object](dataTypes#object) | 特权渲染器. 另有 `launcherCandidate`, `hostBridgeAvailable`, `rootCandidate`, `rootError`, `shizukuInstalled`, `shizukuRunning`, `shizukuPermission`, `shizukuOperational`, `shizukuError`, `reason` 等诊断字段. |
| `directInput` | [Object](dataTypes#object) | 从输入设备读取触摸, 用于特权窗口. 另有 `readerImplemented`, `appProcessReadable`, `runtimeProbeRequired`, `routingPolicy`, `reason`. |
| `docking` | [Object](dataTypes#object) | Dear ImGui 的 Docking, 没有开放. |
| `multiViewport` | [Object](dataTypes#object) | Dear ImGui 的 Multi-Viewport, 没有开放. |

# PascalCase 别名

常用函数有 PascalCase 别名, 位于 `imgui` 和 `ui` 上, 便于熟悉 Dear ImGui 的读者查找. 别名与目标是同一个函数对象 (`ui.Button === ui.button`), 所以它接受的是插件的参数, 不是 C++ 的参数. `with*` 等函数没有别名. 常量不需要别名: `ui.WindowFlags.NoTitleBar` 对应 `ImGuiWindowFlags_NoTitleBar`.

与 C++ 签名的主要差异:

| 方面 | C++ | 插件 |
| --- | --- | --- |
| 可变值 | `bool*`, `int*`, `float*`, `char*` 缓冲区 | [可变值](#mutablevalue) |
| `ImVec2` 参数 | 一个 `ImVec2` | 两个数, 例如 `width, height` |
| `ImVec2` 结果 | `ImVec2` | [Vec2](#vec2) |
| 颜色 | `ImVec4` 或 `ImU32` | 四个 `0..1` 的数, 不透明度默认为 1, 或 [Color](#color) |
| 格式化文本 | `fmt, ...` | 一个值, 用 `String()` 转换后原样显示 |
| 列表项 | 数组加个数, 或取值回调 | JavaScript 数组, 最多 512 项 |
| 文本输入 | 缓冲区, 回调 | 字符串引用和字节容量, 没有回调 |
| 绘图 | 位置参数, `stride` 按字节 | 选项对象 [PlotOptions](#plotoptions), `stride` 按值 |
| 重载 | 每个名称多个重载 | 每个名称一个函数, 例如 `PushID` 接受字符串或数字 |
| 排序规格 | 指向表格内部的指针, 由调用者清除 `SpecsDirty` | 本帧的副本, 读取时清除 |
| 组合键 | `ImGuiMod_Ctrl` 与 `ImGuiKey_S` 按位或 | `ui.Mod.Ctrl` 与 `ui.Key.S` 按位或. 不是按键的值抛出 RangeError |

| 别名 | 目标 |
| --- | --- |
| Ref | [ref](#m-ref) |
| Dp | [dp](#m-dp) |
| Px | [px](#m-px) |
| GetBackendCapabilities | [getBackendCapabilities](#m-getbackendcapabilities) |
| ListExamples | [listExamples](#m-listexamples) |
| GetExampleSource | [getExampleSource](#m-getexamplesource) |
| RunExample | [runExample](#m-runexample) |
| LogWindow | [logWindow](#m-logwindow) |
| Toast | [toast](#m-toast) |
| Alert | [alert](#m-alert) |
| Confirm | [confirm](#m-confirm) |
| SingleChoice | [singleChoice](#m-singlechoice) |
| MultiChoice | [multiChoice](#m-multichoice) |
| StatsOverlay | [statsOverlay](#m-statsoverlay) |
| DataTable | [dataTable](#m-datatable) |
| GetComponent | [getComponent](#m-getcomponent) |
| CreateWindow | [createWindow](#m-createwindow) |
| CloseWindow | [closeWindow](#m-closewindow) |
| LaunchFloaty | [launchFloaty](#m-launchfloaty) |
| Launch | [launch](#m-launch) |
| LaunchPrivileged | [launchPrivileged](#m-launchprivileged) |
| AddButtonEx | [addButtonEx](#m-addbuttonex) |
| SetTouchable | [setTouchable](#m-settouchable) |
| SetMoreTouch | [setMoreTouch](#m-setmoretouch) |
| SetGlobalAlpha | [setGlobalAlpha](#m-setglobalalpha) |
| SetSecure | [setSecure](#m-setsecure) |
| CollapseWindow | [collapseWindow](#m-collapsewindow) |
| ExpandWindow | [expandWindow](#m-expandwindow) |
| SetNextWindowPos | [setNextWindowPos](#m-setnextwindowpos) |
| SetNextWindowSize | [setNextWindowSize](#m-setnextwindowsize) |
| SetNextWindowSizeConstraints | [setNextWindowSizeConstraints](#m-setnextwindowsizeconstraints) |
| SetNextWindowBgAlpha | [setNextWindowBgAlpha](#m-setnextwindowbgalpha) |
| SetNextWindowFocus | [setNextWindowFocus](#m-setnextwindowfocus) |
| SetNextWindowCollapsed | [setNextWindowCollapsed](#m-setnextwindowcollapsed) |
| SetKeyboardFocusHere | [setKeyboardFocusHere](#m-setkeyboardfocushere) |
| Begin | [begin](#m-begin) |
| End | [end](#m-end) |
| BeginChild | [beginChild](#m-beginchild) |
| EndChild | [endChild](#m-endchild) |
| GetWindowPos | [getWindowPos](#m-getwindowpos) |
| GetWindowSize | [getWindowSize](#m-getwindowsize) |
| GetContentRegionAvail | [getContentRegionAvail](#m-getcontentregionavail) |
| GetCursorPos | [getCursorPos](#m-getcursorpos) |
| SetCursorPos | [setCursorPos](#m-setcursorpos) |
| Text | [text](#m-text) |
| TextWrapped | [textWrapped](#m-textwrapped) |
| TextColored | [textColored](#m-textcolored) |
| Button | [button](#m-button) |
| SmallButton | [smallButton](#m-smallbutton) |
| Checkbox | [checkbox](#m-checkbox) |
| RadioButton | [radioButton](#m-radiobutton) |
| SliderFloat | [sliderFloat](#m-sliderfloat) |
| SliderInt | [sliderInt](#m-sliderint) |
| DragFloat | [dragFloat](#m-dragfloat) |
| DragInt | [dragInt](#m-dragint) |
| InputText | [inputText](#m-inputtext) |
| ColorEdit3 | [colorEdit3](#m-coloredit3) |
| ColorEdit4 | [colorEdit4](#m-coloredit4) |
| ProgressBar | [progressBar](#m-progressbar) |
| Combo | [combo](#m-combo) |
| Selectable | [selectable](#m-selectable) |
| CollapsingHeader | [collapsingHeader](#m-collapsingheader) |
| TreeNode | [treeNode](#m-treenode) |
| TreePop | [treePop](#m-treepop) |
| BeginTabBar | [beginTabBar](#m-begintabbar) |
| EndTabBar | [endTabBar](#m-endtabbar) |
| BeginTabItem | [beginTabItem](#m-begintabitem) |
| EndTabItem | [endTabItem](#m-endtabitem) |
| SameLine | [sameLine](#m-sameline) |
| Separator | [separator](#m-separator) |
| Spacing | [spacing](#m-spacing) |
| NewLine | [newLine](#m-newline) |
| Dummy | [dummy](#m-dummy) |
| SetNextItemWidth | [setNextItemWidth](#m-setnextitemwidth) |
| PushItemWidth | [pushItemWidth](#m-pushitemwidth) |
| PopItemWidth | [popItemWidth](#m-popitemwidth) |
| IsItemClicked | [isItemClicked](#m-isitemclicked) |
| IsItemHovered | [isItemHovered](#m-isitemhovered) |
| IsAnyItemHovered | [isAnyItemHovered](#m-isanyitemhovered) |
| IsAnyItemActive | [isAnyItemActive](#m-isanyitemactive) |
| ShowDemoWindow | [showDemoWindow](#m-showdemowindow) |
| ShowMetricsWindow | [showMetricsWindow](#m-showmetricswindow) |
| ShowDebugLogWindow | [showDebugLogWindow](#m-showdebuglogwindow) |
| ShowIDStackToolWindow | [showIdStackToolWindow](#m-showidstacktoolwindow) |
| ShowStyleEditor | [showStyleEditor](#m-showstyleeditor) |
| ShowAboutWindow | [showAboutWindow](#m-showaboutwindow) |
| ShowUserGuide | [showUserGuide](#m-showuserguide) |
| StyleColorsDark | [styleColorsDark](#m-stylecolorsdark) |
| StyleColorsLight | [styleColorsLight](#m-stylecolorslight) |
| StyleColorsClassic | [styleColorsClassic](#m-stylecolorsclassic) |
| WantCaptureMouse | [wantCaptureMouse](#m-wantcapturemouse) |
| SeparatorText | [separatorText](#m-separatortext) |
| Bullet | [bullet](#m-bullet) |
| BulletText | [bulletText](#m-bullettext) |
| LabelText | [labelText](#m-labeltext) |
| TextDisabled | [textDisabled](#m-textdisabled) |
| ArrowButton | [arrowButton](#m-arrowbutton) |
| InvisibleButton | [invisibleButton](#m-invisiblebutton) |
| InputInt | [inputInt](#m-inputint) |
| InputFloat | [inputFloat](#m-inputfloat) |
| InputTextMultiline | [inputTextMultiline](#m-inputtextmultiline) |
| BeginListBox | [beginListBox](#m-beginlistbox) |
| EndListBox | [endListBox](#m-endlistbox) |
| ListBox | [listBox](#m-listbox) |
| ColorPicker3 | [colorPicker3](#m-colorpicker3) |
| ColorPicker4 | [colorPicker4](#m-colorpicker4) |
| ColorButton | [colorButton](#m-colorbutton) |
| PlotLines | [plotLines](#m-plotlines) |
| PlotHistogram | [plotHistogram](#m-plothistogram) |
| TreeNodeEx | [treeNodeEx](#m-treenodeex) |
| VSliderFloat | [vSliderFloat](#m-vsliderfloat) |
| VSliderInt | [vSliderInt](#m-vsliderint) |
| DragFloat2 | [dragFloat2](#m-dragfloat2) |
| DragFloat3 | [dragFloat3](#m-dragfloat3) |
| DragFloat4 | [dragFloat4](#m-dragfloat4) |
| DragInt2 | [dragInt2](#m-dragint2) |
| DragInt3 | [dragInt3](#m-dragint3) |
| DragInt4 | [dragInt4](#m-dragint4) |
| SliderFloat2 | [sliderFloat2](#m-sliderfloat2) |
| SliderFloat3 | [sliderFloat3](#m-sliderfloat3) |
| SliderFloat4 | [sliderFloat4](#m-sliderfloat4) |
| SliderInt2 | [sliderInt2](#m-sliderint2) |
| SliderInt3 | [sliderInt3](#m-sliderint3) |
| SliderInt4 | [sliderInt4](#m-sliderint4) |
| InputFloat2 | [inputFloat2](#m-inputfloat2) |
| InputFloat3 | [inputFloat3](#m-inputfloat3) |
| InputFloat4 | [inputFloat4](#m-inputfloat4) |
| InputInt2 | [inputInt2](#m-inputint2) |
| InputInt3 | [inputInt3](#m-inputint3) |
| InputInt4 | [inputInt4](#m-inputint4) |
| DragFloatRange2 | [dragFloatRange2](#m-dragfloatrange2) |
| DragIntRange2 | [dragIntRange2](#m-dragintrange2) |
| SliderAngle | [sliderAngle](#m-sliderangle) |
| Toggle | [toggle](#m-toggle) |
| ToggleSwitch | [toggle](#m-toggle) |
| BeginCombo | [beginCombo](#m-begincombo) |
| EndCombo | [endCombo](#m-endcombo) |
| ListClipper | [listClipper](#m-listclipper) |
| BeginMultiSelect | [beginMultiSelect](#m-beginmultiselect) |
| EndMultiSelect | [endMultiSelect](#m-endmultiselect) |
| SetNextItemSelectionUserData | [setNextItemSelectionUserData](#m-setnextitemselectionuserdata) |
| IsItemToggledSelection | [isItemToggledSelection](#m-isitemtoggledselection) |
| SelectionStorage | [selectionStorage](#m-selectionstorage) |
| OpenPopup | [openPopup](#m-openpopup) |
| BeginPopup | [beginPopup](#m-beginpopup) |
| BeginPopupModal | [beginPopupModal](#m-beginpopupmodal) |
| BeginPopupContextItem | [beginPopupContextItem](#m-beginpopupcontextitem) |
| BeginPopupContextWindow | [beginPopupContextWindow](#m-beginpopupcontextwindow) |
| EndPopup | [endPopup](#m-endpopup) |
| CloseCurrentPopup | [closeCurrentPopup](#m-closecurrentpopup) |
| IsPopupOpen | [isPopupOpen](#m-ispopupopen) |
| BeginMenuBar | [beginMenuBar](#m-beginmenubar) |
| EndMenuBar | [endMenuBar](#m-endmenubar) |
| BeginMenu | [beginMenu](#m-beginmenu) |
| EndMenu | [endMenu](#m-endmenu) |
| MenuItem | [menuItem](#m-menuitem) |
| SetTooltip | [setTooltip](#m-settooltip) |
| SetItemTooltip | [setItemTooltip](#m-setitemtooltip) |
| BeginTooltip | [beginTooltip](#m-begintooltip) |
| BeginItemTooltip | [beginItemTooltip](#m-beginitemtooltip) |
| EndTooltip | [endTooltip](#m-endtooltip) |
| BeginTable | [beginTable](#m-begintable) |
| EndTable | [endTable](#m-endtable) |
| TableNextRow | [tableNextRow](#m-tablenextrow) |
| TableNextColumn | [tableNextColumn](#m-tablenextcolumn) |
| TableSetColumnIndex | [tableSetColumnIndex](#m-tablesetcolumnindex) |
| TableSetupColumn | [tableSetupColumn](#m-tablesetupcolumn) |
| TableGetSortSpecs | [tableGetSortSpecs](#m-tablegetsortspecs) |
| TableSetupScrollFreeze | [tableSetupScrollFreeze](#m-tablesetupscrollfreeze) |
| TableHeadersRow | [tableHeadersRow](#m-tableheadersrow) |
| TableSetBgColor | [tableSetBgColor](#m-tablesetbgcolor) |
| PushStyleColor | [pushStyleColor](#m-pushstylecolor) |
| PopStyleColor | [popStyleColor](#m-popstylecolor) |
| SetStyleColor | [setStyleColor](#m-setstylecolor) |
| SetStyleProperties | [setStyleProperties](#m-setstyleproperties) |
| SetTheme | [setTheme](#m-settheme) |
| PushStyleVar | [pushStyleVar](#m-pushstylevar) |
| PopStyleVar | [popStyleVar](#m-popstylevar) |
| SetWindowFontScale | [setWindowFontScale](#m-setwindowfontscale) |
| PushFont | [pushFont](#m-pushfont) |
| PopFont | [popFont](#m-popfont) |
| WithFont | [withFont](#m-withfont) |
| Icon | [icon](#m-icon) |
| ColorU32 | [colorU32](#m-coloru32) |
| CreateTexture | [createTexture](#m-createtexture) |
| DestroyTexture | [destroyTexture](#m-destroytexture) |
| Image | [image](#m-image) |
| ImageButton | [imageButton](#m-imagebutton) |
| GetWindowDrawList | [getWindowDrawList](#m-getwindowdrawlist) |
| GetForegroundDrawList | [getForegroundDrawList](#m-getforegrounddrawlist) |
| GetBackgroundDrawList | [getBackgroundDrawList](#m-getbackgrounddrawlist) |
| PushID | [pushId](#m-pushid) |
| PopID | [popId](#m-popid) |
| BeginGroup | [beginGroup](#m-begingroup) |
| EndGroup | [endGroup](#m-endgroup) |
| Indent | [indent](#m-indent) |
| Unindent | [unindent](#m-unindent) |
| AlignTextToFramePadding | [alignTextToFramePadding](#m-aligntexttoframepadding) |
| BeginDisabled | [beginDisabled](#m-begindisabled) |
| EndDisabled | [endDisabled](#m-enddisabled) |
| GetScrollX | [getScrollX](#m-getscrollx) |
| GetScrollY | [getScrollY](#m-getscrolly) |
| GetScrollMaxX | [getScrollMaxX](#m-getscrollmaxx) |
| GetScrollMaxY | [getScrollMaxY](#m-getscrollmaxy) |
| SetScrollX | [setScrollX](#m-setscrollx) |
| SetScrollY | [setScrollY](#m-setscrolly) |
| SetScrollHereX | [setScrollHereX](#m-setscrollherex) |
| SetScrollHereY | [setScrollHereY](#m-setscrollherey) |
| IsItemActive | [isItemActive](#m-isitemactive) |
| IsItemEdited | [isItemEdited](#m-isitemedited) |
| IsItemActivated | [isItemActivated](#m-isitemactivated) |
| IsItemDeactivated | [isItemDeactivated](#m-isitemdeactivated) |
| IsItemDeactivatedAfterEdit | [isItemDeactivatedAfterEdit](#m-isitemdeactivatedafteredit) |
| IsItemFocused | [isItemFocused](#m-isitemfocused) |
| IsItemVisible | [isItemVisible](#m-isitemvisible) |
| IsWindowHovered | [isWindowHovered](#m-iswindowhovered) |
| IsWindowFocused | [isWindowFocused](#m-iswindowfocused) |
| IsWindowCollapsed | [isWindowCollapsed](#m-iswindowcollapsed) |
| IsWindowAppearing | [isWindowAppearing](#m-iswindowappearing) |
| GetMousePos | [getMousePos](#m-getmousepos) |
| IsMouseDown | [isMouseDown](#m-ismousedown) |
| IsMouseClicked | [isMouseClicked](#m-ismouseclicked) |
| IsMouseDoubleClicked | [isMouseDoubleClicked](#m-ismousedoubleclicked) |
| IsMouseReleased | [isMouseReleased](#m-ismousereleased) |
| IsMouseDragging | [isMouseDragging](#m-ismousedragging) |
| GetMouseDragDelta | [getMouseDragDelta](#m-getmousedragdelta) |
| ResetMouseDragDelta | [resetMouseDragDelta](#m-resetmousedragdelta) |
| CalcTextSize | [calcTextSize](#m-calctextsize) |
| GetFrameHeight | [getFrameHeight](#m-getframeheight) |
| GetFrameHeightWithSpacing | [getFrameHeightWithSpacing](#m-getframeheightwithspacing) |
| GetTextLineHeight | [getTextLineHeight](#m-gettextlineheight) |
| GetTextLineHeightWithSpacing | [getTextLineHeightWithSpacing](#m-gettextlineheightwithspacing) |
| IsKeyDown | [isKeyDown](#m-iskeydown) |
| IsKeyPressed | [isKeyPressed](#m-iskeypressed) |
| IsKeyReleased | [isKeyReleased](#m-iskeyreleased) |
| GetKeyPressedAmount | [getKeyPressedAmount](#m-getkeypressedamount) |
| GetKeyName | [getKeyName](#m-getkeyname) |
| IsKeyChordPressed | [isKeyChordPressed](#m-iskeychordpressed) |
| Shortcut | [shortcut](#m-shortcut) |
| SetNextItemShortcut | [setNextItemShortcut](#m-setnextitemshortcut) |
| GetClipboardText | [getClipboardText](#m-getclipboardtext) |
| SetClipboardText | [setClipboardText](#m-setclipboardtext) |
| BeginDragDropSource | [beginDragDropSource](#m-begindragdropsource) |
| SetDragDropPayload | [setDragDropPayload](#m-setdragdroppayload) |
| EndDragDropSource | [endDragDropSource](#m-enddragdropsource) |
| BeginDragDropTarget | [beginDragDropTarget](#m-begindragdroptarget) |
| AcceptDragDropPayload | [acceptDragDropPayload](#m-acceptdragdroppayload) |
| EndDragDropTarget | [endDragDropTarget](#m-enddragdroptarget) |
| GetDragDropPayload | [getDragDropPayload](#m-getdragdroppayload) |
| WithDragDropSource | [withDragDropSource](#m-withdragdropsource) |
| WithDragDropTarget | [withDragDropTarget](#m-withdragdroptarget) |
| PushClipRect | [pushClipRect](#m-pushcliprect) |
| PopClipRect | [popClipRect](#m-popcliprect) |
| AddMousePosEvent | [addMousePosEvent](#m-addmouseposevent) |
| AddMouseButtonEvent | [addMouseButtonEvent](#m-addmousebuttonevent) |
