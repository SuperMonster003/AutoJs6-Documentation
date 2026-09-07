# 流程对象 (Flow)

Flow 对象是 [流程 (Flow)](flow) API 的核心类型, 由 [flow](flow#flow) 的起点函数 (如 [flow.wait](flow#m-wait), 全局函数 [waitAsync](flow#m-wait)) 创建, 代表异步等待与动作链上的一个步骤及其结算状态.

本章节列出 Flow 对象的属性, 可追加的步骤 (等待, 动作, 工具, 事件等待, 计时与回调) 与终结方法; 起点函数, 条件与等待选项见 [流程 (Flow)](flow), 错误对象见 [FlowError](flowErrorType).

```js
let f = flow.wait('登录', 5e3); /* 一个 Flow 对象. */
f.click().then(() => console.log('已点击')); /* 追加步骤, 每次返回新的 Flow 对象. */
console.log(f.sync()); /* 转回同步, 得到匹配的控件节点. */
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">Flow</p>

---

## [@] Flow

**`6.8.0`**

Flow 对象由 [flow](flow) 的起点函数创建, 代表链上的一个步骤及其结算状态.<br>
每个链式方法都返回一个新的 Flow 对象 (代表新步骤), 原对象不变, 因此一个 Flow 可以被多次分叉:

```js
let login = flow.wait('登录', 5e3);
login.click(); /* 分支 1: 点击. */
login.then(w => console.log(w.bounds())); /* 分支 2: 打印边界. */
```

### 取值规则

- 等待步骤以匹配结果为值; 节点动作步骤成功时以其作用目标为值; 全局动作步骤, [sleep](#m-sleep), [timeout](#m-timeout), [scope](#m-scope), [retry](#m-retry), [peek](#m-peek), [filter](#m-filter) 透传上一步的值.
- 拒绝会沿链传播: 一个步骤拒绝后, 其后的普通步骤被跳过, 直到遇到 [catch](#m-catch) / [then](#m-then) 的 `onErr` / [retry](#m-retry).
- 回调返回的值成为新值; 回调返回 Flow 或 Promise 时等待其结算并采纳结果.

### 线程与生命周期

- 步骤在 Flow 工作线程 (线程名 `flow-<引擎 id>-<n>`) 上执行, 同一条链的步骤按序执行, 不同的链并发执行.
- [then](#m-then), [catch](#m-catch), [finally](#m-finally), [map](#m-map), [filter](#m-filter), [peek](#m-peek) 的回调在创建该 Flow 的脚本线程上执行 (主线程创建的 Flow 回到主线程, [threads.start](threads#m-start) 线程创建的回到该线程), 因此回调中可以安全操作 UI 与脚本变量; 只有 [run](#m-run) 的回调与 [条件函数](flow#条件-cond) 在工作线程上执行.
- 脚本存在待定的 Flow 时不会退出 (与定时器类似); 脚本退出时全部待定的 Flow 被取消, 工作线程停止.
- 一个 Flow 被拒绝且既没有后续步骤也没有被 [sync](#m-sync) / [toPromise](#m-topromise) 观察时, 控制台输出警告 `Possible unhandled Flow rejection in step "..."`.

## [p#] state

**`6.8.0`** **`Getter`**

- { `'pending'` \| `'fulfilled'` \| `'rejected'` \| `'cancelled'` }

当前状态. 取消是一种特殊的拒绝 (错误为 `CANCELLED` 的 [FlowError](flowErrorType)), 单独显示为 `'cancelled'`.

## [p#] step

**`6.8.0`** **`Getter`**

- { [string](dataTypes#string) }

本步骤的名称, 如 `'wait'`, `'click'`, `'then'`, `'smartClick'`.

## [p#] value

**`6.8.0`** **`Getter`**

- { [any](dataTypes#any) }

已 fulfill 时为结果值, 否则为 `undefined`.

## [p#] error

**`6.8.0`** **`Getter`**

- { [FlowError](flowErrorType) \| [Error](exceptions#error-对象) \| [undefined](dataTypes#undefined) }

已拒绝时为错误对象, 否则为 `undefined`.

```js
let f = flow.wait('不存在的控件', 1e3).catch(() => 'fallback');
console.log(f.sync()); /* fallback */
console.log(f.state); /* fulfilled */
```

## [m#] wait

### wait(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y?`**

### wait(cond, options, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](#flow) }

在上一步之后追加一个等待, 参数同 [flow.wait](flow#m-wait). 满足时链上的值变为新的匹配结果.

上一步拒绝时本步骤被跳过.

```js
flow.wait('登录', 5e3).click()
    .wait('欢迎回来', 10e3)
    .then(w => console.log(w.text()));
```

同样可追加的等待还有 `waitUntil`, `waitWhile`, `waitForStable`, `waitForVisible`, `waitForHidden` (`waitForGone`), `waitForActivity`, `waitForPackage`, `waitThenClick` (`clickWait`), `waitThenLongClick`, `waitForStableThenClick` (`clickWhenStable`), `clickWhenStableAfter`, 语义与 [flow](flow) 上的同名函数一致.

## [m#] within

### within(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y?`**

### within(cond, options, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](#flow) }

与 [wait](#m-wait) 相同, 但找到的节点同时成为之后所有等待的查找根节点 (相当于随后调用 [scope({ root })](#m-scope)).

```js
/* 在设置页的列表容器内查找 "关于手机". */
flow.within(className('RecyclerView'), 5e3)
    .wait('关于手机')
    .click();
```

## 节点动作步骤

**`6.8.0`** **`A11Y`**

对链上的值执行 [控件行为](uiObjectActionsType), 成功时以作用目标为值继续.

链上的值可以是:

- [UiObject](uiObjectType) - 对该节点执行.
- [UiObjectCollection](uiObjectCollectionType) 或 UiObject 数组 - 对每个节点执行, 全部成功才算成功; 空集合视为无效目标.
- 坐标点 (`[x, y]`, `{ x, y }`, Android 或 OpenCV `Point`) - 仅 `click` 与 `longClick` 支持, 转为坐标点击.

其余值 (包括 `null`) 以 `INVALID_TARGET` 拒绝. 行为返回 `false` 时, 按 `strictActions` 以 `ACTION_FAILED` 拒绝 (默认) 或以 `false` 为值继续.

可用的动作及参数个数:

| 步骤 | 参数 | 对应控件行为 |
| --- | --- | --- |
| click() | 0 | [click](uiObjectActionsType#m-click) |
| longClick() | 0 | [longClick](uiObjectActionsType#m-longclick) |
| clickBounds(offsetX?, offsetY?) | 0 ~ 2 | [clickBounds](uiObjectType#m-clickbounds) |
| setText(text) | 1 | [setText](uiObjectActionsType#m-settext) |
| appendText(text) | 1 | UiObject#appendText |
| clear() | 0 | UiObject#clear |
| paste() / copy() / cut() | 0 | [paste](uiObjectActionsType#m-paste) / [copy](uiObjectActionsType#m-copy) / [cut](uiObjectActionsType#m-cut) |
| select() | 0 | [select](uiObjectActionsType#m-select) |
| focus() / clearFocus() | 0 | [focus](uiObjectActionsType#m-focus) / [clearFocus](uiObjectActionsType#m-clearfocus) |
| scrollForward() / scrollBackward() | 0 | [scrollForward](uiObjectActionsType#m-scrollforward) / [scrollBackward](uiObjectActionsType#m-scrollbackward) |
| scrollUp() / scrollDown() / scrollLeft() / scrollRight() | 0 | [scrollUp](uiObjectActionsType#m-scrollup) 等 |
| expand() / collapse() | 0 | [expand](uiObjectActionsType#m-expand) / [collapse](uiObjectActionsType#m-collapse) |
| dismiss() / show() | 0 | [dismiss](uiObjectActionsType#m-dismiss) / [show](uiObjectActionsType#m-show) |
| contextClick() | 0 | [contextClick](uiObjectActionsType#m-contextclick) |
| imeEnter() | 0 | [imeEnter](uiObjectActionsType#m-imeenter) |
| performAction(action, ...args) | 1 ~ 2 | [performAction](uiObjectActionsType#m-performaction) |
| clickAfter(millis) / clickAfter(min, max) | 1 ~ 2 | 先休眠再 click |
| longClickAfter(millis) / longClickAfter(min, max) | 1 ~ 2 | 先休眠再 longClick |

每个动作步骤都可以追加尾随回调 `onOk` / `onErr`.

```js
flow.wait('用户名').setText('admin');
flow.wait(className('Button').text('登录')).clickAfter(300, 800);
flow.wait(className('Switch')).performAction('CLICK');
flow.wait(() => text('删除').find()).click(); /* 函数条件返回控件集合 (空集合视为未找到), 点击全部匹配项. */
```

## 全局动作步骤

**`6.8.0`** **`A11Y`**

执行 [automator](automator) 模块的全局行为, 与链上的值无关, 成功后透传该值.

| 步骤 | 参数 | 对应方法 |
| --- | --- | --- |
| back() / home() / recents() | 0 | [back](automator#back) / [home](automator#home) / [recents](automator#recents) |
| notifications() / quickSettings() | 0 | [notifications](automator#notifications) / [quickSettings](automator#quicksettings) |
| powerDialog() / splitScreen() / lockScreen() | 0 | [powerDialog](automator#powerdialog) / [splitScreen](automator#splitscreen) / [lockScreen](automator#lockscreen) |
| takeScreenshot() / dismissNotificationShade() | 0 | [takeScreenshot](automator#takescreenshot) / [dismissNotificationShade](automator#dismissnotificationshade) |
| press(x, y, duration) | 1 ~ 3 | [press](automator#press) |
| swipe(x1, y1, x2, y2, duration) | 2 ~ 5 | [swipe](automator#swipe) |
| gesture(duration, [x1, y1], [x2, y2], ...) | >= 2 | [gesture](automator#gesture) |
| gestures([duration, [x, y], ...], ...) | >= 1 | [gestures](automator#gestures) |

行为返回 `false` 时按 `strictActions` 以 `ACTION_FAILED` 拒绝或继续. 动作前会应用 [flow.defaults](flow#m-defaults) 的 `humanize` 暂停.

```js
flow.wait('设置').click().sleep(500).back().back();
flow.of(null).swipe(500, 1600, 500, 400, 300); /* 以任意值起链, 只为执行手势. */
```

## 工具集步骤

**`6.8.0`** **`A11Y`**

[工具集](automator#工具集-toolkit) 的 9 个工具可作为链式步骤, 以链上的值为目标 (省略同步形式的首个目标参数), 结果为新值:

| 步骤 | 链上的值 | 结果 |
| --- | --- | --- |
| smartClick(options?) | 目标节点 | 点击结果对象 |
| scrollUntil(target, options?) | 滚动容器 (给出 `container` 选项时忽略) | 找到的节点 |
| typeInto(text, options?) | 输入框 (`null` 时为焦点输入框) | 输入框节点 |
| dismissPopups(targets, options?) | 透传 | 透传链上的值 |
| collectList(item, options?) | 列表容器 (`null` 时自动探测) | 条目数组 |
| launchAndWait(app, options?) | 忽略 | 启动结果对象 |
| backUntil(cond, options?) | 忽略 | 条件的值 |
| backToApp(app, options?) | 忽略 | 包名 |
| toggle(checked, options?) | 目标节点 | 切换结果对象 |

链上的值为 `null` 而工具需要目标时, 以 `INVALID_TARGET` (`reason` 为 `noTarget`) 拒绝.<br>
链式形式的 `timeout` 默认为 `0` (只查找一次), 与同步形式相同.

```js
flow.wait('设置项列表', 5e3)
    .scrollUntil('开发者选项')
    .smartClick({ verify: '调试' })
    .then(r => console.log(r.method, r.verified));

flow.wait(className('EditText'))
    .typeInto('hello', { submit: true });
```

## 事件等待步骤

**`6.8.0`** **`A11Y`**

[事件驱动等待](automator#事件驱动等待) 的四个函数可作为链式步骤: `waitForIdle` 透传链上的值, 其余以到达的事件, Toast 或通知为新值.

```js
flow.wait('提交').click()
    .waitForIdle(800)
    .waitForToast(/成功/, 5e3)
    .then(toast => console.log(toast.text));
```

## [m#] sleep

### sleep(millis)

**`6.8.0`** **`Overload 1/2`**

### sleep(millisMin, millisMax)

**`6.8.0`** **`Overload 2/2`**

- <ins>**returns**</ins> { [Flow](#flow) }

休眠后透传链上的值, 参数同 [flow.sleep](flow#m-sleep). `delay` 是别名.

```js
flow.wait('下一步').sleep(300, 600).click();
```

## [m#] timeout

### timeout(millis)

**`6.8.0`**

- **millis** { [number](dataTypes#number) } - 截止时长 (毫秒)
- <ins>**returns**</ins> { [Flow](#flow) }

为链的其余部分设置一个自此刻起的总截止时间: 之后的等待被截短到该截止, 截止之后开始的步骤以 `TIMEOUT` (`reason` 为 `chain`) 拒绝. 透传链上的值.

```js
/* 整条链最多 15 秒. */
flow.of(null).timeout(15e3)
    .wait('步骤一').click()
    .wait('步骤二').click()
    .wait('完成');
```

## [m#] retry

### retry(times?, delay?)

**`6.8.0`**

- **[ times = `1` ]** { [number](dataTypes#number) } - 最多重跑次数
- **[ delay = `0` ]** { [number](dataTypes#number) } - 每次重跑前的休眠 (毫秒)
- <ins>**returns**</ins> { [Flow](#flow) }

上一步骤拒绝 (取消除外) 时重跑上一步骤, 最多 `times` 次; 上一步骤成功时透传其值.

```js
/* 点击失败时最多重试 3 次, 每次间隔 500 毫秒. */
flow.wait('提交').click().retry(3, 500);

/* 等待超时后再等一轮. */
flow.wait('结果', 5e3).retry(1).then(w => console.log(w.text()));
```

> 注: 与同步的 [retry(fn, options)](automator#retry) 不同, 本方法只重跑链上的上一个步骤.

## [m#] scope

### scope(options)

**`6.8.0`**

- **options** {{
    - root?: [UiObject](uiObjectType)
    - compass?: [string](dataTypes#string)
    - resultType?: [string](dataTypes#string) \| [string](dataTypes#string)[]
- }} - 作用域
- <ins>**returns**</ins> { [Flow](#flow) }

设置之后所有等待与工具步骤的作用域 (查找根节点, 罗盘, 结果类型), 透传链上的值. 单个等待的同名选项优先.

```js
flow.wait(id('dialog'), 5e3)
    .then(dialog => flow.of(dialog).scope({ root: dialog }).wait('确定').click());

/* 更简洁的写法. */
flow.within(id('dialog'), 5e3).wait('确定').click();
```

## [m#] then

### then(onOk?, onErr?)

**`6.8.0`**

- **[ onOk ]** { [(value: any) => any](dataTypes#function) } - fulfill 时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 拒绝时的回调
- <ins>**returns**</ins> { [Flow](#flow) }

在脚本线程上处理结算结果, 语义同 Promise 的 `then`: 回调的返回值成为新值, 抛出的异常成为拒绝, 返回 Flow 或 Promise 时采纳其结果; 没有对应回调时透传.

```js
flow.wait('余额', 5e3)
    .then(w => w.parent().child(1).text())
    .then(balance => toast(`余额: ${balance}`), e => toast(`失败: ${e.code}`));
```

## [m#] catch

### catch(onErr)

**`6.8.0`**

- **onErr** { [(error: FlowError) => any](dataTypes#function) } - 拒绝时的回调
- <ins>**returns**</ins> { [Flow](#flow) }

只处理拒绝, 相当于 `then(null, onErr)`. 回调的返回值成为新值, 链恢复为 fulfill 状态.

`else` 是本方法的别名.

```js
flow.wait('广告关闭按钮', 3e3).click()
    .catch(e => console.log('没有广告'))
    .wait('首页');
```

## [m#] finally

### finally(fn)

**`6.8.0`**

- **fn** { [() => any](dataTypes#function) } - 结算后的回调
- <ins>**returns**</ins> { [Flow](#flow) }

无论 fulfill 还是拒绝都执行 `fn` (不带参数), 之后恢复原结算结果; `fn` 抛出异常 (或返回的 Flow 拒绝) 时以该错误拒绝.

## [m#] map

### map(fn)

**`6.8.0`**

- **fn** { [(value: any) => any](dataTypes#function) } - 转换函数
- <ins>**returns**</ins> { [Flow](#flow) }

以 `fn` 的返回值替换链上的值, 相当于只有 `onOk` 的 [then](#m-then).

```js
flow.wait(/\d+ 条未读/).map(w => parseInt(w.text())).then(n => console.log(n));
```

## [m#] filter

### filter(fn)

**`6.8.0`**

- **fn** { [(value: any) => boolean](dataTypes#function) } - 断言函数
- <ins>**returns**</ins> { [Flow](#flow) }

`fn` 返回真值时透传链上的值, 否则以 `INVALID_TARGET` (`reason` 为 `filtered out`) 拒绝.

```js
flow.wait('提交').filter(w => w.enabled()).click().catch(() => console.log('按钮不可用'));
```

## [m#] peek

### peek(fn)

**`6.8.0`**

- **fn** { [(value: any) => void](dataTypes#function) } - 观察函数
- <ins>**returns**</ins> { [Flow](#flow) }

调用 `fn` 观察链上的值, 忽略其返回值并透传. 适合调试.

```js
flow.wait('登录').peek(w => console.log(w.bounds())).click();
```

## [m#] run

### run(onOk?, onErr?)

**`6.8.0`**

- **[ onOk ]** { [(value: any) => any](dataTypes#function) } - fulfill 时的回调
- **[ onErr ]** { [(error: FlowError) => any](dataTypes#function) } - 拒绝时的回调
- <ins>**returns**</ins> { [Flow](#flow) }

与 [then](#m-then) 相同, 但回调在 Flow 工作线程上执行, 可以安全地调用阻塞方法 (如 [findOne](uiSelectorType#m-findone), [sleep](global#m-sleep)); 不能操作 UI, 也不能调用 [sync](#m-sync).

```js
flow.wait('详情').click()
    .run(() => text('加载完成').findOne(10e3)) /* 在工作线程阻塞等待. */
    .then(w => console.log(w !== null));
```

## [m#] sync

### sync(timeout?)

**`6.8.0`** **`Non-UI`**

- **[ timeout = `Infinity` ]** { [number](dataTypes#number) } - 最长等待 (毫秒)
- <ins>**returns**</ins> { [any](dataTypes#any) } - fulfill 的值

阻塞当前线程直到 Flow 结算: fulfill 时返回值, 拒绝时抛出错误 ([FlowError](flowErrorType) 或回调抛出的原始异常).

`timeout` 到期时抛出 `TIMEOUT` (`reason` 为 `sync`) 的 [FlowError](flowErrorType), 链本身继续运行. 不传或传 `Infinity` 时不限时, 因此可能 **永久阻塞**.

阻塞期间调用线程仍会执行属于它的 Flow 回调 (如被等待的链上的 [then](#m-then)), 不会死锁.

不能在 UI 线程或 Flow 工作线程 ([run](#m-run) 回调, 条件函数) 中调用, 否则抛出异常.

```js
let w = flow.wait('登录', 5e3).sync(); /* 相当于 text('登录').findOne(5e3), 但超时抛出异常而非返回 null. */

try {
    flow.wait('登录', 5e3).click().sync();
} catch (e) {
    console.error(e.name, e.code, e.step); /* FlowError TIMEOUT wait */
}
```

## [m#] await

### await()

**`6.8.0`** **`Non-UI`**

- <ins>**returns**</ins> { [any](dataTypes#any) }

以 [续体](continuation) 方式等待结算, 相当于 `toPromise().await()`. 仅在支持续体的环境 (如 `"continuation"` 模式) 中可用.

## [m#] toPromise

### toPromise()

**`6.8.0`**

- <ins>**returns**</ins> { [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) }

转为 Promise, 在脚本线程上结算. 用于与 `async` / `await` 或其他基于 Promise 的代码配合.

```js
(async () => {
    let w = await flow.wait('登录', 5e3).toPromise();
    w.click();
})();
```

## [m#] cancel

### cancel()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否取消了任何步骤

取消本 Flow: 未结算时以 `CANCELLED` 拒绝, 正在阻塞的等待被中断, 尚未运行的步骤被跳过; 同时向上取消没有其他存活分支的待定祖先 (因此取消线性链的末端会停止链首的等待). 已结算时返回 `false`.

```js
let f = flow.wait('可能永远不出现', Infinity).click();
setTimeout(() => f.cancel(), 10e3);
```

## [m#] toString

### toString()

**`6.8.0`**

- <ins>**returns**</ins> { [string](dataTypes#string) }

返回 `Flow(<step>, <state>)` 形式的描述, 如 `Flow(wait, pending)`.
