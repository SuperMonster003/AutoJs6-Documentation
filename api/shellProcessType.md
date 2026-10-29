# ShellProcess

<!-- runtime-support:begin ShellProcess# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ShellProcess` 对象 | `autojs6:shell` | `autojs6:shell` | `host.shell` |
| 状态 | 已支持 25 项 | 已支持 25 项 | 已支持 25 项 | 需授权 25 项 |
| 授权 | - | - | - | `shell.control` 25 项 |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

由 [shell.spawn](shell#m-spawn) 和 [shizuku.spawn](shizuku#m-spawn) 返回的进程对象, 表示一条正在运行或已经结束的命令行. 属性, 文本与状态方法返回普通 JavaScript 值, 流方法返回 Java 输入/输出流. TypeScript 类型名为 `Shell.Process`, 不存在可直接调用的全局 `ShellProcess` 构造器. 进程随启动它的脚本结束而结束, 连同其启动的子进程.

stdout 与 stderr 各自只能以一种方式读取, 由首次使用决定:

- 逐行读取: [readLine](#m-readline) 与 [readErrorLine](#m-readerrorline), 阻塞调用线程.
- 原始流: [getInputStream](#m-getinputstream) 与 [getErrorStream](#m-geterrorstream).
- 事件: `output` 与 `errorOutput` 监听器 (参阅 [事件](#事件)).

同一个流换用另一种方式时抛出异常. 文本按 UTF-8 编码与解码.

没有读取的输出会占满管道并使进程阻塞. 长期运行且持续输出的命令应及时读取或监听其输出.

## 属性

以下属性只读.

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| pid | [number](dataTypes#number) | 进程 ID, 未知时为 `-1`. adb 模式下为其在 Shizuku 服务中的 ID, Root 模式下为 su 客户端的 ID |
| command | [string](dataTypes#string) | 传给 spawn 的命令行 |
| mode | [string](dataTypes#string) | `sh`, `root`, `adb` 或 `adb+root` |
| exitCode | [number](dataTypes#number) 或 [null](dataTypes#null) | 退出码, 运行期间为 `null` |

进程被信号结束时, 退出码通常为 `128` 加信号编号, 如 [kill](#m-kill) 后常见的 `137` 或 `143`.

## [m] isAlive

### proc.isAlive()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 进程是否仍在运行

## [m] readLine

### proc.readLine()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 下一行 stdout, 不含换行符; 输出结束时为 `null`

阻塞调用线程直到读到一行或输出结束. 不应在 Android UI 线程调用. 进程被结束后返回 `null`.

```js
let proc = shell.spawn('echo a; echo b');
console.log(proc.readLine()); // a
console.log(proc.readLine()); // b
console.log(proc.readLine()); // null
```

## [m] readErrorLine

### proc.readErrorLine()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 下一行 stderr, 不含换行符; 输出结束时为 `null`

与 [readLine](#m-readline) 相同, 读取 stderr. `pty` 时 stderr 已并入 stdout, 此方法立即返回 `null`.

## [m] write

### proc.write(text)

**`6.8.0`**

- **text** { [string](dataTypes#string) } - 写入 stdin 的文本
- <ins>**returns**</ins> { [ShellProcess](shellProcessType) } - 当前对象, 可链式调用

写入后立即刷新. stdin 已关闭或进程已结束时抛出异常.

## [m] writeLine

### proc.writeLine(text)

**`6.8.0`**

- **text** { [string](dataTypes#string) } - 写入 stdin 的文本
- <ins>**returns**</ins> { [ShellProcess](shellProcessType) } - 当前对象, 可链式调用

与 [write](#m-write) 相同, 并在末尾追加换行符.

## [m] closeInput

### proc.closeInput()

**`6.8.0`**

- <ins>**returns**</ins> { [ShellProcess](shellProcessType) } - 当前对象, 可链式调用

关闭 stdin, 读取 stdin 的命令随即读到结尾.

```js
let proc = shell.spawn('cat');
proc.writeLine('hello').closeInput();
console.log(proc.readLine()); // hello
console.log(proc.waitFor()); // 0
```

## [m] waitFor

### proc.waitFor()

**`6.8.0`** **`Overload 1/2`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 退出码

阻塞到进程退出. 不应在 Android UI 线程调用.

### proc.waitFor(timeout)

**`6.8.0`** **`Overload 2/2`**

- **timeout** { [number](dataTypes#number) } - 最长等待时间, 单位为毫秒, 不能为负数
- <ins>**returns**</ins> { [number](dataTypes#number) | [null](dataTypes#null) } - 退出码, 到时仍在运行时为 `null`

```js
let proc = shell.spawn('sleep 5');
console.log(proc.waitFor(200)); // null
proc.kill();
```

## [m] kill

### proc.kill()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 调用时进程是否仍在运行

结束进程及其启动的子进程, 例如 `getevent | grep ...` 中的 `getevent` 与 `grep`. Root 模式下这些进程不属于 AutoJs6, 由另一个 Root Shell 按命令中的标记结束, 因此会有短暂延迟. 已注册的监听器仍会收到剩余的行与 `exit` 事件.

## [m] getInputStream

### proc.getInputStream()

**`6.8.0`**

- <ins>**returns**</ins> { [java.io.InputStream](https://developer.android.com/reference/java/io/InputStream) } - stdout

返回原始 stdout. 此后 stdout 不能再使用 [readLine](#m-readline) 或 `output` 事件.

## [m] getErrorStream

### proc.getErrorStream()

**`6.8.0`**

- <ins>**returns**</ins> { [java.io.InputStream](https://developer.android.com/reference/java/io/InputStream) } - stderr

返回原始 stderr, `pty` 时为空流. 此后 stderr 不能再使用 [readErrorLine](#m-readerrorline) 或 `errorOutput` 事件.

## [m] getOutputStream

### proc.getOutputStream()

**`6.8.0`**

- <ins>**returns**</ins> { [java.io.OutputStream](https://developer.android.com/reference/java/io/OutputStream) } - stdin

返回原始 stdin, 与 [write](#m-write) 写入同一个流.

## [m] toString

### proc.toString()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 便于诊断的摘要

包含 `pid`, `mode`, 命令行开头部分, 是否运行及退出码.

## 事件

使用 `on`, `addListener`, `once`, `prependListener`, `prependOnceListener`, `off`, `removeListener` 和 `removeAllListeners` 管理监听器, 它们返回当前对象; `listenerCount(eventName)` 返回监听器数量. 注册监听器或通过 off/removeListener 移除监听器时, 事件名只能是下表之一, 其他事件名抛出异常. TypeScript 根据事件名推断回调参数: output/errorOutput 为 string, exit 为 number. 此对象不提供 emit 或其他未列出的 EventEmitter 方法.

| 事件 | 回调签名 | 含义 |
| --- | --- | --- |
| output | `(line: string) => void` | 一行 stdout, 不含换行符 |
| errorOutput | `(line: string) => void` | 一行 stderr, 不含换行符 |
| exit | `(exitCode: number) => void` | 进程已退出, 且以事件读取的流已排空; 每个对象交付一次 |

事件经注册监听器的线程的事件循环交付, 与 `setTimeout` 相同. 存在监听器且进程运行期间, 脚本不会因主代码执行完毕而退出; 移除全部监听器后不再阻止脚本退出.

第一个 `output` 或 `errorOutput` 监听器开始读取对应的流, 此后移除全部监听器时, 读到的行被丢弃. 监听器处理不及时时暂停读取而不丢弃行, 进程随后在写满的管道上阻塞. `exit` 在最后一行之后交付; 进程结束后才注册的 `exit` 监听器同样会收到.

```js
let proc = shell.spawn('for i in 1 2 3; do echo line$i; sleep 1; done; exit 5');
proc.on('output', (line) => console.log('out:', line));
proc.on('exit', (code) => console.log('exit:', code)); // exit: 5
```

需要逐行实时读取 getevent 等在管道上缓冲输出的程序时, 可启用 `pty` (参阅 [ShellOptions](shell#shelloptions)):

```js
let proc = shizuku.spawn('getevent -tl', { pty: true });
proc.on('output', (line) => {
    if (line.indexOf('BTN_TOUCH') >= 0) console.log(line);
});
setTimeout(() => proc.kill(), 30000);
```
