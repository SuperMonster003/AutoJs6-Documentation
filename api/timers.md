# 定时器 (Timers)

<!-- runtime-support:begin timers -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `timers`, 全局 8 项 | `autojs6:tasks`, `autojs6:timers` | `autojs6:tasks`, `autojs6:timers` | `host.tasks`, `host.timers` |
| 状态 | 已支持 26 项 | 已支持 10 项, 已支持 (本地实现) 4 项, 不适用 12 项 | 已支持 10 项, 已支持 (本地实现) 4 项, 不适用 12 项 | 已支持 (本地实现) 4 项, 需授权 10 项, 不适用 12 项 |
| 授权 | - | - | - | `tasks.control` 10 项 |

差异项 (15 项): 下表列出入口, 状态或授权与同列多数 API 不同的 API, 未列出的 API 与同列多数一致.

| API | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- |
| `clearImmediate` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.clearImmediate` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.clearImmediate` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `global setTimeout / setInterval / setImmediate and their clear functions` |
| `clearInterval` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.clearInterval` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.clearInterval` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `global setTimeout / setInterval / setImmediate and their clear functions` |
| `clearTimeout` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.clearTimeout` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.clearTimeout` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `global setTimeout / setInterval / setImmediate and their clear functions` |
| `timers.keepAlive`, `keepAlive` | <span title="local-shim">已支持 (本地实现)</span>: `keepAlive` (`autojs6:timers`) | <span title="local-shim">已支持 (本地实现)</span>: `keepAlive` (`autojs6:timers`) | <span title="local-shim">已支持 (本地实现)</span>: `host.timers.keepAlive` |
| `loop` | <span title="local-shim">已支持 (本地实现)</span>: `loop` (`autojs6:timers`) | <span title="local-shim">已支持 (本地实现)</span>: `loop` (`autojs6:timers`) | <span title="local-shim">已支持 (本地实现)</span>: `host.timers.loop` |
| `setImmediate` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.setImmediate` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.setImmediate` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `global setTimeout / setInterval / setImmediate and their clear functions` |
| `setInterval` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.setInterval` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.setInterval` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `global setTimeout / setInterval / setImmediate and their clear functions` |
| `setTimeout` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.setTimeout` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.setTimeout` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `global setTimeout / setInterval / setImmediate and their clear functions` |
| `timers.clearImmediate` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.clearImmediate` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.clearImmediate` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `global setTimeout / setInterval / setImmediate and their clear functions` |
| `timers.clearInterval` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.clearInterval` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.clearInterval` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `global setTimeout / setInterval / setImmediate and their clear functions` |
| `timers.clearTimeout` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.clearTimeout` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.clearTimeout` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `global setTimeout / setInterval / setImmediate and their clear functions` |
| `timers.setImmediate` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.setImmediate` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.setImmediate` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `global setTimeout / setInterval / setImmediate and their clear functions` |
| `timers.setInterval` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.setInterval` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.setInterval` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `global setTimeout / setInterval / setImmediate and their clear functions` |
| `timers.setIntervalExt` | <span title="local-shim">已支持 (本地实现)</span>: `setIntervalExt` (`autojs6:timers`) | <span title="local-shim">已支持 (本地实现)</span>: `setIntervalExt` (`autojs6:timers`) | <span title="local-shim">已支持 (本地实现)</span>: `host.timers.setIntervalExt` |
| `timers.setTimeout` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.setTimeout` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `node:timers.setTimeout` | <span title="not-portable: runtime-native">不适用</span> (运行时自带等价功能), 等价写法: `global setTimeout / setInterval / setImmediate and their clear functions` |

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

`timers` 模块提供当前脚本进程内的事件循环定时器, 并提供一组与 [workManager](workManager) 兼容的持久化任务入口.

脚本内定时器是单线程的. 当前脚本长时间阻塞时, 回调只能在事件循环恢复后执行.

---

<p style="font: bold 2em sans-serif; color: #FF7043">timers</p>

---

## [m] setTimeout

### setTimeout(callback, delay?, ...args)

**`Global`**

- **callback** { [Function](dataTypes#function) } - 定时器到期时执行的函数
- **[ delay = 1 ]** { [number](dataTypes#number) } - 等待时间, 单位为毫秒
- **...args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - 传给回调的参数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 定时器 ID

创建单次定时器.

## [m] setInterval

### setInterval(callback, delay?, ...args)

**`Global`**

- **callback** { [Function](dataTypes#function) } - 每次定时器到期时执行的函数
- **[ delay = 1 ]** { [number](dataTypes#number) } - 间隔时间, 单位为毫秒
- **...args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - 传给回调的参数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 定时器 ID

创建重复定时器.

## [m] setImmediate

### setImmediate(callback, ...args)

**`Global`**

- **callback** { [Function](dataTypes#function) } - 当前事件循环结束后执行的函数
- **...args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - 传给回调的参数
- <ins>**returns**</ins> { [number](dataTypes#number) } - 定时器 ID

创建立即定时器.

## [m] clearTimeout

### clearTimeout(id)

**`Global`**

- **id** { [number](dataTypes#number) } - [setTimeout](#m-settimeout) 返回的定时器 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否取消了匹配的定时器

## [m] clearInterval

### clearInterval(id)

**`Global`**

- **id** { [number](dataTypes#number) } - [setInterval](#m-setinterval) 返回的定时器 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否取消了匹配的定时器

## [m] clearImmediate

### clearImmediate(id)

**`Global`**

- **id** { [number](dataTypes#number) } - [setImmediate](#m-setimmediate) 返回的定时器 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否取消了匹配的定时器

## [m] setIntervalExt

### setIntervalExt(listener, interval?, timeoutOrCondition?, callback?)

- **listener** { [Function](dataTypes#function) } - 每次间隔到期时执行的函数
- **[ interval = 200 ]** { [number](dataTypes#number) } - 间隔时间, 单位为毫秒
- **[ timeoutOrCondition ]** { [number](dataTypes#number) | [Function](dataTypes#function) } - 总超时时间或结束条件
- **[ callback ]** { [Function](dataTypes#function) } - 结束时执行的回调
- <ins>**returns**</ins> { [number](dataTypes#number) } - 首次调度的定时器 ID

重复执行 `listener`. 第 3 个参数为正数时, 从调用开始经过指定毫秒数后结束; 为函数时, 每次执行 `listener` 后计算结束条件. 条件结果不是 `null`, `undefined` 或 `false` 时结束, 并将该结果传给 `callback`.

## [m] keepAlive

### keepAlive(timeout?)

**`Global`**

- **[ timeout = 0 ]** { [number](dataTypes#number) } - 保持脚本存活的时间, 单位为毫秒
- <ins>**returns**</ins> { [number](dataTypes#number) } - 定时器 ID

`timeout` 大于 `0` 时创建对应时长的空定时器. 省略或不大于 `0` 时创建每 `10000` 毫秒执行一次的空定时器, 使脚本持续运行.

## loop()

**`Global`** **`ABANDONED`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

此兼容方法不再提供事件循环控制功能, 调用时仅输出废弃警告.

---

## 持久化任务兼容入口

**`6.8.0`**

以下方法委托给 [workManager](workManager). 创建操作始终同步执行, 会忽略 `callback`, `condition`, `isAsync` 和 `async` 选项. 删除操作返回数据库布尔结果, 与 [tasks.removeTimedTask](tasks#m-removetimedtask) 和 [tasks.removeIntentTask](tasks#m-removeintenttask) 返回任务对象的语义不同.

## [m] addDailyTask

### addDailyTask(options)

**`6.8.0`**

- **options** { [Object](dataTypes#object) } - [每日任务选项](tasks#m-adddailytask)
- <ins>**returns**</ins> { [TimedTask](tasks#timedtask) }

## [m] addWeeklyTask

### addWeeklyTask(options)

**`6.8.0`**

- **options** { [Object](dataTypes#object) } - [每周任务选项](tasks#m-addweeklytask)
- <ins>**returns**</ins> { [TimedTask](tasks#timedtask) }

## [m] addDisposableTask

### addDisposableTask(options)

**`6.8.0`**

- **options** { [Object](dataTypes#object) } - [一次性任务选项](tasks#m-adddisposabletask)
- <ins>**returns**</ins> { [TimedTask](tasks#timedtask) }

## [m] addIntentTask

### addIntentTask(options)

**`6.8.0`**

- **options** { [Object](dataTypes#object) } - [广播任务选项](tasks#m-addintenttask)
- <ins>**returns**</ins> { [IntentTask](tasks#intenttask) }

## [m] getTimedTask

### getTimedTask(id)

**`6.8.0`**

- **id** { [number](dataTypes#number) } - 任务 ID
- <ins>**returns**</ins> { [TimedTask](tasks#timedtask) | [null](dataTypes#null) }

## [m] getIntentTask

### getIntentTask(id)

**`6.8.0`**

- **id** { [number](dataTypes#number) } - 任务 ID
- <ins>**returns**</ins> { [IntentTask](tasks#intenttask) | [null](dataTypes#null) }

## [m] removeTimedTask

### removeTimedTask(id)

**`6.8.0`**

- **id** { [number](dataTypes#number) } - 任务 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 删除结果, 任务不存在时返回 `null`

## [m] removeIntentTask

### removeIntentTask(id)

**`6.8.0`**

- **id** { [number](dataTypes#number) } - 任务 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 删除结果, 任务不存在时返回 `null`

## [m] queryTimedTasks

### queryTimedTasks(options?)

**`6.8.0`**

- **[ options = {} ]** {{ path?: [string](dataTypes#string) }}
- <ins>**returns**</ins> { [TimedTask](tasks#timedtask)[] }

## [m] queryIntentTasks

### queryIntentTasks(options?)

**`6.8.0`**

- **[ options = {} ]** {{
    - path?: [string](dataTypes#string);
    - action?: [string](dataTypes#string);
- }}
- <ins>**returns**</ins> { [IntentTask](tasks#intenttask)[] }
