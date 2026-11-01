# ImGui

<!-- runtime-support:begin imgui -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `imgui` | - | - | - |
| 状态 | 已支持 584 项 | 不适用 584 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 584 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 584 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

imgui 模块 (由 ImGui 插件提供能力的即时模式界面) 的成员文档尚待补充, 上表为各运行时的支持情况.

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
| 广播的值 | 字符串, 数字, 布尔值和 `null` 在两个方向上都保持原样. 对象和数组不能直接传: Rhino 发出的对象到主脚本是 `[object Object]` 这样的字符串, 主脚本发出的对象在 Rhino 中是 Java Map, 用属性读不到值. 结构化数据在两端用 `JSON.stringify` 和 `JSON.parse` 转换 |
| 结束 | 主脚本结束时窗口不会关闭, Rhino 脚本继续运行, 所以主脚本退出前要发送关闭广播. 窗口关闭后 Rhino 脚本自行结束. 广播监听器会让主脚本保持运行, 所以示例最后移除全部监听器 |
| 多个窗口 | AutoJs6 进程只有一个渲染器, 其他脚本打开新窗口时会接管它, 当前窗口随之关闭. 需要多个窗口时, 在同一段 Rhino 脚本中创建多个根窗口 |
