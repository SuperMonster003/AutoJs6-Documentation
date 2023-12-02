# ConsoleBuildOptions

ConsoleBuildOptions 是一个显示控制台浮动窗口时用于设置窗口选项的接口.  
这些选项将影响控制台浮动窗口的 [ 日志内容样式 / 标题样式 / 窗口尺寸 / 窗口位置 ] 等.

常见相关方法或属性:

- [console.build](console#m-build)(**options**)

---

<p style="font: bold 2em sans-serif; color: #FF7043">ConsoleBuildOptions</p>

---

## [p?] size

- { [&#91;](dataTypes#array) width: [number](dataTypes#number), height: [number](dataTypes#number) [&#93;](dataTypes#array) } - 浮动窗口尺寸

设置控制台浮动窗口的尺寸.

```js
/* 宽 500 像素, 高 800 像素. */
console.build({ size: [ 500, 800 ] }).show();

/* 宽 60% 屏幕宽度, 高 70% 屏幕高度. */
console.build({ size: [ 0.6, 0.7 ] }).show();
```

## [p?] position

- { [&#91;](dataTypes#array) x: [number](dataTypes#number), y: [number](dataTypes#number) [&#93;](dataTypes#array) } - 浮动窗口位置

设置控制台浮动窗口的位置.

```js
/* X 坐标 150 像素, Y 坐标 100 像素. */
console.build({ position: [ 150, 100 ] }).show();

/* X 坐标 20% 屏幕宽度, Y 坐标 10% 屏幕高度. */
console.build({ position: [ 0.2, 0.1 ] }).show();
```

## [p?] exitOnClose

- [ `false` ] { [number](dataTypes#number) | [boolean](dataTypes#boolean) } - 浮动窗口自动关闭的超时时间或启用状态

设置控制台浮动窗口在脚本结束时自动关闭的超时时间或启用状态.

```js
/* 脚本结束时 6 秒后自动关闭浮动窗口. */
console.build({ exitOnClose: 6e3 }).show();

/* 脚本结束时立即自动关闭浮动窗口. */
console.build({ exitOnClose: 0 }).show();

/* 禁用浮动窗口自动关闭. */
console.build({ exitOnClose: false }).show();
```

`exitOnClose` 设置为 `true` 时, 相当于 `exitOnClose(5e3)`, 即脚本结束时浮动窗口在 `5` 秒钟后自动关闭.

## [p?] touchable

- [ `true` ] { [boolean](dataTypes#boolean) } - 是否响应点击事件

设置控制台浮动窗口是否响应点击事件, 默认为 `true`.

如需穿透点击, 可设置为 `false`.

```js
/* 点击事件将穿透控制台浮动窗口. */
console.build({ touchable: false }).show();
```

当设置 `touchable` 为 `false` 时, 浮动窗口顶部的关闭按钮将无法通过点击触发, 此时可借助 [hide](console#m-hide) 或 [setExitOnClose](console#m-setexitonclose) 等代码方式实现浮动窗口关闭. 详见 [console.setTouchable](console#m-settouchable) 小节.

## [p?] title

- { [string](dataTypes#string) } - 浮动窗口标题文本

设置控制台浮动窗口的标题文本.

```js
console.build({ title: '空调温度监测' }).show();
```

## [p?] titleTextSize

- { [number](dataTypes#number) } - 浮动窗口标题文本字体大小

设置控制台浮动窗口的标题文本字体大小, 单位 `sp`.

```js
/* 设置标题字体大小为 20sp. */
console.build({ titleTextSize: 20 }).show();
```

## [p?] titleTextColor

- { [OmniColor](omniTypes#omnicolor) } - 浮动窗口标题文本字体颜色

设置控制台浮动窗口的标题文本字体颜色.

```js
/* 设置标题字体颜色为深橙色. */
console.build({ titleTextColor: 'dark-orange' }).show();
```

## [p?] titleBackgroundColor

- { [OmniColor](omniTypes#omnicolor) } - 浮动窗口标题显示区域背景颜色

设置控制台浮动窗口的标题显示区域背景颜色.

```js
/* 设置标题显示区域背景颜色为深蓝色. */
console.build({ titleBackgroundColor: 'dark-blue' }).show();

/* 设置标题显示区域背景颜色为半透明深蓝色. */
console.build({ titleBackgroundColor: Color('dark-blue').setAlpha(0.5) }).show();
console.build({ titleBackgroundColor: '#8000008B' }).show(); /* 效果同上. */

/* 透明度也可使用 titleBackgroundAlpha 单独设置. */
console.build({
    titleBackgroundColor: 'dark-blue',
    titleBackgroundAlpha: 0.5,
}).show();
```

## [p?] titleBackgroundAlpha

- { [number](dataTypes#number) } - 浮动窗口标题显示区域背景颜色透明度

设置控制台浮动窗口的标题显示区域背景颜色透明度.

```js
/* 设置标题显示区域背景颜色为半透明. */
console.build({ titleBackgroundAlpha: 0.5 }).show();

/* 设置标题显示区域背景颜色为半透明深蓝色. */
console.build({
    titleBackgroundColor: 'dark-blue',
    titleBackgroundAlpha: 0.5,
}).show();
```

## [p?] titleIconsTint

- { [OmniColor](omniTypes#omnicolor) } - 浮动窗口操作按钮着色

设置控制台浮动窗口的操作按钮着色.

```js
/* 设置操作按钮着色为绿色. */
console.build({ titleIconsTint: 'green' }).show();
```

## [p?] contentTextSize

- { [number](dataTypes#number) } - 浮动窗口日志文本字体大小

设置控制台浮动窗口的日志文本字体大小, 单位 `sp`.

```js
/* 设置日志文本字体大小为 18sp. */
console.build({ contentTextSize: 18 }).show();
```

## [p?] contentTextColor

**`Overload 1/2`**

- {{
    - verbose?: [OmniColor](omniTypes#omnicolor);
    - log?: [OmniColor](omniTypes#omnicolor);
    - info?: [OmniColor](omniTypes#omnicolor);
    - warn?: [OmniColor](omniTypes#omnicolor);
    - error?: [OmniColor](omniTypes#omnicolor);
    - assert?: [OmniColor](omniTypes#omnicolor);
- }} - 浮动窗口日志文本字体颜色

设置控制台浮动窗口的日志文本字体颜色, 按日志等级设置一个或多个不同的字体颜色.

```js
/* 设置 LOG 等级日志字体颜色为深橙色. */
console.build({ contentTextColor: { log: 'dark-orange' } }).show();
console.log('content text color test for console.log');

/* 设置 ERROR 等级日志字体颜色为深红色. */
console.build({ contentTextColor: { error: 'dark-red' } }).show();
console.error('content text color test for console.error');

/* 设置多个不同等级日志的字体颜色. */
console.build({
    contentTextColor: {
        verbose: 'gray',
        log: 'white',
        info: 'light-green',
        warn: 'light-blue',
        error: 'red',
    }
}).show();
[ 'verbose', 'log', 'info', 'warn', 'error' ].forEach((fName) => {
    console[fName].call(console, `content text color test for console.${fName}`);
});
```

**`Overload 2/2`**

- { [OmniColor](omniTypes#omnicolor) } - 浮动窗口日志文本统一字体颜色

使用 `{ contentTextColor: OmniColor }` 时, 不区分日志等级, 统一设置所有日志的文本颜色:

```js
/* 所有日志本文的颜色统一设置为深绿色. */
console.build({
    contentTextColor: 'dark-green',
}).show();
[ 'verbose', 'log', 'info', 'warn', 'error' ].forEach((fName) => {
    console[fName].call(console, `content text color test for console.${fName}`);
});
```

## [p?] contentBackgroundColor

- { [OmniColor](omniTypes#omnicolor) } - 浮动窗口日志显示区域背景颜色

设置控制台浮动窗口的日志显示区域背景颜色.

```js
/* 设置日志显示区域背景颜色为深蓝色. */
console.build({ contentBackgroundColor: 'dark-blue' }).show();

/* 设置日志显示区域背景颜色为半透明深蓝色. */
console.build({ contentBackgroundColor: Color('dark-blue').setAlpha(0.5) }).show();
console.build({ contentBackgroundColor: '#8000008B' }).show(); /* 效果同上. */

/* 透明度也可使用 contentBackgroundAlpha 单独设置. */
console.build({
    contentBackgroundColor: 'dark-blue',
    contentBackgroundAlpha: 0.5,
}).show();
```

## [p?] contentBackgroundAlpha

- { [number](dataTypes#number) } - 浮动窗口日志显示区域背景颜色透明度

设置控制台浮动窗口的日志显示区域背景颜色透明度.

```js
/* 设置日志显示区域背景颜色为半透明. */
console.build({ contentBackgroundAlpha: 0.5 }).show();

/* 设置日志显示区域背景颜色为半透明深蓝色. */
console.build({
    contentBackgroundColor: 'dark-blue',
    contentBackgroundAlpha: 0.5,
}).show();
```

## [p?] textSize

- { [number](dataTypes#number) } - 浮动窗口标题及日志文本字体大小

设置控制台浮动窗口的标题及日志文本字体大小, 单位 `sp`.

相当于 [titleTextSize](#p-titletextsize) 和 [contentTextSize](#p-contenttextsize) 的集成.

```js
/* 设置标题及日志文本字体大小为 18sp. */
console.build({ textSize: 18 }).show();
```

## [p?] textColor

- [OmniColor](omniTypes#omnicolor) } - 浮动窗口标题及日志文本字体颜色

设置控制台浮动窗口的标题及日志文本字体颜色.

对于日志文本, 不区分等级, 统一设置字体颜色.

相当于 [titleTextColor](#p-titletextcolor) 和 [contentTextColor](#p-contenttextcolor) 的集成.

```js
/* 所有标题及日志本文的颜色统一设置为浅蓝色. */
console.build({
    textColor: 'light-blue',
}).show();
[ 'verbose', 'log', 'info', 'warn', 'error' ].forEach((fName) => {
    console[fName].call(console, ` text color test for console.${fName}`);
});
```

## [p?] backgroundColor

- { [OmniColor](omniTypes#omnicolor) } - 浮动窗口标题及日志显示区域背景颜色

设置控制台浮动窗口的标题及日志显示区域背景颜色.

相当于 [titleBackgroundColor](#p-titlebackgroundcolor) 和 [contentBackgroundColor](#p-contentbackgroundcolor) 的集成.

```js
/* 设置标题及日志显示区域背景颜色为浅黄色. */
console.build({ backgroundColor: 'light-yellow' }).show();

/* 设置标题及日志显示区域背景颜色为半透明浅黄色. */
console.build({ backgroundColor: Color('light-yellow').setAlpha(0.5) }).show();
console.build({ backgroundColor: '#80FFFFE0' }).show(); /* 效果同上. */

/* 透明度也可使用 backgroundAlpha 单独设置. */
console.build({
    backgroundColor: 'light-yellow',
    backgroundAlpha: 0.5,
}).show();
```

## [p?] backgroundAlpha

- { [number](dataTypes#number) } - 浮动窗口标题及日志显示区域背景颜色透明度

设置控制台浮动窗口的标题及日志显示区域背景颜色透明度.

相当于 [titleBackgroundAlpha](#p-titlebackgroundalpha) 和 [contentBackgroundAlpha](#p-contentbackgroundalpha) 的集成.

```js
/* 设置标题及日志显示区域背景颜色为半透明. */
console.build({ backgroundAlpha: 0.5 }).show();

/* 设置标题及日志显示区域背景颜色为半透明浅黄色. */
console.build({
    backgroundColor: 'light-yellow',
    backgroundAlpha: 0.5,
}).show();
```