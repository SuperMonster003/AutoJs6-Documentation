# 控制台 (Console)

AutoJs6 的控制台类似 Web 浏览器的调试控制台, 用于信息输出或辅助代码调试.

## 显示控制台

AutoJs6 支持以下几种方式显示控制台:

- 点击 AutoJs6 应用主页右上区域 "日志" 图标 - 显示控制台 Activity 活动页面.
- 使用代码 `console.launch()` - 显示控制台 Activity 活动页面.
- 使用代码 `console.show()` - 显示控制台 `浮动窗口 (Floating Window)`.

## 模块作用

console 模块的主要作用:

- 控制台日志内容的管理 - [ 按分级显示内容 / 内容清空 / 时间跟踪 / 栈追踪 / 存入文件 ] 等
    - [console.log](#m-log)
    - [console.warn](#m-warn)
    - [console.clear](#m-clear)
    - [console.time](#m-time)
    - [console.timeEnd](#m-timeend)
    - [console.printAllStackTrace](#m-printallstacktrace)
    - [console.setGlobalLogConfig](#m-setgloballogconfig)
    - ... ...
- 控制台浮动窗口的管理 - [ 窗口样式 / 文字样式 / 窗口显示与隐藏 / 窗口位置与尺寸 ] 等
    - [console.setBackgroundColor](#m-setbackgroundcolor)
    - [console.setBackgroundTint](#m-setbackgroundtint)
    - [console.setBackgroundAlpha](#m-setbackgroundalpha)
    - [console.setTouchable](#m-settouchable)
    - [console.setTitle](#m-settitle)
    - [console.setTextColor](#m-settextcolor)
    - [console.setTextSize](#m-settextsize)
    - [console.show](#m-show)
    - [console.hide](#m-hide)
    - [console.collapse](#m-collapse)
    - [console.expand](#m-expand)
    - [console.setSize](#m-setsize)
    - [console.setPosition](#m-setposition)
    - [console.setGravity](#m-setgravity)
    - [console.setTimeVisible](#m-settimevisible)
    - [console.setColorful](#m-setcolorful)
    - ... ...
- 控制台输入 - [ 读取用户在输入栏提交的文本 / 读取并求值 ] 等
    - [console.rawInput](#m-rawinput)
    - [console.input](#m-input)
- 控制台 Activity 活动窗口管理
    - [console.launch](#m-launch)

控制台浮动窗口的相关方法仅对浮动窗口有效, 而对 Activity 活动窗口无效:

```js
/* 浮动窗口日志文本字体大小修改为 23sp, */
/* 但 Activity 活动窗口的日志字体不受影响. */

console.setContentTextSize(23);
console.show(); /* 浮动窗口日志字体 23sp. */

console.launch(); /* Activity 活动窗口的日志字体仍为默认大小. */
```

## 浮动窗口

使用 [console.show](#m-show) 可显示控制台的浮动窗口.

- 浮动窗口标题栏右侧有一个 "更多" 按钮, 点击后弹出操作菜单
    - 最小化 - 收起浮动窗口并显示一个浮动按钮
    - 调整大小 - 进入尺寸调整模式, 拖动窗口右侧或底部边缘 (或右下角) 改变窗口尺寸, 点击窗口其他区域退出
    - 输入栏 - 显示或隐藏输入栏 (脚本调用 [console.rawInput](#m-rawinput) 等待输入时会自动显示)
    - 清空 / 复制 - 清空或复制日志内容
    - 设置 - 时间前缀, 时间格式, 日志着色, 文字大小, 状态栏避让, 标题栏及日志区域透明度
    - 关闭 - 隐藏浮动窗口
- 拖动标题栏区域可移动浮动窗口
- 日志显示区域支持双指缩放改变文本字体大小
- 浮动窗口可紧贴屏幕边缘, 如 `console.setPosition(0, 0)` 将窗口置于屏幕左上角 (默认避让状态栏, 参阅 [console.setAvoidStatusBar](#m-setavoidstatusbar))
- 浮动窗口的样式及空间状态设置与 [console.show](#m-show) 的调用顺序无关, 无需在两者之间等待

如需使用代码配置浮动窗口的外观与样式, 参阅 [console.build](#m-build) 小节.

一个简单的浮动窗口配置示例, 以便快速了解浮动窗口的配置方式:

- 尺寸 - 宽 80% 屏幕宽度, 高 60% 屏幕高度
- 位置 - X 坐标 10% 屏幕宽度, Y 坐标 15% 屏幕高度
- 标题 - HELLO WORLD
- 标题字号 - 18sp
- 标题背景颜色 - 900 号深橙色, 80% 透明度
- 日志字号 - 16sp
- 日志背景颜色 - 与标题背景颜色相同, 50% 透明度
- 浮动窗口在脚本结束后 6 秒钟自动隐藏

```js
/* 使用构建器方式. */

console.build({
    size: [ 0.8, 0.6 ],
    position: [ 0.1, 0.15 ],
    title: 'HELLO WORLD',
    titleTextSize: 18,
    contentTextSize: 16,
    backgroundColor: 'deep-orange-900',
    titleBackgroundAlpha: 0.8,
    contentBackgroundAlpha: 0.5,
    exitOnClose: 6e3,
}).show();

/* 使用链式配置方式. */

console
    .setSize(0.8, 0.6)
    .setPosition(0.1, 0.15)
    .setTitle('HELLO WORLD')
    .setTitleTextSize(18)
    .setContentTextSize(16)
    .setBackgroundColor('deep-orange-900')
    .setTitleBackgroundAlpha(0.8)
    .setContentBackgroundAlpha(0.5)
    .setExitOnClose(6e3)
    .show();

/* 使用传统分步配置方式. */

console.setSize(0.8, 0.6);
console.setPosition(0.1, 0.15);
console.setTitle('HELLO WORLD');
console.setTitleTextSize(18);
console.setContentTextSize(16);
console.setBackgroundColor('deep-orange-900');
console.setTitleBackgroundAlpha(0.8);
console.setContentBackgroundAlpha(0.5);
console.setExitOnClose(6e3);
console.show();
```

---

<p style="font: bold 2em sans-serif; color: #FF7043">globalThis</p>

---

以下名称仅作为全局方法挂载, 不会成为 `console` 对象的同名成员.

## [m] err

### err(data, ...args)

**`Global`** **`xAlias`**

- **data** { [string](dataTypes#string) } - 可包含占位符的待格式化对象
- **...args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - [占位符替换参数](glossaries#占位符替换参数)
- <ins>**returns**</ins> { [void](dataTypes#void) }

[console.error](#m-error) 的全局别名.

## [m] openConsole

### openConsole(isReset?)

**`Global`** **`xAlias`**

- **[ isReset = false ]** { [boolean](dataTypes#boolean) } - 是否在显示前清空已保存的状态并重置控制台
- <ins>**returns**</ins> { [this](console) }

[console.show](#m-show) 的全局别名.

## [m] showConsole

### showConsole(isReset?)

**`Global`** **`xAlias`**

- **[ isReset = false ]** { [boolean](dataTypes#boolean) } - 是否在显示前清空已保存的状态并重置控制台
- <ins>**returns**</ins> { [this](console) }

[console.show](#m-show) 的全局别名.

## [m] clearConsole

### clearConsole()

**`Global`** **`xAlias`**

- <ins>**returns**</ins> { [this](console) }

[console.clear](#m-clear) 的全局别名.

## [m] launchConsole

### launchConsole()

**`Global`** **`xAlias`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

[console.launch](#m-launch) 的全局别名.

---

<p style="font: bold 2em sans-serif; color: #FF7043">console</p>

---

## [m] show

### show(isReset?)

**`[6.3.0]`**

- **[ isReset = false ]** { [boolean](dataTypes#boolean) } - 是否在显示前清空已保存的状态并重置控制台
- <ins>**returns**</ins> { [this](console) }

显示控制台浮动窗口.

窗口显示之前或之后, 均可设置浮动窗口的样式及空间状态.<br>
如将窗口尺寸设置为 `500` × `800`:

```js
/* 在 show 之前设置尺寸. */

console.setSize(500, 800);
console.show();

/* 在 show 之后设置尺寸. */

console.show();
console.setSize(500, 800);

/* 上述两个示例均支持链式调用. */
console.show().setSize(500, 800);
console.setSize(500, 800).show();
```

## [m] isShowing

### isShowing()

**`6.3.0`**

- <ins>**returns**</ins> { [boolean](dataTypes#boolean) }

返回控制台浮动窗口是否未处于隐藏状态.

未隐藏状态包含以下情况:

- 浮动窗口展开显示
- 浮动窗口折叠显示 (最小化)

```js
console.show();
console.isShowing(); // true

console.collapse(); /* 折叠 (最小化) 浮动窗口. */
console.isShowing(); /* 依然为 true. */

console.hide(); /* 隐藏浮动窗口. */
console.isShowing(); // false
```

## [m] hide

### hide()

**`[6.3.0]`**

- <ins>**returns**</ins> { [this](console) }

隐藏控制台浮动窗口.

窗口隐藏后, 其样式及空间状态均被保留, 即使在脚本结束后:

```js
console.show();
console.setSize(500, 800);
console.hide();
```

此时在另一个脚本运行如下代码:

```js
console.show();
```

显示浮动窗口后, 窗口尺寸依然为 `500` × `800`, 之前的窗口配置被还原.

如需在显示之前恢复窗口配置默认值, 可使用 `console.reset()`:

```js
console.reset();
console.show();
```

## [m] reset

### reset()

**`6.3.0`**

- <ins>**returns**</ins> { [this](console) }

重置控制台浮动窗口的样式及空间状态, 恢复其默认值.

`reset` 方法在浮动窗口显示时也可使用:

```js
console.setSize(500, 800).show();
setTimeout(console.reset, 2e3); /* 2 秒钟后重置. */
```

## [m] collapse

### collapse()

**`6.3.0`**

- <ins>**returns**</ins> { [this](console) }

折叠显示控制台浮动窗口, 即最小化窗口.

## [m] expand

### expand()

**`6.3.0`**

- <ins>**returns**</ins> { [this](console) }

展开显示控制台浮动窗口.

使用 [console.show](#m-show) 显示窗口时, 默认为展开显示状态.

## [m] launch

### launch()

**`6.3.0`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

启动控制台 Activity 活动窗口.

此方法相当于是 AutoJs6 首页右上区域点击 "日志" 图标的代码实现.

## [m] build

### build(options)

**`6.3.0`**

- **options** { [ConsoleBuildOptions](consoleBuildOptionsType) } - 构建器选项
- <ins>**returns**</ins> {{ show(): [void](dataTypes#void) }}

构建控制台浮动窗口的配置.

构建后使用 `show` 方法显示控制台浮动窗口, 即 `console.build({ ... }).show()`.

构建器支持一次性配置多个浮动窗口样式选项:

```js
console.build({
    size: [ 0.8, 0.6 ], /* 窗口大小, 80% 屏幕宽度 × 60% 屏幕高度. */
    position: [ 0.1, 0.15 ], /* 窗口位置, X 坐标 10% 屏幕宽度, Y 坐标 15% 屏幕高度. */
    title: 'HELLO WORLD', /* 窗口标题文本. */
    titleTextSize: 18, /* 窗口标题字号, 单位为 sp. */
    contentTextSize: 16, /* 窗口日志字号, 单位 sp. */
    backgroundColor: 'deep-orange-900', /* 窗口标题及日志区域的背景色, 900 号深橙色. */
    titleBackgroundAlpha: 0.8, /* 窗口标题区域背景透明度, 80%. */
    contentBackgroundAlpha: 0.5, /* 窗口日志区域背景透明度, 50%. */
    exitOnClose: 6e3, /* 脚本运行结束时 6 秒钟后自动关闭窗口. */
    touchable: true, /* true: 窗口正常响应点击事件; false: 点击将穿透窗口. */
}).show(); /* 使用 show 方法显示浮动窗口. */
```

更多构建参数及使用方法, 参阅 [ConsoleBuildOptions](consoleBuildOptionsType) 类型章节.

## [m] setSize

### setSize(width, height)

**`[6.3.0]`**

- **width** { [number](dataTypes#number) } - 浮动窗口宽度值 (像素值 / 百分数)
- **height** { [number](dataTypes#number) } - 浮动窗口高度值 (像素值 / 百分数)
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的尺寸.

```js
console.setSize(0.8, 700).show(); /* 80% 屏幕宽度, 700 像素高度. */
console.build({ size: [ 0.8, 700 ] }).show(); /* 效果同上. */
```

## [m] setPosition

### setPosition(x, y)

**`[6.3.0]`**

- **x** { [number](dataTypes#number) } - 浮动窗口位置 X 坐标 (像素值 / 百分数)
- **y** { [number](dataTypes#number) } - 浮动窗口位置 Y 坐标 (像素值 / 百分数)
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的位置.

```js
console.setPosition(0.1, 0.15).show(); /* X: 10% 屏幕宽度, Y: 15% 屏幕高度. */
console.build({ position: [ 0.1, 0.15 ] }).show(); /* 效果同上. */
```

## [m] setGravity

### setGravity(gravity)

**`6.6.0`**

- **gravity** { [string](dataTypes#string) | [number](dataTypes#number) } - 窗口重力
- <ins>**returns**</ins> { [void](dataTypes#void) }

按重力将控制台浮动窗口贴靠到屏幕指定位置. 字符串可使用 `left`, `top`, `right`, `bottom`, `start`, `end`, `center`, `center_horizontal` 和 `center_vertical`, 并可使用 `|` 组合.

数字形式对应 `android.view.Gravity` 常量.

```js
console.setGravity('right|bottom');
console.show();

console.build({ gravity: android.view.Gravity.CENTER }).show();
```

调用 [setPosition](#m-setposition) 会清除已保存的重力设置.

## [m] setExitOnClose

### setExitOnClose(exitOnClose?)

**`6.3.0`** **`Overload 1/2`**

- [ `true` ] **exitOnClose** { [boolean](dataTypes#boolean) } - 浮动窗口是否自动关闭
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口在脚本结束时是否自动关闭.

```js
console.setExitOnClose(true).show(); /* 自动关闭启用, 脚本结束后 5 秒钟自动关闭浮动窗口. */
console.setExitOnClose().show(); /* 省略参数, 效果同上. */
console.build({ exitOnClose: true }).show(); /* 效果同上. */

console.setExitOnClose(false).show(); /* 禁用自动关闭. */
console.build({ exitOnClose: false }).show(); /* 效果同上. */
```

### setExitOnClose(timeout)

**`6.3.0`** **`Overload 2/2`**

- **timeout** { [number](dataTypes#number) } - 浮动窗口自动关闭的超时时间 (毫秒)
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口在脚本结束时自动关闭的超时时间, 单位为毫秒.

```js
console.setExitOnClose(6e3).show(); /* 脚本结束后 6 秒钟自动关闭浮动窗口. */
console.build({ exitOnClose: 6e3 }).show(); /* 效果同上. */
```

## [m] setTouchable

### setTouchable(touchable?)

**`6.5.0`**

- [ `true` ] **touchable** { [boolean](dataTypes#boolean) } - 是否响应点击事件
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口是否响应点击事件, 默认为 `true`.

如需穿透点击, 可设置为 `false`.

```js
console.setTouchable(false).show(); /* 点击事件将穿透控制台浮动窗口. */
console.build({ touchable: false }).show(); /* 效果同上. */
```

当 `setTouchable` 传入 `false` 时, 浮动窗口顶部的关闭按钮将无法通过点击触发, 此时可借助 [hide](#m-hide) 或 [setExitOnClose](#m-setexitonclose) 等代码方式实现浮动窗口关闭:

```js
/* 借助 setExitOnClose 实现脚本结束后自动关闭窗口. */

console
    .setTouchable(false)
    .setExitOnClose(true)
    .show();

/* 使用 build 构建器写法. */

console.build({
    touchable: false,
    exitOnClose: true,
}).show();

/* 使用音量键控制, 例如按下 "音量减" 键关闭窗口 (需要无障碍服务). */

events.observeKey();
events.setKeyInterceptionEnabled(true);
events.on('volume_down', () => {
    console.hide();
    exit(); /* 退出脚本 (可选). */
});
```

## [m] setTouchThrough

### setTouchThrough(touchThrough?)

**`6.6.0`**

- **[ touchThrough = false ]** { [boolean](dataTypes#boolean) } - 是否让触摸事件穿透窗口
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置控制台浮动窗口是否让触摸事件穿透. 此方法与 [setTouchable](#m-settouchable) 的布尔值语义相反.

```js
console.setTouchThrough(true);
console.show();

console.build({ touchThrough: true }).show();
```

## [m] setAvoidStatusBar

### setAvoidStatusBar(avoid?)

**`6.8.0`**

- [ `true` ] **avoid** { [boolean](dataTypes#boolean) } - 是否避让状态栏
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口是否避让状态栏, 默认为 `true`.

避让状态栏时, [setPosition](#m-setposition) 的 Y 坐标从状态栏下方开始计算, `console.setPosition(0, 0)` 将窗口置于状态栏正下方;
不避让时, Y 坐标从屏幕顶端开始计算, 窗口可覆盖状态栏区域.

```js
console.setAvoidStatusBar(false).setPosition(0, 0).show(); /* 窗口置于屏幕左上角并覆盖状态栏. */
console.build({ avoidStatusBar: false, position: [ 0, 0 ] }).show(); /* 效果同上. */
```

## [m] setTimeVisible

### setTimeVisible(visible?)

**`6.8.0`**

- [ `true` ] **visible** { [boolean](dataTypes#boolean) } - 是否显示时间前缀
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口是否在每条日志前显示时间前缀 (如 `12:34:56.789/D: `), 默认为 `false`.

时间前缀的格式可通过 [setTimeFormat](#m-settimeformat) 设置.

```js
console.setTimeVisible().show(); /* 显示时间前缀. */
console.setTimeVisible(true).show(); /* 效果同上. */
console.build({ timeVisible: true }).show(); /* 效果同上. */
```

## [m] setTimeFormat

### setTimeFormat(pattern?)

**`6.8.0`**

- [ `'HH:mm:ss.SSS'` ] **pattern** { [string](dataTypes#string) } - 时间格式模式, 参阅 [SimpleDateFormat](https://developer.android.com/reference/java/text/SimpleDateFormat)
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口时间前缀的格式, 默认为 `'HH:mm:ss.SSS'`.

省略参数或传入无效的模式时, 恢复默认格式.

```js
console.setTimeVisible().setTimeFormat('HH:mm:ss').show(); /* 时间前缀精确到秒. */
console.build({ timeVisible: true, timeFormat: 'HH:mm:ss' }).show(); /* 效果同上. */
```

## [m] setColorful

### setColorful(colorful?)

**`6.8.0`**

- [ `true` ] **colorful** { [boolean](dataTypes#boolean) } - 是否按日志等级着色
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口是否按日志等级 (verbose / log / info / warn / error) 使用不同的文本颜色, 默认为 `true`.

设置为 `false` 时, 所有等级的日志均使用 `log` 等级的文本颜色.

```js
console.setColorful(false).show(); /* 关闭日志着色. */
console.build({ colorful: false }).show(); /* 效果同上. */
```

## [m] setInputVisible

### setInputVisible(visible?)

**`6.8.0`**

- [ `true` ] **visible** { [boolean](dataTypes#boolean) } - 是否常驻显示输入栏
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口是否常驻显示输入栏, 默认为 `false`.

默认情况下, 输入栏仅在脚本调用 [rawInput](#m-rawinput) 或 [input](#m-input) 等待输入时显示, 输入完成后自动隐藏.
设置为 `true` 后, 输入栏始终显示, 用户提交的内容将交给等待输入的脚本, 若无脚本等待则给出提示.

```js
console.setInputVisible().show(); /* 常驻显示输入栏. */
console.build({ inputVisible: true }).show(); /* 效果同上. */
```

## [m] setTitle

### setTitle(title)

**`[6.3.0]`**

- **title** { [string](dataTypes#string) } - 浮动窗口标题文本
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的标题文本.

```js
console.setTitle('空调温度监测').show();
console.build({ title: '空调温度监测' }).show(); /* 效果同上. */
```

## [m] setTitleTextSize

### setTitleTextSize(size)

**`6.3.0`**

- **size** { [number](dataTypes#number) } - 浮动窗口标题文本字体大小
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的标题文本字体大小, 单位 `sp`.

```js
console.setTitleTextSize(20).show(); /* 设置标题字体大小为 20sp. */
console.build({ titleTextSize: 20 }).show(); /* 效果同上. */
```

## [m] setTitleTextColor

### setTitleTextColor(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 浮动窗口标题文本字体颜色
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的标题文本字体颜色.

```js
console.setTitleTextColor('dark-orange').show(); /* 设置标题字体颜色为深橙色. */
console.build({ titleTextColor: 'dark-orange' }).show(); /* 效果同上. */
```

## [m] setTitleBackgroundColor

### setTitleBackgroundColor(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 浮动窗口标题显示区域背景颜色
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的标题显示区域背景颜色.

```js
/* 设置标题显示区域背景颜色为深蓝色. */
console.setTitleBackgroundColor('dark-blue').show();
console.build({ titleBackgroundColor: 'dark-blue' }).show(); /* 效果同上. */

/* 设置标题显示区域背景颜色为半透明深蓝色. */
console.setTitleBackgroundColor(Color('dark-blue').setAlpha(0.5)).show();
console.setTitleBackgroundColor('#8000008B').show(); /* 效果同上. */

/* 透明度也可使用 setTitleBackgroundAlpha 单独设置. */
console
    .setTitleBackgroundColor('dark-blue')
    .setTitleBackgroundAlpha(0.5)
    .show();
```

如需在设置颜色时保留原有的背景透明度值, 可使用 [setTitleBackgroundTint](#m-settitlebackgroundtint) 方法:

```js
/* 深蓝色背景, 透明度丢失, 即完全不透明. */
console.setTitleBackgroundColor('dark-blue').show();

/* 深蓝色背景, 透明度保留. */
console.setTitleBackgroundTint('dark-blue').show();
```

## [m] setTitleBackgroundTint

### setTitleBackgroundTint(color)

**`6.6.0`**

- **color** { [OmniColor](omniTypes#omnicolor) | [null](dataTypes#null) } - 浮动窗口标题显示区域背景颜色, `null` 表示清除着色
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的标题显示区域背景着色, 保留原有透明度值.

```js
/* 设置标题显示区域背景着色为深蓝色. */
console.setTitleBackgroundTint('dark-blue').show();
console.build({ titleBackgroundTint: 'dark-blue' }).show(); /* 效果同上. */
```

与 [setTitleBackgroundColor](#m-settitlebackgroundcolor) 的区别:

```js
/* 深蓝色背景, 透明度保留. */
console.setTitleBackgroundTint('dark-blue').show();

/* 深蓝色背景, 透明度丢失, 即完全不透明. */
console.setTitleBackgroundColor('dark-blue').show();
```

## [m] setTitleBackgroundAlpha

### setTitleBackgroundAlpha(alpha)

**`6.3.0`**

- **alpha** { [number](dataTypes#number) } - 浮动窗口标题显示区域背景颜色透明度
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的标题显示区域背景颜色透明度.

```js
/* 设置标题显示区域背景颜色为半透明. */
console.setTitleBackgroundAlpha(0.5).show();
console.build({ titleBackgroundAlpha: 0.5 }).show(); /* 效果同上. */

/* 设置标题显示区域背景颜色为半透明深蓝色. */
console
    .setTitleBackgroundColor('dark-blue')
    .setTitleBackgroundAlpha(0.5)
    .show();
```

使用 `-1` 可重置标题区域的透明度 (为 `0.8`):

```js
console.setTitleBackgroundAlpha(-1).show();
console.resetTitleBackgroundAlpha().show(); /* 同上. */
```

## [m] resetTitleBackgroundAlpha

### resetTitleBackgroundAlpha()

**`6.6.0`**

- <ins>**returns**</ins> { [this](console) }

重置控制台浮动窗口的标题显示区域背景颜色透明度, 默认值为 `0.8`.

```js
console.resetTitleBackgroundAlpha().show();
console.setTitleBackgroundAlpha(-1).show(); /* 同上. */
```

## [m] setTitleIconsTint

### setTitleIconsTint(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 浮动窗口操作按钮着色
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的操作按钮着色.

```js
/* 设置操作按钮着色为绿色. */
console.setTitleIconsTint('green').show();
console.build({ titleIconsTint: 'green' }).show(); /* 效果同上. */
```

## [m] setContentTextSize

### setContentTextSize(size: number)

**`6.3.0`**

- **param** { [number](dataTypes#number) } - 浮动窗口日志文本字体大小
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的日志文本字体大小, 单位 `sp`.

```js
/* 设置日志文本字体大小为 18sp. */
console.setContentTextSize(18).show();
console.build({ contentTextSize: 18 }).show(); /* 效果同上. */
```

## [m] setContentTextColor

### setContentTextColor(colorMap)

**`6.3.0`** **`Overload 1/2`**

- **colorMap** {{
    - verbose?: [OmniColor](omniTypes#omnicolor);
    - log?: [OmniColor](omniTypes#omnicolor);
    - info?: [OmniColor](omniTypes#omnicolor);
    - warn?: [OmniColor](omniTypes#omnicolor);
    - error?: [OmniColor](omniTypes#omnicolor);
    - assert?: [OmniColor](omniTypes#omnicolor);
- }} - 浮动窗口日志文本字体颜色表

设置控制台浮动窗口的日志文本字体颜色, 按日志等级设置一个或多个不同的字体颜色.

```js
/* 设置 LOG 等级日志字体颜色为深橙色. */
console.setContentTextColor({ log: 'dark-orange' }).show();
console.log('content text color test for console.log');

/* 设置 ERROR 等级日志字体颜色为深红色. */
console.setContentTextColor({ error: 'dark-red' }).show();
console.error('content text color test for console.error');

/* 设置多个不同等级日志的字体颜色. */
console.setContentTextColor({
    verbose: 'gray',
    log: 'white',
    info: 'light-green',
    warn: 'light-blue',
    error: 'red',
}).show();
[ 'verbose', 'log', 'info', 'warn', 'error' ].forEach((fName) => {
    console[fName].call(console, `content text color test for console.${fName}`);
});
```

### setContentTextColor(color)

**`6.3.0`** **`Overload 2/2`**

- **colors** { [OmniColor](omniTypes#omnicolor) } - 浮动窗口日志文本字体统一颜色
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的日志文本字体的统一颜色.

此方法设置颜色时不区分日志等级, 统一设置所有日志的文本颜色.

```js
/* 所有日志本文的颜色统一设置为深绿色. */
console.setContentTextColor('dark-green').show();
[ 'verbose', 'log', 'info', 'warn', 'error' ].forEach((fName) => {
    console[fName].call(console, `content text color test for console.${fName}`);
});
```

## [m] setContentTextColors

### setContentTextColors(...colors)

**`6.6.0`**

- **...colors** { [...](documentation#可变参数)[OmniColor](omniTypes#omnicolor)[[]](documentation#可变参数) } - 各日志等级的文字颜色
- <ins>**returns**</ins> { [this](console) }

[setContentTextColor](#m-setcontenttextcolor) 的兼容别名. 传入多个颜色时依次对应 `verbose`, `log`, `info`, `warn`, `error` 和 `assert`.

## [m] setContentBackgroundColor

### setContentBackgroundColor(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 浮动窗口日志显示区域背景颜色
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的日志显示区域背景颜色.

```js
/* 设置日志显示区域背景颜色为深蓝色. */
console.setContentBackgroundColor('dark-blue').show();
console.build({ contentBackgroundColor: 'dark-blue' }).show(); /* 效果同上. */

/* 设置日志显示区域背景颜色为半透明深蓝色. */
console.setContentBackgroundColor(Color('dark-blue').setAlpha(0.5)).show();
console.setContentBackgroundColor('#8000008B').show(); /* 效果同上. */

/* 透明度也可使用 setContentBackgroundAlpha 单独设置. */
console
    .setContentBackgroundColor('dark-blue')
    .setContentBackgroundAlpha(0.5)
    .show();
```

## [m] setContentBackgroundTint

### setContentBackgroundTint(color)

**`6.6.0`**

- **color** { [OmniColor](omniTypes#omnicolor) | [null](dataTypes#null) } - 浮动窗口日志显示区域背景着色, `null` 表示清除着色
- <ins>**returns**</ins> { [this](console) }

设置日志显示区域背景着色并保留原有透明度. 传入 `null` 可清除着色.

```js
console.setContentBackgroundTint('dark-blue').show();
console.build({ contentBackgroundTint: 'dark-blue' }).show();
```

## [m] setContentBackgroundAlpha

### setContentBackgroundAlpha(alpha)

**`6.3.0`**

- **alpha** { [number](dataTypes#number) } - 浮动窗口日志显示区域背景颜色透明度
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的日志显示区域背景颜色透明度.

```js
/* 设置日志显示区域背景颜色为半透明. */
console.setContentBackgroundAlpha(0.5).show();
console.build({ contentBackgroundAlpha: 0.5 }).show(); /* 效果同上. */

/* 设置日志显示区域背景颜色为半透明深蓝色. */
console
    .setContentBackgroundColor('dark-blue')
    .setContentBackgroundAlpha(0.5)
    .show();
```

使用 `-1` 可重置日志区域的透明度 (为 `0.6`):

```js
console.setContentBackgroundAlpha(-1).show();
console.resetContentBackgroundAlpha().show(); /* 同上. */
```

## [m] resetContentBackgroundAlpha

### resetContentBackgroundAlpha()

**`6.6.0`**

- <ins>**returns**</ins> { [this](console) }

重置控制台浮动窗口的日志显示区域背景颜色透明度, 默认值为 `0.6`.

```js
console.resetContentBackgroundAlpha().show();
console.setContentBackgroundAlpha(-1).show(); /* 同上. */
```

## [m] setTextSize

### setTextSize(size)

**`6.3.0`**

- **size** { [number](dataTypes#number) } - 浮动窗口标题及日志文本字体大小
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的标题及日志文本字体大小, 单位 `sp`.

相当于 [setTitleTextSize](#m-settitletextsize) 和 [setContentTextSize](#m-setcontenttextsize) 的集成.

```js
/* 设置标题及日志文本字体大小为 18sp. */
console.setTextSize(18).show();
console.build({ textSize: 18 }).show(); /* 效果同上. */
```

## [m] setTextColor

### setTextColor(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 浮动窗口标题及日志文本字体颜色
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的标题及日志文本字体颜色.

对于日志文本, 不区分等级, 统一设置字体颜色.

相当于 [setTitleTextColor](#m-settitletextcolor) 和 [setContentTextColor](#m-setcontenttextcolor) 的集成.

```js
/* 所有标题及日志本文的颜色统一设置为浅蓝色. */
console.setTextColor('light-blue').show();
[ 'verbose', 'log', 'info', 'warn', 'error' ].forEach((fName) => {
    console[fName].call(console, ` text color test for console.${fName}`);
});
```

## [m] setBackgroundColor

### setBackgroundColor(color)

**`6.3.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 浮动窗口标题及日志显示区域背景颜色
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的标题及日志显示区域背景颜色.

相当于 [setTitleBackgroundColor](#m-settitlebackgroundcolor) 和 [setContentBackgroundColor](#m-setcontentbackgroundcolor) 的集成.

```js
/* 设置标题及日志显示区域背景颜色为浅黄色. */
console.setBackgroundColor('light-yellow').show();
console.build({ backgroundColor: 'light-yellow' }).show(); /* 效果同上. */

/* 设置标题及日志显示区域背景颜色为半透明浅黄色. */
console.setBackgroundColor(Color('light-yellow').setAlpha(0.5)).show();
console.setBackgroundColor('#80FFFFE0').show(); /* 效果同上. */

/* 透明度也可使用 backgroundAlpha 单独设置. */
console
    .setBackgroundColor('light-yellow')
    .setBackgroundAlpha(0.5)
    .show();
```

## [m] setBackgroundTint

### setBackgroundTint(color)

**`6.6.0`**

- **color** { [OmniColor](omniTypes#omnicolor) } - 浮动窗口标题及日志区域背景着色
- <ins>**returns**</ins> { [this](console) }

同时设置标题和日志显示区域的背景着色, 并分别保留原有透明度.

```js
console.setBackgroundTint('light-yellow').show();
console.build({ backgroundTint: 'light-yellow' }).show();
```

## [m] setBackgroundAlpha

### setBackgroundAlpha(alpha)

**`6.3.0`**

- **alpha** { [number](dataTypes#number) } - 浮动窗口标题及日志显示区域背景颜色透明度
- <ins>**returns**</ins> { [this](console) }

设置控制台浮动窗口的标题及日志显示区域背景颜色透明度.

相当于 [setTitleBackgroundAlpha](#m-settitlebackgroundalpha) 和 [setContentBackgroundAlpha](#m-setcontentbackgroundalpha) 的集成.

```js
/* 设置标题及日志显示区域背景颜色为半透明. */
console.setBackgroundAlpha(0.5).show();
console.build({ backgroundAlpha: 0.5 }).show(); /* 效果同上. */

/* 设置标题及日志显示区域背景颜色为半透明浅黄色. */
console
    .setBackgroundColor('light-yellow')
    .setBackgroundAlpha(0.5)
    .show();
```

使用 `-1` 可同时重置标题区域的透明度 (为 `0.8`), 以及日志区域的透明度 (为 `0.6`):

```js
console.setBackgroundAlpha(-1).show();
console.resetBackgroundAlpha().show(); /* 同上. */
```

## [m] resetBackgroundAlpha

### resetBackgroundAlpha()

**`6.6.0`**

- <ins>**returns**</ins> { [this](console) }

重置控制台浮动窗口的标题及日志显示区域背景颜色透明度, 分别为 `0.8` 及 `0.6`.

相当于 [resetTitleBackgroundAlpha](#m-resettitlebackgroundalpha) 和 [resetContentBackgroundAlpha](#m-resetcontentbackgroundalpha) 的集成.

```js
console.resetBackgroundAlpha().show();
console.setBackgroundAlpha(-1).show(); /* 同上. */
```

## [m] verbose

### verbose(data, ...args)

**`Global`**

- **data** { [string](dataTypes#string) } - 可包含占位符的待格式化对象
- **args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - [占位符替换参数](glossaries#占位符替换参数)
- <ins>**returns**</ins> { [void](dataTypes#void) }

输出参数内容到控制台.

主要用途: 测试消息 / 调试消息 / 重要性级别最低的消息

优先级: **verbose** < log < info < warn < error < assert

字体颜色:

- 浮动窗口 - [ <span style="color: #E0E0E0">◑</span> ] - #E0E0E0
- Activity 活动窗口
    - 亮色主题 - [ <span style="color: #C0C0C0">◑</span> ] - #DFC0C0C0
    - 暗色主题 - [ <span style="color: #7F7F80">◑</span> ] - #7F7F80

> 注: 此方法将自动添加末尾换行符.

## [m] log

### log(data, ...args)

**`Global`**

- **data** { [string](dataTypes#string) } - 可包含占位符的待格式化对象
- **args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - [占位符替换参数](glossaries#占位符替换参数)
- <ins>**returns**</ins> { [void](dataTypes#void) }

输出参数内容到控制台.

主要用途: 普通消息

优先级: verbose < **log** < info < warn < error < assert

字体颜色:

- 浮动窗口 - [ <span style="color: #FFFFFF">◑</span> ] - #FFFFFF
- Activity 活动窗口
    - 亮色主题 - [ <span style="color: #000000">◑</span> ] - #CC000000
    - 暗色主题 - [ <span style="color: #E0E0E0">◑</span> ] - #DFE0E0E0

> 注: 此方法将自动添加末尾换行符.

## [m] info

### info(data, ...args)

- **data** { [string](dataTypes#string) } - 可包含占位符的待格式化对象
- **args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - [占位符替换参数](glossaries#占位符替换参数)
- <ins>**returns**</ins> { [void](dataTypes#void) }

输出参数内容到控制台.

主要用途: 重要消息 / 值得注意的消息

优先级: verbose < log < **info** < warn < error < assert

字体颜色:

- 浮动窗口 - [ <span style="color: #DCEDC8">◑</span> ] - #DCEDC8
- Activity 活动窗口 - [ <span style="color: #43A047">◑</span> ] - #43A047

> 注: 此方法将自动添加末尾换行符.

## [m] warn

### warn(data, ...args)

**`Global`**

- **data** { [string](dataTypes#string) } - 可包含占位符的待格式化对象
- **args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - [占位符替换参数](glossaries#占位符替换参数)
- <ins>**returns**</ins> { [void](dataTypes#void) }

输出参数内容到控制台.

主要用途: 警告消息 / 隐患消息

优先级: verbose < log < info < **warn** < error < assert

字体颜色:

- 浮动窗口 - [ <span style="color: #B3E5FC">◑</span> ] - #B3E5FC
- Activity 活动窗口 - [ <span style="color: #1976D2">◑</span> ] - #1976D2

> 注: 此方法将自动添加末尾换行符.

## [m] error

### error(data, ...args)

- **data** { [string](dataTypes#string) } - 可包含占位符的待格式化对象
- **args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - [占位符替换参数](glossaries#占位符替换参数)
- <ins>**returns**</ins> { [void](dataTypes#void) }

输出参数内容到控制台.

主要用途: 错误消息 / 异常消息

优先级: verbose < log < info < warn < **error** < assert

字体颜色:

- 浮动窗口 - [ <span style="color: #FFCDD2">◑</span> ] - #FFCDD2
- Activity 活动窗口 - [ <span style="color: #C62828">◑</span> ] - #C62828

> 注: 此方法将自动添加末尾换行符.

## [m] assert

### assert(bool, message?)

**`6.3.0`** **`Overload [1-2]/4`**

- **bool** { [boolean](dataTypes#boolean) } - 断言值
- **[ message ]** { [string](dataTypes#string) } - 断言失败时的消息
- <ins>**returns**</ins> { [void](dataTypes#void) }

断言 `bool` 参数为真.

断言失败时, 脚本停止运行, 输出失败消息及调用栈信息到控制台.

主要用途: 断言一个变量

优先级: verbose < log < info < warn < error < **assert**

字体颜色:

- 浮动窗口 - [ <span style="color: #FCE4EC">◑</span> ] - #FCE4EC
- Activity 活动窗口 - [ <span style="color: #E254FF">◑</span> ] - #E254FF

```js
console.assert(new Date().getSeconds() < 30, '断言失败, 当前时间秒数不小于 30');
```

> 注: 此方法将自动在控制台消息中添加末尾换行符.

### assert(func, message?)

**`6.3.0`** **`Overload [3-4]/4`**

- **func** { [() =>](dataTypes#function) [boolean](dataTypes#boolean) } - 断言值
- **[ message ]** { [string](dataTypes#string) } - 断言失败时的消息
- <ins>**returns**</ins> { [void](dataTypes#void) }

断言 `func` 参数的执行结果为真.

断言失败时, 脚本停止运行, 输出失败消息及调用栈信息到控制台.

主要用途: 断言一个函数

优先级: verbose < log < info < warn < error < **assert**

字体颜色:

- 浮动窗口 - [ <span style="color: #FCE4EC">◑</span> ] - #FCE4EC
- Activity 活动窗口 - [ <span style="color: #E254FF">◑</span> ] - #E254FF

```js
console.assert(function () {
    return new Date().getSeconds() < 30;
}, '断言失败, 当前时间秒数不小于 30');
```

> 注: 此方法将自动在控制台消息中添加末尾换行符.

## [m] clear

### clear()

**`6.3.0`**

- <ins>**returns**</ins> { [this](console) }

清空控制台日志内容.

## [m] print

### print(data, ...args)

**`Global`** **`DEPRECATED`**

- **data** { [string](dataTypes#string) } - 可包含占位符的待格式化对象
- **args** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - [占位符替换参数](glossaries#占位符替换参数)
- <ins>**returns**</ins> { [void](dataTypes#void) }

等效于 [console.log](#m-log).

> 注: AutoJs6 的 `print` 方法在功能上更接近其他语言的 `printLn`, 而且在浏览器中, 全局方法 `print` 用于打印当前页面. 因此 `print` 全局方法被弃用, 不推荐使用.

## [m] printAllStackTrace

### printAllStackTrace(e)

**`6.3.0`**

- **e** { [OmniThrowable](omniTypes#omnithrowable) } - 异常参数
- <ins>**returns**</ins> { [void](dataTypes#void) }

在控制台打印详细的栈追踪信息.

```js
try {
    null.toString()
} catch (e) {
    /* 打印简单的错误消息. */
    /* 通常只有 1 行消息. */
    console.error(e.message);

    /* 使用 exit 方法抛出异常. */
    /* 通常有不到 10 行消息. */
    exit(e);

    /* 使用 console.printAllStackTrace 打印完整栈追踪信息. */
    /* 通常有几十行消息. */
    console.printAllStackTrace(e);
}
```

## [m] trace

### trace(message, level?)

**`6.3.0`**

- **message** { [string](dataTypes#string) } - 追踪消息
- **[ level = "debug" ]** { `'verbose'` | `'debug'` | `'info'` | `'warn'` | `'error'` | [number](dataTypes#number) } - 消息输出等级
- <ins>**returns**</ins> { [void](dataTypes#void) }

输出当前位置调用栈的追踪信息到控制台.

`level` 参数接收由整形常量转化而来的字符串简化形式:

| 字符串         | 整形常量                                                    | 简述                                                                             |
|-------------|---------------------------------------------------------|--------------------------------------------------------------------------------|
| 'verbose'   | <span style="white-space:nowrap">Log.VERBOSE = 2</span> | <span style="white-space:nowrap">对应 [console.verbose](#m-verbose) 输出等级.</span> |
| **'debug'** | <span style="white-space:nowrap">Log.DEBUG = 3</span>   | <span style="white-space:nowrap">对应 [console.log](#m-log) 输出等级.</span>         |
| 'info'      | <span style="white-space:nowrap">Log.INFO = 4</span>    | <span style="white-space:nowrap">对应 [console.info](#m-info) 输出等级.</span>       |
| 'warn'      | <span style="white-space:nowrap">Log.WARN = 5</span>    | <span style="white-space:nowrap">对应 [console.warn](#m-warn) 输出等级.</span>       |
| 'error'     | <span style="white-space:nowrap">Log.ERROR = 6</span>   | <span style="white-space:nowrap">对应 [console.error](#m-error) 输出等级.</span>     |

```js
function printMessages() {
    console.trace('This is a "normal" message for test');
    console.trace('This is an "info" message for test', 'info');
    console.trace('This is a "warn" message for test', 'warn');
    console.trace('This is an "error" message for test', 'error');
    console.launch();
}

({
    init() {
        this.intermediate();
    },
    intermediate() {
        printMessages();
    },
}).init();

// Error 等级的追踪信息输出样例:
// 20:46:00.709/E: This is an "error" message for test
// 	at consoleTrace.js:5 (printMessages)
// 	at consoleTrace.js:14
// 	at consoleTrace.js:11
// 	at consoleTrace.js:9
```

## [m] time

### time(label?)

- **[ label ]** { [string](dataTypes#string) } - 计时标签
- <ins>**returns**</ins> { [void](dataTypes#void) }

启动计时器, 用以计算以 `label` 参数标记的时间间隔.

[console.timeEnd](#m-timeend) 传入与 `label` 参数相同的值时, 计时器停止, 并输出时间间隔信息到控制台.

多次使用 time 方法传入相同 `label` 时, 将重置其关联的计时器.

```js
console.time('fruit');
sleep(2e3);
console.timeEnd('fruit');
```

## [m] timeEnd

### timeEnd(label?)

- **[ label ]** { [string](dataTypes#string) } - 计时标签
- <ins>**returns**</ins> { [void](dataTypes#void) }

与 console.time 配合使用, 用以计算以 `label` 参数标记的时间间隔.

`label` 关联的计时器不存在时, 打印 `NaNms`.

```js
console.time('fruit');
sleep(2e3);
console.timeEnd('fruit');
```

## [m] setGlobalLogConfig

### setGlobalLogConfig(config)

- **config** {{
    - [ file = `'android-log4j.log'` ]?: [string](dataTypes#string) - 待写入日志的文件路径, 支持绝对路径及相对路径
    - [ maxFileSize = `512 * 1024` ]?: [number](dataTypes#number) - 文件的分卷阈值容量 (单位为字节)
    - [ maxBackupSize = `5` ]?: [number](dataTypes#number) - 文件最大备份数量, 达到上限后将替换最旧文件
    - [ rootLevel = `'all'` ]?: `'all'` | `'off'` | `'debug'` | `'info'` | `'warn'` | `'error'` | `'fatal'` - 日志写入级别
    - [ filePattern = `'%d - [%p::%c::%C] - %m%n'` ]?: [string](dataTypes#string) - 日志写入格式, 参阅 [PatternLayout](https://logging.apache.org/log4j/1.2/apidocs/org/apache/log4j/PatternLayout.html)
- }} - 日志输出至文件的配置选项
- <ins>**returns**</ins> { [void](dataTypes#void) }

设置将全局日志写入文件的配置选项.

该方法会影响所有脚本的日志记录.

```js
console.setGlobalLogConfig({
    file: `./log/${Date.now()}.log`,
    filePattern: '%d{yyyy-MM-dd/}%m%n',
    maxBackupSize: 16,
    maxFileSize: 384 << 10, /* 384 KB. */
});
```

## [m] resetGlobalLogConfig

### resetGlobalLogConfig()

**`6.3.1`**

- <ins>**returns**</ins> { [void](dataTypes#void) }

重置全局日志写入配置.

此方法可重置 [setGlobalLogConfig](#m-setgloballogconfig) 的全部选项配置.

## [m] input

### input(data?, ...args)

**`6.8.0`**

- **[ data ]** { [string](dataTypes#string) } - 可包含占位符的待格式化对象, 作为提示信息打印
- **[ args ]** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - [占位符替换参数](glossaries#占位符替换参数)
- <ins>**returns**</ins> { [any](dataTypes#any) }

读取用户在控制台输入栏提交的一行文本, 并将其作为 JavaScript 表达式求值后返回.

此方法会阻塞脚本线程直到用户提交输入, 因此不能在 UI 线程中调用.
未显示控制台浮动窗口且没有其他界面 (如 UI 模式的 [console](ui#控制台视图) 视图) 显示当前脚本的控制台时, 浮动窗口将自动显示.

```js
let num = console.input('请输入一个数字:');
console.log('%s 的平方是 %s', num, num * num); /* 输入 12 时, 打印 "12 的平方是 144". */
```

此方法曾于 `6.3.1` 版本被废弃, 自 `6.8.0` 版本起重新可用.

## [m] rawInput

### rawInput(data?, ...args)

**`6.8.0`**

- **[ data ]** { [string](dataTypes#string) } - 可包含占位符的待格式化对象, 作为提示信息打印
- **[ args ]** { [...](documentation#可变参数)[any](dataTypes#any)[[]](documentation#可变参数) } - [占位符替换参数](glossaries#占位符替换参数)
- <ins>**returns**</ins> { [string](dataTypes#string) }

读取用户在控制台输入栏提交的一行文本并原样返回.

此方法会阻塞脚本线程直到用户提交输入, 因此不能在 UI 线程中调用.
未显示控制台浮动窗口且没有其他界面显示当前脚本的控制台时, 浮动窗口将自动显示; 输入栏在等待输入期间自动显示, 提交后自动隐藏 (除非使用 [setInputVisible](#m-setinputvisible) 常驻显示).

提交的内容会以 `> ` 前缀回显到控制台.

```js
console.show();
let name = console.rawInput('请输入你的名字:');
console.log('你好, %s', name);

/* 简单的命令循环. */
let cmd;
while ((cmd = console.rawInput()) !== 'exit') {
    console.log('收到命令: %s', cmd);
}
```

脚本运行结束时, 等待中的输入将被取消.

此方法曾于 `6.3.1` 版本被废弃, 自 `6.8.0` 版本起重新可用.
