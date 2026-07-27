# 定时器 (Timers)

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
