# 续体 (Continuation)

<!-- runtime-support:begin continuation -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `continuation` | `autojs6:continuation` | `autojs6:continuation` | `host.continuation` |
| 状态 | 已支持 4 项 | 已支持 (本地实现) 4 项 | 已支持 (本地实现) 4 项 | 已支持 (本地实现) 4 项 |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

返回对象 (1 个): 本页说明的对象的成员状态, 每个对象一行.

| 返回对象 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| `ContinuationCreator` (3 项) | 已支持 3 项 | 不适用 3 项 (需要 Java 对象) | 不适用 3 项 (需要 Java 对象) | 不适用 3 项 (需要 Java 对象) |

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

`continuation` 模块用于捕获和恢复 Rhino 脚本执行状态.

此模块仅在脚本项目配置的 `useFeatures` 数组包含 `"continuation"` 时可用:

```json
{
  "scripts": {},
  "useFeatures": [ "continuation" ]
}
```

挂起 (调用 [await](#m-await), 以及基于它的 `promise.await()`, `continuation.await(promise)` 与 `continuation.delay(millis)`) 可以发生在以下位置:

- 脚本主体代码, 包括协程恢复后继续执行的代码.
- 在脚本线程上派发, 且派发时没有脚本代码正在执行的事件监听器, 即注册到未关联线程的 EventEmitter 上的监听器. UI 模式下由主线程派发的 Activity 事件 (`ui.emitter`, 如 `back_pressed`), 控件事件 (如 `click`) 与对话框事件均属此类. 监听器挂起后, 同一事件的其他监听器照常执行, 挂起的监听器在恢复后继续; 挂起前对事件对象的修改 (如 `e.consumed = true`) 即时生效.

定时器回调 (`setTimeout` / `setInterval` / `setImmediate`) 与关联了线程的 EventEmitter 的监听器 (经定时器派发), 其他线程 (如 `threads.start`) 中的代码, 以及由脚本代码同步触发的监听器中不能挂起, 调用 [await](#m-await) 将抛出异常; 这些位置可改用 `promise.then(...)`.

`promise.await()`, `continuation.await(promise)` 与 Flow 的 `await()` 遇到拒绝时同样在调用处抛出拒绝原因, 可用 `try` / `catch` 捕获, 未捕获时脚本以该错误结束.

async 函数内与 Promise 回调内不能挂起, 改用 `await` 关键字或 `then`, 两种写法如何配合见 [async/await 与 continuation](asyncAwait).

```js
'ui';

ui.layout(<frame><text text="协程" /></frame>);

ui.emitter.on('back_pressed', function (e) {
    e.consumed = true;
    if (dialogs.confirm('确定要退出程序').await()) {
        ui.finish();
    }
});
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">continuation</p>

---

## [p] enabled

**`Getter`** **`READONLY`**

- { [boolean](dataTypes#boolean) }

当前脚本引擎是否启用了 `continuation` 特性.

---

## [m] create

### create(scope?)

- **[ scope ]** { [Object](dataTypes#object) } - 捕获续体时使用的 Rhino 作用域
- <ins>**returns**</ins> { [ContinuationCreator](#continuationcreator) } - 续体控制对象

创建续体控制对象. 省略 **scope** 时使用当前脚本作用域.

未启用 `continuation` 特性时, 调用返回对象的 [await](#m-await) 将抛出异常.

---

## ContinuationCreator

`continuation.create()` 返回的续体控制对象.

### [m] await

#### await()

- <ins>**returns**</ins> { [any](dataTypes#any) } - 恢复续体时提供的结果

挂起当前执行并等待 [resume](#m-resume) 或 [resumeError](#m-resumeerror) 恢复. 以 [resumeError](#m-resumeerror) 恢复时在此调用处抛出错误.

### [m] resume

#### resume(result?)

- **[ result ]** { [any](dataTypes#any) } - 恢复结果, 默认为 `undefined`
- <ins>**returns**</ins> { [void](dataTypes#void) }

成功恢复续体. **result** 将成为 [await](#m-await) 的返回值.

### [m] resumeError

#### resumeError(error)

- **error** { [any](dataTypes#any) } - 非 `null` 且非 `undefined` 的失败结果
- <ins>**returns**</ins> { [void](dataTypes#void) }

以失败结果恢复续体. **error** 在 [await](#m-await) 的调用处抛出, 可用 `try` / `catch` 捕获, 未捕获时脚本以该错误结束.
