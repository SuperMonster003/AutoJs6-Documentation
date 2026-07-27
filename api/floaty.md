# 悬浮窗 (Floaty)

---

<aside class="doc-status doc-status--incomplete" data-marked-by="SuperMonster003" data-marked-on="2022-10-22">
<p><strong>文档状态:</strong> 此章节仍在补充或完善中.</p>
</aside>

floaty 模块提供了悬浮窗的相关函数, 可以在屏幕上显示自定义悬浮窗, 控制悬浮窗大小, 位置等.

悬浮窗在脚本停止运行时会自动关闭, 因此, 要保持悬浮窗不被关闭, 可以用一个空的 setInterval 来实现, 例如:

```
setInterval(()=>{}, 1000);
```

## [m] window

### window(xml)

**`[6.7.0]`**

- **xml** { [XML](e4x) | [string](dataTypes#string) } - E4X XML 布局或 XML 布局字符串
- <ins>**returns**</ins> { [FloatyWindow](#floatywindow) } - 可调整悬浮窗对象

根据布局创建并显示一个带关闭, 调整大小和调整位置控件的悬浮窗. 可调用 `setAdjustEnabled()` 显示或隐藏调整控件.

`xml` 只接受 E4X XML 对象或字符串, 不接受 Android `View` 对象. 缺少悬浮窗权限时会打开系统设置并等待授权, 最长等待 `60` 秒.

```js
let window = floaty.window(
    <frame gravity="center">
        <text id="text">悬浮文字</text>
    </frame>
);

setTimeout(() => {
    window.close();
}, 2000);
```

对悬浮窗控件的修改需要在 UI 线程执行, 可使用 [ui.run](ui#m-run):

```js
ui.run(() => {
    window.text.setText('文本');
});
```

## [m] rawWindow

### rawWindow(xml)

**`[6.7.0]`**

- **xml** { [XML](e4x) | [string](dataTypes#string) } - E4X XML 布局或 XML 布局字符串
- <ins>**returns**</ins> { [FloatyRawWindow](#floatyrawwindow) } - 原始悬浮窗对象

根据布局创建并显示原始悬浮窗. 与 [floaty.window](#m-window) 不同, 此方法不附加关闭或调整控件, 并支持覆盖状态栏的全屏布局.

`xml` 只接受 E4X XML 对象或字符串, 不接受 Android `View` 对象. 缺少悬浮窗权限时会打开系统设置并等待授权, 最长等待 `60` 秒.

```js
let window = floaty.rawWindow(
    <frame gravity="center">
        <text id="text">悬浮文字</text>
    </frame>
);

window.setPosition(500, 500);

setTimeout(() => {
    window.close();
}, 2000);
```

## floaty.hasPermission()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已取得悬浮窗权限

检查当前应用是否可以在其他应用上层显示窗口.

## floaty.checkPermission()

**`6.8.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已取得悬浮窗权限

[floaty.hasPermission](#floaty-haspermission) 的兼容别名.

## floaty.requestPermission()

- <ins>**returns**</ins> { [void](dataTypes#void) }

打开系统悬浮窗权限设置页面.

## floaty.ensurePermission()

- <ins>**returns**</ins> { [void](dataTypes#void) }

确保当前应用已取得悬浮窗权限. 权限缺失时打开系统设置页面.

## [m] getClip

### getClip(maxDelayAfterWindowReady?)

**`6.6.0`**

- **[ maxDelayAfterWindowReady = 500 ]** { [number](dataTypes#number) } - 临时悬浮窗就绪后剪贴板数据的最大等待时间, 单位为毫秒
- <ins>**returns**</ins> { [string](dataTypes#string) } - 剪贴板文本

借助临时原始悬浮窗取得窗口焦点后读取剪贴板文本. 首次结果为空时, 在 `maxDelayAfterWindowReady` 时间内每隔约 `10` 毫秒重试. 临时窗口在读取时关闭.

此方法需要悬浮窗权限. 权限缺失时会打开系统设置并等待授权, 最长等待 `60` 秒.

## floaty.closeAll()

关闭所有本脚本的悬浮窗.

# FloatyWindow

悬浮窗对象, 可通过 `FloatyWindow.{id}` 获取悬浮窗界面上的元素. 例如, 悬浮窗 window 上一个控件的 id 为 aaa, 那么 `window.aaa` 即可获取到该控件, 类似于 ui.

## window.setAdjustEnabled(enabled)

- **enabled** { [boolean](dataTypes#boolean) } 是否启用悬浮窗调整 (大小, 位置)

如果 enabled 为 true, 则在悬浮窗左上角, 右上角显示可供位置, 大小调整的标示, 就像控制台一样;
如果 enabled 为 false, 则隐藏上述标示.

## window.setPosition(x, y)

- **x** { [number](dataTypes#number) } x
- **x** { [number](dataTypes#number) } y

设置悬浮窗位置.

## window.getX()

返回悬浮窗位置的 X 坐标.

## window.getY()

返回悬浮窗位置的 Y 坐标.

## window.setSize(width, height)

- **width** { [number](dataTypes#number) } 宽度
- **height** { [number](dataTypes#number) } 高度

设置悬浮窗宽高.

## window.getWidth()

返回悬浮窗宽度.

## window.getHeight()

返回悬浮窗高度.

## window.close()

关闭悬浮窗. 如果悬浮窗已经是关闭状态, 则此函数将不执行任何操作.

被关闭后的悬浮窗不能再显示.

## window.exitOnClose()

使悬浮窗被关闭时自动结束脚本运行.

# FloatyRawWindow

原始悬浮窗对象, 可通过 `window.{id}` 获取悬浮窗界面上的元素. 例如, 悬浮窗 window 上一个控件的 id 为 aaa, 那么 `window.aaa` 即可获取到该控件, 类似于 ui.

## window.setTouchable(touchable)

- **touchable** {Boolean} 是否可触摸

设置悬浮窗是否可触摸, 如果为 true, 则悬浮窗将接收到触摸, 点击等事件并且无法继续传递到悬浮窗下面; 如果为 false, 悬浮窗上的触摸, 点击等事件将被直接传递到悬浮窗下面. 处于安全考虑, 被悬浮窗接收的触摸事情无法再继续传递到下层.

可以用此特性来制作护眼模式脚本.

```
let w = floaty.rawWindow(
    <frame gravity="center" bg="#44ffcc00"/>
);

w.setSize(-1, -1);
w.setTouchable(false);

setTimeout(()=>{
    w.close();
}, 4000);

```

## window.setPosition(x, y)

- **x** { [number](dataTypes#number) } x
- **x** { [number](dataTypes#number) } y

设置悬浮窗位置.

## window.getX()

返回悬浮窗位置的 X 坐标.

## window.getY()

返回悬浮窗位置的 Y 坐标.

## window.setSize(width, height)

- **width** { [number](dataTypes#number) } 宽度
- **height** { [number](dataTypes#number) } 高度

设置悬浮窗宽高.

特别地, 如果设置为 -1, 则为占满全屏; 设置为 -2 则为根据悬浮窗内容大小而定. 例如:

```
let w = floaty.rawWindow(
    <frame gravity="center" bg="#77ff0000">
        <text id="text">悬浮文字</text>
    </frame>
);

w.setSize(-1, -1);

setTimeout(()=>{
    w.close();
}, 2000);

```

## window.getWidth()

返回悬浮窗宽度.

## window.getHeight()

返回悬浮窗高度.

## window.close()

关闭悬浮窗. 如果悬浮窗已经是关闭状态, 则此函数将不执行任何操作.

被关闭后的悬浮窗不能再显示.

## window.exitOnClose()

使悬浮窗被关闭时自动结束脚本运行.
