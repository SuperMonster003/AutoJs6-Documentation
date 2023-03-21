# 自动化 (Automator)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Oct 22, 2022.</p>

---

## 简易自动化 (SimpleActionAutomator)

待补充...

## 高权限自动化 (RootAutomator)

待补充...

## 自动化配置 (AutomatorConfiguration)

待补充...

## 选择器 (UiSelector)

UiSelector (选择器), 亦可看作是 [控件节点](uiObjectType) 的条件筛选器, 用于通过附加不同的条件, 筛选出一个或一组活动窗口中的 `控件节点`, 并做进一步处理, 如 [ 执行 [控件行为](uiObjectActionsType) (点击, 长按, 设置文本等) / 判断位置 / 获取文本内容 / 获取控件特定状态 / 在 [控件层级](glossaries#控件层级) 中进行 [罗盘](uiObjectType#m-compass) 导航 ] 等.

详情参阅 [选择器 (UiSelector)](uiSelectorType) 章节.

## 控件节点 (UiObject)

UiObject 通常被称为 [ 控件 / 节点 / 控件节点 ], 可看做是一个通过安卓无障碍服务包装的 [AccessibilityNodeInfo](https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo) 对象, 代表一个当前活动窗口中的节点, 通过此节点可收集控件信息或执行控件行为, 进而实现一系列自动化操作.

详情参阅 [控件节点 (UiObject)](uiObjectType) 章节.

## 控件集合 (UiObjectCollection)

UiObjectCollection 代表 [控件节点 (UiObject)](uiObjectType) 的对象集合.

详情参阅 [控件集合 (UiObjectCollection)](uiObjectCollectionType) 章节.

## 控件节点行为 (UiObjectActions)

UiObjectActions 是一个 Java 接口, 代表 [控件节点 (UiObject)](uiObjectType) 的行为集合.

详情参阅 [控件节点行为 (UiObjectActions)](uiObjectActionsType) 章节.

---

# 基于坐标的触摸模拟

本章节介绍了一些使用坐标进行点击、滑动的函数. 这些函数有的需要安卓7.0以上, 有的需要root权限.

要获取要点击的位置的坐标, 可以在开发者选项中开启"指针位置".

基于坐标的脚本通常会有分辨率的问题, 这时可以通过`setScreenMetrics()`函数来进行自动坐标放缩. 这个函数会影响本章节的所有点击、长按、滑动等函数. 通过设定脚本设计时的分辨率, 使得脚本在其他分辨率下自动放缩坐标.

控件和坐标也可以相互结合. 一些控件是无法点击的(clickable为false), 无法通过`.click()`函数来点击, 这时如果安卓版本在7.0以上或者有root权限, 就可以通过以下方式来点击：

```
//获取这个控件
var widget = id("xxx").findOne();
//获取其中心位置并点击
click(widget.bounds().centerX(), widget.bounds().centerY());
//如果用root权限则用Tap
```

## setScreenMetrics(width, height)

* width {number} 屏幕宽度, 单位像素
* height {number} 屏幕高度, 单位像素

设置脚本坐标点击所适合的屏幕宽高. 如果脚本运行时, 屏幕宽度不一致会自动放缩坐标.

例如在1920*1080的设备中, 某个操作的代码为

```
setScreenMetrics(1080, 1920);
click(800, 200);
longClick(300, 500);
```

那么在其他设备上AutoJs会自动放缩坐标以便脚本仍然有效. 例如在540 * 960的屏幕中`click(800, 200)`实际上会点击位置(400, 100).

# 安卓7.0以上的触摸和手势模拟

**注意以下命令只有Android7.0及以上才有效**

## click(x, y)

* `x` {number} 要点击的坐标的x值
* `y` {number} 要点击的坐标的y值

模拟点击坐标(x, y), 并返回是否点击成功. 只有在点击执行完成后脚本才继续执行.

一般而言, 只有点击过程(大约150毫秒)中被其他事件中断(例如用户自行点击)才会点击失败.

使用该函数模拟连续点击时可能有点击速度过慢的问题, 这时可以用`press()`函数代替.

## longClick(x, y)

* `x` {number} 要长按的坐标的x值
* `y` {number} 要长按的坐标的y值

模拟长按坐标(x, y), 并返回是否成功. 只有在长按执行完成（大约600毫秒）时脚本才会继续执行.

一般而言, 只有长按过程中被其他事件中断(例如用户自行点击)才会长按失败.

## press(x, y, duration)

* `x` {number} 要按住的坐标的x值
* `y` {number} 要按住的坐标的y值
* `duration` {number} 按住时长, 单位毫秒

模拟按住坐标(x, y), 并返回是否成功. 只有按住操作执行完成时脚本才会继续执行.

如果按住时间过短, 那么会被系统认为是点击；如果时长超过500毫秒, 则认为是长按.

一般而言, 只有按住过程中被其他事件中断才会操作失败.

一个连点器的例子如下：

```
//循环100次
for(var i = 0; i < 100; i++){
  //点击位置(500, 1000), 每次用时1毫秒
  press(500, 1000, 1);
}
```

## swipe(x1, y1, x2, y2, duration)

* `x1` {number} 滑动的起始坐标的x值
* `y1` {number} 滑动的起始坐标的y值
* `x2` {number} 滑动的结束坐标的x值
* `y2` {number} 滑动的结束坐标的y值
* `duration` {number} 滑动时长, 单位毫秒

模拟从坐标(x1, y1)滑动到坐标(x2, y2), 并返回是否成功. 只有滑动操作执行完成时脚本才会继续执行.

一般而言, 只有滑动过程中被其他事件中断才会滑动失败.

## gesture(duration, [x1, y1], [x2, y2], ...)

* `duration` {number} 手势的时长
* [x, y] ... 手势滑动路径的一系列坐标

模拟手势操作. 例如`gesture(1000, [0, 0], [500, 500], [500, 1000])`为模拟一个从(0, 0)到(500, 500)到(500, 100)的手势操作, 时长为2秒.

## gestures([delay1, duration1, [x1, y1], [x2, y2], ...], [delay2, duration2, [x3, y3], [x4, y4], ...], ...)

同时模拟多个手势. 每个手势的参数为\[delay, duration, 坐标\], delay为延迟多久(毫秒)才执行该手势；duration为手势执行时长；坐标为手势经过的点的坐标. 其中delay参数可以省略, 默认为0.

例如手指捏合：

```
gestures([0, 500, [800, 300], [500, 1000]],
         [0, 500, [300, 1500], [500, 1000]]);
```

# RootAutomator

RootAutomator是一个使用root权限来模拟触摸的对象, 用它可以完成触摸与多点触摸, 并且这些动作的执行没有延迟.

一个脚本中最好只存在一个RootAutomator, 并且保证脚本结束退出他. 可以在exit事件中退出RootAutomator, 例如：

```
var ra = new RootAutomator();
events.on('exit', function(){
  ra.exit();
});
//执行一些点击操作
...

```

**注意以下命令需要root权限**

## RootAutomator.tap(x, y[, id])

* `x` {number} 横坐标
* `y` {number} 纵坐标
* `id` {number} 多点触摸id, 可选, 默认为1, 可以通过setDefaultId指定.

点击位置(x, y). 其中id是一个整数值, 用于区分多点触摸, 不同的id表示不同的"手指", 例如：

```
var ra = new RootAutomator();
//让"手指1"点击位置(100, 100)
ra.tap(100, 100, 1);
//让"手指2"点击位置(200, 200);
ra.tap(200, 200, 2);
ra.exit();
```

如果不需要多点触摸, 则不需要id这个参数.
多点触摸通常用于手势或游戏操作, 例如模拟双指捏合、双指上滑等.

某些情况下可能存在tap点击无反应的情况, 这时可以用`RootAutomator.press()`函数代替.

## RootAutomator.swipe(x1, x2, y1, y2[, duration, id])

* `x1` {number} 滑动起点横坐标
* `y1` {number} 滑动起点纵坐标
* `x2` {number} 滑动终点横坐标
* `y2` {number} 滑动终点纵坐标
* `duration` {number} 滑动时长, 单位毫秒, 默认值为300
* `id` {number} 多点触摸id, 可选, 默认为1

模拟一次从(x1, y1)到(x2, y2)的时间为duration毫秒的滑动.

## RootAutomator.press(x, y, duration[, id])

* `x` {number} 横坐标
* `y` {number} 纵坐标
* `duration` {number} 按下时长
* `id` {number} 多点触摸id, 可选, 默认为1

模拟按下位置(x, y), 时长为duration毫秒.

## RootAutomator.longPress(x, y[\, id\])

* `x` {number} 横坐标
* `y` {number} 纵坐标
* `duration` {number} 按下时长
* `id` {number} 多点触摸id, 可选, 默认为1

模拟长按位置(x, y).

以上为简单模拟触摸操作的函数. 如果要模拟一些复杂的手势, 需要更底层的函数.

## RootAutomator.touchDown(x, y[, id])

* `x` {number} 横坐标
* `y` {number} 纵坐标
* `id` {number} 多点触摸id, 可选, 默认为1

模拟手指按下位置(x, y).

## RootAutomator.touchMove(x, y[, id])

* `x` {number} 横坐标
* `y` {number} 纵坐标
* `id` {number} 多点触摸id, 可选, 默认为1

模拟移动手指到位置(x, y).

## RootAutomator.touchUp([id])

* `id` {number} 多点触摸id, 可选, 默认为1

模拟手指弹起.

# 使用root权限点击和滑动的简单命令

注意：本章节的函数在后续版本很可能有改动！请勿过分依赖本章节函数的副作用. 推荐使用`RootAutomator`代替本章节的触摸函数.

以下函数均需要root权限, 可以实现任意位置的点击、滑动等.

* 这些函数通常首字母大写以表示其特殊的权限.
* 这些函数均不返回任何值.
* 并且, 这些函数的执行是异步的、非阻塞的, 在不同机型上所用的时间不同. 脚本不会等待动作执行完成才继续执行. 因此最好在每个函数之后加上适当的sleep来达到期望的效果.

例如:

```
Tap(100, 100);
sleep(500);
```

注意, 动作的执行可能无法被停止, 例如：

```
for(var i = 0; i < 100; i++){
  Tap(100, 100);
}
```

这段代码执行后可能会出现在任务管理中停止脚本后点击仍然继续的情况.
因此, 强烈建议在每个动作后加上延时：

```
for(var i = 0; i < 100; i++){
  Tap(100, 100);
  sleep(500);
}
```

## Tap(x, y)

* x, y {number} 要点击的坐标.

点击位置(x, y), 您可以通过"开发者选项"开启指针位置来确定点击坐标.

## Swipe(x1, y1, x2, y2, \[duration\])

* x1, y1 {number} 滑动起点的坐标
* x2, y2 {number} 滑动终点的坐标
* duration {number} 滑动动作所用的时间

滑动. 从(x1, y1)位置滑动到(x2, y2)位置.

# 基于控件的操作

基于控件的操作指的是选择屏幕上的控件, 获取其信息或对其进行操作. 对于一般软件而言, 基于控件的操作对不同机型有很好的兼容性；但是对于游戏而言, 由于游戏界面并不是由控件构成, 无法采用本章节的方法, 也无法使用本章节的函数. 有关游戏脚本的编写, 请参考《基于坐标的操作》.

基于控件的操作依赖于无障碍服务, 因此最好在脚本开头使用`auto()`函数来确保无障碍服务已经启用. 如果运行到某个需要权限的语句无障碍服务并没启动, 则会抛出异常并跳转到无障碍服务界面. 这样的用户体验并不好, 因为需要重新运行脚本, 后续会加入等待无障碍服务启动并让脚本继续运行的函数.

您也可以在脚本开头使用`"auto";`表示这个脚本需要无障碍服务, 但是不推荐这种做法, 因为这个标记必须在脚本的最开头(前面不能有注释或其他语句、空格等), 我们推荐使用`auto()`函数来确保无障碍服务已启用.

## auto([mode])

* `mode` {string} 模式

检查无障碍服务是否已经启用, 如果没有启用则抛出异常并跳转到无障碍服务启用界面；同时设置无障碍模式为mode. mode的可选值为：

* `fast` 快速模式. 该模式下会启用控件缓存, 从而选择器获取屏幕控件更快. 对于需要快速的控件操作的脚本可以使用该模式, 一般脚本则没有必要使用该函数.
* `normal` 正常模式, 默认.

如果不加mode参数, 则为正常模式.

建议使用`auto.waitFor()`和`auto.setMode()`代替该函数, 因为`auto()`函数如果无障碍服务未启动会停止脚本；而`auto.waitFor()`则会在在无障碍服务启动后继续运行.

示例：

```
auto("fast");
```

示例2：

```
auto();
```

## auto.waitFor()

检查无障碍服务是否已经启用, 如果没有启用则跳转到无障碍服务启用界面, 并等待无障碍服务启动；当无障碍服务启动后脚本会继续运行.

因为该函数是阻塞的, 因此除非是有协程特性, 否则不能在ui模式下运行该函数, 建议在ui模式下使用`auto()`函数.

## auto.setMode(mode)

* `mode` {string} 模式

设置无障碍模式为mode. mode的可选值为：

* `fast` 快速模式. 该模式下会启用控件缓存, 从而选择器获取屏幕控件更快. 对于需要快速的控件查看和操作的脚本可以使用该模式, 一般脚本则没有必要使用该函数.
* `normal` 正常模式, 默认.

## auto.setFlags(flags)

**[v4.1.0新增]**

* `flags` {string} | {Array} 一些标志, 来启用和禁用某些特性, 包括：
    * `findOnUiThread` 使用该特性后, 选择器搜索时会在主进程进行. 该特性用于解决线程安全问题导致的次生问题, 不过目前貌似已知问题并不是线程安全问题.
    * `useUsageStats` 使用该特性后, 将会以"使用情况统计"服务的结果来检测当前正在运行的应用包名（需要授予"查看使用情况统计"权限). 如果觉得currentPackage()返回的结果不太准确, 可以尝试该特性.
    * `useShell` 使用该特性后, 将使用shell命令获取当前正在运行的应用的包名、活动名称, 但是需要root权限.

启用有关automator的一些特性. 例如：

```
auto.setFlags(["findOnUiThread", "useShell"]);
```

## auto.service

**[v4.1.0新增]**

* [AccessibilityService](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService/)

获取无障碍服务. 如果无障碍服务没有启动, 则返回`null`.

参见[AccessibilityService](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService/).

## auto.windows

**[v4.1.0新增]**

* {Array}

当前所有窗口([AccessibilityWindowInfo](https://developer.android.com/reference/android/view/accessibility/AccessibilityWindowInfo/))的数组, 可能包括状态栏、输入法、当前应用窗口, 弹出窗口、悬浮窗、分屏应用窗口等. 可以分别获取每个窗口的布局信息.

该函数需要Android 5.0以上才能运行.

## auto.root

**[v4.1.0新增]**

* {UiObject}

当前窗口的布局根元素. 如果无障碍服务未启动或者WindowFilter均返回false, 则会返回`null`.

如果不设置windowFilter, 则当前窗口即为活跃的窗口（获取到焦点、正在触摸的窗口）；如果设置了windowFilter, 则获取的是过滤的窗口中的第一个窗口.

如果系统是Android5.0以下, 则始终返回当前活跃的窗口的布局根元素.

## auto.rootInActiveWindow

**[v4.1.0新增]**

* {UiObject}

当前活跃的窗口（获取到焦点、正在触摸的窗口）的布局根元素. 如果无障碍服务未启动则为`null`.

## auto.setWindowFilter(filter)

**[v4.1.0新增]**

* `filter` {Function} 参数为窗口([AccessibilityWindowInfo](https://developer.android.com/reference/android/view/accessibility/AccessibilityWindowInfo/)), 返回值为Boolean的函数.

设置窗口过滤器. 这个过滤器可以决定哪些窗口是目标窗口, 并影响选择器的搜索. 例如, 如果想要选择器在所有窗口（包括状态栏、输入法等）中搜索, 只需要使用以下代码：

```
auto.setWindowFilter(function(window){
    //不管是如何窗口, 都返回true, 表示在该窗口中搜索
    return true;
});
```

又例如, 当前使用了分屏功能, 屏幕上有Auto.js和QQ两个应用, 但我们只想选择器对QQ界面进行搜索, 则：

```
auto.setWindowFilter(function(window){
    // 对于应用窗口, 他的title属性就是应用的名称, 因此可以通过title属性来判断一个应用
    return window.title == "QQ";
});
```

选择器默认是在当前活跃的窗口中搜索, 不会搜索诸如悬浮窗、状态栏之类的, 使用WindowFilter则可以控制搜索的窗口.

需要注意的是, 如果WindowFilter返回的结果均为false, 则选择器的搜索结果将为空.

另外setWindowFilter函数也会影响`auto.windowRoots`的结果.

该函数需要Android 5.0以上才有效.

## auto.windowRoots

**[v4.1.0新增]**

* {Array}

返回当前被WindowFilter过滤的窗口的布局根元素组成的数组.

如果系统是Android5.0以下, 则始终返回当前活跃的窗口的布局根元素的数组.

# SimpleActionAutomator

SimpleActionAutomator提供了一些模拟简单操作的函数, 例如点击文字、模拟按键等. 这些函数可以直接作为全局函数使用.

## click(text[, i])

* `text` {string} 要点击的文本
* `i` {number} 如果相同的文本在屏幕中出现多次, 则i表示要点击第几个文本, i从0开始计算

返回是否点击成功. 当屏幕中并未包含该文本, 或者该文本所在区域不能点击时返回false, 否则返回true.

该函数可以点击大部分包含文字的按钮. 例如微信主界面下方的"微信", "联系人", "发现", "我"的按钮.   
通常与while同时使用以便点击按钮直至成功. 例如:

```
while(!click("扫一扫"));
```

当不指定参数i时则会尝试点击屏幕上出现的所有文字text并返回是否全部点击成功.

i是从0开始计算的, 也就是, `click("啦啦啦", 0)`表示点击屏幕上第一个"啦啦啦", `click("啦啦啦", 1)`表示点击屏幕上第二个"啦啦啦".

> 文本所在区域指的是, 从文本处向其父视图寻找, 直至发现一个可点击的部件为止.

## click(left, top, bottom, right)

* `left` {number} 要点击的长方形区域左边与屏幕左边的像素距离
* `top` {number} 要点击的长方形区域上边与屏幕上边的像素距离
* `bottom` {number} 要点击的长方形区域下边与屏幕下边的像素距离
* `right` {number} 要点击的长方形区域右边与屏幕右边的像素距离

**注意, 该函数一般只用于录制的脚本中使用, 在自己写的代码中使用该函数一般不要使用该函数. **

点击在指定区域的控件. 当屏幕中并未包含与该区域严格匹配的区域, 或者该区域不能点击时返回false, 否则返回true.

有些按钮或者部件是图标而不是文字（例如发送朋友圈的照相机图标以及QQ下方的消息、联系人、动态图标）, 这时不能通过`click(text, i)`来点击, 可以通过描述图标所在的区域来点击. left, bottom, top, right描述的就是点击的区域.

至于要定位点击的区域, 可以在悬浮窗使用布局分析工具查看控件的bounds属性.

通过无障碍服务录制脚本会生成该语句.

## longClick(text[, i]))

* `text` {string} 要长按的文本
* `i` {number} 如果相同的文本在屏幕中出现多次, 则i表示要长按第几个文本, i从0开始计算

返回是否点击成功. 当屏幕中并未包含该文本, 或者该文本所在区域不能点击时返回false, 否则返回true.

当不指定参数i时则会尝试点击屏幕上出现的所有文字text并返回是否全部长按成功.

## scrollUp([i])

* `i` {number} 要滑动的控件序号

找到第i+1个可滑动控件上滑或**左滑**. 返回是否操作成功. 屏幕上没有可滑动的控件时返回false.

另外不加参数时`scrollUp()`会寻找面积最大的可滑动的控件上滑或左滑, 例如微信消息列表等.

参数为一个整数i时会找到第i + 1个可滑动控件滑动. 例如`scrollUp(0)`为滑动第一个可滑动控件.

## scrollDown([i])

* `i` {number} 要滑动的控件序号

找到第i+1个可滑动控件下滑或**右滑**. 返回是否操作成功. 屏幕上没有可滑动的控件时返回false.

另外不加参数时`scrollUp()`会寻找面积最大的可滑动的控件下滑或右滑.

参数为一个整数i时会找到第i + 1个可滑动控件滑动. 例如`scrollUp(0)`为滑动第一个可滑动控件.

## setText([i, ]text)

* i {number} 表示要输入的为第i + 1个输入框
* text {string} 要输入的文本

返回是否输入成功. 当找不到对应的文本框时返回false.

不加参数i则会把所有输入框的文本都置为text. 例如`setText("测试")`.

这里的输入文本的意思是, 把输入框的文本置为text, 而不是在原来的文本上追加.

## input([i, ]text)

* i {number} 表示要输入的为第i + 1个输入框
* text {string} 要输入的文本

返回是否输入成功. 当找不到对应的文本框时返回false.

不加参数i则会把所有输入框的文本追加内容text. 例如`input("测试")`.