# 自动化 (Automator)

---

<aside class="doc-status doc-status--incomplete" data-marked-by="SuperMonster003" data-marked-on="2022-10-22">
<p><strong>文档状态:</strong> 此章节仍在补充或完善中.</p>
</aside>

## 简易自动化 (SimpleActionAutomator)

SimpleActionAutomator 提供按文本或控件序号执行点击, 滚动和文本输入等全局便捷方法. 这些方法依赖无障碍服务, 并在本页 [SimpleActionAutomator](#simpleactionautomator) 小节集中列出.

## 高权限自动化 (RootAutomator)

RootAutomator 通过 Root 权限向设备输入系统写入触摸事件, 可执行按下, 移动, 抬起及多指操作. 它与基于无障碍服务的 `automator` 方法具有不同的运行条件和生命周期, 详见 [RootAutomator](#rootautomator).

## 自动化配置 (AutomatorConfiguration)

可调用对象 `auto` 用于管理无障碍服务状态, 自动化模式, 事件配置, 窗口过滤器及窗口根节点. 本页后半部分以临时作用域对象 `auto` 列出其成员; 选择器和控件节点的独立参考见 [UiSelector](uiSelectorType) 与 [UiObject](uiObjectType).

## 选择器 (UiSelector)

UiSelector (选择器), 亦可看作是 [控件节点](uiObjectType) 的条件筛选器, 用于通过附加不同的条件, 筛选出一个或一组活动窗口中的 `控件节点`, 并做进一步处理, 如 [ 执行 [控件行为](uiObjectActionsType) (点击, 长按, 设置文本等) / 判断位置 / 获取文本内容 / 获取控件特定状态 / 在 [控件层级](glossaries#控件层级) 中进行 [罗盘](uiObjectType#m-compass) 导航 ] 等.

详情参阅 [选择器 (UiSelector)](uiSelectorType) 章节.

## 控件节点 (UiObject)

UiObject 通常被称为 [ 控件 / 节点 / 控件节点 ], 可看做是一个通过安卓无障碍服务包装的 [AccessibilityNodeInfo](https://developer.android.com/reference/android/view/accessibility/AccessibilityNodeInfo) 对象, 代表一个当前活动窗口中的节点, 通过此节点可收集控件信息或执行控件行为, 进而实现一系列自动化操作.

详情参阅 [控件节点 (UiObject)](uiObjectType) 章节.

## 控件集合 (UiObjectCollection)

UiObjectCollection 代表 [控件节点 (UiObject)](uiObjectType) 的对象集合.

详情参阅 [控件集合 (UiObjectCollection)](uiObjectCollectionType) 章节.

## automator.isServiceRunning()

**`6.1.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前进程中是否存在无障碍服务实例

此方法只检查服务实例, 不检查系统设置中的启用状态. 如需同时检查两种状态, 使用 [auto.isRunning](#auto-isrunning).

## automator.ensureService()

**`6.1.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

确保 AutoJs6 无障碍服务已经启动. 方法会先尝试已配置的 Root 或安全设置启动方式, 必要时打开系统无障碍设置页并等待服务. 服务仍不可用时抛出异常.

## automator.waitForService(timeout?)

- **[ timeout = -1 ]** { [number](dataTypes#number) } - 等待超时, 单位为毫秒, `-1` 表示不限时
- <ins>**returns**</ins> { [void](dataTypes#void) }

尝试启动无障碍服务并阻塞当前线程, 直至服务实例建立. 超时或等待被中断时抛出脚本中断异常.

## automator.captureScreen()

**`6.1.0`** **`API>=30!`** **`A11Y`**

- <ins>**returns**</ins> { [ImageWrapper](imageWrapperType) } - 无障碍服务截取的屏幕图像

使用 Android 无障碍服务截图接口截取屏幕. Android API 级别低于 `30` 时抛出异常. 此方法不使用媒体投影截图权限.

## automator.lockScreen()

**`6.1.0`** **`API>=28`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受锁屏全局操作

触发锁屏全局操作. Android API 级别低于 `28` 时仍会尝试执行, 但系统可能返回 `false`.

## automator.takeScreenshot()

**`6.1.0`** **`API>=28`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受截图全局操作

触发系统截图全局操作. 此方法仅返回操作是否被接受, 不返回图像. Android API 级别低于 `28` 时仍会尝试执行.

## automator.accessibilityButton()

**`6.1.0`** **`API>=31`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受无障碍按钮全局操作

触发无障碍按钮全局操作. Android API 级别低于 `31` 时仍会尝试执行.

## automator.accessibilityButtonChooser()

**`6.1.0`** **`API>=31`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受无障碍按钮选择器全局操作

打开无障碍按钮目标选择器. Android API 级别低于 `31` 时仍会尝试执行.

## automator.accessibilityShortcut()

**`6.1.0`** **`API>=31`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受无障碍快捷方式全局操作

触发无障碍快捷方式全局操作. Android API 级别低于 `31` 时仍会尝试执行.

## automator.accessibilityAllApps()

**`6.1.0`** **`API>=31`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受全部应用全局操作

打开系统全部应用界面. Android API 级别低于 `31` 时仍会尝试执行.

## automator.dismissNotificationShade()

**`6.1.0`** **`API>=31`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受收起通知栏全局操作

收起通知栏. Android API 级别低于 `31` 时仍会尝试执行.

## automator.back()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受返回全局操作

触发系统返回操作.

## automator.home()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受主页全局操作

返回系统主页.

## automator.powerDialog()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受电源菜单全局操作

打开系统电源菜单.

## automator.notifications()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受通知栏全局操作

展开系统通知栏.

## automator.quickSettings()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受快速设置全局操作

打开系统快速设置面板.

## automator.recents()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受最近任务全局操作

打开系统最近任务界面.

## automator.splitScreen()

**`Global`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受分屏全局操作

触发系统分屏操作. 操作是否可用还取决于 Android 版本和系统实现.

## automator.headsetHook()

**`6.8.0`** **`A11Y`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统是否接受耳机按键全局操作

触发耳机按键全局操作. 此方法也是 `automator.headsethook()` 的驼峰命名别名.

## automator.switchToInputMethod(packageName)

**`6.8.0`** **`API>=30!`** **`A11Y`**

- **packageName** { [string](dataTypes#string) } - 已启用输入法的应用包名
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否切换成功

查找指定包名对应的已启用输入法并切换到该输入法. 未找到对应输入法时返回 `false`.

## automator.switchToInputMethodWithId(inputMethodId)

**`6.8.0`** **`API>=30!`** **`A11Y`**

- **inputMethodId** { [string](dataTypes#string) } - 输入法 ID
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否切换成功

通过输入法 ID 切换当前输入法.

## 控件节点行为 (UiObjectActions)

UiObjectActions 是一个 Java 接口, 代表 [控件节点 (UiObject)](uiObjectType) 的行为集合.

详情参阅 [控件节点行为 (UiObjectActions)](uiObjectActionsType) 章节.

---

# 基于坐标的触摸模拟

本章节介绍了一些使用坐标进行点击, 滑动的函数. 这些函数有的需要安卓 7.0 以上, 有的需要 root 权限.

要获取要点击的位置的坐标, 可以在开发者选项中开启 "指针位置".

基于坐标的脚本通常会有分辨率的问题, 这时可以通过 `setScreenMetrics()` 函数来进行自动坐标放缩. 这个函数会影响本章节的所有点击, 长按, 滑动等函数. 通过设定脚本设计时的分辨率, 使得脚本在其他分辨率下自动放缩坐标.

控件和坐标也可以相互结合. 一些控件是无法点击的 (clickable 为 false), 无法通过 `.click()` 函数来点击, 这时如果安卓版本在 7.0 以上或者有 root 权限, 就可以通过以下方式来点击:

```
// 获取这个控件.
let widget = id("xxx").findOne();
// 获取其中心位置并点击.
click(widget.bounds().centerX(), widget.bounds().centerY());
// 如果用 root 权限则用 Tap.
```

## setScreenMetrics(width, height)

- **width** { [number](dataTypes#number) } 屏幕宽度, 单位像素
- **height** { [number](dataTypes#number) } 屏幕高度, 单位像素

设置脚本坐标点击所适合的屏幕宽高. 如果脚本运行时, 屏幕宽度不一致会自动放缩坐标.

例如在 1920 * 1080 的设备中, 某个操作的代码为

```
setScreenMetrics(1080, 1920);
click(800, 200);
longClick(300, 500);
```

那么在其他设备上 AutoJs6 会自动放缩坐标以便脚本仍然有效. 例如在 540 * 960 的屏幕中 `click(800, 200)` 实际上会点击位置 (400, 100).

# 安卓 7.0 以上的触摸和手势模拟

**注意以下命令只有 Android 7.0 及以上才有效**

## [m] click

模拟点击. 以下重载均可省略 `automator` 对象前缀.

### click(x, y)

**`Global`** **`Overload 1/6`** **`A11Y`**

- **x** { [number](dataTypes#number) } - X 坐标
- **y** { [number](dataTypes#number) } - Y 坐标
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 点击是否成功

点击指定屏幕坐标. 坐标受 [setScreenMetrics](#setscreenmetrics-width-height) 设置的缩放规则影响.

### click(point)

**`[6.6.1]`** **`Global`** **`Overload 2/6`** **`A11Y`**

- **point** { [number](dataTypes#number)[] | {{ x: [number](dataTypes#number); y: [number](dataTypes#number) }} | [android.graphics.Point](https://developer.android.com/reference/android/graphics/Point) | [OpenCVPoint](opencvPointType) } - 坐标点
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 点击是否成功

点击坐标点. 数组使用前两个元素作为 X 和 Y 坐标; 仅有一个数值元素时, 该值同时作为 X 和 Y 坐标.

### click(text, index?)

**`Global`** **`Overload 3/6`** **`A11Y`**

- **text** { [string](dataTypes#string) } - 控件需要包含的文本
- **[ index = -1 ]** { [number](dataTypes#number) } - 匹配控件索引, 从 `0` 开始
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 目标控件是否点击成功

查找文本包含 `text` 的控件并执行点击行为. 省略 `index` 时尝试点击全部匹配控件.

### click(left, top, right, bottom)

**`Global`** **`Overload 4/6`** **`A11Y`**

- **left** { [number](dataTypes#number) } - 控件边界左坐标
- **top** { [number](dataTypes#number) } - 控件边界上坐标
- **right** { [number](dataTypes#number) } - 控件边界右坐标
- **bottom** { [number](dataTypes#number) } - 控件边界下坐标
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 目标控件是否点击成功

查找边界与四个坐标匹配的控件并执行点击行为.

### click(widget)

**`Global`** **`Overload 5/6`** **`A11Y`**

- **widget** { [UiObject](uiObjectType) } - 控件节点
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 点击是否成功

控件可点击时直接执行 [UiObject#click](uiObjectType#m-click). 否则点击控件边界中心坐标.

### click(bounds)

**`Global`** **`Overload 6/6`** **`A11Y`**

- **bounds** { [AndroidRect](androidRectType) } - 屏幕矩形
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 点击是否成功

点击矩形中心坐标.

## [m] longClick

模拟长按. 参数形态与 [click](#m-click) 相同, 以下重载均可省略 `automator` 对象前缀.

### longClick(x, y)

**`Global`** **`Overload 1/6`** **`A11Y`**

- **x** { [number](dataTypes#number) } - X 坐标
- **y** { [number](dataTypes#number) } - Y 坐标
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 长按是否成功

长按指定屏幕坐标.

### longClick(point)

**`[6.6.1]`** **`Global`** **`Overload 2/6`** **`A11Y`**

- **point** { [number](dataTypes#number)[] | {{ x: [number](dataTypes#number); y: [number](dataTypes#number) }} | [android.graphics.Point](https://developer.android.com/reference/android/graphics/Point) | [OpenCVPoint](opencvPointType) } - 坐标点
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 长按是否成功

长按坐标点. 数组使用前两个元素作为 X 和 Y 坐标; 仅有一个数值元素时, 该值同时作为 X 和 Y 坐标.

### longClick(text, index?)

**`Global`** **`Overload 3/6`** **`A11Y`**

- **text** { [string](dataTypes#string) } - 控件需要包含的文本
- **[ index = -1 ]** { [number](dataTypes#number) } - 匹配控件索引, 从 `0` 开始
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 目标控件是否长按成功

查找文本包含 `text` 的控件并执行长按行为. 省略 `index` 时尝试长按全部匹配控件.

### longClick(left, top, right, bottom)

**`Global`** **`Overload 4/6`** **`A11Y`**

- **left** { [number](dataTypes#number) } - 控件边界左坐标
- **top** { [number](dataTypes#number) } - 控件边界上坐标
- **right** { [number](dataTypes#number) } - 控件边界右坐标
- **bottom** { [number](dataTypes#number) } - 控件边界下坐标
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 目标控件是否长按成功

查找边界与四个坐标匹配的控件并执行长按行为.

### longClick(widget)

**`Global`** **`Overload 5/6`** **`A11Y`**

- **widget** { [UiObject](uiObjectType) } - 控件节点
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 长按是否成功

控件可长按时直接执行 [UiObject#longClick](uiObjectType#m-longclick). 否则长按控件边界中心坐标.

### longClick(bounds)

**`Global`** **`Overload 6/6`** **`A11Y`**

- **bounds** { [AndroidRect](androidRectType) } - 屏幕矩形
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 长按是否成功

长按矩形中心坐标.

## press(x, y, duration)

- **x** { [number](dataTypes#number) } 要按住的坐标的 x 值
- **y** { [number](dataTypes#number) } 要按住的坐标的 y 值
- **duration** { [number](dataTypes#number) } 按住时长, 单位毫秒

模拟按住坐标 (x, y), 并返回是否成功. 只有按住操作执行完成时脚本才会继续执行.

如果按住时间过短, 那么会被系统认为是点击; 如果时长超过 500 毫秒, 则认为是长按.

一般而言, 只有按住过程中被其他事件中断才会操作失败.

一个连点器的例子如下:

```
// 循环 100 次.
for(let i = 0; i < 100; i++){
  // 点击位置 (500, 1000), 每次用时 1 毫秒.
  press(500, 1000, 1);
}
```

## swipe(x1, y1, x2, y2, duration)

- **x1** { [number](dataTypes#number) } 滑动的起始坐标的 x 值
- **y1** { [number](dataTypes#number) } 滑动的起始坐标的 y 值
- **x2** { [number](dataTypes#number) } 滑动的结束坐标的 x 值
- **y2** { [number](dataTypes#number) } 滑动的结束坐标的 y 值
- **duration** { [number](dataTypes#number) } 滑动时长, 单位毫秒

模拟从坐标 (x1, y1) 滑动到坐标 (x2, y2), 并返回是否成功. 只有滑动操作执行完成时脚本才会继续执行.

一般而言, 只有滑动过程中被其他事件中断才会滑动失败.

## gesture(duration, [x1, y1], [x2, y2], ...)

- **duration** { [number](dataTypes#number) } 手势的时长
- **points** { [...](documentation#可变参数)[number](dataTypes#number)[[]](documentation#可变参数) } - 手势滑动路径的坐标点

模拟手势操作. 例如 `gesture(1000, [0, 0], [500, 500], [500, 1000])` 为模拟一个从 (0, 0) 到 (500, 500) 到 (500, 100) 的手势操作, 时长为 2 秒.

## [m] gestureAsync

### gestureAsync(duration, points, callback?)

**`6.2.0`** **`[6.6.0]`** **`Global`** **`A11Y`** **`Async`**

- **duration** { [number](dataTypes#number) } - 手势持续时间, 单位毫秒
- **points** { [number](dataTypes#number)[] | [number](dataTypes#number)[][] } - 路径坐标
- **[ callback ]** { [Function](dataTypes#function) | [android.accessibilityservice.AccessibilityService.GestureResultCallback](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService.GestureResultCallback) | {{ onCompleted?(gesture: [android.accessibilityservice.GestureDescription](https://developer.android.com/reference/android/accessibilityservice/GestureDescription)): [void](dataTypes#void); onCancelled?(gesture: [android.accessibilityservice.GestureDescription](https://developer.android.com/reference/android/accessibilityservice/GestureDescription)): [void](dataTypes#void) }} - 手势结果回调
- <ins>**returns**</ins> { [void](dataTypes#void) }

异步提交单个手势. `points` 可作为一个扁平坐标数组, 一个坐标点数组, 或拆成多个坐标点实参. 扁平数组按 `x1, y1, x2, y2, ...` 解析, 元素数量必须为偶数.

回调为函数时接收一个布尔值, `true` 表示完成, `false` 表示取消. 回调为对象时, 完成和取消分别调用 `onCompleted` 与 `onCancelled`, 并传入 Android `GestureDescription`.

> 方法变更记录
> - 6.6.0 - 支持回调函数, 回调对象和 Android `GestureResultCallback`.

```js
gestureAsync(500, [ [ 100, 200 ], [ 500, 800 ] ], success => {
    console.log(success);
});
```

## gestures([delay1, duration1, [x1, y1], [x2, y2], ...], [delay2, duration2, [x3, y3], [x4, y4], ...], ...)

同时模拟多个手势. 每个手势的参数为 \[delay, duration, 坐标\], delay 为延迟多久 (毫秒) 才执行该手势; duration 为手势执行时长; 坐标为手势经过的点的坐标. 其中 delay 参数可以省略, 默认为 0.

例如手指捏合:

```
gestures([0, 500, [800, 300], [500, 1000]],
         [0, 500, [300, 1500], [500, 1000]]);
```

## [m] gesturesAsync

### gesturesAsync(...strokesAndCallback)

**`6.2.0`** **`[6.6.0]`** **`Global`** **`A11Y`** **`Async`**

- **...strokesAndCallback** { [...](documentation#可变参数)[Object](dataTypes#object)[[]](documentation#可变参数) } - 一个或多个笔画参数, 末尾可附加手势结果回调
- <ins>**returns**</ins> { [void](dataTypes#void) }

异步提交一个或多个同步或错时执行的手势笔画. 每个笔画使用以下形式之一:

- `[ duration, [ x, y ], ...points ]`, `startTime` 默认为 `0`
- `[ startTime, duration, [ x, y ], ...points ]`

最后一个实参可以是 [gestureAsync](#m-gestureasync) 支持的回调函数, 回调对象或 Android `GestureResultCallback`, 回调语义相同.

> 方法变更记录
> - 6.6.0 - 支持回调函数, 回调对象和 Android `GestureResultCallback`.

```js
gesturesAsync(
    [ 0, 500, [ 800, 300 ], [ 500, 1000 ] ],
    [ 0, 500, [ 300, 1500 ], [ 500, 1000 ] ],
    success => console.log(success),
);
```

# RootAutomator

RootAutomator 是一个使用 root 权限来模拟触摸的对象, 用它可以完成触摸与多点触摸, 并且这些动作的执行没有延迟.

一个脚本中最好只存在一个 RootAutomator, 并且保证脚本结束退出他. 可以在 exit 事件中退出 RootAutomator, 例如:

```
let ra = new RootAutomator();
events.on('exit', function(){
  ra.exit();
});
// 执行一些点击操作.
...

```

**注意以下命令需要 root 权限**

## RootAutomator.tap(x, y[, id])

- **x** { [number](dataTypes#number) } 横坐标
- **y** { [number](dataTypes#number) } 纵坐标
- **id** { [number](dataTypes#number) } 多点触摸 id, 可选, 默认为 1, 可以通过 setDefaultId 指定.

点击位置 (x, y). 其中 id 是一个整数值, 用于区分多点触摸, 不同的 id 表示不同的 "手指", 例如:

```
let ra = new RootAutomator();
// 让 "手指 1" 点击位置 (100, 100).
ra.tap(100, 100, 1);
// 让 "手指 2" 点击位置 (200, 200).
ra.tap(200, 200, 2);
ra.exit();
```

如果不需要多点触摸, 则不需要 id 这个参数.
多点触摸通常用于手势或游戏操作, 例如模拟双指捏合, 双指上滑等.

某些情况下可能存在 tap 点击无反应的情况, 这时可以用 `RootAutomator.press()` 函数代替.

## RootAutomator.swipe(x1, x2, y1, y2[, duration, id])

- **x1** { [number](dataTypes#number) } 滑动起点横坐标
- **y1** { [number](dataTypes#number) } 滑动起点纵坐标
- **x2** { [number](dataTypes#number) } 滑动终点横坐标
- **y2** { [number](dataTypes#number) } 滑动终点纵坐标
- **duration** { [number](dataTypes#number) } 滑动时长, 单位毫秒, 默认值为 300
- **id** { [number](dataTypes#number) } 多点触摸 id, 可选, 默认为 1

模拟一次从 (x1, y1) 到 (x2, y2) 的时间为 duration 毫秒的滑动.

## RootAutomator.press(x, y, duration[, id])

- **x** { [number](dataTypes#number) } 横坐标
- **y** { [number](dataTypes#number) } 纵坐标
- **duration** { [number](dataTypes#number) } 按下时长
- **id** { [number](dataTypes#number) } 多点触摸 id, 可选, 默认为 1

模拟按下位置 (x, y), 时长为 duration 毫秒.

## RootAutomator.longPress(x, y[\, id\])

- **x** { [number](dataTypes#number) } 横坐标
- **y** { [number](dataTypes#number) } 纵坐标
- **duration** { [number](dataTypes#number) } 按下时长
- **id** { [number](dataTypes#number) } 多点触摸 id, 可选, 默认为 1

模拟长按位置 (x, y).

以上为简单模拟触摸操作的函数. 如果要模拟一些复杂的手势, 需要更底层的函数.

## RootAutomator.touchDown(x, y[, id])

- **x** { [number](dataTypes#number) } 横坐标
- **y** { [number](dataTypes#number) } 纵坐标
- **id** { [number](dataTypes#number) } 多点触摸 id, 可选, 默认为 1

模拟手指按下位置 (x, y).

## RootAutomator.touchMove(x, y[, id])

- **x** { [number](dataTypes#number) } 横坐标
- **y** { [number](dataTypes#number) } 纵坐标
- **id** { [number](dataTypes#number) } 多点触摸 id, 可选, 默认为 1

模拟移动手指到位置 (x, y).

## RootAutomator.touchUp([id])

- **id** { [number](dataTypes#number) } 多点触摸 id, 可选, 默认为 1

模拟手指弹起.

# 使用 root 权限点击和滑动的简单命令

注意: 本章节的函数在后续版本很可能有改动! 请勿过分依赖本章节函数的副作用. 推荐使用 `RootAutomator` 代替本章节的触摸函数.

以下函数均需要 root 权限, 可以实现任意位置的点击, 滑动等.

* 这些函数通常首字母大写以表示其特殊的权限.
* 这些函数均不返回任何值.
* 并且, 这些函数的执行是异步的, 非阻塞的, 在不同机型上所用的时间不同. 脚本不会等待动作执行完成才继续执行. 因此最好在每个函数之后加上适当的 sleep 来达到期望的效果.

例如:

```
Tap(100, 100);
sleep(500);
```

注意, 动作的执行可能无法被停止, 例如:

```
for(let i = 0; i < 100; i++){
  Tap(100, 100);
}
```

这段代码执行后可能会出现在任务管理中停止脚本后点击仍然继续的情况.
因此, 强烈建议在每个动作后加上延时:

```
for(let i = 0; i < 100; i++){
  Tap(100, 100);
  sleep(500);
}
```

## Tap(x, y)

- **x, y** { [number](dataTypes#number) } 要点击的坐标.

点击位置 (x, y), 您可以通过 "开发者选项" 开启指针位置来确定点击坐标.

## Swipe(x1, y1, x2, y2, \[duration\])

- **x1, y1** { [number](dataTypes#number) } 滑动起点的坐标
- **x2, y2** { [number](dataTypes#number) } 滑动终点的坐标
- **duration** { [number](dataTypes#number) } 滑动动作所用的时间

滑动. 从 (x1, y1) 位置滑动到 (x2, y2) 位置.

# 基于控件的操作

基于控件的操作指的是选择屏幕上的控件, 获取其信息或对其进行操作. 对于一般软件而言, 基于控件的操作对不同机型有很好的兼容性; 但是对于游戏而言, 由于游戏界面并不是由控件构成, 无法采用本章节的方法, 也无法使用本章节的函数. 有关游戏脚本的编写, 请参考 "基于坐标的操作".

基于控件的操作依赖于无障碍服务, 因此最好在脚本开头使用 `auto()` 函数来确保无障碍服务已经启用. 如果运行到某个需要权限的语句无障碍服务并没启动, 则会抛出异常并跳转到无障碍服务界面. 这样的用户体验并不好, 因为需要重新运行脚本, 后续会加入等待无障碍服务启动并让脚本继续运行的函数.

您也可以在脚本开头使用 `"auto";` 表示这个脚本需要无障碍服务, 但是不推荐这种做法, 因为这个标记必须在脚本的最开头 (前面不能有注释或其他语句, 空格等), 我们推荐使用 `auto()` 函数来确保无障碍服务已启用.

---

<p style="font: bold 1em sans-serif; color: #FF7043">auto</p>

---

## auto([mode])

- **mode** { [string](dataTypes#string) } 模式

检查无障碍服务是否已经启用, 如果没有启用则抛出异常并跳转到无障碍服务启用界面; 同时设置无障碍模式为 mode. mode 的可选值为:

* `fast` 快速模式. 该模式下会启用控件缓存, 从而选择器获取屏幕控件更快. 对于需要快速的控件操作的脚本可以使用该模式, 一般脚本则没有必要使用该函数.
* `normal` 正常模式, 默认.

如果不加 mode 参数, 则为正常模式.

建议使用 `auto.waitFor()` 和 `auto.setMode()` 代替该函数, 因为 `auto()` 函数如果无障碍服务未启动会停止脚本; 而 `auto.waitFor()` 则会在在无障碍服务启动后继续运行.

示例:

```
auto("fast");
```

示例 2:

```
auto();
```

## auto.start()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已启动或确认无障碍服务正在运行

尝试通过已配置的 Root 或安全设置方式启动 AutoJs6 无障碍服务. 无法自动启动时打开系统无障碍设置页并返回 `false`.

## auto.stop()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否已停止或确认无障碍服务未运行

尝试通过 Root, 安全设置或服务自身接口停止 AutoJs6 无障碍服务. 无法自动停止时打开系统无障碍设置页并返回 `false`.

## auto.enable()

**`6.6.2`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

[auto.start](#auto-start) 的别名.

## auto.disable()

**`6.6.2`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

[auto.stop](#auto-stop) 的别名.

## auto.hasInstance()

**`6.7.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 当前进程中是否存在无障碍服务实例

## auto.hasService()

**`6.7.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 系统设置中是否已启用 AutoJs6 无障碍服务

## auto.exists()

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

[auto.hasService](#auto-hasservice) 的兼容方法.

## auto.isRunning()

**`[6.7.0]`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 服务是否已启用且当前进程中存在服务实例

## auto.isOperational()

**`6.7.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 服务是否已运行并在当前进程中确认可工作

## [p] state

**`6.7.0`** **`Getter`**

- {{
    - hasInstance: [boolean](dataTypes#boolean);
    - hasService: [boolean](dataTypes#boolean);
    - isRunning: [boolean](dataTypes#boolean);
    - isOperational: [boolean](dataTypes#boolean);
- }}

返回无障碍服务状态快照. 每次读取都会创建一个新对象:

- `hasInstance` 表示当前进程中是否存在 AutoJs6 无障碍服务实例
- `hasService` 表示系统设置中是否已启用 AutoJs6 无障碍服务
- `isRunning` 表示 `hasInstance` 和 `hasService` 是否同时为 `true`
- `isOperational` 表示服务已运行, 且当前进程已确认服务可工作

```js
let state = auto.state;
console.log(state.hasService, state.isOperational);
```

## auto.stateListener(listener?)

**`6.3.3`**

- **[ listener ]** { [Object](dataTypes#object) | [null](dataTypes#null) } - 包含 `onConnected()` 和 `onDisconnected()` 方法的服务连接状态监听器
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置当前脚本运行时的无障碍服务连接状态监听器. 服务连接时调用 `onConnected()`, 断开时调用 `onDisconnected()`. 省略监听器或传入 `null` 或 `undefined` 时清除监听器.

## auto.launchSettings()

- <ins>**returns**</ins> { [void](dataTypes#void) }

打开 Android 系统无障碍设置页, 并提示用户选择 AutoJs6.

## auto.currentPackage()

**`6.6.1`** **`A11Y?`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 最近识别的前台应用包名, 未识别时为空字符串

返回无障碍运行时最近记录的应用包名. 结果是否依赖无障碍服务受 [auto.setFlags](#auto-setflags-flags) 配置影响.

## auto.currentActivity()

**`6.6.1`** **`A11Y?`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 最近识别的前台 Activity 名称, 未识别时为空字符串

## auto.currentComponent()

**`6.6.1`** **`A11Y?`**

- <ins>**returns**</ins> { [string](dataTypes#string) } - 最近识别的前台组件名称, 未识别时为空字符串

包名和 Activity 名称均可用时返回 `packageName/activityName`, 否则返回空字符串.

## [m] clearCache

### clearCache()

**`6.6.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 是否成功调用系统缓存清理接口

清除 Android 无障碍交互客户端维护的控件缓存. 系统接口不可访问或调用异常时返回 `false`.

## [m] registerEvent

### registerEvent(name, listener)

**`6.3.3`** **`A11Y`**

- **name** { [string](dataTypes#string) } - 无障碍事件名称
- **listener** { [Function](dataTypes#function) | {{ onAccessibilityEvent(event: [Object](dataTypes#object)): [void](dataTypes#void) }} | [null](dataTypes#null) } - 事件监听器
- <ins>**returns**</ins> { [void](dataTypes#void) }

注册当前脚本的无障碍事件监听器. `name` 对应 Android [AccessibilityEvent](https://developer.android.com/reference/android/view/accessibility/AccessibilityEvent) 的 `TYPE_*` 常量名, 省略 `TYPE_` 前缀且不区分大小写, 如 `window_state_changed` 或 `view_clicked`.

回调参数是无障碍事件包装对象, 包含 `raw`, `packageName`, `eventType`, `eventTime`, `action`, `isFullScreen`, `className` 和 `source` 属性. `source` 可用时为 [UiObject](uiObjectType).

同一脚本对同一事件再次注册会替换原监听器. `listener` 为 `null` 或 `undefined` 时移除该事件监听器. [auto.registerEvents](#m-registerevents) 是此方法的兼容别名.

```js
auto.registerEvent('view_clicked', {
    onAccessibilityEvent(event) {
        console.log(event.packageName, event.source);
    },
});
```

## [m] registerEvents

### registerEvents(name, listener)

**`6.3.3`** **`A11Y`**

- **name** { [string](dataTypes#string) } - 无障碍事件名称
- **listener** { [Function](dataTypes#function) | {{ onAccessibilityEvent(event: [Object](dataTypes#object)): [void](dataTypes#void) }} | [null](dataTypes#null) } - 事件监听器
- <ins>**returns**</ins> { [void](dataTypes#void) }

[auto.registerEvent](#m-registerevent) 的兼容别名. 此方法仍只注册一个事件名称.

## [m] removeEvent

### removeEvent(name)

**`6.3.3`** **`A11Y`**

- **name** { [string](dataTypes#string) } - 无障碍事件名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

移除当前脚本通过 [auto.registerEvent](#m-registerevent) 注册的指定事件监听器. [auto.removeEvents](#m-removeevents) 是此方法的兼容别名.

## [m] removeEvents

### removeEvents(name)

**`6.3.3`** **`A11Y`**

- **name** { [string](dataTypes#string) } - 无障碍事件名称
- <ins>**returns**</ins> { [void](dataTypes#void) }

[auto.removeEvent](#m-removeevent) 的兼容别名. 此方法仍只移除一个事件名称.

## auto.waitFor()

检查无障碍服务是否已经启用, 如果没有启用则跳转到无障碍服务启用界面, 并等待无障碍服务启动; 当无障碍服务启动后脚本会继续运行.

因为该函数是阻塞的, 因此除非是有协程特性, 否则不能在 ui 模式下运行该函数, 建议在 ui 模式下使用 `auto()` 函数.

## auto.setMode(mode)

- **mode** { [string](dataTypes#string) } 模式

设置无障碍模式为 mode. mode 的可选值为:

* `fast` 快速模式. 该模式下会启用控件缓存, 从而选择器获取屏幕控件更快. 对于需要快速的控件查看和操作的脚本可以使用该模式, 一般脚本则没有必要使用该函数.
* `normal` 正常模式, 默认.

## auto.setFlags(flags)

**[v4.1.0 新增]**

- **flags** { [string](dataTypes#string) } | { [Array](dataTypes#array) } 一些标志, 来启用和禁用某些特性, 包括:
    * `findOnUiThread` 使用该特性后, 选择器搜索时会在主进程进行. 该特性用于解决线程安全问题导致的次生问题, 不过目前貌似已知问题并不是线程安全问题.
    * `useUsageStats` 使用该特性后, 将会以 "使用情况统计" 服务的结果来检测当前正在运行的应用包名 (需要授予 "查看使用情况统计" 权限). 如果觉得 currentPackage() 返回的结果不太准确, 可以尝试该特性.
    * `useShell` 使用该特性后, 将使用 shell 命令获取当前正在运行的应用的包名, 活动名称, 但是需要 root 权限.

启用有关 automator 的一些特性. 例如:

```
auto.setFlags(["findOnUiThread", "useShell"]);
```

## auto.service

**[v4.1.0 新增]**

* [AccessibilityService](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService/)

获取无障碍服务. 如果无障碍服务没有启动, 则返回 `null`.

参见 [AccessibilityService](https://developer.android.com/reference/android/accessibilityservice/AccessibilityService/).

## [p] services

**`6.6.0`** **`Getter`**

- { [string](dataTypes#string)[] } - 系统设置中已启用的无障碍服务组件名称

通过可用的安全设置权限或 Root 权限读取 `enabled_accessibility_services`, 并按组件分隔符拆分为数组. 两种权限均不可用时返回空数组.

## auto.windows

**[v4.1.0 新增]**

- { [Array](dataTypes#array) }

当前所有窗口 ([AccessibilityWindowInfo](https://developer.android.com/reference/android/view/accessibility/AccessibilityWindowInfo/)) 的数组, 可能包括状态栏, 输入法, 当前应用窗口, 弹出窗口, 悬浮窗, 分屏应用窗口等. 可以分别获取每个窗口的布局信息.

该函数需要 Android 5.0 以上才能运行.

## auto.getWindowRoot(window)

**`6.8.0`** **`A11Y`**

- **window** { [AccessibilityWindowInfo](https://developer.android.com/reference/android/view/accessibility/AccessibilityWindowInfo) } - 无障碍窗口
- <ins>**returns**</ins> { [UiObject](uiObjectType) | [null](dataTypes#null) } - 窗口根节点, 不可用时返回 `null`

获取指定无障碍窗口的控件树根节点. `window` 通常来自 [auto.windows](#auto-windows).

## auto.root

**[v4.1.0 新增]**

* {UiObject}

当前窗口的布局根元素. 如果无障碍服务未启动或者 WindowFilter 均返回 false, 则会返回 `null`.

如果不设置 windowFilter, 则当前窗口即为活跃的窗口 (获取到焦点, 正在触摸的窗口); 如果设置了 windowFilter, 则获取的是过滤的窗口中的第一个窗口.

如果系统是 Android 5.0 以下, 则始终返回当前活跃的窗口的布局根元素.

## auto.rootInActiveWindow

**[v4.1.0 新增]**

* {UiObject}

当前活跃的窗口 (获取到焦点, 正在触摸的窗口) 的布局根元素. 如果无障碍服务未启动则为 `null`.

## auto.setWindowFilter(filter)

**[v4.1.0 新增]**

- **filter** { [Function](dataTypes#function) } 参数为窗口 ([AccessibilityWindowInfo](https://developer.android.com/reference/android/view/accessibility/AccessibilityWindowInfo/)), 返回值为 Boolean 的函数.

设置窗口过滤器. 这个过滤器可以决定哪些窗口是目标窗口, 并影响选择器的搜索. 例如, 如果想要选择器在所有窗口 (包括状态栏, 输入法等) 中搜索, 只需要使用以下代码:

```
auto.setWindowFilter(function(window){
    // 不管是如何窗口, 都返回 true, 表示在该窗口中搜索.
    return true;
});
```

又例如, 当前使用了分屏功能, 屏幕上有 AutoJs6 和 QQ 两个应用, 但我们只想选择器对 QQ 界面进行搜索, 则:

```
auto.setWindowFilter(function(window){
    // 对于应用窗口, 他的 title 属性就是应用的名称, 因此可以通过 title 属性来判断一个应用.
    return window.title == "QQ";
});
```

选择器默认是在当前活跃的窗口中搜索, 不会搜索诸如悬浮窗, 状态栏之类的, 使用 WindowFilter 则可以控制搜索的窗口.

需要注意的是, 如果 WindowFilter 返回的结果均为 false, 则选择器的搜索结果将为空.

另外 setWindowFilter 函数也会影响 `auto.windowRoots` 的结果.

该函数需要 Android 5.0 以上才有效.

## auto.windowRoots

**[v4.1.0 新增]**

- { [Array](dataTypes#array) }

返回当前被 WindowFilter 过滤的窗口的布局根元素组成的数组.

如果系统是 Android 5.0 以下, 则始终返回当前活跃的窗口的布局根元素的数组.

# SimpleActionAutomator

SimpleActionAutomator 提供了一些模拟简单操作的函数, 例如点击文字, 模拟按键等. 这些函数可以直接作为全局函数使用.

## scrollUp([i])

- **i** { [number](dataTypes#number) } 要滑动的控件序号

找到第 i + 1 个可滑动控件上滑或 **左滑**. 返回是否操作成功. 屏幕上没有可滑动的控件时返回 false.

另外不加参数时 `scrollUp()` 会寻找面积最大的可滑动的控件上滑或左滑, 例如微信消息列表等.

参数为一个整数 i 时会找到第 i + 1 个可滑动控件滑动. 例如 `scrollUp(0)` 为滑动第一个可滑动控件.

## scrollDown([i])

- **i** { [number](dataTypes#number) } 要滑动的控件序号

找到第 i + 1 个可滑动控件下滑或 **右滑**. 返回是否操作成功. 屏幕上没有可滑动的控件时返回 false.

另外不加参数时 `scrollUp()` 会寻找面积最大的可滑动的控件下滑或右滑.

参数为一个整数 i 时会找到第 i + 1 个可滑动控件滑动. 例如 `scrollUp(0)` 为滑动第一个可滑动控件.

## setText([i, ]text)

- **i** { [number](dataTypes#number) } 表示要输入的为第 i + 1 个输入框
- **text** { [string](dataTypes#string) } 要输入的文本

返回是否输入成功. 当找不到对应的文本框时返回 false.

不加参数 i 则会把所有输入框的文本都置为 text. 例如 `setText("测试")`.

这里的输入文本的意思是, 把输入框的文本置为 text, 而不是在原来的文本上追加.

## input([i, ]text)

- **i** { [number](dataTypes#number) } 表示要输入的为第 i + 1 个输入框
- **text** { [string](dataTypes#string) } 要输入的文本

返回是否输入成功. 当找不到对应的文本框时返回 false.

不加参数 i 则会把所有输入框的文本追加内容 text. 例如 `input("测试")`.
