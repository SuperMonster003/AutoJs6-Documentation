# ImGui 高层组件 (ImguiComponent)

<!-- runtime-support:begin ImguiComponent# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ImguiComponent` 对象 | - | - | - |
| 状态 | 已支持 11 项 | 不适用 11 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 11 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 11 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

ImguiComponent 是高层组件的共同成员, 这些组件由会话托管, 在帧内绘制, 位于渲染回调之后. 具体的组件是 [ImguiLogWindow](imguiLogWindowType), [ImguiToast](imguiToastType), [ImguiStatsOverlay](imguiStatsOverlayType), [ImguiDataTable](imguiDataTableType) 与 [ImguiDialog](imguiDialogType). 类型声明中的名称是 `ImGui.Component`.

## ComponentOptions

每种组件都读取的选项.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `visible` | [boolean](dataTypes#boolean) | 初始是否显示, 默认 `true`. |

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiComponent</p>

## [p#] type

**`READONLY`**

- { [string](dataTypes#string) }

组件类型: `logWindow`, `toast`, `dialog`, `statsOverlay` 或 `dataTable`.

## [p#] id

**`READONLY`**

- { [string](dataTypes#string) }

组件 ID, 在同类组件中唯一.

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

是否绘制. 赋值等同 [show](#m-show) 与 [hide](#m-hide).

## [p#] closed

**`READONLY`**

- { [boolean](dataTypes#boolean) }

是否已关闭.

## [p#] closeReason

**`READONLY`**

- { [string](dataTypes#string) | [null](dataTypes#null) }

传给 [close](#m-close) 的原因, 打开期间为 `null`.

## [m#] show

### component.show()

- <ins>**returns**</ins> { [ImguiComponent](imguiComponentType) }

重新开始绘制.

## [m#] hide

### component.hide()

- <ins>**returns**</ins> { [ImguiComponent](imguiComponentType) }

停止绘制, 保留组件.

## [m#] toggle

### component.toggle()

- <ins>**returns**</ins> { [ImguiComponent](imguiComponentType) }

在 `show` 与 `hide` 之间切换.

## [m#] close

### component.close(reason?)

- **[ reason ]** { [string](dataTypes#string) } - 写入 `closeReason` 的原因.
- <ins>**returns**</ins> { [ImguiComponent](imguiComponentType) }

把组件从会话移除.
