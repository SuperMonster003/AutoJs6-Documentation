# Compose 悬浮窗 (ComposeFloatyWindow)

ComposeFloatyWindow 由 [compose.floaty](compose#m-floaty) 创建, 同时拥有一个原生悬浮窗和一个 [ComposeSession](composeSessionType). UI 与非 UI 脚本均可使用, 需要当前应用已获悬浮窗权限. 不能直接用 `new` 创建.

窗口操作使用物理像素, 与 Compose 节点的 dp 布局尺寸不同. 创建返回后原生窗口仍可能正在附加, 位置和尺寸变更会交给 Android 主线程处理.

<p style="font: bold 2em sans-serif; color: #FF7043">ComposeFloatyWindow</p>

## 创建选项

传给 `compose.floaty(nodeOrRender, options?)` 的选项如下:

| 选项 | 类型 | 默认行为 |
| --- | --- | --- |
| `raw` | `boolean` | `false`, 使用可调整窗口, 其移动/尺寸/关闭控件默认隐藏; `true` 使用没有这些控件的 raw 窗口. |
| `x`, `y` | `number` | 省略时不覆盖原生窗口的位置. 每项须为 `-2147483648..2147483647` 的整数像素, 可以为负数. |
| `width`, `height` | `number` | 省略两项时保留原生窗口的默认测量; 只给一项时另一项按内容包裹. 每项为非负整数像素, 或 `-1` / `-2`. |
| `touchable` | `boolean` | `true`. |
| `focusable` | `boolean` | `false`. |
| `theme` | [ComposeTheme](composeThemeType) | 省略或 `null` 时沿用模块当前默认主题覆盖. |

`width` / `height` 的 `-1` 表示 `MATCH_PARENT`, `-2` 表示 `WRAP_CONTENT`. 最大数值为 `2147483647`. 布尔项不接受 `0`, `1` 或字符串; 几何项不接受 dp 字符串, 小数, `NaN`, 无穷大或显式 `null`. 未知选项会报 `UNKNOWN_PROP`.

```js
// 非 UI 脚本. 运行前为当前应用授予悬浮窗权限.
let label = compose.Text({text: 'HUD'});
let window = compose.floaty(compose.Column({padding: 12}, label,
    compose.Button({onClick: function () { window.close(); }}, 'Close')), {
    raw: true,
    x: 24,
    y: 120,
    width: 280,
    height: -2,
});

threads.start(function () {
    window.post(function () { label.text = 'Worker update'; });
});
```

## [p#] session

**`READONLY`**

- { [ComposeSession](composeSessionType) }

拥有该窗口节点树的会话. 此对象也出现在 [compose.sessions](compose#p-sessions) 中. `window.session.close()` 与 `window.close()` 关闭同一个会话和窗口.

## [p#] root

**`READONLY`**

- { [ComposeNode](composeNodeType) | [null](dataTypes#null) }

等同于 `window.session.root`. 关闭后为 `null`.

## 会话方法转发

下列方法直接转发给 `window.session`, 参数, 回调线程与行为和对应的 [ComposeSession](composeSessionType) 方法相同:

| 调用 | 返回值 | 说明 |
| --- | --- | --- |
| `window.update(fn)` | `fn` 的返回值 | 同步批处理节点更新. |
| `window.post(fn, delay?)` | `undefined` | 所属会话关闭后不再执行, 可从工作线程投递. |
| `window.showSnackbar(message, options?)` | `window.session` | 需要会话中存在使用默认 Snackbar host 的 Scaffold. |
| `window.on('close', fn)` | `window.session` | 普通回调函数的 `this` 是会话, 不是窗口. |
| `window.isClosed()` | `boolean` | 是否已关闭, 关闭后仍可查询. |

`on` 和 `showSnackbar` 返回会话, 因此不能在其返回值上直接链式调用 `setPosition` 等窗口方法.

## [m#] setPosition

### window.setPosition(x, y)

- **x** { [number](dataTypes#number) } - 水平位置, 整数像素.
- **y** { [number](dataTypes#number) } - 垂直位置, 整数像素.
- <ins>**returns**</ins> { [ComposeFloatyWindow](composeFloatyWindowType) } - 当前窗口.

使用与创建选项相同的整数范围. 非 raw 窗口沿用宿主既有 floaty 的内容位置偏移规则. 该方法排队更新原生窗口, 立即读取坐标可能仍得到上一次的快照.

## [m#] setSize

### window.setSize(width, height)

- **width** { [number](dataTypes#number) } - 宽度, 非负整数像素或 `-1` / `-2`.
- **height** { [number](dataTypes#number) } - 高度, 非负整数像素或 `-1` / `-2`.
- <ins>**returns**</ins> { [ComposeFloatyWindow](composeFloatyWindowType) } - 当前窗口.

两项都必须传入. 原生测量完成前, `getWidth()` 和 `getHeight()` 不一定已反映本次请求.

## [m#] getX

### window.getX()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 最近可用的水平位置快照, 像素.

原生窗口尚未创建时为 `-1`.

## [m#] getY

### window.getY()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 最近可用的垂直位置快照, 像素.

原生窗口尚未创建时为 `-1`.

## [m#] getWidth

### window.getWidth()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 最近一次实际测量宽度, 像素.

尚未完成测量时可为 `0`. 返回测量结果, 不返回创建选项中 `-1` / `-2` 的尺寸标记.

## [m#] getHeight

### window.getHeight()

- <ins>**returns**</ins> { [number](dataTypes#number) } - 最近一次实际测量高度, 像素.

尚未完成测量时可为 `0`.

## [m#] requestFocus

### window.requestFocus()

- <ins>**returns**</ins> { [ComposeFloatyWindow](composeFloatyWindowType) } - 当前窗口.

使原生窗口允许取得焦点. 输入框自身还可调用 [node.focus()](composeNodeType#m-focus); 窗口允许焦点和具体编辑器取得焦点是两个步骤. 返回值不表示输入法已经显示.

已验证的 HyperOS 悬浮窗输入场景是在桌面显示窗口并调用 `requestFocus()`; 系统对其他前台应用之上的悬浮焦点可能有额外限制.

## [m#] disableFocus

### window.disableFocus()

- <ins>**returns**</ins> { [ComposeFloatyWindow](composeFloatyWindowType) } - 当前窗口.

禁止窗口取得输入焦点, 恢复与默认 `focusable: false` 一致的窗口行为. 不等同于关闭窗口.

## [m#] setTouchable

### window.setTouchable(touchable)

- **touchable** { [boolean](dataTypes#boolean) } - 是否接收触摸.
- <ins>**returns**</ins> { [ComposeFloatyWindow](composeFloatyWindowType) } - 当前窗口.

设为 `false` 后窗口不接收触摸, 包括窗口上的交互控件. 脚本仍可通过 `close()` 关闭它.

## [m#] setAdjustEnabled

### window.setAdjustEnabled(enabled)

- **enabled** { [boolean](dataTypes#boolean) } - 是否显示移动, 调整尺寸和关闭控件.
- <ins>**returns**</ins> { [ComposeFloatyWindow](composeFloatyWindowType) } - 当前窗口.

仅适用于创建时 `raw: false` 的窗口. 对 raw 窗口调用会抛出 `INVALID_ARGUMENT`, 不因此关闭原有窗口. 设为 `false` 也会隐藏原生关闭按钮, 应保留脚本自己的关闭入口.

这些控件默认隐藏. 需要让用户拖动, 调整尺寸或使用原生关闭按钮时, 调用 `window.setAdjustEnabled(true)`.

## [m#] close

### window.close()

- <ins>**returns**</ins> { [void](dataTypes#void) }

幂等地关闭窗口和所属会话, 可从工作线程请求. 在原生窗口尚未附加时关闭, 也会取消后续附加. 不需要等待窗口出现再清理.

窗口也可由原生关闭控件, 当前脚本的 `floaty.closeAll()`, 会话关闭或脚本退出清理. 每个悬浮会话独立持有脚本保活引用; 关闭一个窗口只释放其自身引用, 不会停止其他仍存活的会话. 如果最后一个窗口关闭且脚本没有其他保活来源, 非 UI 脚本可以自然结束.

除 `post`, 幂等 `close` 和 `isClosed()` 外, 窗口方法应在所属脚本线程执行, 包括读取几何快照的 `getX`, `getY`, `getWidth`, `getHeight`. 关闭后所有位置, 尺寸, 焦点, 触摸和调整控件操作及其几何 getter 都会抛出 `SESSION_CLOSED`; `root`, `session` 和 `isClosed()` 仍可用于观察清理结果.
