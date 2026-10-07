# Compose 状态 (ComposeState)

ComposeState 由 [compose.state](compose#m-state) 创建, 在所属脚本线程保存一个值, 并记录渲染函数对该值的读取. 它不是 Android View, 也不是可跨脚本引擎共享的状态容器.

<p style="font: bold 2em sans-serif; color: #FF7043">ComposeState&lt;T&gt;</p>

## [@] ComposeState

不能直接用 `new` 创建. `compose.state(initialValue)` 必须传入一个初始值, 可以显式传入 `undefined` 或 `null`.

- <ins>**template**</ins> { [T](dataTypes#generic) } - 状态保存的值的类型.

## [p#] value

**`Getter/Setter`**

- { [T](dataTypes#generic) }

读取当前值或替换整个值. 读取和写入都必须在创建该状态的脚本线程执行; 工作线程应经 [compose.post](compose#m-post) 投递, 直接访问会抛出 `INVALID_ARGUMENT`.

渲染函数执行期间读取 `value` 会建立依赖. 写入不同的值只安排后续渲染, 不在赋值语句内部同步执行渲染函数. 同一轮调度之前的连续赋值会合并, 因而不保证每次赋值对应一帧.

值的比较规则如下:

| 值 | 是否视为未改变 |
| --- | --- |
| 普通字符串和布尔值 | 值相等. |
| 数字 | 按数值的双精度表示比较; 重复赋值 `NaN` 视为相同, `0` 和 `-0` 视为不同. |
| 对象, 数组, 函数及其他引用值 | 同一个引用. |

状态不深度代理对象, 也不复制初始值. 修改对象内部字段或数组内容不会自动触发渲染; 应重新赋予一个新的值或引用.

```js
'ui';

let state = compose.state({name: 'Alice'});
compose.mount(function () {
    return compose.Column({padding: 16},
        compose.Text({key: 'name', text: state.value.name}),
        compose.Button({key: 'change', onClick: function () {
            state.value = {name: 'Bob'};
        }}, 'Change'));
});
```

这里 `state.value.name = 'Bob'` 不会自动发出状态变化通知, 将同一对象重新赋给 `state.value` 也不会产生通知.

## 渲染依赖

`compose.mount`, `compose.attach`, `compose.floaty` 和 `compose.dialog` 只订阅各自渲染函数实际读取的状态. 在普通业务代码中读取 `value` 不会建立视图订阅. 同一状态可以被同一脚本中的多个会话读取, 状态变化会分别安排这些会话渲染.

每次成功渲染后, 依赖集合更新为本次实际读取的状态. 条件分支不再读取某个状态时, 后续对该状态的修改不会触发该分支所属会话渲染.

渲染异常时保留上一次有效界面, 并保留之前及此次尝试读取的依赖, 以便修正状态后再次渲染. 普通渲染异常被报告为 `RENDER_FAILED`; 已有的类型化错误保留其错误码. 参阅 [错误与异常](compose#错误与异常).

渲染函数应描述当前状态对应的节点树. 在渲染函数内修改其已读取的状态会再次安排渲染, 不应以这种方式形成循环更新. 渲染函数内调用 `compose.mount`, `compose.attach`, `compose.floaty` 或 `compose.dialog` 会被明确拒绝.

## 批处理与生命周期

[compose.batch](compose#m-batch) 可以合并多个状态赋值和节点更改. 其节点事务失败时会回滚节点更改, 但不会撤销已经完成的 `state.value` 赋值或普通 JavaScript 副作用.

关闭一个会话会移除该会话的渲染订阅, 不会单独销毁状态对象. 只要所属脚本仍在运行, 该状态仍可供业务代码或其他会话使用. 脚本结束后, 依赖和待执行渲染会被清理, 再访问已结束运行时中的状态会得到 `SESSION_CLOSED`.

ComposeState 没有公开的 `set`, `update`, `subscribe` 或 `dispose` 方法. 修改状态使用 `value` 属性, 会话清理由 [ComposeSession.close](composeSessionType#m-close) 管理.
