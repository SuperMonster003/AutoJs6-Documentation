# ImGui 多选结果 (ImguiMultiSelectIO)

<!-- runtime-support:begin ImguiMultiSelectIO# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ImguiMultiSelectIO` 对象 | - | - | - |
| 状态 | 已支持 5 项 | 不适用 5 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 5 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 5 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

ImguiMultiSelectIO 是 [beginMultiSelect](imgui#m-beginmultiselect) 与 [endMultiSelect](imgui#m-endmultiselect) 返回的副本, 对应 C++ 的 `ImGuiMultiSelectIO`. 两个结果都要应用: `beginMultiSelect` 带来全选和清空, `endMultiSelect` 带来行上报的变化. 类型声明中的名称是 `ImGui.MultiSelectIO`.

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiMultiSelectIO</p>

## [p#] requests

**`READONLY`**

- { [SelectionRequest](imgui#selectionrequest)[] }

按顺序应用到选择上的请求, 参阅 [SelectionRequest](imgui#selectionrequest). `beginMultiSelect` 的结果中只有 `setAll`.

## [p#] rangeSrcItem

**`READONLY`**

- { [number](dataTypes#number) }

Shift 范围的锚点, 没有时为 `-1`. 配合 `listClipper` 时这一行必须保持提交, 放进 `includeItems`.

## [p#] navIdItem

**`READONLY`**

- { [number](dataTypes#number) }

有焦点的项的 ID (如果提交过), 没有时为 `-1`. 同样放进 `includeItems`.

## [p#] navIdSelected

**`READONLY`**

- { [boolean](dataTypes#boolean) }

有焦点的项是否被选中.

## [p#] itemsCount

**`READONLY`**

- { [number](dataTypes#number) }

传给 `beginMultiSelect` 的 `itemsCount`, 省略时为 `-1`.
