# Compose 会话 (ComposeSession)

ComposeSession 表示同一脚本拥有的一棵已挂载节点树及其渲染生命周期. 由 [compose.mount](compose#m-mount) 返回, 或经 [ComposeFloatyWindow.session](composeFloatyWindowType#p-session) 取得. 不能直接用 `new` 创建.

UI 挂载和悬浮窗共享单脚本引擎最多 8 个活动会话的限制. 会话不是 Android Activity 或 View; 修改组件使用 [ComposeNode](composeNodeType), 窗口操作使用 [ComposeFloatyWindow](composeFloatyWindowType).

<p style="font: bold 2em sans-serif; color: #FF7043">ComposeSession</p>

## [p#] root

**`READONLY`**

- { [ComposeNode](composeNodeType) | [null](dataTypes#null) }

当前根节点句柄. 响应式渲染更换根节点时, 此属性随会话更新. 会话关闭后立即读取为 `null`. 它不是原生 View, 也不表示本次更改已经完成屏幕绘制.

## [m#] update

### session.update(fn)

- **fn** { [Function](dataTypes#function) } - 同步执行的更新函数, 无参数.
- <ins>**returns**</ins> { [any](dataTypes#any) } - `fn` 的返回值.

在所属脚本线程运行一次 [compose.batch](compose#m-batch). 普通函数的 `this` 为脚本全局对象, 不会自动传入会话或根节点. 返回值是更新函数的结果, 不是会话对象.

下面假设 `session` 已挂载, `title` 和 `toggle` 是该会话内的 Text 与 Switch 句柄:

```js
let result = session.update(function () {
    title.text = 'Updated';
    toggle.checked = true;
    return 'done';
});
```

会话必须尚未关闭. 更新仍受节点归属和单次事务只影响一个活动会话的限制; 此方法不会把传入函数永久注册为新的渲染函数.

## [m#] post

### session.post(fn, delay?)

- **fn** { [Function](dataTypes#function) } - 稍后在所属脚本线程执行的函数, 无参数.
- **[ delay = 0 ]** { [number](dataTypes#number) } - 延迟毫秒数, 必须为 `0..2147483647` 的整数.
- <ins>**returns**</ins> { [void](dataTypes#void) }

可从工作线程调用. 即使 `delay` 为 `0`, 也会排队而非立即调用. 执行时自动使用节点事务和响应式批处理; 普通函数的 `this` 为脚本全局对象.

任务到期时若会话已经关闭, 函数不会执行. 对已关闭会话继续调用 `post` 则同步抛出 `SESSION_CLOSED`. 队列满时可能抛出 `LIMIT_EXCEEDED`.

此方法不返回定时器编号, 没有单个任务取消接口, 也不为非 UI 脚本额外保活. 关闭会话保证其任务不再调用脚本, 不表示所有延迟闭包立即从引擎的调度队列删除. 脚本结束会清理该引擎的待执行任务.

如果希望任务只随引擎退出取消, 使用 [compose.post](compose#m-post); 单个会话关闭不会取消该模块级任务.

## [m#] showSnackbar

### session.showSnackbar(message, options?)

- **message** { [string](dataTypes#string) } - Snackbar 文本.
- **[ options ]** { [Object](dataTypes#object) | [null](dataTypes#null) } - 下表中的选项; 容器省略或为 nullish 值时使用默认选项.
- <ins>**returns**</ins> { [ComposeSession](composeSessionType) } - 当前会话.

| 选项 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `actionLabel` | `string` 或 `null` | `null` | 操作按钮文本. |
| `duration` | `'short'`, `'long'`, `'indefinite'` 或 `null` | `'short'` | `null` 使用默认时长; 不是毫秒数. |
| `onAction` | `Function` 或 `null` | 无 | 用户执行操作时调用, 无参数. |
| `onDismiss` | `Function` 或 `null` | 无 | 非操作方式消失时调用, 无参数. |

普通回调函数的 `this` 为当前会话. 每条请求最多产生一次操作或消失结果; 关闭会话后释放尚未完成的请求和回调, 不补发消失通知.

`actionLabel`, `onAction`, `onDismiss` 为 `null` 或 `undefined` 时表示省略. `duration: undefined` 不作为默认时长, 会报 `INVALID_ARGUMENT`; 未使用该项时应省略或传 `null`.

请求按顺序显示, 并在同一轮树更新被接受后选择会话中的第一个 `Scaffold`. 该 Scaffold 必须使用默认 Snackbar host. 不存在 Scaffold, 或该 Scaffold 自定义了 `snackbarHost` 插槽时, 请求会报 `INVALID_ARGUMENT`. 多个 Scaffold 时不自动选择距离调用处最近的一个.

移除或替换当前 Snackbar host 会结束其待处理请求, 按非操作方式返回结果. 原生显示与回调是异步的; 返回当前会话不表示 Snackbar 已显示或用户已操作. 未知选项抛出 `UNKNOWN_PROP`, 类型或枚举不合法抛出 `INVALID_ARGUMENT`.

```js
'ui';

let session = compose.mount(compose.Scaffold({},
    compose.Button({onClick: function () {
        session.showSnackbar('Saved', {
            actionLabel: 'Undo',
            onAction: function () { console.log('Undo requested'); },
        });
    }}, 'Save')));
```

## [m#] on

### session.on(event, fn)

- **event** { [string](dataTypes#string) } - 仅支持 `'close'`.
- **fn** { [Function](dataTypes#function) } - 关闭回调, 无参数.
- <ins>**returns**</ins> { [ComposeSession](composeSessionType) } - 当前会话.

普通回调函数的 `this` 为当前会话. 回调执行前会话已标为关闭, `root` 已清空, 节点订阅及回调已释放. 每次注册在首次关闭时调用一次, 重复 `close()` 不重复通知. 回调异常会报告给脚本控制台, 不阻止其他关闭回调和后续清理.

此对象没有 `off` 方法, 也不支持 `session.on('error', fn)`. 在会话关闭后注册会报 `SESSION_CLOSED`. 节点事件应使用 [ComposeNode.on](composeNodeType#m-on), Snackbar 结果应使用其选项回调.

## [m#] isClosed

### session.isClosed()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已经关闭.

这是方法, 不是布尔属性. 可在关闭后继续查询.

## [m#] close

### session.close()

- <ins>**returns**</ins> { [void](dataTypes#void) }

关闭当前会话, 释放渲染资源, 节点事件, 渲染依赖和当前 ref, 并使所属 `post` 任务不再执行. 悬浮会话同时关闭窗口和释放其脚本保活引用. 此方法幂等, 可从工作线程请求关闭; 脚本侧通知仍回到所属调度线程处理.

关闭标志先于原生资源清理完成. 原生视图释放在 Android 主线程执行, `close()` 返回或 `'close'` 回调都不是原生释放完成的回执. 调用方图片的生命周期应覆盖这段过程, 不要仅凭关闭返回就立即 recycle 仍可能被原生视图引用的图片.

没有原生释放完成的确认时, 不要在 `remove`, `close` 返回后或关闭监听中主动 recycle. 图片不再使用后可放弃脚本持有的强引用, 交给正常回收机制处理. 当前没有 `awaitClosed` 或等待原生释放的 Promise 接口.

关闭 UI 会话会移除 Compose 内容, 不等同于请求结束脚本 Activity. 页面后续行为由脚本自身决定.

会话也会在脚本停止, 所属 Activity 销毁, UI 内容被替换, 原生窗口关闭, 或插件更新/卸载/禁用时关闭. 常规原生回调不会在主线程同步执行非 UI 脚本, 关闭操作也不会等待另一个脚本线程完成.

关闭后 `root` 为 `null`, `isClosed()` 为 `true`, 重复 `close()` 仍安全; `update`, `post`, `showSnackbar`, `on` 及原会话节点的业务操作会报 `SESSION_CLOSED`.
