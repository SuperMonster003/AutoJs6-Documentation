# Shell

<!-- runtime-support:begin shell -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `shell`, 全局 19 项 | `autojs6:shell` | `autojs6:shell` | `host.shell` |
| 状态 | 已支持 30 项 | 已支持 30 项 | 已支持 30 项 | 需授权 30 项 |
| 授权 | - | - | - | `shell.root` 21 项, `shell.control` 9 项 |

差异项 (9 项): 下表列出入口, 状态或授权与同列多数 API 不同的 API, 未列出的 API 与同列多数一致.

| API | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- |
| `SetScreenMetrics` | <span title="bridged">已支持</span> | <span title="bridged">已支持</span> | <span title="capability-gated">需授权</span> `shell.control` |
| `shell.checkAccess` | <span title="bridged">已支持</span> | <span title="bridged">已支持</span> | <span title="capability-gated">需授权</span> `shell.control` |
| `shell.execCommand` | <span title="bridged">已支持</span> | <span title="bridged">已支持</span> | <span title="capability-gated">需授权</span> `shell.control` |
| `shell.fromIntent` | <span title="bridged">已支持</span> | <span title="bridged">已支持</span> | <span title="capability-gated">需授权</span> `shell.control` |
| `shell.getCommand` | <span title="bridged">已支持</span> | <span title="bridged">已支持</span> | <span title="capability-gated">需授权</span> `shell.control` |
| `shell.isRootAvailable` | <span title="bridged">已支持</span> | <span title="bridged">已支持</span> | <span title="capability-gated">需授权</span> `shell.control` |
| `shell.kill` | <span title="bridged">已支持</span> | <span title="bridged">已支持</span> | <span title="capability-gated">需授权</span> `shell.control` |
| `shell.setDefaultOptions` | <span title="bridged">已支持</span> | <span title="bridged">已支持</span> | <span title="capability-gated">需授权</span> `shell.control` |
| `shell.spawn` | <span title="bridged">已支持</span> | <span title="bridged">已支持</span> | <span title="capability-gated">需授权</span> `shell.control` |

返回对象 (1 个): 本页说明的对象的成员状态, 每个对象一行.

| 返回对象 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| `ShellResult` (5 项) | 已支持 5 项 | 不适用 5 项 (需要 Java 对象) | 不适用 5 项 (需要 Java 对象) | 不适用 5 项 (需要 Java 对象) |

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

交互式终端会话, 可见执行和输出事件由独立的 [terminal 模块](terminal) 提供, 需要安装 3-Shell Terminal 插件. 本章的 API 由 AutoJs6 自身提供, 不需要插件; 两者的返回值及进程权限不同.

shell 模块用于在 Android 设备本地执行 Shell 命令.

它不会建立 ADB 连接. 命令可以以下列身份运行:

- 普通模式使用 AutoJs6 应用进程可用的 `sh`.
- Root 模式 (`root`) 使用 `su`.
- adb 模式 (`adb`) 在 AutoJs6 的 [Shizuku](shizuku) 用户服务中运行, 身份与 Shizuku 服务相同: 经 ADB 启动的 Shizuku 为 shell 用户, 经 Root 启动的 Shizuku 为 root. `root` 与 `adb` 同时启用时, 命令在 Shizuku 进程中经 `su` 运行 (与 Auto.js Pro 相同).

命令正文通常与 `adb shell` 后面的部分相同.

`shell` 与 `$shell` 指向同一个可调用模块对象.

执行方式的区别:

- `shell(...)` 和 `shell.execCommand(...)` 启动独立进程, 同步等待命令结束, 返回 [ShellResult](#c-shellresult), 随后销毁进程.
- [shell.spawn(...)](#m-spawn) 启动独立进程后立即返回 [ShellProcess](shellProcessType), 可逐行或以事件实时读取输出, 向 stdin 写入, 等待或结束进程.
- 全局 Java 类 [Shell](#c-shell) 维护一个持久的 Shell 进程, 可连续写入多条命令. `new Shell()` 与 `new Shell(withRoot)` 使用终端会话; `new Shell(options)` 与 `new Shell(cmd)` 使用管道 (兼容 Auto.js Pro), 提供流方法和按退出码标记分割的 `execAndWaitFor`.

命令权限由实际执行身份决定. `withRoot = true` 只表示尝试使用 `su`, 不保证设备已取得 Root 权限.

---

<p style="font: bold 2em sans-serif; color: #FF7043">shell</p>

---

## [@] shell

### shell(command, withRoot?)

**`[6.8.0]`** **`Overload [1-2]/4`**

- **command** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 命令或命令数组
- **[ withRoot = false ]** { [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否使用 Root
- <ins>**returns**</ins> { [ShellResult](#c-shellresult) } - 命令执行结果

### shell(command, arguments, withRoot?)

**`6.6.0`** **`[6.8.0]`** **`Overload [3-4]/4`**

- **command** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 命令或命令数组
- **arguments** { [string](dataTypes#string) | [ShellArguments](#shellarguments) } - 待拼接的命令参数
- **[ withRoot = false ]** { [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否使用 Root
- <ins>**returns**</ins> { [ShellResult](#c-shellresult) } - 命令执行结果

同步执行命令. 命令数组会先以换行符连接. 命令开头的 `adb shell` 和相邻空白会被忽略, 因此以下调用等效:

```js
let resultA = shell('id');
let resultB = shell('adb shell id');
console.log(resultA.code, resultB.code);
```

Root 模式启动失败, 命令退出码非 `0` 或标准错误非空时, 通常仍返回 [ShellResult](#c-shellresult), 由调用方检查 `code` 和 `error`. 参数类型或数量不合法时会直接抛出异常.

`root` 与 `adb` 既未经 `withRoot` 也未经 `arguments` 指定时, 采用 [setDefaultOptions](#m-setdefaultoptions) 为当前脚本设置的默认值, 再退回 `false`. `adb` 启用时命令经 Shizuku 执行, 结果与 [shizuku(...)](shizuku) 相同; Shizuku 不可用时抛出异常.

```js
let result = shell('pm list packages -3', { adb: true });
console.log(result.code, result.result.trim().split('\n').length);
```

```js
let result = shell('pm list packages', {
    3: true,
    user: 0,
});
if (result.code === 0) {
    console.log(result.result.trim());
} else {
    console.error(result.error);
}
```

## [m] execCommand

### execCommand(command, withRoot?)

**`6.6.0`** **`[6.8.0]`** **`Overload [1-2]/4`**

- **command** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 命令或命令数组
- **[ withRoot = false ]** { [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否使用 Root
- <ins>**returns**</ins> { [ShellResult](#c-shellresult) } - 命令执行结果

### execCommand(command, arguments, withRoot?)

**`6.6.0`** **`[6.8.0]`** **`Overload [3-4]/4`**

- **command** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 命令或命令数组
- **arguments** { [string](dataTypes#string) | [ShellArguments](#shellarguments) } - 待拼接的命令参数
- **[ withRoot = false ]** { [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否使用 Root
- <ins>**returns**</ins> { [ShellResult](#c-shellresult) } - 命令执行结果

与直接调用 `shell(...)` 等效.

## [m] getCommand

### getCommand(command, withRoot?)

**`6.6.0`** **`Overload [1-2]/4`**

- **command** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 命令或命令数组
- **[ withRoot = false ]** { [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否在结果前添加 `su`
- <ins>**returns**</ins> { [string](dataTypes#string) } - 构造后的命令

### getCommand(command, arguments, withRoot?)

**`6.6.0`** **`Overload [3-4]/4`**

- **command** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 命令或命令数组
- **arguments** { [string](dataTypes#string) | [ShellArguments](#shellarguments) } - 待拼接的命令参数
- **[ withRoot = false ]** { [boolean](dataTypes#boolean) | [number](dataTypes#number) } - 是否在结果前添加 `su`
- <ins>**returns**</ins> { [string](dataTypes#string) } - 构造后的命令

仅构造命令字符串, 不执行命令. Root 启用时, 返回值以 `su` 和换行符开头.

```js
let command = shell.getCommand('pm list packages', '3 | user=0 | root');
console.log(command);
/* 输出:
su
pm list packages -3 --user 0
*/
```

## ShellArguments

ShellArguments 是用于构造命令行参数的普通 JavaScript 对象.

- **[ root = false ]** { [boolean](dataTypes#boolean) } - 是否使用 Root, 不会输出为命令行参数
- **[ exit = false ]** { [boolean](dataTypes#boolean) } - 是否在命令末尾追加退出和清理命令
- **[ adb = false ]** { [boolean](dataTypes#boolean) } - 是否经 Shizuku 执行 (兼容 Auto.js Pro), 不会输出为命令行参数

除 `root`, `exit` 和 `adb` 外, 其他属性会按以下规则转换:

- 已以 `--` 开头的键转换为 kebab-case 长参数.
- 已以单个 `-` 开头的键保持原样.
- 长度为 `1` 或 `2` 的键添加单个 `-`.
- 其他键转换为 kebab-case 并添加 `--`.
- 值为 `true` 时只输出参数名.
- 其他值输出为参数名和值. 包含空格或以 `-` 开头的字符串值使用双引号包围.

例如 `{ user: 0, displayId: 2, v: true }` 转换为 `--user 0 --display-id 2 -v`.

字符串形式的 `arguments` 使用 `|` 分隔条目. `key=value` 表示带值参数, 仅有 `key` 表示布尔标志:

```js
shell.getCommand('cmd package list packages', 'user=0 | 3');
// cmd package list packages --user 0 -3
```

AutoJs6 6.8.0 之前, `adb` 键会转换为 `--adb` 参数. 现在需要该参数时应写作 `'--adb'` 键.

特殊条目 `root`, `exit` 和 `adb` 与对象同名属性作用相同. 特殊值转换为字符串后, 只有精确的 `false` 会将对应选项关闭, 其他值均会启用选项. `exit` 启用时实际追加:

```text
exit
kill $$
```

显式 `withRoot` 与 `arguments.root` 按逻辑或组合, 因此任一值为真都会启用 Root. 二者都未给出时, `root` 与 `adb` 采用 [setDefaultOptions](#m-setdefaultoptions) 的默认值; [getCommand](#m-getcommand) 不读取默认值.

此转换只提供基础的命令行拼接, 不等同于完整的 Shell 转义器. 对来自外部的数据仍应自行验证和转义.

## [m] fromIntent

### fromIntent(intent)

**`[6.8.0]`**

- **intent** { [Intent](intentType) | [object](dataTypes#object) } - Android Intent 或 Intent 选项对象
- <ins>**returns**</ins> { [string](dataTypes#string) } - `am` 命令可用的 Intent 参数片段

将 Intent 转换为 `-n`, `-a`, `-c`, `-e`, `-f`, `-t` 和 `-d` 等参数组成的字符串. 返回值不包含 `am`, `start` 或其他命令前缀.

此方法与 [app.intentToShell(options)](app#app-intenttoshell-options) 使用相同的转换规则. 字符串形式的 Activity 简称不属于此方法的有效输入.

```js
let intentArguments = shell.fromIntent({
    packageName: autojs.packageName,
    className: 'org.autojs.autojs.ui.settings.SettingsActivity_',
});
shell(`am start ${intentArguments}`);
```

## [m] kill

### kill(app)

**`6.6.0`**

- **app** { [string](dataTypes#string) | [App](appType) } - 应用显示名, 包名, 预设别名或应用枚举
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功停止应用

解析应用标识并使用 Root 执行 `am force-stop`. Root 不可用, 应用标识无法解析或命令退出码非 `0` 时返回 `false`.

此方法不使用 Shizuku. 如需按可用权限选择执行方式, 可使用 [app.kill](app#m-kill).

## [m] currentPackage

### currentPackage()

**`6.6.1`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 当前前台应用包名, 查询失败时为空字符串

使用 Root 读取 `dumpsys activity activities` 的当前 resumed activity, 并返回组件中 `/` 之前的部分.

## [m] currentActivity

### currentActivity()

**`6.6.1`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 当前前台 Activity 标识, 查询失败时为空字符串

使用 Root 读取当前 resumed activity. 组件使用完整类名时返回 `/` 之后的类名. 组件使用以 `.` 开头的相对类名时, 当前实现返回完整的 `package/activity` 组件字符串.

## [m] currentComponent

### currentComponent()

**`6.6.1`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 当前前台组件, 查询失败时为空字符串

使用 Root 读取当前 resumed activity. 结果通常采用 `package/activity` 形式.

## [m] spawn

### spawn(command)

**`6.8.0`** **`Overload 1/3`**

- **command** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 命令或命令数组
- <ins>**returns**</ins> { [ShellProcess](shellProcessType) } - 正在运行的进程

### spawn(command, withRoot)

**`6.8.0`** **`Overload 2/3`**

- **command** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 命令或命令数组
- **withRoot** { [boolean](dataTypes#boolean) } - 是否使用 Root
- <ins>**returns**</ins> { [ShellProcess](shellProcessType) } - 正在运行的进程

### spawn(command, options)

**`6.8.0`** **`Overload 3/3`**

- **command** { [string](dataTypes#string) | [string](dataTypes#string)[[]](dataTypes#array) } - 命令或命令数组
- **options** { [ShellOptions](#shelloptions) } - 进程选项, 不支持 `cmd`
- <ins>**returns**</ins> { [ShellProcess](shellProcessType) } - 正在运行的进程

启动进程运行命令后立即返回 [ShellProcess](shellProcessType), 不等待命令结束. TypeScript 将其声明为 `Shell.Process`, 可以继续补全进程属性, 流方法和事件回调. `spawn` 的第二个参数接受布尔值或选项对象, 不接受 `shell(...)` 兼容的数字 Root 标记. 命令数组以换行符连接. 普通模式与 adb 模式经 `sh -c` 运行, Root 模式经 `su -c` 运行, 因此命令可以包含管道, 重定向和多条语句. 未指定的 `root` 与 `adb` 采用 [setDefaultOptions](#m-setdefaultoptions) 的默认值.

进程随启动它的脚本结束而结束. 读取输出, 事件, 写入 stdin 和结束进程的方法见 [ShellProcess](shellProcessType).

```js
let proc = shell.spawn('logcat -v brief', { adb: true });
proc.on('output', (line) => {
    if (line.indexOf('ActivityManager') >= 0) console.log(line);
});
setTimeout(() => proc.kill(), 10000);
```

## ShellOptions

TypeScript 使用 `Shell.SpawnOptions` 表示 spawn 的选项, `Shell.Options` 表示构造器选项, `Shell.DefaultOptions` 表示仅含 root/adb 的默认选项.

ShellOptions 是 [spawn](#m-spawn), [shizuku.spawn](shizuku#m-spawn) 和管道 [Shell](#c-shell) 构造方法使用的普通 JavaScript 对象. 出现其他属性时抛出异常.

- **[ root = false ]** { [boolean](dataTypes#boolean) } - 是否经 `su` 以 Root 身份运行
- **[ adb = false ]** { [boolean](dataTypes#boolean) } - 是否在 Shizuku 用户服务中运行, Shizuku 不可用时抛出异常
- **[ pty = false ]** { [boolean](dataTypes#boolean) } - 是否在伪终端上运行
- **[ env ]** { [object](dataTypes#object) } - 追加的环境变量, 键须为合法的变量名
- **[ cwd ]** { [string](dataTypes#string) } - 工作目录, 相对路径按脚本工作目录解析; 目录无法进入时进程以退出码 `1` 结束
- **[ cmd ]** { [string](dataTypes#string) } - 仅用于 `new Shell(options)`: 持久 Shell 的程序行, 默认为 `sh`, `root` 为 `true` 时经 `su` 运行 (兼容 Auto.js Pro)

`root` 与 `adb` 同时启用时, 命令在 Shizuku 进程中经 `su` 运行. `env` 与 `cwd` 由命令开头的 `export` 与 `cd` 应用, 因此对重置环境的 `su` 实现同样有效.

`pty` 使命令的 stdin, stdout 与 stderr 连接到伪终端. getevent, awk 等程序的输出接到管道时由 C 标准库按块缓冲, 接到终端时逐行刷新; 需要严格逐行实时读取时可启用此选项. 以 getevent 为例, 一次触摸产生的事件通常已超过一个缓冲块, 因此管道下多数行也能及时送达, 但缓冲中剩余的少量行要等后续事件才会送达. 启用 `pty` 后:

- stderr 并入 stdout, ShellProcess 的 `readErrorLine()` 与 `errorOutput` 事件不再有数据, `getErrorStream()` 为空流.
- 写入的文本不会回显, 行尾与管道相同为 `\n`.
- Android 9 及以下使用 Magisk 时, Root 模式下 su 另开的终端仍会回显写入的文本, 行尾为 `\r\n`. 逐行读取方法会去掉行尾的 `\r`.

## [m] setDefaultOptions

### setDefaultOptions(options)

**`6.8.0`**

- **options** { [object](dataTypes#object) | [null](dataTypes#null) | [undefined](dataTypes#undefined) } - 默认选项 `{ root?, adb? }`, 均为 [boolean](dataTypes#boolean); `null` 或 `undefined` 表示清除
- <ins>**returns**</ins> { [void](dataTypes#void) }

为当前脚本设置 `shell(...)`, `shell.execCommand(...)` 和 [spawn](#m-spawn) 中未显式指定的 `root` 与 `adb` 的默认值 (兼容 Auto.js Pro). 每次调用替换之前的默认值, 省略的属性表示不设置默认值. 只支持 `root` 与 `adb`, 其他属性会抛出异常. 设置只影响当前脚本, 不影响 `new Shell(...)`, [getCommand](#m-getcommand) 与 [shizuku](shizuku).

`adb` 默认值为 `true` 时, 全局兼容函数 [KeyCode](#m-keycode) 及其按键快捷函数, [Text](#m-text), [Input](#m-input), [Tap](#m-tap), [Swipe](#m-swipe), [Screencap](#m-screencap) 和 [SetScreenMetrics](#m-setscreenmetrics) 改为经 Shizuku 执行, Shizuku 不可用时抛出异常. 两种执行方式的坐标缩放基准分别保存, 应在 setDefaultOptions 之后调用 SetScreenMetrics.

```js
$shell.setDefaultOptions({ adb: true });
console.log(shell('id -u').result.trim()); // Shizuku 的运行身份, 如 2000.
console.log(shell('id -u', false).result.trim()); // 仍经 Shizuku: withRoot 只指定 root.
$shell.setDefaultOptions(null);
```

## [m] checkAccess

### checkAccess(type)

**`6.8.0`**

- **type** { [string](dataTypes#string) } - 权限类型, `root` 或 `adb`
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前是否具有该权限

检查权限 (兼容 Auto.js Pro):

- `root`: 经 `su` 执行 `id`, 输出包含 `uid=0` 时返回 `true`. 首次检查可能触发 Root 管理器的授权提示, 方法阻塞到命令结束.
- `adb`: Shizuku 正在运行且已授权 AutoJs6 时返回 `true`, 等同于 [shizuku.state](shizuku#p-state) 的 `isOperational`.

其他值抛出异常.

```js
if ($shell.checkAccess('adb')) {
    console.log(shell('id', { adb: true }).result.trim());
}
```

## [m] isRootAvailable

### isRootAvailable()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 设备是否具备 Root

与 [autojs.isRootAvailable()](autojs#m-isrootavailable) 相同 (兼容 Auto.js Pro). 返回 `true` 只表示设备具备 Root, 不表示 AutoJs6 已获授权; 检查授权使用 [checkAccess('root')](#m-checkaccess).

---

## [C] ShellResult

ShellResult 是 `shell(...)`, `shell.execCommand(...)` 和 [shizuku](shizuku) 返回的 Java 对象, 实际类型为 `org.autojs.autojs.runtime.api.AbstractShell.Result`.

ShellResult 不是全局构造函数. 其 3 个字段均为公开可写字段.

<p style="font: bold 2em sans-serif; color: #FF7043">ShellResult</p>

### [p#] code

- { [number](dataTypes#number) } - 退出码

通常 `0` 表示命令成功. 标准错误非空时, ShellResult 会确保 `code` 不为 `0`. 进程创建或执行异常也会转换为非零结果.

### [p#] result

- { [string](dataTypes#string) } - 标准输出

输出非空时通常包含末尾换行符. 可使用 `result.trim()` 去除首尾空白.

### [p#] error

- { [string](dataTypes#string) } - 标准错误或执行异常消息

### [m#] toString

#### ShellResult#toString()

- <ins>**returns**</ins> { [string](dataTypes#string) } - 便于诊断的结果摘要

返回内容包含 `code`, `error` 和 `result`.

### [m#] toJson

#### ShellResult#toJson()

**`6.4.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - JSON 字符串

返回包含 `code`, `result` 和 `error` 的格式化 JSON.

### [m#] throwIfError

#### ShellResult#throwIfError()

**`6.6.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

`code !== 0` 时抛出 `org.autojs.autojs.runtime.api.AbstractShell.Result.ShellException`, 否则直接返回.

```js
let result = shell('id');
result.throwIfError();
console.log(result.result.trim());
```

Java 静态方法 `org.autojs.autojs.runtime.api.AbstractShell.Result.fromJson(json)` 可从 JSON 恢复结果对象, 但它不是 shell 模块或全局 `ShellResult` 的成员.

---

<p style="font: bold 2em sans-serif; color: #FF7043">global</p>

---

## 全局兼容函数

以下函数由 shell 模块直接挂载到全局作用域, 不属于 `shell` 对象的成员.

### [m] KeyCode

#### KeyCode(keyCode)

**`Global`** **`[6.8.0]`**

- **keyCode** { [number](dataTypes#number) | [string](dataTypes#string) } - Android 按键码或按键名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 Android 按键事件. 支持以下形式:

- 数值或十进制数值字符串, 如 `24`.
- 十六进制字符串, 如 `'0x18'`.
- 完整按键名称, 如 `'KEYCODE_VOLUME_UP'`.
- 省略 `KEYCODE_` 的名称, 如 `'VOLUME_UP'`.

名称匹配不区分大小写. 无法识别的按键码会抛出异常.

从 AutoJs6 6.7.1 起, Shizuku 可操作时优先使用 Shizuku 执行 `input keyevent`; 否则使用运行时 Root Shell. Shizuku 命令执行失败时不会再尝试 Root. 从 6.8.0 起, 经 [setDefaultOptions](#m-setdefaultoptions) 将 `adb` 默认值设为 `true` 后总是经 Shizuku 执行, Shizuku 不可用时抛出异常.

```js
KeyCode('BACK');
KeyCode(24); // KEYCODE_VOLUME_UP
```

### 按键快捷函数

以下函数使用与 [KeyCode](#m-keycode) 相同的 Shizuku 或 Root 选择规则.

### [m] Menu

#### Menu()

**`Global`** **`[6.8.0]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 `KEYCODE_MENU`.

### [m] Home

#### Home()

**`Global`** **`[6.8.0]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 `KEYCODE_HOME`.

### [m] Back

#### Back()

**`Global`** **`[6.8.0]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 `KEYCODE_BACK`.

### [m] Up

#### Up()

**`Global`** **`[6.8.0]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 `KEYCODE_DPAD_UP`.

### [m] Down

#### Down()

**`Global`** **`[6.8.0]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 `KEYCODE_DPAD_DOWN`.

### [m] Left

#### Left()

**`Global`** **`[6.8.0]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 `KEYCODE_DPAD_LEFT`.

### [m] Right

#### Right()

**`Global`** **`[6.8.0]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 `KEYCODE_DPAD_RIGHT`.

### [m] OK

#### OK()

**`Global`** **`[6.8.0]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 `KEYCODE_DPAD_CENTER`.

### [m] VolumeUp

#### VolumeUp()

**`Global`** **`[6.8.0]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 `KEYCODE_VOLUME_UP`.

### [m] VolumeDown

#### VolumeDown()

**`Global`** **`[6.8.0]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 `KEYCODE_VOLUME_DOWN`.

### [m] Power

#### Power()

**`Global`** **`[6.8.0]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 `KEYCODE_POWER`.

### [m] Camera

#### Camera()

**`Global`** **`[6.8.0]`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

发送 `KEYCODE_CAMERA`.

### [m] Text

#### Text(text)

**`Global`** **`[6.8.0]`**

- **text** { [string](dataTypes#string) } - 待输入文本
- <ins>**returns**</ins> { [void](dataTypes#void) }

通过运行时 Root Shell 写入 `input text` 命令. 方法写入命令后返回, 不等待命令执行完成. 经 [setDefaultOptions](#m-setdefaultoptions) 将 `adb` 默认值设为 `true` 后改为经 Shizuku 执行, 并等待命令结束.

### [m] Input

#### Input(text)

**`Global`** **`[6.8.0]`**

- **text** { [string](dataTypes#string) } - 待输入文本
- <ins>**returns**</ins> { [void](dataTypes#void) }

[Text(text)](#m-text) 的兼容别名.

### [m] Tap

#### Tap(x, y)

**`Global`** **`[6.8.0]`**

- **x** { [number](dataTypes#number) } - X 坐标
- **y** { [number](dataTypes#number) } - Y 坐标
- <ins>**returns**</ins> { [void](dataTypes#void) }

通过运行时 Root Shell 写入 `input tap` 命令. 坐标受 [SetScreenMetrics](#m-setscreenmetrics) 设置的缩放规则影响. `adb` 默认值为 `true` 时改为经 Shizuku 执行 (参阅 [setDefaultOptions](#m-setdefaultoptions)).

### [m] Swipe

#### Swipe(x1, y1, x2, y2, duration?)

**`Global`** **`[6.8.0]`**

- **x1** { [number](dataTypes#number) } - 起点 X 坐标
- **y1** { [number](dataTypes#number) } - 起点 Y 坐标
- **x2** { [number](dataTypes#number) } - 终点 X 坐标
- **y2** { [number](dataTypes#number) } - 终点 Y 坐标
- **[ duration ]** { [number](dataTypes#number) } - 滑动时长, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

通过运行时 Root Shell 写入 `input swipe` 命令. 省略 `duration` 时不向系统命令提供时长参数. `adb` 默认值为 `true` 时改为经 Shizuku 执行 (参阅 [setDefaultOptions](#m-setdefaultoptions)).

### [m] Screencap

#### Screencap(path)

**`Global`** **`[6.8.0]`**

- **path** { [string](dataTypes#string) } - Shell 可写入的目标路径
- <ins>**returns**</ins> { [void](dataTypes#void) }

通过运行时 Root Shell 写入 `screencap -p` 命令. 路径不会经过 [files](files) 模块解析. 方法不等待截图完成. `adb` 默认值为 `true` 时改为经 Shizuku 执行并等待命令结束 (参阅 [setDefaultOptions](#m-setdefaultoptions)).

### [m] SetScreenMetrics

#### SetScreenMetrics(width, height)

**`Global`** **`[6.8.0]`**

- **width** { [number](dataTypes#number) } - 脚本设计宽度
- **height** { [number](dataTypes#number) } - 脚本设计高度
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置运行时 Root Shell 的坐标缩放基准, 影响后续 [Tap](#m-tap) 和 [Swipe](#m-swipe). 此方法与小写全局方法 [setScreenMetrics](global#m-setscreenmetrics) 使用不同的内部对象. `adb` 默认值为 `true` 时设置的是经 Shizuku 执行时使用的缩放基准 (参阅 [setDefaultOptions](#m-setdefaultoptions)).

---

<p style="font: bold 2em sans-serif; color: #FF7043">Shell</p>

## [C] Shell

大写 `Shell` 是通过运行时全局类代理提供的 Java 类 `org.autojs.autojs.runtime.api.Shell`. 实例维护一个持久的 Shell 进程, 按构造方法分为两类:

- 终端会话 Shell: `new Shell()`, `new Shell(withRoot)` 及带 Context 的构造方法. 普通实例以 `sh` 初始化, Root 实例以 `su` 初始化终端会话, 不使用 Shizuku. 输出经回调或 `execAndWaitFor` 读取, 不提供流方法.
- 管道 Shell: `new Shell(options)` 与 `new Shell(cmd)` (兼容 Auto.js Pro). 进程的 stdin, stdout 与 stderr 为管道 (`pty` 时为伪终端), 可经 Shizuku 运行, 提供流方法, `execForResult` 以及按退出码标记分割输出的 `execAndWaitFor`. 进程随创建它的脚本结束而结束.

管道 Shell 的输出只能以一种方式读取, 由首次调用决定: 流方法 (`getInputStream`, `getErrorStream`) 或托管方法 (`setCallback`, `execAndWaitFor`, `execForResult`). 两类方法混用时抛出异常. `exec()` 只写入命令本身, 因此先 `exec()` 再读取流不会混入额外内容.

调用 `exit()` 或 `exitAndWaitFor()` 后不应继续复用实例. 终端会话 Shell 应在脚本结束前显式退出.

### [c] ()

**`6.6.1`** **`Global`** **`Overload 1/6`**

- <ins>**returns**</ins> { [Shell](#c-shell) } - 普通权限 Shell

创建普通权限 Shell, 相当于 `new Shell(false)`.

### [c] (withRoot)

**`Global`** **`Overload 2/6`**

- **withRoot** { [boolean](dataTypes#boolean) } - 是否以 `su` 初始化
- <ins>**returns**</ins> { [Shell](#c-shell) } - Shell 实例

### [c] (context)

**`6.6.1`** **`Global`** **`Overload 3/6`**

- **context** { [android.content.Context](https://developer.android.com/reference/android/content/Context) } - Android Context
- <ins>**returns**</ins> { [Shell](#c-shell) } - 普通权限 Shell

使用指定 Context 创建普通权限 Shell.

### [c] (context, withRoot)

**`Global`** **`Overload 4/6`**

- **context** { [android.content.Context](https://developer.android.com/reference/android/content/Context) } - Android Context
- **withRoot** { [boolean](dataTypes#boolean) } - 是否以 `su` 初始化
- <ins>**returns**</ins> { [Shell](#c-shell) } - Shell 实例

终端会话 Shell 会在 Android 主线程异步创建终端会话. 首次执行命令时可能等待初始化完成. 初始化 `su` 失败时会抛出相应异常. 在 Android UI 主线程中创建实例后, 应等待 `onInitialized()` 再调用命令方法.

```js
let sh = new Shell(false);
try {
    console.log(sh.execAndWaitFor('pwd'));
} finally {
    sh.exitAndWaitFor();
}
```

### [c] (options)

**`6.8.0`** **`Global`** **`Overload 5/6`**

- **options** { [ShellOptions](#shelloptions) } - Shell 选项
- <ins>**returns**</ins> { [Shell](#c-shell) } - 管道 Shell

创建管道 Shell (兼容 Auto.js Pro). 未指定 `cmd` 时运行 `sh`, `root` 为 `true` 时经 `su` 运行. `adb` 为 `true` 时进程在 Shizuku 用户服务中运行, Shizuku 不可用时抛出异常. `env` 与 `cwd` 在首条命令之前生效. 此构造方法不读取 [setDefaultOptions](#m-setdefaultoptions) 的默认值.

`pty` 为 `true` 时输出接到伪终端, stderr 并入 stdout; 写入的命令不会回显, Android 9 及以下使用 Magisk 的 Root 模式除外 (参阅 [ShellOptions](#shelloptions)).

```js
let sh = new Shell({ adb: true });
sh.exec('getevent -tl | grep -E "ABS_MT_POSITION|UP|DOWN|ffffff"');
let reader = new java.io.BufferedReader(new java.io.InputStreamReader(sh.getInputStream()));
threads.start(() => {
    let line;
    while ((line = reader.readLine()) != null) {
        console.log(line);
    }
});
setTimeout(() => sh.exit(), 30000);
```

### [c] (cmd)

**`6.8.0`** **`Global`** **`Overload 6/6`**

- **cmd** { [string](dataTypes#string) } - 程序行, 如 `'sh'` 或 `'su'`
- <ins>**returns**</ins> { [Shell](#c-shell) } - 管道 Shell

相当于 `new Shell({ cmd: cmd })`. 程序行按空白拆分为程序及其参数.

### [p] COMMAND_SU

#### Shell.COMMAND_SU

**`CONSTANT`** **`READONLY`**

- [[ `'su'` ]] { [string](dataTypes#string) }

Root Shell 的初始命令.

### [p] COMMAND_SH

#### Shell.COMMAND_SH

**`CONSTANT`** **`READONLY`**

- [[ `'sh'` ]] { [string](dataTypes#string) }

普通 Shell 的初始命令.

### [p] COMMAND_LINE_END

#### Shell.COMMAND_LINE_END

**`CONSTANT`** **`READONLY`**

- [[ `'\n'` ]] { [string](dataTypes#string) }

Shell 命令行结束符.

### [p] COMMAND_EXIT

#### Shell.COMMAND_EXIT

**`CONSTANT`** **`READONLY`**

- [[ `'exit\n'` ]] { [string](dataTypes#string) }

Shell 退出命令.

### [m#] exec

#### Shell#exec(command)

**`Async`**

- **command** { [string](dataTypes#string) } - 待执行命令
- <ins>**returns**</ins> { [void](dataTypes#void) }

终端会话 Shell 等待终端完成初始化, 将命令和换行符写入会话, 随后返回. 管道 Shell 将命令和换行符写入 stdin, 不追加其他内容. 此方法不等待命令执行完成.

### [m#] execAndWaitFor

#### Shell#execAndWaitFor(command)

**`[6.8.0]`**

- **command** { [string](dataTypes#string) } - 待执行命令
- <ins>**returns**</ins> { [string](dataTypes#string) } - 本次命令的输出

执行命令并阻塞到命令结束. 不应在 Android UI 主线程调用此阻塞方法.

- 终端会话 Shell 阻塞到终端再次出现 Shell 提示符, 返回内容不包含首行的命令回显. 不提供退出码或独立标准错误.
- 管道 Shell 在命令后追加带 `$?` 的标记, 据此分割输出, 返回本次命令的 stdout (每行带换行符), 与 `execForResult(command).result` 相同. 此前经 `exec()` 写入但尚未输出完的内容也会计入本次结果.

### [m#] execForResult

#### Shell#execForResult(command)

**`6.8.0`**

- **command** { [string](dataTypes#string) } - 待执行命令
- <ins>**returns**</ins> { [ShellResult](#c-shellresult) } - 本次命令的 stdout, stderr 与退出码

仅限管道 Shell. 执行命令并阻塞到命令结束, 以命令后的标记分割 stdout 与 stderr, `code` 为命令的实际退出码 (与 `shell(...)` 不同, stderr 非空时不会改写 `code`). `pty` 时 stderr 并入 `result`, `error` 为空字符串. 同一实例的多次调用依次执行. 终端会话 Shell 调用时抛出异常.

```js
let sh = new Shell({ root: false });
let r = sh.execForResult("sh -c 'echo out; echo err >&2; exit 3'");
console.log(r.code, JSON.stringify(r.result), JSON.stringify(r.error)); // 3 "out\n" "err\n"
sh.exitAndWaitFor();
```

### [m#] setCallback

#### Shell#setCallback(callback)

- **callback** { [Shell.Callback](#i-shellcallback) | [null](dataTypes#null) } - 输出回调, `null` 表示清除回调
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置输出回调. 管道 Shell 的 stdout 与 stderr 每行都会触发回调, 回调在读取线程上依次调用 (不经过脚本线程的事件循环), `onInitialized()` 在设置时立即调用. 设置后不能再使用流方法.

```js
let sh = new Shell(false);
sh.setCallback({
    onNewLine(line) {
        console.log(line);
    },
    onInitialized() {
        sh.exec('id');
    },
});
```

### [m#] isInitialized

#### Shell#isInitialized()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 终端是否已完成初始化

管道 Shell 总是返回 `true`.

### [m#] isExecWithRoot

#### Shell#isExecWithRoot()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 实例是否配置为使用 Root

返回构造时的配置, 不表示 `su` 已成功授权.

### [m#] exit

#### Shell#exit()

- <ins>**returns**</ins> { [void](dataTypes#void) }

立即结束终端会话, 不等待已写入命令完成. 管道 Shell 会同时结束 Shell 启动的进程; Root 模式下这些进程由另一个 Root Shell 结束.

### [m#] exitAndWaitFor

#### Shell#exitAndWaitFor()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入 `exit` 并阻塞等待 Shell 退出. 终端会话的 Root 实例会依次退出 `su` 和外层 Shell. 管道 Shell 写入 `exit` 并关闭 stdin, 等待已写入的命令执行完毕; 仍在运行的长期命令 (如 `getevent`) 会使此方法一直等待, 此时应使用 `exit()`.

不应在 Android UI 主线程调用此阻塞方法.

### [m#] getTermSession

#### Shell#getTermSession()

- <ins>**returns**</ins> { [object](dataTypes#object) | [null](dataTypes#null) } - `jackpal.androidterm.emulatorview.TermSession` 实例

返回底层终端会话. 初始化完成前可能为 `null`, 管道 Shell 总是返回 `null`. 此入口主要用于高级 Java 互操作.

### [m#] isAdb

#### Shell#isAdb()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否在 Shizuku 用户服务中运行

### [m#] getInputStream

#### Shell#getInputStream()

**`6.8.0`**

- <ins>**returns**</ins> { [java.io.InputStream](https://developer.android.com/reference/java/io/InputStream) } - Shell 进程的 stdout

仅限管道 Shell. 返回原始 stdout, 之后不能再使用托管方法. 终端会话 Shell 调用时抛出异常.

### [m#] getErrorStream

#### Shell#getErrorStream()

**`6.8.0`**

- <ins>**returns**</ins> { [java.io.InputStream](https://developer.android.com/reference/java/io/InputStream) } - Shell 进程的 stderr

仅限管道 Shell. `pty` 时为空流. 之后不能再使用托管方法.

### [m#] getOutputStream

#### Shell#getOutputStream()

**`6.8.0`**

- <ins>**returns**</ins> { [java.io.OutputStream](https://developer.android.com/reference/java/io/OutputStream) } - Shell 进程的 stdin

仅限管道 Shell. 写入的内容由 Shell 当作命令读取, 与 `exec()` 写入同一个流.

### [m#] waitFor

#### Shell#waitFor()

**`6.8.0`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 退出码

仅限管道 Shell. 阻塞到 Shell 进程退出. 不应在 Android UI 主线程调用.

### [m#] exitCode

#### Shell#exitCode()

**`6.8.0`**

- <ins>**returns**</ins> { [number](dataTypes#number) | [null](dataTypes#null) } - 退出码, 运行期间为 `null`

仅限管道 Shell. 返回值是 `java.lang.Integer`, 与数值比较时使用 `==`.

### [m#] exitAndReadOutput

#### Shell#exitAndReadOutput()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - Shell 退出前剩余的 stdout

仅限管道 Shell (兼容 Auto.js Pro). 关闭 stdin, 等待已写入的命令执行完毕并返回其间的 stdout. 已使用托管方法时, 返回不属于 `execAndWaitFor` 或 `execForResult` 的输出.

```js
let sh = new Shell({});
sh.exec('echo r1');
sh.exec('echo r2');
console.log(JSON.stringify(sh.exitAndReadOutput())); // "r1\nr2\n"
```

### [m#] raw

#### Shell#raw()

**`6.8.0`**

- <ins>**returns**</ins> { [java.lang.Process](https://developer.android.com/reference/java/lang/Process) | [object](dataTypes#object) } - 底层进程或终端会话

管道 Shell 返回底层 `java.lang.Process` (adb 模式下为代理 Shizuku 进程的对象), 终端会话 Shell 返回 `TermSession`.

---

<p style="font: bold 2em sans-serif; color: #FF7043">Shell.Callback</p>

---

## [I] Shell.Callback

`Shell.Callback` 是终端事件回调接口. JavaScript 对象可按需实现其方法并传给 [`Shell#setCallback()`](#m-setcallback).

### [m!] onOutput

#### Shell.Callback#onOutput(str)

- **str** { [string](dataTypes#string) } - 移除 `\r` 后的原始输出块
- <ins>**returns**</ins> { [void](dataTypes#void) }

终端收到输出块时调用. 一个输出块可能包含半行, 一行或多行文本. 管道 Shell 每次传入一整行加换行符.

### [m!] onNewLine

#### Shell.Callback#onNewLine(line)

- **line** { [string](dataTypes#string) } - 不含换行符且已移除首尾空白的输出行
- <ins>**returns**</ins> { [void](dataTypes#void) }

终端组成一行完整输出时调用. 管道 Shell 传入的行不移除首尾空白.

### [m!] onInitialized

#### Shell.Callback#onInitialized()

- <ins>**returns**</ins> { [void](dataTypes#void) }

终端完成初始化时调用. 管道 Shell 在 `setCallback()` 中立即调用.

### [m!] onInterrupted

#### Shell.Callback#onInterrupted(error)

- **error** { [java.lang.InterruptedException](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/InterruptedException.html) } - 中断异常
- <ins>**returns**</ins> { [void](dataTypes#void) }

等待终端初始化或退出的线程被中断时调用. 注册此回调后, Shell 会把中断交给回调处理, 而不是直接退出并抛出脚本中断异常.

---

<p style="font: bold 2em sans-serif; color: #FF7043">Shell.SimpleCallback</p>

---

## [C] Shell.SimpleCallback

- <ins>**implements**</ins> { [Shell.Callback](#i-shellcallback) }

`Shell.SimpleCallback` 为 `Shell.Callback` 的 4 个方法提供空实现, 适用于只需覆盖部分回调的 JavaAdapter 或 Java 互操作代码.

### [c] ()

- <ins>**returns**</ins> { [Shell.SimpleCallback](#c-shellsimplecallback) } - 空回调实例

构造一个所有回调均不执行操作的实例.

---

<p style="font: bold 2em sans-serif; color: #FF7043">Shell</p>

---

## Shell 兼容实例成员

下列公开方法继承自 `org.autojs.autojs.runtime.api.AbstractShell`. 除设置方法外, 它们通常只是向当前 Shell 会话写入命令, 不等待执行完成.

### [m#] SetScreenMetrics

#### Shell#SetScreenMetrics(width, height)

**`Overload 1/2`**

- **width** { [number](dataTypes#number) } - 脚本设计宽度
- **height** { [number](dataTypes#number) } - 脚本设计高度
- <ins>**returns**</ins> { [void](dataTypes#void) }

#### Shell#SetScreenMetrics(screenMetrics)

**`Overload 2/2`**

- **screenMetrics** { org.autojs.autojs.runtime.api.ScreenMetrics } - 屏幕度量对象
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置本实例的坐标缩放规则, 影响 `Tap`, `Swipe`, `TouchX` 和 `TouchY`.

### [m#] SetTouchDevice

#### Shell#SetTouchDevice(device)

- **device** { [number](dataTypes#number) } - `/dev/input/eventN` 中的设备编号 `N`
- <ins>**returns**</ins> { [void](dataTypes#void) }

仅当实例尚未取得有效触摸设备编号时写入该编号.

### [m#] SendEvent

#### Shell#SendEvent(type, code, value)

**`Overload 1/2`**

- **type** { [number](dataTypes#number) } - Linux 输入事件类型
- **code** { [number](dataTypes#number) } - Linux 输入事件码
- **value** { [number](dataTypes#number) } - 事件值
- <ins>**returns**</ins> { [void](dataTypes#void) }

#### Shell#SendEvent(device, type, code, value)

**`Overload 2/2`**

- **device** { [number](dataTypes#number) } - 输入设备编号
- **type** { [number](dataTypes#number) } - Linux 输入事件类型
- **code** { [number](dataTypes#number) } - Linux 输入事件码
- **value** { [number](dataTypes#number) } - 事件值
- <ins>**returns**</ins> { [void](dataTypes#void) }

写入 `sendevent /dev/input/eventN` 命令. 通常需要 Root 或等效的设备节点写权限.

### [m#] Touch

#### Shell#Touch(x, y)

- **x** { [number](dataTypes#number) } - X 坐标
- **y** { [number](dataTypes#number) } - Y 坐标
- <ins>**returns**</ins> { [void](dataTypes#void) }

依次调用 [`Shell#TouchX()`](#m-touchx) 和 [`Shell#TouchY()`](#m-touchy) 发送触摸位置事件. 坐标按本实例的 ScreenMetrics 缩放.

### [m#] TouchX

#### Shell#TouchX(x)

- **x** { [number](dataTypes#number) } - X 坐标
- <ins>**returns**</ins> { [void](dataTypes#void) }

写入 Linux 输入事件 `type=3, code=53`. 坐标按本实例的 ScreenMetrics 缩放.

### [m#] TouchY

#### Shell#TouchY(y)

- **y** { [number](dataTypes#number) } - Y 坐标
- <ins>**returns**</ins> { [void](dataTypes#void) }

写入 Linux 输入事件 `type=3, code=54`. 坐标按本实例的 ScreenMetrics 缩放.

### [m#] Tap

#### Shell#Tap(x, y)

- **x** { [number](dataTypes#number) } - X 坐标
- **y** { [number](dataTypes#number) } - Y 坐标
- <ins>**returns**</ins> { [void](dataTypes#void) }

写入 `input tap x y`. 坐标按本实例的 ScreenMetrics 缩放.

### [m#] Swipe

#### Shell#Swipe(x1, y1, x2, y2)

**`Overload 1/2`**

- **x1** { [number](dataTypes#number) } - 起点 X 坐标
- **y1** { [number](dataTypes#number) } - 起点 Y 坐标
- **x2** { [number](dataTypes#number) } - 终点 X 坐标
- **y2** { [number](dataTypes#number) } - 终点 Y 坐标
- <ins>**returns**</ins> { [void](dataTypes#void) }

写入不含时长的 `input swipe` 命令. 坐标按本实例的 ScreenMetrics 缩放.

#### Shell#Swipe(x1, y1, x2, y2, duration)

**`Overload 2/2`**

- **x1** { [number](dataTypes#number) } - 起点 X 坐标
- **y1** { [number](dataTypes#number) } - 起点 Y 坐标
- **x2** { [number](dataTypes#number) } - 终点 X 坐标
- **y2** { [number](dataTypes#number) } - 终点 Y 坐标
- **duration** { [number](dataTypes#number) } - 滑动时长, 单位为毫秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

写入包含时长的 `input swipe` 命令. 坐标按本实例的 ScreenMetrics 缩放.

### [m#] KeyCode

#### Shell#KeyCode(keyCode)

**`Overload [1-2]/2`**

- **keyCode** { [number](dataTypes#number) | [string](dataTypes#string) } - Android 按键码或直接传给系统命令的按键文本
- <ins>**returns**</ins> { [void](dataTypes#void) }

直接写入 `input keyevent keyCode`. 此方法不使用 Shizuku, 也不执行全局 [`KeyCode()`](#m-keycode) 的名称解析和有效性检查.

### [m#] Home

#### Shell#Home()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入按键码 `3`.

### [m#] Back

#### Shell#Back()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入按键码 `4`.

### [m#] Power

#### Shell#Power()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入按键码 `26`.

### [m#] Up

#### Shell#Up()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入按键码 `19`.

### [m#] Down

#### Shell#Down()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入按键码 `20`.

### [m#] Left

#### Shell#Left()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入按键码 `21`.

### [m#] Right

#### Shell#Right()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入按键码 `22`.

### [m#] OK

#### Shell#OK()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入按键码 `23`.

### [m#] VolumeUp

#### Shell#VolumeUp()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入按键码 `24`.

### [m#] VolumeDown

#### Shell#VolumeDown()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入按键码 `25`.

### [m#] Menu

#### Shell#Menu()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入按键码 `1`. 此键码来自当前遗留实现, 与全局 [`Menu()`](#m-menu) 使用的 `KEYCODE_MENU` 不同.

### [m#] Camera

#### Shell#Camera()

- <ins>**returns**</ins> { [void](dataTypes#void) }

写入按键码 `27`.

### [m#] Input

#### Shell#Input(text)

- **text** { [string](dataTypes#string) } - 待输入文本
- <ins>**returns**</ins> { [void](dataTypes#void) }

写入 `input text text`.

### [m#] Text

#### Shell#Text(text)

- **text** { [string](dataTypes#string) } - 待输入文本
- <ins>**returns**</ins> { [void](dataTypes#void) }

[`Shell#Input()`](#m-input) 的别名.

### [m#] Screencap

#### Shell#Screencap(path)

- **path** { [string](dataTypes#string) } - Shell 可写入的目标路径
- <ins>**returns**</ins> { [void](dataTypes#void) }

写入 `screencap -p path`.

### [m#] sleep

#### Shell#sleep(seconds)

- **seconds** { [number](dataTypes#number) } - 延时时长, 单位为秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

写入 `sleep seconds`. 此方法执行 Shell 命令, 不会让 JavaScript 调用线程直接休眠.

### [m#] usleep

#### Shell#usleep(microseconds)

- **microseconds** { [number](dataTypes#number) } - 延时时长, 单位为微秒
- <ins>**returns**</ins> { [void](dataTypes#void) }

写入 `usleep microseconds`. 此方法执行 Shell 命令, 不会让 JavaScript 调用线程直接休眠.
