# ImGui 日志窗口 (ImguiLogWindow)

<!-- runtime-support:begin ImguiLogWindow# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ImguiLogWindow` 对象 | - | - | - |
| 状态 | 已支持 26 项 | 不适用 26 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 26 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 26 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

ImguiLogWindow 是显示日志行的窗口, 带等级着色, 清空, 导出和自动滚底, 由 [imgui.logWindow](imgui#m-logwindow) 或 [session.logWindow](imguiSessionType#m-logwindow) 返回. 继承 [ImguiComponent](imguiComponentType). 类型声明中的名称是 `ImGui.LogWindow`. 内置示例 `log-hud` 演示它的用法.

```js
imgui.createWindow(function (ui) {
    ui.withWindow('控制', null, 0, function () {
        if (ui.button('清空日志')) {
            imgui.logWindow('events').clear();
        }
    });
}, { width: 400, height: 360 });

let log = imgui.logWindow('events', {
    title: '事件',
    maxEntries: 200,
    position: imgui.ToastPosition.BottomLeft,
    onExport: function (text) {
        console.log(text);
    },
});
log.info('启动');
log.warn('磁盘空间不足');
log.append('debug', '详情');
```

## LogEntry

日志窗口的一行.

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `timestamp` | [number](dataTypes#number) | 添加时的 `Date.now()`. |
| `level` | [LogLevel](imgui#p-loglevel) | 等级. |
| `text` | [string](dataTypes#string) | 文本. |

## LogWindowOptions

[logWindow](imgui#m-logwindow) 的选项. 尺寸单位 dp, 回调在脚本线程上运行. 另外读取 [ComponentOptions](imguiComponentType#componentoptions).

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `title` | [string](dataTypes#string) | 窗口标题, 默认为 ID. |
| `open` | [boolean](dataTypes#boolean) | 窗口初始是否打开, 默认 `true`. |
| `autoScroll` | [boolean](dataTypes#boolean) | 是否滚动到新条目, 默认 `true`. |
| `maxEntries` | [number](dataTypes#number) | 保留的条目数, 至少 1, 默认 1000, 最旧的先移除. |
| `entries` | ([any](dataTypes#any) 或 [Object](dataTypes#object))[] | 初始条目: 文本, 或 `{ level, text }`. |
| `position` | [ToastPosition](imgui#p-toastposition) | 首次位置的锚点. 省略时由 Dear ImGui 放置. |
| `margin` | [number](dataTypes#number) | 与锚点的距离, 单位 dp, 默认 12. |
| `width` | [number](dataTypes#number) | 首次宽度, 单位 dp, 默认 380. |
| `height` | [number](dataTypes#number) | 首次高度, 单位 dp, 默认 260. |
| `flags` | [number](dataTypes#number) | [WindowFlags](imgui#p-windowflags) 的组合. |
| `clearLabel` | [string](dataTypes#string) | 清空按钮的文字. |
| `exportLabel` | [string](dataTypes#string) | 导出按钮的文字. |
| `onAppend` | [Function](dataTypes#function) | 每个新条目之后调用. |
| `onClear` | [Function](dataTypes#function) | 清空之后调用. |
| `onExport` | [Function](dataTypes#function) | 由导出按钮和 `export()` 调用, 参数为 `exportText()` 的文本和条目的副本. |
| `onClose` | [Function](dataTypes#function) | 关闭时调用. |

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiLogWindow</p>

## [p#] entries

- { [LogEntry](imguiLogWindowType#logentry)[] }

条目, 最旧的在前.

## [p#] autoScroll

- { [boolean](dataTypes#boolean) }

新条目是否滚动到可见.

## [p#] maxEntries

- { [number](dataTypes#number) }

保留的条目数, 从下一个条目起生效.

## [p#] open

- { [ValueRef](imgui#valueref) }

窗口的关闭按钮: 变为 `false` 时组件在下一帧关闭.

## [m#] append

### log.append(level, text)

- **level** { [LogLevel](imgui#p-loglevel) | [string](dataTypes#string) } - 等级.
- **text** { [any](dataTypes#any) } - 文本.
- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

添加条目. 无法识别的等级算作 `log`.

## [m#] appendLog

### log.appendLog(text, level?)

**`Overload 1/2`**

- **text** { [any](dataTypes#any) } - 文本.
- **[ level ]** { [LogLevel](imgui#p-loglevel) | [string](dataTypes#string) } - 等级.
- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

### log.appendLog(level, text)

**`Overload 2/2`**

- **level** { [LogLevel](imgui#p-loglevel) | [string](dataTypes#string) } - 等级.
- **text** { [any](dataTypes#any) } - 文本.
- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

添加条目, 等级可以放在第一个或第二个参数.

## [m#] log

### log.log(text)

- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

添加 `log` 等级的条目.

## [m#] debug

### log.debug(text)

- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

添加 `debug` 等级的条目.

## [m#] info

### log.info(text)

- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

添加 `info` 等级的条目.

## [m#] warn

### log.warn(text)

- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

添加 `warn` 等级的条目.

## [m#] error

### log.error(text)

- **text** { [any](dataTypes#any) } - 文本, 用 `String()` 转换.
- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

添加 `error` 等级的条目.

## [m#] clear

### log.clear()

- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

移除全部条目.

## [m#] exportText

### log.exportText()

- <ins>**returns**</ins> { [string](dataTypes#string) }

把条目转为文本, 每行一个 `[时间] [等级] 文本`.

## [m#] export

### log.export()

- <ins>**returns**</ins> { [string](dataTypes#string) }

与导出按钮相同: 调用 `onExport` 并返回文本.

## [m#] render

### log.render()

- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

在帧内立即绘制窗口, 在自动绘制之外再绘制一次.

## [p#] type

**`READONLY`**

- { [string](dataTypes#string) }

组件类型, 这里是 `logWindow`.

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

### log.show()

- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

重新开始绘制.

## [m#] hide

### log.hide()

- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

停止绘制, 保留组件.

## [m#] toggle

### log.toggle()

- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

在 `show` 与 `hide` 之间切换.

## [m#] close

### log.close(reason?)

- **[ reason ]** { [string](dataTypes#string) } - 写入 `closeReason` 的原因.
- <ins>**returns**</ins> { [ImguiLogWindow](imguiLogWindowType) }

把组件从会话移除.
