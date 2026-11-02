# ImGui 悬浮按钮 (ImguiFloatingButton)

<!-- runtime-support:begin ImguiFloatingButton# -->
<!-- 本段由 generator/runtime-support.js 根据 AutoJs6 运行时覆盖矩阵生成, 不要手动修改; 数据源 ksp -->

| 运行时支持 | Rhino | Node.js 主线程 | Node.js Worker | Bun |
| --- | --- | --- | --- | --- |
| 入口 | `ImguiFloatingButton` 对象 | - | - | - |
| 状态 | 已支持 24 项 | 不适用 24 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 24 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` | 不适用 24 项 (仅限 Rhino 引擎), 等价写法: `engines.execScript of a Rhino script that opens the window, events.broadcast between the scripts` |

各 API 在同一运行时中的入口, 状态与授权一致, 没有差异项.

Node.js 与 Bun 的导入方式, 异步返回值与授权检查见 [运行时 API](runtimeApis#执行方式).

<!-- runtime-support:end -->

ImguiFloatingButton 是独立于 Surface 的 Android 悬浮按钮, 可以拖动, 由 [imgui.addButtonEx](imgui#m-addbuttonex) 或 [session.addButtonEx](imguiSessionType#m-addbuttonex) 返回, 随会话关闭. 特权层没有独立按钮. 字段只读, 用 setter 修改. 类型声明中的名称是 `ImGui.FloatingButton`.

```js
let clicks = 0;

imgui.createWindow(function (ui) {
    ui.withWindow('按钮', null, 0, function () {
        ui.text('点按次数: ' + clicks);
    });
}, { width: 260, height: 160 });

