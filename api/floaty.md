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

## floaty.expandableWindow(collapsedLayout, expandedLayout)
* `collapsedLayout` {xml} | {View} 悬浮窗折叠时的界面XML或者View
* `expandedLayout` {xml} | {View} 悬浮窗展开时的界面的XML或者View

指定悬浮窗的布局，创建并**显示**一个可展开悬浮窗，返回一个`ExpandableFloatyWindow`对象。

所谓可展开的悬浮窗，以Auto.js的控制台悬浮窗为例，点击右上角的最小化即为悬浮窗折叠状态，再点击悬浮窗则为展开状态。

其中layout参数可以是xml布局或者一个View，更多信息参见ui模块的说明。

例子：
```
var w = floaty.expandableWindow(
    <img id="logo" src="file:///sdcard/logo.png" w="100" h="100" circle="true"/>
    ,
    <vertical>
        <radiogroup bg="#ffffff">
            <radio text="选项1">
            <radio text="选项2">
            <radio text="选项3">
        </radiogroup>
        <button id="minimize" text="折叠"/>
        <button id="exit" text="关闭悬浮窗"/>
    </vertical>
    
);


w.logo.click(()=> w.expand());
w.minimize.click(()=> w.collapse());
w.exit.click(()=> w.close());
```

这个例子运行后将会显示一个图片的图标，点击后显示三个选项和折叠、关闭按键。

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

# ExpandableFloatyWindow

可展开悬浮窗。ExpandableFloatyWindow拥有FloatyWindow的所有函数，同时还有以下函数。

## ExpandableFloatyWindow.expand();

展开悬浮窗。

## ExpandableFloatyWindow.collapse();

折叠悬浮窗。

## ExpandableFloatyWindow.toggle();

如果悬浮窗是折叠状态，则展开悬浮窗；如果是展开状态，则折叠悬浮窗。

## ExpandableFloatyWindow.isExpanded();

返回悬浮窗是否是展开状态。