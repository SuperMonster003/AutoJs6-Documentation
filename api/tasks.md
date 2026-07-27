# 任务 (Tasks)

`tasks` 模块用于创建, 查询, 更新和删除持久化定时任务与广播触发任务. 定时任务由 AutoJs6 的任务调度后端执行, 不同于仅在当前脚本进程内生效的 [timers](timers) 定时器.

---

<p style="font: bold 2em sans-serif; color: #FF7043">tasks</p>

---

## 定时任务选项

所有创建定时任务的方法均使用一个选项对象:

- **options** {{
    - path: [string](dataTypes#string);
    - time?: [number](dataTypes#number) | [Date](dataTypes#date) | [string](dataTypes#string);
    - date?: [number](dataTypes#number) | [Date](dataTypes#date) | [string](dataTypes#string);
    - delay?: [number](dataTypes#number);
    - interval?: [number](dataTypes#number);
    - loopTimes?: [number](dataTypes#number);
    - callback?(task: [TimedTask](#timedtask)): [any](dataTypes#any);
    - isAsync?: [boolean](dataTypes#boolean);
- }}

字段含义:

- **path** - 必需. 要执行的脚本路径, 相对路径按当前脚本运行目录解析.
- **[ time ]** - 执行时刻或每日执行时间. 数字, `Date` 和可解析的日期时间字符串均可用.
- **[ date ]** - `time` 的备用字段. 两者同时存在时使用 `time`.
- **[ delay = 0 ]** - 脚本执行配置的启动延迟, 单位为毫秒.
- **[ interval = 0 ]** - 多次执行脚本时的循环间隔, 单位为毫秒.
- **[ loopTimes = 1 ]** - 每次任务触发后执行脚本的次数.
- **[ callback ]** - 数据库操作完成后的回调. 回调接收任务对象, `this` 指向选项对象.
- **[ isAsync = false ]** - 是否在线程中执行回调. 兼容字段名为 `async`.

未指定回调时, 创建方法返回新增的 `TimedTask`. 指定回调时返回回调结果; `isAsync` 为 `true` 时返回运行回调的线程对象.

### 重复结束条件

**`6.8.0`**

每日, 每周, 每月和每年任务可附加重复结束条件:

- **[ endMode = "forever" ]** { [number](dataTypes#number) | [string](dataTypes#string) } - 结束模式
- **[ untilDate ]** { [number](dataTypes#number) | [Date](dataTypes#date) | [string](dataTypes#string) } - 最后允许执行的日期
- **[ times ]** { [number](dataTypes#number) } - 最大执行次数, 必须大于 `0`

`endMode` 兼容字段名为 `ends`, `end` 和 `repeatEnd`. 支持以下值:

- `forever`, `always`, `never` 或 `0` - 永久重复.
- `untilDate`, `until`, `date` 或 `1` - 重复至 `untilDate`. 兼容字段名为 `until` 和 `endDate`.
- `count`, `times`, `number`, `numberOfEvents`, `forNumberOfEvents` 或 `2` - 重复指定次数. `times` 兼容字段名为 `endCount` 和 `count`.

省略 `endMode` 时, 存在日期结束字段则自动使用日期模式, 存在次数字段则自动使用次数模式. 一次性任务和倒计时任务忽略重复结束条件.

### 倒计时持续时间

**`6.8.0`**

倒计时时长可直接使用正数毫秒值, 或使用以下对象字段:

- **duration** {{
    - days?: [number](dataTypes#number);
    - hours?: [number](dataTypes#number);
    - minutes?: [number](dataTypes#number);
    - seconds?: [number](dataTypes#number);
    - milliseconds?: [number](dataTypes#number);
- }}

`duration` 兼容字段名为 `after`, `countdown`, `timeOffset` 和 `runAfter`. 各时间单位也接受常用单复数及缩写, 如 `day`, `h`, `min`, `sec` 和 `ms`. 所有分量必须为非负数, 合计结果必须大于 `0`.

## [m] addTask

### addTask(task)

- **task** { [TimedTask](#timedtask) | [IntentTask](#intenttask) | [null](dataTypes#null) } - 尚未保存的任务对象
- <ins>**returns**</ins> { [TimedTask](#timedtask) | [IntentTask](#intenttask) | [null](dataTypes#null) } - 原任务对象

将任务同步写入数据库. 参数为 `null` 时不执行操作并返回 `null`.

## [m] addTimedTask

### addTimedTask(options)

**`6.8.0`**

- **options** { [Object](dataTypes#object) } - [定时任务选项](#定时任务选项)
- <ins>**returns**</ins> { [any](dataTypes#any) } - 新任务, 回调结果或线程对象

按 `options.repeatMode` 创建定时任务. `repeatMode` 兼容字段名为 `repeat`, `type` 和 `mode`, 支持:

- `disposable`, `once`, `onetime`, `oneoff` 或 `0`.
- `daily`, `day` 或 `1`.
- `weekly`, `week` 或 `2`.
- `monthly`, `month` 或 `3`.
- `yearly`, `year`, `annually`, `annual` 或 `4`.
- `countdown`, `after`, `runafter`, `later` 或 `5`.

## [m] addDailyTask

### addDailyTask(options)

- **options** { [Object](dataTypes#object) } - [定时任务选项](#定时任务选项)
- <ins>**returns**</ins> { [any](dataTypes#any) } - 新任务, 回调结果或线程对象

创建每日任务. `time` 和 `date` 均省略时使用当前时间.

```js
let task = tasks.addDailyTask({
    path: "./daily.js",
    time: "08:30",
});
console.log(task.id);
```

## [m] addWeeklyTask

### addWeeklyTask(options)

- **options** { [Object](dataTypes#object) } - [定时任务选项](#定时任务选项), 另支持 `daysOfWeek`
- <ins>**returns**</ins> { [any](dataTypes#any) } - 新任务, 回调结果或线程对象

创建每周任务. `daysOfWeek` 是星期数组, 数字使用 `0` 或 `7` 表示星期日, `1` 至 `6` 表示星期一至星期六. 也可使用英文全称, 英文缩写或 `一` 至 `日`. 默认使用今天.

```js
tasks.addWeeklyTask({
    path: "./workday.js",
    time: "09:00",
    daysOfWeek: [ 1, 2, 3, 4, 5 ],
});
```

## [m] addMonthlyTask

### addMonthlyTask(options)

**`6.8.0`**

- **options** { [Object](dataTypes#object) } - [定时任务选项](#定时任务选项), 另支持 `dayOfMonth`
- <ins>**returns**</ins> { [any](dataTypes#any) } - 新任务, 回调结果或线程对象

创建每月任务. `dayOfMonth` 取值为 `1` 至 `31`, 兼容字段名为 `day`. 也可通过 `date` 提供日期, 默认使用今天的日号. 当目标月份没有指定日号时, 使用该月最后一天.

## [m] addYearlyTask

### addYearlyTask(options)

**`6.8.0`**

- **options** { [Object](dataTypes#object) } - [定时任务选项](#定时任务选项), 另支持 `monthOfYear` 和 `dayOfMonth`
- <ins>**returns**</ins> { [any](dataTypes#any) } - 新任务, 回调结果或线程对象

创建每年任务. `monthOfYear` 取值为 `1` 至 `12`, `dayOfMonth` 取值为 `1` 至 `31`; 兼容字段名分别为 `month` 和 `day`. 也可通过 `date` 同时提供月份和日号, 默认使用今天. 当目标年月没有指定日号时, 使用该月最后一天.

## [m] addDisposableTask

### addDisposableTask(options)

- **options** { [Object](dataTypes#object) } - [定时任务选项](#定时任务选项)
- <ins>**returns**</ins> { [any](dataTypes#any) } - 新任务, 回调结果或线程对象

创建一次性任务. `time` 和 `date` 均省略时使用当前时刻. 也可使用 [倒计时持续时间](#倒计时持续时间) 字段指定相对时长.

## [m] addCountdownTask

### addCountdownTask(options)

**`6.8.0`**

- **options** { [Object](dataTypes#object) } - [定时任务选项](#定时任务选项) 及 [倒计时持续时间](#倒计时持续时间)
- <ins>**returns**</ins> { [any](dataTypes#any) } - 新任务, 回调结果或线程对象

创建从当前时刻开始计时的一次性倒计时任务.

```js
tasks.addCountdownTask({
    path: "./later.js",
    after: { minutes: 10 },
});
```

## [m] addIntentTask

### addIntentTask(options)

- **options** {{
    - path: [string](dataTypes#string);
    - action?: [string](dataTypes#string);
    - category?: [string](dataTypes#string);
    - dataType?: [string](dataTypes#string);
    - isLocal?: [boolean](dataTypes#boolean);
    - callback?(task: [IntentTask](#intenttask)): [any](dataTypes#any);
    - isAsync?: [boolean](dataTypes#boolean);
- }}
- <ins>**returns**</ins> { [any](dataTypes#any) } - 新任务, 回调结果或线程对象

创建由匹配的广播 Intent 触发的任务. `isLocal` 兼容字段名为 `local`. AutoJs6 启动广播默认使用本地广播, 但显式指定的 `isLocal` 仍具有最终优先级.

## [m] addBroadcastIntentTask

### addBroadcastIntentTask(options)

**`6.8.0`**

- **options** { [Object](dataTypes#object) } - [tasks.addIntentTask](#m-addintenttask) 的选项
- <ins>**returns**</ins> { [any](dataTypes#any) }

[tasks.addIntentTask](#m-addintenttask) 的兼容别名.

## [m] getTimedTask

### getTimedTask(id)

- **id** { [number](dataTypes#number) } - 任务 ID
- <ins>**returns**</ins> { [TimedTask](#timedtask) | [null](dataTypes#null) } - 匹配的任务

## [m] getIntentTask

### getIntentTask(id)

- **id** { [number](dataTypes#number) } - 任务 ID
- <ins>**returns**</ins> { [IntentTask](#intenttask) | [null](dataTypes#null) } - 匹配的任务

## [m] removeTask

### removeTask(task)

- **task** { [TimedTask](#timedtask) | [IntentTask](#intenttask) | [null](dataTypes#null) }
- <ins>**returns**</ins> { [TimedTask](#timedtask) | [IntentTask](#intenttask) | [null](dataTypes#null) } - 原任务对象

同步删除任务. 参数为 `null` 时不执行操作并返回 `null`.

## [m] removeTimedTask

### removeTimedTask(id, options?)

- **id** { [number](dataTypes#number) } - 任务 ID
- **[ options = {} ]** {{
    - callback?(task: [TimedTask](#timedtask) | [null](dataTypes#null)): [any](dataTypes#any);
    - isAsync?: [boolean](dataTypes#boolean);
- }}
- <ins>**returns**</ins> { [any](dataTypes#any) } - 被删除的任务, `null`, 回调结果或线程对象

## [m] removeIntentTask

### removeIntentTask(id, options?)

- **id** { [number](dataTypes#number) } - 任务 ID
- **[ options = {} ]** {{
    - callback?(task: [IntentTask](#intenttask) | [null](dataTypes#null)): [any](dataTypes#any);
    - isAsync?: [boolean](dataTypes#boolean);
- }}
- <ins>**returns**</ins> { [any](dataTypes#any) } - 被删除的任务, `null`, 回调结果或线程对象

## [m] updateTask

### updateTask(task)

- **task** { [TimedTask](#timedtask) | [IntentTask](#intenttask) | [null](dataTypes#null) }
- <ins>**returns**</ins> { [TimedTask](#timedtask) | [IntentTask](#intenttask) | [null](dataTypes#null) } - 原任务对象

同步保存任务对象上的修改. 更新 `TimedTask` 时会先清除其已调度状态, 以便调度后端重新安排任务.

## [m] queryTimedTasks

### queryTimedTasks(options?)

- **[ options = {} ]** {{ path?: [string](dataTypes#string) }}
- <ins>**returns**</ins> { [TimedTask](#timedtask)[] }

查询所有定时任务. 指定 `path` 时仅返回脚本路径匹配的任务.

## [m] queryIntentTasks

### queryIntentTasks(options?)

- **[ options = {} ]** {{
    - path?: [string](dataTypes#string);
    - action?: [string](dataTypes#string);
- }}
- <ins>**returns**</ins> { [IntentTask](#intenttask)[] }

查询广播触发任务. 同时指定 `path` 和 `action` 时必须全部匹配.

## [m] timeFlagToDays

### timeFlagToDays(flag)

- **flag** { [number](dataTypes#number) } - 星期位标志
- <ins>**returns**</ins> { [number](dataTypes#number)[] } - 已启用的星期编号

将星期位标志转换为编号数组. 编号 `0` 至 `6` 依次表示星期日到星期六.

## [m] daysToTimeFlag

### daysToTimeFlag(days)

- **days** { [number](dataTypes#number)[] } - 星期编号数组
- <ins>**returns**</ins> { [number](dataTypes#number) } - 星期位标志

将星期编号数组转换为位标志. 仅编号 `0` 至 `6` 参与计算.

---

## TimedTask

由定时任务创建和查询方法返回的 Java 对象. 常用属性包括:

- `id`, `millis`, `scriptPath`, `timeFlag`.
- `delay`, `interval`, `loopTimes`.
- `repeatMode`, `endMode`, `endValue`, `finishedTimes`.
- `dayOfMonth`, `monthOfYear`, `scheduled`.

常用方法包括 `getNextTime()`, `isDisposable()`, `isDaily()`, `isWeekly()`, `isMonthly()`, `isYearly()` 和 `isCountdown()`.

## IntentTask

由广播任务创建和查询方法返回的 Java 对象. 常用属性包括 `id`, `scriptPath`, `action`, `category`, `dataType` 和 `local`.