let button = imgui.addButtonEx('+1', function () {
    clicks += 1;
}, { size: 48, x: 16, y: 200 });
button.setAlpha(0.8);
```

## FloatingButtonOptions

悬浮按钮的选项. 尺寸和位置单位 dp, 超出范围抛出 RangeError.

| 选项 | 类型 | 说明 |
| --- | --- | --- |
| `size` | [number](dataTypes#number) | 省略 `width` 或 `height` 时的宽高, 默认 56. |
| `width` | [number](dataTypes#number) | 宽度. |
| `height` | [number](dataTypes#number) | 高度. |
| `x` | [number](dataTypes#number) | 左边缘, 限制在屏幕内. |
| `y` | [number](dataTypes#number) | 上边缘, 限制在屏幕内. |
| `alpha` | [number](dataTypes#number) | 不透明度, `0..1`. |
| `backgroundColor` | [Color](imgui#color) | 背景色. |
| `borderColor` | [Color](imgui#color) | 边框颜色. |
| `borderWidth` | [number](dataTypes#number) | 边框宽度. |
| `rounding` | [number](dataTypes#number) | 圆角半径, 默认为短边的一半. |
| `textColor` | [Color](imgui#color) | 文字颜色, 默认白色. |
| `textSize` | [number](dataTypes#number) | 文字大小, 单位 sp, 默认 16. |
| `elevation` | [number](dataTypes#number) | 阴影高度, 默认 8. |
| `draggable` | [boolean](dataTypes#boolean) | 用户能否拖动, 默认 `true`. |
| `touchable` | [boolean](dataTypes#boolean) | 是否接收触摸, 默认 `true`. |
| `moreTouch` | [boolean](dataTypes#boolean) | 让触摸同时到达下层应用, 默认跟随会话. |
| `visible` | [boolean](dataTypes#boolean) | 初始是否显示, 默认 `true`. |
| `hidden` | [boolean](dataTypes#boolean) | `true` 时初始隐藏. |
| `secure` | [boolean](dataTypes#boolean) | 按钮的 `FLAG_SECURE`, 默认跟随会话. |
| `onClick` | [Function](dataTypes#function) | 点按时在脚本线程上运行. |
| `onMoved` | [Function](dataTypes#function) | 按钮移动后在脚本线程上运行. 事件有 `button`, `session`, `x`, `y` 与 `source` (`drag`, `api` 或 `configuration`). |

<p style="font: bold 2em sans-serif; color: #FF7043">ImguiFloatingButton</p>

## [p#] window

**`READONLY`**

- { [any](dataTypes#any) }

按钮的悬浮窗.

## [p#] view

**`READONLY`**

- { [any](dataTypes#any) }

按钮的 Android 视图.

## [p#] session

**`READONLY`**

- { [ImguiSession](imguiSessionType) }

按钮所属的会话.

## [p#] text

**`READONLY`**

- { [string](dataTypes#string) }

按钮文字.

## [p#] x

**`READONLY`**

- { [number](dataTypes#number) }

左边缘, 单位 dp.

## [p#] y

**`READONLY`**

- { [number](dataTypes#number) }

上边缘, 单位 dp.

## [p#] width

**`READONLY`**

- { [number](dataTypes#number) }

宽度, 单位 dp.

## [p#] height

**`READONLY`**

- { [number](dataTypes#number) }

高度, 单位 dp.

## [p#] alpha

**`READONLY`**

- { [number](dataTypes#number) }

不透明度, `0..1`.

## [p#] secure

**`READONLY`**

- { [boolean](dataTypes#boolean) }

`FLAG_SECURE` 是否开启.

## [p#] moreTouch

**`READONLY`**

- { [boolean](dataTypes#boolean) }

触摸是否同时到达下层应用.

## [p#] visible

**`READONLY`**

- { [boolean](dataTypes#boolean) }

是否显示.

## [p#] touchable

**`READONLY`**

- { [boolean](dataTypes#boolean) }

是否接收触摸.

## [p#] closed

**`READONLY`**

- { [boolean](dataTypes#boolean) }

[close](#m-close) 是否已运行.

## [m#] setText

### button.setText(text)

- **text** { [any](dataTypes#any) } - 新的文字.
- <ins>**returns**</ins> { [ImguiFloatingButton](imguiFloatingButtonType) }

改变文字.

## [m#] setPosition

### button.setPosition(x, y)

- **x** { [number](dataTypes#number) | [null](dataTypes#null) } - 左边缘.
- **y** { [number](dataTypes#number) | [null](dataTypes#null) } - 上边缘.
- <ins>**returns**</ins> { [ImguiFloatingButton](imguiFloatingButtonType) }

把按钮移到 `(x, y)`, 单位 dp, 限制在屏幕内. `null` 保持这个坐标.

## [m#] setAlpha

### button.setAlpha(alpha)

- **alpha** { [number](dataTypes#number) } - 不透明度, `0..1`.
- <ins>**returns**</ins> { [ImguiFloatingButton](imguiFloatingButtonType) }

设置不透明度.

## [m#] setSecure

### button.setSecure(secure)

- **secure** { [boolean](dataTypes#boolean) } - 是否开启 `FLAG_SECURE`.
- <ins>**returns**</ins> { [ImguiFloatingButton](imguiFloatingButtonType) }

开关 `FLAG_SECURE`.

## [m#] setMoreTouch

### button.setMoreTouch(enabled)

- **enabled** { [boolean](dataTypes#boolean) } - 是否开启.
- <ins>**returns**</ins> { [ImguiFloatingButton](imguiFloatingButtonType) }

让触摸同时到达下层应用.

## [m#] setTouchable

### button.setTouchable(touchable)

- **touchable** { [boolean](dataTypes#boolean) } - 是否接收.
- <ins>**returns**</ins> { [ImguiFloatingButton](imguiFloatingButtonType) }

切换是否接收触摸.

## [m#] setVisible

### button.setVisible(visible)

- **visible** { [boolean](dataTypes#boolean) } - 是否显示.
- <ins>**returns**</ins> { [ImguiFloatingButton](imguiFloatingButtonType) }

显示或隐藏.

## [m#] show

### button.show()

- <ins>**returns**</ins> { [ImguiFloatingButton](imguiFloatingButtonType) }

显示按钮.

## [m#] hide

### button.hide()

- <ins>**returns**</ins> { [ImguiFloatingButton](imguiFloatingButtonType) }

隐藏按钮.

## [m#] close

### button.close()

- <ins>**returns**</ins> { [void](dataTypes#void) }

移除按钮.
