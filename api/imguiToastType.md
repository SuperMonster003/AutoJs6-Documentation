# ImGui 短消息 (ImguiToast)

<!-- runtime-support:begin ImguiToast# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ImguiToast` 对象 | - | - | - |
| 状态 | 已支持 18 项 | 不适用 18 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 18 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 18 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

ImguiToast 是窗口上方的短消息, 按等级着色, 到期自动消失, 由 [imgui.toast](imgui#m-toast) 或 [session.toast](imguiSessionType#m-toast) 返回. 继承 [ImguiComponent](imguiComponentType). 类型声明中的名称是 `ImGui.Toast`. 它在 ImGui 窗口内绘制, 与 AutoJs6 的 [toast](toast) 模块无关.

## ToastOptions

[toast](imgui#m-toast) 的选项. 尺寸单位 dp, 时长单位 ms, 回调在脚本线程上运行.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `visible` | [boolean](dataTypes#boolean) | 初始是否显示, 默认 `true`. |
| `id` | [string](dataTypes#string) | 使用已显示消息的 ID 时更新那条消息, 默认自动生成. |
| `duration` | [number](dataTypes#number) | 显示时长, 默认 2500, `0` 表示一直显示到关闭. `duration` 参数优先. |
| `level` | [LogLevel](imgui#p-loglevel) 或 [string](dataTypes#string) | 等级, 决定文字颜色, 默认 `info`. |
| `type` | [LogLevel](imgui#p-loglevel) 或 [string](dataTypes#string) | `level` 的别名. |
| `position` | [ToastPosition](imgui#p-toastposition) | 锚点, 默认 `top-right`. |
| `color` | [Color](imgui#color) | 文字颜色, 代替等级的颜色. |
| `fadeDuration` | [number](dataTypes#number) | 淡出时长, 默认 250. |
| `margin` | [number](dataTypes#number) | 与锚点的距离, 默认 12. |
| `stackStep` | [number](dataTypes#number) | 堆叠的消息之间的距离, 默认 54. |
| `backgroundAlpha` | [number](dataTypes#number) | 背景不透明度, `0..1`, 默认 0.92. |
| `interactive` | [boolean](dataTypes#boolean) | 是否接收触摸, 默认 `false`. |
| `showLevel` | [boolean](dataTypes#boolean) | 文本开头是否显示等级, 默认 `false`. |
| `flags` | [number](dataTypes#number) | 追加的 [WindowFlags](imgui#p-windowflags). |
| `onClose` | [Function](dataTypes#function) | 关闭时调用, `reason` 是 `expired` 或传给 `close` 的原因. |

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiToast</p>

## [p#] text

**`READONLY`**

- { [string](dataTypes#string) }

显示的文字.

## [p#] level

**`READONLY`**

- { [LogLevel](imgui#p-loglevel) }

等级.

## [p#] position

**`READONLY`**

- { [ToastPosition](imgui#p-toastposition) }

锚点.

## [p#] createdAt

**`READONLY`**

- { [number](dataTypes#number) }

创建或最后更新时的 `Date.now()`.

## [p#] duration

**`READONLY`**

- { [number](dataTypes#number) }

显示时长, 单位 ms, `0` 表示一直显示到关闭.

## [p#] expiresAt

**`READONLY`**

- { [number](dataTypes#number) }

到期时刻的 `Date.now()` 值, 时长为 0 时是 `Infinity`.

## [m#] update

### toast.update(text, duration?, options?)

- **text** { [any](dataTypes#any) } - 新的文字.
- **[ duration ]** { [number](dataTypes#number) } - 显示时长, 单位 ms.
- **[ options ]** { [ToastOptions](imguiToastType#toastoptions) } - 选项.
- <ins>**returns**</ins> { [ImguiToast](imguiToastType) }

改变文字, 并重新显示完整的时长.

## [p#] type

**`READONLY`**

- { [string](dataTypes#string) }

组件类型, 这里是 `toast`.

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

### toast.show()

- <ins>**returns**</ins> { [ImguiToast](imguiToastType) }

重新开始绘制.

## [m#] hide

### toast.hide()

- <ins>**returns**</ins> { [ImguiToast](imguiToastType) }

停止绘制, 保留组件.

## [m#] toggle

### toast.toggle()

- <ins>**returns**</ins> { [ImguiToast](imguiToastType) }

在 `show` 与 `hide` 之间切换.

## [m#] close

### toast.close(reason?)

- **[ reason ]** { [string](dataTypes#string) } - 写入 `closeReason` 的原因.
- <ins>**returns**</ins> { [ImguiToast](imguiToastType) }

把组件从会话移除.
