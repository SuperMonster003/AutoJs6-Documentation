# 流程 (Flow)

<!-- runtime-support:begin flow -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `flow`, 全局 16 项 | `autojs6:flow`, `autojs6:system`, `$autojs.flow` | `autojs6:flow`, `autojs6:system`, `$autojs.flow` | `host.flow`, `host.global` |
| 状态 | 已支持 71 项 | 已支持 71 项 | 已支持 71 项 | 已支持 (本地实现) 1 项, 需授权 70 项 |
| 授权 | - | - | - | `flow.control` 70 项 |

差异项 (1 项): 下表列出入口, 状态或授权与同列多数 API 不同的 API, 未列出的 API 与同列多数一致.

| API | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- |
| `wait.async` | <span title="bridged">已支持</span>, 经 system: `wait.async` (`autojs6:system`) | <span title="bridged">已支持</span>, 经 system: `wait.async` (`autojs6:system`) | <span title="local-shim">已支持 (本地实现)</span>, 经 global: `host.global.wait.async` |

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

> Node.js/Bun/Worker 的异步链, 高级工具与事件等待参阅 [运行时 API](runtimeApis#flow-异步链与等待核心). 本页的同步终结方法, 工作线程与 Java 节点行为属于 Rhino.

Flow 是 AutoJs6 6.8.0 引入的异步等待与动作链.

一个 Flow 对象代表 "等待某个条件, 然后依次执行若干动作与回调" 的一条流水线.<br>
流水线上的步骤在脚本之外的工作线程上按顺序执行, 不阻塞脚本线程, 也不受 UI 模式限制.

[wait](global#m-wait), [findOne](uiSelectorType#m-findone) 等同步方法会阻塞当前线程直到条件满足或超时, 而 Flow 形式立即返回一个 [Flow](flowType) 对象, 之后可以继续追加等待, 动作与回调, 也可以在需要时用 [sync](flowType#m-sync) 转回同步.

```js
/* 同步等待. */
let w = text('登录').findOne(5e3);
if (w) {
    w.click();
}

/* Flow 等待: 不阻塞, 找到后点击. */
waitAsync('登录', 5e3).click();

/* 链式写法, 附带回调. */
flow.wait('登录', 5e3)
    .click()
    .then(() => console.log('已点击'))
    .catch(e => console.warn(e.message));
```

Flow 的核心是 "条件". 与 [wait](global#m-wait) 一致, 条件可以是 [PickupSelector](dataTypes#pickupselector) (字符串, 正则表达式, 选择器, 对象选择器或它们的数组), 也可以是函数, 还可以是另一个 Flow 或 Promise.<br>
选择器条件满足时, 链上的值为匹配到的 [控件节点](uiObjectType); 函数条件满足时, 链上的值为函数的返回值.

> 注: 本章节的所有 API 均为 6.8.0 新增, 依赖无障碍服务的部分与 [选择器](uiSelectorType) 相同.

---

<p style="font: bold 2em sans-serif; color: #FF7043">flow</p>

---

## [@] flow

**`6.8.0`** **`Global`**

`flow` 是 Flow API 的命名空间对象, 同时也是一个可调用对象, `flow(cond, ...)` 与 [flow.wait](#m-wait) 相同.<br>
`$flow` 是 `flow` 的别名.

```js
flow('登录').click(); /* 同 flow.wait('登录').click(). */
$flow.wait('登录').click(); /* 同上. */
```

部分起点函数同时是全局函数, 可省略 `flow.` 前缀直接调用:

| 全局函数 | 别名 | 等价形式 |
| --- | --- | --- |
| waitAsync | wait.async | flow.wait |
| waitThenClick | clickWait | flow.waitThenClick |
| waitThenClickBounds | clickBoundsWait | flow.waitThenClickBounds |
| waitForStable | - | flow.waitForStable |
| waitForStableThenClick | clickWhenStable | flow.waitForStableThenClick |
| waitForStableThenClickBounds | clickBoundsWhenStable | flow.waitForStableThenClickBounds |
| waitForVisible | - | flow.waitForVisible |
| waitForHidden | waitForGone | flow.waitForHidden |
| clickWhenStableAfter | - | flow.clickWhenStableAfter |
| clickBoundsWhenStableAfter | - | flow.clickBoundsWhenStableAfter |

[工具集](automator#工具集-toolkit) 与 [事件驱动等待](automator#事件驱动等待) 的同步函数 (如 `smartClick`, `waitForIdle`) 也是全局函数, 它们的 Flow 起点形式为 `flow.smartClick`, `flow.waitForIdle` 等, 见 [工具集起点](#工具集起点) 与 [事件等待起点](#事件等待起点).

## 与同步 API 的对应关系

| 同步形式 | Flow 形式 | 说明 |
| --- | --- | --- |
| [wait(cond, ...)](global#m-wait) | [flow.wait(cond, ...)](#m-wait) / waitAsync | 条件与超时参数同源 |
| [sel.findOne(timeout)](uiSelectorType#m-findone) | flow.wait(sel, timeout) | 找到的节点为链上的值 |
| [sel.untilFindOne()](uiSelectorType#m-untilfindone) | flow.wait(sel, Infinity) | 不限时等待 |
| [waitForActivity(name, ...)](global#m-waitforactivity) | [flow.waitForActivity(name, ...)](#m-waitforactivity) | - |
| [waitForPackage(name, ...)](global#m-waitforpackage) | [flow.waitForPackage(name, ...)](#m-waitforpackage) | - |
| [sleep(millis)](global#m-sleep) | [flow.sleep(millis)](#m-sleep) / [Flow#sleep](flowType#m-sleep) | 参数形式相同 |
| [w.click()](uiObjectActionsType#m-click) 等控件行为 | [Flow#click()](flowType#节点动作步骤) 等 | 作用于链上的值 |
| [back()](automator#back) 等全局行为 | [Flow#back()](flowType#全局动作步骤) 等 | 透传链上的值 |
| [smartClick(target, options)](automator#smartclick) 等工具集 | [flow.smartClick(target, options)](#工具集起点) / [Flow#smartClick(options)](flowType#工具集步骤) | 链式形式以链上的值为目标 |
| [waitForIdle(options)](automator#waitforidle) 等事件等待 | [flow.waitForIdle(options)](#事件等待起点) / [Flow#waitForIdle(options)](flowType#事件等待步骤) | - |

## 条件 (cond)

Flow 等待函数的首个参数 `cond` 支持以下形式:

- [PickupSelector](dataTypes#pickupselector) - 选择器条件. 字符串 `'abc'` 相当于 `content('abc')`, 正则表达式 `/abc/` 相当于 `contentMatch(/abc/)`, 数字 `1` 相当于 `content('1')`; 也可以是选择器实例, 对象选择器或它们的数组 (混合型选择器). 条件满足时链上的值为匹配到的 [UiObject](uiObjectType) (可用 `resultType` 选项改变).
- [Function](dataTypes#function) - 函数条件. 函数在 Flow 工作线程上反复调用, 返回值 "存在" 时条件满足, 链上的值为该返回值.
- [Flow](flowType) | [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) - 结算条件. 等待该 Flow 或 Promise 结算, 其结果为链上的值.
- [UiObject](uiObjectType) - 节点条件. 反复刷新该节点, 刷新成功 (节点仍存在) 时条件满足.

"存在" 的判定规则与 [wait](global#m-wait) 一致: `null`, `undefined`, `false`, `NaN`, 空字符串, 空数组及空 [控件集合](uiObjectCollectionType) 视为不存在, 其余值视为存在.

```js
flow.wait('登录'); /* 内容选择器. */
flow.wait(/登.录/); /* 正则内容选择器. */
flow.wait(text('登录').clickable()); /* 经典选择器. */
flow.wait({ text: '登录', clickable: true }); /* 对象选择器. */
flow.wait(() => device.isScreenOn()); /* 函数条件. */
flow.wait(new Promise(resolve => setTimeout(() => resolve('done'), 500))); /* Promise 条件. */
```

> 注: 函数条件与 [回调](flowType#m-then) 不同, 它运行在 Flow 工作线程而非脚本线程. 函数中不要操作 UI 组件, 也不要调用 [sync](flowType#m-sync).

## 等待选项 (WaitOptions)

所有等待函数都接受两种参数形式:

- 位置参数形式: `(cond, timeout?, interval?, onOk?, onErr?)`
- 选项对象形式: `(cond, options, onOk?, onErr?)`

其中 `onOk` 与 `onErr` 是可选的尾随回调函数, 相当于在等待之后追加 [then(onOk, onErr)](flowType#m-then).<br>
带 `After` 后缀的函数 (如 [clickWhenStableAfter](#m-clickwhenstableafter)) 的位置参数形式再多接受两个数字作为动作前的延时: `(cond, timeout?, interval?, delayMin?, delayMax?, onOk?, onErr?)`.

选项对象 `options` 的键:

- **[ timeout = `10000` ]** { [number](dataTypes#number) } - 超时 (毫秒). 默认值取自 [flow.defaults](#m-defaults). `Infinity` 表示不限时, `0` 表示只检测一次
- **[ interval = `200` ]** { [number](dataTypes#number) } - 检测间隔 (毫秒). 默认值取自 [flow.defaults](#m-defaults)
- **[ times ]** { [number](dataTypes#number) } - 最多检测次数. 默认不限, `Infinity` 表示不限
- **[ root ]** { [UiObject](uiObjectType) } - 选择器条件的查找根节点. 默认为活动窗口 (或 [scope](flowType#m-scope) 设置的根节点)
- **[ compass ]** { [string](dataTypes#string) } - 找到节点后应用的 [罗盘](uiObjectType#m-compass) 参数
- **[ resultType ]** { [string](dataTypes#string) \| [string](dataTypes#string)[] } - 选择器条件的 [结果类型](dataTypes#pickupresult), 与 [pickup](uiSelectorType#m-pickup) 的结果参数相同
- **[ stableFor = `0` ]** { [number](dataTypes#number) } - 稳定检测时长 (毫秒), 仅稳定类等待使用. 默认值取自 [flow.defaults](#m-defaults); `0` 表示首次符合条件即完成, 连续观察时须显式指定正数
- **[ compare = `'fingerprint'` ]** { `'fingerprint'` \| `'bounds'` \| `'content'` \| [(prev, next) => boolean](dataTypes#function) } - 稳定检测的比较方式: 节点指纹, 边界矩形, 文本与描述, 或自定义比较函数
- **[ snapshot ]** { [(value: any) => any](dataTypes#function) } - 稳定检测的数据投影, 在工作线程上执行. 返回基本值, 数组或普通对象, 每次采样立即按结构复制后比较; 与 `compare` 互斥, 循环引用或不支持的值会拒绝流程. 完成时仍返回原始匹配结果
- **[ missing = `'reset'` ]** { `'reset'` \| `'fail'` } - 稳定检测期间目标消失时的处理: 重新计时, 或以 `TIMEOUT` 拒绝
- **[ strict ]** { [boolean](dataTypes#boolean) } - 随后的动作步骤返回 `false` 时是否以 `ACTION_FAILED` 拒绝. 默认值取自 [flow.defaults](#m-defaults) 的 `strictActions`
- **[ recoverService = `false` ]** { [boolean](dataTypes#boolean) } - 无障碍服务在等待期间断开时是否继续等待服务恢复, 而非立即以 `A11Y_UNAVAILABLE` 拒绝. 默认值取自 [flow.defaults](#m-defaults)
- **[ delay ]** { [number](dataTypes#number) \| [number](dataTypes#number)[] \| [string](dataTypes#string) } - 带 `After` 后缀的函数的动作前延时, 形式同 [sleep](global#m-sleep) 的参数: 毫秒数, `[min, max]` 范围, 或 `'±delta'` 增量字符串 (与 `min` 数字组合使用时写作 `[min, '±delta']`)

```js
flow.wait('登录', 5e3); /* 5 秒超时. */
flow.wait('登录', 5e3, 100); /* 5 秒超时, 100 毫秒间隔. */
flow.wait('登录', { timeout: 5e3, interval: 100 }); /* 同上. */
flow.wait('登录', Infinity); /* 不限时. */
flow.wait('登录', 0); /* 只检测一次. */
flow.wait('登录', { times: 3 }); /* 最多检测 3 次. */
flow.wait('登录', { root: id('container').findOnce() }); /* 限定查找范围. */
flow.wait('登录', { compass: 'p2' }); /* 结果为匹配节点的二级父控件. */
flow.wait('登录', { resultType: 'txt' }); /* 结果为匹配节点的文本. */
```

未知的选项键, 负数, `NaN` 以及超过数量的数字参数都会在调用时抛出异常:

```js
flow.wait('登录', { timeuot: 5e3 }); /* 抛出异常: Unknown option "timeuot" ... */
flow.wait('登录', 5e3, 100, 50); /* 抛出异常: Too many numeric arguments (3) for wait. */
```

## [m] wait

### wait(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y?`**

- **cond** { [Cond](#条件-cond) } - 等待条件
- **[ timeout = `10000` ]** { [number](dataTypes#number) } - 超时 (毫秒), `Infinity` 表示不限时
- **[ interval = `200` ]** { [number](dataTypes#number) } - 检测间隔 (毫秒)
- **[ onOk ]** { [(value: any) => any](dataTypes#function) } - 条件满足时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 新建的 Flow 对象

创建一个等待 `cond` 的 Flow, 立即返回, 不阻塞当前线程.

条件满足时 Flow 以匹配结果 (选择器条件为 [UiObject](uiObjectType), 函数条件为返回值) fulfill; 超时则以 [FlowError](flowErrorType) (`code` 为 `TIMEOUT`) 拒绝.

```js
flow.wait('登录', 5e3).then(w => {
    console.log(w.bounds());
}, e => {
    console.warn(e.message); /* 如 Timed out after 5003 ms and 25 attempt(s) in step "wait" waiting for content("登录"). */
});

/* 尾随回调等价于 then(onOk, onErr). */
flow.wait('登录', 5e3, w => console.log(w.bounds()), e => console.warn(e.message));
```

全局函数 `waitAsync` 及 `wait.async` 与本方法相同, 见本节的别名条目.

### wait(cond, options, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y?`**

- **cond** { [Cond](#条件-cond) } - 等待条件
- **options** { [WaitOptions](#等待选项-waitoptions) } - 等待选项
- **[ onOk ]** { [(value: any) => any](dataTypes#function) } - 条件满足时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) }

以选项对象形式创建等待.

```js
flow.wait('登录', { timeout: 5e3, root: id('login_panel').findOnce() }).click();
```

### waitAsync(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y?`**

### waitAsync(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

[flow.wait](#m-wait) 的别名, 参数, 返回值与行为相同. 可作为全局函数调用, 也可写作 `flow.waitAsync`.

```js
waitAsync('登录', 5e3).click();
flow.waitAsync('登录', { timeout: 5e3 }).click(); /* 同上. */
```

### wait.async(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y?`**

### wait.async(cond, options, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

挂在同步全局函数 [wait](global#m-wait) 上的 [flow.wait](#m-wait) (只读, 不可枚举), 参数, 返回值与行为相同. 便于把已有的 `wait(...)` 调用改为不阻塞的形式.

```js
wait.async('登录', 5e3).click(); /* 同 waitAsync('登录', 5e3).click(). */
wait.async(() => device.isScreenOn(), { timeout: 30e3 }).then(() => console.log('屏幕已点亮'));
```

## [m] waitUntil

### waitUntil(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y?`**

### waitUntil(cond, options, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

与 [flow.wait](#m-wait) 完全相同, 用于函数条件时语义更清晰.

```js
flow.waitUntil(() => device.isScreenOn(), 30e3).then(() => console.log('屏幕已点亮'));
```

## [m] waitWhile

### waitWhile(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y?`**

### waitWhile(cond, options, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待条件 **不再** 满足. 条件从满足变为不满足 (或一开始就不满足) 时以 `true` fulfill, 超时则以 `TIMEOUT` 拒绝.

```js
/* 等待 "加载中" 消失后继续. */
flow.waitWhile('加载中', 30e3).then(() => console.log('加载完成'));
```

## [m] waitForStable

### waitForStable(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y?`**

### waitForStable(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标出现并保持稳定: 目标连续 `stableFor` 毫秒 (默认 0) 无变化时以目标 fulfill. 默认值表示首次匹配即完成, 需要连续观察时显式设置正数.

"无变化" 的判定由 `compare` 选项决定 (默认比较节点指纹, 即文本, 描述, 边界与主要状态), 期间目标消失时按 `missing` 选项重新计时 (默认) 或直接失败.<br>
超时约束整个等待过程 (包括稳定检测).

选择器使用 `resultType: '[]'` 时, 内置比较方式会在每次采样时按顺序提取全部节点的比较键, 节点状态, 数量或顺序变化都会重新计时. 指纹只包含节点自身状态, 不递归读取子节点或兄弟节点.<br>
需要观察同一行的其他字段时使用 `snapshot`, 避免把活动节点对象当作历史快照. 快照稳定只表示采样内容在指定时间内无变化, 页面是否加载完整仍需结合应用状态判断.

```js
waitForStable('去挂号', {
    resultType: '[]',
    stableFor: 500,
    timeout: 8e3,
    snapshot: nodes => nodes.map(w => [
        w.content(),
        detect(w, 's<2', 'content'), /* 余号字段, 位置以实际布局为准. */
        detect(w, 's<1', 'content'), /* 费用字段. */
    ]),
}).then(nodes => console.log(nodes.length));
```

适用于列表刷新, 动画过渡等 "出现了但还在变" 的场景.

```js
/* 等待列表停止滚动后再读取. */
flow.waitForStable(className('RecyclerView'), { timeout: 10e3, stableFor: 800, compare: 'bounds' })
    .then(list => console.log(list.childCount()));

/* 全局函数形式. */
waitForStable('确定').click();
```

## [m] whenPresent

### whenPresent(cond, handler, options?)

**`6.8.0`** **`A11Y?`**

- **cond** { [Cond](#条件-cond) } - 可选目标的检测条件
- **handler** { [(match: any) => any](dataTypes#function) } - 目标出现时的处理函数
- **[ options ]** { [Object](dataTypes#object) } - 支持等待选项中的 `timeout`, `interval`, `times`, `root`, `compass`, `resultType`, `recoverService`, 默认值与 [wait](#m-wait) 相同
- <ins>**returns**</ins> { [Flow](flowType) } - 起点形式完成时值为 `null`

在检测期内未出现目标时跳过处理函数. 出现目标时以匹配结果调用 `handler`, 等待其返回的 Flow 或 Promise 完成; 普通返回值不改变链上的值. [链式形式](flowType#m-whenpresent) 始终透传进入本步骤时的值.

只跳过检测期结束时仍未匹配的情况. 条件函数抛出的异常, 无障碍服务异常, 处理函数及其子流程的失败, 取消和链截止均继续传播. `options.timeout` 只约束检测阶段, 处理阶段可用链的 [timeout](flowType#m-timeout) 或子流程自己的超时约束.

处理函数同 [run](flowType#m-run) 在工作线程上执行, 应返回新建的子流程, 不操作 UI 组件, 不调用 `sync()`. 子流程继承查找作用域和链截止; 取消本步骤时一并取消其尚未完成的子流程.

```js
flow.wait('首页')
    .clickIfExists('稍后再看', { timeout: 400 })
    .whenPresent(/阅读并同意/, () =>
        flow.toggle(className('CheckBox'), true, { timeout: 800 })
            .waitThenClick('确定', 2e3),
    { timeout: 800 })
    .wait('下一页');
```

## [m] repeatUntil

### repeatUntil(action, cond, options?)

**`6.8.0`** **`A11Y?`**

- **action** { [(attempt: number) => any](dataTypes#function) } - 每轮动作的工厂函数, `attempt` 从 `1` 开始
- **cond** { [Cond](#条件-cond) } - 完成条件
- **[ options ]** {{
    - timeout?: [number](dataTypes#number);
    - maxAttempts?: [number](dataTypes#number);
    - interval?: [number](dataTypes#number);
    - retryOn?: [(error: any, attempt: number) => boolean](dataTypes#function);
    - root?: [UiObject](uiObjectType);
    - compass?: [string](dataTypes#string);
    - resultType?: [string](dataTypes#string) \| [string](dataTypes#string)[];
- }} - 循环选项
- <ins>**returns**</ins> { [Flow](flowType) } - 完成时以 `cond` 的匹配结果为值

首次动作前检查条件, 已满足时不执行动作. 否则执行 `action(attempt)`, 等待其返回的 Flow 或 Promise 完成, 再检查条件. 后续动作前按 `interval` 暂停并再次检查条件. 工厂函数每轮重新调用, 应返回本轮新建的子流程.

- `timeout`: 总时限, 默认取 `flow.defaults().timeout`, 必须为有限非负数. `0` 只检查一次, 不执行动作. 总时限包括轮间延时和等待返回的子流程; 与外层链截止取更早者.
- `maxAttempts`: 动作执行次数上限, 包含首次执行, 必须为非负整数. 默认 `0`, 表示不限制尝试次数, 仍受总 `timeout`, 外层链截止和取消控制; 正整数表示最多执行指定次数.
- `interval`: 轮间延时, 默认取 `flow.defaults().interval`.
- `retryOn`: 动作失败时的同步判断函数, 须返回 boolean. 默认直接传播错误; 返回 `true` 才继续下一轮. 条件检测错误与取消不重试.
- `root`, `compass`, `resultType`: 用于完成条件的选择器查找, 同等待选项.

达到正整数次数上限以 `TIMEOUT` 拒绝, `reason` 为 `'attempts'`; 总时限结束为 `'timeout'`, 外层链截止为 `'chain'`. 超时或取消时会取消仍在执行的子流程, 不再启动下一轮.

`action`, `retryOn` 与条件函数在工作线程执行. `action` 应迅速构造并返回子流程, 不应执行长时间同步工作或调用 `sync()`. 时限可以结束对子流程或 Promise 的等待, 无法抢占一个不返回的用户同步函数; 普通 Promise 自身的外部副作用也不能由 Flow 撤销.

```js
flow.repeatUntil(
    () => flow.smartClick('刷新', { timeout: 2e3 })
        .waitForGone('加载中', { timeout: 5e3, stableFor: 300 }),
    '结果列表',
    { timeout: 30e3, maxAttempts: 5, interval: 300 },
).then(list => console.log(list.content()));
```

## [m] waitForVisible

### waitForVisible(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y?`**

### waitForVisible(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标出现, 对用户可见 ([visibleToUser](uiObjectType#m-visibletouser)) 且保持稳定 `stableFor` 毫秒.

```js
waitForVisible('继续', 8e3).click();
```

## [m] waitForHidden

### waitForHidden(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y?`**

### waitForHidden(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标消失: 目标连续 `stableFor` 毫秒不存在或不可见时 fulfill.

`waitForGone` 是本方法的别名.

```js
/* 等待进度条消失后截图. */
flow.waitForHidden(className('ProgressBar'), 30e3).then(() => images.captureScreen('/sdcard/done.png'));
```

### waitForGone(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y?`**

### waitForGone(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

[waitForHidden](#m-waitforhidden) 的别名, 参数, 返回值与行为相同. 可作为全局函数调用, 也可写作 `flow.waitForGone`.

```js
waitForGone('加载中', 30e3).then(() => console.log('加载完成'));
flow.waitForGone('加载中', { timeout: 30e3, stableFor: 500 }); /* 消失并保持 500 毫秒. */
```

## [m] waitForActivity

### waitForActivity(activityName, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

### waitForActivity(activityName, options, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **activityName** { [string](dataTypes#string) } - 目标活动名称
- <ins>**returns**</ins> { [Flow](flowType) }

等待 [currentActivity()](global#m-currentactivity) 变为 `activityName`, 满足时以 `true` fulfill.

同步形式见 [waitForActivity](global#m-waitforactivity).

```js
app.launchApp('Settings');
flow.waitForActivity('com.android.settings.Settings', 5e3).then(() => console.log('设置页已打开'));
```

## [m] waitForPackage

### waitForPackage(packageName, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

### waitForPackage(packageName, options, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **packageName** { [string](dataTypes#string) } - 目标包名
- <ins>**returns**</ins> { [Flow](flowType) }

等待 [currentPackage()](global#m-currentpackage) 变为 `packageName`, 满足时以 `true` fulfill.

同步形式见 [waitForPackage](global#m-waitforpackage).

```js
app.launchPackage('com.android.settings');
flow.waitForPackage('com.android.settings', 5e3).then(() => console.log('设置已在前台'));
```

## [m] waitThenClick

### waitThenClick(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### waitThenClick(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标出现后点击, 相当于 `flow.wait(cond, ...).click()`.

`clickWait` 是本方法的别名.

```js
waitThenClick('登录', 5e3);
clickWait('登录', 5e3); /* 同上. */
flow.wait('登录', 5e3).click(); /* 同上. */
```

### clickWait(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### clickWait(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

[waitThenClick](#m-waitthenclick) 的别名, 参数, 返回值与行为相同. 可作为全局函数调用, 也可写作 `flow.clickWait`.

```js
clickWait('同意', 3e3).then(() => console.log('已同意'), e => console.warn(e.code));
flow.clickWait('同意', { timeout: 3e3, interval: 100 });
```

## [m] waitThenClickBounds

### waitThenClickBounds(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### waitThenClickBounds(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标出现后在控件中心坐标点按, 相当于 `flow.wait(cond, ...).clickBounds()`.

`clickBoundsWait` 是本方法的别名.

```js
waitThenClickBounds('登录', 5e3);
clickBoundsWait('登录', 5e3); /* 同上. */
flow.wait('登录', 5e3).clickBounds(); /* 同上. */
```

直接使用控件边界中心执行手势, 不调用控件自身的 `click()` 方法. 等待参数与 [flow.wait](flow#m-wait) 相同, 稳定性参数见 [flow.waitForStable](flow#m-waitforstable). 需要坐标偏移时可使用 `waitAsync(cond, ...).clickBounds(offsetX, offsetY)`.

### clickBoundsWait(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### clickBoundsWait(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

[waitThenClickBounds](#m-waitthenclickbounds) 的别名, 参数, 返回值与行为相同. 可作为全局函数调用, 也可写作 `flow.clickBoundsWait`.

```js
clickBoundsWait('开始', 5e3).then(() => console.log('已点按'));
flow.clickBoundsWait(desc('播放'), { timeout: 5e3 });
```

## [m] waitThenLongClick

### waitThenLongClick(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

### waitThenLongClick(cond, options, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标出现后长按, 相当于 `flow.wait(cond, ...).longClick()`.

## [m] waitForStableThenClick

### waitForStableThenClick(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### waitForStableThenClick(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标稳定后点击, 相当于 `flow.waitForStable(cond, ...).click()`.

`clickWhenStable` 是本方法的别名.

```js
clickWhenStable('下一步', { timeout: 8e3, stableFor: 300 });
```

### clickWhenStable(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### clickWhenStable(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

[waitForStableThenClick](#m-waitforstablethenclick) 的别名, 参数, 返回值与行为相同. 可作为全局函数调用, 也可写作 `flow.clickWhenStable`.

```js
clickWhenStable('确定', 5e3).then(() => console.log('已点击'));
flow.clickWhenStable('确定', { timeout: 5e3, stableFor: 300, compare: 'bounds' });
```

## [m] waitForStableThenClickBounds

### waitForStableThenClickBounds(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### waitForStableThenClickBounds(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

等待目标稳定后在控件中心坐标点按, 相当于 `flow.waitForStable(cond, ...).clickBounds()`.

`clickBoundsWhenStable` 是本方法的别名.

```js
clickBoundsWhenStable('下一步', { timeout: 8e3, stableFor: 300 });
```

直接使用控件边界中心执行手势, 不调用控件自身的 `click()` 方法. 等待参数与 [flow.wait](flow#m-wait) 相同, 稳定性参数见 [flow.waitForStable](flow#m-waitforstable). 需要坐标偏移时可使用 `waitAsync(cond, ...).clickBounds(offsetX, offsetY)`.

### clickBoundsWhenStable(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### clickBoundsWhenStable(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- <ins>**returns**</ins> { [Flow](flowType) }

[waitForStableThenClickBounds](#m-waitforstablethenclickbounds) 的别名, 参数, 返回值与行为相同. 可作为全局函数调用, 也可写作 `flow.clickBoundsWhenStable`.

```js
clickBoundsWhenStable('开始', 5e3).then(() => console.log('已点按'));
flow.clickBoundsWhenStable(id('start'), { timeout: 5e3, stableFor: 300 });
```

## [m] clickWhenStableAfter

### clickWhenStableAfter(cond, timeout, interval, delayMin, delayMax?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### clickWhenStableAfter(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- **delayMin** { [number](dataTypes#number) } - 点击前延时下限 (毫秒)
- **[ delayMax ]** { [number](dataTypes#number) } - 点击前延时上限 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) }

等待目标稳定, 再随机延时 `delayMin` 至 `delayMax` 毫秒 (只给 `delayMin` 时为固定延时), 然后点击.<br>
相当于 `flow.waitForStable(cond, ...).sleep(delayMin, delayMax).click()`.

选项对象形式以 `delay` 键给出延时, 缺少延时时抛出异常.

```js
clickWhenStableAfter('同意', 5e3, 200, 300, 800); /* 5 秒超时, 200 毫秒间隔, 延时 300 ~ 800 毫秒. */
clickWhenStableAfter('同意', { timeout: 5e3, delay: [ 300, 800 ] }); /* 同上. */
clickWhenStableAfter('同意', { delay: 500 }); /* 固定延时 500 毫秒. */
```

## [m] clickBoundsWhenStableAfter

### clickBoundsWhenStableAfter(cond, timeout, interval, delayMin, delayMax?, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`**

### clickBoundsWhenStableAfter(cond, options, onOk?, onErr?)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`**

- **delayMin** { [number](dataTypes#number) } - 点击前延时下限 (毫秒)
- **[ delayMax ]** { [number](dataTypes#number) } - 点击前延时上限 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) }

等待目标稳定, 再随机延时 `delayMin` 至 `delayMax` 毫秒 (只给 `delayMin` 时为固定延时), 然后在控件中心坐标点按.<br>
相当于 `flow.waitForStable(cond, ...).sleep(delayMin, delayMax).clickBounds()`.

选项对象形式以 `delay` 键给出延时, 缺少延时时抛出异常.

```js
clickBoundsWhenStableAfter('同意', 5e3, 200, 300, 800); /* 5 秒超时, 200 毫秒间隔, 延时 300 ~ 800 毫秒. */
clickBoundsWhenStableAfter('同意', { timeout: 5e3, delay: [ 300, 800 ] }); /* 同上. */
clickBoundsWhenStableAfter('同意', { delay: 500 }); /* 固定延时 500 毫秒. */
```

直接使用控件边界中心执行手势, 不调用控件自身的 `click()` 方法. 等待参数与 [flow.wait](flow#m-wait) 相同, 稳定性参数见 [flow.waitForStable](flow#m-waitforstable). 需要坐标偏移时可使用 `waitAsync(cond, ...).clickBounds(offsetX, offsetY)`.

## [m] sleep

### sleep(millis)

**`6.8.0`** **`Overload 1/2`**

- **millis** { [number](dataTypes#number) } - 休眠时长 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) }

### sleep(millisMin, millisMax)

**`6.8.0`** **`Overload 2/2`**

- **millisMin** { [number](dataTypes#number) } - 休眠时长下限 (毫秒)
- **millisMax** { [number](dataTypes#number) \| [string](dataTypes#string) } - 休眠时长上限 (毫秒) 或 `'±delta'` 增量字符串
- <ins>**returns**</ins> { [Flow](flowType) }

以一次休眠起链, 参数形式同全局 [sleep](global#m-sleep). 休眠结束后 Flow 以 `undefined` fulfill.

`delay` 是本方法的别名.

```js
flow.sleep(1e3).then(() => console.log('1 秒后'));
flow.sleep(500, 1500).back(); /* 随机 500 ~ 1500 毫秒后按返回键. */
flow.sleep(1e3, '±200').home(); /* 800 ~ 1200 毫秒后回到桌面. */
```

### delay(millis)

**`6.8.0`** **`Overload 1/2`**

### delay(millisMin, millisMax)

**`6.8.0`** **`Overload 2/2`**

- <ins>**returns**</ins> { [Flow](flowType) }

[flow.sleep](#m-sleep) 的别名, 参数, 返回值与行为相同.

```js
flow.delay(2e3).then(() => console.log('2 秒后'));
flow.delay(300, 600).back();
```

## [m] run

### run(fn)

**`6.8.0`**

- **fn** { [() => any](dataTypes#function) } - 在工作线程执行的函数
- <ins>**returns**</ins> { [Flow](flowType) }

在 Flow 工作线程上执行 `fn`, 以其返回值 fulfill; `fn` 抛出异常时以该异常拒绝; `fn` 返回 Flow 或 Promise 时等待其结算并采纳结果.

这是把一段阻塞式代码 (如 [findOne](uiSelectorType#m-findone), [sleep](global#m-sleep), 同步 HTTP 请求) 移出脚本线程的最简方式.

```js
flow.run(() => {
    let w = text('登录').findOne(5e3);
    return w ? w.bounds() : null;
}).then(bounds => console.log(bounds));
```

> 注: `fn` 中不能调用 [sync](flowType#m-sync) (会抛出异常), 也不能操作 UI 组件. 需要回到脚本线程时, 使用 [then](flowType#m-then).

## [m] of

### of(value?)

**`6.8.0`**

- **[ value = null ]** { [any](dataTypes#any) } - 初始值
- <ins>**returns**</ins> { [Flow](flowType) }

以一个已知值起链, 返回已 fulfill 的 Flow. 无参调用 `flow.of()` 的初始值为 `null`; 可通过 `map` 或 `then` 继续处理, 后续要求控件目标的步骤仍会校验该值.

```js
flow.of(text('登录').findOnce()).click(); /* 值为 null 时以 INVALID_TARGET 拒绝. */
flow.of(5).map(x => x * 2).then(x => console.log(x)); /* 10 */
```

## [m] Flow

### Flow(value)

**`6.8.0`**

- **value** { [any](dataTypes#any) } - Flow, Promise 或任意值
- <ins>**returns**</ins> { [Flow](flowType) }

`flow.Flow` 是 Flow 对象的构造函数, 可用于 `instanceof` 判断.

作为函数调用 (或 `new flow.Flow(value)`) 时: 参数为 Flow 时原样返回; 为 Promise (或任何 thenable) 时采纳为 Flow; 其余值同 [flow.of](#m-of).

```js
let f = flow.wait('登录');
console.log(f instanceof flow.Flow); /* true */

flow.Flow(new Promise(resolve => setTimeout(() => resolve(42), 500))).then(v => console.log(v)); /* 42 */
```

## [m] all

### all(...sources)

**`6.8.0`** **`Overload 1/2`** **`A11Y?`**

- **sources** { ...([Flow](flowType) \| [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) \| [Cond](#条件-cond))[] } - 来源
- <ins>**returns**</ins> { [Flow](flowType) }

### all(sources)

**`6.8.0`** **`Overload 2/2`** **`A11Y?`**

- **sources** { ([Flow](flowType) \| [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) \| [Cond](#条件-cond))[] } - 来源数组
- <ins>**returns**</ins> { [Flow](flowType) }

等待全部来源 fulfill, 以结果数组 (顺序与来源一致) fulfill; 任一来源拒绝时立即以该错误拒绝, 并取消其余由本方法创建的等待.

来源中的条件 (选择器, 函数等) 会以 [flow.defaults](#m-defaults) 的超时与间隔转为等待. 各来源在各自的工作线程上并发等待.

没有来源时以空数组 fulfill.

```js
flow.all('用户名', '密码', '登录').then(([ user, pwd, login ]) => {
    user.setText('admin');
    pwd.setText('123456');
    login.click();
});
```

## [m] race

### race(...sources)

**`6.8.0`** **`Overload 1/2`** **`A11Y?`**

### race(sources)

**`6.8.0`** **`Overload 2/2`** **`A11Y?`**

- **sources** { ([Flow](flowType) \| [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) \| [Cond](#条件-cond))[] } - 来源
- <ins>**returns**</ins> { [Flow](flowType) }

以最先结算的来源的结果 (fulfill 或拒绝) 结算, 其余由本方法创建的等待被取消.

没有来源时以 `INVALID_TARGET` 拒绝.

```js
/* 登录成功页或错误提示, 哪个先出现就处理哪个. */
flow.race(flow.wait('欢迎回来'), flow.wait('密码错误')).then(w => {
    console.log(w.text());
});
```

## [m] any

### any(...sources)

**`6.8.0`** **`Overload 1/2`** **`A11Y?`**

### any(sources)

**`6.8.0`** **`Overload 2/2`** **`A11Y?`**

- **sources** { ([Flow](flowType) \| [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) \| [Cond](#条件-cond))[] } - 来源
- <ins>**returns**</ins> { [Flow](flowType) }

以最先 fulfill 的来源的结果 fulfill; 全部来源都拒绝时以最后一个拒绝的错误拒绝.

没有来源时以 `INVALID_TARGET` 拒绝.

```js
flow.any('确定', 'OK', '好的').click();
```

## [m] cancelAll

### cancelAll()

**`6.8.0`**

- <ins>**returns**</ins> { [number](dataTypes#number) } - 被取消的 Flow 数量

取消当前脚本全部待定的 Flow. 被取消的 Flow 以 [FlowError](flowErrorType) (`code` 为 `CANCELLED`) 拒绝.

脚本退出时会自动执行此操作.

```js
flow.wait('永远不会出现', Infinity);
setTimeout(() => console.log(flow.cancelAll()), 3e3); /* 1 */
```

## [m] defaults

### defaults()

**`6.8.0`** **`Overload 1/2`**

- <ins>**returns**</ins> {{
    - timeout: [number](dataTypes#number)
    - interval: [number](dataTypes#number)
    - stableFor: [number](dataTypes#number)
    - strictActions: [boolean](dataTypes#boolean)
    - humanize: { offset: [number](dataTypes#number)[], delay: [number](dataTypes#number)[] }
    - trace: [boolean](dataTypes#boolean)
- }} - 当前默认值快照

读取当前脚本的 Flow 默认值.

```js
console.log(flow.defaults()); /* { timeout: 10000, interval: 200, stableFor: 0, strictActions: true, humanize: { offset: [ 0, 0 ], delay: [ 0, 0 ] }, trace: false } */
```

### defaults(options)

**`6.8.0`** **`Overload 2/2`**

- **options** {{
    - timeout?: [number](dataTypes#number)
    - interval?: [number](dataTypes#number)
    - stableFor?: [number](dataTypes#number)
    - strictActions?: [boolean](dataTypes#boolean)
    - humanize?: [boolean](dataTypes#boolean) \| { offset?: [number](dataTypes#number) \| [number](dataTypes#number)[], delay?: [number](dataTypes#number) \| [number](dataTypes#number)[] }
    - recoverService?: [boolean](dataTypes#boolean)
    - trace?: [boolean](dataTypes#boolean)
- }} - 要修改的默认值
- <ins>**returns**</ins> { [Object](dataTypes#object) } - 修改后的默认值快照

修改当前脚本的 Flow 默认值, 对之后创建的步骤生效. 每个脚本各有一份, 互不影响.

- `timeout` - 等待超时 (毫秒), `Infinity` 表示不限时. 默认 `10000`
- `interval` - 检测间隔 (毫秒). 默认 `200`
- `stableFor` - 稳定检测时长 (毫秒). 默认 `0`
- `strictActions` - 动作步骤返回 `false` 时是否以 `ACTION_FAILED` 拒绝. 默认 `true`; 为 `false` 时链上的值变为 `false` 且链继续
- `humanize` - 动作前的拟人化随机暂停与手势点击的随机偏移, 也是 [工具集](automator#工具集-toolkit) `humanize` 选项的默认值. `offset` 为像素 (单个数字对两轴生效, 或 `[dx, dy]`), `delay` 为毫秒 (单个数字或 `[min, max]`); `false` 关闭. 默认关闭
- `recoverService` - 等待步骤是否在无障碍服务断开时等待服务恢复. 默认 `false`
- `trace` - 是否开启控制台追踪, 同 [flow.trace](#m-trace)

未知的键或无效的值会抛出异常, 且任何键都不会被写入.

```js
flow.defaults({ timeout: 20e3, interval: 100 });
flow.defaults({ humanize: { offset: 4, delay: [ 80, 240 ] } });
flow.defaults({ strictActions: false });
```

## [m] trace

### trace(on?)

**`6.8.0`**

- **[ on ]** { [boolean](dataTypes#boolean) } - 是否开启追踪
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前是否开启

开启或关闭 Flow 追踪. 开启后每个步骤开始与结束时各在控制台输出一行, 包含步骤名, 目标, 节点短 id (用于区分并发的链), 耗时与结果摘要.

```js
flow.trace(true);
flow.wait('登录', 3e3).click();
/*
[flow] > wait content("登录") #1a2b
[flow] < wait content("登录") #1a2b 412 ms -> fulfilled: TextView(登录)
[flow] > click #3c4d
[flow] < click #3c4d 18 ms -> fulfilled: TextView(登录)
*/
```

## [p] pending

**`6.8.0`** **`Getter`**

- { [number](dataTypes#number) }

当前脚本待定 (尚未结算) 的 Flow 数量.

## [p] workers

**`6.8.0`** **`Getter`**

- { [number](dataTypes#number) }

当前脚本存活的 Flow 工作线程数. 工作线程按需创建, 空闲一段时间后自动结束.

## 工具集起点

**`6.8.0`** **`A11Y`**

[工具集](automator#工具集-toolkit) 的每个函数 (除 `retry` 外) 都有 Flow 起点形式 (见下方各条目), 参数与同步形式相同, 结果为链上的值.

与同步形式的区别:

- 起点形式的 `timeout` 默认取 [flow.defaults](#m-defaults) 的超时 (同步形式默认只查找一次).
- 工具在工作线程上运行, 失败以 [FlowError](flowErrorType) 拒绝而非抛出.
- 可以追加尾随回调 `onOk` / `onErr`, 相当于在起点之后追加 [then(onOk, onErr)](flowType#m-then).
- `dismissPopups` 的 `watch` 选项仅同步形式可用.

```js
flow.launchAndWait('Settings')
    .scrollUntil('关于手机')
    .smartClick()
    .then(r => console.log(r.method));
```

## [m] smartClick

### smartClick(target, options?, onOk?, onErr?)

**`6.8.0`** **`A11Y`**

- **target** { [Target](automator#目标参数-target) } - 点击目标
- **[ options ]** { [Object](dataTypes#object) } - 同 [smartClick](automator#m-smartclick) 的选项
- **[ onOk ]** { [(value: any) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为点击结果对象

[smartClick](automator#m-smartclick) 的 Flow 起点形式: 可点击时点击目标, 否则上溯到可点击的祖先, 最后回退到手势.

```js
flow.smartClick('关于手机', { verify: '型号' }).then(r => console.log(r.method, r.verified));
```

## [m] smartClickBounds

### smartClickBounds(target, options?, onOk?, onErr?)

**`6.8.0`** **`A11Y`**

- **target** { [Target](automator#目标参数-target) } - 点击目标
- **[ options ]** { [Object](dataTypes#object) } - 同 [smartClickBounds](automator#m-smartclickbounds) 的选项
- **[ onOk ]** { [(value: any) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为点击结果对象 (`method` 固定为 `'gesture'`)

[smartClickBounds](automator#m-smartclickbounds) 的 Flow 起点形式: 在目标边界中心执行点按手势.

```js
flow.smartClickBounds(id('banner'), { offset: [ -10, 6 ] }).then(r => console.log(r.target.bounds()));
```

## [m] clickIfExists

### clickIfExists(target, options?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **target** { [Target](automator#目标参数-target) } - 点击目标
- **[ options ]** { [Object](dataTypes#object) } - 同 [smartClick](automator#m-smartclick) 的选项
- **[ onOk ]** { [(value: boolean) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 目标存在且已点击时链上的值为 `true`, 不存在为 `false`

### clickIfExists(target, timeout, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **target** { [Target](automator#目标参数-target) } - 点击目标
- **timeout** { [number](dataTypes#number) } - 查找超时 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) }

[clickIfExists](automator#m-clickifexists) 的 Flow 起点形式: 目标缺席时以 `false` fulfill 而不拒绝.

```js
flow.clickIfExists('跳过广告', 2e3).then(clicked => console.log(clicked ? '已跳过' : '没有广告'));
```

## [m] clickBoundsIfExists

### clickBoundsIfExists(target, options?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **target** { [Target](automator#目标参数-target) } - 点击目标
- **[ options ]** { [Object](dataTypes#object) } - 同 [smartClickBounds](automator#m-smartclickbounds) 的选项
- **[ onOk ]** { [(value: boolean) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 目标存在且已点按时链上的值为 `true`, 不存在为 `false`

### clickBoundsIfExists(target, timeout, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **target** { [Target](automator#目标参数-target) } - 点击目标
- **timeout** { [number](dataTypes#number) } - 查找超时 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) }

[clickBoundsIfExists](automator#m-clickboundsifexists) 的 Flow 起点形式: 目标存在时在控件中心坐标点按, 缺席时以 `false` fulfill.

```js
flow.clickBoundsIfExists('关闭', 1500).then(clicked => console.log(clicked));
```

## [m] clickAny

### clickAny(targets, options?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **targets** { [Target](automator#目标参数-target) | [Target](automator#目标参数-target)[] } - 候选目标
- **[ options ]** { [Object](dataTypes#object) } - 同 [clickAny](automator#m-clickany) 的选项
- **[ onOk ]** { [(value: Object) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为被点击的候选对象, 都不存在时为 `null`

### clickAny(targets, timeout, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **targets** { [Target](automator#目标参数-target) | [Target](automator#目标参数-target)[] } - 候选目标
- **timeout** { [number](dataTypes#number) } - 查找超时 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) }

[clickAny](automator#m-clickany) 的 Flow 起点形式: 点击最先出现的候选目标.

```js
flow.clickAny([ '允许', '始终允许', '仅在使用中允许' ], 3e3).then(hit => console.log(hit && hit.index));
```

## [m] clickBoundsAny

### clickBoundsAny(targets, options?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **targets** { [Target](automator#目标参数-target) | [Target](automator#目标参数-target)[] } - 候选目标
- **[ options ]** { [Object](dataTypes#object) } - 同 [clickBoundsAny](automator#m-clickboundsany) 的选项
- **[ onOk ]** { [(value: Object) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为被点按的候选对象, 都不存在时为 `null`

### clickBoundsAny(targets, timeout, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **targets** { [Target](automator#目标参数-target) | [Target](automator#目标参数-target)[] } - 候选目标
- **timeout** { [number](dataTypes#number) } - 查找超时 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) }

[clickBoundsAny](automator#m-clickboundsany) 的 Flow 起点形式: 在最先出现的候选目标中心坐标点按.

```js
flow.clickBoundsAny([ '跳过', '关闭' ], 3e3).then(hit => console.log(hit ? hit.index : '无'));
```

## [m] findAny

### findAny(targets, options?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **targets** { [Target](automator#目标参数-target) | [Target](automator#目标参数-target)[] } - 候选目标
- **[ options ]** { [Object](dataTypes#object) } - 同 [findAny](automator#m-findany) 的选项
- **[ onOk ]** { [(value: Object) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为找到的候选对象, 都不存在时为 `null`

### findAny(targets, timeout, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **targets** { [Target](automator#目标参数-target) | [Target](automator#目标参数-target)[] } - 候选目标
- **timeout** { [number](dataTypes#number) } - 查找超时 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) }

[findAny](automator#m-findany) 的 Flow 起点形式: 只查找, 不点击.

```js
flow.findAny([ '登录', '退出登录' ], 5e3).then(hit => console.log(hit ? hit.index : '都不存在'));
```

## [m] scrollUntil

### scrollUntil(target, options?, onOk?, onErr?)

**`6.8.0`** **`A11Y`**

- **target** { [Target](automator#目标参数-target) } - 滚动查找的目标
- **[ options ]** { [Object](dataTypes#object) } - 同 [scrollUntil](automator#m-scrolluntil) 的选项
- **[ onOk ]** { [(value: UiObject) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为找到的 [UiObject](uiObjectType)

[scrollUntil](automator#m-scrolluntil) 的 Flow 起点形式: 滚动列表直到目标出现.

```js
flow.scrollUntil('开发者选项').smartClick();
```

## [m] typeInto

### typeInto(target, text, options?, onOk?, onErr?)

**`6.8.0`** **`A11Y`**

- **target** { [Target](automator#目标参数-target) | [number](dataTypes#number) | [null](dataTypes#null) } - 输入框: 选择器 / 节点 / 函数; 数字为第 n 个可编辑节点 (从 0 计); `null` 为当前焦点所在的可编辑节点
- **text** { [string](dataTypes#string) } - 待输入的文本
- **[ options ]** { [Object](dataTypes#object) } - 同 [typeInto](automator#m-typeinto) 的选项
- **[ onOk ]** { [(value: UiObject) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为输入框节点

[typeInto](automator#m-typeinto) 的 Flow 起点形式.

```js
flow.typeInto(className('EditText'), 'hello', { submit: true }).then(w => console.log(w.text()));
```

## [m] dismissPopups

### dismissPopups(targets, options?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **targets** { [Target](automator#目标参数-target) | [Target](automator#目标参数-target)[] } - 弹窗关闭按钮等候选目标
- **[ options ]** { [Object](dataTypes#object) } - 同 [dismissPopups](automator#m-dismisspopups) 的选项, 不支持 `watch`
- **[ onOk ]** { [(value: any) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为被点击的候选对象 (或其数组), 没有弹窗时为 `null`

### dismissPopups(targets, timeout, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **targets** { [Target](automator#目标参数-target) | [Target](automator#目标参数-target)[] } - 候选目标
- **timeout** { [number](dataTypes#number) } - 查找超时 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) }

[dismissPopups](automator#m-dismisspopups) 的 Flow 起点形式.

```js
flow.dismissPopups([ '我知道了', '暂不更新', '关闭' ], 2e3).wait('首页');
```

## [m] collectList

### collectList(container, item, options?, onOk?, onErr?)

**`6.8.0`** **`A11Y`**

- **container** { [Target](automator#目标参数-target) | [null](dataTypes#null) } - 列表容器, `null` 表示自动探测
- **item** { [Target](automator#目标参数-target) } - 条目选择条件
- **[ options ]** { [Object](dataTypes#object) } - 同 [collectList](automator#m-collectlist) 的选项
- **[ onOk ]** { [(value: any[]) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为采集到的条目数组

[collectList](automator#m-collectlist) 的 Flow 起点形式.

```js
flow.collectList(null, id('title')).then(items => console.log(items.length));
```

## [m] launchAndWait

### launchAndWait(app, options?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **app** { [string](dataTypes#string) } - 应用名称或包名
- **[ options ]** { [Object](dataTypes#object) } - 同 [launchAndWait](automator#m-launchandwait) 的选项
- **[ onOk ]** { [(value: Object) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为启动结果对象

### launchAndWait(app, timeout, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **app** { [string](dataTypes#string) } - 应用名称或包名
- **timeout** { [number](dataTypes#number) } - 等待超时 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) }

[launchAndWait](automator#m-launchandwait) 的 Flow 起点形式: 启动应用并等待其到达前台.

```js
flow.launchAndWait('com.android.settings', 8e3).then(r => console.log(r.packageName));
```

## [m] backUntil

### backUntil(cond, options?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **cond** { [Target](automator#目标参数-target) } - 停止条件
- **[ options ]** { [Object](dataTypes#object) } - 同 [backUntil](automator#m-backuntil) 的选项
- **[ onOk ]** { [(value: any) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为条件成立时的值

### backUntil(cond, maxTimes, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **cond** { [Target](automator#目标参数-target) } - 停止条件
- **maxTimes** { [number](dataTypes#number) } - 最多按返回键的次数
- <ins>**returns**</ins> { [Flow](flowType) }

[backUntil](automator#m-backuntil) 的 Flow 起点形式: 反复按返回键直到条件成立.

```js
flow.backUntil('首页', 5).then(w => console.log('已回到首页'));
```

## [m] backToApp

### backToApp(app, options?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **app** { [string](dataTypes#string) } - 应用名称或包名
- **[ options ]** { [Object](dataTypes#object) } - 同 [backToApp](automator#m-backtoapp) 的选项
- **[ onOk ]** { [(value: string) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为到达前台的包名

### backToApp(app, maxTimes, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **app** { [string](dataTypes#string) } - 应用名称或包名
- **maxTimes** { [number](dataTypes#number) } - 最多按返回键的次数
- <ins>**returns**</ins> { [Flow](flowType) }

[backToApp](automator#m-backtoapp) 的 Flow 起点形式: 按返回键直到指定应用回到前台.

```js
flow.backToApp('com.android.settings', 6).then(pkg => console.log(pkg));
```

## [m] toggle

### toggle(target, checked, options?, onOk?, onErr?)

**`6.8.0`** **`A11Y`**

- **target** { [Target](automator#目标参数-target) } - 开关控件或其标签
- **checked** { [boolean](dataTypes#boolean) } - 期望的选中状态
- **[ options ]** { [Object](dataTypes#object) } - 同 [toggle](automator#m-toggle) 的选项
- **[ onOk ]** { [(value: Object) => any](dataTypes#function) } - 成功时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 失败时的回调
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为切换结果对象

[toggle](automator#m-toggle) 的 Flow 起点形式: 把开关切换到 `checked` 指定的状态, 已是该状态时不点击.

```js
flow.toggle('蓝牙', true).then(r => console.log(r.changed));
```

## 事件等待起点

**`6.8.0`** **`A11Y`**

[事件驱动等待](automator#事件驱动等待) 的四个函数都有 Flow 起点形式 (见下方各条目), 参数与同步形式相同, 结果 (空闲报告, 事件, Toast 或通知对象) 为链上的值. 起点形式不接受尾随回调, 可改用 [then](flowType#m-then).

```js
flow.waitForToast('已保存', 10e3).then(toast => console.log(toast.text));
```

## [m] waitForIdle

### waitForIdle(quietFor?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **[ quietFor = `500` ]** { [number](dataTypes#number) } - 判定为安静所需的无事件时长 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为空闲报告 `{ quietFor, elapsed, events }`

### waitForIdle(options)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **options** { [Object](dataTypes#object) } - 同 [waitForIdle](automator#m-waitforidle) 的选项 (`quietFor`, `timeout`, `eventTypes`)
- <ins>**returns**</ins> { [Flow](flowType) }

[waitForIdle](automator#m-waitforidle) 的 Flow 起点形式: 等待界面不再变化.

```js
flow.waitForIdle({ quietFor: 800, timeout: 10e3 }).then(idle => console.log(idle.elapsed, idle.events));
```

## [m] waitForEvent

### waitForEvent(type?, filter?, timeout?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **[ type ]** { [string](dataTypes#string) | [string](dataTypes#string)[] | [null](dataTypes#null) } - 事件类型名, 省略时为任意类型
- **[ filter ]** { [Function](dataTypes#function) | [Object](dataTypes#object) | [null](dataTypes#null) } - 事件过滤, 同 [waitForEvent](automator#m-waitforevent)
- **[ timeout ]** { [number](dataTypes#number) } - 超时 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为事件包装对象

### waitForEvent(type, timeout, filter?)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **type** { [string](dataTypes#string) | [string](dataTypes#string)[] | [null](dataTypes#null) } - 事件类型名
- **timeout** { [number](dataTypes#number) } - 超时 (毫秒)
- **[ filter ]** { [Function](dataTypes#function) | [Object](dataTypes#object) | [null](dataTypes#null) } - 事件过滤
- <ins>**returns**</ins> { [Flow](flowType) }

[waitForEvent](automator#m-waitforevent) 的 Flow 起点形式: 等待首个符合条件的无障碍事件. `filter` 与 `timeout` 的顺序可以互换.

```js
flow.waitForEvent('view_clicked', { packageName: 'com.android.settings' }, 10e3).then(e => console.log(e.className));
```

## [m] waitForToast

### waitForToast(text?, timeout?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **[ text ]** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) | [Function](dataTypes#function) | [Object](dataTypes#object) | [null](dataTypes#null) } - Toast 过滤, 同 [waitForToast](automator#m-waitfortoast)
- **[ timeout ]** { [number](dataTypes#number) } - 超时 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为 Toast 对象 `{ packageName, text }`

### waitForToast(timeout)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **timeout** { [number](dataTypes#number) } - 超时 (毫秒), 等待任意 Toast
- <ins>**returns**</ins> { [Flow](flowType) }

[waitForToast](automator#m-waitfortoast) 的 Flow 起点形式. 观察者忽略 AutoJs6 自身显示的 Toast.

```js
flow.waitForToast(/成功/, 5e3).then(toast => console.log(toast.packageName, toast.text));
```

## [m] waitForNotification

### waitForNotification(filter?, timeout?)

**`6.8.0`** **`Overload 1/2`** **`A11Y`**

- **[ filter ]** { [string](dataTypes#string) | [RegExp](dataTypes#regexp) | [Function](dataTypes#function) | [Object](dataTypes#object) | [null](dataTypes#null) } - 通知过滤, 同 [waitForNotification](automator#m-waitfornotification)
- **[ timeout ]** { [number](dataTypes#number) } - 超时 (毫秒)
- <ins>**returns**</ins> { [Flow](flowType) } - 链上的值为 [Notification](events#notification) 对象

### waitForNotification(timeout)

**`6.8.0`** **`Overload 2/2`** **`A11Y`**

- **timeout** { [number](dataTypes#number) } - 超时 (毫秒), 等待任意通知
- <ins>**returns**</ins> { [Flow](flowType) }

[waitForNotification](automator#m-waitfornotification) 的 Flow 起点形式.

```js
flow.waitForNotification({ title: /验证码/ }, 60e3).then(n => console.log(n.text));
```
