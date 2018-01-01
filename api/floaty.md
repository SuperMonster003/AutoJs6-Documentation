# Floaty

floaty模块提供了悬浮窗的相关函数，可以在屏幕上显示自定义悬浮窗，控制悬浮窗大小、位置等。

悬浮窗在脚本停止运行时会自动关闭，因此，要保持悬浮窗不被关闭，可以用一个空的setInterval来实现，例如：
```
setInterval(()=>{}, 1000);
```

## floaty.window(layout)
* `layout` {xml} | {View} 悬浮窗界面的XML或者View

指定悬浮窗的布局，创建并**显示**一个悬浮窗，返回一个`FloatyWindow`对象。

其中layout参数可以是xml布局或者一个View，更多信息参见ui模块的说明。

例子：
```
var w = floaty.window(
    <frame gravity="center">
        <text id="text">悬浮文字</text>
    </frame>
);
setTimeout(()=>{
    w.close();
}, 2000);
```
这段代码运行后将会在屏幕上显示悬浮文字，并在两秒后消失。

另外，因为脚本运行的线程不是UI线程，而所有对控件的修改操作需要在UI线程执行，此时需要用`ui.run`，例如:
```
ui.run(function(){
    w.text.setText("文本");
});
```

## floaty.closeAll()

关闭所有本脚本的悬浮窗。

# FloatyWindow

悬浮窗对象，可通过`FloatyWindow.{id}`获取悬浮窗界面上的元素。例如, 悬浮窗window上一个控件的id为aaa, 那么`window.aaa`即可获取到该控件，类似于ui。

## FloatyWindow.setAdjustEnabled(enabled)
* `enabled` {boolean} 是否启用悬浮窗调整(大小、位置)

如果enabled为true，则在悬浮窗左上角、右上角显示可供位置、大小调整的标示，就像控制台一样；
如果enabled为false，则隐藏上述标示。

## FloatyWindow.setPosition(x, y)
* `x` {number} x
* `x` {number} y

设置悬浮窗位置。

## FloatyWindow.getX()

返回悬浮窗位置的X坐标。

## FloatyWindow.getY()

返回悬浮窗位置的Y坐标。

## FloatyWindow.setSize(width, height)
* `width` {number} 宽度
* `height` {number} 高度

设置悬浮窗宽高。

## FloatyWindow.getWidht()

返回悬浮窗宽度。

## FloatyWindow.getHeight()

返回悬浮窗高度。

## FloatyWindow.close()

关闭悬浮窗。如果悬浮窗已经是关闭状态，则此函数将不执行任何操作。

被关闭后的悬浮窗不能再显示。

## FloatyWindow.exitOnClose()

使悬浮窗被关闭时自动结束脚本运行。
