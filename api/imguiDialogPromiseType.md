# ImGui 对话框 Promise (ImguiDialogPromise)

<!-- runtime-support:begin ImguiDialogPromise# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ImguiDialogPromise` 对象 | - | - | - |
| 状态 | 已支持 3 项 | 不适用 3 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 3 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 3 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

ImguiDialogPromise 是 [imgui.alert](imgui#m-alert), [confirm](imgui#m-confirm), [singleChoice](imgui#m-singlechoice), [multiChoice](imgui#m-multichoice) 与 [ImguiSession](imguiSessionType) 同名方法的返回值. 它是普通的 Promise, 另有下列成员. 结果在关闭对话框的那一帧内, 在脚本线程上解决. 类型声明中的名称是 `ImGui.DialogPromise`.

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiDialogPromise</p>

## [p#] controller

**`READONLY`**

- { [ImguiDialog](imguiDialogType) }

对话框 [ImguiDialog](imguiDialogType).

## [m#] cancel

### promise.cancel()

- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

以取消值关闭对话框.

## [m#] accept

### promise.accept()

- <ins>**returns**</ins> { [ImguiDialogPromise](imguiDialogPromiseType) }

与确定按钮一样关闭对话框.
