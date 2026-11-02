# ImGui 选择存储 (ImguiSelectionStorage)

<!-- runtime-support:begin ImguiSelectionStorage# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ImguiSelectionStorage` 对象 | - | - | - |
| 状态 | 已支持 6 项 | 不适用 6 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 6 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 6 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

ImguiSelectionStorage 保存一个列表选中的 ID, 内部是 JavaScript 的 `Set`, 对应 C++ 的 `ImGuiSelectionBasicStorage`. 由 [imgui.selectionStorage](imgui#m-selectionstorage) 创建, 不需要会话, 所以可以比窗口活得更久. 用法见 [beginMultiSelect](imgui#m-beginmultiselect). 类型声明中的名称是 `ImGui.SelectionStorage`.

范围按 ID 加 1 遍历, 所以 ID 要是显示顺序下连续的行索引. 排序或筛选之后要保留选择时, 先把索引换成自己的键; 删除行之后给 `endMultiSelect` 传 `true`, 忘记 Shift 的锚点. 范围选择按行占用一个 `Set` 条目, 在应用它的那一帧完成, 绘制可见行的开销与选中多少行无关.

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiSelectionStorage</p>

## [p#] size

**`READONLY`**

- { [number](dataTypes#number) }

选中的 ID 个数.

## [m#] apply

### selection.apply(requests, itemsCount?)

- **requests** { [ImguiMultiSelectIO](imguiMultiSelectIOType) | [SelectionRequest](imgui#selectionrequest)[] } - [ImguiMultiSelectIO](imguiMultiSelectIOType) 或 [SelectionRequest](imgui#selectionrequest) 的数组.
- **[ itemsCount ]** { [number](dataTypes#number) } - 总项数.
- <ins>**returns**</ins> { [ImguiSelectionStorage](imguiSelectionStorageType) } - 选择本身.

应用 `beginMultiSelect` 或 `endMultiSelect` 的结果, 或一个请求数组. 选中全部的 `setAll` 请求需要项数, 来自第一个参数或 `itemsCount`, 此时 ID 是 `0` 到 `itemsCount - 1`. 没有项数时抛出 RangeError.

## [m#] has

### selection.has(id)

- **id** { [number](dataTypes#number) } - 项的 ID.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

一个 ID 是否被选中.

## [m#] setItemSelected

### selection.setItemSelected(id, selected)

- **id** { [number](dataTypes#number) } - 项的 ID.
- **selected** { [boolean](dataTypes#boolean) } - 是否选中.
- <ins>**returns**</ins> { [ImguiSelectionStorage](imguiSelectionStorageType) }

由脚本选中或取消选中一个 ID.

## [m#] clear

### selection.clear()

- <ins>**returns**</ins> { [ImguiSelectionStorage](imguiSelectionStorageType) }

取消选中全部 ID.

## [m#] toArray

### selection.toArray()

- <ins>**returns**</ins> { [number](dataTypes#number)[] }

选中的 ID, 升序.
