# 引擎 (Engines)

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

- **path** { [string](dataTypes#string) } - JavaScript 文件路径
- **[ config = {} ]** { [object](dataTypes#object) } - [执行配置](#执行配置)
- <ins>**returns**</ins> { [ScriptExecution](#scriptexecution) } - 脚本执行对象

在新引擎中执行 JavaScript 文件. 相对路径按当前脚本运行时路径解析.

```js
engines.execScriptFile('./worker.js', {
    workingDirectory: files.cwd(),
    delay: 100,
    loopTimes: 1,
});
```

## [m] execAutoFile

### execAutoFile(path, config?)

- **path** { [string](dataTypes#string) } - JavaScript 文件路径
- **[ config = {} ]** { [object](dataTypes#object) } - [执行配置](#执行配置)
- <ins>**returns**</ins> { [ScriptExecution](#scriptexecution) } - 脚本执行对象

以自动化脚本模式在新引擎中执行 JavaScript 文件. 此模式会在执行前确保无障碍服务已启动.

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
