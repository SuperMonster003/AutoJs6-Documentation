# 全能类型 (Omnipotent Types)

---

<p style="font: italic 1em sans-serif; color: #78909C">此章节待补充或完善...</p>
<p style="font: italic 1em sans-serif; color: #78909C">Marked by SuperMonster003 on Apr 9, 2023.</p>

---

全能类型是一种聚合类型.

AutoJs6 模块中, 一个参数往往接受多种不同的类型, 这些类型均可体现这个参数的含义. 这样的类型成为全能类型.

如对于 `颜色 (color)`, 有 [ColorHex](dataTypes#colorhex) 和 [ColorName](dataTypes#colorname) 等多种类型可以表示, 它们都可以作为实参传入方法中:

```js
/* 需要为 console 悬浮窗设置一个浅蓝色标题. */
/* 以下 4 种方法分别传入不同类型的参数, 但实现了同样的效果. */

console.setTitleTextColor('light-blue'); /* ColorName 类型. */
console.setTitleTextColor('#ADD8E6'); /* ColorHex 类型. */
console.setTitleTextColor(Color('#ADD8E6').toInt()); /* ColorInt 类型. */
console.setTitleTextColor(Color('#ADD8E6')); /* Color 类型. */

console.show(); /* 显示控制台悬浮窗. */
```

上述示例中 `console.setTitleTextColor` 的方法签名可以写成以下形式:

```text
console.setTitleTextColor(color: OmniColor): void
```

其中使用 `OmniColor` 这个全能类型代表了颜色聚合类型.

---

## OmniColor

颜色聚合类型.

| 类型                                 | 简述                                            | 示例                                                          |
|------------------------------------|-----------------------------------------------|-------------------------------------------------------------|
| [ColorHex](dataTypes#colorhex)     | <span style="white-space:nowrap">颜色代码</span>  | <span style="white-space:nowrap">`#663399`</span>           |
| [ColorInt](dataTypes#colorint)     | <span style="white-space:nowrap">颜色整数</span>  | <span style="white-space:nowrap">`-10079335`</span>         |
| [ColorName](dataTypes#colorname)   | <span style="white-space:nowrap">颜色名称</span>  | <span style="white-space:nowrap">`'rebecca-purple'`</span>  |
| [Color](colorType)                 | <span style="white-space:nowrap">颜色类</span>   | <span style="white-space:nowrap">`Color('#663399')`</span>  |
| [ThemeColor](dataTypes#themecolor) | <span style="white-space:nowrap">主题颜色类</span> | <span style="white-space:nowrap">`autojs.themeColor`</span> |

`OmniColor` 不仅可用于参数传入方法中, 还可以作为 XML 元素的属性值:

```js
'ui';

ui.layout(<vertical>
    <button text="click to start" color="#006400"/>
</vertical>);
```

上述示例设置按钮布局的文字颜色为深绿色, 使用了 [ColorHex](dataTypes#colorhex) 作为颜色值.

使用 [ColorName](dataTypes#colorname) 作为颜色值也可达到相同的效果:

```js
'ui';

ui.layout(<vertical>
    <button text="click to start" color="dark-green"/>
</vertical>);
```

使用 [ColorInt](dataTypes#colorint) 作为颜色值同样可以达到相同的效果:

```js
'ui';

ui.layout(<vertical>
    <button text="click to start" color="-16751616"/>
</vertical>);
```

如需使用主题色作为颜色值, 需要使用一对花括号以及绑定全局作用域的表达式:

```js
'ui';

ui.layout(<vertical>
    <button text="click to start" color="{{autojs.themeColor}}"/>
</vertical>);
```

## OmniIntent

Intent 聚合类型.

| 类型                                                                 | 简述                                                 | 示例                                                                                              |
|--------------------------------------------------------------------|----------------------------------------------------|-------------------------------------------------------------------------------------------------|
| [Intent](intentType)                                               | <span style="white-space:nowrap">意图类</span>        | <span style="white-space:nowrap">`new Intent().setAction( ... )` / `app.intent({ ... })`</span> |
| [IntentOptions](intentOptionsType)                                 | <span style="white-space:nowrap">意图选项</span>       | <span style="white-space:nowrap">`{ action: ... , className: ... , data: ... }`</span>          |
| [IntentShortFormForActivity](dataTypes#intentshortformforactivity) | <span style="white-space:nowrap">意图活动简称</span>     | <span style="white-space:nowrap">`docs` / `home` / `settings` / `console` / `about`</span>      |
| [IntentUriString](dataTypes#intenturistring)                       | <span style="white-space:nowrap">意图 URI 字符串</span> | <span style="white-space:nowrap">`'https://msn.com'` / `'msn.com'`</span>                       |

## OmniVibrationPattern

振动模式聚合类型.

| 类型                                                                                      | 简述                                                            | 示例                                                                   |
|-----------------------------------------------------------------------------------------|---------------------------------------------------------------|----------------------------------------------------------------------|
| <span style="white-space:nowrap">[number](dataTypes#number)[[]](dataTypes#array)</span> | <span style="white-space:nowrap">传统振动模式 (按数字代表的启停间隔振动)</span> | <span style="white-space:nowrap">`[ 0, 200, 0, 200, 0, 200 ]`</span> |
| [string](dataTypes#string)                                                              | <span style="white-space:nowrap">文本 (按文本对应的摩斯电码振动)</span>     | <span style="white-space:nowrap">`'hello'`</span>                    |

用于模拟 SOS (紧急求救信号) 的示例:

```js
device.vibrate([ 100, 100, 100, 100, 100, 300, 300, 100, 300, 100, 300, 300, 100, 100, 100, 100, 100 ], 0);
device.vibrate('SOS'); /* 效果同上. */
```

## OmniRegion

区域聚合类型.

| 类型                                                                                      | 简述                                                                 | 示例                                                                                                                                     |
|-----------------------------------------------------------------------------------------|--------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| <span style="white-space:nowrap">[number](dataTypes#number)[[]](dataTypes#array)</span> | <span style="white-space:nowrap">数字数组, [ X 坐标, Y 坐标, 宽, 高 ]</span> | <span style="white-space:nowrap">`[ 0, 0, 200, 400 ]`</span>                                                                           |
| [OpenCVRect](opencvRectType)                                                            | <span style="white-space:nowrap">`org.opencv.core.Rect` 类型</span>  | <span style="white-space:nowrap">1. `images.buildRegion(img, [ 0, 0, 200, 400 ])`<br/>2. `new org.opencv.core.Rect(x, y, w, h)`</span> |
| [AndroidRect](androidRectType)                                                          | <span style="white-space:nowrap">`android.graphics.Rect` 类型</span> | <span style="white-space:nowrap">1. `pickup(/\w+/, 'bounds')`<br/>2. `new android.graphics.Rect(left, top, right, bottom)`</span>      |

将一个 500 × 500 的图片裁剪其中心区域 300 × 300 的示例:

```js
let img = images.read('...');
let imgWidth = img.getWidth(); // 500
let imgHeight = img.getHeight(); // 500

let clipWidth = 300;
let clipHeight = 300;
let clipX = (imgWidth - clipWidth) / 2;
let clipY = (imgHeight - clipHeight) / 2;

/* 使用 number[] 作为区域. */

images.clip(img, [ clipX, clipY, clipWidth, clipHeight ]);

/* 使用 OpenCVRect 作为区域. */

images.clip(img, new org.opencv.core.Rect(clipX, clipY, clipWidth, clipHeight));

/* 使用 AndroidRect 作为区域. */

let left = clipX;
let top = clipY;
let right = clipX + clipWidth;
let bottom = clipY + clipHeight;
images.clip(img, new android.graphics.Rect(left, top, right, bottom));

/* AndroidRect 结合控件的应用. */
/* 假设屏幕的活动窗口中存在一个控件, id 为 aim, 它的控件矩形区域恰好为所需区域. */

let bounds = pickup({ id: 'aim' }, 'bounds');
images.clip(img, bounds); /* bounds 是一个 AndroidRect 实例. */
```

## OmniThrowable

可抛异常聚合类型.

| 类型                                                                             | 简述                                                                                  | 示例                                                                                                                               |
|--------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| [Error](exceptions#error-对象)                                                   | <span style="white-space:nowrap">AutoJs6 内置错误类型</span>                              | <span style="white-space:nowrap">1. `Error('error')`<br/>2. `TypeError('error')`</span>                                          |
| <span style="white-space:nowrap">[java.lang.Throwable](exceptions#java)</span> | <span style="white-space:nowrap">`Throwable` 及其所有子类型</span>                         | <span style="white-space:nowrap">1. `new java.lang.Exception('error')`<br/>2. `try { a++ } catch(e) { e.rhinoException }`</span> |
| [string](dataTypes#string)                                                     | <span style="white-space:nowrap">字符串, 表示异常消息, 将被包装为 `java.lang.Exception` 实例</span> | <span style="white-space:nowrap">`'An error has occurred'`</span>                                                                |

使用 [console.printAllStackTrace](console#m-printallstacktrace) 打印详细栈追踪的示例:

```js
try {
    a++;
} catch (e) {
    console.printAllStackTrace(e); /* Error 实例. */
    console.printAllStackTrace(e.rhinoException); /* java.lang.Throwable 实例. */
    console.printAllStackTrace(e.message); /* 字符串变量. */
}
```