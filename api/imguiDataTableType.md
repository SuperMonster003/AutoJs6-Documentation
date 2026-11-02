# ImGui 数据表格 (ImguiDataTable)

<!-- runtime-support:begin ImguiDataTable# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ImguiDataTable` 对象 | - | - | - |
| 状态 | 已支持 31 项 | 不适用 31 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 31 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 31 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

ImguiDataTable 是带表格的窗口, 提供行选择, 增删改工具栏和列排序, 由 [imgui.dataTable](imgui#m-datatable) 或 [session.dataTable](imguiSessionType#m-datatable) 返回. 继承 [ImguiComponent](imguiComponentType). 类型声明中的名称是 `ImGui.DataTable`. 修改行时用方法, 不要直接改数组. 内置示例 `data-table-demo` 演示它的用法.

```js
imgui.createWindow(function (ui) {
    ui.withWindow('控制', null, 0, function () {
        ui.text('行在表格窗口中操作');
    });
}, { width: 400, height: 400 });

let nextId = 3;
let table = imgui.dataTable('tasks', [
    { label: '名称', key: 'name' },
    { label: '进度', key: 'progress' },
], [
    { id: 1, name: '下载', progress: 30 },
    { id: 2, name: '上传', progress: 80 },
], {
    title: '任务',
    sortable: true,
    onAdd: function () {
        nextId += 1;
        return { id: nextId, name: '新任务', progress: 0 };
    },
    onRowClick: function (row) {
        console.log('点按 ' + row.name);
    },
});
table.updateRow(2, { progress: 100 });
```

## RowKey

行的键: 字符串或数字, 由 `rowKey` 选项给出.

## DataTableHeader

表格的一列. 也可以直接写字符串, 同时作为 `label` 和 `key`.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `label` | [string](dataTypes#string) | 列标题, 默认为 `key`. |
| `key` | [string](dataTypes#string) 或 [number](dataTypes#number) | 对象行的字段名. 数组行默认为列索引. |
| `width` | [number](dataTypes#number) | 列的固定宽度或权重, 与 `tableSetupColumn` 相同. |
| `weight` | [number](dataTypes#number) | 没有 `width` 时使用. |
| `flags` | [number](dataTypes#number) | [TableColumnFlags](imgui#p-tablecolumnflags) 的组合. |
| `render` | [Function](dataTypes#function) | 绘制这一列的单元格, 代替文本, 在脚本线程的帧内运行. `value` 是原始单元格. 行可选择时第一列不调用, 那一列的文字是行的可选标签. |
| `compare` | [Function](dataTypes#function) | 可排序表格中比较这一列的两个单元格, 返回值与 `Array.sort` 相同. 默认数字按值比较, 其他值按字符串比较, 空单元格总在最后. |

## DataTableOptions

[dataTable](imgui#m-datatable) 的选项. 尺寸单位 dp (另有说明的除外), 回调在脚本线程上运行.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `visible` | [boolean](dataTypes#boolean) | 初始是否显示, 默认 `true`. |
| `title` | [string](dataTypes#string) | 窗口标题, 默认为 ID. |
| `open` | [boolean](dataTypes#boolean) | 窗口初始是否打开, 默认 `true`. |
| `multiSelect` | [boolean](dataTypes#boolean) | 点按另一行时保留选择, 默认 `false`. |
| `tableFlags` | [number](dataTypes#number) | [TableFlags](imgui#p-tableflags), 代替默认的 `Resizable`, `RowBg`, `Borders`, `ScrollY` 组合. |
| `sortable` | [boolean](dataTypes#boolean) | 加上 `TableFlags.Sortable`: 点列标题按这一列排序, 排序是稳定的. `tableFlags` 中的 `SortMulti`, `SortTristate` 与列 `flags` 中的 `DefaultSort`, `NoSort`, `PreferSortDescending` 有效. 新增或修改的行在下一帧重新排序, `onRowsChanged` 收到动作 `sort`. |
| `rowKey` | [string](dataTypes#string) 或 [Function](dataTypes#function) | 识别行, 用于 `updateRow` 等的目标: 字段名或函数, 默认 `row.id`. |
| `tableHeight` | [number](dataTypes#number) | 表格高度, `0` 填满窗口 (默认). |
| `rowHeight` | [number](dataTypes#number) | 最小行高, 单位 px, 默认 0. |
| `selectable` | [boolean](dataTypes#boolean) | 行是否可以通过第一列选择, 默认 `true`. |
| `selectableFlags` | [number](dataTypes#number) | 第一列追加的 [SelectableFlags](imgui#p-selectableflags). |
| `toolbar` | [boolean](dataTypes#boolean) | 是否显示添加 / 移除 / 清空工具栏, 默认 `true`. |
| `labels` | [Object](dataTypes#object) | 工具栏按钮的文字. |
| `freezeHeader` | [boolean](dataTypes#boolean) | 标题行是否保持可见, 默认 `true`. |
| `showHeaders` | [boolean](dataTypes#boolean) | 是否显示标题行, 默认 `true`. |
| `emptyText` | [string](dataTypes#string) | 没有行时显示的文字, 默认 `No rows`. |
| `position` | [ToastPosition](imgui#p-toastposition) | 首次位置的锚点. 省略时由 Dear ImGui 放置. |
| `margin` | [number](dataTypes#number) | 与锚点的距离, 默认 12. |
| `width` | [number](dataTypes#number) | 窗口首次宽度, 默认 520. |
| `height` | [number](dataTypes#number) | 窗口首次高度, 默认 340. |
| `flags` | [number](dataTypes#number) | [WindowFlags](imgui#p-windowflags) 的组合. |
| `formatCell` | [Function](dataTypes#function) | 把单元格转为文本, `null` 和 `undefined` 不显示. |
| `renderCell` | [Function](dataTypes#function) | 在 `formatCell` 之后绘制单元格, 用于没有 `render` 的列. 绘制了单元格时返回 `true`. |
| `onAdd` | [Function](dataTypes#function) | 添加按钮: 返回新行, 返回 `false` 或 `undefined` 时不添加. |
| `createRow` | [Function](dataTypes#function) | 没有 `onAdd` 时为添加按钮生成一行. |
| `onEdit` | [Function](dataTypes#function) | 为单个选中行增加编辑按钮: 返回传给 `updateRow` 的修改, 返回 `false` 或 `undefined` 时不修改. |
| `onRowClick` | [Function](dataTypes#function) | 点按一行时调用. |
| `onRowDoubleClick` | [Function](dataTypes#function) | 双击一行时调用. |
| `onRowsChanged` | [Function](dataTypes#function) | 行改变之后调用, 参数为 `(rows, action, row, index, table)`. `rows` 是副本; `action` 是 `set`, `add`, `update`, `remove`, `removeSelected`, `clear` 或 `sort`; `row` 是相关的行, `removeSelected` 时是移除的行, 其他动作为 `null`; `index` 是它的索引, 没有时为 -1. |
| `onSelectionChanged` | [Function](dataTypes#function) | 选择改变之后调用. |
| `onClose` | [Function](dataTypes#function) | 关闭时调用. |

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiDataTable</p>

## [p#] headers

- { [DataTableHeader](imguiDataTableType#datatableheader)[] }

列定义.

## [p#] rows

- { [any](dataTypes#any)[] }

按显示顺序的行.

## [p#] open

- { [ValueRef](imgui#valueref) }

窗口的关闭按钮: 变为 `false` 时组件在下一帧关闭.

## [p#] multiSelect

- { [boolean](dataTypes#boolean) }

点按一行时是否保留其他行的选择.

## [p#] sortable

**`READONLY`**

- { [boolean](dataTypes#boolean) }

点列标题是否排序.

## [m#] setRows

### table.setRows(rows)

- **rows** { [any](dataTypes#any)[] } - 新的行.
- <ins>**returns**</ins> { [ImguiDataTable](imguiDataTableType) }

替换全部行并清空选择.

## [m#] getRows

### table.getRows()

- <ins>**returns**</ins> { [any](dataTypes#any)[] }

行的副本.

## [m#] addRow

### table.addRow(row, index?)

- **row** { [any](dataTypes#any) } - 新的行.
- **[ index ]** { [number](dataTypes#number) } - 位置.
- <ins>**returns**</ins> { [number](dataTypes#number) } - 新行的索引.

在 `index` 处添加一行, 默认在末尾.

## [m#] updateRow

### table.updateRow(target, update)

- **target** { [number](dataTypes#number) | [RowKey](imguiDataTableType#rowkey) | [any](dataTypes#any) } - 目标: 索引, 行或键.
- **update** { [any](dataTypes#any) | [Object](dataTypes#object) | [Function](dataTypes#function) } - 新的行, 部分字段或函数.
- <ins>**returns**</ins> { [any](dataTypes#any) | [null](dataTypes#null) } - 修改后的行, 没有这一行时为 `null`.

修改一行. 对象合并到对象行; 函数返回新行或修改.

## [m#] removeRow

### table.removeRow(target)

- **target** { [number](dataTypes#number) | [RowKey](imguiDataTableType#rowkey) | [any](dataTypes#any) } - 目标: 行索引, 行对象或行键.
- <ins>**returns**</ins> { [any](dataTypes#any) | [null](dataTypes#null) } - 移除的行, 没有时为 `null`.

移除一行.

## [m#] deleteRow

### table.deleteRow(target)

- **target** { [number](dataTypes#number) | [RowKey](imguiDataTableType#rowkey) | [any](dataTypes#any) } - 目标: 行索引, 行对象或行键.
- <ins>**returns**</ins> { [any](dataTypes#any) | [null](dataTypes#null) } - 移除的行, 没有时为 `null`.

与 [removeRow](#m-removerow) 相同.

## [m#] clearRows

### table.clearRows()

- <ins>**returns**</ins> { [ImguiDataTable](imguiDataTableType) }

移除全部行.

## [m#] clear

### table.clear()

- <ins>**returns**</ins> { [ImguiDataTable](imguiDataTableType) }

与 [clearRows](#m-clearrows) 相同.

## [m#] isSelected

### table.isSelected(target)

- **target** { [number](dataTypes#number) | [RowKey](imguiDataTableType#rowkey) | [any](dataTypes#any) } - 目标: 行索引, 行对象或行键.
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

一行是否被选中.

## [m#] selectRow

### table.selectRow(target, selected?)

- **target** { [number](dataTypes#number) | [RowKey](imguiDataTableType#rowkey) | [any](dataTypes#any) } - 目标: 行索引, 行对象或行键.
- **[ selected ]** { [boolean](dataTypes#boolean) } - 是否选中.
- <ins>**returns**</ins> { [ImguiDataTable](imguiDataTableType) }

选中或取消选中一行. 没有第二个参数时切换.

## [m#] clearSelection

### table.clearSelection()

- <ins>**returns**</ins> { [ImguiDataTable](imguiDataTableType) }

取消选中全部行.

## [m#] selectedIndices

### table.selectedIndices()

- <ins>**returns**</ins> { [number](dataTypes#number)[] }

选中行的索引, 升序.

## [m#] selectedRows

### table.selectedRows()

- <ins>**returns**</ins> { [any](dataTypes#any)[] }

选中的行.

## [m#] removeSelected

### table.removeSelected()

- <ins>**returns**</ins> { [any](dataTypes#any)[] } - 移除的行.

移除选中的行.

## [m#] renderTable

### table.renderTable()

- <ins>**returns**</ins> { [ImguiDataTable](imguiDataTableType) }

在帧内的当前窗口中绘制工具栏和表格.

## [p#] type

**`READONLY`**

- { [string](dataTypes#string) }

组件类型, 这里是 `dataTable`.

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

### table.show()

- <ins>**returns**</ins> { [ImguiDataTable](imguiDataTableType) }

重新开始绘制.

## [m#] hide

### table.hide()

- <ins>**returns**</ins> { [ImguiDataTable](imguiDataTableType) }

停止绘制, 保留组件.

## [m#] toggle

### table.toggle()

- <ins>**returns**</ins> { [ImguiDataTable](imguiDataTableType) }

在 `show` 与 `hide` 之间切换.

## [m#] close

### table.close(reason?)

- **[ reason ]** { [string](dataTypes#string) } - 写入 `closeReason` 的原因.
- <ins>**returns**</ins> { [ImguiDataTable](imguiDataTableType) }

把组件从会话移除.
