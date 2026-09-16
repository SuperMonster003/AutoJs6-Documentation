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

## 工具集与事件驱动等待

6.8.0 新增的 [工具集](#工具集-toolkit) 提供智能点击, 滚动查找, 文本输入, 弹窗关闭, 列表采集, 应用切换与开关切换等高阶自动化函数; [事件驱动等待](#事件驱动等待) 提供基于无障碍事件的界面空闲, 事件, Toast 与通知等待. 两者都同时具备同步形式 (全局函数与 `automator.*`) 与 [Flow](flow) 形式.

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

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 无障碍服务是否已启用且当前进程中存在服务实例

与 [auto.isRunning](#auto-isrunning) 语义一致: 系统设置中已启用 AutoJs6 无障碍服务, 且当前进程中存在服务实例.

> 注: 6.8.0 之前此方法只检查服务实例, 不检查系统设置中的启用状态.

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
    - adoptedByEvent: [boolean](dataTypes#boolean);
- }}

返回无障碍服务状态快照. 每次读取都会创建一个新对象:

- `hasInstance` 表示当前进程中是否存在 AutoJs6 无障碍服务实例
- `hasService` 表示系统设置中是否已启用 AutoJs6 无障碍服务
- `isRunning` 表示 `hasInstance` 和 `hasService` 是否同时为 `true`
- `isOperational` 表示服务已运行, 且当前进程已确认服务可工作
- `adoptedByEvent` (**`6.8.0`**) 表示当前服务实例是否由先于连接回调到达的无障碍事件采纳而来. 正常连接时为 `false`; 为 `true` 说明系统在 `onServiceConnected` 之前就开始投递事件, 服务由事件确认为可用

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

返回无障碍运行时最近记录的应用包名. 结果是否依赖无障碍服务受 [auto.setFlags](#m-setflags) 配置影响.

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

> 注: 在 API 33 以下的设备上, 系统会在回调返回后回收事件对象, 因此 `source` 需要在回调期间读取, 回调返回后再读取得到 `null`. API 33 及以上没有此限制.

### registerEvent(name, listener, options)

**`6.8.0`** **`A11Y`**

- **name** { [string](dataTypes#string) } - 无障碍事件名称
- **listener** { [Function](dataTypes#function) | {{ onAccessibilityEvent(event: [Object](dataTypes#object)): [void](dataTypes#void) }} } - 事件监听器
- **options** {{
    - distinct?: `'window'` \| `'source'` \| `true` \| [(event) => any](dataTypes#function)
    - within?: [number](dataTypes#number)
    - debounce?: [number](dataTypes#number)
- }} - 过滤选项
- <ins>**returns**</ins> { [void](dataTypes#void) }

带过滤选项的注册, 用于抑制密集重复的事件:

- `distinct` - 在 `within` 毫秒内 (默认 `500`) 丢弃与上一次投递的事件 "键" 相同的事件. `'window'` 以包名 + 类名为键, `'source'` 另加来源节点, `true` 同 `'window'`, 函数则以其返回值为键
- `debounce` - 一串密集事件在该毫秒数内没有新事件到达后, 只投递其中最后一个

```js
/* 同一窗口的内容变化 1 秒内只处理一次. */
auto.registerEvent('window_content_changed', e => console.log(e.packageName), { distinct: 'window', within: 1e3 });

/* 滚动停止 300 毫秒后处理一次. */
auto.registerEvent('view_scrolled', e => console.log('滚动结束'), { debounce: 300 });
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

## [m] setFlags

### setFlags(flags)

**`A11Y?`**

- **flags** { [string](dataTypes#string) \| [string](dataTypes#string)[] } - 一个或多个标志名
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置 automator 的特性标志. 每次调用以给出的标志集合替换之前的设置, 未知的标志名抛出异常.

- `findOnUiThread` - 选择器搜索在主线程进行
- `useUsageStats` - 以 "使用情况统计" 服务的结果确定当前应用包名 (需要授予 "查看使用情况统计" 权限). 如果 [currentPackage()](global#m-currentpackage) 的结果不准确, 可尝试此标志
- `useShell` - 以 shell 命令获取当前应用的包名与活动名称 (需要 root 权限)
- `appWindowsFallback` (**`6.8.0`**) - 系统暂未提供活动窗口根节点时 (如服务刚绑定后; API 26 上可能持续到下一次窗口变化), 以窗口列表中应用窗口的根节点代替 (焦点窗口优先, 其次活动窗口). 默认关闭, 此时查询返回空结果
- `eventAssistedPolling` (**`6.8.0`**) - 重复的选择器查询 (如 [findOne(timeout)](uiSelectorType#m-findone), [wait](global#m-wait)), 节点等待 ([waitUntilGone](uiObjectType#m-waituntilgone) 等) 与 [Flow](flow) 等待在两次尝试之间休眠到无障碍事件到达为止, 而非固定间隔. 通常能更早发现目标并减少无效查询. 默认关闭

```js
auto.setFlags([ 'findOnUiThread', 'useShell' ]);
auto.setFlags('eventAssistedPolling');
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

## [m] setWindowFilter

### setWindowFilter(filter?)

**`A11Y`**

- **[ filter ]** { [(window: AccessibilityWindowInfo) => boolean](dataTypes#function) \| [WindowFilter](#窗口过滤器对象-windowfilter) \| [boolean](dataTypes#boolean) \| [null](dataTypes#null) } - 窗口过滤器
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置窗口过滤器. 过滤器决定哪些窗口是选择器的搜索目标, 同时影响 [auto.root](#auto-root) 与 [auto.windowRoots](#auto-windowroots) 的结果.

- 函数: 参数为窗口 ([AccessibilityWindowInfo](https://developer.android.com/reference/android/view/accessibility/AccessibilityWindowInfo/)), 返回真值表示搜索该窗口
- 对象 (**`6.8.0`**): [窗口过滤器对象](#窗口过滤器对象-windowfilter), 按窗口类型, 包名, 标题等属性匹配
- `true`: 搜索全部窗口 (包括状态栏, 输入法, 悬浮窗等); `false`: 不搜索任何窗口, 选择器结果为空
- 省略或 `null`: 同 `true`

选择器默认只在当前活动窗口 (获得焦点或正在触摸的窗口) 中搜索, 不搜索悬浮窗, 状态栏等; 设置过滤器后, 在通过过滤器的全部窗口中搜索, 且 [auto.root](#auto-root) 为其中首个有根节点的窗口的根节点.

```js
/* 在全部窗口中搜索. */
auto.setWindowFilter(window => true);
auto.setWindowFilter(true); /* 同上. */

/* 分屏时只搜索 QQ 的窗口 (应用窗口的 title 即应用名称). */
auto.setWindowFilter(window => window.title == 'QQ');
auto.setWindowFilter({ title: 'QQ' }); /* 同上. */

/* 只搜索输入法窗口. */
auto.setWindowFilter({ type: 'inputMethod' });
```

> 注: 只需一次性地在某些窗口中查找时, 可用 [auto.findWindowRoots](#m-findwindowroots) 取得根节点, 再用节点的 [find](uiObjectType#m-find) 等方法, 不必改变全局的窗口过滤器.

## 窗口过滤器对象 (WindowFilter)

**`6.8.0`**

用于 [auto.setWindowFilter](#m-setwindowfilter), [auto.findWindows](#m-findwindows) 与 [auto.findWindowRoots](#m-findwindowroots) 的窗口匹配条件. 给出的键全部满足时窗口通过; 未知的键抛出异常.

- **[ type ]** { [string](dataTypes#string) \| [string](dataTypes#string)[] } - 窗口类型名, 一个或多个: `'application'`, `'inputMethod'`, `'system'`, `'accessibilityOverlay'`, `'splitScreenDivider'`, `'magnificationOverlay'` (不区分大小写, 也接受下划线写法如 `'input_method'`)
- **[ packageName ]** { [string](dataTypes#string) \| [RegExp](dataTypes#regexp) } - 包名, 字符串整体匹配, 正则表达式搜索匹配
- **[ title ]** { [string](dataTypes#string) \| [RegExp](dataTypes#regexp) } - 窗口标题, 匹配规则同上
- **[ displayId ]** { [number](dataTypes#number) } - 显示屏 ID
- **[ active ]** { [boolean](dataTypes#boolean) } - 是否活动窗口
- **[ focused ]** { [boolean](dataTypes#boolean) } - 是否焦点窗口
- **[ id ]** { [number](dataTypes#number) } - 窗口 ID
- **[ layer ]** { [number](dataTypes#number) } - 窗口层级

```js
auto.findWindows({ type: 'application', packageName: /settings/ });
auto.findWindows({ type: [ 'system', 'accessibilityOverlay' ] });
auto.findWindows({ focused: true });
```

## auto.windowRoots

**[v4.1.0 新增]**

- { [Array](dataTypes#array) }

返回当前被 WindowFilter 过滤的窗口的布局根元素组成的数组.

如果系统是 Android 5.0 以下, 则始终返回当前活跃的窗口的布局根元素的数组.

## [m] findWindows

### findWindows(filter?)

**`6.8.0`** **`A11Y`**

- **[ filter ]** { [WindowFilter](#窗口过滤器对象-windowfilter) } - 窗口过滤器对象
- <ins>**returns**</ins> { [AccessibilityWindowInfo](https://developer.android.com/reference/android/view/accessibility/AccessibilityWindowInfo/)[] } - 通过过滤器的窗口, 按系统给出的顺序

按过滤器对象筛选当前全部窗口. 省略参数时返回全部窗口 (同 [auto.windows](#auto-windows)). 不受 [auto.setWindowFilter](#m-setwindowfilter) 影响.

```js
auto.findWindows({ type: 'application' }).forEach(w => console.log(w.getTitle(), w.getId()));
```

## [m] findWindowRoots

### findWindowRoots(filter?)

**`6.8.0`** **`A11Y`**

- **[ filter ]** { [WindowFilter](#窗口过滤器对象-windowfilter) } - 窗口过滤器对象
- <ins>**returns**</ins> { [UiObject](uiObjectType)[] } - 通过过滤器且有根节点的窗口的根节点

[auto.findWindows](#m-findwindows) 的窗口根节点数组, 没有根节点的窗口被跳过. 与 [auto.windowRoots](#auto-windowroots) 不同, 不受 [auto.setWindowFilter](#m-setwindowfilter) 影响.

```js
/* 在输入法窗口中查找候选词. */
let [ imeRoot ] = auto.findWindowRoots({ type: 'inputMethod' });
if (imeRoot) {
    console.log(imeRoot.find(text('候选')).length);
}
```

## [m] wait

### wait(cond, timeout?, interval?, onOk?, onErr?)

**`6.8.0`** **`Overload 1/2`** **`A11Y?`**

### wait(cond, options, onOk?, onErr?)

**`6.8.0`** **`Overload 2/2`** **`A11Y?`**

- <ins>**returns**</ins> { [Flow](flowType) }

[flow.wait](flow#m-wait) 的别名: 异步等待选择器, 函数, 节点, Flow 或 Promise, 立即返回 [Flow](flowType) 对象. 参数见 [流程 (Flow)](flow).

> 注: 与 [auto.waitFor](#auto-waitfor) (等待无障碍服务启动) 无关.

```js
auto.wait('登录', 5e3).click();
```

## [m] explain

### explain(selector, root?)

**`6.8.0`** **`A11Y`**

- **selector** { [UiSelector](uiSelectorType) \| [PickupSelector](dataTypes#pickupselector) } - 待解释的选择器
- **[ root ]** { [UiObject](uiObjectType) } - 遍历的根节点, 默认为各窗口根节点
- <ins>**returns**</ins> {{
    - selector: [string](dataTypes#string)
    - roots: [number](dataTypes#number)
    - nodes: [number](dataTypes#number)
    - truncated: [boolean](dataTypes#boolean)
    - found: [boolean](dataTypes#boolean)
    - count: [number](dataTypes#number)
    - failingIndex: [number](dataTypes#number)
    - failingFilter: [string](dataTypes#string) \| [null](dataTypes#null)
    - steps: { index: [number](dataTypes#number), filter: [string](dataTypes#string), matched: [number](dataTypes#number), cumulative: [number](dataTypes#number) }[]
    - matches: [UiObject](uiObjectType)[]
    - nearMisses: [UiObject](uiObjectType)[]
    - text: [string](dataTypes#string)
- }} - 解释结果

解释一个选择器为何匹配或不匹配: 遍历根节点之下的全部节点 (`nodes` 为节点数, `roots` 为根节点数, 超出预算时 `truncated` 为 `true`), 对选择器的每个过滤器分别统计单独匹配数 (`matched`) 与逐步叠加后的匹配数 (`cumulative`), 找出首个把候选集合清空的过滤器 (`failingIndex` 从 0 计, `-1` 表示没有; `failingFilter` 为其文本), 并给出前若干个匹配节点 (`matches`) 与 "差一点" 的节点 (`nearMisses`: 通过失败步骤之前全部过滤器的节点).

`text` (也是结果的 `toString()`) 为文本报告, 适合直接输出到控制台.

```js
let r = auto.explain(text('登录').clickable().depth(12));
console.log(r.found, r.failingFilter); /* false clickable() */
console.log(r.text);
/*
selector text("登录").clickable().depth(12): no match (356 node(s) in 1 root(s))
  1. text("登录")  matched 1, cumulative 1
  2. clickable()   matched 40, cumulative 0  <- nothing left
  3. depth(12)     matched 20, cumulative 0
near misses (pass step 1, fail step 2):
  - TextView(登录) ...
*/

/* 字符串或对象选择器同样可用. */
console.log(auto.explain({ text: '登录', clickable: true }).text);
```

## [m] dump

### dump(options?)

**`6.8.0`** **`A11Y`**

- **[ options ]** { `'text'` \| `'json'` \| `'xml'` \| {{
    - root?: [UiObject](uiObjectType)
    - format?: `'text'` \| `'json'` \| `'xml'`
    - maxDepth?: [number](dataTypes#number)
    - properties?: [string](dataTypes#string) \| [string](dataTypes#string)[]
    - visibleOnly?: [boolean](dataTypes#boolean)
    - maxNodes?: [number](dataTypes#number)
    - indent?: [string](dataTypes#string) \| [number](dataTypes#number)
- }} } - 格式名称或选项
- <ins>**returns**</ins> { [string](dataTypes#string) } - 控件树文本

导出控件树: 各窗口根节点 (或 `root`) 之下的全部节点, 以文本 (默认; 每行一个节点, 缩进表示层级), JSON (嵌套对象, 子节点在 `children` 中) 或 XML (uiautomator 风格) 输出.

- `maxDepth` - 最大深度, 负数或 `Infinity` 表示不限 (默认不限)
- `properties` - 输出的属性名称 (一个或数组), 默认为常用属性集
- `visibleOnly` - 只输出对用户可见的节点 (默认 `false`)
- `maxNodes` - 节点数上限, 超出时截断 (默认 `2000`, 须为正数)
- `indent` - 缩进字符串, 或空格数 (不超过 16; 默认 2 个空格)

```js
console.log(auto.dump()); /* 文本格式. */
files.write('/sdcard/window.xml', auto.dump('xml'));
console.log(auto.dump({ root: id('list').findOnce(), maxDepth: 3, properties: [ 'text', 'bounds', 'clickable' ] }));
```

> 参阅: [UiObject#dumpSubtree](uiObjectType#m-dumpsubtree) 导出单个节点的子树.

## [p] stats

**`6.8.0`** **`Getter`**

- {{
    - since: [number](dataTypes#number)
    - now: [number](dataTypes#number)
    - elapsed: [number](dataTypes#number)
    - searches: { count: [number](dataTypes#number), totalMillis: [number](dataTypes#number), averageMillis: [number](dataTypes#number), maxMillis: [number](dataTypes#number) }
    - queries: { count: [number](dataTypes#number), found: [number](dataTypes#number), missed: [number](dataTypes#number), attempts: [number](dataTypes#number), totalMillis: [number](dataTypes#number), averageMillis: [number](dataTypes#number), maxMillis: [number](dataTypes#number) }
    - selectors: { selector: [string](dataTypes#string), searches: [Object](dataTypes#object), queries: [Object](dataTypes#object), found: [number](dataTypes#number) }[]
    - slowest: [Object](dataTypes#object) \| [null](dataTypes#null)
    - steps: { name: [string](dataTypes#string), runs: [Object](dataTypes#object), rejected: [number](dataTypes#number) }[]
    - text: [string](dataTypes#string)
    - reset(): [void](dataTypes#void)
- }}

当前脚本的选择器与 Flow 统计快照 (每次读取生成新对象):

- `searches` - 单次搜索 (一次控件树遍历) 的次数与耗时统计
- `queries` - 查询 (一次 `findOne(timeout)` / `wait` 等可能包含多次搜索的调用) 的次数, 命中与未命中数, 总尝试次数与耗时统计
- `selectors` - 按最大搜索耗时降序的选择器列表, `slowest` 为其首项
- `steps` - Flow 步骤按名称的运行次数 (`runs`, 含耗时统计) 与拒绝次数
- `text` (也是 `toString()`) - 文本报告; `reset()` 清零统计

```js
/* ... 运行一段自动化后 ... */
console.log(auto.stats.text);
/*
a11y stats since 10:21:05, elapsed 32.4 s
searches: 128, total 1840 ms, average 14.4 ms, max 96 ms
queries: 12 (found 11, missed 1, attempts 57), total 1602 ms, average 133.5 ms, max 512 ms
slowest selectors (by max search time):
  1. text("登录").clickable()  searches 40, total 820 ms, average 20.5 ms, max 96 ms; queries 3, found 3
flow steps (by total time):
  wait  runs 6, total 1402 ms, average 233.7 ms, max 512 ms, rejected 1
*/
auto.stats.reset();
```

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

# 工具集 (Toolkit)

**`6.8.0`**

工具集是一组面向真实应用界面的高阶自动化函数, 把 "查找目标, 处理不可点击的包装节点, 失败时回退到手势, 校验结果" 这类重复代码封装为一次调用.

每个函数都有三种形式:

- 同步形式: 全局函数或 `automator.` 前缀, 如 `smartClick('登录')` / `automator.smartClick('登录')`. 在调用线程上运行, 不能在 UI 线程调用; 失败时抛出 [FlowError](flowErrorType)
- Flow 起点形式: `flow.smartClick('登录')`, 返回 [Flow](flowType), 见 [工具集起点](flow#工具集起点)
- Flow 链式形式: `flow.wait('登录').smartClick()`, 以链上的值为目标, 见 [工具集步骤](flowType#工具集步骤)

## 目标参数 (target)

工具函数的 `target` (以及 `targets` 数组的每一项, `container`, `item`, `verify`, `cond` 等) 接受:

- [PickupSelector](dataTypes#pickupselector) - 字符串 (内容匹配), 正则表达式, 选择器实例, 对象选择器或它们的数组
- [UiObject](uiObjectType) - 已找到的节点 (使用前会刷新, 已失效的节点视为不存在)
- [Function](dataTypes#function) - 返回节点, 节点集合或任意真值的函数 (在工具运行的线程上调用)

候选目标数组 (`targets`) 不能为空, 也不能含 `null` 或 `undefined`.

## 通用选项

- **[ timeout = `0` ]** { [number](dataTypes#number) } - 查找目标的超时 (毫秒). 同步形式与 Flow 链式形式默认为 `0`, 即只查找一次; `flow.` 起点形式默认为 [flow.defaults](flow#m-defaults) 的超时. `Infinity` 表示不限时, 同步形式因此可能 **永久阻塞**
- **[ interval = `50` ]** { [number](dataTypes#number) } - 查找目标的轮询间隔 (毫秒)
- **[ root ]** { [UiObject](uiObjectType) } - 查找范围的根节点, 默认为活动窗口 (Flow 链式形式为 [scope](flowType#m-scope) 设置的根节点)
- **[ humanize ]** { [boolean](dataTypes#boolean) \| {{ offset?: [number](dataTypes#number) \| [number](dataTypes#number)[], delay?: [number](dataTypes#number) \| [number](dataTypes#number)[] }} } - 拟人化: 每个动作前随机暂停 `delay` 毫秒 (单个数字或 `[min, max]`), 手势点按的坐标随机偏移不超过 `offset` 像素 (单个数字对两轴生效, 或 `[dx, dy]`). `true` 使用 [flow.defaults](flow#m-defaults) 的设置, `false` 关闭. 默认取自 `flow.defaults`

不支持的选项键抛出异常, 如 `Unknown option "timeuot" for smartClick; expected one of climb, gestureFallback, ...`. 部分函数在选项对象的位置接受一个数字作为简写, 见各函数说明.

未在超时内找到目标时抛出 `code` 为 `TIMEOUT` 的 [FlowError](flowErrorType), 其 `selector` 为目标的描述, `elapsed` / `attempts` 为查找的耗时与次数.

## [m] smartClick

### smartClick(target, options?)

**`6.8.0`** **`Global`** **`A11Y`** **`Non-UI`**

- **target** { [Target](#目标参数-target) } - 点击目标
- **[ options ]** {{
    - timeout?: [number](dataTypes#number)
    - interval?: [number](dataTypes#number)
    - root?: [UiObject](uiObjectType)
    - humanize?: [boolean](dataTypes#boolean) \| [Object](dataTypes#object)
    - climb?: [boolean](dataTypes#boolean)
    - maxClimb?: [number](dataTypes#number)
    - gestureFallback?: [boolean](dataTypes#boolean)
    - offset?: [number](dataTypes#number) \| [number](dataTypes#number)[]
    - verify?: [Target](#目标参数-target)
    - verifyTimeout?: [number](dataTypes#number)
    - verifyInterval?: [number](dataTypes#number)
- }} - 选项
- <ins>**returns**</ins> {{
    - ok: `true`
    - method: `'node'` \| `'ancestor'` \| `'gesture'`
    - target: [UiObject](uiObjectType)
    - verified: [any](dataTypes#any)
- }} - 点击结果

智能点击: 目标可点击时直接点击 (`method` 为 `'node'`); 不可点击时上溯到最近的可点击祖先 (`climb`, 默认 `true`, 最多 `maxClimb` 层, 默认 `5`; 相当于罗盘 `k`; `method` 为 `'ancestor'`); 没有可点击祖先或点击被拒绝时, 在目标中心 (加 `offset` 像素与拟人偏移) 做点按手势 (`gestureFallback`, 默认 `true`; `method` 为 `'gesture'`). 之后可选地等待 `verify` 条件在 `verifyTimeout` 毫秒 (默认 `2000`, 间隔 `verifyInterval`, 默认 `100`) 内成立.

结果的 `target` 为实际点击的节点 (上溯时为祖先节点), `verified` 为 `verify` 条件的结果 (未指定时为 `null`).

失败时抛出 [FlowError](flowErrorType):

- 未找到目标: `TIMEOUT`
- 点击被拒绝: `ACTION_FAILED`, `reason` 为 `click` (节点动作) 或 `gesture` (手势)
- `verify` 未在时限内成立: `ACTION_FAILED`, `reason` 为 `verify`
- 关闭 `gestureFallback` 且没有可点击节点: `INVALID_TARGET`, `reason` 为 `notClickable`

```js
/* 列表项的文本本身不可点击, 自动点击其可点击的祖先. */
let r = smartClick('关于手机', { timeout: 5e3 });
console.log(r.method); /* ancestor */

/* 点击后确认新页面已出现. */
smartClick('设置', { verify: '关于手机', verifyTimeout: 3e3 });

/* 目标不可点击时不上溯, 回退到带拟人偏移与暂停的手势. */
smartClick(id('banner'), { climb: false, humanize: { offset: 6, delay: [ 100, 300 ] } });
```

## [m] smartClickBounds

### smartClickBounds(target, options?)

**`6.8.0`** **`Global`** **`A11Y`** **`Non-UI`**

- **target** { [Target](#目标参数-target) } - 点击目标
- **[ options ]** {{
    - timeout?: [number](dataTypes#number)
    - interval?: [number](dataTypes#number)
    - root?: [UiObject](uiObjectType)
    - humanize?: [boolean](dataTypes#boolean) \| [Object](dataTypes#object)
    - offset?: [number](dataTypes#number) \| [number](dataTypes#number)[]
    - verify?: [Target](#目标参数-target)
    - verifyTimeout?: [number](dataTypes#number)
    - verifyInterval?: [number](dataTypes#number)
- }} - 选项
- <ins>**returns**</ins> {{
    - ok: `true`
    - method: `'gesture'`
    - target: [UiObject](uiObjectType)
    - verified: [any](dataTypes#any)
- }} - 点击结果

显式坐标点击: 在目标控件的边界中心加上 `offset` 与拟人偏移后执行点按手势. 不调用目标或祖先的控件点击方法, 即使控件 `click()` 返回成功也不会采用该方法. 适合控件动作返回成功但界面没有响应的情况.

`offset` 为有符号 32 位整数像素, 单个数值对两轴生效, 或用 `[dx, dy]` 分别指定; 负值向左或向上偏移. 坐标来自实际屏幕边界, 不再应用 `setScreenMetrics` 缩放. `humanize.offset` 仍是非负随机偏移幅度.

支持 [通用选项](#通用选项), `offset`, `verify`, `verifyTimeout` 和 `verifyInterval`. `verifyTimeout` 默认 `2000`, `verifyInterval` 默认 `100`. 不接受 `climb`, `maxClimb` 或 `gestureFallback` 选项.

结果的 `method` 固定为 `'gesture'`, `target` 为原始目标节点, `verified` 为验证条件的结果, 未指定 `verify` 时为 `null`.

未找到目标时抛出 `TIMEOUT`; 手势失败时抛出 `ACTION_FAILED`, `reason` 为 `'gesture'`; 验证超时的 `reason` 为 `'verify'`.

```js
smartClickBounds('设置', { timeout: 5e3, verify: '关于手机' });
smartClickBounds(id('banner'), { offset: [ -10, 6 ] });
flow.wait('下一步').smartClickBounds({ verify: '确认信息' }).catch(console.error);
```

## [m] clickIfExists

### clickIfExists(target, options?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`** **`Non-UI`**

- **target** { [Target](#目标参数-target) } - 点击目标
- **[ options ]** { [Object](dataTypes#object) } - 同 [smartClick](#m-smartclick) 的选项
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 目标存在且已点击为 `true`, 不存在为 `false`

### clickIfExists(target, timeout)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`** **`Non-UI`**

- **target** { [Target](#目标参数-target) } - 点击目标
- **timeout** { [number](dataTypes#number) } - 查找超时 (毫秒)
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

目标在时限内存在时智能点击并返回 `true`, 不存在时返回 `false` 而不报错; 点击本身失败时仍抛出 [FlowError](flowErrorType).

```js
clickIfExists('跳过广告', 2e3); /* 最多等 2 秒. */
if (!clickIfExists('同意')) {
    console.log('没有同意按钮');
}
```

## [m] clickBoundsIfExists

### clickBoundsIfExists(target, options?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`** **`Non-UI`**

- **target** { [Target](#目标参数-target) } - 点击目标
- **[ options ]** { [Object](dataTypes#object) } - 同 [smartClickBounds](#m-smartclickbounds) 的选项
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) } - 目标存在且已点击为 `true`, 不存在为 `false`

### clickBoundsIfExists(target, timeout)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`** **`Non-UI`**

- **target** { [Target](#目标参数-target) } - 点击目标
- **timeout** { [number](dataTypes#number) } - 查找超时 (毫秒)
- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

目标在时限内存在时在控件中心坐标点按并返回 `true`, 不存在时返回 `false` 而不报错; 点击本身失败时仍抛出 [FlowError](flowErrorType).

```js
clickBoundsIfExists('跳过广告', 2e3); /* 最多等 2 秒. */
if (!clickBoundsIfExists('同意')) {
    console.log('没有同意按钮');
}
```

找到目标后始终执行坐标手势, 动作或验证失败时仍抛出 [FlowError](flowErrorType). 同时支持 `automator.` 同步形式, `flow.` 起点形式和 Flow 链式形式; 链式调用也必须显式传入目标.

## [m] clickAny

### clickAny(targets, options?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`** **`Non-UI`**

- **targets** { [Target](#目标参数-target)[] } - 候选目标, 按优先顺序
- **[ options ]** { [Object](dataTypes#object) } - 同 [smartClick](#m-smartclick) 的选项
- <ins>**returns**</ins> {{
    - index: [number](dataTypes#number)
    - target: [any](dataTypes#any)
    - node: [UiObject](uiObjectType)
    - method: `'node'` \| `'ancestor'` \| `'gesture'`
    - verified: [any](dataTypes#any)
- }} \| [null](dataTypes#null) - 被点击的候选及方式, 都不存在时为 `null`

### clickAny(targets, timeout)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`** **`Non-UI`**

- **targets** { [Target](#目标参数-target)[] } - 候选目标
- **timeout** { [number](dataTypes#number) } - 查找超时 (毫秒)
- <ins>**returns**</ins> { [Object](dataTypes#object) \| [null](dataTypes#null) }

每轮按顺序检查候选目标, 智能点击首个存在的. 结果的 `index` 为候选在数组中的序号, `target` 为候选本身, `node` 为找到的节点.

```js
let r = clickAny([ '同意', '允许', 'OK' ], 3e3);
if (r) {
    console.log(`点击了第 ${r.index + 1} 个候选: ${r.target}`);
}
```

## [m] clickBoundsAny

### clickBoundsAny(targets, options?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`** **`Non-UI`**

- **targets** { [Target](#目标参数-target)[] } - 候选目标, 按优先顺序
- **[ options ]** { [Object](dataTypes#object) } - 同 [smartClickBounds](#m-smartclickbounds) 的选项
- <ins>**returns**</ins> {{
    - index: [number](dataTypes#number)
    - target: [any](dataTypes#any)
    - node: [UiObject](uiObjectType)
    - method: `'gesture'`
    - verified: [any](dataTypes#any)
- }} \| [null](dataTypes#null) - 被点击的候选及方式, 都不存在时为 `null`

### clickBoundsAny(targets, timeout)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`** **`Non-UI`**

- **targets** { [Target](#目标参数-target)[] } - 候选目标
- **timeout** { [number](dataTypes#number) } - 查找超时 (毫秒)
- <ins>**returns**</ins> { [Object](dataTypes#object) \| [null](dataTypes#null) }

每轮按顺序检查候选目标, 在控件中心坐标点按首个存在的. 结果的 `index` 为候选在数组中的序号, `target` 为候选本身, `node` 为找到的节点.

```js
let r = clickBoundsAny([ '同意', '允许', 'OK' ], 3e3);
if (r) {
    console.log(`点击了第 ${r.index + 1} 个候选: ${r.target}`);
}
```

找到目标后始终执行坐标手势, 动作或验证失败时仍抛出 [FlowError](flowErrorType). 同时支持 `automator.` 同步形式, `flow.` 起点形式和 Flow 链式形式; 链式调用也必须显式传入目标.

## [m] findAny

### findAny(targets, options?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`** **`Non-UI`**

- **targets** { [Target](#目标参数-target)[] } - 候选目标, 按优先顺序
- **[ options ]** { [Object](dataTypes#object) } - 仅 [通用选项](#通用选项)
- <ins>**returns**</ins> {{
    - index: [number](dataTypes#number)
    - target: [any](dataTypes#any)
    - node: [UiObject](uiObjectType)
- }} \| [null](dataTypes#null) - 首个存在的候选, 都不存在时为 `null`

### findAny(targets, timeout)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`** **`Non-UI`**

- **targets** { [Target](#目标参数-target)[] } - 候选目标
- **timeout** { [number](dataTypes#number) } - 查找超时 (毫秒)
- <ins>**returns**</ins> { [Object](dataTypes#object) \| [null](dataTypes#null) }

返回首个存在的候选目标, 不点击. 适合 "页面 A 或页面 B, 哪个先出现" 的分支判断.

```js
let r = findAny([ '欢迎回来', '密码错误' ], 10e3);
switch (r && r.index) {
    case 0:
        console.log('登录成功');
        break;
    case 1:
        console.log('登录失败');
        break;
    default:
        console.log('超时');
}
```

## [m] scrollUntil

### scrollUntil(target, options?)

**`6.8.0`** **`Global`** **`A11Y`** **`Non-UI`**

- **target** { [Target](#目标参数-target) } - 查找目标
- **[ options ]** {{
    - timeout?: [number](dataTypes#number)
    - interval?: [number](dataTypes#number)
    - root?: [UiObject](uiObjectType)
    - humanize?: [boolean](dataTypes#boolean) \| [Object](dataTypes#object)
    - container?: [Target](#目标参数-target)
    - direction?: `'up'` \| `'down'` \| `'left'` \| `'right'`
    - maxSteps?: [number](dataTypes#number)
    - method?: `'action'` \| `'gesture'`
    - stopAtEnd?: [boolean](dataTypes#boolean)
    - settle?: [number](dataTypes#number)
    - gestureDuration?: [number](dataTypes#number)
- }} - 选项
- <ins>**returns**</ins> { [UiObject](uiObjectType) } - 找到的目标节点

滚动直到目标出现: 先查找目标, 不存在时把容器向 `direction` (默认 `'down'`) 滚动一步, 等待 `settle` 毫秒 (默认 `300`) 后再查找, 直到找到目标, 已滚动 `maxSteps` 次 (默认 `20`), 或已到底 (连续两次滚动内容无变化; `stopAtEnd` 为 `false` 时不检测).

- `container` - 滚动容器. 省略时自动使用查找范围内面积最大的可滚动节点
- `method` - `'action'` (默认) 使用无障碍滚动动作; `'gesture'` 使用滑动手势 (从容器 80% 处滑到 20% 处, 历时 `gestureDuration` 毫秒, 默认 `400`), 没有容器时在整个查找范围或屏幕上滑动
- `timeout` / `interval` 用于定位给定的 `container`

失败时抛出 [FlowError](flowErrorType): 滚动到上限或到底仍未出现 (`TIMEOUT`, `reason` 为 `maxSteps` / `end`); 给定的容器不存在 (`INVALID_TARGET`, `reason` 为 `container`); 未给定容器且没有可滚动节点 (`INVALID_TARGET`, `reason` 为 `noScrollable`); 滚动过程中容器消失 (`INVALID_TARGET`, `reason` 为 `containerGone`) 或手势失败 (`ACTION_FAILED`, `reason` 为 `swipe`).

```js
let w = scrollUntil('开发者选项', { maxSteps: 15 });
w.click();

scrollUntil('第一条', { direction: 'up', container: className('RecyclerView') });
scrollUntil(/更多/, { method: 'gesture' });
```

## [m] typeInto

### typeInto(target, text, options?)

**`6.8.0`** **`Global`** **`A11Y`** **`Non-UI`**

- **target** { [Target](#目标参数-target) \| [number](dataTypes#number) \| [null](dataTypes#null) } - 输入框: 选择器 / 节点 / 函数; 数字为查找范围内第 n 个可编辑节点 (从 0 计, 负数从末尾计); `null` 为当前焦点所在的可编辑节点
- **text** { [string](dataTypes#string) } - 要输入的文本
- **[ options ]** {{
    - timeout?: [number](dataTypes#number)
    - interval?: [number](dataTypes#number)
    - root?: [UiObject](uiObjectType)
    - humanize?: [boolean](dataTypes#boolean) \| [Object](dataTypes#object)
    - clear?: [boolean](dataTypes#boolean)
    - submit?: [boolean](dataTypes#boolean)
    - verify?: [boolean](dataTypes#boolean)
    - verifyTimeout?: [number](dataTypes#number)
    - verifyInterval?: [number](dataTypes#number)
- }} - 选项
- <ins>**returns**</ins> { [UiObject](uiObjectType) } - 输入框节点

向输入框输入文本: 定位可编辑节点 (选择器匹配的节点本身不可编辑时, 取其首个可编辑后代); `clear` 为 `true` (默认) 时替换全部文本, 否则追加到现有文本之后; `verify` 为 `true` (默认) 时重读节点直到其文本符合预期 (`verifyTimeout` 默认 `1000`, `verifyInterval` 默认 `100`; 密码框的文本被掩码, 跳过校验); `submit` 为 `true` 时随后发送 IME 动作 ([imeEnter](uiObjectActionsType#m-imeenter), 必要时先聚焦).

失败时抛出 [FlowError](flowErrorType): 选择器目标未出现 (`TIMEOUT`); `null` 目标但没有焦点输入框 (`INVALID_TARGET`, `reason` 为 `noFocus`), 数字序号越界 (`noEditable`), 目标及其后代都不可编辑 (`notEditable`); 设置文本失败, 校验失败或提交失败 (`ACTION_FAILED`, `reason` 为 `setText` / `verify` / `submit`).

```js
typeInto('用户名', 'admin');
typeInto(0, '123456', { submit: true }); /* 第 1 个输入框, 输入后提交. */
typeInto(null, ' world', { clear: false }); /* 向焦点输入框追加. */
```

## [m] dismissPopups

### dismissPopups(targets, options?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`** **`Non-UI`**

- **targets** { [Target](#目标参数-target)[] } - 关闭弹窗的按钮候选, 按优先顺序
- **[ options ]** {{
    - timeout?: [number](dataTypes#number)
    - interval?: [number](dataTypes#number)
    - root?: [UiObject](uiObjectType)
    - humanize?: [boolean](dataTypes#boolean) \| [Object](dataTypes#object)
    - once?: [boolean](dataTypes#boolean)
    - watch?: [boolean](dataTypes#boolean)
    - settle?: [number](dataTypes#number)
    - maxRounds?: [number](dataTypes#number)
    - debounce?: [number](dataTypes#number)
    - click?: [Object](dataTypes#object)
    - onDismissed?: [(info: Object) => void](dataTypes#function)
    - onError?: [(error: FlowError) => void](dataTypes#function)
- }} - 选项
- <ins>**returns**</ins> { [Object](dataTypes#object) \| [Object](dataTypes#object)[] \| [null](dataTypes#null) \| [PopupGuard](#弹窗守护句柄-popupguard) } - 见下文

### dismissPopups(targets, timeout)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`** **`Non-UI`**

- **targets** { [Target](#目标参数-target)[] } - 候选
- **timeout** { [number](dataTypes#number) } - 首次查找的超时 (毫秒)
- <ins>**returns**</ins> { [Object](dataTypes#object) \| [null](dataTypes#null) }

关闭弹窗. 候选项不存在不算错误; 点击使用智能点击, `click` 为传给 [smartClick](#m-smartclick) 的嵌套选项对象.

- `once: true` (默认): 智能点击首个存在的候选, 返回 `{ index, target, node, method, verified }` (含义同 [clickAny](#m-clickany)); 时限内都不存在时返回 `null`
- `once: false`: 反复关闭, 直到没有候选存在或已关闭 `maxRounds` 个 (默认 `10`, 须为正数), 两轮之间等待 `settle` 毫秒 (默认 `300`); 返回上述对象的数组
- `watch: true` (仅同步形式): 启动弹窗守护并立即返回 [守护句柄](#弹窗守护句柄-popupguard). 守护先执行一轮 `once: false` 式的关闭, 之后每次窗口变化 (窗口状态 / 内容 / 列表变化事件, 以 `debounce` 毫秒去抖, 默认 `300`) 在后台线程再执行一轮, 直到调用 `stop()`. 守护运行期间脚本不会退出

`onDismissed(info)` 在每次关闭弹窗后调用, `onError(error)` 在某一轮出错时调用 (未提供时以 `console.warn` 输出); 两者都在创建守护的脚本线程上执行, 且都需要 `watch: true`. Flow 形式不支持 `watch`.

```js
/* 启动时关掉常见弹窗. */
dismissPopups([ '我知道了', '以后再说', '关闭' ], { once: false });

/* 整个脚本期间守护. */
let guard = dismissPopups([ '我知道了', '取消', id('btn_close') ], {
    watch: true,
    onDismissed: info => console.log(`已关闭: ${info.target}`),
});
events.on('exit', () => guard.stop());
```

## 弹窗守护句柄 (PopupGuard)

**`6.8.0`**

[dismissPopups](#m-dismisspopups) 以 `watch: true` 调用时的返回值:

- **stop()** - 停止守护, 释放对脚本的保活
- **trigger()** - 立即执行一轮关闭
- **isRunning** { [boolean](dataTypes#boolean) } - 是否仍在守护
- **count** { [number](dataTypes#number) } - 已关闭的弹窗数
- **passes** { [number](dataTypes#number) } - 已执行的轮数
- **dismissed** { [Object](dataTypes#object)[] } - 已关闭弹窗的信息 (`{ index, target, node, method, verified }`), 按时间顺序
- **toString()** - 如 `PopupGuard(running, 3 dismissed)`

## [m] collectList

### collectList(container, item, options?)

**`6.8.0`** **`Global`** **`A11Y`** **`Non-UI`**

- **container** { [Target](#目标参数-target) \| [null](dataTypes#null) } - 列表容器, `null` 时自动使用查找范围内面积最大的可滚动节点
- **item** { [Target](#目标参数-target) } - 列表条目
- **[ options ]** {{
    - timeout?: [number](dataTypes#number)
    - interval?: [number](dataTypes#number)
    - root?: [UiObject](uiObjectType)
    - humanize?: [boolean](dataTypes#boolean) \| [Object](dataTypes#object)
    - direction?: `'up'` \| `'down'` \| `'left'` \| `'right'`
    - maxSteps?: [number](dataTypes#number)
    - method?: `'action'` \| `'gesture'`
    - resultType?: [PickupResult](dataTypes#pickupresult)
    - dedupe?: [boolean](dataTypes#boolean)
    - until?: [(item: any) => boolean](dataTypes#function)
    - maxItems?: [number](dataTypes#number)
    - settle?: [number](dataTypes#number)
    - gestureDuration?: [number](dataTypes#number)
- }} - 选项
- <ins>**returns**</ins> { [any](dataTypes#any)[] } - 采集到的条目

采集滚动列表: 每轮在容器内查找全部 `item` 匹配项, 按 `resultType` ([拾取结果类型](dataTypes#pickupresult), 默认 `'$'` 即节点内容; `'w'` 为节点本身, `'txt'` 为文本) 取值, 按节点内容指纹去重 (`dedupe`, 默认 `true`) 后加入结果; 然后把容器滚动一步 (`direction` 默认 `'down'`, `method` / `settle` / `gestureDuration` 同 [scrollUntil](#m-scrolluntil)) 再采集, 直到到底 (滚动后内容无变化), 已滚动 `maxSteps` 次 (默认 `20`), 已取满 `maxItems` 项 (默认不限, 须为正数), 或 `until` 对某一项返回真值 (该项仍被加入).

失败时抛出 [FlowError](flowErrorType): 给定的容器不存在 (`INVALID_TARGET`, `reason` 为 `container`), 未给定容器且没有可滚动节点 (`noScrollable`), 以及滚动失败 (同 [scrollUntil](#m-scrolluntil)).

```js
let titles = collectList(className('RecyclerView'), className('TextView').depth(9), { maxSteps: 10 });
console.log(titles.length, titles.slice(0, 3));

/* 采集节点本身, 直到出现指定条目. */
let nodes = collectList(null, /^第 \d+ 条/, { resultType: 'w', until: w => w.text() === '第 50 条' });
```

## [m] launchAndWait

### launchAndWait(app, options?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`** **`Non-UI`**

- **app** { [App](appType) \| [string](dataTypes#string) } - 应用: [App](appType) 枚举值, 应用别名, 包名或应用名称
- **[ options ]** {{
    - timeout?: [number](dataTypes#number)
    - interval?: [number](dataTypes#number)
    - bringToFront?: [boolean](dataTypes#boolean)
- }} - 选项
- <ins>**returns**</ins> {{
    - packageName: [string](dataTypes#string)
    - launched: [boolean](dataTypes#boolean)
    - elapsed: [number](dataTypes#number)
    - attempts: [number](dataTypes#number)
- }} - 启动结果

### launchAndWait(app, timeout)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`** **`Non-UI`**

- **app** { [App](appType) \| [string](dataTypes#string) } - 应用
- **timeout** { [number](dataTypes#number) } - 等待超时 (毫秒)
- <ins>**returns**</ins> { [Object](dataTypes#object) }

启动应用并等待其到达前台: 把 `app` 解析为包名, 启动它 (已在前台且 `bringToFront` 为 `false` 时不启动, 此时 `launched` 为 `false`), 然后每 `interval` 毫秒 (默认 `200`) 检查 [currentPackage()](global#m-currentpackage), 直到变为该包名或超过 `timeout` 毫秒 (默认 `10000`). 此函数不使用 `root` 与 `humanize` 选项.

失败时抛出 [FlowError](flowErrorType): 无法解析的应用 (`INVALID_TARGET`, `reason` 为 `unknownApp`); 启动调用失败 (`ACTION_FAILED`, `reason` 为 `launch`); 未在时限内到达前台 (`TIMEOUT`, `reason` 为 `package`).

```js
let r = launchAndWait('Settings');
console.log(r.packageName, r.elapsed); /* com.android.settings 1240 */

launchAndWait('com.tencent.mm', 15e3);
```

## [m] backUntil

### backUntil(cond, options?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`** **`Non-UI`**

- **cond** { [Target](#目标参数-target) } - 停止条件: 选择器, 节点或函数
- **[ options ]** {{
    - root?: [UiObject](uiObjectType)
    - humanize?: [boolean](dataTypes#boolean) \| [Object](dataTypes#object)
    - maxTimes?: [number](dataTypes#number)
    - delay?: [number](dataTypes#number)
    - interval?: [number](dataTypes#number)
- }} - 选项
- <ins>**returns**</ins> { [any](dataTypes#any) } - 条件成立时的值 (节点, 拾取结果或函数返回值)

### backUntil(cond, maxTimes)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`** **`Non-UI`**

- **cond** { [Target](#目标参数-target) } - 停止条件
- **maxTimes** { [number](dataTypes#number) } - 最多按返回键的次数
- <ins>**returns**</ins> { [any](dataTypes#any) }

反复按返回键直到条件成立: 先检查一次条件; 之后每按一次返回键 ([back](#back)), 在 `delay` 毫秒 (默认 `500`) 内每 `interval` 毫秒 (默认 `100`, 须为正数) 检查条件; 最多按 `maxTimes` 次 (默认 `10`). 此函数不使用 `timeout` 选项.

失败时抛出 [FlowError](flowErrorType): 按满次数仍不成立 (`TIMEOUT`, `reason` 为 `maxTimes`); 返回键动作失败 (`ACTION_FAILED`, `reason` 为 `back`).

```js
/* 一路返回到首页. */
backUntil(id('home_tab'), 8);
backUntil(() => currentActivity().endsWith('.MainActivity'));
```

## [m] backToApp

### backToApp(app, options?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`** **`Non-UI`**

- **app** { [App](appType) \| [string](dataTypes#string) } - 应用, 形式同 [launchAndWait](#m-launchandwait)
- **[ options ]** { [Object](dataTypes#object) } - 同 [backUntil](#m-backuntil) 的选项
- <ins>**returns**</ins> { [string](dataTypes#string) } - 到达前台的包名

### backToApp(app, maxTimes)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`** **`Non-UI`**

- **app** { [App](appType) \| [string](dataTypes#string) } - 应用
- **maxTimes** { [number](dataTypes#number) } - 最多按返回键的次数
- <ins>**returns**</ins> { [string](dataTypes#string) }

反复按返回键直到指定应用回到前台, 行为同 [backUntil](#m-backuntil). 无法解析的应用抛出 `INVALID_TARGET` (`reason` 为 `unknownApp`).

```js
backToApp('org.autojs.autojs6');
```

## [m] toggle

### toggle(target, checked, options?)

**`6.8.0`** **`Global`** **`A11Y`** **`Non-UI`**

- **target** { [Target](#目标参数-target) } - 可勾选控件, 或包含它的节点 (如设置页中包着开关的整行)
- **checked** { [boolean](dataTypes#boolean) } - 期望的选中状态
- **[ options ]** {{
    - timeout?: [number](dataTypes#number)
    - interval?: [number](dataTypes#number)
    - root?: [UiObject](uiObjectType)
    - humanize?: [boolean](dataTypes#boolean) \| [Object](dataTypes#object)
    - verifyTimeout?: [number](dataTypes#number)
    - verifyInterval?: [number](dataTypes#number)
    - click?: [Object](dataTypes#object)
- }} - 选项
- <ins>**returns**</ins> {{
    - node: [UiObject](uiObjectType)
    - changed: [boolean](dataTypes#boolean)
    - checked: [boolean](dataTypes#boolean)
    - method: `'node'` \| `'ancestor'` \| `'gesture'` \| [null](dataTypes#null)
- }} - 切换结果

设置可勾选控件的状态: 目标不可勾选时取其首个可勾选后代; 已是期望状态时不做任何操作 (`changed` 为 `false`, `method` 为 `null`); 否则以 `click` 选项智能点击, 并在 `verifyTimeout` 毫秒 (默认 `1000`, 间隔 `verifyInterval`, 默认 `100`) 内重读直到状态符合.

失败时抛出 [FlowError](flowErrorType): 目标未出现 (`TIMEOUT`); 目标及其后代都不可勾选 (`INVALID_TARGET`, `reason` 为 `notCheckable`); 点击失败 (`ACTION_FAILED`, `reason` 为 `click` / `gesture`) 或状态未改变 (`ACTION_FAILED`, `reason` 为 `verify`).

```js
let r = toggle('飞行模式', true);
console.log(r.changed, r.node.checked()); /* true true */
```

## [m] retry

### retry(fn, options?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`Non-UI`**

- **fn** { [(attempt: number) => T](dataTypes#function) } - 要执行的函数, 参数为从 0 计的尝试序号
- **[ options ]** {{
    - times?: [number](dataTypes#number)
    - delay?: [number](dataTypes#number)
    - backoff?: [number](dataTypes#number)
- }} - 选项
- <ins>**returns**</ins> { [T](dataTypes#generic) } - `fn` 成功时的返回值
- <ins>**template**</ins> [T](dataTypes#generic)

### retry(fn, times)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`Non-UI`**

- **fn** { [(attempt: number) => T](dataTypes#function) } - 要执行的函数
- **times** { [number](dataTypes#number) } - 最多重跑次数
- <ins>**returns**</ins> { [T](dataTypes#generic) }
- <ins>**template**</ins> [T](dataTypes#generic)

在调用线程上执行 `fn`, 抛出异常时在 `delay` 毫秒 (默认 `500`) 后重跑, 之后每次重跑前的等待乘以 `backoff` (默认 `1`, 须不小于 `1`); 重跑 `times` 次 (默认 `3`) 仍失败时抛出最后一次的异常. 取消 (`CANCELLED` 的 [FlowError](flowErrorType)), 脚本中断与 JVM `Error` 不重试.

只有同步形式. Flow 链上的 [retry](flowType#m-retry) 是重跑上一步骤的步骤, 与本函数无关.

```js
let node = retry(attempt => {
    console.log(`第 ${attempt + 1} 次尝试`);
    let w = text('刷新').findOnce();
    if (!w) {
        throw new Error('not yet');
    }
    return w;
}, { times: 5, delay: 300, backoff: 2 }); /* 等待 300, 600, 1200, 2400, 4800 毫秒. */
```

# 事件驱动等待

**`6.8.0`**

基于无障碍事件的等待: 不反复查询界面, 而是订阅无障碍服务的事件流, 直到目标事件到达或超时. 与 [工具集](#工具集-toolkit) 一样有同步形式 (全局函数与 `automator.` 前缀, 不能在 UI 线程调用) 与 Flow 形式 ([事件等待起点](flow#事件等待起点), [事件等待步骤](flowType#事件等待步骤)).

`timeout` 默认取 [flow.defaults](flow#m-defaults) 的超时 (`10000`), `Infinity` 表示不限时. 超时抛出 `code` 为 `TIMEOUT` 的 [FlowError](flowErrorType), 其 `selector` 为等待条件的描述; 等待期间无障碍服务断开时立即以 `A11Y_UNAVAILABLE` 中止.

事件类型名与 [auto.registerEvent](#m-registerevent) 的 `name` 相同: Android [AccessibilityEvent](https://developer.android.com/reference/android/view/accessibility/AccessibilityEvent) 的 `TYPE_*` 常量名去掉前缀, 大小写与驼峰 / 下划线写法均可, 如 `'window_state_changed'` / `'windowStateChanged'`. 未知的类型名抛出异常.

## [m] waitForIdle

### waitForIdle(quietFor?)

**`6.8.0`** **`Global`** **`Overload 1/2`** **`A11Y`** **`Non-UI`**

- **[ quietFor = `500` ]** { [number](dataTypes#number) } - 判定为安静所需的无事件时长 (毫秒)
- <ins>**returns**</ins> {{
    - quietFor: [number](dataTypes#number)
    - elapsed: [number](dataTypes#number)
    - events: [number](dataTypes#number)
- }} - 空闲报告

### waitForIdle(options)

**`6.8.0`** **`Global`** **`Overload 2/2`** **`A11Y`** **`Non-UI`**

- **options** {{
    - quietFor?: [number](dataTypes#number)
    - timeout?: [number](dataTypes#number)
    - eventTypes?: [string](dataTypes#string) \| [string](dataTypes#string)[]
- }} - 选项
- <ins>**returns**</ins> { [Object](dataTypes#object) }

等待界面安静: 连续 `quietFor` 毫秒内没有指定类型 (`eventTypes`, 默认为窗口状态, 窗口内容与窗口列表变化三种; `'*'` 表示全部类型) 的无障碍事件时返回. 结果含实际使用的 `quietFor`, 总耗时 `elapsed` 与期间观察到的事件数 `events`.

界面持续变化直到超时时抛出 `TIMEOUT` (`reason` 为 `the screen kept changing`).

```js
click('提交');
let idle = waitForIdle(800); /* 等待页面不再变化. */
console.log(idle.elapsed, idle.events);
```

## [m] waitForEvent

### waitForEvent(type?, filter?, timeout?)

**`6.8.0`** **`Global`** **`A11Y`** **`Non-UI`**

- **[ type ]** { [string](dataTypes#string) } - 事件类型名, 省略时为任意类型
- **[ filter ]** { [(event: Object) => boolean](dataTypes#function) \| {{ packageName?: [string](dataTypes#string) \| [RegExp](dataTypes#regexp), className?: [string](dataTypes#string) \| [RegExp](dataTypes#regexp), text?: [string](dataTypes#string) \| [RegExp](dataTypes#regexp) }} } - 事件过滤: 函数, 或按属性匹配的对象 (`packageName` / `className` 字符串整体匹配, `text` 字符串子串匹配, 正则表达式搜索匹配)
- **[ timeout ]** { [number](dataTypes#number) } - 超时 (毫秒)
- <ins>**returns**</ins> { [Object](dataTypes#object) } - 事件包装对象, 同 [auto.registerEvent](#m-registerevent) 回调的参数

等待首个符合条件的无障碍事件. `filter` 与 `timeout` 的顺序可以互换.

```js
let e = waitForEvent('view_clicked', { packageName: 'com.android.settings' }, 10e3);
console.log(e.className, e.source);

let any = waitForEvent(); /* 任意事件. */
```

## [m] waitForToast

### waitForToast(text?, timeout?)

**`6.8.0`** **`Global`** **`A11Y`** **`Non-UI`**

- **[ text ]** { [string](dataTypes#string) \| [RegExp](dataTypes#regexp) \| [(toast: Object) => boolean](dataTypes#function) \| {{ packageName?: [string](dataTypes#string) \| [RegExp](dataTypes#regexp), text?: [string](dataTypes#string) \| [RegExp](dataTypes#regexp) }} } - Toast 过滤: 字符串为文本子串, 正则表达式搜索匹配, 函数或按属性匹配的对象; 省略时为任意 Toast. 第一个参数为数字时视为 `timeout`
- **[ timeout ]** { [number](dataTypes#number) } - 超时 (毫秒)
- <ins>**returns**</ins> {{
    - packageName: [string](dataTypes#string)
    - text: [string](dataTypes#string)
- }} - Toast 对象

等待首个符合条件的 Toast 消息.

```js
click('保存');
let toast = waitForToast('已保存', 5e3);
console.log(toast.packageName, toast.text);
```

> 注: 观察者忽略 AutoJs6 自身显示的 Toast (如脚本调用 `toast()` 产生的), 因此只能等到其它应用的 Toast; 本应用发出的通知则可由 [waitForNotification](#m-waitfornotification) 等到.

## [m] waitForNotification

### waitForNotification(filter?, timeout?)

**`6.8.0`** **`Global`** **`A11Y`** **`Non-UI`**

- **[ filter ]** { [string](dataTypes#string) \| [RegExp](dataTypes#regexp) \| [(notification: Object) => boolean](dataTypes#function) \| {{ packageName?: [string](dataTypes#string) \| [RegExp](dataTypes#regexp), title?: [string](dataTypes#string) \| [RegExp](dataTypes#regexp), text?: [string](dataTypes#string) \| [RegExp](dataTypes#regexp) }} } - 通知过滤: 字符串为标题或内容的子串, 正则表达式搜索匹配, 函数或按属性匹配的对象; 省略时为任意通知. 第一个参数为数字时视为 `timeout`
- **[ timeout ]** { [number](dataTypes#number) } - 超时 (毫秒)
- <ins>**returns**</ins> { [Notification](events#notification) } - 通知对象, 同 [events.observeNotification](events#observenotification) 的回调参数 (含 `packageName`, `title`, `text`, `click()`, `delete()`)

等待首个符合条件的系统通知.

```js
let n = waitForNotification({ packageName: 'com.tencent.mm', text: /验证码/ }, 60e3);
console.log(n.title, n.text);
n.click();
```
