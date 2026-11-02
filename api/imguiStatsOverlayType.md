# ImGui 帧率覆盖层 (ImguiStatsOverlay)

<!-- runtime-support:begin ImguiStatsOverlay# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ImguiStatsOverlay` 对象 | - | - | - |
| 状态 | 已支持 17 项 | 不适用 17 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 17 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 17 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

ImguiStatsOverlay 显示帧率, 帧耗时和每帧工作耗时, 超过阈值时变色, 由 [imgui.statsOverlay](imgui#m-statsoverlay) 或 [session.statsOverlay](imguiSessionType#m-statsoverlay) 返回. 继承 [ImguiComponent](imguiComponentType). 类型声明中的名称是 `ImGui.StatsOverlay`.

## StatsOverlayOptions

[statsOverlay](imgui#m-statsoverlay) 的选项. 尺寸单位 dp, 时间单位 ms.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `visible` | [boolean](dataTypes#boolean) | 初始是否显示, 默认 `true`. |
| `id` | [string](dataTypes#string) | 使用已有的 ID 时返回已有的覆盖层, 默认 `default`. |
| `position` | [ToastPosition](imgui#p-toastposition) | 锚点, 默认 `top-left`. |
| `margin` | [number](dataTypes#number) | 与锚点的距离, 默认 12. |
| `backgroundAlpha` | [number](dataTypes#number) | 背景不透明度, `0..1`, 默认 0.78. |
| `interactive` | [boolean](dataTypes#boolean) | 是否接收触摸, 默认 `false`. |
| `flags` | [number](dataTypes#number) | 追加的 [WindowFlags](imgui#p-windowflags). |
| `warningMs` | [number](dataTypes#number) | 帧间隔达到这个值时文字变为橙色, 默认 16.7. |
| `criticalMs` | [number](dataTypes#number) | 帧间隔达到这个值时文字变为红色, 默认 33.3. |
| `historySize` | [number](dataTypes#number) | 用于绘图的帧间隔个数, 至少 10, 默认 120. |
| `showPlot` | [boolean](dataTypes#boolean) | 是否显示图, 默认 `true`. |
| `overlay` | [string](dataTypes#string) | 图上的文字, 默认 `Frame time`. |
| `scaleMax` | [number](dataTypes#number) | 图的上界, 单位 ms, 至少为 `criticalMs` 的 1.5 倍. |
| `plotWidth` | [number](dataTypes#number) | 图的宽度, 默认 190. |
| `plotHeight` | [number](dataTypes#number) | 图的高度, 默认 48. |
| `onClose` | [Function](dataTypes#function) | 关闭时调用. |

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiStatsOverlay</p>

## [p#] frameTimes

**`READONLY`**

- { [number](dataTypes#number)[] }

最近的帧间隔, 单位 ms, 最旧的在前.

## [p#] historySize

**`READONLY`**

- { [number](dataTypes#number) }

保留的帧间隔个数.

## [p#] fps

**`READONLY`**

- { [number](dataTypes#number) }

每秒帧数, Dear ImGui 的滑动平均值.

## [p#] frameTime

**`READONLY`**

- { [number](dataTypes#number) }

最后两帧的间隔, 单位 ms.

## [p#] workTime

**`READONLY`**

- { [number](dataTypes#number) }

上一帧在渲染回调和组件中花费的时间, 单位 ms, 不含显示.

## [m#] snapshot

### overlay.snapshot()

- <ins>**returns**</ins> { [Object](dataTypes#object) }

读数的副本, 包含 `fps`, `frameTime`, `workTime` 与 `history` (`frameTimes` 的副本).

## [p#] type

**`READONLY`**

- { [string](dataTypes#string) }

组件类型, 这里是 `statsOverlay`.

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

### overlay.show()

- <ins>**returns**</ins> { [ImguiStatsOverlay](imguiStatsOverlayType) }

重新开始绘制.

## [m#] hide

### overlay.hide()

- <ins>**returns**</ins> { [ImguiStatsOverlay](imguiStatsOverlayType) }

停止绘制, 保留组件.

## [m#] toggle

### overlay.toggle()

- <ins>**returns**</ins> { [ImguiStatsOverlay](imguiStatsOverlayType) }

在 `show` 与 `hide` 之间切换.

## [m#] close

### overlay.close(reason?)

- **[ reason ]** { [string](dataTypes#string) } - 写入 `closeReason` 的原因.
- <ins>**returns**</ins> { [ImguiStatsOverlay](imguiStatsOverlayType) }

把组件从会话移除.
