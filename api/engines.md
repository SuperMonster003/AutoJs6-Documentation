# 引擎 (Engines)

<!-- runtime-support:begin engines -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `engines` | `engines` | `engines` | `host.engines` |
| 状态 | 已支持 8 项 | 已支持 8 项 | 已支持 8 项 | 需授权 8 项 |
| 授权 | - | - | - | `engines.control` 8 项 |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

返回对象 (2 个): 本页说明的对象的成员状态, 每个对象一行.

| 返回对象 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| `ScriptEngine` (16 项) | 已支持 16 项 | 不适用 16 项 (需要 Java 对象) | 不适用 16 项 (需要 Java 对象) | 不适用 16 项 (需要 Java 对象) |
| `ScriptExecution` (12 项) | 已支持 12 项 | 不适用 12 项 (需要 Java 对象) | 不适用 12 项 (需要 Java 对象) | 不适用 12 项 (需要 Java 对象) |

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

engines 模块用于启动, 查询和停止脚本引擎, 并监听全部脚本引擎的生命周期事件.

---

<p style="font: bold 2em sans-serif; color: #FF7043">engines</p>

---

## 执行配置

`execScript`, `execScriptFile` 和 `execAutoFile` 的 `config` 参数支持以下属性:

- **[ workingDirectory = engines.myEngine().cwd() ]** { [string](dataTypes#string) } - 工作目录
- **[ path = engines.myEngine().cwd() ]** { [string](dataTypes#string) } - `workingDirectory` 的兼容别名
- **[ delay = 0 ]** { [number](dataTypes#number) } - 首次执行前的延迟, 单位为毫秒
- **[ interval = 0 ]** { [number](dataTypes#number) } - 重复执行之间的间隔, 单位为毫秒
- **[ loopTimes = 1 ]** { [number](dataTypes#number) } - 执行次数. `0` 表示持续执行
- **[ arguments = {} ]** { [object](dataTypes#object) } - 传给新引擎的参数

`arguments` 可在新引擎中通过 `engines.myEngine().execArgv` 读取.

## [m] execScript

### execScript(name, script, config?)

- **name** { [string](dataTypes#string) } - 脚本名称
- **script** { [string](dataTypes#string) } - JavaScript 源码
- **[ config = {} ]** {{
    - workingDirectory?: [string](dataTypes#string);
    - path?: [string](dataTypes#string);
    - delay?: [number](dataTypes#number);
    - interval?: [number](dataTypes#number);
    - loopTimes?: [number](dataTypes#number);
    - arguments?: [object](dataTypes#object);
- }} - 执行配置
- <ins>**returns**</ins> { [ScriptExecution](#scriptexecution) } - 脚本执行对象

在新引擎中执行字符串源码.

```js
let execution = engines.execScript('worker', `
    console.log(engines.myEngine().execArgv.message);
`, {
    arguments: { message: 'hello' },
});
console.log(execution.getId());
```

## [m] execScriptFile

### execScriptFile(path, config?)

**`[6.8.0]`**

- **path** { [string](dataTypes#string) } - JavaScript 或 Python 文件路径
- **[ config = {} ]** { [object](dataTypes#object) } - [执行配置](#执行配置)
- <ins>**returns**</ins> { [ScriptExecution](#scriptexecution) } - 脚本执行对象

在新引擎中执行本地脚本文件. 相对路径按当前脚本运行时路径解析.

从 AutoJs6 6.8.0 开始, 本地 `.py` 文件由独立的 Python Runtime 插件执行. 插件不可用或已禁用时, 启动将以失败结束, 且不会回退到 JavaScript 引擎.

```js
engines.execScriptFile('./worker.js', {
    workingDirectory: files.cwd(),
    delay: 100,
    loopTimes: 1,
});
```

## [m] execAutoFile

### execAutoFile(path, config?)

**`[6.8.0]`**

- **path** { [string](dataTypes#string) } - JavaScript 文件路径
- **[ config = {} ]** { [object](dataTypes#object) } - [执行配置](#执行配置)
- <ins>**returns**</ins> { [ScriptExecution](#scriptexecution) } - 脚本执行对象

以自动化脚本模式在新引擎中执行 JavaScript 文件. 此方法保留 JavaScript 和原有自动化脚本语义, 并在执行前确保无障碍服务已启动.

此方法拒绝 Python 文件, 不会将 `.py` 文件交给 Python Runtime 插件. 执行 Python 文件时使用 [execScriptFile](#m-execscriptfile).

## [m] myEngine

### myEngine()

- <ins>**returns**</ins> { [ScriptEngine](#scriptengine) } - 当前脚本引擎

## [m] all

### all()

- <ins>**returns**</ins> { [ScriptEngine](#scriptengine)[[]](dataTypes#array) } - 当前存在的脚本引擎数组

## [m] getEngines

### getEngines()

- <ins>**returns**</ins> { java.util.Set&lt;[ScriptEngine](#scriptengine)&gt; } - 当前存在的脚本引擎集合

`getEngines` 返回 Java 集合. 需要 JavaScript 数组时使用 [all](#m-all).

## [m] stopAll

### stopAll()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 已请求停止的引擎数量

停止全部脚本引擎, 包括当前引擎.

## [m] stopAllAndToast

### stopAllAndToast()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 已请求停止的引擎数量

停止全部脚本引擎. 停止数量大于 `0` 时显示提示消息.

## 引擎事件

**`6.6.3`**

engines 是一个 [EventEmitter](eventEmitterType). 生命周期事件会发送到当时存在的每个 JavaScript 引擎.

### start

- **engine** { [ScriptEngine](#scriptengine) } - 已启动的引擎

脚本开始执行时触发.

```js
engines.on('start', (engine) => {
    console.log(`started: ${engine.getId()}`);
});
```

### finish

- **engine** { [ScriptEngine](#scriptengine) } - 已结束的引擎

脚本正常结束或异常处理完成时触发. 同一次结束随后还会依次触发兼容事件 `exit` 和 `stop`.

### exit

- **engine** { [ScriptEngine](#scriptengine) } - 已结束的引擎

`finish` 的兼容事件.

### stop

- **engine** { [ScriptEngine](#scriptengine) } - 已结束的引擎

`finish` 的兼容事件.

### exception

- **engine** { [ScriptEngine](#scriptengine) } - 发生异常的引擎
- **error** { [java.lang.Throwable](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Throwable.html) } - 异常

脚本发生未处理异常时触发. 随后还会触发兼容事件 `error`.

### error

- **engine** { [ScriptEngine](#scriptengine) } - 发生异常的引擎
- **error** { [java.lang.Throwable](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/Throwable.html) } - 异常

`exception` 的兼容事件.

---

<p style="font: bold 2em sans-serif; color: #FF7043">ScriptExecution</p>

---

# ScriptExecution

`execScript`, `execScriptFile` 和 `execAutoFile` 返回的脚本执行对象.

## [m#] ScriptExecution#getEngine

### getEngine()

- <ins>**returns**</ins> { [ScriptEngine](#scriptengine) } - 此次执行使用的脚本引擎

## [m#] ScriptExecution#getSource

### getSource()

- <ins>**returns**</ins> { org.autojs.autojs.script.ScriptSource } - 脚本源对象

## [m#] ScriptExecution#getConfig

### getConfig()

- <ins>**returns**</ins> { [ExecutionConfig](#executionconfig) } - 执行配置

## [m#] ScriptExecution#getListener

### getListener()

- <ins>**returns**</ins> { org.autojs.autojs.execution.ScriptExecutionListener } - 执行监听器

## [m#] ScriptExecution#getId

### getId()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 执行 ID

## [m#] ScriptExecution#isFinished

### isFinished()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

执行已报告结果后即为 `true`, 即使引擎仍在销毁过程中. UI 脚本的执行会保持注册, 直到其 Activity 被销毁.

```js
let execution = engines.execScript('quick', 'log(1)');
setTimeout(() => log(execution.isFinished()), 500); // 通常为 true
```

## [m#] ScriptExecution#getAgentContext

### getAgentContext()

- <ins>**returns**</ins> { org.autojs.autojs.execution.AgentScriptExecutionState | [null](dataTypes#null) }

由 [ai.agent](ai) 启动的执行返回其 Agent 运行状态, 普通执行返回 `null`. 以下几个方法是该状态的快捷读取.

## [m#] ScriptExecution#getAgentRunId

### getAgentRunId()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - Agent 运行 ID, 普通执行为 `null`

## [m#] ScriptExecution#getAgentParametersJson

### getAgentParametersJson()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - Agent 运行参数的 JSON 字符串

## [m#] ScriptExecution#getAgentPresetName

### getAgentPresetName()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - Agent 预设名称

## [m#] ScriptExecution#getAgentResult

### getAgentResult()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 已报告的结果 JSON

## [m#] ScriptExecution#setAgentResult

### setAgentResult(json)

- **json** { [string](dataTypes#string) } - 结果 JSON, 最多 64 KiB
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已保存

保存 Agent 运行结果. 不是有效 JSON, 超过 64 KiB 或执行不是 Agent 运行时返回 `false`.

```js
let execution = engines.execScript('agent-step', 'log(1)');
log(execution.getAgentRunId()); // null (普通执行)
log(execution.setAgentResult('{"ok":true}')); // false
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">ScriptEngine</p>

---

# ScriptEngine

脚本引擎对象. `engines.myEngine()` 返回当前 JavaScript 引擎.

## [m#] ScriptEngine#forceStop

### forceStop()

- <ins>**returns**</ins> { [void](dataTypes#void) }

强制停止此脚本引擎.

## [m#] ScriptEngine#cwd

### cwd()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 工作目录

## [m#] ScriptEngine#getStartTime

### getStartTime()

**`6.7.0`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 引擎启动时间

返回 Unix 时间戳, 单位为毫秒. 无法取得启动时间时返回 `0`.

## [m#] ScriptEngine#getSource

### getSource()

- <ins>**returns**</ins> { org.autojs.autojs.script.ScriptSource | [null](dataTypes#null) } - 当前脚本源

## [m#] ScriptEngine#getSourcePath

### getSourcePath()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 脚本来源路径

## [m#] ScriptEngine#getSourceUri

### getSourceUri()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 脚本来源 URI

## [m#] ScriptEngine#getSourceDirectory

### getSourceDirectory()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) } - 脚本来源目录或工作目录

## [m#] ScriptEngine#getExecArgv

### getExecArgv()

- <ins>**returns**</ins> { [object](dataTypes#object) } - 启动参数

在 JavaScript 中也可通过属性 `engine.execArgv` 读取.

## [m#] ScriptEngine#getId

### getId()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 引擎 ID

## [m#] ScriptEngine#isDestroyed

### isDestroyed()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 引擎是否已销毁

## [m#] ScriptEngine#hasFeature

### hasFeature(feature)

- **feature** { [string](dataTypes#string) } - 脚本功能名称
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前脚本是否启用该功能

## [m#] ScriptEngine#emit

### emit(eventName, ...args)

- **eventName** { [string](dataTypes#string) } - 事件名称
- **...args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - 事件参数
- <ins>**returns**</ins> { [void](dataTypes#void) }

向此引擎的 [events](events) 模块异步发送事件.

```js
let execution = engines.execScript('receiver', `
    events.on('message', (value) => console.log(value));
    setInterval(() => {}, 1000);
`);
setTimeout(() => execution.getEngine().emit('message', 'hello'), 100);
```

## [m#] ScriptEngine#getTag

### getTag(key)

- **key** { [string](dataTypes#string) } - 标签名
- <ins>**returns**</ins> { [any](dataTypes#any) } - 标签值, 未设置时为 `null`

读取引擎上的标签. 宿主使用的标签包括 `source` (脚本源), `execute_path` (工作目录) 和 `env_path`.

## [m#] ScriptEngine#setTag

### setTag(key, value)

- **key** { [string](dataTypes#string) } - 标签名
- **value** { [any](dataTypes#any) } - 标签值, `null` 表示删除
- <ins>**returns**</ins> { [void](dataTypes#void) }

在引擎上保存标签, 可用于在同一引擎的不同线程之间共享数据.

```js
let engine = engines.myEngine();
engine.setTag('stage', 'login');
log(engine.getTag('stage')); // login
```

## [m#] ScriptEngine#getUncaughtException

### getUncaughtException()

- <ins>**returns**</ins> { java.lang.Throwable | [null](dataTypes#null) }

引擎记录的未捕获异常, 没有时为 `null`. 脚本因异常结束后, 可经 [execScript](#m-execscript) 返回的执行对象的 `getEngine()` 读取.

## [m#] ScriptEngine#getBackingSourcePath

### getBackingSourcePath()

- <ins>**returns**</ins> { [string](dataTypes#string) | [null](dataTypes#null) }

脚本源是文件时返回该文件的绝对路径, 其他来源 (如字符串脚本) 返回 `null`.

```js
log(engines.myEngine().getBackingSourcePath());
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">ExecutionConfig</p>

---

# ExecutionConfig

执行配置对象的常用属性.

## [p#] workingDirectory

- [ `""` ] { [string](dataTypes#string) } - 工作目录

## [p#] delay

- [ `0` ] { [number](dataTypes#number) } - 首次执行前的延迟, 单位为毫秒

## [p#] interval

- [ `0` ] { [number](dataTypes#number) } - 重复执行之间的间隔, 单位为毫秒

## [p#] loopTimes

- [ `1` ] { [number](dataTypes#number) } - 执行次数. `0` 表示持续执行

## [p#] arguments

- [ `{}` ] { [object](dataTypes#object) } - 启动参数

## [m#] ExecutionConfig#getArgument

### getArgument(key)

- **key** { [string](dataTypes#string) } - 参数名称
- <ins>**returns**</ins> { [any](dataTypes#any) } - 参数值

## [m#] ExecutionConfig#setArgument

### setArgument(key, value)

- **key** { [string](dataTypes#string) } - 参数名称
- **value** { [any](dataTypes#any) } - 参数值
- <ins>**returns**</ins> { [void](dataTypes#void) }
