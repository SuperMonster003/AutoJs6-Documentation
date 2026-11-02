# ImGui 对话框 (ImguiDialog)

<!-- runtime-support:begin ImguiDialog# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ImguiDialog` 对象 | - | - | - |
| 状态 | 已支持 19 项 | 不适用 19 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 19 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 19 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

ImguiDialog 是会话的模态对话框, 是 [imgui.alert](imgui#m-alert), [confirm](imgui#m-confirm), [singleChoice](imgui#m-singlechoice), [multiChoice](imgui#m-multichoice) 返回的 [ImguiDialogPromise](imguiDialogPromiseType) 的 `controller`. 继承 [ImguiComponent](imguiComponentType). 类型声明中的名称是 `ImGui.Dialog`.

```js
imgui.createWindow(function (ui) {
    ui.withWindow('对话框', null, 0, function () {
        if (ui.button('选择')) {
            imgui.singleChoice('颜色', ['红', '绿', '蓝'], 0).then(function (index) {
                console.log('选择了 ' + index);
            });
        }
    });
}, { width: 340, height: 300 });

let question = imgui.confirm('删除', '确定删除吗?', { okLabel: '删除', cancelLabel: '保留' });
question.then(function (accepted) {
    console.log(accepted ? '已删除' : '已保留');
});
setTimeout(function () {
    question.cancel();
}, 300);
```

## DialogOptions

`alert` 与 `confirm` 的选项, 也是选择对话框选项的基础. 尺寸单位 dp, 回调在脚本线程上运行.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `visible` | [boolean](dataTypes#boolean) | 初始是否显示, 默认 `true`. |
| `id` | [string](dataTypes#string) | 弹窗 ID 的一部分, 默认自动生成. |
| `title` | [string](dataTypes#string) | 标题栏文字, `title` 参数优先. |
| `message` | [string](dataTypes#string) | 按钮上方的文字, `message` 参数优先. |
| `width` | [number](dataTypes#number) | 宽度, 默认 320. |
| `flags` | [number](dataTypes#number) | 追加的 [WindowFlags](imgui#p-windowflags). |
| `okLabel` | [string](dataTypes#string) | 确定按钮的文字. |
| `cancelLabel` | [string](dataTypes#string) | 取消按钮的文字 (`confirm` 与选择对话框). |
| `onResult` | [Function](dataTypes#function) | Promise 解决之前以结果调用, `reason` 是 `accepted`, `cancelled` 或 `dismissed`. |
| `onClose` | [Function](dataTypes#function) | 对话框关闭时调用. |

## SingleChoiceOptions

`singleChoice` 的选项, 另外读取 [DialogOptions](#dialogoptions).

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `selected` | [number](dataTypes#number) | 初始选中的索引, `-1` 表示没有 (默认), `selected` 参数优先. |
| `autoAccept` | [boolean](dataTypes#boolean) | 点按一行时立即确定, 默认 `false`. |
| `onChoice` | [Function](dataTypes#function) | 点按一行时调用, 参数为 `(index, item, dialog)`. |

## MultiChoiceOptions

`multiChoice` 的选项, 另外读取 [DialogOptions](#dialogoptions).

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `selected` | [number](dataTypes#number)[] 或 [boolean](dataTypes#boolean)[] | 初始选中的索引, 或每项一个布尔值, `selected` 参数优先. |
| `onChoice` | [Function](dataTypes#function) | 切换一行时调用, 参数为 `(index, checked, item, dialog)`. |

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiDialog</p>

## [p#] dialogType

**`READONLY`**

- { `"alert"` | `"confirm"` | `"singleChoice"` | `"multiChoice"` }

打开它的函数.

## [p#] title

- { [string](dataTypes#string) }

标题栏文字.

## [p#] message

- { [string](dataTypes#string) }

按钮上方的文字.

## [p#] open

- { [ValueRef](imgui#valueref) }

关闭按钮: 变为 `false` 时以取消值关闭对话框.

## [p#] promise

**`READONLY`**

- { [ImguiDialogPromise](imguiDialogPromiseType) }

结果的 Promise.

## [p#] cancelValue

**`READONLY`**

- { [any](dataTypes#any) }

取消或被关闭时的结果.

## [m#] cancel

### dialog.cancel()

- <ins>**returns**</ins> { [ImguiDialog](imguiDialogType) }

以取消值关闭, 在下一帧, 或在帧内立即关闭.

## [m#] accept

### dialog.accept()

- <ins>**returns**</ins> { [ImguiDialog](imguiDialogType) }

与确定按钮一样关闭.

## [p#] type

**`READONLY`**

- { [string](dataTypes#string) }

组件类型, 这里是 `dialog`.

## [p#] id

**`READONLY`**

- { [string](dataTypes#string) }

组件 ID.

## [p#] session

**`READONLY`**

- { [ImguiSession](imguiSessionType) }

组件所属的会话.

## [p#] options

**`READONLY`**

- { [Object](dataTypes#object) }

创建时的选项.

## [p#] visible

- { [boolean](dataTypes#boolean) }

是否绘制, 参阅 [ImguiComponent](imguiComponentType#p-visible).

## [p#] closed

**`READONLY`**

- { [boolean](dataTypes#boolean) }

是否已关闭.

## [p#] closeReason

**`READONLY`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

关闭原因, 打开期间为 `null`.

## [m#] show

### dialog.show()

- <ins>**returns**</ins> { [ImguiDialog](imguiDialogType) }

重新开始绘制.

## [m#] hide

### dialog.hide()

- <ins>**returns**</ins> { [ImguiDialog](imguiDialogType) }

停止绘制, 保留组件.

## [m#] toggle

### dialog.toggle()

- <ins>**returns**</ins> { [ImguiDialog](imguiDialogType) }

在 `show` 与 `hide` 之间切换.

## [m#] close

### dialog.close(reason?)

- **[ reason ]** { [string](dataTypes#string) } - 写入 `closeReason` 的原因.
- <ins>**returns**</ins> { [ImguiDialog](imguiDialogType) }

把组件从会话移除.
