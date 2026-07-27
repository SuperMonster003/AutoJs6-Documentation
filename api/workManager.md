# 计划任务兼容接口 (WorkManager)

workManager 模块用于创建, 查询和移除持久化计划任务.

`workManager`, `$workManager`, `work_manager` 与 `$work_manager` 指向同一个模块对象.

此模块是面向脚本的 Auto.js Pro 兼容接口, 不是 `androidx.work.WorkManager` 的 JavaScript 映射.

workManager 与 [tasks](tasks) 使用同一任务数据库, 但两者的返回约定不同:

- workManager 的创建操作始终同步返回任务对象.
- workManager 的移除操作返回数据库操作结果.
- tasks 的部分操作支持回调或异步执行, 移除操作返回被移除的任务对象.

---

<p style="font: bold 2em sans-serif; color: #FF7043">workManager</p>

---

## [m] addDailyTask

### addDailyTask(options)

**`6.8.0`**

- **options** { [DailyTaskOptions](#dailytaskoptions) } - 每日任务选项
- <ins>**returns**</ins> { [TimedTask](#timedtask) } - 已保存的定时任务

创建每天运行的定时任务.

```js
let task = workManager.addDailyTask({
    path: './daily.js',
    time: '08:30',
});
console.log(task.id);
```

## [m] addWeeklyTask

### addWeeklyTask(options)

**`6.8.0`**

- **options** { [WeeklyTaskOptions](#weeklytaskoptions) } - 每周任务选项
- <ins>**returns**</ins> { [TimedTask](#timedtask) } - 已保存的定时任务

创建每周运行的定时任务.

```js
let task = workManager.addWeeklyTask({
    path: './weekly.js',
    time: '09:00',
    daysOfWeek: [ 'Monday', 'Friday' ],
});
console.log(task.id);
```

## [m] addDisposableTask

### addDisposableTask(options)

**`6.8.0`**

- **options** { [DisposableTaskOptions](#disposabletaskoptions) } - 单次任务选项
- <ins>**returns**</ins> { [TimedTask](#timedtask) } - 已保存的定时任务

创建仅运行一次的定时任务.

可指定绝对时间, 也可指定从当前时刻开始计算的倒计时.

```js
let task = workManager.addDisposableTask({
    path: './later.js',
    after: {
        minutes: 10,
    },
});
console.log(task.id);
```

## [m] addIntentTask

### addIntentTask(options)

**`6.8.0`**

- **options** { [IntentTaskOptions](#intenttaskoptions) } - Intent 任务选项
- <ins>**returns**</ins> { [IntentTask](#intenttask) } - 已保存的 Intent 任务

创建由 Android Intent 触发的任务.

```js
let task = workManager.addIntentTask({
    path: './on-boot.js',
    action: 'android.intent.action.BOOT_COMPLETED',
});
console.log(task.id);
```

## [m] addBroadcastIntentTask

### addBroadcastIntentTask(options)

**`6.8.0`**

- **options** { [IntentTaskOptions](#intenttaskoptions) } - Intent 任务选项
- <ins>**returns**</ins> { [IntentTask](#intenttask) } - 已保存的 Intent 任务

创建广播 Intent 任务.

此方法与 [addIntentTask(options)](#m-addintenttask) 使用相同实现和选项.

## [m] getTimedTask

### getTimedTask(id)

**`6.8.0`**

- **id** { [number](dataTypes#number) } - 定时任务 ID
- <ins>**returns**</ins> { [TimedTask](#timedtask) | [null](dataTypes#null) } - 定时任务, 不存在时为 `null`

按 ID 查询定时任务.

## [m] getIntentTask

### getIntentTask(id)

**`6.8.0`**

- **id** { [number](dataTypes#number) } - Intent 任务 ID
- <ins>**returns**</ins> { [IntentTask](#intenttask) | [null](dataTypes#null) } - Intent 任务, 不存在时为 `null`

按 ID 查询 Intent 任务.

## [m] removeTimedTask

### removeTimedTask(id)

**`6.8.0`**

- **id** { [number](dataTypes#number) } - 定时任务 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 数据库移除结果, 任务不存在时为 `null`

按 ID 移除定时任务.

```js
let task = workManager.getTimedTask(10);
if (task !== null) {
    console.log(workManager.removeTimedTask(task.id));
}
```

## [m] removeIntentTask

### removeIntentTask(id)

**`6.8.0`**

- **id** { [number](dataTypes#number) } - Intent 任务 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) | [null](dataTypes#null) } - 数据库移除结果, 任务不存在时为 `null`

按 ID 移除 Intent 任务.

## [m] queryTimedTasks

### queryTimedTasks(options?)

**`6.8.0`** **`Overload [1-2]/2`**

- **[ options = `{}` ]** { [TimedTaskQueryOptions](#timedtaskqueryoptions) } - 查询选项
- <ins>**returns**</ins> { [TimedTask](#timedtask)[[]](dataTypes#array) } - 符合条件的定时任务

查询定时任务.

不指定 `path` 时返回全部定时任务.

```js
let tasksForFile = workManager.queryTimedTasks({
    path: './daily.js',
});
console.log(tasksForFile.length);
```

## [m] queryIntentTasks

### queryIntentTasks(options?)

**`6.8.0`** **`Overload [1-2]/2`**

- **[ options = `{}` ]** { [IntentTaskQueryOptions](#intenttaskqueryoptions) } - 查询选项
- <ins>**returns**</ins> { [IntentTask](#intenttask)[[]](dataTypes#array) } - 符合条件的 Intent 任务

查询 Intent 任务.

`path` 与 `action` 同时存在时, 两个条件必须同时匹配.

## 任务选项

workManager 会忽略创建选项中的 `callback`, `condition`, `isAsync` 和 `async`, 并同步返回任务对象.

所有脚本路径都通过当前脚本运行时的文件路径规则解析.

### TimedTaskExecutionOptions

定时任务共享以下执行选项:

- **path** { [string](dataTypes#string) } - 待执行脚本的路径
- **[ delay = `0` ]** { [number](dataTypes#number) } - 脚本执行前的延迟, 单位为毫秒
- **[ interval = `0` ]** { [number](dataTypes#number) } - 循环执行间隔, 单位为毫秒
- **[ loopTimes = `1` ]** { [number](dataTypes#number) } - 脚本循环执行次数

### RepeatEndOptions

每日和每周任务可使用以下重复结束选项:

- **[ endMode = `'forever'` ]** { [number](dataTypes#number) | [string](dataTypes#string) } - 结束模式
- **[ untilDate ]** { [number](dataTypes#number) | [Date](dataTypes#date) | [string](dataTypes#string) } - 截止日期
- **[ times ]** { [number](dataTypes#number) } - 总运行次数

`endMode` 也可写作 `ends`, `end` 或 `repeatEnd`.

结束模式字符串支持:

- 永久运行: `forever`, `always`, `never`.
- 截止日期: `untilDate`, `until`, `date`.
- 固定次数: `count`, `times`, `number`, `numberOfEvents`, `forNumberOfEvents`.

结束模式数值 `0`, `1` 和 `2` 分别表示永久运行, 截止日期和固定次数.

`untilDate` 也可写作 `until` 或 `endDate`.<br>
`times` 也可写作 `endCount`. 显式选择固定次数模式时还可写作 `count`.

### DailyTaskOptions

- **path** { [string](dataTypes#string) } - 待执行脚本的路径
- **[ time = 当前本地时间 ]** { [number](dataTypes#number) | [Date](dataTypes#date) | [string](dataTypes#string) } - 每日运行时间
- **[ delay = `0` ]** { [number](dataTypes#number) } - 脚本执行前的延迟, 单位为毫秒
- **[ interval = `0` ]** { [number](dataTypes#number) } - 循环执行间隔, 单位为毫秒
- **[ loopTimes = `1` ]** { [number](dataTypes#number) } - 脚本循环执行次数
- **[ endMode = `'forever'` ]** { [number](dataTypes#number) | [string](dataTypes#string) } - 重复结束模式
- **[ untilDate ]** { [number](dataTypes#number) | [Date](dataTypes#date) | [string](dataTypes#string) } - 截止日期
- **[ times ]** { [number](dataTypes#number) } - 总运行次数

`date` 可作为 `time` 的别名.

时间字符串由 `org.joda.time.LocalTime.parse` 解析, 例如 `'08:30'`.

### WeeklyTaskOptions

- **path** { [string](dataTypes#string) } - 待执行脚本的路径
- **[ time = 当前本地时间 ]** { [number](dataTypes#number) | [Date](dataTypes#date) | [string](dataTypes#string) } - 每周运行时间
- **[ daysOfWeek = 当前本地星期 ]** { [number](dataTypes#number)[[]](dataTypes#array) | [string](dataTypes#string)[[]](dataTypes#array) } - 每周运行日
- **[ delay = `0` ]** { [number](dataTypes#number) } - 脚本执行前的延迟, 单位为毫秒
- **[ interval = `0` ]** { [number](dataTypes#number) } - 循环执行间隔, 单位为毫秒
- **[ loopTimes = `1` ]** { [number](dataTypes#number) } - 脚本循环执行次数
- **[ endMode = `'forever'` ]** { [number](dataTypes#number) | [string](dataTypes#string) } - 重复结束模式
- **[ untilDate ]** { [number](dataTypes#number) | [Date](dataTypes#date) | [string](dataTypes#string) } - 截止日期
- **[ times ]** { [number](dataTypes#number) } - 总运行次数

`date` 可作为 `time` 的别名.

星期字符串支持完整英文名称, 3 字母英文缩写, 以及中文数字名称.<br>
星期数值支持 `0..6` 和 `1..7`, 其中 `0` 或 `7` 表示星期日.

### DisposableTaskOptions

- **path** { [string](dataTypes#string) } - 待执行脚本的路径
- **[ time = 当前本地日期和时间 ]** { [number](dataTypes#number) | [Date](dataTypes#date) | [string](dataTypes#string) } - 绝对运行时间
- **[ after ]** { [number](dataTypes#number) | [DurationOptions](#durationoptions) } - 从当前时刻开始计算的延迟
- **[ delay = `0` ]** { [number](dataTypes#number) } - 脚本执行前的延迟, 单位为毫秒
- **[ interval = `0` ]** { [number](dataTypes#number) } - 循环执行间隔, 单位为毫秒
- **[ loopTimes = `1` ]** { [number](dataTypes#number) } - 脚本循环执行次数

`date` 可作为 `time` 的别名.

`after` 也可写作 `countdown`, `timeOffset`, `duration` 或 `runAfter`.<br>
延迟为数值时, 单位为毫秒. 延迟必须大于 `0`.

当绝对时间和延迟同时存在时, 延迟优先.

### DurationOptions

- **[ days = `0` ]** { [number](dataTypes#number) } - 天数
- **[ hours = `0` ]** { [number](dataTypes#number) } - 小时数
- **[ minutes = `0` ]** { [number](dataTypes#number) } - 分钟数
- **[ seconds = `0` ]** { [number](dataTypes#number) } - 秒数
- **[ milliseconds = `0` ]** { [number](dataTypes#number) } - 毫秒数

各字段必须为非负整数, 总时长必须大于 `0`.

字段还支持以下短名称:

- `days`: `day`, `d`, `delayDays`.
- `hours`: `hour`, `hr`, `h`, `delayHours`.
- `minutes`: `minute`, `min`, `m`, `delayMinutes`.
- `seconds`: `second`, `sec`, `s`, `delaySeconds`.
- `milliseconds`: `millisecond`, `millis`, `ms`, `delayMillis`.

### IntentTaskOptions

- **path** { [string](dataTypes#string) } - 待执行脚本的路径
- **[ action ]** { [string](dataTypes#string) } - Intent action
- **[ category ]** { [string](dataTypes#string) } - Intent category
- **[ dataType ]** { [string](dataTypes#string) } - Intent MIME 类型
- **[ isLocal = `false` ]** { [boolean](dataTypes#boolean) } - 是否使用本地广播

`local` 可作为 `isLocal` 的别名.

AutoJs6 启动事件对应的 action 会默认使用本地广播. 显式设置 `isLocal` 或 `local` 时, 显式值优先.

### TimedTaskQueryOptions

- **[ path ]** { [string](dataTypes#string) } - 脚本路径过滤条件

### IntentTaskQueryOptions

- **[ path ]** { [string](dataTypes#string) } - 脚本路径过滤条件
- **[ action ]** { [string](dataTypes#string) } - Intent action 过滤条件

## 返回对象

### TimedTask

workManager 的定时任务对象由 [tasks](tasks) 模块共用的 `org.autojs.autojs.timing.TimedTask` 提供.

常用公开属性包括 `id`, `scriptPath`, `millis`, `repeatMode`, `timeFlag`, `scheduled`, `endMode` 和 `endValue`.

### IntentTask

workManager 的 Intent 任务对象由 [tasks](tasks) 模块共用的 `org.autojs.autojs.timing.IntentTask` 提供.

常用公开属性包括 `id`, `scriptPath`, `action`, `category`, `dataType` 和 `local`.

## timers 兼容入口

以下方法也可通过 [timers](timers) 模块调用, 其参数和返回值与 workManager 对应方法相同:

- `timers.addDailyTask`
- `timers.addWeeklyTask`
- `timers.addDisposableTask`
- `timers.addIntentTask`
- `timers.getTimedTask`
- `timers.getIntentTask`
- `timers.removeTimedTask`
- `timers.removeIntentTask`
- `timers.queryTimedTasks`
- `timers.queryIntentTasks`
