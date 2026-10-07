# 终端 (Terminal)

`terminal` 模块通过独立的 3-Shell Terminal 插件创建, 显示和驱动交互式系统终端. 全局对象 `terminal` 与 `$terminal` 指向同一对象. 本模块自 AutoJs6 6.8.0 提供, 完整脚本 API 需要包含终端模块的构建 (5315 或更新).

先在插件中心安装并启用 [3-Shell Terminal](https://github.com/SuperMonster003/AutoJs6-Plugin-Three-Shell-Terminal). 插件未安装, 被禁用, 未授权或连接失败时, 会话操作抛出 [TerminalError](terminalErrorType), 错误代码为 `PLUGIN_UNAVAILABLE`; 契约不兼容时为 `PLUGIN_INCOMPATIBLE`. 可用 [isAvailable](#m-isavailable) 预先探测.

会话在插件进程中以插件自己的 UID 和权限运行. 它不继承宿主的存储授权, 不提供 root 或 Shizuku 权限. 与返回命令执行结果的 [shell()](shell) 不同, `terminal.exec()` 返回可显示, 输入和监听的 [TerminalSession](terminalSessionType). 需要一次性执行命令并读取结果时可使用 `shell()`; 需要持续交互或可见会话时使用 `terminal`.

同步方法阻塞当前脚本线程, 不可在 Android UI 线程调用. 对应的 `Async` 方法返回 [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise), 结果和事件在发起调用的脚本线程交付. `session()` 和 `state()` 仅有同步形态. 同步终端等待期间仍会交付终端事件, 因此 `output` 监听器可以在 `waitFor()` 等待时调用 `write()`.

脚本退出会取消本脚本的调用, 订阅和回调, 已创建的终端会话继续运行. 关闭 AutoJs6 或离开终端界面也不会主动关闭会话. 插件进程被系统终止时, 会话不能恢复; 前台服务有助于保活, 仍受设备的后台限制影响.

```js
if (!terminal.isAvailable()) {
    toast('请先安装并启用 3-Shell Terminal');
    exit();
}
let result = terminal.exec('echo ready; exit 3', {
    cwd: terminal.env().home,
    show: false,
    keepOpen: false,
    wait: true,
});
console.log(result.exitCode); // 3.
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">terminal</p>

---

## [m] open

### terminal.open(directoryOrOptions?)

**`6.8.0`** **`Non-UI`**

- **[ directoryOrOptions ]** { [string](dataTypes#string) | [TerminalOpenOptions](terminalOpenOptionsType) } - 初始目录或选项
- <ins>**returns**</ins> { [TerminalSession](terminalSessionType) } - 新建会话

默认创建并显示新会话. 未指定目录时使用脚本工作目录, 脚本没有工作目录时使用插件的 `HOME`. 相对目录按脚本工作目录解析, 不接受 URI. 脚本访问无权限的共享目录会得到 `STORAGE_PERMISSION_REQUIRED`; 插件界面自身创建会话时可以回退到主目录并显示授权提示.

```js
let session = terminal.open({ cwd: terminal.env().home, show: false, title: 'Example' });
session.write('echo hello\n');
session.show();
```

## [m] openAsync

### terminal.openAsync(directoryOrOptions?)

**`6.8.0`** **`Async`**

- **[ directoryOrOptions ]** { [string](dataTypes#string) | [TerminalOpenOptions](terminalOpenOptionsType) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[TerminalSession](terminalSessionType)&gt; }

[open](#m-open) 的异步形态, 参数和创建行为相同.

## [m] sessions

### terminal.sessions()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> { [TerminalSession](terminalSessionType)[] }

列出插件当前的全部会话, 包括从界面或其他脚本创建的会话. 同时存在的会话最多 16 个.

## [m] sessionsAsync

### terminal.sessionsAsync()

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[TerminalSession](terminalSessionType)[]&gt; }

[sessions](#m-sessions) 的异步形态.

## [m] session

### terminal.session(id)

**`6.8.0`** **`Non-UI`**

- **id** { [string](dataTypes#string) } - 会话 ID
- <ins>**returns**</ins> { [TerminalSession](terminalSessionType) | [null](dataTypes#null) }

获取当前仍在插件注册表中的会话, 不存在时返回 `null`. 已退出的会话会移出注册表. 此方法没有 `sessionAsync` 形态.

## [m] close

### terminal.close(id)

**`6.8.0`** **`Non-UI`**

- **id** { [string](dataTypes#string) } - 会话 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否关闭了存在的会话

关闭指定会话及其 shell. 可以关闭从界面或其他脚本创建的会话.

## [m] closeAsync

### terminal.closeAsync(id)

**`6.8.0`** **`Async`**

- **id** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[boolean](dataTypes#boolean)&gt; }

[close](#m-close) 的异步形态.

## [m] closeAll

### terminal.closeAll()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 关闭的会话数量

关闭插件中的全部会话, 包括用户或其他脚本创建的会话. 只清理当前脚本创建的会话时, 应保存各会话 ID 并逐个关闭.

## [m] closeAllAsync

### terminal.closeAllAsync()

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[number](dataTypes#number)&gt; }

[closeAll](#m-closeall) 的异步形态.

## [m] show

### terminal.show(id?)

**`6.8.0`** **`Non-UI`**

- **[ id ]** { [string](dataTypes#string) } - 会话 ID, 省略时显示最近会话
- <ins>**returns**</ins> { [void](dataTypes#void) }

打开插件终端界面. 与 `app.startActivity()` 一样, 从后台打开界面可能受到 Android 限制.

## [m] showAsync

### terminal.showAsync(id?)

**`6.8.0`** **`Async`**

- **[ id ]** { [string](dataTypes#string) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[void](dataTypes#void)&gt; }

[show](#m-show) 的异步形态.

## [m] state

### terminal.state()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

返回 `available`, `not_installed`, `disabled`, `incompatible` 或 `unavailable`. `disabled` 包含 Android 禁用, 插件中心禁用和未授权; `unavailable` 表示已安装但服务不能正常应答. 插件缺失不会因为缺失本身而抛出异常. 此方法没有 `stateAsync` 形态.

## [m] isAvailable

### terminal.isAvailable()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

插件已启用, 兼容且能够应答时返回 `true`. 缺失或连接失败时返回 `false`.

## [m] isAvailableAsync

### terminal.isAvailableAsync()

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[boolean](dataTypes#boolean)&gt; }

[isAvailable](#m-isavailable) 的异步形态.

## [m] exec

### terminal.exec(command, options?)

**`6.8.0`** **`Non-UI`**

- **command** { [string](dataTypes#string) } - 非空命令, 最多 64 KiB UTF-8
- **[ options ]** { [TerminalExecOptions](terminalOpenOptionsType#terminalexecoptions) }
- <ins>**returns**</ins> { [TerminalSession](terminalSessionType) }

在新会话中执行命令. 默认 `show: true`, `keepOpen: true`, `wait: false`. 命令结束后默认保留交互式 shell. 设置 `wait: true` 会等待整个会话退出, 因此等待命令退出码时应同时设置 `keepOpen: false`. `timeout` 默认 600000 ms, `0` 表示不限时. 超时会抛出 `TIMEOUT`, 会话继续运行, 可查询或显式关闭.

## [m] execAsync

### terminal.execAsync(command, options?)

**`6.8.0`** **`Async`**

- **command** { [string](dataTypes#string) }
- **[ options ]** { [TerminalExecOptions](terminalOpenOptionsType#terminalexecoptions) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[TerminalSession](terminalSessionType)&gt; }

[exec](#m-exec) 的异步形态. `wait: false` 时 Promise 在会话建立后完成, `wait: true` 时等待会话退出.

## [p+] npm

### terminal.npm

提供 npm 脚本执行方法. 需要安装签名可信的 Node.js Runtime 1.5.0 或更新版本, 并在 3-Shell Terminal 设置中开启 Node.js 集成. 该功能不会安装依赖或绕过 Android 对应用私有目录中可执行文件的限制.

### terminal.npm.run(script, directory?, options?)

**`6.8.0`** **`Non-UI`**

- **script** { [string](dataTypes#string) } - package.json 中的脚本名, 仅允许字母, 数字及 `_.:@/+-`
- **[ directory ]** { [string](dataTypes#string) | [null](dataTypes#null) } - 工程目录
- **[ options ]** { [TerminalExecOptions](terminalOpenOptionsType#terminalexecoptions) }
- <ins>**returns**</ins> { [TerminalSession](terminalSessionType) }

相当于运行 `npm run <script>`. `directory` 与 `options.cwd` 同时传入且不相同时, 抛出 `INVALID_ARGUMENT`. 仅使用第三个参数时, 第二个参数可传 `null`.

```js
let task = terminal.npm.run('build', '/sdcard/MyProject', {
    keepOpen: false, wait: true, timeout: 600000,
});
console.log(task.exitCode);
```

### terminal.npm.runAsync(script, directory?, options?)

**`6.8.0`** **`Async`**

- **script** { [string](dataTypes#string) }
- **[ directory ]** { [string](dataTypes#string) | [null](dataTypes#null) }
- **[ options ]** { [TerminalExecOptions](terminalOpenOptionsType#terminalexecoptions) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[TerminalSession](terminalSessionType)&gt; }

`npm.run` 的异步形态.

## [m] env

### terminal.env()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> { [Object](dataTypes#object) } - 插件环境信息

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| home | [string](dataTypes#string) | 插件私有主目录 |
| prefix | [string](dataTypes#string) | 插件命令和软件包目录 |
| shell | [string](dataTypes#string) | `/system/bin/sh` |
| npmRegistry | [string](dataTypes#string) | 当前 npm 镜像源 |
| storageAccess | [string](dataTypes#string) | `granted`, `denied` 或 `not_applicable` |
| pluginVersion | [string](dataTypes#string) | 终端插件版本名称 |
| contractVersion | [number](dataTypes#number) | 终端契约版本 |
| node.available | [boolean](dataTypes#boolean) | Node.js 工具链是否可用 |
| node.version | [string](dataTypes#string) 或 [null](dataTypes#null) | Node.js 版本, 初次异步探测尚未结束时也可能为 null |
| node.packageName | [string](dataTypes#string) 或 [null](dataTypes#null) | 运行时插件包名 |
| node.pluginVersion | [string](dataTypes#string) 或 [null](dataTypes#null) | 运行时插件版本名称 |
| node.reason | [string](dataTypes#string) 或 [null](dataTypes#null) | 可用时为 null, 否则是下述原因之一 |

Node.js 不可用原因为 `disabled`, `plugin-missing`, `plugin-untrusted`, `plugin-too-old`, `executable-missing`, `exec-denied` 或 `setup-failed`. 普通 shell 会话仍可使用.

## [m] envAsync

### terminal.envAsync()

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[Object](dataTypes#object)&gt; }

[env](#m-env) 的异步形态, 字段相同.

## [C] TerminalError

### terminal.TerminalError

- { [Function](dataTypes#function) }

错误构造器, 详见 [TerminalError](terminalErrorType). 同步调用可在 `catch` 中通过 `instanceof terminal.TerminalError` 和 `code` 检查错误; Async 调用以同样的错误对象拒绝 Promise.
