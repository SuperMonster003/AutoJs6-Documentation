# TerminalSession

由 [terminal.open](terminal#m-open), [terminal.exec](terminal#m-exec), [terminal.sessions](terminal#m-sessions) 等返回的会话对象, 继承 [EventEmitter](eventEmitterType). 对象绑定插件中的会话 ID; 不应在插件进程重启后继续使用旧对象.

## 属性

以下属性只读. 对象保存最近一次观察到的会话状态, 不会持续轮询; `isAlive()` 会刷新状态, 退出回调也会更新退出码.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| id | [string](dataTypes#string) | 会话 ID, 在本次会话存续期间不变 |
| cwd | [string](dataTypes#string) | 最近一次观察到的目录 |
| title | [string](dataTypes#string) | 会话标题 |
| createdAt | [number](dataTypes#number) | 创建时间, Unix epoch 毫秒 |
| pid | [number](dataTypes#number) | 子进程 PID, 启动过程中可能为负数 |
| state | [string](dataTypes#string) | `pending`, `running` 或 `exited` |
| exitCode | [number](dataTypes#number) 或 [null](dataTypes#null) | 尚未观察到退出时为 null |

## [m] isAlive

### session.isAlive()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

刷新会话状态并返回是否仍存活. 没有 `isAliveAsync` 形态.

## [m] write

### session.write(data)

**`6.8.0`** **`Non-UI`**

- **data** { [string](dataTypes#string) | [number](dataTypes#number)[] } - UTF-8 文本或 0..255 的整数字节数组
- <ins>**returns**</ins> { [TerminalSession](terminalSessionType) } - 当前对象, 可链式调用

向终端输入数据, 最多 64 KiB 且不能是空内容. 文本末尾加入 `\n` 才会执行完整命令; `[3]` 发送 Ctrl+C.

```js
session.write('echo ready\n');
session.write([3]); // Ctrl+C.
```

### session.writeAsync(data)

**`6.8.0`** **`Async`**

- **data** { [string](dataTypes#string) | [number](dataTypes#number)[] }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[void](dataTypes#void)&gt; }

异步写入, Promise 完成值为 `undefined`, 不返回会话对象.

## [m] show

### session.show()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> { [TerminalSession](terminalSessionType) } - 当前对象

显示当前会话. 受 Android 后台启动界面规则限制.

### session.showAsync()

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[void](dataTypes#void)&gt; }

异步显示, 完成值为 `undefined`.

## [m] close

### session.close()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否关闭了存在的会话

关闭当前会话及其 shell.

### session.closeAsync()

**`6.8.0`** **`Async`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[boolean](dataTypes#boolean)&gt; }

异步关闭当前会话.

## [m] waitFor

### session.waitFor(pattern, timeout?)

**`6.8.0`** **`Non-UI`**

- **pattern** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) } - 非空子串或正则表达式
- **[ timeout = 600000 ]** { [number](dataTypes#number) } - 非负整数毫秒, 0 表示不限时
- <ins>**returns**</ins> { [string](dataTypes#string) } - 第一个匹配的后续输出行或提示片段

从调用时刻订阅新的输出, 不搜索之前的转录内容. 超时报 `TIMEOUT`, 在匹配前流已结束时报 `SESSION_CLOSED`; 每次等待都会释放自己的订阅. 正则表达式使用与宿主选择器相同的 Java 兼容转换, 不推进 JavaScript `lastIndex`.

### session.waitForAsync(pattern, timeout?)

**`6.8.0`** **`Async`**

- **pattern** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) }
- **[ timeout = 600000 ]** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](dataTypes#string)&gt; }

异步等待, 匹配和清理行为相同.

## [m] transcript

### session.transcript(maxBytes?)

**`6.8.0`** **`Non-UI`**

- **[ maxBytes = 1048576 ]** { [number](dataTypes#number) } - 1..1048576 的整数, 单位为 UTF-8 字节
- <ins>**returns**</ins> { [string](dataTypes#string) }

读取当前屏幕和回滚文本, 达到上限时保留最新部分, 还受跨进程回复大小限制. 这是经过终端渲染的文本, 不等于完整的原始字节日志. 已移出插件注册表的会话不能再次读取转录.

### session.transcriptAsync(maxBytes?)

**`6.8.0`** **`Async`**

- **[ maxBytes = 1048576 ]** { [number](dataTypes#number) }
- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)&lt;[string](dataTypes#string)&gt; }

异步读取转录.

## 事件

使用 `on`, `once`, `prependListener`, `prependOnceListener`, `off`, `removeListener`, `removeAllListeners` 管理监听器.

| 事件 | 回调签名 | 含义 |
| --- | --- | --- |
| output | `(text: string) => void` | 输出行或不带换行的提示片段 |
| overflow | `(droppedBytes: number) => void` | 观察流缓冲已满, 有输出字节被丢弃 |
| exit | `(exitCode: number) => void` | 会话已退出且订阅管道已排空, 每对象交付一次 |

`output` 默认移除 ANSI 控制序列, 可在 `exec` 选项中设置 `stripAnsi: false`. 单行超过 64 KiB 时分块交付且不拆分 UTF-8 字符. 管道空闲约 100 ms 时会交付不完整的行, 以支持没有换行的交互提示. `exit` 之后不会再交付 `output`.

第一个 `output` 或 `overflow` 监听器会建立输出订阅; 最后一个此类监听器移除后释放订阅, 包括 `once` 自动移除的情况. 仅监听 `exit` 不建立输出管道. 每个会话最多 4 个订阅, `waitFor()` 也占用独立订阅.

本脚本刚创建的会话首次订阅时会回放仍可读取的屏幕转录. 从 `sessions()` 或 `session(id)` 获取的对象只监听新输出. 已移除会话的历史无法恢复. 溢出只影响观察流, 不会阻塞终端本身; 丢弃计数可能合并, 不能用于定位精确字节偏移. 不应把事件当作无损日志存储.

```js
let session = terminal.exec('sleep 1; printf "Name: "; read name; echo "Hello $name"', {
    cwd: terminal.env().home, show: false, keepOpen: false,
});
session.on('output', text => {
    if (text.indexOf('Name: ') >= 0) session.write('AutoJs6\n');
});
session.on('overflow', bytes => console.warn('Dropped: ' + bytes));
session.on('exit', code => console.log('Exit: ' + code));
```
